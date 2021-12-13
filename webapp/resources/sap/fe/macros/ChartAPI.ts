import { APIClass, Property, EventHandler, Event } from "sap/fe/core/helpers/ClassSupport";
import MacroAPI from "./MacroAPI";
import { merge } from "sap/base/util";

/**
 * Building block used to create a chart based on the metadata provided by OData V4.
 * <br>
 * Usually, a contextPath and metaPath is expected.
 *
 *
 * Usage example:
 * <pre>
 * &lt;macro:Chart id="Mychart" contextPath="/RootEntity" metaPath="@com.sap.vocabularies.UI.v1.Chart" /&gt;
 * </pre>
 *
 * @alias sap.fe.macros.Chart
 * @public
 */
@APIClass("sap.fe.macros.ChartAPI")
class ChartAPI extends MacroAPI {
	/**
	 *
	 * ID of the chart
	 *
	 * @public
	 */
	@Property({ type: "string" })
	id!: string;

	/**
	 * Metadata path to the presentation (UI.Chart w or w/o qualifier)
	 *
	 * @public
	 */
	@Property({ type: "sap.ui.model.Context", required: true })
	metaPath!: string;

	/**
	 * Metadata path to the entitySet or navigationProperty
	 *
	 * @public
	 */
	@Property({ type: "sap.ui.model.Context", required: true })
	contextPath!: string;

	/**
	 * Specifies the selection mode
	 *
	 * @public
	 */
	@Property({ type: "string", defaultValue: "MULTIPLE" })
	selectionMode!: string;

	/**
	 * Parameter which sets the personalization of the MDC chart
	 *
	 * @public
	 */
	@Property({ type: "boolean|string" })
	personalization!: boolean | string;

	/**
	 * An event triggered when chart selections are changed. The event contains information about the data selected/deselected and
	 * boolean flag that indicates whether data is selected or deselected.
	 *
	 * @public
	 */
	@Event
	selectionChange!: Function;

	@EventHandler
	handleSelectionChange(oEvent: UI5Event) {
		const aData = oEvent.getParameter("data");
		const bSelected = oEvent.getParameter("name") === "selectData";
		(this as any).fireSelectionChange(merge({}, { data: aData, selected: bSelected }));
	}
}

export default ChartAPI;
