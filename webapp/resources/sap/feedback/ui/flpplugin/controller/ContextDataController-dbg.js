/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object", "sap/base/util/extend", "../utils/Constants",
		"../data/AppContextData",
		"../data/PushContextData"
	],
	function(Object, extend, Constants, AppContextData, PushContextData) {
		"use strict";

		return Object.extend("sap.feedback.ui.flpplugin.controller.ContextDataController", {
			_oConfig: {},
			_oAppContextData: null,
			_oSessionData: null,
			_sClientAction: null,
			_sLastTheme: null,
			_iFollowUpCount: null,
			constructor: function(oConfig) {
				this._oConfig = oConfig;
			},
			init: function() {
				if (this._oConfig) {
					this._oAppContextData = new AppContextData();
					this._collectSessionContextData(this._oConfig.getTenantId(), this._oConfig.getTenantRole(), this._oConfig.getProductName(), this._oConfig.getPlatformType());
				} else {
					this._resetContextData();
				}
			},
			updateContextData: function(sClientAction, oPushEventData) {
				this._resetContextData();
				this.setClientAction(sClientAction);
				var iDataFormat = this._oConfig.getDataFormat();
				this._setSessionContextData(iDataFormat);

				if (this._sClientAction === Constants.E_CLIENT_ACTION.backendPush ||
					this._sClientAction === Constants.E_CLIENT_ACTION.inAppFeedback) {
					this._setPushContextData(oPushEventData.contextData);
				}
				return this._collectAppContextData(iDataFormat);
			},
			setClientAction: function(sClientAction) {
				this._sClientAction = sClientAction;
				this._updateClientAction();
			},
			setLastTheme: function(sLastTheme) {
				this._sLastTheme = sLastTheme;
				this._updateLastTheme();
			},
			setFollowUpCount: function(iFollowUpCount) {
				this._iFollowUpCount = iFollowUpCount;
				this._updateFollowUpCount();
			},
			getContextDataAsUrlParameter: function() {
				var sSurveyUrl = "";

				if (this._oConfig.getDataFormat() === Constants.E_DATA_FORMAT.version1) {
					sSurveyUrl += "?Q_Language=" + encodeURIComponent(sap.qtxAppContext.language);
					sSurveyUrl += "&language=" + encodeURIComponent(sap.qtxAppContext.language);
					sSurveyUrl += "&ui5Version=" + encodeURIComponent(sap.qtxAppContext.ui5Version);
					sSurveyUrl += "&ui5Theme=" + encodeURIComponent(sap.qtxAppContext.ui5Theme);
					sSurveyUrl += "&fioriId=" + encodeURIComponent(sap.qtxAppContext.fioriId);
					sSurveyUrl += "&appVersion=" + encodeURIComponent(sap.qtxAppContext.appVersion);
					sSurveyUrl += "&componentId=" + encodeURIComponent(sap.qtxAppContext.componentId);
					sSurveyUrl += "&appTitle=" + encodeURIComponent(sap.qtxAppContext.appTitle);
					sSurveyUrl += "&ach=" + encodeURIComponent(sap.qtxAppContext.ach);
					sSurveyUrl += "&tenantId=" + encodeURIComponent(sap.qtxAppContext.tenantId);
					sSurveyUrl += "&tenantRole=" + encodeURIComponent(sap.qtxAppContext.tenantRole);
				} else if (this._oConfig.getDataFormat() === Constants.E_DATA_FORMAT.version2) {
					sSurveyUrl += "?Q_Language=" + encodeURIComponent(sap.qtx.appcontext.languageTag);
					sSurveyUrl += "&language=" + encodeURIComponent(sap.qtx.appcontext.languageTag);
					sSurveyUrl += "&appFrameworkId=" + encodeURIComponent(sap.qtx.appcontext.appFrameworkId);
					sSurveyUrl += "&appFrameworkVersion=" + encodeURIComponent(sap.qtx.appcontext.appFrameworkVersion);
					sSurveyUrl += "&theme=" + encodeURIComponent(sap.qtx.appcontext.theme);
					sSurveyUrl += "&appId=" + encodeURIComponent(sap.qtx.appcontext.appId);
					sSurveyUrl += "&appVersion=" + encodeURIComponent(sap.qtx.appcontext.appVersion);
					sSurveyUrl += "&technicalAppComponentId=" + encodeURIComponent(sap.qtx.appcontext.technicalAppComponentId);
					sSurveyUrl += "&appTitle=" + encodeURIComponent(sap.qtx.appcontext.appTitle);
					sSurveyUrl += "&appSupportInfo=" + encodeURIComponent(sap.qtx.appcontext.appSupportInfo);
					sSurveyUrl += "&previousTheme=" + encodeURIComponent(this._sLastTheme);
					sSurveyUrl += "&clientAction=" + encodeURIComponent(this._sClientAction);
					sSurveyUrl += "&followUpCount=" + encodeURIComponent(this._iFollowUpCount);
					if (sap.qtx.session) {
						sSurveyUrl += "&tenantId=" + encodeURIComponent(sap.qtx.session.tenantId);
						sSurveyUrl += "&tenantRole=" + encodeURIComponent(sap.qtx.session.tenantRole);
						sSurveyUrl += "&productName=" + encodeURIComponent(sap.qtx.session.productName);
						sSurveyUrl += "&platformType=" + encodeURIComponent(sap.qtx.session.platformType);
					}
					if (sap.qtx.push) {
						sSurveyUrl += "&pushSrcType=" + encodeURIComponent(sap.qtx.push.srcType);
						sSurveyUrl += "&pushSrcAppId=" + encodeURIComponent(sap.qtx.push.srcAppId);
						sSurveyUrl += "&pushSrcTrigger=" + encodeURIComponent(sap.qtx.push.srcAppTrigger);
					}
				}

				return sSurveyUrl;
			},
			_setPushContextData: function(oPushData) {
				if (!sap.qtx) {
					sap.qtx = {};
				}
				sap.qtx.push = {};
				sap.qtx.push.srcType = oPushData.getSourceType();
				sap.qtx.push.srcAppId = oPushData.getSourceAppId();
				sap.qtx.push.srcAppTrigger = oPushData.getSourceAppTrigger();
			},
			_collectSessionContextData: function(sTenantId, sRole, sProductName, sPlatformType) {
				this._oSessionData = {
					tenantId: sTenantId,
					tenantRole: sRole,
					productName: sProductName,
					platformType: sPlatformType
				};
			},
			_setSessionContextData: function(iDataFormat) {
				if (iDataFormat === Constants.E_DATA_FORMAT.version1) {
					if (!sap.qtxAppContext) {
						sap.qtxAppContext = {};
					}
					sap.qtxAppContext = extend(sap.qtxAppContext, this._oSessionData);

				} else if (iDataFormat === Constants.E_DATA_FORMAT.version2) {
					if (!sap.qtx) {
						sap.qtx = {};
					}
					sap.qtx.session = this._oSessionData;
				}
			},
			_resetContextData: function() {
				sap.qtxAppContext = {};
				if (!sap.qtx) {
					sap.qtx = {};
				}
				sap.qtx.appcontext = {};
				sap.qtx.push = {};
			},

			_collectAppContextData: function(iDataFormat) {
				return this._oAppContextData.getData(iDataFormat).then(function(oContextData) {
					this._setAppContextData(oContextData, iDataFormat);
				}.bind(this));
			},
			_setAppContextData: function(oContextData, iDataFormat) {
				//Version 1 deprecated
				if (iDataFormat === Constants.E_DATA_FORMAT.version1) {
					sap.qtxAppContext = extend(sap.qtxAppContext, oContextData);
				} else if (iDataFormat === Constants.E_DATA_FORMAT.version2) {
					sap.qtx.appcontext = oContextData;
					this._updateClientAction();
				}
			},
			_ensureExistenceOfAppContextOnGlobalQtx: function() {
				if (!sap.qtx) {
					sap.qtx = {};
				}
				if (!sap.qtx.appcontext) {
					sap.qtx.appcontext = {};
				}
			},
			_updateClientAction: function() {
				this._ensureExistenceOfAppContextOnGlobalQtx();
				sap.qtx.appcontext.clientAction = this._sClientAction;
			},
			_updateLastTheme: function() {
				this._ensureExistenceOfAppContextOnGlobalQtx();
				sap.qtx.appcontext.previousTheme = this._sLastTheme;
			},
			_updateFollowUpCount: function() {
				this._ensureExistenceOfAppContextOnGlobalQtx();
				sap.qtx.appcontext.followUpCount = this._iFollowUpCount;
			}
		});
	});