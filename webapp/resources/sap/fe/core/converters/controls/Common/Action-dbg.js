/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/ManifestSettings", "sap/fe/core/converters/helpers/ConfigurableObject", "sap/fe/core/converters/helpers/ID", "sap/fe/core/helpers/StableIdHelper", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/formatters/FPMFormatter", "sap/fe/core/converters/helpers/BindingHelper"], function (ManifestSettings, ConfigurableObject, ID, StableIdHelper, BindingExpression, fpmFormatter, BindingHelper) {
  "use strict";

  var _exports = {};
  var bindingContextPathVisitor = BindingHelper.bindingContextPathVisitor;
  var greaterOrEqual = BindingExpression.greaterOrEqual;
  var and = BindingExpression.and;
  var ifElse = BindingExpression.ifElse;
  var equal = BindingExpression.equal;
  var resolveBindingString = BindingExpression.resolveBindingString;
  var isConstant = BindingExpression.isConstant;
  var formatResult = BindingExpression.formatResult;
  var or = BindingExpression.or;
  var compileBinding = BindingExpression.compileBinding;
  var bindingExpression = BindingExpression.bindingExpression;
  var annotationExpression = BindingExpression.annotationExpression;
  var replaceSpecialChars = StableIdHelper.replaceSpecialChars;
  var CustomActionID = ID.CustomActionID;
  var Placement = ConfigurableObject.Placement;
  var ActionType = ManifestSettings.ActionType;

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var ButtonType;

  (function (ButtonType) {
    ButtonType["Accept"] = "Accept";
    ButtonType["Attention"] = "Attention";
    ButtonType["Back"] = "Back";
    ButtonType["Critical"] = "Critical";
    ButtonType["Default"] = "Default";
    ButtonType["Emphasized"] = "Emphasized";
    ButtonType["Ghost"] = "Ghost";
    ButtonType["Negative"] = "Negative";
    ButtonType["Neutral"] = "Neutral";
    ButtonType["Reject"] = "Reject";
    ButtonType["Success"] = "Success";
    ButtonType["Transparent"] = "Transparent";
    ButtonType["Unstyled"] = "Unstyled";
    ButtonType["Up"] = "Up";
  })(ButtonType || (ButtonType = {}));

  _exports.ButtonType = ButtonType;

  /**
   * Creates the menu action from manifest actions.
   * @param {Record<string, CustomAction>} actions The manifest definition
   * @param {BaseAction[]} aAnnotationActions The annotation actions definition
   * @param aHiddenHeaderActions
   * @returns {Record<string, CustomAction>} The actions from the manifest and the menu option that were added
   */
  function prepareMenuAction(actions, aAnnotationActions, aHiddenHeaderActions) {
    var _menuItemKeys2;

    var allActions = {};
    var menuItemKeys = [];

    var _loop = function (actionKey) {
      var manifestAction = actions[actionKey];

      if (manifestAction.type === ActionType.Menu) {
        var _manifestAction$menu$, _manifestAction$menu;

        var menuItems = [];
        var menuVisible = false;

        var _menuItemKeys = (_manifestAction$menu$ = (_manifestAction$menu = manifestAction.menu) === null || _manifestAction$menu === void 0 ? void 0 : _manifestAction$menu.map(function (menuKey) {
          var _action, _action2, _action3;

          var action = aAnnotationActions.find(function (action) {
            return action.key === menuKey;
          });

          if (!action) {
            action = actions[menuKey];
          }

          if (((_action = action) !== null && _action !== void 0 && _action.visible || ((_action2 = action) === null || _action2 === void 0 ? void 0 : _action2.type) === ActionType.DataFieldForAction || ((_action3 = action) === null || _action3 === void 0 ? void 0 : _action3.type) === ActionType.DataFieldForIntentBasedNavigation) && !aHiddenHeaderActions.find(function (hiddenAction) {
            return hiddenAction.key === menuKey;
          })) {
            menuVisible = compileBinding(or(resolveBindingString(action.visible, "boolean"), resolveBindingString(menuVisible, "boolean")));
            menuItems.push(action);
          }

          return menuKey;
        })) !== null && _manifestAction$menu$ !== void 0 ? _manifestAction$menu$ : []; // Show menu button if it has one or more then 1 items visible


        if (menuItems.length) {
          manifestAction.visible = menuVisible;
          manifestAction.menu = menuItems;
        } else {
          _menuItemKeys = [actionKey];
        }

        menuItemKeys = [].concat(_toConsumableArray(menuItemKeys), _toConsumableArray(_menuItemKeys));
      }

      if (aHiddenHeaderActions.find(function (hiddenAction) {
        return hiddenAction.key === actionKey;
      })) {
        manifestAction.visible = false;
      }

      allActions[actionKey] = manifestAction;
    };

    for (var actionKey in actions) {
      _loop(actionKey);
    } // eslint-disable-next-line no-unused-expressions


    (_menuItemKeys2 = menuItemKeys) === null || _menuItemKeys2 === void 0 ? void 0 : _menuItemKeys2.forEach(function (actionKey) {
      return delete allActions[actionKey];
    });
    return allActions;
  }

  var removeDuplicateActions = function (actions) {
    var oMenuItemKeys = {};
    actions.forEach(function (action) {
      var _action$menu;

      if (action !== null && action !== void 0 && (_action$menu = action.menu) !== null && _action$menu !== void 0 && _action$menu.length) {
        action.menu.reduce(function (item, _ref) {
          var key = _ref.key;

          if (key && !item[key]) {
            item[key] = true;
          }

          return item;
        }, oMenuItemKeys);
      }
    });
    return actions.filter(function (action) {
      return !oMenuItemKeys[action.key];
    });
  };
  /**
   * Retrieves an action default value based on its kind.
   *
   * Default property value for custom actions if not overwritten in manifest.
   * @param {ManifestAction} manifestAction The action configured in the manifest
   * @param {boolean} isAnnotationAction Whether the action, defined in manifest, corresponds to an existing annotation action.
   * @param converterContext
   * @returns {BindingExpression<string> | string | boolean} Determined property value for the column
   */


  _exports.removeDuplicateActions = removeDuplicateActions;

  var _getManifestEnabled = function (manifestAction, isAnnotationAction, converterContext) {
    if (isAnnotationAction && manifestAction.enabled === undefined) {
      // If annotation action has no property defined in manifest,
      // do not overwrite it with manifest action's default value.
      return undefined;
    } // Return what is defined in manifest.


    return getManifestActionEnablement(manifestAction, converterContext);
  };
  /**
   * Creates the action configuration based on the manifest settings.
   * @param {Record<string, ManifestAction> | undefined} manifestActions The manifest actions
   * @param converterContext The converter context
   * @param {BaseAction[]} aAnnotationActions The annotation actions definition
   * @param {NavigationSettingsConfiguration} navigationSettings The navigation settings
   * @param {boolean} considerNavigationSettings The navigation settings to be considered
   * @param {BaseAction[]} aHiddenHeaderActions The hidden header actions
   * @param {string} facetName The facet where an action is displayed if it is inline
   * @returns {Record<string, CustomAction>} The actions from the manifest
   */


  function getActionsFromManifest(manifestActions, converterContext, aAnnotationActions, navigationSettings, considerNavigationSettings, aHiddenHeaderActions, facetName) {
    var actions = {};

    var _loop2 = function (actionKey) {
      var _manifestAction$press, _manifestAction$posit, _manifestAction$menu2;

      var manifestAction = manifestActions[actionKey];
      var lastDotIndex = ((_manifestAction$press = manifestAction.press) === null || _manifestAction$press === void 0 ? void 0 : _manifestAction$press.lastIndexOf(".")) || -1; // To identify the annotation action property overwrite via manifest use-case.

      var isAnnotationAction = (aAnnotationActions === null || aAnnotationActions === void 0 ? void 0 : aAnnotationActions.some(function (action) {
        return action.key === actionKey;
      })) || false;

      if (manifestAction.facetName) {
        facetName = manifestAction.facetName;
      }

      actions[actionKey] = {
        id: aAnnotationActions !== null && aAnnotationActions !== void 0 && aAnnotationActions.some(function (action) {
          return action.key === actionKey;
        }) ? actionKey : CustomActionID(actionKey),
        visible: manifestAction.visible === undefined ? "true" : manifestAction.visible,
        enabled: _getManifestEnabled(manifestAction, isAnnotationAction, converterContext),
        handlerModule: manifestAction.press && manifestAction.press.substring(0, lastDotIndex).replace(/\./gi, "/"),
        handlerMethod: manifestAction.press && manifestAction.press.substring(lastDotIndex + 1),
        press: manifestAction.press,
        type: manifestAction.menu ? ActionType.Menu : ActionType.Default,
        text: manifestAction.text,
        noWrap: manifestAction.__noWrap,
        key: replaceSpecialChars(actionKey),
        enableOnSelect: manifestAction.enableOnSelect,
        defaultValuesExtensionFunction: manifestAction.defaultValuesFunction,
        position: {
          anchor: (_manifestAction$posit = manifestAction.position) === null || _manifestAction$posit === void 0 ? void 0 : _manifestAction$posit.anchor,
          placement: manifestAction.position === undefined ? Placement.After : manifestAction.position.placement
        },
        isNavigable: isActionNavigable(manifestAction, navigationSettings, considerNavigationSettings),
        requiresSelection: manifestAction.requiresSelection === undefined ? false : manifestAction.requiresSelection,
        enableAutoScroll: enableAutoScroll(manifestAction),
        menu: (_manifestAction$menu2 = manifestAction.menu) !== null && _manifestAction$menu2 !== void 0 ? _manifestAction$menu2 : [],
        facetName: manifestAction.inline ? facetName : undefined
      };
    };

    for (var actionKey in manifestActions) {
      _loop2(actionKey);
    }

    return prepareMenuAction(actions, aAnnotationActions !== null && aAnnotationActions !== void 0 ? aAnnotationActions : [], aHiddenHeaderActions !== null && aHiddenHeaderActions !== void 0 ? aHiddenHeaderActions : []);
  }

  _exports.getActionsFromManifest = getActionsFromManifest;

  function getManifestActionEnablement(manifestAction, converterContext) {
    var resolvedBinding = resolveBindingString(manifestAction.enabled, "boolean");
    var result;

    if (isConstant(resolvedBinding) && resolvedBinding.value === undefined) {
      // No enabled property configured in manifest for the custom action --> enable custom action
      result = true;
    } else if (isConstant(resolvedBinding) && typeof resolvedBinding.value === "boolean") {
      // true / false
      result = resolvedBinding.value;
    } else if (resolvedBinding._type !== "EmbeddedBinding" && resolvedBinding._type !== "EmbeddedExpressionBinding") {
      // Then it's a module-method reference "sap.xxx.yyy.doSomething"
      var methodPath = resolvedBinding.value;
      result = formatResult([bindingExpression("/", "$view"), methodPath, bindingExpression("selectedContexts", "internal")], fpmFormatter.customIsEnabledCheck, converterContext.getEntityType());
    } else {
      // then it's a binding
      result = resolvedBinding;
    } // Consider requiresSelection property to include selectedContexts in the binding expression


    return compileBinding(ifElse(manifestAction.requiresSelection === true, and(greaterOrEqual(bindingExpression("numberOfSelectedContexts", "internal"), 1), result), result));
  }
  /**
   * Method to determine the value of the 'enabled' property of an annotation-based action.
   *
   * @param {ConverterContext} converterContext The instance of the converter context
   * @param {Action} actionTarget The instance of the action
   * @returns {BindingExpression<boolean>} The binding expression for the 'enabled' property of the action button.
   */


  function getEnabledForAnnotationAction(converterContext, actionTarget) {
    var _actionTarget$paramet;

    if ((actionTarget === null || actionTarget === void 0 ? void 0 : actionTarget.isBound) !== true) {
      return true;
    }
    /*
       FIXME Disable failing music tests
    	Currently on CAP the following binding (which is the good one) generates error:
    if (actionTarget?.annotations.Core?.OperationAvailable === null) {
    	const unboundActionName = actionTarget.fullyQualifiedName.split("(")[0];
    	return "{= !${#" + unboundActionName + "} ? false : true } }";
    }
    	CAP tries to read the action as property and doesn't find it
    */


    if (actionTarget !== null && actionTarget !== void 0 && (_actionTarget$paramet = actionTarget.parameters) !== null && _actionTarget$paramet !== void 0 && _actionTarget$paramet.length) {
      var _actionTarget$annotat, _actionTarget$annotat2;

      var bindingParameterFullName = actionTarget === null || actionTarget === void 0 ? void 0 : actionTarget.parameters[0].fullyQualifiedName,
          operationAvailableExpression = annotationExpression(actionTarget === null || actionTarget === void 0 ? void 0 : (_actionTarget$annotat = actionTarget.annotations.Core) === null || _actionTarget$annotat === void 0 ? void 0 : _actionTarget$annotat.OperationAvailable, [], undefined, function (path) {
        return bindingContextPathVisitor(path, converterContext, bindingParameterFullName);
      });

      if ((actionTarget === null || actionTarget === void 0 ? void 0 : (_actionTarget$annotat2 = actionTarget.annotations.Core) === null || _actionTarget$annotat2 === void 0 ? void 0 : _actionTarget$annotat2.OperationAvailable) !== undefined) {
        return compileBinding(equal(operationAvailableExpression, true));
      }
    }

    return true;
  }

  _exports.getEnabledForAnnotationAction = getEnabledForAnnotationAction;

  function getSemanticObjectMapping(aMappings) {
    var aSemanticObjectMappings = [];
    aMappings.forEach(function (oMapping) {
      var oSOMapping = {
        "LocalProperty": {
          "$PropertyPath": oMapping.LocalProperty.value
        },
        "SemanticObjectProperty": oMapping.SemanticObjectProperty
      };
      aSemanticObjectMappings.push(oSOMapping);
    });
    return aSemanticObjectMappings;
  }

  _exports.getSemanticObjectMapping = getSemanticObjectMapping;

  function isActionNavigable(action, navigationSettings, considerNavigationSettings) {
    var _action$afterExecutio, _action$afterExecutio2;

    var bIsNavigationConfigured = true;

    if (considerNavigationSettings) {
      var detailOrDisplay = navigationSettings && (navigationSettings.detail || navigationSettings.display);
      bIsNavigationConfigured = detailOrDisplay !== null && detailOrDisplay !== void 0 && detailOrDisplay.route ? true : false;
    } // when enableAutoScroll is true the navigateToInstance feature is disabled


    if (action && action.afterExecution && (((_action$afterExecutio = action.afterExecution) === null || _action$afterExecutio === void 0 ? void 0 : _action$afterExecutio.navigateToInstance) === false || ((_action$afterExecutio2 = action.afterExecution) === null || _action$afterExecutio2 === void 0 ? void 0 : _action$afterExecutio2.enableAutoScroll) === true) || !bIsNavigationConfigured) {
      return false;
    }

    return true;
  }

  _exports.isActionNavigable = isActionNavigable;

  function enableAutoScroll(action) {
    var _action$afterExecutio3;

    return (action === null || action === void 0 ? void 0 : (_action$afterExecutio3 = action.afterExecution) === null || _action$afterExecutio3 === void 0 ? void 0 : _action$afterExecutio3.enableAutoScroll) === true;
  }

  _exports.enableAutoScroll = enableAutoScroll;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFjdGlvbi50cyJdLCJuYW1lcyI6WyJCdXR0b25UeXBlIiwicHJlcGFyZU1lbnVBY3Rpb24iLCJhY3Rpb25zIiwiYUFubm90YXRpb25BY3Rpb25zIiwiYUhpZGRlbkhlYWRlckFjdGlvbnMiLCJhbGxBY3Rpb25zIiwibWVudUl0ZW1LZXlzIiwiYWN0aW9uS2V5IiwibWFuaWZlc3RBY3Rpb24iLCJ0eXBlIiwiQWN0aW9uVHlwZSIsIk1lbnUiLCJtZW51SXRlbXMiLCJtZW51VmlzaWJsZSIsIl9tZW51SXRlbUtleXMiLCJtZW51IiwibWFwIiwibWVudUtleSIsImFjdGlvbiIsImZpbmQiLCJrZXkiLCJ2aXNpYmxlIiwiRGF0YUZpZWxkRm9yQWN0aW9uIiwiRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uIiwiaGlkZGVuQWN0aW9uIiwiY29tcGlsZUJpbmRpbmciLCJvciIsInJlc29sdmVCaW5kaW5nU3RyaW5nIiwicHVzaCIsImxlbmd0aCIsImZvckVhY2giLCJyZW1vdmVEdXBsaWNhdGVBY3Rpb25zIiwib01lbnVJdGVtS2V5cyIsInJlZHVjZSIsIml0ZW0iLCJmaWx0ZXIiLCJfZ2V0TWFuaWZlc3RFbmFibGVkIiwiaXNBbm5vdGF0aW9uQWN0aW9uIiwiY29udmVydGVyQ29udGV4dCIsImVuYWJsZWQiLCJ1bmRlZmluZWQiLCJnZXRNYW5pZmVzdEFjdGlvbkVuYWJsZW1lbnQiLCJnZXRBY3Rpb25zRnJvbU1hbmlmZXN0IiwibWFuaWZlc3RBY3Rpb25zIiwibmF2aWdhdGlvblNldHRpbmdzIiwiY29uc2lkZXJOYXZpZ2F0aW9uU2V0dGluZ3MiLCJmYWNldE5hbWUiLCJsYXN0RG90SW5kZXgiLCJwcmVzcyIsImxhc3RJbmRleE9mIiwic29tZSIsImlkIiwiQ3VzdG9tQWN0aW9uSUQiLCJoYW5kbGVyTW9kdWxlIiwic3Vic3RyaW5nIiwicmVwbGFjZSIsImhhbmRsZXJNZXRob2QiLCJEZWZhdWx0IiwidGV4dCIsIm5vV3JhcCIsIl9fbm9XcmFwIiwicmVwbGFjZVNwZWNpYWxDaGFycyIsImVuYWJsZU9uU2VsZWN0IiwiZGVmYXVsdFZhbHVlc0V4dGVuc2lvbkZ1bmN0aW9uIiwiZGVmYXVsdFZhbHVlc0Z1bmN0aW9uIiwicG9zaXRpb24iLCJhbmNob3IiLCJwbGFjZW1lbnQiLCJQbGFjZW1lbnQiLCJBZnRlciIsImlzTmF2aWdhYmxlIiwiaXNBY3Rpb25OYXZpZ2FibGUiLCJyZXF1aXJlc1NlbGVjdGlvbiIsImVuYWJsZUF1dG9TY3JvbGwiLCJpbmxpbmUiLCJyZXNvbHZlZEJpbmRpbmciLCJyZXN1bHQiLCJpc0NvbnN0YW50IiwidmFsdWUiLCJfdHlwZSIsIm1ldGhvZFBhdGgiLCJmb3JtYXRSZXN1bHQiLCJiaW5kaW5nRXhwcmVzc2lvbiIsImZwbUZvcm1hdHRlciIsImN1c3RvbUlzRW5hYmxlZENoZWNrIiwiZ2V0RW50aXR5VHlwZSIsImlmRWxzZSIsImFuZCIsImdyZWF0ZXJPckVxdWFsIiwiZ2V0RW5hYmxlZEZvckFubm90YXRpb25BY3Rpb24iLCJhY3Rpb25UYXJnZXQiLCJpc0JvdW5kIiwicGFyYW1ldGVycyIsImJpbmRpbmdQYXJhbWV0ZXJGdWxsTmFtZSIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsIm9wZXJhdGlvbkF2YWlsYWJsZUV4cHJlc3Npb24iLCJhbm5vdGF0aW9uRXhwcmVzc2lvbiIsImFubm90YXRpb25zIiwiQ29yZSIsIk9wZXJhdGlvbkF2YWlsYWJsZSIsInBhdGgiLCJiaW5kaW5nQ29udGV4dFBhdGhWaXNpdG9yIiwiZXF1YWwiLCJnZXRTZW1hbnRpY09iamVjdE1hcHBpbmciLCJhTWFwcGluZ3MiLCJhU2VtYW50aWNPYmplY3RNYXBwaW5ncyIsIm9NYXBwaW5nIiwib1NPTWFwcGluZyIsIkxvY2FsUHJvcGVydHkiLCJTZW1hbnRpY09iamVjdFByb3BlcnR5IiwiYklzTmF2aWdhdGlvbkNvbmZpZ3VyZWQiLCJkZXRhaWxPckRpc3BsYXkiLCJkZXRhaWwiLCJkaXNwbGF5Iiwicm91dGUiLCJhZnRlckV4ZWN1dGlvbiIsIm5hdmln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SUFHQSxDQUFDcUMsdUJBSkYsRUFLRTtBQUNELGFBQU8sS0FBUDtBQUNBOztBQUNELFdBQU8sSUFBUDtBQUNBOzs7O0FBRU0sV0FBU3JDLGdCQUFULENBQTBCdkQsTUFBMUIsRUFBMkQ7QUFBQTs7QUFDakUsV0FBTyxDQUFBQSxNQUFNLFNBQU4sSUFBQUEsTUFBTSxXQUFOLHNDQUFBQSxNQUFNLENBQUVpRyxjQUFSLGtGQUF3QjFDLGdCQUF4QixNQUE2QyxJQUFwRDtBQUNBIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY3Rpb24gfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcbmltcG9ydCB7IEFjdGlvblR5cGUsIE1hbmlmZXN0QWN0aW9uLCBOYXZpZ2F0aW9uU2V0dGluZ3NDb25maWd1cmF0aW9uLCBNYW5pZmVzdFRhYmxlQ29sdW1uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvTWFuaWZlc3RTZXR0aW5nc1wiO1xuaW1wb3J0IHsgQ29uZmlndXJhYmxlT2JqZWN0LCBDdXN0b21FbGVtZW50LCBQbGFjZW1lbnQgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0NvbmZpZ3VyYWJsZU9iamVjdFwiO1xuaW1wb3J0IHsgQ3VzdG9tQWN0aW9uSUQgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0lEXCI7XG5pbXBvcnQgeyByZXBsYWNlU3BlY2lhbENoYXJzIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvU3RhYmxlSWRIZWxwZXJcIjtcbmltcG9ydCB7XG5cdGFubm90YXRpb25FeHByZXNzaW9uLFxuXHRiaW5kaW5nRXhwcmVzc2lvbixcblx0QmluZGluZ0V4cHJlc3Npb24sXG5cdGNvbXBpbGVCaW5kaW5nLFxuXHRvcixcblx0Zm9ybWF0UmVzdWx0LFxuXHRpc0NvbnN0YW50LFxuXHRyZXNvbHZlQmluZGluZ1N0cmluZyxcblx0ZXF1YWwsXG5cdEJpbmRpbmdFeHByZXNzaW9uRXhwcmVzc2lvbixcblx0aWZFbHNlLFxuXHRhbmQsXG5cdGdyZWF0ZXJPckVxdWFsXG59IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0JpbmRpbmdFeHByZXNzaW9uXCI7XG5pbXBvcnQgZnBtRm9ybWF0dGVyIGZyb20gXCJzYXAvZmUvY29yZS9mb3JtYXR0ZXJzL0ZQTUZvcm1hdHRlclwiO1xuaW1wb3J0IENvbnZlcnRlckNvbnRleHQgZnJvbSBcIi4uLy4uL0NvbnZlcnRlckNvbnRleHRcIjtcbmltcG9ydCB7IGJpbmRpbmdDb250ZXh0UGF0aFZpc2l0b3IgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0JpbmRpbmdIZWxwZXJcIjtcblxuZXhwb3J0IGVudW0gQnV0dG9uVHlwZSB7XG5cdEFjY2VwdCA9IFwiQWNjZXB0XCIsXG5cdEF0dGVudGlvbiA9IFwiQXR0ZW50aW9uXCIsXG5cdEJhY2sgPSBcIkJhY2tcIixcblx0Q3JpdGljYWwgPSBcIkNyaXRpY2FsXCIsXG5cdERlZmF1bHQgPSBcIkRlZmF1bHRcIixcblx0RW1waGFzaXplZCA9IFwiRW1waGFzaXplZFwiLFxuXHRHaG9zdCA9IFwiR2hvc3RcIixcblx0TmVnYXRpdmUgPSBcIk5lZ2F0aXZlXCIsXG5cdE5ldXRyYWwgPSBcIk5ldXRyYWxcIixcblx0UmVqZWN0ID0gXCJSZWplY3RcIixcblx0U3VjY2VzcyA9IFwiU3VjY2Vzc1wiLFxuXHRUcmFuc3BhcmVudCA9IFwiVHJhbnNwYXJlbnRcIixcblx0VW5zdHlsZWQgPSBcIlVuc3R5bGVkXCIsXG5cdFVwID0gXCJVcFwiXG59XG5cbmV4cG9ydCB0eXBlIEJhc2VBY3Rpb24gPSBDb25maWd1cmFibGVPYmplY3QgJiB7XG5cdGlkPzogc3RyaW5nO1xuXHR0ZXh0Pzogc3RyaW5nO1xuXHR0eXBlOiBBY3Rpb25UeXBlO1xuXHRwcmVzcz86IHN0cmluZztcblx0ZW5hYmxlZD86IEJpbmRpbmdFeHByZXNzaW9uPGJvb2xlYW4+O1xuXHR2aXNpYmxlPzogQmluZGluZ0V4cHJlc3Npb248Ym9vbGVhbj47XG5cdGVuYWJsZU9uU2VsZWN0Pzogc3RyaW5nO1xuXHRkZWZhdWx0VmFsdWVzRXh0ZW5zaW9uRnVuY3Rpb24/OiBzdHJpbmc7XG5cdGlzTmF2aWdhYmxlPzogYm9vbGVhbjtcblx0ZW5hYmxlQXV0b1Njcm9sbD86IGJvb2xlYW47XG5cdHJlcXVpcmVzRGlhbG9nPzogc3RyaW5nO1xuXHRiaW5kaW5nPzogc3RyaW5nO1xuXHRidXR0b25UeXBlPzogQnV0dG9uVHlwZS5HaG9zdCB8IEJ1dHRvblR5cGUuVHJhbnNwYXJlbnQgfCBzdHJpbmc7XG5cdHBhcmVudEVudGl0eURlbGV0ZUVuYWJsZWQ/OiBCaW5kaW5nRXhwcmVzc2lvbjxib29sZWFuPjtcblx0bWVudT86IChzdHJpbmcgfCBDdXN0b21BY3Rpb24gfCBCYXNlQWN0aW9uKVtdO1xuXHRmYWNldE5hbWU/OiBzdHJpbmc7XG59O1xuXG5leHBvcnQgdHlwZSBBbm5vdGF0aW9uQWN0aW9uID0gQmFzZUFjdGlvbiAmIHtcblx0dHlwZTogQWN0aW9uVHlwZS5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24gfCBBY3Rpb25UeXBlLkRhdGFGaWVsZEZvckFjdGlvbjtcblx0YW5ub3RhdGlvblBhdGg6IHN0cmluZztcblx0aWQ/OiBzdHJpbmc7XG5cdGN1c3RvbURhdGE/OiBzdHJpbmc7XG59O1xuXG4vKipcbiAqIERlZmluaXRpb24gZm9yIGN1c3RvbSBhY3Rpb25zXG4gKlxuICogQHR5cGVkZWYgQ3VzdG9tQWN0aW9uXG4gKi9cbmV4cG9ydCB0eXBlIEN1c3RvbUFjdGlvbiA9IEN1c3RvbUVsZW1lbnQ8XG5cdEJhc2VBY3Rpb24gJiB7XG5cdFx0dHlwZTogQWN0aW9uVHlwZS5EZWZhdWx0IHwgQWN0aW9uVHlwZS5NZW51O1xuXHRcdGhhbmRsZXJNZXRob2Q/OiBzdHJpbmc7XG5cdFx0aGFuZGxlck1vZHVsZT86IHN0cmluZztcblx0XHRtZW51PzogKHN0cmluZyB8IEN1c3RvbUFjdGlvbiB8IEJhc2VBY3Rpb24pW107XG5cdFx0bm9XcmFwPzogYm9vbGVhbjsgLy8gSW5kaWNhdGVzIHRoYXQgd2Ugd2FudCB0byBhdm9pZCB0aGUgd3JhcHBpbmcgZnJvbSB0aGUgRlBNSGVscGVyXG5cdFx0cmVxdWlyZXNTZWxlY3Rpb24/OiBib29sZWFuO1xuXHR9XG4+O1xuXG4vLyBSZXVzZSBvZiBDb25maWd1cmFibGVPYmplY3QgYW5kIEN1c3RvbUVsZW1lbnQgaXMgZG9uZSBmb3Igb3JkZXJpbmdcbmV4cG9ydCB0eXBlIENvbnZlcnRlckFjdGlvbiA9IEFubm90YXRpb25BY3Rpb24gfCBDdXN0b21BY3Rpb247XG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgbWVudSBhY3Rpb24gZnJvbSBtYW5pZmVzdCBhY3Rpb25zLlxuICogQHBhcmFtIHtSZWNvcmQ8c3RyaW5nLCBDdXN0b21BY3Rpb24+fSBhY3Rpb25zIFRoZSBtYW5pZmVzdCBkZWZpbml0aW9uXG4gKiBAcGFyYW0ge0Jhc2VBY3Rpb25bXX0gYUFubm90YXRpb25BY3Rpb25zIFRoZSBhbm5vdGF0aW9uIGFjdGlvbnMgZGVmaW5pdGlvblxuICogQHBhcmFtIGFIaWRkZW5IZWFkZXJBY3Rpb25zXG4gKiBAcmV0dXJucyB7UmVjb3JkPHN0cmluZywgQ3VzdG9tQWN0aW9uPn0gVGhlIGFjdGlvbnMgZnJvbSB0aGUgbWFuaWZlc3QgYW5kIHRoZSBtZW51IG9wdGlvbiB0aGF0IHdlcmUgYWRkZWRcbiAqL1xuZnVuY3Rpb24gcHJlcGFyZU1lbnVBY3Rpb24oXG5cdGFjdGlvbnM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj4sXG5cdGFBbm5vdGF0aW9uQWN0aW9uczogQmFzZUFjdGlvbltdLFxuXHRhSGlkZGVuSGVhZGVyQWN0aW9uczogQmFzZUFjdGlvbltdXG4pOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21BY3Rpb24+IHtcblx0Y29uc3QgYWxsQWN0aW9uczogUmVjb3JkPHN0cmluZywgQ3VzdG9tQWN0aW9uPiA9IHt9O1xuXHRsZXQgbWVudUl0ZW1LZXlzOiBzdHJpbmdbXSB8IHVuZGVmaW5lZCA9IFtdO1xuXG5cdGZvciAoY29uc3QgYWN0aW9uS2V5IGluIGFjdGlvbnMpIHtcblx0XHRjb25zdCBtYW5pZmVzdEFjdGlvbjogQ3VzdG9tQWN0aW9uID0gYWN0aW9uc1thY3Rpb25LZXldO1xuXHRcdGlmIChtYW5pZmVzdEFjdGlvbi50eXBlID09PSBBY3Rpb25UeXBlLk1lbnUpIHtcblx0XHRcdGNvbnN0IG1lbnVJdGVtczogKEN1c3RvbUFjdGlvbiB8IEJhc2VBY3Rpb24pW10gPSBbXTtcblx0XHRcdGxldCBtZW51VmlzaWJsZTogYW55ID0gZmFsc2U7XG5cdFx0XHRsZXQgX21lbnVJdGVtS2V5cyA9XG5cdFx0XHRcdG1hbmlmZXN0QWN0aW9uLm1lbnU/Lm1hcCgobWVudUtleTogc3RyaW5nIHwgQ3VzdG9tQWN0aW9uKSA9PiB7XG5cdFx0XHRcdFx0bGV0IGFjdGlvbjogQmFzZUFjdGlvbiB8IEN1c3RvbUFjdGlvbiB8IHVuZGVmaW5lZCA9IGFBbm5vdGF0aW9uQWN0aW9ucy5maW5kKFxuXHRcdFx0XHRcdFx0KGFjdGlvbjogQmFzZUFjdGlvbikgPT4gYWN0aW9uLmtleSA9PT0gbWVudUtleVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0aWYgKCFhY3Rpb24pIHtcblx0XHRcdFx0XHRcdGFjdGlvbiA9IGFjdGlvbnNbbWVudUtleSBhcyBzdHJpbmddO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdChhY3Rpb24/LnZpc2libGUgfHxcblx0XHRcdFx0XHRcdFx0YWN0aW9uPy50eXBlID09PSBBY3Rpb25UeXBlLkRhdGFGaWVsZEZvckFjdGlvbiB8fFxuXHRcdFx0XHRcdFx0XHRhY3Rpb24/LnR5cGUgPT09IEFjdGlvblR5cGUuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uKSAmJlxuXHRcdFx0XHRcdFx0IWFIaWRkZW5IZWFkZXJBY3Rpb25zLmZpbmQoaGlkZGVuQWN0aW9uID0+IGhpZGRlbkFjdGlvbi5rZXkgPT09IG1lbnVLZXkpXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRtZW51VmlzaWJsZSA9IGNvbXBpbGVCaW5kaW5nKFxuXHRcdFx0XHRcdFx0XHRvcihyZXNvbHZlQmluZGluZ1N0cmluZygoYWN0aW9uIGFzIGFueSkudmlzaWJsZSwgXCJib29sZWFuXCIpLCByZXNvbHZlQmluZGluZ1N0cmluZyhtZW51VmlzaWJsZSwgXCJib29sZWFuXCIpKVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdG1lbnVJdGVtcy5wdXNoKGFjdGlvbik7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIG1lbnVLZXkgYXMgc3RyaW5nO1xuXHRcdFx0XHR9KSA/PyBbXTtcblxuXHRcdFx0Ly8gU2hvdyBtZW51IGJ1dHRvbiBpZiBpdCBoYXMgb25lIG9yIG1vcmUgdGhlbiAxIGl0ZW1zIHZpc2libGVcblx0XHRcdGlmIChtZW51SXRlbXMubGVuZ3RoKSB7XG5cdFx0XHRcdG1hbmlmZXN0QWN0aW9uLnZpc2libGUgPSBtZW51VmlzaWJsZTtcblx0XHRcdFx0bWFuaWZlc3RBY3Rpb24ubWVudSA9IG1lbnVJdGVtcztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdF9tZW51SXRlbUtleXMgPSBbYWN0aW9uS2V5XTtcblx0XHRcdH1cblxuXHRcdFx0bWVudUl0ZW1LZXlzID0gWy4uLm1lbnVJdGVtS2V5cywgLi4uX21lbnVJdGVtS2V5c107XG5cdFx0fVxuXHRcdGlmIChhSGlkZGVuSGVhZGVyQWN0aW9ucy5maW5kKGhpZGRlbkFjdGlvbiA9PiBoaWRkZW5BY3Rpb24ua2V5ID09PSBhY3Rpb25LZXkpKSB7XG5cdFx0XHRtYW5pZmVzdEFjdGlvbi52aXNpYmxlID0gZmFsc2U7XG5cdFx0fVxuXHRcdGFsbEFjdGlvbnNbYWN0aW9uS2V5XSA9IG1hbmlmZXN0QWN0aW9uO1xuXHR9XG5cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xuXHRtZW51SXRlbUtleXM/LmZvckVhY2goKGFjdGlvbktleTogc3RyaW5nKSA9PiBkZWxldGUgYWxsQWN0aW9uc1thY3Rpb25LZXldKTtcblx0cmV0dXJuIGFsbEFjdGlvbnM7XG59XG5cbmV4cG9ydCBjb25zdCByZW1vdmVEdXBsaWNhdGVBY3Rpb25zID0gKGFjdGlvbnM6IEJhc2VBY3Rpb25bXSk6IEJhc2VBY3Rpb25bXSA9PiB7XG5cdGNvbnN0IG9NZW51SXRlbUtleXM6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fTtcblx0YWN0aW9ucy5mb3JFYWNoKGFjdGlvbiA9PiB7XG5cdFx0aWYgKGFjdGlvbj8ubWVudT8ubGVuZ3RoKSB7XG5cdFx0XHRhY3Rpb24ubWVudS5yZWR1Y2UoKGl0ZW0sIHsga2V5IH06IGFueSkgPT4ge1xuXHRcdFx0XHRpZiAoa2V5ICYmICFpdGVtW2tleV0pIHtcblx0XHRcdFx0XHRpdGVtW2tleV0gPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBpdGVtO1xuXHRcdFx0fSwgb01lbnVJdGVtS2V5cyk7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIGFjdGlvbnMuZmlsdGVyKGFjdGlvbiA9PiAhb01lbnVJdGVtS2V5c1thY3Rpb24ua2V5XSk7XG59O1xuXG4vKipcbiAqIFJldHJpZXZlcyBhbiBhY3Rpb24gZGVmYXVsdCB2YWx1ZSBiYXNlZCBvbiBpdHMga2luZC5cbiAqXG4gKiBEZWZhdWx0IHByb3BlcnR5IHZhbHVlIGZvciBjdXN0b20gYWN0aW9ucyBpZiBub3Qgb3ZlcndyaXR0ZW4gaW4gbWFuaWZlc3QuXG4gKiBAcGFyYW0ge01hbmlmZXN0QWN0aW9ufSBtYW5pZmVzdEFjdGlvbiBUaGUgYWN0aW9uIGNvbmZpZ3VyZWQgaW4gdGhlIG1hbmlmZXN0XG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzQW5ub3RhdGlvbkFjdGlvbiBXaGV0aGVyIHRoZSBhY3Rpb24sIGRlZmluZWQgaW4gbWFuaWZlc3QsIGNvcnJlc3BvbmRzIHRvIGFuIGV4aXN0aW5nIGFubm90YXRpb24gYWN0aW9uLlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHRcbiAqIEByZXR1cm5zIHtCaW5kaW5nRXhwcmVzc2lvbjxzdHJpbmc+IHwgc3RyaW5nIHwgYm9vbGVhbn0gRGV0ZXJtaW5lZCBwcm9wZXJ0eSB2YWx1ZSBmb3IgdGhlIGNvbHVtblxuICovXG5jb25zdCBfZ2V0TWFuaWZlc3RFbmFibGVkID0gZnVuY3Rpb24oXG5cdG1hbmlmZXN0QWN0aW9uOiBNYW5pZmVzdEFjdGlvbixcblx0aXNBbm5vdGF0aW9uQWN0aW9uOiBib29sZWFuLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBCaW5kaW5nRXhwcmVzc2lvbjxzdHJpbmc+IHwgc3RyaW5nIHwgYm9vbGVhbiB7XG5cdGlmIChpc0Fubm90YXRpb25BY3Rpb24gJiYgbWFuaWZlc3RBY3Rpb24uZW5hYmxlZCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0Ly8gSWYgYW5ub3RhdGlvbiBhY3Rpb24gaGFzIG5vIHByb3BlcnR5IGRlZmluZWQgaW4gbWFuaWZlc3QsXG5cdFx0Ly8gZG8gbm90IG92ZXJ3cml0ZSBpdCB3aXRoIG1hbmlmZXN0IGFjdGlvbidzIGRlZmF1bHQgdmFsdWUuXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxuXHQvLyBSZXR1cm4gd2hhdCBpcyBkZWZpbmVkIGluIG1hbmlmZXN0LlxuXHRyZXR1cm4gZ2V0TWFuaWZlc3RBY3Rpb25FbmFibGVtZW50KG1hbmlmZXN0QWN0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgYWN0aW9uIGNvbmZpZ3VyYXRpb24gYmFzZWQgb24gdGhlIG1hbmlmZXN0IHNldHRpbmdzLlxuICogQHBhcmFtIHtSZWNvcmQ8c3RyaW5nLCBNYW5pZmVzdEFjdGlvbj4gfCB1bmRlZmluZWR9IG1hbmlmZXN0QWN0aW9ucyBUaGUgbWFuaWZlc3QgYWN0aW9uc1xuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcGFyYW0ge0Jhc2VBY3Rpb25bXX0gYUFubm90YXRpb25BY3Rpb25zIFRoZSBhbm5vdGF0aW9uIGFjdGlvbnMgZGVmaW5pdGlvblxuICogQHBhcmFtIHtOYXZpZ2F0aW9uU2V0dGluZ3NDb25maWd1cmF0aW9ufSBuYXZpZ2F0aW9uU2V0dGluZ3MgVGhlIG5hdmlnYXRpb24gc2V0dGluZ3NcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY29uc2lkZXJOYXZpZ2F0aW9uU2V0dGluZ3MgVGhlIG5hdmlnYXRpb24gc2V0dGluZ3MgdG8gYmUgY29uc2lkZXJlZFxuICogQHBhcmFtIHtCYXNlQWN0aW9uW119IGFIaWRkZW5IZWFkZXJBY3Rpb25zIFRoZSBoaWRkZW4gaGVhZGVyIGFjdGlvbnNcbiAqIEBwYXJhbSB7c3RyaW5nfSBmYWNldE5hbWUgVGhlIGZhY2V0IHdoZXJlIGFuIGFjdGlvbiBpcyBkaXNwbGF5ZWQgaWYgaXQgaXMgaW5saW5lXG4gKiBAcmV0dXJucyB7UmVjb3JkPHN0cmluZywgQ3VzdG9tQWN0aW9uPn0gVGhlIGFjdGlvbnMgZnJvbSB0aGUgbWFuaWZlc3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdGlvbnNGcm9tTWFuaWZlc3QoXG5cdG1hbmlmZXN0QWN0aW9uczogUmVjb3JkPHN0cmluZywgTWFuaWZlc3RBY3Rpb24+IHwgdW5kZWZpbmVkLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRhQW5ub3RhdGlvbkFjdGlvbnM/OiBCYXNlQWN0aW9uW10sXG5cdG5hdmlnYXRpb25TZXR0aW5ncz86IE5hdmlnYXRpb25TZXR0aW5nc0NvbmZpZ3VyYXRpb24sXG5cdGNvbnNpZGVyTmF2aWdhdGlvblNldHRpbmdzPzogYm9vbGVhbixcblx0YUhpZGRlbkhlYWRlckFjdGlvbnM/OiBCYXNlQWN0aW9uW10sXG5cdGZhY2V0TmFtZT86IHN0cmluZ1xuKTogUmVjb3JkPHN0cmluZywgQ3VzdG9tQWN0aW9uPiB7XG5cdGNvbnN0IGFjdGlvbnM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj4gPSB7fTtcblx0Zm9yIChjb25zdCBhY3Rpb25LZXkgaW4gbWFuaWZlc3RBY3Rpb25zKSB7XG5cdFx0Y29uc3QgbWFuaWZlc3RBY3Rpb246IE1hbmlmZXN0QWN0aW9uID0gbWFuaWZlc3RBY3Rpb25zW2FjdGlvbktleV07XG5cdFx0Y29uc3QgbGFzdERvdEluZGV4ID0gbWFuaWZlc3RBY3Rpb24ucHJlc3M/Lmxhc3RJbmRleE9mKFwiLlwiKSB8fCAtMTtcblxuXHRcdC8vIFRvIGlkZW50aWZ5IHRoZSBhbm5vdGF0aW9uIGFjdGlvbiBwcm9wZXJ0eSBvdmVyd3JpdGUgdmlhIG1hbmlmZXN0IHVzZS1jYXNlLlxuXHRcdGNvbnN0IGlzQW5ub3RhdGlvbkFjdGlvbiA9IGFBbm5vdGF0aW9uQWN0aW9ucz8uc29tZShhY3Rpb24gPT4gYWN0aW9uLmtleSA9PT0gYWN0aW9uS2V5KSB8fCBmYWxzZTtcblx0XHRpZiAobWFuaWZlc3RBY3Rpb24uZmFjZXROYW1lKSB7XG5cdFx0XHRmYWNldE5hbWUgPSBtYW5pZmVzdEFjdGlvbi5mYWNldE5hbWU7XG5cdFx0fVxuXG5cdFx0YWN0aW9uc1thY3Rpb25LZXldID0ge1xuXHRcdFx0aWQ6IGFBbm5vdGF0aW9uQWN0aW9ucz8uc29tZShhY3Rpb24gPT4gYWN0aW9uLmtleSA9PT0gYWN0aW9uS2V5KSA/IGFjdGlvbktleSA6IEN1c3RvbUFjdGlvbklEKGFjdGlvbktleSksXG5cdFx0XHR2aXNpYmxlOiBtYW5pZmVzdEFjdGlvbi52aXNpYmxlID09PSB1bmRlZmluZWQgPyBcInRydWVcIiA6IG1hbmlmZXN0QWN0aW9uLnZpc2libGUsXG5cdFx0XHRlbmFibGVkOiBfZ2V0TWFuaWZlc3RFbmFibGVkKG1hbmlmZXN0QWN0aW9uLCBpc0Fubm90YXRpb25BY3Rpb24sIGNvbnZlcnRlckNvbnRleHQpLFxuXHRcdFx0aGFuZGxlck1vZHVsZTogbWFuaWZlc3RBY3Rpb24ucHJlc3MgJiYgbWFuaWZlc3RBY3Rpb24ucHJlc3Muc3Vic3RyaW5nKDAsIGxhc3REb3RJbmRleCkucmVwbGFjZSgvXFwuL2dpLCBcIi9cIiksXG5cdFx0XHRoYW5kbGVyTWV0aG9kOiBtYW5pZmVzdEFjdGlvbi5wcmVzcyAmJiBtYW5pZmVzdEFjdGlvbi5wcmVzcy5zdWJzdHJpbmcobGFzdERvdEluZGV4ICsgMSksXG5cdFx0XHRwcmVzczogbWFuaWZlc3RBY3Rpb24ucHJlc3MsXG5cdFx0XHR0eXBlOiBtYW5pZmVzdEFjdGlvbi5tZW51ID8gQWN0aW9uVHlwZS5NZW51IDogQWN0aW9uVHlwZS5EZWZhdWx0LFxuXHRcdFx0dGV4dDogbWFuaWZlc3RBY3Rpb24udGV4dCxcblx0XHRcdG5vV3JhcDogbWFuaWZlc3RBY3Rpb24uX19ub1dyYXAsXG5cdFx0XHRrZXk6IHJlcGxhY2VTcGVjaWFsQ2hhcnMoYWN0aW9uS2V5KSxcblx0XHRcdGVuYWJsZU9uU2VsZWN0OiBtYW5pZmVzdEFjdGlvbi5lbmFibGVPblNlbGVjdCxcblx0XHRcdGRlZmF1bHRWYWx1ZXNFeHRlbnNpb25GdW5jdGlvbjogbWFuaWZlc3RBY3Rpb24uZGVmYXVsdFZhbHVlc0Z1bmN0aW9uLFxuXHRcdFx0cG9zaXRpb246IHtcblx0XHRcdFx0YW5jaG9yOiBtYW5pZmVzdEFjdGlvbi5wb3NpdGlvbj8uYW5jaG9yLFxuXHRcdFx0XHRwbGFjZW1lbnQ6IG1hbmlmZXN0QWN0aW9uLnBvc2l0aW9uID09PSB1bmRlZmluZWQgPyBQbGFjZW1lbnQuQWZ0ZXIgOiBtYW5pZmVzdEFjdGlvbi5wb3NpdGlvbi5wbGFjZW1lbnRcblx0XHRcdH0sXG5cdFx0XHRpc05hdmlnYWJsZTogaXNBY3Rpb25OYXZpZ2FibGUobWFuaWZlc3RBY3Rpb24sIG5hdmlnYXRpb25TZXR0aW5ncywgY29uc2lkZXJOYXZpZ2F0aW9uU2V0dGluZ3MpLFxuXHRcdFx0cmVxdWlyZXNTZWxlY3Rpb246IG1hbmlmZXN0QWN0aW9uLnJlcXVpcmVzU2VsZWN0aW9uID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IG1hbmlmZXN0QWN0aW9uLnJlcXVpcmVzU2VsZWN0aW9uLFxuXHRcdFx0ZW5hYmxlQXV0b1Njcm9sbDogZW5hYmxlQXV0b1Njcm9sbChtYW5pZmVzdEFjdGlvbiksXG5cdFx0XHRtZW51OiBtYW5pZmVzdEFjdGlvbi5tZW51ID8/IFtdLFxuXHRcdFx0ZmFjZXROYW1lOiBtYW5pZmVzdEFjdGlvbi5pbmxpbmUgPyBmYWNldE5hbWUgOiB1bmRlZmluZWRcblx0XHR9O1xuXHR9XG5cdHJldHVybiBwcmVwYXJlTWVudUFjdGlvbihhY3Rpb25zLCBhQW5ub3RhdGlvbkFjdGlvbnMgPz8gW10sIGFIaWRkZW5IZWFkZXJBY3Rpb25zID8/IFtdKTtcbn1cblxuZnVuY3Rpb24gZ2V0TWFuaWZlc3RBY3Rpb25FbmFibGVtZW50KG1hbmlmZXN0QWN0aW9uOiBNYW5pZmVzdEFjdGlvbiwgY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCkge1xuXHRjb25zdCByZXNvbHZlZEJpbmRpbmcgPSByZXNvbHZlQmluZGluZ1N0cmluZyhtYW5pZmVzdEFjdGlvbi5lbmFibGVkIGFzIHN0cmluZywgXCJib29sZWFuXCIpO1xuXHRsZXQgcmVzdWx0OiBhbnk7XG5cdGlmIChpc0NvbnN0YW50KHJlc29sdmVkQmluZGluZykgJiYgcmVzb2x2ZWRCaW5kaW5nLnZhbHVlID09PSB1bmRlZmluZWQpIHtcblx0XHQvLyBObyBlbmFibGVkIHByb3BlcnR5IGNvbmZpZ3VyZWQgaW4gbWFuaWZlc3QgZm9yIHRoZSBjdXN0b20gYWN0aW9uIC0tPiBlbmFibGUgY3VzdG9tIGFjdGlvblxuXHRcdHJlc3VsdCA9IHRydWU7XG5cdH0gZWxzZSBpZiAoaXNDb25zdGFudChyZXNvbHZlZEJpbmRpbmcpICYmIHR5cGVvZiByZXNvbHZlZEJpbmRpbmcudmFsdWUgPT09IFwiYm9vbGVhblwiKSB7XG5cdFx0Ly8gdHJ1ZSAvIGZhbHNlXG5cdFx0cmVzdWx0ID0gcmVzb2x2ZWRCaW5kaW5nLnZhbHVlO1xuXHR9IGVsc2UgaWYgKHJlc29sdmVkQmluZGluZy5fdHlwZSAhPT0gXCJFbWJlZGRlZEJpbmRpbmdcIiAmJiByZXNvbHZlZEJpbmRpbmcuX3R5cGUgIT09IFwiRW1iZWRkZWRFeHByZXNzaW9uQmluZGluZ1wiKSB7XG5cdFx0Ly8gVGhlbiBpdCdzIGEgbW9kdWxlLW1ldGhvZCByZWZlcmVuY2UgXCJzYXAueHh4Lnl5eS5kb1NvbWV0aGluZ1wiXG5cdFx0Y29uc3QgbWV0aG9kUGF0aCA9IHJlc29sdmVkQmluZGluZy52YWx1ZSBhcyBzdHJpbmc7XG5cdFx0cmVzdWx0ID0gZm9ybWF0UmVzdWx0KFxuXHRcdFx0W2JpbmRpbmdFeHByZXNzaW9uKFwiL1wiLCBcIiR2aWV3XCIpLCBtZXRob2RQYXRoLCBiaW5kaW5nRXhwcmVzc2lvbihcInNlbGVjdGVkQ29udGV4dHNcIiwgXCJpbnRlcm5hbFwiKV0sXG5cdFx0XHRmcG1Gb3JtYXR0ZXIuY3VzdG9tSXNFbmFibGVkQ2hlY2sgYXMgYW55LFxuXHRcdFx0Y29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKClcblx0XHQpO1xuXHR9IGVsc2Uge1xuXHRcdC8vIHRoZW4gaXQncyBhIGJpbmRpbmdcblx0XHRyZXN1bHQgPSByZXNvbHZlZEJpbmRpbmc7XG5cdH1cblxuXHQvLyBDb25zaWRlciByZXF1aXJlc1NlbGVjdGlvbiBwcm9wZXJ0eSB0byBpbmNsdWRlIHNlbGVjdGVkQ29udGV4dHMgaW4gdGhlIGJpbmRpbmcgZXhwcmVzc2lvblxuXHRyZXR1cm4gY29tcGlsZUJpbmRpbmcoXG5cdFx0aWZFbHNlKFxuXHRcdFx0bWFuaWZlc3RBY3Rpb24ucmVxdWlyZXNTZWxlY3Rpb24gPT09IHRydWUsXG5cdFx0XHRhbmQoZ3JlYXRlck9yRXF1YWwoYmluZGluZ0V4cHJlc3Npb24oXCJudW1iZXJPZlNlbGVjdGVkQ29udGV4dHNcIiwgXCJpbnRlcm5hbFwiKSwgMSksIHJlc3VsdCksXG5cdFx0XHRyZXN1bHRcblx0XHQpXG5cdCk7XG59XG5cbi8qKlxuICogTWV0aG9kIHRvIGRldGVybWluZSB0aGUgdmFsdWUgb2YgdGhlICdlbmFibGVkJyBwcm9wZXJ0eSBvZiBhbiBhbm5vdGF0aW9uLWJhc2VkIGFjdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0NvbnZlcnRlckNvbnRleHR9IGNvbnZlcnRlckNvbnRleHQgVGhlIGluc3RhbmNlIG9mIHRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHBhcmFtIHtBY3Rpb259IGFjdGlvblRhcmdldCBUaGUgaW5zdGFuY2Ugb2YgdGhlIGFjdGlvblxuICogQHJldHVybnMge0JpbmRpbmdFeHByZXNzaW9uPGJvb2xlYW4+fSBUaGUgYmluZGluZyBleHByZXNzaW9uIGZvciB0aGUgJ2VuYWJsZWQnIHByb3BlcnR5IG9mIHRoZSBhY3Rpb24gYnV0dG9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW5hYmxlZEZvckFubm90YXRpb25BY3Rpb24oXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGFjdGlvblRhcmdldDogQWN0aW9uIHwgdW5kZWZpbmVkXG4pOiBCaW5kaW5nRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdGlmIChhY3Rpb25UYXJnZXQ/LmlzQm91bmQgIT09IHRydWUpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHQvKlxuXHQgICBGSVhNRSBEaXNhYmxlIGZhaWxpbmcgbXVzaWMgdGVzdHNcblx0XHRDdXJyZW50bHkgb24gQ0FQIHRoZSBmb2xsb3dpbmcgYmluZGluZyAod2hpY2ggaXMgdGhlIGdvb2Qgb25lKSBnZW5lcmF0ZXMgZXJyb3I6XG5cdGlmIChhY3Rpb25UYXJnZXQ/LmFubm90YXRpb25zLkNvcmU/Lk9wZXJhdGlvbkF2YWlsYWJsZSA9PT0gbnVsbCkge1xuXHRcdGNvbnN0IHVuYm91bmRBY3Rpb25OYW1lID0gYWN0aW9uVGFyZ2V0LmZ1bGx5UXVhbGlmaWVkTmFtZS5zcGxpdChcIihcIilbMF07XG5cdFx0cmV0dXJuIFwiez0gISR7I1wiICsgdW5ib3VuZEFjdGlvbk5hbWUgKyBcIn0gPyBmYWxzZSA6IHRydWUgfSB9XCI7XG5cdH1cblx0XHRDQVAgdHJpZXMgdG8gcmVhZCB0aGUgYWN0aW9uIGFzIHByb3BlcnR5IGFuZCBkb2Vzbid0IGZpbmQgaXRcblx0Ki9cblx0aWYgKGFjdGlvblRhcmdldD8ucGFyYW1ldGVycz8ubGVuZ3RoKSB7XG5cdFx0Y29uc3QgYmluZGluZ1BhcmFtZXRlckZ1bGxOYW1lID0gYWN0aW9uVGFyZ2V0Py5wYXJhbWV0ZXJzWzBdLmZ1bGx5UXVhbGlmaWVkTmFtZSxcblx0XHRcdG9wZXJhdGlvbkF2YWlsYWJsZUV4cHJlc3Npb24gPSBhbm5vdGF0aW9uRXhwcmVzc2lvbihcblx0XHRcdFx0YWN0aW9uVGFyZ2V0Py5hbm5vdGF0aW9ucy5Db3JlPy5PcGVyYXRpb25BdmFpbGFibGUsXG5cdFx0XHRcdFtdLFxuXHRcdFx0XHR1bmRlZmluZWQsXG5cdFx0XHRcdChwYXRoOiBzdHJpbmcpID0+IGJpbmRpbmdDb250ZXh0UGF0aFZpc2l0b3IocGF0aCwgY29udmVydGVyQ29udGV4dCwgYmluZGluZ1BhcmFtZXRlckZ1bGxOYW1lKVxuXHRcdFx0KSBhcyBCaW5kaW5nRXhwcmVzc2lvbkV4cHJlc3Npb248Ym9vbGVhbj47XG5cdFx0aWYgKGFjdGlvblRhcmdldD8uYW5ub3RhdGlvbnMuQ29yZT8uT3BlcmF0aW9uQXZhaWxhYmxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiBjb21waWxlQmluZGluZyhlcXVhbChvcGVyYXRpb25BdmFpbGFibGVFeHByZXNzaW9uLCB0cnVlKSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VtYW50aWNPYmplY3RNYXBwaW5nKGFNYXBwaW5nczogYW55W10pOiBhbnlbXSB7XG5cdGNvbnN0IGFTZW1hbnRpY09iamVjdE1hcHBpbmdzOiBhbnlbXSA9IFtdO1xuXHRhTWFwcGluZ3MuZm9yRWFjaChvTWFwcGluZyA9PiB7XG5cdFx0Y29uc3Qgb1NPTWFwcGluZyA9IHtcblx0XHRcdFwiTG9jYWxQcm9wZXJ0eVwiOiB7XG5cdFx0XHRcdFwiJFByb3BlcnR5UGF0aFwiOiBvTWFwcGluZy5Mb2NhbFByb3BlcnR5LnZhbHVlXG5cdFx0XHR9LFxuXHRcdFx0XCJTZW1hbnRpY09iamVjdFByb3BlcnR5XCI6IG9NYXBwaW5nLlNlbWFudGljT2JqZWN0UHJvcGVydHlcblx0XHR9O1xuXHRcdGFTZW1hbnRpY09iamVjdE1hcHBpbmdzLnB1c2gob1NPTWFwcGluZyk7XG5cdH0pO1xuXHRyZXR1cm4gYVNlbWFudGljT2JqZWN0TWFwcGluZ3M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FjdGlvbk5hdmlnYWJsZShcblx0YWN0aW9uOiBNYW5pZmVzdEFjdGlvbiB8IE1hbmlmZXN0VGFibGVDb2x1bW4sXG5cdG5hdmlnYXRpb25TZXR0aW5ncz86IE5hdmlnYXRpb25TZXR0aW5nc0NvbmZpZ3VyYXRpb24sXG5cdGNvbnNpZGVyTmF2aWdhdGlvblNldHRpbmdzPzogYm9vbGVhblxuKTogYm9vbGVhbiB7XG5cdGxldCBiSXNOYXZpZ2F0aW9uQ29uZmlndXJlZDogYm9vbGVhbiA9IHRydWU7XG5cdGlmIChjb25zaWRlck5hdmlnYXRpb25TZXR0aW5ncykge1xuXHRcdGNvbnN0IGRldGFpbE9yRGlzcGxheSA9IG5hdmlnYXRpb25TZXR0aW5ncyAmJiAobmF2aWdhdGlvblNldHRpbmdzLmRldGFpbCB8fCBuYXZpZ2F0aW9uU2V0dGluZ3MuZGlzcGxheSk7XG5cdFx0YklzTmF2aWdhdGlvbkNvbmZpZ3VyZWQgPSBkZXRhaWxPckRpc3BsYXk/LnJvdXRlID8gdHJ1ZSA6IGZhbHNlO1xuXHR9XG5cdC8vIHdoZW4gZW5hYmxlQXV0b1Njcm9sbCBpcyB0cnVlIHRoZSBuYXZpZ2F0ZVRvSW5zdGFuY2UgZmVhdHVyZSBpcyBkaXNhYmxlZFxuXHRpZiAoXG5cdFx0KGFjdGlvbiAmJlxuXHRcdFx0YWN0aW9uLmFmdGVyRXhlY3V0aW9uICYmXG5cdFx0XHQoYWN0aW9uLmFmdGVyRXhlY3V0aW9uPy5uYXZpZ2F0ZVRvSW5zdGFuY2UgPT09IGZhbHNlIHx8IGFjdGlvbi5hZnRlckV4ZWN1dGlvbj8uZW5hYmxlQXV0b1Njcm9sbCA9PT0gdHJ1ZSkpIHx8XG5cdFx0IWJJc05hdmlnYXRpb25Db25maWd1cmVkXG5cdCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRyZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuYWJsZUF1dG9TY3JvbGwoYWN0aW9uOiBNYW5pZmVzdEFjdGlvbik6IGJvb2xlYW4ge1xuXHRyZXR1cm4gYWN0aW9uPy5hZnRlckV4ZWN1dGlvbj8uZW5hYmxlQXV0b1Njcm9sbCA9PT0gdHJ1ZTtcbn1cbiJdfQ==