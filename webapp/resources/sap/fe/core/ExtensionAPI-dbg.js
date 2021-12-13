/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	["sap/ui/base/Object", "sap/fe/core/CommonUtils", "sap/base/Log", "sap/ui/core/Component", "sap/ui/model/json/JSONModel"],
	function(BaseObject, CommonUtils, Log, Component, JSONModel) {
		"use strict";

		/**
		 * @class Common Extension API for all pages of SAP Fiori elements for OData V4.
		 * @alias sap.fe.core.ExtensionAPI
		 * @public
		 * @hideconstructor
		 * @extends sap.ui.base.Object
		 * @since 1.79.0
		 */

		var extensionAPI = BaseObject.extend("sap.fe.core.ExtensionAPI", {
			metadata: {
				/**
				 * Properties.
				 */
				associations: {
					/**
					 * A controller extension offering hooks into the edit flow of the application.
					 * @public
					 */
					editFlow: {
						type: "sap.fe.core.controllerextensions.EditFlow",
						multiple: false
					},
					/**
					 * A controller extension offering hooks into the routing flow of the application.
					 * @public
					 */
					routing: {
						type: "sap.fe.core.controllerextensions.Routing",
						multiple: false
					}
				}
			},

			constructor: function(oController, sId) {
				this._controller = oController;
				this._view = oController.getView();
				this.extension = this._controller.extension;
				this.editFlow = this._controller.editFlow;
				this.routing = this._controller.routing;
				this._routing = this._controller._routing;
				this.intentBasedNavigation._controller = this._controller;
				this._prefix = sId;
			},
			destroy: function() {
				delete this._controller;
				delete this._view;
				delete this.editFlow._controller;
				delete this.intentBasedNavigation._controller;
			},

			/**
			 * @private
			 * @name sap.fe.core.ExtensionAPI.getMetadata
			 * @function
			 */
			/**
			 * @private
			 * @name sap.fe.core.ExtensionAPI.extend
			 * @function
			 */

			/**
			 * Access any control by ID.
			 *
			 * @alias sap.fe.core.ExtensionAPI#byId
			 * @param {string} sId ID of the control without the view prefix. Either the ID prefixed by SAP Fiori elements
			 * (for example with the section) or the control ID only. The latter works only for an extension running in
			 * the same context (like in the same section). You can use the prefix for SAP Fiori elements to also access other controls located in different sections.
			 * @returns {sap.ui.core.Control} The requested control, if found in the view.
			 *
			 * @private
			 */
			byId: function(sId) {
				var oControl = this._view.byId(sId);

				if (!oControl && this._prefix) {
					// give it a try with the prefix
					oControl = this._view.byId(this._prefix + "--" + sId);
				}

				if (oControl) {
					return oControl;
				}
			},

			/**
			 * Get access to models managed by SAP Fiori elements.<br>
			 * The following models can be accessed:
			 * <ul>
			 * <li>undefined: the undefined model returns the SAPUI5 OData V4 model bound to this page</li>
			 * <li>i18n / further data models defined in the manifest</li>
			 * <li>ui: returns a SAPUI5 JSON model containing UI information.
			 * Only the following properties are public and supported:
			 * 	<ul>
			 *     <li>editMode: contains either 'Editable' or 'Display'</li>
			 *  </ul>
			 * </li>
			 * </ul>.
			 *
			 * @alias sap.fe.core.ExtensionAPI#getModel
			 * @param {string} sModelName Name of the model
			 * @returns {sap.ui.model.Model} The required model
			 *
			 * @public
			 */
			getModel: function(sModelName) {
				var oAppComponent;

				if (sModelName && sModelName !== "ui") {
					oAppComponent = CommonUtils.getAppComponent(this._view);
					if (!oAppComponent.getManifestEntry("sap.ui5").models[sModelName]) {
						// don't allow access to our internal models
						return null;
					}
				}

				return this._view.getModel(sModelName);
			},

			/**
			 * Add any control as a dependent control to this SAP Fiori elements page.
			 *
			 * @alias sap.fe.core.ExtensionAPI#addDependent
			 * @param {sap.ui.core.Control} oControl Control to be added as a dependent control
			 *
			 * @public
			 */
			addDependent: function(oControl) {
				this._view.addDependent(oControl);
			},

			/**
			 * Remove a dependent control from this SAP Fiori elements page.
			 *
			 * @alias sap.fe.core.ExtensionAPI#removeDependent
			 * @param {sap.ui.core.Control} oControl Control to be added as a dependent control
			 *
			 * @public
			 */
			removeDependent: function(oControl) {
				this._view.removeDependent(oControl);
			},

			/**
			 * Navigate to another target.
			 *
			 * @alias sap.fe.core.ExtensionAPI#navigateToTarget
			 * @param {string} sTarget Name of the target route
			 * @param {sap.ui.model.Context} [oContext] Context instance
			 *
			 * @public
			 */
			navigateToTarget: function(sTarget, oContext) {
				this._controller._routing.navigateToTarget(oContext, sTarget);
			},

			/**
			 * Load a fragment and go through the template preprocessor with the current page context.
			 *
			 * @alias sap.fe.core.ExtensionAPI#loadFragment
			 * @param {object} mSettings The settings object
			 * @param {string} mSettings.id The ID of the fragment itself
			 * @param {string} mSettings.name The name of the fragment to be loaded
			 * @param {object} mSettings.controller The controller to be attached to the fragment
			 * @param {string} mSettings.contextPath The contextPath to be used for the templating process
			 * @param {sap.ui.model.Context} mSettings.initialBindingContext The initial binding context
			 * @returns {Promise<Element[]|sap.ui.core.Element[]>} The fragment definition
			 *
			 * @public
			 */
			loadFragment: function(mSettings) {
				var that = this;
				var oTemplateComponent = Component.getOwnerComponentFor(this._view);
				var oPageModel = this._view.getModel("_pageModel");
				var oMetaModel = this.getModel().getMetaModel();
				var mViewData = oTemplateComponent.getViewData();
				var oViewDataModel = new JSONModel(mViewData),
					oPreprocessorSettings = {
						bindingContexts: {
							"contextPath": oMetaModel.createBindingContext(
								mSettings.contextPath || "/" + oTemplateComponent.getEntitySet()
							),
							converterContext: oPageModel.createBindingContext("/", null, { noResolve: true }),
							viewData: mViewData ? oViewDataModel.createBindingContext("/") : null
						},
						models: {
							"contextPath": oMetaModel,
							converterContext: oPageModel,
							metaModel: oMetaModel,
							viewData: oViewDataModel
						},
						appComponent: CommonUtils.getAppComponent(this._view)
					};
				var oTemplatePromise = CommonUtils.templateControlFragment(mSettings.name, oPreprocessorSettings, {
					controller: mSettings.controller || this,
					isXML: false,
					id: mSettings.id
				});
				oTemplatePromise
					.then(function(oFragment) {
						if (mSettings.initialBindingContext !== undefined) {
							oFragment.setBindingContext(mSettings.initialBindingContext);
						}
						that.addDependent(oFragment);
					})
					.catch(function(oError) {
						Log.error(oError);
					});
				return oTemplatePromise;
			},

			/**
			 * Triggers an update of the app state.
			 * Should be called if the state of a control, or any other state-relevant information, was changed.
			 *
			 * @alias sap.fe.core.ExtensionAPI#updateAppState
			 * @returns {Promise} A promise that resolves with the new app state object.
			 *
			 * @public
			 */
			updateAppState: function() {
				return this._controller
					.getAppComponent()
					.getAppStateHandler()
					.createAppState();
			},

			/**
			 * ExtensionAPI for intent-based navigation
			 * @namespace sap.fe.core.ExtensionAPI.intentBasedNavigation
			 * @public
			 * @since 1.86.0
			 */
			intentBasedNavigation: {
				/**
				 * Navigates to an intent defined by an outbound definition in the manifest.
				 *
				 * @static
				 * @alias sap.fe.core.ExtensionAPI.intentBasedNavigation#navigateOutbound
				 * @param {string} sOutbound Identifier to locate the outbound definition in the manifest.
				 * This provides the semantic object and action for the intent-based navigation.
				 * Additionally, the outbound definition can be used to provide parameters for intent-based navigation.
				 * See {@link topic:be0cf40f61184b358b5faedaec98b2da Descriptor for Applications, Components, and Libraries} for more information.
				 * @param {object} mNavigationParameters Optional map containing key/value pairs to be passed to the intent.
				 * If mNavigationParameters are provided, the parameters provided in the outbound definition of the manifest are ignored.
				 * @public
				 */
				navigateOutbound: function(sOutbound, mNavigationParameters) {
					var oInternalModelContext = this._controller.getView().getBindingContext("internal");
					oInternalModelContext.setProperty("externalNavigationContext", { "page": false });
					this._controller._intentBasedNavigation.navigateOutbound(sOutbound, mNavigationParameters);
				}
			}
		});

		return extensionAPI;
	}
);
