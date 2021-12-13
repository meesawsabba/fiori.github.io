import { and, bindingExpression, equal, Expression, not, or } from "sap/fe/core/helpers/BindingExpression";
import ConverterContext from "sap/fe/core/converters/ConverterContext";

export const UI = {
	IsCreateMode: bindingExpression("createMode", "ui") as Expression<boolean>,
	IsCreateModeSticky: bindingExpression("createModeSticky", "ui") as Expression<boolean>,
	IsEditable: bindingExpression("/isEditable", "ui") as Expression<boolean>,
	IsTransientBinding: equal(bindingExpression("@$ui5.context.isTransient"), true),
	IsTotal: equal(bindingExpression("@$ui5.node.isTotal"), true),
	IsExpanded: equal(bindingExpression("@$ui5.node.isExpanded"), true),
	NodeLevel: bindingExpression("@$ui5.node.level")
};

export const Entity = {
	HasDraft: bindingExpression("HasDraftEntity"),
	HasActive: bindingExpression("HasActiveEntity"),
	IsActive: bindingExpression("IsActiveEntity")
};

export const Draft = {
	IsNewObject: and(not(Entity.HasActive), not(Entity.IsActive)),
	HasNoDraftForCurrentUser: or(
		not(Entity.HasDraft),
		and(Entity.HasDraft, not(bindingExpression("DraftAdministrativeData/DraftIsCreatedByMe") as Expression<boolean>))
	)
};

/**
 * Function to adjust singleton paths in the annotation.
 * The absolute path via EntityContainer needs to be shortened to /SingletonName/PropertyName.
 *
 * @param {string} path The path configured in the annotation
 * @param {ConverterContext} converterContext The instance of the converter context
 * @param {string[]} visitedNavigationPaths The array of visited navigation paths
 * @returns {string} The adjusted path for the reference of the singleton property, otherwise the input path itself.
 */
export const singletonPathVisitor = function(path: string, converterContext: ConverterContext, visitedNavigationPaths: string[]): string {
	// Determine whether the path is absolute and whether it points to a singleton.
	if (path.indexOf("/") === 0) {
		const parts = path.split("/").filter(Boolean),
			propertyName = parts.pop(),
			entitySetName = parts.join("/"),
			singleton = converterContext.getSingleton(entitySetName);
		if (singleton) {
			// Set the absolute binding path to access the singleton property
			path = "/" + singleton.name + "/" + propertyName;
		}
	} else {
		// Not a singleton reference.
		// Prefix the navigation path to the property path
		const localPath = visitedNavigationPaths.concat();
		localPath.push(path);
		path = localPath.join("/");
	}
	return path;
};

/**
 * Function to adjust property paths defined in the binding of an action.
 *
 * The binding parameter name needs to be removed. Singleton paths need to be resolved.
 *
 * @param {string} path The path configured in the annotation
 * @param {ConverterContext} converterContext The instance of the converter context
 * @param {string} bindingParameterFullName The fully qualified name of the binding parameter
 * @returns {string} The adjusted property path
 */
export function bindingContextPathVisitor(path: string, converterContext: ConverterContext, bindingParameterFullName: string) {
	const bindingParameterPrefix = bindingParameterFullName?.substring(bindingParameterFullName.lastIndexOf("/") + 1) + "/";
	// Strip the binding parameter name from OperationAvailable path
	// For e.g. _it/property1 --> property1
	if (path.startsWith(bindingParameterPrefix)) {
		return path.substring(bindingParameterPrefix.length);
	}
	return singletonPathVisitor(path, converterContext, []);
}
