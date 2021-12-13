/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/Device"],function(C,D){"use strict";return C.extend("sap.fe.core.controls.FormElementWrapper",{metadata:{interfaces:["sap.ui.core.IFormContent"],properties:{width:{type:"sap.ui.core.CSSSize",defaultValue:null},formDoNotAdjustWidth:{type:"boolean",defaultValue:false}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:false}}},getAccessibilityInfo:function(){var c=this.getContent();return c&&c.getAccessibilityInfo?c.getAccessibilityInfo():{};},renderer:{apiVersion:2,render:function(r,c){r.openStart("div",c);r.style("min-height","1rem");r.style("width",c.getWidth());if(D.browser.msie){r.style("display","block");}else{r.style("display","inline-block");}r.openEnd();r.renderControl(c.getContent());r.close("div");}}});});
