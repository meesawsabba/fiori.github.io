/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

// Provides control sap.fe.core.controls.filterbar.VisualFilter.
sap.ui.define(
	[
		"sap/m/VBox",
		"sap/m/VBoxRenderer",
		"sap/fe/macros/CommonHelper",
		"sap/fe/core/helpers/StableIdHelper",
		"sap/fe/core/controls/filterbar/utils/VisualFilterUtils",
		"sap/fe/core/templating/FilterHelper",
		"sap/fe/macros/filter/FilterUtils"
	],
	function(VBox, VBoxRenderer, CommonHelper, StableIdHelper, VisualFilterUtils, FilterHelper, FilterUtils) {
		"use strict";

		/**
		 * Constructor for a new filterBar/aligned/FilterItemLayout.
		 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
		 * @param {object} [mSettings] Initial settings for the new control
		 * @class Represents a filter item on the UI.
		 * @extends sap.m.VBox
		 * @implements {sap.ui.core.IFormContent}
		 * @class
		 * @private
		 * @since 1.61.0
		 * @alias control sap.fe.core.controls.filterbar.VisualFilter
		 */
		var VisualFilter = VBox.extend(
			"sap.fe.core.controls.filterbar.VisualFilter",
			/** @lends sap.ui.mdc.filterbar.aligned.FilterItemLayout.prototype */ {
				renderer: {
					apiVersion: 2,
					render: VBoxRenderer.render
				},
				metadata: {
					properties: {
						showValueHelp: {
							type: "boolean"
						},
						valueHelpIconSrc: {
							type: "string"
						}
					},
					events: {
						valueHelpRequest: {}
					},
					interfaces: ["sap.ui.core.IFormContent"]
				}
			}
		);

		VisualFilter.prototype.onAfterRendering = function() {
			var oInteractiveChart = this.getItems()[1].getItems()[0];
			var sInternalContextPath = this.data("infoPath");
			var oInteractiveChartListBinding =
				oInteractiveChart.getBinding("segments") || oInteractiveChart.getBinding("bars") || oInteractiveChart.getBinding("points");
			var oInternalModelContext = oInteractiveChart.getBindingContext("internal");
			var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.macros");
			var bShowOverLayInitially = oInteractiveChart.data("showOverlayInitially");
			var oSelectionVariantAnnotation = oInteractiveChart.data("selectionVariantAnnotation")
				? CommonHelper.parseCustomData(oInteractiveChart.data("selectionVariantAnnotation"))
				: { SelectOptions: [] };
			var aRequiredProperties = oInteractiveChart.data("requiredProperties")
				? CommonHelper.parseCustomData(oInteractiveChart.data("requiredProperties"))
				: [];
			var oMetaModel = oInteractiveChart.getModel().getMetaModel();
			var sEntitySetPath = oInteractiveChartListBinding ? oInteractiveChartListBinding.getPath() : "";
			var oFilterBar = this.getParent().getParent();
			// TODO: Remove this part once 2170204347 is fixed
			if (oFilterBar.getMetadata().getElementName() === "sap.ui.mdc.filterbar.p13n.AdaptationFilterBar") {
				oFilterBar = oFilterBar.getParent().getParent();
			}
			var oFilterBarConditions = {};
			var aPropertyInfoSet = [];
			var sFilterEntityName;
			if (oFilterBar.getMetadata().getElementName() === "sap.fe.core.controls.FilterBar") {
				oFilterBarConditions = oFilterBar.getConditions();
				aPropertyInfoSet = oFilterBar.getPropertyInfoSet();
				sFilterEntityName = oFilterBar.data("entityType").split("/")[1];
			}
			var aParameters = oInteractiveChart.data("parameters") ? oInteractiveChart.data("parameters").customData : [];
			var entityTypeProperties = oMetaModel.getObject(sEntitySetPath + "/");
			var filterConditions = FilterHelper.getFiltersConditionsFromSelectionVariant(
				entityTypeProperties,
				oSelectionVariantAnnotation,
				VisualFilterUtils.getCustomConditions.bind(VisualFilterUtils)
			);
			var oSelectionVariantConditions = VisualFilterUtils.convertFilterCondions(filterConditions);
			var mConditions = {};

			Object.keys(oFilterBarConditions).forEach(function(sKey) {
				if (oFilterBarConditions[sKey].length) {
					mConditions[sKey] = oFilterBarConditions[sKey];
				}
			});

			Object.keys(oSelectionVariantConditions).forEach(function(sKey) {
				if (!mConditions[sKey]) {
					mConditions[sKey] = oSelectionVariantConditions[sKey];
				}
			});
			if (bShowOverLayInitially === "true") {
				if (!Object.keys(oSelectionVariantAnnotation).length) {
					if (aRequiredProperties.length > 1) {
						oInternalModelContext.setProperty(sInternalContextPath, {
							"showError": true,
							"errorMessageTitle": oResourceBundle.getText("M_VISUAL_FILTERS_ERROR_MESSAGE_TITLE"),
							"errorMessage": oResourceBundle.getText("M_VISUAL_FILTERS_PROVIDE_FILTER_VAL_MULTIPLEVF")
						});
					} else {
						var sLabel =
							oMetaModel.getObject(sEntitySetPath + "/" + aRequiredProperties[0] + "@com.sap.vocabularies.Common.v1.Label") ||
							aRequiredProperties[0];
						oInternalModelContext.setProperty(sInternalContextPath, {
							"showError": true,
							"errorMessageTitle": oResourceBundle.getText("M_VISUAL_FILTERS_ERROR_MESSAGE_TITLE"),
							"errorMessage": oResourceBundle.getText("M_VISUAL_FILTERS_PROVIDE_FILTER_VAL_SINGLEVF", sLabel)
						});
					}
				} else {
					var aSelectOptions = [];
					var aNotMatchedConditions = [];
					if (oSelectionVariantAnnotation.SelectOptions) {
						oSelectionVariantAnnotation.SelectOptions.forEach(function(oSelectOption) {
							aSelectOptions.push(oSelectOption.PropertyName.$PropertyPath);
						});
					}
					if (oSelectionVariantAnnotation.Parameters) {
						oSelectionVariantAnnotation.Parameters.forEach(function(oParameter) {
							aSelectOptions.push(oParameter.PropertyName.$PropertyPath);
						});
					}
					aRequiredProperties.forEach(function(sPath) {
						if (aSelectOptions.indexOf(sPath) === -1) {
							aNotMatchedConditions.push(sPath);
						}
					});
					if (aNotMatchedConditions.length > 1) {
						oInternalModelContext.setProperty(sInternalContextPath, {
							"showError": true,
							"errorMessageTitle": oResourceBundle.getText("M_VISUAL_FILTERS_ERROR_MESSAGE_TITLE"),
							"errorMessage": oResourceBundle.getText("M_VISUAL_FILTERS_PROVIDE_FILTER_VAL_MULTIPLEVF")
						});
					} else {
						var sLabel =
							oMetaModel.getObject(
								sEntitySetPath + "/" + aNotMatchedConditions[0] + "@com.sap.vocabularies.Common.v1.Label"
							) || aNotMatchedConditions[0];
						oInternalModelContext.setProperty(sInternalContextPath, {
							"showError": true,
							"errorMessageTitle": oResourceBundle.getText("M_VISUAL_FILTERS_ERROR_MESSAGE_TITLE"),
							"errorMessage": oResourceBundle.getText("M_VISUAL_FILTERS_PROVIDE_FILTER_VAL_SINGLEVF", sLabel)
						});
					}
					aNotMatchedConditions.length > 1
						? oInternalModelContext.setProperty(sInternalContextPath, {
								"showError": true,
								"errorMessageTitle": oResourceBundle.getText("M_VISUAL_FILTERS_ERROR_MESSAGE_TITLE"),
								"errorMessage": oResourceBundle.getText("M_VISUAL_FILTERS_PROVIDE_FILTER_VAL_MULTIPLEVF")
						  })
						: oInternalModelContext.setProperty(sInternalContextPath, {
								"showError": true,
								"errorMessageTitle": oResourceBundle.getText("M_VISUAL_FILTERS_ERROR_MESSAGE_TITLE"),
								"errorMessage": oResourceBundle.getText(
									"M_VISUAL_FILTERS_PROVIDE_FILTER_VAL_SINGLEVF",
									aNotMatchedConditions[0]
								)
						  });
				}
			}

			if (!this._oChartBinding || this._oChartBinding !== oInteractiveChartListBinding) {
				if (this._oChartBinding) {
					this.detachDataRecivedHandler(this._oChartBinding);
				}
				this.attachDataRecivedHandler(oInteractiveChartListBinding);
				this._oChartBinding = oInteractiveChartListBinding;
			}
			var bShowOverlay =
				oInternalModelContext.getProperty(sInternalContextPath) &&
				oInternalModelContext.getProperty(sInternalContextPath).showError;
			var sChartEntityName = sEntitySetPath !== "" ? sEntitySetPath.split("/")[1].split("(")[0] : "";
			if (aParameters && aParameters.length && sFilterEntityName === sChartEntityName) {
				var sBindingPath = FilterUtils.getBindingPathForParameters(oFilterBar, mConditions, aPropertyInfoSet, aParameters);
				if (sBindingPath) {
					oInteractiveChartListBinding.sPath = sBindingPath;
				}
			}
			// resume binding for only those visual filters that do not have a in parameter attached.
			// Bindings of visual filters with inParameters will be resumed later after considering in parameters.
			if (oInteractiveChartListBinding && oInteractiveChartListBinding.isSuspended() && !bShowOverlay) {
				oInteractiveChartListBinding.resume();
			}
		};

		VisualFilter.prototype.attachDataRecivedHandler = function(oInteractiveChartListBinding) {
			if (oInteractiveChartListBinding) {
				oInteractiveChartListBinding.attachEvent("dataReceived", this.onInternalDataReceived, this);
				this._oChartBinding = oInteractiveChartListBinding;
			}
		};

		VisualFilter.prototype.detachDataRecivedHandler = function(oInteractiveChartListBinding) {
			if (oInteractiveChartListBinding) {
				oInteractiveChartListBinding.detachEvent("dataReceived", this.onInternalDataReceived, this);
				this._oChartBinding = null;
			}
		};

		VisualFilter.prototype.setShowValueHelp = function(bShowValueHelp) {
			if (this.getItems().length > 0) {
				var oVisualFilterControl = this.getItems()[0].getItems()[0];
				oVisualFilterControl.getContent().some(function(oInnerControl) {
					if (oInnerControl.isA("sap.m.Button")) {
						oInnerControl.setVisible(bShowValueHelp);
					}
				});
				this.setProperty("showValueHelp", bShowValueHelp);
			}
		};

		VisualFilter.prototype.setValueHelpIconSrc = function(sIconSrc) {
			if (this.getItems().length > 0) {
				var oVisualFilterControl = this.getItems()[0].getItems()[0];
				oVisualFilterControl.getContent().some(function(oInnerControl) {
					if (oInnerControl.isA("sap.m.Button")) {
						oInnerControl.setIcon(sIconSrc);
					}
				});
				this.setProperty("valueHelpIconSrc", sIconSrc);
			}
		};

		VisualFilter.prototype.onInternalDataReceived = function(oEvent) {
			var sId = this.getId();
			var oView = sap.ui.fl.Utils.getViewForControl(this);
			var oInteractiveChart = this.getItems()[1].getItems()[0];
			var sInternalContextPath = this.data("infoPath");
			var oInternalModelContext = oInteractiveChart.getBindingContext("internal");
			var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.macros");
			var vUOM = oInteractiveChart.data("uom");
			VisualFilterUtils.updateChartScaleFactorTitle(oInteractiveChart, oView, sId, sInternalContextPath);
			if (oEvent.getParameter("error")) {
				var s18nMessageTitle = oResourceBundle.getText("M_VISUAL_FILTERS_ERROR_MESSAGE_TITLE");
				var s18nMessage = oResourceBundle.getText("M_VISUAL_FILTERS_ERROR_DATA_TEXT");
				VisualFilterUtils.applyErrorMessageAndTitle(s18nMessageTitle, s18nMessage, sInternalContextPath, oView);
			} else if (oEvent.getParameter("data")) {
				var oData = oEvent.getSource().getCurrentContexts();
				if (oData && oData.length === 0) {
					VisualFilterUtils.setNoDataMessage(sInternalContextPath, oResourceBundle, oView);
				} else {
					oInternalModelContext.setProperty(sInternalContextPath, {});
				}
				VisualFilterUtils.setMultiUOMMessage(oData, oInteractiveChart, sInternalContextPath, oResourceBundle, oView);
			}
			if (vUOM && ((vUOM["ISOCurrency"] && vUOM["ISOCurrency"].$Path) || (vUOM["Unit"] && vUOM["Unit"].$Path))) {
				var oContexts = oEvent.getSource().getContexts();
				var oContextData = oContexts && oContexts[0].getObject();
				VisualFilterUtils.applyUOMToTitle(oInteractiveChart, oContextData, oView, sInternalContextPath);
			}
		};
		return VisualFilter;
	}
);
