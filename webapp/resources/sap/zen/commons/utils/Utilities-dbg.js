/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  [
   "sap/zen/commons/utils/jQuery",
    "sap/base/Log"
  ],
  function (jQuery, Log) {
    "use strict";
    var Utilities = function () {
      var that = this;
      that.trunc = Math.trunc || function (x) {
        return isNaN(x) ? NaN : (x > 0 ? Math.floor(x) : Math.ceil(x));
      };
      jQuery.fn.viewportHeight = function () {
        var oDE = this.get(0);
        if(!oDE){
          return null;
        }
        var nOH = this.outerHeight();
        var nH  = jQuery(window).height();
        var oR = oDE.getBoundingClientRect();
        var t=oR.top;
        var b=oR.bottom;
        return Math.max(
          0, t>0? Math.min(nOH, nH-t) : Math.min(b, nH)
        );
      };
      jQuery.fn.sizeChanged = function (handleFunction) {
        var $element = this;
        var oInterval = setInterval(
          function () {
            if ($element.data("_ffHandling")) {
              return;
            }
            $element.data("_ffHandling",true);
            var nH = $element.viewportHeight();
            var nW = $element.width();
            if (nH === 0) {
              nH = jQuery(["#", $element.attr("id")].join("")).height();
            }
            if (nW === 0) {
              nW = jQuery(["#", $element.attr("id")].join("")).width();
            }
            if (
              !($element.data("lw") === nW && $element.data("lh") === nH) &&
                typeof handleFunction === "function"
            ) {
              try {
                if (
                  !handleFunction(
                    {
                      lastWidth: $element.data("lw"),
                      lastHeight: $element.data("lh"),
                      width: nW,
                      height: nH
                    }
                  )
                ) {
                  clearInterval(oInterval);
                }
              } catch (oExc) {
                clearInterval(oInterval);
                Log.error(oExc);
              }
              $element.data("lw",nW);
              $element.data("lh",nH);
            }
            $element.data("_ffHandling",false);
          },
          100
        );
        return $element;
      };
    };
    return new Utilities();
  }
);
