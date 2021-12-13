/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/mdc/field/MultiValueFieldDelegate", "sap/fe/core/CommonUtils"], function(MdcMultiValueFieldDelegate, CommonUtils) {
	"use strict";

	var MultiValueFieldDelegate = Object.assign({}, MdcMultiValueFieldDelegate);

	MultiValueFieldDelegate.updateItems = function(oPayload, aConditions, oControl) {
		var oListBinding = oControl.getBinding("items");
		if (oListBinding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
			var oBindingInfo = oControl.getBindingInfo("items");
			// check if conditions are added, removed or changed
			var oTemplate = oBindingInfo.template;
			var oKeyBindingInfo = oTemplate.getBindingInfo("key");
			var oDescriptionBindingInfo = oTemplate.getBindingInfo("description");
			var sKeyPath = oKeyBindingInfo && oKeyBindingInfo.parts[0].path;
			var sDescriptionPath =
				oDescriptionBindingInfo &&
				oDescriptionBindingInfo.parts &&
				oDescriptionBindingInfo.parts[0] &&
				oDescriptionBindingInfo.parts[0].path;
			var aContexts = oListBinding.getCurrentContexts();
			var i = 0;
			var aDataToAdd = [];
			var oController = CommonUtils.getTargetView(oControl).getController();

			// Contexts to delete
			var aNewKeys = aConditions.map(function(oCondition) {
				return oCondition.values[0];
			});
			var aOldKeys = aContexts.map(function(oContext) {
				return oContext.getProperty(sKeyPath);
			});
			var aModificationPromises = [];
			for (i = 0; i < aContexts.length; i++) {
				var oDeleteContext = aContexts[i];
				if (!aNewKeys.includes(oDeleteContext.getProperty(sKeyPath))) {
					aModificationPromises.push(oController._editFlow.deleteDocumentTransaction(oDeleteContext, { noDialog: true }));
				}
			}
			// data to add
			for (i = 0; i < aConditions.length; i++) {
				var oCondition = aConditions[i];
				if (!aOldKeys.includes(oCondition.values[0])) {
					var oItem = {};
					if (sKeyPath) {
						var iIndex = sKeyPath.indexOf("/");
						if (iIndex >= 0) {
							// we do not manage retrievng the key path via a 1:1
							var sPropertyPath = sKeyPath.substr(iIndex + 1);
							sKeyPath = sKeyPath.substr(0, iIndex);
							var oKey = {};
							oKey[sPropertyPath] = oCondition.values[0];
							oItem[sKeyPath] = oKey;
						} else {
							oItem[sKeyPath] = oCondition.values[0];
						}
					}
					if (sDescriptionPath && sDescriptionPath !== sKeyPath) {
						oItem[sDescriptionPath] = oCondition.values[1];
					}
					aDataToAdd.push(oItem);
				}
			}
			if (aDataToAdd.length) {
				aModificationPromises.push(oController._editFlow.createMultipleDocuments(oListBinding, aDataToAdd, true));
			}
			return Promise.all(aModificationPromises);
		}
	};

	return MultiValueFieldDelegate;
});
