/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  var isEntitySet = function (dataObject) {
    return dataObject && dataObject.hasOwnProperty("_type") && dataObject._type === "EntitySet";
  };

  _exports.isEntitySet = isEntitySet;

  var getFilterExpressionRestrictions = function (entitySet) {
    var _entitySet$annotation, _entitySet$annotation2, _entitySet$annotation3;

    return ((_entitySet$annotation = entitySet.annotations) === null || _entitySet$annotation === void 0 ? void 0 : (_entitySet$annotation2 = _entitySet$annotation.Capabilities) === null || _entitySet$annotation2 === void 0 ? void 0 : (_entitySet$annotation3 = _entitySet$annotation2.FilterRestrictions) === null || _entitySet$annotation3 === void 0 ? void 0 : _entitySet$annotation3.FilterExpressionRestrictions) || [];
  };

  _exports.getFilterExpressionRestrictions = getFilterExpressionRestrictions;

  var getNonSortablePropertiesRestrictions = function (entitySet) {
    var _entitySet$annotation4, _entitySet$annotation5, _entitySet$annotation6, _entitySet$annotation7, _entitySet$annotation8;

    return (_entitySet$annotation4 = entitySet === null || entitySet === void 0 ? void 0 : (_entitySet$annotation5 = entitySet.annotations) === null || _entitySet$annotation5 === void 0 ? void 0 : (_entitySet$annotation6 = _entitySet$annotation5.Capabilities) === null || _entitySet$annotation6 === void 0 ? void 0 : (_entitySet$annotation7 = _entitySet$annotation6.SortRestrictions) === null || _entitySet$annotation7 === void 0 ? void 0 : (_entitySet$annotation8 = _entitySet$annotation7.NonSortableProperties) === null || _entitySet$annotation8 === void 0 ? void 0 : _entitySet$annotation8.map(function (property) {
      return property.value;
    })) !== null && _entitySet$annotation4 !== void 0 ? _entitySet$annotation4 : [];
  };

  _exports.getNonSortablePropertiesRestrictions = getNonSortablePropertiesRestrictions;

  var isStickySessionSupported = function (entitySet) {
    var _entitySet$annotation9;

    return !!((_entitySet$annotation9 = entitySet.annotations.Session) !== null && _entitySet$annotation9 !== void 0 && _entitySet$annotation9.StickySessionSupported);
  };

  _exports.isStickySessionSupported = isStickySessionSupported;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVudGl0eVNldEhlbHBlci50cyJdLCJuYW1lcyI6WyJpc0VudGl0eVNldCIsImRhdGFPYmplY3QiLCJoYXNPd25Qcm9wZXJ0eSIsIl90eXBlIiwiZ2V0RmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucyIsImVudGl0eVNldCIsImFubm90YXRpb25zIiwiQ2FwYWJpbGl0aWVzIiwiRmlsdGVyUmVzdHJpY3Rpb25zIiwiRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucyIsImdldE5vblNvcnRhYmxlUHJvcGVydGllc1Jlc3RyaWN0aW9ucyIsIlNvcnRSZXN0cmljdGlvbnMiLCJOb25Tb3J0YWJsZVByb3BlcnRpZXMiLCJtYXAiLCJwcm9wZXJ0eSIsInZhbHVlIiwiaXNTdGlja3lTZXNzaW9uU3VwcG9ydGVkIiwiU2Vzc2lvbiIsIlN0aWNreVNlc3Npb25TdXBwb3J0ZWQiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7Ozs7OztBQUFPLE1BQU1BLFdBQVcsR0FBRyxVQUFTQyxVQUFULEVBQW1EO0FBQzdFLFdBQU9BLFVBQVUsSUFBSUEsVUFBVSxDQUFDQyxjQUFYLENBQTBCLE9BQTFCLENBQWQsSUFBb0RELFVBQVUsQ0FBQ0UsS0FBWCxLQUFxQixXQUFoRjtBQUNBLEdBRk07Ozs7QUFJQSxNQUFNQywrQkFBK0IsR0FBRyxVQUFTQyxTQUFULEVBQStCO0FBQUE7O0FBQzdFLFdBQU8sMEJBQUFBLFNBQVMsQ0FBQ0MsV0FBViwwR0FBdUJDLFlBQXZCLDRHQUFxQ0Msa0JBQXJDLGtGQUF5REMsNEJBQXpELEtBQXlGLEVBQWhHO0FBQ0EsR0FGTTs7OztBQUlBLE1BQU1DLG9DQUFvQyxHQUFHLFVBQVNMLFNBQVQsRUFBMkM7QUFBQTs7QUFDOUYscUNBQU9BLFNBQVAsYUFBT0EsU0FBUCxpREFBT0EsU0FBUyxDQUFFQyxXQUFsQixxRkFBTyx1QkFBd0JDLFlBQS9CLHFGQUFPLHVCQUFzQ0ksZ0JBQTdDLHFGQUFPLHVCQUF3REMscUJBQS9ELDJEQUFPLHVCQUErRUMsR0FBL0UsQ0FBbUYsVUFBQUMsUUFBUTtBQUFBLGFBQUlBLFFBQVEsQ0FBQ0MsS0FBYjtBQUFBLEtBQTNGLENBQVAsMkVBQXlILEVBQXpIO0FBQ0EsR0FGTTs7OztBQUlBLE1BQU1DLHdCQUF3QixHQUFHLFVBQVNYLFNBQVQsRUFBd0M7QUFBQTs7QUFDL0UsV0FBTyxDQUFDLDRCQUFDQSxTQUFTLENBQUNDLFdBQVYsQ0FBc0JXLE9BQXZCLG1EQUFDLHVCQUErQkMsc0JBQWhDLENBQVI7QUFDQSxHQUZNIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbnRpdHlTZXQgfSBmcm9tIFwiQHNhcC11eC9hbm5vdGF0aW9uLWNvbnZlcnRlclwiO1xuXG5leHBvcnQgY29uc3QgaXNFbnRpdHlTZXQgPSBmdW5jdGlvbihkYXRhT2JqZWN0OiBhbnkpOiBkYXRhT2JqZWN0IGlzIEVudGl0eVNldCB7XG5cdHJldHVybiBkYXRhT2JqZWN0ICYmIGRhdGFPYmplY3QuaGFzT3duUHJvcGVydHkoXCJfdHlwZVwiKSAmJiBkYXRhT2JqZWN0Ll90eXBlID09PSBcIkVudGl0eVNldFwiO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvbnMgPSBmdW5jdGlvbihlbnRpdHlTZXQ6IEVudGl0eVNldCkge1xuXHRyZXR1cm4gZW50aXR5U2V0LmFubm90YXRpb25zPy5DYXBhYmlsaXRpZXM/LkZpbHRlclJlc3RyaWN0aW9ucz8uRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucyB8fCBbXTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXROb25Tb3J0YWJsZVByb3BlcnRpZXNSZXN0cmljdGlvbnMgPSBmdW5jdGlvbihlbnRpdHlTZXQ6IEVudGl0eVNldCB8IHVuZGVmaW5lZCkge1xuXHRyZXR1cm4gZW50aXR5U2V0Py5hbm5vdGF0aW9ucz8uQ2FwYWJpbGl0aWVzPy5Tb3J0UmVzdHJpY3Rpb25zPy5Ob25Tb3J0YWJsZVByb3BlcnRpZXM/Lm1hcChwcm9wZXJ0eSA9PiBwcm9wZXJ0eS52YWx1ZSkgPz8gW107XG59O1xuXG5leHBvcnQgY29uc3QgaXNTdGlja3lTZXNzaW9uU3VwcG9ydGVkID0gZnVuY3Rpb24oZW50aXR5U2V0OiBFbnRpdHlTZXQpOiBib29sZWFuIHtcblx0cmV0dXJuICEhZW50aXR5U2V0LmFubm90YXRpb25zLlNlc3Npb24/LlN0aWNreVNlc3Npb25TdXBwb3J0ZWQ7XG59O1xuIl19