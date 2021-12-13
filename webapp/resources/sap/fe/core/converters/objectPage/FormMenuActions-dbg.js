/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/helpers/Key"], function (Key) {
  "use strict";

  var _exports = {};
  var KeyHelper = Key.KeyHelper;

  var ActionType;

  (function (ActionType) {
    ActionType["Default"] = "Default";
  })(ActionType || (ActionType = {}));

  var getVisibilityEnablementFormMenuActions = function (actions) {
    var menuActionVisible, menuActionVisiblePaths;
    actions.forEach(function (menuActions) {
      var _menuActions$menu;

      menuActionVisible = false;
      menuActionVisiblePaths = [];

      if (menuActions !== null && menuActions !== void 0 && (_menuActions$menu = menuActions.menu) !== null && _menuActions$menu !== void 0 && _menuActions$menu.length) {
        var _menuActions$menu2;

        menuActions === null || menuActions === void 0 ? void 0 : (_menuActions$menu2 = menuActions.menu) === null || _menuActions$menu2 === void 0 ? void 0 : _menuActions$menu2.forEach(function (menuItem) {
          var menuItemVisible = menuItem.visible;

          if (!menuActionVisible) {
            if (menuItemVisible && typeof menuItemVisible === "boolean" || menuItemVisible.valueOf() === "true") {
              menuActionVisible = true;
            } else if (menuItemVisible && menuItemVisible.valueOf() !== "false") {
              menuActionVisiblePaths.push(menuItemVisible.valueOf());
            }
          }
        });

        if (menuActionVisiblePaths.length) {
          menuActions.visible = menuActionVisiblePaths;
        } else {
          menuActions.visible = menuActionVisible;
        }
      }
    });
    return actions;
  };

  _exports.getVisibilityEnablementFormMenuActions = getVisibilityEnablementFormMenuActions;

  var mergeFormActions = function (source, target) {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }

    return source;
  };

  _exports.mergeFormActions = mergeFormActions;

  var getFormHiddenActions = function (facetDefinition, converterContext) {
    var _converterContext$get, _converterContext$get2;

    var formActions = getFormActions(facetDefinition, converterContext) || [],
        annotations = converterContext === null || converterContext === void 0 ? void 0 : (_converterContext$get = converterContext.getEntityType()) === null || _converterContext$get === void 0 ? void 0 : (_converterContext$get2 = _converterContext$get.annotations) === null || _converterContext$get2 === void 0 ? void 0 : _converterContext$get2.UI;
    var hiddenFormActions = [];

    for (var property in annotations) {
      var _annotations$property, _annotations$property3, _annotations$property4;

      if (((_annotations$property = annotations[property]) === null || _annotations$property === void 0 ? void 0 : _annotations$property.$Type) === "com.sap.vocabularies.UI.v1.FieldGroupType") {
        var _annotations$property2;

        (_annotations$property2 = annotations[property]) === null || _annotations$property2 === void 0 ? void 0 : _annotations$property2.Data.forEach(function (dataField) {
          if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" && formActions.hasOwnProperty("DataFieldForAction::" + dataField.Action)) {
            var _dataField$annotation, _dataField$annotation2, _dataField$annotation3;

            if ((dataField === null || dataField === void 0 ? void 0 : (_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : (_dataField$annotation2 = _dataField$annotation.UI) === null || _dataField$annotation2 === void 0 ? void 0 : (_dataField$annotation3 = _dataField$annotation2.Hidden) === null || _dataField$annotation3 === void 0 ? void 0 : _dataField$annotation3.valueOf()) === true) {
              hiddenFormActions.push({
                type: ActionType.Default,
                key: KeyHelper.generateKeyFromDataField(dataField)
              });
            }
          } else if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" && formActions.hasOwnProperty("DataFieldForIntentBasedNavigation::" + dataField.Action)) {
            var _dataField$annotation4, _dataField$annotation5, _dataField$annotation6;

            if ((dataField === null || dataField === void 0 ? void 0 : (_dataField$annotation4 = dataField.annotations) === null || _dataField$annotation4 === void 0 ? void 0 : (_dataField$annotation5 = _dataField$annotation4.UI) === null || _dataField$annotation5 === void 0 ? void 0 : (_dataField$annotation6 = _dataField$annotation5.Hidden) === null || _dataField$annotation6 === void 0 ? void 0 : _dataField$annotation6.valueOf()) === true) {
              hiddenFormActions.push({
                type: ActionType.Default,
                key: KeyHelper.generateKeyFromDataField(dataField)
              });
            }
          }
        });
      } else if (((_annotations$property3 = annotations[property]) === null || _annotations$property3 === void 0 ? void 0 : _annotations$property3.term) === "com.sap.vocabularies.UI.v1.Identification" || ((_annotations$property4 = annotations[property]) === null || _annotations$property4 === void 0 ? void 0 : _annotations$property4.term) === "@com.sap.vocabularies.UI.v1.StatusInfo") {
        var _annotations$property5;

        (_annotations$property5 = annotations[property]) === null || _annotations$property5 === void 0 ? void 0 : _annotations$property5.forEach(function (dataField) {
          if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" && formActions.hasOwnProperty("DataFieldForAction::" + dataField.Action)) {
            var _dataField$annotation7, _dataField$annotation8, _dataField$annotation9;

            if ((dataField === null || dataField === void 0 ? void 0 : (_dataField$annotation7 = dataField.annotations) === null || _dataField$annotation7 === void 0 ? void 0 : (_dataField$annotation8 = _dataField$annotation7.UI) === null || _dataField$annotation8 === void 0 ? void 0 : (_dataField$annotation9 = _dataField$annotation8.Hidden) === null || _dataField$annotation9 === void 0 ? void 0 : _dataField$annotation9.valueOf()) === true) {
              hiddenFormActions.push({
                type: ActionType.Default,
                key: KeyHelper.generateKeyFromDataField(dataField)
              });
            }
          } else if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" && formActions.hasOwnProperty("DataFieldForIntentBasedNavigation::" + dataField.Action)) {
            var _dataField$annotation10, _dataField$annotation11, _dataField$annotation12;

            if ((dataField === null || dataField === void 0 ? void 0 : (_dataField$annotation10 = dataField.annotations) === null || _dataField$annotation10 === void 0 ? void 0 : (_dataField$annotation11 = _dataField$annotation10.UI) === null || _dataField$annotation11 === void 0 ? void 0 : (_dataField$annotation12 = _dataField$annotation11.Hidden) === null || _dataField$annotation12 === void 0 ? void 0 : _dataField$annotation12.valueOf()) === true) {
              hiddenFormActions.push({
                type: ActionType.Default,
                key: KeyHelper.generateKeyFromDataField(dataField)
              });
            }
          }
        });
      }
    }

    return hiddenFormActions;
  };

  _exports.getFormHiddenActions = getFormHiddenActions;

  var getFormActions = function (facetDefinition, converterContext) {
    var manifestWrapper = converterContext.getManifestWrapper();
    var targetValue, manifestFormContainer;
    var actions = {};

    if ((facetDefinition === null || facetDefinition === void 0 ? void 0 : facetDefinition.$Type) === "com.sap.vocabularies.UI.v1.CollectionFacet") {
      if (facetDefinition !== null && facetDefinition !== void 0 && facetDefinition.Facets) {
        facetDefinition === null || facetDefinition === void 0 ? void 0 : facetDefinition.Facets.forEach(function (facet) {
          var _facet$Target, _manifestFormContaine;

          targetValue = facet === null || facet === void 0 ? void 0 : (_facet$Target = facet.Target) === null || _facet$Target === void 0 ? void 0 : _facet$Target.value;
          manifestFormContainer = manifestWrapper.getFormContainer(targetValue);

          if ((_manifestFormContaine = manifestFormContainer) !== null && _manifestFormContaine !== void 0 && _manifestFormContaine.actions) {
            var _manifestFormContaine2;

            for (var actionKey in manifestFormContainer.actions) {
              // store the correct facet an action is belonging to for the case it's an inline form action
              manifestFormContainer.actions[actionKey].facetName = facet.fullyQualifiedName;
            }

            actions = mergeFormActions((_manifestFormContaine2 = manifestFormContainer) === null || _manifestFormContaine2 === void 0 ? void 0 : _manifestFormContaine2.actions, actions);
          }
        });
      }
    } else if ((facetDefinition === null || facetDefinition === void 0 ? void 0 : facetDefinition.$Type) === "com.sap.vocabularies.UI.v1.ReferenceFacet") {
      var _facetDefinition$Targ, _manifestFormContaine3;

      targetValue = facetDefinition === null || facetDefinition === void 0 ? void 0 : (_facetDefinition$Targ = facetDefinition.Target) === null || _facetDefinition$Targ === void 0 ? void 0 : _facetDefinition$Targ.value;
      manifestFormContainer = manifestWrapper.getFormContainer(targetValue);

      if ((_manifestFormContaine3 = manifestFormContainer) !== null && _manifestFormContaine3 !== void 0 && _manifestFormContaine3.actions) {
        for (var actionKey in manifestFormContainer.actions) {
          // store the correct facet an action is belonging to for the case it's an inline form action
          manifestFormContainer.actions[actionKey].facetName = facetDefinition.fullyQualifiedName;
        }

        actions = manifestFormContainer.actions;
      }
    }

    return actions;
  };

  _exports.getFormActions = getFormActions;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZvcm1NZW51QWN0aW9ucy50cyJdLCJuYW1lcyI6WyJBY3Rpb25UeXBlIiwiZ2V0VmlzaWJpbGl0eUVuYWJsZW1lbnRGb3JtTWVudUFjdGlvbnMiLCJhY3Rpb25zIiwibWVudUFjdGlvblZpc2libGUiLCJtZW51QWN0aW9uVmlzaWJsZVBhdGhzIiwiZm9yRWFjaCIsIm1lbnVBY3Rpb25zIiwibWVudSIsImxlbmd0aCIsIm1lbnVJdGVtIiwibWVudUl0ZW1WaXNpYmxlIiwidmlzaWJsZSIsInZhbHVlT2YiLCJwdXNoIiwibWVyZ2VGb3JtQWN0aW9ucyIsInNvdXJjZSIsInRhcmdldCIsImtleSIsImhhc093blByb3BlcnR5IiwiZ2V0Rm9ybUhpZGRlbkFjdGlvbnMiLCJmYWNldERlZmluaXRpb24iLCJjb252ZXJ0ZXJDb250ZXh0IiwiZm9ybUFjdGlvbnMiLCJnZXRGb3JtQWN0aW9ucyIsImFubm90YXRpb25zIiwiZ2V0RW50aXR5VHlwZSIsIlVJIiwiaGlkZGVuRm9ybUFjdGlvbnMiLCJwcm9wZXJ0eSIsIiRUeXBlIiwiRGF0YSIsImRhdGFGaWVsZCIsIkFjdGlvbiIsIkhpZGRlbiIsInR5cGUiLCJEZWZhdWx0IiwiS2V5SGVscGVyIiwiZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkIiwidGVybSIsIm1hbmlmZXN0V3JhcHBlciIsImdldE1hbmlmZXN0V3JhcHBlciIsInRhcmdldFZhbHVlIiwibWFuaWZlc3RGb3JtQ29udGFpbmVyIiwiRmFjZXRzIiwiZmFjZXQiLCJUYXJnZXQiLCJ2YWx1ZSIsImdldEZvcm1Db250YWluZXIiLCJhY3Rpb25LZXkiLCJmYWNldE5hbWUiLCJmdWxseVF1YWxpZmllZE5hbWUiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7Ozs7Ozs7TUFLS0EsVTs7YUFBQUEsVTtBQUFBQSxJQUFBQSxVO0tBQUFBLFUsS0FBQUEsVTs7QUF1QkUsTUFBTUMsc0NBQXNDLEdBQUcsVUFBQ0MsT0FBRCxFQUF5QztBQUM5RixRQUFJQyxpQkFBSixFQUF5Q0Msc0JBQXpDO0FBQ0FGLElBQUFBLE9BQU8sQ0FBQ0csT0FBUixDQUFnQixVQUFDQyxXQUFELEVBQWlDO0FBQUE7O0FBQ2hESCxNQUFBQSxpQkFBaUIsR0FBRyxLQUFwQjtBQUNBQyxNQUFBQSxzQkFBc0IsR0FBRyxFQUF6Qjs7QUFDQSxVQUFJRSxXQUFKLGFBQUlBLFdBQUosb0NBQUlBLFdBQVcsQ0FBRUMsSUFBakIsOENBQUksa0JBQW1CQyxNQUF2QixFQUErQjtBQUFBOztBQUM5QkYsUUFBQUEsV0FBVyxTQUFYLElBQUFBLFdBQVcsV0FBWCxrQ0FBQUEsV0FBVyxDQUFFQyxJQUFiLDBFQUFtQkYsT0FBbkIsQ0FBMkIsVUFBQ0ksUUFBRCxFQUFtQjtBQUM3QyxjQUFNQyxlQUFlLEdBQUdELFFBQVEsQ0FBQ0UsT0FBakM7O0FBQ0EsY0FBSSxDQUFDUixpQkFBTCxFQUF3QjtBQUN2QixnQkFBS08sZUFBZSxJQUFJLE9BQU9BLGVBQVAsS0FBMkIsU0FBL0MsSUFBNkRBLGVBQWUsQ0FBQ0UsT0FBaEIsT0FBOEIsTUFBL0YsRUFBdUc7QUFDdEdULGNBQUFBLGlCQUFpQixHQUFHLElBQXBCO0FBQ0EsYUFGRCxNQUVPLElBQUlPLGVBQWUsSUFBSUEsZUFBZSxDQUFDRSxPQUFoQixPQUE4QixPQUFyRCxFQUE4RDtBQUNwRVIsY0FBQUEsc0JBQXNCLENBQUNTLElBQXZCLENBQTRCSCxlQUFlLENBQUNFLE9BQWhCLEVBQTVCO0FBQ0E7QUFDRDtBQUNELFNBVEQ7O0FBVUEsWUFBSVIsc0JBQXNCLENBQUNJLE1BQTNCLEVBQW1DO0FBQ2xDRixVQUFBQSxXQUFXLENBQUNLLE9BQVosR0FBc0JQLHNCQUF0QjtBQUNBLFNBRkQsTUFFTztBQUNORSxVQUFBQSxXQUFXLENBQUNLLE9BQVosR0FBc0JSLGlCQUF0QjtBQUNBO0FBQ0Q7QUFDRCxLQXBCRDtBQXFCQSxXQUFPRCxPQUFQO0FBQ0EsR0F4Qk07Ozs7QUEwQkEsTUFBTVksZ0JBQWdCLEdBQUcsVUFDL0JDLE1BRCtCLEVBRS9CQyxNQUYrQixFQUdTO0FBQ3hDLFNBQUssSUFBTUMsR0FBWCxJQUFrQkYsTUFBbEIsRUFBMEI7QUFDekIsVUFBSUEsTUFBTSxDQUFDRyxjQUFQLENBQXNCRCxHQUF0QixDQUFKLEVBQWdDO0FBQy9CRCxRQUFBQSxNQUFNLENBQUNDLEdBQUQsQ0FBTixHQUFjRixNQUFNLENBQUNFLEdBQUQsQ0FBcEI7QUFDQTtBQUNEOztBQUNELFdBQU9GLE1BQVA7QUFDQSxHQVZNOzs7O0FBWUEsTUFBTUksb0JBQW9CLEdBQUcsVUFBQ0MsZUFBRCxFQUE4QkMsZ0JBQTlCLEVBQW1GO0FBQUE7O0FBQ3RILFFBQU1DLFdBQStDLEdBQUdDLGNBQWMsQ0FBQ0gsZUFBRCxFQUFrQkMsZ0JBQWxCLENBQWQsSUFBcUQsRUFBN0c7QUFBQSxRQUNDRyxXQUFnQixHQUFHSCxnQkFBSCxhQUFHQSxnQkFBSCxnREFBR0EsZ0JBQWdCLENBQUVJLGFBQWxCLEVBQUgsb0ZBQUcsc0JBQW1DRCxXQUF0QywyREFBRyx1QkFBZ0RFLEVBRHBFO0FBRUEsUUFBTUMsaUJBQStCLEdBQUcsRUFBeEM7O0FBQ0EsU0FBSyxJQUFNQyxRQUFYLElBQXVCSixXQUF2QixFQUFvQztBQUFBOztBQUNuQyxVQUFJLDBCQUFBQSxXQUFXLENBQUNJLFFBQUQsQ0FBWCxnRkFBdUJDLEtBQXZCLE1BQWlDLDJDQUFyQyxFQUFrRjtBQUFBOztBQUNqRixrQ0FBQUwsV0FBVyxDQUFDSSxRQUFELENBQVgsa0ZBQXVCRSxJQUF2QixDQUE0QnpCLE9BQTVCLENBQW9DLFVBQUMwQixTQUFELEVBQW9CO0FBQ3ZELGNBQ0NBLFNBQVMsQ0FBQ0YsS0FBVixLQUFvQiwrQ0FBcEIsSUFDQVAsV0FBVyxDQUFDSixjQUFaLENBQTJCLHlCQUF5QmEsU0FBUyxDQUFDQyxNQUE5RCxDQUZELEVBR0U7QUFBQTs7QUFDRCxnQkFBSSxDQUFBRCxTQUFTLFNBQVQsSUFBQUEsU0FBUyxXQUFULHFDQUFBQSxTQUFTLENBQUVQLFdBQVgsMEdBQXdCRSxFQUF4Qiw0R0FBNEJPLE1BQTVCLGtGQUFvQ3JCLE9BQXBDLFFBQWtELElBQXRELEVBQTREO0FBQzNEZSxjQUFBQSxpQkFBaUIsQ0FBQ2QsSUFBbEIsQ0FBdUI7QUFDdEJxQixnQkFBQUEsSUFBSSxFQUFFbEMsVUFBVSxDQUFDbUMsT0FESztBQUV0QmxCLGdCQUFBQSxHQUFHLEVBQUVtQixTQUFTLENBQUNDLHdCQUFWLENBQW1DTixTQUFuQztBQUZpQixlQUF2QjtBQUlBO0FBQ0QsV0FWRCxNQVVPLElBQ05BLFNBQVMsQ0FBQ0YsS0FBVixLQUFvQiw4REFBcEIsSUFDQVAsV0FBVyxDQUFDSixjQUFaLENBQTJCLHdDQUF3Q2EsU0FBUyxDQUFDQyxNQUE3RSxDQUZNLEVBR0w7QUFBQTs7QUFDRCxnQkFBSSxDQUFBRCxTQUFTLFNBQVQsSUFBQUEsU0FBUyxXQUFULHNDQUFBQSxTQUFTLENBQUVQLFdBQVgsNEdBQXdCRSxFQUF4Qiw0R0FBNEJPLE1BQTVCLGtGQUFvQ3JCLE9BQXBDLFFBQWtELElBQXRELEVBQTREO0FBQzNEZSxjQUFBQSxpQkFBaUIsQ0FBQ2QsSUFBbEIsQ0FBdUI7QUFDdEJxQixnQkFBQUEsSUFBSSxFQUFFbEMsVUFBVSxDQUFDbUMsT0FESztBQUV0QmxCLGdCQUFBQSxHQUFHLEVBQUVtQixTQUFTLENBQUNDLHdCQUFWLENBQW1DTixTQUFuQztBQUZpQixlQUF2QjtBQUlBO0FBQ0Q7QUFDRCxTQXRCRDtBQXVCQSxPQXhCRCxNQXdCTyxJQUNOLDJCQUFBUCxXQUFXLENBQUNJLFFBQUQsQ0FBWCxrRkFBdUJVLElBQXZCLE1BQWdDLDJDQUFoQyxJQUNBLDJCQUFBZCxXQUFXLENBQUNJLFFBQUQsQ0FBWCxrRkFBdUJVLElBQXZCLE1BQWdDLHdDQUYxQixFQUdMO0FBQUE7O0FBQ0Qsa0NBQUFkLFdBQVcsQ0FBQ0ksUUFBRCxDQUFYLGtGQUF1QnZCLE9BQXZCLENBQStCLFVBQUMwQixTQUFELEVBQW9CO0FBQ2xELGNBQ0NBLFNBQVMsQ0FBQ0YsS0FBVixLQUFvQiwrQ0FBcEIsSUFDQVAsV0FBVyxDQUFDSixjQUFaLENBQTJCLHlCQUF5QmEsU0FBUyxDQUFDQyxNQUE5RCxDQUZELEVBR0U7QUFBQTs7QUFDRCxnQkFBSSxDQUFBRCxTQUFTLFNBQVQsSUFBQUEsU0FBUyxXQUFULHNDQUFBQSxTQUFTLENBQUVQLFdBQVgsNEdBQXdCRSxFQUF4Qiw0R0FBNEJPLE1BQTVCLGtGQUFvQ3JCLE9BQXBDLFFBQWtELElBQXRELEVBQTREO0FBQzNEZSxjQUFBQSxpQkFBaUIsQ0FBQ2QsSUFBbEIsQ0FBdUI7QUFDdEJxQixnQkFBQUEsSUFBSSxFQUFFbEMsVUFBVSxDQUFDbUMsT0FESztBQUV0QmxCLGdCQUFBQSxHQUFHLEVBQUVtQixTQUFTLENBQUNDLHdCQUFWLENBQW1DTixTQUFuQztBQUZpQixlQUF2QjtBQUlBO0FBQ0QsV0FWRCxNQVVPLElBQ05BLFNBQVMsQ0FBQ0YsS0FBVixLQUFvQiw4REFBcEIsSUFDQVAsV0FBVyxDQUFDSixjQUFaLENBQTJCLHdDQUF3Q2EsU0FBUyxDQUFDQyxNQUE3RSxDQUZNLEVBR0w7QUFBQTs7QUFDRCxnQkFBSSxDQUFBRCxTQUFTLFNBQVQsSUFBQUEsU0FBUyxXQUFULHVDQUFBQSxTQUFTLENBQUVQLFdBQVgsK0dBQXdCRSxFQUF4QiwrR0FBNEJPLE1BQTVCLG9GQUFvQ3JCLE9BQXBDLFFBQWtELElBQXRELEVBQTREO0FBQzNEZSxjQUFBQSxpQkFBaUIsQ0FBQ2QsSUFBbEIsQ0FBdUI7QUFDdEJxQixnQkFBQUEsSUFBSSxFQUFFbEMsVUFBVSxDQUFDbUMsT0FESztBQUV0QmxCLGdCQUFBQSxHQUFHLEVBQUVtQixTQUFTLENBQUNDLHdCQUFWLENBQW1DTixTQUFuQztBQUZpQixlQUF2QjtBQUlBO0FBQ0Q7QUFDRCxTQXRCRDtBQXVCQTtBQUNEOztBQUNELFdBQU9KLGlCQUFQO0FBQ0EsR0EzRE07Ozs7QUE2REEsTUFBTUosY0FBYyxHQUFHLFVBQUNILGVBQUQsRUFBOEJDLGdCQUE5QixFQUF5RztBQUN0SSxRQUFNa0IsZUFBZSxHQUFHbEIsZ0JBQWdCLENBQUNtQixrQkFBakIsRUFBeEI7QUFDQSxRQUFJQyxXQUFKLEVBQXlCQyxxQkFBekI7QUFDQSxRQUFJeEMsT0FBMkMsR0FBRyxFQUFsRDs7QUFDQSxRQUFJLENBQUFrQixlQUFlLFNBQWYsSUFBQUEsZUFBZSxXQUFmLFlBQUFBLGVBQWUsQ0FBRVMsS0FBakIsTUFBMkIsNENBQS9CLEVBQTZFO0FBQzVFLFVBQUlULGVBQUosYUFBSUEsZUFBSixlQUFJQSxlQUFlLENBQUV1QixNQUFyQixFQUE2QjtBQUM1QnZCLFFBQUFBLGVBQWUsU0FBZixJQUFBQSxlQUFlLFdBQWYsWUFBQUEsZUFBZSxDQUFFdUIsTUFBakIsQ0FBd0J0QyxPQUF4QixDQUFnQyxVQUFDdUMsS0FBRCxFQUFnQjtBQUFBOztBQUMvQ0gsVUFBQUEsV0FBVyxHQUFHRyxLQUFILGFBQUdBLEtBQUgsd0NBQUdBLEtBQUssQ0FBRUMsTUFBVixrREFBRyxjQUFlQyxLQUE3QjtBQUNBSixVQUFBQSxxQkFBcUIsR0FBR0gsZUFBZSxDQUFDUSxnQkFBaEIsQ0FBaUNOLFdBQWpDLENBQXhCOztBQUNBLHVDQUFJQyxxQkFBSixrREFBSSxzQkFBdUJ4QyxPQUEzQixFQUFvQztBQUFBOztBQUNuQyxpQkFBSyxJQUFNOEMsU0FBWCxJQUF3Qk4scUJBQXFCLENBQUN4QyxPQUE5QyxFQUF1RDtBQUN0RDtBQUNBd0MsY0FBQUEscUJBQXFCLENBQUN4QyxPQUF0QixDQUE4QjhDLFNBQTlCLEVBQXlDQyxTQUF6QyxHQUFxREwsS0FBSyxDQUFDTSxrQkFBM0Q7QUFDQTs7QUFDRGhELFlBQUFBLE9BQU8sR0FBR1ksZ0JBQWdCLDJCQUFDNEIscUJBQUQsMkRBQUMsdUJBQXVCeEMsT0FBeEIsRUFBd0NBLE9BQXhDLENBQTFCO0FBQ0E7QUFDRCxTQVZEO0FBV0E7QUFDRCxLQWRELE1BY08sSUFBSSxDQUFBa0IsZUFBZSxTQUFmLElBQUFBLGVBQWUsV0FBZixZQUFBQSxlQUFlLENBQUVTLEtBQWpCLE1BQTJCLDJDQUEvQixFQUE0RTtBQUFBOztBQUNsRlksTUFBQUEsV0FBVyxHQUFHckIsZUFBSCxhQUFHQSxlQUFILGdEQUFHQSxlQUFlLENBQUV5QixNQUFwQiwwREFBRyxzQkFBeUJDLEtBQXZDO0FBQ0FKLE1BQUFBLHFCQUFxQixHQUFHSCxlQUFlLENBQUNRLGdCQUFoQixDQUFpQ04sV0FBakMsQ0FBeEI7O0FBQ0Esb0NBQUlDLHFCQUFKLG1EQUFJLHVCQUF1QnhDLE9BQTNCLEVBQW9DO0FBQ25DLGFBQUssSUFBTThDLFNBQVgsSUFBd0JOLHFCQUFxQixDQUFDeEMsT0FBOUMsRUFBdUQ7QUFDdEQ7QUFDQXdDLFVBQUFBLHFCQUFxQixDQUFDeEMsT0FBdEIsQ0FBOEI4QyxTQUE5QixFQUF5Q0MsU0FBekMsR0FBcUQ3QixlQUFlLENBQUM4QixrQkFBckU7QUFDQTs7QUFDRGhELFFBQUFBLE9BQU8sR0FBR3dDLHFCQUFxQixDQUFDeEMsT0FBaEM7QUFDQTtBQUNEOztBQUNELFdBQU9BLE9BQVA7QUFDQSxHQTlCTSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZUFjdGlvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9BY3Rpb25cIjtcbmltcG9ydCB7IEZhY2V0VHlwZXMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcbmltcG9ydCB7IEtleUhlbHBlciB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvS2V5XCI7XG5pbXBvcnQgeyBDb25maWd1cmFibGVSZWNvcmQsIFBvc2l0aW9uYWJsZSB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvQ29uZmlndXJhYmxlT2JqZWN0XCI7XG5pbXBvcnQgQ29udmVydGVyQ29udGV4dCBmcm9tIFwiLi4vQ29udmVydGVyQ29udGV4dFwiO1xuaW1wb3J0IHsgTWFuaWZlc3RBY3Rpb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9NYW5pZmVzdFNldHRpbmdzXCI7XG5cbmVudW0gQWN0aW9uVHlwZSB7XG5cdERlZmF1bHQgPSBcIkRlZmF1bHRcIlxufVxudHlwZSBBY3Rpb25BZnRlckV4ZWN1dGlvbkNvbmZpZ3VyYXRpb24gPSB7XG5cdG5hdmlnYXRlVG9JbnN0YW5jZTogYm9vbGVhbjtcblx0ZW5hYmxlQXV0b1Njcm9sbDogYm9vbGVhbjtcbn07XG50eXBlIEZvcm1NYW5pZmVzdENvbmZpZ3VyYXRpb24gPSB7XG5cdGZpZWxkczogQ29uZmlndXJhYmxlUmVjb3JkPE1hbmlmZXN0Rm9ybUVsZW1lbnQ+O1xuXHRhY3Rpb25zPzogQ29uZmlndXJhYmxlUmVjb3JkPEJhc2VBY3Rpb24+O1xufTtcbnR5cGUgTWFuaWZlc3RGb3JtRWxlbWVudCA9IFBvc2l0aW9uYWJsZSAmIHtcblx0dGVtcGxhdGU6IHN0cmluZztcblx0bGFiZWw/OiBzdHJpbmc7XG59O1xudHlwZSBGb3JtTWVudUFjdGlvbiA9XG5cdHwgQmFzZUFjdGlvblxuXHR8IHtcblx0XHRcdHZpc2libGU/OiBzdHJpbmdbXTtcblx0XHRcdGVuYWJsZWQ/OiBzdHJpbmdbXTtcblx0XHRcdG1lbnU/OiAoc3RyaW5nIHwgQmFzZUFjdGlvbilbXTtcblx0ICB9O1xuXG5leHBvcnQgY29uc3QgZ2V0VmlzaWJpbGl0eUVuYWJsZW1lbnRGb3JtTWVudUFjdGlvbnMgPSAoYWN0aW9uczogQmFzZUFjdGlvbltdKTogQmFzZUFjdGlvbltdID0+IHtcblx0bGV0IG1lbnVBY3Rpb25WaXNpYmxlOiBzdHJpbmcgfCBib29sZWFuLCBtZW51QWN0aW9uVmlzaWJsZVBhdGhzOiBzdHJpbmdbXTtcblx0YWN0aW9ucy5mb3JFYWNoKChtZW51QWN0aW9uczogRm9ybU1lbnVBY3Rpb24pID0+IHtcblx0XHRtZW51QWN0aW9uVmlzaWJsZSA9IGZhbHNlO1xuXHRcdG1lbnVBY3Rpb25WaXNpYmxlUGF0aHMgPSBbXTtcblx0XHRpZiAobWVudUFjdGlvbnM/Lm1lbnU/Lmxlbmd0aCkge1xuXHRcdFx0bWVudUFjdGlvbnM/Lm1lbnU/LmZvckVhY2goKG1lbnVJdGVtOiBhbnkpID0+IHtcblx0XHRcdFx0Y29uc3QgbWVudUl0ZW1WaXNpYmxlID0gbWVudUl0ZW0udmlzaWJsZTtcblx0XHRcdFx0aWYgKCFtZW51QWN0aW9uVmlzaWJsZSkge1xuXHRcdFx0XHRcdGlmICgobWVudUl0ZW1WaXNpYmxlICYmIHR5cGVvZiBtZW51SXRlbVZpc2libGUgPT09IFwiYm9vbGVhblwiKSB8fCBtZW51SXRlbVZpc2libGUudmFsdWVPZigpID09PSBcInRydWVcIikge1xuXHRcdFx0XHRcdFx0bWVudUFjdGlvblZpc2libGUgPSB0cnVlO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAobWVudUl0ZW1WaXNpYmxlICYmIG1lbnVJdGVtVmlzaWJsZS52YWx1ZU9mKCkgIT09IFwiZmFsc2VcIikge1xuXHRcdFx0XHRcdFx0bWVudUFjdGlvblZpc2libGVQYXRocy5wdXNoKG1lbnVJdGVtVmlzaWJsZS52YWx1ZU9mKCkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRpZiAobWVudUFjdGlvblZpc2libGVQYXRocy5sZW5ndGgpIHtcblx0XHRcdFx0bWVudUFjdGlvbnMudmlzaWJsZSA9IG1lbnVBY3Rpb25WaXNpYmxlUGF0aHM7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtZW51QWN0aW9ucy52aXNpYmxlID0gbWVudUFjdGlvblZpc2libGU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIGFjdGlvbnM7XG59O1xuXG5leHBvcnQgY29uc3QgbWVyZ2VGb3JtQWN0aW9ucyA9IChcblx0c291cmNlOiBDb25maWd1cmFibGVSZWNvcmQ8TWFuaWZlc3RBY3Rpb24+LFxuXHR0YXJnZXQ6IENvbmZpZ3VyYWJsZVJlY29yZDxNYW5pZmVzdEFjdGlvbj5cbik6IENvbmZpZ3VyYWJsZVJlY29yZDxNYW5pZmVzdEFjdGlvbj4gPT4ge1xuXHRmb3IgKGNvbnN0IGtleSBpbiBzb3VyY2UpIHtcblx0XHRpZiAoc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0XHRcdHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG5cdFx0fVxuXHR9XG5cdHJldHVybiBzb3VyY2U7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Rm9ybUhpZGRlbkFjdGlvbnMgPSAoZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogQmFzZUFjdGlvbltdID0+IHtcblx0Y29uc3QgZm9ybUFjdGlvbnM6IENvbmZpZ3VyYWJsZVJlY29yZDxNYW5pZmVzdEFjdGlvbj4gPSBnZXRGb3JtQWN0aW9ucyhmYWNldERlZmluaXRpb24sIGNvbnZlcnRlckNvbnRleHQpIHx8IFtdLFxuXHRcdGFubm90YXRpb25zOiBhbnkgPSBjb252ZXJ0ZXJDb250ZXh0Py5nZXRFbnRpdHlUeXBlKCk/LmFubm90YXRpb25zPy5VSTtcblx0Y29uc3QgaGlkZGVuRm9ybUFjdGlvbnM6IEJhc2VBY3Rpb25bXSA9IFtdO1xuXHRmb3IgKGNvbnN0IHByb3BlcnR5IGluIGFubm90YXRpb25zKSB7XG5cdFx0aWYgKGFubm90YXRpb25zW3Byb3BlcnR5XT8uJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRmllbGRHcm91cFR5cGVcIikge1xuXHRcdFx0YW5ub3RhdGlvbnNbcHJvcGVydHldPy5EYXRhLmZvckVhY2goKGRhdGFGaWVsZDogYW55KSA9PiB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHRkYXRhRmllbGQuJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9yQWN0aW9uXCIgJiZcblx0XHRcdFx0XHRmb3JtQWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShcIkRhdGFGaWVsZEZvckFjdGlvbjo6XCIgKyBkYXRhRmllbGQuQWN0aW9uKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRpZiAoZGF0YUZpZWxkPy5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRoaWRkZW5Gb3JtQWN0aW9ucy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0dHlwZTogQWN0aW9uVHlwZS5EZWZhdWx0LFxuXHRcdFx0XHRcdFx0XHRrZXk6IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQoZGF0YUZpZWxkKVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKFxuXHRcdFx0XHRcdGRhdGFGaWVsZC4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb25cIiAmJlxuXHRcdFx0XHRcdGZvcm1BY3Rpb25zLmhhc093blByb3BlcnR5KFwiRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uOjpcIiArIGRhdGFGaWVsZC5BY3Rpb24pXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGlmIChkYXRhRmllbGQ/LmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdGhpZGRlbkZvcm1BY3Rpb25zLnB1c2goe1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBBY3Rpb25UeXBlLkRlZmF1bHQsXG5cdFx0XHRcdFx0XHRcdGtleTogS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChkYXRhRmllbGQpXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRhbm5vdGF0aW9uc1twcm9wZXJ0eV0/LnRlcm0gPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuSWRlbnRpZmljYXRpb25cIiB8fFxuXHRcdFx0YW5ub3RhdGlvbnNbcHJvcGVydHldPy50ZXJtID09PSBcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5TdGF0dXNJbmZvXCJcblx0XHQpIHtcblx0XHRcdGFubm90YXRpb25zW3Byb3BlcnR5XT8uZm9yRWFjaCgoZGF0YUZpZWxkOiBhbnkpID0+IHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdGRhdGFGaWVsZC4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRGb3JBY3Rpb25cIiAmJlxuXHRcdFx0XHRcdGZvcm1BY3Rpb25zLmhhc093blByb3BlcnR5KFwiRGF0YUZpZWxkRm9yQWN0aW9uOjpcIiArIGRhdGFGaWVsZC5BY3Rpb24pXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdGlmIChkYXRhRmllbGQ/LmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdGhpZGRlbkZvcm1BY3Rpb25zLnB1c2goe1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBBY3Rpb25UeXBlLkRlZmF1bHQsXG5cdFx0XHRcdFx0XHRcdGtleTogS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChkYXRhRmllbGQpXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRcdFx0ZGF0YUZpZWxkLiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvblwiICYmXG5cdFx0XHRcdFx0Zm9ybUFjdGlvbnMuaGFzT3duUHJvcGVydHkoXCJEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb246OlwiICsgZGF0YUZpZWxkLkFjdGlvbilcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0aWYgKGRhdGFGaWVsZD8uYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4/LnZhbHVlT2YoKSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0aGlkZGVuRm9ybUFjdGlvbnMucHVzaCh7XG5cdFx0XHRcdFx0XHRcdHR5cGU6IEFjdGlvblR5cGUuRGVmYXVsdCxcblx0XHRcdFx0XHRcdFx0a2V5OiBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGRhdGFGaWVsZClcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBoaWRkZW5Gb3JtQWN0aW9ucztcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRGb3JtQWN0aW9ucyA9IChmYWNldERlZmluaXRpb246IEZhY2V0VHlwZXMsIGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBDb25maWd1cmFibGVSZWNvcmQ8TWFuaWZlc3RBY3Rpb24+ID0+IHtcblx0Y29uc3QgbWFuaWZlc3RXcmFwcGVyID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKTtcblx0bGV0IHRhcmdldFZhbHVlOiBzdHJpbmcsIG1hbmlmZXN0Rm9ybUNvbnRhaW5lcjogRm9ybU1hbmlmZXN0Q29uZmlndXJhdGlvbjtcblx0bGV0IGFjdGlvbnM6IENvbmZpZ3VyYWJsZVJlY29yZDxNYW5pZmVzdEFjdGlvbj4gPSB7fTtcblx0aWYgKGZhY2V0RGVmaW5pdGlvbj8uJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ29sbGVjdGlvbkZhY2V0XCIpIHtcblx0XHRpZiAoZmFjZXREZWZpbml0aW9uPy5GYWNldHMpIHtcblx0XHRcdGZhY2V0RGVmaW5pdGlvbj8uRmFjZXRzLmZvckVhY2goKGZhY2V0OiBhbnkpID0+IHtcblx0XHRcdFx0dGFyZ2V0VmFsdWUgPSBmYWNldD8uVGFyZ2V0Py52YWx1ZTtcblx0XHRcdFx0bWFuaWZlc3RGb3JtQ29udGFpbmVyID0gbWFuaWZlc3RXcmFwcGVyLmdldEZvcm1Db250YWluZXIodGFyZ2V0VmFsdWUpO1xuXHRcdFx0XHRpZiAobWFuaWZlc3RGb3JtQ29udGFpbmVyPy5hY3Rpb25zKSB7XG5cdFx0XHRcdFx0Zm9yIChjb25zdCBhY3Rpb25LZXkgaW4gbWFuaWZlc3RGb3JtQ29udGFpbmVyLmFjdGlvbnMpIHtcblx0XHRcdFx0XHRcdC8vIHN0b3JlIHRoZSBjb3JyZWN0IGZhY2V0IGFuIGFjdGlvbiBpcyBiZWxvbmdpbmcgdG8gZm9yIHRoZSBjYXNlIGl0J3MgYW4gaW5saW5lIGZvcm0gYWN0aW9uXG5cdFx0XHRcdFx0XHRtYW5pZmVzdEZvcm1Db250YWluZXIuYWN0aW9uc1thY3Rpb25LZXldLmZhY2V0TmFtZSA9IGZhY2V0LmZ1bGx5UXVhbGlmaWVkTmFtZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YWN0aW9ucyA9IG1lcmdlRm9ybUFjdGlvbnMobWFuaWZlc3RGb3JtQ29udGFpbmVyPy5hY3Rpb25zIGFzIGFueSwgYWN0aW9ucyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fSBlbHNlIGlmIChmYWNldERlZmluaXRpb24/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlJlZmVyZW5jZUZhY2V0XCIpIHtcblx0XHR0YXJnZXRWYWx1ZSA9IGZhY2V0RGVmaW5pdGlvbj8uVGFyZ2V0Py52YWx1ZTtcblx0XHRtYW5pZmVzdEZvcm1Db250YWluZXIgPSBtYW5pZmVzdFdyYXBwZXIuZ2V0Rm9ybUNvbnRhaW5lcih0YXJnZXRWYWx1ZSk7XG5cdFx0aWYgKG1hbmlmZXN0Rm9ybUNvbnRhaW5lcj8uYWN0aW9ucykge1xuXHRcdFx0Zm9yIChjb25zdCBhY3Rpb25LZXkgaW4gbWFuaWZlc3RGb3JtQ29udGFpbmVyLmFjdGlvbnMpIHtcblx0XHRcdFx0Ly8gc3RvcmUgdGhlIGNvcnJlY3QgZmFjZXQgYW4gYWN0aW9uIGlzIGJlbG9uZ2luZyB0byBmb3IgdGhlIGNhc2UgaXQncyBhbiBpbmxpbmUgZm9ybSBhY3Rpb25cblx0XHRcdFx0bWFuaWZlc3RGb3JtQ29udGFpbmVyLmFjdGlvbnNbYWN0aW9uS2V5XS5mYWNldE5hbWUgPSBmYWNldERlZmluaXRpb24uZnVsbHlRdWFsaWZpZWROYW1lO1xuXHRcdFx0fVxuXHRcdFx0YWN0aW9ucyA9IG1hbmlmZXN0Rm9ybUNvbnRhaW5lci5hY3Rpb25zIGFzIGFueTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGFjdGlvbnM7XG59O1xuIl19