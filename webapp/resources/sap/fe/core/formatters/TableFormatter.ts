import { ManagedObject } from "sap/ui/base";
import { MessageType } from "sap/fe/core/formatters/TableFormatterTypes";

/**
 * rowHighlighting
 *
 * @param {object} this The context
 * @param {string|number} CriticalityValue criticality value
 * @param {number} messageLastUpdate Timestamp of the last message created,  It's defined as input value but it is not used in the body of the function
 * It is used to refresh the formatting of the table each time a new message is updated
 * @returns {object} The value from the inner function
 */

const rowHighlighting = function(this: ManagedObject, criticalityValue: string | number, aFilteredMessages: any[]): MessageType {
	if (aFilteredMessages) {
		const sCurrentContextPath = this.getBindingContext() ? this.getBindingContext().getPath() : undefined;
		aFilteredMessages.forEach((oMessage: any) => {
			if (oMessage.aTargets[0].indexOf(sCurrentContextPath) === 0) {
				criticalityValue = oMessage.type;
			}
		});
	}

	let criticalityProperty;
	if (typeof criticalityValue === "string") {
		return (criticalityValue as unknown) as MessageType;
	}
	switch (criticalityValue) {
		case 1:
			criticalityProperty = MessageType.Error;
			break;
		case 2:
			criticalityProperty = MessageType.Warning;
			break;
		case 3:
			criticalityProperty = MessageType.Success;
			break;
		case 5:
			criticalityProperty = MessageType.Information;
			break;
		default:
			criticalityProperty = MessageType.None;
	}

	return criticalityProperty;
};
rowHighlighting.__functionName = "sap.fe.core.formatters.TableFormatter#rowHighlighting";

const navigatedRow = function(this: ManagedObject, sDeepestPath: string) {
	if (this.getBindingContext() && sDeepestPath) {
		return sDeepestPath.indexOf(this.getBindingContext().getPath()) === 0;
	} else {
		return false;
	}
};
navigatedRow.__functionName = "sap.fe.core.formatters.TableFormatter#navigatedRow";

// See https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters for more detail on this weird syntax
/**
 * Collection of table formatters.
 *
 * @param {object} this The context
 * @param {string} sName The inner function name
 * @param {object[]} oArgs The inner function parameters
 * @returns {object} The value from the inner function
 */
const tableFormatters = function(this: object, sName: string, ...oArgs: any[]): any {
	if (tableFormatters.hasOwnProperty(sName)) {
		return (tableFormatters as any)[sName].apply(this, oArgs);
	} else {
		return "";
	}
};

tableFormatters.rowHighlighting = rowHighlighting;
tableFormatters.navigatedRow = navigatedRow;
/**
 * @global
 */
export default tableFormatters;
