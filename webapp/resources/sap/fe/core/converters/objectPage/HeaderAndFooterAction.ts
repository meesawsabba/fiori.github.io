import { ActionType } from "../ManifestSettings";
import { EntityType } from "@sap-ux/annotation-converter";
import {
	AnnotationAction,
	BaseAction,
	ButtonType,
	getEnabledForAnnotationAction,
	getSemanticObjectMapping
} from "sap/fe/core/converters/controls/Common/Action";
import { DataFieldForActionTypes, DataFieldForIntentBasedNavigationTypes, PropertyAnnotationValue } from "@sap-ux/vocabularies-types";
import { Placement } from "sap/fe/core/converters/helpers/ConfigurableObject";
import {
	annotationExpression,
	compileBinding,
	not,
	equal,
	fn,
	Expression,
	and,
	ifElse,
	BindingExpression,
	constant
} from "sap/fe/core/helpers/BindingExpression";
import { KeyHelper } from "sap/fe/core/converters/helpers/Key";
import { isPathDeletable } from "sap/fe/core/templating/DataModelPathHelper";
import ConverterContext from "../ConverterContext";
import { Draft, singletonPathVisitor, UI } from "../helpers/BindingHelper";

/**
 * Retrieves all the data field for actions for the identification annotation
 * They must be
 * - Not statically hidden
 * - Either linked to an Unbound action or to an action which has an OperationAvailable that is not set to false statically.
 *
 * @param {EntityType} entityType The current entity type
 * @param {boolean} bDetermining The flag which denotes whether or not the action is a determining action
 * @returns {DataFieldForActionTypes[]} An array of DataField for action respecting the input parameter 'bDetermining'
 */
export function getIdentificationDataFieldForActions(entityType: EntityType, bDetermining: boolean): DataFieldForActionTypes[] {
	return (entityType.annotations?.UI?.Identification?.filter(identificationDataField => {
		if (identificationDataField?.annotations?.UI?.Hidden?.valueOf() !== true) {
			if (
				identificationDataField?.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" &&
				!!identificationDataField.Determining === bDetermining &&
				(!identificationDataField?.ActionTarget?.isBound ||
					identificationDataField?.ActionTarget?.annotations?.Core?.OperationAvailable?.valueOf() !== false)
			) {
				return true;
			}
		}
		return false;
	}) || []) as DataFieldForActionTypes[];
}

/**
 * Retrieve all the IBN actions for the identification annotation.
 * They must be
 * - Not statically hidden.
 * @param {EntityType} entityType The current entitytype
 * @param {boolean} bDetermining Whether or not the action should be determining
 * @returns {DataFieldForIntentBasedNavigationTypes[]} An array of datafield for action respecting the bDetermining property.
 */
function getIdentificationDataFieldForIBNActions(entityType: EntityType, bDetermining: boolean): DataFieldForIntentBasedNavigationTypes[] {
	return (entityType.annotations?.UI?.Identification?.filter(identificationDataField => {
		if (identificationDataField?.annotations?.UI?.Hidden?.valueOf() !== true) {
			if (
				identificationDataField?.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" &&
				!!identificationDataField.Determining === bDetermining
			) {
				return true;
			}
		}

		return false;
	}) || []) as DataFieldForIntentBasedNavigationTypes[];
}

const IMPORTANT_CRITICALITIES = [
	"UI.CriticalityType/VeryPositive",
	"UI.CriticalityType/Positive",
	"UI.CriticalityType/Negative",
	"UI.CriticalityType/VeryNegative"
];

/**
 * Method to determine the 'visible' property binding for the Delete button on an object page.
 *
 * @param {ConverterContext} converterContext Instance of the converter context.
 * @param {PropertyAnnotationValue<boolean> | undefined} deleteHidden The value of the UI.DeleteHidden annotation on the entity set / type.
 * @returns {Expression<boolean>} The binding expression for the 'visible' property of the Delete button.
 */
export function getDeleteButtonVisibility(
	converterContext: ConverterContext,
	deleteHidden: PropertyAnnotationValue<boolean> | undefined
): Expression<boolean> {
	const dataModelObjectPath = converterContext.getDataModelObjectPath(),
		visitedNavigationPaths = dataModelObjectPath.navigationProperties.map(navProp => navProp.name),
		// Set absolute binding path for Singleton references, otherwise the configured annotation path itself.
		// For e.g. /com.sap.namespace.EntityContainer/Singleton/Property to /Singleton/Property
		deleteHiddenExpression: Expression<boolean | undefined> = annotationExpression(
			deleteHidden,
			visitedNavigationPaths,
			undefined,
			(path: string) => singletonPathVisitor(path, converterContext, [])
		),
		manifestWrapper = converterContext.getManifestWrapper(),
		viewLevel = manifestWrapper.getViewLevel(),
		// Delete button is visible
		// In OP 		-->  when not in edit mode
		// In sub-OP 	-->  when in edit mode
		editableExpression: Expression<boolean> = viewLevel > 1 ? UI.IsEditable : not(UI.IsEditable);

	// If UI.DeleteHidden annotation on entity set or type is either not defined or explicitly set to false,
	// Delete button is visible based on editableExpression.
	// else,
	// Delete button is visible based on both annotation path and editableExpression.
	return ifElse(
		deleteHidden === undefined || deleteHidden.valueOf() === false,
		editableExpression,
		and(editableExpression, equal(deleteHiddenExpression, false))
	);
}

