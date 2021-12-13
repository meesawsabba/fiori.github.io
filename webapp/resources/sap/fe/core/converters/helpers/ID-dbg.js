/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["../../helpers/StableIdHelper"], function (StableIdHelper) {
  "use strict";

  var _exports = {};
  var generate = StableIdHelper.generate;

  var BASE_ID = ["fe"];
  /**
   * Shortcut to the stableIdHelper providing a "curry" like method where the last parameter is missing.
   *
   * @param sFixedPart
   * @returns {Function} A shortcut function with the fixed ID part
   */

  function IDGenerator() {
    for (var _len = arguments.length, sFixedPart = new Array(_len), _key = 0; _key < _len; _key++) {
      sFixedPart[_key] = arguments[_key];
    }

    return function () {
      for (var _len2 = arguments.length, sIDPart = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        sIDPart[_key2] = arguments[_key2];
      }

      return generate(BASE_ID.concat.apply(BASE_ID, sFixedPart.concat(sIDPart)));
    };
  }
  /**
   * Those are all helpers to centralize ID generation in the code for different elements
   */


  _exports.IDGenerator = IDGenerator;
  var HeaderFacetID = IDGenerator("HeaderFacet");
  _exports.HeaderFacetID = HeaderFacetID;
  var HeaderFacetContainerID = IDGenerator("HeaderFacetContainer");
  _exports.HeaderFacetContainerID = HeaderFacetContainerID;
  var HeaderFacetFormID = IDGenerator("HeaderFacet", "Form");
  _exports.HeaderFacetFormID = HeaderFacetFormID;
  var CustomHeaderFacetID = IDGenerator("HeaderFacetCustomContainer");
  _exports.CustomHeaderFacetID = CustomHeaderFacetID;
  var EditableHeaderSectionID = IDGenerator("EditableHeaderSection");
  _exports.EditableHeaderSectionID = EditableHeaderSectionID;
  var SectionID = IDGenerator("FacetSection");
  _exports.SectionID = SectionID;
  var CustomSectionID = IDGenerator("CustomSection");
  _exports.CustomSectionID = CustomSectionID;
  var SubSectionID = IDGenerator("FacetSubSection");
  _exports.SubSectionID = SubSectionID;
  var CustomSubSectionID = IDGenerator("CustomSubSection");
  _exports.CustomSubSectionID = CustomSubSectionID;
  var SideContentID = IDGenerator("SideContent");
  _exports.SideContentID = SideContentID;

  var SideContentLayoutID = function (sSectionID) {
    return generate(["fe", sSectionID, "SideContentLayout"]);
  };

  _exports.SideContentLayoutID = SideContentLayoutID;
  var FormID = IDGenerator("Form");
  _exports.FormID = FormID;
  var TableID = IDGenerator("table");
  _exports.TableID = TableID;
  var CustomTabID = IDGenerator("CustomTab");
  _exports.CustomTabID = CustomTabID;
  var FilterBarID = IDGenerator("FilterBar");
  _exports.FilterBarID = FilterBarID;

  var FilterVariantManagementID = function (sFilterID) {
    return generate([sFilterID, "VariantManagement"]);
  };

  _exports.FilterVariantManagementID = FilterVariantManagementID;
  var ChartID = IDGenerator("Chart");
  _exports.ChartID = ChartID;

  var CustomActionID = function (sActionID) {
    return generate(["CustomAction", sActionID]);
  };

  _exports.CustomActionID = CustomActionID;
  var KPIID = IDGenerator("KPI");
  _exports.KPIID = KPIID;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIklELnRzIl0sIm5hbWVzIjpbIkJBU0VfSUQiLCJJREdlbmVyYXRvciIsInNGaXhlZFBhcnQiLCJzSURQYXJ0IiwiZ2VuZXJhdGUiLCJjb25jYXQiLCJIZWFkZXJGYWNldElEIiwiSGVhZGVyRmFjZXRDb250YWluZXJJRCIsIkhlYWRlckZhY2V0Rm9ybUlEIiwiQ3VzdG9tSGVhZGVyRmFjZXRJRCIsIkVkaXRhYmxlSGVhZGVyU2VjdGlvbklEIiwiU2VjdGlvbklEIiwiQ3VzdG9tU2VjdGlvbklEIiwiU3ViU2VjdGlvbklEIiwiQ3VzdG9tU3ViU2VjdGlvbklEIiwiU2lkZUNvbnRlbnRJRCIsIlNpZGVDb250ZW50TGF5b3V0SUQiLCJzU2VjdGlvbklEIiwiRm9ybUlEIiwiVGFibGVJRCIsIkN1c3RvbVRhYklEIiwiRmlsdGVyQmFySUQiLCJGaWx0ZXJWYXJpYW50TWFuYWdlbWVudElEIiwic0ZpbHRlcklEIiwiQ2hhcnRJRCIsIkN1c3RvbUFjdGlvbklEIiwic0FjdGlvbklEIiwiS1BJSUQiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFDQSxNQUFNQSxPQUFpQixHQUFHLENBQUMsSUFBRCxDQUExQjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDTyxXQUFTQyxXQUFULEdBQThDO0FBQUEsc0NBQXRCQyxVQUFzQjtBQUF0QkEsTUFBQUEsVUFBc0I7QUFBQTs7QUFDcEQsV0FBTyxZQUErQjtBQUFBLHlDQUFuQkMsT0FBbUI7QUFBbkJBLFFBQUFBLE9BQW1CO0FBQUE7O0FBQ3JDLGFBQU9DLFFBQVEsQ0FBQ0osT0FBTyxDQUFDSyxNQUFSLE9BQUFMLE9BQU8sRUFBV0UsVUFBWCxRQUEwQkMsT0FBMUIsRUFBUixDQUFmO0FBQ0EsS0FGRDtBQUdBO0FBRUQ7QUFDQTtBQUNBOzs7O0FBQ08sTUFBTUcsYUFBYSxHQUFHTCxXQUFXLENBQUMsYUFBRCxDQUFqQzs7QUFDQSxNQUFNTSxzQkFBc0IsR0FBR04sV0FBVyxDQUFDLHNCQUFELENBQTFDOztBQUNBLE1BQU1PLGlCQUFpQixHQUFHUCxXQUFXLENBQUMsYUFBRCxFQUFnQixNQUFoQixDQUFyQzs7QUFDQSxNQUFNUSxtQkFBbUIsR0FBR1IsV0FBVyxDQUFDLDRCQUFELENBQXZDOztBQUNBLE1BQU1TLHVCQUF1QixHQUFHVCxXQUFXLENBQUMsdUJBQUQsQ0FBM0M7O0FBQ0EsTUFBTVUsU0FBUyxHQUFHVixXQUFXLENBQUMsY0FBRCxDQUE3Qjs7QUFDQSxNQUFNVyxlQUFlLEdBQUdYLFdBQVcsQ0FBQyxlQUFELENBQW5DOztBQUNBLE1BQU1ZLFlBQVksR0FBR1osV0FBVyxDQUFDLGlCQUFELENBQWhDOztBQUNBLE1BQU1hLGtCQUFrQixHQUFHYixXQUFXLENBQUMsa0JBQUQsQ0FBdEM7O0FBQ0EsTUFBTWMsYUFBYSxHQUFHZCxXQUFXLENBQUMsYUFBRCxDQUFqQzs7O0FBQ0EsTUFBTWUsbUJBQW1CLEdBQUcsVUFBU0MsVUFBVCxFQUE2QjtBQUMvRCxXQUFPYixRQUFRLENBQUMsQ0FBQyxJQUFELEVBQU9hLFVBQVAsRUFBbUIsbUJBQW5CLENBQUQsQ0FBZjtBQUNBLEdBRk07OztBQUdBLE1BQU1DLE1BQU0sR0FBR2pCLFdBQVcsQ0FBQyxNQUFELENBQTFCOztBQUNBLE1BQU1rQixPQUFPLEdBQUdsQixXQUFXLENBQUMsT0FBRCxDQUEzQjs7QUFDQSxNQUFNbUIsV0FBVyxHQUFHbkIsV0FBVyxDQUFDLFdBQUQsQ0FBL0I7O0FBQ0EsTUFBTW9CLFdBQVcsR0FBR3BCLFdBQVcsQ0FBQyxXQUFELENBQS9COzs7QUFDQSxNQUFNcUIseUJBQXlCLEdBQUcsVUFBU0MsU0FBVCxFQUE0QjtBQUNwRSxXQUFPbkIsUUFBUSxDQUFDLENBQUNtQixTQUFELEVBQVksbUJBQVosQ0FBRCxDQUFmO0FBQ0EsR0FGTTs7O0FBR0EsTUFBTUMsT0FBTyxHQUFHdkIsV0FBVyxDQUFDLE9BQUQsQ0FBM0I7OztBQUNBLE1BQU13QixjQUFjLEdBQUcsVUFBU0MsU0FBVCxFQUE0QjtBQUN6RCxXQUFPdEIsUUFBUSxDQUFDLENBQUMsY0FBRCxFQUFpQnNCLFNBQWpCLENBQUQsQ0FBZjtBQUNBLEdBRk07OztBQUdBLE1BQU1DLEtBQUssR0FBRzFCLFdBQVcsQ0FBQyxLQUFELENBQXpCIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gXCIuLi8uLi9oZWxwZXJzL1N0YWJsZUlkSGVscGVyXCI7XG5pbXBvcnQgeyBEYXRhRmllbGRBYnN0cmFjdFR5cGVzLCBGYWNldFR5cGVzIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG50eXBlIElEUGFydCA9IHN0cmluZyB8IHsgRmFjZXQ6IEZhY2V0VHlwZXMgfSB8IERhdGFGaWVsZEFic3RyYWN0VHlwZXM7XG5jb25zdCBCQVNFX0lEOiBJRFBhcnRbXSA9IFtcImZlXCJdO1xuXG4vKipcbiAqIFNob3J0Y3V0IHRvIHRoZSBzdGFibGVJZEhlbHBlciBwcm92aWRpbmcgYSBcImN1cnJ5XCIgbGlrZSBtZXRob2Qgd2hlcmUgdGhlIGxhc3QgcGFyYW1ldGVyIGlzIG1pc3NpbmcuXG4gKlxuICogQHBhcmFtIHNGaXhlZFBhcnRcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQSBzaG9ydGN1dCBmdW5jdGlvbiB3aXRoIHRoZSBmaXhlZCBJRCBwYXJ0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBJREdlbmVyYXRvciguLi5zRml4ZWRQYXJ0OiBJRFBhcnRbXSkge1xuXHRyZXR1cm4gZnVuY3Rpb24oLi4uc0lEUGFydDogSURQYXJ0W10pIHtcblx0XHRyZXR1cm4gZ2VuZXJhdGUoQkFTRV9JRC5jb25jYXQoLi4uc0ZpeGVkUGFydCwgLi4uc0lEUGFydCkpO1xuXHR9O1xufVxuXG4vKipcbiAqIFRob3NlIGFyZSBhbGwgaGVscGVycyB0byBjZW50cmFsaXplIElEIGdlbmVyYXRpb24gaW4gdGhlIGNvZGUgZm9yIGRpZmZlcmVudCBlbGVtZW50c1xuICovXG5leHBvcnQgY29uc3QgSGVhZGVyRmFjZXRJRCA9IElER2VuZXJhdG9yKFwiSGVhZGVyRmFjZXRcIik7XG5leHBvcnQgY29uc3QgSGVhZGVyRmFjZXRDb250YWluZXJJRCA9IElER2VuZXJhdG9yKFwiSGVhZGVyRmFjZXRDb250YWluZXJcIik7XG5leHBvcnQgY29uc3QgSGVhZGVyRmFjZXRGb3JtSUQgPSBJREdlbmVyYXRvcihcIkhlYWRlckZhY2V0XCIsIFwiRm9ybVwiKTtcbmV4cG9ydCBjb25zdCBDdXN0b21IZWFkZXJGYWNldElEID0gSURHZW5lcmF0b3IoXCJIZWFkZXJGYWNldEN1c3RvbUNvbnRhaW5lclwiKTtcbmV4cG9ydCBjb25zdCBFZGl0YWJsZUhlYWRlclNlY3Rpb25JRCA9IElER2VuZXJhdG9yKFwiRWRpdGFibGVIZWFkZXJTZWN0aW9uXCIpO1xuZXhwb3J0IGNvbnN0IFNlY3Rpb25JRCA9IElER2VuZXJhdG9yKFwiRmFjZXRTZWN0aW9uXCIpO1xuZXhwb3J0IGNvbnN0IEN1c3RvbVNlY3Rpb25JRCA9IElER2VuZXJhdG9yKFwiQ3VzdG9tU2VjdGlvblwiKTtcbmV4cG9ydCBjb25zdCBTdWJTZWN0aW9uSUQgPSBJREdlbmVyYXRvcihcIkZhY2V0U3ViU2VjdGlvblwiKTtcbmV4cG9ydCBjb25zdCBDdXN0b21TdWJTZWN0aW9uSUQgPSBJREdlbmVyYXRvcihcIkN1c3RvbVN1YlNlY3Rpb25cIik7XG5leHBvcnQgY29uc3QgU2lkZUNvbnRlbnRJRCA9IElER2VuZXJhdG9yKFwiU2lkZUNvbnRlbnRcIik7XG5leHBvcnQgY29uc3QgU2lkZUNvbnRlbnRMYXlvdXRJRCA9IGZ1bmN0aW9uKHNTZWN0aW9uSUQ6IHN0cmluZykge1xuXHRyZXR1cm4gZ2VuZXJhdGUoW1wiZmVcIiwgc1NlY3Rpb25JRCwgXCJTaWRlQ29udGVudExheW91dFwiXSk7XG59O1xuZXhwb3J0IGNvbnN0IEZvcm1JRCA9IElER2VuZXJhdG9yKFwiRm9ybVwiKTtcbmV4cG9ydCBjb25zdCBUYWJsZUlEID0gSURHZW5lcmF0b3IoXCJ0YWJsZVwiKTtcbmV4cG9ydCBjb25zdCBDdXN0b21UYWJJRCA9IElER2VuZXJhdG9yKFwiQ3VzdG9tVGFiXCIpO1xuZXhwb3J0IGNvbnN0IEZpbHRlckJhcklEID0gSURHZW5lcmF0b3IoXCJGaWx0ZXJCYXJcIik7XG5leHBvcnQgY29uc3QgRmlsdGVyVmFyaWFudE1hbmFnZW1lbnRJRCA9IGZ1bmN0aW9uKHNGaWx0ZXJJRDogc3RyaW5nKSB7XG5cdHJldHVybiBnZW5lcmF0ZShbc0ZpbHRlcklELCBcIlZhcmlhbnRNYW5hZ2VtZW50XCJdKTtcbn07XG5leHBvcnQgY29uc3QgQ2hhcnRJRCA9IElER2VuZXJhdG9yKFwiQ2hhcnRcIik7XG5leHBvcnQgY29uc3QgQ3VzdG9tQWN0aW9uSUQgPSBmdW5jdGlvbihzQWN0aW9uSUQ6IHN0cmluZykge1xuXHRyZXR1cm4gZ2VuZXJhdGUoW1wiQ3VzdG9tQWN0aW9uXCIsIHNBY3Rpb25JRF0pO1xufTtcbmV4cG9ydCBjb25zdCBLUElJRCA9IElER2VuZXJhdG9yKFwiS1BJXCIpO1xuIl19