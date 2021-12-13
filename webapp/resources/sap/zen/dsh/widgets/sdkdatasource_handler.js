/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/base/Log","sap/zen/commons/thirdparty/lodash","sap/zen/dsh/utils/BaseHandler","sap/zen/dsh/widgets/sdk_handler","sap/zen/dsh/widgets/sdkcontrol"],function(q,L,_,B,s,S){"use strict";var D=function(){s.getClass().apply(this,arguments);this.create=function(c,C,o){var a=C["id"];var b=new S(a);b.storeProperties(C,o);b.widget.init();b.widget.dispatchProperties(C,o);return b;};this.getType=function(){return"sdkdatasource";};};var i=new D();B.dispatcher.addHandlers(i.getType(),i);return i;});
