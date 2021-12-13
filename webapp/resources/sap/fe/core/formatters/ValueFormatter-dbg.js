/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  /**
   * Collection of table formatters.
   *
   * @param {object} this The context
   * @param {string} sName The inner function name
   * @param {object[]} oArgs The inner function parameters
   * @returns {object} The value from the inner function
   */
  var valueFormatters = function (sName) {
    if (valueFormatters.hasOwnProperty(sName)) {
      for (var _len = arguments.length, oArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        oArgs[_key - 1] = arguments[_key];
      }

      return valueFormatters[sName].apply(this, oArgs);
    } else {
      return "";
    }
  };

  var formatWithBrackets = function (firstPart, secondPart) {
    if (firstPart && secondPart) {
      return sap.ui.getCore().getLibraryResourceBundle("sap.fe.core").getText("C_FORMAT_FOR_TEXT_ARRANGEMENT", [firstPart, secondPart]);
    } else {
      return firstPart || secondPart || "";
    }
  };

  formatWithBrackets.__functionName = "sap.fe.core.formatters.ValueFormatter#formatWithBrackets";

  var formatWithPercentage = function (sValue) {
    return sValue !== null && sValue !== undefined ? sValue + " %" : "";
  };

  formatWithPercentage.__functionName = "sap.fe.core.formatters.ValueFormatter#formatWithPercentage";

  var computePercentage = function (value, target, sUnit) {
    var sPercentString;
    var iValue = typeof value === "string" ? parseFloat(value) : value;
    var iTarget = typeof target === "string" ? parseFloat(target) : target;

    if (sUnit === "%") {
      if (iValue > 100) {
        sPercentString = "100";
      } else if (iValue < 0) {
        sPercentString = "0";
      } else {
        sPercentString = typeof value === "string" ? value : value === null || value === void 0 ? void 0 : value.toString();
      }
    } else if (iValue > iTarget) {
      sPercentString = "100";
    } else if (iValue < 0) {
      sPercentString = "0";
    } else {
      sPercentString = iValue && iTarget ? (iValue / iTarget * 100).toString() : "";
    }

    return sPercentString;
  };

  computePercentage.__functionName = "sap.fe.core.formatters.ValueFormatter#computePercentage";

  var formatCriticalityIcon = function (val) {
    var sIcon;

    if (val === "UI.CriticalityType/Negative" || val === "1" || val === 1) {
      sIcon = "sap-icon://message-error";
    } else if (val === "UI.CriticalityType/Critical" || val === "2" || val === 2) {
      sIcon = "sap-icon://message-warning";
    } else if (val === "UI.CriticalityType/Positive" || val === "3" || val === 3) {
      sIcon = "sap-icon://message-success";
    } else if (val === "UI.CriticalityType/Information" || val === "5" || val === 5) {
      sIcon = "sap-icon://message-information";
    } else {
      sIcon = "";
    }

    return sIcon;
  };

  formatCriticalityIcon.__functionName = "sap.fe.core.formatters.ValueFormatter#formatCriticalityIcon";
  _exports.formatCriticalityIcon = formatCriticalityIcon;

  var formatCriticalityValueState = function (val) {
    var sValueState;

    if (val === "UI.CriticalityType/Negative" || val === "1" || val === 1) {
      sValueState = "Error";
    } else if (val === "UI.CriticalityType/Critical" || val === "2" || val === 2) {
      sValueState = "Warning";
    } else if (val === "UI.CriticalityType/Positive" || val === "3" || val === 3) {
      sValueState = "Success";
    } else if (val === "UI.CriticalityType/Information" || val === "5" || val === 5) {
      sValueState = "Indication05";
    } else {
      sValueState = "None";
    }

    return sValueState;
  };

  formatCriticalityValueState.__functionName = "sap.fe.core.formatters.ValueFormatter#formatCriticalityValueState";
  _exports.formatCriticalityValueState = formatCriticalityValueState;

  var formatCriticalityButtonType = function (val) {
    var sType;

    if (val === "UI.CriticalityType/Negative" || val === "1" || val === 1) {
      sType = "Reject";
    } else if (val === "UI.CriticalityType/Positive" || val === "3" || val === 3) {
      sType = "Accept";
    } else {
      sType = "Default";
    }

    return sType;
  };

  formatCriticalityButtonType.__functionName = "sap.fe.core.formatters.ValueFormatter#formatCriticalityButtonType";
  _exports.formatCriticalityButtonType = formatCriticalityButtonType;

  var formatCriticalityColorMicroChart = function (val) {
    var sColor;

    if (val === "UI.CriticalityType/Negative" || val === "1" || val === 1) {
      sColor = "Error";
    } else if (val === "UI.CriticalityType/Critical" || val === "2" || val === 2) {
      sColor = "Critical";
    } else if (val === "UI.CriticalityType/Positive" || val === "3" || val === 3) {
      sColor = "Good";
    } else {
      sColor = "Neutral";
    }

    return sColor;
  };

  formatCriticalityColorMicroChart.__functionName = "sap.fe.core.formatters.ValueFormatter#formatCriticalityColorMicroChart";
  _exports.formatCriticalityColorMicroChart = formatCriticalityColorMicroChart;
  valueFormatters.formatWithBrackets = formatWithBrackets;
  valueFormatters.formatWithPercentage = formatWithPercentage;
  valueFormatters.computePercentage = computePercentage;
  valueFormatters.formatCriticalityIcon = formatCriticalityIcon;
  valueFormatters.formatCriticalityValueState = formatCriticalityValueState;
  valueFormatters.formatCriticalityButtonType = formatCriticalityButtonType;
  valueFormatters.formatCriticalityColorMicroChart = formatCriticalityColorMicroChart;
  /**
   * @global
   */

  return valueFormatters;
}, true);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlZhbHVlRm9ybWF0dGVyLnRzIl0sIm5hbWVzIjpbInZhbHVlRm9ybWF0dGVycyIsInNOYW1lIiwiaGFzT3duUHJvcGVydHkiLCJvQXJncyIsImFwcGx5IiwiZm9ybWF0V2l0aEJyYWNrZXRzIiwiZmlyc3RQYXJ0Iiwic2Vjb25kUGFydCIsInNhcCIsInVpIiwiZ2V0Q29yZSIsImdldExpYnJhcnlSZXNvdXJjZUJ1bmRsZSIsImdldFRleHQiLCJfX2Z1bmN0aW9uTmFtZSIsImZvcm1hdFdpdGhQZXJjZW50YWdlIiwic1ZhbHVlIiwidW5kZWZpbmVkIiwiY29tcHV0ZVBlcmNlbnRhZ2UiLCJ2YWx1ZSIsInRhcmdldCIsInNVbml0Iiwic1BlcmNlbnRTdHJpbmciLCJpVmFsdWUiLCJwYXJzZUZsb2F0IiwiaVRhcmdldCIsInRvU3RyaW5nIiwiZm9ybWF0Q3JpdGljYWxpdHlJY29uIiwidmFsIiwic0ljb24iLCJmb3JtYXRDcml0aWNhbGl0eVZhbHVlU3RhdGUiLCJzVmFsdWVTdGF0ZSIsImZvcm1hdENyaXRpY2FsaXR5QnV0dG9uVHlwZSIsInNUeXBlIiwiZm9ybWF0Q3JpdGljYWxpdHlDb2xvck1pY3JvQ2hhcnQiLCJzQ29sb3IiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7Ozs7OztBQUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNQSxlQUFlLEdBQUcsVUFBdUJDLEtBQXZCLEVBQTREO0FBQ25GLFFBQUlELGVBQWUsQ0FBQ0UsY0FBaEIsQ0FBK0JELEtBQS9CLENBQUosRUFBMkM7QUFBQSx3Q0FEcUJFLEtBQ3JCO0FBRHFCQSxRQUFBQSxLQUNyQjtBQUFBOztBQUMxQyxhQUFRSCxlQUFELENBQXlCQyxLQUF6QixFQUFnQ0csS0FBaEMsQ0FBc0MsSUFBdEMsRUFBNENELEtBQTVDLENBQVA7QUFDQSxLQUZELE1BRU87QUFDTixhQUFPLEVBQVA7QUFDQTtBQUNELEdBTkQ7O0FBUUEsTUFBTUUsa0JBQWtCLEdBQUcs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LEVBQUFBLGVBQWUsQ0FBQ0ssa0JBQWhCLEdBQXFDQSxrQkFBckM7QUFDQUwsRUFBQUEsZUFBZSxDQUFDYyxvQkFBaEIsR0FBdUNBLG9CQUF2QztBQUNBZCxFQUFBQSxlQUFlLENBQUNpQixpQkFBaEIsR0FBb0NBLGlCQUFwQztBQUNBakIsRUFBQUEsZUFBZSxDQUFDMEIscUJBQWhCLEdBQXdDQSxxQkFBeEM7QUFDQTFCLEVBQUFBLGVBQWUsQ0FBQzZCLDJCQUFoQixHQUE4Q0EsMkJBQTlDO0FBQ0E3QixFQUFBQSxlQUFlLENBQUMrQiwyQkFBaEIsR0FBOENBLDJCQUE5QztBQUNBL0IsRUFBQUEsZUFBZSxDQUFDaUMsZ0NBQWhCLEdBQW1EQSxnQ0FBbkQ7QUFDQTtBQUNBO0FBQ0E7O1NBQ2VqQyxlIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvbGxlY3Rpb24gb2YgdGFibGUgZm9ybWF0dGVycy5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gdGhpcyBUaGUgY29udGV4dFxuICogQHBhcmFtIHtzdHJpbmd9IHNOYW1lIFRoZSBpbm5lciBmdW5jdGlvbiBuYW1lXG4gKiBAcGFyYW0ge29iamVjdFtdfSBvQXJncyBUaGUgaW5uZXIgZnVuY3Rpb24gcGFyYW1ldGVyc1xuICogQHJldHVybnMge29iamVjdH0gVGhlIHZhbHVlIGZyb20gdGhlIGlubmVyIGZ1bmN0aW9uXG4gKi9cbmNvbnN0IHZhbHVlRm9ybWF0dGVycyA9IGZ1bmN0aW9uKHRoaXM6IG9iamVjdCwgc05hbWU6IHN0cmluZywgLi4ub0FyZ3M6IGFueVtdKTogYW55IHtcblx0aWYgKHZhbHVlRm9ybWF0dGVycy5oYXNPd25Qcm9wZXJ0eShzTmFtZSkpIHtcblx0XHRyZXR1cm4gKHZhbHVlRm9ybWF0dGVycyBhcyBhbnkpW3NOYW1lXS5hcHBseSh0aGlzLCBvQXJncyk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cbn07XG5cbmNvbnN0IGZvcm1hdFdpdGhCcmFja2V0cyA9IChmaXJzdFBhcnQ/OiBzdHJpbmcsIHNlY29uZFBhcnQ/OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuXHRpZiAoZmlyc3RQYXJ0ICYmIHNlY29uZFBhcnQpIHtcblx0XHRyZXR1cm4gc2FwLnVpXG5cdFx0XHQuZ2V0Q29yZSgpXG5cdFx0XHQuZ2V0TGlicmFyeVJlc291cmNlQnVuZGxlKFwic2FwLmZlLmNvcmVcIilcblx0XHRcdC5nZXRUZXh0KFwiQ19GT1JNQVRfRk9SX1RFWFRfQVJSQU5HRU1FTlRcIiwgW2ZpcnN0UGFydCwgc2Vjb25kUGFydF0pO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBmaXJzdFBhcnQgfHwgc2Vjb25kUGFydCB8fCBcIlwiO1xuXHR9XG59O1xuZm9ybWF0V2l0aEJyYWNrZXRzLl9fZnVuY3Rpb25OYW1lID0gXCJzYXAuZmUuY29yZS5mb3JtYXR0ZXJzLlZhbHVlRm9ybWF0dGVyI2Zvcm1hdFdpdGhCcmFja2V0c1wiO1xuXG5jb25zdCBmb3JtYXRXaXRoUGVyY2VudGFnZSA9IChzVmFsdWU/OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuXHRyZXR1cm4gc1ZhbHVlICE9PSBudWxsICYmIHNWYWx1ZSAhPT0gdW5kZWZpbmVkID8gc1ZhbHVlICsgXCIgJVwiIDogXCJcIjtcbn07XG5mb3JtYXRXaXRoUGVyY2VudGFnZS5fX2Z1bmN0aW9uTmFtZSA9IFwic2FwLmZlLmNvcmUuZm9ybWF0dGVycy5WYWx1ZUZvcm1hdHRlciNmb3JtYXRXaXRoUGVyY2VudGFnZVwiO1xuXG5jb25zdCBjb21wdXRlUGVyY2VudGFnZSA9ICh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyLCB0YXJnZXQ6IHN0cmluZyB8IG51bWJlciwgc1VuaXQ/OiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xuXHRsZXQgc1BlcmNlbnRTdHJpbmc6IHN0cmluZztcblx0Y29uc3QgaVZhbHVlOiBudW1iZXIgPSB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgPyBwYXJzZUZsb2F0KHZhbHVlKSA6IHZhbHVlO1xuXHRjb25zdCBpVGFyZ2V0OiBudW1iZXIgPSB0eXBlb2YgdGFyZ2V0ID09PSBcInN0cmluZ1wiID8gcGFyc2VGbG9hdCh0YXJnZXQpIDogdGFyZ2V0O1xuXG5cdGlmIChzVW5pdCA9PT0gXCIlXCIpIHtcblx0XHRpZiAoaVZhbHVlID4gMTAwKSB7XG5cdFx0XHRzUGVyY2VudFN0cmluZyA9IFwiMTAwXCI7XG5cdFx0fSBlbHNlIGlmIChpVmFsdWUgPCAwKSB7XG5cdFx0XHRzUGVyY2VudFN0cmluZyA9IFwiMFwiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzUGVyY2VudFN0cmluZyA9IHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiA/IHZhbHVlIDogdmFsdWU/LnRvU3RyaW5nKCk7XG5cdFx0fVxuXHR9IGVsc2UgaWYgKGlWYWx1ZSA+IGlUYXJnZXQpIHtcblx0XHRzUGVyY2VudFN0cmluZyA9IFwiMTAwXCI7XG5cdH0gZWxzZSBpZiAoaVZhbHVlIDwgMCkge1xuXHRcdHNQZXJjZW50U3RyaW5nID0gXCIwXCI7XG5cdH0gZWxzZSB7XG5cdFx0c1BlcmNlbnRTdHJpbmcgPSBpVmFsdWUgJiYgaVRhcmdldCA/ICgoaVZhbHVlIC8gaVRhcmdldCkgKiAxMDApLnRvU3RyaW5nKCkgOiBcIlwiO1xuXHR9XG5cdHJldHVybiBzUGVyY2VudFN0cmluZztcbn07XG5jb21wdXRlUGVyY2VudGFnZS5fX2Z1bmN0aW9uTmFtZSA9IFwic2FwLmZlLmNvcmUuZm9ybWF0dGVycy5WYWx1ZUZvcm1hdHRlciNjb21wdXRlUGVyY2VudGFnZVwiO1xuXG5leHBvcnQgY29uc3QgZm9ybWF0Q3JpdGljYWxpdHlJY29uID0gKHZhbD86IHN0cmluZyB8IG51bWJlcik6IHN0cmluZyB8IHVuZGVmaW5lZCA9PiB7XG5cdGxldCBzSWNvbjogc3RyaW5nO1xuXHRpZiAodmFsID09PSBcIlVJLkNyaXRpY2FsaXR5VHlwZS9OZWdhdGl2ZVwiIHx8IHZhbCA9PT0gXCIxXCIgfHwgdmFsID09PSAxKSB7XG5cdFx0c0ljb24gPSBcInNhcC1pY29uOi8vbWVzc2FnZS1lcnJvclwiO1xuXHR9IGVsc2UgaWYgKHZhbCA9PT0gXCJVSS5Dcml0aWNhbGl0eVR5cGUvQ3JpdGljYWxcIiB8fCB2YWwgPT09IFwiMlwiIHx8IHZhbCA9PT0gMikge1xuXHRcdHNJY29uID0gXCJzYXAtaWNvbjovL21lc3NhZ2Utd2FybmluZ1wiO1xuXHR9IGVsc2UgaWYgKHZhbCA9PT0gXCJVSS5Dcml0aWNhbGl0eVR5cGUvUG9zaXRpdmVcIiB8fCB2YWwgPT09IFwiM1wiIHx8IHZhbCA9PT0gMykge1xuXHRcdHNJY29uID0gXCJzYXAtaWNvbjovL21lc3NhZ2Utc3VjY2Vzc1wiO1xuXHR9IGVsc2UgaWYgKHZhbCA9PT0gXCJVSS5Dcml0aWNhbGl0eVR5cGUvSW5mb3JtYXRpb25cIiB8fCB2YWwgPT09IFwiNVwiIHx8IHZhbCA9PT0gNSkge1xuXHRcdHNJY29uID0gXCJzYXAtaWNvbjovL21lc3NhZ2UtaW5mb3JtYXRpb25cIjtcblx0fSBlbHNlIHtcblx0XHRzSWNvbiA9IFwiXCI7XG5cdH1cblx0cmV0dXJuIHNJY29uO1xufTtcbmZvcm1hdENyaXRpY2FsaXR5SWNvbi5fX2Z1bmN0aW9uTmFtZSA9IFwic2FwLmZlLmNvcmUuZm9ybWF0dGVycy5WYWx1ZUZvcm1hdHRlciNmb3JtYXRDcml0aWNhbGl0eUljb25cIjtcblxuZXhwb3J0IGNvbnN0IGZvcm1hdENyaXRpY2FsaXR5VmFsdWVTdGF0ZSA9ICh2YWw/OiBzdHJpbmcgfCBudW1iZXIpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xuXHRsZXQgc1ZhbHVlU3RhdGU6IHN0cmluZztcblx0aWYgKHZhbCA9PT0gXCJVSS5Dcml0aWNhbGl0eVR5cGUvTmVnYXRpdmVcIiB8fCB2YWwgPT09IFwiMVwiIHx8IHZhbCA9PT0gMSkge1xuXHRcdHNWYWx1ZVN0YXRlID0gXCJFcnJvclwiO1xuXHR9IGVsc2UgaWYgKHZhbCA9PT0gXCJVSS5Dcml0aWNhbGl0eVR5cGUvQ3JpdGljYWxcIiB8fCB2YWwgPT09IFwiMlwiIHx8IHZhbCA9PT0gMikge1xuXHRcdHNWYWx1ZVN0YXRlID0gXCJXYXJuaW5nXCI7XG5cdH0gZWxzZSBpZiAodmFsID09PSBcIlVJLkNyaXRpY2FsaXR5VHlwZS9Qb3NpdGl2ZVwiIHx8IHZhbCA9PT0gXCIzXCIgfHwgdmFsID09PSAzKSB7XG5cdFx0c1ZhbHVlU3RhdGUgPSBcIlN1Y2Nlc3NcIjtcblx0fSBlbHNlIGlmICh2YWwgPT09IFwiVUkuQ3JpdGljYWxpdHlUeXBlL0luZm9ybWF0aW9uXCIgfHwgdmFsID09PSBcIjVcIiB8fCB2YWwgPT09IDUpIHtcblx0XHRzVmFsdWVTdGF0ZSA9IFwiSW5kaWNhdGlvbjA1XCI7XG5cdH0gZWxzZSB7XG5cdFx0c1ZhbHVlU3RhdGUgPSBcIk5vbmVcIjtcblx0fVxuXHRyZXR1cm4gc1ZhbHVlU3RhdGU7XG59O1xuZm9ybWF0Q3JpdGljYWxpdHlWYWx1ZVN0YXRlLl9fZnVuY3Rpb25OYW1lID0gXCJzYXAuZmUuY29yZS5mb3JtYXR0ZXJzLlZhbHVlRm9ybWF0dGVyI2Zvcm1hdENyaXRpY2FsaXR5VmFsdWVTdGF0ZVwiO1xuXG5leHBvcnQgY29uc3QgZm9ybWF0Q3JpdGljYWxpdHlCdXR0b25UeXBlID0gKHZhbD86IHN0cmluZyB8IG51bWJlcik6IHN0cmluZyB8IHVuZGVmaW5lZCA9PiB7XG5cdGxldCBzVHlwZTogc3RyaW5nO1xuXHRpZiAodmFsID09PSBcIlVJLkNyaXRpY2FsaXR5VHlwZS9OZWdhdGl2ZVwiIHx8IHZhbCA9PT0gXCIxXCIgfHwgdmFsID09PSAxKSB7XG5cdFx0c1R5cGUgPSBcIlJlamVjdFwiO1xuXHR9IGVsc2UgaWYgKHZhbCA9PT0gXCJVSS5Dcml0aWNhbGl0eVR5cGUvUG9zaXRpdmVcIiB8fCB2YWwgPT09IFwiM1wiIHx8IHZhbCA9PT0gMykge1xuXHRcdHNUeXBlID0gXCJBY2NlcHRcIjtcblx0fSBlbHNlIHtcblx0XHRzVHlwZSA9IFwiRGVmYXVsdFwiO1xuXHR9XG5cdHJldHVybiBzVHlwZTtcbn07XG5mb3JtYXRDcml0aWNhbGl0eUJ1dHRvblR5cGUuX19mdW5jdGlvbk5hbWUgPSBcInNhcC5mZS5jb3JlLmZvcm1hdHRlcnMuVmFsdWVGb3JtYXR0ZXIjZm9ybWF0Q3JpdGljYWxpdHlCdXR0b25UeXBlXCI7XG5cbmV4cG9ydCBjb25zdCBmb3JtYXRDcml0aWNhbGl0eUNvbG9yTWljcm9DaGFydCA9ICh2YWw/OiBzdHJpbmcgfCBudW1iZXIpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xuXHRsZXQgc0NvbG9yOiBzdHJpbmc7XG5cdGlmICh2YWwgPT09IFwiVUkuQ3JpdGljYWxpdHlUeXBlL05lZ2F0aXZlXCIgfHwgdmFsID09PSBcIjFcIiB8fCB2YWwgPT09IDEpIHtcblx0XHRzQ29sb3IgPSBcIkVycm9yXCI7XG5cdH0gZWxzZSBpZiAodmFsID09PSBcIlVJLkNyaXRpY2FsaXR5VHlwZS9Dcml0aWNhbFwiIHx8IHZhbCA9PT0gXCIyXCIgfHwgdmFsID09PSAyKSB7XG5cdFx0c0NvbG9yID0gXCJDcml0aWNhbFwiO1xuXHR9IGVsc2UgaWYgKHZhbCA9PT0gXCJVSS5Dcml0aWNhbGl0eVR5cGUvUG9zaXRpdmVcIiB8fCB2YWwgPT09IFwiM1wiIHx8IHZhbCA9PT0gMykge1xuXHRcdHNDb2xvciA9IFwiR29vZFwiO1xuXHR9IGVsc2Uge1xuXHRcdHNDb2xvciA9IFwiTmV1dHJhbFwiO1xuXHR9XG5cdHJldHVybiBzQ29sb3I7XG59O1xuZm9ybWF0Q3JpdGljYWxpdHlDb2xvck1pY3JvQ2hhcnQuX19mdW5jdGlvbk5hbWUgPSBcInNhcC5mZS5jb3JlLmZvcm1hdHRlcnMuVmFsdWVGb3JtYXR0ZXIjZm9ybWF0Q3JpdGljYWxpdHlDb2xvck1pY3JvQ2hhcnRcIjtcblxudmFsdWVGb3JtYXR0ZXJzLmZvcm1hdFdpdGhCcmFja2V0cyA9IGZvcm1hdFdpdGhCcmFja2V0cztcbnZhbHVlRm9ybWF0dGVycy5mb3JtYXRXaXRoUGVyY2VudGFnZSA9IGZvcm1hdFdpdGhQZXJjZW50YWdlO1xudmFsdWVGb3JtYXR0ZXJzLmNvbXB1dGVQZXJjZW50YWdlID0gY29tcHV0ZVBlcmNlbnRhZ2U7XG52YWx1ZUZvcm1hdHRlcnMuZm9ybWF0Q3JpdGljYWxpdHlJY29uID0gZm9ybWF0Q3JpdGljYWxpdHlJY29uO1xudmFsdWVGb3JtYXR0ZXJzLmZvcm1hdENyaXRpY2FsaXR5VmFsdWVTdGF0ZSA9IGZvcm1hdENyaXRpY2FsaXR5VmFsdWVTdGF0ZTtcbnZhbHVlRm9ybWF0dGVycy5mb3JtYXRDcml0aWNhbGl0eUJ1dHRvblR5cGUgPSBmb3JtYXRDcml0aWNhbGl0eUJ1dHRvblR5cGU7XG52YWx1ZUZvcm1hdHRlcnMuZm9ybWF0Q3JpdGljYWxpdHlDb2xvck1pY3JvQ2hhcnQgPSBmb3JtYXRDcml0aWNhbGl0eUNvbG9yTWljcm9DaGFydDtcbi8qKlxuICogQGdsb2JhbFxuICovXG5leHBvcnQgZGVmYXVsdCB2YWx1ZUZvcm1hdHRlcnM7XG4iXX0=