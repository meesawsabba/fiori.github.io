/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([], function () {
    "use strict";
    return sap.ui.core.Control.extend("sap.esh.search.ui.controls.SearchResultListContainer", {
        init: function () {
            // define group for F6 handling
            this.data("sap-ui-fastnavgroup", "true", true /* write into DOM */);
        },
        metadata: {
            aggregations: {
                filterBar: {
                    type: "sap.ui.core.Control",
                    multiple: false,
                },
                centerArea: {
                    singularName: "content",
                },
                totalCountBar: {
                    type: "sap.ui.core.Control",
                    multiple: false,
                },
                didYouMeanBar: {
                    type: "sap.ui.core.Control",
                    multiple: false,
                },
                noResultScreen: {
                    type: "sap.ui.core.Control",
                    multiple: false,
                },
                totalCountHiddenElement: {
                    // to be used for aria-describedby of search result list items
                    type: "sap.ui.core.InvisibleText",
                    multiple: false,
                },
            },
        },
        renderer: function (oRm, oControl) {
            // inner div for results
            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addClass("sapUshellSearchResultListsContainer");
            oRm.addClass("sapUiResponsiveMargin");
            if (oControl.getModel() && oControl.getModel().getFacetVisibility() === true) {
                if (oControl.getModel().config.FF_layoutWithoutPage) {
                    if (oControl.getModel().getProperty("/errors/length") > 0) {
                        oRm.addClass("sapElisaSearchPageFloorplanWithMessageToolbarFacetPanelOpen");
                    }
                    else {
                        oRm.addClass("sapElisaSearchPageFloorplanFacetPanelOpen");
                    }
                }
                else {
                    if (oControl.getModel().getProperty("/errors/length") > 0) {
                        oRm.addClass("sapUshellSearchFacetPanelOpen");
                    }
                    else {
                        oRm.addClass("sapUshellSearchFacetPanelOpen");
                    }
                }
            }
            oRm.writeClasses();
            oRm.write(">");
            // render main header
            oRm.renderControl(oControl.getNoResultScreen());
            // render did you mean bar
            oRm.renderControl(oControl.getDidYouMeanBar());
            // render total count bar
            oRm.write('<div class="sapUshellSearchTotalCountBar">');
            oRm.renderControl(oControl.getTotalCountBar());
            oRm.write("</div>");
            //render center area
            for (var i = 0; i < oControl.getCenterArea().length; i++) {
                oRm.renderControl(oControl.getCenterArea()[i]);
            }
            oRm.renderControl(oControl.getTotalCountHiddenElement());
            // close inner div for results
            oRm.write("</div>");
        },
    });
});
