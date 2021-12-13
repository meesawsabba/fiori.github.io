import { APIClass, EventHandler, MacroContext, Property, Event } from "sap/fe/core/helpers/ClassSupport";
import { PasteHelper } from "sap/fe/core/helpers";
import { MessageBox } from "sap/m";
import { Device } from "sap/ui";
import { Log } from "sap/base";
import { PageController } from "sap/fe/core";
import { AnnotationTableColumn, TableColumn, TableVisualization } from "sap/fe/core/converters/controls/Common/Table";
import MacroAPI from "./MacroAPI";
import { MassEditHandler } from "sap/fe/macros/massedit";
import { DelegateUtil } from "sap/fe/macros";
import { Context } from "sap/ui/model/odata/v4";

/**
 * Definition of a custom action to be used inside the table toolbar
 *
 * @alias sap.fe.macros.table.Action
 * @public
 */
export type Action = {
	/**
	 * Unique identifier of the action
	 *
	 * @public
	 */
	key: string;
	/**
	 * The text that will be displayed for this action
	 *
	 * @public
	 */
	text: string;
	/**
	 * Reference to the key of another action already displayed in the toolbar to properly place this one
	 *
	 * @public
	 */
	anchor?: string;
	/**
	 * Defines where this action should be placed relative to the defined anchor
	 *
	 * Allowed values are `Before` and `After`
	 *
	 * @public
	 */
	placement?: string;

	/**
	 * Event handler to be called when the user chooses the action
	 *
	 * @public
	 */
	press: string;
};

/**
 * Definition of a custom column to be used inside the table.
 *
 * The template for the column has to be provided as the default aggregation
 *
 * @alias sap.fe.macros.table.Column
 * @public
 * @experimental
 */
export type Column = {
	/**
	 * Unique identifier of the column
	 *
	 * @public
	 */
	key: string;
	/**
	 * The text that will be displayed for this column header
	 *
	 * @public
	 */
	header: string;
	/**
	 * Reference to the key of another column already displayed in the table to properly place this one
	 *
	 * @public
	 */
	anchor?: string;
	/**
	 * Defines where this column should be placed relative to the defined anchor
	 *
	 * Allowed values are `Before` and `After`
	 *
	 * @public
	 */
	placement?: string;
};

/**
 * Building block used to create a table based on the metadata provided by OData V4.
 * <br>
 * Usually, a LineItem or PresentationVariant annotation is expected, but the Table building block can also be used to display an EntitySet.
 *
 *
 * Usage example:
 * <pre>
 * &lt;macro:Table id="MyTable" metaPath="@com.sap.vocabularies.UI.v1.LineItem" /&gt;
 * </pre>
 *
 * @alias sap.fe.macros.Table
 * @public
 */
@APIClass("sap.fe.macros.TableAPI")
class TableAPI extends MacroAPI {
	@MacroContext()
	tableDefinition!: TableVisualization;

	/**
	 * An expression that allows you to control the 'read-only' state of the table.
	 *
	 * If you do not set any expression, SAP Fiori elements hooks into the standard lifecycle to determine the current state.
	 *
	 * @public
	 */
	@Property({ type: "boolean" })
	readOnly!: boolean;

	/**
	 * The identifier of the table control.
	 *
	 * @public
	 */
	@Property({ type: "string" })
	id!: string;

	/**
	 * An expression that allows you to control the 'busy' state of the table.
	 *
	 * @public
	 */
	@Property({ type: "boolean", defaultValue: false })
	busy!: boolean;

	/**
	 * Defines the type of table that will be used by the macro to render the data.
	 *
	 * Allowed values are `GridTable` and `ResponsiveTable`
	 *
	 * @public
	 */
	@Property({ type: "string", defaultValue: "ResponsiveTable" })
	type!: string;

	/**
	 * Controls if the export functionality of the table is enabled or not.
	 *
	 * @public
	 */
	@Property({ type: "boolean", defaultValue: true })
	enableExport!: boolean;

	/**
	 * Controls if the paste functionality of the table is enabled or not.
	 *
	 * @public
	 */
	@Property({ type: "boolean", defaultValue: false })
	enablePaste!: boolean;

	/**
	 * Controls whether the table can be opened in fullscreen mode or not.
	 *
	 * @public
	 */
	@Property({ type: "boolean", defaultValue: false })
	enableFullScreen!: boolean;

