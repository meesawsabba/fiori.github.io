/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/esh/search/ui/SearchHelper", "sap/m/Label"], function (SearchHelper, Label) {
    "use strict";
    return Label.extend("sap.esh.search.ui.controls.SearchLabel", {
        renderer: "sap.m.LabelRenderer",
        onAfterRendering: function () {
            var d = this.getDomRef();
            // recover bold tag with the help of text() in a safe way
            SearchHelper.boldTagUnescaper(d);
            // forward ellipsis
            SearchHelper.forwardEllipsis4Whyfound(d);
        },
    });
});
