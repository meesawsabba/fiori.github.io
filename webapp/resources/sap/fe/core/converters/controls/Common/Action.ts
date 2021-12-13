import { Action } from "@sap-ux/vocabularies-types";
import { ActionType, ManifestAction, NavigationSettingsConfiguration, ManifestTableColumn } from "sap/fe/core/converters/ManifestSettings";
import { ConfigurableObject, CustomElement, Placement } from "sap/fe/core/converters/helpers/ConfigurableObject";
import { CustomActionID } from "sap/fe/core/converters/helpers/ID";
import { replaceSpecialChars } from "sap/fe/core/helpers/StableIdHelper";
import {
	annotationExpression,
	bindingExpression,
	BindingExpression,
	compileBinding,
	or,
	formatResult,
	isConstant,
	resolveBindingString,
	equal,
	BindingExpressionExpression,
	ifElse,
	and,
	greaterOrEqual
} from "sap/fe/core/helpers/BindingExpression";
import fpmFormatter from "sap/fe/core/formatters/FPMFormatter";
import ConverterContext from "../../ConverterContext";
import { bindingContextPathVisitor } from "sap/fe/core/converters/helpers/BindingHelper";

export enum ButtonType {
	Accept = "Accept",
	Attention = "Attention",
	Back = "Back",
	Critical = "Critical",
	Default = "Default",
	Emphasized = "Emphasized",
	Ghost = "Ghost",
	Negative = "Negative",
	Neutral = "Neutral",
	Reject = "Reject",
	Success = "Success",
	Transparent = "Transparent",
	Unstyled = "Unstyled",
	Up = "Up"
}

export type BaseAction = ConfigurableObject & {
	id?: string;
	text?: string;
	type: ActionType;
	press?: string;
	enabled?: BindingExpression<boolean>;
	visible?: BindingExpression<boolean>;
	enableOnSelect?: string;
	defaultValuesExtensionFunction?: string;
	isNavigable?: boolean;
	enableAutoScroll?: boolean;
	requiresDialog?: string;
	binding?: string;
	buttonType?: ButtonType.Ghost | ButtonType.Transparent | string;
	parentEntityDeleteEnabled?: BindingExpression<boolean>;
	menu?: (string | CustomAction | BaseAction)[];
	facetName?: string;
};

export type AnnotationAction = BaseAction & {
	type: ActionType.DataFieldForIntentBasedNavigation | ActionType.DataFieldForAction;
	annotationPath: string;
	id?: string;
	customData?: string;
};

/**
 * Definition for custom actions
 *
 * @typedef CustomAction
 */
export type CustomAction = CustomElement<
	BaseAction & {
		type: ActionType.Default | ActionType.Menu;
		handlerMethod?: string;
		handlerModule?: string;
		menu?: (string | CustomAction | BaseAction)[];
		noWrap?: boolean; // Indicates that we want to avoid the wrapping from the FPMHelper
		requiresSelection?: boolean;
	}
>;

// Reuse of ConfigurableObject and CustomElement is done for ordering
export type ConverterAction = AnnotationAction | CustomAction;

/**
 * Creates the menu action from manifest actions.
 * @param {Record<string, CustomAction>} actions The manifest definition
 * @param {BaseAction[]} aAnnotationActions The annotation actions definition
 * @param aHiddenHeaderActions
 * @returns {Record<string, CustomAction>} The actions from the manifest and the menu option that were added
 */
function prepareMenuAction(
	actions: Record<string, CustomAction>,
	aAnnotationActions: BaseAction[],
	aHiddenHeaderActions: BaseAction[]
): Record<string, CustomAction> {
	const allActions: Record<string, CustomAction> = {};
	let menuItemKeys: string[] | undefined = [];

	for (const actionKey in actions) {
		const manifestAction: CustomAction = actions[actionKey];
		if (manifestAction.type === ActionType.Menu) {
			const menuItems: (CustomAction | BaseAction)[] = [];
			let menuVisible: any = false;
			let _menuItemKeys =
				manifestAction.menu?.map((menuKey: string | CustomAction) => {
					let action: BaseAction | CustomAction | undefined = aAnnotationActions.find(
						(action: BaseAction) => action.key === menuKey
					);
					if (!action) {
						action = actions[menuKey as string];
					}

					if (
						(action?.visible ||
							action?.type === ActionType.DataFieldForAction ||
							action?.type === ActionType.DataFieldForIntentBasedNavigation) &&
						!aHiddenHeaderActions.find(hiddenAction => hiddenAction.key === menuKey)
					) {
						menuVisible = compileBinding(
							or(resolveBindingString((action as any).visible, "boolean"), resolveBindingString(menuVisible, "boolean"))
						);
						menuItems.push(action);
					}

					return menuKey as string;
				}) ?? [];

			// Show menu button if it has one or more then 1 items visible
			if (menuItems.length) {
				manifestAction.visible = menuVisible;
				manifestAction.menu = menuItems;
			} else {
				_menuItemKeys = [actionKey];
			}

			menuItemKeys = [...menuItemKeys, ..._menuItemKeys];
		}
		if (aHiddenHeaderActions.find(hiddenAction => hiddenAction.key === actionKey)) {
			manifestAction.visible = false;
		}
		allActions[actionKey] = manifestAction;
	}

	// eslint-disable-next-line no-unused-expressions
	menuItemKeys?.forEach((actionKey: string) => delete allActions[actionKey]);
	return allActions;
}

