/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define("sap/zen/dsh/utils/ErrorHandler",["sap/base/Log","sap/m/MessageBox"],function(L,M){function E(){var t=this;t.handleWithPopUp=function(e,r){L.error(e);L.error(e.stack);var R,f;function h(a,b){R=a;f=b;}M.error(e.message,{details:e.stack,actions:[M.Action.CLOSE],onClose:function(){if(r){f(e);}else{R(null);}}});return new Promise(h);};}return new E();});
