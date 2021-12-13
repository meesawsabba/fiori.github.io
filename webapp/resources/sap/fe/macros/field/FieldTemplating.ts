import { getDisplayMode, PropertyOrPath, DisplayMode } from "sap/fe/core/templating/UIFormatters";
import { getBindingWithUnitOrCurrency, formatWithTypeInformation } from "sap/fe/core/templating/UIFormatters";
import {
	DataModelObjectPath,
	enhanceDataModelPath,
	getPathRelativeLocation,
	getContextRelativeTargetObjectPath
} from "sap/fe/core/templating/DataModelPathHelper";
import { Property } from "@sap-ux/annotation-converter";
import { UI } from "sap/fe/core/converters/helpers/BindingHelper";
import {
	Expression,
	annotationExpression,
	formatResult,
	transformRecursively,
	BindingExpressionExpression,
	BindingExpression,
	compileBinding,
	constant,
	bindingExpression,
	and,
	or,
	ifElse,
	equal,
	not,
	ComplexTypeExpression
} from "sap/fe/core/helpers/BindingExpression";
import {
	isPathExpression,
	getAssociatedUnitProperty,
	getAssociatedCurrencyProperty,
	isProperty,
	getAssociatedUnitPropertyPath,
	getAssociatedCurrencyPropertyPath,
	hasValueHelp,
	getAssociatedTextPropertyPath
} from "sap/fe/core/templating/PropertyHelper";
import valueFormatters from "sap/fe/core/formatters/ValueFormatter";
import * as PropertyHelper from "sap/fe/core/templating/PropertyHelper";
import { isReadOnlyExpression } from "sap/fe/core/templating/FieldControlHelper";
import { DataFieldAbstractTypes, DataFieldWithUrl, DataPointTypeTypes, UIAnnotationTypes } from "@sap-ux/vocabularies-types";

export type FieldFormatOptions = Partial<{
	valueFormat: String;
	textAlignMode: String;
	displayMode: DisplayMode;
	measureDisplayMode: String;
	textLinesEdit: String;
	textMaxLines: String;
	showEmptyIndicator: boolean;
	semanticKeyStyle: String;
	showIconUrl: boolean;
	isAnalytics: boolean;
	hasDraftIndicator: boolean;
	semantickeys: string[];
}>;

export type EditStyle =
	| "InputWithValueHelp"
	| "TextArea"
	| "File"
	| "DatePicker"
	| "TimePicker"
	| "DateTimePicker"
	| "CheckBox"
	| "InputWithUnit"
	| "Input"
	| "RatingIndicator";

export type DisplayStyle =
	| "Text"
	| "Avatar"
	| "File"
	| "DataPoint"
	| "Contact"
	| "Button"
	| "Link"
	| "ObjectStatus"
	| "AmountWithCurrency"
	| "SemanticKeyWithDraftIndicator"
	| "ObjectIdentifier"
	| "LabelSemanticKey"
	| "LinkWithQuickViewForm"
	| "LinkWrapper"
	| "ExpandableText";

/**
 * Recursively add the text arrangement to a binding expression.
 *
 * @param bindingExpression The binding expression to be enhanced
 * @param fullContextPath The current context path we're on (to properly resolve the text arrangement properties)
 * @returns An updated expression containing the text arrangement binding.
 */
export const addTextArrangementToBindingExpression = function(
	bindingExpression: Expression<any>,
	fullContextPath: DataModelObjectPath
): Expression<any> {
	return transformRecursively(bindingExpression, "Binding", (expression: BindingExpressionExpression<any>) => {
		let outExpression: Expression<any> = expression;
		if (expression.modelName === undefined) {
			// In case of default model we then need to resolve the text arrangement property
			const oPropertyDataModelPath = enhanceDataModelPath(fullContextPath, expression.path);
			outExpression = getBindingWithTextArrangement(oPropertyDataModelPath, expression);
		}
		return outExpression;
	});
};

