/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"./MacroMetadata",
		"sap/fe/core/templating/DataModelPathHelper",
		"sap/fe/core/converters/MetaModelConverter",
		"sap/fe/core/converters/controls/Common/DataVisualization"
	],
	function(MacroMetadata, DataModelPathHelper, MetaModelConverter, DataVisualization) {
		"use strict";

		/**
		 * @classdesc
		 * The building block for creating a chart based on the metadata provided by OData V4.
		 *
		 * @class sap.fe.macros.Chart
		 * @hideconstructor
		 * @private
		 * @experimental
		 */
		var Chart = MacroMetadata.extend("sap.fe.macros.Chart", {
			/**
			 * Name of the building block control.
			 */
			name: "Chart",
			/**
			 * Namespace of the building block control
			 */
			namespace: "sap.fe.macros.internal",
			publicNamespace: "sap.fe.macros",
			publicName: "Chart",
			/**
			 * Fragment source of the building block (optional) - if not set, fragment is generated from namespace and name
			 */
			fragment: "sap.fe.macros.Chart",
			/**
			 * The metadata describing the building block control.
			 */
			metadata: {
				/**
				 * Define building block stereotype for documentation
				 */
				stereotype: "xmlmacro",
				/**
				 * Properties.
				 */
				properties: {
					chartDefinition: {
						type: "sap.ui.model.Context"
					},
					/**
					 * ID of the chart
					 */
					id: {
						type: "string",
						isPublic: true
					},
					/**
					 * If specificed as true the ID is applied to the inner content of the building block
					 * This is only a private property to be used by sap.fe (Fiori Elements)
					 */
					_applyIdToContent: {
						type: "boolean",
						defaultValue: false
					},
					/**
					 * Metadata path to the presentation (UI.Chart w or w/o qualifier)
					 */
					metaPath: {
						type: "sap.ui.model.Context",
						required: true,
						isPublic: true
					},
					/**
					 * Metadata path to the entitySet or navigationProperty
					 */
					contextPath: {
						type: "sap.ui.model.Context",
						required: true,
						isPublic: true
					},
					/**
					 * The height of the chart
					 */
					height: {
						type: "string",
						defaultValue: "400px"
					},
					/**
					 * The width of the chart
					 */
					width: {
						type: "string",
						defaultValue: "100%"
					},
					/**
					 * Specifies the selection mode
					 */
					selectionMode: {
						type: "string",
						defaultValue: "MULTIPLE",
						isPublic: true
					},
					/**
					 * Parameter which sets the personalization of the MDC chart
					 */
					personalization: {
						type: "string|boolean",
						isPublic: true
					},
					/**
					 * Parameter which sets the ID of the filterbar associating it to the chart
					 */
					filter: {
						type: "string"
					},
					/**
					 * Parameter which sets the noDataText for the MDC chart
					 */
					noDataText: {
						type: "string"
					},
					/**
					 * Parameter which sets the chart delegate for the MDC chart
					 */
					chartDelegate: {
						type: "string"
					},
					/**
					 * Parameter which sets the viz properties for the MDC chart
					 */
					vizProperties: {
						type: "string"
					},
					/**
					 * The actions to be shown in the action area of the chart
					 */
					actions: {
						type: "sap.ui.model.Context"
					},
					autoBindOnInit: {
						type: "boolean"
					},
					visible: {
						type: "string"
					}
				},
				events: {
					onSegmentedButtonPressed: {
						type: "function"
					},
					/**
					 * An event triggered when chart selections are changed. The event contains information about the data selected/deselected and
					 * boolean flag that indicates whether data is selected or deselected
					 */
					selectionChange: {
						type: "Function",
						isPublic: true
					}
				}
			},
			create: function(oProps, oControlConfiguration, mSettings) {
				var oChartDefinition;
				var oContextObjectPath = MetaModelConverter.getInvolvedDataModelObjects(oProps.metaPath, oProps.contextPath);
				var oConverterContext = this.getConverterContext(oContextObjectPath, oProps.contextPath, mSettings);
				if (oProps.chartDefinition === undefined || oProps.chartDefinition === null) {
					var sVisualizationPath = DataModelPathHelper.getContextRelativeTargetObjectPath(oContextObjectPath);
					if (oProps.metaPath.getObject().$Type === "com.sap.vocabularies.UI.v1.PresentationVariantType") {
						var aVisualizations = oProps.metaPath.getObject().Visualizations;
						aVisualizations.forEach(function(oVisualization) {
							if (oVisualization.$AnnotationPath.indexOf("@com.sap.vocabularies.UI.v1.Chart") > -1) {
								sVisualizationPath = oVisualization.$AnnotationPath;
								return;
							}
						});
					}
					var oVisualizationDefinition = DataVisualization.getDataVisualizationConfiguration(
						sVisualizationPath,
						oProps.useCondensedLayout,
						oConverterContext
					);
					oChartDefinition = oVisualizationDefinition.visualizations[0];

					oProps.chartDefinition = this.createBindingContext(oChartDefinition, mSettings);
				} else {
					oChartDefinition = oProps.chartDefinition.getObject();
				}
				oChartDefinition.path = oProps.chartDefinition.getPath();
				// API Properties
				this.setDefaultValue(oProps, "navigationPath", oChartDefinition.navigationPath);
				this.setDefaultValue(oProps, "autoBindOnInit", oChartDefinition.autoBindOnInit);
				this.setDefaultValue(oProps, "vizProperties", oChartDefinition.vizProperties);
				oProps.actions = this.createBindingContext(oChartDefinition.actions, mSettings);
				oProps.selectionMode = oProps.selectionMode.toUpperCase();
				if (!oProps.filter) {
					this.setDefaultValue(oProps, "filter", oChartDefinition.filterId);
				}
				this.setDefaultValue(oProps, "onSegmentedButtonPressed", oChartDefinition.onSegmentedButtonPressed);
				this.setDefaultValue(oProps, "visible", oChartDefinition.visible);

				if (oProps._applyIdToContent) {
					oProps._apiId = oProps.id + "::Chart";
					oProps._contentId = oProps.id;
				} else {
					oProps._apiId = oProps.id;
					oProps._contentId = oProps.id + "-content";
				}

				return oProps;
			}
		});

		return Chart;
	}
);
