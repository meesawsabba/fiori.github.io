/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/core/library", "sap/fe/core/CommonUtils"], function(CoreLibrary, CommonUtils) {
	"use strict";

	var VariantManagement = CoreLibrary.VariantManagement;

	return {
		applyInitialStateOnly: function() {
			return false;
		},
		adaptStateControls: function(aStateControls) {
			var oView = this.getView(),
				oController = oView.getController(),
				oViewData = oView.getViewData(),
				bControlVM = false;

			switch (oViewData.variantManagement) {
				case VariantManagement.Control:
					bControlVM = true;
					break;
				case VariantManagement.Page:
				case VariantManagement.None:
					break;
				default:
					throw new Error("unhandled variant setting: " + oViewData.getVariantManagement());
			}

			oController._findTables().forEach(function(oTable) {
				var oQuickFilter = oTable.getQuickFilter();
				if (oQuickFilter) {
					aStateControls.push(oQuickFilter);
				}
				if (bControlVM) {
					aStateControls.push(oTable.getVariant());
				}
			});

			aStateControls.push(oView.byId("fe::ObjectPage"));
		},
		adaptBindingRefreshControls: function(aControls) {
			var oView = this.getView(),
				sRefreshStrategy = CommonUtils.getViewRefreshInfo(oView),
				oController = oView.getController(),
				aControlsToRefresh = [];

			if (sRefreshStrategy) {
				var oObjectPageControl = oController._getObjectPageLayoutControl();
				aControlsToRefresh.push(oObjectPageControl);
			}
			if (sRefreshStrategy !== "includingDependents") {
				var aViewControls = oController._findTables();
				aControlsToRefresh = aControlsToRefresh.concat(CommonUtils.getControlsForRefresh(oView, aViewControls) || []);
			}
			return aControlsToRefresh.reduce(function(aPrevControls, oControl) {
				if (aPrevControls.indexOf(oControl) === -1) {
					aPrevControls.push(oControl);
				}
				return aPrevControls;
			}, aControls);
		}
	};
});
