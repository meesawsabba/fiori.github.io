/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object", "./Utils", "./Constants"],
	function(Object, Utils, Constants) {
		"use strict";

		return Object.extend("sap.feedback.ui.flpplugin.utils.Storage", {

			_oLocalStorage: null,

			init: function() {
				if (Utils.isLocalStorageAvailable()) {
					this._oLocalStorage = Utils.getLocalStorage();
					this._initFollowUpOptIn();
					this._initFollowUpOptOut();
					return true;
				}
				return false;
			},
			///---Last theme---
			updateLastTheme: function(sThemeName) {
				this.updateValue(Constants.S_STOR_LAST_THEME, sThemeName);
			},
			getLastTheme: function() {
				return this.getStringForKey(Constants.S_STOR_LAST_THEME);
			},
			///---Followup Opt-in---
			_initFollowUpOptIn: function() {
				var iFollowUpCount = this.getFollowUpOptIn();
				//In case value not set. Init to 0
				if (!Utils.isPositiveInteger(iFollowUpCount)) {
					this.updateValue(Constants.S_STOR_THEME_FOLLOWUP_OPTIN, "0");
				}
			},
			updateFollowUpOptIn: function() {
				var iFollowUpCount = this.getFollowUpOptIn();
				if (Utils.isPositiveInteger(iFollowUpCount)) {
					var sNewFollowUpCount = (iFollowUpCount + 1).toString();
					this.updateValue(Constants.S_STOR_THEME_FOLLOWUP_OPTIN, sNewFollowUpCount);
				}
			},
			getFollowUpOptIn: function() {
				return this.getNumberForKey(Constants.S_STOR_THEME_FOLLOWUP_OPTIN);
			},
			///---Followup Opt-out---
			_initFollowUpOptOut: function() {
				var iFollowUpCount = this.getFollowUpOptOut();
				//In case value not set. Init to 0
				if (!Utils.isPositiveInteger(iFollowUpCount)) {
					this.updateValue(Constants.S_STOR_THEME_FOLLOWUP_OPTOUT, "0");
				}
			},
			updateFollowUpOptOut: function() {
				var iFollowUpCount = this.getFollowUpOptOut();
				if (Utils.isPositiveInteger(iFollowUpCount)) {
					var sNewFollowUpCount = (iFollowUpCount + 1).toString();
					this.updateValue(Constants.S_STOR_THEME_FOLLOWUP_OPTOUT, sNewFollowUpCount);
				}
			},
			getFollowUpOptOut: function() {
				return this.getNumberForKey(Constants.S_STOR_THEME_FOLLOWUP_OPTOUT);
			},
			///---Generic---
			deleteKey: function(sKey) {
				if (this._oLocalStorage && sKey) {
					this._oLocalStorage.removeItem(sKey);
				}
			},
			updateValue: function(sKey, sValue) {
				if (this._oLocalStorage && sKey && sValue) {
					this._oLocalStorage.setItem(sKey, sValue);
				}
			},
			_getValueForKey: function(sKey) {
				if (this._oLocalStorage && sKey) {
					return this._oLocalStorage.getItem(sKey);
				}
				return null;
			},
			getStringForKey: function(sKey) {
				return this._getValueForKey(sKey);
			},
			getNumberForKey: function(sKey) {
				var sValue = this._getValueForKey(sKey);
				if (sValue && Utils.isStringValidNumber(sValue)) {
					return parseInt(sValue);
				}
				return null;
			}
		});
	});