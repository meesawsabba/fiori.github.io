/**
 * Collection of table formatters.
 *
 * @param {object} this The context
 * @param {string} sName The inner function name
 * @param {object[]} oArgs The inner function parameters
 * @returns {object} The value from the inner function
 */
const valueFormatters = function(this: object, sName: string, ...oArgs: any[]): any {
	if (valueFormatters.hasOwnProperty(sName)) {
		return (valueFormatters as any)[sName].apply(this, oArgs);
	} else {
		return "";
	}
};

const formatWithBrackets = (firstPart?: string, secondPart?: string): string => {
	if (firstPart && secondPart) {
		return sap.ui
			.getCore()
			.getLibraryResourceBundle("sap.fe.core")
			.getText("C_FORMAT_FOR_TEXT_ARRANGEMENT", [firstPart, secondPart]);
	} else {
		return firstPart || secondPart || "";
	}
};
formatWithBrackets.__functionName = "sap.fe.core.formatters.ValueFormatter#formatWithBrackets";

const formatWithPercentage = (sValue?: string): string => {
	return sValue !== null && sValue !== undefined ? sValue + " %" : "";
};
formatWithPercentage.__functionName = "sap.fe.core.formatters.ValueFormatter#formatWithPercentage";

const computePercentage = (value: string | number, target: string | number, sUnit?: string): string | undefined => {
	let sPercentString: string;
	const iValue: number = typeof value === "string" ? parseFloat(value) : value;
	const iTarget: number = typeof target === "string" ? parseFloat(target) : target;

	if (sUnit === "%") {
		if (iValue > 100) {
			sPercentString = "100";
		} else if (iValue < 0) {
			sPercentString = "0";
		} else {
			sPercentString = typeof value === "string" ? value : value?.toString();
		}
	} else if (iValue > iTarget) {
		sPercentString = "100";
	} else if (iValue < 0) {
		sPercentString = "0";
	} else {
		sPercentString = iValue && iTarget ? ((iValue / iTarget) * 100).toString() : "";
	}
	return sPercentString;
};
computePercentage.__functionName = "sap.fe.core.formatters.ValueFormatter#computePercentage";

export const formatCriticalityIcon = (val?: string | number): string | undefined => {
	let sIcon: string;
	if (val === "UI.CriticalityType/Negative" || val === "1" || val === 1) {
		sIcon = "sap-icon://message-error";
	} else if (val === "UI.CriticalityType/Critical" || val === "2" || val === 2) {
		sIcon = "sap-icon://message-warning";
	} else if (val === "UI.CriticalityType/Positive" || val === "3" || val === 3) {
		sIcon = "sap-icon://message-success";
	} else if (val === "UI.CriticalityType/Information" || val === "5" || val === 5) {
		sIcon = "sap-icon://message-information";
	} else {
		sIcon = "";
	}
	return sIcon;
};
formatCriticalityIcon.__functionName = "sap.fe.core.formatters.ValueFormatter#formatCriticalityIcon";

export const formatCriticalityValueState = (val?: string | number): string | undefined => {
	let sValueState: string;
	if (val === "UI.CriticalityType/Negative" || val === "1" || val === 1) {
		sValueState = "Error";
	} else if (val === "UI.CriticalityType/Critical" || val === "2" || val === 2) {
		sValueState = "Warning";
	} else if (val === "UI.CriticalityType/Positive" || val === "3" || val === 3) {
		sValueState = "Success";
	} else if (val === "UI.CriticalityType/Information" || val === "5" || val === 5) {
		sValueState = "Indication05";
	} else {
		sValueState = "None";
	}
	return sValueState;
};
formatCriticalityValueState.__functionName = "sap.fe.core.formatters.ValueFormatter#formatCriticalityValueState";

export const formatCriticalityButtonType = (val?: string | number): string | undefined => {
	let sType: string;
	if (val === "UI.CriticalityType/Negative" || val === "1" || val === 1) {
		sType = "Reject";
	} else if (val === "UI.CriticalityType/Positive" || val === "3" || val === 3) {
		sType = "Accept";
	} else {
		sType = "Default";
	}
	return sType;
};
formatCriticalityButtonType.__functionName = "sap.fe.core.formatters.ValueFormatter#formatCriticalityButtonType";

export const formatCriticalityColorMicroChart = (val?: string | number): string | undefined => {
	let sColor: string;
	if (val === "UI.CriticalityType/Negative" || val === "1" || val === 1) {
		sColor = "Error";
	} else if (val === "UI.CriticalityType/Critical" || val === "2" || val === 2) {
		sColor = "Critical";
	} else if (val === "UI.CriticalityType/Positive" || val === "3" || val === 3) {
		sColor = "Good";
	} else {
		sColor = "Neutral";
	}
	return sColor;
};
formatCriticalityColorMicroChart.__functionName = "sap.fe.core.formatters.ValueFormatter#formatCriticalityColorMicroChart";

valueFormatters.formatWithBrackets = formatWithBrackets;
valueFormatters.formatWithPercentage = formatWithPercentage;
valueFormatters.computePercentage = computePercentage;
valueFormatters.formatCriticalityIcon = formatCriticalityIcon;
valueFormatters.formatCriticalityValueState = formatCriticalityValueState;
valueFormatters.formatCriticalityButtonType = formatCriticalityButtonType;
valueFormatters.formatCriticalityColorMicroChart = formatCriticalityColorMicroChart;
/**
 * @global
 */
export default valueFormatters;
