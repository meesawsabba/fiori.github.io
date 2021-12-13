sap.ui.define(["sap/base/util/ObjectPath", "sap/base/util/extend", 	"sap/suite/ui/generic/template/genericUtilities/FeLogger"
], function(ObjectPath,extend,FeLogger) {
	"use strict";

	var ShareUtils = {};
	
	// function that returns a Promise that resolves to the current url
	function getCurrentUrl(){
		var oUShellContainer = sap.ushell && sap.ushell.Container;
		return oUShellContainer ? new Promise(function(fnResolve){
			oUShellContainer.getFLPUrlAsync(true).done(function (sFLPUrl){
				fnResolve(sFLPUrl);
			}); 
		}) : Promise.resolve(document.URL);
	}
	
	ShareUtils.getCurrentUrl = getCurrentUrl;

	/**
	 * Pre-populates the given shareModel with localized texts so that they can be used in the ShareSheet fragment.
	 *
	 * @param {sap.ui.core.Control} fragment The fragment instance whose model is to be updated
	 * @param {sap.ui.model.json.JSONModel} shareModel The model instance to be updated
	 * @protected
	 * @static
	 */
	ShareUtils.setStaticShareData = function(fragment, shareModel) {
		var oResource = sap.ui.getCore().getLibraryResourceBundle("sap.m");

		shareModel.setProperty("/emailButtonText", oResource.getText("SEMANTIC_CONTROL_SEND_EMAIL"));
		shareModel.setProperty("/jamButtonText", oResource.getText("SEMANTIC_CONTROL_SHARE_IN_JAM"));

		var fnGetUser = ObjectPath.get("sap.ushell.Container.getUser");
		shareModel.setProperty("/jamVisible", !!fnGetUser && fnGetUser().isJamActive());
	};

	/**
	 * Opens a Sharing Dialog.
	 *
	 * @param {string} text The text of the sharing dialog
	 * @protected
	 * @static
	 */
	ShareUtils.openJamShareDialog = function(text) {
		getCurrentUrl().then(function(sCurrentUrl){
			var oShareDialog = sap.ui.getCore().createComponent({
				name: "sap.collaboration.components.fiori.sharing.dialog",
				settings: {
					object: {
						id: sCurrentUrl,
						share: text
					}
				}
			});
			oShareDialog.open();
		});
	};

	/**
	 * Instantiates and opens the ShareSheet fragment and merges its model data with the SaveAsTile data
	 * returned by the function getModelData of the fragment controller.
	 *
	 * @param {sap.suite.ui.template.lib.CommonUtils} commonUtils The common utils instance providing common functionality
	 * @param {sap.ui.core.Control} by The control by which the popup is to be opened
	 * @param {object} fragmentController A plain object serving as the share popup's controller
	 * @returns {sap.ui.core.Control} The new instance of the ShareSheet fragment
	 * @protected
	 * @static
	 */
	ShareUtils.openSharePopup = function(commonUtils, by, fragmentController) {
		var oShareActionSheet;
		fragmentController.onCancelPressed = function() {
			oShareActionSheet.close();
		};

		return new Promise(function (fnResolve) {

			commonUtils.getDialogFragmentAsync("sap.suite.ui.generic.template.fragments.ShareSheet", fragmentController, "share", ShareUtils.setStaticShareData)
			.then(function (oFragment) {
				oShareActionSheet = oFragment;
				var oShareModel = oShareActionSheet.getModel("share");
				var oFragmentModel = fragmentController.getModelData();
				oFragmentModel.then(function(oModelData) {
					var oNewData = extend(oShareModel.getData(), oModelData);
					oNewData.serviceUrl = oModelData && oModelData.serviceUrl;
					oShareModel.setData(oNewData);
					oShareActionSheet.openBy(by);
					fnResolve(oShareActionSheet);
				});
			});
		});
	};

	/**
	 * Get custom URL for creating a new tile.
	 *
	 * @returns {string} The custom URL
	 * @protected
	 * @static
	 */
	ShareUtils.getCustomUrl = function() {
		if (!window.hasher) {
			sap.ui.require("sap/ui/thirdparty/hasher");
		}

		var sHash = window.hasher.getHash();
		return sHash ? ("#" + sHash) : window.location.href;
	};

	return ShareUtils;
});
