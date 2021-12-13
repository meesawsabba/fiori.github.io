/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/core/ExtensionAPI", "sap/fe/core/CommonUtils", "sap/fe/core/converters/helpers/ID"], function(
	ExtensionAPI,
	CommonUtils,
	ID
) {
	"use strict";

	/**
	 * @class Extension API for object pages on SAP Fiori elements for OData V4.
	 * @alias sap.fe.templates.ObjectPage.ExtensionAPI
	 * @extends sap.fe.core.ExtensionAPI
	 * @public
	 * @hideconstructor
	 * @final
	 * @since 1.79.0
	 */
	var extensionAPI = ExtensionAPI.extend("sap.fe.templates.ObjectPage.ExtensionAPI", {
		/**
		 * @private
		 * @name sap.fe.templates.ObjectPage.ExtensionAPI.getMetadata
		 * @function
		 */
		/**
		 * @private
		 * @name sap.fe.templates.ObjectPage.ExtensionAPI.extend
		 * @function
		 */

		/**
		 * Refreshes either the whole object page or only parts of it.
		 *
		 * @alias sap.fe.templates.ObjectPage.ExtensionAPI#refresh
		 * @param {string | string[]} [vPath] Path or array of paths referring to entities or properties to be refreshed.
		 * If omitted, the whole object page is refreshed. The path "" refreshes the entity assigned to the object page
		 * without navigations
		 * @returns {Promise} Resolved once the data is refreshed or rejected if the request failed
		 *
		 * @public
		 */
		refresh: function(vPath) {
			var oBindingContext = this._view.getBindingContext(),
				oAppComponent = CommonUtils.getAppComponent(this._view),
				oSideEffectsService = oAppComponent.getSideEffectsService(),
				oMetaModel = oBindingContext.getModel().getMetaModel(),
				aPaths,
				oSideEffects = {
					TargetProperties: [],
					TargetEntities: []
				},
				sPath,
				sBaseEntitySet,
				sKind;

			if (vPath === undefined || vPath === null) {
				// we just add an empty path which should refresh the page with all dependent bindings
				oSideEffects.TargetEntities.push({
					$NavigationPropertyPath: ""
				});
			} else {
				aPaths = Array.isArray(vPath) ? vPath : [vPath];
				sBaseEntitySet = this._controller.getOwnerComponent().getEntitySet();

				for (var i = 0; i < aPaths.length; i++) {
					sPath = aPaths[i];
					if (sPath === "") {
						// an empty path shall refresh the entity without dependencies which means * for the model
						oSideEffects.TargetProperties.push({
							$PropertyPath: "*"
						});
					} else {
						sKind = oMetaModel.getObject("/" + sBaseEntitySet + "/" + sPath + "/$kind");

						if (sKind === "NavigationProperty") {
							oSideEffects.TargetEntities.push({
								$NavigationPropertyPath: sPath
							});
						} else if (sKind) {
							oSideEffects.TargetProperties.push({
								$PropertyPath: sPath
							});
						} else {
							return Promise.reject(sPath + " is not a valid path to be refreshed");
						}
					}
				}
			}
			return oSideEffectsService.requestSideEffects(
				oSideEffects.TargetEntities.concat(oSideEffects.TargetProperties),
				oBindingContext
			);
		},

		/**
		 * Gets the list entries currently selected for the table.
		 *
		 * @alias sap.fe.templates.ObjectPage.ExtensionAPI#getSelectedContexts
		 * @param {string} sTableId The ID identifying the table the selected context is requested for
		 * @returns {sap.ui.model.odata.v4.Context[]} Array containing the selected contexts
		 *
		 * @public
		 */
		getSelectedContexts: function(sTableId) {
			var oTable = this._view.byId(sTableId);
			return (oTable && oTable.isA("sap.ui.mdc.Table") && oTable.getSelectedContexts()) || [];
		},

		/**
		 * Displays or hides the side content of an object page block.
		 *
		 * @alias sap.fe.templates.ObjectPage.ExtensionAPI#showSideContent
		 * @param {string} sSubSectionKey Key of the side content fragment as defined in the manifest.json
		 * @param {boolean} [bShow] Optional Boolean flag to show or hide the side content
		 *
		 * @public
		 */
		showSideContent: function(sSubSectionKey, bShow) {
			var sBlockID = ID.SideContentLayoutID(sSubSectionKey),
				oBlock = this._view.byId(sBlockID),
				bBlockState = bShow === undefined ? !oBlock.getShowSideContent() : bShow;
			oBlock.setShowSideContent(bBlockState);
		}
	});

	return extensionAPI;
});
