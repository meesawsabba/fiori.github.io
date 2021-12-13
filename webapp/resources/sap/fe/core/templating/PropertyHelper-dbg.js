/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  /**
   * Identify if the given property passed is a "Property" (has a _type).
   *
   * @param {Property} property A target property to evaluate
   * @returns {boolean} Validate that property is a Property
   */
  function isProperty(property) {
    return property && property.hasOwnProperty("_type") && property._type === "Property";
  }
  /**
   * Check whether the property has the Core.Computed annotation or not.
   *
   * @param {Property} oProperty The target property
   * @returns {boolean} `true` if the property is computed
   */


  _exports.isProperty = isProperty;

  var isComputed = function (oProperty) {
    var _oProperty$annotation, _oProperty$annotation2, _oProperty$annotation3;

    return !!((_oProperty$annotation = oProperty.annotations) !== null && _oProperty$annotation !== void 0 && (_oProperty$annotation2 = _oProperty$annotation.Core) !== null && _oProperty$annotation2 !== void 0 && (_oProperty$annotation3 = _oProperty$annotation2.Computed) !== null && _oProperty$annotation3 !== void 0 && _oProperty$annotation3.valueOf());
  };
  /**
   * Check whether the property has the Core.Immutable annotation or not.
   *
   * @param {Property} oProperty The target property
   * @returns {boolean} `true` if it's immutable
   */


  _exports.isComputed = isComputed;

  var isImmutable = function (oProperty) {
    var _oProperty$annotation4, _oProperty$annotation5, _oProperty$annotation6;

    return !!((_oProperty$annotation4 = oProperty.annotations) !== null && _oProperty$annotation4 !== void 0 && (_oProperty$annotation5 = _oProperty$annotation4.Core) !== null && _oProperty$annotation5 !== void 0 && (_oProperty$annotation6 = _oProperty$annotation5.Immutable) !== null && _oProperty$annotation6 !== void 0 && _oProperty$annotation6.valueOf());
  };
  /**
   * Check whether the property is a key or not.
   *
   * @param {Property} oProperty The target property
   * @returns {boolean} `true` if it's a key
   */


  _exports.isImmutable = isImmutable;

  var isKey = function (oProperty) {
    return !!oProperty.isKey;
  };
  /**
   * Checks whether the property has a date time or not.
   *
   * @param oProperty
   * @returns `true` if it is of type date / datetime / datetimeoffset
   */


  _exports.isKey = isKey;

  var hasDateType = function (oProperty) {
    return ["Edm.Date", "Edm.DateTime", "Edm.DateTimeOffset"].indexOf(oProperty.type) !== -1;
  };
  /**
   * Retrieve the label annotation.
   *
   * @param oProperty The target property
   * @returns The label string
   */


  _exports.hasDateType = hasDateType;

  var getLabel = function (oProperty) {
    var _oProperty$annotation7, _oProperty$annotation8, _oProperty$annotation9;

    return ((_oProperty$annotation7 = oProperty.annotations) === null || _oProperty$annotation7 === void 0 ? void 0 : (_oProperty$annotation8 = _oProperty$annotation7.Common) === null || _oProperty$annotation8 === void 0 ? void 0 : (_oProperty$annotation9 = _oProperty$annotation8.Label) === null || _oProperty$annotation9 === void 0 ? void 0 : _oProperty$annotation9.toString()) || "";
  };
  /**
   * Check whether the property has a semantic object defined or not.
   *
   * @param {Property} oProperty The target property
   * @returns {boolean} `true` if it has a semantic object
   */


  _exports.getLabel = getLabel;

  var hasSemanticObject = function (oProperty) {
    var _oProperty$annotation10, _oProperty$annotation11;

    return !!((_oProperty$annotation10 = oProperty.annotations) !== null && _oProperty$annotation10 !== void 0 && (_oProperty$annotation11 = _oProperty$annotation10.Common) !== null && _oProperty$annotation11 !== void 0 && _oProperty$annotation11.SemanticObject);
  };

  _exports.hasSemanticObject = hasSemanticObject;

  var isPathExpression = function (expression) {
    return !!expression && expression.type !== undefined && expression.type === "Path";
  };

  _exports.isPathExpression = isPathExpression;

  var isAnnotationPathExpression = function (expression) {
    return !!expression && expression.type !== undefined && expression.type === "AnnotationPath";
  };
  /**
   * Retrieves the unit property associated to the property, if applicable.
   *
   * @param {Property} oProperty The target property
   * @returns {Property | undefined} The unit property, if it exists
   */


  _exports.isAnnotationPathExpression = isAnnotationPathExpression;

  var getAssociatedUnitProperty = function (oProperty) {
    var _oProperty$annotation12, _oProperty$annotation13, _oProperty$annotation14, _oProperty$annotation15;

    return isPathExpression(oProperty === null || oProperty === void 0 ? void 0 : (_oProperty$annotation12 = oProperty.annotations) === null || _oProperty$annotation12 === void 0 ? void 0 : (_oProperty$annotation13 = _oProperty$annotation12.Measures) === null || _oProperty$annotation13 === void 0 ? void 0 : _oProperty$annotation13.Unit) ? (_oProperty$annotation14 = oProperty.annotations) === null || _oProperty$annotation14 === void 0 ? void 0 : (_oProperty$annotation15 = _oProperty$annotation14.Measures) === null || _oProperty$annotation15 === void 0 ? void 0 : _oProperty$annotation15.Unit.$target : undefined;
  };

  _exports.getAssociatedUnitProperty = getAssociatedUnitProperty;

  var getAssociatedUnitPropertyPath = function (oProperty) {
    var _oProperty$annotation16, _oProperty$annotation17, _oProperty$annotation18, _oProperty$annotation19;

    return isPathExpression(oProperty === null || oProperty === void 0 ? void 0 : (_oProperty$annotation16 = oProperty.annotations) === null || _oProperty$annotation16 === void 0 ? void 0 : (_oProperty$annotation17 = _oProperty$annotation16.Measures) === null || _oProperty$annotation17 === void 0 ? void 0 : _oProperty$annotation17.Unit) ? (_oProperty$annotation18 = oProperty.annotations) === null || _oProperty$annotation18 === void 0 ? void 0 : (_oProperty$annotation19 = _oProperty$annotation18.Measures) === null || _oProperty$annotation19 === void 0 ? void 0 : _oProperty$annotation19.Unit.path : undefined;
  };
  /**
   * Retrieves the associated currency property for that property if it exists.
   *
   * @param {Property} oProperty The target property
   * @returns {Property | undefined} The unit property if it exists
   */


  _exports.getAssociatedUnitPropertyPath = getAssociatedUnitPropertyPath;

  var getAssociatedCurrencyProperty = function (oProperty) {
    var _oProperty$annotation20, _oProperty$annotation21, _oProperty$annotation22, _oProperty$annotation23;

    return isPathExpression(oProperty === null || oProperty === void 0 ? void 0 : (_oProperty$annotation20 = oProperty.annotations) === null || _oProperty$annotation20 === void 0 ? void 0 : (_oProperty$annotation21 = _oProperty$annotation20.Measures) === null || _oProperty$annotation21 === void 0 ? void 0 : _oProperty$annotation21.ISOCurrency) ? (_oProperty$annotation22 = oProperty.annotations) === null || _oProperty$annotation22 === void 0 ? void 0 : (_oProperty$annotation23 = _oProperty$annotation22.Measures) === null || _oProperty$annotation23 === void 0 ? void 0 : _oProperty$annotation23.ISOCurrency.$target : undefined;
  };

  _exports.getAssociatedCurrencyProperty = getAssociatedCurrencyProperty;

  var getAssociatedCurrencyPropertyPath = function (oProperty) {
    var _oProperty$annotation24, _oProperty$annotation25, _oProperty$annotation26, _oProperty$annotation27;

    return isPathExpression(oProperty === null || oProperty === void 0 ? void 0 : (_oProperty$annotation24 = oProperty.annotations) === null || _oProperty$annotation24 === void 0 ? void 0 : (_oProperty$annotation25 = _oProperty$annotation24.Measures) === null || _oProperty$annotation25 === void 0 ? void 0 : _oProperty$annotation25.ISOCurrency) ? (_oProperty$annotation26 = oProperty.annotations) === null || _oProperty$annotation26 === void 0 ? void 0 : (_oProperty$annotation27 = _oProperty$annotation26.Measures) === null || _oProperty$annotation27 === void 0 ? void 0 : _oProperty$annotation27.ISOCurrency.path : undefined;
  };
  /**
   * Retrieves the Common.Text property path if it exists.
   *
   * @param {Property} oProperty The target property
   * @returns {string | undefined} The Common.Text property path or undefined if it does not exit
   */


  _exports.getAssociatedCurrencyPropertyPath = getAssociatedCurrencyPropertyPath;

  var getAssociatedTextPropertyPath = function (oProperty) {
    var _oProperty$annotation28, _oProperty$annotation29, _oProperty$annotation30, _oProperty$annotation31;

    return isPathExpression((_oProperty$annotation28 = oProperty.annotations) === null || _oProperty$annotation28 === void 0 ? void 0 : (_oProperty$annotation29 = _oProperty$annotation28.Common) === null || _oProperty$annotation29 === void 0 ? void 0 : _oProperty$annotation29.Text) ? (_oProperty$annotation30 = oProperty.annotations) === null || _oProperty$annotation30 === void 0 ? void 0 : (_oProperty$annotation31 = _oProperty$annotation30.Common) === null || _oProperty$annotation31 === void 0 ? void 0 : _oProperty$annotation31.Text.path : undefined;
  };
  /**
   * Retrieves the TargetValue from datapoint.
   *
   * @param {Property} oProperty the target property/dataPoint
   * @returns {string | undefined} the TargetValue
   */


  _exports.getAssociatedTextPropertyPath = getAssociatedTextPropertyPath;

  var getTargetValueOnDataPoint = function (oProperty) {
    var _oProperty$annotation32, _oProperty$annotation33, _oProperty$annotation34, _oProperty$annotation35, _oProperty$annotation36, _oProperty$annotation37, _oProperty$TargetValu;

    var sTargetValue = ((_oProperty$annotation32 = oProperty.annotations) === null || _oProperty$annotation32 === void 0 ? void 0 : (_oProperty$annotation33 = _oProperty$annotation32.UI) === null || _oProperty$annotation33 === void 0 ? void 0 : (_oProperty$annotation34 = _oProperty$annotation33.DataFieldDefault) === null || _oProperty$annotation34 === void 0 ? void 0 : (_oProperty$annotation35 = _oProperty$annotation34.Target) === null || _oProperty$annotation35 === void 0 ? void 0 : (_oProperty$annotation36 = _oProperty$annotation35.$target) === null || _oProperty$annotation36 === void 0 ? void 0 : (_oProperty$annotation37 = _oProperty$annotation36.TargetValue) === null || _oProperty$annotation37 === void 0 ? void 0 : _oProperty$annotation37.toString()) || ((_oProperty$TargetValu = oProperty.TargetValue) === null || _oProperty$TargetValu === void 0 ? void 0 : _oProperty$TargetValu.toString());
    return sTargetValue ? sTargetValue : undefined;
  };
  /**
   * Check whether the property has a value help annotation defined or not.
   *
   * @param {Property} oProperty The target property
   * @returns {boolean} `true` if it has a value help
   */


  _exports.getTargetValueOnDataPoint = getTargetValueOnDataPoint;

  var hasValueHelp = function (oProperty) {
    var _oProperty$annotation38, _oProperty$annotation39, _oProperty$annotation40, _oProperty$annotation41, _oProperty$annotation42, _oProperty$annotation43, _oProperty$annotation44, _oProperty$annotation45;

    return !!((_oProperty$annotation38 = oProperty.annotations) !== null && _oProperty$annotation38 !== void 0 && (_oProperty$annotation39 = _oProperty$annotation38.Common) !== null && _oProperty$annotation39 !== void 0 && _oProperty$annotation39.ValueList) || !!((_oProperty$annotation40 = oProperty.annotations) !== null && _oProperty$annotation40 !== void 0 && (_oProperty$annotation41 = _oProperty$annotation40.Common) !== null && _oProperty$annotation41 !== void 0 && _oProperty$annotation41.ValueListReferences) || !!((_oProperty$annotation42 = oProperty.annotations) !== null && _oProperty$annotation42 !== void 0 && (_oProperty$annotation43 = _oProperty$annotation42.Common) !== null && _oProperty$annotation43 !== void 0 && _oProperty$annotation43.ValueListWithFixedValues) || !!((_oProperty$annotation44 = oProperty.annotations) !== null && _oProperty$annotation44 !== void 0 && (_oProperty$annotation45 = _oProperty$annotation44.Common) !== null && _oProperty$annotation45 !== void 0 && _oProperty$annotation45.ValueListMapping);
  };
  /**
   * Check whether the property has a value help with fixed value annotation defined or not.
   *
   * @param {Property} oProperty The target property
   * @returns {boolean} `true` if it has a value help
   */


  _exports.hasValueHelp = hasValueHelp;

  var hasValueHelpWithFixedValues = function (oProperty) {
    var _oProperty$annotation46, _oProperty$annotation47, _oProperty$annotation48;

    return !!((_oProperty$annotation46 = oProperty.annotations) !== null && _oProperty$annotation46 !== void 0 && (_oProperty$annotation47 = _oProperty$annotation46.Common) !== null && _oProperty$annotation47 !== void 0 && (_oProperty$annotation48 = _oProperty$annotation47.ValueListWithFixedValues) !== null && _oProperty$annotation48 !== void 0 && _oProperty$annotation48.valueOf());
  };
  /**
   * Check whether the property has a value help for validation annotation defined or not.
   *
   * @param {Property} oProperty The target property
   * @returns {boolean} `true` if it has a value help
   */


  _exports.hasValueHelpWithFixedValues = hasValueHelpWithFixedValues;

  var hasValueListForValidation = function (oProperty) {
    var _oProperty$annotation49, _oProperty$annotation50;

    return ((_oProperty$annotation49 = oProperty.annotations) === null || _oProperty$annotation49 === void 0 ? void 0 : (_oProperty$annotation50 = _oProperty$annotation49.Common) === null || _oProperty$annotation50 === void 0 ? void 0 : _oProperty$annotation50.ValueListForValidation) !== undefined;
  };
  /**
   * Checks whether the property is a unit property.
   *
   * @param oProperty The property to check
   * @returns `true` if it is a unit
   */


  _exports.hasValueListForValidation = hasValueListForValidation;

  var isUnit = function (oProperty) {
    var _oProperty$annotation51, _oProperty$annotation52, _oProperty$annotation53;

    return !!((_oProperty$annotation51 = oProperty.annotations) !== null && _oProperty$annotation51 !== void 0 && (_oProperty$annotation52 = _oProperty$annotation51.Common) !== null && _oProperty$annotation52 !== void 0 && (_oProperty$annotation53 = _oProperty$annotation52.IsUnit) !== null && _oProperty$annotation53 !== void 0 && _oProperty$annotation53.valueOf());
  };
  /**
   * Checks whether the property has a unit property.
   *
   * @param oProperty The property to check
   * @returns `true` if it has a unit
   */


  _exports.isUnit = isUnit;

  var hasUnit = function (oProperty) {
    var _oProperty$annotation54, _oProperty$annotation55;

    return ((_oProperty$annotation54 = oProperty.annotations) === null || _oProperty$annotation54 === void 0 ? void 0 : (_oProperty$annotation55 = _oProperty$annotation54.Measures) === null || _oProperty$annotation55 === void 0 ? void 0 : _oProperty$annotation55.Unit) !== undefined;
  };
  /**
   * Checks whether the property is a currency property.
   *
   * @param oProperty The property to check
   * @returns `true` if it is a currency
   */


  _exports.hasUnit = hasUnit;

  var isCurrency = function (oProperty) {
    var _oProperty$annotation56, _oProperty$annotation57, _oProperty$annotation58;

    return !!((_oProperty$annotation56 = oProperty.annotations) !== null && _oProperty$annotation56 !== void 0 && (_oProperty$annotation57 = _oProperty$annotation56.Common) !== null && _oProperty$annotation57 !== void 0 && (_oProperty$annotation58 = _oProperty$annotation57.IsCurrency) !== null && _oProperty$annotation58 !== void 0 && _oProperty$annotation58.valueOf());
  };
  /**
   * Checks whether the property has a currency property.
   *
   * @param oProperty The property to check
   * @returns `true` if it has a currency
   */


  _exports.isCurrency = isCurrency;

  var hasCurrency = function (oProperty) {
    var _oProperty$annotation59, _oProperty$annotation60;

    return ((_oProperty$annotation59 = oProperty.annotations) === null || _oProperty$annotation59 === void 0 ? void 0 : (_oProperty$annotation60 = _oProperty$annotation59.Measures) === null || _oProperty$annotation60 === void 0 ? void 0 : _oProperty$annotation60.ISOCurrency) !== undefined;
  };

  _exports.hasCurrency = hasCurrency;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlByb3BlcnR5SGVscGVyLnRzIl0sIm5hbWVzIjpbImlzUHJvcGVydHkiLCJwcm9wZXJ0eSIsImhhc093blByb3BlcnR5IiwiX3R5cGUiLCJpc0NvbXB1dGVkIiwib1Byb3BlcnR5IiwiYW5ub3RhdGlvbnMiLCJDb3JlIiwiQ29tcHV0ZWQiLCJ2YWx1ZU9mIiwiaXNJbW11dGFibGUiLCJJbW11dGFibGUiLCJpc0tleSIsImhhc0RhdGVUeXBlIiwiaW5kZXhPZiIsInR5cGUiLCJnZXRMYWJlbCIsIkNvbW1vbiIsIkxhYmVsIiwidG9TdHJpbmciLCJoYXNTZW1hbnRpY09iamVjdCIsIlNlbWFudGljT2JqZWN0IiwiaXNQYXRoRXhwcmVzc2lvbiIsImV4cHJlc3Npb24iLCJ1bmRlZmluZWQiLCJpc0Fubm90YXRpb25QYXRoRXhwcmVzc2lvbiIsImdldEFzc29jaWF0ZWRVbml0UHJvcGVydHkiLCJNZWFzdXJlcyIsIlVuaXQiLCIkdGFyZ2V0IiwiZ2V0QXNzb2NpYXRlZFVuaXRQcm9wZXJ0eVBhdGgiLCJwYXRoIiwiZ2V0QXNzb2NpYXRlZEN1cnJlbmN5UHJvcGVydHkiLCJJU09DdXJyZW5jeSIsImdldEFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5UGF0aCIsImdldEFzc29jaWF0ZWRUZXh0UHJvcGVydHlQYXRoIiwiVGV4dCIsImdldFRhcmdldFZhbHVlT25EYXRhUG9pbnQiLCJzVGFyZ2V0VmFsdWUiLCJVSSIsIkRhdGFGaWVsZERlZmF1bHQiLCJUYXJnZXQiLCJUYXJnZXRWYWx1ZSIsImhhc1ZhbHVlSGVscCIsIlZhbHVlTGlzdCIsIlZhbHVlTGlzdFJlZmVyZW5jZXMiLCJWYWx1ZUxpc3RXaXRoRml4ZWRWYWx1ZXMiLCJWYWx1ZUxpc3RNYXBwaW5nIiwiaGFzVmFsdWVIZWxwV2l0aEZpeGVkVmFsdWVzIiwiaGFzVmFsdWVMaXN0Rm9yVmFsaWRhdGlvbiIsIlZhbHVlTGlzdEZvclZhbGlkYXRpb24iLCJpc1VuaXQiLCJJc1VuaXQiLCJoYXNVbml0IiwiaXND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QUFDTyxNQUFNOEIsVUFBVSxHQUFHLFVBQVNqRCxTQUFULEVBQXVDO0FBQUE7O0FBQ2hFLFdBQU8sQ0FBQyw2QkFBQ0EsU0FBUyxDQUFDQyxXQUFYLCtFQUFDLHdCQUF1QlcsTUFBeEIsK0VBQUMsd0JBQStCc0MsVUFBaEMsb0RBQUMsd0JBQTJDOUMsT0FBM0MsRUFBRCxDQUFSO0FBQ0EsR0FGTTtBQUlQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFDTyxNQUFNK0MsV0FBVyxHQUFHLFVBQVNuRCxTQUFULEVBQXVDO0FBQUE7O0FBQ2pFLFdBQU8sNEJBQUFBLFNBQVMsQ0FBQ0MsV0FBViwrR0FBdUJxQixRQUF2QixvRkFBaUNNLFdBQWpDLE1BQWlEVCxTQUF4RDtBQUNBLEdBRk0iLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByb3BlcnR5IH0gZnJvbSBcIkBzYXAtdXgvYW5ub3RhdGlvbi1jb252ZXJ0ZXJcIjtcbmltcG9ydCB7IFBhdGhBbm5vdGF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuXG4vKipcbiAqIElkZW50aWZ5IGlmIHRoZSBnaXZlbiBwcm9wZXJ0eSBwYXNzZWQgaXMgYSBcIlByb3BlcnR5XCIgKGhhcyBhIF90eXBlKS5cbiAqXG4gKiBAcGFyYW0ge1Byb3BlcnR5fSBwcm9wZXJ0eSBBIHRhcmdldCBwcm9wZXJ0eSB0byBldmFsdWF0ZVxuICogQHJldHVybnMge2Jvb2xlYW59IFZhbGlkYXRlIHRoYXQgcHJvcGVydHkgaXMgYSBQcm9wZXJ0eVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNQcm9wZXJ0eShwcm9wZXJ0eTogYW55KTogcHJvcGVydHkgaXMgUHJvcGVydHkge1xuXHRyZXR1cm4gcHJvcGVydHkgJiYgKHByb3BlcnR5IGFzIFByb3BlcnR5KS5oYXNPd25Qcm9wZXJ0eShcIl90eXBlXCIpICYmIChwcm9wZXJ0eSBhcyBQcm9wZXJ0eSkuX3R5cGUgPT09IFwiUHJvcGVydHlcIjtcbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBwcm9wZXJ0eSBoYXMgdGhlIENvcmUuQ29tcHV0ZWQgYW5ub3RhdGlvbiBvciBub3QuXG4gKlxuICogQHBhcmFtIHtQcm9wZXJ0eX0gb1Byb3BlcnR5IFRoZSB0YXJnZXQgcHJvcGVydHlcbiAqIEByZXR1cm5zIHtib29sZWFufSBgdHJ1ZWAgaWYgdGhlIHByb3BlcnR5IGlzIGNvbXB1dGVkXG4gKi9cbmV4cG9ydCBjb25zdCBpc0NvbXB1dGVkID0gZnVuY3Rpb24ob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gISFvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvcmU/LkNvbXB1dGVkPy52YWx1ZU9mKCk7XG59O1xuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgdGhlIHByb3BlcnR5IGhhcyB0aGUgQ29yZS5JbW11dGFibGUgYW5ub3RhdGlvbiBvciBub3QuXG4gKlxuICogQHBhcmFtIHtQcm9wZXJ0eX0gb1Byb3BlcnR5IFRoZSB0YXJnZXQgcHJvcGVydHlcbiAqIEByZXR1cm5zIHtib29sZWFufSBgdHJ1ZWAgaWYgaXQncyBpbW11dGFibGVcbiAqL1xuZXhwb3J0IGNvbnN0IGlzSW1tdXRhYmxlID0gZnVuY3Rpb24ob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gISFvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvcmU/LkltbXV0YWJsZT8udmFsdWVPZigpO1xufTtcblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBwcm9wZXJ0eSBpcyBhIGtleSBvciBub3QuXG4gKlxuICogQHBhcmFtIHtQcm9wZXJ0eX0gb1Byb3BlcnR5IFRoZSB0YXJnZXQgcHJvcGVydHlcbiAqIEByZXR1cm5zIHtib29sZWFufSBgdHJ1ZWAgaWYgaXQncyBhIGtleVxuICovXG5leHBvcnQgY29uc3QgaXNLZXkgPSBmdW5jdGlvbihvUHJvcGVydHk6IFByb3BlcnR5KTogYm9vbGVhbiB7XG5cdHJldHVybiAhIW9Qcm9wZXJ0eS5pc0tleTtcbn07XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgdGhlIHByb3BlcnR5IGhhcyBhIGRhdGUgdGltZSBvciBub3QuXG4gKlxuICogQHBhcmFtIG9Qcm9wZXJ0eVxuICogQHJldHVybnMgYHRydWVgIGlmIGl0IGlzIG9mIHR5cGUgZGF0ZSAvIGRhdGV0aW1lIC8gZGF0ZXRpbWVvZmZzZXRcbiAqL1xuZXhwb3J0IGNvbnN0IGhhc0RhdGVUeXBlID0gZnVuY3Rpb24ob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gW1wiRWRtLkRhdGVcIiwgXCJFZG0uRGF0ZVRpbWVcIiwgXCJFZG0uRGF0ZVRpbWVPZmZzZXRcIl0uaW5kZXhPZihvUHJvcGVydHkudHlwZSkgIT09IC0xO1xufTtcblxuLyoqXG4gKiBSZXRyaWV2ZSB0aGUgbGFiZWwgYW5ub3RhdGlvbi5cbiAqXG4gKiBAcGFyYW0gb1Byb3BlcnR5IFRoZSB0YXJnZXQgcHJvcGVydHlcbiAqIEByZXR1cm5zIFRoZSBsYWJlbCBzdHJpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IGdldExhYmVsID0gZnVuY3Rpb24ob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IHN0cmluZyB7XG5cdHJldHVybiBvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uTGFiZWw/LnRvU3RyaW5nKCkgfHwgXCJcIjtcbn07XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciB0aGUgcHJvcGVydHkgaGFzIGEgc2VtYW50aWMgb2JqZWN0IGRlZmluZWQgb3Igbm90LlxuICpcbiAqIEBwYXJhbSB7UHJvcGVydHl9IG9Qcm9wZXJ0eSBUaGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gYHRydWVgIGlmIGl0IGhhcyBhIHNlbWFudGljIG9iamVjdFxuICovXG5leHBvcnQgY29uc3QgaGFzU2VtYW50aWNPYmplY3QgPSBmdW5jdGlvbihvUHJvcGVydHk6IFByb3BlcnR5KTogYm9vbGVhbiB7XG5cdHJldHVybiAhIW9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5TZW1hbnRpY09iamVjdDtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1BhdGhFeHByZXNzaW9uID0gZnVuY3Rpb248VD4oZXhwcmVzc2lvbjogYW55KTogZXhwcmVzc2lvbiBpcyBQYXRoQW5ub3RhdGlvbkV4cHJlc3Npb248VD4ge1xuXHRyZXR1cm4gISFleHByZXNzaW9uICYmIGV4cHJlc3Npb24udHlwZSAhPT0gdW5kZWZpbmVkICYmIGV4cHJlc3Npb24udHlwZSA9PT0gXCJQYXRoXCI7XG59O1xuZXhwb3J0IGNvbnN0IGlzQW5ub3RhdGlvblBhdGhFeHByZXNzaW9uID0gZnVuY3Rpb248VD4oZXhwcmVzc2lvbjogYW55KTogZXhwcmVzc2lvbiBpcyBQYXRoQW5ub3RhdGlvbkV4cHJlc3Npb248VD4ge1xuXHRyZXR1cm4gISFleHByZXNzaW9uICYmIGV4cHJlc3Npb24udHlwZSAhPT0gdW5kZWZpbmVkICYmIGV4cHJlc3Npb24udHlwZSA9PT0gXCJBbm5vdGF0aW9uUGF0aFwiO1xufTtcblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIHVuaXQgcHJvcGVydHkgYXNzb2NpYXRlZCB0byB0aGUgcHJvcGVydHksIGlmIGFwcGxpY2FibGUuXG4gKlxuICogQHBhcmFtIHtQcm9wZXJ0eX0gb1Byb3BlcnR5IFRoZSB0YXJnZXQgcHJvcGVydHlcbiAqIEByZXR1cm5zIHtQcm9wZXJ0eSB8IHVuZGVmaW5lZH0gVGhlIHVuaXQgcHJvcGVydHksIGlmIGl0IGV4aXN0c1xuICovXG5leHBvcnQgY29uc3QgZ2V0QXNzb2NpYXRlZFVuaXRQcm9wZXJ0eSA9IGZ1bmN0aW9uKG9Qcm9wZXJ0eTogUHJvcGVydHkpOiBQcm9wZXJ0eSB8IHVuZGVmaW5lZCB7XG5cdHJldHVybiBpc1BhdGhFeHByZXNzaW9uKG9Qcm9wZXJ0eT8uYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5Vbml0KVxuXHRcdD8gKChvUHJvcGVydHkuYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5Vbml0LiR0YXJnZXQgYXMgdW5rbm93bikgYXMgUHJvcGVydHkpXG5cdFx0OiB1bmRlZmluZWQ7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0QXNzb2NpYXRlZFVuaXRQcm9wZXJ0eVBhdGggPSBmdW5jdGlvbihvUHJvcGVydHk6IFByb3BlcnR5KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0cmV0dXJuIGlzUGF0aEV4cHJlc3Npb24ob1Byb3BlcnR5Py5hbm5vdGF0aW9ucz8uTWVhc3VyZXM/LlVuaXQpID8gb1Byb3BlcnR5LmFubm90YXRpb25zPy5NZWFzdXJlcz8uVW5pdC5wYXRoIDogdW5kZWZpbmVkO1xufTtcblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIGFzc29jaWF0ZWQgY3VycmVuY3kgcHJvcGVydHkgZm9yIHRoYXQgcHJvcGVydHkgaWYgaXQgZXhpc3RzLlxuICpcbiAqIEBwYXJhbSB7UHJvcGVydHl9IG9Qcm9wZXJ0eSBUaGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcmV0dXJucyB7UHJvcGVydHkgfCB1bmRlZmluZWR9IFRoZSB1bml0IHByb3BlcnR5IGlmIGl0IGV4aXN0c1xuICovXG5leHBvcnQgY29uc3QgZ2V0QXNzb2NpYXRlZEN1cnJlbmN5UHJvcGVydHkgPSBmdW5jdGlvbihvUHJvcGVydHk6IFByb3BlcnR5KTogUHJvcGVydHkgfCB1bmRlZmluZWQge1xuXHRyZXR1cm4gaXNQYXRoRXhwcmVzc2lvbihvUHJvcGVydHk/LmFubm90YXRpb25zPy5NZWFzdXJlcz8uSVNPQ3VycmVuY3kpXG5cdFx0PyAoKG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uTWVhc3VyZXM/LklTT0N1cnJlbmN5LiR0YXJnZXQgYXMgdW5rbm93bikgYXMgUHJvcGVydHkpXG5cdFx0OiB1bmRlZmluZWQ7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0QXNzb2NpYXRlZEN1cnJlbmN5UHJvcGVydHlQYXRoID0gZnVuY3Rpb24ob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdHJldHVybiBpc1BhdGhFeHByZXNzaW9uKG9Qcm9wZXJ0eT8uYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5JU09DdXJyZW5jeSkgPyBvUHJvcGVydHkuYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5JU09DdXJyZW5jeS5wYXRoIDogdW5kZWZpbmVkO1xufTtcblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIENvbW1vbi5UZXh0IHByb3BlcnR5IHBhdGggaWYgaXQgZXhpc3RzLlxuICpcbiAqIEBwYXJhbSB7UHJvcGVydHl9IG9Qcm9wZXJ0eSBUaGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcmV0dXJucyB7c3RyaW5nIHwgdW5kZWZpbmVkfSBUaGUgQ29tbW9uLlRleHQgcHJvcGVydHkgcGF0aCBvciB1bmRlZmluZWQgaWYgaXQgZG9lcyBub3QgZXhpdFxuICovXG5leHBvcnQgY29uc3QgZ2V0QXNzb2NpYXRlZFRleHRQcm9wZXJ0eVBhdGggPSBmdW5jdGlvbihvUHJvcGVydHk6IFByb3BlcnR5KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0cmV0dXJuIGlzUGF0aEV4cHJlc3Npb24ob1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LlRleHQpID8gb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LlRleHQucGF0aCA6IHVuZGVmaW5lZDtcbn07XG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSBUYXJnZXRWYWx1ZSBmcm9tIGRhdGFwb2ludC5cbiAqXG4gKiBAcGFyYW0ge1Byb3BlcnR5fSBvUHJvcGVydHkgdGhlIHRhcmdldCBwcm9wZXJ0eS9kYXRhUG9pbnRcbiAqIEByZXR1cm5zIHtzdHJpbmcgfCB1bmRlZmluZWR9IHRoZSBUYXJnZXRWYWx1ZVxuICovXG5cbmV4cG9ydCBjb25zdCBnZXRUYXJnZXRWYWx1ZU9uRGF0YVBvaW50ID0gZnVuY3Rpb24ob1Byb3BlcnR5OiBhbnkpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXHRjb25zdCBzVGFyZ2V0VmFsdWUgPVxuXHRcdG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uVUk/LkRhdGFGaWVsZERlZmF1bHQ/LlRhcmdldD8uJHRhcmdldD8uVGFyZ2V0VmFsdWU/LnRvU3RyaW5nKCkgfHwgb1Byb3BlcnR5LlRhcmdldFZhbHVlPy50b1N0cmluZygpO1xuXHRyZXR1cm4gc1RhcmdldFZhbHVlID8gc1RhcmdldFZhbHVlIDogdW5kZWZpbmVkO1xufTtcbi8qKlxuICogQ2hlY2sgd2hldGhlciB0aGUgcHJvcGVydHkgaGFzIGEgdmFsdWUgaGVscCBhbm5vdGF0aW9uIGRlZmluZWQgb3Igbm90LlxuICpcbiAqIEBwYXJhbSB7UHJvcGVydHl9IG9Qcm9wZXJ0eSBUaGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gYHRydWVgIGlmIGl0IGhhcyBhIHZhbHVlIGhlbHBcbiAqL1xuZXhwb3J0IGNvbnN0IGhhc1ZhbHVlSGVscCA9IGZ1bmN0aW9uKG9Qcm9wZXJ0eTogUHJvcGVydHkpOiBib29sZWFuIHtcblx0cmV0dXJuIChcblx0XHQhIW9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5WYWx1ZUxpc3QgfHxcblx0XHQhIW9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5WYWx1ZUxpc3RSZWZlcmVuY2VzIHx8XG5cdFx0ISFvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uVmFsdWVMaXN0V2l0aEZpeGVkVmFsdWVzIHx8XG5cdFx0ISFvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uVmFsdWVMaXN0TWFwcGluZ1xuXHQpO1xufTtcblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBwcm9wZXJ0eSBoYXMgYSB2YWx1ZSBoZWxwIHdpdGggZml4ZWQgdmFsdWUgYW5ub3RhdGlvbiBkZWZpbmVkIG9yIG5vdC5cbiAqXG4gKiBAcGFyYW0ge1Byb3BlcnR5fSBvUHJvcGVydHkgVGhlIHRhcmdldCBwcm9wZXJ0eVxuICogQHJldHVybnMge2Jvb2xlYW59IGB0cnVlYCBpZiBpdCBoYXMgYSB2YWx1ZSBoZWxwXG4gKi9cbmV4cG9ydCBjb25zdCBoYXNWYWx1ZUhlbHBXaXRoRml4ZWRWYWx1ZXMgPSBmdW5jdGlvbihvUHJvcGVydHk6IFByb3BlcnR5KTogYm9vbGVhbiB7XG5cdHJldHVybiAhIW9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5WYWx1ZUxpc3RXaXRoRml4ZWRWYWx1ZXM/LnZhbHVlT2YoKTtcbn07XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciB0aGUgcHJvcGVydHkgaGFzIGEgdmFsdWUgaGVscCBmb3IgdmFsaWRhdGlvbiBhbm5vdGF0aW9uIGRlZmluZWQgb3Igbm90LlxuICpcbiAqIEBwYXJhbSB7UHJvcGVydHl9IG9Qcm9wZXJ0eSBUaGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gYHRydWVgIGlmIGl0IGhhcyBhIHZhbHVlIGhlbHBcbiAqL1xuZXhwb3J0IGNvbnN0IGhhc1ZhbHVlTGlzdEZvclZhbGlkYXRpb24gPSBmdW5jdGlvbihvUHJvcGVydHk6IFByb3BlcnR5KTogYm9vbGVhbiB7XG5cdHJldHVybiBvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uVmFsdWVMaXN0Rm9yVmFsaWRhdGlvbiAhPT0gdW5kZWZpbmVkO1xufTtcblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciB0aGUgcHJvcGVydHkgaXMgYSB1bml0IHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSBvUHJvcGVydHkgVGhlIHByb3BlcnR5IHRvIGNoZWNrXG4gKiBAcmV0dXJucyBgdHJ1ZWAgaWYgaXQgaXMgYSB1bml0XG4gKi9cbmV4cG9ydCBjb25zdCBpc1VuaXQgPSBmdW5jdGlvbihvUHJvcGVydHk6IFByb3BlcnR5KTogYm9vbGVhbiB7XG5cdHJldHVybiAhIW9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5Jc1VuaXQ/LnZhbHVlT2YoKTtcbn07XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgdGhlIHByb3BlcnR5IGhhcyBhIHVuaXQgcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIG9Qcm9wZXJ0eSBUaGUgcHJvcGVydHkgdG8gY2hlY2tcbiAqIEByZXR1cm5zIGB0cnVlYCBpZiBpdCBoYXMgYSB1bml0XG4gKi9cblxuZXhwb3J0IGNvbnN0IGhhc1VuaXQgPSBmdW5jdGlvbihvUHJvcGVydHk6IFByb3BlcnR5KTogYm9vbGVhbiB7XG5cdHJldHVybiBvUHJvcGVydHkuYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5Vbml0ICE9PSB1bmRlZmluZWQ7XG59O1xuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIHRoZSBwcm9wZXJ0eSBpcyBhIGN1cnJlbmN5IHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSBvUHJvcGVydHkgVGhlIHByb3BlcnR5IHRvIGNoZWNrXG4gKiBAcmV0dXJucyBgdHJ1ZWAgaWYgaXQgaXMgYSBjdXJyZW5jeVxuICovXG5leHBvcnQgY29uc3QgaXNDdXJyZW5jeSA9IGZ1bmN0aW9uKG9Qcm9wZXJ0eTogUHJvcGVydHkpOiBib29sZWFuIHtcblx0cmV0dXJuICEhb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LklzQ3VycmVuY3k/LnZhbHVlT2YoKTtcbn07XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgdGhlIHByb3BlcnR5IGhhcyBhIGN1cnJlbmN5IHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSBvUHJvcGVydHkgVGhlIHByb3BlcnR5IHRvIGNoZWNrXG4gKiBAcmV0dXJucyBgdHJ1ZWAgaWYgaXQgaGFzIGEgY3VycmVuY3lcbiAqL1xuZXhwb3J0IGNvbnN0IGhhc0N1cnJlbmN5ID0gZnVuY3Rpb24ob1Byb3BlcnR5OiBQcm9wZXJ0eSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gb1Byb3BlcnR5LmFubm90YXRpb25zPy5NZWFzdXJlcz8uSVNPQ3VycmVuY3kgIT09IHVuZGVmaW5lZDtcbn07XG4iXX0=