export const getBindingWithTextArrangement = function(
	oPropertyDataModelPath: DataModelObjectPath,
	propertyBindingExpression: Expression<string>,
	fieldFormatOptions?: FieldFormatOptions
): Expression<string> {
	const targetDisplayModeOverride = fieldFormatOptions?.displayMode;
	let outExpression = propertyBindingExpression;
	const oPropertyDefinition =
		oPropertyDataModelPath.targetObject.type === "PropertyPath"
			? (oPropertyDataModelPath.targetObject.$target as Property)
			: (oPropertyDataModelPath.targetObject as Property);
	const targetDisplayMode = targetDisplayModeOverride || getDisplayMode(oPropertyDefinition, oPropertyDataModelPath);
	const commonText = oPropertyDefinition.annotations?.Common?.Text;
	const relativeLocation = getPathRelativeLocation(
		oPropertyDataModelPath.contextLocation,
		oPropertyDataModelPath.navigationProperties
	).map(np => np.name);
	propertyBindingExpression = formatWithTypeInformation(oPropertyDefinition, propertyBindingExpression);
	if (targetDisplayMode !== "Value" && commonText) {
		switch (targetDisplayMode) {
			case "Description":
				outExpression = annotationExpression(commonText, relativeLocation) as Expression<string>;
				break;
			case "DescriptionValue":
				outExpression = formatResult(
					[annotationExpression(commonText, relativeLocation) as Expression<string>, propertyBindingExpression],
					valueFormatters.formatWithBrackets
				);
				break;
			case "ValueDescription":
				outExpression = formatResult(
					[propertyBindingExpression, annotationExpression(commonText, relativeLocation) as Expression<string>],
					valueFormatters.formatWithBrackets
				);
				break;
		}
	}
	return outExpression;
};

export const formatValueRecursively = function(bindingExpression: Expression<any>, fullContextPath: DataModelObjectPath): Expression<any> {
	return transformRecursively(bindingExpression, "Binding", (expression: BindingExpressionExpression<any>) => {
		let outExpression: Expression<any> = expression;
		if (expression.modelName === undefined) {
			// In case of default model we then need to resolve the text arrangement property
			const oPropertyDataModelPath = enhanceDataModelPath(fullContextPath, expression.path);
			outExpression = formatWithTypeInformation(oPropertyDataModelPath.targetObject, expression);
		}
		return outExpression;
	});
};

export const getTextBinding = function(
	oPropertyDataModelObjectPath: DataModelObjectPath,
	fieldFormatOptions: FieldFormatOptions,
	asObject: boolean = false
): Expression<string> | BindingExpression<string> {
	if (
		oPropertyDataModelObjectPath.targetObject?.$Type === "com.sap.vocabularies.UI.v1.DataField" ||
		oPropertyDataModelObjectPath.targetObject?.$Type === "com.sap.vocabularies.UI.v1.DataPointType" ||
		oPropertyDataModelObjectPath.targetObject?.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath" ||
		oPropertyDataModelObjectPath.targetObject?.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithUrl"
	) {
		// If there is no resolved property, the value is returned as a constant
		const fieldValue = oPropertyDataModelObjectPath.targetObject.Value || "";
		return compileBinding(constant(fieldValue));
	}
	if (isPathExpression(oPropertyDataModelObjectPath.targetObject) && oPropertyDataModelObjectPath.targetObject.$target) {
		const oNavPath = oPropertyDataModelObjectPath.targetEntityType.resolvePath(oPropertyDataModelObjectPath.targetObject.path, true);
		oPropertyDataModelObjectPath.targetObject = oNavPath.target;
		oNavPath.visitedObjects.forEach((oNavObj: any) => {
			if (oNavObj?._type === "NavigationProperty") {
				oPropertyDataModelObjectPath.navigationProperties.push(oNavObj);
			}
		});
	}
	const oBindingExpression = bindingExpression(getContextRelativeTargetObjectPath(oPropertyDataModelObjectPath));
	let oTargetBinding;
	if (
		oPropertyDataModelObjectPath.targetObject?.annotations?.Measures?.Unit ||
		oPropertyDataModelObjectPath.targetObject?.annotations?.Measures?.ISOCurrency
	) {
		oTargetBinding = getBindingWithUnitOrCurrency(oPropertyDataModelObjectPath, oBindingExpression);
		if (fieldFormatOptions?.measureDisplayMode === "Hidden") {
			// TODO: Refactor once types are less generic here
			(oTargetBinding as ComplexTypeExpression<String>).formatOptions = {
				...(oTargetBinding as ComplexTypeExpression<String>).formatOptions,
				showMeasure: false
			};
		}
	} else {
		oTargetBinding = getBindingWithTextArrangement(oPropertyDataModelObjectPath, oBindingExpression, fieldFormatOptions);
	}
	if (asObject) {
		return oTargetBinding;
	}
	// We don't include $$nopatch and parseKeepEmptyString as they make no sense in the text binding case
	return compileBinding(oTargetBinding);
};

