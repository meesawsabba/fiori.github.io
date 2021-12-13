/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

// Provides control sap.fe.core.controls.filterbar.VisualFilterContainer.
sap.ui.define(
	["sap/ui/mdc/filterbar/IFilterContainer", "sap/m/HeaderContainer", "sap/m/FlexBox", "sap/ui/Device", "sap/ui/core/library"],
	function(IFilterContainer, HeaderContainer, FlexBox, Device, coreLibrabry) {
		"use strict";

		/**
		 * Constructor for a new Visual Filter Container.
		 * Used for visual filters
		 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
		 * @extends sap.ui.mdc.filterbar.IFilterContainer
		 * @class
		 * @private
		 * @alias sap.fe.core.controls.filterbar.VisualFilterContainer
		 */
		var VisualFilterContainer = IFilterContainer.extend("sap.fe.core.controls.filterbar.VisualFilterContainer", {
			metadata: {
				aggregations: {
					/**
					 * Internal hidden aggregation to hold the inner layout.
					 */
					_layout: {
						type: "sap.ui.core.Control",
						multiple: false,
						visibility: "hidden"
					}
				}
			}
		});

		VisualFilterContainer.prototype.init = function() {
			IFilterContainer.prototype.init.apply(this, arguments);
			//var oRB = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");
			var sDeviceSystem = Device.system,
				Orientation = coreLibrabry.Orientation,
				sOrientation = sDeviceSystem.phone ? Orientation.Vertical : undefined,
				sDirection = sDeviceSystem.phone ? "ColumnReverse" : "Column";

			this.oHeaderContainer = new HeaderContainer({
				orientation: sOrientation
			});
			this.oButtonFlexBox = new FlexBox({
				alignItems: "End",
				justifyContent: "End"
			});

			this.oLayout = new FlexBox({
				direction: sDirection, // Direction is Column Reverse for Phone
				items: [this.oHeaderContainer, this.oButtonFlexBox]
			});

			this.aAllFilterFields = [];
			this.aVisualFilterFields = {};
		};

		VisualFilterContainer.prototype.exit = function() {
			// destroy layout
			IFilterContainer.prototype.exit.apply(this, arguments);
			// destroy all filter fields which are not in the layout
			var aAllFilterFields = this.getAllFilterFields();
			aAllFilterFields.forEach(function(oFilterField) {
				oFilterField.destroy();
			});
			this.oHeaderContainer = null;
			this.oButtonFlexBox = null;
			this.aAllFilterFields = [];
		};

		VisualFilterContainer.prototype.insertFilterField = function(oControl, iIndex) {
			var oFilterItemLayoutEventDelegate = {
				onBeforeRendering: function() {
					// visual filter does not need to render a label
					// hence override the getContent of the FilterItemLayout
					// and store the original getContent for later usage in the compact filters
					if (!oControl._fnGetContentCopy) {
						oControl._fnGetContentCopy = oControl.getContent;
					}
					// override getContent of FilterItemLayout
					// to add only filterField and not label
					oControl.getContent = function() {
						var aContent = [];
						aContent.push(oControl._oFilterField);
						return aContent;
					};
					oControl.removeEventDelegate(oFilterItemLayoutEventDelegate);
				}
			};
			oControl.addEventDelegate(oFilterItemLayoutEventDelegate);

			// Setting VF control for the Filterfield.
			var that = this,
				oVisualFilters = that.aVisualFilterFields;
			oControl.getContent().some(function(oInnerControl) {
				var sFFId = oInnerControl.getId();
				if (oVisualFilters[sFFId] && oInnerControl.isA("sap.ui.mdc.FilterField")) {
					oInnerControl.setContent(oVisualFilters[sFFId]);
					that.oHeaderContainer.insertContent(oControl, iIndex);
				}
			});
		};

		VisualFilterContainer.prototype.removeFilterField = function(oControl) {
			this.oHeaderContainer.removeContent(oControl);
		};

		VisualFilterContainer.prototype.removeAllFilterFields = function() {
			this.aAllFilterFields = [];
			this.aVisualFilterFields = {};
			this.oHeaderContainer.removeAllContent();
		};

		VisualFilterContainer.prototype.getFilterFields = function() {
			return this.oHeaderContainer.getContent();
		};

		VisualFilterContainer.prototype.addButton = function(oControl) {
			this.oButtonFlexBox.insertItem(oControl);
		};

		VisualFilterContainer.prototype.getAllButtons = function() {
			return this.oButtonFlexBox.getItems().reverse();
		};

		VisualFilterContainer.prototype.removeButton = function(oControl) {
			this.oButtonFlexBox.removeItem(oControl);
		};

		VisualFilterContainer.prototype.getAllFilterFields = function() {
			return this.aAllFilterFields.slice();
		};
		VisualFilterContainer.prototype.setAllFilterFields = function(aFilterFields, aVisualFilterFields) {
			this.aAllFilterFields = aFilterFields;
			this.aVisualFilterFields = aVisualFilterFields;
		};

		return VisualFilterContainer;
	}
);
