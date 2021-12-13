/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"sap/ui/mdc/util/FilterUtil",
		"sap/ui/fl/Utils",
		"sap/ui/core/Core",
		"sap/fe/macros/CommonHelper",
		"sap/fe/core/CommonUtils",
		"sap/fe/core/helpers/ModelHelper",
		"sap/ui/model/Filter",
		"sap/fe/macros/DelegateUtil",
		"sap/fe/core/converters/controls/ListReport/FilterBar",
		"sap/fe/core/converters/ConverterContext",
		"sap/fe/core/converters/MetaModelConverter",
		"sap/base/util/merge",
		"sap/ui/model/json/JSONModel",
		"sap/ui/mdc/field/ConditionsType",
		"sap/ui/mdc/p13n/StateUtil",
		"sap/ui/mdc/condition/ConditionConverter",
		"sap/ui/model/odata/v4/ODataUtils",
		"sap/fe/macros/ODataMetaModelUtil",
		"sap/base/Log"
	],
	function(
		FilterUtil,
		FlUtils,
		Core,
		CommonHelper,
		CommonUtils,
		ModelHelper,
		Filter,
		DelegateUtil,
		FilterBarConverter,
		ConverterContext,
		MetaModelConverter,
		merge,
		JSONModel,
		ConditionsType,
		StateUtil,
		ConditionConverter,
		ODataUtils,
		MetaModelUtil,
		Log
	) {
		"use strict";

		var oFilterUtils = {
			getFilter: function(vIFilter) {
				var aFilters = oFilterUtils.getFilterInfo(vIFilter).filters;
				return aFilters.length ? new Filter(oFilterUtils.getFilterInfo(vIFilter).filters, false) : undefined;
			},
			getConvertedFilterFields: function(oFilterControl, sEntityTypePath) {
				var sFilterEntityTypePath = DelegateUtil.getCustomData(oFilterControl, "entityType"),
					sFilterEntityPath = ModelHelper.getEntitySetPath(sFilterEntityTypePath),
					sEntitySetPath = sEntityTypePath && ModelHelper.getEntitySetPath(sEntityTypePath),
					sTargetEntityPath = sEntitySetPath || sFilterEntityPath,
					sTargetEntitySetName = sTargetEntityPath ? sTargetEntityPath.slice(1) : sTargetEntityPath,
					sCustomDataPath =
						"selectionFields" +
						(!sTargetEntityPath || sFilterEntityPath === sTargetEntityPath ? "" : "For" + sTargetEntitySetName),
					aSelectionFields = DelegateUtil.getCustomData(oFilterControl, sCustomDataPath);

				if (!aSelectionFields && (!sTargetEntityPath || !(oFilterControl.data instanceof Function))) {
					return [];
				} else if (!aSelectionFields) {
					/**
					 * Gets fields from
					 * 	- direct entity properties,
					 * 	- navigateProperties key in the manifest if these properties are known by the entity
					 *  - annotation "SelectionFields"
					 */
					var oView = FlUtils.getViewForControl(oFilterControl);
					var oMetaModel = oFilterControl.getModel().getMetaModel();
					var oAppComponent = CommonUtils.getAppComponent(oView);
					var oVisualizationObjectPath = MetaModelConverter.getInvolvedDataModelObjects(
						oMetaModel.createBindingContext("/" + sTargetEntitySetName)
					);

					var oConverterContext = ConverterContext.createConverterContextForMacro(
						oVisualizationObjectPath.startingEntitySet.name,
						oMetaModel,
						oAppComponent && oAppComponent.getDiagnostics(),
						merge,
						oVisualizationObjectPath.contextLocation,
						oView && oView.getViewData()
					);

					aSelectionFields = FilterBarConverter.getSelectionFields(oConverterContext);
					if (oFilterControl.isA("sap.ui.mdc.FilterBar") && sEntitySetPath !== sFilterEntityPath) {
						/**
						 * We are on multi entity sets scenario so we add annotation "SelectionFields"
						 * from FilterBar entity if these properties are known by the entity
						 */
						var oPageContext = oConverterContext.getConverterContextFor(sFilterEntityPath);
						var aFilterBarSelectionFieldsAnnotation =
							oPageContext.getEntityTypeAnnotation("@com.sap.vocabularies.UI.v1.SelectionFields").annotation || [];
						var mapSelectionFields = {};
						aSelectionFields.forEach(function(oSelectionField) {
							mapSelectionFields[oSelectionField.conditionPath] = true;
						});

						aFilterBarSelectionFieldsAnnotation.forEach(function(oFilterBarSelectionFieldAnnotation) {
							var sPath = oFilterBarSelectionFieldAnnotation.value;
							if (!mapSelectionFields[sPath]) {
								var oFilterField = FilterBarConverter.getFilterField(
									sPath,
									oConverterContext,
									oVisualizationObjectPath.startingEntitySet.entityType
								);
								if (oFilterField) {
									aSelectionFields.push(oFilterField);
								}
							}
						});
					}

					DelegateUtil.setCustomData(oFilterControl, sCustomDataPath, aSelectionFields);
				}
				return CommonHelper.parseCustomData(aSelectionFields);
			},

			getBindingPathForParameters: function(oIFilter, mConditions, aFilterPropertiesMetadata, aParameters) {
				var sBindingPath,
					aParams = [];

				// Collecting all parameter values from conditions
				for (var i = 0; i < aParameters.length; i++) {
					var sFieldPath = aParameters[i];
					if (mConditions[sFieldPath] && mConditions[sFieldPath].length > 0) {
						// We would be using only the first condition for parameter value.
						var oConditionInternal = merge({}, mConditions[sFieldPath][0]);
						var oProperty = FilterUtil.getPropertyByKey(aFilterPropertiesMetadata, sFieldPath);
						var mInternalParameterCondition = ConditionConverter.toType(
							oConditionInternal,
							oProperty.typeConfig,
							oIFilter.getTypeUtil()
						);
						var sEdmType = oProperty.typeConfig.className;
						aParams.push(
							sFieldPath + "=" + encodeURIComponent(ODataUtils.formatLiteral(mInternalParameterCondition.values[0], sEdmType))
						);
					}
				}

				// Binding path from EntityType
				var sEntityTypePath = oIFilter.data("entityType");
				var sEntitySetPath = sEntityTypePath.substring(0, sEntityTypePath.length - 1);
				var sParameterEntitySet = sEntitySetPath.slice(0, sEntitySetPath.lastIndexOf("/"));
				var sTargetNavigation = sEntitySetPath.substring(sEntitySetPath.lastIndexOf("/") + 1);
				// create parameter context
				sBindingPath = sParameterEntitySet + "(" + aParams.toString() + ")/" + sTargetNavigation;

				return sBindingPath;
			},

			getEditStateIsHideDraft: function(mConditions) {
				var bIsHideDraft = false;
				if (mConditions && mConditions.$editState) {
					var oCondition = mConditions.$editState.find(function(condition) {
						return condition.operator === "DRAFT_EDIT_STATE";
					});
					if (oCondition && oCondition.values.includes("ALL_HIDING_DRAFTS")) {
						bIsHideDraft = true;
					}
				}
				return bIsHideDraft;
			},
			/**
			 * Gets all filters that originate from the MDC FilterBar.
			 *
			 * @param {object|string} vIFilter String or object instance related to
			 *  - MDC FilterBar/Table/Chart
			 * @param {object} mProperties Properties on filters that are to be retrieved. Available parameters:
			 * 	 - ignoredProperties: Array of property names which should be not considered for filtering
			 *	 - propertiesMetadata: Array with all the property metadata. If not provided, properties will be retrieved from vIFilter.
			 *	 - targetControl: MDC table or chart. If provided, property names which are not relevant for the target control entitySet are not considered.
			 * @param {map} mFilterConditions Map with externalized filter conditions.
			 * @returns {object} FilterBar filters and basic search
			 * @private
			 * @ui5-restricted
			 */
			getFilterInfo: function(vIFilter, mProperties, mFilterConditions) {
				var oIFilter = vIFilter,
					sSearch,
					sBindingPath,
					aFilters = [],
					aIgnoreProperties = (mProperties && mProperties.ignoredProperties) || [],
					aPropertiesMetadata = mProperties && mProperties.propertiesMetadata,
					oTargetControl = mProperties && mProperties.targetControl,
					sTargetEntityPath = oTargetControl ? oTargetControl.data("entityType") : undefined;
				if (typeof vIFilter === "string") {
					oIFilter = Core.byId(vIFilter);
				}
				if (oIFilter) {
					sSearch = oIFilter.getSearch && aIgnoreProperties.indexOf("search") === -1 ? oIFilter.getSearch() : null;
					var mConditions = mFilterConditions || oIFilter.getConditions(),
						aFilterPropertiesMetadata = oIFilter.getPropertyInfoSet ? oIFilter.getPropertyInfoSet() : null;
					var aParameters = oIFilter.data("parameters") || [];
					if (aParameters.length > 0) {
						// Binding path changes in case of parameters.
						sBindingPath = oFilterUtils.getBindingPathForParameters(
							oIFilter,
							mConditions,
							aFilterPropertiesMetadata,
							aParameters
						);
					}
					if (mConditions) {
						//Exclude Interface Filter properties that are not relevant for the Target control entitySet
						if (sTargetEntityPath && oIFilter.data("entityType") !== sTargetEntityPath) {
							var oMetaModel = oIFilter.getModel().getMetaModel();
							var aTargetPropertiesMetadata = oIFilter
								.getControlDelegate()
								.fetchPropertiesForEntity(sTargetEntityPath, oMetaModel, oIFilter);
							aPropertiesMetadata = aTargetPropertiesMetadata;

							var mEntityProperties = {};
							for (var i = 0; i < aTargetPropertiesMetadata.length; i++) {
								var oEntityProperty = aTargetPropertiesMetadata[i];
								mEntityProperties[oEntityProperty.name] = true;
							}
							aFilterPropertiesMetadata.forEach(function(oIFilterProperty) {
								var sIFilterPropertyName = oIFilterProperty.name;
								if (!mEntityProperties[sIFilterPropertyName]) {
									aIgnoreProperties.push(sIFilterPropertyName);
								}
							});
						} else if (!aPropertiesMetadata) {
							aPropertiesMetadata = aFilterPropertiesMetadata;
						}
						var oFilter = FilterUtil.getFilterInfo(
							oIFilter,
							mConditions,
							aPropertiesMetadata,
							aIgnoreProperties.concat(aParameters)
						).filters;
						aFilters = oFilter ? [oFilter] : [];
					}
				}
				return { filters: aFilters, search: sSearch || undefined, bindingPath: sBindingPath };
			},
			getNotApplicableFilters: function(oFilterBar, oControl) {
				var sTargetEntityTypePath = oControl.data("entityType"),
					aNotApplicable = [],
					mConditions = oFilterBar.getConditions(),
					oMetaModel = oFilterBar.getModel().getMetaModel(),
					bIsFilterBarEntityType = sTargetEntityTypePath === oFilterBar.data("entityType"),
					bIsChart = oControl.isA("sap.ui.mdc.ChartNew"),
					bIsAnalyticalTable = !bIsChart && DelegateUtil.getCustomData(oControl, "enableAnalytics") === "true";
				if (mConditions && (!bIsFilterBarEntityType || bIsAnalyticalTable || bIsChart)) {
					// We don't need to calculate the difference on property Level if entity sets are identical
					var aTargetProperties = bIsFilterBarEntityType
							? []
							: oFilterBar.getControlDelegate().fetchPropertiesForEntity(sTargetEntityTypePath, oMetaModel, oFilterBar),
						mTargetProperties = aTargetProperties.reduce(function(mProp, oProp) {
							mProp[oProp.name] = oProp;
							return mProp;
						}, {}),
						mTableAggregates =
							!bIsChart && CommonHelper.parseCustomData(DelegateUtil.getCustomData(oControl, "aggregates") || {}),
						mAggregatedProperties = {};

					Object.keys(mTableAggregates).forEach(function(sAggregateName) {
						var oAggregate = mTableAggregates[sAggregateName];
						mAggregatedProperties[oAggregate.relativePath] = oAggregate;
					});

					if (oControl.isA("sap.ui.mdc.ChartNew")) {
						var oEntitySetAnnotations = oControl
								.getModel()
								.getMetaModel()
								.getObject(oControl.data("targetCollectionPath") + "@"),
							mChartCustomAggregates = MetaModelUtil.getAllCustomAggregates(oEntitySetAnnotations);
						Object.keys(mChartCustomAggregates).forEach(function(sAggregateName) {
							if (!mAggregatedProperties[sAggregateName]) {
								var oAggregate = mChartCustomAggregates[sAggregateName];
								mAggregatedProperties[sAggregateName] = oAggregate;
							}
						});
					}

					for (var sProperty in mConditions) {
						// Need to check the length of mConditions[sProperty] since previous filtered properties are kept into mConditions with empty array as definition
						var aConditionProperty = mConditions[sProperty];
						if (
							Array.isArray(aConditionProperty) &&
							aConditionProperty.length > 0 &&
							((!mTargetProperties[sProperty] && !bIsFilterBarEntityType) || mAggregatedProperties[sProperty])
						) {
							aNotApplicable.push(sProperty.replace(/\+|\*/g, ""));
						}
					}
				}
				if ((bIsAnalyticalTable || bIsChart) && oFilterBar.getSearch()) {
					aNotApplicable.push("$search");
				}
				return aNotApplicable;
			},

			attachConditionHandling: function(oFilterBar) {
				var oFilterModel = new JSONModel(),
					oEventData = {
						filterControl: oFilterBar,
						filterModel: oFilterModel
					},
					that = this;

				oFilterBar.setModel(oFilterModel, "filterValues");
				return oFilterBar.initialized().then(function() {
					var oConditionModel = oFilterBar._getConditionModel();
					oConditionModel.attachPropertyChange(oEventData, that._handleConditionModelChange, that);
					oFilterModel.attachPropertyChange(oEventData, that._handleFilterModelChange, that);
				});
			},
			detachConditionHandling: function(oFilterBar) {
				var oFilterModel = oFilterBar.getModel("filterValues"),
					oConditionModel = oFilterBar._getConditionModel();
				oConditionModel.detachPropertyChange(this._handleConditionModelChange, this);
				oFilterModel.detachPropertyChange(this._handleFilterModelChange, this);
				oFilterModel.destroy();
			},
			setFilterValues: function(oFilterControl, sConditionPath, sOperator, vValues) {
				var oFormatOptions = {};
				if (vValues === undefined) {
					vValues = sOperator;
				} else {
					oFormatOptions.operators = [sOperator];
				}

				if (typeof vValues === "object" && vValues.operator) {
					oFormatOptions.operators = [vValues.operator];
					vValues = vValues.values;
				}

				var oConditionsType = new ConditionsType(oFormatOptions),
					oClearFilter = {},
					oFilter = {};

				vValues = Array.isArray(vValues) ? vValues : [vValues];

				oClearFilter[sConditionPath] = [];
				if (sOperator) {
					oFilter[sConditionPath] = vValues
						.filter(function(vValue) {
							return vValue !== undefined && vValue !== null;
						})
						.reduce(function(aAllFilters, vValue) {
							return aAllFilters.concat(oConditionsType.parseValue(vValue.toString(), "any"));
						}, []);
				}

				// needs to be cleared first, else it is just added to the already existing filters
				return StateUtil.applyExternalState(oFilterControl, { filter: oClearFilter }).then(
					StateUtil.applyExternalState.bind(StateUtil, oFilterControl, { filter: oFilter })
				);
			},
			conditionToModelPath: function(sConditionPath) {
				// make the path usable as model property, therefore slashes become backslashes
				return sConditionPath.replace(/\//g, "\\");
			},
			modelToConditionPath: function(sConditionPath) {
				return sConditionPath.replace(/\\/g, "/");
			},
			_handleConditionModelChange: function(oEvent, oData) {
				// substring(12) => strip away "/conditions/" from the path
				var sConditionPath = this.modelToConditionPath(oEvent.getParameter("path").substring(12)),
					// return pure value without operator, e.g. "42" instead of "=42"
					oConditionsType = new ConditionsType({ maxConditions: -1 }),
					oFilterModel = oData.filterModel,
					aValue = oEvent.getParameter("value"),
					vValue = oConditionsType.formatValue(aValue, "any");
				oFilterModel.setProperty("/" + this.conditionToModelPath(sConditionPath), vValue);
			},
			_handleFilterModelChange: function(oEvent, oData) {
				var sPath = oEvent
						.getParameter("context")
						.getPath()
						.substring(1)
						.replace(/\\/g, "/"),
					vValues = oEvent.getParameter("value");
				this.setFilterValues(oData.filterControl, sPath, vValues);
			}
		};

		return oFilterUtils;
	}
);
