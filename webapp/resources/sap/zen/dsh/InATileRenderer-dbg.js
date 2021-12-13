/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "sap/ushell/library",
    "sap/base/Log",
    "sap/ui/core/Renderer",
    "sap/zen/dsh/WidgetType",
    "sap/ushell/ui/tile/TileBaseRenderer"
  ],
  function(
    ushellLibrary,Log, Renderer, WidgetType, TileBaseRenderer
  ) {
    "use strict";
    /**
     * @name sap.zen.dsh.InATileRenderer
     * @static
     * @private
     */
    var InATileRenderer = Renderer.extend(TileBaseRenderer);
    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
     * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
     *
     * @private
     */
    InATileRenderer.renderPart = function (oRm, oControl) {
      if(oControl.getWidgetType()===WidgetType.pivot){
        oRm.write("<div");
        oRm.addClass("sapZenDshInATile");
        oRm.writeClasses();
        oRm.write(">");
        // dynamic data
        oRm.write("<div");
        oRm.addClass("sapZenDshInATileData");
        oRm.writeClasses();
        oRm.write(">");
        oRm.write("<div class='sapZenDshInATileIndication'>");
        // unit
        oRm.write("<br><div"); // br was added in order to solve the issue of all the combination of presentation options between Number - Arrow - Unit
        oRm.addClass("sapZenDshInATileNumberFactor");
        oRm.writeClasses();
        oRm.write(">");

        oRm.write("</div>");
        // closeing the sapZenDshInATileIndication scope
        oRm.write("</div>");
        oRm.write("<div");
        oRm.addClass("sapZenDshInATileNumber");
        oRm.writeClasses();

        oRm.write("</div>");
        // end of dynamic data
        oRm.write("</div>");
        // span element
        oRm.write("</div>");
      } else {
        oRm.openStart(
          "div"
        ).writeControlData(
          oControl
        ).class(
          "sapZenDshInATile"
        ).openEnd();
        if (oControl.getMicrochartBar && oControl.getMicrochartBar()) {
          oRm.renderControl(oControl.getMicrochartBar());
        } else {
          oControl.getInit().then(
            function () {
              oControl.invalidate();
            }
          );
        }
        oRm.close("div");
      }
    };
    return InATileRenderer;
  },
  true
);