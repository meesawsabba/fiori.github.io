/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"./MacroMetadata",
		"sap/fe/core/templating/DataModelPathHelper",
		"sap/fe/core/converters/ConverterContext",
		"sap/fe/core/converters/MetaModelConverter",
		"sap/fe/core/converters/controls/Common/DataVisualization",
		"sap/fe/core/helpers/StableIdHelper",
		"sap/fe/macros/internal/helpers/TableTemplating"
	],
	function(MacroMetadata, DataModelPathHelper, ConverterContext, MetaModelConverter, DataVisualization, StableIdHelper, TableTemplating) {
		"use strict";

		/**
		 * @classdesc
		 * Building block used to create a table based on the metadata provided by OData V4.
		 *
		 * Usage example:
		 * <pre>
		 * &lt;macro:Table
		 *   id="someID"
		 *   type="ResponsiveTable"
		 *   collection="collection",
		 *   presentation="presentation"
		 *   selectionMode="Multi"
		 *   requestGroupId="$auto.test"
		 *   displayMode="false"
		 *   personalization="Column,Sort"
		 * /&gt;
		 * </pre>
		 *
		 * @class sap.fe.macros.Table
		 * @hideconstructor
		 * @private
		 * @experimental
		 */

		var Table = MacroMetadata.extend("sap.fe.macros.Table", {
			/**
			 * Name of the macro control.
			 */
			name: "Table",
			/**
			 * Namespace of the macro control
			 */
			namespace: "sap.fe.macros.internal",
			publicNamespace: "sap.fe.macros",
			publicName: "Table",
			/**
			 * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name
			 */
			fragment: "sap.fe.macros.Table",
			/**
			 * The metadata describing the macro control.
			 */
			metadata: {
				/**
				 * Define macro stereotype for documentation
				 */
				stereotype: "xmlmacro",
				/**
				 * Properties.
				 */
				properties: {
					tableDefinition: {
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
					 * metadataContext:collection Mandatory context to a collection (entitySet or 1:n navigation)
					 */
					collection: {
						type: "sap.ui.model.Context",
						required: true,
						$kind: ["EntitySet", "NavigationProperty"]
					},
					/**
					 * Parent EntitySet for the present collection
					 */
					parentEntitySet: {
						type: "sap.ui.model.Context"
					},

					/**
					 * ID of the table
					 */
					id: {
						type: "string",
						isPublic: true
					},
					_apiId: {
						type: "string"
					},
					/**
					 * List binding information for mdc.Table (ui5object: true is needed to prevent this property being used as a binding). If not specified, it is created from the metadata information
					 *
					 */
					rowsBindingInfo: {
						type: "object"
					},
					/**
					 * Used for binding the table to a navigation path. Only the path is used for binding rows.
					 */
					navigationPath: {
						type: "string"
					},
					/**
					 * Specifies whether the table should be read-only or not.
					 */
					readOnly: {
						type: "boolean",
						isPublic: true
					},
					/**
					 * Specifies whether the button is hidden when no data has been entered yet in the row (true/false). The default setting is `false`.
					 */
					disableAddRowButtonForEmptyData: {
						type: "boolean"
					},
					/**
					 * Specifies the full path and function name of a custom validation function.
					 */
					customValidationFunction: {
						type: "string"
					},
					/**
					 * Specifies whether the table is displayed with condensed layout (true/false). The default setting is `false`.
					 */
					useCondensedTableLayout: {
						type: "boolean"
					},
					/**
					 * Specifies the possible actions available on the table row (Navigation,null). The default setting is `undefined`
					 */
					rowAction: {
						type: "string",
						defaultValue: undefined
					},
					/**
					 * Specifies the selection mode (None,Single,Multi,Auto)
					 */
					selectionMode: {
						type: "string",
						isPublic: true
					},

					/**
					 * The `busy` mode of table
					 */
					busy: {
						type: "boolean",
						isPublic: true
					},
					/**
					 * Parameter used to show the fullScreen button on the table.
					 */
					enableFullScreen: {
						type: "boolean",
						isPublic: true
					},
					/**
					 * Parameter used to hide the `delete` button on the table on the object page. The default value if `false`.
					 */
					showDelete: {
						type: "boolean"
					},
					/**
					 * Specifies header text that is shown in table.
					 */
					header: {
						type: "string",
						isPublic: true
					},
					/**
					 * Controls if the header text should be shown or not
					 */
					headerVisible: {
						type: "boolean",
						isPublic: true
					},
					/**
					 * Parameter which sets the noDataText for the mdc table
					 */
					noDataText: {
						type: "string"
					},
					/**
					 * Creation Mode to be passed to the onCreate hanlder. Values: ["Inline", "NewPage"]
					 */
					creationMode: {
						type: "string"
					},
					/**
					 * Setting to determine if the new row should be created at the end or beginning
					 */
					createAtEnd: {
						type: "boolean"
					},
					createOutbound: {
						type: "string"
					},
					createOutboundDetail: {
						type: "string"
					},
					createNewAction: {
						type: "string"
					},
					/**
					 * Personalization Mode
					 */
					personalization: {
						type: "string|boolean",
						isPublic: true
					},
					/**
					 * Allows to choose the Table type. Allowed values are `ResponsiveTable` or `GridTable`.
					 */
					type: {
						type: "string",
						isPublic: true
					},
					tableType: {
						type: "string"
					},
					/**
					 * Enable export to file
					 */
					enableExport: {
						type: "boolean",
						isPublic: true
					},
					/**
					 * Enable export to file
					 */
					enablePaste: {
						type: "boolean",
						isPublic: true
					},
					_pasteVisible: {
						type: "boolean"
					},
					/**
					 * ONLY FOR GRID TABLE: Number of indices which can be selected in a range. If set to 0, the selection limit is disabled, and the Select All checkbox appears instead of the Deselect All button.
					 */
					selectionLimit: {
						type: "string"
					},
					/**
					 * ONLY FOR RESPONSIVE TABLE: Setting to define the checkbox in the column header: Allowed values are `Default` or `ClearAll`. If set to `Default`, the sap.m.Table control renders the Select All checkbox, otherwise the Deselect All button is rendered.
					 */
					multiSelectMode: {
						type: "string"
					},
					/**
					 * The control ID of the FilterBar that is used to filter the rows of the table.
					 */
					filterBarId: {
						type: "string"
					},

					/**
					 * Settings for behavior when creating new entries
					 */
					create: {
						type: "sap.ui.model.Context"
					},

					tableDelegate: {
						type: "string"
					},
					enableAutoScroll: {
						type: "boolean"
					},
					visible: {
						type: "string"
					},
					isAlp: {
						type: "boolean",
						defaultValue: false
					},
					variantManagement: {
						type: "string",
						isPublic: true
					},
					columnEditMode: {
						type: "string",
						computed: true
					},
					tabTitle: {
						type: "string",
						defaultValue: ""
					},
					enableAutoColumnWidth: {
						type: "boolean"
					}
				},
				events: {
					variantSaved: {
						type: "function"
					},
					variantSelected: {
						type: "function"
					},
					/**
					 * Event handler for change event
					 */
					onChange: {
						type: "function"
					},
					/**
					 * Event handler to react when the user chooses a row
					 */
					rowPress: {
						type: "function",
						isPublic: true
					},
					/**
					 * Event handler to react to the contextChange event of the table.
					 */
					onContextChange: {
						type: "function"
					},
					/**
					 * Event handler called when the user chooses an option of the segmented button in the ALP View
					 */
					onSegmentedButtonPressed: {
						type: "function"
					}
				},
				aggregations: {
					actions: {
						type: "sap.fe.macros.internal.table.Action",
						isPublic: true
					},
					columns: {
						type: "sap.fe.macros.internal.table.Column",
						isPublic: true
					}
				}
			},
			create: function(oProps, oControlConfiguration, mSettings, oAggregations) {
				var oTableDefinition;
				var oContextObjectPath = MetaModelConverter.getInvolvedDataModelObjects(oProps.metaPath, oProps.contextPath);
				var oExtraActions = this.parseAggregation(oAggregations.actions, function(childAction, childIdx) {
					var actionKey = childAction.getAttribute("key") || "InlineXMLAction_" + childIdx;
					return {
						key: actionKey,
						text: childAction.getAttribute("text"),
						position: {
							placement: childAction.getAttribute("placement"),
							anchor: childAction.getAttribute("anchor")
						},
						__noWrap: true,
						press: childAction.getAttribute("press")
					};
				});

				var oExtraColumns = this.parseAggregation(oAggregations.columns, function(childColumn, columnChildIdx) {
					var columnKey = childColumn.getAttribute("key") || "InlineXMLColumn_" + columnChildIdx;
					oAggregations[columnKey] = childColumn;
					return {
						key: columnKey,
						header: childColumn.getAttribute("header"),
						position: {
							placement: childColumn.getAttribute("placement"),
							anchor: childColumn.getAttribute("anchor")
						},
						type: "Slot"
					};
				});
				if (oProps.tableDefinition === undefined || oProps.tableDefinition === null) {
					var sVisualizationPath = DataModelPathHelper.getContextRelativeTargetObjectPath(oContextObjectPath);
					var oExtraParams = {};
					oExtraParams[sVisualizationPath] = {
						actions: oExtraActions,
						columns: oExtraColumns
					};
					var oConverterContext = this.getConverterContext(oContextObjectPath, oProps.contextPath, mSettings, oExtraParams);

					var oVisualizationDefinition = DataVisualization.getDataVisualizationConfiguration(
						sVisualizationPath,
						oProps.useCondensedLayout,
						oConverterContext
					);
					oTableDefinition = oVisualizationDefinition.visualizations[0];

					oProps.tableDefinition = this.createBindingContext(oTableDefinition, mSettings);
				} else {
					oTableDefinition = oProps.tableDefinition.getObject();
				}
				oTableDefinition.path = oProps.tableDefinition.getPath();
				// API Properties
				this.setDefaultValue(oProps, "enableFullScreen", oTableDefinition.control.enableFullScreen);
				this.setDefaultValue(oProps, "useCondensedTableLayout", oTableDefinition.control.useCondensedTableLayout);
				this.setDefaultValue(oProps, "disableAddRowButtonForEmptyData", oTableDefinition.control.disableAddRowButtonForEmptyData);
				this.setDefaultValue(oProps, "customValidationFunction", oTableDefinition.control.customValidationFunction);
				this.setDefaultValue(oProps, "enableExport", oTableDefinition.control.enableExport);
				this.setDefaultValue(oProps, "enablePaste", oTableDefinition.annotation.show.paste);
				this.setDefaultValue(oProps, "headerVisible", oTableDefinition.control.headerVisible);
				this.setDefaultValue(oProps, "searchable", oTableDefinition.annotation.searchable);
				this.setDefaultValue(oProps, "showRowCount", oTableDefinition.control.showRowCount);
				this.setDefaultValue(oProps, "header", oTableDefinition.annotation.title);
				this.setDefaultValue(oProps, "selectionLimit", oTableDefinition.control.selectionLimit);
				this.setDefaultValue(oProps, "type", oTableDefinition.control.type);
				if (oProps.id) {
					// The given ID shall be assigned to the TableAPI and not to the MDC Table
					oProps._apiId = oProps.id;
					oProps.id = oProps.id + "-content";
				} else {
					// We generate the ID. Due to compatibility reasons we keep it on the MDC Table but provide assign
					// the ID with a ::Table suffix to the TableAPI
					this.setDefaultValue(oProps, "id", oTableDefinition.annotation.id);
					oProps._apiId = oTableDefinition.annotation.id + "::Table";
				}

				this.setDefaultValue(oProps, "selectionMode", oTableDefinition.annotation.selectionMode);
				this.setDefaultValue(oProps, "creationMode", oTableDefinition.annotation.create.mode);
				this.setDefaultValue(oProps, "createAtEnd", oTableDefinition.annotation.create.append);
				this.setDefaultValue(oProps, "createOutbound", oTableDefinition.annotation.create.outbound);
				this.setDefaultValue(oProps, "createNewAction", oTableDefinition.annotation.create.newAction);
				this.setDefaultValue(oProps, "createOutboundDetail", oTableDefinition.annotation.create.outboundDetail);

				this.setDefaultValue(oProps, "showDelete", oTableDefinition.annotation.show.delete);
				this.setDefaultValue(oProps, "personalization", oTableDefinition.annotation.p13nMode);
				this.setDefaultValue(oProps, "variantManagement", oTableDefinition.annotation.variantManagement);
				this.setDefaultValue(oProps, "enableAutoColumnWidth", oTableDefinition.control.enableAutoColumnWidth);
				// Special code for readOnly
				// readonly = false -> Force editable
				// readonly = true -> Force display mode
				// readonly = undefined -> Bound to edit flow
				if (oProps.readOnly === "false") {
					oProps.readOnly = false;
				} else if (oProps.readOnly === "true") {
					oProps.readOnly = true;
				}
				if (oProps.readOnly === undefined && oTableDefinition.annotation.displayMode === true) {
					oProps.readOnly = true;
				}

				if (oProps.rowPress) {
					oProps.rowAction = "Navigation";
				}
				this.setDefaultValue(oProps, "rowPress", oTableDefinition.annotation.row.press);
				this.setDefaultValue(oProps, "rowAction", oTableDefinition.annotation.row.action);

				if (oProps.personalization === "false") {
					oProps.personalization = undefined;
				} else if (oProps.personalization === "true") {
					oProps.personalization = "Sort,Column,Filter";
				}

				var useBasicSearch = false;
				if (!oProps.filterBarId && oProps.searchable) {
					oProps.filterBarId = StableIdHelper.generate([oProps.id, "StandardAction", "BasicSearch"]);
					useBasicSearch = true;
				}

				// Internal properties
				oProps.useBasicSearch = useBasicSearch;
				oProps._pasteVisible = oTableDefinition.annotation.show.paste;
				oProps.massEditVisible = oTableDefinition.annotation.show.massEdit.visible;
				oProps.massEditEnabled = oTableDefinition.annotation.show.massEdit.enabled;
				oProps.tableType = oProps.type;
				oProps.showCreate = oTableDefinition.annotation.show.create || true;
				oProps.autoBindOnInit = oTableDefinition.annotation.autoBindOnInit;

				// Internal that I want to remove in the end
				oProps.parentEntityDeleteEnabled = oTableDefinition.annotation.parentEntityDeleteEnabled;
				oProps.navigationPath = oTableDefinition.annotation.navigationPath;
				oProps.parentEntitySet = mSettings.models.metaModel.createBindingContext(
					"/" +
						(oContextObjectPath.contextLocation.targetEntitySet
							? oContextObjectPath.contextLocation.targetEntitySet.name
							: oContextObjectPath.startingEntitySet.name)
				);
				oProps.collection = mSettings.models.metaModel.createBindingContext(oTableDefinition.annotation.collection);
				oProps.columnEditMode = undefined;
				if (oProps.readOnly === true) {
					oProps.columnEditMode = "Display";
				} else if (oProps.readOnly === false) {
					oProps.columnEditMode = "Editable";
				}
				// Regarding the remaining ones that I think we could review
				// selectedContextsModel -> potentially hardcoded or internal only
				// onContextChange -> Autoscroll ... might need revision
				// onChange -> Just proxied down to the Field may need to see if needed or not
				// variantSelected / variantSaved -> Variant Management standard helpers ?
				// tableDelegate  -> used externally for ALP ... might need to see if relevant still
				// onSegmentedButtonPressed -> ALP specific, should be a dedicated control for the contentViewSwitcher
				// visible -> related to this ALP contentViewSwitcher... maybe an outer control would make more sense ?

				oProps.headerBindingExpression = TableTemplating.buildExpressionForHeaderVisible(oProps);
				return oProps;
			}
		});
		return Table;
	}
);
