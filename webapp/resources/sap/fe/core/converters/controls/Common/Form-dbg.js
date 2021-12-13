/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["../../helpers/ConfigurableObject", "../../helpers/ID", "../../helpers/Key", "sap/fe/core/converters/annotations/DataField", "sap/fe/core/templating/DataModelPathHelper", "../../../helpers/StableIdHelper"], function (ConfigurableObject, ID, Key, DataField, DataModelPathHelper, StableIdHelper) {
  "use strict";

  var _exports = {};
  var generate = StableIdHelper.generate;
  var getTargetObjectPath = DataModelPathHelper.getTargetObjectPath;
  var getTargetEntitySetPath = DataModelPathHelper.getTargetEntitySetPath;
  var getSemanticObjectPath = DataField.getSemanticObjectPath;
  var KeyHelper = Key.KeyHelper;
  var FormID = ID.FormID;
  var Placement = ConfigurableObject.Placement;
  var insertCustomElements = ConfigurableObject.insertCustomElements;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var FormElementType;

  (function (FormElementType) {
    FormElementType["Default"] = "Default";
    FormElementType["Annotation"] = "Annotation";
  })(FormElementType || (FormElementType = {}));

  _exports.FormElementType = FormElementType;

  /**
   * Returns default format options for text fields on a form.
   *
   * @returns {FormatOptionsType} Collection of format options with default values
   */
  function getDefaultFormatOptionsForForm() {
    return {
      textLinesEdit: 4
    };
  }

  function getFormElementsFromAnnotations(facetDefinition, converterContext) {
    var formElements = [];
    var resolvedTarget = converterContext.getEntityTypeAnnotation(facetDefinition.Target.value);
    var formAnnotation = resolvedTarget.annotation;
    converterContext = resolvedTarget.converterContext;

    function getDataFieldsFromAnnotations(field) {
      var _field$annotations, _field$annotations$UI, _field$annotations$UI2;

      var semanticObjectAnnotationPath = getSemanticObjectPath(converterContext, field);

      if (field.$Type !== "com.sap.vocabularies.UI.v1.DataFieldForAction" && field.$Type !== "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" && ((_field$annotations = field.annotations) === null || _field$annotations === void 0 ? void 0 : (_field$annotations$UI = _field$annotations.UI) === null || _field$annotations$UI === void 0 ? void 0 : (_field$annotations$UI2 = _field$annotations$UI.Hidden) === null || _field$annotations$UI2 === void 0 ? void 0 : _field$annotations$UI2.valueOf()) !== true) {
        formElements.push({
          key: KeyHelper.generateKeyFromDataField(field),
          type: FormElementType.Annotation,
          annotationPath: converterContext.getEntitySetBasedAnnotationPath(field.fullyQualifiedName) + "/",
          semanticObjectPath: semanticObjectAnnotationPath,
          formatOptions: getDefaultFormatOptionsForForm()
        });
      }
    }

    switch (formAnnotation === null || formAnnotation === void 0 ? void 0 : formAnnotation.term) {
      case "com.sap.vocabularies.UI.v1.FieldGroup":
        formAnnotation.Data.forEach(getDataFieldsFromAnnotations);
        break;

      case "com.sap.vocabularies.UI.v1.Identification":
        formAnnotation.forEach(getDataFieldsFromAnnotations);
        break;

      case "com.sap.vocabularies.UI.v1.DataPoint":
        formElements.push({
          // key: KeyHelper.generateKeyFromDataField(formAnnotation),
          key: "DataPoint::" + (formAnnotation.qualifier ? formAnnotation.qualifier : ""),
          type: FormElementType.Annotation,
          annotationPath: converterContext.getEntitySetBasedAnnotationPath(formAnnotation.fullyQualifiedName) + "/"
        });
        break;

      case "com.sap.vocabularies.Communication.v1.Contact":
        formElements.push({
          // key: KeyHelper.generateKeyFromDataField(formAnnotation),
          key: "Contact::" + (formAnnotation.qualifier ? formAnnotation.qualifier : ""),
          type: FormElementType.Annotation,
          annotationPath: converterContext.getEntitySetBasedAnnotationPath(formAnnotation.fullyQualifiedName) + "/"
        });
        break;

      default:
        break;
    }

    return formElements;
  }

  function getFormElementsFromManifest(facetDefinition, converterContext) {
    var manifestWrapper = converterContext.getManifestWrapper();
    var manifestFormContainer = manifestWrapper.getFormContainer(facetDefinition.Target.value);
    var formElements = {};

    if (manifestFormContainer !== null && manifestFormContainer !== void 0 && manifestFormContainer.fields) {
      Object.keys(manifestFormContainer === null || manifestFormContainer === void 0 ? void 0 : manifestFormContainer.fields).forEach(function (fieldId) {
        formElements[fieldId] = {
          key: fieldId,
          id: "CustomFormElement::" + fieldId,
          type: FormElementType.Default,
          template: manifestFormContainer.fields[fieldId].template,
          label: manifestFormContainer.fields[fieldId].label,
          position: manifestFormContainer.fields[fieldId].position || {
            placement: Placement.After
          },
          formatOptions: _objectSpread(_objectSpread({}, getDefaultFormatOptionsForForm()), manifestFormContainer.fields[fieldId].formatOptions)
        };
      });
    }

    return formElements;
  }

  _exports.getFormElementsFromManifest = getFormElementsFromManifest;

  function getFormContainer(facetDefinition, converterContext, actions) {
    var _resolvedTarget$conve;

    //TODO form container id
    var resolvedTarget = converterContext.getEntityTypeAnnotation(facetDefinition.Target.value);
    var sEntitySetPath; // resolvedTarget doesn't have a entitySet in case Containments and Paramterized services.

    if (resolvedTarget.converterContext.getEntitySet() && resolvedTarget.converterContext.getEntitySet() !== converterContext.getEntitySet()) {
      sEntitySetPath = getTargetEntitySetPath(resolvedTarget.converterContext.getDataModelObjectPath());
    } else if (((_resolvedTarget$conve = resolvedTarget.converterContext.getDataModelObjectPath().targetObject) === null || _resolvedTarget$conve === void 0 ? void 0 : _resolvedTarget$conve.containsTarget) === true) {
      sEntitySetPath = getTargetObjectPath(resolvedTarget.converterContext.getDataModelObjectPath(), false);
    }

    actions = actions !== undefined ? actions.filter(function (action) {
      return action.facetName == facetDefinition.fullyQualifiedName;
    }) : [];

    if (actions.length === 0) {
      actions = undefined;
    }

    return {
      id: generate([{
        Facet: facetDefinition
      }]),
      formElements: insertCustomElements(getFormElementsFromAnnotations(facetDefinition, converterContext), getFormElementsFromManifest(facetDefinition, converterContext), {
        formatOptions: "overwrite"
      }),
      annotationPath: "/" + facetDefinition.fullyQualifiedName,
      entitySet: sEntitySetPath,
      actions: actions
    };
  }

  _exports.getFormContainer = getFormContainer;

  function getFormContainersForCollection(facetDefinition, converterContext, actions) {
    var _facetDefinition$Face;

    var formContainers = []; //TODO coll facet inside coll facet?

    (_facetDefinition$Face = facetDefinition.Facets) === null || _facetDefinition$Face === void 0 ? void 0 : _facetDefinition$Face.forEach(function (facet) {
      // Ignore level 3 collection facet
      if (facet.$Type === "com.sap.vocabularies.UI.v1.CollectionFacet") {
        return;
      }

      formContainers.push(getFormContainer(facet, converterContext, actions));
    });
    return formContainers;
  }

  function isReferenceFacet(facetDefinition) {
    return facetDefinition.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet";
  }

  _exports.isReferenceFacet = isReferenceFacet;

  function createFormDefinition(facetDefinition, converterContext, actions) {
    var _facetDefinition$anno, _facetDefinition$anno2, _facetDefinition$anno3;

    switch (facetDefinition.$Type) {
      case "com.sap.vocabularies.UI.v1.CollectionFacet":
        // Keep only valid children
        var formCollectionDefinition = {
          id: FormID({
            Facet: facetDefinition
          }),
          useFormContainerLabels: true,
          hasFacetsNotPartOfPreview: facetDefinition.Facets.some(function (childFacet) {
            var _childFacet$annotatio, _childFacet$annotatio2, _childFacet$annotatio3;

            return ((_childFacet$annotatio = childFacet.annotations) === null || _childFacet$annotatio === void 0 ? void 0 : (_childFacet$annotatio2 = _childFacet$annotatio.UI) === null || _childFacet$annotatio2 === void 0 ? void 0 : (_childFacet$annotatio3 = _childFacet$annotatio2.PartOfPreview) === null || _childFacet$annotatio3 === void 0 ? void 0 : _childFacet$annotatio3.valueOf()) === false;
          }),
          formContainers: getFormContainersForCollection(facetDefinition, converterContext, actions)
        };
        return formCollectionDefinition;

      case "com.sap.vocabularies.UI.v1.ReferenceFacet":
        var formDefinition = {
          id: FormID({
            Facet: facetDefinition
          }),
          useFormContainerLabels: false,
          hasFacetsNotPartOfPreview: ((_facetDefinition$anno = facetDefinition.annotations) === null || _facetDefinition$anno === void 0 ? void 0 : (_facetDefinition$anno2 = _facetDefinition$anno.UI) === null || _facetDefinition$anno2 === void 0 ? void 0 : (_facetDefinition$anno3 = _facetDefinition$anno2.PartOfPreview) === null || _facetDefinition$anno3 === void 0 ? void 0 : _facetDefinition$anno3.valueOf()) === false,
          formContainers: [getFormContainer(facetDefinition, converterContext, actions)]
        };
        return formDefinition;

      default:
        throw new Error("Cannot create form based on ReferenceURLFacet");
    }
  }

  _exports.createFormDefinition = createFormDefinition;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZvcm0udHMiXSwibmFtZXMiOlsiRm9ybUVsZW1lbnRUeXBlIiwiZ2V0RGVmYXVsdEZvcm1hdE9wdGlvbnNGb3JGb3JtIiwidGV4dExpbmVzRWRpdCIsImdldEZvcm1FbGVtZW50c0Zyb21Bbm5vdGF0aW9ucyIsImZhY2V0RGVmaW5pdGlvbiIsImNvbnZlcnRlckNvbnRleHQiLCJmb3JtRWxlbWVudHMiLCJyZXNvbHZlZFRhcmdldCIsImdldEVudGl0eVR5cGVBbm5vdGF0aW9uIiwiVGFyZ2V0IiwidmFsdWUiLCJmb3JtQW5ub3RhdGlvbiIsImFubm90YXRpb24iLCJnZXREYXRhRmllbGRzRnJvbUFubm90YXRpb25zIiwiZmllbGQiLCJzZW1hbnRpY09iamVjdEFubm90YXRpb25QYXRoIiwiZ2V0U2VtYW50aWNPYmplY3RQYXRoIiwiJFR5cGUiLCJhbm5vdGF0aW9ucyIsIlVJIiwiSGlkZGVuIiwidmFsdWVPZiIsInB1c2giLCJrZXkiLCJLZXlIZWxwZXIiLCJnZW5lcmF0ZUtleUZyb21EYXRhRmllbGQiLCJ0eXBlIiwiQW5ub3RhdGlvbiIsImFubm90YXRpb25QYXRoIiwiZ2V0RW50aXR5U2V0QmFzZWRBbm5vdGF0aW9uUGF0aCIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsInNlbWFudGljT2JqZWN0UGF0aCIsImZvcm1hdE9wdGlvbnMiLCJ0ZXJtIiwiRGF0YSIsImZvckVhY2giLCJxdWFsaWZpZXIiLCJnZXRGb3JtRWxlbWVudHNGcm9tTWFuaWZlc3QiLCJtYW5pZmVzdFdyYXBwZXIiLCJnZXRNYW5pZmVzdFdyYXBwZXIiLCJtYW5pZmVzdEZvcm1Db250YWluZXIiLCJnZXRGb3JtQ29udGFpbmVyIiwiZmllbGRzIiwiT2JqZWN0Iiwia2V5cyIsImZpZWxkSWQiLCJpZCIsIkRlZmF1bHQiLCJ0ZW1wbGF0ZSIsImxhYmVsIiwicG9zaXRpb24iLCJwbGFjZW1lbnQiLCJQbGFjZW1lbnQiLCJBZnRlciIsImFjdGlvbnMiLCJzRW50aXR5U2V0UGF0aCIsImdldEVudGl0eVNldCIsImdldFRhcmdldEVudGl0eVNldFBhdGgiLCJnZXREYXRhTW9kZWxPYmplY3RQYXRoIiwidGFyZ2V0T2JqZWN0IiwiY29udGFpbnNUYXJnZXQiLCJnZXRUYXJnZXRPYmplY3RQYXRoIiwidW5kZWZpbmVkIiwiZmlsdGVyIiwiYWN0aW9uIiwiZmFjZXROYW1lIiwibGVuZ3RoIiwiZ2VuZXJhdGUiLCJGYWNldCIsImluc2VydEN1c3RvbUVsZW1lbnRzIiwiZW50aXR5U2V0IiwiZ2V0Rm9ybUNvbnRhaW5lcnNGb3JDb2xsZWN0aW9uIiwiZm9ybUNvbnRhaW5lcnMiLCJGYWNldHMiLCJmYWNldCIsImlzUmVmZXJlbmNlRmFjZXQiLCJjcmVhdGVGb3JtRGVmaW5pdGlvbiIsImZvcm1Db2xsZWN0aW9uRGVmaW5pdGlvbiIsIkZvcm1JRCIsInVzZUZvcm1Db250YWluZXJMYWJlbHMiLCJoYXNGYWNldHNOb3RQYXJ0T2ZQcmV2aWV3Iiwic29tZSIsImNoaWxkRmFjZXQiLCJQYXJ0T2ZQcmV2aWV3IiwiZm9ybURlZmluaXRpb24iLCJFcnJvciJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUEyQllBLGU7O2FBQUFBLGU7QUFBQUEsSUFBQUEsZTtBQUFBQSxJQUFBQSxlO0tBQUFBLGUsS0FBQUEsZTs7OztBQXFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBU0MsOEJBQVQsR0FBNkQ7QUFDNUQsV0FBTztBQUNOQyxNQUFBQSxhQUFhLEVBQUU7QUFEVCxLQUFQO0FBR0E7O0FBRUQsV0FBU0MsOEJBQVQsQ0FBd0NDLGVBQXhDLEVBQThFQyxnQkFBOUUsRUFBMkk7QUFDMUksUUFBTUMsWUFBcUMsR0FBRyxFQUE5QztBQUNBLFFBQU1DLGNBQWMsR0FBR0YsZ0JBQWdCLENBQUNHLHVCQUFqQixDQUF5Q0osZUFBZSxDQUFDSyxNQUFoQixDQUF1QkMsS0FBaEUsQ0FBdkI7QUFDQSxRQUFNQyxjQUEyRSxHQUFHSixjQUFjLENBQUNLLFVBQW5HO0FBR0FQLElB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QUNDLFlBQU1PLGNBQWMsR0FBRztBQUN0QnRDLFVBQUFBLEVBQUUsRUFBRWdDLE1BQU0sQ0FBQztBQUFFVixZQUFBQSxLQUFLLEVBQUVoRTtBQUFULFdBQUQsQ0FEWTtBQUV0QjJFLFVBQUFBLHNCQUFzQixFQUFFLEtBRkY7QUFHdEJDLFVBQUFBLHlCQUF5QixFQUFFLDBCQUFBNUUsZUFBZSxDQUFDYyxXQUFoQiwwR0FBNkJDLEVBQTdCLDRHQUFpQ2dFLGFBQWpDLGtGQUFnRDlELE9BQWhELFFBQThELEtBSG5FO0FBSXRCbUQsVUFBQUEsY0FBYyxFQUFFLENBQUMvQixnQkFBZ0IsQ0FBQ3JDLGVBQUQsRUFBa0JDLGdCQUFsQixFQUFvQ2lELE9BQXBDLENBQWpCO0FBSk0sU0FBdkI7QUFNQSxlQUFPOEIsY0FBUDs7QUFDRDtBQUNDLGNBQU0sSUFBSUMsS0FBSixDQUFVLCtDQUFWLENBQU47QUFyQkY7QUF1QkEiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdEFubm90YXRpb25UZXJtLFxuXHRDb2xsZWN0aW9uRmFjZXRUeXBlcyxcblx0Q29tbXVuaWNhdGlvbkFubm90YXRpb25UZXJtcyxcblx0RGF0YUZpZWxkQWJzdHJhY3RUeXBlcyxcblx0RmFjZXRUeXBlcyxcblx0RmllbGRHcm91cCxcblx0SWRlbnRpZmljYXRpb24sXG5cdFJlZmVyZW5jZUZhY2V0VHlwZXMsXG5cdFVJQW5ub3RhdGlvblRlcm1zLFxuXHRVSUFubm90YXRpb25UeXBlc1xufSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXNcIjtcbmltcG9ydCB7IEJpbmRpbmdFeHByZXNzaW9uIH0gZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvQmluZGluZ0V4cHJlc3Npb25cIjtcbmltcG9ydCB7IENvbmZpZ3VyYWJsZU9iamVjdCwgQ3VzdG9tRWxlbWVudCwgaW5zZXJ0Q3VzdG9tRWxlbWVudHMsIFBsYWNlbWVudCB9IGZyb20gXCIuLi8uLi9oZWxwZXJzL0NvbmZpZ3VyYWJsZU9iamVjdFwiO1xuaW1wb3J0IHsgRm9ybUlEIH0gZnJvbSBcIi4uLy4uL2hlbHBlcnMvSURcIjtcbmltcG9ydCB7IEtleUhlbHBlciB9IGZyb20gXCIuLi8uLi9oZWxwZXJzL0tleVwiO1xuaW1wb3J0IHsgRm9ybU1hbmlmZXN0Q29uZmlndXJhdGlvbiwgRm9ybWF0T3B0aW9uc1R5cGUgfSBmcm9tIFwiLi4vLi4vTWFuaWZlc3RTZXR0aW5nc1wiO1xuaW1wb3J0IHsgZ2V0U2VtYW50aWNPYmplY3RQYXRoIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvYW5ub3RhdGlvbnMvRGF0YUZpZWxkXCI7XG5pbXBvcnQgeyBnZXRUYXJnZXRFbnRpdHlTZXRQYXRoLCBnZXRUYXJnZXRPYmplY3RQYXRoIH0gZnJvbSBcInNhcC9mZS9jb3JlL3RlbXBsYXRpbmcvRGF0YU1vZGVsUGF0aEhlbHBlclwiO1xuaW1wb3J0IHsgZ2VuZXJhdGUgfSBmcm9tIFwiLi4vLi4vLi4vaGVscGVycy9TdGFibGVJZEhlbHBlclwiO1xuaW1wb3J0IENvbnZlcnRlckNvbnRleHQgZnJvbSBcIi4uLy4uL0NvbnZlcnRlckNvbnRleHRcIjtcbmltcG9ydCB7IEJhc2VBY3Rpb24sIENvbnZlcnRlckFjdGlvbiB9IGZyb20gXCJzYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbnRyb2xzL0NvbW1vbi9BY3Rpb25cIjtcblxuZXhwb3J0IHR5cGUgRm9ybURlZmluaXRpb24gPSB7XG5cdGlkOiBzdHJpbmc7XG5cdHVzZUZvcm1Db250YWluZXJMYWJlbHM6IGJvb2xlYW47XG5cdGhhc0ZhY2V0c05vdFBhcnRPZlByZXZpZXc6IGJvb2xlYW47XG59O1xuXG5leHBvcnQgZW51bSBGb3JtRWxlbWVudFR5cGUge1xuXHREZWZhdWx0ID0gXCJEZWZhdWx0XCIsXG5cdEFubm90YXRpb24gPSBcIkFubm90YXRpb25cIlxufVxuXG5leHBvcnQgdHlwZSBCYXNlRm9ybUVsZW1lbnQgPSBDb25maWd1cmFibGVPYmplY3QgJiB7XG5cdGlkPzogc3RyaW5nO1xuXHR0eXBlOiBGb3JtRWxlbWVudFR5cGU7XG5cdGxhYmVsPzogc3RyaW5nO1xuXHR2aXNpYmxlPzogQmluZGluZ0V4cHJlc3Npb248Ym9vbGVhbj47XG5cdGZvcm1hdE9wdGlvbnM/OiBGb3JtYXRPcHRpb25zVHlwZTtcbn07XG5cbmV4cG9ydCB0eXBlIEFubm90YXRpb25Gb3JtRWxlbWVudCA9IEJhc2VGb3JtRWxlbWVudCAmIHtcblx0aWRQcmVmaXg/OiBzdHJpbmc7XG5cdGFubm90YXRpb25QYXRoPzogc3RyaW5nO1xuXHRpc1ZhbHVlTXVsdGlsaW5lVGV4dD86IGJvb2xlYW47XG5cdHNlbWFudGljT2JqZWN0UGF0aD86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIEN1c3RvbUZvcm1FbGVtZW50ID0gQ3VzdG9tRWxlbWVudDxcblx0QmFzZUZvcm1FbGVtZW50ICYge1xuXHRcdHR5cGU6IEZvcm1FbGVtZW50VHlwZS5EZWZhdWx0O1xuXHRcdHRlbXBsYXRlOiBzdHJpbmc7XG5cdH1cbj47XG5cbmV4cG9ydCB0eXBlIEZvcm1FbGVtZW50ID0gQ3VzdG9tRm9ybUVsZW1lbnQgfCBBbm5vdGF0aW9uRm9ybUVsZW1lbnQ7XG5cbnR5cGUgRm9ybUNvbnRhaW5lciA9IHtcblx0aWQ/OiBzdHJpbmc7XG5cdGZvcm1FbGVtZW50czogRm9ybUVsZW1lbnRbXTtcblx0YW5ub3RhdGlvblBhdGg6IHN0cmluZztcblx0ZW50aXR5U2V0Pzogc3RyaW5nO1xuXHRhY3Rpb25zPzogQ29udmVydGVyQWN0aW9uW10gfCBCYXNlQWN0aW9uW107XG59O1xuXG4vKipcbiAqIFJldHVybnMgZGVmYXVsdCBmb3JtYXQgb3B0aW9ucyBmb3IgdGV4dCBmaWVsZHMgb24gYSBmb3JtLlxuICpcbiAqIEByZXR1cm5zIHtGb3JtYXRPcHRpb25zVHlwZX0gQ29sbGVjdGlvbiBvZiBmb3JtYXQgb3B0aW9ucyB3aXRoIGRlZmF1bHQgdmFsdWVzXG4gKi9cbmZ1bmN0aW9uIGdldERlZmF1bHRGb3JtYXRPcHRpb25zRm9yRm9ybSgpOiBGb3JtYXRPcHRpb25zVHlwZSB7XG5cdHJldHVybiB7XG5cdFx0dGV4dExpbmVzRWRpdDogNFxuXHR9O1xufVxuXG5mdW5jdGlvbiBnZXRGb3JtRWxlbWVudHNGcm9tQW5ub3RhdGlvbnMoZmFjZXREZWZpbml0aW9uOiBSZWZlcmVuY2VGYWNldFR5cGVzLCBjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0KTogQW5ub3RhdGlvbkZvcm1FbGVtZW50W10ge1xuXHRjb25zdCBmb3JtRWxlbWVudHM6IEFubm90YXRpb25Gb3JtRWxlbWVudFtdID0gW107XG5cdGNvbnN0IHJlc29sdmVkVGFyZ2V0ID0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlUeXBlQW5ub3RhdGlvbihmYWNldERlZmluaXRpb24uVGFyZ2V0LnZhbHVlKTtcblx0Y29uc3QgZm9ybUFubm90YXRpb246IEFubm90YXRpb25UZXJtPElkZW50aWZpY2F0aW9uPiB8IEFubm90YXRpb25UZXJtPEZpZWxkR3JvdXA+ID0gcmVzb2x2ZWRUYXJnZXQuYW5ub3RhdGlvbiBhc1xuXHRcdHwgQW5ub3RhdGlvblRlcm08SWRlbnRpZmljYXRpb24+XG5cdFx0fCBBbm5vdGF0aW9uVGVybTxGaWVsZEdyb3VwPjtcblx0Y29udmVydGVyQ29udGV4dCA9IHJlc29sdmVkVGFyZ2V0LmNvbnZlcnRlckNvbnRleHQ7XG5cblx0ZnVuY3Rpb24gZ2V0RGF0YUZpZWxkc0Zyb21Bbm5vdGF0aW9ucyhmaWVsZDogRGF0YUZpZWxkQWJzdHJhY3RUeXBlcykge1xuXHRcdGNvbnN0IHNlbWFudGljT2JqZWN0QW5ub3RhdGlvblBhdGggPSBnZXRTZW1hbnRpY09iamVjdFBhdGgoY29udmVydGVyQ29udGV4dCwgZmllbGQpO1xuXHRcdGlmIChcblx0XHRcdGZpZWxkLiRUeXBlICE9PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JBY3Rpb24gJiZcblx0XHRcdGZpZWxkLiRUeXBlICE9PSBVSUFubm90YXRpb25UeXBlcy5EYXRhRmllbGRGb3JJbnRlbnRCYXNlZE5hdmlnYXRpb24gJiZcblx0XHRcdGZpZWxkLmFubm90YXRpb25zPy5VST8uSGlkZGVuPy52YWx1ZU9mKCkgIT09IHRydWVcblx0XHQpIHtcblx0XHRcdGZvcm1FbGVtZW50cy5wdXNoKHtcblx0XHRcdFx0a2V5OiBLZXlIZWxwZXIuZ2VuZXJhdGVLZXlGcm9tRGF0YUZpZWxkKGZpZWxkKSxcblx0XHRcdFx0dHlwZTogRm9ybUVsZW1lbnRUeXBlLkFubm90YXRpb24sXG5cdFx0XHRcdGFubm90YXRpb25QYXRoOiBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgoZmllbGQuZnVsbHlRdWFsaWZpZWROYW1lKSArIFwiL1wiLFxuXHRcdFx0XHRzZW1hbnRpY09iamVjdFBhdGg6IHNlbWFudGljT2JqZWN0QW5ub3RhdGlvblBhdGgsXG5cdFx0XHRcdGZvcm1hdE9wdGlvbnM6IGdldERlZmF1bHRGb3JtYXRPcHRpb25zRm9yRm9ybSgpXG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRzd2l0Y2ggKGZvcm1Bbm5vdGF0aW9uPy50ZXJtKSB7XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UZXJtcy5GaWVsZEdyb3VwOlxuXHRcdFx0KGZvcm1Bbm5vdGF0aW9uIGFzIEFubm90YXRpb25UZXJtPEZpZWxkR3JvdXA+KS5EYXRhLmZvckVhY2goZ2V0RGF0YUZpZWxkc0Zyb21Bbm5vdGF0aW9ucyk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFVJQW5ub3RhdGlvblRlcm1zLklkZW50aWZpY2F0aW9uOlxuXHRcdFx0KGZvcm1Bbm5vdGF0aW9uIGFzIEFubm90YXRpb25UZXJtPElkZW50aWZpY2F0aW9uPikuZm9yRWFjaChnZXREYXRhRmllbGRzRnJvbUFubm90YXRpb25zKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgVUlBbm5vdGF0aW9uVGVybXMuRGF0YVBvaW50OlxuXHRcdFx0Zm9ybUVsZW1lbnRzLnB1c2goe1xuXHRcdFx0XHQvLyBrZXk6IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQoZm9ybUFubm90YXRpb24pLFxuXHRcdFx0XHRrZXk6IFwiRGF0YVBvaW50OjpcIiArIChmb3JtQW5ub3RhdGlvbi5xdWFsaWZpZXIgPyBmb3JtQW5ub3RhdGlvbi5xdWFsaWZpZXIgOiBcIlwiKSxcblx0XHRcdFx0dHlwZTogRm9ybUVsZW1lbnRUeXBlLkFubm90YXRpb24sXG5cdFx0XHRcdGFubm90YXRpb25QYXRoOiBjb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldEJhc2VkQW5ub3RhdGlvblBhdGgoZm9ybUFubm90YXRpb24uZnVsbHlRdWFsaWZpZWROYW1lKSArIFwiL1wiXG5cdFx0XHR9KTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgQ29tbXVuaWNhdGlvbkFubm90YXRpb25UZXJtcy5Db250YWN0OlxuXHRcdFx0Zm9ybUVsZW1lbnRzLnB1c2goe1xuXHRcdFx0XHQvLyBrZXk6IEtleUhlbHBlci5nZW5lcmF0ZUtleUZyb21EYXRhRmllbGQoZm9ybUFubm90YXRpb24pLFxuXHRcdFx0XHRrZXk6IFwiQ29udGFjdDo6XCIgKyAoZm9ybUFubm90YXRpb24ucXVhbGlmaWVyID8gZm9ybUFubm90YXRpb24ucXVhbGlmaWVyIDogXCJcIiksXG5cdFx0XHRcdHR5cGU6IEZvcm1FbGVtZW50VHlwZS5Bbm5vdGF0aW9uLFxuXHRcdFx0XHRhbm5vdGF0aW9uUGF0aDogY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXRCYXNlZEFubm90YXRpb25QYXRoKGZvcm1Bbm5vdGF0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZSkgKyBcIi9cIlxuXHRcdFx0fSk7XG5cdFx0XHRicmVhaztcblx0XHRkZWZhdWx0OlxuXHRcdFx0YnJlYWs7XG5cdH1cblx0cmV0dXJuIGZvcm1FbGVtZW50cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZvcm1FbGVtZW50c0Zyb21NYW5pZmVzdChcblx0ZmFjZXREZWZpbml0aW9uOiBSZWZlcmVuY2VGYWNldFR5cGVzLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0XG4pOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21Gb3JtRWxlbWVudD4ge1xuXHRjb25zdCBtYW5pZmVzdFdyYXBwZXIgPSBjb252ZXJ0ZXJDb250ZXh0LmdldE1hbmlmZXN0V3JhcHBlcigpO1xuXHRjb25zdCBtYW5pZmVzdEZvcm1Db250YWluZXI6IEZvcm1NYW5pZmVzdENvbmZpZ3VyYXRpb24gPSBtYW5pZmVzdFdyYXBwZXIuZ2V0Rm9ybUNvbnRhaW5lcihmYWNldERlZmluaXRpb24uVGFyZ2V0LnZhbHVlKTtcblx0Y29uc3QgZm9ybUVsZW1lbnRzOiBSZWNvcmQ8c3RyaW5nLCBDdXN0b21Gb3JtRWxlbWVudD4gPSB7fTtcblx0aWYgKG1hbmlmZXN0Rm9ybUNvbnRhaW5lcj8uZmllbGRzKSB7XG5cdFx0T2JqZWN0LmtleXMobWFuaWZlc3RGb3JtQ29udGFpbmVyPy5maWVsZHMpLmZvckVhY2goZmllbGRJZCA9PiB7XG5cdFx0XHRmb3JtRWxlbWVudHNbZmllbGRJZF0gPSB7XG5cdFx0XHRcdGtleTogZmllbGRJZCxcblx0XHRcdFx0aWQ6IFwiQ3VzdG9tRm9ybUVsZW1lbnQ6OlwiICsgZmllbGRJZCxcblx0XHRcdFx0dHlwZTogRm9ybUVsZW1lbnRUeXBlLkRlZmF1bHQsXG5cdFx0XHRcdHRlbXBsYXRlOiBtYW5pZmVzdEZvcm1Db250YWluZXIuZmllbGRzW2ZpZWxkSWRdLnRlbXBsYXRlLFxuXHRcdFx0XHRsYWJlbDogbWFuaWZlc3RGb3JtQ29udGFpbmVyLmZpZWxkc1tmaWVsZElkXS5sYWJlbCxcblx0XHRcdFx0cG9zaXRpb246IG1hbmlmZXN0Rm9ybUNvbnRhaW5lci5maWVsZHNbZmllbGRJZF0ucG9zaXRpb24gfHwge1xuXHRcdFx0XHRcdHBsYWNlbWVudDogUGxhY2VtZW50LkFmdGVyXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdE9wdGlvbnM6IHtcblx0XHRcdFx0XHQuLi5nZXREZWZhdWx0Rm9ybWF0T3B0aW9uc0ZvckZvcm0oKSxcblx0XHRcdFx0XHQuLi5tYW5pZmVzdEZvcm1Db250YWluZXIuZmllbGRzW2ZpZWxkSWRdLmZvcm1hdE9wdGlvbnNcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gZm9ybUVsZW1lbnRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Rm9ybUNvbnRhaW5lcihcblx0ZmFjZXREZWZpbml0aW9uOiBSZWZlcmVuY2VGYWNldFR5cGVzLFxuXHRjb252ZXJ0ZXJDb250ZXh0OiBDb252ZXJ0ZXJDb250ZXh0LFxuXHRhY3Rpb25zOiBCYXNlQWN0aW9uW10gfCBDb252ZXJ0ZXJBY3Rpb25bXSB8IHVuZGVmaW5lZFxuKTogRm9ybUNvbnRhaW5lciB7XG5cdC8vVE9ETyBmb3JtIGNvbnRhaW5lciBpZFxuXHRjb25zdCByZXNvbHZlZFRhcmdldCA9IGNvbnZlcnRlckNvbnRleHQuZ2V0RW50aXR5VHlwZUFubm90YXRpb24oZmFjZXREZWZpbml0aW9uLlRhcmdldC52YWx1ZSk7XG5cdGxldCBzRW50aXR5U2V0UGF0aCE6IHN0cmluZztcblx0Ly8gcmVzb2x2ZWRUYXJnZXQgZG9lc24ndCBoYXZlIGEgZW50aXR5U2V0IGluIGNhc2UgQ29udGFpbm1lbnRzIGFuZCBQYXJhbXRlcml6ZWQgc2VydmljZXMuXG5cdGlmIChcblx0XHRyZXNvbHZlZFRhcmdldC5jb252ZXJ0ZXJDb250ZXh0LmdldEVudGl0eVNldCgpICYmXG5cdFx0cmVzb2x2ZWRUYXJnZXQuY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKSAhPT0gY29udmVydGVyQ29udGV4dC5nZXRFbnRpdHlTZXQoKVxuXHQpIHtcblx0XHRzRW50aXR5U2V0UGF0aCA9IGdldFRhcmdldEVudGl0eVNldFBhdGgocmVzb2x2ZWRUYXJnZXQuY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCkpO1xuXHR9IGVsc2UgaWYgKHJlc29sdmVkVGFyZ2V0LmNvbnZlcnRlckNvbnRleHQuZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aCgpLnRhcmdldE9iamVjdD8uY29udGFpbnNUYXJnZXQgPT09IHRydWUpIHtcblx0XHRzRW50aXR5U2V0UGF0aCA9IGdldFRhcmdldE9iamVjdFBhdGgocmVzb2x2ZWRUYXJnZXQuY29udmVydGVyQ29udGV4dC5nZXREYXRhTW9kZWxPYmplY3RQYXRoKCksIGZhbHNlKTtcblx0fVxuXHRhY3Rpb25zID0gYWN0aW9ucyAhPT0gdW5kZWZpbmVkID8gYWN0aW9ucy5maWx0ZXIoYWN0aW9uID0+IGFjdGlvbi5mYWNldE5hbWUgPT0gZmFjZXREZWZpbml0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZSkgOiBbXTtcblx0aWYgKGFjdGlvbnMubGVuZ3RoID09PSAwKSB7XG5cdFx0YWN0aW9ucyA9IHVuZGVmaW5lZDtcblx0fVxuXHRyZXR1cm4ge1xuXHRcdGlkOiBnZW5lcmF0ZShbeyBGYWNldDogZmFjZXREZWZpbml0aW9uIH1dKSxcblx0XHRmb3JtRWxlbWVudHM6IGluc2VydEN1c3RvbUVsZW1lbnRzKFxuXHRcdFx0Z2V0Rm9ybUVsZW1lbnRzRnJvbUFubm90YXRpb25zKGZhY2V0RGVmaW5pdGlvbiwgY29udmVydGVyQ29udGV4dCksXG5cdFx0XHRnZXRGb3JtRWxlbWVudHNGcm9tTWFuaWZlc3QoZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0KSxcblx0XHRcdHsgZm9ybWF0T3B0aW9uczogXCJvdmVyd3JpdGVcIiB9XG5cdFx0KSxcblx0XHRhbm5vdGF0aW9uUGF0aDogXCIvXCIgKyBmYWNldERlZmluaXRpb24uZnVsbHlRdWFsaWZpZWROYW1lLFxuXHRcdGVudGl0eVNldDogc0VudGl0eVNldFBhdGgsXG5cdFx0YWN0aW9uczogYWN0aW9uc1xuXHR9O1xufVxuXG5mdW5jdGlvbiBnZXRGb3JtQ29udGFpbmVyc0ZvckNvbGxlY3Rpb24oXG5cdGZhY2V0RGVmaW5pdGlvbjogQ29sbGVjdGlvbkZhY2V0VHlwZXMsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGFjdGlvbnM6IEJhc2VBY3Rpb25bXSB8IENvbnZlcnRlckFjdGlvbltdXG4pOiBGb3JtQ29udGFpbmVyW10ge1xuXHRjb25zdCBmb3JtQ29udGFpbmVyczogRm9ybUNvbnRhaW5lcltdID0gW107XG5cdC8vVE9ETyBjb2xsIGZhY2V0IGluc2lkZSBjb2xsIGZhY2V0P1xuXHRmYWNldERlZmluaXRpb24uRmFjZXRzPy5mb3JFYWNoKGZhY2V0ID0+IHtcblx0XHQvLyBJZ25vcmUgbGV2ZWwgMyBjb2xsZWN0aW9uIGZhY2V0XG5cdFx0aWYgKGZhY2V0LiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5Db2xsZWN0aW9uRmFjZXQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Zm9ybUNvbnRhaW5lcnMucHVzaChnZXRGb3JtQ29udGFpbmVyKGZhY2V0IGFzIFJlZmVyZW5jZUZhY2V0VHlwZXMsIGNvbnZlcnRlckNvbnRleHQsIGFjdGlvbnMpKTtcblx0fSk7XG5cdHJldHVybiBmb3JtQ29udGFpbmVycztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVmZXJlbmNlRmFjZXQoZmFjZXREZWZpbml0aW9uOiBGYWNldFR5cGVzKTogZmFjZXREZWZpbml0aW9uIGlzIFJlZmVyZW5jZUZhY2V0VHlwZXMge1xuXHRyZXR1cm4gZmFjZXREZWZpbml0aW9uLiRUeXBlID09PSBVSUFubm90YXRpb25UeXBlcy5SZWZlcmVuY2VGYWNldDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUZvcm1EZWZpbml0aW9uKFxuXHRmYWNldERlZmluaXRpb246IEZhY2V0VHlwZXMsXG5cdGNvbnZlcnRlckNvbnRleHQ6IENvbnZlcnRlckNvbnRleHQsXG5cdGFjdGlvbnM6IEJhc2VBY3Rpb25bXSB8IENvbnZlcnRlckFjdGlvbltdXG4pOiBGb3JtRGVmaW5pdGlvbiB7XG5cdHN3aXRjaCAoZmFjZXREZWZpbml0aW9uLiRUeXBlKSB7XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5Db2xsZWN0aW9uRmFjZXQ6XG5cdFx0XHQvLyBLZWVwIG9ubHkgdmFsaWQgY2hpbGRyZW5cblx0XHRcdGNvbnN0IGZvcm1Db2xsZWN0aW9uRGVmaW5pdGlvbiA9IHtcblx0XHRcdFx0aWQ6IEZvcm1JRCh7IEZhY2V0OiBmYWNldERlZmluaXRpb24gfSksXG5cdFx0XHRcdHVzZUZvcm1Db250YWluZXJMYWJlbHM6IHRydWUsXG5cdFx0XHRcdGhhc0ZhY2V0c05vdFBhcnRPZlByZXZpZXc6IGZhY2V0RGVmaW5pdGlvbi5GYWNldHMuc29tZShcblx0XHRcdFx0XHRjaGlsZEZhY2V0ID0+IGNoaWxkRmFjZXQuYW5ub3RhdGlvbnM/LlVJPy5QYXJ0T2ZQcmV2aWV3Py52YWx1ZU9mKCkgPT09IGZhbHNlXG5cdFx0XHRcdCksXG5cdFx0XHRcdGZvcm1Db250YWluZXJzOiBnZXRGb3JtQ29udGFpbmVyc0ZvckNvbGxlY3Rpb24oZmFjZXREZWZpbml0aW9uLCBjb252ZXJ0ZXJDb250ZXh0LCBhY3Rpb25zKVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiBmb3JtQ29sbGVjdGlvbkRlZmluaXRpb247XG5cdFx0Y2FzZSBVSUFubm90YXRpb25UeXBlcy5SZWZlcmVuY2VGYWNldDpcblx0XHRcdGNvbnN0IGZvcm1EZWZpbml0aW9uID0ge1xuXHRcdFx0XHRpZDogRm9ybUlEKHsgRmFjZXQ6IGZhY2V0RGVmaW5pdGlvbiB9KSxcblx0XHRcdFx0dXNlRm9ybUNvbnRhaW5lckxhYmVsczogZmFsc2UsXG5cdFx0XHRcdGhhc0ZhY2V0c05vdFBhcnRPZlByZXZpZXc6IGZhY2V0RGVmaW5pdGlvbi5hbm5vdGF0aW9ucz8uVUk/LlBhcnRPZlByZXZpZXc/LnZhbHVlT2YoKSA9PT0gZmFsc2UsXG5cdFx0XHRcdGZvcm1Db250YWluZXJzOiBbZ2V0Rm9ybUNvbnRhaW5lcihmYWNldERlZmluaXRpb24sIGNvbnZlcnRlckNvbnRleHQsIGFjdGlvbnMpXVxuXHRcdFx0fTtcblx0XHRcdHJldHVybiBmb3JtRGVmaW5pdGlvbjtcblx0XHRkZWZhdWx0OlxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGNyZWF0ZSBmb3JtIGJhc2VkIG9uIFJlZmVyZW5jZVVSTEZhY2V0XCIpO1xuXHR9XG59XG4iXX0=