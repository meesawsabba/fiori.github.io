/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([], function () {
  "use strict";

  var _exports = {};

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Path = function Path(pathExpression, targetName, annotationsTerm, annotationType, term) {
    _classCallCheck(this, Path);

    this.path = pathExpression.Path;
    this.type = "Path";
    this.$target = targetName;
    this.term = term, this.annotationType = annotationType, this.annotationsTerm = annotationsTerm;
  };

  var TermToTypes;

  (function (TermToTypes) {
    TermToTypes["Org.OData.Authorization.V1.SecuritySchemes"] = "Org.OData.Authorization.V1.SecurityScheme";
    TermToTypes["Org.OData.Authorization.V1.Authorizations"] = "Org.OData.Authorization.V1.Authorization";
    TermToTypes["Org.OData.Core.V1.Revisions"] = "Org.OData.Core.V1.RevisionType";
    TermToTypes["Org.OData.Core.V1.Links"] = "Org.OData.Core.V1.Link";
    TermToTypes["Org.OData.Core.V1.Example"] = "Org.OData.Core.V1.ExampleValue";
    TermToTypes["Org.OData.Core.V1.Messages"] = "Org.OData.Core.V1.MessageType";
    TermToTypes["Org.OData.Core.V1.ValueException"] = "Org.OData.Core.V1.ValueExceptionType";
    TermToTypes["Org.OData.Core.V1.ResourceException"] = "Org.OData.Core.V1.ResourceExceptionType";
    TermToTypes["Org.OData.Core.V1.DataModificationException"] = "Org.OData.Core.V1.DataModificationExceptionType";
    TermToTypes["Org.OData.Core.V1.IsLanguageDependent"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.DereferenceableIDs"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.ConventionalIDs"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.Permissions"] = "Org.OData.Core.V1.Permission";
    TermToTypes["Org.OData.Core.V1.DefaultNamespace"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.Immutable"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.Computed"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.ComputedDefaultValue"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.IsURL"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.IsMediaType"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.ContentDisposition"] = "Org.OData.Core.V1.ContentDispositionType";
    TermToTypes["Org.OData.Core.V1.OptimisticConcurrency"] = "Edm.PropertyPath";
    TermToTypes["Org.OData.Core.V1.AdditionalProperties"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.AutoExpand"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.AutoExpandReferences"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.MayImplement"] = "Org.OData.Core.V1.QualifiedTypeName";
    TermToTypes["Org.OData.Core.V1.Ordered"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.PositionalInsert"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Core.V1.AlternateKeys"] = "Org.OData.Core.V1.AlternateKey";
    TermToTypes["Org.OData.Core.V1.OptionalParameter"] = "Org.OData.Core.V1.OptionalParameterType";
    TermToTypes["Org.OData.Core.V1.OperationAvailable"] = "Edm.Boolean";
    TermToTypes["Org.OData.Core.V1.SymbolicName"] = "Org.OData.Core.V1.SimpleIdentifier";
    TermToTypes["Org.OData.Capabilities.V1.ConformanceLevel"] = "Org.OData.Capabilities.V1.ConformanceLevelType";
    TermToTypes["Org.OData.Capabilities.V1.AsynchronousRequestsSupported"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Capabilities.V1.BatchContinueOnErrorSupported"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Capabilities.V1.IsolationSupported"] = "Org.OData.Capabilities.V1.IsolationLevel";
    TermToTypes["Org.OData.Capabilities.V1.CrossJoinSupported"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Capabilities.V1.CallbackSupported"] = "Org.OData.Capabilities.V1.CallbackType";
    TermToTypes["Org.OData.Capabilities.V1.ChangeTracking"] = "Org.OData.Capabilities.V1.ChangeTrackingType";
    TermToTypes["Org.OData.Capabilities.V1.CountRestrictions"] = "Org.OData.Capabilities.V1.CountRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.NavigationRestrictions"] = "Org.OData.Capabilities.V1.NavigationRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.IndexableByKey"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Capabilities.V1.TopSupported"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Capabilities.V1.SkipSupported"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Capabilities.V1.ComputeSupported"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Capabilities.V1.SelectSupport"] = "Org.OData.Capabilities.V1.SelectSupportType";
    TermToTypes["Org.OData.Capabilities.V1.BatchSupported"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Capabilities.V1.BatchSupport"] = "Org.OData.Capabilities.V1.BatchSupportType";
    TermToTypes["Org.OData.Capabilities.V1.FilterRestrictions"] = "Org.OData.Capabilities.V1.FilterRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.SortRestrictions"] = "Org.OData.Capabilities.V1.SortRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.ExpandRestrictions"] = "Org.OData.Capabilities.V1.ExpandRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.SearchRestrictions"] = "Org.OData.Capabilities.V1.SearchRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.KeyAsSegmentSupported"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Capabilities.V1.QuerySegmentSupported"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Capabilities.V1.InsertRestrictions"] = "Org.OData.Capabilities.V1.InsertRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.DeepInsertSupport"] = "Org.OData.Capabilities.V1.DeepInsertSupportType";
    TermToTypes["Org.OData.Capabilities.V1.UpdateRestrictions"] = "Org.OData.Capabilities.V1.UpdateRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.DeepUpdateSupport"] = "Org.OData.Capabilities.V1.DeepUpdateSupportType";
    TermToTypes["Org.OData.Capabilities.V1.DeleteRestrictions"] = "Org.OData.Capabilities.V1.DeleteRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.CollectionPropertyRestrictions"] = "Org.OData.Capabilities.V1.CollectionPropertyRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.OperationRestrictions"] = "Org.OData.Capabilities.V1.OperationRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.AnnotationValuesInQuerySupported"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Capabilities.V1.ModificationQueryOptions"] = "Org.OData.Capabilities.V1.ModificationQueryOptionsType";
    TermToTypes["Org.OData.Capabilities.V1.ReadRestrictions"] = "Org.OData.Capabilities.V1.ReadRestrictionsType";
    TermToTypes["Org.OData.Capabilities.V1.CustomHeaders"] = "Org.OData.Capabilities.V1.CustomParameter";
    TermToTypes["Org.OData.Capabilities.V1.CustomQueryOptions"] = "Org.OData.Capabilities.V1.CustomParameter";
    TermToTypes["Org.OData.Capabilities.V1.MediaLocationUpdateSupported"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Aggregation.V1.ApplySupported"] = "Org.OData.Aggregation.V1.ApplySupportedType";
    TermToTypes["Org.OData.Aggregation.V1.Groupable"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Aggregation.V1.Aggregatable"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Aggregation.V1.ContextDefiningProperties"] = "Edm.PropertyPath";
    TermToTypes["Org.OData.Aggregation.V1.LeveledHierarchy"] = "Edm.PropertyPath";
    TermToTypes["Org.OData.Aggregation.V1.RecursiveHierarchy"] = "Org.OData.Aggregation.V1.RecursiveHierarchyType";
    TermToTypes["Org.OData.Aggregation.V1.AvailableOnAggregates"] = "Org.OData.Aggregation.V1.AvailableOnAggregatesType";
    TermToTypes["Org.OData.Validation.V1.Minimum"] = "Edm.PrimitiveType";
    TermToTypes["Org.OData.Validation.V1.Maximum"] = "Edm.PrimitiveType";
    TermToTypes["Org.OData.Validation.V1.Exclusive"] = "Org.OData.Core.V1.Tag";
    TermToTypes["Org.OData.Validation.V1.AllowedValues"] = "Org.OData.Validation.V1.AllowedValue";
    TermToTypes["Org.OData.Validation.V1.MultipleOf"] = "Edm.Decimal";
    TermToTypes["Org.OData.Validation.V1.Constraint"] = "Org.OData.Validation.V1.ConstraintType";
    TermToTypes["Org.OData.Validation.V1.ItemsOf"] = "Org.OData.Validation.V1.ItemsOfType";
    TermToTypes["Org.OData.Validation.V1.OpenPropertyTypeConstraint"] = "Org.OData.Core.V1.QualifiedTypeName";
    TermToTypes["Org.OData.Validation.V1.DerivedTypeConstraint"] = "Org.OData.Core.V1.QualifiedTypeName";
    TermToTypes["Org.OData.Validation.V1.AllowedTerms"] = "Org.OData.Core.V1.QualifiedTermName";
    TermToTypes["Org.OData.Validation.V1.ApplicableTerms"] = "Org.OData.Core.V1.QualifiedTermName";
    TermToTypes["Org.OData.Validation.V1.MaxItems"] = "Edm.Int64";
    TermToTypes["Org.OData.Validation.V1.MinItems"] = "Edm.Int64";
    TermToTypes["Org.OData.Measures.V1.Scale"] = "Edm.Byte";
    TermToTypes["Org.OData.Measures.V1.DurationGranularity"] = "Org.OData.Measures.V1.DurationGranularityType";
    TermToTypes["com.sap.vocabularies.Analytics.v1.Dimension"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Analytics.v1.Measure"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Analytics.v1.AccumulativeMeasure"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Analytics.v1.RolledUpPropertyCount"] = "Edm.Int16";
    TermToTypes["com.sap.vocabularies.Analytics.v1.PlanningAction"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Analytics.v1.AggregatedProperties"] = "com.sap.vocabularies.Analytics.v1.AggregatedPropertyType";
    TermToTypes["com.sap.vocabularies.Common.v1.ServiceVersion"] = "Edm.Int32";
    TermToTypes["com.sap.vocabularies.Common.v1.ServiceSchemaVersion"] = "Edm.Int32";
    TermToTypes["com.sap.vocabularies.Common.v1.TextFor"] = "Edm.PropertyPath";
    TermToTypes["com.sap.vocabularies.Common.v1.IsLanguageIdentifier"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.TextFormat"] = "com.sap.vocabularies.Common.v1.TextFormatType";
    TermToTypes["com.sap.vocabularies.Common.v1.IsDigitSequence"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsUpperCase"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsCurrency"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsUnit"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.UnitSpecificScale"] = "Edm.PrimitiveType";
    TermToTypes["com.sap.vocabularies.Common.v1.UnitSpecificPrecision"] = "Edm.PrimitiveType";
    TermToTypes["com.sap.vocabularies.Common.v1.SecondaryKey"] = "Edm.PropertyPath";
    TermToTypes["com.sap.vocabularies.Common.v1.MinOccurs"] = "Edm.Int64";
    TermToTypes["com.sap.vocabularies.Common.v1.MaxOccurs"] = "Edm.Int64";
    TermToTypes["com.sap.vocabularies.Common.v1.AssociationEntity"] = "Edm.NavigationPropertyPath";
    TermToTypes["com.sap.vocabularies.Common.v1.DerivedNavigation"] = "Edm.NavigationPropertyPath";
    TermToTypes["com.sap.vocabularies.Common.v1.Masked"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.MaskedAlways"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.SemanticObjectMapping"] = "com.sap.vocabularies.Common.v1.SemanticObjectMappingType";
    TermToTypes["com.sap.vocabularies.Common.v1.IsInstanceAnnotation"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.FilterExpressionRestrictions"] = "com.sap.vocabularies.Common.v1.FilterExpressionRestrictionType";
    TermToTypes["com.sap.vocabularies.Common.v1.FieldControl"] = "com.sap.vocabularies.Common.v1.FieldControlType";
    TermToTypes["com.sap.vocabularies.Common.v1.Application"] = "com.sap.vocabularies.Common.v1.ApplicationType";
    TermToTypes["com.sap.vocabularies.Common.v1.Timestamp"] = "Edm.DateTimeOffset";
    TermToTypes["com.sap.vocabularies.Common.v1.ErrorResolution"] = "com.sap.vocabularies.Common.v1.ErrorResolutionType";
    TermToTypes["com.sap.vocabularies.Common.v1.Messages"] = "Edm.ComplexType";
    TermToTypes["com.sap.vocabularies.Common.v1.numericSeverity"] = "com.sap.vocabularies.Common.v1.NumericMessageSeverityType";
    TermToTypes["com.sap.vocabularies.Common.v1.MaximumNumericMessageSeverity"] = "com.sap.vocabularies.Common.v1.NumericMessageSeverityType";
    TermToTypes["com.sap.vocabularies.Common.v1.IsActionCritical"] = "Edm.Boolean";
    TermToTypes["com.sap.vocabularies.Common.v1.Attributes"] = "Edm.PropertyPath";
    TermToTypes["com.sap.vocabularies.Common.v1.RelatedRecursiveHierarchy"] = "Edm.AnnotationPath";
    TermToTypes["com.sap.vocabularies.Common.v1.Interval"] = "com.sap.vocabularies.Common.v1.IntervalType";
    TermToTypes["com.sap.vocabularies.Common.v1.ResultContext"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.WeakReferentialConstraint"] = "com.sap.vocabularies.Common.v1.WeakReferentialConstraintType";
    TermToTypes["com.sap.vocabularies.Common.v1.IsNaturalPerson"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.ValueList"] = "com.sap.vocabularies.Common.v1.ValueListType";
    TermToTypes["com.sap.vocabularies.Common.v1.ValueListRelevantQualifiers"] = "com.sap.vocabularies.Common.v1.SimpleIdentifier";
    TermToTypes["com.sap.vocabularies.Common.v1.ValueListWithFixedValues"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.ValueListMapping"] = "com.sap.vocabularies.Common.v1.ValueListMappingType";
    TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarYear"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarHalfyear"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarQuarter"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarMonth"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarWeek"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsDayOfCalendarMonth"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsDayOfCalendarYear"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarYearHalfyear"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarYearQuarter"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarYearMonth"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarYearWeek"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsCalendarDate"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalYear"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalPeriod"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalYearPeriod"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalQuarter"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalYearQuarter"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalWeek"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalYearWeek"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsDayOfFiscalYear"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.IsFiscalYearVariant"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.MutuallyExclusiveTerm"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Common.v1.DraftRoot"] = "com.sap.vocabularies.Common.v1.DraftRootType";
    TermToTypes["com.sap.vocabularies.Common.v1.DraftNode"] = "com.sap.vocabularies.Common.v1.DraftNodeType";
    TermToTypes["com.sap.vocabularies.Common.v1.DraftActivationVia"] = "com.sap.vocabularies.Common.v1.SimpleIdentifier";
    TermToTypes["com.sap.vocabularies.Common.v1.EditableFieldFor"] = "Edm.PropertyPath";
    TermToTypes["com.sap.vocabularies.Common.v1.SemanticKey"] = "Edm.PropertyPath";
    TermToTypes["com.sap.vocabularies.Common.v1.SideEffects"] = "com.sap.vocabularies.Common.v1.SideEffectsType";
    TermToTypes["com.sap.vocabularies.Common.v1.DefaultValuesFunction"] = "com.sap.vocabularies.Common.v1.QualifiedName";
    TermToTypes["com.sap.vocabularies.Common.v1.FilterDefaultValue"] = "Edm.PrimitiveType";
    TermToTypes["com.sap.vocabularies.Common.v1.FilterDefaultValueHigh"] = "Edm.PrimitiveType";
    TermToTypes["com.sap.vocabularies.Common.v1.SortOrder"] = "com.sap.vocabularies.Common.v1.SortOrderType";
    TermToTypes["com.sap.vocabularies.Common.v1.RecursiveHierarchy"] = "com.sap.vocabularies.Common.v1.RecursiveHierarchyType";
    TermToTypes["com.sap.vocabularies.Common.v1.CreatedAt"] = "Edm.DateTimeOffset";
    TermToTypes["com.sap.vocabularies.Common.v1.CreatedBy"] = "com.sap.vocabularies.Common.v1.UserID";
    TermToTypes["com.sap.vocabularies.Common.v1.ChangedAt"] = "Edm.DateTimeOffset";
    TermToTypes["com.sap.vocabularies.Common.v1.ChangedBy"] = "com.sap.vocabularies.Common.v1.UserID";
    TermToTypes["com.sap.vocabularies.Common.v1.ApplyMultiUnitBehaviorForSortingAndFiltering"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.CodeList.v1.CurrencyCodes"] = "com.sap.vocabularies.CodeList.v1.CodeListSource";
    TermToTypes["com.sap.vocabularies.CodeList.v1.UnitsOfMeasure"] = "com.sap.vocabularies.CodeList.v1.CodeListSource";
    TermToTypes["com.sap.vocabularies.CodeList.v1.StandardCode"] = "Edm.PropertyPath";
    TermToTypes["com.sap.vocabularies.CodeList.v1.ExternalCode"] = "Edm.PropertyPath";
    TermToTypes["com.sap.vocabularies.CodeList.v1.IsConfigurationDeprecationCode"] = "Edm.Boolean";
    TermToTypes["com.sap.vocabularies.Communication.v1.Contact"] = "com.sap.vocabularies.Communication.v1.ContactType";
    TermToTypes["com.sap.vocabularies.Communication.v1.Address"] = "com.sap.vocabularies.Communication.v1.AddressType";
    TermToTypes["com.sap.vocabularies.Communication.v1.IsEmailAddress"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Communication.v1.IsPhoneNumber"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Communication.v1.Event"] = "com.sap.vocabularies.Communication.v1.EventData";
    TermToTypes["com.sap.vocabularies.Communication.v1.Task"] = "com.sap.vocabularies.Communication.v1.TaskData";
    TermToTypes["com.sap.vocabularies.Communication.v1.Message"] = "com.sap.vocabularies.Communication.v1.MessageData";
    TermToTypes["com.sap.vocabularies.Hierarchy.v1.RecursiveHierarchy"] = "com.sap.vocabularies.Hierarchy.v1.RecursiveHierarchyType";
    TermToTypes["com.sap.vocabularies.PersonalData.v1.EntitySemantics"] = "com.sap.vocabularies.PersonalData.v1.EntitySemanticsType";
    TermToTypes["com.sap.vocabularies.PersonalData.v1.FieldSemantics"] = "com.sap.vocabularies.PersonalData.v1.FieldSemanticsType";
    TermToTypes["com.sap.vocabularies.PersonalData.v1.IsPotentiallyPersonal"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.Session.v1.StickySessionSupported"] = "com.sap.vocabularies.Session.v1.StickySessionSupportedType";
    TermToTypes["com.sap.vocabularies.UI.v1.HeaderInfo"] = "com.sap.vocabularies.UI.v1.HeaderInfoType";
    TermToTypes["com.sap.vocabularies.UI.v1.Identification"] = "com.sap.vocabularies.UI.v1.DataFieldAbstract";
    TermToTypes["com.sap.vocabularies.UI.v1.Badge"] = "com.sap.vocabularies.UI.v1.BadgeType";
    TermToTypes["com.sap.vocabularies.UI.v1.LineItem"] = "com.sap.vocabularies.UI.v1.DataFieldAbstract";
    TermToTypes["com.sap.vocabularies.UI.v1.StatusInfo"] = "com.sap.vocabularies.UI.v1.DataFieldAbstract";
    TermToTypes["com.sap.vocabularies.UI.v1.FieldGroup"] = "com.sap.vocabularies.UI.v1.FieldGroupType";
    TermToTypes["com.sap.vocabularies.UI.v1.ConnectedFields"] = "com.sap.vocabularies.UI.v1.ConnectedFieldsType";
    TermToTypes["com.sap.vocabularies.UI.v1.GeoLocations"] = "com.sap.vocabularies.UI.v1.GeoLocationType";
    TermToTypes["com.sap.vocabularies.UI.v1.GeoLocation"] = "com.sap.vocabularies.UI.v1.GeoLocationType";
    TermToTypes["com.sap.vocabularies.UI.v1.Contacts"] = "Edm.AnnotationPath";
    TermToTypes["com.sap.vocabularies.UI.v1.MediaResource"] = "com.sap.vocabularies.UI.v1.MediaResourceType";
    TermToTypes["com.sap.vocabularies.UI.v1.DataPoint"] = "com.sap.vocabularies.UI.v1.DataPointType";
    TermToTypes["com.sap.vocabularies.UI.v1.KPI"] = "com.sap.vocabularies.UI.v1.KPIType";
    TermToTypes["com.sap.vocabularies.UI.v1.Chart"] = "com.sap.vocabularies.UI.v1.ChartDefinitionType";
    TermToTypes["com.sap.vocabularies.UI.v1.ValueCriticality"] = "com.sap.vocabularies.UI.v1.ValueCriticalityType";
    TermToTypes["com.sap.vocabularies.UI.v1.CriticalityLabels"] = "com.sap.vocabularies.UI.v1.CriticalityLabelType";
    TermToTypes["com.sap.vocabularies.UI.v1.SelectionFields"] = "Edm.PropertyPath";
    TermToTypes["com.sap.vocabularies.UI.v1.Facets"] = "com.sap.vocabularies.UI.v1.Facet";
    TermToTypes["com.sap.vocabularies.UI.v1.HeaderFacets"] = "com.sap.vocabularies.UI.v1.Facet";
    TermToTypes["com.sap.vocabularies.UI.v1.QuickViewFacets"] = "com.sap.vocabularies.UI.v1.Facet";
    TermToTypes["com.sap.vocabularies.UI.v1.QuickCreateFacets"] = "com.sap.vocabularies.UI.v1.Facet";
    TermToTypes["com.sap.vocabularies.UI.v1.FilterFacets"] = "com.sap.vocabularies.UI.v1.ReferenceFacet";
    TermToTypes["com.sap.vocabularies.UI.v1.SelectionPresentationVariant"] = "com.sap.vocabularies.UI.v1.SelectionPresentationVariantType";
    TermToTypes["com.sap.vocabularies.UI.v1.PresentationVariant"] = "com.sap.vocabularies.UI.v1.PresentationVariantType";
    TermToTypes["com.sap.vocabularies.UI.v1.SelectionVariant"] = "com.sap.vocabularies.UI.v1.SelectionVariantType";
    TermToTypes["com.sap.vocabularies.UI.v1.ThingPerspective"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.IsSummary"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.PartOfPreview"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.Map"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.Gallery"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.IsImageURL"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.IsImage"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.MultiLineText"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.TextArrangement"] = "com.sap.vocabularies.UI.v1.TextArrangementType";
    TermToTypes["com.sap.vocabularies.UI.v1.Importance"] = "com.sap.vocabularies.UI.v1.ImportanceType";
    TermToTypes["com.sap.vocabularies.UI.v1.Hidden"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.CreateHidden"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.UpdateHidden"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.DeleteHidden"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.HiddenFilter"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.DataFieldDefault"] = "com.sap.vocabularies.UI.v1.DataFieldAbstract";
    TermToTypes["com.sap.vocabularies.UI.v1.Criticality"] = "com.sap.vocabularies.UI.v1.CriticalityType";
    TermToTypes["com.sap.vocabularies.UI.v1.CriticalityCalculation"] = "com.sap.vocabularies.UI.v1.CriticalityCalculationType";
    TermToTypes["com.sap.vocabularies.UI.v1.Emphasized"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.UI.v1.OrderBy"] = "Edm.PropertyPath";
    TermToTypes["com.sap.vocabularies.UI.v1.ParameterDefaultValue"] = "Edm.PrimitiveType";
    TermToTypes["com.sap.vocabularies.UI.v1.RecommendationState"] = "com.sap.vocabularies.UI.v1.RecommendationStateType";
    TermToTypes["com.sap.vocabularies.UI.v1.RecommendationList"] = "com.sap.vocabularies.UI.v1.RecommendationListType";
    TermToTypes["com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext"] = "Org.OData.Core.V1.Tag";
    TermToTypes["com.sap.vocabularies.HTML5.v1.CssDefaults"] = "com.sap.vocabularies.HTML5.v1.CssDefaultsType";
  })(TermToTypes || (TermToTypes = {}));

  var defaultReferences = [{
    alias: "Capabilities",
    namespace: "Org.OData.Capabilities.V1",
    uri: ""
  }, {
    alias: "Aggregation",
    namespace: "Org.OData.Aggregation.V1",
    uri: ""
  }, {
    alias: "Validation",
    namespace: "Org.OData.Validation.V1",
    uri: ""
  }, {
    namespace: "Org.OData.Core.V1",
    alias: "Core",
    uri: ""
  }, {
    namespace: "Org.OData.Measures.V1",
    alias: "Measures",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.Common.v1",
    alias: "Common",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.UI.v1",
    alias: "UI",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.Session.v1",
    alias: "Session",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.Analytics.v1",
    alias: "Analytics",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.CodeList.v1",
    alias: "CodeList",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.PersonalData.v1",
    alias: "PersonalData",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.Communication.v1",
    alias: "Communication",
    uri: ""
  }, {
    namespace: "com.sap.vocabularies.HTML5.v1",
    alias: "HTML5",
    uri: ""
  }];
  _exports.defaultReferences = defaultReferences;

  function alias(references, unaliasedValue) {
    if (!references.reverseReferenceMap) {
      references.reverseReferenceMap = references.reduce(function (map, reference) {
        map[reference.namespace] = reference;
        return map;
      }, {});
    }

    if (!unaliasedValue) {
      return unaliasedValue;
    }

    var lastDotIndex = unaliasedValue.lastIndexOf(".");
    var namespace = unaliasedValue.substr(0, lastDotIndex);
    var value = unaliasedValue.substr(lastDotIndex + 1);
    var reference = references.reverseReferenceMap[namespace];

    if (reference) {
      return "".concat(reference.alias, ".").concat(value);
    } else {
      // Try to see if it's an annotation Path like to_SalesOrder/@UI.LineItem
      if (unaliasedValue.indexOf("@") !== -1) {
        var _unaliasedValue$split = unaliasedValue.split("@"),
            _unaliasedValue$split2 = _toArray(_unaliasedValue$split),
            preAlias = _unaliasedValue$split2[0],
            postAlias = _unaliasedValue$split2.slice(1);

        return "".concat(preAlias, "@").concat(alias(references, postAlias.join("@")));
      } else {
        return unaliasedValue;
      }
    }
  }

  function unalias(references, aliasedValue) {
    if (!references.referenceMap) {
      references.referenceMap = references.reduce(function (map, reference) {
        map[reference.alias] = reference;
        return map;
      }, {});
    }

    if (!aliasedValue) {
      return aliasedValue;
    }

    var _aliasedValue$split = aliasedValue.split("."),
        _aliasedValue$split2 = _toArray(_aliasedValue$split),
        alias = _aliasedValue$split2[0],
        value = _aliasedValue$split2.slice(1);

    var reference = references.referenceMap[alias];

    if (reference) {
      return "".concat(reference.namespace, ".").concat(value.join("."));
    } else {
      // Try to see if it's an annotation Path like to_SalesOrder/@UI.LineItem
      if (aliasedValue.indexOf("@") !== -1) {
        var _aliasedValue$split3 = aliasedValue.split("@"),
            _aliasedValue$split4 = _toArray(_aliasedValue$split3),
            preAlias = _aliasedValue$split4[0],
            postAlias = _aliasedValue$split4.slice(1);

        return "".concat(preAlias, "@").concat(unalias(references, postAlias.join("@")));
      } else {
        return aliasedValue;
      }
    }
  }

  function buildObjectMap(parserOutput) {
    var objectMap = {};

    if (parserOutput.schema.entityContainer && parserOutput.schema.entityContainer.fullyQualifiedName) {
      objectMap[parserOutput.schema.entityContainer.fullyQualifiedName] = parserOutput.schema.entityContainer;
    }

    parserOutput.schema.entitySets.forEach(function (entitySet) {
      objectMap[entitySet.fullyQualifiedName] = entitySet;
    });
    parserOutput.schema.actions.forEach(function (action) {
      objectMap[action.fullyQualifiedName] = action;

      if (action.isBound) {
        var unBoundActionName = action.fullyQualifiedName.split("(")[0];

        if (!objectMap[unBoundActionName]) {
          objectMap[unBoundActionName] = {
            _type: "UnboundGenericAction",
            actions: []
          };
        }

        objectMap[unBoundActionName].actions.push(action);
      }

      action.parameters.forEach(function (parameter) {
        objectMap[parameter.fullyQualifiedName] = parameter;
      });
    });
    parserOutput.schema.complexTypes.forEach(function (complexType) {
      objectMap[complexType.fullyQualifiedName] = complexType;
      complexType.properties.forEach(function (property) {
        objectMap[property.fullyQualifiedName] = property;
      });
    });
    parserOutput.schema.entityTypes.forEach(function (entityType) {
      objectMap[entityType.fullyQualifiedName] = entityType;
      entityType.entityProperties.forEach(function (property) {
        objectMap[property.fullyQualifiedName] = property;

        if (property.type.indexOf("Edm") === -1) {
          // Handle complex types
          var complexTypeDefinition = objectMap[property.type];

          if (complexTypeDefinition && complexTypeDefinition.properties) {
            complexTypeDefinition.properties.forEach(function (complexTypeProp) {
              var complexTypePropTarget = Object.assign(complexTypeProp, {
                _type: "Property",
                fullyQualifiedName: property.fullyQualifiedName + "/" + complexTypeProp.name
              });
              objectMap[complexTypePropTarget.fullyQualifiedName] = complexTypePropTarget;
            });
          }
        }
      });
      entityType.navigationProperties.forEach(function (navProperty) {
        objectMap[navProperty.fullyQualifiedName] = navProperty;
      });
    });
    Object.keys(parserOutput.schema.annotations).forEach(function (annotationSource) {
      parserOutput.schema.annotations[annotationSource].forEach(function (annotationList) {
        var currentTargetName = unalias(parserOutput.references, annotationList.target);
        annotationList.annotations.forEach(function (annotation) {
          var annotationFQN = "".concat(currentTargetName, "@").concat(unalias(parserOutput.references, annotation.term));

          if (annotation.qualifier) {
            annotationFQN += "#".concat(annotation.qualifier);
          }

          if (typeof annotation !== "object") {
            debugger;
          }

          objectMap[annotationFQN] = annotation;
          annotation.fullyQualifiedName = annotationFQN;
        });
      });
    });
    return objectMap;
  }

  function combinePath(currentTarget, path) {
    if (path.startsWith("@")) {
      return currentTarget + unalias(defaultReferences, path);
    } else {
      return currentTarget + "/" + path;
    }
  }

  function addAnnotationErrorMessage(path, oErrorMsg) {
    if (!ALL_ANNOTATION_ERRORS[path]) {
      ALL_ANNOTATION_ERRORS[path] = [oErrorMsg];
    } else {
      ALL_ANNOTATION_ERRORS[path].push(oErrorMsg);
    }
  }

  function resolveTarget(objectMap, currentTarget, path) {
    var pathOnly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var includeVisitedObjects = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var annotationType = arguments.length > 5 ? arguments[5] : undefined;
    var annotationsTerm = arguments.length > 6 ? arguments[6] : undefined;

    if (!path) {
      return undefined;
    } //const propertyPath = path;


    var aVisitedObjects = [];

    if (currentTarget && currentTarget._type === "Property") {
      currentTarget = objectMap[currentTarget.fullyQualifiedName.split("/")[0]];
    }

    path = combinePath(currentTarget.fullyQualifiedName, path);
    var pathSplit = path.split("/");
    var targetPathSplit = [];
    pathSplit.forEach(function (pathPart) {
      // Separate out the annotation
      if (pathPart.indexOf("@") !== -1) {
        var _pathPart$split = pathPart.split("@"),
            _pathPart$split2 = _slicedToArray(_pathPart$split, 2),
            _path = _pathPart$split2[0],
            annotationPath = _pathPart$split2[1];

        targetPathSplit.push(_path);
        targetPathSplit.push("@".concat(annotationPath));
      } else {
        targetPathSplit.push(pathPart);
      }
    });
    var currentPath = path;
    var currentContext = currentTarget;
    var target = targetPathSplit.reduce(function (currentValue, pathPart) {
      if (pathPart === "$Type" && currentValue._type === "EntityType") {
        return currentValue;
      }

      if (pathPart.length === 0) {
        // Empty Path after an entitySet means entityType
        if (currentValue && currentValue._type === "EntitySet" && currentValue.entityType) {
          if (includeVisitedObjects) {
            aVisitedObjects.push(currentValue);
          }

          currentValue = currentValue.entityType;
        }

        if (currentValue && currentValue._type === "NavigationProperty" && currentValue.targetType) {
          if (includeVisitedObjects) {
            aVisitedObjects.push(currentValue);
          }

          currentValue = currentValue.targetType;
        }

        return currentValue;
      }

      if (includeVisitedObjects && currentValue !== null && currentValue !== undefined) {
        aVisitedObjects.push(currentValue);
      }

      if (!currentValue) {
        currentPath = pathPart;
      } else if (currentValue._type === "EntitySet" && pathPart === "$Type") {
        currentValue = currentValue.targetType;
        return currentValue;
      } else if (currentValue._type === "EntitySet" && currentValue.entityType) {
        currentPath = combinePath(currentValue.entityTypeName, pathPart);
      } else if (currentValue._type === "NavigationProperty" && currentValue.targetTypeName) {
        currentPath = combinePath(currentValue.targetTypeName, pathPart);
      } else if (currentValue._type === "NavigationProperty" && currentValue.targetType) {
        currentPath = combinePath(currentValue.targetType.fullyQualifiedName, pathPart);
      } else if (currentValue._type === "Property") {
        // ComplexType or Property
        if (currentValue.targetType) {
          currentPath = combinePath(currentValue.targetType.fullyQualifiedName, pathPart);
        } else {
          currentPath = combinePath(currentValue.fullyQualifiedName, pathPart);
        }
      } else if (currentValue._type === "Action" && currentValue.isBound) {
        currentPath = combinePath(currentValue.fullyQualifiedName, pathPart);

        if (!objectMap[currentPath]) {
          currentPath = combinePath(currentValue.sourceType, pathPart);
        }
      } else if (currentValue._type === "ActionParameter" && currentValue.isEntitySet) {
        currentPath = combinePath(currentValue.type, pathPart);
      } else if (currentValue._type === "ActionParameter" && !currentValue.isEntitySet) {
        currentPath = combinePath(currentTarget.fullyQualifiedName.substr(0, currentTarget.fullyQualifiedName.lastIndexOf("/")), pathPart);

        if (!objectMap[currentPath]) {
          var lastIdx = currentTarget.fullyQualifiedName.lastIndexOf("/");

          if (lastIdx === -1) {
            lastIdx = currentTarget.fullyQualifiedName.length;
          }

          currentPath = combinePath(objectMap[currentTarget.fullyQualifiedName.substr(0, lastIdx)].sourceType, pathPart);
        }
      } else {
        currentPath = combinePath(currentValue.fullyQualifiedName, pathPart);

        if (pathPart !== "name" && currentValue[pathPart] !== undefined) {
          return currentValue[pathPart];
        } else if (pathPart === "$AnnotationPath" && currentValue.$target) {
          var _currentContext = objectMap[currentValue.fullyQualifiedName.split("@")[0]];
          var subTarget = resolveTarget(objectMap, _currentContext, currentValue.value, false, true);
          subTarget.visitedObjects.forEach(function (visitedSubObject) {
            if (aVisitedObjects.indexOf(visitedSubObject) === -1) {
              aVisitedObjects.push(visitedSubObject);
            }
          });
          return subTarget.target;
        } else if (pathPart === "$Path" && currentValue.$target) {
          currentContext = aVisitedObjects.concat().reverse().find(function (obj) {
            return obj._type === "EntityType" || obj._type === "EntitySet" || obj._type === "NavigationProperty";
          });

          if (currentContext) {
            var _subTarget = resolveTarget(objectMap, currentContext, currentValue.path, false, true);

            _subTarget.visitedObjects.forEach(function (visitedSubObject) {
              if (aVisitedObjects.indexOf(visitedSubObject) === -1) {
                aVisitedObjects.push(visitedSubObject);
              }
            });

            return _subTarget.target;
          }

          return currentValue.$target;
        } else if (pathPart.startsWith("$Path") && currentValue.$target) {
          var intermediateTarget = currentValue.$target;
          currentPath = combinePath(intermediateTarget.fullyQualifiedName, pathPart.substr(5));
        } else if (currentValue.hasOwnProperty("$Type") && !objectMap[currentPath]) {
          // This is now an annotation value
          var entityType = objectMap[currentValue.fullyQualifiedName.split("@")[0]];

          if (entityType) {
            currentPath = combinePath(entityType.fullyQualifiedName, pathPart);
          }
        }
      }

      return objectMap[currentPath];
    }, null);

    if (!target) {
      if (annotationsTerm && annotationType) {
        var oErrorMsg = {
          message: "Unable to resolve the path expression: " + "\n" + path + "\n" + "\n" + "Hint: Check and correct the path values under the following structure in the metadata (annotation.xml file or CDS annotations for the application): \n\n" + "<Annotation Term = " + annotationsTerm + ">" + "\n" + "<Record Type = " + annotationType + ">" + "\n" + "<AnnotationPath = " + path + ">"
        };
        addAnnotationErrorMessage(path, oErrorMsg);
      } else {
        var oErrorMsg = {
          message: "Unable to resolve the path expression: " + path + "\n" + "\n" + "Hint: Check and correct the path values under the following structure in the metadata (annotation.xml file or CDS annotations for the application): \n\n" + "<Annotation Term = " + pathSplit[0] + ">" + "\n" + "<PropertyValue  Path= " + pathSplit[1] + ">"
        };
        addAnnotationErrorMessage(path, oErrorMsg);
      } // console.log("Missing target " + path);

    }

    if (pathOnly) {
      return currentPath;
    }

    if (includeVisitedObjects) {
      return {
        visitedObjects: aVisitedObjects,
        target: target
      };
    }

    return target;
  }

  function isAnnotationPath(pathStr) {
    return pathStr.indexOf("@") !== -1;
  }

  function parseValue(propertyValue, valueFQN, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotationsTerm) {
    if (propertyValue === undefined) {
      return undefined;
    }

    switch (propertyValue.type) {
      case "String":
        return propertyValue.String;

      case "Int":
        return propertyValue.Int;

      case "Bool":
        return propertyValue.Bool;

      case "Decimal":
        return propertyValue.Decimal;

      case "Date":
        return propertyValue.Date;

      case "EnumMember":
        return alias(parserOutput.references, propertyValue.EnumMember);

      case "PropertyPath":
        return {
          type: "PropertyPath",
          value: propertyValue.PropertyPath,
          fullyQualifiedName: valueFQN,
          $target: resolveTarget(objectMap, currentTarget, propertyValue.PropertyPath, false, false, annotationType, annotationsTerm)
        };

      case "NavigationPropertyPath":
        return {
          type: "NavigationPropertyPath",
          value: propertyValue.NavigationPropertyPath,
          fullyQualifiedName: valueFQN,
          $target: resolveTarget(objectMap, currentTarget, propertyValue.NavigationPropertyPath, false, false, annotationType, annotationsTerm)
        };

      case "AnnotationPath":
        var annotationTarget = resolveTarget(objectMap, currentTarget, unalias(parserOutput.references, propertyValue.AnnotationPath), true, false, annotationType, annotationsTerm);
        var annotationPath = {
          type: "AnnotationPath",
          value: propertyValue.AnnotationPath,
          fullyQualifiedName: valueFQN,
          $target: annotationTarget,
          annotationType: annotationType,
          annotationsTerm: annotationsTerm,
          term: "",
          path: ""
        };
        toResolve.push({
          inline: false,
          toResolve: annotationPath
        });
        return annotationPath;

      case "Path":
        var $target = resolveTarget(objectMap, currentTarget, propertyValue.Path, true, false, annotationType, annotationsTerm);
        var path = new Path(propertyValue, $target, annotationsTerm, annotationType, "");
        toResolve.push({
          inline: isAnnotationPath(propertyValue.Path),
          toResolve: path
        });
        return path;

      case "Record":
        return parseRecord(propertyValue.Record, valueFQN, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotationsTerm);

      case "Collection":
        return parseCollection(propertyValue.Collection, valueFQN, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotationsTerm);

      case "Apply":
      case "Not":
      case "Eq":
      case "Ne":
      case "Gt":
      case "Ge":
      case "Lt":
      case "Le":
      case "If":
      case "And":
      case "Or":
        return propertyValue;
    }
  }

  function inferTypeFromTerm(annotationsTerm, parserOutput, annotationTarget) {
    var targetType = TermToTypes[annotationsTerm];
    var oErrorMsg = {
      isError: false,
      message: "The type of the record used within the term ".concat(annotationsTerm, " was not defined and was inferred as ").concat(targetType, ".\nHint: If possible, try to maintain the Type property for each Record.\n<Annotations Target=\"").concat(annotationTarget, "\">\n\t<Annotation Term=\"").concat(annotationsTerm, "\">\n\t\t<Record>...</Record>\n\t</Annotation>\n</Annotations>")
    };
    addAnnotationErrorMessage(annotationTarget + "/" + annotationsTerm, oErrorMsg);
    return targetType;
  }

  function parseRecord(recordDefinition, currentFQN, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotationsTerm) {
    var targetType;

    if (!recordDefinition.type && annotationsTerm) {
      targetType = inferTypeFromTerm(annotationsTerm, parserOutput, currentTarget.fullyQualifiedName);
    } else {
      targetType = unalias(parserOutput.references, recordDefinition.type);
    }

    var annotationTerm = {
      $Type: targetType,
      fullyQualifiedName: currentFQN
    };
    var annotationContent = {};

    if (recordDefinition.annotations && Array.isArray(recordDefinition.annotations)) {
      var subAnnotationList = {
        target: currentFQN,
        annotations: recordDefinition.annotations,
        __source: annotationSource
      };
      unresolvedAnnotations.push(subAnnotationList);
    }

    recordDefinition.propertyValues.forEach(function (propertyValue) {
      annotationContent[propertyValue.name] = parseValue(propertyValue.value, "".concat(currentFQN, "/").concat(propertyValue.name), parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotationsTerm);

      if (propertyValue.annotations && Array.isArray(propertyValue.annotations)) {
        var _subAnnotationList = {
          target: "".concat(currentFQN, "/").concat(propertyValue.name),
          annotations: propertyValue.annotations,
          __source: annotationSource
        };
        unresolvedAnnotations.push(_subAnnotationList);
      }

      if (annotationContent.hasOwnProperty("Action") && (annotationTerm.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" || annotationTerm.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithAction")) {
        annotationContent.ActionTarget = currentTarget.actions && currentTarget.actions[annotationContent.Action] || objectMap[annotationContent.Action];

        if (!annotationContent.ActionTarget) {
          // Add to diagnostics debugger;
          ANNOTATION_ERRORS.push({
            message: "Unable to resolve the action " + annotationContent.Action + " defined for " + annotationTerm.fullyQualifiedName
          });
        }
      }
    });
    return Object.assign(annotationTerm, annotationContent);
  }

  function getOrInferCollectionType(collectionDefinition) {
    var type = collectionDefinition.type;

    if (type === undefined && collectionDefinition.length > 0) {
      var firstColItem = collectionDefinition[0];

      if (firstColItem.hasOwnProperty("PropertyPath")) {
        type = "PropertyPath";
      } else if (firstColItem.hasOwnProperty("Path")) {
        type = "Path";
      } else if (firstColItem.hasOwnProperty("AnnotationPath")) {
        type = "AnnotationPath";
      } else if (firstColItem.hasOwnProperty("NavigationPropertyPath")) {
        type = "NavigationPropertyPath";
      } else if (typeof firstColItem === "object" && (firstColItem.hasOwnProperty("type") || firstColItem.hasOwnProperty("propertyValues"))) {
        type = "Record";
      } else if (typeof firstColItem === "string") {
        type = "String";
      }
    } else if (type === undefined) {
      type = "EmptyCollection";
    }

    return type;
  }

  function parseCollection(collectionDefinition, parentFQN, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotationsTerm) {
    var collectionDefinitionType = getOrInferCollectionType(collectionDefinition);

    switch (collectionDefinitionType) {
      case "PropertyPath":
        return collectionDefinition.map(function (propertyPath, propertyIdx) {
          return {
            type: "PropertyPath",
            value: propertyPath.PropertyPath,
            fullyQualifiedName: "".concat(parentFQN, "/").concat(propertyIdx),
            $target: resolveTarget(objectMap, currentTarget, propertyPath.PropertyPath, false, false, annotationType, annotationsTerm)
          };
        });

      case "Path":
        return collectionDefinition.map(function (pathValue) {
          var $target = resolveTarget(objectMap, currentTarget, pathValue.Path, true, false, annotationType, annotationsTerm);
          var path = new Path(pathValue, $target, annotationsTerm, annotationType, "");
          toResolve.push({
            inline: isAnnotationPath(pathValue.Path),
            toResolve: path
          });
          return path;
        });

      case "AnnotationPath":
        return collectionDefinition.map(function (annotationPath, annotationIdx) {
          var annotationTarget = resolveTarget(objectMap, currentTarget, annotationPath.AnnotationPath, true, false, annotationType, annotationsTerm);
          var annotationCollectionElement = {
            type: "AnnotationPath",
            value: annotationPath.AnnotationPath,
            fullyQualifiedName: "".concat(parentFQN, "/").concat(annotationIdx),
            $target: annotationTarget,
            annotationType: annotationType,
            annotationsTerm: annotationsTerm,
            term: "",
            path: ""
          };
          toResolve.push({
            inline: false,
            toResolve: annotationCollectionElement
          });
          return annotationCollectionElement;
        });

      case "NavigationPropertyPath":
        return collectionDefinition.map(function (navPropertyPath, navPropIdx) {
          return {
            type: "NavigationPropertyPath",
            value: navPropertyPath.NavigationPropertyPath,
            fullyQualifiedName: "".concat(parentFQN, "/").concat(navPropIdx),
            $target: resolveTarget(objectMap, currentTarget, navPropertyPath.NavigationPropertyPath, false, false, annotationType, annotationsTerm)
          };
        });

      case "Record":
        return collectionDefinition.map(function (recordDefinition, recordIdx) {
          return parseRecord(recordDefinition, "".concat(parentFQN, "/").concat(recordIdx), parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotationsTerm);
        });

      case "Apply":
      case "If":
      case "Eq":
      case "Ne":
      case "Lt":
      case "Gt":
      case "Le":
      case "Ge":
      case "Not":
      case "And":
      case "Or":
        return collectionDefinition.map(function (ifValue) {
          return ifValue;
        });

      case "String":
        return collectionDefinition.map(function (stringValue) {
          if (typeof stringValue === "string") {
            return stringValue;
          } else if (stringValue === undefined) {
            return stringValue;
          } else {
            return stringValue.String;
          }
        });

      default:
        if (collectionDefinition.length === 0) {
          return [];
        }

        throw new Error("Unsupported case");
    }
  }

  function convertAnnotation(annotation, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations) {
    if (annotation.record) {
      var annotationType = annotation.record.type ? unalias(parserOutput.references, annotation.record.type) : inferTypeFromTerm(annotation.term, parserOutput, currentTarget.fullyQualifiedName);
      var annotationTerm = {
        $Type: annotationType,
        fullyQualifiedName: annotation.fullyQualifiedName,
        qualifier: annotation.qualifier
      };
      var annotationContent = {};
      annotation.record.propertyValues.forEach(function (propertyValue) {
        annotationContent[propertyValue.name] = parseValue(propertyValue.value, "".concat(annotation.fullyQualifiedName, "/").concat(propertyValue.name), parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, annotationType, annotation.term);

        if (annotationContent.hasOwnProperty("Action") && (!annotation.record || annotationTerm.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" || annotationTerm.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithAction")) {
          annotationContent.ActionTarget = currentTarget.actions && currentTarget.actions[annotationContent.Action] || objectMap[annotationContent.Action];

          if (!annotationContent.ActionTarget) {
            ANNOTATION_ERRORS.push({
              message: "Unable to resolve the action " + annotationContent.Action + " defined for " + annotation.fullyQualifiedName
            }); // Add to diagnostics
            // debugger;
          }
        }
      });
      return Object.assign(annotationTerm, annotationContent);
    } else if (annotation.collection === undefined) {
      if (annotation.value) {
        return parseValue(annotation.value, annotation.fullyQualifiedName, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, "", annotation.term);
      } else {
        return true;
      }
    } else if (annotation.collection) {
      var collection = parseCollection(annotation.collection, annotation.fullyQualifiedName, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations, "", annotation.term);
      collection.fullyQualifiedName = annotation.fullyQualifiedName;
      return collection;
    } else {
      throw new Error("Unsupported case");
    }
  }

  function createResolvePathFn(entityType, objectMap) {
    return function (relativePath, includeVisitedObjects) {
      var annotationTerm = "";
      var annotationType = "";
      return resolveTarget(objectMap, entityType, relativePath, false, includeVisitedObjects, annotationType, annotationTerm);
    };
  }

  function resolveNavigationProperties(entityTypes, associations, objectMap) {
    entityTypes.forEach(function (entityType) {
      entityType.navigationProperties = entityType.navigationProperties.map(function (navProp) {
        var outNavProp = {
          _type: "NavigationProperty",
          name: navProp.name,
          fullyQualifiedName: navProp.fullyQualifiedName,
          partner: navProp.hasOwnProperty("partner") ? navProp.partner : undefined,
          // targetTypeName: FullyQualifiedName;
          // targetType: EntityType;
          isCollection: navProp.hasOwnProperty("isCollection") ? navProp.isCollection : false,
          containsTarget: navProp.hasOwnProperty("containsTarget") ? navProp.containsTarget : false,
          referentialConstraint: navProp.referentialConstraint ? navProp.referentialConstraint : [],
          annotations: {}
        };

        if (navProp.targetTypeName) {
          outNavProp.targetType = objectMap[navProp.targetTypeName];
        } else if (navProp.relationship) {
          var targetAssociation = associations.find(function (association) {
            return association.fullyQualifiedName === navProp.relationship;
          });

          if (targetAssociation) {
            var associationEnd = targetAssociation.associationEnd.find(function (end) {
              return end.role === navProp.toRole;
            });

            if (associationEnd) {
              outNavProp.targetType = objectMap[associationEnd.type];
              outNavProp.isCollection = associationEnd.multiplicity === "*";
            }
          }
        }

        if (outNavProp.targetType) {
          outNavProp.targetTypeName = outNavProp.targetType.fullyQualifiedName;
        }

        var outNavPropReq = outNavProp;
        objectMap[outNavPropReq.fullyQualifiedName] = outNavPropReq;
        return outNavPropReq;
      });
      entityType.resolvePath = createResolvePathFn(entityType, objectMap);
    });
  }

  function linkActionsToEntityType(namespace, actions, objectMap) {
    actions.forEach(function (action) {
      if (!action.annotations) {
        action.annotations = {};
      }

      if (action.isBound) {
        var sourceEntityType = objectMap[action.sourceType];
        action.sourceEntityType = sourceEntityType;

        if (sourceEntityType) {
          if (!sourceEntityType.actions) {
            sourceEntityType.actions = {};
          }

          sourceEntityType.actions[action.name] = action;
          sourceEntityType.actions["".concat(namespace, ".").concat(action.name)] = action;
        }

        action.returnEntityType = objectMap[action.returnType];
      }
    });
  }

  function linkEntityTypeToEntitySet(entitySets, objectMap, references) {
    entitySets.forEach(function (entitySet) {
      entitySet.entityType = objectMap[entitySet.entityTypeName];

      if (!entitySet.entityType) {
        entitySet.entityType = objectMap[unalias(references, entitySet.entityTypeName)];
      }

      if (!entitySet.annotations) {
        entitySet.annotations = {};
      }

      if (!entitySet.entityType.annotations) {
        entitySet.entityType.annotations = {};
      }

      entitySet.entityType.keys.forEach(function (keyProp) {
        keyProp.isKey = true;
      });
    });
  }

  function linkEntityTypeToSingleton(singletons, objectMap, references) {
    singletons.forEach(function (singleton) {
      singleton.type = objectMap[singleton.typeName];

      if (!singleton.type) {
        singleton.type = objectMap[unalias(references, singleton.typeName)];
      }

      if (!singleton.annotations) {
        singleton.annotations = {};
      }

      if (!singleton.type.annotations) {
        singleton.type.annotations = {};
      }

      singleton.type.keys.forEach(function (keyProp) {
        keyProp.isKey = true;
      });
    });
  }

  function linkPropertiesToComplexTypes(entityTypes, objectMap) {
    entityTypes.forEach(function (entityType) {
      entityType.entityProperties.forEach(function (entityProperty) {
        if (!entityProperty.annotations) {
          entityProperty.annotations = {};
        }

        if (entityProperty.type.indexOf("Edm") === -1) {
          if (entityProperty.type.startsWith("Collection")) {
            var complexTypeName = entityProperty.type.substr(11, entityProperty.type.length - 12);
            var complexType = objectMap[complexTypeName];

            if (complexType) {
              entityProperty.targetType = complexType;
            }
          } else {
            var _complexType = objectMap[entityProperty.type];

            if (_complexType) {
              entityProperty.targetType = _complexType;
            }
          }
        }
      });
    });
  }

  function prepareComplexTypes(complexTypes, associations, objectMap) {
    complexTypes.forEach(function (complexType) {
      complexType.annotations = {};
      complexType.properties.forEach(function (property) {
        if (!property.annotations) {
          property.annotations = {};
        }
      });
      complexType.navigationProperties = complexType.navigationProperties.map(function (navProp) {
        if (!navProp.annotations) {
          navProp.annotations = {};
        }

        var outNavProp = {
          _type: "NavigationProperty",
          name: navProp.name,
          fullyQualifiedName: navProp.fullyQualifiedName,
          partner: navProp.hasOwnProperty("partner") ? navProp.partner : undefined,
          // targetTypeName: FullyQualifiedName;
          // targetType: EntityType;
          isCollection: navProp.hasOwnProperty("isCollection") ? navProp.isCollection : false,
          containsTarget: navProp.hasOwnProperty("containsTarget") ? navProp.containsTarget : false,
          referentialConstraint: navProp.referentialConstraint ? navProp.referentialConstraint : []
        };

        if (navProp.targetTypeName) {
          outNavProp.targetType = objectMap[navProp.targetTypeName];
        } else if (navProp.relationship) {
          var targetAssociation = associations.find(function (association) {
            return association.fullyQualifiedName === navProp.relationship;
          });

          if (targetAssociation) {
            var associationEnd = targetAssociation.associationEnd.find(function (end) {
              return end.role === navProp.toRole;
            });

            if (associationEnd) {
              outNavProp.targetType = objectMap[associationEnd.type];
              outNavProp.isCollection = associationEnd.multiplicity === "*";
            }
          }
        }

        if (outNavProp.targetType) {
          outNavProp.targetTypeName = outNavProp.targetType.fullyQualifiedName;
        }

        var outNavPropReq = outNavProp;
        objectMap[outNavPropReq.fullyQualifiedName] = outNavPropReq;
        return outNavPropReq;
      });
    });
  }

  function splitTerm(references, termValue) {
    var aliasedTerm = alias(references, termValue);
    var lastDot = aliasedTerm.lastIndexOf(".");
    var termAlias = aliasedTerm.substr(0, lastDot);
    var term = aliasedTerm.substr(lastDot + 1);
    return [termAlias, term];
  }
  /**
   * Resolve a specific path
   * @param sPath
   */


  function createGlobalResolve(convertedOutput, objectMap) {
    return function resolvePath(sPath) {
      var aPathSplit = sPath.split("/");

      if (aPathSplit.shift() !== "") {
        throw new Error("Cannot deal with relative path");
      }

      var entitySetName = aPathSplit.shift();
      var entitySet = convertedOutput.entitySets.find(function (et) {
        return et.name === entitySetName;
      });

      if (!entitySet) {
        return {
          target: convertedOutput.entityContainer,
          objectPath: [convertedOutput.entityContainer]
        };
      }

      if (aPathSplit.length === 0) {
        return {
          target: entitySet,
          objectPath: [convertedOutput.entityContainer, entitySet]
        };
      } else {
        var targetResolution = resolveTarget(objectMap, entitySet, "/" + aPathSplit.join("/"), false, true);

        if (targetResolution.target) {
          targetResolution.visitedObjects.push(targetResolution.target);
        }

        return {
          target: targetResolution.target,
          objectPath: targetResolution.visitedObjects
        };
      }
    };
  }

  var ANNOTATION_ERRORS = [];
  var ALL_ANNOTATION_ERRORS = {};

  function convertTypes(parserOutput) {
    ANNOTATION_ERRORS = [];
    var objectMap = buildObjectMap(parserOutput);
    resolveNavigationProperties(parserOutput.schema.entityTypes, parserOutput.schema.associations, objectMap);

    if (!parserOutput.schema.entityContainer.annotations) {
      parserOutput.schema.entityContainer.annotations = {};
    }

    linkActionsToEntityType(parserOutput.schema.namespace, parserOutput.schema.actions, objectMap);
    linkEntityTypeToEntitySet(parserOutput.schema.entitySets, objectMap, parserOutput.references);
    linkEntityTypeToSingleton(parserOutput.schema.singletons, objectMap, parserOutput.references);
    linkPropertiesToComplexTypes(parserOutput.schema.entityTypes, objectMap);
    prepareComplexTypes(parserOutput.schema.complexTypes, parserOutput.schema.associations, objectMap);
    var toResolve = [];
    var unresolvedAnnotations = [];
    Object.keys(parserOutput.schema.annotations).forEach(function (annotationSource) {
      parserOutput.schema.annotations[annotationSource].forEach(function (annotationList) {
        var currentTargetName = unalias(parserOutput.references, annotationList.target);
        var objectMapElement = objectMap[currentTargetName];

        if (!objectMapElement) {
          if (currentTargetName && currentTargetName.indexOf("@") !== -1) {
            annotationList.__source = annotationSource;
            unresolvedAnnotations.push(annotationList);
          }
        } else if (typeof objectMapElement === "object") {
          var allTargets = [objectMapElement];
          var bOverrideExisting = true;

          if (objectMapElement._type === "UnboundGenericAction") {
            allTargets = objectMapElement.actions;
            bOverrideExisting = false;
          }

          allTargets.forEach(function (currentTarget) {
            if (currentTargetName !== currentTarget.fullyQualifiedName) {
              currentTargetName = currentTarget.fullyQualifiedName;
            }

            if (!currentTarget.annotations) {
              currentTarget.annotations = {};
            }

            annotationList.annotations.forEach(function (annotation) {
              var _currentTarget$annota, _currentTarget$annota2;

              var _splitTerm = splitTerm(defaultReferences, annotation.term),
                  _splitTerm2 = _slicedToArray(_splitTerm, 2),
                  vocAlias = _splitTerm2[0],
                  vocTerm = _splitTerm2[1];

              if (!currentTarget.annotations[vocAlias]) {
                currentTarget.annotations[vocAlias] = {};
              }

              if (!currentTarget.annotations._annotations) {
                currentTarget.annotations._annotations = {};
              }

              var vocTermWithQualifier = "".concat(vocTerm).concat(annotation.qualifier ? "#".concat(annotation.qualifier) : "");

              if (!bOverrideExisting && ((_currentTarget$annota = currentTarget.annotations) === null || _currentTarget$annota === void 0 ? void 0 : (_currentTarget$annota2 = _currentTarget$annota[vocAlias]) === null || _currentTarget$annota2 === void 0 ? void 0 : _currentTarget$annota2[vocTermWithQualifier]) !== undefined) {
                return;
              }

              currentTarget.annotations[vocAlias][vocTermWithQualifier] = convertAnnotation(annotation, parserOutput, currentTarget, objectMap, toResolve, annotationSource, unresolvedAnnotations);

              switch (typeof currentTarget.annotations[vocAlias][vocTermWithQualifier]) {
                case "string":
                  currentTarget.annotations[vocAlias][vocTermWithQualifier] = new String(currentTarget.annotations[vocAlias][vocTermWithQualifier]);
                  break;

                case "boolean":
                  currentTarget.annotations[vocAlias][vocTermWithQualifier] = new Boolean(currentTarget.annotations[vocAlias][vocTermWithQualifier]);
                  break;
              }

              if (currentTarget.annotations[vocAlias][vocTermWithQualifier] !== null && typeof currentTarget.annotations[vocAlias][vocTermWithQualifier] === "object") {
                currentTarget.annotations[vocAlias][vocTermWithQualifier].term = unalias(defaultReferences, "".concat(vocAlias, ".").concat(vocTerm));
                currentTarget.annotations[vocAlias][vocTermWithQualifier].qualifier = annotation.qualifier;
                currentTarget.annotations[vocAlias][vocTermWithQualifier].__source = annotationSource;
              }

              var annotationTarget = "".concat(currentTargetName, "@").concat(unalias(defaultReferences, vocAlias + "." + vocTermWithQualifier));

              if (annotation.annotations && Array.isArray(annotation.annotations)) {
                var subAnnotationList = {
                  target: annotationTarget,
                  annotations: annotation.annotations,
                  __source: annotationSource
                };
                unresolvedAnnotations.push(subAnnotationList);
              } else if (annotation.annotations && !currentTarget.annotations[vocAlias][vocTermWithQualifier].annotations) {
                currentTarget.annotations[vocAlias][vocTermWithQualifier].annotations = annotation.annotations;
              }

              currentTarget.annotations._annotations["".concat(vocAlias, ".").concat(vocTermWithQualifier)] = currentTarget.annotations[vocAlias][vocTermWithQualifier];
              objectMap[annotationTarget] = currentTarget.annotations[vocAlias][vocTermWithQualifier];
            });
          });
        }
      });
    });
    var extraUnresolvedAnnotations = [];
    unresolvedAnnotations.forEach(function (annotationList) {
      var currentTargetName = unalias(parserOutput.references, annotationList.target);

      var _currentTargetName$sp = currentTargetName.split("@"),
          _currentTargetName$sp2 = _slicedToArray(_currentTargetName$sp, 2),
          baseObj = _currentTargetName$sp2[0],
          annotationPart = _currentTargetName$sp2[1];

      var targetSplit = annotationPart.split("/");
      baseObj = baseObj + "@" + targetSplit[0];
      var currentTarget = targetSplit.slice(1).reduce(function (currentObj, path) {
        if (!currentObj) {
          return null;
        }

        return currentObj[path];
      }, objectMap[baseObj]);

      if (!currentTarget) {
        ANNOTATION_ERRORS.push({
          message: "The following annotation target was not found on the service " + currentTargetName
        }); // console.log("Missing target again " + currentTargetName);
      } else if (typeof currentTarget === "object") {
        if (!currentTarget.annotations) {
          currentTarget.annotations = {};
        }

        annotationList.annotations.forEach(function (annotation) {
          var _splitTerm3 = splitTerm(defaultReferences, annotation.term),
              _splitTerm4 = _slicedToArray(_splitTerm3, 2),
              vocAlias = _splitTerm4[0],
              vocTerm = _splitTerm4[1];

          if (!currentTarget.annotations[vocAlias]) {
            currentTarget.annotations[vocAlias] = {};
          }

          if (!currentTarget.annotations._annotations) {
            currentTarget.annotations._annotations = {};
          }

          var vocTermWithQualifier = "".concat(vocTerm).concat(annotation.qualifier ? "#".concat(annotation.qualifier) : "");
          currentTarget.annotations[vocAlias][vocTermWithQualifier] = convertAnnotation(annotation, parserOutput, currentTarget, objectMap, toResolve, annotationList.__source, extraUnresolvedAnnotations);

          if (currentTarget.annotations[vocAlias][vocTermWithQualifier] !== null && typeof currentTarget.annotations[vocAlias][vocTermWithQualifier] === "object") {
            currentTarget.annotations[vocAlias][vocTermWithQualifier].term = unalias(defaultReferences, "".concat(vocAlias, ".").concat(vocTerm));
            currentTarget.annotations[vocAlias][vocTermWithQualifier].qualifier = annotation.qualifier;
            currentTarget.annotations[vocAlias][vocTermWithQualifier].__source = annotationList.__source;
          }

          currentTarget.annotations._annotations["".concat(vocAlias, ".").concat(vocTermWithQualifier)] = currentTarget.annotations[vocAlias][vocTermWithQualifier];
          objectMap["".concat(currentTargetName, "@").concat(unalias(defaultReferences, vocAlias + "." + vocTermWithQualifier))] = currentTarget.annotations[vocAlias][vocTermWithQualifier];
        });
      }
    });
    toResolve.forEach(function (resolveable) {
      var toResolve = resolveable.toResolve;
      var targetStr = toResolve.$target;
      var resolvedTarget = objectMap[targetStr];
      var annotationsTerm = toResolve.annotationsTerm,
          annotationType = toResolve.annotationType;
      delete toResolve.annotationType;
      delete toResolve.annotationsTerm;

      if (resolveable.inline && !(resolvedTarget instanceof String)) {
        // inline the resolved target
        var keys;

        for (keys in toResolve) {
          delete toResolve[keys];
        }

        Object.assign(toResolve, resolvedTarget);
      } else {
        // assign the resolved target
        toResolve.$target = resolvedTarget;
      }

      if (!resolvedTarget) {
        toResolve.targetString = targetStr;

        if (annotationsTerm && annotationType) {
          var oErrorMsg = {
            message: "Unable to resolve the path expression: " + targetStr + "\n" + "\n" + "Hint: Check and correct the path values under the following structure in the metadata (annotation.xml file or CDS annotations for the application): \n\n" + "<Annotation Term = " + annotationsTerm + ">" + "\n" + "<Record Type = " + annotationType + ">" + "\n" + "<AnnotationPath = " + targetStr + ">"
          };
          addAnnotationErrorMessage(targetStr, oErrorMsg);
        } else {
          var _property = toResolve.term;
          var path = toResolve.path;
          var termInfo = targetStr ? targetStr.split("/")[0] : targetStr;
          var _oErrorMsg = {
            message: "Unable to resolve the path expression: " + targetStr + "\n" + "\n" + "Hint: Check and correct the path values under the following structure in the metadata (annotation.xml file or CDS annotations for the application): \n\n" + "<Annotation Term = " + termInfo + ">" + "\n" + "<PropertyValue Property = " + _property + "        Path= " + path + ">"
          };
          addAnnotationErrorMessage(targetStr, _oErrorMsg);
        }
      }
    });

    for (var property in ALL_ANNOTATION_ERRORS) {
      ANNOTATION_ERRORS.push(ALL_ANNOTATION_ERRORS[property][0]);
    }

    parserOutput.entitySets = parserOutput.schema.entitySets;
    var convertedOutput = {
      version: parserOutput.version,
      annotations: parserOutput.schema.annotations,
      namespace: parserOutput.schema.namespace,
      entityContainer: parserOutput.schema.entityContainer,
      actions: parserOutput.schema.actions,
      entitySets: parserOutput.schema.entitySets,
      singletons: parserOutput.schema.singletons,
      entityTypes: parserOutput.schema.entityTypes,
      complexTypes: parserOutput.schema.complexTypes,
      references: defaultReferences,
      diagnostics: ANNOTATION_ERRORS.concat()
    };
    convertedOutput.resolvePath = createGlobalResolve(convertedOutput, objectMap);
    return convertedOutput;
  }

  _exports.convertTypes = convertTypes;

  function revertValueToGenericType(references, value) {
    var result;

    if (typeof value === "string") {
      var valueMatches = value.match(/(\w+)\.\w+\/.*/);

      if (valueMatches && references.find(function (ref) {
        return ref.alias === valueMatches[1];
      })) {
        result = {
          type: "EnumMember",
          EnumMember: value
        };
      } else {
        result = {
          type: "String",
          String: value
        };
      }
    } else if (Array.isArray(value)) {
      result = {
        type: "Collection",
        Collection: value.map(function (anno) {
          return revertCollectionItemToGenericType(references, anno);
        })
      };
    } else if (typeof value === "boolean") {
      result = {
        type: "Bool",
        Bool: value
      };
    } else if (typeof value === "number") {
      if (value.toString() === value.toFixed()) {
        result = {
          type: "Int",
          Int: value
        };
      } else {
        result = {
          type: "Decimal",
          Decimal: value
        };
      }
    } else if (typeof value === "object" && value.isDecimal && value.isDecimal()) {
      result = {
        type: "Decimal",
        Decimal: value.valueOf()
      };
    } else if (value.type === "Path") {
      result = {
        type: "Path",
        Path: value.path
      };
    } else if (value.type === "AnnotationPath") {
      result = {
        type: "AnnotationPath",
        AnnotationPath: value.value
      };
    } else if (value.type === "PropertyPath") {
      result = {
        type: "PropertyPath",
        PropertyPath: value.value
      };
    } else if (value.type === "NavigationPropertyPath") {
      result = {
        type: "NavigationPropertyPath",
        NavigationPropertyPath: value.value
      };
    } else if (Object.prototype.hasOwnProperty.call(value, "$Type")) {
      result = {
        type: "Record",
        Record: revertCollectionItemToGenericType(references, value)
      };
    }

    return result;
  }

  function revertCollectionItemToGenericType(references, collectionItem) {
    if (typeof collectionItem === "string") {
      return collectionItem;
    } else if (typeof collectionItem === "object") {
      if (collectionItem.hasOwnProperty("$Type")) {
        // Annotation Record
        var outItem = {
          type: collectionItem.$Type,
          propertyValues: []
        }; // Could validate keys and type based on $Type

        Object.keys(collectionItem).forEach(function (collectionKey) {
          if (collectionKey !== "$Type" && collectionKey !== "term" && collectionKey !== "__source" && collectionKey !== "qualifier" && collectionKey !== "ActionTarget" && collectionKey !== "fullyQualifiedName" && collectionKey !== "annotations") {
            var value = collectionItem[collectionKey];
            outItem.propertyValues.push({
              name: collectionKey,
              value: revertValueToGenericType(references, value)
            });
          } else if (collectionKey === "annotations") {
            var annotations = collectionItem[collectionKey];
            outItem.annotations = [];
            Object.keys(annotations).filter(function (key) {
              return key !== "_annotations";
            }).forEach(function (key) {
              Object.keys(annotations[key]).forEach(function (term) {
                var _outItem$annotations;

                var parsedAnnotation = revertTermToGenericType(references, annotations[key][term]);

                if (!parsedAnnotation.term) {
                  var unaliasedTerm = unalias(references, "".concat(key, ".").concat(term));

                  if (unaliasedTerm) {
                    var qualifiedSplit = unaliasedTerm.split("#");
                    parsedAnnotation.term = qualifiedSplit[0];

                    if (qualifiedSplit.length > 1) {
                      parsedAnnotation.qualifier = qualifiedSplit[1];
                    }
                  }
                }

                (_outItem$annotations = outItem.annotations) === null || _outItem$annotations === void 0 ? void 0 : _outItem$annotations.push(parsedAnnotation);
              });
            });
          }
        });
        return outItem;
      } else if (collectionItem.type === "PropertyPath") {
        return {
          type: "PropertyPath",
          PropertyPath: collectionItem.value
        };
      } else if (collectionItem.type === "AnnotationPath") {
        return {
          type: "AnnotationPath",
          AnnotationPath: collectionItem.value
        };
      } else if (collectionItem.type === "NavigationPropertyPath") {
        return {
          type: "NavigationPropertyPath",
          NavigationPropertyPath: collectionItem.value
        };
      }
    }
  }

  function revertTermToGenericType(references, annotation) {
    var baseAnnotation = {
      term: annotation.term,
      qualifier: annotation.qualifier
    };

    if (Array.isArray(annotation)) {
      // Collection
      if (annotation.hasOwnProperty("annotations")) {
        baseAnnotation.annotations = [];
        var currentAnnotations = annotation.annotations;
        Object.keys(currentAnnotations).filter(function (key) {
          return key !== "_annotations";
        }).forEach(function (key) {
          Object.keys(currentAnnotations[key]).forEach(function (term) {
            var _baseAnnotation$annot;

            var parsedAnnotation = revertTermToGenericType(references, currentAnnotations[key][term]);

            if (!parsedAnnotation.term) {
              var unaliasedTerm = unalias(references, "".concat(key, ".").concat(term));

              if (unaliasedTerm) {
                var qualifiedSplit = unaliasedTerm.split("#");
                parsedAnnotation.term = qualifiedSplit[0];

                if (qualifiedSplit.length > 1) {
                  parsedAnnotation.qualifier = qualifiedSplit[1];
                }
              }
            }

            (_baseAnnotation$annot = baseAnnotation.annotations) === null || _baseAnnotation$annot === void 0 ? void 0 : _baseAnnotation$annot.push(parsedAnnotation);
          });
        });
      }

      return _objectSpread(_objectSpread({}, baseAnnotation), {}, {
        collection: annotation.map(function (anno) {
          return revertCollectionItemToGenericType(references, anno);
        })
      });
    } else if (annotation.hasOwnProperty("$Type")) {
      return _objectSpread(_objectSpread({}, baseAnnotation), {}, {
        record: revertCollectionItemToGenericType(references, annotation)
      });
    } else {
      return _objectSpread(_objectSpread({}, baseAnnotation), {}, {
        value: revertValueToGenericType(references, annotation)
      });
    }
  }

  _exports.revertTermToGenericType = revertTermToGenericType;
  return _exports;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9zYXAvZmUvY29yZS9jb252ZXJ0ZXJzL2NvbW1vbi9Bbm5vdGF0aW9uQ29udmVydGVyLnRzIl0sIm5hbWVzIjpbIlBhdGgiLCJwYXRoRXhwcmVzc2lvbiIsInRhcmdldE5hbWUiLCJhbm5vdGF0aW9uc1Rlcm0iLCJhbm5vdGF0aW9uVHlwZSIsInRlcm0iLCJwYXRoIiwidHlwZSIsIiR0YXJnZXQiLCJUZXJtVG9UeXBlcyIsImRlZmF1bHRSZWZlcmVuY2VzIiwiYWxpYXMiLCJuYW1lc3BhY2UiLCJ1cmkiLCJyZWZlcmVuY2VzIiwidW5hbGlhc2VkVmFsdWUiLCJyZXZlcnNlUmVmZXJlbmNlTWFwIiwicmVkdWNlIiwibWFwIiwicmVmZXJlbmNlIiwibGFzdERvdEluZGV4IiwibGFzdEluZGV4T2YiLCJzdWJzdHIiLCJ2YWx1ZSIsImluZGV4T2YiLCJzcGxpdCIsInByZUFsaWFzIiwicG9zdEFsaWFzIiwiam9pbiIsInVuYWxpYXMiLCJhbGlhc2VkVmFsdWUiLCJyZWZlcmVuY2VNYXAiLCJidWlsZE9iamVjdE1hcCIsInBhcnNlck91dHB1dCIsIm9iamVjdE1hcCIsInNjaGVtYSIsImVudGl0eUNvbnRhaW5lciIsImZ1bGx5UXVhbGlmaWVkTmFtZSIsImVudGl0eVNldHMiLCJmb3JFYWNoIiwiZW50aXR5U2V0IiwiYWN0aW9ucyIsImFjdGlvbiIsImlzQm91bmQiLCJ1bkJvdW5kQWN0aW9uTmFtZSIsIl90eXBlIiwicHVzaCIsInBhcmFtZXRlcnMiLCJwYXJhbWV0ZXIiLCJjb21wbGV4VHlwZXMiLCJjb21wbGV4VHlwZSIsInByb3BlcnRpZXMiLCJwcm9wZXJ0eSIsImVudGl0eVR5cGVzIiwiZW50aXR5VHlwZSIsImVudGl0eVByb3BlcnRpZXMiLCJjb21wbGV4VHlwZURlZmluaXRpb24iLCJjb21wbGV4VHlwZVByb3AiLCJjb21wbGV4VHlwZVByb3BUYXJnZXQiLCJPYmplY3QiLCJhc3NpZ24iLCJuYW1lIiwibmF2aWdhdGlvblByb3BlcnRpZXMiLCJuYXZQcm9wZXJ0eSIsImtleXMiLCJhbm5vdGF0aW9ucyIsImFubm90YXRpb25Tb3VyY2UiLCJhbm5vdGF0aW9uTGlzdCIsImN1cnJlbnRUYXJnZXROYW1lIiwidGFyZ2V0IiwiYW5ub3RhdGlvbiIsImFubm90YXRpb25GUU4iLCJxdWFsaWZpZXIiLCJjb21iaW5lUGF0aCIsImN1cnJlbnRUYXJnZXQiLCJzdGFydHNXaXRoIiwiYWRkQW5ub3RhdGlvbkVycm9yTWVzc2FnZSIsIm9FcnJvck1zZyIsIkFMTF9BTk5PVEFUSU9OX0VSUk9SUyIsInJlc29sdmVUYXJnZXQiLCJwYXRoT25seSIsImluY2x1ZGVWaXNpdGVkT2JqZWN0cyIsInVuZGVmaW5lZCIsImFWaXNpdGVkT2JqZWN0cyIsInBhdGhTcGxpdCIsInRhcmdldFBhdGhTcGxpdCIsInBhdGhQYXJ0IiwiYW5ub3RhdGlvblBhdGgiLCJjdXJyZW50UGF0aCIsImN1cnJlbnRDb250ZXh0IiwiY3VycmVudFZhbHVlIiwibGVuZ3RoIiwidGFyZ2V0VHlwZSIsImVudGl0eVR5cGVOYW1lIiwidGFyZ2V0VHlwZU5hbWUiLCJzb3VyY2VUeXBlIiwiaXNFbnRpdHlTZXQiLCJsYXN0SWR4Iiwic3ViVGFyZ2V0IiwidmlzaXRlZE9iamVjdHMiLCJ2aXNpdGVkU3ViT2JqZWN0IiwiY29uY2F0IiwicmV2ZXJzZSIsImZpbmQiLCJvYmoiLCJpbnRlcm1lZGlhdGVUYXJnZXQiLCJoYXNPd25Qcm9wZXJ0eSIsIm1lc3NhZ2UiLCJpc0Fubm90YXRpb25QYXRoIiwicGF0aFN0ciIsInBhcnNlVmFsdWUiLCJwcm9wZXJ0eVZhbHVlIiwidmFsdWVGUU4iLCJ0b1Jlc29sdmUiLCJ1bnJlc29sdmVkQW5ub3RhdGlvbnMiLCJTdHJpbmciLCJJbnQiLCJCb29sIiwiRGVjaW1hbCIsIkRhdGUiLCJFbnVtTWVtYmVyIiwiUHJvcGVydHlQYXRoIiwiTmF2aWdhdGlvblByb3BlcnR5UGF0aCIsImFubm90YXRpb25UYXJnZXQiLCJBbm5vdGF0aW9uUGF0aCIsImlubGluZSIsInBhcnNlUmVjb3JkIiwiUmVjb3JkIiwicGFyc2VDb2xsZWN0aW9uIiwiQ29sbGVjdGlvbiIsImluZmVyVHlwZUZyb21UZXJtIiwiaXNFcnJvciIsInJlY29yZERlZmluaXRpb24iLCJjdXJyZW50RlFOIiwiYW5ub3RhdGlvblRlcm0iLCIkVHlwZSIsImFubm90YXRpb25Db250ZW50IiwiQXJyYXkiLCJpc0FycmF5Iiwic3ViQW5ub3RhdGlvbkxpc3QiLCJfX3NvdXJjZSIsInByb3BlcnR5VmFsdWVzIiwiQWN0aW9uVGFyZ2V0IiwiQWN0aW9uIiwiQU5OT1RBVElPTl9FUlJPUlMiLCJnZXRPckluZmVyQ29sbGVjdGlvblR5cGUiLCJjb2xsZWN0aW9uRGVmaW5pdGlvbiIsImZpcnN0Q29sSXRlbSIsInBhcmVudEZRTiIsImNvbGxlY3Rpb25EZWZpbml0aW9uVHlwZSIsInByb3BlcnR5UGF0aCIsInByb3BlcnR5SWR4IiwicGF0aFZhbHVlIiwiYW5ub3RhdGlvbklkeCIsImFubm90YXRpb25Db2xsZWN0aW9uRWxlbWVudCIsIm5hdlByb3BlcnR5UGF0aCIsIm5hdlByb3BJZHgiLCJyZWNvcmRJZHgiLCJpZlZhbHVlIiwic3RyaW5nVmFsdWUiLCJFcnJvciIsImNvbnZlcnRBbm5vdGF0aW9uIiwicmVjb3JkIiwiY29sbGVjdGlvbiIsImNyZWF0ZVJlc29sdmVQYXRoRm4iLCJyZWxhdGl2ZVBhdGgiLCJyZXNvbHZlTmF2aWdhdGlvblByb3BlcnRpZXMiLCJhc3NvY2lhdGlvbnMiLCJuYXZQcm9wIiwib3V0TmF2UHJvcCIsInBhcnRuZXIiLCJpc0NvbGxlY3Rpb24iLCJjb250YWluc1RhcmdldCIsInJlZmVyZW50aWFsQ29uc3RyYWludCIsInJlbGF0aW9uc2hpcCIsInRhcmdldEFzc29jaWF0aW9uIiwiYXNzb2NpYXRpb24iLCJhc3NvY2lhdGlvbkVuZCIsImVuZCIsInJvbGUiLCJ0b1JvbGUiLCJtdWx0aXBsaWNpdHkiLCJvdXROYXZQcm9wUmVxIiwicmVzb2x2ZVBhdGgiLCJsaW5rQWN0aW9uc1RvRW50aXR5VHlwZSIsInNvdXJjZUVudGl0eVR5cGUiLCJyZXR1cm5FbnRpdHlUeXBlIiwicmV0dXJuVHlwZSIsImxpbmtFbnRpdHlUeXBlVG9FbnRpdHlTZXQiLCJrZXlQcm9wIiwiaXNLZXkiLCJsaW5rRW50aXR5VHlwZVRvU2luZ2xldG9uIiwic2luZ2xldG9ucyIsInNpbmdsZXRvbiIsInR5cGVOYW1lIiwibGlua1Byb3BlcnRpZXNUb0NvbXBsZXhUeXBlcyIsImVudGl0eVByb3BlcnR5IiwiY29tcGxleFR5cGVOYW1lIiwicHJlcGFyZUNvbXBsZXhUeXBlcyIsInNwbGl0VGVybSIsInRlcm1WYWx1ZSIsImFsaWFzZWRUZXJtIiwibGFzdERvdCIsInRlcm1BbGlhcyIsImNyZWF0ZUdsb2JhbFJlc29sdmUiLCJjb252ZXJ0ZWRPdXRwdXQiLCJzUGF0aCIsImFQYXRoU3BsaXQiLCJzaGlmdCIsImVudGl0eVNldE5hbWUiLCJldCIsIm9iamVjdFBhdGgiLCJ0YXJnZXRSZXNvbHV0aW9uIiwiY29udmVydFR5cGVzIiwib2JqZWN0TWFwRWxlbWVudCIsImFsbFRhcmdldHMiLCJiT3ZlcnJpZGVFeGlzdGluZyIsInZvY0FsaWFzIiwidm9jVGVybSIsIl9hbm5vdGF0aW9ucyIsInZvY1Rlcm1XaXRoUXVhbGlmaWVyIiwiQm9vbGVhbiIsImV4dHJhVW5yZXNvbHZlZEFubm90YXRpb25zIiwiYmFzZU9iaiIsImFubm90YXRpb25QYXJ0IiwidGFyZ2V0U3BsaXQiLCJzbGljZSIsImN1cnJlbnRPYmoiLCJyZXNvbHZlYWJsZSIsInRhcmdldFN0ciIsInJlc29sdmVkVGFyZ2V0IiwidGFyZ2V0U3RyaW5nIiwidGVybUluZm8iLCJ2ZXJzaW9uIiwiZGlhZ25vc3RpY3MiLCJyZXZlcnRWYWx1ZVRvR2VuZXJpY1R5cGUiLCJyZXN1bHQiLCJ2YWx1ZU1hdGNoZXMiLCJtYXRjaCIsInJlZiIsImFubm8iLCJyZXZlcnRDb2xsZWN0aW9uSXRlbVRvR2VuZXJpY1R5cGUiLCJ0b1N0cmluZyIsInRvRml4ZWQiLCJpc0RlY2ltYWwiLCJ2YWx1ZU9mIiwicHJvdG90eXBlIiwiY2FsbCIsImNvbGxlY3Rpb25JdGVtIiwib3V0SXRlbSIsImNvbGxlY3Rpb25LZXkiLCJmaWx0ZXIiLCJrZXkiLCJwYXJzZWRBbm5vdGF0aW9uIiwicmV2ZXJ0VGVybVRvR2VuZXJpY1R5cGUiLCJ1bmFsaWFzZWRUZXJtIiwicXVhbGlmaWVkU3BsaXQiLCJiYXNlQW5ub3RhdGlvbiIsImN1cnJlbnRBbm5vdGF0aW9ucyJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01Bc0NNQSxJLEdBUUwsY0FDQ0MsY0FERCxFQUVDQyxVQUZELEVBR0NDLGVBSEQsRUFJQ0MsY0FKRCxFQUtDQyxJQUxELEVBTUU7QUFBQTs7QUFDRCxTQUFLQyxJQUFMLEdBQVlMLGNBQWMsQ0FBQ0QsSUFBM0I7QUFDQSxTQUFLTyxJQUFMLEdBQVksTUFBWjtBQUNBLFNBQUtDLE9BQUwsR0FBZU4sVUFBZjtBQUNDLFNBQUtHLElBQUwsR0FBWUEsSUFBYixFQUFxQixLQUFLRCxjQUFMLEdBQXNCQSxjQUEzQyxFQUE2RCxLQUFLRCxlQUFMLEdBQXVCQSxlQUFwRjtBQUNBLEc7O01BR0dNLFc7O2FBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFBQSxJQUFBQSxXO0FBQUFBLElBQUFBLFc7QUFBQUEsSUFBQUEsVztBQUFB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LGNBQXVCdlAsSUFBdkIsRUFBN0I7O0FBQ0Esa0JBQUkwUCxhQUFKLEVBQW1CO0FBQ2xCLG9CQUFNQyxjQUFjLEdBQUdELGFBQWEsQ0FBQ3RPLEtBQWQsQ0FBb0IsR0FBcEIsQ0FBdkI7QUFDQW9PLGdCQUFBQSxnQkFBZ0IsQ0FBQ3hQLElBQWpCLEdBQXdCMlAsY0FBYyxDQUFDLENBQUQsQ0FBdEM7O0FBQ0Esb0JBQUlBLGNBQWMsQ0FBQ3JLLE1BQWYsR0FBd0IsQ0FBNUIsRUFBK0I7QUFDOUJrSyxrQkFBQUEsZ0JBQWdCLENBQUNyTCxTQUFqQixHQUE2QndMLGNBQWMsQ0FBQyxDQUFELENBQTNDO0FBQ0E7QUFDRDtBQUNEOztBQUNELHFDQUFBQyxjQUFjLENBQUNoTSxXQUFmLGdGQUE0Qm5CLElBQTVCLENBQWlDK00sZ0JBQWpDO0FBQ0EsV0FiRDtBQWNBLFNBakJGO0FBa0JBOztBQUNELDZDQUNJSSxjQURKO0FBRUM5RixRQUFBQSxVQUFVLEVBQUU3RixVQUFVLENBQUNwRCxHQUFYLENBQWUsVUFBQThOLElBQUk7QUFBQSxpQkFBSUMsaUNBQWlDLENBQUNuTyxVQUFELEVBQWFrTyxJQUFiLENBQXJDO0FBQUEsU0FBbkI7QUFGYjtBQUlBLEtBNUJELE1BNEJPLElBQUkxSyxVQUFVLENBQUNvQyxjQUFYLENBQTBCLE9BQTFCLENBQUosRUFBd0M7QUFDOUMsNkNBQVl1SixjQUFaO0FBQTRCL0YsUUFBQUEsTUFBTSxFQUFFK0UsaUNBQWlDLENBQUNuTyxVQUFELEVBQWF3RCxVQUFiO0FBQXJFO0FBQ0EsS0FGTSxNQUVBO0FBQ04sNkNBQVkyTCxjQUFaO0FBQTRCMU8sUUFBQUEsS0FBSyxFQUFFb04sd0JBQXdCLENBQUM3TixVQUFELEVBQWF3RCxVQUFiO0FBQTNEO0FBQ0E7QUFDRCIsInNvdXJjZVJvb3QiOiIuIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0QW5ub3RhdGlvbiBhcyBFZG1Bbm5vdGF0aW9uLFxuXHRBbm5vdGF0aW9uTGlzdCxcblx0QW5ub3RhdGlvblJlY29yZCxcblx0QW5ub3RhdGlvblRlcm0sXG5cdENvbnZlcnRlck91dHB1dCxcblx0RXhwcmVzc2lvbixcblx0UGFyc2VyT3V0cHV0LFxuXHRQYXRoRXhwcmVzc2lvbixcblx0UHJvcGVydHlQYXRoLFxuXHRQcm9wZXJ0eVZhbHVlLFxuXHRBbm5vdGF0aW9uUGF0aEV4cHJlc3Npb24sXG5cdE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhFeHByZXNzaW9uLFxuXHRQcm9wZXJ0eVBhdGhFeHByZXNzaW9uXG59IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IHtcblx0QXNzb2NpYXRpb24sXG5cdEdlbmVyaWNOYXZpZ2F0aW9uUHJvcGVydHksXG5cdFJlZmVyZW5jZSxcblx0UHJvcGVydHkgYXMgUGFyc2VyUHJvcGVydHksXG5cdEVudGl0eVR5cGUgYXMgUGFyc2VyRW50aXR5VHlwZSxcblx0Q29tcGxleFR5cGUgYXMgUGFyc2VyQ29tcGxleFR5cGUsXG5cdFYyTmF2aWdhdGlvblByb3BlcnR5LFxuXHRWNE5hdmlnYXRpb25Qcm9wZXJ0eVxufSBmcm9tIFwiQHNhcC11eC92b2NhYnVsYXJpZXMtdHlwZXMvZGlzdC9QYXJzZXJcIjtcbmltcG9ydCB7XG5cdEFubm90YXRpb24sXG5cdEVudGl0eVR5cGUsXG5cdENvbXBsZXhUeXBlLFxuXHRBY3Rpb24sXG5cdEVudGl0eVNldCxcblx0U2luZ2xldG9uLFxuXHRQcm9wZXJ0eSxcblx0TmF2aWdhdGlvblByb3BlcnR5LFxuXHRFbnRpdHlDb250YWluZXIsXG5cdFNlcnZpY2VPYmplY3RBbmRBbm5vdGF0aW9uLFxuXHRSZXNvbHV0aW9uVGFyZ2V0XG59IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlcy9kaXN0L0NvbnZlcnRlclwiO1xuaW1wb3J0IHsgcGFyc2UgfSBmcm9tIFwidHMtbm9kZVwiO1xuXG5jbGFzcyBQYXRoIHtcblx0cGF0aDogc3RyaW5nO1xuXHQkdGFyZ2V0OiBzdHJpbmc7XG5cdHR5cGU6IHN0cmluZztcblx0YW5ub3RhdGlvbnNUZXJtOiBzdHJpbmc7XG5cdGFubm90YXRpb25UeXBlOiBzdHJpbmc7XG5cdHRlcm06IHN0cmluZztcblxuXHRjb25zdHJ1Y3Rvcihcblx0XHRwYXRoRXhwcmVzc2lvbjogUGF0aEV4cHJlc3Npb24sXG5cdFx0dGFyZ2V0TmFtZTogc3RyaW5nLFxuXHRcdGFubm90YXRpb25zVGVybTogc3RyaW5nLFxuXHRcdGFubm90YXRpb25UeXBlOiBzdHJpbmcsXG5cdFx0dGVybTogc3RyaW5nXG5cdCkge1xuXHRcdHRoaXMucGF0aCA9IHBhdGhFeHByZXNzaW9uLlBhdGg7XG5cdFx0dGhpcy50eXBlID0gXCJQYXRoXCI7XG5cdFx0dGhpcy4kdGFyZ2V0ID0gdGFyZ2V0TmFtZTtcblx0XHQodGhpcy50ZXJtID0gdGVybSksICh0aGlzLmFubm90YXRpb25UeXBlID0gYW5ub3RhdGlvblR5cGUpLCAodGhpcy5hbm5vdGF0aW9uc1Rlcm0gPSBhbm5vdGF0aW9uc1Rlcm0pO1xuXHR9XG59XG5cbmVudW0gVGVybVRvVHlwZXMge1xuXHRcIk9yZy5PRGF0YS5BdXRob3JpemF0aW9uLlYxLlNlY3VyaXR5U2NoZW1lc1wiID0gXCJPcmcuT0RhdGEuQXV0aG9yaXphdGlvbi5WMS5TZWN1cml0eVNjaGVtZVwiLFxuXHRcIk9yZy5PRGF0YS5BdXRob3JpemF0aW9uLlYxLkF1dGhvcml6YXRpb25zXCIgPSBcIk9yZy5PRGF0YS5BdXRob3JpemF0aW9uLlYxLkF1dGhvcml6YXRpb25cIixcblx0XCJPcmcuT0RhdGEuQ29yZS5WMS5SZXZpc2lvbnNcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuUmV2aXNpb25UeXBlXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuTGlua3NcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuTGlua1wiLFxuXHRcIk9yZy5PRGF0YS5Db3JlLlYxLkV4YW1wbGVcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuRXhhbXBsZVZhbHVlXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuTWVzc2FnZXNcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuTWVzc2FnZVR5cGVcIixcblx0XCJPcmcuT0RhdGEuQ29yZS5WMS5WYWx1ZUV4Y2VwdGlvblwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5WYWx1ZUV4Y2VwdGlvblR5cGVcIixcblx0XCJPcmcuT0RhdGEuQ29yZS5WMS5SZXNvdXJjZUV4Y2VwdGlvblwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5SZXNvdXJjZUV4Y2VwdGlvblR5cGVcIixcblx0XCJPcmcuT0RhdGEuQ29yZS5WMS5EYXRhTW9kaWZpY2F0aW9uRXhjZXB0aW9uXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLkRhdGFNb2RpZmljYXRpb25FeGNlcHRpb25UeXBlXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuSXNMYW5ndWFnZURlcGVuZGVudFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJPcmcuT0RhdGEuQ29yZS5WMS5EZXJlZmVyZW5jZWFibGVJRHNcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuQ29udmVudGlvbmFsSURzXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcIk9yZy5PRGF0YS5Db3JlLlYxLlBlcm1pc3Npb25zXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlBlcm1pc3Npb25cIixcblx0XCJPcmcuT0RhdGEuQ29yZS5WMS5EZWZhdWx0TmFtZXNwYWNlXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcIk9yZy5PRGF0YS5Db3JlLlYxLkltbXV0YWJsZVwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJPcmcuT0RhdGEuQ29yZS5WMS5Db21wdXRlZFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJPcmcuT0RhdGEuQ29yZS5WMS5Db21wdXRlZERlZmF1bHRWYWx1ZVwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJPcmcuT0RhdGEuQ29yZS5WMS5Jc1VSTFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJPcmcuT0RhdGEuQ29yZS5WMS5Jc01lZGlhVHlwZVwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJPcmcuT0RhdGEuQ29yZS5WMS5Db250ZW50RGlzcG9zaXRpb25cIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuQ29udGVudERpc3Bvc2l0aW9uVHlwZVwiLFxuXHRcIk9yZy5PRGF0YS5Db3JlLlYxLk9wdGltaXN0aWNDb25jdXJyZW5jeVwiID0gXCJFZG0uUHJvcGVydHlQYXRoXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuQWRkaXRpb25hbFByb3BlcnRpZXNcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuQXV0b0V4cGFuZFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJPcmcuT0RhdGEuQ29yZS5WMS5BdXRvRXhwYW5kUmVmZXJlbmNlc1wiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJPcmcuT0RhdGEuQ29yZS5WMS5NYXlJbXBsZW1lbnRcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuUXVhbGlmaWVkVHlwZU5hbWVcIixcblx0XCJPcmcuT0RhdGEuQ29yZS5WMS5PcmRlcmVkXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcIk9yZy5PRGF0YS5Db3JlLlYxLlBvc2l0aW9uYWxJbnNlcnRcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLkNvcmUuVjEuQWx0ZXJuYXRlS2V5c1wiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5BbHRlcm5hdGVLZXlcIixcblx0XCJPcmcuT0RhdGEuQ29yZS5WMS5PcHRpb25hbFBhcmFtZXRlclwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5PcHRpb25hbFBhcmFtZXRlclR5cGVcIixcblx0XCJPcmcuT0RhdGEuQ29yZS5WMS5PcGVyYXRpb25BdmFpbGFibGVcIiA9IFwiRWRtLkJvb2xlYW5cIixcblx0XCJPcmcuT0RhdGEuQ29yZS5WMS5TeW1ib2xpY05hbWVcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuU2ltcGxlSWRlbnRpZmllclwiLFxuXHRcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuQ29uZm9ybWFuY2VMZXZlbFwiID0gXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkNvbmZvcm1hbmNlTGV2ZWxUeXBlXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5Bc3luY2hyb25vdXNSZXF1ZXN0c1N1cHBvcnRlZFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkJhdGNoQ29udGludWVPbkVycm9yU3VwcG9ydGVkXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuSXNvbGF0aW9uU3VwcG9ydGVkXCIgPSBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuSXNvbGF0aW9uTGV2ZWxcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkNyb3NzSm9pblN1cHBvcnRlZFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkNhbGxiYWNrU3VwcG9ydGVkXCIgPSBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuQ2FsbGJhY2tUeXBlXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5DaGFuZ2VUcmFja2luZ1wiID0gXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkNoYW5nZVRyYWNraW5nVHlwZVwiLFxuXHRcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuQ291bnRSZXN0cmljdGlvbnNcIiA9IFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5Db3VudFJlc3RyaWN0aW9uc1R5cGVcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLk5hdmlnYXRpb25SZXN0cmljdGlvbnNcIiA9IFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5OYXZpZ2F0aW9uUmVzdHJpY3Rpb25zVHlwZVwiLFxuXHRcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuSW5kZXhhYmxlQnlLZXlcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5Ub3BTdXBwb3J0ZWRcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5Ta2lwU3VwcG9ydGVkXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuQ29tcHV0ZVN1cHBvcnRlZFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLlNlbGVjdFN1cHBvcnRcIiA9IFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5TZWxlY3RTdXBwb3J0VHlwZVwiLFxuXHRcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuQmF0Y2hTdXBwb3J0ZWRcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5CYXRjaFN1cHBvcnRcIiA9IFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5CYXRjaFN1cHBvcnRUeXBlXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5GaWx0ZXJSZXN0cmljdGlvbnNcIiA9IFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5GaWx0ZXJSZXN0cmljdGlvbnNUeXBlXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5Tb3J0UmVzdHJpY3Rpb25zXCIgPSBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuU29ydFJlc3RyaWN0aW9uc1R5cGVcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkV4cGFuZFJlc3RyaWN0aW9uc1wiID0gXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkV4cGFuZFJlc3RyaWN0aW9uc1R5cGVcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLlNlYXJjaFJlc3RyaWN0aW9uc1wiID0gXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLlNlYXJjaFJlc3RyaWN0aW9uc1R5cGVcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLktleUFzU2VnbWVudFN1cHBvcnRlZFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLlF1ZXJ5U2VnbWVudFN1cHBvcnRlZFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkluc2VydFJlc3RyaWN0aW9uc1wiID0gXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkluc2VydFJlc3RyaWN0aW9uc1R5cGVcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkRlZXBJbnNlcnRTdXBwb3J0XCIgPSBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuRGVlcEluc2VydFN1cHBvcnRUeXBlXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5VcGRhdGVSZXN0cmljdGlvbnNcIiA9IFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5VcGRhdGVSZXN0cmljdGlvbnNUeXBlXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5EZWVwVXBkYXRlU3VwcG9ydFwiID0gXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkRlZXBVcGRhdGVTdXBwb3J0VHlwZVwiLFxuXHRcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuRGVsZXRlUmVzdHJpY3Rpb25zXCIgPSBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuRGVsZXRlUmVzdHJpY3Rpb25zVHlwZVwiLFxuXHRcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuQ29sbGVjdGlvblByb3BlcnR5UmVzdHJpY3Rpb25zXCIgPSBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuQ29sbGVjdGlvblByb3BlcnR5UmVzdHJpY3Rpb25zVHlwZVwiLFxuXHRcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuT3BlcmF0aW9uUmVzdHJpY3Rpb25zXCIgPSBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuT3BlcmF0aW9uUmVzdHJpY3Rpb25zVHlwZVwiLFxuXHRcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuQW5ub3RhdGlvblZhbHVlc0luUXVlcnlTdXBwb3J0ZWRcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5Nb2RpZmljYXRpb25RdWVyeU9wdGlvbnNcIiA9IFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5Nb2RpZmljYXRpb25RdWVyeU9wdGlvbnNUeXBlXCIsXG5cdFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5SZWFkUmVzdHJpY3Rpb25zXCIgPSBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuUmVhZFJlc3RyaWN0aW9uc1R5cGVcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkN1c3RvbUhlYWRlcnNcIiA9IFwiT3JnLk9EYXRhLkNhcGFiaWxpdGllcy5WMS5DdXN0b21QYXJhbWV0ZXJcIixcblx0XCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkN1c3RvbVF1ZXJ5T3B0aW9uc1wiID0gXCJPcmcuT0RhdGEuQ2FwYWJpbGl0aWVzLlYxLkN1c3RvbVBhcmFtZXRlclwiLFxuXHRcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjEuTWVkaWFMb2NhdGlvblVwZGF0ZVN1cHBvcnRlZFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJPcmcuT0RhdGEuQWdncmVnYXRpb24uVjEuQXBwbHlTdXBwb3J0ZWRcIiA9IFwiT3JnLk9EYXRhLkFnZ3JlZ2F0aW9uLlYxLkFwcGx5U3VwcG9ydGVkVHlwZVwiLFxuXHRcIk9yZy5PRGF0YS5BZ2dyZWdhdGlvbi5WMS5Hcm91cGFibGVcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLkFnZ3JlZ2F0aW9uLlYxLkFnZ3JlZ2F0YWJsZVwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJPcmcuT0RhdGEuQWdncmVnYXRpb24uVjEuQ29udGV4dERlZmluaW5nUHJvcGVydGllc1wiID0gXCJFZG0uUHJvcGVydHlQYXRoXCIsXG5cdFwiT3JnLk9EYXRhLkFnZ3JlZ2F0aW9uLlYxLkxldmVsZWRIaWVyYXJjaHlcIiA9IFwiRWRtLlByb3BlcnR5UGF0aFwiLFxuXHRcIk9yZy5PRGF0YS5BZ2dyZWdhdGlvbi5WMS5SZWN1cnNpdmVIaWVyYXJjaHlcIiA9IFwiT3JnLk9EYXRhLkFnZ3JlZ2F0aW9uLlYxLlJlY3Vyc2l2ZUhpZXJhcmNoeVR5cGVcIixcblx0XCJPcmcuT0RhdGEuQWdncmVnYXRpb24uVjEuQXZhaWxhYmxlT25BZ2dyZWdhdGVzXCIgPSBcIk9yZy5PRGF0YS5BZ2dyZWdhdGlvbi5WMS5BdmFpbGFibGVPbkFnZ3JlZ2F0ZXNUeXBlXCIsXG5cdFwiT3JnLk9EYXRhLlZhbGlkYXRpb24uVjEuTWluaW11bVwiID0gXCJFZG0uUHJpbWl0aXZlVHlwZVwiLFxuXHRcIk9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLk1heGltdW1cIiA9IFwiRWRtLlByaW1pdGl2ZVR5cGVcIixcblx0XCJPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5FeGNsdXNpdmVcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiT3JnLk9EYXRhLlZhbGlkYXRpb24uVjEuQWxsb3dlZFZhbHVlc1wiID0gXCJPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5BbGxvd2VkVmFsdWVcIixcblx0XCJPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5NdWx0aXBsZU9mXCIgPSBcIkVkbS5EZWNpbWFsXCIsXG5cdFwiT3JnLk9EYXRhLlZhbGlkYXRpb24uVjEuQ29uc3RyYWludFwiID0gXCJPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5Db25zdHJhaW50VHlwZVwiLFxuXHRcIk9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLkl0ZW1zT2ZcIiA9IFwiT3JnLk9EYXRhLlZhbGlkYXRpb24uVjEuSXRlbXNPZlR5cGVcIixcblx0XCJPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMS5PcGVuUHJvcGVydHlUeXBlQ29uc3RyYWludFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5RdWFsaWZpZWRUeXBlTmFtZVwiLFxuXHRcIk9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLkRlcml2ZWRUeXBlQ29uc3RyYWludFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5RdWFsaWZpZWRUeXBlTmFtZVwiLFxuXHRcIk9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLkFsbG93ZWRUZXJtc1wiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5RdWFsaWZpZWRUZXJtTmFtZVwiLFxuXHRcIk9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLkFwcGxpY2FibGVUZXJtc1wiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5RdWFsaWZpZWRUZXJtTmFtZVwiLFxuXHRcIk9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLk1heEl0ZW1zXCIgPSBcIkVkbS5JbnQ2NFwiLFxuXHRcIk9yZy5PRGF0YS5WYWxpZGF0aW9uLlYxLk1pbkl0ZW1zXCIgPSBcIkVkbS5JbnQ2NFwiLFxuXHRcIk9yZy5PRGF0YS5NZWFzdXJlcy5WMS5TY2FsZVwiID0gXCJFZG0uQnl0ZVwiLFxuXHRcIk9yZy5PRGF0YS5NZWFzdXJlcy5WMS5EdXJhdGlvbkdyYW51bGFyaXR5XCIgPSBcIk9yZy5PRGF0YS5NZWFzdXJlcy5WMS5EdXJhdGlvbkdyYW51bGFyaXR5VHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkFuYWx5dGljcy52MS5EaW1lbnNpb25cIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQW5hbHl0aWNzLnYxLk1lYXN1cmVcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQW5hbHl0aWNzLnYxLkFjY3VtdWxhdGl2ZU1lYXN1cmVcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQW5hbHl0aWNzLnYxLlJvbGxlZFVwUHJvcGVydHlDb3VudFwiID0gXCJFZG0uSW50MTZcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5BbmFseXRpY3MudjEuUGxhbm5pbmdBY3Rpb25cIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQW5hbHl0aWNzLnYxLkFnZ3JlZ2F0ZWRQcm9wZXJ0aWVzXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkFuYWx5dGljcy52MS5BZ2dyZWdhdGVkUHJvcGVydHlUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlNlcnZpY2VWZXJzaW9uXCIgPSBcIkVkbS5JbnQzMlwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5TZXJ2aWNlU2NoZW1hVmVyc2lvblwiID0gXCJFZG0uSW50MzJcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVGV4dEZvclwiID0gXCJFZG0uUHJvcGVydHlQYXRoXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzTGFuZ3VhZ2VJZGVudGlmaWVyXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5UZXh0Rm9ybWF0XCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5UZXh0Rm9ybWF0VHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0RpZ2l0U2VxdWVuY2VcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzVXBwZXJDYXNlXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0N1cnJlbmN5XCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc1VuaXRcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlVuaXRTcGVjaWZpY1NjYWxlXCIgPSBcIkVkbS5QcmltaXRpdmVUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlVuaXRTcGVjaWZpY1ByZWNpc2lvblwiID0gXCJFZG0uUHJpbWl0aXZlVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5TZWNvbmRhcnlLZXlcIiA9IFwiRWRtLlByb3BlcnR5UGF0aFwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5NaW5PY2N1cnNcIiA9IFwiRWRtLkludDY0XCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLk1heE9jY3Vyc1wiID0gXCJFZG0uSW50NjRcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuQXNzb2NpYXRpb25FbnRpdHlcIiA9IFwiRWRtLk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRGVyaXZlZE5hdmlnYXRpb25cIiA9IFwiRWRtLk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuTWFza2VkXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5NYXNrZWRBbHdheXNcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlNlbWFudGljT2JqZWN0TWFwcGluZ1wiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuU2VtYW50aWNPYmplY3RNYXBwaW5nVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0luc3RhbmNlQW5ub3RhdGlvblwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9uc1wiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRmlsdGVyRXhwcmVzc2lvblJlc3RyaWN0aW9uVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5GaWVsZENvbnRyb2xcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkZpZWxkQ29udHJvbFR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuQXBwbGljYXRpb25cIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkFwcGxpY2F0aW9uVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5UaW1lc3RhbXBcIiA9IFwiRWRtLkRhdGVUaW1lT2Zmc2V0XCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkVycm9yUmVzb2x1dGlvblwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRXJyb3JSZXNvbHV0aW9uVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5NZXNzYWdlc1wiID0gXCJFZG0uQ29tcGxleFR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEubnVtZXJpY1NldmVyaXR5XCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5OdW1lcmljTWVzc2FnZVNldmVyaXR5VHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5NYXhpbXVtTnVtZXJpY01lc3NhZ2VTZXZlcml0eVwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuTnVtZXJpY01lc3NhZ2VTZXZlcml0eVR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNBY3Rpb25Dcml0aWNhbFwiID0gXCJFZG0uQm9vbGVhblwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5BdHRyaWJ1dGVzXCIgPSBcIkVkbS5Qcm9wZXJ0eVBhdGhcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuUmVsYXRlZFJlY3Vyc2l2ZUhpZXJhcmNoeVwiID0gXCJFZG0uQW5ub3RhdGlvblBhdGhcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSW50ZXJ2YWxcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkludGVydmFsVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5SZXN1bHRDb250ZXh0XCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5XZWFrUmVmZXJlbnRpYWxDb25zdHJhaW50XCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5XZWFrUmVmZXJlbnRpYWxDb25zdHJhaW50VHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc05hdHVyYWxQZXJzb25cIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlZhbHVlTGlzdFwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVmFsdWVMaXN0VHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5WYWx1ZUxpc3RSZWxldmFudFF1YWxpZmllcnNcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlNpbXBsZUlkZW50aWZpZXJcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVmFsdWVMaXN0V2l0aEZpeGVkVmFsdWVzXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5WYWx1ZUxpc3RNYXBwaW5nXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5WYWx1ZUxpc3RNYXBwaW5nVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0NhbGVuZGFyWWVhclwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNDYWxlbmRhckhhbGZ5ZWFyXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0NhbGVuZGFyUXVhcnRlclwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNDYWxlbmRhck1vbnRoXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0NhbGVuZGFyV2Vla1wiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNEYXlPZkNhbGVuZGFyTW9udGhcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzRGF5T2ZDYWxlbmRhclllYXJcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzQ2FsZW5kYXJZZWFySGFsZnllYXJcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzQ2FsZW5kYXJZZWFyUXVhcnRlclwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNDYWxlbmRhclllYXJNb250aFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNDYWxlbmRhclllYXJXZWVrXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0NhbGVuZGFyRGF0ZVwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNGaXNjYWxZZWFyXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0Zpc2NhbFBlcmlvZFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNGaXNjYWxZZWFyUGVyaW9kXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Jc0Zpc2NhbFF1YXJ0ZXJcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzRmlzY2FsWWVhclF1YXJ0ZXJcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzRmlzY2FsV2Vla1wiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNGaXNjYWxZZWFyV2Vla1wiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuSXNEYXlPZkZpc2NhbFllYXJcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLklzRmlzY2FsWWVhclZhcmlhbnRcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLk11dHVhbGx5RXhjbHVzaXZlVGVybVwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRHJhZnRSb290XCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5EcmFmdFJvb3RUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkRyYWZ0Tm9kZVwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRHJhZnROb2RlVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5EcmFmdEFjdGl2YXRpb25WaWFcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlNpbXBsZUlkZW50aWZpZXJcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRWRpdGFibGVGaWVsZEZvclwiID0gXCJFZG0uUHJvcGVydHlQYXRoXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlNlbWFudGljS2V5XCIgPSBcIkVkbS5Qcm9wZXJ0eVBhdGhcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuU2lkZUVmZmVjdHNcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlNpZGVFZmZlY3RzVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5EZWZhdWx0VmFsdWVzRnVuY3Rpb25cIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlF1YWxpZmllZE5hbWVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRmlsdGVyRGVmYXVsdFZhbHVlXCIgPSBcIkVkbS5QcmltaXRpdmVUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkZpbHRlckRlZmF1bHRWYWx1ZUhpZ2hcIiA9IFwiRWRtLlByaW1pdGl2ZVR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuU29ydE9yZGVyXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Tb3J0T3JkZXJUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlJlY3Vyc2l2ZUhpZXJhcmNoeVwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuUmVjdXJzaXZlSGllcmFyY2h5VHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5DcmVhdGVkQXRcIiA9IFwiRWRtLkRhdGVUaW1lT2Zmc2V0XCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkNyZWF0ZWRCeVwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuVXNlcklEXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkNoYW5nZWRBdFwiID0gXCJFZG0uRGF0ZVRpbWVPZmZzZXRcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuQ2hhbmdlZEJ5XCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5Vc2VySURcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuQXBwbHlNdWx0aVVuaXRCZWhhdmlvckZvclNvcnRpbmdBbmRGaWx0ZXJpbmdcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29kZUxpc3QudjEuQ3VycmVuY3lDb2Rlc1wiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db2RlTGlzdC52MS5Db2RlTGlzdFNvdXJjZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvZGVMaXN0LnYxLlVuaXRzT2ZNZWFzdXJlXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvZGVMaXN0LnYxLkNvZGVMaXN0U291cmNlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29kZUxpc3QudjEuU3RhbmRhcmRDb2RlXCIgPSBcIkVkbS5Qcm9wZXJ0eVBhdGhcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db2RlTGlzdC52MS5FeHRlcm5hbENvZGVcIiA9IFwiRWRtLlByb3BlcnR5UGF0aFwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvZGVMaXN0LnYxLklzQ29uZmlndXJhdGlvbkRlcHJlY2F0aW9uQ29kZVwiID0gXCJFZG0uQm9vbGVhblwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW11bmljYXRpb24udjEuQ29udGFjdFwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tdW5pY2F0aW9uLnYxLkNvbnRhY3RUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbXVuaWNhdGlvbi52MS5BZGRyZXNzXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW11bmljYXRpb24udjEuQWRkcmVzc1R5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tdW5pY2F0aW9uLnYxLklzRW1haWxBZGRyZXNzXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW11bmljYXRpb24udjEuSXNQaG9uZU51bWJlclwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tdW5pY2F0aW9uLnYxLkV2ZW50XCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW11bmljYXRpb24udjEuRXZlbnREYXRhXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbXVuaWNhdGlvbi52MS5UYXNrXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW11bmljYXRpb24udjEuVGFza0RhdGFcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tdW5pY2F0aW9uLnYxLk1lc3NhZ2VcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbXVuaWNhdGlvbi52MS5NZXNzYWdlRGF0YVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkhpZXJhcmNoeS52MS5SZWN1cnNpdmVIaWVyYXJjaHlcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuSGllcmFyY2h5LnYxLlJlY3Vyc2l2ZUhpZXJhcmNoeVR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5QZXJzb25hbERhdGEudjEuRW50aXR5U2VtYW50aWNzXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlBlcnNvbmFsRGF0YS52MS5FbnRpdHlTZW1hbnRpY3NUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuUGVyc29uYWxEYXRhLnYxLkZpZWxkU2VtYW50aWNzXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlBlcnNvbmFsRGF0YS52MS5GaWVsZFNlbWFudGljc1R5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5QZXJzb25hbERhdGEudjEuSXNQb3RlbnRpYWxseVBlcnNvbmFsXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlBlcnNvbmFsRGF0YS52MS5Jc1BvdGVudGlhbGx5U2Vuc2l0aXZlXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlNlc3Npb24udjEuU3RpY2t5U2Vzc2lvblN1cHBvcnRlZFwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5TZXNzaW9uLnYxLlN0aWNreVNlc3Npb25TdXBwb3J0ZWRUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuSGVhZGVySW5mb1wiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5IZWFkZXJJbmZvVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLklkZW50aWZpY2F0aW9uXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEFic3RyYWN0XCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQmFkZ2VcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQmFkZ2VUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuTGluZUl0ZW1cIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkQWJzdHJhY3RcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5TdGF0dXNJbmZvXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEFic3RyYWN0XCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRmllbGRHcm91cFwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5GaWVsZEdyb3VwVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNvbm5lY3RlZEZpZWxkc1wiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5Db25uZWN0ZWRGaWVsZHNUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuR2VvTG9jYXRpb25zXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkdlb0xvY2F0aW9uVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkdlb0xvY2F0aW9uXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkdlb0xvY2F0aW9uVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNvbnRhY3RzXCIgPSBcIkVkbS5Bbm5vdGF0aW9uUGF0aFwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLk1lZGlhUmVzb3VyY2VcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuTWVkaWFSZXNvdXJjZVR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhUG9pbnRcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YVBvaW50VHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLktQSVwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5LUElUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ2hhcnRcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ2hhcnREZWZpbml0aW9uVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlZhbHVlQ3JpdGljYWxpdHlcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuVmFsdWVDcml0aWNhbGl0eVR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5Dcml0aWNhbGl0eUxhYmVsc1wiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5Dcml0aWNhbGl0eUxhYmVsVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlNlbGVjdGlvbkZpZWxkc1wiID0gXCJFZG0uUHJvcGVydHlQYXRoXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRmFjZXRzXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkZhY2V0XCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuSGVhZGVyRmFjZXRzXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkZhY2V0XCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuUXVpY2tWaWV3RmFjZXRzXCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkZhY2V0XCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuUXVpY2tDcmVhdGVGYWNldHNcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRmFjZXRcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5GaWx0ZXJGYWNldHNcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuUmVmZXJlbmNlRmFjZXRcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5TZWxlY3Rpb25QcmVzZW50YXRpb25WYXJpYW50XCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlNlbGVjdGlvblByZXNlbnRhdGlvblZhcmlhbnRUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuUHJlc2VudGF0aW9uVmFyaWFudFwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5QcmVzZW50YXRpb25WYXJpYW50VHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlNlbGVjdGlvblZhcmlhbnRcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuU2VsZWN0aW9uVmFyaWFudFR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5UaGluZ1BlcnNwZWN0aXZlXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLklzU3VtbWFyeVwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5QYXJ0T2ZQcmV2aWV3XCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLk1hcFwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5HYWxsZXJ5XCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLklzSW1hZ2VVUkxcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuSXNJbWFnZVwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5NdWx0aUxpbmVUZXh0XCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlRleHRBcnJhbmdlbWVudFwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5UZXh0QXJyYW5nZW1lbnRUeXBlXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuSW1wb3J0YW5jZVwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5JbXBvcnRhbmNlVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkhpZGRlblwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5DcmVhdGVIaWRkZW5cIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuVXBkYXRlSGlkZGVuXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRlbGV0ZUhpZGRlblwiID0gXCJPcmcuT0RhdGEuQ29yZS5WMS5UYWdcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5IaWRkZW5GaWx0ZXJcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRGVmYXVsdFwiID0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRBYnN0cmFjdFwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNyaXRpY2FsaXR5XCIgPSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNyaXRpY2FsaXR5VHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkNyaXRpY2FsaXR5Q2FsY3VsYXRpb25cIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuQ3JpdGljYWxpdHlDYWxjdWxhdGlvblR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5FbXBoYXNpemVkXCIgPSBcIk9yZy5PRGF0YS5Db3JlLlYxLlRhZ1wiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLk9yZGVyQnlcIiA9IFwiRWRtLlByb3BlcnR5UGF0aFwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlBhcmFtZXRlckRlZmF1bHRWYWx1ZVwiID0gXCJFZG0uUHJpbWl0aXZlVHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLlJlY29tbWVuZGF0aW9uU3RhdGVcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuUmVjb21tZW5kYXRpb25TdGF0ZVR5cGVcIixcblx0XCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5SZWNvbW1lbmRhdGlvbkxpc3RcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuUmVjb21tZW5kYXRpb25MaXN0VHlwZVwiLFxuXHRcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkV4Y2x1ZGVGcm9tTmF2aWdhdGlvbkNvbnRleHRcIiA9IFwiT3JnLk9EYXRhLkNvcmUuVjEuVGFnXCIsXG5cdFwiY29tLnNhcC52b2NhYnVsYXJpZXMuSFRNTDUudjEuQ3NzRGVmYXVsdHNcIiA9IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuSFRNTDUudjEuQ3NzRGVmYXVsdHNUeXBlXCJcbn1cblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRSZWZlcmVuY2VzOiBSZWZlcmVuY2VzV2l0aE1hcCA9IFtcblx0eyBhbGlhczogXCJDYXBhYmlsaXRpZXNcIiwgbmFtZXNwYWNlOiBcIk9yZy5PRGF0YS5DYXBhYmlsaXRpZXMuVjFcIiwgdXJpOiBcIlwiIH0sXG5cdHsgYWxpYXM6IFwiQWdncmVnYXRpb25cIiwgbmFtZXNwYWNlOiBcIk9yZy5PRGF0YS5BZ2dyZWdhdGlvbi5WMVwiLCB1cmk6IFwiXCIgfSxcblx0eyBhbGlhczogXCJWYWxpZGF0aW9uXCIsIG5hbWVzcGFjZTogXCJPcmcuT0RhdGEuVmFsaWRhdGlvbi5WMVwiLCB1cmk6IFwiXCIgfSxcblx0eyBuYW1lc3BhY2U6IFwiT3JnLk9EYXRhLkNvcmUuVjFcIiwgYWxpYXM6IFwiQ29yZVwiLCB1cmk6IFwiXCIgfSxcblx0eyBuYW1lc3BhY2U6IFwiT3JnLk9EYXRhLk1lYXN1cmVzLlYxXCIsIGFsaWFzOiBcIk1lYXN1cmVzXCIsIHVyaTogXCJcIiB9LFxuXHR7IG5hbWVzcGFjZTogXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjFcIiwgYWxpYXM6IFwiQ29tbW9uXCIsIHVyaTogXCJcIiB9LFxuXHR7IG5hbWVzcGFjZTogXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MVwiLCBhbGlhczogXCJVSVwiLCB1cmk6IFwiXCIgfSxcblx0eyBuYW1lc3BhY2U6IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuU2Vzc2lvbi52MVwiLCBhbGlhczogXCJTZXNzaW9uXCIsIHVyaTogXCJcIiB9LFxuXHR7IG5hbWVzcGFjZTogXCJjb20uc2FwLnZvY2FidWxhcmllcy5BbmFseXRpY3MudjFcIiwgYWxpYXM6IFwiQW5hbHl0aWNzXCIsIHVyaTogXCJcIiB9LFxuXHR7IG5hbWVzcGFjZTogXCJjb20uc2FwLnZvY2FidWxhcmllcy5Db2RlTGlzdC52MVwiLCBhbGlhczogXCJDb2RlTGlzdFwiLCB1cmk6IFwiXCIgfSxcblx0eyBuYW1lc3BhY2U6IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuUGVyc29uYWxEYXRhLnYxXCIsIGFsaWFzOiBcIlBlcnNvbmFsRGF0YVwiLCB1cmk6IFwiXCIgfSxcblx0eyBuYW1lc3BhY2U6IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbXVuaWNhdGlvbi52MVwiLCBhbGlhczogXCJDb21tdW5pY2F0aW9uXCIsIHVyaTogXCJcIiB9LFxuXHR7IG5hbWVzcGFjZTogXCJjb20uc2FwLnZvY2FidWxhcmllcy5IVE1MNS52MVwiLCBhbGlhczogXCJIVE1MNVwiLCB1cmk6IFwiXCIgfVxuXTtcblxudHlwZSBSZWZlcmVuY2VzV2l0aE1hcCA9IFJlZmVyZW5jZVtdICYge1xuXHRyZWZlcmVuY2VNYXA/OiBSZWNvcmQ8c3RyaW5nLCBSZWZlcmVuY2U+O1xuXHRyZXZlcnNlUmVmZXJlbmNlTWFwPzogUmVjb3JkPHN0cmluZywgUmVmZXJlbmNlPjtcbn07XG5cbmZ1bmN0aW9uIGFsaWFzKHJlZmVyZW5jZXM6IFJlZmVyZW5jZXNXaXRoTWFwLCB1bmFsaWFzZWRWYWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcblx0aWYgKCFyZWZlcmVuY2VzLnJldmVyc2VSZWZlcmVuY2VNYXApIHtcblx0XHRyZWZlcmVuY2VzLnJldmVyc2VSZWZlcmVuY2VNYXAgPSByZWZlcmVuY2VzLnJlZHVjZSgobWFwOiBSZWNvcmQ8c3RyaW5nLCBSZWZlcmVuY2U+LCByZWZlcmVuY2UpID0+IHtcblx0XHRcdG1hcFtyZWZlcmVuY2UubmFtZXNwYWNlXSA9IHJlZmVyZW5jZTtcblx0XHRcdHJldHVybiBtYXA7XG5cdFx0fSwge30pO1xuXHR9XG5cdGlmICghdW5hbGlhc2VkVmFsdWUpIHtcblx0XHRyZXR1cm4gdW5hbGlhc2VkVmFsdWU7XG5cdH1cblx0Y29uc3QgbGFzdERvdEluZGV4ID0gdW5hbGlhc2VkVmFsdWUubGFzdEluZGV4T2YoXCIuXCIpO1xuXHRjb25zdCBuYW1lc3BhY2UgPSB1bmFsaWFzZWRWYWx1ZS5zdWJzdHIoMCwgbGFzdERvdEluZGV4KTtcblx0Y29uc3QgdmFsdWUgPSB1bmFsaWFzZWRWYWx1ZS5zdWJzdHIobGFzdERvdEluZGV4ICsgMSk7XG5cdGNvbnN0IHJlZmVyZW5jZSA9IHJlZmVyZW5jZXMucmV2ZXJzZVJlZmVyZW5jZU1hcFtuYW1lc3BhY2VdO1xuXHRpZiAocmVmZXJlbmNlKSB7XG5cdFx0cmV0dXJuIGAke3JlZmVyZW5jZS5hbGlhc30uJHt2YWx1ZX1gO1xuXHR9IGVsc2Uge1xuXHRcdC8vIFRyeSB0byBzZWUgaWYgaXQncyBhbiBhbm5vdGF0aW9uIFBhdGggbGlrZSB0b19TYWxlc09yZGVyL0BVSS5MaW5lSXRlbVxuXHRcdGlmICh1bmFsaWFzZWRWYWx1ZS5pbmRleE9mKFwiQFwiKSAhPT0gLTEpIHtcblx0XHRcdGNvbnN0IFtwcmVBbGlhcywgLi4ucG9zdEFsaWFzXSA9IHVuYWxpYXNlZFZhbHVlLnNwbGl0KFwiQFwiKTtcblx0XHRcdHJldHVybiBgJHtwcmVBbGlhc31AJHthbGlhcyhyZWZlcmVuY2VzLCBwb3N0QWxpYXMuam9pbihcIkBcIikpfWA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB1bmFsaWFzZWRWYWx1ZTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gdW5hbGlhcyhyZWZlcmVuY2VzOiBSZWZlcmVuY2VzV2l0aE1hcCwgYWxpYXNlZFZhbHVlOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXHRpZiAoIXJlZmVyZW5jZXMucmVmZXJlbmNlTWFwKSB7XG5cdFx0cmVmZXJlbmNlcy5yZWZlcmVuY2VNYXAgPSByZWZlcmVuY2VzLnJlZHVjZSgobWFwOiBSZWNvcmQ8c3RyaW5nLCBSZWZlcmVuY2U+LCByZWZlcmVuY2UpID0+IHtcblx0XHRcdG1hcFtyZWZlcmVuY2UuYWxpYXNdID0gcmVmZXJlbmNlO1xuXHRcdFx0cmV0dXJuIG1hcDtcblx0XHR9LCB7fSk7XG5cdH1cblx0aWYgKCFhbGlhc2VkVmFsdWUpIHtcblx0XHRyZXR1cm4gYWxpYXNlZFZhbHVlO1xuXHR9XG5cdGNvbnN0IFthbGlhcywgLi4udmFsdWVdID0gYWxpYXNlZFZhbHVlLnNwbGl0KFwiLlwiKTtcblx0Y29uc3QgcmVmZXJlbmNlID0gcmVmZXJlbmNlcy5yZWZlcmVuY2VNYXBbYWxpYXNdO1xuXHRpZiAocmVmZXJlbmNlKSB7XG5cdFx0cmV0dXJuIGAke3JlZmVyZW5jZS5uYW1lc3BhY2V9LiR7dmFsdWUuam9pbihcIi5cIil9YDtcblx0fSBlbHNlIHtcblx0XHQvLyBUcnkgdG8gc2VlIGlmIGl0J3MgYW4gYW5ub3RhdGlvbiBQYXRoIGxpa2UgdG9fU2FsZXNPcmRlci9AVUkuTGluZUl0ZW1cblx0XHRpZiAoYWxpYXNlZFZhbHVlLmluZGV4T2YoXCJAXCIpICE9PSAtMSkge1xuXHRcdFx0Y29uc3QgW3ByZUFsaWFzLCAuLi5wb3N0QWxpYXNdID0gYWxpYXNlZFZhbHVlLnNwbGl0KFwiQFwiKTtcblx0XHRcdHJldHVybiBgJHtwcmVBbGlhc31AJHt1bmFsaWFzKHJlZmVyZW5jZXMsIHBvc3RBbGlhcy5qb2luKFwiQFwiKSl9YDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGFsaWFzZWRWYWx1ZTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYnVpbGRPYmplY3RNYXAocGFyc2VyT3V0cHV0OiBQYXJzZXJPdXRwdXQpOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcblx0Y29uc3Qgb2JqZWN0TWFwOiBhbnkgPSB7fTtcblx0aWYgKHBhcnNlck91dHB1dC5zY2hlbWEuZW50aXR5Q29udGFpbmVyICYmIHBhcnNlck91dHB1dC5zY2hlbWEuZW50aXR5Q29udGFpbmVyLmZ1bGx5UXVhbGlmaWVkTmFtZSkge1xuXHRcdG9iamVjdE1hcFtwYXJzZXJPdXRwdXQuc2NoZW1hLmVudGl0eUNvbnRhaW5lci5mdWxseVF1YWxpZmllZE5hbWVdID0gcGFyc2VyT3V0cHV0LnNjaGVtYS5lbnRpdHlDb250YWluZXI7XG5cdH1cblx0cGFyc2VyT3V0cHV0LnNjaGVtYS5lbnRpdHlTZXRzLmZvckVhY2goZW50aXR5U2V0ID0+IHtcblx0XHRvYmplY3RNYXBbZW50aXR5U2V0LmZ1bGx5UXVhbGlmaWVkTmFtZV0gPSBlbnRpdHlTZXQ7XG5cdH0pO1xuXHRwYXJzZXJPdXRwdXQuc2NoZW1hLmFjdGlvbnMuZm9yRWFjaChhY3Rpb24gPT4ge1xuXHRcdG9iamVjdE1hcFthY3Rpb24uZnVsbHlRdWFsaWZpZWROYW1lXSA9IGFjdGlvbjtcblx0XHRpZiAoYWN0aW9uLmlzQm91bmQpIHtcblx0XHRcdGNvbnN0IHVuQm91bmRBY3Rpb25OYW1lID0gYWN0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZS5zcGxpdChcIihcIilbMF07XG5cdFx0XHRpZiAoIW9iamVjdE1hcFt1bkJvdW5kQWN0aW9uTmFtZV0pIHtcblx0XHRcdFx0b2JqZWN0TWFwW3VuQm91bmRBY3Rpb25OYW1lXSA9IHtcblx0XHRcdFx0XHRfdHlwZTogXCJVbmJvdW5kR2VuZXJpY0FjdGlvblwiLFxuXHRcdFx0XHRcdGFjdGlvbnM6IFtdXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRvYmplY3RNYXBbdW5Cb3VuZEFjdGlvbk5hbWVdLmFjdGlvbnMucHVzaChhY3Rpb24pO1xuXHRcdH1cblxuXHRcdGFjdGlvbi5wYXJhbWV0ZXJzLmZvckVhY2gocGFyYW1ldGVyID0+IHtcblx0XHRcdG9iamVjdE1hcFtwYXJhbWV0ZXIuZnVsbHlRdWFsaWZpZWROYW1lXSA9IHBhcmFtZXRlcjtcblx0XHR9KTtcblx0fSk7XG5cdHBhcnNlck91dHB1dC5zY2hlbWEuY29tcGxleFR5cGVzLmZvckVhY2goY29tcGxleFR5cGUgPT4ge1xuXHRcdG9iamVjdE1hcFtjb21wbGV4VHlwZS5mdWxseVF1YWxpZmllZE5hbWVdID0gY29tcGxleFR5cGU7XG5cdFx0Y29tcGxleFR5cGUucHJvcGVydGllcy5mb3JFYWNoKHByb3BlcnR5ID0+IHtcblx0XHRcdG9iamVjdE1hcFtwcm9wZXJ0eS5mdWxseVF1YWxpZmllZE5hbWVdID0gcHJvcGVydHk7XG5cdFx0fSk7XG5cdH0pO1xuXHRwYXJzZXJPdXRwdXQuc2NoZW1hLmVudGl0eVR5cGVzLmZvckVhY2goZW50aXR5VHlwZSA9PiB7XG5cdFx0b2JqZWN0TWFwW2VudGl0eVR5cGUuZnVsbHlRdWFsaWZpZWROYW1lXSA9IGVudGl0eVR5cGU7XG5cdFx0ZW50aXR5VHlwZS5lbnRpdHlQcm9wZXJ0aWVzLmZvckVhY2gocHJvcGVydHkgPT4ge1xuXHRcdFx0b2JqZWN0TWFwW3Byb3BlcnR5LmZ1bGx5UXVhbGlmaWVkTmFtZV0gPSBwcm9wZXJ0eTtcblx0XHRcdGlmIChwcm9wZXJ0eS50eXBlLmluZGV4T2YoXCJFZG1cIikgPT09IC0xKSB7XG5cdFx0XHRcdC8vIEhhbmRsZSBjb21wbGV4IHR5cGVzXG5cdFx0XHRcdGNvbnN0IGNvbXBsZXhUeXBlRGVmaW5pdGlvbiA9IG9iamVjdE1hcFtwcm9wZXJ0eS50eXBlXSBhcyBDb21wbGV4VHlwZTtcblx0XHRcdFx0aWYgKGNvbXBsZXhUeXBlRGVmaW5pdGlvbiAmJiBjb21wbGV4VHlwZURlZmluaXRpb24ucHJvcGVydGllcykge1xuXHRcdFx0XHRcdGNvbXBsZXhUeXBlRGVmaW5pdGlvbi5wcm9wZXJ0aWVzLmZvckVhY2goY29tcGxleFR5cGVQcm9wID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IGNvbXBsZXhUeXBlUHJvcFRhcmdldDogUGFyc2VyUHJvcGVydHkgPSBPYmplY3QuYXNzaWduKGNvbXBsZXhUeXBlUHJvcCwge1xuXHRcdFx0XHRcdFx0XHRfdHlwZTogXCJQcm9wZXJ0eVwiLFxuXHRcdFx0XHRcdFx0XHRmdWxseVF1YWxpZmllZE5hbWU6IHByb3BlcnR5LmZ1bGx5UXVhbGlmaWVkTmFtZSArIFwiL1wiICsgY29tcGxleFR5cGVQcm9wLm5hbWVcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0b2JqZWN0TWFwW2NvbXBsZXhUeXBlUHJvcFRhcmdldC5mdWxseVF1YWxpZmllZE5hbWVdID0gY29tcGxleFR5cGVQcm9wVGFyZ2V0O1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0ZW50aXR5VHlwZS5uYXZpZ2F0aW9uUHJvcGVydGllcy5mb3JFYWNoKG5hdlByb3BlcnR5ID0+IHtcblx0XHRcdG9iamVjdE1hcFtuYXZQcm9wZXJ0eS5mdWxseVF1YWxpZmllZE5hbWVdID0gbmF2UHJvcGVydHk7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdE9iamVjdC5rZXlzKHBhcnNlck91dHB1dC5zY2hlbWEuYW5ub3RhdGlvbnMpLmZvckVhY2goYW5ub3RhdGlvblNvdXJjZSA9PiB7XG5cdFx0cGFyc2VyT3V0cHV0LnNjaGVtYS5hbm5vdGF0aW9uc1thbm5vdGF0aW9uU291cmNlXS5mb3JFYWNoKGFubm90YXRpb25MaXN0ID0+IHtcblx0XHRcdGNvbnN0IGN1cnJlbnRUYXJnZXROYW1lID0gdW5hbGlhcyhwYXJzZXJPdXRwdXQucmVmZXJlbmNlcywgYW5ub3RhdGlvbkxpc3QudGFyZ2V0KTtcblx0XHRcdGFubm90YXRpb25MaXN0LmFubm90YXRpb25zLmZvckVhY2goYW5ub3RhdGlvbiA9PiB7XG5cdFx0XHRcdGxldCBhbm5vdGF0aW9uRlFOID0gYCR7Y3VycmVudFRhcmdldE5hbWV9QCR7dW5hbGlhcyhwYXJzZXJPdXRwdXQucmVmZXJlbmNlcywgYW5ub3RhdGlvbi50ZXJtKX1gO1xuXHRcdFx0XHRpZiAoYW5ub3RhdGlvbi5xdWFsaWZpZXIpIHtcblx0XHRcdFx0XHRhbm5vdGF0aW9uRlFOICs9IGAjJHthbm5vdGF0aW9uLnF1YWxpZmllcn1gO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0eXBlb2YgYW5ub3RhdGlvbiAhPT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRcdGRlYnVnZ2VyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG9iamVjdE1hcFthbm5vdGF0aW9uRlFOXSA9IGFubm90YXRpb247XG5cdFx0XHRcdChhbm5vdGF0aW9uIGFzIEFubm90YXRpb24pLmZ1bGx5UXVhbGlmaWVkTmFtZSA9IGFubm90YXRpb25GUU47XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSk7XG5cdHJldHVybiBvYmplY3RNYXA7XG59XG5cbmZ1bmN0aW9uIGNvbWJpbmVQYXRoKGN1cnJlbnRUYXJnZXQ6IHN0cmluZywgcGF0aDogc3RyaW5nKTogc3RyaW5nIHtcblx0aWYgKHBhdGguc3RhcnRzV2l0aChcIkBcIikpIHtcblx0XHRyZXR1cm4gY3VycmVudFRhcmdldCArIHVuYWxpYXMoZGVmYXVsdFJlZmVyZW5jZXMsIHBhdGgpO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBjdXJyZW50VGFyZ2V0ICsgXCIvXCIgKyBwYXRoO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGFkZEFubm90YXRpb25FcnJvck1lc3NhZ2UocGF0aDogc3RyaW5nLCBvRXJyb3JNc2c6IGFueSkge1xuXHRpZiAoIUFMTF9BTk5PVEFUSU9OX0VSUk9SU1twYXRoXSkge1xuXHRcdEFMTF9BTk5PVEFUSU9OX0VSUk9SU1twYXRoXSA9IFtvRXJyb3JNc2ddO1xuXHR9IGVsc2Uge1xuXHRcdEFMTF9BTk5PVEFUSU9OX0VSUk9SU1twYXRoXS5wdXNoKG9FcnJvck1zZyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVRhcmdldChcblx0b2JqZWN0TWFwOiBhbnksXG5cdGN1cnJlbnRUYXJnZXQ6IGFueSxcblx0cGF0aDogc3RyaW5nLFxuXHRwYXRoT25seTogYm9vbGVhbiA9IGZhbHNlLFxuXHRpbmNsdWRlVmlzaXRlZE9iamVjdHM6IGJvb2xlYW4gPSBmYWxzZSxcblx0YW5ub3RhdGlvblR5cGU/OiBzdHJpbmcsXG5cdGFubm90YXRpb25zVGVybT86IHN0cmluZ1xuKSB7XG5cdGlmICghcGF0aCkge1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblx0Ly9jb25zdCBwcm9wZXJ0eVBhdGggPSBwYXRoO1xuXHRsZXQgYVZpc2l0ZWRPYmplY3RzOiBhbnlbXSA9IFtdO1xuXHRpZiAoY3VycmVudFRhcmdldCAmJiBjdXJyZW50VGFyZ2V0Ll90eXBlID09PSBcIlByb3BlcnR5XCIpIHtcblx0XHRjdXJyZW50VGFyZ2V0ID0gb2JqZWN0TWFwW2N1cnJlbnRUYXJnZXQuZnVsbHlRdWFsaWZpZWROYW1lLnNwbGl0KFwiL1wiKVswXV07XG5cdH1cblx0cGF0aCA9IGNvbWJpbmVQYXRoKGN1cnJlbnRUYXJnZXQuZnVsbHlRdWFsaWZpZWROYW1lLCBwYXRoKTtcblxuXHRjb25zdCBwYXRoU3BsaXQgPSBwYXRoLnNwbGl0KFwiL1wiKTtcblx0Y29uc3QgdGFyZ2V0UGF0aFNwbGl0OiBzdHJpbmdbXSA9IFtdO1xuXHRwYXRoU3BsaXQuZm9yRWFjaChwYXRoUGFydCA9PiB7XG5cdFx0Ly8gU2VwYXJhdGUgb3V0IHRoZSBhbm5vdGF0aW9uXG5cdFx0aWYgKHBhdGhQYXJ0LmluZGV4T2YoXCJAXCIpICE9PSAtMSkge1xuXHRcdFx0Y29uc3QgW3BhdGgsIGFubm90YXRpb25QYXRoXSA9IHBhdGhQYXJ0LnNwbGl0KFwiQFwiKTtcblx0XHRcdHRhcmdldFBhdGhTcGxpdC5wdXNoKHBhdGgpO1xuXHRcdFx0dGFyZ2V0UGF0aFNwbGl0LnB1c2goYEAke2Fubm90YXRpb25QYXRofWApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0YXJnZXRQYXRoU3BsaXQucHVzaChwYXRoUGFydCk7XG5cdFx0fVxuXHR9KTtcblx0bGV0IGN1cnJlbnRQYXRoID0gcGF0aDtcblx0bGV0IGN1cnJlbnRDb250ZXh0ID0gY3VycmVudFRhcmdldDtcblx0Y29uc3QgdGFyZ2V0ID0gdGFyZ2V0UGF0aFNwbGl0LnJlZHVjZSgoY3VycmVudFZhbHVlOiBhbnksIHBhdGhQYXJ0KSA9PiB7XG5cdFx0aWYgKHBhdGhQYXJ0ID09PSBcIiRUeXBlXCIgJiYgY3VycmVudFZhbHVlLl90eXBlID09PSBcIkVudGl0eVR5cGVcIikge1xuXHRcdFx0cmV0dXJuIGN1cnJlbnRWYWx1ZTtcblx0XHR9XG5cdFx0aWYgKHBhdGhQYXJ0Lmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0Ly8gRW1wdHkgUGF0aCBhZnRlciBhbiBlbnRpdHlTZXQgbWVhbnMgZW50aXR5VHlwZVxuXHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSAmJiBjdXJyZW50VmFsdWUuX3R5cGUgPT09IFwiRW50aXR5U2V0XCIgJiYgY3VycmVudFZhbHVlLmVudGl0eVR5cGUpIHtcblx0XHRcdFx0aWYgKGluY2x1ZGVWaXNpdGVkT2JqZWN0cykge1xuXHRcdFx0XHRcdGFWaXNpdGVkT2JqZWN0cy5wdXNoKGN1cnJlbnRWYWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y3VycmVudFZhbHVlID0gY3VycmVudFZhbHVlLmVudGl0eVR5cGU7XG5cdFx0XHR9XG5cdFx0XHRpZiAoY3VycmVudFZhbHVlICYmIGN1cnJlbnRWYWx1ZS5fdHlwZSA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIiAmJiBjdXJyZW50VmFsdWUudGFyZ2V0VHlwZSkge1xuXHRcdFx0XHRpZiAoaW5jbHVkZVZpc2l0ZWRPYmplY3RzKSB7XG5cdFx0XHRcdFx0YVZpc2l0ZWRPYmplY3RzLnB1c2goY3VycmVudFZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjdXJyZW50VmFsdWUgPSBjdXJyZW50VmFsdWUudGFyZ2V0VHlwZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBjdXJyZW50VmFsdWU7XG5cdFx0fVxuXHRcdGlmIChpbmNsdWRlVmlzaXRlZE9iamVjdHMgJiYgY3VycmVudFZhbHVlICE9PSBudWxsICYmIGN1cnJlbnRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRhVmlzaXRlZE9iamVjdHMucHVzaChjdXJyZW50VmFsdWUpO1xuXHRcdH1cblx0XHRpZiAoIWN1cnJlbnRWYWx1ZSkge1xuXHRcdFx0Y3VycmVudFBhdGggPSBwYXRoUGFydDtcblx0XHR9IGVsc2UgaWYgKGN1cnJlbnRWYWx1ZS5fdHlwZSA9PT0gXCJFbnRpdHlTZXRcIiAmJiBwYXRoUGFydCA9PT0gXCIkVHlwZVwiKSB7XG5cdFx0XHRjdXJyZW50VmFsdWUgPSBjdXJyZW50VmFsdWUudGFyZ2V0VHlwZTtcblx0XHRcdHJldHVybiBjdXJyZW50VmFsdWU7XG5cdFx0fSBlbHNlIGlmIChjdXJyZW50VmFsdWUuX3R5cGUgPT09IFwiRW50aXR5U2V0XCIgJiYgY3VycmVudFZhbHVlLmVudGl0eVR5cGUpIHtcblx0XHRcdGN1cnJlbnRQYXRoID0gY29tYmluZVBhdGgoY3VycmVudFZhbHVlLmVudGl0eVR5cGVOYW1lLCBwYXRoUGFydCk7XG5cdFx0fSBlbHNlIGlmIChjdXJyZW50VmFsdWUuX3R5cGUgPT09IFwiTmF2aWdhdGlvblByb3BlcnR5XCIgJiYgY3VycmVudFZhbHVlLnRhcmdldFR5cGVOYW1lKSB7XG5cdFx0XHRjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGN1cnJlbnRWYWx1ZS50YXJnZXRUeXBlTmFtZSwgcGF0aFBhcnQpO1xuXHRcdH0gZWxzZSBpZiAoY3VycmVudFZhbHVlLl90eXBlID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVwiICYmIGN1cnJlbnRWYWx1ZS50YXJnZXRUeXBlKSB7XG5cdFx0XHRjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGN1cnJlbnRWYWx1ZS50YXJnZXRUeXBlLmZ1bGx5UXVhbGlmaWVkTmFtZSwgcGF0aFBhcnQpO1xuXHRcdH0gZWxzZSBpZiAoY3VycmVudFZhbHVlLl90eXBlID09PSBcIlByb3BlcnR5XCIpIHtcblx0XHRcdC8vIENvbXBsZXhUeXBlIG9yIFByb3BlcnR5XG5cdFx0XHRpZiAoY3VycmVudFZhbHVlLnRhcmdldFR5cGUpIHtcblx0XHRcdFx0Y3VycmVudFBhdGggPSBjb21iaW5lUGF0aChjdXJyZW50VmFsdWUudGFyZ2V0VHlwZS5mdWxseVF1YWxpZmllZE5hbWUsIHBhdGhQYXJ0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGN1cnJlbnRQYXRoID0gY29tYmluZVBhdGgoY3VycmVudFZhbHVlLmZ1bGx5UXVhbGlmaWVkTmFtZSwgcGF0aFBhcnQpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoY3VycmVudFZhbHVlLl90eXBlID09PSBcIkFjdGlvblwiICYmIGN1cnJlbnRWYWx1ZS5pc0JvdW5kKSB7XG5cdFx0XHRjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGN1cnJlbnRWYWx1ZS5mdWxseVF1YWxpZmllZE5hbWUsIHBhdGhQYXJ0KTtcblx0XHRcdGlmICghb2JqZWN0TWFwW2N1cnJlbnRQYXRoXSkge1xuXHRcdFx0XHRjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGN1cnJlbnRWYWx1ZS5zb3VyY2VUeXBlLCBwYXRoUGFydCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChjdXJyZW50VmFsdWUuX3R5cGUgPT09IFwiQWN0aW9uUGFyYW1ldGVyXCIgJiYgY3VycmVudFZhbHVlLmlzRW50aXR5U2V0KSB7XG5cdFx0XHRjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGN1cnJlbnRWYWx1ZS50eXBlLCBwYXRoUGFydCk7XG5cdFx0fSBlbHNlIGlmIChjdXJyZW50VmFsdWUuX3R5cGUgPT09IFwiQWN0aW9uUGFyYW1ldGVyXCIgJiYgIWN1cnJlbnRWYWx1ZS5pc0VudGl0eVNldCkge1xuXHRcdFx0Y3VycmVudFBhdGggPSBjb21iaW5lUGF0aChcblx0XHRcdFx0Y3VycmVudFRhcmdldC5mdWxseVF1YWxpZmllZE5hbWUuc3Vic3RyKDAsIGN1cnJlbnRUYXJnZXQuZnVsbHlRdWFsaWZpZWROYW1lLmxhc3RJbmRleE9mKFwiL1wiKSksXG5cdFx0XHRcdHBhdGhQYXJ0XG5cdFx0XHQpO1xuXHRcdFx0aWYgKCFvYmplY3RNYXBbY3VycmVudFBhdGhdKSB7XG5cdFx0XHRcdGxldCBsYXN0SWR4ID0gY3VycmVudFRhcmdldC5mdWxseVF1YWxpZmllZE5hbWUubGFzdEluZGV4T2YoXCIvXCIpO1xuXHRcdFx0XHRpZiAobGFzdElkeCA9PT0gLTEpIHtcblx0XHRcdFx0XHRsYXN0SWR4ID0gY3VycmVudFRhcmdldC5mdWxseVF1YWxpZmllZE5hbWUubGVuZ3RoO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGN1cnJlbnRQYXRoID0gY29tYmluZVBhdGgoXG5cdFx0XHRcdFx0KG9iamVjdE1hcFtjdXJyZW50VGFyZ2V0LmZ1bGx5UXVhbGlmaWVkTmFtZS5zdWJzdHIoMCwgbGFzdElkeCldIGFzIEFjdGlvbikuc291cmNlVHlwZSxcblx0XHRcdFx0XHRwYXRoUGFydFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGN1cnJlbnRWYWx1ZS5mdWxseVF1YWxpZmllZE5hbWUsIHBhdGhQYXJ0KTtcblx0XHRcdGlmIChwYXRoUGFydCAhPT0gXCJuYW1lXCIgJiYgY3VycmVudFZhbHVlW3BhdGhQYXJ0XSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHJldHVybiBjdXJyZW50VmFsdWVbcGF0aFBhcnRdO1xuXHRcdFx0fSBlbHNlIGlmIChwYXRoUGFydCA9PT0gXCIkQW5ub3RhdGlvblBhdGhcIiAmJiBjdXJyZW50VmFsdWUuJHRhcmdldCkge1xuXHRcdFx0XHRjb25zdCBjdXJyZW50Q29udGV4dCA9IG9iamVjdE1hcFtjdXJyZW50VmFsdWUuZnVsbHlRdWFsaWZpZWROYW1lLnNwbGl0KFwiQFwiKVswXV07XG5cdFx0XHRcdGNvbnN0IHN1YlRhcmdldDogYW55ID0gcmVzb2x2ZVRhcmdldChvYmplY3RNYXAsIGN1cnJlbnRDb250ZXh0LCBjdXJyZW50VmFsdWUudmFsdWUsIGZhbHNlLCB0cnVlKTtcblx0XHRcdFx0c3ViVGFyZ2V0LnZpc2l0ZWRPYmplY3RzLmZvckVhY2goKHZpc2l0ZWRTdWJPYmplY3Q6IGFueSkgPT4ge1xuXHRcdFx0XHRcdGlmIChhVmlzaXRlZE9iamVjdHMuaW5kZXhPZih2aXNpdGVkU3ViT2JqZWN0KSA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdGFWaXNpdGVkT2JqZWN0cy5wdXNoKHZpc2l0ZWRTdWJPYmplY3QpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybiBzdWJUYXJnZXQudGFyZ2V0O1xuXHRcdFx0fSBlbHNlIGlmIChwYXRoUGFydCA9PT0gXCIkUGF0aFwiICYmIGN1cnJlbnRWYWx1ZS4kdGFyZ2V0KSB7XG5cdFx0XHRcdGN1cnJlbnRDb250ZXh0ID0gYVZpc2l0ZWRPYmplY3RzXG5cdFx0XHRcdFx0LmNvbmNhdCgpXG5cdFx0XHRcdFx0LnJldmVyc2UoKVxuXHRcdFx0XHRcdC5maW5kKFxuXHRcdFx0XHRcdFx0b2JqID0+XG5cdFx0XHRcdFx0XHRcdG9iai5fdHlwZSA9PT0gXCJFbnRpdHlUeXBlXCIgfHxcblx0XHRcdFx0XHRcdFx0b2JqLl90eXBlID09PSBcIkVudGl0eVNldFwiIHx8XG5cdFx0XHRcdFx0XHRcdG9iai5fdHlwZSA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlcIlxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdGlmIChjdXJyZW50Q29udGV4dCkge1xuXHRcdFx0XHRcdGNvbnN0IHN1YlRhcmdldDogYW55ID0gcmVzb2x2ZVRhcmdldChvYmplY3RNYXAsIGN1cnJlbnRDb250ZXh0LCBjdXJyZW50VmFsdWUucGF0aCwgZmFsc2UsIHRydWUpO1xuXHRcdFx0XHRcdHN1YlRhcmdldC52aXNpdGVkT2JqZWN0cy5mb3JFYWNoKCh2aXNpdGVkU3ViT2JqZWN0OiBhbnkpID0+IHtcblx0XHRcdFx0XHRcdGlmIChhVmlzaXRlZE9iamVjdHMuaW5kZXhPZih2aXNpdGVkU3ViT2JqZWN0KSA9PT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0YVZpc2l0ZWRPYmplY3RzLnB1c2godmlzaXRlZFN1Yk9iamVjdCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0cmV0dXJuIHN1YlRhcmdldC50YXJnZXQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGN1cnJlbnRWYWx1ZS4kdGFyZ2V0O1xuXHRcdFx0fSBlbHNlIGlmIChwYXRoUGFydC5zdGFydHNXaXRoKFwiJFBhdGhcIikgJiYgY3VycmVudFZhbHVlLiR0YXJnZXQpIHtcblx0XHRcdFx0Y29uc3QgaW50ZXJtZWRpYXRlVGFyZ2V0ID0gY3VycmVudFZhbHVlLiR0YXJnZXQ7XG5cdFx0XHRcdGN1cnJlbnRQYXRoID0gY29tYmluZVBhdGgoaW50ZXJtZWRpYXRlVGFyZ2V0LmZ1bGx5UXVhbGlmaWVkTmFtZSwgcGF0aFBhcnQuc3Vic3RyKDUpKTtcblx0XHRcdH0gZWxzZSBpZiAoY3VycmVudFZhbHVlLmhhc093blByb3BlcnR5KFwiJFR5cGVcIikgJiYgIW9iamVjdE1hcFtjdXJyZW50UGF0aF0pIHtcblx0XHRcdFx0Ly8gVGhpcyBpcyBub3cgYW4gYW5ub3RhdGlvbiB2YWx1ZVxuXHRcdFx0XHRjb25zdCBlbnRpdHlUeXBlID0gb2JqZWN0TWFwW2N1cnJlbnRWYWx1ZS5mdWxseVF1YWxpZmllZE5hbWUuc3BsaXQoXCJAXCIpWzBdXTtcblx0XHRcdFx0aWYgKGVudGl0eVR5cGUpIHtcblx0XHRcdFx0XHRjdXJyZW50UGF0aCA9IGNvbWJpbmVQYXRoKGVudGl0eVR5cGUuZnVsbHlRdWFsaWZpZWROYW1lLCBwYXRoUGFydCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG9iamVjdE1hcFtjdXJyZW50UGF0aF07XG5cdH0sIG51bGwpO1xuXHRpZiAoIXRhcmdldCkge1xuXHRcdGlmIChhbm5vdGF0aW9uc1Rlcm0gJiYgYW5ub3RhdGlvblR5cGUpIHtcblx0XHRcdHZhciBvRXJyb3JNc2cgPSB7XG5cdFx0XHRcdG1lc3NhZ2U6XG5cdFx0XHRcdFx0XCJVbmFibGUgdG8gcmVzb2x2ZSB0aGUgcGF0aCBleHByZXNzaW9uOiBcIiArXG5cdFx0XHRcdFx0XCJcXG5cIiArXG5cdFx0XHRcdFx0cGF0aCArXG5cdFx0XHRcdFx0XCJcXG5cIiArXG5cdFx0XHRcdFx0XCJcXG5cIiArXG5cdFx0XHRcdFx0XCJIaW50OiBDaGVjayBhbmQgY29ycmVjdCB0aGUgcGF0aCB2YWx1ZXMgdW5kZXIgdGhlIGZvbGxvd2luZyBzdHJ1Y3R1cmUgaW4gdGhlIG1ldGFkYXRhIChhbm5vdGF0aW9uLnhtbCBmaWxlIG9yIENEUyBhbm5vdGF0aW9ucyBmb3IgdGhlIGFwcGxpY2F0aW9uKTogXFxuXFxuXCIgK1xuXHRcdFx0XHRcdFwiPEFubm90YXRpb24gVGVybSA9IFwiICtcblx0XHRcdFx0XHRhbm5vdGF0aW9uc1Rlcm0gK1xuXHRcdFx0XHRcdFwiPlwiICtcblx0XHRcdFx0XHRcIlxcblwiICtcblx0XHRcdFx0XHRcIjxSZWNvcmQgVHlwZSA9IFwiICtcblx0XHRcdFx0XHRhbm5vdGF0aW9uVHlwZSArXG5cdFx0XHRcdFx0XCI+XCIgK1xuXHRcdFx0XHRcdFwiXFxuXCIgK1xuXHRcdFx0XHRcdFwiPEFubm90YXRpb25QYXRoID0gXCIgK1xuXHRcdFx0XHRcdHBhdGggK1xuXHRcdFx0XHRcdFwiPlwiXG5cdFx0XHR9O1xuXHRcdFx0YWRkQW5ub3RhdGlvbkVycm9yTWVzc2FnZShwYXRoLCBvRXJyb3JNc2cpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgb0Vycm9yTXNnID0ge1xuXHRcdFx0XHRtZXNzYWdlOlxuXHRcdFx0XHRcdFwiVW5hYmxlIHRvIHJlc29sdmUgdGhlIHBhdGggZXhwcmVzc2lvbjogXCIgK1xuXHRcdFx0XHRcdHBhdGggK1xuXHRcdFx0XHRcdFwiXFxuXCIgK1xuXHRcdFx0XHRcdFwiXFxuXCIgK1xuXHRcdFx0XHRcdFwiSGludDogQ2hlY2sgYW5kIGNvcnJlY3QgdGhlIHBhdGggdmFsdWVzIHVuZGVyIHRoZSBmb2xsb3dpbmcgc3RydWN0dXJlIGluIHRoZSBtZXRhZGF0YSAoYW5ub3RhdGlvbi54bWwgZmlsZSBvciBDRFMgYW5ub3RhdGlvbnMgZm9yIHRoZSBhcHBsaWNhdGlvbik6IFxcblxcblwiICtcblx0XHRcdFx0XHRcIjxBbm5vdGF0aW9uIFRlcm0gPSBcIiArXG5cdFx0XHRcdFx0cGF0aFNwbGl0WzBdICtcblx0XHRcdFx0XHRcIj5cIiArXG5cdFx0XHRcdFx0XCJcXG5cIiArXG5cdFx0XHRcdFx0XCI8UHJvcGVydHlWYWx1ZSAgUGF0aD0gXCIgK1xuXHRcdFx0XHRcdHBhdGhTcGxpdFsxXSArXG5cdFx0XHRcdFx0XCI+XCJcblx0XHRcdH07XG5cdFx0XHRhZGRBbm5vdGF0aW9uRXJyb3JNZXNzYWdlKHBhdGgsIG9FcnJvck1zZyk7XG5cdFx0fVxuXHRcdC8vIGNvbnNvbGUubG9nKFwiTWlzc2luZyB0YXJnZXQgXCIgKyBwYXRoKTtcblx0fVxuXHRpZiAocGF0aE9ubHkpIHtcblx0XHRyZXR1cm4gY3VycmVudFBhdGg7XG5cdH1cblx0aWYgKGluY2x1ZGVWaXNpdGVkT2JqZWN0cykge1xuXHRcdHJldHVybiB7XG5cdFx0XHR2aXNpdGVkT2JqZWN0czogYVZpc2l0ZWRPYmplY3RzLFxuXHRcdFx0dGFyZ2V0OiB0YXJnZXRcblx0XHR9O1xuXHR9XG5cdHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIGlzQW5ub3RhdGlvblBhdGgocGF0aFN0cjogc3RyaW5nKTogYm9vbGVhbiB7XG5cdHJldHVybiBwYXRoU3RyLmluZGV4T2YoXCJAXCIpICE9PSAtMTtcbn1cblxuZnVuY3Rpb24gcGFyc2VWYWx1ZShcblx0cHJvcGVydHlWYWx1ZTogRXhwcmVzc2lvbixcblx0dmFsdWVGUU46IHN0cmluZyxcblx0cGFyc2VyT3V0cHV0OiBQYXJzZXJPdXRwdXQsXG5cdGN1cnJlbnRUYXJnZXQ6IGFueSxcblx0b2JqZWN0TWFwOiBhbnksXG5cdHRvUmVzb2x2ZTogUmVzb2x2ZWFibGVbXSxcblx0YW5ub3RhdGlvblNvdXJjZTogc3RyaW5nLFxuXHR1bnJlc29sdmVkQW5ub3RhdGlvbnM6IEFubm90YXRpb25MaXN0W10sXG5cdGFubm90YXRpb25UeXBlOiBzdHJpbmcsXG5cdGFubm90YXRpb25zVGVybTogc3RyaW5nXG4pIHtcblx0aWYgKHByb3BlcnR5VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblx0c3dpdGNoIChwcm9wZXJ0eVZhbHVlLnR5cGUpIHtcblx0XHRjYXNlIFwiU3RyaW5nXCI6XG5cdFx0XHRyZXR1cm4gcHJvcGVydHlWYWx1ZS5TdHJpbmc7XG5cdFx0Y2FzZSBcIkludFwiOlxuXHRcdFx0cmV0dXJuIHByb3BlcnR5VmFsdWUuSW50O1xuXHRcdGNhc2UgXCJCb29sXCI6XG5cdFx0XHRyZXR1cm4gcHJvcGVydHlWYWx1ZS5Cb29sO1xuXHRcdGNhc2UgXCJEZWNpbWFsXCI6XG5cdFx0XHRyZXR1cm4gcHJvcGVydHlWYWx1ZS5EZWNpbWFsO1xuXHRcdGNhc2UgXCJEYXRlXCI6XG5cdFx0XHRyZXR1cm4gcHJvcGVydHlWYWx1ZS5EYXRlO1xuXHRcdGNhc2UgXCJFbnVtTWVtYmVyXCI6XG5cdFx0XHRyZXR1cm4gYWxpYXMocGFyc2VyT3V0cHV0LnJlZmVyZW5jZXMsIHByb3BlcnR5VmFsdWUuRW51bU1lbWJlcik7XG5cdFx0Y2FzZSBcIlByb3BlcnR5UGF0aFwiOlxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dHlwZTogXCJQcm9wZXJ0eVBhdGhcIixcblx0XHRcdFx0dmFsdWU6IHByb3BlcnR5VmFsdWUuUHJvcGVydHlQYXRoLFxuXHRcdFx0XHRmdWxseVF1YWxpZmllZE5hbWU6IHZhbHVlRlFOLFxuXHRcdFx0XHQkdGFyZ2V0OiByZXNvbHZlVGFyZ2V0KFxuXHRcdFx0XHRcdG9iamVjdE1hcCxcblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHRcdHByb3BlcnR5VmFsdWUuUHJvcGVydHlQYXRoLFxuXHRcdFx0XHRcdGZhbHNlLFxuXHRcdFx0XHRcdGZhbHNlLFxuXHRcdFx0XHRcdGFubm90YXRpb25UeXBlLFxuXHRcdFx0XHRcdGFubm90YXRpb25zVGVybVxuXHRcdFx0XHQpXG5cdFx0XHR9O1xuXHRcdGNhc2UgXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCI6XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR0eXBlOiBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIixcblx0XHRcdFx0dmFsdWU6IHByb3BlcnR5VmFsdWUuTmF2aWdhdGlvblByb3BlcnR5UGF0aCxcblx0XHRcdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiB2YWx1ZUZRTixcblx0XHRcdFx0JHRhcmdldDogcmVzb2x2ZVRhcmdldChcblx0XHRcdFx0XHRvYmplY3RNYXAsXG5cdFx0XHRcdFx0Y3VycmVudFRhcmdldCxcblx0XHRcdFx0XHRwcm9wZXJ0eVZhbHVlLk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGgsXG5cdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0YW5ub3RhdGlvblR5cGUsXG5cdFx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHRcdClcblx0XHRcdH07XG5cdFx0Y2FzZSBcIkFubm90YXRpb25QYXRoXCI6XG5cdFx0XHRjb25zdCBhbm5vdGF0aW9uVGFyZ2V0ID0gcmVzb2x2ZVRhcmdldChcblx0XHRcdFx0b2JqZWN0TWFwLFxuXHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHR1bmFsaWFzKHBhcnNlck91dHB1dC5yZWZlcmVuY2VzLCBwcm9wZXJ0eVZhbHVlLkFubm90YXRpb25QYXRoKSBhcyBzdHJpbmcsXG5cdFx0XHRcdHRydWUsXG5cdFx0XHRcdGZhbHNlLFxuXHRcdFx0XHRhbm5vdGF0aW9uVHlwZSxcblx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgYW5ub3RhdGlvblBhdGggPSB7XG5cdFx0XHRcdHR5cGU6IFwiQW5ub3RhdGlvblBhdGhcIixcblx0XHRcdFx0dmFsdWU6IHByb3BlcnR5VmFsdWUuQW5ub3RhdGlvblBhdGgsXG5cdFx0XHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogdmFsdWVGUU4sXG5cdFx0XHRcdCR0YXJnZXQ6IGFubm90YXRpb25UYXJnZXQsXG5cdFx0XHRcdGFubm90YXRpb25UeXBlOiBhbm5vdGF0aW9uVHlwZSxcblx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtOiBhbm5vdGF0aW9uc1Rlcm0sXG5cdFx0XHRcdHRlcm06IFwiXCIsXG5cdFx0XHRcdHBhdGg6IFwiXCJcblx0XHRcdH07XG5cdFx0XHR0b1Jlc29sdmUucHVzaCh7IGlubGluZTogZmFsc2UsIHRvUmVzb2x2ZTogYW5ub3RhdGlvblBhdGggfSk7XG5cdFx0XHRyZXR1cm4gYW5ub3RhdGlvblBhdGg7XG5cdFx0Y2FzZSBcIlBhdGhcIjpcblx0XHRcdGNvbnN0ICR0YXJnZXQgPSByZXNvbHZlVGFyZ2V0KFxuXHRcdFx0XHRvYmplY3RNYXAsXG5cdFx0XHRcdGN1cnJlbnRUYXJnZXQsXG5cdFx0XHRcdHByb3BlcnR5VmFsdWUuUGF0aCxcblx0XHRcdFx0dHJ1ZSxcblx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdGFubm90YXRpb25UeXBlLFxuXHRcdFx0XHRhbm5vdGF0aW9uc1Rlcm1cblx0XHRcdCk7XG5cdFx0XHRjb25zdCBwYXRoID0gbmV3IFBhdGgocHJvcGVydHlWYWx1ZSwgJHRhcmdldCwgYW5ub3RhdGlvbnNUZXJtLCBhbm5vdGF0aW9uVHlwZSwgXCJcIik7XG5cdFx0XHR0b1Jlc29sdmUucHVzaCh7XG5cdFx0XHRcdGlubGluZTogaXNBbm5vdGF0aW9uUGF0aChwcm9wZXJ0eVZhbHVlLlBhdGgpLFxuXHRcdFx0XHR0b1Jlc29sdmU6IHBhdGhcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIHBhdGg7XG5cblx0XHRjYXNlIFwiUmVjb3JkXCI6XG5cdFx0XHRyZXR1cm4gcGFyc2VSZWNvcmQoXG5cdFx0XHRcdHByb3BlcnR5VmFsdWUuUmVjb3JkLFxuXHRcdFx0XHR2YWx1ZUZRTixcblx0XHRcdFx0cGFyc2VyT3V0cHV0LFxuXHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHRvYmplY3RNYXAsXG5cdFx0XHRcdHRvUmVzb2x2ZSxcblx0XHRcdFx0YW5ub3RhdGlvblNvdXJjZSxcblx0XHRcdFx0dW5yZXNvbHZlZEFubm90YXRpb25zLFxuXHRcdFx0XHRhbm5vdGF0aW9uVHlwZSxcblx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHQpO1xuXHRcdGNhc2UgXCJDb2xsZWN0aW9uXCI6XG5cdFx0XHRyZXR1cm4gcGFyc2VDb2xsZWN0aW9uKFxuXHRcdFx0XHRwcm9wZXJ0eVZhbHVlLkNvbGxlY3Rpb24sXG5cdFx0XHRcdHZhbHVlRlFOLFxuXHRcdFx0XHRwYXJzZXJPdXRwdXQsXG5cdFx0XHRcdGN1cnJlbnRUYXJnZXQsXG5cdFx0XHRcdG9iamVjdE1hcCxcblx0XHRcdFx0dG9SZXNvbHZlLFxuXHRcdFx0XHRhbm5vdGF0aW9uU291cmNlLFxuXHRcdFx0XHR1bnJlc29sdmVkQW5ub3RhdGlvbnMsXG5cdFx0XHRcdGFubm90YXRpb25UeXBlLFxuXHRcdFx0XHRhbm5vdGF0aW9uc1Rlcm1cblx0XHRcdCk7XG5cdFx0Y2FzZSBcIkFwcGx5XCI6XG5cdFx0Y2FzZSBcIk5vdFwiOlxuXHRcdGNhc2UgXCJFcVwiOlxuXHRcdGNhc2UgXCJOZVwiOlxuXHRcdGNhc2UgXCJHdFwiOlxuXHRcdGNhc2UgXCJHZVwiOlxuXHRcdGNhc2UgXCJMdFwiOlxuXHRcdGNhc2UgXCJMZVwiOlxuXHRcdGNhc2UgXCJJZlwiOlxuXHRcdGNhc2UgXCJBbmRcIjpcblx0XHRjYXNlIFwiT3JcIjpcblx0XHRcdHJldHVybiBwcm9wZXJ0eVZhbHVlO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGluZmVyVHlwZUZyb21UZXJtKGFubm90YXRpb25zVGVybTogc3RyaW5nLCBwYXJzZXJPdXRwdXQ6IFBhcnNlck91dHB1dCwgYW5ub3RhdGlvblRhcmdldDogc3RyaW5nKSB7XG5cdGNvbnN0IHRhcmdldFR5cGUgPSAoVGVybVRvVHlwZXMgYXMgYW55KVthbm5vdGF0aW9uc1Rlcm1dO1xuXHR2YXIgb0Vycm9yTXNnID0ge1xuXHRcdGlzRXJyb3I6IGZhbHNlLFxuXHRcdG1lc3NhZ2U6IGBUaGUgdHlwZSBvZiB0aGUgcmVjb3JkIHVzZWQgd2l0aGluIHRoZSB0ZXJtICR7YW5ub3RhdGlvbnNUZXJtfSB3YXMgbm90IGRlZmluZWQgYW5kIHdhcyBpbmZlcnJlZCBhcyAke3RhcmdldFR5cGV9LlxuSGludDogSWYgcG9zc2libGUsIHRyeSB0byBtYWludGFpbiB0aGUgVHlwZSBwcm9wZXJ0eSBmb3IgZWFjaCBSZWNvcmQuXG48QW5ub3RhdGlvbnMgVGFyZ2V0PVwiJHthbm5vdGF0aW9uVGFyZ2V0fVwiPlxuXHQ8QW5ub3RhdGlvbiBUZXJtPVwiJHthbm5vdGF0aW9uc1Rlcm19XCI+XG5cdFx0PFJlY29yZD4uLi48L1JlY29yZD5cblx0PC9Bbm5vdGF0aW9uPlxuPC9Bbm5vdGF0aW9ucz5gXG5cdH07XG5cdGFkZEFubm90YXRpb25FcnJvck1lc3NhZ2UoYW5ub3RhdGlvblRhcmdldCArIFwiL1wiICsgYW5ub3RhdGlvbnNUZXJtLCBvRXJyb3JNc2cpO1xuXHRyZXR1cm4gdGFyZ2V0VHlwZTtcbn1cblxuZnVuY3Rpb24gcGFyc2VSZWNvcmQoXG5cdHJlY29yZERlZmluaXRpb246IEFubm90YXRpb25SZWNvcmQsXG5cdGN1cnJlbnRGUU46IHN0cmluZyxcblx0cGFyc2VyT3V0cHV0OiBQYXJzZXJPdXRwdXQsXG5cdGN1cnJlbnRUYXJnZXQ6IGFueSxcblx0b2JqZWN0TWFwOiBhbnksXG5cdHRvUmVzb2x2ZTogUmVzb2x2ZWFibGVbXSxcblx0YW5ub3RhdGlvblNvdXJjZTogc3RyaW5nLFxuXHR1bnJlc29sdmVkQW5ub3RhdGlvbnM6IEFubm90YXRpb25MaXN0W10sXG5cdGFubm90YXRpb25UeXBlOiBzdHJpbmcsXG5cdGFubm90YXRpb25zVGVybTogc3RyaW5nXG4pIHtcblx0bGV0IHRhcmdldFR5cGU7XG5cdGlmICghcmVjb3JkRGVmaW5pdGlvbi50eXBlICYmIGFubm90YXRpb25zVGVybSkge1xuXHRcdHRhcmdldFR5cGUgPSBpbmZlclR5cGVGcm9tVGVybShhbm5vdGF0aW9uc1Rlcm0sIHBhcnNlck91dHB1dCwgY3VycmVudFRhcmdldC5mdWxseVF1YWxpZmllZE5hbWUpO1xuXHR9IGVsc2Uge1xuXHRcdHRhcmdldFR5cGUgPSB1bmFsaWFzKHBhcnNlck91dHB1dC5yZWZlcmVuY2VzLCByZWNvcmREZWZpbml0aW9uLnR5cGUpO1xuXHR9XG5cdGNvbnN0IGFubm90YXRpb25UZXJtOiBhbnkgPSB7XG5cdFx0JFR5cGU6IHRhcmdldFR5cGUsXG5cdFx0ZnVsbHlRdWFsaWZpZWROYW1lOiBjdXJyZW50RlFOXG5cdH07XG5cdGNvbnN0IGFubm90YXRpb25Db250ZW50OiBhbnkgPSB7fTtcblx0aWYgKHJlY29yZERlZmluaXRpb24uYW5ub3RhdGlvbnMgJiYgQXJyYXkuaXNBcnJheShyZWNvcmREZWZpbml0aW9uLmFubm90YXRpb25zKSkge1xuXHRcdGNvbnN0IHN1YkFubm90YXRpb25MaXN0ID0ge1xuXHRcdFx0dGFyZ2V0OiBjdXJyZW50RlFOLFxuXHRcdFx0YW5ub3RhdGlvbnM6IHJlY29yZERlZmluaXRpb24uYW5ub3RhdGlvbnMsXG5cdFx0XHRfX3NvdXJjZTogYW5ub3RhdGlvblNvdXJjZVxuXHRcdH07XG5cdFx0dW5yZXNvbHZlZEFubm90YXRpb25zLnB1c2goc3ViQW5ub3RhdGlvbkxpc3QpO1xuXHR9XG5cdHJlY29yZERlZmluaXRpb24ucHJvcGVydHlWYWx1ZXMuZm9yRWFjaCgocHJvcGVydHlWYWx1ZTogUHJvcGVydHlWYWx1ZSkgPT4ge1xuXHRcdGFubm90YXRpb25Db250ZW50W3Byb3BlcnR5VmFsdWUubmFtZV0gPSBwYXJzZVZhbHVlKFxuXHRcdFx0cHJvcGVydHlWYWx1ZS52YWx1ZSxcblx0XHRcdGAke2N1cnJlbnRGUU59LyR7cHJvcGVydHlWYWx1ZS5uYW1lfWAsXG5cdFx0XHRwYXJzZXJPdXRwdXQsXG5cdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0b2JqZWN0TWFwLFxuXHRcdFx0dG9SZXNvbHZlLFxuXHRcdFx0YW5ub3RhdGlvblNvdXJjZSxcblx0XHRcdHVucmVzb2x2ZWRBbm5vdGF0aW9ucyxcblx0XHRcdGFubm90YXRpb25UeXBlLFxuXHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0KTtcblx0XHRpZiAocHJvcGVydHlWYWx1ZS5hbm5vdGF0aW9ucyAmJiBBcnJheS5pc0FycmF5KHByb3BlcnR5VmFsdWUuYW5ub3RhdGlvbnMpKSB7XG5cdFx0XHRjb25zdCBzdWJBbm5vdGF0aW9uTGlzdCA9IHtcblx0XHRcdFx0dGFyZ2V0OiBgJHtjdXJyZW50RlFOfS8ke3Byb3BlcnR5VmFsdWUubmFtZX1gLFxuXHRcdFx0XHRhbm5vdGF0aW9uczogcHJvcGVydHlWYWx1ZS5hbm5vdGF0aW9ucyxcblx0XHRcdFx0X19zb3VyY2U6IGFubm90YXRpb25Tb3VyY2Vcblx0XHRcdH07XG5cdFx0XHR1bnJlc29sdmVkQW5ub3RhdGlvbnMucHVzaChzdWJBbm5vdGF0aW9uTGlzdCk7XG5cdFx0fVxuXHRcdGlmIChcblx0XHRcdGFubm90YXRpb25Db250ZW50Lmhhc093blByb3BlcnR5KFwiQWN0aW9uXCIpICYmXG5cdFx0XHQoYW5ub3RhdGlvblRlcm0uJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9yQWN0aW9uXCIgfHxcblx0XHRcdFx0YW5ub3RhdGlvblRlcm0uJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkV2l0aEFjdGlvblwiKVxuXHRcdCkge1xuXHRcdFx0YW5ub3RhdGlvbkNvbnRlbnQuQWN0aW9uVGFyZ2V0ID1cblx0XHRcdFx0KGN1cnJlbnRUYXJnZXQuYWN0aW9ucyAmJiBjdXJyZW50VGFyZ2V0LmFjdGlvbnNbYW5ub3RhdGlvbkNvbnRlbnQuQWN0aW9uXSkgfHxcblx0XHRcdFx0b2JqZWN0TWFwW2Fubm90YXRpb25Db250ZW50LkFjdGlvbl07XG5cdFx0XHRpZiAoIWFubm90YXRpb25Db250ZW50LkFjdGlvblRhcmdldCkge1xuXHRcdFx0XHQvLyBBZGQgdG8gZGlhZ25vc3RpY3MgZGVidWdnZXI7XG5cdFx0XHRcdEFOTk9UQVRJT05fRVJST1JTLnB1c2goe1xuXHRcdFx0XHRcdG1lc3NhZ2U6XG5cdFx0XHRcdFx0XHRcIlVuYWJsZSB0byByZXNvbHZlIHRoZSBhY3Rpb24gXCIgK1xuXHRcdFx0XHRcdFx0YW5ub3RhdGlvbkNvbnRlbnQuQWN0aW9uICtcblx0XHRcdFx0XHRcdFwiIGRlZmluZWQgZm9yIFwiICtcblx0XHRcdFx0XHRcdGFubm90YXRpb25UZXJtLmZ1bGx5UXVhbGlmaWVkTmFtZVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihhbm5vdGF0aW9uVGVybSwgYW5ub3RhdGlvbkNvbnRlbnQpO1xufVxuXG5leHBvcnQgdHlwZSBDb2xsZWN0aW9uVHlwZSA9XG5cdHwgXCJQcm9wZXJ0eVBhdGhcIlxuXHR8IFwiUGF0aFwiXG5cdHwgXCJJZlwiXG5cdHwgXCJBcHBseVwiXG5cdHwgXCJBbmRcIlxuXHR8IFwiRXFcIlxuXHR8IFwiTmVcIlxuXHR8IFwiTm90XCJcblx0fCBcIkd0XCJcblx0fCBcIkdlXCJcblx0fCBcIkx0XCJcblx0fCBcIkxlXCJcblx0fCBcIk9yXCJcblx0fCBcIkFubm90YXRpb25QYXRoXCJcblx0fCBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIlxuXHR8IFwiUmVjb3JkXCJcblx0fCBcIlN0cmluZ1wiXG5cdHwgXCJFbXB0eUNvbGxlY3Rpb25cIjtcblxuZnVuY3Rpb24gZ2V0T3JJbmZlckNvbGxlY3Rpb25UeXBlKGNvbGxlY3Rpb25EZWZpbml0aW9uOiBhbnlbXSk6IENvbGxlY3Rpb25UeXBlIHtcblx0bGV0IHR5cGU6IENvbGxlY3Rpb25UeXBlID0gKGNvbGxlY3Rpb25EZWZpbml0aW9uIGFzIGFueSkudHlwZTtcblx0aWYgKHR5cGUgPT09IHVuZGVmaW5lZCAmJiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5sZW5ndGggPiAwKSB7XG5cdFx0Y29uc3QgZmlyc3RDb2xJdGVtID0gY29sbGVjdGlvbkRlZmluaXRpb25bMF07XG5cdFx0aWYgKGZpcnN0Q29sSXRlbS5oYXNPd25Qcm9wZXJ0eShcIlByb3BlcnR5UGF0aFwiKSkge1xuXHRcdFx0dHlwZSA9IFwiUHJvcGVydHlQYXRoXCI7XG5cdFx0fSBlbHNlIGlmIChmaXJzdENvbEl0ZW0uaGFzT3duUHJvcGVydHkoXCJQYXRoXCIpKSB7XG5cdFx0XHR0eXBlID0gXCJQYXRoXCI7XG5cdFx0fSBlbHNlIGlmIChmaXJzdENvbEl0ZW0uaGFzT3duUHJvcGVydHkoXCJBbm5vdGF0aW9uUGF0aFwiKSkge1xuXHRcdFx0dHlwZSA9IFwiQW5ub3RhdGlvblBhdGhcIjtcblx0XHR9IGVsc2UgaWYgKGZpcnN0Q29sSXRlbS5oYXNPd25Qcm9wZXJ0eShcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIikpIHtcblx0XHRcdHR5cGUgPSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIjtcblx0XHR9IGVsc2UgaWYgKFxuXHRcdFx0dHlwZW9mIGZpcnN0Q29sSXRlbSA9PT0gXCJvYmplY3RcIiAmJlxuXHRcdFx0KGZpcnN0Q29sSXRlbS5oYXNPd25Qcm9wZXJ0eShcInR5cGVcIikgfHwgZmlyc3RDb2xJdGVtLmhhc093blByb3BlcnR5KFwicHJvcGVydHlWYWx1ZXNcIikpXG5cdFx0KSB7XG5cdFx0XHR0eXBlID0gXCJSZWNvcmRcIjtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBmaXJzdENvbEl0ZW0gPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdHR5cGUgPSBcIlN0cmluZ1wiO1xuXHRcdH1cblx0fSBlbHNlIGlmICh0eXBlID09PSB1bmRlZmluZWQpIHtcblx0XHR0eXBlID0gXCJFbXB0eUNvbGxlY3Rpb25cIjtcblx0fVxuXHRyZXR1cm4gdHlwZTtcbn1cblxuZnVuY3Rpb24gcGFyc2VDb2xsZWN0aW9uKFxuXHRjb2xsZWN0aW9uRGVmaW5pdGlvbjogYW55W10sXG5cdHBhcmVudEZRTjogc3RyaW5nLFxuXHRwYXJzZXJPdXRwdXQ6IFBhcnNlck91dHB1dCxcblx0Y3VycmVudFRhcmdldDogYW55LFxuXHRvYmplY3RNYXA6IGFueSxcblx0dG9SZXNvbHZlOiBSZXNvbHZlYWJsZVtdLFxuXHRhbm5vdGF0aW9uU291cmNlOiBzdHJpbmcsXG5cdHVucmVzb2x2ZWRBbm5vdGF0aW9uczogQW5ub3RhdGlvbkxpc3RbXSxcblx0YW5ub3RhdGlvblR5cGU6IHN0cmluZyxcblx0YW5ub3RhdGlvbnNUZXJtOiBzdHJpbmdcbikge1xuXHRjb25zdCBjb2xsZWN0aW9uRGVmaW5pdGlvblR5cGUgPSBnZXRPckluZmVyQ29sbGVjdGlvblR5cGUoY29sbGVjdGlvbkRlZmluaXRpb24pO1xuXHRzd2l0Y2ggKGNvbGxlY3Rpb25EZWZpbml0aW9uVHlwZSkge1xuXHRcdGNhc2UgXCJQcm9wZXJ0eVBhdGhcIjpcblx0XHRcdHJldHVybiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5tYXAoKHByb3BlcnR5UGF0aCwgcHJvcGVydHlJZHgpID0+IHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHR0eXBlOiBcIlByb3BlcnR5UGF0aFwiLFxuXHRcdFx0XHRcdHZhbHVlOiBwcm9wZXJ0eVBhdGguUHJvcGVydHlQYXRoLFxuXHRcdFx0XHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogYCR7cGFyZW50RlFOfS8ke3Byb3BlcnR5SWR4fWAsXG5cdFx0XHRcdFx0JHRhcmdldDogcmVzb2x2ZVRhcmdldChcblx0XHRcdFx0XHRcdG9iamVjdE1hcCxcblx0XHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQsXG5cdFx0XHRcdFx0XHRwcm9wZXJ0eVBhdGguUHJvcGVydHlQYXRoLFxuXHRcdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0XHRcdGFubm90YXRpb25UeXBlLFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHR9O1xuXHRcdFx0fSk7XG5cdFx0Y2FzZSBcIlBhdGhcIjpcblx0XHRcdHJldHVybiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5tYXAocGF0aFZhbHVlID0+IHtcblx0XHRcdFx0Y29uc3QgJHRhcmdldCA9IHJlc29sdmVUYXJnZXQoXG5cdFx0XHRcdFx0b2JqZWN0TWFwLFxuXHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQsXG5cdFx0XHRcdFx0cGF0aFZhbHVlLlBhdGgsXG5cdFx0XHRcdFx0dHJ1ZSxcblx0XHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0XHRhbm5vdGF0aW9uVHlwZSxcblx0XHRcdFx0XHRhbm5vdGF0aW9uc1Rlcm1cblx0XHRcdFx0KTtcblx0XHRcdFx0Y29uc3QgcGF0aCA9IG5ldyBQYXRoKHBhdGhWYWx1ZSwgJHRhcmdldCwgYW5ub3RhdGlvbnNUZXJtLCBhbm5vdGF0aW9uVHlwZSwgXCJcIik7XG5cdFx0XHRcdHRvUmVzb2x2ZS5wdXNoKHtcblx0XHRcdFx0XHRpbmxpbmU6IGlzQW5ub3RhdGlvblBhdGgocGF0aFZhbHVlLlBhdGgpLFxuXHRcdFx0XHRcdHRvUmVzb2x2ZTogcGF0aFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIHBhdGg7XG5cdFx0XHR9KTtcblx0XHRjYXNlIFwiQW5ub3RhdGlvblBhdGhcIjpcblx0XHRcdHJldHVybiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5tYXAoKGFubm90YXRpb25QYXRoLCBhbm5vdGF0aW9uSWR4KSA9PiB7XG5cdFx0XHRcdGNvbnN0IGFubm90YXRpb25UYXJnZXQgPSByZXNvbHZlVGFyZ2V0KFxuXHRcdFx0XHRcdG9iamVjdE1hcCxcblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHRcdGFubm90YXRpb25QYXRoLkFubm90YXRpb25QYXRoLFxuXHRcdFx0XHRcdHRydWUsXG5cdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0YW5ub3RhdGlvblR5cGUsXG5cdFx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGNvbnN0IGFubm90YXRpb25Db2xsZWN0aW9uRWxlbWVudCA9IHtcblx0XHRcdFx0XHR0eXBlOiBcIkFubm90YXRpb25QYXRoXCIsXG5cdFx0XHRcdFx0dmFsdWU6IGFubm90YXRpb25QYXRoLkFubm90YXRpb25QYXRoLFxuXHRcdFx0XHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogYCR7cGFyZW50RlFOfS8ke2Fubm90YXRpb25JZHh9YCxcblx0XHRcdFx0XHQkdGFyZ2V0OiBhbm5vdGF0aW9uVGFyZ2V0LFxuXHRcdFx0XHRcdGFubm90YXRpb25UeXBlOiBhbm5vdGF0aW9uVHlwZSxcblx0XHRcdFx0XHRhbm5vdGF0aW9uc1Rlcm06IGFubm90YXRpb25zVGVybSxcblx0XHRcdFx0XHR0ZXJtOiBcIlwiLFxuXHRcdFx0XHRcdHBhdGg6IFwiXCJcblx0XHRcdFx0fTtcblx0XHRcdFx0dG9SZXNvbHZlLnB1c2goe1xuXHRcdFx0XHRcdGlubGluZTogZmFsc2UsXG5cdFx0XHRcdFx0dG9SZXNvbHZlOiBhbm5vdGF0aW9uQ29sbGVjdGlvbkVsZW1lbnRcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybiBhbm5vdGF0aW9uQ29sbGVjdGlvbkVsZW1lbnQ7XG5cdFx0XHR9KTtcblx0XHRjYXNlIFwiTmF2aWdhdGlvblByb3BlcnR5UGF0aFwiOlxuXHRcdFx0cmV0dXJuIGNvbGxlY3Rpb25EZWZpbml0aW9uLm1hcCgobmF2UHJvcGVydHlQYXRoLCBuYXZQcm9wSWR4KSA9PiB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0dHlwZTogXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCIsXG5cdFx0XHRcdFx0dmFsdWU6IG5hdlByb3BlcnR5UGF0aC5OYXZpZ2F0aW9uUHJvcGVydHlQYXRoLFxuXHRcdFx0XHRcdGZ1bGx5UXVhbGlmaWVkTmFtZTogYCR7cGFyZW50RlFOfS8ke25hdlByb3BJZHh9YCxcblx0XHRcdFx0XHQkdGFyZ2V0OiByZXNvbHZlVGFyZ2V0KFxuXHRcdFx0XHRcdFx0b2JqZWN0TWFwLFxuXHRcdFx0XHRcdFx0Y3VycmVudFRhcmdldCxcblx0XHRcdFx0XHRcdG5hdlByb3BlcnR5UGF0aC5OYXZpZ2F0aW9uUHJvcGVydHlQYXRoLFxuXHRcdFx0XHRcdFx0ZmFsc2UsXG5cdFx0XHRcdFx0XHRmYWxzZSxcblx0XHRcdFx0XHRcdGFubm90YXRpb25UeXBlLFxuXHRcdFx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHR9O1xuXHRcdFx0fSk7XG5cdFx0Y2FzZSBcIlJlY29yZFwiOlxuXHRcdFx0cmV0dXJuIGNvbGxlY3Rpb25EZWZpbml0aW9uLm1hcCgocmVjb3JkRGVmaW5pdGlvbiwgcmVjb3JkSWR4KSA9PiB7XG5cdFx0XHRcdHJldHVybiBwYXJzZVJlY29yZChcblx0XHRcdFx0XHRyZWNvcmREZWZpbml0aW9uLFxuXHRcdFx0XHRcdGAke3BhcmVudEZRTn0vJHtyZWNvcmRJZHh9YCxcblx0XHRcdFx0XHRwYXJzZXJPdXRwdXQsXG5cdFx0XHRcdFx0Y3VycmVudFRhcmdldCxcblx0XHRcdFx0XHRvYmplY3RNYXAsXG5cdFx0XHRcdFx0dG9SZXNvbHZlLFxuXHRcdFx0XHRcdGFubm90YXRpb25Tb3VyY2UsXG5cdFx0XHRcdFx0dW5yZXNvbHZlZEFubm90YXRpb25zLFxuXHRcdFx0XHRcdGFubm90YXRpb25UeXBlLFxuXHRcdFx0XHRcdGFubm90YXRpb25zVGVybVxuXHRcdFx0XHQpO1xuXHRcdFx0fSk7XG5cdFx0Y2FzZSBcIkFwcGx5XCI6XG5cdFx0Y2FzZSBcIklmXCI6XG5cdFx0Y2FzZSBcIkVxXCI6XG5cdFx0Y2FzZSBcIk5lXCI6XG5cdFx0Y2FzZSBcIkx0XCI6XG5cdFx0Y2FzZSBcIkd0XCI6XG5cdFx0Y2FzZSBcIkxlXCI6XG5cdFx0Y2FzZSBcIkdlXCI6XG5cdFx0Y2FzZSBcIk5vdFwiOlxuXHRcdGNhc2UgXCJBbmRcIjpcblx0XHRjYXNlIFwiT3JcIjpcblx0XHRcdHJldHVybiBjb2xsZWN0aW9uRGVmaW5pdGlvbi5tYXAoaWZWYWx1ZSA9PiB7XG5cdFx0XHRcdHJldHVybiBpZlZhbHVlO1xuXHRcdFx0fSk7XG5cdFx0Y2FzZSBcIlN0cmluZ1wiOlxuXHRcdFx0cmV0dXJuIGNvbGxlY3Rpb25EZWZpbml0aW9uLm1hcChzdHJpbmdWYWx1ZSA9PiB7XG5cdFx0XHRcdGlmICh0eXBlb2Ygc3RyaW5nVmFsdWUgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0XHRyZXR1cm4gc3RyaW5nVmFsdWU7XG5cdFx0XHRcdH0gZWxzZSBpZiAoc3RyaW5nVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHJldHVybiBzdHJpbmdWYWx1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gc3RyaW5nVmFsdWUuU3RyaW5nO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRkZWZhdWx0OlxuXHRcdFx0aWYgKGNvbGxlY3Rpb25EZWZpbml0aW9uLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHR9XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbnN1cHBvcnRlZCBjYXNlXCIpO1xuXHR9XG59XG5cbnR5cGUgUmVzb2x2ZWFibGUgPSB7XG5cdGlubGluZTogYm9vbGVhbjtcblx0dG9SZXNvbHZlOiB7XG5cdFx0JHRhcmdldDogc3RyaW5nO1xuXHRcdHRhcmdldFN0cmluZz86IHN0cmluZztcblx0XHRhbm5vdGF0aW9uc1Rlcm06IHN0cmluZztcblx0XHRhbm5vdGF0aW9uVHlwZTogc3RyaW5nO1xuXHRcdHRlcm06IHN0cmluZztcblx0XHRwYXRoOiBzdHJpbmc7XG5cdH07XG59O1xuXG5mdW5jdGlvbiBjb252ZXJ0QW5ub3RhdGlvbihcblx0YW5ub3RhdGlvbjogQW5ub3RhdGlvbixcblx0cGFyc2VyT3V0cHV0OiBQYXJzZXJPdXRwdXQsXG5cdGN1cnJlbnRUYXJnZXQ6IGFueSxcblx0b2JqZWN0TWFwOiBhbnksXG5cdHRvUmVzb2x2ZTogUmVzb2x2ZWFibGVbXSxcblx0YW5ub3RhdGlvblNvdXJjZTogc3RyaW5nLFxuXHR1bnJlc29sdmVkQW5ub3RhdGlvbnM6IEFubm90YXRpb25MaXN0W11cbik6IGFueSB7XG5cdGlmIChhbm5vdGF0aW9uLnJlY29yZCkge1xuXHRcdGNvbnN0IGFubm90YXRpb25UeXBlID0gYW5ub3RhdGlvbi5yZWNvcmQudHlwZVxuXHRcdFx0PyB1bmFsaWFzKHBhcnNlck91dHB1dC5yZWZlcmVuY2VzLCBhbm5vdGF0aW9uLnJlY29yZC50eXBlKVxuXHRcdFx0OiBpbmZlclR5cGVGcm9tVGVybShhbm5vdGF0aW9uLnRlcm0sIHBhcnNlck91dHB1dCwgY3VycmVudFRhcmdldC5mdWxseVF1YWxpZmllZE5hbWUpO1xuXHRcdGNvbnN0IGFubm90YXRpb25UZXJtOiBhbnkgPSB7XG5cdFx0XHQkVHlwZTogYW5ub3RhdGlvblR5cGUsXG5cdFx0XHRmdWxseVF1YWxpZmllZE5hbWU6IGFubm90YXRpb24uZnVsbHlRdWFsaWZpZWROYW1lLFxuXHRcdFx0cXVhbGlmaWVyOiBhbm5vdGF0aW9uLnF1YWxpZmllclxuXHRcdH07XG5cdFx0Y29uc3QgYW5ub3RhdGlvbkNvbnRlbnQ6IGFueSA9IHt9O1xuXHRcdGFubm90YXRpb24ucmVjb3JkLnByb3BlcnR5VmFsdWVzLmZvckVhY2goKHByb3BlcnR5VmFsdWU6IFByb3BlcnR5VmFsdWUpID0+IHtcblx0XHRcdGFubm90YXRpb25Db250ZW50W3Byb3BlcnR5VmFsdWUubmFtZV0gPSBwYXJzZVZhbHVlKFxuXHRcdFx0XHRwcm9wZXJ0eVZhbHVlLnZhbHVlLFxuXHRcdFx0XHRgJHthbm5vdGF0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZX0vJHtwcm9wZXJ0eVZhbHVlLm5hbWV9YCxcblx0XHRcdFx0cGFyc2VyT3V0cHV0LFxuXHRcdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0XHRvYmplY3RNYXAsXG5cdFx0XHRcdHRvUmVzb2x2ZSxcblx0XHRcdFx0YW5ub3RhdGlvblNvdXJjZSxcblx0XHRcdFx0dW5yZXNvbHZlZEFubm90YXRpb25zLFxuXHRcdFx0XHRhbm5vdGF0aW9uVHlwZSxcblx0XHRcdFx0YW5ub3RhdGlvbi50ZXJtXG5cdFx0XHQpO1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRhbm5vdGF0aW9uQ29udGVudC5oYXNPd25Qcm9wZXJ0eShcIkFjdGlvblwiKSAmJlxuXHRcdFx0XHQoIWFubm90YXRpb24ucmVjb3JkIHx8XG5cdFx0XHRcdFx0YW5ub3RhdGlvblRlcm0uJFR5cGUgPT09IFwiY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuRGF0YUZpZWxkRm9yQWN0aW9uXCIgfHxcblx0XHRcdFx0XHRhbm5vdGF0aW9uVGVybS4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRXaXRoQWN0aW9uXCIpXG5cdFx0XHQpIHtcblx0XHRcdFx0YW5ub3RhdGlvbkNvbnRlbnQuQWN0aW9uVGFyZ2V0ID1cblx0XHRcdFx0XHQoY3VycmVudFRhcmdldC5hY3Rpb25zICYmIGN1cnJlbnRUYXJnZXQuYWN0aW9uc1thbm5vdGF0aW9uQ29udGVudC5BY3Rpb25dKSB8fFxuXHRcdFx0XHRcdG9iamVjdE1hcFthbm5vdGF0aW9uQ29udGVudC5BY3Rpb25dO1xuXHRcdFx0XHRpZiAoIWFubm90YXRpb25Db250ZW50LkFjdGlvblRhcmdldCkge1xuXHRcdFx0XHRcdEFOTk9UQVRJT05fRVJST1JTLnB1c2goe1xuXHRcdFx0XHRcdFx0bWVzc2FnZTpcblx0XHRcdFx0XHRcdFx0XCJVbmFibGUgdG8gcmVzb2x2ZSB0aGUgYWN0aW9uIFwiICtcblx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvbkNvbnRlbnQuQWN0aW9uICtcblx0XHRcdFx0XHRcdFx0XCIgZGVmaW5lZCBmb3IgXCIgK1xuXHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdC8vIEFkZCB0byBkaWFnbm9zdGljc1xuXHRcdFx0XHRcdC8vIGRlYnVnZ2VyO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oYW5ub3RhdGlvblRlcm0sIGFubm90YXRpb25Db250ZW50KTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uLmNvbGxlY3Rpb24gPT09IHVuZGVmaW5lZCkge1xuXHRcdGlmIChhbm5vdGF0aW9uLnZhbHVlKSB7XG5cdFx0XHRyZXR1cm4gcGFyc2VWYWx1ZShcblx0XHRcdFx0YW5ub3RhdGlvbi52YWx1ZSxcblx0XHRcdFx0YW5ub3RhdGlvbi5mdWxseVF1YWxpZmllZE5hbWUsXG5cdFx0XHRcdHBhcnNlck91dHB1dCxcblx0XHRcdFx0Y3VycmVudFRhcmdldCxcblx0XHRcdFx0b2JqZWN0TWFwLFxuXHRcdFx0XHR0b1Jlc29sdmUsXG5cdFx0XHRcdGFubm90YXRpb25Tb3VyY2UsXG5cdFx0XHRcdHVucmVzb2x2ZWRBbm5vdGF0aW9ucyxcblx0XHRcdFx0XCJcIixcblx0XHRcdFx0YW5ub3RhdGlvbi50ZXJtXG5cdFx0XHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH0gZWxzZSBpZiAoYW5ub3RhdGlvbi5jb2xsZWN0aW9uKSB7XG5cdFx0Y29uc3QgY29sbGVjdGlvbjogYW55ID0gcGFyc2VDb2xsZWN0aW9uKFxuXHRcdFx0YW5ub3RhdGlvbi5jb2xsZWN0aW9uLFxuXHRcdFx0YW5ub3RhdGlvbi5mdWxseVF1YWxpZmllZE5hbWUsXG5cdFx0XHRwYXJzZXJPdXRwdXQsXG5cdFx0XHRjdXJyZW50VGFyZ2V0LFxuXHRcdFx0b2JqZWN0TWFwLFxuXHRcdFx0dG9SZXNvbHZlLFxuXHRcdFx0YW5ub3RhdGlvblNvdXJjZSxcblx0XHRcdHVucmVzb2x2ZWRBbm5vdGF0aW9ucyxcblx0XHRcdFwiXCIsXG5cdFx0XHRhbm5vdGF0aW9uLnRlcm1cblx0XHQpO1xuXHRcdGNvbGxlY3Rpb24uZnVsbHlRdWFsaWZpZWROYW1lID0gYW5ub3RhdGlvbi5mdWxseVF1YWxpZmllZE5hbWU7XG5cdFx0cmV0dXJuIGNvbGxlY3Rpb247XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5zdXBwb3J0ZWQgY2FzZVwiKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVSZXNvbHZlUGF0aEZuKGVudGl0eVR5cGU6IEVudGl0eVR5cGUsIG9iamVjdE1hcDogUmVjb3JkPHN0cmluZywgYW55Pikge1xuXHRyZXR1cm4gZnVuY3Rpb24ocmVsYXRpdmVQYXRoOiBzdHJpbmcsIGluY2x1ZGVWaXNpdGVkT2JqZWN0czogYm9vbGVhbik6IGFueSB7XG5cdFx0Y29uc3QgYW5ub3RhdGlvblRlcm06IHN0cmluZyA9IFwiXCI7XG5cdFx0Y29uc3QgYW5ub3RhdGlvblR5cGU6IHN0cmluZyA9IFwiXCI7XG5cdFx0cmV0dXJuIHJlc29sdmVUYXJnZXQoXG5cdFx0XHRvYmplY3RNYXAsXG5cdFx0XHRlbnRpdHlUeXBlLFxuXHRcdFx0cmVsYXRpdmVQYXRoLFxuXHRcdFx0ZmFsc2UsXG5cdFx0XHRpbmNsdWRlVmlzaXRlZE9iamVjdHMsXG5cdFx0XHRhbm5vdGF0aW9uVHlwZSxcblx0XHRcdGFubm90YXRpb25UZXJtXG5cdFx0KTtcblx0fTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZU5hdmlnYXRpb25Qcm9wZXJ0aWVzKFxuXHRlbnRpdHlUeXBlczogUGFyc2VyRW50aXR5VHlwZVtdLFxuXHRhc3NvY2lhdGlvbnM6IEFzc29jaWF0aW9uW10sXG5cdG9iamVjdE1hcDogUmVjb3JkPHN0cmluZywgYW55PlxuKTogdm9pZCB7XG5cdGVudGl0eVR5cGVzLmZvckVhY2goZW50aXR5VHlwZSA9PiB7XG5cdFx0ZW50aXR5VHlwZS5uYXZpZ2F0aW9uUHJvcGVydGllcyA9IGVudGl0eVR5cGUubmF2aWdhdGlvblByb3BlcnRpZXMubWFwKG5hdlByb3AgPT4ge1xuXHRcdFx0Y29uc3Qgb3V0TmF2UHJvcDogUGFydGlhbDxOYXZpZ2F0aW9uUHJvcGVydHk+ID0ge1xuXHRcdFx0XHRfdHlwZTogXCJOYXZpZ2F0aW9uUHJvcGVydHlcIixcblx0XHRcdFx0bmFtZTogbmF2UHJvcC5uYW1lLFxuXHRcdFx0XHRmdWxseVF1YWxpZmllZE5hbWU6IG5hdlByb3AuZnVsbHlRdWFsaWZpZWROYW1lLFxuXHRcdFx0XHRwYXJ0bmVyOiAobmF2UHJvcCBhcyBhbnkpLmhhc093blByb3BlcnR5KFwicGFydG5lclwiKSA/IChuYXZQcm9wIGFzIGFueSkucGFydG5lciA6IHVuZGVmaW5lZCxcblx0XHRcdFx0Ly8gdGFyZ2V0VHlwZU5hbWU6IEZ1bGx5UXVhbGlmaWVkTmFtZTtcblx0XHRcdFx0Ly8gdGFyZ2V0VHlwZTogRW50aXR5VHlwZTtcblx0XHRcdFx0aXNDb2xsZWN0aW9uOiAobmF2UHJvcCBhcyBhbnkpLmhhc093blByb3BlcnR5KFwiaXNDb2xsZWN0aW9uXCIpID8gKG5hdlByb3AgYXMgYW55KS5pc0NvbGxlY3Rpb24gOiBmYWxzZSxcblx0XHRcdFx0Y29udGFpbnNUYXJnZXQ6IChuYXZQcm9wIGFzIGFueSkuaGFzT3duUHJvcGVydHkoXCJjb250YWluc1RhcmdldFwiKVxuXHRcdFx0XHRcdD8gKG5hdlByb3AgYXMgYW55KS5jb250YWluc1RhcmdldFxuXHRcdFx0XHRcdDogZmFsc2UsXG5cdFx0XHRcdHJlZmVyZW50aWFsQ29uc3RyYWludDogKG5hdlByb3AgYXMgYW55KS5yZWZlcmVudGlhbENvbnN0cmFpbnRcblx0XHRcdFx0XHQ/IChuYXZQcm9wIGFzIGFueSkucmVmZXJlbnRpYWxDb25zdHJhaW50XG5cdFx0XHRcdFx0OiBbXSxcblx0XHRcdFx0YW5ub3RhdGlvbnM6IHt9XG5cdFx0XHR9O1xuXHRcdFx0aWYgKChuYXZQcm9wIGFzIEdlbmVyaWNOYXZpZ2F0aW9uUHJvcGVydHkpLnRhcmdldFR5cGVOYW1lKSB7XG5cdFx0XHRcdG91dE5hdlByb3AudGFyZ2V0VHlwZSA9IG9iamVjdE1hcFsobmF2UHJvcCBhcyBWNE5hdmlnYXRpb25Qcm9wZXJ0eSkudGFyZ2V0VHlwZU5hbWVdO1xuXHRcdFx0fSBlbHNlIGlmICgobmF2UHJvcCBhcyBWMk5hdmlnYXRpb25Qcm9wZXJ0eSkucmVsYXRpb25zaGlwKSB7XG5cdFx0XHRcdGNvbnN0IHRhcmdldEFzc29jaWF0aW9uID0gYXNzb2NpYXRpb25zLmZpbmQoXG5cdFx0XHRcdFx0YXNzb2NpYXRpb24gPT4gYXNzb2NpYXRpb24uZnVsbHlRdWFsaWZpZWROYW1lID09PSAobmF2UHJvcCBhcyBWMk5hdmlnYXRpb25Qcm9wZXJ0eSkucmVsYXRpb25zaGlwXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGlmICh0YXJnZXRBc3NvY2lhdGlvbikge1xuXHRcdFx0XHRcdGNvbnN0IGFzc29jaWF0aW9uRW5kID0gdGFyZ2V0QXNzb2NpYXRpb24uYXNzb2NpYXRpb25FbmQuZmluZChcblx0XHRcdFx0XHRcdGVuZCA9PiBlbmQucm9sZSA9PT0gKG5hdlByb3AgYXMgVjJOYXZpZ2F0aW9uUHJvcGVydHkpLnRvUm9sZVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0aWYgKGFzc29jaWF0aW9uRW5kKSB7XG5cdFx0XHRcdFx0XHRvdXROYXZQcm9wLnRhcmdldFR5cGUgPSBvYmplY3RNYXBbYXNzb2NpYXRpb25FbmQudHlwZV07XG5cdFx0XHRcdFx0XHRvdXROYXZQcm9wLmlzQ29sbGVjdGlvbiA9IGFzc29jaWF0aW9uRW5kLm11bHRpcGxpY2l0eSA9PT0gXCIqXCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAob3V0TmF2UHJvcC50YXJnZXRUeXBlKSB7XG5cdFx0XHRcdG91dE5hdlByb3AudGFyZ2V0VHlwZU5hbWUgPSBvdXROYXZQcm9wLnRhcmdldFR5cGUuZnVsbHlRdWFsaWZpZWROYW1lO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3Qgb3V0TmF2UHJvcFJlcSA9IG91dE5hdlByb3AgYXMgTmF2aWdhdGlvblByb3BlcnR5O1xuXHRcdFx0b2JqZWN0TWFwW291dE5hdlByb3BSZXEuZnVsbHlRdWFsaWZpZWROYW1lXSA9IG91dE5hdlByb3BSZXE7XG5cdFx0XHRyZXR1cm4gb3V0TmF2UHJvcFJlcTtcblx0XHR9KTtcblx0XHQoZW50aXR5VHlwZSBhcyBFbnRpdHlUeXBlKS5yZXNvbHZlUGF0aCA9IGNyZWF0ZVJlc29sdmVQYXRoRm4oZW50aXR5VHlwZSBhcyBFbnRpdHlUeXBlLCBvYmplY3RNYXApO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gbGlua0FjdGlvbnNUb0VudGl0eVR5cGUobmFtZXNwYWNlOiBzdHJpbmcsIGFjdGlvbnM6IEFjdGlvbltdLCBvYmplY3RNYXA6IFJlY29yZDxzdHJpbmcsIGFueT4pOiB2b2lkIHtcblx0YWN0aW9ucy5mb3JFYWNoKGFjdGlvbiA9PiB7XG5cdFx0aWYgKCFhY3Rpb24uYW5ub3RhdGlvbnMpIHtcblx0XHRcdGFjdGlvbi5hbm5vdGF0aW9ucyA9IHt9O1xuXHRcdH1cblx0XHRpZiAoYWN0aW9uLmlzQm91bmQpIHtcblx0XHRcdGNvbnN0IHNvdXJjZUVudGl0eVR5cGUgPSBvYmplY3RNYXBbYWN0aW9uLnNvdXJjZVR5cGVdO1xuXHRcdFx0YWN0aW9uLnNvdXJjZUVudGl0eVR5cGUgPSBzb3VyY2VFbnRpdHlUeXBlO1xuXHRcdFx0aWYgKHNvdXJjZUVudGl0eVR5cGUpIHtcblx0XHRcdFx0aWYgKCFzb3VyY2VFbnRpdHlUeXBlLmFjdGlvbnMpIHtcblx0XHRcdFx0XHRzb3VyY2VFbnRpdHlUeXBlLmFjdGlvbnMgPSB7fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzb3VyY2VFbnRpdHlUeXBlLmFjdGlvbnNbYWN0aW9uLm5hbWVdID0gYWN0aW9uO1xuXHRcdFx0XHRzb3VyY2VFbnRpdHlUeXBlLmFjdGlvbnNbYCR7bmFtZXNwYWNlfS4ke2FjdGlvbi5uYW1lfWBdID0gYWN0aW9uO1xuXHRcdFx0fVxuXHRcdFx0YWN0aW9uLnJldHVybkVudGl0eVR5cGUgPSBvYmplY3RNYXBbYWN0aW9uLnJldHVyblR5cGVdO1xuXHRcdH1cblx0fSk7XG59XG5cbmZ1bmN0aW9uIGxpbmtFbnRpdHlUeXBlVG9FbnRpdHlTZXQoXG5cdGVudGl0eVNldHM6IEVudGl0eVNldFtdLFxuXHRvYmplY3RNYXA6IFJlY29yZDxzdHJpbmcsIGFueT4sXG5cdHJlZmVyZW5jZXM6IFJlZmVyZW5jZXNXaXRoTWFwXG4pOiB2b2lkIHtcblx0ZW50aXR5U2V0cy5mb3JFYWNoKGVudGl0eVNldCA9PiB7XG5cdFx0ZW50aXR5U2V0LmVudGl0eVR5cGUgPSBvYmplY3RNYXBbZW50aXR5U2V0LmVudGl0eVR5cGVOYW1lXTtcblx0XHRpZiAoIWVudGl0eVNldC5lbnRpdHlUeXBlKSB7XG5cdFx0XHRlbnRpdHlTZXQuZW50aXR5VHlwZSA9IG9iamVjdE1hcFt1bmFsaWFzKHJlZmVyZW5jZXMsIGVudGl0eVNldC5lbnRpdHlUeXBlTmFtZSkgYXMgc3RyaW5nXTtcblx0XHR9XG5cdFx0aWYgKCFlbnRpdHlTZXQuYW5ub3RhdGlvbnMpIHtcblx0XHRcdGVudGl0eVNldC5hbm5vdGF0aW9ucyA9IHt9O1xuXHRcdH1cblx0XHRpZiAoIWVudGl0eVNldC5lbnRpdHlUeXBlLmFubm90YXRpb25zKSB7XG5cdFx0XHRlbnRpdHlTZXQuZW50aXR5VHlwZS5hbm5vdGF0aW9ucyA9IHt9O1xuXHRcdH1cblx0XHRlbnRpdHlTZXQuZW50aXR5VHlwZS5rZXlzLmZvckVhY2goKGtleVByb3A6IFByb3BlcnR5KSA9PiB7XG5cdFx0XHRrZXlQcm9wLmlzS2V5ID0gdHJ1ZTtcblx0XHR9KTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGxpbmtFbnRpdHlUeXBlVG9TaW5nbGV0b24oXG5cdHNpbmdsZXRvbnM6IFNpbmdsZXRvbltdLFxuXHRvYmplY3RNYXA6IFJlY29yZDxzdHJpbmcsIGFueT4sXG5cdHJlZmVyZW5jZXM6IFJlZmVyZW5jZXNXaXRoTWFwXG4pOiB2b2lkIHtcblx0c2luZ2xldG9ucy5mb3JFYWNoKHNpbmdsZXRvbiA9PiB7XG5cdFx0c2luZ2xldG9uLnR5cGUgPSBvYmplY3RNYXBbc2luZ2xldG9uLnR5cGVOYW1lXTtcblx0XHRpZiAoIXNpbmdsZXRvbi50eXBlKSB7XG5cdFx0XHRzaW5nbGV0b24udHlwZSA9IG9iamVjdE1hcFt1bmFsaWFzKHJlZmVyZW5jZXMsIHNpbmdsZXRvbi50eXBlTmFtZSkgYXMgc3RyaW5nXTtcblx0XHR9XG5cdFx0aWYgKCFzaW5nbGV0b24uYW5ub3RhdGlvbnMpIHtcblx0XHRcdHNpbmdsZXRvbi5hbm5vdGF0aW9ucyA9IHt9O1xuXHRcdH1cblx0XHRpZiAoIXNpbmdsZXRvbi50eXBlLmFubm90YXRpb25zKSB7XG5cdFx0XHRzaW5nbGV0b24udHlwZS5hbm5vdGF0aW9ucyA9IHt9O1xuXHRcdH1cblx0XHRzaW5nbGV0b24udHlwZS5rZXlzLmZvckVhY2goKGtleVByb3A6IFByb3BlcnR5KSA9PiB7XG5cdFx0XHRrZXlQcm9wLmlzS2V5ID0gdHJ1ZTtcblx0XHR9KTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGxpbmtQcm9wZXJ0aWVzVG9Db21wbGV4VHlwZXMoZW50aXR5VHlwZXM6IEVudGl0eVR5cGVbXSwgb2JqZWN0TWFwOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG5cdGVudGl0eVR5cGVzLmZvckVhY2goZW50aXR5VHlwZSA9PiB7XG5cdFx0ZW50aXR5VHlwZS5lbnRpdHlQcm9wZXJ0aWVzLmZvckVhY2goZW50aXR5UHJvcGVydHkgPT4ge1xuXHRcdFx0aWYgKCFlbnRpdHlQcm9wZXJ0eS5hbm5vdGF0aW9ucykge1xuXHRcdFx0XHRlbnRpdHlQcm9wZXJ0eS5hbm5vdGF0aW9ucyA9IHt9O1xuXHRcdFx0fVxuXHRcdFx0aWYgKGVudGl0eVByb3BlcnR5LnR5cGUuaW5kZXhPZihcIkVkbVwiKSA9PT0gLTEpIHtcblx0XHRcdFx0aWYgKGVudGl0eVByb3BlcnR5LnR5cGUuc3RhcnRzV2l0aChcIkNvbGxlY3Rpb25cIikpIHtcblx0XHRcdFx0XHRjb25zdCBjb21wbGV4VHlwZU5hbWUgPSBlbnRpdHlQcm9wZXJ0eS50eXBlLnN1YnN0cigxMSwgZW50aXR5UHJvcGVydHkudHlwZS5sZW5ndGggLSAxMik7XG5cdFx0XHRcdFx0Y29uc3QgY29tcGxleFR5cGUgPSBvYmplY3RNYXBbY29tcGxleFR5cGVOYW1lXSBhcyBDb21wbGV4VHlwZTtcblx0XHRcdFx0XHRpZiAoY29tcGxleFR5cGUpIHtcblx0XHRcdFx0XHRcdChlbnRpdHlQcm9wZXJ0eSBhcyBQcm9wZXJ0eSkudGFyZ2V0VHlwZSA9IGNvbXBsZXhUeXBlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zdCBjb21wbGV4VHlwZSA9IG9iamVjdE1hcFtlbnRpdHlQcm9wZXJ0eS50eXBlXSBhcyBDb21wbGV4VHlwZTtcblx0XHRcdFx0XHRpZiAoY29tcGxleFR5cGUpIHtcblx0XHRcdFx0XHRcdChlbnRpdHlQcm9wZXJ0eSBhcyBQcm9wZXJ0eSkudGFyZ2V0VHlwZSA9IGNvbXBsZXhUeXBlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gcHJlcGFyZUNvbXBsZXhUeXBlcyhcblx0Y29tcGxleFR5cGVzOiBQYXJzZXJDb21wbGV4VHlwZVtdLFxuXHRhc3NvY2lhdGlvbnM6IEFzc29jaWF0aW9uW10sXG5cdG9iamVjdE1hcDogUmVjb3JkPHN0cmluZywgYW55PlxuKSB7XG5cdGNvbXBsZXhUeXBlcy5mb3JFYWNoKGNvbXBsZXhUeXBlID0+IHtcblx0XHQoY29tcGxleFR5cGUgYXMgQ29tcGxleFR5cGUpLmFubm90YXRpb25zID0ge307XG5cdFx0Y29tcGxleFR5cGUucHJvcGVydGllcy5mb3JFYWNoKHByb3BlcnR5ID0+IHtcblx0XHRcdGlmICghKHByb3BlcnR5IGFzIFByb3BlcnR5KS5hbm5vdGF0aW9ucykge1xuXHRcdFx0XHQocHJvcGVydHkgYXMgUHJvcGVydHkpLmFubm90YXRpb25zID0ge307XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0Y29tcGxleFR5cGUubmF2aWdhdGlvblByb3BlcnRpZXMgPSBjb21wbGV4VHlwZS5uYXZpZ2F0aW9uUHJvcGVydGllcy5tYXAobmF2UHJvcCA9PiB7XG5cdFx0XHRpZiAoIShuYXZQcm9wIGFzIE5hdmlnYXRpb25Qcm9wZXJ0eSkuYW5ub3RhdGlvbnMpIHtcblx0XHRcdFx0KG5hdlByb3AgYXMgTmF2aWdhdGlvblByb3BlcnR5KS5hbm5vdGF0aW9ucyA9IHt9O1xuXHRcdFx0fVxuXHRcdFx0Y29uc3Qgb3V0TmF2UHJvcDogUGFydGlhbDxOYXZpZ2F0aW9uUHJvcGVydHk+ID0ge1xuXHRcdFx0XHRfdHlwZTogXCJOYXZpZ2F0aW9uUHJvcGVydHlcIixcblx0XHRcdFx0bmFtZTogbmF2UHJvcC5uYW1lLFxuXHRcdFx0XHRmdWxseVF1YWxpZmllZE5hbWU6IG5hdlByb3AuZnVsbHlRdWFsaWZpZWROYW1lLFxuXHRcdFx0XHRwYXJ0bmVyOiAobmF2UHJvcCBhcyBhbnkpLmhhc093blByb3BlcnR5KFwicGFydG5lclwiKSA/IChuYXZQcm9wIGFzIGFueSkucGFydG5lciA6IHVuZGVmaW5lZCxcblx0XHRcdFx0Ly8gdGFyZ2V0VHlwZU5hbWU6IEZ1bGx5UXVhbGlmaWVkTmFtZTtcblx0XHRcdFx0Ly8gdGFyZ2V0VHlwZTogRW50aXR5VHlwZTtcblx0XHRcdFx0aXNDb2xsZWN0aW9uOiAobmF2UHJvcCBhcyBhbnkpLmhhc093blByb3BlcnR5KFwiaXNDb2xsZWN0aW9uXCIpID8gKG5hdlByb3AgYXMgYW55KS5pc0NvbGxlY3Rpb24gOiBmYWxzZSxcblx0XHRcdFx0Y29udGFpbnNUYXJnZXQ6IChuYXZQcm9wIGFzIGFueSkuaGFzT3duUHJvcGVydHkoXCJjb250YWluc1RhcmdldFwiKVxuXHRcdFx0XHRcdD8gKG5hdlByb3AgYXMgYW55KS5jb250YWluc1RhcmdldFxuXHRcdFx0XHRcdDogZmFsc2UsXG5cdFx0XHRcdHJlZmVyZW50aWFsQ29uc3RyYWludDogKG5hdlByb3AgYXMgYW55KS5yZWZlcmVudGlhbENvbnN0cmFpbnRcblx0XHRcdFx0XHQ/IChuYXZQcm9wIGFzIGFueSkucmVmZXJlbnRpYWxDb25zdHJhaW50XG5cdFx0XHRcdFx0OiBbXVxuXHRcdFx0fTtcblx0XHRcdGlmICgobmF2UHJvcCBhcyBHZW5lcmljTmF2aWdhdGlvblByb3BlcnR5KS50YXJnZXRUeXBlTmFtZSkge1xuXHRcdFx0XHRvdXROYXZQcm9wLnRhcmdldFR5cGUgPSBvYmplY3RNYXBbKG5hdlByb3AgYXMgVjROYXZpZ2F0aW9uUHJvcGVydHkpLnRhcmdldFR5cGVOYW1lXTtcblx0XHRcdH0gZWxzZSBpZiAoKG5hdlByb3AgYXMgVjJOYXZpZ2F0aW9uUHJvcGVydHkpLnJlbGF0aW9uc2hpcCkge1xuXHRcdFx0XHRjb25zdCB0YXJnZXRBc3NvY2lhdGlvbiA9IGFzc29jaWF0aW9ucy5maW5kKFxuXHRcdFx0XHRcdGFzc29jaWF0aW9uID0+IGFzc29jaWF0aW9uLmZ1bGx5UXVhbGlmaWVkTmFtZSA9PT0gKG5hdlByb3AgYXMgVjJOYXZpZ2F0aW9uUHJvcGVydHkpLnJlbGF0aW9uc2hpcFxuXHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAodGFyZ2V0QXNzb2NpYXRpb24pIHtcblx0XHRcdFx0XHRjb25zdCBhc3NvY2lhdGlvbkVuZCA9IHRhcmdldEFzc29jaWF0aW9uLmFzc29jaWF0aW9uRW5kLmZpbmQoXG5cdFx0XHRcdFx0XHRlbmQgPT4gZW5kLnJvbGUgPT09IChuYXZQcm9wIGFzIFYyTmF2aWdhdGlvblByb3BlcnR5KS50b1JvbGVcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGlmIChhc3NvY2lhdGlvbkVuZCkge1xuXHRcdFx0XHRcdFx0b3V0TmF2UHJvcC50YXJnZXRUeXBlID0gb2JqZWN0TWFwW2Fzc29jaWF0aW9uRW5kLnR5cGVdO1xuXHRcdFx0XHRcdFx0b3V0TmF2UHJvcC5pc0NvbGxlY3Rpb24gPSBhc3NvY2lhdGlvbkVuZC5tdWx0aXBsaWNpdHkgPT09IFwiKlwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKG91dE5hdlByb3AudGFyZ2V0VHlwZSkge1xuXHRcdFx0XHRvdXROYXZQcm9wLnRhcmdldFR5cGVOYW1lID0gb3V0TmF2UHJvcC50YXJnZXRUeXBlLmZ1bGx5UXVhbGlmaWVkTmFtZTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IG91dE5hdlByb3BSZXEgPSBvdXROYXZQcm9wIGFzIE5hdmlnYXRpb25Qcm9wZXJ0eTtcblx0XHRcdG9iamVjdE1hcFtvdXROYXZQcm9wUmVxLmZ1bGx5UXVhbGlmaWVkTmFtZV0gPSBvdXROYXZQcm9wUmVxO1xuXHRcdFx0cmV0dXJuIG91dE5hdlByb3BSZXE7XG5cdFx0fSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzcGxpdFRlcm0ocmVmZXJlbmNlczogUmVmZXJlbmNlc1dpdGhNYXAsIHRlcm1WYWx1ZTogc3RyaW5nKSB7XG5cdGNvbnN0IGFsaWFzZWRUZXJtID0gYWxpYXMocmVmZXJlbmNlcywgdGVybVZhbHVlKTtcblx0Y29uc3QgbGFzdERvdCA9IGFsaWFzZWRUZXJtLmxhc3RJbmRleE9mKFwiLlwiKTtcblx0bGV0IHRlcm1BbGlhcyA9IGFsaWFzZWRUZXJtLnN1YnN0cigwLCBsYXN0RG90KTtcblx0bGV0IHRlcm0gPSBhbGlhc2VkVGVybS5zdWJzdHIobGFzdERvdCArIDEpO1xuXHRyZXR1cm4gW3Rlcm1BbGlhcywgdGVybV07XG59XG5cbi8qKlxuICogUmVzb2x2ZSBhIHNwZWNpZmljIHBhdGhcbiAqIEBwYXJhbSBzUGF0aFxuICovXG5mdW5jdGlvbiBjcmVhdGVHbG9iYWxSZXNvbHZlKGNvbnZlcnRlZE91dHB1dDogQ29udmVydGVyT3V0cHV0LCBvYmplY3RNYXA6IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcblx0cmV0dXJuIGZ1bmN0aW9uIHJlc29sdmVQYXRoPFQgZXh0ZW5kcyBTZXJ2aWNlT2JqZWN0QW5kQW5ub3RhdGlvbj4oc1BhdGg6IHN0cmluZyk6IFJlc29sdXRpb25UYXJnZXQ8VD4ge1xuXHRcdGNvbnN0IGFQYXRoU3BsaXQgPSBzUGF0aC5zcGxpdChcIi9cIik7XG5cdFx0aWYgKGFQYXRoU3BsaXQuc2hpZnQoKSAhPT0gXCJcIikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGRlYWwgd2l0aCByZWxhdGl2ZSBwYXRoXCIpO1xuXHRcdH1cblx0XHRjb25zdCBlbnRpdHlTZXROYW1lID0gYVBhdGhTcGxpdC5zaGlmdCgpO1xuXHRcdGNvbnN0IGVudGl0eVNldCA9IGNvbnZlcnRlZE91dHB1dC5lbnRpdHlTZXRzLmZpbmQoZXQgPT4gZXQubmFtZSA9PT0gZW50aXR5U2V0TmFtZSk7XG5cdFx0aWYgKCFlbnRpdHlTZXQpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHRhcmdldDogY29udmVydGVkT3V0cHV0LmVudGl0eUNvbnRhaW5lcixcblx0XHRcdFx0b2JqZWN0UGF0aDogW2NvbnZlcnRlZE91dHB1dC5lbnRpdHlDb250YWluZXJdXG5cdFx0XHR9IGFzIFJlc29sdXRpb25UYXJnZXQ8VD47XG5cdFx0fVxuXHRcdGlmIChhUGF0aFNwbGl0Lmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dGFyZ2V0OiBlbnRpdHlTZXQsXG5cdFx0XHRcdG9iamVjdFBhdGg6IFtjb252ZXJ0ZWRPdXRwdXQuZW50aXR5Q29udGFpbmVyLCBlbnRpdHlTZXRdXG5cdFx0XHR9IGFzIFJlc29sdXRpb25UYXJnZXQ8VD47XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IHRhcmdldFJlc29sdXRpb246IGFueSA9IHJlc29sdmVUYXJnZXQob2JqZWN0TWFwLCBlbnRpdHlTZXQsIFwiL1wiICsgYVBhdGhTcGxpdC5qb2luKFwiL1wiKSwgZmFsc2UsIHRydWUpO1xuXHRcdFx0aWYgKHRhcmdldFJlc29sdXRpb24udGFyZ2V0KSB7XG5cdFx0XHRcdHRhcmdldFJlc29sdXRpb24udmlzaXRlZE9iamVjdHMucHVzaCh0YXJnZXRSZXNvbHV0aW9uLnRhcmdldCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR0YXJnZXQ6IHRhcmdldFJlc29sdXRpb24udGFyZ2V0LFxuXHRcdFx0XHRvYmplY3RQYXRoOiB0YXJnZXRSZXNvbHV0aW9uLnZpc2l0ZWRPYmplY3RzXG5cdFx0XHR9O1xuXHRcdH1cblx0fTtcbn1cblxubGV0IEFOTk9UQVRJT05fRVJST1JTOiB7IG1lc3NhZ2U6IHN0cmluZyB9W10gPSBbXTtcbmxldCBBTExfQU5OT1RBVElPTl9FUlJPUlM6IGFueSA9IHt9O1xuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFR5cGVzKHBhcnNlck91dHB1dDogUGFyc2VyT3V0cHV0KTogQ29udmVydGVyT3V0cHV0IHtcblx0QU5OT1RBVElPTl9FUlJPUlMgPSBbXTtcblx0Y29uc3Qgb2JqZWN0TWFwID0gYnVpbGRPYmplY3RNYXAocGFyc2VyT3V0cHV0KTtcblx0cmVzb2x2ZU5hdmlnYXRpb25Qcm9wZXJ0aWVzKFxuXHRcdHBhcnNlck91dHB1dC5zY2hlbWEuZW50aXR5VHlwZXMgYXMgRW50aXR5VHlwZVtdLFxuXHRcdHBhcnNlck91dHB1dC5zY2hlbWEuYXNzb2NpYXRpb25zLFxuXHRcdG9iamVjdE1hcFxuXHQpO1xuXHRpZiAoIShwYXJzZXJPdXRwdXQuc2NoZW1hLmVudGl0eUNvbnRhaW5lciBhcyBFbnRpdHlDb250YWluZXIpLmFubm90YXRpb25zKSB7XG5cdFx0KHBhcnNlck91dHB1dC5zY2hlbWEuZW50aXR5Q29udGFpbmVyIGFzIEVudGl0eUNvbnRhaW5lcikuYW5ub3RhdGlvbnMgPSB7fTtcblx0fVxuXHRsaW5rQWN0aW9uc1RvRW50aXR5VHlwZShwYXJzZXJPdXRwdXQuc2NoZW1hLm5hbWVzcGFjZSwgcGFyc2VyT3V0cHV0LnNjaGVtYS5hY3Rpb25zIGFzIEFjdGlvbltdLCBvYmplY3RNYXApO1xuXHRsaW5rRW50aXR5VHlwZVRvRW50aXR5U2V0KHBhcnNlck91dHB1dC5zY2hlbWEuZW50aXR5U2V0cyBhcyBFbnRpdHlTZXRbXSwgb2JqZWN0TWFwLCBwYXJzZXJPdXRwdXQucmVmZXJlbmNlcyk7XG5cdGxpbmtFbnRpdHlUeXBlVG9TaW5nbGV0b24ocGFyc2VyT3V0cHV0LnNjaGVtYS5zaW5nbGV0b25zIGFzIFNpbmdsZXRvbltdLCBvYmplY3RNYXAsIHBhcnNlck91dHB1dC5yZWZlcmVuY2VzKTtcblx0bGlua1Byb3BlcnRpZXNUb0NvbXBsZXhUeXBlcyhwYXJzZXJPdXRwdXQuc2NoZW1hLmVudGl0eVR5cGVzIGFzIEVudGl0eVR5cGVbXSwgb2JqZWN0TWFwKTtcblx0cHJlcGFyZUNvbXBsZXhUeXBlcyhwYXJzZXJPdXRwdXQuc2NoZW1hLmNvbXBsZXhUeXBlcyBhcyBDb21wbGV4VHlwZVtdLCBwYXJzZXJPdXRwdXQuc2NoZW1hLmFzc29jaWF0aW9ucywgb2JqZWN0TWFwKTtcblx0Y29uc3QgdG9SZXNvbHZlOiBSZXNvbHZlYWJsZVtdID0gW107XG5cdGNvbnN0IHVucmVzb2x2ZWRBbm5vdGF0aW9uczogQW5ub3RhdGlvbkxpc3RbXSA9IFtdO1xuXG5cdE9iamVjdC5rZXlzKHBhcnNlck91dHB1dC5zY2hlbWEuYW5ub3RhdGlvbnMpLmZvckVhY2goYW5ub3RhdGlvblNvdXJjZSA9PiB7XG5cdFx0cGFyc2VyT3V0cHV0LnNjaGVtYS5hbm5vdGF0aW9uc1thbm5vdGF0aW9uU291cmNlXS5mb3JFYWNoKGFubm90YXRpb25MaXN0ID0+IHtcblx0XHRcdGxldCBjdXJyZW50VGFyZ2V0TmFtZSA9IHVuYWxpYXMocGFyc2VyT3V0cHV0LnJlZmVyZW5jZXMsIGFubm90YXRpb25MaXN0LnRhcmdldCkgYXMgc3RyaW5nO1xuXHRcdFx0Y29uc3Qgb2JqZWN0TWFwRWxlbWVudCA9IG9iamVjdE1hcFtjdXJyZW50VGFyZ2V0TmFtZV07XG5cdFx0XHRpZiAoIW9iamVjdE1hcEVsZW1lbnQpIHtcblx0XHRcdFx0aWYgKGN1cnJlbnRUYXJnZXROYW1lICYmIGN1cnJlbnRUYXJnZXROYW1lLmluZGV4T2YoXCJAXCIpICE9PSAtMSkge1xuXHRcdFx0XHRcdChhbm5vdGF0aW9uTGlzdCBhcyBhbnkpLl9fc291cmNlID0gYW5ub3RhdGlvblNvdXJjZTtcblx0XHRcdFx0XHR1bnJlc29sdmVkQW5ub3RhdGlvbnMucHVzaChhbm5vdGF0aW9uTGlzdCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIG9iamVjdE1hcEVsZW1lbnQgPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0bGV0IGFsbFRhcmdldHMgPSBbb2JqZWN0TWFwRWxlbWVudF07XG5cdFx0XHRcdGxldCBiT3ZlcnJpZGVFeGlzdGluZyA9IHRydWU7XG5cdFx0XHRcdGlmIChvYmplY3RNYXBFbGVtZW50Ll90eXBlID09PSBcIlVuYm91bmRHZW5lcmljQWN0aW9uXCIpIHtcblx0XHRcdFx0XHRhbGxUYXJnZXRzID0gb2JqZWN0TWFwRWxlbWVudC5hY3Rpb25zO1xuXHRcdFx0XHRcdGJPdmVycmlkZUV4aXN0aW5nID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0YWxsVGFyZ2V0cy5mb3JFYWNoKGN1cnJlbnRUYXJnZXQgPT4ge1xuXHRcdFx0XHRcdGlmIChjdXJyZW50VGFyZ2V0TmFtZSAhPT0gY3VycmVudFRhcmdldC5mdWxseVF1YWxpZmllZE5hbWUpIHtcblx0XHRcdFx0XHRcdGN1cnJlbnRUYXJnZXROYW1lID0gY3VycmVudFRhcmdldC5mdWxseVF1YWxpZmllZE5hbWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICghY3VycmVudFRhcmdldC5hbm5vdGF0aW9ucykge1xuXHRcdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9ucyA9IHt9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRhbm5vdGF0aW9uTGlzdC5hbm5vdGF0aW9ucy5mb3JFYWNoKGFubm90YXRpb24gPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgW3ZvY0FsaWFzLCB2b2NUZXJtXSA9IHNwbGl0VGVybShkZWZhdWx0UmVmZXJlbmNlcywgYW5ub3RhdGlvbi50ZXJtKTtcblx0XHRcdFx0XHRcdGlmICghY3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc10pIHtcblx0XHRcdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc10gPSB7fTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICghY3VycmVudFRhcmdldC5hbm5vdGF0aW9ucy5fYW5ub3RhdGlvbnMpIHtcblx0XHRcdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9ucy5fYW5ub3RhdGlvbnMgPSB7fTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Y29uc3Qgdm9jVGVybVdpdGhRdWFsaWZpZXIgPSBgJHt2b2NUZXJtfSR7XG5cdFx0XHRcdFx0XHRcdGFubm90YXRpb24ucXVhbGlmaWVyID8gYCMke2Fubm90YXRpb24ucXVhbGlmaWVyfWAgOiBcIlwiXG5cdFx0XHRcdFx0XHR9YDtcblx0XHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdFx0IWJPdmVycmlkZUV4aXN0aW5nICYmXG5cdFx0XHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnM/Llt2b2NBbGlhc10/Llt2b2NUZXJtV2l0aFF1YWxpZmllcl0gIT09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXSA9IGNvbnZlcnRBbm5vdGF0aW9uKFxuXHRcdFx0XHRcdFx0XHRhbm5vdGF0aW9uIGFzIEFubm90YXRpb24sXG5cdFx0XHRcdFx0XHRcdHBhcnNlck91dHB1dCxcblx0XHRcdFx0XHRcdFx0Y3VycmVudFRhcmdldCxcblx0XHRcdFx0XHRcdFx0b2JqZWN0TWFwLFxuXHRcdFx0XHRcdFx0XHR0b1Jlc29sdmUsXG5cdFx0XHRcdFx0XHRcdGFubm90YXRpb25Tb3VyY2UsXG5cdFx0XHRcdFx0XHRcdHVucmVzb2x2ZWRBbm5vdGF0aW9uc1xuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdHN3aXRjaCAodHlwZW9mIGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXSkge1xuXHRcdFx0XHRcdFx0XHRjYXNlIFwic3RyaW5nXCI6XG5cdFx0XHRcdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdID0gbmV3IFN0cmluZyhcblx0XHRcdFx0XHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXVxuXHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdGNhc2UgXCJib29sZWFuXCI6XG5cdFx0XHRcdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdID0gbmV3IEJvb2xlYW4oXG5cdFx0XHRcdFx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl1cblx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl0gIT09IG51bGwgJiZcblx0XHRcdFx0XHRcdFx0dHlwZW9mIGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXSA9PT0gXCJvYmplY3RcIlxuXHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXS50ZXJtID0gdW5hbGlhcyhcblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0UmVmZXJlbmNlcyxcblx0XHRcdFx0XHRcdFx0XHRgJHt2b2NBbGlhc30uJHt2b2NUZXJtfWBcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdLnF1YWxpZmllciA9IGFubm90YXRpb24ucXVhbGlmaWVyO1xuXHRcdFx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl0uX19zb3VyY2UgPSBhbm5vdGF0aW9uU291cmNlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y29uc3QgYW5ub3RhdGlvblRhcmdldCA9IGAke2N1cnJlbnRUYXJnZXROYW1lfUAke3VuYWxpYXMoXG5cdFx0XHRcdFx0XHRcdGRlZmF1bHRSZWZlcmVuY2VzLFxuXHRcdFx0XHRcdFx0XHR2b2NBbGlhcyArIFwiLlwiICsgdm9jVGVybVdpdGhRdWFsaWZpZXJcblx0XHRcdFx0XHRcdCl9YDtcblx0XHRcdFx0XHRcdGlmIChhbm5vdGF0aW9uLmFubm90YXRpb25zICYmIEFycmF5LmlzQXJyYXkoYW5ub3RhdGlvbi5hbm5vdGF0aW9ucykpIHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgc3ViQW5ub3RhdGlvbkxpc3QgPSB7XG5cdFx0XHRcdFx0XHRcdFx0dGFyZ2V0OiBhbm5vdGF0aW9uVGFyZ2V0LFxuXHRcdFx0XHRcdFx0XHRcdGFubm90YXRpb25zOiBhbm5vdGF0aW9uLmFubm90YXRpb25zLFxuXHRcdFx0XHRcdFx0XHRcdF9fc291cmNlOiBhbm5vdGF0aW9uU291cmNlXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdHVucmVzb2x2ZWRBbm5vdGF0aW9ucy5wdXNoKHN1YkFubm90YXRpb25MaXN0KTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRcdFx0XHRcdGFubm90YXRpb24uYW5ub3RhdGlvbnMgJiZcblx0XHRcdFx0XHRcdFx0IWN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXS5hbm5vdGF0aW9uc1xuXHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXS5hbm5vdGF0aW9ucyA9XG5cdFx0XHRcdFx0XHRcdFx0YW5ub3RhdGlvbi5hbm5vdGF0aW9ucztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnMuX2Fubm90YXRpb25zW2Ake3ZvY0FsaWFzfS4ke3ZvY1Rlcm1XaXRoUXVhbGlmaWVyfWBdID1cblx0XHRcdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdO1xuXHRcdFx0XHRcdFx0b2JqZWN0TWFwW2Fubm90YXRpb25UYXJnZXRdID0gY3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSk7XG5cdGNvbnN0IGV4dHJhVW5yZXNvbHZlZEFubm90YXRpb25zOiBBbm5vdGF0aW9uTGlzdFtdID0gW107XG5cdHVucmVzb2x2ZWRBbm5vdGF0aW9ucy5mb3JFYWNoKGFubm90YXRpb25MaXN0ID0+IHtcblx0XHRjb25zdCBjdXJyZW50VGFyZ2V0TmFtZSA9IHVuYWxpYXMocGFyc2VyT3V0cHV0LnJlZmVyZW5jZXMsIGFubm90YXRpb25MaXN0LnRhcmdldCkgYXMgc3RyaW5nO1xuXHRcdGxldCBbYmFzZU9iaiwgYW5ub3RhdGlvblBhcnRdID0gY3VycmVudFRhcmdldE5hbWUuc3BsaXQoXCJAXCIpO1xuXHRcdGNvbnN0IHRhcmdldFNwbGl0ID0gYW5ub3RhdGlvblBhcnQuc3BsaXQoXCIvXCIpO1xuXHRcdGJhc2VPYmogPSBiYXNlT2JqICsgXCJAXCIgKyB0YXJnZXRTcGxpdFswXTtcblx0XHRjb25zdCBjdXJyZW50VGFyZ2V0ID0gdGFyZ2V0U3BsaXQuc2xpY2UoMSkucmVkdWNlKChjdXJyZW50T2JqLCBwYXRoKSA9PiB7XG5cdFx0XHRpZiAoIWN1cnJlbnRPYmopIHtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY3VycmVudE9ialtwYXRoXTtcblx0XHR9LCBvYmplY3RNYXBbYmFzZU9ial0pO1xuXHRcdGlmICghY3VycmVudFRhcmdldCkge1xuXHRcdFx0QU5OT1RBVElPTl9FUlJPUlMucHVzaCh7XG5cdFx0XHRcdG1lc3NhZ2U6IFwiVGhlIGZvbGxvd2luZyBhbm5vdGF0aW9uIHRhcmdldCB3YXMgbm90IGZvdW5kIG9uIHRoZSBzZXJ2aWNlIFwiICsgY3VycmVudFRhcmdldE5hbWVcblx0XHRcdH0pO1xuXHRcdFx0Ly8gY29uc29sZS5sb2coXCJNaXNzaW5nIHRhcmdldCBhZ2FpbiBcIiArIGN1cnJlbnRUYXJnZXROYW1lKTtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBjdXJyZW50VGFyZ2V0ID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRpZiAoIWN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnMpIHtcblx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9ucyA9IHt9O1xuXHRcdFx0fVxuXHRcdFx0YW5ub3RhdGlvbkxpc3QuYW5ub3RhdGlvbnMuZm9yRWFjaChhbm5vdGF0aW9uID0+IHtcblx0XHRcdFx0Y29uc3QgW3ZvY0FsaWFzLCB2b2NUZXJtXSA9IHNwbGl0VGVybShkZWZhdWx0UmVmZXJlbmNlcywgYW5ub3RhdGlvbi50ZXJtKTtcblx0XHRcdFx0aWYgKCFjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXSkge1xuXHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdID0ge307XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zLl9hbm5vdGF0aW9ucykge1xuXHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnMuX2Fubm90YXRpb25zID0ge307XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCB2b2NUZXJtV2l0aFF1YWxpZmllciA9IGAke3ZvY1Rlcm19JHthbm5vdGF0aW9uLnF1YWxpZmllciA/IGAjJHthbm5vdGF0aW9uLnF1YWxpZmllcn1gIDogXCJcIn1gO1xuXHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl0gPSBjb252ZXJ0QW5ub3RhdGlvbihcblx0XHRcdFx0XHRhbm5vdGF0aW9uIGFzIEFubm90YXRpb24sXG5cdFx0XHRcdFx0cGFyc2VyT3V0cHV0LFxuXHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQsXG5cdFx0XHRcdFx0b2JqZWN0TWFwLFxuXHRcdFx0XHRcdHRvUmVzb2x2ZSxcblx0XHRcdFx0XHQoYW5ub3RhdGlvbkxpc3QgYXMgYW55KS5fX3NvdXJjZSxcblx0XHRcdFx0XHRleHRyYVVucmVzb2x2ZWRBbm5vdGF0aW9uc1xuXHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdICE9PSBudWxsICYmXG5cdFx0XHRcdFx0dHlwZW9mIGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXSA9PT0gXCJvYmplY3RcIlxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHRjdXJyZW50VGFyZ2V0LmFubm90YXRpb25zW3ZvY0FsaWFzXVt2b2NUZXJtV2l0aFF1YWxpZmllcl0udGVybSA9IHVuYWxpYXMoXG5cdFx0XHRcdFx0XHRkZWZhdWx0UmVmZXJlbmNlcyxcblx0XHRcdFx0XHRcdGAke3ZvY0FsaWFzfS4ke3ZvY1Rlcm19YFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9uc1t2b2NBbGlhc11bdm9jVGVybVdpdGhRdWFsaWZpZXJdLnF1YWxpZmllciA9IGFubm90YXRpb24ucXVhbGlmaWVyO1xuXHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW1xuXHRcdFx0XHRcdFx0dm9jVGVybVdpdGhRdWFsaWZpZXJcblx0XHRcdFx0XHRdLl9fc291cmNlID0gKGFubm90YXRpb25MaXN0IGFzIGFueSkuX19zb3VyY2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y3VycmVudFRhcmdldC5hbm5vdGF0aW9ucy5fYW5ub3RhdGlvbnNbYCR7dm9jQWxpYXN9LiR7dm9jVGVybVdpdGhRdWFsaWZpZXJ9YF0gPVxuXHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXTtcblx0XHRcdFx0b2JqZWN0TWFwW2Ake2N1cnJlbnRUYXJnZXROYW1lfUAke3VuYWxpYXMoZGVmYXVsdFJlZmVyZW5jZXMsIHZvY0FsaWFzICsgXCIuXCIgKyB2b2NUZXJtV2l0aFF1YWxpZmllcil9YF0gPVxuXHRcdFx0XHRcdGN1cnJlbnRUYXJnZXQuYW5ub3RhdGlvbnNbdm9jQWxpYXNdW3ZvY1Rlcm1XaXRoUXVhbGlmaWVyXTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG5cdHRvUmVzb2x2ZS5mb3JFYWNoKHJlc29sdmVhYmxlID0+IHtcblx0XHRjb25zdCB0b1Jlc29sdmUgPSByZXNvbHZlYWJsZS50b1Jlc29sdmU7XG5cdFx0Y29uc3QgdGFyZ2V0U3RyID0gdG9SZXNvbHZlLiR0YXJnZXQ7XG5cdFx0Y29uc3QgcmVzb2x2ZWRUYXJnZXQgPSBvYmplY3RNYXBbdGFyZ2V0U3RyXTtcblx0XHRjb25zdCB7IGFubm90YXRpb25zVGVybSwgYW5ub3RhdGlvblR5cGUgfSA9IHRvUmVzb2x2ZTtcblx0XHRkZWxldGUgdG9SZXNvbHZlLmFubm90YXRpb25UeXBlO1xuXHRcdGRlbGV0ZSB0b1Jlc29sdmUuYW5ub3RhdGlvbnNUZXJtO1xuXG5cdFx0aWYgKHJlc29sdmVhYmxlLmlubGluZSAmJiAhKHJlc29sdmVkVGFyZ2V0IGluc3RhbmNlb2YgU3RyaW5nKSkge1xuXHRcdFx0Ly8gaW5saW5lIHRoZSByZXNvbHZlZCB0YXJnZXRcblx0XHRcdGxldCBrZXlzOiBrZXlvZiB0eXBlb2YgdG9SZXNvbHZlO1xuXHRcdFx0Zm9yIChrZXlzIGluIHRvUmVzb2x2ZSkgZGVsZXRlIHRvUmVzb2x2ZVtrZXlzXTtcblxuXHRcdFx0T2JqZWN0LmFzc2lnbih0b1Jlc29sdmUsIHJlc29sdmVkVGFyZ2V0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gYXNzaWduIHRoZSByZXNvbHZlZCB0YXJnZXRcblx0XHRcdHRvUmVzb2x2ZS4kdGFyZ2V0ID0gcmVzb2x2ZWRUYXJnZXQ7XG5cdFx0fVxuXG5cdFx0aWYgKCFyZXNvbHZlZFRhcmdldCkge1xuXHRcdFx0dG9SZXNvbHZlLnRhcmdldFN0cmluZyA9IHRhcmdldFN0cjtcblx0XHRcdGlmIChhbm5vdGF0aW9uc1Rlcm0gJiYgYW5ub3RhdGlvblR5cGUpIHtcblx0XHRcdFx0Y29uc3Qgb0Vycm9yTXNnID0ge1xuXHRcdFx0XHRcdG1lc3NhZ2U6XG5cdFx0XHRcdFx0XHRcIlVuYWJsZSB0byByZXNvbHZlIHRoZSBwYXRoIGV4cHJlc3Npb246IFwiICtcblx0XHRcdFx0XHRcdHRhcmdldFN0ciArXG5cdFx0XHRcdFx0XHRcIlxcblwiICtcblx0XHRcdFx0XHRcdFwiXFxuXCIgK1xuXHRcdFx0XHRcdFx0XCJIaW50OiBDaGVjayBhbmQgY29ycmVjdCB0aGUgcGF0aCB2YWx1ZXMgdW5kZXIgdGhlIGZvbGxvd2luZyBzdHJ1Y3R1cmUgaW4gdGhlIG1ldGFkYXRhIChhbm5vdGF0aW9uLnhtbCBmaWxlIG9yIENEUyBhbm5vdGF0aW9ucyBmb3IgdGhlIGFwcGxpY2F0aW9uKTogXFxuXFxuXCIgK1xuXHRcdFx0XHRcdFx0XCI8QW5ub3RhdGlvbiBUZXJtID0gXCIgK1xuXHRcdFx0XHRcdFx0YW5ub3RhdGlvbnNUZXJtICtcblx0XHRcdFx0XHRcdFwiPlwiICtcblx0XHRcdFx0XHRcdFwiXFxuXCIgK1xuXHRcdFx0XHRcdFx0XCI8UmVjb3JkIFR5cGUgPSBcIiArXG5cdFx0XHRcdFx0XHRhbm5vdGF0aW9uVHlwZSArXG5cdFx0XHRcdFx0XHRcIj5cIiArXG5cdFx0XHRcdFx0XHRcIlxcblwiICtcblx0XHRcdFx0XHRcdFwiPEFubm90YXRpb25QYXRoID0gXCIgK1xuXHRcdFx0XHRcdFx0dGFyZ2V0U3RyICtcblx0XHRcdFx0XHRcdFwiPlwiXG5cdFx0XHRcdH07XG5cdFx0XHRcdGFkZEFubm90YXRpb25FcnJvck1lc3NhZ2UodGFyZ2V0U3RyLCBvRXJyb3JNc2cpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgcHJvcGVydHkgPSB0b1Jlc29sdmUudGVybTtcblx0XHRcdFx0Y29uc3QgcGF0aCA9IHRvUmVzb2x2ZS5wYXRoO1xuXHRcdFx0XHRjb25zdCB0ZXJtSW5mbyA9IHRhcmdldFN0ciA/IHRhcmdldFN0ci5zcGxpdChcIi9cIilbMF0gOiB0YXJnZXRTdHI7XG5cdFx0XHRcdGNvbnN0IG9FcnJvck1zZyA9IHtcblx0XHRcdFx0XHRtZXNzYWdlOlxuXHRcdFx0XHRcdFx0XCJVbmFibGUgdG8gcmVzb2x2ZSB0aGUgcGF0aCBleHByZXNzaW9uOiBcIiArXG5cdFx0XHRcdFx0XHR0YXJnZXRTdHIgK1xuXHRcdFx0XHRcdFx0XCJcXG5cIiArXG5cdFx0XHRcdFx0XHRcIlxcblwiICtcblx0XHRcdFx0XHRcdFwiSGludDogQ2hlY2sgYW5kIGNvcnJlY3QgdGhlIHBhdGggdmFsdWVzIHVuZGVyIHRoZSBmb2xsb3dpbmcgc3RydWN0dXJlIGluIHRoZSBtZXRhZGF0YSAoYW5ub3RhdGlvbi54bWwgZmlsZSBvciBDRFMgYW5ub3RhdGlvbnMgZm9yIHRoZSBhcHBsaWNhdGlvbik6IFxcblxcblwiICtcblx0XHRcdFx0XHRcdFwiPEFubm90YXRpb24gVGVybSA9IFwiICtcblx0XHRcdFx0XHRcdHRlcm1JbmZvICtcblx0XHRcdFx0XHRcdFwiPlwiICtcblx0XHRcdFx0XHRcdFwiXFxuXCIgK1xuXHRcdFx0XHRcdFx0XCI8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eSA9IFwiICtcblx0XHRcdFx0XHRcdHByb3BlcnR5ICtcblx0XHRcdFx0XHRcdFwiICAgICAgICBQYXRoPSBcIiArXG5cdFx0XHRcdFx0XHRwYXRoICtcblx0XHRcdFx0XHRcdFwiPlwiXG5cdFx0XHRcdH07XG5cdFx0XHRcdGFkZEFubm90YXRpb25FcnJvck1lc3NhZ2UodGFyZ2V0U3RyLCBvRXJyb3JNc2cpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cdGZvciAodmFyIHByb3BlcnR5IGluIEFMTF9BTk5PVEFUSU9OX0VSUk9SUykge1xuXHRcdEFOTk9UQVRJT05fRVJST1JTLnB1c2goQUxMX0FOTk9UQVRJT05fRVJST1JTW3Byb3BlcnR5XVswXSk7XG5cdH1cblx0KHBhcnNlck91dHB1dCBhcyBhbnkpLmVudGl0eVNldHMgPSBwYXJzZXJPdXRwdXQuc2NoZW1hLmVudGl0eVNldHM7XG5cblx0Y29uc3QgY29udmVydGVkT3V0cHV0OiBQYXJ0aWFsPENvbnZlcnRlck91dHB1dD4gPSB7XG5cdFx0dmVyc2lvbjogcGFyc2VyT3V0cHV0LnZlcnNpb24sXG5cdFx0YW5ub3RhdGlvbnM6IHBhcnNlck91dHB1dC5zY2hlbWEuYW5ub3RhdGlvbnMsXG5cdFx0bmFtZXNwYWNlOiBwYXJzZXJPdXRwdXQuc2NoZW1hLm5hbWVzcGFjZSxcblx0XHRlbnRpdHlDb250YWluZXI6IHBhcnNlck91dHB1dC5zY2hlbWEuZW50aXR5Q29udGFpbmVyIGFzIEVudGl0eUNvbnRhaW5lcixcblx0XHRhY3Rpb25zOiBwYXJzZXJPdXRwdXQuc2NoZW1hLmFjdGlvbnMgYXMgQWN0aW9uW10sXG5cdFx0ZW50aXR5U2V0czogcGFyc2VyT3V0cHV0LnNjaGVtYS5lbnRpdHlTZXRzIGFzIEVudGl0eVNldFtdLFxuXHRcdHNpbmdsZXRvbnM6IHBhcnNlck91dHB1dC5zY2hlbWEuc2luZ2xldG9ucyBhcyBTaW5nbGV0b25bXSxcblx0XHRlbnRpdHlUeXBlczogcGFyc2VyT3V0cHV0LnNjaGVtYS5lbnRpdHlUeXBlcyBhcyBFbnRpdHlUeXBlW10sXG5cdFx0Y29tcGxleFR5cGVzOiBwYXJzZXJPdXRwdXQuc2NoZW1hLmNvbXBsZXhUeXBlcyBhcyBDb21wbGV4VHlwZVtdLFxuXHRcdHJlZmVyZW5jZXM6IGRlZmF1bHRSZWZlcmVuY2VzLFxuXHRcdGRpYWdub3N0aWNzOiBBTk5PVEFUSU9OX0VSUk9SUy5jb25jYXQoKVxuXHR9O1xuXHRjb252ZXJ0ZWRPdXRwdXQucmVzb2x2ZVBhdGggPSBjcmVhdGVHbG9iYWxSZXNvbHZlKGNvbnZlcnRlZE91dHB1dCBhcyBDb252ZXJ0ZXJPdXRwdXQsIG9iamVjdE1hcCk7XG5cdHJldHVybiBjb252ZXJ0ZWRPdXRwdXQgYXMgQ29udmVydGVyT3V0cHV0O1xufVxuXG5mdW5jdGlvbiByZXZlcnRWYWx1ZVRvR2VuZXJpY1R5cGUocmVmZXJlbmNlczogUmVmZXJlbmNlW10sIHZhbHVlOiBhbnkpOiBFeHByZXNzaW9uIHwgdW5kZWZpbmVkIHtcblx0bGV0IHJlc3VsdDogRXhwcmVzc2lvbiB8IHVuZGVmaW5lZDtcblx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdGNvbnN0IHZhbHVlTWF0Y2hlcyA9IHZhbHVlLm1hdGNoKC8oXFx3KylcXC5cXHcrXFwvLiovKTtcblx0XHRpZiAodmFsdWVNYXRjaGVzICYmIHJlZmVyZW5jZXMuZmluZChyZWYgPT4gcmVmLmFsaWFzID09PSB2YWx1ZU1hdGNoZXNbMV0pKSB7XG5cdFx0XHRyZXN1bHQgPSB7XG5cdFx0XHRcdHR5cGU6IFwiRW51bU1lbWJlclwiLFxuXHRcdFx0XHRFbnVtTWVtYmVyOiB2YWx1ZVxuXHRcdFx0fTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVzdWx0ID0ge1xuXHRcdFx0XHR0eXBlOiBcIlN0cmluZ1wiLFxuXHRcdFx0XHRTdHJpbmc6IHZhbHVlXG5cdFx0XHR9O1xuXHRcdH1cblx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdHJlc3VsdCA9IHtcblx0XHRcdHR5cGU6IFwiQ29sbGVjdGlvblwiLFxuXHRcdFx0Q29sbGVjdGlvbjogdmFsdWUubWFwKGFubm8gPT4gcmV2ZXJ0Q29sbGVjdGlvbkl0ZW1Ub0dlbmVyaWNUeXBlKHJlZmVyZW5jZXMsIGFubm8pKSBhcyBhbnlbXVxuXHRcdH07XG5cdH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIikge1xuXHRcdHJlc3VsdCA9IHtcblx0XHRcdHR5cGU6IFwiQm9vbFwiLFxuXHRcdFx0Qm9vbDogdmFsdWVcblx0XHR9O1xuXHR9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJudW1iZXJcIikge1xuXHRcdGlmICh2YWx1ZS50b1N0cmluZygpID09PSB2YWx1ZS50b0ZpeGVkKCkpIHtcblx0XHRcdHJlc3VsdCA9IHtcblx0XHRcdFx0dHlwZTogXCJJbnRcIixcblx0XHRcdFx0SW50OiB2YWx1ZVxuXHRcdFx0fTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVzdWx0ID0ge1xuXHRcdFx0XHR0eXBlOiBcIkRlY2ltYWxcIixcblx0XHRcdFx0RGVjaW1hbDogdmFsdWVcblx0XHRcdH07XG5cdFx0fVxuXHR9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZS5pc0RlY2ltYWwgJiYgdmFsdWUuaXNEZWNpbWFsKCkpIHtcblx0XHRyZXN1bHQgPSB7XG5cdFx0XHR0eXBlOiBcIkRlY2ltYWxcIixcblx0XHRcdERlY2ltYWw6IHZhbHVlLnZhbHVlT2YoKVxuXHRcdH07XG5cdH0gZWxzZSBpZiAodmFsdWUudHlwZSA9PT0gXCJQYXRoXCIpIHtcblx0XHRyZXN1bHQgPSB7XG5cdFx0XHR0eXBlOiBcIlBhdGhcIixcblx0XHRcdFBhdGg6IHZhbHVlLnBhdGhcblx0XHR9O1xuXHR9IGVsc2UgaWYgKHZhbHVlLnR5cGUgPT09IFwiQW5ub3RhdGlvblBhdGhcIikge1xuXHRcdHJlc3VsdCA9IHtcblx0XHRcdHR5cGU6IFwiQW5ub3RhdGlvblBhdGhcIixcblx0XHRcdEFubm90YXRpb25QYXRoOiB2YWx1ZS52YWx1ZVxuXHRcdH07XG5cdH0gZWxzZSBpZiAodmFsdWUudHlwZSA9PT0gXCJQcm9wZXJ0eVBhdGhcIikge1xuXHRcdHJlc3VsdCA9IHtcblx0XHRcdHR5cGU6IFwiUHJvcGVydHlQYXRoXCIsXG5cdFx0XHRQcm9wZXJ0eVBhdGg6IHZhbHVlLnZhbHVlXG5cdFx0fTtcblx0fSBlbHNlIGlmICh2YWx1ZS50eXBlID09PSBcIk5hdmlnYXRpb25Qcm9wZXJ0eVBhdGhcIikge1xuXHRcdHJlc3VsdCA9IHtcblx0XHRcdHR5cGU6IFwiTmF2aWdhdGlvblByb3BlcnR5UGF0aFwiLFxuXHRcdFx0TmF2aWdhdGlvblByb3BlcnR5UGF0aDogdmFsdWUudmFsdWVcblx0XHR9O1xuXHR9IGVsc2UgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgXCIkVHlwZVwiKSkge1xuXHRcdHJlc3VsdCA9IHtcblx0XHRcdHR5cGU6IFwiUmVjb3JkXCIsXG5cdFx0XHRSZWNvcmQ6IHJldmVydENvbGxlY3Rpb25JdGVtVG9HZW5lcmljVHlwZShyZWZlcmVuY2VzLCB2YWx1ZSkgYXMgQW5ub3RhdGlvblJlY29yZFxuXHRcdH07XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gcmV2ZXJ0Q29sbGVjdGlvbkl0ZW1Ub0dlbmVyaWNUeXBlKFxuXHRyZWZlcmVuY2VzOiBSZWZlcmVuY2VbXSxcblx0Y29sbGVjdGlvbkl0ZW06IGFueVxuKTpcblx0fCBBbm5vdGF0aW9uUmVjb3JkXG5cdHwgc3RyaW5nXG5cdHwgUHJvcGVydHlQYXRoRXhwcmVzc2lvblxuXHR8IFBhdGhFeHByZXNzaW9uXG5cdHwgTmF2aWdhdGlvblByb3BlcnR5UGF0aEV4cHJlc3Npb25cblx0fCBBbm5vdGF0aW9uUGF0aEV4cHJlc3Npb25cblx0fCB1bmRlZmluZWQge1xuXHRpZiAodHlwZW9mIGNvbGxlY3Rpb25JdGVtID09PSBcInN0cmluZ1wiKSB7XG5cdFx0cmV0dXJuIGNvbGxlY3Rpb25JdGVtO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBjb2xsZWN0aW9uSXRlbSA9PT0gXCJvYmplY3RcIikge1xuXHRcdGlmIChjb2xsZWN0aW9uSXRlbS5oYXNPd25Qcm9wZXJ0eShcIiRUeXBlXCIpKSB7XG5cdFx0XHQvLyBBbm5vdGF0aW9uIFJlY29yZFxuXHRcdFx0Y29uc3Qgb3V0SXRlbTogQW5ub3RhdGlvblJlY29yZCA9IHtcblx0XHRcdFx0dHlwZTogY29sbGVjdGlvbkl0ZW0uJFR5cGUsXG5cdFx0XHRcdHByb3BlcnR5VmFsdWVzOiBbXSBhcyBhbnlbXVxuXHRcdFx0fTtcblx0XHRcdC8vIENvdWxkIHZhbGlkYXRlIGtleXMgYW5kIHR5cGUgYmFzZWQgb24gJFR5cGVcblx0XHRcdE9iamVjdC5rZXlzKGNvbGxlY3Rpb25JdGVtKS5mb3JFYWNoKGNvbGxlY3Rpb25LZXkgPT4ge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0Y29sbGVjdGlvbktleSAhPT0gXCIkVHlwZVwiICYmXG5cdFx0XHRcdFx0Y29sbGVjdGlvbktleSAhPT0gXCJ0ZXJtXCIgJiZcblx0XHRcdFx0XHRjb2xsZWN0aW9uS2V5ICE9PSBcIl9fc291cmNlXCIgJiZcblx0XHRcdFx0XHRjb2xsZWN0aW9uS2V5ICE9PSBcInF1YWxpZmllclwiICYmXG5cdFx0XHRcdFx0Y29sbGVjdGlvbktleSAhPT0gXCJBY3Rpb25UYXJnZXRcIiAmJlxuXHRcdFx0XHRcdGNvbGxlY3Rpb25LZXkgIT09IFwiZnVsbHlRdWFsaWZpZWROYW1lXCIgJiZcblx0XHRcdFx0XHRjb2xsZWN0aW9uS2V5ICE9PSBcImFubm90YXRpb25zXCJcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0Y29uc3QgdmFsdWUgPSBjb2xsZWN0aW9uSXRlbVtjb2xsZWN0aW9uS2V5XTtcblx0XHRcdFx0XHRvdXRJdGVtLnByb3BlcnR5VmFsdWVzLnB1c2goe1xuXHRcdFx0XHRcdFx0bmFtZTogY29sbGVjdGlvbktleSxcblx0XHRcdFx0XHRcdHZhbHVlOiByZXZlcnRWYWx1ZVRvR2VuZXJpY1R5cGUocmVmZXJlbmNlcywgdmFsdWUpIGFzIEV4cHJlc3Npb25cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIGlmIChjb2xsZWN0aW9uS2V5ID09PSBcImFubm90YXRpb25zXCIpIHtcblx0XHRcdFx0XHRjb25zdCBhbm5vdGF0aW9ucyA9IGNvbGxlY3Rpb25JdGVtW2NvbGxlY3Rpb25LZXldO1xuXHRcdFx0XHRcdG91dEl0ZW0uYW5ub3RhdGlvbnMgPSBbXTtcblx0XHRcdFx0XHRPYmplY3Qua2V5cyhhbm5vdGF0aW9ucylcblx0XHRcdFx0XHRcdC5maWx0ZXIoa2V5ID0+IGtleSAhPT0gXCJfYW5ub3RhdGlvbnNcIilcblx0XHRcdFx0XHRcdC5mb3JFYWNoKGtleSA9PiB7XG5cdFx0XHRcdFx0XHRcdE9iamVjdC5rZXlzKGFubm90YXRpb25zW2tleV0pLmZvckVhY2godGVybSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgcGFyc2VkQW5ub3RhdGlvbiA9IHJldmVydFRlcm1Ub0dlbmVyaWNUeXBlKHJlZmVyZW5jZXMsIGFubm90YXRpb25zW2tleV1bdGVybV0pO1xuXHRcdFx0XHRcdFx0XHRcdGlmICghcGFyc2VkQW5ub3RhdGlvbi50ZXJtKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCB1bmFsaWFzZWRUZXJtID0gdW5hbGlhcyhyZWZlcmVuY2VzLCBgJHtrZXl9LiR7dGVybX1gKTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmICh1bmFsaWFzZWRUZXJtKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHF1YWxpZmllZFNwbGl0ID0gdW5hbGlhc2VkVGVybS5zcGxpdChcIiNcIik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHBhcnNlZEFubm90YXRpb24udGVybSA9IHF1YWxpZmllZFNwbGl0WzBdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAocXVhbGlmaWVkU3BsaXQubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHBhcnNlZEFubm90YXRpb24ucXVhbGlmaWVyID0gcXVhbGlmaWVkU3BsaXRbMV07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0b3V0SXRlbS5hbm5vdGF0aW9ucz8ucHVzaChwYXJzZWRBbm5vdGF0aW9uKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gb3V0SXRlbTtcblx0XHR9IGVsc2UgaWYgKGNvbGxlY3Rpb25JdGVtLnR5cGUgPT09IFwiUHJvcGVydHlQYXRoXCIpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHR5cGU6IFwiUHJvcGVydHlQYXRoXCIsXG5cdFx0XHRcdFByb3BlcnR5UGF0aDogY29sbGVjdGlvbkl0ZW0udmFsdWVcblx0XHRcdH07XG5cdFx0fSBlbHNlIGlmIChjb2xsZWN0aW9uSXRlbS50eXBlID09PSBcIkFubm90YXRpb25QYXRoXCIpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHR5cGU6IFwiQW5ub3RhdGlvblBhdGhcIixcblx0XHRcdFx0QW5ub3RhdGlvblBhdGg6IGNvbGxlY3Rpb25JdGVtLnZhbHVlXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSBpZiAoY29sbGVjdGlvbkl0ZW0udHlwZSA9PT0gXCJOYXZpZ2F0aW9uUHJvcGVydHlQYXRoXCIpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHR5cGU6IFwiTmF2aWdhdGlvblByb3BlcnR5UGF0aFwiLFxuXHRcdFx0XHROYXZpZ2F0aW9uUHJvcGVydHlQYXRoOiBjb2xsZWN0aW9uSXRlbS52YWx1ZVxuXHRcdFx0fTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJldmVydFRlcm1Ub0dlbmVyaWNUeXBlKHJlZmVyZW5jZXM6IFJlZmVyZW5jZVtdLCBhbm5vdGF0aW9uOiBBbm5vdGF0aW9uVGVybTxhbnk+KTogRWRtQW5ub3RhdGlvbiB7XG5cdGNvbnN0IGJhc2VBbm5vdGF0aW9uOiBFZG1Bbm5vdGF0aW9uID0ge1xuXHRcdHRlcm06IGFubm90YXRpb24udGVybSxcblx0XHRxdWFsaWZpZXI6IGFubm90YXRpb24ucXVhbGlmaWVyXG5cdH07XG5cdGlmIChBcnJheS5pc0FycmF5KGFubm90YXRpb24pKSB7XG5cdFx0Ly8gQ29sbGVjdGlvblxuXHRcdGlmIChhbm5vdGF0aW9uLmhhc093blByb3BlcnR5KFwiYW5ub3RhdGlvbnNcIikpIHtcblx0XHRcdGJhc2VBbm5vdGF0aW9uLmFubm90YXRpb25zID0gW107XG5cdFx0XHRjb25zdCBjdXJyZW50QW5ub3RhdGlvbnMgPSAoYW5ub3RhdGlvbiBhcyBhbnkpLmFubm90YXRpb25zO1xuXHRcdFx0T2JqZWN0LmtleXMoY3VycmVudEFubm90YXRpb25zKVxuXHRcdFx0XHQuZmlsdGVyKGtleSA9PiBrZXkgIT09IFwiX2Fubm90YXRpb25zXCIpXG5cdFx0XHRcdC5mb3JFYWNoKGtleSA9PiB7XG5cdFx0XHRcdFx0T2JqZWN0LmtleXMoY3VycmVudEFubm90YXRpb25zW2tleV0pLmZvckVhY2godGVybSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCBwYXJzZWRBbm5vdGF0aW9uID0gcmV2ZXJ0VGVybVRvR2VuZXJpY1R5cGUocmVmZXJlbmNlcywgY3VycmVudEFubm90YXRpb25zW2tleV1bdGVybV0pO1xuXHRcdFx0XHRcdFx0aWYgKCFwYXJzZWRBbm5vdGF0aW9uLnRlcm0pIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgdW5hbGlhc2VkVGVybSA9IHVuYWxpYXMocmVmZXJlbmNlcywgYCR7a2V5fS4ke3Rlcm19YCk7XG5cdFx0XHRcdFx0XHRcdGlmICh1bmFsaWFzZWRUZXJtKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgcXVhbGlmaWVkU3BsaXQgPSB1bmFsaWFzZWRUZXJtLnNwbGl0KFwiI1wiKTtcblx0XHRcdFx0XHRcdFx0XHRwYXJzZWRBbm5vdGF0aW9uLnRlcm0gPSBxdWFsaWZpZWRTcGxpdFswXTtcblx0XHRcdFx0XHRcdFx0XHRpZiAocXVhbGlmaWVkU3BsaXQubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cGFyc2VkQW5ub3RhdGlvbi5xdWFsaWZpZXIgPSBxdWFsaWZpZWRTcGxpdFsxXTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJhc2VBbm5vdGF0aW9uLmFubm90YXRpb25zPy5wdXNoKHBhcnNlZEFubm90YXRpb24pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdC4uLmJhc2VBbm5vdGF0aW9uLFxuXHRcdFx0Y29sbGVjdGlvbjogYW5ub3RhdGlvbi5tYXAoYW5ubyA9PiByZXZlcnRDb2xsZWN0aW9uSXRlbVRvR2VuZXJpY1R5cGUocmVmZXJlbmNlcywgYW5ubykpIGFzIGFueVtdXG5cdFx0fTtcblx0fSBlbHNlIGlmIChhbm5vdGF0aW9uLmhhc093blByb3BlcnR5KFwiJFR5cGVcIikpIHtcblx0XHRyZXR1cm4geyAuLi5iYXNlQW5ub3RhdGlvbiwgcmVjb3JkOiByZXZlcnRDb2xsZWN0aW9uSXRlbVRvR2VuZXJpY1R5cGUocmVmZXJlbmNlcywgYW5ub3RhdGlvbikgYXMgYW55IH07XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHsgLi4uYmFzZUFubm90YXRpb24sIHZhbHVlOiByZXZlcnRWYWx1ZVRvR2VuZXJpY1R5cGUocmVmZXJlbmNlcywgYW5ub3RhdGlvbikgfTtcblx0fVxufVxuIl19