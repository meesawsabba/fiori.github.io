/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/templating/FilterTemplating", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/core/converters/helpers/Aggregation", "sap/fe/core/converters/helpers/IssueManager"], function (FilterTemplating, BindingExpression, DataModelPathHelper, Aggregation, IssueManager) {
  "use strict";

  var _exports = {};
  var IssueCategory = IssueManager.IssueCategory;
  var IssueSeverity = IssueManager.IssueSeverity;
  var IssueType = IssueManager.IssueType;
  var AggregationHelper = Aggregation.AggregationHelper;
  var checkFilterExpressionRestrictions = DataModelPathHelper.checkFilterExpressionRestrictions;
  var compileBinding = BindingExpression.compileBinding;
  var getIsRequired = FilterTemplating.getIsRequired;
  var isPropertyFilterable = FilterTemplating.isPropertyFilterable;

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function () {}; return { s: F, n: function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function (e) { throw e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function () { it = it.call(o); }, n: function () { var step = it.next(); normalCompletion = step.done; return step; }, e: function (e) { didErr = true; err = e; }, f: function () { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  /**
   * Checks that measures and dimensions of the visual filter chart can be aggregated and grouped.
   * @param converterContext The converter context
   * @param chartAnnotation The chart annotation
   * @param aggregationHelper The aggregation helper
   * @returns {boolean | undefined }
   */
  var _checkVFAggregation = function (converterContext, chartAnnotation, aggregationHelper) {
    var _chartAnnotation$$tar, _chartAnnotation$$tar2, _chartAnnotation$$tar3, _chartAnnotation$$tar4;

    var sMeasurePath, bGroupable, bAggregatable;
    var sMeasure = chartAnnotation === null || chartAnnotation === void 0 ? void 0 : (_chartAnnotation$$tar = chartAnnotation.$target) === null || _chartAnnotation$$tar === void 0 ? void 0 : (_chartAnnotation$$tar2 = _chartAnnotation$$tar.Measures[0]) === null || _chartAnnotation$$tar2 === void 0 ? void 0 : _chartAnnotation$$tar2.value;
    var sDimension = chartAnnotation === null || chartAnnotation === void 0 ? void 0 : (_chartAnnotation$$tar3 = chartAnnotation.$target) === null || _chartAnnotation$$tar3 === void 0 ? void 0 : (_chartAnnotation$$tar4 = _chartAnnotation$$tar3.Dimensions[0]) === null || _chartAnnotation$$tar4 === void 0 ? void 0 : _chartAnnotation$$tar4.value;
    var customAggregates = aggregationHelper.getCustomAggregateDefinitions();
    var aTransAggregations = aggregationHelper.getTransAggregations();

    if (customAggregates.some(function (custAgg) {
      return custAgg.qualifier === sMeasure;
    })) {
      sMeasurePath = sMeasure;
    } else if (aTransAggregations && aTransAggregations[0]) {
      var aAggregations = aTransAggregations[0];
      aAggregations.some(function (oAggregate) {
        if (oAggregate.Name === sMeasure) {
          sMeasurePath = oAggregate === null || oAggregate === void 0 ? void 0 : oAggregate.AggregatableProperty.value;
        }
      });
    }

    var aAggregatablePropsFromContainer = aggregationHelper.getAggregatableProperties();
    var aGroupablePropsFromContainer = aggregationHelper.getGroupableProperties();

    if (aAggregatablePropsFromContainer && aAggregatablePropsFromContainer.length) {
      var _iterator = _createForOfIteratorHelper(aAggregatablePropsFromContainer),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _aggregatableProp$Pro;

          var aggregatableProp = _step.value;

          if ((aggregatableProp === null || aggregatableProp === void 0 ? void 0 : (_aggregatableProp$Pro = aggregatableProp.Property) === null || _aggregatableProp$Pro === void 0 ? void 0 : _aggregatableProp$Pro.value) === sMeasurePath) {
            bAggregatable = true;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    if (aGroupablePropsFromContainer && aGroupablePropsFromContainer.length) {
      var _iterator2 = _createForOfIteratorHelper(aGroupablePropsFromContainer),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var groupableProp = _step2.value;

          if ((groupableProp === null || groupableProp === void 0 ? void 0 : groupableProp.value) === sDimension) {
            bGroupable = true;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }

    return bAggregatable && bGroupable;
  };
  /**
   * Method to get the visual filters object for a property.
   * @param entityType The converter context
   * @param converterContext The chart annotation
   * @param sPropertyPath The aggregation helper
   * @param FilterFields The aggregation helper
   * @returns {VisualFilters | undefined }
   */


  function getVisualFilters(entityType, converterContext, sPropertyPath, FilterFields) {
    var _oVisualFilter$visual;

    var visualFilter = {};
    var oVisualFilter = FilterFields[sPropertyPath];

    if (oVisualFilter && oVisualFilter !== null && oVisualFilter !== void 0 && oVisualFilter.visualFilter && oVisualFilter !== null && oVisualFilter !== void 0 && (_oVisualFilter$visual = oVisualFilter.visualFilter) !== null && _oVisualFilter$visual !== void 0 && _oVisualFilter$visual.valueList) {
      var _oVisualFilter$visual2, _property$annotations;

      var oVFPath = oVisualFilter === null || oVisualFilter === void 0 ? void 0 : (_oVisualFilter$visual2 = oVisualFilter.visualFilter) === null || _oVisualFilter$visual2 === void 0 ? void 0 : _oVisualFilter$visual2.valueList;
      var annotationQualifierSplit = oVFPath.split("#");
      var qualifierVL = annotationQualifierSplit.length > 1 ? "ValueList#" + annotationQualifierSplit[1] : annotationQualifierSplit[0];
      var property = entityType.resolvePath(sPropertyPath);
      var valueList = property === null || property === void 0 ? void 0 : (_property$annotations = property.annotations) === null || _property$annotations === void 0 ? void 0 : _property$annotations.Common[qualifierVL];

      if (valueList) {
        var _converterContext$get, _collectionPathConver, _collectionPathConver2;

        var collectionPath = valueList === null || valueList === void 0 ? void 0 : valueList.CollectionPath;
        var collectionPathConverterContext = converterContext.getConverterContextFor("/" + (collectionPath || ((_converterContext$get = converterContext.getEntitySet()) === null || _converterContext$get === void 0 ? void 0 : _converterContext$get.name)));
        var valueListParams = valueList === null || valueList === void 0 ? void 0 : valueList.Parameters;
        var outParameter;
        var inParameters = [];
        var aParameters = [];

        if (!collectionPathConverterContext.getDataModelObjectPath().targetEntitySet) {
          var resolvedTarget = collectionPathConverterContext.getEntityTypeAnnotation("");
          collectionPathConverterContext = resolvedTarget.converterContext;
        }

        var parameterEntityType = collectionPathConverterContext.getParameterEntityType();
        aParameters = parameterEntityType ? parameterEntityType.keys.map(function (key) {
          return key.name;
        }) : [];

        if (converterContext.getContextPath() === collectionPathConverterContext.getContextPath()) {
          aParameters.forEach(function (parameter) {
            inParameters.push({
              localDataProperty: parameter,
              valueListProperty: parameter
            });
          });
        }

        if (valueListParams) {
          var _iterator3 = _createForOfIteratorHelper(valueListParams),
              _step3;

          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var _LocalDataProperty;

              var valueListParam = _step3.value;
              var localDataProperty = (_LocalDataProperty = valueListParam.LocalDataProperty) === null || _LocalDataProperty === void 0 ? void 0 : _LocalDataProperty.value;
              var valueListProperty = valueListParam.ValueListProperty;

              if (((valueListParam === null || valueListParam === void 0 ? void 0 : valueListParam.$Type) === "com.sap.vocabularies.Common.v1.ValueListParameterInOut" || (valueListParam === null || valueListParam === void 0 ? void 0 : valueListParam.$Type) === "com.sap.vocabularies.Common.v1.ValueListParameterOut") && sPropertyPath === localDataProperty) {
                outParameter = valueListParam;
              }

              if (((valueListParam === null || valueListParam === void 0 ? void 0 : valueListParam.$Type) === "com.sap.vocabularies.Common.v1.ValueListParameterInOut" || (valueListParam === null || valueListParam === void 0 ? void 0 : valueListParam.$Type) === "com.sap.vocabularies.Common.v1.ValueListParameterIn") && sPropertyPath !== localDataProperty) {
                var bNotFilterable = isPropertyFilterable(collectionPathConverterContext, valueListProperty);

                if (!bNotFilterable) {
                  inParameters.push({
                    localDataProperty: localDataProperty,
                    valueListProperty: valueListProperty
                  });
                }
              }
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        }

        if (inParameters && inParameters.length) {
          inParameters.forEach(function (oInParameter) {
            var mainEntitySetInMappingAllowedExpression = compileBinding(checkFilterExpressionRestrictions(converterContext.getConverterContextFor(converterContext.getAbsoluteAnnotationPath(oInParameter === null || oInParameter === void 0 ? void 0 : oInParameter.localDataProperty)).getDataModelObjectPath(), ["SingleValue"]));
            var valueListEntitySetInMappingAllowedExpression = compileBinding(checkFilterExpressionRestrictions(collectionPathConverterContext.getConverterContextFor(collectionPathConverterContext.getAbsoluteAnnotationPath(oInParameter === null || oInParameter === void 0 ? void 0 : oInParameter.valueListProperty)).getDataModelObjectPath(), ["SingleValue"]));

            if (valueListEntitySetInMappingAllowedExpression === "true" && mainEntitySetInMappingAllowedExpression === "false") {
              throw new Error("FilterRestrictions of " + sPropertyPath + " in MainEntitySet and ValueListEntitySet are different");
            }
          });
        }

        var pvQualifier = valueList === null || valueList === void 0 ? void 0 : valueList.PresentationVariantQualifier;
        var svQualifier = valueList === null || valueList === void 0 ? void 0 : valueList.SelectionVariantQualifier;
        var pvAnnotation = (_collectionPathConver = collectionPathConverterContext) === null || _collectionPathConver === void 0 ? void 0 : (_collectionPathConver2 = _collectionPathConver.getEntityTypeAnnotation("@UI.PresentationVariant#" + pvQualifier)) === null || _collectionPathConver2 === void 0 ? void 0 : _collectionPathConver2.annotation;
        var aggregationHelper = new AggregationHelper(collectionPathConverterContext.getEntityType(), collectionPathConverterContext);

        if (!aggregationHelper.isAnalyticsSupported()) {
          return;
        }

        if (pvAnnotation) {
          var _collectionPathConver3, _collectionPathConver4;

          var aVisualizations = pvAnnotation === null || pvAnnotation === void 0 ? void 0 : pvAnnotation.Visualizations;
          var contextPath = "/" + (valueList === null || valueList === void 0 ? void 0 : valueList.CollectionPath) || "/" + ((_collectionPathConver3 = collectionPathConverterContext) === null || _collectionPathConver3 === void 0 ? void 0 : (_collectionPathConver4 = _collectionPathConver3.getEntitySet()) === null || _collectionPathConver4 === void 0 ? void 0 : _collectionPathConver4.name);
          visualFilter.contextPath = contextPath;
          var chartAnnotation;

          var _iterator4 = _createForOfIteratorHelper(aVisualizations),
              _step4;

          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var _visualization$$targe;

              var visualization = _step4.value;

              if (((_visualization$$targe = visualization.$target) === null || _visualization$$targe === void 0 ? void 0 : _visualization$$targe.term) === "com.sap.vocabularies.UI.v1.Chart") {
                chartAnnotation = visualization;
                break;
              }
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }

          if (chartAnnotation) {
            var _chartAnnotation, _chartAnnotation$$tar5, _chartAnnotation$$tar6, _chartAnnotation$$tar7, _chartAnnotation$$tar8, _chartAnnotation$$tar9, _chartAnnotation$$tar10, _chartAnnotation2, _chartAnnotation2$$ta, _chartAnnotation2$$ta2, _chartAnnotation2$$ta3, _chartAnnotation2$$ta4, _chartAnnotation2$$ta5, _chartAnnotation2$$ta6;

            var _bgetVFAggregation = _checkVFAggregation(collectionPathConverterContext, chartAnnotation, aggregationHelper);

            if (!_bgetVFAggregation) {
              return;
            }

            var bDimensionHidden = (_chartAnnotation = chartAnnotation) === null || _chartAnnotation === void 0 ? void 0 : (_chartAnnotation$$tar5 = _chartAnnotation.$target) === null || _chartAnnotation$$tar5 === void 0 ? void 0 : (_chartAnnotation$$tar6 = _chartAnnotation$$tar5.Dimensions[0]) === null || _chartAnnotation$$tar6 === void 0 ? void 0 : (_chartAnnotation$$tar7 = _chartAnnotation$$tar6.$target) === null || _chartAnnotation$$tar7 === void 0 ? void 0 : (_chartAnnotation$$tar8 = _chartAnnotation$$tar7.annotations) === null || _chartAnnotation$$tar8 === void 0 ? void 0 : (_chartAnnotation$$tar9 = _chartAnnotation$$tar8.UI) === null || _chartAnnotation$$tar9 === void 0 ? void 0 : (_chartAnnotation$$tar10 = _chartAnnotation$$tar9.Hidden) === null || _chartAnnotation$$tar10 === void 0 ? void 0 : _chartAnnotation$$tar10.valueOf();
            var bDimensionHiddenFilter = (_chartAnnotation2 = chartAnnotation) === null || _chartAnnotation2 === void 0 ? void 0 : (_chartAnnotation2$$ta = _chartAnnotation2.$target) === null || _chartAnnotation2$$ta === void 0 ? void 0 : (_chartAnnotation2$$ta2 = _chartAnnotation2$$ta.Dimensions[0]) === null || _chartAnnotation2$$ta2 === void 0 ? void 0 : (_chartAnnotation2$$ta3 = _chartAnnotation2$$ta2.$target) === null || _chartAnnotation2$$ta3 === void 0 ? void 0 : (_chartAnnotation2$$ta4 = _chartAnnotation2$$ta3.annotations) === null || _chartAnnotation2$$ta4 === void 0 ? void 0 : (_chartAnnotation2$$ta5 = _chartAnnotation2$$ta4.UI) === null || _chartAnnotation2$$ta5 === void 0 ? void 0 : (_chartAnnotation2$$ta6 = _chartAnnotation2$$ta5.HiddenFilter) === null || _chartAnnotation2$$ta6 === void 0 ? void 0 : _chartAnnotation2$$ta6.valueOf();

            if (bDimensionHidden === true || bDimensionHiddenFilter === true) {
              return;
            } else if (aVisualizations && aVisualizations.length) {
              var _collectionPathConver5, _collectionPathConver6, _outParameter, _outParameter$LocalDa, _requiredProperties, _visualFilter$require, _chartAnnotation3, _chartAnnotation3$$ta, _chartAnnotation3$$ta2, _chartAnnotation3$$ta3;

              visualFilter.chartAnnotation = chartAnnotation ? (_collectionPathConver5 = collectionPathConverterContext) === null || _collectionPathConver5 === void 0 ? void 0 : _collectionPathConver5.getAbsoluteAnnotationPath(chartAnnotation.fullyQualifiedName + "/$AnnotationPath/") : undefined;
              visualFilter.presentationAnnotation = pvAnnotation ? (_collectionPathConver6 = collectionPathConverterContext) === null || _collectionPathConver6 === void 0 ? void 0 : _collectionPathConver6.getAbsoluteAnnotationPath(pvAnnotation.fullyQualifiedName + "/") : undefined;
              visualFilter.outParameter = (_outParameter = outParameter) === null || _outParameter === void 0 ? void 0 : (_outParameter$LocalDa = _outParameter.LocalDataProperty) === null || _outParameter$LocalDa === void 0 ? void 0 : _outParameter$LocalDa.value;
              visualFilter.inParameters = inParameters;
              var bIsRange = checkFilterExpressionRestrictions(converterContext.getConverterContextFor(converterContext.getAbsoluteAnnotationPath(sPropertyPath)).getDataModelObjectPath(), ["SingleRange", "MultiRange"]);

              if (compileBinding(bIsRange) === "true") {
                throw new Error("Range AllowedExpression is not supported for visual filters");
              }

              var bIsMainEntitySetSingleSelection = checkFilterExpressionRestrictions(converterContext.getConverterContextFor(converterContext.getAbsoluteAnnotationPath(sPropertyPath)).getDataModelObjectPath(), ["SingleValue"]);
              visualFilter.multipleSelectionAllowed = compileBinding(!bIsMainEntitySetSingleSelection.value);
              visualFilter.required = getIsRequired(converterContext, sPropertyPath);
              var svAnnotation;

              if (svQualifier) {
                var _collectionPathConver7, _collectionPathConver8, _collectionPathConver9;

                svAnnotation = (_collectionPathConver7 = collectionPathConverterContext) === null || _collectionPathConver7 === void 0 ? void 0 : (_collectionPathConver8 = _collectionPathConver7.getEntityTypeAnnotation("@UI.SelectionVariant#" + svQualifier)) === null || _collectionPathConver8 === void 0 ? void 0 : _collectionPathConver8.annotation;
                visualFilter.selectionVariantAnnotation = svAnnotation ? (_collectionPathConver9 = collectionPathConverterContext) === null || _collectionPathConver9 === void 0 ? void 0 : _collectionPathConver9.getAbsoluteAnnotationPath(svAnnotation.fullyQualifiedName + "/") : undefined;
              }

              var requiredProperties = [];

              if (parameterEntityType) {
                var _oEntitySetConverterC, _oEntitySetConverterC2, _oEntitySetConverterC3, _oEntitySetConverterC4, _oRestrictedProperty$;

                var sEntitySet = collectionPath.split("/")[0];
                var sNavigationProperty = collectionPath.split("/")[1];
                var oEntitySetConverterContext = converterContext.getConverterContextFor("/" + sEntitySet);
                var aRestrictedProperties = oEntitySetConverterContext === null || oEntitySetConverterContext === void 0 ? void 0 : (_oEntitySetConverterC = oEntitySetConverterContext.getDataModelObjectPath().startingEntitySet) === null || _oEntitySetConverterC === void 0 ? void 0 : (_oEntitySetConverterC2 = _oEntitySetConverterC.annotations) === null || _oEntitySetConverterC2 === void 0 ? void 0 : (_oEntitySetConverterC3 = _oEntitySetConverterC2.Capabilities) === null || _oEntitySetConverterC3 === void 0 ? void 0 : (_oEntitySetConverterC4 = _oEntitySetConverterC3.NavigationRestrictions) === null || _oEntitySetConverterC4 === void 0 ? void 0 : _oEntitySetConverterC4.RestrictedProperties;
                var oRestrictedProperty = aRestrictedProperties === null || aRestrictedProperties === void 0 ? void 0 : aRestrictedProperties.find(function (restrictedNavProp) {
                  var _restrictedNavProp$Na;

                  if (((_restrictedNavProp$Na = restrictedNavProp.NavigationProperty) === null || _restrictedNavProp$Na === void 0 ? void 0 : _restrictedNavProp$Na.type) === "NavigationPropertyPath") {
                    return restrictedNavProp.NavigationProperty.value === sNavigationProperty;
                  }
                });
                requiredProperties = oRestrictedProperty === null || oRestrictedProperty === void 0 ? void 0 : (_oRestrictedProperty$ = oRestrictedProperty.FilterRestrictions) === null || _oRestrictedProperty$ === void 0 ? void 0 : _oRestrictedProperty$.RequiredProperties;
              } else {
                var _collectionPathConver10, _entitySetAnnotations, _entitySetAnnotations2;

                var entitySetAnnotations = (_collectionPathConver10 = collectionPathConverterContext.getEntitySet()) === null || _collectionPathConver10 === void 0 ? void 0 : _collectionPathConver10.annotations;
                requiredProperties = entitySetAnnotations === null || entitySetAnnotations === void 0 ? void 0 : (_entitySetAnnotations = entitySetAnnotations.Capabilities) === null || _entitySetAnnotations === void 0 ? void 0 : (_entitySetAnnotations2 = _entitySetAnnotations.FilterRestrictions) === null || _entitySetAnnotations2 === void 0 ? void 0 : _entitySetAnnotations2.RequiredProperties;
              }

              var requiredPropertyPaths = [];

              if ((_requiredProperties = requiredProperties) !== null && _requiredProperties !== void 0 && _requiredProperties.length) {
                requiredProperties.forEach(function (oRequireProperty) {
                  requiredPropertyPaths.push(oRequireProperty.value);
                });
              }

              requiredPropertyPaths = requiredPropertyPaths.concat(aParameters);
              visualFilter.requiredProperties = requiredPropertyPaths;

              if ((_visualFilter$require = visualFilter.requiredProperties) !== null && _visualFilter$require !== void 0 && _visualFilter$require.length) {
                if (!visualFilter.inParameters || !visualFilter.inParameters.length) {
                  if (!visualFilter.selectionVariantAnnotation) {
                    visualFilter.showOverlayInitially = true;
                  } else {
                    var _svAnnotation, _svAnnotation$SelectO, _svAnnotation2, _svAnnotation2$Parame;

                    var selectOptions = ((_svAnnotation = svAnnotation) === null || _svAnnotation === void 0 ? void 0 : (_svAnnotation$SelectO = _svAnnotation.SelectOptions) === null || _svAnnotation$SelectO === void 0 ? void 0 : _svAnnotation$SelectO.map(function (oSelectOption) {
                      return oSelectOption.PropertyName.value;
                    })) || [];
                    var parameterOptions = ((_svAnnotation2 = svAnnotation) === null || _svAnnotation2 === void 0 ? void 0 : (_svAnnotation2$Parame = _svAnnotation2.Parameters) === null || _svAnnotation2$Parame === void 0 ? void 0 : _svAnnotation2$Parame.map(function (oParameterOption) {
                      return oParameterOption.PropertyName.value;
                    })) || [];
                    selectOptions = selectOptions.concat(parameterOptions);
                    requiredPropertyPaths = requiredPropertyPaths.sort();
                    selectOptions = selectOptions.sort();
                    visualFilter.showOverlayInitially = requiredPropertyPaths.some(function (sPath) {
                      return selectOptions.indexOf(sPath) === -1;
                    });
                  }
                } else {
                  visualFilter.showOverlayInitially = false;
                }
              } else {
                visualFilter.showOverlayInitially = false;
              }

              var sDimensionType = (_chartAnnotation3 = chartAnnotation) === null || _chartAnnotation3 === void 0 ? void 0 : (_chartAnnotation3$$ta = _chartAnnotation3.$target) === null || _chartAnnotation3$$ta === void 0 ? void 0 : (_chartAnnotation3$$ta2 = _chartAnnotation3$$ta.Dimensions[0]) === null || _chartAnnotation3$$ta2 === void 0 ? void 0 : (_chartAnnotation3$$ta3 = _chartAnnotation3$$ta2.$target) === null || _chartAnnotation3$$ta3 === void 0 ? void 0 : _chartAnnotation3$$ta3.type;

              if (!(sDimensionType === "Edm.DateTimeOffset" || sDimensionType === "Edm.Date" || sDimensionType === "Edm.TimeOfDay") && chartAnnotation.$target.ChartType === "UI.ChartType/Line") {
                visualFilter.renderLineChart = false;
              } else {
                visualFilter.renderLineChart = true;
              }
            }
          } else {
            converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.High, IssueType.MALFORMED_VISUALFILTERS.CHART);
          }
        } else {
          converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.High, IssueType.MALFORMED_VISUALFILTERS.PRESENTATIONVARIANT);
        }
      } else {
        converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.High, IssueType.MALFORMED_VISUALFILTERS.VALUELIST);
      }
    } else {
      converterContext.getDiagnostics().addIssue(IssueCategory.Manifest, IssueSeverity.High, IssueType.MALFORMED_VISUALFILTERS.VALUELIST);
    }

    if (Object.keys(visualFilter).length > 1) {
      return visualFilter;
    }
  }

  _exports.getVisualFilters = getVisualFilters;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlZpc3VhbEZpbHRlcnMudHMiXSwibmFtZXMiOlsiX2NoZWNrVkZBZ2dyZWdhdGlvbiIsImNvbnZlcnRlckNvbnRleHQiLCJjaGFydEFubm90YXRpb24iLCJhZ2dyZWdhdGlvbkhlbHBlciIsInNNZWFzdXJlUGF0aCIsImJHcm91cGFibGUiLCJiQWdncmVnYXRhYmxlIiwic01lYXN1cmUiLCIkdGFyZ2V0IiwiTWVhc3VyZXMiLCJ2YWx1ZSIsInNEaW1lbnNpb24iLCJEaW1lbnNpb25zIiwiY3VzdG9tQWdncmVnYXRlcyIsImdldEN1c3RvbUFnZ3JlZ2F0ZURlZmluaXRpb25zIiwiYVRyYW5zQWdncmVnYXRpb25zIiwiZ2V0VHJhbnNBZ2dyZWdhdGlvbnMiLCJzb21lIiwiY3VzdEFnZyIsInF1YWxpZmllciIsImFBZ2dyZWdhdGlvbnMiLCJvQWdncmVnYXRlIiwiTmFtZSIsIkFnZ3JlZ2F0YWJsZVByb3BlcnR5IiwiYUFnZ3JlZ2F0YWJsZVByb3BzRnJvbUNvbnRhaW5lciIsImdldEFnZ3JlZ2F0YWJsZVByb3BlcnRpZXMiLCJhR3JvdXBhYmxlUHJvcHNGcm9tQ29udGFpbmVyIiwiZ2V0R3JvdXBhYmxlUHJvcGVydGllcyIsImxlbmd0aCIsImFnZ3JlZ2F0YWJsZVByb3AiLCJQcm9wZXJ0eSIsImdyb3VwYWJsZVByb3AiLCJnZXRWaXN1YWxGaWx0ZXJzIiwiZW50aXR5VHlwZSIsInNQcm9wZXJ0eVBhdGgiLCJGaWx0ZXJGaWVsZHMiLCJ2aXN1YWxGaWx0ZXIiLCJvVmlzdWFsRmlsdGVyIiwidmFsdWVMaXN0Iiwib1ZGUGF0aCIsImFubm90YXRpb25RdWFsaWZpZXJTcGxpdCIsInNwbGl0IiwicXVhbGlmaWVyVkwiLCJwcm9wZXJ0eSIsInJlc29sdmVQYXRoIiwiYW5ub3RhdGlvbnMiLCJDb21tb24iLCJjb2xsZWN0aW9uUGF0aCIsIkNvbGxlY3Rpb25QYXRoIiwiY29sbGVjdGlvblBhdGhDb252ZXJ0ZXJDb250ZXh0IiwiZ2V0Q29udmVydGVyQ29udGV4dEZvciIsImdldEVudGl0eVNldCIsIm5hbWUiLCJ2YWx1ZUxpc3RQYXJhbXMiLCJQYXJhbWV0ZXJzIiwib3V0UGFyYW1ldGVyIiwiaW5QYXJhbWV0ZXJzIiwiYVBhcmFtZXRlcnMiLCJnZXREYXRhTW9kZWxPYmplY3RQYXRoIiwidGFyZ2V0RW50aXR5U2V0IiwicmVzb2x2ZWRUYXJnZXQiLCJnZXRFbnRpdHlUeXBlQW5ub3RhdGlvbiIsInBhcmFtZXRlckVudGl0eVR5cGUiLCJnZXRQYXJhbWV0ZXJFbnRpdHlUeXBlIiwia2V5cyIsIm1hcCIsImtleSIsImdldENvbnRleHRQYXRoIiwiZm9yRWFjaCIsInBhcmFtZXRlciIsInB1c2giLCJsb2NhbERhdGFQcm9wZXJ0eSIsInZhbHVlTGlzdFByb3BlcnR5IiwidmFsdWVMaXN0UGFyYW0iLCJMb2NhbERhdGFQcm9wZXJ0eSIsIlZhbHVlTGlzdFByb3BlcnR5IiwiJFR5cGUiLCJiTm90RmlsdGVyYWJsZSIsImlzUHJvcGVydHlGaWx0ZXJhYmxlIiwib0luUGFyYW1ldGVyIiwibWFpbkVudGl0eVNldEluTWFwcGluZ0FsbG93ZWRFeHByZXNzaW9uIiwiY29tcGlsZUJpbmRpbmciLCJjaGVja0ZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvbnMiLCJnZXRBYnNvbHV0ZUFubm90YXRpb25QYXRoIiwidmFsdWVMaXN0RW50aXR5U2V0SW5NYXBwaW5nQWxsb3dlZEV4cHJlc3Npb24iLCJFcnJvciIsInB2UXVhbGlmaWVyIiwiUHJlc2VudGF0aW9uVmFyaWFudFF1YWxpZmllciIsInN2UXVhbGlmaWVyIiwiU2VsZWN0aW9uVmFyaWFudFF1YWxpZmllciIsInB2QW5ub3RhdGlvbiIsImFubm90YXRpb24iLCJBZ2dyZWdhdGlvbkhlbHBlciIsImdldEVudGl0eVR5cGUiLCJpc0FuYWx5dGljc1N1cHBvcnRlZCIsImFWaXN1YWxpemF0aW9ucyIsIlZpc3VhbGl6YXRpb25zIiwiY29udGV4dFBhdGgiLCJ2aXN1YWxpemF0aW9uIiwidGVybSIsIl9iZ2V0VkZBZ2dyZWdhdGlvbiIsImJEaW1lbnNpb25IaWRkZW4iLCJVSSIsIkhpZGRlbiIsInZhbHVlT2YiLCJiRGltZW5zaW9uSGlkZGVuRmlsdGVyIiwiSGlkZGVuRmlsdGVyIiwiZnVsbHlRdWFsaWZpZWROYW1lIiwidW5kZWZpbmVkIiwicHJlc2VudGF0aW9uQW5ub3RhdGlvbiIsImJJc1JhbmdlIiwiYklzTWFpbkVudGl0eVNldFNpbmdsZVNlbGVjdGlvbiIsIm11bHRpcGxlU2VsZWN0aW9uQWxsb3dlZCIsInJlcXVpcmVkIiwiZ2V0SXNSZXF1aXJlZCIsInN2QW5ub3RhdGlvbiIsInNlbGVjdGlvblZhcmlhbnRBbm5vdGF0aW9uIiwicmVxdWlyZWRQcm9wZXJ0aWVzIiwic0VudGl0eVNldCIsInNOYXZpZ2F0aW9uUHJvcGVydHkiLCJvRW50aXR5U2V0Q29udmVydGVyQ29udGV4dCIsImFSZXN0cmljdGVkUHJvcGVydGllcyIsInN0YXJ0aW5nRW50aXR5U2V0IiwiQ2FwYWJpbGl0aWVzIiwiTmF2aWdhdGlvblJlc3RyaWN0aW9ucyIsIlJlc3RyaWN0ZWRQcm9wZXJ0aWVzIiwib1Jlc3RyaWN0ZWRQcm9wZXJ0eSIsImZpbmQiLCJyZXN0cmljdGVkTmF2UHJvcCIsIk5hdmlnYXRpb25Qcm9wZXJ0eSIsInR5cGUiLCJGaWx0ZXJSZXN0cmljdGlvbnMiLCJSZXF1aXJlZFByb3BlcnRpZXMiLCJlbnRpdHlTZXRBbm5vdGF0aW9ucyIsInJlcXVpcmVkUHJvcGVydHlQYXRocyIsIm9SZXF1aXJlUHJvcGVydHkiLCJjb25jYXQiLCJzaG93T3ZlcmxheUluaXRpYWxseSIsInNlbGVjdE9wdGlvbnMiLCJTZWxlY3RPcHRpb25zIiwib1NlbGVjdE9wdGlvbiIsIlByb3BlcnR5TmFtZSIsInBhcmFtZXRlck9wdGlvbnMiLCJvUGFyYW1ldGVyT3B0aW9uIiwic29ydCIsInNQYXRoIiwiaW5kZXhPZiIsInNEaW1lbnNpb25UeXBlIiwiQ2hhcnRUeXBlIiwicmVuZGVyTGluZUNoYXJ0IiwiZ2V0RGlhZ25vc3RpY3MiLCJhZGRJc3N1ZSIsIklzc3VlQ2F0ZWdvcnkiLCJBbm5vdGF0aW9uIiwiSXNzdWVTZXZlcml0eSIsIkhpZ2giLCJJc3N1ZVR5cGUiLCJNQUxGT1JNRURfVklTVUFMRklMVEVSUyIsIkNIQVJUIiwiUFJFU0VOVEFUSU9OVkFSSUFOVCIsIlZBTFVFTElTVCIsIk1hbmlmZXN0IiwiT2JqZWN0Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU1BLG1CQUFtQixHQUFHLFVBQzNCQyxnQkFEMkIsRUFFM0JDLGVBRjJCLEVBRzNCQyxpQkFIMkIsRUFJTDtBQUFBOztBQUN0QixRQUFJQyxZQUFKLEVBQWtCQyxVQUFsQixFQUE4QkMsYUFBOUI7QUFDQSxRQUFNQyxRQUFnQixHQUFHTCxlQUFILGFBQUdBLGVBQUgsZ0RBQUdBLGVBQWUsQ0FBRU0sT0FBcEIsb0ZBQUcsc0JBQTBCQyxRQUExQixDQUFtQyxDQUFuQyxDQUFILDJEQUFHLHVCQUF1Q0MsS0FBaEU7QUFDQSxRQUFNQyxVQUFrQixHQUFHVCxlQUFILGFBQUdBLGVBQUgsaURBQUdBLGVBQWUsQ0FBRU0sT0FBcEIscUZBQUcsdUJBQTBCSSxVQUExQixDQUFxQyxDQUFyQyxDQUFILDJEQUFHLHVCQUF5Q0YsS0FBcEU7QUFDQSxRQUFNRyxnQkFBZ0IsR0FBR1YsaUJBQWlCLENBQUNXLDZCQUFsQixFQUF6QjtBQUNBLFFBQU1DLGtCQUFrQixHQUFHWixpQkFBaUIsQ0FBQ2Esb0JBQWxCLEVBQTNCOztBQUVBLFFBQ0NILGdCQUFnQixDQUFDSSxJQUFqQixDQUFzQixVQUFTQyxPQUFULEVBQW1EO0FBQ3hFLGFBQU9BLE9BQU8sQ0FBQ0MsU0FBUixLQUFzQlosUUFBN0I7QUFDQSxLQUZELENBREQsRUFJRTtBQUNESCxNQUFBQSxZQUFZLEdBQUdHLFFBQWY7QUFDQSxLQU5ELE1BTU8sSUFBSVEsa0JBQWtCLElBQUlBLGtCQUFrQixDQUFDLENBQUQsQ0FBNUMsRUFBaUQ7QUFD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RXlEQyxTQUFTLENBQUNDLHVCQUFWLENBQWtDQyxLQUYzRjtBQUdBO0FBQ0QsU0FsSUQsTUFrSU87QUFDTjdKLFVBQUFBLGdCQUFnQixDQUNkcUosY0FERixHQUVFQyxRQUZGLENBRVdDLGFBQWEsQ0FBQ0MsVUFGekIsRUFFcUNDLGFBQWEsQ0FBQ0MsSUFGbkQsRUFFeURDLFNBQVMsQ0FBQ0MsdUJBQVYsQ0FBa0NFLG1CQUYzRjtBQUdBO0FBQ0QsT0EvTkQsTUErTk87QUFDTjlKLFFBQUFBLGdCQUFnQixDQUNkcUosY0FERixHQUVFQyxRQUZGLENBRVdDLGFBQWEsQ0FBQ0MsVUFGekIsRUFFcUNDLGFBQWEsQ0FBQ0MsSUFGbkQsRUFFeURDLFNBQVMsQ0FBQ0MsdUJBQVYsQ0FBa0NHLFNBRjNGO0FBR0E7QUFDRCxLQTFPRCxNQTBPTztBQUNOL0osTUFBQUEsZ0JBQWdCLENBQUNxSixjQUFqQixHQUFrQ0MsUUFBbEMsQ0FBMkNDLGFBQWEsQ0FBQ1MsUUFBekQsRUFBbUVQLGFBQWEsQ0FBQ0MsSUFBakYsRUFBdUZDLFNBQVMsQ0FBQ0MsdUJBQVYsQ0FBa0NHLFNBQXpIO0FBQ0E7O0FBQ0QsUUFBSUUsTUFBTSxDQUFDbEcsSUFBUCxDQUFZNUIsWUFBWixFQUEwQlIsTUFBMUIsR0FBbUMsQ0FBdkMsRUFBMEM7QUFDekMsYUFBT1EsWUFBUDtBQUNBO0FBQ0QiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVudGl0eVR5cGUgfSBmcm9tIFwiQHNhcC11eC9hbm5vdGF0aW9uLWNvbnZlcnRlclwiO1xuaW1wb3J0IENvbnZlcnRlckNvbnRleHQgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvQ29udmVydGVyQ29udGV4dFwiO1xuaW1wb3J0IHsgRmlsdGVyRmllbGRNYW5pZmVzdENvbmZpZ3VyYXRpb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9NYW5pZmVzdFNldHRpbmdzXCI7XG5pbXBvcnQgeyBpc1Byb3BlcnR5RmlsdGVyYWJsZSwgZ2V0SXNSZXF1aXJlZCB9IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL0ZpbHRlclRlbXBsYXRpbmdcIjtcbmltcG9ydCB7IGNvbXBpbGVCaW5kaW5nIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ0V4cHJlc3Npb25cIjtcbmltcG9ydCB7IGNoZWNrRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucyB9IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL0RhdGFNb2RlbFBhdGhIZWxwZXJcIjtcbmltcG9ydCB7IEFnZ3JlZ2F0aW9uSGVscGVyIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9BZ2dyZWdhdGlvblwiO1xuaW1wb3J0IHsgSXNzdWVUeXBlLCBJc3N1ZVNldmVyaXR5LCBJc3N1ZUNhdGVnb3J5IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9Jc3N1ZU1hbmFnZXJcIjtcbmltcG9ydCB7IE5hdmlnYXRpb25Qcm9wZXJ0eVJlc3RyaWN0aW9uVHlwZXMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvZGlzdC9nZW5lcmF0ZWQvQ2FwYWJpbGl0aWVzXCI7XG5pbXBvcnQgeyBBbm5vdGF0aW9uVGVybSB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHsgQ3VzdG9tQWdncmVnYXRlIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL2Rpc3QvZ2VuZXJhdGVkL0FnZ3JlZ2F0aW9uXCI7XG5cbmV4cG9ydCB0eXBlIFZpc3VhbEZpbHRlcnMgPSB7XG5cdGRpbWVuc2lvblBhdGg/OiBzdHJpbmc7XG5cdG1lYXN1cmVQYXRoPzogc3RyaW5nO1xuXHRsYWJlbD86IHN0cmluZztcblx0Y2hhcnRBbm5vdGF0aW9uPzogc3RyaW5nO1xuXHRwcmVzZW50YXRpb25Bbm5vdGF0aW9uPzogc3RyaW5nO1xuXHR2aXNpYmxlPzogYm9vbGVhbjtcblx0b3V0UGFyYW1ldGVyPzogc3RyaW5nO1xuXHRpblBhcmFtZXRlcnM/OiBvYmplY3RbXTtcblx0Y29udGV4dFBhdGg/OiBzdHJpbmc7XG5cdHNlbGVjdGlvblZhcmlhbnRBbm5vdGF0aW9uPzogc3RyaW5nO1xuXHRtdWx0aXBsZVNlbGVjdGlvbkFsbG93ZWQ/OiBib29sZWFuO1xuXHRyZXF1aXJlZD86IGJvb2xlYW47XG5cdHNob3dPdmVybGF5SW5pdGlhbGx5PzogYm9vbGVhbjtcblx0cmVuZGVyTGluZUNoYXJ0PzogYm9vbGVhbjtcblx0cmVxdWlyZWRQcm9wZXJ0aWVzPzogb2JqZWN0W107XG59O1xuXG4vKipcbiAqIENoZWNrcyB0aGF0IG1lYXN1cmVzIGFuZCBkaW1lbnNpb25zIG9mIHRoZSB2aXN1YWwgZmlsdGVyIGNoYXJ0IGNhbiBiZSBhZ2dyZWdhdGVkIGFuZCBncm91cGVkLlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcGFyYW0gY2hhcnRBbm5vdGF0aW9uIFRoZSBjaGFydCBhbm5vdGF0aW9uXG4gKiBAcGFyYW0gYWdncmVnYXRpb25IZWxwZXIgVGhlIGFnZ3JlZ2F0aW9uIGhlbHBlclxuICogQHJldHVybnMge2Jvb2xlYW4gfCB1bmRlZmluZWQgfVxuICovXG5jb25zdCBfY2hlY2tWRkFnZ3JlZ2F0aW9uID0gZnVuY3Rpb24oXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGNoYXJ0QW5ub3RhdGlvbjogYW55LFxuXHRhZ2dyZWdhdGlvbkhlbHBlcjogYW55XG4pOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcblx0bGV0IHNNZWFzdXJlUGF0aCwgYkdyb3VwYWJsZSwgYkFnZ3JlZ2F0YWJsZTtcblx0Y29uc3Qgc01lYXN1cmU6IHN0cmluZyA9IGNoYXJ0QW5ub3RhdGlvbj8uJHRhcmdldD8uTWVhc3VyZXNbMF0/LnZhbHVlO1xuXHRjb25zdCBzRGltZW5zaW9uOiBzdHJpbmcgPSBjaGFydEFubm90YXRpb24/LiR0YXJnZXQ/LkRpbWVuc2lvbnNbMF0/LnZhbHVlO1xuXHRjb25zdCBjdXN0b21BZ2dyZWdhdGVzID0gYWdncmVnYXRpb25IZWxwZXIuZ2V0Q3VzdG9tQWdncmVnYXRlRGVmaW5pdGlvbnMoKTtcblx0Y29uc3QgYVRyYW5zQWdncmVnYXRpb25zID0gYWdncmVnYXRpb25IZWxwZXIuZ2V0VHJhbnNBZ2dyZWdhdGlvbnMoKTtcblxuXHRpZiAoXG5cdFx0Y3VzdG9tQWdncmVnYXRlcy5zb21lKGZ1bmN0aW9uKGN1c3RBZ2c6IEFubm90YXRpb25UZXJtPEN1c3RvbUFnZ3JlZ2F0ZT4pIHtcblx0XHRcdHJldHVybiBjdXN0QWdnLnF1YWxpZmllciA9PT0gc01lYXN1cmU7XG5cdFx0fSlcblx0KSB7XG5cdFx0c01lYXN1cmVQYXRoID0gc01lYXN1cmU7XG5cdH0gZWxzZSBpZiAoYVRyYW5zQWdncmVnYXRpb25zICYmIGFUcmFuc0FnZ3JlZ2F0aW9uc1swXSkge1xuXHRcdGNvbnN0IGFBZ2dyZWdhdGlvbnMgPSBhVHJhbnNBZ2dyZWdhdGlvbnNbMF07XG5cdFx0YUFnZ3JlZ2F0aW9ucy5zb21lKGZ1bmN0aW9uKG9BZ2dyZWdhdGU6IGFueSkge1xuXHRcdFx0aWYgKG9BZ2dyZWdhdGUuTmFtZSA9PT0gc01lYXN1cmUpIHtcblx0XHRcdFx0c01lYXN1cmVQYXRoID0gb0FnZ3JlZ2F0ZT8uQWdncmVnYXRhYmxlUHJvcGVydHkudmFsdWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0Y29uc3QgYUFnZ3JlZ2F0YWJsZVByb3BzRnJvbUNvbnRhaW5lciA9IGFnZ3JlZ2F0aW9uSGVscGVyLmdldEFnZ3JlZ2F0YWJsZVByb3BlcnRpZXMoKTtcblx0Y29uc3QgYUdyb3VwYWJsZVByb3BzRnJvbUNvbnRhaW5lciA9IGFnZ3JlZ2F0aW9uSGVscGVyLmdldEdyb3VwYWJsZVByb3BlcnRpZXMoKTtcblx0aWYgKGFBZ2dyZWdhdGFibGVQcm9wc0Zyb21Db250YWluZXIgJiYgYUFnZ3JlZ2F0YWJsZVByb3BzRnJvbUNvbnRhaW5lci5sZW5ndGgpIHtcblx0XHRmb3IgKGNvbnN0IGFnZ3JlZ2F0YWJsZVByb3Agb2YgYUFnZ3JlZ2F0YWJsZVByb3BzRnJvbUNvbnRhaW5lcikge1xuXHRcdFx0aWYgKGFnZ3JlZ2F0YWJsZVByb3A/LlByb3BlcnR5Py52YWx1ZSA9PT0gc01lYXN1cmVQYXRoKSB7XG5cdFx0XHRcdGJBZ2dyZWdhdGFibGUgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRpZiAoYUdyb3VwYWJsZVByb3BzRnJvbUNvbnRhaW5lciAmJiBhR3JvdXBhYmxlUHJvcHNGcm9tQ29udGFpbmVyLmxlbmd0aCkge1xuXHRcdGZvciAoY29uc3QgZ3JvdXBhYmxlUHJvcCBvZiBhR3JvdXBhYmxlUHJvcHNGcm9tQ29udGFpbmVyKSB7XG5cdFx0XHRpZiAoZ3JvdXBhYmxlUHJvcD8udmFsdWUgPT09IHNEaW1lbnNpb24pIHtcblx0XHRcdFx0Ykdyb3VwYWJsZSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBiQWdncmVnYXRhYmxlICYmIGJHcm91cGFibGU7XG59O1xuXG4vKipcbiAqIE1ldGhvZCB0byBnZXQgdGhlIHZpc3VhbCBmaWx0ZXJzIG9iamVjdCBmb3IgYSBwcm9wZXJ0eS5cbiAqIEBwYXJhbSBlbnRpdHlUeXBlIFRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGNoYXJ0IGFubm90YXRpb25cbiAqIEBwYXJhbSBzUHJvcGVydHlQYXRoIFRoZSBhZ2dyZWdhdGlvbiBoZWxwZXJcbiAqIEBwYXJhbSBGaWx0ZXJGaWVsZHMgVGhlIGFnZ3JlZ2F0aW9uIGhlbHBlclxuICogQHJldHVybnMge1Zpc3VhbEZpbHRlcnMgfCB1bmRlZmluZWQgfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmlzdWFsRmlsdGVycyhcblx0ZW50aXR5VHlwZTogRW50aXR5VHlwZSxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0c1Byb3BlcnR5UGF0aDogc3RyaW5nLFxuXHRGaWx0ZXJGaWVsZHM6IFJlY29yZDxzdHJpbmcsIEZpbHRlckZpZWxkTWFuaWZlc3RDb25maWd1cmF0aW9uPlxuKTogVmlzdWFsRmlsdGVycyB8IHVuZGVmaW5lZCB7XG5cdGNvbnN0IHZpc3VhbEZpbHRlcjogVmlzdWFsRmlsdGVycyA9IHt9O1xuXHRjb25zdCBvVmlzdWFsRmlsdGVyOiBGaWx0ZXJGaWVsZE1hbmlmZXN0Q29uZmlndXJhdGlvbiA9IEZpbHRlckZpZWxkc1tzUHJvcGVydHlQYXRoXTtcblx0aWYgKG9WaXN1YWxGaWx0ZXIgJiYgb1Zpc3VhbEZpbHRlcj8udmlzdWFsRmlsdGVyICYmIG9WaXN1YWxGaWx0ZXI/LnZpc3VhbEZpbHRlcj8udmFsdWVMaXN0KSB7XG5cdFx0Y29uc3Qgb1ZGUGF0aCA9IG9WaXN1YWxGaWx0ZXI/LnZpc3VhbEZpbHRlcj8udmFsdWVMaXN0O1xuXHRcdGNvbnN0IGFubm90YXRpb25RdWFsaWZpZXJTcGxpdCA9IG9WRlBhdGguc3BsaXQoXCIjXCIpO1xuXHRcdGNvbnN0IHF1YWxpZmllclZMID0gYW5ub3RhdGlvblF1YWxpZmllclNwbGl0Lmxlbmd0aCA+IDEgPyBcIlZhbHVlTGlzdCNcIiArIGFubm90YXRpb25RdWFsaWZpZXJTcGxpdFsxXSA6IGFubm90YXRpb25RdWFsaWZpZXJTcGxpdFswXTtcblx0XHRjb25zdCBwcm9wZXJ0eSA9IGVudGl0eVR5cGUucmVzb2x2ZVBhdGgoc1Byb3BlcnR5UGF0aCk7XG5cdFx0Y29uc3QgdmFsdWVMaXN0OiBhbnkgPSBwcm9wZXJ0eT8uYW5ub3RhdGlvbnM/LkNvbW1vbltxdWFsaWZpZXJWTF07XG5cdFx0aWYgKHZhbHVlTGlzdCkge1xuXHRcdFx0Y29uc3QgY29sbGVjdGlvblBhdGggPSB2YWx1ZUxpc3Q/LkNvbGxlY3Rpb25QYXRoO1xuXHRcdFx0bGV0IGNvbGxlY3Rpb25QYXRoQ29udmVydGVyQ29udGV4dCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0Q29udmVydGVyQ29udGV4dEZvcihcblx0XHRcdFx0XCIvXCIgKyAoY29sbGVjdGlvblBhdGggfHwgY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKT8ubmFtZSlcblx0XHRcdCk7XG5cdFx0XHRjb25zdCB2YWx1ZUxpc3RQYXJhbXMgPSB2YWx1ZUxpc3Q/LlBhcmFtZXRlcnM7XG5cdFx0XHRsZXQgb3V0UGFyYW1ldGVyOiBhbnk7XG5cdFx0XHRjb25zdCBpblBhcmFtZXRlcnM6IEFycmF5PG9iamVjdD4gPSBbXTtcblx0XHRcdGxldCBhUGFyYW1ldGVyczogQXJyYXk8c3RyaW5nPiA9IFtdO1xuXHRcdFx0aWYgKCFjb2xsZWN0aW9uUGF0aENvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpLnRhcmdldEVudGl0eVNldCkge1xuXHRcdFx0XHRjb25zdCByZXNvbHZlZFRhcmdldCA9IGNvbGxlY3Rpb25QYXRoQ29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlQW5ub3RhdGlvbihcIlwiKTtcblx0XHRcdFx0Y29sbGVjdGlvblBhdGhDb252ZXJ0ZXJDb250ZXh0ID0gcmVzb2x2ZWRUYXJnZXQuY29udmVydGVyQ29udGV4dDtcblx0XHRcdH1cblx0XHRcdGNvbnN0IHBhcmFtZXRlckVudGl0eVR5cGUgPSBjb2xsZWN0aW9uUGF0aENvbnZlcnRlckNvbnRleHQuZ2V0UGFyYW1ldGVyRW50aXR5VHlwZSgpO1xuXHRcdFx0YVBhcmFtZXRlcnMgPSBwYXJhbWV0ZXJFbnRpdHlUeXBlXG5cdFx0XHRcdD8gcGFyYW1ldGVyRW50aXR5VHlwZS5rZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcblx0XHRcdFx0XHRcdHJldHVybiBrZXkubmFtZTtcblx0XHRcdFx0ICB9KVxuXHRcdFx0XHQ6IFtdO1xuXHRcdFx0aWYgKGNvbnZlcnRlckNvbnRleHQuZ2V0Q29udGV4dFBhdGgoKSA9PT0gY29sbGVjdGlvblBhdGhDb252ZXJ0ZXJDb250ZXh0LmdldENvbnRleHRQYXRoKCkpIHtcblx0XHRcdFx0YVBhcmFtZXRlcnMuZm9yRWFjaChmdW5jdGlvbihwYXJhbWV0ZXI6IGFueSkge1xuXHRcdFx0XHRcdGluUGFyYW1ldGVycy5wdXNoKHtcblx0XHRcdFx0XHRcdGxvY2FsRGF0YVByb3BlcnR5OiBwYXJhbWV0ZXIsXG5cdFx0XHRcdFx0XHR2YWx1ZUxpc3RQcm9wZXJ0eTogcGFyYW1ldGVyXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHZhbHVlTGlzdFBhcmFtcykge1xuXHRcdFx0XHRmb3IgKGNvbnN0IHZhbHVlTGlzdFBhcmFtIG9mIHZhbHVlTGlzdFBhcmFtcykge1xuXHRcdFx0XHRcdGNvbnN0IGxvY2FsRGF0YVByb3BlcnR5ID0gKHZhbHVlTGlzdFBhcmFtIGFzIGFueSkuTG9jYWxEYXRhUHJvcGVydHk/LnZhbHVlO1xuXHRcdFx0XHRcdGNvbnN0IHZhbHVlTGlzdFByb3BlcnR5ID0gKHZhbHVlTGlzdFBhcmFtIGFzIGFueSkuVmFsdWVMaXN0UHJvcGVydHk7XG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0KHZhbHVlTGlzdFBhcmFtPy4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVmFsdWVMaXN0UGFyYW1ldGVySW5PdXRcIiB8fFxuXHRcdFx0XHRcdFx0XHR2YWx1ZUxpc3RQYXJhbT8uJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlZhbHVlTGlzdFBhcmFtZXRlck91dFwiKSAmJlxuXHRcdFx0XHRcdFx0c1Byb3BlcnR5UGF0aCA9PT0gbG9jYWxEYXRhUHJvcGVydHlcblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdG91dFBhcmFtZXRlciA9IHZhbHVlTGlzdFBhcmFtO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHQodmFsdWVMaXN0UGFyYW0/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5WYWx1ZUxpc3RQYXJhbWV0ZXJJbk91dFwiIHx8XG5cdFx0XHRcdFx0XHRcdHZhbHVlTGlzdFBhcmFtPy4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVmFsdWVMaXN0UGFyYW1ldGVySW5cIikgJiZcblx0XHRcdFx0XHRcdHNQcm9wZXJ0eVBhdGggIT09IGxvY2FsRGF0YVByb3BlcnR5XG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRjb25zdCBiTm90RmlsdGVyYWJsZSA9IGlzUHJvcGVydHlGaWx0ZXJhYmxlKGNvbGxlY3Rpb25QYXRoQ29udmVydGVyQ29udGV4dCwgdmFsdWVMaXN0UHJvcGVydHkpO1xuXHRcdFx0XHRcdFx0aWYgKCFiTm90RmlsdGVyYWJsZSkge1xuXHRcdFx0XHRcdFx0XHRpblBhcmFtZXRlcnMucHVzaCh7XG5cdFx0XHRcdFx0XHRcdFx0bG9jYWxEYXRhUHJvcGVydHk6IGxvY2FsRGF0YVByb3BlcnR5LFxuXHRcdFx0XHRcdFx0XHRcdHZhbHVlTGlzdFByb3BlcnR5OiB2YWx1ZUxpc3RQcm9wZXJ0eVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChpblBhcmFtZXRlcnMgJiYgaW5QYXJhbWV0ZXJzLmxlbmd0aCkge1xuXHRcdFx0XHRpblBhcmFtZXRlcnMuZm9yRWFjaChmdW5jdGlvbihvSW5QYXJhbWV0ZXI6IGFueSkge1xuXHRcdFx0XHRcdGNvbnN0IG1haW5FbnRpdHlTZXRJbk1hcHBpbmdBbGxvd2VkRXhwcmVzc2lvbiA9IGNvbXBpbGVCaW5kaW5nKFxuXHRcdFx0XHRcdFx0Y2hlY2tGaWx0ZXJFeHByZXNzaW9uUmVzdHJpY3Rpb25zKFxuXHRcdFx0XHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHRcdFx0XHRcdFx0LmdldENvbnZlcnRlckNvbnRleHRGb3IoY29udmVydGVyQ29udGV4dC5nZXRBYnNvbHV0ZUFubm90YXRpb25QYXRoKG9JblBhcmFtZXRlcj8ubG9jYWxEYXRhUHJvcGVydHkpKVxuXHRcdFx0XHRcdFx0XHRcdC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCksXG5cdFx0XHRcdFx0XHRcdFtcIlNpbmdsZVZhbHVlXCJdXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRjb25zdCB2YWx1ZUxpc3RFbnRpdHlTZXRJbk1hcHBpbmdBbGxvd2VkRXhwcmVzc2lvbiA9IGNvbXBpbGVCaW5kaW5nKFxuXHRcdFx0XHRcdFx0Y2hlY2tGaWx0ZXJFeHByZXNzaW9uUmVzdHJpY3Rpb25zKFxuXHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uUGF0aENvbnZlcnRlckNvbnRleHRcblx0XHRcdFx0XHRcdFx0XHQuZ2V0Q29udmVydGVyQ29udGV4dEZvcihcblx0XHRcdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb25QYXRoQ29udmVydGVyQ29udGV4dC5nZXRBYnNvbHV0ZUFubm90YXRpb25QYXRoKG9JblBhcmFtZXRlcj8udmFsdWVMaXN0UHJvcGVydHkpXG5cdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHRcdC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCksXG5cdFx0XHRcdFx0XHRcdFtcIlNpbmdsZVZhbHVlXCJdXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRpZiAodmFsdWVMaXN0RW50aXR5U2V0SW5NYXBwaW5nQWxsb3dlZEV4cHJlc3Npb24gPT09IFwidHJ1ZVwiICYmIG1haW5FbnRpdHlTZXRJbk1hcHBpbmdBbGxvd2VkRXhwcmVzc2lvbiA9PT0gXCJmYWxzZVwiKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0XHRcdFwiRmlsdGVyUmVzdHJpY3Rpb25zIG9mIFwiICsgc1Byb3BlcnR5UGF0aCArIFwiIGluIE1haW5FbnRpdHlTZXQgYW5kIFZhbHVlTGlzdEVudGl0eVNldCBhcmUgZGlmZmVyZW50XCJcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IHB2UXVhbGlmaWVyID0gdmFsdWVMaXN0Py5QcmVzZW50YXRpb25WYXJpYW50UXVhbGlmaWVyO1xuXHRcdFx0Y29uc3Qgc3ZRdWFsaWZpZXIgPSB2YWx1ZUxpc3Q/LlNlbGVjdGlvblZhcmlhbnRRdWFsaWZpZXI7XG5cdFx0XHRjb25zdCBwdkFubm90YXRpb246IGFueSA9IGNvbGxlY3Rpb25QYXRoQ29udmVydGVyQ29udGV4dD8uZ2V0RW50aXR5VHlwZUFubm90YXRpb24oXCJAVUkuUHJlc2VudGF0aW9uVmFyaWFudCNcIiArIHB2UXVhbGlmaWVyKVxuXHRcdFx0XHQ/LmFubm90YXRpb247XG5cdFx0XHRjb25zdCBhZ2dyZWdhdGlvbkhlbHBlciA9IG5ldyBBZ2dyZWdhdGlvbkhlbHBlcihjb2xsZWN0aW9uUGF0aENvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpLCBjb2xsZWN0aW9uUGF0aENvbnZlcnRlckNvbnRleHQpO1xuXHRcdFx0aWYgKCFhZ2dyZWdhdGlvbkhlbHBlci5pc0FuYWx5dGljc1N1cHBvcnRlZCgpKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGlmIChwdkFubm90YXRpb24pIHtcblx0XHRcdFx0Y29uc3QgYVZpc3VhbGl6YXRpb25zID0gcHZBbm5vdGF0aW9uPy5WaXN1YWxpemF0aW9ucztcblx0XHRcdFx0Y29uc3QgY29udGV4dFBhdGggPSBcIi9cIiArIHZhbHVlTGlzdD8uQ29sbGVjdGlvblBhdGggfHwgXCIvXCIgKyBjb2xsZWN0aW9uUGF0aENvbnZlcnRlckNvbnRleHQ/LmdldEVudGl0eVNldCgpPy5uYW1lO1xuXHRcdFx0XHR2aXN1YWxGaWx0ZXIuY29udGV4dFBhdGggPSBjb250ZXh0UGF0aDtcblx0XHRcdFx0bGV0IGNoYXJ0QW5ub3RhdGlvbjtcblx0XHRcdFx0Zm9yIChjb25zdCB2aXN1YWxpemF0aW9uIG9mIGFWaXN1YWxpemF0aW9ucykge1xuXHRcdFx0XHRcdGlmICh2aXN1YWxpemF0aW9uLiR0YXJnZXQ/LnRlcm0gPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ2hhcnRcIikge1xuXHRcdFx0XHRcdFx0Y2hhcnRBbm5vdGF0aW9uID0gdmlzdWFsaXphdGlvbjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY2hhcnRBbm5vdGF0aW9uKSB7XG5cdFx0XHRcdFx0Y29uc3QgX2JnZXRWRkFnZ3JlZ2F0aW9uOiBib29sZWFuIHwgdW5kZWZpbmVkID0gX2NoZWNrVkZBZ2dyZWdhdGlvbihcblx0XHRcdFx0XHRcdGNvbGxlY3Rpb25QYXRoQ29udmVydGVyQ29udGV4dCxcblx0XHRcdFx0XHRcdGNoYXJ0QW5ub3RhdGlvbixcblx0XHRcdFx0XHRcdGFnZ3JlZ2F0aW9uSGVscGVyXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRpZiAoIV9iZ2V0VkZBZ2dyZWdhdGlvbikge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjb25zdCBiRGltZW5zaW9uSGlkZGVuOiBib29sZWFuID0gY2hhcnRBbm5vdGF0aW9uPy4kdGFyZ2V0Py5EaW1lbnNpb25zWzBdPy4kdGFyZ2V0Py5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpO1xuXHRcdFx0XHRcdGNvbnN0IGJEaW1lbnNpb25IaWRkZW5GaWx0ZXI6IGJvb2xlYW4gPSBjaGFydEFubm90YXRpb24/LiR0YXJnZXQ/LkRpbWVuc2lvbnNbMF0/LiR0YXJnZXQ/LmFubm90YXRpb25zPy5VST8uSGlkZGVuRmlsdGVyPy52YWx1ZU9mKCk7XG5cdFx0XHRcdFx0aWYgKGJEaW1lbnNpb25IaWRkZW4gPT09IHRydWUgfHwgYkRpbWVuc2lvbkhpZGRlbkZpbHRlciA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoYVZpc3VhbGl6YXRpb25zICYmIGFWaXN1YWxpemF0aW9ucy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdHZpc3VhbEZpbHRlci5jaGFydEFubm90YXRpb24gPSBjaGFydEFubm90YXRpb25cblx0XHRcdFx0XHRcdFx0PyBjb2xsZWN0aW9uUGF0aENvbnZlcnRlckNvbnRleHQ/LmdldEFic29sdXRlQW5ub3RhdGlvblBhdGgoXG5cdFx0XHRcdFx0XHRcdFx0XHRjaGFydEFubm90YXRpb24uZnVsbHlRdWFsaWZpZWROYW1lICsgXCIvJEFubm90YXRpb25QYXRoL1wiXG5cdFx0XHRcdFx0XHRcdCAgKVxuXHRcdFx0XHRcdFx0XHQ6IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdHZpc3VhbEZpbHRlci5wcmVzZW50YXRpb25Bbm5vdGF0aW9uID0gcHZBbm5vdGF0aW9uXG5cdFx0XHRcdFx0XHRcdD8gY29sbGVjdGlvblBhdGhDb252ZXJ0ZXJDb250ZXh0Py5nZXRBYnNvbHV0ZUFubm90YXRpb25QYXRoKHB2QW5ub3RhdGlvbi5mdWxseVF1YWxpZmllZE5hbWUgKyBcIi9cIilcblx0XHRcdFx0XHRcdFx0OiB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHR2aXN1YWxGaWx0ZXIub3V0UGFyYW1ldGVyID0gb3V0UGFyYW1ldGVyPy5Mb2NhbERhdGFQcm9wZXJ0eT8udmFsdWU7XG5cdFx0XHRcdFx0XHR2aXN1YWxGaWx0ZXIuaW5QYXJhbWV0ZXJzID0gaW5QYXJhbWV0ZXJzO1xuXHRcdFx0XHRcdFx0Y29uc3QgYklzUmFuZ2UgPSBjaGVja0ZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvbnMoXG5cdFx0XHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHRcblx0XHRcdFx0XHRcdFx0XHQuZ2V0Q29udmVydGVyQ29udGV4dEZvcihjb252ZXJ0ZXJDb250ZXh0LmdldEFic29sdXRlQW5ub3RhdGlvblBhdGgoc1Byb3BlcnR5UGF0aCkpXG5cdFx0XHRcdFx0XHRcdFx0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKSxcblx0XHRcdFx0XHRcdFx0W1wiU2luZ2xlUmFuZ2VcIiwgXCJNdWx0aVJhbmdlXCJdXG5cdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0XHRpZiAoY29tcGlsZUJpbmRpbmcoYklzUmFuZ2UpID09PSBcInRydWVcIikge1xuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJSYW5nZSBBbGxvd2VkRXhwcmVzc2lvbiBpcyBub3Qgc3VwcG9ydGVkIGZvciB2aXN1YWwgZmlsdGVyc1wiKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Y29uc3QgYklzTWFpbkVudGl0eVNldFNpbmdsZVNlbGVjdGlvbjogYW55ID0gY2hlY2tGaWx0ZXJFeHByZXNzaW9uUmVzdHJpY3Rpb25zKFxuXHRcdFx0XHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHRcdFx0XHRcdFx0LmdldENvbnZlcnRlckNvbnRleHRGb3IoY29udmVydGVyQ29udGV4dC5nZXRBYnNvbHV0ZUFubm90YXRpb25QYXRoKHNQcm9wZXJ0eVBhdGgpKVxuXHRcdFx0XHRcdFx0XHRcdC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCksXG5cdFx0XHRcdFx0XHRcdFtcIlNpbmdsZVZhbHVlXCJdXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0dmlzdWFsRmlsdGVyLm11bHRpcGxlU2VsZWN0aW9uQWxsb3dlZCA9IGNvbXBpbGVCaW5kaW5nKCFiSXNNYWluRW50aXR5U2V0U2luZ2xlU2VsZWN0aW9uLnZhbHVlKSBhcyBhbnk7XG5cdFx0XHRcdFx0XHR2aXN1YWxGaWx0ZXIucmVxdWlyZWQgPSBnZXRJc1JlcXVpcmVkKGNvbnZlcnRlckNvbnRleHQsIHNQcm9wZXJ0eVBhdGgpO1xuXHRcdFx0XHRcdFx0bGV0IHN2QW5ub3RhdGlvbjogYW55O1xuXHRcdFx0XHRcdFx0aWYgKHN2UXVhbGlmaWVyKSB7XG5cdFx0XHRcdFx0XHRcdHN2QW5ub3RhdGlvbiA9IGNvbGxlY3Rpb25QYXRoQ29udmVydGVyQ29udGV4dD8uZ2V0RW50aXR5VHlwZUFubm90YXRpb24oXCJAVUkuU2VsZWN0aW9uVmFyaWFudCNcIiArIHN2UXVhbGlmaWVyKVxuXHRcdFx0XHRcdFx0XHRcdD8uYW5ub3RhdGlvbjtcblx0XHRcdFx0XHRcdFx0dmlzdWFsRmlsdGVyLnNlbGVjdGlvblZhcmlhbnRBbm5vdGF0aW9uID0gc3ZBbm5vdGF0aW9uXG5cdFx0XHRcdFx0XHRcdFx0PyBjb2xsZWN0aW9uUGF0aENvbnZlcnRlckNvbnRleHQ/LmdldEFic29sdXRlQW5ub3RhdGlvblBhdGgoc3ZBbm5vdGF0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZSArIFwiL1wiKVxuXHRcdFx0XHRcdFx0XHRcdDogdW5kZWZpbmVkO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0bGV0IHJlcXVpcmVkUHJvcGVydGllcyA9IFtdO1xuXHRcdFx0XHRcdFx0aWYgKHBhcmFtZXRlckVudGl0eVR5cGUpIHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgc0VudGl0eVNldCA9IGNvbGxlY3Rpb25QYXRoLnNwbGl0KFwiL1wiKVswXTtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgc05hdmlnYXRpb25Qcm9wZXJ0eSA9IGNvbGxlY3Rpb25QYXRoLnNwbGl0KFwiL1wiKVsxXTtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgb0VudGl0eVNldENvbnZlcnRlckNvbnRleHQgPSBjb252ZXJ0ZXJDb250ZXh0LmdldENvbnZlcnRlckNvbnRleHRGb3IoXCIvXCIgKyBzRW50aXR5U2V0KTtcblx0XHRcdFx0XHRcdFx0Y29uc3QgYVJlc3RyaWN0ZWRQcm9wZXJ0aWVzID0gb0VudGl0eVNldENvbnZlcnRlckNvbnRleHQ/LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKS5zdGFydGluZ0VudGl0eVNldFxuXHRcdFx0XHRcdFx0XHRcdD8uYW5ub3RhdGlvbnM/LkNhcGFiaWxpdGllcz8uTmF2aWdhdGlvblJlc3RyaWN0aW9ucz8uUmVzdHJpY3RlZFByb3BlcnRpZXM7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IG9SZXN0cmljdGVkUHJvcGVydHkgPSBhUmVzdHJpY3RlZFByb3BlcnRpZXM/LmZpbmQoXG5cdFx0XHRcdFx0XHRcdFx0KHJlc3RyaWN0ZWROYXZQcm9wOiBOYXZpZ2F0aW9uUHJvcGVydHlSZXN0cmljdGlvblR5cGVzKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAocmVzdHJpY3RlZE5hdlByb3AuTmF2aWdhdGlvblByb3BlcnR5Py50eXBlID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIikge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcmVzdHJpY3RlZE5hdlByb3AuTmF2aWdhdGlvblByb3BlcnR5LnZhbHVlID09PSBzTmF2aWdhdGlvblByb3BlcnR5O1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0cmVxdWlyZWRQcm9wZXJ0aWVzID0gb1Jlc3RyaWN0ZWRQcm9wZXJ0eT8uRmlsdGVyUmVzdHJpY3Rpb25zPy5SZXF1aXJlZFByb3BlcnRpZXMgYXMgYW55W107XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBlbnRpdHlTZXRBbm5vdGF0aW9ucyA9IGNvbGxlY3Rpb25QYXRoQ29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKT8uYW5ub3RhdGlvbnM7XG5cdFx0XHRcdFx0XHRcdHJlcXVpcmVkUHJvcGVydGllcyA9IGVudGl0eVNldEFubm90YXRpb25zPy5DYXBhYmlsaXRpZXM/LkZpbHRlclJlc3RyaWN0aW9ucz8uUmVxdWlyZWRQcm9wZXJ0aWVzIGFzIGFueVtdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0bGV0IHJlcXVpcmVkUHJvcGVydHlQYXRoczogQXJyYXk8b2JqZWN0PiA9IFtdO1xuXHRcdFx0XHRcdFx0aWYgKHJlcXVpcmVkUHJvcGVydGllcz8ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdHJlcXVpcmVkUHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKG9SZXF1aXJlUHJvcGVydHk6IGFueSkge1xuXHRcdFx0XHRcdFx0XHRcdHJlcXVpcmVkUHJvcGVydHlQYXRocy5wdXNoKG9SZXF1aXJlUHJvcGVydHkudmFsdWUpO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJlcXVpcmVkUHJvcGVydHlQYXRocyA9IHJlcXVpcmVkUHJvcGVydHlQYXRocy5jb25jYXQoYVBhcmFtZXRlcnMpO1xuXHRcdFx0XHRcdFx0dmlzdWFsRmlsdGVyLnJlcXVpcmVkUHJvcGVydGllcyA9IHJlcXVpcmVkUHJvcGVydHlQYXRocztcblx0XHRcdFx0XHRcdGlmICh2aXN1YWxGaWx0ZXIucmVxdWlyZWRQcm9wZXJ0aWVzPy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0aWYgKCF2aXN1YWxGaWx0ZXIuaW5QYXJhbWV0ZXJzIHx8ICF2aXN1YWxGaWx0ZXIuaW5QYXJhbWV0ZXJzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdGlmICghdmlzdWFsRmlsdGVyLnNlbGVjdGlvblZhcmlhbnRBbm5vdGF0aW9uKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2aXN1YWxGaWx0ZXIuc2hvd092ZXJsYXlJbml0aWFsbHkgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgc2VsZWN0T3B0aW9ucyA9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHN2QW5ub3RhdGlvbj8uU2VsZWN0T3B0aW9ucz8ubWFwKChvU2VsZWN0T3B0aW9uOiBhbnkpID0+IG9TZWxlY3RPcHRpb24uUHJvcGVydHlOYW1lLnZhbHVlKSB8fCBbXTtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHBhcmFtZXRlck9wdGlvbnMgPVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRzdkFubm90YXRpb24/LlBhcmFtZXRlcnM/Lm1hcCgob1BhcmFtZXRlck9wdGlvbjogYW55KSA9PiBvUGFyYW1ldGVyT3B0aW9uLlByb3BlcnR5TmFtZS52YWx1ZSkgfHwgW107XG5cdFx0XHRcdFx0XHRcdFx0XHRzZWxlY3RPcHRpb25zID0gc2VsZWN0T3B0aW9ucy5jb25jYXQocGFyYW1ldGVyT3B0aW9ucyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXF1aXJlZFByb3BlcnR5UGF0aHMgPSByZXF1aXJlZFByb3BlcnR5UGF0aHMuc29ydCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0c2VsZWN0T3B0aW9ucyA9IHNlbGVjdE9wdGlvbnMuc29ydCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0dmlzdWFsRmlsdGVyLnNob3dPdmVybGF5SW5pdGlhbGx5ID0gcmVxdWlyZWRQcm9wZXJ0eVBhdGhzLnNvbWUoZnVuY3Rpb24oc1BhdGgpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHNlbGVjdE9wdGlvbnMuaW5kZXhPZihzUGF0aCkgPT09IC0xO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHZpc3VhbEZpbHRlci5zaG93T3ZlcmxheUluaXRpYWxseSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR2aXN1YWxGaWx0ZXIuc2hvd092ZXJsYXlJbml0aWFsbHkgPSBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGNvbnN0IHNEaW1lbnNpb25UeXBlID0gY2hhcnRBbm5vdGF0aW9uPy4kdGFyZ2V0Py5EaW1lbnNpb25zWzBdPy4kdGFyZ2V0Py50eXBlO1xuXHRcdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0XHQhKFxuXHRcdFx0XHRcdFx0XHRcdHNEaW1lbnNpb25UeXBlID09PSBcIkVkbS5EYXRlVGltZU9mZnNldFwiIHx8XG5cdFx0XHRcdFx0XHRcdFx0c0RpbWVuc2lvblR5cGUgPT09IFwiRWRtLkRhdGVcIiB8fFxuXHRcdFx0XHRcdFx0XHRcdHNEaW1lbnNpb25UeXBlID09PSBcIkVkbS5UaW1lT2ZEYXlcIlxuXHRcdFx0XHRcdFx0XHQpICYmXG5cdFx0XHRcdFx0XHRcdGNoYXJ0QW5ub3RhdGlvbi4kdGFyZ2V0LkNoYXJ0VHlwZSA9PT0gXCJVSS5DaGFydFR5cGUvTGluZVwiXG5cdFx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdFx0dmlzdWFsRmlsdGVyLnJlbmRlckxpbmVDaGFydCA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dmlzdWFsRmlsdGVyLnJlbmRlckxpbmVDaGFydCA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHRcblx0XHRcdFx0XHRcdC5nZXREaWFnbm9zdGljcygpXG5cdFx0XHRcdFx0XHQuYWRkSXNzdWUoSXNzdWVDYXRlZ29yeS5Bbm5vdGF0aW9uLCBJc3N1ZVNldmVyaXR5LkhpZ2gsIElzc3VlVHlwZS5NQUxGT1JNRURfVklTVUFMRklMVEVSUy5DSEFSVCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnZlcnRlckNvbnRleHRcblx0XHRcdFx0XHQuZ2V0RGlhZ25vc3RpY3MoKVxuXHRcdFx0XHRcdC5hZGRJc3N1ZShJc3N1ZUNhdGVnb3J5LkFubm90YXRpb24sIElzc3VlU2V2ZXJpdHkuSGlnaCwgSXNzdWVUeXBlLk1BTEZPUk1FRF9WSVNVQUxGSUxURVJTLlBSRVNFTlRBVElPTlZBUklBTlQpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHRcdC5nZXREaWFnbm9zdGljcygpXG5cdFx0XHRcdC5hZGRJc3N1ZShJc3N1ZUNhdGVnb3J5LkFubm90YXRpb24sIElzc3VlU2V2ZXJpdHkuSGlnaCwgSXNzdWVUeXBlLk1BTEZPUk1FRF9WSVNVQUxGSUxURVJTLlZBTFVFTElTVCk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0RGlhZ25vc3RpY3MoKS5hZGRJc3N1ZShJc3N1ZUNhdGVnb3J5Lk1hbmlmZXN0LCBJc3N1ZVNldmVyaXR5LkhpZ2gsIElzc3VlVHlwZS5NQUxGT1JNRURfVklTVUFMRklMVEVSUy5WQUxVRUxJU1QpO1xuXHR9XG5cdGlmIChPYmplY3Qua2V5cyh2aXN1YWxGaWx0ZXIpLmxlbmd0aCA+IDEpIHtcblx0XHRyZXR1cm4gdmlzdWFsRmlsdGVyO1xuXHR9XG59XG4iXX0=