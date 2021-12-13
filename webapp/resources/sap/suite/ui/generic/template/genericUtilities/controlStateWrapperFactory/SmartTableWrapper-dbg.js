sap.ui.define([
    "sap/suite/ui/generic/template/genericUtilities/controlStateWrapperFactory/SmartTableChartCommon"
    ], function(SmartTableChartCommon) {
	"use strict";
    function SmartTableWrapper(oWrappedControl) {
        // (private) instance attributes
		// control to be wrapped
		var oControl = oWrappedControl;
		// controlling initialization state of wrapped control
		var bReady = false;
		var oPreliminaryState;

		// preliminary put here to simplify change - todo: decide whether to get this information once in initialize or whenever it's needed 
		var bUseVariantManagement;
        //private methods
        function fnGetState() {
            if (!bReady) {
				return oPreliminaryState;
			}
            var oControlState = SmartTableChartCommon.getState(oControl, bUseVariantManagement);//fnCommonGetState();
            //Add Table specific logic here as and when required
            return oControlState;
        }

        function fnSetState(oState) {
            if (!bReady) {
				// SmartTable/SmartChart is not ready to set a state - keep it in local memory
				// if multiple states are set before, the last one wins
				oPreliminaryState = oState;
				return;
			}
            SmartTableChartCommon.setState(oControl, bUseVariantManagement, oState);
            //Add Table specific logic here as and when required
        }
        //Initialization
        SmartTableChartCommon.initialize(oControl).then(function(){
			bReady = true;
            bUseVariantManagement = oControl.getUseVariantManagement();
			if (oPreliminaryState) {
				fnSetState(oPreliminaryState);
			}
		});
        //TODO: using beforeRebind is not correct, but assumed to work in most cases. 
		//Should be replaced with corrected events (personalizationChanged) as soon as provided by SmartTable/SmartChart."
        function fnAttachStateChanged(fnHandler) {
			oControl.attachBeforeRebindTable(fnHandler);
		}
        return {
			getState: fnGetState,
            setState: fnSetState,
            attachStateChanged: fnAttachStateChanged
		};
    }
    return SmartTableWrapper;
});