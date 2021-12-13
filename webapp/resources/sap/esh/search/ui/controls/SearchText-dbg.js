/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/esh/search/ui/SearchHelper", "sap/m/Text"], function (SearchHelper, Text) {
    "use strict";
    return Text.extend("sap.esh.search.ui.controls.SearchText", {
        metadata: {
            properties: {
                isForwardEllipsis4Whyfound: {
                    type: "boolean",
                    defaultValue: false,
                },
            },
            aggregations: {
                icon: {
                    type: "sap.ui.core.Icon",
                    multiple: false,
                },
            },
        },
        renderer: "sap.m.TextRenderer",
        onAfterRendering: function () {
            var d = this.getDomRef();
            // recover bold tag with the help of text() in a safe way
            SearchHelper.boldTagUnescaper(d);
            // emphasize whyfound in case of ellipsis
            // the problem
            // Logic is moved to SearchResultListItem OnAfterrendering()
            // because both offsetWidth and scrollWidth are 0 when parent .searchResultListItemDetails2 display:none
            // searchHelper.forwardEllipsis4Whyfound(d);
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
