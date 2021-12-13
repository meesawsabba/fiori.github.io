/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["../../ManifestSettings", "sap/fe/core/converters/controls/Common/Table", "sap/fe/core/converters/helpers/ConfigurableObject", "sap/fe/core/converters/controls/ListReport/VisualFilters", "sap/fe/core/helpers/BindingExpression", "../Common/DataVisualization", "sap/fe/core/converters/helpers/Key", "sap/fe/core/converters/helpers/IssueManager"], function (ManifestSettings, Table, ConfigurableObject, VisualFilters, BindingExpression, DataVisualization, Key, IssueManager) {
  "use strict";

  var _exports = {};
  var IssueCategory = IssueManager.IssueCategory;
  var IssueSeverity = IssueManager.IssueSeverity;
  var IssueType = IssueManager.IssueType;
  var KeyHelper = Key.KeyHelper;
  var getSelectionVariant = DataVisualization.getSelectionVariant;
  var compileBinding = BindingExpression.compileBinding;
  var annotationExpression = BindingExpression.annotationExpression;
  var getVisualFilters = VisualFilters.getVisualFilters;
  var Placement = ConfigurableObject.Placement;
  var insertCustomElements = ConfigurableObject.insertCustomElements;
  var isFilteringCaseSensitive = Table.isFilteringCaseSensitive;
  var getSelectionVariantConfiguration = Table.getSelectionVariantConfiguration;
  var TemplateType = ManifestSettings.TemplateType;
  var AvailabilityType = ManifestSettings.AvailabilityType;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  /**
   * Enter all DataFields of a given FieldGroup into the filterFacetMap.
   *
   * @param {AnnotationTerm<FieldGroupType>} fieldGroup
   * @returns {Record<string, FilterGroup>} The map of facets for the given fieldGroup
   */
  function getFieldGroupFilterGroups(fieldGroup) {
    var filterFacetMap = {};
    fieldGroup.Data.forEach(function (dataField) {
      if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataField") {
        var _fieldGroup$annotatio, _fieldGroup$annotatio2;

        filterFacetMap[dataField.Value.path] = {
          group: fieldGroup.fullyQualifiedName,
          groupLabel: compileBinding(annotationExpression(fieldGroup.Label || ((_fieldGroup$annotatio = fieldGroup.annotations) === null || _fieldGroup$annotatio === void 0 ? void 0 : (_fieldGroup$annotatio2 = _fieldGroup$annotatio.Common) === null || _fieldGroup$annotatio2 === void 0 ? void 0 : _fieldGroup$annotatio2.Label) || fieldGroup.qualifier)) || fieldGroup.qualifier
        };
      }
    });
    return filterFacetMap;
  }

  function getExcludedFilterProperties(selectionVariants) {
    return selectionVariants.reduce(function (previousValue, selectionVariant) {
      selectionVariant.propertyNames.forEach(function (propertyName) {
        previousValue[propertyName] = true;
      });
      return previousValue;
    }, {});
  }
  /**
   * Check that all the tables for a dedicated entityset are configured as analytical table.
   * @param {TableVisualization[]} listReportTables List Report tables
   * @param {string} contextPath
   * @returns {boolean} Is FilterBar search field hidden or not
   */


  function checkAllTableForEntitySetAreAnalytical(listReportTables, contextPath) {
    if (contextPath && listReportTables.length > 0) {
      return listReportTables.every(function (visualization) {
        return visualization.enableAnalytics && contextPath === visualization.annotation.collection;
      });
    }

    return false;
  }

  function getSelectionVariants(lrTableVisualizations, converterContext) {
    var selectionVariantPaths = [];
    return lrTableVisualizations.map(function (visualization) {
      var tableFilters = visualization.control.filters;
      var tableSVConfigs = [];

      for (var key in tableFilters) {
        if (Array.isArray(tableFilters[key].paths)) {
          var paths = tableFilters[key].paths;
          paths.forEach(function (path) {
            if (path && path.annotationPath && selectionVariantPaths.indexOf(path.annotationPath) === -1) {
              selectionVariantPaths.push(path.annotationPath);
              var selectionVariantConfig = getSelectionVariantConfiguration(path.annotationPath, converterContext);

              if (selectionVariantConfig) {
                tableSVConfigs.push(selectionVariantConfig);
              }
            }
          });
        }
      }

      return tableSVConfigs;
    }).reduce(function (svConfigs, selectionVariant) {
      return svConfigs.concat(selectionVariant);
    }, []);
  }
  /**
   * Returns the condition path required for the condition model. It looks like follow:
   * <1:N-PropertyName>*\/<1:1-PropertyName>/<PropertyName>.
   *
   * @param entityType The root EntityTy[e
   * @param propertyPath The full path to the target property
   * @returns {string} The formatted condition path
   */


  var _getConditionPath = function (entityType, propertyPath) {
    var parts = propertyPath.split("/");
    var partialPath;
    var key = "";

    while (parts.length) {
      var part = parts.shift();
      partialPath = partialPath ? partialPath + "/" + part : part;
      var property = entityType.resolvePath(partialPath);

      if (property._type === "NavigationProperty" && property.isCollection) {
        part += "*";
      }

      key = key ? key + "/" + part : part;
    }

    return key;
  };

  var _createFilterSelectionField = function (entityType, property, fullPropertyPath, includeHidden, converterContext) {
    var _property$annotations, _property$annotations2, _property$annotations3;

    // ignore complex property types and hidden annotated ones
    if (property !== undefined && property.targetType === undefined && (includeHidden || ((_property$annotations = property.annotations) === null || _property$annotations === void 0 ? void 0 : (_property$annotations2 = _property$annotations.UI) === null || _property$annotations2 === void 0 ? void 0 : (_property$annotations3 = _property$annotations2.Hidden) === null || _property$annotations3 === void 0 ? void 0 : _property$annotations3.valueOf()) !== true)) {
      var _property$annotations4, _property$annotations5, _property$annotations6, _property$annotations7, _property$annotations8, _targetEntityType$ann, _targetEntityType$ann2, _targetEntityType$ann3;

      var targetEntityType = converterContext.getAnnotationEntityType(property);
      return {
        key: KeyHelper.getSelectionFieldKeyFromPath(fullPropertyPath),
        annotationPath: converterContext.getAbsoluteAnnotationPath(fullPropertyPath),
        conditionPath: _getConditionPath(entityType, fullPropertyPath),
        availability: ((_property$annotations4 = property.annotations) === null || _property$annotations4 === void 0 ? void 0 : (_property$annotations5 = _property$annotations4.UI) === null || _property$annotations5 === void 0 ? void 0 : (_property$annotations6 = _property$annotations5.HiddenFilter) === null || _property$annotations6 === void 0 ? void 0 : _property$annotations6.valueOf()) === true ? AvailabilityType.Hidden : AvailabilityType.Adaptation,
        label: compileBinding(annotationExpression(((_property$annotations7 = property.annotations.Common) === null || _property$annotations7 === void 0 ? void 0 : (_property$annotations8 = _property$annotations7.Label) === null || _property$annotations8 === void 0 ? void 0 : _property$annotations8.valueOf()) || property.name)),
        group: targetEntityType.name,
        groupLabel: compileBinding(annotationExpression((targetEntityType === null || targetEntityType === void 0 ? void 0 : (_targetEntityType$ann = targetEntityType.annotations) === null || _targetEntityType$ann === void 0 ? void 0 : (_targetEntityType$ann2 = _targetEntityType$ann.Common) === null || _targetEntityType$ann2 === void 0 ? void 0 : (_targetEntityType$ann3 = _targetEntityType$ann2.Label) === null || _targetEntityType$ann3 === void 0 ? void 0 : _targetEntityType$ann3.valueOf()) || targetEntityType.name))
      };
    }

    return undefined;
  };

  var _getSelectionFields = function (entityType, navigationPath, properties, includeHidden, converterContext) {
    var selectionFieldMap = {};

    if (properties) {
      properties.forEach(function (property) {
        var propertyPath = property.name;
        var fullPath = (navigationPath ? navigationPath + "/" : "") + propertyPath;

        var selectionField = _createFilterSelectionField(entityType, property, fullPath, includeHidden, converterContext);

        if (selectionField) {
          selectionFieldMap[fullPath] = selectionField;
        }
      });
    }

    return selectionFieldMap;
  };

  var _getSelectionFieldsByPath = function (entityType, propertyPaths, includeHidden, converterContext) {
    var selectionFields = {};

    if (propertyPaths) {
      propertyPaths.forEach(function (propertyPath) {
        var localSelectionFields;
        var property = entityType.resolvePath(propertyPath);

        if (property === undefined) {
          return;
        }

        if (property._type === "NavigationProperty") {
          // handle navigation properties
          localSelectionFields = _getSelectionFields(entityType, propertyPath, property.targetType.entityProperties, includeHidden, converterContext);
        } else if (property.targetType !== undefined) {
          // handle ComplexType properties
          localSelectionFields = _getSelectionFields(entityType, propertyPath, property.targetType.properties, includeHidden, converterContext);
        } else {
          var navigationPath = propertyPath.includes("/") ? propertyPath.split("/").splice(0, 1).join("/") : "";
          localSelectionFields = _getSelectionFields(entityType, navigationPath, [property], includeHidden, converterContext);
        }

        selectionFields = _objectSpread(_objectSpread({}, selectionFields), localSelectionFields);
      });
    }

    return selectionFields;
  };

  var _getFilterField = function (filterFields, propertyPath, converterContext, entityType) {
    var filterField = filterFields[propertyPath];

    if (filterField) {
      delete filterFields[propertyPath];
    } else {
      filterField = _createFilterSelectionField(entityType, entityType.resolvePath(propertyPath), propertyPath, true, converterContext);
    }

    if (!filterField) {
      converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.High, IssueType.MISSING_SELECTIONFIELD);
    } // defined SelectionFields are available by default


    if (filterField) {
      var _entityType$annotatio, _entityType$annotatio2;

      filterField.availability = AvailabilityType.Default;
      filterField.isParameter = !!((_entityType$annotatio = entityType.annotations) !== null && _entityType$annotatio !== void 0 && (_entityType$annotatio2 = _entityType$annotatio.Common) !== null && _entityType$annotatio2 !== void 0 && _entityType$annotatio2.ResultContext);
    }

    return filterField;
  };

  var _getDefaultFilterFields = function (filterFields, aSelectOptions, entityType, converterContext, excludedFilterProperties, annotatedSelectionFields) {
    var selectionFields = [];
    var UISelectionFields = {};
    var properties = entityType.entityProperties; // Using entityType instead of entitySet

    annotatedSelectionFields === null || annotatedSelectionFields === void 0 ? void 0 : annotatedSelectionFields.forEach(function (SelectionField) {
      UISelectionFields[SelectionField.value] = true;
    });

    if (aSelectOptions && aSelectOptions.length > 0) {
      aSelectOptions === null || aSelectOptions === void 0 ? void 0 : aSelectOptions.forEach(function (selectOption) {
        var propertyName = selectOption.PropertyName;
        var sPropertyPath = propertyName.value;
        var UISelectionFields = {};
        annotatedSelectionFields === null || annotatedSelectionFields === void 0 ? void 0 : annotatedSelectionFields.forEach(function (SelectionField) {
          UISelectionFields[SelectionField.value] = true;
        });

        if (!(sPropertyPath in excludedFilterProperties)) {
          if (!(sPropertyPath in UISelectionFields)) {
            var _FilterField = _getFilterField(filterFields, sPropertyPath, converterContext, entityType);

            if (_FilterField) {
              selectionFields.push(_FilterField);
            }
          }
        }
      });
    } else if (properties) {
      properties.forEach(function (property) {
        var _property$annotations9, _property$annotations10;

        var defaultFilterValue = (_property$annotations9 = property.annotations) === null || _property$annotations9 === void 0 ? void 0 : (_property$annotations10 = _property$annotations9.Common) === null || _property$annotations10 === void 0 ? void 0 : _property$annotations10.FilterDefaultValue;
        var PropertyPath = property.name;

        if (!(PropertyPath in excludedFilterProperties)) {
          if (defaultFilterValue && !(PropertyPath in UISelectionFields)) {
            var _FilterField2 = _getFilterField(filterFields, PropertyPath, converterContext, entityType);

            if (_FilterField2) {
              selectionFields.push(_FilterField2);
            }
          }
        }
      });
    }

    return selectionFields;
  };
  /**
   * Get all Parameter filterFields in case of a parameterized service.
   * @param {ConverterContext} converterContext
   * @returns {FilterField[]} An array of parameter filterfields
   */


  function _getParameterFields(converterContext) {
    var _parameterEntityType$, _parameterEntityType$2;

    var dataModelObjectPath = converterContext.getDataModelObjectPath();
    var parameterEntityType = dataModelObjectPath.startingEntitySet.entityType;
    var isParameterized = !!((_parameterEntityType$ = parameterEntityType.annotations) !== null && _parameterEntityType$ !== void 0 && (_parameterEntityType$2 = _parameterEntityType$.Common) !== null && _parameterEntityType$2 !== void 0 && _parameterEntityType$2.ResultContext);
    var parameterConverterContext = isParameterized && converterContext.getConverterContextFor("/" + dataModelObjectPath.startingEntitySet.name);
    var parameterFields = parameterConverterContext ? parameterEntityType.entityProperties.map(function (property) {
      return _getFilterField({}, property.name, parameterConverterContext, parameterEntityType);
    }) : [];
    return parameterFields;
  }
  /**
   * Determines if the FilterBar search field is hidden or not.
   *
   * @param {TableVisualization[]} listReportTables The list report tables
   * @param {ConverterContext} converterContext The converter context
   * @returns {boolean} The information if the FilterBar search field is hidden or not
   */


  var getFilterBarhideBasicSearch = function (listReportTables, converterContext) {
    if (converterContext.getManifestWrapper().hasMultipleVisualizations() || converterContext.getTemplateType() === TemplateType.AnalyticalListPage) {
      return true;
    } // Tries to find a non-analytical table with the main entity set (page entity set) as collection
    // if at least one table matches these conditions, basic search field must be displayed.


    var sContextPath = converterContext.getContextPath();
    return checkAllTableForEntitySetAreAnalytical(listReportTables, sContextPath);
  };
  /**
   * Retrieves filter fields from the manifest.
   *
   * @param entityType The current entityType
   * @param converterContext The converter context
   * @returns {Record<string, CustomElementFilterField>} The filter fields defined in the manifest
   */


  _exports.getFilterBarhideBasicSearch = getFilterBarhideBasicSearch;

  var getManifestFilterFields = function (entityType, converterContext) {
    var fbConfig = converterContext.getManifestWrapper().getFilterConfiguration();
    var definedFilterFields = (fbConfig === null || fbConfig === void 0 ? void 0 : fbConfig.filterFields) || {};

    var selectionFields = _getSelectionFieldsByPath(entityType, Object.keys(definedFilterFields).map(function (key) {
      return KeyHelper.getPathFromSelectionFieldKey(key);
    }), true, converterContext);

    var filterFields = {};

    for (var sKey in definedFilterFields) {
      var filterField = definedFilterFields[sKey];
      var propertyName = KeyHelper.getPathFromSelectionFieldKey(sKey);
      var selectionField = selectionFields[propertyName];
      var visualFilter = getVisualFilters(entityType, converterContext, sKey, definedFilterFields);
      filterFields[sKey] = {
        key: sKey,
        annotationPath: selectionField === null || selectionField === void 0 ? void 0 : selectionField.annotationPath,
        conditionPath: (selectionField === null || selectionField === void 0 ? void 0 : selectionField.conditionPath) || propertyName,
        template: filterField.template,
        label: filterField.label,
        position: filterField.position || {
          placement: Placement.After
        },
        availability: filterField.availability || AvailabilityType.Default,
        settings: filterField.settings,
        visualFilter: visualFilter
      };
    }

    return filterFields;
  };

  _exports.getManifestFilterFields = getManifestFilterFields;

  var getFilterField = function (propertyPath, converterContext, entityType) {
    return _getFilterField({}, propertyPath, converterContext, entityType);
  };
  /**
   * Retrieve the configuration for the selection fields that will be used within the filter bar
   * This configuration takes into account annotation and the selection variants.
   *
   * @param {ConverterContext} converterContext
   * @param {TableVisualization[]} lrTables
   * @param {string} annotationPath
   * @returns {FilterSelectionField[]} An array of selection fields
   */


  _exports.getFilterField = getFilterField;

  var getSelectionFields = function (converterContext) {
    var _entityType$annotatio3, _converterContext$get, _entityType$annotatio4, _entityType$annotatio5;

    var lrTables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var annotationPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
    // Fetch all selectionVariants defined in the different visualizations and different views (multi table mode)
    var selectionVariants = getSelectionVariants(lrTables, converterContext); // create a map of properties to be used in selection variants

    var excludedFilterProperties = getExcludedFilterProperties(selectionVariants);
    var entityType = converterContext.getEntityType();
    var filterFacets = (_entityType$annotatio3 = entityType.annotations.UI) === null || _entityType$annotatio3 === void 0 ? void 0 : _entityType$annotatio3.FilterFacets;
    var filterFacetMap = {};
    var aFieldGroups = converterContext.getAnnotationsByTerm("UI", "com.sap.vocabularies.UI.v1.FieldGroup");

    if (filterFacets === undefined || filterFacets.length < 0) {
      for (var i in aFieldGroups) {
        filterFacetMap = _objectSpread(_objectSpread({}, filterFacetMap), getFieldGroupFilterGroups(aFieldGroups[i]));
      }
    } else {
      filterFacetMap = filterFacets.reduce(function (previousValue, filterFacet) {
        for (var _i = 0; _i < filterFacet.Target.$target.Data.length; _i++) {
          var _filterFacet$ID, _filterFacet$Label;

          previousValue[filterFacet.Target.$target.Data[_i].Value.path] = {
            group: filterFacet === null || filterFacet === void 0 ? void 0 : (_filterFacet$ID = filterFacet.ID) === null || _filterFacet$ID === void 0 ? void 0 : _filterFacet$ID.toString(),
            groupLabel: filterFacet === null || filterFacet === void 0 ? void 0 : (_filterFacet$Label = filterFacet.Label) === null || _filterFacet$Label === void 0 ? void 0 : _filterFacet$Label.toString()
          };
        }

        return previousValue;
      }, {});
    }

    var aSelectOptions = [];
    var selectionVariant = getSelectionVariant(entityType, converterContext);

    if (selectionVariant) {
      aSelectOptions = selectionVariant.SelectOptions;
    } // create a map of all potential filter fields based on...


    var filterFields = _objectSpread(_objectSpread({}, _getSelectionFields(entityType, "", entityType.entityProperties, false, converterContext)), _getSelectionFieldsByPath(entityType, converterContext.getManifestWrapper().getFilterConfiguration().navigationProperties, false, converterContext)); //Filters which has to be added which is part of SV/Default annotations but not present in the SelectionFields


    var annotatedSelectionFields = annotationPath && ((_converterContext$get = converterContext.getEntityTypeAnnotation(annotationPath)) === null || _converterContext$get === void 0 ? void 0 : _converterContext$get.annotation) || ((_entityType$annotatio4 = entityType.annotations) === null || _entityType$annotatio4 === void 0 ? void 0 : (_entityType$annotatio5 = _entityType$annotatio4.UI) === null || _entityType$annotatio5 === void 0 ? void 0 : _entityType$annotatio5.SelectionFields) || [];

    var defaultFilters = _getDefaultFilterFields(filterFields, aSelectOptions, entityType, converterContext, excludedFilterProperties, annotatedSelectionFields);

    var parameterFields = _getParameterFields(converterContext); // finally create final list of filter fields by adding the SelectionFields first (order matters)...


    var allFilters = parameterFields.concat((annotatedSelectionFields === null || annotatedSelectionFields === void 0 ? void 0 : annotatedSelectionFields.reduce(function (selectionFields, selectionField) {
      var propertyPath = selectionField.value;

      if (!(propertyPath in excludedFilterProperties)) {
        var filterField = _getFilterField(filterFields, propertyPath, converterContext, entityType);

        if (filterField) {
          filterField.group = "";
          filterField.groupLabel = "";
          selectionFields.push(filterField);
        }
      }

      return selectionFields;
    }, [])) || []) // To add the FilterField which is not part of the Selection Fields but the property is mentioned in the Selection Variant
    .concat(defaultFilters || []) // ...and adding remaining filter fields, that are not used in a SelectionVariant (order doesn't matter)
    .concat(Object.keys(filterFields).filter(function (propertyPath) {
      return !(propertyPath in excludedFilterProperties);
    }).map(function (propertyPath) {
      return Object.assign(filterFields[propertyPath], filterFacetMap[propertyPath]);
    }));
    var sContextPath = converterContext.getContextPath(); //if all tables are analytical tables "aggregatable" properties must be excluded

    if (checkAllTableForEntitySetAreAnalytical(lrTables, sContextPath)) {
      // Currently all agregates are root entity properties (no properties coming from navigation) and all
      // tables with same entitySet gets same aggreagte configuration that's why we can use first table into
      // LR to get aggregates (without currency/unit properties since we expect to be able to filter them).
      var aggregates = lrTables[0].aggregates;

      if (aggregates) {
        var aggregatableProperties = Object.keys(aggregates).map(function (aggregateKey) {
          return aggregates[aggregateKey].relativePath;
        });
        allFilters = allFilters.filter(function (filterField) {
          return aggregatableProperties.indexOf(filterField.key) === -1;
        });
      }
    }

    var selectionFields = insertCustomElements(allFilters, getManifestFilterFields(entityType, converterContext), {
      "availability": "overwrite",
      label: "overwrite",
      position: "overwrite",
      template: "overwrite",
      settings: "overwrite",
      visualFilter: "overwrite"
    }); // Add caseSensitive property to all selection fields.

    var isCaseSensitive = isFilteringCaseSensitive(converterContext);
    selectionFields.forEach(function (filterField) {
      filterField.caseSensitive = isCaseSensitive;
    });
    return selectionFields;
  };

  _exports.getSelectionFields = getSelectionFields;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZpbHRlckJhci50cyJdLCJuYW1lcyI6WyJnZXRGaWVsZEdyb3VwRmlsdGVyR3JvdXBzIiwiZmllbGRHcm91cCIsImZpbHRlckZhY2V0TWFwIiwiRGF0YSIsImZvckVhY2giLCJkYXRhRmllbGQiLCIkVHlwZSIsIlZhbHVlIiwicGF0aCIsImdyb3VwIiwiZnVsbHlRdWFsaWZpZWROYW1lIiwiZ3JvdXBMYWJlbCIsImNvbXBpbGVCaW5kaW5nIiwiYW5ub3RhdGlvbkV4cHJlc3Npb24iLCJMYWJlbCIsImFubm90YXRpb25zIiwiQ29tbW9uIiwicXVhbGlmaWVyIiwiZ2V0RXhjbHVkZWRGaWx0ZXJQcm9wZXJ0aWVzIiwic2VsZWN0aW9uVmFyaWFudHMiLCJyZWR1Y2UiLCJwcmV2aW91c1ZhbHVlIiwic2VsZWN0aW9uVmFyaWFudCIsInByb3BlcnR5TmFtZXMiLCJwcm9wZXJ0eU5hbWUiLCJjaGVja0FsbFRhYmxlRm9yRW50aXR5U2V0QXJlQW5hbHl0aWNhbCIsImxpc3RSZXBvcnRUYWJsZXMiLCJjb250ZXh0UGF0aCIsImxlbmd0aCIsImV2ZXJ5IiwidmlzdWFsaXphdGlvbiIsImVuYWJsZUFuYWx5dGljcyIsImFubm90YXRpb24iLCJjb2xsZWN0aW9uIiwiZ2V0U2VsZWN0aW9uVmFyaWFudHMiLCJsclRhYmxlVmlzdWFsaXphdGlvbnMiLCJjb252ZXJ0ZXJDb250ZXh0Iiwic2VsZWN0aW9uVmFyaWFudFBhdGhzIiwibWFwIiwidGFibGVGaWx0ZXJzIiwiY29udHJvbCIsImZpbHRlcnMiLCJ0YWJsZVNWQ29uZmlncyIsImtleSIsIkFycmF5IiwiaXNBcnJheSIsInBhdGhzIiwiYW5ub3RhdGlvblBhdGgiLCJpbmRleE9mIiwicHVzaCIsInNlbGVjdGlvblZhcmlhbnRDb25maWciLCJnZXRTZWxlY3Rpb25WYXJpYW50Q29uZmlndXJhdGlvbiIsInN2Q29uZmlncyIsImNvbmNhdCIsIl9nZXRDb25kaXRpb25QYXRoIiwiZW50aXR5VHlwZSIsInByb3BlcnR5UGF0aCIsInBhcnRzIiwic3BsaXQiLCJwYXJ0aWFsUGF0aCIsInBhcnQiLCJzaGlmdCIsInByb3BlcnR5IiwicmVzb2x2ZVBhdGgiLCJfdHlwZSIsImlzQ29sbGVjdGlvbiIsIl9jcmVhdGVGaWx0ZXJTZWxlY3Rpb25GaWVsZCIsImZ1bGxQcm9wZXJ0eVBhdGgiLCJpbmNsdWRlSGlkZGVuIiwidW5kZWZpbmVkIiwidGFyZ2V0VHlwZSIsIlVJIiwiSGlkZGVuIiwidmFsdWVPZiIsInRhcmdldEVudGl0eVR5cGUiLCJnZXRBbm5vdGF0aW9uRW50aXR5VHlwZSIsIktleUhlbHBlciIsImdldFNlbGVjdGlvbkZpZWxkS2V5RnJvbVBhdGgiLCJnZXRBYnNvbHV0ZUFubm90YXRpb25QYXRoIiwiY29uZGl0aW9uUGF0aCIsImF2YWlsYWJpbGl0eSIsIkhpZGRlbkZpbHRlciIsIkF2YWlsYWJpbGl0eVR5cGUiLCJBZGFwdGF0aW9uIiwibGFiZWwiLCJuYW1lIiwiX2dldFNlbGVjdGlvbkZpZWxkcyIsIm5hdmlnYXRpb25QYXRoIiwicHJvcGVydGllcyIsInNlbGVjdGlvbkZpZWxkTWFwIiwiZnVsbFBhdGgiLCJzZWxlY3Rpb25GaWVsZCIsIl9nZXRTZWxlY3Rpb25GaWVsZHNCeVBhdGgiLCJwcm9wZXJ0eVBhdGhzIiwic2VsZWN0aW9uRmllbGRzIiwibG9jYWxTZWxlY3Rpb25GaWVsZHMiLCJlbnRpdHlQcm9wZXJ0aWVzIiwiaW5jbHVkZXMiLCJzcGxpY2UiLCJqb2luIiwiX2dldEZpbHRlckZpZWxkIiwiZmlsdGVyRmllbGRzIiwiZmlsdGVyRmllbGQiLCJnZXREaWFnbm9zdGljcyIsImFkZElzc3VlIiwiSXNzdWVDYXRlZ29yeSIsIkFubm90YXRpb24iLCJJc3N1ZVNldmVyaXR5IiwiSGlnaCIsIklzc3VlVHlwZSIsIk1JU1NJTkdfU0VMRUNUSU9ORklFTEQiLCJEZWZhdWx0IiwiaXNQYXJhbWV0ZXIiLCJSZXN1bHRDb250ZXh0IiwiX2dldERlZmF1bHRGaWx0ZXJGaWVsZHMiLCJhU2VsZWN0T3B0aW9ucyIsImV4Y2x1ZGVkRmlsdGVyUHJvcGVydGllcyIsImFubm90YXRlZFNlbGVjdGlvbkZpZWxkcyIsIlVJU2VsZWN0aW9uRmllbGRzIiwiU2VsZWN0aW9uRmllbGQiLCJ2YWx1ZSIsInNlbGVjdE9wdGlvbiIsIlByb3BlcnR5TmFtZSIsInNQcm9wZXJ0eVBhdGgiLCJGaWx0ZXJGaWVsZCIsImRlZmF1bHRGaWx0ZXJWYWx1ZSIsIkZpbHRlckRlZmF1bHRWYWx1ZSIsIlByb3BlcnR5UGF0aCIsIl9nZXRQYXJhbWV0ZXJGaWVsZHMiLCJkYXRhTW9kZWxPYmplY3RQYXRoIiwiZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCIsInBhcmFtZXRlckVudGl0eVR5cGUiLCJzdGFydGluZ0VudGl0eVNldCIsImlzUGFyYW1ldGVyaXplZCIsInBhcmFtZXRlckNvbnZlcnRlckNvbnRleHQiLCJnZXRDb252ZXJ0ZXJDb250ZXh0Rm9yIiwicGFyYW1ldGVyRmllbGRzIiwiZ2V0RmlsdGVyQmFyaGlkZUJhc2ljU2VhcmNoIiwiZ2V0TWFuaWZlc3RXcmFwcGVyIiwiaGFzTXVsdGlwbGVWaXN1YWxpemF0aW9ucyIsImdldFRlbXBsYXRlVHlwZSIsIlRlbXBsYXRlVHlwZSIsIkFuYWx5dGljYWxMaXN0UGFnZSIsInNDb250ZXh0UGF0aCIsImdldENvbnRleHRQYXRoIiwiZ2V0TWFuaWZlc3RGaWx0ZXJGaWVsZHMiLCJmYkNvbmZpZyIsImdldEZpbHRlckNvbmZpZ3VyYXRpb24iLCJkZWZpbmVkRmlsdGVyRmllbGRzIiwiT2JqZWN0Iiwia2V5cyIsImdldFBhdGhGcm9tU2VsZWN0aW9uRmllbGRLZXkiLCJzS2V5IiwidmlzdWFsRmlsdGVyIiwiZ2V0VmlzdWFsRmlsdGVycyIsInRlbXBsYXRlIiwicG9zaXRpb24iLCJwbGFjZW1lbnQiLCJQbGFjZW1lbnQiLCJBZnRlciIsInNldHRpbmdzIiwiZ2V0RmlsdGVyRmllbGQiLCJnZXRTZWxlY3Rpb25GaWVsZHMiLCJsclRhYmxlcyIsImdldEVudGl0eVR5cGUiLCJmaWx0ZXJGYWNldHMiLCJGaWx0ZXJGYWNldHMiLCJhRmllbGRHcm91cHMiLCJnZXRBbm5vdGF0aW9uc0J5VGVybSIsImkiLCJmaWx0ZXJGYWNldCIsIlRhcmdldCIsIiR0YXJnZXQiLCJJRCIsInRvU3RyaW5nIiwiZ2V0U2VsZWN0aW9uVmFyaWFudCIsIlNlbGVjdE9wdGlvbnMiLCJuYXZpZ2F0aW9uUHJvcGVydGllcyIsImdldEVudGl0eVR5cGVBbm5vdGF0aW9uIiwiU2VsZWN0aW9uRmllbGRzIiwiZGVmYXVsdEZpbHRlcnMiLCJhbGxGaWx0ZXJzIiwiZmlsdGVyIiwiYXNzaWduIiwiYWdncmVnYXRlcyIsImFnZ3JlZ2F0YWJsZVByb3BlcnRpZXMiLCJhZ2dyZWdhdGVLZXkiLCJyZWxhdGl2ZVBhdGgiLCJpbnNlcnRDdXN0b21FbGVtZW50cyIsImlzQ2FzZVNlbnNpdGl2ZSIsImlzRmlsdGVyaW5nQ2FzZVNlbnNpdGl2ZSIsImNhc2VTZW5zaXRpdmUiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVNBLHlCQUFULENBQW1DQyxVQUFuQyxFQUE0RztBQUMzRyxRQUFNQyxjQUEyQyxHQUFHLEVBQXBEO0FBQ0FELElBQUFBLFVBQVUsQ0FBQ0UsSUFBWCxDQUFnQkMsT0FBaEIsQ0FBd0IsVUFBQ0MsU0FBRCxFQUF1QztBQUM5RCxVQUFJQSxTQUFTLENBQUNDLEtBQVYsS0FBb0Isc0NBQXhCLEVBQWdFO0FBQUE7O0FBQy9ESixRQUFBQSxjQUFjLENBQUNHLFNBQVMsQ0FBQ0UsS0FBVixDQUFnQkMsSUFBakIsQ0FBZCxHQUF1QztBQUN0Q0MsVUFBQUEsS0FBSyxFQUFFUixVQUFVLENBQUNTLGtCQURvQjtBQUV0Q0MsVUFBQUEsVUFBVSxFQUNUQyxjQUFjLENBQ2JDLG9CQUFvQixDQUFDWixVQUFVLENBQUNhLEtBQVgsOEJBQW9CYixVQUFVLENBQUNjLFdBQS9CLG9GQUFvQixzQkFBd0JDLE1BQTVDLDJEQUFvQix1QkFB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LFVBQUQsRUFBYXBDLHVCQUF1QixDQUFDMUYsVUFBRCxFQUFhbkIsZ0JBQWIsQ0FBcEMsRUFBb0U7QUFDL0csc0JBQWdCLFdBRCtGO0FBRS9HZ0QsTUFBQUEsS0FBSyxFQUFFLFdBRndHO0FBRy9Hd0UsTUFBQUEsUUFBUSxFQUFFLFdBSHFHO0FBSS9HRCxNQUFBQSxRQUFRLEVBQUUsV0FKcUc7QUFLL0dLLE1BQUFBLFFBQVEsRUFBRSxXQUxxRztBQU0vR1AsTUFBQUEsWUFBWSxFQUFFO0FBTmlHLEtBQXBFLENBQTVDLENBMUdnQixDQW1IaEI7O0FBQ0EsUUFBTW9DLGVBQWUsR0FBR0Msd0JBQXdCLENBQUMxSixnQkFBRCxDQUFoRDtBQUNBMEQsSUFBQUEsZUFBZSxDQUFDMUYsT0FBaEIsQ0FBd0IsVUFBQWtHLFdBQVcsRUFBSTtBQUN0Q0EsTUFBQUEsV0FBVyxDQUFDeUYsYUFBWixHQUE0QkYsZUFBNUI7QUFDQSxLQUZEO0FBSUEsV0FBTy9GLGVBQVA7QUFDQSxHQTlITSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0QXZhaWxhYmlsaXR5VHlwZSxcblx0RmlsdGVyRmllbGRNYW5pZmVzdENvbmZpZ3VyYXRpb24sXG5cdEZpbHRlck1hbmlmZXN0Q29uZmlndXJhdGlvbixcblx0RmlsdGVyU2V0dGluZ3MsXG5cdFRlbXBsYXRlVHlwZVxufSBmcm9tIFwiLi4vLi4vTWFuaWZlc3RTZXR0aW5nc1wiO1xuaW1wb3J0IHsgRW50aXR5VHlwZSwgTmF2aWdhdGlvblByb3BlcnR5LCBQcm9wZXJ0eSB9IGZyb20gXCJAc2FwLXV4L2Fubm90YXRpb24tY29udmVydGVyXCI7XG5pbXBvcnQgQ29udmVydGVyQ29udGV4dCBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9Db252ZXJ0ZXJDb250ZXh0XCI7XG5pbXBvcnQgeyBBbm5vdGF0aW9uVGVybSwgRGF0YUZpZWxkQWJzdHJhY3RUeXBlcywgRGF0YUZpZWxkVHlwZXMsIFJlZmVyZW5jZUZhY2V0VHlwZXMsIFVJQW5ub3RhdGlvblRlcm1zIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5pbXBvcnQge1xuXHRnZXRTZWxlY3Rpb25WYXJpYW50Q29uZmlndXJhdGlvbixcblx0U2VsZWN0aW9uVmFyaWFudENvbmZpZ3VyYXRpb24sXG5cdFRhYmxlVmlzdWFsaXphdGlvbixcblx0aXNGaWx0ZXJpbmdDYXNlU2Vuc2l0aXZlXG59IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9UYWJsZVwiO1xuaW1wb3J0IHsgQ29uZmlndXJhYmxlT2JqZWN0LCBDdXN0b21FbGVtZW50LCBpbnNlcnRDdXN0b21FbGVtZW50cywgUGxhY2VtZW50IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9Db25maWd1cmFibGVPYmplY3RcIjtcbmltcG9ydCB7IGdldFZpc3VhbEZpbHRlcnMsIFZpc3VhbEZpbHRlcnMgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9jb250cm9scy9MaXN0UmVwb3J0L1Zpc3VhbEZpbHRlcnNcIjtcbmltcG9ydCB7IFNlbGVjdE9wdGlvblR5cGUsIEZpZWxkR3JvdXBUeXBlLCBGaWVsZEdyb3VwIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL2Rpc3QvZ2VuZXJhdGVkL1VJXCI7XG5pbXBvcnQgeyBhbm5vdGF0aW9uRXhwcmVzc2lvbiwgY29tcGlsZUJpbmRpbmcgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nRXhwcmVzc2lvblwiO1xuaW1wb3J0IHsgZ2V0U2VsZWN0aW9uVmFyaWFudCB9IGZyb20gXCIuLi9Db21tb24vRGF0YVZpc3VhbGl6YXRpb25cIjtcbmltcG9ydCB7IEtleUhlbHBlciB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvS2V5XCI7XG5pbXBvcnQgeyBJc3N1ZVR5cGUsIElzc3VlU2V2ZXJpdHksIElzc3VlQ2F0ZWdvcnkgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0lzc3VlTWFuYWdlclwiO1xuaW1wb3J0IHsgUHJvcGVydHlQYXRoIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL2Rpc3QvRWRtXCI7XG5cbmV4cG9ydCB0eXBlIEZpbHRlckZpZWxkID0gQ29uZmlndXJhYmxlT2JqZWN0ICYge1xuXHRjb25kaXRpb25QYXRoOiBzdHJpbmc7XG5cdGF2YWlsYWJpbGl0eTogQXZhaWxhYmlsaXR5VHlwZTtcblx0YW5ub3RhdGlvblBhdGg6IHN0cmluZztcblx0bGFiZWw/OiBzdHJpbmc7XG5cdHRlbXBsYXRlPzogc3RyaW5nO1xuXHRncm91cD86IHN0cmluZztcblx0Z3JvdXBMYWJlbD86IHN0cmluZztcblx0c2V0dGluZ3M/OiBGaWx0ZXJTZXR0aW5ncztcblx0aXNQYXJhbWV0ZXI/OiBib29sZWFuO1xuXHR2aXN1YWxGaWx0ZXI/OiBWaXN1YWxGaWx0ZXJzO1xuXHRjYXNlU2Vuc2l0aXZlPzogYm9vbGVhbjtcbn07XG5cbnR5cGUgRmlsdGVyR3JvdXAgPSB7XG5cdGdyb3VwPzogc3RyaW5nO1xuXHRncm91cExhYmVsPzogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgQ3VzdG9tRWxlbWVudEZpbHRlckZpZWxkID0gQ3VzdG9tRWxlbWVudDxGaWx0ZXJGaWVsZD47XG5cbi8qKlxuICogRW50ZXIgYWxsIERhdGFGaWVsZHMgb2YgYSBnaXZlbiBGaWVsZEdyb3VwIGludG8gdGhlIGZpbHRlckZhY2V0TWFwLlxuICpcbiAqIEBwYXJhbSB7QW5ub3RhdGlvblRlcm08RmllbGRHcm91cFR5cGU+fSBmaWVsZEdyb3VwXG4gKiBAcmV0dXJucyB7UmVjb3JkPHN0cmluZywgRmlsdGVyR3JvdXA+fSBUaGUgbWFwIG9mIGZhY2V0cyBmb3IgdGhlIGdpdmVuIGZpZWxkR3JvdXBcbiAqL1xuZnVuY3Rpb24gZ2V0RmllbGRHcm91cEZpbHRlckdyb3VwcyhmaWVsZEdyb3VwOiBBbm5vdGF0aW9uVGVybTxGaWVsZEdyb3VwVHlwZT4pOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJHcm91cD4ge1xuXHRjb25zdCBmaWx0ZXJGYWNldE1hcDogUmVjb3JkPHN0cmluZywgRmlsdGVyR3JvdXA+ID0ge307XG5cdGZpZWxkR3JvdXAuRGF0YS5mb3JFYWNoKChkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMpID0+IHtcblx0XHRpZiAoZGF0YUZpZWxkLiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZFwiKSB7XG5cdFx0XHRmaWx0ZXJGYWNldE1hcFtkYXRhRmllbGQuVmFsdWUucGF0aF0gPSB7XG5cdFx0XHRcdGdyb3VwOiBmaWVsZEdyb3VwLmZ1bGx5UXVhbGlmaWVkTmFtZSxcblx0XHRcdFx0Z3JvdXBMYWJlbDpcblx0XHRcdFx0XHRjb21waWxlQmluZGluZyhcblx0XHRcdFx0XHRcdGFubm90YXRpb25FeHByZXNzaW9uKGZpZWxkR3JvdXAuTGFiZWwgfHwgZmllbGRHcm91cC5hbm5vdGF0aW9ucz8uQ29tbW9uPy5MYWJlbCB8fCBmaWVsZEdyb3VwLnF1YWxpZmllcilcblx0XHRcdFx0XHQpIHx8IGZpZWxkR3JvdXAucXVhbGlmaWVyXG5cdFx0XHR9O1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiBmaWx0ZXJGYWNldE1hcDtcbn1cblxuZnVuY3Rpb24gZ2V0RXhjbHVkZWRGaWx0ZXJQcm9wZXJ0aWVzKHNlbGVjdGlvblZhcmlhbnRzOiBTZWxlY3Rpb25WYXJpYW50Q29uZmlndXJhdGlvbltdKTogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4ge1xuXHRyZXR1cm4gc2VsZWN0aW9uVmFyaWFudHMucmVkdWNlKChwcmV2aW91c1ZhbHVlOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiwgc2VsZWN0aW9uVmFyaWFudCkgPT4ge1xuXHRcdHNlbGVjdGlvblZhcmlhbnQucHJvcGVydHlOYW1lcy5mb3JFYWNoKHByb3BlcnR5TmFtZSA9PiB7XG5cdFx0XHRwcmV2aW91c1ZhbHVlW3Byb3BlcnR5TmFtZV0gPSB0cnVlO1xuXHRcdH0pO1xuXHRcdHJldHVybiBwcmV2aW91c1ZhbHVlO1xuXHR9LCB7fSk7XG59XG5cbi8qKlxuICogQ2hlY2sgdGhhdCBhbGwgdGhlIHRhYmxlcyBmb3IgYSBkZWRpY2F0ZWQgZW50aXR5c2V0IGFyZSBjb25maWd1cmVkIGFzIGFuYWx5dGljYWwgdGFibGUuXG4gKiBAcGFyYW0ge1RhYmxlVmlzdWFsaXphdGlvbltdfSBsaXN0UmVwb3J0VGFibGVzIExpc3QgUmVwb3J0IHRhYmxlc1xuICogQHBhcmFtIHtzdHJpbmd9IGNvbnRleHRQYXRoXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gSXMgRmlsdGVyQmFyIHNlYXJjaCBmaWVsZCBoaWRkZW4gb3Igbm90XG4gKi9cbmZ1bmN0aW9uIGNoZWNrQWxsVGFibGVGb3JFbnRpdHlTZXRBcmVBbmFseXRpY2FsKGxpc3RSZXBvcnRUYWJsZXM6IFRhYmxlVmlzdWFsaXphdGlvbltdLCBjb250ZXh0UGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkKSB7XG5cdGlmIChjb250ZXh0UGF0aCAmJiBsaXN0UmVwb3J0VGFibGVzLmxlbmd0aCA+IDApIHtcblx0XHRyZXR1cm4gbGlzdFJlcG9ydFRhYmxlcy5ldmVyeSh2aXN1YWxpemF0aW9uID0+IHtcblx0XHRcdHJldHVybiB2aXN1YWxpemF0aW9uLmVuYWJsZUFuYWx5dGljcyAmJiBjb250ZXh0UGF0aCA9PT0gdmlzdWFsaXphdGlvbi5hbm5vdGF0aW9uLmNvbGxlY3Rpb247XG5cdFx0fSk7XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBnZXRTZWxlY3Rpb25WYXJpYW50cyhcblx0bHJUYWJsZVZpc3VhbGl6YXRpb25zOiBUYWJsZVZpc3VhbGl6YXRpb25bXSxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogU2VsZWN0aW9uVmFyaWFudENvbmZpZ3VyYXRpb25bXSB7XG5cdGNvbnN0IHNlbGVjdGlvblZhcmlhbnRQYXRoczogc3RyaW5nW10gPSBbXTtcblx0cmV0dXJuIGxyVGFibGVWaXN1YWxpemF0aW9uc1xuXHRcdC5tYXAodmlzdWFsaXphdGlvbiA9PiB7XG5cdFx0XHRjb25zdCB0YWJsZUZpbHRlcnMgPSB2aXN1YWxpemF0aW9uLmNvbnRyb2wuZmlsdGVycztcblx0XHRcdGNvbnN0IHRhYmxlU1ZDb25maWdzOiBTZWxlY3Rpb25WYXJpYW50Q29uZmlndXJhdGlvbltdID0gW107XG5cdFx0XHRmb3IgKGNvbnN0IGtleSBpbiB0YWJsZUZpbHRlcnMpIHtcblx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkodGFibGVGaWx0ZXJzW2tleV0ucGF0aHMpKSB7XG5cdFx0XHRcdFx0Y29uc3QgcGF0aHMgPSB0YWJsZUZpbHRlcnNba2V5XS5wYXRocztcblx0XHRcdFx0XHRwYXRocy5mb3JFYWNoKHBhdGggPT4ge1xuXHRcdFx0XHRcdFx0aWYgKHBhdGggJiYgcGF0aC5hbm5vdGF0aW9uUGF0aCAmJiBzZWxlY3Rpb25WYXJpYW50UGF0aHMuaW5kZXhPZihwYXRoLmFubm90YXRpb25QYXRoKSA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0c2VsZWN0aW9uVmFyaWFudFBhdGhzLnB1c2gocGF0aC5hbm5vdGF0aW9uUGF0aCk7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHNlbGVjdGlvblZhcmlhbnRDb25maWcgPSBnZXRTZWxlY3Rpb25WYXJpYW50Q29uZmlndXJhdGlvbihwYXRoLmFubm90YXRpb25QYXRoLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0XHRcdFx0XHRcdFx0aWYgKHNlbGVjdGlvblZhcmlhbnRDb25maWcpIHtcblx0XHRcdFx0XHRcdFx0XHR0YWJsZVNWQ29uZmlncy5wdXNoKHNlbGVjdGlvblZhcmlhbnRDb25maWcpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0YWJsZVNWQ29uZmlncztcblx0XHR9KVxuXHRcdC5yZWR1Y2UoKHN2Q29uZmlncywgc2VsZWN0aW9uVmFyaWFudCkgPT4gc3ZDb25maWdzLmNvbmNhdChzZWxlY3Rpb25WYXJpYW50KSwgW10pO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGNvbmRpdGlvbiBwYXRoIHJlcXVpcmVkIGZvciB0aGUgY29uZGl0aW9uIG1vZGVsLiBJdCBsb29rcyBsaWtlIGZvbGxvdzpcbiAqIDwxOk4tUHJvcGVydHlOYW1lPipcXC88MToxLVByb3BlcnR5TmFtZT4vPFByb3BlcnR5TmFtZT4uXG4gKlxuICogQHBhcmFtIGVudGl0eVR5cGUgVGhlIHJvb3QgRW50aXR5VHlbZVxuICogQHBhcmFtIHByb3BlcnR5UGF0aCBUaGUgZnVsbCBwYXRoIHRvIHRoZSB0YXJnZXQgcHJvcGVydHlcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgY29uZGl0aW9uIHBhdGhcbiAqL1xuY29uc3QgX2dldENvbmRpdGlvblBhdGggPSBmdW5jdGlvbihlbnRpdHlUeXBlOiBFbnRpdHlUeXBlLCBwcm9wZXJ0eVBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG5cdGNvbnN0IHBhcnRzID0gcHJvcGVydHlQYXRoLnNwbGl0KFwiL1wiKTtcblx0bGV0IHBhcnRpYWxQYXRoO1xuXHRsZXQga2V5ID0gXCJcIjtcblx0d2hpbGUgKHBhcnRzLmxlbmd0aCkge1xuXHRcdGxldCBwYXJ0ID0gcGFydHMuc2hpZnQoKSBhcyBzdHJpbmc7XG5cdFx0cGFydGlhbFBhdGggPSBwYXJ0aWFsUGF0aCA/IHBhcnRpYWxQYXRoICsgXCIvXCIgKyBwYXJ0IDogcGFydDtcblx0XHRjb25zdCBwcm9wZXJ0eTogUHJvcGVydHkgfCBOYXZpZ2F0aW9uUHJvcGVydHkgPSBlbnRpdHlUeXBlLnJlc29sdmVQYXRoKHBhcnRpYWxQYXRoKTtcblx0XHRpZiAocHJvcGVydHkuX3R5cGUgPT09IFwiTmF2aWdhdGlvblByb3BlcnR5XCIgJiYgcHJvcGVydHkuaXNDb2xsZWN0aW9uKSB7XG5cdFx0XHRwYXJ0ICs9IFwiKlwiO1xuXHRcdH1cblx0XHRrZXkgPSBrZXkgPyBrZXkgKyBcIi9cIiArIHBhcnQgOiBwYXJ0O1xuXHR9XG5cdHJldHVybiBrZXk7XG59O1xuXG5jb25zdCBfY3JlYXRlRmlsdGVyU2VsZWN0aW9uRmllbGQgPSBmdW5jdGlvbihcblx0ZW50aXR5VHlwZTogRW50aXR5VHlwZSxcblx0cHJvcGVydHk6IFByb3BlcnR5LFxuXHRmdWxsUHJvcGVydHlQYXRoOiBzdHJpbmcsXG5cdGluY2x1ZGVIaWRkZW46IGJvb2xlYW4sXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IEZpbHRlckZpZWxkIHwgdW5kZWZpbmVkIHtcblx0Ly8gaWdub3JlIGNvbXBsZXggcHJvcGVydHkgdHlwZXMgYW5kIGhpZGRlbiBhbm5vdGF0ZWQgb25lc1xuXHRpZiAoXG5cdFx0cHJvcGVydHkgIT09IHVuZGVmaW5lZCAmJlxuXHRcdHByb3BlcnR5LnRhcmdldFR5cGUgPT09IHVuZGVmaW5lZCAmJlxuXHRcdChpbmNsdWRlSGlkZGVuIHx8IHByb3BlcnR5LmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgIT09IHRydWUpXG5cdCkge1xuXHRcdGNvbnN0IHRhcmdldEVudGl0eVR5cGUgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEFubm90YXRpb25FbnRpdHlUeXBlKHByb3BlcnR5KTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0a2V5OiBLZXlIZWxwZXIuZ2V0U2VsZWN0aW9uRmllbGRLZXlGcm9tUGF0aChmdWxsUHJvcGVydHlQYXRoKSxcblx0XHRcdGFubm90YXRpb25QYXRoOiBjb252ZXJ0ZXJDb250ZXh0LmdldEFic29sdXRlQW5ub3RhdGlvblBhdGgoZnVsbFByb3BlcnR5UGF0aCksXG5cdFx0XHRjb25kaXRpb25QYXRoOiBfZ2V0Q29uZGl0aW9uUGF0aChlbnRpdHlUeXBlLCBmdWxsUHJvcGVydHlQYXRoKSxcblx0XHRcdGF2YWlsYWJpbGl0eTpcblx0XHRcdFx0cHJvcGVydHkuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW5GaWx0ZXI/LnZhbHVlT2YoKSA9PT0gdHJ1ZSA/IEF2YWlsYWJpbGl0eVR5cGUuSGlkZGVuIDogQXZhaWxhYmlsaXR5VHlwZS5BZGFwdGF0aW9uLFxuXHRcdFx0bGFiZWw6IGNvbXBpbGVCaW5kaW5nKGFubm90YXRpb25FeHByZXNzaW9uKHByb3BlcnR5LmFubm90YXRpb25zLkNvbW1vbj8uTGFiZWw/LnZhbHVlT2YoKSB8fCBwcm9wZXJ0eS5uYW1lKSksXG5cdFx0XHRncm91cDogdGFyZ2V0RW50aXR5VHlwZS5uYW1lLFxuXHRcdFx0Z3JvdXBMYWJlbDogY29tcGlsZUJpbmRpbmcoXG5cdFx0XHRcdGFubm90YXRpb25FeHByZXNzaW9uKHRhcmdldEVudGl0eVR5cGU/LmFubm90YXRpb25zPy5Db21tb24/LkxhYmVsPy52YWx1ZU9mKCkgfHwgdGFyZ2V0RW50aXR5VHlwZS5uYW1lKVxuXHRcdFx0KVxuXHRcdH07XG5cdH1cblx0cmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbmNvbnN0IF9nZXRTZWxlY3Rpb25GaWVsZHMgPSBmdW5jdGlvbihcblx0ZW50aXR5VHlwZTogRW50aXR5VHlwZSxcblx0bmF2aWdhdGlvblBhdGg6IHN0cmluZyxcblx0cHJvcGVydGllczogQXJyYXk8UHJvcGVydHk+IHwgdW5kZWZpbmVkLFxuXHRpbmNsdWRlSGlkZGVuOiBib29sZWFuLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJGaWVsZD4ge1xuXHRjb25zdCBzZWxlY3Rpb25GaWVsZE1hcDogUmVjb3JkPHN0cmluZywgRmlsdGVyRmllbGQ+ID0ge307XG5cdGlmIChwcm9wZXJ0aWVzKSB7XG5cdFx0cHJvcGVydGllcy5mb3JFYWNoKChwcm9wZXJ0eTogUHJvcGVydHkpID0+IHtcblx0XHRcdGNvbnN0IHByb3BlcnR5UGF0aDogc3RyaW5nID0gcHJvcGVydHkubmFtZTtcblx0XHRcdGNvbnN0IGZ1bGxQYXRoOiBzdHJpbmcgPSAobmF2aWdhdGlvblBhdGggPyBuYXZpZ2F0aW9uUGF0aCArIFwiL1wiIDogXCJcIikgKyBwcm9wZXJ0eVBhdGg7XG5cdFx0XHRjb25zdCBzZWxlY3Rpb25GaWVsZCA9IF9jcmVhdGVGaWx0ZXJTZWxlY3Rpb25GaWVsZChlbnRpdHlUeXBlLCBwcm9wZXJ0eSwgZnVsbFBhdGgsIGluY2x1ZGVIaWRkZW4sIGNvbnZlcnRlckNvbnRleHQpO1xuXHRcdFx0aWYgKHNlbGVjdGlvbkZpZWxkKSB7XG5cdFx0XHRcdHNlbGVjdGlvbkZpZWxkTWFwW2Z1bGxQYXRoXSA9IHNlbGVjdGlvbkZpZWxkO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBzZWxlY3Rpb25GaWVsZE1hcDtcbn07XG5cbmNvbnN0IF9nZXRTZWxlY3Rpb25GaWVsZHNCeVBhdGggPSBmdW5jdGlvbihcblx0ZW50aXR5VHlwZTogRW50aXR5VHlwZSxcblx0cHJvcGVydHlQYXRoczogQXJyYXk8c3RyaW5nPiB8IHVuZGVmaW5lZCxcblx0aW5jbHVkZUhpZGRlbjogYm9vbGVhbixcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogUmVjb3JkPHN0cmluZywgRmlsdGVyRmllbGQ+IHtcblx0bGV0IHNlbGVjdGlvbkZpZWxkczogUmVjb3JkPHN0cmluZywgRmlsdGVyRmllbGQ+ID0ge307XG5cdGlmIChwcm9wZXJ0eVBhdGhzKSB7XG5cdFx0cHJvcGVydHlQYXRocy5mb3JFYWNoKChwcm9wZXJ0eVBhdGg6IHN0cmluZykgPT4ge1xuXHRcdFx0bGV0IGxvY2FsU2VsZWN0aW9uRmllbGRzOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJGaWVsZD47XG5cblx0XHRcdGNvbnN0IHByb3BlcnR5OiBQcm9wZXJ0eSB8IE5hdmlnYXRpb25Qcm9wZXJ0eSA9IGVudGl0eVR5cGUucmVzb2x2ZVBhdGgocHJvcGVydHlQYXRoKTtcblx0XHRcdGlmIChwcm9wZXJ0eSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGlmIChwcm9wZXJ0eS5fdHlwZSA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIikge1xuXHRcdFx0XHQvLyBoYW5kbGUgbmF2aWdhdGlvbiBwcm9wZXJ0aWVzXG5cdFx0XHRcdGxvY2FsU2VsZWN0aW9uRmllbGRzID0gX2dldFNlbGVjdGlvbkZpZWxkcyhcblx0XHRcdFx0XHRlbnRpdHlUeXBlLFxuXHRcdFx0XHRcdHByb3BlcnR5UGF0aCxcblx0XHRcdFx0XHRwcm9wZXJ0eS50YXJnZXRUeXBlLmVudGl0eVByb3BlcnRpZXMsXG5cdFx0XHRcdFx0aW5jbHVkZUhpZGRlbixcblx0XHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHRcdCk7XG5cdFx0XHR9IGVsc2UgaWYgKHByb3BlcnR5LnRhcmdldFR5cGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHQvLyBoYW5kbGUgQ29tcGxleFR5cGUgcHJvcGVydGllc1xuXHRcdFx0XHRsb2NhbFNlbGVjdGlvbkZpZWxkcyA9IF9nZXRTZWxlY3Rpb25GaWVsZHMoXG5cdFx0XHRcdFx0ZW50aXR5VHlwZSxcblx0XHRcdFx0XHRwcm9wZXJ0eVBhdGgsXG5cdFx0XHRcdFx0cHJvcGVydHkudGFyZ2V0VHlwZS5wcm9wZXJ0aWVzLFxuXHRcdFx0XHRcdGluY2x1ZGVIaWRkZW4sXG5cdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0XHQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgbmF2aWdhdGlvblBhdGggPSBwcm9wZXJ0eVBhdGguaW5jbHVkZXMoXCIvXCIpXG5cdFx0XHRcdFx0PyBwcm9wZXJ0eVBhdGhcblx0XHRcdFx0XHRcdFx0LnNwbGl0KFwiL1wiKVxuXHRcdFx0XHRcdFx0XHQuc3BsaWNlKDAsIDEpXG5cdFx0XHRcdFx0XHRcdC5qb2luKFwiL1wiKVxuXHRcdFx0XHRcdDogXCJcIjtcblx0XHRcdFx0bG9jYWxTZWxlY3Rpb25GaWVsZHMgPSBfZ2V0U2VsZWN0aW9uRmllbGRzKGVudGl0eVR5cGUsIG5hdmlnYXRpb25QYXRoLCBbcHJvcGVydHldLCBpbmNsdWRlSGlkZGVuLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0XHRcdH1cblxuXHRcdFx0c2VsZWN0aW9uRmllbGRzID0ge1xuXHRcdFx0XHQuLi5zZWxlY3Rpb25GaWVsZHMsXG5cdFx0XHRcdC4uLmxvY2FsU2VsZWN0aW9uRmllbGRzXG5cdFx0XHR9O1xuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBzZWxlY3Rpb25GaWVsZHM7XG59O1xuXG5jb25zdCBfZ2V0RmlsdGVyRmllbGQgPSBmdW5jdGlvbihcblx0ZmlsdGVyRmllbGRzOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJGaWVsZD4sXG5cdHByb3BlcnR5UGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRlbnRpdHlUeXBlOiBFbnRpdHlUeXBlXG4pOiBGaWx0ZXJGaWVsZCB8IHVuZGVmaW5lZCB7XG5cdGxldCBmaWx0ZXJGaWVsZDogRmlsdGVyRmllbGQgfCB1bmRlZmluZWQgPSBmaWx0ZXJGaWVsZHNbcHJvcGVydHlQYXRoXTtcblx0aWYgKGZpbHRlckZpZWxkKSB7XG5cdFx0ZGVsZXRlIGZpbHRlckZpZWxkc1twcm9wZXJ0eVBhdGhdO1xuXHR9IGVsc2Uge1xuXHRcdGZpbHRlckZpZWxkID0gX2NyZWF0ZUZpbHRlclNlbGVjdGlvbkZpZWxkKGVudGl0eVR5cGUsIGVudGl0eVR5cGUucmVzb2x2ZVBhdGgocHJvcGVydHlQYXRoKSwgcHJvcGVydHlQYXRoLCB0cnVlLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0fVxuXHRpZiAoIWZpbHRlckZpZWxkKSB7XG5cdFx0Y29udmVydGVyQ29udGV4dC5nZXREaWFnbm9zdGljcygpLmFkZElzc3VlKElzc3VlQ2F0ZWdvcnkuQW5ub3RhdGlvbiwgSXNzdWVTZXZlcml0eS5IaWdoLCBJc3N1ZVR5cGUuTUlTU0lOR19TRUxFQ1RJT05GSUVMRCk7XG5cdH1cblx0Ly8gZGVmaW5lZCBTZWxlY3Rpb25GaWVsZHMgYXJlIGF2YWlsYWJsZSBieSBkZWZhdWx0XG5cdGlmIChmaWx0ZXJGaWVsZCkge1xuXHRcdGZpbHRlckZpZWxkLmF2YWlsYWJpbGl0eSA9IEF2YWlsYWJpbGl0eVR5cGUuRGVmYXVsdDtcblx0XHRmaWx0ZXJGaWVsZC5pc1BhcmFtZXRlciA9ICEhZW50aXR5VHlwZS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5SZXN1bHRDb250ZXh0O1xuXHR9XG5cdHJldHVybiBmaWx0ZXJGaWVsZDtcbn07XG5cbmNvbnN0IF9nZXREZWZhdWx0RmlsdGVyRmllbGRzID0gZnVuY3Rpb24oXG5cdGZpbHRlckZpZWxkczogUmVjb3JkPHN0cmluZywgRmlsdGVyRmllbGQ+LFxuXHRhU2VsZWN0T3B0aW9uczogYW55W10sXG5cdGVudGl0eVR5cGU6IEVudGl0eVR5cGUsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGV4Y2x1ZGVkRmlsdGVyUHJvcGVydGllczogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4sXG5cdGFubm90YXRlZFNlbGVjdGlvbkZpZWxkczogUHJvcGVydHlQYXRoW11cbik6IEZpbHRlckZpZWxkW10ge1xuXHRjb25zdCBzZWxlY3Rpb25GaWVsZHM6IEZpbHRlckZpZWxkW10gPSBbXTtcblx0Y29uc3QgVUlTZWxlY3Rpb25GaWVsZHM6IGFueSA9IHt9O1xuXHRjb25zdCBwcm9wZXJ0aWVzID0gZW50aXR5VHlwZS5lbnRpdHlQcm9wZXJ0aWVzO1xuXHQvLyBVc2luZyBlbnRpdHlUeXBlIGluc3RlYWQgb2YgZW50aXR5U2V0XG5cdGFubm90YXRlZFNlbGVjdGlvbkZpZWxkcz8uZm9yRWFjaChTZWxlY3Rpb25GaWVsZCA9PiB7XG5cdFx0VUlTZWxlY3Rpb25GaWVsZHNbU2VsZWN0aW9uRmllbGQudmFsdWVdID0gdHJ1ZTtcblx0fSk7XG5cdGlmIChhU2VsZWN0T3B0aW9ucyAmJiBhU2VsZWN0T3B0aW9ucy5sZW5ndGggPiAwKSB7XG5cdFx0YVNlbGVjdE9wdGlvbnM/LmZvckVhY2goKHNlbGVjdE9wdGlvbjogU2VsZWN0T3B0aW9uVHlwZSkgPT4ge1xuXHRcdFx0Y29uc3QgcHJvcGVydHlOYW1lOiBhbnkgPSBzZWxlY3RPcHRpb24uUHJvcGVydHlOYW1lO1xuXHRcdFx0Y29uc3Qgc1Byb3BlcnR5UGF0aDogc3RyaW5nID0gcHJvcGVydHlOYW1lLnZhbHVlO1xuXHRcdFx0Y29uc3QgVUlTZWxlY3Rpb25GaWVsZHM6IGFueSA9IHt9O1xuXHRcdFx0YW5ub3RhdGVkU2VsZWN0aW9uRmllbGRzPy5mb3JFYWNoKFNlbGVjdGlvbkZpZWxkID0+IHtcblx0XHRcdFx0VUlTZWxlY3Rpb25GaWVsZHNbU2VsZWN0aW9uRmllbGQudmFsdWVdID0gdHJ1ZTtcblx0XHRcdH0pO1xuXHRcdFx0aWYgKCEoc1Byb3BlcnR5UGF0aCBpbiBleGNsdWRlZEZpbHRlclByb3BlcnRpZXMpKSB7XG5cdFx0XHRcdGlmICghKHNQcm9wZXJ0eVBhdGggaW4gVUlTZWxlY3Rpb25GaWVsZHMpKSB7XG5cdFx0XHRcdFx0Y29uc3QgRmlsdGVyRmllbGQ6IEZpbHRlckZpZWxkIHwgdW5kZWZpbmVkID0gX2dldEZpbHRlckZpZWxkKGZpbHRlckZpZWxkcywgc1Byb3BlcnR5UGF0aCwgY29udmVydGVyQ29udGV4dCwgZW50aXR5VHlwZSk7XG5cdFx0XHRcdFx0aWYgKEZpbHRlckZpZWxkKSB7XG5cdFx0XHRcdFx0XHRzZWxlY3Rpb25GaWVsZHMucHVzaChGaWx0ZXJGaWVsZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0gZWxzZSBpZiAocHJvcGVydGllcykge1xuXHRcdHByb3BlcnRpZXMuZm9yRWFjaCgocHJvcGVydHk6IFByb3BlcnR5KSA9PiB7XG5cdFx0XHRjb25zdCBkZWZhdWx0RmlsdGVyVmFsdWUgPSBwcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5GaWx0ZXJEZWZhdWx0VmFsdWU7XG5cdFx0XHRjb25zdCBQcm9wZXJ0eVBhdGggPSBwcm9wZXJ0eS5uYW1lO1xuXHRcdFx0aWYgKCEoUHJvcGVydHlQYXRoIGluIGV4Y2x1ZGVkRmlsdGVyUHJvcGVydGllcykpIHtcblx0XHRcdFx0aWYgKGRlZmF1bHRGaWx0ZXJWYWx1ZSAmJiAhKFByb3BlcnR5UGF0aCBpbiBVSVNlbGVjdGlvbkZpZWxkcykpIHtcblx0XHRcdFx0XHRjb25zdCBGaWx0ZXJGaWVsZDogRmlsdGVyRmllbGQgfCB1bmRlZmluZWQgPSBfZ2V0RmlsdGVyRmllbGQoZmlsdGVyRmllbGRzLCBQcm9wZXJ0eVBhdGgsIGNvbnZlcnRlckNvbnRleHQsIGVudGl0eVR5cGUpO1xuXHRcdFx0XHRcdGlmIChGaWx0ZXJGaWVsZCkge1xuXHRcdFx0XHRcdFx0c2VsZWN0aW9uRmllbGRzLnB1c2goRmlsdGVyRmllbGQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBzZWxlY3Rpb25GaWVsZHM7XG59O1xuXG4vKipcbiAqIEdldCBhbGwgUGFyYW1ldGVyIGZpbHRlckZpZWxkcyBpbiBjYXNlIG9mIGEgcGFyYW1ldGVyaXplZCBzZXJ2aWNlLlxuICogQHBhcmFtIHtDb252ZXJ0ZXJDb250ZXh0fSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcmV0dXJucyB7RmlsdGVyRmllbGRbXX0gQW4gYXJyYXkgb2YgcGFyYW1ldGVyIGZpbHRlcmZpZWxkc1xuICovXG5mdW5jdGlvbiBfZ2V0UGFyYW1ldGVyRmllbGRzKGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBGaWx0ZXJGaWVsZFtdIHtcblx0Y29uc3QgZGF0YU1vZGVsT2JqZWN0UGF0aCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpO1xuXHRjb25zdCBwYXJhbWV0ZXJFbnRpdHlUeXBlID0gZGF0YU1vZGVsT2JqZWN0UGF0aC5zdGFydGluZ0VudGl0eVNldC5lbnRpdHlUeXBlO1xuXHRjb25zdCBpc1BhcmFtZXRlcml6ZWQgPSAhIXBhcmFtZXRlckVudGl0eVR5cGUuYW5ub3RhdGlvbnM/LkNvbW1vbj8uUmVzdWx0Q29udGV4dDtcblx0Y29uc3QgcGFyYW1ldGVyQ29udmVydGVyQ29udGV4dCA9XG5cdFx0aXNQYXJhbWV0ZXJpemVkICYmIGNvbnZlcnRlckNvbnRleHQuZ2V0Q29udmVydGVyQ29udGV4dEZvcihcIi9cIiArIGRhdGFNb2RlbE9iamVjdFBhdGguc3RhcnRpbmdFbnRpdHlTZXQubmFtZSk7XG5cblx0Y29uc3QgcGFyYW1ldGVyRmllbGRzID0gKHBhcmFtZXRlckNvbnZlcnRlckNvbnRleHRcblx0XHQ/IHBhcmFtZXRlckVudGl0eVR5cGUuZW50aXR5UHJvcGVydGllcy5tYXAoZnVuY3Rpb24ocHJvcGVydHkpIHtcblx0XHRcdFx0cmV0dXJuIF9nZXRGaWx0ZXJGaWVsZCh7fSBhcyBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJGaWVsZD4sIHByb3BlcnR5Lm5hbWUsIHBhcmFtZXRlckNvbnZlcnRlckNvbnRleHQsIHBhcmFtZXRlckVudGl0eVR5cGUpO1xuXHRcdCAgfSlcblx0XHQ6IFtdKSBhcyBGaWx0ZXJGaWVsZFtdO1xuXG5cdHJldHVybiBwYXJhbWV0ZXJGaWVsZHM7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpZiB0aGUgRmlsdGVyQmFyIHNlYXJjaCBmaWVsZCBpcyBoaWRkZW4gb3Igbm90LlxuICpcbiAqIEBwYXJhbSB7VGFibGVWaXN1YWxpemF0aW9uW119IGxpc3RSZXBvcnRUYWJsZXMgVGhlIGxpc3QgcmVwb3J0IHRhYmxlc1xuICogQHBhcmFtIHtDb252ZXJ0ZXJDb250ZXh0fSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHJldHVybnMge2Jvb2xlYW59IFRoZSBpbmZvcm1hdGlvbiBpZiB0aGUgRmlsdGVyQmFyIHNlYXJjaCBmaWVsZCBpcyBoaWRkZW4gb3Igbm90XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRGaWx0ZXJCYXJoaWRlQmFzaWNTZWFyY2ggPSBmdW5jdGlvbihsaXN0UmVwb3J0VGFibGVzOiBUYWJsZVZpc3VhbGl6YXRpb25bXSwgY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IGJvb2xlYW4ge1xuXHRpZiAoXG5cdFx0Y29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKS5oYXNNdWx0aXBsZVZpc3VhbGl6YXRpb25zKCkgfHxcblx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBUZW1wbGF0ZVR5cGUuQW5hbHl0aWNhbExpc3RQYWdlXG5cdCkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdC8vIFRyaWVzIHRvIGZpbmQgYSBub24tYW5hbHl0aWNhbCB0YWJsZSB3aXRoIHRoZSBtYWluIGVudGl0eSBzZXQgKHBhZ2UgZW50aXR5IHNldCkgYXMgY29sbGVjdGlvblxuXHQvLyBpZiBhdCBsZWFzdCBvbmUgdGFibGUgbWF0Y2hlcyB0aGVzZSBjb25kaXRpb25zLCBiYXNpYyBzZWFyY2ggZmllbGQgbXVzdCBiZSBkaXNwbGF5ZWQuXG5cdGNvbnN0IHNDb250ZXh0UGF0aCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0Q29udGV4dFBhdGgoKTtcblx0cmV0dXJuIGNoZWNrQWxsVGFibGVGb3JFbnRpdHlTZXRBcmVBbmFseXRpY2FsKGxpc3RSZXBvcnRUYWJsZXMsIHNDb250ZXh0UGF0aCk7XG59O1xuXG4vKipcbiAqIFJldHJpZXZlcyBmaWx0ZXIgZmllbGRzIGZyb20gdGhlIG1hbmlmZXN0LlxuICpcbiAqIEBwYXJhbSBlbnRpdHlUeXBlIFRoZSBjdXJyZW50IGVudGl0eVR5cGVcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHJldHVybnMge1JlY29yZDxzdHJpbmcsIEN1c3RvbUVsZW1lbnRGaWx0ZXJGaWVsZD59IFRoZSBmaWx0ZXIgZmllbGRzIGRlZmluZWQgaW4gdGhlIG1hbmlmZXN0XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRNYW5pZmVzdEZpbHRlckZpZWxkcyA9IGZ1bmN0aW9uKFxuXHRlbnRpdHlUeXBlOiBFbnRpdHlUeXBlLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21FbGVtZW50RmlsdGVyRmllbGQ+IHtcblx0Y29uc3QgZmJDb25maWc6IEZpbHRlck1hbmlmZXN0Q29uZmlndXJhdGlvbiA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCkuZ2V0RmlsdGVyQ29uZmlndXJhdGlvbigpO1xuXHRjb25zdCBkZWZpbmVkRmlsdGVyRmllbGRzOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJGaWVsZE1hbmlmZXN0Q29uZmlndXJhdGlvbj4gPSBmYkNvbmZpZz8uZmlsdGVyRmllbGRzIHx8IHt9O1xuXHRjb25zdCBzZWxlY3Rpb25GaWVsZHM6IFJlY29yZDxzdHJpbmcsIEZpbHRlckZpZWxkPiA9IF9nZXRTZWxlY3Rpb25GaWVsZHNCeVBhdGgoXG5cdFx0ZW50aXR5VHlwZSxcblx0XHRPYmplY3Qua2V5cyhkZWZpbmVkRmlsdGVyRmllbGRzKS5tYXAoa2V5ID0+IEtleUhlbHBlci5nZXRQYXRoRnJvbVNlbGVjdGlvbkZpZWxkS2V5KGtleSkpLFxuXHRcdHRydWUsXG5cdFx0Y29udmVydGVyQ29udGV4dFxuXHQpO1xuXHRjb25zdCBmaWx0ZXJGaWVsZHM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUVsZW1lbnRGaWx0ZXJGaWVsZD4gPSB7fTtcblxuXHRmb3IgKGNvbnN0IHNLZXkgaW4gZGVmaW5lZEZpbHRlckZpZWxkcykge1xuXHRcdGNvbnN0IGZpbHRlckZpZWxkID0gZGVmaW5lZEZpbHRlckZpZWxkc1tzS2V5XTtcblx0XHRjb25zdCBwcm9wZXJ0eU5hbWUgPSBLZXlIZWxwZXIuZ2V0UGF0aEZyb21TZWxlY3Rpb25GaWVsZEtleShzS2V5KTtcblx0XHRjb25zdCBzZWxlY3Rpb25GaWVsZCA9IHNlbGVjdGlvbkZpZWxkc1twcm9wZXJ0eU5hbWVdO1xuXHRcdGNvbnN0IHZpc3VhbEZpbHRlciA9IGdldFZpc3VhbEZpbHRlcnMoZW50aXR5VHlwZSwgY29udmVydGVyQ29udGV4dCwgc0tleSwgZGVmaW5lZEZpbHRlckZpZWxkcyk7XG5cdFx0ZmlsdGVyRmllbGRzW3NLZXldID0ge1xuXHRcdFx0a2V5OiBzS2V5LFxuXHRcdFx0YW5ub3RhdGlvblBhdGg6IHNlbGVjdGlvbkZpZWxkPy5hbm5vdGF0aW9uUGF0aCxcblx0XHRcdGNvbmRpdGlvblBhdGg6IHNlbGVjdGlvbkZpZWxkPy5jb25kaXRpb25QYXRoIHx8IHByb3BlcnR5TmFtZSxcblx0XHRcdHRlbXBsYXRlOiBmaWx0ZXJGaWVsZC50ZW1wbGF0ZSxcblx0XHRcdGxhYmVsOiBmaWx0ZXJGaWVsZC5sYWJlbCxcblx0XHRcdHBvc2l0aW9uOiBmaWx0ZXJGaWVsZC5wb3NpdGlvbiB8fCB7IHBsYWNlbWVudDogUGxhY2VtZW50LkFmdGVyIH0sXG5cdFx0XHRhdmFpbGFiaWxpdHk6IGZpbHRlckZpZWxkLmF2YWlsYWJpbGl0eSB8fCBBdmFpbGFiaWxpdHlUeXBlLkRlZmF1bHQsXG5cdFx0XHRzZXR0aW5nczogZmlsdGVyRmllbGQuc2V0dGluZ3MsXG5cdFx0XHR2aXN1YWxGaWx0ZXI6IHZpc3VhbEZpbHRlclxuXHRcdH07XG5cdH1cblx0cmV0dXJuIGZpbHRlckZpZWxkcztcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRGaWx0ZXJGaWVsZCA9IGZ1bmN0aW9uKHByb3BlcnR5UGF0aDogc3RyaW5nLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LCBlbnRpdHlUeXBlOiBFbnRpdHlUeXBlKSB7XG5cdHJldHVybiBfZ2V0RmlsdGVyRmllbGQoe30sIHByb3BlcnR5UGF0aCwgY29udmVydGVyQ29udGV4dCwgZW50aXR5VHlwZSk7XG59O1xuXG4vKipcbiAqIFJldHJpZXZlIHRoZSBjb25maWd1cmF0aW9uIGZvciB0aGUgc2VsZWN0aW9uIGZpZWxkcyB0aGF0IHdpbGwgYmUgdXNlZCB3aXRoaW4gdGhlIGZpbHRlciBiYXJcbiAqIFRoaXMgY29uZmlndXJhdGlvbiB0YWtlcyBpbnRvIGFjY291bnQgYW5ub3RhdGlvbiBhbmQgdGhlIHNlbGVjdGlvbiB2YXJpYW50cy5cbiAqXG4gKiBAcGFyYW0ge0NvbnZlcnRlckNvbnRleHR9IGNvbnZlcnRlckNvbnRleHRcbiAqIEBwYXJhbSB7VGFibGVWaXN1YWxpemF0aW9uW119IGxyVGFibGVzXG4gKiBAcGFyYW0ge3N0cmluZ30gYW5ub3RhdGlvblBhdGhcbiAqIEByZXR1cm5zIHtGaWx0ZXJTZWxlY3Rpb25GaWVsZFtdfSBBbiBhcnJheSBvZiBzZWxlY3Rpb24gZmllbGRzXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRTZWxlY3Rpb25GaWVsZHMgPSBmdW5jdGlvbihcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0bHJUYWJsZXM6IFRhYmxlVmlzdWFsaXphdGlvbltdID0gW10sXG5cdGFubm90YXRpb25QYXRoOiBzdHJpbmcgPSBcIlwiXG4pOiBGaWx0ZXJGaWVsZFtdIHtcblx0Ly8gRmV0Y2ggYWxsIHNlbGVjdGlvblZhcmlhbnRzIGRlZmluZWQgaW4gdGhlIGRpZmZlcmVudCB2aXN1YWxpemF0aW9ucyBhbmQgZGlmZmVyZW50IHZpZXdzIChtdWx0aSB0YWJsZSBtb2RlKVxuXHRjb25zdCBzZWxlY3Rpb25WYXJpYW50czogU2VsZWN0aW9uVmFyaWFudENvbmZpZ3VyYXRpb25bXSA9IGdldFNlbGVjdGlvblZhcmlhbnRzKGxyVGFibGVzLCBjb252ZXJ0ZXJDb250ZXh0KTtcblxuXHQvLyBjcmVhdGUgYSBtYXAgb2YgcHJvcGVydGllcyB0byBiZSB1c2VkIGluIHNlbGVjdGlvbiB2YXJpYW50c1xuXHRjb25zdCBleGNsdWRlZEZpbHRlclByb3BlcnRpZXM6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+ID0gZ2V0RXhjbHVkZWRGaWx0ZXJQcm9wZXJ0aWVzKHNlbGVjdGlvblZhcmlhbnRzKTtcblx0Y29uc3QgZW50aXR5VHlwZSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpO1xuXHRjb25zdCBmaWx0ZXJGYWNldHMgPSBlbnRpdHlUeXBlLmFubm90YXRpb25zLlVJPy5GaWx0ZXJGYWNldHM7XG5cdGxldCBmaWx0ZXJGYWNldE1hcDogUmVjb3JkPHN0cmluZywgRmlsdGVyR3JvdXA+ID0ge307XG5cblx0Y29uc3QgYUZpZWxkR3JvdXBzID0gY29udmVydGVyQ29udGV4dC5nZXRBbm5vdGF0aW9uc0J5VGVybShcIlVJXCIsIFVJQW5ub3RhdGlvblRlcm1zLkZpZWxkR3JvdXApO1xuXG5cdGlmIChmaWx0ZXJGYWNldHMgPT09IHVuZGVmaW5lZCB8fCBmaWx0ZXJGYWNldHMubGVuZ3RoIDwgMCkge1xuXHRcdGZvciAoY29uc3QgaSBpbiBhRmllbGRHcm91cHMpIHtcblx0XHRcdGZpbHRlckZhY2V0TWFwID0ge1xuXHRcdFx0XHQuLi5maWx0ZXJGYWNldE1hcCxcblx0XHRcdFx0Li4uZ2V0RmllbGRHcm91cEZpbHRlckdyb3VwcyhhRmllbGRHcm91cHNbaV0gYXMgQW5ub3RhdGlvblRlcm08RmllbGRHcm91cFR5cGU+KVxuXHRcdFx0fTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0ZmlsdGVyRmFjZXRNYXAgPSBmaWx0ZXJGYWNldHMucmVkdWNlKChwcmV2aW91c1ZhbHVlOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJHcm91cD4sIGZpbHRlckZhY2V0OiBSZWZlcmVuY2VGYWNldFR5cGVzKSA9PiB7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IChmaWx0ZXJGYWNldC5UYXJnZXQuJHRhcmdldCBhcyBGaWVsZEdyb3VwKS5EYXRhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHByZXZpb3VzVmFsdWVbKChmaWx0ZXJGYWNldC5UYXJnZXQuJHRhcmdldCBhcyBGaWVsZEdyb3VwKS5EYXRhW2ldIGFzIERhdGFGaWVsZFR5cGVzKS5WYWx1ZS5wYXRoXSA9IHtcblx0XHRcdFx0XHRncm91cDogZmlsdGVyRmFjZXQ/LklEPy50b1N0cmluZygpLFxuXHRcdFx0XHRcdGdyb3VwTGFiZWw6IGZpbHRlckZhY2V0Py5MYWJlbD8udG9TdHJpbmcoKVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHByZXZpb3VzVmFsdWU7XG5cdFx0fSwge30pO1xuXHR9XG5cblx0bGV0IGFTZWxlY3RPcHRpb25zOiBhbnlbXSA9IFtdO1xuXHRjb25zdCBzZWxlY3Rpb25WYXJpYW50ID0gZ2V0U2VsZWN0aW9uVmFyaWFudChlbnRpdHlUeXBlLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0aWYgKHNlbGVjdGlvblZhcmlhbnQpIHtcblx0XHRhU2VsZWN0T3B0aW9ucyA9IHNlbGVjdGlvblZhcmlhbnQuU2VsZWN0T3B0aW9ucztcblx0fVxuXG5cdC8vIGNyZWF0ZSBhIG1hcCBvZiBhbGwgcG90ZW50aWFsIGZpbHRlciBmaWVsZHMgYmFzZWQgb24uLi5cblx0Y29uc3QgZmlsdGVyRmllbGRzOiBSZWNvcmQ8c3RyaW5nLCBGaWx0ZXJGaWVsZD4gPSB7XG5cdFx0Ly8gLi4ubm9uIGhpZGRlbiBwcm9wZXJ0aWVzIG9mIHRoZSBlbnRpdHlcblx0XHQuLi5fZ2V0U2VsZWN0aW9uRmllbGRzKGVudGl0eVR5cGUsIFwiXCIsIGVudGl0eVR5cGUuZW50aXR5UHJvcGVydGllcywgZmFsc2UsIGNvbnZlcnRlckNvbnRleHQpLFxuXHRcdC8vIC4uLmFkZGl0aW9uYWwgbWFuaWZlc3QgZGVmaW5lZCBuYXZpZ2F0aW9uIHByb3BlcnRpZXNcblx0XHQuLi5fZ2V0U2VsZWN0aW9uRmllbGRzQnlQYXRoKFxuXHRcdFx0ZW50aXR5VHlwZSxcblx0XHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCkuZ2V0RmlsdGVyQ29uZmlndXJhdGlvbigpLm5hdmlnYXRpb25Qcm9wZXJ0aWVzLFxuXHRcdFx0ZmFsc2UsXG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0KVxuXHR9O1xuXG5cdC8vRmlsdGVycyB3aGljaCBoYXMgdG8gYmUgYWRkZWQgd2hpY2ggaXMgcGFydCBvZiBTVi9EZWZhdWx0IGFubm90YXRpb25zIGJ1dCBub3QgcHJlc2VudCBpbiB0aGUgU2VsZWN0aW9uRmllbGRzXG5cdGNvbnN0IGFubm90YXRlZFNlbGVjdGlvbkZpZWxkcyA9ICgoYW5ub3RhdGlvblBhdGggJiYgY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlQW5ub3RhdGlvbihhbm5vdGF0aW9uUGF0aCk/LmFubm90YXRpb24pIHx8XG5cdFx0ZW50aXR5VHlwZS5hbm5vdGF0aW9ucz8uVUk/LlNlbGVjdGlvbkZpZWxkcyB8fFxuXHRcdFtdKSBhcyBQcm9wZXJ0eVBhdGhbXTtcblx0Y29uc3QgZGVmYXVsdEZpbHRlcnMgPSBfZ2V0RGVmYXVsdEZpbHRlckZpZWxkcyhcblx0XHRmaWx0ZXJGaWVsZHMsXG5cdFx0YVNlbGVjdE9wdGlvbnMsXG5cdFx0ZW50aXR5VHlwZSxcblx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdGV4Y2x1ZGVkRmlsdGVyUHJvcGVydGllcyxcblx0XHRhbm5vdGF0ZWRTZWxlY3Rpb25GaWVsZHNcblx0KTtcblx0Y29uc3QgcGFyYW1ldGVyRmllbGRzID0gX2dldFBhcmFtZXRlckZpZWxkcyhjb252ZXJ0ZXJDb250ZXh0KTtcblxuXHQvLyBmaW5hbGx5IGNyZWF0ZSBmaW5hbCBsaXN0IG9mIGZpbHRlciBmaWVsZHMgYnkgYWRkaW5nIHRoZSBTZWxlY3Rpb25GaWVsZHMgZmlyc3QgKG9yZGVyIG1hdHRlcnMpLi4uXG5cdGxldCBhbGxGaWx0ZXJzID0gcGFyYW1ldGVyRmllbGRzXG5cdFx0LmNvbmNhdChcblx0XHRcdGFubm90YXRlZFNlbGVjdGlvbkZpZWxkcz8ucmVkdWNlKChzZWxlY3Rpb25GaWVsZHM6IEZpbHRlckZpZWxkW10sIHNlbGVjdGlvbkZpZWxkKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHByb3BlcnR5UGF0aCA9IHNlbGVjdGlvbkZpZWxkLnZhbHVlO1xuXHRcdFx0XHRpZiAoIShwcm9wZXJ0eVBhdGggaW4gZXhjbHVkZWRGaWx0ZXJQcm9wZXJ0aWVzKSkge1xuXHRcdFx0XHRcdGNvbnN0IGZpbHRlckZpZWxkOiBGaWx0ZXJGaWVsZCB8IHVuZGVmaW5lZCA9IF9nZXRGaWx0ZXJGaWVsZChmaWx0ZXJGaWVsZHMsIHByb3BlcnR5UGF0aCwgY29udmVydGVyQ29udGV4dCwgZW50aXR5VHlwZSk7XG5cdFx0XHRcdFx0aWYgKGZpbHRlckZpZWxkKSB7XG5cdFx0XHRcdFx0XHRmaWx0ZXJGaWVsZC5ncm91cCA9IFwiXCI7XG5cdFx0XHRcdFx0XHRmaWx0ZXJGaWVsZC5ncm91cExhYmVsID0gXCJcIjtcblx0XHRcdFx0XHRcdHNlbGVjdGlvbkZpZWxkcy5wdXNoKGZpbHRlckZpZWxkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHNlbGVjdGlvbkZpZWxkcztcblx0XHRcdH0sIFtdKSB8fCBbXVxuXHRcdClcblx0XHQvLyBUbyBhZGQgdGhlIEZpbHRlckZpZWxkIHdoaWNoIGlzIG5vdCBwYXJ0IG9mIHRoZSBTZWxlY3Rpb24gRmllbGRzIGJ1dCB0aGUgcHJvcGVydHkgaXMgbWVudGlvbmVkIGluIHRoZSBTZWxlY3Rpb24gVmFyaWFudFxuXHRcdC5jb25jYXQoZGVmYXVsdEZpbHRlcnMgfHwgW10pXG5cdFx0Ly8gLi4uYW5kIGFkZGluZyByZW1haW5pbmcgZmlsdGVyIGZpZWxkcywgdGhhdCBhcmUgbm90IHVzZWQgaW4gYSBTZWxlY3Rpb25WYXJpYW50IChvcmRlciBkb2Vzbid0IG1hdHRlcilcblx0XHQuY29uY2F0KFxuXHRcdFx0T2JqZWN0LmtleXMoZmlsdGVyRmllbGRzKVxuXHRcdFx0XHQuZmlsdGVyKHByb3BlcnR5UGF0aCA9PiAhKHByb3BlcnR5UGF0aCBpbiBleGNsdWRlZEZpbHRlclByb3BlcnRpZXMpKVxuXHRcdFx0XHQubWFwKHByb3BlcnR5UGF0aCA9PiB7XG5cdFx0XHRcdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oZmlsdGVyRmllbGRzW3Byb3BlcnR5UGF0aF0sIGZpbHRlckZhY2V0TWFwW3Byb3BlcnR5UGF0aF0pO1xuXHRcdFx0XHR9KVxuXHRcdCk7XG5cdGNvbnN0IHNDb250ZXh0UGF0aCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0Q29udGV4dFBhdGgoKTtcblxuXHQvL2lmIGFsbCB0YWJsZXMgYXJlIGFuYWx5dGljYWwgdGFibGVzIFwiYWdncmVnYXRhYmxlXCIgcHJvcGVydGllcyBtdXN0IGJlIGV4Y2x1ZGVkXG5cdGlmIChjaGVja0FsbFRhYmxlRm9yRW50aXR5U2V0QXJlQW5hbHl0aWNhbChsclRhYmxlcywgc0NvbnRleHRQYXRoKSkge1xuXHRcdC8vIEN1cnJlbnRseSBhbGwgYWdyZWdhdGVzIGFyZSByb290IGVudGl0eSBwcm9wZXJ0aWVzIChubyBwcm9wZXJ0aWVzIGNvbWluZyBmcm9tIG5hdmlnYXRpb24pIGFuZCBhbGxcblx0XHQvLyB0YWJsZXMgd2l0aCBzYW1lIGVudGl0eVNldCBnZXRzIHNhbWUgYWdncmVhZ3RlIGNvbmZpZ3VyYXRpb24gdGhhdCdzIHdoeSB3ZSBjYW4gdXNlIGZpcnN0IHRhYmxlIGludG9cblx0XHQvLyBMUiB0byBnZXQgYWdncmVnYXRlcyAod2l0aG91dCBjdXJyZW5jeS91bml0IHByb3BlcnRpZXMgc2luY2Ugd2UgZXhwZWN0IHRvIGJlIGFibGUgdG8gZmlsdGVyIHRoZW0pLlxuXHRcdGNvbnN0IGFnZ3JlZ2F0ZXMgPSBsclRhYmxlc1swXS5hZ2dyZWdhdGVzO1xuXHRcdGlmIChhZ2dyZWdhdGVzKSB7XG5cdFx0XHRjb25zdCBhZ2dyZWdhdGFibGVQcm9wZXJ0aWVzOiBzdHJpbmdbXSA9IE9iamVjdC5rZXlzKGFnZ3JlZ2F0ZXMpLm1hcChhZ2dyZWdhdGVLZXkgPT4gYWdncmVnYXRlc1thZ2dyZWdhdGVLZXldLnJlbGF0aXZlUGF0aCk7XG5cdFx0XHRhbGxGaWx0ZXJzID0gYWxsRmlsdGVycy5maWx0ZXIoZmlsdGVyRmllbGQgPT4ge1xuXHRcdFx0XHRyZXR1cm4gYWdncmVnYXRhYmxlUHJvcGVydGllcy5pbmRleE9mKGZpbHRlckZpZWxkLmtleSkgPT09IC0xO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0Y29uc3Qgc2VsZWN0aW9uRmllbGRzID0gaW5zZXJ0Q3VzdG9tRWxlbWVudHMoYWxsRmlsdGVycywgZ2V0TWFuaWZlc3RGaWx0ZXJGaWVsZHMoZW50aXR5VHlwZSwgY29udmVydGVyQ29udGV4dCksIHtcblx0XHRcImF2YWlsYWJpbGl0eVwiOiBcIm92ZXJ3cml0ZVwiLFxuXHRcdGxhYmVsOiBcIm92ZXJ3cml0ZVwiLFxuXHRcdHBvc2l0aW9uOiBcIm92ZXJ3cml0ZVwiLFxuXHRcdHRlbXBsYXRlOiBcIm92ZXJ3cml0ZVwiLFxuXHRcdHNldHRpbmdzOiBcIm92ZXJ3cml0ZVwiLFxuXHRcdHZpc3VhbEZpbHRlcjogXCJvdmVyd3JpdGVcIlxuXHR9KTtcblxuXHQvLyBBZGQgY2FzZVNlbnNpdGl2ZSBwcm9wZXJ0eSB0byBhbGwgc2VsZWN0aW9uIGZpZWxkcy5cblx0Y29uc3QgaXNDYXNlU2Vuc2l0aXZlID0gaXNGaWx0ZXJpbmdDYXNlU2Vuc2l0aXZlKGNvbnZlcnRlckNvbnRleHQpO1xuXHRzZWxlY3Rpb25GaWVsZHMuZm9yRWFjaChmaWx0ZXJGaWVsZCA9PiB7XG5cdFx0ZmlsdGVyRmllbGQuY2FzZVNlbnNpdGl2ZSA9IGlzQ2FzZVNlbnNpdGl2ZTtcblx0fSk7XG5cblx0cmV0dXJuIHNlbGVjdGlvbkZpZWxkcztcbn07XG4iXX0=