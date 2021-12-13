/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/zen/commons/thirdparty/lodash","sap/zen/dsh/utils/BaseHandler"],function(){"use strict";var A=function(){this.charts=[];};A.prototype.addChart=function(v){this.charts.push(v);};A.prototype.alignValueAxis=function(){var m=0;var c,p;for(var i=0;i<this.charts.length;i++){c=this.charts[i];p=c.getVizFrame().properties();if(m<p.categoryAxis.layout.autoHeight){m=p.categoryAxis.layout.autoHeight;}}for(i=0;i<this.charts.length;i++){c=this.charts[i];var n={categoryAxis:{layout:{height:m}}};p=c.getVizFrame().properties();if(m!==p.categoryAxis.layout.autoHeight){c.getVizFrame().properties(n);}}};sap.zen.dsh.info=sap.zen.dsh.info||{};sap.zen.dsh.info.AlignCharts=A;});
