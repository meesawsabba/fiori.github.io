sap.ui.define([
	], function() {
	"use strict";

    function ObjectPageLayoutWrapper(oObjectPageLayout) {
        // Returns the state of the ObjectPageLayout
        // Right now we only consider the pinned status of the ObjectPageLayout 
        function fnGetObjectPageLayoutState() {
            var oControlState = {};
            oControlState.headerPinned = oObjectPageLayout.getHeaderContentPinned();
            return oControlState;
        }

        function fnSetObjectPageLayoutState(oState) {
            if (oState && oState.headerPinned) {
                oObjectPageLayout.setHeaderContentPinned(true);
            } else {
                oObjectPageLayout.setHeaderContentPinned(false);
            }
        }

        function fnAttachStateChanged(fnHandler) {
            oObjectPageLayout.attachHeaderContentPinnedStateChange(fnHandler);
        }

        return {
            getState: fnGetObjectPageLayoutState,
            setState: fnSetObjectPageLayoutState,
            attachStateChanged: fnAttachStateChanged
        };
    }

    return ObjectPageLayoutWrapper;
});