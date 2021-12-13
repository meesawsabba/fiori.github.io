/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log"],function(L){"use strict";L.info("Load typeUtilsCopy");var c={"[object Boolean]":"boolean","[object Number]":"number","[object String]":"string","[object Function]":"function","[object Array]":"array","[object Date]":"date","[object RegExp]":"regexp","[object Object]":"object"};var t=function(o){return!o?String(o):c[Object.prototype.toString.call(o)]||"object";};var a={isFunction:function(o){return t(o)==="function";},isArray:Array.isArray||function(o){return t(o)==="array";},isExist:function(o){if((typeof(o)==="undefined")||(o===null)){return false;}return true;}};return a;});
