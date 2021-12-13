/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object", "sap/base/Log", "../utils/Constants", "../utils/Utils"],
	function(Object, Log, Constants, Utils) {
		"use strict";

		return Object.extend("sap.feedback.ui.flpplugin.trigger.ThemeUsageTrigger", {

			_oLocalStorage: null,
			_fnShowSurveyCallback: null,
			constructor: function(fnShowSurveyCallback, oLocalStorage) {
				this._fnShowSurveyCallback = fnShowSurveyCallback;
				this._oLocalStorage = oLocalStorage;
			},
			evaluateOnThemeChanged: function(sActiveTheme) {
				var sLastTheme = this._getLastTheme();

				if (Utils.isHorizonTheme(sActiveTheme)) { //Is current active theme Horizon
					//Save timestamp
					this._updateThemeTimestamp();
				} else if (Utils.isHorizonTheme(sLastTheme)) { //Is previous theme Horizon
					if (this._isOptOutSurveyAllowed()) {
						//Show survey (opt-out)
						var iCount = this._getFollowUpCountOptOutForContext();
						this._fnShowSurveyCallback(Constants.E_CLIENT_ACTION.themeChangedOptOut, iCount);
					}
					//Delete timestamp in any case
					this._deleteThemeTimestamp();
					//Increase counter for opt-out by 1
					this._oLocalStorage.updateFollowUpOptOut();
				}
			},
			evaluateThemeUsageDuration: function() {
				var sActiveTheme = sap.ui.getCore().getConfiguration().getTheme();
				if (Utils.isHorizonTheme(sActiveTheme)) { //Is current active theme Horizon
					if (this._hasDurationPassedOptIn()) {
						//Show survey (opt-in)
						var iCount = this._getFollowUpCountOptInForContext();
						this._fnShowSurveyCallback(Constants.E_CLIENT_ACTION.themeChangedOptIn, iCount);

						//Update timestamp
						this._updateThemeTimestamp();
						//Increase counter for opt-in by 1
						this._oLocalStorage.updateFollowUpOptIn();
					}
				}
			},
			_getFollowUpCountOptInForContext: function() {
				var iCurrentCount = this._oLocalStorage.getFollowUpOptIn();
				if (iCurrentCount !== null) {
					return iCurrentCount + 1; // As zero-based increase by 1 to be "human-readable"
				}
				return 0; // If for any case not parsable, no value exists, default to 0
			},

			_getFollowUpCountOptOutForContext: function() {
				var iCurrentCount = this._oLocalStorage.getFollowUpOptOut();
				if (iCurrentCount !== null) {
					return iCurrentCount + 1; // As zero-based increase by 1 to be "human-readable"
				}
				return 0; // If for any case not parsable, no value exists, default to 0
			},
			_getLastTheme: function() {
				if (this._oLocalStorage) {
					return this._oLocalStorage.getLastTheme();
				}
				return null;
			},
			_deleteThemeTimestamp: function() {
				if (this._oLocalStorage) {
					this._oLocalStorage.deleteKey(Constants.S_STOR_THEME_START);
				}
			},
			_updateThemeTimestamp: function() {
				if (this._oLocalStorage) {
					this._oLocalStorage.updateValue(Constants.S_STOR_THEME_START, Date.now().toString(10));
				}
			},
			_readThemeTimestamp: function() {
				if (this._oLocalStorage) {
					return this._oLocalStorage.getNumberForKey(Constants.S_STOR_THEME_START);
				}
				return null;
			},
			_isOptOutSurveyAllowed: function() {
				var iCount = this._oLocalStorage.getFollowUpOptOut();
				if (iCount < Constants.I_MAX_COUNT_SURVEY_FOLLOWUP_OPTOUT) {
					return true;
				}
				return false;
			},
			_hasDurationPassedOptIn: function() {
				var iCount = this._oLocalStorage.getFollowUpOptIn();
				if (iCount < Constants.I_MAX_COUNT_SURVEY_FOLLOWUP_OPTIN) {
					var iTimestampOptIn = this._readThemeTimestamp();
					if (iTimestampOptIn) {
						var iThreshold = this._calculateThresholdOptIn(iCount, iTimestampOptIn);
						// If threshold (opt-in timestamp + waiting time) has passed, showing survey allowed
						if (iThreshold && iThreshold < Date.now()) {
							return true;
						}
					} else {
						// Timestamp seems to not exist at all, but prerequisite of sap_horizon theme is fulfilled, so create it.
						// Might happen with Theme-switch via URL-parameter and no themeChanged event.
						this._updateThemeTimestamp();
					}
				}
				return false;
			},
			_calculateThresholdOptIn: function(iCurrentCount, iTimestampOptIn) {
				switch (iCurrentCount) {
					case 0:
						//Wait 30 minutes for first survey presentation
						return this._addMinutes(iTimestampOptIn, Constants.I_MINUTES_WAIT_SURVEY_FOLLOWUP_1);
					case 1:
						//Wait 3h (180 minutes) for second survey presentation
						return this._addMinutes(iTimestampOptIn, Constants.I_MINUTES_WAIT_SURVEY_FOLLOWUP_2);
					case 2:
						//Wait 24h (1440 minutes) for third and last survey presentation
						return this._addMinutes(iTimestampOptIn, Constants.I_MINUTES_WAIT_SURVEY_FOLLOWUP_3);
					default:
						return null;
				}
			},
			_addMinutes: function(iTimestamp, iMinutes) {
				if (iTimestamp && iMinutes) {
					return new Date(iTimestamp + iMinutes * 60000).getTime();
				}
				return null;
			}
		});
	});