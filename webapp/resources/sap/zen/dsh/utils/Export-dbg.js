/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/utils/Export",
  [
    "sap/zen/commons/thirdparty/lodash"
  ],
  function (_) {
    "use strict";
    function downloadExc(filename, text) {
      var byteString = window.atob(text);
      var ab = new window.ArrayBuffer(byteString.length);
      var ia = new window.Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      var blob = new window.Blob([ab], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      var sNavi = "navigator";
      if (window[sNavi].msSaveBlob) { // IE 10+
        window.navigator.msSaveBlob(blob, filename);
      } else {
        var element = document.createElement("a");
        var url = window.URL.createObjectURL(blob);
        element.href = url;
        element.download = filename;
        element.click();
        window.URL.revokeObjectURL(url);
      }
    }
    function download(filename, text) {
      var sNavi = "navigator";
      if (window[sNavi].msSaveBlob) { // IE 10+
        window.navigator.msSaveBlob(new window.Blob([text]), filename);
      } else {
        var element = document.createElement("a");
        element.setAttribute(
          "href", "data:text/plain;charset=utf-8," + encodeURIComponent(text)
        );
        element.setAttribute("download", filename);
        element.style.display = "none";
        /*eslint-disable sap-no-proprietary-browser-api */
        /*eslint-disable sap-no-dom-insertion*/
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        /*eslint-enable sap-no-proprietary-browser-api */
        /*eslint-enable sap-no-dom-insertion*/
      }
    }
    function exportSVG(sTitle, sSVG) {
      download(sTitle + ".svg", sSVG);
    }
    return {
      exportSVG: exportSVG,
      dowloadExcel: function (sContent, sTitle) {
        downloadExc([sTitle, "xlsx"].join("."), sContent);
      }
    };
  }
);
