/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/base/Log","sap/m/Switch"],function(q,L,S){"use strict";return S.extend("com.sap.ip.bi.Switch",{metadata:{properties:{mode:{type:"string",defaultValue:"OnOff"},}},initDesignStudio:function(){var m=this;this.attachChange(function(){m.fireDesignStudioPropertiesChangedAndEvent(["state"],"onChange");});},setMode:function(m){var t;var o;var a;if(m==="Blank"){o=" ";a=" ";t=sap.m.SwitchType.Default;}else if(m==="AcceptReject"){o="";a="";t=sap.m.SwitchType.AcceptReject;}else{o="";a="";t=sap.m.SwitchType.Default;}this.setCustomTextOn(o);this.setCustomTextOff(a);this.setType(t);this.setProperty("mode",m);},renderer:{},});});
