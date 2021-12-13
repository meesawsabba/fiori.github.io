import { SelectOptionType, SelectionVariantTypeTypes } from "@sap-ux/vocabularies-types/dist/generated/UI";
import { createCondition } from "sap/ui/mdc/condition/Condition";
import { ConditionValidated } from "sap/ui/mdc/enum";

export type FilterConditions = {
	operator: string;
	values: Array<string>;
	isEmpty?: boolean | null;
	validated?: string;
};

const aValidTypes = [
	"Edm.Boolean",
	"Edm.Byte",
	"Edm.Date",
	"Edm.DateTime",
	"Edm.DateTimeOffset",
	"Edm.Decimal",
	"Edm.Double",
	"Edm.Float",
	"Edm.Guid",
	"Edm.Int16",
	"Edm.Int32",
	"Edm.Int64",
	"Edm.SByte",
	"Edm.Single",
	"Edm.String",
	"Edm.Time",
	"Edm.TimeOfDay"
];

const oExcludeMap: Record<string, any> = {
	"Contains": "NotContains",
	"StartsWith": "NotStartsWith",
	"EndsWith": "NotEndsWith",
	"Empty": "NotEmpty",
	"NotEmpty": "Empty",
	"LE": "NOTLE",
	"GE": "NOTGE",
	"LT": "NOTLT",
	"GT": "NOTGT",
	"BT": "NOTBT",
	"NE": "EQ",
	"EQ": "NE"
};

/**
 * Method to get the compliant value type based on the data type.
 *
 * @param  sValue Raw value
 * @param  sType The property type
 * @returns Value to be propagated to the condition.
 */

export function getTypeCompliantValue(sValue: any, sType: string) {
	let oValue;
	if (aValidTypes.indexOf(sType) > -1) {
		oValue = sValue;
		if (sType === "Edm.Boolean") {
			oValue = sValue === "true" || (sValue === "false" ? false : undefined);
		} else if (sType === "Edm.Double" || sType === "Edm.Single") {
			oValue = isNaN(sValue) ? undefined : parseFloat(sValue);
		} else if (sType === "Edm.Byte" || sType === "Edm.Int16" || sType === "Edm.Int32" || sType === "Edm.SByte") {
			oValue = isNaN(sValue) ? undefined : parseInt(sValue, 10);
		} else if (sType === "Edm.Date") {
			oValue = sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
				? sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)[0]
				: sValue.match(/^(\d{8})/) && sValue.match(/^(\d{8})/)[0];
		} else if (sType === "Edm.DateTimeOffset") {
			if (sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})\+(\d{1,4})/)) {
				oValue = sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})\+(\d{1,4})/)[0];
			} else if (sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})/)) {
				oValue = sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})/)[0] + "+0000";
			} else if (sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)) {
				oValue = sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)[0] + "T00:00:00+0000";
			} else if (sValue.indexOf("Z") === sValue.length - 1) {
				oValue = sValue.split("Z")[0] + "+0100";
			} else {
				oValue = undefined;
			}
		} else if (sType === "Edm.TimeOfDay") {
			oValue = sValue.match(/(\d{1,2}):(\d{1,2}):(\d{1,2})/) ? sValue.match(/(\d{1,2}):(\d{1,2}):(\d{1,2})/)[0] : undefined;
		}
	}
	return oValue;
}

/**
 * Method to create a condition.
 * @param  sOption Operator to be used.
 * @param  oV1 Lower value
 * @param  oV2 Higher value
 * @param sSign
 * @returns Condition to be created
 */