export const getValueBinding = function(
	oPropertyDataModelObjectPath: DataModelObjectPath,
	fieldFormatOptions: FieldFormatOptions,
	ignoreUnit: boolean = false,
	ignoreFormatting: boolean = false,
	bindingParameters?: object,
	targetTypeAny?: boolean,
	showMeasureOnly: boolean = false
): BindingExpression<string> {
	if (isPathExpression(oPropertyDataModelObjectPath.targetObject) && oPropertyDataModelObjectPath.targetObject.$target) {
		const oNavPath = oPropertyDataModelObjectPath.targetEntityType.resolvePath(oPropertyDataModelObjectPath.targetObject.path, true);
		oPropertyDataModelObjectPath.targetObject = oNavPath.target;
		oNavPath.visitedObjects.forEach((oNavObj: any) => {
			if (oNavObj && oNavObj._type === "NavigationProperty") {
				oPropertyDataModelObjectPath.navigationProperties.push(oNavObj);
			}
		});
	}

	const targetObject = oPropertyDataModelObjectPath.targetObject;
	if (isProperty(targetObject)) {
		let oBindingExpression: BindingExpressionExpression<string> = bindingExpression(
			getContextRelativeTargetObjectPath(oPropertyDataModelObjectPath)
		) as BindingExpressionExpression<string>;
		if (targetObject.annotations?.Communication?.IsEmailAddress) {
			oBindingExpression.type = "sap.fe.core.type.Email";
		} else {
			const oPropertyUnit = getAssociatedUnitProperty(oPropertyDataModelObjectPath.targetObject);
			const oPropertyCurrency = getAssociatedCurrencyProperty(oPropertyDataModelObjectPath.targetObject);
			if (!ignoreUnit && (oPropertyUnit || oPropertyCurrency)) {
				oBindingExpression = getBindingWithUnitOrCurrency(oPropertyDataModelObjectPath, oBindingExpression) as any;
				if (
					(oPropertyUnit && !hasValueHelp(oPropertyUnit)) ||
					(oPropertyCurrency && !hasValueHelp(oPropertyCurrency)) ||
					fieldFormatOptions?.measureDisplayMode === "Hidden"
				) {
					// If there is a unit or currency without a value help, or in case the currency should be explicitly hidden,
					// we need to configure the binding to not show the measure, otherwise it's needed for the mdc field
					if (!oBindingExpression.formatOptions) {
						oBindingExpression.formatOptions = {};
					}
					if (showMeasureOnly) {
						oBindingExpression.formatOptions.showNumber = false;
					} else {
						oBindingExpression.formatOptions.showMeasure = false;
					}
				}
			} else {
				oBindingExpression = formatWithTypeInformation(targetObject, oBindingExpression) as BindingExpressionExpression<string>;
				if (oBindingExpression.type === "sap.ui.model.odata.type.String") {
					oBindingExpression.formatOptions = {
						parseKeepsEmptyString: true
					};
				}
			}
		}
		if (ignoreFormatting) {
			delete oBindingExpression.formatOptions;
			delete oBindingExpression.constraints;
			delete oBindingExpression.type;
		}
		if (bindingParameters) {
			oBindingExpression.parameters = bindingParameters;
		}
		if (targetTypeAny) {
			oBindingExpression.targetType = "any";
		}
		return compileBinding(oBindingExpression);
	} else {
		if (
			targetObject?.$Type === UIAnnotationTypes.DataFieldWithUrl ||
			targetObject?.$Type === UIAnnotationTypes.DataFieldWithNavigationPath
		) {
			return compileBinding(annotationExpression((targetObject as DataFieldWithUrl).Value));
		} else {
			return "";
		}
	}
};

