/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define("sap/zen/dsh/controller/Formular.controller",["sap/ui/core/mvc/Controller"],function(C){"use strict";C.extend("sap.zen.dsh.controller.Formular",{onInit:function(){var t=this;var v=t.getView();v.setBusy(true);v.loaded().then(function(){var b=v.byId("builder");b.allowFunction("RoundDown",false);b.allowFunction("RoundUp",false);b.allowFunction("Round",false);b.allowFunction("ABS",false);b.allowFunction("EXP",false);b.allowFunction("LOG",false);b.allowFunction("SQRT",false);v.setBusy(false);});},afterValidation:function(e){var t=this;t.getView().getParent().getButtons()[0].setEnabled(!e.getSource().getErrors().length);t.getView().getParent().getButtons()[0].rerender();}});return sap.zen.dsh.controller.Formular;});
