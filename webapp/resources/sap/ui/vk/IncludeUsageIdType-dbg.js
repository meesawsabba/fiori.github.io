sap.ui.define([
	"sap/ui/base/DataType"
], function(DataType) {
	"use strict";

	var IncludeUsageIdType = DataType.createType(
		"sap.ui.vk.IncludeUsageIdType",
		{
			isValid: function(value) {
				if (typeof value === "boolean") {
					return true;
				}

				if (typeof value === "string") {
					return value.trim().length > 0;
				}

				if (Array.isArray(value)) {
					return value.every(function(value) {
						return typeof value === "string" && value.trim().length > 0;
					});
				}

				return false;
			}
		},
		DataType.getType("any")
	);

	/**
	 * Transforms IncludeUsageIdType parameter into an array of usageId parameters for expand query
	 * @param {sap.ui.vk.IncludeUsageIdType} includeUsageId the includeUsageId content resource parameter
	 * @returns {string[]} The array of usageId parameters for expand query
	 * @private
	 */
	IncludeUsageIdType.to$expandQueryParameter = function(includeUsageId) {
		function toURI(usageId) {
			usageId = usageId.replaceAll("'", "''");
			return (usageId.indexOf(".") !== -1 || usageId.indexOf(",") !== -1) ? "'" + usageId + "'" : usageId;
		}

		if (Array.isArray(includeUsageId)) {
			return includeUsageId.map(function(usageId) { return "usageId." + toURI(usageId); });
		} else if (typeof includeUsageId === "string") {
			return ["usageId." + toURI(includeUsageId)];
		} else if (includeUsageId) {
			return ["usageId"];
		} else {
			return [];
		}
	};

	return IncludeUsageIdType;
}, /* bExport = */ true);
