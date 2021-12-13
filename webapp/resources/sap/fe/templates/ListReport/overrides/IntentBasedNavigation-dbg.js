/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/core/CommonUtils"], function(CommonUtils) {
	"use strict";
	return {
		adaptNavigationContext: function(oSelectionVariant, oTargetInfo) {
			// Adding filter bar values to the navigation does not make sense if no context has been selected.
			// Hence only consider filter bar values when SelectionVaraint is not empty
			if (!oSelectionVariant.isEmpty()) {
				var oView = this.getView(),
					oViewData = oView.getViewData(),
					oController = oView.getController(),
					sRootPath = oViewData.fullContextPath + oViewData.entitySet;
				var oFilterBarConditions = Object.assign({}, this.base.getView().getController().filterBarConditions);
				var aParameters = [];

				if (oViewData.contextPath) {
					var oMetaModel = oView.getModel().getMetaModel(),
						oParameterInfo = CommonUtils.getParameterInfo(oMetaModel, oViewData.contextPath),
						oParamProperties = oParameterInfo.parameterProperties;
					aParameters = (oParamProperties && Object.keys(oParamProperties)) || [];
				}

				oFilterBarConditions = oController._intentBasedNavigation.prepareFiltersForExternalNavigation(
					oFilterBarConditions,
					sRootPath,
					aParameters
				);
				var oInternalModelContext = oView.getBindingContext("internal");
				var mTabs = oInternalModelContext.getProperty("tabs");
				// Do we need to exclude Fields (mutli tables mode)?
				if (mTabs) {
					var aIgnoredFieldsForTab = mTabs.ignoredFields[mTabs.selected];
					if (Array.isArray(aIgnoredFieldsForTab) && aIgnoredFieldsForTab.length > 0) {
						aIgnoredFieldsForTab.forEach(function(sProperty) {
							delete oFilterBarConditions.filterConditions[sProperty];
						});
					}
				}
				// TODO: move this also into the intent based navigation controller extension
				CommonUtils.addExternalStateFiltersToSelectionVariant(oSelectionVariant, oFilterBarConditions, oTargetInfo);
				delete oTargetInfo.propertiesWithoutConflict;
			}
		},
		getEntitySet: function() {
			return this.base.getCurrentEntitySet();
		}
	};
});
