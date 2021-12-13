/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/esh/search/ui/SearchHelper", "sap/m/Link"], function (SearchHelper, Link) {
    "use strict";
    return Link.extend("sap.esh.search.ui.controls.SearchLink", {
        metadata: {
            aggregations: {
                icon: {
                    type: "sap.ui.core.Icon",
                    multiple: false,
                },
            },
        },
        renderer: "sap.m.LinkRenderer",
        onAfterRendering: function () {
            var d = this.getDomRef();
            // recover bold tag with the help of text() in a safe way
            SearchHelper.boldTagUnescaper(d);
            var icon = this.getAggregation("icon");
            if (icon) {
                var oRm = sap.ui.getCore().createRenderManager();
                var iconContainer = document.createElement("span");
                d.prepend(" ");
                d.prepend(iconContainer);
                oRm.render(icon, iconContainer);
                oRm.destroy();
            }
        },
    });
});
