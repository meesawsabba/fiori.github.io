/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
// ---------------------------------------------------------------------------------------
// Helper class used to help create content in the multi value field
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
/* eslint-disable no-console */
sap.ui.define(
	["sap/ui/mdc/field/MultiValueFieldDelegate"],
	function(MultiValueFieldDelegate) {
		"use strict";
		var oMultiValueFieldDelegate = Object.assign({}, MultiValueFieldDelegate, {
			_transformConditions: function(aConditions, sKeyPath, sDescriptionPath) {
				var aTransformedItems = [];
				for (var i = 0; i < aConditions.length; i++) {
					var oItem = {};
					var oCondition = aConditions[i];
					oItem[sKeyPath] = oCondition.values[0];
					if (sDescriptionPath) {
						oItem[sDescriptionPath] = oCondition.values[1];
					}
					aTransformedItems.push(oItem);
				}
				return aTransformedItems;
			},
			updateItems: function(oPayload, aConditions, oMultiValueField) {
				var oListBinding = oMultiValueField.getBinding("items");
				var oBindingInfo = oMultiValueField.getBindingInfo("items");
				var sItemPath = oBindingInfo.path;
				var oTemplate = oBindingInfo.template;
				var oKeyBindingInfo = oTemplate.getBindingInfo("key");
				var sKeyPath = oKeyBindingInfo && oKeyBindingInfo.parts[0].path;
				var oDescriptionBindingInfo = oTemplate.getBindingInfo("description");
				var sDescriptionPath = oDescriptionBindingInfo && oDescriptionBindingInfo.parts[0].path;
				var oModel = oListBinding.getModel();

				oModel.setProperty(sItemPath, this._transformConditions(aConditions, sKeyPath, sDescriptionPath));
			}
		});
		return oMultiValueFieldDelegate;
	},
	/* bExport= */ false
);
