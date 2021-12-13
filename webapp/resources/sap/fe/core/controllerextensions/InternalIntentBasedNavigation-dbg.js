/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/ui/core/mvc/ControllerExtension",
		"sap/ui/core/mvc/OverrideExecution",
		"sap/fe/navigation/SelectionVariant",
		"sap/fe/core/helpers/ModelHelper",
		"sap/ui/core/util/XMLPreprocessor",
		"sap/ui/core/XMLTemplateProcessor",
		"sap/ui/core/Fragment",
		"sap/ui/model/json/JSONModel",
		"sap/base/Log",
		"sap/fe/core/CommonUtils",
		"sap/base/util/merge"
	],
	function(
		ControllerExtension,
		OverrideExecution,
		SelectionVariant,
		ModelHelper,
		XMLPreprocessor,
		XMLTemplateProcessor,
		Fragment,
		JSONModel,
		Log,
		CommonUtils,
		mergeObjects
	) {
		"use strict";

		/**
		 * {@link sap.ui.core.mvc.ControllerExtension Controller extension}
		 *
		 * @namespace
		 * @alias sap.fe.core.controllerextensions.InternalInternalBasedNavigation
		 *
		 * @private
		 * @since 1.84.0
		 */
		return ControllerExtension.extend("sap.fe.core.controllerextensions.InternalInternalBasedNavigation", {
			metadata: {
				methods: {
					navigate: {
						"final": true,
						"public": true
					},
					getEntitySet: {
						"final": false,
						"public": false
					},
					navigateOutbound: {
						"final": true,
						"public": true
					},
					navigateWithConfirmationDialog: {
						"final": true,
						"public": true
					},
					getNavigationMode: {
						"final": false,
						"public": true,
						overrideExecution: OverrideExecution.Instead
					},
					prepareContextForExternalNavigation: {
						"final": true,
						"public": true
					},
					removeSensitiveData: {
						"final": true,
						"public": true
					},
					prepareFiltersForExternalNavigation: {
						"final": true,
						"public": true
					},
					getOutboundParams: {
						"final": true,
						"public": true
					}
				}
			},
			/**
			 * Enables intent-based navigation (SemanticObject-Action) with the provided context.
			 * If semantic object mapping is provided, this is also applied to the selection variant after the adaptation by a consumer.
			 * This takes care of removing any technical parameters and determines if an explace or inplace navigation should take place.
			 *
			 * @param {string} sSemanticObject Semantic object for the target app
			 * @param {string} sAction  Action for the target app
			 * @param {object} [mNavigationParameters] Optional parameters to be passed to the external navigation
			 * @param {Array|object} [mNavigationParameters.navigationContexts] Uses one of the following to be passed to the intent:
			 *    a single instance of {@link sap.ui.model.odata.v4.Context}
			 *    multiple instances of {@link sap.ui.model.odata.v4.Context}
			 *    an object or an array of objects
			 *		  If an array of objects is passed, the context is used to determine the metaPath and to remove any sensitive data
			 *		  If an array of objects is passed, the following format ix expected:
			 *		  {
			 *			data: {
			 *	 			ProductID: 7634,
			 *				Name: "Laptop"
			 *			 },
			 *			 metaPath: "/SalesOrderManage"
			 *        }
			 * @param {string | object} [mNavigationParameters.semanticObjectMapping] String representation of the SemanticObjectMapping or SemanticObjectMapping that applies to this navigation
			 * @param {object} [mNavigationParameters.defaultRefreshStrategy] Default refresh strategy to be used in case no refresh strategy is specified for the intent in the view.
			 * @param {object} [mNavigationParameters.additionalNavigationParameters] Additional navigation parameters configured in the crossAppNavigation outbound parameters.
			 **/
			navigate: function(sSemanticObject, sAction, mNavigationParameters) {
				var that = this;
				var _doNavigate = function(oContext) {
					var vNavigationContexts = mNavigationParameters && mNavigationParameters.navigationContexts,
						aNavigationContexts =
							vNavigationContexts && !Array.isArray(vNavigationContexts) ? [vNavigationContexts] : vNavigationContexts,
						vSemanticObjectMapping = mNavigationParameters && mNavigationParameters.semanticObjectMapping,
						vOutboundParams = mNavigationParameters && mNavigationParameters.additionalNavigationParameters,
						oTargetInfo = {
							semanticObject: sSemanticObject,
							action: sAction
						},
						oView = that.base.getView(),
						oController = oView.getController();

					if (oContext) {
						that._oView.setBindingContext(oContext);
					}

					if (sSemanticObject && sAction) {
						var aSemanticAttributes = [],
							oSelectionVariant = new SelectionVariant();
						// 1. get SemanticAttributes for navigation
						if (aNavigationContexts && aNavigationContexts.length) {
							aNavigationContexts.map(function(oNavigationContext) {
								// 1.1.a if navigation context is instance of sap.ui.mode.odata.v4.Context
								// else check if navigation context is of type object
								if (oNavigationContext.isA && oNavigationContext.isA("sap.ui.model.odata.v4.Context")) {
									// 1.1.b remove sensitive data
									var oSemanticAttributes = oNavigationContext.getObject(),
										sMetaPath = that._oMetaModel.getMetaPath(oNavigationContext.getPath());
									// TODO: also remove sensitive data from  navigation properties
									oSemanticAttributes = that.removeSensitiveData(oSemanticAttributes, sMetaPath);
									var oNavContext = that.prepareContextForExternalNavigation(oSemanticAttributes, oNavigationContext);
									oTargetInfo["propertiesWithoutConflict"] = oNavContext.propertiesWithoutConflict;
									aSemanticAttributes.push(oNavContext.semanticAttributes);
								} else if (
									!(oNavigationContext && Array.isArray(oNavigationContext.data)) &&
									typeof oNavigationContext === "object"
								) {
									// 1.1.b remove sensitive data from object
									aSemanticAttributes.push(
										that.removeSensitiveData(oNavigationContext.data, oNavigationContext.metaPath)
									);
								} else if (oNavigationContext && Array.isArray(oNavigationContext.data)) {
									// oNavigationContext.data can be array already ex : [{Customer: "10001"}, {Customer: "10091"}]
									// hence assigning it to the aSemanticAttributes
									aSemanticAttributes = that.removeSensitiveData(oNavigationContext.data, oNavigationContext.metaPath);
								}
							});
						}
						// 2.1 Merge base selection variant and sanitized semantic attributes into one SelectionVariant
						if (aSemanticAttributes && aSemanticAttributes.length) {
							oSelectionVariant = that._oNavigationService.mixAttributesAndSelectionVariant(
								aSemanticAttributes,
								oSelectionVariant.toJSONString()
							);
						}

						// 3. Add filterContextUrl to SV so the NavigationHandler can remove any sensitive data based on view entitySet
						var oModel = that._oView.getModel(),
							sEntitySet = that.getEntitySet(),
							sContextUrl = sEntitySet ? that._oNavigationService.constructContextUrl(sEntitySet, oModel) : undefined;
						if (sContextUrl) {
							oSelectionVariant.setFilterContextUrl(sContextUrl);
						}

						// Apply Outbound Parameters to the SV
						if (vOutboundParams) {
							that._applyOutboundParams(oSelectionVariant, vOutboundParams);
						}

						// 4. give an opportunity for the application to influence the SelectionVariant
						oController.intentBasedNavigation.adaptNavigationContext(oSelectionVariant, oTargetInfo);

						// 5. Apply semantic object mappings to the SV
						if (vSemanticObjectMapping) {
							that._applySemanticObjectMappings(oSelectionVariant, vSemanticObjectMapping);
						}

						// 6. remove technical parameters from Selection Variant
						that._removeTechnicalParameters(oSelectionVariant);

						// 7. check if programming model is sticky and page is editable
						var sNavMode = oController._intentBasedNavigation.getNavigationMode();

						// 8. Updating refresh strategy in internal model
						var mRefreshStrategies = (mNavigationParameters && mNavigationParameters.refreshStrategies) || {},
							oInternalModel = oView.getModel("internal");
						if (oInternalModel) {
							if (oView && oView.getViewData().refreshStrategyOnAppRestore) {
								var mViewRefreshStrategies = oView.getViewData().refreshStrategyOnAppRestore || {};
								mergeObjects(mRefreshStrategies, mViewRefreshStrategies);
							}
							var mRefreshStrategy = CommonUtils.getRefreshStrategyForIntent(mRefreshStrategies, sSemanticObject, sAction);
							if (mRefreshStrategy) {
								oInternalModel.setProperty("/refreshStrategyOnAppRestore", mRefreshStrategy);
							}
						}

						// 9. Navigate via NavigationHandler
						var onError = function() {
							sap.ui.require(["sap/m/MessageBox"], function(MessageBox) {
								var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");
								MessageBox.show(oResourceBundle.getText("C_COMMON_HELPER_NAVIGATION_ERROR_MESSAGE"), {
									title: oResourceBundle.getText("C_COMMON_NAVIGATION_ERROR_TITLE")
								});
							});
						};
						that._oNavigationService.navigate(
							sSemanticObject,
							sAction,
							oSelectionVariant.toJSONString(),
							null,
							onError,
							null,
							sNavMode
						);
					} else {
						throw new Error("Semantic Object/action is not provided");
					}
				};
				var oBindingContext = this.base.getView().getBindingContext();
				var oMetaModel = oBindingContext && oBindingContext.getModel().getMetaModel();
				if (
					this.getView().getViewData().converterType === "ObjectPage" &&
					oMetaModel &&
					!ModelHelper.isStickySessionSupported(oMetaModel)
				) {
					CommonUtils.fnProcessDataLossOrDraftDiscardConfirmation(
						_doNavigate.bind(this),
						Function.prototype,
						this.base.getView().getBindingContext(),
						this.base.getView().getController()
					);
				} else {
					_doNavigate();
				}
			},

			/**
			 * Prepare attributes to be passed to external navigation.
			 * @param {object} oSemanticAttributes Context data after removing all sensitive information.
			 * @param {object} oContext Actual context from which the semanticAttributes were derived.
			 * @returns {object} Object of prepared attributes for external navigation and no conflict properties.
			 */
			prepareContextForExternalNavigation: function(oSemanticAttributes, oContext) {
				function _findDistinctKeysInObject(LookUpObject, sLookUpObjectMetaPath) {
					for (var sKey in LookUpObject) {
						// null case??
						if (LookUpObject[sKey] === null || typeof LookUpObject[sKey] !== "object") {
							if (!oDistinctKeys[sKey]) {
								// if key is found for the first time then create array
								oDistinctKeys[sKey] = [];
							}
							// push path to array
							oDistinctKeys[sKey].push(sLookUpObjectMetaPath);
						} else {
							// if a nested object is found
							var oNewLookUpObject = LookUpObject[sKey];
							_findDistinctKeysInObject(oNewLookUpObject, sLookUpObjectMetaPath + "/" + sKey);
						}
					}
				}
				// 1. Find all distinct keys in the object SemanticAttributes
				// Store meta path for each occurence of the key
				var oDistinctKeys = {},
					sContextPath = oContext.getPath(),
					oMetaModel = oContext.getModel().getMetaModel(),
					sMetaPath = oMetaModel.getMetaPath(sContextPath),
					aMetaPathParts = sMetaPath.split("/").filter(Boolean);
				_findDistinctKeysInObject(oSemanticAttributes, sMetaPath);

				// 2. Determine distinct key value and add conflicted paths to semantic attributes
				var sMainEntitySetName = aMetaPathParts[0],
					sMainEntityTypeName = oMetaModel.getObject("/" + sMainEntitySetName + "/@sapui.name"),
					oPropertiesWithoutConflict = {};
				var sMainEntityValuePath, sCurrentValuePath, sLastValuePath;
				for (var sDistinctKey in oDistinctKeys) {
					var aConflictingPaths = oDistinctKeys[sDistinctKey],
						sWinnerValuePath;
					// Find winner value for each distinct key in case of conflict by the following rule:

					// -> A. if any meta path for a distinct key is the same as main entity take that as the value
					// -> B. if A is not met keep the value from the current context (sMetaPath === path of distince key)
					// -> C. if A, B or C are not met take the last path for value
					if (aConflictingPaths.length > 1) {
						// conflict
						for (var i = 0; i <= aConflictingPaths.length - 1; i++) {
							var sPath = aConflictingPaths[i],
								sPathInContext = sPath.replace(sPath === sMetaPath ? sMetaPath : sMetaPath + "/", "");
							sPathInContext = (sPathInContext === "" ? sPathInContext : sPathInContext + "/") + sDistinctKey;
							var sEntityTypeName = oMetaModel.getObject(sPath + "/@sapui.name");
							// rule A

							// rule A
							if (sEntityTypeName === sMainEntityTypeName) {
								sMainEntityValuePath = sPathInContext;
							}

							// rule B
							if (sPath === sMetaPath) {
								sCurrentValuePath = sPathInContext;
							}

							// rule C
							sLastValuePath = sPathInContext;

							// add conflicted path to semantic attributes
							// check if the current path points to main entity and prefix attribute names accordingly
							oSemanticAttributes[
								(sMetaPath + "/" + sPathInContext)
									.split("/")
									.filter(function(sValue) {
										return sValue != "";
									})
									.join(".")
							] = oContext.getProperty(sPathInContext);
						}
						// A || B || C
						sWinnerValuePath = sMainEntityValuePath || sCurrentValuePath || sLastValuePath;
						oSemanticAttributes[sDistinctKey] = oContext.getProperty(sWinnerValuePath);
						sMainEntityValuePath = undefined;
						sCurrentValuePath = undefined;
						sLastValuePath = undefined;
					} else {
						// no conflict, add distinct key without adding paths
						var sPath = aConflictingPaths[0], // because there is only one and hence no conflict
							sPathInContext = sPath.replace(sPath === sMetaPath ? sMetaPath : sMetaPath + "/", "");
						sPathInContext = (sPathInContext === "" ? sPathInContext : sPathInContext + "/") + sDistinctKey;
						oSemanticAttributes[sDistinctKey] = oContext.getProperty(sPathInContext);
						oPropertiesWithoutConflict[sDistinctKey] = (sMetaPath + "/" + sPathInContext)
							.split("/")
							.filter(function(sValue) {
								return sValue != "";
							})
							.join(".");
					}
				}
				// 3. Remove all Navigation properties
				for (var sProperty in oSemanticAttributes) {
					if (oSemanticAttributes[sProperty] !== null && typeof oSemanticAttributes[sProperty] === "object") {
						delete oSemanticAttributes[sProperty];
					}
				}
				return {
					semanticAttributes: oSemanticAttributes,
					propertiesWithoutConflict: oPropertiesWithoutConflict
				};
			},
			/**
			 * Prepare filter conditions to be passed to external navigation.
			 * @param {object} oFilterBarConditions Filter conditions.
			 * @param {string} sRootPath Root path of the application.
			 * @param {Array} aParameters Names of parameters to be considered.
			 * @returns {object} Object of prepared filter conditions for external navigation and no conflict filters.
			 */
			prepareFiltersForExternalNavigation: function(oFilterBarConditions, sRootPath, aParameters) {
				function _findDistinctKeysInObject(LookUpObject, sLookUpObjectMetaPath) {
					for (var sKey in LookUpObject) {
						if (LookUpObject[sKey]) {
							if (sKey.includes("/")) {
								sLookUpObjectMetaPath = sKey; // "/SalesOrdermanage/_Item/Material"
								var aPathParts = sKey.split("/");
								sKey = aPathParts[aPathParts.length - 1];
							} else {
								sLookUpObjectMetaPath = sRootPath;
							}
							if (!oDistinctKeys[sKey]) {
								// if key is found for the first time then create array
								oDistinctKeys[sKey] = [];
							}

							// push path to array
							oDistinctKeys[sKey].push(sLookUpObjectMetaPath);
						}
					}
				}
				var oDistinctKeys = {};

				_findDistinctKeysInObject(oFilterBarConditions, sRootPath);
				var oFilterConditionsWithoutConflict = {};
				var sMainEntityValuePath, sCurrentValuePath, sFullContextPath, sWinnerValuePath, sPathInContext;
				for (var sDistinctKey in oDistinctKeys) {
					var aConflictingPaths = oDistinctKeys[sDistinctKey];

					if (aConflictingPaths.length > 1) {
						// conflict
						for (var i = 0; i <= aConflictingPaths.length - 1; i++) {
							var sPath = aConflictingPaths[i];
							if (sPath === sRootPath) {
								sFullContextPath = sRootPath + "/" + sDistinctKey;
								sPathInContext = sDistinctKey;
								sMainEntityValuePath = sDistinctKey;
								if (aParameters && aParameters.includes(sDistinctKey)) {
									oFilterBarConditions["$Parameter." + sDistinctKey] = oFilterBarConditions[sDistinctKey];
								}
							} else {
								sPathInContext = sPath;
								sFullContextPath = (sRootPath + "/" + sPath).replaceAll("*", "");
								sCurrentValuePath = sPath;
							}
							oFilterBarConditions[
								sFullContextPath
									.split("/")
									.filter(function(sValue) {
										return sValue != "";
									})
									.join(".")
							] = oFilterBarConditions[sPathInContext];
							delete oFilterBarConditions[sPath];
						}

						sWinnerValuePath = sMainEntityValuePath || sCurrentValuePath;
						oFilterBarConditions[sDistinctKey] = oFilterBarConditions[sWinnerValuePath];
					} else {
						// no conflict, add distinct key without adding paths
						var sPath = aConflictingPaths[0], // because there is only one and hence no conflict
							sFullContextPath =
								sPath === sRootPath ? sRootPath + "/" + sDistinctKey : (sRootPath + "/" + sPath).replaceAll("*", "");
						oFilterConditionsWithoutConflict[sDistinctKey] = sFullContextPath
							.split("/")
							.filter(function(sValue) {
								return sValue != "";
							})
							.join(".");
						if (aParameters && aParameters.includes(sDistinctKey)) {
							oFilterBarConditions["$Parameter." + sDistinctKey] = oFilterBarConditions[sDistinctKey];
						}
					}
				}

				return {
					filterConditions: oFilterBarConditions,
					filterConditionsWithoutConflict: oFilterConditionsWithoutConflict
				};
			},

			/**
			 * Get Navigation mode.
			 *
			 * @returns {string}
			 */
			getNavigationMode: function() {
				return "inplace";
			},
			/**
			 * Allows for Navigation to a given Intent(SemanticObject-Action) with the provided context with a dialog showing the contexts which cannot be passed
			 * If Semantic Object mapping is provided that is also applied to the Selection Variant after adaptation by a consumer.
			 * This takes care of removing any technical parameters and determines if an explace or inplace navigation should take place.
			 *
			 * @param {string} sSemanticObject Semantic Object for the target app
			 * @param {string} sAction  Action for the target app
			 * @param {object} [mNavigationParameters] Optional parameters to be passed to the external navigation
			 * @param {Array|object} [mNavigationParameters.navigationContexts] Single instance or multiple instances of {@link sap.ui.model.odata.v4.Context} or alternatively an object or array of objects to be passed to intent.
			 * @param {Array|object} [mNavigationParameters.applicableContexts] Single instance or multiple instances of {@link sap.ui.model.odata.v4.Context} or alternatively an object or array of objects to be passed to intent and for which the IBN button is enabled
			 * @param {Array|object} [mNavigationParameters.notApplicableContexts] Single instance or multiple instances of {@link sap.ui.model.odata.v4.Context} or alternatively an object or array of objects which cannot be passed to the intent.
			 *		  if an array of contexts is passed the context is used to determine the meta path and accordingly remove the sensitive data
			 *		  if an array of objects is passed the following format is expected :
			 *		  {
			 *			data: {
			 *	 			ProductID: 7634,
			 *				Name: "Laptop"
			 *			 },
			 *			 metaPath: "/SalesOrderManage"
			 *        }
			 *		The metaPath is used to remove any sensitive data.
			 * @param {string | object} [mNavigationParameters.semanticObjectMapping] String representation of SemanticObjectMapping or SemanticObjectMapping that applies to this navigation
			 **/
			navigateWithConfirmationDialog: function(sSemanticObject, sAction, mNavigationParameters) {
				var that = this;
				if (mNavigationParameters.notApplicableContexts && mNavigationParameters.notApplicableContexts.length >= 1) {
					var oApplicableContextDialog;
					var oController = {
						onClose: function() {
							// User cancels action
							oApplicableContextDialog.close();
						},
						onContinue: function() {
							// Users continues the action with the bound contexts
							mNavigationParameters.navigationContexts = mNavigationParameters.applicableContexts;
							oApplicableContextDialog.close();
							that.navigate(sSemanticObject, sAction, mNavigationParameters);
						}
					};
					var fnOpenAndFillDialog = function() {
						var oDialogContent,
							nNotApplicable = mNavigationParameters.notApplicableContexts.length,
							aNotApplicableItems = [];
						for (var i = 0; i < mNavigationParameters.notApplicableContexts.length; i++) {
							oDialogContent = mNavigationParameters.notApplicableContexts[i].getObject();
							aNotApplicableItems.push(oDialogContent);
						}
						var oNotApplicableItemsModel = new JSONModel(aNotApplicableItems);
						var oTotals = new JSONModel({ total: nNotApplicable, label: mNavigationParameters.label });
						oApplicableContextDialog.setModel(oNotApplicableItemsModel, "notApplicable");
						oApplicableContextDialog.setModel(oTotals, "totals");
						oApplicableContextDialog.open();
					};
					// Show the contexts that are not applicable and will not therefore be processed
					var sFragmentName = "sap.fe.core.controls.ActionPartial";
					var oDialogFragment = XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment");
					var oModel = this._oView.getModel();
					var oMetaModel = oModel.getMetaModel();
					var sCanonicalPath = mNavigationParameters.notApplicableContexts[0].getCanonicalPath();
					var sEntitySet = sCanonicalPath.substr(0, sCanonicalPath.indexOf("(")) + "/";
					Promise.resolve(
						XMLPreprocessor.process(
							oDialogFragment,
							{ name: sFragmentName },
							{
								bindingContexts: {
									entityType: oMetaModel.createBindingContext(sEntitySet)
								},
								models: {
									entityType: oMetaModel,
									metaModel: oMetaModel
								}
							}
						)
					)
						.then(function(oFragment) {
							return Fragment.load({ definition: oFragment, controller: oController });
						})
						.then(function(oPopover) {
							oApplicableContextDialog = oPopover;
							that.getView().addDependent(oPopover);
							fnOpenAndFillDialog();
						})
						.catch(function() {
							Log.error("Error");
						});
				} else {
					that.navigate(sSemanticObject, sAction, mNavigationParameters);
				}
			},
			_removeTechnicalParameters: function(oSelectionVariant) {
				oSelectionVariant.removeSelectOption("@odata.context");
				oSelectionVariant.removeSelectOption("@odata.metadataEtag");
				oSelectionVariant.removeSelectOption("SAP__Messages");
			},
			/**
			 * Get targeted Entity set.
			 *
			 * @returns {string} Entity set name
			 *
			 *
			 */
			getEntitySet: function() {
				return this._oView.getViewData().entitySet;
			},
			/**
			 * Removes sensitive data from the semantic attribute with respect to entitySet.
			 *
			 * @param {object} oAttributes Context data
			 * @param {boolean} sMetaPath Meta path to reach the entityset in the MetaModel
			 * @returns {Array} Array of semantic Attributes
			 * @private
			 **/
			// TO-DO add unit tests for this function in the controller extension qunit.
			removeSensitiveData: function(oAttributes, sMetaPath) {
				var aProperties = Object.keys(oAttributes);
				if (aProperties.length) {
					delete oAttributes["@odata.context"];
					delete oAttributes["@odata.metadataEtag"];
					delete oAttributes["SAP__Messages"];
					for (var j = 0; j < aProperties.length; j++) {
						if (oAttributes[aProperties[j]] && typeof oAttributes[aProperties[j]] === "object") {
							this.removeSensitiveData(oAttributes[aProperties[j]], sMetaPath + "/" + aProperties[j]);
						}
						var sProp = aProperties[j],
							aPropertyAnnotations = this._oMetaModel.getObject(sMetaPath + "/" + sProp + "@");
						if (aPropertyAnnotations) {
							if (
								aPropertyAnnotations["@com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"] ||
								aPropertyAnnotations["@com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext"] ||
								aPropertyAnnotations["@com.sap.vocabularies.Analytics.v1.Measure"]
							) {
								delete oAttributes[sProp];
							} else if (aPropertyAnnotations["@com.sap.vocabularies.Common.v1.FieldControl"]) {
								var oFieldControl = aPropertyAnnotations["@com.sap.vocabularies.Common.v1.FieldControl"];
								if (oFieldControl["$EnumMember"] && oFieldControl["$EnumMember"].split("/")[1] === "Inapplicable") {
									delete oAttributes[sProp];
								} else if (
									oFieldControl["$Path"] &&
									this._isFieldControlPathInapplicable(oFieldControl["$Path"], oAttributes)
								) {
									delete oAttributes[sProp];
								}
							}
						}
					}
				}
				return oAttributes;
			},

			/**
			 * Check if Path based FieldControl Evaluates to inapplicable.
			 *
			 * @param {string} sFieldControlPath Field control path
			 * @param {object} oAttribute SemanticAttributes
			 * @returns {boolean} `true` if inapplicable
			 *
			 */
			_isFieldControlPathInapplicable: function(sFieldControlPath, oAttribute) {
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
			},
			/**
			 * Method to replace Local Properties with Semantic Object mappings.
			 *
			 * @param {object} oSelectionVariant SelectionVariant consisting of filterbar, Table and Page Context
			 * @param {object} vMappings A string representation of semantic object mapping
			 * @returns {object} - Modified SelectionVariant with LocalProperty replaced with SemanticObjectProperties.
			 */
			_applySemanticObjectMappings: function(oSelectionVariant, vMappings) {
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
			},
			/**
			 * Navigates to an Outbound provided in the manifest.
			 * @function
			 * @param {string} sOutbound Identifier to location the outbound in the manifest
			 * @param {object} mNavigationParameters Optional map containing key/value pairs to be passed to the intent
			 * @alias sap.fe.core.controllerextensions.IntentBasedNavigation#navigateOutbound
			 * @since 1.86.0
			 **/
			navigateOutbound: function(sOutbound, mNavigationParameters) {
				var oManifestEntry = this.base.getAppComponent().getManifestEntry("sap.app"),
					oOutbound = oManifestEntry.crossNavigation && oManifestEntry.crossNavigation.outbounds[sOutbound];
				if (!oOutbound) {
					Log.error("Outbound is not defined in manifest!!");
					return;
				}
				var sSemanticObject = oOutbound.semanticObject,
					sAction = oOutbound.action,
					outboundParams = oOutbound.parameters && this.getOutboundParams(oOutbound.parameters);

				if (mNavigationParameters) {
					var aNavParams = [];
					Object.keys(mNavigationParameters).forEach(function(key) {
						if (Array.isArray(mNavigationParameters[key])) {
							var aValues = mNavigationParameters[key];
							for (var i = 0; i < aValues.length; i++) {
								var oParams = {};
								oParams[key] = aValues[i];
								aNavParams.push(oParams);
							}
						} else {
							var oParams = {};
							oParams[key] = mNavigationParameters[key];
							aNavParams.push(oParams);
						}
					});
				}
				if (aNavParams || outboundParams) {
					mNavigationParameters = {
						navigationContexts: {
							data: aNavParams || outboundParams
						}
					};
				}
				this.base._intentBasedNavigation.navigate(sSemanticObject, sAction, mNavigationParameters);
			},

			/**
			 * Method to apply outbound parameters defined in the manifest.
			 * @param {object} oSelectionVariant SelectionVariant consisting of a filter bar, a table, and a page context
			 * @param {object} vOutboundParams Outbound Properties defined in the manifest
			 * @returns {object} - The modified SelectionVariant with outbound parameters.
			 */
			_applyOutboundParams: function(oSelectionVariant, vOutboundParams) {
				var aParameters = Object.keys(vOutboundParams);
				var aSelectProperties = oSelectionVariant.getSelectOptionsPropertyNames();
				aParameters.forEach(function(key) {
					if (!aSelectProperties.includes(key)) {
						oSelectionVariant.addSelectOption(key, "I", "EQ", vOutboundParams[key]);
					}
				});
				return oSelectionVariant;
			},
			/**
			 * Method to get the outbound parameters defined in the manifest.
			 *
			 * @function
			 * @param {object} [oOutboundParams] Parameters defined in the outbounds. Only "plain" is supported
			 * @returns {Array} Parameters with the key-Value pair
			 **/
			getOutboundParams: function(oOutboundParams) {
				var oParamsMapping = {};
				if (oOutboundParams) {
					var aParameters = Object.keys(oOutboundParams) || [];
					if (aParameters.length > 0) {
						aParameters.forEach(function(key) {
							var oMapping = oOutboundParams[key];
							if (oMapping.value && oMapping.value.value && oMapping.value.format === "plain") {
								if (!oParamsMapping[key]) {
									oParamsMapping[key] = oMapping.value.value;
								}
							}
						});
					}
				}
				return oParamsMapping;
			},

			/**
			 * Triggers an outbound navigation when a user chooses the chevron.
			 *
			 * @param {object} oController
			 * @param {string} sOutboundTarget Name of the outbound target (needs to be defined in the manifest)
			 * @param {sap.ui.model.odata.v4.Context} oContext The context that contains the data for the target app
			 * @param {string} sCreatePath Create path when the chevron is created.
			 * @returns {Promise} Promise which is resolved once the navigation is triggered
			 */

			onChevronPressNavigateOutBound: function(oController, sOutboundTarget, oContext, sCreatePath) {
				var oOutbounds = oController
						.getAppComponent()
						.getRoutingService()
						.getOutbounds(),
					oDisplayOutbound = oOutbounds[sOutboundTarget],
					additionalNavigationParameters;
				if (oDisplayOutbound && oDisplayOutbound.semanticObject && oDisplayOutbound.action) {
					var oRefreshStrategies = {
							intents: {}
						},
						oDefaultRefreshStrategy = {},
						sMetaPath;

					if (oContext) {
						if (oContext.isA && oContext.isA("sap.ui.model.odata.v4.Context")) {
							sMetaPath = CommonUtils.getMetaPathForContext(oContext);
							oContext = [oContext];
						} else {
							sMetaPath = CommonUtils.getMetaPathForContext(oContext[0]);
						}
						oDefaultRefreshStrategy[sMetaPath] = "self";
						oRefreshStrategies["_feDefault"] = oDefaultRefreshStrategy;
					}

					if (sCreatePath) {
						var sKey = oDisplayOutbound.semanticObject + "-" + oDisplayOutbound.action;
						oRefreshStrategies.intents[sKey] = {};
						oRefreshStrategies.intents[sKey][sCreatePath] = "self";
					}
					if (oDisplayOutbound && oDisplayOutbound.parameters) {
						var oParams = oDisplayOutbound.parameters && this.getOutboundParams(oDisplayOutbound.parameters);
						if (Object.keys(oParams).length > 0) {
							additionalNavigationParameters = oParams;
						}
					}

					oController._intentBasedNavigation.navigate(oDisplayOutbound.semanticObject, oDisplayOutbound.action, {
						navigationContexts: oContext,
						refreshStrategies: oRefreshStrategies,
						additionalNavigationParameters: additionalNavigationParameters
					});

					//TODO: check why returning a promise is required
					return Promise.resolve();
				} else {
					throw new Error("outbound target " + sOutboundTarget + " not found in cross navigation definition of manifest");
				}
			},

			override: {
				onInit: function() {
					this._oAppComponent = this.base.getAppComponent();
					this._oMetaModel = this._oAppComponent.getModel().getMetaModel();
					this._oNavigationService = this._oAppComponent.getNavigationService();
					this._oView = this.base.getView();
				}
			}
		});
	}
);
