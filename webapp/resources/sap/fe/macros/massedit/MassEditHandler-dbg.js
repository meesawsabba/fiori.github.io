/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

/*
 * Static class that contains different methods for the mass edit dialog:
 * => For opening the dialog.
 * => For adding initial data to the dialog by assigning the static JSON Model, or assigning the runtime model to the dialog for handling changes.
 * => For adding default values to dialog fields (those values that appear when the dialog is loaded for the first time).
 * => For defining the implementation for the 'Save' and 'Cancel' buttons in the mass edit dialog.
 */
sap.ui.define(
	[
		"sap/m/Dialog",
		"sap/ui/core/XMLTemplateProcessor",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/Fragment",
		"sap/ui/core/util/XMLPreprocessor",
		"sap/fe/core/templating/UIFormatters",
		"sap/fe/core/converters/MetaModelConverter",
		"sap/fe/macros/field/FieldHelper",
		"sap/fe/macros/field/FieldTemplating",
		"sap/fe/core/helpers/BindingExpression",
		"sap/fe/core/CommonUtils",
		"sap/fe/core/templating/FieldControlHelper"
	],
	function(
		Dialog,
		XMLTemplateProcessor,
		JSONModel,
		Fragment,
		XMLPreprocessor,
		UIFormatters,
		MetaModelConverter,
		FieldHelper,
		FieldTemplating,
		BindingExpression,
		CommonUtils,
		FieldControlHelper
	) {
		"use strict";

		/**
		 * Method to get unique values for given array values.
		 *
		 * @param {string} sValue Property value
		 * @param {number} index Index of the property value
		 * @param {Array} self Instance of the array
		 * @returns {boolean}
		 */
		function getUniqueValues(sValue, index, self) {
			if (sValue) {
				return self.indexOf(sValue) === index;
			}
		}

		/**
		 * Gets the property value for a multi-level path (for example: _Materials/Material_Details gets the value of Material_Details under _Materials Object).
		 * Returns the propertyValue, which can be of any type (string, number, etc..).
		 *
		 * @param {string} sDataPropertyPath Property path
		 * @param {object} oValues Object of property values
		 * @returns {*}
		 */
		function getValueForMultiLevelPath(sDataPropertyPath, oValues) {
			if (sDataPropertyPath && sDataPropertyPath.indexOf("/") > 0) {
				var aPropertyPaths = sDataPropertyPath.split("/"),
					Result;
				aPropertyPaths.forEach(function(sPath) {
					Result = oValues && oValues[sPath] ? oValues[sPath] : Result && Result[sPath];
				});
				return Result;
			}
		}

		/**
		 * Gets the key path for the key of a combo box that must be selected initially when the dialog opens:
		 * => If propertyValue for all selected contexts is different, then < Keep Existing Values > is preselected.
		 * => If propertyValue for all selected contexts is the same, then the propertyValue is preselected.
		 * => If propertyValue for all selected contexts is empty, then < Leave Blank > is preselected.
		 *
		 *
		 * @param {object} oTable Instance of the table
		 * @param {string} sDataPropertyPath Data property path
		 * @returns {string}
		 */
		function getDefaultSelectionPathComboBox(oTable, sDataPropertyPath) {
			if (sDataPropertyPath && oTable) {
				var oSelectedContext = oTable.getSelectedContexts(),
					aPropertyValues = [];
				oSelectedContext.forEach(function(oContext) {
					var oDataObject = oContext.getObject();
					var sMultiLevelPathCondition =
						sDataPropertyPath.indexOf("/") > -1 && oDataObject.hasOwnProperty(sDataPropertyPath.split("/")[0]);
					if (oContext && (oDataObject.hasOwnProperty(sDataPropertyPath) || sMultiLevelPathCondition)) {
						aPropertyValues.push(oContext.getObject(sDataPropertyPath));
					}
				});
				var aUniquePropertyValues = aPropertyValues.filter(getUniqueValues);
				if (aUniquePropertyValues.length > 1) {
					return "Default/" + sDataPropertyPath;
				} else if (aUniquePropertyValues.length === 0) {
					return "Empty/" + sDataPropertyPath;
				} else if (aUniquePropertyValues.length === 1) {
					return sDataPropertyPath;
				}
			}
		}

		/**
		 * Adds a suffix to the 'keep existing' property of the comboBox.
		 *
		 * @param {object} oTable Instance of the table
		 * @param {string} sPropertyPath Data property path of respective column
		 * @returns {string}
		 */
		function getSuffixForKeepExisiting(oTable, sPropertyPath) {
			var oCurrentColumn =
					oTable &&
					oTable.getColumns().filter(function(oColumn) {
						return oColumn.getDataProperty() === sPropertyPath;
					}),
				sResult = "Values";
			if (oCurrentColumn.length) {
				var oColumn = oCurrentColumn[0],
					sInputType =
						oColumn.getTemplate().getContent &&
						oColumn.getTemplate().getContent().getContentEdit &&
						oColumn
							.getTemplate()
							.getContent()
							.getContentEdit() &&
						oColumn
							.getTemplate()
							.getContent()
							.getContentEdit()[0] &&
						oColumn
							.getTemplate()
							.getContent()
							.getContentEdit()[0]
							.getMetadata()
							.getName();
				switch (sInputType) {
					//TODO - Add for other control types as well (Radio Button, Email, Input, MDC Fields, Image etc.)
					case "sap.m.DatePicker":
						sResult = "Dates";
						break;
					case "sap.m.CheckBox":
						sResult = "Settings";
						break;
				}
			}
			return sResult;
		}

		/**
		 * Adds default values to the model [Keep Existing Values, Leave Blank].
		 * @param {Array} aValues Array instance where the default data needs to be added
		 * @param {object} oTable Instance of the table
		 * @param {string} sPropertyPath Property path
		 * @param {object} oDefaultValues Default values from Application Manifest
		 * @param {boolean} bPropertyRequired The property value can be set to null or not
		 * @param bUOMField
		 */
		function setDefaultValuesToDialog(aValues, oTable, sPropertyPath, oDefaultValues, bPropertyRequired, bUOMField) {
			var sSuffixForKeepExisting = getSuffixForKeepExisiting(oTable, sPropertyPath);
			//TODO - Add <<Use Value Help or control implmentation>> and related key by checking if value help is enabled for property or Unit.
			//TODO - Add option Apply to Empty Fields only for Both Value Help and controls.
			var bValueExistsForPropertyPath = oTable.getSelectedContexts().some(function(oSelectedContext) {
				return oSelectedContext.getObject(sPropertyPath);
			});
			if (bValueExistsForPropertyPath) {
				if (bPropertyRequired !== true && !bUOMField) {
					aValues.unshift({ text: oDefaultValues.clearFieldValue, key: "ClearFieldValue/" + sPropertyPath });
				}
			} else {
				aValues.unshift({ text: oDefaultValues.leaveBlankValue, key: "Empty/" + sPropertyPath });
			}
			aValues.unshift({
				text: oDefaultValues.keepExistingPrefix + " " + sSuffixForKeepExisting + " >",
				key: "Default/" + sPropertyPath
			});
		}

		/**
		 * Initializes the value at final or deepest level path with a blank array.
		 * Return an empty array pointing to the final or deepest level path.
		 *
		 * @param {string} sPath Property path
		 * @param {Array} aValues Array instance where the default data needs to be added
		 * @returns {Array}
		 */
		function initLastLevelOfPropertyPath(sPath, aValues) {
			var aFinalPath,
				index = 0,
				aPaths = sPath.split("/"),
				sFullPath = "";
			aPaths.forEach(function(sPropertyPath) {
				if (!aValues[sPropertyPath] && index === 0) {
					aValues[sPropertyPath] = {};
					aFinalPath = aValues[sPropertyPath];
					sFullPath = sFullPath + sPropertyPath;
					index++;
				} else if (!aFinalPath[sPropertyPath]) {
					sFullPath = sFullPath + "/" + sPropertyPath;
					if (sFullPath !== sPath) {
						aFinalPath[sPropertyPath] = {};
						aFinalPath = aFinalPath[sPropertyPath];
					} else {
						aFinalPath[sPropertyPath] = [];
					}
				}
			});
			return aFinalPath;
		}

		/**
		 * Checks hidden annotation value [both static and path based] for table's selected context.
		 *
		 * @param {*} hiddenValue Hidden annotation value / path for field
		 * @param {object} oTable Instance of the table
		 * @returns {boolean}
		 */
		function getHiddenValueForContexts(hiddenValue, oTable) {
			if (hiddenValue && hiddenValue.$Path) {
				return !(
					oTable &&
					oTable.getSelectedContexts().some(function(oSelectedContext) {
						return oSelectedContext.getObject(hiddenValue.$Path) === false;
					})
				);
			}
			return hiddenValue;
		}

		/**
		 * Returns the text binding for value help texts in the 'Mass Edit' dialog
		 *
		 * @param {string} sProperty Data or unit property
		 * @param {object} oTextBinding The text binding information for the given property
		 * @param {object} oTable Instance of the table
		 * @param {string} sCurrentEntitySetName Current entity set name
		 * @param {object} oSelectedContext The selected context of the table
		 * @returns {*}
		 */

		function getTextArrangementInfo(sProperty, oTextBinding, oTable, sCurrentEntitySet, oSelectedContext) {
			var oMetaModel = oTable.getModel().getMetaModel();
			var sDisplayMode = CommonUtils.computeDisplayMode(oMetaModel.getObject(sCurrentEntitySet + "/" + sProperty + "@"));
			var sDescriptionPath, sValue, sDescriptionValue, sFullText;
			if (oTextBinding && (oTextBinding.path || (oTextBinding.parameters && oTextBinding.parameters.length)) && sProperty) {
				if (oTextBinding.path) {
					if (sDisplayMode === "Description") {
						sValue = oSelectedContext.getObject(sProperty);
						sDescriptionValue = oSelectedContext.getObject(oTextBinding.path);
						sFullText = sDescriptionValue;
					} else if (sDisplayMode === "Value") {
						sValue = oSelectedContext.getObject(sProperty);
						sFullText = sValue;
					}
				} else if (oTextBinding.parameters) {
					oTextBinding.parameters.forEach(function(oProps) {
						if (oProps.path && oProps.path !== sProperty) {
							sDescriptionPath = oProps.path;
						}
					});
					sValue = oSelectedContext.getObject(sProperty);
					sDescriptionValue = oSelectedContext.getObject(sDescriptionPath);
					if (sDisplayMode === "ValueDescription" && sValue && sDescriptionValue) {
						sFullText = sValue + " (" + sDescriptionValue + ")";
					} else if (sDisplayMode === "DescriptionValue" && sDescriptionValue && sValue) {
						sFullText = sDescriptionValue + " (" + sValue + ")";
					}
				}
				return {
					"textArrangement": sDisplayMode,
					"valuePath": sProperty,
					"descriptionPath": sDescriptionPath,
					"value": sValue,
					"description": sDescriptionValue,
					"fullText": sFullText
				};
			}
			return false;
		}

		/**
		 * Initializes a JSON Model for properties of dialog fields [label, visiblity, dataproperty, etc.]
		 *
		 * @param {object} oDataModelObjectPath Instance of dataModelObjectPath
		 * @param {object} oTable Instance of the table
		 * @param {object} oMetaModel Instance of the metamodel
		 * @param {string} sCurrentEntitySetName Current entity set name
		 * @param {Array} aTableFields Relative table fields
		 * @param {Array} aDataArray Array containing data related to the dialog used by both the static and the runtime model
		 * @returns {object}
		 */

		function prepareDataForDialog(oDataModelObjectPath, oTable, oMetaModel, sCurrentEntitySetName, aTableFields, aDataArray) {
			var oDataFieldModel = new JSONModel(),
				sDataPropertyPath,
				oResult,
				sLabelText,
				oPropertyInfo,
				bValueHelpEnabled,
				sUnitPropertyPath,
				bValueHelpEnabledForUnit,
				oPropertyInfo,
				bIsImmutable,
				bIsComputed,
				oTextBinding;
			aTableFields.forEach(function(oColumnInfo) {
				sDataPropertyPath = oColumnInfo.dataProperty;
				if (sDataPropertyPath) {
					oPropertyInfo = sDataPropertyPath && oMetaModel.getObject(sCurrentEntitySetName + "/" + sDataPropertyPath + "@");
					bValueHelpEnabled =
						sDataPropertyPath &&
						oMetaModel.getObject(sCurrentEntitySetName + "/" + sDataPropertyPath + "@") &&
						oMetaModel.getObject(sCurrentEntitySetName + "/" + sDataPropertyPath + "@")[
							"@com.sap.vocabularies.Common.v1.ValueList"
						];
					sUnitPropertyPath =
						(oPropertyInfo &&
							oPropertyInfo["@Org.OData.Measures.V1.Unit"] &&
							oPropertyInfo["@Org.OData.Measures.V1.Unit"].$Path) ||
						(oPropertyInfo &&
							oPropertyInfo["@Org.OData.Measures.V1.ISOCurrency"] &&
							oPropertyInfo["@Org.OData.Measures.V1.ISOCurrency"].$Path);
					sLabelText = oColumnInfo.label || (oPropertyInfo && oPropertyInfo["@com.sap.vocabularies.Common.v1.Label"]);
					bValueHelpEnabledForUnit =
						sUnitPropertyPath &&
						oMetaModel.getObject(sCurrentEntitySetName + "/" + sUnitPropertyPath + "@") &&
						oMetaModel.getObject(sCurrentEntitySetName + "/" + sUnitPropertyPath + "@")[
							"@com.sap.vocabularies.Common.v1.ValueList"
						];
					if (oDataModelObjectPath) {
						oDataModelObjectPath.targetObject = oDataModelObjectPath.targetEntityType.entityProperties.filter(function(
							oProperty
						) {
							return oProperty.name === sDataPropertyPath;
						});
					}
					oDataModelObjectPath.targetObject = oDataModelObjectPath.targetObject[0] || {};
					oTextBinding = FieldTemplating.getTextBinding(oDataModelObjectPath, undefined, true) || {};
					var oFieldContext = oMetaModel.getContext(oColumnInfo.annotationPath),
						oDataFieldConverted = MetaModelConverter.convertMetaModelContext(oFieldContext),
						oPropertyContext = oMetaModel.getContext(sCurrentEntitySetName + "/" + sDataPropertyPath + "@"),
						oInterface = oPropertyContext && oPropertyContext.getInterface();
					bIsImmutable =
						oPropertyContext &&
						oPropertyContext.getProperty() &&
						oPropertyContext.getProperty()["@Org.OData.Core.V1.Immutable"];
					bIsComputed =
						oPropertyContext && oPropertyContext.getProperty() && oPropertyContext.getProperty()["@Org.OData.Core.V1.Computed"];
					var bHiddenField =
						getHiddenValueForContexts(
							oFieldContext && oFieldContext.getObject()["@com.sap.vocabularies.UI.v1.Hidden"],
							oTable
						) || false;
					oInterface.context = {
						getModel: function() {
							return oInterface.getModel();
						},
						getPath: function() {
							return sCurrentEntitySetName + "/" + sDataPropertyPath;
						}
					};
					var oFieldControl = FieldHelper.fieldControl(sDataPropertyPath, oInterface);
					oPropertyInfo =
						(oDataFieldConverted && oDataFieldConverted.Value && oDataFieldConverted.Value.$target) ||
						(oDataFieldConverted && oDataFieldConverted.Target && oDataFieldConverted.Target.$target);
					var isReadOnlyExpression = FieldControlHelper.isReadOnlyExpression(oPropertyInfo);
					if (
						sDataPropertyPath &&
						!bHiddenField &&
						!bIsImmutable &&
						!bIsComputed &&
						UIFormatters.getEditableExpression(oPropertyInfo, oDataFieldConverted, oDataModelObjectPath) !== "false"
					) {
						oResult = {
							"label": sLabelText + ":",
							"visible":
								sDataPropertyPath &&
								!bHiddenField &&
								!bIsImmutable &&
								!bIsComputed &&
								UIFormatters.getEditableExpression(oPropertyInfo, oDataFieldConverted, oDataModelObjectPath),
							"dataProperty": sDataPropertyPath,
							"isValueHelpEnabled": bValueHelpEnabled ? bValueHelpEnabled : false,
							"unitProperty": sUnitPropertyPath ? sUnitPropertyPath : false,
							"isValueHelpEnabledForUnit": bValueHelpEnabledForUnit ? bValueHelpEnabledForUnit : false,
							"propertyPathForValueHelp": sCurrentEntitySetName + "/" + sDataPropertyPath,
							"propertyPathForValueHelpUnit": sCurrentEntitySetName + "/" + sUnitPropertyPath,
							"isFieldRequired": FieldHelper.getRequiredForDataField(oFieldControl, "Editable"),
							"defaultSelectionPath": sDataPropertyPath ? getDefaultSelectionPathComboBox(oTable, sDataPropertyPath) : false,
							"defaultSelectionUnitPath": sUnitPropertyPath
								? getDefaultSelectionPathComboBox(oTable, sUnitPropertyPath)
								: false,
							"entitySet": sCurrentEntitySetName,
							"textBinding": oTextBinding,
							"nullable": oPropertyInfo.nullable !== undefined ? oPropertyInfo.nullable : true,
							"isPropertyReadOnly": isReadOnlyExpression !== undefined ? isReadOnlyExpression : false
						};
						aDataArray.push(oResult);
					}
				}
			});
			oDataFieldModel.setData(aDataArray);
			return oDataFieldModel;
		}

		/**
		 * Initializes a runtime model:
		 * => The model consists of values shown in the comboBox of the dialog (Leave Blank, Keep Existing Values, or any property value for the selected context, etc.)
		 * => The model will capture runtime changes in the results property (the value entered in the comboBox).
		 *
		 * @param {object} oTable Instance of the table
		 * @param {Array} aDataArray Array containing data related to the dialog used by both the static and the runtime model
		 * @param {object} oDefaultValues Default values from i18n
		 * @returns {object}
		 */
		function setRuntimeModelOnDialog(oTable, aDataArray, oDefaultValues) {
			var aValues = [],
				aUnitData = [],
				aResults = [],
				aReadOnlyFieldInfo = [],
				oSelectedContext = oTable.getSelectedContexts(),
				oDistinctValueMap = {},
				sPropertyName;
			aDataArray.forEach(function(oData) {
				if (oData.dataProperty && oData.dataProperty.indexOf("/") > -1) {
					var aFinalPath = initLastLevelOfPropertyPath(oData.dataProperty, aValues),
						aPropertyPaths = oData.dataProperty.split("/"),
						sPropertyKey;
					for (var i = 0; i < oSelectedContext.length; i++) {
						var sMultiLevelPathValue = oSelectedContext[i].getObject(oData.dataProperty);
						sPropertyKey = oData.dataProperty + "/" + sMultiLevelPathValue;
						if (!oDistinctValueMap[sPropertyKey] && aFinalPath[aPropertyPaths[aPropertyPaths.length - 1]]) {
							var oTextInfo = getTextArrangementInfo(
								oData.dataProperty,
								oData.textBinding,
								oTable,
								oData.entitySet,
								oSelectedContext[i]
							);
							aFinalPath[aPropertyPaths[aPropertyPaths.length - 1]].push({
								"text": (oTextInfo && oTextInfo.fullText) || sMultiLevelPathValue,
								"key": oData.dataProperty,
								"textInfo": oTextInfo
							});
							oDistinctValueMap[sPropertyKey] = sMultiLevelPathValue;
						}
					}
				} else {
					aValues[oData.dataProperty] = aValues[oData.dataProperty] || [];
					if (oData.unitProperty) {
						aUnitData[oData.unitProperty] = aUnitData[oData.unitProperty] || [];
					}
					for (var i = 0; i < oSelectedContext.length; i++) {
						var oDataObject = oSelectedContext[i].getObject();
						sPropertyName = oData.dataProperty + "/" + oDataObject[oData.dataProperty];
						if (oData.dataProperty && oDataObject[oData.dataProperty] && !oDistinctValueMap[sPropertyName]) {
							var oTextInfo = getTextArrangementInfo(
								oData.dataProperty,
								oData.textBinding,
								oTable,
								oData.entitySet,
								oSelectedContext[i]
							);
							aValues[oData.dataProperty].push({
								"text": (oTextInfo && oTextInfo.fullText) || oDataObject[oData.dataProperty],
								"key": oData.dataProperty,
								"textInfo": oTextInfo
							});
							oDistinctValueMap[sPropertyName] = oDataObject[oData.dataProperty];
						}
						if (oData.unitProperty && oDataObject[oData.unitProperty]) {
							sPropertyName = oData.unitProperty + "/" + oDataObject[oData.unitProperty];
							if (!oDistinctValueMap[sPropertyName]) {
								var oTextInfo = getTextArrangementInfo(
									oData.unitProperty,
									oData.textBinding,
									oTable,
									oData.entitySet,
									oSelectedContext[i]
								);
								aUnitData[oData.unitProperty].push({
									"text": (oTextInfo && oTextInfo.fullText) || oDataObject[oData.unitProperty],
									"key": oData.unitProperty,
									"textInfo": oTextInfo
								});
								oDistinctValueMap[sPropertyName] = oDataObject[oData.unitProperty];
							}
						}
					}
				}
			});
			aDataArray.forEach(function(oData) {
				if (oData.dataProperty.indexOf("/") > -1) {
					var sMultiLevelPropPathValue = getValueForMultiLevelPath(oData.dataProperty, aValues);
					if (!sMultiLevelPropPathValue) {
						sMultiLevelPropPathValue.push({ text: oDefaultValues.leaveBlankValue, key: "Empty/" + oData.dataProperty });
					} else {
						setDefaultValuesToDialog(
							sMultiLevelPropPathValue,
							oTable,
							oData.dataProperty,
							oDefaultValues,
							oData.isFieldRequired
						);
					}
				} else if (aValues[oData.dataProperty] && aValues[oData.dataProperty].length) {
					setDefaultValuesToDialog(
						aValues[oData.dataProperty],
						oTable,
						oData.dataProperty,
						oDefaultValues,
						oData.isFieldRequired
					);
				}
				if (aUnitData[oData.unitProperty] && aUnitData[oData.unitProperty].length) {
					setDefaultValuesToDialog(
						aUnitData[oData.unitProperty],
						oTable,
						oData.unitProperty,
						oDefaultValues,
						oData.isFieldRequired,
						true
					);
				} else if (
					(oData.dataProperty && aValues[oData.dataProperty] && !aValues[oData.dataProperty].length) ||
					(oData.unitProperty && aUnitData[oData.unitProperty] && !aUnitData[oData.unitProperty].length)
				) {
					var bClearFieldOrBlankValueExists =
						aValues[oData.dataProperty] &&
						aValues[oData.dataProperty].some(function(obj) {
							return obj.text === "< Clear Values >" || obj.text === "< Leave Blank >";
						});
					if (oData.dataProperty && !bClearFieldOrBlankValueExists) {
						aValues[oData.dataProperty].push({ text: oDefaultValues.leaveBlankValue, key: "Empty/" + oData.dataProperty });
					}
					var bClearFieldOrBlankUnitValueExists =
						aUnitData[oData.unitProperty] &&
						aUnitData[oData.unitProperty].some(function(obj) {
							return obj.text === "< Clear Values >" || obj.text === "< Leave Blank >";
						});
					if (oData.unitProperty && !bClearFieldOrBlankUnitValueExists) {
						aUnitData[oData.unitProperty].push({ text: oDefaultValues.leaveBlankValue, key: "Empty/" + oData.unitProperty });
					}
				}
				if (oData.isPropertyReadOnly && typeof oData.isPropertyReadOnly === "boolean") {
					aReadOnlyFieldInfo.push({ "property": oData.dataProperty, value: oData.isPropertyReadOnly, type: "Default" });
				} else if (oData.isPropertyReadOnly && oData.isPropertyReadOnly.operand1 && oData.isPropertyReadOnly.operand2) {
					aReadOnlyFieldInfo.push({
						"property": oData.dataProperty,
						propertyPath: oData.isPropertyReadOnly.operand1.path,
						propertyValue: oData.isPropertyReadOnly.operand2.value,
						type: "Path"
					});
				}
			});
			var oData = { "values": aValues, "unitData": aUnitData, "results": aResults, "readablePropertyData": aReadOnlyFieldInfo };
			var oDialogDataModel = new JSONModel(oData);
			return oDialogDataModel;
		}

		/**
		 * The following operations are performed by method openMassEditDialog:
		 * => Opens the mass edit dialog.
		 * => Implements the save and cancel functionality.
		 * => Sets the runtime model to the dialog.
		 * => Sets the static model's context to the dialog.
		 *
		 * @param {object} oTable Instance of the table
		 * @param {object} oController Instance of the controller
		 * @returns {object}
		 */
		function openMassEditDialog(oTable, oController) {
			var sFragmentName = "sap/fe/macros/massedit/MassEditDialog",
				oMetaModel = oTable && oTable.getModel().getMetaModel(),
				aDataArray = [],
				sCurrentEntitySetName = oTable.data("metaPath"),
				oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.macros"),
				oSelectedContextLength = oTable.getSelectedContexts().length,
				oDefaultValues = {
					"keepExistingPrefix": "< Keep",
					"leaveBlankValue": "< Leave Blank >",
					"clearFieldValue": "< Clear Values >",
					"massEditTitle": oResourceBundle.getText("C_MASS_EDIT_DIALOG_TITLE", oSelectedContextLength),
					"applyButtonText": oResourceBundle.getText("C_MASS_EDIT_APPLY_BUTTON_TEXT"),
					"cancelButtonText": oResourceBundle.getText("C_MASS_EDIT_CANCEL_BUTTON_TEXT")
				},
				aTableFields = [],
				oExtensionAPI = oController.getExtensionAPI();
			oTable &&
				oTable.getColumns().forEach(function(oColumn) {
					var sDataProperty = oColumn && oColumn.getDataProperty(),
						aRealtedColumnInfo =
							oTable.data("columns") &&
							oTable.data("columns").customData.filter(function(oColumnInfo) {
								return oColumnInfo.name === sDataProperty && oColumnInfo.type === "Annotation";
							});
					aTableFields.push({
						"dataProperty": sDataProperty,
						"label": oColumn.getHeader(),
						"annotationPath": aRealtedColumnInfo && aRealtedColumnInfo[0] && aRealtedColumnInfo[0].annotationPath
					});
				});
			var oEntityTypeContext = oMetaModel.getContext(sCurrentEntitySetName + "/@"),
				oDataModelObjectPath = MetaModelConverter.getInvolvedDataModelObjects(oEntityTypeContext),
				oDataFieldModel = prepareDataForDialog(
					oDataModelObjectPath,
					oTable,
					oMetaModel,
					sCurrentEntitySetName,
					aTableFields,
					aDataArray,
					oDataFieldModel
				),
				oDialogDataModel = setRuntimeModelOnDialog(oTable, aDataArray, oDefaultValues);

			return new Promise(function(resolve, reject) {
				var oFragment = XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment");
				return Promise.resolve(
					XMLPreprocessor.process(
						oFragment,
						{ name: sFragmentName },
						{
							bindingContexts: {
								dataFieldModel: oDataFieldModel.createBindingContext("/")
							},
							models: {
								dataFieldModel: oDataFieldModel
							}
						}
					)
				)
					.then(function(oFragment) {
						return Fragment.load({ definition: oFragment }).then(function(oDialogContent) {
							var oDialog = new Dialog({
								title: oDefaultValues.massEditTitle,
								content: [oDialogContent],
								beginButton: {
									text: oDefaultValues.applyButtonText,
									type: "Emphasized",
									press: function(oEvent) {
										var oDialog = oEvent.getSource().getParent(),
											oModel = oDialog.getModel("fieldsInfo"),
											aResults = oModel.getProperty("/results"),
											aPropertyReadableInfo = oModel.getProperty("/readablePropertyData"),
											changePromise = [],
											bReadOnlyField = false;

										oTable.getSelectedContexts().forEach(function(oSelectedContext) {
											aResults.forEach(function(oResult) {
												//TODO - Add save implementation for Value Help.
												if (aPropertyReadableInfo) {
													bReadOnlyField = aPropertyReadableInfo.some(function(oPropertyInfo) {
														if (oResult.keyValue === oPropertyInfo.property) {
															if (oPropertyInfo.type === "Default") {
																return oPropertyInfo.value === true;
															} else if (
																oPropertyInfo.type === "Path" &&
																oPropertyInfo.propertyValue &&
																oPropertyInfo.propertyPath
															) {
																return (
																	oSelectedContext.getObject(oPropertyInfo.propertyPath) ===
																	oPropertyInfo.propertyValue
																);
															}
														}
													});
												}
												if (oResult.keyValue && oResult.value !== "Default" && !bReadOnlyField) {
													changePromise.push(oSelectedContext.setProperty(oResult.keyValue, oResult.value));
												}
											});
										});
										return Promise.all(changePromise)
											.then(function(oRes) {
												var oListBinding = oTable.getRowBinding();
												return oExtensionAPI.refresh(oListBinding.getPath()).then(function() {
													oDialog.close();
													oDialog.destroy();
													return oRes;
												});
											})
											.catch(function(oError) {
												//TODO - Add error handling part for the Dialog
												throw new Error(oError);
											});
									}
								},
								endButton: {
									text: oDefaultValues.cancelButtonText,
									press: function(oEvent) {
										var oDialog = oEvent.getSource().getParent();
										oDialog.close();
										oDialog.destroy();
									}
								}
							});
							oDialog.open();
							oDialog.setModel(oDialogDataModel, "fieldsInfo");
						});
					})
					.catch(reject);
			});
		}
		var MassEditHandler = {
			openMassEditDialog: openMassEditDialog
		};
		return MassEditHandler;
	}
);
