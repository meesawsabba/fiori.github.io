import { Context } from "sap/ui/model/odata/v4";
import { convertMetaModelContext, getInvolvedDataModelObjects } from "sap/fe/core/converters/MetaModelConverter";
import {
	addTypeInformation,
	and,
	annotationExpression,
	BindingExpression,
	BindingExpressionExpression,
	compileBinding,
	constant,
	equal,
	Expression,
	ExpressionOrPrimitive,
	formatResult,
	ifElse,
	isConstant,
	isTruthy,
	not,
	or
} from "sap/fe/core/helpers/BindingExpression";
import { UI } from "sap/fe/core/converters/helpers/BindingHelper";
import {
	getAssociatedUnitProperty,
	getAssociatedCurrencyProperty,
	hasValueHelp,
	isComputed,
	isImmutable,
	isKey,
	isPathExpression,
	isProperty
} from "sap/fe/core/templating/PropertyHelper";
import { NavigationProperty, Property } from "@sap-ux/annotation-converter";
import { PathAnnotationExpression } from "@sap-ux/vocabularies-types/types/Edm";
import {
	DataModelObjectPath,
	getTargetEntitySetPath,
	isPathUpdatable,
	getPathRelativeLocation
} from "sap/fe/core/templating/DataModelPathHelper";
import { isReadOnlyExpression, isNonEditableExpression, isDisabledExpression } from "sap/fe/core/templating/FieldControlHelper";
import valueFormatters from "sap/fe/core/formatters/ValueFormatter";
import { DataFieldAbstractTypes } from "@sap-ux/vocabularies-types";

export type PropertyOrPath<P> = string | P | PathAnnotationExpression<P>;
export type MetaModelContext = {
	$kind: string;
};
export type ComputedAnnotationInterface = {
	context: Context;
	arguments: any[];
	$$valueAsPromise: boolean;
};

export type configTypeConstraints = {
	scale?: number;
	precision?: number;
	maxLength?: number;
	nullable?: boolean;
	minimum?: string;
	maximum?: string;
	isDigitSequence?: boolean;
};

export type configTypeformatOptions = {
	parseAsString?: boolean;
	emptyString?: string;
	parseKeepsEmptyString?: boolean;
};

export type configType = {
	type: string;
	constraints: configTypeConstraints;
	formatOptions: configTypeformatOptions;
};

export const EDM_TYPE_MAPPING: Record<string, any> = {
	"Edm.Boolean": { type: "sap.ui.model.odata.type.Boolean" },
	"Edm.Byte": { type: "sap.ui.model.odata.type.Byte" },
	"Edm.Date": { type: "sap.ui.model.odata.type.Date" },
	"Edm.DateTimeOffset": {
		constraints: {
			"$Precision": "precision"
		},
		type: "sap.ui.model.odata.type.DateTimeOffset"
	},
	"Edm.Decimal": {
		constraints: {
			"@Org.OData.Validation.V1.Minimum/$Decimal": "minimum",
			"@Org.OData.Validation.V1.Minimum@Org.OData.Validation.V1.Exclusive": "minimumExclusive",
			"@Org.OData.Validation.V1.Maximum/$Decimal": "maximum",
			"@Org.OData.Validation.V1.Maximum@Org.OData.Validation.V1.Exclusive": "maximumExclusive",
			"$Precision": "precision",
			"$Scale": "scale"
		},
		type: "sap.ui.model.odata.type.Decimal"
	},
	"Edm.Double": { type: "sap.ui.model.odata.type.Double" },
	"Edm.Guid": { type: "sap.ui.model.odata.type.Guid" },
	"Edm.Int16": { type: "sap.ui.model.odata.type.Int16" },
	"Edm.Int32": { type: "sap.ui.model.odata.type.Int32" },
	"Edm.Int64": { type: "sap.ui.model.odata.type.Int64" },
	"Edm.SByte": { type: "sap.ui.model.odata.type.SByte" },
	"Edm.Single": { type: "sap.ui.model.odata.type.Single" },
	"Edm.Stream": { type: "sap.ui.model.odata.type.Stream" },
	"Edm.String": {
		constraints: {
			"@com.sap.vocabularies.Common.v1.IsDigitSequence": "isDigitSequence",
			"$MaxLength": "maxLength",
			"$Nullable": "nullable"
		},
		type: "sap.ui.model.odata.type.String"
	},
	"Edm.TimeOfDay": {
		constraints: {
			"$Precision": "precision"
		},
		type: "sap.ui.model.odata.type.TimeOfDay"
	}
};

