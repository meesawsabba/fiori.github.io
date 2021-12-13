/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"../MacroMetadata",
		"sap/fe/core/converters/MetaModelConverter",
		"sap/fe/core/templating/UIFormatters",
		"sap/fe/core/helpers/BindingExpression",
		"sap/fe/core/templating/DataModelPathHelper",
		"sap/fe/macros/field/FieldTemplating",
		"sap/fe/core/TemplateModel",
		"sap/ui/model/json/JSONModel"
	],
	function(
		MacroMetadata,
		MetaModelConverter,
		UIFormatters,
		BindingExpression,
		DataModelPathHelper,
		FieldTemplating,
		TemplateModel,
		JSONModel
	) {
		"use strict";

		/**
		 * @classdesc
		 * Building block for creating a Field based on the provided OData V4 metadata..
		 * <br>
		 * Usually, a DataField or DataPoint annotation is expected, but the field can also be used to display a property from the entity type.
		 *
		 *
		 * Usage example:
		 * <pre>
		 * &lt;macro:Field
		 *   idPrefix="SomePrefix"
		 *   vhIdPrefix="SomeVhPrefix"
		 *   entitySet="{entitySet&gt;}"
		 *   dataField="{dataField&gt;}"
		 *   editMode="Editable"
		 * /&gt;
		 * </pre>
		 *
		 * @class sap.fe.macros.internal.Field
		 * @hideconstructor
		 * @private
		 * @experimental
		 */
		var Field = MacroMetadata.extend("sap.fe.macros.internal.Field", {
			/**
			 * Name of the macro control.
			 */
			name: "Field",
			/**
			 * Namespace of the macro control
			 */
			namespace: "sap.fe.macros.internal",
			/**
			 * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name
			 */
			fragment: "sap.fe.macros.internal.Field",

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
				designtime: "sap/fe/macros/internal/Field.designtime",
				/**
				 * Properties.
				 */
				properties: {
					/**
					 * Prefix added to the generated ID of the field
					 */
					idPrefix: {
						type: "string"
					},
					_apiId: {
						type: "string"
					},
					/**
					 * Prefix added to the generated ID of the value help used for the field
					 */
					vhIdPrefix: {
						type: "string",
						defaultValue: "FieldValueHelp"
					},

					_vhFlexId: {
						type: "string",
						computed: true
					},
					/**
					 * Metadata path to the entity set
					 */
					entitySet: {
						type: "sap.ui.model.Context",
						required: true,
						$kind: ["EntitySet", "NavigationProperty"]
					},

					/**
					 * Metadata path to the entity set
					 */
					entityType: {
						type: "sap.ui.model.Context",
						required: false,
						computed: true,
						$kind: ["EntityType"]
					},
					/**
					 * Flag indicating whether action will navigate after execution
					 */
					navigateAfterAction: {
						type: "boolean",
						defaultValue: true
					},
					/**
					 * Metadata path to the dataField.
					 * This property is usually a metadataContext pointing to a DataField having
					 * $Type of DataField, DataFieldWithUrl, DataFieldForAnnotation, DataFieldForAction, DataFieldForIntentBasedNavigation, DataFieldWithNavigationPath, or DataPointType.
					 * But it can also be a Property with $kind="Property"
					 */
					dataField: {
						type: "sap.ui.model.Context",
						required: true,
						$kind: "Property",
						$Type: [
							"com.sap.vocabularies.UI.v1.DataField",
							"com.sap.vocabularies.UI.v1.DataFieldWithUrl",
							"com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
							"com.sap.vocabularies.UI.v1.DataFieldForAction",
							"com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
							"com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath",
							"com.sap.vocabularies.UI.v1.DataPointType"
						]
					},

					/**
					 * Context pointing to an array of the property's semantic objects
					 */
					semanticObjects: {
						type: "sap.ui.model.Context",
						required: false,
						computed: true
					},
					// /**
					//  * Context pointing to BLA
					//  */
					// internalContext: {
					// 	type: "sap.ui.model.Context",
					// 	required: false,
					// 	computed: true
					// },

					/**
					 * Edit Mode of the field.
					 *
					 * If the editMode is undefined then we compute it based on the metadata
					 * Otherwise we use the value provided here.
					 */
					editMode: {
						type: "sap.ui.mdc.enum.EditMode"
					},
					/**
					 * Wrap field
					 */
					wrap: {
						type: "boolean"
					},
					/**
					 * CSS class for margin
					 */
					"class": {
						type: "string"
					},
					/**
					 * Property added to associate the label with the Field
					 */
					ariaLabelledBy: {
						type: "string"
					},
					editableExpression: {
						type: "string",
						computed: true
					},
					enabledExpression: {
						type: "string",
						computed: true
					},
					/**
					 * Option to add a semantic object to a field
					 */
					semanticObject: {
						type: "string",
						required: false
					},
					formatOptions: {
						type: "object",
						properties: {
							/**
							 * format value for Date fields, eg. long, medium, short
							 */
							valueFormat: {
								type: "string"
							},
							/**
							 * Describe how the alignment works between Table mode (Date and Numeric End alignment) and Form mode (numeric aligned End in edit and Begin in display)
							 */
							textAlignMode: {
								type: "string",
								defaultValue: "Table",
								allowedValues: ["Table", "Form"]
							},
							displayMode: {
								type: "string",
								allowedValues: ["Value", "Description", "ValueDescription", "DescriptionValue"]
							},
							measureDisplayMode: {
								type: "string",
								allowedValues: ["Hidden", "ReadOnly"]
							},
							/**
							 * Maximum number of lines for multiline texts in edit mode
							 */
							textLinesEdit: {
								type: "number",
								configurable: true
							},
							/**
							 * Maximum number of lines that multiline texts in edit mode can grow to
							 */
							textMaxLines: {
								type: "number",
								configurable: true
							},
							/**
							 * Maximum number of characters from the beginning of the text field that are shown initially.
							 */
							textMaxCharactersDisplay: {
								type: "number",
								configurable: true
							},
							/**
							 * Defines how the full text will be displayed - InPlace or Popover
							 */
							textExpandBehaviorDisplay: {
								type: "string",
								allowedValues: ["InPlace", "Popover"]
							},
							/**
							 * If set to 'true', SAP Fiori elements shows an empty indicator in display mode for the text and links
							 */
							showEmptyIndicator: {
								type: "boolean",
								defaultValue: false
							},
							/**
							 * Preferred control if a semanticKey is used (if the semanticKey is empty, no specific rules apply)
							 */
							semanticKeyStyle: {
								type: "string",
								defaultValue: "",
								allowedValues: ["ObjectIdentifier", "Label", ""]
							},
							hasDraftIndicator: {
								type: "boolean",
								defaultValue: false
							},
							/**
							 * If true then sets the given icon instead of text in Action/IBN Button
							 */
							showIconUrl: {
								type: "boolean",
								defaultValue: false
							},
							/**
							 * If true then navigationavailable property will not be used for enablement of IBN button
							 */
							ignoreNavigationAvailable: {
								type: "boolean",
								defaultValue: false
							},
							isAnalytics: {
								type: "boolean",
								defaultValue: false
							}
						}
					}
				},

				events: {
					/**
					 * Event handler for change event
					 */
					onChange: {
						type: "function"
					}
				}
			},
			create: function(oProps, oControlConfiguration, mSettings) {
				var oOverrideProps = this.getOverrides(oControlConfiguration, oProps.dataField.getPath());

				var oDataFieldConverted = MetaModelConverter.convertMetaModelContext(oProps.dataField);
				var oDataModelPath = MetaModelConverter.getInvolvedDataModelObjects(oProps.dataField, oProps.entitySet);
				var oPropertyPath = oDataFieldConverted;
				var sExtraPath = "";
				var oAnnotations,
					sSemObjExpression,
					aSemObjkeys = [],
					aSemObjExprToResolve = [];
				// data point annotations need not have $Type defined, so add it if missing
				if (oDataFieldConverted && oDataFieldConverted.term === "com.sap.vocabularies.UI.v1.DataPoint") {
					oDataFieldConverted.$Type = oDataFieldConverted.$Type || "com.sap.vocabularies.UI.v1.DataPointType";
				}
				if (oDataFieldConverted && oDataFieldConverted.$Type) {
					switch (oDataFieldConverted.$Type) {
						case "com.sap.vocabularies.UI.v1.DataField":
						case "com.sap.vocabularies.UI.v1.DataPointType":
						case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
						case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
							if (typeof oDataFieldConverted.Value === "object") {
								oPropertyPath = oDataFieldConverted.Value.$target;
								sExtraPath = oDataFieldConverted.Value.path;
								oAnnotations =
									oDataFieldConverted.Value.$target &&
									oDataFieldConverted.Value.$target.annotations &&
									oDataFieldConverted.Value.$target.annotations.Common;
								if (oAnnotations) {
									aSemObjkeys = Object.keys(oAnnotations).filter(function(element) {
										return element === "SemanticObject" || element.startsWith("SemanticObject#");
									});
									for (var iSemObjCount = 0; iSemObjCount < aSemObjkeys.length; iSemObjCount++) {
										sSemObjExpression = BindingExpression.compileBinding(
											BindingExpression.annotationExpression(
												oDataFieldConverted.Value.$target.annotations &&
													oDataFieldConverted.Value.$target.annotations.Common[aSemObjkeys[iSemObjCount]]
											)
										);
										aSemObjExprToResolve.push({
											key:
												sSemObjExpression.indexOf("{") === -1
													? sSemObjExpression
													: sSemObjExpression.split("{")[1].split("}")[0],
											value: sSemObjExpression
										});
									}
								}
							}
							break;
						case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
							if (oDataFieldConverted.Target.$target) {
								switch (oDataFieldConverted.Target.$target.$Type) {
									case "com.sap.vocabularies.UI.v1.DataField":
									case "com.sap.vocabularies.UI.v1.DataPointType":
										if (typeof oDataFieldConverted.Target.$target.Value === "object") {
											oPropertyPath = oDataFieldConverted.Target.$target.Value.$target;
											sExtraPath = oDataFieldConverted.Target.$target.Value.path;
										}
										break;
									default:
										if (typeof oDataFieldConverted.Target === "object") {
											oPropertyPath = oDataFieldConverted.Target.$target;
											sExtraPath = oDataFieldConverted.Target.path;
										}
										break;
								}
							}
							break;
					}
				} else if (oDataFieldConverted && oDataFieldConverted._type === "Property") {
					var oAnnotations = oDataFieldConverted.annotations && oDataFieldConverted.annotations.Common;
					if (oAnnotations) {
						aSemObjkeys = Object.keys(oAnnotations).filter(function(element) {
							return element === "SemanticObject" || element.startsWith("SemanticObject#");
						});
						for (var iSemObjCount = 0; iSemObjCount < aSemObjkeys.length; iSemObjCount++) {
							sSemObjExpression = BindingExpression.compileBinding(
								BindingExpression.annotationExpression(oDataFieldConverted.annotations.Common[aSemObjkeys[iSemObjCount]])
							);
							aSemObjExprToResolve.push({
								key:
									sSemObjExpression.indexOf("{") === -1
										? sSemObjExpression
										: sSemObjExpression.split("{")[1].split("}")[0],
								value: sSemObjExpression
							});
						}
					}
				}
				/**
				 * If the public field building block has a binding expression in the custom semantic objects,
				 * it gets stored to the custom data of the Link in LinkWithQuickViewForm.fragment.xml
				 * This is needed to resolve it at runtime. The QuickViewLinkDelegate.js then gets the resolved
				 * binding expression from the custom data.
				 * All other custom semantic objects are processed in FieldHelper.js:computeLinkParameters
				 */
				if (!!oProps.semanticObject && oProps.semanticObject[0] === "{") {
					aSemObjExprToResolve.push({
						key: oProps.semanticObject.substr(1, oProps.semanticObject.length - 2),
						value: oProps.semanticObject
					});
				}

				oProps.visible = FieldTemplating.getVisibleExpression(oDataModelPath, oProps.formatOptions);
				if (sExtraPath && sExtraPath.length > 0) {
					oDataModelPath = DataModelPathHelper.enhanceDataModelPath(oDataModelPath, sExtraPath);
				}

				oProps.dataSourcePath = DataModelPathHelper.getTargetObjectPath(oDataModelPath);
				var oMetaModel = mSettings.models.metaModel || mSettings.models.entitySet;
				oProps.entityType = oMetaModel.createBindingContext("/" + oDataModelPath.targetEntityType.fullyQualifiedName);
				var oPropertyForFieldControl = oPropertyPath && oPropertyPath.Value ? oPropertyPath.Value : oPropertyPath;
				if (oProps.editMode !== undefined && oProps.editMode !== null) {
					// Even if it provided as a string it's a valid part of a binding expression that can be later combined into something else.
					oProps.editModeAsObject = oProps.editMode;
				} else {
					var bMeasureReadOnly = oProps.formatOptions.measureDisplayMode
						? oProps.formatOptions.measureDisplayMode === "ReadOnly"
						: false;

					oProps.editModeAsObject = UIFormatters.getEditMode(
						oPropertyForFieldControl,
						oDataModelPath,
						bMeasureReadOnly,
						true,
						oDataFieldConverted
					);
					oProps.editMode = BindingExpression.compileBinding(oProps.editModeAsObject);
				}
				oProps.editableExpression = UIFormatters.getEditableExpression(
					oPropertyForFieldControl,
					oDataFieldConverted,
					oDataModelPath
				);
				oProps.enabledExpression = UIFormatters.getEnabledExpression(oPropertyForFieldControl, oDataFieldConverted);
				if (!oProps.formatOptions.displayMode) {
					oProps.formatOptions.displayMode = UIFormatters.getDisplayMode(oPropertyPath, oDataModelPath, oProps.editModeAsObject);
				}
				oProps.formatOptions.textLinesEdit =
					oOverrideProps.textLinesEdit ||
					(oOverrideProps.formatOptions && oOverrideProps.formatOptions.textLinesEdit) ||
					oProps.formatOptions.textLinesEdit ||
					4;
				oProps.formatOptions.textMaxLines =
					oOverrideProps.textMaxLines ||
					(oOverrideProps.formatOptions && oOverrideProps.formatOptions.textMaxLines) ||
					oProps.formatOptions.textMaxLines;

				if (oProps._flexId) {
					oProps._apiId = oProps._flexId;
					oProps._flexId += "-content";
					oProps._vhFlexId = oProps._flexId + "_" + oProps.vhIdPrefix;
				}
				oProps.displayStyle = FieldTemplating.getDisplayStyle(
					oPropertyPath,
					oDataFieldConverted,
					oDataModelPath,
					oProps.formatOptions,
					oProps.semanticObject
				);
				oProps.editStyle = FieldTemplating.getEditStyle(oPropertyPath, oDataFieldConverted, oProps.formatOptions);

				var aDisplayStylesWithoutPropText = ["Avatar", "AmountWithCurrency", "ObjectIdentifier"];
				if (oProps.displayStyle && aDisplayStylesWithoutPropText.indexOf(oProps.fieldStyle) === -1 && oDataModelPath.targetObject) {
					oProps.text = FieldTemplating.getTextBinding(oDataModelPath, oProps.formatOptions);
				} else {
					oProps.text = "";
				}
				oProps.valueBindingExpression = FieldTemplating.getValueBinding(oDataModelPath, oProps.formatOptions);
				oProps.descriptionBindingExpression = FieldTemplating.getValueBinding(
					oDataModelPath,
					oProps.formatOptions,
					false,
					false,
					undefined,
					false,
					true
				);
				oProps.valueAsStringBindingExpression = FieldTemplating.getValueBinding(
					oDataModelPath,
					oProps.formatOptions,
					true,
					true,
					undefined,
					true
				);
				if (oDataModelPath.targetObject) {
					oProps.unitBindingExpression = FieldTemplating.getUnitBinding(oDataModelPath, oProps.formatOptions);
					oProps.textBindingExpression = FieldTemplating.getAssociatedTextBinding(oDataModelPath, oProps.formatOptions);
				}
				var oDataFieldObject = oProps.dataField.getObject();
				oProps.formatOptions.navigationAvailable = true;
				if (
					oDataFieldObject &&
					oDataFieldObject.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" &&
					oDataFieldObject.NavigationAvailable !== undefined &&
					oProps.formatOptions.ignoreNavigationAvailable !== "true"
				) {
					if (oDataFieldObject.NavigationAvailable.$Path) {
						oProps.formatOptions.navigationAvailable = "{" + oDataFieldObject.NavigationAvailable.$Path + "}";
					} else {
						oProps.formatOptions.navigationAvailable = oDataFieldObject.NavigationAvailable;
					}
				}

				// data point annotations need not have $Type defined, so add it if missing
				if (
					oProps.dataField.getObject("@sapui.name") &&
					oProps.dataField.getObject("@sapui.name").indexOf("com.sap.vocabularies.UI.v1.DataPoint") > -1
				) {
					var oDataPoint = oProps.dataField.getObject();
					oDataPoint.$Type = oDataPoint.$Type || "com.sap.vocabularies.UI.v1.DataPointType";
					oProps.dataField = new TemplateModel(oDataPoint, oProps.dataField.getModel()).createBindingContext("/");
				}

				if (aSemObjExprToResolve.length > 0) {
					var sCustomDataKey,
						sCustomDataValue,
						aSemObjCustomData = [];
					for (var iSemObjCount = 0; iSemObjCount < aSemObjExprToResolve.length; iSemObjCount++) {
						sCustomDataKey = aSemObjExprToResolve[iSemObjCount].key;
						sCustomDataValue = BindingExpression.compileBinding(
							BindingExpression.annotationExpression(aSemObjExprToResolve[iSemObjCount].value)
						);
						aSemObjCustomData.push({
							key: sCustomDataKey,
							value: sCustomDataValue
						});
					}
					var oSemanticObjectsModel = new JSONModel(aSemObjCustomData);
					oSemanticObjectsModel.$$valueAsPromise = true;
					var oSemObjBindingContext = oSemanticObjectsModel.createBindingContext("/");
					oProps.semanticObjects = oSemObjBindingContext;
				} else {
					oProps.semanticObjects = new JSONModel([]).createBindingContext("/");
				}
				//oProps.internalContext = "";
				return oProps;
			}
		});
		return Field;
	}
);
