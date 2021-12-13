/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object", "sap/base/Log", "../utils/Constants", "../utils/Utils", "./ContextDataController", "./PushClient",
		"../ui/ShellBarButton",
		"../ui/PopOverVisual", "../ui/IFrameVisual", "./WebAppFeedbackLoader", "../trigger/ThemeUsageTrigger", "../utils/Storage"
	],
	function(Object, Log, Constants, Utils, ContextDataController, PushClient, ShellBarButton, PopOverVisual, IFrameVisual,
		WebAppFeedbackLoader, ThemeUsageTrigger, Storage) {
		"use strict";
		/* global QSI, sap */


		return Object.extend("sap.feedback.ui.flpplugin.controller.PluginController", {
			_oConfig: null,
			_oContextDataController: null,
			_oPushClient: null,
			_oShellButton: null,
			_oWebAppFeedbackLoader: null,
			_fnRendererPromise: null,
			_oResourceBundle: null,
			_oThemeUsageTrigger: null,
			_oLocalStorage: null,
			_sLastThemeId: null,
			_sCurrentThemeId: null,

			constructor: function(oConfig, fnRendererPromise, oResourceBundle) {
				this._oConfig = oConfig;
				this._fnRendererPromise = fnRendererPromise;
				this._oResourceBundle = oResourceBundle;
			},
			init: function() {

				this._initStorage();
				this._initLastTheme();
				return new Promise(function(resolve, reject) {
					if (this._oConfig) {
						this._initContextData();
						this._initPushChannel();
						this._initUI();
						this._initWebAppFeedback();
						this._updateInitialContextData().then(function() {
							resolve();
						}).catch(function(oError) {
							Log.error("Fiori Feedback Plug-in error occured on updating context data on init.", null, Constants.S_PLUGIN_PLGCTRL_NAME);
							resolve();
						});
					} else {
						reject();
					}
				}.bind(this));
			},
			_initStorage: function() {
				if (Utils.isLocalStorageAvailable()) {
					this._oLocalStorage = new Storage();
					this._oLocalStorage.init();
				}
			},
			_initLastTheme: function() {
				this._sCurrentThemeId = sap.ui.getCore().getConfiguration().getTheme();
				if (this._oLocalStorage) {
					var sSavedLastThemeId = this._oLocalStorage.getLastTheme();
					if (!sSavedLastThemeId) { // No last theme persisted, do it now with current one.
						this._oLocalStorage.updateLastTheme(this._sCurrentThemeId);
						this._sLastThemeId = this._sCurrentThemeId;
					} else {
						this._sLastThemeId = sSavedLastThemeId; //just restore whats persisted
					}
				}
			},
			_initContextData: function() {
				this._oContextDataController = new ContextDataController(this._oConfig);
				return this._oContextDataController.init();
			},
			_initPushChannel: function() {
				if (this._oConfig.getIsPushEnabled()) {
					this._oPushClient = new PushClient(this._oConfig);
					this._oPushClient.init(this._onPushCallback.bind(this));
				}
			},
			_initUI: function() {
				var iDisplayFormat = this._oConfig.getDisplayFormat();
				if (iDisplayFormat) {
					if (iDisplayFormat === Constants.E_DISPLAY_FORMAT.popover) {
						this._oVisual = new PopOverVisual();
					} else if (iDisplayFormat === Constants.E_DISPLAY_FORMAT.iframe) {
						this._oVisual = new IFrameVisual(this._oConfig, this._oResourceBundle);
					}
					if (this._oVisual) {
						this._oShellButton = new ShellBarButton(this._fnRendererPromise, this._onSurveyShow.bind(this), this._oResourceBundle);
						this._oShellButton.init();
					}
				}
			},
			_initWebAppFeedback: function() {
				this._oWebAppFeedbackLoader = new WebAppFeedbackLoader(this._oConfig);
				this._oWebAppFeedbackLoader.init(this._onAPILoadedCallback.bind(this));
				this._oWebAppFeedbackLoader.loadAPI();
			},
			_initTriggers: function() {
				//Fiori Next Beta 1 Trigger
				if (Utils.isFioriNextBeta1FeatureAvailable(this._oConfig)) {
					this._oThemeUsageTrigger = new ThemeUsageTrigger(this._openSurvey.bind(this), this._oLocalStorage);
					sap.ui.getCore().attachThemeChanged(function(oEvent) {
						this._onThemeChanged(oEvent);
					}.bind(this));
				}
			},

			_updateInitialContextData: function() {
				return this._oContextDataController.updateContextData(Constants.E_CLIENT_ACTION.init);
			},
			_onAPILoadedCallback: function() {
				return this._oContextDataController.updateContextData(Constants.E_CLIENT_ACTION.init).then(function() {
					this._getAppLifeCycleService().attachAppLoaded({},
						this._onAppLoaded,
						this
					);
					this._initTriggers();
				}.bind(this)).catch(function(oError) {
					Log.error("Fiori Feedback Plug-in error occured on updating context data on load.", null, Constants.S_PLUGIN_PLGCTRL_NAME);
				});
			},
			_getAppLifeCycleService: function() {
				return sap.ushell.Container.getService("AppLifeCycle");
			},
			_onPushCallback: function(oEventData) {
				return new Promise(function(resolve) {
					if (this._oWebAppFeedbackLoader.getIsAPILoaded()) {
						this._oContextDataController.updateContextData(Constants.E_CLIENT_ACTION.backendPush, oEventData).then(function() {
							this._openSurvey(Constants.E_CLIENT_ACTION.backendPush, null);
							resolve();
						}.bind(this)).catch(function(oError) {
							Log.error("Fiori Feedback Plug-in error occured on updating push context data.", null, Constants.S_PLUGIN_PLGCTRL_NAME);
						});
					} else {
						resolve();
					}
				}.bind(this));
			},
			_openSurvey: function(sClientAction, iFollowUpCount) {
				if (this._oContextDataController) {
					this._oContextDataController.setClientAction(sClientAction);
					this._oContextDataController.setLastTheme(this._sLastThemeId);
					this._oContextDataController.setFollowUpCount(iFollowUpCount);
				}
				QSI.API.unload();
				QSI.API.load().then(function() {
					QSI.API.run();
				});
			},
			_onSurveyShow: function() {
				return new Promise(function(
					fnResolve) {
					if (this._oWebAppFeedbackLoader.getIsAPILoaded()) {
						this._oContextDataController.updateContextData(Constants.E_CLIENT_ACTION.navBarClick, null).then(function() {
							var iDisplayFormat = this._oConfig.getDisplayFormat();
							if (iDisplayFormat === Constants.E_DISPLAY_FORMAT.iframe) {
								var sUrlParams = this._oContextDataController.getContextDataAsUrlParameter();
								this._oVisual.show(sUrlParams);
								fnResolve();
							} else {
								this._oVisual.show();
								fnResolve();
							}
						}.bind(this)).catch(function(oError) {
							Log.error("Fiori Feedback Plug-in error occured on updating context data on show.", null, Constants.S_PLUGIN_PLGCTRL_NAME);
						});
					}
				}.bind(this));
			},
			_onAppLoaded: function() {
				return this._oContextDataController.updateContextData(Constants.E_CLIENT_ACTION.appLoaded).then(function() {
					if (Utils.isFioriNextBeta1FeatureAvailable(this._oConfig)) {
						//Regular check if theme usage duration has passed
						if (this._oThemeUsageTrigger) {
							this._oThemeUsageTrigger.evaluateThemeUsageDuration();
						}
					}
					//Update button state???
				}.bind(this)).catch(function(oError) {
					Log.error("Fiori Feedback Plug-in error occured on updating context data.", null, Constants.S_PLUGIN_PLGCTRL_NAME);
				});
			},
			_onThemeChanged: function(oEvent) {
				var sNewThemeId = oEvent.getParameters().theme;
				//Check current theme against new theme, as themeChanged event is fired multiple times.
				if (this._sCurrentThemeId !== sNewThemeId) {
					//Update lastTheme with this._sCurrentThemeId
					this._updateLastTheme(this._sCurrentThemeId);
					//Update currentTheme with this._sCurrentThemeId
					this._sCurrentThemeId = sNewThemeId;
					return this._oContextDataController.updateContextData(Constants.E_CLIENT_ACTION.themeChanged).then(function() {
						if (this._oThemeUsageTrigger) {
							this._oThemeUsageTrigger.evaluateOnThemeChanged(sNewThemeId);
						}
					}.bind(this)).catch(function(oError) {
						Log.error("Fiori Feedback Plug-in error occured on updating context data.", null, Constants.S_PLUGIN_PLGCTRL_NAME);
					});
				}
			},
			_updateLastTheme: function(sNewLastThemeId) {
				if (this._oLocalStorage) {
					this._oLocalStorage.updateLastTheme(sNewLastThemeId); //Update persistence
					this._sLastThemeId = sNewLastThemeId; //Update local variable
				}
			}
		});
	});