/**
 * Create the expression to generate an "editable" boolean value.
 *
 * @param {PropertyPath} oPropertyPath The input property
 * @param {object} oDataFieldConverted The DataFieldConverted object to read the fieldControl annotation
 * @param {DataModelObjectPath} oDataModelObjectPath The path to this property object
 * @param {boolean} bAsObject Whether or not this should be returned as an object or a binding string
 * @returns {string} The binding expression used to determine if a property is editable or not
 */
export const getEditableExpression = function(
	oPropertyPath: PropertyOrPath<Property>,
	oDataFieldConverted: any = null,
	oDataModelObjectPath?: DataModelObjectPath,
	bAsObject: boolean = false
): BindingExpression<boolean> | ExpressionOrPrimitive<boolean> {
	if (!oPropertyPath || typeof oPropertyPath === "string") {
		return compileBinding(false);
	}
	let dataFieldEditableExpression: BindingExpression<boolean> | ExpressionOrPrimitive<boolean> = true;
	if (oDataFieldConverted !== null) {
		dataFieldEditableExpression = ifElse(isNonEditableExpression(oDataFieldConverted), false, UI.IsEditable);
	}

	const oProperty: Property = (isPathExpression(oPropertyPath) && oPropertyPath.$target) || (oPropertyPath as Property);
	// Editability depends on the field control expression
	// If the Field control is statically in ReadOnly or Inapplicable (disabled) -> not editable
	// If the property is a key -> not editable except in creation if not computed
	// If the property is computed -> not editable
	// If the property is not updatable -> not editable
	// If the property is immutable -> not editable except in creation
	// If the Field control is a path resolving to ReadOnly or Inapplicable (disabled) (<= 1) -> not editable
	// Else, to be editable you need
	// immutable and key while in the creation row
	// ui/isEditable
	const isPathUpdatableExpression = isPathUpdatable(oDataModelObjectPath, oPropertyPath);
	const editableExpression = ifElse(
		or(
			not(isPathUpdatableExpression),
			isComputed(oProperty),
			isKey(oProperty),
			isImmutable(oProperty),
			isNonEditableExpression(oProperty)
		),
		ifElse(or(isComputed(oProperty), isNonEditableExpression(oProperty)), false, UI.IsTransientBinding),
		UI.IsEditable
	);
	if (bAsObject) {
		return and(editableExpression, dataFieldEditableExpression);
	}
	return compileBinding(and(editableExpression, dataFieldEditableExpression));
};

/**
 * Create the expression to generate an "enabled" boolean value.
 *
 * @param {PropertyPath} oPropertyPath The input property
 * @param {any} oDataFieldConverted The DataFieldConverted Object to read the fieldControl annotation
 * @param {boolean} bAsObject Whether or not this should be returned as an object or a binding string
 * @returns {string} The binding expression to determine if a property is enabled or not
 */
export const getEnabledExpression = function(
	oPropertyPath: PropertyOrPath<Property>,
	oDataFieldConverted?: any,
	bAsObject: boolean = false
): BindingExpression<boolean> | ExpressionOrPrimitive<boolean> {
	if (!oPropertyPath || typeof oPropertyPath === "string") {
		return compileBinding(true);
	}
	let dataFieldEnabledExpression: BindingExpression<boolean> | ExpressionOrPrimitive<boolean> = true;
	if (oDataFieldConverted !== null) {
		dataFieldEnabledExpression = ifElse(isDisabledExpression(oDataFieldConverted), false, true);
	}

	const oProperty: Property = (isPathExpression(oPropertyPath) && oPropertyPath.$target) || (oPropertyPath as Property);
	// Enablement depends on the field control expression
	// If the Field control is statically in Inapplicable (disabled) -> not enabled
	const enabledExpression = ifElse(isDisabledExpression(oProperty), false, true);
	if (bAsObject) {
		return and(enabledExpression, dataFieldEnabledExpression);
	}
	return compileBinding(and(enabledExpression, dataFieldEnabledExpression));
};