	/**
	 * Defines the selection mode to be used by the table.
	 *
	 * Allowed values are `None`, `Single`, `Multi` or `Auto`
	 *
	 * @public
	 */
	@Property({ type: "string" })
	selectionMode!: string;

	/**
	 * Specifies the header text that is shown in the table.
	 *
	 * @public
	 */
	@Property({ type: "string" })
	header!: string;

	/**
	 * Specifies the header text that is shown in the table.
	 *
	 * @public
	 */
	@Property({ type: "boolean", defaultValue: false })
	enableAutoColumnWidth!: boolean;

	/**
	 * Controls if the header text should be shown or not.
	 *
	 * @public
	 */
	@Property({ type: "boolean", defaultValue: true })
	headerVisible!: boolean;

	/**
	 * An event triggered when the user chooses a row; the event contains information about which row was chosen.
	 *
	 * You can set this in order to handle the navigation manually.
	 *
	 * @public
	 */
	@Event
	rowPress!: Function;

	/**
	 * Controls which options should be enabled for the table personalization dialog.
	 *
	 * If it is set to `true`, all possible options for this kind of table are enabled.<br/>
	 * If it is set to `false`, personalization is disabled.<br/>
	 *<br/>
	 * You can also provide a more granular control for the personalization by providing a comma-separated list with the options you want to be available.<br/>
	 * Available options are:<br/>
	 *  - Sort<br/>
	 *  - Column<br/>
	 *  - Filter<br/>
	 *
	 * @public
	 */
	@Property({ type: "boolean|string", defaultValue: true })
	personalization!: boolean | string;

	/**
	 * Controls the kind of variant management that should be enabled for the table.
	 *
	 * Allowed values are `Page`, `Control` and `None`.<br/>
	 * If the table is used within a SAP Fiori elements template, the default value will be taken from the current page variant management.<br/>
	 * Otherwise it's `None`.
	 *
	 * @public
	 */
	@Property({ type: "string" })
	variantManagement!: string;

	/**
	 * Controls if the dataStateIndicator functionality of the table is enabled or not.
	 *
	 */
	@Property({ type: "boolean" })
	enableDataStateFilter!: boolean;

	@EventHandler
	onTableRowPress(oEvent: UI5Event, oController: PageController, oContext: Context, mParameters: any) {
		// In the case of an analytical table, if we're trying to navigate to a context corresponding to a visual group or grand total
		// --> Cancel navigation
		if (
			oContext &&
			oContext.isA("sap.ui.model.odata.v4.Context") &&
			typeof oContext.getProperty("@$ui5.node.isExpanded") === "boolean"
		) {
			return false;
		} else {
			oController._routing.navigateForwardToContext(oContext, mParameters);
		}
	}

	@EventHandler
	onInternalDataReceived(oEvent: UI5Event) {
		if (oEvent.getParameter("error")) {
			this.getController().messageHandler.showMessageDialog();
		}
	}
	@EventHandler
	onPaste(oEvent: UI5Event, oController: PageController) {
		// If paste is disable or if we're not in edit mode, we can't paste anything
		if (!this.tableDefinition.control.enablePaste || !this.getModel("ui").getProperty("/isEditable")) {
			return;
		}

		const aRawPastedData = oEvent.getParameter("data"),
			oTable = oEvent.getSource(),
			bPasteEnabled = oTable.data()["enablePaste"];
		let oResourceModel;

		if (bPasteEnabled === true || bPasteEnabled === "true") {
			PasteHelper.parseDataForTablePaste(aRawPastedData, oTable)
				.then(aParsedData => {
					if (aParsedData && aParsedData.length > 0) {
						return oController._editFlow.createMultipleDocuments(
							oTable.getRowBinding(),
							aParsedData,
							this.tableDefinition.control.createAtEnd,
							true
						);
					}
				})
				.catch(oError => {
					Log.error("Error while pasting data", oError);
				});
		} else {
			oResourceModel = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");
			MessageBox.error(oResourceModel.getText("T_OP_CONTROLLER_SAPFE_PASTE_DISABLED_MESSAGE"), {
				title: oResourceModel.getText("C_COMMON_SAPFE_ERROR")
			});
		}
	}

