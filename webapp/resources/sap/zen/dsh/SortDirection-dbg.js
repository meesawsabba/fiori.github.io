/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/SortDirection",
  [
  ],
  function(){
    /**
     * Sort Direction
     *
     * @enum {string}
     * @alias sap.zen.dsh.SortDirection
     * @public
     */
    var SortDirection = {
      /**
       * Ascending
       * @public
       **/
      ASCENDING: "ASCENDING",
      /**
       * Descending
       * @public
       **/
      DESCENDING: "DESCENDING",
      /**
       * No sorting
       * @public
       **/
      NONE: "NONE"
    };
    return SortDirection;
  }
);