/**
 * Method to determine the 'enabled' property binding for the Delete button on an object page.
 *
 * @param {PropertyAnnotationValue<boolean>|undefined} isDeletable The delete restriction configured
 * @param {Expression<boolean>} isParentDeletable The delete restriction configured on the parent entity
 * @returns {Expression<boolean>} The binding expression for the 'enabled' property of the Delete button
 */
export function getDeleteButtonEnabled(
	isDeletable: PropertyAnnotationValue<Boolean> | undefined,
	isParentDeletable: Expression<boolean>
): Expression<boolean> {
	return ifElse(
		isParentDeletable !== undefined,
		isParentDeletable,
		ifElse(isDeletable !== undefined, equal(isDeletable, true), constant(true))
	);
}

/**
 * Method to determine the 'visible' property binding for the Edit button on an object page.
 *
 * @param {ConverterContext} converterContext Instance of the converter context.
 * @param {PropertyAnnotationValue<boolean> | undefined} updateHidden The value of the UI.UpdateHidden annotation on the entity set / type.
 * @returns {Expression<boolean>} The binding expression for the 'visible' property of the Edit button.
 */
export function getEditButtonVisibility(
	converterContext: ConverterContext,
	updateHidden: PropertyAnnotationValue<boolean> | undefined
): Expression<boolean> {
	const entitySet = converterContext.getEntitySet(),
		bIsDraftRoot = entitySet && entitySet.annotations.Common?.DraftRoot ? true : false,
		dataModelObjectPath = converterContext.getDataModelObjectPath(),
		visitedNavigationPaths = dataModelObjectPath.navigationProperties.map(navProp => navProp.name),
		// Set absolute binding path for Singleton references, otherwise the configured annotation path itself.
		// For e.g. /com.sap.namespace.EntityContainer/Singleton/Property to /Singleton/Property
		updateHiddenExpression: Expression<boolean | undefined> = annotationExpression(
			updateHidden,
			visitedNavigationPaths,
			undefined,
			(path: string) => singletonPathVisitor(path, converterContext, visitedNavigationPaths)
		),
		notEditableExpression: Expression<boolean> = not(UI.IsEditable);

	// If UI.UpdateHidden annotation on entity set or type is either not defined or explicitly set to false,
	// Edit button is visible in display mode.
	// else,
	// Edit button is visible based on both annotation path and in display mode.
	const resultantExpression: Expression<boolean> = ifElse(
		updateHidden === undefined || updateHidden.valueOf() === false,
		notEditableExpression,
		and(notEditableExpression, equal(updateHiddenExpression, false))
	);
	return ifElse(bIsDraftRoot, and(resultantExpression, Draft.HasNoDraftForCurrentUser), resultantExpression);
}

/**
 * Method to determine the 'enabled' property binding for the Edit button on an object page.
 *
 * @param {ConverterContext} converterContext Instance of the converter context.
 * @returns {Expression<boolean>} The binding expression for the 'enabled' property of the Edit button.
 */
export function getEditButtonEnabled(converterContext: ConverterContext): BindingExpression<boolean> {
	const entitySet = converterContext.getEntitySet(),
		isDraftRoot = entitySet && entitySet.annotations.Common?.DraftRoot ? true : false,
		isSticky = entitySet && entitySet.annotations.Session?.StickySessionSupported ? true : false;

	let editActionName: string | undefined;
	if (isDraftRoot) {
		editActionName = entitySet?.annotations.Common?.DraftRoot?.EditAction as string;
	} else if (isSticky) {
		editActionName = entitySet?.annotations.Session?.StickySessionSupported?.EditAction as string;
	}
	if (editActionName) {
		const editActionAnnotationPath = converterContext.getAbsoluteAnnotationPath(editActionName as string),
			editActions = (converterContext.getEntityTypeAnnotation(editActionAnnotationPath)?.annotation as any)?.actions;
		if (editActions?.length) {
			const editAction = editActions[0];
			if (editAction?.annotations?.Core?.OperationAvailable === null) {
				return "{= ${#" + editActionName + "} ? true : false }";
			} else {
				return getEnabledForAnnotationAction(converterContext, editAction);
			}
		}
	}
	return true;
}

