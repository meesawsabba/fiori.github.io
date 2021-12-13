/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/fe/core/BaseController",
		"sap/fe/core/ExtensionAPI",
		"sap/fe/core/controllerextensions/InternalRouting",
		"sap/fe/core/controllerextensions/Routing",
		"sap/fe/core/controllerextensions/EditFlow",
		"sap/fe/core/controllerextensions/InternalEditFlow",
		"sap/fe/core/controllerextensions/PageReady",
		"sap/fe/core/controllerextensions/MessageHandler",
		"sap/fe/core/controllerextensions/IntentBasedNavigation",
		"sap/fe/core/controllerextensions/InternalIntentBasedNavigation",
		"sap/fe/core/controllerextensions/Share",
		"sap/fe/core/controllerextensions/ViewState",
		"sap/fe/core/controllerextensions/Paginator",
		"sap/fe/core/controllerextensions/Placeholder"
	],
	function(
		Controller,
		ExtensionAPI,
		InternalRouting,
		Routing,
		EditFlow,
		InternalEditFlow,
		PageReady,
		MessageHandler,
		IntentBasedNavigation,
		InternalIntentBasedNavigation,
		Share,
		ViewState,
		Paginator,
		Placeholder
	) {
		"use strict";

		/**
		 * @class Base controller class for your custom page used inside an SAP Fiori elements application.
		 *
		 * This controller provides preconfigured extensions that will ensure you have the basic functionalities required to use the building blocks.
		 *
		 * @hideconstructor
		 * @public
		 * @name sap.fe.core.PageController
		 * @since 1.88.0
		 */
		return Controller.extend("sap.fe.core.PageController", {
			routing: Routing,
			_routing: InternalRouting,
			editFlow: EditFlow,
			_editFlow: InternalEditFlow,
			intentBasedNavigation: IntentBasedNavigation,
			_intentBasedNavigation: InternalIntentBasedNavigation,
			pageReady: PageReady,
			messageHandler: MessageHandler,
			share: Share,
			paginator: Paginator,
			viewState: ViewState,
			placeholder: Placeholder,
			/**
			 * @private
			 * @name sap.fe.core.PageController.getMetadata
			 * @function
			 */
			/**
			 * @private
			 * @name sap.fe.core.PageController.extend
			 * @function
			 */

			onInit: function() {
				var oUIModel = this.getAppComponent().getModel("ui"),
					oInternalModel = this.getAppComponent().getModel("internal"),
					sPath = "/pages/" + this.getView().getId();

				oUIModel.setProperty(sPath, {
					controls: {}
				});
				oInternalModel.setProperty(sPath, {
					controls: {}
				});
				this.getView().bindElement({
					path: sPath,
					model: "ui"
				});
				this.getView().bindElement({
					path: sPath,
					model: "internal"
				});

				// for the time being provide it also pageInternal as some macros access it - to be removed
				this.getView().bindElement({
					path: sPath,
					model: "pageInternal"
				});
				this.getView().setModel(oInternalModel, "pageInternal");

				// as the model propagation happens after init but we actually want to access the binding context in the
				// init phase already setting the model here
				this.getView().setModel(oUIModel, "ui");
				this.getView().setModel(oInternalModel, "internal");
			},

			onBeforeRendering: function() {
				if (this.placeholder.attachHideCallback) {
					this.placeholder.attachHideCallback();
				}
			},
			getExtensionAPI: function() {
				if (!this.extensionAPI) {
					this.extensionAPI = new ExtensionAPI(this);
				}
				return this.extensionAPI;
			},

			onPageReady: function(mParameters) {
				// Apply app state only after the page is ready with the first section selected
				this.getAppComponent()
					.getAppStateHandler()
					.applyAppState();
			}
		});
	}
);
