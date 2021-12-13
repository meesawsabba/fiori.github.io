/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	["sap/ui/model/resource/ResourceModel"],
	function(ResourceModel) {
		"use strict";
		var oResourceModel = new ResourceModel({ bundleName: "sap.fe.macros.messagebundle", async: true }),
			oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.macros"),
			oApplicationResourceBundle;

		return {
			/**
			 * Returns the resource model for the library.
			 *
			 * @private
			 * @returns {sap.ui.model.resource.ResourceModel} The resource model for this library
			 */
			getModel: function() {
				return oResourceModel;
			},
			/**
			 * Returns a text from the resource bundle of this library.
			 *
			 * @param {string} sText Text
			 * @param {Array} aParameter Parameter
			 * @param {string} sEntitySetName Entity set name
			 * @returns {*|string} Text from resource bundle
			 */
			getText: function(sText, aParameter, sEntitySetName) {
				var sResourceKey = sText;
				var sBundleText;
				if (oApplicationResourceBundle) {
					if (sEntitySetName) {
						//Create resource key appended with the entity set name
						sResourceKey = sText + "|" + sEntitySetName;
					}
					sBundleText = oApplicationResourceBundle.getText(sResourceKey, aParameter, true);
					return sBundleText ? sBundleText : oResourceBundle.getText(sText, aParameter);
				}
				return oResourceBundle.getText(sText, aParameter);
			},
			/**
			 * Sets the resource bundle of the application.
			 *
			 * @param {object} oApplicationi18nBundle Resource bundle of the application
			 */
			setApplicationI18nBundle: function(oApplicationi18nBundle) {
				oApplicationResourceBundle = oApplicationi18nBundle;
			}
		};
	},
	true
);
