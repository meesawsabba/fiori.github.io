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
	 * @class Controller extension providing hooks for intent-based navigation
	 *
	 * @name sap.fe.core.controllerextensions.IntentBasedNavigation
	 * @hideconstructor
	 * @public
	 * @since 1.86.0
	 */
	return ControllerExtension.extend("sap.fe.core.controllerextensions.IntentBasedNavigation", {
		metadata: {
			methods: {
				adaptNavigationContext: {
					"final": false,
					"public": true,
					overrideExecution: OverrideExecution.After
				}
			}
		},

		/**
		 * @private
		 * @name sap.fe.core.controllerextensions.IntentBasedNavigation.getMetadata
		 * @function
		 */
		/**
		 * @private
		 * @name sap.fe.core.controllerextensions.IntentBasedNavigation.extend
		 * @function
		 */
		/**
		 * Provides a hook to customize the {@link sap.fe.navigation.SelectionVariant} related to the intent-based navigation.
		 *
		 * @function
		 * @param {sap.fe.navigation.SelectionVariant} oSelectionVariant SelectionVariant provided by SAP Fiori elements.
		 * @param {object} oNavigationInfo Object containing intent-based navigation-related info
		 * @param {string} oNavigationInfo.semanticObject Semantic object related to the intent
		 * @param {string} oNavigationInfo.action Action related to the intent
		 * @alias sap.fe.core.controllerextensions.IntentBasedNavigation#adaptNavigationContext
		 * @public
		 * @since 1.86.0
		 */
		adaptNavigationContext: function(oSelectionVariant, oNavigationInfo) {
			// to be overriden by the application
		}
	});
});
