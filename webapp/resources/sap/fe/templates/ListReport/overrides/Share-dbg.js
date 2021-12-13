/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	["sap/fe/core/helpers/SemanticDateOperators", "sap/ui/core/routing/HashChanger", "sap/fe/core/CommonUtils", "sap/base/Log"],
	function(SemanticDateOperators, HashChanger, CommonUtils, Log) {
		"use strict";

		/**
		 * Get count url URL for the entity bound to the LR table(s).
		 * @param {object} oController The Controller instance
		 * @returns {string} The service URL with /$count
		 */
		function getCountUrl(oController) {
			var sTableId = oController
				.getView()
				.getContent()[0]
				.data().singleTableId;
			if (!sTableId) {
				// if single table id is not there then get the selected table id from multiple tabs
				sTableId = oController
					.getView()
					.byId("fe::TabMultipleMode")
					.getSelectedKey();
			}
			var oTable = oController.getView().byId(sTableId);
			if (!oTable) {
				return "";
			}
			var oBinding = oTable.getRowBinding() || oTable.getBinding("items");
			var sDownloadUrl = (oBinding && oBinding.getDownloadUrl()) || "";
			var aSplitUrl = sDownloadUrl.split("?");
			var baseUrl = aSplitUrl[0] + "/$count?";
			// getDownloadUrl() returns url with $select, $expand which is not supported when /$count is used to get the record count. only $apply, $search, $filter is supported
			// ?$count=true returns count in a format which is not supported by FLP yet.
			// currently supported format for v4 is ../count.. only (where tile preview will still not work)
			var aSupportedParams = [];
			if (aSplitUrl.length > 1) {
				var urlParams = aSplitUrl[1];
				urlParams.split("&").forEach(function(urlParam) {
					var aUrlParamParts = urlParam.split("=");
					switch (aUrlParamParts[0]) {
						case "$apply":
						case "$search":
						case "$filter":
							aSupportedParams.push(urlParam);
					}
				});
			}
			return baseUrl + aSupportedParams.join("&");
		}

		function getShareUrl() {
			var sShareUrl;
			var sHash = HashChanger.getInstance().getHash();
			var sBasePath = HashChanger.getInstance().hrefForAppSpecificHash ? HashChanger.getInstance().hrefForAppSpecificHash("") : "";
			sShareUrl = sHash ? sBasePath + sHash : window.location.hash;
			return sShareUrl;
		}

		function getSaveAsTileServiceUrl(oController) {
			var oFilterBar = oController.getView().byId(
				oController
					.getView()
					.getContent()[0]
					.data("filterBarId")
			);
			var oConditions = oFilterBar.getFilterConditions();
			var bsaveAsTileServiceUrlAllowed = SemanticDateOperators.hasSemanticDateOperations(oConditions);
			if (bsaveAsTileServiceUrlAllowed) {
				return getCountUrl(oController);
			} else {
				return "";
			}
		}

		function getJamUrl() {
			var sJamUrl;
			var sHash = HashChanger.getInstance().getHash();
			var sBasePath = HashChanger.getInstance().hrefForAppSpecificHash ? HashChanger.getInstance().hrefForAppSpecificHash("") : "";
			sJamUrl = sHash ? sBasePath + sHash : window.location.hash;
			// in case we are in cFLP scenario, the application is running
			// inside an iframe, and there for we need to get the cFLP URL
			// and not 'document.URL' that represents the iframe URL
			if (sap.ushell && sap.ushell.Container && sap.ushell.Container.runningInIframe && sap.ushell.Container.runningInIframe()) {
				sap.ushell.Container.getFLPUrl(true)
					.then(function(sUrl) {
						return sUrl.substr(0, sUrl.indexOf("#")) + sJamUrl;
					})
					.catch(function(sError) {
						Log.error("Could not retrieve cFLP URL for the sharing dialog (dialog will not be opened)", sError);
					});
			} else {
				return window.location.origin + window.location.pathname + sJamUrl;
			}
		}

		return {
			adaptShareMetadata: function(oShareMetadata) {
				var that = this;
				return Promise.resolve(getJamUrl()).then(function(sJamUrl) {
					var oAppComponent = CommonUtils.getAppComponent(that.base.getView());
					var oMetadata = oAppComponent.getMetadata();
					var oUIManifest = oMetadata.getManifestEntry("sap.ui");
					var sIcon = (oUIManifest && oUIManifest.icons && oUIManifest.icons.icon) || "";
					var oAppManifest = oMetadata.getManifestEntry("sap.app");
					var sTitle = (oAppManifest && oAppManifest.title) || "";
					// TODO: check if there is any semantic date used before adding serviceURL as BLI:FIORITECHP1-18023
					oShareMetadata.tile = {
						icon: sIcon,
						title: sTitle,
						queryUrl: getSaveAsTileServiceUrl(that.base)
					};
					oShareMetadata.title = document.title;
					oShareMetadata.url = getShareUrl();
					oShareMetadata.jam.url = sJamUrl;
					return oShareMetadata;
				});
			}
		};
	}
);
