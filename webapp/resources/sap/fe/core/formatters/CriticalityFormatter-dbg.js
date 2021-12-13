/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/formatters/TableFormatterTypes"], function (TableFormatterTypes) {
  "use strict";

  var MessageType = TableFormatterTypes.MessageType;

  /**
   * criticality formatting
   *
   * @param {string|number} criticalityValue criticality value
   * @returns {object} The formatted criticality
   */
  var criticalityFormat = function (criticalityValue) {
    var criticalityProperty;

    if (typeof criticalityValue === "string") {
      return criticalityValue;
    }

    switch (criticalityValue) {
      case 1:
        criticalityProperty = MessageType.Error;
        break;

      case 2:
        criticalityProperty = MessageType.Warning;
        break;

      case 3:
        criticalityProperty = MessageType.Success;
        break;

      case 5:
        criticalityProperty = MessageType.Information;
        break;

      default:
        criticalityProperty = MessageType.None;
    }

    return criticalityProperty;
  };

  criticalityFormat.__functionName = "sap.fe.core.formatters.CriticalityFormatter#criticalityFormat"; // See https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters for more detail on this weird syntax

  /**
   * Collection of table formatters.
   *
   * @param {object} this The context
   * @param {string} sName The inner function name
   * @param {object[]} oArgs The inner function parameters
   * @returns {object} The value from the inner function
   */

  var criticalityFormatters = function (sName) {
    if (criticalityFormatters.hasOwnProperty(sName)) {
      for (var _len = arguments.length, oArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        oArgs[_key - 1] = arguments[_key];
      }

      return criticalityFormatters[sName].apply(this, oArgs);
    } else {
      return "";
    }
  };

  criticalityFormatters.criticalityFormat = criticalityFormat;
  /**
   * @global
   */

  return criticalityFormatters;
}, true);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNyaXRpY2FsaXR5Rm9ybWF0dGVyLnRzIl0sIm5hbWVzIjpbImNyaXRpY2FsaXR5Rm9ybWF0IiwiY3JpdGljYWxpdHlWYWx1ZSIsImNyaXRpY2FsaXR5UHJvcGVydHkiLCJNZXNzYWdlVHlwZSIsIkVycm9yIiwiV2FybmluZyIsIlN1Y2Nlc3MiLCJJbmZvcm1hdGlvbiIsIk5vbmUiLCJfX2Z1bmN0aW9uTmFtZSIsImNyaXRpY2FsaXR5Rm9ybWF0dGVycyIsInNOYW1lIiwiaGFzT3duUHJvcGVydHkiLCJvQXJncyIsImFwcGx5Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxNQUFNQSxpQkFBaUIsR0FBRyxVQUFTQyxnQkFBVCxFQUF5RDtBQUNsRixRQUFJQyxtQkFBSjs7QUFDQSxRQUFJLE9BQU9ELGdCQUFQLEtBQTRCLFFBQWhDLEVBQTBDO0FBQ3pDLGFBQVFBLGdCQUFSO0FBQ0E7O0FBQ0QsWUFBUUEsZ0JBQVI7QUFDQyxXQUFLLENBQUw7QUFDQ0MsUUFBQUEsbUJBQW1CLEdBQUdDLFdBQVcsQ0FBQ0MsS0FBbEM7QUFDQTs7QUFDRCxXQUFLLENBQUw7QUFDQ0YsUUFBQUEsbUJBQW1CLEdBQUdDLFdBQVcsQ0FBQ0UsT0FBbEM7QUFDQTs7QUFDRCxXQUFLLENBQUw7QUFDQ0gsUUFBQUEsbUJBQW1CLEdBQUdDLFdBQVcsQ0FBQ0csT0FBbEM7QUFDQTs7QUFDRCxXQUFLLENBQUw7QUFDQ0osUUFBQUEsbUJBQW1CLEdBQUdDLFdBQVcsQ0FBQ0ksV0FBbEM7QUFDQTs7QUFDRDtBQUNDTCxRQUFBQSxtQkFBbUIsR0FBR0MsV0FBVyxDQUFDSyxJQUFsQztBQWRGOztBQWlCQSxXQUFPTixtQkFBUDtBQUNBLEdBdkJEOztBQXdCQUYsRUFBQUEsaUJBQWlCLENBQUNTLGNBQWxCLEdBQW1DLCtEQUFuQyxDLENBRUE7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxNQUFNQyxxQkFBcUIsR0FBRyxVQUF1QkMsS0FBdkIsRUFBNEQ7QUFDekYsUUFBSUQscUJBQXFCLENBQUNFLGNBQXRCLENBQXFDRCxLQUFyQyxDQUFKLEVBQWlEO0FBQUEsd0NBRHFCRSxLQUNyQjtBQURxQkEsUUFBQUEsS0FDckI7QUFBQTs7QUFDaEQsYUFBUUgscUJBQUQsQ0FBK0JDLEtBQS9CLEVBQXNDRyxLQUF0QyxDQUE0QyxJQUE1QyxFQUFrREQsS0FBbEQsQ0FBUDtBQUNBLEtBRkQsTUFFTztBQUNOLGFBQU8sRUFBUDtBQUNBO0FBQ0QsR0FORDs7QUFRQUgsRUFBQUEscUJBQXFCLENBQUNWLGlCQUF0QixHQUEwQ0EsaUJBQTFDO0FBRUE7QUFDQTtBQUNBOztTQUNlVSxxQiIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWVzc2FnZVR5cGUgfSBmcm9tIFwic2FwL2ZlL2NvcmUvZm9ybWF0dGVycy9UYWJsZUZvcm1hdHRlclR5cGVzXCI7XG5cbi8qKlxuICogY3JpdGljYWxpdHkgZm9ybWF0dGluZ1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gY3JpdGljYWxpdHlWYWx1ZSBjcml0aWNhbGl0eSB2YWx1ZVxuICogQHJldHVybnMge29iamVjdH0gVGhlIGZvcm1hdHRlZCBjcml0aWNhbGl0eVxuICovXG5cbmNvbnN0IGNyaXRpY2FsaXR5Rm9ybWF0ID0gZnVuY3Rpb24oY3JpdGljYWxpdHlWYWx1ZTogc3RyaW5nIHwgbnVtYmVyKTogTWVzc2FnZVR5cGUge1xuXHRsZXQgY3JpdGljYWxpdHlQcm9wZXJ0eTtcblx0aWYgKHR5cGVvZiBjcml0aWNhbGl0eVZhbHVlID09PSBcInN0cmluZ1wiKSB7XG5cdFx0cmV0dXJuIChjcml0aWNhbGl0eVZhbHVlIGFzIHVua25vd24pIGFzIE1lc3NhZ2VUeXBlO1xuXHR9XG5cdHN3aXRjaCAoY3JpdGljYWxpdHlWYWx1ZSkge1xuXHRcdGNhc2UgMTpcblx0XHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5FcnJvcjtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgMjpcblx0XHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5XYXJuaW5nO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSAzOlxuXHRcdFx0Y3JpdGljYWxpdHlQcm9wZXJ0eSA9IE1lc3NhZ2VUeXBlLlN1Y2Nlc3M7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIDU6XG5cdFx0XHRjcml0aWNhbGl0eVByb3BlcnR5ID0gTWVzc2FnZVR5cGUuSW5mb3JtYXRpb247XG5cdFx0XHRicmVhaztcblx0XHRkZWZhdWx0OlxuXHRcdFx0Y3JpdGljYWxpdHlQcm9wZXJ0eSA9IE1lc3NhZ2VUeXBlLk5vbmU7XG5cdH1cblxuXHRyZXR1cm4gY3JpdGljYWxpdHlQcm9wZXJ0eTtcbn07XG5jcml0aWNhbGl0eUZvcm1hdC5fX2Z1bmN0aW9uTmFtZSA9IFwic2FwLmZlLmNvcmUuZm9ybWF0dGVycy5Dcml0aWNhbGl0eUZvcm1hdHRlciNjcml0aWNhbGl0eUZvcm1hdFwiO1xuXG4vLyBTZWUgaHR0cHM6Ly93d3cudHlwZXNjcmlwdGxhbmcub3JnL2RvY3MvaGFuZGJvb2svZnVuY3Rpb25zLmh0bWwjdGhpcy1wYXJhbWV0ZXJzIGZvciBtb3JlIGRldGFpbCBvbiB0aGlzIHdlaXJkIHN5bnRheFxuLyoqXG4gKiBDb2xsZWN0aW9uIG9mIHRhYmxlIGZvcm1hdHRlcnMuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHRoaXMgVGhlIGNvbnRleHRcbiAqIEBwYXJhbSB7c3RyaW5nfSBzTmFtZSBUaGUgaW5uZXIgZnVuY3Rpb24gbmFtZVxuICogQHBhcmFtIHtvYmplY3RbXX0gb0FyZ3MgVGhlIGlubmVyIGZ1bmN0aW9uIHBhcmFtZXRlcnNcbiAqIEByZXR1cm5zIHtvYmplY3R9IFRoZSB2YWx1ZSBmcm9tIHRoZSBpbm5lciBmdW5jdGlvblxuICovXG5jb25zdCBjcml0aWNhbGl0eUZvcm1hdHRlcnMgPSBmdW5jdGlvbih0aGlzOiBvYmplY3QsIHNOYW1lOiBzdHJpbmcsIC4uLm9BcmdzOiBhbnlbXSk6IGFueSB7XG5cdGlmIChjcml0aWNhbGl0eUZvcm1hdHRlcnMuaGFzT3duUHJvcGVydHkoc05hbWUpKSB7XG5cdFx0cmV0dXJuIChjcml0aWNhbGl0eUZvcm1hdHRlcnMgYXMgYW55KVtzTmFtZV0uYXBwbHkodGhpcywgb0FyZ3MpO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG59O1xuXG5jcml0aWNhbGl0eUZvcm1hdHRlcnMuY3JpdGljYWxpdHlGb3JtYXQgPSBjcml0aWNhbGl0eUZvcm1hdDtcblxuLyoqXG4gKiBAZ2xvYmFsXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNyaXRpY2FsaXR5Rm9ybWF0dGVycztcbiJdfQ==