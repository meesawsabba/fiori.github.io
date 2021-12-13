import {
	CommunicationAnnotationTypes,
	Contact,
	DataField,
	DataFieldAbstractTypes,
	DataFieldForActionAbstractTypes,
	DataFieldForAnnotation,
	DataFieldTypes,
	DataPoint,
	UIAnnotationTypes
} from "@sap-ux/vocabularies-types";
import * as Edm from "@sap-ux/vocabularies-types/dist/Edm";
import { getDisplayMode, PropertyOrPath } from "sap/fe/core/templating/UIFormatters";
import { Property } from "@sap-ux/annotation-converter";
import { getAssociatedCurrencyProperty, getAssociatedUnitProperty, isProperty } from "sap/fe/core/templating/PropertyHelper";
import ConverterContext from "../ConverterContext";
import { TableType } from "sap/fe/core/converters/controls/Common/Table";

export type ComplexPropertyInfo = {
	properties: Record<string, Property>;
	additionalProperties: Record<string, Property>;
	exportSettingsTemplate?: string;
	exportSettingsWrapping?: boolean;
	exportSettingsContactProperty?: string;
	visualSettingsToBeExcluded?: string;
};

/**
 * Identifies if the given dataFieldAbstract that is passed is a "DataFieldForActionAbstract".
 * DataFieldForActionAbstract has an inline action defined.
 *
 * @param {DataFieldAbstractTypes} dataField Data field to be evaluated
 * @returns {boolean} Validates that dataField is a DataFieldForActionAbstractType
 */
export function isDataFieldForActionAbstract(dataField: DataFieldAbstractTypes): dataField is DataFieldForActionAbstractTypes {
	return (dataField as DataFieldForActionAbstractTypes).hasOwnProperty("Action");
}

/**
 * Identifies if the given dataFieldAbstract that is passed is a "DataField".
 * DataField has a value defined.
 *
 * @param {DataFieldAbstractTypes} dataField Data field to be evaluated
 * @returns {boolean} Validate that dataField is a DataFieldTypes
 */
export function isDataFieldTypes(dataField: DataFieldAbstractTypes): dataField is DataFieldTypes {
	return (dataField as DataFieldTypes).hasOwnProperty("Value");
}

/**
 * Returns whether given data field has a static hidden annotation.
 *
 * @param {DataFieldAbstractTypes} dataField The datafield to check
 * @returns {boolean} `true` if datafield or referenced property has a static Hidden annotation, false else
 * @private
 */
export function isDataFieldAlwaysHidden(dataField: DataFieldAbstractTypes): boolean {
	return (
		dataField.annotations?.UI?.Hidden?.valueOf() === true ||
		(isDataFieldTypes(dataField) && dataField.Value?.$target?.annotations?.UI?.Hidden === true)
	);
}

export function getSemanticObjectPath(converterContext: ConverterContext, object: any): string | undefined {
	if (typeof object === "object") {
		if (isDataFieldTypes(object) && object.Value?.$target) {
			const property = object.Value?.$target;
			if (property?.annotations?.Common?.SemanticObject !== undefined) {
				return converterContext.getEntitySetBasedAnnotationPath(property?.fullyQualifiedName);
			}
		} else if (isProperty(object)) {
			if (object?.annotations?.Common?.SemanticObject !== undefined) {
				return converterContext.getEntitySetBasedAnnotationPath(object?.fullyQualifiedName);
			}
		}
	}
	return undefined;
}

/**
 * Returns the navigation path prefix for a property path.
 *
 * @param path The property path For e.g. /EntityType/Navigation/Property
 * @returns {string} The navigation path prefix For e.g. /EntityType/Navigation/
 */
function _getNavigationPathPrefix(path: string): string {
	return path.indexOf("/") > -1 ? path.substring(0, path.lastIndexOf("/") + 1) : "";
}