	@EventHandler
	onPasteButtonPressed() {
		const oResourceModel = sap.ui.getCore().getLibraryResourceBundle("sap.fe.templates"),
			sDeviceOs = Device.os.name,
			sDeviceSystem = Device.system;
		// We need a default in case we fall through the crack
		let sMessageOnPasteButton: string = oResourceModel.getText("T_OP_CONTROLLER_TABLE_PASTE_BUTTON_ACTION_MESSAGE_WINDOWS_DESKTOP");
		// On mobile, there is no native paste trigger:
		if (sDeviceSystem.phone || (sDeviceSystem.tablet && !sDeviceSystem.combi)) {
			sMessageOnPasteButton = oResourceModel.getText("T_OP_CONTROLLER_TABLE_PASTE_BUTTON_ACTION_MESSAGE_TOUCH_DEVICE");
		} else if (sDeviceSystem.desktop) {
			switch (sDeviceOs) {
				case "win":
					sMessageOnPasteButton = oResourceModel.getText("T_OP_CONTROLLER_TABLE_PASTE_BUTTON_ACTION_MESSAGE_WINDOWS_DESKTOP");
					break;
				case "mac":
					sMessageOnPasteButton = oResourceModel.getText("T_OP_CONTROLLER_TABLE_PASTE_BUTTON_ACTION_MESSAGE_IOS_DESKTOP");
					break;
			}
		}
		MessageBox.information(sMessageOnPasteButton, {
			onClose: () => {
				if (this.content) {
					// Set the focus on the inner table to allow paste
					(this.content.getAggregation("_content") as any)?.applyFocusInfo({ preventScroll: true });
				}
			}
		});
	}

	// This event will allow us to intercept the export before is triggered to cover specific cases
	// that couldn't be addressed on the propertyInfos for each column.
	// e.g. Fixed Target Value for the datapoints
	@EventHandler
	onBeforeExport(oEvent: UI5Event) {
		const isSplitMode = oEvent.getParameters().userExportSettings.splitCells,
			isRLTLanguage = sap.ui
				.getCore()
				.getConfiguration()
				.getRTL(),
			oTableController = oEvent.getSource(),
			oExportColumns = oEvent.getParameters().exportSettings.workbook?.columns,
			oTableColumns = this.tableDefinition.columns;

		TableAPI.updateExportSettings(oExportColumns, oTableColumns, oTableController, isSplitMode, isRLTLanguage);
	}

	/**
	 * Handles the MDC DataStateIndicator plugin to display messageStrip on a table.
	 * @param oMessage
	 * @param oTable
	 * @name dataStateFilter
	 * @returns {boolean} Whether to render visible the messageStrip
	 */
	static shouldFilterDataStateMessage(oMessage: any, oTable: any): boolean {
		let oTableAPI = oTable.getParent();
		while (!oTableAPI.isA("sap.fe.macros.TableAPI")) {
			oTableAPI = oTableAPI.getParent();
		}
		return oTableAPI.tableDefinition.enableDataStateFilter;
	}

	/**
	 * This event handles the DataState of the DataStateIndicator plugin from MDC on a table.
	 * It's fired when new error messages are sent from the backend to update row highlighting.
	 *
	 * @name onDataStateChange
	 * @param {object} oEvent Event object
	 */
	@EventHandler
	onDataStateChange(oEvent: UI5Event) {
		const oDataStateIndicator = oEvent.getSource();
		const aFilteredMessages = oEvent.getParameter("filteredMessages");
		if (aFilteredMessages) {
			const oInternalModel = oDataStateIndicator.getModel("internal");
			oInternalModel.setProperty("filteredMessages", aFilteredMessages, oDataStateIndicator.getBindingContext("internal"));
		}
	}

