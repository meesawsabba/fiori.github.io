import { MessageType } from "sap/fe/core/formatters/TableFormatterTypes";

/**
 * criticality formatting
 *
 * @param {string|number} criticalityValue criticality value
 * @returns {object} The formatted criticality
 */

const criticalityFormat = function(criticalityValue: string | number): MessageType {
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
criticalityFormat.__functionName = "sap.fe.core.formatters.CriticalityFormatter#criticalityFormat";

// See https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters for more detail on this weird syntax
/**
 * Collection of table formatters.
 *
 * @param {object} this The context
 * @param {string} sName The inner function name
 * @param {object[]} oArgs The inner function parameters
 * @returns {object} The value from the inner function
 */
const criticalityFormatters = function(this: object, sName: string, ...oArgs: any[]): any {
	if (criticalityFormatters.hasOwnProperty(sName)) {
		return (criticalityFormatters as any)[sName].apply(this, oArgs);
	} else {
		return "";
	}
};

criticalityFormatters.criticalityFormat = criticalityFormat;

/**
 * @global
 */
export default criticalityFormatters;
