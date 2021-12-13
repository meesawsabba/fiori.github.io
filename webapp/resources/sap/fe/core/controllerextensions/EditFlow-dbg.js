/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/ui/core/mvc/ControllerExtension",
		"sap/ui/core/mvc/OverrideExecution",
		"sap/fe/core/actions/sticky",
		"sap/base/Log",
		"sap/m/Text",
		"sap/m/Button",
		"sap/m/Dialog",
		"sap/fe/core/CommonUtils",
		"sap/fe/core/BusyLocker",
		"sap/fe/core/library",
		"sap/ui/model/odata/v4/ODataListBinding",
		"sap/fe/core/helpers/SemanticKeyHelper",
		"sap/fe/core/helpers/EditState",
		"sap/fe/core/helpers/FPMHelper",
		"sap/ui/core/message/Message",
		"sap/ui/core/MessageType"
	],
	function(
		ControllerExtension,
		OverrideExecution,
		sticky,
		Log,
		Text,
		Button,
		Dialog,
		CommonUtils,
		BusyLocker,
		FELibrary,
		ODataListBinding,
		SemanticKeyHelper,
		EditState,
		FPMHelper,
		Message,
		MessageType
	) {
		"use strict";

		/**
		 * @class A controller extension offering hooks into the edit flow of the application
		 *
		 * @name sap.fe.core.controllerextensions.EditFlow
		 * @hideconstructor
		 * @public
		 * @experimental As of version 1.90.0
		 * @since 1.90.0
		 */

		var CreationMode = FELibrary.CreationMode,
			ProgrammingModel = FELibrary.ProgrammingModel,
			Constants = FELibrary.Constants,
			DraftStatus = FELibrary.DraftStatus,
			EditMode = FELibrary.EditMode;

		var Extension = ControllerExtension.extend("sap.fe.core.controllerextensions.EditFlow", {
			metadata: {
				methods: {
					editDocument: { "public": true, "final": true },
					updateDocument: { "public": true, "final": true },
					createDocument: { "public": true, "final": true },
					saveDocument: { "public": true, "final": true },
					cancelDocument: { "public": true, "final": true },
					deleteDocument: { "public": true, "final": true },
					deleteMultipleDocuments: { "public": true, "final": true },
					applyDocument: { "public": true, "final": true },
					invokeAction: { "public": true, "final": true },
					securedExecution: { "public": true, "final": true },

					onBeforeSave: { "public": true, "final": false, "overrideExecution": OverrideExecution.Instead }
				}
			},

			//////////////////////////////////////
			// Public methods
			//////////////////////////////////////

			// Internal only params ---
			// @param {boolean} mParameters.prepareOnEdit Indicates that the 'prepare' action for draft-based documents is called

			// eslint-disable-next-line jsdoc/require-param
			/**
			 * Creates a draft document for an existing active document.
			 *
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {object} oContext Context of the active document
			 * @returns {Promise} Promise resolves once the editable document is available
			 * @alias sap.fe.core.controllerextensions.EditFlow#editDocument
			 * @public
			 * @experimental As of version 1.90.0
			 * @since 1.90.0
			 */
			editDocument: function(oContext, mParameters) {
				mParameters = mParameters || {};
				var that = this,
					bPrepareOnEdit = mParameters.prepareOnEdit || undefined,
					bDraftNavigation = true,
					transactionHelper = this._getTransactionHelper();

				return transactionHelper
					.editDocument(oContext, bPrepareOnEdit, that.getView(), that._getMessageHandler())
					.then(function(oNewDocumentContext) {
						var sProgrammingModel = that._getProgrammingModel(oContext);

						if (sProgrammingModel === ProgrammingModel.Sticky) {
							that._getInternalModel().setProperty("/sessionOn", true);
						}
						if (oNewDocumentContext) {
							that._setEditMode(EditMode.Editable, false);
							that._getMessageHandler().showMessageDialog();

							if (oNewDocumentContext !== oContext) {
								return that._handleNewContext(oNewDocumentContext, true, undefined, bDraftNavigation).then(function() {
									if (sProgrammingModel === ProgrammingModel.Sticky) {
										// The stickyOn handler must be set after the navigation has been done,
										// as the URL may change in the case of FCL
										that._handleStickyOn(oNewDocumentContext);
									}
								});
							}
						}
					});
			},

			deleteMultipleDocuments: function(aContexts, mParameters) {
				return this.base
					.getView()
					.getController()
					._editFlow.deleteMultipleDocuments(aContexts, mParameters);
			},

			/**
			 * Updates the draft status and displays the error messages if there are errors during an update.
			 *
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {object} oContext Context of the updated field
			 * @param {object} oPromise Promise to determine when the update operation is completed. The promise should be resolved when the update operation is completed, so the draft status can be updated.
			 * @returns {Promise} Promise resolves once draft status has been updated
			 * @alias sap.fe.core.controllerextensions.EditFlow#updateDocument
			 * @public
			 * @experimental As of version 1.90.0
			 * @since 1.90.0
			 */
			updateDocument: function(oContext, oPromise) {
				var that = this,
					transactionHelper = that._getTransactionHelper(),
					bIsDraft = that._getProgrammingModel(oContext) === ProgrammingModel.Draft;

				this._getMessageHandler().removeTransitionMessages();
				return this._syncTask(function() {
					transactionHelper.handleDocumentModifications();
					EditState.setEditStateDirty();
					that._getMessageHandler().removeTransitionMessages();

					if (bIsDraft) {
						that._setDraftStatus(DraftStatus.Saving);
					}

					return oPromise
						.then(
							function() {
								if (bIsDraft) {
									var oBindingContext = that.getView().getBindingContext(),
										oMetaModel = oBindingContext.getModel().getMetaModel(),
										sEntitySetName = oMetaModel.getMetaContext(oBindingContext.getPath()).getObject("@sapui.name"),
										aSemanticKeys = SemanticKeyHelper.getSemanticKeys(oMetaModel, sEntitySetName);
									if (aSemanticKeys && aSemanticKeys.length) {
										var oCurrentSemanticMapping = that.base
												.getAppComponent()
												.getRoutingService()
												.getLastSemanticMapping(),
											sCurrentSemanticPath = oCurrentSemanticMapping && oCurrentSemanticMapping.semanticPath,
											sChangedPath = SemanticKeyHelper.getSemanticPath(oBindingContext, true);

										if (sCurrentSemanticPath !== sChangedPath) {
											return that._handleNewContext(oBindingContext, true, undefined, true).then(function() {
												that._setDraftStatus(DraftStatus.Saved);
											});
										} else {
											that._setDraftStatus(DraftStatus.Saved);
										}
									} else {
										that._setDraftStatus(DraftStatus.Saved);
									}
								}
							},
							function() {
								if (bIsDraft) {
									that._setDraftStatus(DraftStatus.Clear);
								}
							}
						)
						.catch(function(oError) {
							Log.error("Error while updating the document", oError);
						})
						.finally(function() {
							that._getMessageHandler().showMessageDialog();
						});
				});
			},

			// Internal only params ---
			// * @param {string} mParameters.creationMode The creation mode using one of the following:
			// *                    NewPage - the created document is shown in a new page, depending on whether metadata Sync, Async or Deferred is used
			// *                    Sync - the creation is triggered and once the document is created, the navigation is done
			// *                    Async - the creation and the navigation to the instance are done in parallel
			// *                    Deferred - the creation is done on the target page
			// *                    Inline - The creation is done inline (in a table)
			// *                    CreationRow - The creation is done inline async so the user is not blocked
			// mParameters.creationRow Instance of the creation row - (TODO: get rid but use list bindings only)

			// eslint-disable-next-line jsdoc/require-param
			/**
			 * Creates a new document.
			 *
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {sap.ui.model.odata.v4.ODataListBinding|string} vListBinding  ODataListBinding object or the binding path for a temporary list binding
			 * @returns {Promise} Promise resolves once the object has been created
			 * @alias sap.fe.core.controllerextensions.EditFlow#createDocument
			 * @public
			 * @experimental As of version 1.90.0
			 * @since 1.90.0
			 */
			createDocument: function(vListBinding, mParameters) {
				var that = this,
					transactionHelper = this._getTransactionHelper(),
					oLockObject = this._getGlobalUIModel(),
					oTable,
					iCountTableItems = 0,
					oResourceBundle = that.getView().getController().oResourceBundle,
					bShouldBusyLock =
						!mParameters ||
						(mParameters.creationMode !== CreationMode.Inline &&
							mParameters.creationMode !== CreationMode.CreationRow &&
							mParameters.creationMode !== CreationMode.External),
					oExecFunctionFromManifestPromise = Promise.resolve([]),
					oAppComponent = CommonUtils.getAppComponent(this.getView());
				oAppComponent.getRouterProxy().removeIAppStateKey();

				if (mParameters.creationMode === CreationMode.External) {
					// Create by navigating to an external target
					// TODO: Call appropriate function (currently using the same as for outbound chevron nav, and without any context - 3rd param)
					return this._syncTask().then(function() {
						var oController = that.getView().getController(),
							sCreatePath = CommonUtils.getAbsoluteMetaPathForListBinding(that.getView(), vListBinding);

						oController.handlers.onChevronPressNavigateOutBound(oController, mParameters.outbound, undefined, sCreatePath);
					});
				}

				if (mParameters.creationMode === CreationMode.CreationRow && mParameters.creationRow) {
					oTable = mParameters.creationRow.getParent();
					// get custom validation function from manifest
					var sCustomValidationFunction = oTable.getCreationRow().data("customValidationFunction");
					if (sCustomValidationFunction) {
						var sModule = sCustomValidationFunction
								.substring(0, sCustomValidationFunction.lastIndexOf(".") || -1)
								.replace(/\./gi, "/"),
							sFunctionName = sCustomValidationFunction.substring(
								sCustomValidationFunction.lastIndexOf(".") + 1,
								sCustomValidationFunction.length
							),
							oCreationRowObjects = mParameters.creationRow.getBindingContext().getObject();
						delete oCreationRowObjects["@$ui5.context.isTransient"];
						oExecFunctionFromManifestPromise = FPMHelper.validationWrapper(
							sModule,
							sFunctionName,
							oCreationRowObjects,
							that.base.getView(),
							oTable.getBindingContext("internal")
						);
					}

					// disableAddRowButtonForEmptyData is set to false in manifest converter (Table.ts) if customValidationFunction exists
					if (oTable.getCreationRow().data("disableAddRowButtonForEmptyData") === "true") {
						var oInternalModelContext = oTable.getBindingContext("internal");
						oInternalModelContext.setProperty("creationRowFieldValidity", {});
					}
				}

				if (mParameters.creationMode === CreationMode.Inline && mParameters.tableId) {
					oTable = this.getView().byId(mParameters.tableId);
				}

				/**
				 * @param {sap.ui.model.odata.v4.ODataListBinding} oListBinding
				 * @param {object} oCreationPromise
				 */
				function handleSideEffects(oListBinding, oCreationPromise) {
					oCreationPromise
						.then(function(oNewContext) {
							// transient contexts are reliably removed once oNewContext.created() is resolved
							return oNewContext.created();
						})
						.then(function() {
							var oBindingContext = that.getView().getBindingContext();
							// if there are transient contexts, we must avoid requesting side effects
							// this is avoid a potential list refresh, there could be a side effect that refreshes the list binding
							// if list binding is refreshed, transient contexts might be lost
							if (!CommonUtils.hasTransientContext(oListBinding)) {
								var oAppComponent = CommonUtils.getAppComponent(that.getView());
								oAppComponent
									.getSideEffectsService()
									.requestSideEffectsForNavigationProperty(oListBinding.getPath(), oBindingContext);
							}
						})
						.catch(function(oError) {
							Log.error("Error while creating the document", oError);
						});
				}

				/**
				 * @param {Array} aValidationMessages Error messages from custom validation function
				 */
				function createCustomValidationMessages(aValidationMessages) {
					var sCustomValidationFunction = oTable && oTable.getCreationRow().data("customValidationFunction"),
						mCustomValidity = oTable && oTable.getBindingContext("internal").getProperty("creationRowCustomValidity"),
						oMessageManager = sap.ui.getCore().getMessageManager(),
						aCustomMessages = [],
						oFieldControl,
						sTarget;

					// Remove existing CustomValidation message
					oMessageManager
						.getMessageModel()
						.getData()
						.forEach(function(oMessage) {
							if (oMessage.code === sCustomValidationFunction) {
								oMessageManager.removeMessages(oMessage);
							}
						});

					aValidationMessages.forEach(function(oValidationMessage) {
						// Handle Bound CustomValidation message
						if (oValidationMessage.messageTarget) {
							oFieldControl = sap.ui.getCore().getControl(mCustomValidity[oValidationMessage.messageTarget].fieldId);
							sTarget = oFieldControl.getBindingContext().getPath() + "/" + oFieldControl.getBindingPath("value");
							// Add validation message if still not exists
							if (
								oMessageManager
									.getMessageModel()
									.getData()
									.filter(function(oMessage) {
										return oMessage.target === sTarget;
									}).length === 0
							) {
								oMessageManager.addMessages(
									new Message({
										message: oValidationMessage.messageText,
										processor: that.getView().getModel(),
										type: MessageType.Error,
										code: sCustomValidationFunction,
										technical: false,
										persistent: false,
										target: sTarget
									})
								);
							}
							// Add controlId in order to get the focus handling of the error popover runable
							var aExistingValidationMessages = oMessageManager
								.getMessageModel()
								.getData()
								.filter(function(oMessage) {
									return oMessage.target === sTarget;
								});
							aExistingValidationMessages[0].addControlId(mCustomValidity[oValidationMessage.messageTarget].fieldId);

							// Handle Unbound CustomValidation message
						} else {
							aCustomMessages.push({
								code: sCustomValidationFunction,
								text: oValidationMessage.messageText,
								persistent: true,
								type: MessageType.Error
							});
						}
					});

					if (aCustomMessages.length > 0) {
						that._getMessageHandler().showMessageDialog({
							customMessages: aCustomMessages
						});
					}
				}

				bShouldBusyLock && BusyLocker.lock(oLockObject);
				return this._syncTask(oExecFunctionFromManifestPromise)
					.then(function(aValidationMessages) {
						if (aValidationMessages.length > 0) {
							createCustomValidationMessages(aValidationMessages);
							Log.error("Custom Validation failed");
							// if custom validation fails, we leave the method immediately
							return;
						}

						var sProgrammingModel, oListBinding, oModel;

						mParameters = mParameters || {};

						if (vListBinding && typeof vListBinding === "object") {
							// we already get a list binding use this one
							oListBinding = vListBinding;
						} else if (typeof vListBinding === "string") {
							oListBinding = new ODataListBinding(that.getView().getModel(), vListBinding);
							mParameters.creationMode = CreationMode.Sync;
							delete mParameters.createAtEnd;
						} else {
							throw new Error("Binding object or path expected");
						}

						oModel = oListBinding.getModel();
						iCountTableItems = oListBinding.iMaxLength || 0;
						var sCreationMode = mParameters.creationMode;

						return Promise.resolve(that._getProgrammingModel(oListBinding))
							.then(function(programmingModel) {
								sProgrammingModel = programmingModel;
								if (sCreationMode && sCreationMode !== CreationMode.NewPage) {
									// use the passed creation mode
									return sCreationMode;
								} else {
									var oMetaModel = oModel.getMetaModel();
									// NewAction is not yet supported for NavigationProperty collection
									if (!oListBinding.isRelative()) {
										var sPath = oListBinding.getPath(),
											// if NewAction with parameters is present, then creation is 'Deferred'
											// in the absence of NewAction or NewAction with parameters, creation is async
											sNewAction =
												sProgrammingModel === ProgrammingModel.Draft
													? oMetaModel.getObject(sPath + "@com.sap.vocabularies.Common.v1.DraftRoot/NewAction")
													: oMetaModel.getObject(
															sPath + "@com.sap.vocabularies.Session.v1.StickySessionSupported/NewAction"
													  );
										if (sNewAction) {
											var aParameters = oMetaModel.getObject("/" + sNewAction + "/@$ui5.overload/0/$Parameter") || [];
											// binding parameter (eg: _it) is not considered
											if (aParameters.length > 1) {
												return CreationMode.Deferred;
											}
										}
									}
									var sMetaPath = oMetaModel.getMetaPath(oListBinding.getHeaderContext().getPath());
									var aNonComputedVisibleKeyFields = CommonUtils.getNonComputedVisibleFields(oMetaModel, sMetaPath);
									if (aNonComputedVisibleKeyFields.length > 0) {
										return CreationMode.Deferred;
									}
									return CreationMode.Async;
								}
							})
							.then(function(sCreationMode) {
								var oCreation,
									mArgs,
									oCreationRow = mParameters.creationRow,
									oCreationRowContext,
									oValidationCheck = Promise.resolve(),
									oPayload,
									sMetaPath,
									oMetaModel = oModel.getMetaModel(),
									oRoutingListener = that._getRoutingListener();

								if (sCreationMode !== CreationMode.Deferred) {
									if (sCreationMode === CreationMode.CreationRow) {
										oCreationRowContext = oCreationRow.getBindingContext();
										sMetaPath = oMetaModel.getMetaPath(oCreationRowContext.getPath());
										// prefill data from creation row
										oPayload = oCreationRowContext.getObject();
										mParameters.data = {};
										Object.keys(oPayload).forEach(function(sPropertyPath) {
											var oProperty = oMetaModel.getObject(sMetaPath + "/" + sPropertyPath);
											// ensure navigation properties are not part of the payload, deep create not supported
											if (oProperty && oProperty.$kind === "NavigationProperty") {
												return;
											}
											mParameters.data[sPropertyPath] = oPayload[sPropertyPath];
										});
										oValidationCheck = that._checkForValidationErrors(oCreationRowContext);
									}
									if (sCreationMode === CreationMode.CreationRow || sCreationMode === CreationMode.Inline) {
										mParameters.keepTransientContextOnFailed = false; // currently not fully supported
										// busy handling shall be done locally only
										mParameters.busyMode = "Local";

										// take care on message handling, draft indicator (in case of draft)
										// Attach the create sent and create completed event to the object page binding so that we can react
										that._handleCreateEvents(oListBinding);
									}

									oCreation = oValidationCheck.then(function() {
										if (!mParameters.parentControl) {
											mParameters.parentControl = that.getView();
										}
										return transactionHelper.createDocument(
											oListBinding,
											mParameters,
											oResourceBundle,
											that._getMessageHandler()
										);
									});
								}

								var oNavigation;
								switch (sCreationMode) {
									case CreationMode.Deferred:
										oNavigation = oRoutingListener.navigateForwardToContext(oListBinding, {
											bDeferredContext: true,
											editable: true
										});
										break;
									case CreationMode.Async:
										oNavigation = oRoutingListener.navigateForwardToContext(oListBinding, {
											asyncContext: oCreation,
											editable: true
										});
										break;
									case CreationMode.Sync:
										mArgs = {
											editable: true
										};
										if (sProgrammingModel == ProgrammingModel.Sticky || mParameters.createAction) {
											mArgs.transient = true;
										}
										oNavigation = oCreation.then(function(oNewDocumentContext) {
											if (!oNewDocumentContext) {
												var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");
												return oRoutingListener.navigateToMessagePage(
													oResourceBundle.getText("C_COMMON_SAPFE_DATA_RECEIVED_ERROR"),
													{
														title: oResourceBundle.getText("C_COMMON_SAPFE_ERROR"),
														description: oResourceBundle.getText("C_EDITFLOW_SAPFE_CREATION_FAILED_DESCRIPTION")
													}
												);
											} else {
												return oRoutingListener.navigateForwardToContext(oNewDocumentContext, mArgs);
											}
										});
										break;
									case CreationMode.Inline:
										oNavigation = handleSideEffects(oListBinding, oCreation);
										that._syncTask(oCreation);
										break;
									case CreationMode.CreationRow:
										// the creation row shall be cleared once the validation check was successful and
										// therefore the POST can be sent async to the backend
										oNavigation = oValidationCheck
											.then(function() {
												var oCreationRowListBinding = oCreationRowContext.getBinding(),
													oNewTransientContext;

												if (!mParameters.bSkipSideEffects) {
													handleSideEffects(oListBinding, oCreation);
												}

												oNewTransientContext = oCreationRowListBinding.create();
												oCreationRow.setBindingContext(oNewTransientContext);

												// this is needed to avoid console errors TO be checked with model colleagues
												oNewTransientContext.created().catch(function() {
													Log.trace("transient fast creation context deleted");
												});
												return oCreationRowContext.delete("$direct");
											})
											.catch(function(oError) {
												// Reset busy indicator after a validation error
												if (BusyLocker.isLocked(that.getView().getModel("ui"))) {
													BusyLocker.unlock(that.getView().getModel("ui"));
												}
												Log.error("CreationRow navigation error: ", oError);
											});
										break;
									default:
										oNavigation = Promise.reject("Unhandled creationMode " + sCreationMode);
										break;
								}

								if (sProgrammingModel === ProgrammingModel.Sticky) {
									that._getInternalModel().setProperty("/sessionOn", true);
								}
								if (oCreation) {
									return Promise.all([oCreation, oNavigation])
										.then(function(aParams) {
											that._setEditMode(EditMode.Editable, true);
											var oNewDocumentContext = aParams[0];
											if (oNewDocumentContext) {
												EditState.setEditStateDirty();

												if (sProgrammingModel === ProgrammingModel.Sticky) {
													that._handleStickyOn(oNewDocumentContext);
												}
											}
										})
										.catch(function(oError) {
											if (oError && oError.navigateBackFromTransientState) {
												oRoutingListener.navigateBackFromTransientState();
											}

											return Promise.reject(oError);
										});
								}
							});
					})
					.finally(function() {
						if (oTable && oTable.isA("sap.ui.mdc.Table")) {
							var fnFocusOrScroll =
								mParameters.creationMode === CreationMode.Inline
									? oTable.focusRow.bind(oTable)
									: oTable.scrollToIndex.bind(oTable);
							oTable.getRowBinding().attachEventOnce("change", function() {
								switch (mParameters.createAtEnd) {
									case true:
										if (oTable.data("tableType") === "ResponsiveTable" && oTable.getThreshold()) {
											fnFocusOrScroll(oTable.getThreshold(), true);
										} else {
											fnFocusOrScroll(iCountTableItems, true);
										}
										break;
									case false:
										fnFocusOrScroll(0, true);
										break;
								}
							});
						}
						bShouldBusyLock && BusyLocker.unlock(oLockObject);
					});
			},

			/**
			 * This function can be used to intercept the save action. You can execute custom coding in this function.
			 * The framework waits for the returned promise to be resolved before continuing the save action. If you
			 * reject the promise the save action is stopped and the user stays in edit mode.
			 *
			 * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
			 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.Instead}.
			 *
			 * @returns {Promise} A promise to be returned by the overridden method. If resolved, the save action is triggered. If rejected, the save action is not triggered and the user stays in edit mode.
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @alias sap.fe.core.controllerextensions.EditFlow#onBeforeSave
			 * @public
			 * @experimental As of version 1.90.0
			 * @since 1.90.0
			 */
			onBeforeSave: function() {
				// to be overridden
				return Promise.resolve();
			},

			// Internal only params ---
			// @param {boolean} mParameters.bExecuteSideEffectsOnError Indicates whether SideEffects need to be ignored when user clicks on Save during an Inline creation
			// @param {object} mParameters.bindings List bindings of the tables in the view.
			// Both of the above parameters are for the same purpose. User can enter some information in the creation row(s) but does not 'Add row', instead clicks Save.
			// There can be more than one in the view.

			// eslint-disable-next-line jsdoc/require-param
			/**
			 * Saves a new document after checking it.
			 *
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {object} oContext  Context of the editable document
			 * @returns {Promise} Promise resolves once save is complete
			 * @alias sap.fe.core.controllerextensions.EditFlow#saveDocument
			 * @public
			 * @experimental As of version 1.90.0
			 * @since 1.90.0
			 */
			saveDocument: function(oContext, mParameters) {
				mParameters = mParameters || {};
				var that = this,
					bExecuteSideEffectsOnError = mParameters.bExecuteSideEffectsOnError || undefined,
					bDraftNavigation = true,
					transactionHelper = this._getTransactionHelper(),
					oResourceBundle = that.getView().getController().oResourceBundle,
					aBindings = mParameters.bindings;
				// first of all wait until all key-match-requests are done
				return (
					this._syncTask()
						// submit any open changes if there any (although there are validation/parse errors)
						.then(this._submitOpenChanges.bind(this, oContext))
						// check if there are any validation/parse errors
						.then(this._checkForValidationErrors.bind(this, oContext))
						.then(this.base.editFlow.onBeforeSave.bind(this))
						// and finally if all user changes are submitted and valid save the document
						.then(
							transactionHelper.saveDocument.bind(
								transactionHelper,
								oContext,
								oResourceBundle,
								bExecuteSideEffectsOnError,
								aBindings,
								that._getMessageHandler()
							)
						)
						.then(function(oActiveDocumentContext) {
							var sProgrammingModel = that._getProgrammingModel(oContext);

							that._removeContextsFromPages();
							if (sProgrammingModel === ProgrammingModel.Sticky) {
								that._getInternalModel().setProperty("/sessionOn", false);
								that._handleStickyOff(oContext);
							}

							that._setEditMode(EditMode.Display, false);
							that._getMessageHandler().showMessageDialog();

							if (oActiveDocumentContext !== oContext) {
								that._handleNewContext(oActiveDocumentContext, false, undefined, bDraftNavigation);
							}
						})
						.catch(function(oError) {
							Log.error("Error while saving the document", oError);
							return Promise.reject(oError);
						})
				);
			},

			toggleDraftActive: function(oContext) {
				var oContextData = oContext.getObject();
				var that = this;
				var bEditable;
				var bIsDraft = oContext && this._getProgrammingModel(oContext) === ProgrammingModel.Draft;
				var oToggleContext = oContext
					.getModel()
					.bindContext(oContext.getPath() + "/SiblingEntity")
					.getBoundContext();

				//toggle between draft and active document is only available for edit drafts and active documents with draft)
				if (
					!bIsDraft ||
					!(
						(!oContextData.IsActiveEntity && oContextData.HasActiveEntity) ||
						(oContextData.IsActiveEntity && oContextData.HasDraftEntity)
					)
				) {
					return;
				}

				if (!oContextData.IsActiveEntity && oContextData.HasActiveEntity) {
					//start Point: edit draft
					bEditable = false;
				} else if (oContextData.IsActiveEntity && oContextData.HasDraftEntity) {
					// start point active document
					bEditable = true;
				}
				oToggleContext
					.requestCanonicalPath()
					.then(function(sCanonicalPath) {
						// We use the canonical path for the navigation instead of the semantic path, as the
						// semantic key values may have changed between the draft and the active version (BCP 2170216142)
						return oToggleContext
							.getModel()
							.bindContext(sCanonicalPath)
							.getBoundContext();
					})
					.then(function(oToggleContext) {
						that._setEditMode(bEditable ? EditMode.Editable : EditMode.Display, false); //switch to edit mode only if a draft is available
						that._handleNewContext(oToggleContext, bEditable, true, true);
					})
					.catch(function(err) {
						return Promise.reject("Error in EditFlow.toggleDraftActive:" + err);
					});
			},

			// Internal only params ---
			// @param {sap.m.Button} mParameters.cancelButton - Currently this is passed as cancelButton internally (replaced by mParameters.control in the JSDoc below). Currently it is also mandatory.
			// Plan - This should not be mandatory. If not provided, we should have a default that can act as reference control for the discard popover OR we can show a dialog instead of a popover.

			/**
			 * Discard the editable document.
			 *
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {object} oContext  Context of the editable document
			 * @param {map} [mParameters] Can contain the following attributes:
			 * @param {object} mParameters.control This is the control used to open the Discard popover. It is mandatory.
			 * @returns {Promise} Promise resolves once editable document has been discarded
			 * @alias sap.fe.core.controllerextensions.EditFlow#cancelDocument
			 * @public
			 * @experimental As of version 1.90.0
			 * @since 1.90.0
			 */
			cancelDocument: function(oContext, mParameters) {
				var that = this,
					transactionHelper = this._getTransactionHelper(),
					oResourceBundle = that.getView().getController().oResourceBundle;
				mParameters.cancelButton = mParameters.control || mParameters.cancelButton;
				return this._syncTask()
					.then(
						transactionHelper.cancelDocument.bind(
							transactionHelper,
							oContext,
							mParameters,
							oResourceBundle,
							that._getMessageHandler()
						)
					)
					.then(function(oActiveDocumentContext) {
						var bDraftNavigation = true,
							sProgrammingModel = that._getProgrammingModel(oContext);

						that._removeContextsFromPages();
						if (sProgrammingModel === ProgrammingModel.Sticky) {
							that._getInternalModel().setProperty("/sessionOn", false);
							that._handleStickyOff(oContext);
						}

						that._setEditMode(EditMode.Display, false);
						that._setDraftStatus(DraftStatus.Clear);

						//in case of a new document, the value of hasActiveEntity is returned. navigate back.
						if (!oActiveDocumentContext) {
							EditState.setEditStateDirty();
							that._getRoutingListener().navigateBackFromContext(oContext);
						} else if (sProgrammingModel === ProgrammingModel.Draft) {
							// We need to load the semantic keys of the active context, as we need them
							// for the navigation
							return that._fetchSemanticKeyValues(oActiveDocumentContext).then(function() {
								// We force the recreation of the context, so that it's created and bound in the same microtask,
								// so that all properties are loaded together by autoExpandSelect, so that when switching back to Edit mode
								// $$inheritExpandSelect takes all loaded properties into account (BCP 2070462265)
								if (mParameters.bSkipBindingToView) {
									return oActiveDocumentContext;
								} else {
									return that._handleNewContext(oActiveDocumentContext, false, true, bDraftNavigation);
								}
							});
						} else {
							//active context is returned in case of cancel of existing document
							return that._handleNewContext(oActiveDocumentContext, false, undefined, bDraftNavigation);
						}
					});
			},

			// Internal only params ---
			// @param {string} mParameters.entitySetName Name of the EntitySet to which the object belongs

			/**
			 * Deletes the document.
			 *
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {object} oContext  Context of the document
			 * @param {map} [mParameters] Optional, can contain the following attributes:
			 * @param {string} mParameters.title Title of the object being deleted
			 * @param {string} mParameters.description Description of the object being deleted
			 * @returns {Promise} Promise resolves once document has been deleted
			 * @alias sap.fe.core.controllerextensions.EditFlow#deleteDocument
			 * @public
			 * @experimental As of version 1.90.0
			 * @since 1.90.0
			 */
			deleteDocument: function(oContext, mParameters) {
				var that = this;
				var oAppComponent = CommonUtils.getAppComponent(that.getView());
				if (!mParameters) {
					mParameters = {
						bFindActiveContexts: false
					};
				} else {
					mParameters.bFindActiveContexts = false;
				}
				return this._deleteDocumentTransaction(oContext, mParameters).then(function() {
					// Single objet deletion is triggered from an OP header button (not from a list)
					// --> Mark UI dirty and navigate back to dismiss the OP
					EditState.setEditStateDirty();

					that._getRoutingListener().navigateBackFromContext(oContext);
					// After delete is successfull, we need to dettch the setBackNavigation Methods
					if (oAppComponent) {
						oAppComponent.getShellServices().setBackNavigation();
					}
				});
			},

			/**
			 * Submit the current set of changes and navigate back.
			 *
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {object} oContext  Context of the document
			 * @returns {Promise} Promise resolves once the changes have been saved
			 * @alias sap.fe.core.controllerextensions.EditFlow#applyDocument
			 * @public
			 * @experimental As of version 1.90.0
			 * @since 1.90.0
			 */
			applyDocument: function(oContext) {
				var that = this,
					oLockObject = this._getGlobalUIModel();
				BusyLocker.lock(oLockObject);
				return (
					this._submitOpenChanges(oContext)
						// check if there are any validation/parse errors
						.then(this._checkForValidationErrors.bind(this, oContext))
						.then(function() {
							that._getMessageHandler().showMessageDialog();
							that._getRoutingListener().navigateBackFromContext(oContext);
							return true;
						})
						.finally(function() {
							if (BusyLocker.isLocked(oLockObject)) {
								BusyLocker.unlock(oLockObject);
							}
						})
				);
			},

			// Internal only params ---
			// @param {boolean} [mParameters.bStaticAction] Boolean value for static action, undefined for other actions
			// @param {boolean} [mParameters.isNavigable] Boolean value indicating whether navigation is required after the action has been executed
			// Currently the parameter isNavigable is used internally and should be changed to requiresNavigation as it is a more apt name for this param

			/**
			 * Invokes an action (bound or unbound) and tracks the changes so that other pages can be refreshed and show the updated data upon navigation.
			 *
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {string} sActionName The name of the action to be called
			 * @param {map} [mParameters] Contains the following attributes:
			 * @param {sap.ui.model.odata.v4.Context} [mParameters.contexts] For a bound action, a context or an array with contexts for which the action shall be called must be provided
			 * @param {sap.ui.model.odata.v4.ODataModel} [mParameters.model] For an unbound action, an instance of an OData V4 model must be provided
			 * @param {boolean} [mParameters.requiresNavigation] Boolean value indicating whether navigation is required after the action has been executed. Navigation takes place to the context returned by the action.
			 * @param {string} [mParameters.label] A human-readable label for the action. This is needed in case the action has a parameter and a parameter dialog is shown to the user.
			 * @returns {Promise}
			 * @alias sap.fe.core.controllerextensions.EditFlow#invokeAction
			 * @public
			 * @experimental As of version 1.90.0
			 * @since 1.90.0
			 * @final
			 **/
			invokeAction: function(sActionName, mParameters) {
				var that = this,
					oTable,
					transactionHelper = this._getTransactionHelper(),
					oControl,
					oBindingContext,
					aParts,
					sOverloadEntityType,
					oCurrentActionCallBacks,
					oView = this.getView();

				mParameters = mParameters || {};

				// Due to a mistake the invokeAction in the extensionAPI had a different API than this one.
				// The one from the extensionAPI doesn't exist anymore as we expose the full edit flow now but
				// due to compatibility reasons we still need to support the old signature
				if (
					(mParameters.isA && mParameters.isA("sap.ui.model.odata.v4.Context")) ||
					Array.isArray(mParameters) ||
					arguments.length === 3
				) {
					var contexts = mParameters;
					mParameters = arguments[2] || {};
					if (contexts) {
						mParameters.contexts = contexts;
					} else {
						mParameters.model = this.getView().getModel();
					}
				}

				mParameters.isNavigable = mParameters.requiresNavigation || mParameters.isNavigable;

				if (!mParameters.parentControl) {
					mParameters.parentControl = this.getView();
				}

				if (mParameters.prefix) {
					oTable = this.getView().byId(mParameters.prefix);
					if (oTable) {
						// TODO: currently this selected contexts update is done within the operation, should be moved out
						mParameters.internalModelContext = oTable.getBindingContext("internal");
					}
				} else {
					mParameters.internalModelContext = oView.getBindingContext("internal");
				}

				if (sActionName && sActionName.indexOf("(") > -1) {
					// get entity type of action overload and remove it from the action path
					// Example sActionName = "<ActionName>(Collection(<OverloadEntityType>))"
					// sActionName = aParts[0] --> <ActionName>
					// sOverloadEntityType = aParts[2] --> <OverloadEntityType>
					aParts = sActionName.split("(");
					sActionName = aParts[0];
					sOverloadEntityType = aParts[aParts.length - 1].replaceAll(")", "");
				}

				if (mParameters.bStaticAction) {
					if (oTable.isTableBound()) {
						mParameters.contexts = oTable.getRowBinding().getHeaderContext();
					} else {
						var sBindingPath = oTable.data("rowsBindingInfo").path,
							oListBinding = new ODataListBinding(that.getView().getModel(), sBindingPath);
						mParameters.contexts = oListBinding.getHeaderContext();
					}

					if (sOverloadEntityType) {
						var sTableContextEntityType = mParameters.contexts
							.getModel()
							.getMetaModel()
							.getMetaContext(mParameters.contexts.getPath())
							.getObject("$Type");
						if (sOverloadEntityType !== sTableContextEntityType) {
							// search for context in control tree hierarchy
							oControl = oTable;
							while (oControl) {
								oBindingContext = oControl.getBindingContext();
								if (
									oBindingContext &&
									oBindingContext
										.getModel()
										.getMetaModel()
										.getMetaContext(oBindingContext.getPath())
										.getObject("$Type") === sOverloadEntityType
								) {
									mParameters.contexts = oBindingContext;
									break;
								} else {
									// check parent
									oControl = oControl.getParent();
								}
							}
							if (!mParameters.contexts) {
								return Promise.reject("Context not found for entity type " + sOverloadEntityType);
							}
						}
					}

					if (mParameters.enableAutoScroll) {
						oCurrentActionCallBacks = this._createActionPromise(sActionName, oTable.sId);
					}
				}

				if (mParameters.isNavigable) {
					mParameters.bGetBoundContext = false;
				} else {
					mParameters.bGetBoundContext = true;
				}
				// Need to know that the action is called from ObjectPage for changeSet Isolated workaround
				mParameters.bObjectPage = oView.getViewData().converterType === "ObjectPage";
				return this._syncTask()
					.then(
						transactionHelper.callAction.bind(
							transactionHelper,
							sActionName,
							mParameters,
							that.getView(),
							that._getMessageHandler()
						)
					)
					.then(function(oResponse) {
						// if the returned context for the bound action is different than the context on which action was called,
						// refresh the corresponding list binding
						if (mParameters.contexts) {
							return that
								._refreshListIfRequired(that._getActionResponseDataAndKeys(sActionName, oResponse), mParameters.contexts[0])
								.then(function() {
									return oResponse;
								});
						}
					})
					.then(function(oResponse) {
						if (oCurrentActionCallBacks) {
							oCurrentActionCallBacks.fResolver(oResponse);
						}
						/*
					 We set the (upper) pages to dirty after an execution of an action
					 TODO: get rid of this workaround
					 This workaround is only needed as long as the model does not support the synchronization.
					 Once this is supported we don't need to set the pages to dirty anymore as the context itself
					 is already refreshed (it's just not reflected in the object page)
					 we explicitly don't call this method from the list report but only call it from the object page
					 as if it is called in the list report it's not needed - as we anyway will remove this logic
					 we can live with this
					 we need a context to set the upper pages to dirty - if there are more than one we use the
					 first one as they are anyway siblings
					 */
						if (mParameters.contexts) {
							EditState.setEditStateDirty();
						}
						if (mParameters.isNavigable) {
							var vContext = oResponse;
							if (Array.isArray(vContext) && vContext.length === 1) {
								vContext = vContext[0];
							}
							if (vContext && !Array.isArray(vContext)) {
								var oMetaModel = oView.getModel().getMetaModel();
								var sContextMetaPath = oMetaModel.getMetaPath(vContext.getPath());
								var oActionContext = Array.isArray(mParameters.contexts) ? mParameters.contexts[0] : mParameters.contexts;
								var sActionContextMetaPath = oActionContext && oMetaModel.getMetaPath(oActionContext.getPath());
								if (sContextMetaPath != undefined && sContextMetaPath === sActionContextMetaPath) {
									if (oActionContext.getPath() !== vContext.getPath()) {
										that._getRoutingListener().navigateForwardToContext(vContext, {
											noHistoryEntry: false
										});
									} else {
										Log.info("Navigation to the same context is not allowed");
									}
								}
							}
						}
					})
					.catch(function(err) {
						if (oCurrentActionCallBacks) {
							oCurrentActionCallBacks.fRejector();
						}
						if (err == Constants.CancelActionDialog) {
							return Promise.reject("Dialog cancelled.");
						} else {
							return Promise.reject("Error in EditFlow.invokeAction:" + err);
						}
					});
			},

			/**
			 * Secured execution of the given function. Ensures that the function is only executed when certain conditions are fulfilled.
			 *
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {Function} fnFunction The function to be executed. Should return a promise that is settled after completion of the execution. If nothing is returned, immediate completion is assumed.
			 * @param {map} [mParameters] Definitions of the preconditions to be checked before execution
			 * @param {object} [mParameters.busy] Defines the busy indicator
			 * @param {boolean} [mParameters.busy.set=true] Triggers a busy indicator when the function is executed.
			 * @param {boolean} [mParameters.busy.check=true] Executes function only if application isn't busy.
			 * @param {boolean} [mParameters.updatesDocument] This operation updates the current document without using the bound model and context. As a result, the draft status is updated if a draft document exists, and the user has to confirm the cancellation of the editing process.
			 * @returns {Promise} A promise that is rejected if the execution is prohibited and resolved by the promise returned by the fnFunction.
			 * @alias sap.fe.core.controllerextensions.EditFlow#securedExecution
			 * @public
			 * @experimental As of version 1.90.0
			 * @since 1.90.0
			 */
			securedExecution: function(fnFunction, mParameters) {
				var bBusySet = mParameters && mParameters.busy && mParameters.busy.set !== undefined ? mParameters.busy.set : true,
					bBusyCheck = mParameters && mParameters.busy && mParameters.busy.check !== undefined ? mParameters.busy.check : true,
					bUpdatesDocument = (mParameters && mParameters.updatesDocument) || false,
					oLockObject = this._getGlobalUIModel(),
					oContext = this.base.getView().getBindingContext(),
					bIsDraft = oContext && this._getProgrammingModel(oContext) === ProgrammingModel.Draft,
					that = this;

				if (bBusyCheck && BusyLocker.isLocked(oLockObject)) {
					return Promise.reject("Application already busy therefore execution rejected");
				}

				// we have to set busy and draft indicator immediately also the function might be executed later in queue
				if (bBusySet) {
					BusyLocker.lock(oLockObject);
				}
				if (bUpdatesDocument && bIsDraft) {
					this._setDraftStatus(DraftStatus.Saving);
				}

				this._getMessageHandler().removeTransitionMessages();

				return this._syncTask(fnFunction)
					.then(function() {
						if (bUpdatesDocument) {
							that._getTransactionHelper().handleDocumentModifications();
							EditState.setEditStateDirty();
							if (bIsDraft) {
								that._setDraftStatus(DraftStatus.Saved);
							}
						}
					})
					.catch(function(oError) {
						if (bUpdatesDocument && bIsDraft) {
							that._setDraftStatus(DraftStatus.Clear);
						}
						return Promise.reject(oError);
					})
					.finally(function() {
						if (bBusySet) {
							BusyLocker.unlock(oLockObject);
						}
						return that._getMessageHandler().showMessageDialog();
					});
			},

			/**
			 * Handles the patchSent event: register document modification.
			 *
			 * @param oEvent
			 */
			handlePatchSent: function(oEvent) {
				var that = this;
				this.mPatchPromises = this.mPatchPromises ? this.mPatchPromises : {};
				// do this for every unique object (eg: every table) so that each associated promise is fulfilled at the end
				var oPatchPromise = new Promise(function(resolve, reject) {
					that.mPatchPromises[oEvent.getSource()] = {
						resolvePatchPromise: resolve,
						rejectPatchPromise: reject
					};
				});
				this.updateDocument(oEvent.getSource(), oPatchPromise);
			},

			/**
			 * Handles the patchCompleted event: resolves or rejects document modification.
			 *
			 * @param oEvent
			 */
			handlePatchCompleted: function(oEvent) {
				var bSuccess = oEvent.getParameter("success");
				if (bSuccess) {
					this.mPatchPromises[oEvent.getSource()].resolvePatchPromise();
				} else {
					this.mPatchPromises[oEvent.getSource()].rejectPatchPromise();
				}
				delete this.mPatchPromises[oEvent.getSource()];
			},

			//////////////////////////////////////
			// Private methods
			//////////////////////////////////////

			/*
			 TO BE CHECKED / DISCUSSED
			 _createMultipleDocuments and deleteMultiDocument - couldn't we combine them with create and delete document?
			 _createActionPromise and deleteCurrentActionPromise -> next step

			 */

			_setEditMode: function(sEditMode, bCreationMode) {
				this.base
					.getView()
					.getController()
					._editFlow.setEditMode(sEditMode, bCreationMode);
			},

			_setDraftStatus: function(sDraftState) {
				this.base
					.getView()
					.getController()
					._editFlow.setDraftStatus(sDraftState);
			},

			_getRoutingListener: function() {
				return this.base
					.getView()
					.getController()
					._editFlow.getRoutingListener();
			},

			_getGlobalUIModel: function() {
				return this.base
					.getView()
					.getController()
					._editFlow.getGlobalUIModel();
			},

			_syncTask: function(vTask) {
				return this.base
					.getView()
					.getController()
					._editFlow.syncTask(vTask);
			},

			_getProgrammingModel: function(oContext) {
				return this.base
					.getView()
					.getController()
					._editFlow.getProgrammingModel(oContext);
			},

			_deleteDocumentTransaction: function(oContext, mParameters) {
				return this.base
					.getView()
					.getController()
					._editFlow.deleteDocumentTransaction(oContext, mParameters);
			},

			_handleCreateEvents: function(oBinding) {
				this.base
					.getView()
					.getController()
					._editFlow.handleCreateEvents(oBinding);
			},

			_getTransactionHelper: function() {
				return this.base
					.getView()
					.getController()
					._editFlow.getTransactionHelper();
			},

			_getInternalModel: function() {
				return this.base
					.getView()
					.getController()
					._editFlow.getInternalModel();
			},

			/**
			 * Creates a new promise to wait for an action to be executed
			 *
			 * @function
			 * @name _createActionPromise
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 *
			 * @returns {Function} The resolver function which can be used to externally resolve the promise
			 */

			_createActionPromise: function(sActionName, sControlId) {
				return this.base
					.getView()
					.getController()
					._editFlow.createActionPromise(sActionName, sControlId);
			},

			_getCurrentActionPromise: function() {
				return this.base
					.getView()
					.getController()
					._editFlow.getCurrentActionPromise();
			},

			_deleteCurrentActionPromise: function() {
				return this.base
					.getView()
					.getController()
					._editFlow.deleteCurrentActionPromise();
			},

			_getMessageHandler: function() {
				return this.base
					.getView()
					.getController()
					._editFlow.getMessageHandler();
			},

			/**
			 * @function
			 * @name _getActionResponseDataAndKeys
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {string} sActionName The name of the action that is executed
			 * @param {object} oResponse The bound action's response data or response context
			 * @returns {object} Object with data and names of the key fields of the response
			 */
			_getActionResponseDataAndKeys: function(sActionName, oResponse) {
				return this.base
					.getView()
					.getController()
					._editFlow.getActionResponseDataAndKeys(sActionName, oResponse);
			},

			_submitOpenChanges: function(oContext) {
				var oModel = oContext.getModel(),
					oLockObject = this._getGlobalUIModel();
				//Currently we are using only 1 updateGroupId, hence submitting the batch directly here
				return oModel
					.submitBatch("$auto")
					.then(function() {
						if (oModel.hasPendingChanges("$auto")) {
							// the submit was not successful
							return Promise.reject("submit of open changes failed");
						}
					})
					.finally(function() {
						if (BusyLocker.isLocked(oLockObject)) {
							BusyLocker.unlock(oLockObject);
						}
					});
			},

			_handleStickyOn: function(oContext) {
				var that = this,
					oAppComponent = CommonUtils.getAppComponent(this.getView());

				if (!oAppComponent.getRouterProxy().hasNavigationGuard()) {
					var sHashTracker = oAppComponent.getRouterProxy().getHash(),
						oInternalModel = this._getInternalModel();

					// Set a guard in the RouterProxy
					// A timeout is necessary, as with deferred creation the hashChanger is not updated yet with
					// the new hash, and the guard cannot be found in the managed history of the router proxy
					setTimeout(function() {
						oAppComponent.getRouterProxy().setNavigationGuard();
					}, 0);

					// Setting back navigation on shell service, to get the dicard message box in case of sticky
					oAppComponent.getShellServices().setBackNavigation(that._onBackNavigationInSession.bind(that));

					this.fnDirtyStateProvider = function(oNavigationContext) {
						var sTargetHash = oNavigationContext.innerAppRoute,
							oRouterProxy = oAppComponent.getRouterProxy(),
							bDirty,
							bSessionON = oInternalModel.getProperty("/sessionOn");

						if (!bSessionON) {
							// If the sticky session was terminated before hand.
							// Eexample in case of navigating away from application using IBN.
							return;
						}

						if (!oRouterProxy.isNavigationFinalized()) {
							// If navigation is currently happening in RouterProxy, it's a transient state
							// (not dirty)
							bDirty = false;
							sHashTracker = sTargetHash;
						} else if (sHashTracker === sTargetHash) {
							// the hash didn't change so either the user attempts to refresh or to leave the app
							bDirty = true;
						} else if (oRouterProxy.checkHashWithGuard(sTargetHash) || oRouterProxy.isGuardCrossAllowedByUser()) {
							// the user attempts to navigate within the root object
							// or crossing the guard has already been allowed by the RouterProxy
							sHashTracker = sTargetHash;
							bDirty = false;
						} else {
							// the user attempts to navigate within the app, for example back to the list report
							bDirty = true;
						}

						if (bDirty) {
							// the FLP doesn't call the dirty state provider anymore once it's dirty, as they can't
							// change this due to compatibility reasons we set it back to not-dirty
							setTimeout(function() {
								oAppComponent.getShellServices().setDirtyFlag(false);
							}, 0);
						}

						return bDirty;
					};

					oAppComponent.getShellServices().registerDirtyStateProvider(this.fnDirtyStateProvider);

					var i18nModel = this.getView().getModel("sap.fe.i18n");

					this.fnHandleSessionTimeout = function() {
						// remove transient messages since we will showing our own message
						that._getMessageHandler().removeTransitionMessages();

						var oDialog = new Dialog({
							title: "{sap.fe.i18n>C_EDITFLOW_OBJECT_PAGE_SESSION_EXPIRED_DIALOG_TITLE}",
							state: "Warning",
							content: new Text({ text: "{sap.fe.i18n>C_EDITFLOW_OBJECT_PAGE_SESSION_EXPIRED_DIALOG_MESSAGE}" }),
							beginButton: new Button({
								text: "{sap.fe.i18n>C_COMMON_DIALOG_OK}",
								type: "Emphasized",
								press: function() {
									// remove sticky handling after navigation since session has already been terminated
									that._handleStickyOff();
									that._getRoutingListener().navigateBackFromContext(oContext);
								}
							}),
							afterClose: function() {
								oDialog.destroy();
							}
						});
						oDialog.addStyleClass("sapUiContentPadding");
						oDialog.setModel(i18nModel, "sap.fe.i18n");
						that.getView().addDependent(oDialog);
						oDialog.open();
					};
					// handle session timeout
					this.getView()
						.getModel()
						.attachSessionTimeout(this.fnHandleSessionTimeout);

					this._fnStickyDiscardAfterNavigation = function() {
						var sCurrentHash = oAppComponent.getRouterProxy().getHash();
						// either current hash is empty so the user left the app or he navigated away from the object
						if (!sCurrentHash || !oAppComponent.getRouterProxy().checkHashWithGuard(sCurrentHash)) {
							that._discardStickySession(oContext);
						}
					};
					oAppComponent.getRoutingService().attachRouteMatched(this._fnStickyDiscardAfterNavigation);
				}
			},

			_handleStickyOff: function() {
				var oAppComponent = CommonUtils.getAppComponent(this.getView());

				if (oAppComponent.getRouterProxy) {
					// If we have exited from the app, CommonUtils.getAppComponent doesn't return a
					// sap.fe.core.AppComponent, hence the 'if' above
					oAppComponent.getRouterProxy().discardNavigationGuard();
				}

				if (this.fnDirtyStateProvider) {
					oAppComponent.getShellServices().deregisterDirtyStateProvider(this.fnDirtyStateProvider);
					this.fnDirtyStateProvider = null;
				}

				if (this.getView().getModel() && this.fnHandleSessionTimeout) {
					this.getView()
						.getModel()
						.detachSessionTimeout(this.fnHandleSessionTimeout);
				}

				oAppComponent.getRoutingService().detachRouteMatched(this._fnStickyDiscardAfterNavigation);
				this._fnStickyDiscardAfterNavigation = null;

				this._setEditMode(EditMode.Display, false);

				if (oAppComponent) {
					// If we have exited from the app, CommonUtils.getAppComponent doesn't return a
					// sap.fe.core.AppComponent, hence the 'if' above
					oAppComponent.getShellServices().setBackNavigation();
				}
			},

			_handleNewContext: function(oContext, bEditable, bRecreateContext, bDraftNavigation) {
				EditState.setEditStateDirty();

				return this._getRoutingListener().navigateToContext(oContext, {
					checkNoHashChange: true,
					editable: bEditable,
					bPersistOPScroll: true,
					bRecreateContext: bRecreateContext,
					bDraftNavigation: bDraftNavigation,
					showPlaceholder: false
				});
			},

			/**
			 * Checks if there are validation (parse) errors for controls bound to a given context
			 *
			 * @function
			 * @name _checkForValidationErrors
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {sap.ui.model.odata.v4.Context} Context that should be checked
			 * @returns {Promise} Promise resolves if there are no validation errors, and rejects if there are validation errors
			 */

			_checkForValidationErrors: function(oContext) {
				var that = this;
				return this._syncTask().then(function() {
					var sViewId = that.base.getView().getId();
					var aMessages = sap.ui
							.getCore()
							.getMessageManager()
							.getMessageModel()
							.getData(),
						oControl,
						oMessage;

					if (!aMessages.length) {
						return Promise.resolve("No validation errors found");
					}

					for (var i = 0; i < aMessages.length; i++) {
						oMessage = aMessages[i];
						if (oMessage.validation) {
							oControl = sap.ui.getCore().byId(oMessage.getControlId());
							while (oControl) {
								if (oControl.getId() === sViewId) {
									return Promise.reject("validation errors exist");
								}
								oControl = oControl.getParent();
							}
						}
					}
				});
			},

			/**
			 * @description Method to display a 'discard' popover when exiting a sticky session.
			 *
			 * @function
			 * @name _onBackNavigationInSession
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 */
			_onBackNavigationInSession: function() {
				var that = this,
					oView = that.getView(),
					oAppComponent = CommonUtils.getAppComponent(oView),
					oRouterProxy = oAppComponent.getRouterProxy();

				if (oRouterProxy.checkIfBackIsOutOfGuard()) {
					var oBindingContext = oView && oView.getBindingContext();

					CommonUtils.processDataLossConfirmation(
						function() {
							that._discardStickySession(oBindingContext);
							history.back();
						},
						oView,
						that._getProgrammingModel(oBindingContext)
					);

					return;
				}
				history.back();
			},

			_discardStickySession: function(oContext) {
				sticky.discardDocument(oContext);
				this._handleStickyOff();
			},

			/**
			 * @function
			 * @name _refreshListIfRequired
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {object} oResponse The response of the bound action and the names of the key fields
			 * @param {sap.ui.model.odata.v4.Context} oContext The bound context on which the action was executed
			 * @returns {Promise} Always resolves to param oResponse
			 */
			_refreshListIfRequired: function(oResponse, oContext) {
				if (!oContext || !oResponse || !oResponse.oData) {
					return Promise.resolve();
				}
				var oBinding = oContext.getBinding();
				// refresh only lists
				if (oBinding && oBinding.isA("sap.ui.model.odata.v4.ODataListBinding")) {
					var that = this,
						oContextData = oResponse.oData,
						aKeys = oResponse.keys,
						oCurrentData = oContext.getObject(),
						bReturnedContextIsSame = true;
					// ensure context is in the response
					if (Object.keys(oContextData).length) {
						// check if context in response is different than the bound context
						bReturnedContextIsSame = aKeys.every(function(sKey) {
							return oCurrentData[sKey] === oContextData[sKey];
						});
						if (!bReturnedContextIsSame) {
							return new Promise(function(resolve, reject) {
								if (oBinding.isRoot()) {
									oBinding.attachEventOnce("dataReceived", function() {
										resolve();
									});
									oBinding.refresh();
								} else {
									var oAppComponent = CommonUtils.getAppComponent(that.getView());
									oAppComponent
										.getSideEffectsService()
										.requestSideEffects([{ $NavigationPropertyPath: oBinding.getPath() }], oBinding.getContext())
										.then(
											function() {
												resolve();
											},
											function() {
												Log.error("Error while refreshing the table");
												resolve();
											}
										)
										.catch(function(e) {
											Log.error("Error while refreshing the table", e);
										});
								}
							});
						}
					}
				}
				// resolve with oResponse to not disturb the promise chain afterwards
				return Promise.resolve();
			},

			_fetchSemanticKeyValues: function(oContext) {
				var oMetaModel = oContext.getModel().getMetaModel(),
					sEntitySetName = oMetaModel.getMetaContext(oContext.getPath()).getObject("@sapui.name"),
					aSemanticKeys = SemanticKeyHelper.getSemanticKeys(oMetaModel, sEntitySetName);

				if (aSemanticKeys && aSemanticKeys.length) {
					var aRequestPromises = aSemanticKeys.map(function(oKey) {
						return oContext.requestObject(oKey.$PropertyPath);
					});

					return Promise.all(aRequestPromises);
				} else {
					return Promise.resolve();
				}
			},

			// Ugly Workaround to overcome mdc field issue, we remove the binding context before
			// switching to display mode to avoid the field reads additional values for non existing
			// drafts or sticky sessions in the backend
			_removeContextsFromPages: function() {
				var aPages = [];
				var oAppComponent = CommonUtils.getAppComponent(this.getView());
				if (oAppComponent._isFclEnabled()) {
					aPages = aPages.concat(oAppComponent.getRootContainer().getMidColumnPages() || []);
					aPages = aPages.concat(oAppComponent.getRootContainer().getEndColumnPages() || []);
				} else {
					aPages = oAppComponent.getRootContainer().getPages() || [];
				}

				aPages.forEach(function(oPage) {
					if (oPage.isA("sap.ui.core.ComponentContainer")) {
						oPage = oPage.getComponentInstance(); // The binding context is set at the component level, not the component container
					}

					if (oPage.getBindingContext()) {
						oPage.setBindingContext(null);
					}
				});
			}
		});

		return Extension;
	}
);
