/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

// ---------------------------------------------------------------------------------------
// Static class used by Share used during runtime
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define(
	[
		"sap/base/util/ObjectPath",
		"sap/base/util/extend",
		"sap/base/Log",
		"sap/ui/core/XMLTemplateProcessor",
		"sap/ui/core/util/XMLPreprocessor",
		"sap/ui/core/Fragment",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/mvc/ControllerExtension",
		"sap/ui/core/mvc/OverrideExecution",
		"sap/ui/core/routing/HashChanger",
		"sap/m/library"
	],
	function(
		ObjectPath,
		extend,
		Log,
		XMLTemplateProcessor,
		XMLPreprocessor,
		Fragment,
		JSONModel,
		ControllerExtension,
		OverrideExecution,
		HashChanger,
		library
	) {
		"use strict";

		/**
		 * @class A controller extension offering hooks into the Share functionalities of the application
		 *
		 * @name sap.fe.core.controllerextensions.Share
		 * @hideconstructor
		 * @public
		 * @since 1.93.0
		 */

		var oLastFocusedControl;

		var ShareUtils = ControllerExtension.extend("sap.fe.core.controllerextensions.Share", {
			metadata: {
				methods: {
					openShareSheet: { "public": true, "final": true },
					adaptShareMetadata: { "public": true, "final": false, overrideExecution: OverrideExecution.After }
				}
			},

			/**
			 * @private
			 * @name sap.fe.core.controllerextensions.Share.getMetadata
			 * @function
			 */
			/**
			 * @private
			 * @name sap.fe.core.controllerextensions.Share.extend
			 * @function
			 */

			/**
			 * Opens the share sheet.
			 *
			 * @function
			 * @param {object} oControl The control to which the ActionSheet is opened.
			 * @alias sap.fe.core.controllerextensions.Share#openShareSheet
			 * @public
			 * @since 1.93.0
			 */
			openShareSheet: function(oControl) {
				this._openShareSheetImpl(oControl);
			},
			/**
			 * Adapts the metadata used while sharing the page URL via 'Send Email', 'Share in SAP Jam', and 'Save as Tile'.
			 *
			 * @function
			 * @param {object} oShareMetadata Object containing the share metadata.
			 * @param {string} oShareMetadata.url Default URL that will be used via 'Send Email', 'Share in SAP Jam', and 'Save as Tile'
			 * @param {string} oShareMetadata.title Default title that will be used as 'email subject' in 'Send Email', 'share text' in 'Share in SAP Jam' and 'title' in 'Save as Tile'
			 * @param {object} [oShareMetadata.email] Email-specific metadata.
			 * @param {string} oShareMetadata.email.url URL that will be used specifically for 'Send Email'. This takes precedence over oShareMetadata.url.
			 * @param {string} oShareMetadata.email.title Title that will be used as "email subject" in 'Send Email'. This takes precedence over oShareMetadata.title.
			 * @param {object} [oShareMetadata.jam] SAP Jam-specific metadata.
			 * @param {string} oShareMetadata.jam.url URL that will be used specifically for 'Share in SAP Jam'. This takes precedence over oShareMetadata.url.
			 * @param {string} oShareMetadata.jam.title Title that will be used as 'share text' in 'Share in SAP Jam'. This takes precedence over oShareMetadata.title.
			 * @param {object} [oShareMetadata.tile] Save as Tile-specific metadata.
			 * @param {string} oShareMetadata.tile.url URL that will be used specifically for 'Save as Tile'. This takes precedence over oShareMetadata.url.
			 * @param {string} oShareMetadata.tile.title Title to be used for the tile. This takes precedence over oShareMetadata.title.
			 * @param {string} oShareMetadata.tile.subtitle Subtitle to be used for the tile.
			 * @param {string} oShareMetadata.tile.icon Icon to be used for the tile.
			 * @param {string} oShareMetadata.tile.queryUrl Query URL of an OData service from which data for a dynamic tile is read.
			 * @returns {object | Promise<object>} Share Metadata or a Promise resolving the Share Metadata
			 * @alias sap.fe.core.controllerextensions.Share#adaptShareMetadata
			 * @public
			 * @since 1.93.0
			 */
			adaptShareMetadata: function(oShareMetadata) {
				return oShareMetadata;
			},
			_openShareSheetImpl: function(by) {
				var that = this,
					oShareActionSheet,
					fragmentController,
					sHash = HashChanger.getInstance().getHash(),
					sBasePath = HashChanger.getInstance().hrefForAppSpecificHash
						? HashChanger.getInstance().hrefForAppSpecificHash("")
						: "",
					oShareMetadata = {
						url: sHash ? sBasePath + sHash : window.location.hash,
						title: document.title,
						email: {
							url: "",
							title: ""
						},
						jam: {
							url: "",
							title: ""
						},
						tile: {
							url: "",
							title: "",
							subtitle: "",
							icon: "",
							queryUrl: ""
						}
					};
				oLastFocusedControl = by;
				return Promise.resolve(that.adaptShareMetadata(oShareMetadata))
					.then(function(oModelData) {
						fragmentController = {
							shareEmailPressed: function() {
								var oResource = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");
								var sEmailSubject = oModelData.email.title
									? oModelData.email.title
									: oResource.getText("T_SHARE_UTIL_HELPER_SAPFE_EMAIL_SUBJECT", [oModelData.title]);
								library.URLHelper.triggerEmail(
									null,
									sEmailSubject,
									window.location.origin +
										window.location.pathname +
										(oModelData.email.url ? oModelData.email.url : oModelData.url)
								);
							},
							onSaveTilePress: function() {
								// TODO it seems that the press event is executed before the dialog is available - adding a timeout is a cheap workaround
								setTimeout(function() {
									sap.ui
										.getCore()
										.byId("bookmarkDialog")
										.attachAfterClose(function() {
											oLastFocusedControl.focus();
										});
								}, 0);
							},
							shareJamPressed: function() {
								that._doOpenJamShareDialog(
									oModelData.jam.title ? oModelData.jam.title : oModelData.title,
									oModelData.jam.url
										? oModelData.jam.url
										: window.location.origin + window.location.pathname + oModelData.url
								);
							}
						};

						fragmentController.onCancelPressed = function() {
							oShareActionSheet.close();
						};

						fragmentController.setShareSheet = function(oShareSheet) {
							by.shareSheet = oShareSheet;
						};

						var oThis = new JSONModel({}),
							oPreprocessorSettings = {
								bindingContexts: {
									"this": oThis.createBindingContext("/")
								},
								models: {
									"this": oThis
								}
							};
						var oTileData = {
							title: oModelData.tile.title ? oModelData.tile.title : oModelData.title,
							subtitle: oModelData.tile.subtitle,
							icon: oModelData.tile.icon,
							url: oModelData.tile.url ? oModelData.tile.url : oModelData.url,
							queryUrl: oModelData.tile.queryUrl
						};
						if (by.shareSheet) {
							oShareActionSheet = by.shareSheet;
							var oShareModel = oShareActionSheet.getModel("share");
							that._setStaticShareData(oShareModel);
							var oNewData = extend(oShareModel.getData(), oTileData);
							oShareModel.setData(oNewData);
							oShareActionSheet.openBy(by);
						} else {
							var sFragmentName = "sap.fe.macros.share.ShareSheet",
								oPopoverFragment = XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment");

							Promise.resolve(XMLPreprocessor.process(oPopoverFragment, { name: sFragmentName }, oPreprocessorSettings))
								.then(function(oFragment) {
									return Fragment.load({ definition: oFragment, controller: fragmentController });
								})
								.then(function(oActionSheet) {
									oShareActionSheet = oActionSheet;
									oShareActionSheet.setModel(new JSONModel(oTileData || {}), "share");
									var oShareModel = oShareActionSheet.getModel("share");
									that._setStaticShareData(oShareModel);
									var oNewData = extend(oShareModel.getData(), oTileData);
									oShareModel.setData(oNewData);
									by.addDependent(oShareActionSheet);
									oShareActionSheet.openBy(by);
									fragmentController.setShareSheet(oShareActionSheet);
								})
								.catch(function(oError) {
									Log.error("Error while opening the share fragment", oError);
								});
						}
					})
					.catch(function(oError) {
						Log.error("Error while fetching the share model data", oError);
					});
			},
			_setStaticShareData: function(shareModel) {
				var oResource = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");
				shareModel.setProperty("/jamButtonText", oResource.getText("T_COMMON_SAPFE_SHARE_JAM"));
				shareModel.setProperty("/emailButtonText", oResource.getText("T_SEMANTIC_CONTROL_SEND_EMAIL"));
				var fnGetUser = ObjectPath.get("sap.ushell.Container.getUser");
				shareModel.setProperty("/jamVisible", !!fnGetUser && fnGetUser().isJamActive());
				shareModel.setProperty("/saveAsTileVisible", !!(sap && sap.ushell && sap.ushell.Container));
			},
			//the actual opening of the JAM share dialog
			_doOpenJamShareDialog: function(text, sUrl) {
				var oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: sUrl,
							share: text
						}
					}
				});
				oShareDialog.open();
			}
		});

		return ShareUtils;
	}
);
