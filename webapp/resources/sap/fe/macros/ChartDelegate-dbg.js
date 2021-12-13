/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

// ---------------------------------------------------------------------------------------
// Helper class used to help create content in the chart/item and fill relevant metadata
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define(
	[
		"sap/ui/mdc/library",
		"sap/ui/mdc/odata/v4/vizChart/ChartDelegateNew",
		"sap/fe/macros/ODataMetaModelUtil",
		"sap/ui/mdc/odata/v4/ODataMetaModelUtil",
		"sap/base/util/merge",
		"sap/fe/macros/chart/ChartUtils",
		"sap/ui/mdc/util/FilterUtil",
		"sap/ui/mdc/odata/v4/util/DelegateUtil",
		"sap/ui/base/SyncPromise",
		"sap/base/Log",
		"sap/fe/core/CommonUtils",
		"sap/fe/macros/ResourceModel",
		"sap/fe/macros/CommonHelper",
		"sap/fe/macros/ChartAPI"
	],
	function(
		MDCLib,
		BaseChartDelegate,
		MetaModelUtil,
		ODataMetaModelUtil,
		merge,
		ChartUtils,
		FilterUtil,
		DelegateUtil,
		SyncPromise,
		Log,
		CommonUtils,
		ResourceModel,
		CommonHelper,
		ChartAPI
	) {
		"use strict";
		// /**
		//  * Helper class for sap.ui.mdc.Chart.
		//  * <h3><b>Note:</b></h3>
		//  * The class is experimental and the API/behaviour is not finalised
		//  * and hence this should not be used for productive usage.
		//  * Especially this class is not intended to be used for the FE scenario,
		//  * here we shall use sap.fe.macros.ChartDelegate that is especially tailored for V4
		//  * meta model
		//  *
		//  * @author SAP SE
		//  * @private
		//  * @experimental
		//  * @since 1.62
		//  * @alias sap.fe.macros.ChartDelegate
		//  */
		var ChartDelegate = Object.assign({}, BaseChartDelegate);

		function setChartNoDataText(oChart, oBindingInfo) {
			var sNoDataKey = "",
				oChartFilterInfo = ChartUtils.getAllFilterInfo(oChart),
				suffixResourceKey = oBindingInfo.path.substr(1);

			if (oChart.getFilter()) {
				if (oChartFilterInfo.search || (oChartFilterInfo.filters && oChartFilterInfo.filters.length)) {
					sNoDataKey = "T_OP_TABLE_AND_CHART_NO_DATA_TEXT_WITH_FILTER";
				} else {
					sNoDataKey = "T_OP_TABLE_AND_CHART_NO_DATA_TEXT";
				}
			} else {
				if (oChartFilterInfo.search || (oChartFilterInfo.filters && oChartFilterInfo.filters.length)) {
					sNoDataKey = "T_OP_TABLE_AND_CHART_NO_DATA_TEXT_WITH_FILTER";
				} else {
					sNoDataKey = "M_OP_TABLE_AND_CHART_OP_NO_FILTERS_NO_DATA_TEXT";
				}
			}
			if (sNoDataKey === "T_OP_TABLE_AND_CHART_NO_DATA_TEXT_WITH_FILTER" || sNoDataKey === "T_OP_TABLE_AND_CHART_NO_DATA_TEXT") {
				return oChart
					.getModel("sap.fe.i18n")
					.getResourceBundle()
					.then(function(oResourceBundle) {
						oChart.setNoDataText(CommonUtils.getTranslatedText(sNoDataKey, oResourceBundle, null, suffixResourceKey));
					})
					.catch(function(error) {
						Log.error(error);
					});
			} else {
				if (ResourceModel) {
					oChart.setNoDataText(ResourceModel.getText(sNoDataKey));
				}
			}
		}

		function handleProperty(oMDCChart, mEntitySetAnnotations, mKnownAggregatableProps, mCustomAggregates, aProperties, sCriticality) {
			var oApplySupported = CommonHelper.parseCustomData(oMDCChart.data("applySupported"));
			var oSortRestrictions = mEntitySetAnnotations["@Org.OData.Capabilities.V1.SortRestrictions"] || {};
			var oSortRestrictionsInfo = ODataMetaModelUtil.getSortRestrictionsInfo(oSortRestrictions);
			var oFilterRestrictions = mEntitySetAnnotations["@Org.OData.Capabilities.V1.FilterRestrictions"];
			var oFilterRestrictionsInfo = ODataMetaModelUtil.getFilterRestrictionsInfo(oFilterRestrictions);
			var oObj = this.getModel().getObject(this.getPath());
			var sKey = this.getModel().getObject(this.getPath() + "@sapui.name");
			var oMetaModel = this.getModel();
			if (oObj && oObj.$kind === "Property") {
				// ignore (as for now) all complex properties
				// not clear if they might be nesting (complex in complex)
				// not clear how they are represented in non-filterable annotation
				// etc.
				if (oObj.$isCollection) {
					//Log.warning("Complex property with type " + oObj.$Type + " has been ignored");
					return;
				}

				var oPropertyAnnotations = oMetaModel.getObject(this.getPath() + "@");
				var sPath = oMetaModel.getObject("@sapui.name", oMetaModel.getMetaContext(this.getPath()));

				var aGroupableProperties = oApplySupported && oApplySupported.GroupableProperties;
				var aAggregatableProperties = oApplySupported && oApplySupported.AggregatableProperties;
				var bGroupable = false,
					bAggregatable = false;
				if (aGroupableProperties && aGroupableProperties.length) {
					for (var i = 0; i < aGroupableProperties.length; i++) {
						if (aGroupableProperties[i].$PropertyPath === sPath) {
							bGroupable = true;
							break;
						}
					}
				}
				if (aAggregatableProperties && aAggregatableProperties.length) {
					for (var j = 0; j < aAggregatableProperties.length; j++) {
						if (aAggregatableProperties[j].Property.$PropertyPath === sPath) {
							bAggregatable = true;
							break;
						}
					}
				}
				if (!aGroupableProperties || (aGroupableProperties && !aGroupableProperties.length)) {
					bGroupable = oPropertyAnnotations["@Org.OData.Aggregation.V1.Groupable"];
				}
				if (!aAggregatableProperties || (aAggregatableProperties && !aAggregatableProperties.length)) {
					bAggregatable = oPropertyAnnotations["@Org.OData.Aggregation.V1.Aggregatable"];
				}

				//TODO: Check what we want to do with properties neither aggregatable nor groupable
				//Right now: skip them, since we can't create a chart from it
				if (!bGroupable && !bAggregatable) {
					return;
				}

				if (bAggregatable) {
					var aAggregateProperties = ChartDelegate._createPropertyInfosForAggregatable(
						sKey,
						oPropertyAnnotations,
						oFilterRestrictionsInfo,
						oSortRestrictionsInfo,
						mKnownAggregatableProps,
						mCustomAggregates
					);
					aAggregateProperties.forEach(function(oAggregateProperty) {
						aProperties.push(oAggregateProperty);
					});
				}

				if (bGroupable) {
					var sName = sKey || "",
						sTextProperty = oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"]
							? oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"].$Path
							: null;
					var bIsNavigationText = false;
					if (sName && sName.indexOf("/") > -1) {
						Log.error("$expand is not yet supported. Property: " + sName + " from an association cannot be used");
						return;
					}
					if (sTextProperty && sTextProperty.indexOf("/") > -1) {
						Log.error("$expand is not yet supported. Text Property: " + sTextProperty + " from an association cannot be used");
						bIsNavigationText = true;
					}
					aProperties.push({
						name: sKey,
						propertyPath: sKey,
						label: oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Label"] || sKey,
						sortable: oSortRestrictionsInfo[sKey] ? oSortRestrictionsInfo[sKey].sortable : true,
						filterable: oFilterRestrictionsInfo[sKey] ? oFilterRestrictionsInfo[sKey].filterable : true,
						groupable: true,
						aggregatable: false,
						maxConditions: ODataMetaModelUtil.isMultiValueFilterExpression(oFilterRestrictionsInfo.propertyInfo[sKey]) ? -1 : 1,
						sortKey: sKey,
						kind: "Groupable", //TODO: Rename in type; Only needed for P13n Item Panel
						availableRoles: ChartDelegate._getLayoutOptionsForType("groupable"), //for p13n
						role: MDCLib.ChartItemRoleType.category, //standard, normally this should be interpreted from UI.Chart annotation
						criticality: sCriticality, //To be implemented by FE
						textProperty:
							!bIsNavigationText && oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"]
								? oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"].$Path
								: null, //To be implemented by FE
						textFormatter: function(oValue1, oValue2) {
							if (oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"]) {
								var oTextArrangementAnnotation =
									oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"];
								if (oTextArrangementAnnotation.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst") {
									return oValue2 + " (" + oValue1 + ")";
								} else if (
									oTextArrangementAnnotation.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"
								) {
									return oValue1 + " (" + oValue2 + ")";
								} else if (
									oTextArrangementAnnotation.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
								) {
									return oValue2;
								}
							}
							return oValue2 ? oValue2 : oValue1;
						}
					});
				}
			}
		}

		ChartDelegate.updateBindingInfo = function(oChart, oBindingInfo) {
			setChartNoDataText(oChart, oBindingInfo);

			var oFilter = sap.ui.getCore().byId(oChart.getFilter());
			if (oFilter) {
				var mConditions = oFilter.getConditions();

				if (mConditions) {
					if (!oBindingInfo) {
						oBindingInfo = {};
					}
					var oInnerChart = oChart.getControlDelegate()._getChart(oChart);
					var oFilterInfo;
					if (oInnerChart) {
						// if the action is a drill down, chart selections must be considered
						if (ChartUtils.getChartSelectionsExist(oChart)) {
							oFilterInfo = ChartUtils.getAllFilterInfo(oChart);
						}
					}
					oFilterInfo = oFilterInfo ? oFilterInfo : ChartUtils.getFilterBarFilterInfo(oChart);
					if (oFilterInfo) {
						oBindingInfo.filters = oFilterInfo.filters;
					}

					var sParameterPath = DelegateUtil.getParametersInfo(oFilter, mConditions);
					if (sParameterPath) {
						oBindingInfo.path = sParameterPath;
					}
				}
			}
		};

		ChartDelegate.fetchProperties = function(oMDCChart) {
			var oModel = this._getModel(oMDCChart);
			var pCreatePropertyInfos;

			if (!oModel) {
				pCreatePropertyInfos = new Promise(
					function(resolve) {
						oMDCChart.attachModelContextChange(
							{
								resolver: resolve
							},
							onModelContextChange,
							this
						);
					}.bind(this)
				).then(
					function(oModel) {
						return this._createPropertyInfos(oMDCChart, oModel);
					}.bind(this)
				);
			} else {
				pCreatePropertyInfos = this._createPropertyInfos(oMDCChart, oModel);
			}

			return pCreatePropertyInfos.then(function(aProperties) {
				if (oMDCChart.data) {
					oMDCChart.data("$mdcChartPropertyInfo", aProperties);
				}
				return aProperties;
			});
		};

		function onModelContextChange(oEvent, oData) {
			var oMDCChart = oEvent.getSource();
			var oModel = this._getModel(oMDCChart);

			if (oModel) {
				oMDCChart.detachModelContextChange(onModelContextChange);
				oData.resolver(oModel);
			}
		}

		ChartDelegate._createPropertyInfos = function(oMDCChart, oModel) {
			var sEntitySetPath = "/" + oMDCChart.data("entitySet");
			var oMetaModel = oModel.getMetaModel();

			return Promise.all([oMetaModel.requestObject(sEntitySetPath + "/"), oMetaModel.requestObject(sEntitySetPath + "@")]).then(
				function(aResults) {
					var aProperties = [];
					var oEntityType = aResults[0],
						mEntitySetAnnotations = aResults[1];
					var mCustomAggregates = CommonHelper.parseCustomData(oMDCChart.data("customAgg"));
					var sAnno;
					var aPropertyPromise = [];
					for (var sAnnoKey in mEntitySetAnnotations) {
						if (sAnnoKey.startsWith("@Org.OData.Aggregation.V1.CustomAggregate")) {
							sAnno = sAnnoKey.replace("@Org.OData.Aggregation.V1.CustomAggregate#", "");
							var aAnno = sAnno.split("@");

							if (aAnno.length == 2 && aAnno[1] == "com.sap.vocabularies.Common.v1.Label") {
								mCustomAggregates[aAnno[0].label] = mEntitySetAnnotations[sAnnoKey];
							}
						}
					}
					var aDimensions = [],
						aMeasures = [];
					if (Object.keys(mCustomAggregates).length >= 1) {
						var aChartItems = oMDCChart.getItems();
						for (var key in aChartItems) {
							if (aChartItems[key].isA("sap.ui.mdc.chart.DimensionItem")) {
								aDimensions.push(aChartItems[key].getKey());
							} else if (aChartItems[key].isA("sap.ui.mdc.chart.MeasureItem")) {
								aMeasures.push(aChartItems[key].getKey());
							}
						}
						if (
							aMeasures.filter(function(val) {
								return aDimensions.indexOf(val) != -1;
							}).length >= 1
						) {
							Log.error("Dimension and Measure has the sameProperty Configured");
						}
					}

					var mTypeAggregatableProps = CommonHelper.parseCustomData(oMDCChart.data("transAgg"));
					var mKnownAggregatableProps = {};
					for (var sAggregatable in mTypeAggregatableProps) {
						var sPropKey = mTypeAggregatableProps[sAggregatable].propertyPath;
						mKnownAggregatableProps[sPropKey] = mKnownAggregatableProps[sPropKey] || {};
						mKnownAggregatableProps[sPropKey][mTypeAggregatableProps[sAggregatable].aggregationMethod] = {
							name: mTypeAggregatableProps[sAggregatable].name,
							label: mTypeAggregatableProps[sAggregatable].label
						};
					}
					for (var sKey in oEntityType) {
						if (sKey.indexOf("$") !== 0) {
							aPropertyPromise.push(
								MetaModelUtil.fetchCriticality(
									oMetaModel,
									oMetaModel.createBindingContext(sEntitySetPath + "/" + sKey)
								).then(
									handleProperty.bind(
										oMetaModel.getMetaContext(sEntitySetPath + "/" + sKey),
										oMDCChart,
										mEntitySetAnnotations,
										mKnownAggregatableProps,
										mCustomAggregates,
										aProperties
									)
								)
							);
						}
					}
					return Promise.all(aPropertyPromise).then(function() {
						return aProperties;
					});
				}
			);
		};

		ChartDelegate._createPropertyInfosForAggregatable = function(
			sKey,
			oPropertyAnnotations,
			oFilterRestrictionsInfo,
			oSortRestrictionsInfo,
			mKnownAggregatableProps,
			mCustomAggregates
		) {
			var aAggregateProperties = [];
			if (Object.keys(mKnownAggregatableProps).indexOf(sKey) > -1) {
				for (var sAggregatable in mKnownAggregatableProps[sKey]) {
					aAggregateProperties.push({
						name: mKnownAggregatableProps[sKey][sAggregatable].name,
						propertyPath: sKey,
						label:
							mKnownAggregatableProps[sKey][sAggregatable].label ||
							oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Label"] + " (" + sAggregatable + ")" ||
							sKey + " (" + sAggregatable + ")",
						sortable: oSortRestrictionsInfo[sKey] ? oSortRestrictionsInfo[sKey].sortable : true,
						filterable: oFilterRestrictionsInfo[sKey] ? oFilterRestrictionsInfo[sKey].filterable : true,
						groupable: false,
						aggregatable: true,
						aggregationMethod: sAggregatable,
						maxConditions: ODataMetaModelUtil.isMultiValueFilterExpression(oFilterRestrictionsInfo.propertyInfo[sKey]) ? -1 : 1,
						kind: "Aggregatable", //Only needed for P13n Item Panel
						availableRoles: ChartDelegate._getLayoutOptionsForType("aggregatable"), //for p13n
						role: MDCLib.ChartItemRoleType.axis1,
						datapoint: null //To be implemented by FE
					});
				}
			} else if (Object.keys(mCustomAggregates).indexOf(sKey) > -1) {
				for (var sCustom in mCustomAggregates) {
					if (sCustom === sKey) {
						var oItem = merge({}, mCustomAggregates[sCustom], {
							kind: MDCLib.ChartItemType.Measure,
							role: MDCLib.ChartItemRoleType.axis1,
							sortable: mCustomAggregates[sCustom].sortable
						});
						aAggregateProperties.push(oItem);

						break;
					}
				}
			}
			return aAggregateProperties;
		};

		ChartDelegate.rebindChart = function(oMDCChart, oBindingInfo) {
			BaseChartDelegate.rebindChart(oMDCChart, oBindingInfo);
		};

		ChartDelegate._setChart = function(oMDCChart, oInnerChart) {
			var oChartAPI = oMDCChart.getParent();
			oInnerChart.setVizProperties(oMDCChart.data("vizProperties"));
			oInnerChart.detachSelectData(oChartAPI.handleSelectionChange.bind(oChartAPI));
			oInnerChart.detachDeselectData(oChartAPI.handleSelectionChange.bind(oChartAPI));
			oInnerChart.detachDrilledUp(oChartAPI.handleSelectionChange.bind(oChartAPI));
			oInnerChart.attachSelectData(oChartAPI.handleSelectionChange.bind(oChartAPI));
			oInnerChart.attachDeselectData(oChartAPI.handleSelectionChange.bind(oChartAPI));
			oInnerChart.attachDrilledUp(oChartAPI.handleSelectionChange.bind(oChartAPI));

			oInnerChart.setSelectionMode(oMDCChart.getPayload().selectionMode.toUpperCase());
			BaseChartDelegate._setChart(oMDCChart, oInnerChart);
		};

		ChartDelegate._getBindingInfo = function(oMDCChart) {
			if (this._getBindingInfoFromState(oMDCChart)) {
				return this._getBindingInfoFromState(oMDCChart);
			}

			var oMetadataInfo = oMDCChart.getDelegate().payload;
			var oMetaModel = oMDCChart.getModel() && oMDCChart.getModel().getMetaModel();
			var sTargetCollectionPath = oMDCChart.data("targetCollectionPath");
			var sEntitySetPath =
				(oMetaModel.getObject(sTargetCollectionPath + "/$kind") === "EntitySet" ? "/" : "") + oMetadataInfo.contextPath;
			var oParams = merge({}, oMetadataInfo.parameters, {
				entitySet: oMDCChart.data("entitySet"),
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true,
				noPaging: true
			});
			var oBindingInfo = {
				path: sEntitySetPath,
				parameters: oParams
			};
			return oBindingInfo;
		};

		ChartDelegate.removeItemFromInnerChart = function(oMDCChart, oMDCChartItem) {
			BaseChartDelegate.removeItemFromInnerChart.call(this, oMDCChart, oMDCChartItem);
			if (oMDCChartItem.getType() === "groupable") {
				var oInnerChart = this._getChart(oMDCChart);
				oInnerChart.fireDeselectData();
			}
		};

		return ChartDelegate;
	},
	/* bExport= */ false
);
