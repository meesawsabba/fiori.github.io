/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object", "sap/base/Log", "sap/ushell/services/AppConfiguration", "../utils/Constants", "../utils/Utils"],
	function(Object, Log, AppConfiguration, Constants, Utils) {
		"use strict";

		return Object.extend("sap.feedback.ui.flpplugin.data.AppContextData", {
			_dataV1: null,
			_dataV2: null,

			constructor: function() {},
			getData: function(iFormat) {
				return this._updateData().then(function() {
					if (iFormat === Constants.E_DATA_FORMAT.version1) {
						return this._dataV1;
					} else if (iFormat === Constants.E_DATA_FORMAT.version2) {
						return this._dataV2;
					}
					return null;
				}.bind(this));
			},
			_updateData: function() {
				this._resetData();
				return this._collectData().then(function(oContextData) {
					this._setData(oContextData);
				}.bind(this), function() {
					//Clear in case of rejection
					this._resetData();
				}.bind(this));
			},
			_resetData: function() {
				this._dataV1 = {
					ui5Version: Constants.S_DEFAULT_VALUE,
					ui5Theme: Constants.S_DEFAULT_VALUE,
					fioriId: Constants.S_DEFAULT_VALUE,
					appTitle: Constants.S_DEFAULT_VALUE,
					language: Constants.S_DEFAULT_VALUE,
					componentId: Constants.S_DEFAULT_VALUE,
					appVersion: Constants.S_DEFAULT_VALUE,
					ach: Constants.S_DEFAULT_VALUE
				};

				/*
                "appIntent",
                "productId",
                "productVersion"
				*/
				this._dataV2 = {
					appFrameworkId: Constants.S_DEFAULT_VALUE,
					appFrameworkVersion: Constants.S_DEFAULT_VALUE,
					theme: Constants.S_DEFAULT_VALUE,
					appId: Constants.S_DEFAULT_VALUE,
					appTitle: Constants.S_DEFAULT_VALUE,
					languageTag: Constants.S_DEFAULT_VALUE,
					technicalAppComponentId: Constants.S_DEFAULT_VALUE,
					appVersion: Constants.S_DEFAULT_VALUE,
					appSupportInfo: Constants.S_DEFAULT_VALUE
				};
			},
			_setData: function(oContextData) {
				this._dataV1 = {
					ui5Version: oContextData.appFrameworkVersion,
					ui5Theme: oContextData.theme,
					fioriId: oContextData.appId,
					appTitle: oContextData.appTitle,
					language: oContextData.languageTag,
					componentId: oContextData.technicalAppComponentId,
					appVersion: oContextData.appVersion,
					ach: oContextData.appSupportInfo
				};

				this._dataV2 = oContextData;
			},

			_getUserInfo: function() {
				return sap.ushell.Container.getService("UserInfo");
			},

			_getLanguage: function(oUserData) {
				if (oUserData) {
					var sValue = oUserData.getLanguage();
					//in some cases (e.g. local debugging 'en-US' is returned and survey logic does not work)
					if (sValue && sValue.length === 2) {
						return sValue.toUpperCase();
					}
				}
				return sap.ui.getCore().getConfiguration().getLocale().getLanguage().toUpperCase();
			},
			_collectData: function() {
				return new Promise(function(fnResolve, fnReject) {
					var oCurrentApp = Utils.getCurrentApp();
					if (Utils.isSupportedAppType(oCurrentApp)) {
						this._collectionAppInfoData(oCurrentApp).then(function(oInfo) {
							var oContextData = this._assignAppInfoData(oInfo);
							fnResolve(oContextData);
						}.bind(this));
					} else {
						Log.warning("App not of a supported app type.", null, Constants.S_PLUGIN_APPCONTEXTDATA_NAME);
						fnReject();
					}
				}.bind(this));
			},
			_collectionAppInfoData: function(oCurrentApp) {
				return new Promise(function(fnResolve, fnReject) {
					var aAppInfoParameters = [
						"appId",
						"appVersion",
						"appSupportInfo",
						"technicalAppComponentId",
						"appFrameworkId",
						"appFrameworkVersion"
					];

					oCurrentApp.getInfo(aAppInfoParameters).then(function(oInfo) {
						var oMetaData = AppConfiguration.getMetadata();

						if (oMetaData && oMetaData.title) {
							oInfo.appTitle = oMetaData.title;
						}
						if (oInfo.appId && oInfo.appId === Constants.S_LAUNCHPAD_VALUE) {
							oInfo.appTitle = Utils.stringToTitleCase(oInfo.appId);
						}
						fnResolve(oInfo);
					}).catch(function(error) {
						fnReject(error);
					});
				});
			},
			_assignAppInfoData: function(oInfo) {
				var oContextData = {};
				var oUserInfo = this._getUserInfo();
				if (oUserInfo) {
					var oUserData = oUserInfo.getUser();
					if (oUserData) {
						oContextData.languageTag = this._getLanguage(oUserData);
					}
				}
				oContextData.theme = sap.ui.getCore().getConfiguration().getTheme();

				if (oInfo) {
					oContextData.appFrameworkId = Utils.convertAppFrameworkTypeToId(oInfo["appFrameworkId"]) || Constants.S_DEFAULT_VALUE;
					oContextData.appFrameworkVersion = oInfo["appFrameworkVersion"] || Constants.S_DEFAULT_VALUE;
					oContextData.appId = oInfo["appId"] || Constants.S_DEFAULT_VALUE;
					oContextData.appTitle = oInfo["appTitle"] || Constants.S_DEFAULT_VALUE;
					oContextData.technicalAppComponentId = oInfo["technicalAppComponentId"] || Constants.S_DEFAULT_VALUE;
					oContextData.appVersion = oInfo["appVersion"] || Constants.S_DEFAULT_VALUE;
					oContextData.appSupportInfo = oInfo["appSupportInfo"] || Constants.S_DEFAULT_VALUE;
				}
				return oContextData;
			}
		});
	});