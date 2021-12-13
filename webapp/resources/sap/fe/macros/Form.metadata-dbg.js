/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"./MacroMetadata",
		"sap/fe/core/converters/ConverterContext",
		"sap/fe/core/converters/controls/Common/Form",
		"sap/fe/core/TemplateModel",
		"sap/ui/model/odata/v4/AnnotationHelper",
		"sap/fe/core/converters/MetaModelConverter",
		"sap/fe/core/helpers/BindingExpression",
		"sap/fe/core/converters/helpers/BindingHelper"
	],
	function(
		MacroMetadata,
		ConverterContext,
		FormConverter,
		TemplateModel,
		AnnotationHelper,
		MetaModelConverter,
		BindingExpression,
		BindingHelper
	) {
		"use strict";

		var compileBinding = BindingExpression.compileBinding;
		var ifElse = BindingExpression.ifElse;
		var equal = BindingExpression.equal;
		var resolveBindingString = BindingExpression.resolveBindingString;
		/**
		 * @classdesc
		 * Building block for creating a Form based on the provided OData V4 metadata.
		 *
		 *
		 * Usage example:
		 * <pre>
		 * &lt;macro:Form
		 *  id="SomeID"
		 *  entitySet="{entitySet>}"
		 *  facet="{facet>}"
		 *  formTitle="someTitle"
		 *  useFormContainerLabels="true"
		 *  partOfPreview="true"
		 *  onChange=".handlers.onFieldValueChange"
		 * /&gt;
		 * </pre>
		 *
		 * @class sap.fe.macros.Form
		 * @hideconstructor
		 * @private
		 * @experimental
		 */
		var Form = MacroMetadata.extend("sap.fe.macros.Form", {
			/**
			 * Name of the macro control.
			 */
			name: "Form",
			/**
			 * Namespace of the macro control
			 */
			namespace: "sap.fe.macros",
			/**
			 * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name
			 */
			fragment: "sap.fe.macros.Form",

			/**
			 * The metadata describing the macro control.
			 */
			metadata: {
				/**
				 * Define macro stereotype for documentation
				 */
				stereotype: "xmlmacro",
				/**
				 * Location of the designtime info
				 */
				designtime: "sap/fe/macros/Form.designtime",
				/**
				 * Properties.
				 */
				properties: {
					/**
					 * mandatory context to the EntitySet // ~ contextPath
					 */
					entitySet: {
						type: "sap.ui.model.Context",
						required: true,
						$kind: ["NavigationProperty", "EntitySet"]
					},
					_editable: {
						type: "boolean",
						computed: true
					},
					/**
					 * Metadata path to the facet // ~ metaPath
					 */
					facet: {
						type: "sap.ui.model.Context",
						$Type: ["com.sap.vocabularies.UI.v1.CollectionFacet", "com.sap.vocabularies.UI.v1.ReferenceFacet"]
					},
					/**
					 * Source of the facet
					 */
					facetSource: {
						type: "string"
					},
					/**
					 * ID of the form
					 */
					id: {
						type: "string"
					},
					/**
					 * Title of the form
					 */
					formTitle: {
						type: "string"
					},
					/**
					 * Control the layout for the QuickViewPage.
					 */
					layoutMode: {
						type: "string",
						defaultValue: "ColumnLayout",
						allowedValues: ["ColumnLayout", "ResponsiveGridLayout"]
					},
					/**
					 * Control the CSS Margin Classes.
					 */
					"class": {
						type: "string",
						defaultValue: ""
					},
					/**
					 * Control whether the form is in displayMOde or not.
					 */
					displayMode: {
						type: "boolean"
					},
					/**
					 * Control the rendering of the form container labels
					 */
					useFormContainerLabels: {
						type: "string"
					},
					/**
					 * Toggle Preview: Part of Preview / Preview via 'Show More' Button
					 */
					partOfPreview: {
						type: "boolean",
						defaultValue: true
					},
					/**
					 * The manifest defined form containers to be shown in the action area of the table
					 */
					formContainers: {
						type: "sap.ui.model.Context"
					}
				},
				events: {
					/**
					 * Change handler name
					 */
					onChange: {
						type: "function"
					}
				}
			},
			create: function(oProps, oControlConfiguration, mSettings) {
				if (oProps.facet && oProps.entitySet && (oProps.formContainers === undefined || oProps.formContainers === null)) {
					var aFormContainers;
					// TODO: Standalone usage of form macro
					var oMetaModel = oProps.entitySet.getModel();
					// the curious case of entity set for quick view forms
					if (oProps.facet.getPath().indexOf("@com.sap.vocabularies.UI.v1.QuickViewFacets") > -1) {
						var oContextObjectPath = MetaModelConverter.getInvolvedDataModelObjects(oProps.facet, oProps.entitySet);
						var oConverterContext = this.getConverterContext(oContextObjectPath, oProps.entitySet, mSettings);
						var oFacetDefinition = oContextObjectPath.targetObject;
						/*
						 * To get quickview links working as they create macro forms
						 */
						// TODO have a generic function for getting form containers from facet - collection or reference
						aFormContainers = [FormConverter.getFormContainer(oFacetDefinition, oConverterContext)];
						oProps.formContainers = new TemplateModel(aFormContainers, oMetaModel).createBindingContext("/");
					}
				}
				// if displayMode === true -> _editable = false
				// if displayMode === false -> _editable = true
				//  => if displayMode === {myBindingValue} -> _editable = {myBindingValue} === true ? true : false
				// if DisplayMode === undefined -> _editable = {ui>/isEditable}
				if (oProps.displayMode !== undefined) {
					oProps._editable = compileBinding(
						ifElse(equal(resolveBindingString(oProps.displayMode, "boolean"), false), true, false)
					);
				} else {
					oProps._editable = compileBinding(BindingHelper.UI.IsEditable);
				}
				return oProps;
			}
		});

		return Form;
	}
);