export function resolveConditionValues(sOption: string | undefined, oV1: any, oV2: any, sSign: string | undefined) {
	let oValue = oV1,
		oValue2,
		sInternalOperation: any;
	const oCondition: Record<string, FilterConditions[]> = {};
	oCondition.values = [];
	oCondition.isEmpty = null as any;
	if (oV1 === undefined || oV1 === null) {
		return;
	}

	switch (sOption) {
		case "CP":
			sInternalOperation = "Contains";
			if (oValue) {
				const nIndexOf = oValue.indexOf("*");
				const nLastIndex = oValue.lastIndexOf("*");

				// only when there are '*' at all
				if (nIndexOf > -1) {
					if (nIndexOf === 0 && nLastIndex !== oValue.length - 1) {
						sInternalOperation = "EndsWith";
						oValue = oValue.substring(1, oValue.length);
					} else if (nIndexOf !== 0 && nLastIndex === oValue.length - 1) {
						sInternalOperation = "StartsWith";
						oValue = oValue.substring(0, oValue.length - 1);
					} else {
						oValue = oValue.substring(1, oValue.length - 1);
					}
				} else {
					/* TODO Add diagonostics Log.warning("Contains Option cannot be used without '*'.") */
					return;
				}
			}
			break;
		case "EQ":
			sInternalOperation = oV1 === "" ? "Empty" : sOption;
			break;
		case "NE":
			sInternalOperation = oV1 === "" ? "NotEmpty" : sOption;
			break;
		case "BT":
			if (oV2 === undefined || oV2 === null) {
				return;
			}
			oValue2 = oV2;
			sInternalOperation = sOption;
			break;
		case "LE":
		case "GE":
		case "GT":
		case "LT":
			sInternalOperation = sOption;
			break;
		default:
			/* TODO Add diagonostics Log.warning("Selection Option is not supported : '" + sOption + "'"); */
			return;
	}
	if (sSign === "E") {
		sInternalOperation = oExcludeMap[sInternalOperation];
	}
	oCondition.operator = sInternalOperation;
	if (sInternalOperation !== "Empty") {
		oCondition.values.push(oValue);
		if (oValue2) {
			oCondition.values.push(oValue2);
		}
	}
	return oCondition;
}

/* Method to get the operator from the Selection Option */
export function getOperator(sOperator: string): string {
	return sOperator.indexOf("/") > 0 ? sOperator.split("/")[1] : sOperator;
}

export function getFiltersConditionsFromSelectionVariant(
	entityTypeProperties: Record<string, object>,
	selectionVariant: SelectionVariantTypeTypes,
	getCustomConditions?: Function
): Record<string, FilterConditions[]> {
	const ofilterConditions: Record<string, FilterConditions[]> = {};
	if (selectionVariant) {
		const aSelectOptions = selectionVariant.SelectOptions;
		const aParameters = selectionVariant.Parameters;
		const aValidProperties = entityTypeProperties;
		aSelectOptions?.forEach((selectOption: SelectOptionType) => {
			const propertyName: any = selectOption.PropertyName;
			const sPropertyName: string = propertyName.value || propertyName.$PropertyPath;
			const Ranges: any = selectOption.Ranges;
			for (const key in aValidProperties) {
				if (sPropertyName === key) {
					const oValidProperty = aValidProperties[key] as any;
					const aConditions: any[] = [];
					Ranges?.forEach((Range: any) => {
						const oCondition = getCustomConditions
							? getCustomConditions(Range, oValidProperty, sPropertyName)
							: getConditions(Range, oValidProperty);
						aConditions.push(oCondition);
						if (aConditions.length) {
							ofilterConditions[sPropertyName] = (ofilterConditions[sPropertyName] || []).concat(aConditions);
						}
					});
				}
			}
		});
		aParameters?.forEach((parameter: any) => {
			const sPropertyPath = parameter.PropertyName.value || parameter.PropertyName.$PropertyPath;
			const oCondition: any = getCustomConditions
				? { operator: "EQ", value1: parameter.PropertyValue, value2: null, path: sPropertyPath, isParameter: true }
				: {
						operator: "EQ",
						values: [parameter.PropertyValue],
						isEmpty: null,
						validated: ConditionValidated.Validated,
						isParameter: true
				  };
			ofilterConditions[sPropertyPath] = [oCondition];
		});
	}
	return ofilterConditions;
}

