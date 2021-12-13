/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["../../helpers/StableIdHelper"], function (StableIdHelper) {
  "use strict";

  var _exports = {};
  var getStableIdPartFromDataField = StableIdHelper.getStableIdPartFromDataField;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * The KeyHelper is used for dealing with Key in the concern of the flexible programming model
   */
  var KeyHelper = /*#__PURE__*/function () {
    function KeyHelper() {
      _classCallCheck(this, KeyHelper);
    }

    _exports.KeyHelper = KeyHelper;

    _createClass(KeyHelper, null, [{
      key: "generateKeyFromDataField",
      value:
      /**
       * Returns a generated key for DataFields to be used in the flexible programming model.
       *
       * @param {DataFieldAbstractTypes} oDataField DataField to generate the key for
       * @returns {string} Returns a through StableIdHelper generated key
       */
      function generateKeyFromDataField(oDataField) {
        return getStableIdPartFromDataField(oDataField);
      }
      /**
       * Throws a Error if any other character then aA-zZ, 0-9, ':', '_' or '-' is used.
       *
       * @param {string} key String to check validity on
       */

    }, {
      key: "validateKey",
      value: function validateKey(key) {
        var pattern = /[^A-Za-z0-9_\-:]/;

        if (pattern.exec(key)) {
          throw new Error("Invalid key: " + key + " - only 'A-Za-z0-9_-:' are allowed");
        }
      }
      /**
       * Returns the key for a selection field required for adaption.
       *
       * @param fullPropertyPath The full property path (without entityType)
       * @returns {string} The key of the selection field
       */

    }, {
      key: "getSelectionFieldKeyFromPath",
      value: function getSelectionFieldKeyFromPath(fullPropertyPath) {
        return fullPropertyPath.replace(/(\*|\+)?\//g, "::");
      }
      /**
       * Returns the path for a selection field required for adaption.
       *
       * @param selectionFieldKey The key of the selection field
       * @returns {string} The full property path
       */

    }, {
      key: "getPathFromSelectionFieldKey",
      value: function getPathFromSelectionFieldKey(selectionFieldKey) {
        return selectionFieldKey.replace(/::\//g, "/");
      }
    }]);

    return KeyHelper;
  }();

  _exports.KeyHelper = KeyHelper;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIktleS50cyJdLCJuYW1lcyI6WyJLZXlIZWxwZXIiLCJvRGF0YUZpZWxkIiwiZ2V0U3RhYmxlSWRQYXJ0RnJvbURhdGFGaWVsZCIsImtleSIsInBhdHRlcm4iLCJleGVjIiwiRXJyb3IiLCJmdWxsUHJvcGVydHlQYXRoIiwicmVwbGFjZSIsInNlbGVjdGlvbkZpZWxkS2V5Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FBQ0E7QUFDQTtBQUNBO01BQ2FBLFM7Ozs7Ozs7Ozs7QUFDWjtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQyx3Q0FBZ0NDLFVBQWhDLEVBQTRFO0FBQzNFLGVBQU9DLDRCQUE0QixDQUFDRCxVQUFELENBQW5DO0FBQ0E7QUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBOzs7O2FBQ0MscUJBQW1CRSxHQUFuQixFQUFnQztBQUMvQixZQUFNQyxPQUFPLEdBQUcsa0JBQWhCOztBQUNBLFlBQUlBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhRixHQUFiLENBQUosRUFBdUI7QUFDdEIsZ0JBQU0sSUFBSUcsS0FBSixDQUFVLGtCQUFrQkgsR0FBbEIsR0FBd0Isb0NBQWxDLENBQU47QUFDQTtBQUNEO0FBRUQ7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O2FBQ0Msc0NBQW9DSSxnQkFBcEMsRUFBOEQ7QUFDN0QsZUFBT0EsZ0JBQWdCLENBQUNDLE9BQWpCLENBQXlCLGFBQXpCLEVBQXdDLElBQXhDLENBQVA7QUFDQTtBQUVEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OzthQUNDLHNDQUFvQ0MsaUJBQXBDLEVBQStEO0FBQzlELGVBQU9BLGlCQUFpQixDQUFDRCxPQUFsQixDQUEwQixPQUExQixFQUFtQyxHQUFuQyxDQUFQO0FBQ0EiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERhdGFGaWVsZEFic3RyYWN0VHlwZXMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcbmltcG9ydCB7IGdldFN0YWJsZUlkUGFydEZyb21EYXRhRmllbGQgfSBmcm9tIFwiLi4vLi4vaGVscGVycy9TdGFibGVJZEhlbHBlclwiO1xuXG4vKipcbiAqIFRoZSBLZXlIZWxwZXIgaXMgdXNlZCBmb3IgZGVhbGluZyB3aXRoIEtleSBpbiB0aGUgY29uY2VybiBvZiB0aGUgZmxleGlibGUgcHJvZ3JhbW1pbmcgbW9kZWxcbiAqL1xuZXhwb3J0IGNsYXNzIEtleUhlbHBlciB7XG5cdC8qKlxuXHQgKiBSZXR1cm5zIGEgZ2VuZXJhdGVkIGtleSBmb3IgRGF0YUZpZWxkcyB0byBiZSB1c2VkIGluIHRoZSBmbGV4aWJsZSBwcm9ncmFtbWluZyBtb2RlbC5cblx0ICpcblx0ICogQHBhcmFtIHtEYXRhRmllbGRBYnN0cmFjdFR5cGVzfSBvRGF0YUZpZWxkIERhdGFGaWVsZCB0byBnZW5lcmF0ZSB0aGUga2V5IGZvclxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIGEgdGhyb3VnaCBTdGFibGVJZEhlbHBlciBnZW5lcmF0ZWQga2V5XG5cdCAqL1xuXHRzdGF0aWMgZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKG9EYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMpOiBzdHJpbmcge1xuXHRcdHJldHVybiBnZXRTdGFibGVJZFBhcnRGcm9tRGF0YUZpZWxkKG9EYXRhRmllbGQpITtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaHJvd3MgYSBFcnJvciBpZiBhbnkgb3RoZXIgY2hhcmFjdGVyIHRoZW4gYUEtelosIDAtOSwgJzonLCAnXycgb3IgJy0nIGlzIHVzZWQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgU3RyaW5nIHRvIGNoZWNrIHZhbGlkaXR5IG9uXG5cdCAqL1xuXHRzdGF0aWMgdmFsaWRhdGVLZXkoa2V5OiBzdHJpbmcpIHtcblx0XHRjb25zdCBwYXR0ZXJuID0gL1teQS1aYS16MC05X1xcLTpdLztcblx0XHRpZiAocGF0dGVybi5leGVjKGtleSkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQga2V5OiBcIiArIGtleSArIFwiIC0gb25seSAnQS1aYS16MC05Xy06JyBhcmUgYWxsb3dlZFwiKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUga2V5IGZvciBhIHNlbGVjdGlvbiBmaWVsZCByZXF1aXJlZCBmb3IgYWRhcHRpb24uXG5cdCAqXG5cdCAqIEBwYXJhbSBmdWxsUHJvcGVydHlQYXRoIFRoZSBmdWxsIHByb3BlcnR5IHBhdGggKHdpdGhvdXQgZW50aXR5VHlwZSlcblx0ICogQHJldHVybnMge3N0cmluZ30gVGhlIGtleSBvZiB0aGUgc2VsZWN0aW9uIGZpZWxkXG5cdCAqL1xuXHRzdGF0aWMgZ2V0U2VsZWN0aW9uRmllbGRLZXlGcm9tUGF0aChmdWxsUHJvcGVydHlQYXRoOiBzdHJpbmcpIHtcblx0XHRyZXR1cm4gZnVsbFByb3BlcnR5UGF0aC5yZXBsYWNlKC8oXFwqfFxcKyk/XFwvL2csIFwiOjpcIik7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgcGF0aCBmb3IgYSBzZWxlY3Rpb24gZmllbGQgcmVxdWlyZWQgZm9yIGFkYXB0aW9uLlxuXHQgKlxuXHQgKiBAcGFyYW0gc2VsZWN0aW9uRmllbGRLZXkgVGhlIGtleSBvZiB0aGUgc2VsZWN0aW9uIGZpZWxkXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmdWxsIHByb3BlcnR5IHBhdGhcblx0ICovXG5cdHN0YXRpYyBnZXRQYXRoRnJvbVNlbGVjdGlvbkZpZWxkS2V5KHNlbGVjdGlvbkZpZWxkS2V5OiBzdHJpbmcpIHtcblx0XHRyZXR1cm4gc2VsZWN0aW9uRmllbGRLZXkucmVwbGFjZSgvOjpcXC8vZywgXCIvXCIpO1xuXHR9XG59XG4iXX0=