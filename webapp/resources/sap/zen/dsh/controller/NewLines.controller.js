/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define("sap/zen/dsh/controller/NewLines.controller",["sap/ui/core/mvc/Controller","sap/base/Log","sap/m/MessageToast","sap/zen/commons/thirdparty/lodash"],function(C,L,M,_){"use strict";L.info("New lines controller load");C.extend("sap.zen.dsh.controller.NewLines",{onInit:function(){var t=this;t.getView().setBusy(true);t.getView().loaded().then(function(){t.getView().setBusy(false);});},onPaste:function(e){var t=this;var c=t.getView().getModel("NewLines").getData().cols;var n=_.concat(_.filter(t.getView().getModel("NewLines").getData().rows,function(r){return _.some(r,_.identity);}),_.map(e.getParameters().data,function(r){return _.reduce(r,function(a,o,b){if(c[b]){a[c[b].Name]=o;}return a;},{});}));t.getView().getModel("NewLines").setProperty("/rows",n);},handleValueHelp:function(){M.show("Not yet implemented");}});return sap.zen.dsh.controller.NewLines;});