export const getUnitBinding = function(
	oPropertyDataModelObjectPath: DataModelObjectPath,
	fieldFormatOptions: FieldFormatOptions
): BindingExpression<string> {
	const sUnitPropertyPath = getAssociatedUnitPropertyPath(oPropertyDataModelObjectPath.targetObject);
	const sCurrencyPropertyPath = getAssociatedCurrencyPropertyPath(oPropertyDataModelObjectPath.targetObject);
	if (sUnitPropertyPath || sCurrencyPropertyPath) {
		const targetPropertyPath = sUnitPropertyPath || sCurrencyPropertyPath;
		const oUOMPropertyDataModelObjectPath = enhanceDataModelPath(oPropertyDataModelObjectPath, targetPropertyPath);
		return getValueBinding(oUOMPropertyDataModelObjectPath, fieldFormatOptions);
	}
	return undefined;
};

export const getAssociatedTextBinding = function(
	oPropertyDataModelObjectPath: DataModelObjectPath,
	fieldFormatOptions: FieldFormatOptions
): BindingExpression<string> {
	const textPropertyPath = getAssociatedTextPropertyPath(oPropertyDataModelObjectPath.targetObject);
	if (textPropertyPath) {
		const oTextPropertyPath = enhanceDataModelPath(oPropertyDataModelObjectPath, textPropertyPath);
		const oValueBinding = getValueBinding(oTextPropertyPath, fieldFormatOptions, true, true, { $$noPatch: true });
		return oValueBinding;
	}
	return undefined;
};

export const getDisplayStyle = function(
	oPropertyPath: PropertyOrPath<Property>,
	oDataField: any,
	oDataModelPath: DataModelObjectPath,
	fieldFormatOptions: FieldFormatOptions,
	semanticObject: string
): DisplayStyle {
	// algorithm to determine the field fragment to use
	const oProperty: Property = (isPathExpression(oPropertyPath) && oPropertyPath.$target) || (oPropertyPath as Property);
	if (
		semanticObject &&
		!oProperty.annotations?.UI?.IsImageURL &&
		!(oProperty.type === "Edm.Stream") &&
		!(oProperty.annotations?.Communication?.IsEmailAddress || oProperty.annotations?.Communication?.IsPhoneNumber)
	) {
		return "LinkWithQuickViewForm";
	}
	if (!oPropertyPath || typeof oPropertyPath === "string") {
		return "Text";
	}
	if (oProperty.type === "Edm.Stream") {
		return "File";
	}
	if (oProperty.annotations?.UI?.IsImageURL) {
		return "Avatar";
	}
	switch (oDataField.$Type) {
		case "com.sap.vocabularies.UI.v1.DataPointType":
			return "DataPoint";
		case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
			if (oDataField.Target?.$target?.$Type === "com.sap.vocabularies.UI.v1.DataPointType") {
				return "DataPoint";
			} else if (oDataField.Target?.$target?.$Type === "com.sap.vocabularies.Communication.v1.ContactType") {
				return "Contact";
			}
			break;
		case "com.sap.vocabularies.UI.v1.DataFieldForAction":
		case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
			return "Button";
		case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
			return "Link";
	}
	if (oDataModelPath?.targetEntityType?.annotations?.Common?.SemanticKey) {
		const aSemanticKeys = oDataModelPath.targetEntityType.annotations.Common.SemanticKey;
		const bIsSemanticKey = !aSemanticKeys.every(function(oKey) {
			return oKey?.$target?.name !== oProperty.name;
		});
		if (bIsSemanticKey && fieldFormatOptions.semanticKeyStyle) {
			if (oDataModelPath.targetEntitySet?.annotations?.Common?.DraftRoot) {
				// && fieldFormatOptions.hasDraftIndicator) {
				// we then still check whether this is available at designtime on the entityset
				return "SemanticKeyWithDraftIndicator";
			}
			return fieldFormatOptions.semanticKeyStyle === "ObjectIdentifier" ? "ObjectIdentifier" : "LabelSemanticKey";
		}
	}
	if (oDataField.Criticality) {
		return "ObjectStatus";
	}
	if (oProperty.annotations?.Measures?.ISOCurrency) {
		if (fieldFormatOptions.measureDisplayMode === "Hidden") {
			return "Text";
		}
		return "AmountWithCurrency";
	}
	if (oProperty.annotations?.Communication?.IsEmailAddress || oProperty.annotations?.Communication?.IsPhoneNumber) {
		return "Link";
	}
	if (oProperty.annotations?.UI?.MultiLineText) {
		return "ExpandableText";
	}
	const aNavigationProperties = oDataModelPath?.targetEntityType?.navigationProperties || [];
	let bIsUsedInNavigationWithQuickViewFacets = false;
	aNavigationProperties.forEach(oNavProp => {
		if (oNavProp.referentialConstraint && oNavProp.referentialConstraint.length) {
			oNavProp.referentialConstraint.forEach(oRefConstraint => {
				if (oRefConstraint?.sourceProperty === oProperty.name) {
					if (oNavProp?.targetType?.annotations?.UI?.QuickViewFacets) {
						bIsUsedInNavigationWithQuickViewFacets = true;
					}
				}
			});
		}
	});
	if (bIsUsedInNavigationWithQuickViewFacets) {
		return "LinkWithQuickViewForm";
	}
	if (oProperty.annotations?.Common?.SemanticObject) {
		return "LinkWrapper";
	}
	if (oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithUrl") {
		return "Link";
	}
	return "Text";
};

