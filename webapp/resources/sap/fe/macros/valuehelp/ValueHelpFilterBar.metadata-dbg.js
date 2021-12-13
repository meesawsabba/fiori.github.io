/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"../MacroMetadata",
		"sap/fe/core/converters/controls/ListReport/FilterBar",
		"sap/fe/core/TemplateModel",
		"sap/fe/core/converters/MetaModelConverter",
		"sap/fe/core/helpers/ModelHelper",
		"sap/base/Log"
	],
	function(MacroMetadata, FilterBarConverter, TemplateModel, MetaModelConverter, ModelHelper, Log) {
		"use strict";

		/**
		 * /**
		 * @classdesc
		 * Building block for creating a FilterBar based on the provided OData V4 metadata.
		 *
		 *
		 * Usage example:
		 * <pre>
		 * &lt;macro:FilterBar
		 *   id="SomeID"
		 *   entitySet="{entitySet>}"
		 *   hideBasicSearch="false"
		 *   p13nMode=["Item","Value"]
		 *   listBindingNames = "sap.fe.tableBinding"
		 *   liveMode="true"
		 *   search=".handlers.onSearch"
		 *   filterChanged=".handlers.onFiltersChanged"
		 * /&gt;
		 * </pre>
		 *
		 * Building block for creating a FilterBar based on the provided OData V4 metadata.
		 * @class sap.fe.macros.FilterBar
		 * @hideconstructor
		 * @private
		 * @experimental
		 */
		var FilterBar = MacroMetadata.extend("sap.fe.macros.valuehelp.ValueHelpFilterBar", {
			/**
			 * Name of the macro control.
			 */
			name: "ValueHelpFilterBar",
			/**
			 * Namespace of the macro control
			 */
			namespace: "sap.fe.macros.valuehelp",
			/**
			 * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name
			 */
			fragment: "sap.fe.macros.valuehelp.ValueHelpFilterBar",

			/**
			 * The metadata describing the macro control.
			 */
			metadata: {
				/**
				 * Define macro stereotype for documentation
				 */
				stereotype: "xmlmacro",
				/**
				 * Location of the designtime info
				 */
				designtime: "sap/fe/macros/valuehelp/ValueHelpFilterBar.designtime",
				/**
				 * Properties.
				 */
				properties: {
					/**
					 * ID of the FilterBar
					 */
					id: {
						type: "string"
					},
					contextPath: {
						type: "sap.ui.model.Context"
					},
					/**
					 * Don't show the basic search field
					 */
					hideBasicSearch: {
						type: "boolean",
						defaultValue: false
					},

					/**
					 * Enables the fallback to show all fields of the EntityType as filter fields if com.sap.vocabularies.UI.v1.SelectionFields are not present
					 */
					enableFallback: {
						type: "boolean",
						defaultValue: false
					},

					/**
					 * Specifies the personalization options for the filter bar.
					 */
					p13nMode: {
						type: "sap.ui.mdc.FilterBarP13nMode[]"
					},

					/**
					 * Specifies the Sematic Date Range option for the filter bar.
					 */
					useSemanticDateRange: {
						type: "boolean",
						defaultValue: true
					},

					/**
					 * If set the search will be automatically triggered, when a filter value was changed.
					 */
					liveMode: {
						type: "boolean",
						defaultValue: false
					},
					/**
					 * Temporary workaround only
					 * path to valuelist
					 **/
					_valueList: {
						type: "sap.ui.model.Context",
						required: false
					},
					/**
					 * selectionFields to be displayed
					 **/
					selectionFields: {
						type: "sap.ui.model.Context",
						required: false
					},
					/**
					 * Filter conditions to be applied to the filter bar
					 **/
					filterConditions: {
						type: "string",
						required: false
					},
					/**
					 * If set to <code>true</code>, all search requests are ignored. Once it has been set to <code>false</code>,
					 * a search is triggered immediately if one or more search requests have been triggered in the meantime
					 * but were ignored based on the setting.
					 */
					suspendSelection: {
						type: "boolean",
						defaultValue: false
					}
				},
				events: {
					/**
					 * Search handler name
					 */
					search: {
						type: "function"
					},
					/**
					 * Filters changed handler name
					 */
					filterChanged: {
						type: "function"
					}
				}
			},
			create: function(oProps, oControlConfiguration, mSettings) {
				var oContext = oProps.contextPath;

				if (!oContext) {
					Log.error("Context Path not available for FilterBar Macro.");
					return;
				}
				var sContextPath = oContext.getPath();
				var sEntitySetPath = ModelHelper.getEntitySetPath(sContextPath);
				var oMetaModel = oContext.getModel();

				if (!oProps.selectionFields) {
					var oMetaPathContext = oProps.metaPath;
					var sMetaPath = oMetaPathContext && oMetaPathContext.getPath();
					var oVisualizationObjectPath = MetaModelConverter.getInvolvedDataModelObjects(oContext);
					var oConverterContext = this.getConverterContext(oVisualizationObjectPath, undefined, mSettings);

					var oSelectionFields = FilterBarConverter.getSelectionFields(oConverterContext, [], sMetaPath);
					oProps.selectionFields = new TemplateModel(oSelectionFields, oMetaModel).createBindingContext("/");
				}

				// TODO: this could be also moved into a central place
				if (
					oMetaModel.getObject(sEntitySetPath + "@com.sap.vocabularies.Common.v1.DraftRoot") ||
					oMetaModel.getObject(sEntitySetPath + "@com.sap.vocabularies.Common.v1.DraftNode")
				) {
					oProps.showDraftEditState = true;
				}

				return oProps;
			}
		});

		return FilterBar;
	}
);
