/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

// Provides control sap.fe.core.filterbar.FilterContainer.
sap.ui.define(["sap/ui/mdc/filterbar/aligned/FilterContainer"], function(MdcFilterContainer) {
	"use strict";
	/**
	 * Constructor for a new FE filter container
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @extends sap.ui.mdc.filterbar.aligned.FilterContainer
	 * @class
	 * @private
	 * @alias sap.fe.core.controls.filterbar.FilterContainer
	 */
	var FilterContainer = MdcFilterContainer.extend("sap.fe.core.controls.filterbar.FilterContainer");

	FilterContainer.prototype.init = function() {
		this.aAllFilterFields = [];
		this.aAllVisualFilters = {};
		MdcFilterContainer.prototype.init.apply(this, arguments);
	};

	FilterContainer.prototype.exit = function() {
		// destroy layout
		var that = this;
		MdcFilterContainer.prototype.exit.apply(this, arguments);
		// destroy all filter fields which are not in the layout
		this.aAllFilterFields.forEach(function(oFilterField) {
			oFilterField.destroy();
		});
		Object.keys(this.aAllVisualFilters).forEach(function(sKey) {
			that.aAllVisualFilters[sKey].destroy();
		});
	};

	FilterContainer.prototype.insertFilterField = function(oControl) {
		var oFilterItemLayoutEventDelegate = {
			onBeforeRendering: function() {
				// For compact filters the item layout needs to render both label and filter field.
				// hence use the original getContent of the FilterItemLayout
				if (oControl._fnGetContentCopy) {
					oControl.getContent = oControl._fnGetContentCopy;
				}
				oControl.removeEventDelegate(oFilterItemLayoutEventDelegate);
			}
		};
		oControl.addEventDelegate(oFilterItemLayoutEventDelegate);

		// In this layout there is no need to render visual filter
		// hence find the filter field from the layout and remove it's content aggregation
		var that = this;
		oControl.getContent().forEach(function(oInnerControl) {
			var oContent = oInnerControl.getContent && oInnerControl.getContent();
			if (oInnerControl.isA("sap.ui.mdc.FilterField") && oContent && oContent.isA("sap.fe.core.controls.filterbar.VisualFilter")) {
				// store the visual filter for later use.
				var oVFId = oInnerControl.getId();
				that.aAllVisualFilters[oVFId] = oContent;
				// remove the content aggregation to render internal content of the field
				oInnerControl.setContent(null);
			}
		});

		// store filter fields to refer to when switching between layout
		this.aAllFilterFields.push(oControl);

		MdcFilterContainer.prototype.insertFilterField.apply(this, arguments);
	};

	FilterContainer.prototype.removeFilterField = function(oControl) {
		var oFilterFieldIndex = this.aAllFilterFields.findIndex(function(oFilterField) {
			return oFilterField.getId() === oControl.getId();
		});

		var that = this;
		// Setting VF content for Fillterfield before removing
		oControl.getContent().forEach(function(oInnerControl) {
			if (oInnerControl.isA("sap.ui.mdc.FilterField") && !oInnerControl.getContent()) {
				var oVFId = oInnerControl.getId();
				if (that.aAllVisualFilters[oVFId]) {
					oInnerControl.setContent(that.aAllVisualFilters[oVFId]);
				}
			}
		});

		this.aAllFilterFields.splice(oFilterFieldIndex, 1);

		MdcFilterContainer.prototype.removeFilterField.apply(this, arguments);
	};

	FilterContainer.prototype.removeAllFilterFields = function() {
		this.aAllFilterFields = [];
		this.aAllVisualFilters = {};
		this.oLayout.removeAllContent();
	};
	FilterContainer.prototype.getAllButtons = function() {
		return this.oLayout.getEndContent();
	};

	FilterContainer.prototype.removeButton = function(oControl) {
		this.oLayout.removeEndContent(oControl);
	};

	FilterContainer.prototype.getAllFilterFields = function() {
		return this.aAllFilterFields.slice();
	};

	FilterContainer.prototype.getAllVisualFilterFields = function() {
		return this.aAllVisualFilters;
	};

	FilterContainer.prototype.setAllFilterFields = function(aFilterFields) {
		this.aAllFilterFields = aFilterFields;
	};

	return FilterContainer;
});
