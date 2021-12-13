

/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/WidgetType",
  [
  ],
  function(){
    /**
     * Widget Type of an InACard
     *
     * @enum {string}
     * @alias sap.zen.dsh.WidgetType
     * @public
     */
    var WidgetType = {
      /**
       * Pivot Table
       * @public
       **/
      pivot: "pivot",
      /**
       * Bar Chart
       * @public
       **/
      bar: "bar",
      /**
       * Column Chart
       * @public
       **/
      colum: "column",
      /**
       * Line Chart
       * @public
       **/
      line: "line",
      /**
       * Pie Chart
       * @public
       **/
      pie: "pie",
       /**
       * Donut Chart
       * @public
       **/
       donut: "donut"
    };
    return WidgetType;
  }
);
