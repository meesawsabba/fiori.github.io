/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.define("sap/sac/grid/library",["sap/sac/grid/CellType","sap/sac/grid/SemanticStyle","sap/sac/grid/Format","sap/sac/grid/AlertLevel"],function(C,S,F,A){"use strict";sap.ui.getCore().initLibrary({name:"sap.sac.grid",version:"1.96.0",dependencies:["sap.m","sap.ui.core"],types:["sap.sac.grid.AlertLevel","sap.sac.grid.CellType","sap.sac.grid.Format"],interfaces:[],controls:["sap.sac.grid.Grid"],elements:["sap.sac.grid.Cell","sap.sac.grid.SemanticStyle"]});var t=sap.sac.grid;t.CellType=C;t.AlertLevel=A;t.SemanticStyle=S;t.Format=F;return t;},false);
