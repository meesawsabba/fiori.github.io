/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define("sap/zen/dsh/utils/ListHelper",["sap/base/Log"],function(L){"use strict";L.info("ListHelper loaded");function b(i){var a=[];while(i.hasNext()){a.push(i.next());}return a;}function c(){this.arrayFromIter=b;this.arrayFromList=function(l){return b(l.getIterator());};}return new c();});