export const getEditStyle = function(
	oPropertyPath: PropertyOrPath<Property>,
	oDataField: any,
	oFieldFormatOptions: FieldFormatOptions
): EditStyle | null {
	// algorithm to determine the field fragment to use
	if (!oPropertyPath || typeof oPropertyPath === "string") {
		return null;
	}
	const oProperty: Property = (isPathExpression(oPropertyPath) && oPropertyPath.$target) || (oPropertyPath as Property);
	if (oProperty.type === "Edm.Stream") {
		return "File";
	}
	switch (oDataField.$Type) {
		case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
			if (oDataField.Target?.$target?.$Type === "com.sap.vocabularies.Communication.v1.ContactType") {
				return null;
			} else if (oDataField.Target?.$target?.Visualization === "UI.VisualizationType/Rating") {
				return "RatingIndicator";
			}
			break;
		case "com.sap.vocabularies.UI.v1.DataPointType":
			if (oDataField?.Visualization === "UI.VisualizationType/Rating") {
				return "RatingIndicator";
			}
			break;
		case "com.sap.vocabularies.UI.v1.DataFieldForAction":
		case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
		case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
			return null;
	}
	const oPropertyUnit = getAssociatedUnitProperty(oProperty);
	const oPropertyCurrency = getAssociatedCurrencyProperty(oProperty);
	if (
		(PropertyHelper.hasValueHelp(oProperty) && oProperty.type !== "Edm.Boolean") ||
		(oPropertyUnit && PropertyHelper.hasValueHelp(oPropertyUnit)) ||
		(oPropertyCurrency && PropertyHelper.hasValueHelp(oPropertyCurrency))
	) {
		if (oFieldFormatOptions?.measureDisplayMode === "Hidden") {
			return "Input";
		}
		return "InputWithValueHelp";
	}
	if (oProperty.annotations?.UI?.MultiLineText?.valueOf() && oProperty.type === "Edm.String") {
		return "TextArea";
	}
	switch (oProperty.type) {
		case "Edm.Date":
			return "DatePicker";
		case "Edm.Time":
		case "Edm.TimeOfDay":
			return "TimePicker";
		case "Edm.DateTime":
		case "Edm.DateTimeOffset":
			return "DateTimePicker";
		case "Edm.Boolean":
			return "CheckBox";
	}
	if (oProperty.annotations?.Measures?.ISOCurrency || oProperty.annotations?.Measures?.Unit) {
		return "InputWithUnit";
	}
	return "Input";
};

/**
 * Returns the binding expression to evaluate the visibility of a DataField or DataPoint annotation.
 *
 * SAP Fiori elements will evaluate either the UI.Hidden annotation defined on the annotation itself or on the target property.
 *
 * @param {DataModelObjectPath} dataFieldModelPath The metapath referring to the annotation we are evaluating.
 * @param {FieldFormatOptions} [formatOptions] FormatOptions optional.
 * @returns {BindingExpression<string>} An expression that you can bind to the UI.
 */
