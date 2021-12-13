/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/ui/mdc/condition/Condition",
		"sap/base/Log",
		"sap/ui/mdc/util/FilterUtil",
		"sap/ui/mdc/util/DateUtil",
		"sap/fe/macros/CommonHelper",
		"sap/fe/core/templating/FilterHelper",
		"sap/fe/core/controls/filterbar/utils/VisualFilterUtils",
		"sap/fe/macros/filter/FilterUtils"
	],
	function(Condition, Log, MdcFilterUtil, DateUtil, CommonHelper, FilterHelper, VisualFilterUtils, FilterUtils) {
		"use strict";
		/**
		 * Static class used by Visual Filter during runtime
		 *
		 * @private
		 * @experimental This module is only for internal/experimental use!
		 */
		var VisualFilterRuntime = {
			selectionChanged: function(oEvent) {
				var oInteractiveChart = oEvent.getSource(),
					sOutParameter = oInteractiveChart.data("outParameter"),
					sDimension = oInteractiveChart.data("dimension"),
					sDimensionText = oInteractiveChart.data("dimensionText"),
					bMultipleSelectionAllowed = oInteractiveChart.data("multipleSelectionAllowed"),
					sDimensionType = oInteractiveChart.data("dimensionType"),
					oSelectedAggregation = oEvent.getParameter("bar") || oEvent.getParameter("point") || oEvent.getParameter("segment"),
					bIsAggregationSelected = oEvent.getParameter("selected"),
					oConditionModel = oInteractiveChart.getModel("$field"),
					aConditions = oConditionModel.getProperty("/conditions");

				if (!sOutParameter || sOutParameter !== sDimension) {
					Log.error("VisualFilter: Cannot sync values with regular filter as out parameter is not configured properly!");
				} else {
					var sSelectionChangedValue = oSelectedAggregation.getBindingContext().getObject(sOutParameter);
					if (sSelectionChangedValue) {
						var sSelectionChangedValueText = oSelectedAggregation.getBindingContext().getObject(sDimensionText);
						if (typeof sSelectionChangedValueText !== "string" && !(sSelectionChangedValueText instanceof String)) {
							sSelectionChangedValueText = undefined;
						}
						// if selection has been done on the aggregation then add to conditions
						if (bIsAggregationSelected) {
							if (bMultipleSelectionAllowed === "false") {
								aConditions = [];
							}
							if (sDimensionType === "Edm.DateTimeOffset") {
								sSelectionChangedValue = VisualFilterUtils._parseDateTime(sSelectionChangedValue);
							}
							var oCondition = Condition.createItemCondition(sSelectionChangedValue, sSelectionChangedValueText || undefined);
							aConditions.push(oCondition);
						} else {
							// because selection was removed on the aggregation hence remove this from conditions
							aConditions = aConditions.filter(function(oCondition) {
								if (sDimensionType === "Edm.DateTimeOffset") {
									return (
										oCondition.operator !== "EQ" ||
										Date.parse(oCondition.values[0]) !== Date.parse(sSelectionChangedValue)
									);
								}
								return oCondition.operator !== "EQ" || oCondition.values[0] !== sSelectionChangedValue;
							});
						}
						oConditionModel.setProperty("/conditions", aConditions);
					} else {
						Log.error("VisualFilter: No vaue found for the outParameter");
					}
				}
			},
			getAggregationSelected: function(aConditions) {
				var aSelectableValues = [];
				if (!this.getBindingContext()) {
					return;
				}
				for (var i = 0; i <= aConditions.length - 1; i++) {
					var oCondition = aConditions[i];
					// 1. get conditions with EQ operator (since visual filter can only deal with EQ operators) and get their values
					if (oCondition.operator === "EQ") {
						aSelectableValues.push(oCondition.values[0]);
					}
				}

				// access the interactive chart from the control.
				var oInteractiveChart = this.getParent(),
					sDimension = oInteractiveChart.data("dimension"),
					sDimensionType = oInteractiveChart.data("dimensionType"),
					sDimensionValue = this.getBindingContext().getObject(sDimension);
				if (sDimensionType === "Edm.DateTimeOffset") {
					sDimensionValue = VisualFilterUtils._parseDateTime(sDimensionValue);
				}
				return aSelectableValues.indexOf(sDimensionValue) > -1;
			},
			getFiltersFromConditions: function() {
				var oInteractiveChart = this.getParent(),
					oFilterBar = oInteractiveChart
						.getParent()
						.getParent()
						.getParent()
						.getParent(),
					aInParameters = oInteractiveChart.data("inParameters").customData,
					aPropertyInfoSet = oFilterBar.getPropertyInfoSet(),
					aArguments = [].slice.call(arguments),
					mConditions = {},
					aValueListPropertyInfoSet = [],
					oFilters,
					aParameters = oInteractiveChart.data("parameters").customData,
					oSelectionVariantAnnotation = CommonHelper.parseCustomData(oInteractiveChart.data("selectionVariantAnnotation")),
					oInteractiveChartListBinding =
						oInteractiveChart.getBinding("bars") ||
						oInteractiveChart.getBinding("points") ||
						oInteractiveChart.getBinding("segments"),
					sPath = oInteractiveChartListBinding.getPath(),
					oMetaModel = oInteractiveChart.getModel().getMetaModel(),
					entityTypeProperties = oMetaModel.getObject(sPath + "/");
				var filterConditions = FilterHelper.getFiltersConditionsFromSelectionVariant(
					entityTypeProperties,
					oSelectionVariantAnnotation,
					VisualFilterUtils.getCustomConditions.bind(VisualFilterUtils)
				);
				var oSelectionVariantConditions = VisualFilterUtils.convertFilterCondions(filterConditions);
				// aInParameters and the bindings to in parameters are in the same order so we can rely on it to create our conditions
				Object.keys(oSelectionVariantConditions).forEach(function(sKey) {
					mConditions[sKey] = oSelectionVariantConditions[sKey];
					//fetch localDataProperty if selection variant key is based on vaue list property
					var inParameterForKey = aInParameters.find(function(inParameter) {
						return inParameter.valueListProperty === sKey;
					});
					var localDataProperty = inParameterForKey ? inParameterForKey.localDataProperty : sKey;
					if (!aParameters || (aParameters && aParameters.indexOf(sKey) === -1)) {
						for (var i = 0; i < aPropertyInfoSet.length; i++) {
							if (localDataProperty === aPropertyInfoSet[i].name) {
								if (aPropertyInfoSet[i].typeConfig.baseType === "DateTime") {
									if (mConditions[sKey]) {
										mConditions[sKey].forEach(function(condition) {
											condition.values[0] = VisualFilterUtils._formatDateTime(condition.values[0]);
										});
									}
								}
								aValueListPropertyInfoSet.push({
									name: sKey,
									typeConfig: aPropertyInfoSet[i].typeConfig
								});
							}
						}
					}
				});
				aInParameters.forEach(function(oInParameter, index) {
					if (aArguments[index].length > 0) {
						// store conditions with value list property since we are filtering on the value list collection path
						mConditions[oInParameter.valueListProperty] = aArguments[index];
						if (!aParameters || (aParameters && aParameters.indexOf(oInParameter.valueListProperty) === -1)) {
							// aPropertyInfoSet is list of properties from the filter bar but we need to create conditions for the value list
							// which could have a different collectionPath.
							// Only typeConfig from aPropertyInfoSet is required for getting the converted filters from conditions
							// so we update aPropertyInfoSet to have the valueListProperties only
							// This way conditions will be converted to sap.ui.model.Filter for the value list
							// This works because for in parameter mapping the property from the main entity type should be of the same type as the value list entity type
							// TODO: Follow up with MDC to check if they can provide a clean api to convert conditions into filters
							for (var i = 0; i < aPropertyInfoSet.length; i++) {
								// store conditions with value list property since we are filtering on the value list collection path
								if (aPropertyInfoSet[i].name === oInParameter.localDataProperty) {
									if (aPropertyInfoSet[i].typeConfig.baseType === "DateTime") {
										if (mConditions[oInParameter.valueListProperty]) {
											mConditions[oInParameter.valueListProperty].forEach(function(condition) {
												condition.values[0] = VisualFilterUtils._formatDateTime(condition.values[0]);
											});
										}
									}
									aValueListPropertyInfoSet.push({
										name: oInParameter.valueListProperty,
										typeConfig: aPropertyInfoSet[i].typeConfig
									});
								}
							}
						}
					}
				});

				var oInternalModelContext = oInteractiveChart.getBindingContext("internal");
				var sInfoPath = oInteractiveChart.data("infoPath");
				var bEnableBinding;
				var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.macros");
				var aRequiredProperties = CommonHelper.parseCustomData(oInteractiveChart.data("requiredProperties"));
				if (aRequiredProperties.length) {
					var aConditions = Object.keys(mConditions) || [];
					var aNotMatchedConditions = [];
					aRequiredProperties.forEach(function(sPath) {
						if (aConditions.indexOf(sPath) === -1) {
							aNotMatchedConditions.push(sPath);
						}
					});
					if (!aNotMatchedConditions.length) {
						bEnableBinding = oInternalModelContext.getProperty(sInfoPath + "/showError");
						oInternalModelContext.setProperty(sInfoPath, {
							"errorMessageTitle": "",
							"errorMessage": "",
							"showError": false
						});
					} else if (aNotMatchedConditions.length > 1) {
						oInternalModelContext.setProperty(sInfoPath, {
							"errorMessageTitle": oResourceBundle.getText("M_VISUAL_FILTERS_ERROR_MESSAGE_TITLE"),
							"errorMessage": oResourceBundle.getText("M_VISUAL_FILTERS_PROVIDE_FILTER_VAL_MULTIPLEVF"),
							"showError": true
						});
						return;
					} else {
						var oMetaModel = oInteractiveChart.getModel().getMetaModel();
						var sEntitySetPath = oInteractiveChartListBinding.getPath();
						var sLabel =
							oMetaModel.getObject(
								sEntitySetPath + "/" + aNotMatchedConditions[0] + "@com.sap.vocabularies.Common.v1.Label"
							) || aNotMatchedConditions[0];
						oInternalModelContext.setProperty(sInfoPath, {
							"errorMessageTitle": oResourceBundle.getText("M_VISUAL_FILTERS_ERROR_MESSAGE_TITLE"),
							"errorMessage": oResourceBundle.getText("M_VISUAL_FILTERS_PROVIDE_FILTER_VAL_SINGLEVF", sLabel),
							"showError": true
						});
						return;
					}
				} else {
					bEnableBinding = oInternalModelContext.getProperty(sInfoPath + "/showError");
					oInternalModelContext.setProperty(sInfoPath, { "errorMessageTitle": "", "errorMessage": "", "showError": false });
				}

				var sFilterEntityName = oFilterBar.data("entityType").split("/")[1];
				var sChartEntityName = sPath.split("/")[1].split("(")[0];
				if (aParameters && aParameters.length && sFilterEntityName === sChartEntityName) {
					var sBindingPath = bEnableBinding
						? FilterUtils.getBindingPathForParameters(oFilterBar, mConditions, aPropertyInfoSet, aParameters)
						: undefined;

					if (sBindingPath) {
						oInteractiveChartListBinding.sPath = sBindingPath;
					}
				}

				if (aParameters && aParameters.length) {
					//Remove parameters from mConditions since it should not be a part of $filter
					aParameters.forEach(function(parameter) {
						if (mConditions[parameter]) {
							delete mConditions[parameter];
						}
					});
				}

				//Only keep the actual value of filters and remove type informations
				Object.keys(mConditions).forEach(function(key) {
					mConditions[key].forEach(function(condition) {
						if (condition.values.length > 1) {
							condition.values = condition.values.slice(0, 1);
						}
					});
				});
				// On InitialLoad when initiallayout is visual, aPropertyInfoSet is always empty and we cannot get filters from MDCFilterUtil.
				// Also when SVQualifier is there then we should not change the listbinding filters to empty as we are not getting filters from MDCFilterUtil but
				// instead we need to not call listbinding.filter and use the template time binding itself.
				if (Object.keys(mConditions).length > 0 && aValueListPropertyInfoSet.length) {
					oFilters = MdcFilterUtil.getFilterInfo(oFilterBar, mConditions, aValueListPropertyInfoSet).filters;
					oInteractiveChartListBinding.filter(oFilters);
				} else if (!Object.keys(mConditions).length) {
					oInteractiveChartListBinding.filter();
				}
				// update the interactive chart binding
				if (bEnableBinding && oInteractiveChartListBinding.isSuspended()) {
					oInteractiveChartListBinding.resume();
				}
				return oFilters;
			},
			getFilterCounts: function(oConditions) {
				if (oConditions.length > 0) {
					return "(" + oConditions.length + ")";
				} else {
					return undefined;
				}
			},

			scaleVisualFilterValue: function(oValue, scaleFactor, numberOfFractionalDigits, currency) {
				// ScaleFactor if defined is priority for formatting
				if (scaleFactor) {
					var nScaledValue = VisualFilterUtils.getFormattedNumber(oValue, scaleFactor, numberOfFractionalDigits);
					return nScaledValue;
					// If Scale Factor is not defined, use currency formatting
				} else if (currency) {
					var nCurrencyValue = VisualFilterUtils.getFormattedNumber(oValue, null, null, currency);
					return nCurrencyValue;
					// No ScaleFactor and no Currency, use numberOfFractionalDigits defined in DataPoint
				} else if (numberOfFractionalDigits > 0) {
					// Number of fractional digits shall not exceed 2, unless required by currency
					numberOfFractionalDigits > 2 ? 2 : numberOfFractionalDigits;
					var nValueWithDecimals = VisualFilterUtils.getFormattedNumber(oValue, null, numberOfFractionalDigits);
					return nValueWithDecimals;
				} else {
					return oValue;
				}
			},
			fireValueHelp: function(oEvent) {
				oEvent
					.getSource()
					.getParent()
					.getParent()
					.getParent()
					.fireValueHelpRequest();
			}
		};
		return VisualFilterRuntime;
	},
	/* bExport= */ true
);
