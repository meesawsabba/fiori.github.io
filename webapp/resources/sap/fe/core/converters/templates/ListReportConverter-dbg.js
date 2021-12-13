/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["../ManifestSettings", "../controls/Common/DataVisualization", "../helpers/ID", "sap/fe/core/converters/controls/Common/Action", "sap/fe/core/converters/helpers/ConfigurableObject", "sap/fe/core/helpers/BindingExpression", "../controls/Common/KPI", "sap/fe/core/converters/controls/ListReport/FilterBar"], function (ManifestSettings, DataVisualization, ID, Action, ConfigurableObject, BindingExpression, KPI, FilterBar) {
  "use strict";

  var _exports = {};
  var getFilterBarhideBasicSearch = FilterBar.getFilterBarhideBasicSearch;
  var getManifestFilterFields = FilterBar.getManifestFilterFields;
  var getSelectionFields = FilterBar.getSelectionFields;
  var getKPIDefinitions = KPI.getKPIDefinitions;
  var compileBinding = BindingExpression.compileBinding;
  var annotationExpression = BindingExpression.annotationExpression;
  var insertCustomElements = ConfigurableObject.insertCustomElements;
  var getActionsFromManifest = Action.getActionsFromManifest;
  var ChartID = ID.ChartID;
  var TableID = ID.TableID;
  var FilterVariantManagementID = ID.FilterVariantManagementID;
  var FilterBarID = ID.FilterBarID;
  var CustomTabID = ID.CustomTabID;
  var isSelectionPresentationCompliant = DataVisualization.isSelectionPresentationCompliant;
  var getSelectionVariant = DataVisualization.getSelectionVariant;
  var isPresentationCompliant = DataVisualization.isPresentationCompliant;
  var getSelectionPresentationVariant = DataVisualization.getSelectionPresentationVariant;
  var getDefaultPresentationVariant = DataVisualization.getDefaultPresentationVariant;
  var getDefaultLineItem = DataVisualization.getDefaultLineItem;
  var getDefaultChart = DataVisualization.getDefaultChart;
  var getDataVisualizationConfiguration = DataVisualization.getDataVisualizationConfiguration;
  var TemplateType = ManifestSettings.TemplateType;
  var VisualizationType = ManifestSettings.VisualizationType;

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function () {}; return { s: F, n: function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function (e) { throw e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function () { it = it.call(o); }, n: function () { var step = it.next(); normalCompletion = step.done; return step; }, e: function (e) { didErr = true; err = e; }, f: function () { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  /**
   * Retrieves all list report tables.
   * @param {ListReportViewDefinition[]} views The list report views configured in the manifest
   * @returns {TableVisualization[]} The list report table
   */
  function getTableVisualizations(views) {
    var tables = [];
    views.forEach(function (view) {
      if (!view.type) {
        var visualizations = view.secondaryVisualization ? view.secondaryVisualization.visualizations : view.presentation.visualizations;
        visualizations.forEach(function (visualization) {
          if (visualization.type === VisualizationType.Table) {
            tables.push(visualization);
          }
        });
      }
    });
    return tables;
  }

  function getChartVisualizations(views) {
    var charts = [];
    views.forEach(function (view) {
      if (!view.type) {
        var visualizations = view.primaryVisualization ? view.primaryVisualization.visualizations : view.presentation.visualizations;
        visualizations.forEach(function (visualization) {
          if (visualization.type === VisualizationType.Chart) {
            charts.push(visualization);
          }
        });
      }
    });
    return charts;
  }

  var getDefaultSemanticDates = function (filterFields) {
    var defaultSemanticDates = {};

    for (var filterField in filterFields) {
      var _filterFields$filterF, _filterFields$filterF2, _filterFields$filterF3;

      if ((_filterFields$filterF = filterFields[filterField]) !== null && _filterFields$filterF !== void 0 && (_filterFields$filterF2 = _filterFields$filterF.settings) !== null && _filterFields$filterF2 !== void 0 && (_filterFields$filterF3 = _filterFields$filterF2.defaultValues) !== null && _filterFields$filterF3 !== void 0 && _filterFields$filterF3.length) {
        var _filterFields$filterF4, _filterFields$filterF5;

        defaultSemanticDates[filterField] = (_filterFields$filterF4 = filterFields[filterField]) === null || _filterFields$filterF4 === void 0 ? void 0 : (_filterFields$filterF5 = _filterFields$filterF4.settings) === null || _filterFields$filterF5 === void 0 ? void 0 : _filterFields$filterF5.defaultValues;
      }
    }

    return defaultSemanticDates;
  };
  /**
   * Find a visualization annotation that can be used for rendering the list report.
   *
   * @param {EntityType} entityType The current EntityType
   * @param converterContext
   * @param bIsALP
   * @returns {LineItem | PresentationVariantTypeTypes | undefined} A compliant annotation for rendering the list report
   */


  function getCompliantVisualizationAnnotation(entityType, converterContext, bIsALP) {
    var annotationPath = converterContext.getManifestWrapper().getDefaultTemplateAnnotationPath();
    var selectionPresentationVariant = getSelectionPresentationVariant(entityType, annotationPath, converterContext);

    if (annotationPath && selectionPresentationVariant) {
      var _presentationVariant = selectionPresentationVariant.PresentationVariant;

      if (!_presentationVariant) {
        throw new Error("Presentation Variant is not configured in the SPV mentioned in the manifest");
      }

      var bPVComplaint = isPresentationCompliant(selectionPresentationVariant.PresentationVariant);

      if (!bPVComplaint) {
        return undefined;
      }

      if (isSelectionPresentationCompliant(selectionPresentationVariant, bIsALP)) {
        return selectionPresentationVariant;
      }
    }

    if (selectionPresentationVariant) {
      if (isSelectionPresentationCompliant(selectionPresentationVariant, bIsALP)) {
        return selectionPresentationVariant;
      }
    }

    var presentationVariant = getDefaultPresentationVariant(entityType);

    if (presentationVariant) {
      if (isPresentationCompliant(presentationVariant, bIsALP)) {
        return presentationVariant;
      }
    }

    if (!bIsALP) {
      var defaultLineItem = getDefaultLineItem(entityType);

      if (defaultLineItem) {
        return defaultLineItem;
      }
    }

    return undefined;
  }

  var getView = function (viewConverterConfiguration) {
    var config = viewConverterConfiguration;

    if (config.converterContext) {
      var _presentation, _presentation$visuali;

      var converterContext = config.converterContext;
      config = config;
      var presentation = getDataVisualizationConfiguration(config.annotation ? converterContext.getRelativeAnnotationPath(config.annotation.fullyQualifiedName, converterContext.getEntityType()) : "", true, converterContext, config);
      var tableControlId = "";
      var chartControlId = "";
      var title = "";
      var selectionVariantPath = "";

      var isMultipleViewConfiguration = function (config) {
        return config.key !== undefined;
      };

      var createVisualization = function (presentation, isPrimary) {
        var defaultVisualization;

        var _iterator = _createForOfIteratorHelper(presentation.visualizations),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var visualization = _step.value;

            if (isPrimary && visualization.type === VisualizationType.Chart) {
              defaultVisualization = visualization;
              break;
            }

            if (!isPrimary && visualization.type === VisualizationType.Table) {
              defaultVisualization = visualization;
              break;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        var presentationCreated = Object.assign({}, presentation);

        if (defaultVisualization) {
          presentationCreated.visualizations = [defaultVisualization];
        }

        return presentationCreated;
      };

      var getPresentation = function (item) {
        var resolvedTarget = converterContext.getEntityTypeAnnotation(item.annotationPath);
        var targetAnnotation = resolvedTarget.annotation;
        converterContext = resolvedTarget.converterContext;
        var annotation = targetAnnotation;
        presentation = getDataVisualizationConfiguration(annotation ? converterContext.getRelativeAnnotationPath(annotation.fullyQualifiedName, converterContext.getEntityType()) : "", true, converterContext, config);
        return presentation;
      };

      var createAlpView = function (presentations, defaultPath) {
        var primaryVisualization = createVisualization(presentations[0], true);
        chartControlId = (primaryVisualization === null || primaryVisualization === void 0 ? void 0 : primaryVisualization.visualizations[0]).id;
        var secondaryVisualization = createVisualization(presentations[1] ? presentations[1] : presentations[0]);
        tableControlId = (secondaryVisualization === null || secondaryVisualization === void 0 ? void 0 : secondaryVisualization.visualizations[0]).annotation.id;

        if (primaryVisualization && secondaryVisualization) {
          var view = {
            primaryVisualization: primaryVisualization,
            secondaryVisualization: secondaryVisualization,
            tableControlId: tableControlId,
            chartControlId: chartControlId,
            defaultPath: defaultPath
          };
          return view;
        }
      };

      if (((_presentation = presentation) === null || _presentation === void 0 ? void 0 : (_presentation$visuali = _presentation.visualizations) === null || _presentation$visuali === void 0 ? void 0 : _presentation$visuali.length) === 2 && converterContext.getTemplateType() === TemplateType.AnalyticalListPage) {
        var view = createAlpView([presentation], "both");

        if (view) {
          return view;
        }
      } else if (converterContext.getManifestWrapper().hasMultipleVisualizations(config) || converterContext.getTemplateType() === TemplateType.AnalyticalListPage) {
        var _ref = config,
            primary = _ref.primary,
            secondary = _ref.secondary;

        if (primary && primary.length && secondary && secondary.length) {
          var _view = createAlpView([getPresentation(primary[0]), getPresentation(secondary[0])], config.defaultPath);

          if (_view) {
            return _view;
          }
        } else {
          throw new Error("SecondaryItems in the Views is not present");
        }
      } else if (isMultipleViewConfiguration(config)) {
        // key exists only on multi tables mode
        var resolvedTarget = converterContext.getEntityTypeAnnotation(config.annotationPath);
        var viewAnnotation = resolvedTarget.annotation;
        converterContext = resolvedTarget.converterContext;
        title = compileBinding(annotationExpression(viewAnnotation.Text)); // Need to loop on table into views since multi table mode get specific configuration (hidden filters or Table Id)

        presentation.visualizations.forEach(function (visualizationDefinition, index) {
          switch (visualizationDefinition.type) {
            case VisualizationType.Table:
              var tableVisualization = presentation.visualizations[index];
              var filters = tableVisualization.control.filters || {};
              filters.hiddenFilters = filters.hiddenFilters || {
                paths: []
              };

              if (!config.keepPreviousPresonalization) {
                // Need to override Table Id to match with Tab Key (currently only table is managed in multiple view mode)
                tableVisualization.annotation.id = TableID(config.key || "", "LineItem");
              }

              config = config;

              if (config && config.annotation && config.annotation.term === "com.sap.vocabularies.UI.v1.SelectionPresentationVariant") {
                selectionVariantPath = config.annotation.SelectionVariant.fullyQualifiedName.split("@")[1];
              } else {
                selectionVariantPath = config.annotationPath;
              } //Provide Selection Variant to hiddenFilters in order to set the SV filters to the table.
              //MDC Table overrides binding Filter and from SAP FE the only method where we are able to add
              //additional filter is 'rebindTable' into Table delegate.
              //To avoid implementing specific LR feature to SAP FE Macro Table, the filter(s) related to the Tab (multi table mode)
              //can be passed to macro table via parameter/context named filters and key hiddenFilters.


              filters.hiddenFilters.paths.push({
                annotationPath: selectionVariantPath
              });
              tableVisualization.control.filters = filters;
              break;

            case VisualizationType.Chart:
              var chartVisualization = presentation.visualizations[index];
              chartVisualization.id = ChartID(config.key || "", "Chart");
              break;

            default:
              break;
          }
        });
      }

      presentation.visualizations.forEach(function (visualizationDefinition) {
        if (visualizationDefinition.type === VisualizationType.Table) {
          tableControlId = visualizationDefinition.annotation.id;
        } else if (visualizationDefinition.type === VisualizationType.Chart) {
          chartControlId = visualizationDefinition.id;
        }
      });
      return {
        presentation: presentation,
        tableControlId: tableControlId,
        chartControlId: chartControlId,
        title: title,
        selectionVariantPath: selectionVariantPath
      };
    } else {
      config = config;
      var _title = config.label,
          fragment = config.template,
          type = config.type,
          customTabId = CustomTabID(config.key || "");
      return {
        title: _title,
        fragment: fragment,
        type: type,
        customTabId: customTabId
      };
    }
  };

  var getViews = function (converterContext, settingsViews) {
    var viewConverterConfigs = [];

    if (settingsViews) {
      settingsViews.paths.forEach(function (path) {
        if (converterContext.getManifestWrapper().hasMultipleVisualizations(path)) {
          if (settingsViews.paths.length > 1) {
            throw new Error("ALP flavor cannot have multiple views");
          } else {
            path = path;
            viewConverterConfigs.push({
              converterContext: converterContext,
              primary: path.primary,
              secondary: path.secondary,
              defaultPath: path.defaultPath
            });
          }
        } else if (path.template) {
          path = path;
          viewConverterConfigs.push({
            key: path.key,
            label: path.label,
            template: path.template,
            type: "Custom"
          });
        } else {
          path = path;
          var manifestWrapper = converterContext.getManifestWrapper(),
              viewConverterContext = converterContext.getConverterContextFor(path.contextPath || path.entitySet && "/" + path.entitySet || converterContext.getContextPath()),
              entityType = viewConverterContext.getEntityType();

          if (entityType && viewConverterContext) {
            var annotationPath = manifestWrapper.getDefaultTemplateAnnotationPath();
            var annotation;
            var resolvedTarget = viewConverterContext.getEntityTypeAnnotation(path.annotationPath);
            var targetAnnotation = resolvedTarget.annotation;
            var resolvedTargetconverterContext = resolvedTarget.converterContext;

            if (targetAnnotation) {
              if (targetAnnotation.term === "com.sap.vocabularies.UI.v1.SelectionVariant") {
                if (annotationPath) {
                  annotation = getSelectionPresentationVariant(viewConverterContext.getEntityType(), annotationPath, resolvedTargetconverterContext);
                } else {
                  annotation = getDefaultLineItem(viewConverterContext.getEntityType());
                }
              } else {
                annotation = targetAnnotation;
              }

              viewConverterConfigs.push({
                converterContext: viewConverterContext,
                annotation: annotation,
                annotationPath: path.annotationPath,
                keepPreviousPresonalization: path.keepPreviousPresonalization,
                key: path.key
              });
            }
          } else {// TODO Diagnostics message
          }
        }
      });
    } else {
      var entityType = converterContext.getEntityType();

      if (converterContext.getTemplateType() === TemplateType.AnalyticalListPage) {
        viewConverterConfigs = getAlpViewConfig(converterContext, viewConverterConfigs);
      } else {
        viewConverterConfigs.push({
          annotation: getCompliantVisualizationAnnotation(entityType, converterContext, false),
          converterContext: converterContext
        });
      }
    }

    return viewConverterConfigs.map(function (viewConverterConfig) {
      return getView(viewConverterConfig);
    });
  };

  function getAlpViewConfig(converterContext, viewConfigs) {
    var entityType = converterContext.getEntityType();
    var annotation = getCompliantVisualizationAnnotation(entityType, converterContext, true);
    var chart, table;

    if (annotation) {
      viewConfigs.push({
        annotation: annotation,
        converterContext: converterContext
      });
    } else {
      chart = getDefaultChart(entityType);
      table = getDefaultLineItem(entityType);

      if (chart && table) {
        var primary = [{
          annotationPath: chart.term
        }];
        var secondary = [{
          annotationPath: table.term
        }];
        viewConfigs.push({
          converterContext: converterContext,
          primary: primary,
          secondary: secondary,
          defaultPath: "both"
        });
      }
    }

    return viewConfigs;
  }

  var getHeaderActions = function (converterContext) {
    var manifestWrapper = converterContext.getManifestWrapper();
    return insertCustomElements([], getActionsFromManifest(manifestWrapper.getHeaderActions(), converterContext));
  };

  _exports.getHeaderActions = getHeaderActions;

  var checkChartFilterBarId = function (views, filterBarId) {
    views.forEach(function (view) {
      if (!view.type) {
        var presentation = view.presentation;
        presentation.visualizations.forEach(function (visualizationDefinition) {
          if (visualizationDefinition.type === VisualizationType.Chart && visualizationDefinition.filterId !== filterBarId) {
            visualizationDefinition.filterId = filterBarId;
          }
        });
      }
    });
  };
  /**
   * Creates the ListReportDefinition for multiple entity sets (multiple table mode).
   *
   * @param converterContext The converter context
   * @returns {ListReportDefinition} The list report definition based on annotation + manifest
   */


  _exports.checkChartFilterBarId = checkChartFilterBarId;

  var convertPage = function (converterContext) {
    var entityType = converterContext.getEntityType();
    var sContextPath = converterContext.getContextPath();

    if (!sContextPath) {
      // If we don't have an entitySet at this point we have an issue I'd say
      throw new Error("An EntitySet is required to be able to display a ListReport, please adjust your `entitySet` property to point to one.");
    }

    var manifestWrapper = converterContext.getManifestWrapper();
    var viewsDefinition = manifestWrapper.getViewConfiguration();
    var hasMultipleEntitySets = manifestWrapper.hasMultipleEntitySets();
    var views = getViews(converterContext, viewsDefinition);
    var showTabCounts = viewsDefinition ? (viewsDefinition === null || viewsDefinition === void 0 ? void 0 : viewsDefinition.showCounts) || hasMultipleEntitySets : undefined; // with multi EntitySets, tab counts are displayed by default

    var lrTableVisualizations = getTableVisualizations(views);
    var lrChartVisualizations = getChartVisualizations(views);
    var showPinnableToggle = lrTableVisualizations.some(function (table) {
      return table.control.type === "ResponsiveTable";
    });
    var singleTableId = "";
    var singleChartId = "";
    var filterBarId = FilterBarID(sContextPath);
    var filterVariantManagementID = FilterVariantManagementID(filterBarId);
    var targetControlIds = [filterBarId].concat(lrTableVisualizations.map(function (visualization) {
      return visualization.annotation.id;
    }));
    targetControlIds = targetControlIds.concat(lrChartVisualizations.map(function (visualization) {
      return visualization.id;
    }));
    var fbConfig = manifestWrapper.getFilterConfiguration();
    var filterInitialLayout = (fbConfig === null || fbConfig === void 0 ? void 0 : fbConfig.initialLayout) !== undefined ? fbConfig === null || fbConfig === void 0 ? void 0 : fbConfig.initialLayout.toLowerCase() : "compact";
    var filterLayout = (fbConfig === null || fbConfig === void 0 ? void 0 : fbConfig.layout) !== undefined ? fbConfig === null || fbConfig === void 0 ? void 0 : fbConfig.layout.toLowerCase() : "compact";
    var useSemanticDateRange = fbConfig.useSemanticDateRange !== undefined ? fbConfig.useSemanticDateRange : true;
    var oConfig = getContentAreaId(converterContext, views);

    if (oConfig) {
      singleChartId = oConfig.chartId;
      singleTableId = oConfig.tableId;
    }

    var selectionFields = getSelectionFields(converterContext, lrTableVisualizations);
    var hideBasicSearch = getFilterBarhideBasicSearch(lrTableVisualizations, converterContext);
    var selectionVariant = getSelectionVariant(entityType, converterContext);
    var defaultSemanticDates = useSemanticDateRange ? getDefaultSemanticDates(getManifestFilterFields(entityType, converterContext)) : {}; // Sort header actions according to position attributes in manifest

    var headerActions = getHeaderActions(converterContext);
    var hasMultiVisualizations = manifestWrapper.hasMultipleVisualizations() || converterContext.getTemplateType() === TemplateType.AnalyticalListPage;

    if (hasMultipleEntitySets) {
      checkChartFilterBarId(views, filterBarId);
    }

    return {
      mainEntitySet: sContextPath,
      mainEntityType: sContextPath + "/",
      singleTableId: singleTableId,
      singleChartId: singleChartId,
      showTabCounts: showTabCounts,
      headerActions: headerActions,
      showPinnableToggle: showPinnableToggle,
      filterBar: {
        selectionFields: selectionFields,
        hideBasicSearch: hideBasicSearch
      },
      views: views,
      filterBarId: filterBarId,
      filterConditions: {
        selectionVariant: selectionVariant,
        defaultSemanticDates: defaultSemanticDates
      },
      variantManagement: {
        id: filterVariantManagementID,
        targetControlIds: targetControlIds.join(",")
      },
      isMultiEntitySets: hasMultipleEntitySets,
      hasMultiVisualizations: hasMultiVisualizations,
      useSemanticDateRange: useSemanticDateRange,
      filterInitialLayout: filterInitialLayout,
      filterLayout: filterLayout,
      kpiDefinitions: getKPIDefinitions(converterContext)
    };
  };

  _exports.convertPage = convertPage;

  function getContentAreaId(converterContext, views) {
    var singleTableId = "",
        singleChartId = "";

    if (converterContext.getManifestWrapper().hasMultipleVisualizations() || converterContext.getTemplateType() === TemplateType.AnalyticalListPage) {
      var _iterator2 = _createForOfIteratorHelper(views),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var view = _step2.value;
          view = view;

          if (view.chartControlId && view.tableControlId) {
            singleChartId = view.chartControlId;
            singleTableId = view.tableControlId;
            break;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    } else {
      var _iterator3 = _createForOfIteratorHelper(views),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _view2 = _step3.value;
          _view2 = _view2;

          if (!singleTableId && _view2.tableControlId) {
            singleTableId = _view2.tableControlId || "";
          }

          if (!singleChartId && _view2.chartControlId) {
            singleChartId = _view2.chartControlId || "";
          }

          if (singleChartId && singleTableId) {
            break;
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }

    if (singleTableId || singleChartId) {
      return {
        chartId: singleChartId,
        tableId: singleTableId
      };
    }

    return undefined;
  }

  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxpc3RSZXBvcnRDb252ZXJ0ZXIudHMiXSwibmFtZXMiOlsiZ2V0VGFibGVWaXN1YWxpemF0aW9ucyIsInZpZXdzIiwidGFibGVzIiwiZm9yRWFjaCIsInZpZXciLCJ0eXBlIiwidmlzdWFsaXphdGlvbnMiLCJzZWNvbmRhcnlWaXN1YWxpemF0aW9uIiwicHJlc2VudGF0aW9uIiwidmlzdWFsaXphdGlvbiIsIlZpc3VhbGl6YXRpb25UeXBlIiwiVGFibGUiLCJwdXNoIiwiZ2V0Q2hhcnRWaXN1YWxpemF0aW9ucyIsImNoYXJ0cyIsInByaW1hcnlWaXN1YWxpemF0aW9uIiwiQ2hhcnQiLCJnZXREZWZhdWx0U2VtYW50aWNEYXRlcyIsImZpbHRlckZpZWxkcyIsImRlZmF1bHRTZW1hbnRpY0RhdGVzIiwiZmlsdGVyRmllbGQiLCJzZXR0aW5ncyIsImRlZmF1bHRWYWx1ZXMiLCJsZW5ndGgiLCJnZXRDb21wbGlhbnRWaXN1YWxpemF0aW9uQW5ub3RhdGlvbiIsImVudGl0eVR5cGUiLCJjb252ZXJ0ZXJDb250ZXh0IiwiYklzQUxQIiwiYW5ub3RhdGlvblBhdGgiLCJnZXRNYW5pZmVzdFdyYXBwZXIiLCJnZXREZWZhdWx0VGVtcGxhdGVBbm5vdGF0aW9uUGF0aCIsInNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnQiLCJnZXRTZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50IiwicHJlc2VudGF0aW9uVmFyaWFudCIsIlByZXNlbnRhdGlvblZhcmlhbnQiLCJFcnJvciIsImJQVkNvbXBsYWludCIsImlzUHJlc2VudGF0aW9uQ29tcGxpYW50IiwidW5kZWZpbmVkIiwiaXNTZWxlY3Rpb25QcmVzZW50YXRpb25Db21wbGlhbnQiLCJnZXREZWZhdWx0UHJlc2VudGF0aW9uVmFyaWFudCIsImRlZmF1bHRMaW5lSXRlbSIsImdldERlZmF1bHRMaW5lSXRlbSIsImdldFZpZXciLCJ2aWV3Q29udmVydGVyQ29uZmlndXJhdGlvbiIsImNvbmZpZyIsImdldERhdGFWaXN1YWxpemF0aW9uQ29uZmlndXJhdGlvbiIsImFubm90YXRpb24iLCJnZXRSZWxhdGl2ZUFubm90YXRpb25QYXRoIiwiZnVsbHlRdWFsaWZpZWROYW1lIiwiZ2V0RW50aXR5VHlwZSIsInRhYmxlQ29udHJvbElkIiwiY2hhcnRDb250cm9sSWQiLCJ0aXRsZSIsInNlbGVjdGlvblZhcmlhbnRQYXRoIiwiaXNNdWx0aXBsZVZpZXdDb25maWd1cmF0aW9uIiwia2V5IiwiY3JlYXRlVmlzdWFsaXphdGlvbiIsImlzUHJpbWFyeSIsImRlZmF1bHRWaXN1YWxpemF0aW9uIiwicHJlc2VudGF0aW9uQ3JlYXRlZCIsIk9iamVjdCIsImFzc2lnbiIsImdldFByZXNlbnRhdGlvbiIsIml0ZW0iLCJyZXNvbHZlZFRhcmdldCIsImdldEVudGl0eVR5cGVBbm5vdGF0aW9uIiwidGFyZ2V0QW5ub3RhdGlvbiIsImNyZWF0ZUFscFZpZXciLCJwcmVzZW50YXRpb25zIiwiZGVmYXVsdFBhdGgiLCJpZCIsImdldFRlbXBsYXRlVHlwZSIsIlRlbXBsYXRlVHlwZSIsIkFuYWx5dGljYWxMaXN0UGFnZSIsImhhc011bHRpcGxlVmlzdWFsaXphdGlvbnMiLCJwcmltYXJ5Iiwic2Vjb25kYXJ5Iiwidmlld0Fubm90YXRpb24iLCJjb21waWxlQmluZGluZyIsImFubm90YXRpb25FeHByZXNzaW9uIiwiVGV4dCIsInZpc3VhbGl6YXRpb25EZWZpbml0aW9uIiwiaW5kZXgiLCJ0YWJsZVZpc3VhbGl6YXRpb24iLCJmaWx0ZXJzIiwiY29udHJvbCIsImhpZGRlbkZpbHRlcnMiLCJwYXRocyIsImtlZXBQcmV2aW91c1ByZXNvbmFsaXphdGlvbiIsIlRhYmxlSUQiLCJ0ZXJtIiwiU2VsZWN0aW9uVmFyaWFudCIsInNwbGl0IiwiY2hhcnRWaXN1YWxpemF0aW9uIiwiQ2hhcnRJRCIsImxhYmVsIiwiZnJhZ21lbnQiLCJ0ZW1wbGF0ZSIsImN1c3RvbVRhYklkIiwiQ3VzdG9tVGFiSUQiLCJnZXRWaWV3cyIsInNldHRpbmdzVmlld3MiLCJ2aWV3Q29udmVydGVyQ29uZmlncyIsInBhdGgiLCJtYW5pZmVzdFdyYXBwZXIiLCJ2aWV3Q29udmVydGVyQ29udGV4dCIsImdldENvbnZlcnRlckNvbnRleHRGb3IiLCJjb250ZXh0UGF0aCIsImVudGl0eVNldCIsImdldENvbnRleHRQYXRoIiwicmVzb2x2ZWRUYXJnZXRjb252ZXJ0ZXJDb250ZXh0IiwiZ2V0QWxwVmlld0NvbmZpZyIsIm1hcCIsInZpZXdDb252ZXJ0ZXJDb25maWciLCJ2aWV3Q29uZmlncyIsImNoYXJ0IiwidGFibGUiLCJnZXREZWZhdWx0Q2hhcnQiLCJnZXRIZWFkZXJBY3Rpb25zIiwiaW5zZXJ0Q3VzdG9tRWxlbWVudHMiLCJnZXRBY3Rpb25zRnJvbU1hbmlmZXN0IiwiY2hlY2tDaGFydEZpbHRlckJhcklkIiwiZmlsdGVyQmFySWQiLCJmaWx0ZXJJZCIsImNvbnZlcnRQYWdlIiwic0NvbnRleHRQYXRoIiwidmlld3NEZWZpbml0aW9uIiwiZ2V0Vmlld0NvbmZpZ3VyYXRpb24iLCJoYXNNdWx0aXBsZUVudGl0eVNldHMiLCJzaG93VGFiQ291bnRzIiwic2hvd0NvdW50cyIsImxyVGFibGVWaXN1YWxpemF0aW9ucyIsImxyQ2hhcnRWaXN1YWxpemF0aW9ucyIsInNob3dQaW5uYWJsZVRvZ2dsZSIsInNvbWUiLCJzaW5nbGVUYWJsZUlkIiwic2luZ2xlQ2hhcnRJZCIsIkZpbHRlckJhcklEIiwiZmlsdGVyVmFyaWFudE1hbmFnZW1lbnRJRCIsIkZpbHRlclZhcmlhbnRNYW5hZ2VtZW50SUQiLCJ0YXJnZXRDb250cm9sSWRzIiwiY29uY2F0IiwiZmJDb25maWciLCJnZXRGaWx0ZXJDb25maWd1cmF0aW9uIiwiZmlsdGVySW5pdGlhbExheW91dCIsImluaXRpYWxMYXlvdXQiLCJ0b0xvd2VyQ2FzZSIsImZpbHRlckxheW91dCIsImxheW91dCIsInVzZVNlbWFudGljRGF0ZVJhbmdlIiwib0NvbmZpZyIsImdldENvbnRlbnRBcmVhSWQiLCJjaGFydElkIiwidGFibGVJZCIsInNlbGVjdGlvbkZpZWxkcyIsImdldFNlbGVjdGlvbkZpZWxkcyIsImhpZGVCYXNpY1NlYXJjaCIsImdldEZpbHRlckJhcmhpZGVCYXNpY1NlYXJjaCIsInNlbGVjdGlvblZhcmlhbnQiLCJnZXRTZWxlY3Rpb25WYXJpYW50IiwiZ2V0TWFuaWZlc3RGaWx0ZXJGaWVsZHMiLCJoZWFkZXJBY3Rpb25zIiwiaGFzTXVsdGlWaXN1YWxpemF0aW9ucyIsIm1haW5FbnRpdHlTZXQiLCJtYWluRW50aXR5VHlwZSIsImZpbHRlckJhciIsImZpbHRlckNvbmRpdGlvbnMiLCJ2YXJpYW50TWFuYWdlbWVudCIsImpvaW4iLCJpc011bHRpRW50aXR5U2V0cyIsImtwaURlZmluaXRpb25zIiwiZ2V0S1BJRGVmaW5pdGlvbnMiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFTQSxzQkFBVCxDQUFnQ0MsS0FBaEMsRUFBeUY7QUFDeEYsUUFBTUMsTUFBNEIsR0FBRyxFQUFyQztBQUNBRCxJQUFBQSxLQUFLLENBQUNFLE9BQU4sQ0FBYyxVQUFTQyxJQUFULEVBQWU7QUFDNUIsVUFBSSxDQUFFQSxJQUFELENBQStCQyxJQUFwQyxFQUEwQztBQUN6QyxZQUFNQyxjQUFjLEdBQUlGLElBQUQsQ0FBaUNHLHNCQUFqQyxHQUNuQkgsSUFBRCxDQUFpQ0csc0JBQWpDLENBQXdERCxjQURwQyxHQUVuQkYsSUFBRCxDQUErQkksWUFBL0IsQ0FBNENGLGNBRi9DO0FBSUFBLFFBQUFBLGNBQWMsQ0FBQ0gsT0FBZixDQUF1QixVQUFTTSxhQUFULEVBQXdCO0FBQzlDLGNBQUlBLGFBQWEsQ0FBQ0osSUFBZCxLQUF1QkssaUJBQWlCLENBQUNDLEtBQTdDLEVBQW9EO0FBQ25EVCxZQUFBQSxNQUFNLENBQUNVLElBQVAsQ0FBWUgsYUFBWjtBQUNBO0FBQ0QsU0FKRDtBQUtBO0FBQ0QsS0FaRDtBQWFBLFdBQU9QLE1BQVA7QUFDQTs7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Y0FBckI7QUFDQW9GLFlBQUFBLGFBQWEsR0FBR3BJLElBQUksQ0FBQytDLGNBQXJCO0FBQ0E7QUFDQTtBQUNEO0FBUkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVNELEtBWkQsTUFZTztBQUFBLGtEQUNXbEQsS0FEWDtBQUFBOztBQUFBO0FBQ04sK0RBQXdCO0FBQUEsY0FBZkcsTUFBZTtBQUN2QkEsVUFBQUEsTUFBSSxHQUFHQSxNQUFQOztBQUNBLGNBQUksQ0FBQ29JLGFBQUQsSUFBbUJwSSxNQUFELENBQW9DK0MsY0FBMUQsRUFBMEU7QUFDekVxRixZQUFBQSxhQUFhLEdBQUlwSSxNQUFELENBQW9DK0MsY0FBcEMsSUFBc0QsRUFBdEU7QUFDQTs7QUFDRCxjQUFJLENBQUNzRixhQUFELElBQW1CckksTUFBRCxDQUFvQ2dELGNBQTFELEVBQTBFO0FBQ3pFcUYsWUFBQUEsYUFBYSxHQUFJckksTUFBRCxDQUFvQ2dELGNBQXBDLElBQXNELEVBQXRFO0FBQ0E7O0FBQ0QsY0FBSXFGLGFBQWEsSUFBSUQsYUFBckIsRUFBb0M7QUFDbkM7QUFDQTtBQUNEO0FBWks7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWFOOztBQUNELFFBQUlBLGFBQWEsSUFBSUMsYUFBckIsRUFBb0M7QUFDbkMsYUFBTztBQUNOZ0IsUUFBQUEsT0FBTyxFQUFFaEIsYUFESDtBQUVOaUIsUUFBQUEsT0FBTyxFQUFFbEI7QUFGSCxPQUFQO0FBSUE7O0FBQ0QsV0FBT2xHLFNBQVA7QUFDQSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0TXVsdGlwbGVWaWV3c0NvbmZpZ3VyYXRpb24sXG5cdFZpZXdQYXRoQ29uZmlndXJhdGlvbixcblx0U2luZ2xlVmlld1BhdGhDb25maWd1cmF0aW9uLFxuXHRWaXN1YWxpemF0aW9uVHlwZSxcblx0VGVtcGxhdGVUeXBlLFxuXHRDb21iaW5lZFZpZXdQYXRoQ29uZmlndXJhdGlvbixcblx0Q3VzdG9tVmlld1RlbXBsYXRlQ29uZmlndXJhdGlvblxufSBmcm9tIFwiLi4vTWFuaWZlc3RTZXR0aW5nc1wiO1xuaW1wb3J0IHsgRW50aXR5VHlwZSB9IGZyb20gXCJAc2FwLXV4L2Fubm90YXRpb24tY29udmVydGVyXCI7XG5pbXBvcnQge1xuXHREYXRhVmlzdWFsaXphdGlvbkFubm90YXRpb25zLFxuXHREYXRhVmlzdWFsaXphdGlvbkRlZmluaXRpb24sXG5cdGdldERhdGFWaXN1YWxpemF0aW9uQ29uZmlndXJhdGlvbixcblx0Z2V0RGVmYXVsdENoYXJ0LFxuXHRnZXREZWZhdWx0TGluZUl0ZW0sXG5cdGdldERlZmF1bHRQcmVzZW50YXRpb25WYXJpYW50LFxuXHRnZXRTZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50LFxuXHRpc1ByZXNlbnRhdGlvbkNvbXBsaWFudCxcblx0Z2V0U2VsZWN0aW9uVmFyaWFudCxcblx0aXNTZWxlY3Rpb25QcmVzZW50YXRpb25Db21wbGlhbnRcbn0gZnJvbSBcIi4uL2NvbnRyb2xzL0NvbW1vbi9EYXRhVmlzdWFsaXphdGlvblwiO1xuaW1wb3J0IHtcblx0TGluZUl0ZW0sXG5cdFByZXNlbnRhdGlvblZhcmlhbnRUeXBlVHlwZXMsXG5cdFNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnRUeXBlVHlwZXMsXG5cdFNlbGVjdGlvblZhcmlhbnRUeXBlVHlwZXNcbn0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL2Rpc3QvZ2VuZXJhdGVkL1VJXCI7XG5pbXBvcnQgeyBVSUFubm90YXRpb25UZXJtcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHsgQ3VzdG9tVGFiSUQsIEZpbHRlckJhcklELCBGaWx0ZXJWYXJpYW50TWFuYWdlbWVudElELCBUYWJsZUlELCBDaGFydElEIH0gZnJvbSBcIi4uL2hlbHBlcnMvSURcIjtcbmltcG9ydCB7IFRhYmxlVmlzdWFsaXphdGlvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9UYWJsZVwiO1xuaW1wb3J0IHsgQ2hhcnRWaXN1YWxpemF0aW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvY29udHJvbHMvQ29tbW9uL0NoYXJ0XCI7XG5pbXBvcnQgeyBCYXNlQWN0aW9uLCBnZXRBY3Rpb25zRnJvbU1hbmlmZXN0IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvY29udHJvbHMvQ29tbW9uL0FjdGlvblwiO1xuaW1wb3J0IHsgQ29uZmlndXJhYmxlT2JqZWN0LCBpbnNlcnRDdXN0b21FbGVtZW50cyB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvQ29uZmlndXJhYmxlT2JqZWN0XCI7XG5pbXBvcnQgeyBhbm5vdGF0aW9uRXhwcmVzc2lvbiwgY29tcGlsZUJpbmRpbmcgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nRXhwcmVzc2lvblwiO1xuaW1wb3J0IENvbnZlcnRlckNvbnRleHQgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvQ29udmVydGVyQ29udGV4dFwiO1xuaW1wb3J0IHsgS1BJRGVmaW5pdGlvbiwgZ2V0S1BJRGVmaW5pdGlvbnMgfSBmcm9tIFwiLi4vY29udHJvbHMvQ29tbW9uL0tQSVwiO1xuaW1wb3J0IHtcblx0Z2V0U2VsZWN0aW9uRmllbGRzLFxuXHRnZXRNYW5pZmVzdEZpbHRlckZpZWxkcyxcblx0Z2V0RmlsdGVyQmFyaGlkZUJhc2ljU2VhcmNoLFxuXHRGaWx0ZXJGaWVsZCxcblx0Q3VzdG9tRWxlbWVudEZpbHRlckZpZWxkXG59IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0xpc3RSZXBvcnQvRmlsdGVyQmFyXCI7XG5cbnR5cGUgVmlld0Fubm90YXRpb25zVHlwZVR5cGVzID0gU2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudFR5cGVUeXBlcyB8IFNlbGVjdGlvblZhcmlhbnRUeXBlVHlwZXM7XG50eXBlIFZhcmlhbnRNYW5hZ2VtZW50RGVmaW5pdGlvbiA9IHtcblx0aWQ6IHN0cmluZztcblx0dGFyZ2V0Q29udHJvbElkczogc3RyaW5nO1xufTtcblxudHlwZSBNdWx0aXBsZVZpZXdDb25maWd1cmF0aW9uID0gVmlld1BhdGhDb25maWd1cmF0aW9uICYge1xuXHRhbm5vdGF0aW9uPzogRGF0YVZpc3VhbGl6YXRpb25Bbm5vdGF0aW9ucztcbn07XG5cbnR5cGUgU2luZ2xlVmlld0NvbmZpZ3VyYXRpb24gPSB7XG5cdGFubm90YXRpb24/OiBEYXRhVmlzdWFsaXphdGlvbkFubm90YXRpb25zO1xufTtcblxudHlwZSBDdXN0b21WaWV3Q29uZmlndXJhdGlvbiA9IEN1c3RvbVZpZXdUZW1wbGF0ZUNvbmZpZ3VyYXRpb24gJiB7XG5cdHR5cGU6IHN0cmluZztcbn07XG5cbnR5cGUgVmlld0NvbmZpZ3VyYXRpb24gPSBNdWx0aXBsZVZpZXdDb25maWd1cmF0aW9uIHwgU2luZ2xlVmlld0NvbmZpZ3VyYXRpb24gfCBDdXN0b21WaWV3Q29uZmlndXJhdGlvbjtcbnR5cGUgVmlld0Fubm90YXRpb25Db25maWd1cmF0aW9uID0gTXVsdGlwbGVWaWV3Q29uZmlndXJhdGlvbiB8IFNpbmdsZVZpZXdDb25maWd1cmF0aW9uO1xuXG50eXBlIFZpZXdDb252ZXJ0ZXJTZXR0aW5ncyA9IFZpZXdDb25maWd1cmF0aW9uICYge1xuXHRjb252ZXJ0ZXJDb250ZXh0PzogQ29udmVydGVyQ29udGV4dDtcbn07XG5cbnR5cGUgRGVmYXVsdFNlbWFudGljRGF0ZSA9IENvbmZpZ3VyYWJsZU9iamVjdCAmIHtcblx0b3BlcmF0b3I6IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIExpc3RSZXBvcnREZWZpbml0aW9uID0ge1xuXHRtYWluRW50aXR5U2V0OiBzdHJpbmc7XG5cdG1haW5FbnRpdHlUeXBlOiBzdHJpbmc7IC8vIGVudGl0eVR5cGU+IGF0IHRoZSBzdGFydCBvZiBMUiB0ZW1wbGF0aW5nXG5cdHNpbmdsZVRhYmxlSWQ/OiBzdHJpbmc7IC8vIG9ubHkgd2l0aCBzaW5nbGUgVGFibGUgbW9kZVxuXHRzaW5nbGVDaGFydElkPzogc3RyaW5nOyAvLyBvbmx5IHdpdGggc2luZ2xlIFRhYmxlIG1vZGVcblx0c2hvd1RhYkNvdW50cz86IGJvb2xlYW47IC8vIG9ubHkgd2l0aCBtdWx0aSBUYWJsZSBtb2RlXG5cdGhlYWRlckFjdGlvbnM6IEJhc2VBY3Rpb25bXTtcblx0c2hvd1Bpbm5hYmxlVG9nZ2xlPzogYm9vbGVhbjtcblx0ZmlsdGVyQmFyOiB7XG5cdFx0c2VsZWN0aW9uRmllbGRzOiBGaWx0ZXJGaWVsZFtdO1xuXHRcdGhpZGVCYXNpY1NlYXJjaDogYm9vbGVhbjtcblx0fTtcblx0dmlld3M6IExpc3RSZXBvcnRWaWV3RGVmaW5pdGlvbltdO1xuXHRmaWx0ZXJDb25kaXRpb25zOiBvYmplY3Q7XG5cdGlzTXVsdGlFbnRpdHlTZXRzOiBib29sZWFuO1xuXHRmaWx0ZXJCYXJJZDogc3RyaW5nO1xuXHR2YXJpYW50TWFuYWdlbWVudDogVmFyaWFudE1hbmFnZW1lbnREZWZpbml0aW9uO1xuXHRoYXNNdWx0aVZpc3VhbGl6YXRpb25zOiBib29sZWFuO1xuXHR1c2VTZW1hbnRpY0RhdGVSYW5nZT86IGJvb2xlYW47XG5cdGZpbHRlckluaXRpYWxMYXlvdXQ/OiBzdHJpbmc7XG5cdGZpbHRlckxheW91dD86IHN0cmluZztcblx0a3BpRGVmaW5pdGlvbnM6IEtQSURlZmluaXRpb25bXTtcbn07XG5cbmV4cG9ydCB0eXBlIExpc3RSZXBvcnRWaWV3RGVmaW5pdGlvbiA9IFNpbmdsZVZpZXdEZWZpbml0aW9uIHwgQ3VzdG9tVmlld0RlZmluaXRpb24gfCBDb21iaW5lZFZpZXdEZWZpbml0aW9uO1xuXG5leHBvcnQgdHlwZSBDb21iaW5lZFZpZXdEZWZpbml0aW9uID0ge1xuXHRzZWxlY3Rpb25WYXJpYW50UGF0aD86IHN0cmluZzsgLy8gb25seSB3aXRoIG9uIG11bHRpIFRhYmxlIG1vZGVcblx0dGl0bGU/OiBzdHJpbmc7IC8vIG9ubHkgd2l0aCBtdWx0aSBUYWJsZSBtb2RlXG5cdHByaW1hcnlWaXN1YWxpemF0aW9uOiBEYXRhVmlzdWFsaXphdGlvbkRlZmluaXRpb247XG5cdHNlY29uZGFyeVZpc3VhbGl6YXRpb246IERhdGFWaXN1YWxpemF0aW9uRGVmaW5pdGlvbjtcblx0dGFibGVDb250cm9sSWQ6IHN0cmluZztcblx0Y2hhcnRDb250cm9sSWQ6IHN0cmluZztcblx0ZGVmYXVsdFBhdGg/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBDdXN0b21WaWV3RGVmaW5pdGlvbiA9IHtcblx0dGl0bGU/OiBzdHJpbmc7IC8vIG9ubHkgd2l0aCBtdWx0aSBUYWJsZSBtb2RlXG5cdGZyYWdtZW50OiBzdHJpbmc7XG5cdHR5cGU6IHN0cmluZztcblx0Y3VzdG9tVGFiSWQ6IHN0cmluZztcbn07XG5leHBvcnQgdHlwZSBTaW5nbGVWaWV3RGVmaW5pdGlvbiA9IFNpbmdsZVRhYmxlVmlld0RlZmluaXRpb24gfCBTaW5nbGVDaGFydFZpZXdEZWZpbml0aW9uO1xuXG5leHBvcnQgdHlwZSBCYXNlU2luZ2xlVmlld0RlZmluaXRpb24gPSB7XG5cdHNlbGVjdGlvblZhcmlhbnRQYXRoPzogc3RyaW5nOyAvLyBvbmx5IHdpdGggb24gbXVsdGkgVGFibGUgbW9kZVxuXHR0aXRsZT86IHN0cmluZzsgLy8gb25seSB3aXRoIG11bHRpIFRhYmxlIG1vZGVcblx0cHJlc2VudGF0aW9uOiBEYXRhVmlzdWFsaXphdGlvbkRlZmluaXRpb247XG59O1xuXG5leHBvcnQgdHlwZSBTaW5nbGVUYWJsZVZpZXdEZWZpbml0aW9uID0gQmFzZVNpbmdsZVZpZXdEZWZpbml0aW9uICYge1xuXHR0YWJsZUNvbnRyb2xJZD86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIFNpbmdsZUNoYXJ0Vmlld0RlZmluaXRpb24gPSBCYXNlU2luZ2xlVmlld0RlZmluaXRpb24gJiB7XG5cdGNoYXJ0Q29udHJvbElkPzogc3RyaW5nO1xufTtcblxudHlwZSBDb250ZW50QXJlYUlEID0ge1xuXHRjaGFydElkOiBzdHJpbmc7XG5cdHRhYmxlSWQ6IHN0cmluZztcbn07XG5cbi8qKlxuICogUmV0cmlldmVzIGFsbCBsaXN0IHJlcG9ydCB0YWJsZXMuXG4gKiBAcGFyYW0ge0xpc3RSZXBvcnRWaWV3RGVmaW5pdGlvbltdfSB2aWV3cyBUaGUgbGlzdCByZXBvcnQgdmlld3MgY29uZmlndXJlZCBpbiB0aGUgbWFuaWZlc3RcbiAqIEByZXR1cm5zIHtUYWJsZVZpc3VhbGl6YXRpb25bXX0gVGhlIGxpc3QgcmVwb3J0IHRhYmxlXG4gKi9cbmZ1bmN0aW9uIGdldFRhYmxlVmlzdWFsaXphdGlvbnModmlld3M6IExpc3RSZXBvcnRWaWV3RGVmaW5pdGlvbltdKTogVGFibGVWaXN1YWxpemF0aW9uW10ge1xuXHRjb25zdCB0YWJsZXM6IFRhYmxlVmlzdWFsaXphdGlvbltdID0gW107XG5cdHZpZXdzLmZvckVhY2goZnVuY3Rpb24odmlldykge1xuXHRcdGlmICghKHZpZXcgYXMgQ3VzdG9tVmlld0RlZmluaXRpb24pLnR5cGUpIHtcblx0XHRcdGNvbnN0IHZpc3VhbGl6YXRpb25zID0gKHZpZXcgYXMgQ29tYmluZWRWaWV3RGVmaW5pdGlvbikuc2Vjb25kYXJ5VmlzdWFsaXphdGlvblxuXHRcdFx0XHQ/ICh2aWV3IGFzIENvbWJpbmVkVmlld0RlZmluaXRpb24pLnNlY29uZGFyeVZpc3VhbGl6YXRpb24udmlzdWFsaXphdGlvbnNcblx0XHRcdFx0OiAodmlldyBhcyBTaW5nbGVWaWV3RGVmaW5pdGlvbikucHJlc2VudGF0aW9uLnZpc3VhbGl6YXRpb25zO1xuXG5cdFx0XHR2aXN1YWxpemF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHZpc3VhbGl6YXRpb24pIHtcblx0XHRcdFx0aWYgKHZpc3VhbGl6YXRpb24udHlwZSA9PT0gVmlzdWFsaXphdGlvblR5cGUuVGFibGUpIHtcblx0XHRcdFx0XHR0YWJsZXMucHVzaCh2aXN1YWxpemF0aW9uKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIHRhYmxlcztcbn1cblxuZnVuY3Rpb24gZ2V0Q2hhcnRWaXN1YWxpemF0aW9ucyh2aWV3czogTGlzdFJlcG9ydFZpZXdEZWZpbml0aW9uW10pOiBDaGFydFZpc3VhbGl6YXRpb25bXSB7XG5cdGNvbnN0IGNoYXJ0czogQ2hhcnRWaXN1YWxpemF0aW9uW10gPSBbXTtcblx0dmlld3MuZm9yRWFjaChmdW5jdGlvbih2aWV3KSB7XG5cdFx0aWYgKCEodmlldyBhcyBDdXN0b21WaWV3RGVmaW5pdGlvbikudHlwZSkge1xuXHRcdFx0Y29uc3QgdmlzdWFsaXphdGlvbnMgPSAodmlldyBhcyBDb21iaW5lZFZpZXdEZWZpbml0aW9uKS5wcmltYXJ5VmlzdWFsaXphdGlvblxuXHRcdFx0XHQ/ICh2aWV3IGFzIENvbWJpbmVkVmlld0RlZmluaXRpb24pLnByaW1hcnlWaXN1YWxpemF0aW9uLnZpc3VhbGl6YXRpb25zXG5cdFx0XHRcdDogKHZpZXcgYXMgU2luZ2xlVmlld0RlZmluaXRpb24pLnByZXNlbnRhdGlvbi52aXN1YWxpemF0aW9ucztcblxuXHRcdFx0dmlzdWFsaXphdGlvbnMuZm9yRWFjaChmdW5jdGlvbih2aXN1YWxpemF0aW9uKSB7XG5cdFx0XHRcdGlmICh2aXN1YWxpemF0aW9uLnR5cGUgPT09IFZpc3VhbGl6YXRpb25UeXBlLkNoYXJ0KSB7XG5cdFx0XHRcdFx0Y2hhcnRzLnB1c2godmlzdWFsaXphdGlvbik7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiBjaGFydHM7XG59XG5cbmNvbnN0IGdldERlZmF1bHRTZW1hbnRpY0RhdGVzID0gZnVuY3Rpb24oZmlsdGVyRmllbGRzOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21FbGVtZW50RmlsdGVyRmllbGQ+KTogUmVjb3JkPHN0cmluZywgRGVmYXVsdFNlbWFudGljRGF0ZT4ge1xuXHRjb25zdCBkZWZhdWx0U2VtYW50aWNEYXRlczogYW55ID0ge307XG5cdGZvciAoY29uc3QgZmlsdGVyRmllbGQgaW4gZmlsdGVyRmllbGRzKSB7XG5cdFx0aWYgKGZpbHRlckZpZWxkc1tmaWx0ZXJGaWVsZF0/LnNldHRpbmdzPy5kZWZhdWx0VmFsdWVzPy5sZW5ndGgpIHtcblx0XHRcdGRlZmF1bHRTZW1hbnRpY0RhdGVzW2ZpbHRlckZpZWxkXSA9IGZpbHRlckZpZWxkc1tmaWx0ZXJGaWVsZF0/LnNldHRpbmdzPy5kZWZhdWx0VmFsdWVzO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gZGVmYXVsdFNlbWFudGljRGF0ZXM7XG59O1xuXG4vKipcbiAqIEZpbmQgYSB2aXN1YWxpemF0aW9uIGFubm90YXRpb24gdGhhdCBjYW4gYmUgdXNlZCBmb3IgcmVuZGVyaW5nIHRoZSBsaXN0IHJlcG9ydC5cbiAqXG4gKiBAcGFyYW0ge0VudGl0eVR5cGV9IGVudGl0eVR5cGUgVGhlIGN1cnJlbnQgRW50aXR5VHlwZVxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEBwYXJhbSBiSXNBTFBcbiAqIEByZXR1cm5zIHtMaW5lSXRlbSB8IFByZXNlbnRhdGlvblZhcmlhbnRUeXBlVHlwZXMgfCB1bmRlZmluZWR9IEEgY29tcGxpYW50IGFubm90YXRpb24gZm9yIHJlbmRlcmluZyB0aGUgbGlzdCByZXBvcnRcbiAqL1xuZnVuY3Rpb24gZ2V0Q29tcGxpYW50VmlzdWFsaXphdGlvbkFubm90YXRpb24oXG5cdGVudGl0eVR5cGU6IEVudGl0eVR5cGUsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGJJc0FMUDogQm9vbGVhblxuKTogTGluZUl0ZW0gfCBQcmVzZW50YXRpb25WYXJpYW50VHlwZVR5cGVzIHwgU2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudFR5cGVUeXBlcyB8IHVuZGVmaW5lZCB7XG5cdGNvbnN0IGFubm90YXRpb25QYXRoID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKS5nZXREZWZhdWx0VGVtcGxhdGVBbm5vdGF0aW9uUGF0aCgpO1xuXHRjb25zdCBzZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50ID0gZ2V0U2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudChlbnRpdHlUeXBlLCBhbm5vdGF0aW9uUGF0aCwgY29udmVydGVyQ29udGV4dCk7XG5cdGlmIChhbm5vdGF0aW9uUGF0aCAmJiBzZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50KSB7XG5cdFx0Y29uc3QgcHJlc2VudGF0aW9uVmFyaWFudCA9IHNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnQuUHJlc2VudGF0aW9uVmFyaWFudDtcblx0XHRpZiAoIXByZXNlbnRhdGlvblZhcmlhbnQpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIlByZXNlbnRhdGlvbiBWYXJpYW50IGlzIG5vdCBjb25maWd1cmVkIGluIHRoZSBTUFYgbWVudGlvbmVkIGluIHRoZSBtYW5pZmVzdFwiKTtcblx0XHR9XG5cdFx0Y29uc3QgYlBWQ29tcGxhaW50ID0gaXNQcmVzZW50YXRpb25Db21wbGlhbnQoc2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudC5QcmVzZW50YXRpb25WYXJpYW50KTtcblx0XHRpZiAoIWJQVkNvbXBsYWludCkge1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cdFx0aWYgKGlzU2VsZWN0aW9uUHJlc2VudGF0aW9uQ29tcGxpYW50KHNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnQsIGJJc0FMUCkpIHtcblx0XHRcdHJldHVybiBzZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50O1xuXHRcdH1cblx0fVxuXHRpZiAoc2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudCkge1xuXHRcdGlmIChpc1NlbGVjdGlvblByZXNlbnRhdGlvbkNvbXBsaWFudChzZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50LCBiSXNBTFApKSB7XG5cdFx0XHRyZXR1cm4gc2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudDtcblx0XHR9XG5cdH1cblx0Y29uc3QgcHJlc2VudGF0aW9uVmFyaWFudCA9IGdldERlZmF1bHRQcmVzZW50YXRpb25WYXJpYW50KGVudGl0eVR5cGUpO1xuXHRpZiAocHJlc2VudGF0aW9uVmFyaWFudCkge1xuXHRcdGlmIChpc1ByZXNlbnRhdGlvbkNvbXBsaWFudChwcmVzZW50YXRpb25WYXJpYW50LCBiSXNBTFApKSB7XG5cdFx0XHRyZXR1cm4gcHJlc2VudGF0aW9uVmFyaWFudDtcblx0XHR9XG5cdH1cblx0aWYgKCFiSXNBTFApIHtcblx0XHRjb25zdCBkZWZhdWx0TGluZUl0ZW0gPSBnZXREZWZhdWx0TGluZUl0ZW0oZW50aXR5VHlwZSk7XG5cdFx0aWYgKGRlZmF1bHRMaW5lSXRlbSkge1xuXHRcdFx0cmV0dXJuIGRlZmF1bHRMaW5lSXRlbTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuY29uc3QgZ2V0VmlldyA9IGZ1bmN0aW9uKHZpZXdDb252ZXJ0ZXJDb25maWd1cmF0aW9uOiBWaWV3Q29udmVydGVyU2V0dGluZ3MpOiBMaXN0UmVwb3J0Vmlld0RlZmluaXRpb24ge1xuXHRsZXQgY29uZmlnID0gdmlld0NvbnZlcnRlckNvbmZpZ3VyYXRpb247XG5cdGlmIChjb25maWcuY29udmVydGVyQ29udGV4dCkge1xuXHRcdGxldCBjb252ZXJ0ZXJDb250ZXh0ID0gY29uZmlnLmNvbnZlcnRlckNvbnRleHQ7XG5cdFx0Y29uZmlnID0gY29uZmlnIGFzIFZpZXdBbm5vdGF0aW9uQ29uZmlndXJhdGlvbjtcblx0XHRsZXQgcHJlc2VudGF0aW9uOiBEYXRhVmlzdWFsaXphdGlvbkRlZmluaXRpb24gPSBnZXREYXRhVmlzdWFsaXphdGlvbkNvbmZpZ3VyYXRpb24oXG5cdFx0XHRjb25maWcuYW5ub3RhdGlvblxuXHRcdFx0XHQ/IGNvbnZlcnRlckNvbnRleHQuZ2V0UmVsYXRpdmVBbm5vdGF0aW9uUGF0aChjb25maWcuYW5ub3RhdGlvbi5mdWxseVF1YWxpZmllZE5hbWUsIGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpKVxuXHRcdFx0XHQ6IFwiXCIsXG5cdFx0XHR0cnVlLFxuXHRcdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRcdGNvbmZpZyBhcyBWaWV3UGF0aENvbmZpZ3VyYXRpb25cblx0XHQpO1xuXHRcdGxldCB0YWJsZUNvbnRyb2xJZCA9IFwiXCI7XG5cdFx0bGV0IGNoYXJ0Q29udHJvbElkID0gXCJcIjtcblx0XHRsZXQgdGl0bGU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IFwiXCI7XG5cdFx0bGV0IHNlbGVjdGlvblZhcmlhbnRQYXRoID0gXCJcIjtcblx0XHRjb25zdCBpc011bHRpcGxlVmlld0NvbmZpZ3VyYXRpb24gPSBmdW5jdGlvbihjb25maWc6IFZpZXdDb25maWd1cmF0aW9uKTogY29uZmlnIGlzIE11bHRpcGxlVmlld0NvbmZpZ3VyYXRpb24ge1xuXHRcdFx0cmV0dXJuIChjb25maWcgYXMgTXVsdGlwbGVWaWV3Q29uZmlndXJhdGlvbikua2V5ICE9PSB1bmRlZmluZWQ7XG5cdFx0fTtcblx0XHRjb25zdCBjcmVhdGVWaXN1YWxpemF0aW9uID0gZnVuY3Rpb24ocHJlc2VudGF0aW9uOiBEYXRhVmlzdWFsaXphdGlvbkRlZmluaXRpb24sIGlzUHJpbWFyeT86IGJvb2xlYW4pIHtcblx0XHRcdGxldCBkZWZhdWx0VmlzdWFsaXphdGlvbjtcblx0XHRcdGZvciAoY29uc3QgdmlzdWFsaXphdGlvbiBvZiBwcmVzZW50YXRpb24udmlzdWFsaXphdGlvbnMpIHtcblx0XHRcdFx0aWYgKGlzUHJpbWFyeSAmJiB2aXN1YWxpemF0aW9uLnR5cGUgPT09IFZpc3VhbGl6YXRpb25UeXBlLkNoYXJ0KSB7XG5cdFx0XHRcdFx0ZGVmYXVsdFZpc3VhbGl6YXRpb24gPSB2aXN1YWxpemF0aW9uO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghaXNQcmltYXJ5ICYmIHZpc3VhbGl6YXRpb24udHlwZSA9PT0gVmlzdWFsaXphdGlvblR5cGUuVGFibGUpIHtcblx0XHRcdFx0XHRkZWZhdWx0VmlzdWFsaXphdGlvbiA9IHZpc3VhbGl6YXRpb247XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGNvbnN0IHByZXNlbnRhdGlvbkNyZWF0ZWQgPSBPYmplY3QuYXNzaWduKHt9LCBwcmVzZW50YXRpb24pO1xuXHRcdFx0aWYgKGRlZmF1bHRWaXN1YWxpemF0aW9uKSB7XG5cdFx0XHRcdHByZXNlbnRhdGlvbkNyZWF0ZWQudmlzdWFsaXphdGlvbnMgPSBbZGVmYXVsdFZpc3VhbGl6YXRpb25dO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHByZXNlbnRhdGlvbkNyZWF0ZWQ7XG5cdFx0fTtcblx0XHRjb25zdCBnZXRQcmVzZW50YXRpb24gPSBmdW5jdGlvbihpdGVtOiBTaW5nbGVWaWV3UGF0aENvbmZpZ3VyYXRpb24pIHtcblx0XHRcdGNvbnN0IHJlc29sdmVkVGFyZ2V0ID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlQW5ub3RhdGlvbihpdGVtLmFubm90YXRpb25QYXRoKTtcblx0XHRcdGNvbnN0IHRhcmdldEFubm90YXRpb24gPSByZXNvbHZlZFRhcmdldC5hbm5vdGF0aW9uIGFzIERhdGFWaXN1YWxpemF0aW9uQW5ub3RhdGlvbnM7XG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0ID0gcmVzb2x2ZWRUYXJnZXQuY29udmVydGVyQ29udGV4dDtcblx0XHRcdGNvbnN0IGFubm90YXRpb24gPSB0YXJnZXRBbm5vdGF0aW9uO1xuXHRcdFx0cHJlc2VudGF0aW9uID0gZ2V0RGF0YVZpc3VhbGl6YXRpb25Db25maWd1cmF0aW9uKFxuXHRcdFx0XHRhbm5vdGF0aW9uXG5cdFx0XHRcdFx0PyBjb252ZXJ0ZXJDb250ZXh0LmdldFJlbGF0aXZlQW5ub3RhdGlvblBhdGgoYW5ub3RhdGlvbi5mdWxseVF1YWxpZmllZE5hbWUsIGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpKVxuXHRcdFx0XHRcdDogXCJcIixcblx0XHRcdFx0dHJ1ZSxcblx0XHRcdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRcdFx0Y29uZmlnIGFzIFZpZXdQYXRoQ29uZmlndXJhdGlvblxuXHRcdFx0KTtcblx0XHRcdHJldHVybiBwcmVzZW50YXRpb247XG5cdFx0fTtcblx0XHRjb25zdCBjcmVhdGVBbHBWaWV3ID0gZnVuY3Rpb24oXG5cdFx0XHRwcmVzZW50YXRpb25zOiBEYXRhVmlzdWFsaXphdGlvbkRlZmluaXRpb25bXSxcblx0XHRcdGRlZmF1bHRQYXRoOiBcImJvdGhcIiB8IFwicHJpbWFyeVwiIHwgXCJzZWNvbmRhcnlcIiB8IHVuZGVmaW5lZFxuXHRcdCkge1xuXHRcdFx0Y29uc3QgcHJpbWFyeVZpc3VhbGl6YXRpb246IERhdGFWaXN1YWxpemF0aW9uRGVmaW5pdGlvbiB8IHVuZGVmaW5lZCA9IGNyZWF0ZVZpc3VhbGl6YXRpb24ocHJlc2VudGF0aW9uc1swXSwgdHJ1ZSk7XG5cdFx0XHRjaGFydENvbnRyb2xJZCA9IChwcmltYXJ5VmlzdWFsaXphdGlvbj8udmlzdWFsaXphdGlvbnNbMF0gYXMgQ2hhcnRWaXN1YWxpemF0aW9uKS5pZDtcblx0XHRcdGNvbnN0IHNlY29uZGFyeVZpc3VhbGl6YXRpb246IERhdGFWaXN1YWxpemF0aW9uRGVmaW5pdGlvbiB8IHVuZGVmaW5lZCA9IGNyZWF0ZVZpc3VhbGl6YXRpb24oXG5cdFx0XHRcdHByZXNlbnRhdGlvbnNbMV0gPyBwcmVzZW50YXRpb25zWzFdIDogcHJlc2VudGF0aW9uc1swXVxuXHRcdFx0KTtcblx0XHRcdHRhYmxlQ29udHJvbElkID0gKHNlY29uZGFyeVZpc3VhbGl6YXRpb24/LnZpc3VhbGl6YXRpb25zWzBdIGFzIFRhYmxlVmlzdWFsaXphdGlvbikuYW5ub3RhdGlvbi5pZDtcblx0XHRcdGlmIChwcmltYXJ5VmlzdWFsaXphdGlvbiAmJiBzZWNvbmRhcnlWaXN1YWxpemF0aW9uKSB7XG5cdFx0XHRcdGNvbnN0IHZpZXc6IENvbWJpbmVkVmlld0RlZmluaXRpb24gPSB7XG5cdFx0XHRcdFx0cHJpbWFyeVZpc3VhbGl6YXRpb24sXG5cdFx0XHRcdFx0c2Vjb25kYXJ5VmlzdWFsaXphdGlvbixcblx0XHRcdFx0XHR0YWJsZUNvbnRyb2xJZCxcblx0XHRcdFx0XHRjaGFydENvbnRyb2xJZCxcblx0XHRcdFx0XHRkZWZhdWx0UGF0aFxuXHRcdFx0XHR9O1xuXHRcdFx0XHRyZXR1cm4gdmlldztcblx0XHRcdH1cblx0XHR9O1xuXHRcdGlmIChwcmVzZW50YXRpb24/LnZpc3VhbGl6YXRpb25zPy5sZW5ndGggPT09IDIgJiYgY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gVGVtcGxhdGVUeXBlLkFuYWx5dGljYWxMaXN0UGFnZSkge1xuXHRcdFx0Y29uc3QgdmlldzogQ29tYmluZWRWaWV3RGVmaW5pdGlvbiB8IHVuZGVmaW5lZCA9IGNyZWF0ZUFscFZpZXcoW3ByZXNlbnRhdGlvbl0sIFwiYm90aFwiKTtcblx0XHRcdGlmICh2aWV3KSB7XG5cdFx0XHRcdHJldHVybiB2aWV3O1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpLmhhc011bHRpcGxlVmlzdWFsaXphdGlvbnMoY29uZmlnIGFzIFZpZXdQYXRoQ29uZmlndXJhdGlvbikgfHxcblx0XHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFRlbXBsYXRlVHlwZS5BbmFseXRpY2FsTGlzdFBhZ2Vcblx0XHQpIHtcblx0XHRcdGNvbnN0IHsgcHJpbWFyeSwgc2Vjb25kYXJ5IH0gPSBjb25maWcgYXMgQ29tYmluZWRWaWV3UGF0aENvbmZpZ3VyYXRpb247XG5cdFx0XHRpZiAocHJpbWFyeSAmJiBwcmltYXJ5Lmxlbmd0aCAmJiBzZWNvbmRhcnkgJiYgc2Vjb25kYXJ5Lmxlbmd0aCkge1xuXHRcdFx0XHRjb25zdCB2aWV3OiBDb21iaW5lZFZpZXdEZWZpbml0aW9uIHwgdW5kZWZpbmVkID0gY3JlYXRlQWxwVmlldyhcblx0XHRcdFx0XHRbZ2V0UHJlc2VudGF0aW9uKHByaW1hcnlbMF0pLCBnZXRQcmVzZW50YXRpb24oc2Vjb25kYXJ5WzBdKV0sXG5cdFx0XHRcdFx0KGNvbmZpZyBhcyBDb21iaW5lZFZpZXdQYXRoQ29uZmlndXJhdGlvbikuZGVmYXVsdFBhdGhcblx0XHRcdFx0KTtcblx0XHRcdFx0aWYgKHZpZXcpIHtcblx0XHRcdFx0XHRyZXR1cm4gdmlldztcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiU2Vjb25kYXJ5SXRlbXMgaW4gdGhlIFZpZXdzIGlzIG5vdCBwcmVzZW50XCIpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoaXNNdWx0aXBsZVZpZXdDb25maWd1cmF0aW9uKGNvbmZpZykpIHtcblx0XHRcdC8vIGtleSBleGlzdHMgb25seSBvbiBtdWx0aSB0YWJsZXMgbW9kZVxuXHRcdFx0Y29uc3QgcmVzb2x2ZWRUYXJnZXQgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGVBbm5vdGF0aW9uKChjb25maWcgYXMgU2luZ2xlVmlld1BhdGhDb25maWd1cmF0aW9uKS5hbm5vdGF0aW9uUGF0aCk7XG5cdFx0XHRjb25zdCB2aWV3QW5ub3RhdGlvbjogVmlld0Fubm90YXRpb25zVHlwZVR5cGVzID0gcmVzb2x2ZWRUYXJnZXQuYW5ub3RhdGlvbiBhcyBWaWV3QW5ub3RhdGlvbnNUeXBlVHlwZXM7XG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0ID0gcmVzb2x2ZWRUYXJnZXQuY29udmVydGVyQ29udGV4dDtcblx0XHRcdHRpdGxlID0gY29tcGlsZUJpbmRpbmcoYW5ub3RhdGlvbkV4cHJlc3Npb24odmlld0Fubm90YXRpb24uVGV4dCkpO1xuXHRcdFx0Ly8gTmVlZCB0byBsb29wIG9uIHRhYmxlIGludG8gdmlld3Mgc2luY2UgbXVsdGkgdGFibGUgbW9kZSBnZXQgc3BlY2lmaWMgY29uZmlndXJhdGlvbiAoaGlkZGVuIGZpbHRlcnMgb3IgVGFibGUgSWQpXG5cdFx0XHRwcmVzZW50YXRpb24udmlzdWFsaXphdGlvbnMuZm9yRWFjaCgodmlzdWFsaXphdGlvbkRlZmluaXRpb24sIGluZGV4KSA9PiB7XG5cdFx0XHRcdHN3aXRjaCAodmlzdWFsaXphdGlvbkRlZmluaXRpb24udHlwZSkge1xuXHRcdFx0XHRcdGNhc2UgVmlzdWFsaXphdGlvblR5cGUuVGFibGU6XG5cdFx0XHRcdFx0XHRjb25zdCB0YWJsZVZpc3VhbGl6YXRpb24gPSBwcmVzZW50YXRpb24udmlzdWFsaXphdGlvbnNbaW5kZXhdIGFzIFRhYmxlVmlzdWFsaXphdGlvbjtcblx0XHRcdFx0XHRcdGNvbnN0IGZpbHRlcnMgPSB0YWJsZVZpc3VhbGl6YXRpb24uY29udHJvbC5maWx0ZXJzIHx8IHt9O1xuXHRcdFx0XHRcdFx0ZmlsdGVycy5oaWRkZW5GaWx0ZXJzID0gZmlsdGVycy5oaWRkZW5GaWx0ZXJzIHx8IHsgcGF0aHM6IFtdIH07XG5cdFx0XHRcdFx0XHRpZiAoIShjb25maWcgYXMgU2luZ2xlVmlld1BhdGhDb25maWd1cmF0aW9uKS5rZWVwUHJldmlvdXNQcmVzb25hbGl6YXRpb24pIHtcblx0XHRcdFx0XHRcdFx0Ly8gTmVlZCB0byBvdmVycmlkZSBUYWJsZSBJZCB0byBtYXRjaCB3aXRoIFRhYiBLZXkgKGN1cnJlbnRseSBvbmx5IHRhYmxlIGlzIG1hbmFnZWQgaW4gbXVsdGlwbGUgdmlldyBtb2RlKVxuXHRcdFx0XHRcdFx0XHR0YWJsZVZpc3VhbGl6YXRpb24uYW5ub3RhdGlvbi5pZCA9IFRhYmxlSUQoKGNvbmZpZyBhcyBTaW5nbGVWaWV3UGF0aENvbmZpZ3VyYXRpb24pLmtleSB8fCBcIlwiLCBcIkxpbmVJdGVtXCIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y29uZmlnID0gY29uZmlnIGFzIFZpZXdBbm5vdGF0aW9uQ29uZmlndXJhdGlvbjtcblx0XHRcdFx0XHRcdGlmIChjb25maWcgJiYgY29uZmlnLmFubm90YXRpb24gJiYgY29uZmlnLmFubm90YXRpb24udGVybSA9PT0gVUlBbm5vdGF0aW9uVGVybXMuU2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudCkge1xuXHRcdFx0XHRcdFx0XHRzZWxlY3Rpb25WYXJpYW50UGF0aCA9IChjb25maWcuYW5ub3RhdGlvbiBhcyBTZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50VHlwZVR5cGVzKS5TZWxlY3Rpb25WYXJpYW50LmZ1bGx5UXVhbGlmaWVkTmFtZS5zcGxpdChcblx0XHRcdFx0XHRcdFx0XHRcIkBcIlxuXHRcdFx0XHRcdFx0XHQpWzFdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0c2VsZWN0aW9uVmFyaWFudFBhdGggPSAoY29uZmlnIGFzIFNpbmdsZVZpZXdQYXRoQ29uZmlndXJhdGlvbikuYW5ub3RhdGlvblBhdGg7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQvL1Byb3ZpZGUgU2VsZWN0aW9uIFZhcmlhbnQgdG8gaGlkZGVuRmlsdGVycyBpbiBvcmRlciB0byBzZXQgdGhlIFNWIGZpbHRlcnMgdG8gdGhlIHRhYmxlLlxuXHRcdFx0XHRcdFx0Ly9NREMgVGFibGUgb3ZlcnJpZGVzIGJpbmRpbmcgRmlsdGVyIGFuZCBmcm9tIFNBUCBGRSB0aGUgb25seSBtZXRob2Qgd2hlcmUgd2UgYXJlIGFibGUgdG8gYWRkXG5cdFx0XHRcdFx0XHQvL2FkZGl0aW9uYWwgZmlsdGVyIGlzICdyZWJpbmRUYWJsZScgaW50byBUYWJsZSBkZWxlZ2F0ZS5cblx0XHRcdFx0XHRcdC8vVG8gYXZvaWQgaW1wbGVtZW50aW5nIHNwZWNpZmljIExSIGZlYXR1cmUgdG8gU0FQIEZFIE1hY3JvIFRhYmxlLCB0aGUgZmlsdGVyKHMpIHJlbGF0ZWQgdG8gdGhlIFRhYiAobXVsdGkgdGFibGUgbW9kZSlcblx0XHRcdFx0XHRcdC8vY2FuIGJlIHBhc3NlZCB0byBtYWNybyB0YWJsZSB2aWEgcGFyYW1ldGVyL2NvbnRleHQgbmFtZWQgZmlsdGVycyBhbmQga2V5IGhpZGRlbkZpbHRlcnMuXG5cdFx0XHRcdFx0XHRmaWx0ZXJzLmhpZGRlbkZpbHRlcnMucGF0aHMucHVzaCh7IGFubm90YXRpb25QYXRoOiBzZWxlY3Rpb25WYXJpYW50UGF0aCB9KTtcblx0XHRcdFx0XHRcdHRhYmxlVmlzdWFsaXphdGlvbi5jb250cm9sLmZpbHRlcnMgPSBmaWx0ZXJzO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBWaXN1YWxpemF0aW9uVHlwZS5DaGFydDpcblx0XHRcdFx0XHRcdGNvbnN0IGNoYXJ0VmlzdWFsaXphdGlvbiA9IHByZXNlbnRhdGlvbi52aXN1YWxpemF0aW9uc1tpbmRleF0gYXMgQ2hhcnRWaXN1YWxpemF0aW9uO1xuXHRcdFx0XHRcdFx0Y2hhcnRWaXN1YWxpemF0aW9uLmlkID0gQ2hhcnRJRCgoY29uZmlnIGFzIFNpbmdsZVZpZXdQYXRoQ29uZmlndXJhdGlvbikua2V5IHx8IFwiXCIsIFwiQ2hhcnRcIik7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRwcmVzZW50YXRpb24udmlzdWFsaXphdGlvbnMuZm9yRWFjaCh2aXN1YWxpemF0aW9uRGVmaW5pdGlvbiA9PiB7XG5cdFx0XHRpZiAodmlzdWFsaXphdGlvbkRlZmluaXRpb24udHlwZSA9PT0gVmlzdWFsaXphdGlvblR5cGUuVGFibGUpIHtcblx0XHRcdFx0dGFibGVDb250cm9sSWQgPSB2aXN1YWxpemF0aW9uRGVmaW5pdGlvbi5hbm5vdGF0aW9uLmlkO1xuXHRcdFx0fSBlbHNlIGlmICh2aXN1YWxpemF0aW9uRGVmaW5pdGlvbi50eXBlID09PSBWaXN1YWxpemF0aW9uVHlwZS5DaGFydCkge1xuXHRcdFx0XHRjaGFydENvbnRyb2xJZCA9IHZpc3VhbGl6YXRpb25EZWZpbml0aW9uLmlkO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiB7XG5cdFx0XHRwcmVzZW50YXRpb24sXG5cdFx0XHR0YWJsZUNvbnRyb2xJZCxcblx0XHRcdGNoYXJ0Q29udHJvbElkLFxuXHRcdFx0dGl0bGUsXG5cdFx0XHRzZWxlY3Rpb25WYXJpYW50UGF0aFxuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0Y29uZmlnID0gY29uZmlnIGFzIEN1c3RvbVZpZXdDb25maWd1cmF0aW9uO1xuXHRcdGNvbnN0IHRpdGxlID0gY29uZmlnLmxhYmVsLFxuXHRcdFx0ZnJhZ21lbnQgPSBjb25maWcudGVtcGxhdGUsXG5cdFx0XHR0eXBlID0gY29uZmlnLnR5cGUsXG5cdFx0XHRjdXN0b21UYWJJZCA9IEN1c3RvbVRhYklEKGNvbmZpZy5rZXkgfHwgXCJcIik7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRpdGxlLFxuXHRcdFx0ZnJhZ21lbnQsXG5cdFx0XHR0eXBlLFxuXHRcdFx0Y3VzdG9tVGFiSWRcblx0XHR9O1xuXHR9XG59O1xuXG5jb25zdCBnZXRWaWV3cyA9IGZ1bmN0aW9uKFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRzZXR0aW5nc1ZpZXdzOiBNdWx0aXBsZVZpZXdzQ29uZmlndXJhdGlvbiB8IHVuZGVmaW5lZFxuKTogTGlzdFJlcG9ydFZpZXdEZWZpbml0aW9uW10ge1xuXHRsZXQgdmlld0NvbnZlcnRlckNvbmZpZ3M6IFZpZXdDb252ZXJ0ZXJTZXR0aW5nc1tdID0gW107XG5cdGlmIChzZXR0aW5nc1ZpZXdzKSB7XG5cdFx0c2V0dGluZ3NWaWV3cy5wYXRocy5mb3JFYWNoKChwYXRoOiBWaWV3UGF0aENvbmZpZ3VyYXRpb24gfCBDdXN0b21WaWV3VGVtcGxhdGVDb25maWd1cmF0aW9uKSA9PiB7XG5cdFx0XHRpZiAoY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKS5oYXNNdWx0aXBsZVZpc3VhbGl6YXRpb25zKHBhdGggYXMgVmlld1BhdGhDb25maWd1cmF0aW9uKSkge1xuXHRcdFx0XHRpZiAoc2V0dGluZ3NWaWV3cy5wYXRocy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQUxQIGZsYXZvciBjYW5ub3QgaGF2ZSBtdWx0aXBsZSB2aWV3c1wiKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwYXRoID0gcGF0aCBhcyBDb21iaW5lZFZpZXdQYXRoQ29uZmlndXJhdGlvbjtcblx0XHRcdFx0XHR2aWV3Q29udmVydGVyQ29uZmlncy5wdXNoKHtcblx0XHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHQ6IGNvbnZlcnRlckNvbnRleHQsXG5cdFx0XHRcdFx0XHRwcmltYXJ5OiBwYXRoLnByaW1hcnksXG5cdFx0XHRcdFx0XHRzZWNvbmRhcnk6IHBhdGguc2Vjb25kYXJ5LFxuXHRcdFx0XHRcdFx0ZGVmYXVsdFBhdGg6IHBhdGguZGVmYXVsdFBhdGhcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICgocGF0aCBhcyBDdXN0b21WaWV3Q29uZmlndXJhdGlvbikudGVtcGxhdGUpIHtcblx0XHRcdFx0cGF0aCA9IHBhdGggYXMgQ3VzdG9tVmlld0NvbmZpZ3VyYXRpb247XG5cdFx0XHRcdHZpZXdDb252ZXJ0ZXJDb25maWdzLnB1c2goe1xuXHRcdFx0XHRcdGtleTogcGF0aC5rZXksXG5cdFx0XHRcdFx0bGFiZWw6IHBhdGgubGFiZWwsXG5cdFx0XHRcdFx0dGVtcGxhdGU6IHBhdGgudGVtcGxhdGUsXG5cdFx0XHRcdFx0dHlwZTogXCJDdXN0b21cIlxuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHBhdGggPSBwYXRoIGFzIFNpbmdsZVZpZXdQYXRoQ29uZmlndXJhdGlvbjtcblx0XHRcdFx0Y29uc3QgbWFuaWZlc3RXcmFwcGVyID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKSxcblx0XHRcdFx0XHR2aWV3Q29udmVydGVyQ29udGV4dCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0Q29udmVydGVyQ29udGV4dEZvcihcblx0XHRcdFx0XHRcdHBhdGguY29udGV4dFBhdGggfHwgKHBhdGguZW50aXR5U2V0ICYmIFwiL1wiICsgcGF0aC5lbnRpdHlTZXQpIHx8IGNvbnZlcnRlckNvbnRleHQuZ2V0Q29udGV4dFBhdGgoKVxuXHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0ZW50aXR5VHlwZSA9IHZpZXdDb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGUoKTtcblxuXHRcdFx0XHRpZiAoZW50aXR5VHlwZSAmJiB2aWV3Q29udmVydGVyQ29udGV4dCkge1xuXHRcdFx0XHRcdGNvbnN0IGFubm90YXRpb25QYXRoID0gbWFuaWZlc3RXcmFwcGVyLmdldERlZmF1bHRUZW1wbGF0ZUFubm90YXRpb25QYXRoKCk7XG5cdFx0XHRcdFx0bGV0IGFubm90YXRpb247XG5cdFx0XHRcdFx0Y29uc3QgcmVzb2x2ZWRUYXJnZXQgPSB2aWV3Q29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlQW5ub3RhdGlvbihwYXRoLmFubm90YXRpb25QYXRoKTtcblx0XHRcdFx0XHRjb25zdCB0YXJnZXRBbm5vdGF0aW9uID0gcmVzb2x2ZWRUYXJnZXQuYW5ub3RhdGlvbiBhcyBEYXRhVmlzdWFsaXphdGlvbkFubm90YXRpb25zO1xuXHRcdFx0XHRcdGNvbnN0IHJlc29sdmVkVGFyZ2V0Y29udmVydGVyQ29udGV4dCA9IHJlc29sdmVkVGFyZ2V0LmNvbnZlcnRlckNvbnRleHQ7XG5cdFx0XHRcdFx0aWYgKHRhcmdldEFubm90YXRpb24pIHtcblx0XHRcdFx0XHRcdGlmICh0YXJnZXRBbm5vdGF0aW9uLnRlcm0gPT09IFVJQW5ub3RhdGlvblRlcm1zLlNlbGVjdGlvblZhcmlhbnQpIHtcblx0XHRcdFx0XHRcdFx0aWYgKGFubm90YXRpb25QYXRoKSB7XG5cdFx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvbiA9IGdldFNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnQoXG5cdFx0XHRcdFx0XHRcdFx0XHR2aWV3Q29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCksXG5cdFx0XHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uUGF0aCxcblx0XHRcdFx0XHRcdFx0XHRcdHJlc29sdmVkVGFyZ2V0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvbiA9IGdldERlZmF1bHRMaW5lSXRlbSh2aWV3Q29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCkpIGFzIExpbmVJdGVtO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uID0gdGFyZ2V0QW5ub3RhdGlvbjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHZpZXdDb252ZXJ0ZXJDb25maWdzLnB1c2goe1xuXHRcdFx0XHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0OiB2aWV3Q29udmVydGVyQ29udGV4dCxcblx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvbixcblx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvblBhdGg6IHBhdGguYW5ub3RhdGlvblBhdGgsXG5cdFx0XHRcdFx0XHRcdGtlZXBQcmV2aW91c1ByZXNvbmFsaXphdGlvbjogcGF0aC5rZWVwUHJldmlvdXNQcmVzb25hbGl6YXRpb24sXG5cdFx0XHRcdFx0XHRcdGtleTogcGF0aC5rZXlcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBUT0RPIERpYWdub3N0aWNzIG1lc3NhZ2Vcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdGNvbnN0IGVudGl0eVR5cGUgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGUoKTtcblx0XHRpZiAoY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gVGVtcGxhdGVUeXBlLkFuYWx5dGljYWxMaXN0UGFnZSkge1xuXHRcdFx0dmlld0NvbnZlcnRlckNvbmZpZ3MgPSBnZXRBbHBWaWV3Q29uZmlnKGNvbnZlcnRlckNvbnRleHQsIHZpZXdDb252ZXJ0ZXJDb25maWdzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmlld0NvbnZlcnRlckNvbmZpZ3MucHVzaCh7XG5cdFx0XHRcdGFubm90YXRpb246IGdldENvbXBsaWFudFZpc3VhbGl6YXRpb25Bbm5vdGF0aW9uKGVudGl0eVR5cGUsIGNvbnZlcnRlckNvbnRleHQsIGZhbHNlKSxcblx0XHRcdFx0Y29udmVydGVyQ29udGV4dDogY29udmVydGVyQ29udGV4dFxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB2aWV3Q29udmVydGVyQ29uZmlncy5tYXAodmlld0NvbnZlcnRlckNvbmZpZyA9PiB7XG5cdFx0cmV0dXJuIGdldFZpZXcodmlld0NvbnZlcnRlckNvbmZpZyk7XG5cdH0pO1xufTtcblxuZnVuY3Rpb24gZ2V0QWxwVmlld0NvbmZpZyhjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LCB2aWV3Q29uZmlnczogVmlld0NvbnZlcnRlclNldHRpbmdzW10pOiBWaWV3Q29udmVydGVyU2V0dGluZ3NbXSB7XG5cdGNvbnN0IGVudGl0eVR5cGUgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGUoKTtcblx0Y29uc3QgYW5ub3RhdGlvbiA9IGdldENvbXBsaWFudFZpc3VhbGl6YXRpb25Bbm5vdGF0aW9uKGVudGl0eVR5cGUsIGNvbnZlcnRlckNvbnRleHQsIHRydWUpO1xuXHRsZXQgY2hhcnQsIHRhYmxlO1xuXHRpZiAoYW5ub3RhdGlvbikge1xuXHRcdHZpZXdDb25maWdzLnB1c2goe1xuXHRcdFx0YW5ub3RhdGlvbjogYW5ub3RhdGlvbixcblx0XHRcdGNvbnZlcnRlckNvbnRleHRcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRjaGFydCA9IGdldERlZmF1bHRDaGFydChlbnRpdHlUeXBlKTtcblx0XHR0YWJsZSA9IGdldERlZmF1bHRMaW5lSXRlbShlbnRpdHlUeXBlKTtcblx0XHRpZiAoY2hhcnQgJiYgdGFibGUpIHtcblx0XHRcdGNvbnN0IHByaW1hcnk6IFNpbmdsZVZpZXdQYXRoQ29uZmlndXJhdGlvbltdID0gW3sgYW5ub3RhdGlvblBhdGg6IGNoYXJ0LnRlcm0gfV07XG5cdFx0XHRjb25zdCBzZWNvbmRhcnk6IFNpbmdsZVZpZXdQYXRoQ29uZmlndXJhdGlvbltdID0gW3sgYW5ub3RhdGlvblBhdGg6IHRhYmxlLnRlcm0gfV07XG5cdFx0XHR2aWV3Q29uZmlncy5wdXNoKHtcblx0XHRcdFx0Y29udmVydGVyQ29udGV4dDogY29udmVydGVyQ29udGV4dCxcblx0XHRcdFx0cHJpbWFyeTogcHJpbWFyeSxcblx0XHRcdFx0c2Vjb25kYXJ5OiBzZWNvbmRhcnksXG5cdFx0XHRcdGRlZmF1bHRQYXRoOiBcImJvdGhcIlxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB2aWV3Q29uZmlncztcbn1cblxuZXhwb3J0IGNvbnN0IGdldEhlYWRlckFjdGlvbnMgPSBmdW5jdGlvbihjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogQmFzZUFjdGlvbltdIHtcblx0Y29uc3QgbWFuaWZlc3RXcmFwcGVyID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKTtcblx0cmV0dXJuIGluc2VydEN1c3RvbUVsZW1lbnRzKFtdLCBnZXRBY3Rpb25zRnJvbU1hbmlmZXN0KG1hbmlmZXN0V3JhcHBlci5nZXRIZWFkZXJBY3Rpb25zKCksIGNvbnZlcnRlckNvbnRleHQpKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjaGVja0NoYXJ0RmlsdGVyQmFySWQgPSBmdW5jdGlvbih2aWV3czogTGlzdFJlcG9ydFZpZXdEZWZpbml0aW9uW10sIGZpbHRlckJhcklkOiBzdHJpbmcpIHtcblx0dmlld3MuZm9yRWFjaCh2aWV3ID0+IHtcblx0XHRpZiAoISh2aWV3IGFzIEN1c3RvbVZpZXdEZWZpbml0aW9uKS50eXBlKSB7XG5cdFx0XHRjb25zdCBwcmVzZW50YXRpb246IERhdGFWaXN1YWxpemF0aW9uRGVmaW5pdGlvbiA9ICh2aWV3IGFzIFNpbmdsZVZpZXdEZWZpbml0aW9uKS5wcmVzZW50YXRpb247XG5cdFx0XHRwcmVzZW50YXRpb24udmlzdWFsaXphdGlvbnMuZm9yRWFjaCh2aXN1YWxpemF0aW9uRGVmaW5pdGlvbiA9PiB7XG5cdFx0XHRcdGlmICh2aXN1YWxpemF0aW9uRGVmaW5pdGlvbi50eXBlID09PSBWaXN1YWxpemF0aW9uVHlwZS5DaGFydCAmJiB2aXN1YWxpemF0aW9uRGVmaW5pdGlvbi5maWx0ZXJJZCAhPT0gZmlsdGVyQmFySWQpIHtcblx0XHRcdFx0XHR2aXN1YWxpemF0aW9uRGVmaW5pdGlvbi5maWx0ZXJJZCA9IGZpbHRlckJhcklkO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH0pO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIHRoZSBMaXN0UmVwb3J0RGVmaW5pdGlvbiBmb3IgbXVsdGlwbGUgZW50aXR5IHNldHMgKG11bHRpcGxlIHRhYmxlIG1vZGUpLlxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHJldHVybnMge0xpc3RSZXBvcnREZWZpbml0aW9ufSBUaGUgbGlzdCByZXBvcnQgZGVmaW5pdGlvbiBiYXNlZCBvbiBhbm5vdGF0aW9uICsgbWFuaWZlc3RcbiAqL1xuZXhwb3J0IGNvbnN0IGNvbnZlcnRQYWdlID0gZnVuY3Rpb24oY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IExpc3RSZXBvcnREZWZpbml0aW9uIHtcblx0Y29uc3QgZW50aXR5VHlwZSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpO1xuXHRjb25zdCBzQ29udGV4dFBhdGggPSBjb252ZXJ0ZXJDb250ZXh0LmdldENvbnRleHRQYXRoKCk7XG5cblx0aWYgKCFzQ29udGV4dFBhdGgpIHtcblx0XHQvLyBJZiB3ZSBkb24ndCBoYXZlIGFuIGVudGl0eVNldCBhdCB0aGlzIHBvaW50IHdlIGhhdmUgYW4gaXNzdWUgSSdkIHNheVxuXHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFwiQW4gRW50aXR5U2V0IGlzIHJlcXVpcmVkIHRvIGJlIGFibGUgdG8gZGlzcGxheSBhIExpc3RSZXBvcnQsIHBsZWFzZSBhZGp1c3QgeW91ciBgZW50aXR5U2V0YCBwcm9wZXJ0eSB0byBwb2ludCB0byBvbmUuXCJcblx0XHQpO1xuXHR9XG5cdGNvbnN0IG1hbmlmZXN0V3JhcHBlciA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCk7XG5cdGNvbnN0IHZpZXdzRGVmaW5pdGlvbjogTXVsdGlwbGVWaWV3c0NvbmZpZ3VyYXRpb24gfCB1bmRlZmluZWQgPSBtYW5pZmVzdFdyYXBwZXIuZ2V0Vmlld0NvbmZpZ3VyYXRpb24oKTtcblx0Y29uc3QgaGFzTXVsdGlwbGVFbnRpdHlTZXRzID0gbWFuaWZlc3RXcmFwcGVyLmhhc011bHRpcGxlRW50aXR5U2V0cygpO1xuXHRjb25zdCB2aWV3czogTGlzdFJlcG9ydFZpZXdEZWZpbml0aW9uW10gPSBnZXRWaWV3cyhjb252ZXJ0ZXJDb250ZXh0LCB2aWV3c0RlZmluaXRpb24pO1xuXHRjb25zdCBzaG93VGFiQ291bnRzID0gdmlld3NEZWZpbml0aW9uID8gdmlld3NEZWZpbml0aW9uPy5zaG93Q291bnRzIHx8IGhhc011bHRpcGxlRW50aXR5U2V0cyA6IHVuZGVmaW5lZDsgLy8gd2l0aCBtdWx0aSBFbnRpdHlTZXRzLCB0YWIgY291bnRzIGFyZSBkaXNwbGF5ZWQgYnkgZGVmYXVsdFxuXHRjb25zdCBsclRhYmxlVmlzdWFsaXphdGlvbnMgPSBnZXRUYWJsZVZpc3VhbGl6YXRpb25zKHZpZXdzKTtcblx0Y29uc3QgbHJDaGFydFZpc3VhbGl6YXRpb25zID0gZ2V0Q2hhcnRWaXN1YWxpemF0aW9ucyh2aWV3cyk7XG5cdGNvbnN0IHNob3dQaW5uYWJsZVRvZ2dsZSA9IGxyVGFibGVWaXN1YWxpemF0aW9ucy5zb21lKHRhYmxlID0+IHRhYmxlLmNvbnRyb2wudHlwZSA9PT0gXCJSZXNwb25zaXZlVGFibGVcIik7XG5cdGxldCBzaW5nbGVUYWJsZUlkID0gXCJcIjtcblx0bGV0IHNpbmdsZUNoYXJ0SWQgPSBcIlwiO1xuXHRjb25zdCBmaWx0ZXJCYXJJZCA9IEZpbHRlckJhcklEKHNDb250ZXh0UGF0aCk7XG5cdGNvbnN0IGZpbHRlclZhcmlhbnRNYW5hZ2VtZW50SUQgPSBGaWx0ZXJWYXJpYW50TWFuYWdlbWVudElEKGZpbHRlckJhcklkKTtcblx0bGV0IHRhcmdldENvbnRyb2xJZHMgPSBbZmlsdGVyQmFySWRdLmNvbmNhdChcblx0XHRsclRhYmxlVmlzdWFsaXphdGlvbnMubWFwKHZpc3VhbGl6YXRpb24gPT4ge1xuXHRcdFx0cmV0dXJuIHZpc3VhbGl6YXRpb24uYW5ub3RhdGlvbi5pZDtcblx0XHR9KVxuXHQpO1xuXHR0YXJnZXRDb250cm9sSWRzID0gdGFyZ2V0Q29udHJvbElkcy5jb25jYXQoXG5cdFx0bHJDaGFydFZpc3VhbGl6YXRpb25zLm1hcCh2aXN1YWxpemF0aW9uID0+IHtcblx0XHRcdHJldHVybiB2aXN1YWxpemF0aW9uLmlkO1xuXHRcdH0pXG5cdCk7XG5cdGNvbnN0IGZiQ29uZmlnID0gbWFuaWZlc3RXcmFwcGVyLmdldEZpbHRlckNvbmZpZ3VyYXRpb24oKTtcblx0Y29uc3QgZmlsdGVySW5pdGlhbExheW91dCA9IGZiQ29uZmlnPy5pbml0aWFsTGF5b3V0ICE9PSB1bmRlZmluZWQgPyBmYkNvbmZpZz8uaW5pdGlhbExheW91dC50b0xvd2VyQ2FzZSgpIDogXCJjb21wYWN0XCI7XG5cdGNvbnN0IGZpbHRlckxheW91dCA9IGZiQ29uZmlnPy5sYXlvdXQgIT09IHVuZGVmaW5lZCA/IGZiQ29uZmlnPy5sYXlvdXQudG9Mb3dlckNhc2UoKSA6IFwiY29tcGFjdFwiO1xuXHRjb25zdCB1c2VTZW1hbnRpY0RhdGVSYW5nZSA9IGZiQ29uZmlnLnVzZVNlbWFudGljRGF0ZVJhbmdlICE9PSB1bmRlZmluZWQgPyBmYkNvbmZpZy51c2VTZW1hbnRpY0RhdGVSYW5nZSA6IHRydWU7XG5cblx0Y29uc3Qgb0NvbmZpZyA9IGdldENvbnRlbnRBcmVhSWQoY29udmVydGVyQ29udGV4dCwgdmlld3MpO1xuXHRpZiAob0NvbmZpZykge1xuXHRcdHNpbmdsZUNoYXJ0SWQgPSBvQ29uZmlnLmNoYXJ0SWQ7XG5cdFx0c2luZ2xlVGFibGVJZCA9IG9Db25maWcudGFibGVJZDtcblx0fVxuXHRjb25zdCBzZWxlY3Rpb25GaWVsZHMgPSBnZXRTZWxlY3Rpb25GaWVsZHMoY29udmVydGVyQ29udGV4dCwgbHJUYWJsZVZpc3VhbGl6YXRpb25zKTtcblxuXHRjb25zdCBoaWRlQmFzaWNTZWFyY2ggPSBnZXRGaWx0ZXJCYXJoaWRlQmFzaWNTZWFyY2gobHJUYWJsZVZpc3VhbGl6YXRpb25zLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0Y29uc3Qgc2VsZWN0aW9uVmFyaWFudCA9IGdldFNlbGVjdGlvblZhcmlhbnQoZW50aXR5VHlwZSwgY29udmVydGVyQ29udGV4dCk7XG5cdGNvbnN0IGRlZmF1bHRTZW1hbnRpY0RhdGVzOiBhbnkgPSB1c2VTZW1hbnRpY0RhdGVSYW5nZVxuXHRcdD8gZ2V0RGVmYXVsdFNlbWFudGljRGF0ZXMoZ2V0TWFuaWZlc3RGaWx0ZXJGaWVsZHMoZW50aXR5VHlwZSwgY29udmVydGVyQ29udGV4dCkpXG5cdFx0OiB7fTtcblx0Ly8gU29ydCBoZWFkZXIgYWN0aW9ucyBhY2NvcmRpbmcgdG8gcG9zaXRpb24gYXR0cmlidXRlcyBpbiBtYW5pZmVzdFxuXHRjb25zdCBoZWFkZXJBY3Rpb25zID0gZ2V0SGVhZGVyQWN0aW9ucyhjb252ZXJ0ZXJDb250ZXh0KTtcblx0Y29uc3QgaGFzTXVsdGlWaXN1YWxpemF0aW9uczogYm9vbGVhbiA9XG5cdFx0bWFuaWZlc3RXcmFwcGVyLmhhc011bHRpcGxlVmlzdWFsaXphdGlvbnMoKSB8fCBjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBUZW1wbGF0ZVR5cGUuQW5hbHl0aWNhbExpc3RQYWdlO1xuXHRpZiAoaGFzTXVsdGlwbGVFbnRpdHlTZXRzKSB7XG5cdFx0Y2hlY2tDaGFydEZpbHRlckJhcklkKHZpZXdzLCBmaWx0ZXJCYXJJZCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdG1haW5FbnRpdHlTZXQ6IHNDb250ZXh0UGF0aCxcblx0XHRtYWluRW50aXR5VHlwZTogc0NvbnRleHRQYXRoICsgXCIvXCIsXG5cdFx0c2luZ2xlVGFibGVJZCxcblx0XHRzaW5nbGVDaGFydElkLFxuXHRcdHNob3dUYWJDb3VudHMsXG5cdFx0aGVhZGVyQWN0aW9ucyxcblx0XHRzaG93UGlubmFibGVUb2dnbGU6IHNob3dQaW5uYWJsZVRvZ2dsZSxcblx0XHRmaWx0ZXJCYXI6IHtcblx0XHRcdHNlbGVjdGlvbkZpZWxkcyxcblx0XHRcdGhpZGVCYXNpY1NlYXJjaFxuXHRcdH0sXG5cdFx0dmlld3M6IHZpZXdzLFxuXHRcdGZpbHRlckJhcklkLFxuXHRcdGZpbHRlckNvbmRpdGlvbnM6IHtcblx0XHRcdHNlbGVjdGlvblZhcmlhbnQ6IHNlbGVjdGlvblZhcmlhbnQsXG5cdFx0XHRkZWZhdWx0U2VtYW50aWNEYXRlczogZGVmYXVsdFNlbWFudGljRGF0ZXNcblx0XHR9LFxuXHRcdHZhcmlhbnRNYW5hZ2VtZW50OiB7XG5cdFx0XHRpZDogZmlsdGVyVmFyaWFudE1hbmFnZW1lbnRJRCxcblx0XHRcdHRhcmdldENvbnRyb2xJZHM6IHRhcmdldENvbnRyb2xJZHMuam9pbihcIixcIilcblx0XHR9LFxuXHRcdGlzTXVsdGlFbnRpdHlTZXRzOiBoYXNNdWx0aXBsZUVudGl0eVNldHMsXG5cdFx0aGFzTXVsdGlWaXN1YWxpemF0aW9uczogaGFzTXVsdGlWaXN1YWxpemF0aW9ucyxcblx0XHR1c2VTZW1hbnRpY0RhdGVSYW5nZSxcblx0XHRmaWx0ZXJJbml0aWFsTGF5b3V0LFxuXHRcdGZpbHRlckxheW91dCxcblx0XHRrcGlEZWZpbml0aW9uczogZ2V0S1BJRGVmaW5pdGlvbnMoY29udmVydGVyQ29udGV4dClcblx0fTtcbn07XG5cbmZ1bmN0aW9uIGdldENvbnRlbnRBcmVhSWQoY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCwgdmlld3M6IExpc3RSZXBvcnRWaWV3RGVmaW5pdGlvbltdKTogQ29udGVudEFyZWFJRCB8IHVuZGVmaW5lZCB7XG5cdGxldCBzaW5nbGVUYWJsZUlkID0gXCJcIixcblx0XHRzaW5nbGVDaGFydElkID0gXCJcIjtcblx0aWYgKFxuXHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCkuaGFzTXVsdGlwbGVWaXN1YWxpemF0aW9ucygpIHx8XG5cdFx0Y29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gVGVtcGxhdGVUeXBlLkFuYWx5dGljYWxMaXN0UGFnZVxuXHQpIHtcblx0XHRmb3IgKGxldCB2aWV3IG9mIHZpZXdzKSB7XG5cdFx0XHR2aWV3ID0gdmlldyBhcyBDb21iaW5lZFZpZXdEZWZpbml0aW9uO1xuXHRcdFx0aWYgKHZpZXcuY2hhcnRDb250cm9sSWQgJiYgdmlldy50YWJsZUNvbnRyb2xJZCkge1xuXHRcdFx0XHRzaW5nbGVDaGFydElkID0gdmlldy5jaGFydENvbnRyb2xJZDtcblx0XHRcdFx0c2luZ2xlVGFibGVJZCA9IHZpZXcudGFibGVDb250cm9sSWQ7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRmb3IgKGxldCB2aWV3IG9mIHZpZXdzKSB7XG5cdFx0XHR2aWV3ID0gdmlldyBhcyBTaW5nbGVWaWV3RGVmaW5pdGlvbjtcblx0XHRcdGlmICghc2luZ2xlVGFibGVJZCAmJiAodmlldyBhcyBTaW5nbGVUYWJsZVZpZXdEZWZpbml0aW9uKS50YWJsZUNvbnRyb2xJZCkge1xuXHRcdFx0XHRzaW5nbGVUYWJsZUlkID0gKHZpZXcgYXMgU2luZ2xlVGFibGVWaWV3RGVmaW5pdGlvbikudGFibGVDb250cm9sSWQgfHwgXCJcIjtcblx0XHRcdH1cblx0XHRcdGlmICghc2luZ2xlQ2hhcnRJZCAmJiAodmlldyBhcyBTaW5nbGVDaGFydFZpZXdEZWZpbml0aW9uKS5jaGFydENvbnRyb2xJZCkge1xuXHRcdFx0XHRzaW5nbGVDaGFydElkID0gKHZpZXcgYXMgU2luZ2xlQ2hhcnRWaWV3RGVmaW5pdGlvbikuY2hhcnRDb250cm9sSWQgfHwgXCJcIjtcblx0XHRcdH1cblx0XHRcdGlmIChzaW5nbGVDaGFydElkICYmIHNpbmdsZVRhYmxlSWQpIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGlmIChzaW5nbGVUYWJsZUlkIHx8IHNpbmdsZUNoYXJ0SWQpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Y2hhcnRJZDogc2luZ2xlQ2hhcnRJZCxcblx0XHRcdHRhYmxlSWQ6IHNpbmdsZVRhYmxlSWRcblx0XHR9O1xuXHR9XG5cdHJldHVybiB1bmRlZmluZWQ7XG59XG4iXX0=