/**
 * Create the expression to generate an "editMode" enum value.
 * @param {PropertyPath} oPropertyPath The input property
 * @param {DataModelObjectPath} oDataModelObjectPath The list of data model objects that are involved to reach that property
 * @param {boolean} bMeasureReadOnly Whether we should set UoM / currency field mode to read only
 * @param {boolean} bAsObject Whether we should return this as an expression or as a string
 * @param {object} oDataFieldConverted The dataField object
 * @returns {BindingExpression<string> | ExpressionOrPrimitive<string>} The binding expression representing the current property edit mode, compliant with the MDC Field definition of editMode.
 */
export const getEditMode = function(
	oPropertyPath: PropertyOrPath<Property>,
	oDataModelObjectPath: DataModelObjectPath,
	bMeasureReadOnly: boolean = false,
	bAsObject: boolean = false,
	oDataFieldConverted: any = null
): BindingExpression<string> | ExpressionOrPrimitive<string> {
	if (!oPropertyPath || typeof oPropertyPath === "string") {
		return "Display";
	}
	const oProperty: Property = (isPathExpression(oPropertyPath) && oPropertyPath.$target) || (oPropertyPath as Property);
	// if the property is not enabled => Disabled
	// if the property is enabled && not editable => ReadOnly
	// if the property is enabled && editable => Editable
	// If there is an associated unit, and it has a field control also use consider the following
	// if the unit field control is readonly -> EditableReadOnly
	// otherwise -> Editable
	const editableExpression = getEditableExpression(
		oPropertyPath,
		oDataFieldConverted,
		oDataModelObjectPath,
		true
	) as ExpressionOrPrimitive<boolean>;

	const enabledExpression = getEnabledExpression(oPropertyPath, oDataFieldConverted, true) as ExpressionOrPrimitive<boolean>;
	const associatedCurrencyProperty = getAssociatedCurrencyProperty(oProperty);
	const unitProperty = associatedCurrencyProperty || getAssociatedUnitProperty(oProperty);
	let resultExpression: ExpressionOrPrimitive<string> = "Editable";
	if (unitProperty) {
		resultExpression = ifElse(
			or(isReadOnlyExpression(unitProperty), isComputed(unitProperty), bMeasureReadOnly),
			"EditableReadOnly",
			"Editable"
		);
	}
	const readOnlyExpression = or(isReadOnlyExpression(oProperty), isReadOnlyExpression(oDataFieldConverted));

	// if the property is from a non-updatable entity => Read only mode, previously calculated edit Mode is ignored
	// if the property is from an updatable entity => previously calculated edit Mode expression
	const editModeExpression = ifElse(
		enabledExpression,
		ifElse(
			editableExpression,
			resultExpression,
			ifElse(and(!isConstant(readOnlyExpression) && readOnlyExpression, UI.IsEditable), "ReadOnly", "Display")
		),
		ifElse(UI.IsEditable, "Disabled", "Display")
	);
	if (bAsObject) {
		return editModeExpression;
	}
	return compileBinding(editModeExpression);
};

export const hasValidAnalyticalCurrencyOrUnit = function(oPropertyDataModelObjectPath: DataModelObjectPath): BindingExpression<string> {
	const oPropertyDefinition = oPropertyDataModelObjectPath.targetObject as Property;
	const currency = oPropertyDefinition.annotations?.Measures?.ISOCurrency;
	const measure = currency ? currency : oPropertyDefinition.annotations?.Measures?.Unit;
	if (measure) {
		return compileBinding(or(isTruthy(annotationExpression(measure) as Expression<string>), not(UI.IsTotal)));
	} else {
		return compileBinding(constant(true));
	}
};

export const ifUnitEditable = function(
	oPropertyPath: PropertyOrPath<Property>,
	sEditableValue: ExpressionOrPrimitive<string>,
	sNonEditableValue: ExpressionOrPrimitive<string>
): BindingExpression<string> {
	const oProperty = (isPathExpression(oPropertyPath) && oPropertyPath.$target) || (oPropertyPath as Property);
	const unitProperty = getAssociatedCurrencyProperty(oProperty) || getAssociatedUnitProperty(oProperty);
	if (!unitProperty) {
		return compileBinding(sNonEditableValue);
	}
	const editableExpression = and(not(isReadOnlyExpression(unitProperty)), not(isComputed(unitProperty)));
	return compileBinding(ifElse(editableExpression, sEditableValue, sNonEditableValue));
};

