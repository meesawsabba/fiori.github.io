/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/zen/dsh/utils/BaseHandler","sap/ui/core/Control"],function(q,B,C){"use strict";return C.extend("sap.zen.components.Empty",{renderer:function(r,c){r.write("<div");r.writeControlData(c);r.write("></div>");},insertPage:function(){},setSelectedIndex:function(){}});});