export const removeDuplicateActions = (actions: BaseAction[]): BaseAction[] => {
	const oMenuItemKeys: { [key: string]: any } = {};
	actions.forEach(action => {
		if (action?.menu?.length) {
			action.menu.reduce((item, { key }: any) => {
				if (key && !item[key]) {
					item[key] = true;
				}
				return item;
			}, oMenuItemKeys);
		}
	});
	return actions.filter(action => !oMenuItemKeys[action.key]);
};

/**
 * Retrieves an action default value based on its kind.
 *
 * Default property value for custom actions if not overwritten in manifest.
 * @param {ManifestAction} manifestAction The action configured in the manifest
 * @param {boolean} isAnnotationAction Whether the action, defined in manifest, corresponds to an existing annotation action.
 * @param converterContext
 * @returns {BindingExpression<string> | string | boolean} Determined property value for the column
 */
const _getManifestEnabled = function(
	manifestAction: ManifestAction,
	isAnnotationAction: boolean,
	converterContext: ConverterContext
): BindingExpression<string> | string | boolean {
	if (isAnnotationAction && manifestAction.enabled === undefined) {
		// If annotation action has no property defined in manifest,
		// do not overwrite it with manifest action's default value.
		return undefined;
	}
	// Return what is defined in manifest.
	return getManifestActionEnablement(manifestAction, converterContext);
};

/**
 * Creates the action configuration based on the manifest settings.
 * @param {Record<string, ManifestAction> | undefined} manifestActions The manifest actions
 * @param converterContext The converter context
 * @param {BaseAction[]} aAnnotationActions The annotation actions definition
 * @param {NavigationSettingsConfiguration} navigationSettings The navigation settings
 * @param {boolean} considerNavigationSettings The navigation settings to be considered
 * @param {BaseAction[]} aHiddenHeaderActions The hidden header actions
 * @param {string} facetName The facet where an action is displayed if it is inline
 * @returns {Record<string, CustomAction>} The actions from the manifest
 */
export function getActionsFromManifest(
	manifestActions: Record<string, ManifestAction> | undefined,
	converterContext: ConverterContext,
	aAnnotationActions?: BaseAction[],
	navigationSettings?: NavigationSettingsConfiguration,
	considerNavigationSettings?: boolean,
	aHiddenHeaderActions?: BaseAction[],
	facetName?: string
): Record<string, CustomAction> {
	const actions: Record<string, CustomAction> = {};
	for (const actionKey in manifestActions) {
		const manifestAction: ManifestAction = manifestActions[actionKey];
		const lastDotIndex = manifestAction.press?.lastIndexOf(".") || -1;

		// To identify the annotation action property overwrite via manifest use-case.
		const isAnnotationAction = aAnnotationActions?.some(action => action.key === actionKey) || false;
		if (manifestAction.facetName) {
			facetName = manifestAction.facetName;
		}

		actions[actionKey] = {
			id: aAnnotationActions?.some(action => action.key === actionKey) ? actionKey : CustomActionID(actionKey),
			visible: manifestAction.visible === undefined ? "true" : manifestAction.visible,
			enabled: _getManifestEnabled(manifestAction, isAnnotationAction, converterContext),
			handlerModule: manifestAction.press && manifestAction.press.substring(0, lastDotIndex).replace(/\./gi, "/"),
			handlerMethod: manifestAction.press && manifestAction.press.substring(lastDotIndex + 1),
			press: manifestAction.press,
			type: manifestAction.menu ? ActionType.Menu : ActionType.Default,
			text: manifestAction.text,
			noWrap: manifestAction.__noWrap,
			key: replaceSpecialChars(actionKey),
			enableOnSelect: manifestAction.enableOnSelect,
			defaultValuesExtensionFunction: manifestAction.defaultValuesFunction,
			position: {
				anchor: manifestAction.position?.anchor,
				placement: manifestAction.position === undefined ? Placement.After : manifestAction.position.placement
			},
			isNavigable: isActionNavigable(manifestAction, navigationSettings, considerNavigationSettings),
			requiresSelection: manifestAction.requiresSelection === undefined ? false : manifestAction.requiresSelection,
			enableAutoScroll: enableAutoScroll(manifestAction),
			menu: manifestAction.menu ?? [],
			facetName: manifestAction.inline ? facetName : undefined
		};
	}
	return prepareMenuAction(actions, aAnnotationActions ?? [], aHiddenHeaderActions ?? []);
}

