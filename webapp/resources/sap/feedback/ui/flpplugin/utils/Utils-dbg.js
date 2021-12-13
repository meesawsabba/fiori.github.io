/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["./Constants", "sap/ui/thirdparty/jquery"],
	function(Constants, $) {
		"use strict";
		/* globals URLSearchParams, localStorage */
		return {
			getTriggerButton: function() {
				return $("#surveyTriggerButton");
			},
			getLocalStorage: function() {
				return localStorage;
			},
			//Checks for null, undefined, 0, "", false, NaN
			hasValue: function(oValue) {
				if (typeof oValue !== "undefined" && oValue) {
					return true;
				}
				return false;
			},
			getCurrentApp: function() {
				return sap.ushell.Container.getService(
					"AppLifeCycle"
				).getCurrentApplication();
			},
			isSupportedAppType: function(oCurrentApplication) {
				if (oCurrentApplication && oCurrentApplication.applicationType) {
					var sAppType = oCurrentApplication.applicationType.toLowerCase();
					if (sAppType === "ui5" || sAppType === "wda" || sAppType === "gui" || sAppType === "tr" || sAppType === "nwbc") {
						return true;
					}
				}
				return false;
			},
			convertAppFrameworkTypeToId: function(sType) {
				if (sType) {
					return Constants.E_APP_FRAMEWORK[sType.toLowerCase()] || Constants.E_APP_FRAMEWORK["unknown"];
				}
				return Constants.E_APP_FRAMEWORK["unknown"];
			},
			stringIsEmpty: function(sValue) {
				return (sValue.length === 0 || !sValue.trim());
			},
			stringToTitleCase: function(sInput) {
				if (sInput) {
					return sInput.replace(/\w\S*/g, function(sIntermediate) {
						return sIntermediate.charAt(0).toUpperCase() + sIntermediate.substr(1).toLowerCase();
					});
				}
				return sInput;
			},
			isHorizonTheme: function(sThemeName) {
				if (sThemeName && (sThemeName === Constants.E_THEME_NAME.horizon ||
						sThemeName === Constants.E_THEME_NAME.polarisPreview ||
						sThemeName === Constants.E_THEME_NAME.horizonPreview)) {
					return true;
				}
				return false;
			},
			//OPEN: Remove function URL-param check before HFC03
			isFioriNextB1ConfigParamActive: function() {
				var sQueryString = window.location.search;
				if (sQueryString) {
					var oUrlParams = new URLSearchParams(sQueryString);
					if (oUrlParams && oUrlParams.has(Constants.S_THEME_URL_PARAM_SWITCH)) {
						var bUrlParamState = oUrlParams.get(Constants.S_THEME_URL_PARAM_SWITCH);
						if (bUrlParamState.trim().toLocaleLowerCase() === "true") {
							return true;
						}
					}
				}
				return false;
			},
			isFioriNextB1ScopeSetActive: function(oConfig) {
				if (oConfig && oConfig.hasScopeItem(Constants.S_SCOPE_FIORI_NEXT_BETA1)) {
					return true;
				}
				return false;
			},
			isLocalStorageAvailable: function() {
				try {
					return "localStorage" in window && window["localStorage"] !== null;
				} catch (e) {
					return false;
				}
			},
			isFioriNextBeta1FeatureAvailable: function(oConfig) {
				if ((this.isFioriNextB1ConfigParamActive() || this.isFioriNextB1ScopeSetActive(oConfig)) && this.isLocalStorageAvailable()) {
					return true;
				}
				return false;
			},
			isStringValidNumber: function(sInput) {
				return !isNaN(parseFloat(sInput)) && isFinite(sInput);
			},
			isPositiveInteger: function(iValue) {
				return /^\d+$/.test(iValue);
			}
		};
	});