export function getConditions(Range: any, oValidProperty: any) {
	let oCondition;
	const sign: string | undefined = Range.Sign;
	const sOption: string | undefined = Range.Option ? getOperator(Range.Option) : undefined;
	const oValue1: any = getTypeCompliantValue(Range.Low, oValidProperty.$Type);
	const oValue2: any = Range.High ? getTypeCompliantValue(Range.High, oValidProperty.$Type) : undefined;
	const oConditionValues = resolveConditionValues(sOption, oValue1, oValue2, sign) as any;
	if (oConditionValues) {
		oCondition = createCondition(oConditionValues.operator, oConditionValues.values, null, null, ConditionValidated.Validated);
	}
	return oCondition;
}

const getDefaultValueFilters = function(oContext: any, properties: any): Record<string, FilterConditions[]> {
	const filterConditions: Record<string, FilterConditions[]> = {};
	const entitySetPath = oContext.getInterface(1).getPath(),
		oMetaModel = oContext.getInterface(1).getModel();
	if (properties) {
		for (const key in properties) {
			const defaultFilterValue = oMetaModel.getObject(
				entitySetPath + "/" + key + "@com.sap.vocabularies.Common.v1.FilterDefaultValue"
			);
			if (defaultFilterValue !== undefined) {
				const PropertyName = key;
				filterConditions[PropertyName] = [
					createCondition("EQ", [defaultFilterValue], null, null, ConditionValidated.Validated) as FilterConditions
				];
			}
		}
	}
	return filterConditions;
};

const getDefaultSemanticDateFilters = function(
	oContext: any,
	properties: any,
	defaultSemanticDates: any
): Record<string, FilterConditions[]> {
	const filterConditions: Record<string, FilterConditions[]> = {};
	if (properties) {
		for (const key in properties) {
			// currently defaultSemanticDates can support only one entry, we pick the first one directly using 0 index
			if (defaultSemanticDates[key] && defaultSemanticDates[key][0]) {
				filterConditions[key] = [createCondition(defaultSemanticDates[key][0].operator, [], null, null, null) as FilterConditions];
			}
		}
	}
	return filterConditions;
};

function getEditStatusFilter(): Record<string, FilterConditions[]> {
	const ofilterConditions: Record<string, FilterConditions[]> = {};
	ofilterConditions["$editState"] = [
		createCondition("DRAFT_EDIT_STATE", ["ALL"], null, null, ConditionValidated.Validated) as FilterConditions
	];
	return ofilterConditions;
}

export function getFilterConditions(oContext: any, filterConditions: any): Record<string, FilterConditions[]> {
	let editStateFilter;
	const entitySetPath = oContext.getInterface(1).getPath(),
		oMetaModel = oContext.getInterface(1).getModel(),
		entityTypeAnnotations = oMetaModel.getObject(entitySetPath + "@"),
		entityTypeProperties = oMetaModel.getObject(entitySetPath + "/");
	if (
		entityTypeAnnotations["@com.sap.vocabularies.Common.v1.DraftRoot"] ||
		entityTypeAnnotations["@com.sap.vocabularies.Common.v1.DraftNode"]
	) {
		editStateFilter = getEditStatusFilter();
	}
	const selectionVariant = filterConditions?.selectionVariant;
	const defaultSemanticDates = filterConditions?.defaultSemanticDates || {};
	const defaultFilters = getDefaultValueFilters(oContext, entityTypeProperties);
	const defaultSemanticDateFilters = getDefaultSemanticDateFilters(oContext, entityTypeProperties, defaultSemanticDates);
	if (selectionVariant) {
		filterConditions = getFiltersConditionsFromSelectionVariant(entityTypeProperties, selectionVariant);
	} else if (defaultFilters) {
		filterConditions = defaultFilters;
	}
	if (defaultSemanticDateFilters) {
		// only for semantic date:
		// 1. value from manifest get merged with SV
		// 2. manifest value is given preference when there is same semantic date property in SV and manifest
		filterConditions = { ...filterConditions, ...defaultSemanticDateFilters };
	}
	if (editStateFilter) {
		filterConditions = { ...filterConditions, ...editStateFilter };
	}
	return (Object.keys(filterConditions).length > 0 ? JSON.stringify(filterConditions) : undefined) as any;
}

getFilterConditions.requiresIContext = true;
