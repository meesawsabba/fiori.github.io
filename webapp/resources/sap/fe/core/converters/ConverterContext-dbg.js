/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/MetaModelConverter", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/core/converters/ManifestWrapper"], function (MetaModelConverter, DataModelPathHelper, ManifestWrapper) {
  "use strict";

  var getTargetObjectPath = DataModelPathHelper.getTargetObjectPath;
  var getContextRelativeTargetObjectPath = DataModelPathHelper.getContextRelativeTargetObjectPath;
  var enhanceDataModelPath = DataModelPathHelper.enhanceDataModelPath;
  var convertTypes = MetaModelConverter.convertTypes;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * Checks whether an object is an annotation term.
   *
   * @param {string|AnnotationTerm<object>} vAnnotationPath
   * @returns {boolean}
   */
  var isAnnotationTerm = function (vAnnotationPath) {
    return typeof vAnnotationPath === "object";
  };

  function isServiceObject(objectPart) {
    return objectPart && objectPart.hasOwnProperty("_type");
  }

  var getDataModelPathForEntitySet = function (resolvedMetaPath) {
    var rootEntitySet;
    var currentEntitySet;
    var previousEntitySet;
    var currentEntityType;
    var navigatedPaths = [];
    var navigationProperties = [];
    resolvedMetaPath.objectPath.forEach(function (objectPart) {
      var _currentEntitySet;

      if (isServiceObject(objectPart)) {
        switch (objectPart._type) {
          case "NavigationProperty":
            navigatedPaths.push(objectPart.name);
            navigationProperties.push(objectPart);
            currentEntityType = objectPart.targetType;

            if (previousEntitySet && previousEntitySet.navigationPropertyBinding.hasOwnProperty(navigatedPaths.join("/"))) {
              currentEntitySet = previousEntitySet.navigationPropertyBinding[navigatedPaths.join("/")];
              previousEntitySet = currentEntitySet;
              navigatedPaths = [];
            } else {
              currentEntitySet = undefined;
            }

            break;

          case "EntitySet":
            if (rootEntitySet === undefined) {
              rootEntitySet = objectPart;
            }

            currentEntitySet = objectPart;
            previousEntitySet = currentEntitySet;
            currentEntityType = (_currentEntitySet = currentEntitySet) === null || _currentEntitySet === void 0 ? void 0 : _currentEntitySet.entityType;
            break;

          default:
            break;
        }
      }
    });
    var dataModelPath = {
      startingEntitySet: rootEntitySet,
      targetEntityType: currentEntityType,
      targetEntitySet: currentEntitySet,
      navigationProperties: navigationProperties,
      contextLocation: undefined,
      targetObject: resolvedMetaPath.target
    };
    dataModelPath.contextLocation = dataModelPath;
    return dataModelPath;
  };
  /**
   * Create a ConverterContext object that will be used within the converters.
   *
   * @param {ConverterOutput} oConvertedTypes The converted annotation and service types
   * @param {BaseManifestSettings} oManifestSettings The manifestSettings that applies to this page
   * @param {TemplateType} templateType The type of template we're looking at right now
   * @param {IShellServicesProxy} shellServices The current instance of the shellservice
   * @param {IDiagnostics} diagnostics The diagnostics shim
   * @param {Function} mergeFn The function to be used to perfom some deep merges between object
   * @param {DataModelObjectPath} targetDataModelPath The global path to reach the entitySet
   *
   * @returns {ConverterContext} A converter context for the converters
   */


  var ConverterContext = /*#__PURE__*/function () {
    function ConverterContext(convertedTypes, manifestSettings, diagnostics, mergeFn, targetDataModelPath) {
      _classCallCheck(this, ConverterContext);

      this.convertedTypes = convertedTypes;
      this.manifestSettings = manifestSettings;
      this.diagnostics = diagnostics;
      this.mergeFn = mergeFn;
      this.targetDataModelPath = targetDataModelPath;
      this.manifestWrapper = new ManifestWrapper(this.manifestSettings, mergeFn);
      this.baseContextPath = getTargetObjectPath(this.targetDataModelPath);
    }
    /**
     * Retrieve the property based on the path.
     *
     * @param fullyQualifiedName The fully qualified name
     * @returns {Property} The property EntityType based
     */


    _createClass(ConverterContext, [{
      key: "_getEntityTypeFromFullyQualifiedName",
      value: function _getEntityTypeFromFullyQualifiedName(fullyQualifiedName) {
        var targetEntityType = this.convertedTypes.entityTypes.find(function (entityType) {
          if (fullyQualifiedName.startsWith(entityType.fullyQualifiedName)) {
            var replaceAnnotation = fullyQualifiedName.replace(entityType.fullyQualifiedName, "");
            return replaceAnnotation.startsWith("/") || replaceAnnotation.startsWith("@");
          }

          return false;
        });
        return targetEntityType;
      }
      /**
       * Retrieve the entityType associated with an annotation object.
       *
       * @param annotation The annotation object for which we want to find the entityType
       * @returns {EntityType} The EntityType the annotation refers to
       */

    }, {
      key: "getAnnotationEntityType",
      value: function getAnnotationEntityType(annotation) {
        if (annotation) {
          var annotationPath = annotation.fullyQualifiedName;

          var targetEntityType = this._getEntityTypeFromFullyQualifiedName(annotationPath);

          if (!targetEntityType) {
            throw new Error("Cannot find Entity Type for " + annotation.fullyQualifiedName);
          }

          return targetEntityType;
        } else {
          return this.targetDataModelPath.targetEntityType;
        }
      }
      /**
       * Retrieve the manifest settings defined for a specific control within controlConfiguration.
       *
       * @param vAnnotationPath The annotation path or object to evaluate
       * @returns The control configuration for that specific anntoation path if it exists
       */

    }, {
      key: "getManifestControlConfiguration",
      value: function getManifestControlConfiguration(vAnnotationPath) {
        if (isAnnotationTerm(vAnnotationPath)) {
          return this.manifestWrapper.getControlConfiguration(vAnnotationPath.fullyQualifiedName.replace(this.targetDataModelPath.targetEntityType.fullyQualifiedName, ""));
        }

        return this.manifestWrapper.getControlConfiguration(vAnnotationPath);
      }
      /**
       * Create an absolute annotation path based on the current meta model context.
       *
       * @param sAnnotationPath The relative annotation path
       * @returns The correct annotation path based on the current context
       */

    }, {
      key: "getAbsoluteAnnotationPath",
      value: function getAbsoluteAnnotationPath(sAnnotationPath) {
        if (!sAnnotationPath) {
          return sAnnotationPath;
        }

        if (sAnnotationPath[0] === "/") {
          return sAnnotationPath;
        }

        return this.baseContextPath + "/" + sAnnotationPath;
      }
      /**
       * Retrieve the current entitySet.
       *
       * @returns The current EntitySet if it exists.
       */

    }, {
      key: "getEntitySet",
      value: function getEntitySet() {
        return this.targetDataModelPath.targetEntitySet;
      }
      /**
       * Retrieve the context path.
       *
       * @returns The context path of the converter.
       */

    }, {
      key: "getContextPath",
      value: function getContextPath() {
        return this.baseContextPath;
      }
      /**
       * Retrieve the current data model object path.
       *
       * @returns The current data model object path
       */

    }, {
      key: "getDataModelObjectPath",
      value: function getDataModelObjectPath() {
        return this.targetDataModelPath;
      }
      /**
       * Get the EntityContainer.
       *
       * @returns The current service EntityContainer
       */

    }, {
      key: "getEntityContainer",
      value: function getEntityContainer() {
        return this.convertedTypes.entityContainer;
      }
      /**
       * Get the EntityType based on the fully qualified name.
       *
       * @returns The current EntityType.
       */

    }, {
      key: "getEntityType",
      value: function getEntityType() {
        return this.targetDataModelPath.targetEntityType;
      }
      /**
       * Gets a singleton based on the fully qualified name.
       *
       * @param {string} fullyQualifiedName The fully qualified name of the singleton
       * @returns {Singleton | undefined} The singleton instance.
       */

    }, {
      key: "getSingleton",
      value: function getSingleton(fullyQualifiedName) {
        return this.convertedTypes.singletons.find(function (singleton) {
          return singleton.fullyQualifiedName === fullyQualifiedName;
        });
      }
      /**
       * Gets the entity type of the parameter in case of a parameterized service.
       * @returns {EntityType} The entity type of the parameter
       */

    }, {
      key: "getParameterEntityType",
      value: function getParameterEntityType() {
        var _parameterEntityType$, _parameterEntityType$2;

        var parameterEntityType = this.targetDataModelPath.startingEntitySet.entityType;
        var isParameterized = !!((_parameterEntityType$ = parameterEntityType.annotations) !== null && _parameterEntityType$ !== void 0 && (_parameterEntityType$2 = _parameterEntityType$.Common) !== null && _parameterEntityType$2 !== void 0 && _parameterEntityType$2.ResultContext);
        return isParameterized && parameterEntityType;
      }
      /**
       * Retrieves an annotation from an entity type based on annotation path.
       *
       * @param annotationPath The annotation path to be evaluated
       * @returns The target annotation path as well as a converter context to go with it
       */

    }, {
      key: "getEntityTypeAnnotation",
      value: function getEntityTypeAnnotation(annotationPath) {
        var _startingEntityType$a;

        if (annotationPath.indexOf("@") === -1) {
          annotationPath = "@" + annotationPath;
        }

        var targetObject = this.targetDataModelPath.targetEntityType.resolvePath(annotationPath, true);
        var rootEntitySet = this.targetDataModelPath.targetEntitySet;
        var currentEntityType = this.targetDataModelPath.targetEntityType;
        var startingEntityType = this.targetDataModelPath.startingEntitySet.entityType;
        var navigationProperties = this.targetDataModelPath.navigationProperties.concat();
        var i = 1;
        var currentObject;
        var navigatedPaths = [];
        var visitedObjects = targetObject.visitedObjects; // In case of parameterized service

        if (!rootEntitySet && (_startingEntityType$a = startingEntityType.annotations.Common) !== null && _startingEntityType$a !== void 0 && _startingEntityType$a.ResultContext) {
          rootEntitySet = this.targetDataModelPath.startingEntitySet;
          this.targetDataModelPath.navigationProperties.forEach(function (navObject) {
            navigatedPaths.push(navObject.name);
          });
        }

        while (i < visitedObjects.length) {
          currentObject = visitedObjects[i++];

          if (currentObject._type === "NavigationProperty") {
            navigatedPaths.push(currentObject.name);
            navigationProperties.push(currentObject);
            currentEntityType = currentObject.targetType;

            if (rootEntitySet && rootEntitySet.navigationPropertyBinding.hasOwnProperty(navigatedPaths.join("/"))) {
              var navPath = navigatedPaths.join("/");
              rootEntitySet = rootEntitySet.navigationPropertyBinding[currentObject.name] || rootEntitySet.navigationPropertyBinding[navPath];
              navigatedPaths = [];
            } else {
              rootEntitySet = undefined;
            }
          }

          if (currentObject._type === "EntitySet") {
            rootEntitySet = currentObject;
            currentEntityType = rootEntitySet.entityType;
          }
        }

        var outDataModelPath = {
          startingEntitySet: this.targetDataModelPath.startingEntitySet,
          targetEntitySet: rootEntitySet,
          targetEntityType: currentEntityType,
          targetObject: navigationProperties[navigationProperties.length - 1],
          navigationProperties: navigationProperties,
          contextLocation: this.targetDataModelPath.contextLocation
        };
        return {
          annotation: targetObject.target,
          converterContext: new ConverterContext(this.convertedTypes, this.manifestSettings, this.diagnostics, this.mergeFn, outDataModelPath)
        };
      }
      /**
       * Retrieve the type of template we're working on (e.g. ListReport / ObjectPage / ...).
       *
       * @returns The current tenplate type
       */

    }, {
      key: "getTemplateType",
      value: function getTemplateType() {
        return this.manifestWrapper.getTemplateType();
      }
      /**
       * Retrieve a relative annotation path between an annotation path and an entity type.
       *
       * @param annotationPath
       * @param entityType
       * @returns The relative anntotation path.
       */

    }, {
      key: "getRelativeAnnotationPath",
      value: function getRelativeAnnotationPath(annotationPath, entityType) {
        return annotationPath.replace(entityType.fullyQualifiedName, "");
      }
      /**
       * Transform an entityType based path to an entitySet based one (ui5 templating generally expect an entitySetBasedPath).
       *
       * @param annotationPath
       * @returns The EntitySet based annotation path
       */

    }, {
      key: "getEntitySetBasedAnnotationPath",
      value: function getEntitySetBasedAnnotationPath(annotationPath) {
        if (!annotationPath) {
          return annotationPath;
        }

        var entityTypeFQN = this.targetDataModelPath.targetEntityType.fullyQualifiedName;

        if (this.targetDataModelPath.targetEntitySet || (this.baseContextPath.startsWith("/") && this.baseContextPath.match(/\//g) || []).length > 1) {
          var replacedAnnotationPath = annotationPath.replace(entityTypeFQN, "/");

          if (replacedAnnotationPath.length > 2 && replacedAnnotationPath[0] === "/" && replacedAnnotationPath[1] === "/") {
            replacedAnnotationPath = replacedAnnotationPath.substr(1);
          }

          return this.baseContextPath + replacedAnnotationPath;
        } else {
          return "/" + annotationPath;
        }
      }
      /**
       * Retrieve the manifest wrapper for the current context.
       *
       * @returns The current manifest wrapper
       */

    }, {
      key: "getManifestWrapper",
      value: function getManifestWrapper() {
        return this.manifestWrapper;
      }
    }, {
      key: "getDiagnostics",
      value: function getDiagnostics() {
        return this.diagnostics;
      }
      /**
       * Retrieve a new converter context, scoped for a different context path.
       *
       * @param {string} contextPath The path we want to orchestrate the converter context around
       * @returns {ConverterContext}
       */

    }, {
      key: "getConverterContextFor",
      value: function getConverterContextFor(contextPath) {
        var resolvedMetaPath = this.convertedTypes.resolvePath(contextPath);
        var targetPath = getDataModelPathForEntitySet(resolvedMetaPath);
        return new ConverterContext(this.convertedTypes, this.manifestSettings, this.diagnostics, this.mergeFn, targetPath);
      }
      /**
       * Get all annotations of a given term and vocabulary on an entity type
       * (or on the current entity type if entityType isn't specified).
       *
       * @param vocabularyName
       * @param annotationTerm
       * @param [annotationSources]
       * @returns All the annotation for a specific term and vocabulary from an entity type
       */

    }, {
      key: "getAnnotationsByTerm",
      value: function getAnnotationsByTerm(vocabularyName, annotationTerm) {
        var annotationSources = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [this.getEntityType()];
        var outAnnotations = [];
        annotationSources.forEach(function (annotationSource) {
          if (annotationSource) {
            var annotations = (annotationSource === null || annotationSource === void 0 ? void 0 : annotationSource.annotations[vocabularyName]) || {};

            if (annotations) {
              outAnnotations = Object.keys(annotations).filter(function (annotation) {
                return annotations[annotation].term === annotationTerm;
              }).reduce(function (previousValue, key) {
                previousValue.push(annotations[key]);
                return previousValue;
              }, outAnnotations);
            }
          }
        });
        return outAnnotations;
      }
      /**
       * Retrieves the relative model path based on the current context path.
       *
       * @returns {string|undefined} The relative model path or undefined if the path is not resolveable
       */

    }, {
      key: "getRelativeModelPathFunction",
      value: function getRelativeModelPathFunction() {
        var targetDataModelPath = this.targetDataModelPath;
        return function (sPath) {
          var enhancedPath = enhanceDataModelPath(targetDataModelPath, sPath);
          return getContextRelativeTargetObjectPath(enhancedPath, true);
        };
      }
      /**
       * Create the converter context necessary for a macro based on a metamodel context.
       * @param sEntitySetName
       * @param oMetaModelContext
       * @param diagnostics
       * @param mergeFn
       * @param targetDataModelPath
       * @param manifestSettings
       * @returns {ConverterContext} The current converter context
       */

    }], [{
      key: "createConverterContextForMacro",
      value: function createConverterContextForMacro(sEntitySetName, oMetaModelContext, diagnostics, mergeFn, targetDataModelPath) {
        var manifestSettings = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
        var oMetaModel = oMetaModelContext.isA("sap.ui.model.odata.v4.ODataMetaModel") ? oMetaModelContext : oMetaModelContext.getModel();
        var oConverterOutput = convertTypes(oMetaModel);
        var targetEntitySet = oConverterOutput.entitySets.find(function (entitySet) {
          return entitySet.name === sEntitySetName;
        });

        if (!targetDataModelPath) {
          targetDataModelPath = {
            startingEntitySet: targetEntitySet,
            navigationProperties: [],
            targetEntitySet: targetEntitySet,
            targetEntityType: targetEntitySet.entityType,
            targetObject: targetEntitySet
          };
        }

        return new ConverterContext(oConverterOutput, manifestSettings, diagnostics, mergeFn, targetDataModelPath);
      }
    }]);

    return ConverterContext;
  }();

  return ConverterContext;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbnZlcnRlckNvbnRleHQudHMiXSwibmFtZXMiOlsiaXNBbm5vdGF0aW9uVGVybSIsInZBbm5vdGF0aW9uUGF0aCIsImlzU2VydmljZU9iamVjdCIsIm9iamVjdFBhcnQiLCJoYXNPd25Qcm9wZXJ0eSIsImdldERhdGFNb2RlbFBhdGhGb3JFbnRpdHlTZXQiLCJyZXNvbHZlZE1ldGFQYXRoIiwicm9vdEVudGl0eVNldCIsImN1cnJlbnRFbnRpdHlTZXQiLCJwcmV2aW91c0VudGl0eVNldCIsImN1cnJlbnRFbnRpdHlUeXBlIiwibmF2aWdhdGVkUGF0aHMiLCJuYXZpZ2F0aW9uUHJvcGVydGllcyIsIm9iamVjdFBhdGgiLCJmb3JFYWNoIiwiX3R5cGUiLCJwdXNoIiwibmFtZSIsInRhcmdldFR5cGUiLCJuYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nIiwiam9pbiIsInVuZGVmaW5lZCIsImVudGl0eVR5cGUiLCJkYXRhTW9kZWxQYXRoIiwic3RhcnRpbmdFbnRpdHlTZXQiLCJ0YXJnZXRFbnRpdHlUeXBlIiwidGFyZ2V0RW50aXR5U2V0IiwiY29udGV4dExvY2F0aW9uIiwidGFyZ2V0T2JqZWN0IiwidGFyZ2V0IiwiQ29udmVydGVyQ29udGV4dCIsImNvbnZlcnRlZFR5cGVzIiwibWFuaWZlc3RTZXR0aW5ncyIsImRpYWdub3N0aWNzIiwibWVyZ2VGbiIsInRhcmdldERhdGFNb2RlbFBhdGgiLCJtYW5pZmVzdFdyYXBwZXIiLCJNYW5pZmVzdFdyYXBwZXIiLCJiYXNlQ29udGV4dFBhdGgiLCJnZXRUYXJnZXRPYmplY3RQYXRoIiwiZnVsbHlRdWFsaWZpZWROYW1lIiwiZW50aXR5VHlwZXMiLCJmaW5kIiwic3RhcnRzV2l0aCIsInJlcGxhY2VBbm5vdGF0aW9uIiwicmVwbGFjZSIsImFubm90YXRpb24iLCJhbm5vdGF0aW9uUGF0aCIsIl9nZXRFbnRpdHlUeXBlRnJvbUZ1bGx5UXVhbGlmaWVkTmFtZSIsIkVycm9yIiwiZ2V0Q29udHJvbENvbmZpZ3VyYXRpb24iLCJzQW5ub3RhdGlvblBhdGgiLCJlbnRpdHlDb250YWluZXIiLCJzaW5nbGV0b25zIiwic2luZ2xldG9uIiwicGFyYW1ldGVyRW50aXR5VHlwZSIsImlzUGFyYW1ldGVyaXplZCIsImFubm90YXRpb25zIiwiQ29tbW9uIiwiUmVzdWx0Q29udGV4dCIsImluZGV4T2YiLCJyZXNvbHZlUGF0aCIsInN0YXJ0aW5nRW50aXR5VHlwZSIsImNvbmNhdCIsImkiLCJjdXJyZW50T2JqZWN0IiwidmlzaXRlZE9iamVjdHMiLCJuYXZPYmplY3QiLCJsZW5ndGgiLCJuYXZQYXRoIiwib3V0RGF0YU1vZGVsUGF0aCIsImNvbnZlcnRlckNvbnRleHQiLCJnZXRUZW1wbGF0ZVR5cGUiLCJlbnRpdHlUeXBlRlFOIiwibWF0Y2giLCJyZXBsYWNlZEFubm90YXRpb25QYXRoIiwic3Vic3RyIiwiY29udGV4dFBhdGgiLCJ0YXJnZXRQYXRoIiwidm9jYWJ1bGFyeU5hbWUiLCJhbm5vdGF0aW9uVGVybSIsImFubm90YXRpb25Tb3VyY2VzIiwiZ2V0RW50aXR5VHlwZSIsIm91dEFubm90YXRpb25zIiwiYW5ub3RhdGlvblNvdXJjZSIsIk9iamVjdCIsImtleXMiLCJmaWx0ZXIiLCJ0ZXJtIiwicmVkdWNlIiwicHJldmlvdXNWYWx1ZSIsImtleSIsInNQYXRoIiwiZW5oYW5jZWRQYXRoIiwiZW5oYW5jZURhdGFNb2RlbFBhdGgiLCJnZXRDb250ZXh0UmVsYXRpdmVUYXJnZXRPYmplY3RQYXRoIiwic0VudGl0eVNldE5hbWUiLCJvTWV0YU1vZGVsQ29udGV4dCIsIm9NZXRhTW9kZWwiLCJpc0EiLCJnZXRNb2RlbCIsIm9Db252ZXJ0ZXJPdXRwdXQiLCJjb252ZXJ0VHlwZXMiLCJlbnRpdHlTZXRzIiwiZW50aXR5U2V0Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUE2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTUEsZ0JBQWdCLEdBQUcsVUFBU0MsZUFBVCxFQUFnRztB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N0QsbUJBQUwsRUFBMEI7QUFDekJBLFVBQUFBLG1CQUFtQixHQUFHO0FBQ3JCWCxZQUFBQSxpQkFBaUIsRUFBRUUsZUFERTtBQUVyQmQsWUFBQUEsb0JBQW9CLEVBQUUsRUFGRDtBQUdyQmMsWUFBQUEsZUFBZSxFQUFFQSxlQUhJO0FBSXJCRCxZQUFBQSxnQkFBZ0IsRUFBRUMsZUFBZSxDQUFDSixVQUpiO0FBS3JCTSxZQUFBQSxZQUFZLEVBQUVGO0FBTE8sV0FBdEI7QUFPQTs7QUFDRCxlQUFPLElBQUlJLGdCQUFKLENBQXFCdUUsZ0JBQXJCLEVBQXVDckUsZ0JBQXZDLEVBQXlEQyxXQUF6RCxFQUFzRUMsT0FBdEUsRUFBK0VDLG1CQUEvRSxDQUFQO0FBQ0E7Ozs7OztTQUdhTCxnQiIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQW5ub3RhdGlvblRlcm0gfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcbmltcG9ydCB7XG5cdEFueUFubm90YXRpb24sXG5cdENvbnZlcnRlck91dHB1dCxcblx0RW50aXR5U2V0LFxuXHRFbnRpdHlUeXBlLFxuXHRFbnRpdHlDb250YWluZXIsXG5cdE5hdmlnYXRpb25Qcm9wZXJ0eSxcblx0U2VydmljZU9iamVjdCxcblx0U2luZ2xldG9uLFxuXHRSZXNvbHV0aW9uVGFyZ2V0LFxuXHRTZXJ2aWNlT2JqZWN0QW5kQW5ub3RhdGlvblxufSBmcm9tIFwiQHNhcC11eC9hbm5vdGF0aW9uLWNvbnZlcnRlclwiO1xuaW1wb3J0IHsgQmFzZU1hbmlmZXN0U2V0dGluZ3MsIFRlbXBsYXRlVHlwZSB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL01hbmlmZXN0U2V0dGluZ3NcIjtcbmltcG9ydCB7IENvbnRleHQsIE9EYXRhTWV0YU1vZGVsIH0gZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NFwiO1xuaW1wb3J0IHsgY29udmVydFR5cGVzLCBSZXNvbHZlZFRhcmdldCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL01ldGFNb2RlbENvbnZlcnRlclwiO1xuaW1wb3J0IHsgSURpYWdub3N0aWNzIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvVGVtcGxhdGVDb252ZXJ0ZXJcIjtcbmltcG9ydCB7XG5cdERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdGVuaGFuY2VEYXRhTW9kZWxQYXRoLFxuXHRnZXRDb250ZXh0UmVsYXRpdmVUYXJnZXRPYmplY3RQYXRoLFxuXHRnZXRUYXJnZXRPYmplY3RQYXRoXG59IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL0RhdGFNb2RlbFBhdGhIZWxwZXJcIjtcbmltcG9ydCB7IEVudGl0eVR5cGVBbm5vdGF0aW9ucyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy90eXBlcy9nZW5lcmF0ZWQvRWRtX1R5cGVzXCI7XG5pbXBvcnQgTWFuaWZlc3RXcmFwcGVyIGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL01hbmlmZXN0V3JhcHBlclwiO1xuXG5leHBvcnQgdHlwZSBSZXNvbHZlZEFubm90YXRpb25Db250ZXh0ID0ge1xuXHRhbm5vdGF0aW9uOiBBbnlBbm5vdGF0aW9uO1xuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0O1xufTtcblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciBhbiBvYmplY3QgaXMgYW4gYW5ub3RhdGlvbiB0ZXJtLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfEFubm90YXRpb25UZXJtPG9iamVjdD59IHZBbm5vdGF0aW9uUGF0aFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmNvbnN0IGlzQW5ub3RhdGlvblRlcm0gPSBmdW5jdGlvbih2QW5ub3RhdGlvblBhdGg6IHN0cmluZyB8IEFubm90YXRpb25UZXJtPGFueT4pOiB2QW5ub3RhdGlvblBhdGggaXMgQW5ub3RhdGlvblRlcm08YW55PiB7XG5cdHJldHVybiB0eXBlb2YgdkFubm90YXRpb25QYXRoID09PSBcIm9iamVjdFwiO1xufTtcblxuZnVuY3Rpb24gaXNTZXJ2aWNlT2JqZWN0KG9iamVjdFBhcnQ6IFNlcnZpY2VPYmplY3RBbmRBbm5vdGF0aW9uKTogb2JqZWN0UGFydCBpcyBTZXJ2aWNlT2JqZWN0IHtcblx0cmV0dXJuIG9iamVjdFBhcnQgJiYgb2JqZWN0UGFydC5oYXNPd25Qcm9wZXJ0eShcIl90eXBlXCIpO1xufVxuXG5jb25zdCBnZXREYXRhTW9kZWxQYXRoRm9yRW50aXR5U2V0ID0gZnVuY3Rpb24ocmVzb2x2ZWRNZXRhUGF0aDogUmVzb2x1dGlvblRhcmdldDxhbnk+KTogRGF0YU1vZGVsT2JqZWN0UGF0aCB7XG5cdGxldCByb290RW50aXR5U2V0OiBFbnRpdHlTZXQgfCB1bmRlZmluZWQ7XG5cdGxldCBjdXJyZW50RW50aXR5U2V0OiBFbnRpdHlTZXQgfCB1bmRlZmluZWQ7XG5cdGxldCBwcmV2aW91c0VudGl0eVNldDogRW50aXR5U2V0IHwgdW5kZWZpbmVkO1xuXHRsZXQgY3VycmVudEVudGl0eVR5cGU6IEVudGl0eVR5cGUgfCB1bmRlZmluZWQ7XG5cdGxldCBuYXZpZ2F0ZWRQYXRoczogc3RyaW5nW10gPSBbXTtcblx0Y29uc3QgbmF2aWdhdGlvblByb3BlcnRpZXM6IE5hdmlnYXRpb25Qcm9wZXJ0eVtdID0gW107XG5cdHJlc29sdmVkTWV0YVBhdGgub2JqZWN0UGF0aC5mb3JFYWNoKChvYmplY3RQYXJ0OiBTZXJ2aWNlT2JqZWN0QW5kQW5ub3RhdGlvbikgPT4ge1xuXHRcdGlmIChpc1NlcnZpY2VPYmplY3Qob2JqZWN0UGFydCkpIHtcblx0XHRcdHN3aXRjaCAob2JqZWN0UGFydC5fdHlwZSkge1xuXHRcdFx0XHRjYXNlIFwiTmF2aWdhdGlvblByb3BlcnR5XCI6XG5cdFx0XHRcdFx0bmF2aWdhdGVkUGF0aHMucHVzaChvYmplY3RQYXJ0Lm5hbWUpO1xuXHRcdFx0XHRcdG5hdmlnYXRpb25Qcm9wZXJ0aWVzLnB1c2gob2JqZWN0UGFydCk7XG5cdFx0XHRcdFx0Y3VycmVudEVudGl0eVR5cGUgPSBvYmplY3RQYXJ0LnRhcmdldFR5cGU7XG5cdFx0XHRcdFx0aWYgKHByZXZpb3VzRW50aXR5U2V0ICYmIHByZXZpb3VzRW50aXR5U2V0Lm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmcuaGFzT3duUHJvcGVydHkobmF2aWdhdGVkUGF0aHMuam9pbihcIi9cIikpKSB7XG5cdFx0XHRcdFx0XHRjdXJyZW50RW50aXR5U2V0ID0gcHJldmlvdXNFbnRpdHlTZXQubmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1tuYXZpZ2F0ZWRQYXRocy5qb2luKFwiL1wiKV07XG5cdFx0XHRcdFx0XHRwcmV2aW91c0VudGl0eVNldCA9IGN1cnJlbnRFbnRpdHlTZXQ7XG5cdFx0XHRcdFx0XHRuYXZpZ2F0ZWRQYXRocyA9IFtdO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjdXJyZW50RW50aXR5U2V0ID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcIkVudGl0eVNldFwiOlxuXHRcdFx0XHRcdGlmIChyb290RW50aXR5U2V0ID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdHJvb3RFbnRpdHlTZXQgPSBvYmplY3RQYXJ0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjdXJyZW50RW50aXR5U2V0ID0gb2JqZWN0UGFydDtcblx0XHRcdFx0XHRwcmV2aW91c0VudGl0eVNldCA9IGN1cnJlbnRFbnRpdHlTZXQ7XG5cdFx0XHRcdFx0Y3VycmVudEVudGl0eVR5cGUgPSBjdXJyZW50RW50aXR5U2V0Py5lbnRpdHlUeXBlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cdGNvbnN0IGRhdGFNb2RlbFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGggPSB7XG5cdFx0c3RhcnRpbmdFbnRpdHlTZXQ6IHJvb3RFbnRpdHlTZXQgYXMgRW50aXR5U2V0LFxuXHRcdHRhcmdldEVudGl0eVR5cGU6IGN1cnJlbnRFbnRpdHlUeXBlIGFzIEVudGl0eVR5cGUsXG5cdFx0dGFyZ2V0RW50aXR5U2V0OiBjdXJyZW50RW50aXR5U2V0LFxuXHRcdG5hdmlnYXRpb25Qcm9wZXJ0aWVzOiBuYXZpZ2F0aW9uUHJvcGVydGllcyxcblx0XHRjb250ZXh0TG9jYXRpb246IHVuZGVmaW5lZCxcblx0XHR0YXJnZXRPYmplY3Q6IHJlc29sdmVkTWV0YVBhdGgudGFyZ2V0XG5cdH07XG5cdGRhdGFNb2RlbFBhdGguY29udGV4dExvY2F0aW9uID0gZGF0YU1vZGVsUGF0aDtcblx0cmV0dXJuIGRhdGFNb2RlbFBhdGg7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhIENvbnZlcnRlckNvbnRleHQgb2JqZWN0IHRoYXQgd2lsbCBiZSB1c2VkIHdpdGhpbiB0aGUgY29udmVydGVycy5cbiAqXG4gKiBAcGFyYW0ge0NvbnZlcnRlck91dHB1dH0gb0NvbnZlcnRlZFR5cGVzIFRoZSBjb252ZXJ0ZWQgYW5ub3RhdGlvbiBhbmQgc2VydmljZSB0eXBlc1xuICogQHBhcmFtIHtCYXNlTWFuaWZlc3RTZXR0aW5nc30gb01hbmlmZXN0U2V0dGluZ3MgVGhlIG1hbmlmZXN0U2V0dGluZ3MgdGhhdCBhcHBsaWVzIHRvIHRoaXMgcGFnZVxuICogQHBhcmFtIHtUZW1wbGF0ZVR5cGV9IHRlbXBsYXRlVHlwZSBUaGUgdHlwZSBvZiB0ZW1wbGF0ZSB3ZSdyZSBsb29raW5nIGF0IHJpZ2h0IG5vd1xuICogQHBhcmFtIHtJU2hlbGxTZXJ2aWNlc1Byb3h5fSBzaGVsbFNlcnZpY2VzIFRoZSBjdXJyZW50IGluc3RhbmNlIG9mIHRoZSBzaGVsbHNlcnZpY2VcbiAqIEBwYXJhbSB7SURpYWdub3N0aWNzfSBkaWFnbm9zdGljcyBUaGUgZGlhZ25vc3RpY3Mgc2hpbVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbWVyZ2VGbiBUaGUgZnVuY3Rpb24gdG8gYmUgdXNlZCB0byBwZXJmb20gc29tZSBkZWVwIG1lcmdlcyBiZXR3ZWVuIG9iamVjdFxuICogQHBhcmFtIHtEYXRhTW9kZWxPYmplY3RQYXRofSB0YXJnZXREYXRhTW9kZWxQYXRoIFRoZSBnbG9iYWwgcGF0aCB0byByZWFjaCB0aGUgZW50aXR5U2V0XG4gKlxuICogQHJldHVybnMge0NvbnZlcnRlckNvbnRleHR9IEEgY29udmVydGVyIGNvbnRleHQgZm9yIHRoZSBjb252ZXJ0ZXJzXG4gKi9cbmNsYXNzIENvbnZlcnRlckNvbnRleHQge1xuXHRwcml2YXRlIG1hbmlmZXN0V3JhcHBlcjogTWFuaWZlc3RXcmFwcGVyO1xuXHRwcml2YXRlIGJhc2VDb250ZXh0UGF0aDogc3RyaW5nO1xuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHByaXZhdGUgY29udmVydGVkVHlwZXM6IENvbnZlcnRlck91dHB1dCxcblx0XHRwcml2YXRlIG1hbmlmZXN0U2V0dGluZ3M6IEJhc2VNYW5pZmVzdFNldHRpbmdzLFxuXHRcdHByaXZhdGUgZGlhZ25vc3RpY3M6IElEaWFnbm9zdGljcyxcblx0XHRwcml2YXRlIG1lcmdlRm46IEZ1bmN0aW9uLFxuXHRcdHByaXZhdGUgdGFyZ2V0RGF0YU1vZGVsUGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aFxuXHQpIHtcblx0XHR0aGlzLm1hbmlmZXN0V3JhcHBlciA9IG5ldyBNYW5pZmVzdFdyYXBwZXIodGhpcy5tYW5pZmVzdFNldHRpbmdzLCBtZXJnZUZuKTtcblx0XHR0aGlzLmJhc2VDb250ZXh0UGF0aCA9IGdldFRhcmdldE9iamVjdFBhdGgodGhpcy50YXJnZXREYXRhTW9kZWxQYXRoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZSB0aGUgcHJvcGVydHkgYmFzZWQgb24gdGhlIHBhdGguXG5cdCAqXG5cdCAqIEBwYXJhbSBmdWxseVF1YWxpZmllZE5hbWUgVGhlIGZ1bGx5IHF1YWxpZmllZCBuYW1lXG5cdCAqIEByZXR1cm5zIHtQcm9wZXJ0eX0gVGhlIHByb3BlcnR5IEVudGl0eVR5cGUgYmFzZWRcblx0ICovXG5cdHByaXZhdGUgX2dldEVudGl0eVR5cGVGcm9tRnVsbHlRdWFsaWZpZWROYW1lKGZ1bGx5UXVhbGlmaWVkTmFtZTogc3RyaW5nKTogRW50aXR5VHlwZSB8IHVuZGVmaW5lZCB7XG5cdFx0Y29uc3QgdGFyZ2V0RW50aXR5VHlwZSA9IHRoaXMuY29udmVydGVkVHlwZXMuZW50aXR5VHlwZXMuZmluZChlbnRpdHlUeXBlID0+IHtcblx0XHRcdGlmIChmdWxseVF1YWxpZmllZE5hbWUuc3RhcnRzV2l0aChlbnRpdHlUeXBlLmZ1bGx5UXVhbGlmaWVkTmFtZSkpIHtcblx0XHRcdFx0Y29uc3QgcmVwbGFjZUFubm90YXRpb24gPSBmdWxseVF1YWxpZmllZE5hbWUucmVwbGFjZShlbnRpdHlUeXBlLmZ1bGx5UXVhbGlmaWVkTmFtZSwgXCJcIik7XG5cdFx0XHRcdHJldHVybiByZXBsYWNlQW5ub3RhdGlvbi5zdGFydHNXaXRoKFwiL1wiKSB8fCByZXBsYWNlQW5ub3RhdGlvbi5zdGFydHNXaXRoKFwiQFwiKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9KTtcblx0XHRyZXR1cm4gdGFyZ2V0RW50aXR5VHlwZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZSB0aGUgZW50aXR5VHlwZSBhc3NvY2lhdGVkIHdpdGggYW4gYW5ub3RhdGlvbiBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSBhbm5vdGF0aW9uIFRoZSBhbm5vdGF0aW9uIG9iamVjdCBmb3Igd2hpY2ggd2Ugd2FudCB0byBmaW5kIHRoZSBlbnRpdHlUeXBlXG5cdCAqIEByZXR1cm5zIHtFbnRpdHlUeXBlfSBUaGUgRW50aXR5VHlwZSB0aGUgYW5ub3RhdGlvbiByZWZlcnMgdG9cblx0ICovXG5cdGdldEFubm90YXRpb25FbnRpdHlUeXBlKGFubm90YXRpb24/OiBBbm5vdGF0aW9uVGVybTxhbnk+KTogRW50aXR5VHlwZSB7XG5cdFx0aWYgKGFubm90YXRpb24pIHtcblx0XHRcdGNvbnN0IGFubm90YXRpb25QYXRoID0gYW5ub3RhdGlvbi5mdWxseVF1YWxpZmllZE5hbWU7XG5cdFx0XHRjb25zdCB0YXJnZXRFbnRpdHlUeXBlID0gdGhpcy5fZ2V0RW50aXR5VHlwZUZyb21GdWxseVF1YWxpZmllZE5hbWUoYW5ub3RhdGlvblBhdGgpO1xuXHRcdFx0aWYgKCF0YXJnZXRFbnRpdHlUeXBlKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIEVudGl0eSBUeXBlIGZvciBcIiArIGFubm90YXRpb24uZnVsbHlRdWFsaWZpZWROYW1lKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0YXJnZXRFbnRpdHlUeXBlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy50YXJnZXREYXRhTW9kZWxQYXRoLnRhcmdldEVudGl0eVR5cGU7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlIHRoZSBtYW5pZmVzdCBzZXR0aW5ncyBkZWZpbmVkIGZvciBhIHNwZWNpZmljIGNvbnRyb2wgd2l0aGluIGNvbnRyb2xDb25maWd1cmF0aW9uLlxuXHQgKlxuXHQgKiBAcGFyYW0gdkFubm90YXRpb25QYXRoIFRoZSBhbm5vdGF0aW9uIHBhdGggb3Igb2JqZWN0IHRvIGV2YWx1YXRlXG5cdCAqIEByZXR1cm5zIFRoZSBjb250cm9sIGNvbmZpZ3VyYXRpb24gZm9yIHRoYXQgc3BlY2lmaWMgYW5udG9hdGlvbiBwYXRoIGlmIGl0IGV4aXN0c1xuXHQgKi9cblx0Z2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbih2QW5ub3RhdGlvblBhdGg6IHN0cmluZyB8IEFubm90YXRpb25UZXJtPGFueT4pOiBhbnkge1xuXHRcdGlmIChpc0Fubm90YXRpb25UZXJtKHZBbm5vdGF0aW9uUGF0aCkpIHtcblx0XHRcdHJldHVybiB0aGlzLm1hbmlmZXN0V3JhcHBlci5nZXRDb250cm9sQ29uZmlndXJhdGlvbihcblx0XHRcdFx0dkFubm90YXRpb25QYXRoLmZ1bGx5UXVhbGlmaWVkTmFtZS5yZXBsYWNlKHRoaXMudGFyZ2V0RGF0YU1vZGVsUGF0aC50YXJnZXRFbnRpdHlUeXBlLmZ1bGx5UXVhbGlmaWVkTmFtZSwgXCJcIilcblx0XHRcdCk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLm1hbmlmZXN0V3JhcHBlci5nZXRDb250cm9sQ29uZmlndXJhdGlvbih2QW5ub3RhdGlvblBhdGgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhbiBhYnNvbHV0ZSBhbm5vdGF0aW9uIHBhdGggYmFzZWQgb24gdGhlIGN1cnJlbnQgbWV0YSBtb2RlbCBjb250ZXh0LlxuXHQgKlxuXHQgKiBAcGFyYW0gc0Fubm90YXRpb25QYXRoIFRoZSByZWxhdGl2ZSBhbm5vdGF0aW9uIHBhdGhcblx0ICogQHJldHVybnMgVGhlIGNvcnJlY3QgYW5ub3RhdGlvbiBwYXRoIGJhc2VkIG9uIHRoZSBjdXJyZW50IGNvbnRleHRcblx0ICovXG5cdGdldEFic29sdXRlQW5ub3RhdGlvblBhdGgoc0Fubm90YXRpb25QYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRcdGlmICghc0Fubm90YXRpb25QYXRoKSB7XG5cdFx0XHRyZXR1cm4gc0Fubm90YXRpb25QYXRoO1xuXHRcdH1cblx0XHRpZiAoc0Fubm90YXRpb25QYXRoWzBdID09PSBcIi9cIikge1xuXHRcdFx0cmV0dXJuIHNBbm5vdGF0aW9uUGF0aDtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuYmFzZUNvbnRleHRQYXRoICsgXCIvXCIgKyBzQW5ub3RhdGlvblBhdGg7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmUgdGhlIGN1cnJlbnQgZW50aXR5U2V0LlxuXHQgKlxuXHQgKiBAcmV0dXJucyBUaGUgY3VycmVudCBFbnRpdHlTZXQgaWYgaXQgZXhpc3RzLlxuXHQgKi9cblx0Z2V0RW50aXR5U2V0KCk6IEVudGl0eVNldCB8IHVuZGVmaW5lZCB7XG5cdFx0cmV0dXJuIHRoaXMudGFyZ2V0RGF0YU1vZGVsUGF0aC50YXJnZXRFbnRpdHlTZXQ7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmUgdGhlIGNvbnRleHQgcGF0aC5cblx0ICpcblx0ICogQHJldHVybnMgVGhlIGNvbnRleHQgcGF0aCBvZiB0aGUgY29udmVydGVyLlxuXHQgKi9cblx0Z2V0Q29udGV4dFBhdGgoKTogc3RyaW5nIHtcblx0XHRyZXR1cm4gdGhpcy5iYXNlQ29udGV4dFBhdGg7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmUgdGhlIGN1cnJlbnQgZGF0YSBtb2RlbCBvYmplY3QgcGF0aC5cblx0ICpcblx0ICogQHJldHVybnMgVGhlIGN1cnJlbnQgZGF0YSBtb2RlbCBvYmplY3QgcGF0aFxuXHQgKi9cblx0Z2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpOiBEYXRhTW9kZWxPYmplY3RQYXRoIHtcblx0XHRyZXR1cm4gdGhpcy50YXJnZXREYXRhTW9kZWxQYXRoO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCB0aGUgRW50aXR5Q29udGFpbmVyLlxuXHQgKlxuXHQgKiBAcmV0dXJucyBUaGUgY3VycmVudCBzZXJ2aWNlIEVudGl0eUNvbnRhaW5lclxuXHQgKi9cblx0Z2V0RW50aXR5Q29udGFpbmVyKCk6IEVudGl0eUNvbnRhaW5lciB7XG5cdFx0cmV0dXJuIHRoaXMuY29udmVydGVkVHlwZXMuZW50aXR5Q29udGFpbmVyO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCB0aGUgRW50aXR5VHlwZSBiYXNlZCBvbiB0aGUgZnVsbHkgcXVhbGlmaWVkIG5hbWUuXG5cdCAqXG5cdCAqIEByZXR1cm5zIFRoZSBjdXJyZW50IEVudGl0eVR5cGUuXG5cdCAqL1xuXHRnZXRFbnRpdHlUeXBlKCk6IEVudGl0eVR5cGUge1xuXHRcdHJldHVybiB0aGlzLnRhcmdldERhdGFNb2RlbFBhdGgudGFyZ2V0RW50aXR5VHlwZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGEgc2luZ2xldG9uIGJhc2VkIG9uIHRoZSBmdWxseSBxdWFsaWZpZWQgbmFtZS5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGZ1bGx5UXVhbGlmaWVkTmFtZSBUaGUgZnVsbHkgcXVhbGlmaWVkIG5hbWUgb2YgdGhlIHNpbmdsZXRvblxuXHQgKiBAcmV0dXJucyB7U2luZ2xldG9uIHwgdW5kZWZpbmVkfSBUaGUgc2luZ2xldG9uIGluc3RhbmNlLlxuXHQgKi9cblx0Z2V0U2luZ2xldG9uKGZ1bGx5UXVhbGlmaWVkTmFtZTogc3RyaW5nKTogU2luZ2xldG9uIHwgdW5kZWZpbmVkIHtcblx0XHRyZXR1cm4gdGhpcy5jb252ZXJ0ZWRUeXBlcy5zaW5nbGV0b25zLmZpbmQoc2luZ2xldG9uID0+IHNpbmdsZXRvbi5mdWxseVF1YWxpZmllZE5hbWUgPT09IGZ1bGx5UXVhbGlmaWVkTmFtZSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgZW50aXR5IHR5cGUgb2YgdGhlIHBhcmFtZXRlciBpbiBjYXNlIG9mIGEgcGFyYW1ldGVyaXplZCBzZXJ2aWNlLlxuXHQgKiBAcmV0dXJucyB7RW50aXR5VHlwZX0gVGhlIGVudGl0eSB0eXBlIG9mIHRoZSBwYXJhbWV0ZXJcblx0ICovXG5cdGdldFBhcmFtZXRlckVudGl0eVR5cGUoKTogRW50aXR5VHlwZSB7XG5cdFx0Y29uc3QgcGFyYW1ldGVyRW50aXR5VHlwZSA9IHRoaXMudGFyZ2V0RGF0YU1vZGVsUGF0aC5zdGFydGluZ0VudGl0eVNldC5lbnRpdHlUeXBlO1xuXHRcdGNvbnN0IGlzUGFyYW1ldGVyaXplZCA9ICEhcGFyYW1ldGVyRW50aXR5VHlwZS5hbm5vdGF0aW9ucz8uQ29tbW9uPy5SZXN1bHRDb250ZXh0O1xuXHRcdHJldHVybiAoaXNQYXJhbWV0ZXJpemVkICYmIHBhcmFtZXRlckVudGl0eVR5cGUpIGFzIEVudGl0eVR5cGU7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIGFuIGFubm90YXRpb24gZnJvbSBhbiBlbnRpdHkgdHlwZSBiYXNlZCBvbiBhbm5vdGF0aW9uIHBhdGguXG5cdCAqXG5cdCAqIEBwYXJhbSBhbm5vdGF0aW9uUGF0aCBUaGUgYW5ub3RhdGlvbiBwYXRoIHRvIGJlIGV2YWx1YXRlZFxuXHQgKiBAcmV0dXJucyBUaGUgdGFyZ2V0IGFubm90YXRpb24gcGF0aCBhcyB3ZWxsIGFzIGEgY29udmVydGVyIGNvbnRleHQgdG8gZ28gd2l0aCBpdFxuXHQgKi9cblx0Z2V0RW50aXR5VHlwZUFubm90YXRpb24oYW5ub3RhdGlvblBhdGg6IHN0cmluZyk6IFJlc29sdmVkQW5ub3RhdGlvbkNvbnRleHQge1xuXHRcdGlmIChhbm5vdGF0aW9uUGF0aC5pbmRleE9mKFwiQFwiKSA9PT0gLTEpIHtcblx0XHRcdGFubm90YXRpb25QYXRoID0gXCJAXCIgKyBhbm5vdGF0aW9uUGF0aDtcblx0XHR9XG5cdFx0Y29uc3QgdGFyZ2V0T2JqZWN0OiBSZXNvbHZlZFRhcmdldCA9IHRoaXMudGFyZ2V0RGF0YU1vZGVsUGF0aC50YXJnZXRFbnRpdHlUeXBlLnJlc29sdmVQYXRoKGFubm90YXRpb25QYXRoLCB0cnVlKTtcblxuXHRcdGxldCByb290RW50aXR5U2V0ID0gdGhpcy50YXJnZXREYXRhTW9kZWxQYXRoLnRhcmdldEVudGl0eVNldDtcblx0XHRsZXQgY3VycmVudEVudGl0eVR5cGUgPSB0aGlzLnRhcmdldERhdGFNb2RlbFBhdGgudGFyZ2V0RW50aXR5VHlwZTtcblx0XHRjb25zdCBzdGFydGluZ0VudGl0eVR5cGUgPSB0aGlzLnRhcmdldERhdGFNb2RlbFBhdGguc3RhcnRpbmdFbnRpdHlTZXQuZW50aXR5VHlwZTtcblx0XHRjb25zdCBuYXZpZ2F0aW9uUHJvcGVydGllcyA9IHRoaXMudGFyZ2V0RGF0YU1vZGVsUGF0aC5uYXZpZ2F0aW9uUHJvcGVydGllcy5jb25jYXQoKTtcblx0XHRsZXQgaSA9IDE7XG5cdFx0bGV0IGN1cnJlbnRPYmplY3Q7XG5cdFx0bGV0IG5hdmlnYXRlZFBhdGhzID0gW107XG5cdFx0Y29uc3QgdmlzaXRlZE9iamVjdHMgPSB0YXJnZXRPYmplY3QudmlzaXRlZE9iamVjdHM7XG5cdFx0Ly8gSW4gY2FzZSBvZiBwYXJhbWV0ZXJpemVkIHNlcnZpY2Vcblx0XHRpZiAoIXJvb3RFbnRpdHlTZXQgJiYgc3RhcnRpbmdFbnRpdHlUeXBlLmFubm90YXRpb25zLkNvbW1vbj8uUmVzdWx0Q29udGV4dCkge1xuXHRcdFx0cm9vdEVudGl0eVNldCA9IHRoaXMudGFyZ2V0RGF0YU1vZGVsUGF0aC5zdGFydGluZ0VudGl0eVNldDtcblx0XHRcdHRoaXMudGFyZ2V0RGF0YU1vZGVsUGF0aC5uYXZpZ2F0aW9uUHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKG5hdk9iamVjdCkge1xuXHRcdFx0XHRuYXZpZ2F0ZWRQYXRocy5wdXNoKG5hdk9iamVjdC5uYW1lKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHR3aGlsZSAoaSA8IHZpc2l0ZWRPYmplY3RzLmxlbmd0aCkge1xuXHRcdFx0Y3VycmVudE9iamVjdCA9IHZpc2l0ZWRPYmplY3RzW2krK107XG5cdFx0XHRpZiAoY3VycmVudE9iamVjdC5fdHlwZSA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIikge1xuXHRcdFx0XHRuYXZpZ2F0ZWRQYXRocy5wdXNoKGN1cnJlbnRPYmplY3QubmFtZSk7XG5cdFx0XHRcdG5hdmlnYXRpb25Qcm9wZXJ0aWVzLnB1c2goY3VycmVudE9iamVjdCBhcyBOYXZpZ2F0aW9uUHJvcGVydHkpO1xuXHRcdFx0XHRjdXJyZW50RW50aXR5VHlwZSA9IChjdXJyZW50T2JqZWN0IGFzIE5hdmlnYXRpb25Qcm9wZXJ0eSkudGFyZ2V0VHlwZTtcblx0XHRcdFx0aWYgKHJvb3RFbnRpdHlTZXQgJiYgcm9vdEVudGl0eVNldC5uYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nLmhhc093blByb3BlcnR5KG5hdmlnYXRlZFBhdGhzLmpvaW4oXCIvXCIpKSkge1xuXHRcdFx0XHRcdGNvbnN0IG5hdlBhdGggPSBuYXZpZ2F0ZWRQYXRocy5qb2luKFwiL1wiKTtcblx0XHRcdFx0XHRyb290RW50aXR5U2V0ID1cblx0XHRcdFx0XHRcdHJvb3RFbnRpdHlTZXQubmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1tjdXJyZW50T2JqZWN0Lm5hbWVdIHx8IHJvb3RFbnRpdHlTZXQubmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1tuYXZQYXRoXTtcblx0XHRcdFx0XHRuYXZpZ2F0ZWRQYXRocyA9IFtdO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJvb3RFbnRpdHlTZXQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChjdXJyZW50T2JqZWN0Ll90eXBlID09PSBcIkVudGl0eVNldFwiKSB7XG5cdFx0XHRcdHJvb3RFbnRpdHlTZXQgPSBjdXJyZW50T2JqZWN0IGFzIEVudGl0eVNldDtcblx0XHRcdFx0Y3VycmVudEVudGl0eVR5cGUgPSByb290RW50aXR5U2V0LmVudGl0eVR5cGU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGNvbnN0IG91dERhdGFNb2RlbFBhdGggPSB7XG5cdFx0XHRzdGFydGluZ0VudGl0eVNldDogdGhpcy50YXJnZXREYXRhTW9kZWxQYXRoLnN0YXJ0aW5nRW50aXR5U2V0LFxuXHRcdFx0dGFyZ2V0RW50aXR5U2V0OiByb290RW50aXR5U2V0LFxuXHRcdFx0dGFyZ2V0RW50aXR5VHlwZTogY3VycmVudEVudGl0eVR5cGUsXG5cdFx0XHR0YXJnZXRPYmplY3Q6IG5hdmlnYXRpb25Qcm9wZXJ0aWVzW25hdmlnYXRpb25Qcm9wZXJ0aWVzLmxlbmd0aCAtIDFdLFxuXHRcdFx0bmF2aWdhdGlvblByb3BlcnRpZXMsXG5cdFx0XHRjb250ZXh0TG9jYXRpb246IHRoaXMudGFyZ2V0RGF0YU1vZGVsUGF0aC5jb250ZXh0TG9jYXRpb25cblx0XHR9O1xuXHRcdHJldHVybiB7XG5cdFx0XHRhbm5vdGF0aW9uOiB0YXJnZXRPYmplY3QudGFyZ2V0IGFzIEFueUFubm90YXRpb24sXG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0OiBuZXcgQ29udmVydGVyQ29udGV4dChcblx0XHRcdFx0dGhpcy5jb252ZXJ0ZWRUeXBlcyxcblx0XHRcdFx0dGhpcy5tYW5pZmVzdFNldHRpbmdzLFxuXHRcdFx0XHR0aGlzLmRpYWdub3N0aWNzLFxuXHRcdFx0XHR0aGlzLm1lcmdlRm4sXG5cdFx0XHRcdG91dERhdGFNb2RlbFBhdGhcblx0XHRcdClcblx0XHR9O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlIHRoZSB0eXBlIG9mIHRlbXBsYXRlIHdlJ3JlIHdvcmtpbmcgb24gKGUuZy4gTGlzdFJlcG9ydCAvIE9iamVjdFBhZ2UgLyAuLi4pLlxuXHQgKlxuXHQgKiBAcmV0dXJucyBUaGUgY3VycmVudCB0ZW5wbGF0ZSB0eXBlXG5cdCAqL1xuXHRnZXRUZW1wbGF0ZVR5cGUoKTogVGVtcGxhdGVUeXBlIHtcblx0XHRyZXR1cm4gdGhpcy5tYW5pZmVzdFdyYXBwZXIuZ2V0VGVtcGxhdGVUeXBlKCk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmUgYSByZWxhdGl2ZSBhbm5vdGF0aW9uIHBhdGggYmV0d2VlbiBhbiBhbm5vdGF0aW9uIHBhdGggYW5kIGFuIGVudGl0eSB0eXBlLlxuXHQgKlxuXHQgKiBAcGFyYW0gYW5ub3RhdGlvblBhdGhcblx0ICogQHBhcmFtIGVudGl0eVR5cGVcblx0ICogQHJldHVybnMgVGhlIHJlbGF0aXZlIGFubnRvdGF0aW9uIHBhdGguXG5cdCAqL1xuXHRnZXRSZWxhdGl2ZUFubm90YXRpb25QYXRoKGFubm90YXRpb25QYXRoOiBzdHJpbmcsIGVudGl0eVR5cGU6IEVudGl0eVR5cGUpOiBzdHJpbmcge1xuXHRcdHJldHVybiBhbm5vdGF0aW9uUGF0aC5yZXBsYWNlKGVudGl0eVR5cGUuZnVsbHlRdWFsaWZpZWROYW1lLCBcIlwiKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUcmFuc2Zvcm0gYW4gZW50aXR5VHlwZSBiYXNlZCBwYXRoIHRvIGFuIGVudGl0eVNldCBiYXNlZCBvbmUgKHVpNSB0ZW1wbGF0aW5nIGdlbmVyYWxseSBleHBlY3QgYW4gZW50aXR5U2V0QmFzZWRQYXRoKS5cblx0ICpcblx0ICogQHBhcmFtIGFubm90YXRpb25QYXRoXG5cdCAqIEByZXR1cm5zIFRoZSBFbnRpdHlTZXQgYmFzZWQgYW5ub3RhdGlvbiBwYXRoXG5cdCAqL1xuXHRnZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGFubm90YXRpb25QYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRcdGlmICghYW5ub3RhdGlvblBhdGgpIHtcblx0XHRcdHJldHVybiBhbm5vdGF0aW9uUGF0aDtcblx0XHR9XG5cdFx0Y29uc3QgZW50aXR5VHlwZUZRTiA9IHRoaXMudGFyZ2V0RGF0YU1vZGVsUGF0aC50YXJnZXRFbnRpdHlUeXBlLmZ1bGx5UXVhbGlmaWVkTmFtZTtcblx0XHRpZiAoXG5cdFx0XHR0aGlzLnRhcmdldERhdGFNb2RlbFBhdGgudGFyZ2V0RW50aXR5U2V0IHx8XG5cdFx0XHQoKHRoaXMuYmFzZUNvbnRleHRQYXRoLnN0YXJ0c1dpdGgoXCIvXCIpICYmIHRoaXMuYmFzZUNvbnRleHRQYXRoLm1hdGNoKC9cXC8vZykpIHx8IFtdKS5sZW5ndGggPiAxXG5cdFx0KSB7XG5cdFx0XHRsZXQgcmVwbGFjZWRBbm5vdGF0aW9uUGF0aCA9IGFubm90YXRpb25QYXRoLnJlcGxhY2UoZW50aXR5VHlwZUZRTiwgXCIvXCIpO1xuXHRcdFx0aWYgKHJlcGxhY2VkQW5ub3RhdGlvblBhdGgubGVuZ3RoID4gMiAmJiByZXBsYWNlZEFubm90YXRpb25QYXRoWzBdID09PSBcIi9cIiAmJiByZXBsYWNlZEFubm90YXRpb25QYXRoWzFdID09PSBcIi9cIikge1xuXHRcdFx0XHRyZXBsYWNlZEFubm90YXRpb25QYXRoID0gcmVwbGFjZWRBbm5vdGF0aW9uUGF0aC5zdWJzdHIoMSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5iYXNlQ29udGV4dFBhdGggKyByZXBsYWNlZEFubm90YXRpb25QYXRoO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gXCIvXCIgKyBhbm5vdGF0aW9uUGF0aDtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmUgdGhlIG1hbmlmZXN0IHdyYXBwZXIgZm9yIHRoZSBjdXJyZW50IGNvbnRleHQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIFRoZSBjdXJyZW50IG1hbmlmZXN0IHdyYXBwZXJcblx0ICovXG5cdGdldE1hbmlmZXN0V3JhcHBlcigpOiBNYW5pZmVzdFdyYXBwZXIge1xuXHRcdHJldHVybiB0aGlzLm1hbmlmZXN0V3JhcHBlcjtcblx0fVxuXG5cdGdldERpYWdub3N0aWNzKCk6IElEaWFnbm9zdGljcyB7XG5cdFx0cmV0dXJuIHRoaXMuZGlhZ25vc3RpY3M7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmUgYSBuZXcgY29udmVydGVyIGNvbnRleHQsIHNjb3BlZCBmb3IgYSBkaWZmZXJlbnQgY29udGV4dCBwYXRoLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gY29udGV4dFBhdGggVGhlIHBhdGggd2Ugd2FudCB0byBvcmNoZXN0cmF0ZSB0aGUgY29udmVydGVyIGNvbnRleHQgYXJvdW5kXG5cdCAqIEByZXR1cm5zIHtDb252ZXJ0ZXJDb250ZXh0fVxuXHQgKi9cblx0Z2V0Q29udmVydGVyQ29udGV4dEZvcjxUPihjb250ZXh0UGF0aDogc3RyaW5nKTogQ29udmVydGVyQ29udGV4dCB7XG5cdFx0Y29uc3QgcmVzb2x2ZWRNZXRhUGF0aDogUmVzb2x1dGlvblRhcmdldDxUPiA9IHRoaXMuY29udmVydGVkVHlwZXMucmVzb2x2ZVBhdGgoY29udGV4dFBhdGgpO1xuXHRcdGNvbnN0IHRhcmdldFBhdGggPSBnZXREYXRhTW9kZWxQYXRoRm9yRW50aXR5U2V0KHJlc29sdmVkTWV0YVBhdGgpO1xuXHRcdHJldHVybiBuZXcgQ29udmVydGVyQ29udGV4dCh0aGlzLmNvbnZlcnRlZFR5cGVzLCB0aGlzLm1hbmlmZXN0U2V0dGluZ3MsIHRoaXMuZGlhZ25vc3RpY3MsIHRoaXMubWVyZ2VGbiwgdGFyZ2V0UGF0aCk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IGFsbCBhbm5vdGF0aW9ucyBvZiBhIGdpdmVuIHRlcm0gYW5kIHZvY2FidWxhcnkgb24gYW4gZW50aXR5IHR5cGVcblx0ICogKG9yIG9uIHRoZSBjdXJyZW50IGVudGl0eSB0eXBlIGlmIGVudGl0eVR5cGUgaXNuJ3Qgc3BlY2lmaWVkKS5cblx0ICpcblx0ICogQHBhcmFtIHZvY2FidWxhcnlOYW1lXG5cdCAqIEBwYXJhbSBhbm5vdGF0aW9uVGVybVxuXHQgKiBAcGFyYW0gW2Fubm90YXRpb25Tb3VyY2VzXVxuXHQgKiBAcmV0dXJucyBBbGwgdGhlIGFubm90YXRpb24gZm9yIGEgc3BlY2lmaWMgdGVybSBhbmQgdm9jYWJ1bGFyeSBmcm9tIGFuIGVudGl0eSB0eXBlXG5cdCAqL1xuXHRnZXRBbm5vdGF0aW9uc0J5VGVybShcblx0XHR2b2NhYnVsYXJ5TmFtZToga2V5b2YgRW50aXR5VHlwZUFubm90YXRpb25zLFxuXHRcdGFubm90YXRpb25UZXJtOiBzdHJpbmcsXG5cdFx0YW5ub3RhdGlvblNvdXJjZXM6IChTZXJ2aWNlT2JqZWN0IHwgdW5kZWZpbmVkKVtdID0gW3RoaXMuZ2V0RW50aXR5VHlwZSgpXVxuXHQpOiBBbm5vdGF0aW9uVGVybTxhbnk+W10ge1xuXHRcdGxldCBvdXRBbm5vdGF0aW9uczogQW5ub3RhdGlvblRlcm08YW55PltdID0gW107XG5cdFx0YW5ub3RhdGlvblNvdXJjZXMuZm9yRWFjaChhbm5vdGF0aW9uU291cmNlID0+IHtcblx0XHRcdGlmIChhbm5vdGF0aW9uU291cmNlKSB7XG5cdFx0XHRcdGNvbnN0IGFubm90YXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBBbm5vdGF0aW9uVGVybTxhbnk+PiA9IGFubm90YXRpb25Tb3VyY2U/LmFubm90YXRpb25zW3ZvY2FidWxhcnlOYW1lXSB8fCB7fTtcblx0XHRcdFx0aWYgKGFubm90YXRpb25zKSB7XG5cdFx0XHRcdFx0b3V0QW5ub3RhdGlvbnMgPSBPYmplY3Qua2V5cyhhbm5vdGF0aW9ucylcblx0XHRcdFx0XHRcdC5maWx0ZXIoYW5ub3RhdGlvbiA9PiBhbm5vdGF0aW9uc1thbm5vdGF0aW9uXS50ZXJtID09PSBhbm5vdGF0aW9uVGVybSlcblx0XHRcdFx0XHRcdC5yZWR1Y2UoKHByZXZpb3VzVmFsdWU6IEFubm90YXRpb25UZXJtPGFueT5bXSwga2V5OiBzdHJpbmcpID0+IHtcblx0XHRcdFx0XHRcdFx0cHJldmlvdXNWYWx1ZS5wdXNoKGFubm90YXRpb25zW2tleV0pO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcHJldmlvdXNWYWx1ZTtcblx0XHRcdFx0XHRcdH0sIG91dEFubm90YXRpb25zKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBvdXRBbm5vdGF0aW9ucztcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIHJlbGF0aXZlIG1vZGVsIHBhdGggYmFzZWQgb24gdGhlIGN1cnJlbnQgY29udGV4dCBwYXRoLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfHVuZGVmaW5lZH0gVGhlIHJlbGF0aXZlIG1vZGVsIHBhdGggb3IgdW5kZWZpbmVkIGlmIHRoZSBwYXRoIGlzIG5vdCByZXNvbHZlYWJsZVxuXHQgKi9cblx0Z2V0UmVsYXRpdmVNb2RlbFBhdGhGdW5jdGlvbigpOiBGdW5jdGlvbiB7XG5cdFx0Y29uc3QgdGFyZ2V0RGF0YU1vZGVsUGF0aCA9IHRoaXMudGFyZ2V0RGF0YU1vZGVsUGF0aDtcblx0XHRyZXR1cm4gZnVuY3Rpb24oc1BhdGg6IHN0cmluZykge1xuXHRcdFx0Y29uc3QgZW5oYW5jZWRQYXRoID0gZW5oYW5jZURhdGFNb2RlbFBhdGgodGFyZ2V0RGF0YU1vZGVsUGF0aCwgc1BhdGgpO1xuXHRcdFx0cmV0dXJuIGdldENvbnRleHRSZWxhdGl2ZVRhcmdldE9iamVjdFBhdGgoZW5oYW5jZWRQYXRoLCB0cnVlKTtcblx0XHR9O1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZSB0aGUgY29udmVydGVyIGNvbnRleHQgbmVjZXNzYXJ5IGZvciBhIG1hY3JvIGJhc2VkIG9uIGEgbWV0YW1vZGVsIGNvbnRleHQuXG5cdCAqIEBwYXJhbSBzRW50aXR5U2V0TmFtZVxuXHQgKiBAcGFyYW0gb01ldGFNb2RlbENvbnRleHRcblx0ICogQHBhcmFtIGRpYWdub3N0aWNzXG5cdCAqIEBwYXJhbSBtZXJnZUZuXG5cdCAqIEBwYXJhbSB0YXJnZXREYXRhTW9kZWxQYXRoXG5cdCAqIEBwYXJhbSBtYW5pZmVzdFNldHRpbmdzXG5cdCAqIEByZXR1cm5zIHtDb252ZXJ0ZXJDb250ZXh0fSBUaGUgY3VycmVudCBjb252ZXJ0ZXIgY29udGV4dFxuXHQgKi9cblx0c3RhdGljIGNyZWF0ZUNvbnZlcnRlckNvbnRleHRGb3JNYWNybyhcblx0XHRzRW50aXR5U2V0TmFtZTogc3RyaW5nLFxuXHRcdG9NZXRhTW9kZWxDb250ZXh0OiBDb250ZXh0IHwgT0RhdGFNZXRhTW9kZWwsXG5cdFx0ZGlhZ25vc3RpY3M6IElEaWFnbm9zdGljcyxcblx0XHRtZXJnZUZuOiBGdW5jdGlvbixcblx0XHR0YXJnZXREYXRhTW9kZWxQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoIHwgdW5kZWZpbmVkLFxuXHRcdG1hbmlmZXN0U2V0dGluZ3M6IEJhc2VNYW5pZmVzdFNldHRpbmdzID0ge30gYXMgQmFzZU1hbmlmZXN0U2V0dGluZ3Ncblx0KTogQ29udmVydGVyQ29udGV4dCB7XG5cdFx0Y29uc3Qgb01ldGFNb2RlbDogT0RhdGFNZXRhTW9kZWwgPSBvTWV0YU1vZGVsQ29udGV4dC5pc0EoXCJzYXAudWkubW9kZWwub2RhdGEudjQuT0RhdGFNZXRhTW9kZWxcIilcblx0XHRcdD8gKG9NZXRhTW9kZWxDb250ZXh0IGFzIE9EYXRhTWV0YU1vZGVsKVxuXHRcdFx0OiAoKChvTWV0YU1vZGVsQ29udGV4dCBhcyBDb250ZXh0KS5nZXRNb2RlbCgpIGFzIHVua25vd24pIGFzIE9EYXRhTWV0YU1vZGVsKTtcblx0XHRjb25zdCBvQ29udmVydGVyT3V0cHV0ID0gY29udmVydFR5cGVzKG9NZXRhTW9kZWwpO1xuXHRcdGNvbnN0IHRhcmdldEVudGl0eVNldCA9IG9Db252ZXJ0ZXJPdXRwdXQuZW50aXR5U2V0cy5maW5kKGVudGl0eVNldCA9PiBlbnRpdHlTZXQubmFtZSA9PT0gc0VudGl0eVNldE5hbWUpIGFzIEVudGl0eVNldDtcblx0XHRpZiAoIXRhcmdldERhdGFNb2RlbFBhdGgpIHtcblx0XHRcdHRhcmdldERhdGFNb2RlbFBhdGggPSB7XG5cdFx0XHRcdHN0YXJ0aW5nRW50aXR5U2V0OiB0YXJnZXRFbnRpdHlTZXQsXG5cdFx0XHRcdG5hdmlnYXRpb25Qcm9wZXJ0aWVzOiBbXSxcblx0XHRcdFx0dGFyZ2V0RW50aXR5U2V0OiB0YXJnZXRFbnRpdHlTZXQsXG5cdFx0XHRcdHRhcmdldEVudGl0eVR5cGU6IHRhcmdldEVudGl0eVNldC5lbnRpdHlUeXBlLFxuXHRcdFx0XHR0YXJnZXRPYmplY3Q6IHRhcmdldEVudGl0eVNldFxuXHRcdFx0fTtcblx0XHR9XG5cdFx0cmV0dXJuIG5ldyBDb252ZXJ0ZXJDb250ZXh0KG9Db252ZXJ0ZXJPdXRwdXQsIG1hbmlmZXN0U2V0dGluZ3MsIGRpYWdub3N0aWNzLCBtZXJnZUZuLCB0YXJnZXREYXRhTW9kZWxQYXRoKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb252ZXJ0ZXJDb250ZXh0O1xuIl19