/**
 * Collect additional properties for the ALP table use-case.
 *
 * For e.g. If UI.Hidden points to a property, include this property in the additionalProperties of ComplexPropertyInfo object.
 * @param target Property or DataField being processed
 * @param navigationPathPrefix Navigation path prefix, applicable in case of navigation properties.
 * @param tableType Table type.
 * @param relatedProperties The related properties identified so far.
 * @returns {ComplexPropertyInfo} The related properties identified.
 */
function _collectAdditionalPropertiesForAnalyticalTable(
	target: Edm.PrimitiveType,
	navigationPathPrefix: string,
	tableType: TableType,
	relatedProperties: ComplexPropertyInfo
): ComplexPropertyInfo {
	if (tableType === "AnalyticalTable") {
		const hiddenAnnotation = target.annotations?.UI?.Hidden;
		if (hiddenAnnotation?.path && hiddenAnnotation.$target?._type === "Property") {
			const hiddenAnnotationPropertyPath = navigationPathPrefix + hiddenAnnotation.path;
			// This property should be added to additionalProperties map for the ALP table use-case.
			relatedProperties.additionalProperties[hiddenAnnotationPropertyPath] = hiddenAnnotation.$target;
		}
	}
	return relatedProperties;
}

/**
 * Collect related properties from a property's annotations.
 *
 * @param path The property path
 * @param property The property to be considered
 * @param converterContext The converter context
 * @param ignoreSelf Whether to exclude the same property from related properties.
 * @param tableType The table type.
 * @param relatedProperties The related properties identified so far.
 * @returns {ComplexPropertyInfo} The related properties identified.
 */
