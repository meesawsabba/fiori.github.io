/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/m/QuickViewPage", "sap/m/Button", "sap/fe/core/CommonUtils", "sap/fe/macros/DelegateUtil"], function(
	QuickViewPage,
	Button,
	CommonUtils,
	DelegateUtil
) {
	"use strict";

	return QuickViewPage.extend("sap.fe.core.controls.CustomQuickViewPage", {
		metadata: {
			defaultAggregation: "groups",
			aggregations: {
				customContent: {
					type: "sap.ui.core.Control",
					multiple: true,
					bindable: "bindable"
				},
				groups: { type: "sap.m.QuickViewGroup", multiple: true, singularName: "group", bindable: "bindable" }
			},
			publicMethods: []
		},
		renderer: {},
		onAfterRendering: function() {
			QuickViewPage.prototype.onAfterRendering.apply(this, arguments);
		},
		onBeforeRendering: function() {
			if (
				this.getParent() &&
				this.getParent().isA("sap.fe.core.controls.ConditionalWrapper") &&
				this.getParent().getProperty("condition") === true
			) {
				this.setCrossAppNavCallback(
					function() {
						var sQuickViewPageTitleLinkHref = DelegateUtil.getCustomData(this, "titleLink");
						var oView = sap.ui.fl.Utils.getViewForControl(this);
						var oAppComponent = CommonUtils.getAppComponent(oView);
						var oShellServiceHelper = oAppComponent.getShellServices();
						var oShellHash = oShellServiceHelper.parseShellHash(sQuickViewPageTitleLinkHref);
						var oNavArgs = {
							target: {
								semanticObject: oShellHash.semanticObject,
								action: oShellHash.action
							},
							params: oShellHash.params
						};
						var sQuickViewPageTitleLinkIntent = oNavArgs.target.semanticObject + "-" + oNavArgs.target.action;

						if (
							sQuickViewPageTitleLinkIntent &&
							this.oCrossAppNavigator &&
							this.oCrossAppNavigator.isNavigationSupported([sQuickViewPageTitleLinkIntent])
						) {
							if (sQuickViewPageTitleLinkIntent && sQuickViewPageTitleLinkIntent !== "") {
								if (typeof sQuickViewPageTitleLinkIntent === "string" && sQuickViewPageTitleLinkIntent !== "") {
									var sTargetHref;
									var oLinkControl = this.getParent();
									while (oLinkControl && !oLinkControl.isA("sap.ui.mdc.Link")) {
										oLinkControl = oLinkControl.getParent();
									}
									var _aLinks = oLinkControl.getModel("$sapuimdcLink").getProperty("/linkItems");
									if (_aLinks) {
										if (_aLinks.length > 0) {
											for (var i = 0; i < _aLinks.length; i++) {
												if (_aLinks[i].key === sQuickViewPageTitleLinkIntent) {
													sTargetHref = _aLinks[i].href;
													break;
												}
											}
											if (sTargetHref) {
												oShellHash = oShellServiceHelper.parseShellHash(sTargetHref);
											} else {
												oShellHash = oShellServiceHelper.parseShellHash(sQuickViewPageTitleLinkIntent);
											}
										}
									} else {
										oShellHash = oShellServiceHelper.parseShellHash(sQuickViewPageTitleLinkIntent);
									}
									CommonUtils.storeControlRefreshStrategyForHash(oView, oShellHash);
									return {
										target: {
											semanticObject: oShellHash.semanticObject,
											action: oShellHash.action
										},
										params: oShellHash.params
									};
								}
							}
						} else {
							var oCurrentShellHash = oShellServiceHelper.parseShellHash(window.location.hash);
							CommonUtils.storeControlRefreshStrategyForHash(oView, oCurrentShellHash);

							return {
								target: {
									semanticObject: oCurrentShellHash.semanticObject,
									action: oCurrentShellHash.action,
									appSpecificRoute: oCurrentShellHash.appSpecificRoute
								},
								params: oCurrentShellHash.params
							};
						}
					}.bind(this)
				);
			}
			QuickViewPage.prototype.onBeforeRendering.apply(this, arguments);
			var oPageContent = this.getPageContent();
			var oForm = oPageContent.form;
			if (oForm) {
				var _aContent = this.getAggregation("customContent");
				if (_aContent && _aContent.length > 0) {
					_aContent.forEach(
						function(_oContent) {
							var _oContentClone = _oContent.clone();
							_oContentClone.setModel(this.getModel());
							_oContentClone.setBindingContext(this.getBindingContext());
							oForm.addContent(_oContentClone);
						}.bind(this)
					);
					setTimeout(function() {
						oForm.rerender();
					}, 0);
				}
			}
		}
	});
});
