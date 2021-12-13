/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["../ManifestSettings", "sap/fe/core/converters/controls/Common/Action", "sap/fe/core/converters/helpers/ConfigurableObject", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/converters/helpers/Key", "sap/fe/core/templating/DataModelPathHelper", "../helpers/BindingHelper"], function (ManifestSettings, Action, ConfigurableObject, BindingExpression, Key, DataModelPathHelper, BindingHelper) {
  "use strict";

  var _exports = {};
  var UI = BindingHelper.UI;
  var singletonPathVisitor = BindingHelper.singletonPathVisitor;
  var Draft = BindingHelper.Draft;
  var isPathDeletable = DataModelPathHelper.isPathDeletable;
  var KeyHelper = Key.KeyHelper;
  var constant = BindingExpression.constant;
  var ifElse = BindingExpression.ifElse;
  var and = BindingExpression.and;
  var fn = BindingExpression.fn;
  var equal = BindingExpression.equal;
  var not = BindingExpression.not;
  var compileBinding = BindingExpression.compileBinding;
  var annotationExpression = BindingExpression.annotationExpression;
  var Placement = ConfigurableObject.Placement;
  var getSemanticObjectMapping = Action.getSemanticObjectMapping;
  var getEnabledForAnnotationAction = Action.getEnabledForAnnotationAction;
  var ButtonType = Action.ButtonType;
  var ActionType = ManifestSettings.ActionType;

  /**
   * Retrieves all the data field for actions for the identification annotation
   * They must be
   * - Not statically hidden
   * - Either linked to an Unbound action or to an action which has an OperationAvailable that is not set to false statically.
   *
   * @param {EntityType} entityType The current entity type
   * @param {boolean} bDetermining The flag which denotes whether or not the action is a determining action
   * @returns {DataFieldForActionTypes[]} An array of DataField for action respecting the input parameter 'bDetermining'
   */
  function getIdentificationDataFieldForActions(entityType, bDetermining) {
    var _entityType$annotatio, _entityType$annotatio2, _entityType$annotatio3;

    return ((_entityType$annotatio = entityType.annotations) === null || _entityType$annotatio === void 0 ? void 0 : (_entityType$annotatio2 = _entityType$annotatio.UI) === null || _entityType$annotatio2 === void 0 ? void 0 : (_entityType$annotatio3 = _entityType$annotatio2.Identification) === null || _entityType$annotatio3 === void 0 ? void 0 : _entityType$annotatio3.filter(function (identificationDataField) {
      var _identificationDataFi, _identificationDataFi2, _identificationDataFi3;

      if ((identificationDataField === null || identificationDataField === void 0 ? void 0 : (_identificationDataFi = identificationDataField.annotations) === null || _identificationDataFi === void 0 ? void 0 : (_identificationDataFi2 = _identificationDataFi.UI) === null || _identificationDataFi2 === void 0 ? void 0 : (_identificationDataFi3 = _identificationDataFi2.Hidden) === null || _identificationDataFi3 === void 0 ? void 0 : _identificationDataFi3.valueOf()) !== true) {
        var _identificationDataFi4, _identificationDataFi5, _identificationDataFi6, _identificationDataFi7, _identificationDataFi8;

        if ((identificationDataField === null || identificationDataField === void 0 ? void 0 : identificationDataField.$Type) === "com.sap.vocabularies.UI.v1.DataFieldForAction" && !!identificationDataField.Determining === bDetermining && (!(identificationDataField !== null && identificationDataField !== void 0 && (_identificationDataFi4 = identificationDataField.ActionTarget) !== null && _identificationDataFi4 !== void 0 && _identificationDataFi4.isBound) || (identificationDataField === null || identificationDataField === void 0 ? void 0 : (_identificationDataFi5 = identificationDataField.ActionTarget) === null || _identificationDataFi5 === void 0 ? void 0 : (_identificationDataFi6 = _identificationDataFi5.annotations) === null || _identificationDataFi6 === void 0 ? void 0 : (_identificationDataFi7 = _identificationDataFi6.Core) === null || _identificationDataFi7 === void 0 ? void 0 : (_identificationDataFi8 = _identificationDataFi7.OperationAvailable) === null || _identificationDataFi8 === void 0 ? void 0 : _identificationDataFi8.valueOf()) !== false)) {
          return true;
        }
      }

      return false;
    })) || [];
  }
  /**
   * Retrieve all the IBN actions for the identification annotation.
   * They must be
   * - Not statically hidden.
   * @param {EntityType} entityType The current entitytype
   * @param {boolean} bDetermining Whether or not the action should be determining
   * @returns {DataFieldForIntentBasedNavigationTypes[]} An array of datafield for action respecting the bDetermining property.
   */


  _exports.getIdentificationDataFieldForActions = getIdentificationDataFieldForActions;

  function getIdentificationDataFieldForIBNActions(entityType, bDetermining) {
    var _entityType$annotatio4, _entityType$annotatio5, _entityType$annotatio6;

    return ((_entityType$annotatio4 = entityType.annotations) === null || _entityType$annotatio4 === void 0 ? void 0 : (_entityType$annotatio5 = _entityType$annotatio4.UI) === null || _entityType$annotatio5 === void 0 ? void 0 : (_entityType$annotatio6 = _entityType$annotatio5.Identification) === null || _entityType$annotatio6 === void 0 ? void 0 : _entityType$annotatio6.filter(function (identificationDataField) {
      var _identificationDataFi9, _identificationDataFi10, _identificationDataFi11;

      if ((identificationDataField === null || identificationDataField === void 0 ? void 0 : (_identificationDataFi9 = identificationDataField.annotations) === null || _identificationDataFi9 === void 0 ? void 0 : (_identificationDataFi10 = _identificationDataFi9.UI) === null || _identificationDataFi10 === void 0 ? void 0 : (_identificationDataFi11 = _identificationDataFi10.Hidden) === null || _identificationDataFi11 === void 0 ? void 0 : _identificationDataFi11.valueOf()) !== true) {
        if ((identificationDataField === null || identificationDataField === void 0 ? void 0 : identificationDataField.$Type) === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" && !!identificationDataField.Determining === bDetermining) {
          return true;
        }
      }

      return false;
    })) || [];
  }

  var IMPORTANT_CRITICALITIES = ["UI.CriticalityType/VeryPositive", "UI.CriticalityType/Positive", "UI.CriticalityType/Negative", "UI.CriticalityType/VeryNegative"];
  /**
   * Method to determine the 'visible' property binding for the Delete button on an object page.
   *
   * @param {ConverterContext} converterContext Instance of the converter context.
   * @param {PropertyAnnotationValue<boolean> | undefined} deleteHidden The value of the UI.DeleteHidden annotation on the entity set / type.
   * @returns {Expression<boolean>} The binding expression for the 'visible' property of the Delete button.
   */

  function getDeleteButtonVisibility(converterContext, deleteHidden) {
    var dataModelObjectPath = converterContext.getDataModelObjectPath(),
        visitedNavigationPaths = dataModelObjectPath.navigationProperties.map(function (navProp) {
      return navProp.name;
    }),
        // Set absolute binding path for Singleton references, otherwise the configured annotation path itself.
    // For e.g. /com.sap.namespace.EntityContainer/Singleton/Property to /Singleton/Property
    deleteHiddenExpression = annotationExpression(deleteHidden, visitedNavigationPaths, undefined, function (path) {
      return singletonPathVisitor(path, converterContext, []);
    }),
        manifestWrapper = converterContext.getManifestWrapper(),
        viewLevel = manifestWrapper.getViewLevel(),
        // Delete button is visible
    // In OP 		-->  when not in edit mode
    // In sub-OP 	-->  when in edit mode
    editableExpression = viewLevel > 1 ? UI.IsEditable : not(UI.IsEditable); // If UI.DeleteHidden annotation on entity set or type is either not defined or explicitly set to false,
    // Delete button is visible based on editableExpression.
    // else,
    // Delete button is visible based on both annotation path and editableExpression.

    return ifElse(deleteHidden === undefined || deleteHidden.valueOf() === false, editableExpression, and(editableExpression, equal(deleteHiddenExpression, false)));
  }
  /**
   * Method to determine the 'enabled' property binding for the Delete button on an object page.
   *
   * @param {PropertyAnnotationValue<boolean>|undefined} isDeletable The delete restriction configured
   * @param {Expression<boolean>} isParentDeletable The delete restriction configured on the parent entity
   * @returns {Expression<boolean>} The binding expression for the 'enabled' property of the Delete button
   */


  _exports.getDeleteButtonVisibility = getDeleteButtonVisibility;

  function getDeleteButtonEnabled(isDeletable, isParentDeletable) {
    return ifElse(isParentDeletable !== undefined, isParentDeletable, ifElse(isDeletable !== undefined, equal(isDeletable, true), constant(true)));
  }
  /**
   * Method to determine the 'visible' property binding for the Edit button on an object page.
   *
   * @param {ConverterContext} converterContext Instance of the converter context.
   * @param {PropertyAnnotationValue<boolean> | undefined} updateHidden The value of the UI.UpdateHidden annotation on the entity set / type.
   * @returns {Expression<boolean>} The binding expression for the 'visible' property of the Edit button.
   */


  _exports.getDeleteButtonEnabled = getDeleteButtonEnabled;

  function getEditButtonVisibility(converterContext, updateHidden) {
    var _entitySet$annotation;

    var entitySet = converterContext.getEntitySet(),
        bIsDraftRoot = entitySet && (_entitySet$annotation = entitySet.annotations.Common) !== null && _entitySet$annotation !== void 0 && _entitySet$annotation.DraftRoot ? true : false,
        dataModelObjectPath = converterContext.getDataModelObjectPath(),
        visitedNavigationPaths = dataModelObjectPath.navigationProperties.map(function (navProp) {
      return navProp.name;
    }),
        // Set absolute binding path for Singleton references, otherwise the configured annotation path itself.
    // For e.g. /com.sap.namespace.EntityContainer/Singleton/Property to /Singleton/Property
    updateHiddenExpression = annotationExpression(updateHidden, visitedNavigationPaths, undefined, function (path) {
      return singletonPathVisitor(path, converterContext, visitedNavigationPaths);
    }),
        notEditableExpression = not(UI.IsEditable); // If UI.UpdateHidden annotation on entity set or type is either not defined or explicitly set to false,
    // Edit button is visible in display mode.
    // else,
    // Edit button is visible based on both annotation path and in display mode.

    var resultantExpression = ifElse(updateHidden === undefined || updateHidden.valueOf() === false, notEditableExpression, and(notEditableExpression, equal(updateHiddenExpression, false)));
    return ifElse(bIsDraftRoot, and(resultantExpression, Draft.HasNoDraftForCurrentUser), resultantExpression);
  }
  /**
   * Method to determine the 'enabled' property binding for the Edit button on an object page.
   *
   * @param {ConverterContext} converterContext Instance of the converter context.
   * @returns {Expression<boolean>} The binding expression for the 'enabled' property of the Edit button.
   */


  _exports.getEditButtonVisibility = getEditButtonVisibility;

  function getEditButtonEnabled(converterContext) {
    var _entitySet$annotation2, _entitySet$annotation3;

    var entitySet = converterContext.getEntitySet(),
        isDraftRoot = entitySet && (_entitySet$annotation2 = entitySet.annotations.Common) !== null && _entitySet$annotation2 !== void 0 && _entitySet$annotation2.DraftRoot ? true : false,
        isSticky = entitySet && (_entitySet$annotation3 = entitySet.annotations.Session) !== null && _entitySet$annotation3 !== void 0 && _entitySet$annotation3.StickySessionSupported ? true : false;
    var editActionName;

    if (isDraftRoot) {
      var _entitySet$annotation4, _entitySet$annotation5;

      editActionName = entitySet === null || entitySet === void 0 ? void 0 : (_entitySet$annotation4 = entitySet.annotations.Common) === null || _entitySet$annotation4 === void 0 ? void 0 : (_entitySet$annotation5 = _entitySet$annotation4.DraftRoot) === null || _entitySet$annotation5 === void 0 ? void 0 : _entitySet$annotation5.EditAction;
    } else if (isSticky) {
      var _entitySet$annotation6, _entitySet$annotation7;

      editActionName = entitySet === null || entitySet === void 0 ? void 0 : (_entitySet$annotation6 = entitySet.annotations.Session) === null || _entitySet$annotation6 === void 0 ? void 0 : (_entitySet$annotation7 = _entitySet$annotation6.StickySessionSupported) === null || _entitySet$annotation7 === void 0 ? void 0 : _entitySet$annotation7.EditAction;
    }

    if (editActionName) {
      var _converterContext$get, _converterContext$get2;

      var editActionAnnotationPath = converterContext.getAbsoluteAnnotationPath(editActionName),
          editActions = (_converterContext$get = converterContext.getEntityTypeAnnotation(editActionAnnotationPath)) === null || _converterContext$get === void 0 ? void 0 : (_converterContext$get2 = _converterContext$get.annotation) === null || _converterContext$get2 === void 0 ? void 0 : _converterContext$get2.actions;

      if (editActions !== null && editActions !== void 0 && editActions.length) {
        var _editAction$annotatio, _editAction$annotatio2;

        var editAction = editActions[0];

        if ((editAction === null || editAction === void 0 ? void 0 : (_editAction$annotatio = editAction.annotations) === null || _editAction$annotatio === void 0 ? void 0 : (_editAction$annotatio2 = _editAction$annotatio.Core) === null || _editAction$annotatio2 === void 0 ? void 0 : _editAction$annotatio2.OperationAvailable) === null) {
          return "{= ${#" + editActionName + "} ? true : false }";
        } else {
          return getEnabledForAnnotationAction(converterContext, editAction);
        }
      }
    }

    return true;
  }

  _exports.getEditButtonEnabled = getEditButtonEnabled;

  function getHeaderDefaultActions(converterContext) {
    var _entitySet$annotation8, _entitySet$annotation9, _entitySet$annotation10, _entitySet$annotation11, _entitySet$annotation12, _entitySet$annotation13, _entitySet$annotation14, _oEntityDeleteRestric;

    var entitySet = converterContext.getEntitySet(),
        entityType = converterContext.getEntityType(),
        oStickySessionSupported = entitySet && ((_entitySet$annotation8 = entitySet.annotations) === null || _entitySet$annotation8 === void 0 ? void 0 : (_entitySet$annotation9 = _entitySet$annotation8.Session) === null || _entitySet$annotation9 === void 0 ? void 0 : _entitySet$annotation9.StickySessionSupported),
        //for sticky app
    oDraftRoot = entitySet && ((_entitySet$annotation10 = entitySet.annotations.Common) === null || _entitySet$annotation10 === void 0 ? void 0 : _entitySet$annotation10.DraftRoot),
        oEntityDeleteRestrictions = entitySet && ((_entitySet$annotation11 = entitySet.annotations) === null || _entitySet$annotation11 === void 0 ? void 0 : (_entitySet$annotation12 = _entitySet$annotation11.Capabilities) === null || _entitySet$annotation12 === void 0 ? void 0 : _entitySet$annotation12.DeleteRestrictions),
        bUpdateHidden = entitySet && ((_entitySet$annotation13 = entitySet.annotations.UI) === null || _entitySet$annotation13 === void 0 ? void 0 : (_entitySet$annotation14 = _entitySet$annotation13.UpdateHidden) === null || _entitySet$annotation14 === void 0 ? void 0 : _entitySet$annotation14.valueOf()),
        dataModelObjectPath = converterContext.getDataModelObjectPath(),
        isParentDeletable = isPathDeletable(dataModelObjectPath),
        bParentEntitySetDeletable = isParentDeletable ? compileBinding(isParentDeletable) : isParentDeletable,
        headerDataFieldForActions = getIdentificationDataFieldForActions(converterContext.getEntityType(), false); // First add the "Critical" DataFieldForActions

    var headerActions = headerDataFieldForActions.filter(function (dataField) {
      return IMPORTANT_CRITICALITIES.indexOf(dataField === null || dataField === void 0 ? void 0 : dataField.Criticality) > -1;
    }).map(function (dataField) {
      var _dataField$annotation, _dataField$annotation2;

      return {
        type: ActionType.DataFieldForAction,
        annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
        key: KeyHelper.generateKeyFromDataField(dataField),
        visible: compileBinding(not(equal(annotationExpression((_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : (_dataField$annotation2 = _dataField$annotation.UI) === null || _dataField$annotation2 === void 0 ? void 0 : _dataField$annotation2.Hidden), true))),
        enabled: getEnabledForAnnotationAction(converterContext, dataField.ActionTarget),
        isNavigable: true
      };
    }); // Then the edit action if it exists

    if ((oDraftRoot !== null && oDraftRoot !== void 0 && oDraftRoot.EditAction || oStickySessionSupported !== null && oStickySessionSupported !== void 0 && oStickySessionSupported.EditAction) && bUpdateHidden !== true) {
      var _entitySet$annotation15, _entitySet$annotation16, _entitySet$annotation17, _entityType$annotatio7;

      var updateHidden = (entitySet === null || entitySet === void 0 ? void 0 : (_entitySet$annotation15 = entitySet.annotations.UI) === null || _entitySet$annotation15 === void 0 ? void 0 : (_entitySet$annotation16 = _entitySet$annotation15.UpdateHidden) === null || _entitySet$annotation16 === void 0 ? void 0 : _entitySet$annotation16.valueOf()) !== undefined ? entitySet === null || entitySet === void 0 ? void 0 : (_entitySet$annotation17 = entitySet.annotations.UI) === null || _entitySet$annotation17 === void 0 ? void 0 : _entitySet$annotation17.UpdateHidden : entityType === null || entityType === void 0 ? void 0 : (_entityType$annotatio7 = entityType.annotations.UI) === null || _entityType$annotatio7 === void 0 ? void 0 : _entityType$annotatio7.UpdateHidden;
      headerActions.push({
        type: ActionType.Primary,
        key: "EditAction",
        visible: compileBinding(getEditButtonVisibility(converterContext, updateHidden)),
        enabled: getEditButtonEnabled(converterContext)
      });
    } // Then the delete action if we're not statically not deletable


    if (bParentEntitySetDeletable && bParentEntitySetDeletable !== "false" || (oEntityDeleteRestrictions === null || oEntityDeleteRestrictions === void 0 ? void 0 : (_oEntityDeleteRestric = oEntityDeleteRestrictions.Deletable) === null || _oEntityDeleteRestric === void 0 ? void 0 : _oEntityDeleteRestric.valueOf()) !== false && bParentEntitySetDeletable !== "false") {
      var _entitySet$annotation18, _entitySet$annotation19, _entitySet$annotation20, _entityType$annotatio8;

      var deleteHidden = (entitySet === null || entitySet === void 0 ? void 0 : (_entitySet$annotation18 = entitySet.annotations.UI) === null || _entitySet$annotation18 === void 0 ? void 0 : (_entitySet$annotation19 = _entitySet$annotation18.DeleteHidden) === null || _entitySet$annotation19 === void 0 ? void 0 : _entitySet$annotation19.valueOf()) !== undefined ? entitySet === null || entitySet === void 0 ? void 0 : (_entitySet$annotation20 = entitySet.annotations.UI) === null || _entitySet$annotation20 === void 0 ? void 0 : _entitySet$annotation20.DeleteHidden : entityType === null || entityType === void 0 ? void 0 : (_entityType$annotatio8 = entityType.annotations.UI) === null || _entityType$annotatio8 === void 0 ? void 0 : _entityType$annotatio8.DeleteHidden;
      headerActions.push({
        type: ActionType.Secondary,
        key: "DeleteAction",
        visible: compileBinding(getDeleteButtonVisibility(converterContext, deleteHidden)),
        enabled: compileBinding(getDeleteButtonEnabled(oEntityDeleteRestrictions === null || oEntityDeleteRestrictions === void 0 ? void 0 : oEntityDeleteRestrictions.Deletable, isParentDeletable)),
        parentEntityDeleteEnabled: bParentEntitySetDeletable
      });
    }

    if (oDraftRoot !== null && oDraftRoot !== void 0 && oDraftRoot.EditAction && bUpdateHidden !== true) {
      headerActions.push({
        type: ActionType.SwitchToActiveObject,
        key: "SwitchToActiveObject"
      });
      headerActions.push({
        type: ActionType.SwitchToDraftObject,
        key: "SwitchToDraftObject"
      });
    }

    var headerDataFieldForIBNActions = getIdentificationDataFieldForIBNActions(converterContext.getEntityType(), false);
    headerDataFieldForIBNActions.filter(function (dataField) {
      return IMPORTANT_CRITICALITIES.indexOf(dataField === null || dataField === void 0 ? void 0 : dataField.Criticality) === -1;
    }).map(function (dataField) {
      var _dataField$RequiresCo, _dataField$Inline, _dataField$Label, _dataField$annotation3, _dataField$annotation4, _dataField$annotation5, _dataField$Navigation;

      var oNavigationParams = {
        semanticObjectMapping: dataField.Mapping ? getSemanticObjectMapping(dataField.Mapping) : []
      };

      if (((_dataField$RequiresCo = dataField.RequiresContext) === null || _dataField$RequiresCo === void 0 ? void 0 : _dataField$RequiresCo.valueOf()) === true) {
        throw new Error("RequiresContext property should not be true for header IBN action : " + dataField.Label);
      } else if (((_dataField$Inline = dataField.Inline) === null || _dataField$Inline === void 0 ? void 0 : _dataField$Inline.valueOf()) === true) {
        throw new Error("Inline property should not be true for header IBN action : " + dataField.Label);
      }

      headerActions.push({
        type: ActionType.DataFieldForIntentBasedNavigation,
        text: (_dataField$Label = dataField.Label) === null || _dataField$Label === void 0 ? void 0 : _dataField$Label.toString(),
        annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
        buttonType: ButtonType.Ghost,
        visible: compileBinding(not(equal(annotationExpression((_dataField$annotation3 = dataField.annotations) === null || _dataField$annotation3 === void 0 ? void 0 : (_dataField$annotation4 = _dataField$annotation3.UI) === null || _dataField$annotation4 === void 0 ? void 0 : (_dataField$annotation5 = _dataField$annotation4.Hidden) === null || _dataField$annotation5 === void 0 ? void 0 : _dataField$annotation5.valueOf()), true))),
        enabled: dataField.NavigationAvailable !== undefined ? compileBinding(equal(annotationExpression((_dataField$Navigation = dataField.NavigationAvailable) === null || _dataField$Navigation === void 0 ? void 0 : _dataField$Navigation.valueOf()), true)) : true,
        key: KeyHelper.generateKeyFromDataField(dataField),
        isNavigable: true,
        press: compileBinding(fn("._intentBasedNavigation.navigate", [annotationExpression(dataField.SemanticObject), annotationExpression(dataField.Action), oNavigationParams])),
        customData: compileBinding({
          semanticObject: annotationExpression(dataField.SemanticObject),
          action: annotationExpression(dataField.Action)
        })
      });
    }); // Finally the non critical DataFieldForActions

    headerDataFieldForActions.filter(function (dataField) {
      return IMPORTANT_CRITICALITIES.indexOf(dataField === null || dataField === void 0 ? void 0 : dataField.Criticality) === -1;
    }).map(function (dataField) {
      var _dataField$annotation6, _dataField$annotation7;

      headerActions.push({
        type: ActionType.DataFieldForAction,
        annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
        key: KeyHelper.generateKeyFromDataField(dataField),
        visible: compileBinding(not(equal(annotationExpression((_dataField$annotation6 = dataField.annotations) === null || _dataField$annotation6 === void 0 ? void 0 : (_dataField$annotation7 = _dataField$annotation6.UI) === null || _dataField$annotation7 === void 0 ? void 0 : _dataField$annotation7.Hidden), true))),
        enabled: getEnabledForAnnotationAction(converterContext, dataField.ActionTarget),
        isNavigable: true
      });
    });
    return headerActions;
  }

  _exports.getHeaderDefaultActions = getHeaderDefaultActions;

  function getHiddenHeaderActions(converterContext) {
    var _entityType$annotatio9, _entityType$annotatio10, _entityType$annotatio11;

    var entityType = converterContext.getEntityType();
    var hiddenActions = ((_entityType$annotatio9 = entityType.annotations) === null || _entityType$annotatio9 === void 0 ? void 0 : (_entityType$annotatio10 = _entityType$annotatio9.UI) === null || _entityType$annotatio10 === void 0 ? void 0 : (_entityType$annotatio11 = _entityType$annotatio10.Identification) === null || _entityType$annotatio11 === void 0 ? void 0 : _entityType$annotatio11.filter(function (identificationDataField) {
      var _identificationDataFi12, _identificationDataFi13, _identificationDataFi14;

      return (identificationDataField === null || identificationDataField === void 0 ? void 0 : (_identificationDataFi12 = identificationDataField.annotations) === null || _identificationDataFi12 === void 0 ? void 0 : (_identificationDataFi13 = _identificationDataFi12.UI) === null || _identificationDataFi13 === void 0 ? void 0 : (_identificationDataFi14 = _identificationDataFi13.Hidden) === null || _identificationDataFi14 === void 0 ? void 0 : _identificationDataFi14.valueOf()) === true;
    })) || [];
    return hiddenActions.map(function (dataField) {
      return {
        type: ActionType.Default,
        key: KeyHelper.generateKeyFromDataField(dataField)
      };
    });
  }

  _exports.getHiddenHeaderActions = getHiddenHeaderActions;

  function getFooterDefaultActions(viewLevel, converterContext) {
    var _entitySet$annotation21, _entitySet$annotation22, _entitySet$annotation23, _entitySet$annotation24, _entitySet$annotation25, _entitySet$annotation26, _entitySet$annotation27;

    var entitySet = converterContext.getEntitySet();
    var entityType = converterContext.getEntityType();
    var oStickySessionSupported = entitySet && ((_entitySet$annotation21 = entitySet.annotations) === null || _entitySet$annotation21 === void 0 ? void 0 : (_entitySet$annotation22 = _entitySet$annotation21.Session) === null || _entitySet$annotation22 === void 0 ? void 0 : _entitySet$annotation22.StickySessionSupported),
        //for sticky app
    sEntitySetDraftRoot = entitySet && (((_entitySet$annotation23 = entitySet.annotations.Common) === null || _entitySet$annotation23 === void 0 ? void 0 : (_entitySet$annotation24 = _entitySet$annotation23.DraftRoot) === null || _entitySet$annotation24 === void 0 ? void 0 : _entitySet$annotation24.term) || ((_entitySet$annotation25 = entitySet.annotations) === null || _entitySet$annotation25 === void 0 ? void 0 : (_entitySet$annotation26 = _entitySet$annotation25.Session) === null || _entitySet$annotation26 === void 0 ? void 0 : (_entitySet$annotation27 = _entitySet$annotation26.StickySessionSupported) === null || _entitySet$annotation27 === void 0 ? void 0 : _entitySet$annotation27.term)),
        bConditionSave = sEntitySetDraftRoot === "com.sap.vocabularies.Common.v1.DraftRoot" || oStickySessionSupported && (oStickySessionSupported === null || oStickySessionSupported === void 0 ? void 0 : oStickySessionSupported.SaveAction),
        bConditionApply = viewLevel > 1,
        bConditionCancel = sEntitySetDraftRoot === "com.sap.vocabularies.Common.v1.DraftRoot" || oStickySessionSupported && (oStickySessionSupported === null || oStickySessionSupported === void 0 ? void 0 : oStickySessionSupported.DiscardAction); // Retrieve all determining actions

    var footerDataFieldForActions = getIdentificationDataFieldForActions(converterContext.getEntityType(), true); // First add the "Critical" DataFieldForActions

    var footerActions = footerDataFieldForActions.filter(function (dataField) {
      return IMPORTANT_CRITICALITIES.indexOf(dataField === null || dataField === void 0 ? void 0 : dataField.Criticality) > -1;
    }).map(function (dataField) {
      var _dataField$annotation8, _dataField$annotation9;

      return {
        type: ActionType.DataFieldForAction,
        annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
        key: KeyHelper.generateKeyFromDataField(dataField),
        visible: compileBinding(not(equal(annotationExpression((_dataField$annotation8 = dataField.annotations) === null || _dataField$annotation8 === void 0 ? void 0 : (_dataField$annotation9 = _dataField$annotation8.UI) === null || _dataField$annotation9 === void 0 ? void 0 : _dataField$annotation9.Hidden), true))),
        enabled: getEnabledForAnnotationAction(converterContext, dataField.ActionTarget),
        isNavigable: true
      };
    }); // Then the save action if it exists

    if ((entitySet === null || entitySet === void 0 ? void 0 : entitySet.entityTypeName) === (entityType === null || entityType === void 0 ? void 0 : entityType.fullyQualifiedName) && bConditionSave) {
      footerActions.push({
        type: ActionType.Primary,
        key: "SaveAction"
      });
    } // Then the apply action if it exists


    if (bConditionApply) {
      footerActions.push({
        type: ActionType.DefaultApply,
        key: "ApplyAction"
      });
    } // Then the non critical DataFieldForActions


    footerDataFieldForActions.filter(function (dataField) {
      return IMPORTANT_CRITICALITIES.indexOf(dataField === null || dataField === void 0 ? void 0 : dataField.Criticality) === -1;
    }).map(function (dataField) {
      var _dataField$annotation10, _dataField$annotation11;

      footerActions.push({
        type: ActionType.DataFieldForAction,
        annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName),
        key: KeyHelper.generateKeyFromDataField(dataField),
        visible: compileBinding(not(equal(annotationExpression((_dataField$annotation10 = dataField.annotations) === null || _dataField$annotation10 === void 0 ? void 0 : (_dataField$annotation11 = _dataField$annotation10.UI) === null || _dataField$annotation11 === void 0 ? void 0 : _dataField$annotation11.Hidden), true))),
        enabled: getEnabledForAnnotationAction(converterContext, dataField.ActionTarget),
        isNavigable: true
      });
    }); // Then the cancel action if it exists

    if (bConditionCancel) {
      footerActions.push({
        type: ActionType.Secondary,
        key: "CancelAction",
        position: {
          placement: Placement.End
        }
      });
    }

    return footerActions;
  }

  _exports.getFooterDefaultActions = getFooterDefaultActions;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhlYWRlckFuZEZvb3RlckFjdGlvbi50cyJdLCJuYW1lcyI6WyJnZXRJZGVudGlmaWNhdGlvbkRhdGFGaWVsZEZvckFjdGlvbnMiLCJlbnRpdHlUeXBlIiwiYkRldGVybWluaW5nIiwiYW5ub3RhdGlvbnMiLCJVSSIsIklkZW50aWZpY2F0aW9uIiwiZmlsdGVyIiwiaWRlbnRpZmljYXRpb25EYXRhRmllbGQiLCJIaWRkZW4iLCJ2YWx1ZU9mIiwiJFR5cGUiLCJEZXRlcm1pbmluZyIsIkFjdGlvblRhcmdldCIsImlzQm91bmQiLCJDb3JlIiwiT3BlcmF0aW9uQXZhaWxhYmxlIiwiZ2V0SWRlbnRpZmljYXRpb25EYXRhRmllbGRGb3JJQk5BY3Rpb25zIiwiSU1QT1JUQU5UX0NSSVRJQ0FMSVRJRVMiLCJnZXREZWxldGVCdXR0b25WaXNpYmlsaXR5IiwiY29udmVydGVyQ29udGV4dCIsImRlbGV0ZUhpZGRlbiIsImRhdGFNb2RlbE9iamVjdFBhdGgiLCJnZXREYXRhTW9kZWxPYmplY3RQYXRoIiwidmlzaXRlZE5hdmlnYXRpb25QYXRocyIsIm5hdmlnYXRpb25Qcm9wZXJ0aWVzIiwibWFwIiwibmF2UHJvcCIsIm5hbWUiLCJkZWxldGVIaWRkZW5FeHByZXNzaW9uIiwiYW5ub3RhdGlvbkV4cHJlc3Npb24iLCJ1bmRlZmluZWQiLCJwYXRoIiwic2luZ2xldG9uUGF0aFZpc2l0b3IiLCJtYW5pZmVzdFdyYXBwZXIiLCJnZXRNYW5pZmVzdFdyYXBwZXIiLCJ2aWV3TGV2ZWwiLCJnZXRWaWV3TGV2ZWwiLCJlZGl0YWJsZUV4cHJlc3Npb24iLCJJc0VkaXRhYmxlIiwibm90IiwiaWZFbHNlIiwiYW5kIiwiZXF1YWwiLCJnZXREZWxldGVCdXR0b25FbmFibGVkIiwiaXNEZWxldGFibGUiLCJpc1BhcmVudERlbGV0YWJsZSIsImNvbnN0YW50IiwiZ2V0RWRpdEJ1dHRvblZpc2liaWxpdHkiLCJ1cGRhdGVIaWRkZW4iLCJlbnRpdHlTZXQiLCJnZXRFbnRpdHlTZXQiLCJiSXNEcmFmdFJvb3QiLCJDb21tb24iLCJEcmFmdFJvb3QiLCJ1cGRhdGVIaWRkZW5FeHByZXNzaW9uIiwibm90RWRpdGFibGVFeHByZXNzaW9uIiwicmVzdWx0YW50RXhwcmVzc2lvbiIsIkRyYWZ0IiwiSGFzTm9EcmFmdEZvckN1cnJlbnRVc2VyIiwiZ2V0RWRpdEJ1dHRvbkVuYWJsZWQiLCJpc0RyYWZ0Um9vdCIsImlzU3RpY2t5IiwiU2Vzc2lvbiIsIlN0aWNreVNlc3Npb25TdXBwb3J0ZWQiLCJlZGl0QWN0aW9uTmFtZSIsIkVkaXRBY3Rpb24iLCJlZGl0QWN0aW9uQW5ub3RhdGlvblBhdGgiLCJnZXRBYnNvbHV0ZUFubm90YXRpb25QYXRoIiwiZWRpdEFjdGlvbnMiLCJnZXRFbnRpdHlUeXBlQW5ub3RhdGlvbiIsImFubm90YXRpb24iLCJhY3Rpb25zIiwibGVuZ3RoIiwiZWRpdEFjdGlvbiIsImdldEVuYWJsZWRGb3JBbm5vdGF0aW9uQWN0aW9uIiwiZ2V0SGVhZGVyRGVmYXVsdEFjdGlvbnMiLCJnZXRFbnRpdHlUeXBlIiwib1N0aWNreVNlc3Npb25TdXBwb3J0ZWQiLCJvRHJhZnRSb290Iiwib0VudGl0eURlbGV0ZVJlc3RyaWN0aW9ucyIsIkNhcGFiaWxpdGllcyIsIkRlbGV0ZVJlc3RyaWN0aW9ucyIsImJVcGRhdGVIaWRkZW4iLCJVcGRhdGVIaWRkZW4iLCJpc1BhdGhEZWxldGFibGUiLCJiUGFyZW50RW50aXR5U2V0RGVsZXRhYmxlIiwiY29tcGlsZUJpbmRpbmciLCJoZWFkZXJEYXRhRmllbGRGb3JBY3Rpb25zIiwiaGVhZGVyQWN0aW9ucyIsImRhdGFGaWVsZCIsImluZGV4T2YiLCJDcml0aWNhbGl0eSIsInR5cGUiLCJBY3Rpb25UeXBlIiwiRGF0YUZpZWxkRm9yQWN0aW9uIiwiYW5ub3RhdGlvblBhdGgiLCJnZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoIiwiZnVsbHlRdWFsaWZpZWROYW1lIiwia2V5IiwiS2V5SGVscGVyIiwiZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkIiwidmlzaWJsZSIsImVuYWJsZWQiLCJpc05hdmlnYWJsZSIsInB1c2giLCJQcmltYXJ5IiwiRGVsZXRhYmxlIiwiRGVsZXRlSGlkZGVuIiwiU2Vjb25kYXJ5IiwicGFyZW50RW50aXR5RGVsZXRlRW5hYmxlZCIsIlN3aXRjaFRvQWN0aXZlT2JqZWN0IiwiU3dpdGNoVG9EcmFmdE9iamVjdCIsImhlYWRlckRhdGFGaWVsZEZvcklCTkFjdGlvbnMiLCJvTmF2aWdhdGlvblBhcmFtcyIsInNlbWFudGljT2JqZWN0TWFwcGluZyIsIk1hcHBpbmciLCJnZXRTZW1hbnRpY09iamVjdE1hcHBpbmciLCJSZXF1aXJlc0NvbnRleHQiLCJFcnJvciIsIkxhYmVsIiwiSW5saW5lIiwiRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uIiwidGV4dCIsInRvU3RyaW5nIiwiYnV0dG9uVHlwZSIsIkJ1dHRvblR5cGUiLCJHaG9zdCIsIk5hdmlnYXRpb25BdmFpbGFibGUiLCJwcmVzcyIsImZuIiwiU2VtYW50aWNPYmplY3QiLCJBY3Rpb24iLCJjdXN0b21EYXRhIiwic2VtYW50aWNPYmplY3QiLCJhY3Rpb24iLCJnZXRIaWRkZW5IZWFkZXJBY3Rpb25zIiwiaGlkZGVuQWN0aW9ucyIsIkRlZmF1bHQiLCJnZXRGb290ZXJEZWZhdWx0QWN0aW9ucyIsInNFbnRpdHlTZXREcmFmdFJvb3QiLCJ0ZXJtIiwiYkNvbmRpdGlvblNhdmUiLCJTYXZlQWN0aW9uIiwiYkNvbmRpdGlvbkFwcGx5IiwiYkNvbmRpdGlvbkNhbmNlbCIsIkRpc2NhcmRBY3Rpb24iLCJmb290ZXJEYXRhRmllbGRGb3JBY3Rpb25zIiwiZm9vdGVyQWN0aW9ucyIsImVudGl0eVR5cGVOYW1lIiwiRGVmYXVsdEFwcGx5IiwicG9zaXRpb24iLCJwbGFjZW1lbnQiLCJQbGFjZW1lbnQiLCJFbmQiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFFbEJDLFFBQUFBLGNBQWMsRUFBRTVFLGdCQUFnQixDQUFDNkUsK0JBQWpCLENBQWlEUCxTQUFTLENBQUNRLGtCQUEzRCxDQUZFO0FBR2xCQyxRQUFBQSxHQUFHLEVBQUVDLFNBQVMsQ0FBQ0Msd0JBQVYsQ0FBbUNYLFNBQW5DLENBSGE7QUFJbEJZLFFBQUFBLE9BQU8sRUFBRWYsY0FBYyxDQUFDL0MsR0FBRyxDQUFDRyxLQUFLLENBQUNiLG9CQUFvQiw0QkFBQzRELFNBQVMsQ0FBQ3RGLFdBQVgsdUZBQUMsd0JBQXVCQyxFQUF4Qiw0REFBQyx3QkFBMkJJLE1BQTVCLENBQXJCLEVBQTBELElBQTFELENBQU4sQ0FBSixDQUpMO0FBS2xCOEYsUUFBQUEsT0FBTyxFQUFFNUIsNkJBQTZCLENBQUN2RCxnQkFBRCxFQUFtQnNFLFNBQVMsQ0FBQzdFLFlBQTdCLENBTHBCO0FBTWxCMkYsUUFBQUEsV0FBVyxFQUFFO0FBTkssT0FBbkI7QUFRQSxLQWJGLEVBNUM0RyxDQTJENUc7O0FBQ0EsUUFBSXlDLGdCQUFKLEVBQXNCO0FBQ3JCRyxNQUFBQSxhQUFhLENBQUMzQyxJQUFkLENBQW1CO0FBQ2xCWixRQUFBQSxJQUFJLEVBQUVDLFVBQVUsQ0FBQ2UsU0FEQztBQUVsQlYsUUFBQUEsR0FBRyxFQUFFLGNBRmE7QUFHbEJvRCxRQUFBQSxRQUFRLEVBQUU7QUFBRUMsVUFBQUEsU0FBUyxFQUFFQyxTQUFTLENBQUNDO0FBQXZCO0FBSFEsT0FBbkI7QUFLQTs7QUFDRCxXQUFPTixhQUFQO0FBQ0EiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGlvblR5cGUgfSBmcm9tIFwiLi4vTWFuaWZlc3RTZXR0aW5nc1wiO1xuaW1wb3J0IHsgRW50aXR5VHlwZSB9IGZyb20gXCJAc2FwLXV4L2Fubm90YXRpb24tY29udmVydGVyXCI7XG5pbXBvcnQge1xuXHRBbm5vdGF0aW9uQWN0aW9uLFxuXHRCYXNlQWN0aW9uLFxuXHRCdXR0b25UeXBlLFxuXHRnZXRFbmFibGVkRm9yQW5ub3RhdGlvbkFjdGlvbixcblx0Z2V0U2VtYW50aWNPYmplY3RNYXBwaW5nXG59IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9BY3Rpb25cIjtcbmltcG9ydCB7IERhdGFGaWVsZEZvckFjdGlvblR5cGVzLCBEYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb25UeXBlcywgUHJvcGVydHlBbm5vdGF0aW9uVmFsdWUgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcbmltcG9ydCB7IFBsYWNlbWVudCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvQ29uZmlndXJhYmxlT2JqZWN0XCI7XG5pbXBvcnQge1xuXHRhbm5vdGF0aW9uRXhwcmVzc2lvbixcblx0Y29tcGlsZUJpbmRpbmcsXG5cdG5vdCxcblx0ZXF1YWwsXG5cdGZuLFxuXHRFeHByZXNzaW9uLFxuXHRhbmQsXG5cdGlmRWxzZSxcblx0QmluZGluZ0V4cHJlc3Npb24sXG5cdGNvbnN0YW50XG59IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0JpbmRpbmdFeHByZXNzaW9uXCI7XG5pbXBvcnQgeyBLZXlIZWxwZXIgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0tleVwiO1xuaW1wb3J0IHsgaXNQYXRoRGVsZXRhYmxlIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvRGF0YU1vZGVsUGF0aEhlbHBlclwiO1xuaW1wb3J0IENvbnZlcnRlckNvbnRleHQgZnJvbSBcIi4uL0NvbnZlcnRlckNvbnRleHRcIjtcbmltcG9ydCB7IERyYWZ0LCBzaW5nbGV0b25QYXRoVmlzaXRvciwgVUkgfSBmcm9tIFwiLi4vaGVscGVycy9CaW5kaW5nSGVscGVyXCI7XG5cbi8qKlxuICogUmV0cmlldmVzIGFsbCB0aGUgZGF0YSBmaWVsZCBmb3IgYWN0aW9ucyBmb3IgdGhlIGlkZW50aWZpY2F0aW9uIGFubm90YXRpb25cbiAqIFRoZXkgbXVzdCBiZVxuICogLSBOb3Qgc3RhdGljYWxseSBoaWRkZW5cbiAqIC0gRWl0aGVyIGxpbmtlZCB0byBhbiBVbmJvdW5kIGFjdGlvbiBvciB0byBhbiBhY3Rpb24gd2hpY2ggaGFzIGFuIE9wZXJhdGlvbkF2YWlsYWJsZSB0aGF0IGlzIG5vdCBzZXQgdG8gZmFsc2Ugc3RhdGljYWxseS5cbiAqXG4gKiBAcGFyYW0ge0VudGl0eVR5cGV9IGVudGl0eVR5cGUgVGhlIGN1cnJlbnQgZW50aXR5IHR5cGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYkRldGVybWluaW5nIFRoZSBmbGFnIHdoaWNoIGRlbm90ZXMgd2hldGhlciBvciBub3QgdGhlIGFjdGlvbiBpcyBhIGRldGVybWluaW5nIGFjdGlvblxuICogQHJldHVybnMge0RhdGFGaWVsZEZvckFjdGlvblR5cGVzW119IEFuIGFycmF5IG9mIERhdGFGaWVsZCBmb3IgYWN0aW9uIHJlc3BlY3RpbmcgdGhlIGlucHV0IHBhcmFtZXRlciAnYkRldGVybWluaW5nJ1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0SWRlbnRpZmljYXRpb25EYXRhRmllbGRGb3JBY3Rpb25zKGVudGl0eVR5cGU6IEVudGl0eVR5cGUsIGJEZXRlcm1pbmluZzogYm9vbGVhbik6IERhdGFGaWVsZEZvckFjdGlvblR5cGVzW10ge1xuXHRyZXR1cm4gKGVudGl0eVR5cGUuYW5ub3RhdGlvbnM/LlVJPy5JZGVudGlmaWNhdGlvbj8uZmlsdGVyKGlkZW50aWZpY2F0aW9uRGF0YUZpZWxkID0+IHtcblx0XHRpZiAoaWRlbnRpZmljYXRpb25EYXRhRmllbGQ/LmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgIT09IHRydWUpIHtcblx0XHRcdGlmIChcblx0XHRcdFx0aWRlbnRpZmljYXRpb25EYXRhRmllbGQ/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckFjdGlvblwiICYmXG5cdFx0XHRcdCEhaWRlbnRpZmljYXRpb25EYXRhRmllbGQuRGV0ZXJtaW5pbmcgPT09IGJEZXRlcm1pbmluZyAmJlxuXHRcdFx0XHQoIWlkZW50aWZpY2F0aW9uRGF0YUZpZWxkPy5BY3Rpb25UYXJnZXQ/LmlzQm91bmQgfHxcblx0XHRcdFx0XHRpZGVudGlmaWNhdGlvbkRhdGFGaWVsZD8uQWN0aW9uVGFyZ2V0Py5hbm5vdGF0aW9ucz8uQ29yZT8uT3BlcmF0aW9uQXZhaWxhYmxlPy52YWx1ZU9mKCkgIT09IGZhbHNlKVxuXHRcdFx0KSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0pIHx8IFtdKSBhcyBEYXRhRmllbGRGb3JBY3Rpb25UeXBlc1tdO1xufVxuXG4vKipcbiAqIFJldHJpZXZlIGFsbCB0aGUgSUJOIGFjdGlvbnMgZm9yIHRoZSBpZGVudGlmaWNhdGlvbiBhbm5vdGF0aW9uLlxuICogVGhleSBtdXN0IGJlXG4gKiAtIE5vdCBzdGF0aWNhbGx5IGhpZGRlbi5cbiAqIEBwYXJhbSB7RW50aXR5VHlwZX0gZW50aXR5VHlwZSBUaGUgY3VycmVudCBlbnRpdHl0eXBlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGJEZXRlcm1pbmluZyBXaGV0aGVyIG9yIG5vdCB0aGUgYWN0aW9uIHNob3VsZCBiZSBkZXRlcm1pbmluZ1xuICogQHJldHVybnMge0RhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvblR5cGVzW119IEFuIGFycmF5IG9mIGRhdGFmaWVsZCBmb3IgYWN0aW9uIHJlc3BlY3RpbmcgdGhlIGJEZXRlcm1pbmluZyBwcm9wZXJ0eS5cbiAqL1xuZnVuY3Rpb24gZ2V0SWRlbnRpZmljYXRpb25EYXRhRmllbGRGb3JJQk5BY3Rpb25zKGVudGl0eVR5cGU6IEVudGl0eVR5cGUsIGJEZXRlcm1pbmluZzogYm9vbGVhbik6IERhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvblR5cGVzW10ge1xuXHRyZXR1cm4gKGVudGl0eVR5cGUuYW5ub3RhdGlvbnM/LlVJPy5JZGVudGlmaWNhdGlvbj8uZmlsdGVyKGlkZW50aWZpY2F0aW9uRGF0YUZpZWxkID0+IHtcblx0XHRpZiAoaWRlbnRpZmljYXRpb25EYXRhRmllbGQ/LmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgIT09IHRydWUpIHtcblx0XHRcdGlmIChcblx0XHRcdFx0aWRlbnRpZmljYXRpb25EYXRhRmllbGQ/LiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvblwiICYmXG5cdFx0XHRcdCEhaWRlbnRpZmljYXRpb25EYXRhRmllbGQuRGV0ZXJtaW5pbmcgPT09IGJEZXRlcm1pbmluZ1xuXHRcdFx0KSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fSkgfHwgW10pIGFzIERhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvblR5cGVzW107XG59XG5cbmNvbnN0IElNUE9SVEFOVF9DUklUSUNBTElUSUVTID0gW1xuXHRcIlVJLkNyaXRpY2FsaXR5VHlwZS9WZXJ5UG9zaXRpdmVcIixcblx0XCJVSS5Dcml0aWNhbGl0eVR5cGUvUG9zaXRpdmVcIixcblx0XCJVSS5Dcml0aWNhbGl0eVR5cGUvTmVnYXRpdmVcIixcblx0XCJVSS5Dcml0aWNhbGl0eVR5cGUvVmVyeU5lZ2F0aXZlXCJcbl07XG5cbi8qKlxuICogTWV0aG9kIHRvIGRldGVybWluZSB0aGUgJ3Zpc2libGUnIHByb3BlcnR5IGJpbmRpbmcgZm9yIHRoZSBEZWxldGUgYnV0dG9uIG9uIGFuIG9iamVjdCBwYWdlLlxuICpcbiAqIEBwYXJhbSB7Q29udmVydGVyQ29udGV4dH0gY29udmVydGVyQ29udGV4dCBJbnN0YW5jZSBvZiB0aGUgY29udmVydGVyIGNvbnRleHQuXG4gKiBAcGFyYW0ge1Byb3BlcnR5QW5ub3RhdGlvblZhbHVlPGJvb2xlYW4+IHwgdW5kZWZpbmVkfSBkZWxldGVIaWRkZW4gVGhlIHZhbHVlIG9mIHRoZSBVSS5EZWxldGVIaWRkZW4gYW5ub3RhdGlvbiBvbiB0aGUgZW50aXR5IHNldCAvIHR5cGUuXG4gKiBAcmV0dXJucyB7RXhwcmVzc2lvbjxib29sZWFuPn0gVGhlIGJpbmRpbmcgZXhwcmVzc2lvbiBmb3IgdGhlICd2aXNpYmxlJyBwcm9wZXJ0eSBvZiB0aGUgRGVsZXRlIGJ1dHRvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldERlbGV0ZUJ1dHRvblZpc2liaWxpdHkoXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGRlbGV0ZUhpZGRlbjogUHJvcGVydHlBbm5vdGF0aW9uVmFsdWU8Ym9vbGVhbj4gfCB1bmRlZmluZWRcbik6IEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRjb25zdCBkYXRhTW9kZWxPYmplY3RQYXRoID0gY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCksXG5cdFx0dmlzaXRlZE5hdmlnYXRpb25QYXRocyA9IGRhdGFNb2RlbE9iamVjdFBhdGgubmF2aWdhdGlvblByb3BlcnRpZXMubWFwKG5hdlByb3AgPT4gbmF2UHJvcC5uYW1lKSxcblx0XHQvLyBTZXQgYWJzb2x1dGUgYmluZGluZyBwYXRoIGZvciBTaW5nbGV0b24gcmVmZXJlbmNlcywgb3RoZXJ3aXNlIHRoZSBjb25maWd1cmVkIGFubm90YXRpb24gcGF0aCBpdHNlbGYuXG5cdFx0Ly8gRm9yIGUuZy4gL2NvbS5zYXAubmFtZXNwYWNlLkVudGl0eUNvbnRhaW5lci9TaW5nbGV0b24vUHJvcGVydHkgdG8gL1NpbmdsZXRvbi9Qcm9wZXJ0eVxuXHRcdGRlbGV0ZUhpZGRlbkV4cHJlc3Npb246IEV4cHJlc3Npb248Ym9vbGVhbiB8IHVuZGVmaW5lZD4gPSBhbm5vdGF0aW9uRXhwcmVzc2lvbihcblx0XHRcdGRlbGV0ZUhpZGRlbixcblx0XHRcdHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMsXG5cdFx0XHR1bmRlZmluZWQsXG5cdFx0XHQocGF0aDogc3RyaW5nKSA9PiBzaW5nbGV0b25QYXRoVmlzaXRvcihwYXRoLCBjb252ZXJ0ZXJDb250ZXh0LCBbXSlcblx0XHQpLFxuXHRcdG1hbmlmZXN0V3JhcHBlciA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCksXG5cdFx0dmlld0xldmVsID0gbWFuaWZlc3RXcmFwcGVyLmdldFZpZXdMZXZlbCgpLFxuXHRcdC8vIERlbGV0ZSBidXR0b24gaXMgdmlzaWJsZVxuXHRcdC8vIEluIE9QIFx0XHQtLT4gIHdoZW4gbm90IGluIGVkaXQgbW9kZVxuXHRcdC8vIEluIHN1Yi1PUCBcdC0tPiAgd2hlbiBpbiBlZGl0IG1vZGVcblx0XHRlZGl0YWJsZUV4cHJlc3Npb246IEV4cHJlc3Npb248Ym9vbGVhbj4gPSB2aWV3TGV2ZWwgPiAxID8gVUkuSXNFZGl0YWJsZSA6IG5vdChVSS5Jc0VkaXRhYmxlKTtcblxuXHQvLyBJZiBVSS5EZWxldGVIaWRkZW4gYW5ub3RhdGlvbiBvbiBlbnRpdHkgc2V0IG9yIHR5cGUgaXMgZWl0aGVyIG5vdCBkZWZpbmVkIG9yIGV4cGxpY2l0bHkgc2V0IHRvIGZhbHNlLFxuXHQvLyBEZWxldGUgYnV0dG9uIGlzIHZpc2libGUgYmFzZWQgb24gZWRpdGFibGVFeHByZXNzaW9uLlxuXHQvLyBlbHNlLFxuXHQvLyBEZWxldGUgYnV0dG9uIGlzIHZpc2libGUgYmFzZWQgb24gYm90aCBhbm5vdGF0aW9uIHBhdGggYW5kIGVkaXRhYmxlRXhwcmVzc2lvbi5cblx0cmV0dXJuIGlmRWxzZShcblx0XHRkZWxldGVIaWRkZW4gPT09IHVuZGVmaW5lZCB8fCBkZWxldGVIaWRkZW4udmFsdWVPZigpID09PSBmYWxzZSxcblx0XHRlZGl0YWJsZUV4cHJlc3Npb24sXG5cdFx0YW5kKGVkaXRhYmxlRXhwcmVzc2lvbiwgZXF1YWwoZGVsZXRlSGlkZGVuRXhwcmVzc2lvbiwgZmFsc2UpKVxuXHQpO1xufVxuXG4vKipcbiAqIE1ldGhvZCB0byBkZXRlcm1pbmUgdGhlICdlbmFibGVkJyBwcm9wZXJ0eSBiaW5kaW5nIGZvciB0aGUgRGVsZXRlIGJ1dHRvbiBvbiBhbiBvYmplY3QgcGFnZS5cbiAqXG4gKiBAcGFyYW0ge1Byb3BlcnR5QW5ub3RhdGlvblZhbHVlPGJvb2xlYW4+fHVuZGVmaW5lZH0gaXNEZWxldGFibGUgVGhlIGRlbGV0ZSByZXN0cmljdGlvbiBjb25maWd1cmVkXG4gKiBAcGFyYW0ge0V4cHJlc3Npb248Ym9vbGVhbj59IGlzUGFyZW50RGVsZXRhYmxlIFRoZSBkZWxldGUgcmVzdHJpY3Rpb24gY29uZmlndXJlZCBvbiB0aGUgcGFyZW50IGVudGl0eVxuICogQHJldHVybnMge0V4cHJlc3Npb248Ym9vbGVhbj59IFRoZSBiaW5kaW5nIGV4cHJlc3Npb24gZm9yIHRoZSAnZW5hYmxlZCcgcHJvcGVydHkgb2YgdGhlIERlbGV0ZSBidXR0b25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldERlbGV0ZUJ1dHRvbkVuYWJsZWQoXG5cdGlzRGVsZXRhYmxlOiBQcm9wZXJ0eUFubm90YXRpb25WYWx1ZTxCb29sZWFuPiB8IHVuZGVmaW5lZCxcblx0aXNQYXJlbnREZWxldGFibGU6IEV4cHJlc3Npb248Ym9vbGVhbj5cbik6IEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRyZXR1cm4gaWZFbHNlKFxuXHRcdGlzUGFyZW50RGVsZXRhYmxlICE9PSB1bmRlZmluZWQsXG5cdFx0aXNQYXJlbnREZWxldGFibGUsXG5cdFx0aWZFbHNlKGlzRGVsZXRhYmxlICE9PSB1bmRlZmluZWQsIGVxdWFsKGlzRGVsZXRhYmxlLCB0cnVlKSwgY29uc3RhbnQodHJ1ZSkpXG5cdCk7XG59XG5cbi8qKlxuICogTWV0aG9kIHRvIGRldGVybWluZSB0aGUgJ3Zpc2libGUnIHByb3BlcnR5IGJpbmRpbmcgZm9yIHRoZSBFZGl0IGJ1dHRvbiBvbiBhbiBvYmplY3QgcGFnZS5cbiAqXG4gKiBAcGFyYW0ge0NvbnZlcnRlckNvbnRleHR9IGNvbnZlcnRlckNvbnRleHQgSW5zdGFuY2Ugb2YgdGhlIGNvbnZlcnRlciBjb250ZXh0LlxuICogQHBhcmFtIHtQcm9wZXJ0eUFubm90YXRpb25WYWx1ZTxib29sZWFuPiB8IHVuZGVmaW5lZH0gdXBkYXRlSGlkZGVuIFRoZSB2YWx1ZSBvZiB0aGUgVUkuVXBkYXRlSGlkZGVuIGFubm90YXRpb24gb24gdGhlIGVudGl0eSBzZXQgLyB0eXBlLlxuICogQHJldHVybnMge0V4cHJlc3Npb248Ym9vbGVhbj59IFRoZSBiaW5kaW5nIGV4cHJlc3Npb24gZm9yIHRoZSAndmlzaWJsZScgcHJvcGVydHkgb2YgdGhlIEVkaXQgYnV0dG9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWRpdEJ1dHRvblZpc2liaWxpdHkoXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdHVwZGF0ZUhpZGRlbjogUHJvcGVydHlBbm5vdGF0aW9uVmFsdWU8Ym9vbGVhbj4gfCB1bmRlZmluZWRcbik6IEV4cHJlc3Npb248Ym9vbGVhbj4ge1xuXHRjb25zdCBlbnRpdHlTZXQgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldCgpLFxuXHRcdGJJc0RyYWZ0Um9vdCA9IGVudGl0eVNldCAmJiBlbnRpdHlTZXQuYW5ub3RhdGlvbnMuQ29tbW9uPy5EcmFmdFJvb3QgPyB0cnVlIDogZmFsc2UsXG5cdFx0ZGF0YU1vZGVsT2JqZWN0UGF0aCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpLFxuXHRcdHZpc2l0ZWROYXZpZ2F0aW9uUGF0aHMgPSBkYXRhTW9kZWxPYmplY3RQYXRoLm5hdmlnYXRpb25Qcm9wZXJ0aWVzLm1hcChuYXZQcm9wID0+IG5hdlByb3AubmFtZSksXG5cdFx0Ly8gU2V0IGFic29sdXRlIGJpbmRpbmcgcGF0aCBmb3IgU2luZ2xldG9uIHJlZmVyZW5jZXMsIG90aGVyd2lzZSB0aGUgY29uZmlndXJlZCBhbm5vdGF0aW9uIHBhdGggaXRzZWxmLlxuXHRcdC8vIEZvciBlLmcuIC9jb20uc2FwLm5hbWVzcGFjZS5FbnRpdHlDb250YWluZXIvU2luZ2xldG9uL1Byb3BlcnR5IHRvIC9TaW5nbGV0b24vUHJvcGVydHlcblx0XHR1cGRhdGVIaWRkZW5FeHByZXNzaW9uOiBFeHByZXNzaW9uPGJvb2xlYW4gfCB1bmRlZmluZWQ+ID0gYW5ub3RhdGlvbkV4cHJlc3Npb24oXG5cdFx0XHR1cGRhdGVIaWRkZW4sXG5cdFx0XHR2aXNpdGVkTmF2aWdhdGlvblBhdGhzLFxuXHRcdFx0dW5kZWZpbmVkLFxuXHRcdFx0KHBhdGg6IHN0cmluZykgPT4gc2luZ2xldG9uUGF0aFZpc2l0b3IocGF0aCwgY29udmVydGVyQ29udGV4dCwgdmlzaXRlZE5hdmlnYXRpb25QYXRocylcblx0XHQpLFxuXHRcdG5vdEVkaXRhYmxlRXhwcmVzc2lvbjogRXhwcmVzc2lvbjxib29sZWFuPiA9IG5vdChVSS5Jc0VkaXRhYmxlKTtcblxuXHQvLyBJZiBVSS5VcGRhdGVIaWRkZW4gYW5ub3RhdGlvbiBvbiBlbnRpdHkgc2V0IG9yIHR5cGUgaXMgZWl0aGVyIG5vdCBkZWZpbmVkIG9yIGV4cGxpY2l0bHkgc2V0IHRvIGZhbHNlLFxuXHQvLyBFZGl0IGJ1dHRvbiBpcyB2aXNpYmxlIGluIGRpc3BsYXkgbW9kZS5cblx0Ly8gZWxzZSxcblx0Ly8gRWRpdCBidXR0b24gaXMgdmlzaWJsZSBiYXNlZCBvbiBib3RoIGFubm90YXRpb24gcGF0aCBhbmQgaW4gZGlzcGxheSBtb2RlLlxuXHRjb25zdCByZXN1bHRhbnRFeHByZXNzaW9uOiBFeHByZXNzaW9uPGJvb2xlYW4+ID0gaWZFbHNlKFxuXHRcdHVwZGF0ZUhpZGRlbiA9PT0gdW5kZWZpbmVkIHx8IHVwZGF0ZUhpZGRlbi52YWx1ZU9mKCkgPT09IGZhbHNlLFxuXHRcdG5vdEVkaXRhYmxlRXhwcmVzc2lvbixcblx0XHRhbmQobm90RWRpdGFibGVFeHByZXNzaW9uLCBlcXVhbCh1cGRhdGVIaWRkZW5FeHByZXNzaW9uLCBmYWxzZSkpXG5cdCk7XG5cdHJldHVybiBpZkVsc2UoYklzRHJhZnRSb290LCBhbmQocmVzdWx0YW50RXhwcmVzc2lvbiwgRHJhZnQuSGFzTm9EcmFmdEZvckN1cnJlbnRVc2VyKSwgcmVzdWx0YW50RXhwcmVzc2lvbik7XG59XG5cbi8qKlxuICogTWV0aG9kIHRvIGRldGVybWluZSB0aGUgJ2VuYWJsZWQnIHByb3BlcnR5IGJpbmRpbmcgZm9yIHRoZSBFZGl0IGJ1dHRvbiBvbiBhbiBvYmplY3QgcGFnZS5cbiAqXG4gKiBAcGFyYW0ge0NvbnZlcnRlckNvbnRleHR9IGNvbnZlcnRlckNvbnRleHQgSW5zdGFuY2Ugb2YgdGhlIGNvbnZlcnRlciBjb250ZXh0LlxuICogQHJldHVybnMge0V4cHJlc3Npb248Ym9vbGVhbj59IFRoZSBiaW5kaW5nIGV4cHJlc3Npb24gZm9yIHRoZSAnZW5hYmxlZCcgcHJvcGVydHkgb2YgdGhlIEVkaXQgYnV0dG9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWRpdEJ1dHRvbkVuYWJsZWQoY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IEJpbmRpbmdFeHByZXNzaW9uPGJvb2xlYW4+IHtcblx0Y29uc3QgZW50aXR5U2V0ID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKSxcblx0XHRpc0RyYWZ0Um9vdCA9IGVudGl0eVNldCAmJiBlbnRpdHlTZXQuYW5ub3RhdGlvbnMuQ29tbW9uPy5EcmFmdFJvb3QgPyB0cnVlIDogZmFsc2UsXG5cdFx0aXNTdGlja3kgPSBlbnRpdHlTZXQgJiYgZW50aXR5U2V0LmFubm90YXRpb25zLlNlc3Npb24/LlN0aWNreVNlc3Npb25TdXBwb3J0ZWQgPyB0cnVlIDogZmFsc2U7XG5cblx0bGV0IGVkaXRBY3Rpb25OYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cdGlmIChpc0RyYWZ0Um9vdCkge1xuXHRcdGVkaXRBY3Rpb25OYW1lID0gZW50aXR5U2V0Py5hbm5vdGF0aW9ucy5Db21tb24/LkRyYWZ0Um9vdD8uRWRpdEFjdGlvbiBhcyBzdHJpbmc7XG5cdH0gZWxzZSBpZiAoaXNTdGlja3kpIHtcblx0XHRlZGl0QWN0aW9uTmFtZSA9IGVudGl0eVNldD8uYW5ub3RhdGlvbnMuU2Vzc2lvbj8uU3RpY2t5U2Vzc2lvblN1cHBvcnRlZD8uRWRpdEFjdGlvbiBhcyBzdHJpbmc7XG5cdH1cblx0aWYgKGVkaXRBY3Rpb25OYW1lKSB7XG5cdFx0Y29uc3QgZWRpdEFjdGlvbkFubm90YXRpb25QYXRoID0gY29udmVydGVyQ29udGV4dC5nZXRBYnNvbHV0ZUFubm90YXRpb25QYXRoKGVkaXRBY3Rpb25OYW1lIGFzIHN0cmluZyksXG5cdFx0XHRlZGl0QWN0aW9ucyA9IChjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGVBbm5vdGF0aW9uKGVkaXRBY3Rpb25Bbm5vdGF0aW9uUGF0aCk/LmFubm90YXRpb24gYXMgYW55KT8uYWN0aW9ucztcblx0XHRpZiAoZWRpdEFjdGlvbnM/Lmxlbmd0aCkge1xuXHRcdFx0Y29uc3QgZWRpdEFjdGlvbiA9IGVkaXRBY3Rpb25zWzBdO1xuXHRcdFx0aWYgKGVkaXRBY3Rpb24/LmFubm90YXRpb25zPy5Db3JlPy5PcGVyYXRpb25BdmFpbGFibGUgPT09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuIFwiez0gJHsjXCIgKyBlZGl0QWN0aW9uTmFtZSArIFwifSA/IHRydWUgOiBmYWxzZSB9XCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gZ2V0RW5hYmxlZEZvckFubm90YXRpb25BY3Rpb24oY29udmVydGVyQ29udGV4dCwgZWRpdEFjdGlvbik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SGVhZGVyRGVmYXVsdEFjdGlvbnMoY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IEJhc2VBY3Rpb25bXSB7XG5cdGNvbnN0IGVudGl0eVNldCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0KCksXG5cdFx0ZW50aXR5VHlwZSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpLFxuXHRcdG9TdGlja3lTZXNzaW9uU3VwcG9ydGVkID0gZW50aXR5U2V0ICYmIGVudGl0eVNldC5hbm5vdGF0aW9ucz8uU2Vzc2lvbj8uU3RpY2t5U2Vzc2lvblN1cHBvcnRlZCwgLy9mb3Igc3RpY2t5IGFwcFxuXHRcdG9EcmFmdFJvb3QgPSBlbnRpdHlTZXQgJiYgZW50aXR5U2V0LmFubm90YXRpb25zLkNvbW1vbj8uRHJhZnRSb290LFxuXHRcdG9FbnRpdHlEZWxldGVSZXN0cmljdGlvbnMgPSBlbnRpdHlTZXQgJiYgZW50aXR5U2V0LmFubm90YXRpb25zPy5DYXBhYmlsaXRpZXM/LkRlbGV0ZVJlc3RyaWN0aW9ucyxcblx0XHRiVXBkYXRlSGlkZGVuID0gZW50aXR5U2V0ICYmIGVudGl0eVNldC5hbm5vdGF0aW9ucy5VST8uVXBkYXRlSGlkZGVuPy52YWx1ZU9mKCksXG5cdFx0ZGF0YU1vZGVsT2JqZWN0UGF0aCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpLFxuXHRcdGlzUGFyZW50RGVsZXRhYmxlID0gaXNQYXRoRGVsZXRhYmxlKGRhdGFNb2RlbE9iamVjdFBhdGgpLFxuXHRcdGJQYXJlbnRFbnRpdHlTZXREZWxldGFibGUgPSBpc1BhcmVudERlbGV0YWJsZSA/IGNvbXBpbGVCaW5kaW5nKGlzUGFyZW50RGVsZXRhYmxlKSA6IGlzUGFyZW50RGVsZXRhYmxlLFxuXHRcdGhlYWRlckRhdGFGaWVsZEZvckFjdGlvbnMgPSBnZXRJZGVudGlmaWNhdGlvbkRhdGFGaWVsZEZvckFjdGlvbnMoY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCksIGZhbHNlKTtcblxuXHQvLyBGaXJzdCBhZGQgdGhlIFwiQ3JpdGljYWxcIiBEYXRhRmllbGRGb3JBY3Rpb25zXG5cdGNvbnN0IGhlYWRlckFjdGlvbnM6IEJhc2VBY3Rpb25bXSA9IGhlYWRlckRhdGFGaWVsZEZvckFjdGlvbnNcblx0XHQuZmlsdGVyKGRhdGFGaWVsZCA9PiB7XG5cdFx0XHRyZXR1cm4gSU1QT1JUQU5UX0NSSVRJQ0FMSVRJRVMuaW5kZXhPZihkYXRhRmllbGQ/LkNyaXRpY2FsaXR5IGFzIHN0cmluZykgPiAtMTtcblx0XHR9KVxuXHRcdC5tYXAoZGF0YUZpZWxkID0+IHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHR5cGU6IEFjdGlvblR5cGUuRGF0YUZpZWxkRm9yQWN0aW9uLFxuXHRcdFx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGRhdGFGaWVsZC5mdWxseVF1YWxpZmllZE5hbWUpLFxuXHRcdFx0XHRrZXk6IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQoZGF0YUZpZWxkKSxcblx0XHRcdFx0dmlzaWJsZTogY29tcGlsZUJpbmRpbmcobm90KGVxdWFsKGFubm90YXRpb25FeHByZXNzaW9uKGRhdGFGaWVsZC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbiksIHRydWUpKSksXG5cdFx0XHRcdGVuYWJsZWQ6IGdldEVuYWJsZWRGb3JBbm5vdGF0aW9uQWN0aW9uKGNvbnZlcnRlckNvbnRleHQsIGRhdGFGaWVsZC5BY3Rpb25UYXJnZXQpLFxuXHRcdFx0XHRpc05hdmlnYWJsZTogdHJ1ZVxuXHRcdFx0fTtcblx0XHR9KTtcblxuXHQvLyBUaGVuIHRoZSBlZGl0IGFjdGlvbiBpZiBpdCBleGlzdHNcblx0aWYgKChvRHJhZnRSb290Py5FZGl0QWN0aW9uIHx8IG9TdGlja3lTZXNzaW9uU3VwcG9ydGVkPy5FZGl0QWN0aW9uKSAmJiBiVXBkYXRlSGlkZGVuICE9PSB0cnVlKSB7XG5cdFx0Y29uc3QgdXBkYXRlSGlkZGVuID0gKGVudGl0eVNldD8uYW5ub3RhdGlvbnMuVUk/LlVwZGF0ZUhpZGRlbj8udmFsdWVPZigpICE9PSB1bmRlZmluZWRcblx0XHRcdD8gZW50aXR5U2V0Py5hbm5vdGF0aW9ucy5VST8uVXBkYXRlSGlkZGVuXG5cdFx0XHQ6IGVudGl0eVR5cGU/LmFubm90YXRpb25zLlVJPy5VcGRhdGVIaWRkZW4pIGFzIFByb3BlcnR5QW5ub3RhdGlvblZhbHVlPGJvb2xlYW4+O1xuXHRcdGhlYWRlckFjdGlvbnMucHVzaCh7XG5cdFx0XHR0eXBlOiBBY3Rpb25UeXBlLlByaW1hcnksXG5cdFx0XHRrZXk6IFwiRWRpdEFjdGlvblwiLFxuXHRcdFx0dmlzaWJsZTogY29tcGlsZUJpbmRpbmcoZ2V0RWRpdEJ1dHRvblZpc2liaWxpdHkoY29udmVydGVyQ29udGV4dCwgdXBkYXRlSGlkZGVuKSksXG5cdFx0XHRlbmFibGVkOiBnZXRFZGl0QnV0dG9uRW5hYmxlZChjb252ZXJ0ZXJDb250ZXh0KVxuXHRcdH0pO1xuXHR9XG5cdC8vIFRoZW4gdGhlIGRlbGV0ZSBhY3Rpb24gaWYgd2UncmUgbm90IHN0YXRpY2FsbHkgbm90IGRlbGV0YWJsZVxuXHRpZiAoXG5cdFx0KGJQYXJlbnRFbnRpdHlTZXREZWxldGFibGUgJiYgYlBhcmVudEVudGl0eVNldERlbGV0YWJsZSAhPT0gXCJmYWxzZVwiKSB8fFxuXHRcdChvRW50aXR5RGVsZXRlUmVzdHJpY3Rpb25zPy5EZWxldGFibGU/LnZhbHVlT2YoKSAhPT0gZmFsc2UgJiYgYlBhcmVudEVudGl0eVNldERlbGV0YWJsZSAhPT0gXCJmYWxzZVwiKVxuXHQpIHtcblx0XHRjb25zdCBkZWxldGVIaWRkZW4gPSAoZW50aXR5U2V0Py5hbm5vdGF0aW9ucy5VST8uRGVsZXRlSGlkZGVuPy52YWx1ZU9mKCkgIT09IHVuZGVmaW5lZFxuXHRcdFx0PyBlbnRpdHlTZXQ/LmFubm90YXRpb25zLlVJPy5EZWxldGVIaWRkZW5cblx0XHRcdDogZW50aXR5VHlwZT8uYW5ub3RhdGlvbnMuVUk/LkRlbGV0ZUhpZGRlbikgYXMgUHJvcGVydHlBbm5vdGF0aW9uVmFsdWU8Ym9vbGVhbj47XG5cdFx0aGVhZGVyQWN0aW9ucy5wdXNoKHtcblx0XHRcdHR5cGU6IEFjdGlvblR5cGUuU2Vjb25kYXJ5LFxuXHRcdFx0a2V5OiBcIkRlbGV0ZUFjdGlvblwiLFxuXHRcdFx0dmlzaWJsZTogY29tcGlsZUJpbmRpbmcoZ2V0RGVsZXRlQnV0dG9uVmlzaWJpbGl0eShjb252ZXJ0ZXJDb250ZXh0LCBkZWxldGVIaWRkZW4pKSxcblx0XHRcdGVuYWJsZWQ6IGNvbXBpbGVCaW5kaW5nKGdldERlbGV0ZUJ1dHRvbkVuYWJsZWQob0VudGl0eURlbGV0ZVJlc3RyaWN0aW9ucz8uRGVsZXRhYmxlLCBpc1BhcmVudERlbGV0YWJsZSkpLFxuXHRcdFx0cGFyZW50RW50aXR5RGVsZXRlRW5hYmxlZDogYlBhcmVudEVudGl0eVNldERlbGV0YWJsZVxuXHRcdH0pO1xuXHR9XG5cblx0aWYgKG9EcmFmdFJvb3Q/LkVkaXRBY3Rpb24gJiYgYlVwZGF0ZUhpZGRlbiAhPT0gdHJ1ZSkge1xuXHRcdGhlYWRlckFjdGlvbnMucHVzaCh7IHR5cGU6IEFjdGlvblR5cGUuU3dpdGNoVG9BY3RpdmVPYmplY3QsIGtleTogXCJTd2l0Y2hUb0FjdGl2ZU9iamVjdFwiIH0pO1xuXHRcdGhlYWRlckFjdGlvbnMucHVzaCh7IHR5cGU6IEFjdGlvblR5cGUuU3dpdGNoVG9EcmFmdE9iamVjdCwga2V5OiBcIlN3aXRjaFRvRHJhZnRPYmplY3RcIiB9KTtcblx0fVxuXG5cdGNvbnN0IGhlYWRlckRhdGFGaWVsZEZvcklCTkFjdGlvbnMgPSBnZXRJZGVudGlmaWNhdGlvbkRhdGFGaWVsZEZvcklCTkFjdGlvbnMoY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCksIGZhbHNlKTtcblxuXHRoZWFkZXJEYXRhRmllbGRGb3JJQk5BY3Rpb25zXG5cdFx0LmZpbHRlcihkYXRhRmllbGQgPT4ge1xuXHRcdFx0cmV0dXJuIElNUE9SVEFOVF9DUklUSUNBTElUSUVTLmluZGV4T2YoZGF0YUZpZWxkPy5Dcml0aWNhbGl0eSBhcyBzdHJpbmcpID09PSAtMTtcblx0XHR9KVxuXHRcdC5tYXAoZGF0YUZpZWxkID0+IHtcblx0XHRcdGNvbnN0IG9OYXZpZ2F0aW9uUGFyYW1zID0ge1xuXHRcdFx0XHRzZW1hbnRpY09iamVjdE1hcHBpbmc6IGRhdGFGaWVsZC5NYXBwaW5nID8gZ2V0U2VtYW50aWNPYmplY3RNYXBwaW5nKGRhdGFGaWVsZC5NYXBwaW5nKSA6IFtdXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoZGF0YUZpZWxkLlJlcXVpcmVzQ29udGV4dD8udmFsdWVPZigpID09PSB0cnVlKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlJlcXVpcmVzQ29udGV4dCBwcm9wZXJ0eSBzaG91bGQgbm90IGJlIHRydWUgZm9yIGhlYWRlciBJQk4gYWN0aW9uIDogXCIgKyBkYXRhRmllbGQuTGFiZWwpO1xuXHRcdFx0fSBlbHNlIGlmIChkYXRhRmllbGQuSW5saW5lPy52YWx1ZU9mKCkgPT09IHRydWUpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSW5saW5lIHByb3BlcnR5IHNob3VsZCBub3QgYmUgdHJ1ZSBmb3IgaGVhZGVyIElCTiBhY3Rpb24gOiBcIiArIGRhdGFGaWVsZC5MYWJlbCk7XG5cdFx0XHR9XG5cdFx0XHRoZWFkZXJBY3Rpb25zLnB1c2goe1xuXHRcdFx0XHR0eXBlOiBBY3Rpb25UeXBlLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbixcblx0XHRcdFx0dGV4dDogZGF0YUZpZWxkLkxhYmVsPy50b1N0cmluZygpLFxuXHRcdFx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGRhdGFGaWVsZC5mdWxseVF1YWxpZmllZE5hbWUpLFxuXHRcdFx0XHRidXR0b25UeXBlOiBCdXR0b25UeXBlLkdob3N0LFxuXHRcdFx0XHR2aXNpYmxlOiBjb21waWxlQmluZGluZyhub3QoZXF1YWwoYW5ub3RhdGlvbkV4cHJlc3Npb24oZGF0YUZpZWxkLmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkpLCB0cnVlKSkpLFxuXHRcdFx0XHRlbmFibGVkOlxuXHRcdFx0XHRcdGRhdGFGaWVsZC5OYXZpZ2F0aW9uQXZhaWxhYmxlICE9PSB1bmRlZmluZWRcblx0XHRcdFx0XHRcdD8gY29tcGlsZUJpbmRpbmcoZXF1YWwoYW5ub3RhdGlvbkV4cHJlc3Npb24oZGF0YUZpZWxkLk5hdmlnYXRpb25BdmFpbGFibGU/LnZhbHVlT2YoKSksIHRydWUpKVxuXHRcdFx0XHRcdFx0OiB0cnVlLFxuXHRcdFx0XHRrZXk6IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQoZGF0YUZpZWxkKSxcblx0XHRcdFx0aXNOYXZpZ2FibGU6IHRydWUsXG5cdFx0XHRcdHByZXNzOiBjb21waWxlQmluZGluZyhcblx0XHRcdFx0XHRmbihcIi5faW50ZW50QmFzZWROYXZpZ2F0aW9uLm5hdmlnYXRlXCIsIFtcblx0XHRcdFx0XHRcdGFubm90YXRpb25FeHByZXNzaW9uKGRhdGFGaWVsZC5TZW1hbnRpY09iamVjdCksXG5cdFx0XHRcdFx0XHRhbm5vdGF0aW9uRXhwcmVzc2lvbihkYXRhRmllbGQuQWN0aW9uKSxcblx0XHRcdFx0XHRcdG9OYXZpZ2F0aW9uUGFyYW1zXG5cdFx0XHRcdFx0XSlcblx0XHRcdFx0KSxcblx0XHRcdFx0Y3VzdG9tRGF0YTogY29tcGlsZUJpbmRpbmcoe1xuXHRcdFx0XHRcdHNlbWFudGljT2JqZWN0OiBhbm5vdGF0aW9uRXhwcmVzc2lvbihkYXRhRmllbGQuU2VtYW50aWNPYmplY3QpLFxuXHRcdFx0XHRcdGFjdGlvbjogYW5ub3RhdGlvbkV4cHJlc3Npb24oZGF0YUZpZWxkLkFjdGlvbilcblx0XHRcdFx0fSlcblx0XHRcdH0gYXMgQW5ub3RhdGlvbkFjdGlvbik7XG5cdFx0fSk7XG5cdC8vIEZpbmFsbHkgdGhlIG5vbiBjcml0aWNhbCBEYXRhRmllbGRGb3JBY3Rpb25zXG5cdGhlYWRlckRhdGFGaWVsZEZvckFjdGlvbnNcblx0XHQuZmlsdGVyKGRhdGFGaWVsZCA9PiB7XG5cdFx0XHRyZXR1cm4gSU1QT1JUQU5UX0NSSVRJQ0FMSVRJRVMuaW5kZXhPZihkYXRhRmllbGQ/LkNyaXRpY2FsaXR5IGFzIHN0cmluZykgPT09IC0xO1xuXHRcdH0pXG5cdFx0Lm1hcChkYXRhRmllbGQgPT4ge1xuXHRcdFx0aGVhZGVyQWN0aW9ucy5wdXNoKHtcblx0XHRcdFx0dHlwZTogQWN0aW9uVHlwZS5EYXRhRmllbGRGb3JBY3Rpb24sXG5cdFx0XHRcdGFubm90YXRpb25QYXRoOiBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgoZGF0YUZpZWxkLmZ1bGx5UXVhbGlmaWVkTmFtZSksXG5cdFx0XHRcdGtleTogS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChkYXRhRmllbGQpLFxuXHRcdFx0XHR2aXNpYmxlOiBjb21waWxlQmluZGluZyhub3QoZXF1YWwoYW5ub3RhdGlvbkV4cHJlc3Npb24oZGF0YUZpZWxkLmFubm90YXRpb25zPy5VST8uSGlkZGVuKSwgdHJ1ZSkpKSxcblx0XHRcdFx0ZW5hYmxlZDogZ2V0RW5hYmxlZEZvckFubm90YXRpb25BY3Rpb24oY29udmVydGVyQ29udGV4dCwgZGF0YUZpZWxkLkFjdGlvblRhcmdldCksXG5cdFx0XHRcdGlzTmF2aWdhYmxlOiB0cnVlXG5cdFx0XHR9IGFzIEFubm90YXRpb25BY3Rpb24pO1xuXHRcdH0pO1xuXG5cdHJldHVybiBoZWFkZXJBY3Rpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SGlkZGVuSGVhZGVyQWN0aW9ucyhjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogQmFzZUFjdGlvbltdIHtcblx0Y29uc3QgZW50aXR5VHlwZSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpO1xuXHRjb25zdCBoaWRkZW5BY3Rpb25zID0gKGVudGl0eVR5cGUuYW5ub3RhdGlvbnM/LlVJPy5JZGVudGlmaWNhdGlvbj8uZmlsdGVyKGlkZW50aWZpY2F0aW9uRGF0YUZpZWxkID0+IHtcblx0XHRyZXR1cm4gaWRlbnRpZmljYXRpb25EYXRhRmllbGQ/LmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgPT09IHRydWU7XG5cdH0pIHx8IFtdKSBhcyBEYXRhRmllbGRGb3JBY3Rpb25UeXBlc1tdO1xuXHRyZXR1cm4gaGlkZGVuQWN0aW9ucy5tYXAoZGF0YUZpZWxkID0+IHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dHlwZTogQWN0aW9uVHlwZS5EZWZhdWx0LFxuXHRcdFx0a2V5OiBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGRhdGFGaWVsZClcblx0XHR9O1xuXHR9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZvb3RlckRlZmF1bHRBY3Rpb25zKHZpZXdMZXZlbDogbnVtYmVyLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogQmFzZUFjdGlvbltdIHtcblx0Y29uc3QgZW50aXR5U2V0ID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKTtcblx0Y29uc3QgZW50aXR5VHlwZSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpO1xuXHRjb25zdCBvU3RpY2t5U2Vzc2lvblN1cHBvcnRlZCA9IGVudGl0eVNldCAmJiBlbnRpdHlTZXQuYW5ub3RhdGlvbnM/LlNlc3Npb24/LlN0aWNreVNlc3Npb25TdXBwb3J0ZWQsIC8vZm9yIHN0aWNreSBhcHBcblx0XHRzRW50aXR5U2V0RHJhZnRSb290ID1cblx0XHRcdGVudGl0eVNldCAmJiAoZW50aXR5U2V0LmFubm90YXRpb25zLkNvbW1vbj8uRHJhZnRSb290Py50ZXJtIHx8IGVudGl0eVNldC5hbm5vdGF0aW9ucz8uU2Vzc2lvbj8uU3RpY2t5U2Vzc2lvblN1cHBvcnRlZD8udGVybSksXG5cdFx0YkNvbmRpdGlvblNhdmUgPVxuXHRcdFx0c0VudGl0eVNldERyYWZ0Um9vdCA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRHJhZnRSb290XCIgfHxcblx0XHRcdChvU3RpY2t5U2Vzc2lvblN1cHBvcnRlZCAmJiBvU3RpY2t5U2Vzc2lvblN1cHBvcnRlZD8uU2F2ZUFjdGlvbiksXG5cdFx0YkNvbmRpdGlvbkFwcGx5ID0gdmlld0xldmVsID4gMSxcblx0XHRiQ29uZGl0aW9uQ2FuY2VsID1cblx0XHRcdHNFbnRpdHlTZXREcmFmdFJvb3QgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkRyYWZ0Um9vdFwiIHx8XG5cdFx0XHQob1N0aWNreVNlc3Npb25TdXBwb3J0ZWQgJiYgb1N0aWNreVNlc3Npb25TdXBwb3J0ZWQ/LkRpc2NhcmRBY3Rpb24pO1xuXG5cdC8vIFJldHJpZXZlIGFsbCBkZXRlcm1pbmluZyBhY3Rpb25zXG5cdGNvbnN0IGZvb3RlckRhdGFGaWVsZEZvckFjdGlvbnMgPSBnZXRJZGVudGlmaWNhdGlvbkRhdGFGaWVsZEZvckFjdGlvbnMoY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCksIHRydWUpO1xuXG5cdC8vIEZpcnN0IGFkZCB0aGUgXCJDcml0aWNhbFwiIERhdGFGaWVsZEZvckFjdGlvbnNcblx0Y29uc3QgZm9vdGVyQWN0aW9uczogQmFzZUFjdGlvbltdID0gZm9vdGVyRGF0YUZpZWxkRm9yQWN0aW9uc1xuXHRcdC5maWx0ZXIoZGF0YUZpZWxkID0+IHtcblx0XHRcdHJldHVybiBJTVBPUlRBTlRfQ1JJVElDQUxJVElFUy5pbmRleE9mKGRhdGFGaWVsZD8uQ3JpdGljYWxpdHkgYXMgc3RyaW5nKSA+IC0xO1xuXHRcdH0pXG5cdFx0Lm1hcChkYXRhRmllbGQgPT4ge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dHlwZTogQWN0aW9uVHlwZS5EYXRhRmllbGRGb3JBY3Rpb24sXG5cdFx0XHRcdGFubm90YXRpb25QYXRoOiBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgoZGF0YUZpZWxkLmZ1bGx5UXVhbGlmaWVkTmFtZSksXG5cdFx0XHRcdGtleTogS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChkYXRhRmllbGQpLFxuXHRcdFx0XHR2aXNpYmxlOiBjb21waWxlQmluZGluZyhub3QoZXF1YWwoYW5ub3RhdGlvbkV4cHJlc3Npb24oZGF0YUZpZWxkLmFubm90YXRpb25zPy5VST8uSGlkZGVuKSwgdHJ1ZSkpKSxcblx0XHRcdFx0ZW5hYmxlZDogZ2V0RW5hYmxlZEZvckFubm90YXRpb25BY3Rpb24oY29udmVydGVyQ29udGV4dCwgZGF0YUZpZWxkLkFjdGlvblRhcmdldCksXG5cdFx0XHRcdGlzTmF2aWdhYmxlOiB0cnVlXG5cdFx0XHR9O1xuXHRcdH0pO1xuXG5cdC8vIFRoZW4gdGhlIHNhdmUgYWN0aW9uIGlmIGl0IGV4aXN0c1xuXHRpZiAoZW50aXR5U2V0Py5lbnRpdHlUeXBlTmFtZSA9PT0gZW50aXR5VHlwZT8uZnVsbHlRdWFsaWZpZWROYW1lICYmIGJDb25kaXRpb25TYXZlKSB7XG5cdFx0Zm9vdGVyQWN0aW9ucy5wdXNoKHsgdHlwZTogQWN0aW9uVHlwZS5QcmltYXJ5LCBrZXk6IFwiU2F2ZUFjdGlvblwiIH0pO1xuXHR9XG5cblx0Ly8gVGhlbiB0aGUgYXBwbHkgYWN0aW9uIGlmIGl0IGV4aXN0c1xuXHRpZiAoYkNvbmRpdGlvbkFwcGx5KSB7XG5cdFx0Zm9vdGVyQWN0aW9ucy5wdXNoKHsgdHlwZTogQWN0aW9uVHlwZS5EZWZhdWx0QXBwbHksIGtleTogXCJBcHBseUFjdGlvblwiIH0pO1xuXHR9XG5cblx0Ly8gVGhlbiB0aGUgbm9uIGNyaXRpY2FsIERhdGFGaWVsZEZvckFjdGlvbnNcblx0Zm9vdGVyRGF0YUZpZWxkRm9yQWN0aW9uc1xuXHRcdC5maWx0ZXIoZGF0YUZpZWxkID0+IHtcblx0XHRcdHJldHVybiBJTVBPUlRBTlRfQ1JJVElDQUxJVElFUy5pbmRleE9mKGRhdGFGaWVsZD8uQ3JpdGljYWxpdHkgYXMgc3RyaW5nKSA9PT0gLTE7XG5cdFx0fSlcblx0XHQubWFwKGRhdGFGaWVsZCA9PiB7XG5cdFx0XHRmb290ZXJBY3Rpb25zLnB1c2goe1xuXHRcdFx0XHR0eXBlOiBBY3Rpb25UeXBlLkRhdGFGaWVsZEZvckFjdGlvbixcblx0XHRcdFx0YW5ub3RhdGlvblBhdGg6IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChkYXRhRmllbGQuZnVsbHlRdWFsaWZpZWROYW1lKSxcblx0XHRcdFx0a2V5OiBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGRhdGFGaWVsZCksXG5cdFx0XHRcdHZpc2libGU6IGNvbXBpbGVCaW5kaW5nKG5vdChlcXVhbChhbm5vdGF0aW9uRXhwcmVzc2lvbihkYXRhRmllbGQuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4pLCB0cnVlKSkpLFxuXHRcdFx0XHRlbmFibGVkOiBnZXRFbmFibGVkRm9yQW5ub3RhdGlvbkFjdGlvbihjb252ZXJ0ZXJDb250ZXh0LCBkYXRhRmllbGQuQWN0aW9uVGFyZ2V0KSxcblx0XHRcdFx0aXNOYXZpZ2FibGU6IHRydWVcblx0XHRcdH0gYXMgQW5ub3RhdGlvbkFjdGlvbik7XG5cdFx0fSk7XG5cblx0Ly8gVGhlbiB0aGUgY2FuY2VsIGFjdGlvbiBpZiBpdCBleGlzdHNcblx0aWYgKGJDb25kaXRpb25DYW5jZWwpIHtcblx0XHRmb290ZXJBY3Rpb25zLnB1c2goe1xuXHRcdFx0dHlwZTogQWN0aW9uVHlwZS5TZWNvbmRhcnksXG5cdFx0XHRrZXk6IFwiQ2FuY2VsQWN0aW9uXCIsXG5cdFx0XHRwb3NpdGlvbjogeyBwbGFjZW1lbnQ6IFBsYWNlbWVudC5FbmQgfVxuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBmb290ZXJBY3Rpb25zO1xufVxuIl19