/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"sap/ui/core/mvc/ControllerExtension",
		"sap/base/util/UriParameters",
		"sap/base/util/ObjectPath",
		"sap/ui/core/Placeholder",
		"sap/fe/placeholder/library" // library dependency
	],
	function(ControllerExtension, UriParameters, ObjectPath, Placeholder) {
		"use strict";

		/**
		 * {@link sap.ui.core.mvc.ControllerExtension Controller extension} for Placeholder
		 *
		 * @namespace
		 * @alias sap.fe.core.controllerextensions.Placeholder
		 *
		 **/
		var Extension = ControllerExtension.extend("sap.fe.core.controllerextensions.Placeholder", {
			attachHideCallback: function() {
				if (this.isPlaceholderEnabled()) {
					var oView = this.base.getView();
					var oPage = oView.getParent().oContainer;
					var oNavContainer = oPage.getParent();

					var _fnContainerDelegate = {
						onAfterShow: function(oEvent) {
							if (oEvent.isBackToPage) {
								oNavContainer.hidePlaceholder();
							} else if (
								UriParameters.fromQuery(window.location.hash.replace(/#.*\?/, "")).get("restoreHistory") === "true"
							) {
								// in case we navigate to the listreport using the shell
								oNavContainer.hidePlaceholder();
							}
						}
					};
					oPage.addEventDelegate(_fnContainerDelegate);

					var oPageReady = oView.getController().pageReady;
					//In case of objectPage, the placeholder should be hidden when heroes requests are received
					// But for some scenario like "Create item", heroes requests are not sent .
					// The pageReady event is then used as fallback

					var aAttachEvents = ["pageReady"];
					if (oView.getControllerName() === "sap.fe.templates.ObjectPage.ObjectPageController") {
						aAttachEvents.push("heroesBatchReceived");
					}
					aAttachEvents.forEach(function(sEvent) {
						oPageReady.attachEvent(
							sEvent,
							null,
							function() {
								oNavContainer.hidePlaceholder();
							},
							null
						);
					});
				}
			},
			attachRouteMatchers: function() {
				this._init();
			},

			_init: function() {
				this.oAppComponent = this.base.getAppComponent();
				this.oRouting = this.oAppComponent._oRouting;
				this.oRootContainer = this.oAppComponent.getRootContainer();
				this.oRouter = this.oAppComponent.getRouter();
				this.oPlaceholders = {};

				// eslint-disable-next-line no-constant-condition
				if (this.isPlaceholderEnabled()) {
					Placeholder.registerProvider(function(oConfig) {
						switch (oConfig.name) {
							case "sap.fe.templates.ListReport":
								return {
									html: "sap/fe/placeholder/view/PlaceholderLR.fragment.html",
									autoClose: false
								};
							case "sap.fe.templates.ObjectPage":
								return {
									html: "sap/fe/placeholder/view/PlaceholderOP.fragment.html",
									autoClose: false
								};
							default:
								return;
						}
					});
				}
				if (this.isPlaceholderDebugEnabled()) {
					this.initPlaceholderDebug();
				}
			},

			initPlaceholderDebug: function() {
				this.resetPlaceholderDebugStats();
				var that = this;
				var handler = {
					apply: function(target, thisArg, argumentsList) {
						if (that.oRootContainer._placeholder && that.oRootContainer._placeholder.placeholder) {
							that.debugStats.iHidePlaceholderTimestamp = Date.now();
						}
						return target.bind(that.oRootContainer)();
					}
				};
				// eslint-disable-next-line no-undef
				var proxy1 = new Proxy(this.oRootContainer.hidePlaceholder, handler);
				this.oRootContainer.hidePlaceholder = proxy1;
			},
			isPlaceholderDebugEnabled: function() {
				if (UriParameters.fromQuery(window.location.search).get("sap-ui-xx-placeholder-debug") === "true") {
					return true;
				}
				return false;
			},

			resetPlaceholderDebugStats: function() {
				this.debugStats = {
					iHidePlaceholderTimestamp: 0,
					iPageReadyEventTimestamp: 0,
					iHeroesBatchReceivedEventTimestamp: 0
				};
			},

			getPlaceholderDebugStats: function() {
				return this.debugStats;
			},

			isPlaceholderEnabled: function() {
				var bPlaceholderEnabledInFLP = ObjectPath.get("sap-ushell-config.apps.placeholder.enabled");
				if (bPlaceholderEnabledInFLP === false) {
					return false;
				}

				return sap.ui
					.getCore()
					.getConfiguration()
					.getPlaceholder();
			}
		});
		return Extension;
	}
);
