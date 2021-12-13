/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/BindingExpression"], function (BindingExpression) {
  "use strict";

  var _exports = {};
  var annotationExpression = BindingExpression.annotationExpression;
  var or = BindingExpression.or;
  var equal = BindingExpression.equal;

  /**
   * Create the binding expression to check if the property is non editable or not.
   *
   * @param {object} oTarget The target property or DataField
   * @returns {ExpressionOrPrimitive<boolean>} The binding expression resolving to a boolean being true if it's non editable
   */
  var isNonEditableExpression = function (oTarget) {
    return or(isReadOnlyExpression(oTarget), isDisabledExpression(oTarget));
  };
  /**
   * Create the binding expression to check if the property is read only or not.
   *
   * @param {object} oTarget The target property or DataField
   * @returns {ExpressionOrPrimitive<boolean>} The binding expression resolving to a boolean being true if it's read only
   */


  _exports.isNonEditableExpression = isNonEditableExpression;

  var isReadOnlyExpression = function (oTarget) {
    var _oTarget$annotations, _oTarget$annotations$, _oTarget$annotations$2;

    var oFieldControlValue = oTarget === null || oTarget === void 0 ? void 0 : (_oTarget$annotations = oTarget.annotations) === null || _oTarget$annotations === void 0 ? void 0 : (_oTarget$annotations$ = _oTarget$annotations.Common) === null || _oTarget$annotations$ === void 0 ? void 0 : (_oTarget$annotations$2 = _oTarget$annotations$.FieldControl) === null || _oTarget$annotations$2 === void 0 ? void 0 : _oTarget$annotations$2.valueOf();

    if (typeof oFieldControlValue === "object") {
      return !!oFieldControlValue && equal(annotationExpression(oFieldControlValue), 1);
    }

    return oFieldControlValue === "Common.FieldControlType/ReadOnly";
  };
  /**
   * Create the binding expression to check if the property is disabled or not.
   *
   * @param {object} oTarget The target property or DataField
   * @returns {ExpressionOrPrimitive<boolean>} The binding expression resolving to a boolean being true if it's disabled
   */


  _exports.isReadOnlyExpression = isReadOnlyExpression;

  var isDisabledExpression = function (oTarget) {
    var _oTarget$annotations2, _oTarget$annotations3, _oTarget$annotations4;

    var oFieldControlValue = oTarget === null || oTarget === void 0 ? void 0 : (_oTarget$annotations2 = oTarget.annotations) === null || _oTarget$annotations2 === void 0 ? void 0 : (_oTarget$annotations3 = _oTarget$annotations2.Common) === null || _oTarget$annotations3 === void 0 ? void 0 : (_oTarget$annotations4 = _oTarget$annotations3.FieldControl) === null || _oTarget$annotations4 === void 0 ? void 0 : _oTarget$annotations4.valueOf();

    if (typeof oFieldControlValue === "object") {
      return !!oFieldControlValue && equal(annotationExpression(oFieldControlValue), 0);
    }

    return oFieldControlValue === "Common.FieldControlType/Inapplicable";
  };
  /**
   * Create the binding expression to check if the property is read only or not.
   *
   * @param {object} oTarget The target property or DataField
   * @returns {ExpressionOrPrimitive<boolean>} The binding expression resolving to a boolean being true if it's read only
   */


  _exports.isDisabledExpression = isDisabledExpression;

  var isRequiredExpression = function (oTarget) {
    var _oTarget$annotations5, _oTarget$annotations6, _oTarget$annotations7;

    var oFieldControlValue = oTarget === null || oTarget === void 0 ? void 0 : (_oTarget$annotations5 = oTarget.annotations) === null || _oTarget$annotations5 === void 0 ? void 0 : (_oTarget$annotations6 = _oTarget$annotations5.Common) === null || _oTarget$annotations6 === void 0 ? void 0 : (_oTarget$annotations7 = _oTarget$annotations6.FieldControl) === null || _oTarget$annotations7 === void 0 ? void 0 : _oTarget$annotations7.valueOf();

    if (typeof oFieldControlValue === "object") {
      return !!oFieldControlValue && equal(annotationExpression(oFieldControlValue), 7);
    }

    return oFieldControlValue === "Common.FieldControlType/Mandatory";
  };

  _exports.isRequiredExpression = isRequiredExpression;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZpZWxkQ29udHJvbEhlbHBlci50cyJdLCJuYW1lcyI6WyJpc05vbkVkaXRhYmxlRXhwcmVzc2lvbiIsIm9UYXJnZXQiLCJvciIsImlzUmVhZE9ubHlFeHByZXNzaW9uIiwiaXNEaXNhYmxlZEV4cHJlc3Npb24iLCJvRmllbGRDb250cm9sVmFsdWUiLCJhbm5vdGF0aW9ucyIsIkNvbW1vbiIsIkZpZWxkQ29udHJvbCIsInZhbHVlT2YiLCJlcXVhbCIsImFubm90YXRpb25FeHByZXNzaW9uIiwiaXNSZXF1aXJlZEV4cHJlc3Npb24iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLE1BQU1BLHVCQUF1QixHQUFHLFVBQVNDLE9BQVQsRUFBNEM7QUFDbEYsV0FBT0MsRUFBRSxDQUFDQyxvQkFBb0IsQ0FBQ0YsT0FBRCxDQUFyQixFQUFnQ0csb0JBQW9CLENBQUNILE9BQUQsQ0FBcEQsQ0FBVDtBQUNBLEdBRk07QUFJUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBQ08sTUFBTUUsb0JBQW9CLEdBQUcsVUFBU0YsT0FBVCxFQUF1RDtBQUFBOztBQUMxRixRQUFNSSxrQkFBa0IsR0FBR0osT0FBSCxhQUFHQSxPQUFILCtDQUFHQSxPQUFPLENBQUVLLFdBQVosa0ZBQUcscUJBQXNCQyxNQUF6QixvRkFBRyxzQkFBOEJDLFlBQWpDLDJEQUFHLHVCQUE0Q0MsT0FBNUMsRUFBM0I7O0FBQ0EsUUFBSSxPQUFPSixrQkFBUCxLQUE4QixRQUFsQyxFQUE0QztBQUMzQyxhQUFPLENBQUMsQ0FBQ0Esa0JBQUYsSUFBd0JLLEtBQUssQ0FBQ0Msb0JBQW9CLENBQUNOLGtCQUFELENBQXJCLEVBQTRFLENBQTVFLENBQXBDO0FBQ0E7O0FBQ0QsV0FBT0Esa0JBQWtCLEtBQUssa0NBQTlCO0FBQ0EsR0FOTTtBQVFQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFDTyxNQUFNRCxvQkFBb0IsR0FBRyxVQUFTSCxPQUFULEVBQXVEO0FBQUE7O0FBQzFGLFFBQU1JLGtCQUFrQixHQUFHSixPQUFILGFBQUdBLE9BQUgsZ0RBQUdBLE9BQU8sQ0FBRUssV0FBWixtRkFBRyxzQkFBc0JDLE1BQXpCLG1GQUFHLHNCQUE4QkMsWUFBakMsMERBQUcsc0JBQTRDQyxPQUE1QyxFQUEzQjs7QUFDQSxRQUFJLE9BQU9KLGtCQUFQLEtBQThCLFFBQWxDLEVBQTRDO0FBQzNDLGFBQU8sQ0FBQyxDQUFDQSxrQkFBRixJQUF3QkssS0FBSyxDQUFDQyxvQkFBb0IsQ0FBQ04sa0JBQUQsQ0FBckIsRUFBNEUsQ0FBNUUsQ0FBcEM7QUFDQTs7QUFDRCxXQUFPQSxrQkFBa0IsS0FBSyxzQ0FBOUI7QUFDQSxHQU5NO0FBUVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUNPLE1BQU1PLG9CQUFvQixHQUFHLFVBQVNYLE9BQVQsRUFBdUQ7QUFBQTs7QUFDMUYsUUFBTUksa0JBQWtCLEdBQUdKLE9BQUgsYUFBR0EsT0FBSCxnREFBR0EsT0FBTyxDQUFFSyxXQUFaLG1GQUFHLHNCQUFzQkMsTUFBekIsbUZBQUcsc0JBQThCQyxZQUFqQywwREFBRyxzQkFBNENDLE9BQTVDLEVBQTNCOztBQUNBLFFBQUksT0FBT0osa0JBQVAsS0FBOEIsUUFBbEMsRUFBNEM7QUFDM0MsYUFBTyxDQUFDLENBQUNBLGtCQUFGLElBQXdCSyxLQUFLLENBQUNDLG9CQUFvQixDQUFDTixrQkFBRCxDQUFyQixFQUE0RSxDQUE1RSxDQUFwQztBQUNBOztBQUNELFdBQU9BLGtCQUFrQixLQUFLLG1DQUE5QjtBQUNBLEdBTk0iLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGVxdWFsLCBFeHByZXNzaW9uLCBFeHByZXNzaW9uT3JQcmltaXRpdmUsIG9yLCBhbm5vdGF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0JpbmRpbmdFeHByZXNzaW9uXCI7XG5cbi8qKlxuICogQ3JlYXRlIHRoZSBiaW5kaW5nIGV4cHJlc3Npb24gdG8gY2hlY2sgaWYgdGhlIHByb3BlcnR5IGlzIG5vbiBlZGl0YWJsZSBvciBub3QuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG9UYXJnZXQgVGhlIHRhcmdldCBwcm9wZXJ0eSBvciBEYXRhRmllbGRcbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uT3JQcmltaXRpdmU8Ym9vbGVhbj59IFRoZSBiaW5kaW5nIGV4cHJlc3Npb24gcmVzb2x2aW5nIHRvIGEgYm9vbGVhbiBiZWluZyB0cnVlIGlmIGl0J3Mgbm9uIGVkaXRhYmxlXG4gKi9cbmV4cG9ydCBjb25zdCBpc05vbkVkaXRhYmxlRXhwcmVzc2lvbiA9IGZ1bmN0aW9uKG9UYXJnZXQ6IGFueSk6IEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRyZXR1cm4gb3IoaXNSZWFkT25seUV4cHJlc3Npb24ob1RhcmdldCksIGlzRGlzYWJsZWRFeHByZXNzaW9uKG9UYXJnZXQpKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIHRoZSBiaW5kaW5nIGV4cHJlc3Npb24gdG8gY2hlY2sgaWYgdGhlIHByb3BlcnR5IGlzIHJlYWQgb25seSBvciBub3QuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG9UYXJnZXQgVGhlIHRhcmdldCBwcm9wZXJ0eSBvciBEYXRhRmllbGRcbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uT3JQcmltaXRpdmU8Ym9vbGVhbj59IFRoZSBiaW5kaW5nIGV4cHJlc3Npb24gcmVzb2x2aW5nIHRvIGEgYm9vbGVhbiBiZWluZyB0cnVlIGlmIGl0J3MgcmVhZCBvbmx5XG4gKi9cbmV4cG9ydCBjb25zdCBpc1JlYWRPbmx5RXhwcmVzc2lvbiA9IGZ1bmN0aW9uKG9UYXJnZXQ6IGFueSk6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxib29sZWFuPiB7XG5cdGNvbnN0IG9GaWVsZENvbnRyb2xWYWx1ZSA9IG9UYXJnZXQ/LmFubm90YXRpb25zPy5Db21tb24/LkZpZWxkQ29udHJvbD8udmFsdWVPZigpO1xuXHRpZiAodHlwZW9mIG9GaWVsZENvbnRyb2xWYWx1ZSA9PT0gXCJvYmplY3RcIikge1xuXHRcdHJldHVybiAhIW9GaWVsZENvbnRyb2xWYWx1ZSAmJiBlcXVhbChhbm5vdGF0aW9uRXhwcmVzc2lvbihvRmllbGRDb250cm9sVmFsdWUpIGFzIEV4cHJlc3Npb25PclByaW1pdGl2ZTxudW1iZXI+LCAxKTtcblx0fVxuXHRyZXR1cm4gb0ZpZWxkQ29udHJvbFZhbHVlID09PSBcIkNvbW1vbi5GaWVsZENvbnRyb2xUeXBlL1JlYWRPbmx5XCI7XG59O1xuXG4vKipcbiAqIENyZWF0ZSB0aGUgYmluZGluZyBleHByZXNzaW9uIHRvIGNoZWNrIGlmIHRoZSBwcm9wZXJ0eSBpcyBkaXNhYmxlZCBvciBub3QuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG9UYXJnZXQgVGhlIHRhcmdldCBwcm9wZXJ0eSBvciBEYXRhRmllbGRcbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uT3JQcmltaXRpdmU8Ym9vbGVhbj59IFRoZSBiaW5kaW5nIGV4cHJlc3Npb24gcmVzb2x2aW5nIHRvIGEgYm9vbGVhbiBiZWluZyB0cnVlIGlmIGl0J3MgZGlzYWJsZWRcbiAqL1xuZXhwb3J0IGNvbnN0IGlzRGlzYWJsZWRFeHByZXNzaW9uID0gZnVuY3Rpb24ob1RhcmdldDogYW55KTogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPGJvb2xlYW4+IHtcblx0Y29uc3Qgb0ZpZWxkQ29udHJvbFZhbHVlID0gb1RhcmdldD8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uRmllbGRDb250cm9sPy52YWx1ZU9mKCk7XG5cdGlmICh0eXBlb2Ygb0ZpZWxkQ29udHJvbFZhbHVlID09PSBcIm9iamVjdFwiKSB7XG5cdFx0cmV0dXJuICEhb0ZpZWxkQ29udHJvbFZhbHVlICYmIGVxdWFsKGFubm90YXRpb25FeHByZXNzaW9uKG9GaWVsZENvbnRyb2xWYWx1ZSkgYXMgRXhwcmVzc2lvbk9yUHJpbWl0aXZlPG51bWJlcj4sIDApO1xuXHR9XG5cdHJldHVybiBvRmllbGRDb250cm9sVmFsdWUgPT09IFwiQ29tbW9uLkZpZWxkQ29udHJvbFR5cGUvSW5hcHBsaWNhYmxlXCI7XG59O1xuXG4vKipcbiAqIENyZWF0ZSB0aGUgYmluZGluZyBleHByZXNzaW9uIHRvIGNoZWNrIGlmIHRoZSBwcm9wZXJ0eSBpcyByZWFkIG9ubHkgb3Igbm90LlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvVGFyZ2V0IFRoZSB0YXJnZXQgcHJvcGVydHkgb3IgRGF0YUZpZWxkXG4gKiBAcmV0dXJucyB7RXhwcmVzc2lvbk9yUHJpbWl0aXZlPGJvb2xlYW4+fSBUaGUgYmluZGluZyBleHByZXNzaW9uIHJlc29sdmluZyB0byBhIGJvb2xlYW4gYmVpbmcgdHJ1ZSBpZiBpdCdzIHJlYWQgb25seVxuICovXG5leHBvcnQgY29uc3QgaXNSZXF1aXJlZEV4cHJlc3Npb24gPSBmdW5jdGlvbihvVGFyZ2V0OiBhbnkpOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8Ym9vbGVhbj4ge1xuXHRjb25zdCBvRmllbGRDb250cm9sVmFsdWUgPSBvVGFyZ2V0Py5hbm5vdGF0aW9ucz8uQ29tbW9uPy5GaWVsZENvbnRyb2w/LnZhbHVlT2YoKTtcblx0aWYgKHR5cGVvZiBvRmllbGRDb250cm9sVmFsdWUgPT09IFwib2JqZWN0XCIpIHtcblx0XHRyZXR1cm4gISFvRmllbGRDb250cm9sVmFsdWUgJiYgZXF1YWwoYW5ub3RhdGlvbkV4cHJlc3Npb24ob0ZpZWxkQ29udHJvbFZhbHVlKSBhcyBFeHByZXNzaW9uT3JQcmltaXRpdmU8bnVtYmVyPiwgNyk7XG5cdH1cblx0cmV0dXJuIG9GaWVsZENvbnRyb2xWYWx1ZSA9PT0gXCJDb21tb24uRmllbGRDb250cm9sVHlwZS9NYW5kYXRvcnlcIjtcbn07XG4iXX0=