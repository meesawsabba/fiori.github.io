/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define("sap/zen/dsh/rsrt/controller/Layout.controller",["sap/base/Log","sap/ui/core/mvc/Controller","sap/zen/commons/thirdparty/lodash"],function(L,C,_){"use strict";L.info("Load Layout controll");C.extend("sap.zen.dsh.rsrt.controller.Layout",{dimensionPress:function(e){var i=e.getParameter("item");this.getOwnerComponent().getAxisActionMenu().getItem=_.constant(i);this.getOwnerComponent().getAxisActionMenu().openBy(i);}});return sap.zen.dsh.rsrt.controller.Layout;});
