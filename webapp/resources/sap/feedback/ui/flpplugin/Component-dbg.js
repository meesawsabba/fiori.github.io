/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Component",
	"sap/base/Log",
	"./utils/Constants",
	"./data/Config",
	"./utils/InitDetection",
	"./utils/Utils",
	"./controller/PluginController",
	"sap/base/util/ObjectPath"
], function(
	Component,
	Log,
	Constants,
	Config,
	InitDetection,
	Utils,
	PluginController,
	ObjectPath
) {
	"use strict";
	/* global sap */

	/**
	 *
	 * @class
	 * Enables users to provide feedback in the Fiori Launchpad.
	 *
	 * <h3>Overview</h3>
	 *
	 * The user provides feedback by opening a survey via the button in the <code>Navigation Bar<code>.
	 *
	 * <h3>Usage</h3>
	 *
	 * The are two variants how to configure the Fiori Launchpad plug-in to enable users to provide feedback.
	 *
	 * You can choose from:
	 * - Automatic configuration: Providing the configuration via Fiori Launchpad configuration.
	 * - Manual configuration: Providing the configuration via properties when programmatically starting up the plug-in.
	 *
	 * Using automatic configuration the plug-in will try to automatically detect the configuration and based on this configuration automatically startup the plug-in.
	 * Optionally you can use the manual configuration. The developer has to provide the configuration via the offered properties and finally run <code>load</code> to finalize it and starting up the plug-in.
	 *
	 * Without any configuration the plug-in will not be started and nothing is visible to the user.
	 *
	 *
	 * @extends sap.ui.core.Component
	 * @name sap.feedback.ui.flpplugin.Component
	 * @author SAP SE
	 * @since 1.90.0
	 *
	 */
	return Component.extend("sap.feedback.ui.flpplugin.Component", {
		metadata: {
			manifest: "json",
			properties: {
				/**
				 * Specifies the url for the Web/App Feedback project which should be loaded. This property is mandatory when providing the configuration manually.
				 */
				url: {
					name: "url",
					type: "string"
				},
				/**
				 * Specifies the unique tenant id to map feedback results to this tenant. This property is mandatory when providing the configuration manually.
				 */
				tenantId: {
					name: "tenantId",
					type: "string"
				},
				/**
				 * The tenant role provides an indicator of the tenant and its purpose (development, test, productive, etc.). Helpful to identify feedback from different source systems.
				 */
				tenantRole: {
					name: "tenantRole",
					type: "string"
				},
				/**
				 * Enables some new features and changes the data format for the context data collected with the survey to version 2.
				 */
				isPushEnabled: {
					name: "isPushEnabled",
					type: "boolean"
				},
				/**
				 * Internal usage only
				 */
				pushChannelPath: {
					name: "pushChannelPath",
					type: "string"
				},
				/**
				 * Can be provided with the collected context data to the survey to allow filtering of survey results by product name.
				 */
				productName: {
					name: "productName",
					type: "string"
				},
				/**
				 * Can be provided with the collected context data to the survey to allow filtering of survey results by platform type.
				 */
				platformType: {
					name: "platformType",
					type: "string"
				},
				/**
				 * Optional comma-separated string list of scope items to enable single features.
				 */
				scopeSet: {
					name: "scopeSet",
					type: "string"
				}
			}
		},
		_oPluginController: null,
		_oConfig: null,
		_bIsLoaded: false,

		init: function() {
			//Check if parameters provided manually else try start it up directly with config via flp-config.
			if (!this._isManuallyConfigured()) {
				return this._prepareAndRun();
			}
		},
		/**
		 * Starts loading the plug-in if it is configured using a manual configuration provided via properties.
		 * When configured using the FLP configuration this function can be ignored.
		 *
		 * @private
		 * @ui5-restricted
		 * @returns {Promise} Resolves when loading was successful and rejects when already loaded (plug-in can only be loaded once) or any other error occured during loading.
		 */
		load: function() {
			return new Promise(function(fnResolve, fnReject) {
				if (this._bIsLoaded === false) {
					this._prepareAndRun().then(function() {
						fnResolve();
					}, function() {
						fnReject();
					});
				} else {
					Log.error("Plug-in already loaded with an existing configuration.", null, Constants.S_PLUGIN_COMPONENT_NAME);
					fnReject();
				}
			}.bind(this));
		},
		_prepareAndRun: function() {
			return new Promise(function(fnResolve, fnReject) {
				//Load plugin config
				var oLoadedConfigData = this._loadPluginConfigData();
				if (oLoadedConfigData) {
					this._oConfig = this._createConfigObject(oLoadedConfigData);
					this._run().then(function() {
						this._bIsLoaded = true;
						fnResolve();
					}.bind(this), function() {
						fnReject();
					});
				} else {
					Log.error("Config data could not be loaded correctly.", null, Constants.S_PLUGIN_COMPONENT_NAME);
					fnReject();
				}
			}.bind(this));
		},

		_loadPluginConfigData: function() {
			//Try load from flp config, if that does not succeed try to check for manual properties
			if (this.getProperty("url") && this.getProperty("tenantId")) {
				var oManualPluginConfig = {};
				oManualPluginConfig.qualtricsInternalUri = this.getProperty("url");
				oManualPluginConfig.tenantId = this.getProperty("tenantId");
				if (this.getProperty("tenantRole")) {
					oManualPluginConfig.tenantRole = this.getProperty("tenantRole");
				}
				if (this.getProperty("isPushEnabled")) {
					oManualPluginConfig.isPushEnabled = this.getProperty("isPushEnabled");
				}
				if (this.getProperty("pushChannelPath")) {
					oManualPluginConfig.pushChannelPath = this.getProperty("pushChannelPath");
				}
				if (this.getProperty("productName")) {
					oManualPluginConfig.productName = this.getProperty("productName");
				}
				if (this.getProperty("platformType")) {
					oManualPluginConfig.platformType = this.getProperty("platformType");
				}
				if (this.getProperty("scopeSet")) {
					oManualPluginConfig.scopeSet = this.getProperty("scopeSet");
				}
				return oManualPluginConfig;
			} else if (this.getComponentData() && this.getComponentData().config) {
				var oAutoPluginConfig = this.getComponentData().config;
				if (oAutoPluginConfig && this._isMandatoryConfigValid(oAutoPluginConfig) === true) {
					return oAutoPluginConfig;
				} else {
					Log.error("Feedback config could not be read.", null, Constants.S_PLUGIN_COMPONENT_NAME);
				}
			}
			return null;
		},
		_isManuallyConfigured: function() {
			//Validate if mandatory parameters are provided.
			if (this.getProperty("url") && this.getProperty("tenantId")) {
				return true;
			}
			return false;
		},

		_createConfigObject: function(oConfigData) {
			var oConfig = new Config(oConfigData.qualtricsInternalUri, oConfigData.tenantId, Constants.E_DATA_FORMAT.version1);
			oConfig.setTenantRole(oConfigData.tenantRole);

			if (oConfigData.isPushEnabled) {
				//If push is enabled, dataformat v2 is mandatory
				oConfig.setDataFormat(Constants.E_DATA_FORMAT.version2);
				oConfig.setIsPushEnabled(oConfigData.isPushEnabled);
				if (oConfig.getIsPushEnabled() && oConfigData.pushChannelPath && !Utils.stringIsEmpty(oConfigData.pushChannelPath)) {
					oConfig.setPushChannelPath(oConfigData.pushChannelPath);
				}
			}
			if (oConfigData.productName) {
				oConfig.setProductName(oConfigData.productName);
			}
			if (oConfigData.platformType) {
				oConfig.setPlatformType(oConfigData.platformType);
			}
			if (oConfigData.scopeSet) {
				oConfig.setScopeSet(oConfigData.scopeSet);
			}
			return oConfig;
		},

		_isMandatoryConfigValid: function(oConfigData) {
			//Validate that the uri is provided
			var sQualtricsUri = oConfigData.qualtricsInternalUri;
			if (sQualtricsUri && sQualtricsUri.length > 0) {
				var sTenantId = oConfigData.tenantId;
				if (sTenantId && sTenantId.length > 0) {
					return true;
				} else {
					Log.error("Feedback config insufficient - tenant id missing.", oConfigData, Constants.S_PLUGIN_COMPONENT_NAME);
				}
			} else {
				Log.error("Feedback config insufficient - url missing.", oConfigData, Constants.S_PLUGIN_COMPONENT_NAME);
			}
			return false;
		},

		_run: function() {
			return new Promise(function(fnResolve) {
				this._validateIfInitializable(this._oConfig.getQualtricsUri()).then(function(bIsInitializable) {
					if (bIsInitializable) {
						this._oConfig.setIsLibraryLoadable(bIsInitializable);
						this._startPluginController(this._oConfig).then(function() {
							fnResolve();
						}, function() {
							Log.error("Plugin Controller could not be initialized.", this._oConfig, Constants.S_PLUGIN_COMPONENT_NAME);
							fnResolve();
						}.bind(this));
					}
				}.bind(this), function(bIsInitializable) {
					if (!bIsInitializable) {
						this._oConfig.setIsLibraryLoadable(bIsInitializable);
						Log.error("Unable to request feedback library.", this._oConfig, Constants.S_PLUGIN_COMPONENT_NAME);
					}
					fnResolve();
				}.bind(this));
			}.bind(this));
		},

		_validateIfInitializable: function(sQualtricsUri) {
			var oInitDetection = new InitDetection(sQualtricsUri);
			return oInitDetection.isUrlLoadable();
		},

		_startPluginController: function(oConfig) {
			return new Promise(function(resolve, reject) {
				if (this._isDeviceDisplayFormatCombinationValid(oConfig.getDisplayFormat())) {
					var oResourceBundle = this.getModel("i18n").getResourceBundle();
					this._oPluginController = new PluginController(oConfig, this._getRenderer(), oResourceBundle);
					this._oPluginController.init().then(function() {
						resolve();
					}, function(oError) {
						Log.error("Feedback plugin startup failed.", oError, Constants.S_PLUGIN_COMPONENT_NAME);
						reject();
					});
				} else {
					Log.error("Device not supported.", this._oConfig, Constants.S_PLUGIN_COMPONENT_NAME);
					reject();
				}
			}.bind(this));
		},

		_isDeviceDisplayFormatCombinationValid: function(iDisplayFormat) {
			if (sap.ui.Device.system.phone && iDisplayFormat === Constants.E_DISPLAY_FORMAT.popover) {
				return false;
			}
			return true;
		},

		_getRenderer: function() {
			return new Promise(function(fnResolve, fnReject) {
				this._oShellContainer = ObjectPath.get("sap.ushell.Container");
				if (!this._oShellContainer) {
					fnReject(
						"Illegal state: shell container not available; this component must be executed in a unified shell runtime context."
					);
				} else {
					var oRenderer = this._oShellContainer.getRenderer();
					if (oRenderer) {
						fnResolve(oRenderer);
					} else {
						// renderer not initialized yet, listen to rendererCreated event
						this._onRendererCreated = function(oEvent) {
							oRenderer = oEvent.getParameter("renderer");
							if (oRenderer) {
								fnResolve(oRenderer);
							} else {
								fnReject(
									"Illegal state: shell renderer not available after receiving 'rendererLoaded' event."
								);
							}
						};
						this._oShellContainer.attachRendererCreatedEvent(
							this._onRendererCreated
						);
					}
				}
			}.bind(this));
		}
	});
});