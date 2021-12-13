/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["../../ManifestSettings", "../../helpers/ID", "sap/fe/core/converters/controls/Common/Action", "sap/fe/core/converters/helpers/ConfigurableObject", "sap/fe/core/converters/annotations/DataField", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/converters/helpers/BindingHelper", "sap/fe/core/converters/helpers/Key", "sap/fe/core/formatters/TableFormatter", "sap/fe/core/formatters/TableFormatterTypes", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/core/helpers/StableIdHelper", "sap/fe/core/converters/helpers/IssueManager", "sap/fe/core/templating/PropertyHelper", "../../helpers/Aggregation", "sap/fe/core/templating/UIFormatters", "./Criticality", "sap/fe/core/templating/EntitySetHelper"], function (ManifestSettings, ID, Action, ConfigurableObject, DataField, BindingExpression, BindingHelper, Key, tableFormatters, TableFormatterTypes, DataModelPathHelper, StableIdHelper, IssueManager, PropertyHelper, Aggregation, UIFormatters, Criticality, EntitySetHelper) {
  "use strict";

  var _exports = {};
  var getNonSortablePropertiesRestrictions = EntitySetHelper.getNonSortablePropertiesRestrictions;
  var getMessageTypeFromCriticalityType = Criticality.getMessageTypeFromCriticalityType;
  var getTypeConfig = UIFormatters.getTypeConfig;
  var getDisplayMode = UIFormatters.getDisplayMode;
  var AggregationHelper = Aggregation.AggregationHelper;
  var getTargetValueOnDataPoint = PropertyHelper.getTargetValueOnDataPoint;
  var isPathExpression = PropertyHelper.isPathExpression;
  var getAssociatedCurrencyProperty = PropertyHelper.getAssociatedCurrencyProperty;
  var getAssociatedUnitProperty = PropertyHelper.getAssociatedUnitProperty;
  var isProperty = PropertyHelper.isProperty;
  var IssueType = IssueManager.IssueType;
  var IssueSeverity = IssueManager.IssueSeverity;
  var IssueCategory = IssueManager.IssueCategory;
  var replaceSpecialChars = StableIdHelper.replaceSpecialChars;
  var isPathUpdatable = DataModelPathHelper.isPathUpdatable;
  var isPathInsertable = DataModelPathHelper.isPathInsertable;
  var isPathSearchable = DataModelPathHelper.isPathSearchable;
  var isPathDeletable = DataModelPathHelper.isPathDeletable;
  var getTargetObjectPath = DataModelPathHelper.getTargetObjectPath;
  var MessageType = TableFormatterTypes.MessageType;
  var KeyHelper = Key.KeyHelper;
  var UI = BindingHelper.UI;
  var singletonPathVisitor = BindingHelper.singletonPathVisitor;
  var bindingContextPathVisitor = BindingHelper.bindingContextPathVisitor;
  var Draft = BindingHelper.Draft;
  var resolveBindingString = BindingExpression.resolveBindingString;
  var or = BindingExpression.or;
  var not = BindingExpression.not;
  var isConstant = BindingExpression.isConstant;
  var isBinding = BindingExpression.isBinding;
  var ifElse = BindingExpression.ifElse;
  var formatResult = BindingExpression.formatResult;
  var equal = BindingExpression.equal;
  var constant = BindingExpression.constant;
  var compileBinding = BindingExpression.compileBinding;
  var bindingExpression = BindingExpression.bindingExpression;
  var annotationExpression = BindingExpression.annotationExpression;
  var and = BindingExpression.and;
  var isDataFieldTypes = DataField.isDataFieldTypes;
  var isDataFieldForActionAbstract = DataField.isDataFieldForActionAbstract;
  var isDataFieldAlwaysHidden = DataField.isDataFieldAlwaysHidden;
  var getSemanticObjectPath = DataField.getSemanticObjectPath;
  var getDataFieldDataType = DataField.getDataFieldDataType;
  var collectRelatedPropertiesRecursively = DataField.collectRelatedPropertiesRecursively;
  var collectRelatedProperties = DataField.collectRelatedProperties;
  var Placement = ConfigurableObject.Placement;
  var insertCustomElements = ConfigurableObject.insertCustomElements;
  var removeDuplicateActions = Action.removeDuplicateActions;
  var isActionNavigable = Action.isActionNavigable;
  var getActionsFromManifest = Action.getActionsFromManifest;
  var TableID = ID.TableID;
  var VisualizationType = ManifestSettings.VisualizationType;
  var VariantManagementType = ManifestSettings.VariantManagementType;
  var TemplateType = ManifestSettings.TemplateType;
  var SelectionMode = ManifestSettings.SelectionMode;
  var HorizontalAlign = ManifestSettings.HorizontalAlign;
  var CreationMode = ManifestSettings.CreationMode;
  var AvailabilityType = ManifestSettings.AvailabilityType;
  var ActionType = ManifestSettings.ActionType;

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var ColumnType;

  (function (ColumnType) {
    ColumnType["Default"] = "Default";
    ColumnType["Annotation"] = "Annotation";
    ColumnType["Slot"] = "Slot";
  })(ColumnType || (ColumnType = {}));

  /**
   * Returns an array of all annotation-based and manifest-based table actions.
   *
   * @param {LineItem} lineItemAnnotation
   * @param {string} visualizationPath
   * @param {ConverterContext} converterContext
   * @param {NavigationSettingsConfiguration} navigationSettings
   * @returns {BaseAction} The complete table actions
   */
  function getTableActions(lineItemAnnotation, visualizationPath, converterContext, navigationSettings) {
    var aTableActions = getTableAnnotationActions(lineItemAnnotation, visualizationPath, converterContext);
    var aAnnotationActions = aTableActions.tableActions;
    var aHiddenActions = aTableActions.hiddenTableActions;
    return insertCustomElements(aAnnotationActions, getActionsFromManifest(converterContext.getManifestControlConfiguration(visualizationPath).actions, converterContext, aAnnotationActions, navigationSettings, true, aHiddenActions), {
      isNavigable: "overwrite",
      enableOnSelect: "overwrite",
      enableAutoScroll: "overwrite",
      enabled: "overwrite",
      defaultValuesExtensionFunction: "overwrite"
    });
  }
  /**
   * Returns an array of all columns, annotation-based as well as manifest based.
   * They are sorted and some properties can be overwritten via the manifest (check out the keys that can be overwritten).
   *
   * @param {LineItem} lineItemAnnotation Collection of data fields for representation in a table or list
   * @param {string} visualizationPath
   * @param {ConverterContext} converterContext
   * @param {NavigationSettingsConfiguration} navigationSettings
   * @returns {TableColumn[]} Returns all table columns that should be available, regardless of templating or personalization or their origin
   */


  _exports.getTableActions = getTableActions;

  function getTableColumns(lineItemAnnotation, visualizationPath, converterContext, navigationSettings) {
    var annotationColumns = getColumnsFromAnnotations(lineItemAnnotation, visualizationPath, converterContext);
    var manifestColumns = getColumnsFromManifest(converterContext.getManifestControlConfiguration(visualizationPath).columns, annotationColumns, converterContext, converterContext.getAnnotationEntityType(lineItemAnnotation), navigationSettings);
    return insertCustomElements(annotationColumns, manifestColumns, {
      width: "overwrite",
      isNavigable: "overwrite",
      availability: "overwrite",
      settings: "overwrite",
      horizontalAlign: "overwrite",
      formatOptions: "overwrite"
    });
  }
  /**
   * Retrieve the custom aggregation definitions from the entityType.
   *
   * @param entityType The target entity type.
   * @param tableColumns The array of columns for the entity type.
   * @param converterContext The converter context.
   * @returns The aggregate definitions from the entityType, or undefined if the entity doesn't support analytical queries.
   */


  _exports.getTableColumns = getTableColumns;

  var getAggregateDefinitionsFromEntityType = function (entityType, tableColumns, converterContext) {
    var aggregationHelper = new AggregationHelper(entityType, converterContext);

    function findColumnFromPath(path) {
      return tableColumns.find(function (column) {
        var annotationColumn = column;
        return annotationColumn.propertyInfos === undefined && annotationColumn.relativePath === path;
      });
    }

    if (!aggregationHelper.isAnalyticsSupported()) {
      return undefined;
    } // Keep a set of all currency/unit properties, as we don't want to consider them as aggregates
    // They are aggregates for technical reasons (to manage multi-units situations) but it doesn't make sense from a user standpoint


    var mCurrencyOrUnitProperties = new Set();
    tableColumns.forEach(function (oColumn) {
      var oTableColumn = oColumn;

      if (oTableColumn.unit) {
        mCurrencyOrUnitProperties.add(oTableColumn.unit);
      }
    });
    var aCustomAggregateAnnotations = aggregationHelper.getCustomAggregateDefinitions();
    var mRawDefinitions = {};
    aCustomAggregateAnnotations.forEach(function (annotation) {
      var oAggregatedProperty = aggregationHelper._entityType.entityProperties.find(function (oProperty) {
        return oProperty.name === annotation.qualifier;
      });

      if (oAggregatedProperty) {
        var _annotation$annotatio, _annotation$annotatio2;

        var aContextDefiningProperties = (_annotation$annotatio = annotation.annotations) === null || _annotation$annotatio === void 0 ? void 0 : (_annotation$annotatio2 = _annotation$annotatio.Aggregation) === null || _annotation$annotatio2 === void 0 ? void 0 : _annotation$annotatio2.ContextDefiningProperties;
        mRawDefinitions[oAggregatedProperty.name] = aContextDefiningProperties ? aContextDefiningProperties.map(function (oCtxDefProperty) {
          return oCtxDefProperty.value;
        }) : [];
      }
    });
    var mResult = {};
    tableColumns.forEach(function (oColumn) {
      var oTableColumn = oColumn;

      if (oTableColumn.propertyInfos === undefined && oTableColumn.relativePath) {
        var aRawContextDefiningProperties = mRawDefinitions[oTableColumn.relativePath]; // Ignore aggregates corresponding to currencies or units of measure and dummy created property for datapoint target Value

        if (aRawContextDefiningProperties && !mCurrencyOrUnitProperties.has(oTableColumn.name) && !oTableColumn.isDataPointFakeTargetProperty) {
          mResult[oTableColumn.name] = {
            defaultAggregate: {},
            relativePath: oTableColumn.relativePath
          };
          var aContextDefiningProperties = [];
          aRawContextDefiningProperties.forEach(function (contextDefiningPropertyName) {
            var oColumn = findColumnFromPath(contextDefiningPropertyName);

            if (oColumn) {
              aContextDefiningProperties.push(oColumn.name);
            }
          });

          if (aContextDefiningProperties.length) {
            mResult[oTableColumn.name].defaultAggregate.contextDefiningProperties = aContextDefiningProperties;
          }
        }
      }
    });
    return mResult;
  };
  /**
   * Updates a table visualization for analytical use cases.
   *
   * @param tableVisualization The visualization to be updated
   * @param entityType The entity type displayed in the table
   * @param converterContext The converter context
   * @param presentationVariantAnnotation The presentationVariant annotation (if any)
   */


  _exports.getAggregateDefinitionsFromEntityType = getAggregateDefinitionsFromEntityType;

  function updateTableVisualizationForAnalytics(tableVisualization, entityType, converterContext, presentationVariantAnnotation) {
    if (tableVisualization.control.type === "AnalyticalTable") {
      var aggregatesDefinitions = getAggregateDefinitionsFromEntityType(entityType, tableVisualization.columns, converterContext);

      if (aggregatesDefinitions) {
        tableVisualization.enableAnalytics = true;
        tableVisualization.aggregates = aggregatesDefinitions; // Add group and sort conditions from the presentation variant

        tableVisualization.annotation.groupConditions = getGroupConditions(presentationVariantAnnotation, tableVisualization.columns);
        tableVisualization.annotation.aggregateConditions = getAggregateConditions(presentationVariantAnnotation, tableVisualization.columns);
      }

      tableVisualization.control.type = "GridTable"; // AnalyticalTable isn't a real type for the MDC:Table, so we always switch back to Grid
    }
  }
  /**
   * Get the navigation target path from manifest settings.
   *
   * @param converterContext The converter context
   * @param navigationPropertyPath The navigation path to check in the manifest settings
   * @returns Navigation path from manifest settings
   */


  function getNavigationTargetPath(converterContext, navigationPropertyPath) {
    var manifestWrapper = converterContext.getManifestWrapper();

    if (navigationPropertyPath && manifestWrapper.getNavigationConfiguration(navigationPropertyPath)) {
      var navConfig = manifestWrapper.getNavigationConfiguration(navigationPropertyPath);

      if (Object.keys(navConfig).length > 0) {
        return navigationPropertyPath;
      }
    }

    var dataModelPath = converterContext.getDataModelObjectPath();
    var contextPath = converterContext.getContextPath();
    var navConfigForContextPath = manifestWrapper.getNavigationConfiguration(contextPath);

    if (navConfigForContextPath && Object.keys(navConfigForContextPath).length > 0) {
      return contextPath;
    }

    return dataModelPath.targetEntitySet ? dataModelPath.targetEntitySet.name : dataModelPath.startingEntitySet.name;
  }
  /**
   * Sets the 'unit' and 'textArrangement' properties in columns when necessary.
   *
   * @param entityType The entity type displayed in the table
   * @param tableColumns The columns to be updated
   */


  function updateLinkedProperties(entityType, tableColumns) {
    function findColumnByPath(path) {
      return tableColumns.find(function (column) {
        var annotationColumn = column;
        return annotationColumn.propertyInfos === undefined && annotationColumn.relativePath === path;
      });
    }

    tableColumns.forEach(function (oColumn) {
      var oTableColumn = oColumn;

      if (oTableColumn.propertyInfos === undefined && oTableColumn.relativePath) {
        var oProperty = entityType.entityProperties.find(function (oProp) {
          return oProp.name === oTableColumn.relativePath;
        });

        if (oProperty) {
          var _getAssociatedCurrenc, _getAssociatedUnitPro, _oProperty$annotation;

          var sUnit = ((_getAssociatedCurrenc = getAssociatedCurrencyProperty(oProperty)) === null || _getAssociatedCurrenc === void 0 ? void 0 : _getAssociatedCurrenc.name) || ((_getAssociatedUnitPro = getAssociatedUnitProperty(oProperty)) === null || _getAssociatedUnitPro === void 0 ? void 0 : _getAssociatedUnitPro.name);

          if (sUnit) {
            var oUnitColumn = findColumnByPath(sUnit);
            oTableColumn.unit = oUnitColumn === null || oUnitColumn === void 0 ? void 0 : oUnitColumn.name;
          }

          var displayMode = getDisplayMode(oProperty),
              textAnnotation = (_oProperty$annotation = oProperty.annotations.Common) === null || _oProperty$annotation === void 0 ? void 0 : _oProperty$annotation.Text;

          if (isPathExpression(textAnnotation) && displayMode !== "Value") {
            var oTextColumn = findColumnByPath(textAnnotation.path);

            if (oTextColumn && oTextColumn.name !== oTableColumn.name) {
              oTableColumn.textArrangement = {
                textProperty: oTextColumn.name,
                mode: displayMode
              };
            }
          }
        }
      }
    });
  }

  _exports.updateLinkedProperties = updateLinkedProperties;

  function createTableVisualization(lineItemAnnotation, visualizationPath, converterContext, presentationVariantAnnotation, isCondensedTableLayoutCompliant, viewConfiguration) {
    var tableManifestConfig = getTableManifestConfiguration(lineItemAnnotation, visualizationPath, converterContext, isCondensedTableLayoutCompliant);

    var _splitPath = splitPath(visualizationPath),
        navigationPropertyPath = _splitPath.navigationPropertyPath;

    var navigationTargetPath = getNavigationTargetPath(converterContext, navigationPropertyPath);
    var navigationSettings = converterContext.getManifestWrapper().getNavigationConfiguration(navigationTargetPath);
    var columns = getTableColumns(lineItemAnnotation, visualizationPath, converterContext, navigationSettings);
    var operationAvailableMap = getOperationAvailableMap(lineItemAnnotation, converterContext);
    var oVisualization = {
      type: VisualizationType.Table,
      annotation: getTableAnnotationConfiguration(lineItemAnnotation, visualizationPath, converterContext, tableManifestConfig, columns, presentationVariantAnnotation, viewConfiguration),
      control: tableManifestConfig,
      actions: removeDuplicateActions(getTableActions(lineItemAnnotation, visualizationPath, converterContext, navigationSettings)),
      columns: columns,
      enableDataStateFilter: converterContext.getTemplateType() === "ObjectPage",
      operationAvailableMap: JSON.stringify(operationAvailableMap),
      operationAvailableProperties: getOperationAvailableProperties(operationAvailableMap, converterContext)
    };
    updateLinkedProperties(converterContext.getAnnotationEntityType(lineItemAnnotation), columns);
    updateTableVisualizationForAnalytics(oVisualization, converterContext.getAnnotationEntityType(lineItemAnnotation), converterContext, presentationVariantAnnotation);
    return oVisualization;
  }

  _exports.createTableVisualization = createTableVisualization;

  function createDefaultTableVisualization(converterContext) {
    var tableManifestConfig = getTableManifestConfiguration(undefined, "", converterContext, false);
    var columns = getColumnsFromEntityType({}, converterContext.getEntityType(), [], [], converterContext, tableManifestConfig.type);
    var operationAvailableMap = getOperationAvailableMap(undefined, converterContext);
    var oVisualization = {
      type: VisualizationType.Table,
      annotation: getTableAnnotationConfiguration(undefined, "", converterContext, tableManifestConfig, columns),
      control: tableManifestConfig,
      actions: [],
      columns: columns,
      enableDataStateFilter: converterContext.getTemplateType() === "ObjectPage",
      operationAvailableMap: JSON.stringify(operationAvailableMap),
      operationAvailableProperties: getOperationAvailableProperties(operationAvailableMap, converterContext)
    };
    updateLinkedProperties(converterContext.getEntityType(), columns);
    updateTableVisualizationForAnalytics(oVisualization, converterContext.getEntityType(), converterContext);
    return oVisualization;
  }
  /**
   * Gets the map of Core.OperationAvailable property paths for all DataFieldForActions.
   *
   * @param lineItemAnnotation The instance of the line item
   * @param converterContext The instance of the converter context
   * @returns {Record<string, any>} The record containing all action names and their corresponding Core.OperationAvailable property paths
   */


  _exports.createDefaultTableVisualization = createDefaultTableVisualization;

  function getOperationAvailableMap(lineItemAnnotation, converterContext) {
    var operationAvailableMap = {};

    var addToMap = function (key, value) {
      if (key) {
        operationAvailableMap[key] = value;
      }
    };

    if (lineItemAnnotation) {
      lineItemAnnotation.forEach(function (dataField) {
        if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction") {
          var actionName = dataField.Action;

          if ((actionName === null || actionName === void 0 ? void 0 : actionName.indexOf("/")) < 0 && !dataField.Determining) {
            var _actionTarget$annotat, _actionTarget$annotat2, _actionTarget$paramet;

            var actionTarget = dataField.ActionTarget;

            if ((actionTarget === null || actionTarget === void 0 ? void 0 : (_actionTarget$annotat = actionTarget.annotations) === null || _actionTarget$annotat === void 0 ? void 0 : (_actionTarget$annotat2 = _actionTarget$annotat.Core) === null || _actionTarget$annotat2 === void 0 ? void 0 : _actionTarget$annotat2.OperationAvailable) === null) {
              // Annotation explicitly configured with null (action advertisement related)
              addToMap(actionName, null);
            } else if (actionTarget !== null && actionTarget !== void 0 && (_actionTarget$paramet = actionTarget.parameters) !== null && _actionTarget$paramet !== void 0 && _actionTarget$paramet.length) {
              var _actionTarget$annotat3, _actionTarget$annotat4, _actionTarget$annotat5, _actionTarget$annotat6;

              var bindingParameterFullName = actionTarget.parameters[0].fullyQualifiedName,
                  targetExpression = annotationExpression(actionTarget === null || actionTarget === void 0 ? void 0 : (_actionTarget$annotat3 = actionTarget.annotations) === null || _actionTarget$annotat3 === void 0 ? void 0 : (_actionTarget$annotat4 = _actionTarget$annotat3.Core) === null || _actionTarget$annotat4 === void 0 ? void 0 : _actionTarget$annotat4.OperationAvailable, [], undefined, function (path) {
                return bindingContextPathVisitor(path, converterContext, bindingParameterFullName);
              });

              if (targetExpression !== null && targetExpression !== void 0 && targetExpression.path) {
                addToMap(actionName, targetExpression.path);
              } else if ((actionTarget === null || actionTarget === void 0 ? void 0 : (_actionTarget$annotat5 = actionTarget.annotations) === null || _actionTarget$annotat5 === void 0 ? void 0 : (_actionTarget$annotat6 = _actionTarget$annotat5.Core) === null || _actionTarget$annotat6 === void 0 ? void 0 : _actionTarget$annotat6.OperationAvailable) !== undefined) {
                addToMap(actionName, targetExpression);
              }
            }
          }
        }
      });
    }

    return operationAvailableMap;
  }
  /**
   * Method to retrieve all property paths assigned to the Core.OperationAvailable annotation.
   *
   * @param {Record<string, any>} operationAvailableMap The record consisting of actions and their Core.OperationAvailable property paths
   * @param {ConverterContext} converterContext The instance of the converter context
   * @returns {string} The CSV string of all property paths associated with the Core.OperationAvailable annotation
   */


  function getOperationAvailableProperties(operationAvailableMap, converterContext) {
    var properties = new Set();

    for (var actionName in operationAvailableMap) {
      var propertyName = operationAvailableMap[actionName];

      if (propertyName === null) {
        // Annotation configured with explicit 'null' (action advertisement relevant)
        properties.add(actionName);
      } else if (typeof propertyName === "string") {
        // Add property paths and not Constant values.
        properties.add(propertyName);
      }
    }

    if (properties.size) {
      var _entityType$annotatio, _entityType$annotatio2, _entityType$annotatio3, _entityType$annotatio4, _entityType$annotatio5;

      // Some actions have an operation available based on property --> we need to load the HeaderInfo.Title property
      // so that the dialog on partial actions is displayed properly (BCP 2180271425)
      var entityType = converterContext.getEntityType();
      var titleProperty = (_entityType$annotatio = entityType.annotations) === null || _entityType$annotatio === void 0 ? void 0 : (_entityType$annotatio2 = _entityType$annotatio.UI) === null || _entityType$annotatio2 === void 0 ? void 0 : (_entityType$annotatio3 = _entityType$annotatio2.HeaderInfo) === null || _entityType$annotatio3 === void 0 ? void 0 : (_entityType$annotatio4 = _entityType$annotatio3.Title) === null || _entityType$annotatio4 === void 0 ? void 0 : (_entityType$annotatio5 = _entityType$annotatio4.Value) === null || _entityType$annotatio5 === void 0 ? void 0 : _entityType$annotatio5.path;

      if (titleProperty) {
        properties.add(titleProperty);
      }
    }

    return Array.from(properties).join(",");
  }
  /**
   * Iterates over the DataFieldForAction and DataFieldForIntentBasedNavigation of a line item and
   * returns all the UI.Hidden annotation expressions.
   *
   * @param lineItemAnnotation Collection of data fields used for representation in a table or list
   * @param currentEntityType Current entity type
   * @param contextDataModelObjectPath Object path of the data model
   * @param isEntitySet
   * @returns All the `UI.Hidden` path expressions found in the relevant actions
   */


  function getUIHiddenExpForActionsRequiringContext(lineItemAnnotation, currentEntityType, contextDataModelObjectPath, isEntitySet) {
    var aUiHiddenPathExpressions = [];
    lineItemAnnotation.forEach(function (dataField) {
      var _dataField$ActionTarg, _dataField$Inline;

      // Check if the lineItem context is the same as that of the action:
      if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" && dataField !== null && dataField !== void 0 && (_dataField$ActionTarg = dataField.ActionTarget) !== null && _dataField$ActionTarg !== void 0 && _dataField$ActionTarg.isBound && currentEntityType === (dataField === null || dataField === void 0 ? void 0 : dataField.ActionTarget.sourceEntityType) || dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" && dataField.RequiresContext && (dataField === null || dataField === void 0 ? void 0 : (_dataField$Inline = dataField.Inline) === null || _dataField$Inline === void 0 ? void 0 : _dataField$Inline.valueOf()) !== true) {
        var _dataField$annotation, _dataField$annotation2, _dataField$annotation3;

        if (typeof ((_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : (_dataField$annotation2 = _dataField$annotation.UI) === null || _dataField$annotation2 === void 0 ? void 0 : (_dataField$annotation3 = _dataField$annotation2.Hidden) === null || _dataField$annotation3 === void 0 ? void 0 : _dataField$annotation3.valueOf()) === "object") {
          aUiHiddenPathExpressions.push(equal(getBindingExpFromContext(dataField, contextDataModelObjectPath, isEntitySet), false));
        }
      }
    });
    return aUiHiddenPathExpressions;
  }
  /**
   * This method is used to change the context currently referenced by this binding by removing the last navigation property.
   *
   * It is used (specifically in this case), to transform a binding made for a NavProp context /MainObject/NavProp1/NavProp2,
   * into a binding on the previous context /MainObject/NavProp1.
   *
   * @param source DataFieldForAction | DataFieldForIntentBasedNavigation | CustomAction
   * @param contextDataModelObjectPath DataModelObjectPath
   * @param isEntitySet
   * @returns The binding expression
   */


  function getBindingExpFromContext(source, contextDataModelObjectPath, isEntitySet) {
    var _sExpression;

    var sExpression;

    if ((source === null || source === void 0 ? void 0 : source.$Type) === "com.sap.vocabularies.UI.v1.DataFieldForAction" || (source === null || source === void 0 ? void 0 : source.$Type) === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") {
      var _annotations, _annotations$UI;

      sExpression = source === null || source === void 0 ? void 0 : (_annotations = source.annotations) === null || _annotations === void 0 ? void 0 : (_annotations$UI = _annotations.UI) === null || _annotations$UI === void 0 ? void 0 : _annotations$UI.Hidden;
    } else {
      sExpression = source === null || source === void 0 ? void 0 : source.visible;
    }

    var sPath;

    if ((_sExpression = sExpression) !== null && _sExpression !== void 0 && _sExpression.path) {
      sPath = sExpression.path;
    } else {
      sPath = sExpression;
    }

    if (sPath) {
      if (source !== null && source !== void 0 && source.visible) {
        sPath = sPath.substring(1, sPath.length - 1);
      }

      if (sPath.indexOf("/") > 0) {
        var _contextDataModelObje;

        //check if the navigation property is correct:
        var aSplitPath = sPath.split("/");
        var sNavigationPath = aSplitPath[0];

        if ((contextDataModelObjectPath === null || contextDataModelObjectPath === void 0 ? void 0 : (_contextDataModelObje = contextDataModelObjectPath.targetObject) === null || _contextDataModelObje === void 0 ? void 0 : _contextDataModelObje._type) === "NavigationProperty" && contextDataModelObjectPath.targetObject.partner === sNavigationPath) {
          return bindingExpression(aSplitPath.slice(1).join("/"));
        } else {
          return constant(true);
        } // In case there is no navigation property, if it's an entitySet, the expression binding has to be returned:

      } else if (isEntitySet) {
        return bindingExpression(sPath); // otherwise the expression binding cannot be taken into account for the selection mode evaluation:
      } else {
        return constant(true);
      }
    }

    return constant(true);
  }
  /**
   * Loop through the DataFieldForAction and DataFieldForIntentBasedNavigation of a line item and check
   * if at least one of them is always visible in the table toolbar (and requires a context).
   *
   * @param lineItemAnnotation Collection of data fields for representation in a table or list
   * @param currentEntityType Current Entity Type
   * @returns {boolean} `true` if there is at least 1 action that meets the criteria
   */


  function hasBoundActionsAlwaysVisibleInToolBar(lineItemAnnotation, currentEntityType) {
    return lineItemAnnotation.some(function (dataField) {
      var _dataField$Inline2, _dataField$annotation4, _dataField$annotation5, _dataField$annotation6, _dataField$annotation7, _dataField$annotation8, _dataField$annotation9;

      if ((dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" || dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") && (dataField === null || dataField === void 0 ? void 0 : (_dataField$Inline2 = dataField.Inline) === null || _dataField$Inline2 === void 0 ? void 0 : _dataField$Inline2.valueOf()) !== true && (((_dataField$annotation4 = dataField.annotations) === null || _dataField$annotation4 === void 0 ? void 0 : (_dataField$annotation5 = _dataField$annotation4.UI) === null || _dataField$annotation5 === void 0 ? void 0 : (_dataField$annotation6 = _dataField$annotation5.Hidden) === null || _dataField$annotation6 === void 0 ? void 0 : _dataField$annotation6.valueOf()) === false || ((_dataField$annotation7 = dataField.annotations) === null || _dataField$annotation7 === void 0 ? void 0 : (_dataField$annotation8 = _dataField$annotation7.UI) === null || _dataField$annotation8 === void 0 ? void 0 : (_dataField$annotation9 = _dataField$annotation8.Hidden) === null || _dataField$annotation9 === void 0 ? void 0 : _dataField$annotation9.valueOf()) === undefined)) {
        if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction") {
          var _dataField$ActionTarg2;

          // Check if the lineItem context is the same as that of the action:
          return (dataField === null || dataField === void 0 ? void 0 : (_dataField$ActionTarg2 = dataField.ActionTarget) === null || _dataField$ActionTarg2 === void 0 ? void 0 : _dataField$ActionTarg2.isBound) && currentEntityType === (dataField === null || dataField === void 0 ? void 0 : dataField.ActionTarget.sourceEntityType);
        } else if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") {
          return dataField.RequiresContext;
        }
      }

      return false;
    });
  }

  function hasCustomActionsAlwaysVisibleInToolBar(manifestActions) {
    return Object.keys(manifestActions).some(function (actionKey) {
      var _action$visible;

      var action = manifestActions[actionKey];

      if (action.requiresSelection && ((_action$visible = action.visible) === null || _action$visible === void 0 ? void 0 : _action$visible.toString()) === "true") {
        return true;
      }

      return false;
    });
  }
  /**
   * Iterates over the custom actions (with key requiresSelection) declared in the manifest for the current line item and returns all the
   * visible key values as an expression.
   *
   * @param manifestActions The actions defined in the manifest
   * @returns Array<Expression<boolean>> All the visible path expressions of the actions that meet the criteria
   */


  function getVisibleExpForCustomActionsRequiringContext(manifestActions) {
    var aVisiblePathExpressions = [];

    if (manifestActions) {
      Object.keys(manifestActions).forEach(function (actionKey) {
        var action = manifestActions[actionKey];

        if (action.requiresSelection === true && action.visible !== undefined) {
          if (typeof action.visible === "string") {
            var _action$visible2;

            /*The final aim would be to check if the path expression depends on the parent context
            and considers only those expressions for the expression evaluation,
            but currently not possible from the manifest as the visible key is bound on the parent entity.
            Tricky to differentiate the path as it's done for the Hidden annotation.
            For the time being we consider all the paths of the manifest*/
            aVisiblePathExpressions.push(resolveBindingString(action === null || action === void 0 ? void 0 : (_action$visible2 = action.visible) === null || _action$visible2 === void 0 ? void 0 : _action$visible2.valueOf()));
          }
        }
      });
    }

    return aVisiblePathExpressions;
  }
  /**
   * Evaluate if the path is statically deletable or updatable.
   *
   * @param converterContext
   * @returns {TableCapabilityRestriction} The table capabilities
   */


  function getCapabilityRestriction(converterContext) {
    var isDeletable = isPathDeletable(converterContext.getDataModelObjectPath());
    var isUpdatable = isPathUpdatable(converterContext.getDataModelObjectPath());
    return {
      isDeletable: !(isConstant(isDeletable) && isDeletable.value === false),
      isUpdatable: !(isConstant(isUpdatable) && isUpdatable.value === false)
    };
  }

  _exports.getCapabilityRestriction = getCapabilityRestriction;

  function getSelectionMode(lineItemAnnotation, visualizationPath, converterContext, isEntitySet, targetCapabilities, isDeleteButtonVisible) {
    var _tableManifestSetting;

    if (!lineItemAnnotation) {
      return SelectionMode.None;
    }

    var tableManifestSettings = converterContext.getManifestControlConfiguration(visualizationPath);
    var selectionMode = (_tableManifestSetting = tableManifestSettings.tableSettings) === null || _tableManifestSetting === void 0 ? void 0 : _tableManifestSetting.selectionMode;
    var aHiddenBindingExpressions = [],
        aVisibleBindingExpressions = [];
    var manifestActions = getActionsFromManifest(converterContext.getManifestControlConfiguration(visualizationPath).actions, converterContext, [], undefined, false);
    var isParentDeletable, parentEntitySetDeletable;

    if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
      isParentDeletable = isPathDeletable(converterContext.getDataModelObjectPath(), undefined);
      parentEntitySetDeletable = isParentDeletable ? compileBinding(isParentDeletable, true) : isParentDeletable;
    }

    if (selectionMode && selectionMode === SelectionMode.None && isDeleteButtonVisible) {
      return compileBinding(ifElse(isDeleteButtonVisible, constant("Multi"), constant("None")));
    }

    if (!selectionMode || selectionMode === SelectionMode.Auto) {
      selectionMode = SelectionMode.Multi;
    }

    if (hasBoundActionsAlwaysVisibleInToolBar(lineItemAnnotation, converterContext.getEntityType()) || hasCustomActionsAlwaysVisibleInToolBar(manifestActions)) {
      return selectionMode;
    }

    aHiddenBindingExpressions = getUIHiddenExpForActionsRequiringContext(lineItemAnnotation, converterContext.getEntityType(), converterContext.getDataModelObjectPath(), isEntitySet);
    aVisibleBindingExpressions = getVisibleExpForCustomActionsRequiringContext(manifestActions); // No action requiring a context:

    if (aHiddenBindingExpressions.length === 0 && aVisibleBindingExpressions.length === 0) {
      if (!isEntitySet) {
        if (targetCapabilities.isDeletable || parentEntitySetDeletable !== "false") {
          return compileBinding(ifElse(equal(bindingExpression("/editMode", "ui"), "Editable"), constant(selectionMode), constant(SelectionMode.None)));
        } else {
          return SelectionMode.None;
        } // EntitySet deletable:

      } else if (targetCapabilities.isDeletable) {
        return selectionMode; // EntitySet not deletable:
      } else {
        return SelectionMode.None;
      } // There are actions requiring a context:

    } else if (!isEntitySet) {
      if (targetCapabilities.isDeletable || parentEntitySetDeletable !== "false") {
        return compileBinding(ifElse(equal(bindingExpression("/editMode", "ui"), "Editable"), constant(selectionMode), ifElse(or.apply(void 0, _toConsumableArray(aHiddenBindingExpressions.concat(aVisibleBindingExpressions))), constant(selectionMode), constant(SelectionMode.None))));
      } else {
        return compileBinding(ifElse(or.apply(void 0, _toConsumableArray(aHiddenBindingExpressions.concat(aVisibleBindingExpressions))), constant(selectionMode), constant(SelectionMode.None)));
      } //EntitySet deletable:

    } else if (targetCapabilities.isDeletable) {
      return SelectionMode.Multi; //EntitySet not deletable:
    } else {
      return compileBinding(ifElse(or.apply(void 0, _toConsumableArray(aHiddenBindingExpressions.concat(aVisibleBindingExpressions))), constant(selectionMode), constant(SelectionMode.None)));
    }
  }
  /**
   * Method to retrieve all table actions from annotations.
   *
   * @param lineItemAnnotation
   * @param visualizationPath
   * @param converterContext
   * @returns {Record<BaseAction, BaseAction>} The table annotation actions
   */


  _exports.getSelectionMode = getSelectionMode;

  function getTableAnnotationActions(lineItemAnnotation, visualizationPath, converterContext) {
    var tableActions = [];
    var hiddenTableActions = [];

    if (lineItemAnnotation) {
      lineItemAnnotation.forEach(function (dataField) {
        var _dataField$annotation10, _dataField$annotation11, _dataField$annotation12, _dataField$annotation13, _dataField$annotation14, _dataField$annotation15, _dataField$annotation16, _dataField$annotation17, _dataField$annotation18, _dataField$annotation19;

        var tableAction;

        if (isDataFieldForActionAbstract(dataField) && !(((_dataField$annotation10 = dataField.annotations) === null || _dataField$annotation10 === void 0 ? void 0 : (_dataField$annotation11 = _dataField$annotation10.UI) === null || _dataField$annotation11 === void 0 ? void 0 : (_dataField$annotation12 = _dataField$annotation11.Hidden) === null || _dataField$annotation12 === void 0 ? void 0 : _dataField$annotation12.valueOf()) === true) && !dataField.Inline && !dataField.Determining) {
          var key = KeyHelper.generateKeyFromDataField(dataField);

          switch (dataField.$Type) {
            case "com.sap.vocabularies.UI.v1.DataFieldForAction":
              tableAction = {
                type: ActionType.DataFieldForAction,
                annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
                key: key,
                visible: compileBinding(not(equal(annotationExpression((_dataField$annotation13 = dataField.annotations) === null || _dataField$annotation13 === void 0 ? void 0 : (_dataField$annotation14 = _dataField$annotation13.UI) === null || _dataField$annotation14 === void 0 ? void 0 : _dataField$annotation14.Hidden, [], undefined, converterContext.getRelativeModelPathFunction()), true))),
                isNavigable: true
              };
              break;

            case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
              tableAction = {
                type: ActionType.DataFieldForIntentBasedNavigation,
                annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
                key: key,
                visible: compileBinding(not(equal(annotationExpression((_dataField$annotation15 = dataField.annotations) === null || _dataField$annotation15 === void 0 ? void 0 : (_dataField$annotation16 = _dataField$annotation15.UI) === null || _dataField$annotation16 === void 0 ? void 0 : _dataField$annotation16.Hidden, [], undefined, converterContext.getRelativeModelPathFunction()), true)))
              };
              break;

            default:
              break;
          }
        } else if (((_dataField$annotation17 = dataField.annotations) === null || _dataField$annotation17 === void 0 ? void 0 : (_dataField$annotation18 = _dataField$annotation17.UI) === null || _dataField$annotation18 === void 0 ? void 0 : (_dataField$annotation19 = _dataField$annotation18.Hidden) === null || _dataField$annotation19 === void 0 ? void 0 : _dataField$annotation19.valueOf()) === true) {
          hiddenTableActions.push({
            type: ActionType.Default,
            key: KeyHelper.generateKeyFromDataField(dataField)
          });
        }

        if (tableAction) {
          tableActions.push(tableAction);
        }
      });
    }

    return {
      tableActions: tableActions,
      hiddenTableActions: hiddenTableActions
    };
  }

  function getHighlightRowBinding(criticalityAnnotation, isDraftRoot, targetEntityType) {
    var defaultHighlightRowDefinition = MessageType.None;

    if (criticalityAnnotation) {
      if (typeof criticalityAnnotation === "object") {
        defaultHighlightRowDefinition = annotationExpression(criticalityAnnotation);
      } else {
        // Enum Value so we get the corresponding static part
        defaultHighlightRowDefinition = getMessageTypeFromCriticalityType(criticalityAnnotation);
      }
    }

    return ifElse(isDraftRoot && Draft.IsNewObject, MessageType.Information, formatResult([defaultHighlightRowDefinition, bindingExpression("filteredMessages", "internal")], tableFormatters.rowHighlighting, targetEntityType));
  }

  function _getCreationBehaviour(lineItemAnnotation, tableManifestConfiguration, converterContext, navigationSettings) {
    var _newAction2;

    var navigation = (navigationSettings === null || navigationSettings === void 0 ? void 0 : navigationSettings.create) || (navigationSettings === null || navigationSettings === void 0 ? void 0 : navigationSettings.detail); // cross-app

    if (navigation !== null && navigation !== void 0 && navigation.outbound && navigation.outboundDetail && navigationSettings !== null && navigationSettings !== void 0 && navigationSettings.create) {
      return {
        mode: "External",
        outbound: navigation.outbound,
        outboundDetail: navigation.outboundDetail,
        navigationSettings: navigationSettings
      };
    }

    var newAction;

    if (lineItemAnnotation) {
      var _converterContext$get, _targetAnnotations$Co, _targetAnnotations$Co2, _targetAnnotations$Se, _targetAnnotations$Se2;

      // in-app
      var targetAnnotations = (_converterContext$get = converterContext.getEntitySet()) === null || _converterContext$get === void 0 ? void 0 : _converterContext$get.annotations;
      newAction = (targetAnnotations === null || targetAnnotations === void 0 ? void 0 : (_targetAnnotations$Co = targetAnnotations.Common) === null || _targetAnnotations$Co === void 0 ? void 0 : (_targetAnnotations$Co2 = _targetAnnotations$Co.DraftRoot) === null || _targetAnnotations$Co2 === void 0 ? void 0 : _targetAnnotations$Co2.NewAction) || (targetAnnotations === null || targetAnnotations === void 0 ? void 0 : (_targetAnnotations$Se = targetAnnotations.Session) === null || _targetAnnotations$Se === void 0 ? void 0 : (_targetAnnotations$Se2 = _targetAnnotations$Se.StickySessionSupported) === null || _targetAnnotations$Se2 === void 0 ? void 0 : _targetAnnotations$Se2.NewAction); // TODO: Is there really no 'NewAction' on DraftNode? targetAnnotations?.Common?.DraftNode?.NewAction

      if (tableManifestConfiguration.creationMode === CreationMode.CreationRow && newAction) {
        // A combination of 'CreationRow' and 'NewAction' does not make sense
        // TODO: Or does it?
        throw Error("Creation mode '".concat(CreationMode.CreationRow, "' can not be used with a custom 'new' action (").concat(newAction, ")"));
      }

      if (navigation !== null && navigation !== void 0 && navigation.route) {
        var _newAction;

        // route specified
        return {
          mode: tableManifestConfiguration.creationMode,
          append: tableManifestConfiguration.createAtEnd,
          newAction: (_newAction = newAction) === null || _newAction === void 0 ? void 0 : _newAction.toString(),
          navigateToTarget: tableManifestConfiguration.creationMode === CreationMode.NewPage ? navigation.route : undefined // navigate only in NewPage mode

        };
      }
    } // no navigation or no route specified - fallback to inline create if original creation mode was 'NewPage'


    if (tableManifestConfiguration.creationMode === CreationMode.NewPage) {
      tableManifestConfiguration.creationMode = CreationMode.Inline;
    }

    return {
      mode: tableManifestConfiguration.creationMode,
      append: tableManifestConfiguration.createAtEnd,
      newAction: (_newAction2 = newAction) === null || _newAction2 === void 0 ? void 0 : _newAction2.toString()
    };
  }

  var _getRowConfigurationProperty = function (lineItemAnnotation, visualizationPath, converterContext, navigationSettings, targetPath) {
    var pressProperty, navigationTarget;
    var criticalityProperty = MessageType.None;
    var targetEntityType = converterContext.getEntityType();

    if (navigationSettings && lineItemAnnotation) {
      var _navigationSettings$d, _navigationSettings$d2;

      navigationTarget = ((_navigationSettings$d = navigationSettings.display) === null || _navigationSettings$d === void 0 ? void 0 : _navigationSettings$d.target) || ((_navigationSettings$d2 = navigationSettings.detail) === null || _navigationSettings$d2 === void 0 ? void 0 : _navigationSettings$d2.outbound);

      if (navigationTarget) {
        pressProperty = ".handlers.onChevronPressNavigateOutBound( $controller ,'" + navigationTarget + "', ${$parameters>bindingContext})";
      } else if (targetEntityType) {
        var _navigationSettings$d3;

        var targetEntitySet = converterContext.getEntitySet();
        navigationTarget = (_navigationSettings$d3 = navigationSettings.detail) === null || _navigationSettings$d3 === void 0 ? void 0 : _navigationSettings$d3.route;

        if (navigationTarget) {
          var _lineItemAnnotation$a, _lineItemAnnotation$a2, _targetEntitySet$anno, _targetEntitySet$anno2, _targetEntitySet$anno3, _targetEntitySet$anno4, _targetEntitySet$anno5, _targetEntitySet$anno6, _targetEntitySet$anno7, _targetEntitySet$anno8;

          criticalityProperty = getHighlightRowBinding((_lineItemAnnotation$a = lineItemAnnotation.annotations) === null || _lineItemAnnotation$a === void 0 ? void 0 : (_lineItemAnnotation$a2 = _lineItemAnnotation$a.UI) === null || _lineItemAnnotation$a2 === void 0 ? void 0 : _lineItemAnnotation$a2.Criticality, !!(targetEntitySet !== null && targetEntitySet !== void 0 && (_targetEntitySet$anno = targetEntitySet.annotations) !== null && _targetEntitySet$anno !== void 0 && (_targetEntitySet$anno2 = _targetEntitySet$anno.Common) !== null && _targetEntitySet$anno2 !== void 0 && _targetEntitySet$anno2.DraftRoot) || !!(targetEntitySet !== null && targetEntitySet !== void 0 && (_targetEntitySet$anno3 = targetEntitySet.annotations) !== null && _targetEntitySet$anno3 !== void 0 && (_targetEntitySet$anno4 = _targetEntitySet$anno3.Common) !== null && _targetEntitySet$anno4 !== void 0 && _targetEntitySet$anno4.DraftNode), targetEntityType);
          pressProperty = "API.onTableRowPress($event, $controller, ${$parameters>bindingContext}, { callExtension: true, targetPath: '" + targetPath + "', editable : " + (targetEntitySet !== null && targetEntitySet !== void 0 && (_targetEntitySet$anno5 = targetEntitySet.annotations) !== null && _targetEntitySet$anno5 !== void 0 && (_targetEntitySet$anno6 = _targetEntitySet$anno5.Common) !== null && _targetEntitySet$anno6 !== void 0 && _targetEntitySet$anno6.DraftRoot || targetEntitySet !== null && targetEntitySet !== void 0 && (_targetEntitySet$anno7 = targetEntitySet.annotations) !== null && _targetEntitySet$anno7 !== void 0 && (_targetEntitySet$anno8 = _targetEntitySet$anno7.Common) !== null && _targetEntitySet$anno8 !== void 0 && _targetEntitySet$anno8.DraftNode ? "!${$parameters>bindingContext}.getProperty('IsActiveEntity')" : "undefined") + "})"; //Need to access to DraftRoot and DraftNode !!!!!!!
        } else {
          var _lineItemAnnotation$a3, _lineItemAnnotation$a4;

          criticalityProperty = getHighlightRowBinding((_lineItemAnnotation$a3 = lineItemAnnotation.annotations) === null || _lineItemAnnotation$a3 === void 0 ? void 0 : (_lineItemAnnotation$a4 = _lineItemAnnotation$a3.UI) === null || _lineItemAnnotation$a4 === void 0 ? void 0 : _lineItemAnnotation$a4.Criticality, false, targetEntityType);
        }
      }
    }

    var rowNavigatedExpression = formatResult([bindingExpression("/deepestPath", "internal")], tableFormatters.navigatedRow, targetEntityType);
    return {
      press: pressProperty,
      action: pressProperty ? "Navigation" : undefined,
      rowHighlighting: compileBinding(criticalityProperty),
      rowNavigated: compileBinding(rowNavigatedExpression)
    };
  };
  /**
   * Retrieve the columns from the entityType.
   *
   * @param columnsToBeCreated The columns to be created.
   * @param entityType The target entity type.
   * @param annotationColumns The array of columns created based on LineItem annotations.
   * @param nonSortableColumns The array of all non sortable column names.
   * @param converterContext The converter context.
   * @param tableType The table type.
   * @returns {AnnotationTableColumn[]} The column from the entityType
   */


  var getColumnsFromEntityType = function (columnsToBeCreated, entityType) {
    var annotationColumns = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var nonSortableColumns = arguments.length > 3 ? arguments[3] : undefined;
    var converterContext = arguments.length > 4 ? arguments[4] : undefined;
    var tableType = arguments.length > 5 ? arguments[5] : undefined;
    var tableColumns = []; // Catch already existing columns - which were added before by LineItem Annotations

    var aggregationHelper = new AggregationHelper(entityType, converterContext);
    entityType.entityProperties.forEach(function (property) {
      // Catch already existing columns - which were added before by LineItem Annotations
      var exists = annotationColumns.some(function (column) {
        return column.name === property.name;
      }); // if target type exists, it is a complex property and should be ignored

      if (!property.targetType && !exists) {
        var relatedPropertiesInfo = collectRelatedProperties(property.name, property, converterContext, true, tableType);
        var relatedPropertyNames = Object.keys(relatedPropertiesInfo.properties);
        var additionalPropertyNames = Object.keys(relatedPropertiesInfo.additionalProperties);
        var columnInfo = getColumnDefinitionFromProperty(property, converterContext.getEntitySetBasedAnnotationPath(property.fullyQualifiedName), property.name, true, true, nonSortableColumns, aggregationHelper, converterContext);
        var semanticKeys = converterContext.getAnnotationsByTerm("Common", "com.sap.vocabularies.Common.v1.SemanticKey", [converterContext.getEntityType()])[0];
        var oColumnDraftIndicator = getDefaultDraftIndicatorForColumn(columnInfo.name, semanticKeys);

        if (Object.keys(oColumnDraftIndicator).length > 0) {
          columnInfo.formatOptions = _objectSpread({}, oColumnDraftIndicator);
        }

        if (relatedPropertyNames.length > 0) {
          columnInfo.propertyInfos = relatedPropertyNames;
          columnInfo.exportSettings = _objectSpread(_objectSpread({}, columnInfo.exportSettings), {}, {
            template: relatedPropertiesInfo.exportSettingsTemplate,
            wrap: relatedPropertiesInfo.exportSettingsWrapping
          }); // Collect information of related columns to be created.

          relatedPropertyNames.forEach(function (name) {
            columnsToBeCreated[name] = relatedPropertiesInfo.properties[name];
          });
        }

        if (additionalPropertyNames.length > 0) {
          columnInfo.additionalPropertyInfos = additionalPropertyNames; // Create columns for additional properties identified for ALP use case.

          additionalPropertyNames.forEach(function (name) {
            // Intentional overwrite as we require only one new PropertyInfo for a related Property.
            columnsToBeCreated[name] = relatedPropertiesInfo.additionalProperties[name];
          });
        }

        tableColumns.push(columnInfo);
      }
    });
    return tableColumns;
  };
  /**
   * Create a column definition from a property.
   * @param {Property} property Entity type property for which the column is created
   * @param {string} fullPropertyPath The full path to the target property
   * @param {string} relativePath The relative path to the target property based on the context
   * @param {boolean} useDataFieldPrefix Should be prefixed with "DataField::", else it will be prefixed with "Property::"
   * @param {boolean} availableForAdaptation Decides whether column should be available for adaptation
   * @param {string[]} nonSortableColumns The array of all non sortable column names
   * @param {AggregationHelper} aggregationHelper The aggregationHelper for the entity
   * @param {ConverterContext} converterContext The converter context
   * @returns {AnnotationTableColumn} The annotation column definition
   */


  _exports.getColumnsFromEntityType = getColumnsFromEntityType;

  var getColumnDefinitionFromProperty = function (property, fullPropertyPath, relativePath, useDataFieldPrefix, availableForAdaptation, nonSortableColumns, aggregationHelper, converterContext) {
    var _property$annotations, _property$annotations2, _property$annotations3, _annotations2, _annotations2$UI, _annotations2$UI$Data, _annotations2$UI$Data2, _annotations2$UI$Data3, _annotations2$UI$Data4;

    var name = useDataFieldPrefix ? relativePath : "Property::" + relativePath;
    var key = (useDataFieldPrefix ? "DataField::" : "Property::") + replaceSpecialChars(relativePath);
    var semanticObjectAnnotationPath = getSemanticObjectPath(converterContext, property);
    var isHidden = ((_property$annotations = property.annotations) === null || _property$annotations === void 0 ? void 0 : (_property$annotations2 = _property$annotations.UI) === null || _property$annotations2 === void 0 ? void 0 : (_property$annotations3 = _property$annotations2.Hidden) === null || _property$annotations3 === void 0 ? void 0 : _property$annotations3.valueOf()) === true;
    var groupPath = property.name ? _sliceAtSlash(property.name, true, false) : undefined;
    var isGroup = groupPath != property.name;
    var isDataPointFakeProperty = name.indexOf("@com.sap.vocabularies.UI.v1.DataPoint") > -1;

    var exportType = _getExportDataType(property.type);

    var sDateInputFormat = property.type === "Edm.Date" ? "YYYY-MM-DD" : undefined;
    var dataType = getDataFieldDataType(property);
    var propertyTypeConfig = !isDataPointFakeProperty ? getTypeConfig(property, dataType) : undefined;
    var oTypeConfig = !isDataPointFakeProperty ? {
      className: property.type || dataType,
      oFormatOptions: propertyTypeConfig.formatOptions,
      oConstraints: propertyTypeConfig.constraints
    } : undefined;
    var exportSettings = isDataPointFakeProperty ? {
      template: getTargetValueOnDataPoint(property)
    } : {
      type: exportType,
      inputFormat: sDateInputFormat,
      scale: property.scale,
      delimiter: property.type === "Edm.Int64" ? true : false,
      trueValue: property.type === "Edm.Boolean" ? "Yes" : undefined,
      falseValue: property.type === "Edm.Boolean" ? "No" : undefined
    };
    return {
      key: key,
      isGroupable: !isDataPointFakeProperty && !isHidden ? aggregationHelper.isPropertyGroupable(property) : false,
      type: ColumnType.Annotation,
      label: _getLabel(property, isGroup),
      groupLabel: isGroup ? _getLabel(property) : null,
      group: isGroup ? groupPath : null,
      annotationPath: fullPropertyPath,
      semanticObjectPath: semanticObjectAnnotationPath,
      // A fake property was created for the TargetValue used on DataPoints, this property should be hidden and non sortable
      availability: !availableForAdaptation || isHidden || isDataPointFakeProperty ? AvailabilityType.Hidden : AvailabilityType.Adaptation,
      name: name,
      relativePath: isDataPointFakeProperty ? ((_annotations2 = property.annotations) === null || _annotations2 === void 0 ? void 0 : (_annotations2$UI = _annotations2.UI) === null || _annotations2$UI === void 0 ? void 0 : (_annotations2$UI$Data = _annotations2$UI.DataFieldDefault) === null || _annotations2$UI$Data === void 0 ? void 0 : (_annotations2$UI$Data2 = _annotations2$UI$Data.Target) === null || _annotations2$UI$Data2 === void 0 ? void 0 : (_annotations2$UI$Data3 = _annotations2$UI$Data2.$target) === null || _annotations2$UI$Data3 === void 0 ? void 0 : (_annotations2$UI$Data4 = _annotations2$UI$Data3.Value) === null || _annotations2$UI$Data4 === void 0 ? void 0 : _annotations2$UI$Data4.path) || property.Value.path : relativePath,
      sortable: !isHidden && nonSortableColumns.indexOf(relativePath) === -1 && !isDataPointFakeProperty,
      isKey: property.isKey,
      isDataPointFakeTargetProperty: isDataPointFakeProperty,
      exportSettings: exportSettings,
      caseSensitive: isFilteringCaseSensitive(converterContext),
      typeConfig: oTypeConfig,
      visualSettings: isDataPointFakeProperty ? {
        widthCalculation: null
      } : undefined
    };
  };
  /**
   * Returns Boolean true for valid columns, false for invalid columns.
   *
   * @param {DataFieldAbstractTypes} dataField Different DataField types defined in the annotations
   * @returns {boolean} True for valid columns, false for invalid columns
   * @private
   */


  var _isValidColumn = function (dataField) {
    switch (dataField.$Type) {
      case "com.sap.vocabularies.UI.v1.DataFieldForAction":
      case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
        return !!dataField.Inline;

      case "com.sap.vocabularies.UI.v1.DataFieldWithAction":
      case "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation":
        return false;

      case "com.sap.vocabularies.UI.v1.DataField":
      case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
      case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
      case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
        return true;

      default: // Todo: Replace with proper Log statement once available
      //  throw new Error("Unhandled DataField Abstract type: " + dataField.$Type);

    }
  };
  /**
   * Returns label for property and dataField.
   * @param {DataFieldAbstractTypes | Property} property Entity type property or DataField defined in the annotations
   * @param isGroup
   * @returns {string} Label of the property or DataField
   * @private
   */


  var _getLabel = function (property) {
    var isGroup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (!property) {
      return undefined;
    }

    if (isProperty(property)) {
      var _property$annotations4, _property$annotations5, _dataFieldDefault$Lab, _property$annotations6, _property$annotations7;

      var dataFieldDefault = (_property$annotations4 = property.annotations) === null || _property$annotations4 === void 0 ? void 0 : (_property$annotations5 = _property$annotations4.UI) === null || _property$annotations5 === void 0 ? void 0 : _property$annotations5.DataFieldDefault;

      if (dataFieldDefault && !dataFieldDefault.qualifier && (_dataFieldDefault$Lab = dataFieldDefault.Label) !== null && _dataFieldDefault$Lab !== void 0 && _dataFieldDefault$Lab.valueOf()) {
        var _dataFieldDefault$Lab2;

        return compileBinding(annotationExpression((_dataFieldDefault$Lab2 = dataFieldDefault.Label) === null || _dataFieldDefault$Lab2 === void 0 ? void 0 : _dataFieldDefault$Lab2.valueOf()));
      }

      return compileBinding(annotationExpression(((_property$annotations6 = property.annotations.Common) === null || _property$annotations6 === void 0 ? void 0 : (_property$annotations7 = _property$annotations6.Label) === null || _property$annotations7 === void 0 ? void 0 : _property$annotations7.valueOf()) || property.name));
    } else if (isDataFieldTypes(property)) {
      var _property$Label2, _property$Value, _property$Value$$targ, _property$Value$$targ2, _property$Value$$targ3, _property$Value$$targ4, _property$Value2, _property$Value2$$tar;

      if (!!isGroup && property.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation") {
        var _property$Label;

        return compileBinding(annotationExpression((_property$Label = property.Label) === null || _property$Label === void 0 ? void 0 : _property$Label.valueOf()));
      }

      return compileBinding(annotationExpression(((_property$Label2 = property.Label) === null || _property$Label2 === void 0 ? void 0 : _property$Label2.valueOf()) || ((_property$Value = property.Value) === null || _property$Value === void 0 ? void 0 : (_property$Value$$targ = _property$Value.$target) === null || _property$Value$$targ === void 0 ? void 0 : (_property$Value$$targ2 = _property$Value$$targ.annotations) === null || _property$Value$$targ2 === void 0 ? void 0 : (_property$Value$$targ3 = _property$Value$$targ2.Common) === null || _property$Value$$targ3 === void 0 ? void 0 : (_property$Value$$targ4 = _property$Value$$targ3.Label) === null || _property$Value$$targ4 === void 0 ? void 0 : _property$Value$$targ4.valueOf()) || ((_property$Value2 = property.Value) === null || _property$Value2 === void 0 ? void 0 : (_property$Value2$$tar = _property$Value2.$target) === null || _property$Value2$$tar === void 0 ? void 0 : _property$Value2$$tar.name)));
    } else if (property.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
      var _property$Label3, _property$Target, _property$Target$$tar, _property$Target$$tar2, _property$Target$$tar3, _property$Target$$tar4, _property$Target$$tar5, _property$Target$$tar6;

      return compileBinding(annotationExpression(((_property$Label3 = property.Label) === null || _property$Label3 === void 0 ? void 0 : _property$Label3.valueOf()) || ((_property$Target = property.Target) === null || _property$Target === void 0 ? void 0 : (_property$Target$$tar = _property$Target.$target) === null || _property$Target$$tar === void 0 ? void 0 : (_property$Target$$tar2 = _property$Target$$tar.Value) === null || _property$Target$$tar2 === void 0 ? void 0 : (_property$Target$$tar3 = _property$Target$$tar2.$target) === null || _property$Target$$tar3 === void 0 ? void 0 : (_property$Target$$tar4 = _property$Target$$tar3.annotations) === null || _property$Target$$tar4 === void 0 ? void 0 : (_property$Target$$tar5 = _property$Target$$tar4.Common) === null || _property$Target$$tar5 === void 0 ? void 0 : (_property$Target$$tar6 = _property$Target$$tar5.Label) === null || _property$Target$$tar6 === void 0 ? void 0 : _property$Target$$tar6.valueOf())));
    } else {
      var _property$Label4;

      return compileBinding(annotationExpression((_property$Label4 = property.Label) === null || _property$Label4 === void 0 ? void 0 : _property$Label4.valueOf()));
    }
  };
  /**
   * Creates a PropertyInfo for each identified property consumed by a LineItem.
   *
   * @param {Record<string, Property>} columnsToBeCreated Identified properties.
   * @param existingColumns The list of columns created for LineItems and Properties of entityType.
   * @param nonSortableColumns The array of column names which cannot be sorted.
   * @param converterContext The converter context.
   * @param entityType The entity type for the LineItem
   * @returns {AnnotationTableColumn[]} The array of columns created.
   */


  var _createRelatedColumns = function (columnsToBeCreated, existingColumns, nonSortableColumns, converterContext, entityType) {
    var relatedColumns = [];
    var relatedPropertyNameMap = {};
    var aggregationHelper = new AggregationHelper(entityType, converterContext);
    Object.keys(columnsToBeCreated).forEach(function (name) {
      var property = columnsToBeCreated[name],
          annotationPath = converterContext.getAbsoluteAnnotationPath(name),
          // Check whether the related column already exists.
      relatedColumn = existingColumns.find(function (column) {
        return column.name === name;
      });

      if (relatedColumn === undefined) {
        // Case 1: Key contains DataField prefix to ensure all property columns have the same key format.
        // New created property column is set to hidden.
        relatedColumns.push(getColumnDefinitionFromProperty(property, annotationPath, name, true, false, nonSortableColumns, aggregationHelper, converterContext));
      } else if (relatedColumn.annotationPath !== annotationPath || relatedColumn.propertyInfos && relatedColumn.propertyInfos.indexOf(name) !== -1) {
        // Case 2: The existing column points to a LineItem (or)
        // Case 3: This is a self reference from an existing column and
        // both cases require a dummy PropertyInfo for setting correct export settings.
        var newName = "Property::" + name; // Checking whether the related property column has already been created in a previous iteration.

        if (!existingColumns.some(function (column) {
          return column.name === newName;
        })) {
          // Create a new property column with 'Property::' prefix,
          // Set it to hidden as it is only consumed by Complex property infos.
          relatedColumns.push(getColumnDefinitionFromProperty(property, annotationPath, name, false, false, nonSortableColumns, aggregationHelper, converterContext));
          relatedPropertyNameMap[name] = newName;
        }
      }
    }); // The property 'name' has been prefixed with 'Property::' for uniqueness.
    // Update the same in other propertyInfos[] references which point to this property.

    existingColumns.forEach(function (column) {
      var _column$propertyInfos, _column$additionalPro;

      column.propertyInfos = (_column$propertyInfos = column.propertyInfos) === null || _column$propertyInfos === void 0 ? void 0 : _column$propertyInfos.map(function (propertyInfo) {
        var _relatedPropertyNameM;

        return (_relatedPropertyNameM = relatedPropertyNameMap[propertyInfo]) !== null && _relatedPropertyNameM !== void 0 ? _relatedPropertyNameM : propertyInfo;
      });
      column.additionalPropertyInfos = (_column$additionalPro = column.additionalPropertyInfos) === null || _column$additionalPro === void 0 ? void 0 : _column$additionalPro.map(function (propertyInfo) {
        var _relatedPropertyNameM2;

        return (_relatedPropertyNameM2 = relatedPropertyNameMap[propertyInfo]) !== null && _relatedPropertyNameM2 !== void 0 ? _relatedPropertyNameM2 : propertyInfo;
      });
    });
    return relatedColumns;
  };
  /**
   * Getting the Column Name
   * If it points to a DataField with one property or DataPoint with one property, it will use the property name
   * here to be consistent with the existing flex changes.
   *
   * @param {DataFieldAbstractTypes} dataField Different DataField types defined in the annotations
   * @returns {string} The name of annotation columns
   * @private
   */


  var _getAnnotationColumnName = function (dataField) {
    var _dataField$Target, _dataField$Target$$ta, _dataField$Target$$ta2;

    // This is needed as we have flexibility changes already that we have to check against
    if (isDataFieldTypes(dataField)) {
      var _dataField$Value;

      return (_dataField$Value = dataField.Value) === null || _dataField$Value === void 0 ? void 0 : _dataField$Value.path;
    } else if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" && (_dataField$Target = dataField.Target) !== null && _dataField$Target !== void 0 && (_dataField$Target$$ta = _dataField$Target.$target) !== null && _dataField$Target$$ta !== void 0 && (_dataField$Target$$ta2 = _dataField$Target$$ta.Value) !== null && _dataField$Target$$ta2 !== void 0 && _dataField$Target$$ta2.path) {
      var _dataField$Target2, _dataField$Target2$$t;

      // This is for removing duplicate properties. For example, 'Progress' Property is removed if it is already defined as a DataPoint
      return (_dataField$Target2 = dataField.Target) === null || _dataField$Target2 === void 0 ? void 0 : (_dataField$Target2$$t = _dataField$Target2.$target) === null || _dataField$Target2$$t === void 0 ? void 0 : _dataField$Target2$$t.Value.path;
    } else {
      return KeyHelper.generateKeyFromDataField(dataField);
    }
  };
  /**
   * Determines the relative path of the property with respect to the root entity.
   * @param dataField The `DataField` being processed.
   * @returns {string} The relative path
   */


  var _getRelativePath = function (dataField) {
    var _Value, _Target;

    var relativePath = "";

    switch (dataField.$Type) {
      case "com.sap.vocabularies.UI.v1.DataField":
      case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
      case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
        relativePath = dataField === null || dataField === void 0 ? void 0 : (_Value = dataField.Value) === null || _Value === void 0 ? void 0 : _Value.path;
        break;

      case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
        relativePath = dataField === null || dataField === void 0 ? void 0 : (_Target = dataField.Target) === null || _Target === void 0 ? void 0 : _Target.value;
        break;

      case "com.sap.vocabularies.UI.v1.DataFieldForAction":
      case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
        relativePath = KeyHelper.generateKeyFromDataField(dataField);
        break;
    }

    return relativePath;
  };

  var _sliceAtSlash = function (path, isLastSlash, isLastPart) {
    var iSlashIndex = isLastSlash ? path.lastIndexOf("/") : path.indexOf("/");

    if (iSlashIndex === -1) {
      return path;
    }

    return isLastPart ? path.substring(iSlashIndex + 1, path.length) : path.substring(0, iSlashIndex);
  };
  /**
   * Determine whether a column is sortable.
   *
   * @param dataField The data field being processed
   * @param propertyPath The property path
   * @param nonSortableColumns Collection of non-sortable column names as per annotation
   * @returns {boolean} True if the column is sortable
   */


  var _isColumnSortable = function (dataField, propertyPath, nonSortableColumns) {
    var isSortable = false;

    if (nonSortableColumns.indexOf(propertyPath) === -1) {
      // Column is not marked as non-sortable via annotation
      switch (dataField.$Type) {
        case "com.sap.vocabularies.UI.v1.DataField":
        case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
          isSortable = true;
          break;

        case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
        case "com.sap.vocabularies.UI.v1.DataFieldForAction":
          // Action columns are not sortable
          isSortable = false;
          break;
      }
    }

    return isSortable;
  };
  /**
   * Returns whether filtering on the table is case sensitive.
   *
   * @param {ConverterContext} converterContext The instance of the converter context
   * @returns {boolean} Returns 'false' if FilterFunctions annotation supports 'tolower', else 'true'
   */


  var isFilteringCaseSensitive = function (converterContext) {
    var _converterContext$get2, _converterContext$get3, _converterContext$get4, _converterContext$get5, _converterContext$get6;

    var filterFunctions = ((_converterContext$get2 = converterContext.getEntitySet()) === null || _converterContext$get2 === void 0 ? void 0 : (_converterContext$get3 = _converterContext$get2.annotations) === null || _converterContext$get3 === void 0 ? void 0 : (_converterContext$get4 = _converterContext$get3.Capabilities) === null || _converterContext$get4 === void 0 ? void 0 : _converterContext$get4.FilterFunctions) || ((_converterContext$get5 = converterContext.getEntityContainer().annotations) === null || _converterContext$get5 === void 0 ? void 0 : (_converterContext$get6 = _converterContext$get5.Capabilities) === null || _converterContext$get6 === void 0 ? void 0 : _converterContext$get6.FilterFunctions);
    return Array.isArray(filterFunctions) ? filterFunctions.indexOf("tolower") === -1 : true;
  };
  /**
   * Returns default format options for text fields in a table.
   *
   * @returns {FormatOptionsType} Collection of format options with default values
   */


  _exports.isFilteringCaseSensitive = isFilteringCaseSensitive;

  function getDefaultFormatOptionsForTable() {
    return {
      textLinesEdit: 4
    };
  }
  /**
   * Returns default format options with draftIndicator for a column.
   * @param name
   * @param semanticKeys
   * @returns {FormatOptionsType} Collection of format options with default values
   */


  function getDefaultDraftIndicatorForColumn(name, semanticKeys) {
    var bSemanticKeyFound = false;
    var aSemanticKeyValues = [];

    if (!semanticKeys) {
      return {};
    }

    for (var i = 0; i < semanticKeys.length; i++) {
      aSemanticKeyValues.push(semanticKeys[i].value);

      if (semanticKeys[i].value === name) {
        bSemanticKeyFound = true;
      }
    }

    if (bSemanticKeyFound) {
      return {
        hasDraftIndicator: true,
        semantickeys: aSemanticKeyValues
      };
    } else {
      return {};
    }
  }
  /**
   * Returns line items from metadata annotations.
   *
   * @param {LineItem} lineItemAnnotation Collection of data fields with their annotations
   * @param {string} visualizationPath The visualization path
   * @param {ConverterContext} converterContext The converter context
   * @returns {TableColumn[]} The columns from the annotations
   */


  var getColumnsFromAnnotations = function (lineItemAnnotation, visualizationPath, converterContext) {
    var _tableManifestSetting2;

    var entityType = converterContext.getAnnotationEntityType(lineItemAnnotation),
        annotationColumns = [],
        columnsToBeCreated = {},
        nonSortableColumns = getNonSortablePropertiesRestrictions(converterContext.getEntitySet()),
        tableManifestSettings = converterContext.getManifestControlConfiguration(visualizationPath),
        tableType = (tableManifestSettings === null || tableManifestSettings === void 0 ? void 0 : (_tableManifestSetting2 = tableManifestSettings.tableSettings) === null || _tableManifestSetting2 === void 0 ? void 0 : _tableManifestSetting2.type) || "ResponsiveTable";
    var semanticKeys = converterContext.getAnnotationsByTerm("Common", "com.sap.vocabularies.Common.v1.SemanticKey", [converterContext.getEntityType()])[0];

    if (lineItemAnnotation) {
      // Get columns from the LineItem Annotation
      lineItemAnnotation.forEach(function (lineItem) {
        var _lineItem$Value, _lineItem$Value$$targ, _lineItem$annotations, _lineItem$annotations2, _lineItem$annotations3;

        if (!_isValidColumn(lineItem)) {
          return;
        }

        var semanticObjectAnnotationPath = isDataFieldTypes(lineItem) && (_lineItem$Value = lineItem.Value) !== null && _lineItem$Value !== void 0 && (_lineItem$Value$$targ = _lineItem$Value.$target) !== null && _lineItem$Value$$targ !== void 0 && _lineItem$Value$$targ.fullyQualifiedName ? getSemanticObjectPath(converterContext, lineItem) : undefined;

        var relativePath = _getRelativePath(lineItem); // Determine properties which are consumed by this LineItem.


        var relatedPropertiesInfo = collectRelatedPropertiesRecursively(lineItem, converterContext, tableType);
        var relatedPropertyNames = Object.keys(relatedPropertiesInfo.properties);
        var additionalPropertyNames = Object.keys(relatedPropertiesInfo.additionalProperties);

        var groupPath = _sliceAtSlash(relativePath, true, false);

        var isGroup = groupPath != relativePath;

        var sLabel = _getLabel(lineItem, isGroup);

        var name = _getAnnotationColumnName(lineItem);

        var dataType = getDataFieldDataType(lineItem);
        var sDateInputFormat = dataType === "Edm.Date" ? "YYYY-MM-DD" : undefined;

        var formatOptions = _objectSpread(_objectSpread({}, getDefaultFormatOptionsForTable()), getDefaultDraftIndicatorForColumn(name, semanticKeys));

        var exportSettings = {
          template: relatedPropertiesInfo.exportSettingsTemplate,
          wrap: relatedPropertiesInfo.exportSettingsWrapping,
          type: dataType ? _getExportDataType(dataType, relatedPropertyNames.length > 1) : undefined,
          inputFormat: sDateInputFormat,
          delimiter: dataType === "Edm.Int64" ? true : false,
          trueValue: dataType === "Edm.Boolean" ? "Yes" : undefined,
          falseValue: dataType === "Edm.Boolean" ? "No" : undefined
        };
        var propertyTypeConfig = dataType && getTypeConfig(lineItem, dataType);
        var oTypeConfig = propertyTypeConfig ? {
          className: dataType,
          oFormatOptions: _objectSpread(_objectSpread({}, formatOptions), propertyTypeConfig.formatOptions),
          oConstraints: propertyTypeConfig.constraints
        } : undefined;
        var visualSettings = {};

        if (relatedPropertiesInfo.visualSettingsToBeExcluded) {
          // In case of text arrangement annotation with display mode as text only, exclude text property from the width calculation
          visualSettings = {
            widthCalculation: {
              excludeProperties: "Property::" + relatedPropertiesInfo.visualSettingsToBeExcluded
            }
          };
        } else if (!dataType || !oTypeConfig) {
          // for charts
          visualSettings.widthCalculation = null;
        }

        annotationColumns.push({
          key: KeyHelper.generateKeyFromDataField(lineItem),
          type: ColumnType.Annotation,
          label: sLabel,
          groupLabel: isGroup ? _getLabel(lineItem) : null,
          group: isGroup ? groupPath : null,
          annotationPath: converterContext.getEntitySetBasedAnnotationPath(lineItem.fullyQualifiedName),
          semanticObjectPath: semanticObjectAnnotationPath,
          availability: isDataFieldAlwaysHidden(lineItem) ? AvailabilityType.Hidden : AvailabilityType.Default,
          name: name,
          relativePath: relativePath,
          sortable: _isColumnSortable(lineItem, relativePath, nonSortableColumns),
          propertyInfos: relatedPropertyNames.length > 0 ? relatedPropertyNames : undefined,
          additionalPropertyInfos: additionalPropertyNames.length > 0 ? additionalPropertyNames : undefined,
          exportSettings: exportSettings,
          width: ((_lineItem$annotations = lineItem.annotations) === null || _lineItem$annotations === void 0 ? void 0 : (_lineItem$annotations2 = _lineItem$annotations.HTML5) === null || _lineItem$annotations2 === void 0 ? void 0 : (_lineItem$annotations3 = _lineItem$annotations2.CssDefaults) === null || _lineItem$annotations3 === void 0 ? void 0 : _lineItem$annotations3.width) || undefined,
          isNavigable: true,
          formatOptions: formatOptions,
          exportContactProperty: relatedPropertiesInfo.exportSettingsContactProperty,
          caseSensitive: isFilteringCaseSensitive(converterContext),
          typeConfig: oTypeConfig,
          visualSettings: visualSettings
        }); // Collect information of related columns to be created.

        relatedPropertyNames.forEach(function (name) {
          columnsToBeCreated[name] = relatedPropertiesInfo.properties[name];
        }); // Create columns for additional properties identified for ALP use case.

        additionalPropertyNames.forEach(function (name) {
          // Intentional overwrite as we require only one new PropertyInfo for a related Property.
          columnsToBeCreated[name] = relatedPropertiesInfo.additionalProperties[name];
        });
      });
    } // Get columns from the Properties of EntityType


    var tableColumns = getColumnsFromEntityType(columnsToBeCreated, entityType, annotationColumns, nonSortableColumns, converterContext, tableType);
    tableColumns = tableColumns.concat(annotationColumns); // Create a propertyInfo for each related property.

    var relatedColumns = _createRelatedColumns(columnsToBeCreated, tableColumns, nonSortableColumns, converterContext, entityType);

    tableColumns = tableColumns.concat(relatedColumns);
    return tableColumns;
  };
  /**
   * Gets the property names from the manifest and checks against existing properties already added by annotations.
   * If a not yet stored property is found it adds it for sorting and filtering only to the annotationColumns.
   * @param {string[] | undefined} properties
   * @param {AnnotationTableColumn[]} annotationColumns
   * @param {ConverterContext} converterContext
   * @param entityType
   * @returns {string[]} The columns from the annotations
   */


  var _getPropertyNames = function (properties, annotationColumns, converterContext, entityType) {
    var matchedProperties;

    if (properties) {
      matchedProperties = properties.map(function (propertyPath) {
        var annotationColumn = annotationColumns.find(function (annotationColumn) {
          return annotationColumn.relativePath === propertyPath && annotationColumn.propertyInfos === undefined;
        });

        if (annotationColumn) {
          return annotationColumn.name;
        } else {
          var relatedColumns = _createRelatedColumns(_defineProperty({}, propertyPath, entityType.resolvePath(propertyPath)), annotationColumns, [], converterContext, entityType);

          annotationColumns.push(relatedColumns[0]);
          return relatedColumns[0].name;
        }
      });
    }

    return matchedProperties;
  };

  var _appendCustomTemplate = function (properties) {
    return properties.map(function (property) {
      return "{".concat(properties.indexOf(property), "}");
    }).join("\n");
  };
  /**
   * Retrieves the table column property value based on certain conditions.
   *
   * Manifest defined property value for custom / annotation columns
   * Default property value for custom column if not overwritten in manifest.
   *
   * @param {any} property The column property defined in the manifest
   * @param {any} defaultValue The default value of the property
   * @param {boolean} isAnnotationColumn Whether the column, defined in manifest, corresponds to an existing annotation column.
   * @returns {any} Determined property value for the column
   */


  var _getManifestOrDefaultValue = function (property, defaultValue, isAnnotationColumn) {
    if (property === undefined) {
      // If annotation column has no property defined in manifest,
      // do not overwrite it with manifest column's default value.
      return isAnnotationColumn ? undefined : defaultValue;
    } // Return what is defined in manifest.


    return property;
  };
  /**
   * Returns table column definitions from manifest.
   * @param columns
   * @param annotationColumns
   * @param converterContext
   * @param entityType
   * @param navigationSettings
   * @returns {Record<string, CustomColumn>} The columns from the manifest
   */


  var getColumnsFromManifest = function (columns, annotationColumns, converterContext, entityType, navigationSettings) {
    var internalColumns = {};

    var _loop = function (key) {
      var _manifestColumn$posit;

      var manifestColumn = columns[key]; // To identify the annotation column property overwrite via manifest use-case.

      var isAnnotationColumn = annotationColumns.some(function (column) {
        return column.key === key;
      });
      KeyHelper.validateKey(key);

      var propertyInfos = _getPropertyNames(manifestColumn.properties, annotationColumns, converterContext, entityType);

      internalColumns[key] = {
        key: key,
        id: "CustomColumn::" + key,
        name: "CustomColumn::" + key,
        header: manifestColumn.header,
        width: manifestColumn.width || undefined,
        horizontalAlign: _getManifestOrDefaultValue(manifestColumn === null || manifestColumn === void 0 ? void 0 : manifestColumn.horizontalAlign, HorizontalAlign.Begin, isAnnotationColumn),
        type: manifestColumn.type === "Slot" ? ColumnType.Slot : ColumnType.Default,
        availability: _getManifestOrDefaultValue(manifestColumn === null || manifestColumn === void 0 ? void 0 : manifestColumn.availability, AvailabilityType.Default, isAnnotationColumn),
        template: manifestColumn.template || "undefined",
        position: {
          anchor: (_manifestColumn$posit = manifestColumn.position) === null || _manifestColumn$posit === void 0 ? void 0 : _manifestColumn$posit.anchor,
          placement: manifestColumn.position === undefined ? Placement.After : manifestColumn.position.placement
        },
        isNavigable: isAnnotationColumn ? undefined : isActionNavigable(manifestColumn, navigationSettings, true),
        settings: manifestColumn.settings,
        sortable: false,
        propertyInfos: propertyInfos,
        formatOptions: _objectSpread(_objectSpread({}, getDefaultFormatOptionsForTable()), manifestColumn.formatOptions),
        exportSettings: {
          template: propertyInfos ? _appendCustomTemplate(propertyInfos) : undefined,
          fieldLabel: propertyInfos ? manifestColumn.header : undefined,
          wrap: propertyInfos && propertyInfos.length > 1 ? true : false
        },
        caseSensitive: isFilteringCaseSensitive(converterContext)
      };
    };

    for (var key in columns) {
      _loop(key);
    }

    return internalColumns;
  };

  function getP13nMode(visualizationPath, converterContext, tableManifestConfiguration) {
    var _tableManifestSetting3;

    var manifestWrapper = converterContext.getManifestWrapper();
    var tableManifestSettings = converterContext.getManifestControlConfiguration(visualizationPath);
    var variantManagement = manifestWrapper.getVariantManagement();
    var aPersonalization = [];
    var bAnalyticalTable = tableManifestConfiguration.type === "AnalyticalTable";

    if ((tableManifestSettings === null || tableManifestSettings === void 0 ? void 0 : (_tableManifestSetting3 = tableManifestSettings.tableSettings) === null || _tableManifestSetting3 === void 0 ? void 0 : _tableManifestSetting3.personalization) !== undefined) {
      // Personalization configured in manifest.
      var personalization = tableManifestSettings.tableSettings.personalization;

      if (personalization === true) {
        // Table personalization fully enabled.
        return bAnalyticalTable ? "Sort,Column,Filter,Group,Aggregate" : "Sort,Column,Filter";
      } else if (typeof personalization === "object") {
        // Specific personalization options enabled in manifest. Use them as is.
        if (personalization.sort) {
          aPersonalization.push("Sort");
        }

        if (personalization.column) {
          aPersonalization.push("Column");
        }

        if (personalization.filter) {
          aPersonalization.push("Filter");
        }

        if (personalization.group && bAnalyticalTable) {
          aPersonalization.push("Group");
        }

        if (personalization.aggregate && bAnalyticalTable) {
          aPersonalization.push("Aggregate");
        }

        return aPersonalization.length > 0 ? aPersonalization.join(",") : undefined;
      }
    } else {
      // No personalization configured in manifest.
      aPersonalization.push("Sort");
      aPersonalization.push("Column");

      if (variantManagement === VariantManagementType.Control) {
        // Feature parity with V2.
        // Enable table filtering by default only in case of Control level variant management.
        aPersonalization.push("Filter");
      }

      if (bAnalyticalTable) {
        aPersonalization.push("Group");
        aPersonalization.push("Aggregate");
      }

      return aPersonalization.join(",");
    }

    return undefined;
  }
  /**
   * Function to determine the visibility of the Delete button.
   *
   * @param converterContext The instance of the converter context
   * @param navigationPath Path to the navigation entity
   * @param isTargetDeletable Flag which determines whether a target is deletable
   * @param viewConfiguration The instance of the configuration for the view path
   * @returns {Expression<boolean>} The expression for the Delete button
   */


  _exports.getP13nMode = getP13nMode;

  function getDeleteVisible(converterContext, navigationPath, isTargetDeletable, viewConfiguration) {
    var _currentEntitySet$ann, _converterContext$get7, _converterContext$get8, _converterContext$get9, _currentEntitySet$ann2, _currentEntitySet$ann3, _currentEntitySet$ann4, _currentEntitySet$ann5, _converterContext$get10, _converterContext$get11, _converterContext$get12, _converterContext$get13, _converterContext$get14, _converterContext$get15, _converterContext$get16;

    var currentEntitySet = converterContext.getEntitySet();
    var dataModelObjectPath = converterContext.getDataModelObjectPath();
    var visitedNavigationPaths = dataModelObjectPath.navigationProperties.map(function (navProp) {
      return navProp.name;
    });
    var isDeleteHiddenExpression = currentEntitySet ? annotationExpression((currentEntitySet === null || currentEntitySet === void 0 ? void 0 : (_currentEntitySet$ann = currentEntitySet.annotations.UI) === null || _currentEntitySet$ann === void 0 ? void 0 : _currentEntitySet$ann.DeleteHidden) || false, visitedNavigationPaths, undefined, function (path) {
      return singletonPathVisitor(path, converterContext, visitedNavigationPaths);
    }) : constant(false);
    var isDeleteHidden = compileBinding(isDeleteHiddenExpression);
    var isParentDeletable, parentEntitySetDeletable;

    if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
      isParentDeletable = isPathDeletable(converterContext.getDataModelObjectPath(), navigationPath);
      parentEntitySetDeletable = isParentDeletable ? compileBinding(isParentDeletable) : isParentDeletable;
    }

    var bIsStickySessionSupported = (_converterContext$get7 = converterContext.getDataModelObjectPath().startingEntitySet) !== null && _converterContext$get7 !== void 0 && (_converterContext$get8 = _converterContext$get7.annotations) !== null && _converterContext$get8 !== void 0 && (_converterContext$get9 = _converterContext$get8.Session) !== null && _converterContext$get9 !== void 0 && _converterContext$get9.StickySessionSupported ? true : false;
    var bIsDraftRoot = currentEntitySet && (_currentEntitySet$ann2 = currentEntitySet.annotations) !== null && _currentEntitySet$ann2 !== void 0 && (_currentEntitySet$ann3 = _currentEntitySet$ann2.Common) !== null && _currentEntitySet$ann3 !== void 0 && _currentEntitySet$ann3.DraftRoot ? true : false;
    var bIsDraftNode = currentEntitySet && (_currentEntitySet$ann4 = currentEntitySet.annotations) !== null && _currentEntitySet$ann4 !== void 0 && (_currentEntitySet$ann5 = _currentEntitySet$ann4.Common) !== null && _currentEntitySet$ann5 !== void 0 && _currentEntitySet$ann5.DraftNode ? true : false;
    var bIsDraftParentEntityForContainment = (_converterContext$get10 = converterContext.getDataModelObjectPath().targetObject) !== null && _converterContext$get10 !== void 0 && _converterContext$get10.containsTarget && ((_converterContext$get11 = converterContext.getDataModelObjectPath().startingEntitySet) !== null && _converterContext$get11 !== void 0 && (_converterContext$get12 = _converterContext$get11.annotations) !== null && _converterContext$get12 !== void 0 && (_converterContext$get13 = _converterContext$get12.Common) !== null && _converterContext$get13 !== void 0 && _converterContext$get13.DraftRoot || (_converterContext$get14 = converterContext.getDataModelObjectPath().startingEntitySet) !== null && _converterContext$get14 !== void 0 && (_converterContext$get15 = _converterContext$get14.annotations) !== null && _converterContext$get15 !== void 0 && (_converterContext$get16 = _converterContext$get15.Common) !== null && _converterContext$get16 !== void 0 && _converterContext$get16.DraftNode) ? true : false;

    if (bIsDraftRoot || bIsDraftNode || bIsStickySessionSupported || !converterContext.getEntitySet() && bIsDraftParentEntityForContainment) {
      //do not show case the delete button if parentEntitySetDeletable is false
      if (parentEntitySetDeletable === "false") {
        return constant(false); //OP
      } else if (parentEntitySetDeletable && isDeleteHidden !== "true") {
        //Delete Hidden in case of true and path based
        if (isDeleteHidden && isDeleteHidden !== "false") {
          return and(equal(bindingExpression("/editMode", "ui"), "Editable"), not(isDeleteHiddenExpression));
        } else {
          return equal(bindingExpression("/editMode", "ui"), "Editable");
        }
      } else if (isDeleteHidden === "true" || !isTargetDeletable || viewConfiguration && converterContext.getManifestWrapper().hasMultipleVisualizations(viewConfiguration) || converterContext.getTemplateType() === TemplateType.AnalyticalListPage) {
        return constant(false);
      } else if (converterContext.getTemplateType() !== TemplateType.ListReport) {
        if (isDeleteHidden && isDeleteHidden === "false") {
          return and(equal(bindingExpression("/editMode", "ui"), "Editable"), not(isDeleteHiddenExpression));
        } else {
          return equal(bindingExpression("/editMode", "ui"), "Editable");
        }
      } else if (isBinding(isDeleteHiddenExpression)) {
        // UI.DeleteHidden annotation points to a path
        return not(isDeleteHiddenExpression);
      } else {
        return constant(true);
      }
    } else {
      return constant(false);
    }
  }
  /**
   * Returns the enablement for the 'Mass Edit' button
   *
   * @param converterContext The converterContext
   * @param bMassEditVisible The visibility of the 'Mass Edit' button
   * @returns {*} Expression or Boolean value for the enablement of the 'Mass Edit' button
   */


  _exports.getDeleteVisible = getDeleteVisible;

  function getEnablementMassEdit(converterContext, bMassEditVisible) {
    if (bMassEditVisible) {
      var isParentUpdatable = isPathUpdatable(converterContext.getDataModelObjectPath(), undefined, true); //when updatable is path based and pointing to current entity set property, that case is handled in table helper and runtime

      if (isParentUpdatable !== null && isParentUpdatable !== void 0 && isParentUpdatable.currentEntityRestriction) {
        return false;
      }

      var oExpression = compileBinding(isParentUpdatable);
      return isParentUpdatable ? "{= %{internal>numberOfSelectedContexts} >= 2 && " + compileBinding(isParentUpdatable, oExpression) + "}" : false;
    }

    return false;
  }
  /**
   * Returns the visibility for the 'Mass Edit' button
   *
   * @param converterContext The converterContext
   * @param tableManifestConfiguration The manifest configuration for the table
   * @param targetCapabilities The target capability restrictions for the table
   * @param selectionMode The selection mode for the table
   * @returns {*} Expression or Boolean value for the visibility of the 'Mass Edit' button
   */


  _exports.getEnablementMassEdit = getEnablementMassEdit;

  function getVisibilityMassEdit(converterContext, tableManifestConfiguration, targetCapabilities, selectionMode) {
    var _entitySet$annotation, _entitySet$annotation2;

    var entitySet = converterContext.getEntitySet(),
        bUpdateHidden = entitySet && (entitySet === null || entitySet === void 0 ? void 0 : (_entitySet$annotation = entitySet.annotations.UI) === null || _entitySet$annotation === void 0 ? void 0 : (_entitySet$annotation2 = _entitySet$annotation.UpdateHidden) === null || _entitySet$annotation2 === void 0 ? void 0 : _entitySet$annotation2.valueOf()),
        bMassEditEnabled = (tableManifestConfiguration === null || tableManifestConfiguration === void 0 ? void 0 : tableManifestConfiguration.enableMassEdit) || false,
        iSelectionLimit = tableManifestConfiguration === null || tableManifestConfiguration === void 0 ? void 0 : tableManifestConfiguration.selectionLimit;
    var bMassEditVisible = true;

    if (selectionMode && selectionMode === "Single" || iSelectionLimit && iSelectionLimit < 2) {
      bMassEditVisible = false;
    } else if (selectionMode && (selectionMode === "Auto" || selectionMode === "None")) {
      bMassEditVisible = true;
    }

    if ((targetCapabilities === null || targetCapabilities === void 0 ? void 0 : targetCapabilities.isUpdatable) !== false && bMassEditVisible && bMassEditEnabled) {
      if (bUpdateHidden && typeof bUpdateHidden === "boolean") {
        return !bUpdateHidden && converterContext.getTemplateType() === TemplateType.ObjectPage ? compileBinding(UI.IsEditable) : false;
      } else if (bUpdateHidden && bUpdateHidden !== null && bUpdateHidden !== void 0 && bUpdateHidden.path) {
        return converterContext.getTemplateType() === TemplateType.ObjectPage ? compileBinding(and(equal(UI.IsEditable, true), equal(annotationExpression(bUpdateHidden), false))) : false;
      }

      return converterContext.getTemplateType() === TemplateType.ObjectPage ? compileBinding(UI.IsEditable) : false;
    }

    return false;
  }
  /**
   * Function to determine the visibility of the Create button.
   *
   * @param converterContext The instance of the converter context
   * @param creationMode The mode used for creation
   * @param isInsertable Annotation expression of InsertRestrictions.Insertable
   * @param viewConfiguration The instance of the configuration for the view path
   * @returns {Expression<boolean>} Expression or Boolean value of the 'UI.CreateHidden' annotation
   */


  _exports.getVisibilityMassEdit = getVisibilityMassEdit;

  function getCreateVisible(converterContext, creationMode, isInsertable, viewConfiguration) {
    var _currentEntitySet$ann6, _currentEntitySet$ann7, _currentEntitySet$ann8, _currentEntitySet$ann9, _converterContext$get17, _converterContext$get18, _converterContext$get19;

    var currentEntitySet = converterContext.getEntitySet();
    var dataModelObjectPath = converterContext.getDataModelObjectPath();
    var visitedNavigationPaths = dataModelObjectPath.navigationProperties.map(function (navProp) {
      return navProp.name;
    });
    var isCreateHidden = currentEntitySet ? annotationExpression((currentEntitySet === null || currentEntitySet === void 0 ? void 0 : (_currentEntitySet$ann6 = currentEntitySet.annotations.UI) === null || _currentEntitySet$ann6 === void 0 ? void 0 : _currentEntitySet$ann6.CreateHidden) || false, visitedNavigationPaths, undefined, function (path) {
      return singletonPathVisitor(path, converterContext, visitedNavigationPaths);
    }) : constant(false); // if there is a custom new action the create button will be bound against this new action (instead of a POST action).
    // The visibility of the create button then depends on the new action's OperationAvailable annotation (instead of the insertRestrictions):
    // OperationAvailable = true or undefined -> create is visible
    // OperationAvailable = false -> create is not visible

    var newActionName = currentEntitySet === null || currentEntitySet === void 0 ? void 0 : (_currentEntitySet$ann7 = currentEntitySet.annotations.Common) === null || _currentEntitySet$ann7 === void 0 ? void 0 : (_currentEntitySet$ann8 = _currentEntitySet$ann7.DraftRoot) === null || _currentEntitySet$ann8 === void 0 ? void 0 : (_currentEntitySet$ann9 = _currentEntitySet$ann8.NewAction) === null || _currentEntitySet$ann9 === void 0 ? void 0 : _currentEntitySet$ann9.toString();
    var showCreateForNewAction = newActionName ? annotationExpression(converterContext === null || converterContext === void 0 ? void 0 : (_converterContext$get17 = converterContext.getEntityType().actions[newActionName].annotations) === null || _converterContext$get17 === void 0 ? void 0 : (_converterContext$get18 = _converterContext$get17.Core) === null || _converterContext$get18 === void 0 ? void 0 : (_converterContext$get19 = _converterContext$get18.OperationAvailable) === null || _converterContext$get19 === void 0 ? void 0 : _converterContext$get19.valueOf(), [], true, function (path) {
      return singletonPathVisitor(path, converterContext, []);
    }) : undefined; // - If it's statically not insertable -> create is not visible
    // - If create is statically hidden -> create is not visible
    // - If it's an ALP template -> create is not visible
    // -
    // - Otherwise
    // 	 - If the create mode is external -> create is visible
    // 	 - If we're on the list report ->
    // 	 	- If UI.CreateHidden points to a property path -> provide a negated binding to this path
    // 	 	- Otherwise, create is visible
    // 	 - Otherwise
    // 	   - This depends on the value of the the UI.IsEditable

    return ifElse(or(or(equal(showCreateForNewAction, false), and(isConstant(isInsertable), equal(isInsertable, false), equal(showCreateForNewAction, undefined))), isConstant(isCreateHidden) && equal(isCreateHidden, true), or(viewConfiguration ? converterContext.getManifestWrapper().hasMultipleVisualizations(viewConfiguration) : false, converterContext.getTemplateType() === TemplateType.AnalyticalListPage)), false, ifElse(creationMode === "External", true, ifElse(converterContext.getTemplateType() === TemplateType.ListReport, ifElse(isBinding(isCreateHidden), not(isCreateHidden), true), and(not(isCreateHidden), UI.IsEditable))));
  }
  /**
   * Returns the visibility for the Paste button.
   *
   * @param converterContext The instance of the converter context
   * @param creationBehaviour The chosen behavior of creation
   * @param isInsertable The expression which denotes insert restrictions
   * @param pasteEnabledInManifest The flag which denotes the paste enablement status via manifest
   * @param viewConfiguration The instance of the configuration for the view path
   * @returns {Expression<boolean>} Expression or Boolean value of the UI.CreateHidden annotation
   */


  _exports.getCreateVisible = getCreateVisible;

  function getPasteEnabled(converterContext, creationBehaviour, isInsertable, pasteEnabledInManifest, viewConfiguration) {
    // If create is not visible -> it's not enabled
    // If create is visible ->
    // 	 If it's in the ListReport -> not enabled
    //	 If it's insertable -> enabled
    return ifElse(pasteEnabledInManifest && equal(getCreateVisible(converterContext, creationBehaviour.mode, isInsertable, viewConfiguration), true), converterContext.getTemplateType() === TemplateType.ObjectPage && isInsertable, false);
  }
  /**
   * Returns a JSON string containing the sort conditions for the presentation variant.
   *
   * @param converterContext The instance of the converter context
   * @param {PresentationVariantTypeTypes | undefined} presentationVariantAnnotation Presentation variant annotation
   * @param columns Table columns processed by the converter
   * @returns {string | undefined} Sort conditions for a presentation variant.
   */


  _exports.getPasteEnabled = getPasteEnabled;

  function getSortConditions(converterContext, presentationVariantAnnotation, columns) {
    // Currently navigation property is not supported as sorter
    var nonSortableProperties = getNonSortablePropertiesRestrictions(converterContext.getEntitySet());
    var sortConditions;

    if (presentationVariantAnnotation !== null && presentationVariantAnnotation !== void 0 && presentationVariantAnnotation.SortOrder) {
      var sorters = [];
      var conditions = {
        sorters: sorters
      };
      presentationVariantAnnotation.SortOrder.forEach(function (condition) {
        var _conditionProperty$$t;

        var conditionProperty = condition.Property;

        if (conditionProperty && nonSortableProperties.indexOf((_conditionProperty$$t = conditionProperty.$target) === null || _conditionProperty$$t === void 0 ? void 0 : _conditionProperty$$t.name) === -1) {
          var infoName = convertPropertyPathsToInfoNames([conditionProperty], columns)[0];

          if (infoName) {
            conditions.sorters.push({
              name: infoName,
              descending: !!condition.Descending
            });
          }
        }
      });
      sortConditions = conditions.sorters.length ? JSON.stringify(conditions) : undefined;
    }

    return sortConditions;
  }
  /**
   * Converts an array of propertyPath to an array of propertyInfo names.
   *
   * @param paths the array to be converted
   * @param columns the array of propertyInfos
   * @returns an array of propertyInfo names
   */


  function convertPropertyPathsToInfoNames(paths, columns) {
    var infoNames = [];
    paths.forEach(function (currentPath) {
      var _currentPath$$target;

      if (currentPath !== null && currentPath !== void 0 && (_currentPath$$target = currentPath.$target) !== null && _currentPath$$target !== void 0 && _currentPath$$target.name) {
        var propertyInfo = columns.find(function (column) {
          var _currentPath$$target2;

          var annotationColumn = column;
          return !annotationColumn.propertyInfos && annotationColumn.relativePath === (currentPath === null || currentPath === void 0 ? void 0 : (_currentPath$$target2 = currentPath.$target) === null || _currentPath$$target2 === void 0 ? void 0 : _currentPath$$target2.name);
        });

        if (propertyInfo) {
          infoNames.push(propertyInfo.name);
        }
      }
    });
    return infoNames;
  }
  /**
   * Returns a JSON string containing Presentation Variant group conditions.
   *
   * @param {PresentationVariantTypeTypes | undefined} presentationVariantAnnotation Presentation variant annotation
   * @param columns Converter processed table columns
   * @returns {string | undefined} Group conditions for a Presentation variant.
   */


  function getGroupConditions(presentationVariantAnnotation, columns) {
    var groupConditions;

    if (presentationVariantAnnotation !== null && presentationVariantAnnotation !== void 0 && presentationVariantAnnotation.GroupBy) {
      var aGroupBy = presentationVariantAnnotation.GroupBy;
      var aGroupLevels = convertPropertyPathsToInfoNames(aGroupBy, columns).map(function (infoName) {
        return {
          name: infoName
        };
      });
      groupConditions = aGroupLevels.length ? JSON.stringify({
        groupLevels: aGroupLevels
      }) : undefined;
    }

    return groupConditions;
  }
  /**
   * Returns a JSON string containing Presentation Variant aggregate conditions.
   *
   * @param {PresentationVariantTypeTypes | undefined} presentationVariantAnnotation Presentation variant annotation
   * @param columns Converter processed table columns
   * @returns {string | undefined} Group conditions for a Presentation variant.
   */


  function getAggregateConditions(presentationVariantAnnotation, columns) {
    var aggregateConditions;

    if (presentationVariantAnnotation !== null && presentationVariantAnnotation !== void 0 && presentationVariantAnnotation.Total) {
      var aTotals = presentationVariantAnnotation.Total;
      var aggregates = {};
      convertPropertyPathsToInfoNames(aTotals, columns).forEach(function (infoName) {
        aggregates[infoName] = {};
      });
      aggregateConditions = JSON.stringify(aggregates);
    }

    return aggregateConditions;
  }

  function getTableAnnotationConfiguration(lineItemAnnotation, visualizationPath, converterContext, tableManifestConfiguration, columns, presentationVariantAnnotation, viewConfiguration) {
    var _converterContext$get20, _converterContext$get21, _converterContext$get22;

    // Need to get the target
    var _splitPath2 = splitPath(visualizationPath),
        navigationPropertyPath = _splitPath2.navigationPropertyPath;

    var title = (_converterContext$get20 = converterContext.getDataModelObjectPath().targetEntityType.annotations) === null || _converterContext$get20 === void 0 ? void 0 : (_converterContext$get21 = _converterContext$get20.UI) === null || _converterContext$get21 === void 0 ? void 0 : (_converterContext$get22 = _converterContext$get21.HeaderInfo) === null || _converterContext$get22 === void 0 ? void 0 : _converterContext$get22.TypeNamePlural;
    var entitySet = converterContext.getDataModelObjectPath().targetEntitySet;
    var pageManifestSettings = converterContext.getManifestWrapper();
    var hasAbsolutePath = navigationPropertyPath.length === 0,
        p13nMode = getP13nMode(visualizationPath, converterContext, tableManifestConfiguration),
        id = navigationPropertyPath ? TableID(visualizationPath) : TableID(converterContext.getContextPath(), "LineItem");
    var targetCapabilities = getCapabilityRestriction(converterContext);
    var isDeleteButtonVisible = getDeleteVisible(converterContext, navigationPropertyPath, targetCapabilities.isDeletable, viewConfiguration);
    var selectionMode = getSelectionMode(lineItemAnnotation, visualizationPath, converterContext, hasAbsolutePath, targetCapabilities, isDeleteButtonVisible);
    var threshold = navigationPropertyPath ? 10 : 30;

    if (presentationVariantAnnotation !== null && presentationVariantAnnotation !== void 0 && presentationVariantAnnotation.MaxItems) {
      threshold = presentationVariantAnnotation.MaxItems.valueOf();
    }

    var navigationTargetPath = getNavigationTargetPath(converterContext, navigationPropertyPath);
    var navigationSettings = pageManifestSettings.getNavigationConfiguration(navigationTargetPath);

    var creationBehaviour = _getCreationBehaviour(lineItemAnnotation, tableManifestConfiguration, converterContext, navigationSettings);

    var isParentDeletable, parentEntitySetDeletable;

    if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
      var _isParentDeletable;

      isParentDeletable = isPathDeletable(converterContext.getDataModelObjectPath(), undefined, true);

      if ((_isParentDeletable = isParentDeletable) !== null && _isParentDeletable !== void 0 && _isParentDeletable.currentEntityRestriction) {
        parentEntitySetDeletable = undefined;
      } else {
        parentEntitySetDeletable = isParentDeletable ? compileBinding(isParentDeletable, true) : isParentDeletable;
      }
    }

    var dataModelObjectPath = converterContext.getDataModelObjectPath();
    var isInsertable = isPathInsertable(dataModelObjectPath);
    var variantManagement = pageManifestSettings.getVariantManagement();
    var bMassEditVisible = getVisibilityMassEdit(converterContext, tableManifestConfiguration, targetCapabilities, selectionMode);
    var isSearchable = isPathSearchable(converterContext.getDataModelObjectPath());
    return {
      id: id,
      entityName: entitySet ? entitySet.name : "",
      collection: getTargetObjectPath(converterContext.getDataModelObjectPath()),
      navigationPath: navigationPropertyPath,
      row: _getRowConfigurationProperty(lineItemAnnotation, visualizationPath, converterContext, navigationSettings, navigationTargetPath),
      p13nMode: p13nMode,
      show: {
        "delete": compileBinding(isDeleteButtonVisible),
        create: compileBinding(getCreateVisible(converterContext, creationBehaviour === null || creationBehaviour === void 0 ? void 0 : creationBehaviour.mode, isInsertable)),
        paste: compileBinding(getPasteEnabled(converterContext, creationBehaviour, isInsertable, tableManifestConfiguration.enablePaste, viewConfiguration)),
        massEdit: {
          visible: bMassEditVisible,
          enabled: getEnablementMassEdit(converterContext, bMassEditVisible)
        }
      },
      displayMode: isInDisplayMode(converterContext, viewConfiguration),
      create: creationBehaviour,
      selectionMode: selectionMode,
      autoBindOnInit: converterContext.getTemplateType() !== TemplateType.ListReport && converterContext.getTemplateType() !== TemplateType.AnalyticalListPage && !(viewConfiguration && converterContext.getManifestWrapper().hasMultipleVisualizations(viewConfiguration)),
      variantManagement: variantManagement === "Control" && !p13nMode ? VariantManagementType.None : variantManagement,
      threshold: threshold,
      sortConditions: getSortConditions(converterContext, presentationVariantAnnotation, columns),
      parentEntityDeleteEnabled: parentEntitySetDeletable,
      title: title,
      searchable: tableManifestConfiguration.type !== "AnalyticalTable" && !(isConstant(isSearchable) && isSearchable.value === false)
    };
  }

  _exports.getTableAnnotationConfiguration = getTableAnnotationConfiguration;

  function _getExportDataType(dataType) {
    var isComplexProperty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var exportDataType = "String";

    if (isComplexProperty) {
      return exportDataType;
    } else {
      switch (dataType) {
        case "Edm.Decimal":
        case "Edm.Int32":
        case "Edm.Int64":
        case "Edm.Double":
        case "Edm.Byte":
          exportDataType = "Number";
          break;

        case "Edm.DateOfTime":
        case "Edm.Date":
          exportDataType = "Date";
          break;

        case "Edm.DateTimeOffset":
          exportDataType = "DateTime";
          break;

        case "Edm.TimeOfDay":
          exportDataType = "Time";
          break;

        case "Edm.Boolean":
          exportDataType = "Boolean";
          break;

        default:
          exportDataType = "String";
      }
    }

    return exportDataType;
  }

  function isInDisplayMode(converterContext, viewConfiguration) {
    var templateType = converterContext.getTemplateType();

    if (templateType === TemplateType.ListReport || templateType === TemplateType.AnalyticalListPage || viewConfiguration && converterContext.getManifestWrapper().hasMultipleVisualizations(viewConfiguration)) {
      return true;
    } // updatable will be handled at the property level


    return false;
  }
  /**
   * Split the visualization path into the navigation property path and annotation.
   *
   * @param visualizationPath
   * @returns {object}
   */


  function splitPath(visualizationPath) {
    var _visualizationPath$sp = visualizationPath.split("@"),
        _visualizationPath$sp2 = _slicedToArray(_visualizationPath$sp, 2),
        navigationPropertyPath = _visualizationPath$sp2[0],
        annotationPath = _visualizationPath$sp2[1];

    if (navigationPropertyPath.lastIndexOf("/") === navigationPropertyPath.length - 1) {
      // Drop trailing slash
      navigationPropertyPath = navigationPropertyPath.substr(0, navigationPropertyPath.length - 1);
    }

    return {
      navigationPropertyPath: navigationPropertyPath,
      annotationPath: annotationPath
    };
  }

  _exports.splitPath = splitPath;

  function getSelectionVariantConfiguration(selectionVariantPath, converterContext) {
    var resolvedTarget = converterContext.getEntityTypeAnnotation(selectionVariantPath);
    var selection = resolvedTarget.annotation;

    if (selection) {
      var _selection$SelectOpti, _selection$Text;

      var propertyNames = [];
      (_selection$SelectOpti = selection.SelectOptions) === null || _selection$SelectOpti === void 0 ? void 0 : _selection$SelectOpti.forEach(function (selectOption) {
        var propertyName = selectOption.PropertyName;
        var PropertyPath = propertyName.value;

        if (propertyNames.indexOf(PropertyPath) === -1) {
          propertyNames.push(PropertyPath);
        }
      });
      return {
        text: selection === null || selection === void 0 ? void 0 : (_selection$Text = selection.Text) === null || _selection$Text === void 0 ? void 0 : _selection$Text.toString(),
        propertyNames: propertyNames
      };
    }

    return undefined;
  }

  _exports.getSelectionVariantConfiguration = getSelectionVariantConfiguration;

  function getTableManifestConfiguration(lineItemAnnotation, visualizationPath, converterContext) {
    var _tableSettings$quickV5, _converterContext$get23;

    var checkCondensedLayout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var tableManifestSettings = converterContext.getManifestControlConfiguration(visualizationPath);
    var tableSettings = tableManifestSettings && tableManifestSettings.tableSettings || {};
    var quickSelectionVariant;
    var quickFilterPaths = [];
    var enableExport = true;
    var creationMode = CreationMode.NewPage;
    var filters;
    var createAtEnd = true;
    var disableAddRowButtonForEmptyData = false;
    var customValidationFunction;
    var condensedTableLayout = false;
    var hideTableTitle = false;
    var tableType = "ResponsiveTable";
    var enableFullScreen = false;
    var selectionLimit = 200;
    var multiSelectMode;
    var enableAutoColumnWidth = true;
    var enablePaste = converterContext.getTemplateType() === "ObjectPage";
    var isCondensedTableLayoutCompliant = checkCondensedLayout && converterContext.getManifestWrapper().isCondensedLayoutCompliant();
    var entityType = converterContext.getEntityType();
    var aggregationHelper = new AggregationHelper(entityType, converterContext);

    if (lineItemAnnotation) {
      var _tableSettings$quickV, _tableSettings$quickV2, _tableSettings$creati, _tableSettings$creati2, _tableSettings$creati3, _tableSettings$creati4, _tableSettings$creati5, _tableSettings$quickV4;

      var targetEntityType = converterContext.getAnnotationEntityType(lineItemAnnotation);
      tableSettings === null || tableSettings === void 0 ? void 0 : (_tableSettings$quickV = tableSettings.quickVariantSelection) === null || _tableSettings$quickV === void 0 ? void 0 : (_tableSettings$quickV2 = _tableSettings$quickV.paths) === null || _tableSettings$quickV2 === void 0 ? void 0 : _tableSettings$quickV2.forEach(function (path) {
        var _tableSettings$quickV3;

        quickSelectionVariant = targetEntityType.resolvePath("@" + path.annotationPath); // quickSelectionVariant = converterContext.getEntityTypeAnnotation(path.annotationPath);

        if (quickSelectionVariant) {
          quickFilterPaths.push({
            annotationPath: path.annotationPath
          });
        }

        filters = {
          quickFilters: {
            enabled: converterContext.getTemplateType() === TemplateType.ListReport ? "{= ${pageInternal>hasPendingFilters} !== true}" : true,
            showCounts: tableSettings === null || tableSettings === void 0 ? void 0 : (_tableSettings$quickV3 = tableSettings.quickVariantSelection) === null || _tableSettings$quickV3 === void 0 ? void 0 : _tableSettings$quickV3.showCounts,
            paths: quickFilterPaths
          }
        };
      });
      creationMode = ((_tableSettings$creati = tableSettings.creationMode) === null || _tableSettings$creati === void 0 ? void 0 : _tableSettings$creati.name) || creationMode;
      createAtEnd = ((_tableSettings$creati2 = tableSettings.creationMode) === null || _tableSettings$creati2 === void 0 ? void 0 : _tableSettings$creati2.createAtEnd) !== undefined ? (_tableSettings$creati3 = tableSettings.creationMode) === null || _tableSettings$creati3 === void 0 ? void 0 : _tableSettings$creati3.createAtEnd : true;
      customValidationFunction = (_tableSettings$creati4 = tableSettings.creationMode) === null || _tableSettings$creati4 === void 0 ? void 0 : _tableSettings$creati4.customValidationFunction; // if a custom validation function is provided, disableAddRowButtonForEmptyData should not be considered, i.e. set to false

      disableAddRowButtonForEmptyData = !customValidationFunction ? !!((_tableSettings$creati5 = tableSettings.creationMode) !== null && _tableSettings$creati5 !== void 0 && _tableSettings$creati5.disableAddRowButtonForEmptyData) : false;
      condensedTableLayout = tableSettings.condensedTableLayout !== undefined ? tableSettings.condensedTableLayout : false;
      hideTableTitle = !!((_tableSettings$quickV4 = tableSettings.quickVariantSelection) !== null && _tableSettings$quickV4 !== void 0 && _tableSettings$quickV4.hideTableTitle);
      tableType = (tableSettings === null || tableSettings === void 0 ? void 0 : tableSettings.type) || "ResponsiveTable";

      if (converterContext.getTemplateType() !== "ObjectPage") {
        if ((tableSettings === null || tableSettings === void 0 ? void 0 : tableSettings.type) === "AnalyticalTable" && !aggregationHelper.isAnalyticsSupported()) {
          tableType = "GridTable";
        }

        if (!(tableSettings !== null && tableSettings !== void 0 && tableSettings.type)) {
          if (converterContext.getManifestWrapper().isDesktop() && aggregationHelper.isAnalyticsSupported()) {
            tableType = "AnalyticalTable";
          } else {
            tableType = "ResponsiveTable";
          }
        }
      }

      enableFullScreen = tableSettings.enableFullScreen || false;

      if (enableFullScreen === true && converterContext.getTemplateType() === TemplateType.ListReport) {
        enableFullScreen = false;
        converterContext.getDiagnostics().addIssue(IssueCategory.Manifest, IssueSeverity.Low, IssueType.FULLSCREENMODE_NOT_ON_LISTREPORT);
      }

      selectionLimit = tableSettings.selectAll === true || tableSettings.selectionLimit === 0 ? 0 : tableSettings.selectionLimit || 200;

      if (tableType === "ResponsiveTable") {
        if (converterContext.getTemplateType() === TemplateType.ListReport || converterContext.getTemplateType() === TemplateType.AnalyticalListPage) {
          multiSelectMode = !!tableSettings.selectAll ? "Default" : "ClearAll";
        }

        if (converterContext.getTemplateType() === TemplateType.ObjectPage) {
          if (converterContext.getManifestWrapper().useIconTabBar()) {
            multiSelectMode = !!tableSettings.selectAll ? "Default" : "ClearAll";
          } else {
            multiSelectMode = tableSettings.selectAll === false ? "ClearAll" : "Default";
          }
        }
      }

      enablePaste = converterContext.getTemplateType() === "ObjectPage" && tableSettings.enablePaste !== false;
      enableExport = tableSettings.enableExport !== undefined ? tableSettings.enableExport : converterContext.getTemplateType() !== "ObjectPage" || enablePaste;
    }

    return {
      filters: filters,
      type: tableType,
      enableFullScreen: enableFullScreen,
      headerVisible: !(quickSelectionVariant && hideTableTitle),
      enableExport: enableExport,
      creationMode: creationMode,
      createAtEnd: createAtEnd,
      disableAddRowButtonForEmptyData: disableAddRowButtonForEmptyData,
      customValidationFunction: customValidationFunction,
      useCondensedTableLayout: condensedTableLayout && isCondensedTableLayoutCompliant,
      selectionLimit: selectionLimit,
      multiSelectMode: multiSelectMode,
      enablePaste: enablePaste,
      showRowCount: !(tableSettings !== null && tableSettings !== void 0 && (_tableSettings$quickV5 = tableSettings.quickVariantSelection) !== null && _tableSettings$quickV5 !== void 0 && _tableSettings$quickV5.showCounts) && !((_converterContext$get23 = converterContext.getManifestWrapper().getViewConfiguration()) !== null && _converterContext$get23 !== void 0 && _converterContext$get23.showCounts),
      enableMassEdit: tableSettings === null || tableSettings === void 0 ? void 0 : tableSettings.enableMassEdit,
      enableAutoColumnWidth: enableAutoColumnWidth
    };
  }

  _exports.getTableManifestConfiguration = getTableManifestConfiguration;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRhYmxlLnRzIl0sIm5hbWVzIjpbIkNvbHVtblR5cGUiLCJnZXRUYWJsZUFjdGlvbnMiLCJsaW5lSXRlbUFubm90YXRpb24iLCJ2aXN1YWxpemF0aW9uUGF0aCIsImNvbnZlcnRlckNvbnRleHQiLCJuYXZpZ2F0aW9uU2V0dGluZ3MiLCJhVGFibGVBY3Rpb25zIiwiZ2V0VGFibGVBbm5vdGF0aW9uQWN0aW9ucyIsImFBbm5vdGF0aW9uQWN0aW9ucyIsInRhYmxlQWN0aW9ucyIsImFIaWRkZW5BY3Rpb25zIiwiaGlkZGVuVGFibGVBY3Rpb25zIiwiaW5zZXJ0Q3VzdG9tRWxlbWVudHMiLCJnZXRBY3Rpb25zRnJvbU1hbmlmZXN0IiwiZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbiIsImFjdGlvbnMiLCJpc05hdmlnYWJsZSIsImVuYWJsZU9uU2VsZWN0IiwiZW5hYmxlQXV0b1Njcm9sbCIsImVuYWJsZWQiLCJkZWZhdWx0VmFsdWVzRXh0ZW5zaW9uRnVuY3Rpb24iLCJnZXRUYWJsZUNvbHVtbnMiLCJhbm5vdGF0aW9uQ29sdW1ucyIsImdldENvbHVtbnNGcm9tQW5ub3RhdGlvbnMiLCJtYW5pZmVzdENvbHVtbnMiLCJnZXRDb2x1bW5zRnJvbU1hbmlmZXN0IiwiY29sdW1ucyIsImdldEFubm90YXRpb25FbnRpdHlUeXBlIiwid2lkdGgiLCJhdmFpbGFiaWxpdHkiLCJzZXR0aW5ncyIsImhvcml6b250YWxBbGlnbiIsImZvcm1hdE9wdGlvbnMiLCJnZXRBZ2dyZWdhdGVEZWZpbml0aW9uc0Zyb21FbnRpdHlUeXBlIiwiZW50aXR5VHlwZSIsInRhYmxlQ29sdW1ucyIsImFnZ3JlZ2F0aW9uSGVscGVyIiwiQWdncmVnYXRpb25IZWxwZXIiLCJmaW5kQ29sdW1uRnJvbVBhdGgiLCJwYXRoIiwiZmluZCIsImNvbHVtbiIsImFubm90YXRpb25Db2x1bW4iLCJwcm9wZXJ0eUluZm9zIiwidW5kZWZpbmVkIiwicmVsYXRpdmVQYXRoIiwiaXNBbmFseXRpY3NTdXBwb3J0ZWQiLCJtQ3VycmVuY3lPclVuaXRQcm9wZXJ0aWVzIiwiU2V0IiwiZm9yRWFjaCIsIm9Db2x1bW4iLCJvVGFibGVDb2x1bW4iLCJ1bml0IiwiYWRkIiwiYUN1c3RvbUFnZ3JlZ2F0ZUFubm90YXRpb25zIiwiZ2V0Q3VzdG9tQWdncmVnYXRlRGVmaW5pdGlvbnMiLCJtUmF3RGVmaW5pdGlvbnMiLCJhbm5vdGF0aW9uIiwib0FnZ3JlZ2F0ZWRQcm9wZXJ0eSIsIl9lbnRpdHlUeXBlIiwiZW50aXR5UHJvcGVydGllcyIsIm9Qcm9wZXJ0eSIsIm5hbWUiLCJxdWFsaWZpZXIiLCJhQ29udGV4dERlZmluaW5nUHJvcGVydGllcyIsImFubm90YXRpb25zIiwiQWdncmVnYXRpb24iLCJDb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzIiwibWFwIiwib0N0eERlZlByb3BlcnR5IiwidmFsdWUiLCJtUmVzdWx0IiwiYVJhd0NvbnRleHREZWZpbmluZ1Byb3BlcnRpZXMiLCJoYXMiLCJpc0RhdGFQb2ludEZha2VUYXJnZXRQcm9wZXJ0eSIsImRlZmF1bHRBZ2dyZWdhdGUiLCJjb250ZXh0RGVmaW5pbmdQcm9wZXJ0eU5hbWUiLCJwdXNoIiwibGVuZ3RoIiwiY29udGV4dERlZmluaW5nUHJvcGVydGllcyIsInVwZGF0ZVRhYmxlVmlzdWFsaXphdGlvbkZvckFuYWx5dGljcyIsInRhYmxlVmlzdWFsaXphdGlvbiIsInByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uIiwiY29udHJvbCIsInR5cGUiLCJhZ2dyZWdhdGVzRGVmaW5pdGlvbnMiLCJlbmFibGVBbmFseXRpY3MiLCJhZ2dyZWdhdGVzIiwiZ3JvdXBDb25kaXRpb25zIiwiZ2V0R3JvdXBDb25kaXRpb25zIiwiYWdncmVnYXRlQ29uZGl0aW9ucyIsImdldEFnZ3JlZ2F0ZUNvbmRpdGlvbnMiLCJnZXROYXZpZ2F0aW9uVGFyZ2V0UGF0aCIsIm5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgiLCJtYW5pZmVzdFdyYXBwZXIiLCJnZXRNYW5pZmVzdFdyYXBwZXIiLCJnZXROYXZpZ2F0aW9uQ29uZmlndXJhdGlvbiIsIm5hdkNvbmZpZyIsIk9iamVjdCIsImtleXMiLCJkYXRhTW9kZWxQYXRoIiwiZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCIsImNvbnRleHRQYXRoIiwiZ2V0Q29udGV4dFBhdGgiLCJuYXZDb25maWdGb3JDb250ZXh0UGF0aCIsInRhcmdldEVudGl0eVNldCIsInN0YXJ0aW5nRW50aXR5U2V0IiwidXBkYXRlTGlua2VkUHJvcGVydGllcyIsImZpbmRDb2x1bW5CeVBhdGgiLCJvUHJvcCIsInNVbml0IiwiZ2V0QXNzb2NpYXRlZEN1cnJlbmN5UHJvcGVydHkiLCJnZXRBc3NvY2lhdGVkVW5pdFByb3BlcnR5Iiwib1VuaXRDb2x1bW4iLCJkaXNwbGF5TW9kZSIsImdldERpc3BsYXlNb2RlIiwidGV4dEFubm90YXRpb24iLCJDb21tb24iLCJUZXh0IiwiaXNQYXRoRXhwcmVzc2lvbiIsIm9UZXh0Q29sdW1uIiwidGV4dEFycmFuZ2VtZW50IiwidGV4dFByb3BlcnR5IiwibW9kZSIsImNyZWF0ZVRhYmxlVmlzdWFsaXphdGlvbiIsImlzQ29uZGVuc2VkVGFibGVMYXlvdXRDb21wbGlhbnQiLCJ2aWV3Q29uZmlndXJhdGlvbiIsInRhYmxlTWFuaWZlc3RDb25maWciLCJnZXRUYWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbiIsInNwbGl0UGF0aCIsIm5hdmlnYXRpb25UYXJnZXRQYXRoIiwib3BlcmF0aW9uQXZhaWxhYmxlTWFwIiwiZ2V0T3BlcmF0aW9uQXZhaWxhYmxlTWFwIiwib1Zpc3VhbGl6YXRpb24iLCJWaXN1YWxpemF0aW9uVHlwZSIsIlRhYmxlIiwiZ2V0VGFibGVBbm5vdGF0aW9uQ29uZmlndXJhdGlvbiIsInJlbW92ZUR1cGxpY2F0ZUFjdGlvbnMiLCJlbmFibGVEYXRhU3RhdGVGaWx0ZXIiLCJnZXRUZW1wbGF0ZVR5cGUiLCJKU09OIiwic3RyaW5naWZ5Iiwib3BlcmF0aW9uQXZhaWxhYmxlUHJvcGVydGllcyIsImdldE9wZXJhdGlvbkF2YWlsYWJsZVByb3BlcnRpZXMiLCJjcmVhdGVEZWZhdWx0VGFibGVWaXN1YWxpemF0aW9uIiwiZ2V0Q29sdW1uc0Zyb21FbnRpdHlUeXBlIiwiZ2V0RW50aXR5VHlwZSIsImFkZFRvTWFwIiwia2V5IiwiZGF0YUZpZWxkIiwiJFR5cGUiLCJhY3Rpb25OYW1lIiwiQWN0aW9uIiwiaW5kZXhPZiIsIkRldGVybWluaW5nIiwiYWN0aW9uVGFyZ2V0IiwiQWN0aW9uVGFyZ2V0IiwiQ29yZSIsIk9wZXJhdGlvbkF2YWlsYWJsZSIsInBhcmFtZXRlcnMiLCJiaW5kaW5nUGFyYW1ldGVyRnVsbE5hbWUiLCJmdWxseVF1YWxpZmllZE5hbWUiLCJ0YXJnZXRFeHByZXNzaW9uIiwiYW5ub3RhdGlvbkV4cHJlc3Npb24iLCJiaW5kaW5nQ29udGV4dFBhdGhWaXNpdG9yIiwicHJvcGVydGllcyIsInByb3BlcnR5TmFtZSIsInNpemUiLCJ0aXRsZVByb3BlcnR5IiwiVUkiLCJIZWFkZXJJbmZvIiwiVGl0bGUiLCJWYWx1ZSIsIkFycmF5IiwiZnJvbSIsImpvaW4iLCJnZXRVSUhpZGRlbkV4cEZvckFjdGlvbnNSZXF1aXJpbmdDb250ZXh0IiwiY3VycmVudEVudGl0eVR5cGUiLCJjb250ZXh0RGF0YU1vZGVsT2JqZWN0UGF0aCIsImlzRW50aXR5U2V0IiwiYVVpSGlkZGVuUGF0aEV4cHJlc3Npb25zIiwiaXNCb3VuZCIsInNvdXJjZUVudGl0eVR5cGUiLCJSZXF1aXJlc0NvbnRleHQiLCJJbmxpbmUiLCJ2YWx1ZU9mIiwiSGlkZGVuIiwiZXF1YWwiLCJnZXRCaW5kaW5nRXhwRnJvbUNvbnRleHQiLCJzb3VyY2UiLCJzRXhwcmVzc2lvbiIsInZpc2libGUiLCJzUGF0aCIsInN1YnN0cmluZyIsImFTcGxpdFBhdGgiLCJzcGxpdCIsInNOYXZpZ2F0aW9uUGF0aCIsInRhcmdldE9iamVjdCIsIl90eXBlIiwicGFydG5lciIsImJpbmRpbmdFeHByZXNzaW9uIiwic2xpY2UiLCJjb25zdGFudCIsImhhc0JvdW5kQWN0aW9uc0Fsd2F5c1Zpc2libGVJblRvb2xCYXIiLCJzb21lIiwiaGFzQ3VzdG9tQWN0aW9uc0Fsd2F5c1Zpc2libGVJblRvb2xCYXIiLCJtYW5pZmVzdEFjdGlvbnMiLCJhY3Rpb25LZXkiLCJhY3Rpb24iLCJyZXF1aXJlc1NlbGVjdGlvbiIsInRvU3RyaW5nIiwiZ2V0VmlzaWJsZUV4cEZvckN1c3RvbUFjdGlvbnNSZXF1aXJpbmdDb250ZXh0IiwiYVZpc2libGVQYXRoRXhwcmVzc2lvbnMiLCJyZXNvbHZlQmluZGluZ1N0cmluZyIsImdldENhcGFiaWxpdHlSZXN0cmljdGlvbiIsImlzRGVsZXRhYmxlIiwiaXNQYXRoRGVsZXRhYmxlIiwiaXNVcGRhdGFibGUiLCJpc1BhdGhVcGRhdGFibGUiLCJpc0NvbnN0YW50IiwiZ2V0U2VsZWN0aW9uTW9kZSIsInRhcmdldENhcGFiaWxpdGllcyIsImlzRGVsZXRlQnV0dG9uVmlzaWJsZSIsIlNlbGVjdGlvbk1vZGUiLCJOb25lIiwidGFibGVNYW5pZmVzdFNldHRpbmdzIiwic2VsZWN0aW9uTW9kZSIsInRhYmxlU2V0dGluZ3MiLCJhSGlkZGVuQmluZGluZ0V4cHJlc3Npb25zIiwiYVZpc2libGVCaW5kaW5nRXhwcmVzc2lvbnMiLCJpc1BhcmVudERlbGV0YWJsZSIsInBhcmVudEVudGl0eVNldERlbGV0YWJsZSIsIlRlbXBsYXRlVHlwZSIsIk9iamVjdFBhZ2UiLCJjb21waWxlQmluZGluZyIsImlmRWxzZSIsIkF1dG8iLCJNdWx0aSIsIm9yIiwiY29uY2F0IiwidGFibGVBY3Rpb24iLCJpc0RhdGFGaWVsZEZvckFjdGlvbkFic3RyYWN0IiwiS2V5SGVscGVyIiwiZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkIiwiQWN0aW9uVHlwZSIsIkRhdGFGaWVsZEZvckFjdGlvbiIsImFubm90YXRpb25QYXRoIiwiZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aCIsIm5vdCIsImdldFJlbGF0aXZlTW9kZWxQYXRoRnVuY3Rpb24iLCJEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24iLCJEZWZhdWx0IiwiZ2V0SGlnaGxpZ2h0Um93QmluZGluZyIsImNyaXRpY2FsaXR5QW5ub3RhdGlvbiIsImlzRHJhZnRSb290IiwidGFyZ2V0RW50aXR5VHlwZSIsImRlZmF1bHRIaWdobGlnaHRSb3dEZWZpbml0aW9uIiwiTWVzc2FnZVR5cGUiLCJnZXRNZXNzYWdlVHlwZUZyb21Dcml0aWNhbGl0eVR5cGUiLCJEcmFmdCIsIklzTmV3T2JqZWN0IiwiSW5mb3JtYXRpb24iLCJmb3JtYXRSZXN1bHQiLCJ0YWJsZUZvcm1hdHRlcnMiLCJyb3dIaWdobGlnaHRpbmciLCJfZ2V0Q3JlYXRpb25CZWhhdmlvdXIiLCJ0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbiIsIm5hdmlnYXRpb24iLCJjcmVhdGUiLCJkZXRhaWwiLCJvdXRib3VuZCIsIm91dGJvdW5kRGV0YWlsIiwibmV3QWN0aW9uIiwidGFyZ2V0QW5ub3RhdGlvbnMiLCJnZXRFbnRpdHlTZXQiLCJEcmFmdFJvb3QiLCJOZXdBY3Rpb24iLCJTZXNzaW9uIiwiU3RpY2t5U2Vzc2lvblN1cHBvcnRlZCIsImNyZWF0aW9uTW9kZSIsIkNyZWF0aW9uTW9kZSIsIkNyZWF0aW9uUm93IiwiRXJyb3IiLCJyb3V0ZSIsImFwcGVuZCIsImNyZWF0ZUF0RW5kIiwibmF2aWdhdGVUb1RhcmdldCIsIk5ld1BhZ2UiLCJfZ2V0Um93Q29uZmlndXJhdGlvblByb3BlcnR5IiwidGFyZ2V0UGF0aCIsInByZXNzUHJvcGVydHkiLCJuYXZpZ2F0aW9uVGFyZ2V0IiwiY3JpdGljYWxpdHlQcm9wZXJ0eSIsImRpc3BsYXkiLCJ0YXJnZXQiLCJDcml0aWNhbGl0eSIsIkRyYWZ0Tm9kZSIsInJvd05hdmlnYXRlZEV4cHJlc3Npb24iLCJuYXZpZ2F0ZWRSb3ciLCJwcmVzcyIsInJvd05hdmlnYXRlZCIsImNvbHVtbnNUb0JlQ3JlYXRlZCIsIm5vblNvcnRhYmxlQ29sdW1ucyIsInRhYmxlVHlwZSIsInByb3BlcnR5IiwiZXhpc3RzIiwidGFyZ2V0VHlwZSIsInJlbGF0ZWRQcm9wZXJ0aWVzSW5mbyIsImNvbGxlY3RSZWxhdGVkUHJvcGVydGllcyIsInJlbGF0ZWRQcm9wZXJ0eU5hbWVzIiwiYWRkaXRpb25hbFByb3BlcnR5TmFtZXMiLCJhZGRpdGlvbmFsUHJvcGVydGllcyIsImNvbHVtbkluZm8iLCJnZXRDb2x1bW5EZWZpbml0aW9uRnJvbVByb3BlcnR5Iiwic2VtYW50aWNLZXlzIiwiZ2V0QW5ub3RhdGlvbnNCeVRlcm0iLCJvQ29sdW1uRHJhZnRJbmRpY2F0b3IiLCJnZXREZWZhdWx0RHJhZnRJbmRpY2F0b3JGb3JDb2x1bW4iLCJleHBvcnRTZXR0aW5ncyIsInRlbXBsYXRlIiwiZXhwb3J0U2V0dGluZ3NUZW1wbGF0ZSIsIndyYXAiLCJleHBvcnRTZXR0aW5nc1dyYXBwaW5nIiwiYWRkaXRpb25hbFByb3BlcnR5SW5mb3MiLCJmdWxsUHJvcGVydHlQYXRoIiwidXNlRGF0YUZpZWxkUHJlZml4IiwiYXZhaWxhYmxlRm9yQWRhcHRhdGlvbiIsInJlcGxhY2VTcGVjaWFsQ2hhcnMiLCJzZW1hbnRpY09iamVjdEFubm90YXRpb25QYXRoIiwiZ2V0U2VtYW50aWNPYmplY3RQYXRoIiwiaXNIaWRkZW4iLCJncm91cFBhdGgiLCJfc2xpY2VBdFNsYXNoIiwiaXNHcm91cCIsImlzRGF0YVBvaW50RmFrZVByb3BlcnR5IiwiZXhwb3J0VHlwZSIsIl9nZXRFeHBvcnREYXRhVHlwZSIsInNEYXRlSW5wdXRGb3JtYXQiLCJkYXRhVHlwZSIsImdldERhdGFGaWVsZERhdGFUeXBlIiwicHJvcGVydHlUeXBlQ29uZmlnIiwiZ2V0VHlwZUNvbmZpZyIsIm9UeXBlQ29uZmlnIiwiY2xhc3NOYW1lIiwib0Zvcm1hdE9wdGlvbnMiLCJvQ29uc3RyYWludHMiLCJjb25zdHJhaW50cyIsImdldFRhcmdldFZhbHVlT25EYXRhUG9pbnQiLCJpbnB1dEZvcm1hdCIsInNjYWxlIiwiZGVsaW1pdGVyIiwidHJ1ZVZhbHVlIiwiZmFsc2VWYWx1ZSIsImlzR3JvdXBhYmxlIiwiaXNQcm9wZXJ0eUdyb3VwYWJsZSIsIkFubm90YXRpb24iLCJsYWJlbCIsIl9nZXRMYWJlbCIsImdyb3VwTGFiZWwiLCJncm91cCIsInNlbWFudGljT2JqZWN0UGF0aCIsIkF2YWlsYWJpbGl0eVR5cGUiLCJBZGFwdGF0aW9uIiwiRGF0YUZpZWxkRGVmYXVsdCIsIlRhcmdldCIsIiR0YXJnZXQiLCJzb3J0YWJsZSIsImlzS2V5IiwiY2FzZVNlbnNpdGl2ZSIsImlzRmlsdGVyaW5nQ2FzZVNlbnNpdGl2ZSIsInR5cGVDb25maWciLCJ2aXN1YWxTZXR0aW5ncyIsIndpZHRoQ2FsY3VsYXRpb24iLCJfaXNWYWxpZENvbHVtbiIsImlzUHJvcGVydHkiLCJkYXRhRmllbGREZWZhdWx0IiwiTGFiZWwiLCJpc0RhdGFGaWVsZFR5cGVzIiwiX2NyZWF0ZVJlbGF0ZWRDb2x1bW5zIiwiZXhpc3RpbmdDb2x1bW5zIiwicmVsYXRlZENvbHVtbnMiLCJyZWxhdGVkUHJvcGVydHlOYW1lTWFwIiwiZ2V0QWJzb2x1dGVBbm5vdGF0aW9uUGF0aCIsInJlbGF0ZWRDb2x1bW4iLCJuZXdOYW1lIiwicHJvcGVydHlJbmZvIiwiX2dldEFubm90YXRpb25Db2x1bW5OYW1lIiwiX2dldFJlbGF0aXZlUGF0aCIsImlzTGFzdFNsYXNoIiwiaXNMYXN0UGFydCIsImlTbGFzaEluZGV4IiwibGFzdEluZGV4T2YiLCJfaXNDb2x1bW5Tb3J0YWJsZSIsInByb3BlcnR5UGF0aCIsImlzU29ydGFibGUiLCJmaWx0ZXJGdW5jdGlvbnMiLCJDYXBhYmlsaXRpZXMiLCJGaWx0ZXJGdW5jdGlvbnMiLCJnZXRFbnRpdHlDb250YWluZXIiLCJpc0FycmF5IiwiZ2V0RGVmYXVsdEZvcm1hdE9wdGlvbnNGb3JUYWJsZSIsInRleHRMaW5lc0VkaXQiLCJiU2VtYW50aWNLZXlGb3VuZCIsImFTZW1hbnRpY0tleVZhbHVlcyIsImkiLCJoYXNEcmFmdEluZGljYXRvciIsInNlbWFudGlja2V5cyIsImdldE5vblNvcnRhYmxlUHJvcGVydGllc1Jlc3RyaWN0aW9ucyIsImxpbmVJdGVtIiwiY29sbGVjdFJlbGF0ZWRQcm9wZXJ0aWVzUmVjdXJzaXZlbHkiLCJzTGFiZWwiLCJ2aXN1YWxTZXR0aW5nc1RvQmVFeGNsdWRlZCIsImV4Y2x1ZGVQcm9wZXJ0aWVzIiwiaXNEYXRhRmllbGRBbHdheXNIaWRkZW4iLCJIVE1MNSIsIkNzc0RlZmF1bHRzIiwiZXhwb3J0Q29udGFjdFByb3BlcnR5IiwiZXhwb3J0U2V0dGluZ3NDb250YWN0UHJvcGVydHkiLCJfZ2V0UHJvcGVydHlOYW1lcyIsIm1hdGNoZWRQcm9wZXJ0aWVzIiwicmVzb2x2ZVBhdGgiLCJfYXBwZW5kQ3VzdG9tVGVtcGxhdGUiLCJfZ2V0TWFuaWZlc3RPckRlZmF1bHRWYWx1ZSIsImRlZmF1bHRWYWx1ZSIsImlzQW5ub3RhdGlvbkNvbHVtbiIsImludGVybmFsQ29sdW1ucyIsIm1hbmlmZXN0Q29sdW1uIiwidmFsaWRhdGVLZXkiLCJpZCIsImhlYWRlciIsIkhvcml6b250YWxBbGlnbiIsIkJlZ2luIiwiU2xvdCIsInBvc2l0aW9uIiwiYW5jaG9yIiwicGxhY2VtZW50IiwiUGxhY2VtZW50IiwiQWZ0ZXIiLCJpc0FjdGlvbk5hdmlnYWJsZSIsImZpZWxkTGFiZWwiLCJnZXRQMTNuTW9kZSIsInZhcmlhbnRNYW5hZ2VtZW50IiwiZ2V0VmFyaWFudE1hbmFnZW1lbnQiLCJhUGVyc29uYWxpemF0aW9uIiwiYkFuYWx5dGljYWxUYWJsZSIsInBlcnNvbmFsaXphdGlvbiIsInNvcnQiLCJmaWx0ZXIiLCJhZ2dyZWdhdGUiLCJWYXJpYW50TWFuYWdlbWVudFR5cGUiLCJDb250cm9sIiwiZ2V0RGVsZXRlVmlzaWJsZSIsIm5hdmlnYXRpb25QYXRoIiwiaXNUYXJnZXREZWxldGFibGUiLCJjdXJyZW50RW50aXR5U2V0IiwiZGF0YU1vZGVsT2JqZWN0UGF0aCIsInZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMiLCJuYXZpZ2F0aW9uUHJvcGVydGllcyIsIm5hdlByb3AiLCJpc0RlbGV0ZUhpZGRlbkV4cHJlc3Npb24iLCJEZWxldGVIaWRkZW4iLCJzaW5nbGV0b25QYXRoVmlzaXRvciIsImlzRGVsZXRlSGlkZGVuIiwiYklzU3RpY2t5U2Vzc2lvblN1cHBvcnRlZCIsImJJc0RyYWZ0Um9vdCIsImJJc0RyYWZ0Tm9kZSIsImJJc0RyYWZ0UGFyZW50RW50aXR5Rm9yQ29udGFpbm1lbnQiLCJjb250YWluc1RhcmdldCIsImFuZCIsImhhc011bHRpcGxlVmlzdWFsaXphdGlvbnMiLCJBbmFseXRpY2FsTGlzdFBhZ2UiLCJMaXN0UmVwb3J0IiwiaXNCaW5kaW5nIiwiZ2V0RW5hYmxlbWVudE1hc3NFZGl0IiwiYk1hc3NFZGl0VmlzaWJsZSIsImlzUGFyZW50VXBkYXRhYmxlIiwiY3VycmVudEVudGl0eVJlc3RyaWN0aW9uIiwib0V4cHJlc3Npb24iLCJnZXRWaXNpYmlsaXR5TWFzc0VkaXQiLCJlbnRpdHlTZXQiLCJiVXBkYXRlSGlkZGVuIiwiVXBkYXRlSGlkZGVuIiwiYk1hc3NFZGl0RW5hYmxlZCIsImVuYWJsZU1hc3NFZGl0IiwiaVNlbGVjdGlvbkxpbWl0Iiwic2VsZWN0aW9uTGltaXQiLCJJc0VkaXRhYmxlIiwiZ2V0Q3JlYXRlVmlzaWJsZSIsImlzSW5zZXJ0YWJsZSIsImlzQ3JlYXRlSGlkZGVuIiwiQ3JlYXRlSGlkZGVuIiwibmV3QWN0aW9uTmFtZSIsInNob3dDcmVhdGVGb3JOZXdBY3Rpb24iLCJnZXRQYXN0ZUVuYWJsZWQiLCJjcmVhdGlvbkJlaGF2aW91ciIsInBhc3RlRW5hYmxlZEluTWFuaWZlc3QiLCJnZXRTb3J0Q29uZGl0aW9ucyIsIm5vblNvcnRhYmxlUHJvcGVydGllcyIsInNvcnRDb25kaXRpb25zIiwiU29ydE9yZGVyIiwic29ydGVycyIsImNvbmRpdGlvbnMiLCJjb25kaXRpb24iLCJjb25kaXRpb25Qcm9wZXJ0eSIsIlByb3BlcnR5IiwiaW5mb05hbWUiLCJjb252ZXJ0UHJvcGVydHlQYXRoc1RvSW5mb05hbWVzIiwiZGVzY2VuZGluZyIsIkRlc2NlbmRpbmciLCJwYXRocyIsImluZm9OYW1lcyIsImN1cnJlbnRQYXRoIiwiR3JvdXBCeSIsImFHcm91cEJ5IiwiYUdyb3VwTGV2ZWxzIiwiZ3JvdXBMZXZlbHMiLCJUb3RhbCIsImFUb3RhbHMiLCJ0aXRsZSIsIlR5cGVOYW1lUGx1cmFsIiwicGFnZU1hbmlmZXN0U2V0dGluZ3MiLCJoYXNBYnNvbHV0ZVBhdGgiLCJwMTNuTW9kZSIsIlRhYmxlSUQiLCJ0aHJlc2hvbGQiLCJNYXhJdGVtcyIsImlzUGF0aEluc2VydGFibGUiLCJpc1NlYXJjaGFibGUiLCJpc1BhdGhTZWFyY2hhYmxlIiwiZW50aXR5TmFtZSIsImNvbGxlY3Rpb24iLCJnZXRUYXJnZXRPYmplY3RQYXRoIiwicm93Iiwic2hvdyIsInBhc3RlIiwiZW5hYmxlUGFzdGUiLCJtYXNzRWRpdCIsImlzSW5EaXNwbGF5TW9kZSIsImF1dG9CaW5kT25Jbml0IiwicGFyZW50RW50aXR5RGVsZXRlRW5hYmxlZCIsInNlYXJjaGFibGUiLCJpc0NvbXBsZXhQcm9wZXJ0eSIsImV4cG9ydERhdGFUeXBlIiwidGVtcGxhdGVUeXBlIiwic3Vic3RyIiwiZ2V0U2VsZWN0aW9uVmFyaWFudENvbmZpZ3VyYXRpb24iLCJzZWxlY3Rpb25WYXJpYW50UGF0aCIsInJlc29sdmVkVGFyZ2V0IiwiZ2V0RW50aXR5VHlwZUFubm90YXRpb24iLCJzZWxlY3Rpb24iLCJwcm9wZXJ0eU5hbWVzIiwiU2VsZWN0T3B0aW9ucyIsInNlbGVjdE9wdGlvbiIsIlByb3BlcnR5TmFtZSIsIlByb3BlcnR5UGF0aCIsInRleHQiLCJjaGVja0NvbmRlbnNlZExheW91dCIsInF1aWNrU2VsZWN0aW9uVmFyaWFudCIsInF1aWNrRmlsdGVyUGF0aHMiLCJlbmFibGVFeHBvcnQiLCJmaWx0ZXJzIiwiZGlzYWJsZUFkZFJvd0J1dHRvbkZvckVtcHR5RGF0YSIsImN1c3RvbVZhbGlkYXRpb25GdW5jdGlvbiIsImNvbmRlbnNlZFRhYmxlTGF5b3V0IiwiaGlkZVRhYmxlVGl0bGUiLCJlbmFibGVGdWxsU2NyZWVuIiwibXVsdGlTZWxlY3RNb2RlIiwiZW5hYmxlQXV0b0NvbHVtbldpZHRoIiwiaXNDb25kZW5zZWRMYXlvdXRDb21wbGlhbnQiLCJxdWlja1ZhcmlhbnRTZWxlY3Rpb24iLCJxdWlja0ZpbHRlcnMiLCJzaG93Q291bnRzIiwiaXNEZXNrdG9wIiwiZ2V0RGlhZ25vc3RpY3MiLCJhZGRJc3N1ZSIsIklzc3VlQ2F0ZWdvcnkiLCJNYW5pZmVzdCIsIklzc3VlU2V2ZXJpdHkiLCJMb3ciLCJJc3N1ZVR5cGUiLCJGVUxMU0NSRUVOTU9ERV9OT1RfT05fTElTVFJFUE9SVCIsInNlbGVjdEFsbCIsInVzZUljb25UYWJCYXIiLCJoZWFkZXJWaXNpYmxlIiwidXNlQ29uZGVuc2VkVGFibGVMYXlvdXQiLCJzaG93Um93Q291bnQiLCJnZXRWaWV3Q29uZmlndXJhdGlvbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQXlNS0EsVTs7YUFBQUEsVTtBQUFBQSxJQUFBQSxVO0FBQUFBLElBQUFBLFU7QUFBQUEsSUFBQUEsVTtLQUFBQSxVLEtBQUFBLFU7O0FBMEdMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLFdBQVNDLGVBQVQsQ0FDTkMsa0JBRE0sRUFFTkMsaUJBRk0sRUFHTkMsZ0JBSE0sRUFJTkMsa0JBSk0sRUFLUztBQUNmLFFBQU1DLGFBQWEsR0FBR0MseUJBQXlCLENBQUNMLGtCQUFELEVBQXFCQyxpQkFBckIsRUFBd0NDLGdCQUF4QyxDQUEvQztBQUNBLFFBQU1JLGtCQUFrQixHQUFHRixhQUFhLENBQUNHLFlBQXpDO0FBQ0EsUUFBTUMsY0FBYyxHQUFHSixhQUFhLENBQUNLLGtCQUFyQztBQUNBLFdBQU9DLG9CQUFvQixDQUMxQkosa0JBRDBCLEVBRTFCSyxzQkFBc0IsQ0FDckJULGdCQUFnQixDQUFDVSwrQkFBakIsQ0FBaURYLGlCQUFqRCxFQUFv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QUUyTixTQUZBO0FBR05zUSxNQUFBQSxnQkFBZ0IsRUFBRUEsZ0JBSFo7QUFJTmtCLE1BQUFBLGFBQWEsRUFBRSxFQUFFMUIscUJBQXFCLElBQUlPLGNBQTNCLENBSlQ7QUFLTkwsTUFBQUEsWUFBWSxFQUFFQSxZQUxSO0FBTU54UixNQUFBQSxZQUFZLEVBQUVBLFlBTlI7QUFPTk0sTUFBQUEsV0FBVyxFQUFFQSxXQVBQO0FBUU5vUixNQUFBQSwrQkFBK0IsRUFBRUEsK0JBUjNCO0FBU05DLE1BQUFBLHdCQUF3QixFQUFFQSx3QkFUcEI7QUFVTnNCLE1BQUFBLHVCQUF1QixFQUFFckIsb0JBQW9CLElBQUl0YiwrQkFWM0M7QUFXTndXLE1BQUFBLGNBQWMsRUFBRUEsY0FYVjtBQVlOaUYsTUFBQUEsZUFBZSxFQUFFQSxlQVpYO0FBYU4vQixNQUFBQSxXQUFXLEVBQUVBLFdBYlA7QUFjTmtELE1BQUFBLFlBQVksRUFDWCxFQUFDdFcsYUFBRCxhQUFDQSxhQUFELHlDQUFDQSxhQUFhLENBQUVzVixxQkFBaEIsbURBQUMsdUJBQXNDRSxVQUF2QyxLQUFxRCw2QkFBQ3ZqQixnQkFBZ0IsQ0FBQzJGLGtCQUFqQixHQUFzQzJlLG9CQUF0QyxFQUFELG9EQUFDLHdCQUE4RGYsVUFBL0QsQ0FmaEQ7QUFnQk54RixNQUFBQSxjQUFjLEVBQUVoUSxhQUFGLGFBQUVBLGFBQUYsdUJBQUVBLGFBQWEsQ0FBRWdRLGNBaEJ6QjtBQWlCTm9GLE1BQUFBLHFCQUFxQixFQUFFQTtBQWpCakIsS0FBUDtBQW1CQSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0Q3JpdGljYWxpdHlUeXBlLFxuXHREYXRhRmllbGQsXG5cdERhdGFGaWVsZEFic3RyYWN0VHlwZXMsXG5cdERhdGFGaWVsZEZvckFjdGlvbixcblx0RGF0YUZpZWxkRm9yQW5ub3RhdGlvbixcblx0RGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uLFxuXHREYXRhRmllbGRUeXBlcyxcblx0RGF0YVBvaW50LFxuXHRFbnVtVmFsdWUsXG5cdExpbmVJdGVtLFxuXHRQYXRoQW5ub3RhdGlvbkV4cHJlc3Npb24sXG5cdFByZXNlbnRhdGlvblZhcmlhbnRUeXBlVHlwZXMsXG5cdFByb3BlcnR5QW5ub3RhdGlvblZhbHVlLFxuXHRQcm9wZXJ0eVBhdGgsXG5cdFNlbGVjdGlvblZhcmlhbnRUeXBlLFxuXHRTZWxlY3RPcHRpb25UeXBlLFxuXHRVSUFubm90YXRpb25UeXBlc1xufSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcbmltcG9ydCB7XG5cdEFjdGlvblR5cGUsXG5cdEF2YWlsYWJpbGl0eVR5cGUsXG5cdENyZWF0aW9uTW9kZSxcblx0Rm9ybWF0T3B0aW9uc1R5cGUsXG5cdEhvcml6b250YWxBbGlnbixcblx0TWFuaWZlc3RUYWJsZUNvbHVtbixcblx0TmF2aWdhdGlvblNldHRpbmdzQ29uZmlndXJhdGlvbixcblx0TmF2aWdhdGlvblRhcmdldENvbmZpZ3VyYXRpb24sXG5cdFNlbGVjdGlvbk1vZGUsXG5cdFRhYmxlQ29sdW1uU2V0dGluZ3MsXG5cdFRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uLFxuXHRUZW1wbGF0ZVR5cGUsXG5cdFZhcmlhbnRNYW5hZ2VtZW50VHlwZSxcblx0Vmlld1BhdGhDb25maWd1cmF0aW9uLFxuXHRWaXN1YWxpemF0aW9uVHlwZVxufSBmcm9tIFwiLi4vLi4vTWFuaWZlc3RTZXR0aW5nc1wiO1xuaW1wb3J0IHsgRW50aXR5VHlwZSwgUHJvcGVydHkgfSBmcm9tIFwiQHNhcC11eC9hbm5vdGF0aW9uLWNvbnZlcnRlclwiO1xuaW1wb3J0IHsgVGFibGVJRCB9IGZyb20gXCIuLi8uLi9oZWxwZXJzL0lEXCI7XG5pbXBvcnQge1xuXHRBbm5vdGF0aW9uQWN0aW9uLFxuXHRCYXNlQWN0aW9uLFxuXHRDdXN0b21BY3Rpb24sXG5cdGdldEFjdGlvbnNGcm9tTWFuaWZlc3QsXG5cdGlzQWN0aW9uTmF2aWdhYmxlLFxuXHRyZW1vdmVEdXBsaWNhdGVBY3Rpb25zXG59IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9BY3Rpb25cIjtcbmltcG9ydCB7IENvbmZpZ3VyYWJsZU9iamVjdCwgQ3VzdG9tRWxlbWVudCwgaW5zZXJ0Q3VzdG9tRWxlbWVudHMsIFBsYWNlbWVudCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvQ29uZmlndXJhYmxlT2JqZWN0XCI7XG5pbXBvcnQge1xuXHRjb2xsZWN0UmVsYXRlZFByb3BlcnRpZXMsXG5cdGNvbGxlY3RSZWxhdGVkUHJvcGVydGllc1JlY3Vyc2l2ZWx5LFxuXHRDb21wbGV4UHJvcGVydHlJbmZvLFxuXHRnZXREYXRhRmllbGREYXRhVHlwZSxcblx0Z2V0U2VtYW50aWNPYmplY3RQYXRoLFxuXHRpc0RhdGFGaWVsZEFsd2F5c0hpZGRlbixcblx0aXNEYXRhRmllbGRGb3JBY3Rpb25BYnN0cmFjdCxcblx0aXNEYXRhRmllbGRUeXBlc1xufSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9hbm5vdGF0aW9ucy9EYXRhRmllbGRcIjtcbmltcG9ydCB7XG5cdGFuZCxcblx0YW5ub3RhdGlvbkV4cHJlc3Npb24sXG5cdEJpbmRpbmdFeHByZXNzaW9uLFxuXHRiaW5kaW5nRXhwcmVzc2lvbixcblx0QmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uLFxuXHRjb21waWxlQmluZGluZyxcblx0Y29uc3RhbnQsXG5cdGVxdWFsLFxuXHRFeHByZXNzaW9uLFxuXHRFeHByZXNzaW9uT3JQcmltaXRpdmUsXG5cdGZvcm1hdFJlc3VsdCxcblx0aWZFbHNlLFxuXHRpc0JpbmRpbmcsXG5cdGlzQ29uc3RhbnQsXG5cdG5vdCxcblx0b3IsXG5cdHJlc29sdmVCaW5kaW5nU3RyaW5nXG59IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0JpbmRpbmdFeHByZXNzaW9uXCI7XG5pbXBvcnQgeyBEcmFmdCwgYmluZGluZ0NvbnRleHRQYXRoVmlzaXRvciwgc2luZ2xldG9uUGF0aFZpc2l0b3IsIFVJIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9CaW5kaW5nSGVscGVyXCI7XG5pbXBvcnQgeyBLZXlIZWxwZXIgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0tleVwiO1xuaW1wb3J0IHRhYmxlRm9ybWF0dGVycyBmcm9tIFwic2FwL2ZlL2NvcmUvZm9ybWF0dGVycy9UYWJsZUZvcm1hdHRlclwiO1xuaW1wb3J0IHsgTWVzc2FnZVR5cGUgfSBmcm9tIFwic2FwL2ZlL2NvcmUvZm9ybWF0dGVycy9UYWJsZUZvcm1hdHRlclR5cGVzXCI7XG5pbXBvcnQge1xuXHREYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRnZXRUYXJnZXRPYmplY3RQYXRoLFxuXHRpc1BhdGhEZWxldGFibGUsXG5cdGlzUGF0aFNlYXJjaGFibGUsXG5cdGlzUGF0aEluc2VydGFibGUsXG5cdGlzUGF0aFVwZGF0YWJsZVxufSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9EYXRhTW9kZWxQYXRoSGVscGVyXCI7XG5pbXBvcnQgeyByZXBsYWNlU3BlY2lhbENoYXJzIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvU3RhYmxlSWRIZWxwZXJcIjtcbmltcG9ydCB7IElzc3VlQ2F0ZWdvcnksIElzc3VlU2V2ZXJpdHksIElzc3VlVHlwZSB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvSXNzdWVNYW5hZ2VyXCI7XG5cbmltcG9ydCBNYW5pZmVzdFdyYXBwZXIgZnJvbSBcIi4uLy4uL01hbmlmZXN0V3JhcHBlclwiO1xuaW1wb3J0IENvbnZlcnRlckNvbnRleHQgZnJvbSBcIi4uLy4uL0NvbnZlcnRlckNvbnRleHRcIjtcbmltcG9ydCB7XG5cdGlzUHJvcGVydHksXG5cdGdldEFzc29jaWF0ZWRVbml0UHJvcGVydHksXG5cdGdldEFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5LFxuXHRpc1BhdGhFeHByZXNzaW9uLFxuXHRnZXRUYXJnZXRWYWx1ZU9uRGF0YVBvaW50XG59IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL1Byb3BlcnR5SGVscGVyXCI7XG5pbXBvcnQgeyBBZ2dyZWdhdGlvbkhlbHBlciB9IGZyb20gXCIuLi8uLi9oZWxwZXJzL0FnZ3JlZ2F0aW9uXCI7XG5pbXBvcnQgeyBEaXNwbGF5TW9kZSwgZ2V0RGlzcGxheU1vZGUsIGdldFR5cGVDb25maWcgfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9VSUZvcm1hdHRlcnNcIjtcbmltcG9ydCB7IGdldE1lc3NhZ2VUeXBlRnJvbUNyaXRpY2FsaXR5VHlwZSB9IGZyb20gXCIuL0NyaXRpY2FsaXR5XCI7XG5pbXBvcnQgeyBGaWx0ZXJGdW5jdGlvbnMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvZGlzdC9nZW5lcmF0ZWQvQ2FwYWJpbGl0aWVzXCI7XG5pbXBvcnQgeyBnZXROb25Tb3J0YWJsZVByb3BlcnRpZXNSZXN0cmljdGlvbnMgfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9FbnRpdHlTZXRIZWxwZXJcIjtcblxuZXhwb3J0IHR5cGUgVGFibGVBbm5vdGF0aW9uQ29uZmlndXJhdGlvbiA9IHtcblx0YXV0b0JpbmRPbkluaXQ6IGJvb2xlYW47XG5cdGNvbGxlY3Rpb246IHN0cmluZztcblx0dmFyaWFudE1hbmFnZW1lbnQ6IFZhcmlhbnRNYW5hZ2VtZW50VHlwZTtcblx0ZmlsdGVySWQ/OiBzdHJpbmc7XG5cdGlkOiBzdHJpbmc7XG5cdG5hdmlnYXRpb25QYXRoOiBzdHJpbmc7XG5cdHAxM25Nb2RlPzogc3RyaW5nO1xuXHRyb3c/OiB7XG5cdFx0YWN0aW9uPzogc3RyaW5nO1xuXHRcdHByZXNzPzogc3RyaW5nO1xuXHRcdHJvd0hpZ2hsaWdodGluZzogQmluZGluZ0V4cHJlc3Npb248TWVzc2FnZVR5cGU+O1xuXHRcdHJvd05hdmlnYXRlZDogQmluZGluZ0V4cHJlc3Npb248Ym9vbGVhbj47XG5cdH07XG5cdHNlbGVjdGlvbk1vZGU6IHN0cmluZyB8IHVuZGVmaW5lZDtcblx0c2hvdz86IHtcblx0XHRjcmVhdGU/OiBzdHJpbmcgfCBib29sZWFuO1xuXHRcdGRlbGV0ZT86IHN0cmluZyB8IGJvb2xlYW47XG5cdFx0cGFzdGU/OiBCaW5kaW5nRXhwcmVzc2lvbjxib29sZWFuPjtcblx0XHRtYXNzRWRpdD86IHsgdmlzaWJsZTogYm9vbGVhbiB8IHN0cmluZzsgZW5hYmxlZDogYm9vbGVhbiB8IHN0cmluZyB9O1xuXHR9O1xuXHRkaXNwbGF5TW9kZT86IGJvb2xlYW47XG5cdHRocmVzaG9sZDogbnVtYmVyO1xuXHRlbnRpdHlOYW1lOiBzdHJpbmc7XG5cdHNvcnRDb25kaXRpb25zPzogc3RyaW5nO1xuXHRncm91cENvbmRpdGlvbnM/OiBzdHJpbmc7XG5cdGFnZ3JlZ2F0ZUNvbmRpdGlvbnM/OiBzdHJpbmc7XG5cblx0LyoqIENyZWF0ZSBuZXcgZW50cmllcyAqL1xuXHRjcmVhdGU6IENyZWF0ZUJlaGF2aW91ciB8IENyZWF0ZUJlaGF2aW91ckV4dGVybmFsO1xuXHRwYXJlbnRFbnRpdHlEZWxldGVFbmFibGVkPzogQmluZGluZ0V4cHJlc3Npb248Ym9vbGVhbj47XG5cdHRpdGxlOiBzdHJpbmc7XG5cdHNlYXJjaGFibGU6IGJvb2xlYW47XG59O1xuXG4vKipcbiAqIE5ldyBlbnRyaWVzIGFyZSBjcmVhdGVkIHdpdGhpbiB0aGUgYXBwIChkZWZhdWx0IGNhc2UpXG4gKi9cbnR5cGUgQ3JlYXRlQmVoYXZpb3VyID0ge1xuXHRtb2RlOiBDcmVhdGlvbk1vZGU7XG5cdGFwcGVuZDogQm9vbGVhbjtcblx0bmV3QWN0aW9uPzogc3RyaW5nO1xuXHRuYXZpZ2F0ZVRvVGFyZ2V0Pzogc3RyaW5nO1xufTtcblxuLyoqXG4gKiBOZXcgZW50cmllcyBhcmUgY3JlYXRlZCBieSBuYXZpZ2F0aW5nIHRvIHNvbWUgdGFyZ2V0XG4gKi9cbnR5cGUgQ3JlYXRlQmVoYXZpb3VyRXh0ZXJuYWwgPSB7XG5cdG1vZGU6IFwiRXh0ZXJuYWxcIjtcblx0b3V0Ym91bmQ6IHN0cmluZztcblx0b3V0Ym91bmREZXRhaWw6IE5hdmlnYXRpb25UYXJnZXRDb25maWd1cmF0aW9uW1wib3V0Ym91bmREZXRhaWxcIl07XG5cdG5hdmlnYXRpb25TZXR0aW5nczogTmF2aWdhdGlvblNldHRpbmdzQ29uZmlndXJhdGlvbjtcbn07XG5cbmV4cG9ydCB0eXBlIFRhYmxlQ2FwYWJpbGl0eVJlc3RyaWN0aW9uID0ge1xuXHRpc0RlbGV0YWJsZTogYm9vbGVhbjtcblx0aXNVcGRhdGFibGU6IGJvb2xlYW47XG59O1xuXG5leHBvcnQgdHlwZSBUYWJsZUZpbHRlcnNDb25maWd1cmF0aW9uID0ge1xuXHRlbmFibGVkPzogc3RyaW5nIHwgYm9vbGVhbjtcblx0cGF0aHM6IFtcblx0XHR7XG5cdFx0XHRhbm5vdGF0aW9uUGF0aDogc3RyaW5nO1xuXHRcdH1cblx0XTtcblx0c2hvd0NvdW50cz86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgdHlwZSBTZWxlY3Rpb25WYXJpYW50Q29uZmlndXJhdGlvbiA9IHtcblx0cHJvcGVydHlOYW1lczogc3RyaW5nW107XG5cdHRleHQ/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBUYWJsZUNvbnRyb2xDb25maWd1cmF0aW9uID0ge1xuXHRjcmVhdGVBdEVuZDogYm9vbGVhbjtcblx0Y3JlYXRpb25Nb2RlOiBDcmVhdGlvbk1vZGU7XG5cdGRpc2FibGVBZGRSb3dCdXR0b25Gb3JFbXB0eURhdGE6IGJvb2xlYW47XG5cdGN1c3RvbVZhbGlkYXRpb25GdW5jdGlvbjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXHR1c2VDb25kZW5zZWRUYWJsZUxheW91dDogYm9vbGVhbjtcblx0ZW5hYmxlRXhwb3J0OiBib29sZWFuO1xuXHRoZWFkZXJWaXNpYmxlOiBib29sZWFuO1xuXHRmaWx0ZXJzPzogUmVjb3JkPHN0cmluZywgVGFibGVGaWx0ZXJzQ29uZmlndXJhdGlvbj47XG5cdHR5cGU6IFRhYmxlVHlwZTtcblx0c2VsZWN0QWxsPzogYm9vbGVhbjtcblx0c2VsZWN0aW9uTGltaXQ6IG51bWJlcjtcblx0bXVsdGlTZWxlY3RNb2RlOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cdGVuYWJsZVBhc3RlOiBib29sZWFuO1xuXHRlbmFibGVGdWxsU2NyZWVuOiBib29sZWFuO1xuXHRzaG93Um93Q291bnQ6IGJvb2xlYW47XG5cdGVuYWJsZU1hc3NFZGl0OiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXHRlbmFibGVBdXRvQ29sdW1uV2lkdGg6IGJvb2xlYW47XG59O1xuXG5leHBvcnQgdHlwZSBUYWJsZVR5cGUgPSBcIkdyaWRUYWJsZVwiIHwgXCJSZXNwb25zaXZlVGFibGVcIiB8IFwiQW5hbHl0aWNhbFRhYmxlXCI7XG5cbmVudW0gQ29sdW1uVHlwZSB7XG5cdERlZmF1bHQgPSBcIkRlZmF1bHRcIiwgLy8gRGVmYXVsdCBUeXBlXG5cdEFubm90YXRpb24gPSBcIkFubm90YXRpb25cIixcblx0U2xvdCA9IFwiU2xvdFwiXG59XG5cbmV4cG9ydCB0eXBlIEJhc2VUYWJsZUNvbHVtbiA9IENvbmZpZ3VyYWJsZU9iamVjdCAmIHtcblx0aWQ6IHN0cmluZztcblx0d2lkdGg/OiBzdHJpbmc7XG5cdG5hbWU6IHN0cmluZztcblx0YXZhaWxhYmlsaXR5PzogQXZhaWxhYmlsaXR5VHlwZTtcblx0dHlwZTogQ29sdW1uVHlwZTsgLy9PcmlnaW4gb2YgdGhlIHNvdXJjZSB3aGVyZSB3ZSBhcmUgZ2V0dGluZyB0aGUgdGVtcGxhdGVkIGluZm9ybWF0aW9uIGZyb20sXG5cdGlzTmF2aWdhYmxlPzogYm9vbGVhbjtcblx0c2V0dGluZ3M/OiBUYWJsZUNvbHVtblNldHRpbmdzO1xuXHRzZW1hbnRpY09iamVjdFBhdGg/OiBzdHJpbmc7XG5cdHByb3BlcnR5SW5mb3M/OiBzdHJpbmdbXTtcblx0Y2FzZVNlbnNpdGl2ZT86IGJvb2xlYW47XG5cdHNvcnRhYmxlOiBib29sZWFuO1xuXHRob3Jpem9udGFsQWxpZ24/OiBIb3Jpem9udGFsQWxpZ247XG5cdGZvcm1hdE9wdGlvbnM6IEZvcm1hdE9wdGlvbnNUeXBlO1xufTtcblxuZXhwb3J0IHR5cGUgQ3VzdG9tVGFibGVDb2x1bW4gPSBCYXNlVGFibGVDb2x1bW4gJiB7XG5cdGhlYWRlcj86IHN0cmluZztcblx0dGVtcGxhdGU6IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIEFubm90YXRpb25UYWJsZUNvbHVtbiA9IEJhc2VUYWJsZUNvbHVtbiAmIHtcblx0YW5ub3RhdGlvblBhdGg6IHN0cmluZztcblx0cmVsYXRpdmVQYXRoOiBzdHJpbmc7XG5cdGxhYmVsPzogc3RyaW5nO1xuXHRncm91cExhYmVsPzogc3RyaW5nO1xuXHRncm91cD86IHN0cmluZztcblx0aXNHcm91cGFibGU/OiBib29sZWFuO1xuXHRpc0tleT86IGJvb2xlYW47XG5cdHVuaXQ/OiBzdHJpbmc7XG5cdGV4cG9ydFNldHRpbmdzPzoge1xuXHRcdHRlbXBsYXRlPzogc3RyaW5nO1xuXHRcdGxhYmVsPzogc3RyaW5nO1xuXHRcdGZpZWxkTGFiZWw/OiBzdHJpbmc7XG5cdFx0d3JhcD86IGJvb2xlYW47XG5cdFx0dHlwZT86IHN0cmluZztcblx0XHRpbnB1dEZvcm1hdD86IHN0cmluZztcblx0XHRmb3JtYXQ/OiBzdHJpbmc7XG5cdFx0c2NhbGU/OiBudW1iZXI7XG5cdFx0ZGVsaW1pdGVyPzogYm9vbGVhbjtcblx0XHR0cnVlVmFsdWU/OiBib29sZWFuO1xuXHRcdGZhbHNlVmFsdWU/OiBib29sZWFuO1xuXHR9O1xuXHRpc0RhdGFQb2ludEZha2VUYXJnZXRQcm9wZXJ0eT86IGJvb2xlYW47XG5cdHRleHRBcnJhbmdlbWVudD86IHtcblx0XHR0ZXh0UHJvcGVydHk6IHN0cmluZztcblx0XHRtb2RlOiBEaXNwbGF5TW9kZTtcblx0fTtcblx0ZXhwb3J0Q29udGFjdFByb3BlcnR5Pzogc3RyaW5nO1xuXHRhZGRpdGlvbmFsUHJvcGVydHlJbmZvcz86IHN0cmluZ1tdO1xuXHR2aXN1YWxTZXR0aW5ncz86IFZpc3VhbFNldHRpbmdzO1xuXHR0eXBlQ29uZmlnPzogb2JqZWN0O1xufTtcblxuZXhwb3J0IHR5cGUgVmlzdWFsU2V0dGluZ3MgPSB7XG5cdHdpZHRoQ2FsY3VsYXRpb24/OiBXaWR0aENhbGN1bGF0aW9uO1xufTtcblxuZXhwb3J0IHR5cGUgV2lkdGhDYWxjdWxhdGlvbiA9XG5cdHwgbnVsbFxuXHR8IHtcblx0XHRcdG1pbldpZHRoPzogbnVtYmVyO1xuXHRcdFx0bWF4V2lkdGg/OiBudW1iZXI7XG5cdFx0XHRkZWZhdWx0V2lkdGg/OiBudW1iZXI7XG5cdFx0XHRpbmNsdWRlTGFiZWw/OiBib29sZWFuO1xuXHRcdFx0Z2FwPzogbnVtYmVyO1xuXHRcdFx0Ly8gb25seSByZWxldmFudCBmb3IgY29tcGxleCB0eXBlc1xuXHRcdFx0ZXhjbHVkZVByb3BlcnRpZXM/OiBzdHJpbmcgfCBzdHJpbmdbXTtcblx0XHRcdHZlcnRpY2FsQXJyYW5nZW1lbnQ/OiBib29sZWFuO1xuXHQgIH07XG5cbmV4cG9ydCB0eXBlIFRhYmxlQ29sdW1uID0gQ3VzdG9tVGFibGVDb2x1bW4gfCBBbm5vdGF0aW9uVGFibGVDb2x1bW47XG5cbmV4cG9ydCB0eXBlIEN1c3RvbUNvbHVtbiA9IEN1c3RvbUVsZW1lbnQ8VGFibGVDb2x1bW4+O1xuXG5leHBvcnQgdHlwZSBBZ2dyZWdhdGVEYXRhID0ge1xuXHRkZWZhdWx0QWdncmVnYXRlOiB7XG5cdFx0Y29udGV4dERlZmluaW5nUHJvcGVydGllcz86IHN0cmluZ1tdO1xuXHR9O1xuXHRyZWxhdGl2ZVBhdGg6IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIFRhYmxlVmlzdWFsaXphdGlvbiA9IHtcblx0dHlwZTogVmlzdWFsaXphdGlvblR5cGUuVGFibGU7XG5cdGFubm90YXRpb246IFRhYmxlQW5ub3RhdGlvbkNvbmZpZ3VyYXRpb247XG5cdGNvbnRyb2w6IFRhYmxlQ29udHJvbENvbmZpZ3VyYXRpb247XG5cdGNvbHVtbnM6IFRhYmxlQ29sdW1uW107XG5cdGFjdGlvbnM6IEJhc2VBY3Rpb25bXTtcblx0YWdncmVnYXRlcz86IFJlY29yZDxzdHJpbmcsIEFnZ3JlZ2F0ZURhdGE+O1xuXHRlbmFibGVBbmFseXRpY3M/OiBib29sZWFuO1xuXHRlbmFibGVEYXRhU3RhdGVGaWx0ZXI6IGJvb2xlYW47XG5cdG9wZXJhdGlvbkF2YWlsYWJsZU1hcDogc3RyaW5nO1xuXHRvcGVyYXRpb25BdmFpbGFibGVQcm9wZXJ0aWVzOiBzdHJpbmc7XG59O1xuXG50eXBlIFNvcnRlclR5cGUgPSB7XG5cdG5hbWU6IHN0cmluZztcblx0ZGVzY2VuZGluZzogYm9vbGVhbjtcbn07XG5cbi8qKlxuICogUmV0dXJucyBhbiBhcnJheSBvZiBhbGwgYW5ub3RhdGlvbi1iYXNlZCBhbmQgbWFuaWZlc3QtYmFzZWQgdGFibGUgYWN0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge0xpbmVJdGVtfSBsaW5lSXRlbUFubm90YXRpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSB2aXN1YWxpemF0aW9uUGF0aFxuICogQHBhcmFtIHtDb252ZXJ0ZXJDb250ZXh0fSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcGFyYW0ge05hdmlnYXRpb25TZXR0aW5nc0NvbmZpZ3VyYXRpb259IG5hdmlnYXRpb25TZXR0aW5nc1xuICogQHJldHVybnMge0Jhc2VBY3Rpb259IFRoZSBjb21wbGV0ZSB0YWJsZSBhY3Rpb25zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUYWJsZUFjdGlvbnMoXG5cdGxpbmVJdGVtQW5ub3RhdGlvbjogTGluZUl0ZW0sXG5cdHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdG5hdmlnYXRpb25TZXR0aW5ncz86IE5hdmlnYXRpb25TZXR0aW5nc0NvbmZpZ3VyYXRpb25cbik6IEJhc2VBY3Rpb25bXSB7XG5cdGNvbnN0IGFUYWJsZUFjdGlvbnMgPSBnZXRUYWJsZUFubm90YXRpb25BY3Rpb25zKGxpbmVJdGVtQW5ub3RhdGlvbiwgdmlzdWFsaXphdGlvblBhdGgsIGNvbnZlcnRlckNvbnRleHQpO1xuXHRjb25zdCBhQW5ub3RhdGlvbkFjdGlvbnMgPSBhVGFibGVBY3Rpb25zLnRhYmxlQWN0aW9ucztcblx0Y29uc3QgYUhpZGRlbkFjdGlvbnMgPSBhVGFibGVBY3Rpb25zLmhpZGRlblRhYmxlQWN0aW9ucztcblx0cmV0dXJuIGluc2VydEN1c3RvbUVsZW1lbnRzKFxuXHRcdGFBbm5vdGF0aW9uQWN0aW9ucyxcblx0XHRnZXRBY3Rpb25zRnJvbU1hbmlmZXN0KFxuXHRcdFx0Y29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdENvbnRyb2xDb25maWd1cmF0aW9uKHZpc3VhbGl6YXRpb25QYXRoKS5hY3Rpb25zLFxuXHRcdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRcdGFBbm5vdGF0aW9uQWN0aW9ucyxcblx0XHRcdG5hdmlnYXRpb25TZXR0aW5ncyxcblx0XHRcdHRydWUsXG5cdFx0XHRhSGlkZGVuQWN0aW9uc1xuXHRcdCksXG5cdFx0e1xuXHRcdFx0aXNOYXZpZ2FibGU6IFwib3ZlcndyaXRlXCIsXG5cdFx0XHRlbmFibGVPblNlbGVjdDogXCJvdmVyd3JpdGVcIixcblx0XHRcdGVuYWJsZUF1dG9TY3JvbGw6IFwib3ZlcndyaXRlXCIsXG5cdFx0XHRlbmFibGVkOiBcIm92ZXJ3cml0ZVwiLFxuXHRcdFx0ZGVmYXVsdFZhbHVlc0V4dGVuc2lvbkZ1bmN0aW9uOiBcIm92ZXJ3cml0ZVwiXG5cdFx0fVxuXHQpO1xufVxuXG4vKipcbiAqIFJldHVybnMgYW4gYXJyYXkgb2YgYWxsIGNvbHVtbnMsIGFubm90YXRpb24tYmFzZWQgYXMgd2VsbCBhcyBtYW5pZmVzdCBiYXNlZC5cbiAqIFRoZXkgYXJlIHNvcnRlZCBhbmQgc29tZSBwcm9wZXJ0aWVzIGNhbiBiZSBvdmVyd3JpdHRlbiB2aWEgdGhlIG1hbmlmZXN0IChjaGVjayBvdXQgdGhlIGtleXMgdGhhdCBjYW4gYmUgb3ZlcndyaXR0ZW4pLlxuICpcbiAqIEBwYXJhbSB7TGluZUl0ZW19IGxpbmVJdGVtQW5ub3RhdGlvbiBDb2xsZWN0aW9uIG9mIGRhdGEgZmllbGRzIGZvciByZXByZXNlbnRhdGlvbiBpbiBhIHRhYmxlIG9yIGxpc3RcbiAqIEBwYXJhbSB7c3RyaW5nfSB2aXN1YWxpemF0aW9uUGF0aFxuICogQHBhcmFtIHtDb252ZXJ0ZXJDb250ZXh0fSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcGFyYW0ge05hdmlnYXRpb25TZXR0aW5nc0NvbmZpZ3VyYXRpb259IG5hdmlnYXRpb25TZXR0aW5nc1xuICogQHJldHVybnMge1RhYmxlQ29sdW1uW119IFJldHVybnMgYWxsIHRhYmxlIGNvbHVtbnMgdGhhdCBzaG91bGQgYmUgYXZhaWxhYmxlLCByZWdhcmRsZXNzIG9mIHRlbXBsYXRpbmcgb3IgcGVyc29uYWxpemF0aW9uIG9yIHRoZWlyIG9yaWdpblxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGFibGVDb2x1bW5zKFxuXHRsaW5lSXRlbUFubm90YXRpb246IExpbmVJdGVtLFxuXHR2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRuYXZpZ2F0aW9uU2V0dGluZ3M/OiBOYXZpZ2F0aW9uU2V0dGluZ3NDb25maWd1cmF0aW9uXG4pOiBUYWJsZUNvbHVtbltdIHtcblx0Y29uc3QgYW5ub3RhdGlvbkNvbHVtbnMgPSBnZXRDb2x1bW5zRnJvbUFubm90YXRpb25zKGxpbmVJdGVtQW5ub3RhdGlvbiwgdmlzdWFsaXphdGlvblBhdGgsIGNvbnZlcnRlckNvbnRleHQpO1xuXHRjb25zdCBtYW5pZmVzdENvbHVtbnMgPSBnZXRDb2x1bW5zRnJvbU1hbmlmZXN0KFxuXHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbih2aXN1YWxpemF0aW9uUGF0aCkuY29sdW1ucyxcblx0XHRhbm5vdGF0aW9uQ29sdW1ucyBhcyBBbm5vdGF0aW9uVGFibGVDb2x1bW5bXSxcblx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0QW5ub3RhdGlvbkVudGl0eVR5cGUobGluZUl0ZW1Bbm5vdGF0aW9uKSxcblx0XHRuYXZpZ2F0aW9uU2V0dGluZ3Ncblx0KTtcblxuXHRyZXR1cm4gaW5zZXJ0Q3VzdG9tRWxlbWVudHMoYW5ub3RhdGlvbkNvbHVtbnMsIG1hbmlmZXN0Q29sdW1ucywge1xuXHRcdHdpZHRoOiBcIm92ZXJ3cml0ZVwiLFxuXHRcdGlzTmF2aWdhYmxlOiBcIm92ZXJ3cml0ZVwiLFxuXHRcdGF2YWlsYWJpbGl0eTogXCJvdmVyd3JpdGVcIixcblx0XHRzZXR0aW5nczogXCJvdmVyd3JpdGVcIixcblx0XHRob3Jpem9udGFsQWxpZ246IFwib3ZlcndyaXRlXCIsXG5cdFx0Zm9ybWF0T3B0aW9uczogXCJvdmVyd3JpdGVcIlxuXHR9KTtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZSB0aGUgY3VzdG9tIGFnZ3JlZ2F0aW9uIGRlZmluaXRpb25zIGZyb20gdGhlIGVudGl0eVR5cGUuXG4gKlxuICogQHBhcmFtIGVudGl0eVR5cGUgVGhlIHRhcmdldCBlbnRpdHkgdHlwZS5cbiAqIEBwYXJhbSB0YWJsZUNvbHVtbnMgVGhlIGFycmF5IG9mIGNvbHVtbnMgZm9yIHRoZSBlbnRpdHkgdHlwZS5cbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dC5cbiAqIEByZXR1cm5zIFRoZSBhZ2dyZWdhdGUgZGVmaW5pdGlvbnMgZnJvbSB0aGUgZW50aXR5VHlwZSwgb3IgdW5kZWZpbmVkIGlmIHRoZSBlbnRpdHkgZG9lc24ndCBzdXBwb3J0IGFuYWx5dGljYWwgcXVlcmllcy5cbiAqL1xuZXhwb3J0IGNvbnN0IGdldEFnZ3JlZ2F0ZURlZmluaXRpb25zRnJvbUVudGl0eVR5cGUgPSBmdW5jdGlvbihcblx0ZW50aXR5VHlwZTogRW50aXR5VHlwZSxcblx0dGFibGVDb2x1bW5zOiBUYWJsZUNvbHVtbltdLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBSZWNvcmQ8c3RyaW5nLCBBZ2dyZWdhdGVEYXRhPiB8IHVuZGVmaW5lZCB7XG5cdGNvbnN0IGFnZ3JlZ2F0aW9uSGVscGVyID0gbmV3IEFnZ3JlZ2F0aW9uSGVscGVyKGVudGl0eVR5cGUsIGNvbnZlcnRlckNvbnRleHQpO1xuXG5cdGZ1bmN0aW9uIGZpbmRDb2x1bW5Gcm9tUGF0aChwYXRoOiBzdHJpbmcpOiBUYWJsZUNvbHVtbiB8IHVuZGVmaW5lZCB7XG5cdFx0cmV0dXJuIHRhYmxlQ29sdW1ucy5maW5kKGNvbHVtbiA9PiB7XG5cdFx0XHRjb25zdCBhbm5vdGF0aW9uQ29sdW1uID0gY29sdW1uIGFzIEFubm90YXRpb25UYWJsZUNvbHVtbjtcblx0XHRcdHJldHVybiBhbm5vdGF0aW9uQ29sdW1uLnByb3BlcnR5SW5mb3MgPT09IHVuZGVmaW5lZCAmJiBhbm5vdGF0aW9uQ29sdW1uLnJlbGF0aXZlUGF0aCA9PT0gcGF0aDtcblx0XHR9KTtcblx0fVxuXG5cdGlmICghYWdncmVnYXRpb25IZWxwZXIuaXNBbmFseXRpY3NTdXBwb3J0ZWQoKSkge1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblxuXHQvLyBLZWVwIGEgc2V0IG9mIGFsbCBjdXJyZW5jeS91bml0IHByb3BlcnRpZXMsIGFzIHdlIGRvbid0IHdhbnQgdG8gY29uc2lkZXIgdGhlbSBhcyBhZ2dyZWdhdGVzXG5cdC8vIFRoZXkgYXJlIGFnZ3JlZ2F0ZXMgZm9yIHRlY2huaWNhbCByZWFzb25zICh0byBtYW5hZ2UgbXVsdGktdW5pdHMgc2l0dWF0aW9ucykgYnV0IGl0IGRvZXNuJ3QgbWFrZSBzZW5zZSBmcm9tIGEgdXNlciBzdGFuZHBvaW50XG5cdGNvbnN0IG1DdXJyZW5jeU9yVW5pdFByb3BlcnRpZXMgPSBuZXcgU2V0KCk7XG5cdHRhYmxlQ29sdW1ucy5mb3JFYWNoKG9Db2x1bW4gPT4ge1xuXHRcdGNvbnN0IG9UYWJsZUNvbHVtbiA9IG9Db2x1bW4gYXMgQW5ub3RhdGlvblRhYmxlQ29sdW1uO1xuXHRcdGlmIChvVGFibGVDb2x1bW4udW5pdCkge1xuXHRcdFx0bUN1cnJlbmN5T3JVbml0UHJvcGVydGllcy5hZGQob1RhYmxlQ29sdW1uLnVuaXQpO1xuXHRcdH1cblx0fSk7XG5cblx0Y29uc3QgYUN1c3RvbUFnZ3JlZ2F0ZUFubm90YXRpb25zID0gYWdncmVnYXRpb25IZWxwZXIuZ2V0Q3VzdG9tQWdncmVnYXRlRGVmaW5pdGlvbnMoKTtcblx0Y29uc3QgbVJhd0RlZmluaXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT4gPSB7fTtcblxuXHRhQ3VzdG9tQWdncmVnYXRlQW5ub3RhdGlvbnMuZm9yRWFjaChhbm5vdGF0aW9uID0+IHtcblx0XHRjb25zdCBvQWdncmVnYXRlZFByb3BlcnR5ID0gYWdncmVnYXRpb25IZWxwZXIuX2VudGl0eVR5cGUuZW50aXR5UHJvcGVydGllcy5maW5kKG9Qcm9wZXJ0eSA9PiB7XG5cdFx0XHRyZXR1cm4gb1Byb3BlcnR5Lm5hbWUgPT09IGFubm90YXRpb24ucXVhbGlmaWVyO1xuXHRcdH0pO1xuXG5cdFx0aWYgKG9BZ2dyZWdhdGVkUHJvcGVydHkpIHtcblx0XHRcdGNvbnN0IGFDb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzID0gYW5ub3RhdGlvbi5hbm5vdGF0aW9ucz8uQWdncmVnYXRpb24/LkNvbnRleHREZWZpbmluZ1Byb3BlcnRpZXM7XG5cdFx0XHRtUmF3RGVmaW5pdGlvbnNbb0FnZ3JlZ2F0ZWRQcm9wZXJ0eS5uYW1lXSA9IGFDb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzXG5cdFx0XHRcdD8gYUNvbnRleHREZWZpbmluZ1Byb3BlcnRpZXMubWFwKG9DdHhEZWZQcm9wZXJ0eSA9PiB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gb0N0eERlZlByb3BlcnR5LnZhbHVlO1xuXHRcdFx0XHQgIH0pXG5cdFx0XHRcdDogW107XG5cdFx0fVxuXHR9KTtcblx0Y29uc3QgbVJlc3VsdDogUmVjb3JkPHN0cmluZywgQWdncmVnYXRlRGF0YT4gPSB7fTtcblxuXHR0YWJsZUNvbHVtbnMuZm9yRWFjaChvQ29sdW1uID0+IHtcblx0XHRjb25zdCBvVGFibGVDb2x1bW4gPSBvQ29sdW1uIGFzIEFubm90YXRpb25UYWJsZUNvbHVtbjtcblx0XHRpZiAob1RhYmxlQ29sdW1uLnByb3BlcnR5SW5mb3MgPT09IHVuZGVmaW5lZCAmJiBvVGFibGVDb2x1bW4ucmVsYXRpdmVQYXRoKSB7XG5cdFx0XHRjb25zdCBhUmF3Q29udGV4dERlZmluaW5nUHJvcGVydGllcyA9IG1SYXdEZWZpbml0aW9uc1tvVGFibGVDb2x1bW4ucmVsYXRpdmVQYXRoXTtcblxuXHRcdFx0Ly8gSWdub3JlIGFnZ3JlZ2F0ZXMgY29ycmVzcG9uZGluZyB0byBjdXJyZW5jaWVzIG9yIHVuaXRzIG9mIG1lYXN1cmUgYW5kIGR1bW15IGNyZWF0ZWQgcHJvcGVydHkgZm9yIGRhdGFwb2ludCB0YXJnZXQgVmFsdWVcblx0XHRcdGlmIChcblx0XHRcdFx0YVJhd0NvbnRleHREZWZpbmluZ1Byb3BlcnRpZXMgJiZcblx0XHRcdFx0IW1DdXJyZW5jeU9yVW5pdFByb3BlcnRpZXMuaGFzKG9UYWJsZUNvbHVtbi5uYW1lKSAmJlxuXHRcdFx0XHQhb1RhYmxlQ29sdW1uLmlzRGF0YVBvaW50RmFrZVRhcmdldFByb3BlcnR5XG5cdFx0XHQpIHtcblx0XHRcdFx0bVJlc3VsdFtvVGFibGVDb2x1bW4ubmFtZV0gPSB7XG5cdFx0XHRcdFx0ZGVmYXVsdEFnZ3JlZ2F0ZToge30sXG5cdFx0XHRcdFx0cmVsYXRpdmVQYXRoOiBvVGFibGVDb2x1bW4ucmVsYXRpdmVQYXRoXG5cdFx0XHRcdH07XG5cdFx0XHRcdGNvbnN0IGFDb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzOiBzdHJpbmdbXSA9IFtdO1xuXHRcdFx0XHRhUmF3Q29udGV4dERlZmluaW5nUHJvcGVydGllcy5mb3JFYWNoKGNvbnRleHREZWZpbmluZ1Byb3BlcnR5TmFtZSA9PiB7XG5cdFx0XHRcdFx0Y29uc3Qgb0NvbHVtbiA9IGZpbmRDb2x1bW5Gcm9tUGF0aChjb250ZXh0RGVmaW5pbmdQcm9wZXJ0eU5hbWUpO1xuXHRcdFx0XHRcdGlmIChvQ29sdW1uKSB7XG5cdFx0XHRcdFx0XHRhQ29udGV4dERlZmluaW5nUHJvcGVydGllcy5wdXNoKG9Db2x1bW4ubmFtZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRpZiAoYUNvbnRleHREZWZpbmluZ1Byb3BlcnRpZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0bVJlc3VsdFtvVGFibGVDb2x1bW4ubmFtZV0uZGVmYXVsdEFnZ3JlZ2F0ZS5jb250ZXh0RGVmaW5pbmdQcm9wZXJ0aWVzID0gYUNvbnRleHREZWZpbmluZ1Byb3BlcnRpZXM7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdHJldHVybiBtUmVzdWx0O1xufTtcblxuLyoqXG4gKiBVcGRhdGVzIGEgdGFibGUgdmlzdWFsaXphdGlvbiBmb3IgYW5hbHl0aWNhbCB1c2UgY2FzZXMuXG4gKlxuICogQHBhcmFtIHRhYmxlVmlzdWFsaXphdGlvbiBUaGUgdmlzdWFsaXphdGlvbiB0byBiZSB1cGRhdGVkXG4gKiBAcGFyYW0gZW50aXR5VHlwZSBUaGUgZW50aXR5IHR5cGUgZGlzcGxheWVkIGluIHRoZSB0YWJsZVxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcGFyYW0gcHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24gVGhlIHByZXNlbnRhdGlvblZhcmlhbnQgYW5ub3RhdGlvbiAoaWYgYW55KVxuICovXG5mdW5jdGlvbiB1cGRhdGVUYWJsZVZpc3VhbGl6YXRpb25Gb3JBbmFseXRpY3MoXG5cdHRhYmxlVmlzdWFsaXphdGlvbjogVGFibGVWaXN1YWxpemF0aW9uLFxuXHRlbnRpdHlUeXBlOiBFbnRpdHlUeXBlLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbj86IFByZXNlbnRhdGlvblZhcmlhbnRUeXBlVHlwZXNcbikge1xuXHRpZiAodGFibGVWaXN1YWxpemF0aW9uLmNvbnRyb2wudHlwZSA9PT0gXCJBbmFseXRpY2FsVGFibGVcIikge1xuXHRcdGNvbnN0IGFnZ3JlZ2F0ZXNEZWZpbml0aW9ucyA9IGdldEFnZ3JlZ2F0ZURlZmluaXRpb25zRnJvbUVudGl0eVR5cGUoZW50aXR5VHlwZSwgdGFibGVWaXN1YWxpemF0aW9uLmNvbHVtbnMsIGNvbnZlcnRlckNvbnRleHQpO1xuXG5cdFx0aWYgKGFnZ3JlZ2F0ZXNEZWZpbml0aW9ucykge1xuXHRcdFx0dGFibGVWaXN1YWxpemF0aW9uLmVuYWJsZUFuYWx5dGljcyA9IHRydWU7XG5cdFx0XHR0YWJsZVZpc3VhbGl6YXRpb24uYWdncmVnYXRlcyA9IGFnZ3JlZ2F0ZXNEZWZpbml0aW9ucztcblxuXHRcdFx0Ly8gQWRkIGdyb3VwIGFuZCBzb3J0IGNvbmRpdGlvbnMgZnJvbSB0aGUgcHJlc2VudGF0aW9uIHZhcmlhbnRcblx0XHRcdHRhYmxlVmlzdWFsaXphdGlvbi5hbm5vdGF0aW9uLmdyb3VwQ29uZGl0aW9ucyA9IGdldEdyb3VwQ29uZGl0aW9ucyhwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbiwgdGFibGVWaXN1YWxpemF0aW9uLmNvbHVtbnMpO1xuXHRcdFx0dGFibGVWaXN1YWxpemF0aW9uLmFubm90YXRpb24uYWdncmVnYXRlQ29uZGl0aW9ucyA9IGdldEFnZ3JlZ2F0ZUNvbmRpdGlvbnMoXG5cdFx0XHRcdHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uLFxuXHRcdFx0XHR0YWJsZVZpc3VhbGl6YXRpb24uY29sdW1uc1xuXHRcdFx0KTtcblx0XHR9XG5cblx0XHR0YWJsZVZpc3VhbGl6YXRpb24uY29udHJvbC50eXBlID0gXCJHcmlkVGFibGVcIjsgLy8gQW5hbHl0aWNhbFRhYmxlIGlzbid0IGEgcmVhbCB0eXBlIGZvciB0aGUgTURDOlRhYmxlLCBzbyB3ZSBhbHdheXMgc3dpdGNoIGJhY2sgdG8gR3JpZFxuXHR9XG59XG5cbi8qKlxuICogR2V0IHRoZSBuYXZpZ2F0aW9uIHRhcmdldCBwYXRoIGZyb20gbWFuaWZlc3Qgc2V0dGluZ3MuXG4gKlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcGFyYW0gbmF2aWdhdGlvblByb3BlcnR5UGF0aCBUaGUgbmF2aWdhdGlvbiBwYXRoIHRvIGNoZWNrIGluIHRoZSBtYW5pZmVzdCBzZXR0aW5nc1xuICogQHJldHVybnMgTmF2aWdhdGlvbiBwYXRoIGZyb20gbWFuaWZlc3Qgc2V0dGluZ3NcbiAqL1xuZnVuY3Rpb24gZ2V0TmF2aWdhdGlvblRhcmdldFBhdGgoY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCwgbmF2aWdhdGlvblByb3BlcnR5UGF0aDogc3RyaW5nKSB7XG5cdGNvbnN0IG1hbmlmZXN0V3JhcHBlciA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCk7XG5cdGlmIChuYXZpZ2F0aW9uUHJvcGVydHlQYXRoICYmIG1hbmlmZXN0V3JhcHBlci5nZXROYXZpZ2F0aW9uQ29uZmlndXJhdGlvbihuYXZpZ2F0aW9uUHJvcGVydHlQYXRoKSkge1xuXHRcdGNvbnN0IG5hdkNvbmZpZyA9IG1hbmlmZXN0V3JhcHBlci5nZXROYXZpZ2F0aW9uQ29uZmlndXJhdGlvbihuYXZpZ2F0aW9uUHJvcGVydHlQYXRoKTtcblx0XHRpZiAoT2JqZWN0LmtleXMobmF2Q29uZmlnKS5sZW5ndGggPiAwKSB7XG5cdFx0XHRyZXR1cm4gbmF2aWdhdGlvblByb3BlcnR5UGF0aDtcblx0XHR9XG5cdH1cblxuXHRjb25zdCBkYXRhTW9kZWxQYXRoID0gY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCk7XG5cdGNvbnN0IGNvbnRleHRQYXRoID0gY29udmVydGVyQ29udGV4dC5nZXRDb250ZXh0UGF0aCgpO1xuXHRjb25zdCBuYXZDb25maWdGb3JDb250ZXh0UGF0aCA9IG1hbmlmZXN0V3JhcHBlci5nZXROYXZpZ2F0aW9uQ29uZmlndXJhdGlvbihjb250ZXh0UGF0aCk7XG5cdGlmIChuYXZDb25maWdGb3JDb250ZXh0UGF0aCAmJiBPYmplY3Qua2V5cyhuYXZDb25maWdGb3JDb250ZXh0UGF0aCkubGVuZ3RoID4gMCkge1xuXHRcdHJldHVybiBjb250ZXh0UGF0aDtcblx0fVxuXG5cdHJldHVybiBkYXRhTW9kZWxQYXRoLnRhcmdldEVudGl0eVNldCA/IGRhdGFNb2RlbFBhdGgudGFyZ2V0RW50aXR5U2V0Lm5hbWUgOiBkYXRhTW9kZWxQYXRoLnN0YXJ0aW5nRW50aXR5U2V0Lm5hbWU7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgJ3VuaXQnIGFuZCAndGV4dEFycmFuZ2VtZW50JyBwcm9wZXJ0aWVzIGluIGNvbHVtbnMgd2hlbiBuZWNlc3NhcnkuXG4gKlxuICogQHBhcmFtIGVudGl0eVR5cGUgVGhlIGVudGl0eSB0eXBlIGRpc3BsYXllZCBpbiB0aGUgdGFibGVcbiAqIEBwYXJhbSB0YWJsZUNvbHVtbnMgVGhlIGNvbHVtbnMgdG8gYmUgdXBkYXRlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlTGlua2VkUHJvcGVydGllcyhlbnRpdHlUeXBlOiBFbnRpdHlUeXBlLCB0YWJsZUNvbHVtbnM6IFRhYmxlQ29sdW1uW10pIHtcblx0ZnVuY3Rpb24gZmluZENvbHVtbkJ5UGF0aChwYXRoOiBzdHJpbmcpOiBUYWJsZUNvbHVtbiB8IHVuZGVmaW5lZCB7XG5cdFx0cmV0dXJuIHRhYmxlQ29sdW1ucy5maW5kKGNvbHVtbiA9PiB7XG5cdFx0XHRjb25zdCBhbm5vdGF0aW9uQ29sdW1uID0gY29sdW1uIGFzIEFubm90YXRpb25UYWJsZUNvbHVtbjtcblx0XHRcdHJldHVybiBhbm5vdGF0aW9uQ29sdW1uLnByb3BlcnR5SW5mb3MgPT09IHVuZGVmaW5lZCAmJiBhbm5vdGF0aW9uQ29sdW1uLnJlbGF0aXZlUGF0aCA9PT0gcGF0aDtcblx0XHR9KTtcblx0fVxuXG5cdHRhYmxlQ29sdW1ucy5mb3JFYWNoKG9Db2x1bW4gPT4ge1xuXHRcdGNvbnN0IG9UYWJsZUNvbHVtbiA9IG9Db2x1bW4gYXMgQW5ub3RhdGlvblRhYmxlQ29sdW1uO1xuXHRcdGlmIChvVGFibGVDb2x1bW4ucHJvcGVydHlJbmZvcyA9PT0gdW5kZWZpbmVkICYmIG9UYWJsZUNvbHVtbi5yZWxhdGl2ZVBhdGgpIHtcblx0XHRcdGNvbnN0IG9Qcm9wZXJ0eSA9IGVudGl0eVR5cGUuZW50aXR5UHJvcGVydGllcy5maW5kKG9Qcm9wID0+IG9Qcm9wLm5hbWUgPT09IG9UYWJsZUNvbHVtbi5yZWxhdGl2ZVBhdGgpO1xuXHRcdFx0aWYgKG9Qcm9wZXJ0eSkge1xuXHRcdFx0XHRjb25zdCBzVW5pdCA9IGdldEFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5KG9Qcm9wZXJ0eSk/Lm5hbWUgfHwgZ2V0QXNzb2NpYXRlZFVuaXRQcm9wZXJ0eShvUHJvcGVydHkpPy5uYW1lO1xuXHRcdFx0XHRpZiAoc1VuaXQpIHtcblx0XHRcdFx0XHRjb25zdCBvVW5pdENvbHVtbiA9IGZpbmRDb2x1bW5CeVBhdGgoc1VuaXQpO1xuXG5cdFx0XHRcdFx0b1RhYmxlQ29sdW1uLnVuaXQgPSBvVW5pdENvbHVtbj8ubmFtZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IGRpc3BsYXlNb2RlID0gZ2V0RGlzcGxheU1vZGUob1Byb3BlcnR5KSxcblx0XHRcdFx0XHR0ZXh0QW5ub3RhdGlvbiA9IG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucy5Db21tb24/LlRleHQ7XG5cdFx0XHRcdGlmIChpc1BhdGhFeHByZXNzaW9uKHRleHRBbm5vdGF0aW9uKSAmJiBkaXNwbGF5TW9kZSAhPT0gXCJWYWx1ZVwiKSB7XG5cdFx0XHRcdFx0Y29uc3Qgb1RleHRDb2x1bW4gPSBmaW5kQ29sdW1uQnlQYXRoKHRleHRBbm5vdGF0aW9uLnBhdGgpO1xuXHRcdFx0XHRcdGlmIChvVGV4dENvbHVtbiAmJiBvVGV4dENvbHVtbi5uYW1lICE9PSBvVGFibGVDb2x1bW4ubmFtZSkge1xuXHRcdFx0XHRcdFx0b1RhYmxlQ29sdW1uLnRleHRBcnJhbmdlbWVudCA9IHtcblx0XHRcdFx0XHRcdFx0dGV4dFByb3BlcnR5OiBvVGV4dENvbHVtbi5uYW1lLFxuXHRcdFx0XHRcdFx0XHRtb2RlOiBkaXNwbGF5TW9kZVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVGFibGVWaXN1YWxpemF0aW9uKFxuXHRsaW5lSXRlbUFubm90YXRpb246IExpbmVJdGVtLFxuXHR2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbj86IFByZXNlbnRhdGlvblZhcmlhbnRUeXBlVHlwZXMsXG5cdGlzQ29uZGVuc2VkVGFibGVMYXlvdXRDb21wbGlhbnQ/OiBib29sZWFuLFxuXHR2aWV3Q29uZmlndXJhdGlvbj86IFZpZXdQYXRoQ29uZmlndXJhdGlvblxuKTogVGFibGVWaXN1YWxpemF0aW9uIHtcblx0Y29uc3QgdGFibGVNYW5pZmVzdENvbmZpZyA9IGdldFRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uKFxuXHRcdGxpbmVJdGVtQW5ub3RhdGlvbixcblx0XHR2aXN1YWxpemF0aW9uUGF0aCxcblx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdGlzQ29uZGVuc2VkVGFibGVMYXlvdXRDb21wbGlhbnRcblx0KTtcblx0Y29uc3QgeyBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoIH0gPSBzcGxpdFBhdGgodmlzdWFsaXphdGlvblBhdGgpO1xuXHRjb25zdCBuYXZpZ2F0aW9uVGFyZ2V0UGF0aCA9IGdldE5hdmlnYXRpb25UYXJnZXRQYXRoKGNvbnZlcnRlckNvbnRleHQsIG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgpO1xuXHRjb25zdCBuYXZpZ2F0aW9uU2V0dGluZ3MgPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpLmdldE5hdmlnYXRpb25Db25maWd1cmF0aW9uKG5hdmlnYXRpb25UYXJnZXRQYXRoKTtcblx0Y29uc3QgY29sdW1ucyA9IGdldFRhYmxlQ29sdW1ucyhsaW5lSXRlbUFubm90YXRpb24sIHZpc3VhbGl6YXRpb25QYXRoLCBjb252ZXJ0ZXJDb250ZXh0LCBuYXZpZ2F0aW9uU2V0dGluZ3MpO1xuXHRjb25zdCBvcGVyYXRpb25BdmFpbGFibGVNYXAgPSBnZXRPcGVyYXRpb25BdmFpbGFibGVNYXAobGluZUl0ZW1Bbm5vdGF0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KTtcblxuXHRjb25zdCBvVmlzdWFsaXphdGlvbjogVGFibGVWaXN1YWxpemF0aW9uID0ge1xuXHRcdHR5cGU6IFZpc3VhbGl6YXRpb25UeXBlLlRhYmxlLFxuXHRcdGFubm90YXRpb246IGdldFRhYmxlQW5ub3RhdGlvbkNvbmZpZ3VyYXRpb24oXG5cdFx0XHRsaW5lSXRlbUFubm90YXRpb24sXG5cdFx0XHR2aXN1YWxpemF0aW9uUGF0aCxcblx0XHRcdGNvbnZlcnRlckNvbnRleHQsXG5cdFx0XHR0YWJsZU1hbmlmZXN0Q29uZmlnLFxuXHRcdFx0Y29sdW1ucyxcblx0XHRcdHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uLFxuXHRcdFx0dmlld0NvbmZpZ3VyYXRpb25cblx0XHQpLFxuXHRcdGNvbnRyb2w6IHRhYmxlTWFuaWZlc3RDb25maWcsXG5cdFx0YWN0aW9uczogcmVtb3ZlRHVwbGljYXRlQWN0aW9ucyhnZXRUYWJsZUFjdGlvbnMobGluZUl0ZW1Bbm5vdGF0aW9uLCB2aXN1YWxpemF0aW9uUGF0aCwgY29udmVydGVyQ29udGV4dCwgbmF2aWdhdGlvblNldHRpbmdzKSksXG5cdFx0Y29sdW1uczogY29sdW1ucyxcblx0XHRlbmFibGVEYXRhU3RhdGVGaWx0ZXI6IGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFwiT2JqZWN0UGFnZVwiLFxuXHRcdG9wZXJhdGlvbkF2YWlsYWJsZU1hcDogSlNPTi5zdHJpbmdpZnkob3BlcmF0aW9uQXZhaWxhYmxlTWFwKSxcblx0XHRvcGVyYXRpb25BdmFpbGFibGVQcm9wZXJ0aWVzOiBnZXRPcGVyYXRpb25BdmFpbGFibGVQcm9wZXJ0aWVzKG9wZXJhdGlvbkF2YWlsYWJsZU1hcCwgY29udmVydGVyQ29udGV4dClcblx0fTtcblxuXHR1cGRhdGVMaW5rZWRQcm9wZXJ0aWVzKGNvbnZlcnRlckNvbnRleHQuZ2V0QW5ub3RhdGlvbkVudGl0eVR5cGUobGluZUl0ZW1Bbm5vdGF0aW9uKSwgY29sdW1ucyk7XG5cdHVwZGF0ZVRhYmxlVmlzdWFsaXphdGlvbkZvckFuYWx5dGljcyhcblx0XHRvVmlzdWFsaXphdGlvbixcblx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldEFubm90YXRpb25FbnRpdHlUeXBlKGxpbmVJdGVtQW5ub3RhdGlvbiksXG5cdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvblxuXHQpO1xuXG5cdHJldHVybiBvVmlzdWFsaXphdGlvbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURlZmF1bHRUYWJsZVZpc3VhbGl6YXRpb24oY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IFRhYmxlVmlzdWFsaXphdGlvbiB7XG5cdGNvbnN0IHRhYmxlTWFuaWZlc3RDb25maWcgPSBnZXRUYWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbih1bmRlZmluZWQsIFwiXCIsIGNvbnZlcnRlckNvbnRleHQsIGZhbHNlKTtcblx0Y29uc3QgY29sdW1ucyA9IGdldENvbHVtbnNGcm9tRW50aXR5VHlwZSh7fSwgY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCksIFtdLCBbXSwgY29udmVydGVyQ29udGV4dCwgdGFibGVNYW5pZmVzdENvbmZpZy50eXBlKTtcblx0Y29uc3Qgb3BlcmF0aW9uQXZhaWxhYmxlTWFwID0gZ2V0T3BlcmF0aW9uQXZhaWxhYmxlTWFwKHVuZGVmaW5lZCwgY29udmVydGVyQ29udGV4dCk7XG5cdGNvbnN0IG9WaXN1YWxpemF0aW9uOiBUYWJsZVZpc3VhbGl6YXRpb24gPSB7XG5cdFx0dHlwZTogVmlzdWFsaXphdGlvblR5cGUuVGFibGUsXG5cdFx0YW5ub3RhdGlvbjogZ2V0VGFibGVBbm5vdGF0aW9uQ29uZmlndXJhdGlvbih1bmRlZmluZWQsIFwiXCIsIGNvbnZlcnRlckNvbnRleHQsIHRhYmxlTWFuaWZlc3RDb25maWcsIGNvbHVtbnMpLFxuXHRcdGNvbnRyb2w6IHRhYmxlTWFuaWZlc3RDb25maWcsXG5cdFx0YWN0aW9uczogW10sXG5cdFx0Y29sdW1uczogY29sdW1ucyxcblx0XHRlbmFibGVEYXRhU3RhdGVGaWx0ZXI6IGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFwiT2JqZWN0UGFnZVwiLFxuXHRcdG9wZXJhdGlvbkF2YWlsYWJsZU1hcDogSlNPTi5zdHJpbmdpZnkob3BlcmF0aW9uQXZhaWxhYmxlTWFwKSxcblx0XHRvcGVyYXRpb25BdmFpbGFibGVQcm9wZXJ0aWVzOiBnZXRPcGVyYXRpb25BdmFpbGFibGVQcm9wZXJ0aWVzKG9wZXJhdGlvbkF2YWlsYWJsZU1hcCwgY29udmVydGVyQ29udGV4dClcblx0fTtcblxuXHR1cGRhdGVMaW5rZWRQcm9wZXJ0aWVzKGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpLCBjb2x1bW5zKTtcblx0dXBkYXRlVGFibGVWaXN1YWxpemF0aW9uRm9yQW5hbHl0aWNzKG9WaXN1YWxpemF0aW9uLCBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGUoKSwgY29udmVydGVyQ29udGV4dCk7XG5cblx0cmV0dXJuIG9WaXN1YWxpemF0aW9uO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIG1hcCBvZiBDb3JlLk9wZXJhdGlvbkF2YWlsYWJsZSBwcm9wZXJ0eSBwYXRocyBmb3IgYWxsIERhdGFGaWVsZEZvckFjdGlvbnMuXG4gKlxuICogQHBhcmFtIGxpbmVJdGVtQW5ub3RhdGlvbiBUaGUgaW5zdGFuY2Ugb2YgdGhlIGxpbmUgaXRlbVxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGluc3RhbmNlIG9mIHRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHJldHVybnMge1JlY29yZDxzdHJpbmcsIGFueT59IFRoZSByZWNvcmQgY29udGFpbmluZyBhbGwgYWN0aW9uIG5hbWVzIGFuZCB0aGVpciBjb3JyZXNwb25kaW5nIENvcmUuT3BlcmF0aW9uQXZhaWxhYmxlIHByb3BlcnR5IHBhdGhzXG4gKi9cbmZ1bmN0aW9uIGdldE9wZXJhdGlvbkF2YWlsYWJsZU1hcChsaW5lSXRlbUFubm90YXRpb246IExpbmVJdGVtIHwgdW5kZWZpbmVkLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogUmVjb3JkPHN0cmluZywgYW55PiB7XG5cdGNvbnN0IG9wZXJhdGlvbkF2YWlsYWJsZU1hcDogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuXHRjb25zdCBhZGRUb01hcCA9IGZ1bmN0aW9uKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XG5cdFx0aWYgKGtleSkge1xuXHRcdFx0b3BlcmF0aW9uQXZhaWxhYmxlTWFwW2tleV0gPSB2YWx1ZTtcblx0XHR9XG5cdH07XG5cblx0aWYgKGxpbmVJdGVtQW5ub3RhdGlvbikge1xuXHRcdGxpbmVJdGVtQW5ub3RhdGlvbi5mb3JFYWNoKGRhdGFGaWVsZCA9PiB7XG5cdFx0XHRpZiAoZGF0YUZpZWxkLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBY3Rpb24pIHtcblx0XHRcdFx0Y29uc3QgYWN0aW9uTmFtZSA9IGRhdGFGaWVsZC5BY3Rpb24gYXMgc3RyaW5nO1xuXHRcdFx0XHRpZiAoYWN0aW9uTmFtZT8uaW5kZXhPZihcIi9cIikgPCAwICYmICFkYXRhRmllbGQuRGV0ZXJtaW5pbmcpIHtcblx0XHRcdFx0XHRjb25zdCBhY3Rpb25UYXJnZXQgPSBkYXRhRmllbGQuQWN0aW9uVGFyZ2V0O1xuXHRcdFx0XHRcdGlmIChhY3Rpb25UYXJnZXQ/LmFubm90YXRpb25zPy5Db3JlPy5PcGVyYXRpb25BdmFpbGFibGUgPT09IG51bGwpIHtcblx0XHRcdFx0XHRcdC8vIEFubm90YXRpb24gZXhwbGljaXRseSBjb25maWd1cmVkIHdpdGggbnVsbCAoYWN0aW9uIGFkdmVydGlzZW1lbnQgcmVsYXRlZClcblx0XHRcdFx0XHRcdGFkZFRvTWFwKGFjdGlvbk5hbWUsIG51bGwpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoYWN0aW9uVGFyZ2V0Py5wYXJhbWV0ZXJzPy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdGNvbnN0IGJpbmRpbmdQYXJhbWV0ZXJGdWxsTmFtZSA9IGFjdGlvblRhcmdldC5wYXJhbWV0ZXJzWzBdLmZ1bGx5UXVhbGlmaWVkTmFtZSxcblx0XHRcdFx0XHRcdFx0dGFyZ2V0RXhwcmVzc2lvbiA9IGFubm90YXRpb25FeHByZXNzaW9uKFxuXHRcdFx0XHRcdFx0XHRcdGFjdGlvblRhcmdldD8uYW5ub3RhdGlvbnM/LkNvcmU/Lk9wZXJhdGlvbkF2YWlsYWJsZSxcblx0XHRcdFx0XHRcdFx0XHRbXSxcblx0XHRcdFx0XHRcdFx0XHR1bmRlZmluZWQsXG5cdFx0XHRcdFx0XHRcdFx0KHBhdGg6IHN0cmluZykgPT4gYmluZGluZ0NvbnRleHRQYXRoVmlzaXRvcihwYXRoLCBjb252ZXJ0ZXJDb250ZXh0LCBiaW5kaW5nUGFyYW1ldGVyRnVsbE5hbWUpXG5cdFx0XHRcdFx0XHRcdCkgYXMgQmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uPHN0cmluZz47XG5cblx0XHRcdFx0XHRcdGlmICh0YXJnZXRFeHByZXNzaW9uPy5wYXRoKSB7XG5cdFx0XHRcdFx0XHRcdGFkZFRvTWFwKGFjdGlvbk5hbWUsIHRhcmdldEV4cHJlc3Npb24ucGF0aCk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGFjdGlvblRhcmdldD8uYW5ub3RhdGlvbnM/LkNvcmU/Lk9wZXJhdGlvbkF2YWlsYWJsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRcdGFkZFRvTWFwKGFjdGlvbk5hbWUsIHRhcmdldEV4cHJlc3Npb24pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIG9wZXJhdGlvbkF2YWlsYWJsZU1hcDtcbn1cblxuLyoqXG4gKiBNZXRob2QgdG8gcmV0cmlldmUgYWxsIHByb3BlcnR5IHBhdGhzIGFzc2lnbmVkIHRvIHRoZSBDb3JlLk9wZXJhdGlvbkF2YWlsYWJsZSBhbm5vdGF0aW9uLlxuICpcbiAqIEBwYXJhbSB7UmVjb3JkPHN0cmluZywgYW55Pn0gb3BlcmF0aW9uQXZhaWxhYmxlTWFwIFRoZSByZWNvcmQgY29uc2lzdGluZyBvZiBhY3Rpb25zIGFuZCB0aGVpciBDb3JlLk9wZXJhdGlvbkF2YWlsYWJsZSBwcm9wZXJ0eSBwYXRoc1xuICogQHBhcmFtIHtDb252ZXJ0ZXJDb250ZXh0fSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBpbnN0YW5jZSBvZiB0aGUgY29udmVydGVyIGNvbnRleHRcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBDU1Ygc3RyaW5nIG9mIGFsbCBwcm9wZXJ0eSBwYXRocyBhc3NvY2lhdGVkIHdpdGggdGhlIENvcmUuT3BlcmF0aW9uQXZhaWxhYmxlIGFubm90YXRpb25cbiAqL1xuZnVuY3Rpb24gZ2V0T3BlcmF0aW9uQXZhaWxhYmxlUHJvcGVydGllcyhvcGVyYXRpb25BdmFpbGFibGVNYXA6IFJlY29yZDxzdHJpbmcsIGFueT4sIGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBzdHJpbmcge1xuXHRjb25zdCBwcm9wZXJ0aWVzID0gbmV3IFNldCgpO1xuXG5cdGZvciAoY29uc3QgYWN0aW9uTmFtZSBpbiBvcGVyYXRpb25BdmFpbGFibGVNYXApIHtcblx0XHRjb25zdCBwcm9wZXJ0eU5hbWUgPSBvcGVyYXRpb25BdmFpbGFibGVNYXBbYWN0aW9uTmFtZV07XG5cdFx0aWYgKHByb3BlcnR5TmFtZSA9PT0gbnVsbCkge1xuXHRcdFx0Ly8gQW5ub3RhdGlvbiBjb25maWd1cmVkIHdpdGggZXhwbGljaXQgJ251bGwnIChhY3Rpb24gYWR2ZXJ0aXNlbWVudCByZWxldmFudClcblx0XHRcdHByb3BlcnRpZXMuYWRkKGFjdGlvbk5hbWUpO1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIHByb3BlcnR5TmFtZSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0Ly8gQWRkIHByb3BlcnR5IHBhdGhzIGFuZCBub3QgQ29uc3RhbnQgdmFsdWVzLlxuXHRcdFx0cHJvcGVydGllcy5hZGQocHJvcGVydHlOYW1lKTtcblx0XHR9XG5cdH1cblxuXHRpZiAocHJvcGVydGllcy5zaXplKSB7XG5cdFx0Ly8gU29tZSBhY3Rpb25zIGhhdmUgYW4gb3BlcmF0aW9uIGF2YWlsYWJsZSBiYXNlZCBvbiBwcm9wZXJ0eSAtLT4gd2UgbmVlZCB0byBsb2FkIHRoZSBIZWFkZXJJbmZvLlRpdGxlIHByb3BlcnR5XG5cdFx0Ly8gc28gdGhhdCB0aGUgZGlhbG9nIG9uIHBhcnRpYWwgYWN0aW9ucyBpcyBkaXNwbGF5ZWQgcHJvcGVybHkgKEJDUCAyMTgwMjcxNDI1KVxuXHRcdGNvbnN0IGVudGl0eVR5cGUgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGUoKTtcblx0XHRjb25zdCB0aXRsZVByb3BlcnR5ID0gKGVudGl0eVR5cGUuYW5ub3RhdGlvbnM/LlVJPy5IZWFkZXJJbmZvPy5UaXRsZSBhcyBEYXRhRmllbGRUeXBlcyk/LlZhbHVlPy5wYXRoO1xuXHRcdGlmICh0aXRsZVByb3BlcnR5KSB7XG5cdFx0XHRwcm9wZXJ0aWVzLmFkZCh0aXRsZVByb3BlcnR5KTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gQXJyYXkuZnJvbShwcm9wZXJ0aWVzKS5qb2luKFwiLFwiKTtcbn1cblxuLyoqXG4gKiBJdGVyYXRlcyBvdmVyIHRoZSBEYXRhRmllbGRGb3JBY3Rpb24gYW5kIERhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbiBvZiBhIGxpbmUgaXRlbSBhbmRcbiAqIHJldHVybnMgYWxsIHRoZSBVSS5IaWRkZW4gYW5ub3RhdGlvbiBleHByZXNzaW9ucy5cbiAqXG4gKiBAcGFyYW0gbGluZUl0ZW1Bbm5vdGF0aW9uIENvbGxlY3Rpb24gb2YgZGF0YSBmaWVsZHMgdXNlZCBmb3IgcmVwcmVzZW50YXRpb24gaW4gYSB0YWJsZSBvciBsaXN0XG4gKiBAcGFyYW0gY3VycmVudEVudGl0eVR5cGUgQ3VycmVudCBlbnRpdHkgdHlwZVxuICogQHBhcmFtIGNvbnRleHREYXRhTW9kZWxPYmplY3RQYXRoIE9iamVjdCBwYXRoIG9mIHRoZSBkYXRhIG1vZGVsXG4gKiBAcGFyYW0gaXNFbnRpdHlTZXRcbiAqIEByZXR1cm5zIEFsbCB0aGUgYFVJLkhpZGRlbmAgcGF0aCBleHByZXNzaW9ucyBmb3VuZCBpbiB0aGUgcmVsZXZhbnQgYWN0aW9uc1xuICovXG5mdW5jdGlvbiBnZXRVSUhpZGRlbkV4cEZvckFjdGlvbnNSZXF1aXJpbmdDb250ZXh0KFxuXHRsaW5lSXRlbUFubm90YXRpb246IExpbmVJdGVtLFxuXHRjdXJyZW50RW50aXR5VHlwZTogRW50aXR5VHlwZSxcblx0Y29udGV4dERhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdGlzRW50aXR5U2V0OiBib29sZWFuXG4pOiBFeHByZXNzaW9uPGJvb2xlYW4+W10ge1xuXHRjb25zdCBhVWlIaWRkZW5QYXRoRXhwcmVzc2lvbnM6IEV4cHJlc3Npb248Ym9vbGVhbj5bXSA9IFtdO1xuXHRsaW5lSXRlbUFubm90YXRpb24uZm9yRWFjaChkYXRhRmllbGQgPT4ge1xuXHRcdC8vIENoZWNrIGlmIHRoZSBsaW5lSXRlbSBjb250ZXh0IGlzIHRoZSBzYW1lIGFzIHRoYXQgb2YgdGhlIGFjdGlvbjpcblx0XHRpZiAoXG5cdFx0XHQoZGF0YUZpZWxkLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBY3Rpb24gJiZcblx0XHRcdFx0ZGF0YUZpZWxkPy5BY3Rpb25UYXJnZXQ/LmlzQm91bmQgJiZcblx0XHRcdFx0Y3VycmVudEVudGl0eVR5cGUgPT09IGRhdGFGaWVsZD8uQWN0aW9uVGFyZ2V0LnNvdXJjZUVudGl0eVR5cGUpIHx8XG5cdFx0XHQoZGF0YUZpZWxkLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24gJiZcblx0XHRcdFx0ZGF0YUZpZWxkLlJlcXVpcmVzQ29udGV4dCAmJlxuXHRcdFx0XHRkYXRhRmllbGQ/LklubGluZT8udmFsdWVPZigpICE9PSB0cnVlKVxuXHRcdCkge1xuXHRcdFx0aWYgKHR5cGVvZiBkYXRhRmllbGQuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4/LnZhbHVlT2YoKSA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRhVWlIaWRkZW5QYXRoRXhwcmVzc2lvbnMucHVzaChcblx0XHRcdFx0XHRlcXVhbChcblx0XHRcdFx0XHRcdGdldEJpbmRpbmdFeHBGcm9tQ29udGV4dChcblx0XHRcdFx0XHRcdFx0ZGF0YUZpZWxkIGFzIERhdGFGaWVsZEZvckFjdGlvbiB8IERhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbixcblx0XHRcdFx0XHRcdFx0Y29udGV4dERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdFx0XHRcdFx0XHRcdGlzRW50aXR5U2V0XG5cdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0ZmFsc2Vcblx0XHRcdFx0XHQpXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIGFVaUhpZGRlblBhdGhFeHByZXNzaW9ucztcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyB1c2VkIHRvIGNoYW5nZSB0aGUgY29udGV4dCBjdXJyZW50bHkgcmVmZXJlbmNlZCBieSB0aGlzIGJpbmRpbmcgYnkgcmVtb3ZpbmcgdGhlIGxhc3QgbmF2aWdhdGlvbiBwcm9wZXJ0eS5cbiAqXG4gKiBJdCBpcyB1c2VkIChzcGVjaWZpY2FsbHkgaW4gdGhpcyBjYXNlKSwgdG8gdHJhbnNmb3JtIGEgYmluZGluZyBtYWRlIGZvciBhIE5hdlByb3AgY29udGV4dCAvTWFpbk9iamVjdC9OYXZQcm9wMS9OYXZQcm9wMixcbiAqIGludG8gYSBiaW5kaW5nIG9uIHRoZSBwcmV2aW91cyBjb250ZXh0IC9NYWluT2JqZWN0L05hdlByb3AxLlxuICpcbiAqIEBwYXJhbSBzb3VyY2UgRGF0YUZpZWxkRm9yQWN0aW9uIHwgRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uIHwgQ3VzdG9tQWN0aW9uXG4gKiBAcGFyYW0gY29udGV4dERhdGFNb2RlbE9iamVjdFBhdGggRGF0YU1vZGVsT2JqZWN0UGF0aFxuICogQHBhcmFtIGlzRW50aXR5U2V0XG4gKiBAcmV0dXJucyBUaGUgYmluZGluZyBleHByZXNzaW9uXG4gKi9cbmZ1bmN0aW9uIGdldEJpbmRpbmdFeHBGcm9tQ29udGV4dChcblx0c291cmNlOiBEYXRhRmllbGRGb3JBY3Rpb24gfCBEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24gfCBDdXN0b21BY3Rpb24sXG5cdGNvbnRleHREYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRpc0VudGl0eVNldDogYm9vbGVhblxuKTogRXhwcmVzc2lvbjxhbnk+IHtcblx0bGV0IHNFeHByZXNzaW9uOiBhbnkgfCB1bmRlZmluZWQ7XG5cdGlmIChcblx0XHQoc291cmNlIGFzIERhdGFGaWVsZEZvckFjdGlvbik/LiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBY3Rpb24gfHxcblx0XHQoc291cmNlIGFzIERhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbik/LiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb25cblx0KSB7XG5cdFx0c0V4cHJlc3Npb24gPSAoc291cmNlIGFzIERhdGFGaWVsZEZvckFjdGlvbiB8IERhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbik/LmFubm90YXRpb25zPy5VST8uSGlkZGVuO1xuXHR9IGVsc2Uge1xuXHRcdHNFeHByZXNzaW9uID0gKHNvdXJjZSBhcyBDdXN0b21BY3Rpb24pPy52aXNpYmxlO1xuXHR9XG5cdGxldCBzUGF0aDogc3RyaW5nO1xuXHRpZiAoc0V4cHJlc3Npb24/LnBhdGgpIHtcblx0XHRzUGF0aCA9IHNFeHByZXNzaW9uLnBhdGg7XG5cdH0gZWxzZSB7XG5cdFx0c1BhdGggPSBzRXhwcmVzc2lvbjtcblx0fVxuXHRpZiAoc1BhdGgpIHtcblx0XHRpZiAoKHNvdXJjZSBhcyBDdXN0b21BY3Rpb24pPy52aXNpYmxlKSB7XG5cdFx0XHRzUGF0aCA9IHNQYXRoLnN1YnN0cmluZygxLCBzUGF0aC5sZW5ndGggLSAxKTtcblx0XHR9XG5cdFx0aWYgKHNQYXRoLmluZGV4T2YoXCIvXCIpID4gMCkge1xuXHRcdFx0Ly9jaGVjayBpZiB0aGUgbmF2aWdhdGlvbiBwcm9wZXJ0eSBpcyBjb3JyZWN0OlxuXHRcdFx0Y29uc3QgYVNwbGl0UGF0aCA9IHNQYXRoLnNwbGl0KFwiL1wiKTtcblx0XHRcdGNvbnN0IHNOYXZpZ2F0aW9uUGF0aCA9IGFTcGxpdFBhdGhbMF07XG5cdFx0XHRpZiAoXG5cdFx0XHRcdGNvbnRleHREYXRhTW9kZWxPYmplY3RQYXRoPy50YXJnZXRPYmplY3Q/Ll90eXBlID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiICYmXG5cdFx0XHRcdGNvbnRleHREYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC5wYXJ0bmVyID09PSBzTmF2aWdhdGlvblBhdGhcblx0XHRcdCkge1xuXHRcdFx0XHRyZXR1cm4gYmluZGluZ0V4cHJlc3Npb24oYVNwbGl0UGF0aC5zbGljZSgxKS5qb2luKFwiL1wiKSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY29uc3RhbnQodHJ1ZSk7XG5cdFx0XHR9XG5cdFx0XHQvLyBJbiBjYXNlIHRoZXJlIGlzIG5vIG5hdmlnYXRpb24gcHJvcGVydHksIGlmIGl0J3MgYW4gZW50aXR5U2V0LCB0aGUgZXhwcmVzc2lvbiBiaW5kaW5nIGhhcyB0byBiZSByZXR1cm5lZDpcblx0XHR9IGVsc2UgaWYgKGlzRW50aXR5U2V0KSB7XG5cdFx0XHRyZXR1cm4gYmluZGluZ0V4cHJlc3Npb24oc1BhdGgpO1xuXHRcdFx0Ly8gb3RoZXJ3aXNlIHRoZSBleHByZXNzaW9uIGJpbmRpbmcgY2Fubm90IGJlIHRha2VuIGludG8gYWNjb3VudCBmb3IgdGhlIHNlbGVjdGlvbiBtb2RlIGV2YWx1YXRpb246XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBjb25zdGFudCh0cnVlKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGNvbnN0YW50KHRydWUpO1xufVxuXG4vKipcbiAqIExvb3AgdGhyb3VnaCB0aGUgRGF0YUZpZWxkRm9yQWN0aW9uIGFuZCBEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24gb2YgYSBsaW5lIGl0ZW0gYW5kIGNoZWNrXG4gKiBpZiBhdCBsZWFzdCBvbmUgb2YgdGhlbSBpcyBhbHdheXMgdmlzaWJsZSBpbiB0aGUgdGFibGUgdG9vbGJhciAoYW5kIHJlcXVpcmVzIGEgY29udGV4dCkuXG4gKlxuICogQHBhcmFtIGxpbmVJdGVtQW5ub3RhdGlvbiBDb2xsZWN0aW9uIG9mIGRhdGEgZmllbGRzIGZvciByZXByZXNlbnRhdGlvbiBpbiBhIHRhYmxlIG9yIGxpc3RcbiAqIEBwYXJhbSBjdXJyZW50RW50aXR5VHlwZSBDdXJyZW50IEVudGl0eSBUeXBlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gYHRydWVgIGlmIHRoZXJlIGlzIGF0IGxlYXN0IDEgYWN0aW9uIHRoYXQgbWVldHMgdGhlIGNyaXRlcmlhXG4gKi9cbmZ1bmN0aW9uIGhhc0JvdW5kQWN0aW9uc0Fsd2F5c1Zpc2libGVJblRvb2xCYXIobGluZUl0ZW1Bbm5vdGF0aW9uOiBMaW5lSXRlbSwgY3VycmVudEVudGl0eVR5cGU6IEVudGl0eVR5cGUpOiBib29sZWFuIHtcblx0cmV0dXJuIGxpbmVJdGVtQW5ub3RhdGlvbi5zb21lKGRhdGFGaWVsZCA9PiB7XG5cdFx0aWYgKFxuXHRcdFx0KGRhdGFGaWVsZC4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQWN0aW9uIHx8XG5cdFx0XHRcdGRhdGFGaWVsZC4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uKSAmJlxuXHRcdFx0ZGF0YUZpZWxkPy5JbmxpbmU/LnZhbHVlT2YoKSAhPT0gdHJ1ZSAmJlxuXHRcdFx0KGRhdGFGaWVsZC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpID09PSBmYWxzZSB8fCBkYXRhRmllbGQuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4/LnZhbHVlT2YoKSA9PT0gdW5kZWZpbmVkKVxuXHRcdCkge1xuXHRcdFx0aWYgKGRhdGFGaWVsZC4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQWN0aW9uKSB7XG5cdFx0XHRcdC8vIENoZWNrIGlmIHRoZSBsaW5lSXRlbSBjb250ZXh0IGlzIHRoZSBzYW1lIGFzIHRoYXQgb2YgdGhlIGFjdGlvbjpcblx0XHRcdFx0cmV0dXJuIGRhdGFGaWVsZD8uQWN0aW9uVGFyZ2V0Py5pc0JvdW5kICYmIGN1cnJlbnRFbnRpdHlUeXBlID09PSBkYXRhRmllbGQ/LkFjdGlvblRhcmdldC5zb3VyY2VFbnRpdHlUeXBlO1xuXHRcdFx0fSBlbHNlIGlmIChkYXRhRmllbGQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbikge1xuXHRcdFx0XHRyZXR1cm4gZGF0YUZpZWxkLlJlcXVpcmVzQ29udGV4dDtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gaGFzQ3VzdG9tQWN0aW9uc0Fsd2F5c1Zpc2libGVJblRvb2xCYXIobWFuaWZlc3RBY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21BY3Rpb24+KTogYm9vbGVhbiB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYW5pZmVzdEFjdGlvbnMpLnNvbWUoYWN0aW9uS2V5ID0+IHtcblx0XHRjb25zdCBhY3Rpb24gPSBtYW5pZmVzdEFjdGlvbnNbYWN0aW9uS2V5XTtcblx0XHRpZiAoYWN0aW9uLnJlcXVpcmVzU2VsZWN0aW9uICYmIGFjdGlvbi52aXNpYmxlPy50b1N0cmluZygpID09PSBcInRydWVcIikge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSk7XG59XG5cbi8qKlxuICogSXRlcmF0ZXMgb3ZlciB0aGUgY3VzdG9tIGFjdGlvbnMgKHdpdGgga2V5IHJlcXVpcmVzU2VsZWN0aW9uKSBkZWNsYXJlZCBpbiB0aGUgbWFuaWZlc3QgZm9yIHRoZSBjdXJyZW50IGxpbmUgaXRlbSBhbmQgcmV0dXJucyBhbGwgdGhlXG4gKiB2aXNpYmxlIGtleSB2YWx1ZXMgYXMgYW4gZXhwcmVzc2lvbi5cbiAqXG4gKiBAcGFyYW0gbWFuaWZlc3RBY3Rpb25zIFRoZSBhY3Rpb25zIGRlZmluZWQgaW4gdGhlIG1hbmlmZXN0XG4gKiBAcmV0dXJucyBBcnJheTxFeHByZXNzaW9uPGJvb2xlYW4+PiBBbGwgdGhlIHZpc2libGUgcGF0aCBleHByZXNzaW9ucyBvZiB0aGUgYWN0aW9ucyB0aGF0IG1lZXQgdGhlIGNyaXRlcmlhXG4gKi9cbmZ1bmN0aW9uIGdldFZpc2libGVFeHBGb3JDdXN0b21BY3Rpb25zUmVxdWlyaW5nQ29udGV4dChtYW5pZmVzdEFjdGlvbnM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj4pOiBFeHByZXNzaW9uPGJvb2xlYW4+W10ge1xuXHRjb25zdCBhVmlzaWJsZVBhdGhFeHByZXNzaW9uczogRXhwcmVzc2lvbjxib29sZWFuPltdID0gW107XG5cdGlmIChtYW5pZmVzdEFjdGlvbnMpIHtcblx0XHRPYmplY3Qua2V5cyhtYW5pZmVzdEFjdGlvbnMpLmZvckVhY2goYWN0aW9uS2V5ID0+IHtcblx0XHRcdGNvbnN0IGFjdGlvbiA9IG1hbmlmZXN0QWN0aW9uc1thY3Rpb25LZXldO1xuXHRcdFx0aWYgKGFjdGlvbi5yZXF1aXJlc1NlbGVjdGlvbiA9PT0gdHJ1ZSAmJiBhY3Rpb24udmlzaWJsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgYWN0aW9uLnZpc2libGUgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0XHQvKlRoZSBmaW5hbCBhaW0gd291bGQgYmUgdG8gY2hlY2sgaWYgdGhlIHBhdGggZXhwcmVzc2lvbiBkZXBlbmRzIG9uIHRoZSBwYXJlbnQgY29udGV4dFxuXHRcdFx0XHRcdGFuZCBjb25zaWRlcnMgb25seSB0aG9zZSBleHByZXNzaW9ucyBmb3IgdGhlIGV4cHJlc3Npb24gZXZhbHVhdGlvbixcblx0XHRcdFx0XHRidXQgY3VycmVudGx5IG5vdCBwb3NzaWJsZSBmcm9tIHRoZSBtYW5pZmVzdCBhcyB0aGUgdmlzaWJsZSBrZXkgaXMgYm91bmQgb24gdGhlIHBhcmVudCBlbnRpdHkuXG5cdFx0XHRcdFx0VHJpY2t5IHRvIGRpZmZlcmVudGlhdGUgdGhlIHBhdGggYXMgaXQncyBkb25lIGZvciB0aGUgSGlkZGVuIGFubm90YXRpb24uXG5cdFx0XHRcdFx0Rm9yIHRoZSB0aW1lIGJlaW5nIHdlIGNvbnNpZGVyIGFsbCB0aGUgcGF0aHMgb2YgdGhlIG1hbmlmZXN0Ki9cblxuXHRcdFx0XHRcdGFWaXNpYmxlUGF0aEV4cHJlc3Npb25zLnB1c2gocmVzb2x2ZUJpbmRpbmdTdHJpbmcoYWN0aW9uPy52aXNpYmxlPy52YWx1ZU9mKCkpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBhVmlzaWJsZVBhdGhFeHByZXNzaW9ucztcbn1cblxuLyoqXG4gKiBFdmFsdWF0ZSBpZiB0aGUgcGF0aCBpcyBzdGF0aWNhbGx5IGRlbGV0YWJsZSBvciB1cGRhdGFibGUuXG4gKlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEByZXR1cm5zIHtUYWJsZUNhcGFiaWxpdHlSZXN0cmljdGlvbn0gVGhlIHRhYmxlIGNhcGFiaWxpdGllc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FwYWJpbGl0eVJlc3RyaWN0aW9uKGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBUYWJsZUNhcGFiaWxpdHlSZXN0cmljdGlvbiB7XG5cdGNvbnN0IGlzRGVsZXRhYmxlID0gaXNQYXRoRGVsZXRhYmxlKGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpKTtcblx0Y29uc3QgaXNVcGRhdGFibGUgPSBpc1BhdGhVcGRhdGFibGUoY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCkpO1xuXHRyZXR1cm4ge1xuXHRcdGlzRGVsZXRhYmxlOiAhKGlzQ29uc3RhbnQoaXNEZWxldGFibGUpICYmIGlzRGVsZXRhYmxlLnZhbHVlID09PSBmYWxzZSksXG5cdFx0aXNVcGRhdGFibGU6ICEoaXNDb25zdGFudChpc1VwZGF0YWJsZSkgJiYgaXNVcGRhdGFibGUudmFsdWUgPT09IGZhbHNlKVxuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VsZWN0aW9uTW9kZShcblx0bGluZUl0ZW1Bbm5vdGF0aW9uOiBMaW5lSXRlbSB8IHVuZGVmaW5lZCxcblx0dmlzdWFsaXphdGlvblBhdGg6IHN0cmluZyxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0aXNFbnRpdHlTZXQ6IGJvb2xlYW4sXG5cdHRhcmdldENhcGFiaWxpdGllczogVGFibGVDYXBhYmlsaXR5UmVzdHJpY3Rpb24sXG5cdGlzRGVsZXRlQnV0dG9uVmlzaWJsZT86IEV4cHJlc3Npb248Ym9vbGVhbj5cbik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdGlmICghbGluZUl0ZW1Bbm5vdGF0aW9uKSB7XG5cdFx0cmV0dXJuIFNlbGVjdGlvbk1vZGUuTm9uZTtcblx0fVxuXHRjb25zdCB0YWJsZU1hbmlmZXN0U2V0dGluZ3MgPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0Q29udHJvbENvbmZpZ3VyYXRpb24odmlzdWFsaXphdGlvblBhdGgpO1xuXHRsZXQgc2VsZWN0aW9uTW9kZSA9IHRhYmxlTWFuaWZlc3RTZXR0aW5ncy50YWJsZVNldHRpbmdzPy5zZWxlY3Rpb25Nb2RlO1xuXHRsZXQgYUhpZGRlbkJpbmRpbmdFeHByZXNzaW9uczogRXhwcmVzc2lvbjxib29sZWFuPltdID0gW10sXG5cdFx0YVZpc2libGVCaW5kaW5nRXhwcmVzc2lvbnM6IEV4cHJlc3Npb248Ym9vbGVhbj5bXSA9IFtdO1xuXHRjb25zdCBtYW5pZmVzdEFjdGlvbnMgPSBnZXRBY3Rpb25zRnJvbU1hbmlmZXN0KFxuXHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbih2aXN1YWxpemF0aW9uUGF0aCkuYWN0aW9ucyxcblx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdFtdLFxuXHRcdHVuZGVmaW5lZCxcblx0XHRmYWxzZVxuXHQpO1xuXHRsZXQgaXNQYXJlbnREZWxldGFibGUsIHBhcmVudEVudGl0eVNldERlbGV0YWJsZTtcblx0aWYgKGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFRlbXBsYXRlVHlwZS5PYmplY3RQYWdlKSB7XG5cdFx0aXNQYXJlbnREZWxldGFibGUgPSBpc1BhdGhEZWxldGFibGUoY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCksIHVuZGVmaW5lZCk7XG5cdFx0cGFyZW50RW50aXR5U2V0RGVsZXRhYmxlID0gaXNQYXJlbnREZWxldGFibGUgPyBjb21waWxlQmluZGluZyhpc1BhcmVudERlbGV0YWJsZSwgdHJ1ZSkgOiBpc1BhcmVudERlbGV0YWJsZTtcblx0fVxuXHRpZiAoc2VsZWN0aW9uTW9kZSAmJiBzZWxlY3Rpb25Nb2RlID09PSBTZWxlY3Rpb25Nb2RlLk5vbmUgJiYgaXNEZWxldGVCdXR0b25WaXNpYmxlKSB7XG5cdFx0cmV0dXJuIGNvbXBpbGVCaW5kaW5nKGlmRWxzZShpc0RlbGV0ZUJ1dHRvblZpc2libGUsIGNvbnN0YW50KFwiTXVsdGlcIiksIGNvbnN0YW50KFwiTm9uZVwiKSkpO1xuXHR9XG5cdGlmICghc2VsZWN0aW9uTW9kZSB8fCBzZWxlY3Rpb25Nb2RlID09PSBTZWxlY3Rpb25Nb2RlLkF1dG8pIHtcblx0XHRzZWxlY3Rpb25Nb2RlID0gU2VsZWN0aW9uTW9kZS5NdWx0aTtcblx0fVxuXG5cdGlmIChcblx0XHRoYXNCb3VuZEFjdGlvbnNBbHdheXNWaXNpYmxlSW5Ub29sQmFyKGxpbmVJdGVtQW5ub3RhdGlvbiwgY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCkpIHx8XG5cdFx0aGFzQ3VzdG9tQWN0aW9uc0Fsd2F5c1Zpc2libGVJblRvb2xCYXIobWFuaWZlc3RBY3Rpb25zKVxuXHQpIHtcblx0XHRyZXR1cm4gc2VsZWN0aW9uTW9kZTtcblx0fVxuXHRhSGlkZGVuQmluZGluZ0V4cHJlc3Npb25zID0gZ2V0VUlIaWRkZW5FeHBGb3JBY3Rpb25zUmVxdWlyaW5nQ29udGV4dChcblx0XHRsaW5lSXRlbUFubm90YXRpb24sXG5cdFx0Y29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCksXG5cdFx0Y29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCksXG5cdFx0aXNFbnRpdHlTZXRcblx0KTtcblx0YVZpc2libGVCaW5kaW5nRXhwcmVzc2lvbnMgPSBnZXRWaXNpYmxlRXhwRm9yQ3VzdG9tQWN0aW9uc1JlcXVpcmluZ0NvbnRleHQobWFuaWZlc3RBY3Rpb25zKTtcblxuXHQvLyBObyBhY3Rpb24gcmVxdWlyaW5nIGEgY29udGV4dDpcblx0aWYgKGFIaWRkZW5CaW5kaW5nRXhwcmVzc2lvbnMubGVuZ3RoID09PSAwICYmIGFWaXNpYmxlQmluZGluZ0V4cHJlc3Npb25zLmxlbmd0aCA9PT0gMCkge1xuXHRcdGlmICghaXNFbnRpdHlTZXQpIHtcblx0XHRcdGlmICh0YXJnZXRDYXBhYmlsaXRpZXMuaXNEZWxldGFibGUgfHwgcGFyZW50RW50aXR5U2V0RGVsZXRhYmxlICE9PSBcImZhbHNlXCIpIHtcblx0XHRcdFx0cmV0dXJuIGNvbXBpbGVCaW5kaW5nKFxuXHRcdFx0XHRcdGlmRWxzZShlcXVhbChiaW5kaW5nRXhwcmVzc2lvbihcIi9lZGl0TW9kZVwiLCBcInVpXCIpLCBcIkVkaXRhYmxlXCIpLCBjb25zdGFudChzZWxlY3Rpb25Nb2RlKSwgY29uc3RhbnQoU2VsZWN0aW9uTW9kZS5Ob25lKSlcblx0XHRcdFx0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBTZWxlY3Rpb25Nb2RlLk5vbmU7XG5cdFx0XHR9XG5cdFx0XHQvLyBFbnRpdHlTZXQgZGVsZXRhYmxlOlxuXHRcdH0gZWxzZSBpZiAodGFyZ2V0Q2FwYWJpbGl0aWVzLmlzRGVsZXRhYmxlKSB7XG5cdFx0XHRyZXR1cm4gc2VsZWN0aW9uTW9kZTtcblx0XHRcdC8vIEVudGl0eVNldCBub3QgZGVsZXRhYmxlOlxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gU2VsZWN0aW9uTW9kZS5Ob25lO1xuXHRcdH1cblx0XHQvLyBUaGVyZSBhcmUgYWN0aW9ucyByZXF1aXJpbmcgYSBjb250ZXh0OlxuXHR9IGVsc2UgaWYgKCFpc0VudGl0eVNldCkge1xuXHRcdGlmICh0YXJnZXRDYXBhYmlsaXRpZXMuaXNEZWxldGFibGUgfHwgcGFyZW50RW50aXR5U2V0RGVsZXRhYmxlICE9PSBcImZhbHNlXCIpIHtcblx0XHRcdHJldHVybiBjb21waWxlQmluZGluZyhcblx0XHRcdFx0aWZFbHNlKFxuXHRcdFx0XHRcdGVxdWFsKGJpbmRpbmdFeHByZXNzaW9uKFwiL2VkaXRNb2RlXCIsIFwidWlcIiksIFwiRWRpdGFibGVcIiksXG5cdFx0XHRcdFx0Y29uc3RhbnQoc2VsZWN0aW9uTW9kZSksXG5cdFx0XHRcdFx0aWZFbHNlKFxuXHRcdFx0XHRcdFx0b3IoLi4uYUhpZGRlbkJpbmRpbmdFeHByZXNzaW9ucy5jb25jYXQoYVZpc2libGVCaW5kaW5nRXhwcmVzc2lvbnMpKSxcblx0XHRcdFx0XHRcdGNvbnN0YW50KHNlbGVjdGlvbk1vZGUpLFxuXHRcdFx0XHRcdFx0Y29uc3RhbnQoU2VsZWN0aW9uTW9kZS5Ob25lKVxuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGNvbXBpbGVCaW5kaW5nKFxuXHRcdFx0XHRpZkVsc2UoXG5cdFx0XHRcdFx0b3IoLi4uYUhpZGRlbkJpbmRpbmdFeHByZXNzaW9ucy5jb25jYXQoYVZpc2libGVCaW5kaW5nRXhwcmVzc2lvbnMpKSxcblx0XHRcdFx0XHRjb25zdGFudChzZWxlY3Rpb25Nb2RlKSxcblx0XHRcdFx0XHRjb25zdGFudChTZWxlY3Rpb25Nb2RlLk5vbmUpXG5cdFx0XHRcdClcblx0XHRcdCk7XG5cdFx0fVxuXHRcdC8vRW50aXR5U2V0IGRlbGV0YWJsZTpcblx0fSBlbHNlIGlmICh0YXJnZXRDYXBhYmlsaXRpZXMuaXNEZWxldGFibGUpIHtcblx0XHRyZXR1cm4gU2VsZWN0aW9uTW9kZS5NdWx0aTtcblx0XHQvL0VudGl0eVNldCBub3QgZGVsZXRhYmxlOlxuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBjb21waWxlQmluZGluZyhcblx0XHRcdGlmRWxzZShcblx0XHRcdFx0b3IoLi4uYUhpZGRlbkJpbmRpbmdFeHByZXNzaW9ucy5jb25jYXQoYVZpc2libGVCaW5kaW5nRXhwcmVzc2lvbnMpKSxcblx0XHRcdFx0Y29uc3RhbnQoc2VsZWN0aW9uTW9kZSksXG5cdFx0XHRcdGNvbnN0YW50KFNlbGVjdGlvbk1vZGUuTm9uZSlcblx0XHRcdClcblx0XHQpO1xuXHR9XG59XG5cbi8qKlxuICogTWV0aG9kIHRvIHJldHJpZXZlIGFsbCB0YWJsZSBhY3Rpb25zIGZyb20gYW5ub3RhdGlvbnMuXG4gKlxuICogQHBhcmFtIGxpbmVJdGVtQW5ub3RhdGlvblxuICogQHBhcmFtIHZpc3VhbGl6YXRpb25QYXRoXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHJldHVybnMge1JlY29yZDxCYXNlQWN0aW9uLCBCYXNlQWN0aW9uPn0gVGhlIHRhYmxlIGFubm90YXRpb24gYWN0aW9uc1xuICovXG5mdW5jdGlvbiBnZXRUYWJsZUFubm90YXRpb25BY3Rpb25zKGxpbmVJdGVtQW5ub3RhdGlvbjogTGluZUl0ZW0sIHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcsIGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpIHtcblx0Y29uc3QgdGFibGVBY3Rpb25zOiBCYXNlQWN0aW9uW10gPSBbXTtcblx0Y29uc3QgaGlkZGVuVGFibGVBY3Rpb25zOiBCYXNlQWN0aW9uW10gPSBbXTtcblx0aWYgKGxpbmVJdGVtQW5ub3RhdGlvbikge1xuXHRcdGxpbmVJdGVtQW5ub3RhdGlvbi5mb3JFYWNoKChkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMpID0+IHtcblx0XHRcdGxldCB0YWJsZUFjdGlvbjogQW5ub3RhdGlvbkFjdGlvbiB8IHVuZGVmaW5lZDtcblx0XHRcdGlmIChcblx0XHRcdFx0aXNEYXRhRmllbGRGb3JBY3Rpb25BYnN0cmFjdChkYXRhRmllbGQpICYmXG5cdFx0XHRcdCEoZGF0YUZpZWxkLmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgPT09IHRydWUpICYmXG5cdFx0XHRcdCFkYXRhRmllbGQuSW5saW5lICYmXG5cdFx0XHRcdCFkYXRhRmllbGQuRGV0ZXJtaW5pbmdcblx0XHRcdCkge1xuXHRcdFx0XHRjb25zdCBrZXkgPSBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGRhdGFGaWVsZCk7XG5cdFx0XHRcdHN3aXRjaCAoZGF0YUZpZWxkLiRUeXBlKSB7XG5cdFx0XHRcdFx0Y2FzZSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckFjdGlvblwiOlxuXHRcdFx0XHRcdFx0dGFibGVBY3Rpb24gPSB7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IEFjdGlvblR5cGUuRGF0YUZpZWxkRm9yQWN0aW9uLFxuXHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGRhdGFGaWVsZC5mdWxseVF1YWxpZmllZE5hbWUpLFxuXHRcdFx0XHRcdFx0XHRrZXk6IGtleSxcblx0XHRcdFx0XHRcdFx0dmlzaWJsZTogY29tcGlsZUJpbmRpbmcoXG5cdFx0XHRcdFx0XHRcdFx0bm90KFxuXHRcdFx0XHRcdFx0XHRcdFx0ZXF1YWwoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFubm90YXRpb25FeHByZXNzaW9uKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGFGaWVsZC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRbXSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR1bmRlZmluZWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dC5nZXRSZWxhdGl2ZU1vZGVsUGF0aEZ1bmN0aW9uKClcblx0XHRcdFx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0dHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdFx0aXNOYXZpZ2FibGU6IHRydWVcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb25cIjpcblx0XHRcdFx0XHRcdHRhYmxlQWN0aW9uID0ge1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBBY3Rpb25UeXBlLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbixcblx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvblBhdGg6IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChkYXRhRmllbGQuZnVsbHlRdWFsaWZpZWROYW1lKSxcblx0XHRcdFx0XHRcdFx0a2V5OiBrZXksXG5cdFx0XHRcdFx0XHRcdHZpc2libGU6IGNvbXBpbGVCaW5kaW5nKFxuXHRcdFx0XHRcdFx0XHRcdG5vdChcblx0XHRcdFx0XHRcdFx0XHRcdGVxdWFsKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uRXhwcmVzc2lvbihcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhRmllbGQuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0W10sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dW5kZWZpbmVkLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0UmVsYXRpdmVNb2RlbFBhdGhGdW5jdGlvbigpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRydWVcblx0XHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoZGF0YUZpZWxkLmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgPT09IHRydWUpIHtcblx0XHRcdFx0aGlkZGVuVGFibGVBY3Rpb25zLnB1c2goe1xuXHRcdFx0XHRcdHR5cGU6IEFjdGlvblR5cGUuRGVmYXVsdCxcblx0XHRcdFx0XHRrZXk6IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQoZGF0YUZpZWxkKVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGlmICh0YWJsZUFjdGlvbikge1xuXHRcdFx0XHR0YWJsZUFjdGlvbnMucHVzaCh0YWJsZUFjdGlvbik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0cmV0dXJuIHtcblx0XHR0YWJsZUFjdGlvbnM6IHRhYmxlQWN0aW9ucyxcblx0XHRoaWRkZW5UYWJsZUFjdGlvbnM6IGhpZGRlblRhYmxlQWN0aW9uc1xuXHR9O1xufVxuXG5mdW5jdGlvbiBnZXRIaWdobGlnaHRSb3dCaW5kaW5nKFxuXHRjcml0aWNhbGl0eUFubm90YXRpb246IFBhdGhBbm5vdGF0aW9uRXhwcmVzc2lvbjxDcml0aWNhbGl0eVR5cGU+IHwgRW51bVZhbHVlPENyaXRpY2FsaXR5VHlwZT4gfCB1bmRlZmluZWQsXG5cdGlzRHJhZnRSb290OiBib29sZWFuLFxuXHR0YXJnZXRFbnRpdHlUeXBlPzogRW50aXR5VHlwZVxuKTogRXhwcmVzc2lvbjxNZXNzYWdlVHlwZT4ge1xuXHRsZXQgZGVmYXVsdEhpZ2hsaWdodFJvd0RlZmluaXRpb246IE1lc3NhZ2VUeXBlIHwgRXhwcmVzc2lvbjxNZXNzYWdlVHlwZT4gPSBNZXNzYWdlVHlwZS5Ob25lO1xuXHRpZiAoY3JpdGljYWxpdHlBbm5vdGF0aW9uKSB7XG5cdFx0aWYgKHR5cGVvZiBjcml0aWNhbGl0eUFubm90YXRpb24gPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdGRlZmF1bHRIaWdobGlnaHRSb3dEZWZpbml0aW9uID0gYW5ub3RhdGlvbkV4cHJlc3Npb24oY3JpdGljYWxpdHlBbm5vdGF0aW9uKSBhcyBFeHByZXNzaW9uPE1lc3NhZ2VUeXBlPjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gRW51bSBWYWx1ZSBzbyB3ZSBnZXQgdGhlIGNvcnJlc3BvbmRpbmcgc3RhdGljIHBhcnRcblx0XHRcdGRlZmF1bHRIaWdobGlnaHRSb3dEZWZpbml0aW9uID0gZ2V0TWVzc2FnZVR5cGVGcm9tQ3JpdGljYWxpdHlUeXBlKGNyaXRpY2FsaXR5QW5ub3RhdGlvbik7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBpZkVsc2UoXG5cdFx0aXNEcmFmdFJvb3QgJiYgRHJhZnQuSXNOZXdPYmplY3QsXG5cdFx0TWVzc2FnZVR5cGUuSW5mb3JtYXRpb24gYXMgTWVzc2FnZVR5cGUsXG5cdFx0Zm9ybWF0UmVzdWx0KFxuXHRcdFx0W2RlZmF1bHRIaWdobGlnaHRSb3dEZWZpbml0aW9uLCBiaW5kaW5nRXhwcmVzc2lvbihgZmlsdGVyZWRNZXNzYWdlc2AsIFwiaW50ZXJuYWxcIildLFxuXHRcdFx0dGFibGVGb3JtYXR0ZXJzLnJvd0hpZ2hsaWdodGluZyxcblx0XHRcdHRhcmdldEVudGl0eVR5cGVcblx0XHQpXG5cdCk7XG59XG5cbmZ1bmN0aW9uIF9nZXRDcmVhdGlvbkJlaGF2aW91cihcblx0bGluZUl0ZW1Bbm5vdGF0aW9uOiBMaW5lSXRlbSB8IHVuZGVmaW5lZCxcblx0dGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb246IFRhYmxlQ29udHJvbENvbmZpZ3VyYXRpb24sXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdG5hdmlnYXRpb25TZXR0aW5nczogTmF2aWdhdGlvblNldHRpbmdzQ29uZmlndXJhdGlvblxuKTogVGFibGVBbm5vdGF0aW9uQ29uZmlndXJhdGlvbltcImNyZWF0ZVwiXSB7XG5cdGNvbnN0IG5hdmlnYXRpb24gPSBuYXZpZ2F0aW9uU2V0dGluZ3M/LmNyZWF0ZSB8fCBuYXZpZ2F0aW9uU2V0dGluZ3M/LmRldGFpbDtcblxuXHQvLyBjcm9zcy1hcHBcblx0aWYgKG5hdmlnYXRpb24/Lm91dGJvdW5kICYmIG5hdmlnYXRpb24ub3V0Ym91bmREZXRhaWwgJiYgbmF2aWdhdGlvblNldHRpbmdzPy5jcmVhdGUpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0bW9kZTogXCJFeHRlcm5hbFwiLFxuXHRcdFx0b3V0Ym91bmQ6IG5hdmlnYXRpb24ub3V0Ym91bmQsXG5cdFx0XHRvdXRib3VuZERldGFpbDogbmF2aWdhdGlvbi5vdXRib3VuZERldGFpbCxcblx0XHRcdG5hdmlnYXRpb25TZXR0aW5nczogbmF2aWdhdGlvblNldHRpbmdzXG5cdFx0fTtcblx0fVxuXG5cdGxldCBuZXdBY3Rpb247XG5cdGlmIChsaW5lSXRlbUFubm90YXRpb24pIHtcblx0XHQvLyBpbi1hcHBcblx0XHRjb25zdCB0YXJnZXRBbm5vdGF0aW9ucyA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCk/LmFubm90YXRpb25zO1xuXHRcdG5ld0FjdGlvbiA9IHRhcmdldEFubm90YXRpb25zPy5Db21tb24/LkRyYWZ0Um9vdD8uTmV3QWN0aW9uIHx8IHRhcmdldEFubm90YXRpb25zPy5TZXNzaW9uPy5TdGlja3lTZXNzaW9uU3VwcG9ydGVkPy5OZXdBY3Rpb247IC8vIFRPRE86IElzIHRoZXJlIHJlYWxseSBubyAnTmV3QWN0aW9uJyBvbiBEcmFmdE5vZGU/IHRhcmdldEFubm90YXRpb25zPy5Db21tb24/LkRyYWZ0Tm9kZT8uTmV3QWN0aW9uXG5cblx0XHRpZiAodGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24uY3JlYXRpb25Nb2RlID09PSBDcmVhdGlvbk1vZGUuQ3JlYXRpb25Sb3cgJiYgbmV3QWN0aW9uKSB7XG5cdFx0XHQvLyBBIGNvbWJpbmF0aW9uIG9mICdDcmVhdGlvblJvdycgYW5kICdOZXdBY3Rpb24nIGRvZXMgbm90IG1ha2Ugc2Vuc2Vcblx0XHRcdC8vIFRPRE86IE9yIGRvZXMgaXQ/XG5cdFx0XHR0aHJvdyBFcnJvcihgQ3JlYXRpb24gbW9kZSAnJHtDcmVhdGlvbk1vZGUuQ3JlYXRpb25Sb3d9JyBjYW4gbm90IGJlIHVzZWQgd2l0aCBhIGN1c3RvbSAnbmV3JyBhY3Rpb24gKCR7bmV3QWN0aW9ufSlgKTtcblx0XHR9XG5cdFx0aWYgKG5hdmlnYXRpb24/LnJvdXRlKSB7XG5cdFx0XHQvLyByb3V0ZSBzcGVjaWZpZWRcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdG1vZGU6IHRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uLmNyZWF0aW9uTW9kZSxcblx0XHRcdFx0YXBwZW5kOiB0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbi5jcmVhdGVBdEVuZCxcblx0XHRcdFx0bmV3QWN0aW9uOiBuZXdBY3Rpb24/LnRvU3RyaW5nKCksXG5cdFx0XHRcdG5hdmlnYXRlVG9UYXJnZXQ6IHRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uLmNyZWF0aW9uTW9kZSA9PT0gQ3JlYXRpb25Nb2RlLk5ld1BhZ2UgPyBuYXZpZ2F0aW9uLnJvdXRlIDogdW5kZWZpbmVkIC8vIG5hdmlnYXRlIG9ubHkgaW4gTmV3UGFnZSBtb2RlXG5cdFx0XHR9O1xuXHRcdH1cblx0fVxuXG5cdC8vIG5vIG5hdmlnYXRpb24gb3Igbm8gcm91dGUgc3BlY2lmaWVkIC0gZmFsbGJhY2sgdG8gaW5saW5lIGNyZWF0ZSBpZiBvcmlnaW5hbCBjcmVhdGlvbiBtb2RlIHdhcyAnTmV3UGFnZSdcblx0aWYgKHRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uLmNyZWF0aW9uTW9kZSA9PT0gQ3JlYXRpb25Nb2RlLk5ld1BhZ2UpIHtcblx0XHR0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbi5jcmVhdGlvbk1vZGUgPSBDcmVhdGlvbk1vZGUuSW5saW5lO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRtb2RlOiB0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbi5jcmVhdGlvbk1vZGUsXG5cdFx0YXBwZW5kOiB0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbi5jcmVhdGVBdEVuZCxcblx0XHRuZXdBY3Rpb246IG5ld0FjdGlvbj8udG9TdHJpbmcoKVxuXHR9O1xufVxuXG5jb25zdCBfZ2V0Um93Q29uZmlndXJhdGlvblByb3BlcnR5ID0gZnVuY3Rpb24oXG5cdGxpbmVJdGVtQW5ub3RhdGlvbjogTGluZUl0ZW0gfCB1bmRlZmluZWQsXG5cdHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdG5hdmlnYXRpb25TZXR0aW5nczogTmF2aWdhdGlvblNldHRpbmdzQ29uZmlndXJhdGlvbixcblx0dGFyZ2V0UGF0aDogc3RyaW5nXG4pIHtcblx0bGV0IHByZXNzUHJvcGVydHksIG5hdmlnYXRpb25UYXJnZXQ7XG5cdGxldCBjcml0aWNhbGl0eVByb3BlcnR5OiBFeHByZXNzaW9uT3JQcmltaXRpdmU8TWVzc2FnZVR5cGU+ID0gTWVzc2FnZVR5cGUuTm9uZTtcblx0Y29uc3QgdGFyZ2V0RW50aXR5VHlwZSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpO1xuXHRpZiAobmF2aWdhdGlvblNldHRpbmdzICYmIGxpbmVJdGVtQW5ub3RhdGlvbikge1xuXHRcdG5hdmlnYXRpb25UYXJnZXQgPSBuYXZpZ2F0aW9uU2V0dGluZ3MuZGlzcGxheT8udGFyZ2V0IHx8IG5hdmlnYXRpb25TZXR0aW5ncy5kZXRhaWw/Lm91dGJvdW5kO1xuXHRcdGlmIChuYXZpZ2F0aW9uVGFyZ2V0KSB7XG5cdFx0XHRwcmVzc1Byb3BlcnR5ID1cblx0XHRcdFx0XCIuaGFuZGxlcnMub25DaGV2cm9uUHJlc3NOYXZpZ2F0ZU91dEJvdW5kKCAkY29udHJvbGxlciAsJ1wiICsgbmF2aWdhdGlvblRhcmdldCArIFwiJywgJHskcGFyYW1ldGVycz5iaW5kaW5nQ29udGV4dH0pXCI7XG5cdFx0fSBlbHNlIGlmICh0YXJnZXRFbnRpdHlUeXBlKSB7XG5cdFx0XHRjb25zdCB0YXJnZXRFbnRpdHlTZXQgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldCgpO1xuXHRcdFx0bmF2aWdhdGlvblRhcmdldCA9IG5hdmlnYXRpb25TZXR0aW5ncy5kZXRhaWw/LnJvdXRlO1xuXHRcdFx0aWYgKG5hdmlnYXRpb25UYXJnZXQpIHtcblx0XHRcdFx0Y3JpdGljYWxpdHlQcm9wZXJ0eSA9IGdldEhpZ2hsaWdodFJvd0JpbmRpbmcoXG5cdFx0XHRcdFx0bGluZUl0ZW1Bbm5vdGF0aW9uLmFubm90YXRpb25zPy5VST8uQ3JpdGljYWxpdHksXG5cdFx0XHRcdFx0ISF0YXJnZXRFbnRpdHlTZXQ/LmFubm90YXRpb25zPy5Db21tb24/LkRyYWZ0Um9vdCB8fCAhIXRhcmdldEVudGl0eVNldD8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uRHJhZnROb2RlLFxuXHRcdFx0XHRcdHRhcmdldEVudGl0eVR5cGVcblx0XHRcdFx0KTtcblx0XHRcdFx0cHJlc3NQcm9wZXJ0eSA9XG5cdFx0XHRcdFx0XCJBUEkub25UYWJsZVJvd1ByZXNzKCRldmVudCwgJGNvbnRyb2xsZXIsICR7JHBhcmFtZXRlcnM+YmluZGluZ0NvbnRleHR9LCB7IGNhbGxFeHRlbnNpb246IHRydWUsIHRhcmdldFBhdGg6ICdcIiArXG5cdFx0XHRcdFx0dGFyZ2V0UGF0aCArXG5cdFx0XHRcdFx0XCInLCBlZGl0YWJsZSA6IFwiICtcblx0XHRcdFx0XHQodGFyZ2V0RW50aXR5U2V0Py5hbm5vdGF0aW9ucz8uQ29tbW9uPy5EcmFmdFJvb3QgfHwgdGFyZ2V0RW50aXR5U2V0Py5hbm5vdGF0aW9ucz8uQ29tbW9uPy5EcmFmdE5vZGVcblx0XHRcdFx0XHRcdD8gXCIhJHskcGFyYW1ldGVycz5iaW5kaW5nQ29udGV4dH0uZ2V0UHJvcGVydHkoJ0lzQWN0aXZlRW50aXR5JylcIlxuXHRcdFx0XHRcdFx0OiBcInVuZGVmaW5lZFwiKSArXG5cdFx0XHRcdFx0XCJ9KVwiOyAvL05lZWQgdG8gYWNjZXNzIHRvIERyYWZ0Um9vdCBhbmQgRHJhZnROb2RlICEhISEhISFcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNyaXRpY2FsaXR5UHJvcGVydHkgPSBnZXRIaWdobGlnaHRSb3dCaW5kaW5nKGxpbmVJdGVtQW5ub3RhdGlvbi5hbm5vdGF0aW9ucz8uVUk/LkNyaXRpY2FsaXR5LCBmYWxzZSwgdGFyZ2V0RW50aXR5VHlwZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGNvbnN0IHJvd05hdmlnYXRlZEV4cHJlc3Npb246IEV4cHJlc3Npb248Ym9vbGVhbj4gPSBmb3JtYXRSZXN1bHQoXG5cdFx0W2JpbmRpbmdFeHByZXNzaW9uKFwiL2RlZXBlc3RQYXRoXCIsIFwiaW50ZXJuYWxcIildLFxuXHRcdHRhYmxlRm9ybWF0dGVycy5uYXZpZ2F0ZWRSb3csXG5cdFx0dGFyZ2V0RW50aXR5VHlwZVxuXHQpO1xuXHRyZXR1cm4ge1xuXHRcdHByZXNzOiBwcmVzc1Byb3BlcnR5LFxuXHRcdGFjdGlvbjogcHJlc3NQcm9wZXJ0eSA/IFwiTmF2aWdhdGlvblwiIDogdW5kZWZpbmVkLFxuXHRcdHJvd0hpZ2hsaWdodGluZzogY29tcGlsZUJpbmRpbmcoY3JpdGljYWxpdHlQcm9wZXJ0eSksXG5cdFx0cm93TmF2aWdhdGVkOiBjb21waWxlQmluZGluZyhyb3dOYXZpZ2F0ZWRFeHByZXNzaW9uKVxuXHR9O1xufTtcblxuLyoqXG4gKiBSZXRyaWV2ZSB0aGUgY29sdW1ucyBmcm9tIHRoZSBlbnRpdHlUeXBlLlxuICpcbiAqIEBwYXJhbSBjb2x1bW5zVG9CZUNyZWF0ZWQgVGhlIGNvbHVtbnMgdG8gYmUgY3JlYXRlZC5cbiAqIEBwYXJhbSBlbnRpdHlUeXBlIFRoZSB0YXJnZXQgZW50aXR5IHR5cGUuXG4gKiBAcGFyYW0gYW5ub3RhdGlvbkNvbHVtbnMgVGhlIGFycmF5IG9mIGNvbHVtbnMgY3JlYXRlZCBiYXNlZCBvbiBMaW5lSXRlbSBhbm5vdGF0aW9ucy5cbiAqIEBwYXJhbSBub25Tb3J0YWJsZUNvbHVtbnMgVGhlIGFycmF5IG9mIGFsbCBub24gc29ydGFibGUgY29sdW1uIG5hbWVzLlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGNvbnZlcnRlciBjb250ZXh0LlxuICogQHBhcmFtIHRhYmxlVHlwZSBUaGUgdGFibGUgdHlwZS5cbiAqIEByZXR1cm5zIHtBbm5vdGF0aW9uVGFibGVDb2x1bW5bXX0gVGhlIGNvbHVtbiBmcm9tIHRoZSBlbnRpdHlUeXBlXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRDb2x1bW5zRnJvbUVudGl0eVR5cGUgPSBmdW5jdGlvbihcblx0Y29sdW1uc1RvQmVDcmVhdGVkOiBSZWNvcmQ8c3RyaW5nLCBQcm9wZXJ0eT4sXG5cdGVudGl0eVR5cGU6IEVudGl0eVR5cGUsXG5cdGFubm90YXRpb25Db2x1bW5zOiBBbm5vdGF0aW9uVGFibGVDb2x1bW5bXSA9IFtdLFxuXHRub25Tb3J0YWJsZUNvbHVtbnM6IHN0cmluZ1tdLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHR0YWJsZVR5cGU6IFRhYmxlVHlwZVxuKTogQW5ub3RhdGlvblRhYmxlQ29sdW1uW10ge1xuXHRjb25zdCB0YWJsZUNvbHVtbnM6IEFubm90YXRpb25UYWJsZUNvbHVtbltdID0gW107XG5cdC8vIENhdGNoIGFscmVhZHkgZXhpc3RpbmcgY29sdW1ucyAtIHdoaWNoIHdlcmUgYWRkZWQgYmVmb3JlIGJ5IExpbmVJdGVtIEFubm90YXRpb25zXG5cdGNvbnN0IGFnZ3JlZ2F0aW9uSGVscGVyID0gbmV3IEFnZ3JlZ2F0aW9uSGVscGVyKGVudGl0eVR5cGUsIGNvbnZlcnRlckNvbnRleHQpO1xuXG5cdGVudGl0eVR5cGUuZW50aXR5UHJvcGVydGllcy5mb3JFYWNoKChwcm9wZXJ0eTogUHJvcGVydHkpID0+IHtcblx0XHQvLyBDYXRjaCBhbHJlYWR5IGV4aXN0aW5nIGNvbHVtbnMgLSB3aGljaCB3ZXJlIGFkZGVkIGJlZm9yZSBieSBMaW5lSXRlbSBBbm5vdGF0aW9uc1xuXHRcdGNvbnN0IGV4aXN0cyA9IGFubm90YXRpb25Db2x1bW5zLnNvbWUoY29sdW1uID0+IHtcblx0XHRcdHJldHVybiBjb2x1bW4ubmFtZSA9PT0gcHJvcGVydHkubmFtZTtcblx0XHR9KTtcblxuXHRcdC8vIGlmIHRhcmdldCB0eXBlIGV4aXN0cywgaXQgaXMgYSBjb21wbGV4IHByb3BlcnR5IGFuZCBzaG91bGQgYmUgaWdub3JlZFxuXHRcdGlmICghcHJvcGVydHkudGFyZ2V0VHlwZSAmJiAhZXhpc3RzKSB7XG5cdFx0XHRjb25zdCByZWxhdGVkUHJvcGVydGllc0luZm86IENvbXBsZXhQcm9wZXJ0eUluZm8gPSBjb2xsZWN0UmVsYXRlZFByb3BlcnRpZXMoXG5cdFx0XHRcdHByb3BlcnR5Lm5hbWUsXG5cdFx0XHRcdHByb3BlcnR5LFxuXHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdFx0XHR0cnVlLFxuXHRcdFx0XHR0YWJsZVR5cGVcblx0XHRcdCk7XG5cdFx0XHRjb25zdCByZWxhdGVkUHJvcGVydHlOYW1lczogc3RyaW5nW10gPSBPYmplY3Qua2V5cyhyZWxhdGVkUHJvcGVydGllc0luZm8ucHJvcGVydGllcyk7XG5cdFx0XHRjb25zdCBhZGRpdGlvbmFsUHJvcGVydHlOYW1lczogc3RyaW5nW10gPSBPYmplY3Qua2V5cyhyZWxhdGVkUHJvcGVydGllc0luZm8uYWRkaXRpb25hbFByb3BlcnRpZXMpO1xuXHRcdFx0Y29uc3QgY29sdW1uSW5mbyA9IGdldENvbHVtbkRlZmluaXRpb25Gcm9tUHJvcGVydHkoXG5cdFx0XHRcdHByb3BlcnR5LFxuXHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgocHJvcGVydHkuZnVsbHlRdWFsaWZpZWROYW1lKSxcblx0XHRcdFx0cHJvcGVydHkubmFtZSxcblx0XHRcdFx0dHJ1ZSxcblx0XHRcdFx0dHJ1ZSxcblx0XHRcdFx0bm9uU29ydGFibGVDb2x1bW5zLFxuXHRcdFx0XHRhZ2dyZWdhdGlvbkhlbHBlcixcblx0XHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0KTtcblx0XHRcdGNvbnN0IHNlbWFudGljS2V5cyA9IGNvbnZlcnRlckNvbnRleHQuZ2V0QW5ub3RhdGlvbnNCeVRlcm0oXCJDb21tb25cIiwgXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuU2VtYW50aWNLZXlcIiwgW1xuXHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGUoKVxuXHRcdFx0XSlbMF07XG5cdFx0XHRjb25zdCBvQ29sdW1uRHJhZnRJbmRpY2F0b3IgPSBnZXREZWZhdWx0RHJhZnRJbmRpY2F0b3JGb3JDb2x1bW4oY29sdW1uSW5mby5uYW1lLCBzZW1hbnRpY0tleXMpO1xuXHRcdFx0aWYgKE9iamVjdC5rZXlzKG9Db2x1bW5EcmFmdEluZGljYXRvcikubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRjb2x1bW5JbmZvLmZvcm1hdE9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0Li4ub0NvbHVtbkRyYWZ0SW5kaWNhdG9yXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRpZiAocmVsYXRlZFByb3BlcnR5TmFtZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRjb2x1bW5JbmZvLnByb3BlcnR5SW5mb3MgPSByZWxhdGVkUHJvcGVydHlOYW1lcztcblx0XHRcdFx0Y29sdW1uSW5mby5leHBvcnRTZXR0aW5ncyA9IHtcblx0XHRcdFx0XHQuLi5jb2x1bW5JbmZvLmV4cG9ydFNldHRpbmdzLFxuXHRcdFx0XHRcdHRlbXBsYXRlOiByZWxhdGVkUHJvcGVydGllc0luZm8uZXhwb3J0U2V0dGluZ3NUZW1wbGF0ZSxcblx0XHRcdFx0XHR3cmFwOiByZWxhdGVkUHJvcGVydGllc0luZm8uZXhwb3J0U2V0dGluZ3NXcmFwcGluZ1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdC8vIENvbGxlY3QgaW5mb3JtYXRpb24gb2YgcmVsYXRlZCBjb2x1bW5zIHRvIGJlIGNyZWF0ZWQuXG5cdFx0XHRcdHJlbGF0ZWRQcm9wZXJ0eU5hbWVzLmZvckVhY2gobmFtZSA9PiB7XG5cdFx0XHRcdFx0Y29sdW1uc1RvQmVDcmVhdGVkW25hbWVdID0gcmVsYXRlZFByb3BlcnRpZXNJbmZvLnByb3BlcnRpZXNbbmFtZV07XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoYWRkaXRpb25hbFByb3BlcnR5TmFtZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRjb2x1bW5JbmZvLmFkZGl0aW9uYWxQcm9wZXJ0eUluZm9zID0gYWRkaXRpb25hbFByb3BlcnR5TmFtZXM7XG5cdFx0XHRcdC8vIENyZWF0ZSBjb2x1bW5zIGZvciBhZGRpdGlvbmFsIHByb3BlcnRpZXMgaWRlbnRpZmllZCBmb3IgQUxQIHVzZSBjYXNlLlxuXHRcdFx0XHRhZGRpdGlvbmFsUHJvcGVydHlOYW1lcy5mb3JFYWNoKG5hbWUgPT4ge1xuXHRcdFx0XHRcdC8vIEludGVudGlvbmFsIG92ZXJ3cml0ZSBhcyB3ZSByZXF1aXJlIG9ubHkgb25lIG5ldyBQcm9wZXJ0eUluZm8gZm9yIGEgcmVsYXRlZCBQcm9wZXJ0eS5cblx0XHRcdFx0XHRjb2x1bW5zVG9CZUNyZWF0ZWRbbmFtZV0gPSByZWxhdGVkUHJvcGVydGllc0luZm8uYWRkaXRpb25hbFByb3BlcnRpZXNbbmFtZV07XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0dGFibGVDb2x1bW5zLnB1c2goY29sdW1uSW5mbyk7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIHRhYmxlQ29sdW1ucztcbn07XG5cbi8qKlxuICogQ3JlYXRlIGEgY29sdW1uIGRlZmluaXRpb24gZnJvbSBhIHByb3BlcnR5LlxuICogQHBhcmFtIHtQcm9wZXJ0eX0gcHJvcGVydHkgRW50aXR5IHR5cGUgcHJvcGVydHkgZm9yIHdoaWNoIHRoZSBjb2x1bW4gaXMgY3JlYXRlZFxuICogQHBhcmFtIHtzdHJpbmd9IGZ1bGxQcm9wZXJ0eVBhdGggVGhlIGZ1bGwgcGF0aCB0byB0aGUgdGFyZ2V0IHByb3BlcnR5XG4gKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVQYXRoIFRoZSByZWxhdGl2ZSBwYXRoIHRvIHRoZSB0YXJnZXQgcHJvcGVydHkgYmFzZWQgb24gdGhlIGNvbnRleHRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gdXNlRGF0YUZpZWxkUHJlZml4IFNob3VsZCBiZSBwcmVmaXhlZCB3aXRoIFwiRGF0YUZpZWxkOjpcIiwgZWxzZSBpdCB3aWxsIGJlIHByZWZpeGVkIHdpdGggXCJQcm9wZXJ0eTo6XCJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYXZhaWxhYmxlRm9yQWRhcHRhdGlvbiBEZWNpZGVzIHdoZXRoZXIgY29sdW1uIHNob3VsZCBiZSBhdmFpbGFibGUgZm9yIGFkYXB0YXRpb25cbiAqIEBwYXJhbSB7c3RyaW5nW119IG5vblNvcnRhYmxlQ29sdW1ucyBUaGUgYXJyYXkgb2YgYWxsIG5vbiBzb3J0YWJsZSBjb2x1bW4gbmFtZXNcbiAqIEBwYXJhbSB7QWdncmVnYXRpb25IZWxwZXJ9IGFnZ3JlZ2F0aW9uSGVscGVyIFRoZSBhZ2dyZWdhdGlvbkhlbHBlciBmb3IgdGhlIGVudGl0eVxuICogQHBhcmFtIHtDb252ZXJ0ZXJDb250ZXh0fSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHJldHVybnMge0Fubm90YXRpb25UYWJsZUNvbHVtbn0gVGhlIGFubm90YXRpb24gY29sdW1uIGRlZmluaXRpb25cbiAqL1xuY29uc3QgZ2V0Q29sdW1uRGVmaW5pdGlvbkZyb21Qcm9wZXJ0eSA9IGZ1bmN0aW9uKFxuXHRwcm9wZXJ0eTogUHJvcGVydHksXG5cdGZ1bGxQcm9wZXJ0eVBhdGg6IHN0cmluZyxcblx0cmVsYXRpdmVQYXRoOiBzdHJpbmcsXG5cdHVzZURhdGFGaWVsZFByZWZpeDogYm9vbGVhbixcblx0YXZhaWxhYmxlRm9yQWRhcHRhdGlvbjogYm9vbGVhbixcblx0bm9uU29ydGFibGVDb2x1bW5zOiBzdHJpbmdbXSxcblx0YWdncmVnYXRpb25IZWxwZXI6IEFnZ3JlZ2F0aW9uSGVscGVyLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBBbm5vdGF0aW9uVGFibGVDb2x1bW4ge1xuXHRjb25zdCBuYW1lID0gdXNlRGF0YUZpZWxkUHJlZml4ID8gcmVsYXRpdmVQYXRoIDogXCJQcm9wZXJ0eTo6XCIgKyByZWxhdGl2ZVBhdGg7XG5cdGNvbnN0IGtleSA9ICh1c2VEYXRhRmllbGRQcmVmaXggPyBcIkRhdGFGaWVsZDo6XCIgOiBcIlByb3BlcnR5OjpcIikgKyByZXBsYWNlU3BlY2lhbENoYXJzKHJlbGF0aXZlUGF0aCk7XG5cdGNvbnN0IHNlbWFudGljT2JqZWN0QW5ub3RhdGlvblBhdGggPSBnZXRTZW1hbnRpY09iamVjdFBhdGgoY29udmVydGVyQ29udGV4dCwgcHJvcGVydHkpO1xuXHRjb25zdCBpc0hpZGRlbiA9IHByb3BlcnR5LmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgPT09IHRydWU7XG5cdGNvbnN0IGdyb3VwUGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkID0gcHJvcGVydHkubmFtZSA/IF9zbGljZUF0U2xhc2gocHJvcGVydHkubmFtZSwgdHJ1ZSwgZmFsc2UpIDogdW5kZWZpbmVkO1xuXHRjb25zdCBpc0dyb3VwOiBib29sZWFuID0gZ3JvdXBQYXRoICE9IHByb3BlcnR5Lm5hbWU7XG5cdGNvbnN0IGlzRGF0YVBvaW50RmFrZVByb3BlcnR5OiBib29sZWFuID0gbmFtZS5pbmRleE9mKFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFQb2ludFwiKSA+IC0xO1xuXHRjb25zdCBleHBvcnRUeXBlOiBzdHJpbmcgPSBfZ2V0RXhwb3J0RGF0YVR5cGUocHJvcGVydHkudHlwZSk7XG5cdGNvbnN0IHNEYXRlSW5wdXRGb3JtYXQ6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHByb3BlcnR5LnR5cGUgPT09IFwiRWRtLkRhdGVcIiA/IFwiWVlZWS1NTS1ERFwiIDogdW5kZWZpbmVkO1xuXHRjb25zdCBkYXRhVHlwZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gZ2V0RGF0YUZpZWxkRGF0YVR5cGUocHJvcGVydHkpO1xuXHRjb25zdCBwcm9wZXJ0eVR5cGVDb25maWcgPSAhaXNEYXRhUG9pbnRGYWtlUHJvcGVydHkgPyBnZXRUeXBlQ29uZmlnKHByb3BlcnR5LCBkYXRhVHlwZSkgOiB1bmRlZmluZWQ7XG5cdGNvbnN0IG9UeXBlQ29uZmlnID0gIWlzRGF0YVBvaW50RmFrZVByb3BlcnR5XG5cdFx0PyB7XG5cdFx0XHRcdGNsYXNzTmFtZTogcHJvcGVydHkudHlwZSB8fCBkYXRhVHlwZSxcblx0XHRcdFx0b0Zvcm1hdE9wdGlvbnM6IHByb3BlcnR5VHlwZUNvbmZpZy5mb3JtYXRPcHRpb25zLFxuXHRcdFx0XHRvQ29uc3RyYWludHM6IHByb3BlcnR5VHlwZUNvbmZpZy5jb25zdHJhaW50c1xuXHRcdCAgfVxuXHRcdDogdW5kZWZpbmVkO1xuXHRjb25zdCBleHBvcnRTZXR0aW5ncyA9IGlzRGF0YVBvaW50RmFrZVByb3BlcnR5XG5cdFx0PyB7XG5cdFx0XHRcdHRlbXBsYXRlOiBnZXRUYXJnZXRWYWx1ZU9uRGF0YVBvaW50KHByb3BlcnR5KVxuXHRcdCAgfVxuXHRcdDoge1xuXHRcdFx0XHR0eXBlOiBleHBvcnRUeXBlLFxuXHRcdFx0XHRpbnB1dEZvcm1hdDogc0RhdGVJbnB1dEZvcm1hdCxcblx0XHRcdFx0c2NhbGU6IHByb3BlcnR5LnNjYWxlLFxuXHRcdFx0XHRkZWxpbWl0ZXI6IHByb3BlcnR5LnR5cGUgPT09IFwiRWRtLkludDY0XCIgPyB0cnVlIDogZmFsc2UsXG5cdFx0XHRcdHRydWVWYWx1ZTogcHJvcGVydHkudHlwZSA9PT0gXCJFZG0uQm9vbGVhblwiID8gXCJZZXNcIiA6IHVuZGVmaW5lZCxcblx0XHRcdFx0ZmFsc2VWYWx1ZTogcHJvcGVydHkudHlwZSA9PT0gXCJFZG0uQm9vbGVhblwiID8gXCJOb1wiIDogdW5kZWZpbmVkXG5cdFx0ICB9O1xuXHRyZXR1cm4ge1xuXHRcdGtleToga2V5LFxuXHRcdGlzR3JvdXBhYmxlOiAhaXNEYXRhUG9pbnRGYWtlUHJvcGVydHkgJiYgIWlzSGlkZGVuID8gYWdncmVnYXRpb25IZWxwZXIuaXNQcm9wZXJ0eUdyb3VwYWJsZShwcm9wZXJ0eSkgOiBmYWxzZSxcblx0XHR0eXBlOiBDb2x1bW5UeXBlLkFubm90YXRpb24sXG5cdFx0bGFiZWw6IF9nZXRMYWJlbChwcm9wZXJ0eSwgaXNHcm91cCksXG5cdFx0Z3JvdXBMYWJlbDogaXNHcm91cCA/IF9nZXRMYWJlbChwcm9wZXJ0eSkgOiBudWxsLFxuXHRcdGdyb3VwOiBpc0dyb3VwID8gZ3JvdXBQYXRoIDogbnVsbCxcblx0XHRhbm5vdGF0aW9uUGF0aDogZnVsbFByb3BlcnR5UGF0aCxcblx0XHRzZW1hbnRpY09iamVjdFBhdGg6IHNlbWFudGljT2JqZWN0QW5ub3RhdGlvblBhdGgsXG5cdFx0Ly8gQSBmYWtlIHByb3BlcnR5IHdhcyBjcmVhdGVkIGZvciB0aGUgVGFyZ2V0VmFsdWUgdXNlZCBvbiBEYXRhUG9pbnRzLCB0aGlzIHByb3BlcnR5IHNob3VsZCBiZSBoaWRkZW4gYW5kIG5vbiBzb3J0YWJsZVxuXHRcdGF2YWlsYWJpbGl0eTpcblx0XHRcdCFhdmFpbGFibGVGb3JBZGFwdGF0aW9uIHx8IGlzSGlkZGVuIHx8IGlzRGF0YVBvaW50RmFrZVByb3BlcnR5ID8gQXZhaWxhYmlsaXR5VHlwZS5IaWRkZW4gOiBBdmFpbGFiaWxpdHlUeXBlLkFkYXB0YXRpb24sXG5cdFx0bmFtZTogbmFtZSxcblx0XHRyZWxhdGl2ZVBhdGg6IGlzRGF0YVBvaW50RmFrZVByb3BlcnR5XG5cdFx0XHQ/IChwcm9wZXJ0eSBhcyBhbnkpLmFubm90YXRpb25zPy5VST8uRGF0YUZpZWxkRGVmYXVsdD8uVGFyZ2V0Py4kdGFyZ2V0Py5WYWx1ZT8ucGF0aCB8fCAocHJvcGVydHkgYXMgYW55KS5WYWx1ZS5wYXRoXG5cdFx0XHQ6IHJlbGF0aXZlUGF0aCxcblx0XHRzb3J0YWJsZTogIWlzSGlkZGVuICYmIG5vblNvcnRhYmxlQ29sdW1ucy5pbmRleE9mKHJlbGF0aXZlUGF0aCkgPT09IC0xICYmICFpc0RhdGFQb2ludEZha2VQcm9wZXJ0eSxcblx0XHRpc0tleTogcHJvcGVydHkuaXNLZXksXG5cdFx0aXNEYXRhUG9pbnRGYWtlVGFyZ2V0UHJvcGVydHk6IGlzRGF0YVBvaW50RmFrZVByb3BlcnR5LFxuXHRcdGV4cG9ydFNldHRpbmdzOiBleHBvcnRTZXR0aW5ncyxcblx0XHRjYXNlU2Vuc2l0aXZlOiBpc0ZpbHRlcmluZ0Nhc2VTZW5zaXRpdmUoY29udmVydGVyQ29udGV4dCksXG5cdFx0dHlwZUNvbmZpZzogb1R5cGVDb25maWcsXG5cdFx0dmlzdWFsU2V0dGluZ3M6IGlzRGF0YVBvaW50RmFrZVByb3BlcnR5ID8geyB3aWR0aENhbGN1bGF0aW9uOiBudWxsIH0gOiB1bmRlZmluZWRcblx0fSBhcyBBbm5vdGF0aW9uVGFibGVDb2x1bW47XG59O1xuXG4vKipcbiAqIFJldHVybnMgQm9vbGVhbiB0cnVlIGZvciB2YWxpZCBjb2x1bW5zLCBmYWxzZSBmb3IgaW52YWxpZCBjb2x1bW5zLlxuICpcbiAqIEBwYXJhbSB7RGF0YUZpZWxkQWJzdHJhY3RUeXBlc30gZGF0YUZpZWxkIERpZmZlcmVudCBEYXRhRmllbGQgdHlwZXMgZGVmaW5lZCBpbiB0aGUgYW5ub3RhdGlvbnNcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGZvciB2YWxpZCBjb2x1bW5zLCBmYWxzZSBmb3IgaW52YWxpZCBjb2x1bW5zXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBfaXNWYWxpZENvbHVtbiA9IGZ1bmN0aW9uKGRhdGFGaWVsZDogRGF0YUZpZWxkQWJzdHJhY3RUeXBlcykge1xuXHRzd2l0Y2ggKGRhdGFGaWVsZC4kVHlwZSkge1xuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQWN0aW9uOlxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uOlxuXHRcdFx0cmV0dXJuICEhZGF0YUZpZWxkLklubGluZTtcblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhBY3Rpb246XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoSW50ZW50QmFzZWROYXZpZ2F0aW9uOlxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkOlxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aFVybDpcblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckFubm90YXRpb246XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoTmF2aWdhdGlvblBhdGg6XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRkZWZhdWx0OlxuXHRcdC8vIFRvZG86IFJlcGxhY2Ugd2l0aCBwcm9wZXIgTG9nIHN0YXRlbWVudCBvbmNlIGF2YWlsYWJsZVxuXHRcdC8vICB0aHJvdyBuZXcgRXJyb3IoXCJVbmhhbmRsZWQgRGF0YUZpZWxkIEFic3RyYWN0IHR5cGU6IFwiICsgZGF0YUZpZWxkLiRUeXBlKTtcblx0fVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIGxhYmVsIGZvciBwcm9wZXJ0eSBhbmQgZGF0YUZpZWxkLlxuICogQHBhcmFtIHtEYXRhRmllbGRBYnN0cmFjdFR5cGVzIHwgUHJvcGVydHl9IHByb3BlcnR5IEVudGl0eSB0eXBlIHByb3BlcnR5IG9yIERhdGFGaWVsZCBkZWZpbmVkIGluIHRoZSBhbm5vdGF0aW9uc1xuICogQHBhcmFtIGlzR3JvdXBcbiAqIEByZXR1cm5zIHtzdHJpbmd9IExhYmVsIG9mIHRoZSBwcm9wZXJ0eSBvciBEYXRhRmllbGRcbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IF9nZXRMYWJlbCA9IGZ1bmN0aW9uKHByb3BlcnR5OiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzIHwgUHJvcGVydHksIGlzR3JvdXA6IGJvb2xlYW4gPSBmYWxzZSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdGlmICghcHJvcGVydHkpIHtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cdGlmIChpc1Byb3BlcnR5KHByb3BlcnR5KSkge1xuXHRcdGNvbnN0IGRhdGFGaWVsZERlZmF1bHQgPSBwcm9wZXJ0eS5hbm5vdGF0aW9ucz8uVUk/LkRhdGFGaWVsZERlZmF1bHQ7XG5cdFx0aWYgKGRhdGFGaWVsZERlZmF1bHQgJiYgIWRhdGFGaWVsZERlZmF1bHQucXVhbGlmaWVyICYmIGRhdGFGaWVsZERlZmF1bHQuTGFiZWw/LnZhbHVlT2YoKSkge1xuXHRcdFx0cmV0dXJuIGNvbXBpbGVCaW5kaW5nKGFubm90YXRpb25FeHByZXNzaW9uKGRhdGFGaWVsZERlZmF1bHQuTGFiZWw/LnZhbHVlT2YoKSkpO1xuXHRcdH1cblx0XHRyZXR1cm4gY29tcGlsZUJpbmRpbmcoYW5ub3RhdGlvbkV4cHJlc3Npb24ocHJvcGVydHkuYW5ub3RhdGlvbnMuQ29tbW9uPy5MYWJlbD8udmFsdWVPZigpIHx8IHByb3BlcnR5Lm5hbWUpKTtcblx0fSBlbHNlIGlmIChpc0RhdGFGaWVsZFR5cGVzKHByb3BlcnR5KSkge1xuXHRcdGlmICghIWlzR3JvdXAgJiYgcHJvcGVydHkuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhJbnRlbnRCYXNlZE5hdmlnYXRpb24pIHtcblx0XHRcdHJldHVybiBjb21waWxlQmluZGluZyhhbm5vdGF0aW9uRXhwcmVzc2lvbihwcm9wZXJ0eS5MYWJlbD8udmFsdWVPZigpKSk7XG5cdFx0fVxuXHRcdHJldHVybiBjb21waWxlQmluZGluZyhcblx0XHRcdGFubm90YXRpb25FeHByZXNzaW9uKFxuXHRcdFx0XHRwcm9wZXJ0eS5MYWJlbD8udmFsdWVPZigpIHx8IHByb3BlcnR5LlZhbHVlPy4kdGFyZ2V0Py5hbm5vdGF0aW9ucz8uQ29tbW9uPy5MYWJlbD8udmFsdWVPZigpIHx8IHByb3BlcnR5LlZhbHVlPy4kdGFyZ2V0Py5uYW1lXG5cdFx0XHQpXG5cdFx0KTtcblx0fSBlbHNlIGlmIChwcm9wZXJ0eS4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQW5ub3RhdGlvbikge1xuXHRcdHJldHVybiBjb21waWxlQmluZGluZyhcblx0XHRcdGFubm90YXRpb25FeHByZXNzaW9uKFxuXHRcdFx0XHRwcm9wZXJ0eS5MYWJlbD8udmFsdWVPZigpIHx8IChwcm9wZXJ0eS5UYXJnZXQ/LiR0YXJnZXQgYXMgRGF0YVBvaW50KT8uVmFsdWU/LiR0YXJnZXQ/LmFubm90YXRpb25zPy5Db21tb24/LkxhYmVsPy52YWx1ZU9mKClcblx0XHRcdClcblx0XHQpO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBjb21waWxlQmluZGluZyhhbm5vdGF0aW9uRXhwcmVzc2lvbihwcm9wZXJ0eS5MYWJlbD8udmFsdWVPZigpKSk7XG5cdH1cbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIFByb3BlcnR5SW5mbyBmb3IgZWFjaCBpZGVudGlmaWVkIHByb3BlcnR5IGNvbnN1bWVkIGJ5IGEgTGluZUl0ZW0uXG4gKlxuICogQHBhcmFtIHtSZWNvcmQ8c3RyaW5nLCBQcm9wZXJ0eT59IGNvbHVtbnNUb0JlQ3JlYXRlZCBJZGVudGlmaWVkIHByb3BlcnRpZXMuXG4gKiBAcGFyYW0gZXhpc3RpbmdDb2x1bW5zIFRoZSBsaXN0IG9mIGNvbHVtbnMgY3JlYXRlZCBmb3IgTGluZUl0ZW1zIGFuZCBQcm9wZXJ0aWVzIG9mIGVudGl0eVR5cGUuXG4gKiBAcGFyYW0gbm9uU29ydGFibGVDb2x1bW5zIFRoZSBhcnJheSBvZiBjb2x1bW4gbmFtZXMgd2hpY2ggY2Fubm90IGJlIHNvcnRlZC5cbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dC5cbiAqIEBwYXJhbSBlbnRpdHlUeXBlIFRoZSBlbnRpdHkgdHlwZSBmb3IgdGhlIExpbmVJdGVtXG4gKiBAcmV0dXJucyB7QW5ub3RhdGlvblRhYmxlQ29sdW1uW119IFRoZSBhcnJheSBvZiBjb2x1bW5zIGNyZWF0ZWQuXG4gKi9cbmNvbnN0IF9jcmVhdGVSZWxhdGVkQ29sdW1ucyA9IGZ1bmN0aW9uKFxuXHRjb2x1bW5zVG9CZUNyZWF0ZWQ6IFJlY29yZDxzdHJpbmcsIFByb3BlcnR5Pixcblx0ZXhpc3RpbmdDb2x1bW5zOiBBbm5vdGF0aW9uVGFibGVDb2x1bW5bXSxcblx0bm9uU29ydGFibGVDb2x1bW5zOiBzdHJpbmdbXSxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0ZW50aXR5VHlwZTogRW50aXR5VHlwZVxuKTogQW5ub3RhdGlvblRhYmxlQ29sdW1uW10ge1xuXHRjb25zdCByZWxhdGVkQ29sdW1uczogQW5ub3RhdGlvblRhYmxlQ29sdW1uW10gPSBbXTtcblx0Y29uc3QgcmVsYXRlZFByb3BlcnR5TmFtZU1hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuXHRjb25zdCBhZ2dyZWdhdGlvbkhlbHBlciA9IG5ldyBBZ2dyZWdhdGlvbkhlbHBlcihlbnRpdHlUeXBlLCBjb252ZXJ0ZXJDb250ZXh0KTtcblxuXHRPYmplY3Qua2V5cyhjb2x1bW5zVG9CZUNyZWF0ZWQpLmZvckVhY2gobmFtZSA9PiB7XG5cdFx0Y29uc3QgcHJvcGVydHkgPSBjb2x1bW5zVG9CZUNyZWF0ZWRbbmFtZV0sXG5cdFx0XHRhbm5vdGF0aW9uUGF0aCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0QWJzb2x1dGVBbm5vdGF0aW9uUGF0aChuYW1lKSxcblx0XHRcdC8vIENoZWNrIHdoZXRoZXIgdGhlIHJlbGF0ZWQgY29sdW1uIGFscmVhZHkgZXhpc3RzLlxuXHRcdFx0cmVsYXRlZENvbHVtbiA9IGV4aXN0aW5nQ29sdW1ucy5maW5kKGNvbHVtbiA9PiBjb2x1bW4ubmFtZSA9PT0gbmFtZSk7XG5cdFx0aWYgKHJlbGF0ZWRDb2x1bW4gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Ly8gQ2FzZSAxOiBLZXkgY29udGFpbnMgRGF0YUZpZWxkIHByZWZpeCB0byBlbnN1cmUgYWxsIHByb3BlcnR5IGNvbHVtbnMgaGF2ZSB0aGUgc2FtZSBrZXkgZm9ybWF0LlxuXHRcdFx0Ly8gTmV3IGNyZWF0ZWQgcHJvcGVydHkgY29sdW1uIGlzIHNldCB0byBoaWRkZW4uXG5cdFx0XHRyZWxhdGVkQ29sdW1ucy5wdXNoKFxuXHRcdFx0XHRnZXRDb2x1bW5EZWZpbml0aW9uRnJvbVByb3BlcnR5KFxuXHRcdFx0XHRcdHByb3BlcnR5LFxuXHRcdFx0XHRcdGFubm90YXRpb25QYXRoLFxuXHRcdFx0XHRcdG5hbWUsXG5cdFx0XHRcdFx0dHJ1ZSxcblx0XHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0XHRub25Tb3J0YWJsZUNvbHVtbnMsXG5cdFx0XHRcdFx0YWdncmVnYXRpb25IZWxwZXIsXG5cdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRyZWxhdGVkQ29sdW1uLmFubm90YXRpb25QYXRoICE9PSBhbm5vdGF0aW9uUGF0aCB8fFxuXHRcdFx0KHJlbGF0ZWRDb2x1bW4ucHJvcGVydHlJbmZvcyAmJiByZWxhdGVkQ29sdW1uLnByb3BlcnR5SW5mb3MuaW5kZXhPZihuYW1lKSAhPT0gLTEpXG5cdFx0KSB7XG5cdFx0XHQvLyBDYXNlIDI6IFRoZSBleGlzdGluZyBjb2x1bW4gcG9pbnRzIHRvIGEgTGluZUl0ZW0gKG9yKVxuXHRcdFx0Ly8gQ2FzZSAzOiBUaGlzIGlzIGEgc2VsZiByZWZlcmVuY2UgZnJvbSBhbiBleGlzdGluZyBjb2x1bW4gYW5kXG5cdFx0XHQvLyBib3RoIGNhc2VzIHJlcXVpcmUgYSBkdW1teSBQcm9wZXJ0eUluZm8gZm9yIHNldHRpbmcgY29ycmVjdCBleHBvcnQgc2V0dGluZ3MuXG5cblx0XHRcdGNvbnN0IG5ld05hbWUgPSBcIlByb3BlcnR5OjpcIiArIG5hbWU7XG5cblx0XHRcdC8vIENoZWNraW5nIHdoZXRoZXIgdGhlIHJlbGF0ZWQgcHJvcGVydHkgY29sdW1uIGhhcyBhbHJlYWR5IGJlZW4gY3JlYXRlZCBpbiBhIHByZXZpb3VzIGl0ZXJhdGlvbi5cblx0XHRcdGlmICghZXhpc3RpbmdDb2x1bW5zLnNvbWUoY29sdW1uID0+IGNvbHVtbi5uYW1lID09PSBuZXdOYW1lKSkge1xuXHRcdFx0XHQvLyBDcmVhdGUgYSBuZXcgcHJvcGVydHkgY29sdW1uIHdpdGggJ1Byb3BlcnR5OjonIHByZWZpeCxcblx0XHRcdFx0Ly8gU2V0IGl0IHRvIGhpZGRlbiBhcyBpdCBpcyBvbmx5IGNvbnN1bWVkIGJ5IENvbXBsZXggcHJvcGVydHkgaW5mb3MuXG5cdFx0XHRcdHJlbGF0ZWRDb2x1bW5zLnB1c2goXG5cdFx0XHRcdFx0Z2V0Q29sdW1uRGVmaW5pdGlvbkZyb21Qcm9wZXJ0eShcblx0XHRcdFx0XHRcdHByb3BlcnR5LFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvblBhdGgsXG5cdFx0XHRcdFx0XHRuYW1lLFxuXHRcdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0XHRcdG5vblNvcnRhYmxlQ29sdW1ucyxcblx0XHRcdFx0XHRcdGFnZ3JlZ2F0aW9uSGVscGVyLFxuXHRcdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0XHRcdClcblx0XHRcdFx0KTtcblx0XHRcdFx0cmVsYXRlZFByb3BlcnR5TmFtZU1hcFtuYW1lXSA9IG5ld05hbWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBUaGUgcHJvcGVydHkgJ25hbWUnIGhhcyBiZWVuIHByZWZpeGVkIHdpdGggJ1Byb3BlcnR5OjonIGZvciB1bmlxdWVuZXNzLlxuXHQvLyBVcGRhdGUgdGhlIHNhbWUgaW4gb3RoZXIgcHJvcGVydHlJbmZvc1tdIHJlZmVyZW5jZXMgd2hpY2ggcG9pbnQgdG8gdGhpcyBwcm9wZXJ0eS5cblx0ZXhpc3RpbmdDb2x1bW5zLmZvckVhY2goY29sdW1uID0+IHtcblx0XHRjb2x1bW4ucHJvcGVydHlJbmZvcyA9IGNvbHVtbi5wcm9wZXJ0eUluZm9zPy5tYXAocHJvcGVydHlJbmZvID0+IHJlbGF0ZWRQcm9wZXJ0eU5hbWVNYXBbcHJvcGVydHlJbmZvXSA/PyBwcm9wZXJ0eUluZm8pO1xuXHRcdGNvbHVtbi5hZGRpdGlvbmFsUHJvcGVydHlJbmZvcyA9IGNvbHVtbi5hZGRpdGlvbmFsUHJvcGVydHlJbmZvcz8ubWFwKFxuXHRcdFx0cHJvcGVydHlJbmZvID0+IHJlbGF0ZWRQcm9wZXJ0eU5hbWVNYXBbcHJvcGVydHlJbmZvXSA/PyBwcm9wZXJ0eUluZm9cblx0XHQpO1xuXHR9KTtcblxuXHRyZXR1cm4gcmVsYXRlZENvbHVtbnM7XG59O1xuXG4vKipcbiAqIEdldHRpbmcgdGhlIENvbHVtbiBOYW1lXG4gKiBJZiBpdCBwb2ludHMgdG8gYSBEYXRhRmllbGQgd2l0aCBvbmUgcHJvcGVydHkgb3IgRGF0YVBvaW50IHdpdGggb25lIHByb3BlcnR5LCBpdCB3aWxsIHVzZSB0aGUgcHJvcGVydHkgbmFtZVxuICogaGVyZSB0byBiZSBjb25zaXN0ZW50IHdpdGggdGhlIGV4aXN0aW5nIGZsZXggY2hhbmdlcy5cbiAqXG4gKiBAcGFyYW0ge0RhdGFGaWVsZEFic3RyYWN0VHlwZXN9IGRhdGFGaWVsZCBEaWZmZXJlbnQgRGF0YUZpZWxkIHR5cGVzIGRlZmluZWQgaW4gdGhlIGFubm90YXRpb25zXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgbmFtZSBvZiBhbm5vdGF0aW9uIGNvbHVtbnNcbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IF9nZXRBbm5vdGF0aW9uQ29sdW1uTmFtZSA9IGZ1bmN0aW9uKGRhdGFGaWVsZDogRGF0YUZpZWxkQWJzdHJhY3RUeXBlcykge1xuXHQvLyBUaGlzIGlzIG5lZWRlZCBhcyB3ZSBoYXZlIGZsZXhpYmlsaXR5IGNoYW5nZXMgYWxyZWFkeSB0aGF0IHdlIGhhdmUgdG8gY2hlY2sgYWdhaW5zdFxuXHRpZiAoaXNEYXRhRmllbGRUeXBlcyhkYXRhRmllbGQpKSB7XG5cdFx0cmV0dXJuIGRhdGFGaWVsZC5WYWx1ZT8ucGF0aDtcblx0fSBlbHNlIGlmIChkYXRhRmllbGQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckFubm90YXRpb24gJiYgKGRhdGFGaWVsZC5UYXJnZXQ/LiR0YXJnZXQgYXMgRGF0YVBvaW50KT8uVmFsdWU/LnBhdGgpIHtcblx0XHQvLyBUaGlzIGlzIGZvciByZW1vdmluZyBkdXBsaWNhdGUgcHJvcGVydGllcy4gRm9yIGV4YW1wbGUsICdQcm9ncmVzcycgUHJvcGVydHkgaXMgcmVtb3ZlZCBpZiBpdCBpcyBhbHJlYWR5IGRlZmluZWQgYXMgYSBEYXRhUG9pbnRcblx0XHRyZXR1cm4gKGRhdGFGaWVsZC5UYXJnZXQ/LiR0YXJnZXQgYXMgRGF0YVBvaW50KT8uVmFsdWUucGF0aDtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChkYXRhRmllbGQpO1xuXHR9XG59O1xuXG4vKipcbiAqIERldGVybWluZXMgdGhlIHJlbGF0aXZlIHBhdGggb2YgdGhlIHByb3BlcnR5IHdpdGggcmVzcGVjdCB0byB0aGUgcm9vdCBlbnRpdHkuXG4gKiBAcGFyYW0gZGF0YUZpZWxkIFRoZSBgRGF0YUZpZWxkYCBiZWluZyBwcm9jZXNzZWQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgcmVsYXRpdmUgcGF0aFxuICovXG5jb25zdCBfZ2V0UmVsYXRpdmVQYXRoID0gZnVuY3Rpb24oZGF0YUZpZWxkOiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzKTogc3RyaW5nIHtcblx0bGV0IHJlbGF0aXZlUGF0aDogc3RyaW5nID0gXCJcIjtcblxuXHRzd2l0Y2ggKGRhdGFGaWVsZC4kVHlwZSkge1xuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkOlxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aE5hdmlnYXRpb25QYXRoOlxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aFVybDpcblx0XHRcdHJlbGF0aXZlUGF0aCA9IChkYXRhRmllbGQgYXMgRGF0YUZpZWxkKT8uVmFsdWU/LnBhdGg7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQW5ub3RhdGlvbjpcblx0XHRcdHJlbGF0aXZlUGF0aCA9IChkYXRhRmllbGQgYXMgRGF0YUZpZWxkRm9yQW5ub3RhdGlvbik/LlRhcmdldD8udmFsdWU7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQWN0aW9uOlxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uOlxuXHRcdFx0cmVsYXRpdmVQYXRoID0gS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChkYXRhRmllbGQpO1xuXHRcdFx0YnJlYWs7XG5cdH1cblxuXHRyZXR1cm4gcmVsYXRpdmVQYXRoO1xufTtcblxuY29uc3QgX3NsaWNlQXRTbGFzaCA9IGZ1bmN0aW9uKHBhdGg6IHN0cmluZywgaXNMYXN0U2xhc2g6IGJvb2xlYW4sIGlzTGFzdFBhcnQ6IGJvb2xlYW4pIHtcblx0Y29uc3QgaVNsYXNoSW5kZXggPSBpc0xhc3RTbGFzaCA/IHBhdGgubGFzdEluZGV4T2YoXCIvXCIpIDogcGF0aC5pbmRleE9mKFwiL1wiKTtcblxuXHRpZiAoaVNsYXNoSW5kZXggPT09IC0xKSB7XG5cdFx0cmV0dXJuIHBhdGg7XG5cdH1cblx0cmV0dXJuIGlzTGFzdFBhcnQgPyBwYXRoLnN1YnN0cmluZyhpU2xhc2hJbmRleCArIDEsIHBhdGgubGVuZ3RoKSA6IHBhdGguc3Vic3RyaW5nKDAsIGlTbGFzaEluZGV4KTtcbn07XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgYSBjb2x1bW4gaXMgc29ydGFibGUuXG4gKlxuICogQHBhcmFtIGRhdGFGaWVsZCBUaGUgZGF0YSBmaWVsZCBiZWluZyBwcm9jZXNzZWRcbiAqIEBwYXJhbSBwcm9wZXJ0eVBhdGggVGhlIHByb3BlcnR5IHBhdGhcbiAqIEBwYXJhbSBub25Tb3J0YWJsZUNvbHVtbnMgQ29sbGVjdGlvbiBvZiBub24tc29ydGFibGUgY29sdW1uIG5hbWVzIGFzIHBlciBhbm5vdGF0aW9uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgY29sdW1uIGlzIHNvcnRhYmxlXG4gKi9cbmNvbnN0IF9pc0NvbHVtblNvcnRhYmxlID0gZnVuY3Rpb24oZGF0YUZpZWxkOiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzLCBwcm9wZXJ0eVBhdGg6IHN0cmluZywgbm9uU29ydGFibGVDb2x1bW5zOiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xuXHRsZXQgaXNTb3J0YWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuXHRpZiAobm9uU29ydGFibGVDb2x1bW5zLmluZGV4T2YocHJvcGVydHlQYXRoKSA9PT0gLTEpIHtcblx0XHQvLyBDb2x1bW4gaXMgbm90IG1hcmtlZCBhcyBub24tc29ydGFibGUgdmlhIGFubm90YXRpb25cblx0XHRzd2l0Y2ggKGRhdGFGaWVsZC4kVHlwZSkge1xuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGQ6XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhVcmw6XG5cdFx0XHRcdGlzU29ydGFibGUgPSB0cnVlO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb246XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckFjdGlvbjpcblx0XHRcdFx0Ly8gQWN0aW9uIGNvbHVtbnMgYXJlIG5vdCBzb3J0YWJsZVxuXHRcdFx0XHRpc1NvcnRhYmxlID0gZmFsc2U7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gaXNTb3J0YWJsZTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIGZpbHRlcmluZyBvbiB0aGUgdGFibGUgaXMgY2FzZSBzZW5zaXRpdmUuXG4gKlxuICogQHBhcmFtIHtDb252ZXJ0ZXJDb250ZXh0fSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBpbnN0YW5jZSBvZiB0aGUgY29udmVydGVyIGNvbnRleHRcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zICdmYWxzZScgaWYgRmlsdGVyRnVuY3Rpb25zIGFubm90YXRpb24gc3VwcG9ydHMgJ3RvbG93ZXInLCBlbHNlICd0cnVlJ1xuICovXG5leHBvcnQgY29uc3QgaXNGaWx0ZXJpbmdDYXNlU2Vuc2l0aXZlID0gZnVuY3Rpb24oY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IGJvb2xlYW4ge1xuXHRjb25zdCBmaWx0ZXJGdW5jdGlvbnM6IEZpbHRlckZ1bmN0aW9ucyB8IHVuZGVmaW5lZCA9XG5cdFx0Y29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKT8uYW5ub3RhdGlvbnM/LkNhcGFiaWxpdGllcz8uRmlsdGVyRnVuY3Rpb25zIHx8XG5cdFx0Y29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlDb250YWluZXIoKS5hbm5vdGF0aW9ucz8uQ2FwYWJpbGl0aWVzPy5GaWx0ZXJGdW5jdGlvbnM7XG5cdHJldHVybiBBcnJheS5pc0FycmF5KGZpbHRlckZ1bmN0aW9ucykgPyAoZmlsdGVyRnVuY3Rpb25zIGFzIFN0cmluZ1tdKS5pbmRleE9mKFwidG9sb3dlclwiKSA9PT0gLTEgOiB0cnVlO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGRlZmF1bHQgZm9ybWF0IG9wdGlvbnMgZm9yIHRleHQgZmllbGRzIGluIGEgdGFibGUuXG4gKlxuICogQHJldHVybnMge0Zvcm1hdE9wdGlvbnNUeXBlfSBDb2xsZWN0aW9uIG9mIGZvcm1hdCBvcHRpb25zIHdpdGggZGVmYXVsdCB2YWx1ZXNcbiAqL1xuZnVuY3Rpb24gZ2V0RGVmYXVsdEZvcm1hdE9wdGlvbnNGb3JUYWJsZSgpOiBGb3JtYXRPcHRpb25zVHlwZSB7XG5cdHJldHVybiB7XG5cdFx0dGV4dExpbmVzRWRpdDogNFxuXHR9O1xufVxuXG4vKipcbiAqIFJldHVybnMgZGVmYXVsdCBmb3JtYXQgb3B0aW9ucyB3aXRoIGRyYWZ0SW5kaWNhdG9yIGZvciBhIGNvbHVtbi5cbiAqIEBwYXJhbSBuYW1lXG4gKiBAcGFyYW0gc2VtYW50aWNLZXlzXG4gKiBAcmV0dXJucyB7Rm9ybWF0T3B0aW9uc1R5cGV9IENvbGxlY3Rpb24gb2YgZm9ybWF0IG9wdGlvbnMgd2l0aCBkZWZhdWx0IHZhbHVlc1xuICovXG5mdW5jdGlvbiBnZXREZWZhdWx0RHJhZnRJbmRpY2F0b3JGb3JDb2x1bW4obmFtZTogc3RyaW5nLCBzZW1hbnRpY0tleXM6IGFueVtdKSB7XG5cdGxldCBiU2VtYW50aWNLZXlGb3VuZCA9IGZhbHNlO1xuXHRjb25zdCBhU2VtYW50aWNLZXlWYWx1ZXM6IHN0cmluZ1tdID0gW107XG5cdGlmICghc2VtYW50aWNLZXlzKSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgc2VtYW50aWNLZXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0YVNlbWFudGljS2V5VmFsdWVzLnB1c2goc2VtYW50aWNLZXlzW2ldLnZhbHVlKTtcblx0XHRpZiAoc2VtYW50aWNLZXlzW2ldLnZhbHVlID09PSBuYW1lKSB7XG5cdFx0XHRiU2VtYW50aWNLZXlGb3VuZCA9IHRydWU7XG5cdFx0fVxuXHR9XG5cdGlmIChiU2VtYW50aWNLZXlGb3VuZCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRoYXNEcmFmdEluZGljYXRvcjogdHJ1ZSxcblx0XHRcdHNlbWFudGlja2V5czogYVNlbWFudGljS2V5VmFsdWVzXG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4ge307XG5cdH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIGxpbmUgaXRlbXMgZnJvbSBtZXRhZGF0YSBhbm5vdGF0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge0xpbmVJdGVtfSBsaW5lSXRlbUFubm90YXRpb24gQ29sbGVjdGlvbiBvZiBkYXRhIGZpZWxkcyB3aXRoIHRoZWlyIGFubm90YXRpb25zXG4gKiBAcGFyYW0ge3N0cmluZ30gdmlzdWFsaXphdGlvblBhdGggVGhlIHZpc3VhbGl6YXRpb24gcGF0aFxuICogQHBhcmFtIHtDb252ZXJ0ZXJDb250ZXh0fSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHJldHVybnMge1RhYmxlQ29sdW1uW119IFRoZSBjb2x1bW5zIGZyb20gdGhlIGFubm90YXRpb25zXG4gKi9cbmNvbnN0IGdldENvbHVtbnNGcm9tQW5ub3RhdGlvbnMgPSBmdW5jdGlvbihcblx0bGluZUl0ZW1Bbm5vdGF0aW9uOiBMaW5lSXRlbSxcblx0dmlzdWFsaXphdGlvblBhdGg6IHN0cmluZyxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogVGFibGVDb2x1bW5bXSB7XG5cdGNvbnN0IGVudGl0eVR5cGUgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEFubm90YXRpb25FbnRpdHlUeXBlKGxpbmVJdGVtQW5ub3RhdGlvbiksXG5cdFx0YW5ub3RhdGlvbkNvbHVtbnM6IEFubm90YXRpb25UYWJsZUNvbHVtbltdID0gW10sXG5cdFx0Y29sdW1uc1RvQmVDcmVhdGVkOiBSZWNvcmQ8c3RyaW5nLCBQcm9wZXJ0eT4gPSB7fSxcblx0XHRub25Tb3J0YWJsZUNvbHVtbnM6IHN0cmluZ1tdID0gZ2V0Tm9uU29ydGFibGVQcm9wZXJ0aWVzUmVzdHJpY3Rpb25zKGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCkpLFxuXHRcdHRhYmxlTWFuaWZlc3RTZXR0aW5nczogVGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24gPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0Q29udHJvbENvbmZpZ3VyYXRpb24odmlzdWFsaXphdGlvblBhdGgpLFxuXHRcdHRhYmxlVHlwZTogVGFibGVUeXBlID0gdGFibGVNYW5pZmVzdFNldHRpbmdzPy50YWJsZVNldHRpbmdzPy50eXBlIHx8IFwiUmVzcG9uc2l2ZVRhYmxlXCI7XG5cdGNvbnN0IHNlbWFudGljS2V5cyA9IGNvbnZlcnRlckNvbnRleHQuZ2V0QW5ub3RhdGlvbnNCeVRlcm0oXCJDb21tb25cIiwgXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuU2VtYW50aWNLZXlcIiwgW1xuXHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpXG5cdF0pWzBdO1xuXHRpZiAobGluZUl0ZW1Bbm5vdGF0aW9uKSB7XG5cdFx0Ly8gR2V0IGNvbHVtbnMgZnJvbSB0aGUgTGluZUl0ZW0gQW5ub3RhdGlvblxuXHRcdGxpbmVJdGVtQW5ub3RhdGlvbi5mb3JFYWNoKGxpbmVJdGVtID0+IHtcblx0XHRcdGlmICghX2lzVmFsaWRDb2x1bW4obGluZUl0ZW0pKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGNvbnN0IHNlbWFudGljT2JqZWN0QW5ub3RhdGlvblBhdGggPVxuXHRcdFx0XHRpc0RhdGFGaWVsZFR5cGVzKGxpbmVJdGVtKSAmJiBsaW5lSXRlbS5WYWx1ZT8uJHRhcmdldD8uZnVsbHlRdWFsaWZpZWROYW1lXG5cdFx0XHRcdFx0PyBnZXRTZW1hbnRpY09iamVjdFBhdGgoY29udmVydGVyQ29udGV4dCwgbGluZUl0ZW0pXG5cdFx0XHRcdFx0OiB1bmRlZmluZWQ7XG5cdFx0XHRjb25zdCByZWxhdGl2ZVBhdGggPSBfZ2V0UmVsYXRpdmVQYXRoKGxpbmVJdGVtKTtcblx0XHRcdC8vIERldGVybWluZSBwcm9wZXJ0aWVzIHdoaWNoIGFyZSBjb25zdW1lZCBieSB0aGlzIExpbmVJdGVtLlxuXHRcdFx0Y29uc3QgcmVsYXRlZFByb3BlcnRpZXNJbmZvOiBDb21wbGV4UHJvcGVydHlJbmZvID0gY29sbGVjdFJlbGF0ZWRQcm9wZXJ0aWVzUmVjdXJzaXZlbHkobGluZUl0ZW0sIGNvbnZlcnRlckNvbnRleHQsIHRhYmxlVHlwZSk7XG5cdFx0XHRjb25zdCByZWxhdGVkUHJvcGVydHlOYW1lczogc3RyaW5nW10gPSBPYmplY3Qua2V5cyhyZWxhdGVkUHJvcGVydGllc0luZm8ucHJvcGVydGllcyk7XG5cdFx0XHRjb25zdCBhZGRpdGlvbmFsUHJvcGVydHlOYW1lczogc3RyaW5nW10gPSBPYmplY3Qua2V5cyhyZWxhdGVkUHJvcGVydGllc0luZm8uYWRkaXRpb25hbFByb3BlcnRpZXMpO1xuXHRcdFx0Y29uc3QgZ3JvdXBQYXRoOiBzdHJpbmcgPSBfc2xpY2VBdFNsYXNoKHJlbGF0aXZlUGF0aCwgdHJ1ZSwgZmFsc2UpO1xuXHRcdFx0Y29uc3QgaXNHcm91cDogYm9vbGVhbiA9IGdyb3VwUGF0aCAhPSByZWxhdGl2ZVBhdGg7XG5cdFx0XHRjb25zdCBzTGFiZWw6IHN0cmluZyB8IHVuZGVmaW5lZCA9IF9nZXRMYWJlbChsaW5lSXRlbSwgaXNHcm91cCk7XG5cdFx0XHRjb25zdCBuYW1lID0gX2dldEFubm90YXRpb25Db2x1bW5OYW1lKGxpbmVJdGVtKTtcblx0XHRcdGNvbnN0IGRhdGFUeXBlOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBnZXREYXRhRmllbGREYXRhVHlwZShsaW5lSXRlbSk7XG5cdFx0XHRjb25zdCBzRGF0ZUlucHV0Rm9ybWF0OiBzdHJpbmcgfCB1bmRlZmluZWQgPSBkYXRhVHlwZSA9PT0gXCJFZG0uRGF0ZVwiID8gXCJZWVlZLU1NLUREXCIgOiB1bmRlZmluZWQ7XG5cdFx0XHRjb25zdCBmb3JtYXRPcHRpb25zID0ge1xuXHRcdFx0XHQuLi5nZXREZWZhdWx0Rm9ybWF0T3B0aW9uc0ZvclRhYmxlKCksXG5cdFx0XHRcdC4uLmdldERlZmF1bHREcmFmdEluZGljYXRvckZvckNvbHVtbihuYW1lLCBzZW1hbnRpY0tleXMpXG5cdFx0XHR9O1xuXHRcdFx0Y29uc3QgZXhwb3J0U2V0dGluZ3MgPSB7XG5cdFx0XHRcdHRlbXBsYXRlOiByZWxhdGVkUHJvcGVydGllc0luZm8uZXhwb3J0U2V0dGluZ3NUZW1wbGF0ZSxcblx0XHRcdFx0d3JhcDogcmVsYXRlZFByb3BlcnRpZXNJbmZvLmV4cG9ydFNldHRpbmdzV3JhcHBpbmcsXG5cdFx0XHRcdHR5cGU6IGRhdGFUeXBlID8gX2dldEV4cG9ydERhdGFUeXBlKGRhdGFUeXBlLCByZWxhdGVkUHJvcGVydHlOYW1lcy5sZW5ndGggPiAxKSA6IHVuZGVmaW5lZCxcblx0XHRcdFx0aW5wdXRGb3JtYXQ6IHNEYXRlSW5wdXRGb3JtYXQsXG5cdFx0XHRcdGRlbGltaXRlcjogZGF0YVR5cGUgPT09IFwiRWRtLkludDY0XCIgPyB0cnVlIDogZmFsc2UsXG5cdFx0XHRcdHRydWVWYWx1ZTogZGF0YVR5cGUgPT09IFwiRWRtLkJvb2xlYW5cIiA/IFwiWWVzXCIgOiB1bmRlZmluZWQsXG5cdFx0XHRcdGZhbHNlVmFsdWU6IGRhdGFUeXBlID09PSBcIkVkbS5Cb29sZWFuXCIgPyBcIk5vXCIgOiB1bmRlZmluZWRcblx0XHRcdH07XG5cdFx0XHRjb25zdCBwcm9wZXJ0eVR5cGVDb25maWcgPSBkYXRhVHlwZSAmJiBnZXRUeXBlQ29uZmlnKGxpbmVJdGVtLCBkYXRhVHlwZSk7XG5cdFx0XHRjb25zdCBvVHlwZUNvbmZpZyA9IHByb3BlcnR5VHlwZUNvbmZpZ1xuXHRcdFx0XHQ/IHtcblx0XHRcdFx0XHRcdGNsYXNzTmFtZTogZGF0YVR5cGUsXG5cdFx0XHRcdFx0XHRvRm9ybWF0T3B0aW9uczoge1xuXHRcdFx0XHRcdFx0XHQuLi5mb3JtYXRPcHRpb25zLFxuXHRcdFx0XHRcdFx0XHQuLi5wcm9wZXJ0eVR5cGVDb25maWcuZm9ybWF0T3B0aW9uc1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdG9Db25zdHJhaW50czogcHJvcGVydHlUeXBlQ29uZmlnLmNvbnN0cmFpbnRzXG5cdFx0XHRcdCAgfVxuXHRcdFx0XHQ6IHVuZGVmaW5lZDtcblx0XHRcdGxldCB2aXN1YWxTZXR0aW5nczogVmlzdWFsU2V0dGluZ3MgPSB7fTtcblx0XHRcdGlmIChyZWxhdGVkUHJvcGVydGllc0luZm8udmlzdWFsU2V0dGluZ3NUb0JlRXhjbHVkZWQpIHtcblx0XHRcdFx0Ly8gSW4gY2FzZSBvZiB0ZXh0IGFycmFuZ2VtZW50IGFubm90YXRpb24gd2l0aCBkaXNwbGF5IG1vZGUgYXMgdGV4dCBvbmx5LCBleGNsdWRlIHRleHQgcHJvcGVydHkgZnJvbSB0aGUgd2lkdGggY2FsY3VsYXRpb25cblx0XHRcdFx0dmlzdWFsU2V0dGluZ3MgPSB7XG5cdFx0XHRcdFx0d2lkdGhDYWxjdWxhdGlvbjoge1xuXHRcdFx0XHRcdFx0ZXhjbHVkZVByb3BlcnRpZXM6IFwiUHJvcGVydHk6OlwiICsgcmVsYXRlZFByb3BlcnRpZXNJbmZvLnZpc3VhbFNldHRpbmdzVG9CZUV4Y2x1ZGVkXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIGlmICghZGF0YVR5cGUgfHwgIW9UeXBlQ29uZmlnKSB7XG5cdFx0XHRcdC8vIGZvciBjaGFydHNcblx0XHRcdFx0dmlzdWFsU2V0dGluZ3Mud2lkdGhDYWxjdWxhdGlvbiA9IG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdGFubm90YXRpb25Db2x1bW5zLnB1c2goe1xuXHRcdFx0XHRrZXk6IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQobGluZUl0ZW0pLFxuXHRcdFx0XHR0eXBlOiBDb2x1bW5UeXBlLkFubm90YXRpb24sXG5cdFx0XHRcdGxhYmVsOiBzTGFiZWwsXG5cdFx0XHRcdGdyb3VwTGFiZWw6IGlzR3JvdXAgPyBfZ2V0TGFiZWwobGluZUl0ZW0pIDogbnVsbCxcblx0XHRcdFx0Z3JvdXA6IGlzR3JvdXAgPyBncm91cFBhdGggOiBudWxsLFxuXHRcdFx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGxpbmVJdGVtLmZ1bGx5UXVhbGlmaWVkTmFtZSksXG5cdFx0XHRcdHNlbWFudGljT2JqZWN0UGF0aDogc2VtYW50aWNPYmplY3RBbm5vdGF0aW9uUGF0aCxcblx0XHRcdFx0YXZhaWxhYmlsaXR5OiBpc0RhdGFGaWVsZEFsd2F5c0hpZGRlbihsaW5lSXRlbSkgPyBBdmFpbGFiaWxpdHlUeXBlLkhpZGRlbiA6IEF2YWlsYWJpbGl0eVR5cGUuRGVmYXVsdCxcblx0XHRcdFx0bmFtZTogbmFtZSxcblx0XHRcdFx0cmVsYXRpdmVQYXRoOiByZWxhdGl2ZVBhdGgsXG5cdFx0XHRcdHNvcnRhYmxlOiBfaXNDb2x1bW5Tb3J0YWJsZShsaW5lSXRlbSwgcmVsYXRpdmVQYXRoLCBub25Tb3J0YWJsZUNvbHVtbnMpLFxuXHRcdFx0XHRwcm9wZXJ0eUluZm9zOiByZWxhdGVkUHJvcGVydHlOYW1lcy5sZW5ndGggPiAwID8gcmVsYXRlZFByb3BlcnR5TmFtZXMgOiB1bmRlZmluZWQsXG5cdFx0XHRcdGFkZGl0aW9uYWxQcm9wZXJ0eUluZm9zOiBhZGRpdGlvbmFsUHJvcGVydHlOYW1lcy5sZW5ndGggPiAwID8gYWRkaXRpb25hbFByb3BlcnR5TmFtZXMgOiB1bmRlZmluZWQsXG5cdFx0XHRcdGV4cG9ydFNldHRpbmdzOiBleHBvcnRTZXR0aW5ncyxcblx0XHRcdFx0d2lkdGg6IGxpbmVJdGVtLmFubm90YXRpb25zPy5IVE1MNT8uQ3NzRGVmYXVsdHM/LndpZHRoIHx8IHVuZGVmaW5lZCxcblx0XHRcdFx0aXNOYXZpZ2FibGU6IHRydWUsXG5cdFx0XHRcdGZvcm1hdE9wdGlvbnM6IGZvcm1hdE9wdGlvbnMsXG5cdFx0XHRcdGV4cG9ydENvbnRhY3RQcm9wZXJ0eTogcmVsYXRlZFByb3BlcnRpZXNJbmZvLmV4cG9ydFNldHRpbmdzQ29udGFjdFByb3BlcnR5LFxuXHRcdFx0XHRjYXNlU2Vuc2l0aXZlOiBpc0ZpbHRlcmluZ0Nhc2VTZW5zaXRpdmUoY29udmVydGVyQ29udGV4dCksXG5cdFx0XHRcdHR5cGVDb25maWc6IG9UeXBlQ29uZmlnLFxuXHRcdFx0XHR2aXN1YWxTZXR0aW5nczogdmlzdWFsU2V0dGluZ3Ncblx0XHRcdH0gYXMgQW5ub3RhdGlvblRhYmxlQ29sdW1uKTtcblxuXHRcdFx0Ly8gQ29sbGVjdCBpbmZvcm1hdGlvbiBvZiByZWxhdGVkIGNvbHVtbnMgdG8gYmUgY3JlYXRlZC5cblx0XHRcdHJlbGF0ZWRQcm9wZXJ0eU5hbWVzLmZvckVhY2gobmFtZSA9PiB7XG5cdFx0XHRcdGNvbHVtbnNUb0JlQ3JlYXRlZFtuYW1lXSA9IHJlbGF0ZWRQcm9wZXJ0aWVzSW5mby5wcm9wZXJ0aWVzW25hbWVdO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIENyZWF0ZSBjb2x1bW5zIGZvciBhZGRpdGlvbmFsIHByb3BlcnRpZXMgaWRlbnRpZmllZCBmb3IgQUxQIHVzZSBjYXNlLlxuXHRcdFx0YWRkaXRpb25hbFByb3BlcnR5TmFtZXMuZm9yRWFjaChuYW1lID0+IHtcblx0XHRcdFx0Ly8gSW50ZW50aW9uYWwgb3ZlcndyaXRlIGFzIHdlIHJlcXVpcmUgb25seSBvbmUgbmV3IFByb3BlcnR5SW5mbyBmb3IgYSByZWxhdGVkIFByb3BlcnR5LlxuXHRcdFx0XHRjb2x1bW5zVG9CZUNyZWF0ZWRbbmFtZV0gPSByZWxhdGVkUHJvcGVydGllc0luZm8uYWRkaXRpb25hbFByb3BlcnRpZXNbbmFtZV07XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdC8vIEdldCBjb2x1bW5zIGZyb20gdGhlIFByb3BlcnRpZXMgb2YgRW50aXR5VHlwZVxuXHRsZXQgdGFibGVDb2x1bW5zID0gZ2V0Q29sdW1uc0Zyb21FbnRpdHlUeXBlKFxuXHRcdGNvbHVtbnNUb0JlQ3JlYXRlZCxcblx0XHRlbnRpdHlUeXBlLFxuXHRcdGFubm90YXRpb25Db2x1bW5zLFxuXHRcdG5vblNvcnRhYmxlQ29sdW1ucyxcblx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdHRhYmxlVHlwZVxuXHQpO1xuXHR0YWJsZUNvbHVtbnMgPSB0YWJsZUNvbHVtbnMuY29uY2F0KGFubm90YXRpb25Db2x1bW5zKTtcblxuXHQvLyBDcmVhdGUgYSBwcm9wZXJ0eUluZm8gZm9yIGVhY2ggcmVsYXRlZCBwcm9wZXJ0eS5cblx0Y29uc3QgcmVsYXRlZENvbHVtbnMgPSBfY3JlYXRlUmVsYXRlZENvbHVtbnMoY29sdW1uc1RvQmVDcmVhdGVkLCB0YWJsZUNvbHVtbnMsIG5vblNvcnRhYmxlQ29sdW1ucywgY29udmVydGVyQ29udGV4dCwgZW50aXR5VHlwZSk7XG5cdHRhYmxlQ29sdW1ucyA9IHRhYmxlQ29sdW1ucy5jb25jYXQocmVsYXRlZENvbHVtbnMpO1xuXG5cdHJldHVybiB0YWJsZUNvbHVtbnM7XG59O1xuXG4vKipcbiAqIEdldHMgdGhlIHByb3BlcnR5IG5hbWVzIGZyb20gdGhlIG1hbmlmZXN0IGFuZCBjaGVja3MgYWdhaW5zdCBleGlzdGluZyBwcm9wZXJ0aWVzIGFscmVhZHkgYWRkZWQgYnkgYW5ub3RhdGlvbnMuXG4gKiBJZiBhIG5vdCB5ZXQgc3RvcmVkIHByb3BlcnR5IGlzIGZvdW5kIGl0IGFkZHMgaXQgZm9yIHNvcnRpbmcgYW5kIGZpbHRlcmluZyBvbmx5IHRvIHRoZSBhbm5vdGF0aW9uQ29sdW1ucy5cbiAqIEBwYXJhbSB7c3RyaW5nW10gfCB1bmRlZmluZWR9IHByb3BlcnRpZXNcbiAqIEBwYXJhbSB7QW5ub3RhdGlvblRhYmxlQ29sdW1uW119IGFubm90YXRpb25Db2x1bW5zXG4gKiBAcGFyYW0ge0NvbnZlcnRlckNvbnRleHR9IGNvbnZlcnRlckNvbnRleHRcbiAqIEBwYXJhbSBlbnRpdHlUeXBlXG4gKiBAcmV0dXJucyB7c3RyaW5nW119IFRoZSBjb2x1bW5zIGZyb20gdGhlIGFubm90YXRpb25zXG4gKi9cbmNvbnN0IF9nZXRQcm9wZXJ0eU5hbWVzID0gZnVuY3Rpb24oXG5cdHByb3BlcnRpZXM6IHN0cmluZ1tdIHwgdW5kZWZpbmVkLFxuXHRhbm5vdGF0aW9uQ29sdW1uczogQW5ub3RhdGlvblRhYmxlQ29sdW1uW10sXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGVudGl0eVR5cGU6IEVudGl0eVR5cGVcbik6IHN0cmluZ1tdIHwgdW5kZWZpbmVkIHtcblx0bGV0IG1hdGNoZWRQcm9wZXJ0aWVzOiBzdHJpbmdbXSB8IHVuZGVmaW5lZDtcblx0aWYgKHByb3BlcnRpZXMpIHtcblx0XHRtYXRjaGVkUHJvcGVydGllcyA9IHByb3BlcnRpZXMubWFwKGZ1bmN0aW9uKHByb3BlcnR5UGF0aCkge1xuXHRcdFx0Y29uc3QgYW5ub3RhdGlvbkNvbHVtbiA9IGFubm90YXRpb25Db2x1bW5zLmZpbmQoZnVuY3Rpb24oYW5ub3RhdGlvbkNvbHVtbikge1xuXHRcdFx0XHRyZXR1cm4gYW5ub3RhdGlvbkNvbHVtbi5yZWxhdGl2ZVBhdGggPT09IHByb3BlcnR5UGF0aCAmJiBhbm5vdGF0aW9uQ29sdW1uLnByb3BlcnR5SW5mb3MgPT09IHVuZGVmaW5lZDtcblx0XHRcdH0pO1xuXHRcdFx0aWYgKGFubm90YXRpb25Db2x1bW4pIHtcblx0XHRcdFx0cmV0dXJuIGFubm90YXRpb25Db2x1bW4ubmFtZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IHJlbGF0ZWRDb2x1bW5zID0gX2NyZWF0ZVJlbGF0ZWRDb2x1bW5zKFxuXHRcdFx0XHRcdHsgW3Byb3BlcnR5UGF0aF06IGVudGl0eVR5cGUucmVzb2x2ZVBhdGgocHJvcGVydHlQYXRoKSB9LFxuXHRcdFx0XHRcdGFubm90YXRpb25Db2x1bW5zLFxuXHRcdFx0XHRcdFtdLFxuXHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHQsXG5cdFx0XHRcdFx0ZW50aXR5VHlwZVxuXHRcdFx0XHQpO1xuXHRcdFx0XHRhbm5vdGF0aW9uQ29sdW1ucy5wdXNoKHJlbGF0ZWRDb2x1bW5zWzBdKTtcblx0XHRcdFx0cmV0dXJuIHJlbGF0ZWRDb2x1bW5zWzBdLm5hbWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4gbWF0Y2hlZFByb3BlcnRpZXM7XG59O1xuXG5jb25zdCBfYXBwZW5kQ3VzdG9tVGVtcGxhdGUgPSBmdW5jdGlvbihwcm9wZXJ0aWVzOiBzdHJpbmdbXSk6IHN0cmluZyB7XG5cdHJldHVybiBwcm9wZXJ0aWVzXG5cdFx0Lm1hcChwcm9wZXJ0eSA9PiB7XG5cdFx0XHRyZXR1cm4gYHske3Byb3BlcnRpZXMuaW5kZXhPZihwcm9wZXJ0eSl9fWA7XG5cdFx0fSlcblx0XHQuam9pbihgJHtcIlxcblwifWApO1xufTtcblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIHRhYmxlIGNvbHVtbiBwcm9wZXJ0eSB2YWx1ZSBiYXNlZCBvbiBjZXJ0YWluIGNvbmRpdGlvbnMuXG4gKlxuICogTWFuaWZlc3QgZGVmaW5lZCBwcm9wZXJ0eSB2YWx1ZSBmb3IgY3VzdG9tIC8gYW5ub3RhdGlvbiBjb2x1bW5zXG4gKiBEZWZhdWx0IHByb3BlcnR5IHZhbHVlIGZvciBjdXN0b20gY29sdW1uIGlmIG5vdCBvdmVyd3JpdHRlbiBpbiBtYW5pZmVzdC5cbiAqXG4gKiBAcGFyYW0ge2FueX0gcHJvcGVydHkgVGhlIGNvbHVtbiBwcm9wZXJ0eSBkZWZpbmVkIGluIHRoZSBtYW5pZmVzdFxuICogQHBhcmFtIHthbnl9IGRlZmF1bHRWYWx1ZSBUaGUgZGVmYXVsdCB2YWx1ZSBvZiB0aGUgcHJvcGVydHlcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNBbm5vdGF0aW9uQ29sdW1uIFdoZXRoZXIgdGhlIGNvbHVtbiwgZGVmaW5lZCBpbiBtYW5pZmVzdCwgY29ycmVzcG9uZHMgdG8gYW4gZXhpc3RpbmcgYW5ub3RhdGlvbiBjb2x1bW4uXG4gKiBAcmV0dXJucyB7YW55fSBEZXRlcm1pbmVkIHByb3BlcnR5IHZhbHVlIGZvciB0aGUgY29sdW1uXG4gKi9cbmNvbnN0IF9nZXRNYW5pZmVzdE9yRGVmYXVsdFZhbHVlID0gZnVuY3Rpb24ocHJvcGVydHk6IGFueSwgZGVmYXVsdFZhbHVlOiBhbnksIGlzQW5ub3RhdGlvbkNvbHVtbjogYm9vbGVhbik6IGFueSB7XG5cdGlmIChwcm9wZXJ0eSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0Ly8gSWYgYW5ub3RhdGlvbiBjb2x1bW4gaGFzIG5vIHByb3BlcnR5IGRlZmluZWQgaW4gbWFuaWZlc3QsXG5cdFx0Ly8gZG8gbm90IG92ZXJ3cml0ZSBpdCB3aXRoIG1hbmlmZXN0IGNvbHVtbidzIGRlZmF1bHQgdmFsdWUuXG5cdFx0cmV0dXJuIGlzQW5ub3RhdGlvbkNvbHVtbiA/IHVuZGVmaW5lZCA6IGRlZmF1bHRWYWx1ZTtcblx0fVxuXHQvLyBSZXR1cm4gd2hhdCBpcyBkZWZpbmVkIGluIG1hbmlmZXN0LlxuXHRyZXR1cm4gcHJvcGVydHk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGFibGUgY29sdW1uIGRlZmluaXRpb25zIGZyb20gbWFuaWZlc3QuXG4gKiBAcGFyYW0gY29sdW1uc1xuICogQHBhcmFtIGFubm90YXRpb25Db2x1bW5zXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHBhcmFtIGVudGl0eVR5cGVcbiAqIEBwYXJhbSBuYXZpZ2F0aW9uU2V0dGluZ3NcbiAqIEByZXR1cm5zIHtSZWNvcmQ8c3RyaW5nLCBDdXN0b21Db2x1bW4+fSBUaGUgY29sdW1ucyBmcm9tIHRoZSBtYW5pZmVzdFxuICovXG5jb25zdCBnZXRDb2x1bW5zRnJvbU1hbmlmZXN0ID0gZnVuY3Rpb24oXG5cdGNvbHVtbnM6IFJlY29yZDxzdHJpbmcsIE1hbmlmZXN0VGFibGVDb2x1bW4+LFxuXHRhbm5vdGF0aW9uQ29sdW1uczogQW5ub3RhdGlvblRhYmxlQ29sdW1uW10sXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGVudGl0eVR5cGU6IEVudGl0eVR5cGUsXG5cdG5hdmlnYXRpb25TZXR0aW5ncz86IE5hdmlnYXRpb25TZXR0aW5nc0NvbmZpZ3VyYXRpb25cbik6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUNvbHVtbj4ge1xuXHRjb25zdCBpbnRlcm5hbENvbHVtbnM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUNvbHVtbj4gPSB7fTtcblxuXHRmb3IgKGNvbnN0IGtleSBpbiBjb2x1bW5zKSB7XG5cdFx0Y29uc3QgbWFuaWZlc3RDb2x1bW4gPSBjb2x1bW5zW2tleV07XG5cdFx0Ly8gVG8gaWRlbnRpZnkgdGhlIGFubm90YXRpb24gY29sdW1uIHByb3BlcnR5IG92ZXJ3cml0ZSB2aWEgbWFuaWZlc3QgdXNlLWNhc2UuXG5cdFx0Y29uc3QgaXNBbm5vdGF0aW9uQ29sdW1uID0gYW5ub3RhdGlvbkNvbHVtbnMuc29tZShjb2x1bW4gPT4gY29sdW1uLmtleSA9PT0ga2V5KTtcblx0XHRLZXlIZWxwZXIudmFsaWRhdGVLZXkoa2V5KTtcblx0XHRjb25zdCBwcm9wZXJ0eUluZm9zOiBzdHJpbmdbXSB8IHVuZGVmaW5lZCA9IF9nZXRQcm9wZXJ0eU5hbWVzKFxuXHRcdFx0bWFuaWZlc3RDb2x1bW4ucHJvcGVydGllcyxcblx0XHRcdGFubm90YXRpb25Db2x1bW5zLFxuXHRcdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRcdGVudGl0eVR5cGVcblx0XHQpO1xuXG5cdFx0aW50ZXJuYWxDb2x1bW5zW2tleV0gPSB7XG5cdFx0XHRrZXk6IGtleSxcblx0XHRcdGlkOiBcIkN1c3RvbUNvbHVtbjo6XCIgKyBrZXksXG5cdFx0XHRuYW1lOiBcIkN1c3RvbUNvbHVtbjo6XCIgKyBrZXksXG5cdFx0XHRoZWFkZXI6IG1hbmlmZXN0Q29sdW1uLmhlYWRlcixcblx0XHRcdHdpZHRoOiBtYW5pZmVzdENvbHVtbi53aWR0aCB8fCB1bmRlZmluZWQsXG5cdFx0XHRob3Jpem9udGFsQWxpZ246IF9nZXRNYW5pZmVzdE9yRGVmYXVsdFZhbHVlKG1hbmlmZXN0Q29sdW1uPy5ob3Jpem9udGFsQWxpZ24sIEhvcml6b250YWxBbGlnbi5CZWdpbiwgaXNBbm5vdGF0aW9uQ29sdW1uKSxcblx0XHRcdHR5cGU6IG1hbmlmZXN0Q29sdW1uLnR5cGUgPT09IFwiU2xvdFwiID8gQ29sdW1uVHlwZS5TbG90IDogQ29sdW1uVHlwZS5EZWZhdWx0LFxuXHRcdFx0YXZhaWxhYmlsaXR5OiBfZ2V0TWFuaWZlc3RPckRlZmF1bHRWYWx1ZShtYW5pZmVzdENvbHVtbj8uYXZhaWxhYmlsaXR5LCBBdmFpbGFiaWxpdHlUeXBlLkRlZmF1bHQsIGlzQW5ub3RhdGlvbkNvbHVtbiksXG5cdFx0XHR0ZW1wbGF0ZTogbWFuaWZlc3RDb2x1bW4udGVtcGxhdGUgfHwgXCJ1bmRlZmluZWRcIixcblx0XHRcdHBvc2l0aW9uOiB7XG5cdFx0XHRcdGFuY2hvcjogbWFuaWZlc3RDb2x1bW4ucG9zaXRpb24/LmFuY2hvcixcblx0XHRcdFx0cGxhY2VtZW50OiBtYW5pZmVzdENvbHVtbi5wb3NpdGlvbiA9PT0gdW5kZWZpbmVkID8gUGxhY2VtZW50LkFmdGVyIDogbWFuaWZlc3RDb2x1bW4ucG9zaXRpb24ucGxhY2VtZW50XG5cdFx0XHR9LFxuXHRcdFx0aXNOYXZpZ2FibGU6IGlzQW5ub3RhdGlvbkNvbHVtbiA/IHVuZGVmaW5lZCA6IGlzQWN0aW9uTmF2aWdhYmxlKG1hbmlmZXN0Q29sdW1uLCBuYXZpZ2F0aW9uU2V0dGluZ3MsIHRydWUpLFxuXHRcdFx0c2V0dGluZ3M6IG1hbmlmZXN0Q29sdW1uLnNldHRpbmdzLFxuXHRcdFx0c29ydGFibGU6IGZhbHNlLFxuXHRcdFx0cHJvcGVydHlJbmZvczogcHJvcGVydHlJbmZvcyxcblx0XHRcdGZvcm1hdE9wdGlvbnM6IHtcblx0XHRcdFx0Li4uZ2V0RGVmYXVsdEZvcm1hdE9wdGlvbnNGb3JUYWJsZSgpLFxuXHRcdFx0XHQuLi5tYW5pZmVzdENvbHVtbi5mb3JtYXRPcHRpb25zXG5cdFx0XHR9LFxuXHRcdFx0ZXhwb3J0U2V0dGluZ3M6IHtcblx0XHRcdFx0dGVtcGxhdGU6IHByb3BlcnR5SW5mb3MgPyBfYXBwZW5kQ3VzdG9tVGVtcGxhdGUocHJvcGVydHlJbmZvcykgOiB1bmRlZmluZWQsXG5cdFx0XHRcdGZpZWxkTGFiZWw6IHByb3BlcnR5SW5mb3MgPyBtYW5pZmVzdENvbHVtbi5oZWFkZXIgOiB1bmRlZmluZWQsXG5cdFx0XHRcdHdyYXA6IHByb3BlcnR5SW5mb3MgJiYgcHJvcGVydHlJbmZvcy5sZW5ndGggPiAxID8gdHJ1ZSA6IGZhbHNlXG5cdFx0XHR9LFxuXHRcdFx0Y2FzZVNlbnNpdGl2ZTogaXNGaWx0ZXJpbmdDYXNlU2Vuc2l0aXZlKGNvbnZlcnRlckNvbnRleHQpXG5cdFx0fTtcblx0fVxuXHRyZXR1cm4gaW50ZXJuYWxDb2x1bW5zO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFAxM25Nb2RlKFxuXHR2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHR0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbjogVGFibGVDb250cm9sQ29uZmlndXJhdGlvblxuKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0Y29uc3QgbWFuaWZlc3RXcmFwcGVyOiBNYW5pZmVzdFdyYXBwZXIgPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpO1xuXHRjb25zdCB0YWJsZU1hbmlmZXN0U2V0dGluZ3M6IFRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdENvbnRyb2xDb25maWd1cmF0aW9uKHZpc3VhbGl6YXRpb25QYXRoKTtcblx0Y29uc3QgdmFyaWFudE1hbmFnZW1lbnQ6IFZhcmlhbnRNYW5hZ2VtZW50VHlwZSA9IG1hbmlmZXN0V3JhcHBlci5nZXRWYXJpYW50TWFuYWdlbWVudCgpO1xuXHRjb25zdCBhUGVyc29uYWxpemF0aW9uOiBzdHJpbmdbXSA9IFtdO1xuXHRjb25zdCBiQW5hbHl0aWNhbFRhYmxlID0gdGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24udHlwZSA9PT0gXCJBbmFseXRpY2FsVGFibGVcIjtcblx0aWYgKHRhYmxlTWFuaWZlc3RTZXR0aW5ncz8udGFibGVTZXR0aW5ncz8ucGVyc29uYWxpemF0aW9uICE9PSB1bmRlZmluZWQpIHtcblx0XHQvLyBQZXJzb25hbGl6YXRpb24gY29uZmlndXJlZCBpbiBtYW5pZmVzdC5cblx0XHRjb25zdCBwZXJzb25hbGl6YXRpb246IGFueSA9IHRhYmxlTWFuaWZlc3RTZXR0aW5ncy50YWJsZVNldHRpbmdzLnBlcnNvbmFsaXphdGlvbjtcblx0XHRpZiAocGVyc29uYWxpemF0aW9uID09PSB0cnVlKSB7XG5cdFx0XHQvLyBUYWJsZSBwZXJzb25hbGl6YXRpb24gZnVsbHkgZW5hYmxlZC5cblx0XHRcdHJldHVybiBiQW5hbHl0aWNhbFRhYmxlID8gXCJTb3J0LENvbHVtbixGaWx0ZXIsR3JvdXAsQWdncmVnYXRlXCIgOiBcIlNvcnQsQ29sdW1uLEZpbHRlclwiO1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIHBlcnNvbmFsaXphdGlvbiA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0Ly8gU3BlY2lmaWMgcGVyc29uYWxpemF0aW9uIG9wdGlvbnMgZW5hYmxlZCBpbiBtYW5pZmVzdC4gVXNlIHRoZW0gYXMgaXMuXG5cdFx0XHRpZiAocGVyc29uYWxpemF0aW9uLnNvcnQpIHtcblx0XHRcdFx0YVBlcnNvbmFsaXphdGlvbi5wdXNoKFwiU29ydFwiKTtcblx0XHRcdH1cblx0XHRcdGlmIChwZXJzb25hbGl6YXRpb24uY29sdW1uKSB7XG5cdFx0XHRcdGFQZXJzb25hbGl6YXRpb24ucHVzaChcIkNvbHVtblwiKTtcblx0XHRcdH1cblx0XHRcdGlmIChwZXJzb25hbGl6YXRpb24uZmlsdGVyKSB7XG5cdFx0XHRcdGFQZXJzb25hbGl6YXRpb24ucHVzaChcIkZpbHRlclwiKTtcblx0XHRcdH1cblx0XHRcdGlmIChwZXJzb25hbGl6YXRpb24uZ3JvdXAgJiYgYkFuYWx5dGljYWxUYWJsZSkge1xuXHRcdFx0XHRhUGVyc29uYWxpemF0aW9uLnB1c2goXCJHcm91cFwiKTtcblx0XHRcdH1cblx0XHRcdGlmIChwZXJzb25hbGl6YXRpb24uYWdncmVnYXRlICYmIGJBbmFseXRpY2FsVGFibGUpIHtcblx0XHRcdFx0YVBlcnNvbmFsaXphdGlvbi5wdXNoKFwiQWdncmVnYXRlXCIpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGFQZXJzb25hbGl6YXRpb24ubGVuZ3RoID4gMCA/IGFQZXJzb25hbGl6YXRpb24uam9pbihcIixcIikgOiB1bmRlZmluZWQ7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdC8vIE5vIHBlcnNvbmFsaXphdGlvbiBjb25maWd1cmVkIGluIG1hbmlmZXN0LlxuXHRcdGFQZXJzb25hbGl6YXRpb24ucHVzaChcIlNvcnRcIik7XG5cdFx0YVBlcnNvbmFsaXphdGlvbi5wdXNoKFwiQ29sdW1uXCIpO1xuXHRcdGlmICh2YXJpYW50TWFuYWdlbWVudCA9PT0gVmFyaWFudE1hbmFnZW1lbnRUeXBlLkNvbnRyb2wpIHtcblx0XHRcdC8vIEZlYXR1cmUgcGFyaXR5IHdpdGggVjIuXG5cdFx0XHQvLyBFbmFibGUgdGFibGUgZmlsdGVyaW5nIGJ5IGRlZmF1bHQgb25seSBpbiBjYXNlIG9mIENvbnRyb2wgbGV2ZWwgdmFyaWFudCBtYW5hZ2VtZW50LlxuXHRcdFx0YVBlcnNvbmFsaXphdGlvbi5wdXNoKFwiRmlsdGVyXCIpO1xuXHRcdH1cblx0XHRpZiAoYkFuYWx5dGljYWxUYWJsZSkge1xuXHRcdFx0YVBlcnNvbmFsaXphdGlvbi5wdXNoKFwiR3JvdXBcIik7XG5cdFx0XHRhUGVyc29uYWxpemF0aW9uLnB1c2goXCJBZ2dyZWdhdGVcIik7XG5cdFx0fVxuXHRcdHJldHVybiBhUGVyc29uYWxpemF0aW9uLmpvaW4oXCIsXCIpO1xuXHR9XG5cdHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gZGV0ZXJtaW5lIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSBEZWxldGUgYnV0dG9uLlxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBpbnN0YW5jZSBvZiB0aGUgY29udmVydGVyIGNvbnRleHRcbiAqIEBwYXJhbSBuYXZpZ2F0aW9uUGF0aCBQYXRoIHRvIHRoZSBuYXZpZ2F0aW9uIGVudGl0eVxuICogQHBhcmFtIGlzVGFyZ2V0RGVsZXRhYmxlIEZsYWcgd2hpY2ggZGV0ZXJtaW5lcyB3aGV0aGVyIGEgdGFyZ2V0IGlzIGRlbGV0YWJsZVxuICogQHBhcmFtIHZpZXdDb25maWd1cmF0aW9uIFRoZSBpbnN0YW5jZSBvZiB0aGUgY29uZmlndXJhdGlvbiBmb3IgdGhlIHZpZXcgcGF0aFxuICogQHJldHVybnMge0V4cHJlc3Npb248Ym9vbGVhbj59IFRoZSBleHByZXNzaW9uIGZvciB0aGUgRGVsZXRlIGJ1dHRvblxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVsZXRlVmlzaWJsZShcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0bmF2aWdhdGlvblBhdGg6IHN0cmluZyxcblx0aXNUYXJnZXREZWxldGFibGU6IGJvb2xlYW4sXG5cdHZpZXdDb25maWd1cmF0aW9uPzogVmlld1BhdGhDb25maWd1cmF0aW9uXG4pOiBFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0Y29uc3QgY3VycmVudEVudGl0eVNldCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCk7XG5cdGNvbnN0IGRhdGFNb2RlbE9iamVjdFBhdGggPSBjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKTtcblx0Y29uc3QgdmlzaXRlZE5hdmlnYXRpb25QYXRocyA9IGRhdGFNb2RlbE9iamVjdFBhdGgubmF2aWdhdGlvblByb3BlcnRpZXMubWFwKG5hdlByb3AgPT4gbmF2UHJvcC5uYW1lKTtcblx0Y29uc3QgaXNEZWxldGVIaWRkZW5FeHByZXNzaW9uID0gY3VycmVudEVudGl0eVNldFxuXHRcdD8gYW5ub3RhdGlvbkV4cHJlc3Npb24oXG5cdFx0XHRcdChjdXJyZW50RW50aXR5U2V0Py5hbm5vdGF0aW9ucy5VST8uRGVsZXRlSGlkZGVuIGFzIFByb3BlcnR5QW5ub3RhdGlvblZhbHVlPGJvb2xlYW4+KSB8fCBmYWxzZSxcblx0XHRcdFx0dmlzaXRlZE5hdmlnYXRpb25QYXRocyxcblx0XHRcdFx0dW5kZWZpbmVkLFxuXHRcdFx0XHQocGF0aDogc3RyaW5nKSA9PiBzaW5nbGV0b25QYXRoVmlzaXRvcihwYXRoLCBjb252ZXJ0ZXJDb250ZXh0LCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzKVxuXHRcdCAgKVxuXHRcdDogY29uc3RhbnQoZmFsc2UpO1xuXHRjb25zdCBpc0RlbGV0ZUhpZGRlbjogYW55ID0gY29tcGlsZUJpbmRpbmcoaXNEZWxldGVIaWRkZW5FeHByZXNzaW9uKTtcblx0bGV0IGlzUGFyZW50RGVsZXRhYmxlLCBwYXJlbnRFbnRpdHlTZXREZWxldGFibGU7XG5cdGlmIChjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBUZW1wbGF0ZVR5cGUuT2JqZWN0UGFnZSkge1xuXHRcdGlzUGFyZW50RGVsZXRhYmxlID0gaXNQYXRoRGVsZXRhYmxlKGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpLCBuYXZpZ2F0aW9uUGF0aCk7XG5cdFx0cGFyZW50RW50aXR5U2V0RGVsZXRhYmxlID0gaXNQYXJlbnREZWxldGFibGUgPyBjb21waWxlQmluZGluZyhpc1BhcmVudERlbGV0YWJsZSkgOiBpc1BhcmVudERlbGV0YWJsZTtcblx0fVxuXHRjb25zdCBiSXNTdGlja3lTZXNzaW9uU3VwcG9ydGVkID0gY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCkuc3RhcnRpbmdFbnRpdHlTZXQ/LmFubm90YXRpb25zPy5TZXNzaW9uXG5cdFx0Py5TdGlja3lTZXNzaW9uU3VwcG9ydGVkXG5cdFx0PyB0cnVlXG5cdFx0OiBmYWxzZTtcblx0Y29uc3QgYklzRHJhZnRSb290ID0gY3VycmVudEVudGl0eVNldCAmJiBjdXJyZW50RW50aXR5U2V0LmFubm90YXRpb25zPy5Db21tb24/LkRyYWZ0Um9vdCA/IHRydWUgOiBmYWxzZTtcblx0Y29uc3QgYklzRHJhZnROb2RlID0gY3VycmVudEVudGl0eVNldCAmJiBjdXJyZW50RW50aXR5U2V0LmFubm90YXRpb25zPy5Db21tb24/LkRyYWZ0Tm9kZSA/IHRydWUgOiBmYWxzZTtcblx0Y29uc3QgYklzRHJhZnRQYXJlbnRFbnRpdHlGb3JDb250YWlubWVudCA9XG5cdFx0Y29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCkudGFyZ2V0T2JqZWN0Py5jb250YWluc1RhcmdldCAmJlxuXHRcdChjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKS5zdGFydGluZ0VudGl0eVNldD8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uRHJhZnRSb290IHx8XG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKS5zdGFydGluZ0VudGl0eVNldD8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uRHJhZnROb2RlKVxuXHRcdFx0PyB0cnVlXG5cdFx0XHQ6IGZhbHNlO1xuXHRpZiAoXG5cdFx0YklzRHJhZnRSb290IHx8XG5cdFx0YklzRHJhZnROb2RlIHx8XG5cdFx0YklzU3RpY2t5U2Vzc2lvblN1cHBvcnRlZCB8fFxuXHRcdCghY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKSAmJiBiSXNEcmFmdFBhcmVudEVudGl0eUZvckNvbnRhaW5tZW50KVxuXHQpIHtcblx0XHQvL2RvIG5vdCBzaG93IGNhc2UgdGhlIGRlbGV0ZSBidXR0b24gaWYgcGFyZW50RW50aXR5U2V0RGVsZXRhYmxlIGlzIGZhbHNlXG5cdFx0aWYgKHBhcmVudEVudGl0eVNldERlbGV0YWJsZSA9PT0gXCJmYWxzZVwiKSB7XG5cdFx0XHRyZXR1cm4gY29uc3RhbnQoZmFsc2UpO1xuXHRcdFx0Ly9PUFxuXHRcdH0gZWxzZSBpZiAocGFyZW50RW50aXR5U2V0RGVsZXRhYmxlICYmIGlzRGVsZXRlSGlkZGVuICE9PSBcInRydWVcIikge1xuXHRcdFx0Ly9EZWxldGUgSGlkZGVuIGluIGNhc2Ugb2YgdHJ1ZSBhbmQgcGF0aCBiYXNlZFxuXHRcdFx0aWYgKGlzRGVsZXRlSGlkZGVuICYmIGlzRGVsZXRlSGlkZGVuICE9PSBcImZhbHNlXCIpIHtcblx0XHRcdFx0cmV0dXJuIGFuZChlcXVhbChiaW5kaW5nRXhwcmVzc2lvbihcIi9lZGl0TW9kZVwiLCBcInVpXCIpLCBcIkVkaXRhYmxlXCIpLCBub3QoaXNEZWxldGVIaWRkZW5FeHByZXNzaW9uKSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gZXF1YWwoYmluZGluZ0V4cHJlc3Npb24oXCIvZWRpdE1vZGVcIiwgXCJ1aVwiKSwgXCJFZGl0YWJsZVwiKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKFxuXHRcdFx0aXNEZWxldGVIaWRkZW4gPT09IFwidHJ1ZVwiIHx8XG5cdFx0XHQhaXNUYXJnZXREZWxldGFibGUgfHxcblx0XHRcdCh2aWV3Q29uZmlndXJhdGlvbiAmJiBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpLmhhc011bHRpcGxlVmlzdWFsaXphdGlvbnModmlld0NvbmZpZ3VyYXRpb24pKSB8fFxuXHRcdFx0Y29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gVGVtcGxhdGVUeXBlLkFuYWx5dGljYWxMaXN0UGFnZVxuXHRcdCkge1xuXHRcdFx0cmV0dXJuIGNvbnN0YW50KGZhbHNlKTtcblx0XHR9IGVsc2UgaWYgKGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgIT09IFRlbXBsYXRlVHlwZS5MaXN0UmVwb3J0KSB7XG5cdFx0XHRpZiAoaXNEZWxldGVIaWRkZW4gJiYgaXNEZWxldGVIaWRkZW4gPT09IFwiZmFsc2VcIikge1xuXHRcdFx0XHRyZXR1cm4gYW5kKGVxdWFsKGJpbmRpbmdFeHByZXNzaW9uKFwiL2VkaXRNb2RlXCIsIFwidWlcIiksIFwiRWRpdGFibGVcIiksIG5vdChpc0RlbGV0ZUhpZGRlbkV4cHJlc3Npb24pKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBlcXVhbChiaW5kaW5nRXhwcmVzc2lvbihcIi9lZGl0TW9kZVwiLCBcInVpXCIpLCBcIkVkaXRhYmxlXCIpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoaXNCaW5kaW5nKGlzRGVsZXRlSGlkZGVuRXhwcmVzc2lvbikpIHtcblx0XHRcdC8vIFVJLkRlbGV0ZUhpZGRlbiBhbm5vdGF0aW9uIHBvaW50cyB0byBhIHBhdGhcblx0XHRcdHJldHVybiBub3QoaXNEZWxldGVIaWRkZW5FeHByZXNzaW9uKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGNvbnN0YW50KHRydWUpO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gY29uc3RhbnQoZmFsc2UpO1xuXHR9XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZW5hYmxlbWVudCBmb3IgdGhlICdNYXNzIEVkaXQnIGJ1dHRvblxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcGFyYW0gYk1hc3NFZGl0VmlzaWJsZSBUaGUgdmlzaWJpbGl0eSBvZiB0aGUgJ01hc3MgRWRpdCcgYnV0dG9uXG4gKiBAcmV0dXJucyB7Kn0gRXhwcmVzc2lvbiBvciBCb29sZWFuIHZhbHVlIGZvciB0aGUgZW5hYmxlbWVudCBvZiB0aGUgJ01hc3MgRWRpdCcgYnV0dG9uXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVuYWJsZW1lbnRNYXNzRWRpdChcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0Yk1hc3NFZGl0VmlzaWJsZTogc3RyaW5nIHwgYm9vbGVhbiB8IHVuZGVmaW5lZFxuKTogc3RyaW5nIHwgYm9vbGVhbiB7XG5cdGlmIChiTWFzc0VkaXRWaXNpYmxlKSB7XG5cdFx0Y29uc3QgaXNQYXJlbnRVcGRhdGFibGU6IGFueSA9IGlzUGF0aFVwZGF0YWJsZShjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKSwgdW5kZWZpbmVkLCB0cnVlKTtcblx0XHQvL3doZW4gdXBkYXRhYmxlIGlzIHBhdGggYmFzZWQgYW5kIHBvaW50aW5nIHRvIGN1cnJlbnQgZW50aXR5IHNldCBwcm9wZXJ0eSwgdGhhdCBjYXNlIGlzIGhhbmRsZWQgaW4gdGFibGUgaGVscGVyIGFuZCBydW50aW1lXG5cdFx0aWYgKGlzUGFyZW50VXBkYXRhYmxlPy5jdXJyZW50RW50aXR5UmVzdHJpY3Rpb24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0Y29uc3Qgb0V4cHJlc3Npb246IGFueSA9IGNvbXBpbGVCaW5kaW5nKGlzUGFyZW50VXBkYXRhYmxlKTtcblx0XHRyZXR1cm4gaXNQYXJlbnRVcGRhdGFibGVcblx0XHRcdD8gXCJ7PSAle2ludGVybmFsPm51bWJlck9mU2VsZWN0ZWRDb250ZXh0c30gPj0gMiAmJiBcIiArIGNvbXBpbGVCaW5kaW5nKGlzUGFyZW50VXBkYXRhYmxlLCBvRXhwcmVzc2lvbikgKyBcIn1cIlxuXHRcdFx0OiBmYWxzZTtcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgdmlzaWJpbGl0eSBmb3IgdGhlICdNYXNzIEVkaXQnIGJ1dHRvblxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcGFyYW0gdGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24gVGhlIG1hbmlmZXN0IGNvbmZpZ3VyYXRpb24gZm9yIHRoZSB0YWJsZVxuICogQHBhcmFtIHRhcmdldENhcGFiaWxpdGllcyBUaGUgdGFyZ2V0IGNhcGFiaWxpdHkgcmVzdHJpY3Rpb25zIGZvciB0aGUgdGFibGVcbiAqIEBwYXJhbSBzZWxlY3Rpb25Nb2RlIFRoZSBzZWxlY3Rpb24gbW9kZSBmb3IgdGhlIHRhYmxlXG4gKiBAcmV0dXJucyB7Kn0gRXhwcmVzc2lvbiBvciBCb29sZWFuIHZhbHVlIGZvciB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgJ01hc3MgRWRpdCcgYnV0dG9uXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFZpc2liaWxpdHlNYXNzRWRpdChcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0dGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb246IFRhYmxlQ29udHJvbENvbmZpZ3VyYXRpb24sXG5cdHRhcmdldENhcGFiaWxpdGllczogVGFibGVDYXBhYmlsaXR5UmVzdHJpY3Rpb24sXG5cdHNlbGVjdGlvbk1vZGU6IHN0cmluZyB8IHVuZGVmaW5lZFxuKTogYm9vbGVhbiB8IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdGNvbnN0IGVudGl0eVNldCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCksXG5cdFx0YlVwZGF0ZUhpZGRlbjogYW55ID0gZW50aXR5U2V0ICYmIGVudGl0eVNldD8uYW5ub3RhdGlvbnMuVUk/LlVwZGF0ZUhpZGRlbj8udmFsdWVPZigpLFxuXHRcdGJNYXNzRWRpdEVuYWJsZWQ6IGJvb2xlYW4gPSB0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbj8uZW5hYmxlTWFzc0VkaXQgfHwgZmFsc2UsXG5cdFx0aVNlbGVjdGlvbkxpbWl0OiBudW1iZXIgPSB0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbj8uc2VsZWN0aW9uTGltaXQ7XG5cdGxldCBiTWFzc0VkaXRWaXNpYmxlOiBib29sZWFuID0gdHJ1ZTtcblx0aWYgKChzZWxlY3Rpb25Nb2RlICYmIHNlbGVjdGlvbk1vZGUgPT09IFwiU2luZ2xlXCIpIHx8IChpU2VsZWN0aW9uTGltaXQgJiYgaVNlbGVjdGlvbkxpbWl0IDwgMikpIHtcblx0XHRiTWFzc0VkaXRWaXNpYmxlID0gZmFsc2U7XG5cdH0gZWxzZSBpZiAoc2VsZWN0aW9uTW9kZSAmJiAoc2VsZWN0aW9uTW9kZSA9PT0gXCJBdXRvXCIgfHwgc2VsZWN0aW9uTW9kZSA9PT0gXCJOb25lXCIpKSB7XG5cdFx0Yk1hc3NFZGl0VmlzaWJsZSA9IHRydWU7XG5cdH1cblx0aWYgKHRhcmdldENhcGFiaWxpdGllcz8uaXNVcGRhdGFibGUgIT09IGZhbHNlICYmIGJNYXNzRWRpdFZpc2libGUgJiYgYk1hc3NFZGl0RW5hYmxlZCkge1xuXHRcdGlmIChiVXBkYXRlSGlkZGVuICYmIHR5cGVvZiBiVXBkYXRlSGlkZGVuID09PSBcImJvb2xlYW5cIikge1xuXHRcdFx0cmV0dXJuICFiVXBkYXRlSGlkZGVuICYmIGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFRlbXBsYXRlVHlwZS5PYmplY3RQYWdlID8gY29tcGlsZUJpbmRpbmcoVUkuSXNFZGl0YWJsZSkgOiBmYWxzZTtcblx0XHR9IGVsc2UgaWYgKGJVcGRhdGVIaWRkZW4gJiYgYlVwZGF0ZUhpZGRlbj8ucGF0aCkge1xuXHRcdFx0cmV0dXJuIGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFRlbXBsYXRlVHlwZS5PYmplY3RQYWdlXG5cdFx0XHRcdD8gY29tcGlsZUJpbmRpbmcoYW5kKGVxdWFsKFVJLklzRWRpdGFibGUsIHRydWUpLCBlcXVhbChhbm5vdGF0aW9uRXhwcmVzc2lvbihiVXBkYXRlSGlkZGVuKSwgZmFsc2UpKSlcblx0XHRcdFx0OiBmYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFRlbXBsYXRlVHlwZS5PYmplY3RQYWdlID8gY29tcGlsZUJpbmRpbmcoVUkuSXNFZGl0YWJsZSkgOiBmYWxzZTtcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gZGV0ZXJtaW5lIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSBDcmVhdGUgYnV0dG9uLlxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBpbnN0YW5jZSBvZiB0aGUgY29udmVydGVyIGNvbnRleHRcbiAqIEBwYXJhbSBjcmVhdGlvbk1vZGUgVGhlIG1vZGUgdXNlZCBmb3IgY3JlYXRpb25cbiAqIEBwYXJhbSBpc0luc2VydGFibGUgQW5ub3RhdGlvbiBleHByZXNzaW9uIG9mIEluc2VydFJlc3RyaWN0aW9ucy5JbnNlcnRhYmxlXG4gKiBAcGFyYW0gdmlld0NvbmZpZ3VyYXRpb24gVGhlIGluc3RhbmNlIG9mIHRoZSBjb25maWd1cmF0aW9uIGZvciB0aGUgdmlldyBwYXRoXG4gKiBAcmV0dXJucyB7RXhwcmVzc2lvbjxib29sZWFuPn0gRXhwcmVzc2lvbiBvciBCb29sZWFuIHZhbHVlIG9mIHRoZSAnVUkuQ3JlYXRlSGlkZGVuJyBhbm5vdGF0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDcmVhdGVWaXNpYmxlKFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRjcmVhdGlvbk1vZGU6IENyZWF0aW9uTW9kZSB8IFwiRXh0ZXJuYWxcIixcblx0aXNJbnNlcnRhYmxlOiBFeHByZXNzaW9uPGJvb2xlYW4+LFxuXHR2aWV3Q29uZmlndXJhdGlvbj86IFZpZXdQYXRoQ29uZmlndXJhdGlvblxuKTogRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdGNvbnN0IGN1cnJlbnRFbnRpdHlTZXQgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldCgpO1xuXHRjb25zdCBkYXRhTW9kZWxPYmplY3RQYXRoID0gY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCk7XG5cdGNvbnN0IHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMgPSBkYXRhTW9kZWxPYmplY3RQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzLm1hcChuYXZQcm9wID0+IG5hdlByb3AubmFtZSk7XG5cdGNvbnN0IGlzQ3JlYXRlSGlkZGVuOiBFeHByZXNzaW9uPGJvb2xlYW4+ID0gY3VycmVudEVudGl0eVNldFxuXHRcdD8gYW5ub3RhdGlvbkV4cHJlc3Npb24oXG5cdFx0XHRcdChjdXJyZW50RW50aXR5U2V0Py5hbm5vdGF0aW9ucy5VST8uQ3JlYXRlSGlkZGVuIGFzIFByb3BlcnR5QW5ub3RhdGlvblZhbHVlPGJvb2xlYW4+KSB8fCBmYWxzZSxcblx0XHRcdFx0dmlzaXRlZE5hdmlnYXRpb25QYXRocyxcblx0XHRcdFx0dW5kZWZpbmVkLFxuXHRcdFx0XHQocGF0aDogc3RyaW5nKSA9PiBzaW5nbGV0b25QYXRoVmlzaXRvcihwYXRoLCBjb252ZXJ0ZXJDb250ZXh0LCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzKVxuXHRcdCAgKVxuXHRcdDogY29uc3RhbnQoZmFsc2UpO1xuXG5cdC8vIGlmIHRoZXJlIGlzIGEgY3VzdG9tIG5ldyBhY3Rpb24gdGhlIGNyZWF0ZSBidXR0b24gd2lsbCBiZSBib3VuZCBhZ2FpbnN0IHRoaXMgbmV3IGFjdGlvbiAoaW5zdGVhZCBvZiBhIFBPU1QgYWN0aW9uKS5cblx0Ly8gVGhlIHZpc2liaWxpdHkgb2YgdGhlIGNyZWF0ZSBidXR0b24gdGhlbiBkZXBlbmRzIG9uIHRoZSBuZXcgYWN0aW9uJ3MgT3BlcmF0aW9uQXZhaWxhYmxlIGFubm90YXRpb24gKGluc3RlYWQgb2YgdGhlIGluc2VydFJlc3RyaWN0aW9ucyk6XG5cdC8vIE9wZXJhdGlvbkF2YWlsYWJsZSA9IHRydWUgb3IgdW5kZWZpbmVkIC0+IGNyZWF0ZSBpcyB2aXNpYmxlXG5cdC8vIE9wZXJhdGlvbkF2YWlsYWJsZSA9IGZhbHNlIC0+IGNyZWF0ZSBpcyBub3QgdmlzaWJsZVxuXHRjb25zdCBuZXdBY3Rpb25OYW1lOiBCaW5kaW5nRXhwcmVzc2lvbjxzdHJpbmc+ID0gY3VycmVudEVudGl0eVNldD8uYW5ub3RhdGlvbnMuQ29tbW9uPy5EcmFmdFJvb3Q/Lk5ld0FjdGlvbj8udG9TdHJpbmcoKTtcblx0Y29uc3Qgc2hvd0NyZWF0ZUZvck5ld0FjdGlvbiA9IG5ld0FjdGlvbk5hbWVcblx0XHQ/IGFubm90YXRpb25FeHByZXNzaW9uKFxuXHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0Py5nZXRFbnRpdHlUeXBlKCkuYWN0aW9uc1tuZXdBY3Rpb25OYW1lXS5hbm5vdGF0aW9ucz8uQ29yZT8uT3BlcmF0aW9uQXZhaWxhYmxlPy52YWx1ZU9mKCksXG5cdFx0XHRcdFtdLFxuXHRcdFx0XHR0cnVlLFxuXHRcdFx0XHQocGF0aDogc3RyaW5nKSA9PiBzaW5nbGV0b25QYXRoVmlzaXRvcihwYXRoLCBjb252ZXJ0ZXJDb250ZXh0LCBbXSlcblx0XHQgIClcblx0XHQ6IHVuZGVmaW5lZDtcblx0Ly8gLSBJZiBpdCdzIHN0YXRpY2FsbHkgbm90IGluc2VydGFibGUgLT4gY3JlYXRlIGlzIG5vdCB2aXNpYmxlXG5cdC8vIC0gSWYgY3JlYXRlIGlzIHN0YXRpY2FsbHkgaGlkZGVuIC0+IGNyZWF0ZSBpcyBub3QgdmlzaWJsZVxuXHQvLyAtIElmIGl0J3MgYW4gQUxQIHRlbXBsYXRlIC0+IGNyZWF0ZSBpcyBub3QgdmlzaWJsZVxuXHQvLyAtXG5cdC8vIC0gT3RoZXJ3aXNlXG5cdC8vIFx0IC0gSWYgdGhlIGNyZWF0ZSBtb2RlIGlzIGV4dGVybmFsIC0+IGNyZWF0ZSBpcyB2aXNpYmxlXG5cdC8vIFx0IC0gSWYgd2UncmUgb24gdGhlIGxpc3QgcmVwb3J0IC0+XG5cdC8vIFx0IFx0LSBJZiBVSS5DcmVhdGVIaWRkZW4gcG9pbnRzIHRvIGEgcHJvcGVydHkgcGF0aCAtPiBwcm92aWRlIGEgbmVnYXRlZCBiaW5kaW5nIHRvIHRoaXMgcGF0aFxuXHQvLyBcdCBcdC0gT3RoZXJ3aXNlLCBjcmVhdGUgaXMgdmlzaWJsZVxuXHQvLyBcdCAtIE90aGVyd2lzZVxuXHQvLyBcdCAgIC0gVGhpcyBkZXBlbmRzIG9uIHRoZSB2YWx1ZSBvZiB0aGUgdGhlIFVJLklzRWRpdGFibGVcblx0cmV0dXJuIGlmRWxzZShcblx0XHRvcihcblx0XHRcdG9yKFxuXHRcdFx0XHRlcXVhbChzaG93Q3JlYXRlRm9yTmV3QWN0aW9uLCBmYWxzZSksXG5cdFx0XHRcdGFuZChpc0NvbnN0YW50KGlzSW5zZXJ0YWJsZSksIGVxdWFsKGlzSW5zZXJ0YWJsZSwgZmFsc2UpLCBlcXVhbChzaG93Q3JlYXRlRm9yTmV3QWN0aW9uLCB1bmRlZmluZWQpKVxuXHRcdFx0KSxcblx0XHRcdGlzQ29uc3RhbnQoaXNDcmVhdGVIaWRkZW4pICYmIGVxdWFsKGlzQ3JlYXRlSGlkZGVuLCB0cnVlKSxcblx0XHRcdG9yKFxuXHRcdFx0XHR2aWV3Q29uZmlndXJhdGlvbiA/IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCkuaGFzTXVsdGlwbGVWaXN1YWxpemF0aW9ucyh2aWV3Q29uZmlndXJhdGlvbikgOiBmYWxzZSxcblx0XHRcdFx0Y29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gVGVtcGxhdGVUeXBlLkFuYWx5dGljYWxMaXN0UGFnZVxuXHRcdFx0KVxuXHRcdCksXG5cdFx0ZmFsc2UsXG5cdFx0aWZFbHNlKFxuXHRcdFx0Y3JlYXRpb25Nb2RlID09PSBcIkV4dGVybmFsXCIsXG5cdFx0XHR0cnVlLFxuXHRcdFx0aWZFbHNlKFxuXHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBUZW1wbGF0ZVR5cGUuTGlzdFJlcG9ydCxcblx0XHRcdFx0aWZFbHNlKGlzQmluZGluZyhpc0NyZWF0ZUhpZGRlbiksIG5vdChpc0NyZWF0ZUhpZGRlbiksIHRydWUpLFxuXHRcdFx0XHRhbmQobm90KGlzQ3JlYXRlSGlkZGVuKSwgVUkuSXNFZGl0YWJsZSlcblx0XHRcdClcblx0XHQpXG5cdCk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgdmlzaWJpbGl0eSBmb3IgdGhlIFBhc3RlIGJ1dHRvbi5cbiAqXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dCBUaGUgaW5zdGFuY2Ugb2YgdGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcGFyYW0gY3JlYXRpb25CZWhhdmlvdXIgVGhlIGNob3NlbiBiZWhhdmlvciBvZiBjcmVhdGlvblxuICogQHBhcmFtIGlzSW5zZXJ0YWJsZSBUaGUgZXhwcmVzc2lvbiB3aGljaCBkZW5vdGVzIGluc2VydCByZXN0cmljdGlvbnNcbiAqIEBwYXJhbSBwYXN0ZUVuYWJsZWRJbk1hbmlmZXN0IFRoZSBmbGFnIHdoaWNoIGRlbm90ZXMgdGhlIHBhc3RlIGVuYWJsZW1lbnQgc3RhdHVzIHZpYSBtYW5pZmVzdFxuICogQHBhcmFtIHZpZXdDb25maWd1cmF0aW9uIFRoZSBpbnN0YW5jZSBvZiB0aGUgY29uZmlndXJhdGlvbiBmb3IgdGhlIHZpZXcgcGF0aFxuICogQHJldHVybnMge0V4cHJlc3Npb248Ym9vbGVhbj59IEV4cHJlc3Npb24gb3IgQm9vbGVhbiB2YWx1ZSBvZiB0aGUgVUkuQ3JlYXRlSGlkZGVuIGFubm90YXRpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFBhc3RlRW5hYmxlZChcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0Y3JlYXRpb25CZWhhdmlvdXI6IFRhYmxlQW5ub3RhdGlvbkNvbmZpZ3VyYXRpb25bXCJjcmVhdGVcIl0sXG5cdGlzSW5zZXJ0YWJsZTogRXhwcmVzc2lvbjxib29sZWFuPixcblx0cGFzdGVFbmFibGVkSW5NYW5pZmVzdDogYm9vbGVhbixcblx0dmlld0NvbmZpZ3VyYXRpb24/OiBWaWV3UGF0aENvbmZpZ3VyYXRpb25cbik6IEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHQvLyBJZiBjcmVhdGUgaXMgbm90IHZpc2libGUgLT4gaXQncyBub3QgZW5hYmxlZFxuXHQvLyBJZiBjcmVhdGUgaXMgdmlzaWJsZSAtPlxuXHQvLyBcdCBJZiBpdCdzIGluIHRoZSBMaXN0UmVwb3J0IC0+IG5vdCBlbmFibGVkXG5cdC8vXHQgSWYgaXQncyBpbnNlcnRhYmxlIC0+IGVuYWJsZWRcblx0cmV0dXJuIGlmRWxzZShcblx0XHRwYXN0ZUVuYWJsZWRJbk1hbmlmZXN0ICYmIGVxdWFsKGdldENyZWF0ZVZpc2libGUoY29udmVydGVyQ29udGV4dCwgY3JlYXRpb25CZWhhdmlvdXIubW9kZSwgaXNJbnNlcnRhYmxlLCB2aWV3Q29uZmlndXJhdGlvbiksIHRydWUpLFxuXHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFRlbXBsYXRlVHlwZS5PYmplY3RQYWdlICYmIGlzSW5zZXJ0YWJsZSxcblx0XHRmYWxzZVxuXHQpO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBKU09OIHN0cmluZyBjb250YWluaW5nIHRoZSBzb3J0IGNvbmRpdGlvbnMgZm9yIHRoZSBwcmVzZW50YXRpb24gdmFyaWFudC5cbiAqXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dCBUaGUgaW5zdGFuY2Ugb2YgdGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcGFyYW0ge1ByZXNlbnRhdGlvblZhcmlhbnRUeXBlVHlwZXMgfCB1bmRlZmluZWR9IHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uIFByZXNlbnRhdGlvbiB2YXJpYW50IGFubm90YXRpb25cbiAqIEBwYXJhbSBjb2x1bW5zIFRhYmxlIGNvbHVtbnMgcHJvY2Vzc2VkIGJ5IHRoZSBjb252ZXJ0ZXJcbiAqIEByZXR1cm5zIHtzdHJpbmcgfCB1bmRlZmluZWR9IFNvcnQgY29uZGl0aW9ucyBmb3IgYSBwcmVzZW50YXRpb24gdmFyaWFudC5cbiAqL1xuZnVuY3Rpb24gZ2V0U29ydENvbmRpdGlvbnMoXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uOiBQcmVzZW50YXRpb25WYXJpYW50VHlwZVR5cGVzIHwgdW5kZWZpbmVkLFxuXHRjb2x1bW5zOiBUYWJsZUNvbHVtbltdXG4pOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXHQvLyBDdXJyZW50bHkgbmF2aWdhdGlvbiBwcm9wZXJ0eSBpcyBub3Qgc3VwcG9ydGVkIGFzIHNvcnRlclxuXHRjb25zdCBub25Tb3J0YWJsZVByb3BlcnRpZXMgPSBnZXROb25Tb3J0YWJsZVByb3BlcnRpZXNSZXN0cmljdGlvbnMoY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKSk7XG5cdGxldCBzb3J0Q29uZGl0aW9uczogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXHRpZiAocHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24/LlNvcnRPcmRlcikge1xuXHRcdGNvbnN0IHNvcnRlcnM6IFNvcnRlclR5cGVbXSA9IFtdO1xuXHRcdGNvbnN0IGNvbmRpdGlvbnMgPSB7XG5cdFx0XHRzb3J0ZXJzOiBzb3J0ZXJzXG5cdFx0fTtcblx0XHRwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbi5Tb3J0T3JkZXIuZm9yRWFjaChjb25kaXRpb24gPT4ge1xuXHRcdFx0Y29uc3QgY29uZGl0aW9uUHJvcGVydHkgPSBjb25kaXRpb24uUHJvcGVydHk7XG5cdFx0XHRpZiAoY29uZGl0aW9uUHJvcGVydHkgJiYgbm9uU29ydGFibGVQcm9wZXJ0aWVzLmluZGV4T2YoY29uZGl0aW9uUHJvcGVydHkuJHRhcmdldD8ubmFtZSkgPT09IC0xKSB7XG5cdFx0XHRcdGNvbnN0IGluZm9OYW1lID0gY29udmVydFByb3BlcnR5UGF0aHNUb0luZm9OYW1lcyhbY29uZGl0aW9uUHJvcGVydHldLCBjb2x1bW5zKVswXTtcblx0XHRcdFx0aWYgKGluZm9OYW1lKSB7XG5cdFx0XHRcdFx0Y29uZGl0aW9ucy5zb3J0ZXJzLnB1c2goe1xuXHRcdFx0XHRcdFx0bmFtZTogaW5mb05hbWUsXG5cdFx0XHRcdFx0XHRkZXNjZW5kaW5nOiAhIWNvbmRpdGlvbi5EZXNjZW5kaW5nXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0XHRzb3J0Q29uZGl0aW9ucyA9IGNvbmRpdGlvbnMuc29ydGVycy5sZW5ndGggPyBKU09OLnN0cmluZ2lmeShjb25kaXRpb25zKSA6IHVuZGVmaW5lZDtcblx0fVxuXHRyZXR1cm4gc29ydENvbmRpdGlvbnM7XG59XG5cbi8qKlxuICogQ29udmVydHMgYW4gYXJyYXkgb2YgcHJvcGVydHlQYXRoIHRvIGFuIGFycmF5IG9mIHByb3BlcnR5SW5mbyBuYW1lcy5cbiAqXG4gKiBAcGFyYW0gcGF0aHMgdGhlIGFycmF5IHRvIGJlIGNvbnZlcnRlZFxuICogQHBhcmFtIGNvbHVtbnMgdGhlIGFycmF5IG9mIHByb3BlcnR5SW5mb3NcbiAqIEByZXR1cm5zIGFuIGFycmF5IG9mIHByb3BlcnR5SW5mbyBuYW1lc1xuICovXG5cbmZ1bmN0aW9uIGNvbnZlcnRQcm9wZXJ0eVBhdGhzVG9JbmZvTmFtZXMocGF0aHM6IFByb3BlcnR5UGF0aFtdLCBjb2x1bW5zOiBUYWJsZUNvbHVtbltdKTogc3RyaW5nW10ge1xuXHRjb25zdCBpbmZvTmFtZXM6IHN0cmluZ1tdID0gW107XG5cdHBhdGhzLmZvckVhY2goY3VycmVudFBhdGggPT4ge1xuXHRcdGlmIChjdXJyZW50UGF0aD8uJHRhcmdldD8ubmFtZSkge1xuXHRcdFx0Y29uc3QgcHJvcGVydHlJbmZvID0gY29sdW1ucy5maW5kKGNvbHVtbiA9PiB7XG5cdFx0XHRcdGNvbnN0IGFubm90YXRpb25Db2x1bW4gPSBjb2x1bW4gYXMgQW5ub3RhdGlvblRhYmxlQ29sdW1uO1xuXHRcdFx0XHRyZXR1cm4gIWFubm90YXRpb25Db2x1bW4ucHJvcGVydHlJbmZvcyAmJiBhbm5vdGF0aW9uQ29sdW1uLnJlbGF0aXZlUGF0aCA9PT0gY3VycmVudFBhdGg/LiR0YXJnZXQ/Lm5hbWU7XG5cdFx0XHR9KTtcblx0XHRcdGlmIChwcm9wZXJ0eUluZm8pIHtcblx0XHRcdFx0aW5mb05hbWVzLnB1c2gocHJvcGVydHlJbmZvLm5hbWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0cmV0dXJuIGluZm9OYW1lcztcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgSlNPTiBzdHJpbmcgY29udGFpbmluZyBQcmVzZW50YXRpb24gVmFyaWFudCBncm91cCBjb25kaXRpb25zLlxuICpcbiAqIEBwYXJhbSB7UHJlc2VudGF0aW9uVmFyaWFudFR5cGVUeXBlcyB8IHVuZGVmaW5lZH0gcHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24gUHJlc2VudGF0aW9uIHZhcmlhbnQgYW5ub3RhdGlvblxuICogQHBhcmFtIGNvbHVtbnMgQ29udmVydGVyIHByb2Nlc3NlZCB0YWJsZSBjb2x1bW5zXG4gKiBAcmV0dXJucyB7c3RyaW5nIHwgdW5kZWZpbmVkfSBHcm91cCBjb25kaXRpb25zIGZvciBhIFByZXNlbnRhdGlvbiB2YXJpYW50LlxuICovXG5mdW5jdGlvbiBnZXRHcm91cENvbmRpdGlvbnMoXG5cdHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uOiBQcmVzZW50YXRpb25WYXJpYW50VHlwZVR5cGVzIHwgdW5kZWZpbmVkLFxuXHRjb2x1bW5zOiBUYWJsZUNvbHVtbltdXG4pOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXHRsZXQgZ3JvdXBDb25kaXRpb25zOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cdGlmIChwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbj8uR3JvdXBCeSkge1xuXHRcdGNvbnN0IGFHcm91cEJ5ID0gcHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24uR3JvdXBCeSBhcyBQcm9wZXJ0eVBhdGhbXTtcblx0XHRjb25zdCBhR3JvdXBMZXZlbHMgPSBjb252ZXJ0UHJvcGVydHlQYXRoc1RvSW5mb05hbWVzKGFHcm91cEJ5LCBjb2x1bW5zKS5tYXAoaW5mb05hbWUgPT4ge1xuXHRcdFx0cmV0dXJuIHsgbmFtZTogaW5mb05hbWUgfTtcblx0XHR9KTtcblxuXHRcdGdyb3VwQ29uZGl0aW9ucyA9IGFHcm91cExldmVscy5sZW5ndGggPyBKU09OLnN0cmluZ2lmeSh7IGdyb3VwTGV2ZWxzOiBhR3JvdXBMZXZlbHMgfSkgOiB1bmRlZmluZWQ7XG5cdH1cblx0cmV0dXJuIGdyb3VwQ29uZGl0aW9ucztcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgSlNPTiBzdHJpbmcgY29udGFpbmluZyBQcmVzZW50YXRpb24gVmFyaWFudCBhZ2dyZWdhdGUgY29uZGl0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge1ByZXNlbnRhdGlvblZhcmlhbnRUeXBlVHlwZXMgfCB1bmRlZmluZWR9IHByZXNlbnRhdGlvblZhcmlhbnRBbm5vdGF0aW9uIFByZXNlbnRhdGlvbiB2YXJpYW50IGFubm90YXRpb25cbiAqIEBwYXJhbSBjb2x1bW5zIENvbnZlcnRlciBwcm9jZXNzZWQgdGFibGUgY29sdW1uc1xuICogQHJldHVybnMge3N0cmluZyB8IHVuZGVmaW5lZH0gR3JvdXAgY29uZGl0aW9ucyBmb3IgYSBQcmVzZW50YXRpb24gdmFyaWFudC5cbiAqL1xuZnVuY3Rpb24gZ2V0QWdncmVnYXRlQ29uZGl0aW9ucyhcblx0cHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb246IFByZXNlbnRhdGlvblZhcmlhbnRUeXBlVHlwZXMgfCB1bmRlZmluZWQsXG5cdGNvbHVtbnM6IFRhYmxlQ29sdW1uW11cbik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdGxldCBhZ2dyZWdhdGVDb25kaXRpb25zOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cdGlmIChwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbj8uVG90YWwpIHtcblx0XHRjb25zdCBhVG90YWxzID0gcHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24uVG90YWwgYXMgUHJvcGVydHlQYXRoW107XG5cdFx0Y29uc3QgYWdncmVnYXRlczogUmVjb3JkPHN0cmluZywgb2JqZWN0PiA9IHt9O1xuXHRcdGNvbnZlcnRQcm9wZXJ0eVBhdGhzVG9JbmZvTmFtZXMoYVRvdGFscywgY29sdW1ucykuZm9yRWFjaChpbmZvTmFtZSA9PiB7XG5cdFx0XHRhZ2dyZWdhdGVzW2luZm9OYW1lXSA9IHt9O1xuXHRcdH0pO1xuXG5cdFx0YWdncmVnYXRlQ29uZGl0aW9ucyA9IEpTT04uc3RyaW5naWZ5KGFnZ3JlZ2F0ZXMpO1xuXHR9XG5cblx0cmV0dXJuIGFnZ3JlZ2F0ZUNvbmRpdGlvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUYWJsZUFubm90YXRpb25Db25maWd1cmF0aW9uKFxuXHRsaW5lSXRlbUFubm90YXRpb246IExpbmVJdGVtIHwgdW5kZWZpbmVkLFxuXHR2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHR0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbjogVGFibGVDb250cm9sQ29uZmlndXJhdGlvbixcblx0Y29sdW1uczogVGFibGVDb2x1bW5bXSxcblx0cHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24/OiBQcmVzZW50YXRpb25WYXJpYW50VHlwZVR5cGVzLFxuXHR2aWV3Q29uZmlndXJhdGlvbj86IFZpZXdQYXRoQ29uZmlndXJhdGlvblxuKTogVGFibGVBbm5vdGF0aW9uQ29uZmlndXJhdGlvbiB7XG5cdC8vIE5lZWQgdG8gZ2V0IHRoZSB0YXJnZXRcblx0Y29uc3QgeyBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoIH0gPSBzcGxpdFBhdGgodmlzdWFsaXphdGlvblBhdGgpO1xuXHRjb25zdCB0aXRsZTogYW55ID0gY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCkudGFyZ2V0RW50aXR5VHlwZS5hbm5vdGF0aW9ucz8uVUk/LkhlYWRlckluZm8/LlR5cGVOYW1lUGx1cmFsO1xuXHRjb25zdCBlbnRpdHlTZXQgPSBjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKS50YXJnZXRFbnRpdHlTZXQ7XG5cdGNvbnN0IHBhZ2VNYW5pZmVzdFNldHRpbmdzOiBNYW5pZmVzdFdyYXBwZXIgPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpO1xuXHRjb25zdCBoYXNBYnNvbHV0ZVBhdGggPSBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLmxlbmd0aCA9PT0gMCxcblx0XHRwMTNuTW9kZTogc3RyaW5nIHwgdW5kZWZpbmVkID0gZ2V0UDEzbk1vZGUodmlzdWFsaXphdGlvblBhdGgsIGNvbnZlcnRlckNvbnRleHQsIHRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uKSxcblx0XHRpZCA9IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGggPyBUYWJsZUlEKHZpc3VhbGl6YXRpb25QYXRoKSA6IFRhYmxlSUQoY29udmVydGVyQ29udGV4dC5nZXRDb250ZXh0UGF0aCgpLCBcIkxpbmVJdGVtXCIpO1xuXHRjb25zdCB0YXJnZXRDYXBhYmlsaXRpZXMgPSBnZXRDYXBhYmlsaXR5UmVzdHJpY3Rpb24oY29udmVydGVyQ29udGV4dCk7XG5cdGNvbnN0IGlzRGVsZXRlQnV0dG9uVmlzaWJsZSA9IGdldERlbGV0ZVZpc2libGUoXG5cdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLFxuXHRcdHRhcmdldENhcGFiaWxpdGllcy5pc0RlbGV0YWJsZSxcblx0XHR2aWV3Q29uZmlndXJhdGlvblxuXHQpO1xuXHRjb25zdCBzZWxlY3Rpb25Nb2RlID0gZ2V0U2VsZWN0aW9uTW9kZShcblx0XHRsaW5lSXRlbUFubm90YXRpb24sXG5cdFx0dmlzdWFsaXphdGlvblBhdGgsXG5cdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRoYXNBYnNvbHV0ZVBhdGgsXG5cdFx0dGFyZ2V0Q2FwYWJpbGl0aWVzLFxuXHRcdGlzRGVsZXRlQnV0dG9uVmlzaWJsZVxuXHQpO1xuXHRsZXQgdGhyZXNob2xkID0gbmF2aWdhdGlvblByb3BlcnR5UGF0aCA/IDEwIDogMzA7XG5cdGlmIChwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbj8uTWF4SXRlbXMpIHtcblx0XHR0aHJlc2hvbGQgPSBwcmVzZW50YXRpb25WYXJpYW50QW5ub3RhdGlvbi5NYXhJdGVtcy52YWx1ZU9mKCkgYXMgbnVtYmVyO1xuXHR9XG5cdGNvbnN0IG5hdmlnYXRpb25UYXJnZXRQYXRoID0gZ2V0TmF2aWdhdGlvblRhcmdldFBhdGgoY29udmVydGVyQ29udGV4dCwgbmF2aWdhdGlvblByb3BlcnR5UGF0aCk7XG5cdGNvbnN0IG5hdmlnYXRpb25TZXR0aW5ncyA9IHBhZ2VNYW5pZmVzdFNldHRpbmdzLmdldE5hdmlnYXRpb25Db25maWd1cmF0aW9uKG5hdmlnYXRpb25UYXJnZXRQYXRoKTtcblx0Y29uc3QgY3JlYXRpb25CZWhhdmlvdXIgPSBfZ2V0Q3JlYXRpb25CZWhhdmlvdXIobGluZUl0ZW1Bbm5vdGF0aW9uLCB0YWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbiwgY29udmVydGVyQ29udGV4dCwgbmF2aWdhdGlvblNldHRpbmdzKTtcblx0bGV0IGlzUGFyZW50RGVsZXRhYmxlOiBhbnksIHBhcmVudEVudGl0eVNldERlbGV0YWJsZTtcblx0aWYgKGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFRlbXBsYXRlVHlwZS5PYmplY3RQYWdlKSB7XG5cdFx0aXNQYXJlbnREZWxldGFibGUgPSBpc1BhdGhEZWxldGFibGUoY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCksIHVuZGVmaW5lZCwgdHJ1ZSk7XG5cdFx0aWYgKGlzUGFyZW50RGVsZXRhYmxlPy5jdXJyZW50RW50aXR5UmVzdHJpY3Rpb24pIHtcblx0XHRcdHBhcmVudEVudGl0eVNldERlbGV0YWJsZSA9IHVuZGVmaW5lZDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cGFyZW50RW50aXR5U2V0RGVsZXRhYmxlID0gaXNQYXJlbnREZWxldGFibGUgPyBjb21waWxlQmluZGluZyhpc1BhcmVudERlbGV0YWJsZSwgdHJ1ZSkgOiBpc1BhcmVudERlbGV0YWJsZTtcblx0XHR9XG5cdH1cblx0Y29uc3QgZGF0YU1vZGVsT2JqZWN0UGF0aCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpO1xuXHRjb25zdCBpc0luc2VydGFibGU6IEV4cHJlc3Npb248Ym9vbGVhbj4gPSBpc1BhdGhJbnNlcnRhYmxlKGRhdGFNb2RlbE9iamVjdFBhdGgpO1xuXHRjb25zdCB2YXJpYW50TWFuYWdlbWVudDogVmFyaWFudE1hbmFnZW1lbnRUeXBlID0gcGFnZU1hbmlmZXN0U2V0dGluZ3MuZ2V0VmFyaWFudE1hbmFnZW1lbnQoKTtcblx0Y29uc3QgYk1hc3NFZGl0VmlzaWJsZTogYW55ID0gZ2V0VmlzaWJpbGl0eU1hc3NFZGl0KGNvbnZlcnRlckNvbnRleHQsIHRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uLCB0YXJnZXRDYXBhYmlsaXRpZXMsIHNlbGVjdGlvbk1vZGUpO1xuXHRjb25zdCBpc1NlYXJjaGFibGUgPSBpc1BhdGhTZWFyY2hhYmxlKGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpKTtcblxuXHRyZXR1cm4ge1xuXHRcdGlkOiBpZCxcblx0XHRlbnRpdHlOYW1lOiBlbnRpdHlTZXQgPyBlbnRpdHlTZXQubmFtZSA6IFwiXCIsXG5cdFx0Y29sbGVjdGlvbjogZ2V0VGFyZ2V0T2JqZWN0UGF0aChjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKSksXG5cdFx0bmF2aWdhdGlvblBhdGg6IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgsXG5cdFx0cm93OiBfZ2V0Um93Q29uZmlndXJhdGlvblByb3BlcnR5KFxuXHRcdFx0bGluZUl0ZW1Bbm5vdGF0aW9uLFxuXHRcdFx0dmlzdWFsaXphdGlvblBhdGgsXG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdFx0bmF2aWdhdGlvblNldHRpbmdzLFxuXHRcdFx0bmF2aWdhdGlvblRhcmdldFBhdGhcblx0XHQpLFxuXHRcdHAxM25Nb2RlOiBwMTNuTW9kZSxcblx0XHRzaG93OiB7XG5cdFx0XHRcImRlbGV0ZVwiOiBjb21waWxlQmluZGluZyhpc0RlbGV0ZUJ1dHRvblZpc2libGUpLFxuXHRcdFx0Y3JlYXRlOiBjb21waWxlQmluZGluZyhnZXRDcmVhdGVWaXNpYmxlKGNvbnZlcnRlckNvbnRleHQsIGNyZWF0aW9uQmVoYXZpb3VyPy5tb2RlLCBpc0luc2VydGFibGUpKSxcblx0XHRcdHBhc3RlOiBjb21waWxlQmluZGluZyhcblx0XHRcdFx0Z2V0UGFzdGVFbmFibGVkKFxuXHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHQsXG5cdFx0XHRcdFx0Y3JlYXRpb25CZWhhdmlvdXIsXG5cdFx0XHRcdFx0aXNJbnNlcnRhYmxlLFxuXHRcdFx0XHRcdHRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uLmVuYWJsZVBhc3RlLFxuXHRcdFx0XHRcdHZpZXdDb25maWd1cmF0aW9uXG5cdFx0XHRcdClcblx0XHRcdCksXG5cdFx0XHRtYXNzRWRpdDoge1xuXHRcdFx0XHR2aXNpYmxlOiBiTWFzc0VkaXRWaXNpYmxlLFxuXHRcdFx0XHRlbmFibGVkOiBnZXRFbmFibGVtZW50TWFzc0VkaXQoY29udmVydGVyQ29udGV4dCwgYk1hc3NFZGl0VmlzaWJsZSlcblx0XHRcdH1cblx0XHR9LFxuXHRcdGRpc3BsYXlNb2RlOiBpc0luRGlzcGxheU1vZGUoY29udmVydGVyQ29udGV4dCwgdmlld0NvbmZpZ3VyYXRpb24pLFxuXHRcdGNyZWF0ZTogY3JlYXRpb25CZWhhdmlvdXIsXG5cdFx0c2VsZWN0aW9uTW9kZTogc2VsZWN0aW9uTW9kZSxcblx0XHRhdXRvQmluZE9uSW5pdDpcblx0XHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgIT09IFRlbXBsYXRlVHlwZS5MaXN0UmVwb3J0ICYmXG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpICE9PSBUZW1wbGF0ZVR5cGUuQW5hbHl0aWNhbExpc3RQYWdlICYmXG5cdFx0XHQhKHZpZXdDb25maWd1cmF0aW9uICYmIGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCkuaGFzTXVsdGlwbGVWaXN1YWxpemF0aW9ucyh2aWV3Q29uZmlndXJhdGlvbikpLFxuXHRcdHZhcmlhbnRNYW5hZ2VtZW50OiB2YXJpYW50TWFuYWdlbWVudCA9PT0gXCJDb250cm9sXCIgJiYgIXAxM25Nb2RlID8gVmFyaWFudE1hbmFnZW1lbnRUeXBlLk5vbmUgOiB2YXJpYW50TWFuYWdlbWVudCxcblx0XHR0aHJlc2hvbGQ6IHRocmVzaG9sZCxcblx0XHRzb3J0Q29uZGl0aW9uczogZ2V0U29ydENvbmRpdGlvbnMoY29udmVydGVyQ29udGV4dCwgcHJlc2VudGF0aW9uVmFyaWFudEFubm90YXRpb24sIGNvbHVtbnMpLFxuXHRcdHBhcmVudEVudGl0eURlbGV0ZUVuYWJsZWQ6IHBhcmVudEVudGl0eVNldERlbGV0YWJsZSxcblx0XHR0aXRsZTogdGl0bGUsXG5cdFx0c2VhcmNoYWJsZTogdGFibGVNYW5pZmVzdENvbmZpZ3VyYXRpb24udHlwZSAhPT0gXCJBbmFseXRpY2FsVGFibGVcIiAmJiAhKGlzQ29uc3RhbnQoaXNTZWFyY2hhYmxlKSAmJiBpc1NlYXJjaGFibGUudmFsdWUgPT09IGZhbHNlKVxuXHR9O1xufVxuXG5mdW5jdGlvbiBfZ2V0RXhwb3J0RGF0YVR5cGUoZGF0YVR5cGU6IHN0cmluZywgaXNDb21wbGV4UHJvcGVydHk6IGJvb2xlYW4gPSBmYWxzZSk6IHN0cmluZyB7XG5cdGxldCBleHBvcnREYXRhVHlwZTogc3RyaW5nID0gXCJTdHJpbmdcIjtcblx0aWYgKGlzQ29tcGxleFByb3BlcnR5KSB7XG5cdFx0cmV0dXJuIGV4cG9ydERhdGFUeXBlO1xuXHR9IGVsc2Uge1xuXHRcdHN3aXRjaCAoZGF0YVR5cGUpIHtcblx0XHRcdGNhc2UgXCJFZG0uRGVjaW1hbFwiOlxuXHRcdFx0Y2FzZSBcIkVkbS5JbnQzMlwiOlxuXHRcdFx0Y2FzZSBcIkVkbS5JbnQ2NFwiOlxuXHRcdFx0Y2FzZSBcIkVkbS5Eb3VibGVcIjpcblx0XHRcdGNhc2UgXCJFZG0uQnl0ZVwiOlxuXHRcdFx0XHRleHBvcnREYXRhVHlwZSA9IFwiTnVtYmVyXCI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcIkVkbS5EYXRlT2ZUaW1lXCI6XG5cdFx0XHRjYXNlIFwiRWRtLkRhdGVcIjpcblx0XHRcdFx0ZXhwb3J0RGF0YVR5cGUgPSBcIkRhdGVcIjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiRWRtLkRhdGVUaW1lT2Zmc2V0XCI6XG5cdFx0XHRcdGV4cG9ydERhdGFUeXBlID0gXCJEYXRlVGltZVwiO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJFZG0uVGltZU9mRGF5XCI6XG5cdFx0XHRcdGV4cG9ydERhdGFUeXBlID0gXCJUaW1lXCI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcIkVkbS5Cb29sZWFuXCI6XG5cdFx0XHRcdGV4cG9ydERhdGFUeXBlID0gXCJCb29sZWFuXCI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0ZXhwb3J0RGF0YVR5cGUgPSBcIlN0cmluZ1wiO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gZXhwb3J0RGF0YVR5cGU7XG59XG5cbmZ1bmN0aW9uIGlzSW5EaXNwbGF5TW9kZShjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LCB2aWV3Q29uZmlndXJhdGlvbj86IFZpZXdQYXRoQ29uZmlndXJhdGlvbik6IGJvb2xlYW4ge1xuXHRjb25zdCB0ZW1wbGF0ZVR5cGUgPSBjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpO1xuXHRpZiAoXG5cdFx0dGVtcGxhdGVUeXBlID09PSBUZW1wbGF0ZVR5cGUuTGlzdFJlcG9ydCB8fFxuXHRcdHRlbXBsYXRlVHlwZSA9PT0gVGVtcGxhdGVUeXBlLkFuYWx5dGljYWxMaXN0UGFnZSB8fFxuXHRcdCh2aWV3Q29uZmlndXJhdGlvbiAmJiBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpLmhhc011bHRpcGxlVmlzdWFsaXphdGlvbnModmlld0NvbmZpZ3VyYXRpb24pKVxuXHQpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHQvLyB1cGRhdGFibGUgd2lsbCBiZSBoYW5kbGVkIGF0IHRoZSBwcm9wZXJ0eSBsZXZlbFxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogU3BsaXQgdGhlIHZpc3VhbGl6YXRpb24gcGF0aCBpbnRvIHRoZSBuYXZpZ2F0aW9uIHByb3BlcnR5IHBhdGggYW5kIGFubm90YXRpb24uXG4gKlxuICogQHBhcmFtIHZpc3VhbGl6YXRpb25QYXRoXG4gKiBAcmV0dXJucyB7b2JqZWN0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gc3BsaXRQYXRoKHZpc3VhbGl6YXRpb25QYXRoOiBzdHJpbmcpIHtcblx0bGV0IFtuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLCBhbm5vdGF0aW9uUGF0aF0gPSB2aXN1YWxpemF0aW9uUGF0aC5zcGxpdChcIkBcIik7XG5cblx0aWYgKG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGFzdEluZGV4T2YoXCIvXCIpID09PSBuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLmxlbmd0aCAtIDEpIHtcblx0XHQvLyBEcm9wIHRyYWlsaW5nIHNsYXNoXG5cdFx0bmF2aWdhdGlvblByb3BlcnR5UGF0aCA9IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGguc3Vic3RyKDAsIG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGVuZ3RoIC0gMSk7XG5cdH1cblx0cmV0dXJuIHsgbmF2aWdhdGlvblByb3BlcnR5UGF0aCwgYW5ub3RhdGlvblBhdGggfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNlbGVjdGlvblZhcmlhbnRDb25maWd1cmF0aW9uKFxuXHRzZWxlY3Rpb25WYXJpYW50UGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBTZWxlY3Rpb25WYXJpYW50Q29uZmlndXJhdGlvbiB8IHVuZGVmaW5lZCB7XG5cdGNvbnN0IHJlc29sdmVkVGFyZ2V0ID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlQW5ub3RhdGlvbihzZWxlY3Rpb25WYXJpYW50UGF0aCk7XG5cdGNvbnN0IHNlbGVjdGlvbjogU2VsZWN0aW9uVmFyaWFudFR5cGUgPSByZXNvbHZlZFRhcmdldC5hbm5vdGF0aW9uIGFzIFNlbGVjdGlvblZhcmlhbnRUeXBlO1xuXG5cdGlmIChzZWxlY3Rpb24pIHtcblx0XHRjb25zdCBwcm9wZXJ0eU5hbWVzOiBzdHJpbmdbXSA9IFtdO1xuXHRcdHNlbGVjdGlvbi5TZWxlY3RPcHRpb25zPy5mb3JFYWNoKChzZWxlY3RPcHRpb246IFNlbGVjdE9wdGlvblR5cGUpID0+IHtcblx0XHRcdGNvbnN0IHByb3BlcnR5TmFtZTogYW55ID0gc2VsZWN0T3B0aW9uLlByb3BlcnR5TmFtZTtcblx0XHRcdGNvbnN0IFByb3BlcnR5UGF0aDogc3RyaW5nID0gcHJvcGVydHlOYW1lLnZhbHVlO1xuXHRcdFx0aWYgKHByb3BlcnR5TmFtZXMuaW5kZXhPZihQcm9wZXJ0eVBhdGgpID09PSAtMSkge1xuXHRcdFx0XHRwcm9wZXJ0eU5hbWVzLnB1c2goUHJvcGVydHlQYXRoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGV4dDogc2VsZWN0aW9uPy5UZXh0Py50b1N0cmluZygpLFxuXHRcdFx0cHJvcGVydHlOYW1lczogcHJvcGVydHlOYW1lc1xuXHRcdH07XG5cdH1cblx0cmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRhYmxlTWFuaWZlc3RDb25maWd1cmF0aW9uKFxuXHRsaW5lSXRlbUFubm90YXRpb246IExpbmVJdGVtIHwgdW5kZWZpbmVkLFxuXHR2aXN1YWxpemF0aW9uUGF0aDogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRjaGVja0NvbmRlbnNlZExheW91dDogYm9vbGVhbiA9IGZhbHNlXG4pOiBUYWJsZUNvbnRyb2xDb25maWd1cmF0aW9uIHtcblx0Y29uc3QgdGFibGVNYW5pZmVzdFNldHRpbmdzOiBUYWJsZU1hbmlmZXN0Q29uZmlndXJhdGlvbiA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbih2aXN1YWxpemF0aW9uUGF0aCk7XG5cdGNvbnN0IHRhYmxlU2V0dGluZ3MgPSAodGFibGVNYW5pZmVzdFNldHRpbmdzICYmIHRhYmxlTWFuaWZlc3RTZXR0aW5ncy50YWJsZVNldHRpbmdzKSB8fCB7fTtcblx0bGV0IHF1aWNrU2VsZWN0aW9uVmFyaWFudDogYW55O1xuXHRjb25zdCBxdWlja0ZpbHRlclBhdGhzOiB7IGFubm90YXRpb25QYXRoOiBzdHJpbmcgfVtdID0gW107XG5cdGxldCBlbmFibGVFeHBvcnQgPSB0cnVlO1xuXHRsZXQgY3JlYXRpb25Nb2RlID0gQ3JlYXRpb25Nb2RlLk5ld1BhZ2U7XG5cdGxldCBmaWx0ZXJzO1xuXHRsZXQgY3JlYXRlQXRFbmQgPSB0cnVlO1xuXHRsZXQgZGlzYWJsZUFkZFJvd0J1dHRvbkZvckVtcHR5RGF0YSA9IGZhbHNlO1xuXHRsZXQgY3VzdG9tVmFsaWRhdGlvbkZ1bmN0aW9uO1xuXHRsZXQgY29uZGVuc2VkVGFibGVMYXlvdXQgPSBmYWxzZTtcblx0bGV0IGhpZGVUYWJsZVRpdGxlID0gZmFsc2U7XG5cdGxldCB0YWJsZVR5cGU6IFRhYmxlVHlwZSA9IFwiUmVzcG9uc2l2ZVRhYmxlXCI7XG5cdGxldCBlbmFibGVGdWxsU2NyZWVuID0gZmFsc2U7XG5cdGxldCBzZWxlY3Rpb25MaW1pdCA9IDIwMDtcblx0bGV0IG11bHRpU2VsZWN0TW9kZTtcblx0Y29uc3QgZW5hYmxlQXV0b0NvbHVtbldpZHRoID0gdHJ1ZTtcblx0bGV0IGVuYWJsZVBhc3RlID0gY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gXCJPYmplY3RQYWdlXCI7XG5cdGNvbnN0IGlzQ29uZGVuc2VkVGFibGVMYXlvdXRDb21wbGlhbnQgPSBjaGVja0NvbmRlbnNlZExheW91dCAmJiBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpLmlzQ29uZGVuc2VkTGF5b3V0Q29tcGxpYW50KCk7XG5cdGNvbnN0IGVudGl0eVR5cGUgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGUoKTtcblx0Y29uc3QgYWdncmVnYXRpb25IZWxwZXIgPSBuZXcgQWdncmVnYXRpb25IZWxwZXIoZW50aXR5VHlwZSwgY29udmVydGVyQ29udGV4dCk7XG5cdGlmIChsaW5lSXRlbUFubm90YXRpb24pIHtcblx0XHRjb25zdCB0YXJnZXRFbnRpdHlUeXBlID0gY29udmVydGVyQ29udGV4dC5nZXRBbm5vdGF0aW9uRW50aXR5VHlwZShsaW5lSXRlbUFubm90YXRpb24pO1xuXHRcdHRhYmxlU2V0dGluZ3M/LnF1aWNrVmFyaWFudFNlbGVjdGlvbj8ucGF0aHM/LmZvckVhY2goKHBhdGg6IHsgYW5ub3RhdGlvblBhdGg6IHN0cmluZyB9KSA9PiB7XG5cdFx0XHRxdWlja1NlbGVjdGlvblZhcmlhbnQgPSB0YXJnZXRFbnRpdHlUeXBlLnJlc29sdmVQYXRoKFwiQFwiICsgcGF0aC5hbm5vdGF0aW9uUGF0aCk7XG5cdFx0XHQvLyBxdWlja1NlbGVjdGlvblZhcmlhbnQgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGVBbm5vdGF0aW9uKHBhdGguYW5ub3RhdGlvblBhdGgpO1xuXHRcdFx0aWYgKHF1aWNrU2VsZWN0aW9uVmFyaWFudCkge1xuXHRcdFx0XHRxdWlja0ZpbHRlclBhdGhzLnB1c2goeyBhbm5vdGF0aW9uUGF0aDogcGF0aC5hbm5vdGF0aW9uUGF0aCB9KTtcblx0XHRcdH1cblx0XHRcdGZpbHRlcnMgPSB7XG5cdFx0XHRcdHF1aWNrRmlsdGVyczoge1xuXHRcdFx0XHRcdGVuYWJsZWQ6XG5cdFx0XHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBUZW1wbGF0ZVR5cGUuTGlzdFJlcG9ydFxuXHRcdFx0XHRcdFx0XHQ/IFwiez0gJHtwYWdlSW50ZXJuYWw+aGFzUGVuZGluZ0ZpbHRlcnN9ICE9PSB0cnVlfVwiXG5cdFx0XHRcdFx0XHRcdDogdHJ1ZSxcblx0XHRcdFx0XHRzaG93Q291bnRzOiB0YWJsZVNldHRpbmdzPy5xdWlja1ZhcmlhbnRTZWxlY3Rpb24/LnNob3dDb3VudHMsXG5cdFx0XHRcdFx0cGF0aHM6IHF1aWNrRmlsdGVyUGF0aHNcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9KTtcblx0XHRjcmVhdGlvbk1vZGUgPSB0YWJsZVNldHRpbmdzLmNyZWF0aW9uTW9kZT8ubmFtZSB8fCBjcmVhdGlvbk1vZGU7XG5cdFx0Y3JlYXRlQXRFbmQgPSB0YWJsZVNldHRpbmdzLmNyZWF0aW9uTW9kZT8uY3JlYXRlQXRFbmQgIT09IHVuZGVmaW5lZCA/IHRhYmxlU2V0dGluZ3MuY3JlYXRpb25Nb2RlPy5jcmVhdGVBdEVuZCA6IHRydWU7XG5cdFx0Y3VzdG9tVmFsaWRhdGlvbkZ1bmN0aW9uID0gdGFibGVTZXR0aW5ncy5jcmVhdGlvbk1vZGU/LmN1c3RvbVZhbGlkYXRpb25GdW5jdGlvbjtcblx0XHQvLyBpZiBhIGN1c3RvbSB2YWxpZGF0aW9uIGZ1bmN0aW9uIGlzIHByb3ZpZGVkLCBkaXNhYmxlQWRkUm93QnV0dG9uRm9yRW1wdHlEYXRhIHNob3VsZCBub3QgYmUgY29uc2lkZXJlZCwgaS5lLiBzZXQgdG8gZmFsc2Vcblx0XHRkaXNhYmxlQWRkUm93QnV0dG9uRm9yRW1wdHlEYXRhID0gIWN1c3RvbVZhbGlkYXRpb25GdW5jdGlvbiA/ICEhdGFibGVTZXR0aW5ncy5jcmVhdGlvbk1vZGU/LmRpc2FibGVBZGRSb3dCdXR0b25Gb3JFbXB0eURhdGEgOiBmYWxzZTtcblx0XHRjb25kZW5zZWRUYWJsZUxheW91dCA9IHRhYmxlU2V0dGluZ3MuY29uZGVuc2VkVGFibGVMYXlvdXQgIT09IHVuZGVmaW5lZCA/IHRhYmxlU2V0dGluZ3MuY29uZGVuc2VkVGFibGVMYXlvdXQgOiBmYWxzZTtcblx0XHRoaWRlVGFibGVUaXRsZSA9ICEhdGFibGVTZXR0aW5ncy5xdWlja1ZhcmlhbnRTZWxlY3Rpb24/LmhpZGVUYWJsZVRpdGxlO1xuXHRcdHRhYmxlVHlwZSA9IHRhYmxlU2V0dGluZ3M/LnR5cGUgfHwgXCJSZXNwb25zaXZlVGFibGVcIjtcblx0XHRpZiAoY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSAhPT0gXCJPYmplY3RQYWdlXCIpIHtcblx0XHRcdGlmICh0YWJsZVNldHRpbmdzPy50eXBlID09PSBcIkFuYWx5dGljYWxUYWJsZVwiICYmICFhZ2dyZWdhdGlvbkhlbHBlci5pc0FuYWx5dGljc1N1cHBvcnRlZCgpKSB7XG5cdFx0XHRcdHRhYmxlVHlwZSA9IFwiR3JpZFRhYmxlXCI7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIXRhYmxlU2V0dGluZ3M/LnR5cGUpIHtcblx0XHRcdFx0aWYgKGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCkuaXNEZXNrdG9wKCkgJiYgYWdncmVnYXRpb25IZWxwZXIuaXNBbmFseXRpY3NTdXBwb3J0ZWQoKSkge1xuXHRcdFx0XHRcdHRhYmxlVHlwZSA9IFwiQW5hbHl0aWNhbFRhYmxlXCI7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGFibGVUeXBlID0gXCJSZXNwb25zaXZlVGFibGVcIjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRlbmFibGVGdWxsU2NyZWVuID0gdGFibGVTZXR0aW5ncy5lbmFibGVGdWxsU2NyZWVuIHx8IGZhbHNlO1xuXHRcdGlmIChlbmFibGVGdWxsU2NyZWVuID09PSB0cnVlICYmIGNvbnZlcnRlckNvbnRleHQuZ2V0VGVtcGxhdGVUeXBlKCkgPT09IFRlbXBsYXRlVHlwZS5MaXN0UmVwb3J0KSB7XG5cdFx0XHRlbmFibGVGdWxsU2NyZWVuID0gZmFsc2U7XG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHRcdC5nZXREaWFnbm9zdGljcygpXG5cdFx0XHRcdC5hZGRJc3N1ZShJc3N1ZUNhdGVnb3J5Lk1hbmlmZXN0LCBJc3N1ZVNldmVyaXR5LkxvdywgSXNzdWVUeXBlLkZVTExTQ1JFRU5NT0RFX05PVF9PTl9MSVNUUkVQT1JUKTtcblx0XHR9XG5cdFx0c2VsZWN0aW9uTGltaXQgPSB0YWJsZVNldHRpbmdzLnNlbGVjdEFsbCA9PT0gdHJ1ZSB8fCB0YWJsZVNldHRpbmdzLnNlbGVjdGlvbkxpbWl0ID09PSAwID8gMCA6IHRhYmxlU2V0dGluZ3Muc2VsZWN0aW9uTGltaXQgfHwgMjAwO1xuXHRcdGlmICh0YWJsZVR5cGUgPT09IFwiUmVzcG9uc2l2ZVRhYmxlXCIpIHtcblx0XHRcdGlmIChcblx0XHRcdFx0Y29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gVGVtcGxhdGVUeXBlLkxpc3RSZXBvcnQgfHxcblx0XHRcdFx0Y29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSA9PT0gVGVtcGxhdGVUeXBlLkFuYWx5dGljYWxMaXN0UGFnZVxuXHRcdFx0KSB7XG5cdFx0XHRcdG11bHRpU2VsZWN0TW9kZSA9ICEhdGFibGVTZXR0aW5ncy5zZWxlY3RBbGwgPyBcIkRlZmF1bHRcIiA6IFwiQ2xlYXJBbGxcIjtcblx0XHRcdH1cblx0XHRcdGlmIChjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBUZW1wbGF0ZVR5cGUuT2JqZWN0UGFnZSkge1xuXHRcdFx0XHRpZiAoY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKS51c2VJY29uVGFiQmFyKCkpIHtcblx0XHRcdFx0XHRtdWx0aVNlbGVjdE1vZGUgPSAhIXRhYmxlU2V0dGluZ3Muc2VsZWN0QWxsID8gXCJEZWZhdWx0XCIgOiBcIkNsZWFyQWxsXCI7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bXVsdGlTZWxlY3RNb2RlID0gdGFibGVTZXR0aW5ncy5zZWxlY3RBbGwgPT09IGZhbHNlID8gXCJDbGVhckFsbFwiIDogXCJEZWZhdWx0XCI7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0ZW5hYmxlUGFzdGUgPSBjb252ZXJ0ZXJDb250ZXh0LmdldFRlbXBsYXRlVHlwZSgpID09PSBcIk9iamVjdFBhZ2VcIiAmJiB0YWJsZVNldHRpbmdzLmVuYWJsZVBhc3RlICE9PSBmYWxzZTtcblx0XHRlbmFibGVFeHBvcnQgPVxuXHRcdFx0dGFibGVTZXR0aW5ncy5lbmFibGVFeHBvcnQgIT09IHVuZGVmaW5lZFxuXHRcdFx0XHQ/IHRhYmxlU2V0dGluZ3MuZW5hYmxlRXhwb3J0XG5cdFx0XHRcdDogY29udmVydGVyQ29udGV4dC5nZXRUZW1wbGF0ZVR5cGUoKSAhPT0gXCJPYmplY3RQYWdlXCIgfHwgZW5hYmxlUGFzdGU7XG5cdH1cblx0cmV0dXJuIHtcblx0XHRmaWx0ZXJzOiBmaWx0ZXJzLFxuXHRcdHR5cGU6IHRhYmxlVHlwZSxcblx0XHRlbmFibGVGdWxsU2NyZWVuOiBlbmFibGVGdWxsU2NyZWVuLFxuXHRcdGhlYWRlclZpc2libGU6ICEocXVpY2tTZWxlY3Rpb25WYXJpYW50ICYmIGhpZGVUYWJsZVRpdGxlKSxcblx0XHRlbmFibGVFeHBvcnQ6IGVuYWJsZUV4cG9ydCxcblx0XHRjcmVhdGlvbk1vZGU6IGNyZWF0aW9uTW9kZSxcblx0XHRjcmVhdGVBdEVuZDogY3JlYXRlQXRFbmQsXG5cdFx0ZGlzYWJsZUFkZFJvd0J1dHRvbkZvckVtcHR5RGF0YTogZGlzYWJsZUFkZFJvd0J1dHRvbkZvckVtcHR5RGF0YSxcblx0XHRjdXN0b21WYWxpZGF0aW9uRnVuY3Rpb246IGN1c3RvbVZhbGlkYXRpb25GdW5jdGlvbixcblx0XHR1c2VDb25kZW5zZWRUYWJsZUxheW91dDogY29uZGVuc2VkVGFibGVMYXlvdXQgJiYgaXNDb25kZW5zZWRUYWJsZUxheW91dENvbXBsaWFudCxcblx0XHRzZWxlY3Rpb25MaW1pdDogc2VsZWN0aW9uTGltaXQsXG5cdFx0bXVsdGlTZWxlY3RNb2RlOiBtdWx0aVNlbGVjdE1vZGUsXG5cdFx0ZW5hYmxlUGFzdGU6IGVuYWJsZVBhc3RlLFxuXHRcdHNob3dSb3dDb3VudDpcblx0XHRcdCF0YWJsZVNldHRpbmdzPy5xdWlja1ZhcmlhbnRTZWxlY3Rpb24/LnNob3dDb3VudHMgJiYgIWNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCkuZ2V0Vmlld0NvbmZpZ3VyYXRpb24oKT8uc2hvd0NvdW50cyxcblx0XHRlbmFibGVNYXNzRWRpdDogdGFibGVTZXR0aW5ncz8uZW5hYmxlTWFzc0VkaXQsXG5cdFx0ZW5hYmxlQXV0b0NvbHVtbldpZHRoOiBlbmFibGVBdXRvQ29sdW1uV2lkdGhcblx0fTtcbn1cbiJdfQ==