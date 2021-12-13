/*!
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "sap/zen/commons/utils/jQuery",
    "sap/base/Log",
    "sap/zen/commons/CellType",
    "sap/zen/commons/Format",
    "sap/zen/commons/AlertLevel",
    "sap/zen/commons/BackgroundDesign",
    "sap/zen/commons/HAlign",
    "sap/zen/commons/VAlign",
    "sap/zen/commons/Padding",
    "sap/zen/commons/Separation",
    "sap/zen/commons/utils/Utilities",
    "sap/zen/commons/wasabi/Olap",
    "sap/ui/core/library",
    "sap/m/library",
    "sap/ui/layout/library"
  ],
  function(
    jQuery, Log, CellType, Format,
    AlertLevel, BackgroundDesign, HAlign, VAlign, Padding, Separation, Utilities,Olap
  ) {
    "use strict";
    /**
     * Common basic controls, mainly intended for desktop scenarios
     *
     * @namespace
     * @name sap.zen.commons
     * @author SAP SE
     * @version 1.96.0
     * @public
     */
    // delegate further initialization of this library to the Core
    sap.ui.getCore().initLibrary({
      name : "sap.zen.commons",
      version: "1.96.0",
      dependencies : ["sap.ui.core","sap.ui.layout","sap.m"],
      types: [
        "sap.zen.commons.BackgroundDesign",
        "sap.zen.commons.HAlign",
        "sap.zen.commons.Padding",
        "sap.zen.commons.Separation",
        "sap.zen.commons.VAlign",
        "sap.zen.commons.AlertLevel",
        "sap.zen.commons.CellType",
        "sap.zen.commons.Format"
      ],
      interfaces: [
      ],
      controls: [
        "sap.zen.commons.layout.AbsoluteLayout",
        "sap.zen.commons.layout.MatrixLayout",
        "sap.zen.commons.Grid",
      ],
      elements: [
        "sap.zen.commons.layout.MatrixLayoutCell",
        "sap.zen.commons.layout.MatrixLayoutRow",
        "sap.zen.commons.layout.PositionContainer",
        "sap.zen.commons.Cell",
      ]
    });
    /**
     * Design Studio Commons Library.
     * Intended only to be used within S/4 HANA Fiori applications.
     * @namespace
     * @name sap.zen.commons
     * @author SAP SE
     * @public
     */
    var thisLib = sap.zen.commons;
    thisLib.CellType = CellType;
    thisLib.AlertLevel = AlertLevel;
    thisLib.Format = Format;
    thisLib.BackgroundDesign = BackgroundDesign;
    thisLib.HAlign = HAlign;
    thisLib.Padding = Padding;
    thisLib.Separation = Separation;
    thisLib.VAlign = VAlign;
    thisLib.Utilities = Utilities;
    thisLib.Log = Log;
    /**
     * Accessor for the Worker (only intended for internal use)
     * @type {object}
     * @public
     */
    thisLib.getWorker = ( function(){
      var oWorker;
      return function(){
          if(!oWorker){
              oWorker = new Olap();
          }
        return oWorker;
      };
    }());
    /**
     * Retrieve the Server Info from the embedded wasabi Processor
     * @type {Promise<string>}
     * @public
     */
    thisLib.getServerInfo=function(){
      return thisLib.getWorker().getServerInfo();
    };
    /**
     * Retrieve the GetResponse from the embedded wasabi Processor
     * @type {Promise<string>}
     * @public
     */
    thisLib.getResponse = function(sPOSTBody){
      return thisLib.getWorker().getResponse(sPOSTBody);
    };
    /**
     * Submit a Cube to the embedded wasabi Processor
     * @type {Promise<string>}
     * @public
     * @experimental
     */
    thisLib.submitCube = function(sPOSTBody){
      return thisLib.getWorker().submitCube(sPOSTBody);
    };
    return sap.zen.commons;
  }
);
