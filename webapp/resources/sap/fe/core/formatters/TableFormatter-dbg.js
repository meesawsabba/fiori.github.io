/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/formatters/TableFormatterTypes"], function (TableFormatterTypes) {
  "use strict";

  var MessageType = TableFormatterTypes.MessageType;

  /**
   * rowHighlighting
   *
   * @param {object} this The context
   * @param {string|number} CriticalityValue criticality value
   * @param {number} messageLastUpdate Timestamp of the last message created,  It's defined as input value but it is not used in the body of the function
   * It is used to refresh the formatting of the table each time a new message is updated
   * @returns {object} The value from the inner function
   */
  var rowHighlighting = function (criticalityValue, aFilteredMessages) {
    if (aFilteredMessages) {
      var sCurrentContextPath = this.getBindingContext() ? this.getBindingContext().getPath() : undefined;
      aFilteredMessages.forEach(function (oMessage) {
        if (oMessage.aTargets[0].indexOf(sCurrentContextPath) === 0) {
          criticalityValue = oMessage.type;
        }
      });
    }

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

  rowHighlighting.__functionName = "sap.fe.core.formatters.TableFormatter#rowHighlighting";

  var navigatedRow = function (sDeepestPath) {
    if (this.getBindingContext() && sDeepestPath) {
      return sDeepestPath.indexOf(this.getBindingContext().getPath()) === 0;
    } else {
      return false;
    }
  };

  navigatedRow.__functionName = "sap.fe.core.formatters.TableFormatter#navigatedRow"; // See https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters for more detail on this weird syntax

  /**
   * Collection of table formatters.
   *
   * @param {object} this The context
   * @param {string} sName The inner function name
   * @param {object[]} oArgs The inner function parameters
   * @returns {object} The value from the inner function
   */

  var tableFormatters = function (sName) {
    if (tableFormatters.hasOwnProperty(sName)) {
      for (var _len = arguments.length, oArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        oArgs[_key - 1] = arguments[_key];
      }

      return tableFormatters[sName].apply(this, oArgs);
    } else {
      return "";
    }
  };

  tableFormatters.rowHighlighting = rowHighlighting;
  tableFormatters.navigatedRow = navigatedRow;
  /**
   * @global
   */

  return tableFormatters;
}, true);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRhYmxlRm9ybWF0dGVyLnRzIl0sIm5hbWVzIjpbInJvd0hpZ2hsaWdodGluZyIsImNyaXRpY2FsaXR5VmFsdWUiLCJhRmlsdGVyZWRNZXNzYWdlcyIsInNDdXJyZW50Q29udGV4dFBhdGgiLCJnZXRCaW5kaW5nQ29udGV4dCIsImdldFBhdGgiLCJ1bmRlZmluZWQiLCJmb3JFYWNoIiwib01lc3NhZ2UiLCJhVGFyZ2V0cyIsImluZGV4T2YiLCJ0eXBlIiwiY3JpdGljYWxpdHlQcm9wZXJ0eSIsIk1lc3NhZ2VUeXBlIiwiRXJyb3IiLCJXYXJuaW5nIiwiU3VjY2VzcyIsIkluZm9ybWF0aW9uIiwiTm9uZSIsIl9fZnVuY3Rpb25OYW1lIiwibmF2aWdhdGVkUm93Iiwic0RlZXBlc3RQYXRoIiwidGFibGVGb3JtYXR0ZXJzIiwic05hbWUiLCJoYXNPd25Qcm9wZXJ0eSIsIm9BcmdzIiwiYXBwbHkiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7Ozs7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLE1BQU1BLGVBQWUsR0FBRyxVQUE4QkMsZ0JBQTlCLEVBQWlFQyxpQkFBakUsRUFBd0c7QUFDL0gsUUFBSUEsaUJBQUosRUFBdUI7QUFDdEIsVUFBTUMsbUJBQW1CLEdBQUcsS0FBS0MsaUJBQUwsS0FBMkIsS0FBS0EsaUJBQUwsR0FBeUJDLE9BQXpCLEVBQTNCLEdBQWdFQyxTQUE1RjtBQUNBSixNQUFBQSxpQkFBaUIsQ0FBQ0ssT0FBbEIsQ0FBMEIsVUFBQ0MsUUFBRCxFQUFtQjtBQUM1QyxZQUFJQSxRQUFRLENBQUNDLFFBQVQsQ0FBa0IsQ0FBbEIsRUFBcUJDLE9BQXJCLENBQTZCUCxtQkFBN0IsTUFBc0QsQ0FBMUQsRUFBNkQ7QUFDNURGLFVBQUFBLGdCQUFnQixHQUFHTyxRQUFRLENBQUNHLElBQTVCO0FBQ0E7QUFDRCxPQUpEO0FBS0E7O0FBRUQsUUFBSUMsbUJBQUo7O0FBQ0EsUUFBSSxPQUFPWCxnQkFBUCxLQUE0QixRQUFoQyxFQUEwQztBQUN6QyxhQUFRQSxnQkFBUjtBQUNBOztBQUNELFlBQVFBLGdCQUFSO0FBQ0MsV0FBSyxDQUFMO0FBQ0NXLFFBQUFBLG1CQUFtQixHQUFHQyxXQUFXLENBQUNDLEtBQWxDO0FBQ0E7O0FBQ0QsV0FBSyxDQUFMO0FBQ0NGLFFBQUFBLG1CQUFtQixHQUFHQyxXQUFXLENBQUNFLE9BQWxDO0FBQ0E7O0FBQ0QsV0FBSyxDQUFMO0FBQ0NILFFBQUFBLG1CQUFtQixHQUFHQyxXQUFXLENBQUNHLE9BQWxDO0FBQ0E7O0FBQ0QsV0FBSyxDQUFMO0FBQ0NKLFFBQUFBLG1CQUFtQixHQUFHQyxXQUFXLENBQUNJLFdBQWxDO0FBQ0E7O0FBQ0Q7QUFDQ0wsUUFBQUEsbUJBQW1CLEdBQUdDLFdBQVcsQ0FBQ0ssSUFBbEM7QUFkRjs7QUFpQkEsV0FBT04sbUJBQVA7QUFDQSxHQWhDRDs7QUFpQ0FaLEVBQUFBLGVBQWUsQ0FBQ21CLGNBQWhCLEdBQWlDLHVEQUFqQzs7QUFFQSxNQUFNQyxZQUFZLEdBQUcsVUFBOEJDLFlBQTlCLEVBQW9EO0FBQ3hFLFFBQUksS0FBS2pCLGlCQUFMLE1BQTRCaUIsWUFBaEMsRUFBOEM7QUFDN0MsYUFBT0EsWUFBWSxDQUFDWCxPQUFiLENBQXFCLEtBQUtOLGlCQUFMLEdBQXlCQyxPQUF6QixFQUFyQixNQUE2RCxDQUFwRTtBQUNBLEtBRkQsTUFFTztBQUNOLGFBQU8sS0FBUDtBQUNBO0FBQ0QsR0FORDs7QUFPQWUsRUFBQUEsWUFBWSxDQUFDRCxjQUFiLEdBQThCLG9EQUE5QixDLENBRUE7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxNQUFNRyxlQUFlLEdBQUcsVUFBdUJDLEtBQXZCLEVBQTREO0FBQ25GLFFBQUlELGVBQWUsQ0FBQ0UsY0FBaEIsQ0FBK0JELEtBQS9CLENBQUosRUFBMkM7QUFBQSx3Q0FEcUJFLEtBQ3JCO0FBRHFCQSxRQUFBQSxLQUNyQjtBQUFBOztBQUMxQyxhQUFRSCxlQUFELENBQXlCQyxLQUF6QixFQUFnQ0csS0FBaEMsQ0FBc0MsSUFBdEMsRUFBNENELEtBQTVDLENBQVA7QUFDQSxLQUZELE1BRU87QUFDTixhQUFPLEVBQVA7QUFDQTtBQUNELEdBTkQ7O0FBUUFILEVBQUFBLGVBQWUsQ0FBQ3RCLGVBQWhCLEdBQWtDQSxlQUFsQztBQUNBc0IsRUFBQUEsZUFBZSxDQUFDRixZQUFoQixHQUErQkEsWUFBL0I7QUFDQTtBQUNBO0FBQ0E7O1NBQ2VFLGUiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hbmFnZWRPYmplY3QgfSBmcm9tIFwic2FwL3VpL2Jhc2VcIjtcbmltcG9ydCB7IE1lc3NhZ2VUeXBlIH0gZnJvbSBcInNhcC9mZS9jb3JlL2Zvcm1hdHRlcnMvVGFibGVGb3JtYXR0ZXJUeXBlc1wiO1xuXG4vKipcbiAqIHJvd0hpZ2hsaWdodGluZ1xuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSB0aGlzIFRoZSBjb250ZXh0XG4gKiBAcGFyYW0ge3N0cmluZ3xudW1iZXJ9IENyaXRpY2FsaXR5VmFsdWUgY3JpdGljYWxpdHkgdmFsdWVcbiAqIEBwYXJhbSB7bnVtYmVyfSBtZXNzYWdlTGFzdFVwZGF0ZSBUaW1lc3RhbXAgb2YgdGhlIGxhc3QgbWVzc2FnZSBjcmVhdGVkLCAgSXQncyBkZWZpbmVkIGFzIGlucHV0IHZhbHVlIGJ1dCBpdCBpcyBub3QgdXNlZCBpbiB0aGUgYm9keSBvZiB0aGUgZnVuY3Rpb25cbiAqIEl0IGlzIHVzZWQgdG8gcmVmcmVzaCB0aGUgZm9ybWF0dGluZyBvZiB0aGUgdGFibGUgZWFjaCB0aW1lIGEgbmV3IG1lc3NhZ2UgaXMgdXBkYXRlZFxuICogQHJldHVybnMge29iamVjdH0gVGhlIHZhbHVlIGZyb20gdGhlIGlubmVyIGZ1bmN0aW9uXG4gKi9cblxuY29uc3Qgcm93SGlnaGxpZ2h0aW5nID0gZnVuY3Rpb24odGhpczogTWFuYWdlZE9iamVjdCwgY3JpdGljYWxpdHlWYWx1ZTogc3RyaW5nIHwgbnVtYmVyLCBhRmlsdGVyZWRNZXNzYWdlczogYW55W10pOiBNZXNzYWdlVHlwZSB7XG5cdGlmIChhRmlsdGVyZWRNZXNzYWdlcykge1xuXHRcdGNvbnN0IHNDdXJyZW50Q29udGV4dFBhdGggPSB0aGlzLmdldEJpbmRpbmdDb250ZXh0KCkgPyB0aGlzLmdldEJpbmRpbmdDb250ZXh0KCkuZ2V0UGF0aCgpIDogdW5kZWZpbmVkO1xuXHRcdGFGaWx0ZXJlZE1lc3NhZ2VzLmZvckVhY2goKG9NZXNzYWdlOiBhbnkpID0+IHtcblx0XHRcdGlmIChvTWVzc2FnZS5hVGFyZ2V0c1swXS5pbmRleE9mKHNDdXJyZW50Q29udGV4dFBhdGgpID09PSAwKSB7XG5cdFx0XHRcdGNyaXRpY2FsaXR5VmFsdWUgPSBvTWVzc2FnZS50eXBlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0bGV0IGNyaXRpY2FsaXR5UHJvcGVydHk7XG5cdGlmICh0eXBlb2YgY3JpdGljYWxpdHlWYWx1ZSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdHJldHVybiAoY3JpdGljYWxpdHlWYWx1ZSBhcyB1bmtub3duKSBhcyBNZXNzYWdlVHlwZTtcblx0fVxuXHRzd2l0Y2ggKGNyaXRpY2FsaXR5VmFsdWUpIHtcblx0XHRjYXNlIDE6XG5cdFx0XHRjcml0aWNhbGl0eVByb3BlcnR5ID0gTWVzc2FnZVR5cGUuRXJyb3I7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIDI6XG5cdFx0XHRjcml0aWNhbGl0eVByb3BlcnR5ID0gTWVzc2FnZVR5cGUuV2FybmluZztcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgMzpcblx0XHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5TdWNjZXNzO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSA1OlxuXHRcdFx0Y3JpdGljYWxpdHlQcm9wZXJ0eSA9IE1lc3NhZ2VUeXBlLkluZm9ybWF0aW9uO1xuXHRcdFx0YnJlYWs7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBNZXNzYWdlVHlwZS5Ob25lO1xuXHR9XG5cblx0cmV0dXJuIGNyaXRpY2FsaXR5UHJvcGVydHk7XG59O1xucm93SGlnaGxpZ2h0aW5nLl9fZnVuY3Rpb25OYW1lID0gXCJzYXAuZmUuY29yZS5mb3JtYXR0ZXJzLlRhYmxlRm9ybWF0dGVyI3Jvd0hpZ2hsaWdodGluZ1wiO1xuXG5jb25zdCBuYXZpZ2F0ZWRSb3cgPSBmdW5jdGlvbih0aGlzOiBNYW5hZ2VkT2JqZWN0LCBzRGVlcGVzdFBhdGg6IHN0cmluZykge1xuXHRpZiAodGhpcy5nZXRCaW5kaW5nQ29udGV4dCgpICYmIHNEZWVwZXN0UGF0aCkge1xuXHRcdHJldHVybiBzRGVlcGVzdFBhdGguaW5kZXhPZih0aGlzLmdldEJpbmRpbmdDb250ZXh0KCkuZ2V0UGF0aCgpKSA9PT0gMDtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn07XG5uYXZpZ2F0ZWRSb3cuX19mdW5jdGlvbk5hbWUgPSBcInNhcC5mZS5jb3JlLmZvcm1hdHRlcnMuVGFibGVGb3JtYXR0ZXIjbmF2aWdhdGVkUm93XCI7XG5cbi8vIFNlZSBodHRwczovL3d3dy50eXBlc2NyaXB0bGFuZy5vcmcvZG9jcy9oYW5kYm9vay9mdW5jdGlvbnMuaHRtbCN0aGlzLXBhcmFtZXRlcnMgZm9yIG1vcmUgZGV0YWlsIG9uIHRoaXMgd2VpcmQgc3ludGF4XG4vKipcbiAqIENvbGxlY3Rpb24gb2YgdGFibGUgZm9ybWF0dGVycy5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gdGhpcyBUaGUgY29udGV4dFxuICogQHBhcmFtIHtzdHJpbmd9IHNOYW1lIFRoZSBpbm5lciBmdW5jdGlvbiBuYW1lXG4gKiBAcGFyYW0ge29iamVjdFtdfSBvQXJncyBUaGUgaW5uZXIgZnVuY3Rpb24gcGFyYW1ldGVyc1xuICogQHJldHVybnMge29iamVjdH0gVGhlIHZhbHVlIGZyb20gdGhlIGlubmVyIGZ1bmN0aW9uXG4gKi9cbmNvbnN0IHRhYmxlRm9ybWF0dGVycyA9IGZ1bmN0aW9uKHRoaXM6IG9iamVjdCwgc05hbWU6IHN0cmluZywgLi4ub0FyZ3M6IGFueVtdKTogYW55IHtcblx0aWYgKHRhYmxlRm9ybWF0dGVycy5oYXNPd25Qcm9wZXJ0eShzTmFtZSkpIHtcblx0XHRyZXR1cm4gKHRhYmxlRm9ybWF0dGVycyBhcyBhbnkpW3NOYW1lXS5hcHBseSh0aGlzLCBvQXJncyk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cbn07XG5cbnRhYmxlRm9ybWF0dGVycy5yb3dIaWdobGlnaHRpbmcgPSByb3dIaWdobGlnaHRpbmc7XG50YWJsZUZvcm1hdHRlcnMubmF2aWdhdGVkUm93ID0gbmF2aWdhdGVkUm93O1xuLyoqXG4gKiBAZ2xvYmFsXG4gKi9cbmV4cG9ydCBkZWZhdWx0IHRhYmxlRm9ybWF0dGVycztcbiJdfQ==