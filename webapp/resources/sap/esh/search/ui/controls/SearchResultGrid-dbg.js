/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "sap/esh/search/ui/SearchHelper",
    "sap/f/GridContainer",
    "sap/m/ImageContent",
    "sap/m/GenericTile",
    "sap/m/TileContent",
], function (SearchHelper, GridContainer, ImageContent, GenericTile, TileContent) {
    "use strict";
    return GridContainer.extend("sap.esh.search.ui.controls.SearchResultGrid", {
        constructor: function (sId, mSettings) {
            GridContainer.prototype.constructor.apply(this, [sId, mSettings]);
            this.bindAggregation("items", "/results", function (id, context) {
                var item = context.getObject();
                var imageContent = new ImageContent({
                    src: item.imageUrl || item.titleIconUrl,
                });
                if (item.imageFormat === "round") {
                    imageContent.addStyleClass("sapUshellResultListGrid-ImageContainerRound");
                }
                return new GenericTile({
                    header: item.title,
                    subheader: item.titleDescription,
                    tileContent: new TileContent({
                        content: imageContent,
                    }),
                    press: function (oEvent) {
                        var binding = this.getModel().getProperty(oEvent.getSource().getBindingContext().sPath);
                        if (binding.titleNavigation._target === "_blank") {
                            window.open(binding.titleNavigation._href, "_blank", "noopener,noreferrer");
                        }
                        else {
                            window.location.hash = binding.titleNavigation._href;
                        }
                    },
                });
            });
            this.addStyleClass("sapUshellResultListGrid");
        },
        renderer: "sap.f.GridContainerRenderer",
        onAfterRendering: function () {
            SearchHelper.boldTagUnescaper(this.getDomRef());
        },
    });
});
