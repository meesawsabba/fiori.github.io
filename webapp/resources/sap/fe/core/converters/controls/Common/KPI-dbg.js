/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["../../helpers/ID", "sap/fe/core/templating/PropertyHelper", "sap/fe/core/formatters/TableFormatterTypes", "../../helpers/Aggregation", "sap/fe/core/converters/helpers/IssueManager", "./Criticality", "sap/fe/core/converters/helpers/SelectionVariantHelper"], function (ID, PropertyHelper, TableFormatterTypes, Aggregation, IssueManager, Criticality, SelectionVariantHelper) {
  "use strict";

  var _exports = {};
  var getFilterDefinitionsFromSelectionVariant = SelectionVariantHelper.getFilterDefinitionsFromSelectionVariant;
  var getMessageTypeFromCriticalityType = Criticality.getMessageTypeFromCriticalityType;
  var IssueType = IssueManager.IssueType;
  var IssueSeverity = IssueManager.IssueSeverity;
  var IssueCategory = IssueManager.IssueCategory;
  var AggregationHelper = Aggregation.AggregationHelper;
  var MessageType = TableFormatterTypes.MessageType;
  var isPathExpression = PropertyHelper.isPathExpression;
  var KPIID = ID.KPIID;

  var DeviationIndicatorFromTrendType = {
    "UI.TrendType/StrongUp": "Up",
    "UI.TrendType/Up": "Up",
    "UI.TrendType/StrongDown": "Down",
    "UI.TrendType/Down": "Down",
    "UI.TrendType/Sideways": "None"
  };
  var KPIChartTypeFromUI = {
    "UI.ChartType/ColumnStacked": "StackedColumn",
    "UI.ChartType/BarStacked": "StackedBar",
    "UI.ChartType/Donut": "Donut",
    "UI.ChartType/Line": "Line",
    "UI.ChartType/Bubble": "bubble",
    "UI.ChartType/Column": "column",
    "UI.ChartType/Bar": "bar",
    "UI.ChartType/VerticalBullet": "vertical_bullet",
    "UI.ChartType/Combination": "combination",
    "UI.ChartType/Scatter": "scatter"
  };

  function convertKPIChart(chartAnnotation, presentationVariantAnnotation) {
    var _presentationVariantA, _presentationVariantA2;

    if (chartAnnotation.Measures === undefined) {
      // We need at least 1 measure (but no dimension is allowed, e.g. for bubble chart)
      return undefined;
    }

    var charDimensions = chartAnnotation.Dimensions ? chartAnnotation.Dimensions.map(function (propertyPath) {
      var _chartAnnotation$Dime, _propertyPath$$target, _propertyPath$$target2, _dimAttribute$Role;

      var dimAttribute = (_chartAnnotation$Dime = chartAnnotation.DimensionAttributes) === null || _chartAnnotation$Dime === void 0 ? void 0 : _chartAnnotation$Dime.find(function (attribute) {
        var _attribute$Dimension;

        return ((_attribute$Dimension = attribute.Dimension) === null || _attribute$Dimension === void 0 ? void 0 : _attribute$Dimension.value) === propertyPath.value;
      });
      return {
        name: propertyPath.value,
        label: ((_propertyPath$$target = propertyPath.$target.annotations.Common) === null || _propertyPath$$target === void 0 ? void 0 : (_propertyPath$$target2 = _propertyPath$$target.Label) === null || _propertyPath$$target2 === void 0 ? void 0 : _propertyPath$$target2.toString()) || propertyPath.value,
        role: dimAttribute === null || dimAttribute === void 0 ? void 0 : (_dimAttribute$Role = dimAttribute.Role) === null || _dimAttribute$Role === void 0 ? void 0 : _dimAttribute$Role.replace("UI.ChartDimensionRoleType/", "")
      };
    }) : [];
    var chartMeasures = chartAnnotation.Measures.map(function (propertyPath) {
      var _chartAnnotation$Meas, _propertyPath$$target3, _propertyPath$$target4, _measureAttribute$Rol;

      var measureAttribute = (_chartAnnotation$Meas = chartAnnotation.MeasureAttributes) === null || _chartAnnotation$Meas === void 0 ? void 0 : _chartAnnotation$Meas.find(function (attribute) {
        var _attribute$Measure;

        return ((_attribute$Measure = attribute.Measure) === null || _attribute$Measure === void 0 ? void 0 : _attribute$Measure.value) === propertyPath.value;
      });
      return {
        name: propertyPath.value,
        label: ((_propertyPath$$target3 = propertyPath.$target.annotations.Common) === null || _propertyPath$$target3 === void 0 ? void 0 : (_propertyPath$$target4 = _propertyPath$$target3.Label) === null || _propertyPath$$target4 === void 0 ? void 0 : _propertyPath$$target4.toString()) || propertyPath.value,
        role: measureAttribute === null || measureAttribute === void 0 ? void 0 : (_measureAttribute$Rol = measureAttribute.Role) === null || _measureAttribute$Rol === void 0 ? void 0 : _measureAttribute$Rol.replace("UI.ChartMeasureRoleType/", "")
      };
    });
    return {
      chartType: KPIChartTypeFromUI[chartAnnotation.ChartType] || "Line",
      dimensions: charDimensions,
      measures: chartMeasures,
      sortOrder: presentationVariantAnnotation === null || presentationVariantAnnotation === void 0 ? void 0 : (_presentationVariantA = presentationVariantAnnotation.SortOrder) === null || _presentationVariantA === void 0 ? void 0 : _presentationVariantA.map(function (sortOrder) {
        var _sortOrder$Property;

        return {
          name: ((_sortOrder$Property = sortOrder.Property) === null || _sortOrder$Property === void 0 ? void 0 : _sortOrder$Property.value) || "",
          descending: !!sortOrder.Descending
        };
      }),
      maxItems: presentationVariantAnnotation === null || presentationVariantAnnotation === void 0 ? void 0 : (_presentationVariantA2 = presentationVariantAnnotation.MaxItems) === null || _presentationVariantA2 === void 0 ? void 0 : _presentationVariantA2.valueOf()
    };
  }

  function updateCurrency(datapointAnnotation, kpiDef) {
    var _targetValueProperty$, _targetValueProperty$3;

    var targetValueProperty = datapointAnnotation.Value.$target;

    if ((_targetValueProperty$ = targetValueProperty.annotations.Measures) !== null && _targetValueProperty$ !== void 0 && _targetValueProperty$.ISOCurrency) {
      var _targetValueProperty$2;

      var currency = (_targetValueProperty$2 = targetValueProperty.annotations.Measures) === null || _targetValueProperty$2 === void 0 ? void 0 : _targetValueProperty$2.ISOCurrency;

      if (isPathExpression(currency)) {
        kpiDef.datapoint.unit = {
          value: currency.$target.name,
          isCurrency: true,
          isPath: true
        };
      } else {
        kpiDef.datapoint.unit = {
          value: currency.toString(),
          isCurrency: true,
          isPath: false
        };
      }
    } else if ((_targetValueProperty$3 = targetValueProperty.annotations.Measures) !== null && _targetValueProperty$3 !== void 0 && _targetValueProperty$3.Unit) {
      var _targetValueProperty$4;

      var unit = (_targetValueProperty$4 = targetValueProperty.annotations.Measures) === null || _targetValueProperty$4 === void 0 ? void 0 : _targetValueProperty$4.Unit;

      if (isPathExpression(unit)) {
        kpiDef.datapoint.unit = {
          value: unit.$target.name,
          isCurrency: false,
          isPath: true
        };
      } else {
        kpiDef.datapoint.unit = {
          value: unit.toString(),
          isCurrency: false,
          isPath: false
        };
      }
    }
  }

  function updateCriticality(datapointAnnotation, aggregationHelper, kpiDef) {
    if (datapointAnnotation.Criticality) {
      if (typeof datapointAnnotation.Criticality === "object") {
        // Criticality is a path --> check if the corresponding property is aggregatable
        var criticalityProperty = datapointAnnotation.Criticality.$target;

        if (aggregationHelper.isPropertyAggregatable(criticalityProperty)) {
          kpiDef.datapoint.criticalityPath = datapointAnnotation.Criticality.path;
        } else {
          // The property isn't aggregatable --> we ignore it
          kpiDef.datapoint.criticalityValue = MessageType.None;
        }
      } else {
        // Criticality is an enum Value --> get the corresponding static value
        kpiDef.datapoint.criticalityValue = getMessageTypeFromCriticalityType(datapointAnnotation.Criticality);
      }
    } else if (datapointAnnotation.CriticalityCalculation) {
      kpiDef.datapoint.criticalityCalculationMode = datapointAnnotation.CriticalityCalculation.ImprovementDirection;
      kpiDef.datapoint.criticalityCalculationThresholds = [];

      switch (kpiDef.datapoint.criticalityCalculationMode) {
        case "UI.ImprovementDirectionType/Target":
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.DeviationRangeLowValue);
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.ToleranceRangeLowValue);
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.AcceptanceRangeLowValue);
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.AcceptanceRangeHighValue);
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.ToleranceRangeHighValue);
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.DeviationRangeHighValue);
          break;

        case "UI.ImprovementDirectionType/Minimize":
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.AcceptanceRangeHighValue);
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.ToleranceRangeHighValue);
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.DeviationRangeHighValue);
          break;

        case "UI.ImprovementDirectionType/Maximize":
        default:
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.DeviationRangeLowValue);
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.ToleranceRangeLowValue);
          kpiDef.datapoint.criticalityCalculationThresholds.push(datapointAnnotation.CriticalityCalculation.AcceptanceRangeLowValue);
      }
    } else {
      kpiDef.datapoint.criticalityValue = MessageType.None;
    }
  }

  function updateTrend(datapointAnnotation, aggregationHelper, kpiDef) {
    if (datapointAnnotation.Trend) {
      if (typeof datapointAnnotation.Trend === "object") {
        // Trend is a path --> check if the corresponding property is aggregatable
        var trendProperty = datapointAnnotation.Trend.$target;

        if (aggregationHelper.isPropertyAggregatable(trendProperty)) {
          kpiDef.datapoint.trendPath = datapointAnnotation.Trend.path;
        } else {
          // The property isn't aggregatable --> we ignore it
          kpiDef.datapoint.trendValue = "None";
        }
      } else {
        // Trend is an enum Value --> get the corresponding static value
        kpiDef.datapoint.trendValue = DeviationIndicatorFromTrendType[datapointAnnotation.Trend] || "None";
      }
    } else if (datapointAnnotation.TrendCalculation) {
      kpiDef.datapoint.trendCalculationIsRelative = datapointAnnotation.TrendCalculation.IsRelativeDifference ? true : false;

      if (datapointAnnotation.TrendCalculation.ReferenceValue.$target) {
        // Reference value is a path --> check if the corresponding property is aggregatable
        var referenceProperty = datapointAnnotation.TrendCalculation.ReferenceValue.$target;

        if (aggregationHelper.isPropertyAggregatable(referenceProperty)) {
          kpiDef.datapoint.trendCalculationReferencePath = datapointAnnotation.TrendCalculation.ReferenceValue.path;
        } else {
          // The property isn't aggregatable --> we ignore it and switch back to trend 'None'
          kpiDef.datapoint.trendValue = "None";
        }
      } else {
        // Reference value is a static value
        kpiDef.datapoint.trendCalculationReferenceValue = datapointAnnotation.TrendCalculation.ReferenceValue;
      }

      if (kpiDef.datapoint.trendCalculationReferencePath !== undefined || kpiDef.datapoint.trendCalculationReferenceValue !== undefined) {
        kpiDef.datapoint.trendCalculationTresholds = [datapointAnnotation.TrendCalculation.StrongDownDifference.valueOf(), datapointAnnotation.TrendCalculation.DownDifference.valueOf(), datapointAnnotation.TrendCalculation.UpDifference.valueOf(), datapointAnnotation.TrendCalculation.StrongUpDifference.valueOf()];
      }
    } else {
      kpiDef.datapoint.trendValue = "None";
    }
  }

  function updateTarget(datapointAnnotation, aggregationHelper, kpiDef) {
    if (datapointAnnotation.TargetValue) {
      if (datapointAnnotation.TargetValue.$target) {
        // Target value is a path --> check if the corresponding property is aggregatable (otherwise ignore)
        var targetProperty = datapointAnnotation.TargetValue.$target;

        if (aggregationHelper.isPropertyAggregatable(targetProperty)) {
          kpiDef.datapoint.targetPath = datapointAnnotation.TargetValue.path;
        }
      } else {
        // Target value is a static value
        kpiDef.datapoint.targetValue = datapointAnnotation.TargetValue;
      }
    }
  }

  function createKPIDefinition(kpiName, kpiConfig, converterContext) {
    var _datapointAnnotation$, _datapointAnnotation$2;

    var kpiConverterContext = converterContext.getConverterContextFor("/" + kpiConfig.entitySet);
    var aggregationHelper = new AggregationHelper(kpiConverterContext.getEntityType(), kpiConverterContext);

    if (!aggregationHelper.isAnalyticsSupported()) {
      // The entity doesn't support analytical queries
      converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.Medium, IssueType.KPI_ISSUES.NO_ANALYTICS + kpiConfig.entitySet);
      return undefined;
    }

    var selectionVariantAnnotation;
    var datapointAnnotation;
    var presentationVariantAnnotation;
    var chartAnnotation; // Search for a KPI with the qualifier frmo the manifest

    var aKPIAnnotations = kpiConverterContext.getAnnotationsByTerm("UI", "com.sap.vocabularies.UI.v1.KPI");
    var targetKPI = aKPIAnnotations.find(function (kpi) {
      return kpi.qualifier === kpiConfig.qualifier;
    });

    if (targetKPI) {
      var _targetKPI$Detail, _presentationVariantA3, _presentationVariantA4, _presentationVariantA5;

      datapointAnnotation = targetKPI.DataPoint;
      selectionVariantAnnotation = targetKPI.SelectionVariant;
      presentationVariantAnnotation = (_targetKPI$Detail = targetKPI.Detail) === null || _targetKPI$Detail === void 0 ? void 0 : _targetKPI$Detail.DefaultPresentationVariant;
      chartAnnotation = (_presentationVariantA3 = presentationVariantAnnotation) === null || _presentationVariantA3 === void 0 ? void 0 : (_presentationVariantA4 = _presentationVariantA3.Visualizations) === null || _presentationVariantA4 === void 0 ? void 0 : (_presentationVariantA5 = _presentationVariantA4.find(function (viz) {
        return viz.$target.$Type === "com.sap.vocabularies.UI.v1.ChartDefinitionType";
      })) === null || _presentationVariantA5 === void 0 ? void 0 : _presentationVariantA5.$target;
    } else {
      // Fallback: try to find a SPV with the same qualifier
      var aSPVAnnotations = kpiConverterContext.getAnnotationsByTerm("UI", "com.sap.vocabularies.UI.v1.SelectionPresentationVariant");
      var targetSPV = aSPVAnnotations.find(function (spv) {
        return spv.qualifier === kpiConfig.qualifier;
      });

      if (targetSPV) {
        var _presentationVariantA6, _presentationVariantA7, _presentationVariantA8, _presentationVariantA9, _presentationVariantA10, _presentationVariantA11;

        selectionVariantAnnotation = targetSPV.SelectionVariant;
        presentationVariantAnnotation = targetSPV.PresentationVariant;
        datapointAnnotation = (_presentationVariantA6 = presentationVariantAnnotation) === null || _presentationVariantA6 === void 0 ? void 0 : (_presentationVariantA7 = _presentationVariantA6.Visualizations) === null || _presentationVariantA7 === void 0 ? void 0 : (_presentationVariantA8 = _presentationVariantA7.find(function (viz) {
          return viz.$target.$Type === "com.sap.vocabularies.UI.v1.DataPointType";
        })) === null || _presentationVariantA8 === void 0 ? void 0 : _presentationVariantA8.$target;
        chartAnnotation = (_presentationVariantA9 = presentationVariantAnnotation) === null || _presentationVariantA9 === void 0 ? void 0 : (_presentationVariantA10 = _presentationVariantA9.Visualizations) === null || _presentationVariantA10 === void 0 ? void 0 : (_presentationVariantA11 = _presentationVariantA10.find(function (viz) {
          return viz.$target.$Type === "com.sap.vocabularies.UI.v1.ChartDefinitionType";
        })) === null || _presentationVariantA11 === void 0 ? void 0 : _presentationVariantA11.$target;
      } else {
        // Couldn't find a KPI or a SPV annotation with the qualifier from the manifest
        converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.Medium, IssueType.KPI_ISSUES.KPI_NOT_FOUND + kpiConfig.qualifier);
        return undefined;
      }
    }

    if (!presentationVariantAnnotation || !datapointAnnotation || !chartAnnotation) {
      // Couldn't find a chart or datapoint definition
      converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.Medium, IssueType.KPI_ISSUES.KPI_DETAIL_NOT_FOUND + kpiConfig.qualifier);
      return undefined;
    }

    var datapointProperty = datapointAnnotation.Value.$target;

    if (!aggregationHelper.isPropertyAggregatable(datapointProperty)) {
      // The main property of the KPI is not aggregatable --> We can't calculate its value so we ignore the KPI
      converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.Medium, IssueType.KPI_ISSUES.MAIN_PROPERTY_NOT_AGGREGATABLE + kpiConfig.qualifier);
      return undefined;
    } // Chart definition


    var chartDef = convertKPIChart(chartAnnotation, presentationVariantAnnotation);

    if (!chartDef) {
      return undefined;
    }

    var kpiDef = {
      id: KPIID(kpiName),
      entitySet: kpiConfig.entitySet,
      datapoint: {
        propertyPath: datapointAnnotation.Value.path,
        annotationPath: kpiConverterContext.getEntitySetBasedAnnotationPath(datapointAnnotation.fullyQualifiedName),
        title: (_datapointAnnotation$ = datapointAnnotation.Title) === null || _datapointAnnotation$ === void 0 ? void 0 : _datapointAnnotation$.toString(),
        description: (_datapointAnnotation$2 = datapointAnnotation.Description) === null || _datapointAnnotation$2 === void 0 ? void 0 : _datapointAnnotation$2.toString()
      },
      selectionVariantFilterDefinitions: selectionVariantAnnotation ? getFilterDefinitionsFromSelectionVariant(selectionVariantAnnotation) : undefined,
      chart: chartDef
    };
    updateCurrency(datapointAnnotation, kpiDef);
    updateCriticality(datapointAnnotation, aggregationHelper, kpiDef);
    updateTrend(datapointAnnotation, aggregationHelper, kpiDef);
    updateTarget(datapointAnnotation, aggregationHelper, kpiDef);
    return kpiDef;
  }
  /**
   * Creates the KPI definitions from the manifest and the annotations.
   *
   * @param {ConverterContext} converterContext The converter context for the page
   * @returns {KPIDefinition[]} Returns an array of KPI definitions
   */


  function getKPIDefinitions(converterContext) {
    var kpiConfigs = converterContext.getManifestWrapper().getKPIConfiguration(),
        kpiDefs = [];
    Object.keys(kpiConfigs).forEach(function (kpiName) {
      var oDef = createKPIDefinition(kpiName, kpiConfigs[kpiName], converterContext);

      if (oDef) {
        kpiDefs.push(oDef);
      }
    });
    return kpiDefs;
  }

  _exports.getKPIDefinitions = getKPIDefinitions;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIktQSS50cyJdLCJuYW1lcyI6WyJEZXZpYXRpb25JbmRpY2F0b3JGcm9tVHJlbmRUeXBlIiwiS1BJQ2hhcnRUeXBlRnJvbVVJIiwiY29udmVydEtQSUNoYXJ0IiwiY2hhcnRBbm5vdGF0aW9uIiwicHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24iLCJNZWFzdXJlcyIsInVuZGVmaW5lZCIsImNoYXJEaW1lbnNpb25zIiwiRGltZW5zaW9ucyIsIm1hcCIsInByb3BlcnR5UGF0aCIsImRpbUF0dHJpYnV0ZSIsIkRpbWVuc2lvbkF0dHJpYnV0ZXMiLCJmaW5kIiwiYXR0cmlidXRlIiwiRGltZW5zaW9uIiwidmFsdWUiLCJuYW1lIiwibGFiZWwiLCIkdGFyZ2V0IiwiYW5ub3RhdGlvbnMiLCJDb21tb24iLCJMYWJlbCIsInRvU3RyaW5nIiwicm9sZSIsIlJvbGUiLCJyZXBsYWNlIiwiY2hhcnRNZWFzdXJlcyIsIm1lYXN1cmVBdHRyaWJ1dGUiLCJNZWFzdXJlQXR0cmlidXRlcyIsIk1lYXN1cmUiLCJjaGFydFR5cGUiLCJDaGFydFR5cGUiLCJkaW1lbnNpb25zIiwibWVhc3VyZXMiLCJzb3J0T3JkZXIiLCJTb3J0T3JkZXIiLCJQcm9wZXJ0eSIsImRlc2NlbmRpbmciLCJEZXNjZW5kaW5nIiwibWF4SXRlbXMiLCJNYXhJdGVtcyIsInZhbHVlT2YiLCJ1cGRhdGVDdXJyZW5jeSIsImRhdGFwb2ludEFubm90YXRpb24iLCJrcGlEZWYiLCJ0YXJnZXRWYWx1ZVByb3BlcnR5IiwiVmFsdWUiLCJJU09DdXJyZW5jeSIsImN1cnJlbmN5IiwiaXNQYXRoRXhwcmVzc2lvbiIsImRhdGFwb2ludCIsInVuaXQiLCJpc0N1cnJlbmN5IiwiaXNQYXRoIiwiVW5pdCIsInVwZGF0ZUNyaXRpY2FsaXR5IiwiYWdncmVnYXRpb25IZWxwZXIiLCJDcml0aWNhbGl0eSIsImNyaXRpY2FsaXR5UHJvcGVydHkiLCJpc1Byb3BlcnR5QWdncmVnYXRhYmxlIiwiY3JpdGljYWxpdHlQYXRoIiwicGF0aCIsImNyaXRpY2FsaXR5VmFsdWUiLCJNZXNzYWdlVHlwZSIsIk5vbmUiLCJnZXRNZXNzYWdlVHlwZUZyb21Dcml0aWNhbGl0eVR5cGUiLCJDcml0aWNhbGl0eUNhbGN1bGF0aW9uIiwiY3JpdGljYWxpdHlDYWxjdWxhdGlvbk1vZGUiLCJJbXByb3ZlbWVudERpcmVjdGlvbiIsImNyaXRpY2FsaXR5Q2FsY3VsYXRpb25UaHJlc2hvbGRzIiwicHVzaCIsIkRldmlhdGlvblJhbmdlTG93VmFsdWUiLCJUb2xlcmFuY2VSYW5nZUxvd1ZhbHVlIiwiQWNjZXB0YW5jZVJhbmdlTG93VmFsdWUiLCJBY2NlcHRhbmNlUmFuZ2VIaWdoVmFsdWUiLCJUb2xlcmFuY2VSYW5nZUhpZ2hWYWx1ZSIsIkRldmlhdGlvblJhbmdlSGlnaFZhbHVlIiwidXBkYXRlVHJlbmQiLCJUcmVuZCIsInRyZW5kUHJvcGVydHkiLCJ0cmVuZFBhdGgiLCJ0cmVuZFZhbHVlIiwiVHJlbmRDYWxjdWxhdGlvbiIsInRyZW5kQ2FsY3VsYXRpb25Jc1JlbGF0aXZlIiwiSXNSZWxhdGl2ZURpZmZlcmVuY2UiLCJSZWZlcmVuY2VWYWx1ZSIsInJlZmVyZW5jZVByb3BlcnR5IiwidHJlbmRDYWxjdWxhdGlvblJlZmVyZW5jZVBhdGgiLCJ0cmVuZENhbGN1bGF0aW9uUmVmZXJlbmNlVmFsdWUiLCJ0cmVuZENhbGN1bGF0aW9uVHJlc2hvbGRzIiwiU3Ryb25nRG93bkRpZmZlcmVuY2UiLCJEb3duRGlmZmVyZW5jZSIsIlVwRGlmZmVyZW5jZSIsIlN0cm9uZ1VwRGlmZmVyZW5jZSIsInVwZGF0ZVRhcmdldCIsIlRhcmdldFZhbHVlIiwidGFyZ2V0UHJvcGVydHkiLCJ0YXJnZXRQYXRoIiwidGFyZ2V0VmFsdWUiLCJjcmVhdGVLUElEZWZpbml0aW9uIiwia3BpTmFtZSIsImtwaUNvbmZpZyIsImNvbnZlcnRlckNvbnRleHQiLCJrcGlDb252ZXJ0ZXJDb250ZXh0IiwiZ2V0Q29udmVydGVyQ29udGV4dEZvciIsImVudGl0eVNldCIsIkFnZ3JlZ2F0aW9uSGVscGVyIiwiZ2V0RW50aXR5VHlwZSIsImlzQW5hbHl0aWNzU3VwcG9ydGVkIiwiZ2V0RGlhZ25vc3RpY3MiLCJhZGRJc3N1ZSIsIklzc3VlQ2F0ZWdvcnkiLCJBbm5vdGF0aW9uIiwiSXNzdWVTZXZlcml0eSIsIk1lZGl1bSIsIklzc3VlVHlwZSIsIktQSV9JU1NVRVMiLCJOT19BTkFMWVRJQ1MiLCJzZWxlY3Rpb25WYXJpYW50QW5ub3RhdGlvbiIsImFLUElBbm5vdGF0aW9ucyIsImdldEFubm90YXRpb25zQnlUZXJtIiwidGFyZ2V0S1BJIiwia3BpIiwicXVhbGlmaWVyIiwiRGF0YVBvaW50IiwiU2VsZWN0aW9uVmFyaWFudCIsIkRldGFpbCIsIkRlZmF1bHRQcmVzZW50YXRpb25WYXJpYW50IiwiVmlzdWFsaXphdGlvbnMiLCJ2aXoiLCIkVHlwZSIsImFTUFZBbm5vdGF0aW9ucyIsInRhcmdldFNQViIsInNwdiIsIlByZXNlbnRhdGlvblZhcmlhbnQiLCJLUElfTk9UX0ZPVU5EIiwiS1BJX0RFVEFJTF9OT1RfRk9VTkQiLCJkYXRhcG9pbnRQcm9wZXJ0eSIsIk1BSU5fUFJPUEVSVFlfTk9UX0FHR1JFR0FUQUJMRSIsImNoYXJ0RGVmIiwiaWQiLCJLUElJRCIsImFubm90YXRpb25QYXRoIiwiZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aCIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsInRpdGxlIiwiVGl0bGUiLCJkZXNjcmlwdGlvbiIsIkRlc2NyaXB0aW9uIiwic2VsZWN0aW9uVmFyaWFudEZpbHRlckRlZmluaXRpb25zIiwiZ2V0RmlsdGVyRGVmaW5pdGlvbnNGcm9tU2VsZWN0aW9uVmFyaWFudCIsImNoYXJ0IiwiZ2V0S1BJRGVmaW5pdGlvbnMiLCJrcGlDb25maWdzIiwiZ2V0TWFuaWZlc3RXcmFwcGVyIiwiZ2V0S1BJQ29uZmlndXJhdGlvbiIsImtwaURlZnMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsIm9EZWYiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7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LE9BQVA7QUFDQSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgS1BJQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9NYW5pZmVzdFNldHRpbmdzXCI7XG5pbXBvcnQgeyBQcm9wZXJ0eSB9IGZyb20gXCJAc2FwLXV4L2Fubm90YXRpb24tY29udmVydGVyXCI7XG5pbXBvcnQge1xuXHRBbm5vdGF0aW9uVGVybSxcblx0VUlBbm5vdGF0aW9uVGVybXMsXG5cdFVJQW5ub3RhdGlvblR5cGVzLFxuXHRQYXRoQW5ub3RhdGlvbkV4cHJlc3Npb24sXG5cdENyaXRpY2FsaXR5VHlwZSxcblx0SW1wcm92ZW1lbnREaXJlY3Rpb25UeXBlXG59IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHtcblx0S1BJVHlwZSxcblx0U2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudFR5cGUsXG5cdFByZXNlbnRhdGlvblZhcmlhbnQsXG5cdFNlbGVjdGlvblZhcmlhbnQsXG5cdERhdGFQb2ludCxcblx0Q2hhcnQsXG5cdFRyZW5kVHlwZVxufSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvZGlzdC9nZW5lcmF0ZWQvVUlcIjtcbmltcG9ydCB7IFByb3BlcnR5UGF0aCB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy9kaXN0L0VkbVwiO1xuaW1wb3J0IENvbnZlcnRlckNvbnRleHQgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvQ29udmVydGVyQ29udGV4dFwiO1xuaW1wb3J0IHsgS1BJSUQgfSBmcm9tIFwiLi4vLi4vaGVscGVycy9JRFwiO1xuaW1wb3J0IHsgaXNQYXRoRXhwcmVzc2lvbiB9IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL1Byb3BlcnR5SGVscGVyXCI7XG5pbXBvcnQgeyBNZXNzYWdlVHlwZSB9IGZyb20gXCJzYXAvZmUvY29yZS9mb3JtYXR0ZXJzL1RhYmxlRm9ybWF0dGVyVHlwZXNcIjtcbmltcG9ydCB7IEFnZ3JlZ2F0aW9uSGVscGVyIH0gZnJvbSBcIi4uLy4uL2hlbHBlcnMvQWdncmVnYXRpb25cIjtcbmltcG9ydCB7IElzc3VlQ2F0ZWdvcnksIElzc3VlU2V2ZXJpdHksIElzc3VlVHlwZSB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvSXNzdWVNYW5hZ2VyXCI7XG5pbXBvcnQgeyBnZXRNZXNzYWdlVHlwZUZyb21Dcml0aWNhbGl0eVR5cGUgfSBmcm9tIFwiLi9Dcml0aWNhbGl0eVwiO1xuaW1wb3J0IHsgZ2V0RmlsdGVyRGVmaW5pdGlvbnNGcm9tU2VsZWN0aW9uVmFyaWFudCwgRmlsdGVyRGVmaW5pdGlvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvU2VsZWN0aW9uVmFyaWFudEhlbHBlclwiO1xuXG5leHBvcnQgdHlwZSBLUElDaGFydERlZmluaXRpb24gPSB7XG5cdGNoYXJ0VHlwZTogc3RyaW5nO1xuXHRkaW1lbnNpb25zOiB7IG5hbWU6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcm9sZT86IHN0cmluZyB9W107XG5cdG1lYXN1cmVzOiB7IG5hbWU6IHN0cmluZzsgbGFiZWw6IHN0cmluZzsgcm9sZT86IHN0cmluZyB9W107XG5cdHNvcnRPcmRlcj86IHsgbmFtZTogc3RyaW5nOyBkZXNjZW5kaW5nOiBib29sZWFuIH1bXTtcblx0bWF4SXRlbXM/OiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBLUElEZWZpbml0aW9uID0ge1xuXHRpZDogc3RyaW5nO1xuXHRlbnRpdHlTZXQ6IHN0cmluZztcblx0ZGF0YXBvaW50OiB7XG5cdFx0YW5ub3RhdGlvblBhdGg6IHN0cmluZztcblx0XHRwcm9wZXJ0eVBhdGg6IHN0cmluZztcblx0XHR1bml0Pzoge1xuXHRcdFx0dmFsdWU6IHN0cmluZztcblx0XHRcdGlzUGF0aDogYm9vbGVhbjtcblx0XHRcdGlzQ3VycmVuY3k6IGJvb2xlYW47XG5cdFx0fTtcblx0XHRjcml0aWNhbGl0eVBhdGg/OiBzdHJpbmc7XG5cdFx0Y3JpdGljYWxpdHlWYWx1ZT86IE1lc3NhZ2VUeXBlO1xuXHRcdGNyaXRpY2FsaXR5Q2FsY3VsYXRpb25Nb2RlPzogSW1wcm92ZW1lbnREaXJlY3Rpb25UeXBlO1xuXHRcdGNyaXRpY2FsaXR5Q2FsY3VsYXRpb25UaHJlc2hvbGRzPzogKG51bWJlciB8IHVuZGVmaW5lZCB8IG51bGwpW107XG5cdFx0dGl0bGU/OiBzdHJpbmc7XG5cdFx0ZGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cdFx0dHJlbmRQYXRoPzogc3RyaW5nO1xuXHRcdHRyZW5kVmFsdWU/OiBzdHJpbmc7XG5cdFx0dHJlbmRDYWxjdWxhdGlvblJlZmVyZW5jZVZhbHVlPzogbnVtYmVyO1xuXHRcdHRyZW5kQ2FsY3VsYXRpb25SZWZlcmVuY2VQYXRoPzogc3RyaW5nO1xuXHRcdHRyZW5kQ2FsY3VsYXRpb25UcmVzaG9sZHM/OiAobnVtYmVyIHwgdW5kZWZpbmVkIHwgbnVsbClbXTtcblx0XHR0cmVuZENhbGN1bGF0aW9uSXNSZWxhdGl2ZT86IGJvb2xlYW47XG5cdFx0dGFyZ2V0VmFsdWU/OiBudW1iZXI7XG5cdFx0dGFyZ2V0UGF0aD86IHN0cmluZztcblx0fTtcblx0Y2hhcnQ6IEtQSUNoYXJ0RGVmaW5pdGlvbjtcblx0c2VsZWN0aW9uVmFyaWFudEZpbHRlckRlZmluaXRpb25zPzogRmlsdGVyRGVmaW5pdGlvbltdO1xufTtcblxuY29uc3QgRGV2aWF0aW9uSW5kaWNhdG9yRnJvbVRyZW5kVHlwZTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcblx0XCJVSS5UcmVuZFR5cGUvU3Ryb25nVXBcIjogXCJVcFwiLFxuXHRcIlVJLlRyZW5kVHlwZS9VcFwiOiBcIlVwXCIsXG5cdFwiVUkuVHJlbmRUeXBlL1N0cm9uZ0Rvd25cIjogXCJEb3duXCIsXG5cdFwiVUkuVHJlbmRUeXBlL0Rvd25cIjogXCJEb3duXCIsXG5cdFwiVUkuVHJlbmRUeXBlL1NpZGV3YXlzXCI6IFwiTm9uZVwiXG59O1xuXG5jb25zdCBLUElDaGFydFR5cGVGcm9tVUk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG5cdFwiVUkuQ2hhcnRUeXBlL0NvbHVtblN0YWNrZWRcIjogXCJTdGFja2VkQ29sdW1uXCIsXG5cdFwiVUkuQ2hhcnRUeXBlL0JhclN0YWNrZWRcIjogXCJTdGFja2VkQmFyXCIsXG5cdFwiVUkuQ2hhcnRUeXBlL0RvbnV0XCI6IFwiRG9udXRcIixcblx0XCJVSS5DaGFydFR5cGUvTGluZVwiOiBcIkxpbmVcIixcblx0XCJVSS5DaGFydFR5cGUvQnViYmxlXCI6IFwiYnViYmxlXCIsXG5cdFwiVUkuQ2hhcnRUeXBlL0NvbHVtblwiOiBcImNvbHVtblwiLFxuXHRcIlVJLkNoYXJ0VHlwZS9CYXJcIjogXCJiYXJcIixcblx0XCJVSS5DaGFydFR5cGUvVmVydGljYWxCdWxsZXRcIjogXCJ2ZXJ0aWNhbF9idWxsZXRcIixcblx0XCJVSS5DaGFydFR5cGUvQ29tYmluYXRpb25cIjogXCJjb21iaW5hdGlvblwiLFxuXHRcIlVJLkNoYXJ0VHlwZS9TY2F0dGVyXCI6IFwic2NhdHRlclwiXG59O1xuXG5mdW5jdGlvbiBjb252ZXJ0S1BJQ2hhcnQoY2hhcnRBbm5vdGF0aW9uOiBDaGFydCwgcHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb246IFByZXNlbnRhdGlvblZhcmlhbnQpOiBLUElDaGFydERlZmluaXRpb24gfCB1bmRlZmluZWQge1xuXHRpZiAoY2hhcnRBbm5vdGF0aW9uLk1lYXN1cmVzID09PSB1bmRlZmluZWQpIHtcblx0XHQvLyBXZSBuZWVkIGF0IGxlYXN0IDEgbWVhc3VyZSAoYnV0IG5vIGRpbWVuc2lvbiBpcyBhbGxvd2VkLCBlLmcuIGZvciBidWJibGUgY2hhcnQpXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxuXG5cdGNvbnN0IGNoYXJEaW1lbnNpb25zID0gY2hhcnRBbm5vdGF0aW9uLkRpbWVuc2lvbnNcblx0XHQ/IChjaGFydEFubm90YXRpb24uRGltZW5zaW9ucyBhcyBQcm9wZXJ0eVBhdGhbXSkubWFwKHByb3BlcnR5UGF0aCA9PiB7XG5cdFx0XHRcdGNvbnN0IGRpbUF0dHJpYnV0ZSA9IGNoYXJ0QW5ub3RhdGlvbi5EaW1lbnNpb25BdHRyaWJ1dGVzPy5maW5kKGF0dHJpYnV0ZSA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIGF0dHJpYnV0ZS5EaW1lbnNpb24/LnZhbHVlID09PSBwcm9wZXJ0eVBhdGgudmFsdWU7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdG5hbWU6IHByb3BlcnR5UGF0aC52YWx1ZSxcblx0XHRcdFx0XHRsYWJlbDogcHJvcGVydHlQYXRoLiR0YXJnZXQuYW5ub3RhdGlvbnMuQ29tbW9uPy5MYWJlbD8udG9TdHJpbmcoKSB8fCBwcm9wZXJ0eVBhdGgudmFsdWUsXG5cdFx0XHRcdFx0cm9sZTogZGltQXR0cmlidXRlPy5Sb2xlPy5yZXBsYWNlKFwiVUkuQ2hhcnREaW1lbnNpb25Sb2xlVHlwZS9cIiwgXCJcIilcblx0XHRcdFx0fTtcblx0XHQgIH0pXG5cdFx0OiBbXTtcblxuXHRjb25zdCBjaGFydE1lYXN1cmVzID0gKGNoYXJ0QW5ub3RhdGlvbi5NZWFzdXJlcyBhcyBQcm9wZXJ0eVBhdGhbXSkubWFwKHByb3BlcnR5UGF0aCA9PiB7XG5cdFx0Y29uc3QgbWVhc3VyZUF0dHJpYnV0ZSA9IGNoYXJ0QW5ub3RhdGlvbi5NZWFzdXJlQXR0cmlidXRlcz8uZmluZChhdHRyaWJ1dGUgPT4ge1xuXHRcdFx0cmV0dXJuIGF0dHJpYnV0ZS5NZWFzdXJlPy52YWx1ZSA9PT0gcHJvcGVydHlQYXRoLnZhbHVlO1xuXHRcdH0pO1xuXHRcdHJldHVybiB7XG5cdFx0XHRuYW1lOiBwcm9wZXJ0eVBhdGgudmFsdWUsXG5cdFx0XHRsYWJlbDogcHJvcGVydHlQYXRoLiR0YXJnZXQuYW5ub3RhdGlvbnMuQ29tbW9uPy5MYWJlbD8udG9TdHJpbmcoKSB8fCBwcm9wZXJ0eVBhdGgudmFsdWUsXG5cdFx0XHRyb2xlOiBtZWFzdXJlQXR0cmlidXRlPy5Sb2xlPy5yZXBsYWNlKFwiVUkuQ2hhcnRNZWFzdXJlUm9sZVR5cGUvXCIsIFwiXCIpXG5cdFx0fTtcblx0fSk7XG5cblx0cmV0dXJuIHtcblx0XHRjaGFydFR5cGU6IEtQSUNoYXJ0VHlwZUZyb21VSVtjaGFydEFubm90YXRpb24uQ2hhcnRUeXBlXSB8fCBcIkxpbmVcIixcblx0XHRkaW1lbnNpb25zOiBjaGFyRGltZW5zaW9ucyxcblx0XHRtZWFzdXJlczogY2hhcnRNZWFzdXJlcyxcblx0XHRzb3J0T3JkZXI6IHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uPy5Tb3J0T3JkZXI/Lm1hcChzb3J0T3JkZXIgPT4ge1xuXHRcdFx0cmV0dXJuIHsgbmFtZTogc29ydE9yZGVyLlByb3BlcnR5Py52YWx1ZSB8fCBcIlwiLCBkZXNjZW5kaW5nOiAhIXNvcnRPcmRlci5EZXNjZW5kaW5nIH07XG5cdFx0fSksXG5cdFx0bWF4SXRlbXM6IHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uPy5NYXhJdGVtcz8udmFsdWVPZigpIGFzIG51bWJlclxuXHR9O1xufVxuXG5mdW5jdGlvbiB1cGRhdGVDdXJyZW5jeShkYXRhcG9pbnRBbm5vdGF0aW9uOiBEYXRhUG9pbnQsIGtwaURlZjogS1BJRGVmaW5pdGlvbik6IHZvaWQge1xuXHRjb25zdCB0YXJnZXRWYWx1ZVByb3BlcnR5ID0gZGF0YXBvaW50QW5ub3RhdGlvbi5WYWx1ZS4kdGFyZ2V0IGFzIFByb3BlcnR5O1xuXHRpZiAodGFyZ2V0VmFsdWVQcm9wZXJ0eS5hbm5vdGF0aW9ucy5NZWFzdXJlcz8uSVNPQ3VycmVuY3kpIHtcblx0XHRjb25zdCBjdXJyZW5jeSA9IHRhcmdldFZhbHVlUHJvcGVydHkuYW5ub3RhdGlvbnMuTWVhc3VyZXM/LklTT0N1cnJlbmN5O1xuXHRcdGlmIChpc1BhdGhFeHByZXNzaW9uKGN1cnJlbmN5KSkge1xuXHRcdFx0a3BpRGVmLmRhdGFwb2ludC51bml0ID0ge1xuXHRcdFx0XHR2YWx1ZTogKChjdXJyZW5jeS4kdGFyZ2V0IGFzIHVua25vd24pIGFzIFByb3BlcnR5KS5uYW1lLFxuXHRcdFx0XHRpc0N1cnJlbmN5OiB0cnVlLFxuXHRcdFx0XHRpc1BhdGg6IHRydWVcblx0XHRcdH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdGtwaURlZi5kYXRhcG9pbnQudW5pdCA9IHtcblx0XHRcdFx0dmFsdWU6IGN1cnJlbmN5LnRvU3RyaW5nKCksXG5cdFx0XHRcdGlzQ3VycmVuY3k6IHRydWUsXG5cdFx0XHRcdGlzUGF0aDogZmFsc2Vcblx0XHRcdH07XG5cdFx0fVxuXHR9IGVsc2UgaWYgKHRhcmdldFZhbHVlUHJvcGVydHkuYW5ub3RhdGlvbnMuTWVhc3VyZXM/LlVuaXQpIHtcblx0XHRjb25zdCB1bml0ID0gdGFyZ2V0VmFsdWVQcm9wZXJ0eS5hbm5vdGF0aW9ucy5NZWFzdXJlcz8uVW5pdDtcblx0XHRpZiAoaXNQYXRoRXhwcmVzc2lvbih1bml0KSkge1xuXHRcdFx0a3BpRGVmLmRhdGFwb2ludC51bml0ID0ge1xuXHRcdFx0XHR2YWx1ZTogKCh1bml0LiR0YXJnZXQgYXMgdW5rbm93bikgYXMgUHJvcGVydHkpLm5hbWUsXG5cdFx0XHRcdGlzQ3VycmVuY3k6IGZhbHNlLFxuXHRcdFx0XHRpc1BhdGg6IHRydWVcblx0XHRcdH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdGtwaURlZi5kYXRhcG9pbnQudW5pdCA9IHtcblx0XHRcdFx0dmFsdWU6IHVuaXQudG9TdHJpbmcoKSxcblx0XHRcdFx0aXNDdXJyZW5jeTogZmFsc2UsXG5cdFx0XHRcdGlzUGF0aDogZmFsc2Vcblx0XHRcdH07XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUNyaXRpY2FsaXR5KGRhdGFwb2ludEFubm90YXRpb246IERhdGFQb2ludCwgYWdncmVnYXRpb25IZWxwZXI6IEFnZ3JlZ2F0aW9uSGVscGVyLCBrcGlEZWY6IEtQSURlZmluaXRpb24pOiB2b2lkIHtcblx0aWYgKGRhdGFwb2ludEFubm90YXRpb24uQ3JpdGljYWxpdHkpIHtcblx0XHRpZiAodHlwZW9mIGRhdGFwb2ludEFubm90YXRpb24uQ3JpdGljYWxpdHkgPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdC8vIENyaXRpY2FsaXR5IGlzIGEgcGF0aCAtLT4gY2hlY2sgaWYgdGhlIGNvcnJlc3BvbmRpbmcgcHJvcGVydHkgaXMgYWdncmVnYXRhYmxlXG5cdFx0XHRjb25zdCBjcml0aWNhbGl0eVByb3BlcnR5ID0gKGRhdGFwb2ludEFubm90YXRpb24uQ3JpdGljYWxpdHkgYXMgUGF0aEFubm90YXRpb25FeHByZXNzaW9uPENyaXRpY2FsaXR5VHlwZT4pLiR0YXJnZXQgYXMgUHJvcGVydHk7XG5cdFx0XHRpZiAoYWdncmVnYXRpb25IZWxwZXIuaXNQcm9wZXJ0eUFnZ3JlZ2F0YWJsZShjcml0aWNhbGl0eVByb3BlcnR5KSkge1xuXHRcdFx0XHRrcGlEZWYuZGF0YXBvaW50LmNyaXRpY2FsaXR5UGF0aCA9IChkYXRhcG9pbnRBbm5vdGF0aW9uLkNyaXRpY2FsaXR5IGFzIFBhdGhBbm5vdGF0aW9uRXhwcmVzc2lvbjxDcml0aWNhbGl0eVR5cGU+KS5wYXRoO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gVGhlIHByb3BlcnR5IGlzbid0IGFnZ3JlZ2F0YWJsZSAtLT4gd2UgaWdub3JlIGl0XG5cdFx0XHRcdGtwaURlZi5kYXRhcG9pbnQuY3JpdGljYWxpdHlWYWx1ZSA9IE1lc3NhZ2VUeXBlLk5vbmU7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIENyaXRpY2FsaXR5IGlzIGFuIGVudW0gVmFsdWUgLS0+IGdldCB0aGUgY29ycmVzcG9uZGluZyBzdGF0aWMgdmFsdWVcblx0XHRcdGtwaURlZi5kYXRhcG9pbnQuY3JpdGljYWxpdHlWYWx1ZSA9IGdldE1lc3NhZ2VUeXBlRnJvbUNyaXRpY2FsaXR5VHlwZShkYXRhcG9pbnRBbm5vdGF0aW9uLkNyaXRpY2FsaXR5KTtcblx0XHR9XG5cdH0gZWxzZSBpZiAoZGF0YXBvaW50QW5ub3RhdGlvbi5Dcml0aWNhbGl0eUNhbGN1bGF0aW9uKSB7XG5cdFx0a3BpRGVmLmRhdGFwb2ludC5jcml0aWNhbGl0eUNhbGN1bGF0aW9uTW9kZSA9IGRhdGFwb2ludEFubm90YXRpb24uQ3JpdGljYWxpdHlDYWxjdWxhdGlvbi5JbXByb3ZlbWVudERpcmVjdGlvbjtcblx0XHRrcGlEZWYuZGF0YXBvaW50LmNyaXRpY2FsaXR5Q2FsY3VsYXRpb25UaHJlc2hvbGRzID0gW107XG5cdFx0c3dpdGNoIChrcGlEZWYuZGF0YXBvaW50LmNyaXRpY2FsaXR5Q2FsY3VsYXRpb25Nb2RlKSB7XG5cdFx0XHRjYXNlIFwiVUkuSW1wcm92ZW1lbnREaXJlY3Rpb25UeXBlL1RhcmdldFwiOlxuXHRcdFx0XHRrcGlEZWYuZGF0YXBvaW50LmNyaXRpY2FsaXR5Q2FsY3VsYXRpb25UaHJlc2hvbGRzLnB1c2goZGF0YXBvaW50QW5ub3RhdGlvbi5Dcml0aWNhbGl0eUNhbGN1bGF0aW9uLkRldmlhdGlvblJhbmdlTG93VmFsdWUpO1xuXHRcdFx0XHRrcGlEZWYuZGF0YXBvaW50LmNyaXRpY2FsaXR5Q2FsY3VsYXRpb25UaHJlc2hvbGRzLnB1c2goZGF0YXBvaW50QW5ub3RhdGlvbi5Dcml0aWNhbGl0eUNhbGN1bGF0aW9uLlRvbGVyYW5jZVJhbmdlTG93VmFsdWUpO1xuXHRcdFx0XHRrcGlEZWYuZGF0YXBvaW50LmNyaXRpY2FsaXR5Q2FsY3VsYXRpb25UaHJlc2hvbGRzLnB1c2goZGF0YXBvaW50QW5ub3RhdGlvbi5Dcml0aWNhbGl0eUNhbGN1bGF0aW9uLkFjY2VwdGFuY2VSYW5nZUxvd1ZhbHVlKTtcblx0XHRcdFx0a3BpRGVmLmRhdGFwb2ludC5jcml0aWNhbGl0eUNhbGN1bGF0aW9uVGhyZXNob2xkcy5wdXNoKGRhdGFwb2ludEFubm90YXRpb24uQ3JpdGljYWxpdHlDYWxjdWxhdGlvbi5BY2NlcHRhbmNlUmFuZ2VIaWdoVmFsdWUpO1xuXHRcdFx0XHRrcGlEZWYuZGF0YXBvaW50LmNyaXRpY2FsaXR5Q2FsY3VsYXRpb25UaHJlc2hvbGRzLnB1c2goZGF0YXBvaW50QW5ub3RhdGlvbi5Dcml0aWNhbGl0eUNhbGN1bGF0aW9uLlRvbGVyYW5jZVJhbmdlSGlnaFZhbHVlKTtcblx0XHRcdFx0a3BpRGVmLmRhdGFwb2ludC5jcml0aWNhbGl0eUNhbGN1bGF0aW9uVGhyZXNob2xkcy5wdXNoKGRhdGFwb2ludEFubm90YXRpb24uQ3JpdGljYWxpdHlDYWxjdWxhdGlvbi5EZXZpYXRpb25SYW5nZUhpZ2hWYWx1ZSk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwiVUkuSW1wcm92ZW1lbnREaXJlY3Rpb25UeXBlL01pbmltaXplXCI6XG5cdFx0XHRcdGtwaURlZi5kYXRhcG9pbnQuY3JpdGljYWxpdHlDYWxjdWxhdGlvblRocmVzaG9sZHMucHVzaChkYXRhcG9pbnRBbm5vdGF0aW9uLkNyaXRpY2FsaXR5Q2FsY3VsYXRpb24uQWNjZXB0YW5jZVJhbmdlSGlnaFZhbHVlKTtcblx0XHRcdFx0a3BpRGVmLmRhdGFwb2ludC5jcml0aWNhbGl0eUNhbGN1bGF0aW9uVGhyZXNob2xkcy5wdXNoKGRhdGFwb2ludEFubm90YXRpb24uQ3JpdGljYWxpdHlDYWxjdWxhdGlvbi5Ub2xlcmFuY2VSYW5nZUhpZ2hWYWx1ZSk7XG5cdFx0XHRcdGtwaURlZi5kYXRhcG9pbnQuY3JpdGljYWxpdHlDYWxjdWxhdGlvblRocmVzaG9sZHMucHVzaChkYXRhcG9pbnRBbm5vdGF0aW9uLkNyaXRpY2FsaXR5Q2FsY3VsYXRpb24uRGV2aWF0aW9uUmFuZ2VIaWdoVmFsdWUpO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBcIlVJLkltcHJvdmVtZW50RGlyZWN0aW9uVHlwZS9NYXhpbWl6ZVwiOlxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0a3BpRGVmLmRhdGFwb2ludC5jcml0aWNhbGl0eUNhbGN1bGF0aW9uVGhyZXNob2xkcy5wdXNoKGRhdGFwb2ludEFubm90YXRpb24uQ3JpdGljYWxpdHlDYWxjdWxhdGlvbi5EZXZpYXRpb25SYW5nZUxvd1ZhbHVlKTtcblx0XHRcdFx0a3BpRGVmLmRhdGFwb2ludC5jcml0aWNhbGl0eUNhbGN1bGF0aW9uVGhyZXNob2xkcy5wdXNoKGRhdGFwb2ludEFubm90YXRpb24uQ3JpdGljYWxpdHlDYWxjdWxhdGlvbi5Ub2xlcmFuY2VSYW5nZUxvd1ZhbHVlKTtcblx0XHRcdFx0a3BpRGVmLmRhdGFwb2ludC5jcml0aWNhbGl0eUNhbGN1bGF0aW9uVGhyZXNob2xkcy5wdXNoKGRhdGFwb2ludEFubm90YXRpb24uQ3JpdGljYWxpdHlDYWxjdWxhdGlvbi5BY2NlcHRhbmNlUmFuZ2VMb3dWYWx1ZSk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGtwaURlZi5kYXRhcG9pbnQuY3JpdGljYWxpdHlWYWx1ZSA9IE1lc3NhZ2VUeXBlLk5vbmU7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlVHJlbmQoZGF0YXBvaW50QW5ub3RhdGlvbjogRGF0YVBvaW50LCBhZ2dyZWdhdGlvbkhlbHBlcjogQWdncmVnYXRpb25IZWxwZXIsIGtwaURlZjogS1BJRGVmaW5pdGlvbik6IHZvaWQge1xuXHRpZiAoZGF0YXBvaW50QW5ub3RhdGlvbi5UcmVuZCkge1xuXHRcdGlmICh0eXBlb2YgZGF0YXBvaW50QW5ub3RhdGlvbi5UcmVuZCA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0Ly8gVHJlbmQgaXMgYSBwYXRoIC0tPiBjaGVjayBpZiB0aGUgY29ycmVzcG9uZGluZyBwcm9wZXJ0eSBpcyBhZ2dyZWdhdGFibGVcblx0XHRcdGNvbnN0IHRyZW5kUHJvcGVydHkgPSAoZGF0YXBvaW50QW5ub3RhdGlvbi5UcmVuZCBhcyBQYXRoQW5ub3RhdGlvbkV4cHJlc3Npb248VHJlbmRUeXBlPikuJHRhcmdldCBhcyBQcm9wZXJ0eTtcblx0XHRcdGlmIChhZ2dyZWdhdGlvbkhlbHBlci5pc1Byb3BlcnR5QWdncmVnYXRhYmxlKHRyZW5kUHJvcGVydHkpKSB7XG5cdFx0XHRcdGtwaURlZi5kYXRhcG9pbnQudHJlbmRQYXRoID0gKGRhdGFwb2ludEFubm90YXRpb24uVHJlbmQgYXMgUGF0aEFubm90YXRpb25FeHByZXNzaW9uPFRyZW5kVHlwZT4pLnBhdGg7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBUaGUgcHJvcGVydHkgaXNuJ3QgYWdncmVnYXRhYmxlIC0tPiB3ZSBpZ25vcmUgaXRcblx0XHRcdFx0a3BpRGVmLmRhdGFwb2ludC50cmVuZFZhbHVlID0gXCJOb25lXCI7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIFRyZW5kIGlzIGFuIGVudW0gVmFsdWUgLS0+IGdldCB0aGUgY29ycmVzcG9uZGluZyBzdGF0aWMgdmFsdWVcblx0XHRcdGtwaURlZi5kYXRhcG9pbnQudHJlbmRWYWx1ZSA9IERldmlhdGlvbkluZGljYXRvckZyb21UcmVuZFR5cGVbZGF0YXBvaW50QW5ub3RhdGlvbi5UcmVuZF0gfHwgXCJOb25lXCI7XG5cdFx0fVxuXHR9IGVsc2UgaWYgKGRhdGFwb2ludEFubm90YXRpb24uVHJlbmRDYWxjdWxhdGlvbikge1xuXHRcdGtwaURlZi5kYXRhcG9pbnQudHJlbmRDYWxjdWxhdGlvbklzUmVsYXRpdmUgPSBkYXRhcG9pbnRBbm5vdGF0aW9uLlRyZW5kQ2FsY3VsYXRpb24uSXNSZWxhdGl2ZURpZmZlcmVuY2UgPyB0cnVlIDogZmFsc2U7XG5cdFx0aWYgKGRhdGFwb2ludEFubm90YXRpb24uVHJlbmRDYWxjdWxhdGlvbi5SZWZlcmVuY2VWYWx1ZS4kdGFyZ2V0KSB7XG5cdFx0XHQvLyBSZWZlcmVuY2UgdmFsdWUgaXMgYSBwYXRoIC0tPiBjaGVjayBpZiB0aGUgY29ycmVzcG9uZGluZyBwcm9wZXJ0eSBpcyBhZ2dyZWdhdGFibGVcblx0XHRcdGNvbnN0IHJlZmVyZW5jZVByb3BlcnR5ID0gZGF0YXBvaW50QW5ub3RhdGlvbi5UcmVuZENhbGN1bGF0aW9uLlJlZmVyZW5jZVZhbHVlLiR0YXJnZXQgYXMgUHJvcGVydHk7XG5cdFx0XHRpZiAoYWdncmVnYXRpb25IZWxwZXIuaXNQcm9wZXJ0eUFnZ3JlZ2F0YWJsZShyZWZlcmVuY2VQcm9wZXJ0eSkpIHtcblx0XHRcdFx0a3BpRGVmLmRhdGFwb2ludC50cmVuZENhbGN1bGF0aW9uUmVmZXJlbmNlUGF0aCA9IGRhdGFwb2ludEFubm90YXRpb24uVHJlbmRDYWxjdWxhdGlvbi5SZWZlcmVuY2VWYWx1ZS5wYXRoO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gVGhlIHByb3BlcnR5IGlzbid0IGFnZ3JlZ2F0YWJsZSAtLT4gd2UgaWdub3JlIGl0IGFuZCBzd2l0Y2ggYmFjayB0byB0cmVuZCAnTm9uZSdcblx0XHRcdFx0a3BpRGVmLmRhdGFwb2ludC50cmVuZFZhbHVlID0gXCJOb25lXCI7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIFJlZmVyZW5jZSB2YWx1ZSBpcyBhIHN0YXRpYyB2YWx1ZVxuXHRcdFx0a3BpRGVmLmRhdGFwb2ludC50cmVuZENhbGN1bGF0aW9uUmVmZXJlbmNlVmFsdWUgPSBkYXRhcG9pbnRBbm5vdGF0aW9uLlRyZW5kQ2FsY3VsYXRpb24uUmVmZXJlbmNlVmFsdWU7XG5cdFx0fVxuXHRcdGlmIChrcGlEZWYuZGF0YXBvaW50LnRyZW5kQ2FsY3VsYXRpb25SZWZlcmVuY2VQYXRoICE9PSB1bmRlZmluZWQgfHwga3BpRGVmLmRhdGFwb2ludC50cmVuZENhbGN1bGF0aW9uUmVmZXJlbmNlVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0a3BpRGVmLmRhdGFwb2ludC50cmVuZENhbGN1bGF0aW9uVHJlc2hvbGRzID0gW1xuXHRcdFx0XHRkYXRhcG9pbnRBbm5vdGF0aW9uLlRyZW5kQ2FsY3VsYXRpb24uU3Ryb25nRG93bkRpZmZlcmVuY2UudmFsdWVPZigpIGFzIG51bWJlcixcblx0XHRcdFx0ZGF0YXBvaW50QW5ub3RhdGlvbi5UcmVuZENhbGN1bGF0aW9uLkRvd25EaWZmZXJlbmNlLnZhbHVlT2YoKSBhcyBudW1iZXIsXG5cdFx0XHRcdGRhdGFwb2ludEFubm90YXRpb24uVHJlbmRDYWxjdWxhdGlvbi5VcERpZmZlcmVuY2UudmFsdWVPZigpIGFzIG51bWJlcixcblx0XHRcdFx0ZGF0YXBvaW50QW5ub3RhdGlvbi5UcmVuZENhbGN1bGF0aW9uLlN0cm9uZ1VwRGlmZmVyZW5jZS52YWx1ZU9mKCkgYXMgbnVtYmVyXG5cdFx0XHRdO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRrcGlEZWYuZGF0YXBvaW50LnRyZW5kVmFsdWUgPSBcIk5vbmVcIjtcblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVUYXJnZXQoZGF0YXBvaW50QW5ub3RhdGlvbjogRGF0YVBvaW50LCBhZ2dyZWdhdGlvbkhlbHBlcjogQWdncmVnYXRpb25IZWxwZXIsIGtwaURlZjogS1BJRGVmaW5pdGlvbik6IHZvaWQge1xuXHRpZiAoZGF0YXBvaW50QW5ub3RhdGlvbi5UYXJnZXRWYWx1ZSkge1xuXHRcdGlmIChkYXRhcG9pbnRBbm5vdGF0aW9uLlRhcmdldFZhbHVlLiR0YXJnZXQpIHtcblx0XHRcdC8vIFRhcmdldCB2YWx1ZSBpcyBhIHBhdGggLS0+IGNoZWNrIGlmIHRoZSBjb3JyZXNwb25kaW5nIHByb3BlcnR5IGlzIGFnZ3JlZ2F0YWJsZSAob3RoZXJ3aXNlIGlnbm9yZSlcblx0XHRcdGNvbnN0IHRhcmdldFByb3BlcnR5ID0gZGF0YXBvaW50QW5ub3RhdGlvbi5UYXJnZXRWYWx1ZS4kdGFyZ2V0IGFzIFByb3BlcnR5O1xuXHRcdFx0aWYgKGFnZ3JlZ2F0aW9uSGVscGVyLmlzUHJvcGVydHlBZ2dyZWdhdGFibGUodGFyZ2V0UHJvcGVydHkpKSB7XG5cdFx0XHRcdGtwaURlZi5kYXRhcG9pbnQudGFyZ2V0UGF0aCA9IGRhdGFwb2ludEFubm90YXRpb24uVGFyZ2V0VmFsdWUucGF0aDtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gVGFyZ2V0IHZhbHVlIGlzIGEgc3RhdGljIHZhbHVlXG5cdFx0XHRrcGlEZWYuZGF0YXBvaW50LnRhcmdldFZhbHVlID0gZGF0YXBvaW50QW5ub3RhdGlvbi5UYXJnZXRWYWx1ZTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlS1BJRGVmaW5pdGlvbihrcGlOYW1lOiBzdHJpbmcsIGtwaUNvbmZpZzogS1BJQ29uZmlndXJhdGlvbiwgY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IEtQSURlZmluaXRpb24gfCB1bmRlZmluZWQge1xuXHRjb25zdCBrcGlDb252ZXJ0ZXJDb250ZXh0ID0gY29udmVydGVyQ29udGV4dC5nZXRDb252ZXJ0ZXJDb250ZXh0Rm9yKFwiL1wiICsga3BpQ29uZmlnLmVudGl0eVNldCk7XG5cdGNvbnN0IGFnZ3JlZ2F0aW9uSGVscGVyID0gbmV3IEFnZ3JlZ2F0aW9uSGVscGVyKGtwaUNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpLCBrcGlDb252ZXJ0ZXJDb250ZXh0KTtcblxuXHRpZiAoIWFnZ3JlZ2F0aW9uSGVscGVyLmlzQW5hbHl0aWNzU3VwcG9ydGVkKCkpIHtcblx0XHQvLyBUaGUgZW50aXR5IGRvZXNuJ3Qgc3VwcG9ydCBhbmFseXRpY2FsIHF1ZXJpZXNcblx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHQuZ2V0RGlhZ25vc3RpY3MoKVxuXHRcdFx0LmFkZElzc3VlKElzc3VlQ2F0ZWdvcnkuQW5ub3RhdGlvbiwgSXNzdWVTZXZlcml0eS5NZWRpdW0sIElzc3VlVHlwZS5LUElfSVNTVUVTLk5PX0FOQUxZVElDUyArIGtwaUNvbmZpZy5lbnRpdHlTZXQpO1xuXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxuXG5cdGxldCBzZWxlY3Rpb25WYXJpYW50QW5ub3RhdGlvbjogU2VsZWN0aW9uVmFyaWFudCB8IHVuZGVmaW5lZDtcblx0bGV0IGRhdGFwb2ludEFubm90YXRpb246IERhdGFQb2ludCB8IHVuZGVmaW5lZDtcblx0bGV0IHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uOiBQcmVzZW50YXRpb25WYXJpYW50IHwgdW5kZWZpbmVkO1xuXHRsZXQgY2hhcnRBbm5vdGF0aW9uOiBDaGFydCB8IHVuZGVmaW5lZDtcblxuXHQvLyBTZWFyY2ggZm9yIGEgS1BJIHdpdGggdGhlIHF1YWxpZmllciBmcm1vIHRoZSBtYW5pZmVzdFxuXHRjb25zdCBhS1BJQW5ub3RhdGlvbnMgPSBrcGlDb252ZXJ0ZXJDb250ZXh0LmdldEFubm90YXRpb25zQnlUZXJtKFwiVUlcIiwgVUlBbm5vdGF0aW9uVGVybXMuS1BJKSBhcyBBbm5vdGF0aW9uVGVybTxLUElUeXBlPltdO1xuXHRjb25zdCB0YXJnZXRLUEkgPSBhS1BJQW5ub3RhdGlvbnMuZmluZChrcGkgPT4ge1xuXHRcdHJldHVybiBrcGkucXVhbGlmaWVyID09PSBrcGlDb25maWcucXVhbGlmaWVyO1xuXHR9KTtcblx0aWYgKHRhcmdldEtQSSkge1xuXHRcdGRhdGFwb2ludEFubm90YXRpb24gPSB0YXJnZXRLUEkuRGF0YVBvaW50O1xuXHRcdHNlbGVjdGlvblZhcmlhbnRBbm5vdGF0aW9uID0gdGFyZ2V0S1BJLlNlbGVjdGlvblZhcmlhbnQ7XG5cdFx0cHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24gPSB0YXJnZXRLUEkuRGV0YWlsPy5EZWZhdWx0UHJlc2VudGF0aW9uVmFyaWFudDtcblx0XHRjaGFydEFubm90YXRpb24gPSBwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbj8uVmlzdWFsaXphdGlvbnM/LmZpbmQoKHZpejogYW55KSA9PiB7XG5cdFx0XHRyZXR1cm4gdml6LiR0YXJnZXQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkNoYXJ0RGVmaW5pdGlvblR5cGU7XG5cdFx0fSk/LiR0YXJnZXQgYXMgQ2hhcnQ7XG5cdH0gZWxzZSB7XG5cdFx0Ly8gRmFsbGJhY2s6IHRyeSB0byBmaW5kIGEgU1BWIHdpdGggdGhlIHNhbWUgcXVhbGlmaWVyXG5cdFx0Y29uc3QgYVNQVkFubm90YXRpb25zID0ga3BpQ29udmVydGVyQ29udGV4dC5nZXRBbm5vdGF0aW9uc0J5VGVybShcblx0XHRcdFwiVUlcIixcblx0XHRcdFVJQW5ub3RhdGlvblRlcm1zLlNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnRcblx0XHQpIGFzIEFubm90YXRpb25UZXJtPFNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnRUeXBlPltdO1xuXHRcdGNvbnN0IHRhcmdldFNQViA9IGFTUFZBbm5vdGF0aW9ucy5maW5kKHNwdiA9PiB7XG5cdFx0XHRyZXR1cm4gc3B2LnF1YWxpZmllciA9PT0ga3BpQ29uZmlnLnF1YWxpZmllcjtcblx0XHR9KTtcblx0XHRpZiAodGFyZ2V0U1BWKSB7XG5cdFx0XHRzZWxlY3Rpb25WYXJpYW50QW5ub3RhdGlvbiA9IHRhcmdldFNQVi5TZWxlY3Rpb25WYXJpYW50O1xuXHRcdFx0cHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24gPSB0YXJnZXRTUFYuUHJlc2VudGF0aW9uVmFyaWFudDtcblx0XHRcdGRhdGFwb2ludEFubm90YXRpb24gPSBwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbj8uVmlzdWFsaXphdGlvbnM/LmZpbmQoKHZpejogYW55KSA9PiB7XG5cdFx0XHRcdHJldHVybiB2aXouJHRhcmdldC4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YVBvaW50VHlwZTtcblx0XHRcdH0pPy4kdGFyZ2V0IGFzIERhdGFQb2ludDtcblx0XHRcdGNoYXJ0QW5ub3RhdGlvbiA9IHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uPy5WaXN1YWxpemF0aW9ucz8uZmluZCgodml6OiBhbnkpID0+IHtcblx0XHRcdFx0cmV0dXJuIHZpei4kdGFyZ2V0LiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5DaGFydERlZmluaXRpb25UeXBlO1xuXHRcdFx0fSk/LiR0YXJnZXQgYXMgQ2hhcnQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIENvdWxkbid0IGZpbmQgYSBLUEkgb3IgYSBTUFYgYW5ub3RhdGlvbiB3aXRoIHRoZSBxdWFsaWZpZXIgZnJvbSB0aGUgbWFuaWZlc3Rcblx0XHRcdGNvbnZlcnRlckNvbnRleHRcblx0XHRcdFx0LmdldERpYWdub3N0aWNzKClcblx0XHRcdFx0LmFkZElzc3VlKElzc3VlQ2F0ZWdvcnkuQW5ub3RhdGlvbiwgSXNzdWVTZXZlcml0eS5NZWRpdW0sIElzc3VlVHlwZS5LUElfSVNTVUVTLktQSV9OT1RfRk9VTkQgKyBrcGlDb25maWcucXVhbGlmaWVyKTtcblxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cdH1cblxuXHRpZiAoIXByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uIHx8ICFkYXRhcG9pbnRBbm5vdGF0aW9uIHx8ICFjaGFydEFubm90YXRpb24pIHtcblx0XHQvLyBDb3VsZG4ndCBmaW5kIGEgY2hhcnQgb3IgZGF0YXBvaW50IGRlZmluaXRpb25cblx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHQuZ2V0RGlhZ25vc3RpY3MoKVxuXHRcdFx0LmFkZElzc3VlKElzc3VlQ2F0ZWdvcnkuQW5ub3RhdGlvbiwgSXNzdWVTZXZlcml0eS5NZWRpdW0sIElzc3VlVHlwZS5LUElfSVNTVUVTLktQSV9ERVRBSUxfTk9UX0ZPVU5EICsga3BpQ29uZmlnLnF1YWxpZmllcik7XG5cblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cblx0Y29uc3QgZGF0YXBvaW50UHJvcGVydHkgPSBkYXRhcG9pbnRBbm5vdGF0aW9uLlZhbHVlLiR0YXJnZXQgYXMgUHJvcGVydHk7XG5cdGlmICghYWdncmVnYXRpb25IZWxwZXIuaXNQcm9wZXJ0eUFnZ3JlZ2F0YWJsZShkYXRhcG9pbnRQcm9wZXJ0eSkpIHtcblx0XHQvLyBUaGUgbWFpbiBwcm9wZXJ0eSBvZiB0aGUgS1BJIGlzIG5vdCBhZ2dyZWdhdGFibGUgLS0+IFdlIGNhbid0IGNhbGN1bGF0ZSBpdHMgdmFsdWUgc28gd2UgaWdub3JlIHRoZSBLUElcblx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHQuZ2V0RGlhZ25vc3RpY3MoKVxuXHRcdFx0LmFkZElzc3VlKFxuXHRcdFx0XHRJc3N1ZUNhdGVnb3J5LkFubm90YXRpb24sXG5cdFx0XHRcdElzc3VlU2V2ZXJpdHkuTWVkaXVtLFxuXHRcdFx0XHRJc3N1ZVR5cGUuS1BJX0lTU1VFUy5NQUlOX1BST1BFUlRZX05PVF9BR0dSRUdBVEFCTEUgKyBrcGlDb25maWcucXVhbGlmaWVyXG5cdFx0XHQpO1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblxuXHQvLyBDaGFydCBkZWZpbml0aW9uXG5cdGNvbnN0IGNoYXJ0RGVmID0gY29udmVydEtQSUNoYXJ0KGNoYXJ0QW5ub3RhdGlvbiwgcHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24pO1xuXHRpZiAoIWNoYXJ0RGVmKSB7XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxuXG5cdGNvbnN0IGtwaURlZjogS1BJRGVmaW5pdGlvbiA9IHtcblx0XHRpZDogS1BJSUQoa3BpTmFtZSksXG5cdFx0ZW50aXR5U2V0OiBrcGlDb25maWcuZW50aXR5U2V0LFxuXHRcdGRhdGFwb2ludDoge1xuXHRcdFx0cHJvcGVydHlQYXRoOiBkYXRhcG9pbnRBbm5vdGF0aW9uLlZhbHVlLnBhdGgsXG5cdFx0XHRhbm5vdGF0aW9uUGF0aDoga3BpQ29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGRhdGFwb2ludEFubm90YXRpb24uZnVsbHlRdWFsaWZpZWROYW1lKSxcblx0XHRcdHRpdGxlOiBkYXRhcG9pbnRBbm5vdGF0aW9uLlRpdGxlPy50b1N0cmluZygpLFxuXHRcdFx0ZGVzY3JpcHRpb246IGRhdGFwb2ludEFubm90YXRpb24uRGVzY3JpcHRpb24/LnRvU3RyaW5nKClcblx0XHR9LFxuXHRcdHNlbGVjdGlvblZhcmlhbnRGaWx0ZXJEZWZpbml0aW9uczogc2VsZWN0aW9uVmFyaWFudEFubm90YXRpb25cblx0XHRcdD8gZ2V0RmlsdGVyRGVmaW5pdGlvbnNGcm9tU2VsZWN0aW9uVmFyaWFudChzZWxlY3Rpb25WYXJpYW50QW5ub3RhdGlvbilcblx0XHRcdDogdW5kZWZpbmVkLFxuXHRcdGNoYXJ0OiBjaGFydERlZlxuXHR9O1xuXG5cdHVwZGF0ZUN1cnJlbmN5KGRhdGFwb2ludEFubm90YXRpb24sIGtwaURlZik7XG5cdHVwZGF0ZUNyaXRpY2FsaXR5KGRhdGFwb2ludEFubm90YXRpb24sIGFnZ3JlZ2F0aW9uSGVscGVyLCBrcGlEZWYpO1xuXHR1cGRhdGVUcmVuZChkYXRhcG9pbnRBbm5vdGF0aW9uLCBhZ2dyZWdhdGlvbkhlbHBlciwga3BpRGVmKTtcblx0dXBkYXRlVGFyZ2V0KGRhdGFwb2ludEFubm90YXRpb24sIGFnZ3JlZ2F0aW9uSGVscGVyLCBrcGlEZWYpO1xuXG5cdHJldHVybiBrcGlEZWY7XG59XG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgS1BJIGRlZmluaXRpb25zIGZyb20gdGhlIG1hbmlmZXN0IGFuZCB0aGUgYW5ub3RhdGlvbnMuXG4gKlxuICogQHBhcmFtIHtDb252ZXJ0ZXJDb250ZXh0fSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dCBmb3IgdGhlIHBhZ2VcbiAqIEByZXR1cm5zIHtLUElEZWZpbml0aW9uW119IFJldHVybnMgYW4gYXJyYXkgb2YgS1BJIGRlZmluaXRpb25zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRLUElEZWZpbml0aW9ucyhjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogS1BJRGVmaW5pdGlvbltdIHtcblx0Y29uc3Qga3BpQ29uZmlncyA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCkuZ2V0S1BJQ29uZmlndXJhdGlvbigpLFxuXHRcdGtwaURlZnM6IEtQSURlZmluaXRpb25bXSA9IFtdO1xuXG5cdE9iamVjdC5rZXlzKGtwaUNvbmZpZ3MpLmZvckVhY2goa3BpTmFtZSA9PiB7XG5cdFx0Y29uc3Qgb0RlZiA9IGNyZWF0ZUtQSURlZmluaXRpb24oa3BpTmFtZSwga3BpQ29uZmlnc1trcGlOYW1lXSwgY29udmVydGVyQ29udGV4dCk7XG5cdFx0aWYgKG9EZWYpIHtcblx0XHRcdGtwaURlZnMucHVzaChvRGVmKTtcblx0XHR9XG5cdH0pO1xuXG5cdHJldHVybiBrcGlEZWZzO1xufVxuIl19