export type DisplayMode = "Value" | "Description" | "DescriptionValue" | "ValueDescription";
export const getDisplayMode = function(oPropertyPath: PropertyOrPath<Property>, oDataModelObjectPath?: DataModelObjectPath): DisplayMode {
	if (!oPropertyPath || typeof oPropertyPath === "string") {
		return "Value";
	}
	const oProperty = (isPathExpression(oPropertyPath) && oPropertyPath.$target) || (oPropertyPath as Property);
	const oEntityType = oDataModelObjectPath && oDataModelObjectPath.targetEntityType;
	const oTextAnnotation = oProperty.annotations?.Common?.Text;
	const oTextArrangementAnnotation =
		(typeof oTextAnnotation !== "string" && oTextAnnotation?.annotations?.UI?.TextArrangement?.toString()) ||
		oEntityType?.annotations?.UI?.TextArrangement?.toString();

	let sDisplayValue = oTextAnnotation ? "DescriptionValue" : "Value";
	if ((oTextAnnotation && oTextArrangementAnnotation) || oEntityType?.annotations?.UI?.TextArrangement?.toString()) {
		if (oTextArrangementAnnotation === "UI.TextArrangementType/TextOnly") {
			sDisplayValue = "Description";
		} else if (oTextArrangementAnnotation === "UI.TextArrangementType/TextLast") {
			sDisplayValue = "ValueDescription";
		} else if (oTextArrangementAnnotation === "UI.TextArrangementType/TextSeparate") {
			sDisplayValue = "Value";
		} else {
			//Default should be TextFirst if there is a Text annotation and neither TextOnly nor TextLast are set
			sDisplayValue = "DescriptionValue";
		}
	}
	return sDisplayValue as DisplayMode;
};

export const getFieldDisplay = function(
	oPropertyPath: PropertyOrPath<Property>,
	sTargetDisplayMode: string,
	oComputedEditMode: ExpressionOrPrimitive<string>
): BindingExpression<string> {
	const oProperty = (isPathExpression(oPropertyPath) && oPropertyPath.$target) || (oPropertyPath as Property);

	return hasValueHelp(oProperty)
		? compileBinding(sTargetDisplayMode)
		: compileBinding(ifElse(equal(oComputedEditMode, "Editable"), "Value", sTargetDisplayMode));
};

