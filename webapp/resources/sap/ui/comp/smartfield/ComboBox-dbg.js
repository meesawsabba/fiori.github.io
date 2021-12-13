/*
 * ! SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */

sap.ui.define([
	"sap/ui/comp/library",
		"sap/m/ComboBox",
		"sap/m/ComboBoxRenderer"
	],
	function(
		library,
		BaseComboBox,
		ComboBoxRenderer
	) {
	"use strict";

	var sDefaultGUID = "00000000-0000-0000-0000-000000000000";
	function isDefaultGUID(sValue){
		return sValue === sDefaultGUID;
	}
	/**
	 * Constructor for a new <code>SmartField/ComboBox</code>.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 * @class Extends the functionalities in sap.m.ComboBox
	 * @extends sap.m.ComboBox
	 * @constructor
	 * @protected
	 * @alias sap.ui.comp.smartfield.ComboBox
	 */
	var ComboBox = BaseComboBox.extend("sap.ui.comp.smartfield.ComboBox",
	{
		metadata: {

			library: "sap.ui.comp",
			properties: {
				enteredValue: {
					type: "string",
					group: "Data",
					defaultValue: ""
				}
			}
		},
		renderer: ComboBoxRenderer
	 });

	ComboBox.prototype.setEnteredValue = function (sValue) {
		if (typeof sValue !== "undefined") {
			this.setSelectedKey(sValue);
		}

		var oSelectedItem = this.getSelectedItem();

		if (sValue && !oSelectedItem && !isDefaultGUID(sValue)) {
			this.setValue(sValue);
		}
		var sEnteredValue = oSelectedItem ? this.getSelectedKey() : this.getValue();

		this.setProperty("enteredValue", sEnteredValue);

		return this;
	};

	return ComboBox;

});
