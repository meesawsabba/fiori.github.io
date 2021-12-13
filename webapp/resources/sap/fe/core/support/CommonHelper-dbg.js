/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/support/library", "sap/fe/core/converters/helpers/IssueManager"], function (SupportLib, IssueManager) {
  "use strict";

  var _exports = {};
  var IssueSeverity = IssueManager.IssueSeverity;
  var IssueCategory = IssueManager.IssueCategory;

  var Categories = SupportLib.Categories,
      // Accessibility, Performance, Memory, ...
  Severity = SupportLib.Severity,
      // Hint, Warning, Error
  Audiences = SupportLib.Audiences; // Control, Internal, Application
  //**********************************************************
  // Rule Definitions
  //**********************************************************
  // Rule checks if objectPage componentContainer height is set

  _exports.Categories = Categories;
  _exports.Audiences = Audiences;
  _exports.Severity = Severity;

  var getSeverity = function (oSeverity) {
    switch (oSeverity) {
      case IssueSeverity.Low:
        return Severity.Low;

      case IssueSeverity.High:
        return Severity.High;

      case IssueSeverity.Medium:
        return Severity.Medium;
    }
  };

  _exports.getSeverity = getSeverity;

  var getIssueByCategory = function (oIssueManager, oCoreFacade, issueCategoryType, issueSubCategoryType) {
    var mComponents = oCoreFacade.getComponents();
    var oAppComponent;
    Object.keys(mComponents).forEach(function (sKey) {
      var _oComponent$getMetada, _oComponent$getMetada2;

      var oComponent = mComponents[sKey];

      if ((oComponent === null || oComponent === void 0 ? void 0 : (_oComponent$getMetada = oComponent.getMetadata()) === null || _oComponent$getMetada === void 0 ? void 0 : (_oComponent$getMetada2 = _oComponent$getMetada.getParent()) === null || _oComponent$getMetada2 === void 0 ? void 0 : _oComponent$getMetada2.getName()) === "sap.fe.core.AppComponent") {
        oAppComponent = oComponent;
      }
    });

    if (oAppComponent) {
      var aIssues = oAppComponent.getDiagnostics().getIssuesByCategory(IssueCategory[issueCategoryType], issueSubCategoryType);
      aIssues.forEach(function (oElement) {
        oIssueManager.addIssue({
          severity: getSeverity(oElement.severity),
          details: oElement.details,
          context: {
            id: oElement.category
          }
        });
      });
    }
  };

  _exports.getIssueByCategory = getIssueByCategory;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbW1vbkhlbHBlci50cyJdLCJuYW1lcyI6WyJDYXRlZ29yaWVzIiwiU3VwcG9ydExpYiIsIlNldmVyaXR5IiwiQXVkaWVuY2VzIiwiZ2V0U2V2ZXJpdHkiLCJvU2V2ZXJpdHkiLCJJc3N1ZVNldmVyaXR5IiwiTG93IiwiSGlnaCIsIk1lZGl1bSIsImdldElzc3VlQnlDYXRlZ29yeSIsIm9Jc3N1ZU1hbmFnZXIiLCJvQ29yZUZhY2FkZSIsImlzc3VlQ2F0ZWdvcnlUeXBlIiwiaXNzdWVTdWJDYXRlZ29yeVR5cGUiLCJtQ29tcG9uZW50cyIsImdldENvbXBvbmVudHMiLCJvQXBwQ29tcG9uZW50IiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJzS2V5Iiwib0NvbXBvbmVudCIsImdldE1ldGFkYXRhIiwiZ2V0UGFyZW50IiwiZ2V0TmFtZSIsImFJc3N1ZXMiLCJnZXREaWFnbm9zdGljcyIsImdldElzc3Vlc0J5Q2F0ZWdvcnkiLCJJc3N1ZUNhdGVnb3J5Iiwib0VsZW1lbnQiLCJhZGRJc3N1ZSIsInNldmVyaXR5IiwiZGV0YWlscyIsImNvbnRleHQiLCJpZCIsImNhdGVnb3J5Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBOzs7Ozs7OztBQVNPLE1BQU1BLFVBQVUsR0FBR0MsVUFBVSxDQUFDRCxVQUE5QjtBQUFBLE1BQTBDO0FBQ2hERSxFQUFBQSxRQUFRLEdBQUdELFVBQVUsQ0FBQ0MsUUFEaEI7QUFBQSxNQUMwQjtBQUNoQ0MsRUFBQUEsU0FBUyxHQUFHRixVQUFVLENBQUNFLFNBRmpCLEMsQ0FFNEI7QUFFbkM7QUFDQTtBQUNBO0FBRUE7Ozs7OztBQUVPLE1BQU1DLFdBQVcsR0FBRyxVQUFTQyxTQUFULEVBQW1DO0FBQzdELFlBQVFBLFNBQVI7QUFDQyxXQUFLQyxhQUFhLENBQUNDLEdBQW5CO0FBQ0MsZUFBT0wsUUFBUSxDQUFDSyxHQUFoQjs7QUFDRCxXQUFLRCxhQUFhLENBQUNFLElBQW5CO0FBQ0MsZUFBT04sUUFBUSxDQUFDTSxJQUFoQjs7QUFDRCxXQUFLRixhQUFhLENBQUNHLE1BQW5CO0FBQ0MsZUFBT1AsUUFBUSxDQUFDTyxNQUFoQjtBQU5GO0FBUUEsR0FUTTs7OztBQVdBLE1BQU1DLGtCQUFrQixHQUFHLFVBQ2pDQyxhQURpQyxFQUVqQ0MsV0FGaUMsRUFHakNDLGlCQUhpQyxFQUlqQ0Msb0JBSmlDLEVBS2hDO0FBQ0QsUUFBTUMsV0FBVyxHQUFHSCxXQUFXLENBQUNJLGFBQVosRUFBcEI7QUFDQSxRQUFJQyxhQUFKO0FBQ0FDLElBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZSixXQUFaLEVBQXlCSyxPQUF6QixDQUFpQyxVQUFBQyxJQUFJLEVBQUk7QUFBQTs7QUFDeEMsVUFBTUMsVUFBVSxHQUFHUCxXQUFXLENBQUNNLElBQUQsQ0FBOUI7O0FBQ0EsVUFDQyxDQUFBQyxVQUFVLFNBQVYsSUFBQUEsVUFBVSxXQUFWLHFDQUFBQSxVQUFVLENBQ1BDLFdBREgsNEdBRUdDLFNBRkgsb0ZBR0dDLE9BSEgsUUFHaUIsMEJBSmxCLEVBS0U7QUFDRFIsUUFBQUEsYUFBYSxHQUFHSyxVQUFoQjtBQUNBO0FBQ0QsS0FWRDs7QUFXQSxRQUFJTCxhQUFKLEVBQW1CO0FBQ2xCLFVBQU1TLE9BQU8sR0FBR1QsYUFBYSxDQUFDVSxjQUFkLEdBQStCQyxtQkFBL0IsQ0FBbURDLGFBQWEsQ0FBQ2hCLGlCQUFELENBQWhFLEVBQXFGQyxvQkFBckYsQ0FBaEI7QUFFQVksTUFBQUEsT0FBTyxDQUFDTixPQUFSLENBQWdCLFVBQVNVLFFBQVQsRUFBb0M7QUFDbkRuQixRQUFBQSxhQUFhLENBQUNvQixRQUFkLENBQXVCO0FBQ3RCQyxVQUFBQSxRQUFRLEVBQUU1QixXQUFXLENBQUMwQixRQUFRLENBQUNFLFFBQVYsQ0FEQztBQUV0QkMsVUFBQUEsT0FBTyxFQUFFSCxRQUFRLENBQUNHLE9BRkk7QUFHdEJDLFVBQUFBLE9BQU8sRUFBRTtBQUNSQyxZQUFBQSxFQUFFLEVBQUVMLFFBQVEsQ0FBQ007QUFETDtBQUhhLFNBQXZCO0FBT0EsT0FSRDtBQVNBO0FBQ0QsR0FoQ00iLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogJHtjb3B5cmlnaHR9XG4gKi9cbi8qKlxuICogRGVmaW5lcyBzdXBwb3J0IHJ1bGVzIG9mIHRoZSBPYmplY3RQYWdlSGVhZGVyIGNvbnRyb2wgb2Ygc2FwLnV4YXAgbGlicmFyeS5cbiAqL1xuaW1wb3J0IFN1cHBvcnRMaWIgZnJvbSBcInNhcC91aS9zdXBwb3J0L2xpYnJhcnlcIjtcbmltcG9ydCB7IElzc3VlQ2F0ZWdvcnksIElzc3VlU2V2ZXJpdHkgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0lzc3VlTWFuYWdlclwiO1xuaW1wb3J0IHsgSXNzdWVEZWZpbml0aW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL3N1cHBvcnQvRGlhZ25vc3RpY3NcIjtcbmltcG9ydCB7IEFwcENvbXBvbmVudCB9IGZyb20gXCJzYXAvZmUvY29yZVwiO1xuXG5leHBvcnQgY29uc3QgQ2F0ZWdvcmllcyA9IFN1cHBvcnRMaWIuQ2F0ZWdvcmllcywgLy8gQWNjZXNzaWJpbGl0eSwgUGVyZm9ybWFuY2UsIE1lbW9yeSwgLi4uXG5cdFNldmVyaXR5ID0gU3VwcG9ydExpYi5TZXZlcml0eSwgLy8gSGludCwgV2FybmluZywgRXJyb3Jcblx0QXVkaWVuY2VzID0gU3VwcG9ydExpYi5BdWRpZW5jZXM7IC8vIENvbnRyb2wsIEludGVybmFsLCBBcHBsaWNhdGlvblxuXG4vLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIFJ1bGUgRGVmaW5pdGlvbnNcbi8vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4vLyBSdWxlIGNoZWNrcyBpZiBvYmplY3RQYWdlIGNvbXBvbmVudENvbnRhaW5lciBoZWlnaHQgaXMgc2V0XG5cbmV4cG9ydCBjb25zdCBnZXRTZXZlcml0eSA9IGZ1bmN0aW9uKG9TZXZlcml0eTogSXNzdWVTZXZlcml0eSkge1xuXHRzd2l0Y2ggKG9TZXZlcml0eSkge1xuXHRcdGNhc2UgSXNzdWVTZXZlcml0eS5Mb3c6XG5cdFx0XHRyZXR1cm4gU2V2ZXJpdHkuTG93O1xuXHRcdGNhc2UgSXNzdWVTZXZlcml0eS5IaWdoOlxuXHRcdFx0cmV0dXJuIFNldmVyaXR5LkhpZ2g7XG5cdFx0Y2FzZSBJc3N1ZVNldmVyaXR5Lk1lZGl1bTpcblx0XHRcdHJldHVybiBTZXZlcml0eS5NZWRpdW07XG5cdH1cbn07XG5cbmV4cG9ydCBjb25zdCBnZXRJc3N1ZUJ5Q2F0ZWdvcnkgPSBmdW5jdGlvbihcblx0b0lzc3VlTWFuYWdlcjogYW55LFxuXHRvQ29yZUZhY2FkZTogYW55IC8qb1Njb3BlOiBhbnkqLyxcblx0aXNzdWVDYXRlZ29yeVR5cGU6IElzc3VlQ2F0ZWdvcnksXG5cdGlzc3VlU3ViQ2F0ZWdvcnlUeXBlPzogc3RyaW5nXG4pIHtcblx0Y29uc3QgbUNvbXBvbmVudHMgPSBvQ29yZUZhY2FkZS5nZXRDb21wb25lbnRzKCk7XG5cdGxldCBvQXBwQ29tcG9uZW50ITogQXBwQ29tcG9uZW50O1xuXHRPYmplY3Qua2V5cyhtQ29tcG9uZW50cykuZm9yRWFjaChzS2V5ID0+IHtcblx0XHRjb25zdCBvQ29tcG9uZW50ID0gbUNvbXBvbmVudHNbc0tleV07XG5cdFx0aWYgKFxuXHRcdFx0b0NvbXBvbmVudFxuXHRcdFx0XHQ/LmdldE1ldGFkYXRhKClcblx0XHRcdFx0Py5nZXRQYXJlbnQoKVxuXHRcdFx0XHQ/LmdldE5hbWUoKSA9PT0gXCJzYXAuZmUuY29yZS5BcHBDb21wb25lbnRcIlxuXHRcdCkge1xuXHRcdFx0b0FwcENvbXBvbmVudCA9IG9Db21wb25lbnQ7XG5cdFx0fVxuXHR9KTtcblx0aWYgKG9BcHBDb21wb25lbnQpIHtcblx0XHRjb25zdCBhSXNzdWVzID0gb0FwcENvbXBvbmVudC5nZXREaWFnbm9zdGljcygpLmdldElzc3Vlc0J5Q2F0ZWdvcnkoSXNzdWVDYXRlZ29yeVtpc3N1ZUNhdGVnb3J5VHlwZV0sIGlzc3VlU3ViQ2F0ZWdvcnlUeXBlKTtcblxuXHRcdGFJc3N1ZXMuZm9yRWFjaChmdW5jdGlvbihvRWxlbWVudDogSXNzdWVEZWZpbml0aW9uKSB7XG5cdFx0XHRvSXNzdWVNYW5hZ2VyLmFkZElzc3VlKHtcblx0XHRcdFx0c2V2ZXJpdHk6IGdldFNldmVyaXR5KG9FbGVtZW50LnNldmVyaXR5KSxcblx0XHRcdFx0ZGV0YWlsczogb0VsZW1lbnQuZGV0YWlscyxcblx0XHRcdFx0Y29udGV4dDoge1xuXHRcdFx0XHRcdGlkOiBvRWxlbWVudC5jYXRlZ29yeVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxufTtcbiJdfQ==