/**
 * This helper class contains some methods used during the time of component creation (before the actual view is created)
 * and some methods used at runtime.
 * This is only so that all methods pertaining to the support of dateSettings be in one place.
 */
sap.ui.define(["sap/suite/ui/generic/template/genericUtilities/FeError", "sap/base/util/deepExtend", "sap/base/util/extend", "sap/base/util/isEmptyObject"], function (FeError, deepExtend, extend, isEmptyObject) {
	"use strict";
	var	sClassName = "listTemplates.semanticDateRangeTypeHelper";
	/**
	 * This function returns the metadata for dateSettings defined inside filterSettings in Manifest
	 * @returns {object} dateSettings metadata
	 */
	function getDateSettingsMetadata() {
		// Some property definitions are actually inherited from SFB/controlConfiguration. Ideally, we would just point to them, but unfortunately, exhaustive description from SFB seems to be missing, only some examples in API reference are provided.
		// Therefore, properties are described here according to current knowledge 
		var oFieldProperties = {
				useDateRange: {
					type: "boolean",
					defaultValue: false
				},
				selectedValues: { // Should be described by SFB. Apparently comma separated list of possible (semantic) values, examples from SFB show only single value. Apparently, SFB translates a filter 'contains "a,b"' to 'contains "a" or contains "b"'. 
					type: "string",
					defaultValue: ""
				},
				exclude: { // Should be described by SFB.
					type: "boolean",
					defaultValue: true
				},
				customDateRangeImplementation: { // Should be described by SFB.
					type: "string",
					defaultValue: ""
				},
				defaultValue: { // Should be described by SFB.
					type: "object",
					properties: {
						operation: {
							type: "string"
						}
					}
				},
				filter: { // Should be described by SFB.
					type: "array",
					arrayEntries: {
						type: "object",
						properties: {
							path: {
								type: "string"
							},
							equals: {
								type: "string"
							},
							contains: {
								type: "string"
							},
							exclude: {
								type: "boolean",
								defaultValue: false
							}
						}
					}
				}
		};
		// all properties defined on field level can also be defined on generic level (used as default for fields not explicitly mentioned)
		var oGenericProperties = extend({
			fields: { // Map - keys are property names (of EntitySet used for SFB)
				type: "object",
				mapEntryProperties: oFieldProperties
			}
		}, oFieldProperties);
		return {
			type: "object",
			properties: oGenericProperties
		};
	}

	/**
	 * METHODS USED FOR SETTING TEMPLATE SPECIFIC PARAMETERS WHILE COMPONENT IS CREATED STARTS HERE
	 */

	/**
	 * This function checks if a give property is eligible to be treated as a semantic date range.
	 * @param {object} oProperty indicates whether the property should be part of filter bar or not
	 * @return {boolean} Indicates if a given property is eligible to be treated as a semantic date range
	 */
	function isDateRange(oProperty) {
		return (((oProperty.type === "Edm.DateTime" && oProperty["sap:display-format"] === "Date") || (oProperty.type === "Edm.String" && oProperty["com.sap.vocabularies.Common.v1.IsCalendarDate"] && oProperty["com.sap.vocabularies.Common.v1.IsCalendarDate"].Bool === "true")) && oProperty["sap:filter-restriction"] === "interval");
	}
	/**
	 * This function returns the condition types for date properties
	 * @param {object} oDateRangeTypeConfiguration The manifest configuration for each date property
	 * @return {string} Group ID value
	 */
	function constructConditionTypeForDateProperties(oDateRangeTypeConfiguration) {
		var sConditionType;

		if (oDateRangeTypeConfiguration.customDateRangeImplementation) {
			sConditionType = oDateRangeTypeConfiguration.customDateRangeImplementation;
		} else if (oDateRangeTypeConfiguration.filter) {
			sConditionType = JSON.stringify({
				module: "sap.ui.comp.config.condition.DateRangeType",
				operations: {
					filter: oDateRangeTypeConfiguration.filter
				}
			});
		} else if (oDateRangeTypeConfiguration.selectedValues) {
			var oFilter = {
				path: "key",
				contains : oDateRangeTypeConfiguration.selectedValues,
				exclude: oDateRangeTypeConfiguration.exclude === undefined || oDateRangeTypeConfiguration.exclude
			};
			sConditionType = JSON.stringify({
				module: "sap.ui.comp.config.condition.DateRangeType",
				operations: {
					filter: [oFilter]
				}
			});
		} else if (oDateRangeTypeConfiguration.defaultValue) {
			sConditionType = JSON.stringify({
				module: "sap.ui.comp.config.condition.DateRangeType"
			});
		} else {
			throw new FeError(sClassName, "Wrong Date Range configuration set in manifest");
		}
		return sConditionType;
	}

	/**
	 * This function checks if a give property should be treated as a semantic date range.
	 * While isDateRange only checks from metadat/annotation perspective, here also manifest settings are checked
	 * @param {object} oDateSettings dateSettings from manifest
	 * @param {object} oProperty property to be checked
	 * @return {boolean} property should be treated as a semantic date range
	 */
	function isSemanticDateRange(oDateSettings, oProperty){
		// Copy relevant settings to be able to delete fields. If other fields are defined, but not the given one, and no default settings are provided, the given field must not be treated as semantic date range 
		var oRelevantSettings = extend({}, oDateSettings.fields && oDateSettings.fields[oProperty.name] || oDateSettings);
		delete oRelevantSettings.fields;
		// if none of the relevant properties is provided, but some unknown property, we would treat the field as semantic date range here, but constructConditionTypeForDateProperties would fail
		return isDateRange(oProperty) && !isEmptyObject(oRelevantSettings);
	}
	
	function getDateRangeFieldSettings(oPageSettings, oLeadingEntityType){
		if (!oPageSettings.filterSettings || !oPageSettings.filterSettings.dateSettings) {
			return [];
		}
		if (oPageSettings.filterSettings.dateSettings.useDateRange) {
			// SFB wide switch useDateRange must not be combined with specific settings on field level
			if (oPageSettings.filterSettings.dateSettings.fields) {
				throw new FeError(sClassName, "Setting 'useDateRange' property as True and maintaining property level configuration for date ranges in Date Settings are mutually exclusive, resulting in error. Change one of these settings in manifest.json as per your requirement.");
			}
			// Note: useDateRange is set directly on SFB (as property), in this case providing controlConfiguration with conditionType is not needed.
			// Same behavior could also be achieved by setting oPageSettings.filterSettings.dateSettings.defaultValue (= true) or by setting defaultValue per field.
		} else {
			return oLeadingEntityType.property.filter(isSemanticDateRange.bind(null, oPageSettings.filterSettings.dateSettings)).map(function(oProperty){
				return {
					key: oProperty.name,
					conditionType: constructConditionTypeForDateProperties(oPageSettings.filterSettings.dateSettings.fields && oPageSettings.filterSettings.dateSettings.fields[oProperty.name] || oPageSettings.filterSettings.dateSettings, oProperty)
				};
			});
		}
	}
	
	/**
	 * METHODS USED AT RUNTIME STARTS HERE
	 */

	/**
	 * Checks, whether setting service url is allowed while saving a tile
	 * @param {object} oSmartFilterBar SmartFilterBar instance
	 * @return {boolean} true, if setting service url is allowed. False, if not (i.e. at least one filter using semantic date range exists) 
	 */
	function isServiceUrlAllowedBySemanticDateRangeFilter(oSmartFilterBar, oComponentUtils) {
		/*
		Logic to decide which type of tile should be created if manifest configuration for semantic date range is defined.
		Case 1: useDateRange: true => Static tile should always be created
		case 2: selectedValues, customDateRangeImplementation, or filter defined under dateSettings: only create static tile, if filter for any semanticDateRangeProperty exists
		 */
		
		var oPageSettings = oComponentUtils.getSettings();
		if (!oPageSettings.filterSettings || !oPageSettings.filterSettings.dateSettings) {
			return true;
		}
		if (oPageSettings.filterSettings.dateSettings.useDateRange){
			return false;
		}
		var aFieldsWithValue = oSmartFilterBar.getFiltersWithValues();
		var aDateRangeProperties = oSmartFilterBar.getModel().getMetaModel().getODataEntityType(oSmartFilterBar.getEntityType()).property.filter(isSemanticDateRange.bind(null, oPageSettings.filterSettings.dateSettings));
		
		return !aFieldsWithValue.some(function(oFilterField){
			return aDateRangeProperties.some(function(oDateRangeProperty){
				return oFilterField.getName() === oDateRangeProperty.name;
			});
		});
	}

	/**
	 * Sets default operation for the semantic date field once the smartfilterbar is initialized
	 * @param {Object} oPageSettings - Listreport page settings from manifest
	 * @param {Object} oFilterBar - SmartFilter bar of ListReport
	 * @param {Object} oSemanticDates - SemanticDates in AppState
	 * @param {Object} oURLParameters URL parameters of the application
	 */
	function fnSetSemanticDateRangeDefaultValue(oPageSettings, oFilterBar, oSemanticDates, oURLParameters) {
		if (oPageSettings.filterSettings &&
			oPageSettings.filterSettings.dateSettings &&
			oPageSettings.filterSettings.dateSettings.fields) {
			var oDateFields = oPageSettings.filterSettings.dateSettings.fields;
			Object.entries(oDateFields).forEach(function(oDate) {
				var nSemanticDateIndex = -1;
				if (oSemanticDates && oSemanticDates.Dates) {
					nSemanticDateIndex = oSemanticDates.Dates.findIndex(function(oSemanticDate){
						return oSemanticDate.PropertyName === oDate[0];
					});
				}
				if ((nSemanticDateIndex === -1 || Object.keys(oURLParameters).indexOf(oDate[0]) === -1) && oDate[1].defaultValue) {
					oFilterBar.getConditionTypeByKey(oDate[0]).setOperation(oDate[1].defaultValue.operation);
				}
			});
		}
	}

	return {
		getDateSettingsMetadata: getDateSettingsMetadata,
		getDateRangeFieldSettings: getDateRangeFieldSettings,
		isServiceUrlAllowedBySemanticDateRangeFilter: isServiceUrlAllowedBySemanticDateRangeFilter,
		setSemanticDateRangeDefaultValue: fnSetSemanticDateRangeDefaultValue
	};
});
