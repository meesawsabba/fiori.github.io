/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap, Promise*/
sap.ui.define(
  "sap/zen/dsh/rsrt/Component",
  [
    "sap/ui/core/UIComponent",
    "sap/base/Log",
    "sap/zen/dsh/rsrt/utils/Utilities",
    "sap/zen/dsh/utils/ErrorHandler",
    "sap/zen/commons/thirdparty/lodash",
    "sap/zen/dsh/library",
    "sap/viz/library",
    "sap/ui/vbm/library",
    "sap/suite/ui/commons/library"
  ],
  function(
    UIComponent, Log, Utilities, ErrorHandler, _
  ) {
    "use strict";
    /**
     * RSRT Reporting Server Runtime Test.
     *
     * This <code>UIComponent</code> allows for testing navigation in multidimensional data
     * provided by a server implementing the the <a href="https://wiki.scn.sap.com/wiki/display/BI/OT-BICS-INA" target="_blank">InA Protocol</a>.
     * It roughly corresponds to the familiar transaction <a href="https://wiki.scn.sap.com/wiki/display/BI/Transaction+RSRT%3A+Query+Monitor" target="_blank">RSRT</a>.
     * Via the <code>startupParameters</code> of the <code>ComponentData<code> the <code>query</code> can be passed to the component.
     * this query is then assigned to the {sap.zen.dsh.olap.DataProvider} with the name <code>0</code> of the {sap.zen.dsh.olap.OlapModel} with the name <code>om</code>
     * @extends sap.ui.core.UIComponent
     * @class
     * @author SAP SE
     * @version {version}
     * @public
     * @alias sap.zen.dsh.rsrt.Component
     * @experimental
     */
    var RSRT = UIComponent.extend(
      "sap.zen.dsh.rsrt.Component", {
        metadata: {
          manifest: "json",
          publicMethods: [
            "reload",
            "loaded"
          ],
          properties:{
            /**
             * the host of the datasource, falsy means use the origin of the website as domain
             * @public
             */
            host: {
              type: "string",
            },
            /**
             * the port of the service of the datasource
             * @public
             */
            port: {
              type: "int",
              defaultValue: 443
            },
            /**
             * the path to the service of the datasource
             * @public
             */
            path:{
              type: "string"
            },
            /**
             *  the system type of the service of the datasource
             * @public
             */
            systemType:{
              type: "sap.zen.dsh.SystemType"
            },
            /**
             *  the system name of the service of the datasource
             * @public
             */
            systemName:  {
              type: "string",
              defaultValue: "localAbapAnalyticEngine"
            },
            /**
             *  the protocol type of the service of the datasource#ToDo: Make optional
             * @public
             */
            protocolType:{
              type: "sap.zen.dsh.ProtocolType",
            },
            /**
             *  the client of the service of the datasource (only relevant for abap based analytical engines)#ToDo: Make optional
             * @public
             */
            client:{
              type: "string",
            },
            /**
             *  the name of the datasource
             * @public
             */
            dataSourceName:{
              type: "string",
            },
            /**
             *  the type of the datasource
             * @public
             */
            dataSourceType:{
              type: "sap.zen.dsh.DataSourceType",
            },
            /**
             *  the package of the datasource #ToDo: Make optional
             * @public
             */
            packageName:{
              type: "string"
            },
            /**
             *  the schema of the datasource
             * @public
             */
            schemaName:{
              type: "string"
            }
          }
        },
        /**
         * reload the component, this is required after the datasource was changed
         * @public
         */
        reload: function(){
          var that = this;
          that.getRootControl().setBusy(true);
          that.Utilities.getLoaded = _.constant(
            Promise.resolve(null).then(
              that.Utilities.readComponentData
            ).then(
              that.Utilities.initComp
            ).then(
              that.Utilities.adjustLandscape
            ).then(
              that.Utilities.getPersData
            ).then(
              that.Utilities.updateVariants
            ).then(
              that.Utilities.determineDataSource
            ).then(
              that.Utilities.loadDataSource
            ).then(
              that.Utilities.adjustTitle
            ).then(
              that.Utilities.executeDataSourceIfPossible
            ).then(
              that.Utilities.adjustFilterBar
            ).catch(
              function (e) {
                return ErrorHandler.handleWithPopUp(e, true);
              }
            ).then(
              function () {
                that.getRootControl().setBusy(false);
              }
            )
          );
          return that.Utilities.getLoaded();
        },
        /**
         * return a Promise that resolves, when the component is fully loaded
         * @public
         */
        loaded: function(){
          return this.Utilities.getLoaded();
        },
        init: function () {
          UIComponent.prototype.init.apply(this, arguments);
          var that = this;
          that.Utilities = new Utilities(that);
          that.getRootControl().setBusy(true);
          that.Utilities.getLoaded = _.constant(
            that.rootControlLoaded().then(
              that.reload.bind(that)
            ).catch(
              function (oError) {
                that.Utilities.terminateApplication(oError);
              }
            )
          );
        },
        exit: function () {
          var oView = this.getRootControl();
          this.getModel("om").logoff();
          oView.destroyDependents();
          oView.destroyContent();
          oView.removeAllDependents();
          oView.destroy();
        }
      });
    return RSRT;
  }
);
