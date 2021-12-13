/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/ui/core/mvc/ControllerExtension",
		"sap/fe/core/controllerextensions/ControllerExtensionMetadata",
		"sap/ui/core/mvc/OverrideExecution",
		"sap/ui/core/Component",
		"sap/fe/core/CommonUtils",
		"sap/fe/core/BusyLocker",
		"sap/fe/core/helpers/SemanticKeyHelper",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/base/Log",
		"sap/fe/core/actions/messageHandling",
		"sap/m/MessageBox",
		"sap/fe/core/helpers/EditState",
		"sap/fe/core/controllerextensions/MessageHandler",
		"sap/fe/core/helpers/ModelHelper"
	],
	function(
		ControllerExtension,
		ControllerExtensionMetadata,
		OverrideExecution,
		Component,
		CommonUtils,
		BusyLocker,
		SemanticKeyHelper,
		Filter,
		FilterOperator,
		Log,
		messageHandling,
		MessageBox,
		EditState,
		MessageHandler,
		ModelHelper
	) {
		"use strict";
		/**
		 * {@link sap.ui.core.mvc.ControllerExtension Controller extension}
		 *
		 * @namespace
		 * @alias sap.fe.core.controllerextensions.InternalRouting
		 *
		 * @private
		 * @since 1.74.0
		 */
		return ControllerExtension.extend(
			"sap.fe.core.controllerextensions.InternalRouting",
			{
				metadata: {
					methods: {
						"navigateToTarget": { "public": true, "final": false },
						"byId": { "public": false },
						"getView": { "public": false },
						"onRouteMatched": { "public": true, "final": false, overrideExecution: OverrideExecution.After },
						"onRouteMatchedFinished": { "public": true, "final": false, overrideExecution: OverrideExecution.After },
						"onBeforeBinding": { "public": true, "final": false, overrideExecution: OverrideExecution.After },
						"onAfterBinding": { "public": true, "final": false, overrideExecution: OverrideExecution.After },
						"navigateToContext": { "public": true, "final": true },
						"navigateBackFromContext": { "public": true, "final": true },
						"navigateForwardToContext": { "public": true, "final": true },
						"navigateBackFromTransientState": { "public": true, "final": true },
						"navigateToMessagePage": { "public": true, "final": true },
						"enterFullScreen": {
							"public": true,
							"final": false,
							overrideExecution: sap.ui.core.mvc.OverrideExecution.Before
						},
						"exitFullScreen": {
							"public": true,
							"final": false,
							overrideExecution: sap.ui.core.mvc.OverrideExecution.Before
						},
						"closeColumn": { "public": true, "final": false, overrideExecution: sap.ui.core.mvc.OverrideExecution.Before },
						"isCurrentStateImpactedBy": { "public": true, "final": true }
					}
				},
				/**
				 * Triggered every time this controller is a navigation target.
				 */
				onRouteMatched: function() {},
				onRouteMatchedFinished: function() {},
				onBeforeBinding: function(oBindingContext, mParameters) {
					var oRouting = this.base.getView().getController().routing;
					if (oRouting && oRouting.onBeforeBinding) {
						oRouting.onBeforeBinding(oBindingContext, mParameters);
					}
				},
				onAfterBinding: function(oBindingContext, mParameters) {
					this._oAppComponent.getRootViewController().onContextBoundToView(oBindingContext);
					var oRouting = this.base.getView().getController().routing;
					if (oRouting && oRouting.onAfterBinding) {
						oRouting.onAfterBinding(oBindingContext, mParameters);
					}
				},

				///////////////////////////////////////////////////////////
				// Methods triggering a navigation after a user action
				// (e.g. click on a table row, button, etc...)
				///////////////////////////////////////////////////////////

				/**
				 * Navigates to the specified navigation target.
				 *
				 * @param {sap.ui.model.odata.v4.Context} oContext Context instance
				 * @param {string} sNavigationTargetName Navigation target name
				 * @param {object} oSemanticObject Semantic object
				 * @param {boolean} bPreserveHistory True to force the new URL to be added at the end of the browser history (no replace)
				 * @ui5-restricted
				 */
				navigateToTarget: function(oContext, sNavigationTargetName, oSemanticObject, bPreserveHistory) {
					var oNavigationConfiguration =
						this._oPageComponent &&
						this._oPageComponent.getNavigationConfiguration &&
						this._oPageComponent.getNavigationConfiguration(sNavigationTargetName);
					if (oNavigationConfiguration) {
						var oDetailRoute = oNavigationConfiguration.detail;
						var sRouteName = oDetailRoute.route;
						var mParameterMapping = oDetailRoute.parameters;
						this._oRoutingService.navigateTo(oContext, sRouteName, mParameterMapping, bPreserveHistory, oSemanticObject);
					} else {
						this._oRoutingService.navigateTo(oContext, null, null, bPreserveHistory);
					}
					this._oView.getViewData();
				},

				/**
				 * Navigates to a specific context.
				 *
				 * @param {sap.ui.model.odata.v4.Context} oContext The context to be navigated to
				 * @param {object} mParameters Optional navigation parameters
				 * @returns {Promise} Promise resolved when the navigation has been triggered
				 *
				 * @ui5-restricted
				 */
				navigateToContext: function(oContext, mParameters) {
					var that = this;
					var oContextInfo = {};
					mParameters = mParameters || {};
					if (oContext.isA("sap.ui.model.odata.v4.ODataListBinding")) {
						if (mParameters.asyncContext) {
							// the context is either created async (Promise)
							// We need to activate the routeMatchSynchro on the RouterProxy to avoid that
							// the subsequent call to navigateToContext conflicts with the current one
							this._oRouterProxy.activateRouteMatchSynchronization();

							mParameters.asyncContext
								.then(function(oContext) {
									// once the context is returned we navigate into it
									that.navigateToContext(oContext, {
										checkNoHashChange: mParameters.checkNoHashChange,
										editable: mParameters.editable,
										bPersistOPScroll: mParameters.bPersistOPScroll,
										updateFCLLevel: mParameters.updateFCLLevel
									});
								})
								.catch(function(oError) {
									Log.error("Error with the async context", oError);
								});
						} else if (!mParameters.bDeferredContext) {
							// Navigate to a list binding not yet supported
							throw "navigation to a list binding is not yet supported";
						}
					}

					if (mParameters.callExtension) {
						oContextInfo.sourceBindingContext = oContext.getObject();
						oContextInfo.bindingContext = oContext;
						if (mParameters.oEvent) {
							oContextInfo.oEvent = mParameters.oEvent;
						}
						if (
							this.base
								.getView()
								.getController()
								.routing.onBeforeNavigation(oContextInfo)
						) {
							return Promise.resolve();
						}
					}
					mParameters.FCLLevel = this._getFCLLevel();

					return this._oRoutingService.navigateToContext(
						oContext,
						mParameters,
						this._oView.getViewData(),
						this._oTargetInformation
					);
				},

				/**
				 * Navigates backwards from a context.
				 *
				 * @param {sap.ui.model.odata.v4.Context} oContext Context to be navigated from
				 * @param {object} mParameters Optional navigation parameters
				 * @returns {Promise} Promise resolved when the navigation has been triggered
				 *
				 * @ui5-restricted
				 */
				navigateBackFromContext: function(oContext, mParameters) {
					mParameters = mParameters || {};
					mParameters.updateFCLLevel = -1;

					return this.navigateToContext(oContext, mParameters);
				},

				/**
				 * Navigates forwards to a context.
				 *
				 * @param {sap.ui.model.odata.v4.Context} oContext Context to be navigated to
				 * @param {object} mParameters Optional navigation parameters
				 * @returns {Promise} Promise resolved when the navigation has been triggered
				 *
				 * @ui5-restricted
				 */
				navigateForwardToContext: function(oContext, mParameters) {
					if (this._oView.getBindingContext("internal").getProperty("messageFooterContainsErrors") === true) {
						return Promise.resolve();
					}
					mParameters = mParameters || {};
					mParameters.updateFCLLevel = 1;

					return this.navigateToContext(oContext, mParameters, true);
				},

				/**
				 * Navigates back in history if the current hash corresponds to a transient state.
				 */
				navigateBackFromTransientState: function() {
					var sHash = this._oRouterProxy.getHash();

					// if triggered while navigating to (...), we need to navigate back
					if (sHash.indexOf("(...)") !== -1) {
						this._oRouterProxy.navBack();
					}
				},

				navigateToMessagePage: function(sErrorMessage, mParameters) {
					mParameters = mParameters || {};
					if (this._oRouterProxy.getHash().indexOf("i-action=create") > -1) {
						this._oRouterProxy.navToHash(this._oRoutingService.getDefaultCreateHash());
					} else {
						mParameters.FCLLevel = this._getFCLLevel();

						this._oAppComponent.getRootViewController().displayMessagePage(sErrorMessage, mParameters);
					}
				},

				/**
				 * Checks if one of the current views on the screen is bound to a given context.
				 *
				 * @param {sap.ui.model.odata.v4.Context} oContext
				 * @returns {boolean}
				 *
				 * @ui5-restricted
				 */
				isCurrentStateImpactedBy: function(oContext) {
					return this._oRoutingService.isCurrentStateImpactedBy(oContext);
				},

				///////////////////////////////////////////////////////////
				// Methods to bind the page when a route is matched
				///////////////////////////////////////////////////////////

				/**
				 * Called when a route is matched.
				 * Builds the binding context from the navigation parameters, and bind the page accordingly.
				 *
				 * @param {object} oEvent
				 *
				 * @ui5-restricted
				 */
				_onRouteMatched: function(oEvent) {
					// Check if the target for this view is part of the event targets
					var aTargets = oEvent.getParameter("routeInformation") && oEvent.getParameter("routeInformation").targets;
					if (!aTargets || aTargets.indexOf(this._oTargetInformation.targetName) === -1) {
						return;
					}

					// Retrieve the binding context pattern
					var sTarget;
					if (this._oPageComponent && this._oPageComponent.getBindingContextPattern) {
						sTarget = this._oPageComponent.getBindingContextPattern();
					}
					sTarget = sTarget || this._oTargetInformation.contextPattern;

					if (sTarget === null || sTarget === undefined) {
						// Don't do this if we already got sTarget == '', which is a valid target pattern
						sTarget = oEvent.getParameter("routePattern");
					}
					sTarget = sTarget.replace(":?query:", "");

					// Replace the parameters by their values in the binding context pattern
					var mArguments = oEvent.getParameters().arguments,
						bDeferred = false,
						oNavigationParameters = oEvent.getParameter("navigationInfo");

					for (var sKey in mArguments) {
						var sValue = mArguments[sKey];
						if (sValue === "..." && sTarget.indexOf("{" + sKey + "}") >= 0) {
							bDeferred = true;
							// Sometimes in preferredMode = create, the edit button is shown in background when the
							// action parameter dialog shows up, setting bTargetEditable passes editable as true
							// to onBeforeBinding in _bindTargetPage function
							oNavigationParameters.bTargetEditable = true;
						}
						sTarget = sTarget.replace("{" + sKey + "}", sValue);
					}
					if (mArguments["?query"] && mArguments["?query"].hasOwnProperty("i-action")) {
						oNavigationParameters.bActionCreate = true;
					}

					// the binding target is always absolute
					if (sTarget && sTarget[0] !== "/") {
						sTarget = "/" + sTarget;
					}

					this.onRouteMatched();

					var oModel = this._oView.getModel(),
						oOut;
					if (bDeferred) {
						oOut = this._bindDeferred(sTarget, oNavigationParameters);
					} else {
						oOut = this._bindPage(sTarget, oModel, oNavigationParameters);
					}
					var that = this;
					// eslint-disable-next-line promise/catch-or-return
					oOut.finally(function() {
						that.onRouteMatchedFinished();
					});

					this._oAppComponent.getRootViewController().updateUIStateForView(this._oView, this._getFCLLevel());
				},

				/**
				 * Deferred binding (during object creation).
				 *
				 * @param {string} sTargetPath The path to the deffered context
				 * @param {object} oNavigationParameters Navigation parameters
				 * @returns {Promise}
				 * @ui5-restricted
				 */
				_bindDeferred: function(sTargetPath, oNavigationParameters) {
					this.onBeforeBinding(null, { editable: oNavigationParameters.bTargetEditable });

					if (oNavigationParameters.bDeferredContext || !oNavigationParameters.oAsyncContext) {
						// either the context shall be created in the target page (deferred Context) or it shall
						// be created async but the user refreshed the page / bookmarked this URL
						// TODO: currently the target component creates this document but we shall move this to
						// a central place
						if (this._oPageComponent && this._oPageComponent.createDeferredContext) {
							this._oPageComponent.createDeferredContext(sTargetPath, oNavigationParameters.bActionCreate);
						}
					}

					if (this._getBindingContext() && this._getBindingContext().hasPendingChanges()) {
						// For now remove the pending changes to avoid the model raises errors and the object page is at least bound
						// Ideally the user should be asked for
						this._getBindingContext()
							.getBinding()
							.resetChanges();
					}

					// remove the context to avoid showing old data
					this._setBindingContext(null);

					this.onAfterBinding(null);
					return Promise.resolve();
				},

				/**
				 * Sets the binding context of the page from a path.
				 *
				 * @param {string} sTargetPath The path to the context
				 * @param {sap.ui.model.odata.v4.ODataModel} oModel The OData model
				 * @param {object} oNavigationParameters Navigation parameters
				 * @returns {Promise}
				 * @ui5-restricted
				 */
				_bindPage: function(sTargetPath, oModel, oNavigationParameters) {
					var that = this;

					if (sTargetPath === "") {
						return Promise.resolve(this._bindPageToContext(null, oModel, oNavigationParameters));
					} else {
						return this._resolveSemanticPath(sTargetPath, oModel)
							.then(function(sTechnicalPath) {
								that._bindPageToPath(sTechnicalPath, oModel, oNavigationParameters);
							})
							.catch(function(oError) {
								// Error handling for erroneous metadata request
								var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");

								that.navigateToMessagePage(oResourceBundle.getText("C_COMMON_SAPFE_DATA_RECEIVED_ERROR"), {
									title: oResourceBundle.getText("C_COMMON_SAPFE_ERROR"),
									description: oError.message
								});
							});
					}
				},

				/**
				 * Creates the filter to retrieve a context corresponding to a semantic path.
				 *
				 * @param {string} sSemanticPath The semantic path
				 * @param {Array} aSemanticKeys The semantic keys for the path
				 * @param {object} oMetaModel The instance of the meta model
				 * @returns {sap.ui.model.Filter} The filter
				 *
				 * @ui5-restricted
				 */
				_createFilterFromSemanticPath: function(sSemanticPath, aSemanticKeys, oMetaModel) {
					var aKeyValues = sSemanticPath.substring(sSemanticPath.indexOf("(") + 1, sSemanticPath.length - 1).split(","),
						aFilters;

					if (aSemanticKeys.length != aKeyValues.length) {
						return null;
					}

					var bFilteringCaseSensitive = ModelHelper.isFilteringCaseSensitive(oMetaModel);

					if (aSemanticKeys.length === 1) {
						// Take the first key value
						var sKeyValue = aKeyValues[0];
						if (sKeyValue.indexOf("'") === 0 && sKeyValue.lastIndexOf("'") === sKeyValue.length - 1) {
							// Remove the quotes from the value and decode special chars
							sKeyValue = decodeURIComponent(sKeyValue.substring(1, sKeyValue.length - 1));
						}
						aFilters = [
							new Filter({
								path: aSemanticKeys[0].$PropertyPath,
								operator: FilterOperator.EQ,
								value1: sKeyValue,
								caseSensitive: bFilteringCaseSensitive
							})
						];
					} else {
						var mKeyValues = {};
						// Create a map of all key values
						aKeyValues.forEach(function(sKeyAssignment) {
							var aParts = sKeyAssignment.split("="),
								sKeyValue = aParts[1];

							if (sKeyValue.indexOf("'") === 0 && sKeyValue.lastIndexOf("'") === sKeyValue.length - 1) {
								// Remove the quotes from the value and decode special chars
								sKeyValue = decodeURIComponent(sKeyValue.substring(1, sKeyValue.length - 1));
							}

							mKeyValues[aParts[0]] = sKeyValue;
						});

						var bFailed = false;
						aFilters = aSemanticKeys.map(function(oSemanticKey) {
							var sKey = oSemanticKey.$PropertyPath,
								sValue = mKeyValues[sKey];

							if (sValue !== undefined) {
								return new Filter({
									path: sKey,
									operator: FilterOperator.EQ,
									value1: sValue,
									caseSensitive: bFilteringCaseSensitive
								});
							} else {
								bFailed = true;
								return "XX";
							}
						});

						if (bFailed) {
							return null;
						}
					}

					// Add a draft filter to make sure we take the draft entity if there is one
					// Or the active entity otherwise
					var oDraftFilter = new Filter({
						filters: [new Filter("IsActiveEntity", "EQ", false), new Filter("SiblingEntity/IsActiveEntity", "EQ", null)],
						and: false
					});
					aFilters.push(oDraftFilter);

					var oCombinedFilter = new Filter(aFilters, true);
					return oCombinedFilter;
				},

				/**
				 * Converts a path with semantic keys to a path with technical keys.
				 *
				 * @param {string} sSemanticPath The path with semantic keys
				 * @param {sap.ui.model.odata.v4.ODataModel} oModel The model for the path
				 * @param {Array} aSemanticKeys The semantic keys for the path
				 * @returns {Promise} A Promise containing the path with technical keys if sSemanticPath could be interpreted as a semantic path, null otherwise
				 *
				 * @ui5-restricted
				 */
				_getTechnicalPathFromSemanticPath: function(sSemanticPath, oModel, aSemanticKeys) {
					var oMetaModel = oModel.getMetaModel(),
						sEntitySetName = oMetaModel.getMetaContext(sSemanticPath).getPath();

					if (!aSemanticKeys || aSemanticKeys.length === 0) {
						// No semantic keys
						return Promise.resolve(null);
					}

					// Create a set of filters corresponding to all keys
					var oFilter = this._createFilterFromSemanticPath(sSemanticPath, aSemanticKeys, oMetaModel);
					if (oFilter === null) {
						// Couldn't interpret the path as a semantic one
						return Promise.resolve(null);
					}

					// Load the corresponding object
					var oListBinding = oModel.bindList("/" + sEntitySetName, undefined, undefined, oFilter, {
						"$$groupId": "$auto.Heroes"
					});

					return oListBinding.requestContexts(0, 2).then(function(oContexts) {
						if (oContexts && oContexts.length) {
							return oContexts[0].getPath();
						} else {
							// No data could be loaded
							return null;
						}
					});
				},

				/**
				 * Checks if a path is eligible for semantic bookmarking.
				 *
				 * @param {string} sPath The path to test
				 * @param {sap.ui.model.odata.v4.ODataMetaModel} oMetaModel The associated metadata model
				 * @returns {boolean} `true` if the path is eligible
				 *
				 * @ui5-restricted
				 */
				_checkPathForSemanticBookmarking: function(sPath, oMetaModel) {
					// Only path on root objects allow semantic bookmarking, i.e. sPath = xxx(yyy)
					var aMatches = /^[\/]?(\w+)\([^\/]+\)$/.exec(sPath);
					if (!aMatches) {
						return false;
					}
					// Get the entitySet name
					var sEntitySetPath = "/" + aMatches[1];
					// Check the entity set supports draft (otherwise we don't support semantic bookmarking)
					var oDraftRoot = oMetaModel.getObject(sEntitySetPath + "@com.sap.vocabularies.Common.v1.DraftRoot");
					var oDraftNode = oMetaModel.getObject(sEntitySetPath + "@com.sap.vocabularies.Common.v1.DraftNode");
					return oDraftRoot || oDraftNode ? true : false;
				},

				/**
				 * Builds a path with semantic keys from a path with technical keys.
				 * @param {string} sPathToResolve The path to be transformed
				 * @param oModel
				 * @returns {Promise} String promise for the new path. If sPathToResolved couldn't be interpreted as a semantic path, it is returned as is.
				 * @ui5-restricted
				 */
				_resolveSemanticPath: function(sPathToResolve, oModel) {
					var oMetaModel = oModel.getMetaModel(),
						oLastSemanticMapping = this._oRoutingService.getLastSemanticMapping(),
						sCurrentHashNoParams = this._oRouter
							.getHashChanger()
							.getHash()
							.split("?")[0],
						that = this;

					if (sCurrentHashNoParams && sCurrentHashNoParams.lastIndexOf("/") === sCurrentHashNoParams.length - 1) {
						// Remove trailing '/'
						sCurrentHashNoParams = sCurrentHashNoParams.substring(0, sCurrentHashNoParams.length - 1);
					}

					var sRootEntityName = sCurrentHashNoParams && sCurrentHashNoParams.substr(0, sCurrentHashNoParams.indexOf("("));
					if (sRootEntityName.indexOf("/") === 0) {
						sRootEntityName = sRootEntityName.substring(1);
					}
					var bAllowSemanticBookmark = this._checkPathForSemanticBookmarking(sCurrentHashNoParams, oMetaModel),
						aSemanticKeys = bAllowSemanticBookmark && SemanticKeyHelper.getSemanticKeys(oMetaModel, sRootEntityName);
					if (!aSemanticKeys) {
						// No semantic keys available --> use the path as is
						return Promise.resolve(sPathToResolve);
					} else if (oLastSemanticMapping && oLastSemanticMapping.semanticPath === sPathToResolve) {
						// This semantic path has been resolved previously
						return Promise.resolve(oLastSemanticMapping.technicalPath);
					} else {
						// We need resolve the semantic path to get the technical keys
						return this._getTechnicalPathFromSemanticPath(sCurrentHashNoParams, oModel, aSemanticKeys).then(function(
							sTechnicalPath
						) {
							if (sTechnicalPath && sTechnicalPath !== sPathToResolve) {
								// The semantic path was resolved (otherwise keep the original value for target)
								that._oRoutingService.setLastSemanticMapping({
									technicalPath: sTechnicalPath,
									semanticPath: sPathToResolve
								});
								return sTechnicalPath;
							} else {
								return sPathToResolve;
							}
						});
					}
				},

				/**
				 * Sets the binding context of the page from a path.
				 *
				 * @param {string} sTargetPath The path to build the context. Needs to contain technical keys only.
				 * @param {sap.ui.model.odata.v4.ODataModel} oModel The OData model
				 * @param {object} oNavigationParameters Navigation parameters
				 *
				 * @ui5-restricted
				 */
				_bindPageToPath: function(sTargetPath, oModel, oNavigationParameters) {
					var oCurrentContext = this._getBindingContext(),
						sCurrentPath = oCurrentContext && oCurrentContext.getPath(),
						oUseContext = oNavigationParameters.useContext;

					// We set the binding context only if it's different from the current one
					// or if we have a context already selected
					if (sCurrentPath !== sTargetPath || (oUseContext && oUseContext.getPath() === sTargetPath)) {
						var oTargetContext;
						if (oUseContext && oUseContext.getPath() === sTargetPath) {
							// We already have the context to be used
							oTargetContext = oUseContext;
						} else {
							// Otherwise we need to create it from sTargetPath
							oTargetContext = this._createBindingContext(sTargetPath, oModel);
						}
						if (oTargetContext !== oCurrentContext) {
							this._bindPageToContext(oTargetContext, oModel, oNavigationParameters);
						}
					} else if (!oNavigationParameters.bReasonIsIappState && EditState.isEditStateDirty()) {
						this._refreshBindingContext(oCurrentContext);
					}
				},

				/**
				 * Binds the page to a context.
				 *
				 * @param {sap.ui.model.odata.v4.Context} oContext Context to be bound
				 * @param {sap.ui.model.odata.v4.ODataModel} oModel The OData model
				 * @param {object} oNavigationParameters Navigation parameters
				 *
				 * @ui5-restricted
				 */
				_bindPageToContext: function(oContext, oModel, oNavigationParameters) {
					var that = this;
					if (!oContext) {
						this.onBeforeBinding(null);
						this.onAfterBinding(null);
					} else {
						var oParentListBinding = oContext.getBinding();

						if (!oContext.getBinding() || oContext.getBinding().isA("sap.ui.model.odata.v4.ODataListBinding")) {
							// We need to recreate the context otherwise we get errors
							oContext = this._createBindingContext(oContext.getPath(), oModel);
							if (EditState.isEditStateDirty()) {
								// TODO: as a workaround we invalidate the model cache while the app is dirty
								// as the manage model sets the parent in an async task and the request side effects
								// relies on the parent relationship we have to set a timeout 0
								setTimeout(function() {
									that._refreshBindingContext(oContext);
								}, 0);
							}
						}

						// Set the binding context with the proper before/after callbacks
						this.onBeforeBinding(oContext, {
							editable: oNavigationParameters.bTargetEditable,
							listBinding: oParentListBinding,
							bPersistOPScroll: oNavigationParameters.bPersistOPScroll,
							bDraftNavigation: oNavigationParameters.bDraftNavigation,
							showPlaceholder: oNavigationParameters.bShowPlaceholder
						});

						this._setBindingContext(oContext);
						this.onAfterBinding(oContext);
					}
				},

				/**
				 * Creates a binding context from a path.
				 *
				 * @param {string} sPath The path
				 * @param {sap.ui.model.odata.v4.ODataModel} oModel The OData model
				 * @returns {sap.ui.model.odata.v4.Context} Created context
				 *
				 * @ui5-restricted
				 */
				_createBindingContext: function(sPath, oModel) {
					var oPageComponent = this._oPageComponent,
						sEntitySet = oPageComponent && oPageComponent.getEntitySet && oPageComponent.getEntitySet(),
						sContextPath =
							(oPageComponent && oPageComponent.getContextPath && oPageComponent.getContextPath()) ||
							(sEntitySet && "/" + sEntitySet),
						oMetaModel = oModel.getMetaModel(),
						that = this,
						mParameters = {
							$$patchWithoutSideEffects: true,
							$$groupId: "$auto.Heroes",
							$$updateGroupId: "$auto"
						};

					if (sEntitySet) {
						var sMessagesPath = oMetaModel.getObject(sContextPath + "/@com.sap.vocabularies.Common.v1.Messages/$Path");
						if (sMessagesPath) {
							mParameters.$select = sMessagesPath;
						}
					}

					// In case of draft: $select the state flags (HasActiveEntity, HasDraftEntity, and IsActiveEntity)
					var oDraftRoot = oMetaModel.getObject(sContextPath + "@com.sap.vocabularies.Common.v1.DraftRoot");
					var oDraftNode = oMetaModel.getObject(sContextPath + "@com.sap.vocabularies.Common.v1.DraftNode");
					if (oDraftRoot || oDraftNode) {
						if (mParameters.$select === undefined) {
							mParameters.$select = "HasActiveEntity,HasDraftEntity,IsActiveEntity";
						} else {
							mParameters.$select += ",HasActiveEntity,HasDraftEntity,IsActiveEntity";
						}
					}

					var oHiddenBinding = oModel.bindContext(sPath, undefined, mParameters);

					oHiddenBinding.attachEventOnce("dataRequested", function() {
						BusyLocker.lock(that._oView);
					});
					oHiddenBinding.attachEventOnce("dataReceived", function(oEvent) {
						var sErrorDescription = oEvent && oEvent.getParameter("error");
						BusyLocker.unlock(that._oView);
						if (sErrorDescription) {
							// TODO: in case of 404 the text shall be different
							sap.ui
								.getCore()
								.getLibraryResourceBundle("sap.fe.core", true)
								.then(function(oResourceBundle) {
									var messageHandler = new MessageHandler();
									messageHandler.removeTransitionMessages();
									that.navigateToMessagePage(oResourceBundle.getText("C_COMMON_SAPFE_DATA_RECEIVED_ERROR"), {
										title: oResourceBundle.getText("SAPFE_ERROR"),
										description: sErrorDescription
									});
								})
								.catch(function(oError) {
									Log.error("Error while getting the core resource bundle", oError);
								});
						}
					});

					return oHiddenBinding.getBoundContext();
				},

				/**
				 * Requests side effects on a binding context to "refresh" it.
				 * TODO: get rid of this once provided by the model
				 * a refresh on the binding context does not work in case a creation row with a transient context is
				 * used. also a requestSideEffects with an empty path would fail due to the transient context
				 * therefore we get all dependent bindings (via private model method) to determine all paths and then
				 * request them.
				 *
				 * @param {sap.ui.model.odata.v4.Context} oBindingContext Context to be refreshed
				 *
				 * @ui5-restricted
				 */
				_refreshBindingContext: function(oBindingContext) {
					var oPageComponent = this._oPageComponent,
						oSideEffectsService = this._oAppComponent.getSideEffectsService(),
						sRootContextPath = oBindingContext.getPath(),
						sEntitySet = oPageComponent && oPageComponent.getEntitySet && oPageComponent.getEntitySet(),
						sContextPath =
							(oPageComponent && oPageComponent.getContextPath && oPageComponent.getContextPath()) ||
							(sEntitySet && "/" + sEntitySet),
						oMetaModel = this._oView.getModel().getMetaModel(),
						sMessagesPath,
						aNavigationPropertyPaths = [],
						aPropertyPaths = [],
						oSideEffects = {
							TargetProperties: [],
							TargetEntities: []
						};

					function getBindingPaths(oBinding) {
						var aDependentBindings,
							sRelativePath = ((oBinding.getContext() && oBinding.getContext().getPath()) || "").replace(
								sRootContextPath,
								""
							), // If no context, this is an absolute binding so no relative path
							sPath = (sRelativePath ? sRelativePath.slice(1) + "/" : sRelativePath) + oBinding.getPath();

						if (oBinding.isA("sap.ui.model.odata.v4.ODataContextBinding")) {
							// if (sPath === "") {
							// now get the dependent bindings
							aDependentBindings = oBinding.getDependentBindings();
							if (aDependentBindings) {
								// ask the dependent bindings (and only those with the specified groupId
								//if (aDependentBindings.length > 0) {
								for (var i = 0; i < aDependentBindings.length; i++) {
									getBindingPaths(aDependentBindings[i]);
								}
							} else if (aNavigationPropertyPaths.indexOf(sPath) === -1) {
								aNavigationPropertyPaths.push(sPath);
							}
						} else if (oBinding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
							if (aNavigationPropertyPaths.indexOf(sPath) === -1) {
								aNavigationPropertyPaths.push(sPath);
							}
						} else if (oBinding.isA("sap.ui.model.odata.v4.ODataPropertyBinding")) {
							if (aPropertyPaths.indexOf(sPath) === -1) {
								aPropertyPaths.push(sPath);
							}
						}
					}

					if (sContextPath) {
						sMessagesPath = oMetaModel.getObject(sContextPath + "/@com.sap.vocabularies.Common.v1.Messages/$Path");
					}

					// binding of the context must have $$PatchWithoutSideEffects true, this bound context may be needed to be fetched from the dependent binding
					getBindingPaths(oBindingContext.getBinding());

					var i;
					for (i = 0; i < aNavigationPropertyPaths.length; i++) {
						oSideEffects.TargetEntities.push({
							$NavigationPropertyPath: aNavigationPropertyPaths[i]
						});
					}
					oSideEffects.TargetProperties = aPropertyPaths;
					if (sMessagesPath) {
						oSideEffects.TargetProperties.push({
							$PropertyPath: sMessagesPath
						});
					}
					oSideEffectsService.requestSideEffects(
						oSideEffects.TargetEntities.concat(oSideEffects.TargetProperties),
						oBindingContext
					);
				},

				/**
				 * Gets the binding context of the page or the component.
				 *
				 * @returns {sap.ui.model.odata.v4.Context} The binding context
				 *
				 * @ui5-restricted
				 */
				_getBindingContext: function() {
					if (this._oPageComponent) {
						return this._oPageComponent.getBindingContext();
					} else {
						return this._oView.getBindingContext();
					}
				},

				/**
				 * Sets the binding context of the page or the component.
				 *
				 * @param {sap.ui.model.odata.v4.Context} oContext The binding context
				 *
				 * @ui5-restricted
				 */
				_setBindingContext: function(oContext) {
					if (this._oPageComponent) {
						this._oPageComponent.setBindingContext(oContext);
					} else {
						this._oView.setBindingContext(oContext);
					}
				},

				/**
				 * Gets the flexible column layout (FCL) level corresponding to the view (-1 if the app is not FCL).
				 *
				 * @returns {number} The level
				 *
				 * @ui5-restricted
				 */
				_getFCLLevel: function() {
					return this._oTargetInformation.FCLLevel;
				},

				overflowToolbarButtonHover: function() {
					this.sCurrentFocusedControlId = sap.ui.getCore().getCurrentFocusedControlId();
				},
				/**
				 * Sets the current column of a FCL to fullscreen mode.
				 *
				 * @ui5-restricted
				 */
				enterFullScreen: function() {
					var oSource = this.base.getView();
					var oContext = oSource.getBindingContext(),
						sNextLayout = oSource.getModel("fclhelper").getProperty("/actionButtonsInfo/fullScreen");

					var oRouterProxy = this._oRouterProxy;
					var sCurrentFocusedControlId = this.sCurrentFocusedControlId;
					this.base._routing
						.navigateToContext(oContext, { sLayout: sNextLayout })
						.then(function() {
							var oLastHistoryEntry = oRouterProxy.getLastHistoryEntry();
							oLastHistoryEntry.oLastFocusControl = Object.assign({}, oLastHistoryEntry.oLastFocusControl, {
								controlId: sCurrentFocusedControlId,
								focusInfo: { id: sCurrentFocusedControlId }
							});
						})
						.catch(function() {
							Log.warning("cannot set focus on last focused control");
						});
				},

				/**
				 * Exits fullscreen mode for the current column of a FCL.
				 *
				 * @ui5-restricted
				 */
				exitFullScreen: function() {
					var oSource = this.base.getView();
					var oContext = oSource.getBindingContext(),
						sNextLayout = oSource.getModel("fclhelper").getProperty("/actionButtonsInfo/exitFullScreen");

					var oRouterProxy = this._oRouterProxy;
					var sCurrentFocusedControlId = this.sCurrentFocusedControlId;
					this.base._routing
						.navigateToContext(oContext, { sLayout: sNextLayout })
						.then(function() {
							var oLastHistoryEntry = oRouterProxy.getLastHistoryEntry();
							oLastHistoryEntry.oLastFocusControl = Object.assign({}, oLastHistoryEntry.oLastFocusControl, {
								controlId: sCurrentFocusedControlId,
								focusInfo: { id: sCurrentFocusedControlId }
							});
						})
						.catch(function() {
							Log.warning("cannot set focus on last focused control");
						});
				},

				/**
				 * Closes the column for the current view in a FCL.
				 *
				 * @ui5-restricted
				 */
				closeColumn: function() {
					var oSource = this.base.getView();
					var oViewData = oSource.getViewData();
					var oContext = oSource.getBindingContext();
					var base = this.base;
					var oMetaModel = oContext.getModel().getMetaModel();

					if (oViewData && oViewData.viewLevel === 1 && ModelHelper.isDraftSupported(oMetaModel, oContext.getPath())) {
						CommonUtils.fnProcessDataLossOrDraftDiscardConfirmation(
							function() {
								base._routing.navigateBackFromContext(oContext, { noPreservationCache: true });
							},
							Function.prototype,
							oContext,
							oSource.getController(),
							false
						);
					} else {
						base._routing.navigateBackFromContext(oContext, { noPreservationCache: true });
					}
				},

				override: {
					onExit: function() {
						this._oRoutingService && this._oRoutingService.detachRouteMatched(this._fnRouteMatchedBound);
					},
					onInit: function() {
						var that = this;
						this._oView = this.base.getView();
						this._oAppComponent = CommonUtils.getAppComponent(this._oView);
						this._oPageComponent = Component.getOwnerComponentFor(this._oView);
						this._oRouter = this._oAppComponent.getRouter();
						this._oRouterProxy = this._oAppComponent.getRouterProxy();

						if (!this._oAppComponent || !this._oPageComponent) {
							throw new Error("Failed to initialize controler extension 'sap.fe.core.controllerextesions.InternalRouting");
						}

						if (this._oAppComponent === this._oPageComponent) {
							// The view isn't hosted in a dedicated UIComponent, but directly in the app
							// --> just keep the view
							this._oPageComponent = null;
						}

						this._oAppComponent
							.getService("routingService")
							.then(function(oRoutingService) {
								that._oRoutingService = oRoutingService;
								that._fnRouteMatchedBound = that._onRouteMatched.bind(that);
								that._oRoutingService.attachRouteMatched(that._fnRouteMatchedBound);
								that._oTargetInformation = oRoutingService.getTargetInformationFor(that._oPageComponent || that._oView);
							})
							.catch(function() {
								throw new Error(
									"This controller extension cannot work without a 'routingService' on the main AppComponent"
								);
							});
					}
				}
			},
			ControllerExtensionMetadata
		);
	}
);
