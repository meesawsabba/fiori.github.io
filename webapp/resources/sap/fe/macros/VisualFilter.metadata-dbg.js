/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"./MacroMetadata",
		"sap/fe/core/converters/MetaModelConverter",
		"sap/fe/core/converters/helpers/Aggregation",
		"sap/fe/core/templating/DataModelPathHelper",
		"sap/fe/macros/ResourceModel"
	],
	function(MacroMetadata, MetaModelConverter, AggregationHelper, DataModelPathHelper, ResourceModel) {
		"use strict";

		/**
		 * @classdesc
		 * Building block for creating a VisualFilter based on the metadata provided by OData V4.
		 * <br>
		 * A Chart annotation is required to bring up an interactive chart
		 *
		 *
		 * Usage example:
		 * <pre>
		 * &lt;macro:VisualFilter
		 *   collection="{entitySet&gt;}"
		 *   chartAnnotation="{chartAnnotation&gt;}"
		 *   id="someID"
		 *   groupId="someGroupID"
		 *   title="some Title"
		 * /&gt;
		 * </pre>
		 *
		 * @class sap.fe.macros.VisualFilter
		 * @hideconstructor
		 * @private
		 * @experimental
		 */
		var VisualFilter = MacroMetadata.extend("sap.fe.macros.VisualFilter", {
			/**
			 * Name of the macro control.
			 */
			name: "VisualFilter",
			/**
			 * Namespace of the macro control
			 */
			namespace: "sap.fe.macros",
			/**
			 * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name
			 */
			fragment: "sap.fe.macros.VisualFilter",
			/**
			 * The metadata describing the macro control.
			 */
			metadata: {
				/**
				 * Properties.
				 */
				properties: {
					/**
					 * ID of the visual filter
					 */
					id: {
						type: "string"
					},
					/**
					 * Title for the visual filter.
					 */
					title: {
						type: "string",
						defaultValue: ""
					},
					/**
					 * Metadata path to the entitySet or navigationProperty
					 */
					contextPath: {
						type: "sap.ui.model.Context",
						required: true,
						$kind: ["EntitySet", "NavigationProperty"]
					},
					/**
					 * Metadata path to the presentation variant annotations
					 */
					metaPath: {
						type: "sap.ui.model.Context"
					},
					/**
					 * Property Path of the Dimension in the main entity set
					 */
					outParameter: {
						type: "string"
					},
					/**
					 * Metadata path to the selection variant annotations
					 */
					selectionVariantAnnotation: {
						type: "sap.ui.model.Context"
					},
					/**
					 * inParameters applicable to the visual filter
					 */
					inParameters: {
						type: "sap.ui.model.Context"
					},
					/**
					 * multiple selection applicable to the visual filter
					 */
					multipleSelectionAllowed: {
						type: "boolean"
					},
					/**
					 * required property of the visual filter
					 */
					required: {
						type: "boolean"
					},
					showOverlayInitially: {
						type: "boolean"
					},
					renderLineChart: {
						type: "boolean"
					},
					requiredProperties: {
						type: "sap.ui.model.Context"
					},
					filterBarEntityType: {
						type: "sap.ui.model.Context"
					}
				}
			},
			create: function(oProps, oControlConfiguration, mSettings) {
				oProps.groupId = "$auto.visualFilters";
				oProps.inParameters = oProps.inParameters.getObject();
				this.setDefaultValue(oProps, "aggregateProperties", undefined);
				this.setDefaultValue(oProps, "showValueHelp", undefined);
				this.setDefaultValue(oProps, "bCustomAggregate", false);
				var oContextObjectPath = MetaModelConverter.getInvolvedDataModelObjects(oProps.metaPath, oProps.contextPath);
				var oConverterContext = this.getConverterContext(oContextObjectPath, oProps.contextPath, mSettings);
				var resolvedTarget = oConverterContext.getEntityTypeAnnotation("");
				oConverterContext = resolvedTarget.converterContext;
				var aggregationHelper = new AggregationHelper.AggregationHelper(oConverterContext.getEntityType(), oConverterContext);
				var customAggregates = aggregationHelper.getCustomAggregateDefinitions();
				var oModel = oProps.contextPath && oProps.contextPath.getModel();
				var sPath = oProps.metaPath && oProps.metaPath.getPath();
				var pvAnnotation = oModel.getObject(sPath);
				var chartAnnotation, sMeasure;
				var aVisualizations = pvAnnotation && pvAnnotation.Visualizations;
				if (aVisualizations) {
					for (var i = 0; i < aVisualizations.length; i++) {
						var sAnnotationPath = pvAnnotation.Visualizations[i] && pvAnnotation.Visualizations[i].$AnnotationPath;
						chartAnnotation =
							oConverterContext.getEntityTypeAnnotation(sAnnotationPath) &&
							oConverterContext.getEntityTypeAnnotation(sAnnotationPath).annotation;
					}
				}
				if (chartAnnotation && chartAnnotation.Measures[0]) {
					sMeasure = chartAnnotation.Measures[0].value;
				}
				if (chartAnnotation) {
					var validChartType;
					if (chartAnnotation.ChartType === "UI.ChartType/Line" || chartAnnotation.ChartType === "UI.ChartType/Bar") {
						validChartType = true;
					} else {
						validChartType = false;
					}
				}
				if (
					customAggregates.some(function(custAgg) {
						return custAgg.qualifier === sMeasure;
					})
				) {
					oProps.bCustomAggregate = true;
				}
				var oSelectionVariant = oProps.selectionVariantAnnotation && oProps.selectionVariantAnnotation.getObject();
				var iSelectOptionsForDimension = 0;
				if (oSelectionVariant && !oProps.multipleSelectionAllowed) {
					for (var j = 0; j < oSelectionVariant.SelectOptions.length; j++) {
						if (oSelectionVariant.SelectOptions[j].PropertyName.$PropertyPath === chartAnnotation.Dimensions[0].value) {
							iSelectOptionsForDimension++;
							if (iSelectOptionsForDimension > 1) {
								throw new Error("Multiple SelectOptions for FilterField having SingleValue Allowed Expression");
							}
						}
					}
				}

				var aAggregations = aggregationHelper.getTransAggregations();
				var oAggregation = this.getAggregateProperties(aAggregations[0], sMeasure);

				if (oAggregation) {
					oProps.aggregateProperties = oAggregation;
				}
				var vUOM = this.getUoM(oModel, oProps.contextPath, sMeasure, oAggregation);
				if (
					vUOM &&
					vUOM.$Path &&
					customAggregates.some(function(custAgg) {
						return custAgg.qualifier === vUOM.$Path;
					})
				) {
					oProps.bUoMHasCustomAggregate = true;
				} else {
					oProps.bUoMHasCustomAggregate = false;
				}
				var bHiddenMeasure = this.getHiddenMeasure(oModel, oProps.contextPath, sMeasure, oProps.bCustomAggregate, oAggregation);
				var sDimensionType =
					chartAnnotation.Dimensions[0] && chartAnnotation.Dimensions[0].$target && chartAnnotation.Dimensions[0].$target.type;
				var sChartType = chartAnnotation.ChartType;
				if (sDimensionType === "Edm.Date" || sDimensionType === "Edm.Time" || sDimensionType === "Edm.DateTimeOffset") {
					oProps.showValueHelp = false;
				} else if (typeof bHiddenMeasure === "boolean" && bHiddenMeasure) {
					oProps.showValueHelp = false;
				} else if (!(sChartType === "UI.ChartType/Bar" || sChartType === "UI.ChartType/Line")) {
					oProps.showValueHelp = false;
				} else if (oProps.renderLineChart === "false" && sChartType === "UI.ChartType/Line") {
					oProps.showValueHelp = false;
				} else {
					oProps.showValueHelp = true;
				}

				/**
				 * If the measure of the chart is marked as 'hidden', or if the chart type is invalid, or if the data type for the line chart is invalid,
				 * the call is made to the InteractiveChartWithError fragment (using error-message related APIs, but avoiding batch calls)
				 */
				if ((typeof bHiddenMeasure === "boolean" && bHiddenMeasure) || !validChartType || oProps.renderLineChart === "false") {
					oProps.showError = true;
					oProps.errorMessageTitle =
						bHiddenMeasure || !validChartType
							? ResourceModel.getText("M_VISUAL_FILTERS_ERROR_MESSAGE_TITLE")
							: ResourceModel.getText("M_VISUAL_FILTER_LINE_CHART_INVALID_DATATYPE");
					if (bHiddenMeasure) {
						oProps.errorMessage = ResourceModel.getText("M_VISUAL_FILTER_HIDDEN_MEASURE", sMeasure);
					} else if (!validChartType) {
						oProps.errorMessage = ResourceModel.getText("M_VISUAL_FILTER_UNSUPPORTED_CHART_TYPE");
					} else {
						oProps.errorMessage = ResourceModel.getText("M_VISUAL_FILTER_LINE_CHART_UNSUPPORTED_DIMENSION");
					}
				}
				return oProps;
			},

			getAggregateProperties: function(aAggregations, sMeasure) {
				var oMatchedAggregate = {};
				if (!aAggregations) {
					return;
				}
				aAggregations.some(function(oAggregate) {
					if (oAggregate.Name === sMeasure) {
						oMatchedAggregate = oAggregate;
						return true;
					}
				});
				return oMatchedAggregate;
			},

			getHiddenMeasure: function(oModel, sContextPath, sMeasure, bCustomAggregate, oAggregation) {
				var sAggregatablePropertyPath;
				if (!bCustomAggregate && oAggregation) {
					sAggregatablePropertyPath = oAggregation.AggregatableProperty && oAggregation.AggregatableProperty.value;
				} else {
					sAggregatablePropertyPath = sMeasure;
				}
				var vHiddenMeasure = oModel.getObject(
					sContextPath + "/" + sAggregatablePropertyPath + "@com.sap.vocabularies.UI.v1.Hidden"
				);
				if (!vHiddenMeasure && oAggregation && oAggregation.AggregatableProperty) {
					vHiddenMeasure = oModel.getObject(
						sContextPath + "/" + sAggregatablePropertyPath + "@com.sap.vocabularies.UI.v1.Hidden"
					);
				}
				return vHiddenMeasure;
			},

			getUoM: function(oModel, sContextPath, sMeasure, oAggregation) {
				var vISOCurrency = oModel.getObject(sContextPath + "/" + sMeasure + "@Org.OData.Measures.V1.ISOCurrency");
				var vUnit = oModel.getObject(sContextPath + "/" + sMeasure + "@Org.OData.Measures.V1.Unit");
				if (!vISOCurrency && !vUnit && oAggregation && oAggregation.AggregatableProperty) {
					vISOCurrency = oModel.getObject(
						sContextPath + "/" + oAggregation.AggregatableProperty.value + "@Org.OData.Measures.V1.ISOCurrency"
					);
					vUnit = oModel.getObject(sContextPath + "/" + oAggregation.AggregatableProperty.value + "@Org.OData.Measures.V1.Unit");
				}
				return vISOCurrency || vUnit;
			}
		});
		return VisualFilter;
	}
);