function getManifestActionEnablement(manifestAction: ManifestAction, converterContext: ConverterContext) {
	const resolvedBinding = resolveBindingString(manifestAction.enabled as string, "boolean");
	let result: any;
	if (isConstant(resolvedBinding) && resolvedBinding.value === undefined) {
		// No enabled property configured in manifest for the custom action --> enable custom action
		result = true;
	} else if (isConstant(resolvedBinding) && typeof resolvedBinding.value === "boolean") {
		// true / false
		result = resolvedBinding.value;
	} else if (resolvedBinding._type !== "EmbeddedBinding" && resolvedBinding._type !== "EmbeddedExpressionBinding") {
		// Then it's a module-method reference "sap.xxx.yyy.doSomething"
		const methodPath = resolvedBinding.value as string;
		result = formatResult(
			[bindingExpression("/", "$view"), methodPath, bindingExpression("selectedContexts", "internal")],
			fpmFormatter.customIsEnabledCheck as any,
			converterContext.getEntityType()
		);
	} else {
		// then it's a binding
		result = resolvedBinding;
	}

	// Consider requiresSelection property to include selectedContexts in the binding expression
	return compileBinding(
		ifElse(
			manifestAction.requiresSelection === true,
			and(greaterOrEqual(bindingExpression("numberOfSelectedContexts", "internal"), 1), result),
			result
		)
	);
}

/**
 * Method to determine the value of the 'enabled' property of an annotation-based action.
 *
 * @param {ConverterContext} converterContext The instance of the converter context
 * @param {Action} actionTarget The instance of the action
 * @returns {BindingExpression<boolean>} The binding expression for the 'enabled' property of the action button.
 */
export function getEnabledForAnnotationAction(
	converterContext: ConverterContext,
	actionTarget: Action | undefined
): BindingExpression<boolean> {
	if (actionTarget?.isBound !== true) {
		return true;
	}
	/*
	   FIXME Disable failing music tests
		Currently on CAP the following binding (which is the good one) generates error:
	if (actionTarget?.annotations.Core?.OperationAvailable === null) {
		const unboundActionName = actionTarget.fullyQualifiedName.split("(")[0];
		return "{= !${#" + unboundActionName + "} ? false : true } }";
	}
		CAP tries to read the action as property and doesn't find it
	*/
	if (actionTarget?.parameters?.length) {
		const bindingParameterFullName = actionTarget?.parameters[0].fullyQualifiedName,
			operationAvailableExpression = annotationExpression(
				actionTarget?.annotations.Core?.OperationAvailable,
				[],
				undefined,
				(path: string) => bindingContextPathVisitor(path, converterContext, bindingParameterFullName)
			) as BindingExpressionExpression<boolean>;
		if (actionTarget?.annotations.Core?.OperationAvailable !== undefined) {
			return compileBinding(equal(operationAvailableExpression, true));
		}
	}
	return true;
}

export function getSemanticObjectMapping(aMappings: any[]): any[] {
	const aSemanticObjectMappings: any[] = [];
	aMappings.forEach(oMapping => {
		const oSOMapping = {
			"LocalProperty": {
				"$PropertyPath": oMapping.LocalProperty.value
			},
			"SemanticObjectProperty": oMapping.SemanticObjectProperty
		};
		aSemanticObjectMappings.push(oSOMapping);
	});
	return aSemanticObjectMappings;
}

export function isActionNavigable(
	action: ManifestAction | ManifestTableColumn,
	navigationSettings?: NavigationSettingsConfiguration,
	considerNavigationSettings?: boolean
): boolean {
	let bIsNavigationConfigured: boolean = true;
	if (considerNavigationSettings) {
		const detailOrDisplay = navigationSettings && (navigationSettings.detail || navigationSettings.display);
		bIsNavigationConfigured = detailOrDisplay?.route ? true : false;
	}
	// when enableAutoScroll is true the navigateToInstance feature is disabled
	if (
		(action &&
			action.afterExecution &&
			(action.afterExecution?.navigateToInstance === false || action.afterExecution?.enableAutoScroll === true)) ||
		!bIsNavigationConfigured
	) {
		return false;
	}
	return true;
}

export function enableAutoScroll(action: ManifestAction): boolean {
	return action?.afterExecution?.enableAutoScroll === true;
}