export const getVisibleExpression = function(
	dataFieldModelPath: DataModelObjectPath,
	formatOptions?: FieldFormatOptions
): BindingExpression<string> {
	const targetObject: DataFieldAbstractTypes | DataPointTypeTypes = dataFieldModelPath.targetObject;
	let propertyValue;
	if (targetObject) {
		switch (targetObject.$Type) {
			case UIAnnotationTypes.DataField:
			case UIAnnotationTypes.DataFieldWithUrl:
			case UIAnnotationTypes.DataFieldWithNavigationPath:
			case UIAnnotationTypes.DataFieldWithIntentBasedNavigation:
			case UIAnnotationTypes.DataFieldWithAction:
			case UIAnnotationTypes.DataPointType:
				propertyValue = targetObject.Value.$target;
				break;
			case UIAnnotationTypes.DataFieldForAnnotation:
				// if it is a DataFieldForAnnotation pointing to a DataPoint we look at the dataPoint's value
				if (targetObject?.Target?.$target?.$Type === UIAnnotationTypes.DataPointType) {
					propertyValue = targetObject.Target.$target?.Value.$target;
					break;
				}
			// eslint-disable-next-line no-fallthrough
			case UIAnnotationTypes.DataFieldForIntentBasedNavigation:
			case UIAnnotationTypes.DataFieldForAction:
			default:
				propertyValue = undefined;
		}
	}
	const isAnalyticalGroupHeaderExpanded = formatOptions?.isAnalytics ? UI.IsExpanded : constant(false);
	const isAnalyticalLeaf = formatOptions?.isAnalytics ? equal(UI.NodeLevel, 0) : constant(false);

	// A data field is visible if:
	// - the UI.Hidden expression in the original annotation does not evaluate to 'true'
	// - the UI.Hidden expression in the target property does not evaluate to 'true'
	// - in case of Analytics it's not visible for an expanded GroupHeader
	return compileBinding(
		and(
			...[
				not(equal(annotationExpression(targetObject?.annotations?.UI?.Hidden), true)),
				ifElse(
					!!propertyValue,
					propertyValue && not(equal(annotationExpression(propertyValue.annotations?.UI?.Hidden), true)),
					true
				),
				or(not(isAnalyticalGroupHeaderExpanded), isAnalyticalLeaf)
			]
		)
	);
};

export const getInputDescription = function(
	oPropertyPath: PropertyOrPath<Property>,
	descriptionBindingExpression: BindingExpression<string>
): BindingExpression<string> {
	const oProperty = (isPathExpression(oPropertyPath) && oPropertyPath.$target) || (oPropertyPath as Property);
	const unitProperty = getAssociatedCurrencyProperty(oProperty) || getAssociatedUnitProperty(oProperty);
	if (!unitProperty) {
		return compileBinding("");
	}
	const editableExpression = and(not(isReadOnlyExpression(unitProperty)), not(PropertyHelper.isComputed(unitProperty)));
	return compileBinding(ifElse(editableExpression, "", descriptionBindingExpression));
};

export const QVTextBinding = function(
	oPropertyDataModelObjectPath: DataModelObjectPath,
	oPropertyValueDataModelObjectPath: DataModelObjectPath,
	fieldFormatOptions: FieldFormatOptions,
	asObject: boolean = false
) {
	let returnValue: any = getValueBinding(oPropertyDataModelObjectPath, fieldFormatOptions, asObject);
	if (returnValue === "") {
		returnValue = getTextBinding(oPropertyValueDataModelObjectPath, fieldFormatOptions, asObject);
	}
	return returnValue;
};

export const getQuickViewType = function(oPropertyDataModelObjectPath: DataModelObjectPath): string {
	const targetObject = oPropertyDataModelObjectPath.targetObject;
	if (targetObject?.$target?.annotations?.Communication?.IsEmailAddress) {
		return "email";
	}
	if (targetObject?.$target?.annotations?.Communication?.IsPhoneNumber) {
		return "phone";
	}
	return "text";
};
