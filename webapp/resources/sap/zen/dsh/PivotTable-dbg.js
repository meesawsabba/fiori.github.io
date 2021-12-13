/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/PivotTable",
  [
    "sap/base/Log",
    "sap/zen/dsh/utils/Utilities",
    "sap/ui/core/Control",
    "sap/ui/model/json/JSONModel",
    "sap/zen/dsh/utils/ErrorHandler",
    "sap/zen/dsh/utils/ResourceModel",
    "sap/zen/commons/Format",
    "sap/zen/commons/thirdparty/lodash"
  ],
  /*eslint-disable max-params*/
  function (
    Log, Utilities, Control, JSONModel, ErrorHandler,
    ResourceModel, Format, _
  ) {
    "use strict";
    /**
     * Constructor for a new <code>PivotTable</code>.
     * @public
     *
     * @class
     * Enables users to view, navigate and change multidimensional data exposed via InA in a PivotTable.
     *
     * <h3>Overview</h3>
     *
     * The user can view the data in the Pivot Table, navigate in the data via a context menu or enter data in input enables cells
     * cells.
     *
     * <h3>Usage</h3>
     *
     * The <code>PivotTable</code> is mimicked after the OData Smart Controls. Instead of OData they bind
     * against an {sap.zen.dsh.olap.OlapModel} with the name "om". Each Analytical Query in the <code>Olap Model</code> is exposed as a DataProvider.
     * The data provider that the PivotTable consumes needs to be provided as a property value.
     * @extends sap.ui.core.Control
     * @param {string} [sId] ID for the new control, generated automatically if no ID is given
     * @param {object} [mSettings] Initial settings for the new control
     * @author SAP SE
     * @version 1.96.0
     *
     * @constructor
     * @public
     * @alias sap.zen.dsh.PivotTable
     **/
    var PivotTable = Control.extend(
      "sap.zen.dsh.PivotTable", {
        metadata: {
          properties: {
            /**
             * Name of the Data Provider within {sap.zen.dsh.olap.OlapModel} with name <code>om</code>,
             * which is displayed and available for interactions
             */
            dataProviderName: {
              type: "string",
              defaultValue: "0"
            },
            /**
             *  Property for different table formats
             */
            format: {
              type: "sap.zen.commons.Format",
              multiple: false,
              defaultValue: Format.ExcelStyle
            }
          },
          events: {
            /**
             *  Fired when a user launches a navigation command
             */
            navigationCmd: {
              parameters: {
                /**
                 *  The control in the cell on which the command was initiated
                 */
                anchor: "sap.ui.core.Control",
                /**
                 *  Type of the navigation command: Context Menu, Drill, Row/Col request, Data Entry
                 */
                navigationCmdType: "sap.zen.dsh.NavigationCommandType",
                /**
                 *  The Row and Column Selection of the cell on which the command was initiated
                 */
                selection: "object",
                /**
                 *  the function that executed the command. The function will return a Promise that resolves/rejects when the
                 * command execution finished.
                 */
                cmd: "function"
              }
            }
          },
          publicMethods: [
            /**
             * autofit the column width
             **/
            "autoFit",
            /**
             * get the number of displayed rows
             **/
            "getRowCount",
            /**
             * get the number of displayed columns
             **/
            "getColCount",
            /**
             * get the number of fixed rows
             **/
            "getFixedRows",
            /**
             * get the number of fixed columns
             **/
            "getFixedColumns"
          ]
        },
        init: function () {
          var that = this;
          that.getInit = _.constant(
            Utilities.getDialogs().then(
              function (oDialogs) {
                return oDialogs.runAsOwner(
                  function () {
                    return sap.ui.core.mvc.XMLView.create({
                      id: [
                        that.getId(), "-gridView"
                      ].join(""),
                      viewName: "sap.zen.dsh.view.Pivot"
                    });
                  });
              }
            ).then(
              function (oView) {
                that.getView = _.constant(oView);
                that.addDependent(that.getView());
                that.getView().setModel(
                  ResourceModel, "i18n"
                ).setModel(
                  new JSONModel(), "VariableContainer"
                ).setModel(
                  new JSONModel(), "cm"
                ).setModel(
                  new JSONModel()
                );
                oView = that.getView();
                that.getEasyGrid = _.constant(oView.byId("theEasyGrid"));
                oView.getPivotTable = _.constant(that);
                oView.getController().getPivot = _.constant(that);
                that.getFixedColumns = that.getEasyGrid().getFixedColumns.bind(that.getEasyGrid());
                that.getFixedRows = that.getEasyGrid().getFixedRows.bind(that.getEasyGrid());
                that.onBeforeRendering();
                return oView;
              }
            ).catch(
              ErrorHandler.handleWithPopUp
            )
          );
          var fSetFormat = that.setFormat;
          that.setFormat = function(){
            var mRes = fSetFormat.apply(that,arguments);
            that.getInit().then(
              function(){
                return that.getModel("om").metadataLoaded();
              }
            ).then(
              function(){
                that.getEasyGrid().setFormat(
                  that.getFormat()
                );
              }
            ).catch(
              function(oError){
                Log.error(oError);
              }
            );
            return mRes;
          };
        },
        onBeforeRendering: function () {
          var that = this;
          if (!that.getVisible() || !that.getEasyGrid || !that.getEasyGrid()) {
            return;
          }
          if(!that.getModel("om")){
            return;
          }
          var oEG = that.getEasyGrid();
          if(oEG.getFormat()!=that.getFormat()){
            oEG.setFormat(that.getFormat());
          }
          var sDPName = that.getDataProviderName();
          function rebindProp(sProp) {
            var oBindingInfo = _.clone(oEG.getBindingInfo(sProp));
            oBindingInfo.parts[0].path = ["/dataProvider/", sDPName, "/Grid/", sProp].join("");
            oEG.bindProperty(sProp, oBindingInfo);
          }
          if (that._oldDPName !== sDPName) {
            var oBindingInfo = _.clone(that.getEasyGrid().getBindingInfo("cells"));
            oBindingInfo.path = ["/dataProvider/", sDPName, "/Grid/Cells"].join("");
            oEG.bindAggregation("cells", oBindingInfo);
            [
              "virtualRows",
              "virtualColumns",
              "fixedRows",
              "fixedColumns",
              "input",
              "format"
            ].forEach(rebindProp);
            that._oldDPName = sDPName;
          }
          if(
            oEG.getModel("om").getDataProvider( that.getDataProviderName())
              && oEG.getFormat()!=that.getFormat()
          ){
            oEG.setFormat(that.getFormat());
          }
        },
        renderer: function (oRm, oControl) {
          oRm.openStart(
            "div"
          ).writeControlData(
            oControl
          ).class(
            "sapUiZenCommonsSize"
          ).openEnd();
          if (oControl.getView && oControl.getView()) {
            oRm.renderControl(oControl.getView());
          } else {
            oControl.getInit().then(
              function () {
                oControl.invalidate();
              }
            );
          }
          oRm.close("div");
        },
        handleResize: _.constant(null),
        getRowCount: function () {
          return this.getEasyGrid().getRowCount();
        },
        autoFit: function () {
          var that = this;
          if (that.getEasyGrid) {
            that.getEasyGrid().autoFit();
          }
        },
        getColCount: function () {
          return this.getEasyGrid().getRowCount();
        },
        exit: function () {
          var that = this;
          sap.ui.Device.resize.detachHandler(
            that.handleResize
          );
          if (that.getEasyGrid) {
            var oCBI = that.getEasyGrid().getBindingInfo("cells");
            if (oCBI && oCBI.template) {
              oCBI.template.destroy();
            }
          }
          that.destroyDependents();
          that.removeAllDependents();
          Control.prototype.exit(that, arguments);
        }
      }
    );
    return PivotTable;
  }
);
