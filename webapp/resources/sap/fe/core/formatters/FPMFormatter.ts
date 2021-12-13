import { Context } from "sap/ui/model";
import { ManagedObject } from "sap/ui/base";
import { View } from "sap/ui/core/mvc";
import { ODataModel } from "sap/ui/model/odata/v4";

const customIsEnabledCheck = function(
	this: ManagedObject,
	oView: View,
	modulePath: string,
	aSelectedContexts: Context<ODataModel>[]
): Promise<void> {
	const oExtensionAPI = (oView.getController() as any).getExtensionAPI();
	const parts = modulePath.split(".");
	const methodName = parts.pop() as string;
	const moduleName = parts.join("/");

	return new Promise(resolve => {
		sap.ui.require([moduleName], (module: any) => {
			resolve(module[methodName].bind(oExtensionAPI)(this.getBindingContext(), aSelectedContexts || []));
		});
	});
};
customIsEnabledCheck.__functionName = "sap.fe.core.formatters.FPMFormatter#customIsEnabledCheck";

/**
 * Collection of table formatters.
 *
 * @param {object} this The context
 * @param {string} sName The inner function name
 * @param {object[]} oArgs The inner function parameters
 * @returns {object} The value from the inner function
 */
const fpmFormatter = function(this: object, sName: string, ...oArgs: any[]): any {
	if (fpmFormatter.hasOwnProperty(sName)) {
		return (fpmFormatter as any)[sName].apply(this, oArgs);
	} else {
		return "";
	}
};

fpmFormatter.customIsEnabledCheck = customIsEnabledCheck;

/**
 * @global
 */
export default fpmFormatter;
