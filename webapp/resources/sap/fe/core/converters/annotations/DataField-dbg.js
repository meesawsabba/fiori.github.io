/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/templating/UIFormatters", "sap/fe/core/templating/PropertyHelper"], function (UIFormatters, PropertyHelper) {
  "use strict";

  var _exports = {};
  var isProperty = PropertyHelper.isProperty;
  var getAssociatedUnitProperty = PropertyHelper.getAssociatedUnitProperty;
  var getAssociatedCurrencyProperty = PropertyHelper.getAssociatedCurrencyProperty;
  var getDisplayMode = UIFormatters.getDisplayMode;

  /**
   * Identifies if the given dataFieldAbstract that is passed is a "DataFieldForActionAbstract".
   * DataFieldForActionAbstract has an inline action defined.
   *
   * @param {DataFieldAbstractTypes} dataField Data field to be evaluated
   * @returns {boolean} Validates that dataField is a DataFieldForActionAbstractType
   */
  function isDataFieldForActionAbstract(dataField) {
    return dataField.hasOwnProperty("Action");
  }
  /**
   * Identifies if the given dataFieldAbstract that is passed is a "DataField".
   * DataField has a value defined.
   *
   * @param {DataFieldAbstractTypes} dataField Data field to be evaluated
   * @returns {boolean} Validate that dataField is a DataFieldTypes
   */


  _exports.isDataFieldForActionAbstract = isDataFieldForActionAbstract;

  function isDataFieldTypes(dataField) {
    return dataField.hasOwnProperty("Value");
  }
  /**
   * Returns whether given data field has a static hidden annotation.
   *
   * @param {DataFieldAbstractTypes} dataField The datafield to check
   * @returns {boolean} `true` if datafield or referenced property has a static Hidden annotation, false else
   * @private
   */


  _exports.isDataFieldTypes = isDataFieldTypes;

  function isDataFieldAlwaysHidden(dataField) {
    var _dataField$annotation, _dataField$annotation2, _dataField$annotation3, _dataField$Value, _dataField$Value$$tar, _dataField$Value$$tar2, _dataField$Value$$tar3;

    return ((_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : (_dataField$annotation2 = _dataField$annotation.UI) === null || _dataField$annotation2 === void 0 ? void 0 : (_dataField$annotation3 = _dataField$annotation2.Hidden) === null || _dataField$annotation3 === void 0 ? void 0 : _dataField$annotation3.valueOf()) === true || isDataFieldTypes(dataField) && ((_dataField$Value = dataField.Value) === null || _dataField$Value === void 0 ? void 0 : (_dataField$Value$$tar = _dataField$Value.$target) === null || _dataField$Value$$tar === void 0 ? void 0 : (_dataField$Value$$tar2 = _dataField$Value$$tar.annotations) === null || _dataField$Value$$tar2 === void 0 ? void 0 : (_dataField$Value$$tar3 = _dataField$Value$$tar2.UI) === null || _dataField$Value$$tar3 === void 0 ? void 0 : _dataField$Value$$tar3.Hidden) === true;
  }

  _exports.isDataFieldAlwaysHidden = isDataFieldAlwaysHidden;

  function getSemanticObjectPath(converterContext, object) {
    if (typeof object === "object") {
      var _object$Value;

      if (isDataFieldTypes(object) && (_object$Value = object.Value) !== null && _object$Value !== void 0 && _object$Value.$target) {
        var _object$Value2, _property$annotations, _property$annotations2;

        var property = (_object$Value2 = object.Value) === null || _object$Value2 === void 0 ? void 0 : _object$Value2.$target;

        if ((property === null || property === void 0 ? void 0 : (_property$annotations = property.annotations) === null || _property$annotations === void 0 ? void 0 : (_property$annotations2 = _property$annotations.Common) === null || _property$annotations2 === void 0 ? void 0 : _property$annotations2.SemanticObject) !== undefined) {
          return converterContext.getEntitySetBasedAnnotationPath(property === null || property === void 0 ? void 0 : property.fullyQualifiedName);
        }
      } else if (isProperty(object)) {
        var _object$annotations, _object$annotations$C;

        if ((object === null || object === void 0 ? void 0 : (_object$annotations = object.annotations) === null || _object$annotations === void 0 ? void 0 : (_object$annotations$C = _object$annotations.Common) === null || _object$annotations$C === void 0 ? void 0 : _object$annotations$C.SemanticObject) !== undefined) {
          return converterContext.getEntitySetBasedAnnotationPath(object === null || object === void 0 ? void 0 : object.fullyQualifiedName);
        }
      }
    }

    return undefined;
  }
  /**
   * Returns the navigation path prefix for a property path.
   *
   * @param path The property path For e.g. /EntityType/Navigation/Property
   * @returns {string} The navigation path prefix For e.g. /EntityType/Navigation/
   */


  _exports.getSemanticObjectPath = getSemanticObjectPath;

  function _getNavigationPathPrefix(path) {
    return path.indexOf("/") > -1 ? path.substring(0, path.lastIndexOf("/") + 1) : "";
  }
  /**
   * Collect additional properties for the ALP table use-case.
   *
   * For e.g. If UI.Hidden points to a property, include this property in the additionalProperties of ComplexPropertyInfo object.
   * @param target Property or DataField being processed
   * @param navigationPathPrefix Navigation path prefix, applicable in case of navigation properties.
   * @param tableType Table type.
   * @param relatedProperties The related properties identified so far.
   * @returns {ComplexPropertyInfo} The related properties identified.
   */


  function _collectAdditionalPropertiesForAnalyticalTable(target, navigationPathPrefix, tableType, relatedProperties) {
    if (tableType === "AnalyticalTable") {
      var _target$annotations, _target$annotations$U, _hiddenAnnotation$$ta;

      var hiddenAnnotation = (_target$annotations = target.annotations) === null || _target$annotations === void 0 ? void 0 : (_target$annotations$U = _target$annotations.UI) === null || _target$annotations$U === void 0 ? void 0 : _target$annotations$U.Hidden;

      if (hiddenAnnotation !== null && hiddenAnnotation !== void 0 && hiddenAnnotation.path && ((_hiddenAnnotation$$ta = hiddenAnnotation.$target) === null || _hiddenAnnotation$$ta === void 0 ? void 0 : _hiddenAnnotation$$ta._type) === "Property") {
        var hiddenAnnotationPropertyPath = navigationPathPrefix + hiddenAnnotation.path; // This property should be added to additionalProperties map for the ALP table use-case.

        relatedProperties.additionalProperties[hiddenAnnotationPropertyPath] = hiddenAnnotation.$target;
      }
    }

    return relatedProperties;
  }
  /**
   * Collect related properties from a property's annotations.
   *
   * @param path The property path
   * @param property The property to be considered
   * @param converterContext The converter context
   * @param ignoreSelf Whether to exclude the same property from related properties.
   * @param tableType The table type.
   * @param relatedProperties The related properties identified so far.
   * @returns {ComplexPropertyInfo} The related properties identified.
   */


  function collectRelatedProperties(path, property, converterContext, ignoreSelf, tableType) {
    var relatedProperties = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {
      properties: {},
      additionalProperties: {}
    };

    /**
     * Helper to push unique related properties.
     *
     * @param key The property path
     * @param value The properties object containing value property, description property...
     * @returns Index at which the property is available
     */
    function _pushUnique(key, value) {
      if (!relatedProperties.properties.hasOwnProperty(key)) {
        relatedProperties.properties[key] = value;
      }

      return Object.keys(relatedProperties.properties).indexOf(key);
    }
    /**
     * Helper to append the export settings template with a formatted text.
     *
     * @param value Formatted text
     */


    function _appendTemplate(value) {
      relatedProperties.exportSettingsTemplate = relatedProperties.exportSettingsTemplate ? "".concat(relatedProperties.exportSettingsTemplate).concat(value) : "".concat(value);
    }

    if (path && property) {
      var _property$annotations3, _property$annotations4;

      var navigationPathPrefix = _getNavigationPathPrefix(path); // Check for Text annotation.


      var textAnnotation = (_property$annotations3 = property.annotations) === null || _property$annotations3 === void 0 ? void 0 : (_property$annotations4 = _property$annotations3.Common) === null || _property$annotations4 === void 0 ? void 0 : _property$annotations4.Text;
      var valueIndex;
      var targetValue;
      var currencyOrUoMIndex;

      if (relatedProperties.exportSettingsTemplate) {
        // FieldGroup use-case. Need to add each Field in new line.
        _appendTemplate("\n");

        relatedProperties.exportSettingsWrapping = true;
      }

      if (textAnnotation !== null && textAnnotation !== void 0 && textAnnotation.path && textAnnotation !== null && textAnnotation !== void 0 && textAnnotation.$target) {
        // Check for Text Arrangement.
        var dataModelObjectPath = converterContext.getDataModelObjectPath();
        var textAnnotationPropertyPath = navigationPathPrefix + textAnnotation.path;
        var displayMode = getDisplayMode(property, dataModelObjectPath);
        var descriptionIndex;

        switch (displayMode) {
          case "Value":
            valueIndex = _pushUnique(path, property);

            _appendTemplate("{".concat(valueIndex, "}"));

            relatedProperties.visualSettingsToBeExcluded = textAnnotationPropertyPath;
            break;

          case "Description":
            // Keep value when exporting (split mode) on text Arrangement defined as #TextOnly (Only values are expected on paste from Excel functionality)
            _pushUnique(path, property);

            descriptionIndex = _pushUnique(textAnnotationPropertyPath, textAnnotation.$target);

            _appendTemplate("{".concat(descriptionIndex, "}"));

            relatedProperties.visualSettingsToBeExcluded = path;
            break;

          case "ValueDescription":
            valueIndex = _pushUnique(path, property);
            descriptionIndex = _pushUnique(textAnnotationPropertyPath, textAnnotation.$target);

            _appendTemplate("{".concat(valueIndex, "} ({").concat(descriptionIndex, "})"));

            break;

          case "DescriptionValue":
            valueIndex = _pushUnique(path, property);
            descriptionIndex = _pushUnique(textAnnotationPropertyPath, textAnnotation.$target);

            _appendTemplate("{".concat(descriptionIndex, "} ({").concat(valueIndex, "})"));

            break;
        }
      } else {
        var _property$annotations5, _property$annotations6, _property$annotations7, _property$annotations8, _property$Target, _property$Target$$tar, _property$annotations9, _property$annotations10, _property$annotations11, _property$annotations12, _property$annotations13, _property$Target2, _property$Target2$$ta;

        // Check for field containing Currency Or Unit Properties.
        var currencyOrUoMProperty = getAssociatedCurrencyProperty(property) || getAssociatedUnitProperty(property);
        var currencyOrUnitAnnotation = (property === null || property === void 0 ? void 0 : (_property$annotations5 = property.annotations) === null || _property$annotations5 === void 0 ? void 0 : (_property$annotations6 = _property$annotations5.Measures) === null || _property$annotations6 === void 0 ? void 0 : _property$annotations6.ISOCurrency) || (property === null || property === void 0 ? void 0 : (_property$annotations7 = property.annotations) === null || _property$annotations7 === void 0 ? void 0 : (_property$annotations8 = _property$annotations7.Measures) === null || _property$annotations8 === void 0 ? void 0 : _property$annotations8.Unit);

        if (currencyOrUoMProperty && currencyOrUnitAnnotation !== null && currencyOrUnitAnnotation !== void 0 && currencyOrUnitAnnotation.$target) {
          valueIndex = _pushUnique(path, property);
          currencyOrUoMIndex = _pushUnique(currencyOrUoMProperty.name, currencyOrUnitAnnotation.$target);

          _appendTemplate("{".concat(valueIndex, "}  {").concat(currencyOrUoMIndex, "}"));
        } else if ((_property$Target = property.Target) !== null && _property$Target !== void 0 && (_property$Target$$tar = _property$Target.$target) !== null && _property$Target$$tar !== void 0 && _property$Target$$tar.Visualization) {
          var dataPointProperty = property.Target.$target.Value.$target;
          valueIndex = _pushUnique(path, dataPointProperty); // New fake property created for the Rating/Progress Target Value. It'll be used for the export on split mode.

          _pushUnique(property.Target.value, property.Target.$target);

          targetValue = (property.Target.$target.TargetValue || property.Target.$target.MaximumValue).toString();

          _appendTemplate("{".concat(valueIndex, "}/").concat(targetValue));
        } else if (((_property$annotations9 = property.annotations) === null || _property$annotations9 === void 0 ? void 0 : (_property$annotations10 = _property$annotations9.UI) === null || _property$annotations10 === void 0 ? void 0 : (_property$annotations11 = _property$annotations10.DataFieldDefault) === null || _property$annotations11 === void 0 ? void 0 : (_property$annotations12 = _property$annotations11.Target) === null || _property$annotations12 === void 0 ? void 0 : (_property$annotations13 = _property$annotations12.$target) === null || _property$annotations13 === void 0 ? void 0 : _property$annotations13.$Type) === "com.sap.vocabularies.UI.v1.DataPointType") {
          // DataPoint use-case using DataFieldDefault.
          var dataPointDefaultProperty = property.annotations.UI.DataFieldDefault;
          valueIndex = _pushUnique(path, property); // New fake property created for the Rating/Progress Target Value. It'll be used for the export on split mode.

          _pushUnique(dataPointDefaultProperty.Target.value, property);

          targetValue = (dataPointDefaultProperty.Target.$target.TargetValue || dataPointDefaultProperty.Target.$target.TargetValue.MaximumValue).toString();

          _appendTemplate("{".concat(valueIndex, "}/").concat(targetValue));
        } else if (((_property$Target2 = property.Target) === null || _property$Target2 === void 0 ? void 0 : (_property$Target2$$ta = _property$Target2.$target) === null || _property$Target2$$ta === void 0 ? void 0 : _property$Target2$$ta.$Type) === "com.sap.vocabularies.Communication.v1.ContactType") {
          var _property$Target$$tar2;

          relatedProperties.exportSettingsContactProperty = property.Target.value.substring(0, property.Target.value.indexOf("/") + 1) + ((_property$Target$$tar2 = property.Target.$target.fn) === null || _property$Target$$tar2 === void 0 ? void 0 : _property$Target$$tar2.path);
          valueIndex = _pushUnique(path, property.Target.$target.fn.$target);

          _appendTemplate("{".concat(valueIndex, "}"));
        } else if (!ignoreSelf) {
          // Collect underlying property
          valueIndex = _pushUnique(path, property);

          _appendTemplate("{".concat(valueIndex, "}"));
        }
      }

      relatedProperties = _collectAdditionalPropertiesForAnalyticalTable(property, navigationPathPrefix, tableType, relatedProperties);

      if (Object.keys(relatedProperties.additionalProperties).length > 0 && Object.keys(relatedProperties.properties).length === 0) {
        // Collect underlying property if not collected already.
        // This is to ensure that additionalProperties are made available only to complex property infos.
        valueIndex = _pushUnique(path, property);

        _appendTemplate("{".concat(valueIndex, "}"));
      }
    }

    return relatedProperties;
  }
  /**
   * Collect properties consumed by a Data Field.
   * This is for populating the ComplexPropertyInfos of the table delegate.
   *
   * @param {DataFieldAbstractTypes} dataField The Data Field for which the properties need to be identified.
   * @param converterContext The converter context.
   * @param {TableType} tableType The table type.
   * @param {ComplexPropertyInfo} relatedProperties The properties identified so far.
   * @returns {ComplexPropertyInfo} The properties related to the Data Field.
   */


  _exports.collectRelatedProperties = collectRelatedProperties;

  function collectRelatedPropertiesRecursively(dataField, converterContext, tableType) {
    var _dataField$Target, _dataField$Target$$ta, _dataField$Target$$ta2;

    var relatedProperties = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
      properties: {},
      additionalProperties: {}
    };

    if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataField" && dataField.Value) {
      var property = dataField.Value;
      relatedProperties = collectRelatedProperties(property.path, property.$target, converterContext, false, tableType, relatedProperties);

      var navigationPathPrefix = _getNavigationPathPrefix(property.path);

      relatedProperties = _collectAdditionalPropertiesForAnalyticalTable(dataField, navigationPathPrefix, tableType, relatedProperties);
    } else if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
      switch ((_dataField$Target = dataField.Target) === null || _dataField$Target === void 0 ? void 0 : (_dataField$Target$$ta = _dataField$Target.$target) === null || _dataField$Target$$ta === void 0 ? void 0 : _dataField$Target$$ta.$Type) {
        case "com.sap.vocabularies.UI.v1.FieldGroupType":
          (_dataField$Target$$ta2 = dataField.Target.$target.Data) === null || _dataField$Target$$ta2 === void 0 ? void 0 : _dataField$Target$$ta2.forEach(function (innerDataField) {
            relatedProperties = collectRelatedPropertiesRecursively(innerDataField, converterContext, tableType, relatedProperties);
          });
          break;

        case "com.sap.vocabularies.UI.v1.DataPointType":
          relatedProperties = collectRelatedProperties(dataField.Target.$target.Value.path, dataField, converterContext, false, tableType, relatedProperties);
          break;

        case "com.sap.vocabularies.Communication.v1.ContactType":
          relatedProperties = collectRelatedProperties(dataField.Target.value, dataField, converterContext, false, tableType, relatedProperties);
          break;
      }
    }

    return relatedProperties;
  }

  _exports.collectRelatedPropertiesRecursively = collectRelatedPropertiesRecursively;

  var getDataFieldDataType = function (oDataField) {
    var _Value, _Value$$target, _Target;

    var sDataType = oDataField.$Type;

    switch (sDataType) {
      case "com.sap.vocabularies.UI.v1.DataFieldForAction":
      case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
        sDataType = undefined;
        break;

      case "com.sap.vocabularies.UI.v1.DataField":
      case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
      case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
        sDataType = oDataField === null || oDataField === void 0 ? void 0 : (_Value = oDataField.Value) === null || _Value === void 0 ? void 0 : (_Value$$target = _Value.$target) === null || _Value$$target === void 0 ? void 0 : _Value$$target.type;
        break;

      case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
      default:
        var sDataTypeForDataFieldForAnnotation = (_Target = oDataField.Target) === null || _Target === void 0 ? void 0 : _Target.$target.$Type;

        if (sDataTypeForDataFieldForAnnotation) {
          var _Target2, _Target4;

          if (((_Target2 = oDataField.Target) === null || _Target2 === void 0 ? void 0 : _Target2.$target.$Type) === "com.sap.vocabularies.Communication.v1.ContactType") {
            var _$target, _Target3, _Target3$$target;

            sDataType = (_$target = ((_Target3 = oDataField.Target) === null || _Target3 === void 0 ? void 0 : (_Target3$$target = _Target3.$target) === null || _Target3$$target === void 0 ? void 0 : _Target3$$target.fn).$target) === null || _$target === void 0 ? void 0 : _$target.type;
          } else if (((_Target4 = oDataField.Target) === null || _Target4 === void 0 ? void 0 : _Target4.$target.$Type) === "com.sap.vocabularies.UI.v1.DataPointType") {
            var _Target5, _Target5$$target, _Target5$$target$Valu, _Target5$$target$Valu2, _Target6, _Target6$$target, _Target6$$target$Valu;

            sDataType = ((_Target5 = oDataField.Target) === null || _Target5 === void 0 ? void 0 : (_Target5$$target = _Target5.$target) === null || _Target5$$target === void 0 ? void 0 : (_Target5$$target$Valu = _Target5$$target.Value) === null || _Target5$$target$Valu === void 0 ? void 0 : (_Target5$$target$Valu2 = _Target5$$target$Valu.$Path) === null || _Target5$$target$Valu2 === void 0 ? void 0 : _Target5$$target$Valu2.$Type) || ((_Target6 = oDataField.Target) === null || _Target6 === void 0 ? void 0 : (_Target6$$target = _Target6.$target) === null || _Target6$$target === void 0 ? void 0 : (_Target6$$target$Valu = _Target6$$target.Value) === null || _Target6$$target$Valu === void 0 ? void 0 : _Target6$$target$Valu.$target.type);
          } else {
            // e.g. FieldGroup or Chart
            sDataType = undefined;
          }
        } else {
          sDataType = undefined;
        }

        break;
    }

    return sDataType;
  };

  _exports.getDataFieldDataType = getDataFieldDataType;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRhdGFGaWVsZC50cyJdLCJuYW1lcyI6WyJpc0RhdGFGaWVsZEZvckFjdGlvbkFic3RyYWN0IiwiZGF0YUZpZWxkIiwiaGFzT3duUHJvcGVydHkiLCJpc0RhdGFGaWVsZFR5cGVzIiwiaXNEYXRhRmllbGRBbHdheXNIaWRkZW4iLCJhbm5vdGF0aW9ucyIsIlVJIiwiSGlkZGVuIiwidmFsdWVPZiIsIlZhbHVlIiwiJHRhcmdldCIsImdldFNlbWFudGljT2JqZWN0UGF0aCIsImNvbnZlcnRlckNvbnRleHQiLCJvYmplY3QiLCJwcm9wZXJ0eSIsIkNvbW1vbiIsIlNlbWFudGljT2JqZWN0IiwidW5kZWZpbmVkIiwiZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aCIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsImlzUHJvcGVydHkiLCJfZ2V0TmF2aWdhdGlvblBhdGhQcmVmaXgiLCJwYXRoIiwiaW5kZXhPZiIsInN1YnN0cmluZyIsImxhc3RJbmRleE9mIiwiX2NvbGxlY3RBZGRpdGlvbmFsUHJvcGVydGllc0ZvckFuYWx5dGljYWxUYWJsZSIsInRhcmdldCIsIm5hdmlnYXRpb25QYXRoUHJlZml4IiwidGFibGVUeXBlIiwicmVsYXRlZFByb3BlcnRpZXMiLCJoaWRkZW5Bbm5vdGF0aW9uIiwiX3R5cGUiLCJoaWRkZW5Bbm5vdGF0aW9uUHJvcGVydHlQYXRoIiwiYWRkaXRpb25hbFByb3BlcnRpZXMiLCJjb2xsZWN0UmVsYXRlZFByb3BlcnRpZXMiLCJpZ25vcmVTZWxmIiwicHJvcGVydGllcyIsIl9wdXNoVW5pcXVlIiwia2V5IiwidmFsdWUiLCJPYmplY3QiLCJrZXlzIiwiX2FwcGVuZFRlbXBsYXRlIiwiZXhwb3J0U2V0dGluZ3NUZW1wbGF0ZSIsInRleHRBbm5vdGF0aW9uIiwiVGV4dCIsInZhbHVlSW5kZXgiLCJ0YXJnZXRWYWx1ZSIsImN1cnJlbmN5T3JVb01JbmRleCIsImV4cG9ydFNldHRpbmdzV3JhcHBpbmciLCJkYXRhTW9kZWxPYmplY3RQYXRoIiwiZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCIsInRleHRBbm5vdGF0aW9uUHJvcGVydHlQYXRoIiwiZGlzcGxheU1vZGUiLCJnZXREaXNwbGF5TW9kZSIsImRlc2NyaXB0aW9uSW5kZXgiLCJ2aXN1YWxTZXR0aW5nc1RvQmVFeGNsdWRlZCIsImN1cnJlbmN5T3JVb01Qcm9wZXJ0eSIsImdldEFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5IiwiZ2V0QXNzb2NpYXRlZFVuaXRQcm9wZXJ0eSIsImN1cnJlbmN5T3JVbml0QW5ub3RhdGlvbiIsIk1lYXN1cmVzIiwiSVNPQ3VycmVuY3kiLCJVbml0IiwibmFtZSIsIlRhcmdldCIsIlZpc3VhbGl6YXRpb24iLCJkYXRhUG9pbnRQcm9wZXJ0eSIsIlRhcmdldFZhbHVlIiwiTWF4aW11bVZhbHVlIiwidG9TdHJpbmciLCJEYXRhRmllbGREZWZhdWx0IiwiJFR5cGUiLCJkYXRhUG9pbnREZWZhdWx0UHJvcGVydHkiLCJleHBvcnRTZXR0aW5nc0NvbnRhY3RQcm9wZXJ0eSIsImZuIiwibGVuZ3RoIiwiY29sbGVjdFJlbGF0ZWRQcm9wZXJ0aWVzUmVjdXJzaXZlbHkiLCJEYXRhIiwiZm9yRWFjaCIsImlubmVyRGF0YUZpZWxkIiwiZ2V0RGF0YUZpZWxkRGF0YVR5cGUiLCJvRGF0YUZpZWxkIiwic0RhdGFUeXBlIiwidHlwZSIsInNEYXRhVHlwZUZvckRhdGFGaWVsZEZvckFubm90YXRpb24iLCIkUGF0aCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQXlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLFdBQVNBLDRCQUFULENBQXNDQyxTQUF0QyxFQUF1SDtBQUM3SCxXQUFRQSxTQUFELENBQStDQyxjQUEvQyxDQUE4RCxRQUE5RCxDQUFQO0FBQ0E7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFDTyxXQUFTQyxnQkFBVCxDQUEwQkYsU0FBMUIsRUFBMEY7QUFDaEcsV0FBUUEsU0FBRCxDQUE4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T0FEaEQsOEVBQ0EsaUJBQXVFRCxLQUR2RSwwREFDQSxzQkFBOEVDLE9BQTlFLENBQXNGMkUsSUFEdEYsQ0FERDtBQUdBLFdBSk0sTUFJQTtBQUNOO0FBQ0FELFlBQUFBLFNBQVMsR0FBR25FLFNBQVo7QUFDQTtBQUNELFNBWEQsTUFXTztBQUNObUUsVUFBQUEsU0FBUyxHQUFHbkUsU0FBWjtBQUNBOztBQUNEO0FBN0JGOztBQWdDQSxXQUFPbUUsU0FBUDtBQUNBLEdBbkNNIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRDb21tdW5pY2F0aW9uQW5ub3RhdGlvblR5cGVzLFxuXHRDb250YWN0LFxuXHREYXRhRmllbGQsXG5cdERhdGFGaWVsZEFic3RyYWN0VHlwZXMsXG5cdERhdGFGaWVsZEZvckFjdGlvbkFic3RyYWN0VHlwZXMsXG5cdERhdGFGaWVsZEZvckFubm90YXRpb24sXG5cdERhdGFGaWVsZFR5cGVzLFxuXHREYXRhUG9pbnQsXG5cdFVJQW5ub3RhdGlvblR5cGVzXG59IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0ICogYXMgRWRtIGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy9kaXN0L0VkbVwiO1xuaW1wb3J0IHsgZ2V0RGlzcGxheU1vZGUsIFByb3BlcnR5T3JQYXRoIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvVUlGb3JtYXR0ZXJzXCI7XG5pbXBvcnQgeyBQcm9wZXJ0eSB9IGZyb20gXCJAc2FwLXV4L2Fubm90YXRpb24tY29udmVydGVyXCI7XG5pbXBvcnQgeyBnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eSwgZ2V0QXNzb2NpYXRlZFVuaXRQcm9wZXJ0eSwgaXNQcm9wZXJ0eSB9IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL1Byb3BlcnR5SGVscGVyXCI7XG5pbXBvcnQgQ29udmVydGVyQ29udGV4dCBmcm9tIFwiLi4vQ29udmVydGVyQ29udGV4dFwiO1xuaW1wb3J0IHsgVGFibGVUeXBlIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvY29udHJvbHMvQ29tbW9uL1RhYmxlXCI7XG5cbmV4cG9ydCB0eXBlIENvbXBsZXhQcm9wZXJ0eUluZm8gPSB7XG5cdHByb3BlcnRpZXM6IFJlY29yZDxzdHJpbmcsIFByb3BlcnR5Pjtcblx0YWRkaXRpb25hbFByb3BlcnRpZXM6IFJlY29yZDxzdHJpbmcsIFByb3BlcnR5Pjtcblx0ZXhwb3J0U2V0dGluZ3NUZW1wbGF0ZT86IHN0cmluZztcblx0ZXhwb3J0U2V0dGluZ3NXcmFwcGluZz86IGJvb2xlYW47XG5cdGV4cG9ydFNldHRpbmdzQ29udGFjdFByb3BlcnR5Pzogc3RyaW5nO1xuXHR2aXN1YWxTZXR0aW5nc1RvQmVFeGNsdWRlZD86IHN0cmluZztcbn07XG5cbi8qKlxuICogSWRlbnRpZmllcyBpZiB0aGUgZ2l2ZW4gZGF0YUZpZWxkQWJzdHJhY3QgdGhhdCBpcyBwYXNzZWQgaXMgYSBcIkRhdGFGaWVsZEZvckFjdGlvbkFic3RyYWN0XCIuXG4gKiBEYXRhRmllbGRGb3JBY3Rpb25BYnN0cmFjdCBoYXMgYW4gaW5saW5lIGFjdGlvbiBkZWZpbmVkLlxuICpcbiAqIEBwYXJhbSB7RGF0YUZpZWxkQWJzdHJhY3RUeXBlc30gZGF0YUZpZWxkIERhdGEgZmllbGQgdG8gYmUgZXZhbHVhdGVkXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVmFsaWRhdGVzIHRoYXQgZGF0YUZpZWxkIGlzIGEgRGF0YUZpZWxkRm9yQWN0aW9uQWJzdHJhY3RUeXBlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0RhdGFGaWVsZEZvckFjdGlvbkFic3RyYWN0KGRhdGFGaWVsZDogRGF0YUZpZWxkQWJzdHJhY3RUeXBlcyk6IGRhdGFGaWVsZCBpcyBEYXRhRmllbGRGb3JBY3Rpb25BYnN0cmFjdFR5cGVzIHtcblx0cmV0dXJuIChkYXRhRmllbGQgYXMgRGF0YUZpZWxkRm9yQWN0aW9uQWJzdHJhY3RUeXBlcykuaGFzT3duUHJvcGVydHkoXCJBY3Rpb25cIik7XG59XG5cbi8qKlxuICogSWRlbnRpZmllcyBpZiB0aGUgZ2l2ZW4gZGF0YUZpZWxkQWJzdHJhY3QgdGhhdCBpcyBwYXNzZWQgaXMgYSBcIkRhdGFGaWVsZFwiLlxuICogRGF0YUZpZWxkIGhhcyBhIHZhbHVlIGRlZmluZWQuXG4gKlxuICogQHBhcmFtIHtEYXRhRmllbGRBYnN0cmFjdFR5cGVzfSBkYXRhRmllbGQgRGF0YSBmaWVsZCB0byBiZSBldmFsdWF0ZWRcbiAqIEByZXR1cm5zIHtib29sZWFufSBWYWxpZGF0ZSB0aGF0IGRhdGFGaWVsZCBpcyBhIERhdGFGaWVsZFR5cGVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0RhdGFGaWVsZFR5cGVzKGRhdGFGaWVsZDogRGF0YUZpZWxkQWJzdHJhY3RUeXBlcyk6IGRhdGFGaWVsZCBpcyBEYXRhRmllbGRUeXBlcyB7XG5cdHJldHVybiAoZGF0YUZpZWxkIGFzIERhdGFGaWVsZFR5cGVzKS5oYXNPd25Qcm9wZXJ0eShcIlZhbHVlXCIpO1xufVxuXG4vKipcbiAqIFJldHVybnMgd2hldGhlciBnaXZlbiBkYXRhIGZpZWxkIGhhcyBhIHN0YXRpYyBoaWRkZW4gYW5ub3RhdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0RhdGFGaWVsZEFic3RyYWN0VHlwZXN9IGRhdGFGaWVsZCBUaGUgZGF0YWZpZWxkIHRvIGNoZWNrXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gYHRydWVgIGlmIGRhdGFmaWVsZCBvciByZWZlcmVuY2VkIHByb3BlcnR5IGhhcyBhIHN0YXRpYyBIaWRkZW4gYW5ub3RhdGlvbiwgZmFsc2UgZWxzZVxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRGF0YUZpZWxkQWx3YXlzSGlkZGVuKGRhdGFGaWVsZDogRGF0YUZpZWxkQWJzdHJhY3RUeXBlcyk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gKFxuXHRcdGRhdGFGaWVsZC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpID09PSB0cnVlIHx8XG5cdFx0KGlzRGF0YUZpZWxkVHlwZXMoZGF0YUZpZWxkKSAmJiBkYXRhRmllbGQuVmFsdWU/LiR0YXJnZXQ/LmFubm90YXRpb25zPy5VST8uSGlkZGVuID09PSB0cnVlKVxuXHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VtYW50aWNPYmplY3RQYXRoKGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsIG9iamVjdDogYW55KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0aWYgKHR5cGVvZiBvYmplY3QgPT09IFwib2JqZWN0XCIpIHtcblx0XHRpZiAoaXNEYXRhRmllbGRUeXBlcyhvYmplY3QpICYmIG9iamVjdC5WYWx1ZT8uJHRhcmdldCkge1xuXHRcdFx0Y29uc3QgcHJvcGVydHkgPSBvYmplY3QuVmFsdWU/LiR0YXJnZXQ7XG5cdFx0XHRpZiAocHJvcGVydHk/LmFubm90YXRpb25zPy5Db21tb24/LlNlbWFudGljT2JqZWN0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cmV0dXJuIGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChwcm9wZXJ0eT8uZnVsbHlRdWFsaWZpZWROYW1lKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKGlzUHJvcGVydHkob2JqZWN0KSkge1xuXHRcdFx0aWYgKG9iamVjdD8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uU2VtYW50aWNPYmplY3QgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRyZXR1cm4gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKG9iamVjdD8uZnVsbHlRdWFsaWZpZWROYW1lKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBuYXZpZ2F0aW9uIHBhdGggcHJlZml4IGZvciBhIHByb3BlcnR5IHBhdGguXG4gKlxuICogQHBhcmFtIHBhdGggVGhlIHByb3BlcnR5IHBhdGggRm9yIGUuZy4gL0VudGl0eVR5cGUvTmF2aWdhdGlvbi9Qcm9wZXJ0eVxuICogQHJldHVybnMge3N0cmluZ30gVGhlIG5hdmlnYXRpb24gcGF0aCBwcmVmaXggRm9yIGUuZy4gL0VudGl0eVR5cGUvTmF2aWdhdGlvbi9cbiAqL1xuZnVuY3Rpb24gX2dldE5hdmlnYXRpb25QYXRoUHJlZml4KHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG5cdHJldHVybiBwYXRoLmluZGV4T2YoXCIvXCIpID4gLTEgPyBwYXRoLnN1YnN0cmluZygwLCBwYXRoLmxhc3RJbmRleE9mKFwiL1wiKSArIDEpIDogXCJcIjtcbn1cblxuLyoqXG4gKiBDb2xsZWN0IGFkZGl0aW9uYWwgcHJvcGVydGllcyBmb3IgdGhlIEFMUCB0YWJsZSB1c2UtY2FzZS5cbiAqXG4gKiBGb3IgZS5nLiBJZiBVSS5IaWRkZW4gcG9pbnRzIHRvIGEgcHJvcGVydHksIGluY2x1ZGUgdGhpcyBwcm9wZXJ0eSBpbiB0aGUgYWRkaXRpb25hbFByb3BlcnRpZXMgb2YgQ29tcGxleFByb3BlcnR5SW5mbyBvYmplY3QuXG4gKiBAcGFyYW0gdGFyZ2V0IFByb3BlcnR5IG9yIERhdGFGaWVsZCBiZWluZyBwcm9jZXNzZWRcbiAqIEBwYXJhbSBuYXZpZ2F0aW9uUGF0aFByZWZpeCBOYXZpZ2F0aW9uIHBhdGggcHJlZml4LCBhcHBsaWNhYmxlIGluIGNhc2Ugb2YgbmF2aWdhdGlvbiBwcm9wZXJ0aWVzLlxuICogQHBhcmFtIHRhYmxlVHlwZSBUYWJsZSB0eXBlLlxuICogQHBhcmFtIHJlbGF0ZWRQcm9wZXJ0aWVzIFRoZSByZWxhdGVkIHByb3BlcnRpZXMgaWRlbnRpZmllZCBzbyBmYXIuXG4gKiBAcmV0dXJucyB7Q29tcGxleFByb3BlcnR5SW5mb30gVGhlIHJlbGF0ZWQgcHJvcGVydGllcyBpZGVudGlmaWVkLlxuICovXG5mdW5jdGlvbiBfY29sbGVjdEFkZGl0aW9uYWxQcm9wZXJ0aWVzRm9yQW5hbHl0aWNhbFRhYmxlKFxuXHR0YXJnZXQ6IEVkbS5QcmltaXRpdmVUeXBlLFxuXHRuYXZpZ2F0aW9uUGF0aFByZWZpeDogc3RyaW5nLFxuXHR0YWJsZVR5cGU6IFRhYmxlVHlwZSxcblx0cmVsYXRlZFByb3BlcnRpZXM6IENvbXBsZXhQcm9wZXJ0eUluZm9cbik6IENvbXBsZXhQcm9wZXJ0eUluZm8ge1xuXHRpZiAodGFibGVUeXBlID09PSBcIkFuYWx5dGljYWxUYWJsZVwiKSB7XG5cdFx0Y29uc3QgaGlkZGVuQW5ub3RhdGlvbiA9IHRhcmdldC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbjtcblx0XHRpZiAoaGlkZGVuQW5ub3RhdGlvbj8ucGF0aCAmJiBoaWRkZW5Bbm5vdGF0aW9uLiR0YXJnZXQ/Ll90eXBlID09PSBcIlByb3BlcnR5XCIpIHtcblx0XHRcdGNvbnN0IGhpZGRlbkFubm90YXRpb25Qcm9wZXJ0eVBhdGggPSBuYXZpZ2F0aW9uUGF0aFByZWZpeCArIGhpZGRlbkFubm90YXRpb24ucGF0aDtcblx0XHRcdC8vIFRoaXMgcHJvcGVydHkgc2hvdWxkIGJlIGFkZGVkIHRvIGFkZGl0aW9uYWxQcm9wZXJ0aWVzIG1hcCBmb3IgdGhlIEFMUCB0YWJsZSB1c2UtY2FzZS5cblx0XHRcdHJlbGF0ZWRQcm9wZXJ0aWVzLmFkZGl0aW9uYWxQcm9wZXJ0aWVzW2hpZGRlbkFubm90YXRpb25Qcm9wZXJ0eVBhdGhdID0gaGlkZGVuQW5ub3RhdGlvbi4kdGFyZ2V0O1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVsYXRlZFByb3BlcnRpZXM7XG59XG5cbi8qKlxuICogQ29sbGVjdCByZWxhdGVkIHByb3BlcnRpZXMgZnJvbSBhIHByb3BlcnR5J3MgYW5ub3RhdGlvbnMuXG4gKlxuICogQHBhcmFtIHBhdGggVGhlIHByb3BlcnR5IHBhdGhcbiAqIEBwYXJhbSBwcm9wZXJ0eSBUaGUgcHJvcGVydHkgdG8gYmUgY29uc2lkZXJlZFxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcGFyYW0gaWdub3JlU2VsZiBXaGV0aGVyIHRvIGV4Y2x1ZGUgdGhlIHNhbWUgcHJvcGVydHkgZnJvbSByZWxhdGVkIHByb3BlcnRpZXMuXG4gKiBAcGFyYW0gdGFibGVUeXBlIFRoZSB0YWJsZSB0eXBlLlxuICogQHBhcmFtIHJlbGF0ZWRQcm9wZXJ0aWVzIFRoZSByZWxhdGVkIHByb3BlcnRpZXMgaWRlbnRpZmllZCBzbyBmYXIuXG4gKiBAcmV0dXJucyB7Q29tcGxleFByb3BlcnR5SW5mb30gVGhlIHJlbGF0ZWQgcHJvcGVydGllcyBpZGVudGlmaWVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29sbGVjdFJlbGF0ZWRQcm9wZXJ0aWVzKFxuXHRwYXRoOiBzdHJpbmcsXG5cdHByb3BlcnR5OiBFZG0uUHJpbWl0aXZlVHlwZSxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0aWdub3JlU2VsZjogYm9vbGVhbixcblx0dGFibGVUeXBlOiBUYWJsZVR5cGUsXG5cdHJlbGF0ZWRQcm9wZXJ0aWVzOiBDb21wbGV4UHJvcGVydHlJbmZvID0geyBwcm9wZXJ0aWVzOiB7fSwgYWRkaXRpb25hbFByb3BlcnRpZXM6IHt9IH1cbik6IENvbXBsZXhQcm9wZXJ0eUluZm8ge1xuXHQvKipcblx0ICogSGVscGVyIHRvIHB1c2ggdW5pcXVlIHJlbGF0ZWQgcHJvcGVydGllcy5cblx0ICpcblx0ICogQHBhcmFtIGtleSBUaGUgcHJvcGVydHkgcGF0aFxuXHQgKiBAcGFyYW0gdmFsdWUgVGhlIHByb3BlcnRpZXMgb2JqZWN0IGNvbnRhaW5pbmcgdmFsdWUgcHJvcGVydHksIGRlc2NyaXB0aW9uIHByb3BlcnR5Li4uXG5cdCAqIEByZXR1cm5zIEluZGV4IGF0IHdoaWNoIHRoZSBwcm9wZXJ0eSBpcyBhdmFpbGFibGVcblx0ICovXG5cdGZ1bmN0aW9uIF9wdXNoVW5pcXVlKGtleTogc3RyaW5nLCB2YWx1ZTogUHJvcGVydHkpOiBudW1iZXIge1xuXHRcdGlmICghcmVsYXRlZFByb3BlcnRpZXMucHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdFx0XHRyZWxhdGVkUHJvcGVydGllcy5wcm9wZXJ0aWVzW2tleV0gPSB2YWx1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIE9iamVjdC5rZXlzKHJlbGF0ZWRQcm9wZXJ0aWVzLnByb3BlcnRpZXMpLmluZGV4T2Yoa2V5KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBIZWxwZXIgdG8gYXBwZW5kIHRoZSBleHBvcnQgc2V0dGluZ3MgdGVtcGxhdGUgd2l0aCBhIGZvcm1hdHRlZCB0ZXh0LlxuXHQgKlxuXHQgKiBAcGFyYW0gdmFsdWUgRm9ybWF0dGVkIHRleHRcblx0ICovXG5cdGZ1bmN0aW9uIF9hcHBlbmRUZW1wbGF0ZSh2YWx1ZTogc3RyaW5nKSB7XG5cdFx0cmVsYXRlZFByb3BlcnRpZXMuZXhwb3J0U2V0dGluZ3NUZW1wbGF0ZSA9IHJlbGF0ZWRQcm9wZXJ0aWVzLmV4cG9ydFNldHRpbmdzVGVtcGxhdGVcblx0XHRcdD8gYCR7cmVsYXRlZFByb3BlcnRpZXMuZXhwb3J0U2V0dGluZ3NUZW1wbGF0ZX0ke3ZhbHVlfWBcblx0XHRcdDogYCR7dmFsdWV9YDtcblx0fVxuXG5cdGlmIChwYXRoICYmIHByb3BlcnR5KSB7XG5cdFx0Y29uc3QgbmF2aWdhdGlvblBhdGhQcmVmaXggPSBfZ2V0TmF2aWdhdGlvblBhdGhQcmVmaXgocGF0aCk7XG5cblx0XHQvLyBDaGVjayBmb3IgVGV4dCBhbm5vdGF0aW9uLlxuXHRcdGNvbnN0IHRleHRBbm5vdGF0aW9uID0gcHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uVGV4dDtcblx0XHRsZXQgdmFsdWVJbmRleDogbnVtYmVyO1xuXHRcdGxldCB0YXJnZXRWYWx1ZTogc3RyaW5nO1xuXHRcdGxldCBjdXJyZW5jeU9yVW9NSW5kZXg6IG51bWJlcjtcblxuXHRcdGlmIChyZWxhdGVkUHJvcGVydGllcy5leHBvcnRTZXR0aW5nc1RlbXBsYXRlKSB7XG5cdFx0XHQvLyBGaWVsZEdyb3VwIHVzZS1jYXNlLiBOZWVkIHRvIGFkZCBlYWNoIEZpZWxkIGluIG5ldyBsaW5lLlxuXHRcdFx0X2FwcGVuZFRlbXBsYXRlKFwiXFxuXCIpO1xuXHRcdFx0cmVsYXRlZFByb3BlcnRpZXMuZXhwb3J0U2V0dGluZ3NXcmFwcGluZyA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKHRleHRBbm5vdGF0aW9uPy5wYXRoICYmIHRleHRBbm5vdGF0aW9uPy4kdGFyZ2V0KSB7XG5cdFx0XHQvLyBDaGVjayBmb3IgVGV4dCBBcnJhbmdlbWVudC5cblx0XHRcdGNvbnN0IGRhdGFNb2RlbE9iamVjdFBhdGggPSBjb252ZXJ0ZXJDb250ZXh0LmdldERhdGFNb2RlbE9iamVjdFBhdGgoKTtcblx0XHRcdGNvbnN0IHRleHRBbm5vdGF0aW9uUHJvcGVydHlQYXRoID0gbmF2aWdhdGlvblBhdGhQcmVmaXggKyB0ZXh0QW5ub3RhdGlvbi5wYXRoO1xuXHRcdFx0Y29uc3QgZGlzcGxheU1vZGUgPSBnZXREaXNwbGF5TW9kZShwcm9wZXJ0eSBhcyBQcm9wZXJ0eU9yUGF0aDxQcm9wZXJ0eT4sIGRhdGFNb2RlbE9iamVjdFBhdGgpO1xuXHRcdFx0bGV0IGRlc2NyaXB0aW9uSW5kZXg6IG51bWJlcjtcblx0XHRcdHN3aXRjaCAoZGlzcGxheU1vZGUpIHtcblx0XHRcdFx0Y2FzZSBcIlZhbHVlXCI6XG5cdFx0XHRcdFx0dmFsdWVJbmRleCA9IF9wdXNoVW5pcXVlKHBhdGgsIHByb3BlcnR5KTtcblx0XHRcdFx0XHRfYXBwZW5kVGVtcGxhdGUoYHske3ZhbHVlSW5kZXh9fWApO1xuXHRcdFx0XHRcdHJlbGF0ZWRQcm9wZXJ0aWVzLnZpc3VhbFNldHRpbmdzVG9CZUV4Y2x1ZGVkID0gdGV4dEFubm90YXRpb25Qcm9wZXJ0eVBhdGg7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBcIkRlc2NyaXB0aW9uXCI6XG5cdFx0XHRcdFx0Ly8gS2VlcCB2YWx1ZSB3aGVuIGV4cG9ydGluZyAoc3BsaXQgbW9kZSkgb24gdGV4dCBBcnJhbmdlbWVudCBkZWZpbmVkIGFzICNUZXh0T25seSAoT25seSB2YWx1ZXMgYXJlIGV4cGVjdGVkIG9uIHBhc3RlIGZyb20gRXhjZWwgZnVuY3Rpb25hbGl0eSlcblx0XHRcdFx0XHRfcHVzaFVuaXF1ZShwYXRoLCBwcm9wZXJ0eSk7XG5cdFx0XHRcdFx0ZGVzY3JpcHRpb25JbmRleCA9IF9wdXNoVW5pcXVlKHRleHRBbm5vdGF0aW9uUHJvcGVydHlQYXRoLCB0ZXh0QW5ub3RhdGlvbi4kdGFyZ2V0KTtcblx0XHRcdFx0XHRfYXBwZW5kVGVtcGxhdGUoYHske2Rlc2NyaXB0aW9uSW5kZXh9fWApO1xuXHRcdFx0XHRcdHJlbGF0ZWRQcm9wZXJ0aWVzLnZpc3VhbFNldHRpbmdzVG9CZUV4Y2x1ZGVkID0gcGF0aDtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIFwiVmFsdWVEZXNjcmlwdGlvblwiOlxuXHRcdFx0XHRcdHZhbHVlSW5kZXggPSBfcHVzaFVuaXF1ZShwYXRoLCBwcm9wZXJ0eSk7XG5cdFx0XHRcdFx0ZGVzY3JpcHRpb25JbmRleCA9IF9wdXNoVW5pcXVlKHRleHRBbm5vdGF0aW9uUHJvcGVydHlQYXRoLCB0ZXh0QW5ub3RhdGlvbi4kdGFyZ2V0KTtcblx0XHRcdFx0XHRfYXBwZW5kVGVtcGxhdGUoYHske3ZhbHVlSW5kZXh9fSAoeyR7ZGVzY3JpcHRpb25JbmRleH19KWApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgXCJEZXNjcmlwdGlvblZhbHVlXCI6XG5cdFx0XHRcdFx0dmFsdWVJbmRleCA9IF9wdXNoVW5pcXVlKHBhdGgsIHByb3BlcnR5KTtcblx0XHRcdFx0XHRkZXNjcmlwdGlvbkluZGV4ID0gX3B1c2hVbmlxdWUodGV4dEFubm90YXRpb25Qcm9wZXJ0eVBhdGgsIHRleHRBbm5vdGF0aW9uLiR0YXJnZXQpO1xuXHRcdFx0XHRcdF9hcHBlbmRUZW1wbGF0ZShgeyR7ZGVzY3JpcHRpb25JbmRleH19ICh7JHt2YWx1ZUluZGV4fX0pYCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIENoZWNrIGZvciBmaWVsZCBjb250YWluaW5nIEN1cnJlbmN5IE9yIFVuaXQgUHJvcGVydGllcy5cblx0XHRcdGNvbnN0IGN1cnJlbmN5T3JVb01Qcm9wZXJ0eSA9IGdldEFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5KHByb3BlcnR5KSB8fCBnZXRBc3NvY2lhdGVkVW5pdFByb3BlcnR5KHByb3BlcnR5KTtcblx0XHRcdGNvbnN0IGN1cnJlbmN5T3JVbml0QW5ub3RhdGlvbiA9IHByb3BlcnR5Py5hbm5vdGF0aW9ucz8uTWVhc3VyZXM/LklTT0N1cnJlbmN5IHx8IHByb3BlcnR5Py5hbm5vdGF0aW9ucz8uTWVhc3VyZXM/LlVuaXQ7XG5cdFx0XHRpZiAoY3VycmVuY3lPclVvTVByb3BlcnR5ICYmIGN1cnJlbmN5T3JVbml0QW5ub3RhdGlvbj8uJHRhcmdldCkge1xuXHRcdFx0XHR2YWx1ZUluZGV4ID0gX3B1c2hVbmlxdWUocGF0aCwgcHJvcGVydHkpO1xuXHRcdFx0XHRjdXJyZW5jeU9yVW9NSW5kZXggPSBfcHVzaFVuaXF1ZShjdXJyZW5jeU9yVW9NUHJvcGVydHkubmFtZSwgY3VycmVuY3lPclVuaXRBbm5vdGF0aW9uLiR0YXJnZXQpO1xuXHRcdFx0XHRfYXBwZW5kVGVtcGxhdGUoYHske3ZhbHVlSW5kZXh9fSAgeyR7Y3VycmVuY3lPclVvTUluZGV4fX1gKTtcblx0XHRcdH0gZWxzZSBpZiAocHJvcGVydHkuVGFyZ2V0Py4kdGFyZ2V0Py5WaXN1YWxpemF0aW9uKSB7XG5cdFx0XHRcdGNvbnN0IGRhdGFQb2ludFByb3BlcnR5OiBFZG0uUHJpbWl0aXZlVHlwZSA9IHByb3BlcnR5LlRhcmdldC4kdGFyZ2V0LlZhbHVlLiR0YXJnZXQ7XG5cdFx0XHRcdHZhbHVlSW5kZXggPSBfcHVzaFVuaXF1ZShwYXRoLCBkYXRhUG9pbnRQcm9wZXJ0eSk7XG5cdFx0XHRcdC8vIE5ldyBmYWtlIHByb3BlcnR5IGNyZWF0ZWQgZm9yIHRoZSBSYXRpbmcvUHJvZ3Jlc3MgVGFyZ2V0IFZhbHVlLiBJdCdsbCBiZSB1c2VkIGZvciB0aGUgZXhwb3J0IG9uIHNwbGl0IG1vZGUuXG5cdFx0XHRcdF9wdXNoVW5pcXVlKHByb3BlcnR5LlRhcmdldC52YWx1ZSwgcHJvcGVydHkuVGFyZ2V0LiR0YXJnZXQpO1xuXHRcdFx0XHR0YXJnZXRWYWx1ZSA9IChwcm9wZXJ0eS5UYXJnZXQuJHRhcmdldC5UYXJnZXRWYWx1ZSB8fCBwcm9wZXJ0eS5UYXJnZXQuJHRhcmdldC5NYXhpbXVtVmFsdWUpLnRvU3RyaW5nKCk7XG5cdFx0XHRcdF9hcHBlbmRUZW1wbGF0ZShgeyR7dmFsdWVJbmRleH19LyR7dGFyZ2V0VmFsdWV9YCk7XG5cdFx0XHR9IGVsc2UgaWYgKHByb3BlcnR5LmFubm90YXRpb25zPy5VST8uRGF0YUZpZWxkRGVmYXVsdD8uVGFyZ2V0Py4kdGFyZ2V0Py4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YVBvaW50VHlwZSkge1xuXHRcdFx0XHQvLyBEYXRhUG9pbnQgdXNlLWNhc2UgdXNpbmcgRGF0YUZpZWxkRGVmYXVsdC5cblx0XHRcdFx0Y29uc3QgZGF0YVBvaW50RGVmYXVsdFByb3BlcnR5OiBFZG0uUHJpbWl0aXZlVHlwZSA9IHByb3BlcnR5LmFubm90YXRpb25zLlVJLkRhdGFGaWVsZERlZmF1bHQ7XG5cdFx0XHRcdHZhbHVlSW5kZXggPSBfcHVzaFVuaXF1ZShwYXRoLCBwcm9wZXJ0eSk7XG5cdFx0XHRcdC8vIE5ldyBmYWtlIHByb3BlcnR5IGNyZWF0ZWQgZm9yIHRoZSBSYXRpbmcvUHJvZ3Jlc3MgVGFyZ2V0IFZhbHVlLiBJdCdsbCBiZSB1c2VkIGZvciB0aGUgZXhwb3J0IG9uIHNwbGl0IG1vZGUuXG5cdFx0XHRcdF9wdXNoVW5pcXVlKGRhdGFQb2ludERlZmF1bHRQcm9wZXJ0eS5UYXJnZXQudmFsdWUsIHByb3BlcnR5KTtcblx0XHRcdFx0dGFyZ2V0VmFsdWUgPSAoXG5cdFx0XHRcdFx0ZGF0YVBvaW50RGVmYXVsdFByb3BlcnR5LlRhcmdldC4kdGFyZ2V0LlRhcmdldFZhbHVlIHx8IGRhdGFQb2ludERlZmF1bHRQcm9wZXJ0eS5UYXJnZXQuJHRhcmdldC5UYXJnZXRWYWx1ZS5NYXhpbXVtVmFsdWVcblx0XHRcdFx0KS50b1N0cmluZygpO1xuXHRcdFx0XHRfYXBwZW5kVGVtcGxhdGUoYHske3ZhbHVlSW5kZXh9fS8ke3RhcmdldFZhbHVlfWApO1xuXHRcdFx0fSBlbHNlIGlmIChwcm9wZXJ0eS5UYXJnZXQ/LiR0YXJnZXQ/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW11bmljYXRpb24udjEuQ29udGFjdFR5cGVcIikge1xuXHRcdFx0XHRyZWxhdGVkUHJvcGVydGllcy5leHBvcnRTZXR0aW5nc0NvbnRhY3RQcm9wZXJ0eSA9XG5cdFx0XHRcdFx0cHJvcGVydHkuVGFyZ2V0LnZhbHVlLnN1YnN0cmluZygwLCBwcm9wZXJ0eS5UYXJnZXQudmFsdWUuaW5kZXhPZihcIi9cIikgKyAxKSArIHByb3BlcnR5LlRhcmdldC4kdGFyZ2V0LmZuPy5wYXRoO1xuXHRcdFx0XHR2YWx1ZUluZGV4ID0gX3B1c2hVbmlxdWUocGF0aCwgcHJvcGVydHkuVGFyZ2V0LiR0YXJnZXQuZm4uJHRhcmdldCk7XG5cdFx0XHRcdF9hcHBlbmRUZW1wbGF0ZShgeyR7dmFsdWVJbmRleH19YCk7XG5cdFx0XHR9IGVsc2UgaWYgKCFpZ25vcmVTZWxmKSB7XG5cdFx0XHRcdC8vIENvbGxlY3QgdW5kZXJseWluZyBwcm9wZXJ0eVxuXHRcdFx0XHR2YWx1ZUluZGV4ID0gX3B1c2hVbmlxdWUocGF0aCwgcHJvcGVydHkpO1xuXHRcdFx0XHRfYXBwZW5kVGVtcGxhdGUoYHske3ZhbHVlSW5kZXh9fWApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJlbGF0ZWRQcm9wZXJ0aWVzID0gX2NvbGxlY3RBZGRpdGlvbmFsUHJvcGVydGllc0ZvckFuYWx5dGljYWxUYWJsZShwcm9wZXJ0eSwgbmF2aWdhdGlvblBhdGhQcmVmaXgsIHRhYmxlVHlwZSwgcmVsYXRlZFByb3BlcnRpZXMpO1xuXHRcdGlmIChPYmplY3Qua2V5cyhyZWxhdGVkUHJvcGVydGllcy5hZGRpdGlvbmFsUHJvcGVydGllcykubGVuZ3RoID4gMCAmJiBPYmplY3Qua2V5cyhyZWxhdGVkUHJvcGVydGllcy5wcm9wZXJ0aWVzKS5sZW5ndGggPT09IDApIHtcblx0XHRcdC8vIENvbGxlY3QgdW5kZXJseWluZyBwcm9wZXJ0eSBpZiBub3QgY29sbGVjdGVkIGFscmVhZHkuXG5cdFx0XHQvLyBUaGlzIGlzIHRvIGVuc3VyZSB0aGF0IGFkZGl0aW9uYWxQcm9wZXJ0aWVzIGFyZSBtYWRlIGF2YWlsYWJsZSBvbmx5IHRvIGNvbXBsZXggcHJvcGVydHkgaW5mb3MuXG5cdFx0XHR2YWx1ZUluZGV4ID0gX3B1c2hVbmlxdWUocGF0aCwgcHJvcGVydHkpO1xuXHRcdFx0X2FwcGVuZFRlbXBsYXRlKGB7JHt2YWx1ZUluZGV4fX1gKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gcmVsYXRlZFByb3BlcnRpZXM7XG59XG5cbi8qKlxuICogQ29sbGVjdCBwcm9wZXJ0aWVzIGNvbnN1bWVkIGJ5IGEgRGF0YSBGaWVsZC5cbiAqIFRoaXMgaXMgZm9yIHBvcHVsYXRpbmcgdGhlIENvbXBsZXhQcm9wZXJ0eUluZm9zIG9mIHRoZSB0YWJsZSBkZWxlZ2F0ZS5cbiAqXG4gKiBAcGFyYW0ge0RhdGFGaWVsZEFic3RyYWN0VHlwZXN9IGRhdGFGaWVsZCBUaGUgRGF0YSBGaWVsZCBmb3Igd2hpY2ggdGhlIHByb3BlcnRpZXMgbmVlZCB0byBiZSBpZGVudGlmaWVkLlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGNvbnZlcnRlciBjb250ZXh0LlxuICogQHBhcmFtIHtUYWJsZVR5cGV9IHRhYmxlVHlwZSBUaGUgdGFibGUgdHlwZS5cbiAqIEBwYXJhbSB7Q29tcGxleFByb3BlcnR5SW5mb30gcmVsYXRlZFByb3BlcnRpZXMgVGhlIHByb3BlcnRpZXMgaWRlbnRpZmllZCBzbyBmYXIuXG4gKiBAcmV0dXJucyB7Q29tcGxleFByb3BlcnR5SW5mb30gVGhlIHByb3BlcnRpZXMgcmVsYXRlZCB0byB0aGUgRGF0YSBGaWVsZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbGxlY3RSZWxhdGVkUHJvcGVydGllc1JlY3Vyc2l2ZWx5KFxuXHRkYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdHRhYmxlVHlwZTogVGFibGVUeXBlLFxuXHRyZWxhdGVkUHJvcGVydGllczogQ29tcGxleFByb3BlcnR5SW5mbyA9IHsgcHJvcGVydGllczoge30sIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB7fSB9XG4pOiBDb21wbGV4UHJvcGVydHlJbmZvIHtcblx0aWYgKGRhdGFGaWVsZC4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkICYmIGRhdGFGaWVsZC5WYWx1ZSkge1xuXHRcdGNvbnN0IHByb3BlcnR5ID0gZGF0YUZpZWxkLlZhbHVlO1xuXHRcdHJlbGF0ZWRQcm9wZXJ0aWVzID0gY29sbGVjdFJlbGF0ZWRQcm9wZXJ0aWVzKFxuXHRcdFx0cHJvcGVydHkucGF0aCxcblx0XHRcdHByb3BlcnR5LiR0YXJnZXQsXG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdFx0ZmFsc2UsXG5cdFx0XHR0YWJsZVR5cGUsXG5cdFx0XHRyZWxhdGVkUHJvcGVydGllc1xuXHRcdCk7XG5cdFx0Y29uc3QgbmF2aWdhdGlvblBhdGhQcmVmaXggPSBfZ2V0TmF2aWdhdGlvblBhdGhQcmVmaXgocHJvcGVydHkucGF0aCk7XG5cdFx0cmVsYXRlZFByb3BlcnRpZXMgPSBfY29sbGVjdEFkZGl0aW9uYWxQcm9wZXJ0aWVzRm9yQW5hbHl0aWNhbFRhYmxlKGRhdGFGaWVsZCwgbmF2aWdhdGlvblBhdGhQcmVmaXgsIHRhYmxlVHlwZSwgcmVsYXRlZFByb3BlcnRpZXMpO1xuXHR9IGVsc2UgaWYgKGRhdGFGaWVsZC4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQW5ub3RhdGlvbikge1xuXHRcdHN3aXRjaCAoZGF0YUZpZWxkLlRhcmdldD8uJHRhcmdldD8uJFR5cGUpIHtcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRmllbGRHcm91cFR5cGU6XG5cdFx0XHRcdGRhdGFGaWVsZC5UYXJnZXQuJHRhcmdldC5EYXRhPy5mb3JFYWNoKChpbm5lckRhdGFGaWVsZDogRGF0YUZpZWxkQWJzdHJhY3RUeXBlcykgPT4ge1xuXHRcdFx0XHRcdHJlbGF0ZWRQcm9wZXJ0aWVzID0gY29sbGVjdFJlbGF0ZWRQcm9wZXJ0aWVzUmVjdXJzaXZlbHkoaW5uZXJEYXRhRmllbGQsIGNvbnZlcnRlckNvbnRleHQsIHRhYmxlVHlwZSwgcmVsYXRlZFByb3BlcnRpZXMpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YVBvaW50VHlwZTpcblx0XHRcdFx0cmVsYXRlZFByb3BlcnRpZXMgPSBjb2xsZWN0UmVsYXRlZFByb3BlcnRpZXMoXG5cdFx0XHRcdFx0ZGF0YUZpZWxkLlRhcmdldC4kdGFyZ2V0LlZhbHVlLnBhdGgsXG5cdFx0XHRcdFx0ZGF0YUZpZWxkLFxuXHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHQsXG5cdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0dGFibGVUeXBlLFxuXHRcdFx0XHRcdHJlbGF0ZWRQcm9wZXJ0aWVzXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbXVuaWNhdGlvbi52MS5Db250YWN0VHlwZVwiOlxuXHRcdFx0XHRyZWxhdGVkUHJvcGVydGllcyA9IGNvbGxlY3RSZWxhdGVkUHJvcGVydGllcyhcblx0XHRcdFx0XHRkYXRhRmllbGQuVGFyZ2V0LnZhbHVlLFxuXHRcdFx0XHRcdGRhdGFGaWVsZCxcblx0XHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdFx0XHRcdGZhbHNlLFxuXHRcdFx0XHRcdHRhYmxlVHlwZSxcblx0XHRcdFx0XHRyZWxhdGVkUHJvcGVydGllc1xuXHRcdFx0XHQpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gcmVsYXRlZFByb3BlcnRpZXM7XG59XG5cbmV4cG9ydCBjb25zdCBnZXREYXRhRmllbGREYXRhVHlwZSA9IGZ1bmN0aW9uKG9EYXRhRmllbGQ6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMgfCBQcm9wZXJ0eSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdGxldCBzRGF0YVR5cGU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IChvRGF0YUZpZWxkIGFzIERhdGFGaWVsZEFic3RyYWN0VHlwZXMpLiRUeXBlO1xuXHRzd2l0Y2ggKHNEYXRhVHlwZSkge1xuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9yQWN0aW9uOlxuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uOlxuXHRcdFx0c0RhdGFUeXBlID0gdW5kZWZpbmVkO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZDpcblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhOYXZpZ2F0aW9uUGF0aDpcblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhVcmw6XG5cdFx0XHRzRGF0YVR5cGUgPSAob0RhdGFGaWVsZCBhcyBEYXRhRmllbGQpPy5WYWx1ZT8uJHRhcmdldD8udHlwZTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBbm5vdGF0aW9uOlxuXHRcdGRlZmF1bHQ6XG5cdFx0XHRjb25zdCBzRGF0YVR5cGVGb3JEYXRhRmllbGRGb3JBbm5vdGF0aW9uID0gKG9EYXRhRmllbGQgYXMgRGF0YUZpZWxkRm9yQW5ub3RhdGlvbikuVGFyZ2V0Py4kdGFyZ2V0LiRUeXBlO1xuXHRcdFx0aWYgKHNEYXRhVHlwZUZvckRhdGFGaWVsZEZvckFubm90YXRpb24pIHtcblx0XHRcdFx0aWYgKChvRGF0YUZpZWxkIGFzIERhdGFGaWVsZEZvckFubm90YXRpb24pLlRhcmdldD8uJHRhcmdldC4kVHlwZSA9PT0gQ29tbXVuaWNhdGlvbkFubm90YXRpb25UeXBlcy5Db250YWN0VHlwZSkge1xuXHRcdFx0XHRcdHNEYXRhVHlwZSA9ICgoKG9EYXRhRmllbGQgYXMgRGF0YUZpZWxkRm9yQW5ub3RhdGlvbikuVGFyZ2V0Py4kdGFyZ2V0IGFzIENvbnRhY3QpPy5mbiBhcyBhbnkpLiR0YXJnZXQ/LnR5cGU7XG5cdFx0XHRcdH0gZWxzZSBpZiAoKG9EYXRhRmllbGQgYXMgRGF0YUZpZWxkRm9yQW5ub3RhdGlvbikuVGFyZ2V0Py4kdGFyZ2V0LiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhUG9pbnRUeXBlKSB7XG5cdFx0XHRcdFx0c0RhdGFUeXBlID1cblx0XHRcdFx0XHRcdCgob0RhdGFGaWVsZCBhcyBEYXRhRmllbGRGb3JBbm5vdGF0aW9uKS5UYXJnZXQ/LiR0YXJnZXQgYXMgRGF0YVBvaW50KT8uVmFsdWU/LiRQYXRoPy4kVHlwZSB8fFxuXHRcdFx0XHRcdFx0KChvRGF0YUZpZWxkIGFzIERhdGFGaWVsZEZvckFubm90YXRpb24pLlRhcmdldD8uJHRhcmdldCBhcyBEYXRhUG9pbnQpPy5WYWx1ZT8uJHRhcmdldC50eXBlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIGUuZy4gRmllbGRHcm91cCBvciBDaGFydFxuXHRcdFx0XHRcdHNEYXRhVHlwZSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c0RhdGFUeXBlID0gdW5kZWZpbmVkO1xuXHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdH1cblxuXHRyZXR1cm4gc0RhdGFUeXBlO1xufTtcbiJdfQ==