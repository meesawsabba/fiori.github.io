/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([],
	function() {
		"use strict";
		var constants = {
			S_PLUGIN_COMPONENT_NAME: "sap.feedback.ui.flpplugin.Component",
			S_PLUGIN_PLGCTRL_NAME: "sap.feedback.ui.flpplugin.controller.PluginController",
			S_PLUGIN_POPOVERVIS_NAME: "sap.feedback.ui.flpplugin.ui.PopOverVisual",
			S_PLUGIN_IFRAMEVIS_NAME: "sap.feedback.ui.flpplugin.ui.IFrameVisual",
			S_PLUGIN_PUSHCLNT_NAME: "sap.feedback.ui.flpplugin.controller.PushClient",
			S_PLUGIN_SHELLBARBTN_NAME: "sap.feedback.ui.flpplugin.ui.ShellBarButton",
			S_PLUGIN_CTXTDATACTRL_NAME: "sap.feedback.ui.flpplugin.controller.ContextDataController",
			S_PLUGIN_WEBAPPFEEDBACKLDR_NAME: "sap.feedback.ui.flpplugin.controller.WebAppFeedbackLoader",
			S_PLUGIN_APPCONTEXTDATA_NAME: "sap.feedback.ui.flpplugin.data.AppContextData",
			S_PLUGIN_PUSHCONTEXTDATA_NAME: "sap.feedback.ui.flpplugin.data.PushContextData",
			S_DEFAULT_VALUE: "N/A",
			S_LAUNCHPAD_VALUE: "LAUNCHPAD",
			S_SHELL_BTN_ID: "sap_qualtrics_surveyTriggerButton",
			S_INVISIBLE_ITEM_ID: "surveyTriggerButton",
			S_STOR_THEME_START: "sap.feedback.ui.theme_start",
			S_STOR_THEME_FOLLOWUP_OPTIN: "sap.feedback.ui.theme_followup_opt_in",
			S_STOR_THEME_FOLLOWUP_OPTOUT: "sap.feedback.ui.theme_followup_opt_out",
			S_STOR_LAST_THEME: "sap.feedback.ui.last_theme",
			S_THEME_URL_PARAM_SWITCH: "qtx-teched",
			S_SCOPE_FIORI_NEXT_BETA1: "techEd21",
			I_MINUTES_WAIT_SURVEY_FOLLOWUP_1: 30,
			I_MINUTES_WAIT_SURVEY_FOLLOWUP_2: 180,
			I_MINUTES_WAIT_SURVEY_FOLLOWUP_3: 1440,
			I_MAX_COUNT_SURVEY_FOLLOWUP_OPTIN: 3,
			I_MAX_COUNT_SURVEY_FOLLOWUP_OPTOUT: 2,
			E_CLIENT_ACTION: {
				init: "init",
				navBarClick: "navBarClick",
				appLoaded: "appLoaded",
				backendPush: "backendPush",
				inAppFeedback: "inAppFeedback",
				themeChanged: "themeChanged",
				themeChangedOptIn: "themeChangedOptIn",
				themeChangedOptOut: "themeChangedOptOut"
			},
			E_THEME_NAME: {
				horizon: "sap_horizon",
				horizonPreview: "horizon_preview",
				polarisPreview: "polaris_preview",
				fiori3: "sap_fiori_3",
				fiori3Dark: "sap_fiori_3_dark",
				fiori3Hcb: "sap_fiori_3_hcb",
				fiori3Hcw: "sap_fiori_3_hcw",
				belize: "sap_belize",
				belizePlus: "sap_belize_plus",
				belizeHcb: "sap_belize_hcb",
				belizeHcw: "sap_belize_hcw"
			},
			E_PUSH_SRC_TYPE: {
				backend: 1,
				userInApp: 2,
				qualtrics: 3
			},
			E_DISPLAY_FORMAT: {
				popover: 1,
				iframe: 2
			},
			E_SHELLBAR_BUTTON_STATE: {
				unchanged: 1,
				restart: 2
			},
			E_DATA_FORMAT: {
				version1: 1,
				version2: 2
			},
			E_APP_FRAMEWORK: {
				unknown: 1,
				ui5: 2,
				gui: 3,
				angular: 4,
				react: 5,
				vue: 6,
				tr: 7,
				wda: 8,
				nwbc: 9
			}
		};
		return constants;
	});