export function collectRelatedProperties(
	path: string,
	property: Edm.PrimitiveType,
	converterContext: ConverterContext,
	ignoreSelf: boolean,
	tableType: TableType,
	relatedProperties: ComplexPropertyInfo = { properties: {}, additionalProperties: {} }
): ComplexPropertyInfo {
	/**
	 * Helper to push unique related properties.
	 *
	 * @param key The property path
	 * @param value The properties object containing value property, description property...
	 * @returns Index at which the property is available
	 */
	function _pushUnique(key: string, value: Property): number {
		if (!relatedProperties.properties.hasOwnProperty(key)) {
			relatedProperties.properties[key] = value;
		}
		return Object.keys(relatedProperties.properties).indexOf(key);
	}

	/**
	 * Helper to append the export settings template with a formatted text.
	 *
	 * @param value Formatted text
	 */
	function _appendTemplate(value: string) {
		relatedProperties.exportSettingsTemplate = relatedProperties.exportSettingsTemplate
			? `${relatedProperties.exportSettingsTemplate}${value}`
			: `${value}`;
	}

	if (path && property) {
		const navigationPathPrefix = _getNavigationPathPrefix(path);

		// Check for Text annotation.
		const textAnnotation = property.annotations?.Common?.Text;
		let valueIndex: number;
		let targetValue: string;
		let currencyOrUoMIndex: number;

		if (relatedProperties.exportSettingsTemplate) {
			// FieldGroup use-case. Need to add each Field in new line.
			_appendTemplate("\n");
			relatedProperties.exportSettingsWrapping = true;
		}

		if (textAnnotation?.path && textAnnotation?.$target) {
			// Check for Text Arrangement.
			const dataModelObjectPath = converterContext.getDataModelObjectPath();
			const textAnnotationPropertyPath = navigationPathPrefix + textAnnotation.path;
			const displayMode = getDisplayMode(property as PropertyOrPath<Property>, dataModelObjectPath);
			let descriptionIndex: number;
			switch (displayMode) {
				case "Value":
					valueIndex = _pushUnique(path, property);
					_appendTemplate(`{${valueIndex}}`);
					relatedProperties.visualSettingsToBeExcluded = textAnnotationPropertyPath;
					break;

				case "Description":
					// Keep value when exporting (split mode) on text Arrangement defined as #TextOnly (Only values are expected on paste from Excel functionality)
					_pushUnique(path, property);
					descriptionIndex = _pushUnique(textAnnotationPropertyPath, textAnnotation.$target);
					_appendTemplate(`{${descriptionIndex}}`);
					relatedProperties.visualSettingsToBeExcluded = path;
					break;

				case "ValueDescription":
					valueIndex = _pushUnique(path, property);
					descriptionIndex = _pushUnique(textAnnotationPropertyPath, textAnnotation.$target);
					_appendTemplate(`{${valueIndex}} ({${descriptionIndex}})`);
					break;

				case "DescriptionValue":
					valueIndex = _pushUnique(path, property);
					descriptionIndex = _pushUnique(textAnnotationPropertyPath, textAnnotation.$target);
					_appendTemplate(`{${descriptionIndex}} ({${valueIndex}})`);
					break;
			}
		} else {
			// Check for field containing Currency Or Unit Properties.
			const currencyOrUoMProperty = getAssociatedCurrencyProperty(property) || getAssociatedUnitProperty(property);
			const currencyOrUnitAnnotation = property?.annotations?.Measures?.ISOCurrency || property?.annotations?.Measures?.Unit;
			if (currencyOrUoMProperty && currencyOrUnitAnnotation?.$target) {
				valueIndex = _pushUnique(path, property);
				currencyOrUoMIndex = _pushUnique(currencyOrUoMProperty.name, currencyOrUnitAnnotation.$target);
				_appendTemplate(`{${valueIndex}}  {${currencyOrUoMIndex}}`);
			} else if (property.Target?.$target?.Visualization) {
				const dataPointProperty: Edm.PrimitiveType = property.Target.$target.Value.$target;
				valueIndex = _pushUnique(path, dataPointProperty);
				// New fake property created for the Rating/Progress Target Value. It'll be used for the export on split mode.
				_pushUnique(property.Target.value, property.Target.$target);
				targetValue = (property.Target.$target.TargetValue || property.Target.$target.MaximumValue).toString();
				_appendTemplate(`{${valueIndex}}/${targetValue}`);
			} else if (property.annotations?.UI?.DataFieldDefault?.Target?.$target?.$Type === UIAnnotationTypes.DataPointType) {
				// DataPoint use-case using DataFieldDefault.
				const dataPointDefaultProperty: Edm.PrimitiveType = property.annotations.UI.DataFieldDefault;
				valueIndex = _pushUnique(path, property);
				// New fake property created for the Rating/Progress Target Value. It'll be used for the export on split mode.
				_pushUnique(dataPointDefaultProperty.Target.value, property);
				targetValue = (
					dataPointDefaultProperty.Target.$target.TargetValue || dataPointDefaultProperty.Target.$target.TargetValue.MaximumValue
				).toString();
				_appendTemplate(`{${valueIndex}}/${targetValue}`);
			} else if (property.Target?.$target?.$Type === "com.sap.vocabularies.Communication.v1.ContactType") {
				relatedProperties.exportSettingsContactProperty =
					property.Target.value.substring(0, property.Target.value.indexOf("/") + 1) + property.Target.$target.fn?.path;
				valueIndex = _pushUnique(path, property.Target.$target.fn.$target);
				_appendTemplate(`{${valueIndex}}`);
			} else if (!ignoreSelf) {
				// Collect underlying property
				valueIndex = _pushUnique(path, property);
				_appendTemplate(`{${valueIndex}}`);
			}
		}

		relatedProperties = _collectAdditionalPropertiesForAnalyticalTable(property, navigationPathPrefix, tableType, relatedProperties);
		if (Object.keys(relatedProperties.additionalProperties).length > 0 && Object.keys(relatedProperties.properties).length === 0) {
			// Collect underlying property if not collected already.
			// This is to ensure that additionalProperties are made available only to complex property infos.
			valueIndex = _pushUnique(path, property);
			_appendTemplate(`{${valueIndex}}`);
		}
	}

	return relatedProperties;
}