	static updateExportSettings(
		oExportColumns: any,
		oColumns: TableColumn[],
		oTableController: PageController,
		isSplitMode: boolean,
		isRLTLanguage: boolean
	): any {
		oExportColumns.forEach((oColumnExport: any) => {
			let aExportLabels: string[] = [];
			oColumns?.forEach(column => {
				const oColumn = column as AnnotationTableColumn;
				if (isSplitMode) {
					// aExportLabels will contain labels from a FieldGroup, a text annotation and a DataPoint
					// These labels will be used for child properties (simple properties) from complexProperty
					// Unit/currency properties will be dismiss as it could be used in several datafields.
					const isUnit = oColumns.some(column => (column as AnnotationTableColumn).unit === oColumnExport.property);
					// Create Exporting labels array
					const FieldGroupLabel = TableAPI._getFieldGroupExportLabel(oColumnExport, oColumn, oTableController);
					if (FieldGroupLabel) {
						aExportLabels.unshift(FieldGroupLabel);
					}
					// For a text annotation, export label template used is <value> - <description> and for a DataPoint <datapointValue> - <TargetValue>.
					// In both cases internationalization is needed
					const dataFieldDescriptionLabel = TableAPI._getDataFieldDescriptionLabel(
						oColumnExport,
						oColumn,
						oTableController,
						isUnit
					);
					if (dataFieldDescriptionLabel) {
						aExportLabels.unshift(dataFieldDescriptionLabel);
					}

					//Add TargetValue on dummy created property when  exporting on split mode
					if (oColumn.isDataPointFakeTargetProperty && oColumn.relativePath === oColumnExport.property) {
						oColumnExport.property = [oColumnExport.property];
					}
				}
				//Modify exported value when using Communication.Contact dataFieldForAnnotation
				//contact>fn property should be exported
				if (oColumn.exportContactProperty && column.propertyInfos) {
					if (column.propertyInfos?.length === 1 && column.propertyInfos?.toString() === oColumnExport.property.toString()) {
						oColumnExport.property = oColumn.exportContactProperty;
						oColumnExport.label = oColumn.label;
					} else if (
						column.propertyInfos?.length > 1 &&
						oColumn.propertyInfos?.some(prop => oColumnExport.property.includes(prop)) &&
						Array.isArray(oColumnExport.property)
					) {
						oColumnExport.property = oColumnExport.property?.map((property: string) => {
							return oColumn.propertyInfos?.some(prop => prop === property) ? oColumn.exportContactProperty : property;
						});
					}
				}
			});
			aExportLabels.push(DelegateUtil.getLocalizedText(oColumnExport.label, oTableController));
			if (aExportLabels.length > 1) {
				// Remove duplicate labels (e.g. FieldGroup label is the same as the label of one of the properties)
				aExportLabels = aExportLabels.filter(function(label, index) {
					if (aExportLabels.indexOf(label) == index) {
						return label;
					}
				});
			}
			// Check if a RTL language if used and if so we need to reverse labels
			if (isRLTLanguage) {
				aExportLabels.reverse();
			}
			oColumnExport.label = aExportLabels.join(" - ");
		});
		return oExportColumns;
	}

	static _getFieldGroupExportLabel(oColumnExport: any, oColumn: AnnotationTableColumn, oTableController: PageController) {
		if (
			(oColumnExport.columnId.indexOf("::FieldGroup::") !== -1 ||
				(oColumn.exportSettings?.fieldLabel && oColumnExport.columnId.indexOf("__column") !== -1)) &&
			(oColumn.propertyInfos?.includes(oColumnExport.property) ||
				oColumn.propertyInfos?.includes("Property::" + oColumnExport.property))
		) {
			const label = oColumn.exportSettings?.fieldLabel || oColumn.label;
			return DelegateUtil.getLocalizedText(label as string, oTableController);
		}
	}

	static _getDataFieldDescriptionLabel(
		oColumnExport: any,
		oColumn: AnnotationTableColumn,
		oTableController: PageController,
		isUnit: boolean
	) {
		if (
			oColumn.propertyInfos &&
			oColumn.propertyInfos?.length > 1 &&
			!isUnit &&
			(oColumn.propertyInfos?.includes(oColumnExport.property) ||
				oColumn.propertyInfos?.includes("Property::" + oColumnExport.property)) &&
			oColumn.relativePath?.indexOf("@com.sap.vocabularies.UI.v1.FieldGroup") === -1
		) {
			return DelegateUtil.getLocalizedText(oColumn.label as string, oTableController);
		}
	}
	@EventHandler
	onMassEditButtonPressed(oEvent: UI5Event, PageController: PageController) {
		const oTable = this.content;
		MassEditHandler.openMassEditDialog(oTable, PageController);
	}
}

export default TableAPI;
