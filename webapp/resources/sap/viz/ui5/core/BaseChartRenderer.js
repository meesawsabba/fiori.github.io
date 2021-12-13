/*!
 * SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */
sap.ui.define(function(){"use strict";var B={apiVersion:2};B.render=function(r,c){var i=!c.getDataset()||!c.getDataset().getVIZDataset(),b=sap.ui.getCore().getLibraryResourceBundle("sap.viz.ui5.messages");r.openStart("div",c);if(c.getTooltip_AsString()){r.attr("title",c.getTooltip_AsString());}r.class("sapVizChart");if(i){r.class("sapVizNoData");}r.style("width",c.getWidth());r.style("height",c.getHeight());r.openEnd();if(!sap.viz.__svg_support){r.openStart("div").class("sapVizNoDataDefault").openEnd().text(b.getText("NO_SVG_SUPPORT")).close("div");}else if(i){var n=c.getNoData();if(n){r.renderControl(n);}else{r.openStart("div").class("sapVizNoDataDefault").openEnd().text(b.getText("NO_DATA")).close("div");}}r.close("div");};return B;},true);
