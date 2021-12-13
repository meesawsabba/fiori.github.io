/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/templating/UIFormatters", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/core/converters/helpers/BindingHelper", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/templating/PropertyHelper", "sap/fe/core/formatters/ValueFormatter", "sap/fe/core/templating/FieldControlHelper"], function (UIFormatters, DataModelPathHelper, BindingHelper, BindingExpression, PropertyHelper, valueFormatters, FieldControlHelper) {
  "use strict";

  var _exports = {};
  var isReadOnlyExpression = FieldControlHelper.isReadOnlyExpression;
  var getAssociatedTextPropertyPath = PropertyHelper.getAssociatedTextPropertyPath;
  var hasValueHelp = PropertyHelper.hasValueHelp;
  var getAssociatedCurrencyPropertyPath = PropertyHelper.getAssociatedCurrencyPropertyPath;
  var getAssociatedUnitPropertyPath = PropertyHelper.getAssociatedUnitPropertyPath;
  var isProperty = PropertyHelper.isProperty;
  var getAssociatedCurrencyProperty = PropertyHelper.getAssociatedCurrencyProperty;
  var getAssociatedUnitProperty = PropertyHelper.getAssociatedUnitProperty;
  var isPathExpression = PropertyHelper.isPathExpression;
  var not = BindingExpression.not;
  var equal = BindingExpression.equal;
  var ifElse = BindingExpression.ifElse;
  var or = BindingExpression.or;
  var and = BindingExpression.and;
  var bindingExpression = BindingExpression.bindingExpression;
  var constant = BindingExpression.constant;
  var compileBinding = BindingExpression.compileBinding;
  var transformRecursively = BindingExpression.transformRecursively;
  var formatResult = BindingExpression.formatResult;
  var annotationExpression = BindingExpression.annotationExpression;
  var UI = BindingHelper.UI;
  var getContextRelativeTargetObjectPath = DataModelPathHelper.getContextRelativeTargetObjectPath;
  var getPathRelativeLocation = DataModelPathHelper.getPathRelativeLocation;
  var enhanceDataModelPath = DataModelPathHelper.enhanceDataModelPath;
  var formatWithTypeInformation = UIFormatters.formatWithTypeInformation;
  var getBindingWithUnitOrCurrency = UIFormatters.getBindingWithUnitOrCurrency;
  var getDisplayMode = UIFormatters.getDisplayMode;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  /**
   * Recursively add the text arrangement to a binding expression.
   *
   * @param bindingExpression The binding expression to be enhanced
   * @param fullContextPath The current context path we're on (to properly resolve the text arrangement properties)
   * @returns An updated expression containing the text arrangement binding.
   */
  var addTextArrangementToBindingExpression = function (bindingExpression, fullContextPath) {
    return transformRecursively(bindingExpression, "Binding", function (expression) {
      var outExpression = expression;

      if (expression.modelName === undefined) {
        // In case of default model we then need to resolve the text arrangement property
        var oPropertyDataModelPath = enhanceDataModelPath(fullContextPath, expression.path);
        outExpression = getBindingWithTextArrangement(oPropertyDataModelPath, expression);
      }

      return outExpression;
    });
  };

  _exports.addTextArrangementToBindingExpression = addTextArrangementToBindingExpression;

  var getBindingWithTextArrangement = function (oPropertyDataModelPath, propertyBindingExpression, fieldFormatOptions) {
    var _oPropertyDefinition$, _oPropertyDefinition$2;

    var targetDisplayModeOverride = fieldFormatOptions === null || fieldFormatOptions === void 0 ? void 0 : fieldFormatOptions.displayMode;
    var outExpression = propertyBindingExpression;
    var oPropertyDefinition = oPropertyDataModelPath.targetObject.type === "PropertyPath" ? oPropertyDataModelPath.targetObject.$target : oPropertyDataModelPath.targetObject;
    var targetDisplayMode = targetDisplayModeOverride || getDisplayMode(oPropertyDefinition, oPropertyDataModelPath);
    var commonText = (_oPropertyDefinition$ = oPropertyDefinition.annotations) === null || _oPropertyDefinition$ === void 0 ? void 0 : (_oPropertyDefinition$2 = _oPropertyDefinition$.Common) === null || _oPropertyDefinition$2 === void 0 ? void 0 : _oPropertyDefinition$2.Text;
    var relativeLocation = getPathRelativeLocation(oPropertyDataModelPath.contextLocation, oPropertyDataModelPath.navigationProperties).map(function (np) {
      return np.name;
    });
    propertyBindingExpression = formatWithTypeInformation(oPropertyDefinition, propertyBindingExpression);

    if (targetDisplayMode !== "Value" && commonText) {
      switch (targetDisplayMode) {
        case "Description":
          outExpression = annotationExpression(commonText, relativeLocation);
          break;

        case "DescriptionValue":
          outExpression = formatResult([annotationExpression(commonText, relativeLocation), propertyBindingExpression], valueFormatters.formatWithBrackets);
          break;

        case "ValueDescription":
          outExpression = formatResult([propertyBindingExpression, annotationExpression(commonText, relativeLocation)], valueFormatters.formatWithBrackets);
          break;
      }
    }

    return outExpression;
  };

  _exports.getBindingWithTextArrangement = getBindingWithTextArrangement;

  var formatValueRecursively = function (bindingExpression, fullContextPath) {
    return transformRecursively(bindingExpression, "Binding", function (expression) {
      var outExpression = expression;

      if (expression.modelName === undefined) {
        // In case of default model we then need to resolve the text arrangement property
        var oPropertyDataModelPath = enhanceDataModelPath(fullContextPath, expression.path);
        outExpression = formatWithTypeInformation(oPropertyDataModelPath.targetObject, expression);
      }

      return outExpression;
    });
  };

  _exports.formatValueRecursively = formatValueRecursively;

  var getTextBinding = function (oPropertyDataModelObjectPath, fieldFormatOptions) {
    var _oPropertyDataModelOb, _oPropertyDataModelOb2, _oPropertyDataModelOb3, _oPropertyDataModelOb4, _oPropertyDataModelOb5, _oPropertyDataModelOb6, _oPropertyDataModelOb7, _oPropertyDataModelOb8, _oPropertyDataModelOb9, _oPropertyDataModelOb10;

    var asObject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (((_oPropertyDataModelOb = oPropertyDataModelObjectPath.targetObject) === null || _oPropertyDataModelOb === void 0 ? void 0 : _oPropertyDataModelOb.$Type) === "com.sap.vocabularies.UI.v1.DataField" || ((_oPropertyDataModelOb2 = oPropertyDataModelObjectPath.targetObject) === null || _oPropertyDataModelOb2 === void 0 ? void 0 : _oPropertyDataModelOb2.$Type) === "com.sap.vocabularies.UI.v1.DataPointType" || ((_oPropertyDataModelOb3 = oPropertyDataModelObjectPath.targetObject) === null || _oPropertyDataModelOb3 === void 0 ? void 0 : _oPropertyDataModelOb3.$Type) === "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath" || ((_oPropertyDataModelOb4 = oPropertyDataModelObjectPath.targetObject) === null || _oPropertyDataModelOb4 === void 0 ? void 0 : _oPropertyDataModelOb4.$Type) === "com.sap.vocabularies.UI.v1.DataFieldWithUrl") {
      // If there is no resolved property, the value is returned as a constant
      var fieldValue = oPropertyDataModelObjectPath.targetObject.Value || "";
      return compileBinding(constant(fieldValue));
    }

    if (isPathExpression(oPropertyDataModelObjectPath.targetObject) && oPropertyDataModelObjectPath.targetObject.$target) {
      var oNavPath = oPropertyDataModelObjectPath.targetEntityType.resolvePath(oPropertyDataModelObjectPath.targetObject.path, true);
      oPropertyDataModelObjectPath.targetObject = oNavPath.target;
      oNavPath.visitedObjects.forEach(function (oNavObj) {
        if ((oNavObj === null || oNavObj === void 0 ? void 0 : oNavObj._type) === "NavigationProperty") {
          oPropertyDataModelObjectPath.navigationProperties.push(oNavObj);
        }
      });
    }

    var oBindingExpression = bindingExpression(getContextRelativeTargetObjectPath(oPropertyDataModelObjectPath));
    var oTargetBinding;

    if ((_oPropertyDataModelOb5 = oPropertyDataModelObjectPath.targetObject) !== null && _oPropertyDataModelOb5 !== void 0 && (_oPropertyDataModelOb6 = _oPropertyDataModelOb5.annotations) !== null && _oPropertyDataModelOb6 !== void 0 && (_oPropertyDataModelOb7 = _oPropertyDataModelOb6.Measures) !== null && _oPropertyDataModelOb7 !== void 0 && _oPropertyDataModelOb7.Unit || (_oPropertyDataModelOb8 = oPropertyDataModelObjectPath.targetObject) !== null && _oPropertyDataModelOb8 !== void 0 && (_oPropertyDataModelOb9 = _oPropertyDataModelOb8.annotations) !== null && _oPropertyDataModelOb9 !== void 0 && (_oPropertyDataModelOb10 = _oPropertyDataModelOb9.Measures) !== null && _oPropertyDataModelOb10 !== void 0 && _oPropertyDataModelOb10.ISOCurrency) {
      oTargetBinding = getBindingWithUnitOrCurrency(oPropertyDataModelObjectPath, oBindingExpression);

      if ((fieldFormatOptions === null || fieldFormatOptions === void 0 ? void 0 : fieldFormatOptions.measureDisplayMode) === "Hidden") {
        // TODO: Refactor once types are less generic here
        oTargetBinding.formatOptions = _objectSpread(_objectSpread({}, oTargetBinding.formatOptions), {}, {
          showMeasure: false
        });
      }
    } else {
      oTargetBinding = getBindingWithTextArrangement(oPropertyDataModelObjectPath, oBindingExpression, fieldFormatOptions);
    }

    if (asObject) {
      return oTargetBinding;
    } // We don't include $$nopatch and parseKeepEmptyString as they make no sense in the text binding case


    return compileBinding(oTargetBinding);
  };

  _exports.getTextBinding = getTextBinding;

  var getValueBinding = function (oPropertyDataModelObjectPath, fieldFormatOptions) {
    var ignoreUnit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var ignoreFormatting = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var bindingParameters = arguments.length > 4 ? arguments[4] : undefined;
    var targetTypeAny = arguments.length > 5 ? arguments[5] : undefined;
    var showMeasureOnly = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;

    if (isPathExpression(oPropertyDataModelObjectPath.targetObject) && oPropertyDataModelObjectPath.targetObject.$target) {
      var oNavPath = oPropertyDataModelObjectPath.targetEntityType.resolvePath(oPropertyDataModelObjectPath.targetObject.path, true);
      oPropertyDataModelObjectPath.targetObject = oNavPath.target;
      oNavPath.visitedObjects.forEach(function (oNavObj) {
        if (oNavObj && oNavObj._type === "NavigationProperty") {
          oPropertyDataModelObjectPath.navigationProperties.push(oNavObj);
        }
      });
    }

    var targetObject = oPropertyDataModelObjectPath.targetObject;

    if (isProperty(targetObject)) {
      var _targetObject$annotat, _targetObject$annotat2;

      var oBindingExpression = bindingExpression(getContextRelativeTargetObjectPath(oPropertyDataModelObjectPath));

      if ((_targetObject$annotat = targetObject.annotations) !== null && _targetObject$annotat !== void 0 && (_targetObject$annotat2 = _targetObject$annotat.Communication) !== null && _targetObject$annotat2 !== void 0 && _targetObject$annotat2.IsEmailAddress) {
        oBindingExpression.type = "sap.fe.core.type.Email";
      } else {
        var oPropertyUnit = getAssociatedUnitProperty(oPropertyDataModelObjectPath.targetObject);
        var oPropertyCurrency = getAssociatedCurrencyProperty(oPropertyDataModelObjectPath.targetObject);

        if (!ignoreUnit && (oPropertyUnit || oPropertyCurrency)) {
          oBindingExpression = getBindingWithUnitOrCurrency(oPropertyDataModelObjectPath, oBindingExpression);

          if (oPropertyUnit && !hasValueHelp(oPropertyUnit) || oPropertyCurrency && !hasValueHelp(oPropertyCurrency) || (fieldFormatOptions === null || fieldFormatOptions === void 0 ? void 0 : fieldFormatOptions.measureDisplayMode) === "Hidden") {
            // If there is a unit or currency without a value help, or in case the currency should be explicitly hidden,
            // we need to configure the binding to not show the measure, otherwise it's needed for the mdc field
            if (!oBindingExpression.formatOptions) {
              oBindingExpression.formatOptions = {};
            }

            if (showMeasureOnly) {
              oBindingExpression.formatOptions.showNumber = false;
            } else {
              oBindingExpression.formatOptions.showMeasure = false;
            }
          }
        } else {
          oBindingExpression = formatWithTypeInformation(targetObject, oBindingExpression);

          if (oBindingExpression.type === "sap.ui.model.odata.type.String") {
            oBindingExpression.formatOptions = {
              parseKeepsEmptyString: true
            };
          }
        }
      }

      if (ignoreFormatting) {
        delete oBindingExpression.formatOptions;
        delete oBindingExpression.constraints;
        delete oBindingExpression.type;
      }

      if (bindingParameters) {
        oBindingExpression.parameters = bindingParameters;
      }

      if (targetTypeAny) {
        oBindingExpression.targetType = "any";
      }

      return compileBinding(oBindingExpression);
    } else {
      if ((targetObject === null || targetObject === void 0 ? void 0 : targetObject.$Type) === "com.sap.vocabularies.UI.v1.DataFieldWithUrl" || (targetObject === null || targetObject === void 0 ? void 0 : targetObject.$Type) === "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath") {
        return compileBinding(annotationExpression(targetObject.Value));
      } else {
        return "";
      }
    }
  };

  _exports.getValueBinding = getValueBinding;

  var getUnitBinding = function (oPropertyDataModelObjectPath, fieldFormatOptions) {
    var sUnitPropertyPath = getAssociatedUnitPropertyPath(oPropertyDataModelObjectPath.targetObject);
    var sCurrencyPropertyPath = getAssociatedCurrencyPropertyPath(oPropertyDataModelObjectPath.targetObject);

    if (sUnitPropertyPath || sCurrencyPropertyPath) {
      var targetPropertyPath = sUnitPropertyPath || sCurrencyPropertyPath;
      var oUOMPropertyDataModelObjectPath = enhanceDataModelPath(oPropertyDataModelObjectPath, targetPropertyPath);
      return getValueBinding(oUOMPropertyDataModelObjectPath, fieldFormatOptions);
    }

    return undefined;
  };

  _exports.getUnitBinding = getUnitBinding;

  var getAssociatedTextBinding = function (oPropertyDataModelObjectPath, fieldFormatOptions) {
    var textPropertyPath = getAssociatedTextPropertyPath(oPropertyDataModelObjectPath.targetObject);

    if (textPropertyPath) {
      var oTextPropertyPath = enhanceDataModelPath(oPropertyDataModelObjectPath, textPropertyPath);
      var oValueBinding = getValueBinding(oTextPropertyPath, fieldFormatOptions, true, true, {
        $$noPatch: true
      });
      return oValueBinding;
    }

    return undefined;
  };

  _exports.getAssociatedTextBinding = getAssociatedTextBinding;

  var getDisplayStyle = function (oPropertyPath, oDataField, oDataModelPath, fieldFormatOptions, semanticObject) {
    var _oProperty$annotation, _oProperty$annotation2, _oProperty$annotation3, _oProperty$annotation4, _oProperty$annotation5, _oProperty$annotation6, _oProperty$annotation7, _oProperty$annotation8, _oDataField$Target, _oDataField$Target$$t, _oDataField$Target2, _oDataField$Target2$$, _oDataModelPath$targe, _oDataModelPath$targe2, _oDataModelPath$targe3, _oProperty$annotation9, _oProperty$annotation10, _oProperty$annotation11, _oProperty$annotation12, _oProperty$annotation13, _oProperty$annotation14, _oProperty$annotation15, _oProperty$annotation16, _oDataModelPath$targe7, _oProperty$annotation17, _oProperty$annotation18;

    // algorithm to determine the field fragment to use
    var oProperty = isPathExpression(oPropertyPath) && oPropertyPath.$target || oPropertyPath;

    if (semanticObject && !((_oProperty$annotation = oProperty.annotations) !== null && _oProperty$annotation !== void 0 && (_oProperty$annotation2 = _oProperty$annotation.UI) !== null && _oProperty$annotation2 !== void 0 && _oProperty$annotation2.IsImageURL) && !(oProperty.type === "Edm.Stream") && !((_oProperty$annotation3 = oProperty.annotations) !== null && _oProperty$annotation3 !== void 0 && (_oProperty$annotation4 = _oProperty$annotation3.Communication) !== null && _oProperty$annotation4 !== void 0 && _oProperty$annotation4.IsEmailAddress || (_oProperty$annotation5 = oProperty.annotations) !== null && _oProperty$annotation5 !== void 0 && (_oProperty$annotation6 = _oProperty$annotation5.Communication) !== null && _oProperty$annotation6 !== void 0 && _oProperty$annotation6.IsPhoneNumber)) {
      return "LinkWithQuickViewForm";
    }

    if (!oPropertyPath || typeof oPropertyPath === "string") {
      return "Text";
    }

    if (oProperty.type === "Edm.Stream") {
      return "File";
    }

    if ((_oProperty$annotation7 = oProperty.annotations) !== null && _oProperty$annotation7 !== void 0 && (_oProperty$annotation8 = _oProperty$annotation7.UI) !== null && _oProperty$annotation8 !== void 0 && _oProperty$annotation8.IsImageURL) {
      return "Avatar";
    }

    switch (oDataField.$Type) {
      case "com.sap.vocabularies.UI.v1.DataPointType":
        return "DataPoint";

      case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
        if (((_oDataField$Target = oDataField.Target) === null || _oDataField$Target === void 0 ? void 0 : (_oDataField$Target$$t = _oDataField$Target.$target) === null || _oDataField$Target$$t === void 0 ? void 0 : _oDataField$Target$$t.$Type) === "com.sap.vocabularies.UI.v1.DataPointType") {
          return "DataPoint";
        } else if (((_oDataField$Target2 = oDataField.Target) === null || _oDataField$Target2 === void 0 ? void 0 : (_oDataField$Target2$$ = _oDataField$Target2.$target) === null || _oDataField$Target2$$ === void 0 ? void 0 : _oDataField$Target2$$.$Type) === "com.sap.vocabularies.Communication.v1.ContactType") {
          return "Contact";
        }

        break;

      case "com.sap.vocabularies.UI.v1.DataFieldForAction":
      case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
        return "Button";

      case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
        return "Link";
    }

    if (oDataModelPath !== null && oDataModelPath !== void 0 && (_oDataModelPath$targe = oDataModelPath.targetEntityType) !== null && _oDataModelPath$targe !== void 0 && (_oDataModelPath$targe2 = _oDataModelPath$targe.annotations) !== null && _oDataModelPath$targe2 !== void 0 && (_oDataModelPath$targe3 = _oDataModelPath$targe2.Common) !== null && _oDataModelPath$targe3 !== void 0 && _oDataModelPath$targe3.SemanticKey) {
      var aSemanticKeys = oDataModelPath.targetEntityType.annotations.Common.SemanticKey;
      var bIsSemanticKey = !aSemanticKeys.every(function (oKey) {
        var _oKey$$target;

        return (oKey === null || oKey === void 0 ? void 0 : (_oKey$$target = oKey.$target) === null || _oKey$$target === void 0 ? void 0 : _oKey$$target.name) !== oProperty.name;
      });

      if (bIsSemanticKey && fieldFormatOptions.semanticKeyStyle) {
        var _oDataModelPath$targe4, _oDataModelPath$targe5, _oDataModelPath$targe6;

        if ((_oDataModelPath$targe4 = oDataModelPath.targetEntitySet) !== null && _oDataModelPath$targe4 !== void 0 && (_oDataModelPath$targe5 = _oDataModelPath$targe4.annotations) !== null && _oDataModelPath$targe5 !== void 0 && (_oDataModelPath$targe6 = _oDataModelPath$targe5.Common) !== null && _oDataModelPath$targe6 !== void 0 && _oDataModelPath$targe6.DraftRoot) {
          // && fieldFormatOptions.hasDraftIndicator) {
          // we then still check whether this is available at designtime on the entityset
          return "SemanticKeyWithDraftIndicator";
        }

        return fieldFormatOptions.semanticKeyStyle === "ObjectIdentifier" ? "ObjectIdentifier" : "LabelSemanticKey";
      }
    }

    if (oDataField.Criticality) {
      return "ObjectStatus";
    }

    if ((_oProperty$annotation9 = oProperty.annotations) !== null && _oProperty$annotation9 !== void 0 && (_oProperty$annotation10 = _oProperty$annotation9.Measures) !== null && _oProperty$annotation10 !== void 0 && _oProperty$annotation10.ISOCurrency) {
      if (fieldFormatOptions.measureDisplayMode === "Hidden") {
        return "Text";
      }

      return "AmountWithCurrency";
    }

    if ((_oProperty$annotation11 = oProperty.annotations) !== null && _oProperty$annotation11 !== void 0 && (_oProperty$annotation12 = _oProperty$annotation11.Communication) !== null && _oProperty$annotation12 !== void 0 && _oProperty$annotation12.IsEmailAddress || (_oProperty$annotation13 = oProperty.annotations) !== null && _oProperty$annotation13 !== void 0 && (_oProperty$annotation14 = _oProperty$annotation13.Communication) !== null && _oProperty$annotation14 !== void 0 && _oProperty$annotation14.IsPhoneNumber) {
      return "Link";
    }

    if ((_oProperty$annotation15 = oProperty.annotations) !== null && _oProperty$annotation15 !== void 0 && (_oProperty$annotation16 = _oProperty$annotation15.UI) !== null && _oProperty$annotation16 !== void 0 && _oProperty$annotation16.MultiLineText) {
      return "ExpandableText";
    }

    var aNavigationProperties = (oDataModelPath === null || oDataModelPath === void 0 ? void 0 : (_oDataModelPath$targe7 = oDataModelPath.targetEntityType) === null || _oDataModelPath$targe7 === void 0 ? void 0 : _oDataModelPath$targe7.navigationProperties) || [];
    var bIsUsedInNavigationWithQuickViewFacets = false;
    aNavigationProperties.forEach(function (oNavProp) {
      if (oNavProp.referentialConstraint && oNavProp.referentialConstraint.length) {
        oNavProp.referentialConstraint.forEach(function (oRefConstraint) {
          if ((oRefConstraint === null || oRefConstraint === void 0 ? void 0 : oRefConstraint.sourceProperty) === oProperty.name) {
            var _oNavProp$targetType, _oNavProp$targetType$, _oNavProp$targetType$2;

            if (oNavProp !== null && oNavProp !== void 0 && (_oNavProp$targetType = oNavProp.targetType) !== null && _oNavProp$targetType !== void 0 && (_oNavProp$targetType$ = _oNavProp$targetType.annotations) !== null && _oNavProp$targetType$ !== void 0 && (_oNavProp$targetType$2 = _oNavProp$targetType$.UI) !== null && _oNavProp$targetType$2 !== void 0 && _oNavProp$targetType$2.QuickViewFacets) {
              bIsUsedInNavigationWithQuickViewFacets = true;
            }
          }
        });
      }
    });

    if (bIsUsedInNavigationWithQuickViewFacets) {
      return "LinkWithQuickViewForm";
    }

    if ((_oProperty$annotation17 = oProperty.annotations) !== null && _oProperty$annotation17 !== void 0 && (_oProperty$annotation18 = _oProperty$annotation17.Common) !== null && _oProperty$annotation18 !== void 0 && _oProperty$annotation18.SemanticObject) {
      return "LinkWrapper";
    }

    if (oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithUrl") {
      return "Link";
    }

    return "Text";
  };

  _exports.getDisplayStyle = getDisplayStyle;

  var getEditStyle = function (oPropertyPath, oDataField, oFieldFormatOptions) {
    var _oDataField$Target3, _oDataField$Target3$$, _oDataField$Target4, _oDataField$Target4$$, _oProperty$annotation19, _oProperty$annotation20, _oProperty$annotation21, _oProperty$annotation22, _oProperty$annotation23, _oProperty$annotation24, _oProperty$annotation25;

    // algorithm to determine the field fragment to use
    if (!oPropertyPath || typeof oPropertyPath === "string") {
      return null;
    }

    var oProperty = isPathExpression(oPropertyPath) && oPropertyPath.$target || oPropertyPath;

    if (oProperty.type === "Edm.Stream") {
      return "File";
    }

    switch (oDataField.$Type) {
      case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
        if (((_oDataField$Target3 = oDataField.Target) === null || _oDataField$Target3 === void 0 ? void 0 : (_oDataField$Target3$$ = _oDataField$Target3.$target) === null || _oDataField$Target3$$ === void 0 ? void 0 : _oDataField$Target3$$.$Type) === "com.sap.vocabularies.Communication.v1.ContactType") {
          return null;
        } else if (((_oDataField$Target4 = oDataField.Target) === null || _oDataField$Target4 === void 0 ? void 0 : (_oDataField$Target4$$ = _oDataField$Target4.$target) === null || _oDataField$Target4$$ === void 0 ? void 0 : _oDataField$Target4$$.Visualization) === "UI.VisualizationType/Rating") {
          return "RatingIndicator";
        }

        break;

      case "com.sap.vocabularies.UI.v1.DataPointType":
        if ((oDataField === null || oDataField === void 0 ? void 0 : oDataField.Visualization) === "UI.VisualizationType/Rating") {
          return "RatingIndicator";
        }

        break;

      case "com.sap.vocabularies.UI.v1.DataFieldForAction":
      case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
      case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
        return null;
    }

    var oPropertyUnit = getAssociatedUnitProperty(oProperty);
    var oPropertyCurrency = getAssociatedCurrencyProperty(oProperty);

    if (PropertyHelper.hasValueHelp(oProperty) && oProperty.type !== "Edm.Boolean" || oPropertyUnit && PropertyHelper.hasValueHelp(oPropertyUnit) || oPropertyCurrency && PropertyHelper.hasValueHelp(oPropertyCurrency)) {
      if ((oFieldFormatOptions === null || oFieldFormatOptions === void 0 ? void 0 : oFieldFormatOptions.measureDisplayMode) === "Hidden") {
        return "Input";
      }

      return "InputWithValueHelp";
    }

    if ((_oProperty$annotation19 = oProperty.annotations) !== null && _oProperty$annotation19 !== void 0 && (_oProperty$annotation20 = _oProperty$annotation19.UI) !== null && _oProperty$annotation20 !== void 0 && (_oProperty$annotation21 = _oProperty$annotation20.MultiLineText) !== null && _oProperty$annotation21 !== void 0 && _oProperty$annotation21.valueOf() && oProperty.type === "Edm.String") {
      return "TextArea";
    }

    switch (oProperty.type) {
      case "Edm.Date":
        return "DatePicker";

      case "Edm.Time":
      case "Edm.TimeOfDay":
        return "TimePicker";

      case "Edm.DateTime":
      case "Edm.DateTimeOffset":
        return "DateTimePicker";

      case "Edm.Boolean":
        return "CheckBox";
    }

    if ((_oProperty$annotation22 = oProperty.annotations) !== null && _oProperty$annotation22 !== void 0 && (_oProperty$annotation23 = _oProperty$annotation22.Measures) !== null && _oProperty$annotation23 !== void 0 && _oProperty$annotation23.ISOCurrency || (_oProperty$annotation24 = oProperty.annotations) !== null && _oProperty$annotation24 !== void 0 && (_oProperty$annotation25 = _oProperty$annotation24.Measures) !== null && _oProperty$annotation25 !== void 0 && _oProperty$annotation25.Unit) {
      return "InputWithUnit";
    }

    return "Input";
  };
  /**
   * Returns the binding expression to evaluate the visibility of a DataField or DataPoint annotation.
   *
   * SAP Fiori elements will evaluate either the UI.Hidden annotation defined on the annotation itself or on the target property.
   *
   * @param {DataModelObjectPath} dataFieldModelPath The metapath referring to the annotation we are evaluating.
   * @param {FieldFormatOptions} [formatOptions] FormatOptions optional.
   * @returns {BindingExpression<string>} An expression that you can bind to the UI.
   */


  _exports.getEditStyle = getEditStyle;

  var getVisibleExpression = function (dataFieldModelPath, formatOptions) {
    var _targetObject$Target, _targetObject$Target$, _targetObject$annotat3, _targetObject$annotat4, _propertyValue$annota, _propertyValue$annota2;

    var targetObject = dataFieldModelPath.targetObject;
    var propertyValue;

    if (targetObject) {
      switch (targetObject.$Type) {
        case "com.sap.vocabularies.UI.v1.DataField":
        case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
        case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
        case "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation":
        case "com.sap.vocabularies.UI.v1.DataFieldWithAction":
        case "com.sap.vocabularies.UI.v1.DataPointType":
          propertyValue = targetObject.Value.$target;
          break;

        case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
          // if it is a DataFieldForAnnotation pointing to a DataPoint we look at the dataPoint's value
          if ((targetObject === null || targetObject === void 0 ? void 0 : (_targetObject$Target = targetObject.Target) === null || _targetObject$Target === void 0 ? void 0 : (_targetObject$Target$ = _targetObject$Target.$target) === null || _targetObject$Target$ === void 0 ? void 0 : _targetObject$Target$.$Type) === "com.sap.vocabularies.UI.v1.DataPointType") {
            var _targetObject$Target$2;

            propertyValue = (_targetObject$Target$2 = targetObject.Target.$target) === null || _targetObject$Target$2 === void 0 ? void 0 : _targetObject$Target$2.Value.$target;
            break;
          }

        // eslint-disable-next-line no-fallthrough

        case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
        case "com.sap.vocabularies.UI.v1.DataFieldForAction":
        default:
          propertyValue = undefined;
      }
    }

    var isAnalyticalGroupHeaderExpanded = formatOptions !== null && formatOptions !== void 0 && formatOptions.isAnalytics ? UI.IsExpanded : constant(false);
    var isAnalyticalLeaf = formatOptions !== null && formatOptions !== void 0 && formatOptions.isAnalytics ? equal(UI.NodeLevel, 0) : constant(false); // A data field is visible if:
    // - the UI.Hidden expression in the original annotation does not evaluate to 'true'
    // - the UI.Hidden expression in the target property does not evaluate to 'true'
    // - in case of Analytics it's not visible for an expanded GroupHeader

    return compileBinding(and.apply(void 0, [not(equal(annotationExpression(targetObject === null || targetObject === void 0 ? void 0 : (_targetObject$annotat3 = targetObject.annotations) === null || _targetObject$annotat3 === void 0 ? void 0 : (_targetObject$annotat4 = _targetObject$annotat3.UI) === null || _targetObject$annotat4 === void 0 ? void 0 : _targetObject$annotat4.Hidden), true)), ifElse(!!propertyValue, propertyValue && not(equal(annotationExpression((_propertyValue$annota = propertyValue.annotations) === null || _propertyValue$annota === void 0 ? void 0 : (_propertyValue$annota2 = _propertyValue$annota.UI) === null || _propertyValue$annota2 === void 0 ? void 0 : _propertyValue$annota2.Hidden), true)), true), or(not(isAnalyticalGroupHeaderExpanded), isAnalyticalLeaf)]));
  };

  _exports.getVisibleExpression = getVisibleExpression;

  var getInputDescription = function (oPropertyPath, descriptionBindingExpression) {
    var oProperty = isPathExpression(oPropertyPath) && oPropertyPath.$target || oPropertyPath;
    var unitProperty = getAssociatedCurrencyProperty(oProperty) || getAssociatedUnitProperty(oProperty);

    if (!unitProperty) {
      return compileBinding("");
    }

    var editableExpression = and(not(isReadOnlyExpression(unitProperty)), not(PropertyHelper.isComputed(unitProperty)));
    return compileBinding(ifElse(editableExpression, "", descriptionBindingExpression));
  };

  _exports.getInputDescription = getInputDescription;

  var QVTextBinding = function (oPropertyDataModelObjectPath, oPropertyValueDataModelObjectPath, fieldFormatOptions) {
    var asObject = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var returnValue = getValueBinding(oPropertyDataModelObjectPath, fieldFormatOptions, asObject);

    if (returnValue === "") {
      returnValue = getTextBinding(oPropertyValueDataModelObjectPath, fieldFormatOptions, asObject);
    }

    return returnValue;
  };

  _exports.QVTextBinding = QVTextBinding;

  var getQuickViewType = function (oPropertyDataModelObjectPath) {
    var _targetObject$$target, _targetObject$$target2, _targetObject$$target3, _targetObject$$target4, _targetObject$$target5, _targetObject$$target6;

    var targetObject = oPropertyDataModelObjectPath.targetObject;

    if (targetObject !== null && targetObject !== void 0 && (_targetObject$$target = targetObject.$target) !== null && _targetObject$$target !== void 0 && (_targetObject$$target2 = _targetObject$$target.annotations) !== null && _targetObject$$target2 !== void 0 && (_targetObject$$target3 = _targetObject$$target2.Communication) !== null && _targetObject$$target3 !== void 0 && _targetObject$$target3.IsEmailAddress) {
      return "email";
    }

    if (targetObject !== null && targetObject !== void 0 && (_targetObject$$target4 = targetObject.$target) !== null && _targetObject$$target4 !== void 0 && (_targetObject$$target5 = _targetObject$$target4.annotations) !== null && _targetObject$$target5 !== void 0 && (_targetObject$$target6 = _targetObject$$target5.Communication) !== null && _targetObject$$target6 !== void 0 && _targetObject$$target6.IsPhoneNumber) {
      return "phone";
    }

    return "text";
  };

  _exports.getQuickViewType = getQuickViewType;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZpZWxkVGVtcGxhdGluZy50cyJdLCJuYW1lcyI6WyJhZGRUZXh0QXJyYW5nZW1lbnRUb0JpbmRpbmdFeHByZXNzaW9uIiwiYmluZGluZ0V4cHJlc3Npb24iLCJmdWxsQ29udGV4dFBhdGgiLCJ0cmFuc2Zvcm1SZWN1cnNpdmVseSIsImV4cHJlc3Npb24iLCJvdXRFeHByZXNzaW9uIiwibW9kZWxOYW1lIiwidW5kZWZpbmVkIiwib1Byb3BlcnR5RGF0YU1vZGVsUGF0aCIsImVuaGFuY2VEYXRhTW9kZWxQYXRoIiwicGF0aCIsImdldEJpbmRpbmdXaXRoVGV4dEFycmFuZ2VtZW50IiwicHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbiIsImZpZWxkRm9ybWF0T3B0aW9ucyIsInRhcmdldERpc3BsYXlNb2RlT3ZlcnJpZGUiLCJkaXNwbGF5TW9kZSIsIm9Qcm9wZXJ0eURlZmluaXRpb24iLCJ0YXJnZXRPYmplY3QiLCJ0eXBlIiwiJHRhcmdldCIsInRhcmdldERpc3BsYXlNb2RlIiwiZ2V0RGlzcGxheU1vZGUiLCJjb21tb25UZXh0IiwiYW5ub3RhdGlvbnMiLCJDb21tb24iLCJUZXh0IiwicmVsYXRpdmVMb2NhdGlvbiIsImdldFBhdGhSZWxhdGl2ZUxvY2F0aW9uIiwiY29udGV4dExvY2F0aW9uIiwibmF2aWdhdGlvblByb3BlcnRpZXMiLCJtYXAiLCJucCIsIm5hbWUiLCJmb3JtYXRXaXRoVHlwZUluZm9ybWF0aW9uIiwiYW5ub3RhdGlvbkV4cHJlc3Npb24iLCJmb3JtYXRSZXN1bHQiLCJ2YWx1ZUZvcm1hdHRlcnMiLCJmb3JtYXRXaXRoQnJhY2tldHMiLCJmb3JtYXRWYWx1ZVJlY3Vyc2l2ZWx5IiwiZ2V0VGV4dEJpbmRpbmciLCJvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoIiwiYXNPYmplY3QiLCIkVHlwZSIsImZpZWxkVmFsdWUiLCJWYWx1ZSIsImNvbXBpbGVCaW5kaW5nIiwiY29uc3RhbnQiLCJpc1BhdGhFeHByZXNzaW9uIiwib05hdlBhdGgiLCJ0YXJnZXRFbnRpdHlUeXBlIiwicmVzb2x2ZVBhdGgiLCJ0YXJnZXQiLCJ2aXNpdGVkT2JqZWN0cyIsImZvckVhY2giLCJvTmF2T2JqIiwiX3R5cGUiLCJwdXNoIiwib0JpbmRpbmdFeHByZXNzaW9uIiwiZ2V0Q29udGV4dFJlbGF0aXZlVGFyZ2V0T2JqZWN0UGF0aCIsIm9UYXJnZXRCaW5kaW5nIiwiTWVhc3VyZXMiLCJVbml0IiwiSVNPQ3VycmVuY3kiLCJnZXRCaW5kaW5nV2l0aFVuaXRPckN1cnJlbmN5IiwibWVhc3VyZURpc3BsYXlNb2RlIiwiZm9ybWF0T3B0aW9ucyIsInNob3dNZWFzdXJlIiwiZ2V0VmFsdWVCaW5kaW5nIiwiaWdub3JlVW5pdCIsImlnbm9yZUZvcm1hdHRpbmciLCJiaW5kaW5nUGFyYW1ldGVycyIsInRhcmdldFR5cGVBbnkiLCJzaG93TWVhc3VyZU9ubHkiLCJpc1Byb3BlcnR5IiwiQ29tbXVuaWNhdGlvbiIsIklzRW1haWxBZGRyZXNzIiwib1Byb3BlcnR5VW5pdCIsImdldEFzc29jaWF0ZWRVbml0UHJvcGVydHkiLCJvUHJvcGVydHlDdXJyZW5jeSIsImdldEFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5IiwiaGFzVmFsdWVIZWxwIiwic2hvd051bWJlciIsInBhcnNlS2VlcHNFbXB0eVN0cmluZyIsImNvbnN0cmFpbnRzIiwicGFyYW1ldGVycyIsInRhcmdldFR5cGUiLCJnZXRVbml0QmluZGluZyIsInNVbml0UHJvcGVydHlQYXRoIiwiZ2V0QXNzb2NpYXRlZFVuaXRQcm9wZXJ0eVBhdGgiLCJzQ3VycmVuY3lQcm9wZXJ0eVBhdGgiLCJnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eVBhdGgiLCJ0YXJnZXRQcm9wZXJ0eVBhdGgiLCJvVU9NUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoIiwiZ2V0QXNzb2NpYXRlZFRleHRCaW5kaW5nIiwidGV4dFByb3BlcnR5UGF0aCIsImdldEFzc29jaWF0ZWRUZXh0UHJvcGVydHlQYXRoIiwib1RleHRQcm9wZXJ0eVBhdGgiLCJvVmFsdWVCaW5kaW5nIiwiJCRub1BhdGNoIiwiZ2V0RGlzcGxheVN0eWxlIiwib1Byb3BlcnR5UGF0aCIsIm9EYXRhRmllbGQiLCJvRGF0YU1vZGVsUGF0aCIsInNlbWFudGljT2JqZWN0Iiwib1Byb3BlcnR5IiwiVUkiLCJJc0ltYWdlVVJMIiwiSXNQaG9uZU51bWJlciIsIlRhcmdldCIsIlNlbWFudGljS2V5IiwiYVNlbWFudGljS2V5cyIsImJJc1NlbWFudGljS2V5IiwiZXZlcnkiLCJvS2V5Iiwic2VtYW50aWNLZXlTdHlsZSIsInRhcmdldEVudGl0eVNldCIsIkRyYWZ0Um9vdCIsIkNyaXRpY2FsaXR5IiwiTXVsdGlMaW5lVGV4dCIsImFOYXZpZ2F0aW9uUHJvcGVydGllcyIsImJJc1VzZWRJbk5hdmlnYXRpb25XaXRoUXVpY2tWaWV3RmFjZXRzIiwib05hdlByb3AiLCJyZWZlcmVudGlhbENvbnN0cmFpbnQiLCJsZW5ndGgiLCJvUmVmQ29uc3RyYWludCIsInNvdXJjZVByb3BlcnR5IiwiUXVpY2tWaWV3RmFjZXRzIiwiU2VtYW50aWNPYmplY3QiLCJnZXRFZGl0U3R5bGUiLCJvRmllbGRGb3JtYXRPcHRpb25zIiwiVmlzdWFsaXphdGlvbiIsIlByb3BlcnR5SGVscGVyIiwidmFsdWVPZiIsImdldFZpc2libGVFeHByZXNzaW9uIiwiZGF0YUZpZWxkTW9kZWxQYXRoIiwicHJvcGVydHlWYWx1ZSIsImlzQW5hbHl0aWNhbEdyb3VwSGVhZGVyRXhwYW5kZWQiLCJpc0FuYWx5dGljcyIsIklzRXhwYW5kZWQiLCJpc0FuYWx5dGljYWxMZWFmIiwiZXF1YWwiLCJOb2RlTGV2ZWwiLCJhbmQiLCJub3QiLCJIaWRkZW4iLCJpZkVsc2UiLCJvciIsImdldElucHV0RGVzY3JpcHRpb24iLCJkZXNjcmlwdGlvbkJpbmRpbmdFeHByZXNzaW9uIiwidW5pdFByb3BlcnR5IiwiZWRpdGFibGVFeHByZXNzaW9uIiwiaXNSZWFkT25seUV4cHJlc3Npb24iLCJpc0NvbXB1dGVkIiwiUVZUZXh0QmluZGluZyIsIm9Qcm9wZXJ0eVZhbHVlRGF0YU1vZGVsT2JqZWN0UGF0aCIsInJldHVyblZhbHVlIiwiZ2V0UXVpY2tWaWV3VHlwZSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sTUFBTUEscUNBQXFDLEdBQUcsVUFDcERDLGlCQURvRCxFQUVwREMsZUFGb0QsRUFHbEM7QUFDbEIsV0FBT0Msb0JBQW9CLENBQUNGLGlCQUFELEVBQW9CLFNBQXBCLEVBQStCLFVBQUNHLFVBQUQsRUFBa0Q7QUFDM0csVUFBSUMsYUFBOEIsR0FBR0QsVUFBckM7O0FBQ0EsVUFBSUEsVUFBVSxDQUFDRSxTQUFYLEtBQXlCQyxTQUE3QixFQUF3QztBQUN2QztBQUNBLFlBQU1DLHNCQUFzQixHQUFHQyxvQkFBb0IsQ0FBQ1AsZUFBRCxFQUFrQkUsVUFBVSxDQUFDTSxJQUE3QixDQUFuRDtBQUNBTCxRQUFBQSxhQUFhLEdBQUdNLDZCQUE2QixDQUFDSCxzQkFBRCxFQUF5QkosVUFBekIsQ0FBN0M7QUFDQTs7QUFDRCxhQUFPQyxhQUFQO0FBQ0EsS0FSMEIsQ0FBM0I7QUFTQSxHQWJNOzs7O0FBZUEsTUFBTU0sNkJBQTZCLEdBQUcsVUFDNUNILHNCQUQ0QyxFQUU1Q0kseUJBRjRDLEVBRzVDQyxrQkFINEMsRUFJdkI7QUFBQTs7QUFDckIsUUFBTUMseUJBQXlCLEdBQUdELGtCQUFILGFBQUdBLGtCQUFILHVCQUFHQSxrQkFBa0IsQ0FBRUUsV0FBdEQ7QUFDQSxRQUFJVixhQUFhLEdBQUdPLHlCQUFwQjtBQUNBLFFBQU1JLG1CQUFtQixHQUN4QlIsc0JBQXNCLENBQUNTLFlBQXZCLENBQW9DQyxJQUFwQyxLQUE2QyxjQUE3QyxHQUNJVixzQkFBc0IsQ0FBQ1MsWUFBdkIsQ0FBb0NFLE9BRHhDLEdBRUlYLHNCQUFzQixDQUFDUyxZQUg1QjtBQUlBLFFBQU1HLGlCQUFpQixHQUFHTix5QkFB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LENBQUN2QixZQUFsRDs7QUFDQSxRQUFJQSxZQUFKLGFBQUlBLFlBQUosd0NBQUlBLFlBQVksQ0FBRUUsT0FBbEIsNEVBQUksc0JBQXVCSSxXQUEzQiw2RUFBSSx1QkFBb0NtRCxhQUF4QyxtREFBSSx1QkFBbURDLGNBQXZELEVBQXVFO0FBQ3RFLGFBQU8sT0FBUDtBQUNBOztBQUNELFFBQUkxRCxZQUFKLGFBQUlBLFlBQUoseUNBQUlBLFlBQVksQ0FBRUUsT0FBbEIsNkVBQUksdUJBQXVCSSxXQUEzQiw2RUFBSSx1QkFBb0NtRCxhQUF4QyxtREFBSSx1QkFBbURpQyxhQUF2RCxFQUFzRTtBQUNyRSxhQUFPLE9BQVA7QUFDQTs7QUFDRCxXQUFPLE1BQVA7QUFDQSxHQVRNIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXREaXNwbGF5TW9kZSwgUHJvcGVydHlPclBhdGgsIERpc3BsYXlNb2RlIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvVUlGb3JtYXR0ZXJzXCI7XG5pbXBvcnQgeyBnZXRCaW5kaW5nV2l0aFVuaXRPckN1cnJlbmN5LCBmb3JtYXRXaXRoVHlwZUluZm9ybWF0aW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvVUlGb3JtYXR0ZXJzXCI7XG5pbXBvcnQge1xuXHREYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRlbmhhbmNlRGF0YU1vZGVsUGF0aCxcblx0Z2V0UGF0aFJlbGF0aXZlTG9jYXRpb24sXG5cdGdldENvbnRleHRSZWxhdGl2ZVRhcmdldE9iamVjdFBhdGhcbn0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvRGF0YU1vZGVsUGF0aEhlbHBlclwiO1xuaW1wb3J0IHsgUHJvcGVydHkgfSBmcm9tIFwiQHNhcC11eC9hbm5vdGF0aW9uLWNvbnZlcnRlclwiO1xuaW1wb3J0IHsgVUkgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0JpbmRpbmdIZWxwZXJcIjtcbmltcG9ydCB7XG5cdEV4cHJlc3Npb24sXG5cdGFubm90YXRpb25FeHByZXNzaW9uLFxuXHRmb3JtYXRSZXN1bHQsXG5cdHRyYW5zZm9ybVJlY3Vyc2l2ZWx5LFxuXHRCaW5kaW5nRXhwcmVzc2lvbkV4cHJlc3Npb24sXG5cdEJpbmRpbmdFeHByZXNzaW9uLFxuXHRjb21waWxlQmluZGluZyxcblx0Y29uc3RhbnQsXG5cdGJpbmRpbmdFeHByZXNzaW9uLFxuXHRhbmQsXG5cdG9yLFxuXHRpZkVsc2UsXG5cdGVxdWFsLFxuXHRub3QsXG5cdENvbXBsZXhUeXBlRXhwcmVzc2lvblxufSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nRXhwcmVzc2lvblwiO1xuaW1wb3J0IHtcblx0aXNQYXRoRXhwcmVzc2lvbixcblx0Z2V0QXNzb2NpYXRlZFVuaXRQcm9wZXJ0eSxcblx0Z2V0QXNzb2NpYXRlZEN1cnJlbmN5UHJvcGVydHksXG5cdGlzUHJvcGVydHksXG5cdGdldEFzc29jaWF0ZWRVbml0UHJvcGVydHlQYXRoLFxuXHRnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eVBhdGgsXG5cdGhhc1ZhbHVlSGVscCxcblx0Z2V0QXNzb2NpYXRlZFRleHRQcm9wZXJ0eVBhdGhcbn0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvUHJvcGVydHlIZWxwZXJcIjtcbmltcG9ydCB2YWx1ZUZvcm1hdHRlcnMgZnJvbSBcInNhcC9mZS9jb3JlL2Zvcm1hdHRlcnMvVmFsdWVGb3JtYXR0ZXJcIjtcbmltcG9ydCAqIGFzIFByb3BlcnR5SGVscGVyIGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL1Byb3BlcnR5SGVscGVyXCI7XG5pbXBvcnQgeyBpc1JlYWRPbmx5RXhwcmVzc2lvbiB9IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL0ZpZWxkQ29udHJvbEhlbHBlclwiO1xuaW1wb3J0IHsgRGF0YUZpZWxkQWJzdHJhY3RUeXBlcywgRGF0YUZpZWxkV2l0aFVybCwgRGF0YVBvaW50VHlwZVR5cGVzLCBVSUFubm90YXRpb25UeXBlcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuXG5leHBvcnQgdHlwZSBGaWVsZEZvcm1hdE9wdGlvbnMgPSBQYXJ0aWFsPHtcblx0dmFsdWVGb3JtYXQ6IFN0cmluZztcblx0dGV4dEFsaWduTW9kZTogU3RyaW5nO1xuXHRkaXNwbGF5TW9kZTogRGlzcGxheU1vZGU7XG5cdG1lYXN1cmVEaXNwbGF5TW9kZTogU3RyaW5nO1xuXHR0ZXh0TGluZXNFZGl0OiBTdHJpbmc7XG5cdHRleHRNYXhMaW5lczogU3RyaW5nO1xuXHRzaG93RW1wdHlJbmRpY2F0b3I6IGJvb2xlYW47XG5cdHNlbWFudGljS2V5U3R5bGU6IFN0cmluZztcblx0c2hvd0ljb25Vcmw6IGJvb2xlYW47XG5cdGlzQW5hbHl0aWNzOiBib29sZWFuO1xuXHRoYXNEcmFmdEluZGljYXRvcjogYm9vbGVhbjtcblx0c2VtYW50aWNrZXlzOiBzdHJpbmdbXTtcbn0+O1xuXG5leHBvcnQgdHlwZSBFZGl0U3R5bGUgPVxuXHR8IFwiSW5wdXRXaXRoVmFsdWVIZWxwXCJcblx0fCBcIlRleHRBcmVhXCJcblx0fCBcIkZpbGVcIlxuXHR8IFwiRGF0ZVBpY2tlclwiXG5cdHwgXCJUaW1lUGlja2VyXCJcblx0fCBcIkRhdGVUaW1lUGlja2VyXCJcblx0fCBcIkNoZWNrQm94XCJcblx0fCBcIklucHV0V2l0aFVuaXRcIlxuXHR8IFwiSW5wdXRcIlxuXHR8IFwiUmF0aW5nSW5kaWNhdG9yXCI7XG5cbmV4cG9ydCB0eXBlIERpc3BsYXlTdHlsZSA9XG5cdHwgXCJUZXh0XCJcblx0fCBcIkF2YXRhclwiXG5cdHwgXCJGaWxlXCJcblx0fCBcIkRhdGFQb2ludFwiXG5cdHwgXCJDb250YWN0XCJcblx0fCBcIkJ1dHRvblwiXG5cdHwgXCJMaW5rXCJcblx0fCBcIk9iamVjdFN0YXR1c1wiXG5cdHwgXCJBbW91bnRXaXRoQ3VycmVuY3lcIlxuXHR8IFwiU2VtYW50aWNLZXlXaXRoRHJhZnRJbmRpY2F0b3JcIlxuXHR8IFwiT2JqZWN0SWRlbnRpZmllclwiXG5cdHwgXCJMYWJlbFNlbWFudGljS2V5XCJcblx0fCBcIkxpbmtXaXRoUXVpY2tWaWV3Rm9ybVwiXG5cdHwgXCJMaW5rV3JhcHBlclwiXG5cdHwgXCJFeHBhbmRhYmxlVGV4dFwiO1xuXG4vKipcbiAqIFJlY3Vyc2l2ZWx5IGFkZCB0aGUgdGV4dCBhcnJhbmdlbWVudCB0byBhIGJpbmRpbmcgZXhwcmVzc2lvbi5cbiAqXG4gKiBAcGFyYW0gYmluZGluZ0V4cHJlc3Npb24gVGhlIGJpbmRpbmcgZXhwcmVzc2lvbiB0byBiZSBlbmhhbmNlZFxuICogQHBhcmFtIGZ1bGxDb250ZXh0UGF0aCBUaGUgY3VycmVudCBjb250ZXh0IHBhdGggd2UncmUgb24gKHRvIHByb3Blcmx5IHJlc29sdmUgdGhlIHRleHQgYXJyYW5nZW1lbnQgcHJvcGVydGllcylcbiAqIEByZXR1cm5zIEFuIHVwZGF0ZWQgZXhwcmVzc2lvbiBjb250YWluaW5nIHRoZSB0ZXh0IGFycmFuZ2VtZW50IGJpbmRpbmcuXG4gKi9cbmV4cG9ydCBjb25zdCBhZGRUZXh0QXJyYW5nZW1lbnRUb0JpbmRpbmdFeHByZXNzaW9uID0gZnVuY3Rpb24oXG5cdGJpbmRpbmdFeHByZXNzaW9uOiBFeHByZXNzaW9uPGFueT4sXG5cdGZ1bGxDb250ZXh0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aFxuKTogRXhwcmVzc2lvbjxhbnk+IHtcblx0cmV0dXJuIHRyYW5zZm9ybVJlY3Vyc2l2ZWx5KGJpbmRpbmdFeHByZXNzaW9uLCBcIkJpbmRpbmdcIiwgKGV4cHJlc3Npb246IEJpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvbjxhbnk+KSA9PiB7XG5cdFx0bGV0IG91dEV4cHJlc3Npb246IEV4cHJlc3Npb248YW55PiA9IGV4cHJlc3Npb247XG5cdFx0aWYgKGV4cHJlc3Npb24ubW9kZWxOYW1lID09PSB1bmRlZmluZWQpIHtcblx0XHRcdC8vIEluIGNhc2Ugb2YgZGVmYXVsdCBtb2RlbCB3ZSB0aGVuIG5lZWQgdG8gcmVzb2x2ZSB0aGUgdGV4dCBhcnJhbmdlbWVudCBwcm9wZXJ0eVxuXHRcdFx0Y29uc3Qgb1Byb3BlcnR5RGF0YU1vZGVsUGF0aCA9IGVuaGFuY2VEYXRhTW9kZWxQYXRoKGZ1bGxDb250ZXh0UGF0aCwgZXhwcmVzc2lvbi5wYXRoKTtcblx0XHRcdG91dEV4cHJlc3Npb24gPSBnZXRCaW5kaW5nV2l0aFRleHRBcnJhbmdlbWVudChvUHJvcGVydHlEYXRhTW9kZWxQYXRoLCBleHByZXNzaW9uKTtcblx0XHR9XG5cdFx0cmV0dXJuIG91dEV4cHJlc3Npb247XG5cdH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEJpbmRpbmdXaXRoVGV4dEFycmFuZ2VtZW50ID0gZnVuY3Rpb24oXG5cdG9Qcm9wZXJ0eURhdGFNb2RlbFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdHByb3BlcnR5QmluZGluZ0V4cHJlc3Npb246IEV4cHJlc3Npb248c3RyaW5nPixcblx0ZmllbGRGb3JtYXRPcHRpb25zPzogRmllbGRGb3JtYXRPcHRpb25zXG4pOiBFeHByZXNzaW9uPHN0cmluZz4ge1xuXHRjb25zdCB0YXJnZXREaXNwbGF5TW9kZU92ZXJyaWRlID0gZmllbGRGb3JtYXRPcHRpb25zPy5kaXNwbGF5TW9kZTtcblx0bGV0IG91dEV4cHJlc3Npb24gPSBwcm9wZXJ0eUJpbmRpbmdFeHByZXNzaW9uO1xuXHRjb25zdCBvUHJvcGVydHlEZWZpbml0aW9uID1cblx0XHRvUHJvcGVydHlEYXRhTW9kZWxQYXRoLnRhcmdldE9iamVjdC50eXBlID09PSBcIlByb3BlcnR5UGF0aFwiXG5cdFx0XHQ/IChvUHJvcGVydHlEYXRhTW9kZWxQYXRoLnRhcmdldE9iamVjdC4kdGFyZ2V0IGFzIFByb3BlcnR5KVxuXHRcdFx0OiAob1Byb3BlcnR5RGF0YU1vZGVsUGF0aC50YXJnZXRPYmplY3QgYXMgUHJvcGVydHkpO1xuXHRjb25zdCB0YXJnZXREaXNwbGF5TW9kZSA9IHRhcmdldERpc3BsYXlNb2RlT3ZlcnJpZGUgfHwgZ2V0RGlzcGxheU1vZGUob1Byb3BlcnR5RGVmaW5pdGlvbiwgb1Byb3BlcnR5RGF0YU1vZGVsUGF0aCk7XG5cdGNvbnN0IGNvbW1vblRleHQgPSBvUHJvcGVydHlEZWZpbml0aW9uLmFubm90YXRpb25zPy5Db21tb24/LlRleHQ7XG5cdGNvbnN0IHJlbGF0aXZlTG9jYXRpb24gPSBnZXRQYXRoUmVsYXRpdmVMb2NhdGlvbihcblx0XHRvUHJvcGVydHlEYXRhTW9kZWxQYXRoLmNvbnRleHRMb2NhdGlvbixcblx0XHRvUHJvcGVydHlEYXRhTW9kZWxQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzXG5cdCkubWFwKG5wID0+IG5wLm5hbWUpO1xuXHRwcm9wZXJ0eUJpbmRpbmdFeHByZXNzaW9uID0gZm9ybWF0V2l0aFR5cGVJbmZvcm1hdGlvbihvUHJvcGVydHlEZWZpbml0aW9uLCBwcm9wZXJ0eUJpbmRpbmdFeHByZXNzaW9uKTtcblx0aWYgKHRhcmdldERpc3BsYXlNb2RlICE9PSBcIlZhbHVlXCIgJiYgY29tbW9uVGV4dCkge1xuXHRcdHN3aXRjaCAodGFyZ2V0RGlzcGxheU1vZGUpIHtcblx0XHRcdGNhc2UgXCJEZXNjcmlwdGlvblwiOlxuXHRcdFx0XHRvdXRFeHByZXNzaW9uID0gYW5ub3RhdGlvbkV4cHJlc3Npb24oY29tbW9uVGV4dCwgcmVsYXRpdmVMb2NhdGlvbikgYXMgRXhwcmVzc2lvbjxzdHJpbmc+O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJEZXNjcmlwdGlvblZhbHVlXCI6XG5cdFx0XHRcdG91dEV4cHJlc3Npb24gPSBmb3JtYXRSZXN1bHQoXG5cdFx0XHRcdFx0W2Fubm90YXRpb25FeHByZXNzaW9uKGNvbW1vblRleHQsIHJlbGF0aXZlTG9jYXRpb24pIGFzIEV4cHJlc3Npb248c3RyaW5nPiwgcHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbl0sXG5cdFx0XHRcdFx0dmFsdWVGb3JtYXR0ZXJzLmZvcm1hdFdpdGhCcmFja2V0c1xuXHRcdFx0XHQpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJWYWx1ZURlc2NyaXB0aW9uXCI6XG5cdFx0XHRcdG91dEV4cHJlc3Npb24gPSBmb3JtYXRSZXN1bHQoXG5cdFx0XHRcdFx0W3Byb3BlcnR5QmluZGluZ0V4cHJlc3Npb24sIGFubm90YXRpb25FeHByZXNzaW9uKGNvbW1vblRleHQsIHJlbGF0aXZlTG9jYXRpb24pIGFzIEV4cHJlc3Npb248c3RyaW5nPl0sXG5cdFx0XHRcdFx0dmFsdWVGb3JtYXR0ZXJzLmZvcm1hdFdpdGhCcmFja2V0c1xuXHRcdFx0XHQpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblx0cmV0dXJuIG91dEV4cHJlc3Npb247XG59O1xuXG5leHBvcnQgY29uc3QgZm9ybWF0VmFsdWVSZWN1cnNpdmVseSA9IGZ1bmN0aW9uKGJpbmRpbmdFeHByZXNzaW9uOiBFeHByZXNzaW9uPGFueT4sIGZ1bGxDb250ZXh0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCk6IEV4cHJlc3Npb248YW55PiB7XG5cdHJldHVybiB0cmFuc2Zvcm1SZWN1cnNpdmVseShiaW5kaW5nRXhwcmVzc2lvbiwgXCJCaW5kaW5nXCIsIChleHByZXNzaW9uOiBCaW5kaW5nRXhwcmVzc2lvbkV4cHJlc3Npb248YW55PikgPT4ge1xuXHRcdGxldCBvdXRFeHByZXNzaW9uOiBFeHByZXNzaW9uPGFueT4gPSBleHByZXNzaW9uO1xuXHRcdGlmIChleHByZXNzaW9uLm1vZGVsTmFtZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHQvLyBJbiBjYXNlIG9mIGRlZmF1bHQgbW9kZWwgd2UgdGhlbiBuZWVkIHRvIHJlc29sdmUgdGhlIHRleHQgYXJyYW5nZW1lbnQgcHJvcGVydHlcblx0XHRcdGNvbnN0IG9Qcm9wZXJ0eURhdGFNb2RlbFBhdGggPSBlbmhhbmNlRGF0YU1vZGVsUGF0aChmdWxsQ29udGV4dFBhdGgsIGV4cHJlc3Npb24ucGF0aCk7XG5cdFx0XHRvdXRFeHByZXNzaW9uID0gZm9ybWF0V2l0aFR5cGVJbmZvcm1hdGlvbihvUHJvcGVydHlEYXRhTW9kZWxQYXRoLnRhcmdldE9iamVjdCwgZXhwcmVzc2lvbik7XG5cdFx0fVxuXHRcdHJldHVybiBvdXRFeHByZXNzaW9uO1xuXHR9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRUZXh0QmluZGluZyA9IGZ1bmN0aW9uKFxuXHRvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRmaWVsZEZvcm1hdE9wdGlvbnM6IEZpZWxkRm9ybWF0T3B0aW9ucyxcblx0YXNPYmplY3Q6IGJvb2xlYW4gPSBmYWxzZVxuKTogRXhwcmVzc2lvbjxzdHJpbmc+IHwgQmluZGluZ0V4cHJlc3Npb248c3RyaW5nPiB7XG5cdGlmIChcblx0XHRvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdD8uJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkXCIgfHxcblx0XHRvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdD8uJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YVBvaW50VHlwZVwiIHx8XG5cdFx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3Q/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZFdpdGhOYXZpZ2F0aW9uUGF0aFwiIHx8XG5cdFx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3Q/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZFdpdGhVcmxcIlxuXHQpIHtcblx0XHQvLyBJZiB0aGVyZSBpcyBubyByZXNvbHZlZCBwcm9wZXJ0eSwgdGhlIHZhbHVlIGlzIHJldHVybmVkIGFzIGEgY29uc3RhbnRcblx0XHRjb25zdCBmaWVsZFZhbHVlID0gb1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QuVmFsdWUgfHwgXCJcIjtcblx0XHRyZXR1cm4gY29tcGlsZUJpbmRpbmcoY29uc3RhbnQoZmllbGRWYWx1ZSkpO1xuXHR9XG5cdGlmIChpc1BhdGhFeHByZXNzaW9uKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0KSAmJiBvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC4kdGFyZ2V0KSB7XG5cdFx0Y29uc3Qgb05hdlBhdGggPSBvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldEVudGl0eVR5cGUucmVzb2x2ZVBhdGgob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QucGF0aCwgdHJ1ZSk7XG5cdFx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QgPSBvTmF2UGF0aC50YXJnZXQ7XG5cdFx0b05hdlBhdGgudmlzaXRlZE9iamVjdHMuZm9yRWFjaCgob05hdk9iajogYW55KSA9PiB7XG5cdFx0XHRpZiAob05hdk9iaj8uX3R5cGUgPT09IFwiTmF2aWdhdGlvblByb3BlcnR5XCIpIHtcblx0XHRcdFx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC5uYXZpZ2F0aW9uUHJvcGVydGllcy5wdXNoKG9OYXZPYmopO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdGNvbnN0IG9CaW5kaW5nRXhwcmVzc2lvbiA9IGJpbmRpbmdFeHByZXNzaW9uKGdldENvbnRleHRSZWxhdGl2ZVRhcmdldE9iamVjdFBhdGgob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aCkpO1xuXHRsZXQgb1RhcmdldEJpbmRpbmc7XG5cdGlmIChcblx0XHRvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdD8uYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5Vbml0IHx8XG5cdFx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3Q/LmFubm90YXRpb25zPy5NZWFzdXJlcz8uSVNPQ3VycmVuY3lcblx0KSB7XG5cdFx0b1RhcmdldEJpbmRpbmcgPSBnZXRCaW5kaW5nV2l0aFVuaXRPckN1cnJlbmN5KG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgsIG9CaW5kaW5nRXhwcmVzc2lvbik7XG5cdFx0aWYgKGZpZWxkRm9ybWF0T3B0aW9ucz8ubWVhc3VyZURpc3BsYXlNb2RlID09PSBcIkhpZGRlblwiKSB7XG5cdFx0XHQvLyBUT0RPOiBSZWZhY3RvciBvbmNlIHR5cGVzIGFyZSBsZXNzIGdlbmVyaWMgaGVyZVxuXHRcdFx0KG9UYXJnZXRCaW5kaW5nIGFzIENvbXBsZXhUeXBlRXhwcmVzc2lvbjxTdHJpbmc+KS5mb3JtYXRPcHRpb25zID0ge1xuXHRcdFx0XHQuLi4ob1RhcmdldEJpbmRpbmcgYXMgQ29tcGxleFR5cGVFeHByZXNzaW9uPFN0cmluZz4pLmZvcm1hdE9wdGlvbnMsXG5cdFx0XHRcdHNob3dNZWFzdXJlOiBmYWxzZVxuXHRcdFx0fTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0b1RhcmdldEJpbmRpbmcgPSBnZXRCaW5kaW5nV2l0aFRleHRBcnJhbmdlbWVudChvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLCBvQmluZGluZ0V4cHJlc3Npb24sIGZpZWxkRm9ybWF0T3B0aW9ucyk7XG5cdH1cblx0aWYgKGFzT2JqZWN0KSB7XG5cdFx0cmV0dXJuIG9UYXJnZXRCaW5kaW5nO1xuXHR9XG5cdC8vIFdlIGRvbid0IGluY2x1ZGUgJCRub3BhdGNoIGFuZCBwYXJzZUtlZXBFbXB0eVN0cmluZyBhcyB0aGV5IG1ha2Ugbm8gc2Vuc2UgaW4gdGhlIHRleHQgYmluZGluZyBjYXNlXG5cdHJldHVybiBjb21waWxlQmluZGluZyhvVGFyZ2V0QmluZGluZyk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0VmFsdWVCaW5kaW5nID0gZnVuY3Rpb24oXG5cdG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdGZpZWxkRm9ybWF0T3B0aW9uczogRmllbGRGb3JtYXRPcHRpb25zLFxuXHRpZ25vcmVVbml0OiBib29sZWFuID0gZmFsc2UsXG5cdGlnbm9yZUZvcm1hdHRpbmc6IGJvb2xlYW4gPSBmYWxzZSxcblx0YmluZGluZ1BhcmFtZXRlcnM/OiBvYmplY3QsXG5cdHRhcmdldFR5cGVBbnk/OiBib29sZWFuLFxuXHRzaG93TWVhc3VyZU9ubHk6IGJvb2xlYW4gPSBmYWxzZVxuKTogQmluZGluZ0V4cHJlc3Npb248c3RyaW5nPiB7XG5cdGlmIChpc1BhdGhFeHByZXNzaW9uKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0KSAmJiBvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC4kdGFyZ2V0KSB7XG5cdFx0Y29uc3Qgb05hdlBhdGggPSBvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldEVudGl0eVR5cGUucmVzb2x2ZVBhdGgob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QucGF0aCwgdHJ1ZSk7XG5cdFx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QgPSBvTmF2UGF0aC50YXJnZXQ7XG5cdFx0b05hdlBhdGgudmlzaXRlZE9iamVjdHMuZm9yRWFjaCgob05hdk9iajogYW55KSA9PiB7XG5cdFx0XHRpZiAob05hdk9iaiAmJiBvTmF2T2JqLl90eXBlID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiKSB7XG5cdFx0XHRcdG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgubmF2aWdhdGlvblByb3BlcnRpZXMucHVzaChvTmF2T2JqKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGNvbnN0IHRhcmdldE9iamVjdCA9IG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0O1xuXHRpZiAoaXNQcm9wZXJ0eSh0YXJnZXRPYmplY3QpKSB7XG5cdFx0bGV0IG9CaW5kaW5nRXhwcmVzc2lvbjogQmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uPHN0cmluZz4gPSBiaW5kaW5nRXhwcmVzc2lvbihcblx0XHRcdGdldENvbnRleHRSZWxhdGl2ZVRhcmdldE9iamVjdFBhdGgob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aClcblx0XHQpIGFzIEJpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvbjxzdHJpbmc+O1xuXHRcdGlmICh0YXJnZXRPYmplY3QuYW5ub3RhdGlvbnM/LkNvbW11bmljYXRpb24/LklzRW1haWxBZGRyZXNzKSB7XG5cdFx0XHRvQmluZGluZ0V4cHJlc3Npb24udHlwZSA9IFwic2FwLmZlLmNvcmUudHlwZS5FbWFpbFwiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBvUHJvcGVydHlVbml0ID0gZ2V0QXNzb2NpYXRlZFVuaXRQcm9wZXJ0eShvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdCk7XG5cdFx0XHRjb25zdCBvUHJvcGVydHlDdXJyZW5jeSA9IGdldEFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5KG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0KTtcblx0XHRcdGlmICghaWdub3JlVW5pdCAmJiAob1Byb3BlcnR5VW5pdCB8fCBvUHJvcGVydHlDdXJyZW5jeSkpIHtcblx0XHRcdFx0b0JpbmRpbmdFeHByZXNzaW9uID0gZ2V0QmluZGluZ1dpdGhVbml0T3JDdXJyZW5jeShvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLCBvQmluZGluZ0V4cHJlc3Npb24pIGFzIGFueTtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdChvUHJvcGVydHlVbml0ICYmICFoYXNWYWx1ZUhlbHAob1Byb3BlcnR5VW5pdCkpIHx8XG5cdFx0XHRcdFx0KG9Qcm9wZXJ0eUN1cnJlbmN5ICYmICFoYXNWYWx1ZUhlbHAob1Byb3BlcnR5Q3VycmVuY3kpKSB8fFxuXHRcdFx0XHRcdGZpZWxkRm9ybWF0T3B0aW9ucz8ubWVhc3VyZURpc3BsYXlNb2RlID09PSBcIkhpZGRlblwiXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdC8vIElmIHRoZXJlIGlzIGEgdW5pdCBvciBjdXJyZW5jeSB3aXRob3V0IGEgdmFsdWUgaGVscCwgb3IgaW4gY2FzZSB0aGUgY3VycmVuY3kgc2hvdWxkIGJlIGV4cGxpY2l0bHkgaGlkZGVuLFxuXHRcdFx0XHRcdC8vIHdlIG5lZWQgdG8gY29uZmlndXJlIHRoZSBiaW5kaW5nIHRvIG5vdCBzaG93IHRoZSBtZWFzdXJlLCBvdGhlcndpc2UgaXQncyBuZWVkZWQgZm9yIHRoZSBtZGMgZmllbGRcblx0XHRcdFx0XHRpZiAoIW9CaW5kaW5nRXhwcmVzc2lvbi5mb3JtYXRPcHRpb25zKSB7XG5cdFx0XHRcdFx0XHRvQmluZGluZ0V4cHJlc3Npb24uZm9ybWF0T3B0aW9ucyA9IHt9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoc2hvd01lYXN1cmVPbmx5KSB7XG5cdFx0XHRcdFx0XHRvQmluZGluZ0V4cHJlc3Npb24uZm9ybWF0T3B0aW9ucy5zaG93TnVtYmVyID0gZmFsc2U7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG9CaW5kaW5nRXhwcmVzc2lvbi5mb3JtYXRPcHRpb25zLnNob3dNZWFzdXJlID0gZmFsc2U7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvQmluZGluZ0V4cHJlc3Npb24gPSBmb3JtYXRXaXRoVHlwZUluZm9ybWF0aW9uKHRhcmdldE9iamVjdCwgb0JpbmRpbmdFeHByZXNzaW9uKSBhcyBCaW5kaW5nRXhwcmVzc2lvbkV4cHJlc3Npb248c3RyaW5nPjtcblx0XHRcdFx0aWYgKG9CaW5kaW5nRXhwcmVzc2lvbi50eXBlID09PSBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLlN0cmluZ1wiKSB7XG5cdFx0XHRcdFx0b0JpbmRpbmdFeHByZXNzaW9uLmZvcm1hdE9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0XHRwYXJzZUtlZXBzRW1wdHlTdHJpbmc6IHRydWVcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChpZ25vcmVGb3JtYXR0aW5nKSB7XG5cdFx0XHRkZWxldGUgb0JpbmRpbmdFeHByZXNzaW9uLmZvcm1hdE9wdGlvbnM7XG5cdFx0XHRkZWxldGUgb0JpbmRpbmdFeHByZXNzaW9uLmNvbnN0cmFpbnRzO1xuXHRcdFx0ZGVsZXRlIG9CaW5kaW5nRXhwcmVzc2lvbi50eXBlO1xuXHRcdH1cblx0XHRpZiAoYmluZGluZ1BhcmFtZXRlcnMpIHtcblx0XHRcdG9CaW5kaW5nRXhwcmVzc2lvbi5wYXJhbWV0ZXJzID0gYmluZGluZ1BhcmFtZXRlcnM7XG5cdFx0fVxuXHRcdGlmICh0YXJnZXRUeXBlQW55KSB7XG5cdFx0XHRvQmluZGluZ0V4cHJlc3Npb24udGFyZ2V0VHlwZSA9IFwiYW55XCI7XG5cdFx0fVxuXHRcdHJldHVybiBjb21waWxlQmluZGluZyhvQmluZGluZ0V4cHJlc3Npb24pO1xuXHR9IGVsc2Uge1xuXHRcdGlmIChcblx0XHRcdHRhcmdldE9iamVjdD8uJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhVcmwgfHxcblx0XHRcdHRhcmdldE9iamVjdD8uJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhOYXZpZ2F0aW9uUGF0aFxuXHRcdCkge1xuXHRcdFx0cmV0dXJuIGNvbXBpbGVCaW5kaW5nKGFubm90YXRpb25FeHByZXNzaW9uKCh0YXJnZXRPYmplY3QgYXMgRGF0YUZpZWxkV2l0aFVybCkuVmFsdWUpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0fVxuXHR9XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0VW5pdEJpbmRpbmcgPSBmdW5jdGlvbihcblx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCxcblx0ZmllbGRGb3JtYXRPcHRpb25zOiBGaWVsZEZvcm1hdE9wdGlvbnNcbik6IEJpbmRpbmdFeHByZXNzaW9uPHN0cmluZz4ge1xuXHRjb25zdCBzVW5pdFByb3BlcnR5UGF0aCA9IGdldEFzc29jaWF0ZWRVbml0UHJvcGVydHlQYXRoKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0KTtcblx0Y29uc3Qgc0N1cnJlbmN5UHJvcGVydHlQYXRoID0gZ2V0QXNzb2NpYXRlZEN1cnJlbmN5UHJvcGVydHlQYXRoKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0KTtcblx0aWYgKHNVbml0UHJvcGVydHlQYXRoIHx8IHNDdXJyZW5jeVByb3BlcnR5UGF0aCkge1xuXHRcdGNvbnN0IHRhcmdldFByb3BlcnR5UGF0aCA9IHNVbml0UHJvcGVydHlQYXRoIHx8IHNDdXJyZW5jeVByb3BlcnR5UGF0aDtcblx0XHRjb25zdCBvVU9NUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoID0gZW5oYW5jZURhdGFNb2RlbFBhdGgob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aCwgdGFyZ2V0UHJvcGVydHlQYXRoKTtcblx0XHRyZXR1cm4gZ2V0VmFsdWVCaW5kaW5nKG9VT01Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgsIGZpZWxkRm9ybWF0T3B0aW9ucyk7XG5cdH1cblx0cmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRBc3NvY2lhdGVkVGV4dEJpbmRpbmcgPSBmdW5jdGlvbihcblx0b1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCxcblx0ZmllbGRGb3JtYXRPcHRpb25zOiBGaWVsZEZvcm1hdE9wdGlvbnNcbik6IEJpbmRpbmdFeHByZXNzaW9uPHN0cmluZz4ge1xuXHRjb25zdCB0ZXh0UHJvcGVydHlQYXRoID0gZ2V0QXNzb2NpYXRlZFRleHRQcm9wZXJ0eVBhdGgob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QpO1xuXHRpZiAodGV4dFByb3BlcnR5UGF0aCkge1xuXHRcdGNvbnN0IG9UZXh0UHJvcGVydHlQYXRoID0gZW5oYW5jZURhdGFNb2RlbFBhdGgob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aCwgdGV4dFByb3BlcnR5UGF0aCk7XG5cdFx0Y29uc3Qgb1ZhbHVlQmluZGluZyA9IGdldFZhbHVlQmluZGluZyhvVGV4dFByb3BlcnR5UGF0aCwgZmllbGRGb3JtYXRPcHRpb25zLCB0cnVlLCB0cnVlLCB7ICQkbm9QYXRjaDogdHJ1ZSB9KTtcblx0XHRyZXR1cm4gb1ZhbHVlQmluZGluZztcblx0fVxuXHRyZXR1cm4gdW5kZWZpbmVkO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldERpc3BsYXlTdHlsZSA9IGZ1bmN0aW9uKFxuXHRvUHJvcGVydHlQYXRoOiBQcm9wZXJ0eU9yUGF0aDxQcm9wZXJ0eT4sXG5cdG9EYXRhRmllbGQ6IGFueSxcblx0b0RhdGFNb2RlbFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdGZpZWxkRm9ybWF0T3B0aW9uczogRmllbGRGb3JtYXRPcHRpb25zLFxuXHRzZW1hbnRpY09iamVjdDogc3RyaW5nXG4pOiBEaXNwbGF5U3R5bGUge1xuXHQvLyBhbGdvcml0aG0gdG8gZGV0ZXJtaW5lIHRoZSBmaWVsZCBmcmFnbWVudCB0byB1c2Vcblx0Y29uc3Qgb1Byb3BlcnR5OiBQcm9wZXJ0eSA9IChpc1BhdGhFeHByZXNzaW9uKG9Qcm9wZXJ0eVBhdGgpICYmIG9Qcm9wZXJ0eVBhdGguJHRhcmdldCkgfHwgKG9Qcm9wZXJ0eVBhdGggYXMgUHJvcGVydHkpO1xuXHRpZiAoXG5cdFx0c2VtYW50aWNPYmplY3QgJiZcblx0XHQhb1Byb3BlcnR5LmFubm90YXRpb25zPy5VST8uSXNJbWFnZVVSTCAmJlxuXHRcdCEob1Byb3BlcnR5LnR5cGUgPT09IFwiRWRtLlN0cmVhbVwiKSAmJlxuXHRcdCEob1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tdW5pY2F0aW9uPy5Jc0VtYWlsQWRkcmVzcyB8fCBvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW11bmljYXRpb24/LklzUGhvbmVOdW1iZXIpXG5cdCkge1xuXHRcdHJldHVybiBcIkxpbmtXaXRoUXVpY2tWaWV3Rm9ybVwiO1xuXHR9XG5cdGlmICghb1Byb3BlcnR5UGF0aCB8fCB0eXBlb2Ygb1Byb3BlcnR5UGF0aCA9PT0gXCJzdHJpbmdcIikge1xuXHRcdHJldHVybiBcIlRleHRcIjtcblx0fVxuXHRpZiAob1Byb3BlcnR5LnR5cGUgPT09IFwiRWRtLlN0cmVhbVwiKSB7XG5cdFx0cmV0dXJuIFwiRmlsZVwiO1xuXHR9XG5cdGlmIChvUHJvcGVydHkuYW5ub3RhdGlvbnM/LlVJPy5Jc0ltYWdlVVJMKSB7XG5cdFx0cmV0dXJuIFwiQXZhdGFyXCI7XG5cdH1cblx0c3dpdGNoIChvRGF0YUZpZWxkLiRUeXBlKSB7XG5cdFx0Y2FzZSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFQb2ludFR5cGVcIjpcblx0XHRcdHJldHVybiBcIkRhdGFQb2ludFwiO1xuXHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JBbm5vdGF0aW9uXCI6XG5cdFx0XHRpZiAob0RhdGFGaWVsZC5UYXJnZXQ/LiR0YXJnZXQ/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFQb2ludFR5cGVcIikge1xuXHRcdFx0XHRyZXR1cm4gXCJEYXRhUG9pbnRcIjtcblx0XHRcdH0gZWxzZSBpZiAob0RhdGFGaWVsZC5UYXJnZXQ/LiR0YXJnZXQ/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW11bmljYXRpb24udjEuQ29udGFjdFR5cGVcIikge1xuXHRcdFx0XHRyZXR1cm4gXCJDb250YWN0XCI7XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9yQWN0aW9uXCI6XG5cdFx0Y2FzZSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvblwiOlxuXHRcdFx0cmV0dXJuIFwiQnV0dG9uXCI7XG5cdFx0Y2FzZSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZFdpdGhOYXZpZ2F0aW9uUGF0aFwiOlxuXHRcdFx0cmV0dXJuIFwiTGlua1wiO1xuXHR9XG5cdGlmIChvRGF0YU1vZGVsUGF0aD8udGFyZ2V0RW50aXR5VHlwZT8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uU2VtYW50aWNLZXkpIHtcblx0XHRjb25zdCBhU2VtYW50aWNLZXlzID0gb0RhdGFNb2RlbFBhdGgudGFyZ2V0RW50aXR5VHlwZS5hbm5vdGF0aW9ucy5Db21tb24uU2VtYW50aWNLZXk7XG5cdFx0Y29uc3QgYklzU2VtYW50aWNLZXkgPSAhYVNlbWFudGljS2V5cy5ldmVyeShmdW5jdGlvbihvS2V5KSB7XG5cdFx0XHRyZXR1cm4gb0tleT8uJHRhcmdldD8ubmFtZSAhPT0gb1Byb3BlcnR5Lm5hbWU7XG5cdFx0fSk7XG5cdFx0aWYgKGJJc1NlbWFudGljS2V5ICYmIGZpZWxkRm9ybWF0T3B0aW9ucy5zZW1hbnRpY0tleVN0eWxlKSB7XG5cdFx0XHRpZiAob0RhdGFNb2RlbFBhdGgudGFyZ2V0RW50aXR5U2V0Py5hbm5vdGF0aW9ucz8uQ29tbW9uPy5EcmFmdFJvb3QpIHtcblx0XHRcdFx0Ly8gJiYgZmllbGRGb3JtYXRPcHRpb25zLmhhc0RyYWZ0SW5kaWNhdG9yKSB7XG5cdFx0XHRcdC8vIHdlIHRoZW4gc3RpbGwgY2hlY2sgd2hldGhlciB0aGlzIGlzIGF2YWlsYWJsZSBhdCBkZXNpZ250aW1lIG9uIHRoZSBlbnRpdHlzZXRcblx0XHRcdFx0cmV0dXJuIFwiU2VtYW50aWNLZXlXaXRoRHJhZnRJbmRpY2F0b3JcIjtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmaWVsZEZvcm1hdE9wdGlvbnMuc2VtYW50aWNLZXlTdHlsZSA9PT0gXCJPYmplY3RJZGVudGlmaWVyXCIgPyBcIk9iamVjdElkZW50aWZpZXJcIiA6IFwiTGFiZWxTZW1hbnRpY0tleVwiO1xuXHRcdH1cblx0fVxuXHRpZiAob0RhdGFGaWVsZC5Dcml0aWNhbGl0eSkge1xuXHRcdHJldHVybiBcIk9iamVjdFN0YXR1c1wiO1xuXHR9XG5cdGlmIChvUHJvcGVydHkuYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5JU09DdXJyZW5jeSkge1xuXHRcdGlmIChmaWVsZEZvcm1hdE9wdGlvbnMubWVhc3VyZURpc3BsYXlNb2RlID09PSBcIkhpZGRlblwiKSB7XG5cdFx0XHRyZXR1cm4gXCJUZXh0XCI7XG5cdFx0fVxuXHRcdHJldHVybiBcIkFtb3VudFdpdGhDdXJyZW5jeVwiO1xuXHR9XG5cdGlmIChvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW11bmljYXRpb24/LklzRW1haWxBZGRyZXNzIHx8IG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uQ29tbXVuaWNhdGlvbj8uSXNQaG9uZU51bWJlcikge1xuXHRcdHJldHVybiBcIkxpbmtcIjtcblx0fVxuXHRpZiAob1Byb3BlcnR5LmFubm90YXRpb25zPy5VST8uTXVsdGlMaW5lVGV4dCkge1xuXHRcdHJldHVybiBcIkV4cGFuZGFibGVUZXh0XCI7XG5cdH1cblx0Y29uc3QgYU5hdmlnYXRpb25Qcm9wZXJ0aWVzID0gb0RhdGFNb2RlbFBhdGg/LnRhcmdldEVudGl0eVR5cGU/Lm5hdmlnYXRpb25Qcm9wZXJ0aWVzIHx8IFtdO1xuXHRsZXQgYklzVXNlZEluTmF2aWdhdGlvbldpdGhRdWlja1ZpZXdGYWNldHMgPSBmYWxzZTtcblx0YU5hdmlnYXRpb25Qcm9wZXJ0aWVzLmZvckVhY2gob05hdlByb3AgPT4ge1xuXHRcdGlmIChvTmF2UHJvcC5yZWZlcmVudGlhbENvbnN0cmFpbnQgJiYgb05hdlByb3AucmVmZXJlbnRpYWxDb25zdHJhaW50Lmxlbmd0aCkge1xuXHRcdFx0b05hdlByb3AucmVmZXJlbnRpYWxDb25zdHJhaW50LmZvckVhY2gob1JlZkNvbnN0cmFpbnQgPT4ge1xuXHRcdFx0XHRpZiAob1JlZkNvbnN0cmFpbnQ/LnNvdXJjZVByb3BlcnR5ID09PSBvUHJvcGVydHkubmFtZSkge1xuXHRcdFx0XHRcdGlmIChvTmF2UHJvcD8udGFyZ2V0VHlwZT8uYW5ub3RhdGlvbnM/LlVJPy5RdWlja1ZpZXdGYWNldHMpIHtcblx0XHRcdFx0XHRcdGJJc1VzZWRJbk5hdmlnYXRpb25XaXRoUXVpY2tWaWV3RmFjZXRzID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG5cdGlmIChiSXNVc2VkSW5OYXZpZ2F0aW9uV2l0aFF1aWNrVmlld0ZhY2V0cykge1xuXHRcdHJldHVybiBcIkxpbmtXaXRoUXVpY2tWaWV3Rm9ybVwiO1xuXHR9XG5cdGlmIChvUHJvcGVydHkuYW5ub3RhdGlvbnM/LkNvbW1vbj8uU2VtYW50aWNPYmplY3QpIHtcblx0XHRyZXR1cm4gXCJMaW5rV3JhcHBlclwiO1xuXHR9XG5cdGlmIChvRGF0YUZpZWxkLiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZFdpdGhVcmxcIikge1xuXHRcdHJldHVybiBcIkxpbmtcIjtcblx0fVxuXHRyZXR1cm4gXCJUZXh0XCI7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0RWRpdFN0eWxlID0gZnVuY3Rpb24oXG5cdG9Qcm9wZXJ0eVBhdGg6IFByb3BlcnR5T3JQYXRoPFByb3BlcnR5Pixcblx0b0RhdGFGaWVsZDogYW55LFxuXHRvRmllbGRGb3JtYXRPcHRpb25zOiBGaWVsZEZvcm1hdE9wdGlvbnNcbik6IEVkaXRTdHlsZSB8IG51bGwge1xuXHQvLyBhbGdvcml0aG0gdG8gZGV0ZXJtaW5lIHRoZSBmaWVsZCBmcmFnbWVudCB0byB1c2Vcblx0aWYgKCFvUHJvcGVydHlQYXRoIHx8IHR5cGVvZiBvUHJvcGVydHlQYXRoID09PSBcInN0cmluZ1wiKSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0Y29uc3Qgb1Byb3BlcnR5OiBQcm9wZXJ0eSA9IChpc1BhdGhFeHByZXNzaW9uKG9Qcm9wZXJ0eVBhdGgpICYmIG9Qcm9wZXJ0eVBhdGguJHRhcmdldCkgfHwgKG9Qcm9wZXJ0eVBhdGggYXMgUHJvcGVydHkpO1xuXHRpZiAob1Byb3BlcnR5LnR5cGUgPT09IFwiRWRtLlN0cmVhbVwiKSB7XG5cdFx0cmV0dXJuIFwiRmlsZVwiO1xuXHR9XG5cdHN3aXRjaCAob0RhdGFGaWVsZC4kVHlwZSkge1xuXHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JBbm5vdGF0aW9uXCI6XG5cdFx0XHRpZiAob0RhdGFGaWVsZC5UYXJnZXQ/LiR0YXJnZXQ/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW11bmljYXRpb24udjEuQ29udGFjdFR5cGVcIikge1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH0gZWxzZSBpZiAob0RhdGFGaWVsZC5UYXJnZXQ/LiR0YXJnZXQ/LlZpc3VhbGl6YXRpb24gPT09IFwiVUkuVmlzdWFsaXphdGlvblR5cGUvUmF0aW5nXCIpIHtcblx0XHRcdFx0cmV0dXJuIFwiUmF0aW5nSW5kaWNhdG9yXCI7XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YVBvaW50VHlwZVwiOlxuXHRcdFx0aWYgKG9EYXRhRmllbGQ/LlZpc3VhbGl6YXRpb24gPT09IFwiVUkuVmlzdWFsaXphdGlvblR5cGUvUmF0aW5nXCIpIHtcblx0XHRcdFx0cmV0dXJuIFwiUmF0aW5nSW5kaWNhdG9yXCI7XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9yQWN0aW9uXCI6XG5cdFx0Y2FzZSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZFdpdGhOYXZpZ2F0aW9uUGF0aFwiOlxuXHRcdGNhc2UgXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb25cIjpcblx0XHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGNvbnN0IG9Qcm9wZXJ0eVVuaXQgPSBnZXRBc3NvY2lhdGVkVW5pdFByb3BlcnR5KG9Qcm9wZXJ0eSk7XG5cdGNvbnN0IG9Qcm9wZXJ0eUN1cnJlbmN5ID0gZ2V0QXNzb2NpYXRlZEN1cnJlbmN5UHJvcGVydHkob1Byb3BlcnR5KTtcblx0aWYgKFxuXHRcdChQcm9wZXJ0eUhlbHBlci5oYXNWYWx1ZUhlbHAob1Byb3BlcnR5KSAmJiBvUHJvcGVydHkudHlwZSAhPT0gXCJFZG0uQm9vbGVhblwiKSB8fFxuXHRcdChvUHJvcGVydHlVbml0ICYmIFByb3BlcnR5SGVscGVyLmhhc1ZhbHVlSGVscChvUHJvcGVydHlVbml0KSkgfHxcblx0XHQob1Byb3BlcnR5Q3VycmVuY3kgJiYgUHJvcGVydHlIZWxwZXIuaGFzVmFsdWVIZWxwKG9Qcm9wZXJ0eUN1cnJlbmN5KSlcblx0KSB7XG5cdFx0aWYgKG9GaWVsZEZvcm1hdE9wdGlvbnM/Lm1lYXN1cmVEaXNwbGF5TW9kZSA9PT0gXCJIaWRkZW5cIikge1xuXHRcdFx0cmV0dXJuIFwiSW5wdXRcIjtcblx0XHR9XG5cdFx0cmV0dXJuIFwiSW5wdXRXaXRoVmFsdWVIZWxwXCI7XG5cdH1cblx0aWYgKG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uVUk/Lk11bHRpTGluZVRleHQ/LnZhbHVlT2YoKSAmJiBvUHJvcGVydHkudHlwZSA9PT0gXCJFZG0uU3RyaW5nXCIpIHtcblx0XHRyZXR1cm4gXCJUZXh0QXJlYVwiO1xuXHR9XG5cdHN3aXRjaCAob1Byb3BlcnR5LnR5cGUpIHtcblx0XHRjYXNlIFwiRWRtLkRhdGVcIjpcblx0XHRcdHJldHVybiBcIkRhdGVQaWNrZXJcIjtcblx0XHRjYXNlIFwiRWRtLlRpbWVcIjpcblx0XHRjYXNlIFwiRWRtLlRpbWVPZkRheVwiOlxuXHRcdFx0cmV0dXJuIFwiVGltZVBpY2tlclwiO1xuXHRcdGNhc2UgXCJFZG0uRGF0ZVRpbWVcIjpcblx0XHRjYXNlIFwiRWRtLkRhdGVUaW1lT2Zmc2V0XCI6XG5cdFx0XHRyZXR1cm4gXCJEYXRlVGltZVBpY2tlclwiO1xuXHRcdGNhc2UgXCJFZG0uQm9vbGVhblwiOlxuXHRcdFx0cmV0dXJuIFwiQ2hlY2tCb3hcIjtcblx0fVxuXHRpZiAob1Byb3BlcnR5LmFubm90YXRpb25zPy5NZWFzdXJlcz8uSVNPQ3VycmVuY3kgfHwgb1Byb3BlcnR5LmFubm90YXRpb25zPy5NZWFzdXJlcz8uVW5pdCkge1xuXHRcdHJldHVybiBcIklucHV0V2l0aFVuaXRcIjtcblx0fVxuXHRyZXR1cm4gXCJJbnB1dFwiO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBiaW5kaW5nIGV4cHJlc3Npb24gdG8gZXZhbHVhdGUgdGhlIHZpc2liaWxpdHkgb2YgYSBEYXRhRmllbGQgb3IgRGF0YVBvaW50IGFubm90YXRpb24uXG4gKlxuICogU0FQIEZpb3JpIGVsZW1lbnRzIHdpbGwgZXZhbHVhdGUgZWl0aGVyIHRoZSBVSS5IaWRkZW4gYW5ub3RhdGlvbiBkZWZpbmVkIG9uIHRoZSBhbm5vdGF0aW9uIGl0c2VsZiBvciBvbiB0aGUgdGFyZ2V0IHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7RGF0YU1vZGVsT2JqZWN0UGF0aH0gZGF0YUZpZWxkTW9kZWxQYXRoIFRoZSBtZXRhcGF0aCByZWZlcnJpbmcgdG8gdGhlIGFubm90YXRpb24gd2UgYXJlIGV2YWx1YXRpbmcuXG4gKiBAcGFyYW0ge0ZpZWxkRm9ybWF0T3B0aW9uc30gW2Zvcm1hdE9wdGlvbnNdIEZvcm1hdE9wdGlvbnMgb3B0aW9uYWwuXG4gKiBAcmV0dXJucyB7QmluZGluZ0V4cHJlc3Npb248c3RyaW5nPn0gQW4gZXhwcmVzc2lvbiB0aGF0IHlvdSBjYW4gYmluZCB0byB0aGUgVUkuXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRWaXNpYmxlRXhwcmVzc2lvbiA9IGZ1bmN0aW9uKFxuXHRkYXRhRmllbGRNb2RlbFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdGZvcm1hdE9wdGlvbnM/OiBGaWVsZEZvcm1hdE9wdGlvbnNcbik6IEJpbmRpbmdFeHByZXNzaW9uPHN0cmluZz4ge1xuXHRjb25zdCB0YXJnZXRPYmplY3Q6IERhdGFGaWVsZEFic3RyYWN0VHlwZXMgfCBEYXRhUG9pbnRUeXBlVHlwZXMgPSBkYXRhRmllbGRNb2RlbFBhdGgudGFyZ2V0T2JqZWN0O1xuXHRsZXQgcHJvcGVydHlWYWx1ZTtcblx0aWYgKHRhcmdldE9iamVjdCkge1xuXHRcdHN3aXRjaCAodGFyZ2V0T2JqZWN0LiRUeXBlKSB7XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZDpcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aFVybDpcblx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuRGF0YUZpZWxkV2l0aE5hdmlnYXRpb25QYXRoOlxuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoSW50ZW50QmFzZWROYXZpZ2F0aW9uOlxuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRXaXRoQWN0aW9uOlxuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhUG9pbnRUeXBlOlxuXHRcdFx0XHRwcm9wZXJ0eVZhbHVlID0gdGFyZ2V0T2JqZWN0LlZhbHVlLiR0YXJnZXQ7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBbm5vdGF0aW9uOlxuXHRcdFx0XHQvLyBpZiBpdCBpcyBhIERhdGFGaWVsZEZvckFubm90YXRpb24gcG9pbnRpbmcgdG8gYSBEYXRhUG9pbnQgd2UgbG9vayBhdCB0aGUgZGF0YVBvaW50J3MgdmFsdWVcblx0XHRcdFx0aWYgKHRhcmdldE9iamVjdD8uVGFyZ2V0Py4kdGFyZ2V0Py4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuRGF0YVBvaW50VHlwZSkge1xuXHRcdFx0XHRcdHByb3BlcnR5VmFsdWUgPSB0YXJnZXRPYmplY3QuVGFyZ2V0LiR0YXJnZXQ/LlZhbHVlLiR0YXJnZXQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1mYWxsdGhyb3VnaFxuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb246XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckFjdGlvbjpcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHByb3BlcnR5VmFsdWUgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXHR9XG5cdGNvbnN0IGlzQW5hbHl0aWNhbEdyb3VwSGVhZGVyRXhwYW5kZWQgPSBmb3JtYXRPcHRpb25zPy5pc0FuYWx5dGljcyA/IFVJLklzRXhwYW5kZWQgOiBjb25zdGFudChmYWxzZSk7XG5cdGNvbnN0IGlzQW5hbHl0aWNhbExlYWYgPSBmb3JtYXRPcHRpb25zPy5pc0FuYWx5dGljcyA/IGVxdWFsKFVJLk5vZGVMZXZlbCwgMCkgOiBjb25zdGFudChmYWxzZSk7XG5cblx0Ly8gQSBkYXRhIGZpZWxkIGlzIHZpc2libGUgaWY6XG5cdC8vIC0gdGhlIFVJLkhpZGRlbiBleHByZXNzaW9uIGluIHRoZSBvcmlnaW5hbCBhbm5vdGF0aW9uIGRvZXMgbm90IGV2YWx1YXRlIHRvICd0cnVlJ1xuXHQvLyAtIHRoZSBVSS5IaWRkZW4gZXhwcmVzc2lvbiBpbiB0aGUgdGFyZ2V0IHByb3BlcnR5IGRvZXMgbm90IGV2YWx1YXRlIHRvICd0cnVlJ1xuXHQvLyAtIGluIGNhc2Ugb2YgQW5hbHl0aWNzIGl0J3Mgbm90IHZpc2libGUgZm9yIGFuIGV4cGFuZGVkIEdyb3VwSGVhZGVyXG5cdHJldHVybiBjb21waWxlQmluZGluZyhcblx0XHRhbmQoXG5cdFx0XHQuLi5bXG5cdFx0XHRcdG5vdChlcXVhbChhbm5vdGF0aW9uRXhwcmVzc2lvbih0YXJnZXRPYmplY3Q/LmFubm90YXRpb25zPy5VST8uSGlkZGVuKSwgdHJ1ZSkpLFxuXHRcdFx0XHRpZkVsc2UoXG5cdFx0XHRcdFx0ISFwcm9wZXJ0eVZhbHVlLFxuXHRcdFx0XHRcdHByb3BlcnR5VmFsdWUgJiYgbm90KGVxdWFsKGFubm90YXRpb25FeHByZXNzaW9uKHByb3BlcnR5VmFsdWUuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4pLCB0cnVlKSksXG5cdFx0XHRcdFx0dHJ1ZVxuXHRcdFx0XHQpLFxuXHRcdFx0XHRvcihub3QoaXNBbmFseXRpY2FsR3JvdXBIZWFkZXJFeHBhbmRlZCksIGlzQW5hbHl0aWNhbExlYWYpXG5cdFx0XHRdXG5cdFx0KVxuXHQpO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldElucHV0RGVzY3JpcHRpb24gPSBmdW5jdGlvbihcblx0b1Byb3BlcnR5UGF0aDogUHJvcGVydHlPclBhdGg8UHJvcGVydHk+LFxuXHRkZXNjcmlwdGlvbkJpbmRpbmdFeHByZXNzaW9uOiBCaW5kaW5nRXhwcmVzc2lvbjxzdHJpbmc+XG4pOiBCaW5kaW5nRXhwcmVzc2lvbjxzdHJpbmc+IHtcblx0Y29uc3Qgb1Byb3BlcnR5ID0gKGlzUGF0aEV4cHJlc3Npb24ob1Byb3BlcnR5UGF0aCkgJiYgb1Byb3BlcnR5UGF0aC4kdGFyZ2V0KSB8fCAob1Byb3BlcnR5UGF0aCBhcyBQcm9wZXJ0eSk7XG5cdGNvbnN0IHVuaXRQcm9wZXJ0eSA9IGdldEFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5KG9Qcm9wZXJ0eSkgfHwgZ2V0QXNzb2NpYXRlZFVuaXRQcm9wZXJ0eShvUHJvcGVydHkpO1xuXHRpZiAoIXVuaXRQcm9wZXJ0eSkge1xuXHRcdHJldHVybiBjb21waWxlQmluZGluZyhcIlwiKTtcblx0fVxuXHRjb25zdCBlZGl0YWJsZUV4cHJlc3Npb24gPSBhbmQobm90KGlzUmVhZE9ubHlFeHByZXNzaW9uKHVuaXRQcm9wZXJ0eSkpLCBub3QoUHJvcGVydHlIZWxwZXIuaXNDb21wdXRlZCh1bml0UHJvcGVydHkpKSk7XG5cdHJldHVybiBjb21waWxlQmluZGluZyhpZkVsc2UoZWRpdGFibGVFeHByZXNzaW9uLCBcIlwiLCBkZXNjcmlwdGlvbkJpbmRpbmdFeHByZXNzaW9uKSk7XG59O1xuXG5leHBvcnQgY29uc3QgUVZUZXh0QmluZGluZyA9IGZ1bmN0aW9uKFxuXHRvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRvUHJvcGVydHlWYWx1ZURhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdGZpZWxkRm9ybWF0T3B0aW9uczogRmllbGRGb3JtYXRPcHRpb25zLFxuXHRhc09iamVjdDogYm9vbGVhbiA9IGZhbHNlXG4pIHtcblx0bGV0IHJldHVyblZhbHVlOiBhbnkgPSBnZXRWYWx1ZUJpbmRpbmcob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aCwgZmllbGRGb3JtYXRPcHRpb25zLCBhc09iamVjdCk7XG5cdGlmIChyZXR1cm5WYWx1ZSA9PT0gXCJcIikge1xuXHRcdHJldHVyblZhbHVlID0gZ2V0VGV4dEJpbmRpbmcob1Byb3BlcnR5VmFsdWVEYXRhTW9kZWxPYmplY3RQYXRoLCBmaWVsZEZvcm1hdE9wdGlvbnMsIGFzT2JqZWN0KTtcblx0fVxuXHRyZXR1cm4gcmV0dXJuVmFsdWU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0UXVpY2tWaWV3VHlwZSA9IGZ1bmN0aW9uKG9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgpOiBzdHJpbmcge1xuXHRjb25zdCB0YXJnZXRPYmplY3QgPSBvUHJvcGVydHlEYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdDtcblx0aWYgKHRhcmdldE9iamVjdD8uJHRhcmdldD8uYW5ub3RhdGlvbnM/LkNvbW11bmljYXRpb24/LklzRW1haWxBZGRyZXNzKSB7XG5cdFx0cmV0dXJuIFwiZW1haWxcIjtcblx0fVxuXHRpZiAodGFyZ2V0T2JqZWN0Py4kdGFyZ2V0Py5hbm5vdGF0aW9ucz8uQ29tbXVuaWNhdGlvbj8uSXNQaG9uZU51bWJlcikge1xuXHRcdHJldHVybiBcInBob25lXCI7XG5cdH1cblx0cmV0dXJuIFwidGV4dFwiO1xufTtcbiJdfQ==