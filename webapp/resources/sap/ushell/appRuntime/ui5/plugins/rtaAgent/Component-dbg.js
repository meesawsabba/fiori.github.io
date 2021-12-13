// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([
	"sap/ui/core/Component",
	"sap/ui/fl/write/api/FeaturesAPI",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/CheckConditions",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/AppLifeCycleUtils",
	"sap/ushell/appRuntime/ui5/plugins/baseRta/Trigger",
	"sap/base/Log"
],
function (
	Component,
	FeaturesAPI,
	CheckConditions,
	AppLifeCycleUtils,
	Trigger,
	Log
) {
	"use strict";

	var oPostMessageInterface;

	function getInitialConfiguration () {
		return {
			sComponentName: "sap.ushell.appRuntime.ui5.plugins.rtaAgent",
			layer: "CUSTOMER",
			developerMode: false
		};
	}

	function postSwitchToolbarVisibilityMessageToFLP (bVisible) {
		return new Promise(function (resolve, reject) {
			oPostMessageInterface.postMessageToFlp(
				"user.postapi.rtaPlugin",
				"switchToolbarVisibility",
				{ visible: bVisible }
			).done(resolve).fail(reject);
		});
	}

	function postActivatePluginMessageToFLP () {
		return new Promise(function (resolve, reject) {
			oPostMessageInterface.postMessageToFlp(
				"user.postapi.rtaPlugin",
				"activatePlugin"
			).done(resolve).fail(reject);
		});
	}

	function postShowAdaptUIMessageToFLP () {
		return CheckConditions.checkUI5App()
			.then(function (bIsUI5App) {
				if (bIsUI5App) {
					oPostMessageInterface.postMessageToFlp(
						"user.postapi.rtaPlugin",
						"showAdaptUI"
					).fail(function (vError) {
						throw new Error(vError);
					});
				}
			});
	}

	return Component.extend("sap.ushell.appRuntime.ui5.plugins.rtaAgent.Component", {
		metadata: {
			manifest: "json"
		},

		init: function () {
			this.mConfig = getInitialConfiguration();
			this._oPluginPromise = Promise.resolve();

			oPostMessageInterface = this.getComponentData().oPostMessageInterface;

			return FeaturesAPI.isKeyUser()

			.then(function (bIsKeyUser) {
				if (bIsKeyUser) {
					return postActivatePluginMessageToFLP();
				}
				// step over the next 'then' steps
				return Promise.reject();
			})

			.then(function () {
				this.mConfig.i18n = this.getModel("i18n").getResourceBundle();
				this.mConfig.onStartHandler = this._onStartHandler.bind(this);
				this.mConfig.onErrorHandler = this._onErrorHandler.bind(this);
				this.mConfig.onStopHandler = this._onStopHandler.bind(this);

				this.oTrigger = new Trigger(this.mConfig);
				return this.oTrigger.getInitPromise();
			}.bind(this))

			.then(function () {
				this._registerPostMessages();
				return this._restartRtaIfRequired();
			}.bind(this))

			.then(function () {
				return AppLifeCycleUtils.getAppLifeCycleService();
			})
			.then(function (oAppLifeCycleService) {
				oAppLifeCycleService.attachAppLoaded(this._onAppLoaded, this);
			}.bind(this))

			.then(postShowAdaptUIMessageToFLP)

			.catch(function (vError) {
				if (vError) {
					Log.error(vError);
				}
			});
		},

		getPluginPromise: function () {
			return this._oPluginPromise;
		},

		_registerPostMessages: function () {
			oPostMessageInterface.registerPostMessageAPIs({
				"user.postapi.rtaPlugin": {
					inCalls: {
						startUIAdaptation: {
							executeServiceCallFn: function () {
								this.oTrigger.triggerStartRta(this);
								return oPostMessageInterface.createPostMessageResult();
							}.bind(this)
						}
					},
					outCalls: {
						activatePlugin: {},
						showAdaptUI: {}
					}
				}
			});
		},

		_restartRtaIfRequired: function () {
			return CheckConditions.checkUI5App()
				.then(function (bIsUI5App) {
					if (bIsUI5App) {
						if (CheckConditions.checkRestartRTA(this.mConfig.layer)) {
							return postSwitchToolbarVisibilityMessageToFLP(false)
								.then(function () {
									return this.oTrigger.triggerStartRta(this);
								}.bind(this));
						}
					}
					return undefined;
				}.bind(this));
		},

		_onAppLoaded: function () {
			CheckConditions.checkUI5App()
				.then(function (bIsUI5App) {
					if (bIsUI5App) {
						this._restartRtaIfRequired()
							.then(function () {
								return postShowAdaptUIMessageToFLP();
							});
					}
				}.bind(this));
		},

		_onStopHandler: function () {
			this._exitAdaptation();
		},

		/**
		 * This function is called when the start event of RTA was fired
		 * @private
		 */
		_onStartHandler: function () {},

		/**
		 * This function is called when the error event of RTA was fired
		 * @param {any} vError - value on error
		 * @private
		 */
		_onErrorHandler: function (vError) {
			this.oTrigger.errorHandler(vError);
			if (vError !== "Reload triggered") {
				this._exitAdaptation();

				var sError;
				var sMessage;

				if (vError instanceof Error) {
					sError = vError.stack;
					sMessage = this.mConfig.i18n.getText("TECHNICAL_ERROR");
				} else if (typeof vError === "string") {
					sError = sMessage = vError;
				}

				Log.error("Cannot start UI Adaptation: ", sError);

				sap.ui.require([
					"sap/ui/rta/Utils",
					"sap/m/MessageBox"
				], function (
					Utils,
					MessageBox
				) {
					MessageBox.error(
						sMessage,
						{
							title: this.mConfig.i18n.getText("ERROR_TITLE"),
							onClose: null,
							styleClass: Utils.getRtaStyleClassName()
						}
					);
				}.bind(this));
			}
		},

		_exitAdaptation: function () {
			postSwitchToolbarVisibilityMessageToFLP(true);
			this.oTrigger.exitRta();
		},

		exit: function () {
			postSwitchToolbarVisibilityMessageToFLP(true);
			this._oPluginPromise = this._oPluginPromise
				.then(AppLifeCycleUtils.getAppLifeCycleService.bind(AppLifeCycleUtils))
				.then(function (oAppLifeCycleService) {
					oAppLifeCycleService.detachAppLoaded(this._onAppLoaded, this);
				}.bind(this));
		}
	});
});
