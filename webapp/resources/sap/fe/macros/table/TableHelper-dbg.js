/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/ui/model/json/JSONModel",
		"sap/fe/macros/CommonHelper",
		"sap/fe/core/library",
		"sap/fe/core/helpers/StableIdHelper",
		"sap/fe/core/AnnotationHelper",
		"sap/ui/model/odata/v4/AnnotationHelper",
		"sap/fe/core/converters/ConverterContext",
		"sap/fe/macros/SizeHelper",
		"sap/base/Log"
	],
	function(
		JSONModel,
		CommonHelper,
		FELibrary,
		StableIdHelper,
		AnnotationHelper,
		ODataModelAnnotationHelper,
		ConverterContext,
		SizeHelper,
		Log
	) {
		"use strict";

		var CreationMode = FELibrary.CreationMode;

		/**
		 * Helper class used by MDC controls for OData(V4) specific handling
		 *
		 * @private
		 * @experimental This module is only for internal/experimental use!
		 */
		var TableHelper = {
			/**
			 * Check if a given action is static.
			 *
			 * @param {object} oActionContext The instance of the action
			 * @param {string} sActionName The name of the action
			 * @returns {boolean} Returns 'true' if action is static, else 'false'
			 * @private
			 * @ui5-restricted
			 */
			_isStaticAction: function(oActionContext, sActionName) {
				var oAction;
				if (oActionContext) {
					if (Array.isArray(oActionContext)) {
						var sEntityType = this._getActionOverloadEntityType(sActionName);
						if (sEntityType) {
							oAction = oActionContext.find(function(action) {
								return action.$IsBound && action.$Parameter[0].$Type === sEntityType;
							});
						} else {
							// if this is just one - OK we take it. If it's more it's actually a wrong usage by the app
							// as we used the first one all the time we keep it as it is
							oAction = oActionContext[0];
						}
					} else {
						oAction = oActionContext;
					}
				}

				return !!oAction && oAction.$IsBound && oAction.$Parameter[0].$isCollection;
			},

			/**
			 * Get the entity type of an action overload.
			 *
			 * @param sActionName The name of the action.
			 * @returns {undefined | string} The entity type used in the action overload.
			 * @private
			 */
			_getActionOverloadEntityType: function(sActionName) {
				if (sActionName && sActionName.indexOf("(") > -1) {
					var aParts = sActionName.split("(");
					return aParts[aParts.length - 1].replaceAll(")", "");
				}
				return undefined;
			},

			/**
			 * Checks whether the action is overloaded on a different entity type.
			 *
			 * @param sActionName The name of the action.
			 * @param sAnnotationTargetEntityType The entity type of the annotation target.
			 * @returns {boolean} Returns 'true' if the action is overloaded with a different entity type, else 'false'.
			 * @private
			 */
			_isActionOverloadOnDifferentType: function(sActionName, sAnnotationTargetEntityType) {
				var sEntityType = this._getActionOverloadEntityType(sActionName);
				return !!sEntityType && sAnnotationTargetEntityType !== sEntityType;
			},

			createButtonTemplating: function(oThis, bCreationRow) {
				var oTargetCollection = oThis.collection,
					sCreationMode = oThis.creationMode,
					oNavigationProperty,
					bNavigationInsertRestrictions,
					sCurrentCollectionName = oThis.navigationPath,
					sTargetCollectionPath = CommonHelper.getTargetCollection(oThis.collection, oThis.navigationPath),
					aRestrictedProperties = oThis.parentEntitySet.getObject(
						oThis.parentEntitySet.getPath() + "@Org.OData.Capabilities.V1.NavigationRestrictions/RestrictedProperties"
					);
				for (var i in aRestrictedProperties) {
					oNavigationProperty = aRestrictedProperties[i];
					if (
						oNavigationProperty.NavigationProperty.$NavigationPropertyPath === sCurrentCollectionName &&
						oNavigationProperty.InsertRestrictions &&
						oNavigationProperty.InsertRestrictions.Insertable
					) {
						bNavigationInsertRestrictions = oNavigationProperty.InsertRestrictions.Insertable;
					}
				}
				if (oThis.showCreate === "false") {
					return false;
				}
				if (sCreationMode === CreationMode.CreationRow && bCreationRow === false) {
					return false;
				} else if (
					oTargetCollection.getObject(sTargetCollectionPath + "@com.sap.vocabularies.Session.v1.StickySessionSupported/NewAction")
				) {
					return (
						oTargetCollection.getObject(
							sTargetCollectionPath +
								"@com.sap.vocabularies.Session.v1.StickySessionSupported/NewAction@Org.OData.Core.V1.OperationAvailable"
						) !== false
					);
				} else if (oTargetCollection.getObject(sTargetCollectionPath + "@com.sap.vocabularies.Common.v1.DraftRoot/NewAction")) {
					return (
						oTargetCollection.getObject(
							sTargetCollectionPath +
								"@com.sap.vocabularies.Common.v1.DraftRoot/NewAction@Org.OData.Core.V1.OperationAvailable"
						) !== false
					);
				} else if (bNavigationInsertRestrictions === false) {
					return false;
				} else if (bNavigationInsertRestrictions) {
					// if navigation insert restrictions are present and not static false then we render the button
					return true;
				} else if (sCreationMode === CreationMode.External) {
					// if outbound navigation with Create Button
					return true;
				}
				return (
					oTargetCollection.getObject(sTargetCollectionPath + "@Org.OData.Capabilities.V1.InsertRestrictions/Insertable") !==
					false
				);
			},

			deleteButtonTemplating: function(oThis) {
				if (oThis.showDelete !== undefined && oThis.showDelete !== null) {
					return oThis.showDelete;
				} else {
					return true;
				}
			},

			/**
			 * Returns a string of comma separated fields to add presentation variant to $select query of the table.
			 * The fields are the ones listed into PresentationVariantType RequestAtLeast.
			 * @param {object} oPresentationVariant Annotation related to com.sap.vocabularies.UI.v1.PresentationVariant
			 * @param sPresentationVariantPath
			 * @returns {string} - CSV of fields listed into RequestAtLeast
			 * @private
			 * @ui5-restricted
			 */
			addPresentationVariantToSelectQuery: function(oPresentationVariant, sPresentationVariantPath) {
				var aRequested = [];
				if (
					!(
						oPresentationVariant &&
						CommonHelper._isPresentationVariantAnnotation(sPresentationVariantPath) &&
						oPresentationVariant.RequestAtLeast &&
						oPresentationVariant.RequestAtLeast.length > 0
					)
				) {
					return "";
				}
				oPresentationVariant.RequestAtLeast.forEach(function(oRequested) {
					aRequested.push(oRequested.$PropertyPath);
				});
				return aRequested.join(",");
			},
			addNavigationAvailableFieldsToSelectQuery: function(aLineItemCollection) {
				var selectedFieldsArray = [],
					selectFields = "";
				aLineItemCollection.forEach(function(oRecord) {
					if (
						oRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" &&
						!oRecord.Inline &&
						!oRecord.Determining &&
						oRecord.NavigationAvailable &&
						oRecord.NavigationAvailable.$Path
					) {
						selectedFieldsArray.push(oRecord.NavigationAvailable.$Path);
					}
				});
				selectFields = selectedFieldsArray.join(",");
				return selectFields;
			},
			/**
			 * Returns a string of comma separated fields having text annotation to the $select query of the table.
			 * The fields (simple dataField or Field Group) are retreived from the UI.LineItem annotation filtering
			 * on the fields using text arrangement as Text Only.  We will add the field containing the property path
			 * on the $select query requested during Excel Export (from the SpreadSheet).
			 *
			 *
			 * @param {Array} aLineItemCollection An array of records in UI.LineItem
			 * @param {object} oContext The context object of the LineItem
			 * @returns {string} - CSV of path based data fields for properties defining text arrangement of this table.
			 * @private
			 * @ui5-restricted
			 */
			addFieldsHavingTextArrangementToSelectQuery: function(aLineItemCollection, oContext) {
				var selectedFieldsArray = [],
					aDataFieldsFromGroup = [],
					selectFields = "",
					n = 0,
					sPath = oContext.context.getPath();
				aLineItemCollection.forEach(function(oRecord) {
					if (
						oRecord.$Type === "com.sap.vocabularies.UI.v1.DataField" ||
						oRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation"
					) {
						var oField = oContext.context.getObject(sPath + "/" + n + "/Value/$Path@");
						if (
							oField &&
							oField["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"] &&
							oField["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"].$EnumMember ===
								"com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
						) {
							selectedFieldsArray.push(oRecord.Value.$Path);
						} else {
							//For FieldGroup
							var oFieldGroup = oContext.context.getObject(sPath + "/" + n + "/Target/$AnnotationPath@/Data/");
							if (oField === undefined && oFieldGroup) {
								oFieldGroup.forEach(function(oField, i) {
									if (oField.$Type === "com.sap.vocabularies.UI.v1.DataField") {
										return aDataFieldsFromGroup.push(
											oContext.context.getObject(
												sPath + "/" + n + "/Target/$AnnotationPath@/Data/" + i + "/Value/$Path@"
											)
										);
									}
								});
								if (aDataFieldsFromGroup.length > 0) {
									for (var field in aDataFieldsFromGroup) {
										if (
											aDataFieldsFromGroup[field][
												"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"
											] &&
											aDataFieldsFromGroup[field][
												"@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"
											].$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
										) {
											selectedFieldsArray.push(field.Value.$Path);
										}
									}
								}
							}
						}
					}
					n++;
				});
				selectFields = selectedFieldsArray.join(",");
				return selectFields;
			},

			getNavigationAvailableMap: function(aLineItemCollection) {
				var oIBNNavigationAvailableMap = {};
				aLineItemCollection.forEach(function(oRecord) {
					var sKey = oRecord.SemanticObject + "-" + oRecord.Action;
					if (
						oRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" &&
						!oRecord.Inline &&
						oRecord.RequiresContext
					) {
						if (oRecord.NavigationAvailable !== undefined) {
							oIBNNavigationAvailableMap[sKey] = oRecord.NavigationAvailable.$Path
								? oRecord.NavigationAvailable.$Path
								: oRecord.NavigationAvailable;
						}
					}
				});
				return JSON.stringify(oIBNNavigationAvailableMap);
			},

			/**
			 * Returns a array of actions whether are not multi select enabled.
			 *
			 * @param {Array} aLineItemCollection Array of records in UI.LineItem
			 * @param {object} oContext The context object of the LineItem
			 * @returns {Array} An array of action paths
			 * @private
			 * @ui5-restricted
			 */
			getMultiSelectDisabledActions: function(aLineItemCollection, oContext) {
				var aMultiSelectDisabledActions = [],
					sActionPath,
					sActionName,
					sAnnotationPath,
					oParameterAnnotations,
					oAction;
				var aActionMetadata = aLineItemCollection.filter(function(oItem) {
					return oItem.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction";
				});
				aActionMetadata.forEach(function(oActionMetadata) {
					sActionName = oActionMetadata.Action;
					sActionPath = CommonHelper.getActionPath(oContext.context, true, sActionName, false);
					oAction = oContext.context.getObject(sActionPath + "/@$ui5.overload/0");
					if (oAction && oAction.$Parameter && oAction.$IsBound) {
						for (var n in oAction.$Parameter) {
							sAnnotationPath = sActionPath + "/" + oAction.$Parameter[n].$Name + "@";
							oParameterAnnotations = oContext.context.getObject(sAnnotationPath);
							if (
								oParameterAnnotations &&
								((oParameterAnnotations["@com.sap.vocabularies.UI.v1.Hidden"] &&
									oParameterAnnotations["@com.sap.vocabularies.UI.v1.Hidden"].$Path) ||
									(oParameterAnnotations["@com.sap.vocabularies.Common.v1.FieldControl"] &&
										oParameterAnnotations["@com.sap.vocabularies.Common.v1.FieldControl"].$Path))
							) {
								aMultiSelectDisabledActions.push(sActionName);
								break;
							}
						}
					}
				});
				return aMultiSelectDisabledActions;
			},
			/**
			 * Return UI Line Item Context.
			 *
			 * @param {object} oPresentationContext Presentation context object (Presentation variant or UI.LineItem)
			 * @returns {object}
			 */
			getUiLineItem: function(oPresentationContext) {
				var oPresentation = oPresentationContext.getObject(oPresentationContext.sPath),
					oPresentationVariantPath = CommonHelper.createPresentationPathContext(oPresentationContext),
					oModel = oPresentationContext.getModel();
				if (CommonHelper._isPresentationVariantAnnotation(oPresentationVariantPath.getPath())) {
					// Uncomplete PresentationVariant can be passed to macro via SelectionPresentationVariant
					var sLineItemPath = "@com.sap.vocabularies.UI.v1.LineItem",
						aVisualizations = oPresentation.Visualizations;
					if (Array.isArray(aVisualizations)) {
						for (var i = 0; i < aVisualizations.length; i++) {
							if (aVisualizations[i].$AnnotationPath.indexOf(sLineItemPath) !== -1) {
								sLineItemPath = aVisualizations[i].$AnnotationPath;
								break;
							}
						}
					}
					return oModel.getMetaContext(oPresentationContext.getPath().split("@")[0] + sLineItemPath);
				}
				return oPresentationContext;
			},

			/**
			 * Creates and returns a select query with the selected fields from the parameters that were passed.
			 *
			 * @param {object} oCollection Annotations related to the target collection
			 * @param {string} sOperationAvailableFields Fields used as the path in the OperationAvailable annotations for actions
			 * @param {string} sNavigationAvailableFields Fields used as the path in the NavigationAvailable annotations for IBN
			 * @param {Array} oPresentationVariant Annotation related to com.sap.vocabularies.UI.v1.PresentationVariant
			 * @param {string} sPresentationVariantPath Path of the presentation variant
			 * @param {Array} aSemanticKeys SemanticKeys included in the entity set
			 * @returns {string} The 'select' query that has the selected fields from the parameters that were passed
			 */
			create$Select: function(
				oCollection,
				sOperationAvailableFields,
				sNavigationAvailableFields,
				oPresentationVariant,
				sPresentationVariantPath,
				aSemanticKeys
			) {
				var sPresentationVariantFields = TableHelper.addPresentationVariantToSelectQuery(
					oPresentationVariant,
					sPresentationVariantPath
				);
				var aSelectedFields = [];

				function pushField(sField) {
					if (sField && !aSelectedFields.includes(sField) && sField.indexOf("/") !== 0) {
						// Do not add singleton property (with absolute path) to $select
						aSelectedFields.push(sField);
					}
				}
				function pushFieldList(sFieldList) {
					var aFields = sFieldList && sFieldList.split(",");
					if (aFields && aFields.length) {
						aFields.forEach(pushField);
					}
				}

				pushFieldList(sOperationAvailableFields);
				pushFieldList(sNavigationAvailableFields);
				pushFieldList(sPresentationVariantFields);

				if (aSemanticKeys) {
					aSemanticKeys.forEach(function(oSemanticKey) {
						pushField(oSemanticKey.$PropertyPath);
					});
				}
				if (
					oCollection &&
					oCollection["@Org.OData.Capabilities.V1.DeleteRestrictions"] &&
					oCollection["@Org.OData.Capabilities.V1.DeleteRestrictions"].Deletable.$Path
				) {
					var sRestriction = oCollection["@Org.OData.Capabilities.V1.DeleteRestrictions"].Deletable.$Path;
					pushField(sRestriction);
				}
				return aSelectedFields.join(",");
			},
			/**
			 *
			 * Method to get column's width if defined from manifest/customisation by annotations.
			 *
			 * There are issues when the cell in the column is a measure and has a UoM or currency associated to it
			 * In edit mode this results in two fields and that doesn't work very well for the cell and the fields get cut.
			 * So we are currently hardcoding width in several cases in edit mode where there are problems.
			 *
			 *
			 * @function
			 * @name getColumnWidth
			 * @param {string} sDefinedWidth Defined width of the column, which is taken with priority if not null, undefined or empty
			 * @param {*} oAnnotations Annotations of the field
			 * @param {string} sDataFieldType Type of the field
			 * @param {string} sFieldControl Field control value
			 * @param {string} sDataType Datatype of the field
			 * @param {number} nTargetValueVisualization Number for DataFieldForAnnotation Target Value (stars)
			 * @param {*} oDataField Data Field
			 * @param {string} sDataFieldActionText DataField's text from button
			 * @returns {string} - Column width if defined, otherwise width is set to auto
			 */
			getColumnWidth: function(
				sDefinedWidth,
				oAnnotations,
				sDataFieldType,
				sFieldControl,
				sDataType,
				nTargetValueVisualization,
				oDataField,
				sDataFieldActionText
			) {
				var sWidth,
					bHasTextAnnotation = false;
				if (sDefinedWidth) {
					return sDefinedWidth;
				} else if (CommonHelper.getEditMode(oAnnotations, sDataFieldType, sFieldControl) === "Display") {
					bHasTextAnnotation = oAnnotations && oAnnotations.hasOwnProperty("@com.sap.vocabularies.Common.v1.Text");
					if (
						sDataType === "Edm.Stream" &&
						!bHasTextAnnotation &&
						oAnnotations.hasOwnProperty("@Org.OData.Core.V1.MediaType") &&
						oAnnotations["@Org.OData.Core.V1.MediaType"].includes("image/")
					) {
						sWidth = "7em";
					}
				} else if (
					oAnnotations &&
					((oAnnotations.hasOwnProperty("@com.sap.vocabularies.UI.v1.IsImageURL") &&
						oAnnotations.hasOwnProperty("@com.sap.vocabularies.UI.v1.IsImageURL") === true) ||
						(oAnnotations.hasOwnProperty("@Org.OData.Core.V1.MediaType") &&
							oAnnotations["@Org.OData.Core.V1.MediaType"].includes("image/")))
				) {
					sWidth = "7em";
				} else if (
					sDataFieldType === "com.sap.vocabularies.UI.v1.DataFieldForAction" ||
					sDataFieldType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" ||
					sDataFieldType === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation"
				) {
					var nTmpTextWidth, nTmpVisualizationWidth;

					// For FieldGroup having action buttons or visualization data points (as rating) on column.
					if (sDataFieldActionText && sDataFieldActionText.length >= oDataField.Label.length) {
						nTmpTextWidth = SizeHelper.getButtonWidth(sDataFieldActionText);
					} else if (oDataField) {
						nTmpTextWidth = SizeHelper.getButtonWidth(oDataField.Label);
					} else {
						nTmpTextWidth = SizeHelper.getButtonWidth(oAnnotations.Label);
					}
					if (nTargetValueVisualization) {
						//Each rating star has a width of 2em
						nTmpVisualizationWidth = nTargetValueVisualization * 2;
					}
					if (!isNaN(nTmpVisualizationWidth) && nTmpVisualizationWidth > nTmpTextWidth) {
						sWidth = nTmpVisualizationWidth + "em";
					} else if (
						sDataFieldActionText ||
						(oAnnotations &&
							(oAnnotations.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" ||
								oAnnotations.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction"))
					) {
						// Add additional 2 em to avoid showing ellipsis in some cases.
						nTmpTextWidth += 2;
						sWidth = nTmpTextWidth + "em";
					}
				}
				if (sWidth) {
					return sWidth;
				}
			},
			/**
			 * Method to add a margin class at the end of control.
			 *
			 * @function
			 * @name getMarginClass
			 * @param {*} oCollection DataPoint's Title
			 * @param {*} oDataField DataPoint's Value
			 * @param sVisualization
			 * @returns {string} The classes for adjusting margin between controls.
			 */
			getMarginClass: function(oCollection, oDataField, sVisualization) {
				var bAllFalse = true;
				for (var i = 0; i < oCollection.length; i++) {
					if (
						oCollection[i]["@com.sap.vocabularies.UI.v1.Hidden"] !== undefined &&
						oCollection[i]["@com.sap.vocabularies.UI.v1.Hidden"] !== false
					) {
						bAllFalse = false;
					}
				}
				if (bAllFalse) {
					if (JSON.stringify(oCollection[oCollection.length - 1]) == JSON.stringify(oDataField)) {
						//If rating indicator is last element in fieldgroup, then the 0.5rem margin added by sapMRI class of interactive rating indicator on top and bottom must be nullified.
						if (sVisualization == "com.sap.vocabularies.UI.v1.VisualizationType/Rating") {
							return "sapUiNoMarginBottom sapUiNoMarginTop";
						}
						return "";
					} else {
						//If rating indicator is NOT the last element in fieldgroup, then to maintain the 0.5rem spacing between controls (as per UX spec),
						//only the top margin added by sapMRI class of interactive rating indicator must be nullified.
						if (sVisualization == "com.sap.vocabularies.UI.v1.VisualizationType/Rating") {
							return "sapUiNoMarginTop";
						}
						return "sapUiTinyMarginBottom";
					}
				} else {
					return undefined;
				}
			},

			getVBoxVisibility: function(oCollection) {
				var bAllStatic = true;
				var aHiddenPaths = [];
				for (var i = 0; i < oCollection.length; i++) {
					if (
						oCollection[i]["@com.sap.vocabularies.UI.v1.Hidden"] !== undefined &&
						oCollection[i]["@com.sap.vocabularies.UI.v1.Hidden"] !== false
					) {
						if (oCollection[i]["@com.sap.vocabularies.UI.v1.Hidden"] !== true) {
							aHiddenPaths.push(oCollection[i]["@com.sap.vocabularies.UI.v1.Hidden"].$Path);
							bAllStatic = false;
						} else {
							aHiddenPaths.push(oCollection[i]["@com.sap.vocabularies.UI.v1.Hidden"]);
						}
					} else {
						aHiddenPaths.push(false);
					}
				}
				if (aHiddenPaths.length > 0 && bAllStatic !== true) {
					var sExpression = "{parts:[";
					for (var j = 0; j < aHiddenPaths.length; j++) {
						if (j !== aHiddenPaths.length - 1) {
							if (typeof aHiddenPaths[j] === "boolean") {
								sExpression = sExpression + "{value: '" + aHiddenPaths[j] + "'},";
							} else {
								sExpression = sExpression + "{path: '" + aHiddenPaths[j] + "'},";
							}
						} else {
							if (typeof aHiddenPaths[j] === "boolean") {
								sExpression =
									sExpression +
									"{value: '" +
									aHiddenPaths[j] +
									"'}], formatter: 'sap.fe.macros.table.TableRuntime.getVBoxVisibility'}";
							} else {
								sExpression =
									sExpression +
									"{path: '" +
									aHiddenPaths[j] +
									"'}], formatter: 'sap.fe.macros.table.TableRuntime.getVBoxVisibility'}";
							}
						}
					}
					return sExpression;
				} else if (aHiddenPaths.length > 0 && aHiddenPaths.indexOf(false) === -1 && bAllStatic) {
					return false;
				} else {
					return true;
				}
			},

			/**
			 * Method to provide Hidden filters to Table data.
			 *
			 * @function
			 * @name formatHiddenFilters
			 * @param {string} oHiddenFilter The hiddenFilters via context named filters (and key hiddenFilters) passed to Macro Table
			 * @returns {string} The string representation of the hidden filters
			 */
			formatHiddenFilters: function(oHiddenFilter) {
				if (oHiddenFilter) {
					try {
						return JSON.stringify(oHiddenFilter);
					} catch (ex) {
						return undefined;
					}
				}
				return undefined;
			},

			/**
			 * Method to get column stable ID.
			 *
			 * @function
			 * @name getColumnStableId
			 * @param {string} sId Current Object id
			 * @param {object} oDataField DataPoint's Value
			 * @returns {*} The stable ID for a given column
			 */
			getColumnStableId: function(sId, oDataField) {
				return sId
					? StableIdHelper.generate([
							sId,
							"C",
							(oDataField.Target && oDataField.Target.$AnnotationPath) ||
								(oDataField.Value && oDataField.Value.$Path) ||
								(oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" ||
								oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction"
									? oDataField
									: "")
					  ])
					: undefined;
			},

			/**
			 * Method filters out properties which do not belong to the collection.
			 *
			 * @param {Array} aPropertyPaths The array of properties to be checked.
			 * @param {object} oCollectionContext The collection context to be used.
			 * @returns {Array} The array of applicable properties.
			 * @private
			 */
			_filterNonApplicableProperties: function(aPropertyPaths, oCollectionContext) {
				return (
					aPropertyPaths &&
					aPropertyPaths.filter(function(sPropertyPath) {
						return oCollectionContext.getObject("./" + sPropertyPath);
					})
				);
			},
			/**
			 * Method to generate the binding information for a table row.
			 *
			 * @param {object} oThis The instance of the table control
			 * @param oCollection The annotations related to the target collection
			 * @param {string} sCollectionName The name of the target collection
			 * @param {object} oTargetCollection DataPoint's value
			 * @param {string} sOperationAvailableProperties The list of comma-separated property paths referred to by the Core.OperationAvailable annotation
			 * @param {string} sNavigationAvailableProperties The list of comma-separated property paths referred to by the NavigationAvailable annotation
			 * @param {Array} aPresentation The array of com.sap.vocabularies.UI.v1.PresentationVariant entries
			 * @param {string} sPresentationVariantPath The path of the presentation variant
			 * @param {Array} aSemanticKeys The array of semantic keys
			 * @param {string} sTextArrangementProperties The list of comma-separated property names referred to by the UI.Text annotation
			 * @param {boolean} bEnableAnalytics The flag to specify whether this is an analytical table or not
			 * @returns {string} - Returns the binding information of a table row
			 */
			getRowsBindingInfo: function(
				oThis,
				oCollection,
				sCollectionName,
				oTargetCollection,
				sOperationAvailableProperties,
				sNavigationAvailableProperties,
				aPresentation,
				sPresentationVariantPath,
				aSemanticKeys,
				sTextArrangementProperties,
				bEnableAnalytics
			) {
				var oRowBinding = {
					ui5object: true,
					suspended: false,
					path: CommonHelper.addSingleQuotes(
						(oCollection.$kind === "EntitySet" ? "/" : "") + (oThis.navigationPath || sCollectionName)
					),
					parameters: {
						$count: !bEnableAnalytics
					},
					events: {}
				};

				if (sOperationAvailableProperties && oThis && oThis.collection) {
					var aApplicableProperties = TableHelper._filterNonApplicableProperties(
						sOperationAvailableProperties.split(","),
						oThis.collection
					);
					sOperationAvailableProperties = aApplicableProperties.join(",");
				}
				if (sTextArrangementProperties && sOperationAvailableProperties !== "") {
					sOperationAvailableProperties = sOperationAvailableProperties + "," + sTextArrangementProperties;
				} else if (sTextArrangementProperties) {
					sOperationAvailableProperties = sTextArrangementProperties;
				}
				if (!bEnableAnalytics) {
					// Don't add $select parameter in case of an analytical query, this isn't supported by the model
					var sSelect = TableHelper.create$Select(
						oTargetCollection,
						sOperationAvailableProperties,
						sNavigationAvailableProperties,
						aPresentation,
						sPresentationVariantPath,
						aSemanticKeys
					);
					if (sSelect) {
						oRowBinding.parameters.$select = "'" + sSelect + "'";
					}
				}

				oRowBinding.parameters.$$groupId = CommonHelper.addSingleQuotes("$auto.Workers");
				oRowBinding.parameters.$$updateGroupId = CommonHelper.addSingleQuotes("$auto");

				oRowBinding.events.patchSent = CommonHelper.addSingleQuotes(".editFlow.handlePatchSent");
				oRowBinding.events.patchCompleted = CommonHelper.addSingleQuotes(".editFlow.handlePatchCompleted");
				oRowBinding.events.dataReceived = CommonHelper.addSingleQuotes("API.onInternalDataReceived");

				if (oThis.onContextChange) {
					oRowBinding.events.change = CommonHelper.addSingleQuotes(oThis.onContextChange);
				}
				return CommonHelper.objectToString(oRowBinding);
			},

			/**
			 * Method to get Creation row applyEnabled property.
			 *
			 * @function
			 * @name creationRowApplyEnabled
			 * @param {object} oThis Current Object
			 * @param {object} oCollection Annotations related to the target collection
			 * @param {string} sCollectionName Name of collection
			 * @param {object} oParentEntitySet Annotations related to the parent entitySet
			 * @param {object} oTargetCollection Annotations related to the target collection
			 * @returns {*} The binding expression to determine if the creation row should be enabled or not
			 */
			creationRowApplyEnabled: function(oThis, oCollection, sCollectionName, oParentEntitySet, oTargetCollection) {
				var sExpressionInsertable = AnnotationHelper.getNavigationInsertableRestrictions(
					oCollection,
					sCollectionName,
					oParentEntitySet,
					oTargetCollection,
					true
				);
				// disableAddRowButtonForEmptyData is set to false in manifest converter (Table.ts) if customValidationFunction exists
				if (
					typeof sExpressionInsertable === "string" &&
					(oThis.disableAddRowButtonForEmptyData === "true" || oThis.disableAddRowButtonForEmptyData === true)
				) {
					sExpressionInsertable = sExpressionInsertable.substring(0, sExpressionInsertable.length - 1);
					return (
						sExpressionInsertable +
						" && ${path: 'creationRowFieldValidity' , model: 'internal', formatter: 'RUNTIME.validateCreationRowFields'}}"
					);
				}
				return sExpressionInsertable;
			},

			/**
			 * Method to get Creation row visible property.
			 *
			 * @function
			 * @name creationRowVisible
			 * @param {*} showCreate Boolean or expression for table showCreate property
			 * @param {string} sCollectionName CollectionName
			 * @returns {*} The binding expression whether or not the creation row should be visible or not
			 */
			creationRowVisible: function(showCreate, sCollectionName) {
				if (showCreate && showCreate === "{=  ${ui>/editMode} === 'Editable'}") {
					return showCreate;
				} else {
					return showCreate.replace(sCollectionName + "/", "");
				}
			},
			/**
			 * Method to check Creation row fields validity.
			 *
			 * @function
			 * @name validateCreationRowFields
			 * @param {object} oFieldValidityObject Current Object holding the fields
			 * @returns {boolean} `true` if all the fields in the creation row are valid, `false` otherwise
			 */
			validateCreationRowFields: function(oFieldValidityObject) {
				if (!oFieldValidityObject) {
					return false;
				}
				return (
					Object.keys(oFieldValidityObject).length > 0 &&
					Object.keys(oFieldValidityObject).every(function(key) {
						return oFieldValidityObject[key]["validity"];
					})
				);
			},
			/**
			 * Method to get the expression for the 'press' event for the DataFieldForActionButton.
			 *
			 * @function
			 * @name pressEventDataFieldForActionButton
			 * @param {object} oThis Current object
			 * @param {object} oDataField Value of the DataPoint
			 * @param {string} sEntitySetName Name of the EntitySet
			 * @param {string} sOperationAvailableMap OperationAvailableMap as stringified JSON object
			 * @param {object} oActionContext Action object
			 * @param {bool} bIsNavigable Action either triggers navigation or not
			 * @param {bool} bEnableAutoScroll Action either triggers scrolling to the newly created items in the related table or not
			 * @param {string} sDefaultValuesExtensionFunction Function name to prefill dialog parameters
			 * @returns {string} The binding expression
			 */
			pressEventDataFieldForActionButton: function(
				oThis,
				oDataField,
				sEntitySetName,
				sOperationAvailableMap,
				oActionContext,
				bIsNavigable,
				bEnableAutoScroll,
				sDefaultValuesExtensionFunction
			) {
				var sActionName = oDataField.Action,
					sAnnotationTargetEntityType = oThis && oThis.collection.getObject("$Type"),
					bStaticAction =
						this._isStaticAction(oActionContext, sActionName) ||
						this._isActionOverloadOnDifferentType(sActionName, sAnnotationTargetEntityType),
					sInvocationGrouping =
						oDataField.InvocationGrouping &&
						oDataField.InvocationGrouping.$EnumMember === "com.sap.vocabularies.UI.v1.OperationGroupingType/ChangeSet"
							? "ChangeSet"
							: "Isolated",
					oParams = {
						contexts: "${internal>selectedContexts}",
						bStaticAction: bStaticAction ? bStaticAction : undefined,
						entitySetName: CommonHelper.addSingleQuotes(sEntitySetName),
						invocationGrouping: CommonHelper.addSingleQuotes(sInvocationGrouping),
						prefix: CommonHelper.addSingleQuotes(oThis.id),
						operationAvailableMap: CommonHelper.addSingleQuotes(sOperationAvailableMap),
						model: "${$source>/}.getModel()",
						label: CommonHelper.addSingleQuotes(oDataField.Label),
						applicableContext: "${internal>dynamicActions/" + oDataField.Action + "/aApplicable/}",
						notApplicableContext: "${internal>dynamicActions/" + oDataField.Action + "/aNotApplicable/}",
						isNavigable: bIsNavigable,
						enableAutoScroll: bEnableAutoScroll,
						defaultValuesExtensionFunction: sDefaultValuesExtensionFunction
							? "'" + sDefaultValuesExtensionFunction + "'"
							: undefined
					};

				return CommonHelper.generateFunction(
					".editFlow.invokeAction",
					CommonHelper.addSingleQuotes(oDataField.Action),
					CommonHelper.objectToString(oParams)
				);
			},
			/**
			 * Method to determine the binding expression for 'enabled' property of DataFieldForAction and DataFieldForIBN actions.
			 *
			 * @function
			 * @name isDataFieldForActionEnabled
			 * @param {object} oThis The instance of the table control
			 * @param {object} oDataField The value of the data field
			 * @param {object} oRequiresContext RequiresContext for IBN
			 * @param {boolean} bIsDataFieldForIBN Flag for IBN
			 * @param {object} oActionContext The instance of the action
			 * @param {string} vActionEnabled Status of action (single or multiselect)
			 * @returns {*} A binding expression to define the 'enabled' property of the action
			 */
			isDataFieldForActionEnabled: function(oThis, oDataField, oRequiresContext, bIsDataFieldForIBN, oActionContext, vActionEnabled) {
				var sActionName = oDataField.Action,
					sAnnotationTargetEntityType = oThis && oThis.collection.getObject("$Type"),
					oTableDefinition = oThis && oThis.tableDefinition && oThis.tableDefinition.getObject(),
					bStaticAction = this._isStaticAction(oActionContext, sActionName),
					isAnalyticalTable = oTableDefinition && oTableDefinition.enableAnalytics;

				// Check for action overload on a different Entity type.
				// If yes, table row selection is not required to enable this action.
				if (!bIsDataFieldForIBN && this._isActionOverloadOnDifferentType(sActionName, sAnnotationTargetEntityType)) {
					// Action overload defined on different entity type
					var oOperationAvailableMap = oTableDefinition && JSON.parse(oTableDefinition.operationAvailableMap);
					if (oOperationAvailableMap && oOperationAvailableMap.hasOwnProperty(sActionName)) {
						// Core.OperationAvailable annotation defined for the action.
						// Need to refer to internal model for enabled property of the dynamic action.
						return "{= ${internal>dynamicActions/" + sActionName + "/bEnabled} }";
					}
					// Consider the action just like any other static DataFieldForAction.
					return true;
				}
				if (!oRequiresContext || bStaticAction) {
					if (bIsDataFieldForIBN) {
						var sEntitySet = oThis.collection.getPath();
						var oMetaModel = oThis.collection.getModel();
						if (vActionEnabled === "false" && !isAnalyticalTable) {
							Log.warning("NavigationAvailable as false is incorrect usage");
							return false;
						} else if (
							!isAnalyticalTable &&
							oDataField &&
							oDataField.NavigationAvailable &&
							oDataField.NavigationAvailable.$Path &&
							oMetaModel.getObject(sEntitySet + "/$Partner") === oDataField.NavigationAvailable.$Path.split("/")[0]
						) {
							return "{= ${" + vActionEnabled.substr(vActionEnabled.indexOf("/") + 1, vActionEnabled.length) + "}";
						} else {
							return true;
						}
					}
					return true;
				}

				var sDataFieldForActionEnabledExpression = "",
					sNumberOfSelectedContexts,
					sAction;
				if (bIsDataFieldForIBN) {
					if (vActionEnabled === "true" || isAnalyticalTable) {
						sDataFieldForActionEnabledExpression = "%{internal>numberOfSelectedContexts} >= 1";
					} else if (vActionEnabled === "false") {
						Log.warning("NavigationAvailable as false is incorrect usage");
						return false;
					} else {
						sNumberOfSelectedContexts = "%{internal>numberOfSelectedContexts} >= 1";
						sAction = "${internal>ibn/" + oDataField.SemanticObject + "-" + oDataField.Action + "/bEnabled" + "}";
						sDataFieldForActionEnabledExpression = sNumberOfSelectedContexts + " && " + sAction;
					}
				} else {
					if (vActionEnabled === "single") {
						sNumberOfSelectedContexts = "${internal>numberOfSelectedContexts} === 1";
					} else {
						sNumberOfSelectedContexts = "${internal>numberOfSelectedContexts} > 0";
					}
					sAction = "${internal>dynamicActions/" + oDataField.Action + "/bEnabled" + "}";
					sDataFieldForActionEnabledExpression = sNumberOfSelectedContexts + " && " + sAction;
				}
				return "{= " + sDataFieldForActionEnabledExpression + "}";
			},
			/**
			 * Method to get press event expression for CreateButton.
			 *
			 * @function
			 * @name pressEventForCreateButton
			 * @param {object} oThis Current Object
			 * @param {boolean} bCmdExecutionFlag Flag to indicate that the function is called from CMD Execution
			 * @returns {string} The binding expression for the press event of the create button
			 */
			pressEventForCreateButton: function(oThis, bCmdExecutionFlag) {
				var sCreationMode = oThis.creationMode,
					oParams,
					sMdcTable = bCmdExecutionFlag ? "${$source>}.getParent()" : "${$source>}.getParent().getParent().getParent()",
					sRowBinding = sMdcTable + ".getRowBinding() || " + sMdcTable + ".data('rowsBindingInfo').path";

				switch (sCreationMode) {
					case CreationMode.External:
						// navigate to external target for creating new entries
						// TODO: Add required parameters
						oParams = {
							creationMode: CommonHelper.addSingleQuotes(CreationMode.External),
							outbound: CommonHelper.addSingleQuotes(oThis.createOutbound)
						};
						break;

					case CreationMode.CreationRow:
						oParams = {
							creationMode: CommonHelper.addSingleQuotes(CreationMode.CreationRow),
							creationRow: "${$source>}",
							createAtEnd: oThis.createAtEnd !== undefined ? oThis.createAtEnd : false
						};

						sRowBinding = "${$source>}.getParent()._getRowBinding()";
						break;

					case CreationMode.NewPage:
					case CreationMode.Inline:
						oParams = {
							creationMode: CommonHelper.addSingleQuotes(sCreationMode),
							createAtEnd: oThis.createAtEnd !== undefined ? oThis.createAtEnd : false,
							tableId: CommonHelper.addSingleQuotes(oThis.id)
						};

						if (oThis.createNewAction) {
							oParams.newAction = CommonHelper.addSingleQuotes(oThis.createNewAction);
						}
						break;

					default:
						// unsupported
						return undefined;
				}
				return CommonHelper.generateFunction(".editFlow.createDocument", sRowBinding, CommonHelper.objectToString(oParams));
			},

			getIBNData: function(oThis) {
				var outboundDetail = oThis.createOutboundDetail;
				if (outboundDetail) {
					var oIBNData = {
						semanticObject: CommonHelper.addSingleQuotes(outboundDetail.semanticObject),
						action: CommonHelper.addSingleQuotes(outboundDetail.action)
					};
					return CommonHelper.objectToString(oIBNData);
				}
			},

			/**
			 * Method to get enabled expression for CreateButton.
			 *
			 * @function
			 * @name isCreateButtonEnabled
			 * @param {object} oCollection Annotations related to the target collection
			 * @param {string} sCollectionName Collection name
			 * @param {string} sRestrictedProperties RestrictedProperties of parentEntitySet
			 * @param {string} sInsertable Insertable of target collection
			 * @returns {string} The binding expression for the enabled expression of the create button.
			 */
			isCreateButtonEnabled: function(oCollection, sCollectionName, sRestrictedProperties, sInsertable) {
				var bIsEntitySet = oCollection.$kind === "EntitySet";
				return bIsEntitySet
					? undefined
					: AnnotationHelper.getNavigationInsertableRestrictions(
							oCollection,
							sCollectionName,
							sRestrictedProperties,
							sInsertable,
							false
					  );
			},
			/**
			 * Method to get press event expression for DeleteButton.
			 *
			 * @function
			 * @name pressEventForDeleteButton
			 * @param {object} oThis Current Object
			 * @param {string} sEntitySetName EntitySet name
			 * @returns {string} The binding expression for the press event of the delete button.
			 */
			pressEventForDeleteButton: function(oThis, sEntitySetName) {
				var sDeletableContexts = "${internal>deletableContexts}";

				var oParams = {
					id: CommonHelper.addSingleQuotes(oThis.id),
					entitySetName: CommonHelper.addSingleQuotes(sEntitySetName),
					numberOfSelectedContexts: "${internal>selectedContexts}.length",
					unSavedContexts: "${internal>unSavedContexts}",
					lockedContexts: "${internal>lockedContexts}",
					controlId: "${internal>controlId}"
				};

				return CommonHelper.generateFunction(
					".editFlow.deleteMultipleDocuments",
					sDeletableContexts,
					CommonHelper.objectToString(oParams)
				);
			},
			/**
			 * Method to get enabled expression for DeleteButton.
			 *
			 * @function
			 * @name isDeleteButtonEnabled
			 * @param {object} oThis Current Object
			 * @returns {string} The binding expression for the enabled property of the delete button.
			 */
			isDeleteButtonEnabled: function(oThis) {
				var sDeletableContexts = "%{internal>deletableContexts}",
					sNumberOfDeletableContexts = sDeletableContexts + ".length > 0",
					sDeletableContextsCheck = "(" + sDeletableContexts + " && " + sNumberOfDeletableContexts + ")",
					sUnSavedContexts = "%{internal>unSavedContexts}",
					sNumberOfUnSavedContexts = sUnSavedContexts + ".length > 0",
					sUnSavedContextsCheck = "(" + sUnSavedContexts + " && " + sNumberOfUnSavedContexts + ")",
					sDeleteEnabledCheck = "(" + sDeletableContextsCheck + " || " + sUnSavedContextsCheck + ")",
					sDeleteEnabled = "%{internal>deleteEnabled}",
					sNumberOfSelectedContext = "%{internal>numberOfSelectedContexts}",
					bParentEntityDeleteEnabled = oThis.parentEntityDeleteEnabled;
				var sExpression;
				if (bParentEntityDeleteEnabled === "true") {
					//return true
					sExpression = "{= " + sNumberOfSelectedContext + " ? " + true + " : false}";
				} else if (bParentEntityDeleteEnabled !== "false" && typeof bParentEntityDeleteEnabled === "string") {
					//parent entity set expression is there
					sExpression = "{= " + sNumberOfSelectedContext + " ? " + bParentEntityDeleteEnabled + ": false}";
				} else {
					//NO retriction applied / current entity set binding
					sExpression = "{= " + sDeleteEnabledCheck + " ? " + sDeleteEnabled + " : false}";
				}
				return sExpression;
			},
			/**
			 * Method to get the binding expression for the 'enable' property of 'MassEdit'.
			 *
			 * @function
			 * @name getEnablementMassEdit
			 * @param {oThis} oThis The current object
			 * @returns {string} The binding expression for the enabled property of the 'Mass Edit' button.
			 */
			getEnablementMassEdit: function(oThis) {
				if (oThis.massEditEnabled) {
					return oThis.massEditEnabled;
				} else {
					//when updatable is path based and pointing to current entity set property a runtime binding is returned,
					//The properties updatableContexts and numberOfSelectedContexts are updated in setContext method of table runtime
					var sUpdatableContexts = "%{internal>updatableContexts}",
						sNumberOfUpdatableContexts = sUpdatableContexts + ".length >= 2",
						sNumberOfSelectedContexts = "%{internal>numberOfSelectedContexts}";
					return "{= " + sNumberOfSelectedContexts + " >= 2 && " + sNumberOfUpdatableContexts + " }";
				}
			},
			/**
			 * Method to handle the 'enable' and 'disable' state of the table's 'Delete' button if this information is requested in the side effects.
			 * @function
			 *
			 * @name handleTableDeleteEnablementForSideEffects
			 * @param {object} oTable Table instance
			 * @param {object} oInternalModelContext The internal model context
			 */
			handleTableDeleteEnablementForSideEffects: function(oTable, oInternalModelContext) {
				if (oTable && oInternalModelContext) {
					var sDeletablePath = TableHelper.getDeletablePathForTable(oTable),
						aSelectedContexts = oTable.getSelectedContexts(),
						aDeletableContexts = [],
						aExistingDeletableContext = oInternalModelContext.getProperty("deletableContexts") || [];
					if (aSelectedContexts.length === 0) {
						oInternalModelContext.setProperty("deleteEnabled", false);
					} else {
						for (var i = 0; i < aSelectedContexts.length; i++) {
							if (typeof sDeletablePath === "string" && sDeletablePath !== undefined) {
								var oSelectedContext = aSelectedContexts[i];
								if (oSelectedContext && oSelectedContext.getProperty(sDeletablePath)) {
									oInternalModelContext.setProperty("deleteEnabled", true);
									aDeletableContexts.push(oSelectedContext);
								} else {
									oInternalModelContext.setProperty("deleteEnabled", false);
								}
							}
						}
					}
					if (!aExistingDeletableContext.length && aDeletableContexts.length > 0) {
						oInternalModelContext.setProperty("deletableContexts", aDeletableContexts);
					}
				}
			},

			/**
			 * Method to get the delete restricitions Path associated.
			 *
			 * @function
			 * @name getDeletablePathForTable
			 * @param {object} oTable Table instance
			 * @returns {string} Path associated with delete's enable and disable
			 */
			getDeletablePathForTable: function(oTable) {
				var oMetamodel = oTable && oTable.getModel() && oTable.getModel().getMetaModel(),
					sPath = oTable.getRowBinding() && oTable.getRowBinding().getPath();
				if (oMetamodel && sPath) {
					var sContextPath =
						oTable.getRowBinding().getContext &&
						oTable.getRowBinding().getContext() &&
						oTable
							.getRowBinding()
							.getContext()
							.getPath();
					if (!sContextPath) {
						var oCurrentPathDeletable =
							oMetamodel && oMetamodel.getObject(sPath + "@Org.OData.Capabilities.V1.DeleteRestrictions/Deletable");
						if (oCurrentPathDeletable) {
							return oCurrentPathDeletable && oCurrentPathDeletable.$Path;
						}
						return;
					}
					var sMetaPath = oMetamodel.getMetaPath(sContextPath);
					var sNavigationPropertyPath =
						oMetamodel.getObject(sMetaPath) &&
						oMetamodel.getObject(sMetaPath)["$NavigationPropertyBinding"] &&
						oMetamodel.getObject(sMetaPath)["$NavigationPropertyBinding"][sPath];
					if (!sNavigationPropertyPath) {
						return;
					}
					sPath = "/" + sNavigationPropertyPath;
				}

				var oDeletablePath = oMetamodel && oMetamodel.getObject(sPath + "@Org.OData.Capabilities.V1.DeleteRestrictions/Deletable");

				return oDeletablePath && oDeletablePath.$Path;
			},

			/**
			 * Method to set visibility of column header label.
			 *
			 * @function
			 * @name setHeaderLabelVisibility
			 * @param {object} datafield DataField
			 * @param {object} dataFieldCollection List of items inside a fieldgroup (if any)
			 * @returns {boolean} `true` if the header label needs to be visible else false.
			 */
			setHeaderLabelVisibility: function(datafield, dataFieldCollection) {
				// If Inline button/navigation action, return false, else true;
				if (!dataFieldCollection) {
					if (datafield.$Type.indexOf("DataFieldForAction") > -1 && datafield.Inline) {
						return false;
					}
					if (datafield.$Type.indexOf("DataFieldForIntentBasedNavigation") > -1 && datafield.Inline) {
						return false;
					}
					return true;
				}

				// In Fieldgroup, If NOT all datafield/datafieldForAnnotation exists with hidden, return true;
				return dataFieldCollection.some(function(oDC) {
					if (
						(oDC.$Type === "com.sap.vocabularies.UI.v1.DataField" ||
							oDC.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") &&
						oDC["@com.sap.vocabularies.UI.v1.Hidden"] !== true
					) {
						return true;
					}
				});
			},

			/**
			 * Method to get Target Value (# of stars) from Visualization Rating.
			 *
			 * @function
			 * @name getValueOnRatingField
			 * @param {object} oDataField DataPoint's Value
			 * @param {object} oContext Context object of the LineItem
			 * @returns {number} The number for DataFieldForAnnotation Target Value
			 */
			getValueOnRatingField: function(oDataField, oContext) {
				// for FieldGroup containing visualizationTypeRating
				if (oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
					// For a data field having Rating as visualization type
					if (
						oContext.context.getObject("Target/$AnnotationPath").indexOf("@com.sap.vocabularies.UI.v1.DataPoint") > -1 &&
						oContext.context.getObject("Target/$AnnotationPath/$Type") == "com.sap.vocabularies.UI.v1.DataPointType" &&
						oContext.context.getObject("Target/$AnnotationPath/Visualization/$EnumMember") ==
							"com.sap.vocabularies.UI.v1.VisualizationType/Rating"
					) {
						return oContext.context.getObject("Target/$AnnotationPath/TargetValue");
					}
					// for FieldGroup having Rating as visualization type in any of the data fields
					if (oContext.context.getObject("Target/$AnnotationPath").indexOf("@com.sap.vocabularies.UI.v1.FieldGroup") > -1) {
						var sPathDataFields = "Target/$AnnotationPath/Data/";
						for (var i in oContext.context.getObject(sPathDataFields)) {
							if (
								oContext.context.getObject(sPathDataFields + i + "/$Type") ===
									"com.sap.vocabularies.UI.v1.DataFieldForAnnotation" &&
								oContext.context
									.getObject(sPathDataFields + i + "/Target/$AnnotationPath")
									.indexOf("@com.sap.vocabularies.UI.v1.DataPoint") > -1 &&
								oContext.context.getObject(sPathDataFields + i + "/Target/$AnnotationPath/$Type") ==
									"com.sap.vocabularies.UI.v1.DataPointType" &&
								oContext.context.getObject(sPathDataFields + i + "/Target/$AnnotationPath/Visualization/$EnumMember") ==
									"com.sap.vocabularies.UI.v1.VisualizationType/Rating"
							) {
								return oContext.context.getObject(sPathDataFields + i + "/Target/$AnnotationPath/TargetValue");
							}
						}
					}
				}
			},
			/**
			 * Method to get Text from DataFieldForAnnotation into Column.
			 *
			 * @function
			 * @name getTextOnActionField
			 * @param {object} oDataField DataPoint's Value
			 * @param {object} oContext Context object of the LineItem
			 * @returns {string} String from label referring to action text
			 */
			getTextOnActionField: function(oDataField, oContext) {
				if (
					oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" ||
					oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"
				) {
					return oDataField.Label;
				}
				// for FieldGroup containing DataFieldForAnnotation
				if (
					oDataField.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" &&
					oContext.context.getObject("Target/$AnnotationPath").indexOf("@com.sap.vocabularies.UI.v1.FieldGroup") > -1
				) {
					var sPathDataFields = "Target/$AnnotationPath/Data/";
					var aMultipleLabels = [];
					for (var i in oContext.context.getObject(sPathDataFields)) {
						if (
							oContext.context.getObject(sPathDataFields + i + "/$Type") ===
								"com.sap.vocabularies.UI.v1.DataFieldForAction" ||
							oContext.context.getObject(sPathDataFields + i + "/$Type") ===
								"com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"
						) {
							aMultipleLabels.push(oContext.context.getObject(sPathDataFields + i + "/Label"));
						}
					}
					// In case there are multiple actions inside a Field Group select the largest Action Label
					if (aMultipleLabels.length > 1) {
						return aMultipleLabels.reduce(function(a, b) {
							return a.length > b.length ? a : b;
						});
					} else {
						return aMultipleLabels.length === 0 ? undefined : aMultipleLabels.toString();
					}
				}
			},
			_getResponsiveTableColumnSettings: function(oThis, oColumn) {
				if (oThis.tableType === "ResponsiveTable") {
					return oColumn.settings;
				}
				return null;
			},

			getChartSize: function(oThis, oColumn) {
				var settings = this._getResponsiveTableColumnSettings(oThis, oColumn);
				if (settings && settings.microChartSize) {
					return settings.microChartSize;
				}
				return "XS";
			},
			getShowOnlyChart: function(oThis, oColumn) {
				var settings = this._getResponsiveTableColumnSettings(oThis, oColumn);
				if (settings && settings.showMicroChartLabel) {
					return !settings.showMicroChartLabel;
				}
				return true;
			},
			getDelegate: function(bEnableAnalytics, bHasMultiVisualizations, sEntityName) {
				var oDelegate;
				if (bHasMultiVisualizations === "true") {
					oDelegate = {
						name: bEnableAnalytics
							? "sap/fe/macros/table/delegates/AnalyticalALPTableDelegate"
							: "sap/fe/macros/table/delegates/ALPTableDelegate",
						payload: {
							collectionName: sEntityName
						}
					};
				} else {
					oDelegate = {
						name: bEnableAnalytics
							? "sap/fe/macros/table/delegates/AnalyticalTableDelegate"
							: "sap/fe/macros/table/delegates/TableDelegate"
					};
				}

				return JSON.stringify(oDelegate);
			},
			setIBNEnablement: function(oInternalModelContext, oNavigationAvailableMap, aSelectedContexts) {
				for (var sKey in oNavigationAvailableMap) {
					oInternalModelContext.setProperty("ibn/" + sKey, {
						bEnabled: false,
						aApplicable: [],
						aNotApplicable: []
					});
					var aApplicable = [],
						aNotApplicable = [];
					var sProperty = oNavigationAvailableMap[sKey];
					for (var i = 0; i < aSelectedContexts.length; i++) {
						var oSelectedContext = aSelectedContexts[i];
						if (oSelectedContext.getObject(sProperty)) {
							oInternalModelContext
								.getModel()
								.setProperty(oInternalModelContext.getPath() + "/ibn/" + sKey + "/bEnabled", true);
							aApplicable.push(oSelectedContext);
						} else {
							aNotApplicable.push(oSelectedContext);
						}
					}
					oInternalModelContext
						.getModel()
						.setProperty(oInternalModelContext.getPath() + "/ibn/" + sKey + "/aApplicable", aApplicable);
					oInternalModelContext
						.getModel()
						.setProperty(oInternalModelContext.getPath() + "/ibn/" + sKey + "/aNotApplicable", aNotApplicable);
				}
			}
		};

		TableHelper.getNavigationAvailableMap.requiresIContext = true;
		TableHelper.addNavigationAvailableFieldsToSelectQuery.requiresIContext = true;
		TableHelper.addFieldsHavingTextArrangementToSelectQuery.requiresIContext = true;
		TableHelper.getValueOnRatingField.requiresIContext = true;
		TableHelper.getTextOnActionField.requiresIContext = true;

		return TableHelper;
	},
	/* bExport= */ true
);
