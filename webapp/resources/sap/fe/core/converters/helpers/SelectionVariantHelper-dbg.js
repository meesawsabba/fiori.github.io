/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  function getRangeDefinition(range, propertyType) {
    var operator;
    var bInclude = range.Sign === "UI.SelectionRangeSignType/I" ? true : false;

    switch (range.Option) {
      case "UI.SelectionRangeOptionType/BT":
        operator = bInclude ? "BT" : "NB";
        break;

      case "UI.SelectionRangeOptionType/CP":
        operator = bInclude ? "Contains" : "NotContains";
        break;

      case "UI.SelectionRangeOptionType/EQ":
        operator = bInclude ? "EQ" : "NE";
        break;

      case "UI.SelectionRangeOptionType/GE":
        operator = bInclude ? "GE" : "LT";
        break;

      case "UI.SelectionRangeOptionType/GT":
        operator = bInclude ? "GT" : "LE";
        break;

      case "UI.SelectionRangeOptionType/LE":
        operator = bInclude ? "LE" : "GT";
        break;

      case "UI.SelectionRangeOptionType/LT":
        operator = bInclude ? "LT" : "GE";
        break;

      case "UI.SelectionRangeOptionType/NB":
        operator = bInclude ? "NB" : "BT";
        break;

      case "UI.SelectionRangeOptionType/NE":
        operator = bInclude ? "NE" : "EQ";
        break;

      case "UI.SelectionRangeOptionType/NP":
        operator = bInclude ? "NotContains" : "Contains";
        break;

      default:
        operator = "EQ";
    }

    return {
      operator: operator,
      rangeLow: propertyType && propertyType.indexOf("Edm.Date") === 0 ? new Date(range.Low) : range.Low,
      rangeHigh: range.High && propertyType && propertyType.indexOf("Edm.Date") === 0 ? new Date(range.High) : range.High
    };
  }
  /**
   * Parses a SelectionVariant annotations and creates the corresponding filter definitions.
   *
   * @param selectionVariant SelectionVariant annotation
   * @returns Returns an array of filter definitions corresponding to the SelectionVariant.
   */


  function getFilterDefinitionsFromSelectionVariant(selectionVariant) {
    var aFilterDefs = [];

    if (selectionVariant.SelectOptions) {
      selectionVariant.SelectOptions.forEach(function (selectOption) {
        if (selectOption.PropertyName && selectOption.Ranges.length > 0) {
          aFilterDefs.push({
            propertyPath: selectOption.PropertyName.value,
            propertyType: selectOption.PropertyName.$target.type,
            ranges: selectOption.Ranges.map(function (range) {
              var _selectOption$Propert;

              return getRangeDefinition(range, (_selectOption$Propert = selectOption.PropertyName) === null || _selectOption$Propert === void 0 ? void 0 : _selectOption$Propert.$target.type);
            })
          });
        }
      });
    }

    return aFilterDefs;
  }

  _exports.getFilterDefinitionsFromSelectionVariant = getFilterDefinitionsFromSelectionVariant;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlbGVjdGlvblZhcmlhbnRIZWxwZXIudHMiXSwibmFtZXMiOlsiZ2V0UmFuZ2VEZWZpbml0aW9uIiwicmFuZ2UiLCJwcm9wZXJ0eVR5cGUiLCJvcGVyYXRvciIsImJJbmNsdWRlIiwiU2lnbiIsIk9wdGlvbiIsInJhbmdlTG93IiwiaW5kZXhPZiIsIkRhdGUiLCJMb3ciLCJyYW5nZUhpZ2giLCJIaWdoIiwiZ2V0RmlsdGVyRGVmaW5pdGlvbnNGcm9tU2VsZWN0aW9uVmFyaWFudCIsInNlbGVjdGlvblZhcmlhbnQiLCJhRmlsdGVyRGVmcyIsIlNlbGVjdE9wdGlvbnMiLCJmb3JFYWNoIiwic2VsZWN0T3B0aW9uIiwiUHJvcGVydHlOYW1lIiwiUmFuZ2VzIiwibGVuZ3RoIiwicHVzaCIsInByb3BlcnR5UGF0aCIsInZhbHVlIiwiJHRhcmdldCIsInR5cGUiLCJyYW5nZXMiLCJtYXAiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7Ozs7OztBQWFBLFdBQVNBLGtCQUFULENBQTRCQyxLQUE1QixFQUF1REMsWUFBdkQsRUFBMEc7QUFDekcsUUFBSUMsUUFBSjtBQUNBLFFBQU1DLFFBQVEsR0FBR0gsS0FBSyxDQUFDSSxJQUFOLEtBQWUsNkJBQWYsR0FBK0MsSUFBL0MsR0FBc0QsS0FBdkU7O0FBRUEsWUFBUUosS0FBSyxDQUFDSyxNQUFkO0FBQ0MsV0FBSyxnQ0FBTDtBQUNDSCxRQUFBQSxRQUFRLEdBQUdDLFFBQVEsR0FBRyxJQUFILEdBQVUsSUFBN0I7QUFDQTs7QUFFRCxXQUFLLGdDQUFMO0FBQ0NELFFBQUFBLFFBQVEsR0FBR0MsUUFBUSxHQUFHLFVBQUgsR0FBZ0IsYUFBbkM7QUFDQTs7QUFFRCxXQUFLLGdDQUFMO0FBQ0NELFFBQUFBLFFBQVEsR0FBR0MsUUFBUSxHQUFHLElBQUgsR0FBVSxJQUE3QjtBQUNBOztBQUVELFdBQUssZ0NBQUw7QUFDQ0QsUUFBQUEsUUFBUSxHQUFHQyxRQUFRLEdBQUcsSUFBSCxHQUFVLElBQTdCO0FBQ0E7O0FBRUQsV0FBSyxnQ0FBTDtBQUNDRCxRQUFBQSxRQUFRLEdBQUdDLFFBQVEsR0FBRyxJQUFILEdBQVUsSUFBN0I7QUFDQTs7QUFFRCxXQUFLLGdDQUFMO0FBQ0NELFFBQUFBLFFBQVEsR0FBR0MsUUFBUSxHQUFHLElBQUgsR0FBVSxJQUE3QjtBQUNBOztBQUVELFdBQUssZ0NBQUw7QUFDQ0QsUUFBQUEsUUFBUSxHQUFHQyxRQUFRLEdBQUcsSUFBSCxHQUFVLElBQTdCO0FBQ0E7O0FBRUQsV0FBSyxnQ0FBTDtBQUNDRCxRQUFBQSxRQUFRLEdBQUdDLFFBQVEsR0FBRyxJQUFILEdBQVUsSUFBN0I7QUFDQTs7QUFFRCxXQUFLLGdDQUFMO0FBQ0NELFFBQUFBLFFBQVEsR0FBR0MsUUFBUSxHQUFHLElBQUgsR0FBVSxJQUE3QjtBQUNBOztBQUVELFdBQUssZ0NBQUw7QUFDQ0QsUUFBQUEsUUFBUSxHQUFHQyxRQUFRLEdBQUcsYUFBSCxHQUFtQixVQUF0QztBQUNBOztBQUVEO0FBQ0NELFFBQUFBLFFBQVEsR0FBRyxJQUFYO0FBMUNGOztBQTZDQSxXQUFPO0FBQ05BLE1BQUFBLFFBQVEsRUFBRUEsUUFESjtBQUVOSSxNQUFBQSxRQUFRLEVBQUVMLFlBQVksSUFBSUEsWUFBWSxDQUFDTSxPQUFiLENBQXFCLFVBQXJCLE1BQXFDLENBQXJELEdBQXlELElBQUlDLElBQUosQ0FBU1IsS0FBSyxDQUFDUyxHQUFmLENBQXpELEdBQStFVCxLQUFLLENBQUNTLEdBRnpGO0FBR05DLE1BQUFBLFNBQVMsRUFBRVYsS0FBSyxDQUFDVyxJQUFOLElBQWNWLFlBQWQsSUFBOEJBLFlBQVksQ0FBQ00sT0FBYixDQUFxQixVQUFyQixNQUFxQyxDQUFuRSxHQUF1RSxJQUFJQyxJQUFKLENBQVNSLEtBQUssQ0FBQ1csSUFBZixDQUF2RSxHQUE4RlgsS0FBSyxDQUFDVztBQUh6RyxLQUFQO0FBS0E7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFdBQVNDLHdDQUFULENBQWtEQyxnQkFBbEQsRUFBMEg7QUFDaEksUUFBTUMsV0FBK0IsR0FBRyxFQUF4Qzs7QUFFQSxRQUFJRCxnQkFBZ0IsQ0FBQ0UsYUFBckIsRUFBb0M7QUFDbkNGLE1BQUFBLGdCQUFnQixDQUFDRSxhQUFqQixDQUErQkMsT0FBL0IsQ0FBdUMsVUFBQUMsWUFBWSxFQUFJO0FBQ3RELFlBQUlBLFlBQVksQ0FBQ0MsWUFBYixJQUE2QkQsWUFBWSxDQUFDRSxNQUFiLENBQW9CQyxNQUFwQixHQUE2QixDQUE5RCxFQUFpRTtBQUNoRU4sVUFBQUEsV0FBVyxDQUFDTyxJQUFaLENBQWlCO0FBQ2hCQyxZQUFBQSxZQUFZLEVBQUVMLFlBQVksQ0FBQ0MsWUFBYixDQUEwQkssS0FEeEI7QUFFaEJ0QixZQUFBQSxZQUFZLEVBQUVnQixZQUFZLENBQUNDLFlBQWIsQ0FBMEJNLE9BQTFCLENBQWtDQyxJQUZoQztBQUdoQkMsWUFBQUEsTUFBTSxFQUFFVCxZQUFZLENBQUNFLE1BQWIsQ0FBb0JRLEdBQXBCLENBQXdCLFVBQUEzQixLQUFLLEVBQUk7QUFBQTs7QUFDeEMscUJBQU9ELGtCQUFrQixDQUFDQyxLQUFELDJCQUFRaUIsWUFBWSxDQUFDQyxZQUFyQiwwREFBUSxzQkFBMkJNLE9BQTNCLENBQW1DQyxJQUEzQyxDQUF6QjtBQUNBLGFBRk87QUFIUSxXQUFqQjtBQU9BO0FBQ0QsT0FWRDtBQVdBOztBQUVELFdBQU9YLFdBQVA7QUFDQSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQW5ub3RhdGlvblRlcm0gfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcbmltcG9ydCB7IFNlbGVjdGlvblZhcmlhbnQsIFNlbGVjdGlvblJhbmdlVHlwZSB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy9kaXN0L2dlbmVyYXRlZC9VSVwiO1xuXG5leHBvcnQgdHlwZSBSYW5nZURlZmluaXRpb24gPSB7XG5cdG9wZXJhdG9yOiBzdHJpbmc7XG5cdHJhbmdlTG93OiBhbnk7XG5cdHJhbmdlSGlnaD86IGFueTtcbn07XG5cbmV4cG9ydCB0eXBlIEZpbHRlckRlZmluaXRpb24gPSB7XG5cdHByb3BlcnR5UGF0aDogc3RyaW5nO1xuXHRwcm9wZXJ0eVR5cGU6IHN0cmluZztcblx0cmFuZ2VzOiBSYW5nZURlZmluaXRpb25bXTtcbn07XG5cbmZ1bmN0aW9uIGdldFJhbmdlRGVmaW5pdGlvbihyYW5nZTogU2VsZWN0aW9uUmFuZ2VUeXBlLCBwcm9wZXJ0eVR5cGU6IHN0cmluZyB8IHVuZGVmaW5lZCk6IFJhbmdlRGVmaW5pdGlvbiB7XG5cdGxldCBvcGVyYXRvcjogU3RyaW5nO1xuXHRjb25zdCBiSW5jbHVkZSA9IHJhbmdlLlNpZ24gPT09IFwiVUkuU2VsZWN0aW9uUmFuZ2VTaWduVHlwZS9JXCIgPyB0cnVlIDogZmFsc2U7XG5cblx0c3dpdGNoIChyYW5nZS5PcHRpb24gYXMgc3RyaW5nKSB7XG5cdFx0Y2FzZSBcIlVJLlNlbGVjdGlvblJhbmdlT3B0aW9uVHlwZS9CVFwiOlxuXHRcdFx0b3BlcmF0b3IgPSBiSW5jbHVkZSA/IFwiQlRcIiA6IFwiTkJcIjtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBcIlVJLlNlbGVjdGlvblJhbmdlT3B0aW9uVHlwZS9DUFwiOlxuXHRcdFx0b3BlcmF0b3IgPSBiSW5jbHVkZSA/IFwiQ29udGFpbnNcIiA6IFwiTm90Q29udGFpbnNcIjtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBcIlVJLlNlbGVjdGlvblJhbmdlT3B0aW9uVHlwZS9FUVwiOlxuXHRcdFx0b3BlcmF0b3IgPSBiSW5jbHVkZSA/IFwiRVFcIiA6IFwiTkVcIjtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBcIlVJLlNlbGVjdGlvblJhbmdlT3B0aW9uVHlwZS9HRVwiOlxuXHRcdFx0b3BlcmF0b3IgPSBiSW5jbHVkZSA/IFwiR0VcIiA6IFwiTFRcIjtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBcIlVJLlNlbGVjdGlvblJhbmdlT3B0aW9uVHlwZS9HVFwiOlxuXHRcdFx0b3BlcmF0b3IgPSBiSW5jbHVkZSA/IFwiR1RcIiA6IFwiTEVcIjtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBcIlVJLlNlbGVjdGlvblJhbmdlT3B0aW9uVHlwZS9MRVwiOlxuXHRcdFx0b3BlcmF0b3IgPSBiSW5jbHVkZSA/IFwiTEVcIiA6IFwiR1RcIjtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBcIlVJLlNlbGVjdGlvblJhbmdlT3B0aW9uVHlwZS9MVFwiOlxuXHRcdFx0b3BlcmF0b3IgPSBiSW5jbHVkZSA/IFwiTFRcIiA6IFwiR0VcIjtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBcIlVJLlNlbGVjdGlvblJhbmdlT3B0aW9uVHlwZS9OQlwiOlxuXHRcdFx0b3BlcmF0b3IgPSBiSW5jbHVkZSA/IFwiTkJcIiA6IFwiQlRcIjtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBcIlVJLlNlbGVjdGlvblJhbmdlT3B0aW9uVHlwZS9ORVwiOlxuXHRcdFx0b3BlcmF0b3IgPSBiSW5jbHVkZSA/IFwiTkVcIiA6IFwiRVFcIjtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBcIlVJLlNlbGVjdGlvblJhbmdlT3B0aW9uVHlwZS9OUFwiOlxuXHRcdFx0b3BlcmF0b3IgPSBiSW5jbHVkZSA/IFwiTm90Q29udGFpbnNcIiA6IFwiQ29udGFpbnNcIjtcblx0XHRcdGJyZWFrO1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdG9wZXJhdG9yID0gXCJFUVwiO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRvcGVyYXRvcjogb3BlcmF0b3IgYXMgc3RyaW5nLFxuXHRcdHJhbmdlTG93OiBwcm9wZXJ0eVR5cGUgJiYgcHJvcGVydHlUeXBlLmluZGV4T2YoXCJFZG0uRGF0ZVwiKSA9PT0gMCA/IG5ldyBEYXRlKHJhbmdlLkxvdykgOiByYW5nZS5Mb3csXG5cdFx0cmFuZ2VIaWdoOiByYW5nZS5IaWdoICYmIHByb3BlcnR5VHlwZSAmJiBwcm9wZXJ0eVR5cGUuaW5kZXhPZihcIkVkbS5EYXRlXCIpID09PSAwID8gbmV3IERhdGUocmFuZ2UuSGlnaCkgOiByYW5nZS5IaWdoXG5cdH07XG59XG5cbi8qKlxuICogUGFyc2VzIGEgU2VsZWN0aW9uVmFyaWFudCBhbm5vdGF0aW9ucyBhbmQgY3JlYXRlcyB0aGUgY29ycmVzcG9uZGluZyBmaWx0ZXIgZGVmaW5pdGlvbnMuXG4gKlxuICogQHBhcmFtIHNlbGVjdGlvblZhcmlhbnQgU2VsZWN0aW9uVmFyaWFudCBhbm5vdGF0aW9uXG4gKiBAcmV0dXJucyBSZXR1cm5zIGFuIGFycmF5IG9mIGZpbHRlciBkZWZpbml0aW9ucyBjb3JyZXNwb25kaW5nIHRvIHRoZSBTZWxlY3Rpb25WYXJpYW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmlsdGVyRGVmaW5pdGlvbnNGcm9tU2VsZWN0aW9uVmFyaWFudChzZWxlY3Rpb25WYXJpYW50OiBBbm5vdGF0aW9uVGVybTxTZWxlY3Rpb25WYXJpYW50Pik6IEZpbHRlckRlZmluaXRpb25bXSB7XG5cdGNvbnN0IGFGaWx0ZXJEZWZzOiBGaWx0ZXJEZWZpbml0aW9uW10gPSBbXTtcblxuXHRpZiAoc2VsZWN0aW9uVmFyaWFudC5TZWxlY3RPcHRpb25zKSB7XG5cdFx0c2VsZWN0aW9uVmFyaWFudC5TZWxlY3RPcHRpb25zLmZvckVhY2goc2VsZWN0T3B0aW9uID0+IHtcblx0XHRcdGlmIChzZWxlY3RPcHRpb24uUHJvcGVydHlOYW1lICYmIHNlbGVjdE9wdGlvbi5SYW5nZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRhRmlsdGVyRGVmcy5wdXNoKHtcblx0XHRcdFx0XHRwcm9wZXJ0eVBhdGg6IHNlbGVjdE9wdGlvbi5Qcm9wZXJ0eU5hbWUudmFsdWUsXG5cdFx0XHRcdFx0cHJvcGVydHlUeXBlOiBzZWxlY3RPcHRpb24uUHJvcGVydHlOYW1lLiR0YXJnZXQudHlwZSxcblx0XHRcdFx0XHRyYW5nZXM6IHNlbGVjdE9wdGlvbi5SYW5nZXMubWFwKHJhbmdlID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiBnZXRSYW5nZURlZmluaXRpb24ocmFuZ2UsIHNlbGVjdE9wdGlvbi5Qcm9wZXJ0eU5hbWU/LiR0YXJnZXQudHlwZSk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4gYUZpbHRlckRlZnM7XG59XG4iXX0=