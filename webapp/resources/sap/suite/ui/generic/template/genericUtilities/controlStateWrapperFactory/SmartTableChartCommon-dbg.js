sap.ui.define([
	"sap/suite/ui/generic/template/genericUtilities/controlHelper"
	], function(controlHelper) {
	"use strict";
	//This method returns the control state common for SmartTable and SmartChart
	function fnGetState(oControl, bUseVariantManagement) {
		var oControlState = {};
		if (bUseVariantManagement) {
			oControlState.sVariantId = oControl.getCurrentVariantId();
			oControlState.bVariantModified = oControl.getVariantManagement().currentVariantGetModified();
		}
		//capture UI state always. May or may not be used to restore
		var oControlUiState = oControl.getUiState();
		oControlState.oUiState = {
				oPresentationVariant: oControlUiState.getPresentationVariant(),
				oSelectionVariant: oControlUiState.getSelectionVariant()
		};
		return oControlState;
	}
	//This method sets the control state common for SmartTable and SmartChart
	function fnSetState(oControl, bUseVariantManagement, oState) {
		function fnSetControlUiState() {
			var oControlUiState = oControl.getUiState();
			oControlUiState.setPresentationVariant(oState.oUiState.oPresentationVariant);
			oControlUiState.setSelectionVariant(oState.oUiState.oSelectionVariant);
			oControl.setUiState(oControlUiState);
		}
		function fnSetControlVariant() {
			if (oState.sVariantId && !oState.bVariantModified) {
				oControl.setCurrentVariantId(oState.sVariantId);	//For variant NOT dirty acse
			} else if (oState.sVariantId && oState.bVariantModified) {
				//For variant dirty case
				//TODO: is this right way to set standard variant
				oControl.setCurrentVariantId("");//Set standard variant
				fnSetControlUiState();
			} else if (!oState.sVariantId) {
				fnSetControlUiState();
			}
		}
		function fnSetDefaultVariant() {
			//TODO: is this right way to get default variant. This differs from current master OP implementation
			var sVariantId = oControl.getVariantManagement().getDefaultVariantId();
			if (sVariantId) {
				oControl.setCurrentVariantId(sVariantId);
			}
		}
		if (!oState && bUseVariantManagement) {
			fnSetDefaultVariant();
		} else if (oState && !bUseVariantManagement) {
			fnSetControlUiState();
		} else if (oState && bUseVariantManagement) {
			fnSetControlVariant();
		}
	}
	//Return a Promise to indicate control is Initialized
	function fnInitialize(oControl) {
		var oInitializedResolve;
		var oInitializedPromise = new Promise(function(resolve){
			oInitializedResolve = resolve;
		});
		var oAfterVariantInitializedResolve;
		var oAfterVariantInitializedPromise = new Promise(function(resolve){
			oAfterVariantInitializedResolve = resolve;
		});
		function fnOnControlInitialized() {
			oInitializedResolve();
			if (!oControl.getUseVariantManagement()){
				oAfterVariantInitializedResolve();
			}
		}
		if (controlHelper.isSmartTable(oControl)){
			oControl.attachInitialise(fnOnControlInitialized);
		} else if (controlHelper.isSmartChart(oControl)){
			oControl.attachInitialized(fnOnControlInitialized);
		}
		oControl.attachAfterVariantInitialise(oAfterVariantInitializedResolve);
		return Promise.all([oAfterVariantInitializedPromise, oInitializedPromise]);
	}

	return {
		getState: fnGetState,
		setState: fnSetState,
		initialize: fnInitialize
	};
});