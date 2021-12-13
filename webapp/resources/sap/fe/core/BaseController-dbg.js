/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/mvc/Controller", "sap/fe/core/CommonUtils"], function(Controller, CommonUtils) {
	"use strict";

	/**
	 * @class Internal base controller class for SAP Fiori elements application.
	 *
	 * If you want to extend a base controller for your custom page, please use for sap.fe.core.PageController.
	 *
	 * @hideconstructor
	 * @public
	 * @name sap.fe.core.BaseController
	 * @since 1.90.0
	 */
	return Controller.extend("sap.fe.core.BaseController", {
		/**
		 * Returns the current app component.
		 *
		 * @returns {sap.fe.core.AppComponent} The app component or, if not found, null
		 * @alias sap.fe.core.BaseController#getAppComponent
		 * @public
		 * @since 1.91.0
		 */
		getAppComponent: function() {
			if (!this._oAppComponent) {
				this._oAppComponent = CommonUtils.getAppComponent(this.getView());
			}
			return this._oAppComponent;
		},

		/**
		 * Convenience method provided by SAP Fiori elements to enable applications to include the view model by name into each controller.
		 * @public
		 * @param {string} sName The model name
		 * @returns {sap.ui.model.Model} The model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel The model instance
		 * @param {string} sName The model name
		 * @returns {sap.ui.mvc.View} The view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getResourceBundle: function(sI18nModelName) {
			if (!sI18nModelName) {
				sI18nModelName = "i18n";
			}
			return this.getAppComponent()
				.getModel(sI18nModelName)
				.getResourceBundle();
		}
	});
});
