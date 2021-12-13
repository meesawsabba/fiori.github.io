/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/ui/model/json/JSONModel",
		"./RootContainerBaseController",
		"sap/fe/core/CommonUtils",
		"sap/fe/core/controllerextensions/ViewState",
		"sap/m/Link",
		"sap/m/MessagePage",
		"sap/m/MessageBox"
	],
	function(JSONModel, BaseController, CommonUtils, ViewState, Link, MessagePage, MessageBox) {
		"use strict";

		/**
		 * @class Application developers should use this controller for the sap.fe.templates.RootContainer.NavContainer.Fcl view.
		 *
		 * This controller and its associated view provide the entry point for your application when using the classic full page layout in SAP Fiori elements.
		 * When used, you should declare a sap.m.routing.Router as `router` in your application manifest.
		 *
		 * @hideconstructor
		 * @public
		 * @name sap.fe.templates.RootContainer.controller.NavContainer
		 */
		return BaseController.extend("sap.fe.templates.RootContainer.controller.NavContainer", {
			viewState: ViewState.override({
				applyInitialStateOnly: function() {
					return false;
				},
				adaptBindingRefreshControls: function(aControls) {
					var oView = this.getView(),
						oController = oView.getController();
					aControls.push(oController._getCurrentPage(oView));
				},
				adaptStateControls: function(aStateControls) {
					var oView = this.getView(),
						oController = oView.getController();
					aStateControls.push(oController._getCurrentPage(oView));
				},
				onRestore: function() {
					var oView = this.getView(),
						oNavContainer = oView.byId("appContent");
					var oInternalModel = oNavContainer.getModel("internal");
					var oPages = oInternalModel.getProperty("/pages");

					for (var sComponentId in oPages) {
						oInternalModel.setProperty("/pages/" + sComponentId + "/restoreStatus", "pending");
					}
				},
				onSuspend: function() {
					var oView = this.getView(),
						oNavContainer = oView.byId("appContent");
					var aPages = oNavContainer.getPages();
					aPages.forEach(function(oPage) {
						var oTargetView = CommonUtils.getTargetView(oPage);

						var oController = oTargetView && oTargetView.getController();
						if (oController && oController.viewState && oController.viewState.onSuspend) {
							return oController.viewState.onSuspend();
						}
					});
				}
			}),

			onContainerReady: function() {
				// Restore views if neccessary.
				var oView = this.getView(),
					oPagePromise = this._getCurrentPage(oView);

				return oPagePromise.then(function(oCurrentPage) {
					var oTargetView = CommonUtils.getTargetView(oCurrentPage);
					return CommonUtils.restoreView(oTargetView);
				});
			},

			_getCurrentPage: function(oView) {
				return new Promise(function(resolve) {
					var oNavContainer = oView.byId("appContent");
					var oCurrentPage = oNavContainer.getCurrentPage();
					if (
						oCurrentPage &&
						oCurrentPage.getController &&
						oCurrentPage.getController().isPlaceholder &&
						oCurrentPage.getController().isPlaceholder()
					) {
						oCurrentPage.getController().attachEventOnce("targetPageInsertedInContainer", function(oEvent) {
							var oTargetPage = oEvent.getParameter("targetpage");
							var oTargetView = CommonUtils.getTargetView(oTargetPage);
							resolve(oTargetView !== oView && oTargetView);
						});
					} else {
						var oTargetView = CommonUtils.getTargetView(oCurrentPage);
						resolve(oTargetView !== oView && oTargetView);
					}
				});
			},

			/**
			 * @private
			 * @name sap.fe.templates.RootContainer.controller.NavContainer.getMetadata
			 * @function
			 */

			_getNavContainer: function() {
				return this.getView().getContent()[0];
			},

			/**
			 * Check if the FCL component is enabled.
			 *
			 * @function
			 * @name sap.fe.templates.RootContainer.controller.NavContainer.controller#isFclEnabled
			 * @memberof sap.fe.templates.RootContainer.controller.NavContainer.controller
			 * @returns {boolean} `false` since we are not in FCL scenario
			 *
			 * @ui5-restricted
			 * @final
			 */
			isFclEnabled: function() {
				return false;
			},

			_scrollTablesToLastNavigatedItems: function() {},

			displayMessagePage: function(sErrorMessage, mParameters) {
				var oNavContainer = this._getNavContainer();

				if (!this.oMessagePage) {
					this.oMessagePage = new MessagePage({
						showHeader: false,
						icon: "sap-icon://message-error"
					});

					oNavContainer.addPage(this.oMessagePage);
				}

				this.oMessagePage.setText(sErrorMessage);

				if (mParameters.technicalMessage) {
					this.oMessagePage.setCustomDescription(
						new Link({
							text: mParameters.description || mParameters.technicalMessage,
							press: function() {
								MessageBox.show(mParameters.technicalMessage, {
									icon: MessageBox.Icon.ERROR,
									title: mParameters.title,
									actions: [MessageBox.Action.OK],
									defaultAction: MessageBox.Action.OK,
									details: mParameters.technicalDetails || "",
									contentWidth: "60%"
								});
							}
						})
					);
				} else {
					this.oMessagePage.setDescription(mParameters.description || "");
				}

				oNavContainer.to(this.oMessagePage.getId());
			}
		});
	},
	true
);