/**
 * Collect properties consumed by a Data Field.
 * This is for populating the ComplexPropertyInfos of the table delegate.
 *
 * @param {DataFieldAbstractTypes} dataField The Data Field for which the properties need to be identified.
 * @param converterContext The converter context.
 * @param {TableType} tableType The table type.
 * @param {ComplexPropertyInfo} relatedProperties The properties identified so far.
 * @returns {ComplexPropertyInfo} The properties related to the Data Field.
 */
export function collectRelatedPropertiesRecursively(
	dataField: DataFieldAbstractTypes,
	converterContext: ConverterContext,
	tableType: TableType,
	relatedProperties: ComplexPropertyInfo = { properties: {}, additionalProperties: {} }
): ComplexPropertyInfo {
	if (dataField.$Type === UIAnnotationTypes.DataField && dataField.Value) {
		const property = dataField.Value;
		relatedProperties = collectRelatedProperties(
			property.path,
			property.$target,
			converterContext,
			false,
			tableType,
			relatedProperties
		);
		const navigationPathPrefix = _getNavigationPathPrefix(property.path);
		relatedProperties = _collectAdditionalPropertiesForAnalyticalTable(dataField, navigationPathPrefix, tableType, relatedProperties);
	} else if (dataField.$Type === UIAnnotationTypes.DataFieldForAnnotation) {
		switch (dataField.Target?.$target?.$Type) {
			case UIAnnotationTypes.FieldGroupType:
				dataField.Target.$target.Data?.forEach((innerDataField: DataFieldAbstractTypes) => {
					relatedProperties = collectRelatedPropertiesRecursively(innerDataField, converterContext, tableType, relatedProperties);
				});
				break;

			case UIAnnotationTypes.DataPointType:
				relatedProperties = collectRelatedProperties(
					dataField.Target.$target.Value.path,
					dataField,
					converterContext,
					false,
					tableType,
					relatedProperties
				);
				break;

			case "com.sap.vocabularies.Communication.v1.ContactType":
				relatedProperties = collectRelatedProperties(
					dataField.Target.value,
					dataField,
					converterContext,
					false,
					tableType,
					relatedProperties
				);
				break;
		}
	}

	return relatedProperties;
}

export const getDataFieldDataType = function(oDataField: DataFieldAbstractTypes | Property): string | undefined {
	let sDataType: string | undefined = (oDataField as DataFieldAbstractTypes).$Type;
	switch (sDataType) {
		case UIAnnotationTypes.DataFieldForAction:
		case UIAnnotationTypes.DataFieldForIntentBasedNavigation:
			sDataType = undefined;
			break;

		case UIAnnotationTypes.DataField:
		case UIAnnotationTypes.DataFieldWithNavigationPath:
		case UIAnnotationTypes.DataFieldWithUrl:
			sDataType = (oDataField as DataField)?.Value?.$target?.type;
			break;

		case UIAnnotationTypes.DataFieldForAnnotation:
		default:
			const sDataTypeForDataFieldForAnnotation = (oDataField as DataFieldForAnnotation).Target?.$target.$Type;
			if (sDataTypeForDataFieldForAnnotation) {
				if ((oDataField as DataFieldForAnnotation).Target?.$target.$Type === CommunicationAnnotationTypes.ContactType) {
					sDataType = (((oDataField as DataFieldForAnnotation).Target?.$target as Contact)?.fn as any).$target?.type;
				} else if ((oDataField as DataFieldForAnnotation).Target?.$target.$Type === UIAnnotationTypes.DataPointType) {
					sDataType =
						((oDataField as DataFieldForAnnotation).Target?.$target as DataPoint)?.Value?.$Path?.$Type ||
						((oDataField as DataFieldForAnnotation).Target?.$target as DataPoint)?.Value?.$target.type;
				} else {
					// e.g. FieldGroup or Chart
					sDataType = undefined;
				}
			} else {
				sDataType = undefined;
			}
			break;
	}

	return sDataType;
};
