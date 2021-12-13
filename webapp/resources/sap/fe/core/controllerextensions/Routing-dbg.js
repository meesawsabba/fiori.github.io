/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/mvc/ControllerExtension", "sap/ui/core/mvc/OverrideExecution"], function(
	ControllerExtension,
	OverrideExecution
) {
	"use strict";

	/**
	 * @class A controller extension offering hooks into the routing flow of the application
	 *
	 * @name sap.fe.core.controllerextensions.Routing
	 * @hideconstructor
	 * @public
	 * @since 1.86.0
	 */
	return ControllerExtension.extend("sap.fe.core.controllerextensions.Routing", {
		metadata: {
			methods: {
				"onBeforeNavigation": { "public": true, "final": false, overrideExecution: OverrideExecution.After },
				"navigate": { "public": true, "final": true },
				"onBeforeBinding": { "public": true, "final": false, overrideExecution: OverrideExecution.After },
				"onAfterBinding": { "public": true, "final": false, overrideExecution: OverrideExecution.After }
			}
		},

		/**
		 * @private
		 * @name sap.fe.core.controllerextensions.Routing.getMetadata
		 * @function
		 */
		/**
		 * @private
		 * @name sap.fe.core.controllerextensions.Routing.extend
		 * @function
		 */

		/**
		 * This function can be used to intercept the routing event happening during the normal process of navigating from one page to another.
		 *
		 * If declared as an extension, it allows you to intercept and change the normal navigation flow.
		 * If you decide to do your own navigation processing, you can return `true` to prevent the default routing behavior.
		 *
		 * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
		 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
		 *
		 * @param {object} mNavigationParameters Object containing row context and page context
		 * @param {sap.ui.model.odata.v4.Context} mNavigationParameters.bindingContext The currently selected context
		 * @returns {boolean} `true` to prevent the default execution, false to keep the standard behavior
		 * @alias sap.fe.core.controllerextensions.Routing#onBeforeNavigation
		 * @public
		 * @since 1.86.0
		 */
		onBeforeNavigation: function(mNavigationParameters) {
			// to be overriden by the application
			return false;
		},

		/**
		 * Allows navigation to a specific context.
		 *
		 * @param {sap.ui.model.odata.v4.Context} oContext Object containing the context to be navigated
		 * @alias sap.fe.core.controllerextensions.Routing#navigate
		 * @public
		 * @since 1.90.0
		 */
		navigate: function(oContext) {
			this.base._routing.navigateToContext(oContext);
		},

		/**
		 * This function is used to intercept the routing event before binding a page.
		 *
		 * If it is declared as an extension, it allows you to intercept and change the normal flow of binding.
		 *
		 * This function is not called directly, but overridden separately by consuming controllers.
		 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
		 *
		 * @param {object} oContext Object containing the context for the navigation
		 * @alias sap.fe.core.controllerextensions.Routing#onBeforeBinding
		 * @public
		 * @since 1.90.0
		 */
		onBeforeBinding: function(oContext) {
			// to be overriden by the application
		},

		/**
		 * This function is used to intercept the routing event after binding a page.
		 *
		 * If it is declared as an extension, it allows you to intercept and change the normal flow of binding.
		 *
		 * This function is not called directly, but overridden separately by consuming controllers.
		 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.After}.
		 *
		 * @param {object} oContext Object containing the context to be navigated
		 * @alias sap.fe.core.controllerextensions.Routing#onAfterBinding
		 * @public
		 * @since 1.90.0
		 */

		onAfterBinding: function(oContext) {
			// to be overriden by the application
		}
	});
});
