sap.ui.define([
	], function() {
	"use strict";

    function DynamicPageWrapper(oDynamicPage) {
        // Returns the state of the dynamic page
        // Right now we only consider the pinned status of the dynaamic page header 
        function fnGetDynamicPageState() {
            var oControlState = {};
            oControlState.headerPinned = oDynamicPage.getHeaderPinned();
            return oControlState;
        }

        function fnSetDynamicPageState(oState) {
            if (oState && oState.headerPinned) {
                // There is a possibility that the header is collapsed at this point. Make sure it is expanded if we know the header is to be pinned.
                oDynamicPage.setHeaderExpanded(true);
                oDynamicPage.setHeaderPinned(true);
            } else {
                oDynamicPage.setHeaderPinned(false);
            }
        }

        function fnAttachStateChanged(fnHandler) {
            oDynamicPage.attachPinnedStateChange(fnHandler);
        }

        return {
            getState: fnGetDynamicPageState,
            setState: fnSetDynamicPageState,
            attachStateChanged: fnAttachStateChanged
        };
    }

    return DynamicPageWrapper;
});