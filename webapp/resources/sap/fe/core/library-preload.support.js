//@ui5-bundle sap/fe/core/library-preload.support.js
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
/**
 * Adds support rules of the sap.fe.core library to the support infrastructure.
 */
sap.ui.predefine('sap/fe/core/library.support',
	[
		"./support/AnnotationIssue.support",
		"./support/CollectionFacetMissingID.support",
		"./support/CollectionFacetUnsupportedLevel.support"
	],
	function(AnnotationIssue, CollectionFacetMissingID, CollectionFacetUnsupportedLevel) {
		"use strict";

		sap.ui.support.SystemPresets.FeV4 = {
			id: "FioriElementsV4",
			title: "Fiori Elements V4",
			description: "Fiori Elements V4 rules",
			selections: [{ ruleId: "annotationIssue", libName: "sap.fe.core" }]
		};

		return {
			name: "sap.fe.core",
			niceName: "SAP.FE V4 - Core library",
			ruleset: [AnnotationIssue.getRules(), CollectionFacetMissingID.getRules(), CollectionFacetUnsupportedLevel.getRules()]
		};
	},
	true
);
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.predefine('sap/fe/core/support/AnnotationIssue.support',["sap/fe/core/support/CommonHelper", "sap/fe/core/converters/helpers/IssueManager"], function (CommonHelper, IssueManager) {
  "use strict";

  var _exports = {};
  var IssueCategory = IssueManager.IssueCategory;
  var Audiences = CommonHelper.Audiences;
  var getIssueByCategory = CommonHelper.getIssueByCategory;
  var Categories = CommonHelper.Categories;

  var oAnnotationIssue = {
    id: "annotationIssue",
    title: "Annotations: Incorrect path or target",
    minversion: "1.85",
    audiences: [Audiences.Application],
    categories: [Categories.Usage],
    description: "This rule identifies the incorrect path or targets defined in the metadata of the annotation.xml file or CDS annotations.",
    resolution: "Please review the message details for more information.",
    resolutionurls: [{
      "text": "CDS Annotations reference",
      "href": "https://cap.cloud.sap/docs/cds/common"
    }],
    check: function (oIssueManager, oCoreFacade) {
      getIssueByCategory(oIssueManager, oCoreFacade, IssueCategory.Annotation);
    }
  };

  function getRules() {
    return [oAnnotationIssue];
  }

  _exports.getRules = getRules;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFubm90YXRpb25Jc3N1ZS5zdXBwb3J0LnRzIl0sIm5hbWVzIjpbIm9Bbm5vdGF0aW9uSXNzdWUiLCJpZCIsInRpdGxlIiwibWludmVyc2lvbiIsImF1ZGllbmNlcyIsIkF1ZGllbmNlcyIsIkFwcGxpY2F0aW9uIiwiY2F0ZWdvcmllcyIsIkNhdGVnb3JpZXMiLCJVc2FnZSIsImRlc2NyaXB0aW9uIiwicmVzb2x1dGlvbiIsInJlc29sdXRpb251cmxzIiwiY2hlY2siLCJvSXNzdWVNYW5hZ2VyIiwib0NvcmVGYWNhZGUiLCJnZXRJc3N1ZUJ5Q2F0ZWdvcnkiLCJJc3N1ZUNhdGVnb3J5IiwiQW5ub3RhdGlvbiIsImdldFJ1bGVzIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FBQ0EsTUFBTUEsZ0JBQWdCLEdBQUc7QUFDeEJDLElBQUFBLEVBQUUsRUFBRSxpQkFEb0I7QUFFeEJDLElBQUFBLEtBQUssRUFBRSx1Q0FGaUI7QUFHeEJDLElBQUFBLFVBQVUsRUFBRSxNQUhZO0FBSXhCQyxJQUFBQSxTQUFTLEVBQUUsQ0FBQ0MsU0FBUyxDQUFDQyxXQUFYLENBSmE7QUFLeEJDLElBQUFBLFVBQVUsRUFBRSxDQUFDQyxVQUFVLENBQUNDLEtBQVosQ0FMWTtBQU14QkMsSUFBQUEsV0FBVyxFQUNWLDJIQVB1QjtBQVF4QkMsSUFBQUEsVUFBVSxFQUFFLHlEQVJZO0FBU3hCQyxJQUFBQSxjQUFjLEVBQUUsQ0FBQztBQUFFLGNBQVEsMkJBQVY7QUFBdUMsY0FBUTtBQUEvQyxLQUFELENBVFE7QUFVeEJDLElBQUFBLEtBQUssRUFBRSxVQUFTQyxhQUFULEVBQTZCQyxXQUE3QixFQUErRDtBQUNyRUMsTUFBQUEsa0JBQWtCLENBQUNGLGFBQUQsRUFBZ0JDLFdBQWhCLEVBQTZCRSxhQUFhLENBQUNDLFVBQTNDLENBQWxCO0FBQ0E7QUFadUIsR0FBekI7O0FBY08sV0FBU0MsUUFBVCxHQUFvQjtBQUMxQixXQUFPLENBQUNuQixnQkFBRCxDQUFQO0FBQ0EiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhdGVnb3JpZXMsIGdldElzc3VlQnlDYXRlZ29yeSwgQXVkaWVuY2VzIH0gZnJvbSBcInNhcC9mZS9jb3JlL3N1cHBvcnQvQ29tbW9uSGVscGVyXCI7XG5pbXBvcnQgeyBJc3N1ZUNhdGVnb3J5IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9Jc3N1ZU1hbmFnZXJcIjtcblxuY29uc3Qgb0Fubm90YXRpb25Jc3N1ZSA9IHtcblx0aWQ6IFwiYW5ub3RhdGlvbklzc3VlXCIsXG5cdHRpdGxlOiBcIkFubm90YXRpb25zOiBJbmNvcnJlY3QgcGF0aCBvciB0YXJnZXRcIixcblx0bWludmVyc2lvbjogXCIxLjg1XCIsXG5cdGF1ZGllbmNlczogW0F1ZGllbmNlcy5BcHBsaWNhdGlvbl0sXG5cdGNhdGVnb3JpZXM6IFtDYXRlZ29yaWVzLlVzYWdlXSxcblx0ZGVzY3JpcHRpb246XG5cdFx0XCJUaGlzIHJ1bGUgaWRlbnRpZmllcyB0aGUgaW5jb3JyZWN0IHBhdGggb3IgdGFyZ2V0cyBkZWZpbmVkIGluIHRoZSBtZXRhZGF0YSBvZiB0aGUgYW5ub3RhdGlvbi54bWwgZmlsZSBvciBDRFMgYW5ub3RhdGlvbnMuXCIsXG5cdHJlc29sdXRpb246IFwiUGxlYXNlIHJldmlldyB0aGUgbWVzc2FnZSBkZXRhaWxzIGZvciBtb3JlIGluZm9ybWF0aW9uLlwiLFxuXHRyZXNvbHV0aW9udXJsczogW3sgXCJ0ZXh0XCI6IFwiQ0RTIEFubm90YXRpb25zIHJlZmVyZW5jZVwiLCBcImhyZWZcIjogXCJodHRwczovL2NhcC5jbG91ZC5zYXAvZG9jcy9jZHMvY29tbW9uXCIgfV0sXG5cdGNoZWNrOiBmdW5jdGlvbihvSXNzdWVNYW5hZ2VyOiBhbnksIG9Db3JlRmFjYWRlOiBhbnkgLypvU2NvcGU6IGFueSovKSB7XG5cdFx0Z2V0SXNzdWVCeUNhdGVnb3J5KG9Jc3N1ZU1hbmFnZXIsIG9Db3JlRmFjYWRlLCBJc3N1ZUNhdGVnb3J5LkFubm90YXRpb24pO1xuXHR9XG59O1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJ1bGVzKCkge1xuXHRyZXR1cm4gW29Bbm5vdGF0aW9uSXNzdWVdO1xufVxuIl19
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.predefine('sap/fe/core/support/CollectionFacetMissingID.support',["sap/fe/core/support/CommonHelper", "sap/fe/core/converters/helpers/IssueManager"], function (CommonHelper, IssueManager) {
  "use strict";

  var _exports = {};
  var IssueCategory = IssueManager.IssueCategory;
  var Audiences = CommonHelper.Audiences;
  var getIssueByCategory = CommonHelper.getIssueByCategory;
  var Categories = CommonHelper.Categories;

  var oCollectionFacetMissingIDIssue = {
    id: "collectionFacetMissingId",
    title: "CollectionFacet: Missing IDs",
    minversion: "1.85",
    audiences: [Audiences.Application],
    categories: [Categories.Usage],
    description: "A collection facet requires an ID in the annotation file to derive a control ID from it.",
    resolution: "Always provide a unique ID to a collection facet.",
    resolutionurls: [{
      "text": "CollectionFacets",
      "href": "https://ui5.sap.com/#/topic/facfea09018d4376acaceddb7e3f03b6"
    }],
    check: function (oIssueManager, oCoreFacade) {
      getIssueByCategory(oIssueManager, oCoreFacade, IssueCategory.Facets, "MissingID");
    }
  };

  function getRules() {
    return [oCollectionFacetMissingIDIssue];
  }

  _exports.getRules = getRules;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbGxlY3Rpb25GYWNldE1pc3NpbmdJRC5zdXBwb3J0LnRzIl0sIm5hbWVzIjpbIm9Db2xsZWN0aW9uRmFjZXRNaXNzaW5nSURJc3N1ZSIsImlkIiwidGl0bGUiLCJtaW52ZXJzaW9uIiwiYXVkaWVuY2VzIiwiQXVkaWVuY2VzIiwiQXBwbGljYXRpb24iLCJjYXRlZ29yaWVzIiwiQ2F0ZWdvcmllcyIsIlVzYWdlIiwiZGVzY3JpcHRpb24iLCJyZXNvbHV0aW9uIiwicmVzb2x1dGlvbnVybHMiLCJjaGVjayIsIm9Jc3N1ZU1hbmFnZXIiLCJvQ29yZUZhY2FkZSIsImdldElzc3VlQnlDYXRlZ29yeSIsIklzc3VlQ2F0ZWdvcnkiLCJGYWNldHMiLCJnZXRSdWxlcyJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQUFBLE1BQU1BLDhCQUE4QixHQUFHO0FBQ3RDQyxJQUFBQSxFQUFFLEVBQUUsMEJBRGtDO0FBRXRDQyxJQUFBQSxLQUFLLEVBQUUsOEJBRitCO0FBR3RDQyxJQUFBQSxVQUFVLEVBQUUsTUFIMEI7QUFJdENDLElBQUFBLFNBQVMsRUFBRSxDQUFDQyxTQUFTLENBQUNDLFdBQVgsQ0FKMkI7QUFLdENDLElBQUFBLFVBQVUsRUFBRSxDQUFDQyxVQUFVLENBQUNDLEtBQVosQ0FMMEI7QUFNdENDLElBQUFBLFdBQVcsRUFBRSwwRkFOeUI7QUFPdENDLElBQUFBLFVBQVUsRUFBRSxtREFQMEI7QUFRdENDLElBQUFBLGNBQWMsRUFBRSxDQUFDO0FBQUUsY0FBUSxrQkFBVjtBQUE4QixjQUFRO0FBQXRDLEtBQUQsQ0FSc0I7QUFTdENDLElBQUFBLEtBQUssRUFBRSxVQUFTQyxhQUFULEVBQTZCQyxXQUE3QixFQUErRDtBQUNyRUMsTUFBQUEsa0JBQWtCLENBQUNGLGFBQUQsRUFBZ0JDLFdBQWhCLEVBQTZCRSxhQUFhLENBQUNDLE1BQTNDLEVBQW1ELFdBQW5ELENBQWxCO0FBQ0E7QUFYcUMsR0FBdkM7O0FBYU8sV0FBU0MsUUFBVCxHQUFvQjtBQUMxQixXQUFPLENBQUNuQiw4QkFBRCxDQUFQO0FBQ0EiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhdGVnb3JpZXMsIGdldElzc3VlQnlDYXRlZ29yeSwgQXVkaWVuY2VzIH0gZnJvbSBcInNhcC9mZS9jb3JlL3N1cHBvcnQvQ29tbW9uSGVscGVyXCI7XG5pbXBvcnQgeyBJc3N1ZUNhdGVnb3J5IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9Jc3N1ZU1hbmFnZXJcIjtcbmNvbnN0IG9Db2xsZWN0aW9uRmFjZXRNaXNzaW5nSURJc3N1ZSA9IHtcblx0aWQ6IFwiY29sbGVjdGlvbkZhY2V0TWlzc2luZ0lkXCIsXG5cdHRpdGxlOiBcIkNvbGxlY3Rpb25GYWNldDogTWlzc2luZyBJRHNcIixcblx0bWludmVyc2lvbjogXCIxLjg1XCIsXG5cdGF1ZGllbmNlczogW0F1ZGllbmNlcy5BcHBsaWNhdGlvbl0sXG5cdGNhdGVnb3JpZXM6IFtDYXRlZ29yaWVzLlVzYWdlXSxcblx0ZGVzY3JpcHRpb246IFwiQSBjb2xsZWN0aW9uIGZhY2V0IHJlcXVpcmVzIGFuIElEIGluIHRoZSBhbm5vdGF0aW9uIGZpbGUgdG8gZGVyaXZlIGEgY29udHJvbCBJRCBmcm9tIGl0LlwiLFxuXHRyZXNvbHV0aW9uOiBcIkFsd2F5cyBwcm92aWRlIGEgdW5pcXVlIElEIHRvIGEgY29sbGVjdGlvbiBmYWNldC5cIixcblx0cmVzb2x1dGlvbnVybHM6IFt7IFwidGV4dFwiOiBcIkNvbGxlY3Rpb25GYWNldHNcIiwgXCJocmVmXCI6IFwiaHR0cHM6Ly91aTUuc2FwLmNvbS8jL3RvcGljL2ZhY2ZlYTA5MDE4ZDQzNzZhY2FjZWRkYjdlM2YwM2I2XCIgfV0sXG5cdGNoZWNrOiBmdW5jdGlvbihvSXNzdWVNYW5hZ2VyOiBhbnksIG9Db3JlRmFjYWRlOiBhbnkgLypvU2NvcGU6IGFueSovKSB7XG5cdFx0Z2V0SXNzdWVCeUNhdGVnb3J5KG9Jc3N1ZU1hbmFnZXIsIG9Db3JlRmFjYWRlLCBJc3N1ZUNhdGVnb3J5LkZhY2V0cywgXCJNaXNzaW5nSURcIik7XG5cdH1cbn07XG5leHBvcnQgZnVuY3Rpb24gZ2V0UnVsZXMoKSB7XG5cdHJldHVybiBbb0NvbGxlY3Rpb25GYWNldE1pc3NpbmdJRElzc3VlXTtcbn1cbiJdfQ==
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.predefine('sap/fe/core/support/CollectionFacetUnsupportedLevel.support',["sap/fe/core/support/CommonHelper", "sap/fe/core/converters/helpers/IssueManager"], function (CommonHelper, IssueManager) {
  "use strict";

  var _exports = {};
  var IssueCategory = IssueManager.IssueCategory;
  var Audiences = CommonHelper.Audiences;
  var getIssueByCategory = CommonHelper.getIssueByCategory;
  var Categories = CommonHelper.Categories;

  var oCollectionFacetUnsupportedLevelIssue = {
    id: "collectionFacetUnsupportedLevel",
    title: "CollectionFacet: Unsupported Levels",
    minversion: "1.86",
    audiences: [Audiences.Application],
    categories: [Categories.Usage],
    description: "Collection facets at level 3 or lower (level 4, 5…) are not supported and will not be visible on the UI.",
    resolution: "At level 3 you can only use reference facets, but not collection facets.",
    resolutionurls: [{
      "text": "CollectionFacets",
      "href": "https://ui5.sap.com/#/topic/facfea09018d4376acaceddb7e3f03b6"
    }],
    check: function (oIssueManager, oCoreFacade) {
      getIssueByCategory(oIssueManager, oCoreFacade, IssueCategory.Facets, "UnsupportedLevel");
    }
  };

  function getRules() {
    return [oCollectionFacetUnsupportedLevelIssue];
  }

  _exports.getRules = getRules;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbGxlY3Rpb25GYWNldFVuc3VwcG9ydGVkTGV2ZWwuc3VwcG9ydC50cyJdLCJuYW1lcyI6WyJvQ29sbGVjdGlvbkZhY2V0VW5zdXBwb3J0ZWRMZXZlbElzc3VlIiwiaWQiLCJ0aXRsZSIsIm1pbnZlcnNpb24iLCJhdWRpZW5jZXMiLCJBdWRpZW5jZXMiLCJBcHBsaWNhdGlvbiIsImNhdGVnb3JpZXMiLCJDYXRlZ29yaWVzIiwiVXNhZ2UiLCJkZXNjcmlwdGlvbiIsInJlc29sdXRpb24iLCJyZXNvbHV0aW9udXJscyIsImNoZWNrIiwib0lzc3VlTWFuYWdlciIsIm9Db3JlRmFjYWRlIiwiZ2V0SXNzdWVCeUNhdGVnb3J5IiwiSXNzdWVDYXRlZ29yeSIsIkZhY2V0cyIsImdldFJ1bGVzIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FBQUEsTUFBTUEscUNBQXFDLEdBQUc7QUFDN0NDLElBQUFBLEVBQUUsRUFBRSxpQ0FEeUM7QUFFN0NDLElBQUFBLEtBQUssRUFBRSxxQ0FGc0M7QUFHN0NDLElBQUFBLFVBQVUsRUFBRSxNQUhpQztBQUk3Q0MsSUFBQUEsU0FBUyxFQUFFLENBQUNDLFNBQVMsQ0FBQ0MsV0FBWCxDQUprQztBQUs3Q0MsSUFBQUEsVUFBVSxFQUFFLENBQUNDLFVBQVUsQ0FBQ0MsS0FBWixDQUxpQztBQU03Q0MsSUFBQUEsV0FBVyxFQUFFLDBHQU5nQztBQU83Q0MsSUFBQUEsVUFBVSxFQUFFLDBFQVBpQztBQVE3Q0MsSUFBQUEsY0FBYyxFQUFFLENBQUM7QUFBRSxjQUFRLGtCQUFWO0FBQThCLGNBQVE7QUFBdEMsS0FBRCxDQVI2QjtBQVM3Q0MsSUFBQUEsS0FBSyxFQUFFLFVBQVNDLGFBQVQsRUFBNkJDLFdBQTdCLEVBQStEO0FBQ3JFQyxNQUFBQSxrQkFBa0IsQ0FBQ0YsYUFBRCxFQUFnQkMsV0FBaEIsRUFBNkJFLGFBQWEsQ0FBQ0MsTUFBM0MsRUFBbUQsa0JBQW5ELENBQWxCO0FBQ0E7QUFYNEMsR0FBOUM7O0FBYU8sV0FBU0MsUUFBVCxHQUFvQjtBQUMxQixXQUFPLENBQUNuQixxQ0FBRCxDQUFQO0FBQ0EiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhdGVnb3JpZXMsIGdldElzc3VlQnlDYXRlZ29yeSwgQXVkaWVuY2VzIH0gZnJvbSBcInNhcC9mZS9jb3JlL3N1cHBvcnQvQ29tbW9uSGVscGVyXCI7XG5pbXBvcnQgeyBJc3N1ZUNhdGVnb3J5IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9Jc3N1ZU1hbmFnZXJcIjtcbmNvbnN0IG9Db2xsZWN0aW9uRmFjZXRVbnN1cHBvcnRlZExldmVsSXNzdWUgPSB7XG5cdGlkOiBcImNvbGxlY3Rpb25GYWNldFVuc3VwcG9ydGVkTGV2ZWxcIixcblx0dGl0bGU6IFwiQ29sbGVjdGlvbkZhY2V0OiBVbnN1cHBvcnRlZCBMZXZlbHNcIixcblx0bWludmVyc2lvbjogXCIxLjg2XCIsXG5cdGF1ZGllbmNlczogW0F1ZGllbmNlcy5BcHBsaWNhdGlvbl0sXG5cdGNhdGVnb3JpZXM6IFtDYXRlZ29yaWVzLlVzYWdlXSxcblx0ZGVzY3JpcHRpb246IFwiQ29sbGVjdGlvbiBmYWNldHMgYXQgbGV2ZWwgMyBvciBsb3dlciAobGV2ZWwgNCwgNeKApikgYXJlIG5vdCBzdXBwb3J0ZWQgYW5kIHdpbGwgbm90IGJlIHZpc2libGUgb24gdGhlIFVJLlwiLFxuXHRyZXNvbHV0aW9uOiBcIkF0IGxldmVsIDMgeW91IGNhbiBvbmx5IHVzZSByZWZlcmVuY2UgZmFjZXRzLCBidXQgbm90IGNvbGxlY3Rpb24gZmFjZXRzLlwiLFxuXHRyZXNvbHV0aW9udXJsczogW3sgXCJ0ZXh0XCI6IFwiQ29sbGVjdGlvbkZhY2V0c1wiLCBcImhyZWZcIjogXCJodHRwczovL3VpNS5zYXAuY29tLyMvdG9waWMvZmFjZmVhMDkwMThkNDM3NmFjYWNlZGRiN2UzZjAzYjZcIiB9XSxcblx0Y2hlY2s6IGZ1bmN0aW9uKG9Jc3N1ZU1hbmFnZXI6IGFueSwgb0NvcmVGYWNhZGU6IGFueSAvKm9TY29wZTogYW55Ki8pIHtcblx0XHRnZXRJc3N1ZUJ5Q2F0ZWdvcnkob0lzc3VlTWFuYWdlciwgb0NvcmVGYWNhZGUsIElzc3VlQ2F0ZWdvcnkuRmFjZXRzLCBcIlVuc3VwcG9ydGVkTGV2ZWxcIik7XG5cdH1cbn07XG5leHBvcnQgZnVuY3Rpb24gZ2V0UnVsZXMoKSB7XG5cdHJldHVybiBbb0NvbGxlY3Rpb25GYWNldFVuc3VwcG9ydGVkTGV2ZWxJc3N1ZV07XG59XG4iXX0=
//# sourceMappingURL=library-preload.support.js.map