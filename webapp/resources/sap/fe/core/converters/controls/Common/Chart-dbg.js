/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["../../ManifestSettings", "sap/fe/core/converters/controls/Common/Action", "sap/fe/core/converters/annotations/DataField", "../../helpers/ID", "sap/fe/core/converters/helpers/ConfigurableObject", "sap/fe/core/converters/helpers/Key", "sap/fe/core/templating/DataModelPathHelper", "../../helpers/Aggregation"], function (ManifestSettings, Action, DataField, ID, ConfigurableObject, Key, DataModelPathHelper, Aggregation) {
  "use strict";

  var _exports = {};
  var AggregationHelper = Aggregation.AggregationHelper;
  var getTargetObjectPath = DataModelPathHelper.getTargetObjectPath;
  var KeyHelper = Key.KeyHelper;
  var insertCustomElements = ConfigurableObject.insertCustomElements;
  var FilterBarID = ID.FilterBarID;
  var ChartID = ID.ChartID;
  var isDataFieldForActionAbstract = DataField.isDataFieldForActionAbstract;
  var getActionsFromManifest = Action.getActionsFromManifest;
  var TemplateType = ManifestSettings.TemplateType;
  var ActionType = ManifestSettings.ActionType;
  var VisualizationType = ManifestSettings.VisualizationType;

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  /**
   * Method to retrieve all chart actions from annotations.
   *
   * @param chartAnnotation
   * @param visualizationPath
   * @param converterContext
   * @returns {BaseAction[]} The table annotation actions
   */
  function getChartActionsFromAnnotations(chartAnnotation, visualizationPath, converterContext) {
    var chartActions = [];

    if (chartAnnotation) {
      var aActions = chartAnnotation.Actions || [];
      aActions.forEach(function (dataField) {
        var _dataField$annotation, _dataField$annotation2, _dataField$annotation3, _ActionTarget;

        var chartAction;

        if (isDataFieldForActionAbstract(dataField) && !(((_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : (_dataField$annotation2 = _dataField$annotation.UI) === null || _dataField$annotation2 === void 0 ? void 0 : (_dataField$annotation3 = _dataField$annotation2.Hidden) === null || _dataField$annotation3 === void 0 ? void 0 : _dataField$annotation3.valueOf()) === true) && !dataField.Inline && !dataField.Determining && !(dataField !== null && dataField !== void 0 && (_ActionTarget = dataField.ActionTarget) !== null && _ActionTarget !== void 0 && _ActionTarget.isBound)) {
          var key = KeyHelper.generateKeyFromDataField(dataField);

          switch (dataField.$Type) {
            case "com.sap.vocabularies.UI.v1.DataFieldForAction":
              chartAction = {
                type: ActionType.DataFieldForAction,
                annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
                key: key
              };
              break;

            case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
              chartAction = {
                type: ActionType.DataFieldForIntentBasedNavigation,
                annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
                key: key
              };
              break;
          }
        }

        if (chartAction) {
          chartActions.push(chartAction);
        }
      });
    }

    return chartActions;
  }

  function getChartActions(chartAnnotation, visualizationPath, converterContext) {
    var aAnnotationActions = getChartActionsFromAnnotations(chartAnnotation, visualizationPath, converterContext);
    return insertCustomElements(aAnnotationActions, getActionsFromManifest(converterContext.getManifestControlConfiguration(visualizationPath).actions, converterContext, aAnnotationActions), {
      enableOnSelect: "overwrite",
      enabled: "overwrite"
    });
  }

  _exports.getChartActions = getChartActions;

  function getP13nMode(visualizationPath, converterContext) {
    var _chartManifestSetting;

    var manifestWrapper = converterContext.getManifestWrapper();
    var chartManifestSettings = converterContext.getManifestControlConfiguration(visualizationPath);
    var hasVariantManagement = ["Page", "Control"].indexOf(manifestWrapper.getVariantManagement()) > -1;
    var personalization = true;
    var aPersonalization = [];

    if ((chartManifestSettings === null || chartManifestSettings === void 0 ? void 0 : (_chartManifestSetting = chartManifestSettings.chartSettings) === null || _chartManifestSetting === void 0 ? void 0 : _chartManifestSetting.personalization) !== undefined) {
      personalization = chartManifestSettings.chartSettings.personalization;
    }

    if (hasVariantManagement && personalization) {
      if (personalization === true) {
        return "Sort,Type,Item";
      } else if (typeof personalization === "object") {
        if (personalization.type) {
          aPersonalization.push("Type");
        }

        if (personalization.item) {
          aPersonalization.push("Item");
        }

        if (personalization.sort) {
          aPersonalization.push("Sort");
        }

        return aPersonalization.join(",");
      }
    }

    return undefined;
  }
  /**
   * Create the ChartVisualization configuration that will be used to display a chart via Chart Macro.
   *
   * @param {ChartDefinitionTypeTypes} chartAnnotation The target chart annotation
   * @param {string} visualizationPath The current visualization annotation path
   * @param {ConverterContext} converterContext The converter context
   * @param {boolean} doNotCheckApplySupported Flag that tells whether applysupported to be checked or not
   * @returns {ChartVisualization} The chart visualization based on the annotation
   */


  _exports.getP13nMode = getP13nMode;

  function createChartVisualization(chartAnnotation, visualizationPath, converterContext, doNotCheckApplySupported) {
    var _converterContext$get, _converterContext$get2, _converterContext$get3, _converterContext$get4;

    var aggregationHelper = new AggregationHelper(converterContext.getEntityType(), converterContext);

    if (!doNotCheckApplySupported && !aggregationHelper.isAnalyticsSupported()) {
      throw new Error("ApplySupported is not added to the annotations");
    }

    var aTransAggAnnos = (_converterContext$get = converterContext.getEntityType().annotations.Analytics) === null || _converterContext$get === void 0 ? void 0 : _converterContext$get.AggregatedProperties;
    var transAggLabels = {};

    for (var i = 0; aTransAggAnnos && i < aTransAggAnnos.length; i++) {
      var _aTransAggAnnos$i, _aTransAggAnnos$i$ann, _aTransAggAnnos$i$ann2;

      transAggLabels[aTransAggAnnos[i].Name] = {
        label: (_aTransAggAnnos$i = aTransAggAnnos[i]) === null || _aTransAggAnnos$i === void 0 ? void 0 : (_aTransAggAnnos$i$ann = _aTransAggAnnos$i.annotations) === null || _aTransAggAnnos$i$ann === void 0 ? void 0 : (_aTransAggAnnos$i$ann2 = _aTransAggAnnos$i$ann.Common) === null || _aTransAggAnnos$i$ann2 === void 0 ? void 0 : _aTransAggAnnos$i$ann2.Label
      };
    }

    var aCustomAggregates = aggregationHelper.getCustomAggregateDefinitions();
    var mCustomAggregates = {};

    if (aCustomAggregates) {
      for (var _i = 0; _i < aCustomAggregates.length; _i++) {
        var _aCustomAggregates$_i, _aCustomAggregates$_i2;

        var aContextDefiningProperties = (_aCustomAggregates$_i = aCustomAggregates[_i].annotations) === null || _aCustomAggregates$_i === void 0 ? void 0 : (_aCustomAggregates$_i2 = _aCustomAggregates$_i.Aggregation) === null || _aCustomAggregates$_i2 === void 0 ? void 0 : _aCustomAggregates$_i2.ContextDefiningProperties;
        mCustomAggregates[aCustomAggregates[_i].qualifier] = {
          name: aCustomAggregates[_i].qualifier,
          label: "Custom Aggregate (" + aCustomAggregates[_i].qualifier + ")",
          sortable: true,
          sortOrder: "both",
          contextDefiningProperty: aContextDefiningProperties ? aContextDefiningProperties.map(function (oCtxDefProperty) {
            return oCtxDefProperty.value;
          }) : []
        };
      }
    }

    var aTransAggregations = aggregationHelper.getTransAggregations()[0];
    var mTransAggregations = {};

    if (aTransAggregations) {
      for (var _i2 = 0; _i2 < aTransAggregations.length; _i2++) {
        mTransAggregations[aTransAggregations[_i2].Name] = {
          name: aTransAggregations[_i2].Name,
          propertyPath: aTransAggregations[_i2].AggregatableProperty.valueOf().value,
          aggregationMethod: aTransAggregations[_i2].AggregationMethod,
          label: aTransAggregations[_i2].Name in transAggLabels ? transAggLabels[aTransAggregations[_i2].Name].label : "Aggregatable property (" + aTransAggregations[_i2].Name + ")",
          sortable: true,
          sortOrder: "both",
          custom: false
        };
      }
    }

    var aAggProps = aggregationHelper.getAggregatableProperties();
    var aGrpProps = aggregationHelper.getGroupableProperties();
    var mApplySupported = {};
    mApplySupported.$Type = "Org.OData.Aggregation.V1.ApplySupportedType";
    mApplySupported.AggregatableProperties = [];
    mApplySupported.GroupableProperties = [];

    for (var _i3 = 0; aAggProps && _i3 < aAggProps.length; _i3++) {
      var _aAggProps$_i, _aAggProps$_i2, _aAggProps$_i2$Proper;

      var obj = {
        $Type: (_aAggProps$_i = aAggProps[_i3]) === null || _aAggProps$_i === void 0 ? void 0 : _aAggProps$_i.$Type,
        Property: {
          $PropertyPath: (_aAggProps$_i2 = aAggProps[_i3]) === null || _aAggProps$_i2 === void 0 ? void 0 : (_aAggProps$_i2$Proper = _aAggProps$_i2.Property) === null || _aAggProps$_i2$Proper === void 0 ? void 0 : _aAggProps$_i2$Proper.value
        }
      };
      mApplySupported.AggregatableProperties.push(obj);
    }

    for (var _i4 = 0; aGrpProps && _i4 < aGrpProps.length; _i4++) {
      var _aGrpProps$_i;

      var _obj = {
        $PropertyPath: (_aGrpProps$_i = aGrpProps[_i4]) === null || _aGrpProps$_i === void 0 ? void 0 : _aGrpProps$_i.value
      };
      mApplySupported.GroupableProperties.push(_obj);
    }

    var chartActions = getChartActions(chartAnnotation, visualizationPath, converterContext);

    var _visualizationPath$sp = visualizationPath.split("@"),
        _visualizationPath$sp2 = _slicedToArray(_visualizationPath$sp, 1),
        navigationPropertyPath
    /*, annotationPath*/
    = _visualizationPath$sp2[0];

    if (navigationPropertyPath.lastIndexOf("/") === navigationPropertyPath.length - 1) {
      // Drop trailing slash
      navigationPropertyPath = navigationPropertyPath.substr(0, navigationPropertyPath.length - 1);
    }

    var title = (_converterContext$get2 = converterContext.getDataModelObjectPath().targetEntityType.annotations) === null || _converterContext$get2 === void 0 ? void 0 : (_converterContext$get3 = _converterContext$get2.UI) === null || _converterContext$get3 === void 0 ? void 0 : (_converterContext$get4 = _converterContext$get3.HeaderInfo) === null || _converterContext$get4 === void 0 ? void 0 : _converterContext$get4.TypeNamePlural;
    var dataModelPath = converterContext.getDataModelObjectPath();
    var isEntitySet = navigationPropertyPath.length === 0;
    var entityName = dataModelPath.targetEntitySet ? dataModelPath.targetEntitySet.name : dataModelPath.startingEntitySet.name;
    var sFilterbarId = isEntitySet ? FilterBarID(converterContext.getContextPath()) : undefined;
    var oVizProperties = {
      "legendGroup": {
        "layout": {
          "position": "bottom"
        }
      }
    };
    var autoBindOnInit;

    if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
      autoBindOnInit = true;
    } else if (converterContext.getTemplateType() === TemplateType.ListReport || converterContext.getTemplateType() === TemplateType.AnalyticalListPage) {
      autoBindOnInit = false;
    }

    var hasMultipleVisualizations = converterContext.getManifestWrapper().hasMultipleVisualizations() || converterContext.getTemplateType() === "AnalyticalListPage";
    var onSegmentedButtonPressed = hasMultipleVisualizations ? ".handlers.onSegmentedButtonPressed" : "";
    var visible = hasMultipleVisualizations ? "{= ${pageInternal>alpContentView} !== 'Table'}" : "true";
    return {
      type: VisualizationType.Chart,
      id: ChartID(isEntitySet ? entityName : navigationPropertyPath, VisualizationType.Chart),
      collection: getTargetObjectPath(converterContext.getDataModelObjectPath()),
      entityName: entityName,
      personalization: getP13nMode(visualizationPath, converterContext),
      navigationPath: navigationPropertyPath,
      annotationPath: converterContext.getAbsoluteAnnotationPath(visualizationPath),
      filterId: sFilterbarId,
      vizProperties: JSON.stringify(oVizProperties),
      actions: chartActions,
      title: title,
      autoBindOnInit: autoBindOnInit,
      onSegmentedButtonPressed: onSegmentedButtonPressed,
      visible: visible,
      customAgg: mCustomAggregates,
      transAgg: mTransAggregations,
      applySupported: mApplySupported
    };
  }

  _exports.createChartVisualization = createChartVisualization;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNoYXJ0LnRzIl0sIm5hbWVzIjpbImdldENoYXJ0QWN0aW9uc0Zyb21Bbm5vdGF0aW9ucyIsImNoYXJ0QW5ub3RhdGlvbiIsInZpc3VhbGl6YXRpb25QYXRoIiwiY29udmVydGVyQ29udGV4dCIsImNoYXJ0QWN0aW9ucyIsImFBY3Rpb25zIiwiQWN0aW9ucyIsImZvckVhY2giLCJkYXRhRmllbGQiLCJjaGFydEFjdGlvbiIsImlzRGF0YUZpZWxkRm9yQWN0aW9uQWJzdHJhY3QiLCJhbm5vdGF0aW9ucyIsIlVJIiwiSGlkZGVuIiwidmFsdWVPZiIsIklubGluZSIsIkRldGVybWluaW5nIiwiQWN0aW9uVGFyZ2V0IiwiaXNCb3VuZCIsImtleSIsIktleUhlbHBlciIsImdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZCIsIiRUeXBlIiwidHlwZSIsIkFjdGlvblR5cGUiLCJEYXRhRmllbGRGb3JBY3Rpb24iLCJhbm5vdGF0aW9uUGF0aCIsImdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgiLCJmdWxseVF1YWxpZmllZE5hbWUiLCJEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24iLCJwdXNoIiwiZ2V0Q2hhcnRBY3Rpb25zIiwiYUFubm90YXRpb25BY3Rpb25zIiwiaW5zZXJ0Q3VzdG9tRWxlbWVudHMiLCJnZXRBY3Rpb25zRnJvbU1hbmlmZXN0IiwiZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbiIsImFjdGlvbnMiLCJlbmFibGVPblNlbGVjdCIsImVuYWJsZWQiLCJnZXRQMTNuTW9kZSIsIm1hbmlmZXN0V3JhcHBlciIsImdldE1hbmlmZXN0V3JhcHBlciIsImNoYXJ0TWFuaWZlc3RTZXR0aW5ncyIsImhhc1ZhcmlhbnRNYW5hZ2VtZW50IiwiaW5kZXhPZiIsImdldFZhcmlhbnRNYW5hZ2VtZW50IiwicGVyc29uYWxpemF0aW9uIiwiYVBlcnNvbmFsaXphdGlvbiIsImNoYXJ0U2V0dGluZ3MiLCJ1bmRlZmluZWQiLCJpdGVtIiwic29ydCIsImpvaW4iLCJjcmVhdGVDaGFydFZpc3VhbGl6YXRpb24iLCJkb05vdENoZWNrQXBwbHlTdXBwb3J0ZWQiLCJhZ2dyZWdhdGlvbkhlbHBlciIsIkFnZ3JlZ2F0aW9uSGVscGVyIiwiZ2V0RW50aXR5VHlwZSIsImlzQW5hbHl0aWNzU3VwcG9ydGVkIiwiRXJyb3IiLCJhVHJhbnNBZ2dBbm5vcyIsIkFuYWx5dGljcyIsIkFnZ3JlZ2F0ZWRQcm9wZXJ0aWVzIiwidHJhbnNBZ2dMYWJlbHMiLCJpIiwibGVuZ3RoIiwiTmFtZSIsImxhYmVsIiwiQ29tbW9uIiwiTGFiZWwiLCJhQ3VzdG9tQWdncmVnYXRlcyIsImdldEN1c3RvbUFnZ3JlZ2F0ZURlZmluaXRpb25zIiwibUN1c3RvbUFnZ3JlZ2F0ZXMiLCJhQ29udGV4dERlZmluaW5nUHJvcGVydGllcyIsIkFnZ3JlZ2F0aW9uIiwiQ29udGV4dERlZmluaW5nUHJvcGVydGllcyIsInF1YWxpZmllciIsIm5hbWUiLCJzb3J0YWJsZSIsInNvcnRPcmRlciIsImNvbnRleHREZWZpbmluZ1Byb3BlcnR5IiwibWFwIiwib0N0eERlZlByb3BlcnR5IiwidmFsdWUiLCJhVHJhbnNBZ2dyZWdhdGlvbnMiLCJnZXRUcmFuc0FnZ3JlZ2F0aW9ucyIsIm1UcmFuc0FnZ3JlZ2F0aW9ucyIsInByb3BlcnR5UGF0aCIsIkFnZ3JlZ2F0YWJsZVByb3BlcnR5IiwiYWdncmVnYXRpb25NZXRob2QiLCJBZ2dyZWdhdGlvbk1ldGhvZCIsImN1c3RvbSIsImFBZ2dQcm9wcyIsImdldEFnZ3JlZ2F0YWJsZVByb3BlcnRpZXMiLCJhR3JwUHJvcHMiLCJnZXRHcm91cGFibGVQcm9wZXJ0aWVzIiwibUFwcGx5U3VwcG9ydGVkIiwiQWdncmVnYXRhYmxlUHJvcGVydGllcyIsIkdyb3VwYWJsZVByb3BlcnRpZXMiLCJvYmoiLCJQcm9wZXJ0eSIsIiRQcm9wZXJ0eVBhdGgiLCJzcGxpdCIsIm5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgiLCJsYXN0SW5kZXhPZiIsInN1YnN0ciIsInRpdGxlIiwiZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCIsInRhcmdldEVudGl0eVR5cGUiLCJIZWFkZXJJbmZvIiwiVHlwZU5hbWVQbHVyYWwiLCJkYXRhTW9kZWxQYXRoIiwiaXNFbnRpdHlTZXQiLCJlbnRpdHlOYW1lIiwidGFyZ2V0RW50aXR5U2V0Iiwic3RhcnRpbmdFbnRpdHlTZXQiLCJzRmlsdGVyYmFySWQiLCJGaWx0ZXJCYXJJRCIsImdldENvbnRleHRQYXRoIiwib1ZpelByb3BlcnRpZXMiLCJhdXRvQmluZE9uSW5pdCIsImdldFRlbXBsYXRlVHlwZSIsIlRlbXBsYXRlVHlwZSIsIk9iamVjdFBhZ2UiLCJMaXN0UmVwb3J0IiwiQW5hbHl0aWNhbExpc3RQYWdlIiwiaGFzTXVsdGlwbGVWaXN1YWxpemF0aW9ucyIsIm9uU2VnbWVudGVkQnV0dG9uUHJlc3NlZCIsInZpc2libGUiLCJWaXN1YWxpemF0aW9uVHlwZSIsIkNoYXJ0IiwiaWQiLCJDaGFydElEIiwiY29sbGVjdGlvbiIsImdldFRhcmdldE9iamVjdFBhdGgiLCJuYXZpZ2F0aW9uUGF0aCIsImdldEFic29sdXRlQW5ub3RhdGlvblBhdGgiLCJmaWx0ZXJJZCIsInZpelByb3BlcnRpZXMiLCJKU09OIiwic3RyaW5naWZ5IiwiY3VzdG9tQWdnIiwidHJhbnNBZ2ciLCJhcHBseVN1cHBvcnRlZCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVNBLDhCQUFULENBQ0NDLGVBREQsRUFFQ0MsaUJBRkQsRUFHQ0MsZ0JBSEQsRUFJZ0I7QUFDZixRQUFNQyxZQUEwQixHQUFHLEVBQW5DOztBQUNBLFFBQUlILGVBQUosRUFBcUI7QUFDcEIsVUFBTUksUUFBUSxHQUFHSixlQUFlLENBQUNLLE9BQWhCLElBQTJCLEVBQTVDO0FBQ0FELE1BQUFBLFFBQVEsQ0FBQ0UsT0FBVCxDQUFpQixVQUFDQyxTQUFELEVBQXVDO0FB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SSxpQkFBM0MsQ0FQVjtBQVFOdUksTUFBQUEsUUFBUSxFQUFFckIsWUFSSjtBQVNOc0IsTUFBQUEsYUFBYSxFQUFFQyxJQUFJLENBQUNDLFNBQUwsQ0FBZXJCLGNBQWYsQ0FUVDtBQVVObkYsTUFBQUEsT0FBTyxFQUFFaEMsWUFWSDtBQVdOc0csTUFBQUEsS0FBSyxFQUFFQSxLQVhEO0FBWU5jLE1BQUFBLGNBQWMsRUFBRUEsY0FaVjtBQWFOTyxNQUFBQSx3QkFBd0IsRUFBRUEsd0JBYnBCO0FBY05DLE1BQUFBLE9BQU8sRUFBRUEsT0FkSDtBQWVOYSxNQUFBQSxTQUFTLEVBQUVyRSxpQkFmTDtBQWdCTnNFLE1BQUFBLFFBQVEsRUFBRXhELGtCQWhCSjtBQWlCTnlELE1BQUFBLGNBQWMsRUFBRS9DO0FBakJWLEtBQVA7QUFtQkEiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdENoYXJ0TWFuaWZlc3RDb25maWd1cmF0aW9uLFxuXHRDaGFydFBlcnNvbmFsaXphdGlvbk1hbmlmZXN0U2V0dGluZ3MsXG5cdFZpc3VhbGl6YXRpb25UeXBlLFxuXHRBY3Rpb25UeXBlLFxuXHRUZW1wbGF0ZVR5cGVcbn0gZnJvbSBcIi4uLy4uL01hbmlmZXN0U2V0dGluZ3NcIjtcbmltcG9ydCB7IENoYXJ0RGVmaW5pdGlvblR5cGVUeXBlcywgRGF0YUZpZWxkQWJzdHJhY3RUeXBlcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHsgQW5ub3RhdGlvbkFjdGlvbiwgQmFzZUFjdGlvbiwgZ2V0QWN0aW9uc0Zyb21NYW5pZmVzdCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9BY3Rpb25cIjtcbmltcG9ydCB7IGlzRGF0YUZpZWxkRm9yQWN0aW9uQWJzdHJhY3QgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9hbm5vdGF0aW9ucy9EYXRhRmllbGRcIjtcbmltcG9ydCB7IENoYXJ0SUQsIEZpbHRlckJhcklEIH0gZnJvbSBcIi4uLy4uL2hlbHBlcnMvSURcIjtcbmltcG9ydCB7IGluc2VydEN1c3RvbUVsZW1lbnRzIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9Db25maWd1cmFibGVPYmplY3RcIjtcbmltcG9ydCB7IEtleUhlbHBlciB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvS2V5XCI7XG5pbXBvcnQgeyBnZXRUYXJnZXRPYmplY3RQYXRoIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvRGF0YU1vZGVsUGF0aEhlbHBlclwiO1xuaW1wb3J0IHsgQWdncmVnYXRpb25IZWxwZXIgfSBmcm9tIFwiLi4vLi4vaGVscGVycy9BZ2dyZWdhdGlvblwiO1xuaW1wb3J0IE1hbmlmZXN0V3JhcHBlciBmcm9tIFwiLi4vLi4vTWFuaWZlc3RXcmFwcGVyXCI7XG5pbXBvcnQgQ29udmVydGVyQ29udGV4dCBmcm9tIFwiLi4vLi4vQ29udmVydGVyQ29udGV4dFwiO1xuXG4vKipcbiAqIEB0eXBlZGVmIENoYXJ0VmlzdWFsaXphdGlvblxuICovXG5leHBvcnQgdHlwZSBDaGFydFZpc3VhbGl6YXRpb24gPSB7XG5cdHR5cGU6IFZpc3VhbGl6YXRpb25UeXBlLkNoYXJ0O1xuXHRpZDogc3RyaW5nO1xuXHRjb2xsZWN0aW9uOiBzdHJpbmc7XG5cdGVudGl0eU5hbWU6IHN0cmluZztcblx0cGVyc29uYWxpemF0aW9uPzogc3RyaW5nO1xuXHRuYXZpZ2F0aW9uUGF0aDogc3RyaW5nO1xuXHRhbm5vdGF0aW9uUGF0aDogc3RyaW5nO1xuXHRmaWx0ZXJJZD86IHN0cmluZztcblx0dml6UHJvcGVydGllczogc3RyaW5nO1xuXHRhY3Rpb25zOiBCYXNlQWN0aW9uW107XG5cdHRpdGxlOiBzdHJpbmc7XG5cdGF1dG9CaW5kT25Jbml0OiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXHRvblNlZ21lbnRlZEJ1dHRvblByZXNzZWQ6IHN0cmluZztcblx0dmlzaWJsZTogc3RyaW5nO1xuXHRjdXN0b21BZ2c6IG9iamVjdDtcblx0dHJhbnNBZ2c6IG9iamVjdDtcblx0YXBwbHlTdXBwb3J0ZWQ6IG9iamVjdDtcbn07XG5cbi8qKlxuICogTWV0aG9kIHRvIHJldHJpZXZlIGFsbCBjaGFydCBhY3Rpb25zIGZyb20gYW5ub3RhdGlvbnMuXG4gKlxuICogQHBhcmFtIGNoYXJ0QW5ub3RhdGlvblxuICogQHBhcmFtIHZpc3VhbGl6YXRpb25QYXRoXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHJldHVybnMge0Jhc2VBY3Rpb25bXX0gVGhlIHRhYmxlIGFubm90YXRpb24gYWN0aW9uc1xuICovXG5mdW5jdGlvbiBnZXRDaGFydEFjdGlvbnNGcm9tQW5ub3RhdGlvbnMoXG5cdGNoYXJ0QW5ub3RhdGlvbjogQ2hhcnREZWZpbml0aW9uVHlwZVR5cGVzLFxuXHR2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBCYXNlQWN0aW9uW10ge1xuXHRjb25zdCBjaGFydEFjdGlvbnM6IEJhc2VBY3Rpb25bXSA9IFtdO1xuXHRpZiAoY2hhcnRBbm5vdGF0aW9uKSB7XG5cdFx0Y29uc3QgYUFjdGlvbnMgPSBjaGFydEFubm90YXRpb24uQWN0aW9ucyB8fCBbXTtcblx0XHRhQWN0aW9ucy5mb3JFYWNoKChkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMpID0+IHtcblx0XHRcdGxldCBjaGFydEFjdGlvbjogQW5ub3RhdGlvbkFjdGlvbiB8IHVuZGVmaW5lZDtcblx0XHRcdGlmIChcblx0XHRcdFx0aXNEYXRhRmllbGRGb3JBY3Rpb25BYnN0cmFjdChkYXRhRmllbGQpICYmXG5cdFx0XHRcdCEoZGF0YUZpZWxkLmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgPT09IHRydWUpICYmXG5cdFx0XHRcdCFkYXRhRmllbGQuSW5saW5lICYmXG5cdFx0XHRcdCFkYXRhRmllbGQuRGV0ZXJtaW5pbmcgJiZcblx0XHRcdFx0IShkYXRhRmllbGQgYXMgYW55KT8uQWN0aW9uVGFyZ2V0Py5pc0JvdW5kXG5cdFx0XHQpIHtcblx0XHRcdFx0Y29uc3Qga2V5ID0gS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChkYXRhRmllbGQpO1xuXHRcdFx0XHRzd2l0Y2ggKGRhdGFGaWVsZC4kVHlwZSkge1xuXHRcdFx0XHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JBY3Rpb25cIjpcblx0XHRcdFx0XHRcdGNoYXJ0QWN0aW9uID0ge1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBBY3Rpb25UeXBlLkRhdGFGaWVsZEZvckFjdGlvbixcblx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvblBhdGg6IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChkYXRhRmllbGQuZnVsbHlRdWFsaWZpZWROYW1lKSxcblx0XHRcdFx0XHRcdFx0a2V5OiBrZXlcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb25cIjpcblx0XHRcdFx0XHRcdGNoYXJ0QWN0aW9uID0ge1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBBY3Rpb25UeXBlLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbixcblx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvblBhdGg6IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChkYXRhRmllbGQuZnVsbHlRdWFsaWZpZWROYW1lKSxcblx0XHRcdFx0XHRcdFx0a2V5OiBrZXlcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGNoYXJ0QWN0aW9uKSB7XG5cdFx0XHRcdGNoYXJ0QWN0aW9ucy5wdXNoKGNoYXJ0QWN0aW9uKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gY2hhcnRBY3Rpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhcnRBY3Rpb25zKFxuXHRjaGFydEFubm90YXRpb246IENoYXJ0RGVmaW5pdGlvblR5cGVUeXBlcyxcblx0dmlzdWFsaXphdGlvblBhdGg6IHN0cmluZyxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogQmFzZUFjdGlvbltdIHtcblx0Y29uc3QgYUFubm90YXRpb25BY3Rpb25zOiBCYXNlQWN0aW9uW10gPSBnZXRDaGFydEFjdGlvbnNGcm9tQW5ub3RhdGlvbnMoY2hhcnRBbm5vdGF0aW9uLCB2aXN1YWxpemF0aW9uUGF0aCwgY29udmVydGVyQ29udGV4dCk7XG5cblx0cmV0dXJuIGluc2VydEN1c3RvbUVsZW1lbnRzKFxuXHRcdGFBbm5vdGF0aW9uQWN0aW9ucyxcblx0XHRnZXRBY3Rpb25zRnJvbU1hbmlmZXN0KFxuXHRcdFx0Y29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdENvbnRyb2xDb25maWd1cmF0aW9uKHZpc3VhbGl6YXRpb25QYXRoKS5hY3Rpb25zLFxuXHRcdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRcdGFBbm5vdGF0aW9uQWN0aW9uc1xuXHRcdCksXG5cdFx0eyBlbmFibGVPblNlbGVjdDogXCJvdmVyd3JpdGVcIiwgZW5hYmxlZDogXCJvdmVyd3JpdGVcIiB9XG5cdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQMTNuTW9kZSh2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0Y29uc3QgbWFuaWZlc3RXcmFwcGVyOiBNYW5pZmVzdFdyYXBwZXIgPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpO1xuXHRjb25zdCBjaGFydE1hbmlmZXN0U2V0dGluZ3M6IENoYXJ0TWFuaWZlc3RDb25maWd1cmF0aW9uID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdENvbnRyb2xDb25maWd1cmF0aW9uKHZpc3VhbGl6YXRpb25QYXRoKTtcblx0Y29uc3QgaGFzVmFyaWFudE1hbmFnZW1lbnQ6IGJvb2xlYW4gPSBbXCJQYWdlXCIsIFwiQ29udHJvbFwiXS5pbmRleE9mKG1hbmlmZXN0V3JhcHBlci5nZXRWYXJpYW50TWFuYWdlbWVudCgpKSA+IC0xO1xuXHRsZXQgcGVyc29uYWxpemF0aW9uOiBDaGFydFBlcnNvbmFsaXphdGlvbk1hbmlmZXN0U2V0dGluZ3MgPSB0cnVlO1xuXHRjb25zdCBhUGVyc29uYWxpemF0aW9uOiBzdHJpbmdbXSA9IFtdO1xuXHRpZiAoY2hhcnRNYW5pZmVzdFNldHRpbmdzPy5jaGFydFNldHRpbmdzPy5wZXJzb25hbGl6YXRpb24gIT09IHVuZGVmaW5lZCkge1xuXHRcdHBlcnNvbmFsaXphdGlvbiA9IGNoYXJ0TWFuaWZlc3RTZXR0aW5ncy5jaGFydFNldHRpbmdzLnBlcnNvbmFsaXphdGlvbjtcblx0fVxuXHRpZiAoaGFzVmFyaWFudE1hbmFnZW1lbnQgJiYgcGVyc29uYWxpemF0aW9uKSB7XG5cdFx0aWYgKHBlcnNvbmFsaXphdGlvbiA9PT0gdHJ1ZSkge1xuXHRcdFx0cmV0dXJuIFwiU29ydCxUeXBlLEl0ZW1cIjtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBwZXJzb25hbGl6YXRpb24gPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdGlmIChwZXJzb25hbGl6YXRpb24udHlwZSkge1xuXHRcdFx0XHRhUGVyc29uYWxpemF0aW9uLnB1c2goXCJUeXBlXCIpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHBlcnNvbmFsaXphdGlvbi5pdGVtKSB7XG5cdFx0XHRcdGFQZXJzb25hbGl6YXRpb24ucHVzaChcIkl0ZW1cIik7XG5cdFx0XHR9XG5cdFx0XHRpZiAocGVyc29uYWxpemF0aW9uLnNvcnQpIHtcblx0XHRcdFx0YVBlcnNvbmFsaXphdGlvbi5wdXNoKFwiU29ydFwiKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBhUGVyc29uYWxpemF0aW9uLmpvaW4oXCIsXCIpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIENyZWF0ZSB0aGUgQ2hhcnRWaXN1YWxpemF0aW9uIGNvbmZpZ3VyYXRpb24gdGhhdCB3aWxsIGJlIHVzZWQgdG8gZGlzcGxheSBhIGNoYXJ0IHZpYSBDaGFydCBNYWNyby5cbiAqXG4gKiBAcGFyYW0ge0NoYXJ0RGVmaW5pdGlvblR5cGVUeXBlc30gY2hhcnRBbm5vdGF0aW9uIFRoZSB0YXJnZXQgY2hhcnQgYW5ub3RhdGlvblxuICogQHBhcmFtIHtzdHJpbmd9IHZpc3VhbGl6YXRpb25QYXRoIFRoZSBjdXJyZW50IHZpc3VhbGl6YXRpb24gYW5ub3RhdGlvbiBwYXRoXG4gKiBAcGFyYW0ge0NvbnZlcnRlckNvbnRleHR9IGNvbnZlcnRlckNvbnRleHQgVGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcGFyYW0ge2Jvb2xlYW59IGRvTm90Q2hlY2tBcHBseVN1cHBvcnRlZCBGbGFnIHRoYXQgdGVsbHMgd2hldGhlciBhcHBseXN1cHBvcnRlZCB0byBiZSBjaGVja2VkIG9yIG5vdFxuICogQHJldHVybnMge0NoYXJ0VmlzdWFsaXphdGlvbn0gVGhlIGNoYXJ0IHZpc3VhbGl6YXRpb24gYmFzZWQgb24gdGhlIGFubm90YXRpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNoYXJ0VmlzdWFsaXphdGlvbihcblx0Y2hhcnRBbm5vdGF0aW9uOiBDaGFydERlZmluaXRpb25UeXBlVHlwZXMsXG5cdHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGRvTm90Q2hlY2tBcHBseVN1cHBvcnRlZD86IGJvb2xlYW5cbik6IENoYXJ0VmlzdWFsaXphdGlvbiB7XG5cdGNvbnN0IGFnZ3JlZ2F0aW9uSGVscGVyID0gbmV3IEFnZ3JlZ2F0aW9uSGVscGVyKGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0aWYgKCFkb05vdENoZWNrQXBwbHlTdXBwb3J0ZWQgJiYgIWFnZ3JlZ2F0aW9uSGVscGVyLmlzQW5hbHl0aWNzU3VwcG9ydGVkKCkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJBcHBseVN1cHBvcnRlZCBpcyBub3QgYWRkZWQgdG8gdGhlIGFubm90YXRpb25zXCIpO1xuXHR9XG5cdGNvbnN0IGFUcmFuc0FnZ0Fubm9zID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCkuYW5ub3RhdGlvbnMuQW5hbHl0aWNzPy5BZ2dyZWdhdGVkUHJvcGVydGllcyBhcyBhbnk7XG5cdGNvbnN0IHRyYW5zQWdnTGFiZWxzID0ge30gYXMgYW55O1xuXG5cdGZvciAobGV0IGkgPSAwOyBhVHJhbnNBZ2dBbm5vcyAmJiBpIDwgYVRyYW5zQWdnQW5ub3MubGVuZ3RoOyBpKyspIHtcblx0XHR0cmFuc0FnZ0xhYmVsc1thVHJhbnNBZ2dBbm5vc1tpXS5OYW1lXSA9IHtcblx0XHRcdGxhYmVsOiBhVHJhbnNBZ2dBbm5vc1tpXT8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uTGFiZWxcblx0XHR9O1xuXHR9XG5cblx0Y29uc3QgYUN1c3RvbUFnZ3JlZ2F0ZXMgPSBhZ2dyZWdhdGlvbkhlbHBlci5nZXRDdXN0b21BZ2dyZWdhdGVEZWZpbml0aW9ucygpO1xuXHRjb25zdCBtQ3VzdG9tQWdncmVnYXRlcyA9IHt9IGFzIGFueTtcblx0aWYgKGFDdXN0b21BZ2dyZWdhdGVzKSB7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhQ3VzdG9tQWdncmVnYXRlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgYUNvbnRleHREZWZpbmluZ1Byb3BlcnRpZXMgPSBhQ3VzdG9tQWdncmVnYXRlc1tpXS5hbm5vdGF0aW9ucz8uQWdncmVnYXRpb24/LkNvbnRleHREZWZpbmluZ1Byb3BlcnRpZXM7XG5cdFx0XHRtQ3VzdG9tQWdncmVnYXRlc1thQ3VzdG9tQWdncmVnYXRlc1tpXS5xdWFsaWZpZXJdID0ge1xuXHRcdFx0XHRuYW1lOiBhQ3VzdG9tQWdncmVnYXRlc1tpXS5xdWFsaWZpZXIsXG5cdFx0XHRcdGxhYmVsOiBcIkN1c3RvbSBBZ2dyZWdhdGUgKFwiICsgYUN1c3RvbUFnZ3JlZ2F0ZXNbaV0ucXVhbGlmaWVyICsgXCIpXCIsXG5cdFx0XHRcdHNvcnRhYmxlOiB0cnVlLFxuXHRcdFx0XHRzb3J0T3JkZXI6IFwiYm90aFwiLFxuXHRcdFx0XHRjb250ZXh0RGVmaW5pbmdQcm9wZXJ0eTogYUNvbnRleHREZWZpbmluZ1Byb3BlcnRpZXNcblx0XHRcdFx0XHQ/IGFDb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzLm1hcChvQ3R4RGVmUHJvcGVydHkgPT4ge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gb0N0eERlZlByb3BlcnR5LnZhbHVlO1xuXHRcdFx0XHRcdCAgfSlcblx0XHRcdFx0XHQ6IFtdXG5cdFx0XHR9O1xuXHRcdH1cblx0fVxuXG5cdGNvbnN0IGFUcmFuc0FnZ3JlZ2F0aW9ucyA9IGFnZ3JlZ2F0aW9uSGVscGVyLmdldFRyYW5zQWdncmVnYXRpb25zKClbMF07XG5cdGNvbnN0IG1UcmFuc0FnZ3JlZ2F0aW9ucyA9IHt9IGFzIGFueTtcblx0aWYgKGFUcmFuc0FnZ3JlZ2F0aW9ucykge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYVRyYW5zQWdncmVnYXRpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRtVHJhbnNBZ2dyZWdhdGlvbnNbYVRyYW5zQWdncmVnYXRpb25zW2ldLk5hbWVdID0ge1xuXHRcdFx0XHRuYW1lOiBhVHJhbnNBZ2dyZWdhdGlvbnNbaV0uTmFtZSxcblx0XHRcdFx0cHJvcGVydHlQYXRoOiBhVHJhbnNBZ2dyZWdhdGlvbnNbaV0uQWdncmVnYXRhYmxlUHJvcGVydHkudmFsdWVPZigpLnZhbHVlLFxuXHRcdFx0XHRhZ2dyZWdhdGlvbk1ldGhvZDogYVRyYW5zQWdncmVnYXRpb25zW2ldLkFnZ3JlZ2F0aW9uTWV0aG9kLFxuXHRcdFx0XHRsYWJlbDpcblx0XHRcdFx0XHRhVHJhbnNBZ2dyZWdhdGlvbnNbaV0uTmFtZSBpbiB0cmFuc0FnZ0xhYmVsc1xuXHRcdFx0XHRcdFx0PyB0cmFuc0FnZ0xhYmVsc1thVHJhbnNBZ2dyZWdhdGlvbnNbaV0uTmFtZV0ubGFiZWxcblx0XHRcdFx0XHRcdDogXCJBZ2dyZWdhdGFibGUgcHJvcGVydHkgKFwiICsgYVRyYW5zQWdncmVnYXRpb25zW2ldLk5hbWUgKyBcIilcIixcblx0XHRcdFx0c29ydGFibGU6IHRydWUsXG5cdFx0XHRcdHNvcnRPcmRlcjogXCJib3RoXCIsXG5cdFx0XHRcdGN1c3RvbTogZmFsc2Vcblx0XHRcdH07XG5cdFx0fVxuXHR9XG5cblx0Y29uc3QgYUFnZ1Byb3BzID0gYWdncmVnYXRpb25IZWxwZXIuZ2V0QWdncmVnYXRhYmxlUHJvcGVydGllcygpO1xuXHRjb25zdCBhR3JwUHJvcHMgPSBhZ2dyZWdhdGlvbkhlbHBlci5nZXRHcm91cGFibGVQcm9wZXJ0aWVzKCk7XG5cdGNvbnN0IG1BcHBseVN1cHBvcnRlZCA9IHt9IGFzIGFueTtcblx0bUFwcGx5U3VwcG9ydGVkLiRUeXBlID0gXCJPcmcuT0RhdGEuQWdncmVnYXRpb24uVjEuQXBwbHlTdXBwb3J0ZWRUeXBlXCI7XG5cdG1BcHBseVN1cHBvcnRlZC5BZ2dyZWdhdGFibGVQcm9wZXJ0aWVzID0gW107XG5cdG1BcHBseVN1cHBvcnRlZC5Hcm91cGFibGVQcm9wZXJ0aWVzID0gW107XG5cblx0Zm9yIChsZXQgaSA9IDA7IGFBZ2dQcm9wcyAmJiBpIDwgYUFnZ1Byb3BzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y29uc3Qgb2JqID0ge1xuXHRcdFx0JFR5cGU6IGFBZ2dQcm9wc1tpXT8uJFR5cGUsXG5cdFx0XHRQcm9wZXJ0eToge1xuXHRcdFx0XHQkUHJvcGVydHlQYXRoOiBhQWdnUHJvcHNbaV0/LlByb3BlcnR5Py52YWx1ZVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRtQXBwbHlTdXBwb3J0ZWQuQWdncmVnYXRhYmxlUHJvcGVydGllcy5wdXNoKG9iaik7XG5cdH1cblxuXHRmb3IgKGxldCBpID0gMDsgYUdycFByb3BzICYmIGkgPCBhR3JwUHJvcHMubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCBvYmogPSB7ICRQcm9wZXJ0eVBhdGg6IGFHcnBQcm9wc1tpXT8udmFsdWUgfTtcblxuXHRcdG1BcHBseVN1cHBvcnRlZC5Hcm91cGFibGVQcm9wZXJ0aWVzLnB1c2gob2JqKTtcblx0fVxuXG5cdGNvbnN0IGNoYXJ0QWN0aW9ucyA9IGdldENoYXJ0QWN0aW9ucyhjaGFydEFubm90YXRpb24sIHZpc3VhbGl6YXRpb25QYXRoLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0bGV0IFtuYXZpZ2F0aW9uUHJvcGVydHlQYXRoIC8qLCBhbm5vdGF0aW9uUGF0aCovXSA9IHZpc3VhbGl6YXRpb25QYXRoLnNwbGl0KFwiQFwiKTtcblx0aWYgKG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGFzdEluZGV4T2YoXCIvXCIpID09PSBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLmxlbmd0aCAtIDEpIHtcblx0XHQvLyBEcm9wIHRyYWlsaW5nIHNsYXNoXG5cdFx0bmF2aWdhdGlvblByb3BlcnR5UGF0aCA9IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGguc3Vic3RyKDAsIG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGVuZ3RoIC0gMSk7XG5cdH1cblx0Y29uc3QgdGl0bGU6IGFueSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpLnRhcmdldEVudGl0eVR5cGUuYW5ub3RhdGlvbnM/LlVJPy5IZWFkZXJJbmZvPy5UeXBlTmFtZVBsdXJhbDtcblx0Y29uc3QgZGF0YU1vZGVsUGF0aCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpO1xuXHRjb25zdCBpc0VudGl0eVNldDogYm9vbGVhbiA9IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGVuZ3RoID09PSAwO1xuXHRjb25zdCBlbnRpdHlOYW1lOiBzdHJpbmcgPSBkYXRhTW9kZWxQYXRoLnRhcmdldEVudGl0eVNldCA/IGRhdGFNb2RlbFBhdGgudGFyZ2V0RW50aXR5U2V0Lm5hbWUgOiBkYXRhTW9kZWxQYXRoLnN0YXJ0aW5nRW50aXR5U2V0Lm5hbWU7XG5cdGNvbnN0IHNGaWx0ZXJiYXJJZCA9IGlzRW50aXR5U2V0ID8gRmlsdGVyQmFySUQoY29udmVydGVyQ29udGV4dC5nZXRDb250ZXh0UGF0aCgpKSA6IHVuZGVmaW5lZDtcblx0Y29uc3Qgb1ZpelByb3BlcnRpZXMgPSB7XG5cdFx0XCJsZWdlbmRHcm91cFwiOiB7XG5cdFx0XHRcImxheW91dFwiOiB7XG5cdFx0XHRcdFwicG9zaXRpb25cIjogXCJib3R0b21cIlxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0bGV0IGF1dG9CaW5kT25Jbml0OiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXHRpZiAoY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gVGVtcGxhdGVUeXBlLk9iamVjdFBhZ2UpIHtcblx0XHRhdXRvQmluZE9uSW5pdCA9IHRydWU7XG5cdH0gZWxzZSBpZiAoXG5cdFx0Y29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gVGVtcGxhdGVUeXBlLkxpc3RSZXBvcnQgfHxcblx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBUZW1wbGF0ZVR5cGUuQW5hbHl0aWNhbExpc3RQYWdlXG5cdCkge1xuXHRcdGF1dG9CaW5kT25Jbml0ID0gZmFsc2U7XG5cdH1cblx0Y29uc3QgaGFzTXVsdGlwbGVWaXN1YWxpemF0aW9ucyA9XG5cdFx0Y29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKS5oYXNNdWx0aXBsZVZpc3VhbGl6YXRpb25zKCkgfHwgY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gXCJBbmFseXRpY2FsTGlzdFBhZ2VcIjtcblx0Y29uc3Qgb25TZWdtZW50ZWRCdXR0b25QcmVzc2VkID0gaGFzTXVsdGlwbGVWaXN1YWxpemF0aW9ucyA/IFwiLmhhbmRsZXJzLm9uU2VnbWVudGVkQnV0dG9uUHJlc3NlZFwiIDogXCJcIjtcblx0Y29uc3QgdmlzaWJsZSA9IGhhc011bHRpcGxlVmlzdWFsaXphdGlvbnMgPyBcIns9ICR7cGFnZUludGVybmFsPmFscENvbnRlbnRWaWV3fSAhPT0gJ1RhYmxlJ31cIiA6IFwidHJ1ZVwiO1xuXHRyZXR1cm4ge1xuXHRcdHR5cGU6IFZpc3VhbGl6YXRpb25UeXBlLkNoYXJ0LFxuXHRcdGlkOiBDaGFydElEKGlzRW50aXR5U2V0ID8gZW50aXR5TmFtZSA6IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgsIFZpc3VhbGl6YXRpb25UeXBlLkNoYXJ0KSxcblx0XHRjb2xsZWN0aW9uOiBnZXRUYXJnZXRPYmplY3RQYXRoKGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpKSxcblx0XHRlbnRpdHlOYW1lOiBlbnRpdHlOYW1lLFxuXHRcdHBlcnNvbmFsaXphdGlvbjogZ2V0UDEzbk1vZGUodmlzdWFsaXphdGlvblBhdGgsIGNvbnZlcnRlckNvbnRleHQpLFxuXHRcdG5hdmlnYXRpb25QYXRoOiBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLFxuXHRcdGFubm90YXRpb25QYXRoOiBjb252ZXJ0ZXJDb250ZXh0LmdldEFic29sdXRlQW5ub3RhdGlvblBhdGgodmlzdWFsaXphdGlvblBhdGgpLFxuXHRcdGZpbHRlcklkOiBzRmlsdGVyYmFySWQsXG5cdFx0dml6UHJvcGVydGllczogSlNPTi5zdHJpbmdpZnkob1ZpelByb3BlcnRpZXMpLFxuXHRcdGFjdGlvbnM6IGNoYXJ0QWN0aW9ucyxcblx0XHR0aXRsZTogdGl0bGUsXG5cdFx0YXV0b0JpbmRPbkluaXQ6IGF1dG9CaW5kT25Jbml0LFxuXHRcdG9uU2VnbWVudGVkQnV0dG9uUHJlc3NlZDogb25TZWdtZW50ZWRCdXR0b25QcmVzc2VkLFxuXHRcdHZpc2libGU6IHZpc2libGUsXG5cdFx0Y3VzdG9tQWdnOiBtQ3VzdG9tQWdncmVnYXRlcyxcblx0XHR0cmFuc0FnZzogbVRyYW5zQWdncmVnYXRpb25zLFxuXHRcdGFwcGx5U3VwcG9ydGVkOiBtQXBwbHlTdXBwb3J0ZWRcblx0fTtcbn1cbiJdfQ==