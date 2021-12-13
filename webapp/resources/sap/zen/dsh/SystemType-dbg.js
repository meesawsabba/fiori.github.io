/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/SystemType",
  [
  ],
  function(){
    /**
     * System Type of an InA System
     *
     * @enum {string}
     * @alias sap.zen.dsh.SystemType
     * @public
     */
    var SystemType = {
      /**
       * The in place WASABI Engine
       * @public
       **/
      WASABI: "WASABI",
       /**
       * The BW analytic engine
       * @public
       **/
      BW: "BW",
      /**
       * The ABAP analytic engine
       * @public
       **/
      ABAP_MDS:"ABAP_MDS",
      /**
       * The Data Warehouce Cloud analytic engine
       * @public
       **/
      DWC:"DWC"
    };
    return SystemType;
  }
);
