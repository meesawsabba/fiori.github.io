import { APIClass, Property, EventHandler, Event } from "sap/fe/core/helpers/ClassSupport";
import MacroAPI from "./MacroAPI";
import { merge } from "sap/base/util";

/**
 * Building block for creating a FilterBar based on the metadata provided by OData V4.
 * <br>
 * Usually, a SelectionFields annotation is expected.
 *
 *
 * Usage example:
 * <pre>
 * &lt;macro:FilterBar id="MyFilterBar" metaPath="@com.sap.vocabularies.UI.v1.SelectionFields" /&gt;
 * </pre>
 *
 * @alias sap.fe.macros.FilterBar
 * @public
 */
@APIClass("sap.fe.macros.FilterBarAPI")
class FilterBarAPI extends MacroAPI {
	/**
	 * The identifier of the filterbar control.
	 *
	 * @public
	 */
	@Property({ type: "string" })
	id!: string;

	/**
	 * This event is fired when the Go button is pressed or after a condition change.
	 *
	 * @public
	 */
	@Event
	search!: Function;

	/**
	 * This event is fired after either a filter value or the visibility of a filter item has been changed.
	 * The event contains conditions that will be used as filters.
	 *
	 * @public
	 */
	@Event
	filterChanged!: Function;

	@EventHandler
	handleSearch(oEvent: UI5Event) {
		const oFilterBar = oEvent.getSource();
		const oEventParameters = oEvent.getParameters();
		if (oFilterBar) {
			const oConditions = oFilterBar.getFilterConditions();
			(this as any).fireSearch(merge({ conditions: oConditions }, oEventParameters));
		}
	}

	@EventHandler
	handleFilterChanged(oEvent: UI5Event) {
		const oFilterBar = oEvent.getSource();
		const oEventParameters = oEvent.getParameters();
		if (oFilterBar) {
			const oConditions = oFilterBar.getFilterConditions();
			(this as any).fireFilterChanged(merge({ conditions: oConditions }, oEventParameters));
		}
	}
}

export default FilterBarAPI;
