/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap, Promise */
sap.ui.define(
  "sap/zen/dsh/rsrt/controller/Map.controller",
  [
    "sap/zen/commons/utils/jQuery",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
  ],
  function (
    jQuery, Controller, JSONModel
  ) {
    "use strict";
    Controller.extend(
      "sap.zen.dsh.rsrt.controller.Map", {
        onInit: function () {
          var that = this;
          var oView = that.getView();
          oView.setModel(new JSONModel(),"map");
          oView.setBusy(true);
          Promise.resolve(
            jQuery.ajax(
              {
                method: "get",
                url: "/sap/opu/odata/sap/VBI_APPL_DEF2_SRV/VBIApplicationSet('BW4_DATA_PREV')?$format=json"
              }
            )
          ).then(
            function (o) {
              return JSON.parse(o.d.MapConfigJSON);
            }
          ).catch(
            function () {
              return {
                MapProvider: {
                  type: "",
                  name: "BASE",
                  description: "BASE",
                  tileX: "256",
                  tileY: "256",
                  minLOD: "0",
                  maxLOD: "20",
                  copyright: "BASE",
                  copyrightLink: "",
                  copyrightImage: "",
                  retries: "0",
                  projection: "Mercator",
                  Source: [{
                    id: "1",
                    url: ["http", "//toolserver.org/tiles/hikebike/{LOD}/{X}/{Y}.png"].join(":")
                  }]
                },
                MapLayerStack: {
                  name: "BASE",
                  MapLayer: {
                    name: "BASE",
                    refMapProvider: "BASE",
                    opacity: "1.0E0",
                    colBkgnd: "RGB(255,255,255)",
                    dependency: "all"
                  }
                }
              };
            }
          ).then(
            function (oMC) {
              that.getView().byId("vbi").setMapConfiguration(
                {
                  MapProvider: [oMC.MapProvider],
                  MapLayerStacks: [oMC.MapLayerStack]
                }
              );
              that.getView().byId("vbi").setRefMapLayerStack("BASE");
              oView.setBusy(false);
            }
          );
        },
        onAfterRendering:function(){
          var that = this;
          jQuery(
            that.getView().byId(
              "vbi"
            ).getDomRef()
          ).height(
            jQuery(
              that.getView().getDomRef()
            ).parent().parent().viewportHeight()
          );
          jQuery(
            that.getView().getDomRef()
          ).sizeChanged(
            function(){
              jQuery(
                that.getView().byId(
                  "vbi"
                ).getDomRef()
              ).height(
                jQuery(
                  that.getView().getDomRef()
                ).parent().parent().viewportHeight()
              );
            }
          );
        }
      }
    );
    return sap.zen.dsh.rsrt.controller.Map;
  }
);