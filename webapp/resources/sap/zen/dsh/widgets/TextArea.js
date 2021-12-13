/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/base/Log","sap/m/TextArea"],function(q,L,T){"use strict";return T.extend("com.sap.ip.bi.TextArea",{initDesignStudio:function(){var t=this;t.attachChange(function(){t.fireDesignStudioPropertiesChangedAndEvent(["value"],"onChange");});this.setWrapping("Soft");this.addStyleClass("zenTextArea");},setValue:function(v){T.prototype.setValue.call(this,v);this.fireDesignStudioPropertiesChanged(["value"]);},renderer:{},});});
