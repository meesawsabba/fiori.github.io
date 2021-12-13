/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/converters/helpers/ConfigurableObject", "sap/fe/core/converters/helpers/ID", "sap/fe/core/helpers/BindingExpression", "sap/fe/core/converters/helpers/Key", "../Common/Form", "sap/fe/core/converters/annotations/DataField", "../../../helpers/StableIdHelper"], function (ConfigurableObject, ID, BindingExpression, Key, Form, DataField, StableIdHelper) {
  "use strict";

  var _exports = {};
  var generate = StableIdHelper.generate;
  var getSemanticObjectPath = DataField.getSemanticObjectPath;
  var getFormElementsFromManifest = Form.getFormElementsFromManifest;
  var FormElementType = Form.FormElementType;
  var KeyHelper = Key.KeyHelper;
  var not = BindingExpression.not;
  var equal = BindingExpression.equal;
  var compileBinding = BindingExpression.compileBinding;
  var annotationExpression = BindingExpression.annotationExpression;
  var HeaderFacetID = ID.HeaderFacetID;
  var HeaderFacetFormID = ID.HeaderFacetFormID;
  var HeaderFacetContainerID = ID.HeaderFacetContainerID;
  var CustomHeaderFacetID = ID.CustomHeaderFacetID;
  var Placement = ConfigurableObject.Placement;
  var insertCustomElements = ConfigurableObject.insertCustomElements;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  // region definitions
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Definitions: Header Facet Types, Generic OP Header Facet, Manifest Properties for Custom Header Facet
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  var HeaderFacetType;

  (function (HeaderFacetType) {
    HeaderFacetType["Annotation"] = "Annotation";
    HeaderFacetType["XMLFragment"] = "XMLFragment";
  })(HeaderFacetType || (HeaderFacetType = {}));

  _exports.HeaderFacetType = HeaderFacetType;
  var FacetType;

  (function (FacetType) {
    FacetType["Reference"] = "Reference";
    FacetType["Collection"] = "Collection";
  })(FacetType || (FacetType = {}));

  _exports.FacetType = FacetType;
  var FlexDesignTimeType;

  (function (FlexDesignTimeType) {
    FlexDesignTimeType["Default"] = "Default";
    FlexDesignTimeType["NotAdaptable"] = "not-adaptable";
    FlexDesignTimeType["NotAdaptableTree"] = "not-adaptable-tree";
    FlexDesignTimeType["NotAdaptableVisibility"] = "not-adaptable-visibility";
  })(FlexDesignTimeType || (FlexDesignTimeType = {}));

  _exports.FlexDesignTimeType = FlexDesignTimeType;
  var HeaderDataPointType;

  (function (HeaderDataPointType) {
    HeaderDataPointType["ProgressIndicator"] = "ProgressIndicator";
    HeaderDataPointType["RatingIndicator"] = "RatingIndicator";
    HeaderDataPointType["Content"] = "Content";
  })(HeaderDataPointType || (HeaderDataPointType = {}));

  var TargetAnnotationType;

  (function (TargetAnnotationType) {
    TargetAnnotationType["None"] = "None";
    TargetAnnotationType["DataPoint"] = "DataPoint";
    TargetAnnotationType["Chart"] = "Chart";
    TargetAnnotationType["Identification"] = "Identification";
    TargetAnnotationType["Contact"] = "Contact";
    TargetAnnotationType["Address"] = "Address";
    TargetAnnotationType["FieldGroup"] = "FieldGroup";
  })(TargetAnnotationType || (TargetAnnotationType = {}));

  // endregion definitions
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Collect All Header Facets: Custom (via Manifest) and Annotation Based (via Metamodel)
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Retrieve header facets from annotations.
   *
   * @param {ConverterContext} converterContext
   *
   * @returns {ObjectPageHeaderFacet} Header facets from annotations
   */
  function getHeaderFacetsFromAnnotations(converterContext) {
    var _converterContext$get, _converterContext$get2, _converterContext$get3;

    var headerFacets = [];
    (_converterContext$get = converterContext.getEntityType().annotations) === null || _converterContext$get === void 0 ? void 0 : (_converterContext$get2 = _converterContext$get.UI) === null || _converterContext$get2 === void 0 ? void 0 : (_converterContext$get3 = _converterContext$get2.HeaderFacets) === null || _converterContext$get3 === void 0 ? void 0 : _converterContext$get3.forEach(function (facet) {
      var headerFacet = createHeaderFacet(facet, converterContext);

      if (headerFacet) {
        headerFacets.push(headerFacet);
      }
    });
    return headerFacets;
  }
  /**
   * Retrieve custom header facets from manifest.
   *
   * @param {ConfigurableRecord<ManifestHeaderFacet>} manifestCustomHeaderFacets
   *
   * @returns {Record<string, CustomObjectPageHeaderFacet>} HeaderFacets from manifest
   */


  _exports.getHeaderFacetsFromAnnotations = getHeaderFacetsFromAnnotations;

  function getHeaderFacetsFromManifest(manifestCustomHeaderFacets) {
    var customHeaderFacets = {};
    Object.keys(manifestCustomHeaderFacets).forEach(function (manifestHeaderFacetKey) {
      var customHeaderFacet = manifestCustomHeaderFacets[manifestHeaderFacetKey];
      customHeaderFacets[manifestHeaderFacetKey] = createCustomHeaderFacet(customHeaderFacet, manifestHeaderFacetKey);
    });
    return customHeaderFacets;
  }
  /**
   * Retrieve stashed settings for header facets from manifest.
   *
   * @param {FacetTypes} facetDefinition
   * @param {FacetTypes} collectionFacetDefinition
   * @param {ConverterContext} converterContext
   *
   * @returns {boolean} Stashed setting for header facet or false
   */


  _exports.getHeaderFacetsFromManifest = getHeaderFacetsFromManifest;

  function getStashedSettingsForHeaderFacet(facetDefinition, collectionFacetDefinition, converterContext) {
    var _headerFacetsControlC;

    // When a HeaderFacet is nested inside a CollectionFacet, stashing is not supported
    if (facetDefinition.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet" && collectionFacetDefinition.$Type === "com.sap.vocabularies.UI.v1.CollectionFacet") {
      return false;
    }

    var headerFacetID = generate([{
      Facet: facetDefinition
    }]);
    var headerFacetsControlConfig = converterContext.getManifestWrapper().getHeaderFacets();
    var stashedSetting = (_headerFacetsControlC = headerFacetsControlConfig[headerFacetID]) === null || _headerFacetsControlC === void 0 ? void 0 : _headerFacetsControlC.stashed;
    return stashedSetting === true;
  }
  /**
   * Retrieve flexibility designtime settings from manifest.
   *
   * @param {FacetTypes} facetDefinition
   * @param {FacetTypes} collectionFacetDefinition
   * @param {ConverterContext} converterContext
   *
   * @returns {FlexDesignTimeType} Designtime setting or default
   */


  _exports.getStashedSettingsForHeaderFacet = getStashedSettingsForHeaderFacet;

  function getDesignTimeMetadataSettingsForHeaderFacet(facetDefinition, collectionFacetDefinition, converterContext) {
    var designTimeMetadata = FlexDesignTimeType.Default;
    var headerFacetID = generate([{
      Facet: facetDefinition
    }]); // For HeaderFacets nested inside CollectionFacet RTA should be disabled, therefore set to "not-adaptable-tree"

    if (facetDefinition.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet" && collectionFacetDefinition.$Type === "com.sap.vocabularies.UI.v1.CollectionFacet") {
      designTimeMetadata = FlexDesignTimeType.NotAdaptableTree;
    } else {
      var headerFacetsControlConfig = converterContext.getManifestWrapper().getHeaderFacets();

      if (headerFacetID) {
        var _headerFacetsControlC2, _headerFacetsControlC3;

        var designTime = (_headerFacetsControlC2 = headerFacetsControlConfig[headerFacetID]) === null || _headerFacetsControlC2 === void 0 ? void 0 : (_headerFacetsControlC3 = _headerFacetsControlC2.flexSettings) === null || _headerFacetsControlC3 === void 0 ? void 0 : _headerFacetsControlC3.designtime;

        switch (designTime) {
          case FlexDesignTimeType.NotAdaptable:
          case FlexDesignTimeType.NotAdaptableTree:
          case FlexDesignTimeType.NotAdaptableVisibility:
            designTimeMetadata = designTime;
        }
      }
    }

    return designTimeMetadata;
  } ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Convert & Build Annotation Based Header Facets
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  _exports.getDesignTimeMetadataSettingsForHeaderFacet = getDesignTimeMetadataSettingsForHeaderFacet;

  function createReferenceHeaderFacet(facetDefinition, collectionFacetDefinition, converterContext) {
    var _facetDefinition$anno, _facetDefinition$anno2, _facetDefinition$anno3;

    if (facetDefinition.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet" && !(((_facetDefinition$anno = facetDefinition.annotations) === null || _facetDefinition$anno === void 0 ? void 0 : (_facetDefinition$anno2 = _facetDefinition$anno.UI) === null || _facetDefinition$anno2 === void 0 ? void 0 : (_facetDefinition$anno3 = _facetDefinition$anno2.Hidden) === null || _facetDefinition$anno3 === void 0 ? void 0 : _facetDefinition$anno3.valueOf()) === true)) {
      var _annotations$UI, _annotations$UI$Hidde;

      var headerFacetID = HeaderFacetID({
        Facet: facetDefinition
      }),
          getHeaderFacetKey = function (facetDefinition, fallback) {
        var _facetDefinition$ID, _facetDefinition$Labe;

        return ((_facetDefinition$ID = facetDefinition.ID) === null || _facetDefinition$ID === void 0 ? void 0 : _facetDefinition$ID.toString()) || ((_facetDefinition$Labe = facetDefinition.Label) === null || _facetDefinition$Labe === void 0 ? void 0 : _facetDefinition$Labe.toString()) || fallback;
      },
          targetAnnotationValue = facetDefinition.Target.value,
          targetAnnotationType = getTargetAnnotationType(facetDefinition);

      var headerFormData;
      var headerDataPointData;

      switch (targetAnnotationType) {
        case TargetAnnotationType.FieldGroup:
          headerFormData = getFieldGroupFormData(facetDefinition, converterContext);
          break;

        case TargetAnnotationType.DataPoint:
          headerDataPointData = getDataPointData(facetDefinition);
          break;
        // ToDo: Handle other cases
      }

      var annotations = facetDefinition.annotations;
      return {
        type: HeaderFacetType.Annotation,
        facetType: FacetType.Reference,
        id: headerFacetID,
        containerId: HeaderFacetContainerID({
          Facet: facetDefinition
        }),
        key: getHeaderFacetKey(facetDefinition, headerFacetID),
        flexSettings: {
          designtime: getDesignTimeMetadataSettingsForHeaderFacet(facetDefinition, collectionFacetDefinition, converterContext)
        },
        stashed: getStashedSettingsForHeaderFacet(facetDefinition, collectionFacetDefinition, converterContext),
        visible: compileBinding(not(equal(annotationExpression(annotations === null || annotations === void 0 ? void 0 : (_annotations$UI = annotations.UI) === null || _annotations$UI === void 0 ? void 0 : (_annotations$UI$Hidde = _annotations$UI.Hidden) === null || _annotations$UI$Hidde === void 0 ? void 0 : _annotations$UI$Hidde.valueOf()), true))),
        annotationPath: converterContext.getEntitySetBasedAnnotationPath(facetDefinition.fullyQualifiedName) + "/",
        targetAnnotationValue: targetAnnotationValue,
        targetAnnotationType: targetAnnotationType,
        headerFormData: headerFormData,
        headerDataPointData: headerDataPointData
      };
    }

    return undefined;
  }

  function createCollectionHeaderFacet(collectionFacetDefinition, converterContext) {
    if (collectionFacetDefinition.$Type === "com.sap.vocabularies.UI.v1.CollectionFacet") {
      var _collectionFacetDefin, _collectionFacetDefin2, _collectionFacetDefin3;

      var facets = [],
          headerFacetID = HeaderFacetID({
        Facet: collectionFacetDefinition
      }),
          getHeaderFacetKey = function (facetDefinition, fallback) {
        var _facetDefinition$ID2, _facetDefinition$Labe2;

        return ((_facetDefinition$ID2 = facetDefinition.ID) === null || _facetDefinition$ID2 === void 0 ? void 0 : _facetDefinition$ID2.toString()) || ((_facetDefinition$Labe2 = facetDefinition.Label) === null || _facetDefinition$Labe2 === void 0 ? void 0 : _facetDefinition$Labe2.toString()) || fallback;
      };

      collectionFacetDefinition.Facets.forEach(function (facetDefinition) {
        var facet = createReferenceHeaderFacet(facetDefinition, collectionFacetDefinition, converterContext);

        if (facet) {
          facets.push(facet);
        }
      });
      return {
        type: HeaderFacetType.Annotation,
        facetType: FacetType.Collection,
        id: headerFacetID,
        containerId: HeaderFacetContainerID({
          Facet: collectionFacetDefinition
        }),
        key: getHeaderFacetKey(collectionFacetDefinition, headerFacetID),
        flexSettings: {
          designtime: getDesignTimeMetadataSettingsForHeaderFacet(collectionFacetDefinition, collectionFacetDefinition, converterContext)
        },
        stashed: getStashedSettingsForHeaderFacet(collectionFacetDefinition, collectionFacetDefinition, converterContext),
        visible: compileBinding(not(equal(annotationExpression((_collectionFacetDefin = collectionFacetDefinition.annotations) === null || _collectionFacetDefin === void 0 ? void 0 : (_collectionFacetDefin2 = _collectionFacetDefin.UI) === null || _collectionFacetDefin2 === void 0 ? void 0 : (_collectionFacetDefin3 = _collectionFacetDefin2.Hidden) === null || _collectionFacetDefin3 === void 0 ? void 0 : _collectionFacetDefin3.valueOf()), true))),
        annotationPath: converterContext.getEntitySetBasedAnnotationPath(collectionFacetDefinition.fullyQualifiedName) + "/",
        facets: facets
      };
    }

    return undefined;
  }

  function getTargetAnnotationType(facetDefinition) {
    var annotationType = TargetAnnotationType.None;
    var annotationTypeMap = {
      "com.sap.vocabularies.UI.v1.DataPoint": TargetAnnotationType.DataPoint,
      "com.sap.vocabularies.UI.v1.Chart": TargetAnnotationType.Chart,
      "com.sap.vocabularies.UI.v1.Identification": TargetAnnotationType.Identification,
      "com.sap.vocabularies.Communication.v1.Contact": TargetAnnotationType.Contact,
      "com.sap.vocabularies.Communication.v1.Address": TargetAnnotationType.Address,
      "com.sap.vocabularies.UI.v1.FieldGroup": TargetAnnotationType.FieldGroup
    }; // ReferenceURLFacet and CollectionFacet do not have Target property.

    if (facetDefinition.$Type !== "com.sap.vocabularies.UI.v1.ReferenceURLFacet" && facetDefinition.$Type !== "com.sap.vocabularies.UI.v1.CollectionFacet") {
      var _facetDefinition$Targ, _facetDefinition$Targ2;

      annotationType = annotationTypeMap[(_facetDefinition$Targ = facetDefinition.Target) === null || _facetDefinition$Targ === void 0 ? void 0 : (_facetDefinition$Targ2 = _facetDefinition$Targ.$target) === null || _facetDefinition$Targ2 === void 0 ? void 0 : _facetDefinition$Targ2.term] || TargetAnnotationType.None;
    }

    return annotationType;
  }

  function getFieldGroupFormData(facetDefinition, converterContext) {
    var _facetDefinition$Labe3;

    // split in this from annotation + getFieldGroupFromDefault
    if (!facetDefinition) {
      throw new Error("Cannot get FieldGroup form data without facet definition");
    }

    var formElements = insertCustomElements(getFormElementsFromAnnotations(facetDefinition, converterContext), getFormElementsFromManifest(facetDefinition, converterContext));
    return {
      id: HeaderFacetFormID({
        Facet: facetDefinition
      }),
      label: (_facetDefinition$Labe3 = facetDefinition.Label) === null || _facetDefinition$Labe3 === void 0 ? void 0 : _facetDefinition$Labe3.toString(),
      formElements: formElements
    };
  }
  /**
   * Creates an array of manifest-based FormElements.
   *
   * @param {FacetType} facetDefinition The definition of the facet
   * @param {ConverterContext} converterContext The converter context for the facet
   *
   * @returns {Array} Annotation-based FormElements
   */


  function getFormElementsFromAnnotations(facetDefinition, converterContext) {
    var annotationBasedFormElements = []; // ReferenceURLFacet and CollectionFacet do not have Target property.

    if (facetDefinition.$Type !== "com.sap.vocabularies.UI.v1.ReferenceURLFacet" && facetDefinition.$Type !== "com.sap.vocabularies.UI.v1.CollectionFacet") {
      var _facetDefinition$Targ3, _facetDefinition$Targ4;

      (_facetDefinition$Targ3 = facetDefinition.Target) === null || _facetDefinition$Targ3 === void 0 ? void 0 : (_facetDefinition$Targ4 = _facetDefinition$Targ3.$target) === null || _facetDefinition$Targ4 === void 0 ? void 0 : _facetDefinition$Targ4.Data.forEach(function (dataField) {
        var _dataField$annotation, _dataField$annotation2, _dataField$annotation3;

        if (!(((_dataField$annotation = dataField.annotations) === null || _dataField$annotation === void 0 ? void 0 : (_dataField$annotation2 = _dataField$annotation.UI) === null || _dataField$annotation2 === void 0 ? void 0 : (_dataField$annotation3 = _dataField$annotation2.Hidden) === null || _dataField$annotation3 === void 0 ? void 0 : _dataField$annotation3.valueOf()) === true)) {
          var semanticObjectAnnotationPath = getSemanticObjectPath(converterContext, dataField);

          if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataField" || dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithUrl" || dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath") {
            var _dataField$Value, _dataField$Value$$tar, _dataField$Value$$tar2, _dataField$Value$$tar3, _dataField$Value$$tar4, _annotations$UI2, _annotations$UI2$Hidd, _dataField$Value2, _dataField$Value2$$ta, _dataField$Value2$$ta2, _dataField$Value2$$ta3;

            var annotations = dataField.annotations;
            annotationBasedFormElements.push({
              isValueMultilineText: ((_dataField$Value = dataField.Value) === null || _dataField$Value === void 0 ? void 0 : (_dataField$Value$$tar = _dataField$Value.$target) === null || _dataField$Value$$tar === void 0 ? void 0 : (_dataField$Value$$tar2 = _dataField$Value$$tar.annotations) === null || _dataField$Value$$tar2 === void 0 ? void 0 : (_dataField$Value$$tar3 = _dataField$Value$$tar2.UI) === null || _dataField$Value$$tar3 === void 0 ? void 0 : (_dataField$Value$$tar4 = _dataField$Value$$tar3.MultiLineText) === null || _dataField$Value$$tar4 === void 0 ? void 0 : _dataField$Value$$tar4.valueOf()) === true,
              type: FormElementType.Annotation,
              key: KeyHelper.generateKeyFromDataField(dataField),
              visible: compileBinding(not(equal(annotationExpression(annotations === null || annotations === void 0 ? void 0 : (_annotations$UI2 = annotations.UI) === null || _annotations$UI2 === void 0 ? void 0 : (_annotations$UI2$Hidd = _annotations$UI2.Hidden) === null || _annotations$UI2$Hidd === void 0 ? void 0 : _annotations$UI2$Hidd.valueOf()), true))),
              label: ((_dataField$Value2 = dataField.Value) === null || _dataField$Value2 === void 0 ? void 0 : (_dataField$Value2$$ta = _dataField$Value2.$target) === null || _dataField$Value2$$ta === void 0 ? void 0 : (_dataField$Value2$$ta2 = _dataField$Value2$$ta.annotations) === null || _dataField$Value2$$ta2 === void 0 ? void 0 : (_dataField$Value2$$ta3 = _dataField$Value2$$ta2.Common) === null || _dataField$Value2$$ta3 === void 0 ? void 0 : _dataField$Value2$$ta3.Label) || dataField.Label,
              idPrefix: HeaderFacetFormID({
                Facet: facetDefinition
              }, dataField),
              annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName) + "/",
              semanticObjectPath: semanticObjectAnnotationPath
            });
          } else if (dataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
            var _dataField$Target, _dataField$Target$$ta, _dataField$Target$$ta2, _dataField$Target$$ta3, _dataField$Target$$ta4, _annotations$UI3, _annotations$UI3$Hidd, _dataField$Target2, _dataField$Target2$$t, _dataField$Target2$$t2, _dataField$Target2$$t3, _dataField$Target2$$t4, _dataField$Label;

            var _annotations = dataField.annotations;
            annotationBasedFormElements.push({
              // FIXME this is wrong
              isValueMultilineText: ((_dataField$Target = dataField.Target) === null || _dataField$Target === void 0 ? void 0 : (_dataField$Target$$ta = _dataField$Target.$target) === null || _dataField$Target$$ta === void 0 ? void 0 : (_dataField$Target$$ta2 = _dataField$Target$$ta.annotations) === null || _dataField$Target$$ta2 === void 0 ? void 0 : (_dataField$Target$$ta3 = _dataField$Target$$ta2.UI) === null || _dataField$Target$$ta3 === void 0 ? void 0 : (_dataField$Target$$ta4 = _dataField$Target$$ta3.MultiLineText) === null || _dataField$Target$$ta4 === void 0 ? void 0 : _dataField$Target$$ta4.valueOf()) === true,
              type: FormElementType.Annotation,
              key: KeyHelper.generateKeyFromDataField(dataField),
              visible: compileBinding(not(equal(annotationExpression(_annotations === null || _annotations === void 0 ? void 0 : (_annotations$UI3 = _annotations.UI) === null || _annotations$UI3 === void 0 ? void 0 : (_annotations$UI3$Hidd = _annotations$UI3.Hidden) === null || _annotations$UI3$Hidd === void 0 ? void 0 : _annotations$UI3$Hidd.valueOf()), true))),
              label: ((_dataField$Target2 = dataField.Target) === null || _dataField$Target2 === void 0 ? void 0 : (_dataField$Target2$$t = _dataField$Target2.$target) === null || _dataField$Target2$$t === void 0 ? void 0 : (_dataField$Target2$$t2 = _dataField$Target2$$t.annotations) === null || _dataField$Target2$$t2 === void 0 ? void 0 : (_dataField$Target2$$t3 = _dataField$Target2$$t2.Common) === null || _dataField$Target2$$t3 === void 0 ? void 0 : (_dataField$Target2$$t4 = _dataField$Target2$$t3.Label) === null || _dataField$Target2$$t4 === void 0 ? void 0 : _dataField$Target2$$t4.toString()) || ((_dataField$Label = dataField.Label) === null || _dataField$Label === void 0 ? void 0 : _dataField$Label.toString()),
              idPrefix: HeaderFacetFormID({
                Facet: facetDefinition
              }, dataField),
              annotationPath: converterContext.getEntitySetBasedAnnotationPath(dataField.fullyQualifiedName) + "/",
              semanticObjectPath: semanticObjectAnnotationPath
            });
          }
        }
      });
    }

    return annotationBasedFormElements;
  }

  function getDataPointData(facetDefinition) {
    var type = HeaderDataPointType.Content;

    if (facetDefinition.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet") {
      var _facetDefinition$Targ5, _facetDefinition$Targ6, _facetDefinition$Targ7, _facetDefinition$Targ8;

      if (((_facetDefinition$Targ5 = facetDefinition.Target) === null || _facetDefinition$Targ5 === void 0 ? void 0 : (_facetDefinition$Targ6 = _facetDefinition$Targ5.$target) === null || _facetDefinition$Targ6 === void 0 ? void 0 : _facetDefinition$Targ6.Visualization) === "UI.VisualizationType/Progress") {
        type = HeaderDataPointType.ProgressIndicator;
      } else if (((_facetDefinition$Targ7 = facetDefinition.Target) === null || _facetDefinition$Targ7 === void 0 ? void 0 : (_facetDefinition$Targ8 = _facetDefinition$Targ7.$target) === null || _facetDefinition$Targ8 === void 0 ? void 0 : _facetDefinition$Targ8.Visualization) === "UI.VisualizationType/Rating") {
        type = HeaderDataPointType.RatingIndicator;
      }
    }

    return {
      type: type
    };
  }
  /**
   * Creates an annotation-based header facet.
   *
   * @param {FacetTypes} facetDefinition The definition of the facet
   * @param {ConverterContext} converterContext The converter context
   *
   * @returns {ObjectPageHeaderFacet} The created annotation-based header facet
   */


  function createHeaderFacet(facetDefinition, converterContext) {
    var headerFacet;

    switch (facetDefinition.$Type) {
      case "com.sap.vocabularies.UI.v1.ReferenceFacet":
        headerFacet = createReferenceHeaderFacet(facetDefinition, facetDefinition, converterContext);
        break;

      case "com.sap.vocabularies.UI.v1.CollectionFacet":
        headerFacet = createCollectionHeaderFacet(facetDefinition, converterContext);
        break;
    }

    return headerFacet;
  } ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Convert & Build Manifest Based Header Facets
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  function generateBinding(requestGroupId) {
    if (!requestGroupId) {
      return undefined;
    }

    var groupId = ["Heroes", "Decoration", "Workers", "LongRunners"].indexOf(requestGroupId) !== -1 ? "$auto." + requestGroupId : requestGroupId;
    return "{ path : '', parameters : { $$groupId : '" + groupId + "' } }";
  }
  /**
   * Create a manifest based custom header facet.
   *
   * @param {ManifestHeaderFacet} customHeaderFacetDefinition
   * @param {string} headerFacetKey
   *
   * @returns {CustomObjectPageHeaderFacet} The manifest based custom header facet created
   */


  function createCustomHeaderFacet(customHeaderFacetDefinition, headerFacetKey) {
    var customHeaderFacetID = CustomHeaderFacetID(headerFacetKey);
    var position = customHeaderFacetDefinition.position;

    if (!position) {
      position = {
        placement: Placement.After
      };
    } // TODO for an non annotation fragment the name is mandatory -> Not checked


    return {
      facetType: FacetType.Reference,
      facets: [],
      type: customHeaderFacetDefinition.type,
      id: customHeaderFacetID,
      containerId: customHeaderFacetID,
      key: headerFacetKey,
      position: position,
      visible: customHeaderFacetDefinition.visible,
      fragmentName: customHeaderFacetDefinition.template || customHeaderFacetDefinition.name,
      title: customHeaderFacetDefinition.title,
      subTitle: customHeaderFacetDefinition.subTitle,
      stashed: customHeaderFacetDefinition.stashed || false,
      flexSettings: _objectSpread(_objectSpread({}, {
        designtime: FlexDesignTimeType.Default
      }), customHeaderFacetDefinition.flexSettings),
      binding: generateBinding(customHeaderFacetDefinition.requestGroupId),
      templateEdit: customHeaderFacetDefinition.templateEdit
    };
  }

  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhlYWRlckZhY2V0LnRzIl0sIm5hbWVzIjpbIkhlYWRlckZhY2V0VHlwZSIsIkZhY2V0VHlwZSIsIkZsZXhEZXNpZ25UaW1lVHlwZSIsIkhlYWRlckRhdGFQb2ludFR5cGUiLCJUYXJnZXRBbm5vdGF0aW9uVHlwZSIsImdldEhlYWRlckZhY2V0c0Zyb21Bbm5vdGF0aW9ucyIsImNvbnZlcnRlckNvbnRleHQiLCJoZWFkZXJGYWNldHMiLCJnZXRFbnRpdHlUeXBlIiwiYW5ub3RhdGlvbnMiLCJVSSIsIkhlYWRlckZhY2V0cyIsImZvckVhY2giLCJmYWNldCIsImhlYWRlckZhY2V0IiwiY3JlYXRlSGVhZGVyRmFjZXQiLCJwdXNoIiwiZ2V0SGVhZGVyRmFjZXRzRnJvbU1hbmlmZXN0IiwibWFuaWZlc3RDdXN0b21IZWFkZXJGYWNldHMiLCJjdXN0b21IZWFkZXJGYWNldHMiLCJPYmplY3QiLCJrZXlzIiwibWFuaWZlc3RIZWFkZXJGYWNldEtleSIsImN1c3RvbUhlYWRlckZhY2V0IiwiY3JlYXRlQ3VzdG9tSGVhZGVyRmFjZXQiLCJnZXRTdGFzaGVkU2V0dGluZ3NGb3JIZWFkZXJGYWNldCIsImZhY2V0RGVmaW5pdGlvbiIsImNvbGxlY3Rpb25GYWNldERlZmluaXRpb24iLCIkVHlwZSIsImhlYWRlckZhY2V0SUQiLCJnZW5lcmF0ZSIsIkZhY2V0IiwiaGVhZGVyRmFjZXRzQ29udHJvbENvbmZpZyIsImdldE1hbmlmZXN0V3JhcHBlciIsImdldEhlYWRlckZhY2V0cyIsInN0YXNoZWRTZXR0aW5nIiwic3Rhc2hlZCIsImdldERlc2lnblRpbWVNZXRhZGF0YVNldHRpbmdzRm9ySGVhZGVyRmFjZXQiLCJkZXNpZ25UaW1lTWV0YWRhdGEiLCJEZWZhdWx0IiwiTm90QWRhcHRhYmxlVHJlZSIsImRlc2lnblRpbWUiLCJmbGV4U2V0dGluZ3MiLCJkZXNpZ250aW1lIiwiTm90QWRhcHRhYmxlIiwiTm90QWRhcHRhYmxlVmlzaWJpbGl0eSIsImNyZWF0ZVJlZmVyZW5jZUhlYWRlckZhY2V0IiwiSGlkZGVuIiwidmFsdWVPZiIsIkhlYWRlckZhY2V0SUQiLCJnZXRIZWFkZXJGYWNldEtleSIsImZhbGxiYWNrIiwiSUQiLCJ0b1N0cmluZyIsIkxhYmVsIiwidGFyZ2V0QW5ub3RhdGlvblZhbHVlIiwiVGFyZ2V0IiwidmFsdWUiLCJ0YXJnZXRBbm5vdGF0aW9uVHlwZSIsImdldFRhcmdldEFubm90YXRpb25UeXBlIiwiaGVhZGVyRm9ybURhdGEiLCJoZWFkZXJEYXRhUG9pbnREYXRhIiwiRmllbGRHcm91cCIsImdldEZpZWxkR3JvdXBGb3JtRGF0YSIsIkRhdGFQb2ludCIsImdldERhdGFQb2ludERhdGEiLCJ0eXBlIiwiQW5ub3RhdGlvbiIsImZhY2V0VHlwZSIsIlJlZmVyZW5jZSIsImlkIiwiY29udGFpbmVySWQiLCJIZWFkZXJGYWNldENvbnRhaW5lcklEIiwia2V5IiwidmlzaWJsZSIsImNvbXBpbGVCaW5kaW5nIiwibm90IiwiZXF1YWwiLCJhbm5vdGF0aW9uRXhwcmVzc2lvbiIsImFubm90YXRpb25QYXRoIiwiZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aCIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsInVuZGVmaW5lZCIsImNyZWF0ZUNvbGxlY3Rpb25IZWFkZXJGYWNldCIsImZhY2V0cyIsIkZhY2V0cyIsIkNvbGxlY3Rpb24iLCJhbm5vdGF0aW9uVHlwZSIsIk5vbmUiLCJhbm5vdGF0aW9uVHlwZU1hcCIsIkNoYXJ0IiwiSWRlbnRpZmljYXRpb24iLCJDb250YWN0IiwiQWRkcmVzcyIsIiR0YXJnZXQiLCJ0ZXJtIiwiRXJyb3IiLCJmb3JtRWxlbWVudHMiLCJpbnNlcnRDdXN0b21FbGVtZW50cyIsImdldEZvcm1FbGVtZW50c0Zyb21Bbm5vdGF0aW9ucyIsImdldEZvcm1FbGVtZW50c0Zyb21NYW5pZmVzdCIsIkhlYWRlckZhY2V0Rm9ybUlEIiwibGFiZWwiLCJhbm5vdGF0aW9uQmFzZWRGb3JtRWxlbWVudHMiLCJEYXRhIiwiZGF0YUZpZWxkIiwic2VtYW50aWNPYmplY3RBbm5vdGF0aW9uUGF0aCIsImdldFNlbWFudGljT2JqZWN0UGF0aCIsImlzVmFsdWVNdWx0aWxpbmVUZXh0IiwiVmFsdWUiLCJNdWx0aUxpbmVUZXh0IiwiRm9ybUVsZW1lbnRUeXBlIiwiS2V5SGVscGVyIiwiZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkIiwiQ29tbW9uIiwiaWRQcmVmaXgiLCJzZW1hbnRpY09iamVjdFBhdGgiLCJDb250ZW50IiwiVmlzdWFsaXphdGlvbiIsIlByb2dyZXNzSW5kaWNhdG9yIiwiUmF0aW5nSW5kaWNhdG9yIiwiZ2VuZXJhdGVCaW5kaW5nIiwicmVxdWVzdEdyb3VwSWQiLCJncm91cElkIiwiaW5kZXhPZiIsImN1c3RvbUhlYWRlckZhY2V0RGVmaW5pdGlvbiIsImhlYWRlckZhY2V0S2V5IiwiY3VzdG9tSGVhZGVyRmFjZXRJRCIsIkN1c3RvbUhlYWRlckZhY2V0SUQiLCJwb3NpdGlvbiIsInBsYWNlbWVudCIsIlBsYWNlbWVudCIsIkFmdGVyIiwiZnJhZ21lbnROYW1lIiwidGVtcGxhdGUiLCJuYW1lIiwidGl0bGUiLCJzdWJUaXRsZSIsImJpbmRpbmciLCJ0ZW1wbGF0ZUVkaXQiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCQTtBQUNBO0FBQ0E7QUFDQTtNQUVZQSxlOzthQUFBQSxlO0FBQUFBLElBQUFBLGU7QUFBQUEsSUFBQUEsZTtLQUFBQSxlLEtBQUFBLGU7OztNQUtBQyxTOzthQUFBQSxTO0FBQUFBLElBQUFBLFM7QUFBQUEsSUFBQUEsUztLQUFBQSxTLEtBQUFBLFM7OztNQUtBQyxrQjs7YUFBQUEsa0I7QUFBQUEsSUFBQUEsa0I7QUFBQUEsSUFBQUEsa0I7QUFBQUEsSUFBQUEsa0I7QUFBQUEsSUFBQUEsa0I7S0FBQUEsa0IsS0FBQUEsa0I7OztNQWlCUEMsbUI7O2FBQUFBLG1CO0FBQUFBLElBQUFBLG1CO0FBQUFBLElBQUFBLG1CO0FBQUFBLElBQUFBLG1CO0tBQUFBLG1C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QUFFakIsZUFBZSxDQUFDSSwyQkFBMkIsQ0FBQ0gsY0FBN0IsQ0FkbEI7QUFlTmlCLE1BQUFBLFlBQVksRUFBRWQsMkJBQTJCLENBQUNjO0FBZnBDLEtBQVA7QUFpQkEiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hbmlmZXN0SGVhZGVyRmFjZXQgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9NYW5pZmVzdFNldHRpbmdzXCI7XG5pbXBvcnQge1xuXHRDb25maWd1cmFibGVPYmplY3QsXG5cdENvbmZpZ3VyYWJsZVJlY29yZCxcblx0Q3VzdG9tRWxlbWVudCxcblx0aW5zZXJ0Q3VzdG9tRWxlbWVudHMsXG5cdFBsYWNlbWVudCxcblx0UG9zaXRpb25cbn0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9Db25maWd1cmFibGVPYmplY3RcIjtcbmltcG9ydCB7XG5cdERhdGFGaWVsZEFic3RyYWN0VHlwZXMsXG5cdERhdGFQb2ludCxcblx0RmFjZXRUeXBlcyxcblx0RmllbGRHcm91cCxcblx0UmVmZXJlbmNlRmFjZXRUeXBlcyxcblx0VUlBbm5vdGF0aW9uVHlwZXNcbn0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5pbXBvcnQgeyBDdXN0b21IZWFkZXJGYWNldElELCBIZWFkZXJGYWNldENvbnRhaW5lcklELCBIZWFkZXJGYWNldEZvcm1JRCwgSGVhZGVyRmFjZXRJRCB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2hlbHBlcnMvSURcIjtcbmltcG9ydCB7IGFubm90YXRpb25FeHByZXNzaW9uLCBCaW5kaW5nRXhwcmVzc2lvbiwgY29tcGlsZUJpbmRpbmcsIGVxdWFsLCBub3QgfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nRXhwcmVzc2lvblwiO1xuaW1wb3J0IHsgS2V5SGVscGVyIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9LZXlcIjtcbmltcG9ydCB7IEFubm90YXRpb25Gb3JtRWxlbWVudCwgRm9ybUVsZW1lbnQsIEZvcm1FbGVtZW50VHlwZSwgZ2V0Rm9ybUVsZW1lbnRzRnJvbU1hbmlmZXN0IH0gZnJvbSBcIi4uL0NvbW1vbi9Gb3JtXCI7XG5pbXBvcnQgeyBnZXRTZW1hbnRpY09iamVjdFBhdGggfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9hbm5vdGF0aW9ucy9EYXRhRmllbGRcIjtcbmltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSBcIi4uLy4uLy4uL2hlbHBlcnMvU3RhYmxlSWRIZWxwZXJcIjtcbmltcG9ydCBDb252ZXJ0ZXJDb250ZXh0IGZyb20gXCIuLi8uLi9Db252ZXJ0ZXJDb250ZXh0XCI7XG5cbi8vIHJlZ2lvbiBkZWZpbml0aW9uc1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBEZWZpbml0aW9uczogSGVhZGVyIEZhY2V0IFR5cGVzLCBHZW5lcmljIE9QIEhlYWRlciBGYWNldCwgTWFuaWZlc3QgUHJvcGVydGllcyBmb3IgQ3VzdG9tIEhlYWRlciBGYWNldFxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmV4cG9ydCBlbnVtIEhlYWRlckZhY2V0VHlwZSB7XG5cdEFubm90YXRpb24gPSBcIkFubm90YXRpb25cIixcblx0WE1MRnJhZ21lbnQgPSBcIlhNTEZyYWdtZW50XCJcbn1cblxuZXhwb3J0IGVudW0gRmFjZXRUeXBlIHtcblx0UmVmZXJlbmNlID0gXCJSZWZlcmVuY2VcIixcblx0Q29sbGVjdGlvbiA9IFwiQ29sbGVjdGlvblwiXG59XG5cbmV4cG9ydCBlbnVtIEZsZXhEZXNpZ25UaW1lVHlwZSB7XG5cdERlZmF1bHQgPSBcIkRlZmF1bHRcIixcblx0Tm90QWRhcHRhYmxlID0gXCJub3QtYWRhcHRhYmxlXCIsIC8vIGRpc2FibGUgYWxsIGFjdGlvbnMgb24gdGhhdCBpbnN0YW5jZVxuXHROb3RBZGFwdGFibGVUcmVlID0gXCJub3QtYWRhcHRhYmxlLXRyZWVcIiwgLy8gZGlzYWJsZSBhbGwgYWN0aW9ucyBvbiB0aGF0IGluc3RhbmNlIGFuZCBvbiBhbGwgY2hpbGRyZW4gb2YgdGhhdCBpbnN0YW5jZVxuXHROb3RBZGFwdGFibGVWaXNpYmlsaXR5ID0gXCJub3QtYWRhcHRhYmxlLXZpc2liaWxpdHlcIiAvLyBkaXNhYmxlIGFsbCBhY3Rpb25zIHRoYXQgaW5mbHVlbmNlIHRoZSB2aXNpYmlsaXR5LCBuYW1lbHkgcmV2ZWFsIGFuZCByZW1vdmVcbn1cblxuZXhwb3J0IHR5cGUgRmxleFNldHRpbmdzID0ge1xuXHRkZXNpZ250aW1lPzogRmxleERlc2lnblRpbWVUeXBlO1xufTtcblxudHlwZSBIZWFkZXJGb3JtRGF0YSA9IHtcblx0aWQ6IHN0cmluZztcblx0bGFiZWw/OiBzdHJpbmc7XG5cdGZvcm1FbGVtZW50czogRm9ybUVsZW1lbnRbXTtcbn07XG5cbmVudW0gSGVhZGVyRGF0YVBvaW50VHlwZSB7XG5cdFByb2dyZXNzSW5kaWNhdG9yID0gXCJQcm9ncmVzc0luZGljYXRvclwiLFxuXHRSYXRpbmdJbmRpY2F0b3IgPSBcIlJhdGluZ0luZGljYXRvclwiLFxuXHRDb250ZW50ID0gXCJDb250ZW50XCJcbn1cblxudHlwZSBIZWFkZXJEYXRhUG9pbnREYXRhID0ge1xuXHR0eXBlOiBIZWFkZXJEYXRhUG9pbnRUeXBlO1xufTtcblxuZW51bSBUYXJnZXRBbm5vdGF0aW9uVHlwZSB7XG5cdE5vbmUgPSBcIk5vbmVcIixcblx0RGF0YVBvaW50ID0gXCJEYXRhUG9pbnRcIixcblx0Q2hhcnQgPSBcIkNoYXJ0XCIsXG5cdElkZW50aWZpY2F0aW9uID0gXCJJZGVudGlmaWNhdGlvblwiLFxuXHRDb250YWN0ID0gXCJDb250YWN0XCIsXG5cdEFkZHJlc3MgPSBcIkFkZHJlc3NcIixcblx0RmllbGRHcm91cCA9IFwiRmllbGRHcm91cFwiXG59XG5cbnR5cGUgQmFzZUhlYWRlckZhY2V0ID0gQ29uZmlndXJhYmxlT2JqZWN0ICYge1xuXHR0eXBlPzogSGVhZGVyRmFjZXRUeXBlOyAvLyBNYW5pZmVzdCBvciBNZXRhZGF0YVxuXHRpZDogc3RyaW5nO1xuXHRjb250YWluZXJJZDogc3RyaW5nO1xuXHRhbm5vdGF0aW9uUGF0aD86IHN0cmluZztcblx0ZmxleFNldHRpbmdzOiBGbGV4U2V0dGluZ3M7XG5cdHN0YXNoZWQ6IGJvb2xlYW47XG5cdHZpc2libGU6IEJpbmRpbmdFeHByZXNzaW9uPGJvb2xlYW4+O1xuXHR0YXJnZXRBbm5vdGF0aW9uVmFsdWU/OiBzdHJpbmc7XG5cdHRhcmdldEFubm90YXRpb25UeXBlPzogVGFyZ2V0QW5ub3RhdGlvblR5cGU7XG59O1xuXG50eXBlIEJhc2VSZWZlcmVuY2VGYWNldCA9IEJhc2VIZWFkZXJGYWNldCAmIHtcblx0ZmFjZXRUeXBlOiBGYWNldFR5cGUuUmVmZXJlbmNlO1xufTtcblxudHlwZSBGaWVsZEdyb3VwRmFjZXQgPSBCYXNlUmVmZXJlbmNlRmFjZXQgJiB7XG5cdGhlYWRlckZvcm1EYXRhPzogSGVhZGVyRm9ybURhdGE7XG59O1xuXG50eXBlIERhdGFQb2ludEZhY2V0ID0gQmFzZVJlZmVyZW5jZUZhY2V0ICYge1xuXHRoZWFkZXJEYXRhUG9pbnREYXRhPzogSGVhZGVyRGF0YVBvaW50RGF0YTtcbn07XG5cbnR5cGUgUmVmZXJlbmNlRmFjZXQgPSBGaWVsZEdyb3VwRmFjZXQgfCBEYXRhUG9pbnRGYWNldDtcblxuZXhwb3J0IHR5cGUgQ29sbGVjdGlvbkZhY2V0ID0gQmFzZUhlYWRlckZhY2V0ICYge1xuXHRmYWNldFR5cGU6IEZhY2V0VHlwZS5Db2xsZWN0aW9uO1xuXHRmYWNldHM6IFJlZmVyZW5jZUZhY2V0W107XG59O1xuXG5leHBvcnQgdHlwZSBPYmplY3RQYWdlSGVhZGVyRmFjZXQgPSBSZWZlcmVuY2VGYWNldCB8IENvbGxlY3Rpb25GYWNldDtcblxuZXhwb3J0IHR5cGUgQ3VzdG9tT2JqZWN0UGFnZUhlYWRlckZhY2V0ID0gQ3VzdG9tRWxlbWVudDxPYmplY3RQYWdlSGVhZGVyRmFjZXQ+ICYge1xuXHRmcmFnbWVudE5hbWU/OiBzdHJpbmc7XG5cdHRpdGxlPzogc3RyaW5nO1xuXHRzdWJUaXRsZT86IHN0cmluZztcblx0c3Rhc2hlZD86IGJvb2xlYW47XG5cdGJpbmRpbmc/OiBzdHJpbmc7XG5cdHRlbXBsYXRlRWRpdD86IHN0cmluZztcbn07XG5cbi8vIGVuZHJlZ2lvbiBkZWZpbml0aW9uc1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIENvbGxlY3QgQWxsIEhlYWRlciBGYWNldHM6IEN1c3RvbSAodmlhIE1hbmlmZXN0KSBhbmQgQW5ub3RhdGlvbiBCYXNlZCAodmlhIE1ldGFtb2RlbClcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vKipcbiAqIFJldHJpZXZlIGhlYWRlciBmYWNldHMgZnJvbSBhbm5vdGF0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge0NvbnZlcnRlckNvbnRleHR9IGNvbnZlcnRlckNvbnRleHRcbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0UGFnZUhlYWRlckZhY2V0fSBIZWFkZXIgZmFjZXRzIGZyb20gYW5ub3RhdGlvbnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEhlYWRlckZhY2V0c0Zyb21Bbm5vdGF0aW9ucyhjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogT2JqZWN0UGFnZUhlYWRlckZhY2V0W10ge1xuXHRjb25zdCBoZWFkZXJGYWNldHM6IE9iamVjdFBhZ2VIZWFkZXJGYWNldFtdID0gW107XG5cdGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZSgpLmFubm90YXRpb25zPy5VST8uSGVhZGVyRmFjZXRzPy5mb3JFYWNoKGZhY2V0ID0+IHtcblx0XHRjb25zdCBoZWFkZXJGYWNldDogT2JqZWN0UGFnZUhlYWRlckZhY2V0IHwgdW5kZWZpbmVkID0gY3JlYXRlSGVhZGVyRmFjZXQoZmFjZXQsIGNvbnZlcnRlckNvbnRleHQpO1xuXHRcdGlmIChoZWFkZXJGYWNldCkge1xuXHRcdFx0aGVhZGVyRmFjZXRzLnB1c2goaGVhZGVyRmFjZXQpO1xuXHRcdH1cblx0fSk7XG5cblx0cmV0dXJuIGhlYWRlckZhY2V0cztcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZSBjdXN0b20gaGVhZGVyIGZhY2V0cyBmcm9tIG1hbmlmZXN0LlxuICpcbiAqIEBwYXJhbSB7Q29uZmlndXJhYmxlUmVjb3JkPE1hbmlmZXN0SGVhZGVyRmFjZXQ+fSBtYW5pZmVzdEN1c3RvbUhlYWRlckZhY2V0c1xuICpcbiAqIEByZXR1cm5zIHtSZWNvcmQ8c3RyaW5nLCBDdXN0b21PYmplY3RQYWdlSGVhZGVyRmFjZXQ+fSBIZWFkZXJGYWNldHMgZnJvbSBtYW5pZmVzdFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0SGVhZGVyRmFjZXRzRnJvbU1hbmlmZXN0KFxuXHRtYW5pZmVzdEN1c3RvbUhlYWRlckZhY2V0czogQ29uZmlndXJhYmxlUmVjb3JkPE1hbmlmZXN0SGVhZGVyRmFjZXQ+XG4pOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21PYmplY3RQYWdlSGVhZGVyRmFjZXQ+IHtcblx0Y29uc3QgY3VzdG9tSGVhZGVyRmFjZXRzOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21PYmplY3RQYWdlSGVhZGVyRmFjZXQ+ID0ge307XG5cblx0T2JqZWN0LmtleXMobWFuaWZlc3RDdXN0b21IZWFkZXJGYWNldHMpLmZvckVhY2gobWFuaWZlc3RIZWFkZXJGYWNldEtleSA9PiB7XG5cdFx0Y29uc3QgY3VzdG9tSGVhZGVyRmFjZXQ6IE1hbmlmZXN0SGVhZGVyRmFjZXQgPSBtYW5pZmVzdEN1c3RvbUhlYWRlckZhY2V0c1ttYW5pZmVzdEhlYWRlckZhY2V0S2V5XTtcblx0XHRjdXN0b21IZWFkZXJGYWNldHNbbWFuaWZlc3RIZWFkZXJGYWNldEtleV0gPSBjcmVhdGVDdXN0b21IZWFkZXJGYWNldChjdXN0b21IZWFkZXJGYWNldCwgbWFuaWZlc3RIZWFkZXJGYWNldEtleSk7XG5cdH0pO1xuXG5cdHJldHVybiBjdXN0b21IZWFkZXJGYWNldHM7XG59XG5cbi8qKlxuICogUmV0cmlldmUgc3Rhc2hlZCBzZXR0aW5ncyBmb3IgaGVhZGVyIGZhY2V0cyBmcm9tIG1hbmlmZXN0LlxuICpcbiAqIEBwYXJhbSB7RmFjZXRUeXBlc30gZmFjZXREZWZpbml0aW9uXG4gKiBAcGFyYW0ge0ZhY2V0VHlwZXN9IGNvbGxlY3Rpb25GYWNldERlZmluaXRpb25cbiAqIEBwYXJhbSB7Q29udmVydGVyQ29udGV4dH0gY29udmVydGVyQ29udGV4dFxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBTdGFzaGVkIHNldHRpbmcgZm9yIGhlYWRlciBmYWNldCBvciBmYWxzZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3Rhc2hlZFNldHRpbmdzRm9ySGVhZGVyRmFjZXQoXG5cdGZhY2V0RGVmaW5pdGlvbjogRmFjZXRUeXBlcyxcblx0Y29sbGVjdGlvbkZhY2V0RGVmaW5pdGlvbjogRmFjZXRUeXBlcyxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogYm9vbGVhbiB7XG5cdC8vIFdoZW4gYSBIZWFkZXJGYWNldCBpcyBuZXN0ZWQgaW5zaWRlIGEgQ29sbGVjdGlvbkZhY2V0LCBzdGFzaGluZyBpcyBub3Qgc3VwcG9ydGVkXG5cdGlmIChcblx0XHRmYWNldERlZmluaXRpb24uJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZUZhY2V0ICYmXG5cdFx0Y29sbGVjdGlvbkZhY2V0RGVmaW5pdGlvbi4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuQ29sbGVjdGlvbkZhY2V0XG5cdCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRjb25zdCBoZWFkZXJGYWNldElEID0gZ2VuZXJhdGUoW3sgRmFjZXQ6IGZhY2V0RGVmaW5pdGlvbiB9XSk7XG5cdGNvbnN0IGhlYWRlckZhY2V0c0NvbnRyb2xDb25maWcgPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpLmdldEhlYWRlckZhY2V0cygpO1xuXHRjb25zdCBzdGFzaGVkU2V0dGluZyA9IGhlYWRlckZhY2V0c0NvbnRyb2xDb25maWdbaGVhZGVyRmFjZXRJRF0/LnN0YXNoZWQ7XG5cdHJldHVybiBzdGFzaGVkU2V0dGluZyA9PT0gdHJ1ZTtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZSBmbGV4aWJpbGl0eSBkZXNpZ250aW1lIHNldHRpbmdzIGZyb20gbWFuaWZlc3QuXG4gKlxuICogQHBhcmFtIHtGYWNldFR5cGVzfSBmYWNldERlZmluaXRpb25cbiAqIEBwYXJhbSB7RmFjZXRUeXBlc30gY29sbGVjdGlvbkZhY2V0RGVmaW5pdGlvblxuICogQHBhcmFtIHtDb252ZXJ0ZXJDb250ZXh0fSBjb252ZXJ0ZXJDb250ZXh0XG4gKlxuICogQHJldHVybnMge0ZsZXhEZXNpZ25UaW1lVHlwZX0gRGVzaWdudGltZSBzZXR0aW5nIG9yIGRlZmF1bHRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldERlc2lnblRpbWVNZXRhZGF0YVNldHRpbmdzRm9ySGVhZGVyRmFjZXQoXG5cdGZhY2V0RGVmaW5pdGlvbjogRmFjZXRUeXBlcyxcblx0Y29sbGVjdGlvbkZhY2V0RGVmaW5pdGlvbjogRmFjZXRUeXBlcyxcblx0Y29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dFxuKTogRmxleERlc2lnblRpbWVUeXBlIHtcblx0bGV0IGRlc2lnblRpbWVNZXRhZGF0YTogRmxleERlc2lnblRpbWVUeXBlID0gRmxleERlc2lnblRpbWVUeXBlLkRlZmF1bHQ7XG5cdGNvbnN0IGhlYWRlckZhY2V0SUQgPSBnZW5lcmF0ZShbeyBGYWNldDogZmFjZXREZWZpbml0aW9uIH1dKTtcblxuXHQvLyBGb3IgSGVhZGVyRmFjZXRzIG5lc3RlZCBpbnNpZGUgQ29sbGVjdGlvbkZhY2V0IFJUQSBzaG91bGQgYmUgZGlzYWJsZWQsIHRoZXJlZm9yZSBzZXQgdG8gXCJub3QtYWRhcHRhYmxlLXRyZWVcIlxuXHRpZiAoXG5cdFx0ZmFjZXREZWZpbml0aW9uLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5SZWZlcmVuY2VGYWNldCAmJlxuXHRcdGNvbGxlY3Rpb25GYWNldERlZmluaXRpb24uJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkNvbGxlY3Rpb25GYWNldFxuXHQpIHtcblx0XHRkZXNpZ25UaW1lTWV0YWRhdGEgPSBGbGV4RGVzaWduVGltZVR5cGUuTm90QWRhcHRhYmxlVHJlZTtcblx0fSBlbHNlIHtcblx0XHRjb25zdCBoZWFkZXJGYWNldHNDb250cm9sQ29uZmlnID0gY29udmVydGVyQ29udGV4dC5nZXRNYW5pZmVzdFdyYXBwZXIoKS5nZXRIZWFkZXJGYWNldHMoKTtcblx0XHRpZiAoaGVhZGVyRmFjZXRJRCkge1xuXHRcdFx0Y29uc3QgZGVzaWduVGltZSA9IGhlYWRlckZhY2V0c0NvbnRyb2xDb25maWdbaGVhZGVyRmFjZXRJRF0/LmZsZXhTZXR0aW5ncz8uZGVzaWdudGltZTtcblx0XHRcdHN3aXRjaCAoZGVzaWduVGltZSkge1xuXHRcdFx0XHRjYXNlIEZsZXhEZXNpZ25UaW1lVHlwZS5Ob3RBZGFwdGFibGU6XG5cdFx0XHRcdGNhc2UgRmxleERlc2lnblRpbWVUeXBlLk5vdEFkYXB0YWJsZVRyZWU6XG5cdFx0XHRcdGNhc2UgRmxleERlc2lnblRpbWVUeXBlLk5vdEFkYXB0YWJsZVZpc2liaWxpdHk6XG5cdFx0XHRcdFx0ZGVzaWduVGltZU1ldGFkYXRhID0gZGVzaWduVGltZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIGRlc2lnblRpbWVNZXRhZGF0YTtcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBDb252ZXJ0ICYgQnVpbGQgQW5ub3RhdGlvbiBCYXNlZCBIZWFkZXIgRmFjZXRzXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmZ1bmN0aW9uIGNyZWF0ZVJlZmVyZW5jZUhlYWRlckZhY2V0KFxuXHRmYWNldERlZmluaXRpb246IEZhY2V0VHlwZXMsXG5cdGNvbGxlY3Rpb25GYWNldERlZmluaXRpb246IEZhY2V0VHlwZXMsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHRcbik6IFJlZmVyZW5jZUZhY2V0IHwgdW5kZWZpbmVkIHtcblx0aWYgKGZhY2V0RGVmaW5pdGlvbi4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuUmVmZXJlbmNlRmFjZXQgJiYgIShmYWNldERlZmluaXRpb24uYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4/LnZhbHVlT2YoKSA9PT0gdHJ1ZSkpIHtcblx0XHRjb25zdCBoZWFkZXJGYWNldElEID0gSGVhZGVyRmFjZXRJRCh7IEZhY2V0OiBmYWNldERlZmluaXRpb24gfSksXG5cdFx0XHRnZXRIZWFkZXJGYWNldEtleSA9IChmYWNldERlZmluaXRpb246IEZhY2V0VHlwZXMsIGZhbGxiYWNrOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuXHRcdFx0XHRyZXR1cm4gZmFjZXREZWZpbml0aW9uLklEPy50b1N0cmluZygpIHx8IGZhY2V0RGVmaW5pdGlvbi5MYWJlbD8udG9TdHJpbmcoKSB8fCBmYWxsYmFjaztcblx0XHRcdH0sXG5cdFx0XHR0YXJnZXRBbm5vdGF0aW9uVmFsdWUgPSBmYWNldERlZmluaXRpb24uVGFyZ2V0LnZhbHVlLFxuXHRcdFx0dGFyZ2V0QW5ub3RhdGlvblR5cGUgPSBnZXRUYXJnZXRBbm5vdGF0aW9uVHlwZShmYWNldERlZmluaXRpb24pO1xuXG5cdFx0bGV0IGhlYWRlckZvcm1EYXRhOiBIZWFkZXJGb3JtRGF0YSB8IHVuZGVmaW5lZDtcblx0XHRsZXQgaGVhZGVyRGF0YVBvaW50RGF0YTogSGVhZGVyRGF0YVBvaW50RGF0YSB8IHVuZGVmaW5lZDtcblxuXHRcdHN3aXRjaCAodGFyZ2V0QW5ub3RhdGlvblR5cGUpIHtcblx0XHRcdGNhc2UgVGFyZ2V0QW5ub3RhdGlvblR5cGUuRmllbGRHcm91cDpcblx0XHRcdFx0aGVhZGVyRm9ybURhdGEgPSBnZXRGaWVsZEdyb3VwRm9ybURhdGEoZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgVGFyZ2V0QW5ub3RhdGlvblR5cGUuRGF0YVBvaW50OlxuXHRcdFx0XHRoZWFkZXJEYXRhUG9pbnREYXRhID0gZ2V0RGF0YVBvaW50RGF0YShmYWNldERlZmluaXRpb24pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdC8vIFRvRG86IEhhbmRsZSBvdGhlciBjYXNlc1xuXHRcdH1cblxuXHRcdGNvbnN0IHsgYW5ub3RhdGlvbnMgfSA9IGZhY2V0RGVmaW5pdGlvbjtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dHlwZTogSGVhZGVyRmFjZXRUeXBlLkFubm90YXRpb24sXG5cdFx0XHRmYWNldFR5cGU6IEZhY2V0VHlwZS5SZWZlcmVuY2UsXG5cdFx0XHRpZDogaGVhZGVyRmFjZXRJRCxcblx0XHRcdGNvbnRhaW5lcklkOiBIZWFkZXJGYWNldENvbnRhaW5lcklEKHsgRmFjZXQ6IGZhY2V0RGVmaW5pdGlvbiB9KSxcblx0XHRcdGtleTogZ2V0SGVhZGVyRmFjZXRLZXkoZmFjZXREZWZpbml0aW9uLCBoZWFkZXJGYWNldElEKSxcblx0XHRcdGZsZXhTZXR0aW5nczoge1xuXHRcdFx0XHRkZXNpZ250aW1lOiBnZXREZXNpZ25UaW1lTWV0YWRhdGFTZXR0aW5nc0ZvckhlYWRlckZhY2V0KGZhY2V0RGVmaW5pdGlvbiwgY29sbGVjdGlvbkZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dClcblx0XHRcdH0sXG5cdFx0XHRzdGFzaGVkOiBnZXRTdGFzaGVkU2V0dGluZ3NGb3JIZWFkZXJGYWNldChmYWNldERlZmluaXRpb24sIGNvbGxlY3Rpb25GYWNldERlZmluaXRpb24sIGNvbnZlcnRlckNvbnRleHQpLFxuXHRcdFx0dmlzaWJsZTogY29tcGlsZUJpbmRpbmcobm90KGVxdWFsKGFubm90YXRpb25FeHByZXNzaW9uKGFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkpLCB0cnVlKSkpLFxuXHRcdFx0YW5ub3RhdGlvblBhdGg6IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChmYWNldERlZmluaXRpb24uZnVsbHlRdWFsaWZpZWROYW1lKSArIFwiL1wiLFxuXHRcdFx0dGFyZ2V0QW5ub3RhdGlvblZhbHVlLFxuXHRcdFx0dGFyZ2V0QW5ub3RhdGlvblR5cGUsXG5cdFx0XHRoZWFkZXJGb3JtRGF0YSxcblx0XHRcdGhlYWRlckRhdGFQb2ludERhdGFcblx0XHR9O1xuXHR9XG5cblx0cmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29sbGVjdGlvbkhlYWRlckZhY2V0KFxuXHRjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBDb2xsZWN0aW9uRmFjZXQgfCB1bmRlZmluZWQge1xuXHRpZiAoY29sbGVjdGlvbkZhY2V0RGVmaW5pdGlvbi4kVHlwZSA9PT0gVUlBbm5vdGF0aW9uVHlwZXMuQ29sbGVjdGlvbkZhY2V0KSB7XG5cdFx0Y29uc3QgZmFjZXRzOiBSZWZlcmVuY2VGYWNldFtdID0gW10sXG5cdFx0XHRoZWFkZXJGYWNldElEID0gSGVhZGVyRmFjZXRJRCh7IEZhY2V0OiBjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uIH0pLFxuXHRcdFx0Z2V0SGVhZGVyRmFjZXRLZXkgPSAoZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLCBmYWxsYmFjazogc3RyaW5nKTogc3RyaW5nID0+IHtcblx0XHRcdFx0cmV0dXJuIGZhY2V0RGVmaW5pdGlvbi5JRD8udG9TdHJpbmcoKSB8fCBmYWNldERlZmluaXRpb24uTGFiZWw/LnRvU3RyaW5nKCkgfHwgZmFsbGJhY2s7XG5cdFx0XHR9O1xuXG5cdFx0Y29sbGVjdGlvbkZhY2V0RGVmaW5pdGlvbi5GYWNldHMuZm9yRWFjaChmYWNldERlZmluaXRpb24gPT4ge1xuXHRcdFx0Y29uc3QgZmFjZXQ6IFJlZmVyZW5jZUZhY2V0IHwgdW5kZWZpbmVkID0gY3JlYXRlUmVmZXJlbmNlSGVhZGVyRmFjZXQoXG5cdFx0XHRcdGZhY2V0RGVmaW5pdGlvbixcblx0XHRcdFx0Y29sbGVjdGlvbkZhY2V0RGVmaW5pdGlvbixcblx0XHRcdFx0Y29udmVydGVyQ29udGV4dFxuXHRcdFx0KTtcblx0XHRcdGlmIChmYWNldCkge1xuXHRcdFx0XHRmYWNldHMucHVzaChmYWNldCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dHlwZTogSGVhZGVyRmFjZXRUeXBlLkFubm90YXRpb24sXG5cdFx0XHRmYWNldFR5cGU6IEZhY2V0VHlwZS5Db2xsZWN0aW9uLFxuXHRcdFx0aWQ6IGhlYWRlckZhY2V0SUQsXG5cdFx0XHRjb250YWluZXJJZDogSGVhZGVyRmFjZXRDb250YWluZXJJRCh7IEZhY2V0OiBjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uIH0pLFxuXHRcdFx0a2V5OiBnZXRIZWFkZXJGYWNldEtleShjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uLCBoZWFkZXJGYWNldElEKSxcblx0XHRcdGZsZXhTZXR0aW5nczoge1xuXHRcdFx0XHRkZXNpZ250aW1lOiBnZXREZXNpZ25UaW1lTWV0YWRhdGFTZXR0aW5nc0ZvckhlYWRlckZhY2V0KFxuXHRcdFx0XHRcdGNvbGxlY3Rpb25GYWNldERlZmluaXRpb24sXG5cdFx0XHRcdFx0Y29sbGVjdGlvbkZhY2V0RGVmaW5pdGlvbixcblx0XHRcdFx0XHRjb252ZXJ0ZXJDb250ZXh0XG5cdFx0XHRcdClcblx0XHRcdH0sXG5cdFx0XHRzdGFzaGVkOiBnZXRTdGFzaGVkU2V0dGluZ3NGb3JIZWFkZXJGYWNldChjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uLCBjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRcdHZpc2libGU6IGNvbXBpbGVCaW5kaW5nKG5vdChlcXVhbChhbm5vdGF0aW9uRXhwcmVzc2lvbihjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uLmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkpLCB0cnVlKSkpLFxuXHRcdFx0YW5ub3RhdGlvblBhdGg6IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChjb2xsZWN0aW9uRmFjZXREZWZpbml0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZSkgKyBcIi9cIixcblx0XHRcdGZhY2V0c1xuXHRcdH07XG5cdH1cblxuXHRyZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBnZXRUYXJnZXRBbm5vdGF0aW9uVHlwZShmYWNldERlZmluaXRpb246IEZhY2V0VHlwZXMpOiBUYXJnZXRBbm5vdGF0aW9uVHlwZSB7XG5cdGxldCBhbm5vdGF0aW9uVHlwZSA9IFRhcmdldEFubm90YXRpb25UeXBlLk5vbmU7XG5cdGNvbnN0IGFubm90YXRpb25UeXBlTWFwOiBSZWNvcmQ8c3RyaW5nLCBUYXJnZXRBbm5vdGF0aW9uVHlwZT4gPSB7XG5cdFx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhUG9pbnRcIjogVGFyZ2V0QW5ub3RhdGlvblR5cGUuRGF0YVBvaW50LFxuXHRcdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ2hhcnRcIjogVGFyZ2V0QW5ub3RhdGlvblR5cGUuQ2hhcnQsXG5cdFx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5JZGVudGlmaWNhdGlvblwiOiBUYXJnZXRBbm5vdGF0aW9uVHlwZS5JZGVudGlmaWNhdGlvbixcblx0XHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW11bmljYXRpb24udjEuQ29udGFjdFwiOiBUYXJnZXRBbm5vdGF0aW9uVHlwZS5Db250YWN0LFxuXHRcdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbXVuaWNhdGlvbi52MS5BZGRyZXNzXCI6IFRhcmdldEFubm90YXRpb25UeXBlLkFkZHJlc3MsXG5cdFx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5GaWVsZEdyb3VwXCI6IFRhcmdldEFubm90YXRpb25UeXBlLkZpZWxkR3JvdXBcblx0fTtcblx0Ly8gUmVmZXJlbmNlVVJMRmFjZXQgYW5kIENvbGxlY3Rpb25GYWNldCBkbyBub3QgaGF2ZSBUYXJnZXQgcHJvcGVydHkuXG5cdGlmIChmYWNldERlZmluaXRpb24uJFR5cGUgIT09IFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZVVSTEZhY2V0ICYmIGZhY2V0RGVmaW5pdGlvbi4kVHlwZSAhPT0gVUlBbm5vdGF0aW9uVHlwZXMuQ29sbGVjdGlvbkZhY2V0KSB7XG5cdFx0YW5ub3RhdGlvblR5cGUgPSBhbm5vdGF0aW9uVHlwZU1hcFtmYWNldERlZmluaXRpb24uVGFyZ2V0Py4kdGFyZ2V0Py50ZXJtXSB8fCBUYXJnZXRBbm5vdGF0aW9uVHlwZS5Ob25lO1xuXHR9XG5cblx0cmV0dXJuIGFubm90YXRpb25UeXBlO1xufVxuXG5mdW5jdGlvbiBnZXRGaWVsZEdyb3VwRm9ybURhdGEoZmFjZXREZWZpbml0aW9uOiBSZWZlcmVuY2VGYWNldFR5cGVzLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogSGVhZGVyRm9ybURhdGEge1xuXHQvLyBzcGxpdCBpbiB0aGlzIGZyb20gYW5ub3RhdGlvbiArIGdldEZpZWxkR3JvdXBGcm9tRGVmYXVsdFxuXHRpZiAoIWZhY2V0RGVmaW5pdGlvbikge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBnZXQgRmllbGRHcm91cCBmb3JtIGRhdGEgd2l0aG91dCBmYWNldCBkZWZpbml0aW9uXCIpO1xuXHR9XG5cblx0Y29uc3QgZm9ybUVsZW1lbnRzID0gaW5zZXJ0Q3VzdG9tRWxlbWVudHMoXG5cdFx0Z2V0Rm9ybUVsZW1lbnRzRnJvbUFubm90YXRpb25zKGZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dCksXG5cdFx0Z2V0Rm9ybUVsZW1lbnRzRnJvbU1hbmlmZXN0KGZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dClcblx0KTtcblxuXHRyZXR1cm4ge1xuXHRcdGlkOiBIZWFkZXJGYWNldEZvcm1JRCh7IEZhY2V0OiBmYWNldERlZmluaXRpb24gfSksXG5cdFx0bGFiZWw6IGZhY2V0RGVmaW5pdGlvbi5MYWJlbD8udG9TdHJpbmcoKSxcblx0XHRmb3JtRWxlbWVudHNcblx0fTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIG1hbmlmZXN0LWJhc2VkIEZvcm1FbGVtZW50cy5cbiAqXG4gKiBAcGFyYW0ge0ZhY2V0VHlwZX0gZmFjZXREZWZpbml0aW9uIFRoZSBkZWZpbml0aW9uIG9mIHRoZSBmYWNldFxuICogQHBhcmFtIHtDb252ZXJ0ZXJDb250ZXh0fSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dCBmb3IgdGhlIGZhY2V0XG4gKlxuICogQHJldHVybnMge0FycmF5fSBBbm5vdGF0aW9uLWJhc2VkIEZvcm1FbGVtZW50c1xuICovXG5mdW5jdGlvbiBnZXRGb3JtRWxlbWVudHNGcm9tQW5ub3RhdGlvbnMoZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogQW5ub3RhdGlvbkZvcm1FbGVtZW50W10ge1xuXHRjb25zdCBhbm5vdGF0aW9uQmFzZWRGb3JtRWxlbWVudHM6IEFubm90YXRpb25Gb3JtRWxlbWVudFtdID0gW107XG5cblx0Ly8gUmVmZXJlbmNlVVJMRmFjZXQgYW5kIENvbGxlY3Rpb25GYWNldCBkbyBub3QgaGF2ZSBUYXJnZXQgcHJvcGVydHkuXG5cdGlmIChmYWNldERlZmluaXRpb24uJFR5cGUgIT09IFVJQW5ub3RhdGlvblR5cGVzLlJlZmVyZW5jZVVSTEZhY2V0ICYmIGZhY2V0RGVmaW5pdGlvbi4kVHlwZSAhPT0gVUlBbm5vdGF0aW9uVHlwZXMuQ29sbGVjdGlvbkZhY2V0KSB7XG5cdFx0KGZhY2V0RGVmaW5pdGlvbi5UYXJnZXQ/LiR0YXJnZXQgYXMgRmllbGRHcm91cCk/LkRhdGEuZm9yRWFjaCgoZGF0YUZpZWxkOiBEYXRhRmllbGRBYnN0cmFjdFR5cGVzKSA9PiB7XG5cdFx0XHRpZiAoIShkYXRhRmllbGQuYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4/LnZhbHVlT2YoKSA9PT0gdHJ1ZSkpIHtcblx0XHRcdFx0Y29uc3Qgc2VtYW50aWNPYmplY3RBbm5vdGF0aW9uUGF0aCA9IGdldFNlbWFudGljT2JqZWN0UGF0aChjb252ZXJ0ZXJDb250ZXh0LCBkYXRhRmllbGQpO1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0ZGF0YUZpZWxkLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGQgfHxcblx0XHRcdFx0XHRkYXRhRmllbGQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhVcmwgfHxcblx0XHRcdFx0XHRkYXRhRmllbGQuJFR5cGUgPT09IFVJQW5ub3RhdGlvblR5cGVzLkRhdGFGaWVsZFdpdGhOYXZpZ2F0aW9uUGF0aFxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRjb25zdCB7IGFubm90YXRpb25zIH0gPSBkYXRhRmllbGQ7XG5cdFx0XHRcdFx0YW5ub3RhdGlvbkJhc2VkRm9ybUVsZW1lbnRzLnB1c2goe1xuXHRcdFx0XHRcdFx0aXNWYWx1ZU11bHRpbGluZVRleHQ6IGRhdGFGaWVsZC5WYWx1ZT8uJHRhcmdldD8uYW5ub3RhdGlvbnM/LlVJPy5NdWx0aUxpbmVUZXh0Py52YWx1ZU9mKCkgPT09IHRydWUsXG5cdFx0XHRcdFx0XHR0eXBlOiBGb3JtRWxlbWVudFR5cGUuQW5ub3RhdGlvbixcblx0XHRcdFx0XHRcdGtleTogS2V5SGVscGVyLmdlbmVyYXRlS2V5RnJvbURhdGFGaWVsZChkYXRhRmllbGQpLFxuXHRcdFx0XHRcdFx0dmlzaWJsZTogY29tcGlsZUJpbmRpbmcobm90KGVxdWFsKGFubm90YXRpb25FeHByZXNzaW9uKGFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkpLCB0cnVlKSkpLFxuXHRcdFx0XHRcdFx0bGFiZWw6IGRhdGFGaWVsZC5WYWx1ZT8uJHRhcmdldD8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uTGFiZWwgfHwgZGF0YUZpZWxkLkxhYmVsLFxuXHRcdFx0XHRcdFx0aWRQcmVmaXg6IEhlYWRlckZhY2V0Rm9ybUlEKHsgRmFjZXQ6IGZhY2V0RGVmaW5pdGlvbiB9LCBkYXRhRmllbGQpLFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvblBhdGg6IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChkYXRhRmllbGQuZnVsbHlRdWFsaWZpZWROYW1lKSArIFwiL1wiLFxuXHRcdFx0XHRcdFx0c2VtYW50aWNPYmplY3RQYXRoOiBzZW1hbnRpY09iamVjdEFubm90YXRpb25QYXRoXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoZGF0YUZpZWxkLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBbm5vdGF0aW9uKSB7XG5cdFx0XHRcdFx0Y29uc3QgeyBhbm5vdGF0aW9ucyB9ID0gZGF0YUZpZWxkO1xuXHRcdFx0XHRcdGFubm90YXRpb25CYXNlZEZvcm1FbGVtZW50cy5wdXNoKHtcblx0XHRcdFx0XHRcdC8vIEZJWE1FIHRoaXMgaXMgd3Jvbmdcblx0XHRcdFx0XHRcdGlzVmFsdWVNdWx0aWxpbmVUZXh0OiAoZGF0YUZpZWxkLlRhcmdldD8uJHRhcmdldD8uYW5ub3RhdGlvbnM/LlVJIGFzIGFueSk/Lk11bHRpTGluZVRleHQ/LnZhbHVlT2YoKSA9PT0gdHJ1ZSxcblx0XHRcdFx0XHRcdHR5cGU6IEZvcm1FbGVtZW50VHlwZS5Bbm5vdGF0aW9uLFxuXHRcdFx0XHRcdFx0a2V5OiBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGRhdGFGaWVsZCksXG5cdFx0XHRcdFx0XHR2aXNpYmxlOiBjb21waWxlQmluZGluZyhub3QoZXF1YWwoYW5ub3RhdGlvbkV4cHJlc3Npb24oYW5ub3RhdGlvbnM/LlVJPy5IaWRkZW4/LnZhbHVlT2YoKSksIHRydWUpKSksXG5cdFx0XHRcdFx0XHRsYWJlbDogZGF0YUZpZWxkLlRhcmdldD8uJHRhcmdldD8uYW5ub3RhdGlvbnM/LkNvbW1vbj8uTGFiZWw/LnRvU3RyaW5nKCkgfHwgZGF0YUZpZWxkLkxhYmVsPy50b1N0cmluZygpLFxuXHRcdFx0XHRcdFx0aWRQcmVmaXg6IEhlYWRlckZhY2V0Rm9ybUlEKHsgRmFjZXQ6IGZhY2V0RGVmaW5pdGlvbiB9LCBkYXRhRmllbGQpLFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvblBhdGg6IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aChkYXRhRmllbGQuZnVsbHlRdWFsaWZpZWROYW1lKSArIFwiL1wiLFxuXHRcdFx0XHRcdFx0c2VtYW50aWNPYmplY3RQYXRoOiBzZW1hbnRpY09iamVjdEFubm90YXRpb25QYXRoXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHJldHVybiBhbm5vdGF0aW9uQmFzZWRGb3JtRWxlbWVudHM7XG59XG5cbmZ1bmN0aW9uIGdldERhdGFQb2ludERhdGEoZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzKTogSGVhZGVyRGF0YVBvaW50RGF0YSB7XG5cdGxldCB0eXBlID0gSGVhZGVyRGF0YVBvaW50VHlwZS5Db250ZW50O1xuXHRpZiAoZmFjZXREZWZpbml0aW9uLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5SZWZlcmVuY2VGYWNldCkge1xuXHRcdGlmICgoZmFjZXREZWZpbml0aW9uLlRhcmdldD8uJHRhcmdldCBhcyBEYXRhUG9pbnQpPy5WaXN1YWxpemF0aW9uID09PSBcIlVJLlZpc3VhbGl6YXRpb25UeXBlL1Byb2dyZXNzXCIpIHtcblx0XHRcdHR5cGUgPSBIZWFkZXJEYXRhUG9pbnRUeXBlLlByb2dyZXNzSW5kaWNhdG9yO1xuXHRcdH0gZWxzZSBpZiAoKGZhY2V0RGVmaW5pdGlvbi5UYXJnZXQ/LiR0YXJnZXQgYXMgRGF0YVBvaW50KT8uVmlzdWFsaXphdGlvbiA9PT0gXCJVSS5WaXN1YWxpemF0aW9uVHlwZS9SYXRpbmdcIikge1xuXHRcdFx0dHlwZSA9IEhlYWRlckRhdGFQb2ludFR5cGUuUmF0aW5nSW5kaWNhdG9yO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiB7IHR5cGUgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFubm90YXRpb24tYmFzZWQgaGVhZGVyIGZhY2V0LlxuICpcbiAqIEBwYXJhbSB7RmFjZXRUeXBlc30gZmFjZXREZWZpbml0aW9uIFRoZSBkZWZpbml0aW9uIG9mIHRoZSBmYWNldFxuICogQHBhcmFtIHtDb252ZXJ0ZXJDb250ZXh0fSBjb252ZXJ0ZXJDb250ZXh0IFRoZSBjb252ZXJ0ZXIgY29udGV4dFxuICpcbiAqIEByZXR1cm5zIHtPYmplY3RQYWdlSGVhZGVyRmFjZXR9IFRoZSBjcmVhdGVkIGFubm90YXRpb24tYmFzZWQgaGVhZGVyIGZhY2V0XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUhlYWRlckZhY2V0KGZhY2V0RGVmaW5pdGlvbjogRmFjZXRUeXBlcywgY29udmVydGVyQ29udGV4dDogQ29udmVydGVyQ29udGV4dCk6IE9iamVjdFBhZ2VIZWFkZXJGYWNldCB8IHVuZGVmaW5lZCB7XG5cdGxldCBoZWFkZXJGYWNldDogT2JqZWN0UGFnZUhlYWRlckZhY2V0IHwgdW5kZWZpbmVkO1xuXHRzd2l0Y2ggKGZhY2V0RGVmaW5pdGlvbi4kVHlwZSkge1xuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVHlwZXMuUmVmZXJlbmNlRmFjZXQ6XG5cdFx0XHRoZWFkZXJGYWNldCA9IGNyZWF0ZVJlZmVyZW5jZUhlYWRlckZhY2V0KGZhY2V0RGVmaW5pdGlvbiwgZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5Db2xsZWN0aW9uRmFjZXQ6XG5cdFx0XHRoZWFkZXJGYWNldCA9IGNyZWF0ZUNvbGxlY3Rpb25IZWFkZXJGYWNldChmYWNldERlZmluaXRpb24sIGNvbnZlcnRlckNvbnRleHQpO1xuXHRcdFx0YnJlYWs7XG5cdH1cblxuXHRyZXR1cm4gaGVhZGVyRmFjZXQ7XG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gQ29udmVydCAmIEJ1aWxkIE1hbmlmZXN0IEJhc2VkIEhlYWRlciBGYWNldHNcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUJpbmRpbmcocmVxdWVzdEdyb3VwSWQ/OiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXHRpZiAoIXJlcXVlc3RHcm91cElkKSB7XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxuXHRjb25zdCBncm91cElkID1cblx0XHRbXCJIZXJvZXNcIiwgXCJEZWNvcmF0aW9uXCIsIFwiV29ya2Vyc1wiLCBcIkxvbmdSdW5uZXJzXCJdLmluZGV4T2YocmVxdWVzdEdyb3VwSWQpICE9PSAtMSA/IFwiJGF1dG8uXCIgKyByZXF1ZXN0R3JvdXBJZCA6IHJlcXVlc3RHcm91cElkO1xuXG5cdHJldHVybiBcInsgcGF0aCA6ICcnLCBwYXJhbWV0ZXJzIDogeyAkJGdyb3VwSWQgOiAnXCIgKyBncm91cElkICsgXCInIH0gfVwiO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIG1hbmlmZXN0IGJhc2VkIGN1c3RvbSBoZWFkZXIgZmFjZXQuXG4gKlxuICogQHBhcmFtIHtNYW5pZmVzdEhlYWRlckZhY2V0fSBjdXN0b21IZWFkZXJGYWNldERlZmluaXRpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSBoZWFkZXJGYWNldEtleVxuICpcbiAqIEByZXR1cm5zIHtDdXN0b21PYmplY3RQYWdlSGVhZGVyRmFjZXR9IFRoZSBtYW5pZmVzdCBiYXNlZCBjdXN0b20gaGVhZGVyIGZhY2V0IGNyZWF0ZWRcbiAqL1xuZnVuY3Rpb24gY3JlYXRlQ3VzdG9tSGVhZGVyRmFjZXQoY3VzdG9tSGVhZGVyRmFjZXREZWZpbml0aW9uOiBNYW5pZmVzdEhlYWRlckZhY2V0LCBoZWFkZXJGYWNldEtleTogc3RyaW5nKTogQ3VzdG9tT2JqZWN0UGFnZUhlYWRlckZhY2V0IHtcblx0Y29uc3QgY3VzdG9tSGVhZGVyRmFjZXRJRCA9IEN1c3RvbUhlYWRlckZhY2V0SUQoaGVhZGVyRmFjZXRLZXkpO1xuXG5cdGxldCBwb3NpdGlvbjogUG9zaXRpb24gfCB1bmRlZmluZWQgPSBjdXN0b21IZWFkZXJGYWNldERlZmluaXRpb24ucG9zaXRpb247XG5cdGlmICghcG9zaXRpb24pIHtcblx0XHRwb3NpdGlvbiA9IHtcblx0XHRcdHBsYWNlbWVudDogUGxhY2VtZW50LkFmdGVyXG5cdFx0fTtcblx0fVxuXHQvLyBUT0RPIGZvciBhbiBub24gYW5ub3RhdGlvbiBmcmFnbWVudCB0aGUgbmFtZSBpcyBtYW5kYXRvcnkgLT4gTm90IGNoZWNrZWRcblx0cmV0dXJuIHtcblx0XHRmYWNldFR5cGU6IEZhY2V0VHlwZS5SZWZlcmVuY2UsXG5cdFx0ZmFjZXRzOiBbXSxcblx0XHR0eXBlOiBjdXN0b21IZWFkZXJGYWNldERlZmluaXRpb24udHlwZSxcblx0XHRpZDogY3VzdG9tSGVhZGVyRmFjZXRJRCxcblx0XHRjb250YWluZXJJZDogY3VzdG9tSGVhZGVyRmFjZXRJRCxcblx0XHRrZXk6IGhlYWRlckZhY2V0S2V5LFxuXHRcdHBvc2l0aW9uOiBwb3NpdGlvbixcblx0XHR2aXNpYmxlOiBjdXN0b21IZWFkZXJGYWNldERlZmluaXRpb24udmlzaWJsZSxcblx0XHRmcmFnbWVudE5hbWU6IGN1c3RvbUhlYWRlckZhY2V0RGVmaW5pdGlvbi50ZW1wbGF0ZSB8fCBjdXN0b21IZWFkZXJGYWNldERlZmluaXRpb24ubmFtZSxcblx0XHR0aXRsZTogY3VzdG9tSGVhZGVyRmFjZXREZWZpbml0aW9uLnRpdGxlLFxuXHRcdHN1YlRpdGxlOiBjdXN0b21IZWFkZXJGYWNldERlZmluaXRpb24uc3ViVGl0bGUsXG5cdFx0c3Rhc2hlZDogY3VzdG9tSGVhZGVyRmFjZXREZWZpbml0aW9uLnN0YXNoZWQgfHwgZmFsc2UsXG5cdFx0ZmxleFNldHRpbmdzOiB7IC4uLnsgZGVzaWdudGltZTogRmxleERlc2lnblRpbWVUeXBlLkRlZmF1bHQgfSwgLi4uY3VzdG9tSGVhZGVyRmFjZXREZWZpbml0aW9uLmZsZXhTZXR0aW5ncyB9LFxuXHRcdGJpbmRpbmc6IGdlbmVyYXRlQmluZGluZyhjdXN0b21IZWFkZXJGYWNldERlZmluaXRpb24ucmVxdWVzdEdyb3VwSWQpLFxuXHRcdHRlbXBsYXRlRWRpdDogY3VzdG9tSGVhZGVyRmFjZXREZWZpbml0aW9uLnRlbXBsYXRlRWRpdFxuXHR9O1xufVxuIl19