export function getHeaderDefaultActions(converterContext: ConverterContext): BaseAction[] {
	const entitySet = converterContext.getEntitySet(),
		entityType = converterContext.getEntityType(),
		oStickySessionSupported = entitySet && entitySet.annotations?.Session?.StickySessionSupported, //for sticky app
		oDraftRoot = entitySet && entitySet.annotations.Common?.DraftRoot,
		oEntityDeleteRestrictions = entitySet && entitySet.annotations?.Capabilities?.DeleteRestrictions,
		bUpdateHidden = entitySet && entitySet.annotations.UI?.UpdateHidden?.valueOf(),
		dataModelObjectPath = converterContext.getDataModelObjectPath(),
		isParentDeletable = isPathDeletable(dataModelObjectPath),
		bParentEntitySetDeletable = isParentDeletable ? compileBinding(isParentDeletable) : isParentDeletable,
		headerDataFieldForActions = getIdentificationDataFieldForActions(converterContext.getEntityType(), false);

	// First add the "Critical" DataFieldForActions
	const headerActions: BaseAction[] = headerDataFieldForActions
		.filter(dataField => {
			return IMPORTANT_CRITICALITIES.indexOf(dataField?.Criticality as string) > -1;
		})
		.map(dataField => {
			return {
				type: ActionType.DataFieldForAction,
				annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
				key: KeyHelper.generateKeyFromDataField(dataField),
				visible: compileBinding(not(equal(annotationExpression(dataField.annotations?.UI?.Hidden), true))),
				enabled: getEnabledForAnnotationAction(converterContext, dataField.ActionTarget),
				isNavigable: true
			};
		});

	// Then the edit action if it exists
	if ((oDraftRoot?.EditAction || oStickySessionSupported?.EditAction) && bUpdateHidden !== true) {
		const updateHidden = (entitySet?.annotations.UI?.UpdateHidden?.valueOf() !== undefined
			? entitySet?.annotations.UI?.UpdateHidden
			: entityType?.annotations.UI?.UpdateHidden) as PropertyAnnotationValue<boolean>;
		headerActions.push({
			type: ActionType.Primary,
			key: "EditAction",
			visible: compileBinding(getEditButtonVisibility(converterContext, updateHidden)),
			enabled: getEditButtonEnabled(converterContext)
		});
	}
	// Then the delete action if we're not statically not deletable
	if (
		(bParentEntitySetDeletable && bParentEntitySetDeletable !== "false") ||
		(oEntityDeleteRestrictions?.Deletable?.valueOf() !== false && bParentEntitySetDeletable !== "false")
	) {
		const deleteHidden = (entitySet?.annotations.UI?.DeleteHidden?.valueOf() !== undefined
			? entitySet?.annotations.UI?.DeleteHidden
			: entityType?.annotations.UI?.DeleteHidden) as PropertyAnnotationValue<boolean>;
		headerActions.push({
			type: ActionType.Secondary,
			key: "DeleteAction",
			visible: compileBinding(getDeleteButtonVisibility(converterContext, deleteHidden)),
			enabled: compileBinding(getDeleteButtonEnabled(oEntityDeleteRestrictions?.Deletable, isParentDeletable)),
			parentEntityDeleteEnabled: bParentEntitySetDeletable
		});
	}

	if (oDraftRoot?.EditAction && bUpdateHidden !== true) {
		headerActions.push({ type: ActionType.SwitchToActiveObject, key: "SwitchToActiveObject" });
		headerActions.push({ type: ActionType.SwitchToDraftObject, key: "SwitchToDraftObject" });
	}

	const headerDataFieldForIBNActions = getIdentificationDataFieldForIBNActions(converterContext.getEntityType(), false);

	headerDataFieldForIBNActions
		.filter(dataField => {
			return IMPORTANT_CRITICALITIES.indexOf(dataField?.Criticality as string) === -1;
		})
		.map(dataField => {
			const oNavigationParams = {
				semanticObjectMapping: dataField.Mapping ? getSemanticObjectMapping(dataField.Mapping) : []
			};

			if (dataField.RequiresContext?.valueOf() === true) {
				throw new Error("RequiresContext property should not be true for header IBN action : " + dataField.Label);
			} else if (dataField.Inline?.valueOf() === true) {
				throw new Error("Inline property should not be true for header IBN action : " + dataField.Label);
			}
			headerActions.push({
				type: ActionType.DataFieldForIntentBasedNavigation,
				text: dataField.Label?.toString(),
				annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
				buttonType: ButtonType.Ghost,
				visible: compileBinding(not(equal(annotationExpression(dataField.annotations?.UI?.Hidden?.valueOf()), true))),
				enabled:
					dataField.NavigationAvailable !== undefined
						? compileBinding(equal(annotationExpression(dataField.NavigationAvailable?.valueOf()), true))
						: true,
				key: KeyHelper.generateKeyFromDataField(dataField),
				isNavigable: true,
				press: compileBinding(
					fn("._intentBasedNavigation.navigate", [
						annotationExpression(dataField.SemanticObject),
						annotationExpression(dataField.Action),
						oNavigationParams
					])
				),
				customData: compileBinding({
					semanticObject: annotationExpression(dataField.SemanticObject),
					action: annotationExpression(dataField.Action)
				})
			} as AnnotationAction);
		});
	// Finally the non critical DataFieldForActions
	headerDataFieldForActions
		.filter(dataField => {
			return IMPORTANT_CRITICALITIES.indexOf(dataField?.Criticality as string) === -1;
		})
		.map(dataField => {
			headerActions.push({
				type: ActionType.DataFieldForAction,
				annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
				key: KeyHelper.generateKeyFromDataField(dataField),
				visible: compileBinding(not(equal(annotationExpression(dataField.annotations?.UI?.Hidden), true))),
				enabled: getEnabledForAnnotationAction(converterContext, dataField.ActionTarget),
				isNavigable: true
			} as AnnotationAction);
		});

	return headerActions;
}

