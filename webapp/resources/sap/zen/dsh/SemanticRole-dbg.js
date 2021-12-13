/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/SemanticRole",
  [
  ],
  function(){
    /**
     * Semanitc Role of a Dimension Member
     *
     * @enum {string}
     * @alias sap.zen.dsh.SemanticRole
     * @public
     */
    var SemanticRole = {
      /**
       * Actual Data
       * @public
       **/
      Actual: "Actual",
      /**
       * Previous Data
       * @public
       **/
      Previous: "Previous",
       /**
       * Budget Data
       * @public
       **/
      Budget: "Budget",
      /**
       * Forecast Data
       * @public
       **/
      Forecast: "Forecast"
    };
    return SemanticRole;
  }
);
