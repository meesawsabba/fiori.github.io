/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["./AnnotationEnum"], function (AnnotationEnum) {
  "use strict";

  var _exports = {};
  var resolveEnumValue = AnnotationEnum.resolveEnumValue;

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var unresolveableExpression = {
    _type: "Unresolveable"
  };
  _exports.unresolveableExpression = unresolveableExpression;

  function escapeXmlAttribute(inputString) {
    return inputString.replace(/[']/g, function (c) {
      switch (c) {
        case "'":
          return "\\'";

        default:
          return c;
      }
    });
  }

  function hasUnresolveableExpression() {
    for (var _len = arguments.length, expressions = new Array(_len), _key = 0; _key < _len; _key++) {
      expressions[_key] = arguments[_key];
    }

    return expressions.find(function (expr) {
      return expr._type === "Unresolveable";
    }) !== undefined;
  }
  /**
   * Check two expressions for (deep) equality.
   *
   * @param a
   * @param b
   * @returns {boolean} `true` if the two expressions are equal
   */


  _exports.hasUnresolveableExpression = hasUnresolveableExpression;

  function _checkExpressionsAreEqual(a, b) {
    if (a._type !== b._type) {
      return false;
    }

    switch (a._type) {
      case "Unresolveable":
        return false;
      // Unresolveable is never equal to anything even itself

      case "Constant":
      case "EmbeddedBinding":
      case "EmbeddedExpressionBinding":
        return a.value === b.value;

      case "Not":
        return _checkExpressionsAreEqual(a.operand, b.operand);

      case "Truthy":
        return _checkExpressionsAreEqual(a.operand, b.operand);

      case "Set":
        return a.operator === b.operator && a.operands.length === b.operands.length && a.operands.every(function (expression) {
          return b.operands.some(function (otherExpression) {
            return _checkExpressionsAreEqual(expression, otherExpression);
          });
        });

      case "IfElse":
        return _checkExpressionsAreEqual(a.condition, b.condition) && _checkExpressionsAreEqual(a.onTrue, b.onTrue) && _checkExpressionsAreEqual(a.onFalse, b.onFalse);

      case "Comparison":
        return a.operator == b.operator && _checkExpressionsAreEqual(a.operand1, b.operand1) && _checkExpressionsAreEqual(a.operand2, b.operand2);

      case "Concat":
        var aExpressions = a.expressions;
        var bExpressions = b.expressions;

        if (aExpressions.length !== bExpressions.length) {
          return false;
        }

        return aExpressions.every(function (expression, index) {
          return _checkExpressionsAreEqual(expression, bExpressions[index]);
        });

      case "Binding":
        return a.modelName === b.modelName && a.path === b.path && a.targetEntitySet === b.targetEntitySet;

      case "DefaultBinding":
        return a.modelName === b.modelName && a.path === b.path;

      case "Formatter":
        return a.fn === b.fn && a.parameters.length === b.parameters.length && a.parameters.every(function (value, index) {
          return _checkExpressionsAreEqual(b.parameters[index], value);
        });

      case "ComplexType":
        return a.type === b.type && a.bindingParameters.length === b.bindingParameters.length && a.bindingParameters.every(function (value, index) {
          return _checkExpressionsAreEqual(b.bindingParameters[index], value);
        });

      case "Function":
        var otherFunction = b;

        if (a.obj === undefined || otherFunction.obj === undefined) {
          return a.obj === otherFunction;
        }

        return a.fn === otherFunction.fn && _checkExpressionsAreEqual(a.obj, otherFunction.obj) && a.parameters.length === otherFunction.parameters.length && a.parameters.every(function (value, index) {
          return _checkExpressionsAreEqual(otherFunction.parameters[index], value);
        });

      case "Ref":
        return a.ref === b.ref;
    }
  }
  /**
   * Converts a nested SetExpression by inlining operands of type SetExpression with the same operator.
   *
   * @param expression The expression to flatten
   * @returns {SetExpression} A new SetExpression with the same operator
   */


  _exports._checkExpressionsAreEqual = _checkExpressionsAreEqual;

  function flattenSetExpression(expression) {
    return expression.operands.reduce(function (result, operand) {
      var candidatesForFlattening = operand._type === "Set" && operand.operator === expression.operator ? operand.operands : [operand];
      candidatesForFlattening.forEach(function (candidate) {
        if (result.operands.every(function (e) {
          return !_checkExpressionsAreEqual(e, candidate);
        })) {
          result.operands.push(candidate);
        }
      });
      return result;
    }, {
      _type: "Set",
      operator: expression.operator,
      operands: []
    });
  }
  /**
   * Detects whether an array of boolean expressions contains an expression and its negation.
   *
   * @param expressions Array of expressions
   * @returns {boolean} `true` if the set of expressions contains an expression and its negation
   */


  function hasOppositeExpressions(expressions) {
    if (expressions.length < 2) {
      return false;
    }

    var i = expressions.length;

    while (i--) {
      var expression = expressions[i];
      var negatedExpression = not(expression);

      for (var j = 0; j < i; j++) {
        if (_checkExpressionsAreEqual(expressions[j], negatedExpression)) {
          return true;
        }
      }
    }

    return false;
  }
  /**
   * Logical `and` expression.
   *
   * The expression is simplified to false if this can be decided statically (that is, if one operand is a constant
   * false or if the expression contains an operand and its negation).
   *
   * @param operands Expressions to connect by `and`
   * @returns {Expression<boolean>} Expression evaluating to boolean
   */


  function and() {
    for (var _len2 = arguments.length, operands = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      operands[_key2] = arguments[_key2];
    }

    var expressions = flattenSetExpression({
      _type: "Set",
      operator: "&&",
      operands: operands.map(wrapPrimitive)
    }).operands;

    if (hasUnresolveableExpression.apply(void 0, _toConsumableArray(expressions))) {
      return unresolveableExpression;
    }

    var isStaticFalse = false;
    var nonTrivialExpression = expressions.filter(function (expression) {
      if (isConstant(expression) && !expression.value) {
        isStaticFalse = true;
      }

      return !isConstant(expression);
    });

    if (isStaticFalse) {
      return constant(false);
    } else if (nonTrivialExpression.length === 0) {
      // Resolve the constant then
      var isValid = expressions.reduce(function (isValid, expression) {
        return isValid && isConstant(expression) && expression.value;
      }, true);
      return constant(isValid);
    } else if (nonTrivialExpression.length === 1) {
      return nonTrivialExpression[0];
    } else if (hasOppositeExpressions(nonTrivialExpression)) {
      return constant(false);
    } else {
      return {
        _type: "Set",
        operator: "&&",
        operands: nonTrivialExpression
      };
    }
  }
  /**
   * Logical `or` expression.
   *
   * The expression is simplified to true if this can be decided statically (that is, if one operand is a constant
   * true or if the expression contains an operand and its negation).
   *
   * @param operands Expressions to connect by `or`
   * @returns {Expression<boolean>} Expression evaluating to boolean
   */


  _exports.and = and;

  function or() {
    for (var _len3 = arguments.length, operands = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      operands[_key3] = arguments[_key3];
    }

    var expressions = flattenSetExpression({
      _type: "Set",
      operator: "||",
      operands: operands.map(wrapPrimitive)
    }).operands;

    if (hasUnresolveableExpression.apply(void 0, _toConsumableArray(expressions))) {
      return unresolveableExpression;
    }

    var isStaticTrue = false;
    var nonTrivialExpression = expressions.filter(function (expression) {
      if (isConstant(expression) && expression.value) {
        isStaticTrue = true;
      }

      return !isConstant(expression) || expression.value;
    });

    if (isStaticTrue) {
      return constant(true);
    } else if (nonTrivialExpression.length === 0) {
      // Resolve the constant then
      var isValid = expressions.reduce(function (isValid, expression) {
        return isValid && isConstant(expression) && expression.value;
      }, true);
      return constant(isValid);
    } else if (nonTrivialExpression.length === 1) {
      return nonTrivialExpression[0];
    } else if (hasOppositeExpressions(nonTrivialExpression)) {
      return constant(true);
    } else {
      return {
        _type: "Set",
        operator: "||",
        operands: nonTrivialExpression
      };
    }
  }
  /**
   * Logical `not` operator.
   *
   * @param operand The expression to reverse
   * @returns {Expression<boolean>} The resulting expression that evaluates to boolean
   */


  _exports.or = or;

  function not(operand) {
    operand = wrapPrimitive(operand);

    if (hasUnresolveableExpression(operand)) {
      return unresolveableExpression;
    } else if (isConstant(operand)) {
      return constant(!operand.value);
    } else if (typeof operand === "object" && operand._type === "Set" && operand.operator === "||" && operand.operands.every(function (expression) {
      return isConstant(expression) || isComparison(expression);
    })) {
      return and.apply(void 0, _toConsumableArray(operand.operands.map(function (expression) {
        return not(expression);
      })));
    } else if (typeof operand === "object" && operand._type === "Set" && operand.operator === "&&" && operand.operands.every(function (expression) {
      return isConstant(expression) || isComparison(expression);
    })) {
      return or.apply(void 0, _toConsumableArray(operand.operands.map(function (expression) {
        return not(expression);
      })));
    } else if (isComparison(operand)) {
      // Create the reverse comparison
      switch (operand.operator) {
        case "!==":
          return equal(operand.operand1, operand.operand2);

        case "<":
          return greaterOrEqual(operand.operand1, operand.operand2);

        case "<=":
          return greaterThan(operand.operand1, operand.operand2);

        case "===":
          return notEqual(operand.operand1, operand.operand2);

        case ">":
          return lessOrEqual(operand.operand1, operand.operand2);

        case ">=":
          return lessThan(operand.operand1, operand.operand2);
      }
    } else if (operand._type === "Not") {
      return operand.operand;
    } else {
      return {
        _type: "Not",
        operand: operand
      };
    }
  }
  /**
   * Evaluates whether a binding expression is equal to true with a loose equality.
   *
   * @param operand The expression to check
   * @returns {Expression<boolean>} The resulting expression that evaluates to boolean
   */


  _exports.not = not;

  function isTruthy(operand) {
    if (isConstant(operand)) {
      return constant(!!operand.value);
    } else {
      return {
        _type: "Truthy",
        operand: operand
      };
    }
  }
  /**
   * Creates a binding expression that will be evaluated by the corresponding model.
   *
   * @template TargetType
   * @param path The path on the model
   * @param [modelName] The name of the model
   * @param [visitedNavigationPaths] The paths from the root entitySet
   * @param [pathVisitor] A function to modify the resulting path
   * @returns {BindingExpressionExpression<TargetType>} The default binding expression
   */


  _exports.isTruthy = isTruthy;

  function bindingExpression(path, modelName) {
    var visitedNavigationPaths = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var pathVisitor = arguments.length > 3 ? arguments[3] : undefined;

    if (path === undefined) {
      return unresolveableExpression;
    }

    var targetPath;

    if (pathVisitor) {
      targetPath = pathVisitor(path);

      if (targetPath === undefined) {
        return unresolveableExpression;
      }
    } else {
      var localPath = visitedNavigationPaths.concat();
      localPath.push(path);
      targetPath = localPath.join("/");
    }

    return {
      _type: "Binding",
      modelName: modelName,
      path: targetPath
    };
  }

  _exports.bindingExpression = bindingExpression;

  /**
   * Creates a constant expression based on a primitive value.
   *
   * @template T
   * @param value The constant to wrap in an expression
   * @returns {ConstantExpression<T>} The constant expression
   */
  function constant(value) {
    var constantValue;

    if (typeof value === "object" && value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        constantValue = value.map(wrapPrimitive);
      } else if (isPrimitiveObject(value)) {
        constantValue = value.valueOf();
      } else {
        var val = value;
        var obj = Object.keys(val).reduce(function (obj, key) {
          var value = wrapPrimitive(val[key]);

          if (value._type !== "Constant" || value.value !== undefined) {
            obj[key] = value;
          }

          return obj;
        }, {});
        constantValue = obj;
      }
    } else {
      constantValue = value;
    }

    return {
      _type: "Constant",
      value: constantValue
    };
  }

  _exports.constant = constant;

  function resolveBindingString(value, targetType) {
    if (value !== undefined && typeof value === "string" && value.startsWith("{")) {
      if (value.startsWith("{=")) {
        // Expression binding, we can just remove the outer binding things
        return {
          _type: "EmbeddedExpressionBinding",
          value: value
        };
      } else {
        return {
          _type: "EmbeddedBinding",
          value: value
        };
      }
    } else {
      switch (targetType) {
        case "boolean":
          if (typeof value === "string" && (value === "true" || value === "false")) {
            return constant(value === "true");
          }

          return constant(value);

        default:
          return constant(value);
      }
    }
  }
  /**
   * A named reference.
   *
   * @see fn
   *
   * @param ref Reference
   * @returns {ReferenceExpression} The object reference binding part
   */


  _exports.resolveBindingString = resolveBindingString;

  function ref(ref) {
    return {
      _type: "Ref",
      ref: ref
    };
  }
  /**
   * Determine whether the type is an expression.
   *
   * Every object having a property named `_type` of some value is considered an expression, even if there is actually
   * no such expression type supported.
   *
   * @param something Type to check
   * @returns {boolean} `true` if the type is considered to be an expression
   */


  _exports.ref = ref;

  function isExpression(something) {
    return something !== null && typeof something === "object" && something._type !== undefined;
  }
  /**
   * Wrap a primitive into a constant expression if it is not already an expression.
   *
   * @template T
   * @param something The object to wrap in a Constant expression
   * @returns {Expression<T>} Either the original object or the wrapped one depending on the case
   */


  function wrapPrimitive(something) {
    if (isExpression(something)) {
      return something;
    }

    return constant(something);
  }
  /**
   * Checks if the expression or value provided is constant or not.
   *
   * @template T The target type
   * @param  maybeConstant The expression or primitive value that is to be checked
   * @returns {boolean} `true` if it is constant
   */


  function isConstant(maybeConstant) {
    return typeof maybeConstant !== "object" || maybeConstant._type === "Constant";
  }
  /**
   * Checks if the expression or value provided is binding or not.
   *
   * @template T The target type
   * @param  maybeBinding The expression or primitive value that is to be checked
   * @returns {boolean} `true` if it is binding
   */


  _exports.isConstant = isConstant;

  function isBinding(maybeBinding) {
    return typeof maybeBinding === "object" && maybeBinding._type === "Binding";
  }
  /**
   * Checks if the expression provided is a comparison or not.
   *
   * @template T The target type
   * @param expression The expression
   * @returns {boolean} `true` if the expression is a ComparisonExpression
   */


  _exports.isBinding = isBinding;

  function isComparison(expression) {
    return expression._type === "Comparison";
  }

  function isPrimitiveObject(objectType) {
    switch (objectType.constructor.name) {
      case "String":
      case "Number":
      case "Boolean":
        return true;

      default:
        return false;
    }
  }
  /**
   * Check if the passed annotation expression is a ComplexAnnotationExpression.
   *
   * @template T The target type
   * @param  annotationExpression The annotation expression to evaluate
   * @returns {boolean} `true` if the object is a {ComplexAnnotationExpression}
   */


  function isComplexAnnotationExpression(annotationExpression) {
    return typeof annotationExpression === "object" && !isPrimitiveObject(annotationExpression);
  }
  /**
   * Generate the corresponding expression for a given annotation expression.
   *
   * @template T The target type
   * @param annotationExpression The source annotation expression
   * @param visitedNavigationPaths The path from the root entity set
   * @param defaultValue Default value if the annotationExpression is undefined
   * @param pathVisitor A function to modify the resulting path
   * @returns {Expression<T>} The expression equivalent to that annotation expression
   */


  function annotationExpression(annotationExpression) {
    var visitedNavigationPaths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var defaultValue = arguments.length > 2 ? arguments[2] : undefined;
    var pathVisitor = arguments.length > 3 ? arguments[3] : undefined;

    if (annotationExpression === undefined) {
      return wrapPrimitive(defaultValue);
    }

    if (!isComplexAnnotationExpression(annotationExpression)) {
      return constant(annotationExpression);
    } else {
      switch (annotationExpression.type) {
        case "Path":
          return bindingExpression(annotationExpression.path, undefined, visitedNavigationPaths, pathVisitor);

        case "If":
          return annotationIfExpression(annotationExpression.If, visitedNavigationPaths, pathVisitor);

        case "Not":
          return not(parseAnnotationCondition(annotationExpression.Not, visitedNavigationPaths, pathVisitor));

        case "Eq":
          return equal(parseAnnotationCondition(annotationExpression.Eq[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationExpression.Eq[1], visitedNavigationPaths, pathVisitor));

        case "Ne":
          return notEqual(parseAnnotationCondition(annotationExpression.Ne[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationExpression.Ne[1], visitedNavigationPaths, pathVisitor));

        case "Gt":
          return greaterThan(parseAnnotationCondition(annotationExpression.Gt[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationExpression.Gt[1], visitedNavigationPaths, pathVisitor));

        case "Ge":
          return greaterOrEqual(parseAnnotationCondition(annotationExpression.Ge[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationExpression.Ge[1], visitedNavigationPaths, pathVisitor));

        case "Lt":
          return lessThan(parseAnnotationCondition(annotationExpression.Lt[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationExpression.Lt[1], visitedNavigationPaths, pathVisitor));

        case "Le":
          return lessOrEqual(parseAnnotationCondition(annotationExpression.Le[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationExpression.Le[1], visitedNavigationPaths, pathVisitor));

        case "Or":
          return or.apply(void 0, _toConsumableArray(annotationExpression.Or.map(function (orCondition) {
            return parseAnnotationCondition(orCondition, visitedNavigationPaths, pathVisitor);
          })));

        case "And":
          return and.apply(void 0, _toConsumableArray(annotationExpression.And.map(function (andCondition) {
            return parseAnnotationCondition(andCondition, visitedNavigationPaths, pathVisitor);
          })));

        case "Apply":
          return annotationApplyExpression(annotationExpression, visitedNavigationPaths, pathVisitor);
      }
    }
  }
  /**
   * Parse the annotation condition into an expression.
   *
   * @template T The target type
   * @param annotationValue The condition or value from the annotation
   * @param visitedNavigationPaths The path from the root entity set
   * @param pathVisitor A function to modify the resulting path
   * @returns {Expression<T>} An equivalent expression
   */


  _exports.annotationExpression = annotationExpression;

  function parseAnnotationCondition(annotationValue) {
    var visitedNavigationPaths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var pathVisitor = arguments.length > 2 ? arguments[2] : undefined;

    if (annotationValue === null || typeof annotationValue !== "object") {
      return constant(annotationValue);
    } else if (annotationValue.hasOwnProperty("$Or")) {
      return or.apply(void 0, _toConsumableArray(annotationValue.$Or.map(function (orCondition) {
        return parseAnnotationCondition(orCondition, visitedNavigationPaths, pathVisitor);
      })));
    } else if (annotationValue.hasOwnProperty("$And")) {
      return and.apply(void 0, _toConsumableArray(annotationValue.$And.map(function (andCondition) {
        return parseAnnotationCondition(andCondition, visitedNavigationPaths, pathVisitor);
      })));
    } else if (annotationValue.hasOwnProperty("$Not")) {
      return not(parseAnnotationCondition(annotationValue.$Not[0], visitedNavigationPaths, pathVisitor));
    } else if (annotationValue.hasOwnProperty("$Eq")) {
      return equal(parseAnnotationCondition(annotationValue.$Eq[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationValue.$Eq[1], visitedNavigationPaths, pathVisitor));
    } else if (annotationValue.hasOwnProperty("$Ne")) {
      return notEqual(parseAnnotationCondition(annotationValue.$Ne[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationValue.$Ne[1], visitedNavigationPaths, pathVisitor));
    } else if (annotationValue.hasOwnProperty("$Gt")) {
      return greaterThan(parseAnnotationCondition(annotationValue.$Gt[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationValue.$Gt[1], visitedNavigationPaths, pathVisitor));
    } else if (annotationValue.hasOwnProperty("$Ge")) {
      return greaterOrEqual(parseAnnotationCondition(annotationValue.$Ge[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationValue.$Ge[1], visitedNavigationPaths, pathVisitor));
    } else if (annotationValue.hasOwnProperty("$Lt")) {
      return lessThan(parseAnnotationCondition(annotationValue.$Lt[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationValue.$Lt[1], visitedNavigationPaths, pathVisitor));
    } else if (annotationValue.hasOwnProperty("$Le")) {
      return lessOrEqual(parseAnnotationCondition(annotationValue.$Le[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationValue.$Le[1], visitedNavigationPaths, pathVisitor));
    } else if (annotationValue.hasOwnProperty("$Path")) {
      return bindingExpression(annotationValue.$Path, undefined, visitedNavigationPaths, pathVisitor);
    } else if (annotationValue.hasOwnProperty("$Apply")) {
      return annotationExpression({
        type: "Apply",
        Function: annotationValue.$Function,
        Apply: annotationValue.$Apply
      }, visitedNavigationPaths, undefined, pathVisitor);
    } else if (annotationValue.hasOwnProperty("$If")) {
      return annotationExpression({
        type: "If",
        If: annotationValue.$If
      }, visitedNavigationPaths, undefined, pathVisitor);
    } else if (annotationValue.hasOwnProperty("$EnumMember")) {
      return constant(resolveEnumValue(annotationValue.$EnumMember));
    } else {
      return constant(false);
    }
  }
  /**
   * Process the {IfAnnotationExpressionValue} into an expression.
   *
   * @template T The target type
   * @param annotationIfExpression An If expression returning the type T
   * @param visitedNavigationPaths The path from the root entity set
   * @param pathVisitor A function to modify the resulting path
   * @returns {Expression<T>} The equivalent ifElse expression
   */


  function annotationIfExpression(annotationIfExpression) {
    var visitedNavigationPaths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var pathVisitor = arguments.length > 2 ? arguments[2] : undefined;
    return ifElse(parseAnnotationCondition(annotationIfExpression[0], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationIfExpression[1], visitedNavigationPaths, pathVisitor), parseAnnotationCondition(annotationIfExpression[2], visitedNavigationPaths, pathVisitor));
  }

  _exports.annotationIfExpression = annotationIfExpression;

  function annotationApplyExpression(annotationApplyExpression) {
    var visitedNavigationPaths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var pathVisitor = arguments.length > 2 ? arguments[2] : undefined;

    switch (annotationApplyExpression.Function) {
      case "odata.concat":
        return concat.apply(void 0, _toConsumableArray(annotationApplyExpression.Apply.map(function (applyParam) {
          var applyParamConverted = applyParam;

          if (applyParam.hasOwnProperty("$Path")) {
            applyParamConverted = {
              type: "Path",
              path: applyParam.$Path
            };
          } else if (applyParam.hasOwnProperty("$If")) {
            applyParamConverted = {
              type: "If",
              If: applyParam.$If
            };
          } else if (applyParam.hasOwnProperty("$Apply")) {
            applyParamConverted = {
              type: "Apply",
              Function: applyParam.$Function,
              Apply: applyParam.$Apply
            };
          }

          return annotationExpression(applyParamConverted, visitedNavigationPaths, undefined, pathVisitor);
        })));
        break;
    }
  }
  /**
   * Generic helper for the comparison operations (equal, notEqual, ...).
   *
   * @template T The target type
   * @param operator The operator to apply
   * @param leftOperand The operand on the left side of the operator
   * @param rightOperand The operand on the right side of the operator
   * @returns {Expression<boolean>} An expression representing the comparison
   */


  _exports.annotationApplyExpression = annotationApplyExpression;

  function comparison(operator, leftOperand, rightOperand) {
    var leftExpression = wrapPrimitive(leftOperand);
    var rightExpression = wrapPrimitive(rightOperand);

    if (hasUnresolveableExpression(leftExpression, rightExpression)) {
      return unresolveableExpression;
    }

    if (isConstant(leftExpression) && isConstant(rightExpression)) {
      if (leftExpression.value === undefined || rightExpression.value === undefined) {
        return constant(leftExpression.value === rightExpression.value);
      }

      switch (operator) {
        case "!==":
          return constant(leftExpression.value !== rightExpression.value);

        case "<":
          return constant(leftExpression.value < rightExpression.value);

        case "<=":
          return constant(leftExpression.value <= rightExpression.value);

        case ">":
          return constant(leftExpression.value > rightExpression.value);

        case ">=":
          return constant(leftExpression.value >= rightExpression.value);

        case "===":
        default:
          return constant(leftExpression.value === rightExpression.value);
      }
    } else {
      return {
        _type: "Comparison",
        operator: operator,
        operand1: leftExpression,
        operand2: rightExpression
      };
    }
  }
  /**
   * Comparison: "equal" (===).
   *
   * @template T The target type
   * @param leftOperand The operand on the left side
   * @param rightOperand The operand on the right side of the comparison
   * @returns {Expression<boolean>} An expression representing the comparison
   */


  function equal(leftOperand, rightOperand) {
    var leftExpression = wrapPrimitive(leftOperand);
    var rightExpression = wrapPrimitive(rightOperand);

    if (hasUnresolveableExpression(leftExpression, rightExpression)) {
      return unresolveableExpression;
    }

    if (_checkExpressionsAreEqual(leftExpression, rightExpression)) {
      return constant(true);
    } // ((a === c) === true) => (a === c)


    if (leftExpression._type === "Comparison" && isConstant(rightExpression) && rightExpression.value === true) {
      return leftExpression;
    } else if (leftExpression._type === "Comparison" && isConstant(rightExpression) && rightExpression.value === true) {
      // ((a === c) === false) => !(a === c)
      return not(leftExpression);
    } else if (leftExpression._type === "IfElse" && _checkExpressionsAreEqual(leftExpression.onTrue, rightExpression)) {
      // (if(xxxx) { aaa } else { bbb } ) === aaa )
      return or(leftExpression.condition, equal(leftExpression.onFalse, rightExpression));
    } else if (leftExpression._type === "IfElse" && _checkExpressionsAreEqual(leftExpression.onFalse, rightExpression)) {
      return or(not(leftExpression.condition), equal(leftExpression.onTrue, rightExpression));
    } else if (leftExpression._type === "IfElse" && isConstant(leftExpression.onTrue) && isConstant(rightExpression) && isConstant(leftExpression.onFalse) && !_checkExpressionsAreEqual(leftExpression.onTrue, rightExpression) && !_checkExpressionsAreEqual(leftExpression.onFalse, rightExpression)) {
      return constant(false);
    }

    return comparison("===", leftExpression, rightExpression);
  }
  /**
   * Comparison: "not equal" (!==).
   *
   * @template T The target type
   * @param leftOperand The operand on the left side
   * @param rightOperand The operand on the right side of the comparison
   * @returns {Expression<boolean>} An expression representing the comparison
   */


  _exports.equal = equal;

  function notEqual(leftOperand, rightOperand) {
    var leftExpression = wrapPrimitive(leftOperand);
    var rightExpression = wrapPrimitive(rightOperand);

    if (_checkExpressionsAreEqual(leftExpression, rightExpression)) {
      return constant(false);
    } // ((a === c) !== true) => !(a === c)


    if (leftExpression._type === "Comparison" && isConstant(rightExpression) && rightExpression.value === true) {
      return not(leftExpression);
    } else if (leftExpression._type === "Comparison" && isConstant(rightExpression) && rightExpression.value === true) {
      // ((a === c) !== false) => (a === c)
      return leftExpression;
    } else if (leftExpression._type === "IfElse" && _checkExpressionsAreEqual(leftExpression.onTrue, rightExpression)) {
      return and(not(leftExpression.condition), notEqual(leftExpression.onFalse, rightExpression));
    } else if (leftExpression._type === "IfElse" && _checkExpressionsAreEqual(leftExpression.onFalse, rightExpression)) {
      return and(leftExpression.condition, notEqual(leftExpression.onTrue, rightExpression));
    } else if (leftExpression._type === "IfElse" && isConstant(leftExpression.onTrue) && isConstant(rightExpression) && isConstant(leftExpression.onFalse) && !_checkExpressionsAreEqual(leftExpression.onTrue, rightExpression) && !_checkExpressionsAreEqual(leftExpression.onFalse, rightExpression)) {
      // If the left expression is an if else where both onTrue and onFalse are not equals to the right expression -> simplify as true
      return constant(true);
    }

    return comparison("!==", leftExpression, rightExpression);
  }
  /**
   * Comparison: "greater or equal" (>=).
   *
   * @template T The target type
   * @param leftOperand The operand on the left side
   * @param rightOperand The operand on the right side of the comparison
   * @returns {Expression<boolean>} An expression representing the comparison
   */


  _exports.notEqual = notEqual;

  function greaterOrEqual(leftOperand, rightOperand) {
    return comparison(">=", leftOperand, rightOperand);
  }
  /**
   * Comparison: "greater than" (>).
   *
   * @template T The target type
   * @param leftOperand The operand on the left side
   * @param rightOperand The operand on the right side of the comparison
   * @returns {Expression<boolean>} An expression representing the comparison
   */


  _exports.greaterOrEqual = greaterOrEqual;

  function greaterThan(leftOperand, rightOperand) {
    return comparison(">", leftOperand, rightOperand);
  }
  /**
   * Comparison: "less or equal" (<=).
   *
   * @template T The target type
   * @param leftOperand The operand on the left side
   * @param rightOperand The operand on the right side of the comparison
   * @returns {Expression<boolean>} An expression representing the comparison
   */


  _exports.greaterThan = greaterThan;

  function lessOrEqual(leftOperand, rightOperand) {
    return comparison("<=", leftOperand, rightOperand);
  }
  /**
   * Comparison: "less than" (<).
   *
   * @template T The target type
   * @param leftOperand The operand on the left side
   * @param rightOperand The operand on the right side of the comparison
   * @returns {Expression<boolean>} An expression representing the comparison
   */


  _exports.lessOrEqual = lessOrEqual;

  function lessThan(leftOperand, rightOperand) {
    return comparison("<", leftOperand, rightOperand);
  }
  /**
   * If-then-else expression.
   *
   * Evaluates to onTrue if the condition evaluates to true, else evaluates to onFalse.
   *
   * @template T The target type
   * @param condition The condition to evaluate
   * @param onTrue Expression result if the condition evaluates to true
   * @param onFalse Expression result if the condition evaluates to false
   * @returns {Expression<T>} The expression that represents this conditional check
   */


  _exports.lessThan = lessThan;

  function ifElse(condition, onTrue, onFalse) {
    var conditionExpression = wrapPrimitive(condition);
    var onTrueExpression = wrapPrimitive(onTrue);
    var onFalseExpression = wrapPrimitive(onFalse);

    if (hasUnresolveableExpression(conditionExpression, onTrueExpression, onFalseExpression)) {
      return unresolveableExpression;
    } // swap branches if the condition is a negation


    if (conditionExpression._type === "Not") {
      // ifElse(not(X), a, b) --> ifElse(X, b, a)
      var _ref = [onFalseExpression, onTrueExpression];
      onTrueExpression = _ref[0];
      onFalseExpression = _ref[1];
      conditionExpression = not(conditionExpression);
    } // inline nested if-else expressions: onTrue branch
    // ifElse(X, ifElse(X, a, b), c) ==> ifElse(X, a, c)


    if (onTrueExpression._type === "IfElse" && _checkExpressionsAreEqual(conditionExpression, onTrueExpression.condition)) {
      onTrueExpression = onTrueExpression.onTrue;
    } // inline nested if-else expressions: onFalse branch
    // ifElse(X, a, ifElse(X, b, c)) ==> ifElse(X, a, c)


    if (onFalseExpression._type === "IfElse" && _checkExpressionsAreEqual(conditionExpression, onFalseExpression.condition)) {
      onFalseExpression = onFalseExpression.onFalse;
    } // inline nested if-else expressions: condition


    if (conditionExpression._type === "IfElse") {
      if (isConstant(conditionExpression.onFalse) && !conditionExpression.onFalse.value && isConstant(conditionExpression.onTrue) && conditionExpression.onTrue.value) {
        // ifElse(ifElse(X, true, false), a, b) ==> ifElse(X, a, b)
        conditionExpression = conditionExpression.condition;
      } else if (isConstant(conditionExpression.onFalse) && conditionExpression.onFalse.value && isConstant(conditionExpression.onTrue) && !conditionExpression.onTrue.value) {
        // ifElse(ifElse(X, false, true), a, b) ==> ifElse(not(X), a, b)
        conditionExpression = not(conditionExpression.condition);
      } else if (isConstant(conditionExpression.onTrue) && !conditionExpression.onTrue.value && !isConstant(conditionExpression.onFalse)) {
        // ifElse(ifElse(X, false, a), b, c) ==> ifElse(and(not(X), a), b, c)
        conditionExpression = and(not(conditionExpression.condition), conditionExpression.onFalse);
      }
    } // again swap branches if needed (in case one of the optimizations above led to a negated condition)


    if (conditionExpression._type === "Not") {
      // ifElse(not(X), a, b) --> ifElse(X, b, a)
      var _ref2 = [onFalseExpression, onTrueExpression];
      onTrueExpression = _ref2[0];
      onFalseExpression = _ref2[1];
      conditionExpression = not(conditionExpression);
    } // compute expression result for constant conditions


    if (isConstant(conditionExpression)) {
      return conditionExpression.value ? onTrueExpression : onFalseExpression;
    } // compute expression result if onTrue and onFalse branches are equal


    if (_checkExpressionsAreEqual(onTrueExpression, onFalseExpression)) {
      return onTrueExpression;
    } // If either trueExpression or falseExpression is a value equals to false the expression can be simplified
    // If(Condition) Then XXX Else False -> Condition && XXX


    if (isConstant(onFalseExpression) && onFalseExpression.value === false) {
      return and(conditionExpression, onTrueExpression);
    } // If(Condition) Then False Else XXX -> !Condition && XXX


    if (isConstant(onTrueExpression) && onTrueExpression.value === false) {
      return and(not(conditionExpression), onFalseExpression);
    }

    return {
      _type: "IfElse",
      condition: conditionExpression,
      onTrue: onTrueExpression,
      onFalse: onFalseExpression
    };
  }
  /**
   * Checks whether the current expression has a reference to the default model (undefined).
   *
   * @param expression The expression to evaluate
   * @returns {boolean} `true` if there is a reference to the default context
   */


  _exports.ifElse = ifElse;

  function hasReferenceToDefaultContext(expression) {
    switch (expression._type) {
      case "Constant":
      case "Formatter":
      case "ComplexType":
        return false;

      case "Set":
        return expression.operands.some(hasReferenceToDefaultContext);

      case "Binding":
        return expression.modelName === undefined;

      case "Comparison":
        return hasReferenceToDefaultContext(expression.operand1) || hasReferenceToDefaultContext(expression.operand2);

      case "DefaultBinding":
        return true;

      case "IfElse":
        return hasReferenceToDefaultContext(expression.condition) || hasReferenceToDefaultContext(expression.onTrue) || hasReferenceToDefaultContext(expression.onFalse);

      case "Not":
      case "Truthy":
        return hasReferenceToDefaultContext(expression.operand);

      default:
        return false;
    }
  }

  /**
   * Calls a formatter function to process the parameters.
   * If requireContext is set to true and no context is passed a default context will be added automatically.
   *
   * @template T
   * @template U
   * @param parameters The list of parameter that should match the type and number of the formatter function
   * @param formatterFunction The function to call
   * @param [contextEntityType] The context entity type to consider
   * @returns {Expression<T>} The corresponding expression
   */
  function formatResult(parameters, formatterFunction, contextEntityType) {
    var parameterExpressions = parameters.map(wrapPrimitive);

    if (hasUnresolveableExpression.apply(void 0, _toConsumableArray(parameterExpressions))) {
      return unresolveableExpression;
    }

    if (!!contextEntityType) {
      // Otherwise, if the context is required and no context is provided make sure to add the default binding
      if (!parameterExpressions.some(hasReferenceToDefaultContext)) {
        contextEntityType.keys.forEach(function (key) {
          return parameterExpressions.push(bindingExpression(key.name, ""));
        });
      }
    } // FormatterName can be of format sap.fe.core.xxx#methodName to have multiple formatter in one class


    var _formatterFunction$__ = formatterFunction.__functionName.split("#"),
        _formatterFunction$__2 = _slicedToArray(_formatterFunction$__, 2),
        formatterClass = _formatterFunction$__2[0],
        formatterName = _formatterFunction$__2[1];

    if (!!formatterName && formatterName.length > 0) {
      parameterExpressions.unshift(constant(formatterName));
    }

    return {
      _type: "Formatter",
      fn: formatterClass,
      parameters: parameterExpressions
    };
  }
  /**
   * Calls a complex type  to process the parameters.
   * If requireContext is set to true and no context is passed a default context will be added automatically.
   *
   * @template T
   * @template U
   * @param parameters The list of parameter that should match the type for the compplex type
   * @param type The complex type to use
   * @param [contextEntityType] The context entity type to consider
   * @returns {Expression<T>} The corresponding expression
   */


  _exports.formatResult = formatResult;

  function addTypeInformation(parameters, type, contextEntityType) {
    var _parameters$, _parameters$$type;

    var parameterExpressions = parameters.map(wrapPrimitive);

    if (hasUnresolveableExpression.apply(void 0, _toConsumableArray(parameterExpressions))) {
      return unresolveableExpression;
    } // If there is only one parameter and it is a constant and we don't expect the context then return the constant


    if (parameterExpressions.length === 1 && isConstant(parameterExpressions[0]) && !contextEntityType) {
      return parameterExpressions[0];
    } else if (!!contextEntityType) {
      // Otherwise, if the context is required and no context is provided make sure to add the default binding
      if (!parameterExpressions.some(hasReferenceToDefaultContext)) {
        contextEntityType.keys.forEach(function (key) {
          return parameterExpressions.push(bindingExpression(key.name, ""));
        });
      }
    }

    var oFormatOptions = ((_parameters$ = parameters[0]) === null || _parameters$ === void 0 ? void 0 : (_parameters$$type = _parameters$.type) === null || _parameters$$type === void 0 ? void 0 : _parameters$$type.indexOf("sap.ui.model.odata.type.Int")) === 0 ? {
      parseAsString: false,
      emptyString: ""
    } : {};
    return {
      _type: "ComplexType",
      type: type,
      formatOptions: oFormatOptions,
      parameters: {},
      bindingParameters: parameterExpressions
    };
  }
  /**
   * Function call, optionally with arguments.
   *
   * @param fn Function name or reference to function
   * @param parameters Arguments
   * @param on Object to call the function on
   * @returns {FunctionExpression<T>} Expression representing the function call (not the result of the function call!)
   */


  _exports.addTypeInformation = addTypeInformation;

  function fn(fn, parameters, on) {
    var functionName = typeof fn === "string" ? fn : fn.__functionName;
    return {
      _type: "Function",
      obj: on !== undefined ? wrapPrimitive(on) : undefined,
      fn: functionName,
      parameters: parameters.map(wrapPrimitive)
    };
  }
  /**
   * Shortcut function to determine if a binding value is null, undefined or empty.
   *
   * @param expression
   * @returns A boolean expression evaluating the fact that the current element is empty
   */


  _exports.fn = fn;

  function isEmpty(expression) {
    if (expression._type === "Concat") {
      return or.apply(void 0, _toConsumableArray(expression.expressions.map(isEmpty)));
    }

    return or(equal(expression, ""), equal(expression, undefined), equal(expression, null));
  }

  _exports.isEmpty = isEmpty;

  function concat() {
    for (var _len4 = arguments.length, inExpressions = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      inExpressions[_key4] = arguments[_key4];
    }

    var expressions = inExpressions.map(wrapPrimitive);

    if (hasUnresolveableExpression.apply(void 0, _toConsumableArray(expressions))) {
      return unresolveableExpression;
    }

    if (expressions.every(isConstant)) {
      return constant(expressions.reduce(function (concatenated, value) {
        return concatenated + value.value.toString();
      }, ""));
    }

    return {
      _type: "Concat",
      expressions: expressions
    };
  }

  _exports.concat = concat;

  function transformRecursively(inExpression, expressionType, transformFunction) {
    var includeAllExpression = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var expression = inExpression;

    switch (expression._type) {
      case "Function":
        expression.parameters = expression.parameters.map(function (expression) {
          return transformRecursively(expression, expressionType, transformFunction, includeAllExpression);
        });
        break;

      case "Concat":
        expression.expressions = expression.expressions.map(function (expression) {
          return transformRecursively(expression, expressionType, transformFunction, includeAllExpression);
        });
        break;

      case "ComplexType":
        expression.bindingParameters = expression.bindingParameters.map(function (expression) {
          return transformRecursively(expression, expressionType, transformFunction, includeAllExpression);
        });
        break;

      case "Formatter":
        expression.parameters = expression.parameters.map(function (expression) {
          return transformRecursively(expression, expressionType, transformFunction, includeAllExpression);
        });
        break;

      case "IfElse":
        var onTrue = transformRecursively(expression.onTrue, expressionType, transformFunction, includeAllExpression);
        var onFalse = transformRecursively(expression.onFalse, expressionType, transformFunction, includeAllExpression);
        var condition = expression.condition;

        if (includeAllExpression) {
          condition = transformRecursively(expression.condition, expressionType, transformFunction, includeAllExpression);
        }

        expression = ifElse(condition, onTrue, onFalse);
        break;

      case "Not":
        if (includeAllExpression) {
          var operand = transformRecursively(expression.operand, expressionType, transformFunction, includeAllExpression);
          expression = not(operand);
        }

        break;

      case "Truthy":
        break;

      case "Set":
        if (includeAllExpression) {
          expression.operands = expression.operands.map(function (expression) {
            return transformRecursively(expression, expressionType, transformFunction, includeAllExpression);
          });
        }

        break;

      case "Comparison":
        if (includeAllExpression) {
          var operand1 = transformRecursively(expression.operand1, expressionType, transformFunction, includeAllExpression);
          var operand2 = transformRecursively(expression.operand2, expressionType, transformFunction, includeAllExpression);
          expression = comparison(expression.operator, operand1, operand2);
        }

        break;

      case "DefaultBinding":
      case "Ref":
      case "Binding":
      case "Constant":
        // Do nothing
        break;
    }

    if (expressionType === expression._type) {
      expression = transformFunction(inExpression);
    }

    return expression;
  }

  _exports.transformRecursively = transformRecursively;

  /**
   * Compile an expression into an expression binding.
   *
   * @template T The target type
   * @param expression The expression to compile
   * @param embeddedInBinding Whether the expression to compile is embedded into another expression
   * @param keepTargetType Keep the target type of the embedded bindings instead of casting them to any
   * @returns {BindingExpression<T>} The corresponding expression binding
   */
  function compileBinding(expression) {
    var embeddedInBinding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var keepTargetType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var expr = wrapPrimitive(expression);
    var embeddedSeparator = keepTargetType ? "$" : "%";
    var outProperty = "";

    switch (expr._type) {
      case "Unresolveable":
        return undefined;

      case "Constant":
        if (expr.value === null) {
          return "null";
        }

        if (expr.value === undefined) {
          return "undefined";
        }

        if (typeof expr.value === "object") {
          if (Array.isArray(expr.value)) {
            var entries = expr.value.map(function (expression) {
              return compileBinding(expression, true);
            });
            return "[".concat(entries.join(", "), "]");
          } else {
            // Objects
            var o = expr.value;
            var properties = Object.keys(o).map(function (key) {
              var value = o[key];
              return "".concat(key, ": ").concat(compileBinding(value, true));
            });
            return "{".concat(properties.join(", "), "}");
          }
        }

        if (embeddedInBinding) {
          switch (typeof expr.value) {
            case "number":
            case "bigint":
            case "boolean":
              return expr.value.toString();

            case "string":
              return "'".concat(escapeXmlAttribute(expr.value.toString()), "'");

            default:
              return "";
          }
        } else {
          return expr.value.toString();
        }

      case "Ref":
        return expr.ref || "null";

      case "Function":
        var argumentString = "".concat(expr.parameters.map(function (arg) {
          return compileBinding(arg, true);
        }).join(", "));
        return expr.obj === undefined ? "".concat(expr.fn, "(").concat(argumentString, ")") : "".concat(compileBinding(expr.obj, true), ".").concat(expr.fn, "(").concat(argumentString, ")");

      case "EmbeddedExpressionBinding":
        if (embeddedInBinding) {
          return "(".concat(expr.value.substr(2, expr.value.length - 3), ")");
        } else {
          return "".concat(expr.value);
        }

      case "EmbeddedBinding":
        if (embeddedInBinding) {
          return "".concat(embeddedSeparator).concat(expr.value);
        } else {
          return "".concat(expr.value);
        }

      case "DefaultBinding":
      case "Binding":
        if (expr.type || expr.parameters || expr.targetType) {
          var outBinding = "";

          if (embeddedInBinding) {
            outBinding += "".concat(embeddedSeparator);
          }

          outBinding += "{path:'".concat(expr.modelName ? "".concat(expr.modelName, ">") : "").concat(expr.path, "'");

          if (expr.type) {
            outBinding += ", type: '".concat(expr.type, "'");
          }

          if (expr.constraints && Object.keys(expr.constraints).length > 0) {
            outBinding += ", constraints: ".concat(compileBinding(expr.constraints));
          }

          if (expr.formatOptions) {
            outBinding += ", formatOptions: ".concat(compileBinding(expr.formatOptions));
          }

          if (expr.parameters && Object.keys(expr.parameters).length > 0) {
            outBinding += ", parameters: ".concat(compileBinding(expr.parameters));
          }

          if (expr.targetType) {
            outBinding += ", targetType: '".concat(expr.targetType, "'");
          }

          outBinding += "}";
          return outBinding;
        } else {
          if (embeddedInBinding) {
            return "".concat(embeddedSeparator, "{").concat(expr.modelName ? "".concat(expr.modelName, ">") : "").concat(expr.path, "}");
          } else {
            return "{".concat(expr.modelName ? "".concat(expr.modelName, ">") : "").concat(expr.path, "}");
          }
        }

      case "Comparison":
        var comparisonPart = "".concat(compileBinding(expr.operand1, true), " ").concat(expr.operator, " ").concat(compileBinding(expr.operand2, true));

        if (embeddedInBinding) {
          return comparisonPart;
        }

        return "{= ".concat(comparisonPart, "}");

      case "IfElse":
        if (embeddedInBinding) {
          return "(".concat(compileBinding(expr.condition, true), " ? ").concat(compileBinding(expr.onTrue, true), " : ").concat(compileBinding(expr.onFalse, true), ")");
        } else {
          return "{= ".concat(compileBinding(expr.condition, true), " ? ").concat(compileBinding(expr.onTrue, true), " : ").concat(compileBinding(expr.onFalse, true), "}");
        }

      case "Set":
        if (embeddedInBinding) {
          return "(".concat(expr.operands.map(function (expression) {
            return compileBinding(expression, true);
          }).join(" ".concat(expr.operator, " ")), ")");
        } else {
          return "{= (".concat(expr.operands.map(function (expression) {
            return compileBinding(expression, true);
          }).join(" ".concat(expr.operator, " ")), ")}");
        }

      case "Concat":
        if (embeddedInBinding) {
          return "".concat(expr.expressions.map(function (expression) {
            return compileBinding(expression, true, true);
          }).join(" + "));
        } else {
          return "{= ".concat(expr.expressions.map(function (expression) {
            return compileBinding(expression, true, true);
          }).join(" + "), " }");
        }

      case "Not":
        if (embeddedInBinding) {
          return "!".concat(compileBinding(expr.operand, true));
        } else {
          return "{= !".concat(compileBinding(expr.operand, true), "}");
        }

      case "Truthy":
        if (embeddedInBinding) {
          return "!!".concat(compileBinding(expr.operand, true));
        } else {
          return "{= !!".concat(compileBinding(expr.operand, true), "}");
        }

      case "Formatter":
        if (expr.parameters.length === 1) {
          outProperty += "{".concat(compilePathParameter(expr.parameters[0], true), ", formatter: '").concat(expr.fn, "'}");
        } else {
          outProperty += "{parts:[".concat(expr.parameters.map(function (param) {
            return compilePathParameter(param);
          }).join(","), "], formatter: '").concat(expr.fn, "'}");
        }

        if (embeddedInBinding) {
          outProperty = "$".concat(outProperty);
        }

        return outProperty;

      case "ComplexType":
        if (expr.bindingParameters.length === 1) {
          outProperty += "{".concat(compilePathParameter(expr.bindingParameters[0], true), ", type: '").concat(expr.type, "'}");
        } else {
          var outputEnd; // this code is based on sap.ui.model.odata.v4._AnnotationHelperExpression.fetchCurrencyOrUnit

          switch (expr.type) {
            case "sap.ui.model.odata.type.Unit":
              outputEnd = ",{mode:'OneTime',path:'/##@@requestUnitsOfMeasure',targetType:'any'}],type:'sap.ui.model.odata.type.Unit'";
              break;

            case "sap.ui.model.odata.type.Currency":
              outputEnd = ",{mode:'OneTime',path:'/##@@requestCurrencyCodes',targetType:'any'}],type:'sap.ui.model.odata.type.Currency'";
              break;

            default:
              outputEnd = "], type: '".concat(expr.type, "'");
          }

          if (expr.formatOptions && Object.keys(expr.formatOptions).length > 0) {
            outputEnd += ", formatOptions: ".concat(compileBinding(expr.formatOptions));
          }

          if (expr.parameters && Object.keys(expr.parameters).length > 0) {
            outputEnd += ", parameters: ".concat(compileBinding(expr.parameters));
          }

          outputEnd += "}";
          outProperty += "{mode:'TwoWay', parts:[".concat(expr.bindingParameters.map(function (param) {
            return compilePathParameter(param);
          }).join(",")).concat(outputEnd);
        }

        if (embeddedInBinding) {
          outProperty = "$".concat(outProperty);
        }

        return outProperty;

      default:
        return "";
    }
  }
  /**
   * Compile the path parameter of a formatter call.
   *
   * @param expression The binding part to evaluate
   * @param singlePath Whether there is one or multiple path to consider
   * @returns {string} The string snippet to include in the overall binding definition
   */


  _exports.compileBinding = compileBinding;

  function compilePathParameter(expression) {
    var singlePath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var outValue = "";

    switch (expression._type) {
      case "Constant":
        switch (typeof expression.value) {
          case "number":
          case "bigint":
            outValue = "value: ".concat(expression.value.toString());
            break;

          case "string":
            outValue = "value: '".concat(escapeXmlAttribute(expression.value.toString()), "'");
            break;

          case "boolean":
            outValue = "value: '".concat(expression.value.toString(), "'");
            break;

          default:
            outValue = "value: ''";
            break;
        }

        if (singlePath) {
          return outValue;
        }

        return "{".concat(outValue, "}");

      case "DefaultBinding":
      case "Binding":
        outValue = "path:'".concat(expression.modelName ? "".concat(expression.modelName, ">") : "").concat(expression.path, "'");

        if (expression.type) {
          outValue += ", type : '".concat(expression.type, "'");
        } else {
          outValue += ", targetType : 'any'";
        }

        if (expression.constraints && Object.keys(expression.constraints).length > 0) {
          outValue += ", constraints: ".concat(compileBinding(expression.constraints));
        }

        if (expression.formatOptions && Object.keys(expression.formatOptions).length > 0) {
          outValue += ", formatOptions: ".concat(compileBinding(expression.formatOptions));
        }

        if (expression.parameters && Object.keys(expression.parameters).length > 0) {
          outValue += ", parameters: ".concat(compileBinding(expression.parameters));
        }

        if (singlePath) {
          return outValue;
        }

        return "{".concat(outValue, "}");

      default:
        return "";
    }
  }

  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJpbmRpbmdFeHByZXNzaW9uLnRzIl0sIm5hbWVzIjpbInVucmVzb2x2ZWFibGVFeHByZXNzaW9uIiwiX3R5cGUiLCJlc2NhcGVYbWxBdHRyaWJ1dGUiLCJpbnB1dFN0cmluZyIsInJlcGxhY2UiLCJjIiwiaGFzVW5yZXNvbHZlYWJsZUV4cHJlc3Npb24iLCJleHByZXNzaW9ucyIsImZpbmQiLCJleHByIiwidW5kZWZpbmVkIiwiX2NoZWNrRXhwcmVzc2lvbnNBcmVFcXVhbCIsImEiLCJiIiwidmFsdWUiLCJvcGVyYW5kIiwib3BlcmF0b3IiLCJvcGVyYW5kcyIsImxlbmd0aCIsImV2ZXJ5IiwiZXhwcmVzc2lvbiIsInNvbWUiLCJvdGhlckV4cHJlc3Npb24iLCJjb25kaXRpb24iLCJvblRydWUiLCJvbkZhbHNlIiwib3BlcmFuZDEiLCJvcGVyYW5kMiIsImFFeHByZXNzaW9ucyIsImJFeHByZXNzaW9ucyIsImluZGV4IiwibW9kZWxOYW1lIiwicGF0aCIsInRhcmdldEVudGl0eVNldCIsImZuIiwicGFyYW1ldGVycyIsInR5cGUiLCJiaW5kaW5nUGFyYW1ldGVycyIsIm90aGVyRnVuY3Rpb24iLCJvYmoiLCJyZWYiLCJmbGF0dGVuU2V0RXhwcmVzc2lvbiIsInJlZHVjZSIsInJlc3VsdCIsImNhbmRpZGF0ZXNGb3JGbGF0dGVuaW5nIiwiZm9yRWFjaCIsImNhbmRpZGF0ZSIsImUiLCJwdXNoIiwiaGFzT3Bwb3NpdGVFeHByZXNzaW9ucyIsImkiLCJuZWdhdGVkRXhwcmVzc2lvbiIsIm5vdCIsImoiLCJhbmQiLCJtYXAiLCJ3cmFwUHJpbWl0aXZlIiwiaXNTdGF0aWNGYWxzZSIsIm5vblRyaXZpYWxFeHByZXNzaW9uIiwiZmlsdGVyIiwiaXNDb25zdGFudCIsImNvbnN0YW50IiwiaXNWYWxpZCIsIm9yIiwiaXNTdGF0aWNUcnVlIiwiaXNDb21wYXJpc29uIiwiZXF1YWwiLCJncmVhdGVyT3JFcXVhbCIsImdyZWF0ZXJUaGFuIiwibm90RXF1YWwiLCJsZXNzT3JFcXVhbCIsImxlc3NUaGFuIiwiaXNUcnV0aHkiLCJiaW5kaW5nRXhwcmVzc2lvbiIsInZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMiLCJwYXRoVmlzaXRvciIsInRhcmdldFBhdGgiLCJsb2NhbFBhdGgiLCJjb25jYXQiLCJqb2luIiwiY29uc3RhbnRWYWx1ZSIsIkFycmF5IiwiaXNBcnJheSIsImlzUHJpbWl0aXZlT2JqZWN0IiwidmFsdWVPZiIsInZhbCIsIk9iamVjdCIsImtleXMiLCJrZXkiLCJyZXNvbHZlQmluZGluZ1N0cmluZyIsInRhcmdldFR5cGUiLCJzdGFydHNXaXRoIiwiaXNFeHByZXNzaW9uIiwic29tZXRoaW5nIiwibWF5YmVDb25zdGFudCIsImlzQmluZGluZyIsIm1heWJlQmluZGluZyIsIm9iamVjdFR5cGUiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJpc0NvbXBsZXhBbm5vdGF0aW9uRXhwcmVzc2lvbiIsImFubm90YXRpb25FeHByZXNzaW9uIiwiZGVmYXVsdFZhbHVlIiwiYW5ub3RhdGlvbklmRXhwcmVzc2lvbiIsIklmIiwicGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uIiwiTm90IiwiRXEiLCJOZSIsIkd0IiwiR2UiLCJMdCIsIkxlIiwiT3IiLCJvckNvbmRpdGlvbiIsIkFuZCIsImFuZENvbmRpdGlvbiIsImFubm90YXRpb25BcHBseUV4cHJlc3Npb24iLCJhbm5vdGF0aW9uVmFsdWUiLCJoYXNPd25Qcm9wZXJ0eSIsIiRPciIsIiRBbmQiLCIkTm90IiwiJEVxIiwiJE5lIiwiJEd0IiwiJEdlIiwiJEx0IiwiJExlIiwiJFBhdGgiLCJGdW5jdGlvbiIsIiRGdW5jdGlvbiIsIkFwcGx5IiwiJEFwcGx5IiwiJElmIiwicmVzb2x2ZUVudW1WYWx1ZSIsIiRFbnVtTWVtYmVyIiwiaWZFbHNlIiwiYXBwbHlQYXJhbSIsImFwcGx5UGFyYW1Db252ZXJ0ZWQiLCJjb21wYXJpc29uIiwibGVmdE9wZXJhbmQiLCJyaWdodE9wZXJhbmQiLCJsZWZ0RXhwcmVzc2lvbiIsInJpZ2h0RXhwcmVzc2lvbiIsImNvbmRpdGlvbkV4cHJlc3Npb24iLCJvblRydWVFeHByZXNzaW9uIiwib25GYWxzZUV4cHJlc3Npb24iLCJoYXNSZWZlcmVuY2VUb0RlZmF1bHRDb250ZXh0IiwiZm9ybWF0UmVzdWx0IiwiZm9ybWF0dGVyRnVuY3Rpb24iLCJjb250ZXh0RW50aXR5VHlwZSIsInBhcmFtZXRlckV4cHJlc3Npb25zIiwiX19mdW5jdGlvbk5hbWUiLCJzcGxpdCIsImZvcm1hdHRlckNsYXNzIiwiZm9ybWF0dGVyTmFtZSIsInVuc2hpZnQiLCJhZGRUeXBlSW5mb3JtYXRpb24iLCJvRm9ybWF0T3B0aW9ucyIsImluZGV4T2YiLCJwYXJzZUFzU3RyaW5nIiwiZW1wdHlTdHJpbmciLCJmb3JtYXRPcHRpb25zIiwib24iLCJmdW5jdGlvbk5hbWUiLCJpc0VtcHR5IiwiaW5FeHByZXNzaW9ucyIsImNvbmNhdGVuYXRlZCIsInRvU3RyaW5nIiwidHJhbnNmb3JtUmVjdXJzaXZlbHkiLCJpbkV4cHJlc3Npb24iLCJleHByZXNzaW9uVHlwZSIsInRyYW5zZm9ybUZ1bmN0aW9uIiwiaW5jbHVkZUFsbEV4cHJlc3Npb24iLCJjb21waWxlQmluZGluZyIsImVtYmVkZGVkSW5CaW5kaW5nIiwia2VlcFRhcmdldFR5cGUiLCJlbWJlZGRlZFNlcGFyYXRvciIsIm91dFByb3BlcnR5IiwiZW50cmllcyIsIm8iLCJwcm9wZXJ0aWVzIiwiYXJndW1lbnRTdHJpbmciLCJhcmciLCJzdWJzdHIiLCJvdXRCaW5kaW5nIiwiY29uc3RyYWludHMiLCJjb21wYXJpc29uUGFydCIsImNvbXBpbGVQYXRoUGFyYW1ldGVyIiwicGFyYW0iLCJvdXRwdXRFbmQiLCJzaW5nbGVQYXRoIiwib3V0VmFsdWUiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBLTyxNQUFNQSx1QkFBdUQsR0FBRztBQUN0RUMsSUFBQUEsS0FBSyxFQUFFO0FBRCtELEdBQWhFOzs7QUFJUCxXQUFTQyxrQkFBVCxD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LFdBQXZCLEVBQW9DekssTUFBcEMsR0FBNkMsQ0FBM0UsRUFBOEU7QUFDN0UrSyxVQUFBQSxRQUFRLDZCQUFzQmxCLGNBQWMsQ0FBQzNKLFVBQVUsQ0FBQ3VLLFdBQVosQ0FBcEMsQ0FBUjtBQUNBOztBQUNELFlBQUl2SyxVQUFVLENBQUMrSSxhQUFYLElBQTRCN0UsTUFBTSxDQUFDQyxJQUFQLENBQVluRSxVQUFVLENBQUMrSSxhQUF2QixFQUFzQ2pKLE1BQXRDLEdBQStDLENBQS9FLEVBQWtGO0FBQ2pGK0ssVUFBQUEsUUFBUSwrQkFBd0JsQixjQUFjLENBQUMzSixVQUFVLENBQUMrSSxhQUFaLENBQXRDLENBQVI7QUFDQTs7QUFDRCxZQUFJL0ksVUFBVSxDQUFDZSxVQUFYLElBQXlCbUQsTUFBTSxDQUFDQyxJQUFQLENBQVluRSxVQUFVLENBQUNlLFVBQXZCLEVBQW1DakIsTUFBbkMsR0FBNEMsQ0FBekUsRUFBNEU7QUFDM0UrSyxVQUFBQSxRQUFRLDRCQUFxQmxCLGNBQWMsQ0FBQzNKLFVBQVUsQ0FBQ2UsVUFBWixDQUFuQyxDQUFSO0FBQ0E7O0FBQ0QsWUFBSTZKLFVBQUosRUFBZ0I7QUFDZixpQkFBT0MsUUFBUDtBQUNBOztBQUNELDBCQUFXQSxRQUFYOztBQUNEO0FBQ0MsZUFBTyxFQUFQO0FBN0NGO0FBK0NBIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRBbmRBbm5vdGF0aW9uRXhwcmVzc2lvbixcblx0QW5kQ29uZGl0aW9uYWxFeHByZXNzaW9uLFxuXHRDb25kaXRpb25hbENoZWNrT3JWYWx1ZSxcblx0RW50aXR5VHlwZSxcblx0RXFBbm5vdGF0aW9uRXhwcmVzc2lvbixcblx0RXFDb25kaXRpb25hbEV4cHJlc3Npb24sXG5cdEdlQW5ub3RhdGlvbkV4cHJlc3Npb24sXG5cdEdlQ29uZGl0aW9uYWxFeHByZXNzaW9uLFxuXHRHdEFubm90YXRpb25FeHByZXNzaW9uLFxuXHRHdENvbmRpdGlvbmFsRXhwcmVzc2lvbixcblx0SWZBbm5vdGF0aW9uRXhwcmVzc2lvbixcblx0SWZBbm5vdGF0aW9uRXhwcmVzc2lvblZhbHVlLFxuXHRMZUFubm90YXRpb25FeHByZXNzaW9uLFxuXHRMZUNvbmRpdGlvbmFsRXhwcmVzc2lvbixcblx0THRBbm5vdGF0aW9uRXhwcmVzc2lvbixcblx0THRDb25kaXRpb25hbEV4cHJlc3Npb24sXG5cdE5lQW5ub3RhdGlvbkV4cHJlc3Npb24sXG5cdE5lQ29uZGl0aW9uYWxFeHByZXNzaW9uLFxuXHROb3RBbm5vdGF0aW9uRXhwcmVzc2lvbixcblx0Tm90Q29uZGl0aW9uYWxFeHByZXNzaW9uLFxuXHRPckFubm90YXRpb25FeHByZXNzaW9uLFxuXHRPckNvbmRpdGlvbmFsRXhwcmVzc2lvbixcblx0UGF0aENvbmRpdGlvbkV4cHJlc3Npb24sXG5cdFByb3BlcnR5QW5ub3RhdGlvblZhbHVlXG59IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHsgQXBwbHlBbm5vdGF0aW9uRXhwcmVzc2lvbiwgUGF0aEFubm90YXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL3R5cGVzL0VkbVwiO1xuaW1wb3J0IHsgRW50aXR5U2V0IH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL2Rpc3QvQ29udmVydGVyXCI7XG5pbXBvcnQgeyByZXNvbHZlRW51bVZhbHVlIH0gZnJvbSBcIi4vQW5ub3RhdGlvbkVudW1cIjtcblxudHlwZSBQcmltaXRpdmVUeXBlID0gc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IG9iamVjdCB8IG51bGwgfCB1bmRlZmluZWQ7XG5cbnR5cGUgQmFzZUV4cHJlc3Npb248VD4gPSB7XG5cdF90eXBlOiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBDb25zdGFudEV4cHJlc3Npb248VD4gPSBCYXNlRXhwcmVzc2lvbjxUPiAmIHtcblx0X3R5cGU6IFwiQ29uc3RhbnRcIjtcblx0dmFsdWU6IFQ7XG59O1xuXG50eXBlIFNldE9wZXJhdG9yID0gXCImJlwiIHwgXCJ8fFwiO1xuZXhwb3J0IHR5cGUgU2V0RXhwcmVzc2lvbiA9IEJhc2VFeHByZXNzaW9uPGJvb2xlYW4+ICYge1xuXHRfdHlwZTogXCJTZXRcIjtcblx0b3BlcmF0b3I6IFNldE9wZXJhdG9yO1xuXHRvcGVyYW5kczogRXhwcmVzc2lvbjxib29sZWFuPltdO1xufTtcblxuZXhwb3J0IHR5cGUgTm90RXhwcmVzc2lvbiA9IEJhc2VFeHByZXNzaW9uPGJvb2xlYW4+ICYge1xuXHRfdHlwZTogXCJOb3RcIjtcblx0b3BlcmFuZDogRXhwcmVzc2lvbjxib29sZWFuPjtcbn07XG5cbmV4cG9ydCB0eXBlIFRydXRoeUV4cHJlc3Npb24gPSBCYXNlRXhwcmVzc2lvbjxib29sZWFuPiAmIHtcblx0X3R5cGU6IFwiVHJ1dGh5XCI7XG5cdG9wZXJhbmQ6IEV4cHJlc3Npb248c3RyaW5nPjtcbn07XG5cbmV4cG9ydCB0eXBlIFJlZmVyZW5jZUV4cHJlc3Npb24gPSBCYXNlRXhwcmVzc2lvbjxvYmplY3Q+ICYge1xuXHRfdHlwZTogXCJSZWZcIjtcblx0cmVmOiBzdHJpbmcgfCBudWxsO1xufTtcblxuZXhwb3J0IHR5cGUgRm9ybWF0dGVyRXhwcmVzc2lvbjxUPiA9IEJhc2VFeHByZXNzaW9uPFQ+ICYge1xuXHRfdHlwZTogXCJGb3JtYXR0ZXJcIjtcblx0Zm46IHN0cmluZztcblx0cGFyYW1ldGVyczogRXhwcmVzc2lvbjxhbnk+W107XG59O1xuXG5leHBvcnQgdHlwZSBDb21wbGV4VHlwZUV4cHJlc3Npb248VD4gPSBCYXNlRXhwcmVzc2lvbjxUPiAmIHtcblx0X3R5cGU6IFwiQ29tcGxleFR5cGVcIjtcblx0dHlwZTogc3RyaW5nO1xuXHRmb3JtYXRPcHRpb25zOiBvYmplY3Q7XG5cdHBhcmFtZXRlcnM6IG9iamVjdDtcblx0YmluZGluZ1BhcmFtZXRlcnM6IEV4cHJlc3Npb248YW55PltdO1xufTtcblxuZXhwb3J0IHR5cGUgRnVuY3Rpb25FeHByZXNzaW9uPFQ+ID0gQmFzZUV4cHJlc3Npb248VD4gJiB7XG5cdF90eXBlOiBcIkZ1bmN0aW9uXCI7XG5cdG9iaj86IEV4cHJlc3Npb248b2JqZWN0Pjtcblx0Zm46IHN0cmluZztcblx0cGFyYW1ldGVyczogRXhwcmVzc2lvbjxhbnk+W107XG59O1xuXG5leHBvcnQgdHlwZSBDb25jYXRFeHByZXNzaW9uID0gQmFzZUV4cHJlc3Npb248c3RyaW5nPiAmIHtcblx0X3R5cGU6IFwiQ29uY2F0XCI7XG5cdGV4cHJlc3Npb25zOiBFeHByZXNzaW9uPHN0cmluZz5bXTtcbn07XG5cbmV4cG9ydCB0eXBlIFVucmVzb2x2ZWFibGVCaW5kaW5nRXhwcmVzc2lvbiA9IEJhc2VFeHByZXNzaW9uPHN0cmluZz4gJiB7XG5cdF90eXBlOiBcIlVucmVzb2x2ZWFibGVcIjtcbn07XG5cbi8qKlxuICogQHR5cGVkZWYgQmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uXG4gKi9cbmV4cG9ydCB0eXBlIEJpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvbjxUPiA9IEJhc2VFeHByZXNzaW9uPFQ+ICYge1xuXHRfdHlwZTogXCJCaW5kaW5nXCI7XG5cdG1vZGVsTmFtZT86IHN0cmluZztcblx0cGF0aDogc3RyaW5nO1xuXHR0YXJnZXRFbnRpdHlTZXQ/OiBFbnRpdHlTZXQ7XG5cdHR5cGU/OiBzdHJpbmc7XG5cdGNvbnN0cmFpbnRzPzogYW55O1xuXHRwYXJhbWV0ZXJzPzogYW55O1xuXHR0YXJnZXRUeXBlPzogc3RyaW5nO1xuXHRmb3JtYXRPcHRpb25zPzogYW55O1xufTtcblxuZXhwb3J0IHR5cGUgRGVmYXVsdEJpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvbjxUPiA9IEJhc2VFeHByZXNzaW9uPFQ+ICYge1xuXHRfdHlwZTogXCJEZWZhdWx0QmluZGluZ1wiO1xuXHRtb2RlbE5hbWU/OiBzdHJpbmc7XG5cdHBhdGg6IHN0cmluZztcblx0dHlwZT86IHN0cmluZztcblx0Y29uc3RyYWludHM/OiBvYmplY3Q7XG5cdHBhcmFtZXRlcnM/OiBhbnk7XG5cdHRhcmdldFR5cGU/OiBzdHJpbmc7XG5cdGZvcm1hdE9wdGlvbnM/OiBvYmplY3Q7XG59O1xuXG5leHBvcnQgdHlwZSBFbWJlZGRlZEJpbmRpbmdFeHByZXNzaW9uPFQ+ID0gQmFzZUV4cHJlc3Npb248VD4gJiB7XG5cdF90eXBlOiBcIkVtYmVkZGVkQmluZGluZ1wiO1xuXHR2YWx1ZTogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgRW1iZWRkZWRFeHByZXNzaW9uQmluZGluZ0V4cHJlc3Npb248VD4gPSBCYXNlRXhwcmVzc2lvbjxUPiAmIHtcblx0X3R5cGU6IFwiRW1iZWRkZWRFeHByZXNzaW9uQmluZGluZ1wiO1xuXHR2YWx1ZTogc3RyaW5nO1xufTtcblxudHlwZSBDb21wYXJpc29uT3BlcmF0b3IgPSBcIj09PVwiIHwgXCIhPT1cIiB8IFwiPj1cIiB8IFwiPlwiIHwgXCI8PVwiIHwgXCI8XCI7XG5leHBvcnQgdHlwZSBDb21wYXJpc29uRXhwcmVzc2lvbiA9IEJhc2VFeHByZXNzaW9uPGJvb2xlYW4+ICYge1xuXHRfdHlwZTogXCJDb21wYXJpc29uXCI7XG5cdG9wZXJhdG9yOiBDb21wYXJpc29uT3BlcmF0b3I7XG5cdG9wZXJhbmQxOiBFeHByZXNzaW9uPGFueT47XG5cdG9wZXJhbmQyOiBFeHByZXNzaW9uPGFueT47XG59O1xuXG5leHBvcnQgdHlwZSBJZkVsc2VFeHByZXNzaW9uPFQ+ID0gQmFzZUV4cHJlc3Npb248VD4gJiB7XG5cdF90eXBlOiBcIklmRWxzZVwiO1xuXHRjb25kaXRpb246IEV4cHJlc3Npb248Ym9vbGVhbj47XG5cdG9uVHJ1ZTogRXhwcmVzc2lvbjxUPjtcblx0b25GYWxzZTogRXhwcmVzc2lvbjxUPjtcbn07XG5cbi8qKlxuICogQW4gZXhwcmVzc2lvbiB0aGF0IGV2YWx1YXRlcyB0byB0eXBlIFQuXG4gKlxuICogQHR5cGVkZWYgRXhwcmVzc2lvblxuICovXG5leHBvcnQgdHlwZSBFeHByZXNzaW9uPFQ+ID1cblx0fCBVbnJlc29sdmVhYmxlQmluZGluZ0V4cHJlc3Npb25cblx0fCBDb25zdGFudEV4cHJlc3Npb248VD5cblx0fCBTZXRFeHByZXNzaW9uXG5cdHwgTm90RXhwcmVzc2lvblxuXHR8IFRydXRoeUV4cHJlc3Npb25cblx0fCBDb25jYXRFeHByZXNzaW9uXG5cdHwgQmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uPFQ+XG5cdHwgRW1iZWRkZWRCaW5kaW5nRXhwcmVzc2lvbjxUPlxuXHR8IEVtYmVkZGVkRXhwcmVzc2lvbkJpbmRpbmdFeHByZXNzaW9uPFQ+XG5cdHwgRGVmYXVsdEJpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvbjxUPlxuXHR8IENvbXBhcmlzb25FeHByZXNzaW9uXG5cdHwgSWZFbHNlRXhwcmVzc2lvbjxUPlxuXHR8IEZvcm1hdHRlckV4cHJlc3Npb248VD5cblx0fCBDb21wbGV4VHlwZUV4cHJlc3Npb248VD5cblx0fCBSZWZlcmVuY2VFeHByZXNzaW9uXG5cdHwgRnVuY3Rpb25FeHByZXNzaW9uPFQ+O1xuXG4vKipcbiAqIEFuIGV4cHJlc3Npb24gdGhhdCBldmFsdWF0ZXMgdG8gdHlwZSBULCBvciBhIGNvbnN0YW50IHZhbHVlIG9mIHR5cGUgVFxuICovXG5leHBvcnQgdHlwZSBFeHByZXNzaW9uT3JQcmltaXRpdmU8VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+ID0gRXhwcmVzc2lvbjxUPiB8IFQ7XG5cbmV4cG9ydCBjb25zdCB1bnJlc29sdmVhYmxlRXhwcmVzc2lvbjogVW5yZXNvbHZlYWJsZUJpbmRpbmdFeHByZXNzaW9uID0ge1xuXHRfdHlwZTogXCJVbnJlc29sdmVhYmxlXCJcbn07XG5cbmZ1bmN0aW9uIGVzY2FwZVhtbEF0dHJpYnV0ZShpbnB1dFN0cmluZzogc3RyaW5nKSB7XG5cdHJldHVybiBpbnB1dFN0cmluZy5yZXBsYWNlKC9bJ10vZywgZnVuY3Rpb24oYzogc3RyaW5nKSB7XG5cdFx0c3dpdGNoIChjKSB7XG5cdFx0XHRjYXNlIFwiJ1wiOlxuXHRcdFx0XHRyZXR1cm4gXCJcXFxcJ1wiO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuIGM7XG5cdFx0fVxuXHR9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc1VucmVzb2x2ZWFibGVFeHByZXNzaW9uKC4uLmV4cHJlc3Npb25zOiBFeHByZXNzaW9uPGFueT5bXSk6IGJvb2xlYW4ge1xuXHRyZXR1cm4gZXhwcmVzc2lvbnMuZmluZChleHByID0+IGV4cHIuX3R5cGUgPT09IFwiVW5yZXNvbHZlYWJsZVwiKSAhPT0gdW5kZWZpbmVkO1xufVxuLyoqXG4gKiBDaGVjayB0d28gZXhwcmVzc2lvbnMgZm9yIChkZWVwKSBlcXVhbGl0eS5cbiAqXG4gKiBAcGFyYW0gYVxuICogQHBhcmFtIGJcbiAqIEByZXR1cm5zIHtib29sZWFufSBgdHJ1ZWAgaWYgdGhlIHR3byBleHByZXNzaW9ucyBhcmUgZXF1YWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9jaGVja0V4cHJlc3Npb25zQXJlRXF1YWw8VD4oYTogRXhwcmVzc2lvbjxUPiwgYjogRXhwcmVzc2lvbjxUPik6IGJvb2xlYW4ge1xuXHRpZiAoYS5fdHlwZSAhPT0gYi5fdHlwZSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHN3aXRjaCAoYS5fdHlwZSkge1xuXHRcdGNhc2UgXCJVbnJlc29sdmVhYmxlXCI6XG5cdFx0XHRyZXR1cm4gZmFsc2U7IC8vIFVucmVzb2x2ZWFibGUgaXMgbmV2ZXIgZXF1YWwgdG8gYW55dGhpbmcgZXZlbiBpdHNlbGZcblx0XHRjYXNlIFwiQ29uc3RhbnRcIjpcblx0XHRjYXNlIFwiRW1iZWRkZWRCaW5kaW5nXCI6XG5cdFx0Y2FzZSBcIkVtYmVkZGVkRXhwcmVzc2lvbkJpbmRpbmdcIjpcblx0XHRcdHJldHVybiBhLnZhbHVlID09PSAoYiBhcyBDb25zdGFudEV4cHJlc3Npb248VD4pLnZhbHVlO1xuXG5cdFx0Y2FzZSBcIk5vdFwiOlxuXHRcdFx0cmV0dXJuIF9jaGVja0V4cHJlc3Npb25zQXJlRXF1YWwoYS5vcGVyYW5kLCAoYiBhcyBOb3RFeHByZXNzaW9uKS5vcGVyYW5kKTtcblx0XHRjYXNlIFwiVHJ1dGh5XCI6XG5cdFx0XHRyZXR1cm4gX2NoZWNrRXhwcmVzc2lvbnNBcmVFcXVhbChhLm9wZXJhbmQsIChiIGFzIFRydXRoeUV4cHJlc3Npb24pLm9wZXJhbmQpO1xuXHRcdGNhc2UgXCJTZXRcIjpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdGEub3BlcmF0b3IgPT09IChiIGFzIFNldEV4cHJlc3Npb24pLm9wZXJhdG9yICYmXG5cdFx0XHRcdGEub3BlcmFuZHMubGVuZ3RoID09PSAoYiBhcyBTZXRFeHByZXNzaW9uKS5vcGVyYW5kcy5sZW5ndGggJiZcblx0XHRcdFx0YS5vcGVyYW5kcy5ldmVyeShleHByZXNzaW9uID0+XG5cdFx0XHRcdFx0KGIgYXMgU2V0RXhwcmVzc2lvbikub3BlcmFuZHMuc29tZShvdGhlckV4cHJlc3Npb24gPT4gX2NoZWNrRXhwcmVzc2lvbnNBcmVFcXVhbChleHByZXNzaW9uLCBvdGhlckV4cHJlc3Npb24pKVxuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXG5cdFx0Y2FzZSBcIklmRWxzZVwiOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0X2NoZWNrRXhwcmVzc2lvbnNBcmVFcXVhbChhLmNvbmRpdGlvbiwgKGIgYXMgSWZFbHNlRXhwcmVzc2lvbjxUPikuY29uZGl0aW9uKSAmJlxuXHRcdFx0XHRfY2hlY2tFeHByZXNzaW9uc0FyZUVxdWFsKGEub25UcnVlLCAoYiBhcyBJZkVsc2VFeHByZXNzaW9uPFQ+KS5vblRydWUpICYmXG5cdFx0XHRcdF9jaGVja0V4cHJlc3Npb25zQXJlRXF1YWwoYS5vbkZhbHNlLCAoYiBhcyBJZkVsc2VFeHByZXNzaW9uPFQ+KS5vbkZhbHNlKVxuXHRcdFx0KTtcblxuXHRcdGNhc2UgXCJDb21wYXJpc29uXCI6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRhLm9wZXJhdG9yID09IChiIGFzIENvbXBhcmlzb25FeHByZXNzaW9uKS5vcGVyYXRvciAmJlxuXHRcdFx0XHRfY2hlY2tFeHByZXNzaW9uc0FyZUVxdWFsKGEub3BlcmFuZDEsIChiIGFzIENvbXBhcmlzb25FeHByZXNzaW9uKS5vcGVyYW5kMSkgJiZcblx0XHRcdFx0X2NoZWNrRXhwcmVzc2lvbnNBcmVFcXVhbChhLm9wZXJhbmQyLCAoYiBhcyBDb21wYXJpc29uRXhwcmVzc2lvbikub3BlcmFuZDIpXG5cdFx0XHQpO1xuXG5cdFx0Y2FzZSBcIkNvbmNhdFwiOlxuXHRcdFx0Y29uc3QgYUV4cHJlc3Npb25zID0gYS5leHByZXNzaW9ucztcblx0XHRcdGNvbnN0IGJFeHByZXNzaW9ucyA9IChiIGFzIENvbmNhdEV4cHJlc3Npb24pLmV4cHJlc3Npb25zO1xuXHRcdFx0aWYgKGFFeHByZXNzaW9ucy5sZW5ndGggIT09IGJFeHByZXNzaW9ucy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGFFeHByZXNzaW9ucy5ldmVyeSgoZXhwcmVzc2lvbiwgaW5kZXgpID0+IHtcblx0XHRcdFx0cmV0dXJuIF9jaGVja0V4cHJlc3Npb25zQXJlRXF1YWwoZXhwcmVzc2lvbiwgYkV4cHJlc3Npb25zW2luZGV4XSk7XG5cdFx0XHR9KTtcblxuXHRcdGNhc2UgXCJCaW5kaW5nXCI6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRhLm1vZGVsTmFtZSA9PT0gKGIgYXMgQmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uPFQ+KS5tb2RlbE5hbWUgJiZcblx0XHRcdFx0YS5wYXRoID09PSAoYiBhcyBCaW5kaW5nRXhwcmVzc2lvbkV4cHJlc3Npb248VD4pLnBhdGggJiZcblx0XHRcdFx0YS50YXJnZXRFbnRpdHlTZXQgPT09IChiIGFzIEJpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvbjxUPikudGFyZ2V0RW50aXR5U2V0XG5cdFx0XHQpO1xuXG5cdFx0Y2FzZSBcIkRlZmF1bHRCaW5kaW5nXCI6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRhLm1vZGVsTmFtZSA9PT0gKGIgYXMgRGVmYXVsdEJpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvbjxUPikubW9kZWxOYW1lICYmXG5cdFx0XHRcdGEucGF0aCA9PT0gKGIgYXMgRGVmYXVsdEJpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvbjxUPikucGF0aFxuXHRcdFx0KTtcblxuXHRcdGNhc2UgXCJGb3JtYXR0ZXJcIjpcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdGEuZm4gPT09IChiIGFzIEZvcm1hdHRlckV4cHJlc3Npb248VD4pLmZuICYmXG5cdFx0XHRcdGEucGFyYW1ldGVycy5sZW5ndGggPT09IChiIGFzIEZvcm1hdHRlckV4cHJlc3Npb248VD4pLnBhcmFtZXRlcnMubGVuZ3RoICYmXG5cdFx0XHRcdGEucGFyYW1ldGVycy5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiBfY2hlY2tFeHByZXNzaW9uc0FyZUVxdWFsKChiIGFzIEZvcm1hdHRlckV4cHJlc3Npb248VD4pLnBhcmFtZXRlcnNbaW5kZXhdLCB2YWx1ZSkpXG5cdFx0XHQpO1xuXHRcdGNhc2UgXCJDb21wbGV4VHlwZVwiOlxuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0YS50eXBlID09PSAoYiBhcyBDb21wbGV4VHlwZUV4cHJlc3Npb248VD4pLnR5cGUgJiZcblx0XHRcdFx0YS5iaW5kaW5nUGFyYW1ldGVycy5sZW5ndGggPT09IChiIGFzIENvbXBsZXhUeXBlRXhwcmVzc2lvbjxUPikuYmluZGluZ1BhcmFtZXRlcnMubGVuZ3RoICYmXG5cdFx0XHRcdGEuYmluZGluZ1BhcmFtZXRlcnMuZXZlcnkoKHZhbHVlLCBpbmRleCkgPT5cblx0XHRcdFx0XHRfY2hlY2tFeHByZXNzaW9uc0FyZUVxdWFsKChiIGFzIENvbXBsZXhUeXBlRXhwcmVzc2lvbjxUPikuYmluZGluZ1BhcmFtZXRlcnNbaW5kZXhdLCB2YWx1ZSlcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0XHRjYXNlIFwiRnVuY3Rpb25cIjpcblx0XHRcdGNvbnN0IG90aGVyRnVuY3Rpb24gPSBiIGFzIEZ1bmN0aW9uRXhwcmVzc2lvbjxUPjtcblx0XHRcdGlmIChhLm9iaiA9PT0gdW5kZWZpbmVkIHx8IG90aGVyRnVuY3Rpb24ub2JqID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cmV0dXJuIGEub2JqID09PSBvdGhlckZ1bmN0aW9uO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRhLmZuID09PSBvdGhlckZ1bmN0aW9uLmZuICYmXG5cdFx0XHRcdF9jaGVja0V4cHJlc3Npb25zQXJlRXF1YWwoYS5vYmosIG90aGVyRnVuY3Rpb24ub2JqKSAmJlxuXHRcdFx0XHRhLnBhcmFtZXRlcnMubGVuZ3RoID09PSBvdGhlckZ1bmN0aW9uLnBhcmFtZXRlcnMubGVuZ3RoICYmXG5cdFx0XHRcdGEucGFyYW1ldGVycy5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiBfY2hlY2tFeHByZXNzaW9uc0FyZUVxdWFsKG90aGVyRnVuY3Rpb24ucGFyYW1ldGVyc1tpbmRleF0sIHZhbHVlKSlcblx0XHRcdCk7XG5cblx0XHRjYXNlIFwiUmVmXCI6XG5cdFx0XHRyZXR1cm4gYS5yZWYgPT09IChiIGFzIFJlZmVyZW5jZUV4cHJlc3Npb24pLnJlZjtcblx0fVxufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgbmVzdGVkIFNldEV4cHJlc3Npb24gYnkgaW5saW5pbmcgb3BlcmFuZHMgb2YgdHlwZSBTZXRFeHByZXNzaW9uIHdpdGggdGhlIHNhbWUgb3BlcmF0b3IuXG4gKlxuICogQHBhcmFtIGV4cHJlc3Npb24gVGhlIGV4cHJlc3Npb24gdG8gZmxhdHRlblxuICogQHJldHVybnMge1NldEV4cHJlc3Npb259IEEgbmV3IFNldEV4cHJlc3Npb24gd2l0aCB0aGUgc2FtZSBvcGVyYXRvclxuICovXG5mdW5jdGlvbiBmbGF0dGVuU2V0RXhwcmVzc2lvbihleHByZXNzaW9uOiBTZXRFeHByZXNzaW9uKTogU2V0RXhwcmVzc2lvbiB7XG5cdHJldHVybiBleHByZXNzaW9uLm9wZXJhbmRzLnJlZHVjZShcblx0XHQocmVzdWx0OiBTZXRFeHByZXNzaW9uLCBvcGVyYW5kKSA9PiB7XG5cdFx0XHRjb25zdCBjYW5kaWRhdGVzRm9yRmxhdHRlbmluZyA9XG5cdFx0XHRcdG9wZXJhbmQuX3R5cGUgPT09IFwiU2V0XCIgJiYgb3BlcmFuZC5vcGVyYXRvciA9PT0gZXhwcmVzc2lvbi5vcGVyYXRvciA/IG9wZXJhbmQub3BlcmFuZHMgOiBbb3BlcmFuZF07XG5cdFx0XHRjYW5kaWRhdGVzRm9yRmxhdHRlbmluZy5mb3JFYWNoKGNhbmRpZGF0ZSA9PiB7XG5cdFx0XHRcdGlmIChyZXN1bHQub3BlcmFuZHMuZXZlcnkoZSA9PiAhX2NoZWNrRXhwcmVzc2lvbnNBcmVFcXVhbChlLCBjYW5kaWRhdGUpKSkge1xuXHRcdFx0XHRcdHJlc3VsdC5vcGVyYW5kcy5wdXNoKGNhbmRpZGF0ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9LFxuXHRcdHsgX3R5cGU6IFwiU2V0XCIsIG9wZXJhdG9yOiBleHByZXNzaW9uLm9wZXJhdG9yLCBvcGVyYW5kczogW10gfVxuXHQpO1xufVxuXG4vKipcbiAqIERldGVjdHMgd2hldGhlciBhbiBhcnJheSBvZiBib29sZWFuIGV4cHJlc3Npb25zIGNvbnRhaW5zIGFuIGV4cHJlc3Npb24gYW5kIGl0cyBuZWdhdGlvbi5cbiAqXG4gKiBAcGFyYW0gZXhwcmVzc2lvbnMgQXJyYXkgb2YgZXhwcmVzc2lvbnNcbiAqIEByZXR1cm5zIHtib29sZWFufSBgdHJ1ZWAgaWYgdGhlIHNldCBvZiBleHByZXNzaW9ucyBjb250YWlucyBhbiBleHByZXNzaW9uIGFuZCBpdHMgbmVnYXRpb25cbiAqL1xuZnVuY3Rpb24gaGFzT3Bwb3NpdGVFeHByZXNzaW9ucyhleHByZXNzaW9uczogRXhwcmVzc2lvbjxib29sZWFuPltdKTogYm9vbGVhbiB7XG5cdGlmIChleHByZXNzaW9ucy5sZW5ndGggPCAyKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0bGV0IGkgPSBleHByZXNzaW9ucy5sZW5ndGg7XG5cdHdoaWxlIChpLS0pIHtcblx0XHRjb25zdCBleHByZXNzaW9uID0gZXhwcmVzc2lvbnNbaV07XG5cdFx0Y29uc3QgbmVnYXRlZEV4cHJlc3Npb24gPSBub3QoZXhwcmVzc2lvbik7XG5cdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBpOyBqKyspIHtcblx0XHRcdGlmIChfY2hlY2tFeHByZXNzaW9uc0FyZUVxdWFsKGV4cHJlc3Npb25zW2pdLCBuZWdhdGVkRXhwcmVzc2lvbikpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBMb2dpY2FsIGBhbmRgIGV4cHJlc3Npb24uXG4gKlxuICogVGhlIGV4cHJlc3Npb24gaXMgc2ltcGxpZmllZCB0byBmYWxzZSBpZiB0aGlzIGNhbiBiZSBkZWNpZGVkIHN0YXRpY2FsbHkgKHRoYXQgaXMsIGlmIG9uZSBvcGVyYW5kIGlzIGEgY29uc3RhbnRcbiAqIGZhbHNlIG9yIGlmIHRoZSBleHByZXNzaW9uIGNvbnRhaW5zIGFuIG9wZXJhbmQgYW5kIGl0cyBuZWdhdGlvbikuXG4gKlxuICogQHBhcmFtIG9wZXJhbmRzIEV4cHJlc3Npb25zIHRvIGNvbm5lY3QgYnkgYGFuZGBcbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uPGJvb2xlYW4+fSBFeHByZXNzaW9uIGV2YWx1YXRpbmcgdG8gYm9vbGVhblxuICovXG5leHBvcnQgZnVuY3Rpb24gYW5kKC4uLm9wZXJhbmRzOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8Ym9vbGVhbj5bXSk6IEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRjb25zdCBleHByZXNzaW9ucyA9IGZsYXR0ZW5TZXRFeHByZXNzaW9uKHtcblx0XHRfdHlwZTogXCJTZXRcIixcblx0XHRvcGVyYXRvcjogXCImJlwiLFxuXHRcdG9wZXJhbmRzOiBvcGVyYW5kcy5tYXAod3JhcFByaW1pdGl2ZSlcblx0fSkub3BlcmFuZHM7XG5cblx0aWYgKGhhc1VucmVzb2x2ZWFibGVFeHByZXNzaW9uKC4uLmV4cHJlc3Npb25zKSkge1xuXHRcdHJldHVybiB1bnJlc29sdmVhYmxlRXhwcmVzc2lvbjtcblx0fVxuXHRsZXQgaXNTdGF0aWNGYWxzZTogYm9vbGVhbiA9IGZhbHNlO1xuXHRjb25zdCBub25Ucml2aWFsRXhwcmVzc2lvbiA9IGV4cHJlc3Npb25zLmZpbHRlcihleHByZXNzaW9uID0+IHtcblx0XHRpZiAoaXNDb25zdGFudChleHByZXNzaW9uKSAmJiAhZXhwcmVzc2lvbi52YWx1ZSkge1xuXHRcdFx0aXNTdGF0aWNGYWxzZSA9IHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiAhaXNDb25zdGFudChleHByZXNzaW9uKTtcblx0fSk7XG5cdGlmIChpc1N0YXRpY0ZhbHNlKSB7XG5cdFx0cmV0dXJuIGNvbnN0YW50KGZhbHNlKTtcblx0fSBlbHNlIGlmIChub25Ucml2aWFsRXhwcmVzc2lvbi5sZW5ndGggPT09IDApIHtcblx0XHQvLyBSZXNvbHZlIHRoZSBjb25zdGFudCB0aGVuXG5cdFx0Y29uc3QgaXNWYWxpZCA9IGV4cHJlc3Npb25zLnJlZHVjZSgoaXNWYWxpZCwgZXhwcmVzc2lvbikgPT4ge1xuXHRcdFx0cmV0dXJuIGlzVmFsaWQgJiYgaXNDb25zdGFudChleHByZXNzaW9uKSAmJiBleHByZXNzaW9uLnZhbHVlO1xuXHRcdH0sIHRydWUpO1xuXHRcdHJldHVybiBjb25zdGFudChpc1ZhbGlkKTtcblx0fSBlbHNlIGlmIChub25Ucml2aWFsRXhwcmVzc2lvbi5sZW5ndGggPT09IDEpIHtcblx0XHRyZXR1cm4gbm9uVHJpdmlhbEV4cHJlc3Npb25bMF07XG5cdH0gZWxzZSBpZiAoaGFzT3Bwb3NpdGVFeHByZXNzaW9ucyhub25Ucml2aWFsRXhwcmVzc2lvbikpIHtcblx0XHRyZXR1cm4gY29uc3RhbnQoZmFsc2UpO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiB7XG5cdFx0XHRfdHlwZTogXCJTZXRcIixcblx0XHRcdG9wZXJhdG9yOiBcIiYmXCIsXG5cdFx0XHRvcGVyYW5kczogbm9uVHJpdmlhbEV4cHJlc3Npb25cblx0XHR9O1xuXHR9XG59XG5cbi8qKlxuICogTG9naWNhbCBgb3JgIGV4cHJlc3Npb24uXG4gKlxuICogVGhlIGV4cHJlc3Npb24gaXMgc2ltcGxpZmllZCB0byB0cnVlIGlmIHRoaXMgY2FuIGJlIGRlY2lkZWQgc3RhdGljYWxseSAodGhhdCBpcywgaWYgb25lIG9wZXJhbmQgaXMgYSBjb25zdGFudFxuICogdHJ1ZSBvciBpZiB0aGUgZXhwcmVzc2lvbiBjb250YWlucyBhbiBvcGVyYW5kIGFuZCBpdHMgbmVnYXRpb24pLlxuICpcbiAqIEBwYXJhbSBvcGVyYW5kcyBFeHByZXNzaW9ucyB0byBjb25uZWN0IGJ5IGBvcmBcbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uPGJvb2xlYW4+fSBFeHByZXNzaW9uIGV2YWx1YXRpbmcgdG8gYm9vbGVhblxuICovXG5leHBvcnQgZnVuY3Rpb24gb3IoLi4ub3BlcmFuZHM6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxib29sZWFuPltdKTogRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdGNvbnN0IGV4cHJlc3Npb25zID0gZmxhdHRlblNldEV4cHJlc3Npb24oe1xuXHRcdF90eXBlOiBcIlNldFwiLFxuXHRcdG9wZXJhdG9yOiBcInx8XCIsXG5cdFx0b3BlcmFuZHM6IG9wZXJhbmRzLm1hcCh3cmFwUHJpbWl0aXZlKVxuXHR9KS5vcGVyYW5kcztcblx0aWYgKGhhc1VucmVzb2x2ZWFibGVFeHByZXNzaW9uKC4uLmV4cHJlc3Npb25zKSkge1xuXHRcdHJldHVybiB1bnJlc29sdmVhYmxlRXhwcmVzc2lvbjtcblx0fVxuXHRsZXQgaXNTdGF0aWNUcnVlOiBib29sZWFuID0gZmFsc2U7XG5cdGNvbnN0IG5vblRyaXZpYWxFeHByZXNzaW9uID0gZXhwcmVzc2lvbnMuZmlsdGVyKGV4cHJlc3Npb24gPT4ge1xuXHRcdGlmIChpc0NvbnN0YW50KGV4cHJlc3Npb24pICYmIGV4cHJlc3Npb24udmFsdWUpIHtcblx0XHRcdGlzU3RhdGljVHJ1ZSA9IHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiAhaXNDb25zdGFudChleHByZXNzaW9uKSB8fCBleHByZXNzaW9uLnZhbHVlO1xuXHR9KTtcblx0aWYgKGlzU3RhdGljVHJ1ZSkge1xuXHRcdHJldHVybiBjb25zdGFudCh0cnVlKTtcblx0fSBlbHNlIGlmIChub25Ucml2aWFsRXhwcmVzc2lvbi5sZW5ndGggPT09IDApIHtcblx0XHQvLyBSZXNvbHZlIHRoZSBjb25zdGFudCB0aGVuXG5cdFx0Y29uc3QgaXNWYWxpZCA9IGV4cHJlc3Npb25zLnJlZHVjZSgoaXNWYWxpZCwgZXhwcmVzc2lvbikgPT4ge1xuXHRcdFx0cmV0dXJuIGlzVmFsaWQgJiYgaXNDb25zdGFudChleHByZXNzaW9uKSAmJiBleHByZXNzaW9uLnZhbHVlO1xuXHRcdH0sIHRydWUpO1xuXHRcdHJldHVybiBjb25zdGFudChpc1ZhbGlkKTtcblx0fSBlbHNlIGlmIChub25Ucml2aWFsRXhwcmVzc2lvbi5sZW5ndGggPT09IDEpIHtcblx0XHRyZXR1cm4gbm9uVHJpdmlhbEV4cHJlc3Npb25bMF07XG5cdH0gZWxzZSBpZiAoaGFzT3Bwb3NpdGVFeHByZXNzaW9ucyhub25Ucml2aWFsRXhwcmVzc2lvbikpIHtcblx0XHRyZXR1cm4gY29uc3RhbnQodHJ1ZSk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdF90eXBlOiBcIlNldFwiLFxuXHRcdFx0b3BlcmF0b3I6IFwifHxcIixcblx0XHRcdG9wZXJhbmRzOiBub25Ucml2aWFsRXhwcmVzc2lvblxuXHRcdH07XG5cdH1cbn1cblxuLyoqXG4gKiBMb2dpY2FsIGBub3RgIG9wZXJhdG9yLlxuICpcbiAqIEBwYXJhbSBvcGVyYW5kIFRoZSBleHByZXNzaW9uIHRvIHJldmVyc2VcbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uPGJvb2xlYW4+fSBUaGUgcmVzdWx0aW5nIGV4cHJlc3Npb24gdGhhdCBldmFsdWF0ZXMgdG8gYm9vbGVhblxuICovXG5leHBvcnQgZnVuY3Rpb24gbm90KG9wZXJhbmQ6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxib29sZWFuPik6IEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRvcGVyYW5kID0gd3JhcFByaW1pdGl2ZShvcGVyYW5kKTtcblx0aWYgKGhhc1VucmVzb2x2ZWFibGVFeHByZXNzaW9uKG9wZXJhbmQpKSB7XG5cdFx0cmV0dXJuIHVucmVzb2x2ZWFibGVFeHByZXNzaW9uO1xuXHR9IGVsc2UgaWYgKGlzQ29uc3RhbnQob3BlcmFuZCkpIHtcblx0XHRyZXR1cm4gY29uc3RhbnQoIW9wZXJhbmQudmFsdWUpO1xuXHR9IGVsc2UgaWYgKFxuXHRcdHR5cGVvZiBvcGVyYW5kID09PSBcIm9iamVjdFwiICYmXG5cdFx0b3BlcmFuZC5fdHlwZSA9PT0gXCJTZXRcIiAmJlxuXHRcdG9wZXJhbmQub3BlcmF0b3IgPT09IFwifHxcIiAmJlxuXHRcdG9wZXJhbmQub3BlcmFuZHMuZXZlcnkoZXhwcmVzc2lvbiA9PiBpc0NvbnN0YW50KGV4cHJlc3Npb24pIHx8IGlzQ29tcGFyaXNvbihleHByZXNzaW9uKSlcblx0KSB7XG5cdFx0cmV0dXJuIGFuZCguLi5vcGVyYW5kLm9wZXJhbmRzLm1hcChleHByZXNzaW9uID0+IG5vdChleHByZXNzaW9uKSkpO1xuXHR9IGVsc2UgaWYgKFxuXHRcdHR5cGVvZiBvcGVyYW5kID09PSBcIm9iamVjdFwiICYmXG5cdFx0b3BlcmFuZC5fdHlwZSA9PT0gXCJTZXRcIiAmJlxuXHRcdG9wZXJhbmQub3BlcmF0b3IgPT09IFwiJiZcIiAmJlxuXHRcdG9wZXJhbmQub3BlcmFuZHMuZXZlcnkoZXhwcmVzc2lvbiA9PiBpc0NvbnN0YW50KGV4cHJlc3Npb24pIHx8IGlzQ29tcGFyaXNvbihleHByZXNzaW9uKSlcblx0KSB7XG5cdFx0cmV0dXJuIG9yKC4uLm9wZXJhbmQub3BlcmFuZHMubWFwKGV4cHJlc3Npb24gPT4gbm90KGV4cHJlc3Npb24pKSk7XG5cdH0gZWxzZSBpZiAoaXNDb21wYXJpc29uKG9wZXJhbmQpKSB7XG5cdFx0Ly8gQ3JlYXRlIHRoZSByZXZlcnNlIGNvbXBhcmlzb25cblx0XHRzd2l0Y2ggKG9wZXJhbmQub3BlcmF0b3IpIHtcblx0XHRcdGNhc2UgXCIhPT1cIjpcblx0XHRcdFx0cmV0dXJuIGVxdWFsKG9wZXJhbmQub3BlcmFuZDEsIG9wZXJhbmQub3BlcmFuZDIpO1xuXHRcdFx0Y2FzZSBcIjxcIjpcblx0XHRcdFx0cmV0dXJuIGdyZWF0ZXJPckVxdWFsKG9wZXJhbmQub3BlcmFuZDEsIG9wZXJhbmQub3BlcmFuZDIpO1xuXHRcdFx0Y2FzZSBcIjw9XCI6XG5cdFx0XHRcdHJldHVybiBncmVhdGVyVGhhbihvcGVyYW5kLm9wZXJhbmQxLCBvcGVyYW5kLm9wZXJhbmQyKTtcblx0XHRcdGNhc2UgXCI9PT1cIjpcblx0XHRcdFx0cmV0dXJuIG5vdEVxdWFsKG9wZXJhbmQub3BlcmFuZDEsIG9wZXJhbmQub3BlcmFuZDIpO1xuXHRcdFx0Y2FzZSBcIj5cIjpcblx0XHRcdFx0cmV0dXJuIGxlc3NPckVxdWFsKG9wZXJhbmQub3BlcmFuZDEsIG9wZXJhbmQub3BlcmFuZDIpO1xuXHRcdFx0Y2FzZSBcIj49XCI6XG5cdFx0XHRcdHJldHVybiBsZXNzVGhhbihvcGVyYW5kLm9wZXJhbmQxLCBvcGVyYW5kLm9wZXJhbmQyKTtcblx0XHR9XG5cdH0gZWxzZSBpZiAob3BlcmFuZC5fdHlwZSA9PT0gXCJOb3RcIikge1xuXHRcdHJldHVybiBvcGVyYW5kLm9wZXJhbmQ7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdF90eXBlOiBcIk5vdFwiLFxuXHRcdFx0b3BlcmFuZDogb3BlcmFuZFxuXHRcdH07XG5cdH1cbn1cblxuLyoqXG4gKiBFdmFsdWF0ZXMgd2hldGhlciBhIGJpbmRpbmcgZXhwcmVzc2lvbiBpcyBlcXVhbCB0byB0cnVlIHdpdGggYSBsb29zZSBlcXVhbGl0eS5cbiAqXG4gKiBAcGFyYW0gb3BlcmFuZCBUaGUgZXhwcmVzc2lvbiB0byBjaGVja1xuICogQHJldHVybnMge0V4cHJlc3Npb248Ym9vbGVhbj59IFRoZSByZXN1bHRpbmcgZXhwcmVzc2lvbiB0aGF0IGV2YWx1YXRlcyB0byBib29sZWFuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1RydXRoeShvcGVyYW5kOiBFeHByZXNzaW9uPHN0cmluZz4pOiBFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0aWYgKGlzQ29uc3RhbnQob3BlcmFuZCkpIHtcblx0XHRyZXR1cm4gY29uc3RhbnQoISFvcGVyYW5kLnZhbHVlKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0X3R5cGU6IFwiVHJ1dGh5XCIsXG5cdFx0XHRvcGVyYW5kOiBvcGVyYW5kXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBiaW5kaW5nIGV4cHJlc3Npb24gdGhhdCB3aWxsIGJlIGV2YWx1YXRlZCBieSB0aGUgY29ycmVzcG9uZGluZyBtb2RlbC5cbiAqXG4gKiBAdGVtcGxhdGUgVGFyZ2V0VHlwZVxuICogQHBhcmFtIHBhdGggVGhlIHBhdGggb24gdGhlIG1vZGVsXG4gKiBAcGFyYW0gW21vZGVsTmFtZV0gVGhlIG5hbWUgb2YgdGhlIG1vZGVsXG4gKiBAcGFyYW0gW3Zpc2l0ZWROYXZpZ2F0aW9uUGF0aHNdIFRoZSBwYXRocyBmcm9tIHRoZSByb290IGVudGl0eVNldFxuICogQHBhcmFtIFtwYXRoVmlzaXRvcl0gQSBmdW5jdGlvbiB0byBtb2RpZnkgdGhlIHJlc3VsdGluZyBwYXRoXG4gKiBAcmV0dXJucyB7QmluZGluZ0V4cHJlc3Npb25FeHByZXNzaW9uPFRhcmdldFR5cGU+fSBUaGUgZGVmYXVsdCBiaW5kaW5nIGV4cHJlc3Npb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRpbmdFeHByZXNzaW9uPFRhcmdldFR5cGUgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihcblx0cGF0aDogc3RyaW5nIHwgdW5kZWZpbmVkLFxuXHRtb2RlbE5hbWU/OiBzdHJpbmcsXG5cdHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHM6IHN0cmluZ1tdID0gW10sXG5cdHBhdGhWaXNpdG9yPzogRnVuY3Rpb25cbik6IEJpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvbjxUYXJnZXRUeXBlPiB8IFVucmVzb2x2ZWFibGVCaW5kaW5nRXhwcmVzc2lvbiB7XG5cdGlmIChwYXRoID09PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gdW5yZXNvbHZlYWJsZUV4cHJlc3Npb247XG5cdH1cblx0bGV0IHRhcmdldFBhdGg7XG5cdGlmIChwYXRoVmlzaXRvcikge1xuXHRcdHRhcmdldFBhdGggPSBwYXRoVmlzaXRvcihwYXRoKTtcblx0XHRpZiAodGFyZ2V0UGF0aCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gdW5yZXNvbHZlYWJsZUV4cHJlc3Npb247XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGNvbnN0IGxvY2FsUGF0aCA9IHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMuY29uY2F0KCk7XG5cdFx0bG9jYWxQYXRoLnB1c2gocGF0aCk7XG5cdFx0dGFyZ2V0UGF0aCA9IGxvY2FsUGF0aC5qb2luKFwiL1wiKTtcblx0fVxuXHRyZXR1cm4ge1xuXHRcdF90eXBlOiBcIkJpbmRpbmdcIixcblx0XHRtb2RlbE5hbWU6IG1vZGVsTmFtZSxcblx0XHRwYXRoOiB0YXJnZXRQYXRoXG5cdH07XG59XG5cbnR5cGUgUGxhaW5FeHByZXNzaW9uT2JqZWN0ID0geyBbaW5kZXg6IHN0cmluZ106IEV4cHJlc3Npb248YW55PiB9O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjb25zdGFudCBleHByZXNzaW9uIGJhc2VkIG9uIGEgcHJpbWl0aXZlIHZhbHVlLlxuICpcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAcGFyYW0gdmFsdWUgVGhlIGNvbnN0YW50IHRvIHdyYXAgaW4gYW4gZXhwcmVzc2lvblxuICogQHJldHVybnMge0NvbnN0YW50RXhwcmVzc2lvbjxUPn0gVGhlIGNvbnN0YW50IGV4cHJlc3Npb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnN0YW50PFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPih2YWx1ZTogVCk6IENvbnN0YW50RXhwcmVzc2lvbjxUPiB7XG5cdGxldCBjb25zdGFudFZhbHVlOiBUO1xuXG5cdGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0Y29uc3RhbnRWYWx1ZSA9IHZhbHVlLm1hcCh3cmFwUHJpbWl0aXZlKSBhcyBUO1xuXHRcdH0gZWxzZSBpZiAoaXNQcmltaXRpdmVPYmplY3QodmFsdWUgYXMgb2JqZWN0KSkge1xuXHRcdFx0Y29uc3RhbnRWYWx1ZSA9IHZhbHVlLnZhbHVlT2YoKSBhcyBUO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCB2YWwgPSB2YWx1ZSBhcyB7IFtuYW1lOiBzdHJpbmddOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8YW55PiB9O1xuXHRcdFx0Y29uc3Qgb2JqID0gT2JqZWN0LmtleXModmFsKS5yZWR1Y2UoKG9iaiwga2V5KSA9PiB7XG5cdFx0XHRcdGNvbnN0IHZhbHVlID0gd3JhcFByaW1pdGl2ZSh2YWxba2V5XSk7XG5cdFx0XHRcdGlmICh2YWx1ZS5fdHlwZSAhPT0gXCJDb25zdGFudFwiIHx8IHZhbHVlLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRvYmpba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBvYmo7XG5cdFx0XHR9LCB7fSBhcyBQbGFpbkV4cHJlc3Npb25PYmplY3QpO1xuXG5cdFx0XHRjb25zdGFudFZhbHVlID0gb2JqIGFzIFQ7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGNvbnN0YW50VmFsdWUgPSB2YWx1ZTtcblx0fVxuXG5cdHJldHVybiB7IF90eXBlOiBcIkNvbnN0YW50XCIsIHZhbHVlOiBjb25zdGFudFZhbHVlIH07XG59XG5cbnR5cGUgRXZhbHVhdGlvblR5cGUgPSBcImJvb2xlYW5cIjtcbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlQmluZGluZ1N0cmluZzxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oXG5cdHZhbHVlOiBzdHJpbmcgfCBib29sZWFuIHwgbnVtYmVyLFxuXHR0YXJnZXRUeXBlPzogRXZhbHVhdGlvblR5cGVcbik6IENvbnN0YW50RXhwcmVzc2lvbjxUPiB8IEVtYmVkZGVkQmluZGluZ0V4cHJlc3Npb248VD4gfCBFbWJlZGRlZEV4cHJlc3Npb25CaW5kaW5nRXhwcmVzc2lvbjxUPiB7XG5cdGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiB2YWx1ZS5zdGFydHNXaXRoKFwie1wiKSkge1xuXHRcdGlmICh2YWx1ZS5zdGFydHNXaXRoKFwiez1cIikpIHtcblx0XHRcdC8vIEV4cHJlc3Npb24gYmluZGluZywgd2UgY2FuIGp1c3QgcmVtb3ZlIHRoZSBvdXRlciBiaW5kaW5nIHRoaW5nc1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0X3R5cGU6IFwiRW1iZWRkZWRFeHByZXNzaW9uQmluZGluZ1wiLFxuXHRcdFx0XHR2YWx1ZTogdmFsdWVcblx0XHRcdH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdF90eXBlOiBcIkVtYmVkZGVkQmluZGluZ1wiLFxuXHRcdFx0XHR2YWx1ZTogdmFsdWVcblx0XHRcdH07XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHN3aXRjaCAodGFyZ2V0VHlwZSkge1xuXHRcdFx0Y2FzZSBcImJvb2xlYW5cIjpcblx0XHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiAodmFsdWUgPT09IFwidHJ1ZVwiIHx8IHZhbHVlID09PSBcImZhbHNlXCIpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGNvbnN0YW50KHZhbHVlID09PSBcInRydWVcIikgYXMgQ29uc3RhbnRFeHByZXNzaW9uPFQ+O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBjb25zdGFudCh2YWx1ZSkgYXMgQ29uc3RhbnRFeHByZXNzaW9uPFQ+O1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuIGNvbnN0YW50KHZhbHVlKSBhcyBDb25zdGFudEV4cHJlc3Npb248VD47XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogQSBuYW1lZCByZWZlcmVuY2UuXG4gKlxuICogQHNlZSBmblxuICpcbiAqIEBwYXJhbSByZWYgUmVmZXJlbmNlXG4gKiBAcmV0dXJucyB7UmVmZXJlbmNlRXhwcmVzc2lvbn0gVGhlIG9iamVjdCByZWZlcmVuY2UgYmluZGluZyBwYXJ0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWYocmVmOiBzdHJpbmcgfCBudWxsKTogUmVmZXJlbmNlRXhwcmVzc2lvbiB7XG5cdHJldHVybiB7IF90eXBlOiBcIlJlZlwiLCByZWYgfTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgdHlwZSBpcyBhbiBleHByZXNzaW9uLlxuICpcbiAqIEV2ZXJ5IG9iamVjdCBoYXZpbmcgYSBwcm9wZXJ0eSBuYW1lZCBgX3R5cGVgIG9mIHNvbWUgdmFsdWUgaXMgY29uc2lkZXJlZCBhbiBleHByZXNzaW9uLCBldmVuIGlmIHRoZXJlIGlzIGFjdHVhbGx5XG4gKiBubyBzdWNoIGV4cHJlc3Npb24gdHlwZSBzdXBwb3J0ZWQuXG4gKlxuICogQHBhcmFtIHNvbWV0aGluZyBUeXBlIHRvIGNoZWNrXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gYHRydWVgIGlmIHRoZSB0eXBlIGlzIGNvbnNpZGVyZWQgdG8gYmUgYW4gZXhwcmVzc2lvblxuICovXG5mdW5jdGlvbiBpc0V4cHJlc3Npb248VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KHNvbWV0aGluZzogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+KTogc29tZXRoaW5nIGlzIEV4cHJlc3Npb248VD4ge1xuXHRyZXR1cm4gc29tZXRoaW5nICE9PSBudWxsICYmIHR5cGVvZiBzb21ldGhpbmcgPT09IFwib2JqZWN0XCIgJiYgKHNvbWV0aGluZyBhcyBCYXNlRXhwcmVzc2lvbjxUPikuX3R5cGUgIT09IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBXcmFwIGEgcHJpbWl0aXZlIGludG8gYSBjb25zdGFudCBleHByZXNzaW9uIGlmIGl0IGlzIG5vdCBhbHJlYWR5IGFuIGV4cHJlc3Npb24uXG4gKlxuICogQHRlbXBsYXRlIFRcbiAqIEBwYXJhbSBzb21ldGhpbmcgVGhlIG9iamVjdCB0byB3cmFwIGluIGEgQ29uc3RhbnQgZXhwcmVzc2lvblxuICogQHJldHVybnMge0V4cHJlc3Npb248VD59IEVpdGhlciB0aGUgb3JpZ2luYWwgb2JqZWN0IG9yIHRoZSB3cmFwcGVkIG9uZSBkZXBlbmRpbmcgb24gdGhlIGNhc2VcbiAqL1xuZnVuY3Rpb24gd3JhcFByaW1pdGl2ZTxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oc29tZXRoaW5nOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD4pOiBFeHByZXNzaW9uPFQ+IHtcblx0aWYgKGlzRXhwcmVzc2lvbihzb21ldGhpbmcpKSB7XG5cdFx0cmV0dXJuIHNvbWV0aGluZztcblx0fVxuXG5cdHJldHVybiBjb25zdGFudChzb21ldGhpbmcpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgZXhwcmVzc2lvbiBvciB2YWx1ZSBwcm92aWRlZCBpcyBjb25zdGFudCBvciBub3QuXG4gKlxuICogQHRlbXBsYXRlIFQgVGhlIHRhcmdldCB0eXBlXG4gKiBAcGFyYW0gIG1heWJlQ29uc3RhbnQgVGhlIGV4cHJlc3Npb24gb3IgcHJpbWl0aXZlIHZhbHVlIHRoYXQgaXMgdG8gYmUgY2hlY2tlZFxuICogQHJldHVybnMge2Jvb2xlYW59IGB0cnVlYCBpZiBpdCBpcyBjb25zdGFudFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNDb25zdGFudDxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4obWF5YmVDb25zdGFudDogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+KTogbWF5YmVDb25zdGFudCBpcyBDb25zdGFudEV4cHJlc3Npb248VD4ge1xuXHRyZXR1cm4gdHlwZW9mIG1heWJlQ29uc3RhbnQgIT09IFwib2JqZWN0XCIgfHwgKG1heWJlQ29uc3RhbnQgYXMgQmFzZUV4cHJlc3Npb248VD4pLl90eXBlID09PSBcIkNvbnN0YW50XCI7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBleHByZXNzaW9uIG9yIHZhbHVlIHByb3ZpZGVkIGlzIGJpbmRpbmcgb3Igbm90LlxuICpcbiAqIEB0ZW1wbGF0ZSBUIFRoZSB0YXJnZXQgdHlwZVxuICogQHBhcmFtICBtYXliZUJpbmRpbmcgVGhlIGV4cHJlc3Npb24gb3IgcHJpbWl0aXZlIHZhbHVlIHRoYXQgaXMgdG8gYmUgY2hlY2tlZFxuICogQHJldHVybnMge2Jvb2xlYW59IGB0cnVlYCBpZiBpdCBpcyBiaW5kaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0JpbmRpbmc8VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KG1heWJlQmluZGluZzogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+KTogbWF5YmVCaW5kaW5nIGlzIEJpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvbjxUPiB7XG5cdHJldHVybiB0eXBlb2YgbWF5YmVCaW5kaW5nID09PSBcIm9iamVjdFwiICYmIChtYXliZUJpbmRpbmcgYXMgQmFzZUV4cHJlc3Npb248VD4pLl90eXBlID09PSBcIkJpbmRpbmdcIjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIGV4cHJlc3Npb24gcHJvdmlkZWQgaXMgYSBjb21wYXJpc29uIG9yIG5vdC5cbiAqXG4gKiBAdGVtcGxhdGUgVCBUaGUgdGFyZ2V0IHR5cGVcbiAqIEBwYXJhbSBleHByZXNzaW9uIFRoZSBleHByZXNzaW9uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gYHRydWVgIGlmIHRoZSBleHByZXNzaW9uIGlzIGEgQ29tcGFyaXNvbkV4cHJlc3Npb25cbiAqL1xuZnVuY3Rpb24gaXNDb21wYXJpc29uPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihleHByZXNzaW9uOiBFeHByZXNzaW9uPFQ+KTogZXhwcmVzc2lvbiBpcyBDb21wYXJpc29uRXhwcmVzc2lvbiB7XG5cdHJldHVybiBleHByZXNzaW9uLl90eXBlID09PSBcIkNvbXBhcmlzb25cIjtcbn1cblxudHlwZSBDb21wbGV4QW5ub3RhdGlvbkV4cHJlc3Npb248UD4gPVxuXHR8IFBhdGhBbm5vdGF0aW9uRXhwcmVzc2lvbjxQPlxuXHR8IEFwcGx5QW5ub3RhdGlvbkV4cHJlc3Npb248UD5cblx0fCBJZkFubm90YXRpb25FeHByZXNzaW9uPFA+XG5cdHwgT3JBbm5vdGF0aW9uRXhwcmVzc2lvbjxQPlxuXHR8IEFuZEFubm90YXRpb25FeHByZXNzaW9uPFA+XG5cdHwgTmVBbm5vdGF0aW9uRXhwcmVzc2lvbjxQPlxuXHR8IEVxQW5ub3RhdGlvbkV4cHJlc3Npb248UD5cblx0fCBOb3RBbm5vdGF0aW9uRXhwcmVzc2lvbjxQPlxuXHR8IEd0QW5ub3RhdGlvbkV4cHJlc3Npb248UD5cblx0fCBHZUFubm90YXRpb25FeHByZXNzaW9uPFA+XG5cdHwgTGVBbm5vdGF0aW9uRXhwcmVzc2lvbjxQPlxuXHR8IEx0QW5ub3RhdGlvbkV4cHJlc3Npb248UD47XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlT2JqZWN0KG9iamVjdFR5cGU6IG9iamVjdCk6IGJvb2xlYW4ge1xuXHRzd2l0Y2ggKG9iamVjdFR5cGUuY29uc3RydWN0b3IubmFtZSkge1xuXHRcdGNhc2UgXCJTdHJpbmdcIjpcblx0XHRjYXNlIFwiTnVtYmVyXCI6XG5cdFx0Y2FzZSBcIkJvb2xlYW5cIjpcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cbi8qKlxuICogQ2hlY2sgaWYgdGhlIHBhc3NlZCBhbm5vdGF0aW9uIGV4cHJlc3Npb24gaXMgYSBDb21wbGV4QW5ub3RhdGlvbkV4cHJlc3Npb24uXG4gKlxuICogQHRlbXBsYXRlIFQgVGhlIHRhcmdldCB0eXBlXG4gKiBAcGFyYW0gIGFubm90YXRpb25FeHByZXNzaW9uIFRoZSBhbm5vdGF0aW9uIGV4cHJlc3Npb24gdG8gZXZhbHVhdGVcbiAqIEByZXR1cm5zIHtib29sZWFufSBgdHJ1ZWAgaWYgdGhlIG9iamVjdCBpcyBhIHtDb21wbGV4QW5ub3RhdGlvbkV4cHJlc3Npb259XG4gKi9cbmZ1bmN0aW9uIGlzQ29tcGxleEFubm90YXRpb25FeHByZXNzaW9uPFQ+KFxuXHRhbm5vdGF0aW9uRXhwcmVzc2lvbjogUHJvcGVydHlBbm5vdGF0aW9uVmFsdWU8VD5cbik6IGFubm90YXRpb25FeHByZXNzaW9uIGlzIENvbXBsZXhBbm5vdGF0aW9uRXhwcmVzc2lvbjxUPiB7XG5cdHJldHVybiB0eXBlb2YgYW5ub3RhdGlvbkV4cHJlc3Npb24gPT09IFwib2JqZWN0XCIgJiYgIWlzUHJpbWl0aXZlT2JqZWN0KGFubm90YXRpb25FeHByZXNzaW9uIGFzIG9iamVjdCk7XG59XG5cbi8qKlxuICogR2VuZXJhdGUgdGhlIGNvcnJlc3BvbmRpbmcgZXhwcmVzc2lvbiBmb3IgYSBnaXZlbiBhbm5vdGF0aW9uIGV4cHJlc3Npb24uXG4gKlxuICogQHRlbXBsYXRlIFQgVGhlIHRhcmdldCB0eXBlXG4gKiBAcGFyYW0gYW5ub3RhdGlvbkV4cHJlc3Npb24gVGhlIHNvdXJjZSBhbm5vdGF0aW9uIGV4cHJlc3Npb25cbiAqIEBwYXJhbSB2aXNpdGVkTmF2aWdhdGlvblBhdGhzIFRoZSBwYXRoIGZyb20gdGhlIHJvb3QgZW50aXR5IHNldFxuICogQHBhcmFtIGRlZmF1bHRWYWx1ZSBEZWZhdWx0IHZhbHVlIGlmIHRoZSBhbm5vdGF0aW9uRXhwcmVzc2lvbiBpcyB1bmRlZmluZWRcbiAqIEBwYXJhbSBwYXRoVmlzaXRvciBBIGZ1bmN0aW9uIHRvIG1vZGlmeSB0aGUgcmVzdWx0aW5nIHBhdGhcbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uPFQ+fSBUaGUgZXhwcmVzc2lvbiBlcXVpdmFsZW50IHRvIHRoYXQgYW5ub3RhdGlvbiBleHByZXNzaW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhbm5vdGF0aW9uRXhwcmVzc2lvbjxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oXG5cdGFubm90YXRpb25FeHByZXNzaW9uOiBQcm9wZXJ0eUFubm90YXRpb25WYWx1ZTxUPixcblx0dmlzaXRlZE5hdmlnYXRpb25QYXRoczogc3RyaW5nW10gPSBbXSxcblx0ZGVmYXVsdFZhbHVlPzogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+LFxuXHRwYXRoVmlzaXRvcj86IEZ1bmN0aW9uXG4pOiBFeHByZXNzaW9uPFQ+IHtcblx0aWYgKGFubm90YXRpb25FeHByZXNzaW9uID09PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gd3JhcFByaW1pdGl2ZShkZWZhdWx0VmFsdWUgYXMgVCk7XG5cdH1cblx0aWYgKCFpc0NvbXBsZXhBbm5vdGF0aW9uRXhwcmVzc2lvbihhbm5vdGF0aW9uRXhwcmVzc2lvbikpIHtcblx0XHRyZXR1cm4gY29uc3RhbnQoYW5ub3RhdGlvbkV4cHJlc3Npb24pO1xuXHR9IGVsc2Uge1xuXHRcdHN3aXRjaCAoYW5ub3RhdGlvbkV4cHJlc3Npb24udHlwZSkge1xuXHRcdFx0Y2FzZSBcIlBhdGhcIjpcblx0XHRcdFx0cmV0dXJuIGJpbmRpbmdFeHByZXNzaW9uKGFubm90YXRpb25FeHByZXNzaW9uLnBhdGgsIHVuZGVmaW5lZCwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpO1xuXHRcdFx0Y2FzZSBcIklmXCI6XG5cdFx0XHRcdHJldHVybiBhbm5vdGF0aW9uSWZFeHByZXNzaW9uKGFubm90YXRpb25FeHByZXNzaW9uLklmLCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzLCBwYXRoVmlzaXRvcik7XG5cdFx0XHRjYXNlIFwiTm90XCI6XG5cdFx0XHRcdHJldHVybiBub3QocGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKGFubm90YXRpb25FeHByZXNzaW9uLk5vdCwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpKSBhcyBFeHByZXNzaW9uPFQ+O1xuXHRcdFx0Y2FzZSBcIkVxXCI6XG5cdFx0XHRcdHJldHVybiBlcXVhbChcblx0XHRcdFx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oYW5ub3RhdGlvbkV4cHJlc3Npb24uRXFbMF0sIHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMsIHBhdGhWaXNpdG9yKSxcblx0XHRcdFx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oYW5ub3RhdGlvbkV4cHJlc3Npb24uRXFbMV0sIHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMsIHBhdGhWaXNpdG9yKVxuXHRcdFx0XHQpIGFzIEV4cHJlc3Npb248VD47XG5cdFx0XHRjYXNlIFwiTmVcIjpcblx0XHRcdFx0cmV0dXJuIG5vdEVxdWFsKFxuXHRcdFx0XHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbihhbm5vdGF0aW9uRXhwcmVzc2lvbi5OZVswXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpLFxuXHRcdFx0XHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbihhbm5vdGF0aW9uRXhwcmVzc2lvbi5OZVsxXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpXG5cdFx0XHRcdCkgYXMgRXhwcmVzc2lvbjxUPjtcblx0XHRcdGNhc2UgXCJHdFwiOlxuXHRcdFx0XHRyZXR1cm4gZ3JlYXRlclRoYW4oXG5cdFx0XHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKGFubm90YXRpb25FeHByZXNzaW9uLkd0WzBdLCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzLCBwYXRoVmlzaXRvciksXG5cdFx0XHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKGFubm90YXRpb25FeHByZXNzaW9uLkd0WzFdLCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzLCBwYXRoVmlzaXRvcilcblx0XHRcdFx0KSBhcyBFeHByZXNzaW9uPFQ+O1xuXHRcdFx0Y2FzZSBcIkdlXCI6XG5cdFx0XHRcdHJldHVybiBncmVhdGVyT3JFcXVhbChcblx0XHRcdFx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oYW5ub3RhdGlvbkV4cHJlc3Npb24uR2VbMF0sIHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMsIHBhdGhWaXNpdG9yKSxcblx0XHRcdFx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oYW5ub3RhdGlvbkV4cHJlc3Npb24uR2VbMV0sIHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMsIHBhdGhWaXNpdG9yKVxuXHRcdFx0XHQpIGFzIEV4cHJlc3Npb248VD47XG5cdFx0XHRjYXNlIFwiTHRcIjpcblx0XHRcdFx0cmV0dXJuIGxlc3NUaGFuKFxuXHRcdFx0XHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbihhbm5vdGF0aW9uRXhwcmVzc2lvbi5MdFswXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpLFxuXHRcdFx0XHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbihhbm5vdGF0aW9uRXhwcmVzc2lvbi5MdFsxXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpXG5cdFx0XHRcdCkgYXMgRXhwcmVzc2lvbjxUPjtcblx0XHRcdGNhc2UgXCJMZVwiOlxuXHRcdFx0XHRyZXR1cm4gbGVzc09yRXF1YWwoXG5cdFx0XHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKGFubm90YXRpb25FeHByZXNzaW9uLkxlWzBdLCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzLCBwYXRoVmlzaXRvciksXG5cdFx0XHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKGFubm90YXRpb25FeHByZXNzaW9uLkxlWzFdLCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzLCBwYXRoVmlzaXRvcilcblx0XHRcdFx0KSBhcyBFeHByZXNzaW9uPFQ+O1xuXHRcdFx0Y2FzZSBcIk9yXCI6XG5cdFx0XHRcdHJldHVybiBvcihcblx0XHRcdFx0XHQuLi4oYW5ub3RhdGlvbkV4cHJlc3Npb24uT3IubWFwKGZ1bmN0aW9uKG9yQ29uZGl0aW9uKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKG9yQ29uZGl0aW9uLCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzLCBwYXRoVmlzaXRvcik7XG5cdFx0XHRcdFx0fSkgYXMgRXhwcmVzc2lvbjxib29sZWFuPltdKVxuXHRcdFx0XHQpIGFzIEV4cHJlc3Npb248VD47XG5cdFx0XHRjYXNlIFwiQW5kXCI6XG5cdFx0XHRcdHJldHVybiBhbmQoXG5cdFx0XHRcdFx0Li4uKGFubm90YXRpb25FeHByZXNzaW9uLkFuZC5tYXAoZnVuY3Rpb24oYW5kQ29uZGl0aW9uKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKGFuZENvbmRpdGlvbiwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpO1xuXHRcdFx0XHRcdH0pIGFzIEV4cHJlc3Npb248Ym9vbGVhbj5bXSlcblx0XHRcdFx0KSBhcyBFeHByZXNzaW9uPFQ+O1xuXHRcdFx0Y2FzZSBcIkFwcGx5XCI6XG5cdFx0XHRcdHJldHVybiBhbm5vdGF0aW9uQXBwbHlFeHByZXNzaW9uKFxuXHRcdFx0XHRcdGFubm90YXRpb25FeHByZXNzaW9uIGFzIEFwcGx5QW5ub3RhdGlvbkV4cHJlc3Npb248c3RyaW5nPixcblx0XHRcdFx0XHR2aXNpdGVkTmF2aWdhdGlvblBhdGhzLFxuXHRcdFx0XHRcdHBhdGhWaXNpdG9yXG5cdFx0XHRcdCkgYXMgRXhwcmVzc2lvbjxUPjtcblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBQYXJzZSB0aGUgYW5ub3RhdGlvbiBjb25kaXRpb24gaW50byBhbiBleHByZXNzaW9uLlxuICpcbiAqIEB0ZW1wbGF0ZSBUIFRoZSB0YXJnZXQgdHlwZVxuICogQHBhcmFtIGFubm90YXRpb25WYWx1ZSBUaGUgY29uZGl0aW9uIG9yIHZhbHVlIGZyb20gdGhlIGFubm90YXRpb25cbiAqIEBwYXJhbSB2aXNpdGVkTmF2aWdhdGlvblBhdGhzIFRoZSBwYXRoIGZyb20gdGhlIHJvb3QgZW50aXR5IHNldFxuICogQHBhcmFtIHBhdGhWaXNpdG9yIEEgZnVuY3Rpb24gdG8gbW9kaWZ5IHRoZSByZXN1bHRpbmcgcGF0aFxuICogQHJldHVybnMge0V4cHJlc3Npb248VD59IEFuIGVxdWl2YWxlbnQgZXhwcmVzc2lvblxuICovXG5mdW5jdGlvbiBwYXJzZUFubm90YXRpb25Db25kaXRpb248VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHRhbm5vdGF0aW9uVmFsdWU6IENvbmRpdGlvbmFsQ2hlY2tPclZhbHVlLFxuXHR2aXNpdGVkTmF2aWdhdGlvblBhdGhzOiBzdHJpbmdbXSA9IFtdLFxuXHRwYXRoVmlzaXRvcj86IEZ1bmN0aW9uXG4pOiBFeHByZXNzaW9uPFQ+IHtcblx0aWYgKGFubm90YXRpb25WYWx1ZSA9PT0gbnVsbCB8fCB0eXBlb2YgYW5ub3RhdGlvblZhbHVlICE9PSBcIm9iamVjdFwiKSB7XG5cdFx0cmV0dXJuIGNvbnN0YW50KGFubm90YXRpb25WYWx1ZSBhcyBUKTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uVmFsdWUuaGFzT3duUHJvcGVydHkoXCIkT3JcIikpIHtcblx0XHRyZXR1cm4gb3IoXG5cdFx0XHQuLi4oKChhbm5vdGF0aW9uVmFsdWUgYXMgT3JDb25kaXRpb25hbEV4cHJlc3Npb24pLiRPci5tYXAoZnVuY3Rpb24ob3JDb25kaXRpb24pIHtcblx0XHRcdFx0cmV0dXJuIHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbihvckNvbmRpdGlvbiwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpO1xuXHRcdFx0fSkgYXMgdW5rbm93bikgYXMgRXhwcmVzc2lvbjxib29sZWFuPltdKVxuXHRcdCkgYXMgRXhwcmVzc2lvbjxUPjtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uVmFsdWUuaGFzT3duUHJvcGVydHkoXCIkQW5kXCIpKSB7XG5cdFx0cmV0dXJuIGFuZChcblx0XHRcdC4uLigoKGFubm90YXRpb25WYWx1ZSBhcyBBbmRDb25kaXRpb25hbEV4cHJlc3Npb24pLiRBbmQubWFwKGZ1bmN0aW9uKGFuZENvbmRpdGlvbikge1xuXHRcdFx0XHRyZXR1cm4gcGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKGFuZENvbmRpdGlvbiwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpO1xuXHRcdFx0fSkgYXMgdW5rbm93bikgYXMgRXhwcmVzc2lvbjxib29sZWFuPltdKVxuXHRcdCkgYXMgRXhwcmVzc2lvbjxUPjtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uVmFsdWUuaGFzT3duUHJvcGVydHkoXCIkTm90XCIpKSB7XG5cdFx0cmV0dXJuIG5vdChcblx0XHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbigoYW5ub3RhdGlvblZhbHVlIGFzIE5vdENvbmRpdGlvbmFsRXhwcmVzc2lvbikuJE5vdFswXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpXG5cdFx0KSBhcyBFeHByZXNzaW9uPFQ+O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25WYWx1ZS5oYXNPd25Qcm9wZXJ0eShcIiRFcVwiKSkge1xuXHRcdHJldHVybiBlcXVhbChcblx0XHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbigoYW5ub3RhdGlvblZhbHVlIGFzIEVxQ29uZGl0aW9uYWxFeHByZXNzaW9uKS4kRXFbMF0sIHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMsIHBhdGhWaXNpdG9yKSxcblx0XHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbigoYW5ub3RhdGlvblZhbHVlIGFzIEVxQ29uZGl0aW9uYWxFeHByZXNzaW9uKS4kRXFbMV0sIHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMsIHBhdGhWaXNpdG9yKVxuXHRcdCkgYXMgRXhwcmVzc2lvbjxUPjtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uVmFsdWUuaGFzT3duUHJvcGVydHkoXCIkTmVcIikpIHtcblx0XHRyZXR1cm4gbm90RXF1YWwoXG5cdFx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oKGFubm90YXRpb25WYWx1ZSBhcyBOZUNvbmRpdGlvbmFsRXhwcmVzc2lvbikuJE5lWzBdLCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzLCBwYXRoVmlzaXRvciksXG5cdFx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oKGFubm90YXRpb25WYWx1ZSBhcyBOZUNvbmRpdGlvbmFsRXhwcmVzc2lvbikuJE5lWzFdLCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzLCBwYXRoVmlzaXRvcilcblx0XHQpIGFzIEV4cHJlc3Npb248VD47XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvblZhbHVlLmhhc093blByb3BlcnR5KFwiJEd0XCIpKSB7XG5cdFx0cmV0dXJuIGdyZWF0ZXJUaGFuKFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgR3RDb25kaXRpb25hbEV4cHJlc3Npb24pLiRHdFswXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpLFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgR3RDb25kaXRpb25hbEV4cHJlc3Npb24pLiRHdFsxXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpXG5cdFx0KSBhcyBFeHByZXNzaW9uPFQ+O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25WYWx1ZS5oYXNPd25Qcm9wZXJ0eShcIiRHZVwiKSkge1xuXHRcdHJldHVybiBncmVhdGVyT3JFcXVhbChcblx0XHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbigoYW5ub3RhdGlvblZhbHVlIGFzIEdlQ29uZGl0aW9uYWxFeHByZXNzaW9uKS4kR2VbMF0sIHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMsIHBhdGhWaXNpdG9yKSxcblx0XHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbigoYW5ub3RhdGlvblZhbHVlIGFzIEdlQ29uZGl0aW9uYWxFeHByZXNzaW9uKS4kR2VbMV0sIHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMsIHBhdGhWaXNpdG9yKVxuXHRcdCkgYXMgRXhwcmVzc2lvbjxUPjtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uVmFsdWUuaGFzT3duUHJvcGVydHkoXCIkTHRcIikpIHtcblx0XHRyZXR1cm4gbGVzc1RoYW4oXG5cdFx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oKGFubm90YXRpb25WYWx1ZSBhcyBMdENvbmRpdGlvbmFsRXhwcmVzc2lvbikuJEx0WzBdLCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzLCBwYXRoVmlzaXRvciksXG5cdFx0XHRwYXJzZUFubm90YXRpb25Db25kaXRpb24oKGFubm90YXRpb25WYWx1ZSBhcyBMdENvbmRpdGlvbmFsRXhwcmVzc2lvbikuJEx0WzFdLCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzLCBwYXRoVmlzaXRvcilcblx0XHQpIGFzIEV4cHJlc3Npb248VD47XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvblZhbHVlLmhhc093blByb3BlcnR5KFwiJExlXCIpKSB7XG5cdFx0cmV0dXJuIGxlc3NPckVxdWFsKFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgTGVDb25kaXRpb25hbEV4cHJlc3Npb24pLiRMZVswXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpLFxuXHRcdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgTGVDb25kaXRpb25hbEV4cHJlc3Npb24pLiRMZVsxXSwgdmlzaXRlZE5hdmlnYXRpb25QYXRocywgcGF0aFZpc2l0b3IpXG5cdFx0KSBhcyBFeHByZXNzaW9uPFQ+O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25WYWx1ZS5oYXNPd25Qcm9wZXJ0eShcIiRQYXRoXCIpKSB7XG5cdFx0cmV0dXJuIGJpbmRpbmdFeHByZXNzaW9uKChhbm5vdGF0aW9uVmFsdWUgYXMgUGF0aENvbmRpdGlvbkV4cHJlc3Npb248VD4pLiRQYXRoLCB1bmRlZmluZWQsIHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMsIHBhdGhWaXNpdG9yKTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uVmFsdWUuaGFzT3duUHJvcGVydHkoXCIkQXBwbHlcIikpIHtcblx0XHRyZXR1cm4gYW5ub3RhdGlvbkV4cHJlc3Npb24oXG5cdFx0XHR7XG5cdFx0XHRcdHR5cGU6IFwiQXBwbHlcIixcblx0XHRcdFx0RnVuY3Rpb246IChhbm5vdGF0aW9uVmFsdWUgYXMgYW55KS4kRnVuY3Rpb24sXG5cdFx0XHRcdEFwcGx5OiAoYW5ub3RhdGlvblZhbHVlIGFzIGFueSkuJEFwcGx5XG5cdFx0XHR9IGFzIFQsXG5cdFx0XHR2aXNpdGVkTmF2aWdhdGlvblBhdGhzLFxuXHRcdFx0dW5kZWZpbmVkLFxuXHRcdFx0cGF0aFZpc2l0b3Jcblx0XHQpO1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25WYWx1ZS5oYXNPd25Qcm9wZXJ0eShcIiRJZlwiKSkge1xuXHRcdHJldHVybiBhbm5vdGF0aW9uRXhwcmVzc2lvbihcblx0XHRcdHtcblx0XHRcdFx0dHlwZTogXCJJZlwiLFxuXHRcdFx0XHRJZjogKGFubm90YXRpb25WYWx1ZSBhcyBhbnkpLiRJZlxuXHRcdFx0fSBhcyBULFxuXHRcdFx0dmlzaXRlZE5hdmlnYXRpb25QYXRocyxcblx0XHRcdHVuZGVmaW5lZCxcblx0XHRcdHBhdGhWaXNpdG9yXG5cdFx0KTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uVmFsdWUuaGFzT3duUHJvcGVydHkoXCIkRW51bU1lbWJlclwiKSkge1xuXHRcdHJldHVybiBjb25zdGFudChyZXNvbHZlRW51bVZhbHVlKChhbm5vdGF0aW9uVmFsdWUgYXMgYW55KS4kRW51bU1lbWJlcikgYXMgVCk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIGNvbnN0YW50KGZhbHNlIGFzIFQpO1xuXHR9XG59XG5cbi8qKlxuICogUHJvY2VzcyB0aGUge0lmQW5ub3RhdGlvbkV4cHJlc3Npb25WYWx1ZX0gaW50byBhbiBleHByZXNzaW9uLlxuICpcbiAqIEB0ZW1wbGF0ZSBUIFRoZSB0YXJnZXQgdHlwZVxuICogQHBhcmFtIGFubm90YXRpb25JZkV4cHJlc3Npb24gQW4gSWYgZXhwcmVzc2lvbiByZXR1cm5pbmcgdGhlIHR5cGUgVFxuICogQHBhcmFtIHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMgVGhlIHBhdGggZnJvbSB0aGUgcm9vdCBlbnRpdHkgc2V0XG4gKiBAcGFyYW0gcGF0aFZpc2l0b3IgQSBmdW5jdGlvbiB0byBtb2RpZnkgdGhlIHJlc3VsdGluZyBwYXRoXG4gKiBAcmV0dXJucyB7RXhwcmVzc2lvbjxUPn0gVGhlIGVxdWl2YWxlbnQgaWZFbHNlIGV4cHJlc3Npb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFubm90YXRpb25JZkV4cHJlc3Npb248VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHRhbm5vdGF0aW9uSWZFeHByZXNzaW9uOiBJZkFubm90YXRpb25FeHByZXNzaW9uVmFsdWU8VD4sXG5cdHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHM6IHN0cmluZ1tdID0gW10sXG5cdHBhdGhWaXNpdG9yPzogRnVuY3Rpb25cbik6IEV4cHJlc3Npb248VD4ge1xuXHRyZXR1cm4gaWZFbHNlKFxuXHRcdHBhcnNlQW5ub3RhdGlvbkNvbmRpdGlvbihhbm5vdGF0aW9uSWZFeHByZXNzaW9uWzBdLCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzLCBwYXRoVmlzaXRvciksXG5cdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKGFubm90YXRpb25JZkV4cHJlc3Npb25bMV0gYXMgYW55LCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzLCBwYXRoVmlzaXRvciksXG5cdFx0cGFyc2VBbm5vdGF0aW9uQ29uZGl0aW9uKGFubm90YXRpb25JZkV4cHJlc3Npb25bMl0gYXMgYW55LCB2aXNpdGVkTmF2aWdhdGlvblBhdGhzLCBwYXRoVmlzaXRvcilcblx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFubm90YXRpb25BcHBseUV4cHJlc3Npb24oXG5cdGFubm90YXRpb25BcHBseUV4cHJlc3Npb246IEFwcGx5QW5ub3RhdGlvbkV4cHJlc3Npb248c3RyaW5nPixcblx0dmlzaXRlZE5hdmlnYXRpb25QYXRoczogc3RyaW5nW10gPSBbXSxcblx0cGF0aFZpc2l0b3I/OiBGdW5jdGlvblxuKTogRXhwcmVzc2lvbjxzdHJpbmc+IHtcblx0c3dpdGNoIChhbm5vdGF0aW9uQXBwbHlFeHByZXNzaW9uLkZ1bmN0aW9uKSB7XG5cdFx0Y2FzZSBcIm9kYXRhLmNvbmNhdFwiOlxuXHRcdFx0cmV0dXJuIGNvbmNhdChcblx0XHRcdFx0Li4uYW5ub3RhdGlvbkFwcGx5RXhwcmVzc2lvbi5BcHBseS5tYXAoKGFwcGx5UGFyYW06IGFueSkgPT4ge1xuXHRcdFx0XHRcdGxldCBhcHBseVBhcmFtQ29udmVydGVkID0gYXBwbHlQYXJhbTtcblx0XHRcdFx0XHRpZiAoYXBwbHlQYXJhbS5oYXNPd25Qcm9wZXJ0eShcIiRQYXRoXCIpKSB7XG5cdFx0XHRcdFx0XHRhcHBseVBhcmFtQ29udmVydGVkID0ge1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBcIlBhdGhcIixcblx0XHRcdFx0XHRcdFx0cGF0aDogYXBwbHlQYXJhbS4kUGF0aFxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGFwcGx5UGFyYW0uaGFzT3duUHJvcGVydHkoXCIkSWZcIikpIHtcblx0XHRcdFx0XHRcdGFwcGx5UGFyYW1Db252ZXJ0ZWQgPSB7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IFwiSWZcIixcblx0XHRcdFx0XHRcdFx0SWY6IGFwcGx5UGFyYW0uJElmXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoYXBwbHlQYXJhbS5oYXNPd25Qcm9wZXJ0eShcIiRBcHBseVwiKSkge1xuXHRcdFx0XHRcdFx0YXBwbHlQYXJhbUNvbnZlcnRlZCA9IHtcblx0XHRcdFx0XHRcdFx0dHlwZTogXCJBcHBseVwiLFxuXHRcdFx0XHRcdFx0XHRGdW5jdGlvbjogYXBwbHlQYXJhbS4kRnVuY3Rpb24sXG5cdFx0XHRcdFx0XHRcdEFwcGx5OiBhcHBseVBhcmFtLiRBcHBseVxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGFubm90YXRpb25FeHByZXNzaW9uKGFwcGx5UGFyYW1Db252ZXJ0ZWQsIHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMsIHVuZGVmaW5lZCwgcGF0aFZpc2l0b3IpO1xuXHRcdFx0XHR9KVxuXHRcdFx0KTtcblx0XHRcdGJyZWFrO1xuXHR9XG59XG5cbi8qKlxuICogR2VuZXJpYyBoZWxwZXIgZm9yIHRoZSBjb21wYXJpc29uIG9wZXJhdGlvbnMgKGVxdWFsLCBub3RFcXVhbCwgLi4uKS5cbiAqXG4gKiBAdGVtcGxhdGUgVCBUaGUgdGFyZ2V0IHR5cGVcbiAqIEBwYXJhbSBvcGVyYXRvciBUaGUgb3BlcmF0b3IgdG8gYXBwbHlcbiAqIEBwYXJhbSBsZWZ0T3BlcmFuZCBUaGUgb3BlcmFuZCBvbiB0aGUgbGVmdCBzaWRlIG9mIHRoZSBvcGVyYXRvclxuICogQHBhcmFtIHJpZ2h0T3BlcmFuZCBUaGUgb3BlcmFuZCBvbiB0aGUgcmlnaHQgc2lkZSBvZiB0aGUgb3BlcmF0b3JcbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uPGJvb2xlYW4+fSBBbiBleHByZXNzaW9uIHJlcHJlc2VudGluZyB0aGUgY29tcGFyaXNvblxuICovXG5mdW5jdGlvbiBjb21wYXJpc29uPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihcblx0b3BlcmF0b3I6IENvbXBhcmlzb25PcGVyYXRvcixcblx0bGVmdE9wZXJhbmQ6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPixcblx0cmlnaHRPcGVyYW5kOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD5cbik6IEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRjb25zdCBsZWZ0RXhwcmVzc2lvbiA9IHdyYXBQcmltaXRpdmUobGVmdE9wZXJhbmQpO1xuXHRjb25zdCByaWdodEV4cHJlc3Npb24gPSB3cmFwUHJpbWl0aXZlKHJpZ2h0T3BlcmFuZCk7XG5cdGlmIChoYXNVbnJlc29sdmVhYmxlRXhwcmVzc2lvbihsZWZ0RXhwcmVzc2lvbiwgcmlnaHRFeHByZXNzaW9uKSkge1xuXHRcdHJldHVybiB1bnJlc29sdmVhYmxlRXhwcmVzc2lvbjtcblx0fVxuXHRpZiAoaXNDb25zdGFudChsZWZ0RXhwcmVzc2lvbikgJiYgaXNDb25zdGFudChyaWdodEV4cHJlc3Npb24pKSB7XG5cdFx0aWYgKGxlZnRFeHByZXNzaW9uLnZhbHVlID09PSB1bmRlZmluZWQgfHwgcmlnaHRFeHByZXNzaW9uLnZhbHVlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiBjb25zdGFudChsZWZ0RXhwcmVzc2lvbi52YWx1ZSA9PT0gcmlnaHRFeHByZXNzaW9uLnZhbHVlKTtcblx0XHR9XG5cblx0XHRzd2l0Y2ggKG9wZXJhdG9yKSB7XG5cdFx0XHRjYXNlIFwiIT09XCI6XG5cdFx0XHRcdHJldHVybiBjb25zdGFudChsZWZ0RXhwcmVzc2lvbi52YWx1ZSAhPT0gcmlnaHRFeHByZXNzaW9uLnZhbHVlKTtcblx0XHRcdGNhc2UgXCI8XCI6XG5cdFx0XHRcdHJldHVybiBjb25zdGFudChsZWZ0RXhwcmVzc2lvbi52YWx1ZSA8IHJpZ2h0RXhwcmVzc2lvbi52YWx1ZSk7XG5cdFx0XHRjYXNlIFwiPD1cIjpcblx0XHRcdFx0cmV0dXJuIGNvbnN0YW50KGxlZnRFeHByZXNzaW9uLnZhbHVlIDw9IHJpZ2h0RXhwcmVzc2lvbi52YWx1ZSk7XG5cdFx0XHRjYXNlIFwiPlwiOlxuXHRcdFx0XHRyZXR1cm4gY29uc3RhbnQobGVmdEV4cHJlc3Npb24udmFsdWUgPiByaWdodEV4cHJlc3Npb24udmFsdWUpO1xuXHRcdFx0Y2FzZSBcIj49XCI6XG5cdFx0XHRcdHJldHVybiBjb25zdGFudChsZWZ0RXhwcmVzc2lvbi52YWx1ZSA+PSByaWdodEV4cHJlc3Npb24udmFsdWUpO1xuXHRcdFx0Y2FzZSBcIj09PVwiOlxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuIGNvbnN0YW50KGxlZnRFeHByZXNzaW9uLnZhbHVlID09PSByaWdodEV4cHJlc3Npb24udmFsdWUpO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0X3R5cGU6IFwiQ29tcGFyaXNvblwiLFxuXHRcdFx0b3BlcmF0b3I6IG9wZXJhdG9yLFxuXHRcdFx0b3BlcmFuZDE6IGxlZnRFeHByZXNzaW9uLFxuXHRcdFx0b3BlcmFuZDI6IHJpZ2h0RXhwcmVzc2lvblxuXHRcdH07XG5cdH1cbn1cblxuLyoqXG4gKiBDb21wYXJpc29uOiBcImVxdWFsXCIgKD09PSkuXG4gKlxuICogQHRlbXBsYXRlIFQgVGhlIHRhcmdldCB0eXBlXG4gKiBAcGFyYW0gbGVmdE9wZXJhbmQgVGhlIG9wZXJhbmQgb24gdGhlIGxlZnQgc2lkZVxuICogQHBhcmFtIHJpZ2h0T3BlcmFuZCBUaGUgb3BlcmFuZCBvbiB0aGUgcmlnaHQgc2lkZSBvZiB0aGUgY29tcGFyaXNvblxuICogQHJldHVybnMge0V4cHJlc3Npb248Ym9vbGVhbj59IEFuIGV4cHJlc3Npb24gcmVwcmVzZW50aW5nIHRoZSBjb21wYXJpc29uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlcXVhbDxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oXG5cdGxlZnRPcGVyYW5kOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD4sXG5cdHJpZ2h0T3BlcmFuZDogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+XG4pOiBFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0Y29uc3QgbGVmdEV4cHJlc3Npb24gPSB3cmFwUHJpbWl0aXZlKGxlZnRPcGVyYW5kKTtcblx0Y29uc3QgcmlnaHRFeHByZXNzaW9uID0gd3JhcFByaW1pdGl2ZShyaWdodE9wZXJhbmQpO1xuXHRpZiAoaGFzVW5yZXNvbHZlYWJsZUV4cHJlc3Npb24obGVmdEV4cHJlc3Npb24sIHJpZ2h0RXhwcmVzc2lvbikpIHtcblx0XHRyZXR1cm4gdW5yZXNvbHZlYWJsZUV4cHJlc3Npb247XG5cdH1cblx0aWYgKF9jaGVja0V4cHJlc3Npb25zQXJlRXF1YWwobGVmdEV4cHJlc3Npb24sIHJpZ2h0RXhwcmVzc2lvbikpIHtcblx0XHRyZXR1cm4gY29uc3RhbnQodHJ1ZSk7XG5cdH1cblxuXHQvLyAoKGEgPT09IGMpID09PSB0cnVlKSA9PiAoYSA9PT0gYylcblx0aWYgKGxlZnRFeHByZXNzaW9uLl90eXBlID09PSBcIkNvbXBhcmlzb25cIiAmJiBpc0NvbnN0YW50KHJpZ2h0RXhwcmVzc2lvbikgJiYgcmlnaHRFeHByZXNzaW9uLnZhbHVlID09PSB0cnVlKSB7XG5cdFx0cmV0dXJuIGxlZnRFeHByZXNzaW9uO1xuXHR9IGVsc2UgaWYgKGxlZnRFeHByZXNzaW9uLl90eXBlID09PSBcIkNvbXBhcmlzb25cIiAmJiBpc0NvbnN0YW50KHJpZ2h0RXhwcmVzc2lvbikgJiYgcmlnaHRFeHByZXNzaW9uLnZhbHVlID09PSB0cnVlKSB7XG5cdFx0Ly8gKChhID09PSBjKSA9PT0gZmFsc2UpID0+ICEoYSA9PT0gYylcblx0XHRyZXR1cm4gbm90KGxlZnRFeHByZXNzaW9uKTtcblx0fSBlbHNlIGlmIChsZWZ0RXhwcmVzc2lvbi5fdHlwZSA9PT0gXCJJZkVsc2VcIiAmJiBfY2hlY2tFeHByZXNzaW9uc0FyZUVxdWFsKGxlZnRFeHByZXNzaW9uLm9uVHJ1ZSwgcmlnaHRFeHByZXNzaW9uKSkge1xuXHRcdC8vIChpZih4eHh4KSB7IGFhYSB9IGVsc2UgeyBiYmIgfSApID09PSBhYWEgKVxuXHRcdHJldHVybiBvcihsZWZ0RXhwcmVzc2lvbi5jb25kaXRpb24sIGVxdWFsKGxlZnRFeHByZXNzaW9uLm9uRmFsc2UsIHJpZ2h0RXhwcmVzc2lvbikpO1xuXHR9IGVsc2UgaWYgKGxlZnRFeHByZXNzaW9uLl90eXBlID09PSBcIklmRWxzZVwiICYmIF9jaGVja0V4cHJlc3Npb25zQXJlRXF1YWwobGVmdEV4cHJlc3Npb24ub25GYWxzZSwgcmlnaHRFeHByZXNzaW9uKSkge1xuXHRcdHJldHVybiBvcihub3QobGVmdEV4cHJlc3Npb24uY29uZGl0aW9uKSwgZXF1YWwobGVmdEV4cHJlc3Npb24ub25UcnVlLCByaWdodEV4cHJlc3Npb24pKTtcblx0fSBlbHNlIGlmIChcblx0XHRsZWZ0RXhwcmVzc2lvbi5fdHlwZSA9PT0gXCJJZkVsc2VcIiAmJlxuXHRcdGlzQ29uc3RhbnQobGVmdEV4cHJlc3Npb24ub25UcnVlKSAmJlxuXHRcdGlzQ29uc3RhbnQocmlnaHRFeHByZXNzaW9uKSAmJlxuXHRcdGlzQ29uc3RhbnQobGVmdEV4cHJlc3Npb24ub25GYWxzZSkgJiZcblx0XHQhX2NoZWNrRXhwcmVzc2lvbnNBcmVFcXVhbChsZWZ0RXhwcmVzc2lvbi5vblRydWUsIHJpZ2h0RXhwcmVzc2lvbikgJiZcblx0XHQhX2NoZWNrRXhwcmVzc2lvbnNBcmVFcXVhbChsZWZ0RXhwcmVzc2lvbi5vbkZhbHNlLCByaWdodEV4cHJlc3Npb24pXG5cdCkge1xuXHRcdHJldHVybiBjb25zdGFudChmYWxzZSk7XG5cdH1cblxuXHRyZXR1cm4gY29tcGFyaXNvbihcIj09PVwiLCBsZWZ0RXhwcmVzc2lvbiwgcmlnaHRFeHByZXNzaW9uKTtcbn1cblxuLyoqXG4gKiBDb21wYXJpc29uOiBcIm5vdCBlcXVhbFwiICghPT0pLlxuICpcbiAqIEB0ZW1wbGF0ZSBUIFRoZSB0YXJnZXQgdHlwZVxuICogQHBhcmFtIGxlZnRPcGVyYW5kIFRoZSBvcGVyYW5kIG9uIHRoZSBsZWZ0IHNpZGVcbiAqIEBwYXJhbSByaWdodE9wZXJhbmQgVGhlIG9wZXJhbmQgb24gdGhlIHJpZ2h0IHNpZGUgb2YgdGhlIGNvbXBhcmlzb25cbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uPGJvb2xlYW4+fSBBbiBleHByZXNzaW9uIHJlcHJlc2VudGluZyB0aGUgY29tcGFyaXNvblxuICovXG5leHBvcnQgZnVuY3Rpb24gbm90RXF1YWw8VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHRsZWZ0T3BlcmFuZDogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+LFxuXHRyaWdodE9wZXJhbmQ6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPlxuKTogRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdGNvbnN0IGxlZnRFeHByZXNzaW9uID0gd3JhcFByaW1pdGl2ZShsZWZ0T3BlcmFuZCk7XG5cdGNvbnN0IHJpZ2h0RXhwcmVzc2lvbiA9IHdyYXBQcmltaXRpdmUocmlnaHRPcGVyYW5kKTtcblxuXHRpZiAoX2NoZWNrRXhwcmVzc2lvbnNBcmVFcXVhbChsZWZ0RXhwcmVzc2lvbiwgcmlnaHRFeHByZXNzaW9uKSkge1xuXHRcdHJldHVybiBjb25zdGFudChmYWxzZSk7XG5cdH1cblxuXHQvLyAoKGEgPT09IGMpICE9PSB0cnVlKSA9PiAhKGEgPT09IGMpXG5cdGlmIChsZWZ0RXhwcmVzc2lvbi5fdHlwZSA9PT0gXCJDb21wYXJpc29uXCIgJiYgaXNDb25zdGFudChyaWdodEV4cHJlc3Npb24pICYmIHJpZ2h0RXhwcmVzc2lvbi52YWx1ZSA9PT0gdHJ1ZSkge1xuXHRcdHJldHVybiBub3QobGVmdEV4cHJlc3Npb24pO1xuXHR9IGVsc2UgaWYgKGxlZnRFeHByZXNzaW9uLl90eXBlID09PSBcIkNvbXBhcmlzb25cIiAmJiBpc0NvbnN0YW50KHJpZ2h0RXhwcmVzc2lvbikgJiYgcmlnaHRFeHByZXNzaW9uLnZhbHVlID09PSB0cnVlKSB7XG5cdFx0Ly8gKChhID09PSBjKSAhPT0gZmFsc2UpID0+IChhID09PSBjKVxuXHRcdHJldHVybiBsZWZ0RXhwcmVzc2lvbjtcblx0fSBlbHNlIGlmIChsZWZ0RXhwcmVzc2lvbi5fdHlwZSA9PT0gXCJJZkVsc2VcIiAmJiBfY2hlY2tFeHByZXNzaW9uc0FyZUVxdWFsKGxlZnRFeHByZXNzaW9uLm9uVHJ1ZSwgcmlnaHRFeHByZXNzaW9uKSkge1xuXHRcdHJldHVybiBhbmQobm90KGxlZnRFeHByZXNzaW9uLmNvbmRpdGlvbiksIG5vdEVxdWFsKGxlZnRFeHByZXNzaW9uLm9uRmFsc2UsIHJpZ2h0RXhwcmVzc2lvbikpO1xuXHR9IGVsc2UgaWYgKGxlZnRFeHByZXNzaW9uLl90eXBlID09PSBcIklmRWxzZVwiICYmIF9jaGVja0V4cHJlc3Npb25zQXJlRXF1YWwobGVmdEV4cHJlc3Npb24ub25GYWxzZSwgcmlnaHRFeHByZXNzaW9uKSkge1xuXHRcdHJldHVybiBhbmQobGVmdEV4cHJlc3Npb24uY29uZGl0aW9uLCBub3RFcXVhbChsZWZ0RXhwcmVzc2lvbi5vblRydWUsIHJpZ2h0RXhwcmVzc2lvbikpO1xuXHR9IGVsc2UgaWYgKFxuXHRcdGxlZnRFeHByZXNzaW9uLl90eXBlID09PSBcIklmRWxzZVwiICYmXG5cdFx0aXNDb25zdGFudChsZWZ0RXhwcmVzc2lvbi5vblRydWUpICYmXG5cdFx0aXNDb25zdGFudChyaWdodEV4cHJlc3Npb24pICYmXG5cdFx0aXNDb25zdGFudChsZWZ0RXhwcmVzc2lvbi5vbkZhbHNlKSAmJlxuXHRcdCFfY2hlY2tFeHByZXNzaW9uc0FyZUVxdWFsKGxlZnRFeHByZXNzaW9uLm9uVHJ1ZSwgcmlnaHRFeHByZXNzaW9uKSAmJlxuXHRcdCFfY2hlY2tFeHByZXNzaW9uc0FyZUVxdWFsKGxlZnRFeHByZXNzaW9uLm9uRmFsc2UsIHJpZ2h0RXhwcmVzc2lvbilcblx0KSB7XG5cdFx0Ly8gSWYgdGhlIGxlZnQgZXhwcmVzc2lvbiBpcyBhbiBpZiBlbHNlIHdoZXJlIGJvdGggb25UcnVlIGFuZCBvbkZhbHNlIGFyZSBub3QgZXF1YWxzIHRvIHRoZSByaWdodCBleHByZXNzaW9uIC0+IHNpbXBsaWZ5IGFzIHRydWVcblx0XHRyZXR1cm4gY29uc3RhbnQodHJ1ZSk7XG5cdH1cblxuXHRyZXR1cm4gY29tcGFyaXNvbihcIiE9PVwiLCBsZWZ0RXhwcmVzc2lvbiwgcmlnaHRFeHByZXNzaW9uKTtcbn1cblxuLyoqXG4gKiBDb21wYXJpc29uOiBcImdyZWF0ZXIgb3IgZXF1YWxcIiAoPj0pLlxuICpcbiAqIEB0ZW1wbGF0ZSBUIFRoZSB0YXJnZXQgdHlwZVxuICogQHBhcmFtIGxlZnRPcGVyYW5kIFRoZSBvcGVyYW5kIG9uIHRoZSBsZWZ0IHNpZGVcbiAqIEBwYXJhbSByaWdodE9wZXJhbmQgVGhlIG9wZXJhbmQgb24gdGhlIHJpZ2h0IHNpZGUgb2YgdGhlIGNvbXBhcmlzb25cbiAqIEByZXR1cm5zIHtFeHByZXNzaW9uPGJvb2xlYW4+fSBBbiBleHByZXNzaW9uIHJlcHJlc2VudGluZyB0aGUgY29tcGFyaXNvblxuICovXG5leHBvcnQgZnVuY3Rpb24gZ3JlYXRlck9yRXF1YWw8VCBleHRlbmRzIFByaW1pdGl2ZVR5cGU+KFxuXHRsZWZ0T3BlcmFuZDogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+LFxuXHRyaWdodE9wZXJhbmQ6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPlxuKTogRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdHJldHVybiBjb21wYXJpc29uKFwiPj1cIiwgbGVmdE9wZXJhbmQsIHJpZ2h0T3BlcmFuZCk7XG59XG5cbi8qKlxuICogQ29tcGFyaXNvbjogXCJncmVhdGVyIHRoYW5cIiAoPikuXG4gKlxuICogQHRlbXBsYXRlIFQgVGhlIHRhcmdldCB0eXBlXG4gKiBAcGFyYW0gbGVmdE9wZXJhbmQgVGhlIG9wZXJhbmQgb24gdGhlIGxlZnQgc2lkZVxuICogQHBhcmFtIHJpZ2h0T3BlcmFuZCBUaGUgb3BlcmFuZCBvbiB0aGUgcmlnaHQgc2lkZSBvZiB0aGUgY29tcGFyaXNvblxuICogQHJldHVybnMge0V4cHJlc3Npb248Ym9vbGVhbj59IEFuIGV4cHJlc3Npb24gcmVwcmVzZW50aW5nIHRoZSBjb21wYXJpc29uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBncmVhdGVyVGhhbjxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oXG5cdGxlZnRPcGVyYW5kOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD4sXG5cdHJpZ2h0T3BlcmFuZDogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+XG4pOiBFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0cmV0dXJuIGNvbXBhcmlzb24oXCI+XCIsIGxlZnRPcGVyYW5kLCByaWdodE9wZXJhbmQpO1xufVxuXG4vKipcbiAqIENvbXBhcmlzb246IFwibGVzcyBvciBlcXVhbFwiICg8PSkuXG4gKlxuICogQHRlbXBsYXRlIFQgVGhlIHRhcmdldCB0eXBlXG4gKiBAcGFyYW0gbGVmdE9wZXJhbmQgVGhlIG9wZXJhbmQgb24gdGhlIGxlZnQgc2lkZVxuICogQHBhcmFtIHJpZ2h0T3BlcmFuZCBUaGUgb3BlcmFuZCBvbiB0aGUgcmlnaHQgc2lkZSBvZiB0aGUgY29tcGFyaXNvblxuICogQHJldHVybnMge0V4cHJlc3Npb248Ym9vbGVhbj59IEFuIGV4cHJlc3Npb24gcmVwcmVzZW50aW5nIHRoZSBjb21wYXJpc29uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsZXNzT3JFcXVhbDxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oXG5cdGxlZnRPcGVyYW5kOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD4sXG5cdHJpZ2h0T3BlcmFuZDogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+XG4pOiBFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0cmV0dXJuIGNvbXBhcmlzb24oXCI8PVwiLCBsZWZ0T3BlcmFuZCwgcmlnaHRPcGVyYW5kKTtcbn1cblxuLyoqXG4gKiBDb21wYXJpc29uOiBcImxlc3MgdGhhblwiICg8KS5cbiAqXG4gKiBAdGVtcGxhdGUgVCBUaGUgdGFyZ2V0IHR5cGVcbiAqIEBwYXJhbSBsZWZ0T3BlcmFuZCBUaGUgb3BlcmFuZCBvbiB0aGUgbGVmdCBzaWRlXG4gKiBAcGFyYW0gcmlnaHRPcGVyYW5kIFRoZSBvcGVyYW5kIG9uIHRoZSByaWdodCBzaWRlIG9mIHRoZSBjb21wYXJpc29uXG4gKiBAcmV0dXJucyB7RXhwcmVzc2lvbjxib29sZWFuPn0gQW4gZXhwcmVzc2lvbiByZXByZXNlbnRpbmcgdGhlIGNvbXBhcmlzb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxlc3NUaGFuPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihcblx0bGVmdE9wZXJhbmQ6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPixcblx0cmlnaHRPcGVyYW5kOiBFeHByZXNzaW9uT3JQcmltaXRpdmU8VD5cbik6IEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRyZXR1cm4gY29tcGFyaXNvbihcIjxcIiwgbGVmdE9wZXJhbmQsIHJpZ2h0T3BlcmFuZCk7XG59XG5cbi8qKlxuICogSWYtdGhlbi1lbHNlIGV4cHJlc3Npb24uXG4gKlxuICogRXZhbHVhdGVzIHRvIG9uVHJ1ZSBpZiB0aGUgY29uZGl0aW9uIGV2YWx1YXRlcyB0byB0cnVlLCBlbHNlIGV2YWx1YXRlcyB0byBvbkZhbHNlLlxuICpcbiAqIEB0ZW1wbGF0ZSBUIFRoZSB0YXJnZXQgdHlwZVxuICogQHBhcmFtIGNvbmRpdGlvbiBUaGUgY29uZGl0aW9uIHRvIGV2YWx1YXRlXG4gKiBAcGFyYW0gb25UcnVlIEV4cHJlc3Npb24gcmVzdWx0IGlmIHRoZSBjb25kaXRpb24gZXZhbHVhdGVzIHRvIHRydWVcbiAqIEBwYXJhbSBvbkZhbHNlIEV4cHJlc3Npb24gcmVzdWx0IGlmIHRoZSBjb25kaXRpb24gZXZhbHVhdGVzIHRvIGZhbHNlXG4gKiBAcmV0dXJucyB7RXhwcmVzc2lvbjxUPn0gVGhlIGV4cHJlc3Npb24gdGhhdCByZXByZXNlbnRzIHRoaXMgY29uZGl0aW9uYWwgY2hlY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlmRWxzZTxUIGV4dGVuZHMgUHJpbWl0aXZlVHlwZT4oXG5cdGNvbmRpdGlvbjogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPGJvb2xlYW4+LFxuXHRvblRydWU6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUPixcblx0b25GYWxzZTogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+XG4pOiBFeHByZXNzaW9uPFQ+IHtcblx0bGV0IGNvbmRpdGlvbkV4cHJlc3Npb24gPSB3cmFwUHJpbWl0aXZlKGNvbmRpdGlvbik7XG5cdGxldCBvblRydWVFeHByZXNzaW9uID0gd3JhcFByaW1pdGl2ZShvblRydWUpO1xuXHRsZXQgb25GYWxzZUV4cHJlc3Npb24gPSB3cmFwUHJpbWl0aXZlKG9uRmFsc2UpO1xuXG5cdGlmIChoYXNVbnJlc29sdmVhYmxlRXhwcmVzc2lvbihjb25kaXRpb25FeHByZXNzaW9uLCBvblRydWVFeHByZXNzaW9uLCBvbkZhbHNlRXhwcmVzc2lvbikpIHtcblx0XHRyZXR1cm4gdW5yZXNvbHZlYWJsZUV4cHJlc3Npb247XG5cdH1cblx0Ly8gc3dhcCBicmFuY2hlcyBpZiB0aGUgY29uZGl0aW9uIGlzIGEgbmVnYXRpb25cblx0aWYgKGNvbmRpdGlvbkV4cHJlc3Npb24uX3R5cGUgPT09IFwiTm90XCIpIHtcblx0XHQvLyBpZkVsc2Uobm90KFgpLCBhLCBiKSAtLT4gaWZFbHNlKFgsIGIsIGEpXG5cdFx0W29uVHJ1ZUV4cHJlc3Npb24sIG9uRmFsc2VFeHByZXNzaW9uXSA9IFtvbkZhbHNlRXhwcmVzc2lvbiwgb25UcnVlRXhwcmVzc2lvbl07XG5cdFx0Y29uZGl0aW9uRXhwcmVzc2lvbiA9IG5vdChjb25kaXRpb25FeHByZXNzaW9uKTtcblx0fVxuXG5cdC8vIGlubGluZSBuZXN0ZWQgaWYtZWxzZSBleHByZXNzaW9uczogb25UcnVlIGJyYW5jaFxuXHQvLyBpZkVsc2UoWCwgaWZFbHNlKFgsIGEsIGIpLCBjKSA9PT4gaWZFbHNlKFgsIGEsIGMpXG5cdGlmIChvblRydWVFeHByZXNzaW9uLl90eXBlID09PSBcIklmRWxzZVwiICYmIF9jaGVja0V4cHJlc3Npb25zQXJlRXF1YWwoY29uZGl0aW9uRXhwcmVzc2lvbiwgb25UcnVlRXhwcmVzc2lvbi5jb25kaXRpb24pKSB7XG5cdFx0b25UcnVlRXhwcmVzc2lvbiA9IG9uVHJ1ZUV4cHJlc3Npb24ub25UcnVlO1xuXHR9XG5cblx0Ly8gaW5saW5lIG5lc3RlZCBpZi1lbHNlIGV4cHJlc3Npb25zOiBvbkZhbHNlIGJyYW5jaFxuXHQvLyBpZkVsc2UoWCwgYSwgaWZFbHNlKFgsIGIsIGMpKSA9PT4gaWZFbHNlKFgsIGEsIGMpXG5cdGlmIChvbkZhbHNlRXhwcmVzc2lvbi5fdHlwZSA9PT0gXCJJZkVsc2VcIiAmJiBfY2hlY2tFeHByZXNzaW9uc0FyZUVxdWFsKGNvbmRpdGlvbkV4cHJlc3Npb24sIG9uRmFsc2VFeHByZXNzaW9uLmNvbmRpdGlvbikpIHtcblx0XHRvbkZhbHNlRXhwcmVzc2lvbiA9IG9uRmFsc2VFeHByZXNzaW9uLm9uRmFsc2U7XG5cdH1cblxuXHQvLyBpbmxpbmUgbmVzdGVkIGlmLWVsc2UgZXhwcmVzc2lvbnM6IGNvbmRpdGlvblxuXHRpZiAoY29uZGl0aW9uRXhwcmVzc2lvbi5fdHlwZSA9PT0gXCJJZkVsc2VcIikge1xuXHRcdGlmIChcblx0XHRcdGlzQ29uc3RhbnQoY29uZGl0aW9uRXhwcmVzc2lvbi5vbkZhbHNlKSAmJlxuXHRcdFx0IWNvbmRpdGlvbkV4cHJlc3Npb24ub25GYWxzZS52YWx1ZSAmJlxuXHRcdFx0aXNDb25zdGFudChjb25kaXRpb25FeHByZXNzaW9uLm9uVHJ1ZSkgJiZcblx0XHRcdGNvbmRpdGlvbkV4cHJlc3Npb24ub25UcnVlLnZhbHVlXG5cdFx0KSB7XG5cdFx0XHQvLyBpZkVsc2UoaWZFbHNlKFgsIHRydWUsIGZhbHNlKSwgYSwgYikgPT0+IGlmRWxzZShYLCBhLCBiKVxuXHRcdFx0Y29uZGl0aW9uRXhwcmVzc2lvbiA9IGNvbmRpdGlvbkV4cHJlc3Npb24uY29uZGl0aW9uO1xuXHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRpc0NvbnN0YW50KGNvbmRpdGlvbkV4cHJlc3Npb24ub25GYWxzZSkgJiZcblx0XHRcdGNvbmRpdGlvbkV4cHJlc3Npb24ub25GYWxzZS52YWx1ZSAmJlxuXHRcdFx0aXNDb25zdGFudChjb25kaXRpb25FeHByZXNzaW9uLm9uVHJ1ZSkgJiZcblx0XHRcdCFjb25kaXRpb25FeHByZXNzaW9uLm9uVHJ1ZS52YWx1ZVxuXHRcdCkge1xuXHRcdFx0Ly8gaWZFbHNlKGlmRWxzZShYLCBmYWxzZSwgdHJ1ZSksIGEsIGIpID09PiBpZkVsc2Uobm90KFgpLCBhLCBiKVxuXHRcdFx0Y29uZGl0aW9uRXhwcmVzc2lvbiA9IG5vdChjb25kaXRpb25FeHByZXNzaW9uLmNvbmRpdGlvbik7XG5cdFx0fSBlbHNlIGlmIChcblx0XHRcdGlzQ29uc3RhbnQoY29uZGl0aW9uRXhwcmVzc2lvbi5vblRydWUpICYmXG5cdFx0XHQhY29uZGl0aW9uRXhwcmVzc2lvbi5vblRydWUudmFsdWUgJiZcblx0XHRcdCFpc0NvbnN0YW50KGNvbmRpdGlvbkV4cHJlc3Npb24ub25GYWxzZSlcblx0XHQpIHtcblx0XHRcdC8vIGlmRWxzZShpZkVsc2UoWCwgZmFsc2UsIGEpLCBiLCBjKSA9PT4gaWZFbHNlKGFuZChub3QoWCksIGEpLCBiLCBjKVxuXHRcdFx0Y29uZGl0aW9uRXhwcmVzc2lvbiA9IGFuZChub3QoY29uZGl0aW9uRXhwcmVzc2lvbi5jb25kaXRpb24pLCBjb25kaXRpb25FeHByZXNzaW9uLm9uRmFsc2UpO1xuXHRcdH1cblx0fVxuXG5cdC8vIGFnYWluIHN3YXAgYnJhbmNoZXMgaWYgbmVlZGVkIChpbiBjYXNlIG9uZSBvZiB0aGUgb3B0aW1pemF0aW9ucyBhYm92ZSBsZWQgdG8gYSBuZWdhdGVkIGNvbmRpdGlvbilcblx0aWYgKGNvbmRpdGlvbkV4cHJlc3Npb24uX3R5cGUgPT09IFwiTm90XCIpIHtcblx0XHQvLyBpZkVsc2Uobm90KFgpLCBhLCBiKSAtLT4gaWZFbHNlKFgsIGIsIGEpXG5cdFx0W29uVHJ1ZUV4cHJlc3Npb24sIG9uRmFsc2VFeHByZXNzaW9uXSA9IFtvbkZhbHNlRXhwcmVzc2lvbiwgb25UcnVlRXhwcmVzc2lvbl07XG5cdFx0Y29uZGl0aW9uRXhwcmVzc2lvbiA9IG5vdChjb25kaXRpb25FeHByZXNzaW9uKTtcblx0fVxuXG5cdC8vIGNvbXB1dGUgZXhwcmVzc2lvbiByZXN1bHQgZm9yIGNvbnN0YW50IGNvbmRpdGlvbnNcblx0aWYgKGlzQ29uc3RhbnQoY29uZGl0aW9uRXhwcmVzc2lvbikpIHtcblx0XHRyZXR1cm4gY29uZGl0aW9uRXhwcmVzc2lvbi52YWx1ZSA/IG9uVHJ1ZUV4cHJlc3Npb24gOiBvbkZhbHNlRXhwcmVzc2lvbjtcblx0fVxuXG5cdC8vIGNvbXB1dGUgZXhwcmVzc2lvbiByZXN1bHQgaWYgb25UcnVlIGFuZCBvbkZhbHNlIGJyYW5jaGVzIGFyZSBlcXVhbFxuXHRpZiAoX2NoZWNrRXhwcmVzc2lvbnNBcmVFcXVhbChvblRydWVFeHByZXNzaW9uLCBvbkZhbHNlRXhwcmVzc2lvbikpIHtcblx0XHRyZXR1cm4gb25UcnVlRXhwcmVzc2lvbjtcblx0fVxuXG5cdC8vIElmIGVpdGhlciB0cnVlRXhwcmVzc2lvbiBvciBmYWxzZUV4cHJlc3Npb24gaXMgYSB2YWx1ZSBlcXVhbHMgdG8gZmFsc2UgdGhlIGV4cHJlc3Npb24gY2FuIGJlIHNpbXBsaWZpZWRcblx0Ly8gSWYoQ29uZGl0aW9uKSBUaGVuIFhYWCBFbHNlIEZhbHNlIC0+IENvbmRpdGlvbiAmJiBYWFhcblx0aWYgKGlzQ29uc3RhbnQob25GYWxzZUV4cHJlc3Npb24pICYmIG9uRmFsc2VFeHByZXNzaW9uLnZhbHVlID09PSBmYWxzZSkge1xuXHRcdHJldHVybiBhbmQoY29uZGl0aW9uRXhwcmVzc2lvbiwgb25UcnVlRXhwcmVzc2lvbiBhcyBFeHByZXNzaW9uPGJvb2xlYW4+KSBhcyBFeHByZXNzaW9uPFQ+O1xuXHR9XG5cdC8vIElmKENvbmRpdGlvbikgVGhlbiBGYWxzZSBFbHNlIFhYWCAtPiAhQ29uZGl0aW9uICYmIFhYWFxuXHRpZiAoaXNDb25zdGFudChvblRydWVFeHByZXNzaW9uKSAmJiBvblRydWVFeHByZXNzaW9uLnZhbHVlID09PSBmYWxzZSkge1xuXHRcdHJldHVybiBhbmQobm90KGNvbmRpdGlvbkV4cHJlc3Npb24pLCBvbkZhbHNlRXhwcmVzc2lvbiBhcyBFeHByZXNzaW9uPGJvb2xlYW4+KSBhcyBFeHByZXNzaW9uPFQ+O1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRfdHlwZTogXCJJZkVsc2VcIixcblx0XHRjb25kaXRpb246IGNvbmRpdGlvbkV4cHJlc3Npb24sXG5cdFx0b25UcnVlOiBvblRydWVFeHByZXNzaW9uLFxuXHRcdG9uRmFsc2U6IG9uRmFsc2VFeHByZXNzaW9uXG5cdH07XG59XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgdGhlIGN1cnJlbnQgZXhwcmVzc2lvbiBoYXMgYSByZWZlcmVuY2UgdG8gdGhlIGRlZmF1bHQgbW9kZWwgKHVuZGVmaW5lZCkuXG4gKlxuICogQHBhcmFtIGV4cHJlc3Npb24gVGhlIGV4cHJlc3Npb24gdG8gZXZhbHVhdGVcbiAqIEByZXR1cm5zIHtib29sZWFufSBgdHJ1ZWAgaWYgdGhlcmUgaXMgYSByZWZlcmVuY2UgdG8gdGhlIGRlZmF1bHQgY29udGV4dFxuICovXG5mdW5jdGlvbiBoYXNSZWZlcmVuY2VUb0RlZmF1bHRDb250ZXh0KGV4cHJlc3Npb246IEV4cHJlc3Npb248YW55Pik6IGJvb2xlYW4ge1xuXHRzd2l0Y2ggKGV4cHJlc3Npb24uX3R5cGUpIHtcblx0XHRjYXNlIFwiQ29uc3RhbnRcIjpcblx0XHRjYXNlIFwiRm9ybWF0dGVyXCI6XG5cdFx0Y2FzZSBcIkNvbXBsZXhUeXBlXCI6XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0Y2FzZSBcIlNldFwiOlxuXHRcdFx0cmV0dXJuIGV4cHJlc3Npb24ub3BlcmFuZHMuc29tZShoYXNSZWZlcmVuY2VUb0RlZmF1bHRDb250ZXh0KTtcblx0XHRjYXNlIFwiQmluZGluZ1wiOlxuXHRcdFx0cmV0dXJuIGV4cHJlc3Npb24ubW9kZWxOYW1lID09PSB1bmRlZmluZWQ7XG5cdFx0Y2FzZSBcIkNvbXBhcmlzb25cIjpcblx0XHRcdHJldHVybiBoYXNSZWZlcmVuY2VUb0RlZmF1bHRDb250ZXh0KGV4cHJlc3Npb24ub3BlcmFuZDEpIHx8IGhhc1JlZmVyZW5jZVRvRGVmYXVsdENvbnRleHQoZXhwcmVzc2lvbi5vcGVyYW5kMik7XG5cdFx0Y2FzZSBcIkRlZmF1bHRCaW5kaW5nXCI6XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRjYXNlIFwiSWZFbHNlXCI6XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRoYXNSZWZlcmVuY2VUb0RlZmF1bHRDb250ZXh0KGV4cHJlc3Npb24uY29uZGl0aW9uKSB8fFxuXHRcdFx0XHRoYXNSZWZlcmVuY2VUb0RlZmF1bHRDb250ZXh0KGV4cHJlc3Npb24ub25UcnVlKSB8fFxuXHRcdFx0XHRoYXNSZWZlcmVuY2VUb0RlZmF1bHRDb250ZXh0KGV4cHJlc3Npb24ub25GYWxzZSlcblx0XHRcdCk7XG5cdFx0Y2FzZSBcIk5vdFwiOlxuXHRcdGNhc2UgXCJUcnV0aHlcIjpcblx0XHRcdHJldHVybiBoYXNSZWZlcmVuY2VUb0RlZmF1bHRDb250ZXh0KGV4cHJlc3Npb24ub3BlcmFuZCk7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG50eXBlIEZuPFQ+ID0gKCguLi5wYXJhbXM6IGFueSkgPT4gVCkgJiB7XG5cdF9fZnVuY3Rpb25OYW1lOiBzdHJpbmc7XG59O1xuXG4vKipcbiAqIEB0eXBlZGVmIFdyYXBwZWRUdXBsZVxuICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4vLyBAdHMtaWdub3JlXG50eXBlIFdyYXBwZWRUdXBsZTxUPiA9IHsgW0sgaW4ga2V5b2YgVF06IFdyYXBwZWRUdXBsZTxUW0tdPiB8IEV4cHJlc3Npb25PclByaW1pdGl2ZTxUW0tdPiB9O1xuXG4vLyBTbywgdGhpcyB3b3JrcyBidXQgSSBjYW5ub3QgZ2V0IGl0IHRvIGNvbXBpbGUgOkQsIGJ1dCBpdCBzdGlsbCBkb2VzIHdoYXQgaXMgZXhwZWN0ZWQuLi5cblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHJlZmVyZW5jZSBvciBhIGZ1bmN0aW9uIG5hbWUuXG4gKi9cbnR5cGUgRnVuY3Rpb25Pck5hbWU8VD4gPSBGbjxUPiB8IHN0cmluZztcblxuLyoqXG4gKiBGdW5jdGlvbiBwYXJhbWV0ZXJzLCBlaXRoZXIgZGVyaXZlZCBmcm9tIHRoZSBmdW5jdGlvbiBvciBhbiB1bnR5cGVkIGFycmF5LlxuICovXG50eXBlIEZ1bmN0aW9uUGFyYW1ldGVyczxULCBGIGV4dGVuZHMgRnVuY3Rpb25Pck5hbWU8VD4+ID0gRiBleHRlbmRzIEZuPFQ+ID8gUGFyYW1ldGVyczxGPiA6IGFueVtdO1xuXG4vKipcbiAqIENhbGxzIGEgZm9ybWF0dGVyIGZ1bmN0aW9uIHRvIHByb2Nlc3MgdGhlIHBhcmFtZXRlcnMuXG4gKiBJZiByZXF1aXJlQ29udGV4dCBpcyBzZXQgdG8gdHJ1ZSBhbmQgbm8gY29udGV4dCBpcyBwYXNzZWQgYSBkZWZhdWx0IGNvbnRleHQgd2lsbCBiZSBhZGRlZCBhdXRvbWF0aWNhbGx5LlxuICpcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAdGVtcGxhdGUgVVxuICogQHBhcmFtIHBhcmFtZXRlcnMgVGhlIGxpc3Qgb2YgcGFyYW1ldGVyIHRoYXQgc2hvdWxkIG1hdGNoIHRoZSB0eXBlIGFuZCBudW1iZXIgb2YgdGhlIGZvcm1hdHRlciBmdW5jdGlvblxuICogQHBhcmFtIGZvcm1hdHRlckZ1bmN0aW9uIFRoZSBmdW5jdGlvbiB0byBjYWxsXG4gKiBAcGFyYW0gW2NvbnRleHRFbnRpdHlUeXBlXSBUaGUgY29udGV4dCBlbnRpdHkgdHlwZSB0byBjb25zaWRlclxuICogQHJldHVybnMge0V4cHJlc3Npb248VD59IFRoZSBjb3JyZXNwb25kaW5nIGV4cHJlc3Npb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFJlc3VsdDxULCBVIGV4dGVuZHMgRm48VD4+KFxuXHRwYXJhbWV0ZXJzOiBXcmFwcGVkVHVwbGU8UGFyYW1ldGVyczxVPj4sXG5cdGZvcm1hdHRlckZ1bmN0aW9uOiBVLFxuXHRjb250ZXh0RW50aXR5VHlwZT86IEVudGl0eVR5cGVcbik6IEV4cHJlc3Npb248VD4ge1xuXHRjb25zdCBwYXJhbWV0ZXJFeHByZXNzaW9ucyA9IChwYXJhbWV0ZXJzIGFzIGFueVtdKS5tYXAod3JhcFByaW1pdGl2ZSk7XG5cblx0aWYgKGhhc1VucmVzb2x2ZWFibGVFeHByZXNzaW9uKC4uLnBhcmFtZXRlckV4cHJlc3Npb25zKSkge1xuXHRcdHJldHVybiB1bnJlc29sdmVhYmxlRXhwcmVzc2lvbjtcblx0fVxuXHRpZiAoISFjb250ZXh0RW50aXR5VHlwZSkge1xuXHRcdC8vIE90aGVyd2lzZSwgaWYgdGhlIGNvbnRleHQgaXMgcmVxdWlyZWQgYW5kIG5vIGNvbnRleHQgaXMgcHJvdmlkZWQgbWFrZSBzdXJlIHRvIGFkZCB0aGUgZGVmYXVsdCBiaW5kaW5nXG5cdFx0aWYgKCFwYXJhbWV0ZXJFeHByZXNzaW9ucy5zb21lKGhhc1JlZmVyZW5jZVRvRGVmYXVsdENvbnRleHQpKSB7XG5cdFx0XHRjb250ZXh0RW50aXR5VHlwZS5rZXlzLmZvckVhY2goa2V5ID0+IHBhcmFtZXRlckV4cHJlc3Npb25zLnB1c2goYmluZGluZ0V4cHJlc3Npb24oa2V5Lm5hbWUsIFwiXCIpKSk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gRm9ybWF0dGVyTmFtZSBjYW4gYmUgb2YgZm9ybWF0IHNhcC5mZS5jb3JlLnh4eCNtZXRob2ROYW1lIHRvIGhhdmUgbXVsdGlwbGUgZm9ybWF0dGVyIGluIG9uZSBjbGFzc1xuXHRjb25zdCBbZm9ybWF0dGVyQ2xhc3MsIGZvcm1hdHRlck5hbWVdID0gZm9ybWF0dGVyRnVuY3Rpb24uX19mdW5jdGlvbk5hbWUuc3BsaXQoXCIjXCIpO1xuXG5cdGlmICghIWZvcm1hdHRlck5hbWUgJiYgZm9ybWF0dGVyTmFtZS5sZW5ndGggPiAwKSB7XG5cdFx0cGFyYW1ldGVyRXhwcmVzc2lvbnMudW5zaGlmdChjb25zdGFudChmb3JtYXR0ZXJOYW1lKSk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdF90eXBlOiBcIkZvcm1hdHRlclwiLFxuXHRcdGZuOiBmb3JtYXR0ZXJDbGFzcyxcblx0XHRwYXJhbWV0ZXJzOiBwYXJhbWV0ZXJFeHByZXNzaW9uc1xuXHR9O1xufVxuXG4vKipcbiAqIENhbGxzIGEgY29tcGxleCB0eXBlICB0byBwcm9jZXNzIHRoZSBwYXJhbWV0ZXJzLlxuICogSWYgcmVxdWlyZUNvbnRleHQgaXMgc2V0IHRvIHRydWUgYW5kIG5vIGNvbnRleHQgaXMgcGFzc2VkIGEgZGVmYXVsdCBjb250ZXh0IHdpbGwgYmUgYWRkZWQgYXV0b21hdGljYWxseS5cbiAqXG4gKiBAdGVtcGxhdGUgVFxuICogQHRlbXBsYXRlIFVcbiAqIEBwYXJhbSBwYXJhbWV0ZXJzIFRoZSBsaXN0IG9mIHBhcmFtZXRlciB0aGF0IHNob3VsZCBtYXRjaCB0aGUgdHlwZSBmb3IgdGhlIGNvbXBwbGV4IHR5cGVcbiAqIEBwYXJhbSB0eXBlIFRoZSBjb21wbGV4IHR5cGUgdG8gdXNlXG4gKiBAcGFyYW0gW2NvbnRleHRFbnRpdHlUeXBlXSBUaGUgY29udGV4dCBlbnRpdHkgdHlwZSB0byBjb25zaWRlclxuICogQHJldHVybnMge0V4cHJlc3Npb248VD59IFRoZSBjb3JyZXNwb25kaW5nIGV4cHJlc3Npb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZFR5cGVJbmZvcm1hdGlvbjxULCBVIGV4dGVuZHMgRm48VD4+KFxuXHRwYXJhbWV0ZXJzOiBXcmFwcGVkVHVwbGU8UGFyYW1ldGVyczxVPj4sXG5cdHR5cGU6IHN0cmluZyxcblx0Y29udGV4dEVudGl0eVR5cGU/OiBFbnRpdHlUeXBlXG4pOiBFeHByZXNzaW9uPFQ+IHtcblx0Y29uc3QgcGFyYW1ldGVyRXhwcmVzc2lvbnMgPSAocGFyYW1ldGVycyBhcyBhbnlbXSkubWFwKHdyYXBQcmltaXRpdmUpO1xuXHRpZiAoaGFzVW5yZXNvbHZlYWJsZUV4cHJlc3Npb24oLi4ucGFyYW1ldGVyRXhwcmVzc2lvbnMpKSB7XG5cdFx0cmV0dXJuIHVucmVzb2x2ZWFibGVFeHByZXNzaW9uO1xuXHR9XG5cdC8vIElmIHRoZXJlIGlzIG9ubHkgb25lIHBhcmFtZXRlciBhbmQgaXQgaXMgYSBjb25zdGFudCBhbmQgd2UgZG9uJ3QgZXhwZWN0IHRoZSBjb250ZXh0IHRoZW4gcmV0dXJuIHRoZSBjb25zdGFudFxuXHRpZiAocGFyYW1ldGVyRXhwcmVzc2lvbnMubGVuZ3RoID09PSAxICYmIGlzQ29uc3RhbnQocGFyYW1ldGVyRXhwcmVzc2lvbnNbMF0pICYmICFjb250ZXh0RW50aXR5VHlwZSkge1xuXHRcdHJldHVybiBwYXJhbWV0ZXJFeHByZXNzaW9uc1swXTtcblx0fSBlbHNlIGlmICghIWNvbnRleHRFbnRpdHlUeXBlKSB7XG5cdFx0Ly8gT3RoZXJ3aXNlLCBpZiB0aGUgY29udGV4dCBpcyByZXF1aXJlZCBhbmQgbm8gY29udGV4dCBpcyBwcm92aWRlZCBtYWtlIHN1cmUgdG8gYWRkIHRoZSBkZWZhdWx0IGJpbmRpbmdcblx0XHRpZiAoIXBhcmFtZXRlckV4cHJlc3Npb25zLnNvbWUoaGFzUmVmZXJlbmNlVG9EZWZhdWx0Q29udGV4dCkpIHtcblx0XHRcdGNvbnRleHRFbnRpdHlUeXBlLmtleXMuZm9yRWFjaChrZXkgPT4gcGFyYW1ldGVyRXhwcmVzc2lvbnMucHVzaChiaW5kaW5nRXhwcmVzc2lvbihrZXkubmFtZSwgXCJcIikpKTtcblx0XHR9XG5cdH1cblxuXHRjb25zdCBvRm9ybWF0T3B0aW9ucyA9XG5cdFx0KHBhcmFtZXRlcnNbMF0gYXMgYW55KT8udHlwZT8uaW5kZXhPZihcInNhcC51aS5tb2RlbC5vZGF0YS50eXBlLkludFwiKSA9PT0gMCA/IHsgcGFyc2VBc1N0cmluZzogZmFsc2UsIGVtcHR5U3RyaW5nOiBcIlwiIH0gOiB7fTtcblx0cmV0dXJuIHtcblx0XHRfdHlwZTogXCJDb21wbGV4VHlwZVwiLFxuXHRcdHR5cGU6IHR5cGUsXG5cdFx0Zm9ybWF0T3B0aW9uczogb0Zvcm1hdE9wdGlvbnMsXG5cdFx0cGFyYW1ldGVyczoge30sXG5cdFx0YmluZGluZ1BhcmFtZXRlcnM6IHBhcmFtZXRlckV4cHJlc3Npb25zXG5cdH07XG59XG4vKipcbiAqIEZ1bmN0aW9uIGNhbGwsIG9wdGlvbmFsbHkgd2l0aCBhcmd1bWVudHMuXG4gKlxuICogQHBhcmFtIGZuIEZ1bmN0aW9uIG5hbWUgb3IgcmVmZXJlbmNlIHRvIGZ1bmN0aW9uXG4gKiBAcGFyYW0gcGFyYW1ldGVycyBBcmd1bWVudHNcbiAqIEBwYXJhbSBvbiBPYmplY3QgdG8gY2FsbCB0aGUgZnVuY3Rpb24gb25cbiAqIEByZXR1cm5zIHtGdW5jdGlvbkV4cHJlc3Npb248VD59IEV4cHJlc3Npb24gcmVwcmVzZW50aW5nIHRoZSBmdW5jdGlvbiBjYWxsIChub3QgdGhlIHJlc3VsdCBvZiB0aGUgZnVuY3Rpb24gY2FsbCEpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmbjxULCBVIGV4dGVuZHMgRnVuY3Rpb25Pck5hbWU8VD4+KFxuXHRmbjogVSxcblx0cGFyYW1ldGVyczogV3JhcHBlZFR1cGxlPEZ1bmN0aW9uUGFyYW1ldGVyczxULCBVPj4sXG5cdG9uPzogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPG9iamVjdD5cbik6IEZ1bmN0aW9uRXhwcmVzc2lvbjxUPiB7XG5cdGNvbnN0IGZ1bmN0aW9uTmFtZSA9IHR5cGVvZiBmbiA9PT0gXCJzdHJpbmdcIiA/IGZuIDogKGZuIGFzIEZuPFQ+KS5fX2Z1bmN0aW9uTmFtZTtcblx0cmV0dXJuIHtcblx0XHRfdHlwZTogXCJGdW5jdGlvblwiLFxuXHRcdG9iajogb24gIT09IHVuZGVmaW5lZCA/IHdyYXBQcmltaXRpdmUob24pIDogdW5kZWZpbmVkLFxuXHRcdGZuOiBmdW5jdGlvbk5hbWUsXG5cdFx0cGFyYW1ldGVyczogKHBhcmFtZXRlcnMgYXMgYW55W10pLm1hcCh3cmFwUHJpbWl0aXZlKVxuXHR9O1xufVxuXG4vKipcbiAqIFNob3J0Y3V0IGZ1bmN0aW9uIHRvIGRldGVybWluZSBpZiBhIGJpbmRpbmcgdmFsdWUgaXMgbnVsbCwgdW5kZWZpbmVkIG9yIGVtcHR5LlxuICpcbiAqIEBwYXJhbSBleHByZXNzaW9uXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gZXhwcmVzc2lvbiBldmFsdWF0aW5nIHRoZSBmYWN0IHRoYXQgdGhlIGN1cnJlbnQgZWxlbWVudCBpcyBlbXB0eVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNFbXB0eShleHByZXNzaW9uOiBFeHByZXNzaW9uPHN0cmluZz4pOiBFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0aWYgKGV4cHJlc3Npb24uX3R5cGUgPT09IFwiQ29uY2F0XCIpIHtcblx0XHRyZXR1cm4gb3IoLi4uZXhwcmVzc2lvbi5leHByZXNzaW9ucy5tYXAoaXNFbXB0eSkpO1xuXHR9XG5cdHJldHVybiBvcihlcXVhbChleHByZXNzaW9uLCBcIlwiKSwgZXF1YWwoZXhwcmVzc2lvbiwgdW5kZWZpbmVkKSwgZXF1YWwoZXhwcmVzc2lvbiwgbnVsbCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29uY2F0KC4uLmluRXhwcmVzc2lvbnM6IEV4cHJlc3Npb25PclByaW1pdGl2ZTxzdHJpbmc+W10pOiBFeHByZXNzaW9uPHN0cmluZz4ge1xuXHRjb25zdCBleHByZXNzaW9ucyA9IGluRXhwcmVzc2lvbnMubWFwKHdyYXBQcmltaXRpdmUpO1xuXHRpZiAoaGFzVW5yZXNvbHZlYWJsZUV4cHJlc3Npb24oLi4uZXhwcmVzc2lvbnMpKSB7XG5cdFx0cmV0dXJuIHVucmVzb2x2ZWFibGVFeHByZXNzaW9uO1xuXHR9XG5cdGlmIChleHByZXNzaW9ucy5ldmVyeShpc0NvbnN0YW50KSkge1xuXHRcdHJldHVybiBjb25zdGFudChcblx0XHRcdGV4cHJlc3Npb25zLnJlZHVjZSgoY29uY2F0ZW5hdGVkOiBzdHJpbmcsIHZhbHVlKSA9PiB7XG5cdFx0XHRcdHJldHVybiBjb25jYXRlbmF0ZWQgKyAodmFsdWUgYXMgQ29uc3RhbnRFeHByZXNzaW9uPGFueT4pLnZhbHVlLnRvU3RyaW5nKCk7XG5cdFx0XHR9LCBcIlwiKVxuXHRcdCk7XG5cdH1cblx0cmV0dXJuIHtcblx0XHRfdHlwZTogXCJDb25jYXRcIixcblx0XHRleHByZXNzaW9uczogZXhwcmVzc2lvbnNcblx0fTtcbn1cblxuZXhwb3J0IHR5cGUgVHJhbnNmb3JtRnVuY3Rpb24gPSA8VCBleHRlbmRzIFByaW1pdGl2ZVR5cGUgfCB1bmtub3duPihleHByZXNzaW9uUGFydDogYW55KSA9PiBFeHByZXNzaW9uPFQ+O1xuZXhwb3J0IHR5cGUgRXhwcmVzc2lvblR5cGUgPSBQaWNrPEV4cHJlc3Npb248YW55PiwgXCJfdHlwZVwiPltcIl90eXBlXCJdO1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zZm9ybVJlY3Vyc2l2ZWx5PFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlIHwgdW5rbm93bj4oXG5cdGluRXhwcmVzc2lvbjogRXhwcmVzc2lvbjxUPixcblx0ZXhwcmVzc2lvblR5cGU6IEV4cHJlc3Npb25UeXBlLFxuXHR0cmFuc2Zvcm1GdW5jdGlvbjogVHJhbnNmb3JtRnVuY3Rpb24sXG5cdGluY2x1ZGVBbGxFeHByZXNzaW9uOiBib29sZWFuID0gZmFsc2Vcbik6IEV4cHJlc3Npb248VD4ge1xuXHRsZXQgZXhwcmVzc2lvbiA9IGluRXhwcmVzc2lvbjtcblx0c3dpdGNoIChleHByZXNzaW9uLl90eXBlKSB7XG5cdFx0Y2FzZSBcIkZ1bmN0aW9uXCI6XG5cdFx0XHRleHByZXNzaW9uLnBhcmFtZXRlcnMgPSBleHByZXNzaW9uLnBhcmFtZXRlcnMubWFwKGV4cHJlc3Npb24gPT5cblx0XHRcdFx0dHJhbnNmb3JtUmVjdXJzaXZlbHkoZXhwcmVzc2lvbiwgZXhwcmVzc2lvblR5cGUsIHRyYW5zZm9ybUZ1bmN0aW9uLCBpbmNsdWRlQWxsRXhwcmVzc2lvbilcblx0XHRcdCk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiQ29uY2F0XCI6XG5cdFx0XHRleHByZXNzaW9uLmV4cHJlc3Npb25zID0gZXhwcmVzc2lvbi5leHByZXNzaW9ucy5tYXAoZXhwcmVzc2lvbiA9PlxuXHRcdFx0XHR0cmFuc2Zvcm1SZWN1cnNpdmVseShleHByZXNzaW9uLCBleHByZXNzaW9uVHlwZSwgdHJhbnNmb3JtRnVuY3Rpb24sIGluY2x1ZGVBbGxFeHByZXNzaW9uKVxuXHRcdFx0KTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJDb21wbGV4VHlwZVwiOlxuXHRcdFx0ZXhwcmVzc2lvbi5iaW5kaW5nUGFyYW1ldGVycyA9IGV4cHJlc3Npb24uYmluZGluZ1BhcmFtZXRlcnMubWFwKGV4cHJlc3Npb24gPT5cblx0XHRcdFx0dHJhbnNmb3JtUmVjdXJzaXZlbHkoZXhwcmVzc2lvbiwgZXhwcmVzc2lvblR5cGUsIHRyYW5zZm9ybUZ1bmN0aW9uLCBpbmNsdWRlQWxsRXhwcmVzc2lvbilcblx0XHRcdCk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiRm9ybWF0dGVyXCI6XG5cdFx0XHRleHByZXNzaW9uLnBhcmFtZXRlcnMgPSBleHByZXNzaW9uLnBhcmFtZXRlcnMubWFwKGV4cHJlc3Npb24gPT5cblx0XHRcdFx0dHJhbnNmb3JtUmVjdXJzaXZlbHkoZXhwcmVzc2lvbiwgZXhwcmVzc2lvblR5cGUsIHRyYW5zZm9ybUZ1bmN0aW9uLCBpbmNsdWRlQWxsRXhwcmVzc2lvbilcblx0XHRcdCk7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgXCJJZkVsc2VcIjpcblx0XHRcdGNvbnN0IG9uVHJ1ZSA9IHRyYW5zZm9ybVJlY3Vyc2l2ZWx5KGV4cHJlc3Npb24ub25UcnVlLCBleHByZXNzaW9uVHlwZSwgdHJhbnNmb3JtRnVuY3Rpb24sIGluY2x1ZGVBbGxFeHByZXNzaW9uKTtcblx0XHRcdGNvbnN0IG9uRmFsc2UgPSB0cmFuc2Zvcm1SZWN1cnNpdmVseShleHByZXNzaW9uLm9uRmFsc2UsIGV4cHJlc3Npb25UeXBlLCB0cmFuc2Zvcm1GdW5jdGlvbiwgaW5jbHVkZUFsbEV4cHJlc3Npb24pO1xuXHRcdFx0bGV0IGNvbmRpdGlvbiA9IGV4cHJlc3Npb24uY29uZGl0aW9uO1xuXHRcdFx0aWYgKGluY2x1ZGVBbGxFeHByZXNzaW9uKSB7XG5cdFx0XHRcdGNvbmRpdGlvbiA9IHRyYW5zZm9ybVJlY3Vyc2l2ZWx5KGV4cHJlc3Npb24uY29uZGl0aW9uLCBleHByZXNzaW9uVHlwZSwgdHJhbnNmb3JtRnVuY3Rpb24sIGluY2x1ZGVBbGxFeHByZXNzaW9uKTtcblx0XHRcdH1cblx0XHRcdGV4cHJlc3Npb24gPSBpZkVsc2UoY29uZGl0aW9uLCBvblRydWUsIG9uRmFsc2UpIGFzIEV4cHJlc3Npb248VD47XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiTm90XCI6XG5cdFx0XHRpZiAoaW5jbHVkZUFsbEV4cHJlc3Npb24pIHtcblx0XHRcdFx0Y29uc3Qgb3BlcmFuZCA9IHRyYW5zZm9ybVJlY3Vyc2l2ZWx5KGV4cHJlc3Npb24ub3BlcmFuZCwgZXhwcmVzc2lvblR5cGUsIHRyYW5zZm9ybUZ1bmN0aW9uLCBpbmNsdWRlQWxsRXhwcmVzc2lvbik7XG5cdFx0XHRcdGV4cHJlc3Npb24gPSBub3Qob3BlcmFuZCkgYXMgRXhwcmVzc2lvbjxUPjtcblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJUcnV0aHlcIjpcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJTZXRcIjpcblx0XHRcdGlmIChpbmNsdWRlQWxsRXhwcmVzc2lvbikge1xuXHRcdFx0XHRleHByZXNzaW9uLm9wZXJhbmRzID0gZXhwcmVzc2lvbi5vcGVyYW5kcy5tYXAoZXhwcmVzc2lvbiA9PlxuXHRcdFx0XHRcdHRyYW5zZm9ybVJlY3Vyc2l2ZWx5KGV4cHJlc3Npb24sIGV4cHJlc3Npb25UeXBlLCB0cmFuc2Zvcm1GdW5jdGlvbiwgaW5jbHVkZUFsbEV4cHJlc3Npb24pXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiQ29tcGFyaXNvblwiOlxuXHRcdFx0aWYgKGluY2x1ZGVBbGxFeHByZXNzaW9uKSB7XG5cdFx0XHRcdGNvbnN0IG9wZXJhbmQxID0gdHJhbnNmb3JtUmVjdXJzaXZlbHkoZXhwcmVzc2lvbi5vcGVyYW5kMSwgZXhwcmVzc2lvblR5cGUsIHRyYW5zZm9ybUZ1bmN0aW9uLCBpbmNsdWRlQWxsRXhwcmVzc2lvbik7XG5cdFx0XHRcdGNvbnN0IG9wZXJhbmQyID0gdHJhbnNmb3JtUmVjdXJzaXZlbHkoZXhwcmVzc2lvbi5vcGVyYW5kMiwgZXhwcmVzc2lvblR5cGUsIHRyYW5zZm9ybUZ1bmN0aW9uLCBpbmNsdWRlQWxsRXhwcmVzc2lvbik7XG5cdFx0XHRcdGV4cHJlc3Npb24gPSBjb21wYXJpc29uKGV4cHJlc3Npb24ub3BlcmF0b3IsIG9wZXJhbmQxLCBvcGVyYW5kMikgYXMgRXhwcmVzc2lvbjxUPjtcblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJEZWZhdWx0QmluZGluZ1wiOlxuXHRcdGNhc2UgXCJSZWZcIjpcblx0XHRjYXNlIFwiQmluZGluZ1wiOlxuXHRcdGNhc2UgXCJDb25zdGFudFwiOlxuXHRcdFx0Ly8gRG8gbm90aGluZ1xuXHRcdFx0YnJlYWs7XG5cdH1cblx0aWYgKGV4cHJlc3Npb25UeXBlID09PSBleHByZXNzaW9uLl90eXBlKSB7XG5cdFx0ZXhwcmVzc2lvbiA9IHRyYW5zZm9ybUZ1bmN0aW9uKGluRXhwcmVzc2lvbik7XG5cdH1cblx0cmV0dXJuIGV4cHJlc3Npb247XG59XG5cbmV4cG9ydCB0eXBlIEJpbmRpbmdFeHByZXNzaW9uPFQ+ID0gVCB8IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDb21waWxlIGFuIGV4cHJlc3Npb24gaW50byBhbiBleHByZXNzaW9uIGJpbmRpbmcuXG4gKlxuICogQHRlbXBsYXRlIFQgVGhlIHRhcmdldCB0eXBlXG4gKiBAcGFyYW0gZXhwcmVzc2lvbiBUaGUgZXhwcmVzc2lvbiB0byBjb21waWxlXG4gKiBAcGFyYW0gZW1iZWRkZWRJbkJpbmRpbmcgV2hldGhlciB0aGUgZXhwcmVzc2lvbiB0byBjb21waWxlIGlzIGVtYmVkZGVkIGludG8gYW5vdGhlciBleHByZXNzaW9uXG4gKiBAcGFyYW0ga2VlcFRhcmdldFR5cGUgS2VlcCB0aGUgdGFyZ2V0IHR5cGUgb2YgdGhlIGVtYmVkZGVkIGJpbmRpbmdzIGluc3RlYWQgb2YgY2FzdGluZyB0aGVtIHRvIGFueVxuICogQHJldHVybnMge0JpbmRpbmdFeHByZXNzaW9uPFQ+fSBUaGUgY29ycmVzcG9uZGluZyBleHByZXNzaW9uIGJpbmRpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVCaW5kaW5nPFQgZXh0ZW5kcyBQcmltaXRpdmVUeXBlPihcblx0ZXhwcmVzc2lvbjogRXhwcmVzc2lvbk9yUHJpbWl0aXZlPFQ+LFxuXHRlbWJlZGRlZEluQmluZGluZzogYm9vbGVhbiA9IGZhbHNlLFxuXHRrZWVwVGFyZ2V0VHlwZTogYm9vbGVhbiA9IGZhbHNlXG4pOiBCaW5kaW5nRXhwcmVzc2lvbjxzdHJpbmc+IHtcblx0Y29uc3QgZXhwciA9IHdyYXBQcmltaXRpdmUoZXhwcmVzc2lvbik7XG5cdGNvbnN0IGVtYmVkZGVkU2VwYXJhdG9yID0ga2VlcFRhcmdldFR5cGUgPyBcIiRcIiA6IFwiJVwiO1xuXHRsZXQgb3V0UHJvcGVydHkgPSBcIlwiO1xuXHRzd2l0Y2ggKGV4cHIuX3R5cGUpIHtcblx0XHRjYXNlIFwiVW5yZXNvbHZlYWJsZVwiOlxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHRjYXNlIFwiQ29uc3RhbnRcIjpcblx0XHRcdGlmIChleHByLnZhbHVlID09PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybiBcIm51bGxcIjtcblx0XHRcdH1cblx0XHRcdGlmIChleHByLnZhbHVlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cmV0dXJuIFwidW5kZWZpbmVkXCI7XG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZW9mIGV4cHIudmFsdWUgPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkoZXhwci52YWx1ZSkpIHtcblx0XHRcdFx0XHRjb25zdCBlbnRyaWVzID0gZXhwci52YWx1ZS5tYXAoZXhwcmVzc2lvbiA9PiBjb21waWxlQmluZGluZyhleHByZXNzaW9uLCB0cnVlKSk7XG5cdFx0XHRcdFx0cmV0dXJuIGBbJHtlbnRyaWVzLmpvaW4oXCIsIFwiKX1dYDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBPYmplY3RzXG5cdFx0XHRcdFx0Y29uc3QgbyA9IGV4cHIudmFsdWUgYXMgUGxhaW5FeHByZXNzaW9uT2JqZWN0O1xuXHRcdFx0XHRcdGNvbnN0IHByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhvKS5tYXAoa2V5ID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IHZhbHVlID0gb1trZXldO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGAke2tleX06ICR7Y29tcGlsZUJpbmRpbmcodmFsdWUsIHRydWUpfWA7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cmV0dXJuIGB7JHtwcm9wZXJ0aWVzLmpvaW4oXCIsIFwiKX19YDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZW1iZWRkZWRJbkJpbmRpbmcpIHtcblx0XHRcdFx0c3dpdGNoICh0eXBlb2YgZXhwci52YWx1ZSkge1xuXHRcdFx0XHRcdGNhc2UgXCJudW1iZXJcIjpcblx0XHRcdFx0XHRjYXNlIFwiYmlnaW50XCI6XG5cdFx0XHRcdFx0Y2FzZSBcImJvb2xlYW5cIjpcblx0XHRcdFx0XHRcdHJldHVybiBleHByLnZhbHVlLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0Y2FzZSBcInN0cmluZ1wiOlxuXHRcdFx0XHRcdFx0cmV0dXJuIGAnJHtlc2NhcGVYbWxBdHRyaWJ1dGUoZXhwci52YWx1ZS50b1N0cmluZygpKX0nYDtcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBleHByLnZhbHVlLnRvU3RyaW5nKCk7XG5cdFx0XHR9XG5cblx0XHRjYXNlIFwiUmVmXCI6XG5cdFx0XHRyZXR1cm4gZXhwci5yZWYgfHwgXCJudWxsXCI7XG5cblx0XHRjYXNlIFwiRnVuY3Rpb25cIjpcblx0XHRcdGNvbnN0IGFyZ3VtZW50U3RyaW5nID0gYCR7ZXhwci5wYXJhbWV0ZXJzLm1hcChhcmcgPT4gY29tcGlsZUJpbmRpbmcoYXJnLCB0cnVlKSkuam9pbihcIiwgXCIpfWA7XG5cdFx0XHRyZXR1cm4gZXhwci5vYmogPT09IHVuZGVmaW5lZFxuXHRcdFx0XHQ/IGAke2V4cHIuZm59KCR7YXJndW1lbnRTdHJpbmd9KWBcblx0XHRcdFx0OiBgJHtjb21waWxlQmluZGluZyhleHByLm9iaiwgdHJ1ZSl9LiR7ZXhwci5mbn0oJHthcmd1bWVudFN0cmluZ30pYDtcblx0XHRjYXNlIFwiRW1iZWRkZWRFeHByZXNzaW9uQmluZGluZ1wiOlxuXHRcdFx0aWYgKGVtYmVkZGVkSW5CaW5kaW5nKSB7XG5cdFx0XHRcdHJldHVybiBgKCR7ZXhwci52YWx1ZS5zdWJzdHIoMiwgZXhwci52YWx1ZS5sZW5ndGggLSAzKX0pYDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBgJHtleHByLnZhbHVlfWA7XG5cdFx0XHR9XG5cdFx0Y2FzZSBcIkVtYmVkZGVkQmluZGluZ1wiOlxuXHRcdFx0aWYgKGVtYmVkZGVkSW5CaW5kaW5nKSB7XG5cdFx0XHRcdHJldHVybiBgJHtlbWJlZGRlZFNlcGFyYXRvcn0ke2V4cHIudmFsdWV9YDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBgJHtleHByLnZhbHVlfWA7XG5cdFx0XHR9XG5cdFx0Y2FzZSBcIkRlZmF1bHRCaW5kaW5nXCI6XG5cdFx0Y2FzZSBcIkJpbmRpbmdcIjpcblx0XHRcdGlmIChleHByLnR5cGUgfHwgZXhwci5wYXJhbWV0ZXJzIHx8IGV4cHIudGFyZ2V0VHlwZSkge1xuXHRcdFx0XHRsZXQgb3V0QmluZGluZyA9IFwiXCI7XG5cdFx0XHRcdGlmIChlbWJlZGRlZEluQmluZGluZykge1xuXHRcdFx0XHRcdG91dEJpbmRpbmcgKz0gYCR7ZW1iZWRkZWRTZXBhcmF0b3J9YDtcblx0XHRcdFx0fVxuXHRcdFx0XHRvdXRCaW5kaW5nICs9IGB7cGF0aDonJHtleHByLm1vZGVsTmFtZSA/IGAke2V4cHIubW9kZWxOYW1lfT5gIDogXCJcIn0ke2V4cHIucGF0aH0nYDtcblx0XHRcdFx0aWYgKGV4cHIudHlwZSkge1xuXHRcdFx0XHRcdG91dEJpbmRpbmcgKz0gYCwgdHlwZTogJyR7ZXhwci50eXBlfSdgO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChleHByLmNvbnN0cmFpbnRzICYmIE9iamVjdC5rZXlzKGV4cHIuY29uc3RyYWludHMpLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRvdXRCaW5kaW5nICs9IGAsIGNvbnN0cmFpbnRzOiAke2NvbXBpbGVCaW5kaW5nKGV4cHIuY29uc3RyYWludHMpfWA7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGV4cHIuZm9ybWF0T3B0aW9ucykge1xuXHRcdFx0XHRcdG91dEJpbmRpbmcgKz0gYCwgZm9ybWF0T3B0aW9uczogJHtjb21waWxlQmluZGluZyhleHByLmZvcm1hdE9wdGlvbnMpfWA7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGV4cHIucGFyYW1ldGVycyAmJiBPYmplY3Qua2V5cyhleHByLnBhcmFtZXRlcnMpLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRvdXRCaW5kaW5nICs9IGAsIHBhcmFtZXRlcnM6ICR7Y29tcGlsZUJpbmRpbmcoZXhwci5wYXJhbWV0ZXJzKX1gO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChleHByLnRhcmdldFR5cGUpIHtcblx0XHRcdFx0XHRvdXRCaW5kaW5nICs9IGAsIHRhcmdldFR5cGU6ICcke2V4cHIudGFyZ2V0VHlwZX0nYDtcblx0XHRcdFx0fVxuXHRcdFx0XHRvdXRCaW5kaW5nICs9IFwifVwiO1xuXHRcdFx0XHRyZXR1cm4gb3V0QmluZGluZztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmIChlbWJlZGRlZEluQmluZGluZykge1xuXHRcdFx0XHRcdHJldHVybiBgJHtlbWJlZGRlZFNlcGFyYXRvcn17JHtleHByLm1vZGVsTmFtZSA/IGAke2V4cHIubW9kZWxOYW1lfT5gIDogXCJcIn0ke2V4cHIucGF0aH19YDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gYHske2V4cHIubW9kZWxOYW1lID8gYCR7ZXhwci5tb2RlbE5hbWV9PmAgOiBcIlwifSR7ZXhwci5wYXRofX1gO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRjYXNlIFwiQ29tcGFyaXNvblwiOlxuXHRcdFx0Y29uc3QgY29tcGFyaXNvblBhcnQgPSBgJHtjb21waWxlQmluZGluZyhleHByLm9wZXJhbmQxLCB0cnVlKX0gJHtleHByLm9wZXJhdG9yfSAke2NvbXBpbGVCaW5kaW5nKGV4cHIub3BlcmFuZDIsIHRydWUpfWA7XG5cdFx0XHRpZiAoZW1iZWRkZWRJbkJpbmRpbmcpIHtcblx0XHRcdFx0cmV0dXJuIGNvbXBhcmlzb25QYXJ0O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGB7PSAke2NvbXBhcmlzb25QYXJ0fX1gO1xuXG5cdFx0Y2FzZSBcIklmRWxzZVwiOlxuXHRcdFx0aWYgKGVtYmVkZGVkSW5CaW5kaW5nKSB7XG5cdFx0XHRcdHJldHVybiBgKCR7Y29tcGlsZUJpbmRpbmcoZXhwci5jb25kaXRpb24sIHRydWUpfSA/ICR7Y29tcGlsZUJpbmRpbmcoZXhwci5vblRydWUsIHRydWUpfSA6ICR7Y29tcGlsZUJpbmRpbmcoXG5cdFx0XHRcdFx0ZXhwci5vbkZhbHNlLFxuXHRcdFx0XHRcdHRydWVcblx0XHRcdFx0KX0pYDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBgez0gJHtjb21waWxlQmluZGluZyhleHByLmNvbmRpdGlvbiwgdHJ1ZSl9ID8gJHtjb21waWxlQmluZGluZyhleHByLm9uVHJ1ZSwgdHJ1ZSl9IDogJHtjb21waWxlQmluZGluZyhcblx0XHRcdFx0XHRleHByLm9uRmFsc2UsXG5cdFx0XHRcdFx0dHJ1ZVxuXHRcdFx0XHQpfX1gO1xuXHRcdFx0fVxuXG5cdFx0Y2FzZSBcIlNldFwiOlxuXHRcdFx0aWYgKGVtYmVkZGVkSW5CaW5kaW5nKSB7XG5cdFx0XHRcdHJldHVybiBgKCR7ZXhwci5vcGVyYW5kcy5tYXAoZXhwcmVzc2lvbiA9PiBjb21waWxlQmluZGluZyhleHByZXNzaW9uLCB0cnVlKSkuam9pbihgICR7ZXhwci5vcGVyYXRvcn0gYCl9KWA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gYHs9ICgke2V4cHIub3BlcmFuZHMubWFwKGV4cHJlc3Npb24gPT4gY29tcGlsZUJpbmRpbmcoZXhwcmVzc2lvbiwgdHJ1ZSkpLmpvaW4oYCAke2V4cHIub3BlcmF0b3J9IGApfSl9YDtcblx0XHRcdH1cblxuXHRcdGNhc2UgXCJDb25jYXRcIjpcblx0XHRcdGlmIChlbWJlZGRlZEluQmluZGluZykge1xuXHRcdFx0XHRyZXR1cm4gYCR7ZXhwci5leHByZXNzaW9ucy5tYXAoZXhwcmVzc2lvbiA9PiBjb21waWxlQmluZGluZyhleHByZXNzaW9uLCB0cnVlLCB0cnVlKSkuam9pbihgICsgYCl9YDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBgez0gJHtleHByLmV4cHJlc3Npb25zLm1hcChleHByZXNzaW9uID0+IGNvbXBpbGVCaW5kaW5nKGV4cHJlc3Npb24sIHRydWUsIHRydWUpKS5qb2luKGAgKyBgKX0gfWA7XG5cdFx0XHR9XG5cblx0XHRjYXNlIFwiTm90XCI6XG5cdFx0XHRpZiAoZW1iZWRkZWRJbkJpbmRpbmcpIHtcblx0XHRcdFx0cmV0dXJuIGAhJHtjb21waWxlQmluZGluZyhleHByLm9wZXJhbmQsIHRydWUpfWA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gYHs9ICEke2NvbXBpbGVCaW5kaW5nKGV4cHIub3BlcmFuZCwgdHJ1ZSl9fWA7XG5cdFx0XHR9XG5cblx0XHRjYXNlIFwiVHJ1dGh5XCI6XG5cdFx0XHRpZiAoZW1iZWRkZWRJbkJpbmRpbmcpIHtcblx0XHRcdFx0cmV0dXJuIGAhISR7Y29tcGlsZUJpbmRpbmcoZXhwci5vcGVyYW5kLCB0cnVlKX1gO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGB7PSAhISR7Y29tcGlsZUJpbmRpbmcoZXhwci5vcGVyYW5kLCB0cnVlKX19YDtcblx0XHRcdH1cblxuXHRcdGNhc2UgXCJGb3JtYXR0ZXJcIjpcblx0XHRcdGlmIChleHByLnBhcmFtZXRlcnMubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdG91dFByb3BlcnR5ICs9IGB7JHtjb21waWxlUGF0aFBhcmFtZXRlcihleHByLnBhcmFtZXRlcnNbMF0sIHRydWUpfSwgZm9ybWF0dGVyOiAnJHtleHByLmZufSd9YDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG91dFByb3BlcnR5ICs9IGB7cGFydHM6WyR7ZXhwci5wYXJhbWV0ZXJzLm1hcCgocGFyYW06IGFueSkgPT4gY29tcGlsZVBhdGhQYXJhbWV0ZXIocGFyYW0pKS5qb2luKFwiLFwiKX1dLCBmb3JtYXR0ZXI6ICcke1xuXHRcdFx0XHRcdGV4cHIuZm5cblx0XHRcdFx0fSd9YDtcblx0XHRcdH1cblx0XHRcdGlmIChlbWJlZGRlZEluQmluZGluZykge1xuXHRcdFx0XHRvdXRQcm9wZXJ0eSA9IGBcXCQke291dFByb3BlcnR5fWA7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb3V0UHJvcGVydHk7XG5cdFx0Y2FzZSBcIkNvbXBsZXhUeXBlXCI6XG5cdFx0XHRpZiAoZXhwci5iaW5kaW5nUGFyYW1ldGVycy5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0b3V0UHJvcGVydHkgKz0gYHske2NvbXBpbGVQYXRoUGFyYW1ldGVyKGV4cHIuYmluZGluZ1BhcmFtZXRlcnNbMF0sIHRydWUpfSwgdHlwZTogJyR7ZXhwci50eXBlfSd9YDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxldCBvdXRwdXRFbmQ7XG5cdFx0XHRcdC8vIHRoaXMgY29kZSBpcyBiYXNlZCBvbiBzYXAudWkubW9kZWwub2RhdGEudjQuX0Fubm90YXRpb25IZWxwZXJFeHByZXNzaW9uLmZldGNoQ3VycmVuY3lPclVuaXRcblx0XHRcdFx0c3dpdGNoIChleHByLnR5cGUpIHtcblx0XHRcdFx0XHRjYXNlIFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuVW5pdFwiOlxuXHRcdFx0XHRcdFx0b3V0cHV0RW5kID0gYCx7bW9kZTonT25lVGltZScscGF0aDonLyMjQEByZXF1ZXN0VW5pdHNPZk1lYXN1cmUnLHRhcmdldFR5cGU6J2FueSd9XSx0eXBlOidzYXAudWkubW9kZWwub2RhdGEudHlwZS5Vbml0J2A7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwic2FwLnVpLm1vZGVsLm9kYXRhLnR5cGUuQ3VycmVuY3lcIjpcblx0XHRcdFx0XHRcdG91dHB1dEVuZCA9IGAse21vZGU6J09uZVRpbWUnLHBhdGg6Jy8jI0BAcmVxdWVzdEN1cnJlbmN5Q29kZXMnLHRhcmdldFR5cGU6J2FueSd9XSx0eXBlOidzYXAudWkubW9kZWwub2RhdGEudHlwZS5DdXJyZW5jeSdgO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdG91dHB1dEVuZCA9IGBdLCB0eXBlOiAnJHtleHByLnR5cGV9J2A7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGV4cHIuZm9ybWF0T3B0aW9ucyAmJiBPYmplY3Qua2V5cyhleHByLmZvcm1hdE9wdGlvbnMpLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRvdXRwdXRFbmQgKz0gYCwgZm9ybWF0T3B0aW9uczogJHtjb21waWxlQmluZGluZyhleHByLmZvcm1hdE9wdGlvbnMpfWA7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGV4cHIucGFyYW1ldGVycyAmJiBPYmplY3Qua2V5cyhleHByLnBhcmFtZXRlcnMpLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRvdXRwdXRFbmQgKz0gYCwgcGFyYW1ldGVyczogJHtjb21waWxlQmluZGluZyhleHByLnBhcmFtZXRlcnMpfWA7XG5cdFx0XHRcdH1cblx0XHRcdFx0b3V0cHV0RW5kICs9IFwifVwiO1xuXHRcdFx0XHRvdXRQcm9wZXJ0eSArPSBge21vZGU6J1R3b1dheScsIHBhcnRzOlske2V4cHIuYmluZGluZ1BhcmFtZXRlcnNcblx0XHRcdFx0XHQubWFwKChwYXJhbTogYW55KSA9PiBjb21waWxlUGF0aFBhcmFtZXRlcihwYXJhbSkpXG5cdFx0XHRcdFx0LmpvaW4oXCIsXCIpfSR7b3V0cHV0RW5kfWA7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZW1iZWRkZWRJbkJpbmRpbmcpIHtcblx0XHRcdFx0b3V0UHJvcGVydHkgPSBgXFwkJHtvdXRQcm9wZXJ0eX1gO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG91dFByb3BlcnR5O1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRyZXR1cm4gXCJcIjtcblx0fVxufVxuXG4vKipcbiAqIENvbXBpbGUgdGhlIHBhdGggcGFyYW1ldGVyIG9mIGEgZm9ybWF0dGVyIGNhbGwuXG4gKlxuICogQHBhcmFtIGV4cHJlc3Npb24gVGhlIGJpbmRpbmcgcGFydCB0byBldmFsdWF0ZVxuICogQHBhcmFtIHNpbmdsZVBhdGggV2hldGhlciB0aGVyZSBpcyBvbmUgb3IgbXVsdGlwbGUgcGF0aCB0byBjb25zaWRlclxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHN0cmluZyBzbmlwcGV0IHRvIGluY2x1ZGUgaW4gdGhlIG92ZXJhbGwgYmluZGluZyBkZWZpbml0aW9uXG4gKi9cbmZ1bmN0aW9uIGNvbXBpbGVQYXRoUGFyYW1ldGVyKGV4cHJlc3Npb246IEV4cHJlc3Npb248YW55Piwgc2luZ2xlUGF0aDogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHtcblx0bGV0IG91dFZhbHVlID0gXCJcIjtcblx0c3dpdGNoIChleHByZXNzaW9uLl90eXBlKSB7XG5cdFx0Y2FzZSBcIkNvbnN0YW50XCI6XG5cdFx0XHRzd2l0Y2ggKHR5cGVvZiBleHByZXNzaW9uLnZhbHVlKSB7XG5cdFx0XHRcdGNhc2UgXCJudW1iZXJcIjpcblx0XHRcdFx0Y2FzZSBcImJpZ2ludFwiOlxuXHRcdFx0XHRcdG91dFZhbHVlID0gYHZhbHVlOiAke2V4cHJlc3Npb24udmFsdWUudG9TdHJpbmcoKX1gO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwic3RyaW5nXCI6XG5cdFx0XHRcdFx0b3V0VmFsdWUgPSBgdmFsdWU6ICcke2VzY2FwZVhtbEF0dHJpYnV0ZShleHByZXNzaW9uLnZhbHVlLnRvU3RyaW5nKCkpfSdgO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiYm9vbGVhblwiOlxuXHRcdFx0XHRcdG91dFZhbHVlID0gYHZhbHVlOiAnJHtleHByZXNzaW9uLnZhbHVlLnRvU3RyaW5nKCl9J2A7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0b3V0VmFsdWUgPSBcInZhbHVlOiAnJ1wiO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHNpbmdsZVBhdGgpIHtcblx0XHRcdFx0cmV0dXJuIG91dFZhbHVlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGB7JHtvdXRWYWx1ZX19YDtcblxuXHRcdGNhc2UgXCJEZWZhdWx0QmluZGluZ1wiOlxuXHRcdGNhc2UgXCJCaW5kaW5nXCI6XG5cdFx0XHRvdXRWYWx1ZSA9IGBwYXRoOicke2V4cHJlc3Npb24ubW9kZWxOYW1lID8gYCR7ZXhwcmVzc2lvbi5tb2RlbE5hbWV9PmAgOiBcIlwifSR7ZXhwcmVzc2lvbi5wYXRofSdgO1xuXG5cdFx0XHRpZiAoZXhwcmVzc2lvbi50eXBlKSB7XG5cdFx0XHRcdG91dFZhbHVlICs9IGAsIHR5cGUgOiAnJHtleHByZXNzaW9uLnR5cGV9J2A7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvdXRWYWx1ZSArPSBgLCB0YXJnZXRUeXBlIDogJ2FueSdgO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGV4cHJlc3Npb24uY29uc3RyYWludHMgJiYgT2JqZWN0LmtleXMoZXhwcmVzc2lvbi5jb25zdHJhaW50cykubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRvdXRWYWx1ZSArPSBgLCBjb25zdHJhaW50czogJHtjb21waWxlQmluZGluZyhleHByZXNzaW9uLmNvbnN0cmFpbnRzKX1gO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGV4cHJlc3Npb24uZm9ybWF0T3B0aW9ucyAmJiBPYmplY3Qua2V5cyhleHByZXNzaW9uLmZvcm1hdE9wdGlvbnMpLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0b3V0VmFsdWUgKz0gYCwgZm9ybWF0T3B0aW9uczogJHtjb21waWxlQmluZGluZyhleHByZXNzaW9uLmZvcm1hdE9wdGlvbnMpfWA7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZXhwcmVzc2lvbi5wYXJhbWV0ZXJzICYmIE9iamVjdC5rZXlzKGV4cHJlc3Npb24ucGFyYW1ldGVycykubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRvdXRWYWx1ZSArPSBgLCBwYXJhbWV0ZXJzOiAke2NvbXBpbGVCaW5kaW5nKGV4cHJlc3Npb24ucGFyYW1ldGVycyl9YDtcblx0XHRcdH1cblx0XHRcdGlmIChzaW5nbGVQYXRoKSB7XG5cdFx0XHRcdHJldHVybiBvdXRWYWx1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBgeyR7b3V0VmFsdWV9fWA7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJldHVybiBcIlwiO1xuXHR9XG59XG4iXX0=