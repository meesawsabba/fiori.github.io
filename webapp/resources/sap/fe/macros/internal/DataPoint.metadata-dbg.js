/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"../MacroMetadata",
		"sap/fe/macros/internal/helpers/DataPointTemplating",
		"sap/fe/core/converters/MetaModelConverter",
		"sap/fe/core/templating/CriticalityFormatters"
	],
	function(MacroMetadata, DatapointTemplating, MetaModelConverter, CriticalityFormatters) {
		"use strict";

		/**
		 * @classdesc
		 * Macro for creating a DataPoint based on provided OData v4 metadata.
		 * <br>
		 * Usually, a DataField or DataPoint annotation is expected, but the macro DataPoint can also be used to display a property from the entity type.
		 *
		 *
		 * Usage example:
		 * <pre>
		 * <internalMacro:DataPoint
		 *   idPrefix="SomePrefix"
		 *   contextPath="{entitySet>}"
		 *   metaPath="{dataField>}"
		 * />
		 * </pre>
		 *
		 * @class sap.fe.macros.internal.DataPoint
		 * @hideconstructor
		 * @private
		 * @experimental
		 */
		var DataPoint = MacroMetadata.extend("sap.fe.macros.internal.DataPoint", {
			/**
			 * Define macro stereotype for documentation
			 */
			name: "DataPoint",
			/**
			 * Namespace of the macro control
			 */
			namespace: "sap.fe.macros.internal",
			/**
			 * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name
			 */
			fragment: "sap.fe.macros.internal.DataPoint",

			/**
			 * The metadata describing the macro control.
			 */
			metadata: {
				/**
				 * Define macro stereotype for documentation purpose
				 */
				stereotype: "xmlmacro",
				/**
				 * Properties.
				 */
				properties: {
					/**
					 * Prefix added to the generated ID of the field
					 */
					idPrefix: {
						type: "string"
					},
					/**
					 * Metadata path to the dataPoint.
					 * This property is usually a metadataContext pointing to a DataPoint having
					 * $Type = "com.sap.vocabularies.UI.v1.DataPointType"
					 * And a Visualization/$EnumNumber = "com.sap.vocabularies.UI.v1.VisualizationType/Rating", "com.sap.vocabularies.UI.v1.VisualizationType/Progress", or None
					 * But it can also be a Property with $kind="Property"
					 */
					metaPath: {
						type: "sap.ui.model.Context",
						required: true,
						$kind: "Property"
					},
					/**
					 * Property added to associate the label with the DataPoint
					 */
					ariaLabelledBy: {
						type: "string"
					},
					formatOptions: {
						type: "object",
						properties: {
							/**
							 * When true, displays the labels for the Rating and Progress indicators
							 */
							showLabels: {
								type: "boolean",
								defaultValue: "false"
							},
							/**
							 * Define the size of the icons (For RatingIndicator only)
							 */
							iconSize: {
								type: "string",
								allowedValues: ["1rem", "1.375rem", "2rem"]
							},
							/**
							 * Preferred control in case of for a DataPoint between an ObjectStatus and ObjectNumber
							 */
							defaultDataPointStyle: {
								type: "string",
								allowedValues: ["ObjectNumber", "ObjectStatus"]
							},
							measureDisplayMode: {
								type: "string",
								allowedValues: ["Hidden", "ReadOnly"]
							}
						}
					},
					/**
					 * Mandatory context to the dataPoint
					 */
					contextPath: {
						type: "sap.ui.model.Context",
						required: true,
						$kind: ["EntitySet", "NavigationProperty"]
					}
				}
			},

			create: function(oProps, oControlConfiguration, mSettings) {
				var oDataModelPath = MetaModelConverter.getInvolvedDataModelObjects(oProps.metaPath, oProps.contextPath);
				var oDataPointConverted = MetaModelConverter.convertMetaModelContext(oProps.metaPath);

				if (oDataPointConverted && oDataPointConverted.Visualization === "UI.VisualizationType/Progress") {
					oProps.displayValue = DatapointTemplating.progressIndicatorDisplayValue(oDataModelPath, oProps.formatOptions);
					oProps.percentValue = DatapointTemplating.buildExpressionForProgressIndicatorPercentValue(oDataModelPath);
				} else {
					oProps.objectStatusText = DatapointTemplating.buildFieldBindingExpression(
						oDataModelPath,
						oProps,
						oProps.formatOptions,
						false
					);
					oProps.objectStatusNumber = DatapointTemplating.buildFieldBindingExpression(
						oDataModelPath,
						oProps,
						oProps.formatOptions,
						true
					);
					oProps.iconExpression = CriticalityFormatters.buildExpressionForCriticalityIcon(oDataPointConverted, oDataModelPath);
				}

				oProps.criticalityColorExpression = CriticalityFormatters.buildExpressionForCriticalityColor(
					oDataPointConverted,
					oDataModelPath
				);
				return oProps;
			}
		});

		return DataPoint;
	}
);
