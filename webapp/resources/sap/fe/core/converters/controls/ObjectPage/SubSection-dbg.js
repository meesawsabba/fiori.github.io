/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["../../ManifestSettings", "../../helpers/ID", "../Common/Form", "../Common/DataVisualization", "../../helpers/ConfigurableObject", "sap/fe/core/converters/controls/Common/Action", "sap/fe/core/converters/helpers/Key", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/converters/helpers/IssueManager", "sap/fe/core/converters/controls/ObjectPage/HeaderFacet", "../../objectPage/FormMenuActions"], function (ManifestSettings, ID, Form, DataVisualization, ConfigurableObject, Action, Key, BindingExpression, IssueManager, HeaderFacet, FormMenuActions) {
  "use strict";

  var _exports = {};
  var getFormActions = FormMenuActions.getFormActions;
  var getFormHiddenActions = FormMenuActions.getFormHiddenActions;
  var getVisibilityEnablementFormMenuActions = FormMenuActions.getVisibilityEnablementFormMenuActions;
  var getHeaderFacetsFromManifest = HeaderFacet.getHeaderFacetsFromManifest;
  var getStashedSettingsForHeaderFacet = HeaderFacet.getStashedSettingsForHeaderFacet;
  var getDesignTimeMetadataSettingsForHeaderFacet = HeaderFacet.getDesignTimeMetadataSettingsForHeaderFacet;
  var IssueCategory = IssueManager.IssueCategory;
  var IssueSeverity = IssueManager.IssueSeverity;
  var IssueType = IssueManager.IssueType;
  var ref = BindingExpression.ref;
  var not = BindingExpression.not;
  var fn = BindingExpression.fn;
  var equal = BindingExpression.equal;
  var compileBinding = BindingExpression.compileBinding;
  var bindingExpression = BindingExpression.bindingExpression;
  var annotationExpression = BindingExpression.annotationExpression;
  var KeyHelper = Key.KeyHelper;
  var getEnabledForAnnotationAction = Action.getEnabledForAnnotationAction;
  var removeDuplicateActions = Action.removeDuplicateActions;
  var getSemanticObjectMapping = Action.getSemanticObjectMapping;
  var ButtonType = Action.ButtonType;
  var isActionNavigable = Action.isActionNavigable;
  var getActionsFromManifest = Action.getActionsFromManifest;
  var Placement = ConfigurableObject.Placement;
  var insertCustomElements = ConfigurableObject.insertCustomElements;
  var getDataVisualizationConfiguration = DataVisualization.getDataVisualizationConfiguration;
  var isReferenceFacet = Form.isReferenceFacet;
  var createFormDefinition = Form.createFormDefinition;
  var SideContentID = ID.SideContentID;
  var SubSectionID = ID.SubSectionID;
  var FormID = ID.FormID;
  var CustomSubSectionID = ID.CustomSubSectionID;
  var ActionType = ManifestSettings.ActionType;

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var SubSectionType;

  (function (SubSectionType) {
    SubSectionType["Unknown"] = "Unknown";
    SubSectionType["Form"] = "Form";
    SubSectionType["DataVisualization"] = "DataVisualization";
    SubSectionType["XMLFragment"] = "XMLFragment";
    SubSectionType["Placeholder"] = "Placeholder";
    SubSectionType["Mixed"] = "Mixed";
  })(SubSectionType || (SubSectionType = {}));

  _exports.SubSectionType = SubSectionType;
  var targetTerms = ["com.sap.vocabularies.UI.v1.LineItem", "com.sap.vocabularies.UI.v1.PresentationVariant", "com.sap.vocabularies.UI.v1.SelectionPresentationVariant"]; // TODO: Need to handle Table case inside createSubSection function if CollectionFacet has Table ReferenceFacet

  var hasTable = function () {
    var facets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return facets.some(function (facetType) {
      var _facetType$Target, _facetType$Target$$ta;

      return targetTerms.indexOf(facetType === null || facetType === void 0 ? void 0 : (_facetType$Target = facetType.Target) === null || _facetType$Target === void 0 ? void 0 : (_facetType$Target$$ta = _facetType$Target.$target) === null || _facetType$Target$$ta === void 0 ? void 0 : _facetType$Target$$ta.term) > -1;
    });
  };
  /**
   * Create subsections based on facet definition.
   *
   * @param {FacetTypes[]} facetCollection Collection of facets
   * @param {ConverterContext} converterContext The converter context
   * @param {boolean} isHeaderSection True if header section is generated in this iteration
   * @returns {ObjectPageSubSection[]} The current subsections
   */


  function createSubSections(facetCollection, converterContext, isHeaderSection) {
    // First we determine which sub section we need to create
    var facetsToCreate = facetCollection.reduce(function (facetsToCreate, facetDefinition) {
      switch (facetDefinition.$Type) {
        case "com.sap.vocabularies.UI.v1.ReferenceFacet":
          facetsToCreate.push(facetDefinition);
          break;

        case "com.sap.vocabularies.UI.v1.CollectionFacet":
          // TODO If the Collection Facet has a child of type Collection Facet we bring them up one level (Form + Table use case) ?
          // first case facet Collection is combination of collection and reference facet or not all facets are reference facets.
          if (facetDefinition.Facets.find(function (facetType) {
            return facetType.$Type === "com.sap.vocabularies.UI.v1.CollectionFacet";
          })) {
            facetsToCreate.splice.apply(facetsToCreate, [facetsToCreate.length, 0].concat(_toConsumableArray(facetDefinition.Facets)));
          } else {
            facetsToCreate.push(facetDefinition);
          }

          break;

        case "com.sap.vocabularies.UI.v1.ReferenceURLFacet":
          // Not supported
          break;
      }

      return facetsToCreate;
    }, []); // Then we create the actual subsections

    return facetsToCreate.map(function (facet) {
      var _Facets;

      return createSubSection(facet, facetsToCreate, converterContext, 0, !(facet !== null && facet !== void 0 && (_Facets = facet.Facets) !== null && _Facets !== void 0 && _Facets.length), isHeaderSection);
    });
  }
  /**
   * Creates subsections based on the definition of the custom header facet.
   *
   * @param {ConverterContext} converterContext The converter context
   * @returns {ObjectPageSubSection[]} The current subsections
   */


  _exports.createSubSections = createSubSections;

  function createCustomHeaderFacetSubSections(converterContext) {
    var customHeaderFacets = getHeaderFacetsFromManifest(converterContext.getManifestWrapper().getHeaderFacets());
    var aCustomHeaderFacets = [];
    Object.keys(customHeaderFacets).map(function (key) {
      aCustomHeaderFacets.push(customHeaderFacets[key]);
      return aCustomHeaderFacets;
    });
    var facetsToCreate = aCustomHeaderFacets.reduce(function (facetsToCreate, customHeaderFacet) {
      if (customHeaderFacet.templateEdit) {
        facetsToCreate.push(customHeaderFacet);
      }

      return facetsToCreate;
    }, []);
    return facetsToCreate.map(function (customHeaderFacet) {
      return createCustomHeaderFacetSubSection(customHeaderFacet);
    });
  }
  /**
   * Creates a subsection based on a custom header facet.
   *
   * @param customHeaderFacet A custom header facet
   *
   * @returns {ObjectPageSubSection} A definition for a subsection
   */


  _exports.createCustomHeaderFacetSubSections = createCustomHeaderFacetSubSections;

  function createCustomHeaderFacetSubSection(customHeaderFacet) {
    var subSectionID = CustomSubSectionID(customHeaderFacet.key);
    var subSection = {
      id: subSectionID,
      key: customHeaderFacet.key,
      title: customHeaderFacet.title,
      type: SubSectionType.XMLFragment,
      template: customHeaderFacet.templateEdit || "",
      visible: customHeaderFacet.visible,
      level: 1,
      sideContent: undefined,
      stashed: customHeaderFacet.stashed,
      flexSettings: customHeaderFacet.flexSettings,
      actions: {}
    };
    return subSection;
  } // function isTargetForCompliant(annotationPath: AnnotationPath) {
  // 	return /.*com\.sap\.vocabularies\.UI\.v1\.(FieldGroup|Identification|DataPoint|StatusInfo).*/.test(annotationPath.value);
  // }


  var getSubSectionKey = function (facetDefinition, fallback) {
    var _facetDefinition$ID, _facetDefinition$Labe;

    return ((_facetDefinition$ID = facetDefinition.ID) === null || _facetDefinition$ID === void 0 ? void 0 : _facetDefinition$ID.toString()) || ((_facetDefinition$Labe = facetDefinition.Label) === null || _facetDefinition$Labe === void 0 ? void 0 : _facetDefinition$Labe.toString()) || fallback;
  };
  /**
   * Adds Form menu action to all form actions, removes duplicate actions and hidden actions.
   * @param actions The actions involved
   * @param facetDefinition The definition for the facet
   * @param converterContext The converter context
   * @returns {BaseAction[] | ConverterAction[]}
   */


  function addFormMenuActions(actions, facetDefinition, converterContext) {
    var hiddenActions = getFormHiddenActions(facetDefinition, converterContext) || [],
        formActions = getFormActions(facetDefinition, converterContext),
        formAllActions = insertCustomElements(actions, getActionsFromManifest(formActions, converterContext, actions, undefined, undefined, hiddenActions));
    return formAllActions ? getVisibilityEnablementFormMenuActions(removeDuplicateActions(formAllActions)) : actions;
  }
  /**
   * Retrieves the action form a facet.
   * @param facetDefinition
   * @param converterContext
   * @returns {ConverterAction[] | BaseAction[]} The current facet actions
   */


  function getFacetActions(facetDefinition, converterContext) {
    var actions = new Array();

    switch (facetDefinition.$Type) {
      case "com.sap.vocabularies.UI.v1.CollectionFacet":
        actions = facetDefinition.Facets.filter(function (facetDefinition) {
          return isReferenceFacet(facetDefinition);
        }).reduce(function (actions, facetDefinition) {
          return createFormActionReducer(actions, facetDefinition, converterContext);
        }, []);
        break;

      case "com.sap.vocabularies.UI.v1.ReferenceFacet":
        actions = createFormActionReducer([], facetDefinition, converterContext);
        break;
    }

    return addFormMenuActions(actions, facetDefinition, converterContext);
  }
  /**
   * Retruns the button type based on @UI.Emphasized annotation.
   * @param Emphasized Emphasized annotation value.
   * @returns {ButtonType | string} The button type or path based expression.
   */


  function getButtonType(Emphasized) {
    var PathForButtonType = Emphasized === null || Emphasized === void 0 ? void 0 : Emphasized.path;

    if (PathForButtonType) {
      return "{= " + "!${" + PathForButtonType + "} ? '" + ButtonType.Transparent + "' : ${" + PathForButtonType + "}" + "}";
    } else if (Emphasized) {
      return ButtonType.Ghost;
    }

    return ButtonType.Transparent;
  }
  /**
   * Create a subsection based on FacetTypes.
   * @param facetDefinition
   * @param facetsToCreate
   * @param converterContext
   * @param level
   * @param hasSingleContent
   * @param isHeaderSection
   * @returns {ObjectPageSubSection} A subsection definition
   */


  function createSubSection(facetDefinition, facetsToCreate, converterContext, level, hasSingleContent, isHeaderSection) {
    var _facetDefinition$anno, _facetDefinition$anno2, _presentation$visuali, _presentation$visuali2, _presentation$visuali3;

    var subSectionID = SubSectionID({
      Facet: facetDefinition
    });
    var subSection = {
      id: subSectionID,
      key: getSubSectionKey(facetDefinition, subSectionID),
      title: compileBinding(annotationExpression(facetDefinition.Label)),
      type: SubSectionType.Unknown,
      annotationPath: converterContext.getEntitySetBasedAnnotationPath(facetDefinition.fullyQualifiedName),
      visible: compileBinding(not(equal(annotationExpression((_facetDefinition$anno = facetDefinition.annotations) === null || _facetDefinition$anno === void 0 ? void 0 : (_facetDefinition$anno2 = _facetDefinition$anno.UI) === null || _facetDefinition$anno2 === void 0 ? void 0 : _facetDefinition$anno2.Hidden), true))),
      level: level,
      sideContent: undefined
    };

    if (isHeaderSection) {
      subSection.stashed = getStashedSettingsForHeaderFacet(facetDefinition, facetDefinition, converterContext);
      subSection.flexSettings = {
        designtime: getDesignTimeMetadataSettingsForHeaderFacet(facetDefinition, facetDefinition, converterContext)
      };
    }

    var content = [];
    var tableContent = [];
    var index = [];
    var unsupportedText = "";
    level++;

    switch (facetDefinition.$Type) {
      case "com.sap.vocabularies.UI.v1.CollectionFacet":
        var facets = facetDefinition.Facets;

        if (hasTable(facets)) {
          // if we have tables in a collection facet then we create separate subsection for them
          for (var i = 0; i < facets.length; i++) {
            var _Target, _Target$$target;

            if (targetTerms.indexOf((_Target = facets[i].Target) === null || _Target === void 0 ? void 0 : (_Target$$target = _Target.$target) === null || _Target$$target === void 0 ? void 0 : _Target$$target.term) > -1) {
              //creating separate array for tables
              tableContent.push(createSubSection(facets[i], [], converterContext, level, facets.length === 1, isHeaderSection));
              index.push(i);
            }
          }

          for (var _i = index.length - 1; _i >= 0; _i--) {
            //remove table facets from facet definition
            facets.splice(index[_i], 1);
          }

          if (facets.length) {
            facetDefinition.Facets = facets; //create a form subsection from the remaining facets

            content.push(createSubSection(facetDefinition, [], converterContext, level, hasSingleContent, isHeaderSection));
          }

          content = content.concat(tableContent);

          var mixedSubSection = _objectSpread(_objectSpread({}, subSection), {}, {
            type: SubSectionType.Mixed,
            level: level,
            content: content
          });

          return mixedSubSection;
        } else {
          var actions = getFacetActions(facetDefinition, converterContext),
              formCollectionSubSection = _objectSpread(_objectSpread({}, subSection), {}, {
            type: SubSectionType.Form,
            formDefinition: createFormDefinition(facetDefinition, converterContext, actions),
            level: level,
            actions: actions.filter(function (action) {
              return action.facetName === undefined;
            })
          });

          return formCollectionSubSection;
        }

      case "com.sap.vocabularies.UI.v1.ReferenceFacet":
        if (!facetDefinition.Target.$target) {
          unsupportedText = "Unable to find annotationPath ".concat(facetDefinition.Target.value);
        } else {
          switch (facetDefinition.Target.$target.term) {
            case "com.sap.vocabularies.UI.v1.LineItem":
            case "com.sap.vocabularies.UI.v1.Chart":
            case "com.sap.vocabularies.UI.v1.PresentationVariant":
            case "com.sap.vocabularies.UI.v1.SelectionPresentationVariant":
              var presentation = getDataVisualizationConfiguration(facetDefinition.Target.value, getCondensedTableLayoutCompliance(facetDefinition, facetsToCreate, converterContext), converterContext, undefined, isHeaderSection);
              var controlTitle = (_presentation$visuali = presentation.visualizations[0]) === null || _presentation$visuali === void 0 ? void 0 : (_presentation$visuali2 = _presentation$visuali.annotation) === null || _presentation$visuali2 === void 0 ? void 0 : _presentation$visuali2.title;
              controlTitle ? controlTitle : controlTitle = (_presentation$visuali3 = presentation.visualizations[0]) === null || _presentation$visuali3 === void 0 ? void 0 : _presentation$visuali3.title;

              var dataVisualizationSubSection = _objectSpread(_objectSpread({}, subSection), {}, {
                type: SubSectionType.DataVisualization,
                level: level,
                presentation: presentation,
                showTitle: isSubsectionTitleShown(hasSingleContent, subSection.title, controlTitle)
              });

              return dataVisualizationSubSection;

            case "com.sap.vocabularies.UI.v1.FieldGroup":
            case "com.sap.vocabularies.UI.v1.Identification":
            case "com.sap.vocabularies.UI.v1.DataPoint":
            case "com.sap.vocabularies.UI.v1.StatusInfo":
            case "com.sap.vocabularies.Communication.v1.Contact":
              // All those element belong to a form facet
              var _actions = getFacetActions(facetDefinition, converterContext),
                  formElementSubSection = _objectSpread(_objectSpread({}, subSection), {}, {
                type: SubSectionType.Form,
                level: level,
                formDefinition: createFormDefinition(facetDefinition, converterContext, _actions),
                actions: _actions.filter(function (action) {
                  return action.facetName === undefined;
                })
              });

              return formElementSubSection;

            default:
              unsupportedText = "For ".concat(facetDefinition.Target.$target.term, " Fragment");
              break;
          }
        }

        break;

      case "com.sap.vocabularies.UI.v1.ReferenceURLFacet":
        unsupportedText = "For Reference URL Facet";
        break;

      default:
        break;
    } // If we reach here we ended up with an unsupported SubSection type


    var unsupportedSubSection = _objectSpread(_objectSpread({}, subSection), {}, {
      text: unsupportedText
    });

    return unsupportedSubSection;
  }

  _exports.createSubSection = createSubSection;

  function isSubsectionTitleShown(hasSingleContent, subSectionTitle, controlTitle) {
    if (hasSingleContent && controlTitle === subSectionTitle) {
      return false;
    }

    return true;
  }

  function createFormActionReducer(actions, facetDefinition, converterContext) {
    var referenceTarget = facetDefinition.Target.$target;
    var targetValue = facetDefinition.Target.value;
    var manifestActions = {};
    var dataFieldCollection = [];

    var _targetValue$split = targetValue.split("@"),
        _targetValue$split2 = _slicedToArray(_targetValue$split, 1),
        navigationPropertyPath = _targetValue$split2[0];

    if (navigationPropertyPath.length > 0) {
      if (navigationPropertyPath.lastIndexOf("/") === navigationPropertyPath.length - 1) {
        navigationPropertyPath = navigationPropertyPath.substr(0, navigationPropertyPath.length - 1);
      }
    } else {
      navigationPropertyPath = undefined;
    }

    if (referenceTarget) {
      switch (referenceTarget.term) {
        case "com.sap.vocabularies.UI.v1.FieldGroup":
          dataFieldCollection = referenceTarget.Data;
          manifestActions = getActionsFromManifest(converterContext.getManifestControlConfiguration(referenceTarget).actions, converterContext, undefined, undefined, undefined, undefined, facetDefinition.fullyQualifiedName);
          break;

        case "com.sap.vocabularies.UI.v1.Identification":
        case "com.sap.vocabularies.UI.v1.StatusInfo":
          if (referenceTarget.qualifier) {
            dataFieldCollection = referenceTarget;
          }

          break;
      }
    }

    actions = dataFieldCollection.reduce(function (actions, dataField) {
      var _dataField$annotation, _dataField$RequiresCo, _dataField$Inline, _dataField$Determinin, _dataField$Label, _dataField$Navigation, _dataField$annotation2, _dataField$annotation3, _dataField$annotation4, _dataField$Label2, _dataField$annotation5, _dataField$annotation6, _dataField$annotation7;

      var UIAnnotation = dataField === null || dataField === void 0 ? void 0 : (_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : _dataField$annotation.UI;

      switch (dataField.$Type) {
        case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
          if (((_dataField$RequiresCo = dataField.RequiresContext) === null || _dataField$RequiresCo === void 0 ? void 0 : _dataField$RequiresCo.valueOf()) === true) {
            converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.Low, IssueType.MALFORMED_DATAFIELD_FOR_IBN.REQUIRESCONTEXT);
          }

          if (((_dataField$Inline = dataField.Inline) === null || _dataField$Inline === void 0 ? void 0 : _dataField$Inline.valueOf()) === true) {
            converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.Low, IssueType.MALFORMED_DATAFIELD_FOR_IBN.INLINE);
          }

          if (((_dataField$Determinin = dataField.Determining) === null || _dataField$Determinin === void 0 ? void 0 : _dataField$Determinin.valueOf()) === true) {
            converterContext.getDiagnostics().addIssue(IssueCategory.Annotation, IssueSeverity.Low, IssueType.MALFORMED_DATAFIELD_FOR_IBN.DETERMINING);
          }

          var mNavigationParameters = {};

          if (dataField.Mapping) {
            mNavigationParameters.semanticObjectMapping = getSemanticObjectMapping(dataField.Mapping);
          }

          actions.push({
            type: ActionType.DataFieldForIntentBasedNavigation,
            id: FormID({
              Facet: facetDefinition
            }, dataField),
            key: KeyHelper.generateKeyFromDataField(dataField),
            text: (_dataField$Label = dataField.Label) === null || _dataField$Label === void 0 ? void 0 : _dataField$Label.toString(),
            annotationPath: "",
            enabled: dataField.NavigationAvailable !== undefined ? compileBinding(equal(annotationExpression((_dataField$Navigation = dataField.NavigationAvailable) === null || _dataField$Navigation === void 0 ? void 0 : _dataField$Navigation.valueOf()), true)) : true,
            visible: compileBinding(not(equal(annotationExpression((_dataField$annotation2 = dataField.annotations) === null || _dataField$annotation2 === void 0 ? void 0 : (_dataField$annotation3 = _dataField$annotation2.UI) === null || _dataField$annotation3 === void 0 ? void 0 : (_dataField$annotation4 = _dataField$annotation3.Hidden) === null || _dataField$annotation4 === void 0 ? void 0 : _dataField$annotation4.valueOf()), true))),
            buttonType: getButtonType(UIAnnotation === null || UIAnnotation === void 0 ? void 0 : UIAnnotation.Emphasized),
            press: compileBinding(fn("._intentBasedNavigation.navigate", [annotationExpression(dataField.SemanticObject), annotationExpression(dataField.Action), mNavigationParameters])),
            customData: compileBinding({
              semanticObject: annotationExpression(dataField.SemanticObject),
              action: annotationExpression(dataField.Action)
            })
          });
          break;

        case "com.sap.vocabularies.UI.v1.DataFieldForAction":
          var formManifestActionsConfiguration = converterContext.getManifestControlConfiguration(referenceTarget).actions;
          var key = KeyHelper.generateKeyFromDataField(dataField);
          actions.push({
            type: ActionType.DataFieldForAction,
            id: FormID({
              Facet: facetDefinition
            }, dataField),
            key: key,
            text: (_dataField$Label2 = dataField.Label) === null || _dataField$Label2 === void 0 ? void 0 : _dataField$Label2.toString(),
            annotationPath: "",
            enabled: getEnabledForAnnotationAction(converterContext, dataField.ActionTarget),
            binding: navigationPropertyPath ? "{ 'path' : '" + navigationPropertyPath + "'}" : undefined,
            visible: compileBinding(not(equal(annotationExpression((_dataField$annotation5 = dataField.annotations) === null || _dataField$annotation5 === void 0 ? void 0 : (_dataField$annotation6 = _dataField$annotation5.UI) === null || _dataField$annotation6 === void 0 ? void 0 : (_dataField$annotation7 = _dataField$annotation6.Hidden) === null || _dataField$annotation7 === void 0 ? void 0 : _dataField$annotation7.valueOf()), true))),
            requiresDialog: isDialog(dataField.ActionTarget),
            buttonType: getButtonType(UIAnnotation === null || UIAnnotation === void 0 ? void 0 : UIAnnotation.Emphasized),
            press: compileBinding(fn("invokeAction", [dataField.Action, {
              contexts: fn("getBindingContext", [], bindingExpression("", "$source")),
              invocationGrouping: dataField.InvocationGrouping === "UI.OperationGroupingType/ChangeSet" ? "ChangeSet" : "Isolated",
              label: annotationExpression(dataField.Label),
              model: fn("getModel", [], bindingExpression("/", "$source")),
              isNavigable: isActionNavigable(formManifestActionsConfiguration && formManifestActionsConfiguration[key])
            }], ref(".editFlow"))),
            facetName: dataField.Inline ? facetDefinition.fullyQualifiedName : undefined
          });
          break;
      }

      return actions;
    }, actions);
    return insertCustomElements(actions, manifestActions);
  }

  function isDialog(actionDefinition) {
    if (actionDefinition) {
      var _actionDefinition$ann, _actionDefinition$ann2;

      var bCritical = (_actionDefinition$ann = actionDefinition.annotations) === null || _actionDefinition$ann === void 0 ? void 0 : (_actionDefinition$ann2 = _actionDefinition$ann.Common) === null || _actionDefinition$ann2 === void 0 ? void 0 : _actionDefinition$ann2.IsActionCritical;

      if (actionDefinition.parameters.length > 1 || bCritical) {
        return "Dialog";
      } else {
        return "None";
      }
    } else {
      return "None";
    }
  }

  _exports.isDialog = isDialog;

  function createCustomSubSections(manifestSubSections, converterContext) {
    var subSections = {};
    Object.keys(manifestSubSections).forEach(function (subSectionKey) {
      return subSections[subSectionKey] = createCustomSubSection(manifestSubSections[subSectionKey], subSectionKey, converterContext);
    });
    return subSections;
  }

  _exports.createCustomSubSections = createCustomSubSections;

  function createCustomSubSection(manifestSubSection, subSectionKey, converterContext) {
    var sideContent = manifestSubSection.sideContent ? {
      template: manifestSubSection.sideContent.template,
      id: SideContentID(subSectionKey),
      visible: false,
      equalSplit: manifestSubSection.sideContent.equalSplit
    } : undefined;
    var position = manifestSubSection.position;

    if (!position) {
      position = {
        placement: Placement.After
      };
    }

    var subSectionDefinition = {
      type: SubSectionType.Unknown,
      id: manifestSubSection.id || CustomSubSectionID(subSectionKey),
      actions: getActionsFromManifest(manifestSubSection.actions, converterContext),
      key: subSectionKey,
      title: manifestSubSection.title,
      level: 1,
      position: position,
      visible: manifestSubSection.visible !== undefined ? manifestSubSection.visible : true,
      sideContent: sideContent
    };

    if (manifestSubSection.template || manifestSubSection.name) {
      subSectionDefinition.type = SubSectionType.XMLFragment;
      subSectionDefinition.template = manifestSubSection.template || manifestSubSection.name || "";
    } else {
      subSectionDefinition.type = SubSectionType.Placeholder;
    }

    return subSectionDefinition;
  }
  /**
   * Evaluate if the condensed mode can be appli3ed on the table.
   *
   * @param currentFacet
   * @param facetsToCreateInSection
   * @param converterContext
   *
   * @returns {boolean} `true` for compliant, false otherwise
   */


  _exports.createCustomSubSection = createCustomSubSection;

  function getCondensedTableLayoutCompliance(currentFacet, facetsToCreateInSection, converterContext) {
    var manifestWrapper = converterContext.getManifestWrapper();

    if (manifestWrapper.useIconTabBar()) {
      // If the OP use the tab based we check if the facets that will be created for this section are all non visible
      return hasNoOtherVisibleTableInTargets(currentFacet, facetsToCreateInSection);
    } else {
      var _entityType$annotatio, _entityType$annotatio2, _entityType$annotatio3, _entityType$annotatio4, _entityType$annotatio5, _entityType$annotatio6;

      var entityType = converterContext.getEntityType();

      if ((_entityType$annotatio = entityType.annotations) !== null && _entityType$annotatio !== void 0 && (_entityType$annotatio2 = _entityType$annotatio.UI) !== null && _entityType$annotatio2 !== void 0 && (_entityType$annotatio3 = _entityType$annotatio2.Facets) !== null && _entityType$annotatio3 !== void 0 && _entityType$annotatio3.length && ((_entityType$annotatio4 = entityType.annotations) === null || _entityType$annotatio4 === void 0 ? void 0 : (_entityType$annotatio5 = _entityType$annotatio4.UI) === null || _entityType$annotatio5 === void 0 ? void 0 : (_entityType$annotatio6 = _entityType$annotatio5.Facets) === null || _entityType$annotatio6 === void 0 ? void 0 : _entityType$annotatio6.length) > 1) {
        return hasNoOtherVisibleTableInTargets(currentFacet, facetsToCreateInSection);
      } else {
        return true;
      }
    }
  }

  function hasNoOtherVisibleTableInTargets(currentFacet, facetsToCreateInSection) {
    return facetsToCreateInSection.every(function (subFacet) {
      if (subFacet !== currentFacet) {
        if (subFacet.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet") {
          var _refFacet$Target, _refFacet$Target$$tar, _refFacet$Target2, _refFacet$Target2$$ta, _refFacet$Target$$tar2;

          var refFacet = subFacet;

          if (((_refFacet$Target = refFacet.Target) === null || _refFacet$Target === void 0 ? void 0 : (_refFacet$Target$$tar = _refFacet$Target.$target) === null || _refFacet$Target$$tar === void 0 ? void 0 : _refFacet$Target$$tar.term) === "com.sap.vocabularies.UI.v1.LineItem" || ((_refFacet$Target2 = refFacet.Target) === null || _refFacet$Target2 === void 0 ? void 0 : (_refFacet$Target2$$ta = _refFacet$Target2.$target) === null || _refFacet$Target2$$ta === void 0 ? void 0 : _refFacet$Target2$$ta.term) === "com.sap.vocabularies.UI.v1.PresentationVariant" || ((_refFacet$Target$$tar2 = refFacet.Target.$target) === null || _refFacet$Target$$tar2 === void 0 ? void 0 : _refFacet$Target$$tar2.term) === "com.sap.vocabularies.UI.v1.SelectionPresentationVariant") {
            var _refFacet$annotations, _refFacet$annotations2, _refFacet$annotations3, _refFacet$annotations4;

            return ((_refFacet$annotations = refFacet.annotations) === null || _refFacet$annotations === void 0 ? void 0 : (_refFacet$annotations2 = _refFacet$annotations.UI) === null || _refFacet$annotations2 === void 0 ? void 0 : _refFacet$annotations2.Hidden) !== undefined ? (_refFacet$annotations3 = refFacet.annotations) === null || _refFacet$annotations3 === void 0 ? void 0 : (_refFacet$annotations4 = _refFacet$annotations3.UI) === null || _refFacet$annotations4 === void 0 ? void 0 : _refFacet$annotations4.Hidden : false;
          }

          return true;
        } else {
          var subCollectionFacet = subFacet;
          return subCollectionFacet.Facets.every(function (facet) {
            var _subRefFacet$Target, _subRefFacet$Target$$, _subRefFacet$Target2, _subRefFacet$Target2$, _subRefFacet$Target3, _subRefFacet$Target3$;

            var subRefFacet = facet;

            if (((_subRefFacet$Target = subRefFacet.Target) === null || _subRefFacet$Target === void 0 ? void 0 : (_subRefFacet$Target$$ = _subRefFacet$Target.$target) === null || _subRefFacet$Target$$ === void 0 ? void 0 : _subRefFacet$Target$$.term) === "com.sap.vocabularies.UI.v1.LineItem" || ((_subRefFacet$Target2 = subRefFacet.Target) === null || _subRefFacet$Target2 === void 0 ? void 0 : (_subRefFacet$Target2$ = _subRefFacet$Target2.$target) === null || _subRefFacet$Target2$ === void 0 ? void 0 : _subRefFacet$Target2$.term) === "com.sap.vocabularies.UI.v1.PresentationVariant" || ((_subRefFacet$Target3 = subRefFacet.Target) === null || _subRefFacet$Target3 === void 0 ? void 0 : (_subRefFacet$Target3$ = _subRefFacet$Target3.$target) === null || _subRefFacet$Target3$ === void 0 ? void 0 : _subRefFacet$Target3$.term) === "com.sap.vocabularies.UI.v1.SelectionPresentationVariant") {
              var _subRefFacet$annotati, _subRefFacet$annotati2, _subRefFacet$annotati3, _subRefFacet$annotati4;

              return ((_subRefFacet$annotati = subRefFacet.annotations) === null || _subRefFacet$annotati === void 0 ? void 0 : (_subRefFacet$annotati2 = _subRefFacet$annotati.UI) === null || _subRefFacet$annotati2 === void 0 ? void 0 : _subRefFacet$annotati2.Hidden) !== undefined ? (_subRefFacet$annotati3 = subRefFacet.annotations) === null || _subRefFacet$annotati3 === void 0 ? void 0 : (_subRefFacet$annotati4 = _subRefFacet$annotati3.UI) === null || _subRefFacet$annotati4 === void 0 ? void 0 : _subRefFacet$annotati4.Hidden : false;
            }

            return true;
          });
        }
      }

      return true;
    });
  }

  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN1YlNlY3Rpb24udHMiXSwibmFtZXMiOlsiU3ViU2VjdGlvblR5cGUiLCJ0YXJnZXRUZXJtcyIsImhhc1RhYmxlIiwiZmFjZXRzIiwic29tZSIsImZhY2V0VHlwZSIsImluZGV4T2YiLCJUYXJnZXQiLCIkdGFyZ2V0IiwidGVybSIsImNyZWF0ZVN1YlNlY3Rpb25zIiwiZmFjZXRDb2xsZWN0aW9uIiwiY29udmVydGVyQ29udGV4dCIsImlzSGVhZGVyU2VjdGlvbiIsImZhY2V0c1RvQ3JlYXRlIiwicmVkdWNlIiwiZmFjZXREZWZpbml0aW9uIiwiJFR5cGUiLCJwdXNoIiwiRmFjZXRzIiwiZmluZCIsInNwbGljZSIsImxlbmd0aCIsIm1hcCIsImZhY2V0IiwiY3JlYXRlU3ViU2VjdGlvbiIsImNyZWF0ZUN1c3RvbUhlYWRlckZhY2V0U3ViU2VjdGlvbnMiLCJjdXN0b21IZWFkZXJGYWNldHMiLCJnZXRIZWFkZXJGYWNldHNGcm9tTWFuaWZlc3QiLCJnZXRNYW5pZmVzdFdyYXBwZXIiLCJnZXRIZWFkZXJGYWNldHMiLCJhQ3VzdG9tSGVhZGVyRmFjZXRzIiwiT2JqZWN0Iiwia2V5cyIsImtleSIsImN1c3RvbUhlYWRlckZhY2V0IiwidGVtcGxhdGVFZGl0IiwiY3JlYXRlQ3VzdG9tSGVhZGVyRmFjZXRTdWJTZWN0aW9uIiwic3ViU2VjdGlvbklEIiwiQ3VzdG9tU3ViU2VjdGlvbklEIiwic3ViU2VjdGlvbiIsImlkIiwidGl0bGUiLCJ0eXBlIiwiWE1MRnJhZ21lbnQiLCJ0ZW1wbGF0ZSIsInZpc2libGUiLCJsZXZlbCIsInNpZGVDb250ZW50IiwidW5kZWZpbmVkIiwic3Rhc2hlZCIsImZsZXhTZXR0aW5ncyIsImFjdGlvbnMiLCJnZXRTdWJTZWN0aW9uS2V5IiwiZmFsbGJhY2siLCJJRCIsInRvU3RyaW5nIiwiTGFiZWwiLCJhZGRGb3JtTWVudUFjdGlvbnMiLCJoaWRkZW5BY3Rpb25zIiwiZ2V0Rm9ybUhpZGRlbkFjdGlvbnMiLCJmb3JtQWN0aW9ucyIsImdldEZvcm1BY3Rpb25zIiwiZm9ybUFsbEFjdGlvbnMiLCJpbnNlcnRDdXN0b21FbGVtZW50cyIsImdldEFjdGlvbnNGcm9tTWFuaWZlc3QiLCJnZXRWaXNpYmlsaXR5RW5hYmxlbWVudEZvcm1NZW51QWN0aW9ucyIsInJlbW92ZUR1cGxpY2F0ZUFjdGlvbnMiLCJnZXRGYWNldEFjdGlvbnMiLCJBcnJheSIsImZpbHRlciIsImlzUmVmZXJlbmNlRmFjZXQiLCJjcmVhdGVGb3JtQWN0aW9uUmVkdWNlciIsImdldEJ1dHRvblR5cGUiLCJFbXBoYXNpemVkIiwiUGF0aEZvckJ1dHRvblR5cGUiLCJwYXRoIiwiQnV0dG9uVHlwZSIsIlRyYW5zcGFyZW50IiwiR2hvc3QiLCJoYXNTaW5nbGVDb250ZW50IiwiU3ViU2VjdGlvbklEIiwiRmFjZXQiLCJjb21waWxlQmluZGluZyIsImFubm90YXRpb25FeHByZXNzaW9uIiwiVW5rbm93biIsImFubm90YXRpb25QYXRoIiwiZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aCIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsIm5vdCIsImVxdWFsIiwiYW5ub3RhdGlvbnMiLCJVSSIsIkhpZGRlbiIsImdldFN0YXNoZWRTZXR0aW5nc0ZvckhlYWRlckZhY2V0IiwiZGVzaWdudGltZSIsImdldERlc2lnblRpbWVNZXRhZGF0YVNldHRpbmdzRm9ySGVhZGVyRmFjZXQiLCJjb250ZW50IiwidGFibGVDb250ZW50IiwiaW5kZXgiLCJ1bnN1cHBvcnRlZFRleHQiLCJpIiwiY29uY2F0IiwibWl4ZWRTdWJTZWN0aW9uIiwiTWl4ZWQiLCJmb3JtQ29sbGVjdGlvblN1YlNlY3Rpb24iLCJGb3JtIiwiZm9ybURlZmluaXRpb24iLCJjcmVhdGVGb3JtRGVmaW5pdGlvbiIsImFjdGlvbiIsImZhY2V0TmFtZSIsInZhbHVlIiwicHJlc2VudGF0aW9uIiwiZ2V0RGF0YVZpc3VhbGl6YXRpb25Db25maWd1cmF0aW9uIiwiZ2V0Q29uZGVuc2VkVGFibGVMYXlvdXRDb21wbGlhbmNlIiwiY29udHJvbFRpdGxlIiwidmlzdWFsaXphdGlvbnMiLCJhbm5vdGF0aW9uIiwiZGF0YVZpc3VhbGl6YXRpb25TdWJTZWN0aW9uIiwiRGF0YVZpc3VhbGl6YXRpb24iLCJzaG93VGl0bGUiLCJpc1N1YnNlY3Rpb25UaXRsZVNob3duIiwiZm9ybUVsZW1lbnRTdWJTZWN0aW9uIiwidW5zdXBwb3J0ZWRTdWJTZWN0aW9uIiwidGV4dCIsInN1YlNlY3Rpb25UaXRsZSIsInJlZmVyZW5jZVRhcmdldCIsInRhcmdldFZhbHVlIiwibWFuaWZlc3RBY3Rpb25zIiwiZGF0YUZpZWxkQ29sbGVjdGlvbiIsInNwbGl0IiwibmF2aWdhdGlvblByb3BlcnR5UGF0aCIsImxhc3RJbmRleE9mIiwic3Vic3RyIiwiRGF0YSIsImdldE1hbmlmZXN0Q29udHJvbENvbmZpZ3VyYXRpb24iLCJxdWFsaWZpZXIiLCJkYXRhRmllbGQiLCJVSUFubm90YXRpb24iLCJSZXF1aXJlc0NvbnRleHQiLCJ2YWx1ZU9mIiwiZ2V0RGlhZ25vc3RpY3MiLCJhZGRJc3N1ZSIsIklzc3VlQ2F0ZWdvcnkiLCJBbm5vdGF0aW9uIiwiSXNzdWVTZXZlcml0eSIsIkxvdyIsIklzc3VlVHlwZSIsIk1BTEZPUk1FRF9EQVRBRklFTERfRk9SX0lCTiIsIlJFUVVJUkVTQ09OVEVYVCIsIklubGluZSIsIklOTElORSIsIkRldGVybWluaW5nIiwiREVURVJNSU5JTkciLCJtTmF2aWdhdGlvblBhcmFtZXRlcnMiLCJNYXBwaW5nIiwic2VtYW50aWNPYmplY3RNYXBwaW5nIiwiZ2V0U2VtYW50aWNPYmplY3RNYXBwaW5nIiwiQWN0aW9uVHlwZSIsIkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvbiIsIkZvcm1JRCIsIktleUhlbHBlciIsImdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZCIsImVuYWJsZWQiLCJOYXZpZ2F0aW9uQXZhaWxhYmxlIiwiYnV0dG9uVHlwZSIsInByZXNzIiwiZm4iLCJTZW1hbnRpY09iamVjdCIsIkFjdGlvbiIsImN1c3RvbURhdGEiLCJzZW1hbnRpY09iamVjdCIsImZvcm1NYW5pZmVzdEFjdGlvbnNDb25maWd1cmF0aW9uIiwiRGF0YUZpZWxkRm9yQWN0aW9uIiwiZ2V0RW5hYmxlZEZvckFubm90YXRpb25BY3Rpb24iLCJBY3Rpb25UYXJnZXQiLCJiaW5kaW5nIiwicmVxdWlyZXNEaWFsb2ciLCJpc0RpYWxvZyIsImNvbnRleHRzIiwiYmluZGluZ0V4cHJlc3Npb24iLCJpbnZvY2F0aW9uR3JvdXBpbmciLCJJbnZvY2F0aW9uR3JvdXBpbmciLCJsYWJlbCIsIm1vZGVsIiwiaXNOYXZpZ2FibGUiLCJpc0FjdGlvbk5hdmlnYWJsZSIsInJlZiIsImFjdGlvbkRlZmluaXRpb24iLCJiQ3JpdGljYWwiLCJDb21tb24iLCJJc0FjdGlvbkNyaXRpY2FsIiwicGFyYW1ldGVycyIsImNyZWF0ZUN1c3RvbVN1YlNlY3Rpb25zIiwibWFuaWZlc3RTdWJTZWN0aW9ucyIsInN1YlNlY3Rpb25zIiwiZm9yRWFjaCIsInN1YlNlY3Rpb25LZXkiLCJjcmVhdGVDdXN0b21TdWJTZWN0aW9uIiwibWFuaWZlc3RTdWJTZWN0aW9uIiwiU2lkZUNvbnRlbnRJRCIsImVxdWFsU3BsaXQiLCJwb3NpdGlvbiIsInBsYWNlbWVudCIsIlBsYWNlbWVudCIsIkFmdGVyIiwic3ViU2VjdGlvbkRlZmluaXRpb24iLCJuYW1lIiwiUGxhY2Vob2xkZXIiLCJjdXJyZW50RmFjZXQiLCJmYWNldHNUb0NyZWF0ZUluU2VjdGlvbiIsIm1hbmlmZXN0V3JhcHBlciIsInVzZUljb25UYWJCYXIiLCJoYXNOb090aGVyVmlzaWJsZVRhYmxlSW5UYXJnZXRzIiwiZW50aXR5VHlwZSIsImdldEVudGl0eVR5cGUiLCJldmVyeSIsInN1YkZhY2V0IiwicmVmRmFjZXQiLCJzdWJDb2xsZWN0aW9uRmFjZXQiLCJzdWJSZWZGYWNldCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QVdBO0FBQ0Q7O0FBQ0QsYUFBTyxJQUFQO0FBQ0EsS0E1Qk0sQ0FBUDtBQTZCQSIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWN0aW9uVHlwZSwgTWFuaWZlc3RTdWJTZWN0aW9uLCBNYW5pZmVzdEFjdGlvbiB9IGZyb20gXCIuLi8uLi9NYW5pZmVzdFNldHRpbmdzXCI7XG5pbXBvcnQge1xuXHRBbm5vdGF0aW9uVGVybSxcblx0Q29sbGVjdGlvbkZhY2V0VHlwZXMsXG5cdERhdGFGaWVsZEFic3RyYWN0VHlwZXMsXG5cdEZhY2V0VHlwZXMsXG5cdEZpZWxkR3JvdXAsXG5cdElkZW50aWZpY2F0aW9uLFxuXHRPcGVyYXRpb25Hcm91cGluZ1R5cGUsXG5cdFJlZmVyZW5jZUZhY2V0VHlwZXMsXG5cdFN0YXR1c0luZm8sXG5cdFVJQW5ub3RhdGlvblRlcm1zLFxuXHRVSUFubm90YXRpb25UeXBlc1xufSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcbmltcG9ydCB7IENvbW11bmljYXRpb25Bbm5vdGF0aW9uVGVybXMgfSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvZGlzdC9nZW5lcmF0ZWQvQ29tbXVuaWNhdGlvblwiO1xuaW1wb3J0IHsgQ3VzdG9tU3ViU2VjdGlvbklELCBGb3JtSUQsIFN1YlNlY3Rpb25JRCwgU2lkZUNvbnRlbnRJRCB9IGZyb20gXCIuLi8uLi9oZWxwZXJzL0lEXCI7XG5pbXBvcnQgeyBjcmVhdGVGb3JtRGVmaW5pdGlvbiwgRm9ybURlZmluaXRpb24sIGlzUmVmZXJlbmNlRmFjZXQgfSBmcm9tIFwiLi4vQ29tbW9uL0Zvcm1cIjtcbmltcG9ydCB7IERhdGFWaXN1YWxpemF0aW9uRGVmaW5pdGlvbiwgZ2V0RGF0YVZpc3VhbGl6YXRpb25Db25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL0NvbW1vbi9EYXRhVmlzdWFsaXphdGlvblwiO1xuaW1wb3J0IHsgQ29uZmlndXJhYmxlT2JqZWN0LCBDb25maWd1cmFibGVSZWNvcmQsIEN1c3RvbUVsZW1lbnQsIGluc2VydEN1c3RvbUVsZW1lbnRzLCBQbGFjZW1lbnQgfSBmcm9tIFwiLi4vLi4vaGVscGVycy9Db25maWd1cmFibGVPYmplY3RcIjtcbmltcG9ydCB7XG5cdENvbnZlcnRlckFjdGlvbixcblx0Q3VzdG9tQWN0aW9uLFxuXHRnZXRBY3Rpb25zRnJvbU1hbmlmZXN0LFxuXHRpc0FjdGlvbk5hdmlnYWJsZSxcblx0QnV0dG9uVHlwZSxcblx0Z2V0U2VtYW50aWNPYmplY3RNYXBwaW5nLFxuXHRyZW1vdmVEdXBsaWNhdGVBY3Rpb25zLFxuXHRCYXNlQWN0aW9uLFxuXHRnZXRFbmFibGVkRm9yQW5ub3RhdGlvbkFjdGlvblxufSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9jb250cm9scy9Db21tb24vQWN0aW9uXCI7XG5pbXBvcnQgeyBLZXlIZWxwZXIgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9oZWxwZXJzL0tleVwiO1xuaW1wb3J0IHtcblx0YW5ub3RhdGlvbkV4cHJlc3Npb24sXG5cdGJpbmRpbmdFeHByZXNzaW9uLFxuXHRCaW5kaW5nRXhwcmVzc2lvbixcblx0Y29tcGlsZUJpbmRpbmcsXG5cdGVxdWFsLFxuXHRmbixcblx0bm90LFxuXHRyZWZcbn0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ0V4cHJlc3Npb25cIjtcbmltcG9ydCB7IElzc3VlVHlwZSwgSXNzdWVTZXZlcml0eSwgSXNzdWVDYXRlZ29yeSB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvSXNzdWVNYW5hZ2VyXCI7XG5pbXBvcnQge1xuXHRGbGV4U2V0dGluZ3MsXG5cdGdldERlc2lnblRpbWVNZXRhZGF0YVNldHRpbmdzRm9ySGVhZGVyRmFjZXQsXG5cdGdldFN0YXNoZWRTZXR0aW5nc0ZvckhlYWRlckZhY2V0LFxuXHRDdXN0b21PYmplY3RQYWdlSGVhZGVyRmFjZXQsXG5cdGdldEhlYWRlckZhY2V0c0Zyb21NYW5pZmVzdFxufSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9jb250cm9scy9PYmplY3RQYWdlL0hlYWRlckZhY2V0XCI7XG5pbXBvcnQgeyBnZXRWaXNpYmlsaXR5RW5hYmxlbWVudEZvcm1NZW51QWN0aW9ucywgZ2V0Rm9ybUhpZGRlbkFjdGlvbnMsIGdldEZvcm1BY3Rpb25zIH0gZnJvbSBcIi4uLy4uL29iamVjdFBhZ2UvRm9ybU1lbnVBY3Rpb25zXCI7XG5pbXBvcnQgQ29udmVydGVyQ29udGV4dCBmcm9tIFwiLi4vLi4vQ29udmVydGVyQ29udGV4dFwiO1xuXG5leHBvcnQgZW51bSBTdWJTZWN0aW9uVHlwZSB7XG5cdFVua25vd24gPSBcIlVua25vd25cIiwgLy8gRGVmYXVsdCBUeXBlXG5cdEZvcm0gPSBcIkZvcm1cIixcblx0RGF0YVZpc3VhbGl6YXRpb24gPSBcIkRhdGFWaXN1YWxpemF0aW9uXCIsXG5cdFhNTEZyYWdtZW50ID0gXCJYTUxGcmFnbWVudFwiLFxuXHRQbGFjZWhvbGRlciA9IFwiUGxhY2Vob2xkZXJcIixcblx0TWl4ZWQgPSBcIk1peGVkXCJcbn1cblxuZXhwb3J0IHR5cGUgT2JqZWN0UGFnZVN1YlNlY3Rpb24gPVxuXHR8IFVuc3VwcG9ydGVkU3ViU2VjdGlvblxuXHR8IEZvcm1TdWJTZWN0aW9uXG5cdHwgRGF0YVZpc3VhbGl6YXRpb25TdWJTZWN0aW9uXG5cdHwgQ29udGFjdFN1YlNlY3Rpb25cblx0fCBYTUxGcmFnbWVudFN1YlNlY3Rpb25cblx0fCBQbGFjZWhvbGRlckZyYWdtZW50U3ViU2VjdGlvblxuXHR8IE1peGVkU3ViU2VjdGlvbjtcblxudHlwZSBCYXNlU3ViU2VjdGlvbiA9IHtcblx0aWQ6IHN0cmluZztcblx0a2V5OiBzdHJpbmc7XG5cdHRpdGxlOiBCaW5kaW5nRXhwcmVzc2lvbjxzdHJpbmc+O1xuXHRhbm5vdGF0aW9uUGF0aDogc3RyaW5nO1xuXHR0eXBlOiBTdWJTZWN0aW9uVHlwZTtcblx0dmlzaWJsZTogQmluZGluZ0V4cHJlc3Npb248Ym9vbGVhbj47XG5cdGZsZXhTZXR0aW5ncz86IEZsZXhTZXR0aW5ncztcblx0c3Rhc2hlZD86IGJvb2xlYW47XG5cdGxldmVsOiBudW1iZXI7XG5cdGNvbnRlbnQ/OiBBcnJheTxPYmplY3RQYWdlU3ViU2VjdGlvbj47XG5cdHNpZGVDb250ZW50PzogU2lkZUNvbnRlbnREZWY7XG59O1xuXG50eXBlIFVuc3VwcG9ydGVkU3ViU2VjdGlvbiA9IEJhc2VTdWJTZWN0aW9uICYge1xuXHR0ZXh0OiBzdHJpbmc7XG59O1xuXG50eXBlIERhdGFWaXN1YWxpemF0aW9uU3ViU2VjdGlvbiA9IEJhc2VTdWJTZWN0aW9uICYge1xuXHR0eXBlOiBTdWJTZWN0aW9uVHlwZS5EYXRhVmlzdWFsaXphdGlvbjtcblx0cHJlc2VudGF0aW9uOiBEYXRhVmlzdWFsaXphdGlvbkRlZmluaXRpb247XG5cdHNob3dUaXRsZTogYm9vbGVhbjtcbn07XG5cbnR5cGUgQ29udGFjdFN1YlNlY3Rpb24gPSBVbnN1cHBvcnRlZFN1YlNlY3Rpb24gJiB7fTtcblxudHlwZSBYTUxGcmFnbWVudFN1YlNlY3Rpb24gPSBPbWl0PEJhc2VTdWJTZWN0aW9uLCBcImFubm90YXRpb25QYXRoXCI+ICYge1xuXHR0eXBlOiBTdWJTZWN0aW9uVHlwZS5YTUxGcmFnbWVudDtcblx0dGVtcGxhdGU6IHN0cmluZztcblx0YWN0aW9uczogUmVjb3JkPHN0cmluZywgQ3VzdG9tQWN0aW9uPjtcbn07XG5cbnR5cGUgRW1waGFzaXplZCA9IHtcblx0cGF0aDogc3RyaW5nO1xufTtcblxudHlwZSBQbGFjZWhvbGRlckZyYWdtZW50U3ViU2VjdGlvbiA9IE9taXQ8QmFzZVN1YlNlY3Rpb24sIFwiYW5ub3RhdGlvblBhdGhcIj4gJiB7XG5cdHR5cGU6IFN1YlNlY3Rpb25UeXBlLlBsYWNlaG9sZGVyO1xuXHRhY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21BY3Rpb24+O1xufTtcblxudHlwZSBNaXhlZFN1YlNlY3Rpb24gPSBCYXNlU3ViU2VjdGlvbiAmIHtcblx0Y29udGVudDogQXJyYXk8T2JqZWN0UGFnZVN1YlNlY3Rpb24+O1xufTtcblxuZXhwb3J0IHR5cGUgRm9ybVN1YlNlY3Rpb24gPSBCYXNlU3ViU2VjdGlvbiAmIHtcblx0dHlwZTogU3ViU2VjdGlvblR5cGUuRm9ybTtcblx0Zm9ybURlZmluaXRpb246IEZvcm1EZWZpbml0aW9uO1xuXHRhY3Rpb25zOiBDb252ZXJ0ZXJBY3Rpb25bXSB8IEJhc2VBY3Rpb25bXTtcbn07XG5cbmV4cG9ydCB0eXBlIE9iamVjdFBhZ2VTZWN0aW9uID0gQ29uZmlndXJhYmxlT2JqZWN0ICYge1xuXHRpZDogc3RyaW5nO1xuXHR0aXRsZTogQmluZGluZ0V4cHJlc3Npb248c3RyaW5nPjtcblx0c2hvd1RpdGxlPzogQmluZGluZ0V4cHJlc3Npb248Ym9vbGVhbj47XG5cdHZpc2libGU6IEJpbmRpbmdFeHByZXNzaW9uPGJvb2xlYW4+O1xuXHRzdWJTZWN0aW9uczogT2JqZWN0UGFnZVN1YlNlY3Rpb25bXTtcbn07XG5cbnR5cGUgU2lkZUNvbnRlbnREZWYgPSB7XG5cdHRlbXBsYXRlPzogc3RyaW5nO1xuXHRpZD86IHN0cmluZztcblx0c2lkZUNvbnRlbnRGYWxsRG93bj86IHN0cmluZztcblx0Y29udGFpbmVyUXVlcnk/OiBzdHJpbmc7XG5cdHZpc2libGU/OiBib29sZWFuO1xuXHRlcXVhbFNwbGl0PzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCB0eXBlIEN1c3RvbU9iamVjdFBhZ2VTZWN0aW9uID0gQ3VzdG9tRWxlbWVudDxPYmplY3RQYWdlU2VjdGlvbj47XG5cbmV4cG9ydCB0eXBlIEN1c3RvbU9iamVjdFBhZ2VTdWJTZWN0aW9uID0gQ3VzdG9tRWxlbWVudDxPYmplY3RQYWdlU3ViU2VjdGlvbj47XG5cbmNvbnN0IHRhcmdldFRlcm1zOiBzdHJpbmdbXSA9IFtcblx0VUlBbm5vdGF0aW9uVGVybXMuTGluZUl0ZW0sXG5cdFVJQW5ub3RhdGlvblRlcm1zLlByZXNlbnRhdGlvblZhcmlhbnQsXG5cdFVJQW5ub3RhdGlvblRlcm1zLlNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnRcbl07XG5cbi8vIFRPRE86IE5lZWQgdG8gaGFuZGxlIFRhYmxlIGNhc2UgaW5zaWRlIGNyZWF0ZVN1YlNlY3Rpb24gZnVuY3Rpb24gaWYgQ29sbGVjdGlvbkZhY2V0IGhhcyBUYWJsZSBSZWZlcmVuY2VGYWNldFxuY29uc3QgaGFzVGFibGUgPSAoZmFjZXRzOiBhbnlbXSA9IFtdKSA9PiB7XG5cdHJldHVybiBmYWNldHMuc29tZShmYWNldFR5cGUgPT4gdGFyZ2V0VGVybXMuaW5kZXhPZihmYWNldFR5cGU/LlRhcmdldD8uJHRhcmdldD8udGVybSkgPiAtMSk7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBzdWJzZWN0aW9ucyBiYXNlZCBvbiBmYWNldCBkZWZpbml0aW9uLlxuICpcbiAqIEBwYXJhbSB7RmFjZXRUeXBlc1tdfSBmYWNldENvbGxlY3Rpb24gQ29sbGVjdGlvbiBvZiBmYWNldHNcbiAqIEBwYXJhbSB7Q29udmVydGVyQ29udGV4dH0gY29udmVydGVyQ29udGV4dCBUaGUgY29udmVydGVyIGNvbnRleHRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNIZWFkZXJTZWN0aW9uIFRydWUgaWYgaGVhZGVyIHNlY3Rpb24gaXMgZ2VuZXJhdGVkIGluIHRoaXMgaXRlcmF0aW9uXG4gKiBAcmV0dXJucyB7T2JqZWN0UGFnZVN1YlNlY3Rpb25bXX0gVGhlIGN1cnJlbnQgc3Vic2VjdGlvbnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVN1YlNlY3Rpb25zKFxuXHRmYWNldENvbGxlY3Rpb246IEZhY2V0VHlwZXNbXSxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCxcblx0aXNIZWFkZXJTZWN0aW9uPzogYm9vbGVhblxuKTogT2JqZWN0UGFnZVN1YlNlY3Rpb25bXSB7XG5cdC8vIEZpcnN0IHdlIGRldGVybWluZSB3aGljaCBzdWIgc2VjdGlvbiB3ZSBuZWVkIHRvIGNyZWF0ZVxuXHRjb25zdCBmYWNldHNUb0NyZWF0ZSA9IGZhY2V0Q29sbGVjdGlvbi5yZWR1Y2UoKGZhY2V0c1RvQ3JlYXRlOiBGYWNldFR5cGVzW10sIGZhY2V0RGVmaW5pdGlvbikgPT4ge1xuXHRcdHN3aXRjaCAoZmFjZXREZWZpbml0aW9uLiRUeXBlKSB7XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZUZhY2V0OlxuXHRcdFx0XHRmYWNldHNUb0NyZWF0ZS5wdXNoKGZhY2V0RGVmaW5pdGlvbik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5Db2xsZWN0aW9uRmFjZXQ6XG5cdFx0XHRcdC8vIFRPRE8gSWYgdGhlIENvbGxlY3Rpb24gRmFjZXQgaGFzIGEgY2hpbGQgb2YgdHlwZSBDb2xsZWN0aW9uIEZhY2V0IHdlIGJyaW5nIHRoZW0gdXAgb25lIGxldmVsIChGb3JtICsgVGFibGUgdXNlIGNhc2UpID9cblx0XHRcdFx0Ly8gZmlyc3QgY2FzZSBmYWNldCBDb2xsZWN0aW9uIGlzIGNvbWJpbmF0aW9uIG9mIGNvbGxlY3Rpb24gYW5kIHJlZmVyZW5jZSBmYWNldCBvciBub3QgYWxsIGZhY2V0cyBhcmUgcmVmZXJlbmNlIGZhY2V0cy5cblx0XHRcdFx0aWYgKGZhY2V0RGVmaW5pdGlvbi5GYWNldHMuZmluZChmYWNldFR5cGUgPT4gZmFjZXRUeXBlLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5Db2xsZWN0aW9uRmFjZXQpKSB7XG5cdFx0XHRcdFx0ZmFjZXRzVG9DcmVhdGUuc3BsaWNlKGZhY2V0c1RvQ3JlYXRlLmxlbmd0aCwgMCwgLi4uZmFjZXREZWZpbml0aW9uLkZhY2V0cyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZmFjZXRzVG9DcmVhdGUucHVzaChmYWNldERlZmluaXRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5SZWZlcmVuY2VVUkxGYWNldDpcblx0XHRcdFx0Ly8gTm90IHN1cHBvcnRlZFxuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdFx0cmV0dXJuIGZhY2V0c1RvQ3JlYXRlO1xuXHR9LCBbXSk7XG5cblx0Ly8gVGhlbiB3ZSBjcmVhdGUgdGhlIGFjdHVhbCBzdWJzZWN0aW9uc1xuXHRyZXR1cm4gZmFjZXRzVG9DcmVhdGUubWFwKGZhY2V0ID0+XG5cdFx0Y3JlYXRlU3ViU2VjdGlvbihmYWNldCwgZmFjZXRzVG9DcmVhdGUsIGNvbnZlcnRlckNvbnRleHQsIDAsICEoZmFjZXQgYXMgYW55KT8uRmFjZXRzPy5sZW5ndGgsIGlzSGVhZGVyU2VjdGlvbilcblx0KTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIHN1YnNlY3Rpb25zIGJhc2VkIG9uIHRoZSBkZWZpbml0aW9uIG9mIHRoZSBjdXN0b20gaGVhZGVyIGZhY2V0LlxuICpcbiAqIEBwYXJhbSB7Q29udmVydGVyQ29udGV4dH0gY29udmVydGVyQ29udGV4dCBUaGUgY29udmVydGVyIGNvbnRleHRcbiAqIEByZXR1cm5zIHtPYmplY3RQYWdlU3ViU2VjdGlvbltdfSBUaGUgY3VycmVudCBzdWJzZWN0aW9uc1xuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ3VzdG9tSGVhZGVyRmFjZXRTdWJTZWN0aW9ucyhjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogT2JqZWN0UGFnZVN1YlNlY3Rpb25bXSB7XG5cdGNvbnN0IGN1c3RvbUhlYWRlckZhY2V0czogUmVjb3JkPHN0cmluZywgQ3VzdG9tT2JqZWN0UGFnZUhlYWRlckZhY2V0PiA9IGdldEhlYWRlckZhY2V0c0Zyb21NYW5pZmVzdChcblx0XHRjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpLmdldEhlYWRlckZhY2V0cygpXG5cdCk7XG5cdGNvbnN0IGFDdXN0b21IZWFkZXJGYWNldHM6IEN1c3RvbU9iamVjdFBhZ2VIZWFkZXJGYWNldFtdID0gW107XG5cdE9iamVjdC5rZXlzKGN1c3RvbUhlYWRlckZhY2V0cykubWFwKGZ1bmN0aW9uKGtleSkge1xuXHRcdGFDdXN0b21IZWFkZXJGYWNldHMucHVzaChjdXN0b21IZWFkZXJGYWNldHNba2V5XSk7XG5cdFx0cmV0dXJuIGFDdXN0b21IZWFkZXJGYWNldHM7XG5cdH0pO1xuXHRjb25zdCBmYWNldHNUb0NyZWF0ZSA9IGFDdXN0b21IZWFkZXJGYWNldHMucmVkdWNlKChmYWNldHNUb0NyZWF0ZTogQ3VzdG9tT2JqZWN0UGFnZUhlYWRlckZhY2V0W10sIGN1c3RvbUhlYWRlckZhY2V0KSA9PiB7XG5cdFx0aWYgKGN1c3RvbUhlYWRlckZhY2V0LnRlbXBsYXRlRWRpdCkge1xuXHRcdFx0ZmFjZXRzVG9DcmVhdGUucHVzaChjdXN0b21IZWFkZXJGYWNldCk7XG5cdFx0fVxuXHRcdHJldHVybiBmYWNldHNUb0NyZWF0ZTtcblx0fSwgW10pO1xuXG5cdHJldHVybiBmYWNldHNUb0NyZWF0ZS5tYXAoY3VzdG9tSGVhZGVyRmFjZXQgPT4gY3JlYXRlQ3VzdG9tSGVhZGVyRmFjZXRTdWJTZWN0aW9uKGN1c3RvbUhlYWRlckZhY2V0KSk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN1YnNlY3Rpb24gYmFzZWQgb24gYSBjdXN0b20gaGVhZGVyIGZhY2V0LlxuICpcbiAqIEBwYXJhbSBjdXN0b21IZWFkZXJGYWNldCBBIGN1c3RvbSBoZWFkZXIgZmFjZXRcbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0UGFnZVN1YlNlY3Rpb259IEEgZGVmaW5pdGlvbiBmb3IgYSBzdWJzZWN0aW9uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUN1c3RvbUhlYWRlckZhY2V0U3ViU2VjdGlvbihjdXN0b21IZWFkZXJGYWNldDogQ3VzdG9tT2JqZWN0UGFnZUhlYWRlckZhY2V0KTogT2JqZWN0UGFnZVN1YlNlY3Rpb24ge1xuXHRjb25zdCBzdWJTZWN0aW9uSUQgPSBDdXN0b21TdWJTZWN0aW9uSUQoY3VzdG9tSGVhZGVyRmFjZXQua2V5KTtcblx0Y29uc3Qgc3ViU2VjdGlvbjogWE1MRnJhZ21lbnRTdWJTZWN0aW9uID0ge1xuXHRcdGlkOiBzdWJTZWN0aW9uSUQsXG5cdFx0a2V5OiBjdXN0b21IZWFkZXJGYWNldC5rZXksXG5cdFx0dGl0bGU6IGN1c3RvbUhlYWRlckZhY2V0LnRpdGxlLFxuXHRcdHR5cGU6IFN1YlNlY3Rpb25UeXBlLlhNTEZyYWdtZW50LFxuXHRcdHRlbXBsYXRlOiBjdXN0b21IZWFkZXJGYWNldC50ZW1wbGF0ZUVkaXQgfHwgXCJcIixcblx0XHR2aXNpYmxlOiBjdXN0b21IZWFkZXJGYWNldC52aXNpYmxlLFxuXHRcdGxldmVsOiAxLFxuXHRcdHNpZGVDb250ZW50OiB1bmRlZmluZWQsXG5cdFx0c3Rhc2hlZDogY3VzdG9tSGVhZGVyRmFjZXQuc3Rhc2hlZCxcblx0XHRmbGV4U2V0dGluZ3M6IGN1c3RvbUhlYWRlckZhY2V0LmZsZXhTZXR0aW5ncyxcblx0XHRhY3Rpb25zOiB7fVxuXHR9O1xuXHRyZXR1cm4gc3ViU2VjdGlvbjtcbn1cblxuLy8gZnVuY3Rpb24gaXNUYXJnZXRGb3JDb21wbGlhbnQoYW5ub3RhdGlvblBhdGg6IEFubm90YXRpb25QYXRoKSB7XG4vLyBcdHJldHVybiAvLipjb21cXC5zYXBcXC52b2NhYnVsYXJpZXNcXC5VSVxcLnYxXFwuKEZpZWxkR3JvdXB8SWRlbnRpZmljYXRpb258RGF0YVBvaW50fFN0YXR1c0luZm8pLiovLnRlc3QoYW5ub3RhdGlvblBhdGgudmFsdWUpO1xuLy8gfVxuY29uc3QgZ2V0U3ViU2VjdGlvbktleSA9IChmYWNldERlZmluaXRpb246IEZhY2V0VHlwZXMsIGZhbGxiYWNrOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuXHRyZXR1cm4gZmFjZXREZWZpbml0aW9uLklEPy50b1N0cmluZygpIHx8IGZhY2V0RGVmaW5pdGlvbi5MYWJlbD8udG9TdHJpbmcoKSB8fCBmYWxsYmFjaztcbn07XG4vKipcbiAqIEFkZHMgRm9ybSBtZW51IGFjdGlvbiB0byBhbGwgZm9ybSBhY3Rpb25zLCByZW1vdmVzIGR1cGxpY2F0ZSBhY3Rpb25zIGFuZCBoaWRkZW4gYWN0aW9ucy5cbiAqIEBwYXJhbSBhY3Rpb25zIFRoZSBhY3Rpb25zIGludm9sdmVkXG4gKiBAcGFyYW0gZmFjZXREZWZpbml0aW9uIFRoZSBkZWZpbml0aW9uIGZvciB0aGUgZmFjZXRcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHJldHVybnMge0Jhc2VBY3Rpb25bXSB8IENvbnZlcnRlckFjdGlvbltdfVxuICovXG5mdW5jdGlvbiBhZGRGb3JtTWVudUFjdGlvbnMoXG5cdGFjdGlvbnM6IENvbnZlcnRlckFjdGlvbltdLFxuXHRmYWNldERlZmluaXRpb246IEZhY2V0VHlwZXMsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IEJhc2VBY3Rpb25bXSB8IENvbnZlcnRlckFjdGlvbltdIHtcblx0Y29uc3QgaGlkZGVuQWN0aW9uczogQmFzZUFjdGlvbltdID0gZ2V0Rm9ybUhpZGRlbkFjdGlvbnMoZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KSB8fCBbXSxcblx0XHRmb3JtQWN0aW9uczogQ29uZmlndXJhYmxlUmVjb3JkPE1hbmlmZXN0QWN0aW9uPiA9IGdldEZvcm1BY3Rpb25zKGZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dCksXG5cdFx0Zm9ybUFsbEFjdGlvbnMgPSBpbnNlcnRDdXN0b21FbGVtZW50cyhcblx0XHRcdGFjdGlvbnMsXG5cdFx0XHRnZXRBY3Rpb25zRnJvbU1hbmlmZXN0KGZvcm1BY3Rpb25zLCBjb252ZXJ0ZXJDb250ZXh0LCBhY3Rpb25zLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgaGlkZGVuQWN0aW9ucylcblx0XHQpO1xuXHRyZXR1cm4gZm9ybUFsbEFjdGlvbnMgPyBnZXRWaXNpYmlsaXR5RW5hYmxlbWVudEZvcm1NZW51QWN0aW9ucyhyZW1vdmVEdXBsaWNhdGVBY3Rpb25zKGZvcm1BbGxBY3Rpb25zKSkgOiBhY3Rpb25zO1xufVxuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgYWN0aW9uIGZvcm0gYSBmYWNldC5cbiAqIEBwYXJhbSBmYWNldERlZmluaXRpb25cbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcmV0dXJucyB7Q29udmVydGVyQWN0aW9uW10gfCBCYXNlQWN0aW9uW119IFRoZSBjdXJyZW50IGZhY2V0IGFjdGlvbnNcbiAqL1xuZnVuY3Rpb24gZ2V0RmFjZXRBY3Rpb25zKGZhY2V0RGVmaW5pdGlvbjogRmFjZXRUeXBlcywgY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IEJhc2VBY3Rpb25bXSB8IENvbnZlcnRlckFjdGlvbltdIHtcblx0bGV0IGFjdGlvbnMgPSBuZXcgQXJyYXk8Q29udmVydGVyQWN0aW9uPigpO1xuXHRzd2l0Y2ggKGZhY2V0RGVmaW5pdGlvbi4kVHlwZSkge1xuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuQ29sbGVjdGlvbkZhY2V0OlxuXHRcdFx0YWN0aW9ucyA9IChmYWNldERlZmluaXRpb24uRmFjZXRzLmZpbHRlcihmYWNldERlZmluaXRpb24gPT4gaXNSZWZlcmVuY2VGYWNldChmYWNldERlZmluaXRpb24pKSBhcyBSZWZlcmVuY2VGYWNldFR5cGVzW10pLnJlZHVjZShcblx0XHRcdFx0KGFjdGlvbnM6IENvbnZlcnRlckFjdGlvbltdLCBmYWNldERlZmluaXRpb24pID0+IGNyZWF0ZUZvcm1BY3Rpb25SZWR1Y2VyKGFjdGlvbnMsIGZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dCksXG5cdFx0XHRcdFtdXG5cdFx0XHQpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5SZWZlcmVuY2VGYWNldDpcblx0XHRcdGFjdGlvbnMgPSBjcmVhdGVGb3JtQWN0aW9uUmVkdWNlcihbXSwgZmFjZXREZWZpbml0aW9uIGFzIFJlZmVyZW5jZUZhY2V0VHlwZXMsIGNvbnZlcnRlckNvbnRleHQpO1xuXHRcdFx0YnJlYWs7XG5cdH1cblx0cmV0dXJuIGFkZEZvcm1NZW51QWN0aW9ucyhhY3Rpb25zLCBmYWNldERlZmluaXRpb24sIGNvbnZlcnRlckNvbnRleHQpO1xufVxuLyoqXG4gKiBSZXRydW5zIHRoZSBidXR0b24gdHlwZSBiYXNlZCBvbiBAVUkuRW1waGFzaXplZCBhbm5vdGF0aW9uLlxuICogQHBhcmFtIEVtcGhhc2l6ZWQgRW1waGFzaXplZCBhbm5vdGF0aW9uIHZhbHVlLlxuICogQHJldHVybnMge0J1dHRvblR5cGUgfCBzdHJpbmd9IFRoZSBidXR0b24gdHlwZSBvciBwYXRoIGJhc2VkIGV4cHJlc3Npb24uXG4gKi9cbmZ1bmN0aW9uIGdldEJ1dHRvblR5cGUoRW1waGFzaXplZDogRW1waGFzaXplZCk6IEJ1dHRvblR5cGUgfCBzdHJpbmcge1xuXHRjb25zdCBQYXRoRm9yQnV0dG9uVHlwZTogc3RyaW5nID0gRW1waGFzaXplZD8ucGF0aDtcblx0aWYgKFBhdGhGb3JCdXR0b25UeXBlKSB7XG5cdFx0cmV0dXJuIFwiez0gXCIgKyBcIiEke1wiICsgUGF0aEZvckJ1dHRvblR5cGUgKyBcIn0gPyAnXCIgKyBCdXR0b25UeXBlLlRyYW5zcGFyZW50ICsgXCInIDogJHtcIiArIFBhdGhGb3JCdXR0b25UeXBlICsgXCJ9XCIgKyBcIn1cIjtcblx0fSBlbHNlIGlmIChFbXBoYXNpemVkKSB7XG5cdFx0cmV0dXJuIEJ1dHRvblR5cGUuR2hvc3Q7XG5cdH1cblx0cmV0dXJuIEJ1dHRvblR5cGUuVHJhbnNwYXJlbnQ7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgc3Vic2VjdGlvbiBiYXNlZCBvbiBGYWNldFR5cGVzLlxuICogQHBhcmFtIGZhY2V0RGVmaW5pdGlvblxuICogQHBhcmFtIGZhY2V0c1RvQ3JlYXRlXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHBhcmFtIGxldmVsXG4gKiBAcGFyYW0gaGFzU2luZ2xlQ29udGVudFxuICogQHBhcmFtIGlzSGVhZGVyU2VjdGlvblxuICogQHJldHVybnMge09iamVjdFBhZ2VTdWJTZWN0aW9ufSBBIHN1YnNlY3Rpb24gZGVmaW5pdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3ViU2VjdGlvbihcblx0ZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLFxuXHRmYWNldHNUb0NyZWF0ZTogRmFjZXRUeXBlc1tdLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRsZXZlbDogbnVtYmVyLFxuXHRoYXNTaW5nbGVDb250ZW50OiBib29sZWFuLFxuXHRpc0hlYWRlclNlY3Rpb24/OiBib29sZWFuXG4pOiBPYmplY3RQYWdlU3ViU2VjdGlvbiB7XG5cdGNvbnN0IHN1YlNlY3Rpb25JRCA9IFN1YlNlY3Rpb25JRCh7IEZhY2V0OiBmYWNldERlZmluaXRpb24gfSk7XG5cdGNvbnN0IHN1YlNlY3Rpb246IEJhc2VTdWJTZWN0aW9uID0ge1xuXHRcdGlkOiBzdWJTZWN0aW9uSUQsXG5cdFx0a2V5OiBnZXRTdWJTZWN0aW9uS2V5KGZhY2V0RGVmaW5pdGlvbiwgc3ViU2VjdGlvbklEKSxcblx0XHR0aXRsZTogY29tcGlsZUJpbmRpbmcoYW5ub3RhdGlvbkV4cHJlc3Npb24oZmFjZXREZWZpbml0aW9uLkxhYmVsKSksXG5cdFx0dHlwZTogU3ViU2VjdGlvblR5cGUuVW5rbm93bixcblx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGZhY2V0RGVmaW5pdGlvbi5mdWxseVF1YWxpZmllZE5hbWUpLFxuXHRcdHZpc2libGU6IGNvbXBpbGVCaW5kaW5nKG5vdChlcXVhbChhbm5vdGF0aW9uRXhwcmVzc2lvbihmYWNldERlZmluaXRpb24uYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4pLCB0cnVlKSkpLFxuXHRcdGxldmVsOiBsZXZlbCxcblx0XHRzaWRlQ29udGVudDogdW5kZWZpbmVkXG5cdH07XG5cdGlmIChpc0hlYWRlclNlY3Rpb24pIHtcblx0XHRzdWJTZWN0aW9uLnN0YXNoZWQgPSBnZXRTdGFzaGVkU2V0dGluZ3NGb3JIZWFkZXJGYWNldChmYWNldERlZmluaXRpb24sIGZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dCk7XG5cdFx0c3ViU2VjdGlvbi5mbGV4U2V0dGluZ3MgPSB7XG5cdFx0XHRkZXNpZ250aW1lOiBnZXREZXNpZ25UaW1lTWV0YWRhdGFTZXR0aW5nc0ZvckhlYWRlckZhY2V0KGZhY2V0RGVmaW5pdGlvbiwgZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KVxuXHRcdH07XG5cdH1cblx0bGV0IGNvbnRlbnQ6IEFycmF5PE9iamVjdFBhZ2VTdWJTZWN0aW9uPiA9IFtdO1xuXHRjb25zdCB0YWJsZUNvbnRlbnQ6IEFycmF5PE9iamVjdFBhZ2VTdWJTZWN0aW9uPiA9IFtdO1xuXHRjb25zdCBpbmRleDogQXJyYXk8bnVtYmVyPiA9IFtdO1xuXHRsZXQgdW5zdXBwb3J0ZWRUZXh0ID0gXCJcIjtcblx0bGV2ZWwrKztcblx0c3dpdGNoIChmYWNldERlZmluaXRpb24uJFR5cGUpIHtcblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkNvbGxlY3Rpb25GYWNldDpcblx0XHRcdGNvbnN0IGZhY2V0cyA9IGZhY2V0RGVmaW5pdGlvbi5GYWNldHM7XG5cdFx0XHRpZiAoaGFzVGFibGUoZmFjZXRzKSkge1xuXHRcdFx0XHQvLyBpZiB3ZSBoYXZlIHRhYmxlcyBpbiBhIGNvbGxlY3Rpb24gZmFjZXQgdGhlbiB3ZSBjcmVhdGUgc2VwYXJhdGUgc3Vic2VjdGlvbiBmb3IgdGhlbVxuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGZhY2V0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGlmICh0YXJnZXRUZXJtcy5pbmRleE9mKChmYWNldHNbaV0gYXMgYW55KS5UYXJnZXQ/LiR0YXJnZXQ/LnRlcm0pID4gLTEpIHtcblx0XHRcdFx0XHRcdC8vY3JlYXRpbmcgc2VwYXJhdGUgYXJyYXkgZm9yIHRhYmxlc1xuXHRcdFx0XHRcdFx0dGFibGVDb250ZW50LnB1c2goY3JlYXRlU3ViU2VjdGlvbihmYWNldHNbaV0sIFtdLCBjb252ZXJ0ZXJDb250ZXh0LCBsZXZlbCwgZmFjZXRzLmxlbmd0aCA9PT0gMSwgaXNIZWFkZXJTZWN0aW9uKSk7XG5cdFx0XHRcdFx0XHRpbmRleC5wdXNoKGkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRmb3IgKGxldCBpID0gaW5kZXgubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0XHQvL3JlbW92ZSB0YWJsZSBmYWNldHMgZnJvbSBmYWNldCBkZWZpbml0aW9uXG5cdFx0XHRcdFx0ZmFjZXRzLnNwbGljZShpbmRleFtpXSwgMSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGZhY2V0cy5sZW5ndGgpIHtcblx0XHRcdFx0XHRmYWNldERlZmluaXRpb24uRmFjZXRzID0gZmFjZXRzO1xuXHRcdFx0XHRcdC8vY3JlYXRlIGEgZm9ybSBzdWJzZWN0aW9uIGZyb20gdGhlIHJlbWFpbmluZyBmYWNldHNcblx0XHRcdFx0XHRjb250ZW50LnB1c2goY3JlYXRlU3ViU2VjdGlvbihmYWNldERlZmluaXRpb24sIFtdLCBjb252ZXJ0ZXJDb250ZXh0LCBsZXZlbCwgaGFzU2luZ2xlQ29udGVudCwgaXNIZWFkZXJTZWN0aW9uKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29udGVudCA9IGNvbnRlbnQuY29uY2F0KHRhYmxlQ29udGVudCk7XG5cdFx0XHRcdGNvbnN0IG1peGVkU3ViU2VjdGlvbjogTWl4ZWRTdWJTZWN0aW9uID0ge1xuXHRcdFx0XHRcdC4uLnN1YlNlY3Rpb24sXG5cdFx0XHRcdFx0dHlwZTogU3ViU2VjdGlvblR5cGUuTWl4ZWQsXG5cdFx0XHRcdFx0bGV2ZWw6IGxldmVsLFxuXHRcdFx0XHRcdGNvbnRlbnQ6IGNvbnRlbnRcblx0XHRcdFx0fTtcblx0XHRcdFx0cmV0dXJuIG1peGVkU3ViU2VjdGlvbjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IGFjdGlvbnMgPSBnZXRGYWNldEFjdGlvbnMoZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRcdFx0XHRmb3JtQ29sbGVjdGlvblN1YlNlY3Rpb246IEZvcm1TdWJTZWN0aW9uID0ge1xuXHRcdFx0XHRcdFx0Li4uc3ViU2VjdGlvbixcblx0XHRcdFx0XHRcdHR5cGU6IFN1YlNlY3Rpb25UeXBlLkZvcm0sXG5cdFx0XHRcdFx0XHRmb3JtRGVmaW5pdGlvbjogY3JlYXRlRm9ybURlZmluaXRpb24oZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0LCBhY3Rpb25zKSxcblx0XHRcdFx0XHRcdGxldmVsOiBsZXZlbCxcblx0XHRcdFx0XHRcdGFjdGlvbnM6IGFjdGlvbnMuZmlsdGVyKGFjdGlvbiA9PiBhY3Rpb24uZmFjZXROYW1lID09PSB1bmRlZmluZWQpXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0cmV0dXJuIGZvcm1Db2xsZWN0aW9uU3ViU2VjdGlvbjtcblx0XHRcdH1cblx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZUZhY2V0OlxuXHRcdFx0aWYgKCFmYWNldERlZmluaXRpb24uVGFyZ2V0LiR0YXJnZXQpIHtcblx0XHRcdFx0dW5zdXBwb3J0ZWRUZXh0ID0gYFVuYWJsZSB0byBmaW5kIGFubm90YXRpb25QYXRoICR7ZmFjZXREZWZpbml0aW9uLlRhcmdldC52YWx1ZX1gO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c3dpdGNoIChmYWNldERlZmluaXRpb24uVGFyZ2V0LiR0YXJnZXQudGVybSkge1xuXHRcdFx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVGVybXMuTGluZUl0ZW06XG5cdFx0XHRcdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5DaGFydDpcblx0XHRcdFx0XHRjYXNlIFVJQW5ub3RhdGlvblRlcm1zLlByZXNlbnRhdGlvblZhcmlhbnQ6XG5cdFx0XHRcdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5TZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50OlxuXHRcdFx0XHRcdFx0Y29uc3QgcHJlc2VudGF0aW9uID0gZ2V0RGF0YVZpc3VhbGl6YXRpb25Db25maWd1cmF0aW9uKFxuXHRcdFx0XHRcdFx0XHRmYWNldERlZmluaXRpb24uVGFyZ2V0LnZhbHVlLFxuXHRcdFx0XHRcdFx0XHRnZXRDb25kZW5zZWRUYWJsZUxheW91dENvbXBsaWFuY2UoZmFjZXREZWZpbml0aW9uLCBmYWNldHNUb0NyZWF0ZSwgY29udmVydGVyQ29udGV4dCksXG5cdFx0XHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHQsXG5cdFx0XHRcdFx0XHRcdHVuZGVmaW5lZCxcblx0XHRcdFx0XHRcdFx0aXNIZWFkZXJTZWN0aW9uXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0bGV0IGNvbnRyb2xUaXRsZSA9IChwcmVzZW50YXRpb24udmlzdWFsaXphdGlvbnNbMF0gYXMgYW55KT8uYW5ub3RhdGlvbj8udGl0bGU7XG5cdFx0XHRcdFx0XHRjb250cm9sVGl0bGUgPyBjb250cm9sVGl0bGUgOiAoY29udHJvbFRpdGxlID0gKHByZXNlbnRhdGlvbi52aXN1YWxpemF0aW9uc1swXSBhcyBhbnkpPy50aXRsZSk7XG5cdFx0XHRcdFx0XHRjb25zdCBkYXRhVmlzdWFsaXphdGlvblN1YlNlY3Rpb246IERhdGFWaXN1YWxpemF0aW9uU3ViU2VjdGlvbiA9IHtcblx0XHRcdFx0XHRcdFx0Li4uc3ViU2VjdGlvbixcblx0XHRcdFx0XHRcdFx0dHlwZTogU3ViU2VjdGlvblR5cGUuRGF0YVZpc3VhbGl6YXRpb24sXG5cdFx0XHRcdFx0XHRcdGxldmVsOiBsZXZlbCxcblx0XHRcdFx0XHRcdFx0cHJlc2VudGF0aW9uOiBwcmVzZW50YXRpb24sXG5cdFx0XHRcdFx0XHRcdHNob3dUaXRsZTogaXNTdWJzZWN0aW9uVGl0bGVTaG93bihoYXNTaW5nbGVDb250ZW50LCBzdWJTZWN0aW9uLnRpdGxlLCBjb250cm9sVGl0bGUpXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0cmV0dXJuIGRhdGFWaXN1YWxpemF0aW9uU3ViU2VjdGlvbjtcblxuXHRcdFx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVGVybXMuRmllbGRHcm91cDpcblx0XHRcdFx0XHRjYXNlIFVJQW5ub3RhdGlvblRlcm1zLklkZW50aWZpY2F0aW9uOlxuXHRcdFx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVGVybXMuRGF0YVBvaW50OlxuXHRcdFx0XHRcdGNhc2UgVUlBbm5vdGF0aW9uVGVybXMuU3RhdHVzSW5mbzpcblx0XHRcdFx0XHRjYXNlIENvbW11bmljYXRpb25Bbm5vdGF0aW9uVGVybXMuQ29udGFjdDpcblx0XHRcdFx0XHRcdC8vIEFsbCB0aG9zZSBlbGVtZW50IGJlbG9uZyB0byBhIGZvcm0gZmFjZXRcblx0XHRcdFx0XHRcdGNvbnN0IGFjdGlvbnMgPSBnZXRGYWNldEFjdGlvbnMoZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRcdFx0XHRcdFx0Zm9ybUVsZW1lbnRTdWJTZWN0aW9uOiBGb3JtU3ViU2VjdGlvbiA9IHtcblx0XHRcdFx0XHRcdFx0XHQuLi5zdWJTZWN0aW9uLFxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFN1YlNlY3Rpb25UeXBlLkZvcm0sXG5cdFx0XHRcdFx0XHRcdFx0bGV2ZWw6IGxldmVsLFxuXHRcdFx0XHRcdFx0XHRcdGZvcm1EZWZpbml0aW9uOiBjcmVhdGVGb3JtRGVmaW5pdGlvbihmYWNldERlZmluaXRpb24sIGNvbnZlcnRlckNvbnRleHQsIGFjdGlvbnMpLFxuXHRcdFx0XHRcdFx0XHRcdGFjdGlvbnM6IGFjdGlvbnMuZmlsdGVyKGFjdGlvbiA9PiBhY3Rpb24uZmFjZXROYW1lID09PSB1bmRlZmluZWQpXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRyZXR1cm4gZm9ybUVsZW1lbnRTdWJTZWN0aW9uO1xuXG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHVuc3VwcG9ydGVkVGV4dCA9IGBGb3IgJHtmYWNldERlZmluaXRpb24uVGFyZ2V0LiR0YXJnZXQudGVybX0gRnJhZ21lbnRgO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuUmVmZXJlbmNlVVJMRmFjZXQ6XG5cdFx0XHR1bnN1cHBvcnRlZFRleHQgPSBcIkZvciBSZWZlcmVuY2UgVVJMIEZhY2V0XCI7XG5cdFx0XHRicmVhaztcblx0XHRkZWZhdWx0OlxuXHRcdFx0YnJlYWs7XG5cdH1cblx0Ly8gSWYgd2UgcmVhY2ggaGVyZSB3ZSBlbmRlZCB1cCB3aXRoIGFuIHVuc3VwcG9ydGVkIFN1YlNlY3Rpb24gdHlwZVxuXHRjb25zdCB1bnN1cHBvcnRlZFN1YlNlY3Rpb246IFVuc3VwcG9ydGVkU3ViU2VjdGlvbiA9IHtcblx0XHQuLi5zdWJTZWN0aW9uLFxuXHRcdHRleHQ6IHVuc3VwcG9ydGVkVGV4dFxuXHR9O1xuXHRyZXR1cm4gdW5zdXBwb3J0ZWRTdWJTZWN0aW9uO1xufVxuZnVuY3Rpb24gaXNTdWJzZWN0aW9uVGl0bGVTaG93bihoYXNTaW5nbGVDb250ZW50OiBib29sZWFuLCBzdWJTZWN0aW9uVGl0bGU6IEJpbmRpbmdFeHByZXNzaW9uPHN0cmluZz4sIGNvbnRyb2xUaXRsZTogc3RyaW5nKTogYm9vbGVhbiB7XG5cdGlmIChoYXNTaW5nbGVDb250ZW50ICYmIGNvbnRyb2xUaXRsZSA9PT0gc3ViU2VjdGlvblRpdGxlKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gY3JlYXRlRm9ybUFjdGlvblJlZHVjZXIoXG5cdGFjdGlvbnM6IENvbnZlcnRlckFjdGlvbltdLFxuXHRmYWNldERlZmluaXRpb246IFJlZmVyZW5jZUZhY2V0VHlwZXMsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IENvbnZlcnRlckFjdGlvbltdIHtcblx0Y29uc3QgcmVmZXJlbmNlVGFyZ2V0OiBBbm5vdGF0aW9uVGVybTxhbnk+ID0gZmFjZXREZWZpbml0aW9uLlRhcmdldC4kdGFyZ2V0O1xuXHRjb25zdCB0YXJnZXRWYWx1ZSA9IGZhY2V0RGVmaW5pdGlvbi5UYXJnZXQudmFsdWU7XG5cdGxldCBtYW5pZmVzdEFjdGlvbnM6IFJlY29yZDxzdHJpbmcsIEN1c3RvbUFjdGlvbj4gPSB7fTtcblx0bGV0IGRhdGFGaWVsZENvbGxlY3Rpb246IERhdGFGaWVsZEFic3RyYWN0VHlwZXNbXSA9IFtdO1xuXHRsZXQgW25hdmlnYXRpb25Qcm9wZXJ0eVBhdGhdOiBhbnkgPSB0YXJnZXRWYWx1ZS5zcGxpdChcIkBcIik7XG5cdGlmIChuYXZpZ2F0aW9uUHJvcGVydHlQYXRoLmxlbmd0aCA+IDApIHtcblx0XHRpZiAobmF2aWdhdGlvblByb3BlcnR5UGF0aC5sYXN0SW5kZXhPZihcIi9cIikgPT09IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGVuZ3RoIC0gMSkge1xuXHRcdFx0bmF2aWdhdGlvblByb3BlcnR5UGF0aCA9IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGguc3Vic3RyKDAsIG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgubGVuZ3RoIC0gMSk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGggPSB1bmRlZmluZWQ7XG5cdH1cblxuXHRpZiAocmVmZXJlbmNlVGFyZ2V0KSB7XG5cdFx0c3dpdGNoIChyZWZlcmVuY2VUYXJnZXQudGVybSkge1xuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5GaWVsZEdyb3VwOlxuXHRcdFx0XHRkYXRhRmllbGRDb2xsZWN0aW9uID0gKHJlZmVyZW5jZVRhcmdldCBhcyBGaWVsZEdyb3VwKS5EYXRhO1xuXHRcdFx0XHRtYW5pZmVzdEFjdGlvbnMgPSBnZXRBY3Rpb25zRnJvbU1hbmlmZXN0KFxuXHRcdFx0XHRcdGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbihyZWZlcmVuY2VUYXJnZXQpLmFjdGlvbnMsXG5cdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dCxcblx0XHRcdFx0XHR1bmRlZmluZWQsXG5cdFx0XHRcdFx0dW5kZWZpbmVkLFxuXHRcdFx0XHRcdHVuZGVmaW5lZCxcblx0XHRcdFx0XHR1bmRlZmluZWQsXG5cdFx0XHRcdFx0ZmFjZXREZWZpbml0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZSBhcyBzdHJpbmdcblx0XHRcdFx0KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblRlcm1zLklkZW50aWZpY2F0aW9uOlxuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5TdGF0dXNJbmZvOlxuXHRcdFx0XHRpZiAocmVmZXJlbmNlVGFyZ2V0LnF1YWxpZmllcikge1xuXHRcdFx0XHRcdGRhdGFGaWVsZENvbGxlY3Rpb24gPSByZWZlcmVuY2VUYXJnZXQgYXMgSWRlbnRpZmljYXRpb24gfCBTdGF0dXNJbmZvO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdGFjdGlvbnMgPSBkYXRhRmllbGRDb2xsZWN0aW9uLnJlZHVjZSgoYWN0aW9ucywgZGF0YUZpZWxkOiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzKSA9PiB7XG5cdFx0Y29uc3QgVUlBbm5vdGF0aW9uOiBhbnkgPSBkYXRhRmllbGQ/LmFubm90YXRpb25zPy5VSTtcblx0XHRzd2l0Y2ggKGRhdGFGaWVsZC4kVHlwZSkge1xuXHRcdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb246XG5cdFx0XHRcdGlmIChkYXRhRmllbGQuUmVxdWlyZXNDb250ZXh0Py52YWx1ZU9mKCkgPT09IHRydWUpIHtcblx0XHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHRcdFx0XHQuZ2V0RGlhZ25vc3RpY3MoKVxuXHRcdFx0XHRcdFx0LmFkZElzc3VlKElzc3VlQ2F0ZWdvcnkuQW5ub3RhdGlvbiwgSXNzdWVTZXZlcml0eS5Mb3csIElzc3VlVHlwZS5NQUxGT1JNRURfREFUQUZJRUxEX0ZPUl9JQk4uUkVRVUlSRVNDT05URVhUKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZGF0YUZpZWxkLklubGluZT8udmFsdWVPZigpID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0XHRcdFx0LmdldERpYWdub3N0aWNzKClcblx0XHRcdFx0XHRcdC5hZGRJc3N1ZShJc3N1ZUNhdGVnb3J5LkFubm90YXRpb24sIElzc3VlU2V2ZXJpdHkuTG93LCBJc3N1ZVR5cGUuTUFMRk9STUVEX0RBVEFGSUVMRF9GT1JfSUJOLklOTElORSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGRhdGFGaWVsZC5EZXRlcm1pbmluZz8udmFsdWVPZigpID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0XHRcdFx0LmdldERpYWdub3N0aWNzKClcblx0XHRcdFx0XHRcdC5hZGRJc3N1ZShJc3N1ZUNhdGVnb3J5LkFubm90YXRpb24sIElzc3VlU2V2ZXJpdHkuTG93LCBJc3N1ZVR5cGUuTUFMRk9STUVEX0RBVEFGSUVMRF9GT1JfSUJOLkRFVEVSTUlOSU5HKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb25zdCBtTmF2aWdhdGlvblBhcmFtZXRlcnM6IGFueSA9IHt9O1xuXHRcdFx0XHRpZiAoZGF0YUZpZWxkLk1hcHBpbmcpIHtcblx0XHRcdFx0XHRtTmF2aWdhdGlvblBhcmFtZXRlcnMuc2VtYW50aWNPYmplY3RNYXBwaW5nID0gZ2V0U2VtYW50aWNPYmplY3RNYXBwaW5nKGRhdGFGaWVsZC5NYXBwaW5nKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRhY3Rpb25zLnB1c2goe1xuXHRcdFx0XHRcdHR5cGU6IEFjdGlvblR5cGUuRGF0YUZpZWxkRm9ySW50ZW50QmFzZWROYXZpZ2F0aW9uLFxuXHRcdFx0XHRcdGlkOiBGb3JtSUQoeyBGYWNldDogZmFjZXREZWZpbml0aW9uIH0sIGRhdGFGaWVsZCksXG5cdFx0XHRcdFx0a2V5OiBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGRhdGFGaWVsZCksXG5cdFx0XHRcdFx0dGV4dDogZGF0YUZpZWxkLkxhYmVsPy50b1N0cmluZygpLFxuXHRcdFx0XHRcdGFubm90YXRpb25QYXRoOiBcIlwiLFxuXHRcdFx0XHRcdGVuYWJsZWQ6XG5cdFx0XHRcdFx0XHRkYXRhRmllbGQuTmF2aWdhdGlvbkF2YWlsYWJsZSAhPT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0XHRcdD8gY29tcGlsZUJpbmRpbmcoZXF1YWwoYW5ub3RhdGlvbkV4cHJlc3Npb24oZGF0YUZpZWxkLk5hdmlnYXRpb25BdmFpbGFibGU/LnZhbHVlT2YoKSksIHRydWUpKVxuXHRcdFx0XHRcdFx0XHQ6IHRydWUsXG5cdFx0XHRcdFx0dmlzaWJsZTogY29tcGlsZUJpbmRpbmcobm90KGVxdWFsKGFubm90YXRpb25FeHByZXNzaW9uKGRhdGFGaWVsZC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbj8udmFsdWVPZigpKSwgdHJ1ZSkpKSxcblx0XHRcdFx0XHRidXR0b25UeXBlOiBnZXRCdXR0b25UeXBlKFVJQW5ub3RhdGlvbj8uRW1waGFzaXplZCksXG5cdFx0XHRcdFx0cHJlc3M6IGNvbXBpbGVCaW5kaW5nKFxuXHRcdFx0XHRcdFx0Zm4oXCIuX2ludGVudEJhc2VkTmF2aWdhdGlvbi5uYXZpZ2F0ZVwiLCBbXG5cdFx0XHRcdFx0XHRcdGFubm90YXRpb25FeHByZXNzaW9uKGRhdGFGaWVsZC5TZW1hbnRpY09iamVjdCksXG5cdFx0XHRcdFx0XHRcdGFubm90YXRpb25FeHByZXNzaW9uKGRhdGFGaWVsZC5BY3Rpb24pLFxuXHRcdFx0XHRcdFx0XHRtTmF2aWdhdGlvblBhcmFtZXRlcnNcblx0XHRcdFx0XHRcdF0pXG5cdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRjdXN0b21EYXRhOiBjb21waWxlQmluZGluZyh7XG5cdFx0XHRcdFx0XHRzZW1hbnRpY09iamVjdDogYW5ub3RhdGlvbkV4cHJlc3Npb24oZGF0YUZpZWxkLlNlbWFudGljT2JqZWN0KSxcblx0XHRcdFx0XHRcdGFjdGlvbjogYW5ub3RhdGlvbkV4cHJlc3Npb24oZGF0YUZpZWxkLkFjdGlvbilcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZEZvckFjdGlvbjpcblx0XHRcdFx0Y29uc3QgZm9ybU1hbmlmZXN0QWN0aW9uc0NvbmZpZ3VyYXRpb246IGFueSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RDb250cm9sQ29uZmlndXJhdGlvbihyZWZlcmVuY2VUYXJnZXQpLmFjdGlvbnM7XG5cdFx0XHRcdGNvbnN0IGtleTogc3RyaW5nID0gS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChkYXRhRmllbGQpO1xuXHRcdFx0XHRhY3Rpb25zLnB1c2goe1xuXHRcdFx0XHRcdHR5cGU6IEFjdGlvblR5cGUuRGF0YUZpZWxkRm9yQWN0aW9uLFxuXHRcdFx0XHRcdGlkOiBGb3JtSUQoeyBGYWNldDogZmFjZXREZWZpbml0aW9uIH0sIGRhdGFGaWVsZCksXG5cdFx0XHRcdFx0a2V5OiBrZXksXG5cdFx0XHRcdFx0dGV4dDogZGF0YUZpZWxkLkxhYmVsPy50b1N0cmluZygpLFxuXHRcdFx0XHRcdGFubm90YXRpb25QYXRoOiBcIlwiLFxuXHRcdFx0XHRcdGVuYWJsZWQ6IGdldEVuYWJsZWRGb3JBbm5vdGF0aW9uQWN0aW9uKGNvbnZlcnRlckNvbnRleHQsIGRhdGFGaWVsZC5BY3Rpb25UYXJnZXQpLFxuXHRcdFx0XHRcdGJpbmRpbmc6IG5hdmlnYXRpb25Qcm9wZXJ0eVBhdGggPyBcInsgJ3BhdGgnIDogJ1wiICsgbmF2aWdhdGlvblByb3BlcnR5UGF0aCArIFwiJ31cIiA6IHVuZGVmaW5lZCxcblx0XHRcdFx0XHR2aXNpYmxlOiBjb21waWxlQmluZGluZyhub3QoZXF1YWwoYW5ub3RhdGlvbkV4cHJlc3Npb24oZGF0YUZpZWxkLmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkpLCB0cnVlKSkpLFxuXHRcdFx0XHRcdHJlcXVpcmVzRGlhbG9nOiBpc0RpYWxvZyhkYXRhRmllbGQuQWN0aW9uVGFyZ2V0KSxcblx0XHRcdFx0XHRidXR0b25UeXBlOiBnZXRCdXR0b25UeXBlKFVJQW5ub3RhdGlvbj8uRW1waGFzaXplZCksXG5cdFx0XHRcdFx0cHJlc3M6IGNvbXBpbGVCaW5kaW5nKFxuXHRcdFx0XHRcdFx0Zm4oXG5cdFx0XHRcdFx0XHRcdFwiaW52b2tlQWN0aW9uXCIsXG5cdFx0XHRcdFx0XHRcdFtcblx0XHRcdFx0XHRcdFx0XHRkYXRhRmllbGQuQWN0aW9uLFxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnRleHRzOiBmbihcImdldEJpbmRpbmdDb250ZXh0XCIsIFtdLCBiaW5kaW5nRXhwcmVzc2lvbihcIlwiLCBcIiRzb3VyY2VcIikpLFxuXHRcdFx0XHRcdFx0XHRcdFx0aW52b2NhdGlvbkdyb3VwaW5nOiAoZGF0YUZpZWxkLkludm9jYXRpb25Hcm91cGluZyA9PT0gXCJVSS5PcGVyYXRpb25Hcm91cGluZ1R5cGUvQ2hhbmdlU2V0XCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PyBcIkNoYW5nZVNldFwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDogXCJJc29sYXRlZFwiKSBhcyBPcGVyYXRpb25Hcm91cGluZ1R5cGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRsYWJlbDogYW5ub3RhdGlvbkV4cHJlc3Npb24oZGF0YUZpZWxkLkxhYmVsKSxcblx0XHRcdFx0XHRcdFx0XHRcdG1vZGVsOiBmbihcImdldE1vZGVsXCIsIFtdLCBiaW5kaW5nRXhwcmVzc2lvbihcIi9cIiwgXCIkc291cmNlXCIpKSxcblx0XHRcdFx0XHRcdFx0XHRcdGlzTmF2aWdhYmxlOiBpc0FjdGlvbk5hdmlnYWJsZShcblx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9ybU1hbmlmZXN0QWN0aW9uc0NvbmZpZ3VyYXRpb24gJiYgZm9ybU1hbmlmZXN0QWN0aW9uc0NvbmZpZ3VyYXRpb25ba2V5XVxuXHRcdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XSxcblx0XHRcdFx0XHRcdFx0cmVmKFwiLmVkaXRGbG93XCIpXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRmYWNldE5hbWU6IGRhdGFGaWVsZC5JbmxpbmUgPyAoZmFjZXREZWZpbml0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZSBhcyBzdHJpbmcpIDogdW5kZWZpbmVkXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdFx0cmV0dXJuIGFjdGlvbnM7XG5cdH0sIGFjdGlvbnMpO1xuXHRyZXR1cm4gaW5zZXJ0Q3VzdG9tRWxlbWVudHMoYWN0aW9ucywgbWFuaWZlc3RBY3Rpb25zKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGlhbG9nKGFjdGlvbkRlZmluaXRpb246IGFueSB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG5cdGlmIChhY3Rpb25EZWZpbml0aW9uKSB7XG5cdFx0Y29uc3QgYkNyaXRpY2FsID0gYWN0aW9uRGVmaW5pdGlvbi5hbm5vdGF0aW9ucz8uQ29tbW9uPy5Jc0FjdGlvbkNyaXRpY2FsO1xuXHRcdGlmIChhY3Rpb25EZWZpbml0aW9uLnBhcmFtZXRlcnMubGVuZ3RoID4gMSB8fCBiQ3JpdGljYWwpIHtcblx0XHRcdHJldHVybiBcIkRpYWxvZ1wiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gXCJOb25lXCI7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBcIk5vbmVcIjtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ3VzdG9tU3ViU2VjdGlvbnMoXG5cdG1hbmlmZXN0U3ViU2VjdGlvbnM6IFJlY29yZDxzdHJpbmcsIE1hbmlmZXN0U3ViU2VjdGlvbj4sXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IFJlY29yZDxzdHJpbmcsIEN1c3RvbU9iamVjdFBhZ2VTdWJTZWN0aW9uPiB7XG5cdGNvbnN0IHN1YlNlY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21PYmplY3RQYWdlU3ViU2VjdGlvbj4gPSB7fTtcblx0T2JqZWN0LmtleXMobWFuaWZlc3RTdWJTZWN0aW9ucykuZm9yRWFjaChcblx0XHRzdWJTZWN0aW9uS2V5ID0+XG5cdFx0XHQoc3ViU2VjdGlvbnNbc3ViU2VjdGlvbktleV0gPSBjcmVhdGVDdXN0b21TdWJTZWN0aW9uKG1hbmlmZXN0U3ViU2VjdGlvbnNbc3ViU2VjdGlvbktleV0sIHN1YlNlY3Rpb25LZXksIGNvbnZlcnRlckNvbnRleHQpKVxuXHQpO1xuXHRyZXR1cm4gc3ViU2VjdGlvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDdXN0b21TdWJTZWN0aW9uKFxuXHRtYW5pZmVzdFN1YlNlY3Rpb246IE1hbmlmZXN0U3ViU2VjdGlvbixcblx0c3ViU2VjdGlvbktleTogc3RyaW5nLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBDdXN0b21PYmplY3RQYWdlU3ViU2VjdGlvbiB7XG5cdGNvbnN0IHNpZGVDb250ZW50OiBTaWRlQ29udGVudERlZiB8IHVuZGVmaW5lZCA9IG1hbmlmZXN0U3ViU2VjdGlvbi5zaWRlQ29udGVudFxuXHRcdD8ge1xuXHRcdFx0XHR0ZW1wbGF0ZTogbWFuaWZlc3RTdWJTZWN0aW9uLnNpZGVDb250ZW50LnRlbXBsYXRlLFxuXHRcdFx0XHRpZDogU2lkZUNvbnRlbnRJRChzdWJTZWN0aW9uS2V5KSxcblx0XHRcdFx0dmlzaWJsZTogZmFsc2UsXG5cdFx0XHRcdGVxdWFsU3BsaXQ6IG1hbmlmZXN0U3ViU2VjdGlvbi5zaWRlQ29udGVudC5lcXVhbFNwbGl0XG5cdFx0ICB9XG5cdFx0OiB1bmRlZmluZWQ7XG5cdGxldCBwb3NpdGlvbiA9IG1hbmlmZXN0U3ViU2VjdGlvbi5wb3NpdGlvbjtcblx0aWYgKCFwb3NpdGlvbikge1xuXHRcdHBvc2l0aW9uID0ge1xuXHRcdFx0cGxhY2VtZW50OiBQbGFjZW1lbnQuQWZ0ZXJcblx0XHR9O1xuXHR9XG5cdGNvbnN0IHN1YlNlY3Rpb25EZWZpbml0aW9uID0ge1xuXHRcdHR5cGU6IFN1YlNlY3Rpb25UeXBlLlVua25vd24sXG5cdFx0aWQ6IG1hbmlmZXN0U3ViU2VjdGlvbi5pZCB8fCBDdXN0b21TdWJTZWN0aW9uSUQoc3ViU2VjdGlvbktleSksXG5cdFx0YWN0aW9uczogZ2V0QWN0aW9uc0Zyb21NYW5pZmVzdChtYW5pZmVzdFN1YlNlY3Rpb24uYWN0aW9ucywgY29udmVydGVyQ29udGV4dCksXG5cdFx0a2V5OiBzdWJTZWN0aW9uS2V5LFxuXHRcdHRpdGxlOiBtYW5pZmVzdFN1YlNlY3Rpb24udGl0bGUsXG5cdFx0bGV2ZWw6IDEsXG5cdFx0cG9zaXRpb246IHBvc2l0aW9uLFxuXHRcdHZpc2libGU6IG1hbmlmZXN0U3ViU2VjdGlvbi52aXNpYmxlICE9PSB1bmRlZmluZWQgPyBtYW5pZmVzdFN1YlNlY3Rpb24udmlzaWJsZSA6IHRydWUsXG5cdFx0c2lkZUNvbnRlbnQ6IHNpZGVDb250ZW50XG5cdH07XG5cdGlmIChtYW5pZmVzdFN1YlNlY3Rpb24udGVtcGxhdGUgfHwgbWFuaWZlc3RTdWJTZWN0aW9uLm5hbWUpIHtcblx0XHRzdWJTZWN0aW9uRGVmaW5pdGlvbi50eXBlID0gU3ViU2VjdGlvblR5cGUuWE1MRnJhZ21lbnQ7XG5cdFx0KChzdWJTZWN0aW9uRGVmaW5pdGlvbiBhcyB1bmtub3duKSBhcyBYTUxGcmFnbWVudFN1YlNlY3Rpb24pLnRlbXBsYXRlID1cblx0XHRcdG1hbmlmZXN0U3ViU2VjdGlvbi50ZW1wbGF0ZSB8fCBtYW5pZmVzdFN1YlNlY3Rpb24ubmFtZSB8fCBcIlwiO1xuXHR9IGVsc2Uge1xuXHRcdHN1YlNlY3Rpb25EZWZpbml0aW9uLnR5cGUgPSBTdWJTZWN0aW9uVHlwZS5QbGFjZWhvbGRlcjtcblx0fVxuXHRyZXR1cm4gc3ViU2VjdGlvbkRlZmluaXRpb24gYXMgQ3VzdG9tT2JqZWN0UGFnZVN1YlNlY3Rpb247XG59XG5cbi8qKlxuICogRXZhbHVhdGUgaWYgdGhlIGNvbmRlbnNlZCBtb2RlIGNhbiBiZSBhcHBsaTNlZCBvbiB0aGUgdGFibGUuXG4gKlxuICogQHBhcmFtIGN1cnJlbnRGYWNldFxuICogQHBhcmFtIGZhY2V0c1RvQ3JlYXRlSW5TZWN0aW9uXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBgdHJ1ZWAgZm9yIGNvbXBsaWFudCwgZmFsc2Ugb3RoZXJ3aXNlXG4gKi9cbmZ1bmN0aW9uIGdldENvbmRlbnNlZFRhYmxlTGF5b3V0Q29tcGxpYW5jZShcblx0Y3VycmVudEZhY2V0OiBGYWNldFR5cGVzLFxuXHRmYWNldHNUb0NyZWF0ZUluU2VjdGlvbjogRmFjZXRUeXBlc1tdLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBib29sZWFuIHtcblx0Y29uc3QgbWFuaWZlc3RXcmFwcGVyID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKTtcblx0aWYgKG1hbmlmZXN0V3JhcHBlci51c2VJY29uVGFiQmFyKCkpIHtcblx0XHQvLyBJZiB0aGUgT1AgdXNlIHRoZSB0YWIgYmFzZWQgd2UgY2hlY2sgaWYgdGhlIGZhY2V0cyB0aGF0IHdpbGwgYmUgY3JlYXRlZCBmb3IgdGhpcyBzZWN0aW9uIGFyZSBhbGwgbm9uIHZpc2libGVcblx0XHRyZXR1cm4gaGFzTm9PdGhlclZpc2libGVUYWJsZUluVGFyZ2V0cyhjdXJyZW50RmFjZXQsIGZhY2V0c1RvQ3JlYXRlSW5TZWN0aW9uKTtcblx0fSBlbHNlIHtcblx0XHRjb25zdCBlbnRpdHlUeXBlID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCk7XG5cdFx0aWYgKGVudGl0eVR5cGUuYW5ub3RhdGlvbnM/LlVJPy5GYWNldHM/Lmxlbmd0aCAmJiBlbnRpdHlUeXBlLmFubm90YXRpb25zPy5VST8uRmFjZXRzPy5sZW5ndGggPiAxKSB7XG5cdFx0XHRyZXR1cm4gaGFzTm9PdGhlclZpc2libGVUYWJsZUluVGFyZ2V0cyhjdXJyZW50RmFjZXQsIGZhY2V0c1RvQ3JlYXRlSW5TZWN0aW9uKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGhhc05vT3RoZXJWaXNpYmxlVGFibGVJblRhcmdldHMoY3VycmVudEZhY2V0OiBGYWNldFR5cGVzLCBmYWNldHNUb0NyZWF0ZUluU2VjdGlvbjogRmFjZXRUeXBlc1tdKTogYm9vbGVhbiB7XG5cdHJldHVybiBmYWNldHNUb0NyZWF0ZUluU2VjdGlvbi5ldmVyeShmdW5jdGlvbihzdWJGYWNldCkge1xuXHRcdGlmIChzdWJGYWNldCAhPT0gY3VycmVudEZhY2V0KSB7XG5cdFx0XHRpZiAoc3ViRmFjZXQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZUZhY2V0KSB7XG5cdFx0XHRcdGNvbnN0IHJlZkZhY2V0ID0gc3ViRmFjZXQgYXMgUmVmZXJlbmNlRmFjZXRUeXBlcztcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHJlZkZhY2V0LlRhcmdldD8uJHRhcmdldD8udGVybSA9PT0gVUlBbm5vdGF0aW9uVGVybXMuTGluZUl0ZW0gfHxcblx0XHRcdFx0XHRyZWZGYWNldC5UYXJnZXQ/LiR0YXJnZXQ/LnRlcm0gPT09IFVJQW5ub3RhdGlvblRlcm1zLlByZXNlbnRhdGlvblZhcmlhbnQgfHxcblx0XHRcdFx0XHRyZWZGYWNldC5UYXJnZXQuJHRhcmdldD8udGVybSA9PT0gVUlBbm5vdGF0aW9uVGVybXMuU2VsZWN0aW9uUHJlc2VudGF0aW9uVmFyaWFudFxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVmRmFjZXQuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4gIT09IHVuZGVmaW5lZCA/IHJlZkZhY2V0LmFubm90YXRpb25zPy5VST8uSGlkZGVuIDogZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBzdWJDb2xsZWN0aW9uRmFjZXQgPSBzdWJGYWNldCBhcyBDb2xsZWN0aW9uRmFjZXRUeXBlcztcblx0XHRcdFx0cmV0dXJuIHN1YkNvbGxlY3Rpb25GYWNldC5GYWNldHMuZXZlcnkoZnVuY3Rpb24oZmFjZXQpIHtcblx0XHRcdFx0XHRjb25zdCBzdWJSZWZGYWNldCA9IGZhY2V0IGFzIFJlZmVyZW5jZUZhY2V0VHlwZXM7XG5cdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0c3ViUmVmRmFjZXQuVGFyZ2V0Py4kdGFyZ2V0Py50ZXJtID09PSBVSUFubm90YXRpb25UZXJtcy5MaW5lSXRlbSB8fFxuXHRcdFx0XHRcdFx0c3ViUmVmRmFjZXQuVGFyZ2V0Py4kdGFyZ2V0Py50ZXJtID09PSBVSUFubm90YXRpb25UZXJtcy5QcmVzZW50YXRpb25WYXJpYW50IHx8XG5cdFx0XHRcdFx0XHRzdWJSZWZGYWNldC5UYXJnZXQ/LiR0YXJnZXQ/LnRlcm0gPT09IFVJQW5ub3RhdGlvblRlcm1zLlNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnRcblx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdHJldHVybiBzdWJSZWZGYWNldC5hbm5vdGF0aW9ucz8uVUk/LkhpZGRlbiAhPT0gdW5kZWZpbmVkID8gc3ViUmVmRmFjZXQuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4gOiBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSk7XG59XG4iXX0=