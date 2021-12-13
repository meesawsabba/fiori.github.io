/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"sap/ui/core/mvc/View",
		"sap/ui/core/Component",
		"sap/m/MessageBox",
		"sap/base/Log",
		"sap/fe/navigation/SelectionVariant",
		"sap/ui/mdc/condition/FilterOperatorUtil",
		"sap/ui/mdc/odata/v4/TypeUtil",
		"sap/fe/core/helpers/StableIdHelper",
		"sap/fe/core/library",
		"sap/fe/core/helpers/ModelHelper",
		"sap/fe/core/helpers/SemanticDateOperators",
		"sap/fe/core/templating/FilterHelper",
		"sap/ui/mdc/condition/Condition",
		"sap/ui/mdc/enum/ConditionValidated",
		"sap/fe/core/converters/MetaModelConverter",
		"sap/fe/core/converters/ConverterContext",
		"sap/base/util/merge",
		"sap/fe/core/helpers/BindingExpression",
		"sap/fe/core/controls/DataLossOrDraftDiscard/DataLossOrDraftDiscardHandler",
		"sap/ui/core/XMLTemplateProcessor",
		"sap/ui/core/util/XMLPreprocessor",
		"sap/ui/core/Fragment"
	],
	function(
		View,
		Component,
		MessageBox,
		Log,
		SelectionVariant,
		FilterOperatorUtil,
		TypeUtil,
		StableIdHelper,
		FELibrary,
		ModelHelper,
		SemanticDateOperators,
		FilterHelper,
		Condition,
		ConditionValidated,
		MetaModelConverter,
		ConverterContext,
		mergeObjects,
		BindingExpression,
		DataLossOrDraftDiscardHandler,
		XMLTemplateProcessor,
		XMLPreprocessor,
		Fragment
	) {
		"use strict";

		var ProgrammingModel = FELibrary.ProgrammingModel;

		var aValidTypes = [
			"Edm.Boolean",
			"Edm.Byte",
			"Edm.Date",
			"Edm.DateTime",
			"Edm.DateTimeOffset",
			"Edm.Decimal",
			"Edm.Double",
			"Edm.Float",
			"Edm.Guid",
			"Edm.Int16",
			"Edm.Int32",
			"Edm.Int64",
			"Edm.SByte",
			"Edm.Single",
			"Edm.String",
			"Edm.Time",
			"Edm.TimeOfDay"
		];

		/**
		 * Returns the actual property type of a given datafield or property.
		 *
		 * @param {sap.ui.model.Context} oNavigationContext The metamodel context
		 * @returns {string} The name of the actual data type
		 */
		function getPropertyDataType(oNavigationContext) {
			var sDataType = oNavigationContext.getProperty("$Type");
			// if $kind exists, it's not a DataField and we have the final type already
			if (!oNavigationContext.getProperty("$kind")) {
				switch (sDataType) {
					case "com.sap.vocabularies.UI.v1.DataFieldForAction":
					case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":
						sDataType = undefined;
						break;

					case "com.sap.vocabularies.UI.v1.DataField":
					case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath":
					case "com.sap.vocabularies.UI.v1.DataFieldWithUrl":
						sDataType = oNavigationContext.getProperty("Value/$Path/$Type");
						break;

					case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation":
					default:
						var sAnnotationPath = oNavigationContext.getProperty("Target/$AnnotationPath");
						if (sAnnotationPath) {
							if (sAnnotationPath.indexOf("com.sap.vocabularies.Communication.v1.Contact") > -1) {
								sDataType = oNavigationContext.getProperty("Target/$AnnotationPath/fn/$Path/$Type");
							} else if (sAnnotationPath.indexOf("com.sap.vocabularies.UI.v1.DataPoint") > -1) {
								sDataType = oNavigationContext.getProperty("Value/$Path/$Type");
							} else {
								// e.g. FieldGroup or Chart
								sDataType = undefined;
							}
						} else {
							sDataType = undefined;
						}
						break;
				}
			}

			return sDataType;
		}

		function fnHasTransientContexts(oListBinding) {
			var bHasTransientContexts = false;
			if (oListBinding) {
				oListBinding.getCurrentContexts().forEach(function(oContext) {
					if (oContext && oContext.isTransient()) {
						bHasTransientContexts = true;
					}
				});
			}
			return bHasTransientContexts;
		}

		function getSearchRestrictions(sFullPath, oMetaModel) {
			var i = 0,
				aNavigationParts = sFullPath.split("/$NavigationPropertyBinding/");
			for (var sPath = aNavigationParts[0]; i < aNavigationParts.length - 1; i++) {
				var oNavigationRestrictions = getNavigationRestrictions(oMetaModel, sPath, aNavigationParts[i + 1]);
				if (oNavigationRestrictions && oNavigationRestrictions["SearchRestrictions"]) {
					return oNavigationRestrictions["SearchRestrictions"];
				}
				sPath = sPath + "/$NavigationPropertyBinding/" + aNavigationParts[i];
			}
			return oMetaModel.getObject(sFullPath + "@Org.OData.Capabilities.V1.SearchRestrictions");
		}

		function getNavigationRestrictions(oModel, sEntitySetPath, sNavigationPath) {
			var oNavigationRestrictions = oModel.getObject(sEntitySetPath + "@Org.OData.Capabilities.V1.NavigationRestrictions");
			var aRestrictedProperties = oNavigationRestrictions && oNavigationRestrictions.RestrictedProperties;
			return (
				aRestrictedProperties &&
				aRestrictedProperties.find(function(oRestrictedProperty) {
					return (
						oRestrictedProperty &&
						oRestrictedProperty.NavigationProperty &&
						oRestrictedProperty.NavigationProperty.$NavigationPropertyPath === sNavigationPath
					);
				})
			);
		}

		function _isInNonFilterableProperties(oModel, sEntitySetPath, sContextPath) {
			var bIsNotFilterable = false;
			var oAnnotation = oModel.getObject(sEntitySetPath + "@Org.OData.Capabilities.V1.FilterRestrictions");
			if (oAnnotation && oAnnotation.NonFilterableProperties) {
				bIsNotFilterable = oAnnotation.NonFilterableProperties.some(function(property) {
					return property.$NavigationPropertyPath === sContextPath || property.$PropertyPath === sContextPath;
				});
			}
			return bIsNotFilterable;
		}

		// TODO rework this!
		function _isContextPathFilterable(oModel, sEntitySetPath, sContexPath) {
			var sFullPath = sEntitySetPath + "/" + sContexPath,
				aESParts = sFullPath.split("/").splice(0, 2),
				aContext = sFullPath.split("/").splice(2),
				bIsNotFilterable = false,
				sContext = "";

			sEntitySetPath = aESParts.join("/");

			bIsNotFilterable = aContext.some(function(item, index, array) {
				if (sContext.length > 0) {
					sContext += "/" + item;
				} else {
					sContext = item;
				}
				if (index === array.length - 2) {
					// In case of "/Customer/Set/Property" this is to check navigation restrictions of "Customer" for non-filterable properties in "Set"
					var oNavigationRestrictions = getNavigationRestrictions(oModel, sEntitySetPath, item);
					var oFilterRestrictions = oNavigationRestrictions && oNavigationRestrictions.FilterRestrictions;
					var aNonFilterableProperties = oFilterRestrictions && oFilterRestrictions.NonFilterableProperties;
					var sTargetPropertyPath = array[array.length - 1];
					if (
						aNonFilterableProperties &&
						aNonFilterableProperties.find(function(oPropertyPath) {
							return oPropertyPath.$PropertyPath === sTargetPropertyPath;
						})
					) {
						return true;
					}
				}
				if (index === array.length - 1) {
					//last path segment
					bIsNotFilterable = _isInNonFilterableProperties(oModel, sEntitySetPath, sContext);
				} else if (oModel.getObject(sEntitySetPath + "/$NavigationPropertyBinding/" + item)) {
					//check existing context path and initialize it
					bIsNotFilterable = _isInNonFilterableProperties(oModel, sEntitySetPath, sContext);
					sContext = "";
					//set the new EntitySet
					sEntitySetPath = "/" + oModel.getObject(sEntitySetPath + "/$NavigationPropertyBinding/" + item);
				}
				return bIsNotFilterable === true;
			});
			return bIsNotFilterable;
		}

		// TODO check used places and rework this
		/**
		 * Checks if the property is filterable.
		 *
		 * @param {object} oModel MetaModel
		 * @param {string} sEntitySetPath EntitySet Path
		 * @param {string} sProperty Entityset's Property
		 * @param {boolean} bSkipHiddenFilter If HiddenFilters annotation check needs to be skipped
		 * @returns {boolean} `true`, if the property is filterable
		 *
		 */
		function isPropertyFilterable(oModel, sEntitySetPath, sProperty, bSkipHiddenFilter) {
			if (typeof sProperty !== "string") {
				throw new Error("sProperty parameter must be a string", sProperty);
			}
			var bIsFilterable;

			// Parameters should be rendered as filterfields
			if (oModel.getProperty(sEntitySetPath + "/@com.sap.vocabularies.Common.v1.ResultContext") === true) {
				return true;
			}

			var oNavigationContext = oModel.createBindingContext(sEntitySetPath + "/" + sProperty);

			if (oNavigationContext.getProperty("@com.sap.vocabularies.UI.v1.Hidden") === true) {
				return false;
			}

			if (!bSkipHiddenFilter && oNavigationContext.getProperty("@com.sap.vocabularies.UI.v1.HiddenFilter")) {
				return false;
			}

			if (sEntitySetPath.split("/").length === 2 && sProperty.indexOf("/") < 0) {
				// there is no navigation in entitySet path and property path
				bIsFilterable = !_isInNonFilterableProperties(oModel, sEntitySetPath, sProperty);
			} else {
				bIsFilterable = !_isContextPathFilterable(oModel, sEntitySetPath, sProperty);
			}
			// check if type can be used for filtering
			if (bIsFilterable && oNavigationContext) {
				var sPropertyDataType = getPropertyDataType(oNavigationContext);
				if (sPropertyDataType) {
					bIsFilterable = aValidTypes.indexOf(sPropertyDataType) !== -1;
				} else {
					bIsFilterable = false;
				}
			}

			return bIsFilterable;
		}

		function getShellServices(oControl) {
			return getAppComponent(oControl).getShellServices();
		}

		function _getSOIntents(oObjectPageLayout, oSemanticObject, oParam) {
			var oShellServiceHelper = CommonUtils.getShellServices(oObjectPageLayout);
			return oShellServiceHelper.getLinks({
				semanticObject: oSemanticObject,
				params: oParam
			});
		}

		// TO-DO add this as part of applySemanticObjectmappings logic in IntentBasednavigation controller extension
		function _createMappings(oMapping) {
			var aSOMappings = [];
			var aMappingKeys = Object.keys(oMapping);
			for (var i = 0; i < aMappingKeys.length; i++) {
				var oSemanticMapping = {
					"LocalProperty": {
						"$PropertyPath": aMappingKeys[i]
					},
					"SemanticObjectProperty": oMapping[aMappingKeys[i]]
				};
				aSOMappings.push(oSemanticMapping);
			}

			return aSOMappings;
		}

		function _getRelatedAppsMenuItems(aLinks, aExcludedActions, oTargetParams, aItems) {
			for (var i = 0; i < aLinks.length; i++) {
				var oLink = aLinks[i];
				var sIntent = oLink.intent;
				var sAction = sIntent.split("-")[1].split("?")[0];
				if (aExcludedActions && aExcludedActions.indexOf(sAction) === -1) {
					aItems.push({
						text: oLink.text,
						targetSemObject: sIntent.split("#")[1].split("-")[0],
						targetAction: sAction.split("~")[0],
						targetParams: oTargetParams
					});
				}
			}
		}

		function _getRelatedIntents(oAdditionalSemanticObjects, oBindingContext, aManifestSOItems, aLinks) {
			if (aLinks && aLinks.length > 0) {
				var aExcludedActions = oAdditionalSemanticObjects.unavailableActions ? oAdditionalSemanticObjects.unavailableActions : [];
				var aSOMappings = oAdditionalSemanticObjects.mapping ? _createMappings(oAdditionalSemanticObjects.mapping) : [];
				var oTargetParams = { navigationContexts: oBindingContext, semanticObjectMapping: aSOMappings };
				_getRelatedAppsMenuItems(aLinks, aExcludedActions, oTargetParams, aManifestSOItems);
			}
		}

		function updateRelateAppsModel(oBindingContext, oEntry, oObjectPageLayout, aSemKeys, oMetaModel, oMetaPath) {
			var oShellServiceHelper = getShellServices(oObjectPageLayout),
				oParam = {},
				sCurrentSemObj = "",
				sCurrentAction = "";
			var oSemanticObjectAnnotations;
			var aRelatedAppsMenuItems = [];
			var aExcludedActions = [];

			if (oEntry) {
				if (aSemKeys && aSemKeys.length > 0) {
					for (var j = 0; j < aSemKeys.length; j++) {
						var sSemKey = aSemKeys[j].$PropertyPath;
						if (!oParam[sSemKey]) {
							oParam[sSemKey] = { value: oEntry[sSemKey] };
						}
					}
				} else {
					// fallback to Technical Keys if no Semantic Key is present
					var aTechnicalKeys = oMetaModel.getObject(oMetaPath + "/$Type/$Key");
					for (var key in aTechnicalKeys) {
						var sObjKey = aTechnicalKeys[key];
						if (!oParam[sObjKey]) {
							oParam[sObjKey] = { value: oEntry[sObjKey] };
						}
					}
				}
			}
			// Logic to read additional SO from manifest and updated relatedapps model

			var oManifestData = getTargetView(oObjectPageLayout).getViewData();
			var aManifestSOItems = [];
			if (oManifestData.additionalSemanticObjects) {
				var aManifestSOKeys = Object.keys(oManifestData.additionalSemanticObjects);
				for (var key = 0; key < aManifestSOKeys.length; key++) {
					_getSOIntents(oObjectPageLayout, aManifestSOKeys[key], oParam)
						.then(
							_getRelatedIntents.bind(
								this,
								oManifestData.additionalSemanticObjects[aManifestSOKeys[key]],
								oBindingContext,
								aManifestSOItems
							)
						)
						.catch(function(oError) {
							Log.error("Error while retrieving SO Intents", oError);
						});
				}
			}

			function fnGetParseShellHashAndGetLinks() {
				var oParsedUrl = oShellServiceHelper.parseShellHash(document.location.hash);
				sCurrentSemObj = oParsedUrl.semanticObject; // Current Semantic Object
				sCurrentAction = oParsedUrl.action;
				return _getSOIntents(oObjectPageLayout, sCurrentSemObj, oParam);
			}

			fnGetParseShellHashAndGetLinks()
				.then(function(aLinks) {
					if (aLinks && aLinks.length > 0) {
						var oTargetParams = {};
						var aAnnotationsSOItems = [];
						var sEntitySetPath = oMetaPath + "@";
						var sEntityTypePath = oMetaPath + "/@";
						var oEntitySetAnnotations = oMetaModel.getObject(sEntitySetPath);
						oSemanticObjectAnnotations = _getSemanticObjectAnnotations(oEntitySetAnnotations, sCurrentSemObj);
						if (!oSemanticObjectAnnotations.bHasEntitySetSO) {
							var oEntityTypeAnnotations = oMetaModel.getObject(sEntityTypePath);
							oSemanticObjectAnnotations = _getSemanticObjectAnnotations(oEntityTypeAnnotations, sCurrentSemObj);
						}
						aExcludedActions = oSemanticObjectAnnotations.aUnavailableActions;
						//Skip same application from Related Apps
						aExcludedActions.push(sCurrentAction);
						oTargetParams.navigationContexts = oBindingContext;
						oTargetParams.semanticObjectMapping = oSemanticObjectAnnotations.aMappings;
						_getRelatedAppsMenuItems(aLinks, aExcludedActions, oTargetParams, aAnnotationsSOItems);
						aRelatedAppsMenuItems = aAnnotationsSOItems.concat(aManifestSOItems);
						// If no app in list, related apps button will be hidden
						oObjectPageLayout
							.getBindingContext("internal")
							.setProperty("relatedApps/visibility", aRelatedAppsMenuItems.length > 0);
						oObjectPageLayout.getBindingContext("internal").setProperty("relatedApps/items", aRelatedAppsMenuItems);
					} else {
						oObjectPageLayout.getBindingContext("internal").setProperty("relatedApps/visibility", false);
					}
				})
				.catch(function(oError) {
					Log.error("Cannot read links", oError);
				});
			return aRelatedAppsMenuItems;
		}

		/**
		 * @param {object} oEntityAnnotations Annotations at the EntitySet/EntityType level
		 * @param sCurrentSemObj
		 * @returns {object} Object containing one array of all semantic object mappings and another containing all SO unavailable actions
		 */
		function _getSemanticObjectAnnotations(oEntityAnnotations, sCurrentSemObj) {
			var oSemanticObjectAnnotations = {
				bHasEntitySetSO: false,
				aUnavailableActions: [],
				aMappings: []
			};
			var sAnnotationMappingTerm, sAnnotationActionTerm;
			var sQualifier;
			for (var key in oEntityAnnotations) {
				if (key.indexOf("com.sap.vocabularies.Common.v1.SemanticObject") > -1 && oEntityAnnotations[key] === sCurrentSemObj) {
					oSemanticObjectAnnotations.bHasEntitySetSO = true;
					sAnnotationMappingTerm = "@com.sap.vocabularies.Common.v1.SemanticObjectMapping";
					sAnnotationActionTerm = "@com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions";

					if (key.indexOf("#") > -1) {
						sQualifier = key.split("#")[1];
						sAnnotationMappingTerm = sAnnotationMappingTerm + "#" + sQualifier;
						sAnnotationActionTerm = sAnnotationActionTerm + "#" + sQualifier;
					}

					oSemanticObjectAnnotations.aMappings = oSemanticObjectAnnotations.aMappings.concat(
						oEntityAnnotations[sAnnotationMappingTerm]
					);
					oSemanticObjectAnnotations.aUnavailableActions = oSemanticObjectAnnotations.aUnavailableActions.concat(
						oEntityAnnotations[sAnnotationActionTerm]
					);

					break;
				}
			}
			return oSemanticObjectAnnotations;
		}

		function fnUpdateRelatedAppsDetails(oObjectPageLayout) {
			var oMetaModel = oObjectPageLayout.getModel().getMetaModel();
			var oBindingContext = oObjectPageLayout.getBindingContext();
			var oPath = oBindingContext && oBindingContext.getPath();
			var oMetaPath = oMetaModel.getMetaPath(oPath);
			// Semantic Key Vocabulary
			var sSemanticKeyVocabulary = oMetaPath + "/" + "@com.sap.vocabularies.Common.v1.SemanticKey";
			//Semantic Keys
			var aSemKeys = oMetaModel.getObject(sSemanticKeyVocabulary);
			// Unavailable Actions
			var oEntry = oBindingContext.getObject();
			if (!oEntry) {
				oBindingContext
					.requestObject()
					.then(function(oEntry) {
						return updateRelateAppsModel(oBindingContext, oEntry, oObjectPageLayout, aSemKeys, oMetaModel, oMetaPath);
					})
					.catch(function(oError) {
						Log.error("Cannot update the related app details", oError);
					});
			} else {
				return updateRelateAppsModel(oBindingContext, oEntry, oObjectPageLayout, aSemKeys, oMetaModel, oMetaPath);
			}
		}

		/**
		 * Fire Press on a Button.
		 * Test if oButton is an enabled and visible sap.m.Button before triggering a press event.
		 *
		 * @param {sap.m.Button | sap.m.OverflowToolbarButton} oButton A SAP UI5 Button
		 */
		function fnFireButtonPress(oButton) {
			var aAuthorizedTypes = ["sap.m.Button", "sap.m.OverflowToolbarButton"];
			if (
				oButton &&
				aAuthorizedTypes.indexOf(oButton.getMetadata().getName()) !== -1 &&
				oButton.getVisible() &&
				oButton.getEnabled()
			) {
				oButton.firePress();
			}
		}

		function fnResolveStringtoBoolean(sValue) {
			if (sValue === "true" || sValue === true) {
				return true;
			} else {
				return false;
			}
		}

		/**
		 * Retrieves the main component associated with a given control / view.
		 *
		 * @param {sap.ui.base.ManagedObject} oControl A managed object
		 * @returns {sap.fe.core.AppComponent} The SAP Fiori Element AppComponent
		 */
		function getAppComponent(oControl) {
			if (oControl.isA("sap.fe.core.AppComponent")) {
				return oControl;
			}
			var oOwner = Component.getOwnerComponentFor(oControl);
			if (!oOwner) {
				return oControl;
			} else {
				return getAppComponent(oOwner);
			}
		}

		/**
		 * Returns the containing view for the current control.
		 * In case the provided control is a {@link sap.ui.core.ComponentContainer},
		 * the root control of the contained component is used as a starting point,
		 * which might be the returned view itself.
		 *
		 * @param {sap.ui.base.ManagedObject} oControl The control to get the view for
		 * @returns {sap.ui.mvc.View} The view containing the given control
		 */
		function getTargetView(oControl) {
			if (oControl && oControl.isA("sap.ui.core.ComponentContainer")) {
				oControl = oControl.getComponentInstance();
				oControl = oControl && oControl.getRootControl();
			}
			while (oControl && !(oControl instanceof View)) {
				oControl = oControl.getParent();
			}
			return oControl;
		}

		function fnProcessDataLossOrDraftDiscardConfirmation(
			fnProcessFunction,
			fnCancelFunction,
			oContext,
			oController,
			bSkipBindingToView
		) {
			var oModel = oContext.getModel();
			var _bIsModified = false;
			var draftDataContext = oModel.bindContext(oContext.getPath() + "/DraftAdministrativeData").getBoundContext();
			if (
				oContext &&
				oContext.getObject() &&
				(!oContext.getObject().DraftAdministrativeData || oContext.getObject().IsActiveEntity === true)
			) {
				fnProcessFunction();
			} else {
				draftDataContext
					.requestObject()
					.then(function(draftAdminData) {
						if (draftAdminData) {
							_bIsModified = !(draftAdminData.CreationDateTime === draftAdminData.LastChangeDateTime);
							if (_bIsModified) {
								DataLossOrDraftDiscardHandler.performAfterDiscardorKeepDraft(
									fnProcessFunction,
									fnCancelFunction,
									oController,
									bSkipBindingToView
								);
							} else {
								fnProcessFunction();
							}
						} else {
							fnProcessFunction();
						}
					})
					.catch(function(oError) {
						Log.error("Cannot retrieve draftDataContext information", oError);
					});
			}
		}

		/**
		 * FE MessageBox to confirm in case data loss warning is to be given.
		 *
		 * @param {Function} fnProcess Task to be performed if user confirms.
		 * @param {sap.ui.core.Control} oControl Control responsible for the the trigger of the dialog
		 * @param {string} programmingModel Type of transaction model
		 * @param oController
		 * @returns {object} MessageBox if confirmation is required else the fnProcess function.
		 */
		function fnProcessDataLossConfirmation(fnProcess, oControl, programmingModel, oController) {
			var bUIEditable = oControl.getModel("ui").getProperty("/isEditable"),
				oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.templates"),
				sWarningMsg = oResourceBundle && oResourceBundle.getText("T_COMMON_UTILS_NAVIGATION_AWAY_MSG"),
				sConfirmButtonTxt = oResourceBundle && oResourceBundle.getText("T_COMMON_UTILS_NAVIGATION_AWAY_CONFIRM_BUTTON"),
				sCancelButtonTxt = oResourceBundle && oResourceBundle.getText("T_COMMON_UTILS_NAVIGATION_AWAY_CANCEL_BUTTON");

			if (programmingModel === ProgrammingModel.Sticky && bUIEditable) {
				return MessageBox.warning(sWarningMsg, {
					actions: [sConfirmButtonTxt, sCancelButtonTxt],
					onClose: function(sAction) {
						if (sAction === sConfirmButtonTxt) {
							var oInternalModel = oControl && oControl.getModel("internal");

							Log.info("Navigation confirmed.");
							if (oInternalModel) {
								oInternalModel.setProperty("/sessionOn", false);
							} else {
								Log.warning("Local UIModel couldn't be found.");
							}
							fnProcess();
						} else {
							Log.info("Navigation rejected.");
						}
					}
				});
			}
			return fnProcess();
		}

		/**
		 * Check if Path based FieldControl Evaluates to inapplicable.
		 *
		 * @param {string} sFieldControlPath Field control path
		 * @param {object} oAttribute SemanticAttributes
		 * @returns {boolean} `true` if inapplicable
		 *
		 */
		function isFieldControlPathInapplicable(sFieldControlPath, oAttribute) {
			var bInapplicable = false,
				aParts = sFieldControlPath.split("/");
			// sensitive data is removed only if the path has already been resolved.
			if (aParts.length > 1) {
				bInapplicable =
					oAttribute[aParts[0]] && oAttribute[aParts[0]].hasOwnProperty(aParts[1]) && oAttribute[aParts[0]][aParts[1]] === 0;
			} else {
				bInapplicable = oAttribute[sFieldControlPath] === 0;
			}
			return bInapplicable;
		}

		/**
		 * Removes sensitive data from the semantic attribute with respect to entitySet.
		 *
		 * @param {Array} aAttributes Array of 'semantic Attributes' - context Data
		 * @param {boolean} oMetaModel V4 MetaModel for anntations
		 * @returns {Array} Array of semantic Attributes
		 **/

		function removeSensitiveData(aAttributes, oMetaModel) {
			var aOutAttributes = [];
			for (var i = 0; i < aAttributes.length; i++) {
				var sEntitySet = aAttributes[i].entitySet,
					oAttribute = aAttributes[i].contextData,
					aProperties;

				delete oAttribute["@odata.context"];
				delete oAttribute["%40odata.context"];
				delete oAttribute["@odata.metadataEtag"];
				delete oAttribute["%40odata.metadataEtag"];
				delete oAttribute["SAP__Messages"];
				aProperties = Object.keys(oAttribute);
				for (var j = 0; j < aProperties.length; j++) {
					var sProp = aProperties[j],
						aPropertyAnnotations = oMetaModel.getObject("/" + sEntitySet + "/" + sProp + "@");
					if (aPropertyAnnotations) {
						if (
							aPropertyAnnotations["@com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"] ||
							aPropertyAnnotations["@com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext"] ||
							aPropertyAnnotations["@com.sap.vocabularies.Analytics.v1.Measure"]
						) {
							delete oAttribute[sProp];
						} else if (aPropertyAnnotations["@com.sap.vocabularies.Common.v1.FieldControl"]) {
							var oFieldControl = aPropertyAnnotations["@com.sap.vocabularies.Common.v1.FieldControl"];
							if (oFieldControl["$EnumMember"] && oFieldControl["$EnumMember"].split("/")[1] === "Inapplicable") {
								delete oAttribute[sProp];
							} else if (
								oFieldControl["$Path"] &&
								CommonUtils.isFieldControlPathInapplicable(oFieldControl["$Path"], oAttribute)
							) {
								delete oAttribute[sProp];
							}
						}
					}
				}
				aOutAttributes.push(oAttribute);
			}

			return aOutAttributes;
		}

		function _fnCheckIsMatch(oObject, oKeysToCheck) {
			for (var sKey in oKeysToCheck) {
				if (oKeysToCheck[sKey] !== oObject[sKey]) {
					return false;
				}
			}
			return true;
		}

		/**
		 * Method to get metadata of entityset properties.
		 *
		 * @param {object} oMetaModel MetaModel for annotations
		 * @param {string} sContextPath ContextPath for properities
		 * @param {object} oFilter Filter for the properties
		 * @returns {object} The entity type properties
		 */
		function fnGetContextPathProperties(oMetaModel, sContextPath, oFilter) {
			var oEntityType = oMetaModel.getObject(sContextPath + "/") || {},
				oProperties = {};

			for (var sKey in oEntityType) {
				if (
					oEntityType.hasOwnProperty(sKey) &&
					!/^\$/i.test(sKey) &&
					oEntityType[sKey].$kind &&
					_fnCheckIsMatch(oEntityType[sKey], oFilter || { $kind: "Property" })
				) {
					oProperties[sKey] = oEntityType[sKey];
				}
			}
			return oProperties;
		}

		/**
		 * Method to get madatory filterfields.
		 *
		 * @param {object} oMetaModel MetaModel for annotations
		 * @param {string} sContextPath ContextPath for properities
		 * @returns {object[]} The mandatory filter fields
		 */
		function fnGetMandatoryFilterFields(oMetaModel, sContextPath) {
			var aMandatoryFilterFields;
			if (oMetaModel && sContextPath) {
				aMandatoryFilterFields = oMetaModel.getObject(
					sContextPath + "@Org.OData.Capabilities.V1.FilterRestrictions/RequiredProperties"
				);
			}
			return aMandatoryFilterFields;
		}

		/**
		 * Method to get madatory filterfields
		 *
		 * @param {object} oControl Control containing IBN Actions
		 * @param {Array} aIBNActions array filled with IBN Actions
		 * @returns {Array} array containing the IBN Actions
		 *
		 */

		function fnGetIBNActions(oControl, aIBNActions) {
			var aActions = oControl && oControl.getActions();
			if (aActions) {
				aActions.forEach(function(oAction) {
					if (oAction.isA("sap.ui.mdc.actiontoolbar.ActionToolbarAction")) {
						oAction = oAction.getAction();
					}
					if (oAction.data("IBNData")) {
						aIBNActions.push(oAction);
					}
				});
			}
			return aIBNActions;
		}

		/**
		 * Method to update the IBN Buttons Visibility.
		 *
		 * @param {Array} aIBNActions Array containing all the IBN Actions with requires context false
		 * @param {object} oView Instance of the view
		 */
		function fnUpdateDataFieldForIBNButtonsVisibility(aIBNActions, oView) {
			var that = this;
			var oParams = {};
			var fnGetLinks = function(oData) {
				if (oData) {
					var aKeys = Object.keys(oData);
					aKeys.map(function(sKey) {
						if (sKey.indexOf("_") !== 0 && sKey.indexOf("odata.context") === -1) {
							oParams[sKey] = { value: oData[sKey] };
						}
					});
				}
				if (aIBNActions.length) {
					aIBNActions.forEach(function(oIBNAction) {
						var sSemanticObject = oIBNAction.data("IBNData").semanticObject;
						var sAction = oIBNAction.data("IBNData").action;
						that.getShellServices(oView)
							.getLinks({
								semanticObject: sSemanticObject,
								action: sAction,
								params: oParams
							})
							.then(function(aLink) {
								oIBNAction.setVisible(oIBNAction.getVisible() && aLink && aLink.length === 1);
							})
							.catch(function(oError) {
								Log.error("Cannot retrieve the links from the shell service", oError);
							});
					});
				}
			};
			if (oView && oView.getBindingContext()) {
				oView
					.getBindingContext()
					.requestObject()
					.then(function(oData) {
						return fnGetLinks(oData);
					})
					.catch(function(oError) {
						Log.error("Cannot retrieve the links from the shell service", oError);
					});
			} else {
				fnGetLinks();
			}
		}

		/**
		 * Creates the updated key to check the i18n override and fallbacks to the old value if the new value is not available for the same key.
		 *
		 * @param {string} sFrameworkKey Current key.
		 * @param {object} oResourceBundle Contains the local resource bundle
		 * @param {object} [oParams] Parameter object for the resource value
		 * @param {string} [sEntitySetName] EntitySet name of the control where the resource is being used
		 * @returns {string} The translated text
		 */
		function getTranslatedText(sFrameworkKey, oResourceBundle, oParams, sEntitySetName) {
			var sResourceKey = sFrameworkKey;
			if (oResourceBundle) {
				if (sEntitySetName) {
					// There are console errors logged when making calls to getText for keys that are not defined in the resource bundle
					// for instance keys which are supposed to be provided by the application, e.g, <key>|<entitySet> to override instance specific text
					// hence check if text exists (using "hasText") in the resource bundle before calling "getText"

					// "hasText" only checks for the key in the immediate resource bundle and not it's custom bundles
					// hence we need to do this recurrsively to check if the key exists in any of the bundles the forms the FE resource bundle
					var bResourceKeyExists = _checkIfResourceKeyExists(
						oResourceBundle.aCustomBundles,
						sFrameworkKey + "|" + sEntitySetName
					);

					// if resource key with entity set name for instance specific text overriding is provided by the application
					// then use the same key otherwise use the Framework key
					sResourceKey = bResourceKeyExists ? sFrameworkKey + "|" + sEntitySetName : sFrameworkKey;
				}
				return oResourceBundle.getText(sResourceKey, oParams);
			}

			// do not allow override so get text from the internal bundle directly
			oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");
			return oResourceBundle.getText(sResourceKey, oParams);
		}

		function _checkIfResourceKeyExists(aCustomBundles, sKey) {
			if (aCustomBundles.length) {
				for (var i = aCustomBundles.length - 1; i >= 0; i--) {
					var sValue = aCustomBundles[i].hasText(sKey);
					// text found return true
					if (sValue) {
						return true;
					}
					_checkIfResourceKeyExists(aCustomBundles[i].aCustomBundles, sKey);
				}
			}
			return false;
		}

		/**
		 * Returns the metamodel path correctly for bound actions if used with bReturnOnlyPath as true,
		 * else returns an object which has 3 properties related to the action. They are the entity set name,
		 * the $Path value of the OperationAvailable annotation and the binding parameter name. If
		 * bCheckStaticValue is true, returns the static value of OperationAvailable annotation, if present.
		 * e.g. for bound action someNameSpace.SomeBoundAction
		 * of entity set SomeEntitySet, the string "/SomeEntitySet/someNameSpace.SomeBoundAction" is returned.
		 *
		 * @param {oAction} oAction Context object of the action
		 * @param {boolean} bReturnOnlyPath If false, additional info is returned along with metamodel path to the bound action
		 * @param {string} sActionName Name of the bound action of the form someNameSpace.SomeBoundAction
		 * @param {boolean} bCheckStaticValue If true, the static value of OperationAvailable is returned, if present
		 * @returns {string|object} String or object as specified by bReturnOnlyPath
		 * @private
		 * @ui5-restricted
		 */
		function getActionPath(oAction, bReturnOnlyPath, sActionName, bCheckStaticValue) {
			sActionName = !sActionName ? oAction.getObject(oAction.getPath()) : sActionName;
			var sContextPath = oAction.getPath().split("/@")[0];
			var sEntityTypeName = oAction.getObject(sContextPath).$Type;
			var sEntityName = getEntitySetName(oAction.getModel(), sEntityTypeName);
			if (sEntityName) {
				sContextPath = "/" + sEntityName;
			}
			if (bCheckStaticValue) {
				return oAction.getObject(sContextPath + "/" + sActionName + "@Org.OData.Core.V1.OperationAvailable");
			}
			if (bReturnOnlyPath) {
				return sContextPath + "/" + sActionName;
			} else {
				return {
					sContextPath: sContextPath,
					sProperty: oAction.getObject(sContextPath + "/" + sActionName + "@Org.OData.Core.V1.OperationAvailable/$Path"),
					sBindingParameter: oAction.getObject(sContextPath + "/" + sActionName + "/@$ui5.overload/0/$Parameter/0/$Name")
				};
			}
		}

		function getEntitySetName(oMetaModel, sEntityType) {
			var oEntityContainer = oMetaModel.getObject("/");
			for (var key in oEntityContainer) {
				if (typeof oEntityContainer[key] === "object" && oEntityContainer[key].$Type === sEntityType) {
					return key;
				}
			}
		}

		function computeDisplayMode(oPropertyAnnotations, oCollectionAnnotations) {
			var oTextAnnotation = oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text"],
				oTextArrangementAnnotation =
					oTextAnnotation &&
					((oPropertyAnnotations &&
						oPropertyAnnotations["@com.sap.vocabularies.Common.v1.Text@com.sap.vocabularies.UI.v1.TextArrangement"]) ||
						(oCollectionAnnotations && oCollectionAnnotations["@com.sap.vocabularies.UI.v1.TextArrangement"]));

			if (oTextArrangementAnnotation) {
				if (oTextArrangementAnnotation.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly") {
					return "Description";
				} else if (oTextArrangementAnnotation.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast") {
					return "ValueDescription";
				} else if (oTextArrangementAnnotation.$EnumMember === "com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate") {
					return "Value";
				}
				//Default should be TextFirst if there is a Text annotation and neither TextOnly nor TextLast are set
				return "DescriptionValue";
			}
			return oTextAnnotation ? "DescriptionValue" : "Value";
		}

		function _getEntityType(oContext) {
			var oMetaModel = oContext.getModel().getMetaModel();
			return oMetaModel.getObject(oMetaModel.getMetaPath(oContext.getPath()) + "/$Type");
		}

		function _requestObject(sAction, oSelectedContext, sProperty) {
			var oContext = oSelectedContext,
				nBracketIndex = sAction.indexOf("(");

			if (nBracketIndex > -1) {
				var sTargetType = sAction.slice(nBracketIndex + 1, -1),
					sCurrentType = _getEntityType(oContext);

				while (sCurrentType !== sTargetType) {
					// Find parent binding context and retrieve entity type
					oContext = oContext.getBinding().getContext();
					if (oContext) {
						sCurrentType = _getEntityType(oContext);
					} else {
						Log.warn("Cannot determine target type to request property value for bound action invocation");
						return Promise.resolve(undefined);
					}
				}
			}

			return oContext.requestObject(sProperty);
		}

		function _requestProperty(oSelectedContext, sAction, sProperty, sDynamicActionEnabledPath) {
			var oPromise =
				sProperty && sProperty.indexOf("/") === 0
					? requestSingletonProperty(sProperty, oSelectedContext.getModel())
					: _requestObject(sAction, oSelectedContext, sProperty);

			return oPromise.then(function(vPropertyValue) {
				return Promise.resolve({
					vPropertyValue: vPropertyValue,
					oSelectedContext: oSelectedContext,
					sAction: sAction,
					sDynamicActionEnabledPath: sDynamicActionEnabledPath
				});
			});
		}

		function _setContextsBasedOnOperationAvailable(oInternalModelContext, aRequestPromises) {
			return Promise.all(aRequestPromises)
				.then(function(aResults) {
					if (aResults.length) {
						var aApplicableContexts = [],
							aNotApplicableContexts = [];
						aResults.forEach(function(aResult) {
							if (aResult) {
								if (aResult.vPropertyValue) {
									oInternalModelContext.getModel().setProperty(aResult.sDynamicActionEnabledPath, true);
									aApplicableContexts.push(aResult.oSelectedContext);
								} else {
									aNotApplicableContexts.push(aResult.oSelectedContext);
								}
							}
						});
						_setDynamicActionContexts(oInternalModelContext, aResults[0].sAction, aApplicableContexts, aNotApplicableContexts);
					}
				})
				.catch(function(oError) {
					Log.trace("Cannot retrieve property value from path", oError);
				});
		}

		function _setDynamicActionContexts(oInternalModelContext, sAction, aApplicable, aNotApplicable) {
			var sDynamicActionPathPrefix = oInternalModelContext.getPath() + "/dynamicActions/" + sAction,
				oInternalModel = oInternalModelContext.getModel();
			oInternalModel.setProperty(sDynamicActionPathPrefix + "/aApplicable", aApplicable);
			oInternalModel.setProperty(sDynamicActionPathPrefix + "/aNotApplicable", aNotApplicable);
		}

		/**
		 * Sets the 'enabled' property along with the applicable selected contexts of dynamic actions.
		 *
		 * @param oInternalModelContext The instance of the internal model context
		 * @param oActionOperationAvailableMap The collection of action names and properties configured as Core.OperationAvailable paths
		 * @param aSelectedContexts The array of selected contexts in the table
		 * @returns {Promise} A promise that sets the 'enabled' property for all dynamic actions
		 */
		function setActionEnablement(oInternalModelContext, oActionOperationAvailableMap, aSelectedContexts) {
			var aPromises = [];
			for (var sAction in oActionOperationAvailableMap) {
				// Reset all properties before computation
				oInternalModelContext.setProperty("dynamicActions/" + sAction, {
					bEnabled: false,
					aApplicable: [],
					aNotApplicable: []
				});
				// Note that non dynamic actions are not processed here. They are enabled because
				// one or more are selected and the second part of the condition in the templating
				// is then undefined and thus the button takes the default enabling, which is true!
				var aApplicable = [],
					aNotApplicable = [],
					sProperty = oActionOperationAvailableMap[sAction],
					sDynamicActionEnabledPath = oInternalModelContext.getPath() + "/dynamicActions/" + sAction + "/bEnabled";

				if (typeof sProperty === "object" && sProperty !== null && sProperty !== undefined) {
					for (var i = 0; i < aSelectedContexts.length; i++) {
						var oSelectedContext = aSelectedContexts[i];
						if (oSelectedContext) {
							var oContextData = oSelectedContext.getObject();
							var oTransformedBinding = BindingExpression.transformRecursively(
								sProperty,
								"Binding",
								// eslint-disable-next-line no-loop-func
								function(oBindingExpression) {
									return BindingExpression.constant(oContextData[oBindingExpression.path]);
								},
								true
							);
							var sResult = BindingExpression.compileBinding(oTransformedBinding);
							if (sResult === "true") {
								oInternalModelContext.getModel().setProperty(sDynamicActionEnabledPath, true);
								aApplicable.push(oSelectedContext);
							} else {
								aNotApplicable.push(oSelectedContext);
							}
						}
					}
					_setDynamicActionContexts(oInternalModelContext, sAction, aApplicable, aNotApplicable);
				} else {
					var aRequestPromises = [];
					for (var i = 0; i < aSelectedContexts.length; i++) {
						var oSelectedContext = aSelectedContexts[i];
						if (oSelectedContext) {
							var oContextData = oSelectedContext.getObject();
							if (sProperty === null && !!oContextData["#" + sAction]) {
								//look for action advertisement if present and its value is not null
								oInternalModelContext.getModel().setProperty(sDynamicActionEnabledPath, true);
								break;
							} else {
								// Collect promises to retrieve singleton or normal property value asynchronously
								aRequestPromises.push(_requestProperty(oSelectedContext, sAction, sProperty, sDynamicActionEnabledPath));
							}
						}
					}

					// When all property values have been retrieved, set
					// The applicable and not-applicable selected contexts for each action and
					// The enabled property of the dynamic action in internal model context.
					aPromises.push(_setContextsBasedOnOperationAvailable(oInternalModelContext, aRequestPromises));
				}
			}
			return Promise.all(aPromises);
		}

		function _getDefaultOperators(oRealProperty) {
			// mdc defines the full set of operations that are meaningful for each Edm Type
			var oDataClass = TypeUtil.getDataTypeClassName(oRealProperty);
			var oBaseType = TypeUtil.getBaseType(oDataClass);
			return FilterOperatorUtil.getOperatorsForType(oBaseType);
		}

		function _getRestrictions(aDefaultOps, aExpressionOps) {
			// From the default set of Operators for the Base Type, select those that are defined in the Allowed Value.
			// In case that no operators are found, return undefined so that the default set is used.
			var aOperators = aDefaultOps.filter(function(sElement) {
				return aExpressionOps.indexOf(sElement) > -1;
			});
			return aOperators.toString() || undefined;
		}

		function getSpecificAllowedExpression(aExpressions) {
			var aAllowedExpressionsPriority = CommonUtils.AllowedExpressionsPrio;

			aExpressions.sort(function(a, b) {
				return aAllowedExpressionsPriority.indexOf(a) - aAllowedExpressionsPriority.indexOf(b);
			});

			return aExpressions[0];
		}

		function getOperatorsForProperty(sProperty, sEntitySetPath, oContext, sType, bUseSemanticDateRange, sSettings) {
			var oFilterRestrictions = CommonUtils.getFilterRestrictionsByPath(sEntitySetPath, oContext);
			var aEqualsOps = ["EQ"];
			var aSingleRangeOps = ["EQ", "GE", "LE", "LT", "GT", "BT", "NOTLE", "NOTLT", "NOTGE", "NOTGT"];
			var aMultiRangeOps = ["EQ", "GE", "LE", "LT", "GT", "BT", "NE", "NOTBT", "NOTLE", "NOTLT", "NOTGE", "NOTGT"];
			var aSearchExpressionOps = ["Contains", "NotContains", "StartsWith", "NotStartsWith", "EndsWith", "NotEndsWith"];
			var aSemanticDateOpsExt = SemanticDateOperators.getSupportedOperations();
			var bSemanticDateRange = bUseSemanticDateRange === "true" || bUseSemanticDateRange === true;
			var aSemanticDateOps = [];
			var oSettings = typeof sSettings === "string" ? JSON.parse(sSettings).customData : sSettings;

			if (oContext.getObject(sEntitySetPath + "/@com.sap.vocabularies.Common.v1.ResultContext") === true) {
				return aEqualsOps.toString();
			}

			if (oSettings && oSettings.operatorConfiguration && oSettings.operatorConfiguration.length > 0) {
				aSemanticDateOps = SemanticDateOperators.getFilterOperations(oSettings.operatorConfiguration);
			} else {
				aSemanticDateOps = SemanticDateOperators.getSemanticDateOperations();
			}

			// Get the default Operators for this Property Type
			var aDefaultOperators = _getDefaultOperators(sType);

			// Is there a Filter Restriction defined for this property?
			if (
				oFilterRestrictions &&
				oFilterRestrictions.FilterAllowedExpressions &&
				oFilterRestrictions.FilterAllowedExpressions[sProperty]
			) {
				// Extending the default operators list with Semantic Date options DATERANGE, DATE, FROM and TO
				if (bSemanticDateRange) {
					aDefaultOperators = aSemanticDateOpsExt.concat(aDefaultOperators);
				}

				var sAllowedExpression = CommonUtils.getSpecificAllowedExpression(oFilterRestrictions.FilterAllowedExpressions[sProperty]);
				var sRestrictions;
				// In case more than one Allowed Expressions has been defined for a property
				// choose the most restrictive Allowed Expression

				// MultiValue has same Operator as SingleValue, but there can be more than one (maxConditions)
				switch (sAllowedExpression) {
					case "SingleValue":
						sRestrictions = _getRestrictions(aDefaultOperators, aEqualsOps);
						break;
					case "MultiValue":
						sRestrictions = _getRestrictions(aDefaultOperators, aEqualsOps);
						break;
					case "SingleRange":
						var sOperators = _getRestrictions(
							aDefaultOperators,
							sType === "Edm.Date" && bSemanticDateRange ? aSemanticDateOps : aSingleRangeOps
						);
						sRestrictions = sOperators ? sOperators : "";
						break;
					case "MultiRange":
						sRestrictions = _getRestrictions(aDefaultOperators, aMultiRangeOps);
						break;
					case "SearchExpression":
						sRestrictions = _getRestrictions(aDefaultOperators, aSearchExpressionOps);
						break;
					case "MultiRangeOrSearchExpression":
						sRestrictions = _getRestrictions(aDefaultOperators, aSearchExpressionOps.concat(aMultiRangeOps));
						break;

					default:
						break;
				}
				// In case AllowedExpressions is not recognised, undefined in return results in the default set of
				// operators for the type.
				return sRestrictions;
			} else if (sType === "Edm.Date") {
				// In case AllowedExpressions is not provided for type Edm.Date then all the default
				// operators for the type should be returned excluding semantic operators from the list.
				aSemanticDateOps = SemanticDateOperators.getSemanticDateOperations();
				var aOperators = aDefaultOperators.filter(function(sElement) {
					return aSemanticDateOps.indexOf(sElement) < 0;
				});
				return aOperators.toString();
			}
		}

		function getParameterInfo(oMetaModel, sContextPath) {
			var sParameterContextPath = sContextPath.substring(0, sContextPath.lastIndexOf("/"));
			var bResultContext = oMetaModel.getObject(sParameterContextPath + "/@com.sap.vocabularies.Common.v1.ResultContext");
			var oParameterInfo = {};
			if (bResultContext && sParameterContextPath !== sContextPath) {
				oParameterInfo.contextPath = sParameterContextPath;
				oParameterInfo.parameterProperties = CommonUtils.getContextPathProperties(oMetaModel, sParameterContextPath);
			}
			return oParameterInfo;
		}

		function addSelectOptionToConditions(oPropertyMetadata, aValidOperators, aCumulativeConditions, oSelectOption) {
			var oCondition = FilterHelper.getConditions(oSelectOption, oPropertyMetadata);
			if (oCondition) {
				if (!aValidOperators || aValidOperators.indexOf(oCondition.operator) > -1) {
					aCumulativeConditions.push(oCondition);
				}
			}
			return aCumulativeConditions;
		}

		function addSelectOptionsToConditions(
			sContextPath,
			oSelectionVariant,
			sSelectOptionProp,
			oConditions,
			sConditionPath,
			sConditionProp,
			oValidProperties,
			oMetaModel,
			isParameter
		) {
			var aConditions = [],
				aSelectOptions,
				aValidOperators;

			if (isParameter || CommonUtils.isPropertyFilterable(oMetaModel, sContextPath, sConditionProp, true)) {
				aSelectOptions = oSelectionVariant.getSelectOption(sSelectOptionProp);
				aValidOperators = isParameter ? ["EQ"] : CommonUtils.getOperatorsForProperty(sConditionProp, sContextPath, oMetaModel);
				var oPropertyMetadata = oValidProperties[sConditionProp];
				// Create conditions for all the selectOptions of the property
				aConditions = isParameter
					? addSelectOptionToConditions(oPropertyMetadata, aValidOperators, aConditions, aSelectOptions[0])
					: aSelectOptions.reduce(addSelectOptionToConditions.bind(null, oPropertyMetadata, aValidOperators), aConditions);
				if (aConditions.length) {
					if (sConditionPath) {
						oConditions[sConditionPath + sConditionProp] = oConditions.hasOwnProperty(sConditionPath + sConditionProp)
							? oConditions[sConditionPath + sConditionProp].concat(aConditions)
							: aConditions;
					} else {
						oConditions[sConditionProp] = oConditions.hasOwnProperty(sConditionProp)
							? oConditions[sConditionProp].concat(aConditions)
							: aConditions;
					}
				}
			}
		}

		/**
		 * Method to convert selection variant to conditions.
		 * @param {object} oSelectionVariant SelectionVariant to be converted.
		 * @param {object} oConditions Conditions object to be extended.
		 * @param {object} oMetaModel Odata V4 metamodel.
		 * @param {string} sContextPath ContextPath for the SV properties.
		 * @returns {object}
		 */
		function addSelectionVariantToConditions(oSelectionVariant, oConditions, oMetaModel, sContextPath) {
			var aSelectOptionsPropertyNames = oSelectionVariant.getSelectOptionsPropertyNames(),
				oValidProperties = CommonUtils.getContextPathProperties(oMetaModel, sContextPath),
				aMetadatProperties = Object.keys(oValidProperties),
				oParameterInfo = CommonUtils.getParameterInfo(oMetaModel, sContextPath),
				sParameterContextPath = oParameterInfo.contextPath,
				oValidParameterProperties = oParameterInfo.parameterProperties,
				bHasParameters =
					!!oParameterInfo.contextPath && oValidParameterProperties && Object.keys(oValidParameterProperties).length > 0;

			if (bHasParameters) {
				var aMetadataParameters = Object.keys(oValidParameterProperties);
				aMetadataParameters.forEach(function(sMetadataParameter) {
					var sSelectOptionName;
					if (aSelectOptionsPropertyNames.includes("$Parameter." + sMetadataParameter)) {
						sSelectOptionName = "$Parameter." + sMetadataParameter;
					} else if (aSelectOptionsPropertyNames.includes(sMetadataParameter)) {
						sSelectOptionName = sMetadataParameter;
					} else if (
						sMetadataParameter.startsWith("P_") &&
						aSelectOptionsPropertyNames.includes("$Parameter." + sMetadataParameter.slice(2, sMetadataParameter.length))
					) {
						sSelectOptionName = "$Parameter." + sMetadataParameter.slice(2, sMetadataParameter.length);
					} else if (
						sMetadataParameter.startsWith("P_") &&
						aSelectOptionsPropertyNames.includes(sMetadataParameter.slice(2, sMetadataParameter.length))
					) {
						sSelectOptionName = sMetadataParameter.slice(2, sMetadataParameter.length);
					} else if (aSelectOptionsPropertyNames.includes("$Parameter.P_" + sMetadataParameter)) {
						sSelectOptionName = "$Parameter.P_" + sMetadataParameter;
					} else if (aSelectOptionsPropertyNames.includes("P_" + sMetadataParameter)) {
						sSelectOptionName = "P_" + sMetadataParameter;
					}

					if (sSelectOptionName) {
						addSelectOptionsToConditions(
							sParameterContextPath,
							oSelectionVariant,
							sSelectOptionName,
							oConditions,
							undefined,
							sMetadataParameter,
							oValidParameterProperties,
							oMetaModel,
							true
						);
					}
				});
			}
			aMetadatProperties.forEach(function(sMetadataProperty) {
				var sSelectOptionName;
				if (aSelectOptionsPropertyNames.includes(sMetadataProperty)) {
					sSelectOptionName = sMetadataProperty;
				} else if (
					sMetadataProperty.startsWith("P_") &&
					aSelectOptionsPropertyNames.includes(sMetadataProperty.slice(2, sMetadataProperty.length))
				) {
					sSelectOptionName = sMetadataProperty.slice(2, sMetadataProperty.length);
				} else if (aSelectOptionsPropertyNames.includes("P_" + sMetadataProperty)) {
					sSelectOptionName = "P_" + sMetadataProperty;
				}
				if (sSelectOptionName) {
					addSelectOptionsToConditions(
						sContextPath,
						oSelectionVariant,
						sSelectOptionName,
						oConditions,
						undefined,
						sMetadataProperty,
						oValidProperties,
						oMetaModel,
						false
					);
				}
			});

			aSelectOptionsPropertyNames.forEach(function(sSelectOption) {
				if (sSelectOption.indexOf(".") > 0 && !sSelectOption.includes("$Parameter")) {
					var sFullContextPath = ("/" + sSelectOption.replaceAll(".", "/")).startsWith(sContextPath)
						? "/" + sSelectOption.replaceAll(".", "/")
						: sContextPath + "/" + sSelectOption.replaceAll(".", "/"); // check if the full path, eg SalesOrderManage._Item.Material exists in the metamodel
					if (oMetaModel.getObject(sFullContextPath.replace("P_", ""))) {
						_createConditionsForNavProperties(
							sFullContextPath,
							sContextPath,
							oSelectionVariant,
							sSelectOption,
							oMetaModel,
							oConditions
						);
					}
				}
			});
			return oConditions;
		}

		function _createConditionsForNavProperties(
			sFullContextPath,
			sMainEntitySetPath,
			oSelectionVariant,
			sSelectOption,
			oMetaModel,
			oConditions
		) {
			var aNavObjectNames = sSelectOption.split(".");
			// Eg: "SalesOrderManage._Item._Material.Material" or "_Item.Material"
			if (("/" + sSelectOption.replaceAll(".", "/")).startsWith(sMainEntitySetPath)) {
				var sFullPath = ("/" + sSelectOption).replaceAll(".", "/"),
					sNavPath = sFullPath.replace(sMainEntitySetPath + "/", "");
				aNavObjectNames = sNavPath.split("/");
			}
			var sConditionPath = "";
			var sPropertyName = aNavObjectNames[aNavObjectNames.length - 1]; // Material from SalesOrderManage._Item.Material
			for (var i = 0; i < aNavObjectNames.length - 1; i++) {
				if (oMetaModel.getObject(sMainEntitySetPath + "/" + aNavObjectNames[i].replace("P_", "")).$isCollection) {
					sConditionPath = sConditionPath + aNavObjectNames[i] + "*/"; // _Item*/ in case of 1:n cardinality
				} else {
					sConditionPath = sConditionPath + aNavObjectNames[i] + "/"; // _Item/ in case of 1:1 cardinality
				}
				sMainEntitySetPath = sMainEntitySetPath + "/" + aNavObjectNames[i];
			}
			var sNavPropertyPath = sFullContextPath.slice(0, sFullContextPath.lastIndexOf("/")),
				oValidProperties = CommonUtils.getContextPathProperties(oMetaModel, sNavPropertyPath),
				aSelectOptionsPropertyNames = oSelectionVariant.getSelectOptionsPropertyNames();
			var sSelectOptionName = sPropertyName;
			if (oValidProperties[sPropertyName]) {
				sSelectOptionName = sPropertyName;
			} else if (sPropertyName.startsWith("P_") && oValidProperties[sPropertyName.replace("P_", "")]) {
				sSelectOptionName = sPropertyName.replace("P_", "");
			} else if (oValidProperties["P_" + sPropertyName] && aSelectOptionsPropertyNames.includes("P_" + sPropertyName)) {
				sSelectOptionName = "P_" + sPropertyName;
			}
			if (sPropertyName.startsWith("P_") && oConditions[sConditionPath + sSelectOptionName]) {
				// if there is no SalesOrderManage._Item.Material yet in the oConditions
				return;
			} else if (!sPropertyName.startsWith("P_") && oConditions[sConditionPath + sSelectOptionName]) {
				delete oConditions[sConditionPath + sSelectOptionName];
				addSelectOptionsToConditions(
					sNavPropertyPath,
					oSelectionVariant,
					sSelectOption,
					oConditions,
					sConditionPath,
					sSelectOptionName,
					oValidProperties,
					oMetaModel,
					false
				);
			} else {
				addSelectOptionsToConditions(
					sNavPropertyPath,
					oSelectionVariant,
					sSelectOption,
					oConditions,
					sConditionPath,
					sSelectOptionName,
					oValidProperties,
					oMetaModel,
					false
				);
			}
		}

		/**
		 * Method to add condtions of page context to SelectionVariant.
		 * @param {object} oSelectionVariant Instance of {@link sap.fe.navigation.SelectionVariant} SelectionVariant to be used.
		 * @param {Array} mPageContext Conditons to be added to the SelectionVariant
		 * @param oView
		 * @returns {object} Instance of {@link sap.fe.navigation.SelectionVariant} SelectionVariant with the conditions.
		 * @private
		 * @ui5-restricted
		 * @example <code>
		 * </code>
		 */
		function addPageContextToSelectionVariant(oSelectionVariant, mPageContext, oView) {
			var oAppComponent = CommonUtils.getAppComponent(oView);
			var oNavigationService = oAppComponent.getNavigationService();
			return oNavigationService.mixAttributesAndSelectionVariant(mPageContext, oSelectionVariant.toJSONString());
		}

		/**
		 * Method to add condtions to SelectionVariant.
		 * @param {object} oSelectionVariant Instance of {@link sap.fe.navigation.SelectionVariant} SelectionVariant to be used.
		 * @param {object} mFilters Conditons to be added to the SelectionVariant
		 * @param {object} oTargetInfo Object returned after selection variant from the table is prepared.
		 * @returns {object} Instance of {@link sap.fe.navigation.SelectionVariant} SelectionVariant with the conditions.
		 * @private
		 * @ui5-restricted
		 * @example <code>
		 * </code>
		 */
		function addExternalStateFiltersToSelectionVariant(oSelectionVariant, mFilters, oTargetInfo) {
			var sFilter,
				sLow = "",
				sHigh = null;
			var fnGetSignAndOption = function(sOperator, sLowValue, sHighValue) {
				var oSelectOptionState = {
					option: "",
					sign: "I",
					low: sLowValue,
					high: sHighValue
				};
				switch (sOperator) {
					case "Contains":
						oSelectOptionState.option = "CP";
						break;
					case "StartsWith":
						oSelectOptionState.option = "CP";
						oSelectOptionState.low += "*";
						break;
					case "EndsWith":
						oSelectOptionState.option = "CP";
						oSelectOptionState.low = "*" + oSelectOptionState.low;
						break;
					case "BT":
					case "LE":
					case "LT":
					case "GT":
					case "NE":
					case "EQ":
						oSelectOptionState.option = sOperator;
						break;
					case "EEQ":
						oSelectOptionState.option = "EQ";
						break;
					case "Empty":
						oSelectOptionState.option = "EQ";
						oSelectOptionState.low = "";
						break;
					case "NotContains":
						oSelectOptionState.option = "CP";
						oSelectOptionState.sign = "E";
						break;
					case "NOTBT":
						oSelectOptionState.option = "BT";
						oSelectOptionState.sign = "E";
						break;
					case "NotStartsWith":
						oSelectOptionState.option = "CP";
						oSelectOptionState.low += "*";
						oSelectOptionState.sign = "E";
						break;
					case "NotEndsWith":
						oSelectOptionState.option = "CP";
						oSelectOptionState.low = "*" + oSelectOptionState.low;
						oSelectOptionState.sign = "E";
						break;
					case "NotEmpty":
						oSelectOptionState.option = "NE";
						oSelectOptionState.low = "";
						break;
					case "NOTLE":
						oSelectOptionState.option = "LE";
						oSelectOptionState.sign = "E";
						break;
					case "NOTGE":
						oSelectOptionState.option = "GE";
						oSelectOptionState.sign = "E";
						break;
					case "NOTLT":
						oSelectOptionState.option = "LT";
						oSelectOptionState.sign = "E";
						break;
					case "NOTGT":
						oSelectOptionState.option = "GT";
						oSelectOptionState.sign = "E";
						break;
					default:
						Log.warning(sOperator + " is not supported. " + sFilter + " could not be added to the navigation context");
				}
				return oSelectOptionState;
			};
			var oFilterConditions = mFilters.filterConditions;
			var oFiltersWithoutConflict = mFilters.filterConditionsWithoutConflict ? mFilters.filterConditionsWithoutConflict : {};
			var oTablePropertiesWithoutConflict = oTargetInfo.propertiesWithoutConflict ? oTargetInfo.propertiesWithoutConflict : {};
			var addFiltersToSelectionVariant = function(oSelectionVariant, sFilter, sPath) {
				var aFilters = oFilterConditions[sFilter];
				for (var item in aFilters) {
					var oFilter = aFilters[item];
					sLow = (oFilter.values[0] && oFilter.values[0].toString()) || "";
					sHigh = (oFilter.values[1] && oFilter.values[1].toString()) || null;
					var oSelectOptionValues = fnGetSignAndOption(oFilter.operator, sLow, sHigh);
					if (oSelectOptionValues.option) {
						oSelectionVariant.addSelectOption(
							sPath ? sPath : sFilter,
							oSelectOptionValues.sign,
							oSelectOptionValues.option,
							oSelectOptionValues.low,
							oSelectOptionValues.high
						);
					}
				}
			};

			for (var sFilter in oFilterConditions) {
				// only add the filter values if it is not already present in the SV already
				if (!oSelectionVariant.getSelectOption(sFilter)) {
					// TODO : custom filters should be ignored more generically
					if (sFilter === "$editState") {
						continue;
					}
					addFiltersToSelectionVariant(oSelectionVariant, sFilter);
				} else {
					if (oTablePropertiesWithoutConflict && sFilter in oTablePropertiesWithoutConflict) {
						addFiltersToSelectionVariant(oSelectionVariant, sFilter, oTablePropertiesWithoutConflict[sFilter]);
					}
					// if property was without conflict in page context then add path from page context to SV
					if (sFilter in oFiltersWithoutConflict) {
						addFiltersToSelectionVariant(oSelectionVariant, sFilter, oFiltersWithoutConflict[sFilter]);
					}
				}
			}
			return oSelectionVariant;
		}

		/**
		 * Returns true if Application is in sticky edit mode.
		 *
		 * @param {object} oControl
		 * @returns {boolean} If we are in sticky mode
		 */
		function isStickyEditMode(oControl) {
			var bIsStickyMode = ModelHelper.isStickySessionSupported(oControl.getModel().getMetaModel());
			var bUIEditable = oControl.getModel("ui").getProperty("/isEditable");
			return bIsStickyMode && bUIEditable;
		}

		/**
		 * Method to add display currency to selection variant.
		 * @param {Array} aMandatoryFilterFields Mandatory filterfields of entitySet.
		 * @param {object} oSelectionVariant The selection variant
		 * @param {object} oSelectionVariantDefaults The defaulted selection variant
		 */
		function addDefaultDisplayCurrency(aMandatoryFilterFields, oSelectionVariant, oSelectionVariantDefaults) {
			if (oSelectionVariant && aMandatoryFilterFields && aMandatoryFilterFields.length) {
				for (var i = 0; i < aMandatoryFilterFields.length; i++) {
					var aSVOption = oSelectionVariant.getSelectOption("DisplayCurrency"),
						aDefaultSVOption = oSelectionVariantDefaults && oSelectionVariantDefaults.getSelectOption("DisplayCurrency");
					if (
						aMandatoryFilterFields[i].$PropertyPath === "DisplayCurrency" &&
						(!aSVOption || !aSVOption.length) &&
						aDefaultSVOption &&
						aDefaultSVOption.length
					) {
						var displayCurrencySelectOption = aDefaultSVOption[0];
						var sSign = displayCurrencySelectOption["Sign"];
						var sOption = displayCurrencySelectOption["Option"];
						var sLow = displayCurrencySelectOption["Low"];
						var sHigh = displayCurrencySelectOption["High"];
						oSelectionVariant.addSelectOption("DisplayCurrency", sSign, sOption, sLow, sHigh);
					}
				}
			}
		}

		/**
		 * Returns an array of visible, non-computed key and immutable properties.
		 *
		 * @param {object} oMetaModel
		 * @param sPath
		 * @returns {Array}
		 */
		function getNonComputedVisibleFields(oMetaModel, sPath) {
			var aTechnicalKeys = oMetaModel.getObject(sPath + "/").$Key;
			var aNonComputedVisibleFields = [];
			var oEntityType = oMetaModel.getObject(sPath + "/");
			for (var item in oEntityType) {
				if (oEntityType[item].$kind && oEntityType[item].$kind === "Property") {
					var oAnnotations = oMetaModel.getObject(sPath + "/" + item + "@") || {},
						bIsKey = aTechnicalKeys.indexOf(item) > -1,
						bIsImmutable = bIsKey || oAnnotations["@Org.OData.Core.V1.Immutable"],
						bIsNonComputed = !oAnnotations["@Org.OData.Core.V1.Computed"],
						bIsVisible = !oAnnotations["@com.sap.vocabularies.UI.v1.Hidden"];
					if (bIsImmutable && bIsNonComputed && bIsVisible) {
						aNonComputedVisibleFields.push(item);
					}
				}
			}
			return aNonComputedVisibleFields;
		}

		/**
		 * Sets the FLP user defaults.
		 *
		 * @function
		 * @name sap.fe.core.CommonUtils.setUserDefaults
		 * @memberof sap.fe.core.CommonUtils
		 * @param {object} [oAppComponent] The AppComponent
		 * @param {Array} [aParameters] Parameters in the dialog
		 * @param {object} [oModel] Model to which the default value has to be set
		 * @param {boolean} [bIsAction] `true` if aParameters contains action parameters
		 * @returns {Promise}
		 * @ui5-restricted
		 * @final
		 **/
		function setUserDefaults(oAppComponent, aParameters, oModel, bIsAction) {
			return new Promise(function(resolve, reject) {
				var oComponentData = oAppComponent.getComponentData(),
					oStartupParameters = (oComponentData && oComponentData.startupParameters) || {},
					oShellServices = oAppComponent.getShellServices();

				if (!oShellServices.hasUShell()) {
					aParameters.map(function(oParameter) {
						var sPropertyName = bIsAction
							? "/" + oParameter.$Name
							: oParameter.getPath().slice(oParameter.getPath().lastIndexOf("/") + 1);
						var sParameterName = bIsAction ? sPropertyName.slice(1) : sPropertyName;
						if (oStartupParameters[sParameterName]) {
							oModel.setProperty(sPropertyName, oStartupParameters[sParameterName][0]);
						}
					});
					return resolve(true);
				}
				return oShellServices.getStartupAppState(oAppComponent).then(function(oStartupAppState) {
					var oData = oStartupAppState.getData() || {},
						aExtendedParameters = (oData.selectionVariant && oData.selectionVariant.SelectOptions) || [];
					aParameters.map(function(oParameter) {
						var sPropertyName = bIsAction
							? "/" + oParameter.$Name
							: oParameter.getPath().slice(oParameter.getPath().lastIndexOf("/") + 1);
						var sParameterName = bIsAction ? sPropertyName.slice(1) : sPropertyName;
						if (oStartupParameters[sParameterName]) {
							oModel.setProperty(sPropertyName, oStartupParameters[sParameterName][0]);
						} else if (aExtendedParameters.length > 0) {
							for (var i in aExtendedParameters) {
								var oExtendedParameter = aExtendedParameters[i];
								if (oExtendedParameter.PropertyName === sParameterName) {
									var oRange = oExtendedParameter.Ranges.length ? oExtendedParameter.Ranges[0] : undefined;
									if (oRange && oRange.Sign === "I" && oRange.Option === "EQ") {
										oModel.setProperty(sPropertyName, oRange.Low); // high is ignored when Option=EQ
									}
								}
							}
						}
					});
					return resolve(true);
				});
			});
		}

		/**
		 * Gets semantic object mappings defined in app descriptor outbounds.
		 *
		 * @function
		 * @name sap.fe.core.CommonUtils.getSemanticObjectMapping
		 * @memberof sap.fe.core.CommonUtils
		 * @param {object} [oOutbound] Outbound defined in app descriptor
		 * @returns {Array} A collection of semantic object mappings defined for one outbound
		 * @ui5-restricted
		 * @final
		 **/
		function getSemanticObjectMapping(oOutbound) {
			var aSemanticObjectMapping = [];
			if (oOutbound.parameters) {
				var aParameters = Object.keys(oOutbound.parameters) || [];
				if (aParameters.length > 0) {
					aParameters.forEach(function(sParam) {
						var oMapping = oOutbound.parameters[sParam];
						if (oMapping.value && oMapping.value.value && oMapping.value.format === "binding") {
							// using the format of UI.Mapping
							var oSemanticMapping = {
								"LocalProperty": {
									"$PropertyPath": oMapping.value.value
								},
								"SemanticObjectProperty": sParam
							};

							if (aSemanticObjectMapping.length > 0) {
								// To check if the semanticObject Mapping is done for the same local property more that once then first one will be considered
								for (var i = 0; i < aSemanticObjectMapping.length; i++) {
									if (
										aSemanticObjectMapping[i]["LocalProperty"]["$PropertyPath"] !==
										oSemanticMapping["LocalProperty"]["$PropertyPath"]
									) {
										aSemanticObjectMapping.push(oSemanticMapping);
									}
								}
							} else {
								aSemanticObjectMapping.push(oSemanticMapping);
							}
						}
					});
				}
			}
			return aSemanticObjectMapping;
		}

		/**
		 * Returns the datapoints/ microcharts for which target outbound is configured.
		 *
		 * @param {object} oViewData View data as given in app descriptor
		 * @param {object} oCrossNav The target outbound in cross navigation in manifest
		 * @returns {object} Datapoints/microcharts with outbound defined
		 */
		function getHeaderFacetItemConfigForExternalNavigation(oViewData, oCrossNav) {
			var aSemanticObjectMapping = [];
			var oHeaderFacetItems = {};
			var sId;
			var oControlConfig = oViewData.controlConfiguration;
			for (var config in oControlConfig) {
				if (
					config.indexOf("@com.sap.vocabularies.UI.v1.DataPoint") > -1 ||
					config.indexOf("@com.sap.vocabularies.UI.v1.Chart") > -1
				) {
					if (
						oControlConfig[config].navigation &&
						oControlConfig[config].navigation.targetOutbound &&
						oControlConfig[config].navigation.targetOutbound.outbound
					) {
						var sOutbound = oControlConfig[config].navigation.targetOutbound.outbound;
						var oOutbound = oCrossNav[sOutbound];
						if (oOutbound.semanticObject && oOutbound.action) {
							if (config.indexOf("Chart") > -1) {
								sId = StableIdHelper.generate(["fe", "MicroChartLink", config]);
							} else {
								sId = StableIdHelper.generate(["fe", "HeaderDPLink", config]);
							}
							var aSemanticObjectMapping = CommonUtils.getSemanticObjectMapping(oOutbound);
							oHeaderFacetItems[sId] = {
								semanticObject: oOutbound.semanticObject,
								action: oOutbound.action,
								semanticObjectMapping: aSemanticObjectMapping
							};
						} else {
							Log.error("Cross navigation outbound is configured without semantic object and action for " + sOutbound);
						}
					}
				}
			}
			return oHeaderFacetItems;
		}

		/**
		 * Method to replace Local Properties with Semantic Object mappings.
		 *
		 * @param {object} oSelectionVariant SelectionVariant consisting of filterbar, Table and Page Context
		 * @param {object} vMappings String representation of semantic object mappings
		 * @returns {object} Modified SelectionVariant with LocalProperty replaced with SemanticObjectProperties.
		 */
		function setSemanticObjectMappings(oSelectionVariant, vMappings) {
			var oMappings = typeof vMappings === "string" ? JSON.parse(vMappings) : vMappings;
			for (var i = 0; i < oMappings.length; i++) {
				var sLocalProperty =
					(oMappings[i]["LocalProperty"] && oMappings[i]["LocalProperty"]["$PropertyPath"]) ||
					(oMappings[i]["@com.sap.vocabularies.Common.v1.LocalProperty"] &&
						oMappings[i]["@com.sap.vocabularies.Common.v1.LocalProperty"]["$Path"]);
				var sSemanticObjectProperty =
					oMappings[i]["SemanticObjectProperty"] || oMappings[i]["@com.sap.vocabularies.Common.v1.SemanticObjectProperty"];
				if (oSelectionVariant.getSelectOption(sLocalProperty)) {
					var oSelectOption = oSelectionVariant.getSelectOption(sLocalProperty);

					//Create a new SelectOption with sSemanticObjectProperty as the property Name and remove the older one
					oSelectionVariant.removeSelectOption(sLocalProperty);
					oSelectionVariant.massAddSelectOption(sSemanticObjectProperty, oSelectOption);
				}
			}
			return oSelectionVariant;
		}

		/**
		 * Method to retrieve Semantic Object annotations from meta model.
		 * @param {oMetaModel} oMetaModel The Meta Model.
		 * @param {sPath} sPath Property path.
		 * @param oView
		 * @param oConverterContext
		 * @returns {object} - Promises resolving name of Semantic Objects.
		 */
		function fnGetSemanticObjectsFromPath(oMetaModel, sPath, oView, oConverterContext) {
			return new Promise(function(resolve) {
				var sSemanticObject = oMetaModel.getObject(sPath + "@com.sap.vocabularies.Common.v1.SemanticObject");
				var aSemanticObjectUnavailableActions = oMetaModel.getObject(
					sPath + "@com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions"
				);
				var aSemanticObjectForGetLinks, oSemanticObject;
				aSemanticObjectForGetLinks = [{ semanticObject: sSemanticObject }];
				oSemanticObject = {
					semanticObject: sSemanticObject
				};
				resolve({
					semanticObjectPath: sPath,
					semanticObjectForGetLinks: aSemanticObjectForGetLinks,
					semanticObject: oSemanticObject,
					unavailableActions: aSemanticObjectUnavailableActions
				});
			}).catch(function(oError) {
				Log.error("Error in fnGetSemanticObjectsFromPath", oError);
			});
		}

		function fnUpdateSemanticTargetsModel(aGetLinksPromises, aSemanticObjects, oInternalModelContext, sCurrentHash) {
			return Promise.all(aGetLinksPromises)
				.then(function(aValues) {
					var aLinks,
						_oLink,
						_sLinkIntent,
						aFinalLinks = [];
					var oFinalSemanticObjects = {};
					var bIntentHasActions = function(sIntent, aActions) {
						for (var intent in aActions) {
							if (intent === sIntent) {
								return true;
							} else {
								return false;
							}
						}
					};

					for (var k = 0; k < aValues.length; k++) {
						aLinks = aValues[k];
						if (aLinks && aLinks.length > 0 && aLinks[0] !== undefined) {
							var oSemanticObject = {},
								oTmp = {},
								sAlternatePath;
							for (var i = 0; i < aLinks.length; i++) {
								aFinalLinks.push([]);
								var hasTargetsNotFiltered = false;
								var hasTargets = false;
								for (var iLinkCount = 0; iLinkCount < aLinks[i][0].length; iLinkCount++) {
									_oLink = aLinks[i][0][iLinkCount];
									_sLinkIntent = _oLink && _oLink.intent.split("-")[1];
									if (!(_oLink && _oLink.intent && _oLink.intent.indexOf(sCurrentHash) === 0)) {
										hasTargetsNotFiltered = true;
										if (!bIntentHasActions(_sLinkIntent, aSemanticObjects[k].unavailableActions)) {
											aFinalLinks[i].push(_oLink);
											hasTargets = true;
										}
									}
								}
								oTmp = {
									semanticObject: aSemanticObjects[k].semanticObject,
									path: aSemanticObjects[k].path,
									HasTargets: hasTargets,
									HasTargetsNotFiltered: hasTargetsNotFiltered
								};
								if (oSemanticObject[aSemanticObjects[k].semanticObject] === undefined) {
									oSemanticObject[aSemanticObjects[k].semanticObject] = {};
								}
								sAlternatePath = aSemanticObjects[k].path.replace(/\//g, "_");
								if (oSemanticObject[aSemanticObjects[k].semanticObject][sAlternatePath] === undefined) {
									oSemanticObject[aSemanticObjects[k].semanticObject][sAlternatePath] = {};
								}
								oSemanticObject[aSemanticObjects[k].semanticObject][sAlternatePath] = Object.assign(
									oSemanticObject[aSemanticObjects[k].semanticObject][sAlternatePath],
									oTmp
								);
							}
							var sSemanticObjectName = Object.keys(oSemanticObject)[0];
							if (Object.keys(oFinalSemanticObjects).includes(sSemanticObjectName)) {
								oFinalSemanticObjects[sSemanticObjectName] = Object.assign(
									oFinalSemanticObjects[sSemanticObjectName],
									oSemanticObject[sSemanticObjectName]
								);
							} else {
								oFinalSemanticObjects = Object.assign(oFinalSemanticObjects, oSemanticObject);
							}
							aFinalLinks = [];
						}
					}
					if (Object.keys(oFinalSemanticObjects).length > 0) {
						oInternalModelContext.setProperty(
							"semanticsTargets",
							mergeObjects(oFinalSemanticObjects, oInternalModelContext.getProperty("semanticsTargets"))
						);
						return oFinalSemanticObjects;
					}
				})
				.catch(function(oError) {
					Log.error("fnUpdateSemanticTargetsModel: Cannot read links", oError);
				});
		}

		function fnGetSemanticObjectPromise(oAppComponent, oView, oMetaModel, sPath) {
			var oConverterContext;
			var sEntitySetPath = ModelHelper.getEntitySetPath(sPath),
				sTargetEntityPath = sEntitySetPath,
				sTargetEntitySetName = sTargetEntityPath ? sTargetEntityPath.slice(1) : sTargetEntityPath;
			var oDataModelPath = MetaModelConverter.getInvolvedDataModelObjects(
				oMetaModel.createBindingContext("/" + sTargetEntitySetName)
			);

			oConverterContext = ConverterContext.createConverterContextForMacro(
				oDataModelPath.startingEntitySet.name,
				oMetaModel,
				oAppComponent && oAppComponent.getDiagnostics(),
				mergeObjects,
				oDataModelPath.contextLocation,
				undefined
			);
			return CommonUtils.getSemanticObjectsFromPath(oMetaModel, sPath, oView, oConverterContext);
		}

		/**
		 * Method to retrieve Semantic Object targets from page model and set the internal model.
		 *
		 * @param oController
		 * @param {string} sPageModel Name of the page model
		 * @returns {Promise} Once resolved, a promise is returned which is resolved without a result in case of success of setting internal Semantic Targets Model
		 */
		function fnGetSemanticTargetsFromPageModel(oController, sPageModel) {
			var _fnfindValues = function(obj, key) {
				return _fnfindValuesHelper(obj, key, []);
			};
			var _fnfindValuesHelper = function(obj, key, list) {
				if (!obj) {
					return list;
				}
				if (obj instanceof Array) {
					for (var i in obj) {
						list = list.concat(_fnfindValuesHelper(obj[i], key, []));
					}
					return list;
				}
				if (obj[key]) {
					list.push(obj[key]);
				}

				if (typeof obj == "object" && obj !== null) {
					var children = Object.keys(obj);
					if (children.length > 0) {
						for (i = 0; i < children.length; i++) {
							list = list.concat(_fnfindValuesHelper(obj[children[i]], key, []));
						}
					}
				}
				return list;
			};
			var _fnDeleteDuplicateSemanticObjects = function(aSemanticObjectPath) {
				return aSemanticObjectPath.filter(function(value, index) {
					return aSemanticObjectPath.indexOf(value) === index;
				});
			};
			var oView = oController.getView();
			var oInternalModelContext = oView.getBindingContext("internal");

			if (oInternalModelContext) {
				var aSemanticObjectsPromises = [];
				var oComponent = oController.getOwnerComponent();
				var oAppComponent = sap.ui.core.Component.getOwnerComponentFor(oComponent);
				var oMetaModel = oAppComponent.getMetaModel();
				var oPageModel = oComponent.getModel(sPageModel).getData();
				if (JSON.stringify(oPageModel) === "{}") {
					oPageModel = oComponent.getModel(sPageModel)._getObject("/", undefined);
				}
				var aSemanticObjectsFound = _fnfindValues(oPageModel, "semanticObjectPath");
				aSemanticObjectsFound = _fnDeleteDuplicateSemanticObjects(aSemanticObjectsFound);
				var oShellServiceHelper = CommonUtils.getShellServices(oAppComponent);
				var sCurrentHash = oShellServiceHelper.hrefForExternal();
				var aSemanticObjectsForGetLinks = [];
				var aSemanticObjects = [];
				var sPath;
				var _oSemanticObject;

				if (sCurrentHash && sCurrentHash.indexOf("?") !== -1) {
					// sCurrentHash can contain query string, cut it off!
					sCurrentHash = sCurrentHash.split("?")[0];
				}

				for (var i = 0; i < aSemanticObjectsFound.length; i++) {
					sPath = aSemanticObjectsFound[i];
					aSemanticObjectsPromises.push(CommonUtils.getSemanticObjectPromise(oAppComponent, oView, oMetaModel, sPath));
				}

				if (aSemanticObjectsPromises.length === 0) {
					return Promise.resolve();
				} else {
					Promise.all(aSemanticObjectsPromises)
						.then(function(aValues) {
							var aGetLinksPromises = [],
								sSemObjExpression;
							var aSemanticObjectsResolved = aValues.filter(function(element) {
								if (
									element.semanticObject !== undefined &&
									element.semanticObject.semanticObject &&
									typeof element.semanticObject.semanticObject === "object"
								) {
									sSemObjExpression = BindingExpression.compileBinding(
										BindingExpression.bindingExpression(element.semanticObject.semanticObject.$Path)
									);
									element.semanticObject.semanticObject = sSemObjExpression;
									element.semanticObjectForGetLinks[0].semanticObject = sSemObjExpression;
									return true;
								} else if (element) {
									return element.semanticObject !== undefined;
								} else {
									return false;
								}
							});
							for (var j = 0; j < aSemanticObjectsResolved.length; j++) {
								_oSemanticObject = aSemanticObjectsResolved[j];
								if (
									_oSemanticObject &&
									_oSemanticObject.semanticObject &&
									!(_oSemanticObject.semanticObject.semanticObject.indexOf("{") === 0)
								) {
									aSemanticObjectsForGetLinks.push(_oSemanticObject.semanticObjectForGetLinks);
									aSemanticObjects.push({
										semanticObject: _oSemanticObject.semanticObject.semanticObject,
										unavailableActions: _oSemanticObject.unavailableActions,
										path: aSemanticObjectsResolved[j].semanticObjectPath
									});
									aGetLinksPromises.push(
										oShellServiceHelper.getLinksWithCache([_oSemanticObject.semanticObjectForGetLinks])
									);
								}
							}
							return CommonUtils.updateSemanticTargets(
								aGetLinksPromises,
								aSemanticObjects,
								oInternalModelContext,
								sCurrentHash
							);
						})
						.catch(function(oError) {
							Log.error("fnGetSemanticTargetsFromTable: Cannot get Semantic Objects", oError);
						});
				}
			} else {
				return Promise.resolve();
			}
		}

		function getFilterRestrictions(oFilterRestrictionsAnnotation, sRestriction) {
			var FilterRestrictions = CommonUtils.FilterRestrictions;
			if (sRestriction === FilterRestrictions.REQUIRED_PROPERTIES || sRestriction === FilterRestrictions.NON_FILTERABLE_PROPERTIES) {
				var aProps = [];
				if (oFilterRestrictionsAnnotation && oFilterRestrictionsAnnotation[sRestriction]) {
					aProps = oFilterRestrictionsAnnotation[sRestriction].map(function(oProperty) {
						return oProperty.$PropertyPath;
					});
				}
				return aProps;
			} else if (sRestriction === FilterRestrictions.ALLOWED_EXPRESSIONS) {
				var mAllowedExpressions = {};
				if (oFilterRestrictionsAnnotation && oFilterRestrictionsAnnotation.FilterExpressionRestrictions) {
					oFilterRestrictionsAnnotation.FilterExpressionRestrictions.forEach(function(oProperty) {
						//SingleValue | MultiValue | SingleRange | MultiRange | SearchExpression | MultiRangeOrSearchExpression
						if (mAllowedExpressions[oProperty.Property.$PropertyPath]) {
							mAllowedExpressions[oProperty.Property.$PropertyPath].push(oProperty.AllowedExpressions);
						} else {
							mAllowedExpressions[oProperty.Property.$PropertyPath] = [oProperty.AllowedExpressions];
						}
					});
				}
				return mAllowedExpressions;
			}
			// Default return the FilterRestrictions Annotation
			return oFilterRestrictionsAnnotation;
		}

		function getFilterRestrictionsByPath(sEntitySetPath, oMetaModel) {
			var oRet = {},
				FilterRestrictions = CommonUtils.FilterRestrictions,
				oFilterRestrictions = sEntitySetPath
					? oMetaModel.getObject(sEntitySetPath + "@Org.OData.Capabilities.V1.FilterRestrictions")
					: {};
			oRet[FilterRestrictions.REQUIRED_PROPERTIES] =
				getFilterRestrictions(oFilterRestrictions, FilterRestrictions.REQUIRED_PROPERTIES) || [];
			oRet[FilterRestrictions.NON_FILTERABLE_PROPERTIES] =
				getFilterRestrictions(oFilterRestrictions, FilterRestrictions.NON_FILTERABLE_PROPERTIES) || [];
			//SingleValue | MultiValue | SingleRange | MultiRange | SearchExpression | MultiRangeOrSearchExpression
			oRet[FilterRestrictions.ALLOWED_EXPRESSIONS] =
				getFilterRestrictions(oFilterRestrictions, FilterRestrictions.ALLOWED_EXPRESSIONS) || {};

			var aPathParts = sEntitySetPath.split("/");

			if (aPathParts.length > 2) {
				// In normal filterbar scenarios sEntitySetPath is of the format "/Customer".
				// But, In case of sEntitySetPath of format "/Customer/Set" this is to check navigation restrictions of "Customer" for non-filterable properties in "Set"
				var sNavigationPath = aPathParts[aPathParts.length - 1];
				aPathParts.splice(-1, 1); // removing NavigationProperty from the end.
				var sParentEntitySetPath = aPathParts.join("/");
				var oNavigationRestrictions = CommonUtils.getNavigationRestrictions(oMetaModel, sParentEntitySetPath, sNavigationPath);
				var oNavigationFilterRestrictions = oNavigationRestrictions && oNavigationRestrictions["FilterRestrictions"];
				oRet[FilterRestrictions.REQUIRED_PROPERTIES].concat(
					getFilterRestrictions(oNavigationFilterRestrictions, FilterRestrictions.REQUIRED_PROPERTIES) || []
				);
				oRet[FilterRestrictions.NON_FILTERABLE_PROPERTIES].concat(
					getFilterRestrictions(oNavigationFilterRestrictions, FilterRestrictions.NON_FILTERABLE_PROPERTIES) || []
				);
				//SingleValue | MultiValue | SingleRange | MultiRange | SearchExpression | MultiRangeOrSearchExpression
				oRet[FilterRestrictions.ALLOWED_EXPRESSIONS] = mergeObjects(
					{},
					getFilterRestrictions(oNavigationFilterRestrictions, FilterRestrictions.ALLOWED_EXPRESSIONS) || {},
					oRet[FilterRestrictions.ALLOWED_EXPRESSIONS]
				);
			}

			return oRet;
		}

		function templateControlFragment(sFragmentName, oPreprocessorSettings, oOptions, oModifier) {
			oOptions = oOptions || {};
			if (oModifier) {
				return oModifier.templateControlFragment(sFragmentName, oPreprocessorSettings, oOptions.view).then(function(oFragment) {
					// This is required as Flex returns an HTMLCollection as templating result in XML time.
					return oModifier.targets === "xmlTree" && oFragment.length > 0 ? oFragment[0] : oFragment;
				});
			} else {
				return loadMacroLibrary()
					.then(function() {
						return XMLPreprocessor.process(
							XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment"),
							{ name: sFragmentName },
							oPreprocessorSettings
						);
					})
					.then(function(oFragment) {
						var oControl = oFragment.firstElementChild;
						if (!!oOptions.isXML && oControl) {
							return oControl;
						}
						return Fragment.load({
							id: oOptions.id,
							definition: oFragment,
							controller: oOptions.controller
						});
					});
			}
		}

		/**
		 * Method which returns a promise that resolves to a singleton property value.
		 *
		 * @param {string} sPath Absolute path to the singleton property
		 * @param {object} oModel Instance of the OData V4 model
		 * @returns {Promise} A promise which resolves to the property value for a singleton, otherwise null.
		 */
		function requestSingletonProperty(sPath, oModel) {
			if (!sPath || !oModel) {
				return Promise.resolve(null);
			}

			var oMetaModel = oModel.getMetaModel();
			// Find the underlying entity set from the property path and check whether it is a singleton.
			var aParts = sPath.split("/").filter(Boolean),
				sPropertyName = aParts.pop(),
				sNavigationPath = aParts.join("/"),
				oEntitySet = sNavigationPath && oMetaModel.getObject("/" + sNavigationPath);
			if (oEntitySet && oEntitySet.$kind === "Singleton") {
				var sSingletonName = aParts[aParts.length - 1],
					oPropertyBinding = oModel.bindProperty("/" + sSingletonName + "/" + sPropertyName);
				return oPropertyBinding.requestValue();
			}

			return Promise.resolve(null);
		}

		/**
		 * Add binding event listener.
		 *
		 * @param {object} oControl Control instance
		 * @param {object} sEventName Event name
		 * @param {object} fHandler Handler to be called
		 * @private
		 * @ui5-restricted
		 */
		function addEventToBindingInfo(oControl, sEventName, fHandler) {
			var oBindingInfo;
			var setBindingInfo = function() {
				if (oBindingInfo) {
					if (!oBindingInfo.events) {
						oBindingInfo.events = {};
					}
					if (!oBindingInfo.events[sEventName]) {
						oBindingInfo.events[sEventName] = fHandler;
					} else {
						var fOriginalHandler = oBindingInfo.events[sEventName];
						oBindingInfo.events[sEventName] = function() {
							fHandler.apply(this, arguments);
							fOriginalHandler.apply(this, arguments);
						};
					}
				}
			};
			if (oControl.isA("sap.ui.mdc.ChartNew")) {
				oControl
					.innerChartBound()
					.then(function() {
						oBindingInfo = oControl
							.getControlDelegate()
							._getChart(oControl)
							.getBindingInfo("data");
						setBindingInfo();
					})
					.catch(function(sError) {
						Log.error(sError);
					});
			} else {
				oBindingInfo = oControl.data("rowsBindingInfo");
				setBindingInfo();
			}
		}

		function loadMacroLibrary() {
			return new Promise(function(resolve, reject) {
				sap.ui.require(["sap/fe/macros/macroLibrary"], function(/*macroLibrary*/) {
					resolve();
				});
			});
		}

		/**
		 * Check if given path resides in the context path provided.
		 *
		 * @function
		 * @name sap.fe.core.CommonUtils.isPathApplicableToContextPath
		 * @memberof sap.fe.core.CommonUtils
		 * @param {object} [oMetaModel] MetaModel to be used
		 * @param {string} [sContextPath] Context path to be used
		 * @param {string} [sPath] Path to be used
		 * @param {string} [sStrategy] Strategy, it could be 'self' | 'includingDependents'
		 * @returns {boolean} If path is applicable to context.
		 **/
		function isPathApplicableToContextPath(oMetaModel, sContextPath, sPath, sStrategy) {
			var sContextPathToCheck = sContextPath.startsWith("/") ? sContextPath : "/" + sContextPath,
				sPathToCheck = sPath.startsWith("/") ? sPath : "/" + sPath,
				fnIsApplicable = function(sPrimaryPath, sKey) {
					return sPrimaryPath === sKey || (sStrategy === "includingDependents" && sPrimaryPath.startsWith(sKey));
				},
				fnSimplifyEntitySetPath = function(sEntitySetPathToUse) {
					var sEntitySetPath = ModelHelper.getEntitySetPath(sEntitySetPathToUse);
					var sEntitySet = sEntitySetPath.indexOf("$NavigationPropertyBinding") > -1 && oMetaModel.getObject(sEntitySetPath);
					return sEntitySet ? "/" + sEntitySet : sEntitySetPathToUse;
				};

			if (!fnIsApplicable(sContextPathToCheck, sPathToCheck)) {
				sContextPathToCheck = fnSimplifyEntitySetPath(sContextPathToCheck);

				if (!fnIsApplicable(sContextPathToCheck, sPathToCheck)) {
					sPathToCheck = fnSimplifyEntitySetPath(sPathToCheck);
				} else {
					return true;
				}
			}

			return fnIsApplicable(sContextPathToCheck, sPathToCheck);
		}

		/**
		 * Get controls to refresh in a view.
		 *
		 * @function
		 * @name sap.fe.core.CommonUtils.getControlsForRefresh
		 * @memberof sap.fe.core.CommonUtils
		 * @param {object} [oView] View of the controls
		 * @param {Array} [aViewControls] Controls to be checked
		 * @returns {Array} Controls that need to be refreshed
		 **/
		function getControlsForRefresh(oView, aViewControls) {
			var aControls = [],
				oMetaModel = oView.getModel().getMetaModel(),
				oInternalModel = oView.getModel("internal"),
				oRefreshStrategyForKeepAliveRestore = oInternalModel.getProperty("/refreshStrategyOnAppRestore") || {};

			if (aViewControls) {
				aViewControls.forEach(function(oControl) {
					var sContextPath = oControl.data("targetCollectionPath");

					for (var sKey in oRefreshStrategyForKeepAliveRestore) {
						var sStrategy = oRefreshStrategyForKeepAliveRestore[sKey];
						if (CommonUtils.isPathApplicableToContextPath(oMetaModel, sContextPath, sKey, sStrategy)) {
							aControls.push(oControl);
						}
					}
				});
			}

			return aControls;
		}

		/**
		 * Get refresh strategy for the control for a context path.
		 *
		 * @function
		 * @name sap.fe.core.CommonUtils.getControlRefreshStrategyForContextPath
		 * @memberof sap.fe.core.CommonUtils
		 * @param {object} [oControl] Control from which refresh info is needed
		 * @param {string} sContextPath ContextPath for properities
		 * @returns {string} Strategy for control refresh
		 **/

		function getControlRefreshStrategyForContextPath(oControl, sContextPath) {
			var oMetaModel = oControl.getModel().getMetaModel(),
				oInternalModel = oControl.getModel("internal"),
				oRefreshStrategyForKeepAliveRestore = oInternalModel.getProperty("/refreshStrategyOnAppRestore"),
				sStrategy;

			if (sContextPath) {
				for (var sKey in oRefreshStrategyForKeepAliveRestore) {
					var sStrategyToCheck = oRefreshStrategyForKeepAliveRestore[sKey];
					if (CommonUtils.isPathApplicableToContextPath(oMetaModel, sContextPath, sKey, sStrategyToCheck)) {
						sStrategy = sStrategyToCheck;
						if (sStrategy === "includingDependents") {
							break;
						}
					}
				}
			}

			return sStrategy;
		}

		/**
		 * Get refresh info from view.
		 *
		 * @function
		 * @name sap.fe.core.CommonUtils.getViewRefreshInfo
		 * @memberof sap.fe.core.CommonUtils
		 * @param {object} [oView] View from which refresh info is needed
		 * @returns {string} Strategy for view refresh
		 **/
		function getViewRefreshInfo(oView) {
			var mViewData = oView.getViewData(),
				sContextPath = mViewData && (mViewData.contextPath || "/" + mViewData.entitySet);

			return CommonUtils.getControlRefreshStrategyForContextPath(oView, sContextPath);
		}

		/**
		 * Get MetaPath for the context.
		 *
		 * @function
		 * @name sap.fe.core.CommonUtils.getMetaPathForContext
		 * @memberof sap.fe.core.CommonUtils
		 * @param {object} [oContext] Outbound defined in app descriptor
		 * @returns {string} Meta path for the context
		 **/
		function getMetaPathForContext(oContext) {
			var oModel = oContext && oContext.getModel && oContext.getModel(),
				oMetaModel = oModel && oModel.getMetaModel && oModel.getMetaModel(),
				sPath = oContext && oContext.getPath && oContext.getPath();

			return oMetaModel && sPath && oMetaModel.getMetaPath && oMetaModel.getMetaPath(sPath);
		}

		/**
		 * Get MetaPath for the listbinding.
		 *
		 * @function
		 * @name sap.fe.core.CommonUtils.getAbsoluteMetaPathForListBinding
		 * @memberof sap.fe.core.CommonUtils
		 * @param {object} [oView] The View
		 * @param {sap.ui.model.odata.v4.ODataListBinding|string} vListBinding  ODataListBinding object or the binding path for a temporary list binding
		 * @returns {string} Meta path for the listbinding
		 **/
		function getAbsoluteMetaPathForListBinding(oView, vListBinding) {
			var oMetaModel = oView.getModel().getMetaModel(),
				sMetaPath;
			if (vListBinding && typeof vListBinding === "object") {
				// we already get a list binding use this one
				var oBinding = vListBinding;
				var oRootBinding = oBinding.getRootBinding();
				if (oBinding === oRootBinding) {
					// absolute path
					sMetaPath = oMetaModel.getMetaPath(oBinding.getPath());
				} else {
					// relative path
					var sRootBindingPath = oRootBinding.getPath();
					var sRelativePath = oBinding.getPath();
					sMetaPath = oMetaModel.getMetaPath(sRootBindingPath + "/" + sRelativePath);
				}
			} else if (typeof vListBinding === "string") {
				if (vListBinding.startsWith("/")) {
					// absolute path
					sMetaPath = oMetaModel.getMetaPath(vListBinding);
				} else {
					// relative path
					var oBindingContext = oView.getBindingContext();
					var sRootContextPath = oBindingContext.getPath();
					sMetaPath = oMetaModel.getMetaPath(sRootContextPath + "/" + vListBinding);
				}
			}
			return sMetaPath;
		}

		/**
		 * Get refresh strategy for an intent.
		 *
		 * @function
		 * @name sap.fe.core.CommonUtils.getRefreshStrategyForIntent
		 * @memberof sap.fe.core.CommonUtils
		 * @param {object} mRefreshStrategies RefreshStrategies to consider
		 * @param {string} sSemanticObject Outbound Semantic Object
		 * @param {string} sAction Outbound Action
		 * @returns {object} Meta path for the context
		 **/
		function getRefreshStrategyForIntent(mRefreshStrategies, sSemanticObject, sAction) {
			return (
				(mRefreshStrategies.intents &&
					((sSemanticObject && sAction && mRefreshStrategies.intents[sSemanticObject + "-" + sAction]) ||
						(sSemanticObject && mRefreshStrategies.intents[sSemanticObject]))) ||
				mRefreshStrategies["defaultBehavior"] ||
				mRefreshStrategies["_feDefault"]
			);
		}

		/**
		 * Store control refresh strategy for hash in the internal model.
		 *
		 * @function
		 * @name sap.fe.core.CommonUtils.storeControlRefreshStrategyForHash
		 * @memberof sap.fe.core.CommonUtils
		 * @param {object} oControl Control for the refresh strategy
		 * @param {object} oHash Shell hash object
		 **/
		function storeControlRefreshStrategyForHash(oControl, oHash) {
			if (oControl && oControl.getModel("viewData") && oControl.getModel("internal")) {
				var mViewData = oControl.getModel("viewData");
				var oRefreshStrategies = mViewData.getObject("/refreshStrategyOnAppRestore");
				if (oRefreshStrategies) {
					var mInternalModel = oControl.getModel("internal");
					var oRefreshStrategy = CommonUtils.getRefreshStrategyForIntent(
						oRefreshStrategies,
						oHash && oHash.semanticObject,
						oHash && oHash.action
					);

					mInternalModel.setProperty("/refreshStrategyOnAppRestore", oRefreshStrategy);
				}
			}
		}
		/**
		 * Method to refresh and restore the view if neccessary.
		 *
		 * @function
		 * @name sap.fe.core.CommonUtils.restoreView
		 * @memberof sap.fe.core.CommonUtils
		 * @param {object} oView Control for the refresh strategy
		 * @returns {Promise} A promise after view refresh and restore are triggered
		 **/
		function restoreView(oView) {
			var oInternalModelContext = oView.getBindingContext("internal");
			var oController = oView.getController();
			var oViewState = oController.viewState;
			var pRefreshBindings = Promise.resolve();
			if (oInternalModelContext.getProperty("restoreStatus") === "pending") {
				if (oViewState.refreshViewBindings) {
					pRefreshBindings = oViewState.refreshViewBindings();
					pRefreshBindings
						.then(function() {
							Log.info("FE V4: Refresh was triggered successfull: " + oView.getId());
						})
						.catch(function(err) {
							Log.warning("FE V4: Refresh was unsuccessfull: " + oView.getId(), err);
						});
				}
				pRefreshBindings
					.then(function() {
						oViewState.onRestore();
						oInternalModelContext.setProperty("restoreStatus", "done");
					})
					.catch(function(err) {
						Log.warning("FE V4: Restore was unsuccessfull: " + oView.getId());
					});
			}
			return pRefreshBindings;
		}

		var CommonUtils = {
			isPropertyFilterable: isPropertyFilterable,
			isFieldControlPathInapplicable: isFieldControlPathInapplicable,
			removeSensitiveData: removeSensitiveData,
			fireButtonPress: fnFireButtonPress,
			getTargetView: getTargetView,
			hasTransientContext: fnHasTransientContexts,
			updateRelatedAppsDetails: fnUpdateRelatedAppsDetails,
			resolveStringtoBoolean: fnResolveStringtoBoolean,
			getAppComponent: getAppComponent,
			processDataLossConfirmation: fnProcessDataLossConfirmation,
			getMandatoryFilterFields: fnGetMandatoryFilterFields,
			getContextPathProperties: fnGetContextPathProperties,
			getParameterInfo: getParameterInfo,
			updateDataFieldForIBNButtonsVisibility: fnUpdateDataFieldForIBNButtonsVisibility,
			getTranslatedText: getTranslatedText,
			getEntitySetName: getEntitySetName,
			getActionPath: getActionPath,
			computeDisplayMode: computeDisplayMode,
			setActionEnablement: setActionEnablement,
			isStickyEditMode: isStickyEditMode,
			getOperatorsForProperty: getOperatorsForProperty,
			addSelectionVariantToConditions: addSelectionVariantToConditions,
			addExternalStateFiltersToSelectionVariant: addExternalStateFiltersToSelectionVariant,
			addPageContextToSelectionVariant: addPageContextToSelectionVariant,
			addDefaultDisplayCurrency: addDefaultDisplayCurrency,
			getNonComputedVisibleFields: getNonComputedVisibleFields,
			setUserDefaults: setUserDefaults,
			getShellServices: getShellServices,
			getIBNActions: fnGetIBNActions,
			getHeaderFacetItemConfigForExternalNavigation: getHeaderFacetItemConfigForExternalNavigation,
			getSemanticObjectMapping: getSemanticObjectMapping,
			setSemanticObjectMappings: setSemanticObjectMappings,
			getSemanticObjectPromise: fnGetSemanticObjectPromise,
			getSemanticTargetsFromPageModel: fnGetSemanticTargetsFromPageModel,
			getSemanticObjectsFromPath: fnGetSemanticObjectsFromPath,
			updateSemanticTargets: fnUpdateSemanticTargetsModel,
			getPropertyDataType: getPropertyDataType,
			getNavigationRestrictions: getNavigationRestrictions,
			getSearchRestrictions: getSearchRestrictions,
			getFilterRestrictionsByPath: getFilterRestrictionsByPath,
			getSpecificAllowedExpression: getSpecificAllowedExpression,
			requestSingletonProperty: requestSingletonProperty,
			templateControlFragment: templateControlFragment,
			addEventToBindingInfo: addEventToBindingInfo,
			FilterRestrictions: {
				REQUIRED_PROPERTIES: "RequiredProperties",
				NON_FILTERABLE_PROPERTIES: "NonFilterableProperties",
				ALLOWED_EXPRESSIONS: "FilterAllowedExpressions"
			},
			AllowedExpressionsPrio: [
				"SingleValue",
				"MultiValue",
				"SingleRange",
				"MultiRange",
				"SearchExpression",
				"MultiRangeOrSearchExpression"
			],
			fnProcessDataLossOrDraftDiscardConfirmation: fnProcessDataLossOrDraftDiscardConfirmation,
			isPathApplicableToContextPath: isPathApplicableToContextPath,
			getControlsForRefresh: getControlsForRefresh,
			getViewRefreshInfo: getViewRefreshInfo,
			getMetaPathForContext: getMetaPathForContext,
			getAbsoluteMetaPathForListBinding: getAbsoluteMetaPathForListBinding,
			getControlRefreshStrategyForContextPath: getControlRefreshStrategyForContextPath,
			getRefreshStrategyForIntent: getRefreshStrategyForIntent,
			storeControlRefreshStrategyForHash: storeControlRefreshStrategyForHash,
			restoreView: restoreView
		};

		return CommonUtils;
	}
);
