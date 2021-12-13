/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/MetaModelConverter", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/converters/helpers/BindingHelper", "sap/fe/core/templating/PropertyHelper", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/core/templating/FieldControlHelper", "sap/fe/core/formatters/ValueFormatter"], function (MetaModelConverter, BindingExpression, BindingHelper, PropertyHelper, DataModelPathHelper, FieldControlHelper, valueFormatters) {
  "use strict";

  var _exports = {};
  var isDisabledExpression = FieldControlHelper.isDisabledExpression;
  var isNonEditableExpression = FieldControlHelper.isNonEditableExpression;
  var isReadOnlyExpression = FieldControlHelper.isReadOnlyExpression;
  var getPathRelativeLocation = DataModelPathHelper.getPathRelativeLocation;
  var isPathUpdatable = DataModelPathHelper.isPathUpdatable;
  var getTargetEntitySetPath = DataModelPathHelper.getTargetEntitySetPath;
  var isProperty = PropertyHelper.isProperty;
  var isPathExpression = PropertyHelper.isPathExpression;
  var isKey = PropertyHelper.isKey;
  var isImmutable = PropertyHelper.isImmutable;
  var isComputed = PropertyHelper.isComputed;
  var hasValueHelp = PropertyHelper.hasValueHelp;
  var getAssociatedCurrencyProperty = PropertyHelper.getAssociatedCurrencyProperty;
  var getAssociatedUnitProperty = PropertyHelper.getAssociatedUnitProperty;
  var UI = BindingHelper.UI;
  var or = BindingExpression.or;
  var not = BindingExpression.not;
  var isTruthy = BindingExpression.isTruthy;
  var isConstant = BindingExpression.isConstant;
  var ifElse = BindingExpression.ifElse;
  var formatResult = BindingExpression.formatResult;
  var equal = BindingExpression.equal;
  var constant = BindingExpression.constant;
  var compileBinding = BindingExpression.compileBinding;
  var annotationExpression = BindingExpression.annotationExpression;
  var and = BindingExpression.and;
  var addTypeInformation = BindingExpression.addTypeInformation;
  var getInvolvedDataModelObjects = MetaModelConverter.getInvolvedDataModelObjects;
  var convertMetaModelContext = MetaModelConverter.convertMetaModelContext;

  var EDM_TYPE_MAPPING = {
    "Edm.Boolean": {
      type: "sap.ui.model.odata.type.Boolean"
    },
    "Edm.Byte": {
      type: "sap.ui.model.odata.type.Byte"
    },
    "Edm.Date": {
      type: "sap.ui.model.odata.type.Date"
    },
    "Edm.DateTimeOffset": {
      constraints: {
        "$Precision": "precision"
      },
      type: "sap.ui.model.odata.type.DateTimeOffset"
    },
    "Edm.Decimal": {
      constraints: {
        "@Org.OData.Validation.V1.Minimum/$Decimal": "minimum",
        "@Org.OData.Validation.V1.Minimum@Org.OData.Validation.V1.Exclusive": "minimumExclusive",
        "@Org.OData.Validation.V1.Maximum/$Decimal": "maximum",
        "@Org.OData.Validation.V1.Maximum@Org.OData.Validation.V1.Exclusive": "maximumExclusive",
        "$Precision": "precision",
        "$Scale": "scale"
      },
      type: "sap.ui.model.odata.type.Decimal"
    },
    "Edm.Double": {
      type: "sap.ui.model.odata.type.Double"
    },
    "Edm.Guid": {
      type: "sap.ui.model.odata.type.Guid"
    },
    "Edm.Int16": {
      type: "sap.ui.model.odata.type.Int16"
    },
    "Edm.Int32": {
      type: "sap.ui.model.odata.type.Int32"
    },
    "Edm.Int64": {
      type: "sap.ui.model.odata.type.Int64"
    },
    "Edm.SByte": {
      type: "sap.ui.model.odata.type.SByte"
    },
    "Edm.Single": {
      type: "sap.ui.model.odata.type.Single"
    },
    "Edm.Stream": {
      type: "sap.ui.model.odata.type.Stream"
    },
    "Edm.String": {
      constraints: {
        "@com.sap.vocabularies.Common.v1.IsDigitSequence": "isDigitSequence",
        "$MaxLength": "maxLength",
        "$Nullable": "nullable"
      },
      type: "sap.ui.model.odata.type.String"
    },
    "Edm.TimeOfDay": {
      constraints: {
        "$Precision": "precision"
      },
      type: "sap.ui.model.odata.type.TimeOfDay"
    }
  };
  /**
   * Create the expression to generate an "editable" boolean value.
   *
   * @param {PropertyPath} oPropertyPath The input property
   * @param {object} oDataFieldConverted The DataFieldConverted object to read the fieldControl annotation
   * @param {DataModelObjectPath} oDataModelObjectPath The path to this property object
   * @param {boolean} bAsObject Whether or not this should be returned as an object or a binding string
   * @returns {string} The binding expression used to determine if a property is editable or not
   */

  _exports.EDM_TYPE_MAPPING = EDM_TYPE_MAPPING;

  var getEditableExpression = function (oPropertyPath) {
    var oDataFieldConverted = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var oDataModelObjectPath = arguments.length > 2 ? arguments[2] : undefined;
    var bAsObject = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (!oPropertyPath || typeof oPropertyPath === "string") {
      return compileBinding(false);
    }

    var dataFieldEditableExpression = true;

    if (oDataFieldConverted !== null) {
      dataFieldEditableExpression = ifElse(isNonEditableExpression(oDataFieldConverted), false, UI.IsEditable);
    }

    var oProperty = isPathExpression(oPropertyPath) && oPropertyPath.$target || oPropertyPath; // Editability depends on the field control expression
    // If the Field control is statically in ReadOnly or Inapplicable (disabled) -> not editable
    // If the property is a key -> not editable except in creation if not computed
    // If the property is computed -> not editable
    // If the property is not updatable -> not editable
    // If the property is immutable -> not editable except in creation
    // If the Field control is a path resolving to ReadOnly or Inapplicable (disabled) (<= 1) -> not editable
    // Else, to be editable you need
    // immutable and key while in the creation row
    // ui/isEditable

    var isPathUpdatableExpression = isPathUpdatable(oDataModelObjectPath, oPropertyPath);
    var editableExpression = ifElse(or(not(isPathUpdatableExpression), isComputed(oProperty), isKey(oProperty), isImmutable(oProperty), isNonEditableExpression(oProperty)), ifElse(or(isComputed(oProperty), isNonEditableExpression(oProperty)), false, UI.IsTransientBinding), UI.IsEditable);

    if (bAsObject) {
      return and(editableExpression, dataFieldEditableExpression);
    }

    return compileBinding(and(editableExpression, dataFieldEditableExpression));
  };
  /**
   * Create the expression to generate an "enabled" boolean value.
   *
   * @param {PropertyPath} oPropertyPath The input property
   * @param {any} oDataFieldConverted The DataFieldConverted Object to read the fieldControl annotation
   * @param {boolean} bAsObject Whether or not this should be returned as an object or a binding string
   * @returns {string} The binding expression to determine if a property is enabled or not
   */


  _exports.getEditableExpression = getEditableExpression;

  var getEnabledExpression = function (oPropertyPath, oDataFieldConverted) {
    var bAsObject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (!oPropertyPath || typeof oPropertyPath === "string") {
      return compileBinding(true);
    }

    var dataFieldEnabledExpression = true;

    if (oDataFieldConverted !== null) {
      dataFieldEnabledExpression = ifElse(isDisabledExpression(oDataFieldConverted), false, true);
    }

    var oProperty = isPathExpression(oPropertyPath) && oPropertyPath.$target || oPropertyPath; // Enablement depends on the field control expression
    // If the Field control is statically in Inapplicable (disabled) -> not enabled

    var enabledExpression = ifElse(isDisabledExpression(oProperty), false, true);

    if (bAsObject) {
      return and(enabledExpression, dataFieldEnabledExpression);
    }

    return compileBinding(and(enabledExpression, dataFieldEnabledExpression));
  };
  /**
   * Create the expression to generate an "editMode" enum value.
   * @param {PropertyPath} oPropertyPath The input property
   * @param {DataModelObjectPath} oDataModelObjectPath The list of data model objects that are involved to reach that property
   * @param {boolean} bMeasureReadOnly Whether we should set UoM / currency field mode to read only
   * @param {boolean} bAsObject Whether we should return this as an expression or as a string
   * @param {object} oDataFieldConverted The dataField object
   * @returns {BindingExpression<string> | ExpressionOrPrimitive<string>} The binding expression representing the current property edit mode, compliant with the MDC Field definition of editMode.
   */


  _exports.getEnabledExpression = getEnabledExpression;

  var getEditMode = function (oPropertyPath, oDataModelObjectPath) {
    var bMeasureReadOnly = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var bAsObject = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var oDataFieldConverted = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

    if (!oPropertyPath || typeof oPropertyPath === "string") {
      return "Display";
    }

    var oProperty = isPathExpression(oPropertyPath) && oPropertyPath.$target || oPropertyPath; // if the property is not enabled => Disabled
    // if the property is enabled && not editable => ReadOnly
    // if the property is enabled && editable => Editable
    // If there is an associated unit, and it has a field control also use consider the following
    // if the unit field control is readonly -> EditableReadOnly
    // otherwise -> Editable

    var editableExpression = getEditableExpression(oPropertyPath, oDataFieldConverted, oDataModelObjectPath, true);
    var enabledExpression = getEnabledExpression(oPropertyPath, oDataFieldConverted, true);
    var associatedCurrencyProperty = getAssociatedCurrencyProperty(oProperty);
    var unitProperty = associatedCurrencyProperty || getAssociatedUnitProperty(oProperty);
    var resultExpression = "Editable";

    if (unitProperty) {
      resultExpression = ifElse(or(isReadOnlyExpression(unitProperty), isComputed(unitProperty), bMeasureReadOnly), "EditableReadOnly", "Editable");
    }

    var readOnlyExpression = or(isReadOnlyExpression(oProperty), isReadOnlyExpression(oDataFieldConverted)); // if the property is from a non-updatable entity => Read only mode, previously calculated edit Mode is ignored
    // if the property is from an updatable entity => previously calculated edit Mode expression

    var editModeExpression = ifElse(enabledExpression, ifElse(editableExpression, resultExpression, ifElse(and(!isConstant(readOnlyExpression) && readOnlyExpression, UI.IsEditable), "ReadOnly", "Display")), ifElse(UI.IsEditable, "Disabled", "Display"));

    if (bAsObject) {
      return editModeExpression;
    }

    return compileBinding(editModeExpression);
  };

  _exports.getEditMode = getEditMode;

  var hasValidAnalyticalCurrencyOrUnit = function (oPropertyDataModelObjectPath) {
    var _oPropertyDefinition$, _oPropertyDefinition$2, _oPropertyDefinition$3, _oPropertyDefinition$4;

    var oPropertyDefinition = oPropertyDataModelObjectPath.targetObject;
    var currency = (_oPropertyDefinition$ = oPropertyDefinition.annotations) === null || _oPropertyDefinition$ === void 0 ? void 0 : (_oPropertyDefinition$2 = _oPropertyDefinition$.Measures) === null || _oPropertyDefinition$2 === void 0 ? void 0 : _oPropertyDefinition$2.ISOCurrency;
    var measure = currency ? currency : (_oPropertyDefinition$3 = oPropertyDefinition.annotations) === null || _oPropertyDefinition$3 === void 0 ? void 0 : (_oPropertyDefinition$4 = _oPropertyDefinition$3.Measures) === null || _oPropertyDefinition$4 === void 0 ? void 0 : _oPropertyDefinition$4.Unit;

    if (measure) {
      return compileBinding(or(isTruthy(annotationExpression(measure)), not(UI.IsTotal)));
    } else {
      return compileBinding(constant(true));
    }
  };

  _exports.hasValidAnalyticalCurrencyOrUnit = hasValidAnalyticalCurrencyOrUnit;

  var ifUnitEditable = function (oPropertyPath, sEditableValue, sNonEditableValue) {
    var oProperty = isPathExpression(oPropertyPath) && oPropertyPath.$target || oPropertyPath;
    var unitProperty = getAssociatedCurrencyProperty(oProperty) || getAssociatedUnitProperty(oProperty);

    if (!unitProperty) {
      return compileBinding(sNonEditableValue);
    }

    var editableExpression = and(not(isReadOnlyExpression(unitProperty)), not(isComputed(unitProperty)));
    return compileBinding(ifElse(editableExpression, sEditableValue, sNonEditableValue));
  };

  _exports.ifUnitEditable = ifUnitEditable;

  var getDisplayMode = function (oPropertyPath, oDataModelObjectPath) {
    var _oProperty$annotation, _oProperty$annotation2, _oTextAnnotation$anno, _oTextAnnotation$anno2, _oTextAnnotation$anno3, _oEntityType$annotati, _oEntityType$annotati2, _oEntityType$annotati3, _oEntityType$annotati4, _oEntityType$annotati5, _oEntityType$annotati6;

    if (!oPropertyPath || typeof oPropertyPath === "string") {
      return "Value";
    }

    var oProperty = isPathExpression(oPropertyPath) && oPropertyPath.$target || oPropertyPath;
    var oEntityType = oDataModelObjectPath && oDataModelObjectPath.targetEntityType;
    var oTextAnnotation = (_oProperty$annotation = oProperty.annotations) === null || _oProperty$annotation === void 0 ? void 0 : (_oProperty$annotation2 = _oProperty$annotation.Common) === null || _oProperty$annotation2 === void 0 ? void 0 : _oProperty$annotation2.Text;
    var oTextArrangementAnnotation = typeof oTextAnnotation !== "string" && (oTextAnnotation === null || oTextAnnotation === void 0 ? void 0 : (_oTextAnnotation$anno = oTextAnnotation.annotations) === null || _oTextAnnotation$anno === void 0 ? void 0 : (_oTextAnnotation$anno2 = _oTextAnnotation$anno.UI) === null || _oTextAnnotation$anno2 === void 0 ? void 0 : (_oTextAnnotation$anno3 = _oTextAnnotation$anno2.TextArrangement) === null || _oTextAnnotation$anno3 === void 0 ? void 0 : _oTextAnnotation$anno3.toString()) || (oEntityType === null || oEntityType === void 0 ? void 0 : (_oEntityType$annotati = oEntityType.annotations) === null || _oEntityType$annotati === void 0 ? void 0 : (_oEntityType$annotati2 = _oEntityType$annotati.UI) === null || _oEntityType$annotati2 === void 0 ? void 0 : (_oEntityType$annotati3 = _oEntityType$annotati2.TextArrangement) === null || _oEntityType$annotati3 === void 0 ? void 0 : _oEntityType$annotati3.toString());
    var sDisplayValue = oTextAnnotation ? "DescriptionValue" : "Value";

    if (oTextAnnotation && oTextArrangementAnnotation || oEntityType !== null && oEntityType !== void 0 && (_oEntityType$annotati4 = oEntityType.annotations) !== null && _oEntityType$annotati4 !== void 0 && (_oEntityType$annotati5 = _oEntityType$annotati4.UI) !== null && _oEntityType$annotati5 !== void 0 && (_oEntityType$annotati6 = _oEntityType$annotati5.TextArrangement) !== null && _oEntityType$annotati6 !== void 0 && _oEntityType$annotati6.toString()) {
      if (oTextArrangementAnnotation === "UI.TextArrangementType/TextOnly") {
        sDisplayValue = "Description";
      } else if (oTextArrangementAnnotation === "UI.TextArrangementType/TextLast") {
        sDisplayValue = "ValueDescription";
      } else if (oTextArrangementAnnotation === "UI.TextArrangementType/TextSeparate") {
        sDisplayValue = "Value";
      } else {
        //Default should be TextFirst if there is a Text annotation and neither TextOnly nor TextLast are set
        sDisplayValue = "DescriptionValue";
      }
    }

    return sDisplayValue;
  };

  _exports.getDisplayMode = getDisplayMode;

  var getFieldDisplay = function (oPropertyPath, sTargetDisplayMode, oComputedEditMode) {
    var oProperty = isPathExpression(oPropertyPath) && oPropertyPath.$target || oPropertyPath;
    return hasValueHelp(oProperty) ? compileBinding(sTargetDisplayMode) : compileBinding(ifElse(equal(oComputedEditMode, "Editable"), "Value", sTargetDisplayMode));
  };

  _exports.getFieldDisplay = getFieldDisplay;

  var formatWithTypeInformation = function (oProperty, propertyBindingExpression) {
    var outExpression = propertyBindingExpression;

    if (oProperty._type === "Property") {
      var oTargetMapping = EDM_TYPE_MAPPING[oProperty.type];

      if (oTargetMapping) {
        var _outExpression$type, _outExpression$type2;

        outExpression.type = oTargetMapping.type;

        if (oTargetMapping.constraints) {
          var _oProperty$annotation3, _oProperty$annotation4, _oProperty$annotation5, _oProperty$annotation6;

          outExpression.constraints = {};

          if (oTargetMapping.constraints.$Scale && oProperty.scale !== undefined) {
            outExpression.constraints.scale = oProperty.scale;
          }

          if (oTargetMapping.constraints.$Precision && oProperty.precision !== undefined) {
            outExpression.constraints.precision = oProperty.precision;
          }

          if (oTargetMapping.constraints.$MaxLength && oProperty.maxLength !== undefined) {
            outExpression.constraints.maxLength = oProperty.maxLength;
          }

          if (oTargetMapping.constraints.$Nullable && oProperty.nullable === false) {
            outExpression.constraints.nullable = oProperty.nullable;
          }

          if (oTargetMapping.constraints["@Org.OData.Validation.V1.Minimum/$Decimal"] && ((_oProperty$annotation3 = oProperty.annotations) === null || _oProperty$annotation3 === void 0 ? void 0 : (_oProperty$annotation4 = _oProperty$annotation3.Validation) === null || _oProperty$annotation4 === void 0 ? void 0 : _oProperty$annotation4.Minimum) !== undefined && !isNaN(oProperty.annotations.Validation.Minimum)) {
            outExpression.constraints.minimum = "".concat(oProperty.annotations.Validation.Minimum);
          }

          if (oTargetMapping.constraints["@Org.OData.Validation.V1.Maximum/$Decimal"] && ((_oProperty$annotation5 = oProperty.annotations) === null || _oProperty$annotation5 === void 0 ? void 0 : (_oProperty$annotation6 = _oProperty$annotation5.Validation) === null || _oProperty$annotation6 === void 0 ? void 0 : _oProperty$annotation6.Maximum) !== undefined && !isNaN(oProperty.annotations.Validation.Maximum)) {
            outExpression.constraints.maximum = "".concat(oProperty.annotations.Validation.Maximum);
          }
        }

        if ((outExpression === null || outExpression === void 0 ? void 0 : (_outExpression$type = outExpression.type) === null || _outExpression$type === void 0 ? void 0 : _outExpression$type.indexOf("sap.ui.model.odata.type.Int")) === 0) {
          if (!outExpression.formatOptions) {
            outExpression.formatOptions = {};
          }

          outExpression.formatOptions = Object.assign(outExpression.formatOptions, {
            parseAsString: false,
            emptyString: ""
          });
        }

        if (outExpression.type === "sap.ui.model.odata.type.String") {
          var _oTargetMapping$const, _oProperty$annotation7, _oProperty$annotation8;

          if (!outExpression.formatOptions) {
            outExpression.formatOptions = {};
          }

          outExpression.formatOptions.parseKeepsEmptyString = true;

          if ((_oTargetMapping$const = oTargetMapping.constraints) !== null && _oTargetMapping$const !== void 0 && _oTargetMapping$const["@com.sap.vocabularies.Common.v1.IsDigitSequence"] && (_oProperty$annotation7 = oProperty.annotations) !== null && _oProperty$annotation7 !== void 0 && (_oProperty$annotation8 = _oProperty$annotation7.Common) !== null && _oProperty$annotation8 !== void 0 && _oProperty$annotation8.IsDigitSequence) {
            outExpression.constraints.isDigitSequence = true;
          }
        }

        if ((outExpression === null || outExpression === void 0 ? void 0 : (_outExpression$type2 = outExpression.type) === null || _outExpression$type2 === void 0 ? void 0 : _outExpression$type2.indexOf("sap.ui.model.odata.type.Double")) === 0) {
          if (!outExpression.formatOptions) {
            outExpression.formatOptions = {};
          }

          outExpression.formatOptions = Object.assign(outExpression.formatOptions, {
            parseAsString: false,
            emptyString: ""
          });
        }
      }
    }

    return outExpression;
  };

  _exports.formatWithTypeInformation = formatWithTypeInformation;

  var getTypeConfig = function (oProperty, dataType) {
    var _propertyTypeConfig$t, _propertyTypeConfig$t2, _propertyTypeConfig$t3, _propertyTypeConfig$t4;

    var oTargetMapping = EDM_TYPE_MAPPING[oProperty === null || oProperty === void 0 ? void 0 : oProperty.type] || (dataType ? EDM_TYPE_MAPPING[dataType] : undefined);
    var propertyTypeConfig = {
      type: oTargetMapping.type,
      constraints: {},
      formatOptions: {}
    };

    if (isProperty(oProperty)) {
      var _oTargetMapping$const2, _oTargetMapping$const3, _oTargetMapping$const4, _oTargetMapping$const5, _oTargetMapping$const6, _oProperty$annotation9, _oProperty$annotation10, _oProperty$annotation11, _oProperty$annotation12, _oTargetMapping$const7, _oProperty$annotation13, _oProperty$annotation14, _oProperty$annotation15, _oProperty$annotation16, _oTargetMapping$const8, _annotations, _annotations$Common;

      propertyTypeConfig.constraints = {
        scale: (_oTargetMapping$const2 = oTargetMapping.constraints) !== null && _oTargetMapping$const2 !== void 0 && _oTargetMapping$const2.$Scale ? oProperty.scale : undefined,
        precision: (_oTargetMapping$const3 = oTargetMapping.constraints) !== null && _oTargetMapping$const3 !== void 0 && _oTargetMapping$const3.$Precision ? oProperty.precision : undefined,
        maxLength: (_oTargetMapping$const4 = oTargetMapping.constraints) !== null && _oTargetMapping$const4 !== void 0 && _oTargetMapping$const4.$MaxLength ? oProperty.maxLength : undefined,
        nullable: (_oTargetMapping$const5 = oTargetMapping.constraints) !== null && _oTargetMapping$const5 !== void 0 && _oTargetMapping$const5.$Nullable ? oProperty.nullable : undefined,
        minimum: (_oTargetMapping$const6 = oTargetMapping.constraints) !== null && _oTargetMapping$const6 !== void 0 && _oTargetMapping$const6["@Org.OData.Validation.V1.Minimum/$Decimal"] && !isNaN((_oProperty$annotation9 = oProperty.annotations) === null || _oProperty$annotation9 === void 0 ? void 0 : (_oProperty$annotation10 = _oProperty$annotation9.Validation) === null || _oProperty$annotation10 === void 0 ? void 0 : _oProperty$annotation10.Minimum) ? "".concat((_oProperty$annotation11 = oProperty.annotations) === null || _oProperty$annotation11 === void 0 ? void 0 : (_oProperty$annotation12 = _oProperty$annotation11.Validation) === null || _oProperty$annotation12 === void 0 ? void 0 : _oProperty$annotation12.Minimum) : undefined,
        maximum: (_oTargetMapping$const7 = oTargetMapping.constraints) !== null && _oTargetMapping$const7 !== void 0 && _oTargetMapping$const7["@Org.OData.Validation.V1.Maximum/$Decimal"] && !isNaN((_oProperty$annotation13 = oProperty.annotations) === null || _oProperty$annotation13 === void 0 ? void 0 : (_oProperty$annotation14 = _oProperty$annotation13.Validation) === null || _oProperty$annotation14 === void 0 ? void 0 : _oProperty$annotation14.Maximum) ? "".concat((_oProperty$annotation15 = oProperty.annotations) === null || _oProperty$annotation15 === void 0 ? void 0 : (_oProperty$annotation16 = _oProperty$annotation15.Validation) === null || _oProperty$annotation16 === void 0 ? void 0 : _oProperty$annotation16.Maximum) : undefined,
        isDigitSequence: propertyTypeConfig.type === "sap.ui.model.odata.type.String" && (_oTargetMapping$const8 = oTargetMapping.constraints) !== null && _oTargetMapping$const8 !== void 0 && _oTargetMapping$const8["@com.sap.vocabularies.Common.v1.IsDigitSequence"] && (_annotations = oProperty.annotations) !== null && _annotations !== void 0 && (_annotations$Common = _annotations.Common) !== null && _annotations$Common !== void 0 && _annotations$Common.IsDigitSequence ? true : undefined
      };
    }

    propertyTypeConfig.formatOptions = {
      parseAsString: (propertyTypeConfig === null || propertyTypeConfig === void 0 ? void 0 : (_propertyTypeConfig$t = propertyTypeConfig.type) === null || _propertyTypeConfig$t === void 0 ? void 0 : _propertyTypeConfig$t.indexOf("sap.ui.model.odata.type.Int")) === 0 || (propertyTypeConfig === null || propertyTypeConfig === void 0 ? void 0 : (_propertyTypeConfig$t2 = propertyTypeConfig.type) === null || _propertyTypeConfig$t2 === void 0 ? void 0 : _propertyTypeConfig$t2.indexOf("sap.ui.model.odata.type.Double")) === 0 ? false : undefined,
      emptyString: (propertyTypeConfig === null || propertyTypeConfig === void 0 ? void 0 : (_propertyTypeConfig$t3 = propertyTypeConfig.type) === null || _propertyTypeConfig$t3 === void 0 ? void 0 : _propertyTypeConfig$t3.indexOf("sap.ui.model.odata.type.Int")) === 0 || (propertyTypeConfig === null || propertyTypeConfig === void 0 ? void 0 : (_propertyTypeConfig$t4 = propertyTypeConfig.type) === null || _propertyTypeConfig$t4 === void 0 ? void 0 : _propertyTypeConfig$t4.indexOf("sap.ui.model.odata.type.Double")) === 0 ? "" : undefined,
      parseKeepsEmptyString: propertyTypeConfig.type === "sap.ui.model.odata.type.String" ? true : undefined
    };
    return propertyTypeConfig;
  };

  _exports.getTypeConfig = getTypeConfig;

  var getBindingWithUnitOrCurrency = function (oPropertyDataModelPath, propertyBindingExpression) {
    var _oPropertyDefinition$5, _oPropertyDefinition$6, _unit, _oPropertyDefinition$7, _oPropertyDefinition$8;

    var oPropertyDefinition = oPropertyDataModelPath.targetObject;
    var unit = (_oPropertyDefinition$5 = oPropertyDefinition.annotations) === null || _oPropertyDefinition$5 === void 0 ? void 0 : (_oPropertyDefinition$6 = _oPropertyDefinition$5.Measures) === null || _oPropertyDefinition$6 === void 0 ? void 0 : _oPropertyDefinition$6.Unit;
    var relativeLocation = getPathRelativeLocation(oPropertyDataModelPath.contextLocation, oPropertyDataModelPath.navigationProperties).map(function (np) {
      return np.name;
    });
    propertyBindingExpression = formatWithTypeInformation(oPropertyDefinition, propertyBindingExpression);

    if (((_unit = unit) === null || _unit === void 0 ? void 0 : _unit.toString()) === "%") {
      return formatResult([propertyBindingExpression], valueFormatters.formatWithPercentage);
    }

    var complexType = unit ? "sap.ui.model.odata.type.Unit" : "sap.ui.model.odata.type.Currency";
    unit = unit ? unit : (_oPropertyDefinition$7 = oPropertyDefinition.annotations) === null || _oPropertyDefinition$7 === void 0 ? void 0 : (_oPropertyDefinition$8 = _oPropertyDefinition$7.Measures) === null || _oPropertyDefinition$8 === void 0 ? void 0 : _oPropertyDefinition$8.ISOCurrency;
    var unitBindingExpression = unit.$target ? formatWithTypeInformation(unit.$target, annotationExpression(unit, relativeLocation)) : annotationExpression(unit, relativeLocation);
    return addTypeInformation([propertyBindingExpression, unitBindingExpression], complexType);
  };

  _exports.getBindingWithUnitOrCurrency = getBindingWithUnitOrCurrency;

  var getAlignmentExpression = function (oComputedEditMode) {
    var sAlignDisplay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Begin";
    var sAlignEdit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Begin";
    return compileBinding(ifElse(equal(oComputedEditMode, "Display"), sAlignDisplay, sAlignEdit));
  };
  /**
   * Formatter helper to retrieve the converterContext from the metamodel context.
   *
   * @param {Context} oContext The original metamodel context
   * @param {ComputedAnnotationInterface} oInterface The current templating context
   * @returns {object} The ConverterContext representing that object
   */


  _exports.getAlignmentExpression = getAlignmentExpression;

  var getConverterContext = function (oContext, oInterface) {
    if (oInterface && oInterface.context) {
      return convertMetaModelContext(oInterface.context);
    }

    return null;
  };

  getConverterContext.requiresIContext = true;
  /**
   * Formatter helper to retrieve the data model objects that are involved from the metamodel context.
   *
   * @param {Context} oContext The original ODataMetaModel context
   * @param {ComputedAnnotationInterface} oInterface The current templating context
   * @returns {object[]} An array of entitysets and navproperties that are involved to get to a specific object in the metamodel
   */

  _exports.getConverterContext = getConverterContext;

  var getDataModelObjectPath = function (oContext, oInterface) {
    if (oInterface && oInterface.context) {
      return getInvolvedDataModelObjects(oInterface.context);
    }

    return null;
  };

  getDataModelObjectPath.requiresIContext = true;
  /**
   * Retrieves the expressionBinding created out of a binding expression.
   *
   * @param {Expression<any>} expression The expression which needs to be compiled
   * @returns {BindingExpression<string>} The expression-binding string
   */

  _exports.getDataModelObjectPath = getDataModelObjectPath;

  var getExpressionBinding = function (expression) {
    return compileBinding(expression);
  };
  /**
   * Retrieve the target entityset for a context path if it exists.
   *
   * @param oContext
   * @returns {string}
   */


  _exports.getExpressionBinding = getExpressionBinding;

  var getTargetEntitySet = function (oContext) {
    if (oContext) {
      var oDataModelPath = getInvolvedDataModelObjects(oContext);
      return getTargetEntitySetPath(oDataModelPath);
    }

    return null;
  };

  _exports.getTargetEntitySet = getTargetEntitySet;

  var isCollectionField = function (oDataModelPath) {
    var _oDataModelPath$navig;

    if ((_oDataModelPath$navig = oDataModelPath.navigationProperties) !== null && _oDataModelPath$navig !== void 0 && _oDataModelPath$navig.length) {
      var hasOneToManyNavigation = (oDataModelPath === null || oDataModelPath === void 0 ? void 0 : oDataModelPath.navigationProperties.findIndex(function (oNav) {
        if (oNav.isCollection) {
          var _oDataModelPath$conte, _oDataModelPath$conte2;

          if ((_oDataModelPath$conte = oDataModelPath.contextLocation) !== null && _oDataModelPath$conte !== void 0 && (_oDataModelPath$conte2 = _oDataModelPath$conte.navigationProperties) !== null && _oDataModelPath$conte2 !== void 0 && _oDataModelPath$conte2.length) {
            var _oDataModelPath$conte3;

            //we check the one to many nav is not already part of the context
            return ((_oDataModelPath$conte3 = oDataModelPath.contextLocation) === null || _oDataModelPath$conte3 === void 0 ? void 0 : _oDataModelPath$conte3.navigationProperties.findIndex(function (oContextNav) {
              return oContextNav.name === oNav.name;
            })) === -1;
          }

          return true;
        }

        return false;
      })) > -1;

      if (hasOneToManyNavigation) {
        return true;
      }
    }

    return false;
  };

  _exports.isCollectionField = isCollectionField;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlVJRm9ybWF0dGVycy50cyJdLCJuYW1lcyI6WyJFRE1fVFlQRV9NQVBQSU5HIiwidHlwZSIsImNvbnN0cmFpbnRzIiwiZ2V0RWRpdGFibGVFeHByZXNzaW9uIiwib1Byb3BlcnR5UGF0aCIsIm9EYXRhRmllbGRDb252ZXJ0ZWQiLCJvRGF0YU1vZGVsT2JqZWN0UGF0aCIsImJBc09iamVjdCIsImNvbXBpbGVCaW5kaW5nIiwiZGF0YUZpZWxkRWRpdGFibGVFeHByZXNzaW9uIiwiaWZFbHNlIiwiaXNOb25FZGl0YWJsZUV4cHJlc3Npb24iLCJVSSIsIklzRWRpdGFibGUiLCJvUHJvcGVydHkiLCJpc1BhdGhFeHByZXNzaW9uIiwiJHRhcmdldCIsImlzUGF0aFVwZGF0YWJsZUV4cHJlc3Npb24iLCJpc1BhdGhVcGRhdGFibGUiLCJlZGl0YWJsZUV4cHJlc3Npb24iLCJvciIsIm5vdCIsImlzQ29tcHV0ZWQiLCJpc0tleSIsImlzSW1tdXRhYmxlIiwiSXNUcmFuc2llbnRCaW5kaW5nIiwiYW5kIiwiZ2V0RW5hYmxlZEV4cHJlc3Npb24iLCJkYXRhRmllbGRFbmFibGVkRXhwcmVzc2lvbiIsImlzRGlzYWJsZWRFeHByZXNzaW9uIiwiZW5hYmxlZEV4cHJlc3Npb24iLCJnZXRFZGl0TW9kZSIsImJNZWFzdXJlUmVhZE9ubHkiLCJhc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eSIsImdldEFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5IiwidW5pdFByb3BlcnR5IiwiZ2V0QXNzb2NpYXRlZFVuaXRQcm9wZXJ0eSIsInJlc3VsdEV4cHJlc3Npb24iLCJpc1JlYWRPbmx5RXhwcmVzc2lvbiIsInJlYWRPbmx5RXhwcmVzc2lvbiIsImVkaXRNb2RlRXhwcmVzc2lvbiIsImlzQ29uc3RhbnQiLCJoYXNWYWxpZEFuYWx5dGljYWxDdXJyZW5jeU9yVW5pdCIsIm9Qcm9wZXJ0eURhdGFNb2RlbE9iamVjdFBhdGgiLCJvUHJvcGVydHlEZWZpbml0aW9uIiwidGFyZ2V0T2JqZWN0IiwiY3VycmVuY3kiLCJhbm5vdGF0aW9ucyIsIk1lYXN1cmVzIiwiSVNPQ3VycmVuY3kiLCJtZWFzdXJlIiwiVW5pdCIsImlzVHJ1dGh5IiwiYW5ub3RhdGlvbkV4cHJlc3Npb24iLCJJc1RvdGFsIiwiY29uc3RhbnQiLCJpZlVuaXRFZGl0YWJsZSIsInNFZGl0YWJsZVZhbHVlIiwic05vbkVkaXRhYmxlVmFsdWUiLCJnZXREaXNwbGF5TW9kZSIsIm9FbnRpdHlUeXBlIiwidGFyZ2V0RW50aXR5VHlwZSIsIm9UZXh0QW5ub3RhdGlvbiIsIkNvbW1vbiIsIlRleHQiLCJvVGV4dEFycmFuZ2VtZW50QW5ub3RhdGlvbiIsIlRleHRBcnJhbmdlbWVudCIsInRvU3RyaW5nIiwic0Rpc3BsYXlWYWx1ZSIsImdldEZpZWxkRGlzcGxheSIsInNUYXJnZXREaXNwbGF5TW9kZSIsIm9Db21wdXRlZEVkaXRNb2RlIiwiaGFzVmFsdWVIZWxwIiwiZXF1YWwiLCJmb3JtYXRXaXRoVHlwZUluZm9ybWF0aW9uIiwicHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbiIsIm91dEV4cHJlc3Npb24iLCJfdHlwZSIsIm9UYXJnZXRNYXBwaW5nIiwiJFNjYWxlIiwic2NhbGUiLCJ1bmRlZmluZWQiLCIkUHJlY2lzaW9uIiwicHJlY2lzaW9uIiwiJE1heExlbmd0aCIsIm1heExlbmd0aCIsIiROdWxsYWJsZSIsIm51bGxhYmxlIiwiVmFsaWRhdGlvbiIsIk1pbmltdW0iLCJpc05hTiIsIm1pbmltdW0iLCJNYXhpbXVtIiwibWF4aW11bSIsImluZGV4T2YiLCJmb3JtYXRPcHRpb25zIiwiT2JqZWN0IiwiYXNzaWduIiwicGFyc2VBc1N0cmluZyIsImVtcHR5U3RyaW5nIiwicGFyc2VLZWVwc0VtcHR5U3RyaW5nIiwiSXNEaWdpdFNlcXVlbmNlIiwiaXNEaWdpdFNlcXVlbmNlIiwiZ2V0VHlwZUNvbmZpZyIsImRhdGFUeXBlIiwicHJvcGVydHlUeXBlQ29uZmlnIiwiaXNQcm9wZXJ0eSIsImdldEJpbmRpbmdXaXRoVW5pdE9yQ3VycmVuY3kiLCJvUHJvcGVydHlEYXRhTW9kZWxQYXRoIiwidW5pdCIsInJlbGF0aXZlTG9jYXRpb24iLCJnZXRQYXRoUmVsYXRpdmVMb2NhdGlvbiIsImNvbnRleHRMb2NhdGlvbiIsIm5hdmlnYXRpb25Qcm9wZXJ0aWVzIiwibWFwIiwibnAiLCJuYW1lIiwiZm9ybWF0UmVzdWx0IiwidmFsdWVGb3JtYXR0ZXJzIiwiZm9ybWF0V2l0aFBlcmNlbnRhZ2UiLCJjb21wbGV4VHlwZSIsInVuaXRCaW5kaW5nRXhwcmVzc2lvbiIsImFkZFR5cGVJbmZvcm1hdGlvbiIsImdldEFsaWdubWVudEV4cHJlc3Npb24iLCJzQWxpZ25EaXNwbGF5Iiwic0FsaWduRWRpdCIsImdldENvbnZlcnRlckNvbnRleHQiLCJvQ29udGV4dCIsIm9JbnRlcmZhY2UiLCJjb250ZXh0IiwiY29udmVydE1ldGFNb2RlbENvbnRleHQiLCJyZXF1aXJlc0lDb250ZXh0IiwiZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCIsImdldEludm9sdmVkRGF0YU1vZGVsT2JqZWN0cyIsImdldEV4cHJlc3Npb25CaW5kaW5nIiwiZXhwcmVzc2lvbiIsImdldFRhcmdldEVudGl0eVNldCIsIm9EYXRhTW9kZWxQYXRoIiwiZ2V0VGFyZ2V0RW50aXR5U2V0UGF0aCIsImlzQ29sbGVjdGlvbkZpZWxkIiwibGVuZ3RoIiwiaGFzT25lVG9NYW55TmF2aWdhdGlvbiIsImZpbmRJbmRleCIsIm9OYXYiLCJpc0NvbGxlY3Rpb24iLCJvQ29udGV4dE5hdiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5RU8sTUFBTUEsZ0JBQXFDLEdBQUc7QUFDcEQsbUJBQWU7QUFBRUMsTUFBQUEsSUFBSSxFQUFFO0FBQVIsS0FEcUM7QUFFcEQsZ0JBQVk7QUFBRUEsTUFBQUEsSUFBSSxFQUFFO0FBQVIsS0FGd0M7QUFHcEQsZ0JBQVk7QUFBRUEsTUFBQUEsSUFBSSxFQUFFO0FBQVIsS0FId0M7QUFJcEQsMEJBQXNC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bXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NFwiO1xuaW1wb3J0IHsgY29udmVydE1ldGFNb2RlbENvbnRleHQsIGdldEludm9sdmVkRGF0YU1vZGVsT2JqZWN0cyB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL01ldGFNb2RlbENvbnZlcnRlclwiO1xuaW1wb3J0IHtcblx0YWRkVHlwZUluZm9ybWF0aW9uLFxuXHRhbmQsXG5cdGFubm90YXRpb25FeHByZXNzaW9uLFxuXHRCaW5kaW5nRXhwcmVzc2lvbixcblx0QmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uLFxuXHRjb21waWxlQmluZGluZyxcblx0Y29uc3RhbnQsXG5cdGVxdWFsLFxuXHRFeHByZXNzaW9uLFxuXHRFeHByZXNzaW9uT3JQcmltaXRpdmUsXG5cdGZvcm1hdFJlc3VsdCxcblx0aWZFbHNlLFxuXHRpc0NvbnN0YW50LFxuXHRpc1RydXRoeSxcblx0bm90LFxuXHRvclxufSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nRXhwcmVzc2lvblwiO1xuaW1wb3J0IHsgVUkgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0JpbmRpbmdIZWxwZXJcIjtcbmltcG9ydCB7XG5cdGdldEFzc29jaWF0ZWRVbml0UHJvcGVydHksXG5cdGdldEFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5LFxuXHRoYXNWYWx1ZUhlbHAsXG5cdGlzQ29tcHV0ZWQsXG5cdGlzSW1tdXRhYmxlLFxuXHRpc0tleSxcblx0aXNQYXRoRXhwcmVzc2lvbixcblx0aXNQcm9wZXJ0eVxufSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9Qcm9wZXJ0eUhlbHBlclwiO1xuaW1wb3J0IHsgTmF2aWdhdGlvblByb3BlcnR5LCBQcm9wZXJ0eSB9IGZyb20gXCJAc2FwLXV4L2Fubm90YXRpb24tY29udmVydGVyXCI7XG5pbXBvcnQgeyBQYXRoQW5ub3RhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvdHlwZXMvRWRtXCI7XG5pbXBvcnQge1xuXHREYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRnZXRUYXJnZXRFbnRpdHlTZXRQYXRoLFxuXHRpc1BhdGhVcGRhdGFibGUsXG5cdGdldFBhdGhSZWxhdGl2ZUxvY2F0aW9uXG59IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL0RhdGFNb2RlbFBhdGhIZWxwZXJcIjtcbmltcG9ydCB7IGlzUmVhZE9ubHlFeHByZXNzaW9uLCBpc05vbkVkaXRhYmxlRXhwcmVzc2lvbiwgaXNEaXNhYmxlZEV4cHJlc3Npb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvdGVtcGxhdGluZy9GaWVsZENvbnRyb2xIZWxwZXJcIjtcbmltcG9ydCB2YWx1ZUZvcm1hdHRlcnMgZnJvbSBcInNhcC9mZS9jb3JlL2Zvcm1hdHRlcnMvVmFsdWVGb3JtYXR0ZXJcIjtcbmltcG9ydCB7IERhdGFGaWVsZEFic3RyYWN0VHlwZXMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcblxuZXhwb3J0IHR5cGUgUHJvcGVydHlPclBhdGg8UD4gPSBzdHJpbmcgfCBQIHwgUGF0aEFubm90YXRpb25FeHByZXNzaW9uPFA+O1xuZXhwb3J0IHR5cGUgTWV0YU1vZGVsQ29udGV4dCA9IHtcblx0JGtpbmQ6IHN0cmluZztcbn07XG5leHBvcnQgdHlwZSBDb21wdXRlZEFubm90YXRpb25JbnRlcmZhY2UgPSB7XG5cdGNvbnRleHQ6IENvbnRleHQ7XG5cdGFyZ3VtZW50czogYW55W107XG5cdCQkdmFsdWVBc1Byb21pc2U6IGJvb2xlYW47XG59O1xuXG5leHBvcnQgdHlwZSBjb25maWdUeXBlQ29uc3RyYWludHMgPSB7XG5cdHNjYWxlPzogbnVtYmVyO1xuXHRwcmVjaXNpb24/OiBudW1iZXI7XG5cdG1heExlbmd0aD86IG51bWJlcjtcblx0bnVsbGFibGU/OiBib29sZWFuO1xuXHRtaW5pbXVtPzogc3RyaW5nO1xuXHRtYXhpbXVtPzogc3RyaW5nO1xuXHRpc0RpZ2l0U2VxdWVuY2U/OiBib29sZWFuO1xufTtcblxuZXhwb3J0IHR5cGUgY29uZmlnVHlwZWZvcm1hdE9wdGlvbnMgPSB7XG5cdHBhcnNlQXNTdHJpbmc/OiBib29sZWFuO1xuXHRlbXB0eVN0cmluZz86IHN0cmluZztcblx0cGFyc2VLZWVwc0VtcHR5U3RyaW5nPzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCB0eXBlIGNvbmZpZ1R5cGUgPSB7XG5cdHR5cGU6IHN0cmluZztcblx0Y29uc3RyYWludHM6IGNvbmZpZ1R5cGVDb25zdHJhaW50cztcblx0Zm9ybWF0T3B0aW9uczogY29uZmlnVHlwZWZvcm1hdE9wdGlvbnM7XG59O1xuXG5leHBvcnQgY29uc3QgRURNX1RZUEVfTUFQUElORzogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcblx0XCJFZG0uQm9vbGVhblwiOiB7IHR5cGU6IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuQm9vbGVhblwiIH0sXG5cdFwiRWRtLkJ5dGVcIjogeyB0eXBlOiBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkJ5dGVcIiB9LFxuXHRcIkVkbS5EYXRlXCI6IHsgdHlwZTogXCJzYXAudWkubW9kZWwub2RhdGEudHlwZS5EYXRlXCIgfSxcblx0XCJFZG0uRGF0ZVRpbWVPZmZzZXRcIjoge1xuXHRcdGNvbnN0cmFpbnRzOiB7XG5cdFx0XHRcIiRQcmVjaXNpb25cIjogXCJwcmVjaXNpb25cIlxuXHRcdH0sXG5cdFx0dHlwZTogXCJzYXAudWkubW9kZWwub2RhdGEudHlwZS5EYXRlVGltZU9mZnNldFwiXG5cdH0sXG5cdFwiRWRtLkRlY2ltYWxcIjoge1xuXHRcdGNvbnN0cmFpbnRzOiB7XG5cdFx0XHRcIkBPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5NaW5pbXVtLyREZWNpbWFsXCI6IFwibWluaW11bVwiLFxuXHRcdFx0XCJAT3JnLk9EYXRhLlZhbGlkYXRpb24uVjEuTWluaW11bUBPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5FeGNsdXNpdmVcIjogXCJtaW5pbXVtRXhjbHVzaXZlXCIsXG5cdFx0XHRcIkBPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5NYXhpbXVtLyREZWNpbWFsXCI6IFwibWF4aW11bVwiLFxuXHRcdFx0XCJAT3JnLk9EYXRhLlZhbGlkYXRpb24uVjEuTWF4aW11bUBPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5FeGNsdXNpdmVcIjogXCJtYXhpbXVtRXhjbHVzaXZlXCIsXG5cdFx0XHRcIiRQcmVjaXNpb25cIjogXCJwcmVjaXNpb25cIixcblx0XHRcdFwiJFNjYWxlXCI6IFwic2NhbGVcIlxuXHRcdH0sXG5cdFx0dHlwZTogXCJzYXAudWkubW9kZWwub2RhdGEudHlwZS5EZWNpbWFsXCJcblx0fSxcblx0XCJFZG0uRG91YmxlXCI6IHsgdHlwZTogXCJzYXAudWkubW9kZWwub2RhdGEudHlwZS5Eb3VibGVcIiB9LFxuXHRcIkVkbS5HdWlkXCI6IHsgdHlwZTogXCJzYXAudWkubW9kZWwub2RhdGEudHlwZS5HdWlkXCIgfSxcblx0XCJFZG0uSW50MTZcIjogeyB0eXBlOiBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkludDE2XCIgfSxcblx0XCJFZG0uSW50MzJcIjogeyB0eXBlOiBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkludDMyXCIgfSxcblx0XCJFZG0uSW50NjRcIjogeyB0eXBlOiBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkludDY0XCIgfSxcblx0XCJFZG0uU0J5dGVcIjogeyB0eXBlOiBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLlNCeXRlXCIgfSxcblx0XCJFZG0uU2luZ2xlXCI6IHsgdHlwZTogXCJzYXAudWkubW9kZWwub2RhdGEudHlwZS5TaW5nbGVcIiB9LFxuXHRcIkVkbS5TdHJlYW1cIjogeyB0eXBlOiBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLlN0cmVhbVwiIH0sXG5cdFwiRWRtLlN0cmluZ1wiOiB7XG5cdFx0Y29uc3RyYWludHM6IHtcblx0XHRcdFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0RpZ2l0U2VxdWVuY2VcIjogXCJpc0RpZ2l0U2VxdWVuY2VcIixcblx0XHRcdFwiJE1heExlbmd0aFwiOiBcIm1heExlbmd0aFwiLFxuXHRcdFx0XCIkTnVsbGFibGVcIjogXCJudWxsYWJsZVwiXG5cdFx0fSxcblx0XHR0eXBlOiBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLlN0cmluZ1wiXG5cdH0sXG5cdFwiRWRtLlRpbWVPZkRheVwiOiB7XG5cdFx0Y29uc3RyYWludHM6IHtcblx0XHRcdFwiJFByZWNpc2lvblwiOiBcInByZWNpc2lvblwiXG5cdFx0fSxcblx0XHR0eXBlOiBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLlRpbWVPZkRheVwiXG5cdH1cbn07XG5cbi8qKlxuICogQ3JlYXRlIHRoZSBleHByZXNzaW9uIHRvIGdlbmVyYXRlIGFuIFwiZWRpdGFibGVcIiBib29sZWFuIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7UHJvcGVydHlQYXRofSBvUHJvcGVydHlQYXRoIFRoZSBpbnB1dCBwcm9wZXJ0eVxuICogQHBhcmFtIHtvYmplY3R9IG9EYXRhRmllbGRDb252ZXJ0ZWQgVGhlIERhdGFGaWVsZENvbnZlcnRlZCBvYmplY3QgdG8gcmVhZCB0aGUgZmllbGRDb250cm9sIGFubm90YXRpb25cbiAqIEBwYXJhbSB7RGF0YU1vZGVsT2JqZWN0UGF0aH0gb0RhdGFNb2RlbE9iamVjdFBhdGggVGhlIHBhdGggdG8gdGhpcyBwcm9wZXJ0eSBvYmplY3RcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYkFzT2JqZWN0IFdoZXRoZXIgb3Igbm90IHRoaXMgc2hvdWxkIGJlIHJldHVybmVkIGFzIGFuIG9iamVjdCBvciBhIGJpbmRpbmcgc3RyaW5nXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgYmluZGluZyBleHByZXNzaW9uIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIGEgcHJvcGVydHkgaXMgZWRpdGFibGUgb3Igbm90XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRFZGl0YWJsZUV4cHJlc3Npb24gPSBmdW5jdGlvbihcblx0b1Byb3BlcnR5UGF0aDogUHJvcGVydHlPclBhdGg8UHJvcGVydHk+LFxuXHRvRGF0YUZpZWxkQ29udmVydGVkOiBhbnkgPSBudWxsLFxuXHRvRGF0YU1vZGVsT2JqZWN0UGF0aD86IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdGJBc09iamVjdDogYm9vbGVhbiA9IGZhbHNlXG4pOiBCaW5kaW5nRXhwcmVzc2lvbjxib29sZWFuPiB8IEV4cHJlc3Npb25PclByaW1pdGl2ZTxib29sZWFuPiB7XG5cdGlmICghb1Byb3BlcnR5UGF0aCB8fCB0eXBlb2Ygb1Byb3BlcnR5UGF0aCA9PT0gXCJzdHJpbmdcIikge1xuXHRcdHJldHVybiBjb21waWxlQmluZGluZyhmYWxzZSk7XG5cdH1cblx0bGV0IGRhdGFGaWVsZEVkaXRhYmxlRXhwcmVzc2lvbjogQmluZGluZ0V4cHJlc3Npb248Ym9vbGVhbj4gfCBFeHByZXNzaW9uT3JQcmltaXRpdmU8Ym9vbGVhbj4gPSB0cnVlO1xuXHRpZiAob0RhdGFGaWVsZENvbnZlcnRlZCAhPT0gbnVsbCkge1xuXHRcdGRhdGFGaWVsZEVkaXRhYmxlRXhwcmVzc2lvbiA9IGlmRWxzZShpc05vbkVkaXRhYmxlRXhwcmVzc2lvbihvRGF0YUZpZWxkQ29udmVydGVkKSwgZmFsc2UsIFVJLklzRWRpdGFibGUpO1xuXHR9XG5cblx0Y29uc3Qgb1Byb3BlcnR5OiBQcm9wZXJ0eSA9IChpc1BhdGhFeHByZXNzaW9uKG9Qcm9wZXJ0eVBhdGgpICYmIG9Qcm9wZXJ0eVBhdGguJHRhcmdldCkgfHwgKG9Qcm9wZXJ0eVBhdGggYXMgUHJvcGVydHkpO1xuXHQvLyBFZGl0YWJpbGl0eSBkZXBlbmRzIG9uIHRoZSBmaWVsZCBjb250cm9sIGV4cHJlc3Npb25cblx0Ly8gSWYgdGhlIEZpZWxkIGNvbnRyb2wgaXMgc3RhdGljYWxseSBpbiBSZWFkT25seSBvciBJbmFwcGxpY2FibGUgKGRpc2FibGVkKSAtPiBub3QgZWRpdGFibGVcblx0Ly8gSWYgdGhlIHByb3BlcnR5IGlzIGEga2V5IC0+IG5vdCBlZGl0YWJsZSBleGNlcHQgaW4gY3JlYXRpb24gaWYgbm90IGNvbXB1dGVkXG5cdC8vIElmIHRoZSBwcm9wZXJ0eSBpcyBjb21wdXRlZCAtPiBub3QgZWRpdGFibGVcblx0Ly8gSWYgdGhlIHByb3BlcnR5IGlzIG5vdCB1cGRhdGFibGUgLT4gbm90IGVkaXRhYmxlXG5cdC8vIElmIHRoZSBwcm9wZXJ0eSBpcyBpbW11dGFibGUgLT4gbm90IGVkaXRhYmxlIGV4Y2VwdCBpbiBjcmVhdGlvblxuXHQvLyBJZiB0aGUgRmllbGQgY29udHJvbCBpcyBhIHBhdGggcmVzb2x2aW5nIHRvIFJlYWRPbmx5IG9yIEluYXBwbGljYWJsZSAoZGlzYWJsZWQpICg8PSAxKSAtPiBub3QgZWRpdGFibGVcblx0Ly8gRWxzZSwgdG8gYmUgZWRpdGFibGUgeW91IG5lZWRcblx0Ly8gaW1tdXRhYmxlIGFuZCBrZXkgd2hpbGUgaW4gdGhlIGNyZWF0aW9uIHJvd1xuXHQvLyB1aS9pc0VkaXRhYmxlXG5cdGNvbnN0IGlzUGF0aFVwZGF0YWJsZUV4cHJlc3Npb24gPSBpc1BhdGhVcGRhdGFibGUob0RhdGFNb2RlbE9iamVjdFBhdGgsIG9Qcm9wZXJ0eVBhdGgpO1xuXHRjb25zdCBlZGl0YWJsZUV4cHJlc3Npb24gPSBpZkVsc2UoXG5cdFx0b3IoXG5cdFx0XHRub3QoaXNQYXRoVXBkYXRhYmxlRXhwcmVzc2lvbiksXG5cdFx0XHRpc0NvbXB1dGVkKG9Qcm9wZXJ0eSksXG5cdFx0XHRpc0tleShvUHJvcGVydHkpLFxuXHRcdFx0aXNJbW11dGFibGUob1Byb3BlcnR5KSxcblx0XHRcdGlzTm9uRWRpdGFibGVFeHByZXNzaW9uKG9Qcm9wZXJ0eSlcblx0XHQpLFxuXHRcdGlmRWxzZShvcihpc0NvbXB1dGVkKG9Qcm9wZXJ0eSksIGlzTm9uRWRpdGFibGVFeHByZXNzaW9uKG9Qcm9wZXJ0eSkpLCBmYWxzZSwgVUkuSXNUcmFuc2llbnRCaW5kaW5nKSxcblx0XHRVSS5Jc0VkaXRhYmxlXG5cdCk7XG5cdGlmIChiQXNPYmplY3QpIHtcblx0XHRyZXR1cm4gYW5kKGVkaXRhYmxlRXhwcmVzc2lvbiwgZGF0YUZpZWxkRWRpdGFibGVFeHByZXNzaW9uKTtcblx0fVxuXHRyZXR1cm4gY29tcGlsZUJpbmRpbmcoYW5kKGVkaXRhYmxlRXhwcmVzc2lvbiwgZGF0YUZpZWxkRWRpdGFibGVFeHByZXNzaW9uKSk7XG59O1xuXG4vKipcbiAqIENyZWF0ZSB0aGUgZXhwcmVzc2lvbiB0byBnZW5lcmF0ZSBhbiBcImVuYWJsZWRcIiBib29sZWFuIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7UHJvcGVydHlQYXRofSBvUHJvcGVydHlQYXRoIFRoZSBpbnB1dCBwcm9wZXJ0eVxuICogQHBhcmFtIHthbnl9IG9EYXRhRmllbGRDb252ZXJ0ZWQgVGhlIERhdGFGaWVsZENvbnZlcnRlZCBPYmplY3QgdG8gcmVhZCB0aGUgZmllbGRDb250cm9sIGFubm90YXRpb25cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYkFzT2JqZWN0IFdoZXRoZXIgb3Igbm90IHRoaXMgc2hvdWxkIGJlIHJldHVybmVkIGFzIGFuIG9iamVjdCBvciBhIGJpbmRpbmcgc3RyaW5nXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgYmluZGluZyBleHByZXNzaW9uIHRvIGRldGVybWluZSBpZiBhIHByb3BlcnR5IGlzIGVuYWJsZWQgb3Igbm90XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRFbmFibGVkRXhwcmVzc2lvbiA9IGZ1bmN0aW9uKFxuXHRvUHJvcGVydHlQYXRoOiBQcm9wZXJ0eU9yUGF0aDxQcm9wZXJ0eT4sXG5cdG9EYXRhRmllbGRDb252ZXJ0ZWQ/OiBhbnksXG5cdGJBc09iamVjdDogYm9vbGVhbiA9IGZhbHNlXG4pOiBCaW5kaW5nRXhwcmVzc2lvbjxib29sZWFuPiB8IEV4cHJlc3Npb25PclByaW1pdGl2ZTxib29sZWFuPiB7XG5cdGlmICghb1Byb3BlcnR5UGF0aCB8fCB0eXBlb2Ygb1Byb3BlcnR5UGF0aCA9PT0gXCJzdHJpbmdcIikge1xuXHRcdHJldHVybiBjb21waWxlQmluZGluZyh0cnVlKTtcblx0fVxuXHRsZXQgZGF0YUZpZWxkRW5hYmxlZEV4cHJlc3Npb246IEJpbmRpbmdFeHByZXNzaW9uPGJvb2xlYW4+IHwgRXhwcmVzc2lvbk9yUHJpbWl0aXZlPGJvb2xlYW4+ID0gdHJ1ZTtcblx0aWYgKG9EYXRhRmllbGRDb252ZXJ0ZWQgIT09IG51bGwpIHtcblx0XHRkYXRhRmllbGRFbmFibGVkRXhwcmVzc2lvbiA9IGlmRWxzZShpc0Rpc2FibGVkRXhwcmVzc2lvbihvRGF0YUZpZWxkQ29udmVydGVkKSwgZmFsc2UsIHRydWUpO1xuXHR9XG5cblx0Y29uc3Qgb1Byb3BlcnR5OiBQcm9wZXJ0eSA9IChpc1BhdGhFeHByZXNzaW9uKG9Qcm9wZXJ0eVBhdGgpICYmIG9Qcm9wZXJ0eVBhdGguJHRhcmdldCkgfHwgKG9Qcm9wZXJ0eVBhdGggYXMgUHJvcGVydHkpO1xuXHQvLyBFbmFibGVtZW50IGRlcGVuZHMgb24gdGhlIGZpZWxkIGNvbnRyb2wgZXhwcmVzc2lvblxuXHQvLyBJZiB0aGUgRmllbGQgY29udHJvbCBpcyBzdGF0aWNhbGx5IGluIEluYXBwbGljYWJsZSAoZGlzYWJsZWQpIC0+IG5vdCBlbmFibGVkXG5cdGNvbnN0IGVuYWJsZWRFeHByZXNzaW9uID0gaWZFbHNlKGlzRGlzYWJsZWRFeHByZXNzaW9uKG9Qcm9wZXJ0eSksIGZhbHNlLCB0cnVlKTtcblx0aWYgKGJBc09iamVjdCkge1xuXHRcdHJldHVybiBhbmQoZW5hYmxlZEV4cHJlc3Npb24sIGRhdGFGaWVsZEVuYWJsZWRFeHByZXNzaW9uKTtcblx0fVxuXHRyZXR1cm4gY29tcGlsZUJpbmRpbmcoYW5kKGVuYWJsZWRFeHByZXNzaW9uLCBkYXRhRmllbGRFbmFibGVkRXhwcmVzc2lvbikpO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgdGhlIGV4cHJlc3Npb24gdG8gZ2VuZXJhdGUgYW4gXCJlZGl0TW9kZVwiIGVudW0gdmFsdWUuXG4gKiBAcGFyYW0ge1Byb3BlcnR5UGF0aH0gb1Byb3BlcnR5UGF0aCBUaGUgaW5wdXQgcHJvcGVydHlcbiAqIEBwYXJhbSB7RGF0YU1vZGVsT2JqZWN0UGF0aH0gb0RhdGFNb2RlbE9iamVjdFBhdGggVGhlIGxpc3Qgb2YgZGF0YSBtb2RlbCBvYmplY3RzIHRoYXQgYXJlIGludm9sdmVkIHRvIHJlYWNoIHRoYXQgcHJvcGVydHlcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYk1lYXN1cmVSZWFkT25seSBXaGV0aGVyIHdlIHNob3VsZCBzZXQgVW9NIC8gY3VycmVuY3kgZmllbGQgbW9kZSB0byByZWFkIG9ubHlcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYkFzT2JqZWN0IFdoZXRoZXIgd2Ugc2hvdWxkIHJldHVybiB0aGlzIGFzIGFuIGV4cHJlc3Npb24gb3IgYXMgYSBzdHJpbmdcbiAqIEBwYXJhbSB7b2JqZWN0fSBvRGF0YUZpZWxkQ29udmVydGVkIFRoZSBkYXRhRmllbGQgb2JqZWN0XG4gKiBAcmV0dXJucyB7QmluZGluZ0V4cHJlc3Npb248c3RyaW5nPiB8IEV4cHJlc3Npb25PclByaW1pdGl2ZTxzdHJpbmc+fSBUaGUgYmluZGluZyBleHByZXNzaW9uIHJlcHJlc2VudGluZyB0aGUgY3VycmVudCBwcm9wZXJ0eSBlZGl0IG1vZGUsIGNvbXBsaWFudCB3aXRoIHRoZSBNREMgRmllbGQgZGVmaW5pdGlvbiBvZiBlZGl0TW9kZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGdldEVkaXRNb2RlID0gZnVuY3Rpb24oXG5cdG9Qcm9wZXJ0eVBhdGg6IFByb3BlcnR5T3JQYXRoPFByb3BlcnR5Pixcblx0b0RhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdGJNZWFzdXJlUmVhZE9ubHk6IGJvb2xlYW4gPSBmYWxzZSxcblx0YkFzT2JqZWN0OiBib29sZWFuID0gZmFsc2UsXG5cdG9EYXRhRmllbGRDb252ZXJ0ZWQ6IGFueSA9IG51bGxcbik6IEJpbmRpbmdFeHByZXNzaW9uPHN0cmluZz4gfCBFeHByZXNzaW9uT3JQcmltaXRpdmU8c3RyaW5nPiB7XG5cdGlmICghb1Byb3BlcnR5UGF0aCB8fCB0eXBlb2Ygb1Byb3BlcnR5UGF0aCA9PT0gXCJzdHJpbmdcIikge1xuXHRcdHJldHVybiBcIkRpc3BsYXlcIjtcblx0fVxuXHRjb25zdCBvUHJvcGVydHk6IFByb3BlcnR5ID0gKGlzUGF0aEV4cHJlc3Npb24ob1Byb3BlcnR5UGF0aCkgJiYgb1Byb3BlcnR5UGF0aC4kdGFyZ2V0KSB8fCAob1Byb3BlcnR5UGF0aCBhcyBQcm9wZXJ0eSk7XG5cdC8vIGlmIHRoZSBwcm9wZXJ0eSBpcyBub3QgZW5hYmxlZCA9PiBEaXNhYmxlZFxuXHQvLyBpZiB0aGUgcHJvcGVydHkgaXMgZW5hYmxlZCAmJiBub3QgZWRpdGFibGUgPT4gUmVhZE9ubHlcblx0Ly8gaWYgdGhlIHByb3BlcnR5IGlzIGVuYWJsZWQgJiYgZWRpdGFibGUgPT4gRWRpdGFibGVcblx0Ly8gSWYgdGhlcmUgaXMgYW4gYXNzb2NpYXRlZCB1bml0LCBhbmQgaXQgaGFzIGEgZmllbGQgY29udHJvbCBhbHNvIHVzZSBjb25zaWRlciB0aGUgZm9sbG93aW5nXG5cdC8vIGlmIHRoZSB1bml0IGZpZWxkIGNvbnRyb2wgaXMgcmVhZG9ubHkgLT4gRWRpdGFibGVSZWFkT25seVxuXHQvLyBvdGhlcndpc2UgLT4gRWRpdGFibGVcblx0Y29uc3QgZWRpdGFibGVFeHByZXNzaW9uID0gZ2V0RWRpdGFibGVFeHByZXNzaW9uKFxuXHRcdG9Qcm9wZXJ0eVBhdGgsXG5cdFx0b0RhdGFGaWVsZENvbnZlcnRlZCxcblx0XHRvRGF0YU1vZGVsT2JqZWN0UGF0aCxcblx0XHR0cnVlXG5cdCkgYXMgRXhwcmVzc2lvbk9yUHJpbWl0aXZlPGJvb2xlYW4+O1xuXG5cdGNvbnN0IGVuYWJsZWRFeHByZXNzaW9uID0gZ2V0RW5hYmxlZEV4cHJlc3Npb24ob1Byb3BlcnR5UGF0aCwgb0RhdGFGaWVsZENvbnZlcnRlZCwgdHJ1ZSkgYXMgRXhwcmVzc2lvbk9yUHJpbWl0aXZlPGJvb2xlYW4+O1xuXHRjb25zdCBhc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eSA9IGdldEFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5KG9Qcm9wZXJ0eSk7XG5cdGNvbnN0IHVuaXRQcm9wZXJ0eSA9IGFzc29jaWF0ZWRDdXJyZW5jeVByb3BlcnR5IHx8IGdldEFzc29jaWF0ZWRVbml0UHJvcGVydHkob1Byb3BlcnR5KTtcblx0bGV0IHJlc3VsdEV4cHJlc3Npb246IEV4cHJlc3Npb25PclByaW1pdGl2ZTxzdHJpbmc+ID0gXCJFZGl0YWJsZVwiO1xuXHRpZiAodW5pdFByb3BlcnR5KSB7XG5cdFx0cmVzdWx0RXhwcmVzc2lvbiA9IGlmRWxzZShcblx0XHRcdG9yKGlzUmVhZE9ubHlFeHByZXNzaW9uKHVuaXRQcm9wZXJ0eSksIGlzQ29tcHV0ZWQodW5pdFByb3BlcnR5KSwgYk1lYXN1cmVSZWFkT25seSksXG5cdFx0XHRcIkVkaXRhYmxlUmVhZE9ubHlcIixcblx0XHRcdFwiRWRpdGFibGVcIlxuXHRcdCk7XG5cdH1cblx0Y29uc3QgcmVhZE9ubHlFeHByZXNzaW9uID0gb3IoaXNSZWFkT25seUV4cHJlc3Npb24ob1Byb3BlcnR5KSwgaXNSZWFkT25seUV4cHJlc3Npb24ob0RhdGFGaWVsZENvbnZlcnRlZCkpO1xuXG5cdC8vIGlmIHRoZSBwcm9wZXJ0eSBpcyBmcm9tIGEgbm9uLXVwZGF0YWJsZSBlbnRpdHkgPT4gUmVhZCBvbmx5IG1vZGUsIHByZXZpb3VzbHkgY2FsY3VsYXRlZCBlZGl0IE1vZGUgaXMgaWdub3JlZFxuXHQvLyBpZiB0aGUgcHJvcGVydHkgaXMgZnJvbSBhbiB1cGRhdGFibGUgZW50aXR5ID0+IHByZXZpb3VzbHkgY2FsY3VsYXRlZCBlZGl0IE1vZGUgZXhwcmVzc2lvblxuXHRjb25zdCBlZGl0TW9kZUV4cHJlc3Npb24gPSBpZkVsc2UoXG5cdFx0ZW5hYmxlZEV4cHJlc3Npb24sXG5cdFx0aWZFbHNlKFxuXHRcdFx0ZWRpdGFibGVFeHByZXNzaW9uLFxuXHRcdFx0cmVzdWx0RXhwcmVzc2lvbixcblx0XHRcdGlmRWxzZShhbmQoIWlzQ29uc3RhbnQocmVhZE9ubHlFeHByZXNzaW9uKSAmJiByZWFkT25seUV4cHJlc3Npb24sIFVJLklzRWRpdGFibGUpLCBcIlJlYWRPbmx5XCIsIFwiRGlzcGxheVwiKVxuXHRcdCksXG5cdFx0aWZFbHNlKFVJLklzRWRpdGFibGUsIFwiRGlzYWJsZWRcIiwgXCJEaXNwbGF5XCIpXG5cdCk7XG5cdGlmIChiQXNPYmplY3QpIHtcblx0XHRyZXR1cm4gZWRpdE1vZGVFeHByZXNzaW9uO1xuXHR9XG5cdHJldHVybiBjb21waWxlQmluZGluZyhlZGl0TW9kZUV4cHJlc3Npb24pO1xufTtcblxuZXhwb3J0IGNvbnN0IGhhc1ZhbGlkQW5hbHl0aWNhbEN1cnJlbmN5T3JVbml0ID0gZnVuY3Rpb24ob1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCk6IEJpbmRpbmdFeHByZXNzaW9uPHN0cmluZz4ge1xuXHRjb25zdCBvUHJvcGVydHlEZWZpbml0aW9uID0gb1Byb3BlcnR5RGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QgYXMgUHJvcGVydHk7XG5cdGNvbnN0IGN1cnJlbmN5ID0gb1Byb3BlcnR5RGVmaW5pdGlvbi5hbm5vdGF0aW9ucz8uTWVhc3VyZXM/LklTT0N1cnJlbmN5O1xuXHRjb25zdCBtZWFzdXJlID0gY3VycmVuY3kgPyBjdXJyZW5jeSA6IG9Qcm9wZXJ0eURlZmluaXRpb24uYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5Vbml0O1xuXHRpZiAobWVhc3VyZSkge1xuXHRcdHJldHVybiBjb21waWxlQmluZGluZyhvcihpc1RydXRoeShhbm5vdGF0aW9uRXhwcmVzc2lvbihtZWFzdXJlKSBhcyBFeHByZXNzaW9uPHN0cmluZz4pLCBub3QoVUkuSXNUb3RhbCkpKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gY29tcGlsZUJpbmRpbmcoY29uc3RhbnQodHJ1ZSkpO1xuXHR9XG59O1xuXG5leHBvcnQgY29uc3QgaWZVbml0RWRpdGFibGUgPSBmdW5jdGlvbihcblx0b1Byb3BlcnR5UGF0aDogUHJvcGVydHlPclBhdGg8UHJvcGVydHk+LFxuXHRzRWRpdGFibGVWYWx1ZTogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPHN0cmluZz4sXG5cdHNOb25FZGl0YWJsZVZhbHVlOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8c3RyaW5nPlxuKTogQmluZGluZ0V4cHJlc3Npb248c3RyaW5nPiB7XG5cdGNvbnN0IG9Qcm9wZXJ0eSA9IChpc1BhdGhFeHByZXNzaW9uKG9Qcm9wZXJ0eVBhdGgpICYmIG9Qcm9wZXJ0eVBhdGguJHRhcmdldCkgfHwgKG9Qcm9wZXJ0eVBhdGggYXMgUHJvcGVydHkpO1xuXHRjb25zdCB1bml0UHJvcGVydHkgPSBnZXRBc3NvY2lhdGVkQ3VycmVuY3lQcm9wZXJ0eShvUHJvcGVydHkpIHx8IGdldEFzc29jaWF0ZWRVbml0UHJvcGVydHkob1Byb3BlcnR5KTtcblx0aWYgKCF1bml0UHJvcGVydHkpIHtcblx0XHRyZXR1cm4gY29tcGlsZUJpbmRpbmcoc05vbkVkaXRhYmxlVmFsdWUpO1xuXHR9XG5cdGNvbnN0IGVkaXRhYmxlRXhwcmVzc2lvbiA9IGFuZChub3QoaXNSZWFkT25seUV4cHJlc3Npb24odW5pdFByb3BlcnR5KSksIG5vdChpc0NvbXB1dGVkKHVuaXRQcm9wZXJ0eSkpKTtcblx0cmV0dXJuIGNvbXBpbGVCaW5kaW5nKGlmRWxzZShlZGl0YWJsZUV4cHJlc3Npb24sIHNFZGl0YWJsZVZhbHVlLCBzTm9uRWRpdGFibGVWYWx1ZSkpO1xufTtcblxuZXhwb3J0IHR5cGUgRGlzcGxheU1vZGUgPSBcIlZhbHVlXCIgfCBcIkRlc2NyaXB0aW9uXCIgfCBcIkRlc2NyaXB0aW9uVmFsdWVcIiB8IFwiVmFsdWVEZXNjcmlwdGlvblwiO1xuZXhwb3J0IGNvbnN0IGdldERpc3BsYXlNb2RlID0gZnVuY3Rpb24ob1Byb3BlcnR5UGF0aDogUHJvcGVydHlPclBhdGg8UHJvcGVydHk+LCBvRGF0YU1vZGVsT2JqZWN0UGF0aD86IERhdGFNb2RlbE9iamVjdFBhdGgpOiBEaXNwbGF5TW9kZSB7XG5cdGlmICghb1Byb3BlcnR5UGF0aCB8fCB0eXBlb2Ygb1Byb3BlcnR5UGF0aCA9PT0gXCJzdHJpbmdcIikge1xuXHRcdHJldHVybiBcIlZhbHVlXCI7XG5cdH1cblx0Y29uc3Qgb1Byb3BlcnR5ID0gKGlzUGF0aEV4cHJlc3Npb24ob1Byb3BlcnR5UGF0aCkgJiYgb1Byb3BlcnR5UGF0aC4kdGFyZ2V0KSB8fCAob1Byb3BlcnR5UGF0aCBhcyBQcm9wZXJ0eSk7XG5cdGNvbnN0IG9FbnRpdHlUeXBlID0gb0RhdGFNb2RlbE9iamVjdFBhdGggJiYgb0RhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0RW50aXR5VHlwZTtcblx0Y29uc3Qgb1RleHRBbm5vdGF0aW9uID0gb1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LlRleHQ7XG5cdGNvbnN0IG9UZXh0QXJyYW5nZW1lbnRBbm5vdGF0aW9uID1cblx0XHQodHlwZW9mIG9UZXh0QW5ub3RhdGlvbiAhPT0gXCJzdHJpbmdcIiAmJiBvVGV4dEFubm90YXRpb24/LmFubm90YXRpb25zPy5VST8uVGV4dEFycmFuZ2VtZW50Py50b1N0cmluZygpKSB8fFxuXHRcdG9FbnRpdHlUeXBlPy5hbm5vdGF0aW9ucz8uVUk/LlRleHRBcnJhbmdlbWVudD8udG9TdHJpbmcoKTtcblxuXHRsZXQgc0Rpc3BsYXlWYWx1ZSA9IG9UZXh0QW5ub3RhdGlvbiA/IFwiRGVzY3JpcHRpb25WYWx1ZVwiIDogXCJWYWx1ZVwiO1xuXHRpZiAoKG9UZXh0QW5ub3RhdGlvbiAmJiBvVGV4dEFycmFuZ2VtZW50QW5ub3RhdGlvbikgfHwgb0VudGl0eVR5cGU/LmFubm90YXRpb25zPy5VST8uVGV4dEFycmFuZ2VtZW50Py50b1N0cmluZygpKSB7XG5cdFx0aWYgKG9UZXh0QXJyYW5nZW1lbnRBbm5vdGF0aW9uID09PSBcIlVJLlRleHRBcnJhbmdlbWVudFR5cGUvVGV4dE9ubHlcIikge1xuXHRcdFx0c0Rpc3BsYXlWYWx1ZSA9IFwiRGVzY3JpcHRpb25cIjtcblx0XHR9IGVsc2UgaWYgKG9UZXh0QXJyYW5nZW1lbnRBbm5vdGF0aW9uID09PSBcIlVJLlRleHRBcnJhbmdlbWVudFR5cGUvVGV4dExhc3RcIikge1xuXHRcdFx0c0Rpc3BsYXlWYWx1ZSA9IFwiVmFsdWVEZXNjcmlwdGlvblwiO1xuXHRcdH0gZWxzZSBpZiAob1RleHRBcnJhbmdlbWVudEFubm90YXRpb24gPT09IFwiVUkuVGV4dEFycmFuZ2VtZW50VHlwZS9UZXh0U2VwYXJhdGVcIikge1xuXHRcdFx0c0Rpc3BsYXlWYWx1ZSA9IFwiVmFsdWVcIjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly9EZWZhdWx0IHNob3VsZCBiZSBUZXh0Rmlyc3QgaWYgdGhlcmUgaXMgYSBUZXh0IGFubm90YXRpb24gYW5kIG5laXRoZXIgVGV4dE9ubHkgbm9yIFRleHRMYXN0IGFyZSBzZXRcblx0XHRcdHNEaXNwbGF5VmFsdWUgPSBcIkRlc2NyaXB0aW9uVmFsdWVcIjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHNEaXNwbGF5VmFsdWUgYXMgRGlzcGxheU1vZGU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0RmllbGREaXNwbGF5ID0gZnVuY3Rpb24oXG5cdG9Qcm9wZXJ0eVBhdGg6IFByb3BlcnR5T3JQYXRoPFByb3BlcnR5Pixcblx0c1RhcmdldERpc3BsYXlNb2RlOiBzdHJpbmcsXG5cdG9Db21wdXRlZEVkaXRNb2RlOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8c3RyaW5nPlxuKTogQmluZGluZ0V4cHJlc3Npb248c3RyaW5nPiB7XG5cdGNvbnN0IG9Qcm9wZXJ0eSA9IChpc1BhdGhFeHByZXNzaW9uKG9Qcm9wZXJ0eVBhdGgpICYmIG9Qcm9wZXJ0eVBhdGguJHRhcmdldCkgfHwgKG9Qcm9wZXJ0eVBhdGggYXMgUHJvcGVydHkpO1xuXG5cdHJldHVybiBoYXNWYWx1ZUhlbHAob1Byb3BlcnR5KVxuXHRcdD8gY29tcGlsZUJpbmRpbmcoc1RhcmdldERpc3BsYXlNb2RlKVxuXHRcdDogY29tcGlsZUJpbmRpbmcoaWZFbHNlKGVxdWFsKG9Db21wdXRlZEVkaXRNb2RlLCBcIkVkaXRhYmxlXCIpLCBcIlZhbHVlXCIsIHNUYXJnZXREaXNwbGF5TW9kZSkpO1xufTtcblxuZXhwb3J0IGNvbnN0IGZvcm1hdFdpdGhUeXBlSW5mb3JtYXRpb24gPSBmdW5jdGlvbihvUHJvcGVydHk6IFByb3BlcnR5LCBwcm9wZXJ0eUJpbmRpbmdFeHByZXNzaW9uOiBFeHByZXNzaW9uPHN0cmluZz4pOiBFeHByZXNzaW9uPHN0cmluZz4ge1xuXHRjb25zdCBvdXRFeHByZXNzaW9uOiBCaW5kaW5nRXhwcmVzc2lvbkV4cHJlc3Npb248YW55PiA9IHByb3BlcnR5QmluZGluZ0V4cHJlc3Npb24gYXMgQmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uPGFueT47XG5cdGlmIChvUHJvcGVydHkuX3R5cGUgPT09IFwiUHJvcGVydHlcIikge1xuXHRcdGNvbnN0IG9UYXJnZXRNYXBwaW5nID0gRURNX1RZUEVfTUFQUElOR1sob1Byb3BlcnR5IGFzIFByb3BlcnR5KS50eXBlXTtcblx0XHRpZiAob1RhcmdldE1hcHBpbmcpIHtcblx0XHRcdG91dEV4cHJlc3Npb24udHlwZSA9IG9UYXJnZXRNYXBwaW5nLnR5cGU7XG5cdFx0XHRpZiAob1RhcmdldE1hcHBpbmcuY29uc3RyYWludHMpIHtcblx0XHRcdFx0b3V0RXhwcmVzc2lvbi5jb25zdHJhaW50cyA9IHt9O1xuXHRcdFx0XHRpZiAob1RhcmdldE1hcHBpbmcuY29uc3RyYWludHMuJFNjYWxlICYmIG9Qcm9wZXJ0eS5zY2FsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0b3V0RXhwcmVzc2lvbi5jb25zdHJhaW50cy5zY2FsZSA9IG9Qcm9wZXJ0eS5zY2FsZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAob1RhcmdldE1hcHBpbmcuY29uc3RyYWludHMuJFByZWNpc2lvbiAmJiBvUHJvcGVydHkucHJlY2lzaW9uICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRvdXRFeHByZXNzaW9uLmNvbnN0cmFpbnRzLnByZWNpc2lvbiA9IG9Qcm9wZXJ0eS5wcmVjaXNpb247XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG9UYXJnZXRNYXBwaW5nLmNvbnN0cmFpbnRzLiRNYXhMZW5ndGggJiYgb1Byb3BlcnR5Lm1heExlbmd0aCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0b3V0RXhwcmVzc2lvbi5jb25zdHJhaW50cy5tYXhMZW5ndGggPSBvUHJvcGVydHkubWF4TGVuZ3RoO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChvVGFyZ2V0TWFwcGluZy5jb25zdHJhaW50cy4kTnVsbGFibGUgJiYgb1Byb3BlcnR5Lm51bGxhYmxlID09PSBmYWxzZSkge1xuXHRcdFx0XHRcdG91dEV4cHJlc3Npb24uY29uc3RyYWludHMubnVsbGFibGUgPSBvUHJvcGVydHkubnVsbGFibGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdG9UYXJnZXRNYXBwaW5nLmNvbnN0cmFpbnRzW1wiQE9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLk1pbmltdW0vJERlY2ltYWxcIl0gJiZcblx0XHRcdFx0XHRvUHJvcGVydHkuYW5ub3RhdGlvbnM/LlZhbGlkYXRpb24/Lk1pbmltdW0gIT09IHVuZGVmaW5lZCAmJlxuXHRcdFx0XHRcdCFpc05hTihvUHJvcGVydHkuYW5ub3RhdGlvbnMuVmFsaWRhdGlvbi5NaW5pbXVtKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRvdXRFeHByZXNzaW9uLmNvbnN0cmFpbnRzLm1pbmltdW0gPSBgJHtvUHJvcGVydHkuYW5ub3RhdGlvbnMuVmFsaWRhdGlvbi5NaW5pbXVtfWA7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdG9UYXJnZXRNYXBwaW5nLmNvbnN0cmFpbnRzW1wiQE9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLk1heGltdW0vJERlY2ltYWxcIl0gJiZcblx0XHRcdFx0XHRvUHJvcGVydHkuYW5ub3RhdGlvbnM/LlZhbGlkYXRpb24/Lk1heGltdW0gIT09IHVuZGVmaW5lZCAmJlxuXHRcdFx0XHRcdCFpc05hTihvUHJvcGVydHkuYW5ub3RhdGlvbnMuVmFsaWRhdGlvbi5NYXhpbXVtKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRvdXRFeHByZXNzaW9uLmNvbnN0cmFpbnRzLm1heGltdW0gPSBgJHtvUHJvcGVydHkuYW5ub3RhdGlvbnMuVmFsaWRhdGlvbi5NYXhpbXVtfWA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChvdXRFeHByZXNzaW9uPy50eXBlPy5pbmRleE9mKFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuSW50XCIpID09PSAwKSB7XG5cdFx0XHRcdGlmICghb3V0RXhwcmVzc2lvbi5mb3JtYXRPcHRpb25zKSB7XG5cdFx0XHRcdFx0b3V0RXhwcmVzc2lvbi5mb3JtYXRPcHRpb25zID0ge307XG5cdFx0XHRcdH1cblx0XHRcdFx0b3V0RXhwcmVzc2lvbi5mb3JtYXRPcHRpb25zID0gT2JqZWN0LmFzc2lnbihvdXRFeHByZXNzaW9uLmZvcm1hdE9wdGlvbnMsIHtcblx0XHRcdFx0XHRwYXJzZUFzU3RyaW5nOiBmYWxzZSxcblx0XHRcdFx0XHRlbXB0eVN0cmluZzogXCJcIlxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdGlmIChvdXRFeHByZXNzaW9uLnR5cGUgPT09IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuU3RyaW5nXCIpIHtcblx0XHRcdFx0aWYgKCFvdXRFeHByZXNzaW9uLmZvcm1hdE9wdGlvbnMpIHtcblx0XHRcdFx0XHRvdXRFeHByZXNzaW9uLmZvcm1hdE9wdGlvbnMgPSB7fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRvdXRFeHByZXNzaW9uLmZvcm1hdE9wdGlvbnMucGFyc2VLZWVwc0VtcHR5U3RyaW5nID0gdHJ1ZTtcblxuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0b1RhcmdldE1hcHBpbmcuY29uc3RyYWludHM/LltcIkBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNEaWdpdFNlcXVlbmNlXCJdICYmXG5cdFx0XHRcdFx0b1Byb3BlcnR5LmFubm90YXRpb25zPy5Db21tb24/LklzRGlnaXRTZXF1ZW5jZVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRvdXRFeHByZXNzaW9uLmNvbnN0cmFpbnRzLmlzRGlnaXRTZXF1ZW5jZSA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChvdXRFeHByZXNzaW9uPy50eXBlPy5pbmRleE9mKFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuRG91YmxlXCIpID09PSAwKSB7XG5cdFx0XHRcdGlmICghb3V0RXhwcmVzc2lvbi5mb3JtYXRPcHRpb25zKSB7XG5cdFx0XHRcdFx0b3V0RXhwcmVzc2lvbi5mb3JtYXRPcHRpb25zID0ge307XG5cdFx0XHRcdH1cblx0XHRcdFx0b3V0RXhwcmVzc2lvbi5mb3JtYXRPcHRpb25zID0gT2JqZWN0LmFzc2lnbihvdXRFeHByZXNzaW9uLmZvcm1hdE9wdGlvbnMsIHtcblx0XHRcdFx0XHRwYXJzZUFzU3RyaW5nOiBmYWxzZSxcblx0XHRcdFx0XHRlbXB0eVN0cmluZzogXCJcIlxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIG91dEV4cHJlc3Npb247XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0VHlwZUNvbmZpZyA9IGZ1bmN0aW9uKG9Qcm9wZXJ0eTogUHJvcGVydHkgfCBEYXRhRmllbGRBYnN0cmFjdFR5cGVzLCBkYXRhVHlwZTogc3RyaW5nIHwgdW5kZWZpbmVkKTogYW55IHtcblx0Y29uc3Qgb1RhcmdldE1hcHBpbmcgPSBFRE1fVFlQRV9NQVBQSU5HWyhvUHJvcGVydHkgYXMgUHJvcGVydHkpPy50eXBlXSB8fCAoZGF0YVR5cGUgPyBFRE1fVFlQRV9NQVBQSU5HW2RhdGFUeXBlXSA6IHVuZGVmaW5lZCk7XG5cdGNvbnN0IHByb3BlcnR5VHlwZUNvbmZpZzogY29uZmlnVHlwZSA9IHtcblx0XHR0eXBlOiBvVGFyZ2V0TWFwcGluZy50eXBlLFxuXHRcdGNvbnN0cmFpbnRzOiB7fSxcblx0XHRmb3JtYXRPcHRpb25zOiB7fVxuXHR9O1xuXHRpZiAoaXNQcm9wZXJ0eShvUHJvcGVydHkpKSB7XG5cdFx0cHJvcGVydHlUeXBlQ29uZmlnLmNvbnN0cmFpbnRzID0ge1xuXHRcdFx0c2NhbGU6IG9UYXJnZXRNYXBwaW5nLmNvbnN0cmFpbnRzPy4kU2NhbGUgPyBvUHJvcGVydHkuc2NhbGUgOiB1bmRlZmluZWQsXG5cdFx0XHRwcmVjaXNpb246IG9UYXJnZXRNYXBwaW5nLmNvbnN0cmFpbnRzPy4kUHJlY2lzaW9uID8gb1Byb3BlcnR5LnByZWNpc2lvbiA6IHVuZGVmaW5lZCxcblx0XHRcdG1heExlbmd0aDogb1RhcmdldE1hcHBpbmcuY29uc3RyYWludHM/LiRNYXhMZW5ndGggPyBvUHJvcGVydHkubWF4TGVuZ3RoIDogdW5kZWZpbmVkLFxuXHRcdFx0bnVsbGFibGU6IG9UYXJnZXRNYXBwaW5nLmNvbnN0cmFpbnRzPy4kTnVsbGFibGUgPyBvUHJvcGVydHkubnVsbGFibGUgOiB1bmRlZmluZWQsXG5cdFx0XHRtaW5pbXVtOlxuXHRcdFx0XHRvVGFyZ2V0TWFwcGluZy5jb25zdHJhaW50cz8uW1wiQE9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLk1pbmltdW0vJERlY2ltYWxcIl0gJiZcblx0XHRcdFx0IWlzTmFOKG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uVmFsaWRhdGlvbj8uTWluaW11bSlcblx0XHRcdFx0XHQ/IGAke29Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uVmFsaWRhdGlvbj8uTWluaW11bX1gXG5cdFx0XHRcdFx0OiB1bmRlZmluZWQsXG5cdFx0XHRtYXhpbXVtOlxuXHRcdFx0XHRvVGFyZ2V0TWFwcGluZy5jb25zdHJhaW50cz8uW1wiQE9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLk1heGltdW0vJERlY2ltYWxcIl0gJiZcblx0XHRcdFx0IWlzTmFOKG9Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uVmFsaWRhdGlvbj8uTWF4aW11bSlcblx0XHRcdFx0XHQ/IGAke29Qcm9wZXJ0eS5hbm5vdGF0aW9ucz8uVmFsaWRhdGlvbj8uTWF4aW11bX1gXG5cdFx0XHRcdFx0OiB1bmRlZmluZWQsXG5cdFx0XHRpc0RpZ2l0U2VxdWVuY2U6XG5cdFx0XHRcdHByb3BlcnR5VHlwZUNvbmZpZy50eXBlID09PSBcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLlN0cmluZ1wiICYmXG5cdFx0XHRcdG9UYXJnZXRNYXBwaW5nLmNvbnN0cmFpbnRzPy5bXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzRGlnaXRTZXF1ZW5jZVwiXSAmJlxuXHRcdFx0XHQob1Byb3BlcnR5IGFzIFByb3BlcnR5KS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5Jc0RpZ2l0U2VxdWVuY2Vcblx0XHRcdFx0XHQ/IHRydWVcblx0XHRcdFx0XHQ6IHVuZGVmaW5lZFxuXHRcdH07XG5cdH1cblx0cHJvcGVydHlUeXBlQ29uZmlnLmZvcm1hdE9wdGlvbnMgPSB7XG5cdFx0cGFyc2VBc1N0cmluZzpcblx0XHRcdHByb3BlcnR5VHlwZUNvbmZpZz8udHlwZT8uaW5kZXhPZihcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkludFwiKSA9PT0gMCB8fFxuXHRcdFx0cHJvcGVydHlUeXBlQ29uZmlnPy50eXBlPy5pbmRleE9mKFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuRG91YmxlXCIpID09PSAwXG5cdFx0XHRcdD8gZmFsc2Vcblx0XHRcdFx0OiB1bmRlZmluZWQsXG5cdFx0ZW1wdHlTdHJpbmc6XG5cdFx0XHRwcm9wZXJ0eVR5cGVDb25maWc/LnR5cGU/LmluZGV4T2YoXCJzYXAudWkubW9kZWwub2RhdGEudHlwZS5JbnRcIikgPT09IDAgfHxcblx0XHRcdHByb3BlcnR5VHlwZUNvbmZpZz8udHlwZT8uaW5kZXhPZihcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkRvdWJsZVwiKSA9PT0gMFxuXHRcdFx0XHQ/IFwiXCJcblx0XHRcdFx0OiB1bmRlZmluZWQsXG5cdFx0cGFyc2VLZWVwc0VtcHR5U3RyaW5nOiBwcm9wZXJ0eVR5cGVDb25maWcudHlwZSA9PT0gXCJzYXAudWkubW9kZWwub2RhdGEudHlwZS5TdHJpbmdcIiA/IHRydWUgOiB1bmRlZmluZWRcblx0fTtcblx0cmV0dXJuIHByb3BlcnR5VHlwZUNvbmZpZztcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRCaW5kaW5nV2l0aFVuaXRPckN1cnJlbmN5ID0gZnVuY3Rpb24oXG5cdG9Qcm9wZXJ0eURhdGFNb2RlbFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdHByb3BlcnR5QmluZGluZ0V4cHJlc3Npb246IEV4cHJlc3Npb248c3RyaW5nPlxuKTogRXhwcmVzc2lvbjxzdHJpbmc+IHtcblx0Y29uc3Qgb1Byb3BlcnR5RGVmaW5pdGlvbiA9IG9Qcm9wZXJ0eURhdGFNb2RlbFBhdGgudGFyZ2V0T2JqZWN0IGFzIFByb3BlcnR5O1xuXHRsZXQgdW5pdCA9IG9Qcm9wZXJ0eURlZmluaXRpb24uYW5ub3RhdGlvbnM/Lk1lYXN1cmVzPy5Vbml0O1xuXHRjb25zdCByZWxhdGl2ZUxvY2F0aW9uID0gZ2V0UGF0aFJlbGF0aXZlTG9jYXRpb24oXG5cdFx0b1Byb3BlcnR5RGF0YU1vZGVsUGF0aC5jb250ZXh0TG9jYXRpb24sXG5cdFx0b1Byb3BlcnR5RGF0YU1vZGVsUGF0aC5uYXZpZ2F0aW9uUHJvcGVydGllc1xuXHQpLm1hcChucCA9PiBucC5uYW1lKTtcblx0cHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbiA9IGZvcm1hdFdpdGhUeXBlSW5mb3JtYXRpb24ob1Byb3BlcnR5RGVmaW5pdGlvbiwgcHJvcGVydHlCaW5kaW5nRXhwcmVzc2lvbik7XG5cdGlmICh1bml0Py50b1N0cmluZygpID09PSBcIiVcIikge1xuXHRcdHJldHVybiBmb3JtYXRSZXN1bHQoW3Byb3BlcnR5QmluZGluZ0V4cHJlc3Npb25dLCB2YWx1ZUZvcm1hdHRlcnMuZm9ybWF0V2l0aFBlcmNlbnRhZ2UpO1xuXHR9XG5cdGNvbnN0IGNvbXBsZXhUeXBlID0gdW5pdCA/IFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuVW5pdFwiIDogXCJzYXAudWkubW9kZWwub2RhdGEudHlwZS5DdXJyZW5jeVwiO1xuXHR1bml0ID0gdW5pdCA/IHVuaXQgOiBvUHJvcGVydHlEZWZpbml0aW9uLmFubm90YXRpb25zPy5NZWFzdXJlcz8uSVNPQ3VycmVuY3k7XG5cdGNvbnN0IHVuaXRCaW5kaW5nRXhwcmVzc2lvbiA9ICh1bml0IGFzIGFueSkuJHRhcmdldFxuXHRcdD8gZm9ybWF0V2l0aFR5cGVJbmZvcm1hdGlvbigodW5pdCBhcyBhbnkpLiR0YXJnZXQsIGFubm90YXRpb25FeHByZXNzaW9uKHVuaXQsIHJlbGF0aXZlTG9jYXRpb24pIGFzIEV4cHJlc3Npb248c3RyaW5nPilcblx0XHQ6IChhbm5vdGF0aW9uRXhwcmVzc2lvbih1bml0LCByZWxhdGl2ZUxvY2F0aW9uKSBhcyBFeHByZXNzaW9uPHN0cmluZz4pO1xuXHRyZXR1cm4gYWRkVHlwZUluZm9ybWF0aW9uKFtwcm9wZXJ0eUJpbmRpbmdFeHByZXNzaW9uLCB1bml0QmluZGluZ0V4cHJlc3Npb25dLCBjb21wbGV4VHlwZSk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0QWxpZ25tZW50RXhwcmVzc2lvbiA9IGZ1bmN0aW9uKFxuXHRvQ29tcHV0ZWRFZGl0TW9kZTogRXhwcmVzc2lvbjxzdHJpbmc+LFxuXHRzQWxpZ25EaXNwbGF5OiBzdHJpbmcgPSBcIkJlZ2luXCIsXG5cdHNBbGlnbkVkaXQ6IHN0cmluZyA9IFwiQmVnaW5cIlxuKTogQmluZGluZ0V4cHJlc3Npb248c3RyaW5nPiB8IEV4cHJlc3Npb248c3RyaW5nPiB7XG5cdHJldHVybiBjb21waWxlQmluZGluZyhpZkVsc2UoZXF1YWwob0NvbXB1dGVkRWRpdE1vZGUsIFwiRGlzcGxheVwiKSwgc0FsaWduRGlzcGxheSwgc0FsaWduRWRpdCkpO1xufTtcblxuLyoqXG4gKiBGb3JtYXR0ZXIgaGVscGVyIHRvIHJldHJpZXZlIHRoZSBjb252ZXJ0ZXJDb250ZXh0IGZyb20gdGhlIG1ldGFtb2RlbCBjb250ZXh0LlxuICpcbiAqIEBwYXJhbSB7Q29udGV4dH0gb0NvbnRleHQgVGhlIG9yaWdpbmFsIG1ldGFtb2RlbCBjb250ZXh0XG4gKiBAcGFyYW0ge0NvbXB1dGVkQW5ub3RhdGlvbkludGVyZmFjZX0gb0ludGVyZmFjZSBUaGUgY3VycmVudCB0ZW1wbGF0aW5nIGNvbnRleHRcbiAqIEByZXR1cm5zIHtvYmplY3R9IFRoZSBDb252ZXJ0ZXJDb250ZXh0IHJlcHJlc2VudGluZyB0aGF0IG9iamVjdFxuICovXG5leHBvcnQgY29uc3QgZ2V0Q29udmVydGVyQ29udGV4dCA9IGZ1bmN0aW9uKG9Db250ZXh0OiBNZXRhTW9kZWxDb250ZXh0LCBvSW50ZXJmYWNlOiBDb21wdXRlZEFubm90YXRpb25JbnRlcmZhY2UpOiBvYmplY3QgfCBudWxsIHtcblx0aWYgKG9JbnRlcmZhY2UgJiYgb0ludGVyZmFjZS5jb250ZXh0KSB7XG5cdFx0cmV0dXJuIGNvbnZlcnRNZXRhTW9kZWxDb250ZXh0KG9JbnRlcmZhY2UuY29udGV4dCk7XG5cdH1cblx0cmV0dXJuIG51bGw7XG59O1xuZ2V0Q29udmVydGVyQ29udGV4dC5yZXF1aXJlc0lDb250ZXh0ID0gdHJ1ZTtcblxuLyoqXG4gKiBGb3JtYXR0ZXIgaGVscGVyIHRvIHJldHJpZXZlIHRoZSBkYXRhIG1vZGVsIG9iamVjdHMgdGhhdCBhcmUgaW52b2x2ZWQgZnJvbSB0aGUgbWV0YW1vZGVsIGNvbnRleHQuXG4gKlxuICogQHBhcmFtIHtDb250ZXh0fSBvQ29udGV4dCBUaGUgb3JpZ2luYWwgT0RhdGFNZXRhTW9kZWwgY29udGV4dFxuICogQHBhcmFtIHtDb21wdXRlZEFubm90YXRpb25JbnRlcmZhY2V9IG9JbnRlcmZhY2UgVGhlIGN1cnJlbnQgdGVtcGxhdGluZyBjb250ZXh0XG4gKiBAcmV0dXJucyB7b2JqZWN0W119IEFuIGFycmF5IG9mIGVudGl0eXNldHMgYW5kIG5hdnByb3BlcnRpZXMgdGhhdCBhcmUgaW52b2x2ZWQgdG8gZ2V0IHRvIGEgc3BlY2lmaWMgb2JqZWN0IGluIHRoZSBtZXRhbW9kZWxcbiAqL1xuZXhwb3J0IGNvbnN0IGdldERhdGFNb2RlbE9iamVjdFBhdGggPSBmdW5jdGlvbihcblx0b0NvbnRleHQ6IE1ldGFNb2RlbENvbnRleHQsXG5cdG9JbnRlcmZhY2U6IENvbXB1dGVkQW5ub3RhdGlvbkludGVyZmFjZVxuKTogRGF0YU1vZGVsT2JqZWN0UGF0aCB8IG51bGwge1xuXHRpZiAob0ludGVyZmFjZSAmJiBvSW50ZXJmYWNlLmNvbnRleHQpIHtcblx0XHRyZXR1cm4gZ2V0SW52b2x2ZWREYXRhTW9kZWxPYmplY3RzKG9JbnRlcmZhY2UuY29udGV4dCk7XG5cdH1cblx0cmV0dXJuIG51bGw7XG59O1xuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aC5yZXF1aXJlc0lDb250ZXh0ID0gdHJ1ZTtcblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIGV4cHJlc3Npb25CaW5kaW5nIGNyZWF0ZWQgb3V0IG9mIGEgYmluZGluZyBleHByZXNzaW9uLlxuICpcbiAqIEBwYXJhbSB7RXhwcmVzc2lvbjxhbnk+fSBleHByZXNzaW9uIFRoZSBleHByZXNzaW9uIHdoaWNoIG5lZWRzIHRvIGJlIGNvbXBpbGVkXG4gKiBAcmV0dXJucyB7QmluZGluZ0V4cHJlc3Npb248c3RyaW5nPn0gVGhlIGV4cHJlc3Npb24tYmluZGluZyBzdHJpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IGdldEV4cHJlc3Npb25CaW5kaW5nID0gZnVuY3Rpb24oZXhwcmVzc2lvbjogRXhwcmVzc2lvbjxhbnk+KTogQmluZGluZ0V4cHJlc3Npb248c3RyaW5nPiB7XG5cdHJldHVybiBjb21waWxlQmluZGluZyhleHByZXNzaW9uKTtcbn07XG5cbi8qKlxuICogUmV0cmlldmUgdGhlIHRhcmdldCBlbnRpdHlzZXQgZm9yIGEgY29udGV4dCBwYXRoIGlmIGl0IGV4aXN0cy5cbiAqXG4gKiBAcGFyYW0gb0NvbnRleHRcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRUYXJnZXRFbnRpdHlTZXQgPSBmdW5jdGlvbihvQ29udGV4dDogQ29udGV4dCk6IHN0cmluZyB8IG51bGwge1xuXHRpZiAob0NvbnRleHQpIHtcblx0XHRjb25zdCBvRGF0YU1vZGVsUGF0aCA9IGdldEludm9sdmVkRGF0YU1vZGVsT2JqZWN0cyhvQ29udGV4dCk7XG5cdFx0cmV0dXJuIGdldFRhcmdldEVudGl0eVNldFBhdGgob0RhdGFNb2RlbFBhdGgpO1xuXHR9XG5cblx0cmV0dXJuIG51bGw7XG59O1xuXG5leHBvcnQgY29uc3QgaXNDb2xsZWN0aW9uRmllbGQgPSBmdW5jdGlvbihvRGF0YU1vZGVsUGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCk6IGJvb2xlYW4ge1xuXHRpZiAob0RhdGFNb2RlbFBhdGgubmF2aWdhdGlvblByb3BlcnRpZXM/Lmxlbmd0aCkge1xuXHRcdGNvbnN0IGhhc09uZVRvTWFueU5hdmlnYXRpb24gPVxuXHRcdFx0b0RhdGFNb2RlbFBhdGg/Lm5hdmlnYXRpb25Qcm9wZXJ0aWVzLmZpbmRJbmRleCgob05hdjogTmF2aWdhdGlvblByb3BlcnR5KSA9PiB7XG5cdFx0XHRcdGlmIChvTmF2LmlzQ29sbGVjdGlvbikge1xuXHRcdFx0XHRcdGlmIChvRGF0YU1vZGVsUGF0aC5jb250ZXh0TG9jYXRpb24/Lm5hdmlnYXRpb25Qcm9wZXJ0aWVzPy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdC8vd2UgY2hlY2sgdGhlIG9uZSB0byBtYW55IG5hdiBpcyBub3QgYWxyZWFkeSBwYXJ0IG9mIHRoZSBjb250ZXh0XG5cdFx0XHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdFx0XHRvRGF0YU1vZGVsUGF0aC5jb250ZXh0TG9jYXRpb24/Lm5hdmlnYXRpb25Qcm9wZXJ0aWVzLmZpbmRJbmRleChcblx0XHRcdFx0XHRcdFx0XHQob0NvbnRleHROYXY6IE5hdmlnYXRpb25Qcm9wZXJ0eSkgPT4gb0NvbnRleHROYXYubmFtZSA9PT0gb05hdi5uYW1lXG5cdFx0XHRcdFx0XHRcdCkgPT09IC0xXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9KSA+IC0xO1xuXHRcdGlmIChoYXNPbmVUb01hbnlOYXZpZ2F0aW9uKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xufTtcbiJdfQ==