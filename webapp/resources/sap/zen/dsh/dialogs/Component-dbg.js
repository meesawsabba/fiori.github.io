/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap, Promise */
sap.ui.define(
  "sap/zen/dsh/dialogs/Component",
  [
    "sap/ui/core/UIComponent",
    "sap/zen/dsh/dialogs/Condition",
    "sap/zen/dsh/dialogs/ContextMenu",
    "sap/zen/dsh/dialogs/Exception",
    "sap/zen/dsh/dialogs/Formular",
    "sap/zen/dsh/dialogs/NewLines",
    "sap/zen/dsh/dialogs/Open",
    "sap/zen/dsh/dialogs/Restriction",
    "sap/zen/dsh/dialogs/Selector",
    "sap/zen/dsh/dialogs/SelectPlanningFunction",
    "sap/zen/dsh/utils/ResourceModel",
    "sap/zen/commons/thirdparty/lodash"
  ],
  function (
    UIComponent, Condition, ContextMenu, Exception, Formular,
    NewLines, Open, Restriction,
    Selector, SelectPlanningFunction, ResourceModel, _
  ) {
    "use strict";
    /**
     * Dialogs for navigating the Data of a <code>sap.zen.dsh.olap.DataProvider</code>
     *
     * This <code>UIComponent</code> provides all the dialogs for navigating the data provided via a <code>DataProvider</code>.
     * Don't use the this component directly, but call the corresponding methods of the <code>DataProvider</code>
     *  <b>List of dialogs</b>
     * <ul>
     * <li><code>Condition</code> create a condition (aka result set filter)</li>
     * <li><code>ContextMenu</code> create a context menu for a <code>Cell</code> in the cells collection of a <code>DataProvider</code></li>
     * <li><code>Exception</code> create an exception (aka conditional format)</li>
     * <li><code>Formula</code> create a formula</li>
     * <li><code>MessagePopup</code> display a list of Messages</li>
     * <li><code>NewLines</code> Enter new lines in tabluar form</li>
     * <li><code>AxisLayoutDialog</code> display/change settings of the query view</li>
     * <li><code>Restriciton</code>create a restricted measure</li>
     * <li><code>SelectPlanningFunction</code> Select a Data Function</li>
     * <li><code>Selector</code> Define and Display the Dynamic filter (of a dimension)</li>
     * <li><code>Spot</code>display information on a geographic spot</li>
     *</ul>
     * @extends sap.ui.core.UIComponent
     * @class
     * @author SAP SE
     * @version 1.96.0
     * @public
     * @alias sap.zen.dsh.dialogs
     */
    var Component = UIComponent.extend(
      "sap.zen.dsh.dialogs.Component", {
        metadata: {},
        loaded: function () {
          var that = this;
          return that._loadProm;
        },
        init: function () {
          var that = this;
          UIComponent.prototype.init.apply(that,arguments);
          that._loadProm = Promise.all(_.map([
            Condition,
            ContextMenu,
            Exception,
            Formular,
            NewLines,
            Open,
            Restriction,
            Selector,
            SelectPlanningFunction
          ], function(f){return f(that);})).then(function (a) {
            _.forEach(a, function (o) {
              o.setModel(ResourceModel, "i18n");
            });
            that.Condition = a[0];
            that.ContextMenu = a[1];
            that.Exception = a[2];
            that.Formular = a[3];
            that.NewLines = a[4];
            that.Open = a[5];
            that.Restriction = a[6];
            that.Selector = a[7];
            that.SelectPlanningFunction = a[8];
            return that;
          });
        }
      });
    return Component;
  }
);
