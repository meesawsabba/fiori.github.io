/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  var TemplateType;

  (function (TemplateType) {
    TemplateType["ListReport"] = "ListReport";
    TemplateType["ObjectPage"] = "ObjectPage";
    TemplateType["AnalyticalListPage"] = "AnalyticalListPage";
  })(TemplateType || (TemplateType = {}));

  _exports.TemplateType = TemplateType;
  var ActionType;

  (function (ActionType) {
    ActionType["DataFieldForAction"] = "ForAction";
    ActionType["DataFieldForIntentBasedNavigation"] = "ForNavigation";
    ActionType["Default"] = "Default";
    ActionType["Primary"] = "Primary";
    ActionType["Secondary"] = "Secondary";
    ActionType["SwitchToActiveObject"] = "SwitchToActiveObject";
    ActionType["SwitchToDraftObject"] = "SwitchToDraftObject";
    ActionType["DefaultApply"] = "DefaultApply";
    ActionType["Menu"] = "Menu";
  })(ActionType || (ActionType = {}));

  _exports.ActionType = ActionType;
  var VisualizationType;

  (function (VisualizationType) {
    VisualizationType["Table"] = "Table";
    VisualizationType["Chart"] = "Chart";
  })(VisualizationType || (VisualizationType = {}));

  _exports.VisualizationType = VisualizationType;
  var VariantManagementType;

  (function (VariantManagementType) {
    VariantManagementType["Page"] = "Page";
    VariantManagementType["Control"] = "Control";
    VariantManagementType["None"] = "None";
  })(VariantManagementType || (VariantManagementType = {}));

  _exports.VariantManagementType = VariantManagementType;
  var CreationMode;

  (function (CreationMode) {
    CreationMode["NewPage"] = "NewPage";
    CreationMode["Inline"] = "Inline";
    CreationMode["CreationRow"] = "CreationRow";
  })(CreationMode || (CreationMode = {}));

  _exports.CreationMode = CreationMode;
  var AvailabilityType;

  (function (AvailabilityType) {
    AvailabilityType["Default"] = "Default";
    AvailabilityType["Adaptation"] = "Adaptation";
    AvailabilityType["Hidden"] = "Hidden";
  })(AvailabilityType || (AvailabilityType = {}));

  _exports.AvailabilityType = AvailabilityType;
  var HorizontalAlign;

  (function (HorizontalAlign) {
    HorizontalAlign["End"] = "End";
    HorizontalAlign["Begin"] = "Begin";
    HorizontalAlign["Center"] = "Center";
  })(HorizontalAlign || (HorizontalAlign = {}));

  _exports.HorizontalAlign = HorizontalAlign;
  var SelectionMode;

  (function (SelectionMode) {
    SelectionMode["Auto"] = "Auto";
    SelectionMode["None"] = "None";
    SelectionMode["Multi"] = "Multi";
    SelectionMode["Single"] = "Single";
  })(SelectionMode || (SelectionMode = {}));

  _exports.SelectionMode = SelectionMode;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1hbmlmZXN0U2V0dGluZ3MudHMiXSwibmFtZXMiOlsiVGVtcGxhdGVUeXBlIiwiQWN0aW9uVHlwZSIsIlZpc3VhbGl6YXRpb25UeXBlIiwiVmFyaWFudE1hbmFnZW1lbnRUeXBlIiwiQ3JlYXRpb25Nb2RlIiwiQXZhaWxhYmlsaXR5VHlwZSIsIkhvcml6b250YWxBbGlnbiIsIlNlbGVjdGlvbk1vZGUiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7Ozs7OztNQUdZQSxZOzthQUFBQSxZO0FBQUFBLElBQUFBLFk7QUFBQUEsSUFBQUEsWTtBQUFBQSxJQUFBQSxZO0tBQUFBLFksS0FBQUEsWTs7O01BTUFDLFU7O2FBQUFBLFU7QUFBQUEsSUFBQUEsVTtBQUFBQSxJQUFBQSxVO0FBQUFBLElBQUFBLFU7QUFBQUEsSUFBQUEsVTtBQUFBQSxJQUFBQSxVO0FBQUFBLElBQUFBLFU7QUFBQUEsSUFBQUEsVTtBQUFBQSxJQUFBQSxVO0FBQUFBLElBQUFBLFU7S0FBQUEsVSxLQUFBQSxVOzs7TUFpQkFDLGlCOzthQUFBQSxpQjtBQUFBQSxJQUFBQSxpQjtBQUFBQSxJQUFBQSxpQjtLQUFBQSxpQixLQUFBQSxpQjs7O01BS0FDLHFCOzthQUFBQSxxQjtBQUFBQSxJQUFBQSxxQjtBQUFBQSxJQUFBQSxxQjtBQUFBQSxJQUFBQSxxQjtLQUFBQSxxQixLQUFBQSxxQjs7O01BV0FDLFk7O2FBQUFBLFk7QUFBQUEsSUFBQUEsWTtBQUFBQSxJQUFBQSxZO0FBQUFBLElBQUFBLFk7S0FBQUEsWSxLQUFBQSxZOzs7TUFNQUMsZ0I7O2FBQUFBLGdCO0FBQUFBLElBQUFBLGdCO0FBQUFBLElBQUFBLGdCO0FBQUFBLElBQUFBLGdCO0tBQUFBLGdCLEtBQUFBLGdCOzs7TUFNQUMsZTs7YUFBQUEsZTtBQUFBQSxJQUFBQSxlO0FBQUFBLElBQUFBLGU7QUFBQUEsSUFBQUEsZTtLQUFBQSxlLEtBQUFBLGU7OztNQXVVQUMsYTs7YUFBQUEsYTtBQUFBQSxJQUFBQSxhO0FBQUFBLElBQUFBLGE7QUFBQUEsSUFBQUEsYTtBQUFBQSxJQUFBQSxhO0tBQUFBLGEsS0FBQUEsYSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uZmlndXJhYmxlUmVjb3JkLCBQb3NpdGlvbiwgUG9zaXRpb25hYmxlIH0gZnJvbSBcIi4vaGVscGVycy9Db25maWd1cmFibGVPYmplY3RcIjtcbmltcG9ydCB7IEZsZXhTZXR0aW5ncywgSGVhZGVyRmFjZXRUeXBlIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvY29udHJvbHMvT2JqZWN0UGFnZS9IZWFkZXJGYWNldFwiO1xuaW1wb3J0IHsgQmluZGluZ0V4cHJlc3Npb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nRXhwcmVzc2lvblwiO1xuaW1wb3J0IHsgVGFibGVUeXBlIH0gZnJvbSBcIi4vY29udHJvbHMvQ29tbW9uL1RhYmxlXCI7XG5cbmV4cG9ydCBlbnVtIFRlbXBsYXRlVHlwZSB7XG5cdExpc3RSZXBvcnQgPSBcIkxpc3RSZXBvcnRcIixcblx0T2JqZWN0UGFnZSA9IFwiT2JqZWN0UGFnZVwiLFxuXHRBbmFseXRpY2FsTGlzdFBhZ2UgPSBcIkFuYWx5dGljYWxMaXN0UGFnZVwiXG59XG5cbmV4cG9ydCBlbnVtIEFjdGlvblR5cGUge1xuXHREYXRhRmllbGRGb3JBY3Rpb24gPSBcIkZvckFjdGlvblwiLFxuXHREYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24gPSBcIkZvck5hdmlnYXRpb25cIixcblx0RGVmYXVsdCA9IFwiRGVmYXVsdFwiLFxuXHRQcmltYXJ5ID0gXCJQcmltYXJ5XCIsXG5cdFNlY29uZGFyeSA9IFwiU2Vjb25kYXJ5XCIsXG5cdFN3aXRjaFRvQWN0aXZlT2JqZWN0ID0gXCJTd2l0Y2hUb0FjdGl2ZU9iamVjdFwiLFxuXHRTd2l0Y2hUb0RyYWZ0T2JqZWN0ID0gXCJTd2l0Y2hUb0RyYWZ0T2JqZWN0XCIsXG5cdERlZmF1bHRBcHBseSA9IFwiRGVmYXVsdEFwcGx5XCIsXG5cdE1lbnUgPSBcIk1lbnVcIlxufVxuXG5leHBvcnQgdHlwZSBNYW5pZmVzdFNpZGVDb250ZW50ID0ge1xuXHR0ZW1wbGF0ZTogc3RyaW5nO1xuXHRlcXVhbFNwbGl0PzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBlbnVtIFZpc3VhbGl6YXRpb25UeXBlIHtcblx0VGFibGUgPSBcIlRhYmxlXCIsXG5cdENoYXJ0ID0gXCJDaGFydFwiXG59XG5cbmV4cG9ydCBlbnVtIFZhcmlhbnRNYW5hZ2VtZW50VHlwZSB7XG5cdFBhZ2UgPSBcIlBhZ2VcIixcblx0Q29udHJvbCA9IFwiQ29udHJvbFwiLFxuXHROb25lID0gXCJOb25lXCJcbn1cblxuZXhwb3J0IHR5cGUgQ29udGVudERlbnNpdGllc1R5cGUgPSB7XG5cdGNvbXBhY3Q/OiBib29sZWFuO1xuXHRjb3p5PzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBlbnVtIENyZWF0aW9uTW9kZSB7XG5cdE5ld1BhZ2UgPSBcIk5ld1BhZ2VcIixcblx0SW5saW5lID0gXCJJbmxpbmVcIixcblx0Q3JlYXRpb25Sb3cgPSBcIkNyZWF0aW9uUm93XCJcbn1cblxuZXhwb3J0IGVudW0gQXZhaWxhYmlsaXR5VHlwZSB7XG5cdERlZmF1bHQgPSBcIkRlZmF1bHRcIixcblx0QWRhcHRhdGlvbiA9IFwiQWRhcHRhdGlvblwiLFxuXHRIaWRkZW4gPSBcIkhpZGRlblwiXG59XG5cbmV4cG9ydCBlbnVtIEhvcml6b250YWxBbGlnbiB7XG5cdEVuZCA9IFwiRW5kXCIsXG5cdEJlZ2luID0gXCJCZWdpblwiLFxuXHRDZW50ZXIgPSBcIkNlbnRlclwiXG59XG5cbmV4cG9ydCB0eXBlIFRhYmxlQ29sdW1uU2V0dGluZ3MgPSB7XG5cdG1pY3JvQ2hhcnRTaXplPzogc3RyaW5nO1xuXHRzaG93TWljcm9DaGFydExhYmVsPzogYm9vbGVhbjtcbn07XG5cbi8qKlxuICogQ29sbGVjdGlvbiBvZiBmb3JtYXQgb3B0aW9ucyBmb3IgbXVsdGlsaW5lIHRleHQgZmllbGRzIG9uIGEgZm9ybSBvciBpbiBhIHRhYmxlXG4gKi9cbmV4cG9ydCB0eXBlIEZvcm1hdE9wdGlvbnNUeXBlID0ge1xuXHRoYXNEcmFmdEluZGljYXRvcj86IGJvb2xlYW47XG5cdHNlbWFudGlja2V5cz86IHN0cmluZ1tdO1xuXHR0ZXh0TGluZXNFZGl0PzogbnVtYmVyO1xuXHR0ZXh0TWF4Q2hhcmFjdGVyc0Rpc3BsYXk/OiBudW1iZXI7XG5cdHRleHRFeHBhbmRCZWhhdmlvckRpc3BsYXk/OiBzdHJpbmc7XG59O1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gb2YgYSBLUEkgaW4gdGhlIG1hbmlmZXN0XG4gKi9cbmV4cG9ydCB0eXBlIEtQSUNvbmZpZ3VyYXRpb24gPSB7XG5cdG1vZGVsPzogc3RyaW5nO1xuXHRlbnRpdHlTZXQ6IHN0cmluZztcblx0cXVhbGlmaWVyOiBzdHJpbmc7XG59O1xuXG4vKipcbiAqIEB0eXBlZGVmIEJhc2VNYW5pZmVzdFNldHRpbmdzXG4gKi9cbmV4cG9ydCB0eXBlIEJhc2VNYW5pZmVzdFNldHRpbmdzID0ge1xuXHRjb250ZW50Pzoge1xuXHRcdGhlYWRlcj86IHtcblx0XHRcdGZhY2V0cz86IENvbmZpZ3VyYWJsZVJlY29yZDxNYW5pZmVzdEhlYWRlckZhY2V0Pjtcblx0XHRcdGFjdGlvbnM/OiBDb25maWd1cmFibGVSZWNvcmQ8TWFuaWZlc3RBY3Rpb24+O1xuXHRcdH07XG5cdFx0Zm9vdGVyPzoge1xuXHRcdFx0YWN0aW9ucz86IENvbmZpZ3VyYWJsZVJlY29yZDxNYW5pZmVzdEFjdGlvbj47XG5cdFx0fTtcblx0fTtcblx0Y29udHJvbENvbmZpZ3VyYXRpb24/OiB7XG5cdFx0W2Fubm90YXRpb25QYXRoOiBzdHJpbmddOiBDb250cm9sTWFuaWZlc3RDb25maWd1cmF0aW9uO1xuXHR9ICYge1xuXHRcdFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkxpbmVJdGVtXCI/OiBUYWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbjtcblx0XHRcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5GYWNldHNcIj86IEZhY2V0c0NvbnRyb2xDb25maWd1cmF0aW9uO1xuXHRcdFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkhlYWRlckZhY2V0c1wiPzogSGVhZGVyRmFjZXRzQ29udHJvbENvbmZpZ3VyYXRpb247XG5cdFx0XCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuU2VsZWN0aW9uRmllbGRzXCI/OiBGaWx0ZXJNYW5pZmVzdENvbmZpZ3VyYXRpb247XG5cdH07XG5cdGNvbnZlcnRlclR5cGU6IFRlbXBsYXRlVHlwZTtcblx0ZW50aXR5U2V0OiBzdHJpbmc7XG5cdG5hdmlnYXRpb24/OiB7XG5cdFx0W25hdmlnYXRpb25QYXRoOiBzdHJpbmddOiBOYXZpZ2F0aW9uU2V0dGluZ3NDb25maWd1cmF0aW9uO1xuXHR9O1xuXHR2aWV3TGV2ZWw/OiBudW1iZXI7XG5cdGZjbEVuYWJsZWQ/OiBib29sZWFuO1xuXHRjb250ZXh0UGF0aD86IHN0cmluZztcblx0dmFyaWFudE1hbmFnZW1lbnQ/OiBWYXJpYW50TWFuYWdlbWVudFR5cGU7XG5cdGRlZmF1bHRUZW1wbGF0ZUFubm90YXRpb25QYXRoPzogc3RyaW5nO1xuXHRjb250ZW50RGVuc2l0aWVzPzogQ29udGVudERlbnNpdGllc1R5cGU7XG5cdHNoZWxsQ29udGVudERlbnNpdHk/OiBzdHJpbmc7XG5cdGlzRGVza3RvcD86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgdHlwZSBOYXZpZ2F0aW9uVGFyZ2V0Q29uZmlndXJhdGlvbiA9IHtcblx0b3V0Ym91bmQ/OiBzdHJpbmc7XG5cdG91dGJvdW5kRGV0YWlsPzoge1xuXHRcdHNlbWFudGljT2JqZWN0OiBzdHJpbmc7XG5cdFx0YWN0aW9uOiBzdHJpbmc7XG5cdFx0cGFyYW1ldGVycz86IGFueTtcblx0fTtcblx0cm91dGU/OiBzdHJpbmc7XG59O1xuXG4vKipcbiAqIEB0eXBlZGVmIE5hdmlnYXRpb25TZXR0aW5nc0NvbmZpZ3VyYXRpb25cbiAqL1xuZXhwb3J0IHR5cGUgTmF2aWdhdGlvblNldHRpbmdzQ29uZmlndXJhdGlvbiA9IHtcblx0Y3JlYXRlPzogTmF2aWdhdGlvblRhcmdldENvbmZpZ3VyYXRpb247XG5cdGRldGFpbD86IE5hdmlnYXRpb25UYXJnZXRDb25maWd1cmF0aW9uO1xuXHRkaXNwbGF5Pzoge1xuXHRcdG91dGJvdW5kPzogc3RyaW5nO1xuXHRcdHRhcmdldD86IHN0cmluZzsgLy8gZm9yIGNvbXBhdGliaWxpdHlcblx0XHRyb3V0ZT86IHN0cmluZztcblx0fTtcbn07XG5cbnR5cGUgSGVhZGVyRmFjZXRzQ29udHJvbENvbmZpZ3VyYXRpb24gPSB7XG5cdGZhY2V0czogQ29uZmlndXJhYmxlUmVjb3JkPE1hbmlmZXN0SGVhZGVyRmFjZXQ+O1xufTtcblxudHlwZSBGYWNldHNDb250cm9sQ29uZmlndXJhdGlvbiA9IHtcblx0c2VjdGlvbnM6IENvbmZpZ3VyYWJsZVJlY29yZDxNYW5pZmVzdFNlY3Rpb24+O1xufTtcblxudHlwZSBNYW5pZmVzdEZvcm1FbGVtZW50ID0gUG9zaXRpb25hYmxlICYge1xuXHR0ZW1wbGF0ZTogc3RyaW5nO1xuXHRsYWJlbD86IHN0cmluZztcblx0Zm9ybWF0T3B0aW9ucz86IEZvcm1hdE9wdGlvbnNUeXBlO1xufTtcblxuZXhwb3J0IHR5cGUgRm9ybU1hbmlmZXN0Q29uZmlndXJhdGlvbiA9IHtcblx0ZmllbGRzOiBDb25maWd1cmFibGVSZWNvcmQ8TWFuaWZlc3RGb3JtRWxlbWVudD47XG59O1xuXG5leHBvcnQgdHlwZSBDb250cm9sTWFuaWZlc3RDb25maWd1cmF0aW9uID1cblx0fCBUYWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvblxuXHR8IENoYXJ0TWFuaWZlc3RDb25maWd1cmF0aW9uXG5cdHwgRmFjZXRzQ29udHJvbENvbmZpZ3VyYXRpb25cblx0fCBIZWFkZXJGYWNldHNDb250cm9sQ29uZmlndXJhdGlvblxuXHR8IEZvcm1NYW5pZmVzdENvbmZpZ3VyYXRpb25cblx0fCBGaWx0ZXJNYW5pZmVzdENvbmZpZ3VyYXRpb247XG5cbi8qKiBPYmplY3QgUGFnZSAqKi9cblxuZXhwb3J0IHR5cGUgT2JqZWN0UGFnZU1hbmlmZXN0U2V0dGluZ3MgPSBCYXNlTWFuaWZlc3RTZXR0aW5ncyAmIHtcblx0Y29udGVudD86IHtcblx0XHRoZWFkZXI/OiB7XG5cdFx0XHR2aXNpYmxlPzogYm9vbGVhbjtcblx0XHRcdGFuY2hvckJhclZpc2libGU/OiBib29sZWFuO1xuXHRcdFx0ZmFjZXRzPzogQ29uZmlndXJhYmxlUmVjb3JkPE1hbmlmZXN0SGVhZGVyRmFjZXQ+O1xuXHRcdH07XG5cdFx0Ym9keT86IHtcblx0XHRcdHNlY3Rpb25zPzogQ29uZmlndXJhYmxlUmVjb3JkPE1hbmlmZXN0U2VjdGlvbj47XG5cdFx0fTtcblx0fTtcblx0ZWRpdGFibGVIZWFkZXJDb250ZW50OiBib29sZWFuO1xuXHRzZWN0aW9uTGF5b3V0OiBcIlRhYnNcIiB8IFwiUGFnZVwiO1xufTtcblxuLyoqXG4gKiBAdHlwZWRlZiBNYW5pZmVzdEhlYWRlckZhY2V0XG4gKi9cbmV4cG9ydCB0eXBlIE1hbmlmZXN0SGVhZGVyRmFjZXQgPSB7XG5cdHR5cGU/OiBIZWFkZXJGYWNldFR5cGU7XG5cdG5hbWU/OiBzdHJpbmc7XG5cdHRlbXBsYXRlPzogc3RyaW5nO1xuXHRwb3NpdGlvbj86IFBvc2l0aW9uO1xuXHR2aXNpYmxlPzogQmluZGluZ0V4cHJlc3Npb248Ym9vbGVhbj47XG5cdHRpdGxlPzogc3RyaW5nO1xuXHRzdWJUaXRsZT86IHN0cmluZztcblx0c3Rhc2hlZD86IGJvb2xlYW47XG5cdGZsZXhTZXR0aW5ncz86IEZsZXhTZXR0aW5ncztcblx0cmVxdWVzdEdyb3VwSWQ/OiBzdHJpbmc7XG5cdHRlbXBsYXRlRWRpdD86IHN0cmluZztcbn07XG5cbi8qKlxuICogQHR5cGVkZWYgTWFuaWZlc3RTZWN0aW9uXG4gKi9cbmV4cG9ydCB0eXBlIE1hbmlmZXN0U2VjdGlvbiA9IHtcblx0dGl0bGU/OiBzdHJpbmc7XG5cdGlkPzogc3RyaW5nO1xuXHRuYW1lPzogc3RyaW5nO1xuXHR2aXNpYmxlPzogQmluZGluZ0V4cHJlc3Npb248Ym9vbGVhbj47XG5cdHBvc2l0aW9uPzogUG9zaXRpb247XG5cdHRlbXBsYXRlPzogc3RyaW5nO1xuXHRzdWJTZWN0aW9ucz86IFJlY29yZDxzdHJpbmcsIE1hbmlmZXN0U3ViU2VjdGlvbj47XG5cdGFjdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCBNYW5pZmVzdEFjdGlvbj47XG59O1xuXG5leHBvcnQgdHlwZSBNYW5pZmVzdFN1YlNlY3Rpb24gPSB7XG5cdGlkPzogc3RyaW5nO1xuXHRuYW1lPzogc3RyaW5nO1xuXHR0ZW1wbGF0ZT86IHN0cmluZztcblx0dGl0bGU/OiBzdHJpbmc7XG5cdHBvc2l0aW9uPzogUG9zaXRpb247XG5cdHZpc2libGU/OiBCaW5kaW5nRXhwcmVzc2lvbjxib29sZWFuPjtcblx0YWN0aW9ucz86IFJlY29yZDxzdHJpbmcsIE1hbmlmZXN0QWN0aW9uPjtcblx0c2lkZUNvbnRlbnQ/OiBNYW5pZmVzdFNpZGVDb250ZW50O1xufTtcblxuLyoqIExpc3QgUmVwb3J0ICoqL1xuXG5leHBvcnQgdHlwZSBMaXN0UmVwb3J0TWFuaWZlc3RTZXR0aW5ncyA9IEJhc2VNYW5pZmVzdFNldHRpbmdzICYge1xuXHRpbml0aWFsTG9hZD86IGJvb2xlYW47XG5cdHZpZXdzPzogTXVsdGlwbGVWaWV3c0NvbmZpZ3VyYXRpb247XG5cdGtleVBlcmZvcm1hbmNlSW5kaWNhdG9ycz86IHtcblx0XHRba3BpTmFtZTogc3RyaW5nXTogS1BJQ29uZmlndXJhdGlvbjtcblx0fTtcbn07XG5cbmV4cG9ydCB0eXBlIFZpZXdQYXRoQ29uZmlndXJhdGlvbiA9IFNpbmdsZVZpZXdQYXRoQ29uZmlndXJhdGlvbiB8IENvbWJpbmVkVmlld1BhdGhDb25maWd1cmF0aW9uO1xuXG5leHBvcnQgdHlwZSBWaWV3Q29uZmlndXJhdGlvbiA9IFZpZXdQYXRoQ29uZmlndXJhdGlvbiB8IEN1c3RvbVZpZXdUZW1wbGF0ZUNvbmZpZ3VyYXRpb247XG5cbmV4cG9ydCB0eXBlIEN1c3RvbVZpZXdUZW1wbGF0ZUNvbmZpZ3VyYXRpb24gPSB7XG5cdGtleT86IHN0cmluZztcblx0bGFiZWw6IHN0cmluZztcblx0dGVtcGxhdGU6IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIFNpbmdsZVZpZXdQYXRoQ29uZmlndXJhdGlvbiA9IHtcblx0a2VlcFByZXZpb3VzUHJlc29uYWxpemF0aW9uPzogYm9vbGVhbjtcblx0a2V5Pzogc3RyaW5nO1xuXHRlbnRpdHlTZXQ/OiBzdHJpbmc7XG5cdGFubm90YXRpb25QYXRoOiBzdHJpbmc7XG5cdGNvbnRleHRQYXRoPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgQ29tYmluZWRWaWV3UGF0aENvbmZpZ3VyYXRpb24gPSB7XG5cdHByaW1hcnk6IFNpbmdsZVZpZXdQYXRoQ29uZmlndXJhdGlvbltdO1xuXHRzZWNvbmRhcnk6IFNpbmdsZVZpZXdQYXRoQ29uZmlndXJhdGlvbltdO1xuXHRkZWZhdWx0UGF0aD86IFwiYm90aFwiIHwgXCJwcmltYXJ5XCIgfCBcInNlY29uZGFyeVwiO1xuXHRrZXk/OiBzdHJpbmc7XG59O1xuXG4vKipcbiAqIEB0eXBlZGVmIE11bHRpcGxlVmlld3NDb25maWd1cmF0aW9uXG4gKi9cbmV4cG9ydCB0eXBlIE11bHRpcGxlVmlld3NDb25maWd1cmF0aW9uID0ge1xuXHRwYXRoczogVmlld0NvbmZpZ3VyYXRpb25bXTtcblx0c2hvd0NvdW50cz86IGJvb2xlYW47XG59O1xuXG4vKiogRmlsdGVyIENvbmZpZ3VyYXRpb24gKiovXG5cbi8qKiBAdHlwZWRlZiBGaWx0ZXJNYW5pZmVzdENvbmZpZ3VyYXRpb24gKiovXG5leHBvcnQgdHlwZSBGaWx0ZXJNYW5pZmVzdENvbmZpZ3VyYXRpb24gPSB7XG5cdGZpbHRlckZpZWxkcz86IFJlY29yZDxzdHJpbmcsIEZpbHRlckZpZWxkTWFuaWZlc3RDb25maWd1cmF0aW9uPjtcblx0bmF2aWdhdGlvblByb3BlcnRpZXM/OiBzdHJpbmdbXTtcblx0dXNlU2VtYW50aWNEYXRlUmFuZ2U/OiBib29sZWFuO1xuXHRpbml0aWFsTGF5b3V0Pzogc3RyaW5nO1xuXHRsYXlvdXQ/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBGaWx0ZXJGaWVsZE1hbmlmZXN0Q29uZmlndXJhdGlvbiA9IFBvc2l0aW9uYWJsZSAmIHtcblx0bGFiZWw/OiBzdHJpbmc7XG5cdHRlbXBsYXRlPzogc3RyaW5nO1xuXHRhdmFpbGFiaWxpdHk/OiBBdmFpbGFiaWxpdHlUeXBlO1xuXHRzZXR0aW5ncz86IEZpbHRlclNldHRpbmdzO1xuXHR2aXN1YWxGaWx0ZXI/OiB2aXN1YWxGaWx0ZXJDb25maWd1cmF0aW9uO1xufTtcblxuZXhwb3J0IHR5cGUgdmlzdWFsRmlsdGVyQ29uZmlndXJhdGlvbiA9IHtcblx0dmFsdWVMaXN0Pzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgT3BlcmF0b3JDb25maWd1cmF0aW9uID0ge1xuXHRwYXRoOiBzdHJpbmc7XG5cdGVxdWFscz86IHN0cmluZztcblx0Y29udGFpbnM/OiBzdHJpbmc7XG5cdGV4Y2x1ZGU6IGJvb2xlYW47XG59O1xuXG5leHBvcnQgdHlwZSBEZWZhdWx0T3BlcmF0b3IgPSB7XG5cdG9wZXJhdG9yOiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBGaWx0ZXJTZXR0aW5ncyA9IHtcblx0b3BlcmF0b3JDb25maWd1cmF0aW9uPzogT3BlcmF0b3JDb25maWd1cmF0aW9uW107XG5cdGRlZmF1bHRWYWx1ZXM/OiBEZWZhdWx0T3BlcmF0b3JbXTtcbn07XG5cbi8qKiBDaGFydCBDb25maWd1cmF0aW9uICoqL1xuXG5leHBvcnQgdHlwZSBDaGFydFBlcnNvbmFsaXphdGlvbk1hbmlmZXN0U2V0dGluZ3MgPVxuXHR8IGJvb2xlYW5cblx0fCB7XG5cdFx0XHRzb3J0OiBib29sZWFuO1xuXHRcdFx0dHlwZTogYm9vbGVhbjtcblx0XHRcdGl0ZW06IGJvb2xlYW47XG5cdCAgfTtcblxuZXhwb3J0IHR5cGUgQ2hhcnRNYW5pZmVzdENvbmZpZ3VyYXRpb24gPSB7XG5cdGNoYXJ0U2V0dGluZ3M6IHtcblx0XHRwZXJzb25hbGl6YXRpb246IENoYXJ0UGVyc29uYWxpemF0aW9uTWFuaWZlc3RTZXR0aW5ncztcblx0fTtcbn07XG5cbmV4cG9ydCB0eXBlIEFjdGlvbkFmdGVyRXhlY3V0aW9uQ29uZmlndXJhdGlvbiA9IHtcblx0bmF2aWdhdGVUb0luc3RhbmNlPzogYm9vbGVhbjtcblx0ZW5hYmxlQXV0b1Njcm9sbD86IGJvb2xlYW47XG59O1xuXG4vKiogVGFibGUgQ29uZmlndXJhdGlvbiAqKi9cblxuLyoqXG4gKiBAdHlwZWRlZiBNYW5pZmVzdEFjdGlvblxuICovXG5leHBvcnQgdHlwZSBNYW5pZmVzdEFjdGlvbiA9IHtcblx0bWVudT86IHN0cmluZ1tdO1xuXHR2aXNpYmxlPzogc3RyaW5nO1xuXHRlbmFibGVkPzogc3RyaW5nO1xuXHRwb3NpdGlvbj86IFBvc2l0aW9uO1xuXHRwcmVzcz86IHN0cmluZztcblx0dGV4dD86IHN0cmluZztcblx0X19ub1dyYXA/OiBib29sZWFuO1xuXHRlbmFibGVPblNlbGVjdD86IHN0cmluZztcblx0ZGVmYXVsdFZhbHVlc0Z1bmN0aW9uPzogc3RyaW5nO1xuXHRyZXF1aXJlc1NlbGVjdGlvbj86IGJvb2xlYW47XG5cdGFmdGVyRXhlY3V0aW9uPzogQWN0aW9uQWZ0ZXJFeGVjdXRpb25Db25maWd1cmF0aW9uO1xuXHRpbmxpbmU/OiBib29sZWFuO1xuXHRkZXRlcm1pbmluZz86IGJvb2xlYW47XG5cdGZhY2V0TmFtZT86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIE1hbmlmZXN0VGFibGVDb2x1bW5PdmVycmlkZSA9IFBvc2l0aW9uYWJsZSAmIHtcblx0d2lkdGg/OiBzdHJpbmc7XG5cdGhvcml6b250YWxBbGlnbj86IEhvcml6b250YWxBbGlnbjtcblx0YWZ0ZXJFeGVjdXRpb24/OiBBY3Rpb25BZnRlckV4ZWN1dGlvbkNvbmZpZ3VyYXRpb247XG5cdHNldHRpbmdzPzogVGFibGVDb2x1bW5TZXR0aW5ncztcblx0Zm9ybWF0T3B0aW9ucz86IEZvcm1hdE9wdGlvbnNUeXBlO1xufTtcblxuZXhwb3J0IHR5cGUgTWFuaWZlc3RUYWJsZUNvbHVtbiA9IFBvc2l0aW9uYWJsZSAmIHtcblx0aGVhZGVyOiBzdHJpbmc7XG5cdHdpZHRoPzogc3RyaW5nO1xuXHR0eXBlPzogc3RyaW5nO1xuXHRob3Jpem9udGFsQWxpZ24/OiBIb3Jpem9udGFsQWxpZ247XG5cdHRlbXBsYXRlOiBzdHJpbmc7XG5cdGFmdGVyRXhlY3V0aW9uPzogQWN0aW9uQWZ0ZXJFeGVjdXRpb25Db25maWd1cmF0aW9uO1xuXHRhdmFpbGFiaWxpdHk/OiBBdmFpbGFiaWxpdHlUeXBlO1xuXHRzZXR0aW5ncz86IFRhYmxlQ29sdW1uU2V0dGluZ3M7XG5cdGZvcm1hdE9wdGlvbnM/OiBGb3JtYXRPcHRpb25zVHlwZTtcblx0cHJvcGVydGllcz86IHN0cmluZ1tdO1xufTtcblxuZXhwb3J0IHR5cGUgVGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24gPSB7XG5cdHRhYmxlU2V0dGluZ3M/OiBUYWJsZU1hbmlmZXN0U2V0dGluZ3NDb25maWd1cmF0aW9uO1xuXHRhY3Rpb25zPzogUmVjb3JkPHN0cmluZywgTWFuaWZlc3RBY3Rpb24+O1xuXHRjb2x1bW5zPzogUmVjb3JkPHN0cmluZywgTWFuaWZlc3RUYWJsZUNvbHVtbiB8IE1hbmlmZXN0VGFibGVDb2x1bW5PdmVycmlkZT47XG59O1xuXG5leHBvcnQgZW51bSBTZWxlY3Rpb25Nb2RlIHtcblx0QXV0byA9IFwiQXV0b1wiLFxuXHROb25lID0gXCJOb25lXCIsXG5cdE11bHRpID0gXCJNdWx0aVwiLFxuXHRTaW5nbGUgPSBcIlNpbmdsZVwiXG59XG5cbmV4cG9ydCB0eXBlIFRhYmxlUGVyc29uYWxpemF0aW9uQ29uZmlndXJhdGlvbiA9XG5cdHwgYm9vbGVhblxuXHR8IHtcblx0XHRcdHNvcnQ6IGJvb2xlYW47XG5cdFx0XHRjb2x1bW46IGJvb2xlYW47XG5cdFx0XHRmaWx0ZXI6IGJvb2xlYW47XG5cdFx0XHRncm91cDogYm9vbGVhbjtcblx0XHRcdGFnZ3JlZ2F0ZTogYm9vbGVhbjtcblx0ICB9O1xuXG5leHBvcnQgdHlwZSBUYWJsZU1hbmlmZXN0U2V0dGluZ3NDb25maWd1cmF0aW9uID0ge1xuXHRjcmVhdGlvbk1vZGU/OiB7XG5cdFx0ZGlzYWJsZUFkZFJvd0J1dHRvbkZvckVtcHR5RGF0YT86IGJvb2xlYW47XG5cdFx0Y3VzdG9tVmFsaWRhdGlvbkZ1bmN0aW9uPzogc3RyaW5nO1xuXHRcdGNyZWF0ZUF0RW5kPzogYm9vbGVhbjtcblx0XHRuYW1lPzogQ3JlYXRpb25Nb2RlO1xuXHR9O1xuXHRlbmFibGVFeHBvcnQ/OiBib29sZWFuO1xuXHRxdWlja1ZhcmlhbnRTZWxlY3Rpb24/OiB7XG5cdFx0cGF0aHM6IFtcblx0XHRcdHtcblx0XHRcdFx0YW5ub3RhdGlvblBhdGg6IHN0cmluZztcblx0XHRcdH1cblx0XHRdO1xuXHRcdGhpZGVUYWJsZVRpdGxlPzogYm9vbGVhbjtcblx0XHRzaG93Q291bnRzPzogYm9vbGVhbjtcblx0fTtcblx0cGVyc29uYWxpemF0aW9uPzogVGFibGVQZXJzb25hbGl6YXRpb25Db25maWd1cmF0aW9uO1xuXHQvKipcblx0ICogRGVmaW5lcyBob3cgbWFueSBpdGVtcyBpbiBhIHRhYmxlIGNhbiBiZSBzZWxlY3RlZC4gWW91IGhhdmUgdGhlIGZvbGxvd2luZyBvcHRpb25zOlxuXHQgKiA9PiBieSBkZWZpbmluZyAnTm9uZScgeW91IGNhbiBmdWxseSBkaXNhYmxlIHRoZSBsaXN0IHNlbGVjdGlvblxuXHQgKiA9PiBieSBkZWZpbmluZyAnU2luZ2xlJyB5b3UgYWxsb3cgb25seSBvbmUgaXRlbSB0byBiZSBzZWxlY3RlZFxuXHQgKiA9PiBieSBkZWZpbmluZyAnTXVsdGknIHlvdSBhbGxvdyBzZXZlcmFsIGl0ZW1zIHRvIGJlIHNlbGVjdGVkXG5cdCAqID0+IGJ5IHVzaW5nICdBdXRvJyB5b3UgbGVhdmUgdGhlIGRlZmF1bHQgZGVmaW5pdGlvbiAnTm9uZScsIGV4Y2VwdCBpZiB0aGVyZSBpcyBhbiBhY3Rpb24gdGhhdCByZXF1aXJlcyBhIHNlbGVjdGlvbiAoc3VjaCBhcyBkZWxldGluZywgb3IgSUJOKVxuXHQgKi9cblx0c2VsZWN0aW9uTW9kZT86IFNlbGVjdGlvbk1vZGU7XG5cdHR5cGU/OiBUYWJsZVR5cGU7XG5cdGNvbmRlbnNlZFRhYmxlTGF5b3V0PzogYm9vbGVhbjtcblx0c2VsZWN0QWxsPzogYm9vbGVhbjtcblx0c2VsZWN0aW9uTGltaXQ/OiBudW1iZXI7XG5cdGVuYWJsZVBhc3RlPzogYm9vbGVhbjtcblx0ZW5hYmxlRnVsbFNjcmVlbj86IGJvb2xlYW47XG5cdGVuYWJsZU1hc3NFZGl0PzogYm9vbGVhbjtcbn07XG4iXX0=