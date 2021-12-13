/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/core/CommonUtils", "sap/base/util/ObjectPath"], function(CommonUtils, ObjectPath) {
	"use strict";
	var FPMHelper = {
		actionWrapper: function(oEvent, sModule, sMethod, oParameters) {
			return new Promise(function(resolve) {
				var oSource = oEvent.getSource ? oEvent.getSource() : oEvent.oSource,
					oView = CommonUtils.getTargetView(oSource),
					oBindingContext = oSource.getBindingContext(),
					oExtensionAPI,
					aSelectedContexts;

				if (oParameters !== undefined) {
					aSelectedContexts = oParameters.contexts || [];
				} else if (oBindingContext !== undefined) {
					aSelectedContexts = [oBindingContext];
				} else {
					aSelectedContexts = [];
				}

				if (
					oView.getControllerName() === "sap.fe.templates.ObjectPage.ObjectPageController" ||
					oView.getControllerName() === "sap.fe.templates.ListReport.ListReportController"
				) {
					oExtensionAPI = oView.getController().getExtensionAPI();
				}

				if (sModule.startsWith("/extension/")) {
					var fnTarget = ObjectPath.get(sModule.replace(/\//g, ".").substr(1), oExtensionAPI);
					resolve(fnTarget[sMethod](oBindingContext, aSelectedContexts));
				} else {
					sap.ui.require([sModule], function(module) {
						// - we bind the action to the extensionAPI of the controller so it has the same scope as a custom section
						// - we provide the context as API, maybe if needed further properties
						resolve(module[sMethod].bind(oExtensionAPI)(oBindingContext, aSelectedContexts));
					});
				}
			});
		},
		validationWrapper: function(sModule, sMethod, oValidationContexts, oView, oBindingContext) {
			return new Promise(function(resolve) {
				var oExtensionAPI;

				if (
					oView.getControllerName() === "sap.fe.templates.ObjectPage.ObjectPageController" ||
					oView.getControllerName() === "sap.fe.templates.ListReport.ListReportController"
				) {
					oExtensionAPI = oView.getController().getExtensionAPI();
				}

				sap.ui.require([sModule], function(module) {
					// - we bind the action to the extensionAPI of the controller so it has the same scope as a custom section
					// - we provide the context as API, maybe if needed further properties
					resolve(module[sMethod].bind(oExtensionAPI)(oBindingContext, oValidationContexts));
				});
			});
		}
	};
	return FPMHelper;
});