export const formatWithTypeInformation = function(oProperty: Property, propertyBindingExpression: Expression<string>): Expression<string> {
	const outExpression: BindingExpressionExpression<any> = propertyBindingExpression as BindingExpressionExpression<any>;
	if (oProperty._type === "Property") {
		const oTargetMapping = EDM_TYPE_MAPPING[(oProperty as Property).type];
		if (oTargetMapping) {
			outExpression.type = oTargetMapping.type;
			if (oTargetMapping.constraints) {
				outExpression.constraints = {};
				if (oTargetMapping.constraints.$Scale && oProperty.scale !== undefined) {
					outExpression.constraints.scale = oProperty.scale;
				}
				if (oTargetMapping.constraints.$Precision && oProperty.precision !== undefined) {
					outExpression.constraints.precision = oProperty.precision;
				}
				if (oTargetMapping.constraints.$MaxLength && oProperty.maxLength !== undefined) {
					outExpression.constraints.maxLength = oProperty.maxLength;
				}
				if (oTargetMapping.constraints.$Nullable && oProperty.nullable === false) {
					outExpression.constraints.nullable = oProperty.nullable;
				}
				if (
					oTargetMapping.constraints["@Org.OData.Validation.V1.Minimum/$Decimal"] &&
					oProperty.annotations?.Validation?.Minimum !== undefined &&
					!isNaN(oProperty.annotations.Validation.Minimum)
				) {
					outExpression.constraints.minimum = `${oProperty.annotations.Validation.Minimum}`;
				}
				if (
					oTargetMapping.constraints["@Org.OData.Validation.V1.Maximum/$Decimal"] &&
					oProperty.annotations?.Validation?.Maximum !== undefined &&
					!isNaN(oProperty.annotations.Validation.Maximum)
				) {
					outExpression.constraints.maximum = `${oProperty.annotations.Validation.Maximum}`;
				}
			}
			if (outExpression?.type?.indexOf("sap.ui.model.odata.type.Int") === 0) {
				if (!outExpression.formatOptions) {
					outExpression.formatOptions = {};
				}
				outExpression.formatOptions = Object.assign(outExpression.formatOptions, {
					parseAsString: false,
					emptyString: ""
				});
			}
			if (outExpression.type === "sap.ui.model.odata.type.String") {
				if (!outExpression.formatOptions) {
					outExpression.formatOptions = {};
				}
				outExpression.formatOptions.parseKeepsEmptyString = true;

				if (
					oTargetMapping.constraints?.["@com.sap.vocabularies.Common.v1.IsDigitSequence"] &&
					oProperty.annotations?.Common?.IsDigitSequence
				) {
					outExpression.constraints.isDigitSequence = true;
				}
			}
			if (outExpression?.type?.indexOf("sap.ui.model.odata.type.Double") === 0) {
				if (!outExpression.formatOptions) {
					outExpression.formatOptions = {};
				}
				outExpression.formatOptions = Object.assign(outExpression.formatOptions, {
					parseAsString: false,
					emptyString: ""
				});
			}
		}
	}
	return outExpression;
};

export const getTypeConfig = function(oProperty: Property | DataFieldAbstractTypes, dataType: string | undefined): any {
	const oTargetMapping = EDM_TYPE_MAPPING[(oProperty as Property)?.type] || (dataType ? EDM_TYPE_MAPPING[dataType] : undefined);
	const propertyTypeConfig: configType = {
		type: oTargetMapping.type,
		constraints: {},
		formatOptions: {}
	};
	if (isProperty(oProperty)) {
		propertyTypeConfig.constraints = {
			scale: oTargetMapping.constraints?.$Scale ? oProperty.scale : undefined,
			precision: oTargetMapping.constraints?.$Precision ? oProperty.precision : undefined,
			maxLength: oTargetMapping.constraints?.$MaxLength ? oProperty.maxLength : undefined,
			nullable: oTargetMapping.constraints?.$Nullable ? oProperty.nullable : undefined,
			minimum:
				oTargetMapping.constraints?.["@Org.OData.Validation.V1.Minimum/$Decimal"] &&
				!isNaN(oProperty.annotations?.Validation?.Minimum)
					? `${oProperty.annotations?.Validation?.Minimum}`
					: undefined,
			maximum:
				oTargetMapping.constraints?.["@Org.OData.Validation.V1.Maximum/$Decimal"] &&
				!isNaN(oProperty.annotations?.Validation?.Maximum)
					? `${oProperty.annotations?.Validation?.Maximum}`
					: undefined,
			isDigitSequence:
				propertyTypeConfig.type === "sap.ui.model.odata.type.String" &&
				oTargetMapping.constraints?.["@com.sap.vocabularies.Common.v1.IsDigitSequence"] &&
				(oProperty as Property).annotations?.Common?.IsDigitSequence
					? true
					: undefined
		};
	}
	propertyTypeConfig.formatOptions = {
		parseAsString:
			propertyTypeConfig?.type?.indexOf("sap.ui.model.odata.type.Int") === 0 ||
			propertyTypeConfig?.type?.indexOf("sap.ui.model.odata.type.Double") === 0
				? false
				: undefined,
		emptyString:
			propertyTypeConfig?.type?.indexOf("sap.ui.model.odata.type.Int") === 0 ||
			propertyTypeConfig?.type?.indexOf("sap.ui.model.odata.type.Double") === 0
				? ""
				: undefined,
		parseKeepsEmptyString: propertyTypeConfig.type === "sap.ui.model.odata.type.String" ? true : undefined
	};
	return propertyTypeConfig;
};

