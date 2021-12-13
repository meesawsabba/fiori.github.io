/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/BindingExpression", "sap/fe/core/templating/PropertyHelper"], function (BindingExpression, PropertyHelper) {
  "use strict";

  var _exports = {};
  var isPathExpression = PropertyHelper.isPathExpression;
  var isAnnotationPathExpression = PropertyHelper.isAnnotationPathExpression;
  var equal = BindingExpression.equal;
  var constant = BindingExpression.constant;
  var annotationExpression = BindingExpression.annotationExpression;

  var getPathRelativeLocation = function (contextPath) {
    var visitedNavProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    if (!contextPath) {
      return visitedNavProps;
    } else {
      if (visitedNavProps.length >= contextPath.navigationProperties.length) {
        var remainingNavProps = [];
        contextPath.navigationProperties.forEach(function (navProp, navIndex) {
          if (visitedNavProps[navIndex] !== navProp) {
            remainingNavProps.push(visitedNavProps[navIndex]);
          }
        });
        remainingNavProps = remainingNavProps.concat(visitedNavProps.slice(contextPath.navigationProperties.length)); // Clean up NavProp -> Owner

        var currentIdx = 0;

        while (remainingNavProps.length > 1 && currentIdx != remainingNavProps.length - 1) {
          var currentNav = remainingNavProps[currentIdx];
          var nextNavProp = remainingNavProps[currentIdx + 1];

          if (currentNav.partner === nextNavProp.name) {
            remainingNavProps.splice(0, 2);
          } else {
            currentIdx++;
          }
        }

        return remainingNavProps;
      } else {
        var extraNavProp = [];
        visitedNavProps.forEach(function (navProp, navIndex) {
          if (contextPath.navigationProperties[navIndex] !== navProp) {
            extraNavProp.push(visitedNavProps[navIndex]);
          }
        });
        extraNavProp = extraNavProp.concat(contextPath.navigationProperties.slice(visitedNavProps.length)); // Clean up NavProp -> Owner

        var _currentIdx = 0;

        while (extraNavProp.length > 1 && _currentIdx != extraNavProp.length - 1) {
          var _currentNav = extraNavProp[_currentIdx];
          var _nextNavProp = extraNavProp[_currentIdx + 1];

          if (_currentNav.partner === _nextNavProp.name) {
            extraNavProp.splice(0, 2);
          } else {
            _currentIdx++;
          }
        }

        extraNavProp = extraNavProp.map(function (navProp) {
          return navProp.targetType.navigationProperties.find(function (np) {
            return np.name === navProp.partner;
          });
        });
        return extraNavProp;
      }
    }
  };

  _exports.getPathRelativeLocation = getPathRelativeLocation;

  var enhanceDataModelPath = function (dataModelObjectPath, propertyPath) {
    var sPropertyPath = "";

    if ((isPathExpression(propertyPath) || isAnnotationPathExpression(propertyPath)) && propertyPath.path) {
      sPropertyPath = propertyPath.path;
    } else if (typeof propertyPath === "string") {
      sPropertyPath = propertyPath;
    }

    var oTarget;

    if (isPathExpression(propertyPath) || isAnnotationPathExpression(propertyPath)) {
      oTarget = propertyPath.$target;
    } else if (dataModelObjectPath.targetEntityType) {
      oTarget = dataModelObjectPath.targetEntityType.resolvePath(sPropertyPath);
    } else {
      oTarget = dataModelObjectPath.targetObject;
    }

    var aPathSplit = sPropertyPath.split("/");
    var currentEntitySet = dataModelObjectPath.targetEntitySet;
    var currentEntityType = dataModelObjectPath.targetEntityType;
    var navigationProperties = dataModelObjectPath.navigationProperties.concat(); // Process only if we have to go through navigation properties

    aPathSplit.reduce(function (reducedEntityType, pathPart) {
      if (!reducedEntityType) {
        return undefined;
      }

      var potentialNavProp = reducedEntityType.navigationProperties.find(function (navProp) {
        return navProp.name === pathPart;
      });

      if (potentialNavProp) {
        navigationProperties.push(potentialNavProp);
        currentEntityType = potentialNavProp.targetType;

        if (currentEntitySet && currentEntitySet.navigationPropertyBinding.hasOwnProperty(pathPart)) {
          currentEntitySet = currentEntitySet.navigationPropertyBinding[pathPart];
        }

        return currentEntityType;
      }

      return undefined;
    }, dataModelObjectPath.targetEntityType);
    return {
      startingEntitySet: dataModelObjectPath.startingEntitySet,
      navigationProperties: navigationProperties,
      contextLocation: dataModelObjectPath.contextLocation,
      targetEntitySet: currentEntitySet,
      targetEntityType: currentEntityType,
      targetObject: oTarget
    };
  };

  _exports.enhanceDataModelPath = enhanceDataModelPath;

  var getTargetEntitySetPath = function (dataModelObjectPath) {
    var _dataModelObjectPath$;

    var bRelative = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var targetEntitySetPath = "";

    if (!bRelative) {
      targetEntitySetPath += "/".concat(dataModelObjectPath.startingEntitySet.name);
    }

    var currentEntitySet = bRelative && (_dataModelObjectPath$ = dataModelObjectPath.contextLocation) !== null && _dataModelObjectPath$ !== void 0 && _dataModelObjectPath$.targetEntitySet ? dataModelObjectPath.contextLocation.targetEntitySet : dataModelObjectPath.startingEntitySet;
    var navigatedPaths = [];
    dataModelObjectPath.navigationProperties.forEach(function (navProp) {
      var _dataModelObjectPath$2;

      if (!bRelative || !dataModelObjectPath.contextLocation || !((_dataModelObjectPath$2 = dataModelObjectPath.contextLocation) !== null && _dataModelObjectPath$2 !== void 0 && _dataModelObjectPath$2.navigationProperties.some(function (contextNavProp) {
        return contextNavProp.fullyQualifiedName === navProp.fullyQualifiedName;
      }))) {
        // in case of relative entitySetPath we don't consider navigationPath that are already in the context
        navigatedPaths.push(navProp.name);
      }

      if (currentEntitySet && currentEntitySet.navigationPropertyBinding.hasOwnProperty(navigatedPaths.join("/"))) {
        if (bRelative) {
          targetEntitySetPath += "".concat(navigatedPaths.join("/"));
        } else {
          targetEntitySetPath += "/$NavigationPropertyBinding/".concat(navigatedPaths.join("/"), "/$");
        }

        currentEntitySet = currentEntitySet.navigationPropertyBinding[navigatedPaths.join("/")];
        navigatedPaths = [];
      }
    });
    return targetEntitySetPath;
  };

  _exports.getTargetEntitySetPath = getTargetEntitySetPath;

  var getTargetEntitySetNavigation = function (dataModelObjectPath) {
    var visitedNavigationProperties = [];
    var currentEntitySet = dataModelObjectPath.startingEntitySet;
    var navigatedPaths = [];
    dataModelObjectPath.navigationProperties.forEach(function (navProp) {
      navigatedPaths.push(navProp.name);

      if (currentEntitySet && currentEntitySet.navigationPropertyBinding.hasOwnProperty(navigatedPaths.join("/"))) {
        visitedNavigationProperties.push(navProp);
        currentEntitySet = currentEntitySet.navigationPropertyBinding[navigatedPaths.join("/")];
        navigatedPaths = [];
      }
    });
    return visitedNavigationProperties;
  };

  _exports.getTargetEntitySetNavigation = getTargetEntitySetNavigation;

  var getTargetObjectPath = function (dataModelObjectPath) {
    var bRelative = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var path = "";

    if (!dataModelObjectPath.startingEntitySet) {
      return "/";
    }

    if (!bRelative) {
      path += "/".concat(dataModelObjectPath.startingEntitySet.name);
    }

    if (dataModelObjectPath.navigationProperties.length > 0) {
      if (path.length > 0) {
        path += "/";
      }

      path += dataModelObjectPath.navigationProperties.map(function (navProp) {
        return navProp.name;
      }).join("/");
    }

    if (dataModelObjectPath.targetObject && dataModelObjectPath.targetObject.name && dataModelObjectPath.targetObject._type !== "NavigationProperty" && dataModelObjectPath.targetObject._type !== "EntityType" && dataModelObjectPath.targetObject !== dataModelObjectPath.startingEntitySet) {
      if (!path.endsWith("/")) {
        path += "/";
      }

      path += "".concat(dataModelObjectPath.targetObject.name);
    } else if (dataModelObjectPath.targetObject && dataModelObjectPath.targetObject.hasOwnProperty("term")) {
      if (path.length > 0 && !path.endsWith("/")) {
        path += "/";
      }

      path += "@".concat(dataModelObjectPath.targetObject.term);
    }

    return path;
  };

  _exports.getTargetObjectPath = getTargetObjectPath;

  var getContextRelativeTargetObjectPath = function (dataModelObjectPath) {
    var forBindingExpression = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var navProperties = getPathRelativeLocation(dataModelObjectPath.contextLocation, dataModelObjectPath.navigationProperties);

    if (forBindingExpression) {
      if (navProperties.find(function (np) {
        return np.isCollection;
      })) {
        return undefined;
      }
    }

    var path = navProperties.map(function (np) {
      return np.name;
    }).join("/");

    if (dataModelObjectPath.targetObject && (dataModelObjectPath.targetObject.name || dataModelObjectPath.targetObject.type === "PropertyPath" && dataModelObjectPath.targetObject.value) && dataModelObjectPath.targetObject._type !== "NavigationProperty" && dataModelObjectPath.targetObject !== dataModelObjectPath.startingEntitySet) {
      if (path.length > 0 && !path.endsWith("/")) {
        path += "/";
      }

      path += dataModelObjectPath.targetObject.type === "PropertyPath" ? "".concat(dataModelObjectPath.targetObject.value) : "".concat(dataModelObjectPath.targetObject.name);
    } else if (dataModelObjectPath.targetObject && dataModelObjectPath.targetObject.hasOwnProperty("term")) {
      if (path.length > 0 && !path.endsWith("/")) {
        path += "/";
      }

      path += "@".concat(dataModelObjectPath.targetObject.term);

      if (dataModelObjectPath.targetObject.hasOwnProperty("qualifier") && !!dataModelObjectPath.targetObject.qualifier) {
        path += "#".concat(dataModelObjectPath.targetObject.qualifier);
      }
    } else if (!dataModelObjectPath.targetObject) {
      return undefined;
    }

    return path;
  };

  _exports.getContextRelativeTargetObjectPath = getContextRelativeTargetObjectPath;

  var isPathUpdatable = function (dataModelObjectPath, propertyPath, bTableCase) {
    return checkOnPath(dataModelObjectPath, function (annotationObject) {
      var _annotationObject$Upd;

      return annotationObject === null || annotationObject === void 0 ? void 0 : (_annotationObject$Upd = annotationObject.UpdateRestrictions) === null || _annotationObject$Upd === void 0 ? void 0 : _annotationObject$Upd.Updatable;
    }, propertyPath, bTableCase);
  };

  _exports.isPathUpdatable = isPathUpdatable;

  var isPathSearchable = function (dataModelObjectPath, propertyPath, bTableCase) {
    return checkOnPath(dataModelObjectPath, function (annotationObject) {
      var _annotationObject$Sea;

      return annotationObject === null || annotationObject === void 0 ? void 0 : (_annotationObject$Sea = annotationObject.SearchRestrictions) === null || _annotationObject$Sea === void 0 ? void 0 : _annotationObject$Sea.Searchable;
    }, propertyPath, bTableCase);
  };

  _exports.isPathSearchable = isPathSearchable;

  var isPathDeletable = function (dataModelObjectPath, propertyPath, bTableCase) {
    return checkOnPath(dataModelObjectPath, function (annotationObject) {
      var _annotationObject$Del;

      return annotationObject === null || annotationObject === void 0 ? void 0 : (_annotationObject$Del = annotationObject.DeleteRestrictions) === null || _annotationObject$Del === void 0 ? void 0 : _annotationObject$Del.Deletable;
    }, propertyPath, bTableCase);
  };

  _exports.isPathDeletable = isPathDeletable;

  var isPathInsertable = function (dataModelObjectPath, propertyPath) {
    return checkOnPath(dataModelObjectPath, function (annotationObject) {
      var _annotationObject$Ins;

      return annotationObject === null || annotationObject === void 0 ? void 0 : (_annotationObject$Ins = annotationObject.InsertRestrictions) === null || _annotationObject$Ins === void 0 ? void 0 : _annotationObject$Ins.Insertable;
    }, propertyPath);
  };

  _exports.isPathInsertable = isPathInsertable;

  var checkFilterExpressionRestrictions = function (dataModelObjectPath, allowedExpression) {
    return checkOnPath(dataModelObjectPath, function (annotationObject) {
      if (annotationObject && "FilterRestrictions" in annotationObject) {
        var _annotationObject$Fil;

        var filterExpressionRestrictions = (annotationObject === null || annotationObject === void 0 ? void 0 : (_annotationObject$Fil = annotationObject.FilterRestrictions) === null || _annotationObject$Fil === void 0 ? void 0 : _annotationObject$Fil.FilterExpressionRestrictions) || [];
        var currentObjectRestriction = filterExpressionRestrictions.find(function (restriction) {
          return restriction.Property.$target === dataModelObjectPath.targetObject;
        });

        if (currentObjectRestriction) {
          var _currentObjectRestric;

          return allowedExpression.indexOf(currentObjectRestriction === null || currentObjectRestriction === void 0 ? void 0 : (_currentObjectRestric = currentObjectRestriction.AllowedExpressions) === null || _currentObjectRestric === void 0 ? void 0 : _currentObjectRestric.toString()) !== -1;
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
  };

  _exports.checkFilterExpressionRestrictions = checkFilterExpressionRestrictions;

  var checkOnPath = function (dataModelObjectPath, checkFunction, propertyPath, bTableCase) {
    var _targetEntitySet, _targetEntitySet$anno, _restrictionDefinitio;

    if (!dataModelObjectPath || !dataModelObjectPath.startingEntitySet) {
      return constant(true);
    }

    dataModelObjectPath = enhanceDataModelPath(dataModelObjectPath, propertyPath);
    var currentEntitySet = dataModelObjectPath.startingEntitySet;
    var parentEntitySet = null;
    var visitedNavigationPropsName = [];
    var allVisitedNavigationProps = [];
    var targetEntitySet = currentEntitySet;
    var targetEntityType = dataModelObjectPath.targetEntityType;
    var resetVisitedNavProps = false;
    dataModelObjectPath.navigationProperties.forEach(function (navigationProperty) {
      if (resetVisitedNavProps) {
        visitedNavigationPropsName = [];
      }

      visitedNavigationPropsName.push(navigationProperty.name);
      allVisitedNavigationProps.push(navigationProperty);

      if (!navigationProperty.containsTarget) {
        // We should have a navigationPropertyBinding associated with the path so far which can consist of ([ContainmentNavProp]/)*[NavProp]
        var _fullNavigationPath = visitedNavigationPropsName.join("/");

        if (currentEntitySet && currentEntitySet.navigationPropertyBinding.hasOwnProperty(_fullNavigationPath)) {
          parentEntitySet = currentEntitySet;
          currentEntitySet = currentEntitySet.navigationPropertyBinding[_fullNavigationPath];
          targetEntitySet = currentEntitySet; // If we reached a navigation property with a navigationpropertybinding, we need to reset the visited path on the next iteration (if there is one)

          resetVisitedNavProps = true;
        } else {
          // We really should not end up here but at least let's try to avoid incorrect behavior
          parentEntitySet = currentEntitySet;
          currentEntitySet = null;
          resetVisitedNavProps = true;
        }
      } else {
        parentEntitySet = currentEntitySet;
        targetEntitySet = null;
      }
    }); // At this point we have navigated down all the nav prop and we should have
    // The target entityset pointing to either null (in case of containment navprop a last part), or the actual target (non containment as target)
    // The parent entitySet pointing to the previous entityset used in the path
    // VisitedNavigationPath should contain the path up to this property
    // Restrictions should then be evaluated as ParentEntitySet.NavRestrictions[NavpropertyPath] || TargetEntitySet.Restrictions

    var fullNavigationPath = visitedNavigationPropsName.join("/");
    var restrictions, visitedNavProps;

    if (parentEntitySet !== null) {
      var _parentEntitySet$anno, _parentEntitySet$anno2, _parentEntitySet$anno3;

      var _parentEntitySet = parentEntitySet;
      (_parentEntitySet$anno = _parentEntitySet.annotations) === null || _parentEntitySet$anno === void 0 ? void 0 : (_parentEntitySet$anno2 = _parentEntitySet$anno.Capabilities) === null || _parentEntitySet$anno2 === void 0 ? void 0 : (_parentEntitySet$anno3 = _parentEntitySet$anno2.NavigationRestrictions) === null || _parentEntitySet$anno3 === void 0 ? void 0 : _parentEntitySet$anno3.RestrictedProperties.forEach(function (restrictedNavProp) {
        var _restrictedNavProp$Na;

        if (((_restrictedNavProp$Na = restrictedNavProp.NavigationProperty) === null || _restrictedNavProp$Na === void 0 ? void 0 : _restrictedNavProp$Na.type) === "NavigationPropertyPath") {
          var _restrictionDefinition = checkFunction(restrictedNavProp);

          if (fullNavigationPath === restrictedNavProp.NavigationProperty.value && _restrictionDefinition !== undefined) {
            var _dataModelObjectPath;

            var _allVisitedNavigationProps = allVisitedNavigationProps.slice(0, -1);

            if (targetEntitySet !== null) {
              visitedNavProps = _allVisitedNavigationProps;
            } else {
              if (_allVisitedNavigationProps.length === 0) {
                visitedNavProps = allVisitedNavigationProps.slice(0);
              } else {
                visitedNavProps = _allVisitedNavigationProps;
              }
            }

            restrictions = equal(annotationExpression(_restrictionDefinition, getPathRelativeLocation((_dataModelObjectPath = dataModelObjectPath) === null || _dataModelObjectPath === void 0 ? void 0 : _dataModelObjectPath.contextLocation, visitedNavProps).map(function (np) {
              return np.name;
            })), true);
          }
        }
      });
    }

    var targetRestrictions;
    var restrictionDefinition = checkFunction((_targetEntitySet = targetEntitySet) === null || _targetEntitySet === void 0 ? void 0 : (_targetEntitySet$anno = _targetEntitySet.annotations) === null || _targetEntitySet$anno === void 0 ? void 0 : _targetEntitySet$anno.Capabilities);

    if (targetEntitySet === null && restrictionDefinition === undefined) {
      var _targetEntityType$ann;

      restrictionDefinition = checkFunction(targetEntityType === null || targetEntityType === void 0 ? void 0 : (_targetEntityType$ann = targetEntityType.annotations) === null || _targetEntityType$ann === void 0 ? void 0 : _targetEntityType$ann.Capabilities);
    }

    if (restrictionDefinition !== undefined) {
      targetRestrictions = equal(annotationExpression(restrictionDefinition, getPathRelativeLocation(dataModelObjectPath.contextLocation, allVisitedNavigationProps).map(function (np) {
        return np.name;
      })), true);
    } //object page table case in path based scenario's fallback to exisiting approach


    if (bTableCase && !restrictions && (_restrictionDefinitio = restrictionDefinition) !== null && _restrictionDefinitio !== void 0 && _restrictionDefinitio.path) {
      var oResult = {
        "currentEntityRestriction": targetRestrictions
      };
      return oResult;
    }

    return restrictions || targetRestrictions || constant(true);
  };

  _exports.checkOnPath = checkOnPath;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRhdGFNb2RlbFBhdGhIZWxwZXIudHMiXSwibmFtZXMiOlsiZ2V0UGF0aFJlbGF0aXZlTG9jYXRpb24iLCJjb250ZXh0UGF0aCIsInZpc2l0ZWROYXZQcm9wcyIsImxlbmd0aCIsIm5hdmlnYXRpb25Qcm9wZXJ0aWVzIiwicmVtYWluaW5nTmF2UHJvcHMiLCJmb3JFYWNoIiwibmF2UHJvcCIsIm5hdkluZGV4IiwicHVzaCIsImNvbmNhdCIsInNsaWNlIiwiY3VycmVudElkeCIsImN1cnJlbnROYXYiLCJuZXh0TmF2UHJvcCIsInBhcnRuZXIiLCJuYW1lIiwic3BsaWNlIiwiZXh0cmFOYXZQcm9wIiwibWFwIiwidGFyZ2V0VHlwZSIsImZpbmQiLCJucCIsImVuaGFuY2VEYXRhTW9kZWxQYXRoIiwiZGF0YU1vZGVsT2JqZWN0UGF0aCIsInByb3BlcnR5UGF0aCIsInNQcm9wZXJ0eVBhdGgiLCJpc1BhdGhFeHByZXNzaW9uIiwiaXNBbm5vdGF0aW9uUGF0aEV4cHJlc3Npb24iLCJwYXRoIiwib1RhcmdldCIsIiR0YXJnZXQiLCJ0YXJnZXRFbnRpdHlUeXBlIiwicmVzb2x2ZVBhdGgiLCJ0YXJnZXRPYmplY3QiLCJhUGF0aFNwbGl0Iiwic3BsaXQiLCJjdXJyZW50RW50aXR5U2V0IiwidGFyZ2V0RW50aXR5U2V0IiwiY3VycmVudEVudGl0eVR5cGUiLCJyZWR1Y2UiLCJyZWR1Y2VkRW50aXR5VHlwZSIsInBhdGhQYXJ0IiwidW5kZWZpbmVkIiwicG90ZW50aWFsTmF2UHJvcCIsIm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmciLCJoYXNPd25Qcm9wZXJ0eSIsInN0YXJ0aW5nRW50aXR5U2V0IiwiY29udGV4dExvY2F0aW9uIiwiZ2V0VGFyZ2V0RW50aXR5U2V0UGF0aCIsImJSZWxhdGl2ZSIsInRhcmdldEVudGl0eVNldFBhdGgiLCJuYXZpZ2F0ZWRQYXRocyIsInNvbWUiLCJjb250ZXh0TmF2UHJvcCIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsImpvaW4iLCJnZXRUYXJnZXRFbnRpdHlTZXROYXZpZ2F0aW9uIiwidmlzaXRlZE5hdmlnYXRpb25Qcm9wZXJ0aWVzIiwiZ2V0VGFyZ2V0T2JqZWN0UGF0aCIsIl90eXBlIiwiZW5kc1dpdGgiLCJ0ZXJtIiwiZ2V0Q29udGV4dFJlbGF0aXZlVGFyZ2V0T2JqZWN0UGF0aCIsImZvckJpbmRpbmdFeHByZXNzaW9uIiwibmF2UHJvcGVydGllcyIsImlzQ29sbGVjdGlvbiIsInR5cGUiLCJ2YWx1ZSIsInF1YWxpZmllciIsImlzUGF0aFVwZGF0YWJsZSIsImJUYWJsZUNhc2UiLCJjaGVja09uUGF0aCIsImFubm90YXRpb25PYmplY3QiLCJVcGRhdGVSZXN0cmljdGlvbnMiLCJVcGRhdGFibGUiLCJpc1BhdGhTZWFyY2hhYmxlIiwiU2VhcmNoUmVzdHJpY3Rpb25zIiwiU2VhcmNoYWJsZSIsImlzUGF0aERlbGV0YWJsZSIsIkRlbGV0ZVJlc3RyaWN0aW9ucyIsIkRlbGV0YWJsZSIsImlzUGF0aEluc2VydGFibGUiLCJJbnNlcnRSZXN0cmljdGlvbnMiLCJJbnNlcnRhYmxlIiwiY2hlY2tGaWx0ZXJFeHByZXNzaW9uUmVzdHJpY3Rpb25zIiwiYWxsb3dlZEV4cHJlc3Npb24iLCJmaWx0ZXJFeHByZXNzaW9uUmVzdHJpY3Rpb25zIiwiRmlsdGVyUmVzdHJpY3Rpb25zIiwiRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucyIsImN1cnJlbnRPYmplY3RSZXN0cmljdGlvbiIsInJlc3RyaWN0aW9uIiwiUHJvcGVydHkiLCJpbmRleE9mIiwiQWxsb3dlZEV4cHJlc3Npb25zIiwidG9TdHJpbmciLCJjaGVja0Z1bmN0aW9uIiwiY29uc3RhbnQiLCJwYXJlbnRFbnRpdHlTZXQiLCJ2aXNpdGVkTmF2aWdhdGlvblByb3BzTmFtZSIsImFsbFZpc2l0ZWROYXZpZ2F0aW9uUHJvcHMiLCJyZXNldFZpc2l0ZWROYXZQcm9wcyIsIm5hdmlnYXRpb25Qcm9wZXJ0eSIsImNvbnRhaW5zVGFyZ2V0IiwiZnVsbE5hdmlnYXRpb25QYXRoIiwicmVzdHJpY3Rpb25zIiwiX3BhcmVudEVudGl0eVNldCIsImFubm90YXRpb25zIiwiQ2FwYWJpbGl0aWVzIiwiTmF2aWdhdGlvblJlc3RyaWN0aW9ucyIsIlJlc3RyaWN0ZWRQcm9wZXJ0aWVzIiwicmVzdHJpY3RlZE5hdlByb3AiLCJOYXZpZ2F0aW9uUHJvcGVydHkiLCJyZXN0cmljdGlvbkRlZmluaXRpb24iLCJfYWxsVmlzaXRlZE5hdmlnYXRpb25Qcm9wcyIsImVxdWFsIiwiYW5ub3RhdGlvbkV4cHJlc3Npb24iLCJ0YXJnZXRSZXN0cmljdGlvbnMiLCJvUmVzdWx0Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQXNCTyxNQUFNQSx1QkFBdUIsR0FBRyxVQUN0Q0MsV0FEc0MsRUFHZjtBQUFBLFFBRHZCQyxlQUN1Qix1RUFEaUIsRUFDakI7O0FBQ3ZCLFFBQUksQ0FBQ0QsV0FBTCxFQUFrQjtBQUNqQixhQUFPQyxlQUFQO0FBQ0EsS0FGRCxNQUVPO0FBQ04sVUFBSUEsZUFBZSxDQUFDQyxNQUFoQixJQUEwQkYsV0FBVyxDQUFDRyxvQkFBWixDQUFpQ0QsTUFBL0QsRUFBdUU7QUFDdEUsWUFBSUUsaUJBQXVDLEdBQUcsRUFBOUM7QUFDQUosUUFBQUEsV0FBVyxDQUFDRyxvQkFBWixDQUFpQ0UsT0FBakMsQ0FBeUMsVUFBQ0MsT0FBRCxFQUFVQyxRQUFWLEVBQXVCO0FBQy9ELGNBQUlOLGVBQWUsQ0FBQ00sUUFBRCxDQUFmLEtBQThCRCxPQUFsQyxFQUEyQztBQUMxQ0YsWUFBQUEsaUJBQWlCLENBQUNJLElBQWxCLENBQXVCUCxlQUFlLENBQUNNLFFBQUQsQ0FBdEM7QUFDQTtBQUNELFNBSkQ7QUFLQUgsUUFBQUEsaUJBQWlCLEdBQUdBLGlCQUFpQixDQUFDSyxNQUFsQixDQUF5QlIsZUFBZSxDQUFDUyxLQUFoQixDQUFzQlYsV0FBVyxDQUFDRyxvQkFBWixDQUFpQ0QsTUFBdkQsQ0FBekIsQ0FBcEIsQ0FQc0UsQ0FRdEU7O0FBQ0EsWUFBSVMsVUFBVSxHQUFHLENBQWpCOztBQUNB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OztBQUNELFdBQU9iLFlBQVksSUFBSVksa0JBQWhCLElBQXNDcEIsUUFBUSxDQUFDLElBQUQsQ0FBckQ7QUFDQSxHQXpHTSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRW50aXR5U2V0LCBFbnRpdHlUeXBlLCBOYXZpZ2F0aW9uUHJvcGVydHksIFByb3BlcnR5IH0gZnJvbSBcIkBzYXAtdXgvYW5ub3RhdGlvbi1jb252ZXJ0ZXJcIjtcbmltcG9ydCB7IGFubm90YXRpb25FeHByZXNzaW9uLCBjb25zdGFudCwgZXF1YWwsIEV4cHJlc3Npb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nRXhwcmVzc2lvblwiO1xuaW1wb3J0IHsgTmF2aWdhdGlvblByb3BlcnR5UmVzdHJpY3Rpb25UeXBlcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy9kaXN0L2dlbmVyYXRlZC9DYXBhYmlsaXRpZXNcIjtcbmltcG9ydCB7IFByb3BlcnR5T3JQYXRoIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvVUlGb3JtYXR0ZXJzXCI7XG5pbXBvcnQgeyBpc0Fubm90YXRpb25QYXRoRXhwcmVzc2lvbiwgaXNQYXRoRXhwcmVzc2lvbiB9IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL1Byb3BlcnR5SGVscGVyXCI7XG5pbXBvcnQge1xuXHRGaWx0ZXJFeHByZXNzaW9uUmVzdHJpY3Rpb25UeXBlVHlwZXMsXG5cdE5hdmlnYXRpb25Qcm9wZXJ0eVJlc3RyaWN0aW9uXG59IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy90eXBlcy9nZW5lcmF0ZWQvQ2FwYWJpbGl0aWVzXCI7XG5pbXBvcnQge1xuXHRFbnRpdHlTZXRBbm5vdGF0aW9uc19DYXBhYmlsaXRpZXMsXG5cdEVudGl0eVR5cGVBbm5vdGF0aW9uc19DYXBhYmlsaXRpZXNcbn0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzL2Rpc3QvZ2VuZXJhdGVkL0NhcGFiaWxpdGllc19FZG1cIjtcbmltcG9ydCB7IFByb3BlcnR5UGF0aCB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuXG5leHBvcnQgdHlwZSBEYXRhTW9kZWxPYmplY3RQYXRoID0ge1xuXHRzdGFydGluZ0VudGl0eVNldDogRW50aXR5U2V0O1xuXHRjb250ZXh0TG9jYXRpb24/OiBEYXRhTW9kZWxPYmplY3RQYXRoO1xuXHRuYXZpZ2F0aW9uUHJvcGVydGllczogTmF2aWdhdGlvblByb3BlcnR5W107XG5cdHRhcmdldEVudGl0eVNldD86IEVudGl0eVNldDtcblx0dGFyZ2V0RW50aXR5VHlwZTogRW50aXR5VHlwZTtcblx0dGFyZ2V0T2JqZWN0OiBhbnk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0UGF0aFJlbGF0aXZlTG9jYXRpb24gPSBmdW5jdGlvbihcblx0Y29udGV4dFBhdGg/OiBEYXRhTW9kZWxPYmplY3RQYXRoLFxuXHR2aXNpdGVkTmF2UHJvcHM6IE5hdmlnYXRpb25Qcm9wZXJ0eVtdID0gW11cbik6IE5hdmlnYXRpb25Qcm9wZXJ0eVtdIHtcblx0aWYgKCFjb250ZXh0UGF0aCkge1xuXHRcdHJldHVybiB2aXNpdGVkTmF2UHJvcHM7XG5cdH0gZWxzZSB7XG5cdFx0aWYgKHZpc2l0ZWROYXZQcm9wcy5sZW5ndGggPj0gY29udGV4dFBhdGgubmF2aWdhdGlvblByb3BlcnRpZXMubGVuZ3RoKSB7XG5cdFx0XHRsZXQgcmVtYWluaW5nTmF2UHJvcHM6IE5hdmlnYXRpb25Qcm9wZXJ0eVtdID0gW107XG5cdFx0XHRjb250ZXh0UGF0aC5uYXZpZ2F0aW9uUHJvcGVydGllcy5mb3JFYWNoKChuYXZQcm9wLCBuYXZJbmRleCkgPT4ge1xuXHRcdFx0XHRpZiAodmlzaXRlZE5hdlByb3BzW25hdkluZGV4XSAhPT0gbmF2UHJvcCkge1xuXHRcdFx0XHRcdHJlbWFpbmluZ05hdlByb3BzLnB1c2godmlzaXRlZE5hdlByb3BzW25hdkluZGV4XSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmVtYWluaW5nTmF2UHJvcHMgPSByZW1haW5pbmdOYXZQcm9wcy5jb25jYXQodmlzaXRlZE5hdlByb3BzLnNsaWNlKGNvbnRleHRQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzLmxlbmd0aCkpO1xuXHRcdFx0Ly8gQ2xlYW4gdXAgTmF2UHJvcCAtPiBPd25lclxuXHRcdFx0bGV0IGN1cnJlbnRJZHggPSAwO1xuXHRcdFx0d2hpbGUgKHJlbWFpbmluZ05hdlByb3BzLmxlbmd0aCA+IDEgJiYgY3VycmVudElkeCAhPSByZW1haW5pbmdOYXZQcm9wcy5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdGNvbnN0IGN1cnJlbnROYXYgPSByZW1haW5pbmdOYXZQcm9wc1tjdXJyZW50SWR4XTtcblx0XHRcdFx0Y29uc3QgbmV4dE5hdlByb3AgPSByZW1haW5pbmdOYXZQcm9wc1tjdXJyZW50SWR4ICsgMV07XG5cdFx0XHRcdGlmIChjdXJyZW50TmF2LnBhcnRuZXIgPT09IG5leHROYXZQcm9wLm5hbWUpIHtcblx0XHRcdFx0XHRyZW1haW5pbmdOYXZQcm9wcy5zcGxpY2UoMCwgMik7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y3VycmVudElkeCsrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVtYWluaW5nTmF2UHJvcHM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxldCBleHRyYU5hdlByb3A6IE5hdmlnYXRpb25Qcm9wZXJ0eVtdID0gW107XG5cdFx0XHR2aXNpdGVkTmF2UHJvcHMuZm9yRWFjaCgobmF2UHJvcCwgbmF2SW5kZXgpID0+IHtcblx0XHRcdFx0aWYgKGNvbnRleHRQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzW25hdkluZGV4XSAhPT0gbmF2UHJvcCkge1xuXHRcdFx0XHRcdGV4dHJhTmF2UHJvcC5wdXNoKHZpc2l0ZWROYXZQcm9wc1tuYXZJbmRleF0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGV4dHJhTmF2UHJvcCA9IGV4dHJhTmF2UHJvcC5jb25jYXQoY29udGV4dFBhdGgubmF2aWdhdGlvblByb3BlcnRpZXMuc2xpY2UodmlzaXRlZE5hdlByb3BzLmxlbmd0aCkpO1xuXHRcdFx0Ly8gQ2xlYW4gdXAgTmF2UHJvcCAtPiBPd25lclxuXHRcdFx0bGV0IGN1cnJlbnRJZHggPSAwO1xuXHRcdFx0d2hpbGUgKGV4dHJhTmF2UHJvcC5sZW5ndGggPiAxICYmIGN1cnJlbnRJZHggIT0gZXh0cmFOYXZQcm9wLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0Y29uc3QgY3VycmVudE5hdiA9IGV4dHJhTmF2UHJvcFtjdXJyZW50SWR4XTtcblx0XHRcdFx0Y29uc3QgbmV4dE5hdlByb3AgPSBleHRyYU5hdlByb3BbY3VycmVudElkeCArIDFdO1xuXHRcdFx0XHRpZiAoY3VycmVudE5hdi5wYXJ0bmVyID09PSBuZXh0TmF2UHJvcC5uYW1lKSB7XG5cdFx0XHRcdFx0ZXh0cmFOYXZQcm9wLnNwbGljZSgwLCAyKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjdXJyZW50SWR4Kys7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGV4dHJhTmF2UHJvcCA9IGV4dHJhTmF2UHJvcC5tYXAobmF2UHJvcCA9PiB7XG5cdFx0XHRcdHJldHVybiBuYXZQcm9wLnRhcmdldFR5cGUubmF2aWdhdGlvblByb3BlcnRpZXMuZmluZChucCA9PiBucC5uYW1lID09PSBuYXZQcm9wLnBhcnRuZXIpIGFzIE5hdmlnYXRpb25Qcm9wZXJ0eTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGV4dHJhTmF2UHJvcDtcblx0XHR9XG5cdH1cbn07XG5cbmV4cG9ydCBjb25zdCBlbmhhbmNlRGF0YU1vZGVsUGF0aCA9IGZ1bmN0aW9uKFxuXHRkYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRwcm9wZXJ0eVBhdGg/OiBQcm9wZXJ0eU9yUGF0aDxQcm9wZXJ0eT5cbik6IERhdGFNb2RlbE9iamVjdFBhdGgge1xuXHRsZXQgc1Byb3BlcnR5UGF0aDogc3RyaW5nID0gXCJcIjtcblx0aWYgKChpc1BhdGhFeHByZXNzaW9uKHByb3BlcnR5UGF0aCkgfHwgaXNBbm5vdGF0aW9uUGF0aEV4cHJlc3Npb24ocHJvcGVydHlQYXRoKSkgJiYgcHJvcGVydHlQYXRoLnBhdGgpIHtcblx0XHRzUHJvcGVydHlQYXRoID0gcHJvcGVydHlQYXRoLnBhdGg7XG5cdH0gZWxzZSBpZiAodHlwZW9mIHByb3BlcnR5UGF0aCA9PT0gXCJzdHJpbmdcIikge1xuXHRcdHNQcm9wZXJ0eVBhdGggPSBwcm9wZXJ0eVBhdGggYXMgc3RyaW5nO1xuXHR9XG5cdGxldCBvVGFyZ2V0O1xuXHRpZiAoaXNQYXRoRXhwcmVzc2lvbihwcm9wZXJ0eVBhdGgpIHx8IGlzQW5ub3RhdGlvblBhdGhFeHByZXNzaW9uKHByb3BlcnR5UGF0aCkpIHtcblx0XHRvVGFyZ2V0ID0gcHJvcGVydHlQYXRoLiR0YXJnZXQ7XG5cdH0gZWxzZSBpZiAoZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRFbnRpdHlUeXBlKSB7XG5cdFx0b1RhcmdldCA9IGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0RW50aXR5VHlwZS5yZXNvbHZlUGF0aChzUHJvcGVydHlQYXRoKTtcblx0fSBlbHNlIHtcblx0XHRvVGFyZ2V0ID0gZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3Q7XG5cdH1cblx0Y29uc3QgYVBhdGhTcGxpdCA9IHNQcm9wZXJ0eVBhdGguc3BsaXQoXCIvXCIpO1xuXHRsZXQgY3VycmVudEVudGl0eVNldCA9IGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0RW50aXR5U2V0O1xuXHRsZXQgY3VycmVudEVudGl0eVR5cGUgPSBkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldEVudGl0eVR5cGU7XG5cdGNvbnN0IG5hdmlnYXRpb25Qcm9wZXJ0aWVzID0gZGF0YU1vZGVsT2JqZWN0UGF0aC5uYXZpZ2F0aW9uUHJvcGVydGllcy5jb25jYXQoKTtcblx0Ly8gUHJvY2VzcyBvbmx5IGlmIHdlIGhhdmUgdG8gZ28gdGhyb3VnaCBuYXZpZ2F0aW9uIHByb3BlcnRpZXNcblxuXHRhUGF0aFNwbGl0LnJlZHVjZSgocmVkdWNlZEVudGl0eVR5cGU6IEVudGl0eVR5cGUgfCB1bmRlZmluZWQsIHBhdGhQYXJ0OiBzdHJpbmcpID0+IHtcblx0XHRpZiAoIXJlZHVjZWRFbnRpdHlUeXBlKSB7XG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH1cblx0XHRjb25zdCBwb3RlbnRpYWxOYXZQcm9wID0gcmVkdWNlZEVudGl0eVR5cGUubmF2aWdhdGlvblByb3BlcnRpZXMuZmluZChuYXZQcm9wID0+IG5hdlByb3AubmFtZSA9PT0gcGF0aFBhcnQpO1xuXHRcdGlmIChwb3RlbnRpYWxOYXZQcm9wKSB7XG5cdFx0XHRuYXZpZ2F0aW9uUHJvcGVydGllcy5wdXNoKHBvdGVudGlhbE5hdlByb3ApO1xuXHRcdFx0Y3VycmVudEVudGl0eVR5cGUgPSBwb3RlbnRpYWxOYXZQcm9wLnRhcmdldFR5cGU7XG5cdFx0XHRpZiAoY3VycmVudEVudGl0eVNldCAmJiBjdXJyZW50RW50aXR5U2V0Lm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmcuaGFzT3duUHJvcGVydHkocGF0aFBhcnQpKSB7XG5cdFx0XHRcdGN1cnJlbnRFbnRpdHlTZXQgPSBjdXJyZW50RW50aXR5U2V0Lm5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmdbcGF0aFBhcnRdO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGN1cnJlbnRFbnRpdHlUeXBlO1xuXHRcdH1cblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9LCBkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldEVudGl0eVR5cGUpO1xuXG5cdHJldHVybiB7XG5cdFx0c3RhcnRpbmdFbnRpdHlTZXQ6IGRhdGFNb2RlbE9iamVjdFBhdGguc3RhcnRpbmdFbnRpdHlTZXQsXG5cdFx0bmF2aWdhdGlvblByb3BlcnRpZXM6IG5hdmlnYXRpb25Qcm9wZXJ0aWVzLFxuXHRcdGNvbnRleHRMb2NhdGlvbjogZGF0YU1vZGVsT2JqZWN0UGF0aC5jb250ZXh0TG9jYXRpb24sXG5cdFx0dGFyZ2V0RW50aXR5U2V0OiBjdXJyZW50RW50aXR5U2V0LFxuXHRcdHRhcmdldEVudGl0eVR5cGU6IGN1cnJlbnRFbnRpdHlUeXBlLFxuXHRcdHRhcmdldE9iamVjdDogb1RhcmdldFxuXHR9O1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFRhcmdldEVudGl0eVNldFBhdGggPSBmdW5jdGlvbihkYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoLCBiUmVsYXRpdmU6IGJvb2xlYW4gPSBmYWxzZSk6IHN0cmluZyB7XG5cdGxldCB0YXJnZXRFbnRpdHlTZXRQYXRoOiBzdHJpbmcgPSBcIlwiO1xuXHRpZiAoIWJSZWxhdGl2ZSkge1xuXHRcdHRhcmdldEVudGl0eVNldFBhdGggKz0gYC8ke2RhdGFNb2RlbE9iamVjdFBhdGguc3RhcnRpbmdFbnRpdHlTZXQubmFtZX1gO1xuXHR9XG5cdGxldCBjdXJyZW50RW50aXR5U2V0ID1cblx0XHRiUmVsYXRpdmUgJiYgZGF0YU1vZGVsT2JqZWN0UGF0aC5jb250ZXh0TG9jYXRpb24/LnRhcmdldEVudGl0eVNldFxuXHRcdFx0PyBkYXRhTW9kZWxPYmplY3RQYXRoLmNvbnRleHRMb2NhdGlvbi50YXJnZXRFbnRpdHlTZXRcblx0XHRcdDogZGF0YU1vZGVsT2JqZWN0UGF0aC5zdGFydGluZ0VudGl0eVNldDtcblx0bGV0IG5hdmlnYXRlZFBhdGhzOiBzdHJpbmdbXSA9IFtdO1xuXHRkYXRhTW9kZWxPYmplY3RQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzLmZvckVhY2gobmF2UHJvcCA9PiB7XG5cdFx0aWYgKFxuXHRcdFx0IWJSZWxhdGl2ZSB8fFxuXHRcdFx0IWRhdGFNb2RlbE9iamVjdFBhdGguY29udGV4dExvY2F0aW9uIHx8XG5cdFx0XHRcdCFkYXRhTW9kZWxPYmplY3RQYXRoLmNvbnRleHRMb2NhdGlvbj8ubmF2aWdhdGlvblByb3BlcnRpZXMuc29tZShcblx0XHRcdFx0XHRjb250ZXh0TmF2UHJvcCA9PiBjb250ZXh0TmF2UHJvcC5mdWxseVF1YWxpZmllZE5hbWUgPT09IG5hdlByb3AuZnVsbHlRdWFsaWZpZWROYW1lXG5cdFx0XHRcdClcblx0XHQpIHtcblx0XHRcdC8vIGluIGNhc2Ugb2YgcmVsYXRpdmUgZW50aXR5U2V0UGF0aCB3ZSBkb24ndCBjb25zaWRlciBuYXZpZ2F0aW9uUGF0aCB0aGF0IGFyZSBhbHJlYWR5IGluIHRoZSBjb250ZXh0XG5cdFx0XHRuYXZpZ2F0ZWRQYXRocy5wdXNoKG5hdlByb3AubmFtZSk7XG5cdFx0fVxuXHRcdGlmIChjdXJyZW50RW50aXR5U2V0ICYmIGN1cnJlbnRFbnRpdHlTZXQubmF2aWdhdGlvblByb3BlcnR5QmluZGluZy5oYXNPd25Qcm9wZXJ0eShuYXZpZ2F0ZWRQYXRocy5qb2luKFwiL1wiKSkpIHtcblx0XHRcdGlmIChiUmVsYXRpdmUpIHtcblx0XHRcdFx0dGFyZ2V0RW50aXR5U2V0UGF0aCArPSBgJHtuYXZpZ2F0ZWRQYXRocy5qb2luKFwiL1wiKX1gO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGFyZ2V0RW50aXR5U2V0UGF0aCArPSBgLyROYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nLyR7bmF2aWdhdGVkUGF0aHMuam9pbihcIi9cIil9LyRgO1xuXHRcdFx0fVxuXHRcdFx0Y3VycmVudEVudGl0eVNldCA9IGN1cnJlbnRFbnRpdHlTZXQubmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1tuYXZpZ2F0ZWRQYXRocy5qb2luKFwiL1wiKV07XG5cdFx0XHRuYXZpZ2F0ZWRQYXRocyA9IFtdO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiB0YXJnZXRFbnRpdHlTZXRQYXRoO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFRhcmdldEVudGl0eVNldE5hdmlnYXRpb24gPSBmdW5jdGlvbihkYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoKTogTmF2aWdhdGlvblByb3BlcnR5W10ge1xuXHRjb25zdCB2aXNpdGVkTmF2aWdhdGlvblByb3BlcnRpZXM6IE5hdmlnYXRpb25Qcm9wZXJ0eVtdID0gW107XG5cdGxldCBjdXJyZW50RW50aXR5U2V0ID0gZGF0YU1vZGVsT2JqZWN0UGF0aC5zdGFydGluZ0VudGl0eVNldDtcblx0bGV0IG5hdmlnYXRlZFBhdGhzOiBzdHJpbmdbXSA9IFtdO1xuXHRkYXRhTW9kZWxPYmplY3RQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzLmZvckVhY2gobmF2UHJvcCA9PiB7XG5cdFx0bmF2aWdhdGVkUGF0aHMucHVzaChuYXZQcm9wLm5hbWUpO1xuXHRcdGlmIChjdXJyZW50RW50aXR5U2V0ICYmIGN1cnJlbnRFbnRpdHlTZXQubmF2aWdhdGlvblByb3BlcnR5QmluZGluZy5oYXNPd25Qcm9wZXJ0eShuYXZpZ2F0ZWRQYXRocy5qb2luKFwiL1wiKSkpIHtcblx0XHRcdHZpc2l0ZWROYXZpZ2F0aW9uUHJvcGVydGllcy5wdXNoKG5hdlByb3ApO1xuXHRcdFx0Y3VycmVudEVudGl0eVNldCA9IGN1cnJlbnRFbnRpdHlTZXQubmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1tuYXZpZ2F0ZWRQYXRocy5qb2luKFwiL1wiKV07XG5cdFx0XHRuYXZpZ2F0ZWRQYXRocyA9IFtdO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiB2aXNpdGVkTmF2aWdhdGlvblByb3BlcnRpZXM7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0VGFyZ2V0T2JqZWN0UGF0aCA9IGZ1bmN0aW9uKGRhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsIGJSZWxhdGl2ZTogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHtcblx0bGV0IHBhdGggPSBcIlwiO1xuXHRpZiAoIWRhdGFNb2RlbE9iamVjdFBhdGguc3RhcnRpbmdFbnRpdHlTZXQpIHtcblx0XHRyZXR1cm4gXCIvXCI7XG5cdH1cblx0aWYgKCFiUmVsYXRpdmUpIHtcblx0XHRwYXRoICs9IGAvJHtkYXRhTW9kZWxPYmplY3RQYXRoLnN0YXJ0aW5nRW50aXR5U2V0Lm5hbWV9YDtcblx0fVxuXHRpZiAoZGF0YU1vZGVsT2JqZWN0UGF0aC5uYXZpZ2F0aW9uUHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG5cdFx0aWYgKHBhdGgubGVuZ3RoID4gMCkge1xuXHRcdFx0cGF0aCArPSBcIi9cIjtcblx0XHR9XG5cdFx0cGF0aCArPSBkYXRhTW9kZWxPYmplY3RQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzLm1hcChuYXZQcm9wID0+IG5hdlByb3AubmFtZSkuam9pbihcIi9cIik7XG5cdH1cblxuXHRpZiAoXG5cdFx0ZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QgJiZcblx0XHRkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC5uYW1lICYmXG5cdFx0ZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QuX3R5cGUgIT09IFwiTmF2aWdhdGlvblByb3BlcnR5XCIgJiZcblx0XHRkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC5fdHlwZSAhPT0gXCJFbnRpdHlUeXBlXCIgJiZcblx0XHRkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdCAhPT0gZGF0YU1vZGVsT2JqZWN0UGF0aC5zdGFydGluZ0VudGl0eVNldFxuXHQpIHtcblx0XHRpZiAoIXBhdGguZW5kc1dpdGgoXCIvXCIpKSB7XG5cdFx0XHRwYXRoICs9IFwiL1wiO1xuXHRcdH1cblx0XHRwYXRoICs9IGAke2RhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0Lm5hbWV9YDtcblx0fSBlbHNlIGlmIChkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdCAmJiBkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC5oYXNPd25Qcm9wZXJ0eShcInRlcm1cIikpIHtcblx0XHRpZiAocGF0aC5sZW5ndGggPiAwICYmICFwYXRoLmVuZHNXaXRoKFwiL1wiKSkge1xuXHRcdFx0cGF0aCArPSBcIi9cIjtcblx0XHR9XG5cdFx0cGF0aCArPSBgQCR7ZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QudGVybX1gO1xuXHR9XG5cdHJldHVybiBwYXRoO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldENvbnRleHRSZWxhdGl2ZVRhcmdldE9iamVjdFBhdGggPSBmdW5jdGlvbihcblx0ZGF0YU1vZGVsT2JqZWN0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCxcblx0Zm9yQmluZGluZ0V4cHJlc3Npb246IGJvb2xlYW4gPSBmYWxzZVxuKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0Y29uc3QgbmF2UHJvcGVydGllcyA9IGdldFBhdGhSZWxhdGl2ZUxvY2F0aW9uKGRhdGFNb2RlbE9iamVjdFBhdGguY29udGV4dExvY2F0aW9uLCBkYXRhTW9kZWxPYmplY3RQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzKTtcblx0aWYgKGZvckJpbmRpbmdFeHByZXNzaW9uKSB7XG5cdFx0aWYgKG5hdlByb3BlcnRpZXMuZmluZChucCA9PiBucC5pc0NvbGxlY3Rpb24pKSB7XG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH1cblx0fVxuXHRsZXQgcGF0aCA9IG5hdlByb3BlcnRpZXMubWFwKG5wID0+IG5wLm5hbWUpLmpvaW4oXCIvXCIpO1xuXHRpZiAoXG5cdFx0ZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QgJiZcblx0XHQoZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QubmFtZSB8fFxuXHRcdFx0KGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0LnR5cGUgPT09IFwiUHJvcGVydHlQYXRoXCIgJiYgZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QudmFsdWUpKSAmJlxuXHRcdGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0Ll90eXBlICE9PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiICYmXG5cdFx0ZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QgIT09IGRhdGFNb2RlbE9iamVjdFBhdGguc3RhcnRpbmdFbnRpdHlTZXRcblx0KSB7XG5cdFx0aWYgKHBhdGgubGVuZ3RoID4gMCAmJiAhcGF0aC5lbmRzV2l0aChcIi9cIikpIHtcblx0XHRcdHBhdGggKz0gXCIvXCI7XG5cdFx0fVxuXHRcdHBhdGggKz1cblx0XHRcdGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0LnR5cGUgPT09IFwiUHJvcGVydHlQYXRoXCJcblx0XHRcdFx0PyBgJHtkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC52YWx1ZX1gXG5cdFx0XHRcdDogYCR7ZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QubmFtZX1gO1xuXHR9IGVsc2UgaWYgKGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0ICYmIGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0Lmhhc093blByb3BlcnR5KFwidGVybVwiKSkge1xuXHRcdGlmIChwYXRoLmxlbmd0aCA+IDAgJiYgIXBhdGguZW5kc1dpdGgoXCIvXCIpKSB7XG5cdFx0XHRwYXRoICs9IFwiL1wiO1xuXHRcdH1cblx0XHRwYXRoICs9IGBAJHtkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC50ZXJtfWA7XG5cdFx0aWYgKGRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0Lmhhc093blByb3BlcnR5KFwicXVhbGlmaWVyXCIpICYmICEhZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3QucXVhbGlmaWVyKSB7XG5cdFx0XHRwYXRoICs9IGAjJHtkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldE9iamVjdC5xdWFsaWZpZXJ9YDtcblx0XHR9XG5cdH0gZWxzZSBpZiAoIWRhdGFNb2RlbE9iamVjdFBhdGgudGFyZ2V0T2JqZWN0KSB7XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxuXHRyZXR1cm4gcGF0aDtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1BhdGhVcGRhdGFibGUgPSBmdW5jdGlvbihcblx0ZGF0YU1vZGVsT2JqZWN0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCB8IHVuZGVmaW5lZCxcblx0cHJvcGVydHlQYXRoPzogUHJvcGVydHlPclBhdGg8UHJvcGVydHk+LFxuXHRiVGFibGVDYXNlPzogYm9vbGVhblxuKTogRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdHJldHVybiBjaGVja09uUGF0aChcblx0XHRkYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRcdChhbm5vdGF0aW9uT2JqZWN0OiBOYXZpZ2F0aW9uUHJvcGVydHlSZXN0cmljdGlvbiB8IEVudGl0eVNldEFubm90YXRpb25zX0NhcGFiaWxpdGllcyB8IEVudGl0eVR5cGVBbm5vdGF0aW9uc19DYXBhYmlsaXRpZXMpID0+IHtcblx0XHRcdHJldHVybiBhbm5vdGF0aW9uT2JqZWN0Py5VcGRhdGVSZXN0cmljdGlvbnM/LlVwZGF0YWJsZTtcblx0XHR9LFxuXHRcdHByb3BlcnR5UGF0aCxcblx0XHRiVGFibGVDYXNlXG5cdCk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNQYXRoU2VhcmNoYWJsZSA9IGZ1bmN0aW9uKFxuXHRkYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoIHwgdW5kZWZpbmVkLFxuXHRwcm9wZXJ0eVBhdGg/OiBQcm9wZXJ0eU9yUGF0aDxQcm9wZXJ0eT4sXG5cdGJUYWJsZUNhc2U/OiBib29sZWFuXG4pOiBFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0cmV0dXJuIGNoZWNrT25QYXRoKFxuXHRcdGRhdGFNb2RlbE9iamVjdFBhdGgsXG5cdFx0KGFubm90YXRpb25PYmplY3Q6IE5hdmlnYXRpb25Qcm9wZXJ0eVJlc3RyaWN0aW9uIHwgRW50aXR5U2V0QW5ub3RhdGlvbnNfQ2FwYWJpbGl0aWVzKSA9PiB7XG5cdFx0XHRyZXR1cm4gYW5ub3RhdGlvbk9iamVjdD8uU2VhcmNoUmVzdHJpY3Rpb25zPy5TZWFyY2hhYmxlO1xuXHRcdH0sXG5cdFx0cHJvcGVydHlQYXRoLFxuXHRcdGJUYWJsZUNhc2Vcblx0KTtcbn07XG5cbmV4cG9ydCBjb25zdCBpc1BhdGhEZWxldGFibGUgPSBmdW5jdGlvbihcblx0ZGF0YU1vZGVsT2JqZWN0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCB8IHVuZGVmaW5lZCxcblx0cHJvcGVydHlQYXRoPzogUHJvcGVydHlPclBhdGg8UHJvcGVydHk+LFxuXHRiVGFibGVDYXNlPzogYm9vbGVhblxuKTogRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdHJldHVybiBjaGVja09uUGF0aChcblx0XHRkYXRhTW9kZWxPYmplY3RQYXRoLFxuXHRcdChhbm5vdGF0aW9uT2JqZWN0OiBOYXZpZ2F0aW9uUHJvcGVydHlSZXN0cmljdGlvbiB8IEVudGl0eVNldEFubm90YXRpb25zX0NhcGFiaWxpdGllcyB8IEVudGl0eVR5cGVBbm5vdGF0aW9uc19DYXBhYmlsaXRpZXMpID0+IHtcblx0XHRcdHJldHVybiBhbm5vdGF0aW9uT2JqZWN0Py5EZWxldGVSZXN0cmljdGlvbnM/LkRlbGV0YWJsZTtcblx0XHR9LFxuXHRcdHByb3BlcnR5UGF0aCxcblx0XHRiVGFibGVDYXNlXG5cdCk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNQYXRoSW5zZXJ0YWJsZSA9IGZ1bmN0aW9uKFxuXHRkYXRhTW9kZWxPYmplY3RQYXRoOiBEYXRhTW9kZWxPYmplY3RQYXRoIHwgdW5kZWZpbmVkLFxuXHRwcm9wZXJ0eVBhdGg/OiBQcm9wZXJ0eU9yUGF0aDxQcm9wZXJ0eT5cbik6IEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRyZXR1cm4gY2hlY2tPblBhdGgoXG5cdFx0ZGF0YU1vZGVsT2JqZWN0UGF0aCxcblx0XHQoYW5ub3RhdGlvbk9iamVjdDogTmF2aWdhdGlvblByb3BlcnR5UmVzdHJpY3Rpb24gfCBFbnRpdHlTZXRBbm5vdGF0aW9uc19DYXBhYmlsaXRpZXMgfCBFbnRpdHlUeXBlQW5ub3RhdGlvbnNfQ2FwYWJpbGl0aWVzKSA9PiB7XG5cdFx0XHRyZXR1cm4gYW5ub3RhdGlvbk9iamVjdD8uSW5zZXJ0UmVzdHJpY3Rpb25zPy5JbnNlcnRhYmxlO1xuXHRcdH0sXG5cdFx0cHJvcGVydHlQYXRoXG5cdCk7XG59O1xuXG5leHBvcnQgY29uc3QgY2hlY2tGaWx0ZXJFeHByZXNzaW9uUmVzdHJpY3Rpb25zID0gZnVuY3Rpb24oXG5cdGRhdGFNb2RlbE9iamVjdFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGgsXG5cdGFsbG93ZWRFeHByZXNzaW9uOiAoc3RyaW5nIHwgdW5kZWZpbmVkKVtdXG4pOiBFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0cmV0dXJuIGNoZWNrT25QYXRoKFxuXHRcdGRhdGFNb2RlbE9iamVjdFBhdGgsXG5cdFx0KGFubm90YXRpb25PYmplY3Q6IE5hdmlnYXRpb25Qcm9wZXJ0eVJlc3RyaWN0aW9uIHwgRW50aXR5U2V0QW5ub3RhdGlvbnNfQ2FwYWJpbGl0aWVzIHwgRW50aXR5VHlwZUFubm90YXRpb25zX0NhcGFiaWxpdGllcykgPT4ge1xuXHRcdFx0aWYgKGFubm90YXRpb25PYmplY3QgJiYgXCJGaWx0ZXJSZXN0cmljdGlvbnNcIiBpbiBhbm5vdGF0aW9uT2JqZWN0KSB7XG5cdFx0XHRcdGNvbnN0IGZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvbnM6IEZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvblR5cGVUeXBlc1tdID1cblx0XHRcdFx0XHQoYW5ub3RhdGlvbk9iamVjdD8uRmlsdGVyUmVzdHJpY3Rpb25zPy5GaWx0ZXJFeHByZXNzaW9uUmVzdHJpY3Rpb25zIGFzIEZpbHRlckV4cHJlc3Npb25SZXN0cmljdGlvblR5cGVUeXBlc1tdKSB8fCBbXTtcblx0XHRcdFx0Y29uc3QgY3VycmVudE9iamVjdFJlc3RyaWN0aW9uID0gZmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9ucy5maW5kKHJlc3RyaWN0aW9uID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gKHJlc3RyaWN0aW9uLlByb3BlcnR5IGFzIFByb3BlcnR5UGF0aCkuJHRhcmdldCA9PT0gZGF0YU1vZGVsT2JqZWN0UGF0aC50YXJnZXRPYmplY3Q7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRpZiAoY3VycmVudE9iamVjdFJlc3RyaWN0aW9uKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGFsbG93ZWRFeHByZXNzaW9uLmluZGV4T2YoY3VycmVudE9iamVjdFJlc3RyaWN0aW9uPy5BbGxvd2VkRXhwcmVzc2lvbnM/LnRvU3RyaW5nKCkpICE9PSAtMTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG59O1xuXG5leHBvcnQgY29uc3QgY2hlY2tPblBhdGggPSBmdW5jdGlvbihcblx0ZGF0YU1vZGVsT2JqZWN0UGF0aDogRGF0YU1vZGVsT2JqZWN0UGF0aCB8IHVuZGVmaW5lZCxcblx0Y2hlY2tGdW5jdGlvbjogRnVuY3Rpb24sXG5cdHByb3BlcnR5UGF0aD86IFByb3BlcnR5T3JQYXRoPFByb3BlcnR5Pixcblx0YlRhYmxlQ2FzZT86IGJvb2xlYW5cbik6IEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRpZiAoIWRhdGFNb2RlbE9iamVjdFBhdGggfHwgIWRhdGFNb2RlbE9iamVjdFBhdGguc3RhcnRpbmdFbnRpdHlTZXQpIHtcblx0XHRyZXR1cm4gY29uc3RhbnQodHJ1ZSk7XG5cdH1cblx0ZGF0YU1vZGVsT2JqZWN0UGF0aCA9IGVuaGFuY2VEYXRhTW9kZWxQYXRoKGRhdGFNb2RlbE9iamVjdFBhdGgsIHByb3BlcnR5UGF0aCk7XG5cblx0bGV0IGN1cnJlbnRFbnRpdHlTZXQ6IEVudGl0eVNldCB8IG51bGwgPSBkYXRhTW9kZWxPYmplY3RQYXRoLnN0YXJ0aW5nRW50aXR5U2V0O1xuXHRsZXQgcGFyZW50RW50aXR5U2V0OiBFbnRpdHlTZXQgfCBudWxsID0gbnVsbDtcblx0bGV0IHZpc2l0ZWROYXZpZ2F0aW9uUHJvcHNOYW1lOiBzdHJpbmdbXSA9IFtdO1xuXHRjb25zdCBhbGxWaXNpdGVkTmF2aWdhdGlvblByb3BzOiBOYXZpZ2F0aW9uUHJvcGVydHlbXSA9IFtdO1xuXHRsZXQgdGFyZ2V0RW50aXR5U2V0OiBFbnRpdHlTZXQgfCBudWxsID0gY3VycmVudEVudGl0eVNldDtcblx0Y29uc3QgdGFyZ2V0RW50aXR5VHlwZTogRW50aXR5VHlwZSB8IG51bGwgPSBkYXRhTW9kZWxPYmplY3RQYXRoLnRhcmdldEVudGl0eVR5cGU7XG5cdGxldCByZXNldFZpc2l0ZWROYXZQcm9wcyA9IGZhbHNlO1xuXG5cdGRhdGFNb2RlbE9iamVjdFBhdGgubmF2aWdhdGlvblByb3BlcnRpZXMuZm9yRWFjaCgobmF2aWdhdGlvblByb3BlcnR5OiBOYXZpZ2F0aW9uUHJvcGVydHkpID0+IHtcblx0XHRpZiAocmVzZXRWaXNpdGVkTmF2UHJvcHMpIHtcblx0XHRcdHZpc2l0ZWROYXZpZ2F0aW9uUHJvcHNOYW1lID0gW107XG5cdFx0fVxuXHRcdHZpc2l0ZWROYXZpZ2F0aW9uUHJvcHNOYW1lLnB1c2gobmF2aWdhdGlvblByb3BlcnR5Lm5hbWUpO1xuXHRcdGFsbFZpc2l0ZWROYXZpZ2F0aW9uUHJvcHMucHVzaChuYXZpZ2F0aW9uUHJvcGVydHkpO1xuXHRcdGlmICghbmF2aWdhdGlvblByb3BlcnR5LmNvbnRhaW5zVGFyZ2V0KSB7XG5cdFx0XHQvLyBXZSBzaG91bGQgaGF2ZSBhIG5hdmlnYXRpb25Qcm9wZXJ0eUJpbmRpbmcgYXNzb2NpYXRlZCB3aXRoIHRoZSBwYXRoIHNvIGZhciB3aGljaCBjYW4gY29uc2lzdCBvZiAoW0NvbnRhaW5tZW50TmF2UHJvcF0vKSpbTmF2UHJvcF1cblx0XHRcdGNvbnN0IGZ1bGxOYXZpZ2F0aW9uUGF0aCA9IHZpc2l0ZWROYXZpZ2F0aW9uUHJvcHNOYW1lLmpvaW4oXCIvXCIpO1xuXHRcdFx0aWYgKGN1cnJlbnRFbnRpdHlTZXQgJiYgY3VycmVudEVudGl0eVNldC5uYXZpZ2F0aW9uUHJvcGVydHlCaW5kaW5nLmhhc093blByb3BlcnR5KGZ1bGxOYXZpZ2F0aW9uUGF0aCkpIHtcblx0XHRcdFx0cGFyZW50RW50aXR5U2V0ID0gY3VycmVudEVudGl0eVNldDtcblx0XHRcdFx0Y3VycmVudEVudGl0eVNldCA9IGN1cnJlbnRFbnRpdHlTZXQubmF2aWdhdGlvblByb3BlcnR5QmluZGluZ1tmdWxsTmF2aWdhdGlvblBhdGhdO1xuXHRcdFx0XHR0YXJnZXRFbnRpdHlTZXQgPSBjdXJyZW50RW50aXR5U2V0O1xuXHRcdFx0XHQvLyBJZiB3ZSByZWFjaGVkIGEgbmF2aWdhdGlvbiBwcm9wZXJ0eSB3aXRoIGEgbmF2aWdhdGlvbnByb3BlcnR5YmluZGluZywgd2UgbmVlZCB0byByZXNldCB0aGUgdmlzaXRlZCBwYXRoIG9uIHRoZSBuZXh0IGl0ZXJhdGlvbiAoaWYgdGhlcmUgaXMgb25lKVxuXHRcdFx0XHRyZXNldFZpc2l0ZWROYXZQcm9wcyA9IHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBXZSByZWFsbHkgc2hvdWxkIG5vdCBlbmQgdXAgaGVyZSBidXQgYXQgbGVhc3QgbGV0J3MgdHJ5IHRvIGF2b2lkIGluY29ycmVjdCBiZWhhdmlvclxuXHRcdFx0XHRwYXJlbnRFbnRpdHlTZXQgPSBjdXJyZW50RW50aXR5U2V0O1xuXHRcdFx0XHRjdXJyZW50RW50aXR5U2V0ID0gbnVsbDtcblx0XHRcdFx0cmVzZXRWaXNpdGVkTmF2UHJvcHMgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRwYXJlbnRFbnRpdHlTZXQgPSBjdXJyZW50RW50aXR5U2V0O1xuXHRcdFx0dGFyZ2V0RW50aXR5U2V0ID0gbnVsbDtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIEF0IHRoaXMgcG9pbnQgd2UgaGF2ZSBuYXZpZ2F0ZWQgZG93biBhbGwgdGhlIG5hdiBwcm9wIGFuZCB3ZSBzaG91bGQgaGF2ZVxuXHQvLyBUaGUgdGFyZ2V0IGVudGl0eXNldCBwb2ludGluZyB0byBlaXRoZXIgbnVsbCAoaW4gY2FzZSBvZiBjb250YWlubWVudCBuYXZwcm9wIGEgbGFzdCBwYXJ0KSwgb3IgdGhlIGFjdHVhbCB0YXJnZXQgKG5vbiBjb250YWlubWVudCBhcyB0YXJnZXQpXG5cdC8vIFRoZSBwYXJlbnQgZW50aXR5U2V0IHBvaW50aW5nIHRvIHRoZSBwcmV2aW91cyBlbnRpdHlzZXQgdXNlZCBpbiB0aGUgcGF0aFxuXHQvLyBWaXNpdGVkTmF2aWdhdGlvblBhdGggc2hvdWxkIGNvbnRhaW4gdGhlIHBhdGggdXAgdG8gdGhpcyBwcm9wZXJ0eVxuXG5cdC8vIFJlc3RyaWN0aW9ucyBzaG91bGQgdGhlbiBiZSBldmFsdWF0ZWQgYXMgUGFyZW50RW50aXR5U2V0Lk5hdlJlc3RyaWN0aW9uc1tOYXZwcm9wZXJ0eVBhdGhdIHx8IFRhcmdldEVudGl0eVNldC5SZXN0cmljdGlvbnNcblx0Y29uc3QgZnVsbE5hdmlnYXRpb25QYXRoID0gdmlzaXRlZE5hdmlnYXRpb25Qcm9wc05hbWUuam9pbihcIi9cIik7XG5cdGxldCByZXN0cmljdGlvbnMsIHZpc2l0ZWROYXZQcm9wcztcblx0aWYgKHBhcmVudEVudGl0eVNldCAhPT0gbnVsbCkge1xuXHRcdGNvbnN0IF9wYXJlbnRFbnRpdHlTZXQ6IEVudGl0eVNldCA9IHBhcmVudEVudGl0eVNldDtcblx0XHRfcGFyZW50RW50aXR5U2V0LmFubm90YXRpb25zPy5DYXBhYmlsaXRpZXM/Lk5hdmlnYXRpb25SZXN0cmljdGlvbnM/LlJlc3RyaWN0ZWRQcm9wZXJ0aWVzLmZvckVhY2goXG5cdFx0XHQocmVzdHJpY3RlZE5hdlByb3A6IE5hdmlnYXRpb25Qcm9wZXJ0eVJlc3RyaWN0aW9uVHlwZXMpID0+IHtcblx0XHRcdFx0aWYgKHJlc3RyaWN0ZWROYXZQcm9wLk5hdmlnYXRpb25Qcm9wZXJ0eT8udHlwZSA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCIpIHtcblx0XHRcdFx0XHRjb25zdCByZXN0cmljdGlvbkRlZmluaXRpb24gPSBjaGVja0Z1bmN0aW9uKHJlc3RyaWN0ZWROYXZQcm9wKTtcblx0XHRcdFx0XHRpZiAoZnVsbE5hdmlnYXRpb25QYXRoID09PSByZXN0cmljdGVkTmF2UHJvcC5OYXZpZ2F0aW9uUHJvcGVydHkudmFsdWUgJiYgcmVzdHJpY3Rpb25EZWZpbml0aW9uICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdGNvbnN0IF9hbGxWaXNpdGVkTmF2aWdhdGlvblByb3BzID0gYWxsVmlzaXRlZE5hdmlnYXRpb25Qcm9wcy5zbGljZSgwLCAtMSk7XG5cdFx0XHRcdFx0XHRpZiAodGFyZ2V0RW50aXR5U2V0ICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdHZpc2l0ZWROYXZQcm9wcyA9IF9hbGxWaXNpdGVkTmF2aWdhdGlvblByb3BzO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0aWYgKF9hbGxWaXNpdGVkTmF2aWdhdGlvblByb3BzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdHZpc2l0ZWROYXZQcm9wcyA9IGFsbFZpc2l0ZWROYXZpZ2F0aW9uUHJvcHMuc2xpY2UoMCk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0dmlzaXRlZE5hdlByb3BzID0gX2FsbFZpc2l0ZWROYXZpZ2F0aW9uUHJvcHM7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJlc3RyaWN0aW9ucyA9IGVxdWFsKFxuXHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uRXhwcmVzc2lvbihcblx0XHRcdFx0XHRcdFx0XHRyZXN0cmljdGlvbkRlZmluaXRpb24sXG5cdFx0XHRcdFx0XHRcdFx0Z2V0UGF0aFJlbGF0aXZlTG9jYXRpb24oZGF0YU1vZGVsT2JqZWN0UGF0aD8uY29udGV4dExvY2F0aW9uLCB2aXNpdGVkTmF2UHJvcHMpLm1hcChucCA9PiBucC5uYW1lKVxuXHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0XHR0cnVlXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cdH1cblx0bGV0IHRhcmdldFJlc3RyaWN0aW9ucztcblx0bGV0IHJlc3RyaWN0aW9uRGVmaW5pdGlvbiA9IGNoZWNrRnVuY3Rpb24odGFyZ2V0RW50aXR5U2V0Py5hbm5vdGF0aW9ucz8uQ2FwYWJpbGl0aWVzKTtcblx0aWYgKHRhcmdldEVudGl0eVNldCA9PT0gbnVsbCAmJiByZXN0cmljdGlvbkRlZmluaXRpb24gPT09IHVuZGVmaW5lZCkge1xuXHRcdHJlc3RyaWN0aW9uRGVmaW5pdGlvbiA9IGNoZWNrRnVuY3Rpb24odGFyZ2V0RW50aXR5VHlwZT8uYW5ub3RhdGlvbnM/LkNhcGFiaWxpdGllcyk7XG5cdH1cblx0aWYgKHJlc3RyaWN0aW9uRGVmaW5pdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0dGFyZ2V0UmVzdHJpY3Rpb25zID0gZXF1YWwoXG5cdFx0XHRhbm5vdGF0aW9uRXhwcmVzc2lvbihcblx0XHRcdFx0cmVzdHJpY3Rpb25EZWZpbml0aW9uLFxuXHRcdFx0XHRnZXRQYXRoUmVsYXRpdmVMb2NhdGlvbihkYXRhTW9kZWxPYmplY3RQYXRoLmNvbnRleHRMb2NhdGlvbiwgYWxsVmlzaXRlZE5hdmlnYXRpb25Qcm9wcykubWFwKG5wID0+IG5wLm5hbWUpXG5cdFx0XHQpLFxuXHRcdFx0dHJ1ZVxuXHRcdCk7XG5cdH1cblx0Ly9vYmplY3QgcGFnZSB0YWJsZSBjYXNlIGluIHBhdGggYmFzZWQgc2NlbmFyaW8ncyBmYWxsYmFjayB0byBleGlzaXRpbmcgYXBwcm9hY2hcblx0aWYgKGJUYWJsZUNhc2UgJiYgIXJlc3RyaWN0aW9ucyAmJiByZXN0cmljdGlvbkRlZmluaXRpb24/LnBhdGgpIHtcblx0XHRjb25zdCBvUmVzdWx0OiBhbnkgPSB7XG5cdFx0XHRcImN1cnJlbnRFbnRpdHlSZXN0cmljdGlvblwiOiB0YXJnZXRSZXN0cmljdGlvbnNcblx0XHR9O1xuXHRcdHJldHVybiBvUmVzdWx0O1xuXHR9XG5cdHJldHVybiByZXN0cmljdGlvbnMgfHwgdGFyZ2V0UmVzdHJpY3Rpb25zIHx8IGNvbnN0YW50KHRydWUpO1xufTtcbiJdfQ==