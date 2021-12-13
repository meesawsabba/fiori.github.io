/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"./MacroMetadata",
		"sap/fe/core/converters/controls/ListReport/FilterBar",
		"sap/fe/core/converters/MetaModelConverter",
		"sap/fe/core/TemplateModel",
		"sap/fe/core/helpers/ModelHelper",
		"sap/fe/core/CommonUtils",
		"sap/base/Log"
	],
	function(MacroMetadata, FilterBarConverter, MetaModelConverter, TemplateModel, ModelHelper, CommonUtils, Log) {
		"use strict";

		/**
		 * /**
		 * @classdesc
		 * Building block for creating a FilterBar based on the metadata provided by OData V4.
		 *
		 *
		 * Usage example:
		 * <pre>
		 * &lt;macro:FilterBar
		 *   id="SomeID"
		 *   showAdaptFiltersButton="true"
		 *   p13nMode=["Item","Value"]
		 *   listBindingNames = "sap.fe.tableBinding"
		 *   liveMode="true"
		 *   search=".handlers.onSearch"
		 *   filterChanged=".handlers.onFiltersChanged"
		 * /&gt;
		 * </pre>
		 *
		 * Building block for creating a FilterBar based on the metadata provided by OData V4.
		 * @class sap.fe.macros.FilterBar
		 * @hideconstructor
		 * @public
		 * @since 1.94.0
		 */
		return MacroMetadata.extend("sap.fe.macros.FilterBar", {
			/**
			 * Name of the building block control.
			 */
			name: "FilterBar",
			/**
			 * Name of the building block control.
			 */
			namespace: "sap.fe.macros.internal",
			publicNamespace: "sap.fe.macros",
			publicName: "FilterBar",
			/**
			 * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name
			 */
			fragment: "sap.fe.macros.FilterBar",

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
				designtime: "sap/fe/macros/FilterBar.designtime",
				/**
				 * Properties.
				 */
				properties: {
					/**
					 * selectionFields to be displayed
					 **/
					selectionFields: {
						type: "sap.ui.model.Context"
					},
					metaPath: {
						type: "sap.ui.model.Context",
						isPublic: true
					},
					contextPath: {
						type: "sap.ui.model.Context",
						isPublic: true
					},
					/**
					 * ID of the FilterBar
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
					 * ID of the assigned variant management
					 */
					variantBackreference: {
						type: "string"
					},
					/**
					 * Don't show the basic search field
					 */
					hideBasicSearch: {
						type: "boolean"
					},

					/**
					 * Enables the fallback to show all fields of the EntityType as filter fields if com.sap.vocabularies.UI.v1.SelectionFields are not present
					 */
					enableFallback: {
						type: "boolean",
						defaultValue: false
					},

					/**
					 * Handles visibility of the 'Adapt Filters' button on the FilterBar
					 */
					showAdaptFiltersButton: {
						type: "boolean",
						defaultValue: true
					},

					/**
					 * Specifies the personalization options for the filter bar.
					 */
					p13nMode: {
						type: "sap.ui.mdc.FilterBarP13nMode[]",
						defaultValue: "Item,Value"
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
					},
					showDraftEditState: {
						type: "boolean",
						defaultValue: false
					},
					/**
					 * Id of control that will allow for switching between normal and visual filter
					 */
					toggleControlId: {
						type: "string"
					},
					initialLayout: {
						type: "string",
						defaultValue: "compact"
					}
				},
				events: {
					/**
					 * Search handler name
					 */
					search: {
						type: "function",
						isPublic: true
					},
					/**
					 * Filters changed handler name
					 */
					filterChanged: {
						type: "function",
						isPublic: true
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
				var oMetaPathContext = oProps.metaPath;
				var sMetaPath = oMetaPathContext && oMetaPathContext.getPath();
				var sEntitySetPath = ModelHelper.getEntitySetPath(sContextPath);
				var oMetaModel = oContext.getModel();

				if (sMetaPath && !oProps.selectionFields) {
					var oVisualizationObjectPath = MetaModelConverter.getInvolvedDataModelObjects(oContext);
					var oConverterContext = this.getConverterContext(oVisualizationObjectPath, undefined, mSettings);
					var oSelectionFields = FilterBarConverter.getSelectionFields(
						oConverterContext,
						[],
						sMetaPath.replace(sContextPath, "")
					);
					oProps.selectionFields = new TemplateModel(oSelectionFields, oMetaModel).createBindingContext("/");
				}

				// TODO: this could be also moved into a central place
				if (
					oMetaModel.getObject(sEntitySetPath + "@com.sap.vocabularies.Common.v1.DraftRoot") ||
					oMetaModel.getObject(sEntitySetPath + "@com.sap.vocabularies.Common.v1.DraftNode")
				) {
					oProps.showDraftEditState = true;
				}

				if (oProps._applyIdToContent) {
					oProps._apiId = oProps.id + "::FilterBar";
					oProps._contentId = oProps.id;
				} else {
					oProps._apiId = oProps.id;
					oProps._contentId = oProps.id + "-content";
				}

				return oProps;
			}
		});
	}
);
