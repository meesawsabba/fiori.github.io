/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	["sap/ui/core/Control", "sap/m/SearchField"],
	function(Control, SearchField) {
		"use strict";
		var BasicSearch = Control.extend("sap.fe.macros.table.BasicSearch", {
			metadata: {
				interfaces: ["sap.ui.mdc.IFilter"],
				events: {
					/**
					 * The 'filterChanged' can be optionally implemented to display an overlay
					 * when the filter value of the IFilter changes
					 */
					filterChanged: {
						conditionsBased: {
							type: "boolean"
						}
					},
					/**
					 * The 'search' event is a mandatory IFilter event to trigger a search query
					 * on the consuming control
					 */
					search: {
						conditions: {
							type: "object"
						}
					}
				},
				aggregations: {
					filter: {
						type: "sap.ui.core.Control",
						multiple: false
					}
				}
			},
			init: function() {
				this.setAggregation(
					"filter",
					new SearchField({
						placeholder: "{this.i18n>M_FILTERBAR_SEARCH}",
						search: function() {
							this.fireSearch();
						}.bind(this)
					})
				);
			},
			getConditions: function() {
				return undefined;
			},
			getSearch: function() {
				return this.getAggregation("filter").getValue();
			},
			validate: function() {
				return Promise.resolve();
			},
			renderer: {
				apiVersion: 2,
				render: function(oRm, oControl) {
					oRm.openStart("div", oControl);
					oRm.openEnd();
					oRm.renderControl(oControl.getAggregation("filter"));
					oRm.close("div");
				}
			}
		});
		return BasicSearch;
	},
	/* bExport= */ true
);
