
/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/DataSourceType",
  [
  ],
  function(){
    /**
     *  Type of a DataSource
     *
     * @enum {string}
     * @alias sap.zen.dsh.DataSourceType
     * @public
     */
    var DataSourceType = {
      /**
       * Query
       * @public
       **/
      query: "query",
      /**
       * View
       * @public
       **/
      view: "view",
       /**
       * Ina Model
       * @public
       **/
      inamodel: "inamodel",
       /**
       * infoprovider
       * @public
       **/
      infoprovider: "infoprovider",
      /**
       * cdsprojectionview
       * @public
       **/
       cdsprojectionview: "cdsprojectionview"
    };
    return DataSourceType;
  }
);