export const getBindingWithUnitOrCurrency = function(
	oPropertyDataModelPath: DataModelObjectPath,
	propertyBindingExpression: Expression<string>
): Expression<string> {
	const oPropertyDefinition = oPropertyDataModelPath.targetObject as Property;
	let unit = oPropertyDefinition.annotations?.Measures?.Unit;
	const relativeLocation = getPathRelativeLocation(
		oPropertyDataModelPath.contextLocation,
		oPropertyDataModelPath.navigationProperties
	).map(np => np.name);
	propertyBindingExpression = formatWithTypeInformation(oPropertyDefinition, propertyBindingExpression);
	if (unit?.toString() === "%") {
		return formatResult([propertyBindingExpression], valueFormatters.formatWithPercentage);
	}
	const complexType = unit ? "sap.ui.model.odata.type.Unit" : "sap.ui.model.odata.type.Currency";
	unit = unit ? unit : oPropertyDefinition.annotations?.Measures?.ISOCurrency;
	const unitBindingExpression = (unit as any).$target
		? formatWithTypeInformation((unit as any).$target, annotationExpression(unit, relativeLocation) as Expression<string>)
		: (annotationExpression(unit, relativeLocation) as Expression<string>);
	return addTypeInformation([propertyBindingExpression, unitBindingExpression], complexType);
};

export const getAlignmentExpression = function(
	oComputedEditMode: Expression<string>,
	sAlignDisplay: string = "Begin",
	sAlignEdit: string = "Begin"
): BindingExpression<string> | Expression<string> {
	return compileBinding(ifElse(equal(oComputedEditMode, "Display"), sAlignDisplay, sAlignEdit));
};

/**
 * Formatter helper to retrieve the converterContext from the metamodel context.
 *
 * @param {Context} oContext The original metamodel context
 * @param {ComputedAnnotationInterface} oInterface The current templating context
 * @returns {object} The ConverterContext representing that object
 */
export const getConverterContext = function(oContext: MetaModelContext, oInterface: ComputedAnnotationInterface): object | null {
	if (oInterface && oInterface.context) {
		return convertMetaModelContext(oInterface.context);
	}
	return null;
};
getConverterContext.requiresIContext = true;

/**
 * Formatter helper to retrieve the data model objects that are involved from the metamodel context.
 *
 * @param {Context} oContext The original ODataMetaModel context
 * @param {ComputedAnnotationInterface} oInterface The current templating context
 * @returns {object[]} An array of entitysets and navproperties that are involved to get to a specific object in the metamodel
 */
export const getDataModelObjectPath = function(
	oContext: MetaModelContext,
	oInterface: ComputedAnnotationInterface
): DataModelObjectPath | null {
	if (oInterface && oInterface.context) {
		return getInvolvedDataModelObjects(oInterface.context);
	}
	return null;
};
getDataModelObjectPath.requiresIContext = true;

/**
 * Retrieves the expressionBinding created out of a binding expression.
 *
 * @param {Expression<any>} expression The expression which needs to be compiled
 * @returns {BindingExpression<string>} The expression-binding string
 */
export const getExpressionBinding = function(expression: Expression<any>): BindingExpression<string> {
	return compileBinding(expression);
};

/**
 * Retrieve the target entityset for a context path if it exists.
 *
 * @param oContext
 * @returns {string}
 */
export const getTargetEntitySet = function(oContext: Context): string | null {
	if (oContext) {
		const oDataModelPath = getInvolvedDataModelObjects(oContext);
		return getTargetEntitySetPath(oDataModelPath);
	}

	return null;
};

export const isCollectionField = function(oDataModelPath: DataModelObjectPath): boolean {
	if (oDataModelPath.navigationProperties?.length) {
		const hasOneToManyNavigation =
			oDataModelPath?.navigationProperties.findIndex((oNav: NavigationProperty) => {
				if (oNav.isCollection) {
					if (oDataModelPath.contextLocation?.navigationProperties?.length) {
						//we check the one to many nav is not already part of the context
						return (
							oDataModelPath.contextLocation?.navigationProperties.findIndex(
								(oContextNav: NavigationProperty) => oContextNav.name === oNav.name
							) === -1
						);
					}
					return true;
				}
				return false;
			}) > -1;
		if (hasOneToManyNavigation) {
			return true;
		}
	}
	return false;
};
