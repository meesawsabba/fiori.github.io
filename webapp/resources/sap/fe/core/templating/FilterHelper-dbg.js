/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/mdc/condition/Condition", "sap/ui/mdc/enum/ConditionValidated"], function (Condition, ConditionValidated) {
  "use strict";

  var _exports = {};
  var createCondition = Condition.createCondition;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var aValidTypes = ["Edm.Boolean", "Edm.Byte", "Edm.Date", "Edm.DateTime", "Edm.DateTimeOffset", "Edm.Decimal", "Edm.Double", "Edm.Float", "Edm.Guid", "Edm.Int16", "Edm.Int32", "Edm.Int64", "Edm.SByte", "Edm.Single", "Edm.String", "Edm.Time", "Edm.TimeOfDay"];
  var oExcludeMap = {
    "Contains": "NotContains",
    "StartsWith": "NotStartsWith",
    "EndsWith": "NotEndsWith",
    "Empty": "NotEmpty",
    "NotEmpty": "Empty",
    "LE": "NOTLE",
    "GE": "NOTGE",
    "LT": "NOTLT",
    "GT": "NOTGT",
    "BT": "NOTBT",
    "NE": "EQ",
    "EQ": "NE"
  };
  /**
   * Method to get the compliant value type based on the data type.
   *
   * @param  sValue Raw value
   * @param  sType The property type
   * @returns Value to be propagated to the condition.
   */

  function getTypeCompliantValue(sValue, sType) {
    var oValue;

    if (aValidTypes.indexOf(sType) > -1) {
      oValue = sValue;

      if (sType === "Edm.Boolean") {
        oValue = sValue === "true" || (sValue === "false" ? false : undefined);
      } else if (sType === "Edm.Double" || sType === "Edm.Single") {
        oValue = isNaN(sValue) ? undefined : parseFloat(sValue);
      } else if (sType === "Edm.Byte" || sType === "Edm.Int16" || sType === "Edm.Int32" || sType === "Edm.SByte") {
        oValue = isNaN(sValue) ? undefined : parseInt(sValue, 10);
      } else if (sType === "Edm.Date") {
        oValue = sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/) ? sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)[0] : sValue.match(/^(\d{8})/) && sValue.match(/^(\d{8})/)[0];
      } else if (sType === "Edm.DateTimeOffset") {
        if (sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})\+(\d{1,4})/)) {
          oValue = sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})\+(\d{1,4})/)[0];
        } else if (sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})/)) {
          oValue = sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})/)[0] + "+0000";
        } else if (sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)) {
          oValue = sValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)[0] + "T00:00:00+0000";
        } else if (sValue.indexOf("Z") === sValue.length - 1) {
          oValue = sValue.split("Z")[0] + "+0100";
        } else {
          oValue = undefined;
        }
      } else if (sType === "Edm.TimeOfDay") {
        oValue = sValue.match(/(\d{1,2}):(\d{1,2}):(\d{1,2})/) ? sValue.match(/(\d{1,2}):(\d{1,2}):(\d{1,2})/)[0] : undefined;
      }
    }

    return oValue;
  }
  /**
   * Method to create a condition.
   * @param  sOption Operator to be used.
   * @param  oV1 Lower value
   * @param  oV2 Higher value
   * @param sSign
   * @returns Condition to be created
   */


  _exports.getTypeCompliantValue = getTypeCompliantValue;

  function resolveConditionValues(sOption, oV1, oV2, sSign) {
    var oValue = oV1,
        oValue2,
        sInternalOperation;
    var oCondition = {};
    oCondition.values = [];
    oCondition.isEmpty = null;

    if (oV1 === undefined || oV1 === null) {
      return;
    }

    switch (sOption) {
      case "CP":
        sInternalOperation = "Contains";

        if (oValue) {
          var nIndexOf = oValue.indexOf("*");
          var nLastIndex = oValue.lastIndexOf("*"); // only when there are '*' at all

          if (nIndexOf > -1) {
            if (nIndexOf === 0 && nLastIndex !== oValue.length - 1) {
              sInternalOperation = "EndsWith";
              oValue = oValue.substring(1, oValue.length);
            } else if (nIndexOf !== 0 && nLastIndex === oValue.length - 1) {
              sInternalOperation = "StartsWith";
              oValue = oValue.substring(0, oValue.length - 1);
            } else {
              oValue = oValue.substring(1, oValue.length - 1);
            }
          } else {
            /* TODO Add diagonostics Log.warning("Contains Option cannot be used without '*'.") */
            return;
          }
        }

        break;

      case "EQ":
        sInternalOperation = oV1 === "" ? "Empty" : sOption;
        break;

      case "NE":
        sInternalOperation = oV1 === "" ? "NotEmpty" : sOption;
        break;

      case "BT":
        if (oV2 === undefined || oV2 === null) {
          return;
        }

        oValue2 = oV2;
        sInternalOperation = sOption;
        break;

      case "LE":
      case "GE":
      case "GT":
      case "LT":
        sInternalOperation = sOption;
        break;

      default:
        /* TODO Add diagonostics Log.warning("Selection Option is not supported : '" + sOption + "'"); */
        return;
    }

    if (sSign === "E") {
      sInternalOperation = oExcludeMap[sInternalOperation];
    }

    oCondition.operator = sInternalOperation;

    if (sInternalOperation !== "Empty") {
      oCondition.values.push(oValue);

      if (oValue2) {
        oCondition.values.push(oValue2);
      }
    }

    return oCondition;
  }
  /* Method to get the operator from the Selection Option */


  _exports.resolveConditionValues = resolveConditionValues;

  function getOperator(sOperator) {
    return sOperator.indexOf("/") > 0 ? sOperator.split("/")[1] : sOperator;
  }

  _exports.getOperator = getOperator;

  function getFiltersConditionsFromSelectionVariant(entityTypeProperties, selectionVariant, getCustomConditions) {
    var ofilterConditions = {};

    if (selectionVariant) {
      var aSelectOptions = selectionVariant.SelectOptions;
      var aParameters = selectionVariant.Parameters;
      var aValidProperties = entityTypeProperties;
      aSelectOptions === null || aSelectOptions === void 0 ? void 0 : aSelectOptions.forEach(function (selectOption) {
        var propertyName = selectOption.PropertyName;
        var sPropertyName = propertyName.value || propertyName.$PropertyPath;
        var Ranges = selectOption.Ranges;

        for (var key in aValidProperties) {
          if (sPropertyName === key) {
            (function () {
              var oValidProperty = aValidProperties[key];
              var aConditions = [];
              Ranges === null || Ranges === void 0 ? void 0 : Ranges.forEach(function (Range) {
                var oCondition = getCustomConditions ? getCustomConditions(Range, oValidProperty, sPropertyName) : getConditions(Range, oValidProperty);
                aConditions.push(oCondition);

                if (aConditions.length) {
                  ofilterConditions[sPropertyName] = (ofilterConditions[sPropertyName] || []).concat(aConditions);
                }
              });
            })();
          }
        }
      });
      aParameters === null || aParameters === void 0 ? void 0 : aParameters.forEach(function (parameter) {
        var sPropertyPath = parameter.PropertyName.value || parameter.PropertyName.$PropertyPath;
        var oCondition = getCustomConditions ? {
          operator: "EQ",
          value1: parameter.PropertyValue,
          value2: null,
          path: sPropertyPath,
          isParameter: true
        } : {
          operator: "EQ",
          values: [parameter.PropertyValue],
          isEmpty: null,
          validated: ConditionValidated.Validated,
          isParameter: true
        };
        ofilterConditions[sPropertyPath] = [oCondition];
      });
    }

    return ofilterConditions;
  }

  _exports.getFiltersConditionsFromSelectionVariant = getFiltersConditionsFromSelectionVariant;

  function getConditions(Range, oValidProperty) {
    var oCondition;
    var sign = Range.Sign;
    var sOption = Range.Option ? getOperator(Range.Option) : undefined;
    var oValue1 = getTypeCompliantValue(Range.Low, oValidProperty.$Type);
    var oValue2 = Range.High ? getTypeCompliantValue(Range.High, oValidProperty.$Type) : undefined;
    var oConditionValues = resolveConditionValues(sOption, oValue1, oValue2, sign);

    if (oConditionValues) {
      oCondition = createCondition(oConditionValues.operator, oConditionValues.values, null, null, ConditionValidated.Validated);
    }

    return oCondition;
  }

  _exports.getConditions = getConditions;

  var getDefaultValueFilters = function (oContext, properties) {
    var filterConditions = {};
    var entitySetPath = oContext.getInterface(1).getPath(),
        oMetaModel = oContext.getInterface(1).getModel();

    if (properties) {
      for (var key in properties) {
        var defaultFilterValue = oMetaModel.getObject(entitySetPath + "/" + key + "@com.sap.vocabularies.Common.v1.FilterDefaultValue");

        if (defaultFilterValue !== undefined) {
          var PropertyName = key;
          filterConditions[PropertyName] = [createCondition("EQ", [defaultFilterValue], null, null, ConditionValidated.Validated)];
        }
      }
    }

    return filterConditions;
  };

  var getDefaultSemanticDateFilters = function (oContext, properties, defaultSemanticDates) {
    var filterConditions = {};

    if (properties) {
      for (var key in properties) {
        // currently defaultSemanticDates can support only one entry, we pick the first one directly using 0 index
        if (defaultSemanticDates[key] && defaultSemanticDates[key][0]) {
          filterConditions[key] = [createCondition(defaultSemanticDates[key][0].operator, [], null, null, null)];
        }
      }
    }

    return filterConditions;
  };

  function getEditStatusFilter() {
    var ofilterConditions = {};
    ofilterConditions["$editState"] = [createCondition("DRAFT_EDIT_STATE", ["ALL"], null, null, ConditionValidated.Validated)];
    return ofilterConditions;
  }

  function getFilterConditions(oContext, filterConditions) {
    var _filterConditions, _filterConditions2;

    var editStateFilter;
    var entitySetPath = oContext.getInterface(1).getPath(),
        oMetaModel = oContext.getInterface(1).getModel(),
        entityTypeAnnotations = oMetaModel.getObject(entitySetPath + "@"),
        entityTypeProperties = oMetaModel.getObject(entitySetPath + "/");

    if (entityTypeAnnotations["@com.sap.vocabularies.Common.v1.DraftRoot"] || entityTypeAnnotations["@com.sap.vocabularies.Common.v1.DraftNode"]) {
      editStateFilter = getEditStatusFilter();
    }

    var selectionVariant = (_filterConditions = filterConditions) === null || _filterConditions === void 0 ? void 0 : _filterConditions.selectionVariant;
    var defaultSemanticDates = ((_filterConditions2 = filterConditions) === null || _filterConditions2 === void 0 ? void 0 : _filterConditions2.defaultSemanticDates) || {};
    var defaultFilters = getDefaultValueFilters(oContext, entityTypeProperties);
    var defaultSemanticDateFilters = getDefaultSemanticDateFilters(oContext, entityTypeProperties, defaultSemanticDates);

    if (selectionVariant) {
      filterConditions = getFiltersConditionsFromSelectionVariant(entityTypeProperties, selectionVariant);
    } else if (defaultFilters) {
      filterConditions = defaultFilters;
    }

    if (defaultSemanticDateFilters) {
      // only for semantic date:
      // 1. value from manifest get merged with SV
      // 2. manifest value is given preference when there is same semantic date property in SV and manifest
      filterConditions = _objectSpread(_objectSpread({}, filterConditions), defaultSemanticDateFilters);
    }

    if (editStateFilter) {
      filterConditions = _objectSpread(_objectSpread({}, filterConditions), editStateFilter);
    }

    return Object.keys(filterConditions).length > 0 ? JSON.stringify(filterConditions) : undefined;
  }

  _exports.getFilterConditions = getFilterConditions;
  getFilterConditions.requiresIContext = true;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZpbHRlckhlbHBlci50cyJdLCJuYW1lcyI6WyJhVmFsaWRUeXBlcyIsIm9FeGNsdWRlTWFwIiwiZ2V0VHlwZUNvbXBsaWFudFZhbHVlIiwic1ZhbHVlIiwic1R5cGUiLCJvVmFsdWUiLCJpbmRleE9mIiwidW5kZWZpbmVkIiwiaXNOYU4iLCJwYXJzZUZsb2F0IiwicGFyc2VJbnQiLCJtYXRjaCIsImxlbmd0aCIsInNwbGl0IiwicmVzb2x2ZUNvbmRpdGlvblZhbHVlcyIsInNPcHRpb24iLCJvVjEiLCJvVjIiLCJzU2lnbiIsIm9WYWx1ZTIiLCJzSW50ZXJuYWxPcGVyYXRpb24iLCJvQ29uZGl0aW9uIiwidmFsdWVzIiwiaXNFbXB0eSIsIm5JbmRleE9mIiwibkxhc3RJbmRleCIsImxhc3RJbmRleE9mIiwic3Vic3RyaW5nIiwib3BlcmF0b3IiLCJwdXNoIiwiZ2V0T3BlcmF0b3IiLCJzT3BlcmF0b3IiLCJnZXRGaWx0ZXJzQ29uZGl0aW9uc0Zyb21TZWxlY3Rpb25WYXJpYW50IiwiZW50aXR5VHlwZVByb3BlcnRpZXMiLCJzZWxlY3Rpb25WYXJpYW50IiwiZ2V0Q3VzdG9tQ29uZGl0aW9ucyIsIm9maWx0ZXJDb25kaXRpb25zIiwiYVNlbGVjdE9wdGlvbnMiLCJTZWxlY3RPcHRpb25zIiwiYVBhcmFtZXRlcnMiLCJQYXJhbWV0ZXJzIiwiYVZhbGlkUHJvcGVydGllcyIsImZvckVhY2giLCJzZWxlY3RPcHRpb24iLCJwcm9wZXJ0eU5hbWUiLCJQcm9wZXJ0eU5hbWUiLCJzUHJvcGVydHlOYW1lIiwidmFsdWUiLCIkUHJvcGVydHlQYXRoIiwiUmFuZ2VzIiwia2V5Iiwib1ZhbGlkUHJvcGVydHkiLCJhQ29uZGl0aW9ucyIsIlJhbmdlIiwiZ2V0Q29uZGl0aW9ucyIsImNvbmNhdCIsInBhcmFtZXRlciIsInNQcm9wZXJ0eVBhdGgiLCJ2YWx1ZTEiLCJQcm9wZXJ0eVZhbHVlIiwidmFsdWUyIiwicGF0aCIsImlzUGFyYW1ldGVyIiwidmFsaWRhdGVkIiwiQ29uZGl0aW9uVmFsaWRhdGVkIiwiVmFsaWRhdGVkIiwic2lnbiIsIlNpZ24iLCJPcHRpb24iLCJvVmFsdWUxIiwiTG93IiwiJFR5cGUiLCJIaWdoIiwib0NvbmRpdGlvblZhbHVlcyIsImNyZWF0ZUNvbmRpdGlvbiIsImdldERlZmF1bHRWYWx1ZUZpbHRlcnMiLCJvQ29udGV4dCIsInByb3BlcnRpZXMiLCJmaWx0ZXJDb25kaXRpb25zIiwiZW50aXR5U2V0UGF0aCIsImdldEludGVyZmFjZSIsImdldFBhdGgiLCJvTWV0YU1vZGVsIiwiZ2V0TW9kZWwiLCJkZWZhdWx0RmlsdGVyVmFsdWUiLCJnZXRPYmplY3QiLCJnZXREZWZhdWx0U2VtYW50aWNEYXRlRmlsdGVycyIsImRlZmF1bHRTZW1hbnRpY0RhdGVzIiwiZ2V0RWRpdFN0YXR1c0ZpbHRlciIsImdldEZpbHRlckNvbmRpdGlvbnMiLCJlZGl0U3RhdGVGaWx0ZXIiLCJlbnRpdHlUeXBlQW5ub3RhdGlvbnMiLCJkZWZhdWx0RmlsdGVycyIsImRlZmF1bHRTZW1hbnRpY0RhdGVGaWx0ZXJzIiwiT2JqZWN0Iiwia2V5cyIsIkpTT04iLCJzdHJpbmdpZnkiLCJyZXF1aXJlc0lDb250ZXh0Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FBU0EsTUFBTUEsV0FBVyxHQUFHLENBQ25CLGFBRG1CLEVBRW5CLFVBRm1CLEVBR25CLFVBSG1CLEVBSW5CLGNBSm1CLEVBS25CLG9CQUxtQixFQU1uQixhQU5tQixFQU9uQixZQVBtQixFQVFuQixXQVJtQixFQVNuQixVQVRtQixFQVVuQixXQVZtQixFQVduQixXQVhtQixFQVluQixXQVptQixFQWFuQixXQWJtQixFQWNuQixZQWRtQixFQWVuQixZQWZtQixFQWdCbkIsVUFoQm1CLEVBaUJuQixlQWpCbUIsQ0FBcEI7QUFvQkEsTUFBTUMsV0FBZ0MsR0FBRztBQUN4QyxnQkFBWSxhQUQ0QjtBQUV4QyxrQkFBYyxlQUYwQjtBQUd4QyxnQkFBWSxhQUg0QjtBQUl4QyxhQUFTLFVBSitCO0FB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R0FBdUMsSUFBdkMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNlbGVjdE9wdGlvblR5cGUsIFNlbGVjdGlvblZhcmlhbnRUeXBlVHlwZXMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvZGlzdC9nZW5lcmF0ZWQvVUlcIjtcbmltcG9ydCB7IGNyZWF0ZUNvbmRpdGlvbiB9IGZyb20gXCJzYXAvdWkvbWRjL2NvbmRpdGlvbi9Db25kaXRpb25cIjtcbmltcG9ydCB7IENvbmRpdGlvblZhbGlkYXRlZCB9IGZyb20gXCJzYXAvdWkvbWRjL2VudW1cIjtcblxuZXhwb3J0IHR5cGUgRmlsdGVyQ29uZGl0aW9ucyA9IHtcblx0b3BlcmF0b3I6IHN0cmluZztcblx0dmFsdWVzOiBBcnJheTxzdHJpbmc+O1xuXHRpc0VtcHR5PzogYm9vbGVhbiB8IG51bGw7XG5cdHZhbGlkYXRlZD86IHN0cmluZztcbn07XG5cbmNvbnN0IGFWYWxpZFR5cGVzID0gW1xuXHRcIkVkbS5Cb29sZWFuXCIsXG5cdFwiRWRtLkJ5dGVcIixcblx0XCJFZG0uRGF0ZVwiLFxuXHRcIkVkbS5EYXRlVGltZVwiLFxuXHRcIkVkbS5EYXRlVGltZU9mZnNldFwiLFxuXHRcIkVkbS5EZWNpbWFsXCIsXG5cdFwiRWRtLkRvdWJsZVwiLFxuXHRcIkVkbS5GbG9hdFwiLFxuXHRcIkVkbS5HdWlkXCIsXG5cdFwiRWRtLkludDE2XCIsXG5cdFwiRWRtLkludDMyXCIsXG5cdFwiRWRtLkludDY0XCIsXG5cdFwiRWRtLlNCeXRlXCIsXG5cdFwiRWRtLlNpbmdsZVwiLFxuXHRcIkVkbS5TdHJpbmdcIixcblx0XCJFZG0uVGltZVwiLFxuXHRcIkVkbS5UaW1lT2ZEYXlcIlxuXTtcblxuY29uc3Qgb0V4Y2x1ZGVNYXA6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG5cdFwiQ29udGFpbnNcIjogXCJOb3RDb250YWluc1wiLFxuXHRcIlN0YXJ0c1dpdGhcIjogXCJOb3RTdGFydHNXaXRoXCIsXG5cdFwiRW5kc1dpdGhcIjogXCJOb3RFbmRzV2l0aFwiLFxuXHRcIkVtcHR5XCI6IFwiTm90RW1wdHlcIixcblx0XCJOb3RFbXB0eVwiOiBcIkVtcHR5XCIsXG5cdFwiTEVcIjogXCJOT1RMRVwiLFxuXHRcIkdFXCI6IFwiTk9UR0VcIixcblx0XCJMVFwiOiBcIk5PVExUXCIsXG5cdFwiR1RcIjogXCJOT1RHVFwiLFxuXHRcIkJUXCI6IFwiTk9UQlRcIixcblx0XCJORVwiOiBcIkVRXCIsXG5cdFwiRVFcIjogXCJORVwiXG59O1xuXG4vKipcbiAqIE1ldGhvZCB0byBnZXQgdGhlIGNvbXBsaWFudCB2YWx1ZSB0eXBlIGJhc2VkIG9uIHRoZSBkYXRhIHR5cGUuXG4gKlxuICogQHBhcmFtICBzVmFsdWUgUmF3IHZhbHVlXG4gKiBAcGFyYW0gIHNUeXBlIFRoZSBwcm9wZXJ0eSB0eXBlXG4gKiBAcmV0dXJucyBWYWx1ZSB0byBiZSBwcm9wYWdhdGVkIHRvIHRoZSBjb25kaXRpb24uXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFR5cGVDb21wbGlhbnRWYWx1ZShzVmFsdWU6IGFueSwgc1R5cGU6IHN0cmluZykge1xuXHRsZXQgb1ZhbHVlO1xuXHRpZiAoYVZhbGlkVHlwZXMuaW5kZXhPZihzVHlwZSkgPiAtMSkge1xuXHRcdG9WYWx1ZSA9IHNWYWx1ZTtcblx0XHRpZiAoc1R5cGUgPT09IFwiRWRtLkJvb2xlYW5cIikge1xuXHRcdFx0b1ZhbHVlID0gc1ZhbHVlID09PSBcInRydWVcIiB8fCAoc1ZhbHVlID09PSBcImZhbHNlXCIgPyBmYWxzZSA6IHVuZGVmaW5lZCk7XG5cdFx0fSBlbHNlIGlmIChzVHlwZSA9PT0gXCJFZG0uRG91YmxlXCIgfHwgc1R5cGUgPT09IFwiRWRtLlNpbmdsZVwiKSB7XG5cdFx0XHRvVmFsdWUgPSBpc05hTihzVmFsdWUpID8gdW5kZWZpbmVkIDogcGFyc2VGbG9hdChzVmFsdWUpO1xuXHRcdH0gZWxzZSBpZiAoc1R5cGUgPT09IFwiRWRtLkJ5dGVcIiB8fCBzVHlwZSA9PT0gXCJFZG0uSW50MTZcIiB8fCBzVHlwZSA9PT0gXCJFZG0uSW50MzJcIiB8fCBzVHlwZSA9PT0gXCJFZG0uU0J5dGVcIikge1xuXHRcdFx0b1ZhbHVlID0gaXNOYU4oc1ZhbHVlKSA/IHVuZGVmaW5lZCA6IHBhcnNlSW50KHNWYWx1ZSwgMTApO1xuXHRcdH0gZWxzZSBpZiAoc1R5cGUgPT09IFwiRWRtLkRhdGVcIikge1xuXHRcdFx0b1ZhbHVlID0gc1ZhbHVlLm1hdGNoKC9eKFxcZHs0fSktKFxcZHsxLDJ9KS0oXFxkezEsMn0pLylcblx0XHRcdFx0PyBzVmFsdWUubWF0Y2goL14oXFxkezR9KS0oXFxkezEsMn0pLShcXGR7MSwyfSkvKVswXVxuXHRcdFx0XHQ6IHNWYWx1ZS5tYXRjaCgvXihcXGR7OH0pLykgJiYgc1ZhbHVlLm1hdGNoKC9eKFxcZHs4fSkvKVswXTtcblx0XHR9IGVsc2UgaWYgKHNUeXBlID09PSBcIkVkbS5EYXRlVGltZU9mZnNldFwiKSB7XG5cdFx0XHRpZiAoc1ZhbHVlLm1hdGNoKC9eKFxcZHs0fSktKFxcZHsxLDJ9KS0oXFxkezEsMn0pVChcXGR7MSwyfSk6KFxcZHsxLDJ9KTooXFxkezEsMn0pXFwrKFxcZHsxLDR9KS8pKSB7XG5cdFx0XHRcdG9WYWx1ZSA9IHNWYWx1ZS5tYXRjaCgvXihcXGR7NH0pLShcXGR7MSwyfSktKFxcZHsxLDJ9KVQoXFxkezEsMn0pOihcXGR7MSwyfSk6KFxcZHsxLDJ9KVxcKyhcXGR7MSw0fSkvKVswXTtcblx0XHRcdH0gZWxzZSBpZiAoc1ZhbHVlLm1hdGNoKC9eKFxcZHs0fSktKFxcZHsxLDJ9KS0oXFxkezEsMn0pVChcXGR7MSwyfSk6KFxcZHsxLDJ9KTooXFxkezEsMn0pLykpIHtcblx0XHRcdFx0b1ZhbHVlID0gc1ZhbHVlLm1hdGNoKC9eKFxcZHs0fSktKFxcZHsxLDJ9KS0oXFxkezEsMn0pVChcXGR7MSwyfSk6KFxcZHsxLDJ9KTooXFxkezEsMn0pLylbMF0gKyBcIiswMDAwXCI7XG5cdFx0XHR9IGVsc2UgaWYgKHNWYWx1ZS5tYXRjaCgvXihcXGR7NH0pLShcXGR7MSwyfSktKFxcZHsxLDJ9KS8pKSB7XG5cdFx0XHRcdG9WYWx1ZSA9IHNWYWx1ZS5tYXRjaCgvXihcXGR7NH0pLShcXGR7MSwyfSktKFxcZHsxLDJ9KS8pWzBdICsgXCJUMDA6MDA6MDArMDAwMFwiO1xuXHRcdFx0fSBlbHNlIGlmIChzVmFsdWUuaW5kZXhPZihcIlpcIikgPT09IHNWYWx1ZS5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdG9WYWx1ZSA9IHNWYWx1ZS5zcGxpdChcIlpcIilbMF0gKyBcIiswMTAwXCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvVmFsdWUgPSB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChzVHlwZSA9PT0gXCJFZG0uVGltZU9mRGF5XCIpIHtcblx0XHRcdG9WYWx1ZSA9IHNWYWx1ZS5tYXRjaCgvKFxcZHsxLDJ9KTooXFxkezEsMn0pOihcXGR7MSwyfSkvKSA/IHNWYWx1ZS5tYXRjaCgvKFxcZHsxLDJ9KTooXFxkezEsMn0pOihcXGR7MSwyfSkvKVswXSA6IHVuZGVmaW5lZDtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG9WYWx1ZTtcbn1cblxuLyoqXG4gKiBNZXRob2QgdG8gY3JlYXRlIGEgY29uZGl0aW9uLlxuICogQHBhcmFtICBzT3B0aW9uIE9wZXJhdG9yIHRvIGJlIHVzZWQuXG4gKiBAcGFyYW0gIG9WMSBMb3dlciB2YWx1ZVxuICogQHBhcmFtICBvVjIgSGlnaGVyIHZhbHVlXG4gKiBAcGFyYW0gc1NpZ25cbiAqIEByZXR1cm5zIENvbmRpdGlvbiB0byBiZSBjcmVhdGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlQ29uZGl0aW9uVmFsdWVzKHNPcHRpb246IHN0cmluZyB8IHVuZGVmaW5lZCwgb1YxOiBhbnksIG9WMjogYW55LCBzU2lnbjogc3RyaW5nIHwgdW5kZWZpbmVkKSB7XG5cdGxldCBvVmFsdWUgPSBvVjEsXG5cdFx0b1ZhbHVlMixcblx0XHRzSW50ZXJuYWxPcGVyYXRpb246IGFueTtcblx0Y29uc3Qgb0NvbmRpdGlvbjogUmVjb3JkPHN0cmluZywgRmlsdGVyQ29uZGl0aW9uc1tdPiA9IHt9O1xuXHRvQ29uZGl0aW9uLnZhbHVlcyA9IFtdO1xuXHRvQ29uZGl0aW9uLmlzRW1wdHkgPSBudWxsIGFzIGFueTtcblx0aWYgKG9WMSA9PT0gdW5kZWZpbmVkIHx8IG9WMSA9PT0gbnVsbCkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHN3aXRjaCAoc09wdGlvbikge1xuXHRcdGNhc2UgXCJDUFwiOlxuXHRcdFx0c0ludGVybmFsT3BlcmF0aW9uID0gXCJDb250YWluc1wiO1xuXHRcdFx0aWYgKG9WYWx1ZSkge1xuXHRcdFx0XHRjb25zdCBuSW5kZXhPZiA9IG9WYWx1ZS5pbmRleE9mKFwiKlwiKTtcblx0XHRcdFx0Y29uc3Qgbkxhc3RJbmRleCA9IG9WYWx1ZS5sYXN0SW5kZXhPZihcIipcIik7XG5cblx0XHRcdFx0Ly8gb25seSB3aGVuIHRoZXJlIGFyZSAnKicgYXQgYWxsXG5cdFx0XHRcdGlmIChuSW5kZXhPZiA+IC0xKSB7XG5cdFx0XHRcdFx0aWYgKG5JbmRleE9mID09PSAwICYmIG5MYXN0SW5kZXggIT09IG9WYWx1ZS5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdFx0XHRzSW50ZXJuYWxPcGVyYXRpb24gPSBcIkVuZHNXaXRoXCI7XG5cdFx0XHRcdFx0XHRvVmFsdWUgPSBvVmFsdWUuc3Vic3RyaW5nKDEsIG9WYWx1ZS5sZW5ndGgpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAobkluZGV4T2YgIT09IDAgJiYgbkxhc3RJbmRleCA9PT0gb1ZhbHVlLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0XHRcdHNJbnRlcm5hbE9wZXJhdGlvbiA9IFwiU3RhcnRzV2l0aFwiO1xuXHRcdFx0XHRcdFx0b1ZhbHVlID0gb1ZhbHVlLnN1YnN0cmluZygwLCBvVmFsdWUubGVuZ3RoIC0gMSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG9WYWx1ZSA9IG9WYWx1ZS5zdWJzdHJpbmcoMSwgb1ZhbHVlLmxlbmd0aCAtIDEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvKiBUT0RPIEFkZCBkaWFnb25vc3RpY3MgTG9nLndhcm5pbmcoXCJDb250YWlucyBPcHRpb24gY2Fubm90IGJlIHVzZWQgd2l0aG91dCAnKicuXCIpICovXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiRVFcIjpcblx0XHRcdHNJbnRlcm5hbE9wZXJhdGlvbiA9IG9WMSA9PT0gXCJcIiA/IFwiRW1wdHlcIiA6IHNPcHRpb247XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiTkVcIjpcblx0XHRcdHNJbnRlcm5hbE9wZXJhdGlvbiA9IG9WMSA9PT0gXCJcIiA/IFwiTm90RW1wdHlcIiA6IHNPcHRpb247XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiQlRcIjpcblx0XHRcdGlmIChvVjIgPT09IHVuZGVmaW5lZCB8fCBvVjIgPT09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0b1ZhbHVlMiA9IG9WMjtcblx0XHRcdHNJbnRlcm5hbE9wZXJhdGlvbiA9IHNPcHRpb247XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiTEVcIjpcblx0XHRjYXNlIFwiR0VcIjpcblx0XHRjYXNlIFwiR1RcIjpcblx0XHRjYXNlIFwiTFRcIjpcblx0XHRcdHNJbnRlcm5hbE9wZXJhdGlvbiA9IHNPcHRpb247XG5cdFx0XHRicmVhaztcblx0XHRkZWZhdWx0OlxuXHRcdFx0LyogVE9ETyBBZGQgZGlhZ29ub3N0aWNzIExvZy53YXJuaW5nKFwiU2VsZWN0aW9uIE9wdGlvbiBpcyBub3Qgc3VwcG9ydGVkIDogJ1wiICsgc09wdGlvbiArIFwiJ1wiKTsgKi9cblx0XHRcdHJldHVybjtcblx0fVxuXHRpZiAoc1NpZ24gPT09IFwiRVwiKSB7XG5cdFx0c0ludGVybmFsT3BlcmF0aW9uID0gb0V4Y2x1ZGVNYXBbc0ludGVybmFsT3BlcmF0aW9uXTtcblx0fVxuXHRvQ29uZGl0aW9uLm9wZXJhdG9yID0gc0ludGVybmFsT3BlcmF0aW9uO1xuXHRpZiAoc0ludGVybmFsT3BlcmF0aW9uICE9PSBcIkVtcHR5XCIpIHtcblx0XHRvQ29uZGl0aW9uLnZhbHVlcy5wdXNoKG9WYWx1ZSk7XG5cdFx0aWYgKG9WYWx1ZTIpIHtcblx0XHRcdG9Db25kaXRpb24udmFsdWVzLnB1c2gob1ZhbHVlMik7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBvQ29uZGl0aW9uO1xufVxuXG4vKiBNZXRob2QgdG8gZ2V0IHRoZSBvcGVyYXRvciBmcm9tIHRoZSBTZWxlY3Rpb24gT3B0aW9uICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3BlcmF0b3Ioc09wZXJhdG9yOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRyZXR1cm4gc09wZXJhdG9yLmluZGV4T2YoXCIvXCIpID4gMCA/IHNPcGVyYXRvci5zcGxpdChcIi9cIilbMV0gOiBzT3BlcmF0b3I7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWx0ZXJzQ29uZGl0aW9uc0Zyb21TZWxlY3Rpb25WYXJpYW50KFxuXHRlbnRpdHlUeXBlUHJvcGVydGllczogUmVjb3JkPHN0cmluZywgb2JqZWN0Pixcblx0c2VsZWN0aW9uVmFyaWFudDogU2VsZWN0aW9uVmFyaWFudFR5cGVUeXBlcyxcblx0Z2V0Q3VzdG9tQ29uZGl0aW9ucz86IEZ1bmN0aW9uXG4pOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJDb25kaXRpb25zW10+IHtcblx0Y29uc3Qgb2ZpbHRlckNvbmRpdGlvbnM6IFJlY29yZDxzdHJpbmcsIEZpbHRlckNvbmRpdGlvbnNbXT4gPSB7fTtcblx0aWYgKHNlbGVjdGlvblZhcmlhbnQpIHtcblx0XHRjb25zdCBhU2VsZWN0T3B0aW9ucyA9IHNlbGVjdGlvblZhcmlhbnQuU2VsZWN0T3B0aW9ucztcblx0XHRjb25zdCBhUGFyYW1ldGVycyA9IHNlbGVjdGlvblZhcmlhbnQuUGFyYW1ldGVycztcblx0XHRjb25zdCBhVmFsaWRQcm9wZXJ0aWVzID0gZW50aXR5VHlwZVByb3BlcnRpZXM7XG5cdFx0YVNlbGVjdE9wdGlvbnM/LmZvckVhY2goKHNlbGVjdE9wdGlvbjogU2VsZWN0T3B0aW9uVHlwZSkgPT4ge1xuXHRcdFx0Y29uc3QgcHJvcGVydHlOYW1lOiBhbnkgPSBzZWxlY3RPcHRpb24uUHJvcGVydHlOYW1lO1xuXHRcdFx0Y29uc3Qgc1Byb3BlcnR5TmFtZTogc3RyaW5nID0gcHJvcGVydHlOYW1lLnZhbHVlIHx8IHByb3BlcnR5TmFtZS4kUHJvcGVydHlQYXRoO1xuXHRcdFx0Y29uc3QgUmFuZ2VzOiBhbnkgPSBzZWxlY3RPcHRpb24uUmFuZ2VzO1xuXHRcdFx0Zm9yIChjb25zdCBrZXkgaW4gYVZhbGlkUHJvcGVydGllcykge1xuXHRcdFx0XHRpZiAoc1Byb3BlcnR5TmFtZSA9PT0ga2V5KSB7XG5cdFx0XHRcdFx0Y29uc3Qgb1ZhbGlkUHJvcGVydHkgPSBhVmFsaWRQcm9wZXJ0aWVzW2tleV0gYXMgYW55O1xuXHRcdFx0XHRcdGNvbnN0IGFDb25kaXRpb25zOiBhbnlbXSA9IFtdO1xuXHRcdFx0XHRcdFJhbmdlcz8uZm9yRWFjaCgoUmFuZ2U6IGFueSkgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3Qgb0NvbmRpdGlvbiA9IGdldEN1c3RvbUNvbmRpdGlvbnNcblx0XHRcdFx0XHRcdFx0PyBnZXRDdXN0b21Db25kaXRpb25zKFJhbmdlLCBvVmFsaWRQcm9wZXJ0eSwgc1Byb3BlcnR5TmFtZSlcblx0XHRcdFx0XHRcdFx0OiBnZXRDb25kaXRpb25zKFJhbmdlLCBvVmFsaWRQcm9wZXJ0eSk7XG5cdFx0XHRcdFx0XHRhQ29uZGl0aW9ucy5wdXNoKG9Db25kaXRpb24pO1xuXHRcdFx0XHRcdFx0aWYgKGFDb25kaXRpb25zLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRvZmlsdGVyQ29uZGl0aW9uc1tzUHJvcGVydHlOYW1lXSA9IChvZmlsdGVyQ29uZGl0aW9uc1tzUHJvcGVydHlOYW1lXSB8fCBbXSkuY29uY2F0KGFDb25kaXRpb25zKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGFQYXJhbWV0ZXJzPy5mb3JFYWNoKChwYXJhbWV0ZXI6IGFueSkgPT4ge1xuXHRcdFx0Y29uc3Qgc1Byb3BlcnR5UGF0aCA9IHBhcmFtZXRlci5Qcm9wZXJ0eU5hbWUudmFsdWUgfHwgcGFyYW1ldGVyLlByb3BlcnR5TmFtZS4kUHJvcGVydHlQYXRoO1xuXHRcdFx0Y29uc3Qgb0NvbmRpdGlvbjogYW55ID0gZ2V0Q3VzdG9tQ29uZGl0aW9uc1xuXHRcdFx0XHQ/IHsgb3BlcmF0b3I6IFwiRVFcIiwgdmFsdWUxOiBwYXJhbWV0ZXIuUHJvcGVydHlWYWx1ZSwgdmFsdWUyOiBudWxsLCBwYXRoOiBzUHJvcGVydHlQYXRoLCBpc1BhcmFtZXRlcjogdHJ1ZSB9XG5cdFx0XHRcdDoge1xuXHRcdFx0XHRcdFx0b3BlcmF0b3I6IFwiRVFcIixcblx0XHRcdFx0XHRcdHZhbHVlczogW3BhcmFtZXRlci5Qcm9wZXJ0eVZhbHVlXSxcblx0XHRcdFx0XHRcdGlzRW1wdHk6IG51bGwsXG5cdFx0XHRcdFx0XHR2YWxpZGF0ZWQ6IENvbmRpdGlvblZhbGlkYXRlZC5WYWxpZGF0ZWQsXG5cdFx0XHRcdFx0XHRpc1BhcmFtZXRlcjogdHJ1ZVxuXHRcdFx0XHQgIH07XG5cdFx0XHRvZmlsdGVyQ29uZGl0aW9uc1tzUHJvcGVydHlQYXRoXSA9IFtvQ29uZGl0aW9uXTtcblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gb2ZpbHRlckNvbmRpdGlvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25kaXRpb25zKFJhbmdlOiBhbnksIG9WYWxpZFByb3BlcnR5OiBhbnkpIHtcblx0bGV0IG9Db25kaXRpb247XG5cdGNvbnN0IHNpZ246IHN0cmluZyB8IHVuZGVmaW5lZCA9IFJhbmdlLlNpZ247XG5cdGNvbnN0IHNPcHRpb246IHN0cmluZyB8IHVuZGVmaW5lZCA9IFJhbmdlLk9wdGlvbiA/IGdldE9wZXJhdG9yKFJhbmdlLk9wdGlvbikgOiB1bmRlZmluZWQ7XG5cdGNvbnN0IG9WYWx1ZTE6IGFueSA9IGdldFR5cGVDb21wbGlhbnRWYWx1ZShSYW5nZS5Mb3csIG9WYWxpZFByb3BlcnR5LiRUeXBlKTtcblx0Y29uc3Qgb1ZhbHVlMjogYW55ID0gUmFuZ2UuSGlnaCA/IGdldFR5cGVDb21wbGlhbnRWYWx1ZShSYW5nZS5IaWdoLCBvVmFsaWRQcm9wZXJ0eS4kVHlwZSkgOiB1bmRlZmluZWQ7XG5cdGNvbnN0IG9Db25kaXRpb25WYWx1ZXMgPSByZXNvbHZlQ29uZGl0aW9uVmFsdWVzKHNPcHRpb24sIG9WYWx1ZTEsIG9WYWx1ZTIsIHNpZ24pIGFzIGFueTtcblx0aWYgKG9Db25kaXRpb25WYWx1ZXMpIHtcblx0XHRvQ29uZGl0aW9uID0gY3JlYXRlQ29uZGl0aW9uKG9Db25kaXRpb25WYWx1ZXMub3BlcmF0b3IsIG9Db25kaXRpb25WYWx1ZXMudmFsdWVzLCBudWxsLCBudWxsLCBDb25kaXRpb25WYWxpZGF0ZWQuVmFsaWRhdGVkKTtcblx0fVxuXHRyZXR1cm4gb0NvbmRpdGlvbjtcbn1cblxuY29uc3QgZ2V0RGVmYXVsdFZhbHVlRmlsdGVycyA9IGZ1bmN0aW9uKG9Db250ZXh0OiBhbnksIHByb3BlcnRpZXM6IGFueSk6IFJlY29yZDxzdHJpbmcsIEZpbHRlckNvbmRpdGlvbnNbXT4ge1xuXHRjb25zdCBmaWx0ZXJDb25kaXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJDb25kaXRpb25zW10+ID0ge307XG5cdGNvbnN0IGVudGl0eVNldFBhdGggPSBvQ29udGV4dC5nZXRJbnRlcmZhY2UoMSkuZ2V0UGF0aCgpLFxuXHRcdG9NZXRhTW9kZWwgPSBvQ29udGV4dC5nZXRJbnRlcmZhY2UoMSkuZ2V0TW9kZWwoKTtcblx0aWYgKHByb3BlcnRpZXMpIHtcblx0XHRmb3IgKGNvbnN0IGtleSBpbiBwcm9wZXJ0aWVzKSB7XG5cdFx0XHRjb25zdCBkZWZhdWx0RmlsdGVyVmFsdWUgPSBvTWV0YU1vZGVsLmdldE9iamVjdChcblx0XHRcdFx0ZW50aXR5U2V0UGF0aCArIFwiL1wiICsga2V5ICsgXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkZpbHRlckRlZmF1bHRWYWx1ZVwiXG5cdFx0XHQpO1xuXHRcdFx0aWYgKGRlZmF1bHRGaWx0ZXJWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGNvbnN0IFByb3BlcnR5TmFtZSA9IGtleTtcblx0XHRcdFx0ZmlsdGVyQ29uZGl0aW9uc1tQcm9wZXJ0eU5hbWVdID0gW1xuXHRcdFx0XHRcdGNyZWF0ZUNvbmRpdGlvbihcIkVRXCIsIFtkZWZhdWx0RmlsdGVyVmFsdWVdLCBudWxsLCBudWxsLCBDb25kaXRpb25WYWxpZGF0ZWQuVmFsaWRhdGVkKSBhcyBGaWx0ZXJDb25kaXRpb25zXG5cdFx0XHRcdF07XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBmaWx0ZXJDb25kaXRpb25zO1xufTtcblxuY29uc3QgZ2V0RGVmYXVsdFNlbWFudGljRGF0ZUZpbHRlcnMgPSBmdW5jdGlvbihcblx0b0NvbnRleHQ6IGFueSxcblx0cHJvcGVydGllczogYW55LFxuXHRkZWZhdWx0U2VtYW50aWNEYXRlczogYW55XG4pOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJDb25kaXRpb25zW10+IHtcblx0Y29uc3QgZmlsdGVyQ29uZGl0aW9uczogUmVjb3JkPHN0cmluZywgRmlsdGVyQ29uZGl0aW9uc1tdPiA9IHt9O1xuXHRpZiAocHJvcGVydGllcykge1xuXHRcdGZvciAoY29uc3Qga2V5IGluIHByb3BlcnRpZXMpIHtcblx0XHRcdC8vIGN1cnJlbnRseSBkZWZhdWx0U2VtYW50aWNEYXRlcyBjYW4gc3VwcG9ydCBvbmx5IG9uZSBlbnRyeSwgd2UgcGljayB0aGUgZmlyc3Qgb25lIGRpcmVjdGx5IHVzaW5nIDAgaW5kZXhcblx0XHRcdGlmIChkZWZhdWx0U2VtYW50aWNEYXRlc1trZXldICYmIGRlZmF1bHRTZW1hbnRpY0RhdGVzW2tleV1bMF0pIHtcblx0XHRcdFx0ZmlsdGVyQ29uZGl0aW9uc1trZXldID0gW2NyZWF0ZUNvbmRpdGlvbihkZWZhdWx0U2VtYW50aWNEYXRlc1trZXldWzBdLm9wZXJhdG9yLCBbXSwgbnVsbCwgbnVsbCwgbnVsbCkgYXMgRmlsdGVyQ29uZGl0aW9uc107XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBmaWx0ZXJDb25kaXRpb25zO1xufTtcblxuZnVuY3Rpb24gZ2V0RWRpdFN0YXR1c0ZpbHRlcigpOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJDb25kaXRpb25zW10+IHtcblx0Y29uc3Qgb2ZpbHRlckNvbmRpdGlvbnM6IFJlY29yZDxzdHJpbmcsIEZpbHRlckNvbmRpdGlvbnNbXT4gPSB7fTtcblx0b2ZpbHRlckNvbmRpdGlvbnNbXCIkZWRpdFN0YXRlXCJdID0gW1xuXHRcdGNyZWF0ZUNvbmRpdGlvbihcIkRSQUZUX0VESVRfU1RBVEVcIiwgW1wiQUxMXCJdLCBudWxsLCBudWxsLCBDb25kaXRpb25WYWxpZGF0ZWQuVmFsaWRhdGVkKSBhcyBGaWx0ZXJDb25kaXRpb25zXG5cdF07XG5cdHJldHVybiBvZmlsdGVyQ29uZGl0aW9ucztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZpbHRlckNvbmRpdGlvbnMob0NvbnRleHQ6IGFueSwgZmlsdGVyQ29uZGl0aW9uczogYW55KTogUmVjb3JkPHN0cmluZywgRmlsdGVyQ29uZGl0aW9uc1tdPiB7XG5cdGxldCBlZGl0U3RhdGVGaWx0ZXI7XG5cdGNvbnN0IGVudGl0eVNldFBhdGggPSBvQ29udGV4dC5nZXRJbnRlcmZhY2UoMSkuZ2V0UGF0aCgpLFxuXHRcdG9NZXRhTW9kZWwgPSBvQ29udGV4dC5nZXRJbnRlcmZhY2UoMSkuZ2V0TW9kZWwoKSxcblx0XHRlbnRpdHlUeXBlQW5ub3RhdGlvbnMgPSBvTWV0YU1vZGVsLmdldE9iamVjdChlbnRpdHlTZXRQYXRoICsgXCJAXCIpLFxuXHRcdGVudGl0eVR5cGVQcm9wZXJ0aWVzID0gb01ldGFNb2RlbC5nZXRPYmplY3QoZW50aXR5U2V0UGF0aCArIFwiL1wiKTtcblx0aWYgKFxuXHRcdGVudGl0eVR5cGVBbm5vdGF0aW9uc1tcIkBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRHJhZnRSb290XCJdIHx8XG5cdFx0ZW50aXR5VHlwZUFubm90YXRpb25zW1wiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5EcmFmdE5vZGVcIl1cblx0KSB7XG5cdFx0ZWRpdFN0YXRlRmlsdGVyID0gZ2V0RWRpdFN0YXR1c0ZpbHRlcigpO1xuXHR9XG5cdGNvbnN0IHNlbGVjdGlvblZhcmlhbnQgPSBmaWx0ZXJDb25kaXRpb25zPy5zZWxlY3Rpb25WYXJpYW50O1xuXHRjb25zdCBkZWZhdWx0U2VtYW50aWNEYXRlcyA9IGZpbHRlckNvbmRpdGlvbnM/LmRlZmF1bHRTZW1hbnRpY0RhdGVzIHx8IHt9O1xuXHRjb25zdCBkZWZhdWx0RmlsdGVycyA9IGdldERlZmF1bHRWYWx1ZUZpbHRlcnMob0NvbnRleHQsIGVudGl0eVR5cGVQcm9wZXJ0aWVzKTtcblx0Y29uc3QgZGVmYXVsdFNlbWFudGljRGF0ZUZpbHRlcnMgPSBnZXREZWZhdWx0U2VtYW50aWNEYXRlRmlsdGVycyhvQ29udGV4dCwgZW50aXR5VHlwZVByb3BlcnRpZXMsIGRlZmF1bHRTZW1hbnRpY0RhdGVzKTtcblx0aWYgKHNlbGVjdGlvblZhcmlhbnQpIHtcblx0XHRmaWx0ZXJDb25kaXRpb25zID0gZ2V0RmlsdGVyc0NvbmRpdGlvbnNGcm9tU2VsZWN0aW9uVmFyaWFudChlbnRpdHlUeXBlUHJvcGVydGllcywgc2VsZWN0aW9uVmFyaWFudCk7XG5cdH0gZWxzZSBpZiAoZGVmYXVsdEZpbHRlcnMpIHtcblx0XHRmaWx0ZXJDb25kaXRpb25zID0gZGVmYXVsdEZpbHRlcnM7XG5cdH1cblx0aWYgKGRlZmF1bHRTZW1hbnRpY0RhdGVGaWx0ZXJzKSB7XG5cdFx0Ly8gb25seSBmb3Igc2VtYW50aWMgZGF0ZTpcblx0XHQvLyAxLiB2YWx1ZSBmcm9tIG1hbmlmZXN0IGdldCBtZXJnZWQgd2l0aCBTVlxuXHRcdC8vIDIuIG1hbmlmZXN0IHZhbHVlIGlzIGdpdmVuIHByZWZlcmVuY2Ugd2hlbiB0aGVyZSBpcyBzYW1lIHNlbWFudGljIGRhdGUgcHJvcGVydHkgaW4gU1YgYW5kIG1hbmlmZXN0XG5cdFx0ZmlsdGVyQ29uZGl0aW9ucyA9IHsgLi4uZmlsdGVyQ29uZGl0aW9ucywgLi4uZGVmYXVsdFNlbWFudGljRGF0ZUZpbHRlcnMgfTtcblx0fVxuXHRpZiAoZWRpdFN0YXRlRmlsdGVyKSB7XG5cdFx0ZmlsdGVyQ29uZGl0aW9ucyA9IHsgLi4uZmlsdGVyQ29uZGl0aW9ucywgLi4uZWRpdFN0YXRlRmlsdGVyIH07XG5cdH1cblx0cmV0dXJuIChPYmplY3Qua2V5cyhmaWx0ZXJDb25kaXRpb25zKS5sZW5ndGggPiAwID8gSlNPTi5zdHJpbmdpZnkoZmlsdGVyQ29uZGl0aW9ucykgOiB1bmRlZmluZWQpIGFzIGFueTtcbn1cblxuZ2V0RmlsdGVyQ29uZGl0aW9ucy5yZXF1aXJlc0lDb250ZXh0ID0gdHJ1ZTtcbiJdfQ==