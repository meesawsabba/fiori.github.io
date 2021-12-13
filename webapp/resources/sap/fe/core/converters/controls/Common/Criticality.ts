import { CriticalityType, EnumValue } from "@sap-ux/vocabularies-types";

import { MessageType } from "sap/fe/core/formatters/TableFormatterTypes";

/**
 * Gets a MessageType enum value from a CriticalityType enum value.
 *
 * @param {CriticalityType} criticalityEnum The CriticalityType enum value
 * @returns {MessageType} Returns the MessageType enum value
 */
export function getMessageTypeFromCriticalityType(criticalityEnum: EnumValue<CriticalityType>): MessageType {
	let messageType: MessageType;
	switch (criticalityEnum) {
		case "UI.CriticalityType/Negative":
		case "UI.CriticalityType/VeryNegative":
			messageType = MessageType.Error;
			break;
		case "UI.CriticalityType/Critical":
			messageType = MessageType.Warning;
			break;
		case "UI.CriticalityType/Positive":
		case "UI.CriticalityType/VeryPositive":
			messageType = MessageType.Success;
			break;
		case "UI.CriticalityType/Information":
			messageType = MessageType.Information;
			break;
		case "UI.CriticalityType/Neutral":
		default:
			messageType = MessageType.None;
	}
	return messageType;
}
