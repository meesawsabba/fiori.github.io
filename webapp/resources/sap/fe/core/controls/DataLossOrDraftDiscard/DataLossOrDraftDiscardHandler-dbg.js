/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/base/Log",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/XMLTemplateProcessor",
		"sap/ui/core/util/XMLPreprocessor",
		"sap/ui/core/Fragment"
	],
	function(Log, JSONModel, XMLTemplateProcessor, XMLPreprocessor, Fragment) {
		"use strict";

		var DataLossOrDraftDiscardHandler = {};

		var fnOnDataLossConfirmed;
		var fnOnDataLossCancel;

		function fnDataLossConfirmation(onDataLossConfirmed, onDataLossCancel, oController, bSkipBindingToView) {
			var oDataLossPopup;
			fnOnDataLossConfirmed = onDataLossConfirmed;
			fnOnDataLossCancel = onDataLossCancel;
			var sFragmentname = "sap.fe.core.controls.DataLossOrDraftDiscard.DataLossDraft";
			var oView = oController.getView();
			var fragmentController = {
				onDataLossKeepDraft: function() {
					oDataLossPopup.close();
					fnOnDataLossConfirmed();
				},
				onDataLossDiscardDraft: function() {
					oDataLossPopup.close();
					DataLossOrDraftDiscardHandler.discardDraft(oController, bSkipBindingToView)
						.then(fnOnDataLossConfirmed)
						.catch(function(oError) {
							Log.error("Error while discarding draft", oError);
						});
				},
				onDataLossCancel: function() {
					oDataLossPopup.close();
					fnOnDataLossCancel();
				}
			};
			fragmentController.setDataLossPopup = function(oDataLossPopup) {
				oController.dataLossPopup = oDataLossPopup;
			};

			var oThis = new JSONModel({
					id: oView.getId()
				}),
				oPreprocessorSettings = {
					bindingContexts: {
						"this": oThis.createBindingContext("/")
					},
					models: {
						"this": oThis,
						"this.i18n": oView.getModel("sap.fe.i18n")
					}
				};
			var oPopoverFragment = XMLTemplateProcessor.loadTemplate(sFragmentname, "fragment");

			if (oController.dataLossPopup) {
				oDataLossPopup = oController.dataLossPopup;
				oDataLossPopup.open();
			} else {
				Promise.resolve(XMLPreprocessor.process(oPopoverFragment, { name: sFragmentname }, oPreprocessorSettings))
					.then(function(oFragment) {
						return Fragment.load({ definition: oFragment, controller: fragmentController });
					})
					.then(function(oPopup) {
						oDataLossPopup = oPopup;
						oView.addDependent(oDataLossPopup);
						var oModel = new JSONModel();
						oDataLossPopup.setModel(oModel, "dataLoss");
						var oi18nModel = oController.getView().getModel("sap.fe.i18n");
						oDataLossPopup.setModel(oi18nModel, "i18n");
						oDataLossPopup.open();
						fragmentController.setDataLossPopup(oDataLossPopup);
					})
					.catch(function(oError) {
						Log.error("Error while opening the Discard Dialog fragment", oError);
					});
			}
		}

		function fnPerformAfterDiscardorKeepDraftImpl(fnPositive, fnNegative, oController, bSkipBindingToView) {
			fnDataLossConfirmation(fnPositive, fnNegative, oController, bSkipBindingToView);
		}

		DataLossOrDraftDiscardHandler.performAfterDiscardorKeepDraft = function(
			fnProcessFunction,
			fnCancelFunction,
			oController,
			bSkipBindingToView
		) {
			var oRet = new Promise(function(resolve, reject) {
				var fnPositive = function(oContext) {
					var oRet = fnProcessFunction(oContext);
					resolve(oRet);
				};
				var fnNegative = function() {
					fnCancelFunction();
					reject();
				};
				fnPerformAfterDiscardorKeepDraftImpl(fnPositive, fnNegative, oController, bSkipBindingToView);
			});
			return oRet;
		};

		DataLossOrDraftDiscardHandler.discardDraft = function(oController, bSkipBindingToView) {
			var oParamsContext = oController.getView().getBindingContext();
			var mParams = {};
			mParams.bSkipDiscardPopover = true;
			mParams.bSkipBindingToView = bSkipBindingToView !== undefined ? bSkipBindingToView : true;
			return oController.editFlow.cancelDocument(oParamsContext, mParams);
		};

		return DataLossOrDraftDiscardHandler;
	}
);
