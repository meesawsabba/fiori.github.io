/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  /**
   * KPI label formatting.
   * The KPI label is an abbreviation of the complete global KPI title. It is formed using the first three letters of the first three words of the KPI title.
   * If there is only one word in the global KPI title, the first three letters of the word are displayed.
   * If the KPI title has only two words, only the first letters of these two words are displayed.
   *
   * @param {string} kpiTitle KPI title value
   * @returns {string} The formatted criticality
   */
  var labelFormat = function (kpiTitle) {
    if (kpiTitle) {
      // Split the title in words
      var titleParts = kpiTitle.split(" ");
      var kpiLabel;

      if (titleParts.length === 1) {
        // Only 1 word --> first 3 capitalized letters of the word
        kpiLabel = titleParts[0].substring(0, 3).toUpperCase();
      } else if (titleParts.length === 2) {
        // 2 words --> first capitalized letters of these two words
        kpiLabel = (titleParts[0].substring(0, 1) + titleParts[1].substring(0, 1)).toUpperCase();
      } else {
        // 3 words or more --> first capitalized letters of the first 3 words
        kpiLabel = (titleParts[0].substring(0, 1) + titleParts[1].substring(0, 1) + titleParts[2].substring(0, 1)).toUpperCase();
      }

      return kpiLabel;
    } else {
      // No KPI title --> no label
      return "";
    }
  };

  labelFormat.__functionName = "sap.fe.core.formatters.KPIFormatter#labelFormat";
  /**
   * KPI tooltip formatting.
   *
   * @param kpiTitle KPI title
   * @param kpiValue KPI value
   * @param kpiUnit KPI unit or currency (can be undefined)
   * @param kpiStatus KPI status
   * @param hasUnit Is "true" if the KPI value has a unit or a currency
   * @returns Returns the text for the KPI tooltip.
   */

  var tooltipFormat = function (kpiTitle, kpiValue, kpiUnit, kpiStatus, hasUnit) {
    var resBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");
    var msgKey = kpiStatus ? "C_KPI_TOOLTIP_" + kpiStatus.toUpperCase() : "C_KPI_TOOLTIP_NONE";
    var amountWithUnit;

    if (hasUnit === "true") {
      if (!kpiUnit) {
        // No unit means multi-unit situation
        amountWithUnit = resBundle.getText("C_KPI_TOOLTIP_AMOUNT_MULTIUNIT");
      } else {
        amountWithUnit = kpiValue + " " + kpiUnit;
      }
    } else {
      amountWithUnit = kpiValue;
    }

    return resBundle.getText(msgKey, [kpiTitle, amountWithUnit]);
  };

  tooltipFormat.__functionName = "sap.fe.core.formatters.KPIFormatter#tooltipFormat"; // See https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters for more detail on this weird syntax

  /**
   * Collection of table formatters.
   *
   * @param {object} this The context
   * @param {string} sName The inner function name
   * @param {object[]} oArgs The inner function parameters
   * @returns {object} The value from the inner function
   */

  var kpiFormatters = function (sName) {
    if (kpiFormatters.hasOwnProperty(sName)) {
      for (var _len = arguments.length, oArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        oArgs[_key - 1] = arguments[_key];
      }

      return kpiFormatters[sName].apply(this, oArgs);
    } else {
      return "";
    }
  };

  kpiFormatters.labelFormat = labelFormat;
  kpiFormatters.tooltipFormat = tooltipFormat;
  /**
   * @global
   */

  return kpiFormatters;
}, true);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIktQSUZvcm1hdHRlci50cyJdLCJuYW1lcyI6WyJsYWJlbEZvcm1hdCIsImtwaVRpdGxlIiwidGl0bGVQYXJ0cyIsInNwbGl0Iiwia3BpTGFiZWwiLCJsZW5ndGgiLCJzdWJzdHJpbmciLCJ0b1VwcGVyQ2FzZSIsIl9fZnVuY3Rpb25OYW1lIiwidG9vbHRpcEZvcm1hdCIsImtwaVZhbHVlIiwia3BpVW5pdCIsImtwaVN0YXR1cyIsImhhc1VuaXQiLCJyZXNCdW5kbGUiLCJzYXAiLCJ1aSIsImdldENvcmUiLCJnZXRMaWJyYXJ5UmVzb3VyY2VCdW5kbGUiLCJtc2dLZXkiLCJhbW91bnRXaXRoVW5pdCIsImdldFRleHQiLCJrcGlGb3JtYXR0ZXJzIiwic05hbWUiLCJoYXNPd25Qcm9wZXJ0eSIsIm9BcmdzIiwiYXBwbHkiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7Ozs7QUFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxNQUFNQSxXQUFXLEdBQUcsVUFBU0MsUUFBVCxFQUFtQztBQUN0RCxRQUFJQSxRQUFKLEVBQWM7QUFDYjtBQUNBLFVBQU1DLFVBQVUsR0FBR0QsUUFBUSxDQUFDRSxLQUFULENBQWUsR0FBZixDQUFuQjtBQUVBLFVBQUlDLFFBQUo7O0FBQ0EsVUFBSUYsVUFBVSxDQUFDRyxNQUFYLEtBQXNCLENBQTFCLEVBQTZCO0FBQzVCO0FBQ0FELFFBQUFBLFFBQVEsR0FBR0YsVUFBVSxDQUFDLENBQUQsQ0FBVixDQUFjSSxTQUFkLENBQXdCLENBQXhCLEVBQTJCLENBQTNCLEVBQThCQyxXQUE5QixFQUFYO0FBQ0EsT0FIRCxNQUdPLElBQUlMLFVBQVUsQ0FBQ0csTUFBWCxLQUFzQixDQUExQixFQUE2QjtBQUNuQztBQUNBRCxRQUFBQSxRQUFRLEdBQUcsQ0FBQ0YsVUFBVSxDQUFDLENBQUQsQ0FBVixDQUFjSSxTQUFkLENBQXdCLENBQXhCLEVBQTJCLENBQTNCLElBQWdDSixVQUFVLENBQUMsQ0FBRCxDQUFWLENBQWNJLFNBQWQsQ0FBd0IsQ0FBeEIsRUFBMkIsQ0FBM0IsQ0FBakMsRUFBZ0VDLFdBQWhFLEVBQVg7QUFDQSxPQUhNLE1BR0E7QUFDTjtBQUNBSCxRQUFBQSxRQUFRLEdBQUcsQ0FBQ0YsVUFBVSxDQUFDLENBQUQsQ0FBVixDQUFjSSxTQUFkLENBQXdCLENBQXhCLEVBQTJCLENBQTNCLElBQWdDSixVQUFVLENBQUMsQ0FBRCxDQUFWLENBQWNJLFNBQWQsQ0FBd0IsQ0FBeEIsRUFBMkIsQ0FBM0IsQ0FBaEMsR0FBZ0VKLFVBQVUsQ0FBQyxDQUFELENBQVYsQ0FBY0ksU0FBZCxDQUF3QixDQUF4QixFQUEyQixDQUEzQixDQUFqRSxFQUFnR0MsV0FBaEcsRUFBWDtBQUNBOztBQUVELGFBQU9ILFFBQVA7QUFDQSxLQWpCRCxNQWlCTztBQUNOO0FBQ0EsYUFBTyxFQUFQO0FBQ0E7QUFDRCxHQXRCRDs7QUF1QkFKLEVBQUFBLFdBQVcsQ0FBQ1EsY0FBWixHQUE2QixpREFBN0I7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxNQUFNQyxhQUFhLEdBQUcsVUFBU1IsUUFBVCxFQUEyQlMsUUFBM0IsRUFBNkNDLE9BQTdDLEVBQThEQyxTQUE5RCxFQUFpRkMsT0FBakYsRUFBMEc7QUFDL0gsUUFBTUMsU0FBUyxHQUFHQyxHQUFHLENBQUNDLEVBQUosQ0FBT0MsT0FBUCxHQUFpQkMsd0JBQWpCLENBQTBDLGFBQTFDLENBQWxCO0FBQ0EsUUFBTUMsTUFBTSxHQUFHUCxTQUFTLEdBQUcsbUJBQW1CQSxTQUFTLENBQUNMLFdBQVYsRUFBdEIsR0FBZ0Qsb0JBQXhFO0FBQ0EsUUFBSWEsY0FBSjs7QUFDQSxRQUFJUCxPQUFPLEtBQUssTUFBaEIsRUFBd0I7QUFDdkIsVUFBSSxDQUFDRixPQUFMLEVBQWM7QUFDYjtBQUNBUyxRQUFBQSxjQUFjLEdBQUdOLFNBQVMsQ0FBQ08sT0FBVixDQUFrQixnQ0FBbEIsQ0FBakI7QUFDQSxPQUhELE1BR087QUFDTkQsUUFBQUEsY0FBYyxHQUFHVixRQUFRLEdBQUcsR0FBWCxHQUFpQkMsT0FBbEM7QUFDQTtBQUNELEtBUEQsTUFPTztBQUNOUyxNQUFBQSxjQUFjLEdBQUdWLFFBQWpCO0FBQ0E7O0FBRUQsV0FBT0ksU0FBUyxDQUFDTyxPQUFWLENBQWtCRixNQUFsQixFQUEwQixDQUFDbEIsUUFBRCxFQUFXbUIsY0FBWCxDQUExQixDQUFQO0FBQ0EsR0FoQkQ7O0FBaUJBWCxFQUFBQSxhQUFhLENBQUNELGNBQWQsR0FBK0IsbURBQS9CLEMsQ0FFQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLE1BQU1jLGFBQWEsR0FBRyxVQUF1QkMsS0FBdkIsRUFBNEQ7QUFDakYsUUFBSUQsYUFBYSxDQUFDRSxjQUFkLENBQTZCRCxLQUE3QixDQUFKLEVBQXlDO0FBQUEsd0NBRHFCRSxLQUNyQjtBQURxQkEsUUFBQUEsS0FDckI7QUFBQTs7QUFDeEMsYUFBUUgsYUFBRCxDQUF1QkMsS0FBdkIsRUFBOEJHLEtBQTlCLENBQW9DLElBQXBDLEVBQTBDRCxLQUExQyxDQUFQO0FBQ0EsS0FGRCxNQUVPO0FBQ04sYUFBTyxFQUFQO0FBQ0E7QUFDRCxHQU5EOztBQVFBSCxFQUFBQSxhQUFhLENBQUN0QixXQUFkLEdBQTRCQSxXQUE1QjtBQUNBc0IsRUFBQUEsYUFBYSxDQUFDYixhQUFkLEdBQThCQSxhQUE5QjtBQUVBO0FBQ0E7QUFDQTs7U0FDZWEsYSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBLUEkgbGFiZWwgZm9ybWF0dGluZy5cbiAqIFRoZSBLUEkgbGFiZWwgaXMgYW4gYWJicmV2aWF0aW9uIG9mIHRoZSBjb21wbGV0ZSBnbG9iYWwgS1BJIHRpdGxlLiBJdCBpcyBmb3JtZWQgdXNpbmcgdGhlIGZpcnN0IHRocmVlIGxldHRlcnMgb2YgdGhlIGZpcnN0IHRocmVlIHdvcmRzIG9mIHRoZSBLUEkgdGl0bGUuXG4gKiBJZiB0aGVyZSBpcyBvbmx5IG9uZSB3b3JkIGluIHRoZSBnbG9iYWwgS1BJIHRpdGxlLCB0aGUgZmlyc3QgdGhyZWUgbGV0dGVycyBvZiB0aGUgd29yZCBhcmUgZGlzcGxheWVkLlxuICogSWYgdGhlIEtQSSB0aXRsZSBoYXMgb25seSB0d28gd29yZHMsIG9ubHkgdGhlIGZpcnN0IGxldHRlcnMgb2YgdGhlc2UgdHdvIHdvcmRzIGFyZSBkaXNwbGF5ZWQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtwaVRpdGxlIEtQSSB0aXRsZSB2YWx1ZVxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCBjcml0aWNhbGl0eVxuICovXG5cbmNvbnN0IGxhYmVsRm9ybWF0ID0gZnVuY3Rpb24oa3BpVGl0bGU6IHN0cmluZyk6IHN0cmluZyB7XG5cdGlmIChrcGlUaXRsZSkge1xuXHRcdC8vIFNwbGl0IHRoZSB0aXRsZSBpbiB3b3Jkc1xuXHRcdGNvbnN0IHRpdGxlUGFydHMgPSBrcGlUaXRsZS5zcGxpdChcIiBcIik7XG5cblx0XHRsZXQga3BpTGFiZWw6IHN0cmluZztcblx0XHRpZiAodGl0bGVQYXJ0cy5sZW5ndGggPT09IDEpIHtcblx0XHRcdC8vIE9ubHkgMSB3b3JkIC0tPiBmaXJzdCAzIGNhcGl0YWxpemVkIGxldHRlcnMgb2YgdGhlIHdvcmRcblx0XHRcdGtwaUxhYmVsID0gdGl0bGVQYXJ0c1swXS5zdWJzdHJpbmcoMCwgMykudG9VcHBlckNhc2UoKTtcblx0XHR9IGVsc2UgaWYgKHRpdGxlUGFydHMubGVuZ3RoID09PSAyKSB7XG5cdFx0XHQvLyAyIHdvcmRzIC0tPiBmaXJzdCBjYXBpdGFsaXplZCBsZXR0ZXJzIG9mIHRoZXNlIHR3byB3b3Jkc1xuXHRcdFx0a3BpTGFiZWwgPSAodGl0bGVQYXJ0c1swXS5zdWJzdHJpbmcoMCwgMSkgKyB0aXRsZVBhcnRzWzFdLnN1YnN0cmluZygwLCAxKSkudG9VcHBlckNhc2UoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gMyB3b3JkcyBvciBtb3JlIC0tPiBmaXJzdCBjYXBpdGFsaXplZCBsZXR0ZXJzIG9mIHRoZSBmaXJzdCAzIHdvcmRzXG5cdFx0XHRrcGlMYWJlbCA9ICh0aXRsZVBhcnRzWzBdLnN1YnN0cmluZygwLCAxKSArIHRpdGxlUGFydHNbMV0uc3Vic3RyaW5nKDAsIDEpICsgdGl0bGVQYXJ0c1syXS5zdWJzdHJpbmcoMCwgMSkpLnRvVXBwZXJDYXNlKCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGtwaUxhYmVsO1xuXHR9IGVsc2Uge1xuXHRcdC8vIE5vIEtQSSB0aXRsZSAtLT4gbm8gbGFiZWxcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxufTtcbmxhYmVsRm9ybWF0Ll9fZnVuY3Rpb25OYW1lID0gXCJzYXAuZmUuY29yZS5mb3JtYXR0ZXJzLktQSUZvcm1hdHRlciNsYWJlbEZvcm1hdFwiO1xuXG4vKipcbiAqIEtQSSB0b29sdGlwIGZvcm1hdHRpbmcuXG4gKlxuICogQHBhcmFtIGtwaVRpdGxlIEtQSSB0aXRsZVxuICogQHBhcmFtIGtwaVZhbHVlIEtQSSB2YWx1ZVxuICogQHBhcmFtIGtwaVVuaXQgS1BJIHVuaXQgb3IgY3VycmVuY3kgKGNhbiBiZSB1bmRlZmluZWQpXG4gKiBAcGFyYW0ga3BpU3RhdHVzIEtQSSBzdGF0dXNcbiAqIEBwYXJhbSBoYXNVbml0IElzIFwidHJ1ZVwiIGlmIHRoZSBLUEkgdmFsdWUgaGFzIGEgdW5pdCBvciBhIGN1cnJlbmN5XG4gKiBAcmV0dXJucyBSZXR1cm5zIHRoZSB0ZXh0IGZvciB0aGUgS1BJIHRvb2x0aXAuXG4gKi9cbmNvbnN0IHRvb2x0aXBGb3JtYXQgPSBmdW5jdGlvbihrcGlUaXRsZTogc3RyaW5nLCBrcGlWYWx1ZTogc3RyaW5nLCBrcGlVbml0OiBzdHJpbmcsIGtwaVN0YXR1czogc3RyaW5nLCBoYXNVbml0OiBzdHJpbmcpOiBzdHJpbmcge1xuXHRjb25zdCByZXNCdW5kbGUgPSBzYXAudWkuZ2V0Q29yZSgpLmdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZShcInNhcC5mZS5jb3JlXCIpO1xuXHRjb25zdCBtc2dLZXkgPSBrcGlTdGF0dXMgPyBcIkNfS1BJX1RPT0xUSVBfXCIgKyBrcGlTdGF0dXMudG9VcHBlckNhc2UoKSA6IFwiQ19LUElfVE9PTFRJUF9OT05FXCI7XG5cdGxldCBhbW91bnRXaXRoVW5pdDogc3RyaW5nO1xuXHRpZiAoaGFzVW5pdCA9PT0gXCJ0cnVlXCIpIHtcblx0XHRpZiAoIWtwaVVuaXQpIHtcblx0XHRcdC8vIE5vIHVuaXQgbWVhbnMgbXVsdGktdW5pdCBzaXR1YXRpb25cblx0XHRcdGFtb3VudFdpdGhVbml0ID0gcmVzQnVuZGxlLmdldFRleHQoXCJDX0tQSV9UT09MVElQX0FNT1VOVF9NVUxUSVVOSVRcIik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGFtb3VudFdpdGhVbml0ID0ga3BpVmFsdWUgKyBcIiBcIiArIGtwaVVuaXQ7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGFtb3VudFdpdGhVbml0ID0ga3BpVmFsdWU7XG5cdH1cblxuXHRyZXR1cm4gcmVzQnVuZGxlLmdldFRleHQobXNnS2V5LCBba3BpVGl0bGUsIGFtb3VudFdpdGhVbml0XSk7XG59O1xudG9vbHRpcEZvcm1hdC5fX2Z1bmN0aW9uTmFtZSA9IFwic2FwLmZlLmNvcmUuZm9ybWF0dGVycy5LUElGb3JtYXR0ZXIjdG9vbHRpcEZvcm1hdFwiO1xuXG4vLyBTZWUgaHR0cHM6Ly93d3cudHlwZXNjcmlwdGxhbmcub3JnL2RvY3MvaGFuZGJvb2svZnVuY3Rpb25zLmh0bWwjdGhpcy1wYXJhbWV0ZXJzIGZvciBtb3JlIGRldGFpbCBvbiB0aGlzIHdlaXJkIHN5bnRheFxuLyoqXG4gKiBDb2xsZWN0aW9uIG9mIHRhYmxlIGZvcm1hdHRlcnMuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHRoaXMgVGhlIGNvbnRleHRcbiAqIEBwYXJhbSB7c3RyaW5nfSBzTmFtZSBUaGUgaW5uZXIgZnVuY3Rpb24gbmFtZVxuICogQHBhcmFtIHtvYmplY3RbXX0gb0FyZ3MgVGhlIGlubmVyIGZ1bmN0aW9uIHBhcmFtZXRlcnNcbiAqIEByZXR1cm5zIHtvYmplY3R9IFRoZSB2YWx1ZSBmcm9tIHRoZSBpbm5lciBmdW5jdGlvblxuICovXG5jb25zdCBrcGlGb3JtYXR0ZXJzID0gZnVuY3Rpb24odGhpczogb2JqZWN0LCBzTmFtZTogc3RyaW5nLCAuLi5vQXJnczogYW55W10pOiBhbnkge1xuXHRpZiAoa3BpRm9ybWF0dGVycy5oYXNPd25Qcm9wZXJ0eShzTmFtZSkpIHtcblx0XHRyZXR1cm4gKGtwaUZvcm1hdHRlcnMgYXMgYW55KVtzTmFtZV0uYXBwbHkodGhpcywgb0FyZ3MpO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG59O1xuXG5rcGlGb3JtYXR0ZXJzLmxhYmVsRm9ybWF0ID0gbGFiZWxGb3JtYXQ7XG5rcGlGb3JtYXR0ZXJzLnRvb2x0aXBGb3JtYXQgPSB0b29sdGlwRm9ybWF0O1xuXG4vKipcbiAqIEBnbG9iYWxcbiAqL1xuZXhwb3J0IGRlZmF1bHQga3BpRm9ybWF0dGVycztcbiJdfQ==