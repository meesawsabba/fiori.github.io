/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["../ManifestSettings", "../controls/ObjectPage/SubSection", "../controls/ObjectPage/HeaderFacet", "../helpers/ID", "../helpers/ConfigurableObject", "sap/fe/core/converters/controls/Common/Action", "sap/fe/core/converters/objectPage/HeaderAndFooterAction", "../controls/ObjectPage/Avatar", "sap/fe/core/helpers/BindingExpression"], function (ManifestSettings, SubSection, HeaderFacet, ID, ConfigurableObject, Action, HeaderAndFooterAction, Avatar, BindingExpression) {
  "use strict";

  var _exports = {};
  var constant = BindingExpression.constant;
  var ifElse = BindingExpression.ifElse;
  var not = BindingExpression.not;
  var equal = BindingExpression.equal;
  var compileBinding = BindingExpression.compileBinding;
  var bindingExpression = BindingExpression.bindingExpression;
  var annotationExpression = BindingExpression.annotationExpression;
  var getAvatar = Avatar.getAvatar;
  var getHiddenHeaderActions = HeaderAndFooterAction.getHiddenHeaderActions;
  var getFooterDefaultActions = HeaderAndFooterAction.getFooterDefaultActions;
  var getHeaderDefaultActions = HeaderAndFooterAction.getHeaderDefaultActions;
  var removeDuplicateActions = Action.removeDuplicateActions;
  var getActionsFromManifest = Action.getActionsFromManifest;
  var Placement = ConfigurableObject.Placement;
  var insertCustomElements = ConfigurableObject.insertCustomElements;
  var SectionID = ID.SectionID;
  var EditableHeaderSectionID = ID.EditableHeaderSectionID;
  var CustomSectionID = ID.CustomSectionID;
  var getHeaderFacetsFromManifest = HeaderFacet.getHeaderFacetsFromManifest;
  var getHeaderFacetsFromAnnotations = HeaderFacet.getHeaderFacetsFromAnnotations;
  var createCustomHeaderFacetSubSections = SubSection.createCustomHeaderFacetSubSections;
  var createSubSections = SubSection.createSubSections;
  var createCustomSubSections = SubSection.createCustomSubSections;
  var TemplateType = ManifestSettings.TemplateType;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var getSectionKey = function (facetDefinition, fallback) {
    var _facetDefinition$ID, _facetDefinition$Labe;

    return ((_facetDefinition$ID = facetDefinition.ID) === null || _facetDefinition$ID === void 0 ? void 0 : _facetDefinition$ID.toString()) || ((_facetDefinition$Labe = facetDefinition.Label) === null || _facetDefinition$Labe === void 0 ? void 0 : _facetDefinition$Labe.toString()) || fallback;
  };
  /**
   * Creates a section that represents the editable header part; it is only visible in edit mode.
   *
   * @param converterContext The converter context
   * @param allHeaderFacets The converter context
   * @returns {ObjectPageSection} The section representing the editable header parts
   */


  function createEditableHeaderSection(converterContext, allHeaderFacets) {
    var _converterContext$get, _converterContext$get2;

    var editableHeaderSectionID = EditableHeaderSectionID();
    var headerFacets = (_converterContext$get = converterContext.getEntityType().annotations) === null || _converterContext$get === void 0 ? void 0 : (_converterContext$get2 = _converterContext$get.UI) === null || _converterContext$get2 === void 0 ? void 0 : _converterContext$get2.HeaderFacets;
    var headerfacetSubSections = headerFacets ? createSubSections(headerFacets, converterContext, true) : [];
    var customHeaderFacetSubSections = createCustomHeaderFacetSubSections(converterContext);
    var allHeaderFacetsSubSections = [];

    if (customHeaderFacetSubSections.length > 0) {
      // merge annotation based header facets and custom header facets in the right order
      var i = 0;
      allHeaderFacets.forEach(function (item) {
        // hidden header facets are not included in allHeaderFacets array => add them anyway
        while (headerfacetSubSections.length > i && headerfacetSubSections[i].visible === "false") {
          allHeaderFacetsSubSections.push(headerfacetSubSections[i]);
          i++;
        }

        if (headerfacetSubSections.length > i && (item.key === headerfacetSubSections[i].key || // for header facets with no id the keys of header facet and subsection are different => check only the last part
        item.key.slice(item.key.lastIndexOf("::") + 2) === headerfacetSubSections[i].key.slice(headerfacetSubSections[i].key.lastIndexOf("::") + 2))) {
          allHeaderFacetsSubSections.push(headerfacetSubSections[i]);
          i++;
        } else {
          customHeaderFacetSubSections.forEach(function (customItem) {
            if (item.key === customItem.key) {
              allHeaderFacetsSubSections.push(customItem);
            }
          });
        }
      });
    } else {
      allHeaderFacetsSubSections = headerfacetSubSections;
    }

    var headerSection = {
      id: editableHeaderSectionID,
      key: "EditableHeaderContent",
      title: "{sap.fe.i18n>T_COMMON_OBJECT_PAGE_HEADER_SECTION}",
      visible: "{= ${ui>/editMode} === 'Editable' }",
      subSections: allHeaderFacetsSubSections
    };
    return headerSection;
  }
  /**
   * Creates a definition for a section based on the Facet annotation.
   *
   * @param converterContext The converter context
   * @returns {ObjectPageSection[]} All sections
   */


  _exports.createEditableHeaderSection = createEditableHeaderSection;

  function getSectionsFromAnnotation(converterContext) {
    var _entityType$annotatio, _entityType$annotatio2, _entityType$annotatio3;

    var entityType = converterContext.getEntityType();
    var objectPageSections = ((_entityType$annotatio = entityType.annotations) === null || _entityType$annotatio === void 0 ? void 0 : (_entityType$annotatio2 = _entityType$annotatio.UI) === null || _entityType$annotatio2 === void 0 ? void 0 : (_entityType$annotatio3 = _entityType$annotatio2.Facets) === null || _entityType$annotatio3 === void 0 ? void 0 : _entityType$annotatio3.map(function (facetDefinition) {
      return getSectionFromAnnotation(facetDefinition, converterContext);
    })) || [];
    return objectPageSections;
  }
  /**
   * Create an annotation based section.
   *
   * @param facet
   * @param converterContext
   * @returns {ObjectPageSection} The current section
   */


  function getSectionFromAnnotation(facet, converterContext) {
    var _facet$annotations, _facet$annotations$UI, _facet$annotations$UI2;

    var sectionID = SectionID({
      Facet: facet
    });
    var section = {
      id: sectionID,
      key: getSectionKey(facet, sectionID),
      title: compileBinding(annotationExpression(facet.Label)),
      showTitle: !!facet.Label,
      visible: compileBinding(not(equal(annotationExpression((_facet$annotations = facet.annotations) === null || _facet$annotations === void 0 ? void 0 : (_facet$annotations$UI = _facet$annotations.UI) === null || _facet$annotations$UI === void 0 ? void 0 : (_facet$annotations$UI2 = _facet$annotations$UI.Hidden) === null || _facet$annotations$UI2 === void 0 ? void 0 : _facet$annotations$UI2.valueOf()), true))),
      subSections: createSubSections([facet], converterContext)
    };
    return section;
  }
  /**
   * Creates section definition based on manifest definition.
   * @param manifestSections The manifest defined sections
   * @param converterContext
   * @returns {Record<string, CustomObjectPageSection>} The manifest defined sections
   */


  function getSectionsFromManifest(manifestSections, converterContext) {
    var sections = {};
    Object.keys(manifestSections).forEach(function (manifestSectionKey) {
      sections[manifestSectionKey] = getSectionFromManifest(manifestSections[manifestSectionKey], manifestSectionKey, converterContext);
    });
    return sections;
  }
  /**
   * Create a manifest based custom section.
   * @param customSectionDefinition
   * @param sectionKey
   * @param converterContext
   * @returns {CustomObjectPageSection} The current custom section
   */


  function getSectionFromManifest(customSectionDefinition, sectionKey, converterContext) {
    var customSectionID = customSectionDefinition.id || CustomSectionID(sectionKey);
    var position = customSectionDefinition.position;

    if (!position) {
      position = {
        placement: Placement.After
      };
    }

    var manifestSubSections;

    if (!customSectionDefinition.subSections) {
      // If there is no subSection defined, we add the content of the custom section as subsections
      // and make sure to set the visibility to 'true', as the actual visibility is handled by the section itself
      manifestSubSections = _defineProperty({}, sectionKey, _objectSpread(_objectSpread({}, customSectionDefinition), {}, {
        position: undefined,
        visible: true
      }));
    } else {
      manifestSubSections = customSectionDefinition.subSections;
    }

    var subSections = createCustomSubSections(manifestSubSections, converterContext);
    var customSection = {
      id: customSectionID,
      key: sectionKey,
      title: customSectionDefinition.title,
      showTitle: !!customSectionDefinition.title,
      visible: customSectionDefinition.visible !== undefined ? customSectionDefinition.visible : true,
      position: position,
      subSections: subSections
    };
    return customSection;
  }
  /**
   * Retrieves the ObjectPage header actions (both the default ones and the custom ones defined in the manifest).
   *
   * @param {ConverterContext} converterContext The converter context
   * @returns An array containing all the actions for this ObjectPage header
   */


  var getHeaderActions = function (converterContext) {
    var aAnnotationHeaderActions = getHeaderDefaultActions(converterContext);
    var manifestWrapper = converterContext.getManifestWrapper();
    var headerActions = insertCustomElements(aAnnotationHeaderActions, getActionsFromManifest(manifestWrapper.getHeaderActions(), converterContext, aAnnotationHeaderActions, undefined, undefined, getHiddenHeaderActions(converterContext)), {
      isNavigable: "overwrite",
      enabled: "overwrite",
      defaultValuesExtensionFunction: "overwrite"
    });
    return removeDuplicateActions(headerActions);
  };
  /**
   * Retrieves the ObjectPage footer actions (both the default ones and the custom ones defined in the manifest).
   *
   * @param {ConverterContext} converterContext The converter context
   * @returns An array containing all the actions for this ObjectPage footer
   */


  _exports.getHeaderActions = getHeaderActions;

  var getFooterActions = function (converterContext) {
    var manifestWrapper = converterContext.getManifestWrapper();
    var aAnnotationFooterActions = getFooterDefaultActions(manifestWrapper.getViewLevel(), converterContext);
    var footerActions = insertCustomElements(aAnnotationFooterActions, getActionsFromManifest(manifestWrapper.getFooterActions(), converterContext, aAnnotationFooterActions), {
      isNavigable: "overwrite",
      enabled: "overwrite",
      defaultValuesExtensionFunction: "overwrite"
    });
    return footerActions;
  };
  /**
   * Retrieves and merges the ObjectPage sections defined in the annotation and in the manifest.
   *
   * @param {ConverterContext} converterContext The converter context
   * @returns An array of sections.
   */


  _exports.getFooterActions = getFooterActions;

  var getSections = function (converterContext) {
    var manifestWrapper = converterContext.getManifestWrapper();
    var sections = insertCustomElements(getSectionsFromAnnotation(converterContext), getSectionsFromManifest(manifestWrapper.getSections(), converterContext), {
      "title": "overwrite",
      "visible": "overwrite",
      "subSections": {
        "actions": "merge",
        "title": "overwrite",
        "sideContent": "overwrite"
      }
    }); // Level Adjustment for "Mixed" Collection Facets:
    // ==============================================
    // The manifest definition of custom side contents and actions still needs to be aligned for "Mixed" collection facets:
    // Collection facets containing tables gain an extra reference facet as a table wrapper to ensure, that the table is always
    // placed in an own individual Object Page Block; this additional hierarchy level is unknown to app developers, which are
    // defining the side content and actions in the manifest at collection facet level; now, since the sideContent always needs
    // to be assigned to a block, we need to move the sideContent of from a mixed collection facet to its first child reference facet.
    // ==============================================

    sections.forEach(function (section) {
      var _section$subSections;

      (_section$subSections = section.subSections) === null || _section$subSections === void 0 ? void 0 : _section$subSections.forEach(function (subSection) {
        if (subSection.type === "Mixed" && subSection.sideContent != undefined && subSection.content && subSection.content.length > 0) {
          // 1. Copy sideContent / actions to the SubSection's content
          // 2. Delete sideContent / actions at the (invalid) manifest level
          if (subSection.sideContent) {
            subSection.content[0].sideContent = subSection.sideContent;
            subSection.sideContent = undefined;
          }

          if (subSection.actions.length > 0) {
            subSection.content[0].actions = subSection.actions;
            subSection.actions = [];
          }
        }
      });
    });
    return sections;
  };
  /**
   * Determines if the ObjectPage has header content.
   *
   * @param converterContext The instance of the converter context
   * @returns {boolean} `true` if there is at least on header facet
   */


  _exports.getSections = getSections;

  function hasHeaderContent(converterContext) {
    var _converterContext$get3, _converterContext$get4;

    var manifestWrapper = converterContext.getManifestWrapper();
    return (((_converterContext$get3 = converterContext.getEntityType().annotations) === null || _converterContext$get3 === void 0 ? void 0 : (_converterContext$get4 = _converterContext$get3.UI) === null || _converterContext$get4 === void 0 ? void 0 : _converterContext$get4.HeaderFacets) || []).length > 0 || Object.keys(manifestWrapper.getHeaderFacets()).length > 0;
  }
  /**
   * Gets the expression to evaluate the visibility of the header content.
   *
   * @param converterContext The instance of the converter context
   * @returns {BindingExpression<boolean>} The binding expression for the Delete button
   */


  function getShowHeaderContentExpression(converterContext) {
    var manifestWrapper = converterContext.getManifestWrapper();
    return ifElse(!hasHeaderContent(converterContext), constant(false), ifElse(equal(manifestWrapper.isHeaderEditable(), false), constant(true), not(equal(bindingExpression("/editMode", "ui"), "Editable"))));
  }
  /**
   * Gets the binding expression to evaluate the visibility of the header content.
   *
   * @param converterContext The instance of the converter context
   * @returns {BindingExpression<boolean>} The binding expression for the Delete button
   */


  var getShowHeaderContent = function (converterContext) {
    return compileBinding(getShowHeaderContentExpression(converterContext));
  };
  /**
   * Gets the binding expression to evaluate the visibility of the avatar when the header is in expanded state.
   *
   * @param converterContext The instance of the converter context
   * @returns {BindingExpression<string>} The binding expression for the Delete button
   */


  _exports.getShowHeaderContent = getShowHeaderContent;

  var getExpandedImageVisible = function (converterContext) {
    return compileBinding(not(getShowHeaderContentExpression(converterContext)));
  };

  _exports.getExpandedImageVisible = getExpandedImageVisible;

  var convertPage = function (converterContext) {
    var _entityType$annotatio4, _entityType$annotatio5;

    var manifestWrapper = converterContext.getManifestWrapper();
    var headerSection;
    var entityType = converterContext.getEntityType(); // Retrieve all header facets (from annotations & custom)

    var headerFacets = insertCustomElements(getHeaderFacetsFromAnnotations(converterContext), getHeaderFacetsFromManifest(manifestWrapper.getHeaderFacets())); // Retrieve the page header actions

    var headerActions = getHeaderActions(converterContext); // Retrieve the page footer actions

    var footerActions = getFooterActions(converterContext);

    if (manifestWrapper.isHeaderEditable() && ((_entityType$annotatio4 = entityType.annotations.UI) !== null && _entityType$annotatio4 !== void 0 && _entityType$annotatio4.HeaderFacets || (_entityType$annotatio5 = entityType.annotations.UI) !== null && _entityType$annotatio5 !== void 0 && _entityType$annotatio5.HeaderInfo)) {
      headerSection = createEditableHeaderSection(converterContext, headerFacets);
    }

    var sections = getSections(converterContext);
    return {
      template: TemplateType.ObjectPage,
      header: {
        visible: manifestWrapper.getShowObjectPageHeader(),
        section: headerSection,
        facets: headerFacets,
        actions: headerActions,
        showContent: getShowHeaderContent(converterContext),
        hasContent: hasHeaderContent(converterContext),
        avatar: getAvatar(converterContext),
        title: {
          expandedImageVisible: getExpandedImageVisible(converterContext)
        }
      },
      sections: sections,
      footerActions: footerActions,
      showAnchorBar: manifestWrapper.getShowAnchorBar(),
      useIconTabBar: manifestWrapper.useIconTabBar()
    };
  };

  _exports.convertPage = convertPage;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9iamVjdFBhZ2VDb252ZXJ0ZXIudHMiXSwibmFtZXMiOlsiZ2V0U2VjdGlvbktleSIsImZhY2V0RGVmaW5pdGlvbiIsImZhbGxiYWNrIiwiSUQiLCJ0b1N0cmluZyIsIkxhYmVsIiwiY3JlYXRlRWRpdGFibGVIZWFkZXJTZWN0aW9uIiwiY29udmVydGVyQ29udGV4dCIsImFsbEhlYWRlckZhY2V0cyIsImVkaXRhYmxlSGVhZGVyU2VjdGlvbklEIiwiRWRpdGFibGVIZWFkZXJTZWN0aW9uSUQiLCJoZWFkZXJGYWNldHMiLCJnZXRFbnRpdHlUeXBlIiwiYW5ub3RhdGlvbnMiLCJVSSIsIkhlYWRlckZhY2V0cyIsImhlYWRlcmZhY2V0U3ViU2VjdGlvbnMiLCJjcmVhdGVTdWJTZWN0aW9ucyIsImN1c3RvbUhlYWRlckZhY2V0U3ViU2VjdGlvbnMiLCJjcmVhdGVDdXN0b21IZWFkZXJGYWNldFN1YlNlY3Rpb25zIiwiYWxsSGVhZGVyRmFjZXRzU3ViU2VjdGlvbnMiLCJsZW5ndGgiLCJpIiwiZm9yRWFjaCIsIml0ZW0iLCJ2aXNpYmxlIiwicHVzaCIsImtleSIsInNsaWNlIiwibGFzdEluZGV4T2YiLCJjdXN0b21JdGVtIiwiaGVhZGVyU2VjdGlvbiIsImlkIiwidGl0bGUiLCJzdWJTZWN0aW9ucyIsImdldFNlY3Rpb25zRnJvbUFubm90YXRpb24iLCJlbnRpdHlUeXBlIiwib2JqZWN0UGFnZVNlY3Rpb25zIiwiRmFjZXRzIiwibWFwIiwiZ2V0U2VjdGlvbkZyb21Bbm5vdGF0aW9uIiwiZmFjZXQiLCJzZWN0aW9uSUQiLCJTZWN0aW9uSUQiLCJGYWNldCIsInNlY3Rpb24iLCJjb21waWxlQmluZGluZyIsImFubm90YXRpb25FeHByZXNzaW9uIiwic2hvd1RpdGxlIiwibm90IiwiZXF1YWwiLCJIaWRkZW4iLCJ2YWx1ZU9mIiwiZ2V0U2VjdGlvbnNGcm9tTWFuaWZlc3QiLCJtYW5pZmVzdFNlY3Rpb25zIiwic2VjdGlvbnMiLCJPYmplY3QiLCJrZXlzIiwibWFuaWZlc3RTZWN0aW9uS2V5IiwiZ2V0U2VjdGlvbkZyb21NYW5pZmVzdCIsImN1c3RvbVNlY3Rpb25EZWZpbml0aW9uIiwic2VjdGlvbktleSIsImN1c3RvbVNlY3Rpb25JRCIsIkN1c3RvbVNlY3Rpb25JRCIsInBvc2l0aW9uIiwicGxhY2VtZW50IiwiUGxhY2VtZW50IiwiQWZ0ZXIiLCJtYW5pZmVzdFN1YlNlY3Rpb25zIiwidW5kZWZpbmVkIiwiY3JlYXRlQ3VzdG9tU3ViU2VjdGlvbnMiLCJjdXN0b21TZWN0aW9uIiwiZ2V0SGVhZGVyQWN0aW9ucyIsImFBbm5vdGF0aW9uSGVhZGVyQWN0aW9ucyIsImdldEhlYWRlckRlZmF1bHRBY3Rpb25zIiwibWFuaWZlc3RXcmFwcGVyIiwiZ2V0TWFuaWZlc3RXcmFwcGVyIiwiaGVhZGVyQWN0aW9ucyIsImluc2VydEN1c3RvbUVsZW1lbnRzIiwiZ2V0QWN0aW9uc0Zyb21NYW5pZmVzdCIsImdldEhpZGRlbkhlYWRlckFjdGlvbnMiLCJpc05hdmlnYWJsZSIsImVuYWJsZWQiLCJkZWZhdWx0VmFsdWVzRXh0ZW5zaW9uRnVuY3Rpb24iLCJyZW1vdmVEdXBsaWNhdGVBY3Rpb25zIiwiZ2V0Rm9vdGVyQWN0aW9ucyIsImFBbm5vdGF0aW9uRm9vdGVyQWN0aW9ucyIsImdldEZvb3RlckRlZmF1bHRBY3Rpb25zIiwiZ2V0Vmlld0xldmVsIiwiZm9vdGVyQWN0aW9ucyIsImdldFNlY3Rpb25zIiwic3ViU2VjdGlvbiIsInR5cGUiLCJzaWRlQ29udGVudCIsImNvbnRlbnQiLCJhY3Rpb25zIiwiaGFzSGVhZGVyQ29udGVudCIsImdldEhlYWRlckZhY2V0cyIsImdldFNob3dIZWFkZXJDb250ZW50RXhwcmVzc2lvbiIsImlmRWxzZSIsImNvbnN0YW50IiwiaXNIZWFkZXJFZGl0YWJsZSIsImJpbmRpbmdFeHByZXNzaW9uIiwiZ2V0U2hvd0hlYWRlckNvbnRlbnQiLCJnZXRFeHBhbmRlZEltYWdlVmlzaWJsZSIsImNvbnZlcnRQYWdlIiwiZ2V0SGVhZGVyRmFjZXRzRnJvbUFubm90YXRpb25zIiwiZ2V0SGVhZGVyRmFjZXRzRnJvbU1hbmlmZXN0IiwiSGVhZGVySW5mbyIsInRlbXBsYXRlIiwiVGVtcGxhdGVUeXBlIiwiT2JqZWN0UGFnZSIsImhlYWRlciIsImdldFNob3dPYmplY3RQYWdlSGVhZGVyIiwiZmFjZXRzIiwic2hvd0NvbnRlbnQiLCJoYXNDb250ZW50IiwiYXZhdGFyIiwiZ2V0QXZhdGFyIiwiZXhwYW5kZWRJbWFnZVZpc2libGUiLCJzaG93QW5jaG9yQmFyIiwiZ2V0U2hvd0FuY2hvckJhciIsInVzZUljb25UYWJCYXIiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFEQSxNQUFNQSxhQUFhLEdBQUcsVUFBQ0MsZUFBRCxFQUE4QkMsUUFBOUIsRUFBMkQ7QUFBQTs7QUFDaEYsV0FBTyx3QkFBQUQsZUFBZSxDQUFDRSxFQUFoQiw0RUFBb0JDLFFBQXBCLGlDQUFrQ0gsZUFBZSxDQUFDSSxLQUFsRCwwREFBa0Msc0JBQXVCRCxRQUF2QixFQUFsQyxLQUF1RUYsUUFBOUU7QUFDQSxHQUZEO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFdBQVNJLDJCQUFULENBQ05DLGdCQURNLEVBRU5DLGVBRk0sRUFHYztBQUFBOztBQUNwQixRQUFNQyx1QkFBdUIsR0FBR0MsdUJBQXVCLEVBQXZEO0FBQ0EsUUFBTUMsWUFBWSw0QkFBR0osZ0JBQWdCLENBQUNLLGFBQWpCLEdBQWlDQyxXQUFwQyxvRkFBRyxzQkFBOENDLEVBQWpELDJEQUFHLHVCQUFrREMsWUFBdkU7QUFDQSxRQUFNQyxzQkFBc0IsR0FBR0wsWUFBWSxHQUFHTSxpQkFBaUIsQ0FBQ04sWUFBRCxFQUFlSixnQkFBZixFQUFpQyxJQUFqQyxDQUFwQixHQUE2RCxFQUF4RztBQUNBLFFBQU1XLDRCQUE0QixHQUFHQyxrQ0FBa0MsQ0FBQ1osZ0JBQUQsQ0FBdkU7QUFDQSxRQUFJYSwwQkFBa0QsR0FBRyxFQUF6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eXBlcyB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHsgTWFuaWZlc3RTZWN0aW9uLCBNYW5pZmVzdFN1YlNlY3Rpb24sIFRlbXBsYXRlVHlwZSB9IGZyb20gXCIuLi9NYW5pZmVzdFNldHRpbmdzXCI7XG5pbXBvcnQgeyBQYWdlRGVmaW5pdGlvbiB9IGZyb20gXCIuLi9UZW1wbGF0ZUNvbnZlcnRlclwiO1xuaW1wb3J0IHsgRW50aXR5VHlwZSB9IGZyb20gXCJAc2FwLXV4L2Fubm90YXRpb24tY29udmVydGVyXCI7XG5pbXBvcnQge1xuXHRjcmVhdGVDdXN0b21TdWJTZWN0aW9ucyxcblx0Y3JlYXRlU3ViU2VjdGlvbnMsXG5cdGNyZWF0ZUN1c3RvbUhlYWRlckZhY2V0U3ViU2VjdGlvbnMsXG5cdEN1c3RvbU9iamVjdFBhZ2VTZWN0aW9uLFxuXHRPYmplY3RQYWdlU2VjdGlvbixcblx0T2JqZWN0UGFnZVN1YlNlY3Rpb24sXG5cdEZvcm1TdWJTZWN0aW9uXG59IGZyb20gXCIuLi9jb250cm9scy9PYmplY3RQYWdlL1N1YlNlY3Rpb25cIjtcbmltcG9ydCB7IGdldEhlYWRlckZhY2V0c0Zyb21Bbm5vdGF0aW9ucywgZ2V0SGVhZGVyRmFjZXRzRnJvbU1hbmlmZXN0LCBPYmplY3RQYWdlSGVhZGVyRmFjZXQgfSBmcm9tIFwiLi4vY29udHJvbHMvT2JqZWN0UGFnZS9IZWFkZXJGYWNldFwiO1xuaW1wb3J0IHsgQ3VzdG9tU2VjdGlvbklELCBFZGl0YWJsZUhlYWRlclNlY3Rpb25JRCwgU2VjdGlvbklEIH0gZnJvbSBcIi4uL2hlbHBlcnMvSURcIjtcbmltcG9ydCB7IENvbmZpZ3VyYWJsZVJlY29yZCwgaW5zZXJ0Q3VzdG9tRWxlbWVudHMsIFBsYWNlbWVudCwgUG9zaXRpb24gfSBmcm9tIFwiLi4vaGVscGVycy9Db25maWd1cmFibGVPYmplY3RcIjtcbmltcG9ydCB7IEJhc2VBY3Rpb24sIGdldEFjdGlvbnNGcm9tTWFuaWZlc3QsIHJlbW92ZUR1cGxpY2F0ZUFjdGlvbnMgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9jb250cm9scy9Db21tb24vQWN0aW9uXCI7XG5pbXBvcnQge1xuXHRnZXRIZWFkZXJEZWZhdWx0QWN0aW9ucyxcblx0Z2V0Rm9vdGVyRGVmYXVsdEFjdGlvbnMsXG5cdGdldEhpZGRlbkhlYWRlckFjdGlvbnNcbn0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvb2JqZWN0UGFnZS9IZWFkZXJBbmRGb290ZXJBY3Rpb25cIjtcbmltcG9ydCB7IEF2YXRhciwgZ2V0QXZhdGFyIH0gZnJvbSBcIi4uL2NvbnRyb2xzL09iamVjdFBhZ2UvQXZhdGFyXCI7XG5pbXBvcnQge1xuXHRhbm5vdGF0aW9uRXhwcmVzc2lvbixcblx0YmluZGluZ0V4cHJlc3Npb24sXG5cdGNvbXBpbGVCaW5kaW5nLFxuXHRlcXVhbCxcblx0bm90LFxuXHRpZkVsc2UsXG5cdGNvbnN0YW50LFxuXHRCaW5kaW5nRXhwcmVzc2lvbixcblx0RXhwcmVzc2lvblxufSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nRXhwcmVzc2lvblwiO1xuaW1wb3J0IENvbnZlcnRlckNvbnRleHQgZnJvbSBcIi4uL0NvbnZlcnRlckNvbnRleHRcIjtcblxuZXhwb3J0IHR5cGUgT2JqZWN0UGFnZURlZmluaXRpb24gPSBQYWdlRGVmaW5pdGlvbiAmIHtcblx0aGVhZGVyOiB7XG5cdFx0dmlzaWJsZTogYm9vbGVhbjtcblx0XHRzZWN0aW9uPzogT2JqZWN0UGFnZVNlY3Rpb247XG5cdFx0ZmFjZXRzOiBPYmplY3RQYWdlSGVhZGVyRmFjZXRbXTtcblx0XHRhY3Rpb25zOiBCYXNlQWN0aW9uW107XG5cdFx0c2hvd0NvbnRlbnQ6IEJpbmRpbmdFeHByZXNzaW9uPGJvb2xlYW4+O1xuXHRcdGhhc0NvbnRlbnQ6IGJvb2xlYW47XG5cdFx0YXZhdGFyPzogQXZhdGFyO1xuXHRcdHRpdGxlOiB7XG5cdFx0XHRleHBhbmRlZEltYWdlVmlzaWJsZTogQmluZGluZ0V4cHJlc3Npb248c3RyaW5nPjtcblx0XHR9O1xuXHR9O1xuXHRzZWN0aW9uczogT2JqZWN0UGFnZVNlY3Rpb25bXTtcblx0Zm9vdGVyQWN0aW9uczogQmFzZUFjdGlvbltdO1xuXHRzaG93QW5jaG9yQmFyOiBib29sZWFuO1xuXHR1c2VJY29uVGFiQmFyOiBib29sZWFuO1xufTtcblxuY29uc3QgZ2V0U2VjdGlvbktleSA9IChmYWNldERlZmluaXRpb246IEZhY2V0VHlwZXMsIGZhbGxiYWNrOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuXHRyZXR1cm4gZmFjZXREZWZpbml0aW9uLklEPy50b1N0cmluZygpIHx8IGZhY2V0RGVmaW5pdGlvbi5MYWJlbD8udG9TdHJpbmcoKSB8fCBmYWxsYmFjaztcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIHNlY3Rpb24gdGhhdCByZXByZXNlbnRzIHRoZSBlZGl0YWJsZSBoZWFkZXIgcGFydDsgaXQgaXMgb25seSB2aXNpYmxlIGluIGVkaXQgbW9kZS5cbiAqXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dCBUaGUgY29udmVydGVyIGNvbnRleHRcbiAqIEBwYXJhbSBhbGxIZWFkZXJGYWNldHMgVGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcmV0dXJucyB7T2JqZWN0UGFnZVNlY3Rpb259IFRoZSBzZWN0aW9uIHJlcHJlc2VudGluZyB0aGUgZWRpdGFibGUgaGVhZGVyIHBhcnRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFZGl0YWJsZUhlYWRlclNlY3Rpb24oXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGFsbEhlYWRlckZhY2V0czogT2JqZWN0UGFnZUhlYWRlckZhY2V0W11cbik6IE9iamVjdFBhZ2VTZWN0aW9uIHtcblx0Y29uc3QgZWRpdGFibGVIZWFkZXJTZWN0aW9uSUQgPSBFZGl0YWJsZUhlYWRlclNlY3Rpb25JRCgpO1xuXHRjb25zdCBoZWFkZXJGYWNldHMgPSBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVR5cGUoKS5hbm5vdGF0aW9ucz8uVUk/LkhlYWRlckZhY2V0cztcblx0Y29uc3QgaGVhZGVyZmFjZXRTdWJTZWN0aW9ucyA9IGhlYWRlckZhY2V0cyA/IGNyZWF0ZVN1YlNlY3Rpb25zKGhlYWRlckZhY2V0cywgY29udmVydGVyQ29udGV4dCwgdHJ1ZSkgOiBbXTtcblx0Y29uc3QgY3VzdG9tSGVhZGVyRmFjZXRTdWJTZWN0aW9ucyA9IGNyZWF0ZUN1c3RvbUhlYWRlckZhY2V0U3ViU2VjdGlvbnMoY29udmVydGVyQ29udGV4dCk7XG5cdGxldCBhbGxIZWFkZXJGYWNldHNTdWJTZWN0aW9uczogT2JqZWN0UGFnZVN1YlNlY3Rpb25bXSA9IFtdO1xuXHRpZiAoY3VzdG9tSGVhZGVyRmFjZXRTdWJTZWN0aW9ucy5sZW5ndGggPiAwKSB7XG5cdFx0Ly8gbWVyZ2UgYW5ub3RhdGlvbiBiYXNlZCBoZWFkZXIgZmFjZXRzIGFuZCBjdXN0b20gaGVhZGVyIGZhY2V0cyBpbiB0aGUgcmlnaHQgb3JkZXJcblx0XHRsZXQgaSA9IDA7XG5cdFx0YWxsSGVhZGVyRmFjZXRzLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0Ly8gaGlkZGVuIGhlYWRlciBmYWNldHMgYXJlIG5vdCBpbmNsdWRlZCBpbiBhbGxIZWFkZXJGYWNldHMgYXJyYXkgPT4gYWRkIHRoZW0gYW55d2F5XG5cdFx0XHR3aGlsZSAoaGVhZGVyZmFjZXRTdWJTZWN0aW9ucy5sZW5ndGggPiBpICYmIGhlYWRlcmZhY2V0U3ViU2VjdGlvbnNbaV0udmlzaWJsZSA9PT0gXCJmYWxzZVwiKSB7XG5cdFx0XHRcdGFsbEhlYWRlckZhY2V0c1N1YlNlY3Rpb25zLnB1c2goaGVhZGVyZmFjZXRTdWJTZWN0aW9uc1tpXSk7XG5cdFx0XHRcdGkrKztcblx0XHRcdH1cblx0XHRcdGlmIChcblx0XHRcdFx0aGVhZGVyZmFjZXRTdWJTZWN0aW9ucy5sZW5ndGggPiBpICYmXG5cdFx0XHRcdChpdGVtLmtleSA9PT0gaGVhZGVyZmFjZXRTdWJTZWN0aW9uc1tpXS5rZXkgfHxcblx0XHRcdFx0XHQvLyBmb3IgaGVhZGVyIGZhY2V0cyB3aXRoIG5vIGlkIHRoZSBrZXlzIG9mIGhlYWRlciBmYWNldCBhbmQgc3Vic2VjdGlvbiBhcmUgZGlmZmVyZW50ID0+IGNoZWNrIG9ubHkgdGhlIGxhc3QgcGFydFxuXHRcdFx0XHRcdGl0ZW0ua2V5LnNsaWNlKGl0ZW0ua2V5Lmxhc3RJbmRleE9mKFwiOjpcIikgKyAyKSA9PT1cblx0XHRcdFx0XHRcdGhlYWRlcmZhY2V0U3ViU2VjdGlvbnNbaV0ua2V5LnNsaWNlKGhlYWRlcmZhY2V0U3ViU2VjdGlvbnNbaV0ua2V5Lmxhc3RJbmRleE9mKFwiOjpcIikgKyAyKSlcblx0XHRcdCkge1xuXHRcdFx0XHRhbGxIZWFkZXJGYWNldHNTdWJTZWN0aW9ucy5wdXNoKGhlYWRlcmZhY2V0U3ViU2VjdGlvbnNbaV0pO1xuXHRcdFx0XHRpKys7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjdXN0b21IZWFkZXJGYWNldFN1YlNlY3Rpb25zLmZvckVhY2goZnVuY3Rpb24oY3VzdG9tSXRlbSkge1xuXHRcdFx0XHRcdGlmIChpdGVtLmtleSA9PT0gY3VzdG9tSXRlbS5rZXkpIHtcblx0XHRcdFx0XHRcdGFsbEhlYWRlckZhY2V0c1N1YlNlY3Rpb25zLnB1c2goY3VzdG9tSXRlbSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRhbGxIZWFkZXJGYWNldHNTdWJTZWN0aW9ucyA9IGhlYWRlcmZhY2V0U3ViU2VjdGlvbnM7XG5cdH1cblx0Y29uc3QgaGVhZGVyU2VjdGlvbjogT2JqZWN0UGFnZVNlY3Rpb24gPSB7XG5cdFx0aWQ6IGVkaXRhYmxlSGVhZGVyU2VjdGlvbklELFxuXHRcdGtleTogXCJFZGl0YWJsZUhlYWRlckNvbnRlbnRcIixcblx0XHR0aXRsZTogXCJ7c2FwLmZlLmkxOG4+VF9DT01NT05fT0JKRUNUX1BBR0VfSEVBREVSX1NFQ1RJT059XCIsXG5cdFx0dmlzaWJsZTogXCJ7PSAke3VpPi9lZGl0TW9kZX0gPT09ICdFZGl0YWJsZScgfVwiLFxuXHRcdHN1YlNlY3Rpb25zOiBhbGxIZWFkZXJGYWNldHNTdWJTZWN0aW9uc1xuXHR9O1xuXHRyZXR1cm4gaGVhZGVyU2VjdGlvbjtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZGVmaW5pdGlvbiBmb3IgYSBzZWN0aW9uIGJhc2VkIG9uIHRoZSBGYWNldCBhbm5vdGF0aW9uLlxuICpcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHJldHVybnMge09iamVjdFBhZ2VTZWN0aW9uW119IEFsbCBzZWN0aW9uc1xuICovXG5mdW5jdGlvbiBnZXRTZWN0aW9uc0Zyb21Bbm5vdGF0aW9uKGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBPYmplY3RQYWdlU2VjdGlvbltdIHtcblx0Y29uc3QgZW50aXR5VHlwZSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpO1xuXHRjb25zdCBvYmplY3RQYWdlU2VjdGlvbnM6IE9iamVjdFBhZ2VTZWN0aW9uW10gPVxuXHRcdGVudGl0eVR5cGUuYW5ub3RhdGlvbnM/LlVJPy5GYWNldHM/Lm1hcCgoZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzKSA9PlxuXHRcdFx0Z2V0U2VjdGlvbkZyb21Bbm5vdGF0aW9uKGZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dClcblx0XHQpIHx8IFtdO1xuXHRyZXR1cm4gb2JqZWN0UGFnZVNlY3Rpb25zO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhbiBhbm5vdGF0aW9uIGJhc2VkIHNlY3Rpb24uXG4gKlxuICogQHBhcmFtIGZhY2V0XG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dFxuICogQHJldHVybnMge09iamVjdFBhZ2VTZWN0aW9ufSBUaGUgY3VycmVudCBzZWN0aW9uXG4gKi9cbmZ1bmN0aW9uIGdldFNlY3Rpb25Gcm9tQW5ub3RhdGlvbihmYWNldDogRmFjZXRUeXBlcywgY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IE9iamVjdFBhZ2VTZWN0aW9uIHtcblx0Y29uc3Qgc2VjdGlvbklEID0gU2VjdGlvbklEKHsgRmFjZXQ6IGZhY2V0IH0pO1xuXHRjb25zdCBzZWN0aW9uOiBPYmplY3RQYWdlU2VjdGlvbiA9IHtcblx0XHRpZDogc2VjdGlvbklELFxuXHRcdGtleTogZ2V0U2VjdGlvbktleShmYWNldCwgc2VjdGlvbklEKSxcblx0XHR0aXRsZTogY29tcGlsZUJpbmRpbmcoYW5ub3RhdGlvbkV4cHJlc3Npb24oZmFjZXQuTGFiZWwpKSxcblx0XHRzaG93VGl0bGU6ICEhZmFjZXQuTGFiZWwsXG5cdFx0dmlzaWJsZTogY29tcGlsZUJpbmRpbmcobm90KGVxdWFsKGFubm90YXRpb25FeHByZXNzaW9uKGZhY2V0LmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkpLCB0cnVlKSkpLFxuXHRcdHN1YlNlY3Rpb25zOiBjcmVhdGVTdWJTZWN0aW9ucyhbZmFjZXRdLCBjb252ZXJ0ZXJDb250ZXh0KVxuXHR9O1xuXHRyZXR1cm4gc2VjdGlvbjtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIHNlY3Rpb24gZGVmaW5pdGlvbiBiYXNlZCBvbiBtYW5pZmVzdCBkZWZpbml0aW9uLlxuICogQHBhcmFtIG1hbmlmZXN0U2VjdGlvbnMgVGhlIG1hbmlmZXN0IGRlZmluZWQgc2VjdGlvbnNcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcmV0dXJucyB7UmVjb3JkPHN0cmluZywgQ3VzdG9tT2JqZWN0UGFnZVNlY3Rpb24+fSBUaGUgbWFuaWZlc3QgZGVmaW5lZCBzZWN0aW9uc1xuICovXG5mdW5jdGlvbiBnZXRTZWN0aW9uc0Zyb21NYW5pZmVzdChcblx0bWFuaWZlc3RTZWN0aW9uczogQ29uZmlndXJhYmxlUmVjb3JkPE1hbmlmZXN0U2VjdGlvbj4sXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IFJlY29yZDxzdHJpbmcsIEN1c3RvbU9iamVjdFBhZ2VTZWN0aW9uPiB7XG5cdGNvbnN0IHNlY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21PYmplY3RQYWdlU2VjdGlvbj4gPSB7fTtcblx0T2JqZWN0LmtleXMobWFuaWZlc3RTZWN0aW9ucykuZm9yRWFjaChtYW5pZmVzdFNlY3Rpb25LZXkgPT4ge1xuXHRcdHNlY3Rpb25zW21hbmlmZXN0U2VjdGlvbktleV0gPSBnZXRTZWN0aW9uRnJvbU1hbmlmZXN0KG1hbmlmZXN0U2VjdGlvbnNbbWFuaWZlc3RTZWN0aW9uS2V5XSwgbWFuaWZlc3RTZWN0aW9uS2V5LCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0fSk7XG5cdHJldHVybiBzZWN0aW9ucztcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBtYW5pZmVzdCBiYXNlZCBjdXN0b20gc2VjdGlvbi5cbiAqIEBwYXJhbSBjdXN0b21TZWN0aW9uRGVmaW5pdGlvblxuICogQHBhcmFtIHNlY3Rpb25LZXlcbiAqIEBwYXJhbSBjb252ZXJ0ZXJDb250ZXh0XG4gKiBAcmV0dXJucyB7Q3VzdG9tT2JqZWN0UGFnZVNlY3Rpb259IFRoZSBjdXJyZW50IGN1c3RvbSBzZWN0aW9uXG4gKi9cbmZ1bmN0aW9uIGdldFNlY3Rpb25Gcm9tTWFuaWZlc3QoXG5cdGN1c3RvbVNlY3Rpb25EZWZpbml0aW9uOiBNYW5pZmVzdFNlY3Rpb24sXG5cdHNlY3Rpb25LZXk6IHN0cmluZyxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogQ3VzdG9tT2JqZWN0UGFnZVNlY3Rpb24ge1xuXHRjb25zdCBjdXN0b21TZWN0aW9uSUQgPSBjdXN0b21TZWN0aW9uRGVmaW5pdGlvbi5pZCB8fCBDdXN0b21TZWN0aW9uSUQoc2VjdGlvbktleSk7XG5cdGxldCBwb3NpdGlvbjogUG9zaXRpb24gfCB1bmRlZmluZWQgPSBjdXN0b21TZWN0aW9uRGVmaW5pdGlvbi5wb3NpdGlvbjtcblx0aWYgKCFwb3NpdGlvbikge1xuXHRcdHBvc2l0aW9uID0ge1xuXHRcdFx0cGxhY2VtZW50OiBQbGFjZW1lbnQuQWZ0ZXJcblx0XHR9O1xuXHR9XG5cdGxldCBtYW5pZmVzdFN1YlNlY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBNYW5pZmVzdFN1YlNlY3Rpb24+O1xuXHRpZiAoIWN1c3RvbVNlY3Rpb25EZWZpbml0aW9uLnN1YlNlY3Rpb25zKSB7XG5cdFx0Ly8gSWYgdGhlcmUgaXMgbm8gc3ViU2VjdGlvbiBkZWZpbmVkLCB3ZSBhZGQgdGhlIGNvbnRlbnQgb2YgdGhlIGN1c3RvbSBzZWN0aW9uIGFzIHN1YnNlY3Rpb25zXG5cdFx0Ly8gYW5kIG1ha2Ugc3VyZSB0byBzZXQgdGhlIHZpc2liaWxpdHkgdG8gJ3RydWUnLCBhcyB0aGUgYWN0dWFsIHZpc2liaWxpdHkgaXMgaGFuZGxlZCBieSB0aGUgc2VjdGlvbiBpdHNlbGZcblx0XHRtYW5pZmVzdFN1YlNlY3Rpb25zID0ge1xuXHRcdFx0W3NlY3Rpb25LZXldOiB7XG5cdFx0XHRcdC4uLmN1c3RvbVNlY3Rpb25EZWZpbml0aW9uLFxuXHRcdFx0XHRwb3NpdGlvbjogdW5kZWZpbmVkLFxuXHRcdFx0XHR2aXNpYmxlOiB0cnVlXG5cdFx0XHR9XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRtYW5pZmVzdFN1YlNlY3Rpb25zID0gY3VzdG9tU2VjdGlvbkRlZmluaXRpb24uc3ViU2VjdGlvbnM7XG5cdH1cblx0Y29uc3Qgc3ViU2VjdGlvbnMgPSBjcmVhdGVDdXN0b21TdWJTZWN0aW9ucyhtYW5pZmVzdFN1YlNlY3Rpb25zLCBjb252ZXJ0ZXJDb250ZXh0KTtcblxuXHRjb25zdCBjdXN0b21TZWN0aW9uOiBDdXN0b21PYmplY3RQYWdlU2VjdGlvbiA9IHtcblx0XHRpZDogY3VzdG9tU2VjdGlvbklELFxuXHRcdGtleTogc2VjdGlvbktleSxcblx0XHR0aXRsZTogY3VzdG9tU2VjdGlvbkRlZmluaXRpb24udGl0bGUsXG5cdFx0c2hvd1RpdGxlOiAhIWN1c3RvbVNlY3Rpb25EZWZpbml0aW9uLnRpdGxlLFxuXHRcdHZpc2libGU6IGN1c3RvbVNlY3Rpb25EZWZpbml0aW9uLnZpc2libGUgIT09IHVuZGVmaW5lZCA/IGN1c3RvbVNlY3Rpb25EZWZpbml0aW9uLnZpc2libGUgOiB0cnVlLFxuXHRcdHBvc2l0aW9uOiBwb3NpdGlvbixcblx0XHRzdWJTZWN0aW9uczogc3ViU2VjdGlvbnMgYXMgYW55XG5cdH07XG5cdHJldHVybiBjdXN0b21TZWN0aW9uO1xufVxuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgT2JqZWN0UGFnZSBoZWFkZXIgYWN0aW9ucyAoYm90aCB0aGUgZGVmYXVsdCBvbmVzIGFuZCB0aGUgY3VzdG9tIG9uZXMgZGVmaW5lZCBpbiB0aGUgbWFuaWZlc3QpLlxuICpcbiAqIEBwYXJhbSB7Q29udmVydGVyQ29udGV4dH0gY29udmVydGVyQ29udGV4dCBUaGUgY29udmVydGVyIGNvbnRleHRcbiAqIEByZXR1cm5zIEFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRoZSBhY3Rpb25zIGZvciB0aGlzIE9iamVjdFBhZ2UgaGVhZGVyXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRIZWFkZXJBY3Rpb25zID0gZnVuY3Rpb24oY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IEJhc2VBY3Rpb25bXSB7XG5cdGNvbnN0IGFBbm5vdGF0aW9uSGVhZGVyQWN0aW9uczogQmFzZUFjdGlvbltdID0gZ2V0SGVhZGVyRGVmYXVsdEFjdGlvbnMoY29udmVydGVyQ29udGV4dCk7XG5cdGNvbnN0IG1hbmlmZXN0V3JhcHBlciA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCk7XG5cdGNvbnN0IGhlYWRlckFjdGlvbnMgPSBpbnNlcnRDdXN0b21FbGVtZW50cyhcblx0XHRhQW5ub3RhdGlvbkhlYWRlckFjdGlvbnMsXG5cdFx0Z2V0QWN0aW9uc0Zyb21NYW5pZmVzdChcblx0XHRcdG1hbmlmZXN0V3JhcHBlci5nZXRIZWFkZXJBY3Rpb25zKCksXG5cdFx0XHRjb252ZXJ0ZXJDb250ZXh0LFxuXHRcdFx0YUFubm90YXRpb25IZWFkZXJBY3Rpb25zLFxuXHRcdFx0dW5kZWZpbmVkLFxuXHRcdFx0dW5kZWZpbmVkLFxuXHRcdFx0Z2V0SGlkZGVuSGVhZGVyQWN0aW9ucyhjb252ZXJ0ZXJDb250ZXh0KVxuXHRcdCksXG5cdFx0eyBpc05hdmlnYWJsZTogXCJvdmVyd3JpdGVcIiwgZW5hYmxlZDogXCJvdmVyd3JpdGVcIiwgZGVmYXVsdFZhbHVlc0V4dGVuc2lvbkZ1bmN0aW9uOiBcIm92ZXJ3cml0ZVwiIH1cblx0KTtcblx0cmV0dXJuIHJlbW92ZUR1cGxpY2F0ZUFjdGlvbnMoaGVhZGVyQWN0aW9ucyk7XG59O1xuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgT2JqZWN0UGFnZSBmb290ZXIgYWN0aW9ucyAoYm90aCB0aGUgZGVmYXVsdCBvbmVzIGFuZCB0aGUgY3VzdG9tIG9uZXMgZGVmaW5lZCBpbiB0aGUgbWFuaWZlc3QpLlxuICpcbiAqIEBwYXJhbSB7Q29udmVydGVyQ29udGV4dH0gY29udmVydGVyQ29udGV4dCBUaGUgY29udmVydGVyIGNvbnRleHRcbiAqIEByZXR1cm5zIEFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRoZSBhY3Rpb25zIGZvciB0aGlzIE9iamVjdFBhZ2UgZm9vdGVyXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRGb290ZXJBY3Rpb25zID0gZnVuY3Rpb24oY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IEJhc2VBY3Rpb25bXSB7XG5cdGNvbnN0IG1hbmlmZXN0V3JhcHBlciA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCk7XG5cdGNvbnN0IGFBbm5vdGF0aW9uRm9vdGVyQWN0aW9uczogQmFzZUFjdGlvbltdID0gZ2V0Rm9vdGVyRGVmYXVsdEFjdGlvbnMobWFuaWZlc3RXcmFwcGVyLmdldFZpZXdMZXZlbCgpLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0Y29uc3QgZm9vdGVyQWN0aW9ucyA9IGluc2VydEN1c3RvbUVsZW1lbnRzKFxuXHRcdGFBbm5vdGF0aW9uRm9vdGVyQWN0aW9ucyxcblx0XHRnZXRBY3Rpb25zRnJvbU1hbmlmZXN0KG1hbmlmZXN0V3JhcHBlci5nZXRGb290ZXJBY3Rpb25zKCksIGNvbnZlcnRlckNvbnRleHQsIGFBbm5vdGF0aW9uRm9vdGVyQWN0aW9ucyksXG5cdFx0eyBpc05hdmlnYWJsZTogXCJvdmVyd3JpdGVcIiwgZW5hYmxlZDogXCJvdmVyd3JpdGVcIiwgZGVmYXVsdFZhbHVlc0V4dGVuc2lvbkZ1bmN0aW9uOiBcIm92ZXJ3cml0ZVwiIH1cblx0KTtcblx0cmV0dXJuIGZvb3RlckFjdGlvbnM7XG59O1xuXG4vKipcbiAqIFJldHJpZXZlcyBhbmQgbWVyZ2VzIHRoZSBPYmplY3RQYWdlIHNlY3Rpb25zIGRlZmluZWQgaW4gdGhlIGFubm90YXRpb24gYW5kIGluIHRoZSBtYW5pZmVzdC5cbiAqXG4gKiBAcGFyYW0ge0NvbnZlcnRlckNvbnRleHR9IGNvbnZlcnRlckNvbnRleHQgVGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcmV0dXJucyBBbiBhcnJheSBvZiBzZWN0aW9ucy5cbiAqL1xuZXhwb3J0IGNvbnN0IGdldFNlY3Rpb25zID0gZnVuY3Rpb24oY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IE9iamVjdFBhZ2VTZWN0aW9uW10ge1xuXHRjb25zdCBtYW5pZmVzdFdyYXBwZXIgPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpO1xuXHRjb25zdCBzZWN0aW9ucyA9IGluc2VydEN1c3RvbUVsZW1lbnRzKFxuXHRcdGdldFNlY3Rpb25zRnJvbUFubm90YXRpb24oY29udmVydGVyQ29udGV4dCksXG5cdFx0Z2V0U2VjdGlvbnNGcm9tTWFuaWZlc3QobWFuaWZlc3RXcmFwcGVyLmdldFNlY3Rpb25zKCksIGNvbnZlcnRlckNvbnRleHQpLFxuXHRcdHtcblx0XHRcdFwidGl0bGVcIjogXCJvdmVyd3JpdGVcIixcblx0XHRcdFwidmlzaWJsZVwiOiBcIm92ZXJ3cml0ZVwiLFxuXHRcdFx0XCJzdWJTZWN0aW9uc1wiOiB7XG5cdFx0XHRcdFwiYWN0aW9uc1wiOiBcIm1lcmdlXCIsXG5cdFx0XHRcdFwidGl0bGVcIjogXCJvdmVyd3JpdGVcIixcblx0XHRcdFx0XCJzaWRlQ29udGVudFwiOiBcIm92ZXJ3cml0ZVwiXG5cdFx0XHR9XG5cdFx0fVxuXHQpO1xuXHQvLyBMZXZlbCBBZGp1c3RtZW50IGZvciBcIk1peGVkXCIgQ29sbGVjdGlvbiBGYWNldHM6XG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gVGhlIG1hbmlmZXN0IGRlZmluaXRpb24gb2YgY3VzdG9tIHNpZGUgY29udGVudHMgYW5kIGFjdGlvbnMgc3RpbGwgbmVlZHMgdG8gYmUgYWxpZ25lZCBmb3IgXCJNaXhlZFwiIGNvbGxlY3Rpb24gZmFjZXRzOlxuXHQvLyBDb2xsZWN0aW9uIGZhY2V0cyBjb250YWluaW5nIHRhYmxlcyBnYWluIGFuIGV4dHJhIHJlZmVyZW5jZSBmYWNldCBhcyBhIHRhYmxlIHdyYXBwZXIgdG8gZW5zdXJlLCB0aGF0IHRoZSB0YWJsZSBpcyBhbHdheXNcblx0Ly8gcGxhY2VkIGluIGFuIG93biBpbmRpdmlkdWFsIE9iamVjdCBQYWdlIEJsb2NrOyB0aGlzIGFkZGl0aW9uYWwgaGllcmFyY2h5IGxldmVsIGlzIHVua25vd24gdG8gYXBwIGRldmVsb3BlcnMsIHdoaWNoIGFyZVxuXHQvLyBkZWZpbmluZyB0aGUgc2lkZSBjb250ZW50IGFuZCBhY3Rpb25zIGluIHRoZSBtYW5pZmVzdCBhdCBjb2xsZWN0aW9uIGZhY2V0IGxldmVsOyBub3csIHNpbmNlIHRoZSBzaWRlQ29udGVudCBhbHdheXMgbmVlZHNcblx0Ly8gdG8gYmUgYXNzaWduZWQgdG8gYSBibG9jaywgd2UgbmVlZCB0byBtb3ZlIHRoZSBzaWRlQ29udGVudCBvZiBmcm9tIGEgbWl4ZWQgY29sbGVjdGlvbiBmYWNldCB0byBpdHMgZmlyc3QgY2hpbGQgcmVmZXJlbmNlIGZhY2V0LlxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdHNlY3Rpb25zLmZvckVhY2goZnVuY3Rpb24oc2VjdGlvbikge1xuXHRcdHNlY3Rpb24uc3ViU2VjdGlvbnM/LmZvckVhY2goZnVuY3Rpb24oc3ViU2VjdGlvbikge1xuXHRcdFx0aWYgKHN1YlNlY3Rpb24udHlwZSA9PT0gXCJNaXhlZFwiICYmIHN1YlNlY3Rpb24uc2lkZUNvbnRlbnQgIT0gdW5kZWZpbmVkICYmIHN1YlNlY3Rpb24uY29udGVudCAmJiBzdWJTZWN0aW9uLmNvbnRlbnQubGVuZ3RoID4gMCkge1xuXHRcdFx0XHQvLyAxLiBDb3B5IHNpZGVDb250ZW50IC8gYWN0aW9ucyB0byB0aGUgU3ViU2VjdGlvbidzIGNvbnRlbnRcblx0XHRcdFx0Ly8gMi4gRGVsZXRlIHNpZGVDb250ZW50IC8gYWN0aW9ucyBhdCB0aGUgKGludmFsaWQpIG1hbmlmZXN0IGxldmVsXG5cdFx0XHRcdGlmICgoc3ViU2VjdGlvbiBhcyBGb3JtU3ViU2VjdGlvbikuc2lkZUNvbnRlbnQpIHtcblx0XHRcdFx0XHRzdWJTZWN0aW9uLmNvbnRlbnRbMF0uc2lkZUNvbnRlbnQgPSBzdWJTZWN0aW9uLnNpZGVDb250ZW50O1xuXHRcdFx0XHRcdHN1YlNlY3Rpb24uc2lkZUNvbnRlbnQgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKChzdWJTZWN0aW9uIGFzIEZvcm1TdWJTZWN0aW9uKS5hY3Rpb25zLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHQoc3ViU2VjdGlvbi5jb250ZW50WzBdIGFzIEZvcm1TdWJTZWN0aW9uKS5hY3Rpb25zID0gKHN1YlNlY3Rpb24gYXMgRm9ybVN1YlNlY3Rpb24pLmFjdGlvbnM7XG5cdFx0XHRcdFx0KHN1YlNlY3Rpb24gYXMgRm9ybVN1YlNlY3Rpb24pLmFjdGlvbnMgPSBbXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblx0cmV0dXJuIHNlY3Rpb25zO1xufTtcblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIHRoZSBPYmplY3RQYWdlIGhhcyBoZWFkZXIgY29udGVudC5cbiAqXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dCBUaGUgaW5zdGFuY2Ugb2YgdGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gYHRydWVgIGlmIHRoZXJlIGlzIGF0IGxlYXN0IG9uIGhlYWRlciBmYWNldFxuICovXG5mdW5jdGlvbiBoYXNIZWFkZXJDb250ZW50KGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBib29sZWFuIHtcblx0Y29uc3QgbWFuaWZlc3RXcmFwcGVyID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKTtcblx0cmV0dXJuIChcblx0XHQoY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlKCkuYW5ub3RhdGlvbnM/LlVJPy5IZWFkZXJGYWNldHMgfHwgW10pLmxlbmd0aCA+IDAgfHxcblx0XHRPYmplY3Qua2V5cyhtYW5pZmVzdFdyYXBwZXIuZ2V0SGVhZGVyRmFjZXRzKCkpLmxlbmd0aCA+IDBcblx0KTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBleHByZXNzaW9uIHRvIGV2YWx1YXRlIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSBoZWFkZXIgY29udGVudC5cbiAqXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dCBUaGUgaW5zdGFuY2Ugb2YgdGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcmV0dXJucyB7QmluZGluZ0V4cHJlc3Npb248Ym9vbGVhbj59IFRoZSBiaW5kaW5nIGV4cHJlc3Npb24gZm9yIHRoZSBEZWxldGUgYnV0dG9uXG4gKi9cbmZ1bmN0aW9uIGdldFNob3dIZWFkZXJDb250ZW50RXhwcmVzc2lvbihjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogRXhwcmVzc2lvbjxhbnk+IHtcblx0Y29uc3QgbWFuaWZlc3RXcmFwcGVyID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKTtcblx0cmV0dXJuIGlmRWxzZShcblx0XHQhaGFzSGVhZGVyQ29udGVudChjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRjb25zdGFudChmYWxzZSksXG5cdFx0aWZFbHNlKFxuXHRcdFx0ZXF1YWwobWFuaWZlc3RXcmFwcGVyLmlzSGVhZGVyRWRpdGFibGUoKSwgZmFsc2UpLFxuXHRcdFx0Y29uc3RhbnQodHJ1ZSksXG5cdFx0XHRub3QoZXF1YWwoYmluZGluZ0V4cHJlc3Npb24oXCIvZWRpdE1vZGVcIiwgXCJ1aVwiKSwgXCJFZGl0YWJsZVwiKSlcblx0XHQpXG5cdCk7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgYmluZGluZyBleHByZXNzaW9uIHRvIGV2YWx1YXRlIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSBoZWFkZXIgY29udGVudC5cbiAqXG4gKiBAcGFyYW0gY29udmVydGVyQ29udGV4dCBUaGUgaW5zdGFuY2Ugb2YgdGhlIGNvbnZlcnRlciBjb250ZXh0XG4gKiBAcmV0dXJucyB7QmluZGluZ0V4cHJlc3Npb248Ym9vbGVhbj59IFRoZSBiaW5kaW5nIGV4cHJlc3Npb24gZm9yIHRoZSBEZWxldGUgYnV0dG9uXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRTaG93SGVhZGVyQ29udGVudCA9IGZ1bmN0aW9uKGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBCaW5kaW5nRXhwcmVzc2lvbjxib29sZWFuPiB7XG5cdHJldHVybiBjb21waWxlQmluZGluZyhnZXRTaG93SGVhZGVyQ29udGVudEV4cHJlc3Npb24oY29udmVydGVyQ29udGV4dCkpO1xufTtcblxuLyoqXG4gKiBHZXRzIHRoZSBiaW5kaW5nIGV4cHJlc3Npb24gdG8gZXZhbHVhdGUgdGhlIHZpc2liaWxpdHkgb2YgdGhlIGF2YXRhciB3aGVuIHRoZSBoZWFkZXIgaXMgaW4gZXhwYW5kZWQgc3RhdGUuXG4gKlxuICogQHBhcmFtIGNvbnZlcnRlckNvbnRleHQgVGhlIGluc3RhbmNlIG9mIHRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICogQHJldHVybnMge0JpbmRpbmdFeHByZXNzaW9uPHN0cmluZz59IFRoZSBiaW5kaW5nIGV4cHJlc3Npb24gZm9yIHRoZSBEZWxldGUgYnV0dG9uXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRFeHBhbmRlZEltYWdlVmlzaWJsZSA9IGZ1bmN0aW9uKGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBCaW5kaW5nRXhwcmVzc2lvbjxzdHJpbmc+IHtcblx0cmV0dXJuIGNvbXBpbGVCaW5kaW5nKG5vdChnZXRTaG93SGVhZGVyQ29udGVudEV4cHJlc3Npb24oY29udmVydGVyQ29udGV4dCkpKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjb252ZXJ0UGFnZSA9IGZ1bmN0aW9uKGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQpOiBPYmplY3RQYWdlRGVmaW5pdGlvbiB7XG5cdGNvbnN0IG1hbmlmZXN0V3JhcHBlciA9IGNvbnZlcnRlckNvbnRleHQuZ2V0TWFuaWZlc3RXcmFwcGVyKCk7XG5cdGxldCBoZWFkZXJTZWN0aW9uOiBPYmplY3RQYWdlU2VjdGlvbiB8IHVuZGVmaW5lZDtcblx0Y29uc3QgZW50aXR5VHlwZTogRW50aXR5VHlwZSA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpO1xuXHQvLyBSZXRyaWV2ZSBhbGwgaGVhZGVyIGZhY2V0cyAoZnJvbSBhbm5vdGF0aW9ucyAmIGN1c3RvbSlcblx0Y29uc3QgaGVhZGVyRmFjZXRzID0gaW5zZXJ0Q3VzdG9tRWxlbWVudHMoXG5cdFx0Z2V0SGVhZGVyRmFjZXRzRnJvbUFubm90YXRpb25zKGNvbnZlcnRlckNvbnRleHQpLFxuXHRcdGdldEhlYWRlckZhY2V0c0Zyb21NYW5pZmVzdChtYW5pZmVzdFdyYXBwZXIuZ2V0SGVhZGVyRmFjZXRzKCkpXG5cdCk7XG5cblx0Ly8gUmV0cmlldmUgdGhlIHBhZ2UgaGVhZGVyIGFjdGlvbnNcblx0Y29uc3QgaGVhZGVyQWN0aW9ucyA9IGdldEhlYWRlckFjdGlvbnMoY29udmVydGVyQ29udGV4dCk7XG5cblx0Ly8gUmV0cmlldmUgdGhlIHBhZ2UgZm9vdGVyIGFjdGlvbnNcblx0Y29uc3QgZm9vdGVyQWN0aW9ucyA9IGdldEZvb3RlckFjdGlvbnMoY29udmVydGVyQ29udGV4dCk7XG5cblx0aWYgKG1hbmlmZXN0V3JhcHBlci5pc0hlYWRlckVkaXRhYmxlKCkgJiYgKGVudGl0eVR5cGUuYW5ub3RhdGlvbnMuVUk/LkhlYWRlckZhY2V0cyB8fCBlbnRpdHlUeXBlLmFubm90YXRpb25zLlVJPy5IZWFkZXJJbmZvKSkge1xuXHRcdGhlYWRlclNlY3Rpb24gPSBjcmVhdGVFZGl0YWJsZUhlYWRlclNlY3Rpb24oY29udmVydGVyQ29udGV4dCwgaGVhZGVyRmFjZXRzKTtcblx0fVxuXG5cdGNvbnN0IHNlY3Rpb25zID0gZ2V0U2VjdGlvbnMoY29udmVydGVyQ29udGV4dCk7XG5cblx0cmV0dXJuIHtcblx0XHR0ZW1wbGF0ZTogVGVtcGxhdGVUeXBlLk9iamVjdFBhZ2UsXG5cdFx0aGVhZGVyOiB7XG5cdFx0XHR2aXNpYmxlOiBtYW5pZmVzdFdyYXBwZXIuZ2V0U2hvd09iamVjdFBhZ2VIZWFkZXIoKSxcblx0XHRcdHNlY3Rpb246IGhlYWRlclNlY3Rpb24sXG5cdFx0XHRmYWNldHM6IGhlYWRlckZhY2V0cyxcblx0XHRcdGFjdGlvbnM6IGhlYWRlckFjdGlvbnMsXG5cdFx0XHRzaG93Q29udGVudDogZ2V0U2hvd0hlYWRlckNvbnRlbnQoY29udmVydGVyQ29udGV4dCksXG5cdFx0XHRoYXNDb250ZW50OiBoYXNIZWFkZXJDb250ZW50KGNvbnZlcnRlckNvbnRleHQpLFxuXHRcdFx0YXZhdGFyOiBnZXRBdmF0YXIoY29udmVydGVyQ29udGV4dCksXG5cdFx0XHR0aXRsZToge1xuXHRcdFx0XHRleHBhbmRlZEltYWdlVmlzaWJsZTogZ2V0RXhwYW5kZWRJbWFnZVZpc2libGUoY29udmVydGVyQ29udGV4dClcblx0XHRcdH1cblx0XHR9LFxuXHRcdHNlY3Rpb25zOiBzZWN0aW9ucyxcblx0XHRmb290ZXJBY3Rpb25zOiBmb290ZXJBY3Rpb25zLFxuXHRcdHNob3dBbmNob3JCYXI6IG1hbmlmZXN0V3JhcHBlci5nZXRTaG93QW5jaG9yQmFyKCksXG5cdFx0dXNlSWNvblRhYkJhcjogbWFuaWZlc3RXcmFwcGVyLnVzZUljb25UYWJCYXIoKVxuXHR9O1xufTtcbiJdfQ==