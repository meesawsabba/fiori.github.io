/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/ui/mdc/FilterBar",
		"sap/ui/mdc/filterbar/FilterBarBaseRenderer",
		"sap/ui/mdc/filterbar/aligned/FilterItemLayout",
		"sap/fe/core/controls/filterbar/VisualFilterContainer",
		"sap/fe/core/controls/filterbar/FilterContainer"
	],
	function(MdcFilterBar, FilterBarBaseRenderer, FilterItemLayout, VisualFilterContainer, FilterContainer) {
		"use strict";
		var FilterBar = MdcFilterBar.extend("sap.fe.core.controls.FilterBar", {
			metadata: {
				properties: {
					initialLayout: {
						type: "string",
						defaultValue: "compact"
					}
				},
				associations: {
					/**
					 * Control which allows for switching between visual and normal filter layouts
					 */
					toggleControl: {
						type: "sap.m.SegmentedButton",
						multiple: false
					}
				}
			},
			renderer: FilterBarBaseRenderer
		});

		FilterBar.prototype.setToggleControl = function(vToggle) {
			if (typeof vToggle === "string") {
				this._oSegmentedButton = sap.ui.getCore().byId(vToggle);
			} else {
				this._oSegmentedButton = vToggle;
			}

			if (this.getToggleControl() && this._oSegmentedButton) {
				this._oSegmentedButton.detachEvent("select", this._toggleLayout.bind(this));
			}
			if (this._oSegmentedButton) {
				this._oSegmentedButton.attachEvent("select", this._toggleLayout.bind(this));
			}
			this.setAssociation("toggleControl", vToggle, true);
		};

		FilterBar.prototype._toggleLayout = function() {
			// Since primary layout is always compact
			// hence set the secondary layout as visual filter only for the first time only
			if (!this._oSecondaryFilterBarLayout) {
				this._oSecondaryFilterBarLayout = new VisualFilterContainer();
			}

			// do not show Adapt Filters Button for visual layout
			if (this._oSecondaryFilterBarLayout.isA("sap.fe.core.controls.filterbar.VisualFilterContainer")) {
				this.setShowAdaptFiltersButton(false);
			} else {
				this.setShowAdaptFiltersButton(true);
			}

			// get all filter fields and button of the current layout
			var oCurrentFilterBarLayout = this._oFilterBarLayout;
			var oFilterItems = this.getFilterItems();
			var aFilterFields = oCurrentFilterBarLayout.getAllFilterFields();
			var aSortedFilterFields = this.getSortedFilterFields(oFilterItems, aFilterFields);
			var aButtons = oCurrentFilterBarLayout.getAllButtons();
			var aVisualFilterFields =
				oCurrentFilterBarLayout.getAllVisualFilterFields && oCurrentFilterBarLayout.getAllVisualFilterFields();
			if (this._oSecondaryFilterBarLayout.isA("sap.fe.core.controls.filterbar.VisualFilterContainer")) {
				this._oSecondaryFilterBarLayout.setAllFilterFields(aSortedFilterFields, aVisualFilterFields);
			}
			// use secondary filter bar layout as new layout
			this._oFilterBarLayout = this._oSecondaryFilterBarLayout;

			// insert all filter fields from current layout to new layout
			var that = this;
			aFilterFields.forEach(function(oFilterField, iIndex) {
				oCurrentFilterBarLayout.removeFilterField(oFilterField);
				that._oFilterBarLayout.insertFilterField(oFilterField, iIndex);
			});
			// insert all buttons from the current layout to the new layout
			aButtons.forEach(function(oButton) {
				oCurrentFilterBarLayout.removeButton(oButton);
				that._oFilterBarLayout.addButton(oButton);
			});

			// set the current filter bar layout to the secondary one
			this._oSecondaryFilterBarLayout = oCurrentFilterBarLayout;

			// update the layout aggregation of the filter bar and rerender the same.
			this.setAggregation("layout", that._oFilterBarLayout, true);
			this._oFilterBarLayout.rerender();
		};

		FilterBar.prototype.getSortedFilterFields = function(aFilterItems, aFilterFields) {
			var aFilterIds = [];
			aFilterItems.forEach(function(oFilterItem) {
				aFilterIds.push(oFilterItem.getId());
			});
			aFilterFields.sort(function(aFirstItem, aSecondItem) {
				var sFirstItemVFId, sSecondItemVFId;
				aFirstItem.getContent().forEach(function(oInnerControl) {
					if (oInnerControl.isA("sap.ui.mdc.FilterField")) {
						sFirstItemVFId = oInnerControl.getId();
					}
				});
				aSecondItem.getContent().forEach(function(oInnerControl) {
					if (oInnerControl.isA("sap.ui.mdc.FilterField")) {
						sSecondItemVFId = oInnerControl.getId();
					}
				});
				return aFilterIds.indexOf(sFirstItemVFId) - aFilterIds.indexOf(sSecondItemVFId);
			});
			return aFilterFields;
		};

		FilterBar.prototype._createInnerLayout = function() {
			this._oFilterBarLayout = new FilterContainer();
			this._cLayoutItem = FilterItemLayout;
			this._oFilterBarLayout.getInner().addStyleClass("sapUiMdcFilterBarBaseAFLayout");
			this._addButtons();

			// TODO: Check with MDC if there is a better way to load visual filter on the basis of control property
			// _createInnerLayout is called on Init by the filter bar base.
			// This mean that we do not have access to the control properties yet
			// and hence we cannot decide on the basis of control properties whether initial layout should be compact or visual
			// As a result we have to do this workaround to always load the compact layout by default
			// And toogle the same in case the initialLayout was supposed to be visual filters.
			var oInnerLayout = this._oFilterBarLayout.getInner(),
				that = this;
			var oFilterContainerInnerLayoutEventDelegate = {
				onBeforeRendering: function() {
					if (that.getInitialLayout() === "visual") {
						that._toggleLayout();
					}
					oInnerLayout.removeEventDelegate(oFilterContainerInnerLayoutEventDelegate);
				}
			};
			oInnerLayout.addEventDelegate(oFilterContainerInnerLayoutEventDelegate);

			this.setAggregation("layout", this._oFilterBarLayout, true);
		};

		FilterBar.prototype.exit = function() {
			MdcFilterBar.prototype.exit.apply(this, arguments);
			// Sometimes upon external navigation this._SegmentedButton is already destroyed
			// so check if it exists and then only remove stuff
			if (this._oSegmentedButton) {
				this._oSegmentedButton.detachEvent("select", this._toggleLayout);
				delete this._oSegmentedButton;
			}
		};

		return FilterBar;
	}
);
