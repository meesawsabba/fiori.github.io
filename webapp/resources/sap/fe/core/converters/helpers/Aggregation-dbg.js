/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * helper class for Aggregation annotations.
   */
  var AggregationHelper = /*#__PURE__*/function () {
    /**
     * Creates a helper for a specific entity type and a converter context.
     *
     * @param entityType The EntityType
     * @param converterContext The ConverterContext
     */
    function AggregationHelper(entityType, converterContext) {
      var _this$_oAggregationAn, _this$_oAggregationAn4, _this$_oAggregationAn7, _this$oTargetAggregat;

      _classCallCheck(this, AggregationHelper);

      this._entityType = entityType;
      this._converterContext = converterContext;
      this._oAggregationAnnotationTarget = this._determineAggregationAnnotationTarget();

      if (((_this$_oAggregationAn = this._oAggregationAnnotationTarget) === null || _this$_oAggregationAn === void 0 ? void 0 : _this$_oAggregationAn._type) === "NavigationProperty") {
        var _this$_oAggregationAn2, _this$_oAggregationAn3;

        this.oTargetAggregationAnnotations = (_this$_oAggregationAn2 = this._oAggregationAnnotationTarget) === null || _this$_oAggregationAn2 === void 0 ? void 0 : (_this$_oAggregationAn3 = _this$_oAggregationAn2.annotations) === null || _this$_oAggregationAn3 === void 0 ? void 0 : _this$_oAggregationAn3.Aggregation;
      } else if (((_this$_oAggregationAn4 = this._oAggregationAnnotationTarget) === null || _this$_oAggregationAn4 === void 0 ? void 0 : _this$_oAggregationAn4._type) === "EntityType") {
        var _this$_oAggregationAn5, _this$_oAggregationAn6;

        this.oTargetAggregationAnnotations = (_this$_oAggregationAn5 = this._oAggregationAnnotationTarget) === null || _this$_oAggregationAn5 === void 0 ? void 0 : (_this$_oAggregationAn6 = _this$_oAggregationAn5.annotations) === null || _this$_oAggregationAn6 === void 0 ? void 0 : _this$_oAggregationAn6.Aggregation;
      } else if (((_this$_oAggregationAn7 = this._oAggregationAnnotationTarget) === null || _this$_oAggregationAn7 === void 0 ? void 0 : _this$_oAggregationAn7._type) === "EntitySet") {
        var _this$_oAggregationAn8, _this$_oAggregationAn9;

        this.oTargetAggregationAnnotations = (_this$_oAggregationAn8 = this._oAggregationAnnotationTarget) === null || _this$_oAggregationAn8 === void 0 ? void 0 : (_this$_oAggregationAn9 = _this$_oAggregationAn8.annotations) === null || _this$_oAggregationAn9 === void 0 ? void 0 : _this$_oAggregationAn9.Aggregation;
      }

      this._bApplySupported = (_this$oTargetAggregat = this.oTargetAggregationAnnotations) !== null && _this$oTargetAggregat !== void 0 && _this$oTargetAggregat.ApplySupported ? true : false;

      if (this._bApplySupported) {
        var _this$oTargetAggregat2, _this$oTargetAggregat3, _this$oTargetAggregat4, _this$oTargetAggregat5;

        this._aGroupableProperties = (_this$oTargetAggregat2 = this.oTargetAggregationAnnotations) === null || _this$oTargetAggregat2 === void 0 ? void 0 : (_this$oTargetAggregat3 = _this$oTargetAggregat2.ApplySupported) === null || _this$oTargetAggregat3 === void 0 ? void 0 : _this$oTargetAggregat3.GroupableProperties;
        this._aAggregatableProperties = (_this$oTargetAggregat4 = this.oTargetAggregationAnnotations) === null || _this$oTargetAggregat4 === void 0 ? void 0 : (_this$oTargetAggregat5 = _this$oTargetAggregat4.ApplySupported) === null || _this$oTargetAggregat5 === void 0 ? void 0 : _this$oTargetAggregat5.AggregatableProperties;
      }
    }
    /**
     * Determine the most appropriate target for the aggregation annotations.
     *
     * @returns  EntityType | EntitySet | NavigationProperty where aggregation annotations should be found.
     */


    _exports.AggregationHelper = AggregationHelper;

    _createClass(AggregationHelper, [{
      key: "_determineAggregationAnnotationTarget",
      value: function _determineAggregationAnnotationTarget() {
        var _this$_converterConte, _this$_converterConte2, _this$_converterConte3, _this$_converterConte4, _this$_converterConte5;

        var bIsParameterized = (_this$_converterConte = this._converterContext.getDataModelObjectPath()) !== null && _this$_converterConte !== void 0 && (_this$_converterConte2 = _this$_converterConte.targetEntitySet) !== null && _this$_converterConte2 !== void 0 && (_this$_converterConte3 = _this$_converterConte2.entityType) !== null && _this$_converterConte3 !== void 0 && (_this$_converterConte4 = _this$_converterConte3.annotations) !== null && _this$_converterConte4 !== void 0 && (_this$_converterConte5 = _this$_converterConte4.Common) !== null && _this$_converterConte5 !== void 0 && _this$_converterConte5.ResultContext ? true : false;
        var oAggregationAnnotationSource; // find ApplySupported

        if (bIsParameterized) {
          var _oNavigationPropertyO, _oNavigationPropertyO2, _oEntityTypeObject$an, _oEntityTypeObject$an2;

          // if this is a parameterized view then applysupported can be found at either the navProp pointing to the result set or entityType.
          // If applySupported is present at both the navProp and the entityType then navProp is more specific so take annotations from there
          // targetObject in the converter context for a parameterized view is the navigation property pointing to th result set
          var oDataModelObjectPath = this._converterContext.getDataModelObjectPath();

          var oNavigationPropertyObject = oDataModelObjectPath === null || oDataModelObjectPath === void 0 ? void 0 : oDataModelObjectPath.targetObject;
          var oEntityTypeObject = oDataModelObjectPath === null || oDataModelObjectPath === void 0 ? void 0 : oDataModelObjectPath.targetEntityType;

          if (oNavigationPropertyObject !== null && oNavigationPropertyObject !== void 0 && (_oNavigationPropertyO = oNavigationPropertyObject.annotations) !== null && _oNavigationPropertyO !== void 0 && (_oNavigationPropertyO2 = _oNavigationPropertyO.Aggregation) !== null && _oNavigationPropertyO2 !== void 0 && _oNavigationPropertyO2.ApplySupported) {
            oAggregationAnnotationSource = oNavigationPropertyObject;
          } else if (oEntityTypeObject !== null && oEntityTypeObject !== void 0 && (_oEntityTypeObject$an = oEntityTypeObject.annotations) !== null && _oEntityTypeObject$an !== void 0 && (_oEntityTypeObject$an2 = _oEntityTypeObject$an.Aggregation) !== null && _oEntityTypeObject$an2 !== void 0 && _oEntityTypeObject$an2.ApplySupported) {
            oAggregationAnnotationSource = oEntityTypeObject;
          }
        } else {
          // For the time being, we ignore annotations at the container level, until the vocabulary is stabilized
          oAggregationAnnotationSource = this._converterContext.getEntitySet();
        }

        return oAggregationAnnotationSource;
      }
      /**
       * Checks if the entity supports analytical queries.
       *
       * @returns `true` if analytical queries are supported, false otherwise.
       */

    }, {
      key: "isAnalyticsSupported",
      value: function isAnalyticsSupported() {
        return this._bApplySupported;
      }
      /**
       * Checks if a property is groupable.
       *
       * @param property The property to check
       * @returns `undefined` if the entity doesn't support analytical queries, true or false otherwise
       */

    }, {
      key: "isPropertyGroupable",
      value: function isPropertyGroupable(property) {
        if (!this._bApplySupported) {
          return undefined;
        } else if (!this._aGroupableProperties || this._aGroupableProperties.length === 0) {
          // No groupableProperties --> all properties are groupable
          return true;
        } else {
          return this._aGroupableProperties.findIndex(function (path) {
            return path.$target.fullyQualifiedName === property.fullyQualifiedName;
          }) >= 0;
        }
      }
      /**
       * Checks if a property is aggregatable.
       *
       * @param property The property to check
       * @returns `undefined` if the entity doesn't support analytical queries, true or false otherwise
       */

    }, {
      key: "isPropertyAggregatable",
      value: function isPropertyAggregatable(property) {
        if (!this._bApplySupported) {
          return undefined;
        } else {
          // Get the custom aggregates
          var aCustomAggregateAnnotations = this._converterContext.getAnnotationsByTerm("Aggregation", "Org.OData.Aggregation.V1.CustomAggregate", [this._oAggregationAnnotationTarget]); // Check if a custom aggregate has a qualifier that corresponds to the property name


          return aCustomAggregateAnnotations.some(function (annotation) {
            return property.name === annotation.qualifier;
          });
        }
      }
    }, {
      key: "getGroupableProperties",
      value: function getGroupableProperties() {
        return this._aGroupableProperties;
      }
    }, {
      key: "getAggregatableProperties",
      value: function getAggregatableProperties() {
        return this._aAggregatableProperties;
      }
    }, {
      key: "getTransAggregations",
      value: function getTransAggregations() {
        var aTransAggregationAnnotations = this._converterContext.getAnnotationsByTerm("Analytics", "com.sap.vocabularies.Analytics.v1.AggregatedProperties", [this._converterContext.getEntityContainer(), this._converterContext.getEntityType()]);

        return aTransAggregationAnnotations;
      }
      /**
       * Returns the list of custom aggregate definitions for the entity type.
       *
       * @returns A map (propertyName --> array of context-defining property names) for each custom aggregate corresponding to a property. The array of
       * context-defining property names is empty if the custom aggregate doesn't have any context-defining property.
       */

    }, {
      key: "getCustomAggregateDefinitions",
      value: function getCustomAggregateDefinitions() {
        // Get the custom aggregates
        var aCustomAggregateAnnotations = this._converterContext.getAnnotationsByTerm("Aggregation", "Org.OData.Aggregation.V1.CustomAggregate", [this._oAggregationAnnotationTarget]);

        return aCustomAggregateAnnotations;
      }
    }]);

    return AggregationHelper;
  }();

  _exports.AggregationHelper = AggregationHelper;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFnZ3JlZ2F0aW9uLnRzIl0sIm5hbWVzIjpbIkFnZ3JlZ2F0aW9uSGVscGVyIiwiZW50aXR5VHlwZSIsImNvbnZlcnRlckNvbnRleHQiLCJfZW50aXR5VHlwZSIsIl9jb252ZXJ0ZXJDb250ZXh0IiwiX29BZ2dyZWdhdGlvbkFubm90YXRpb25UYXJnZXQiLCJfZGV0ZXJtaW5lQWdncmVnYXRpb25Bbm5vdGF0aW9uVGFyZ2V0IiwiX3R5cGUiLCJvVGFyZ2V0QWdncmVnYXRpb25Bbm5vdGF0aW9ucyIsImFubm90YXRpb25zIiwiQWdncmVnYXRpb24iLCJfYkFwcGx5U3VwcG9ydGVkIiwiQXBwbHlTdXBwb3J0ZWQiLCJfYUdyb3VwYWJsZVByb3BlcnRpZXMiLCJHcm91cGFibGVQcm9wZXJ0aWVzIiwiX2FBZ2dyZWdhdGFibGVQcm9wZXJ0aWVzIiwiQWdncmVnYXRhYmxlUHJvcGVydGllcyIsImJJc1BhcmFtZXRlcml6ZWQiLCJnZXREYXRhTW9kZWxPYmplY3RQYXRoIiwidGFyZ2V0RW50aXR5U2V0IiwiQ29tbW9uIiwiUmVzdWx0Q29udGV4dCIsIm9BZ2dyZWdhdGlvbkFubm90YXRpb25Tb3VyY2UiLCJvRGF0YU1vZGVsT2JqZWN0UGF0aCIsIm9OYXZpZ2F0aW9uUHJvcGVydHlPYmplY3QiLCJ0YXJnZXRPYmplY3QiLCJvRW50aXR5VHlwZU9iamVjdCIsInRhcmdldEVudGl0eVR5cGUiLCJnZXRFbnRpdHlTZXQiLCJwcm9wZXJ0eSIsInVuZGVmaW5lZCIsImxlbmd0aCIsImZpbmRJbmRleCIsInBhdGgiLCIkdGFyZ2V0IiwiZnVsbHlRdWFsaWZpZWROYW1lIiwiYUN1c3RvbUFnZ3JlZ2F0ZUFubm90YXRpb25zIiwiZ2V0QW5ub3RhdGlvbnNCeVRlcm0iLCJzb21lIiwiYW5ub3RhdGlvbiIsIm5hbWUiLCJxdWFsaWZpZXIiLCJhVHJhbnNBZ2dyZWdhdGlvbkFubm90YXRpb25zIiwiZ2V0RW50aXR5Q29udGFpbmVyIiwiZ2V0RW50aXR5VHlwZSJdLCJtYXBwaW5n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RCxxQ0FBbUM7QUFDbEMsZUFBTyxLQUFLRSx3QkFBWjtBQUNBOzs7YUFFRCxnQ0FBOEI7QUFDN0IsWUFBTTJCLDRCQUE0QixHQUFHLEtBQUt0QyxpQkFBTCxDQUF1QmlDLG9CQUF2QixDQUNwQyxXQURvQyxFQUVwQyx3REFGb0MsRUFHcEMsQ0FBQyxLQUFLakMsaUJBQUwsQ0FBdUJ1QyxrQkFBdkIsRUFBRCxFQUE4QyxLQUFLdkMsaUJBQUwsQ0FBdUJ3QyxhQUF2QixFQUE5QyxDQUhvQyxDQUFyQzs7QUFLQSxlQUFPRiw0QkFBUDtBQUNBO0FBQ0Q7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O2FBQ0MseUNBQXVDO0FBQ3RDO0FBQ0EsWUFBTU4sMkJBQThELEdBQUcsS0FBS2hDLGlCQUFMLENBQXVCaUMsb0JBQXZCLENBQ3RFLGFBRHNFLDhDQUd0RSxDQUFDLEtBQUtoQyw2QkFBTixDQUhzRSxDQUF2RTs7QUFNQSxlQUFPK0IsMkJBQVA7QUFDQSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRW50aXR5VHlwZSwgUHJvcGVydHksIEVudGl0eVNldCwgTmF2aWdhdGlvblByb3BlcnR5IH0gZnJvbSBcIkBzYXAtdXgvYW5ub3RhdGlvbi1jb252ZXJ0ZXJcIjtcbmltcG9ydCB7IEFubm90YXRpb25UZXJtIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5pbXBvcnQgeyBBZ2dyZWdhdGlvbkFubm90YXRpb25UZXJtcywgQ3VzdG9tQWdncmVnYXRlIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL2Rpc3QvZ2VuZXJhdGVkL0FnZ3JlZ2F0aW9uXCI7XG5pbXBvcnQgeyBQcm9wZXJ0eVBhdGggfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvZGlzdC9FZG1cIjtcbmltcG9ydCBDb252ZXJ0ZXJDb250ZXh0IGZyb20gXCIuLi9Db252ZXJ0ZXJDb250ZXh0XCI7XG5pbXBvcnQge1xuXHRDb2xsZWN0aW9uQW5ub3RhdGlvbnNfQWdncmVnYXRpb24sXG5cdEVudGl0eVR5cGVBbm5vdGF0aW9uc19BZ2dyZWdhdGlvbixcblx0RW50aXR5U2V0QW5ub3RhdGlvbnNfQWdncmVnYXRpb25cbn0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3R5cGVzL2dlbmVyYXRlZC9BZ2dyZWdhdGlvbl9FZG1cIjtcblxuLyoqXG4gKiBoZWxwZXIgY2xhc3MgZm9yIEFnZ3JlZ2F0aW9uIGFubm90YXRpb25zLlxuICovXG5leHBvcnQgY2xhc3MgQWdncmVnYXRpb25IZWxwZXIge1xuXHRfZW50aXR5VHlwZTogRW50aXR5VHlwZTtcblx0X2NvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQ7XG5cdF9iQXBwbHlTdXBwb3J0ZWQ6IGJvb2xlYW47XG5cdF9hR3JvdXBhYmxlUHJvcGVydGllcz86IFByb3BlcnR5UGF0aFtdO1xuXHRfYUFnZ3JlZ2F0YWJsZVByb3BlcnRpZXM/O1xuXHRfb0FnZ3JlZ2F0aW9uQW5ub3RhdGlvblRhcmdldDogRW50aXR5VHlwZSB8IEVudGl0eVNldCB8IE5hdmlnYXRpb25Qcm9wZXJ0eTtcblx0b1RhcmdldEFnZ3JlZ2F0aW9uQW5ub3RhdGlvbnM6IGFueTtcblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBoZWxwZXIgZm9yIGEgc3BlY2lmaWMgZW50aXR5IHR5cGUgYW5kIGEgY29udmVydGVyIGNvbnRleHQuXG5cdCAqXG5cdCAqIEBwYXJhbSBlbnRpdHlUeXBlIFRoZSBFbnRpdHlUeXBlXG5cdCAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBDb252ZXJ0ZXJDb250ZXh0XG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihlbnRpdHlUeXBlOiBFbnRpdHlUeXBlLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KSB7XG5cdFx0dGhpcy5fZW50aXR5VHlwZSA9IGVudGl0eVR5cGU7XG5cdFx0dGhpcy5fY29udmVydGVyQ29udGV4dCA9IGNvbnZlcnRlckNvbnRleHQ7XG5cblx0XHR0aGlzLl9vQWdncmVnYXRpb25Bbm5vdGF0aW9uVGFyZ2V0ID0gdGhpcy5fZGV0ZXJtaW5lQWdncmVnYXRpb25Bbm5vdGF0aW9uVGFyZ2V0KCk7XG5cdFx0aWYgKHRoaXMuX29BZ2dyZWdhdGlvbkFubm90YXRpb25UYXJnZXQ/Ll90eXBlID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiKSB7XG5cdFx0XHR0aGlzLm9UYXJnZXRBZ2dyZWdhdGlvbkFubm90YXRpb25zID0gdGhpcy5fb0FnZ3JlZ2F0aW9uQW5ub3RhdGlvblRhcmdldD8uYW5ub3RhdGlvbnNcblx0XHRcdFx0Py5BZ2dyZWdhdGlvbiBhcyBDb2xsZWN0aW9uQW5ub3RhdGlvbnNfQWdncmVnYXRpb247XG5cdFx0fSBlbHNlIGlmICh0aGlzLl9vQWdncmVnYXRpb25Bbm5vdGF0aW9uVGFyZ2V0Py5fdHlwZSA9PT0gXCJFbnRpdHlUeXBlXCIpIHtcblx0XHRcdHRoaXMub1RhcmdldEFnZ3JlZ2F0aW9uQW5ub3RhdGlvbnMgPSB0aGlzLl9vQWdncmVnYXRpb25Bbm5vdGF0aW9uVGFyZ2V0Py5hbm5vdGF0aW9uc1xuXHRcdFx0XHQ/LkFnZ3JlZ2F0aW9uIGFzIEVudGl0eVR5cGVBbm5vdGF0aW9uc19BZ2dyZWdhdGlvbjtcblx0XHR9IGVsc2UgaWYgKHRoaXMuX29BZ2dyZWdhdGlvbkFubm90YXRpb25UYXJnZXQ/Ll90eXBlID09PSBcIkVudGl0eVNldFwiKSB7XG5cdFx0XHR0aGlzLm9UYXJnZXRBZ2dyZWdhdGlvbkFubm90YXRpb25zID0gdGhpcy5fb0FnZ3JlZ2F0aW9uQW5ub3RhdGlvblRhcmdldD8uYW5ub3RhdGlvbnNcblx0XHRcdFx0Py5BZ2dyZWdhdGlvbiBhcyBFbnRpdHlTZXRBbm5vdGF0aW9uc19BZ2dyZWdhdGlvbjtcblx0XHR9XG5cdFx0dGhpcy5fYkFwcGx5U3VwcG9ydGVkID0gdGhpcy5vVGFyZ2V0QWdncmVnYXRpb25Bbm5vdGF0aW9ucz8uQXBwbHlTdXBwb3J0ZWQgPyB0cnVlIDogZmFsc2U7XG5cblx0XHRpZiAodGhpcy5fYkFwcGx5U3VwcG9ydGVkKSB7XG5cdFx0XHR0aGlzLl9hR3JvdXBhYmxlUHJvcGVydGllcyA9IHRoaXMub1RhcmdldEFnZ3JlZ2F0aW9uQW5ub3RhdGlvbnM/LkFwcGx5U3VwcG9ydGVkPy5Hcm91cGFibGVQcm9wZXJ0aWVzIGFzIFByb3BlcnR5UGF0aFtdO1xuXHRcdFx0dGhpcy5fYUFnZ3JlZ2F0YWJsZVByb3BlcnRpZXMgPSB0aGlzLm9UYXJnZXRBZ2dyZWdhdGlvbkFubm90YXRpb25zPy5BcHBseVN1cHBvcnRlZD8uQWdncmVnYXRhYmxlUHJvcGVydGllcztcblx0XHR9XG5cdH1cblx0LyoqXG5cdCAqIERldGVybWluZSB0aGUgbW9zdCBhcHByb3ByaWF0ZSB0YXJnZXQgZm9yIHRoZSBhZ2dyZWdhdGlvbiBhbm5vdGF0aW9ucy5cblx0ICpcblx0ICogQHJldHVybnMgIEVudGl0eVR5cGUgfCBFbnRpdHlTZXQgfCBOYXZpZ2F0aW9uUHJvcGVydHkgd2hlcmUgYWdncmVnYXRpb24gYW5ub3RhdGlvbnMgc2hvdWxkIGJlIGZvdW5kLlxuXHQgKi9cblx0cHJpdmF0ZSBfZGV0ZXJtaW5lQWdncmVnYXRpb25Bbm5vdGF0aW9uVGFyZ2V0KCk6IEVudGl0eVR5cGUgfCBFbnRpdHlTZXQgfCBOYXZpZ2F0aW9uUHJvcGVydHkge1xuXHRcdGNvbnN0IGJJc1BhcmFtZXRlcml6ZWQgPSB0aGlzLl9jb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKT8udGFyZ2V0RW50aXR5U2V0Py5lbnRpdHlUeXBlPy5hbm5vdGF0aW9ucz8uQ29tbW9uXG5cdFx0XHQ/LlJlc3VsdENvbnRleHRcblx0XHRcdD8gdHJ1ZVxuXHRcdFx0OiBmYWxzZTtcblx0XHRsZXQgb0FnZ3JlZ2F0aW9uQW5ub3RhdGlvblNvdXJjZTtcblxuXHRcdC8vIGZpbmQgQXBwbHlTdXBwb3J0ZWRcblx0XHRpZiAoYklzUGFyYW1ldGVyaXplZCkge1xuXHRcdFx0Ly8gaWYgdGhpcyBpcyBhIHBhcmFtZXRlcml6ZWQgdmlldyB0aGVuIGFwcGx5c3VwcG9ydGVkIGNhbiBiZSBmb3VuZCBhdCBlaXRoZXIgdGhlIG5hdlByb3AgcG9pbnRpbmcgdG8gdGhlIHJlc3VsdCBzZXQgb3IgZW50aXR5VHlwZS5cblx0XHRcdC8vIElmIGFwcGx5U3VwcG9ydGVkIGlzIHByZXNlbnQgYXQgYm90aCB0aGUgbmF2UHJvcCBhbmQgdGhlIGVudGl0eVR5cGUgdGhlbiBuYXZQcm9wIGlzIG1vcmUgc3BlY2lmaWMgc28gdGFrZSBhbm5vdGF0aW9ucyBmcm9tIHRoZXJlXG5cdFx0XHQvLyB0YXJnZXRPYmplY3QgaW4gdGhlIGNvbnZlcnRlciBjb250ZXh0IGZvciBhIHBhcmFtZXRlcml6ZWQgdmlldyBpcyB0aGUgbmF2aWdhdGlvbiBwcm9wZXJ0eSBwb2ludGluZyB0byB0aCByZXN1bHQgc2V0XG5cdFx0XHRjb25zdCBvRGF0YU1vZGVsT2JqZWN0UGF0aCA9IHRoaXMuX2NvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpO1xuXHRcdFx0Y29uc3Qgb05hdmlnYXRpb25Qcm9wZXJ0eU9iamVjdCA9IG9EYXRhTW9kZWxPYmplY3RQYXRoPy50YXJnZXRPYmplY3Q7XG5cdFx0XHRjb25zdCBvRW50aXR5VHlwZU9iamVjdCA9IG9EYXRhTW9kZWxPYmplY3RQYXRoPy50YXJnZXRFbnRpdHlUeXBlO1xuXHRcdFx0aWYgKG9OYXZpZ2F0aW9uUHJvcGVydHlPYmplY3Q/LmFubm90YXRpb25zPy5BZ2dyZWdhdGlvbj8uQXBwbHlTdXBwb3J0ZWQpIHtcblx0XHRcdFx0b0FnZ3JlZ2F0aW9uQW5ub3RhdGlvblNvdXJjZSA9IG9OYXZpZ2F0aW9uUHJvcGVydHlPYmplY3Q7XG5cdFx0XHR9IGVsc2UgaWYgKG9FbnRpdHlUeXBlT2JqZWN0Py5hbm5vdGF0aW9ucz8uQWdncmVnYXRpb24/LkFwcGx5U3VwcG9ydGVkKSB7XG5cdFx0XHRcdG9BZ2dyZWdhdGlvbkFubm90YXRpb25Tb3VyY2UgPSBvRW50aXR5VHlwZU9iamVjdDtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gRm9yIHRoZSB0aW1lIGJlaW5nLCB3ZSBpZ25vcmUgYW5ub3RhdGlvbnMgYXQgdGhlIGNvbnRhaW5lciBsZXZlbCwgdW50aWwgdGhlIHZvY2FidWxhcnkgaXMgc3RhYmlsaXplZFxuXHRcdFx0b0FnZ3JlZ2F0aW9uQW5ub3RhdGlvblNvdXJjZSA9IHRoaXMuX2NvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCk7XG5cdFx0fVxuXHRcdHJldHVybiBvQWdncmVnYXRpb25Bbm5vdGF0aW9uU291cmNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgZW50aXR5IHN1cHBvcnRzIGFuYWx5dGljYWwgcXVlcmllcy5cblx0ICpcblx0ICogQHJldHVybnMgYHRydWVgIGlmIGFuYWx5dGljYWwgcXVlcmllcyBhcmUgc3VwcG9ydGVkLCBmYWxzZSBvdGhlcndpc2UuXG5cdCAqL1xuXHRwdWJsaWMgaXNBbmFseXRpY3NTdXBwb3J0ZWQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuX2JBcHBseVN1cHBvcnRlZDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgYSBwcm9wZXJ0eSBpcyBncm91cGFibGUuXG5cdCAqXG5cdCAqIEBwYXJhbSBwcm9wZXJ0eSBUaGUgcHJvcGVydHkgdG8gY2hlY2tcblx0ICogQHJldHVybnMgYHVuZGVmaW5lZGAgaWYgdGhlIGVudGl0eSBkb2Vzbid0IHN1cHBvcnQgYW5hbHl0aWNhbCBxdWVyaWVzLCB0cnVlIG9yIGZhbHNlIG90aGVyd2lzZVxuXHQgKi9cblx0cHVibGljIGlzUHJvcGVydHlHcm91cGFibGUocHJvcGVydHk6IFByb3BlcnR5KTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XG5cdFx0aWYgKCF0aGlzLl9iQXBwbHlTdXBwb3J0ZWQpIHtcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fSBlbHNlIGlmICghdGhpcy5fYUdyb3VwYWJsZVByb3BlcnRpZXMgfHwgdGhpcy5fYUdyb3VwYWJsZVByb3BlcnRpZXMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHQvLyBObyBncm91cGFibGVQcm9wZXJ0aWVzIC0tPiBhbGwgcHJvcGVydGllcyBhcmUgZ3JvdXBhYmxlXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2FHcm91cGFibGVQcm9wZXJ0aWVzLmZpbmRJbmRleChwYXRoID0+IHBhdGguJHRhcmdldC5mdWxseVF1YWxpZmllZE5hbWUgPT09IHByb3BlcnR5LmZ1bGx5UXVhbGlmaWVkTmFtZSkgPj0gMDtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIGEgcHJvcGVydHkgaXMgYWdncmVnYXRhYmxlLlxuXHQgKlxuXHQgKiBAcGFyYW0gcHJvcGVydHkgVGhlIHByb3BlcnR5IHRvIGNoZWNrXG5cdCAqIEByZXR1cm5zIGB1bmRlZmluZWRgIGlmIHRoZSBlbnRpdHkgZG9lc24ndCBzdXBwb3J0IGFuYWx5dGljYWwgcXVlcmllcywgdHJ1ZSBvciBmYWxzZSBvdGhlcndpc2Vcblx0ICovXG5cdHB1YmxpYyBpc1Byb3BlcnR5QWdncmVnYXRhYmxlKHByb3BlcnR5OiBQcm9wZXJ0eSk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuXHRcdGlmICghdGhpcy5fYkFwcGx5U3VwcG9ydGVkKSB7XG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBHZXQgdGhlIGN1c3RvbSBhZ2dyZWdhdGVzXG5cdFx0XHRjb25zdCBhQ3VzdG9tQWdncmVnYXRlQW5ub3RhdGlvbnM6IEFubm90YXRpb25UZXJtPFxuXHRcdFx0XHRDdXN0b21BZ2dyZWdhdGVcblx0XHRcdD5bXSA9IHRoaXMuX2NvbnZlcnRlckNvbnRleHQuZ2V0QW5ub3RhdGlvbnNCeVRlcm0oXCJBZ2dyZWdhdGlvblwiLCBBZ2dyZWdhdGlvbkFubm90YXRpb25UZXJtcy5DdXN0b21BZ2dyZWdhdGUsIFtcblx0XHRcdFx0dGhpcy5fb0FnZ3JlZ2F0aW9uQW5ub3RhdGlvblRhcmdldFxuXHRcdFx0XSk7XG5cblx0XHRcdC8vIENoZWNrIGlmIGEgY3VzdG9tIGFnZ3JlZ2F0ZSBoYXMgYSBxdWFsaWZpZXIgdGhhdCBjb3JyZXNwb25kcyB0byB0aGUgcHJvcGVydHkgbmFtZVxuXHRcdFx0cmV0dXJuIGFDdXN0b21BZ2dyZWdhdGVBbm5vdGF0aW9ucy5zb21lKGFubm90YXRpb24gPT4ge1xuXHRcdFx0XHRyZXR1cm4gcHJvcGVydHkubmFtZSA9PT0gYW5ub3RhdGlvbi5xdWFsaWZpZXI7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgZ2V0R3JvdXBhYmxlUHJvcGVydGllcygpIHtcblx0XHRyZXR1cm4gdGhpcy5fYUdyb3VwYWJsZVByb3BlcnRpZXM7XG5cdH1cblxuXHRwdWJsaWMgZ2V0QWdncmVnYXRhYmxlUHJvcGVydGllcygpIHtcblx0XHRyZXR1cm4gdGhpcy5fYUFnZ3JlZ2F0YWJsZVByb3BlcnRpZXM7XG5cdH1cblxuXHRwdWJsaWMgZ2V0VHJhbnNBZ2dyZWdhdGlvbnMoKSB7XG5cdFx0Y29uc3QgYVRyYW5zQWdncmVnYXRpb25Bbm5vdGF0aW9ucyA9IHRoaXMuX2NvbnZlcnRlckNvbnRleHQuZ2V0QW5ub3RhdGlvbnNCeVRlcm0oXG5cdFx0XHRcIkFuYWx5dGljc1wiLFxuXHRcdFx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5BbmFseXRpY3MudjEuQWdncmVnYXRlZFByb3BlcnRpZXNcIixcblx0XHRcdFt0aGlzLl9jb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eUNvbnRhaW5lcigpLCB0aGlzLl9jb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGUoKV1cblx0XHQpO1xuXHRcdHJldHVybiBhVHJhbnNBZ2dyZWdhdGlvbkFubm90YXRpb25zO1xuXHR9XG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBsaXN0IG9mIGN1c3RvbSBhZ2dyZWdhdGUgZGVmaW5pdGlvbnMgZm9yIHRoZSBlbnRpdHkgdHlwZS5cblx0ICpcblx0ICogQHJldHVybnMgQSBtYXAgKHByb3BlcnR5TmFtZSAtLT4gYXJyYXkgb2YgY29udGV4dC1kZWZpbmluZyBwcm9wZXJ0eSBuYW1lcykgZm9yIGVhY2ggY3VzdG9tIGFnZ3JlZ2F0ZSBjb3JyZXNwb25kaW5nIHRvIGEgcHJvcGVydHkuIFRoZSBhcnJheSBvZlxuXHQgKiBjb250ZXh0LWRlZmluaW5nIHByb3BlcnR5IG5hbWVzIGlzIGVtcHR5IGlmIHRoZSBjdXN0b20gYWdncmVnYXRlIGRvZXNuJ3QgaGF2ZSBhbnkgY29udGV4dC1kZWZpbmluZyBwcm9wZXJ0eS5cblx0ICovXG5cdHB1YmxpYyBnZXRDdXN0b21BZ2dyZWdhdGVEZWZpbml0aW9ucygpIHtcblx0XHQvLyBHZXQgdGhlIGN1c3RvbSBhZ2dyZWdhdGVzXG5cdFx0Y29uc3QgYUN1c3RvbUFnZ3JlZ2F0ZUFubm90YXRpb25zOiBBbm5vdGF0aW9uVGVybTxDdXN0b21BZ2dyZWdhdGU+W10gPSB0aGlzLl9jb252ZXJ0ZXJDb250ZXh0LmdldEFubm90YXRpb25zQnlUZXJtKFxuXHRcdFx0XCJBZ2dyZWdhdGlvblwiLFxuXHRcdFx0QWdncmVnYXRpb25Bbm5vdGF0aW9uVGVybXMuQ3VzdG9tQWdncmVnYXRlLFxuXHRcdFx0W3RoaXMuX29BZ2dyZWdhdGlvbkFubm90YXRpb25UYXJnZXRdXG5cdFx0KTtcblxuXHRcdHJldHVybiBhQ3VzdG9tQWdncmVnYXRlQW5ub3RhdGlvbnM7XG5cdH1cbn1cbiJdfQ==