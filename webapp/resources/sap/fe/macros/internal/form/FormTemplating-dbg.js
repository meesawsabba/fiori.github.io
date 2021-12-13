/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/macros/field/FieldTemplating", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/templating/DataModelPathHelper"], function (FieldTemplating, BindingExpression, DataModelPathHelper) {
  "use strict";

  var _exports = {};
  var enhanceDataModelPath = DataModelPathHelper.enhanceDataModelPath;
  var concat = BindingExpression.concat;
  var compileBinding = BindingExpression.compileBinding;
  var getTextBinding = FieldTemplating.getTextBinding;

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var connectedFieldsTemplateRegex = /(?:({[^}]+})[^{]*)/g;
  var connectedFieldsTemplateSubRegex = /{([^}]+)}(.*)/;

  var getLabelForConnectedFields = function (oConnectedFieldsPath) {
    var oConnectedFields = oConnectedFieldsPath.targetObject; // First we separate each group of `{TemplatePart} xxx`

    var aTemplateMatches = oConnectedFields.Template.toString().match(connectedFieldsTemplateRegex);

    if (aTemplateMatches) {
      var aPartsToConcat = aTemplateMatches.reduce(function (aPartsToConcat, oMatch) {
        // Then for each sub-group, we retrieve the name of the data object and the remaining text, if it exists
        var aSubMatch = oMatch.match(connectedFieldsTemplateSubRegex);

        if (aSubMatch && aSubMatch.length > 1) {
          var targetValue = aSubMatch[1];

          if (oConnectedFields.Data[targetValue]) {
            var oDataFieldPath = enhanceDataModelPath(oConnectedFieldsPath, // TODO Better type for the Edm.Dictionary
            oConnectedFields.Data[targetValue].fullyQualifiedName.replace(oConnectedFieldsPath.targetEntityType.fullyQualifiedName, ""));
            oDataFieldPath.targetObject = oDataFieldPath.targetObject.Value;
            aPartsToConcat.push(getTextBinding(oDataFieldPath, {}, true));

            if (aSubMatch.length > 2) {
              aPartsToConcat.push(aSubMatch[2]);
            }
          }
        }

        return aPartsToConcat;
      }, []);
      return compileBinding(concat.apply(void 0, _toConsumableArray(aPartsToConcat)));
    }

    return "";
  };

  _exports.getLabelForConnectedFields = getLabelForConnectedFields;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZvcm1UZW1wbGF0aW5nLnRzIl0sIm5hbWVzIjpbImNvbm5lY3RlZEZpZWxkc1RlbXBsYXRlUmVnZXgiLCJjb25uZWN0ZWRGaWVsZHNUZW1wbGF0ZVN1YlJlZ2V4IiwiZ2V0TGFiZWxGb3JDb25uZWN0ZWRGaWVsZHMiLCJvQ29ubmVjdGVkRmllbGRzUGF0aCIsIm9Db25uZWN0ZWRGaWVsZHMiLCJ0YXJnZXRPYmplY3QiLCJhVGVtcGxhdGVNYXRjaGVzIiwiVGVtcGxhdGUiLCJ0b1N0cmluZyIsIm1hdGNoIiwiYVBhcnRzVG9Db25jYXQiLCJyZWR1Y2UiLCJvTWF0Y2giLCJhU3ViTWF0Y2giLCJsZW5ndGgiLCJ0YXJnZXRWYWx1ZSIsIkRhdGEiLCJvRGF0YUZpZWxkUGF0aCIsImVuaGFuY2VEYXRhTW9kZWxQYXRoIiwiZnVsbHlRdWFsaWZpZWROYW1lIiwicmVwbGFjZSIsInRhcmdldEVudGl0eVR5cGUiLCJWYWx1ZSIsInB1c2giLCJnZXRUZXh0QmluZGluZyIsImNvbXBpbGVCaW5kaW5nIiwiY29uY2F0Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0EsTUFBTUEsNEJBQTRCLEdBQUcscUJBQXJDO0FBQ0EsTUFBTUMsK0JBQStCLEdBQUcsZUFBeEM7O0FBQ08sTUFBTUMsMEJBQTBCLEdBQUcsVUFBU0Msb0JBQVQsRUFBb0Q7QUFDN0YsUUFBTUMsZ0JBQTBDLEdBQUdELG9CQUFvQixDQUFDRSxZQUF4RSxDQUQ2RixDQUU3Rjs7QUFDQSxRQUFNQyxnQkFBZ0IsR0FBR0YsZ0JBQWdCLENBQUNHLFFBQWpCLENBQTBCQyxRQUExQixHQUFxQ0MsS0FBckMsQ0FBMkNULDRCQUEzQyxDQUF6Qjs7QUFDQSxRQUFJTSxnQkFBSixFQUFzQjtBQUNyQixVQUFNSSxjQUFjLEdBQUdKLGdCQUFnQixDQUFDSyxNQUFqQixDQUF3QixVQUFDRCxjQUFELEVBQWtERSxNQUFsRCxFQUE2RDtBQUMzRztBQUNBLFlBQU1DLFNBQVMsR0FBR0QsTUFBTSxDQUFDSCxLQUFQLENBQWFSLCtCQUFiLENBQWxCOztBQUNBLFlBQUlZLFNBQVMsSUFBSUEsU0FBUyxDQUFDQyxNQUFWLEdBQW1CLENBQXBDLEVBQXVDO0FBQ3RDLGNBQU1DLFdBQVcsR0FBR0YsU0FBUyxDQUFDLENBQUQsQ0FBN0I7O0FBQ0EsY0FBS1QsZ0JBQWdCLENBQUNZLElBQWxCLENBQStCRCxXQUEvQixDQUFKLEVBQWlEO0FBQ2hELGdCQUFNRSxjQUFjLEdBQUdDLG9CQUFvQixDQUMxQ2Ysb0JBRDBDLEVBRTFDO0FBQ0NDLFlBQUFBLGdCQUFnQixDQUFDWSxJQUFsQixDQUErQkQsV0FBL0IsRUFBNENJLGtCQUE1QyxDQUErREMsT0FBL0QsQ0FDQ2pCLG9CQUFvQixDQUFDa0IsZ0JBQXJCLENBQXNDRixrQkFEdkMsRUFFQyxFQUZELENBSDBDLENBQTNDO0FBUUFGLFlBQUFBLGNBQWMsQ0FBQ1osWUFBZixHQUE4QlksY0FBYyxDQUFDWixZQUFmLENBQTRCaUIsS0FBMUQ7QUFDQVosWUFBQUEsY0FBYyxDQUFDYSxJQUFmLENBQW9CQyxjQUFjLENBQUNQLGNBQUQsRUFBaUIsRUFBakIsRUFBcUIsSUFBckIsQ0FBbEM7O0FBQ0EsZ0JBQUlKLFNBQVMsQ0FBQ0MsTUFBVixHQUFtQixDQUF2QixFQUEwQjtBQUN6QkosY0FBQUEsY0FBYyxDQUFDYSxJQUFmLENBQW9CVixTQUFTLENBQUMsQ0FBRCxDQUE3QjtBQUNBO0FBQ0Q7QUFDRDs7QUFDRCxlQUFPSCxjQUFQO0FBQ0EsT0F0QnNCLEVBc0JwQixFQXRCb0IsQ0FBdkI7QUF1QkEsYUFBT2UsY0FBYyxDQUFDQyxNQUFNLE1BQU4sNEJBQVVoQixjQUFWLEVBQUQsQ0FBckI7QUFDQTs7QUFFRCxXQUFPLEVBQVA7QUFDQSxHQWhDTSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29ubmVjdGVkRmllbGRzVHlwZVR5cGVzIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5pbXBvcnQgeyBnZXRUZXh0QmluZGluZyB9IGZyb20gXCJzYXAvZmUvbWFjcm9zL2ZpZWxkL0ZpZWxkVGVtcGxhdGluZ1wiO1xuaW1wb3J0IHsgY29tcGlsZUJpbmRpbmcsIGNvbmNhdCwgRXhwcmVzc2lvbk9yUHJpbWl0aXZlIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ0V4cHJlc3Npb25cIjtcbmltcG9ydCB7IERhdGFNb2RlbE9iamVjdFBhdGgsIGVuaGFuY2VEYXRhTW9kZWxQYXRoIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvRGF0YU1vZGVsUGF0aEhlbHBlclwiO1xuXG5jb25zdCBjb25uZWN0ZWRGaWVsZHNUZW1wbGF0ZVJlZ2V4ID0gLyg/Oih7W159XSt9KVtee10qKS9nO1xuY29uc3QgY29ubmVjdGVkRmllbGRzVGVtcGxhdGVTdWJSZWdleCA9IC97KFtefV0rKX0oLiopLztcbmV4cG9ydCBjb25zdCBnZXRMYWJlbEZvckNvbm5lY3RlZEZpZWxkcyA9IGZ1bmN0aW9uKG9Db25uZWN0ZWRGaWVsZHNQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoKSB7XG5cdGNvbnN0IG9Db25uZWN0ZWRGaWVsZHM6IENvbm5lY3RlZEZpZWxkc1R5cGVUeXBlcyA9IG9Db25uZWN0ZWRGaWVsZHNQYXRoLnRhcmdldE9iamVjdDtcblx0Ly8gRmlyc3Qgd2Ugc2VwYXJhdGUgZWFjaCBncm91cCBvZiBge1RlbXBsYXRlUGFydH0geHh4YFxuXHRjb25zdCBhVGVtcGxhdGVNYXRjaGVzID0gb0Nvbm5lY3RlZEZpZWxkcy5UZW1wbGF0ZS50b1N0cmluZygpLm1hdGNoKGNvbm5lY3RlZEZpZWxkc1RlbXBsYXRlUmVnZXgpO1xuXHRpZiAoYVRlbXBsYXRlTWF0Y2hlcykge1xuXHRcdGNvbnN0IGFQYXJ0c1RvQ29uY2F0ID0gYVRlbXBsYXRlTWF0Y2hlcy5yZWR1Y2UoKGFQYXJ0c1RvQ29uY2F0OiBFeHByZXNzaW9uT3JQcmltaXRpdmU8c3RyaW5nPltdLCBvTWF0Y2gpID0+IHtcblx0XHRcdC8vIFRoZW4gZm9yIGVhY2ggc3ViLWdyb3VwLCB3ZSByZXRyaWV2ZSB0aGUgbmFtZSBvZiB0aGUgZGF0YSBvYmplY3QgYW5kIHRoZSByZW1haW5pbmcgdGV4dCwgaWYgaXQgZXhpc3RzXG5cdFx0XHRjb25zdCBhU3ViTWF0Y2ggPSBvTWF0Y2gubWF0Y2goY29ubmVjdGVkRmllbGRzVGVtcGxhdGVTdWJSZWdleCk7XG5cdFx0XHRpZiAoYVN1Yk1hdGNoICYmIGFTdWJNYXRjaC5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdGNvbnN0IHRhcmdldFZhbHVlID0gYVN1Yk1hdGNoWzFdO1xuXHRcdFx0XHRpZiAoKG9Db25uZWN0ZWRGaWVsZHMuRGF0YSBhcyBhbnkpW3RhcmdldFZhbHVlXSkge1xuXHRcdFx0XHRcdGNvbnN0IG9EYXRhRmllbGRQYXRoID0gZW5oYW5jZURhdGFNb2RlbFBhdGgoXG5cdFx0XHRcdFx0XHRvQ29ubmVjdGVkRmllbGRzUGF0aCxcblx0XHRcdFx0XHRcdC8vIFRPRE8gQmV0dGVyIHR5cGUgZm9yIHRoZSBFZG0uRGljdGlvbmFyeVxuXHRcdFx0XHRcdFx0KG9Db25uZWN0ZWRGaWVsZHMuRGF0YSBhcyBhbnkpW3RhcmdldFZhbHVlXS5mdWxseVF1YWxpZmllZE5hbWUucmVwbGFjZShcblx0XHRcdFx0XHRcdFx0b0Nvbm5lY3RlZEZpZWxkc1BhdGgudGFyZ2V0RW50aXR5VHlwZS5mdWxseVF1YWxpZmllZE5hbWUsXG5cdFx0XHRcdFx0XHRcdFwiXCJcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdG9EYXRhRmllbGRQYXRoLnRhcmdldE9iamVjdCA9IG9EYXRhRmllbGRQYXRoLnRhcmdldE9iamVjdC5WYWx1ZTtcblx0XHRcdFx0XHRhUGFydHNUb0NvbmNhdC5wdXNoKGdldFRleHRCaW5kaW5nKG9EYXRhRmllbGRQYXRoLCB7fSwgdHJ1ZSkgYXMgRXhwcmVzc2lvbk9yUHJpbWl0aXZlPHN0cmluZz4pO1xuXHRcdFx0XHRcdGlmIChhU3ViTWF0Y2gubGVuZ3RoID4gMikge1xuXHRcdFx0XHRcdFx0YVBhcnRzVG9Db25jYXQucHVzaChhU3ViTWF0Y2hbMl0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGFQYXJ0c1RvQ29uY2F0O1xuXHRcdH0sIFtdKTtcblx0XHRyZXR1cm4gY29tcGlsZUJpbmRpbmcoY29uY2F0KC4uLmFQYXJ0c1RvQ29uY2F0KSk7XG5cdH1cblxuXHRyZXR1cm4gXCJcIjtcbn07XG4iXX0=