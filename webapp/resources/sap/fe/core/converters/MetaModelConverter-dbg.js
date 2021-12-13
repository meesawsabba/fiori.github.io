/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/common/AnnotationConverter", "../helpers/StableIdHelper"], function (AnnotationConverter, StableIdHelper) {
  "use strict";

  var _exports = {};
  var generate = StableIdHelper.generate;

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function () {}; return { s: F, n: function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function (e) { throw e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function () { it = it.call(o); }, n: function () { var step = it.next(); normalCompletion = step.done; return step; }, e: function (e) { didErr = true; err = e; }, f: function () { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  var VOCABULARY_ALIAS = {
    "Org.OData.Capabilities.V1": "Capabilities",
    "Org.OData.Core.V1": "Core",
    "Org.OData.Measures.V1": "Measures",
    "com.sap.vocabularies.Common.v1": "Common",
    "com.sap.vocabularies.UI.v1": "UI",
    "com.sap.vocabularies.Session.v1": "Session",
    "com.sap.vocabularies.Analytics.v1": "Analytics",
    "com.sap.vocabularies.PersonalData.v1": "PersonalData",
    "com.sap.vocabularies.Communication.v1": "Communication"
  };
  var DefaultEnvironmentCapabilities = {
    Chart: true,
    MicroChart: true,
    UShell: true,
    IntentBasedNavigation: true
  };
  _exports.DefaultEnvironmentCapabilities = DefaultEnvironmentCapabilities;

  function parsePropertyValue(annotationObject, propertyKey, currentTarget, annotationsLists, oCapabilities) {
    var value;
    var currentPropertyTarget = currentTarget + "/" + propertyKey;
    var typeOfAnnotation = typeof annotationObject;

    if (annotationObject === null) {
      value = {
        type: "Null",
        Null: null
      };
    } else if (typeOfAnnotation === "string") {
      value = {
        type: "String",
        String: annotationObject
      };
    } else if (typeOfAnnotation === "boolean") {
      value = {
        type: "Bool",
        Bool: annotationObject
      };
    } else if (typeOfAnnotation === "number") {
      value = {
        type: "Int",
        Int: annotationObject
      };
    } else if (Array.isArray(annotationObject)) {
      value = {
        type: "Collection",
        Collection: annotationObject.map(function (subAnnotationObject, subAnnotationObjectIndex) {
          return parseAnnotationObject(subAnnotationObject, currentPropertyTarget + "/" + subAnnotationObjectIndex, annotationsLists, oCapabilities);
        })
      };

      if (annotationObject.length > 0) {
        if (annotationObject[0].hasOwnProperty("$PropertyPath")) {
          value.Collection.type = "PropertyPath";
        } else if (annotationObject[0].hasOwnProperty("$Path")) {
          value.Collection.type = "Path";
        } else if (annotationObject[0].hasOwnProperty("$NavigationPropertyPath")) {
          value.Collection.type = "NavigationPropertyPath";
        } else if (annotationObject[0].hasOwnProperty("$AnnotationPath")) {
          value.Collection.type = "AnnotationPath";
        } else if (annotationObject[0].hasOwnProperty("$Type")) {
          value.Collection.type = "Record";
        } else if (annotationObject[0].hasOwnProperty("$If")) {
          value.Collection.type = "If";
        } else if (annotationObject[0].hasOwnProperty("$Or")) {
          value.Collection.type = "Or";
        } else if (annotationObject[0].hasOwnProperty("$And")) {
          value.Collection.type = "And";
        } else if (annotationObject[0].hasOwnProperty("$Eq")) {
          value.Collection.type = "Eq";
        } else if (annotationObject[0].hasOwnProperty("$Ne")) {
          value.Collection.type = "Ne";
        } else if (annotationObject[0].hasOwnProperty("$Not")) {
          value.Collection.type = "Not";
        } else if (annotationObject[0].hasOwnProperty("$Gt")) {
          value.Collection.type = "Gt";
        } else if (annotationObject[0].hasOwnProperty("$Ge")) {
          value.Collection.type = "Ge";
        } else if (annotationObject[0].hasOwnProperty("$Lt")) {
          value.Collection.type = "Lt";
        } else if (annotationObject[0].hasOwnProperty("$Le")) {
          value.Collection.type = "Le";
        } else if (annotationObject[0].hasOwnProperty("$Apply")) {
          value.Collection.type = "Apply";
        } else if (typeof annotationObject[0] === "object") {
          // $Type is optional...
          value.Collection.type = "Record";
        } else {
          value.Collection.type = "String";
        }
      }
    } else if (annotationObject.$Path !== undefined) {
      value = {
        type: "Path",
        Path: annotationObject.$Path
      };
    } else if (annotationObject.$Decimal !== undefined) {
      value = {
        type: "Decimal",
        Decimal: parseFloat(annotationObject.$Decimal)
      };
    } else if (annotationObject.$PropertyPath !== undefined) {
      value = {
        type: "PropertyPath",
        PropertyPath: annotationObject.$PropertyPath
      };
    } else if (annotationObject.$NavigationPropertyPath !== undefined) {
      value = {
        type: "NavigationPropertyPath",
        NavigationPropertyPath: annotationObject.$NavigationPropertyPath
      };
    } else if (annotationObject.$If !== undefined) {
      value = {
        type: "If",
        If: annotationObject.$If
      };
    } else if (annotationObject.$And !== undefined) {
      value = {
        type: "And",
        And: annotationObject.$And
      };
    } else if (annotationObject.$Or !== undefined) {
      value = {
        type: "Or",
        Or: annotationObject.$Or
      };
    } else if (annotationObject.$Not !== undefined) {
      value = {
        type: "Not",
        Not: annotationObject.$Not
      };
    } else if (annotationObject.$Eq !== undefined) {
      value = {
        type: "Eq",
        Eq: annotationObject.$Eq
      };
    } else if (annotationObject.$Ne !== undefined) {
      value = {
        type: "Ne",
        Ne: annotationObject.$Ne
      };
    } else if (annotationObject.$Gt !== undefined) {
      value = {
        type: "Gt",
        Gt: annotationObject.$Gt
      };
    } else if (annotationObject.$Ge !== undefined) {
      value = {
        type: "Ge",
        Ge: annotationObject.$Ge
      };
    } else if (annotationObject.$Lt !== undefined) {
      value = {
        type: "Lt",
        Lt: annotationObject.$Lt
      };
    } else if (annotationObject.$Le !== undefined) {
      value = {
        type: "Le",
        Le: annotationObject.$Le
      };
    } else if (annotationObject.$Apply !== undefined) {
      value = {
        type: "Apply",
        Apply: annotationObject.$Apply,
        Function: annotationObject.$Function
      };
    } else if (annotationObject.$AnnotationPath !== undefined) {
      value = {
        type: "AnnotationPath",
        AnnotationPath: annotationObject.$AnnotationPath
      };
    } else if (annotationObject.$EnumMember !== undefined) {
      value = {
        type: "EnumMember",
        EnumMember: mapNameToAlias(annotationObject.$EnumMember.split("/")[0]) + "/" + annotationObject.$EnumMember.split("/")[1]
      };
    } else if (annotationObject.$Type) {
      value = {
        type: "Record",
        Record: parseAnnotationObject(annotationObject, currentTarget, annotationsLists, oCapabilities)
      };
    } else {
      value = {
        type: "Record",
        Record: parseAnnotationObject(annotationObject, currentTarget, annotationsLists, oCapabilities)
      };
    }

    return {
      name: propertyKey,
      value: value
    };
  }

  function mapNameToAlias(annotationName) {
    var _annotationName$split = annotationName.split("@"),
        _annotationName$split2 = _slicedToArray(_annotationName$split, 2),
        pathPart = _annotationName$split2[0],
        annoPart = _annotationName$split2[1];

    if (!annoPart) {
      annoPart = pathPart;
      pathPart = "";
    } else {
      pathPart += "@";
    }

    var lastDot = annoPart.lastIndexOf(".");
    return pathPart + VOCABULARY_ALIAS[annoPart.substr(0, lastDot)] + "." + annoPart.substr(lastDot + 1);
  }

  function parseAnnotationObject(annotationObject, currentObjectTarget, annotationsLists, oCapabilities) {
    var parsedAnnotationObject = {};
    var typeOfObject = typeof annotationObject;

    if (annotationObject === null) {
      parsedAnnotationObject = {
        type: "Null",
        Null: null
      };
    } else if (typeOfObject === "string") {
      parsedAnnotationObject = {
        type: "String",
        String: annotationObject
      };
    } else if (typeOfObject === "boolean") {
      parsedAnnotationObject = {
        type: "Bool",
        Bool: annotationObject
      };
    } else if (typeOfObject === "number") {
      parsedAnnotationObject = {
        type: "Int",
        Int: annotationObject
      };
    } else if (annotationObject.$AnnotationPath !== undefined) {
      parsedAnnotationObject = {
        type: "AnnotationPath",
        AnnotationPath: annotationObject.$AnnotationPath
      };
    } else if (annotationObject.$Path !== undefined) {
      parsedAnnotationObject = {
        type: "Path",
        Path: annotationObject.$Path
      };
    } else if (annotationObject.$Decimal !== undefined) {
      parsedAnnotationObject = {
        type: "Decimal",
        Decimal: parseFloat(annotationObject.$Decimal)
      };
    } else if (annotationObject.$PropertyPath !== undefined) {
      parsedAnnotationObject = {
        type: "PropertyPath",
        PropertyPath: annotationObject.$PropertyPath
      };
    } else if (annotationObject.$If !== undefined) {
      parsedAnnotationObject = {
        type: "If",
        If: annotationObject.$If
      };
    } else if (annotationObject.$And !== undefined) {
      parsedAnnotationObject = {
        type: "And",
        And: annotationObject.$And
      };
    } else if (annotationObject.$Or !== undefined) {
      parsedAnnotationObject = {
        type: "Or",
        Or: annotationObject.$Or
      };
    } else if (annotationObject.$Not !== undefined) {
      parsedAnnotationObject = {
        type: "Not",
        Not: annotationObject.$Not
      };
    } else if (annotationObject.$Eq !== undefined) {
      parsedAnnotationObject = {
        type: "Eq",
        Eq: annotationObject.$Eq
      };
    } else if (annotationObject.$Ne !== undefined) {
      parsedAnnotationObject = {
        type: "Ne",
        Ne: annotationObject.$Ne
      };
    } else if (annotationObject.$Gt !== undefined) {
      parsedAnnotationObject = {
        type: "Gt",
        Gt: annotationObject.$Gt
      };
    } else if (annotationObject.$Ge !== undefined) {
      parsedAnnotationObject = {
        type: "Ge",
        Ge: annotationObject.$Ge
      };
    } else if (annotationObject.$Lt !== undefined) {
      parsedAnnotationObject = {
        type: "Lt",
        Lt: annotationObject.$Lt
      };
    } else if (annotationObject.$Le !== undefined) {
      parsedAnnotationObject = {
        type: "Le",
        Le: annotationObject.$Le
      };
    } else if (annotationObject.$Apply !== undefined) {
      parsedAnnotationObject = {
        type: "Apply",
        Apply: annotationObject.$Apply,
        Function: annotationObject.$Function
      };
    } else if (annotationObject.$NavigationPropertyPath !== undefined) {
      parsedAnnotationObject = {
        type: "NavigationPropertyPath",
        NavigationPropertyPath: annotationObject.$NavigationPropertyPath
      };
    } else if (annotationObject.$EnumMember !== undefined) {
      parsedAnnotationObject = {
        type: "EnumMember",
        EnumMember: mapNameToAlias(annotationObject.$EnumMember.split("/")[0]) + "/" + annotationObject.$EnumMember.split("/")[1]
      };
    } else if (Array.isArray(annotationObject)) {
      var parsedAnnotationCollection = parsedAnnotationObject;
      parsedAnnotationCollection.collection = annotationObject.map(function (subAnnotationObject, subAnnotationIndex) {
        return parseAnnotationObject(subAnnotationObject, currentObjectTarget + "/" + subAnnotationIndex, annotationsLists, oCapabilities);
      });

      if (annotationObject.length > 0) {
        if (annotationObject[0].hasOwnProperty("$PropertyPath")) {
          parsedAnnotationCollection.collection.type = "PropertyPath";
        } else if (annotationObject[0].hasOwnProperty("$Path")) {
          parsedAnnotationCollection.collection.type = "Path";
        } else if (annotationObject[0].hasOwnProperty("$NavigationPropertyPath")) {
          parsedAnnotationCollection.collection.type = "NavigationPropertyPath";
        } else if (annotationObject[0].hasOwnProperty("$AnnotationPath")) {
          parsedAnnotationCollection.collection.type = "AnnotationPath";
        } else if (annotationObject[0].hasOwnProperty("$Type")) {
          parsedAnnotationCollection.collection.type = "Record";
        } else if (annotationObject[0].hasOwnProperty("$If")) {
          parsedAnnotationCollection.collection.type = "If";
        } else if (annotationObject[0].hasOwnProperty("$And")) {
          parsedAnnotationCollection.collection.type = "And";
        } else if (annotationObject[0].hasOwnProperty("$Or")) {
          parsedAnnotationCollection.collection.type = "Or";
        } else if (annotationObject[0].hasOwnProperty("$Eq")) {
          parsedAnnotationCollection.collection.type = "Eq";
        } else if (annotationObject[0].hasOwnProperty("$Ne")) {
          parsedAnnotationCollection.collection.type = "Ne";
        } else if (annotationObject[0].hasOwnProperty("$Not")) {
          parsedAnnotationCollection.collection.type = "Not";
        } else if (annotationObject[0].hasOwnProperty("$Gt")) {
          parsedAnnotationCollection.collection.type = "Gt";
        } else if (annotationObject[0].hasOwnProperty("$Ge")) {
          parsedAnnotationCollection.collection.type = "Ge";
        } else if (annotationObject[0].hasOwnProperty("$Lt")) {
          parsedAnnotationCollection.collection.type = "Lt";
        } else if (annotationObject[0].hasOwnProperty("$Le")) {
          parsedAnnotationCollection.collection.type = "Le";
        } else if (annotationObject[0].hasOwnProperty("$Apply")) {
          parsedAnnotationCollection.collection.type = "Apply";
        } else if (typeof annotationObject[0] === "object") {
          parsedAnnotationCollection.collection.type = "Record";
        } else {
          parsedAnnotationCollection.collection.type = "String";
        }
      }
    } else {
      if (annotationObject.$Type) {
        var typeValue = annotationObject.$Type;
        parsedAnnotationObject.type = typeValue; //`${typeAlias}.${typeTerm}`;
      }

      var propertyValues = [];
      Object.keys(annotationObject).forEach(function (propertyKey) {
        if (propertyKey !== "$Type" && propertyKey !== "$If" && propertyKey !== "$Apply" && propertyKey !== "$And" && propertyKey !== "$Or" && propertyKey !== "$Ne" && propertyKey !== "$Gt" && propertyKey !== "$Ge" && propertyKey !== "$Lt" && propertyKey !== "$Le" && propertyKey !== "$Not" && propertyKey !== "$Eq" && !propertyKey.startsWith("@")) {
          propertyValues.push(parsePropertyValue(annotationObject[propertyKey], propertyKey, currentObjectTarget, annotationsLists, oCapabilities));
        } else if (propertyKey.startsWith("@")) {
          // Annotation of annotation
          createAnnotationLists(_defineProperty({}, propertyKey, annotationObject[propertyKey]), currentObjectTarget, annotationsLists, oCapabilities);
        }
      });
      parsedAnnotationObject.propertyValues = propertyValues;
    }

    return parsedAnnotationObject;
  }

  function getOrCreateAnnotationList(target, annotationsLists) {
    if (!annotationsLists.hasOwnProperty(target)) {
      annotationsLists[target] = {
        target: target,
        annotations: []
      };
    }

    return annotationsLists[target];
  }

  function removeChartAnnotations(annotationObject) {
    return annotationObject.filter(function (oRecord) {
      if (oRecord.Target && oRecord.Target.$AnnotationPath) {
        return oRecord.Target.$AnnotationPath.indexOf("@com.sap.vocabularies.UI.v1.Chart") === -1;
      } else {
        return true;
      }
    });
  }

  function removeIBNAnnotations(annotationObject) {
    return annotationObject.filter(function (oRecord) {
      return oRecord.$Type !== "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation";
    });
  }

  function handlePresentationVariant(annotationObject) {
    return annotationObject.filter(function (oRecord) {
      return oRecord.$AnnotationPath !== "@com.sap.vocabularies.UI.v1.Chart";
    });
  }

  function createAnnotationLists(annotationObjects, annotationTarget, annotationLists, oCapabilities) {
    if (Object.keys(annotationObjects).length === 0) {
      return;
    }

    var outAnnotationObject = getOrCreateAnnotationList(annotationTarget, annotationLists);

    if (!oCapabilities.MicroChart) {
      delete annotationObjects["@com.sap.vocabularies.UI.v1.Chart"];
    }

    var _loop = function (_annotationKey) {
      var annotationObject = annotationObjects[_annotationKey];

      switch (_annotationKey) {
        case "@com.sap.vocabularies.UI.v1.HeaderFacets":
          if (!oCapabilities.MicroChart) {
            annotationObject = removeChartAnnotations(annotationObject);
            annotationObjects[_annotationKey] = annotationObject;
          }

          break;

        case "@com.sap.vocabularies.UI.v1.Identification":
          if (!oCapabilities.IntentBasedNavigation) {
            annotationObject = removeIBNAnnotations(annotationObject);
            annotationObjects[_annotationKey] = annotationObject;
          }

          break;

        case "@com.sap.vocabularies.UI.v1.LineItem":
          if (!oCapabilities.IntentBasedNavigation) {
            annotationObject = removeIBNAnnotations(annotationObject);
            annotationObjects[_annotationKey] = annotationObject;
          }

          if (!oCapabilities.MicroChart) {
            annotationObject = removeChartAnnotations(annotationObject);
            annotationObjects[_annotationKey] = annotationObject;
          }

          break;

        case "@com.sap.vocabularies.UI.v1.FieldGroup":
          if (!oCapabilities.IntentBasedNavigation) {
            annotationObject.Data = removeIBNAnnotations(annotationObject.Data);
            annotationObjects[_annotationKey] = annotationObject;
          }

          if (!oCapabilities.MicroChart) {
            annotationObject.Data = removeChartAnnotations(annotationObject.Data);
            annotationObjects[_annotationKey] = annotationObject;
          }

          break;

        case "@com.sap.vocabularies.UI.v1.PresentationVariant":
          if (!oCapabilities.Chart && annotationObject.Visualizations) {
            annotationObject.Visualizations = handlePresentationVariant(annotationObject.Visualizations);
            annotationObjects[_annotationKey] = annotationObject;
          }

          break;

        default:
          break;
      }

      var currentOutAnnotationObject = outAnnotationObject; // Check for annotation of annotation

      var annotationOfAnnotationSplit = _annotationKey.split("@");

      if (annotationOfAnnotationSplit.length > 2) {
        currentOutAnnotationObject = getOrCreateAnnotationList(annotationTarget + "@" + annotationOfAnnotationSplit[1], annotationLists);
        _annotationKey = annotationOfAnnotationSplit[2];
      } else {
        _annotationKey = annotationOfAnnotationSplit[1];
      }

      var annotationQualifierSplit = _annotationKey.split("#");

      var qualifier = annotationQualifierSplit[1];
      _annotationKey = annotationQualifierSplit[0];
      var parsedAnnotationObject = {
        term: "".concat(_annotationKey),
        qualifier: qualifier
      };
      var currentAnnotationTarget = annotationTarget + "@" + parsedAnnotationObject.term;

      if (qualifier) {
        currentAnnotationTarget += "#" + qualifier;
      }

      var isCollection = false;
      var typeofAnnotation = typeof annotationObject;

      if (annotationObject === null) {
        parsedAnnotationObject.value = {
          type: "Bool",
          Bool: annotationObject
        };
      } else if (typeofAnnotation === "string") {
        parsedAnnotationObject.value = {
          type: "String",
          String: annotationObject
        };
      } else if (typeofAnnotation === "boolean") {
        parsedAnnotationObject.value = {
          type: "Bool",
          Bool: annotationObject
        };
      } else if (typeofAnnotation === "number") {
        parsedAnnotationObject.value = {
          type: "Int",
          Int: annotationObject
        };
      } else if (annotationObject.$If !== undefined) {
        parsedAnnotationObject.value = {
          type: "If",
          If: annotationObject.$If
        };
      } else if (annotationObject.$And !== undefined) {
        parsedAnnotationObject.value = {
          type: "And",
          And: annotationObject.$And
        };
      } else if (annotationObject.$Or !== undefined) {
        parsedAnnotationObject.value = {
          type: "Or",
          Or: annotationObject.$Or
        };
      } else if (annotationObject.$Not !== undefined) {
        parsedAnnotationObject.value = {
          type: "Not",
          Not: annotationObject.$Not
        };
      } else if (annotationObject.$Eq !== undefined) {
        parsedAnnotationObject.value = {
          type: "Eq",
          Eq: annotationObject.$Eq
        };
      } else if (annotationObject.$Ne !== undefined) {
        parsedAnnotationObject.value = {
          type: "Ne",
          Ne: annotationObject.$Ne
        };
      } else if (annotationObject.$Gt !== undefined) {
        parsedAnnotationObject.value = {
          type: "Gt",
          Gt: annotationObject.$Gt
        };
      } else if (annotationObject.$Ge !== undefined) {
        parsedAnnotationObject.value = {
          type: "Ge",
          Ge: annotationObject.$Ge
        };
      } else if (annotationObject.$Lt !== undefined) {
        parsedAnnotationObject.value = {
          type: "Lt",
          Lt: annotationObject.$Lt
        };
      } else if (annotationObject.$Le !== undefined) {
        parsedAnnotationObject.value = {
          type: "Le",
          Le: annotationObject.$Le
        };
      } else if (annotationObject.$Apply !== undefined) {
        parsedAnnotationObject.value = {
          type: "Apply",
          Apply: annotationObject.$Apply,
          Function: annotationObject.$Function
        };
      } else if (annotationObject.$Path !== undefined) {
        parsedAnnotationObject.value = {
          type: "Path",
          Path: annotationObject.$Path
        };
      } else if (annotationObject.$AnnotationPath !== undefined) {
        parsedAnnotationObject.value = {
          type: "AnnotationPath",
          AnnotationPath: annotationObject.$AnnotationPath
        };
      } else if (annotationObject.$Decimal !== undefined) {
        parsedAnnotationObject.value = {
          type: "Decimal",
          Decimal: parseFloat(annotationObject.$Decimal)
        };
      } else if (annotationObject.$EnumMember !== undefined) {
        parsedAnnotationObject.value = {
          type: "EnumMember",
          EnumMember: mapNameToAlias(annotationObject.$EnumMember.split("/")[0]) + "/" + annotationObject.$EnumMember.split("/")[1]
        };
      } else if (Array.isArray(annotationObject)) {
        isCollection = true;
        parsedAnnotationObject.collection = annotationObject.map(function (subAnnotationObject, subAnnotationIndex) {
          return parseAnnotationObject(subAnnotationObject, currentAnnotationTarget + "/" + subAnnotationIndex, annotationLists, oCapabilities);
        });

        if (annotationObject.length > 0) {
          if (annotationObject[0].hasOwnProperty("$PropertyPath")) {
            parsedAnnotationObject.collection.type = "PropertyPath";
          } else if (annotationObject[0].hasOwnProperty("$Path")) {
            parsedAnnotationObject.collection.type = "Path";
          } else if (annotationObject[0].hasOwnProperty("$NavigationPropertyPath")) {
            parsedAnnotationObject.collection.type = "NavigationPropertyPath";
          } else if (annotationObject[0].hasOwnProperty("$AnnotationPath")) {
            parsedAnnotationObject.collection.type = "AnnotationPath";
          } else if (annotationObject[0].hasOwnProperty("$Type")) {
            parsedAnnotationObject.collection.type = "Record";
          } else if (annotationObject[0].hasOwnProperty("$If")) {
            parsedAnnotationObject.collection.type = "If";
          } else if (annotationObject[0].hasOwnProperty("$Or")) {
            parsedAnnotationObject.collection.type = "Or";
          } else if (annotationObject[0].hasOwnProperty("$Eq")) {
            parsedAnnotationObject.collection.type = "Eq";
          } else if (annotationObject[0].hasOwnProperty("$Ne")) {
            parsedAnnotationObject.collection.type = "Ne";
          } else if (annotationObject[0].hasOwnProperty("$Not")) {
            parsedAnnotationObject.collection.type = "Not";
          } else if (annotationObject[0].hasOwnProperty("$Gt")) {
            parsedAnnotationObject.collection.type = "Gt";
          } else if (annotationObject[0].hasOwnProperty("$Ge")) {
            parsedAnnotationObject.collection.type = "Ge";
          } else if (annotationObject[0].hasOwnProperty("$Lt")) {
            parsedAnnotationObject.collection.type = "Lt";
          } else if (annotationObject[0].hasOwnProperty("$Le")) {
            parsedAnnotationObject.collection.type = "Le";
          } else if (annotationObject[0].hasOwnProperty("$And")) {
            parsedAnnotationObject.collection.type = "And";
          } else if (annotationObject[0].hasOwnProperty("$Apply")) {
            parsedAnnotationObject.collection.type = "Apply";
          } else if (typeof annotationObject[0] === "object") {
            parsedAnnotationObject.collection.type = "Record";
          } else {
            parsedAnnotationObject.collection.type = "String";
          }
        }
      } else {
        var record = {
          propertyValues: []
        };

        if (annotationObject.$Type) {
          var typeValue = annotationObject.$Type;
          record.type = "".concat(typeValue);
        }

        var propertyValues = [];

        for (var propertyKey in annotationObject) {
          if (propertyKey !== "$Type" && !propertyKey.startsWith("@")) {
            propertyValues.push(parsePropertyValue(annotationObject[propertyKey], propertyKey, currentAnnotationTarget, annotationLists, oCapabilities));
          } else if (propertyKey.startsWith("@")) {
            // Annotation of record
            createAnnotationLists(_defineProperty({}, propertyKey, annotationObject[propertyKey]), currentAnnotationTarget, annotationLists, oCapabilities);
          }
        }

        record.propertyValues = propertyValues;
        parsedAnnotationObject.record = record;
      }

      parsedAnnotationObject.isCollection = isCollection;
      currentOutAnnotationObject.annotations.push(parsedAnnotationObject);
      annotationKey = _annotationKey;
    };

    for (var annotationKey in annotationObjects) {
      _loop(annotationKey);
    }
  }

  function prepareProperty(propertyDefinition, entityTypeObject, propertyName) {
    var propertyObject = {
      _type: "Property",
      name: propertyName,
      fullyQualifiedName: "".concat(entityTypeObject.fullyQualifiedName, "/").concat(propertyName),
      type: propertyDefinition.$Type,
      maxLength: propertyDefinition.$MaxLength,
      precision: propertyDefinition.$Precision,
      scale: propertyDefinition.$Scale,
      nullable: propertyDefinition.$Nullable
    };
    return propertyObject;
  }

  function prepareNavigationProperty(navPropertyDefinition, entityTypeObject, navPropertyName) {
    var referentialConstraint = [];

    if (navPropertyDefinition.$ReferentialConstraint) {
      referentialConstraint = Object.keys(navPropertyDefinition.$ReferentialConstraint).map(function (sourcePropertyName) {
        return {
          sourceTypeName: entityTypeObject.name,
          sourceProperty: sourcePropertyName,
          targetTypeName: navPropertyDefinition.$Type,
          targetProperty: navPropertyDefinition.$ReferentialConstraint[sourcePropertyName]
        };
      });
    }

    var navigationProperty = {
      _type: "NavigationProperty",
      name: navPropertyName,
      fullyQualifiedName: "".concat(entityTypeObject.fullyQualifiedName, "/").concat(navPropertyName),
      partner: navPropertyDefinition.$Partner,
      isCollection: navPropertyDefinition.$isCollection ? navPropertyDefinition.$isCollection : false,
      containsTarget: navPropertyDefinition.$ContainsTarget,
      targetTypeName: navPropertyDefinition.$Type,
      referentialConstraint: referentialConstraint
    };
    return navigationProperty;
  }

  function prepareEntitySet(entitySetDefinition, entitySetName, entityContainerName) {
    var entitySetObject = {
      _type: "EntitySet",
      name: entitySetName,
      navigationPropertyBinding: {},
      entityTypeName: entitySetDefinition.$Type,
      fullyQualifiedName: "".concat(entityContainerName, "/").concat(entitySetName)
    };
    return entitySetObject;
  }

  function prepareSingleton(singletonDefinition, singletonName, entityContainerName) {
    var singletonObject = {
      _type: "Singleton",
      name: singletonName,
      navigationPropertyBinding: {},
      typeName: singletonDefinition.$Type,
      fullyQualifiedName: "".concat(entityContainerName, "/").concat(singletonName),
      nullable: true
    };
    return singletonObject;
  }

  function prepareComplexType(complexTypeDefinition, complexTypeName, namespace) {
    var complexTypeObject = {
      _type: "ComplexType",
      name: complexTypeName.replace(namespace + ".", ""),
      fullyQualifiedName: complexTypeName,
      properties: [],
      navigationProperties: []
    };
    var complexTypeProperties = Object.keys(complexTypeDefinition).filter(function (propertyNameOrNot) {
      if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
        return complexTypeDefinition[propertyNameOrNot].$kind === "Property";
      }
    }).sort(function (a, b) {
      return a > b ? 1 : -1;
    }).map(function (propertyName) {
      return prepareProperty(complexTypeDefinition[propertyName], complexTypeObject, propertyName);
    });
    complexTypeObject.properties = complexTypeProperties;
    var complexTypeNavigationProperties = Object.keys(complexTypeDefinition).filter(function (propertyNameOrNot) {
      if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
        return complexTypeDefinition[propertyNameOrNot].$kind === "NavigationProperty";
      }
    }).sort(function (a, b) {
      return a > b ? 1 : -1;
    }).map(function (navPropertyName) {
      return prepareNavigationProperty(complexTypeDefinition[navPropertyName], complexTypeObject, navPropertyName);
    });
    complexTypeObject.navigationProperties = complexTypeNavigationProperties;
    return complexTypeObject;
  }

  function prepareEntityKeys(entityTypeDefinition, oMetaModelData) {
    if (!entityTypeDefinition.$Key && entityTypeDefinition.$BaseType) {
      return prepareEntityKeys(oMetaModelData["".concat(entityTypeDefinition.$BaseType)], oMetaModelData);
    }

    return entityTypeDefinition.$Key || []; //handling of entity types without key as well as basetype
  }

  function prepareEntityType(entityTypeDefinition, entityTypeName, namespace, metaModelData) {
    var entityKeys = prepareEntityKeys(entityTypeDefinition, metaModelData);
    var entityTypeObject = {
      _type: "EntityType",
      name: entityTypeName.replace(namespace + ".", ""),
      fullyQualifiedName: entityTypeName,
      keys: [],
      entityProperties: [],
      navigationProperties: []
    };
    var entityProperties = Object.keys(entityTypeDefinition).filter(function (propertyNameOrNot) {
      if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
        return entityTypeDefinition[propertyNameOrNot].$kind === "Property";
      }
    }).map(function (propertyName) {
      return prepareProperty(entityTypeDefinition[propertyName], entityTypeObject, propertyName);
    });
    var navigationProperties = Object.keys(entityTypeDefinition).filter(function (propertyNameOrNot) {
      if (propertyNameOrNot != "$Key" && propertyNameOrNot != "$kind") {
        return entityTypeDefinition[propertyNameOrNot].$kind === "NavigationProperty";
      }
    }).map(function (navPropertyName) {
      return prepareNavigationProperty(entityTypeDefinition[navPropertyName], entityTypeObject, navPropertyName);
    });
    entityTypeObject.keys = entityKeys.map(function (entityKey) {
      return entityProperties.find(function (property) {
        return property.name === entityKey;
      });
    }).filter(function (property) {
      return property !== undefined;
    });
    entityTypeObject.entityProperties = entityProperties;
    entityTypeObject.navigationProperties = navigationProperties;
    return entityTypeObject;
  }

  function prepareAction(actionName, actionRawData, namespace, entityContainerName) {
    var actionEntityType = "";
    var actionFQN = "".concat(actionName);
    var actionShortName = actionName.substr(namespace.length + 1);

    if (actionRawData.$IsBound) {
      var bindingParameter = actionRawData.$Parameter[0];
      actionEntityType = bindingParameter.$Type;

      if (bindingParameter.$isCollection === true) {
        actionFQN = "".concat(actionName, "(Collection(").concat(actionEntityType, "))");
      } else {
        actionFQN = "".concat(actionName, "(").concat(actionEntityType, ")");
      }
    } else {
      actionFQN = "".concat(entityContainerName, "/").concat(actionShortName);
    }

    var parameters = actionRawData.$Parameter || [];
    return {
      _type: "Action",
      name: actionShortName,
      fullyQualifiedName: actionFQN,
      isBound: actionRawData.$IsBound,
      sourceType: actionEntityType,
      returnType: actionRawData.$ReturnType ? actionRawData.$ReturnType.$Type : "",
      parameters: parameters.map(function (param) {
        return {
          _type: "ActionParameter",
          isEntitySet: param.$Type === actionRawData.$EntitySetPath,
          fullyQualifiedName: "".concat(actionFQN, "/").concat(param.$Name),
          type: param.$Type // TODO missing properties ?

        };
      })
    };
  }

  function prepareEntityTypes(oMetaModel) {
    var oCapabilities = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DefaultEnvironmentCapabilities;
    var oMetaModelData = oMetaModel.getObject("/$");
    var annotationLists = {};
    var entityTypes = [];
    var entitySets = [];
    var singletons = [];
    var complexTypes = [];
    var entityContainerName = oMetaModelData.$EntityContainer;
    var namespace = "";
    var schemaKeys = Object.keys(oMetaModelData).filter(function (metamodelKey) {
      return oMetaModelData[metamodelKey].$kind === "Schema";
    });

    if (schemaKeys && schemaKeys.length > 0) {
      namespace = schemaKeys[0].substr(0, schemaKeys[0].length - 1);
    } else if (entityTypes && entityTypes.length) {
      namespace = entityTypes[0].fullyQualifiedName.replace(entityTypes[0].name, "");
      namespace = namespace.substr(0, namespace.length - 1);
    }

    Object.keys(oMetaModelData).forEach(function (sObjectName) {
      if (sObjectName !== "$kind") {
        switch (oMetaModelData[sObjectName].$kind) {
          case "EntityType":
            var entityType = prepareEntityType(oMetaModelData[sObjectName], sObjectName, namespace, oMetaModelData); // Check if there are filter facets defined for the entityType and if yes, check if all of them have an ID
            // The ID is optional, but it is internally taken for grouping filter fields and if it's not present
            // a fallback ID needs to be generated here.

            if (oMetaModelData.$Annotations[entityType.fullyQualifiedName] && oMetaModelData.$Annotations[entityType.fullyQualifiedName]["@com.sap.vocabularies.UI.v1.FilterFacets"]) {
              oMetaModelData.$Annotations[entityType.fullyQualifiedName]["@com.sap.vocabularies.UI.v1.FilterFacets"].forEach(function (filterFacetAnnotation) {
                filterFacetAnnotation.ID = filterFacetAnnotation.ID || generate([{
                  Facet: filterFacetAnnotation
                }]);
              });
            }

            entityType.entityProperties.forEach(function (entityProperty) {
              if (!oMetaModelData.$Annotations[entityProperty.fullyQualifiedName]) {
                oMetaModelData.$Annotations[entityProperty.fullyQualifiedName] = {};
              }

              if (!oMetaModelData.$Annotations[entityProperty.fullyQualifiedName]["@com.sap.vocabularies.UI.v1.DataFieldDefault"]) {
                oMetaModelData.$Annotations[entityProperty.fullyQualifiedName]["@com.sap.vocabularies.UI.v1.DataFieldDefault"] = {
                  $Type: "com.sap.vocabularies.UI.v1.DataField",
                  Value: {
                    $Path: entityProperty.name
                  }
                };
              }
            });
            entityTypes.push(entityType);
            break;

          case "ComplexType":
            var complexType = prepareComplexType(oMetaModelData[sObjectName], sObjectName, namespace);
            complexTypes.push(complexType);
            break;
        }
      }
    });
    var oEntityContainer = oMetaModelData[entityContainerName];
    Object.keys(oEntityContainer).forEach(function (sObjectName) {
      if (sObjectName !== "$kind") {
        switch (oEntityContainer[sObjectName].$kind) {
          case "EntitySet":
            var entitySet = prepareEntitySet(oEntityContainer[sObjectName], sObjectName, entityContainerName);
            entitySets.push(entitySet);
            break;

          case "Singleton":
            var singleton = prepareSingleton(oEntityContainer[sObjectName], sObjectName, entityContainerName);
            singletons.push(singleton);
            break;
        }
      }
    });
    var entityContainer = {};

    if (entityContainerName) {
      entityContainer = {
        name: entityContainerName.replace(namespace + ".", ""),
        fullyQualifiedName: entityContainerName
      };
    }

    entitySets.forEach(function (entitySet) {
      var navPropertyBindings = oEntityContainer[entitySet.name].$NavigationPropertyBinding;

      if (navPropertyBindings) {
        Object.keys(navPropertyBindings).forEach(function (navPropName) {
          var targetEntitySet = entitySets.find(function (entitySetName) {
            return entitySetName.name === navPropertyBindings[navPropName];
          });

          if (targetEntitySet) {
            entitySet.navigationPropertyBinding[navPropName] = targetEntitySet;
          }
        });
      }
    });
    var actions = Object.keys(oMetaModelData).filter(function (key) {
      return Array.isArray(oMetaModelData[key]) && oMetaModelData[key].length > 0 && oMetaModelData[key][0].$kind === "Action";
    }).reduce(function (outActions, actionName) {
      var actions = oMetaModelData[actionName];
      actions.forEach(function (action) {
        outActions.push(prepareAction(actionName, action, namespace, entityContainerName));
      });
      return outActions;
    }, []);

    for (var target in oMetaModelData.$Annotations) {
      createAnnotationLists(oMetaModelData.$Annotations[target], target, annotationLists, oCapabilities);
    } // Sort by target length


    var outAnnotationLists = Object.keys(annotationLists).sort(function (a, b) {
      return a.length >= b.length ? 1 : -1;
    }).map(function (sAnnotationName) {
      return annotationLists[sAnnotationName];
    });
    var references = [];
    return {
      identification: "metamodelResult",
      version: "4.0",
      schema: {
        entityContainer: entityContainer,
        entitySets: entitySets,
        entityTypes: entityTypes,
        complexTypes: complexTypes,
        singletons: singletons,
        associations: [],
        actions: actions,
        namespace: namespace,
        annotations: {
          "metamodelResult": outAnnotationLists
        }
      },
      references: references
    };
  }

  _exports.prepareEntityTypes = prepareEntityTypes;
  var mMetaModelMap = {};
  /**
   * Convert the ODataMetaModel into another format that allow for easy manipulation of the annotations.
   *
   * @param {ODataMetaModel} oMetaModel The current oDataMetaModel
   * @param oCapabilities The current capabilities
   * @returns {ConverterOutput} An object containing object like annotation
   */

  function convertTypes(oMetaModel, oCapabilities) {
    var sMetaModelId = oMetaModel.id;

    if (!mMetaModelMap.hasOwnProperty(sMetaModelId)) {
      var parsedOutput = prepareEntityTypes(oMetaModel, oCapabilities);
      mMetaModelMap[sMetaModelId] = AnnotationConverter.convertTypes(parsedOutput);
    }

    return mMetaModelMap[sMetaModelId];
  }

  _exports.convertTypes = convertTypes;

  function deleteModelCacheData(oMetaModel) {
    delete mMetaModelMap[oMetaModel.id];
  }

  _exports.deleteModelCacheData = deleteModelCacheData;

  function convertMetaModelContext(oMetaModelContext) {
    var bIncludeVisitedObjects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var oConverterOutput = convertTypes(oMetaModelContext.getModel());
    var sPath = oMetaModelContext.getPath();
    var aPathSplit = sPath.split("/");
    var targetEntitySet = oConverterOutput.entitySets.find(function (entitySet) {
      return entitySet.name === aPathSplit[1];
    });
    var relativePath = aPathSplit.slice(2).join("/");
    var localObjects = [targetEntitySet];

    while (relativePath && relativePath.length > 0 && relativePath.startsWith("$NavigationPropertyBinding")) {
      var _sNavPropToCheck;

      var relativeSplit = relativePath.split("/");
      var idx = 0;
      var currentEntitySet = void 0,
          sNavPropToCheck = void 0;
      relativeSplit = relativeSplit.slice(1); // Removing "$NavigationPropertyBinding"

      while (!currentEntitySet && relativeSplit.length > idx && relativeSplit[idx] !== "$NavigationPropertyBinding") {
        // Finding the correct entitySet for the navigaiton property binding example: "Set/_SalesOrder"
        sNavPropToCheck = relativeSplit.slice(0, idx + 1).join("/");
        currentEntitySet = targetEntitySet && targetEntitySet.navigationPropertyBinding[sNavPropToCheck];
        idx++;
      }

      if (!currentEntitySet) {
        // Fall back to Single nav prop if entitySet is not found.
        sNavPropToCheck = relativeSplit[0];
      }

      var aNavProps = ((_sNavPropToCheck = sNavPropToCheck) === null || _sNavPropToCheck === void 0 ? void 0 : _sNavPropToCheck.split("/")) || [];
      var targetEntityType = targetEntitySet && targetEntitySet.entityType;

      var _iterator = _createForOfIteratorHelper(aNavProps),
          _step;

      try {
        var _loop2 = function () {
          var sNavProp = _step.value;
          // Pushing all nav props to the visited objects. example: "Set", "_SalesOrder" for "Set/_SalesOrder"(in NavigationPropertyBinding)
          var targetNavProp = targetEntityType && targetEntityType.navigationProperties.find(function (navProp) {
            return navProp.name === sNavProp;
          });

          if (targetNavProp) {
            localObjects.push(targetNavProp);
            targetEntityType = targetNavProp.targetType;
          } else {
            return "break";
          }
        };

        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _ret = _loop2();

          if (_ret === "break") break;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      targetEntitySet = targetEntitySet && currentEntitySet || targetEntitySet && targetEntitySet.navigationPropertyBinding[relativeSplit[0]];

      if (targetEntitySet) {
        // Pushing the target entitySet to visited objects
        localObjects.push(targetEntitySet);
      } // Re-calculating the relative path


      relativePath = relativeSplit.slice(aNavProps.length || 1).join("/");
    }

    if (relativePath.startsWith("$Type")) {
      // We're anyway going to look on the entityType...
      relativePath = aPathSplit.slice(3).join("/");
    }

    if (targetEntitySet && relativePath.length) {
      var oTarget = targetEntitySet.entityType.resolvePath(relativePath, bIncludeVisitedObjects);

      if (oTarget) {
        if (bIncludeVisitedObjects) {
          oTarget.visitedObjects = localObjects.concat(oTarget.visitedObjects);
        }
      } else if (targetEntitySet.entityType && targetEntitySet.entityType.actions) {
        // if target is an action or an action parameter
        var actions = targetEntitySet.entityType && targetEntitySet.entityType.actions;

        var _relativeSplit = relativePath.split("/");

        if (actions[_relativeSplit[0]]) {
          var action = actions[_relativeSplit[0]];

          if (_relativeSplit[1] && action.parameters) {
            var parameterName = _relativeSplit[1];
            var targetParameter = action.parameters.find(function (parameter) {
              return parameter.fullyQualifiedName.endsWith("/" + parameterName);
            });
            return targetParameter;
          } else if (relativePath.length === 1) {
            return action;
          }
        }
      }

      return oTarget;
    } else {
      if (bIncludeVisitedObjects) {
        return {
          target: targetEntitySet,
          visitedObjects: localObjects
        };
      }

      return targetEntitySet;
    }
  }

  _exports.convertMetaModelContext = convertMetaModelContext;

  function getInvolvedDataModelObjects(oMetaModelContext, oEntitySetMetaModelContext) {
    var metaModelContext = convertMetaModelContext(oMetaModelContext, true);
    var targetEntitySetLocation;

    if (oEntitySetMetaModelContext && oEntitySetMetaModelContext.getPath() !== "/") {
      targetEntitySetLocation = getInvolvedDataModelObjects(oEntitySetMetaModelContext);
    }

    return getInvolvedDataModelObjectFromPath(metaModelContext, targetEntitySetLocation);
  }

  _exports.getInvolvedDataModelObjects = getInvolvedDataModelObjects;

  function getInvolvedDataModelObjectFromPath(metaModelContext, targetEntitySetLocation) {
    var dataModelObjects = metaModelContext.visitedObjects.filter(function (visitedObject) {
      return visitedObject && visitedObject.hasOwnProperty("_type") && visitedObject._type !== "EntityType";
    });

    if (metaModelContext.target && metaModelContext.target.hasOwnProperty("_type") && metaModelContext.target._type !== "EntityType") {
      dataModelObjects.push(metaModelContext.target);
    }

    var navigationProperties = [];
    var rootEntitySet = dataModelObjects[0]; // currentEntitySet can be undefined.

    var currentEntitySet = rootEntitySet;
    var currentEntityType = rootEntitySet.entityType;
    var i = 1;
    var currentObject;
    var navigatedPaths = [];

    while (i < dataModelObjects.length) {
      currentObject = dataModelObjects[i++];

      if (currentObject._type === "NavigationProperty") {
        navigatedPaths.push(currentObject.name);
        navigationProperties.push(currentObject);
        currentEntityType = currentObject.targetType;

        if (currentEntitySet && currentEntitySet.navigationPropertyBinding.hasOwnProperty(navigatedPaths.join("/"))) {
          currentEntitySet = currentEntitySet.navigationPropertyBinding[currentObject.name];
          navigatedPaths = [];
        } else {
          currentEntitySet = undefined;
        }
      }

      if (currentObject._type === "EntitySet") {
        currentEntitySet = currentObject;
        currentEntityType = currentEntitySet.entityType;
      }
    }

    if (targetEntitySetLocation && targetEntitySetLocation.startingEntitySet !== rootEntitySet) {
      // In case the entityset is not starting from the same location it may mean that we are doing too much work earlier for some reason
      // As such we need to redefine the context source for the targetEntitySetLocation
      var startingIndex = dataModelObjects.indexOf(targetEntitySetLocation.startingEntitySet);

      if (startingIndex !== -1) {
        // If it's not found I don't know what we can do (probably nothing)
        var requiredDataModelObjects = dataModelObjects.slice(0, startingIndex);
        targetEntitySetLocation.startingEntitySet = rootEntitySet;
        targetEntitySetLocation.navigationProperties = requiredDataModelObjects.filter(function (object) {
          return object._type === "NavigationProperty";
        }).concat(targetEntitySetLocation.navigationProperties);
      }
    }

    var outDataModelPath = {
      startingEntitySet: rootEntitySet,
      targetEntitySet: currentEntitySet,
      targetEntityType: currentEntityType,
      targetObject: metaModelContext.target,
      navigationProperties: navigationProperties,
      contextLocation: targetEntitySetLocation
    };

    if (!outDataModelPath.contextLocation) {
      outDataModelPath.contextLocation = outDataModelPath;
    }

    return outDataModelPath;
  }

  _exports.getInvolvedDataModelObjectFromPath = getInvolvedDataModelObjectFromPath;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1ldGFNb2RlbENvbnZlcnRlci50cyJdLCJuYW1lcyI6WyJWT0NBQlVMQVJZX0FMSUFTIiwiRGVmYXVsdEVudmlyb25tZW50Q2FwYWJpbGl0aWVzIiwiQ2hhcnQiLCJNaWNyb0NoYXJ0IiwiVVNoZWxsIiwiSW50ZW50QmFzZWROYXZpZ2F0aW9uIiwicGFyc2VQcm9wZXJ0eVZhbHVlIiwiYW5ub3RhdGlvbk9iamVjdCIsInByb3BlcnR5S2V5IiwiY3VycmVudFRhcmdldCIsImFubm90YXRpb25zTGlzdHMiLCJvQ2FwYWJpbGl0aWVzIiwidmFsdWUiLCJjdXJyZW50UHJvcGVydHlUYXJnZXQiLCJ0eXBlT2ZBbm5vdGF0aW9uIiwidHlwZSIsIk51bGwiLCJTdHJpbmciLCJCb29sIiwiSW50IiwiQXJyYXkiLCJpc0FycmF5IiwiQ29sbGVjdGlvbiIsIm1hcCIsInN1YkFubm90YXRpb25PYmplY3QiLCJzdWJBbm5vdGF0aW9uT2JqZWN0SW5kZXgiLCJwYXJzZUFubm90YXRpb25PYmplY3QiLCJsZW5ndGgiLCJoYXNPd25Qcm9wZXJ0eSIsIiRQYXRoIiwidW5kZWZpbmVkIiwiUGF0aCIsIiREZWNpbWFsIiwiRGVjaW1hbCIsInBhcnNlRmxvYXQiLCIkUHJvcGVydHlQYXRoIiwiUHJvcGVydHlQYXRoIiwiJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgiLCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoIiwiJElmIiwiSWYiLCIkQW5kIiwiQW5kIiwiJE9yIiwiT3IiLCIkTm90IiwiTm90IiwiJEVxIiwiRXEiLCIkTmUiLCJOZSIsIiRHdCIsIkd0IiwiJEdlIiwiR2UiLCIkTHQiLCJMdCIsIiRMZSIsIkxlIiwiJEFwcGx5IiwiQXBwbHkiLCJGdW5jdGlvbiIsIiRGdW5jdGlvbiIsIiRBbm5vdGF0aW9uUGF0aCIsIkFubm90YXRpb25QYXRoIiwiJEVudW1NZW1iZXIiLCJFbnVtTWVtYmVyIiwibWFwTmFtZVRvQWxpYXMiLCJzcGxpdCIsIiRUeXBlIiwiUmVjb3JkIiwibmFtZSIsImFubm90YXRpb25OYW1lIiwicGF0aFBhcnQiLCJhbm5vUGFydCIsImxhc3REb3QiLCJsYXN0SW5kZXhPZiIsInN1YnN0ciIsImN1cnJlbnRPYmplY3RUYXJnZXQiLCJwYXJzZWRBbm5vdGF0aW9uT2JqZWN0IiwidHlwZU9mT2JqZWN0IiwicGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24iLCJjb2xsZWN0aW9uIiwic3ViQW5ub3RhdGlvbkluZGV4IiwidHlwZVZhbHVlIiwicHJvcGVydHlWYWx1ZXMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsInN0YXJ0c1dpdGgiLCJwdXNoIiwiY3JlYXRlQW5ub3RhdGlvbkxpc3RzIiwiZ2V0T3JDcmVhdGVBbm5vdGF0aW9uTGlzdCIsInRhcmdldCIsImFubm90YXRpb25zIiwicmVtb3ZlQ2hhcnRBbm5vdGF0aW9ucyIsImZpbHRlciIsIm9SZWNvcmQiLCJUYXJnZXQiLCJpbmRleE9mIiwicmVtb3ZlSUJOQW5ub3RhdGlvbnMiLCJoYW5kbGVQcmVzZW50YXRpb25WYXJpYW50IiwiYW5ub3RhdGlvbk9iamVjdHMiLCJhbm5vdGF0aW9uVGFyZ2V0IiwiYW5ub3RhdGlvbkxpc3RzIiwib3V0QW5ub3RhdGlvbk9iamVjdCIsImFubm90YXRpb25LZXkiLCJEYXRhIiwiVmlzdWFsaXphdGlvbnMiLCJjdXJyZW50T3V0QW5ub3RhdGlvbk9iamVjdCIsImFubm90YXRpb25PZkFubm90YXRpb25TcGxpdCIsImFubm90YXRpb25RdWFsaWZpZXJTcGxpdCIsInF1YWxpZmllciIsInRlcm0iLCJjdXJyZW50QW5ub3RhdGlvblRhcmdldCIsImlzQ29sbGVjdGlvbiIsInR5cGVvZkFubm90YXRpb24iLCJyZWNvcmQiLCJwcmVwYXJlUHJvcGVydHkiLCJwcm9wZXJ0eURlZmluaXRpb24iLCJlbnRpdHlUeXBlT2JqZWN0IiwicHJvcGVydHlOYW1lIiwicHJvcGVydHlPYmplY3QiLCJfdHlwZSIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsIm1heExlbmd0aCIsIiRNYXhMZW5ndGgiLCJwcmVjaXNpb24iLCIkUHJlY2lzaW9uIiwic2NhbGUiLCIkU2NhbGUiLCJudWxsYWJsZSIsIiROdWxsYWJsZSIsInByZXBhcmVOYXZpZ2F0aW9uUHJvcGVydHkiLCJuYXZQcm9wZXJ0eURlZmluaXRpb24iLCJuYXZQcm9wZXJ0eU5hbWUiLCJyZWZlcmVudGlhbENvbnN0cmFpbnQiLCIkUmVmZXJlbnRpYWxDb25zdHJhaW50Iiwic291cmNlUHJvcGVydHlOYW1lIiwic291cmNlVHlwZU5hbWUiLCJzb3VyY2VQcm9wZXJ0eSIsInRhcmdldFR5cGVOYW1lIiwidGFyZ2V0UHJvcGVydHkiLCJuYXZpZ2F0aW9uUHJvcGVydHkiLCJwYXJ0bmVyIiwiJFBhcnRuZXIiLCIkaXNDb2xsZWN0aW9uIiwiY29udGFpbnNUYXJnZXQiLCIkQ29udGFpbnNUYXJnZXQiLCJwcmVwYXJlRW50aXR5U2V0IiwiZW50aXR5U2V0RGVmaW5pdGlvbiIsImVudGl0eVNldE5hbWUiLCJlbnRpdHlDb250YWluZXJOYW1lIiwiZW50aXR5U2V0T2JqZWN0IiwibmF2aWdhdGlvblByb3BlcnR5QmluZGluZyIsImVudGl0eVR5cGVOYW1lIiwicHJlcGFyZVNpbmdsZXRvbiIsInNpbmdsZXRvbkRlZmluaXRpb24iLCJzaW5nbGV0b25OYW1lIiwic2luZ2xldG9uT2JqZWN0IiwidHlwZU5hbWUiLCJwcmVwYXJlQ29tcGxleFR5cGUiLCJjb21wbGV4VHlwZURlZmluaXRpb24iLCJjb21wbGV4VHlwZU5hbWUiLCJuYW1lc3BhY2UiLCJjb21wbGV4VHlwZU9iamVjdCIsInJlcGxhY2UiLCJwcm9wZXJ0aWVzIiwibmF2aWdhdGlvblByb3BlcnRpZXMiLCJjb21wbGV4VHlwZVByb3BlcnRpZXMiLCJwcm9wZXJ0eU5hbWVPck5vdCIsIiRraW5kIiwic29ydCIsImEiLCJiIiwiY29tcGxleFR5cGVOYXZpZ2F0aW9uUHJvcGVydGllcyIsInByZXBhcmVFbnRpdHlLZXlzIiwiZW50aXR5VHlwZURlZmluaXRpb24iLCJvTWV0YU1vZGVsRGF0YSIsIiRLZXkiLCIkQmFzZVR5cGUiLCJwcmVwYXJlRW50aXR5VHlwZSIsIm1ldGFNb2RlbERhdGEiLCJlbnRpdHlLZXlzIiwiZW50aXR5UHJvcGVydGllcyIsImVudGl0eUtleSIsImZpbmQiLCJwcm9wZXJ0eSIsInByZXBhcmVBY3Rpb24iLCJhY3Rpb25OYW1lIiwiYWN0aW9uUmF3RGF0YSIsImFjdGlvbkVudGl0eVR5cGUiLCJhY3Rpb25GUU4iLCJhY3Rpb25TaG9ydE5hbWUiLCIkSXNCb3VuZCIsImJpbmRpbmdQYXJhbWV0ZXIiLCIkUGFyYW1ldGVyIiwicGFyYW1ldGVycyIsImlzQm91bmQiLCJzb3VyY2VUeXBlIiwicmV0dXJuVHlwZSIsIiRSZXR1cm5UeXBlIiwicGFyYW0iLCJpc0VudGl0eVNldCIsIiRFbnRpdHlTZXRQYXRoIiwiJE5hbWUiLCJwcmVwYXJlRW50aXR5VHlwZXMiLCJvTWV0YU1vZGVsIiwiZ2V0T2JqZWN0IiwiZW50aXR5VHlwZXMiLCJlbnRpdHlTZXRzIiwic2luZ2xldG9ucyIsImNvbXBsZXhUeXBlcyIsIiRFbnRpdHlDb250YWluZXIiLCJzY2hlbWFLZXlzIiwibWV0YW1vZGVsS2V5Iiwic09iamVjdE5hbWUiLCJlbnRpdHlUeXBlIiwiJEFubm90YXRpb25zIiwiZmlsdGVyRmFjZXRBbm5vdGF0aW9uIiwiSUQiLCJnZW5lcmF0ZSIsIkZhY2V0IiwiZW50aXR5UHJvcGVydHkiLCJWYWx1ZSIsImNvbXBsZXhUeXBlIiwib0VudGl0eUNvbnRhaW5lciIsImVudGl0eVNldCIsInNpbmdsZXRvbiIsImVudGl0eUNvbnRhaW5lciIsIm5hdlByb3BlcnR5QmluZGluZ3MiLCIkTmF2aWdhdGlvblByb3BlcnR5QmluZGluZyIsIm5hdlByb3BOYW1lIiwidGFyZ2V0RW50aXR5U2V0IiwiYWN0aW9ucyIsImtleSIsInJlZHVjZSIsIm91dEFjdGlvbnMiLCJhY3Rpb24iLCJvdXRBbm5vdGF0aW9uTGlzdHMiLCJzQW5ub3RhdGlvbk5hbWUiLCJyZWZlcmVuY2VzIiwiaWRlbnRpZmljYXRpb24iLCJ2ZXJzaW9uIiwic2NoZW1hIiwiYXNzb2NpYXRpb25zIiwibU1ldGFNb2RlbE1hcCIsImNvbnZlcnRUeXBlcyIsInNNZXRhTW9kZWxJZCIsImlkIiwicGFyc2VkT3V0cHV0IiwiQW5ub3RhdGlvbkNvbnZlcnRlciIsImRlbGV0ZU1vZGVsQ2FjaGVEYXRhIiwiY29udmVydE1ldGFNb2RlbENvbnRleHQiLCJvTWV0YU1vZGVsQ29udGV4dCIsImJJbmNsdWRlVmlzaXRlZE9iamVjdHMiLCJvQ29udmVydGVyT3V0cHV0IiwiZ2V0TW9kZWwiLCJzUGF0aCIsImdldFBhdGgiLCJhUGF0aFNwbGl0IiwicmVsYXRpdmVQYXRoIiwic2xpY2UiLCJqb2luIiwibG9jYWxPYmplY3RzIiwicmVsYXRpdmVTcGxpdCIsImlkeCIsImN1cnJlbnRFbnRpdHlTZXQiLCJzTmF2UHJvcFRvQ2hlY2siLCJhTmF2UHJvcHMiLCJ0YXJnZXRFbnRpdHlUeXBlIiwic05hdlByb3AiLCJ0YXJnZXROYXZQcm9wIiwibmF2UHJvcCIsInRhcmdldFR5cGUiLCJvVGFyZ2V0IiwicmVzb2x2ZVBhdGgiLCJ2aXNpdGVkT2JqZWN0cyIsImNvbmNhdCIsInBhcmFtZXRlck5hbWUiLCJ0YXJnZXRQYXJhbWV0ZXIiLCJwYXJhbWV0ZXIiLCJlbmRzV2l0aCIsImdldEludm9sdmVkRGF0YU1vZGVsT2JqZWN0cyIsIm9FbnRpdHlTZXRNZXRhTW9kZWxDb250ZXh0IiwibWV0YU1vZGVsQ29udGV4dCIsInRhcmdldEVudGl0eVNldExvY2F0aW9uIiwiZ2V0SW52b2x2ZWREYXRhTW9kZWxPYmplY3RGcm9tUGF0aCIsImRhdGFNb2RlbE9iamVjdHMiLCJ2aXNpdGVkT2JqZWN0Iiwicm9vdEVudGl0eVNldCIsImN1cnJlbnRFbnRpdHlUeXBlIiwiaSIsImN1cnJlbnRPYmplY3QiLCJuYXZpZ2F0ZWRQYXRocyIsInN0YXJ0aW5nRW50aXR5U2V0Iiwic3RhcnRpbmdJbmRleCIsInJlcXVpcmVkRGF0YU1vZGVsT2JqZWN0cyIsIm9iamVjdCIsIm91dERhdGFNb2RlbFBh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LHdCQUF3QixHQUFHVCxnQkFBZ0IsQ0FBQzFCLEtBQWpCLENBQXVCLENBQXZCLEVBQTBCa0MsYUFBMUIsQ0FBakM7QUFDQVYsUUFBQUEsdUJBQXVCLENBQUNTLGlCQUF4QixHQUE0Q0wsYUFBNUM7QUFDQUosUUFBQUEsdUJBQXVCLENBQUN0SCxvQkFBeEIsR0FBK0NpSSx3QkFBd0IsQ0FDckV6TSxNQUQ2QyxDQUN0QyxVQUFDME0sTUFBRDtBQUFBLGlCQUFpQkEsTUFBTSxDQUFDL0ssS0FBUCxLQUFpQixvQkFBbEM7QUFBQSxTQURzQyxFQUU3QzJKLE1BRjZDLENBRXRDUSx1QkFBdUIsQ0FBQ3RILG9CQUZjLENBQS9DO0FBR0E7QUFDRDs7QUFDRCxRQUFNbUksZ0JBQWdCLEdBQUc7QUFDeEJKLE1BQUFBLGlCQUFpQixFQUFFTCxhQURLO0FBRXhCekQsTUFBQUEsZUFBZSxFQUFFa0MsZ0JBRk87QUFHeEJHLE1BQUFBLGdCQUFnQixFQUFFcUIsaUJBSE07QUFJeEJTLE1BQUFBLFlBQVksRUFBRWYsZ0JBQWdCLENBQUNoTSxNQUpQO0FBS3hCMkUsTUFBQUEsb0JBQW9CLEVBQXBCQSxvQkFMd0I7QUFNeEJxSSxNQUFBQSxlQUFlLEVBQUVmO0FBTk8sS0FBekI7O0FBUUEsUUFBSSxDQUFDYSxnQkFBZ0IsQ0FBQ0UsZUFBdEIsRUFBdUM7QUFDdENGLE1BQUFBLGdCQUFnQixDQUFDRSxlQUFqQixHQUFtQ0YsZ0JBQW5DO0FBQ0E7O0FBQ0QsV0FBT0EsZ0JBQVA7QUFDQSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQW5ub3RhdGlvbiwgQW5ub3RhdGlvbkxpc3QsIEFubm90YXRpb25SZWNvcmQsIEV4cHJlc3Npb24sIFBhcnNlck91dHB1dCB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuLy8gVGhpcyBmaWxlIGlzIHJldHJpZXZlZCBmcm9tIEBzYXAtdXgvYW5ub3RhdGlvbi1jb252ZXJ0ZXIsIHNoYXJlZCBjb2RlIHdpdGggdG9vbCBzdWl0ZVxuaW1wb3J0IHsgQW5ub3RhdGlvbkNvbnZlcnRlciB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbW1vblwiO1xuaW1wb3J0IHsgT0RhdGFNZXRhTW9kZWwgfSBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0XCI7XG5pbXBvcnQge1xuXHRDb252ZXJ0ZXJPdXRwdXQsXG5cdEVudGl0eVNldCBhcyBfRW50aXR5U2V0LFxuXHRFbnRpdHlUeXBlIGFzIF9FbnRpdHlUeXBlLFxuXHROYXZpZ2F0aW9uUHJvcGVydHkgYXMgX05hdmlnYXRpb25Qcm9wZXJ0eVxufSBmcm9tIFwiQHNhcC11eC9hbm5vdGF0aW9uLWNvbnZlcnRlclwiO1xuaW1wb3J0IHtcblx0RW50aXR5VHlwZSxcblx0RW50aXR5U2V0LFxuXHRQcm9wZXJ0eSxcblx0Q29tcGxleFR5cGUsXG5cdFJlZmVyZW50aWFsQ29uc3RyYWludCxcblx0VjROYXZpZ2F0aW9uUHJvcGVydHksXG5cdEFjdGlvbixcblx0UmVmZXJlbmNlLFxuXHRFbnRpdHlDb250YWluZXIsXG5cdFNpbmdsZXRvblxufSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvZGlzdC9QYXJzZXJcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwic2FwL3VpL21vZGVsXCI7XG5pbXBvcnQgeyBEYXRhTW9kZWxPYmplY3RQYXRoIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvRGF0YU1vZGVsUGF0aEhlbHBlclwiO1xuaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tIFwiLi4vaGVscGVycy9TdGFibGVJZEhlbHBlclwiO1xuXG5jb25zdCBWT0NBQlVMQVJZX0FMSUFTOiBhbnkgPSB7XG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMVwiOiBcIkNhcGFiaWxpdGllc1wiLFxuXHRcIk9yZy5PRGF0YS5Db3JlLlYxXCI6IFwiQ29yZVwiLFxuXHRcIk9yZy5PRGF0YS5NZWFzdXJlcy5WMVwiOiBcIk1lYXN1cmVzXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxXCI6IFwiQ29tbW9uXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjFcIjogXCJVSVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlNlc3Npb24udjFcIjogXCJTZXNzaW9uXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQW5hbHl0aWNzLnYxXCI6IFwiQW5hbHl0aWNzXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuUGVyc29uYWxEYXRhLnYxXCI6IFwiUGVyc29uYWxEYXRhXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbXVuaWNhdGlvbi52MVwiOiBcIkNvbW11bmljYXRpb25cIlxufTtcblxuZXhwb3J0IHR5cGUgRW52aXJvbm1lbnRDYXBhYmlsaXRpZXMgPSB7XG5cdENoYXJ0OiBib29sZWFuO1xuXHRNaWNyb0NoYXJ0OiBib29sZWFuO1xuXHRVU2hlbGw6IGJvb2xlYW47XG5cdEludGVudEJhc2VkTmF2aWdhdGlvbjogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBjb25zdCBEZWZhdWx0RW52aXJvbm1lbnRDYXBhYmlsaXRpZXMgPSB7XG5cdENoYXJ0OiB0cnVlLFxuXHRNaWNyb0NoYXJ0OiB0cnVlLFxuXHRVU2hlbGw6IHRydWUsXG5cdEludGVudEJhc2VkTmF2aWdhdGlvbjogdHJ1ZVxufTtcblxudHlwZSBNZXRhTW9kZWxBY3Rpb24gPSB7XG5cdCRraW5kOiBcIkFjdGlvblwiO1xuXHQkSXNCb3VuZDogYm9vbGVhbjtcblx0JEVudGl0eVNldFBhdGg6IHN0cmluZztcblx0JFBhcmFtZXRlcjoge1xuXHRcdCRUeXBlOiBzdHJpbmc7XG5cdFx0JE5hbWU6IHN0cmluZztcblx0XHQkTnVsbGFibGU/OiBib29sZWFuO1xuXHRcdCRNYXhMZW5ndGg/OiBudW1iZXI7XG5cdFx0JFByZWNpc2lvbj86IG51bWJlcjtcblx0XHQkU2NhbGU/OiBudW1iZXI7XG5cdFx0JGlzQ29sbGVjdGlvbj86IGJvb2xlYW47XG5cdH1bXTtcblx0JFJldHVyblR5cGU6IHtcblx0XHQkVHlwZTogc3RyaW5nO1xuXHR9O1xufTtcblxuZnVuY3Rpb24gcGFyc2VQcm9wZXJ0eVZhbHVlKFxuXHRhbm5vdGF0aW9uT2JqZWN0OiBhbnksXG5cdHByb3BlcnR5S2V5OiBzdHJpbmcsXG5cdGN1cnJlbnRUYXJnZXQ6IHN0cmluZyxcblx0YW5ub3RhdGlvbnNMaXN0czogUmVjb3JkPHN0cmluZywgQW5ub3RhdGlvbkxpc3Q+LFxuXHRvQ2FwYWJpbGl0aWVzOiBFbnZpcm9ubWVudENhcGFiaWxpdGllc1xuKTogYW55IHtcblx0bGV0IHZhbHVlO1xuXHRjb25zdCBjdXJyZW50UHJvcGVydHlUYXJnZXQ6IHN0cmluZyA9IGN1cnJlbnRUYXJnZXQgKyBcIi9cIiArIHByb3BlcnR5S2V5O1xuXHRjb25zdCB0eXBlT2ZBbm5vdGF0aW9uID0gdHlwZW9mIGFubm90YXRpb25PYmplY3Q7XG5cdGlmIChhbm5vdGF0aW9uT2JqZWN0ID09PSBudWxsKSB7XG5cdFx0dmFsdWUgPSB7IHR5cGU6IFwiTnVsbFwiLCBOdWxsOiBudWxsIH07XG5cdH0gZWxzZSBpZiAodHlwZU9mQW5ub3RhdGlvbiA9PT0gXCJzdHJpbmdcIikge1xuXHRcdHZhbHVlID0geyB0eXBlOiBcIlN0cmluZ1wiLCBTdHJpbmc6IGFubm90YXRpb25PYmplY3QgfTtcblx0fSBlbHNlIGlmICh0eXBlT2ZBbm5vdGF0aW9uID09PSBcImJvb2xlYW5cIikge1xuXHRcdHZhbHVlID0geyB0eXBlOiBcIkJvb2xcIiwgQm9vbDogYW5ub3RhdGlvbk9iamVjdCB9O1xuXHR9IGVsc2UgaWYgKHR5cGVPZkFubm90YXRpb24gPT09IFwibnVtYmVyXCIpIHtcblx0XHR2YWx1ZSA9IHsgdHlwZTogXCJJbnRcIiwgSW50OiBhbm5vdGF0aW9uT2JqZWN0IH07XG5cdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShhbm5vdGF0aW9uT2JqZWN0KSkge1xuXHRcdHZhbHVlID0ge1xuXHRcdFx0dHlwZTogXCJDb2xsZWN0aW9uXCIsXG5cdFx0XHRDb2xsZWN0aW9uOiBhbm5vdGF0aW9uT2JqZWN0Lm1hcCgoc3ViQW5ub3RhdGlvbk9iamVjdCwgc3ViQW5ub3RhdGlvbk9iamVjdEluZGV4KSA9PlxuXHRcdFx0XHRwYXJzZUFubm90YXRpb25PYmplY3QoXG5cdFx0XHRcdFx0c3ViQW5ub3RhdGlvbk9iamVjdCxcblx0XHRcdFx0XHRjdXJyZW50UHJvcGVydHlUYXJnZXQgKyBcIi9cIiArIHN1YkFubm90YXRpb25PYmplY3RJbmRleCxcblx0XHRcdFx0XHRhbm5vdGF0aW9uc0xpc3RzLFxuXHRcdFx0XHRcdG9DYXBhYmlsaXRpZXNcblx0XHRcdFx0KVxuXHRcdFx0KVxuXHRcdH07XG5cdFx0aWYgKGFubm90YXRpb25PYmplY3QubGVuZ3RoID4gMCkge1xuXHRcdFx0aWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkUHJvcGVydHlQYXRoXCIpKSB7XG5cdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiUHJvcGVydHlQYXRoXCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkUGF0aFwiKSkge1xuXHRcdFx0XHQodmFsdWUuQ29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIlBhdGhcIjtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCIpKSB7XG5cdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiTmF2aWdhdGlvblByb3BlcnR5UGF0aFwiO1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJEFubm90YXRpb25QYXRoXCIpKSB7XG5cdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiQW5ub3RhdGlvblBhdGhcIjtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRUeXBlXCIpKSB7XG5cdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiUmVjb3JkXCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkSWZcIikpIHtcblx0XHRcdFx0KHZhbHVlLkNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJJZlwiO1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJE9yXCIpKSB7XG5cdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiT3JcIjtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRBbmRcIikpIHtcblx0XHRcdFx0KHZhbHVlLkNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJBbmRcIjtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRFcVwiKSkge1xuXHRcdFx0XHQodmFsdWUuQ29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIkVxXCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkTmVcIikpIHtcblx0XHRcdFx0KHZhbHVlLkNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJOZVwiO1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJE5vdFwiKSkge1xuXHRcdFx0XHQodmFsdWUuQ29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIk5vdFwiO1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJEd0XCIpKSB7XG5cdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiR3RcIjtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRHZVwiKSkge1xuXHRcdFx0XHQodmFsdWUuQ29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIkdlXCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkTHRcIikpIHtcblx0XHRcdFx0KHZhbHVlLkNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJMdFwiO1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJExlXCIpKSB7XG5cdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiTGVcIjtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRBcHBseVwiKSkge1xuXHRcdFx0XHQodmFsdWUuQ29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIkFwcGx5XCI7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBhbm5vdGF0aW9uT2JqZWN0WzBdID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdC8vICRUeXBlIGlzIG9wdGlvbmFsLi4uXG5cdFx0XHRcdCh2YWx1ZS5Db2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiUmVjb3JkXCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQodmFsdWUuQ29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIlN0cmluZ1wiO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRQYXRoICE9PSB1bmRlZmluZWQpIHtcblx0XHR2YWx1ZSA9IHsgdHlwZTogXCJQYXRoXCIsIFBhdGg6IGFubm90YXRpb25PYmplY3QuJFBhdGggfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiREZWNpbWFsICE9PSB1bmRlZmluZWQpIHtcblx0XHR2YWx1ZSA9IHsgdHlwZTogXCJEZWNpbWFsXCIsIERlY2ltYWw6IHBhcnNlRmxvYXQoYW5ub3RhdGlvbk9iamVjdC4kRGVjaW1hbCkgfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRQcm9wZXJ0eVBhdGggIT09IHVuZGVmaW5lZCkge1xuXHRcdHZhbHVlID0geyB0eXBlOiBcIlByb3BlcnR5UGF0aFwiLCBQcm9wZXJ0eVBhdGg6IGFubm90YXRpb25PYmplY3QuJFByb3BlcnR5UGF0aCB9O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGggIT09IHVuZGVmaW5lZCkge1xuXHRcdHZhbHVlID0ge1xuXHRcdFx0dHlwZTogXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCIsXG5cdFx0XHROYXZpZ2F0aW9uUHJvcGVydHlQYXRoOiBhbm5vdGF0aW9uT2JqZWN0LiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoXG5cdFx0fTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRJZiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0dmFsdWUgPSB7IHR5cGU6IFwiSWZcIiwgSWY6IGFubm90YXRpb25PYmplY3QuJElmIH07XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kQW5kICE9PSB1bmRlZmluZWQpIHtcblx0XHR2YWx1ZSA9IHsgdHlwZTogXCJBbmRcIiwgQW5kOiBhbm5vdGF0aW9uT2JqZWN0LiRBbmQgfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRPciAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0dmFsdWUgPSB7IHR5cGU6IFwiT3JcIiwgT3I6IGFubm90YXRpb25PYmplY3QuJE9yIH07XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kTm90ICE9PSB1bmRlZmluZWQpIHtcblx0XHR2YWx1ZSA9IHsgdHlwZTogXCJOb3RcIiwgTm90OiBhbm5vdGF0aW9uT2JqZWN0LiROb3QgfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRFcSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0dmFsdWUgPSB7IHR5cGU6IFwiRXFcIiwgRXE6IGFubm90YXRpb25PYmplY3QuJEVxIH07XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kTmUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHZhbHVlID0geyB0eXBlOiBcIk5lXCIsIE5lOiBhbm5vdGF0aW9uT2JqZWN0LiROZSB9O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJEd0ICE9PSB1bmRlZmluZWQpIHtcblx0XHR2YWx1ZSA9IHsgdHlwZTogXCJHdFwiLCBHdDogYW5ub3RhdGlvbk9iamVjdC4kR3QgfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRHZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0dmFsdWUgPSB7IHR5cGU6IFwiR2VcIiwgR2U6IGFubm90YXRpb25PYmplY3QuJEdlIH07XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kTHQgIT09IHVuZGVmaW5lZCkge1xuXHRcdHZhbHVlID0geyB0eXBlOiBcIkx0XCIsIEx0OiBhbm5vdGF0aW9uT2JqZWN0LiRMdCB9O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJExlICE9PSB1bmRlZmluZWQpIHtcblx0XHR2YWx1ZSA9IHsgdHlwZTogXCJMZVwiLCBMZTogYW5ub3RhdGlvbk9iamVjdC4kTGUgfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRBcHBseSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0dmFsdWUgPSB7IHR5cGU6IFwiQXBwbHlcIiwgQXBwbHk6IGFubm90YXRpb25PYmplY3QuJEFwcGx5LCBGdW5jdGlvbjogYW5ub3RhdGlvbk9iamVjdC4kRnVuY3Rpb24gfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRBbm5vdGF0aW9uUGF0aCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0dmFsdWUgPSB7IHR5cGU6IFwiQW5ub3RhdGlvblBhdGhcIiwgQW5ub3RhdGlvblBhdGg6IGFubm90YXRpb25PYmplY3QuJEFubm90YXRpb25QYXRoIH07XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kRW51bU1lbWJlciAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0dmFsdWUgPSB7XG5cdFx0XHR0eXBlOiBcIkVudW1NZW1iZXJcIixcblx0XHRcdEVudW1NZW1iZXI6IG1hcE5hbWVUb0FsaWFzKGFubm90YXRpb25PYmplY3QuJEVudW1NZW1iZXIuc3BsaXQoXCIvXCIpWzBdKSArIFwiL1wiICsgYW5ub3RhdGlvbk9iamVjdC4kRW51bU1lbWJlci5zcGxpdChcIi9cIilbMV1cblx0XHR9O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJFR5cGUpIHtcblx0XHR2YWx1ZSA9IHtcblx0XHRcdHR5cGU6IFwiUmVjb3JkXCIsXG5cdFx0XHRSZWNvcmQ6IHBhcnNlQW5ub3RhdGlvbk9iamVjdChhbm5vdGF0aW9uT2JqZWN0LCBjdXJyZW50VGFyZ2V0LCBhbm5vdGF0aW9uc0xpc3RzLCBvQ2FwYWJpbGl0aWVzKVxuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0dmFsdWUgPSB7XG5cdFx0XHR0eXBlOiBcIlJlY29yZFwiLFxuXHRcdFx0UmVjb3JkOiBwYXJzZUFubm90YXRpb25PYmplY3QoYW5ub3RhdGlvbk9iamVjdCwgY3VycmVudFRhcmdldCwgYW5ub3RhdGlvbnNMaXN0cywgb0NhcGFiaWxpdGllcylcblx0XHR9O1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRuYW1lOiBwcm9wZXJ0eUtleSxcblx0XHR2YWx1ZVxuXHR9O1xufVxuZnVuY3Rpb24gbWFwTmFtZVRvQWxpYXMoYW5ub3RhdGlvbk5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG5cdGxldCBbcGF0aFBhcnQsIGFubm9QYXJ0XSA9IGFubm90YXRpb25OYW1lLnNwbGl0KFwiQFwiKTtcblx0aWYgKCFhbm5vUGFydCkge1xuXHRcdGFubm9QYXJ0ID0gcGF0aFBhcnQ7XG5cdFx0cGF0aFBhcnQgPSBcIlwiO1xuXHR9IGVsc2Uge1xuXHRcdHBhdGhQYXJ0ICs9IFwiQFwiO1xuXHR9XG5cdGNvbnN0IGxhc3REb3QgPSBhbm5vUGFydC5sYXN0SW5kZXhPZihcIi5cIik7XG5cdHJldHVybiBwYXRoUGFydCArIFZPQ0FCVUxBUllfQUxJQVNbYW5ub1BhcnQuc3Vic3RyKDAsIGxhc3REb3QpXSArIFwiLlwiICsgYW5ub1BhcnQuc3Vic3RyKGxhc3REb3QgKyAxKTtcbn1cbmZ1bmN0aW9uIHBhcnNlQW5ub3RhdGlvbk9iamVjdChcblx0YW5ub3RhdGlvbk9iamVjdDogYW55LFxuXHRjdXJyZW50T2JqZWN0VGFyZ2V0OiBzdHJpbmcsXG5cdGFubm90YXRpb25zTGlzdHM6IFJlY29yZDxzdHJpbmcsIEFubm90YXRpb25MaXN0Pixcblx0b0NhcGFiaWxpdGllczogRW52aXJvbm1lbnRDYXBhYmlsaXRpZXNcbik6IEV4cHJlc3Npb24gfCBBbm5vdGF0aW9uUmVjb3JkIHwgQW5ub3RhdGlvbiB7XG5cdGxldCBwYXJzZWRBbm5vdGF0aW9uT2JqZWN0OiBhbnkgPSB7fTtcblx0Y29uc3QgdHlwZU9mT2JqZWN0ID0gdHlwZW9mIGFubm90YXRpb25PYmplY3Q7XG5cdGlmIChhbm5vdGF0aW9uT2JqZWN0ID09PSBudWxsKSB7XG5cdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJOdWxsXCIsIE51bGw6IG51bGwgfTtcblx0fSBlbHNlIGlmICh0eXBlT2ZPYmplY3QgPT09IFwic3RyaW5nXCIpIHtcblx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0ID0geyB0eXBlOiBcIlN0cmluZ1wiLCBTdHJpbmc6IGFubm90YXRpb25PYmplY3QgfTtcblx0fSBlbHNlIGlmICh0eXBlT2ZPYmplY3QgPT09IFwiYm9vbGVhblwiKSB7XG5cdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJCb29sXCIsIEJvb2w6IGFubm90YXRpb25PYmplY3QgfTtcblx0fSBlbHNlIGlmICh0eXBlT2ZPYmplY3QgPT09IFwibnVtYmVyXCIpIHtcblx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0ID0geyB0eXBlOiBcIkludFwiLCBJbnQ6IGFubm90YXRpb25PYmplY3QgfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRBbm5vdGF0aW9uUGF0aCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJBbm5vdGF0aW9uUGF0aFwiLCBBbm5vdGF0aW9uUGF0aDogYW5ub3RhdGlvbk9iamVjdC4kQW5ub3RhdGlvblBhdGggfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRQYXRoICE9PSB1bmRlZmluZWQpIHtcblx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0ID0geyB0eXBlOiBcIlBhdGhcIiwgUGF0aDogYW5ub3RhdGlvbk9iamVjdC4kUGF0aCB9O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJERlY2ltYWwgIT09IHVuZGVmaW5lZCkge1xuXHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7IHR5cGU6IFwiRGVjaW1hbFwiLCBEZWNpbWFsOiBwYXJzZUZsb2F0KGFubm90YXRpb25PYmplY3QuJERlY2ltYWwpIH07XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kUHJvcGVydHlQYXRoICE9PSB1bmRlZmluZWQpIHtcblx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0ID0geyB0eXBlOiBcIlByb3BlcnR5UGF0aFwiLCBQcm9wZXJ0eVBhdGg6IGFubm90YXRpb25PYmplY3QuJFByb3BlcnR5UGF0aCB9O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJElmICE9PSB1bmRlZmluZWQpIHtcblx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0ID0geyB0eXBlOiBcIklmXCIsIElmOiBhbm5vdGF0aW9uT2JqZWN0LiRJZiB9O1xuXHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJEFuZCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJBbmRcIiwgQW5kOiBhbm5vdGF0aW9uT2JqZWN0LiRBbmQgfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRPciAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdCA9IHsgdHlwZTogXCJPclwiLCBPcjogYW5ub3RhdGlvbk9iamVjdC4kT3IgfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiROb3QgIT09IHVuZGVmaW5lZCkge1xuXHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7IHR5cGU6IFwiTm90XCIsIE5vdDogYW5ub3RhdGlvbk9iamVjdC4kTm90IH07XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kRXEgIT09IHVuZGVmaW5lZCkge1xuXHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7IHR5cGU6IFwiRXFcIiwgRXE6IGFubm90YXRpb25PYmplY3QuJEVxIH07XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kTmUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7IHR5cGU6IFwiTmVcIiwgTmU6IGFubm90YXRpb25PYmplY3QuJE5lIH07XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kR3QgIT09IHVuZGVmaW5lZCkge1xuXHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7IHR5cGU6IFwiR3RcIiwgR3Q6IGFubm90YXRpb25PYmplY3QuJEd0IH07XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kR2UgIT09IHVuZGVmaW5lZCkge1xuXHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7IHR5cGU6IFwiR2VcIiwgR2U6IGFubm90YXRpb25PYmplY3QuJEdlIH07XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kTHQgIT09IHVuZGVmaW5lZCkge1xuXHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7IHR5cGU6IFwiTHRcIiwgTHQ6IGFubm90YXRpb25PYmplY3QuJEx0IH07XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kTGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7IHR5cGU6IFwiTGVcIiwgTGU6IGFubm90YXRpb25PYmplY3QuJExlIH07XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kQXBwbHkgIT09IHVuZGVmaW5lZCkge1xuXHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QgPSB7IHR5cGU6IFwiQXBwbHlcIiwgQXBwbHk6IGFubm90YXRpb25PYmplY3QuJEFwcGx5LCBGdW5jdGlvbjogYW5ub3RhdGlvbk9iamVjdC4kRnVuY3Rpb24gfTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoICE9PSB1bmRlZmluZWQpIHtcblx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0ID0ge1xuXHRcdFx0dHlwZTogXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCIsXG5cdFx0XHROYXZpZ2F0aW9uUHJvcGVydHlQYXRoOiBhbm5vdGF0aW9uT2JqZWN0LiROYXZpZ2F0aW9uUHJvcGVydHlQYXRoXG5cdFx0fTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRFbnVtTWVtYmVyICE9PSB1bmRlZmluZWQpIHtcblx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0ID0ge1xuXHRcdFx0dHlwZTogXCJFbnVtTWVtYmVyXCIsXG5cdFx0XHRFbnVtTWVtYmVyOiBtYXBOYW1lVG9BbGlhcyhhbm5vdGF0aW9uT2JqZWN0LiRFbnVtTWVtYmVyLnNwbGl0KFwiL1wiKVswXSkgKyBcIi9cIiArIGFubm90YXRpb25PYmplY3QuJEVudW1NZW1iZXIuc3BsaXQoXCIvXCIpWzFdXG5cdFx0fTtcblx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFubm90YXRpb25PYmplY3QpKSB7XG5cdFx0Y29uc3QgcGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24gPSBwYXJzZWRBbm5vdGF0aW9uT2JqZWN0IGFzIGFueTtcblx0XHRwYXJzZWRBbm5vdGF0aW9uQ29sbGVjdGlvbi5jb2xsZWN0aW9uID0gYW5ub3RhdGlvbk9iamVjdC5tYXAoKHN1YkFubm90YXRpb25PYmplY3QsIHN1YkFubm90YXRpb25JbmRleCkgPT5cblx0XHRcdHBhcnNlQW5ub3RhdGlvbk9iamVjdChzdWJBbm5vdGF0aW9uT2JqZWN0LCBjdXJyZW50T2JqZWN0VGFyZ2V0ICsgXCIvXCIgKyBzdWJBbm5vdGF0aW9uSW5kZXgsIGFubm90YXRpb25zTGlzdHMsIG9DYXBhYmlsaXRpZXMpXG5cdFx0KTtcblx0XHRpZiAoYW5ub3RhdGlvbk9iamVjdC5sZW5ndGggPiAwKSB7XG5cdFx0XHRpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRQcm9wZXJ0eVBhdGhcIikpIHtcblx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uLmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJQcm9wZXJ0eVBhdGhcIjtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRQYXRoXCIpKSB7XG5cdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uQ29sbGVjdGlvbi5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiUGF0aFwiO1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIikpIHtcblx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uLmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkQW5ub3RhdGlvblBhdGhcIikpIHtcblx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uLmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJBbm5vdGF0aW9uUGF0aFwiO1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJFR5cGVcIikpIHtcblx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uLmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJSZWNvcmRcIjtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRJZlwiKSkge1xuXHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24uY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIklmXCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkQW5kXCIpKSB7XG5cdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uQ29sbGVjdGlvbi5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiQW5kXCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkT3JcIikpIHtcblx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uLmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJPclwiO1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJEVxXCIpKSB7XG5cdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uQ29sbGVjdGlvbi5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiRXFcIjtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiROZVwiKSkge1xuXHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24uY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIk5lXCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkTm90XCIpKSB7XG5cdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uQ29sbGVjdGlvbi5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiTm90XCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkR3RcIikpIHtcblx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uLmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJHdFwiO1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJEdlXCIpKSB7XG5cdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uQ29sbGVjdGlvbi5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiR2VcIjtcblx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRMdFwiKSkge1xuXHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbkNvbGxlY3Rpb24uY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIkx0XCI7XG5cdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkTGVcIikpIHtcblx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uLmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJMZVwiO1xuXHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJEFwcGx5XCIpKSB7XG5cdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uQ29sbGVjdGlvbi5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiQXBwbHlcIjtcblx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGFubm90YXRpb25PYmplY3RbMF0gPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25Db2xsZWN0aW9uLmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJSZWNvcmRcIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uQ29sbGVjdGlvbi5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiU3RyaW5nXCI7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGlmIChhbm5vdGF0aW9uT2JqZWN0LiRUeXBlKSB7XG5cdFx0XHRjb25zdCB0eXBlVmFsdWUgPSBhbm5vdGF0aW9uT2JqZWN0LiRUeXBlO1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC50eXBlID0gdHlwZVZhbHVlOyAvL2Ake3R5cGVBbGlhc30uJHt0eXBlVGVybX1gO1xuXHRcdH1cblx0XHRjb25zdCBwcm9wZXJ0eVZhbHVlczogYW55ID0gW107XG5cdFx0T2JqZWN0LmtleXMoYW5ub3RhdGlvbk9iamVjdCkuZm9yRWFjaChwcm9wZXJ0eUtleSA9PiB7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdHByb3BlcnR5S2V5ICE9PSBcIiRUeXBlXCIgJiZcblx0XHRcdFx0cHJvcGVydHlLZXkgIT09IFwiJElmXCIgJiZcblx0XHRcdFx0cHJvcGVydHlLZXkgIT09IFwiJEFwcGx5XCIgJiZcblx0XHRcdFx0cHJvcGVydHlLZXkgIT09IFwiJEFuZFwiICYmXG5cdFx0XHRcdHByb3BlcnR5S2V5ICE9PSBcIiRPclwiICYmXG5cdFx0XHRcdHByb3BlcnR5S2V5ICE9PSBcIiROZVwiICYmXG5cdFx0XHRcdHByb3BlcnR5S2V5ICE9PSBcIiRHdFwiICYmXG5cdFx0XHRcdHByb3BlcnR5S2V5ICE9PSBcIiRHZVwiICYmXG5cdFx0XHRcdHByb3BlcnR5S2V5ICE9PSBcIiRMdFwiICYmXG5cdFx0XHRcdHByb3BlcnR5S2V5ICE9PSBcIiRMZVwiICYmXG5cdFx0XHRcdHByb3BlcnR5S2V5ICE9PSBcIiROb3RcIiAmJlxuXHRcdFx0XHRwcm9wZXJ0eUtleSAhPT0gXCIkRXFcIiAmJlxuXHRcdFx0XHQhcHJvcGVydHlLZXkuc3RhcnRzV2l0aChcIkBcIilcblx0XHRcdCkge1xuXHRcdFx0XHRwcm9wZXJ0eVZhbHVlcy5wdXNoKFxuXHRcdFx0XHRcdHBhcnNlUHJvcGVydHlWYWx1ZShhbm5vdGF0aW9uT2JqZWN0W3Byb3BlcnR5S2V5XSwgcHJvcGVydHlLZXksIGN1cnJlbnRPYmplY3RUYXJnZXQsIGFubm90YXRpb25zTGlzdHMsIG9DYXBhYmlsaXRpZXMpXG5cdFx0XHRcdCk7XG5cdFx0XHR9IGVsc2UgaWYgKHByb3BlcnR5S2V5LnN0YXJ0c1dpdGgoXCJAXCIpKSB7XG5cdFx0XHRcdC8vIEFubm90YXRpb24gb2YgYW5ub3RhdGlvblxuXHRcdFx0XHRjcmVhdGVBbm5vdGF0aW9uTGlzdHMoXG5cdFx0XHRcdFx0eyBbcHJvcGVydHlLZXldOiBhbm5vdGF0aW9uT2JqZWN0W3Byb3BlcnR5S2V5XSB9LFxuXHRcdFx0XHRcdGN1cnJlbnRPYmplY3RUYXJnZXQsXG5cdFx0XHRcdFx0YW5ub3RhdGlvbnNMaXN0cyxcblx0XHRcdFx0XHRvQ2FwYWJpbGl0aWVzXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC5wcm9wZXJ0eVZhbHVlcyA9IHByb3BlcnR5VmFsdWVzO1xuXHR9XG5cdHJldHVybiBwYXJzZWRBbm5vdGF0aW9uT2JqZWN0O1xufVxuZnVuY3Rpb24gZ2V0T3JDcmVhdGVBbm5vdGF0aW9uTGlzdCh0YXJnZXQ6IHN0cmluZywgYW5ub3RhdGlvbnNMaXN0czogUmVjb3JkPHN0cmluZywgQW5ub3RhdGlvbkxpc3Q+KTogQW5ub3RhdGlvbkxpc3Qge1xuXHRpZiAoIWFubm90YXRpb25zTGlzdHMuaGFzT3duUHJvcGVydHkodGFyZ2V0KSkge1xuXHRcdGFubm90YXRpb25zTGlzdHNbdGFyZ2V0XSA9IHtcblx0XHRcdHRhcmdldDogdGFyZ2V0LFxuXHRcdFx0YW5ub3RhdGlvbnM6IFtdXG5cdFx0fTtcblx0fVxuXHRyZXR1cm4gYW5ub3RhdGlvbnNMaXN0c1t0YXJnZXRdO1xufVxuXG5mdW5jdGlvbiByZW1vdmVDaGFydEFubm90YXRpb25zKGFubm90YXRpb25PYmplY3Q6IGFueSkge1xuXHRyZXR1cm4gYW5ub3RhdGlvbk9iamVjdC5maWx0ZXIoKG9SZWNvcmQ6IGFueSkgPT4ge1xuXHRcdGlmIChvUmVjb3JkLlRhcmdldCAmJiBvUmVjb3JkLlRhcmdldC4kQW5ub3RhdGlvblBhdGgpIHtcblx0XHRcdHJldHVybiBvUmVjb3JkLlRhcmdldC4kQW5ub3RhdGlvblBhdGguaW5kZXhPZihcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DaGFydFwiKSA9PT0gLTE7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUlCTkFubm90YXRpb25zKGFubm90YXRpb25PYmplY3Q6IGFueSkge1xuXHRyZXR1cm4gYW5ub3RhdGlvbk9iamVjdC5maWx0ZXIoKG9SZWNvcmQ6IGFueSkgPT4ge1xuXHRcdHJldHVybiBvUmVjb3JkLiRUeXBlICE9PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvblwiO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlUHJlc2VudGF0aW9uVmFyaWFudChhbm5vdGF0aW9uT2JqZWN0OiBhbnkpIHtcblx0cmV0dXJuIGFubm90YXRpb25PYmplY3QuZmlsdGVyKChvUmVjb3JkOiBhbnkpID0+IHtcblx0XHRyZXR1cm4gb1JlY29yZC4kQW5ub3RhdGlvblBhdGggIT09IFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNoYXJ0XCI7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVBbm5vdGF0aW9uTGlzdHMoXG5cdGFubm90YXRpb25PYmplY3RzOiBhbnksXG5cdGFubm90YXRpb25UYXJnZXQ6IHN0cmluZyxcblx0YW5ub3RhdGlvbkxpc3RzOiBSZWNvcmQ8c3RyaW5nLCBBbm5vdGF0aW9uTGlzdD4sXG5cdG9DYXBhYmlsaXRpZXM6IEVudmlyb25tZW50Q2FwYWJpbGl0aWVzXG4pIHtcblx0aWYgKE9iamVjdC5rZXlzKGFubm90YXRpb25PYmplY3RzKS5sZW5ndGggPT09IDApIHtcblx0XHRyZXR1cm47XG5cdH1cblx0Y29uc3Qgb3V0QW5ub3RhdGlvbk9iamVjdCA9IGdldE9yQ3JlYXRlQW5ub3RhdGlvbkxpc3QoYW5ub3RhdGlvblRhcmdldCwgYW5ub3RhdGlvbkxpc3RzKTtcblx0aWYgKCFvQ2FwYWJpbGl0aWVzLk1pY3JvQ2hhcnQpIHtcblx0XHRkZWxldGUgYW5ub3RhdGlvbk9iamVjdHNbXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ2hhcnRcIl07XG5cdH1cblxuXHRmb3IgKGxldCBhbm5vdGF0aW9uS2V5IGluIGFubm90YXRpb25PYmplY3RzKSB7XG5cdFx0bGV0IGFubm90YXRpb25PYmplY3QgPSBhbm5vdGF0aW9uT2JqZWN0c1thbm5vdGF0aW9uS2V5XTtcblx0XHRzd2l0Y2ggKGFubm90YXRpb25LZXkpIHtcblx0XHRcdGNhc2UgXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuSGVhZGVyRmFjZXRzXCI6XG5cdFx0XHRcdGlmICghb0NhcGFiaWxpdGllcy5NaWNyb0NoYXJ0KSB7XG5cdFx0XHRcdFx0YW5ub3RhdGlvbk9iamVjdCA9IHJlbW92ZUNoYXJ0QW5ub3RhdGlvbnMoYW5ub3RhdGlvbk9iamVjdCk7XG5cdFx0XHRcdFx0YW5ub3RhdGlvbk9iamVjdHNbYW5ub3RhdGlvbktleV0gPSBhbm5vdGF0aW9uT2JqZWN0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5JZGVudGlmaWNhdGlvblwiOlxuXHRcdFx0XHRpZiAoIW9DYXBhYmlsaXRpZXMuSW50ZW50QmFzZWROYXZpZ2F0aW9uKSB7XG5cdFx0XHRcdFx0YW5ub3RhdGlvbk9iamVjdCA9IHJlbW92ZUlCTkFubm90YXRpb25zKGFubm90YXRpb25PYmplY3QpO1xuXHRcdFx0XHRcdGFubm90YXRpb25PYmplY3RzW2Fubm90YXRpb25LZXldID0gYW5ub3RhdGlvbk9iamVjdDtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuTGluZUl0ZW1cIjpcblx0XHRcdFx0aWYgKCFvQ2FwYWJpbGl0aWVzLkludGVudEJhc2VkTmF2aWdhdGlvbikge1xuXHRcdFx0XHRcdGFubm90YXRpb25PYmplY3QgPSByZW1vdmVJQk5Bbm5vdGF0aW9ucyhhbm5vdGF0aW9uT2JqZWN0KTtcblx0XHRcdFx0XHRhbm5vdGF0aW9uT2JqZWN0c1thbm5vdGF0aW9uS2V5XSA9IGFubm90YXRpb25PYmplY3Q7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFvQ2FwYWJpbGl0aWVzLk1pY3JvQ2hhcnQpIHtcblx0XHRcdFx0XHRhbm5vdGF0aW9uT2JqZWN0ID0gcmVtb3ZlQ2hhcnRBbm5vdGF0aW9ucyhhbm5vdGF0aW9uT2JqZWN0KTtcblx0XHRcdFx0XHRhbm5vdGF0aW9uT2JqZWN0c1thbm5vdGF0aW9uS2V5XSA9IGFubm90YXRpb25PYmplY3Q7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkZpZWxkR3JvdXBcIjpcblx0XHRcdFx0aWYgKCFvQ2FwYWJpbGl0aWVzLkludGVudEJhc2VkTmF2aWdhdGlvbikge1xuXHRcdFx0XHRcdGFubm90YXRpb25PYmplY3QuRGF0YSA9IHJlbW92ZUlCTkFubm90YXRpb25zKGFubm90YXRpb25PYmplY3QuRGF0YSk7XG5cdFx0XHRcdFx0YW5ub3RhdGlvbk9iamVjdHNbYW5ub3RhdGlvbktleV0gPSBhbm5vdGF0aW9uT2JqZWN0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghb0NhcGFiaWxpdGllcy5NaWNyb0NoYXJ0KSB7XG5cdFx0XHRcdFx0YW5ub3RhdGlvbk9iamVjdC5EYXRhID0gcmVtb3ZlQ2hhcnRBbm5vdGF0aW9ucyhhbm5vdGF0aW9uT2JqZWN0LkRhdGEpO1xuXHRcdFx0XHRcdGFubm90YXRpb25PYmplY3RzW2Fubm90YXRpb25LZXldID0gYW5ub3RhdGlvbk9iamVjdDtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuUHJlc2VudGF0aW9uVmFyaWFudFwiOlxuXHRcdFx0XHRpZiAoIW9DYXBhYmlsaXRpZXMuQ2hhcnQgJiYgYW5ub3RhdGlvbk9iamVjdC5WaXN1YWxpemF0aW9ucykge1xuXHRcdFx0XHRcdGFubm90YXRpb25PYmplY3QuVmlzdWFsaXphdGlvbnMgPSBoYW5kbGVQcmVzZW50YXRpb25WYXJpYW50KGFubm90YXRpb25PYmplY3QuVmlzdWFsaXphdGlvbnMpO1xuXHRcdFx0XHRcdGFubm90YXRpb25PYmplY3RzW2Fubm90YXRpb25LZXldID0gYW5ub3RhdGlvbk9iamVjdDtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdGxldCBjdXJyZW50T3V0QW5ub3RhdGlvbk9iamVjdCA9IG91dEFubm90YXRpb25PYmplY3Q7XG5cblx0XHQvLyBDaGVjayBmb3IgYW5ub3RhdGlvbiBvZiBhbm5vdGF0aW9uXG5cdFx0Y29uc3QgYW5ub3RhdGlvbk9mQW5ub3RhdGlvblNwbGl0ID0gYW5ub3RhdGlvbktleS5zcGxpdChcIkBcIik7XG5cdFx0aWYgKGFubm90YXRpb25PZkFubm90YXRpb25TcGxpdC5sZW5ndGggPiAyKSB7XG5cdFx0XHRjdXJyZW50T3V0QW5ub3RhdGlvbk9iamVjdCA9IGdldE9yQ3JlYXRlQW5ub3RhdGlvbkxpc3QoXG5cdFx0XHRcdGFubm90YXRpb25UYXJnZXQgKyBcIkBcIiArIGFubm90YXRpb25PZkFubm90YXRpb25TcGxpdFsxXSxcblx0XHRcdFx0YW5ub3RhdGlvbkxpc3RzXG5cdFx0XHQpO1xuXHRcdFx0YW5ub3RhdGlvbktleSA9IGFubm90YXRpb25PZkFubm90YXRpb25TcGxpdFsyXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YW5ub3RhdGlvbktleSA9IGFubm90YXRpb25PZkFubm90YXRpb25TcGxpdFsxXTtcblx0XHR9XG5cblx0XHRjb25zdCBhbm5vdGF0aW9uUXVhbGlmaWVyU3BsaXQgPSBhbm5vdGF0aW9uS2V5LnNwbGl0KFwiI1wiKTtcblx0XHRjb25zdCBxdWFsaWZpZXIgPSBhbm5vdGF0aW9uUXVhbGlmaWVyU3BsaXRbMV07XG5cdFx0YW5ub3RhdGlvbktleSA9IGFubm90YXRpb25RdWFsaWZpZXJTcGxpdFswXTtcblxuXHRcdGNvbnN0IHBhcnNlZEFubm90YXRpb25PYmplY3Q6IGFueSA9IHtcblx0XHRcdHRlcm06IGAke2Fubm90YXRpb25LZXl9YCxcblx0XHRcdHF1YWxpZmllcjogcXVhbGlmaWVyXG5cdFx0fTtcblx0XHRsZXQgY3VycmVudEFubm90YXRpb25UYXJnZXQgPSBhbm5vdGF0aW9uVGFyZ2V0ICsgXCJAXCIgKyBwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnRlcm07XG5cdFx0aWYgKHF1YWxpZmllcikge1xuXHRcdFx0Y3VycmVudEFubm90YXRpb25UYXJnZXQgKz0gXCIjXCIgKyBxdWFsaWZpZXI7XG5cdFx0fVxuXHRcdGxldCBpc0NvbGxlY3Rpb24gPSBmYWxzZTtcblx0XHRjb25zdCB0eXBlb2ZBbm5vdGF0aW9uID0gdHlwZW9mIGFubm90YXRpb25PYmplY3Q7XG5cdFx0aWYgKGFubm90YXRpb25PYmplY3QgPT09IG51bGwpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QudmFsdWUgPSB7IHR5cGU6IFwiQm9vbFwiLCBCb29sOiBhbm5vdGF0aW9uT2JqZWN0IH07XG5cdFx0fSBlbHNlIGlmICh0eXBlb2ZBbm5vdGF0aW9uID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnZhbHVlID0geyB0eXBlOiBcIlN0cmluZ1wiLCBTdHJpbmc6IGFubm90YXRpb25PYmplY3QgfTtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZkFubm90YXRpb24gPT09IFwiYm9vbGVhblwiKSB7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnZhbHVlID0geyB0eXBlOiBcIkJvb2xcIiwgQm9vbDogYW5ub3RhdGlvbk9iamVjdCB9O1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mQW5ub3RhdGlvbiA9PT0gXCJudW1iZXJcIikge1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC52YWx1ZSA9IHsgdHlwZTogXCJJbnRcIiwgSW50OiBhbm5vdGF0aW9uT2JqZWN0IH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRJZiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnZhbHVlID0geyB0eXBlOiBcIklmXCIsIElmOiBhbm5vdGF0aW9uT2JqZWN0LiRJZiB9O1xuXHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kQW5kICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QudmFsdWUgPSB7IHR5cGU6IFwiQW5kXCIsIEFuZDogYW5ub3RhdGlvbk9iamVjdC4kQW5kIH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRPciAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnZhbHVlID0geyB0eXBlOiBcIk9yXCIsIE9yOiBhbm5vdGF0aW9uT2JqZWN0LiRPciB9O1xuXHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kTm90ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QudmFsdWUgPSB7IHR5cGU6IFwiTm90XCIsIE5vdDogYW5ub3RhdGlvbk9iamVjdC4kTm90IH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRFcSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnZhbHVlID0geyB0eXBlOiBcIkVxXCIsIEVxOiBhbm5vdGF0aW9uT2JqZWN0LiRFcSB9O1xuXHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kTmUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC52YWx1ZSA9IHsgdHlwZTogXCJOZVwiLCBOZTogYW5ub3RhdGlvbk9iamVjdC4kTmUgfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJEd0ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QudmFsdWUgPSB7IHR5cGU6IFwiR3RcIiwgR3Q6IGFubm90YXRpb25PYmplY3QuJEd0IH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRHZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnZhbHVlID0geyB0eXBlOiBcIkdlXCIsIEdlOiBhbm5vdGF0aW9uT2JqZWN0LiRHZSB9O1xuXHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdC4kTHQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC52YWx1ZSA9IHsgdHlwZTogXCJMdFwiLCBMdDogYW5ub3RhdGlvbk9iamVjdC4kTHQgfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJExlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QudmFsdWUgPSB7IHR5cGU6IFwiTGVcIiwgTGU6IGFubm90YXRpb25PYmplY3QuJExlIH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRBcHBseSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnZhbHVlID0geyB0eXBlOiBcIkFwcGx5XCIsIEFwcGx5OiBhbm5vdGF0aW9uT2JqZWN0LiRBcHBseSwgRnVuY3Rpb246IGFubm90YXRpb25PYmplY3QuJEZ1bmN0aW9uIH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRQYXRoICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QudmFsdWUgPSB7IHR5cGU6IFwiUGF0aFwiLCBQYXRoOiBhbm5vdGF0aW9uT2JqZWN0LiRQYXRoIH07XG5cdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0LiRBbm5vdGF0aW9uUGF0aCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LnZhbHVlID0ge1xuXHRcdFx0XHR0eXBlOiBcIkFubm90YXRpb25QYXRoXCIsXG5cdFx0XHRcdEFubm90YXRpb25QYXRoOiBhbm5vdGF0aW9uT2JqZWN0LiRBbm5vdGF0aW9uUGF0aFxuXHRcdFx0fTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJERlY2ltYWwgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC52YWx1ZSA9IHsgdHlwZTogXCJEZWNpbWFsXCIsIERlY2ltYWw6IHBhcnNlRmxvYXQoYW5ub3RhdGlvbk9iamVjdC4kRGVjaW1hbCkgfTtcblx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3QuJEVudW1NZW1iZXIgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC52YWx1ZSA9IHtcblx0XHRcdFx0dHlwZTogXCJFbnVtTWVtYmVyXCIsXG5cdFx0XHRcdEVudW1NZW1iZXI6IG1hcE5hbWVUb0FsaWFzKGFubm90YXRpb25PYmplY3QuJEVudW1NZW1iZXIuc3BsaXQoXCIvXCIpWzBdKSArIFwiL1wiICsgYW5ub3RhdGlvbk9iamVjdC4kRW51bU1lbWJlci5zcGxpdChcIi9cIilbMV1cblx0XHRcdH07XG5cdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFubm90YXRpb25PYmplY3QpKSB7XG5cdFx0XHRpc0NvbGxlY3Rpb24gPSB0cnVlO1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uID0gYW5ub3RhdGlvbk9iamVjdC5tYXAoKHN1YkFubm90YXRpb25PYmplY3QsIHN1YkFubm90YXRpb25JbmRleCkgPT5cblx0XHRcdFx0cGFyc2VBbm5vdGF0aW9uT2JqZWN0KFxuXHRcdFx0XHRcdHN1YkFubm90YXRpb25PYmplY3QsXG5cdFx0XHRcdFx0Y3VycmVudEFubm90YXRpb25UYXJnZXQgKyBcIi9cIiArIHN1YkFubm90YXRpb25JbmRleCxcblx0XHRcdFx0XHRhbm5vdGF0aW9uTGlzdHMsXG5cdFx0XHRcdFx0b0NhcGFiaWxpdGllc1xuXHRcdFx0XHQpXG5cdFx0XHQpO1xuXHRcdFx0aWYgKGFubm90YXRpb25PYmplY3QubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRQcm9wZXJ0eVBhdGhcIikpIHtcblx0XHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiUHJvcGVydHlQYXRoXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRQYXRoXCIpKSB7XG5cdFx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25PYmplY3QuY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIlBhdGhcIjtcblx0XHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIikpIHtcblx0XHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiTmF2aWdhdGlvblByb3BlcnR5UGF0aFwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkQW5ub3RhdGlvblBhdGhcIikpIHtcblx0XHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiQW5ub3RhdGlvblBhdGhcIjtcblx0XHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJFR5cGVcIikpIHtcblx0XHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiUmVjb3JkXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRJZlwiKSkge1xuXHRcdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJJZlwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkT3JcIikpIHtcblx0XHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiT3JcIjtcblx0XHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJEVxXCIpKSB7XG5cdFx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25PYmplY3QuY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIkVxXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiROZVwiKSkge1xuXHRcdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJOZVwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkTm90XCIpKSB7XG5cdFx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25PYmplY3QuY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIk5vdFwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkR3RcIikpIHtcblx0XHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiR3RcIjtcblx0XHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJEdlXCIpKSB7XG5cdFx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25PYmplY3QuY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIkdlXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoYW5ub3RhdGlvbk9iamVjdFswXS5oYXNPd25Qcm9wZXJ0eShcIiRMdFwiKSkge1xuXHRcdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJMdFwiO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGFubm90YXRpb25PYmplY3RbMF0uaGFzT3duUHJvcGVydHkoXCIkTGVcIikpIHtcblx0XHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiTGVcIjtcblx0XHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJEFuZFwiKSkge1xuXHRcdFx0XHRcdChwYXJzZWRBbm5vdGF0aW9uT2JqZWN0LmNvbGxlY3Rpb24gYXMgYW55KS50eXBlID0gXCJBbmRcIjtcblx0XHRcdFx0fSBlbHNlIGlmIChhbm5vdGF0aW9uT2JqZWN0WzBdLmhhc093blByb3BlcnR5KFwiJEFwcGx5XCIpKSB7XG5cdFx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25PYmplY3QuY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIkFwcGx5XCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGFubm90YXRpb25PYmplY3RbMF0gPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0XHQocGFyc2VkQW5ub3RhdGlvbk9iamVjdC5jb2xsZWN0aW9uIGFzIGFueSkudHlwZSA9IFwiUmVjb3JkXCI7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0KHBhcnNlZEFubm90YXRpb25PYmplY3QuY29sbGVjdGlvbiBhcyBhbnkpLnR5cGUgPSBcIlN0cmluZ1wiO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IHJlY29yZDogQW5ub3RhdGlvblJlY29yZCA9IHtcblx0XHRcdFx0cHJvcGVydHlWYWx1ZXM6IFtdXG5cdFx0XHR9O1xuXHRcdFx0aWYgKGFubm90YXRpb25PYmplY3QuJFR5cGUpIHtcblx0XHRcdFx0Y29uc3QgdHlwZVZhbHVlID0gYW5ub3RhdGlvbk9iamVjdC4kVHlwZTtcblx0XHRcdFx0cmVjb3JkLnR5cGUgPSBgJHt0eXBlVmFsdWV9YDtcblx0XHRcdH1cblx0XHRcdGNvbnN0IHByb3BlcnR5VmFsdWVzOiBhbnlbXSA9IFtdO1xuXHRcdFx0Zm9yIChjb25zdCBwcm9wZXJ0eUtleSBpbiBhbm5vdGF0aW9uT2JqZWN0KSB7XG5cdFx0XHRcdGlmIChwcm9wZXJ0eUtleSAhPT0gXCIkVHlwZVwiICYmICFwcm9wZXJ0eUtleS5zdGFydHNXaXRoKFwiQFwiKSkge1xuXHRcdFx0XHRcdHByb3BlcnR5VmFsdWVzLnB1c2goXG5cdFx0XHRcdFx0XHRwYXJzZVByb3BlcnR5VmFsdWUoXG5cdFx0XHRcdFx0XHRcdGFubm90YXRpb25PYmplY3RbcHJvcGVydHlLZXldLFxuXHRcdFx0XHRcdFx0XHRwcm9wZXJ0eUtleSxcblx0XHRcdFx0XHRcdFx0Y3VycmVudEFubm90YXRpb25UYXJnZXQsXG5cdFx0XHRcdFx0XHRcdGFubm90YXRpb25MaXN0cyxcblx0XHRcdFx0XHRcdFx0b0NhcGFiaWxpdGllc1xuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAocHJvcGVydHlLZXkuc3RhcnRzV2l0aChcIkBcIikpIHtcblx0XHRcdFx0XHQvLyBBbm5vdGF0aW9uIG9mIHJlY29yZFxuXHRcdFx0XHRcdGNyZWF0ZUFubm90YXRpb25MaXN0cyhcblx0XHRcdFx0XHRcdHsgW3Byb3BlcnR5S2V5XTogYW5ub3RhdGlvbk9iamVjdFtwcm9wZXJ0eUtleV0gfSxcblx0XHRcdFx0XHRcdGN1cnJlbnRBbm5vdGF0aW9uVGFyZ2V0LFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvbkxpc3RzLFxuXHRcdFx0XHRcdFx0b0NhcGFiaWxpdGllc1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJlY29yZC5wcm9wZXJ0eVZhbHVlcyA9IHByb3BlcnR5VmFsdWVzO1xuXHRcdFx0cGFyc2VkQW5ub3RhdGlvbk9iamVjdC5yZWNvcmQgPSByZWNvcmQ7XG5cdFx0fVxuXHRcdHBhcnNlZEFubm90YXRpb25PYmplY3QuaXNDb2xsZWN0aW9uID0gaXNDb2xsZWN0aW9uO1xuXHRcdGN1cnJlbnRPdXRBbm5vdGF0aW9uT2JqZWN0LmFubm90YXRpb25zLnB1c2gocGFyc2VkQW5ub3RhdGlvbk9iamVjdCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcHJlcGFyZVByb3BlcnR5KHByb3BlcnR5RGVmaW5pdGlvbjogYW55LCBlbnRpdHlUeXBlT2JqZWN0OiBFbnRpdHlUeXBlIHwgQ29tcGxleFR5cGUsIHByb3BlcnR5TmFtZTogc3RyaW5nKTogUHJvcGVydHkge1xuXHRjb25zdCBwcm9wZXJ0eU9iamVjdDogUHJvcGVydHkgPSB7XG5cdFx0X3R5cGU6IFwiUHJvcGVydHlcIixcblx0XHRuYW1lOiBwcm9wZXJ0eU5hbWUsXG5cdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiBgJHtlbnRpdHlUeXBlT2JqZWN0LmZ1bGx5UXVhbGlmaWVkTmFtZX0vJHtwcm9wZXJ0eU5hbWV9YCxcblx0XHR0eXBlOiBwcm9wZXJ0eURlZmluaXRpb24uJFR5cGUsXG5cdFx0bWF4TGVuZ3RoOiBwcm9wZXJ0eURlZmluaXRpb24uJE1heExlbmd0aCxcblx0XHRwcmVjaXNpb246IHByb3BlcnR5RGVmaW5pdGlvbi4kUHJlY2lzaW9uLFxuXHRcdHNjYWxlOiBwcm9wZXJ0eURlZmluaXRpb24uJFNjYWxlLFxuXHRcdG51bGxhYmxlOiBwcm9wZXJ0eURlZmluaXRpb24uJE51bGxhYmxlXG5cdH07XG5cdHJldHVybiBwcm9wZXJ0eU9iamVjdDtcbn1cblxuZnVuY3Rpb24gcHJlcGFyZU5hdmlnYXRpb25Qcm9wZXJ0eShcblx0bmF2UHJvcGVydHlEZWZpbml0aW9uOiBhbnksXG5cdGVudGl0eVR5cGVPYmplY3Q6IEVudGl0eVR5cGUgfCBDb21wbGV4VHlwZSxcblx0bmF2UHJvcGVydHlOYW1lOiBzdHJpbmdcbik6IFY0TmF2aWdhdGlvblByb3BlcnR5IHtcblx0bGV0IHJlZmVyZW50aWFsQ29uc3RyYWludDogUmVmZXJlbnRpYWxDb25zdHJhaW50W10gPSBbXTtcblx0aWYgKG5hdlByb3BlcnR5RGVmaW5pdGlvbi4kUmVmZXJlbnRpYWxDb25zdHJhaW50KSB7XG5cdFx0cmVmZXJlbnRpYWxDb25zdHJhaW50ID0gT2JqZWN0LmtleXMobmF2UHJvcGVydHlEZWZpbml0aW9uLiRSZWZlcmVudGlhbENvbnN0cmFpbnQpLm1hcChzb3VyY2VQcm9wZXJ0eU5hbWUgPT4ge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0c291cmNlVHlwZU5hbWU6IGVudGl0eVR5cGVPYmplY3QubmFtZSxcblx0XHRcdFx0c291cmNlUHJvcGVydHk6IHNvdXJjZVByb3BlcnR5TmFtZSxcblx0XHRcdFx0dGFyZ2V0VHlwZU5hbWU6IG5hdlByb3BlcnR5RGVmaW5pdGlvbi4kVHlwZSxcblx0XHRcdFx0dGFyZ2V0UHJvcGVydHk6IG5hdlByb3BlcnR5RGVmaW5pdGlvbi4kUmVmZXJlbnRpYWxDb25zdHJhaW50W3NvdXJjZVByb3BlcnR5TmFtZV1cblx0XHRcdH07XG5cdFx0fSk7XG5cdH1cblx0Y29uc3QgbmF2aWdhdGlvblByb3BlcnR5OiBWNE5hdmlnYXRpb25Qcm9wZXJ0eSA9IHtcblx0XHRfdHlwZTogXCJOYXZpZ2F0aW9uUHJvcGVydHlcIixcblx0XHRuYW1lOiBuYXZQcm9wZXJ0eU5hbWUsXG5cdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiBgJHtlbnRpdHlUeXBlT2JqZWN0LmZ1bGx5UXVhbGlmaWVkTmFtZX0vJHtuYXZQcm9wZXJ0eU5hbWV9YCxcblx0XHRwYXJ0bmVyOiBuYXZQcm9wZXJ0eURlZmluaXRpb24uJFBhcnRuZXIsXG5cdFx0aXNDb2xsZWN0aW9uOiBuYXZQcm9wZXJ0eURlZmluaXRpb24uJGlzQ29sbGVjdGlvbiA/IG5hdlByb3BlcnR5RGVmaW5pdGlvbi4kaXNDb2xsZWN0aW9uIDogZmFsc2UsXG5cdFx0Y29udGFpbnNUYXJnZXQ6IG5hdlByb3BlcnR5RGVmaW5pdGlvbi4kQ29udGFpbnNUYXJnZXQsXG5cdFx0dGFyZ2V0VHlwZU5hbWU6IG5hdlByb3BlcnR5RGVmaW5pdGlvbi4kVHlwZSxcblx0XHRyZWZlcmVudGlhbENvbnN0cmFpbnRcblx0fTtcblxuXHRyZXR1cm4gbmF2aWdhdGlvblByb3BlcnR5O1xufVxuXG5mdW5jdGlvbiBwcmVwYXJlRW50aXR5U2V0KGVudGl0eVNldERlZmluaXRpb246IGFueSwgZW50aXR5U2V0TmFtZTogc3RyaW5nLCBlbnRpdHlDb250YWluZXJOYW1lOiBzdHJpbmcpOiBFbnRpdHlTZXQge1xuXHRjb25zdCBlbnRpdHlTZXRPYmplY3Q6IEVudGl0eVNldCA9IHtcblx0XHRfdHlwZTogXCJFbnRpdHlTZXRcIixcblx0XHRuYW1lOiBlbnRpdHlTZXROYW1lLFxuXHRcdG5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmc6IHt9LFxuXHRcdGVudGl0eVR5cGVOYW1lOiBlbnRpdHlTZXREZWZpbml0aW9uLiRUeXBlLFxuXHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogYCR7ZW50aXR5Q29udGFpbmVyTmFtZX0vJHtlbnRpdHlTZXROYW1lfWBcblx0fTtcblx0cmV0dXJuIGVudGl0eVNldE9iamVjdDtcbn1cblxuZnVuY3Rpb24gcHJlcGFyZVNpbmdsZXRvbihzaW5nbGV0b25EZWZpbml0aW9uOiBhbnksIHNpbmdsZXRvbk5hbWU6IHN0cmluZywgZW50aXR5Q29udGFpbmVyTmFtZTogc3RyaW5nKTogU2luZ2xldG9uIHtcblx0Y29uc3Qgc2luZ2xldG9uT2JqZWN0OiBTaW5nbGV0b24gPSB7XG5cdFx0X3R5cGU6IFwiU2luZ2xldG9uXCIsXG5cdFx0bmFtZTogc2luZ2xldG9uTmFtZSxcblx0XHRuYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nOiB7fSxcblx0XHR0eXBlTmFtZTogc2luZ2xldG9uRGVmaW5pdGlvbi4kVHlwZSxcblx0XHRmdWxseVF1YWxpZmllZE5hbWU6IGAke2VudGl0eUNvbnRhaW5lck5hbWV9LyR7c2luZ2xldG9uTmFtZX1gLFxuXHRcdG51bGxhYmxlOiB0cnVlXG5cdH07XG5cdHJldHVybiBzaW5nbGV0b25PYmplY3Q7XG59XG5cbmZ1bmN0aW9uIHByZXBhcmVDb21wbGV4VHlwZShjb21wbGV4VHlwZURlZmluaXRpb246IGFueSwgY29tcGxleFR5cGVOYW1lOiBzdHJpbmcsIG5hbWVzcGFjZTogc3RyaW5nKTogQ29tcGxleFR5cGUge1xuXHRjb25zdCBjb21wbGV4VHlwZU9iamVjdDogQ29tcGxleFR5cGUgPSB7XG5cdFx0X3R5cGU6IFwiQ29tcGxleFR5cGVcIixcblx0XHRuYW1lOiBjb21wbGV4VHlwZU5hbWUucmVwbGFjZShuYW1lc3BhY2UgKyBcIi5cIiwgXCJcIiksXG5cdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiBjb21wbGV4VHlwZU5hbWUsXG5cdFx0cHJvcGVydGllczogW10sXG5cdFx0bmF2aWdhdGlvblByb3BlcnRpZXM6IFtdXG5cdH07XG5cblx0Y29uc3QgY29tcGxleFR5cGVQcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMoY29tcGxleFR5cGVEZWZpbml0aW9uKVxuXHRcdC5maWx0ZXIocHJvcGVydHlOYW1lT3JOb3QgPT4ge1xuXHRcdFx0aWYgKHByb3BlcnR5TmFtZU9yTm90ICE9IFwiJEtleVwiICYmIHByb3BlcnR5TmFtZU9yTm90ICE9IFwiJGtpbmRcIikge1xuXHRcdFx0XHRyZXR1cm4gY29tcGxleFR5cGVEZWZpbml0aW9uW3Byb3BlcnR5TmFtZU9yTm90XS4ka2luZCA9PT0gXCJQcm9wZXJ0eVwiO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LnNvcnQoKGEsIGIpID0+IChhID4gYiA/IDEgOiAtMSkpXG5cdFx0Lm1hcChwcm9wZXJ0eU5hbWUgPT4ge1xuXHRcdFx0cmV0dXJuIHByZXBhcmVQcm9wZXJ0eShjb21wbGV4VHlwZURlZmluaXRpb25bcHJvcGVydHlOYW1lXSwgY29tcGxleFR5cGVPYmplY3QsIHByb3BlcnR5TmFtZSk7XG5cdFx0fSk7XG5cblx0Y29tcGxleFR5cGVPYmplY3QucHJvcGVydGllcyA9IGNvbXBsZXhUeXBlUHJvcGVydGllcztcblx0Y29uc3QgY29tcGxleFR5cGVOYXZpZ2F0aW9uUHJvcGVydGllcyA9IE9iamVjdC5rZXlzKGNvbXBsZXhUeXBlRGVmaW5pdGlvbilcblx0XHQuZmlsdGVyKHByb3BlcnR5TmFtZU9yTm90ID0+IHtcblx0XHRcdGlmIChwcm9wZXJ0eU5hbWVPck5vdCAhPSBcIiRLZXlcIiAmJiBwcm9wZXJ0eU5hbWVPck5vdCAhPSBcIiRraW5kXCIpIHtcblx0XHRcdFx0cmV0dXJuIGNvbXBsZXhUeXBlRGVmaW5pdGlvbltwcm9wZXJ0eU5hbWVPck5vdF0uJGtpbmQgPT09IFwiTmF2aWdhdGlvblByb3BlcnR5XCI7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQuc29ydCgoYSwgYikgPT4gKGEgPiBiID8gMSA6IC0xKSlcblx0XHQubWFwKG5hdlByb3BlcnR5TmFtZSA9PiB7XG5cdFx0XHRyZXR1cm4gcHJlcGFyZU5hdmlnYXRpb25Qcm9wZXJ0eShjb21wbGV4VHlwZURlZmluaXRpb25bbmF2UHJvcGVydHlOYW1lXSwgY29tcGxleFR5cGVPYmplY3QsIG5hdlByb3BlcnR5TmFtZSk7XG5cdFx0fSk7XG5cdGNvbXBsZXhUeXBlT2JqZWN0Lm5hdmlnYXRpb25Qcm9wZXJ0aWVzID0gY29tcGxleFR5cGVOYXZpZ2F0aW9uUHJvcGVydGllcztcblx0cmV0dXJuIGNvbXBsZXhUeXBlT2JqZWN0O1xufVxuXG5mdW5jdGlvbiBwcmVwYXJlRW50aXR5S2V5cyhlbnRpdHlUeXBlRGVmaW5pdGlvbjogYW55LCBvTWV0YU1vZGVsRGF0YTogYW55KTogYW55IHtcblx0aWYgKCFlbnRpdHlUeXBlRGVmaW5pdGlvbi4kS2V5ICYmIGVudGl0eVR5cGVEZWZpbml0aW9uLiRCYXNlVHlwZSkge1xuXHRcdHJldHVybiBwcmVwYXJlRW50aXR5S2V5cyhvTWV0YU1vZGVsRGF0YVtgJHtlbnRpdHlUeXBlRGVmaW5pdGlvbi4kQmFzZVR5cGV9YF0sIG9NZXRhTW9kZWxEYXRhKTtcblx0fVxuXHRyZXR1cm4gZW50aXR5VHlwZURlZmluaXRpb24uJEtleSB8fCBbXTsgLy9oYW5kbGluZyBvZiBlbnRpdHkgdHlwZXMgd2l0aG91dCBrZXkgYXMgd2VsbCBhcyBiYXNldHlwZVxufVxuXG5mdW5jdGlvbiBwcmVwYXJlRW50aXR5VHlwZShlbnRpdHlUeXBlRGVmaW5pdGlvbjogYW55LCBlbnRpdHlUeXBlTmFtZTogc3RyaW5nLCBuYW1lc3BhY2U6IHN0cmluZywgbWV0YU1vZGVsRGF0YTogYW55KTogRW50aXR5VHlwZSB7XG5cdGNvbnN0IGVudGl0eUtleXM6IGFueSA9IHByZXBhcmVFbnRpdHlLZXlzKGVudGl0eVR5cGVEZWZpbml0aW9uLCBtZXRhTW9kZWxEYXRhKTtcblxuXHRjb25zdCBlbnRpdHlUeXBlT2JqZWN0OiBFbnRpdHlUeXBlID0ge1xuXHRcdF90eXBlOiBcIkVudGl0eVR5cGVcIixcblx0XHRuYW1lOiBlbnRpdHlUeXBlTmFtZS5yZXBsYWNlKG5hbWVzcGFjZSArIFwiLlwiLCBcIlwiKSxcblx0XHRmdWxseVF1YWxpZmllZE5hbWU6IGVudGl0eVR5cGVOYW1lLFxuXHRcdGtleXM6IFtdLFxuXHRcdGVudGl0eVByb3BlcnRpZXM6IFtdLFxuXHRcdG5hdmlnYXRpb25Qcm9wZXJ0aWVzOiBbXVxuXHR9O1xuXG5cdGNvbnN0IGVudGl0eVByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhlbnRpdHlUeXBlRGVmaW5pdGlvbilcblx0XHQuZmlsdGVyKHByb3BlcnR5TmFtZU9yTm90ID0+IHtcblx0XHRcdGlmIChwcm9wZXJ0eU5hbWVPck5vdCAhPSBcIiRLZXlcIiAmJiBwcm9wZXJ0eU5hbWVPck5vdCAhPSBcIiRraW5kXCIpIHtcblx0XHRcdFx0cmV0dXJuIGVudGl0eVR5cGVEZWZpbml0aW9uW3Byb3BlcnR5TmFtZU9yTm90XS4ka2luZCA9PT0gXCJQcm9wZXJ0eVwiO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0Lm1hcChwcm9wZXJ0eU5hbWUgPT4ge1xuXHRcdFx0cmV0dXJuIHByZXBhcmVQcm9wZXJ0eShlbnRpdHlUeXBlRGVmaW5pdGlvbltwcm9wZXJ0eU5hbWVdLCBlbnRpdHlUeXBlT2JqZWN0LCBwcm9wZXJ0eU5hbWUpO1xuXHRcdH0pO1xuXG5cdGNvbnN0IG5hdmlnYXRpb25Qcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMoZW50aXR5VHlwZURlZmluaXRpb24pXG5cdFx0LmZpbHRlcihwcm9wZXJ0eU5hbWVPck5vdCA9PiB7XG5cdFx0XHRpZiAocHJvcGVydHlOYW1lT3JOb3QgIT0gXCIkS2V5XCIgJiYgcHJvcGVydHlOYW1lT3JOb3QgIT0gXCIka2luZFwiKSB7XG5cdFx0XHRcdHJldHVybiBlbnRpdHlUeXBlRGVmaW5pdGlvbltwcm9wZXJ0eU5hbWVPck5vdF0uJGtpbmQgPT09IFwiTmF2aWdhdGlvblByb3BlcnR5XCI7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQubWFwKG5hdlByb3BlcnR5TmFtZSA9PiB7XG5cdFx0XHRyZXR1cm4gcHJlcGFyZU5hdmlnYXRpb25Qcm9wZXJ0eShlbnRpdHlUeXBlRGVmaW5pdGlvbltuYXZQcm9wZXJ0eU5hbWVdLCBlbnRpdHlUeXBlT2JqZWN0LCBuYXZQcm9wZXJ0eU5hbWUpO1xuXHRcdH0pO1xuXG5cdGVudGl0eVR5cGVPYmplY3Qua2V5cyA9IGVudGl0eUtleXNcblx0XHQubWFwKChlbnRpdHlLZXk6IHN0cmluZykgPT4gZW50aXR5UHJvcGVydGllcy5maW5kKChwcm9wZXJ0eTogUHJvcGVydHkpID0+IHByb3BlcnR5Lm5hbWUgPT09IGVudGl0eUtleSkpXG5cdFx0LmZpbHRlcigocHJvcGVydHk6IFByb3BlcnR5KSA9PiBwcm9wZXJ0eSAhPT0gdW5kZWZpbmVkKTtcblx0ZW50aXR5VHlwZU9iamVjdC5lbnRpdHlQcm9wZXJ0aWVzID0gZW50aXR5UHJvcGVydGllcztcblx0ZW50aXR5VHlwZU9iamVjdC5uYXZpZ2F0aW9uUHJvcGVydGllcyA9IG5hdmlnYXRpb25Qcm9wZXJ0aWVzO1xuXG5cdHJldHVybiBlbnRpdHlUeXBlT2JqZWN0O1xufVxuZnVuY3Rpb24gcHJlcGFyZUFjdGlvbihhY3Rpb25OYW1lOiBzdHJpbmcsIGFjdGlvblJhd0RhdGE6IE1ldGFNb2RlbEFjdGlvbiwgbmFtZXNwYWNlOiBzdHJpbmcsIGVudGl0eUNvbnRhaW5lck5hbWU6IHN0cmluZyk6IEFjdGlvbiB7XG5cdGxldCBhY3Rpb25FbnRpdHlUeXBlOiBzdHJpbmcgPSBcIlwiO1xuXHRsZXQgYWN0aW9uRlFOID0gYCR7YWN0aW9uTmFtZX1gO1xuXHRjb25zdCBhY3Rpb25TaG9ydE5hbWUgPSBhY3Rpb25OYW1lLnN1YnN0cihuYW1lc3BhY2UubGVuZ3RoICsgMSk7XG5cdGlmIChhY3Rpb25SYXdEYXRhLiRJc0JvdW5kKSB7XG5cdFx0Y29uc3QgYmluZGluZ1BhcmFtZXRlciA9IGFjdGlvblJhd0RhdGEuJFBhcmFtZXRlclswXTtcblx0XHRhY3Rpb25FbnRpdHlUeXBlID0gYmluZGluZ1BhcmFtZXRlci4kVHlwZTtcblx0XHRpZiAoYmluZGluZ1BhcmFtZXRlci4kaXNDb2xsZWN0aW9uID09PSB0cnVlKSB7XG5cdFx0XHRhY3Rpb25GUU4gPSBgJHthY3Rpb25OYW1lfShDb2xsZWN0aW9uKCR7YWN0aW9uRW50aXR5VHlwZX0pKWA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGFjdGlvbkZRTiA9IGAke2FjdGlvbk5hbWV9KCR7YWN0aW9uRW50aXR5VHlwZX0pYDtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0YWN0aW9uRlFOID0gYCR7ZW50aXR5Q29udGFpbmVyTmFtZX0vJHthY3Rpb25TaG9ydE5hbWV9YDtcblx0fVxuXHRjb25zdCBwYXJhbWV0ZXJzID0gYWN0aW9uUmF3RGF0YS4kUGFyYW1ldGVyIHx8IFtdO1xuXHRyZXR1cm4ge1xuXHRcdF90eXBlOiBcIkFjdGlvblwiLFxuXHRcdG5hbWU6IGFjdGlvblNob3J0TmFtZSxcblx0XHRmdWxseVF1YWxpZmllZE5hbWU6IGFjdGlvbkZRTixcblx0XHRpc0JvdW5kOiBhY3Rpb25SYXdEYXRhLiRJc0JvdW5kLFxuXHRcdHNvdXJjZVR5cGU6IGFjdGlvbkVudGl0eVR5cGUsXG5cdFx0cmV0dXJuVHlwZTogYWN0aW9uUmF3RGF0YS4kUmV0dXJuVHlwZSA/IGFjdGlvblJhd0RhdGEuJFJldHVyblR5cGUuJFR5cGUgOiBcIlwiLFxuXHRcdHBhcmFtZXRlcnM6IHBhcmFtZXRlcnMubWFwKHBhcmFtID0+IHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdF90eXBlOiBcIkFjdGlvblBhcmFtZXRlclwiLFxuXHRcdFx0XHRpc0VudGl0eVNldDogcGFyYW0uJFR5cGUgPT09IGFjdGlvblJhd0RhdGEuJEVudGl0eVNldFBhdGgsXG5cdFx0XHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogYCR7YWN0aW9uRlFOfS8ke3BhcmFtLiROYW1lfWAsXG5cdFx0XHRcdHR5cGU6IHBhcmFtLiRUeXBlXG5cdFx0XHRcdC8vIFRPRE8gbWlzc2luZyBwcm9wZXJ0aWVzID9cblx0XHRcdH07XG5cdFx0fSlcblx0fTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwcmVwYXJlRW50aXR5VHlwZXMoXG5cdG9NZXRhTW9kZWw6IE9EYXRhTWV0YU1vZGVsLFxuXHRvQ2FwYWJpbGl0aWVzOiBFbnZpcm9ubWVudENhcGFiaWxpdGllcyA9IERlZmF1bHRFbnZpcm9ubWVudENhcGFiaWxpdGllc1xuKTogUGFyc2VyT3V0cHV0IHtcblx0Y29uc3Qgb01ldGFNb2RlbERhdGEgPSBvTWV0YU1vZGVsLmdldE9iamVjdChcIi8kXCIpO1xuXHRjb25zdCBhbm5vdGF0aW9uTGlzdHM6IFJlY29yZDxzdHJpbmcsIEFubm90YXRpb25MaXN0PiA9IHt9O1xuXHRjb25zdCBlbnRpdHlUeXBlczogRW50aXR5VHlwZVtdID0gW107XG5cdGNvbnN0IGVudGl0eVNldHM6IEVudGl0eVNldFtdID0gW107XG5cdGNvbnN0IHNpbmdsZXRvbnM6IFNpbmdsZXRvbltdID0gW107XG5cdGNvbnN0IGNvbXBsZXhUeXBlczogQ29tcGxleFR5cGVbXSA9IFtdO1xuXHRjb25zdCBlbnRpdHlDb250YWluZXJOYW1lID0gb01ldGFNb2RlbERhdGEuJEVudGl0eUNvbnRhaW5lcjtcblx0bGV0IG5hbWVzcGFjZSA9IFwiXCI7XG5cdGNvbnN0IHNjaGVtYUtleXMgPSBPYmplY3Qua2V5cyhvTWV0YU1vZGVsRGF0YSkuZmlsdGVyKG1ldGFtb2RlbEtleSA9PiBvTWV0YU1vZGVsRGF0YVttZXRhbW9kZWxLZXldLiRraW5kID09PSBcIlNjaGVtYVwiKTtcblx0aWYgKHNjaGVtYUtleXMgJiYgc2NoZW1hS2V5cy5sZW5ndGggPiAwKSB7XG5cdFx0bmFtZXNwYWNlID0gc2NoZW1hS2V5c1swXS5zdWJzdHIoMCwgc2NoZW1hS2V5c1swXS5sZW5ndGggLSAxKTtcblx0fSBlbHNlIGlmIChlbnRpdHlUeXBlcyAmJiBlbnRpdHlUeXBlcy5sZW5ndGgpIHtcblx0XHRuYW1lc3BhY2UgPSBlbnRpdHlUeXBlc1swXS5mdWxseVF1YWxpZmllZE5hbWUucmVwbGFjZShlbnRpdHlUeXBlc1swXS5uYW1lLCBcIlwiKTtcblx0XHRuYW1lc3BhY2UgPSBuYW1lc3BhY2Uuc3Vic3RyKDAsIG5hbWVzcGFjZS5sZW5ndGggLSAxKTtcblx0fVxuXHRPYmplY3Qua2V5cyhvTWV0YU1vZGVsRGF0YSkuZm9yRWFjaChzT2JqZWN0TmFtZSA9PiB7XG5cdFx0aWYgKHNPYmplY3ROYW1lICE9PSBcIiRraW5kXCIpIHtcblx0XHRcdHN3aXRjaCAob01ldGFNb2RlbERhdGFbc09iamVjdE5hbWVdLiRraW5kKSB7XG5cdFx0XHRcdGNhc2UgXCJFbnRpdHlUeXBlXCI6XG5cdFx0XHRcdFx0Y29uc3QgZW50aXR5VHlwZSA9IHByZXBhcmVFbnRpdHlUeXBlKG9NZXRhTW9kZWxEYXRhW3NPYmplY3ROYW1lXSwgc09iamVjdE5hbWUsIG5hbWVzcGFjZSwgb01ldGFNb2RlbERhdGEpO1xuXHRcdFx0XHRcdC8vIENoZWNrIGlmIHRoZXJlIGFyZSBmaWx0ZXIgZmFjZXRzIGRlZmluZWQgZm9yIHRoZSBlbnRpdHlUeXBlIGFuZCBpZiB5ZXMsIGNoZWNrIGlmIGFsbCBvZiB0aGVtIGhhdmUgYW4gSURcblx0XHRcdFx0XHQvLyBUaGUgSUQgaXMgb3B0aW9uYWwsIGJ1dCBpdCBpcyBpbnRlcm5hbGx5IHRha2VuIGZvciBncm91cGluZyBmaWx0ZXIgZmllbGRzIGFuZCBpZiBpdCdzIG5vdCBwcmVzZW50XG5cdFx0XHRcdFx0Ly8gYSBmYWxsYmFjayBJRCBuZWVkcyB0byBiZSBnZW5lcmF0ZWQgaGVyZS5cblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRvTWV0YU1vZGVsRGF0YS4kQW5ub3RhdGlvbnNbZW50aXR5VHlwZS5mdWxseVF1YWxpZmllZE5hbWVdICYmXG5cdFx0XHRcdFx0XHRvTWV0YU1vZGVsRGF0YS4kQW5ub3RhdGlvbnNbZW50aXR5VHlwZS5mdWxseVF1YWxpZmllZE5hbWVdW1wiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkZpbHRlckZhY2V0c1wiXVxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0b01ldGFNb2RlbERhdGEuJEFubm90YXRpb25zW2VudGl0eVR5cGUuZnVsbHlRdWFsaWZpZWROYW1lXVtcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5GaWx0ZXJGYWNldHNcIl0uZm9yRWFjaChcblx0XHRcdFx0XHRcdFx0KGZpbHRlckZhY2V0QW5ub3RhdGlvbjogYW55KSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0ZmlsdGVyRmFjZXRBbm5vdGF0aW9uLklEID0gZmlsdGVyRmFjZXRBbm5vdGF0aW9uLklEIHx8IGdlbmVyYXRlKFt7IEZhY2V0OiBmaWx0ZXJGYWNldEFubm90YXRpb24gfV0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbnRpdHlUeXBlLmVudGl0eVByb3BlcnRpZXMuZm9yRWFjaChlbnRpdHlQcm9wZXJ0eSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoIW9NZXRhTW9kZWxEYXRhLiRBbm5vdGF0aW9uc1tlbnRpdHlQcm9wZXJ0eS5mdWxseVF1YWxpZmllZE5hbWVdKSB7XG5cdFx0XHRcdFx0XHRcdG9NZXRhTW9kZWxEYXRhLiRBbm5vdGF0aW9uc1tlbnRpdHlQcm9wZXJ0eS5mdWxseVF1YWxpZmllZE5hbWVdID0ge307XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRcdCFvTWV0YU1vZGVsRGF0YS4kQW5ub3RhdGlvbnNbZW50aXR5UHJvcGVydHkuZnVsbHlRdWFsaWZpZWROYW1lXVtcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGREZWZhdWx0XCJdXG5cdFx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdFx0b01ldGFNb2RlbERhdGEuJEFubm90YXRpb25zW2VudGl0eVByb3BlcnR5LmZ1bGx5UXVhbGlmaWVkTmFtZV1bXG5cdFx0XHRcdFx0XHRcdFx0XCJAY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRGVmYXVsdFwiXG5cdFx0XHRcdFx0XHRcdF0gPSB7XG5cdFx0XHRcdFx0XHRcdFx0JFR5cGU6IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkXCIsXG5cdFx0XHRcdFx0XHRcdFx0VmFsdWU6IHsgJFBhdGg6IGVudGl0eVByb3BlcnR5Lm5hbWUgfVxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGVudGl0eVR5cGVzLnB1c2goZW50aXR5VHlwZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJDb21wbGV4VHlwZVwiOlxuXHRcdFx0XHRcdGNvbnN0IGNvbXBsZXhUeXBlID0gcHJlcGFyZUNvbXBsZXhUeXBlKG9NZXRhTW9kZWxEYXRhW3NPYmplY3ROYW1lXSwgc09iamVjdE5hbWUsIG5hbWVzcGFjZSk7XG5cdFx0XHRcdFx0Y29tcGxleFR5cGVzLnB1c2goY29tcGxleFR5cGUpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0Y29uc3Qgb0VudGl0eUNvbnRhaW5lciA9IG9NZXRhTW9kZWxEYXRhW2VudGl0eUNvbnRhaW5lck5hbWVdO1xuXHRPYmplY3Qua2V5cyhvRW50aXR5Q29udGFpbmVyKS5mb3JFYWNoKHNPYmplY3ROYW1lID0+IHtcblx0XHRpZiAoc09iamVjdE5hbWUgIT09IFwiJGtpbmRcIikge1xuXHRcdFx0c3dpdGNoIChvRW50aXR5Q29udGFpbmVyW3NPYmplY3ROYW1lXS4ka2luZCkge1xuXHRcdFx0XHRjYXNlIFwiRW50aXR5U2V0XCI6XG5cdFx0XHRcdFx0Y29uc3QgZW50aXR5U2V0ID0gcHJlcGFyZUVudGl0eVNldChvRW50aXR5Q29udGFpbmVyW3NPYmplY3ROYW1lXSwgc09iamVjdE5hbWUsIGVudGl0eUNvbnRhaW5lck5hbWUpO1xuXHRcdFx0XHRcdGVudGl0eVNldHMucHVzaChlbnRpdHlTZXQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiU2luZ2xldG9uXCI6XG5cdFx0XHRcdFx0Y29uc3Qgc2luZ2xldG9uID0gcHJlcGFyZVNpbmdsZXRvbihvRW50aXR5Q29udGFpbmVyW3NPYmplY3ROYW1lXSwgc09iamVjdE5hbWUsIGVudGl0eUNvbnRhaW5lck5hbWUpO1xuXHRcdFx0XHRcdHNpbmdsZXRvbnMucHVzaChzaW5nbGV0b24pO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0bGV0IGVudGl0eUNvbnRhaW5lcjogRW50aXR5Q29udGFpbmVyID0ge307XG5cdGlmIChlbnRpdHlDb250YWluZXJOYW1lKSB7XG5cdFx0ZW50aXR5Q29udGFpbmVyID0ge1xuXHRcdFx0bmFtZTogZW50aXR5Q29udGFpbmVyTmFtZS5yZXBsYWNlKG5hbWVzcGFjZSArIFwiLlwiLCBcIlwiKSxcblx0XHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogZW50aXR5Q29udGFpbmVyTmFtZVxuXHRcdH07XG5cdH1cblx0ZW50aXR5U2V0cy5mb3JFYWNoKGVudGl0eVNldCA9PiB7XG5cdFx0Y29uc3QgbmF2UHJvcGVydHlCaW5kaW5ncyA9IG9FbnRpdHlDb250YWluZXJbZW50aXR5U2V0Lm5hbWVdLiROYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nO1xuXHRcdGlmIChuYXZQcm9wZXJ0eUJpbmRpbmdzKSB7XG5cdFx0XHRPYmplY3Qua2V5cyhuYXZQcm9wZXJ0eUJpbmRpbmdzKS5mb3JFYWNoKG5hdlByb3BOYW1lID0+IHtcblx0XHRcdFx0Y29uc3QgdGFyZ2V0RW50aXR5U2V0ID0gZW50aXR5U2V0cy5maW5kKGVudGl0eVNldE5hbWUgPT4gZW50aXR5U2V0TmFtZS5uYW1lID09PSBuYXZQcm9wZXJ0eUJpbmRpbmdzW25hdlByb3BOYW1lXSk7XG5cdFx0XHRcdGlmICh0YXJnZXRFbnRpdHlTZXQpIHtcblx0XHRcdFx0XHRlbnRpdHlTZXQubmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1tuYXZQcm9wTmFtZV0gPSB0YXJnZXRFbnRpdHlTZXQ7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG5cblx0Y29uc3QgYWN0aW9uczogQWN0aW9uW10gPSBPYmplY3Qua2V5cyhvTWV0YU1vZGVsRGF0YSlcblx0XHQuZmlsdGVyKGtleSA9PiB7XG5cdFx0XHRyZXR1cm4gQXJyYXkuaXNBcnJheShvTWV0YU1vZGVsRGF0YVtrZXldKSAmJiBvTWV0YU1vZGVsRGF0YVtrZXldLmxlbmd0aCA+IDAgJiYgb01ldGFNb2RlbERhdGFba2V5XVswXS4ka2luZCA9PT0gXCJBY3Rpb25cIjtcblx0XHR9KVxuXHRcdC5yZWR1Y2UoKG91dEFjdGlvbnM6IEFjdGlvbltdLCBhY3Rpb25OYW1lKSA9PiB7XG5cdFx0XHRjb25zdCBhY3Rpb25zID0gb01ldGFNb2RlbERhdGFbYWN0aW9uTmFtZV07XG5cdFx0XHRhY3Rpb25zLmZvckVhY2goKGFjdGlvbjogTWV0YU1vZGVsQWN0aW9uKSA9PiB7XG5cdFx0XHRcdG91dEFjdGlvbnMucHVzaChwcmVwYXJlQWN0aW9uKGFjdGlvbk5hbWUsIGFjdGlvbiwgbmFtZXNwYWNlLCBlbnRpdHlDb250YWluZXJOYW1lKSk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBvdXRBY3Rpb25zO1xuXHRcdH0sIFtdKTtcblxuXHRmb3IgKGNvbnN0IHRhcmdldCBpbiBvTWV0YU1vZGVsRGF0YS4kQW5ub3RhdGlvbnMpIHtcblx0XHRjcmVhdGVBbm5vdGF0aW9uTGlzdHMob01ldGFNb2RlbERhdGEuJEFubm90YXRpb25zW3RhcmdldF0sIHRhcmdldCwgYW5ub3RhdGlvbkxpc3RzLCBvQ2FwYWJpbGl0aWVzKTtcblx0fVxuXG5cdC8vIFNvcnQgYnkgdGFyZ2V0IGxlbmd0aFxuXHRjb25zdCBvdXRBbm5vdGF0aW9uTGlzdHMgPSBPYmplY3Qua2V5cyhhbm5vdGF0aW9uTGlzdHMpXG5cdFx0LnNvcnQoKGEsIGIpID0+IChhLmxlbmd0aCA+PSBiLmxlbmd0aCA/IDEgOiAtMSkpXG5cdFx0Lm1hcChzQW5ub3RhdGlvbk5hbWUgPT4gYW5ub3RhdGlvbkxpc3RzW3NBbm5vdGF0aW9uTmFtZV0pO1xuXHRjb25zdCByZWZlcmVuY2VzOiBSZWZlcmVuY2VbXSA9IFtdO1xuXHRyZXR1cm4ge1xuXHRcdGlkZW50aWZpY2F0aW9uOiBcIm1ldGFtb2RlbFJlc3VsdFwiLFxuXHRcdHZlcnNpb246IFwiNC4wXCIsXG5cdFx0c2NoZW1hOiB7XG5cdFx0XHRlbnRpdHlDb250YWluZXIsXG5cdFx0XHRlbnRpdHlTZXRzLFxuXHRcdFx0ZW50aXR5VHlwZXMsXG5cdFx0XHRjb21wbGV4VHlwZXMsXG5cdFx0XHRzaW5nbGV0b25zLFxuXHRcdFx0YXNzb2NpYXRpb25zOiBbXSxcblx0XHRcdGFjdGlvbnMsXG5cdFx0XHRuYW1lc3BhY2UsXG5cdFx0XHRhbm5vdGF0aW9uczoge1xuXHRcdFx0XHRcIm1ldGFtb2RlbFJlc3VsdFwiOiBvdXRBbm5vdGF0aW9uTGlzdHNcblx0XHRcdH1cblx0XHR9LFxuXHRcdHJlZmVyZW5jZXM6IHJlZmVyZW5jZXNcblx0fTtcbn1cblxuY29uc3QgbU1ldGFNb2RlbE1hcDogUmVjb3JkPHN0cmluZywgUGFyc2VyT3V0cHV0PiA9IHt9O1xuXG4vKipcbiAqIENvbnZlcnQgdGhlIE9EYXRhTWV0YU1vZGVsIGludG8gYW5vdGhlciBmb3JtYXQgdGhhdCBhbGxvdyBmb3IgZWFzeSBtYW5pcHVsYXRpb24gb2YgdGhlIGFubm90YXRpb25zLlxuICpcbiAqIEBwYXJhbSB7T0RhdGFNZXRhTW9kZWx9IG9NZXRhTW9kZWwgVGhlIGN1cnJlbnQgb0RhdGFNZXRhTW9kZWxcbiAqIEBwYXJhbSBvQ2FwYWJpbGl0aWVzIFRoZSBjdXJyZW50IGNhcGFiaWxpdGllc1xuICogQHJldHVybnMge0NvbnZlcnRlck91dHB1dH0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgb2JqZWN0IGxpa2UgYW5ub3RhdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFR5cGVzKG9NZXRhTW9kZWw6IE9EYXRhTWV0YU1vZGVsLCBvQ2FwYWJpbGl0aWVzPzogRW52aXJvbm1lbnRDYXBhYmlsaXRpZXMpOiBDb252ZXJ0ZXJPdXRwdXQge1xuXHRjb25zdCBzTWV0YU1vZGVsSWQgPSAob01ldGFNb2RlbCBhcyBhbnkpLmlkO1xuXHRpZiAoIW1NZXRhTW9kZWxNYXAuaGFzT3duUHJvcGVydHkoc01ldGFNb2RlbElkKSkge1xuXHRcdGNvbnN0IHBhcnNlZE91dHB1dCA9IHByZXBhcmVFbnRpdHlUeXBlcyhvTWV0YU1vZGVsLCBvQ2FwYWJpbGl0aWVzKTtcblx0XHRtTWV0YU1vZGVsTWFwW3NNZXRhTW9kZWxJZF0gPSBBbm5vdGF0aW9uQ29udmVydGVyLmNvbnZlcnRUeXBlcyhwYXJzZWRPdXRwdXQpO1xuXHR9XG5cdHJldHVybiAobU1ldGFNb2RlbE1hcFtzTWV0YU1vZGVsSWRdIGFzIGFueSkgYXMgQ29udmVydGVyT3V0cHV0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlTW9kZWxDYWNoZURhdGEob01ldGFNb2RlbDogT0RhdGFNZXRhTW9kZWwpIHtcblx0ZGVsZXRlIG1NZXRhTW9kZWxNYXBbKG9NZXRhTW9kZWwgYXMgYW55KS5pZF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0TWV0YU1vZGVsQ29udGV4dChvTWV0YU1vZGVsQ29udGV4dDogQ29udGV4dDxPRGF0YU1ldGFNb2RlbD4sIGJJbmNsdWRlVmlzaXRlZE9iamVjdHM6IGJvb2xlYW4gPSBmYWxzZSk6IGFueSB7XG5cdGNvbnN0IG9Db252ZXJ0ZXJPdXRwdXQgPSBjb252ZXJ0VHlwZXMob01ldGFNb2RlbENvbnRleHQuZ2V0TW9kZWwoKSk7XG5cdGNvbnN0IHNQYXRoID0gb01ldGFNb2RlbENvbnRleHQuZ2V0UGF0aCgpO1xuXG5cdGNvbnN0IGFQYXRoU3BsaXQgPSBzUGF0aC5zcGxpdChcIi9cIik7XG5cdGxldCB0YXJnZXRFbnRpdHlTZXQ6IF9FbnRpdHlTZXQgPSBvQ29udmVydGVyT3V0cHV0LmVudGl0eVNldHMuZmluZChlbnRpdHlTZXQgPT4gZW50aXR5U2V0Lm5hbWUgPT09IGFQYXRoU3BsaXRbMV0pIGFzIF9FbnRpdHlTZXQ7XG5cdGxldCByZWxhdGl2ZVBhdGggPSBhUGF0aFNwbGl0LnNsaWNlKDIpLmpvaW4oXCIvXCIpO1xuXG5cdGNvbnN0IGxvY2FsT2JqZWN0czogYW55W10gPSBbdGFyZ2V0RW50aXR5U2V0XTtcblx0d2hpbGUgKHJlbGF0aXZlUGF0aCAmJiByZWxhdGl2ZVBhdGgubGVuZ3RoID4gMCAmJiByZWxhdGl2ZVBhdGguc3RhcnRzV2l0aChcIiROYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nXCIpKSB7XG5cdFx0bGV0IHJlbGF0aXZlU3BsaXQgPSByZWxhdGl2ZVBhdGguc3BsaXQoXCIvXCIpO1xuXHRcdGxldCBpZHggPSAwO1xuXHRcdGxldCBjdXJyZW50RW50aXR5U2V0LCBzTmF2UHJvcFRvQ2hlY2s7XG5cblx0XHRyZWxhdGl2ZVNwbGl0ID0gcmVsYXRpdmVTcGxpdC5zbGljZSgxKTsgLy8gUmVtb3ZpbmcgXCIkTmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1wiXG5cdFx0d2hpbGUgKCFjdXJyZW50RW50aXR5U2V0ICYmIHJlbGF0aXZlU3BsaXQubGVuZ3RoID4gaWR4ICYmIHJlbGF0aXZlU3BsaXRbaWR4XSAhPT0gXCIkTmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1wiKSB7XG5cdFx0XHQvLyBGaW5kaW5nIHRoZSBjb3JyZWN0IGVudGl0eVNldCBmb3IgdGhlIG5hdmlnYWl0b24gcHJvcGVydHkgYmluZGluZyBleGFtcGxlOiBcIlNldC9fU2FsZXNPcmRlclwiXG5cdFx0XHRzTmF2UHJvcFRvQ2hlY2sgPSByZWxhdGl2ZVNwbGl0LnNsaWNlKDAsIGlkeCArIDEpLmpvaW4oXCIvXCIpO1xuXHRcdFx0Y3VycmVudEVudGl0eVNldCA9IHRhcmdldEVudGl0eVNldCAmJiB0YXJnZXRFbnRpdHlTZXQubmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1tzTmF2UHJvcFRvQ2hlY2tdO1xuXHRcdFx0aWR4Kys7XG5cdFx0fVxuXHRcdGlmICghY3VycmVudEVudGl0eVNldCkge1xuXHRcdFx0Ly8gRmFsbCBiYWNrIHRvIFNpbmdsZSBuYXYgcHJvcCBpZiBlbnRpdHlTZXQgaXMgbm90IGZvdW5kLlxuXHRcdFx0c05hdlByb3BUb0NoZWNrID0gcmVsYXRpdmVTcGxpdFswXTtcblx0XHR9XG5cdFx0Y29uc3QgYU5hdlByb3BzID0gc05hdlByb3BUb0NoZWNrPy5zcGxpdChcIi9cIikgfHwgW107XG5cdFx0bGV0IHRhcmdldEVudGl0eVR5cGUgPSB0YXJnZXRFbnRpdHlTZXQgJiYgdGFyZ2V0RW50aXR5U2V0LmVudGl0eVR5cGU7XG5cdFx0Zm9yIChjb25zdCBzTmF2UHJvcCBvZiBhTmF2UHJvcHMpIHtcblx0XHRcdC8vIFB1c2hpbmcgYWxsIG5hdiBwcm9wcyB0byB0aGUgdmlzaXRlZCBvYmplY3RzLiBleGFtcGxlOiBcIlNldFwiLCBcIl9TYWxlc09yZGVyXCIgZm9yIFwiU2V0L19TYWxlc09yZGVyXCIoaW4gTmF2aWdhdGlvblByb3BlcnR5QmluZGluZylcblx0XHRcdGNvbnN0IHRhcmdldE5hdlByb3AgPSB0YXJnZXRFbnRpdHlUeXBlICYmIHRhcmdldEVudGl0eVR5cGUubmF2aWdhdGlvblByb3BlcnRpZXMuZmluZChuYXZQcm9wID0+IG5hdlByb3AubmFtZSA9PT0gc05hdlByb3ApO1xuXHRcdFx0aWYgKHRhcmdldE5hdlByb3ApIHtcblx0XHRcdFx0bG9jYWxPYmplY3RzLnB1c2godGFyZ2V0TmF2UHJvcCk7XG5cdFx0XHRcdHRhcmdldEVudGl0eVR5cGUgPSB0YXJnZXROYXZQcm9wLnRhcmdldFR5cGU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0dGFyZ2V0RW50aXR5U2V0ID1cblx0XHRcdCh0YXJnZXRFbnRpdHlTZXQgJiYgY3VycmVudEVudGl0eVNldCkgfHwgKHRhcmdldEVudGl0eVNldCAmJiB0YXJnZXRFbnRpdHlTZXQubmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1tyZWxhdGl2ZVNwbGl0WzBdXSk7XG5cdFx0aWYgKHRhcmdldEVudGl0eVNldCkge1xuXHRcdFx0Ly8gUHVzaGluZyB0aGUgdGFyZ2V0IGVudGl0eVNldCB0byB2aXNpdGVkIG9iamVjdHNcblx0XHRcdGxvY2FsT2JqZWN0cy5wdXNoKHRhcmdldEVudGl0eVNldCk7XG5cdFx0fVxuXHRcdC8vIFJlLWNhbGN1bGF0aW5nIHRoZSByZWxhdGl2ZSBwYXRoXG5cdFx0cmVsYXRpdmVQYXRoID0gcmVsYXRpdmVTcGxpdC5zbGljZShhTmF2UHJvcHMubGVuZ3RoIHx8IDEpLmpvaW4oXCIvXCIpO1xuXHR9XG5cdGlmIChyZWxhdGl2ZVBhdGguc3RhcnRzV2l0aChcIiRUeXBlXCIpKSB7XG5cdFx0Ly8gV2UncmUgYW55d2F5IGdvaW5nIHRvIGxvb2sgb24gdGhlIGVudGl0eVR5cGUuLi5cblx0XHRyZWxhdGl2ZVBhdGggPSBhUGF0aFNwbGl0LnNsaWNlKDMpLmpvaW4oXCIvXCIpO1xuXHR9XG5cdGlmICh0YXJnZXRFbnRpdHlTZXQgJiYgcmVsYXRpdmVQYXRoLmxlbmd0aCkge1xuXHRcdGNvbnN0IG9UYXJnZXQgPSB0YXJnZXRFbnRpdHlTZXQuZW50aXR5VHlwZS5yZXNvbHZlUGF0aChyZWxhdGl2ZVBhdGgsIGJJbmNsdWRlVmlzaXRlZE9iamVjdHMpO1xuXHRcdGlmIChvVGFyZ2V0KSB7XG5cdFx0XHRpZiAoYkluY2x1ZGVWaXNpdGVkT2JqZWN0cykge1xuXHRcdFx0XHRvVGFyZ2V0LnZpc2l0ZWRPYmplY3RzID0gbG9jYWxPYmplY3RzLmNvbmNhdChvVGFyZ2V0LnZpc2l0ZWRPYmplY3RzKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHRhcmdldEVudGl0eVNldC5lbnRpdHlUeXBlICYmIHRhcmdldEVudGl0eVNldC5lbnRpdHlUeXBlLmFjdGlvbnMpIHtcblx0XHRcdC8vIGlmIHRhcmdldCBpcyBhbiBhY3Rpb24gb3IgYW4gYWN0aW9uIHBhcmFtZXRlclxuXHRcdFx0Y29uc3QgYWN0aW9ucyA9IHRhcmdldEVudGl0eVNldC5lbnRpdHlUeXBlICYmIHRhcmdldEVudGl0eVNldC5lbnRpdHlUeXBlLmFjdGlvbnM7XG5cdFx0XHRjb25zdCByZWxhdGl2ZVNwbGl0ID0gcmVsYXRpdmVQYXRoLnNwbGl0KFwiL1wiKTtcblx0XHRcdGlmIChhY3Rpb25zW3JlbGF0aXZlU3BsaXRbMF1dKSB7XG5cdFx0XHRcdGNvbnN0IGFjdGlvbiA9IGFjdGlvbnNbcmVsYXRpdmVTcGxpdFswXV07XG5cdFx0XHRcdGlmIChyZWxhdGl2ZVNwbGl0WzFdICYmIGFjdGlvbi5wYXJhbWV0ZXJzKSB7XG5cdFx0XHRcdFx0Y29uc3QgcGFyYW1ldGVyTmFtZSA9IHJlbGF0aXZlU3BsaXRbMV07XG5cdFx0XHRcdFx0Y29uc3QgdGFyZ2V0UGFyYW1ldGVyID0gYWN0aW9uLnBhcmFtZXRlcnMuZmluZChwYXJhbWV0ZXIgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHBhcmFtZXRlci5mdWxseVF1YWxpZmllZE5hbWUuZW5kc1dpdGgoXCIvXCIgKyBwYXJhbWV0ZXJOYW1lKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRyZXR1cm4gdGFyZ2V0UGFyYW1ldGVyO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHJlbGF0aXZlUGF0aC5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0XHRyZXR1cm4gYWN0aW9uO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBvVGFyZ2V0O1xuXHR9IGVsc2Uge1xuXHRcdGlmIChiSW5jbHVkZVZpc2l0ZWRPYmplY3RzKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR0YXJnZXQ6IHRhcmdldEVudGl0eVNldCxcblx0XHRcdFx0dmlzaXRlZE9iamVjdHM6IGxvY2FsT2JqZWN0c1xuXHRcdFx0fTtcblx0XHR9XG5cdFx0cmV0dXJuIHRhcmdldEVudGl0eVNldDtcblx0fVxufVxuXG50eXBlIENvbnZlcnRlck9iamVjdCA9IHtcblx0X3R5cGU6IHN0cmluZztcblx0bmFtZTogc3RyaW5nO1xufTtcbmV4cG9ydCB0eXBlIFJlc29sdmVkVGFyZ2V0ID0ge1xuXHR0YXJnZXQ/OiBDb252ZXJ0ZXJPYmplY3Q7XG5cdHZpc2l0ZWRPYmplY3RzOiBDb252ZXJ0ZXJPYmplY3RbXTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbnZvbHZlZERhdGFNb2RlbE9iamVjdHMoXG5cdG9NZXRhTW9kZWxDb250ZXh0OiBDb250ZXh0PE9EYXRhTWV0YU1vZGVsPixcblx0b0VudGl0eVNldE1ldGFNb2RlbENvbnRleHQ/OiBDb250ZXh0PE9EYXRhTWV0YU1vZGVsPlxuKTogRGF0YU1vZGVsT2JqZWN0UGF0aCB7XG5cdGNvbnN0IG1ldGFNb2RlbENvbnRleHQgPSBjb252ZXJ0TWV0YU1vZGVsQ29udGV4dChvTWV0YU1vZGVsQ29udGV4dCwgdHJ1ZSk7XG5cdGxldCB0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbjtcblx0aWYgKG9FbnRpdHlTZXRNZXRhTW9kZWxDb250ZXh0ICYmIG9FbnRpdHlTZXRNZXRhTW9kZWxDb250ZXh0LmdldFBhdGgoKSAhPT0gXCIvXCIpIHtcblx0XHR0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbiA9IGdldEludm9sdmVkRGF0YU1vZGVsT2JqZWN0cyhvRW50aXR5U2V0TWV0YU1vZGVsQ29udGV4dCk7XG5cdH1cblx0cmV0dXJuIGdldEludm9sdmVkRGF0YU1vZGVsT2JqZWN0RnJvbVBhdGgobWV0YU1vZGVsQ29udGV4dCwgdGFyZ2V0RW50aXR5U2V0TG9jYXRpb24pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW52b2x2ZWREYXRhTW9kZWxPYmplY3RGcm9tUGF0aChcblx0bWV0YU1vZGVsQ29udGV4dDogUmVzb2x2ZWRUYXJnZXQsXG5cdHRhcmdldEVudGl0eVNldExvY2F0aW9uPzogRGF0YU1vZGVsT2JqZWN0UGF0aFxuKTogRGF0YU1vZGVsT2JqZWN0UGF0aCB7XG5cdGNvbnN0IGRhdGFNb2RlbE9iamVjdHMgPSBtZXRhTW9kZWxDb250ZXh0LnZpc2l0ZWRPYmplY3RzLmZpbHRlcihcblx0XHQodmlzaXRlZE9iamVjdDogYW55KSA9PiB2aXNpdGVkT2JqZWN0ICYmIHZpc2l0ZWRPYmplY3QuaGFzT3duUHJvcGVydHkoXCJfdHlwZVwiKSAmJiB2aXNpdGVkT2JqZWN0Ll90eXBlICE9PSBcIkVudGl0eVR5cGVcIlxuXHQpO1xuXHRpZiAobWV0YU1vZGVsQ29udGV4dC50YXJnZXQgJiYgbWV0YU1vZGVsQ29udGV4dC50YXJnZXQuaGFzT3duUHJvcGVydHkoXCJfdHlwZVwiKSAmJiBtZXRhTW9kZWxDb250ZXh0LnRhcmdldC5fdHlwZSAhPT0gXCJFbnRpdHlUeXBlXCIpIHtcblx0XHRkYXRhTW9kZWxPYmplY3RzLnB1c2gobWV0YU1vZGVsQ29udGV4dC50YXJnZXQpO1xuXHR9XG5cdGNvbnN0IG5hdmlnYXRpb25Qcm9wZXJ0aWVzOiBfTmF2aWdhdGlvblByb3BlcnR5W10gPSBbXTtcblx0Y29uc3Qgcm9vdEVudGl0eVNldDogX0VudGl0eVNldCA9IGRhdGFNb2RlbE9iamVjdHNbMF0gYXMgX0VudGl0eVNldDtcblx0Ly8gY3VycmVudEVudGl0eVNldCBjYW4gYmUgdW5kZWZpbmVkLlxuXHRsZXQgY3VycmVudEVudGl0eVNldDogX0VudGl0eVNldCB8IHVuZGVmaW5lZCA9IHJvb3RFbnRpdHlTZXQgYXMgX0VudGl0eVNldDtcblx0bGV0IGN1cnJlbnRFbnRpdHlUeXBlOiBfRW50aXR5VHlwZSA9IHJvb3RFbnRpdHlTZXQuZW50aXR5VHlwZTtcblx0bGV0IGkgPSAxO1xuXHRsZXQgY3VycmVudE9iamVjdDtcblx0bGV0IG5hdmlnYXRlZFBhdGhzID0gW107XG5cdHdoaWxlIChpIDwgZGF0YU1vZGVsT2JqZWN0cy5sZW5ndGgpIHtcblx0XHRjdXJyZW50T2JqZWN0ID0gZGF0YU1vZGVsT2JqZWN0c1tpKytdO1xuXHRcdGlmIChjdXJyZW50T2JqZWN0Ll90eXBlID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiKSB7XG5cdFx0XHRuYXZpZ2F0ZWRQYXRocy5wdXNoKGN1cnJlbnRPYmplY3QubmFtZSk7XG5cdFx0XHRuYXZpZ2F0aW9uUHJvcGVydGllcy5wdXNoKGN1cnJlbnRPYmplY3QgYXMgX05hdmlnYXRpb25Qcm9wZXJ0eSk7XG5cdFx0XHRjdXJyZW50RW50aXR5VHlwZSA9IChjdXJyZW50T2JqZWN0IGFzIF9OYXZpZ2F0aW9uUHJvcGVydHkpLnRhcmdldFR5cGU7XG5cdFx0XHRpZiAoY3VycmVudEVudGl0eVNldCAmJiBjdXJyZW50RW50aXR5U2V0Lm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmcuaGFzT3duUHJvcGVydHkobmF2aWdhdGVkUGF0aHMuam9pbihcIi9cIikpKSB7XG5cdFx0XHRcdGN1cnJlbnRFbnRpdHlTZXQgPSBjdXJyZW50RW50aXR5U2V0Lm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmdbY3VycmVudE9iamVjdC5uYW1lXTtcblx0XHRcdFx0bmF2aWdhdGVkUGF0aHMgPSBbXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGN1cnJlbnRFbnRpdHlTZXQgPSB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChjdXJyZW50T2JqZWN0Ll90eXBlID09PSBcIkVudGl0eVNldFwiKSB7XG5cdFx0XHRjdXJyZW50RW50aXR5U2V0ID0gY3VycmVudE9iamVjdCBhcyBfRW50aXR5U2V0O1xuXHRcdFx0Y3VycmVudEVudGl0eVR5cGUgPSBjdXJyZW50RW50aXR5U2V0LmVudGl0eVR5cGU7XG5cdFx0fVxuXHR9XG5cblx0aWYgKHRhcmdldEVudGl0eVNldExvY2F0aW9uICYmIHRhcmdldEVudGl0eVNldExvY2F0aW9uLnN0YXJ0aW5nRW50aXR5U2V0ICE9PSByb290RW50aXR5U2V0KSB7XG5cdFx0Ly8gSW4gY2FzZSB0aGUgZW50aXR5c2V0IGlzIG5vdCBzdGFydGluZyBmcm9tIHRoZSBzYW1lIGxvY2F0aW9uIGl0IG1heSBtZWFuIHRoYXQgd2UgYXJlIGRvaW5nIHRvbyBtdWNoIHdvcmsgZWFybGllciBmb3Igc29tZSByZWFzb25cblx0XHQvLyBBcyBzdWNoIHdlIG5lZWQgdG8gcmVkZWZpbmUgdGhlIGNvbnRleHQgc291cmNlIGZvciB0aGUgdGFyZ2V0RW50aXR5U2V0TG9jYXRpb25cblx0XHRjb25zdCBzdGFydGluZ0luZGV4ID0gZGF0YU1vZGVsT2JqZWN0cy5pbmRleE9mKHRhcmdldEVudGl0eVNldExvY2F0aW9uLnN0YXJ0aW5nRW50aXR5U2V0KTtcblx0XHRpZiAoc3RhcnRpbmdJbmRleCAhPT0gLTEpIHtcblx0XHRcdC8vIElmIGl0J3Mgbm90IGZvdW5kIEkgZG9uJ3Qga25vdyB3aGF0IHdlIGNhbiBkbyAocHJvYmFibHkgbm90aGluZylcblx0XHRcdGNvbnN0IHJlcXVpcmVkRGF0YU1vZGVsT2JqZWN0cyA9IGRhdGFNb2RlbE9iamVjdHMuc2xpY2UoMCwgc3RhcnRpbmdJbmRleCk7XG5cdFx0XHR0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbi5zdGFydGluZ0VudGl0eVNldCA9IHJvb3RFbnRpdHlTZXQ7XG5cdFx0XHR0YXJnZXRFbnRpdHlTZXRMb2NhdGlvbi5uYXZpZ2F0aW9uUHJvcGVydGllcyA9IHJlcXVpcmVkRGF0YU1vZGVsT2JqZWN0c1xuXHRcdFx0XHQuZmlsdGVyKChvYmplY3Q6IGFueSkgPT4gb2JqZWN0Ll90eXBlID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiKVxuXHRcdFx0XHQuY29uY2F0KHRhcmdldEVudGl0eVNldExvY2F0aW9uLm5hdmlnYXRpb25Qcm9wZXJ0aWVzKSBhcyBfTmF2aWdhdGlvblByb3BlcnR5W107XG5cdFx0fVxuXHR9XG5cdGNvbnN0IG91dERhdGFNb2RlbFBhdGggPSB7XG5cdFx0c3RhcnRpbmdFbnRpdHlTZXQ6IHJvb3RFbnRpdHlTZXQsXG5cdFx0dGFyZ2V0RW50aXR5U2V0OiBjdXJyZW50RW50aXR5U2V0LFxuXHRcdHRhcmdldEVudGl0eVR5cGU6IGN1cnJlbnRFbnRpdHlUeXBlLFxuXHRcdHRhcmdldE9iamVjdDogbWV0YU1vZGVsQ29udGV4dC50YXJnZXQsXG5cdFx0bmF2aWdhdGlvblByb3BlcnRpZXMsXG5cdFx0Y29udGV4dExvY2F0aW9uOiB0YXJnZXRFbnRpdHlTZXRMb2NhdGlvblxuXHR9O1xuXHRpZiAoIW91dERhdGFNb2RlbFBhdGguY29udGV4dExvY2F0aW9uKSB7XG5cdFx0b3V0RGF0YU1vZGVsUGF0aC5jb250ZXh0TG9jYXRpb24gPSBvdXREYXRhTW9kZWxQYXRoO1xuXHR9XG5cdHJldHVybiBvdXREYXRhTW9kZWxQYXRoO1xufVxuIl19