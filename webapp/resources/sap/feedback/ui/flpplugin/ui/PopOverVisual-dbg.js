/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/base/Object", "../utils/Utils"
], function(Object, Utils) {
	"use strict";
	/* globals QSI */
	return Object.extend("sap.feedback.ui.flpplugin.ui.PopOverVisual", {
		constructor: function() {

		},
		show: function() {
			QSI.API.unload();
			QSI.API.load().then(function() {
				this._clickButton();
			}.bind(this));
		},
		_clickButton: function() {
			var hiddenElement = Utils.getTriggerButton();
			if (hiddenElement) {
				hiddenElement.click();
			}
		}
	});
});