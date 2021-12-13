/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log","sap/zen/dsh/widgets/sap_viz/objectUtils","sap/zen/dsh/widgets/sap_viz/DataContainer"],function(L,O,D){"use strict";L.info("Load DimensionLabels");var a=D.extend({constructor:function(u,t,v){this._type=t;this._values=v;},getValues:function(){return this._values;},getType:function(){return this._type;}});return a;});
