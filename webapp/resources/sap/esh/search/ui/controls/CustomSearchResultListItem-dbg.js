/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
// iteration 0 : Holger
sap.ui.define([
    "sap/esh/search/ui/controls/SearchResultListItem",
    "sap/esh/search/ui/controls/CustomSearchResultListItemContent",
], function () {
    "use strict";
    return sap.esh.search.ui.controls.SearchResultListItem.extend("sap.esh.search.ui.controls.CustomSearchResultListItem", {
        // the control API:
        metadata: {
            properties: {
                content: {
                    type: "sap.esh.search.ui.controls.CustomSearchResultListItemContent",
                },
            },
        },
        init: function () {
            sap.esh.search.ui.controls.SearchResultListItem.prototype.init.apply(this, arguments);
        },
        setupCustomContentControl: function () {
            var content = this.getContent();
            content.setTitle(this.getTitle());
            content.setTitleUrl(this.getTitleUrl());
            content.setType(this.getType());
            content.setImageUrl(this.getImageUrl());
            content.setAttributes(this.getAttributes());
            // content.setIntents(this.getIntents());
        },
        renderer: function (oRm, oControl) {
            oControl.setupCustomContentControl();
            sap.esh.search.ui.controls.SearchResultListItemRenderer.render.apply(this, arguments);
        },
        //         renderer: function(oRm, oControl) { // static function, so use the given "oControl" instance instead of "this" in the renderer function
        //
        //             oControl._renderer(oRm);
        //
        // //             oRm.write('<div');
        // //             oRm.writeControlData(oControl); // writes the Control ID
        // //             oRm.writeClasses(); // this call writes the above class plus enables support for Square.addStyleClass(...)
        // //             oRm.write('>');
        // //
        // //             var searchResultListItemContent = oControl.getContent();
        // //             if (searchResultListItemContent) {
        // //                 var customContent = searchResultListItemContent.getContent();
        // //                 if (customContent) {
        // //                     if (jQuery.isArray(customContent)) {
        // //                         for (var i = 0; i < customContent.length; i++) {
        // //                             oRm.renderControl(customContent[i]);
        // //                         }
        // //                     } else {
        // //                         oRm.renderControl(customContent);
        // //                     }
        // //                 }
        // //             }
        // //
        // //             oRm.write('</div>');
        //         },
        // after rendering
        // ===================================================================
        onAfterRendering: function () {
            sap.esh.search.ui.controls.SearchResultListItem.prototype.onAfterRendering.apply(this, arguments);
            this.getContent().getTitleVisibility();
        },
    });
});
