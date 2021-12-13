/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define("sap/zen/dsh/rsrt/controller/Graph.controller",["sap/base/Log","sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel"],function(L,C,J){"use strict";C.extend("sap.zen.dsh.rsrt.controller.Graph",{onInit:function(){var t=this;var v=t.getView();var o=v.getModel("om");v.setBusy(true);o.loaded().then(function(){o.attachRequestCompleted(function(){o.getDataProvider(0).produceGraph();});}).catch(function(e){L.error(e);}).then(function(){v.setBusy(false);});}});return sap.zen.dsh.rsrt.controller.Graph;});