export function getHiddenHeaderActions(converterContext: ConverterContext): BaseAction[] {
	const entityType = converterContext.getEntityType();
	const hiddenActions = (entityType.annotations?.UI?.Identification?.filter(identificationDataField => {
		return identificationDataField?.annotations?.UI?.Hidden?.valueOf() === true;
	}) || []) as DataFieldForActionTypes[];
	return hiddenActions.map(dataField => {
		return {
			type: ActionType.Default,
			key: KeyHelper.generateKeyFromDataField(dataField)
		};
	});
}

export function getFooterDefaultActions(viewLevel: number, converterContext: ConverterContext): BaseAction[] {
	const entitySet = converterContext.getEntitySet();
	const entityType = converterContext.getEntityType();
	const oStickySessionSupported = entitySet && entitySet.annotations?.Session?.StickySessionSupported, //for sticky app
		sEntitySetDraftRoot =
			entitySet && (entitySet.annotations.Common?.DraftRoot?.term || entitySet.annotations?.Session?.StickySessionSupported?.term),
		bConditionSave =
			sEntitySetDraftRoot === "com.sap.vocabularies.Common.v1.DraftRoot" ||
			(oStickySessionSupported && oStickySessionSupported?.SaveAction),
		bConditionApply = viewLevel > 1,
		bConditionCancel =
			sEntitySetDraftRoot === "com.sap.vocabularies.Common.v1.DraftRoot" ||
			(oStickySessionSupported && oStickySessionSupported?.DiscardAction);

	// Retrieve all determining actions
	const footerDataFieldForActions = getIdentificationDataFieldForActions(converterContext.getEntityType(), true);

	// First add the "Critical" DataFieldForActions
	const footerActions: BaseAction[] = footerDataFieldForActions
		.filter(dataField => {
			return IMPORTANT_CRITICALITIES.indexOf(dataField?.Criticality as string) > -1;
		})
		.map(dataField => {
			return {
				type: ActionType.DataFieldForAction,
				annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
				key: KeyHelper.generateKeyFromDataField(dataField),
				visible: compileBinding(not(equal(annotationExpression(dataField.annotations?.UI?.Hidden), true))),
				enabled: getEnabledForAnnotationAction(converterContext, dataField.ActionTarget),
				isNavigable: true
			};
		});

	// Then the save action if it exists
	if (entitySet?.entityTypeName === entityType?.fullyQualifiedName && bConditionSave) {
		footerActions.push({ type: ActionType.Primary, key: "SaveAction" });
	}

	// Then the apply action if it exists
	if (bConditionApply) {
		footerActions.push({ type: ActionType.DefaultApply, key: "ApplyAction" });
	}

	// Then the non critical DataFieldForActions
	footerDataFieldForActions
		.filter(dataField => {
			return IMPORTANT_CRITICALITIES.indexOf(dataField?.Criticality as string) === -1;
		})
		.map(dataField => {
			footerActions.push({
				type: ActionType.DataFieldForAction,
				annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
				key: KeyHelper.generateKeyFromDataField(dataField),
				visible: compileBinding(not(equal(annotationExpression(dataField.annotations?.UI?.Hidden), true))),
				enabled: getEnabledForAnnotationAction(converterContext, dataField.ActionTarget),
				isNavigable: true
			} as AnnotationAction);
		});

	// Then the cancel action if it exists
	if (bConditionCancel) {
		footerActions.push({
			type: ActionType.Secondary,
			key: "CancelAction",
			position: { placement: Placement.End }
		});
	}
	return footerActions;
}
