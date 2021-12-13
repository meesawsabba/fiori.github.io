/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

sap.ui.define(["sap/m/OverflowToolbarButton"], function(OverflowToolbarButton) {
	"use strict";

	var OverflowToolbarButtonHover = OverflowToolbarButton.extend("sap.fe.templates.ObjectPage.controls.OverflowToolbarButtonHover", {
		metadata: {
			events: {
				hover: {} // this Button has also a "hover" event, in addition to "press" of the normal Button
			}
		},

		// the hover event handler:
		onmouseover: function(evt) {
			// is called when the Button is hovered - no event registration required
			this.fireHover();
		},
		renderer: {}
	});

	return OverflowToolbarButtonHover;
});
