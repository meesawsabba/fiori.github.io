/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  var IssueSeverity;

  (function (IssueSeverity) {
    IssueSeverity[IssueSeverity["High"] = 0] = "High";
    IssueSeverity[IssueSeverity["Low"] = 1] = "Low";
    IssueSeverity[IssueSeverity["Medium"] = 2] = "Medium";
  })(IssueSeverity || (IssueSeverity = {}));

  _exports.IssueSeverity = IssueSeverity;
  var IssueCategoryType = {
    Facets: {
      MissingID: "MissingID",
      UnSupportedLevel: "UnsupportedLevel"
    }
  };
  _exports.IssueCategoryType = IssueCategoryType;
  var IssueCategory;

  (function (IssueCategory) {
    IssueCategory["Annotation"] = "Annotation";
    IssueCategory["Template"] = "Template";
    IssueCategory["Manifest"] = "Manifest";
    IssueCategory["Facets"] = "Facets";
  })(IssueCategory || (IssueCategory = {}));

  _exports.IssueCategory = IssueCategory;
  var IssueType = {
    MISSING_LINEITEM: "We couldn't find a line item annotation for the current entitySet, you should consider adding one.",
    MISSING_SELECTIONFIELD: "Defined Selection Field is not found",
    MALFORMED_DATAFIELD_FOR_IBN: {
      REQUIRESCONTEXT: "DataFieldForIntentBasedNavigation cannot use requires context in form/header.",
      INLINE: "DataFieldForIntentBasedNavigation cannot use Inline in form/header.",
      DETERMINING: "DataFieldForIntentBasedNavigation cannot use Determining in form/header."
    },
    MALFORMED_VISUALFILTERS: {
      VALUELIST: "ValueList Path mentioned in the manifest is not found",
      PRESENTATIONVARIANT: "Presentation Variant Annotation is missing for the VisualFilters",
      CHART: "Chart Annotation is missing from the PV configured for the VisualFilters",
      VALUELISTCONFIG: "ValueList is not been configured inside the Visual Filter Settings"
    },
    FULLSCREENMODE_NOT_ON_LISTREPORT: "enableFullScreenMode is not supported on list report pages.",
    KPI_ISSUES: {
      KPI_NOT_FOUND: "Couldn't find KPI or SPV with qualifier ",
      KPI_DETAIL_NOT_FOUND: "Can't find proper datapoint or chart definition for KPI ",
      NO_ANALYTICS: "The following entitySet used in a KPI definition doesn't support $apply queries:",
      MAIN_PROPERTY_NOT_AGGREGATABLE: "Main property used in KPI cannot be aggregated "
    }
  };
  _exports.IssueType = IssueType;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIklzc3VlTWFuYWdlci50cyJdLCJuYW1lcyI6WyJJc3N1ZVNldmVyaXR5IiwiSXNzdWVDYXRlZ29yeVR5cGUiLCJGYWNldHMiLCJNaXNzaW5nSUQiLCJVblN1cHBvcnRlZExldmVsIiwiSXNzdWVDYXRlZ29yeSIsIklzc3VlVHlwZSIsIk1JU1NJTkdfTElORUlURU0iLCJNSVNTSU5HX1NFTEVDVElPTkZJRUxEIiwiTUFMRk9STUVEX0RBVEFGSUVMRF9GT1JfSUJOIiwiUkVRVUlSRVNDT05URVhUIiwiSU5MSU5FIiwiREVURVJNSU5JTkciLCJNQUxGT1JNRURfVklTVUFMRklMVEVSUyIsIlZBTFVFTElTVCIsIlBSRVNFTlRBVElPTlZBUklBTlQiLCJDSEFSVCIsIlZBTFVFTElTVENPTkZJRyIsIkZVTExTQ1JFRU5NT0RFX05PVF9PTl9MSVNUUkVQT1JUIiwiS1BJX0lTU1VFUyIsIktQSV9OT1RfRk9VTkQiLCJLUElfREVUQUlMX05PVF9GT1VORCIsIk5PX0FOQUxZVElDUyIsIk1BSU5fUFJPUEVSVFlfTk9UX0FHR1JFR0FUQUJMRSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTs7Ozs7O01BRllBLGE7O2FBQUFBLGE7QUFBQUEsSUFBQUEsYSxDQUFBQSxhO0FBQUFBLElBQUFBLGEsQ0FBQUEsYTtBQUFBQSxJQUFBQSxhLENBQUFBLGE7S0FBQUEsYSxLQUFBQSxhOzs7QUFNTCxNQUFNQyxpQkFBaUIsR0FBRztBQUNoQ0MsSUFBQUEsTUFBTSxFQUFFO0FBQ1BDLE1BQUFBLFNBQVMsRUFBRSxXQURKO0FBRVBDLE1BQUFBLGdCQUFnQixFQUFFO0FBRlg7QUFEd0IsR0FBMUI7O01BT0tDLGE7O2FBQUFBLGE7QUFBQUEsSUFBQUEsYTtBQUFBQSxJQUFBQSxhO0FBQUFBLElBQUFBLGE7QUFBQUEsSUFBQUEsYTtLQUFBQSxhLEtBQUFBLGE7OztBQU1MLE1BQU1DLFNBQVMsR0FBRztBQUN4QkMsSUFBQUEsZ0JBQWdCLEVBQUUsb0dBRE07QUFFeEJDLElBQUFBLHNCQUFzQixFQUFFLHNDQUZBO0FBR3hCQyxJQUFBQSwyQkFBMkIsRUFBRTtBQUM1QkMsTUFBQUEsZUFBZSxFQUFFLCtFQURXO0FBRTVCQyxNQUFBQSxNQUFNLEVBQUUscUVBRm9CO0FBRzVCQyxNQUFBQSxXQUFXLEVBQUU7QUFIZSxLQUhMO0FBUXhCQyxJQUFBQSx1QkFBdUIsRUFBRTtBQUN4QkMsTUFBQUEsU0FBUyxFQUFFLHVEQURhO0FBRXhCQyxNQUFBQSxtQkFBbUIsRUFBRSxrRUFGRztBQUd4QkMsTUFBQUEsS0FBSyxFQUFFLDBFQUhpQjtBQUl4QkMsTUFBQUEsZUFBZSxFQUFFO0FBSk8sS0FSRDtBQWN4QkMsSUFBQUEsZ0NBQWdDLEVBQUUsNkRBZFY7QUFleEJDLElBQUFBLFVBQVUsRUFBRTtBQUNYQyxNQUFBQSxhQUFhLEVBQUUsMENBREo7QUFFWEMsTUFBQUEsb0JBQW9CLEVBQUUsMERBRlg7QUFHWEMsTUFBQUEsWUFBWSxFQUFFLGtGQUhIO0FBSVhDLE1BQUFBLDhCQUE4QixFQUFFO0FBSnJCO0FBZlksR0FBbEIiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBlbnVtIElzc3VlU2V2ZXJpdHkge1xuXHRIaWdoLFxuXHRMb3csXG5cdE1lZGl1bVxufVxuXG5leHBvcnQgY29uc3QgSXNzdWVDYXRlZ29yeVR5cGUgPSB7XG5cdEZhY2V0czoge1xuXHRcdE1pc3NpbmdJRDogXCJNaXNzaW5nSURcIixcblx0XHRVblN1cHBvcnRlZExldmVsOiBcIlVuc3VwcG9ydGVkTGV2ZWxcIlxuXHR9XG59O1xuXG5leHBvcnQgZW51bSBJc3N1ZUNhdGVnb3J5IHtcblx0QW5ub3RhdGlvbiA9IFwiQW5ub3RhdGlvblwiLFxuXHRUZW1wbGF0ZSA9IFwiVGVtcGxhdGVcIixcblx0TWFuaWZlc3QgPSBcIk1hbmlmZXN0XCIsXG5cdEZhY2V0cyA9IFwiRmFjZXRzXCJcbn1cbmV4cG9ydCBjb25zdCBJc3N1ZVR5cGUgPSB7XG5cdE1JU1NJTkdfTElORUlURU06IFwiV2UgY291bGRuJ3QgZmluZCBhIGxpbmUgaXRlbSBhbm5vdGF0aW9uIGZvciB0aGUgY3VycmVudCBlbnRpdHlTZXQsIHlvdSBzaG91bGQgY29uc2lkZXIgYWRkaW5nIG9uZS5cIixcblx0TUlTU0lOR19TRUxFQ1RJT05GSUVMRDogXCJEZWZpbmVkIFNlbGVjdGlvbiBGaWVsZCBpcyBub3QgZm91bmRcIixcblx0TUFMRk9STUVEX0RBVEFGSUVMRF9GT1JfSUJOOiB7XG5cdFx0UkVRVUlSRVNDT05URVhUOiBcIkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbiBjYW5ub3QgdXNlIHJlcXVpcmVzIGNvbnRleHQgaW4gZm9ybS9oZWFkZXIuXCIsXG5cdFx0SU5MSU5FOiBcIkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbiBjYW5ub3QgdXNlIElubGluZSBpbiBmb3JtL2hlYWRlci5cIixcblx0XHRERVRFUk1JTklORzogXCJEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24gY2Fubm90IHVzZSBEZXRlcm1pbmluZyBpbiBmb3JtL2hlYWRlci5cIlxuXHR9LFxuXHRNQUxGT1JNRURfVklTVUFMRklMVEVSUzoge1xuXHRcdFZBTFVFTElTVDogXCJWYWx1ZUxpc3QgUGF0aCBtZW50aW9uZWQgaW4gdGhlIG1hbmlmZXN0IGlzIG5vdCBmb3VuZFwiLFxuXHRcdFBSRVNFTlRBVElPTlZBUklBTlQ6IFwiUHJlc2VudGF0aW9uIFZhcmlhbnQgQW5ub3RhdGlvbiBpcyBtaXNzaW5nIGZvciB0aGUgVmlzdWFsRmlsdGVyc1wiLFxuXHRcdENIQVJUOiBcIkNoYXJ0IEFubm90YXRpb24gaXMgbWlzc2luZyBmcm9tIHRoZSBQViBjb25maWd1cmVkIGZvciB0aGUgVmlzdWFsRmlsdGVyc1wiLFxuXHRcdFZBTFVFTElTVENPTkZJRzogXCJWYWx1ZUxpc3QgaXMgbm90IGJlZW4gY29uZmlndXJlZCBpbnNpZGUgdGhlIFZpc3VhbCBGaWx0ZXIgU2V0dGluZ3NcIlxuXHR9LFxuXHRGVUxMU0NSRUVOTU9ERV9OT1RfT05fTElTVFJFUE9SVDogXCJlbmFibGVGdWxsU2NyZWVuTW9kZSBpcyBub3Qgc3VwcG9ydGVkIG9uIGxpc3QgcmVwb3J0IHBhZ2VzLlwiLFxuXHRLUElfSVNTVUVTOiB7XG5cdFx0S1BJX05PVF9GT1VORDogXCJDb3VsZG4ndCBmaW5kIEtQSSBvciBTUFYgd2l0aCBxdWFsaWZpZXIgXCIsXG5cdFx0S1BJX0RFVEFJTF9OT1RfRk9VTkQ6IFwiQ2FuJ3QgZmluZCBwcm9wZXIgZGF0YXBvaW50IG9yIGNoYXJ0IGRlZmluaXRpb24gZm9yIEtQSSBcIixcblx0XHROT19BTkFMWVRJQ1M6IFwiVGhlIGZvbGxvd2luZyBlbnRpdHlTZXQgdXNlZCBpbiBhIEtQSSBkZWZpbml0aW9uIGRvZXNuJ3Qgc3VwcG9ydCAkYXBwbHkgcXVlcmllczpcIixcblx0XHRNQUlOX1BST1BFUlRZX05PVF9BR0dSRUdBVEFCTEU6IFwiTWFpbiBwcm9wZXJ0eSB1c2VkIGluIEtQSSBjYW5ub3QgYmUgYWdncmVnYXRlZCBcIlxuXHR9XG59O1xuIl19