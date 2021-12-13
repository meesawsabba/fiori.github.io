/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/SortType",
  [
  ],
  function(){
    /**
     * Sort Type
     *
     * @enum {string}
     * @alias sap.zen.dsh.SortType
     * @public
     */
    var SortType = {
      /**
       * Sort according to Filter
       * @public
       **/
      Filter: "Filter",
      /**
       * Sort according to Key
       * @public
       **/
      MemberKey: "MemberKey",
      /**
       * Sort according to Text
       * @public
       **/
      MemberText: "MemberText",
      /**
       * No sorting
       * @public
       **/
      unset: "unset"
    };
    return SortType;
  }
);
