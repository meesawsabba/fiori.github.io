/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/zen/commons/thirdparty/lodash","sap/zen/dsh/widgets/utils/info_chart_exception","sap/zen/dsh/utils/BaseHandler"],function(q,_,I){"use strict";var a=function(){};a.prototype.map=function(f){if(!f||!f.data||!f.data.length){throw new I("mapper.nodata");}return new sap.viz.api.data.FlatTableDataset(f);};a.prototype.getMeasuresDimensionKey=function(d,e){var b=d||[];b=b.concat(e);var m=_.find(b,{"containsMeasures":true});return m&&m.key;};return a;});
