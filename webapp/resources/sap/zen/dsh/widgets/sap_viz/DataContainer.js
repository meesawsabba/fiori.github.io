/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log","sap/zen/dsh/widgets/sap_viz/class"],function(L,C){"use strict";L.info("Load DataContainer");var D=C.define({constructor:function(u){this._uId=u;this._isFake=false;this._infos=null;},getId:function(){return this._uId;},fake:function(_){if(!arguments.length){return this._isFake;}this._isFake=_;},infos:function(_){if(!arguments.length){return this._infos;}this._infos=_;return null;}});return D;});
