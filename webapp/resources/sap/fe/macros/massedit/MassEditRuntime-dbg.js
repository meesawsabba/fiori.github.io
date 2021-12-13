/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[],
	function() {
		"use strict";

		/**
		 * Static class used by MDC Field during runtime
		 *
		 * @private
		 * @experimental This module is only for internal/experimental use!
		 */
		var MassEditRuntime = {
			handleMassEditChange: function(oEvent) {
				var oSource = oEvent && oEvent.getSource();
				var aParams = oSource && oSource.getSelectedKey() && oSource.getSelectedKey().split("/");
				var oDialog =
					oSource &&
					oSource
						.getParent()
						.getParent()
						.getParent()
						.getParent();
				var oFieldsInfoData = oDialog && oDialog.getModel("fieldsInfo").getData();
				var oDataObject;
				//TODO - Value Help Handling Load Value Help when respective value is selected in combo Box in dialog
				/*
				if (aParams[0] === "ValueHelp") {
				} */
				if (aParams[0] === "Default") {
					oDataObject = { keyValue: aParams[1], value: aParams[0] };
				} else if (aParams[0] === "ClearFieldValue") {
					oDataObject = { keyValue: aParams[1], value: "" };
				} else if (!aParams) {
					var sPropertyName = oSource.getId().substring(oSource.getId().lastIndexOf(":") + 1);
					oDataObject = {
						keyValue: sPropertyName,
						value: oSource.getValue()
					};
				} else {
					var aRelatedField =
						aParams[0] &&
						oFieldsInfoData.values &&
						oFieldsInfoData.values[aParams[0]].filter(function(oFieldData) {
							return oFieldData.text === oSource.getValue();
						});
					var iValueIndex = oFieldsInfoData.values[aParams[0]].findIndex(function(data) {
						return typeof data.text === "boolean" && data.text === Boolean(oSource.getValue());
					});
					oDataObject =
						aRelatedField && aRelatedField[0] && aRelatedField[0].textInfo
							? { keyValue: aParams[0], value: aRelatedField[0].textInfo.value }
							: {
									keyValue: aParams[0],
									value: iValueIndex ? oFieldsInfoData.values[aParams[0]][iValueIndex].text : oSource.getValue()
							  };
				}
				var bExistingElementindex = false;
				for (var i = 0; i < oFieldsInfoData.results.length; i++) {
					if (oFieldsInfoData.results[i].keyValue === oDataObject.keyValue) {
						bExistingElementindex = i;
					}
				}
				if (bExistingElementindex !== false) {
					oFieldsInfoData.results[bExistingElementindex] = oDataObject;
				} else {
					oFieldsInfoData.results.push(oDataObject);
				}
			}
		};

		return MassEditRuntime;
	},
	/* bExport= */ true
);
