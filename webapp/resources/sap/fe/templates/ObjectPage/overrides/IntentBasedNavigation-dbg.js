/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/core/CommonUtils", "sap/fe/navigation/SelectionVariant"], function(CommonUtils, SelectionVariant) {
	"use strict";
	return {
		adaptNavigationContext: function(oSelectionVariant, oTargetInfo) {
			var oView = this.getView(),
				oController = oView.getController(),
				oInternalModelContext = this.getView().getBindingContext("internal"),
				oExternalNavigationContext = oInternalModelContext.getProperty("externalNavigationContext");
			var oAppComponent = CommonUtils.getAppComponent(oView);
			var oMetaModel = oAppComponent.getModel().getMetaModel();
			if (oExternalNavigationContext.page) {
				var oPageContext = oView.getBindingContext(),
					sMetaPath = oMetaModel.getMetaPath(oPageContext.getPath());
				var oPageContextData = oController._intentBasedNavigation.removeSensitiveData(oPageContext.getObject(), sMetaPath),
					oPageData = oController._intentBasedNavigation.prepareContextForExternalNavigation(oPageContextData, oPageContext),
					oPagePropertiesWithoutConflict = oPageData.propertiesWithoutConflict,
					// TODO: move this also into the intent based navigation controller extension
					oPageSV = CommonUtils.addPageContextToSelectionVariant(new SelectionVariant(), oPageData.semanticAttributes, oView),
					oPropertiesWithoutConflict = oTargetInfo.propertiesWithoutConflict;
				var aSelectOptionPropertyNames = oPageSV.getSelectOptionsPropertyNames();
				aSelectOptionPropertyNames.forEach(function(sPropertyName) {
					if (!oSelectionVariant.getSelectOption(sPropertyName)) {
						oSelectionVariant.massAddSelectOption(sPropertyName, oPageSV.getSelectOption(sPropertyName));
					} else {
						// Only when there is no conflict do we need to add something
						// in all other case the conflicted paths are already added in prepareContextForExternalNavigation
						// if property was without conflict in incoming context then add path from incoming context to SV
						// TO-DO. Remove the check for oPropertiesWithoutConflict once semantic links functionality is covered
						if (oPropertiesWithoutConflict && sPropertyName in oPropertiesWithoutConflict) {
							oSelectionVariant.massAddSelectOption(
								oPropertiesWithoutConflict[sPropertyName],
								oSelectionVariant.getSelectOption(sPropertyName)
							);
						}
						// if property was without conflict in page context then add path from page context to SV
						if (sPropertyName in oPagePropertiesWithoutConflict) {
							oSelectionVariant.massAddSelectOption(
								oPagePropertiesWithoutConflict[sPropertyName],
								oPageSV.getSelectOption(sPropertyName)
							);
						}
					}
				});
				// remove non public properties from targetInfo
				delete oTargetInfo.propertiesWithoutConflict;
			}
			oInternalModelContext.setProperty("externalNavigationContext", { "page": true });
		}
	};
});
