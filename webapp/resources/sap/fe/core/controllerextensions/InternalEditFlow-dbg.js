/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/ui/core/mvc/ControllerExtension",
		"sap/ui/core/mvc/OverrideExecution",
		"sap/fe/core/actions/messageHandling",
		"sap/fe/core/TransactionHelper",
		"sap/base/Log",
		"sap/fe/core/CommonUtils",
		"sap/fe/core/BusyLocker",
		"sap/fe/core/library",
		"sap/fe/core/helpers/EditState"
	],
	function(
		ControllerExtension,
		OverrideExecution,
		messageHandling,
		TransactionHelper,
		Log,
		CommonUtils,
		BusyLocker,
		FELibrary,
		EditState
	) {
		"use strict";

		var ProgrammingModel = FELibrary.ProgrammingModel,
			DraftStatus = FELibrary.DraftStatus,
			EditMode = FELibrary.EditMode;

		var Extension = ControllerExtension.extend("sap.fe.core.controllerextensions.InternalEditFlow", {
			metadata: {
				methods: {
					createMultipleDocuments: { "public": true, "final": true },
					deleteMultipleDocuments: { "public": true, "final": true },
					computeEditMode: { "public": true, "final": true },
					setEditMode: { "public": true, "final": true },
					setDraftStatus: { "public": true, "final": true },
					getRoutingListener: { "public": true, "final": true },
					getGlobalUIModel: { "public": true, "final": true },
					syncTask: { "public": true, "final": true },
					getProgrammingModel: { "public": true, "final": true },
					deleteDocumentTransaction: { "public": true, "final": true },
					handleCreateEvents: { "public": true, "final": true },
					getTransactionHelper: { "public": true, "final": true },
					getInternalModel: { "public": true, "final": true },
					createActionPromise: { "public": true, "final": true },
					getCurrentActionPromise: { "public": true, "final": true },
					deleteCurrentActionPromise: { "public": true, "final": true },
					getActionResponseDataAndKeys: { "public": true, "final": true },
					setCreationMode: { "public": false, "final": false, "overrideExecution": OverrideExecution.After },
					getMessageHandler: { "public": true, "final": true }
				}
			},

			/**
			 * Override to set the creation mode.
			 *
			 * @memberof sap.fe.core.controllerextensions.InternalEditFlow
			 * @alias sap.fe.core.controllerextensions.InternalEditFlow#setCreationMode
			 * @since 1.90.0
			 */
			setCreationMode: function() {
				// to be overridden
			},

			createMultipleDocuments: function(oListBinding, aData, bCreateAtEnd, bFromCopyPaste) {
				var that = this,
					transactionHelper = this.getTransactionHelper(),
					oLockObject = this.getGlobalUIModel(),
					oResourceBundle = that.getView().getController().oResourceBundle;

				BusyLocker.lock(oLockObject);
				return this.syncTask()
					.then(function() {
						var oModel = oListBinding.getModel(),
							oMetaModel = oModel.getMetaModel(),
							sMetaPath;

						if (oListBinding.getContext()) {
							sMetaPath = oMetaModel.getMetaPath(oListBinding.getContext().getPath() + "/" + oListBinding.getPath());
						} else {
							sMetaPath = oMetaModel.getMetaPath(oListBinding.getPath());
						}

						that.handleCreateEvents(oListBinding);

						// Iterate on all items and store the corresponding creation promise
						var aCreationPromises = aData.map(function(mPropertyValues) {
							var mParameters = { data: {} };

							mParameters.keepTransientContextOnFailed = false; // currently not fully supported
							mParameters.busyMode = "None";
							mParameters.creationMode = "CreationRow";
							mParameters.parentControl = that.getView();
							mParameters.createAtEnd = bCreateAtEnd;

							// Remove navigation properties as we don't support deep create
							for (var sPropertyPath in mPropertyValues) {
								var oProperty = oMetaModel.getObject(sMetaPath + "/" + sPropertyPath);
								if (oProperty && oProperty.$kind !== "NavigationProperty" && mPropertyValues[sPropertyPath]) {
									mParameters.data[sPropertyPath] = mPropertyValues[sPropertyPath];
								}
							}

							return transactionHelper.createDocument(
								oListBinding,
								mParameters,
								oResourceBundle,
								that.getMessageHandler(),
								bFromCopyPaste
							);
						});

						return Promise.all(aCreationPromises);
					})
					.then(function(aContexts) {
						// transient contexts are reliably removed once oNewContext.created() is resolved
						return Promise.all(
							aContexts.map(function(oNewContext) {
								return oNewContext.created();
							})
						);
					})
					.then(function() {
						var oBindingContext = that.getView().getBindingContext();

						// if there are transient contexts, we must avoid requesting side effects
						// this is avoid a potential list refresh, there could be a side effect that refreshes the list binding
						// if list binding is refreshed, transient contexts might be lost
						if (!CommonUtils.hasTransientContext(oListBinding)) {
							that._oAppComponent
								.getSideEffectsService()
								.requestSideEffectsForNavigationProperty(oListBinding.getPath(), oBindingContext);
						}
					})
					.catch(function(err) {
						Log.error("Error while creating multiple documents.");
						return Promise.reject(err);
					})
					.finally(function() {
						BusyLocker.unlock(oLockObject);
					});
			},

			deleteMultipleDocuments: function(aContexts, mParameters) {
				var that = this,
					oRoutingListener = this.getRoutingListener(),
					oLockObject = this.getGlobalUIModel();
				var oTable = that.getView().byId(mParameters.controlId);
				if (!oTable || !oTable.isA("sap.ui.mdc.Table")) {
					throw new Error("parameter controlId missing or incorrect");
				}
				var oListBinding = oTable.getRowBinding();
				mParameters.bFindActiveContexts = true;
				BusyLocker.lock(oLockObject);
				return this.deleteDocumentTransaction(aContexts, mParameters)
					.then(function() {
						var oResult;

						// Multiple object deletion is triggered from a list
						// First clear the selection in the table as it's not valid any more
						oTable.clearSelection();

						// Then refresh the list-binding (LR), or require side-effects (OP)
						var oBindingContext = that.getView().getBindingContext();
						if (oListBinding.isRoot()) {
							// keep promise chain pending until refresh of listbinding is completed
							oResult = new Promise(function(resolve) {
								oListBinding.attachEventOnce("dataReceived", function() {
									resolve();
								});
							});
							oListBinding.refresh();
						} else if (oBindingContext) {
							// if there are transient contexts, we must avoid requesting side effects
							// this is avoid a potential list refresh, there could be a side effect that refreshes the list binding
							// if list binding is refreshed, transient contexts might be lost
							if (!CommonUtils.hasTransientContext(oListBinding)) {
								that._oAppComponent
									.getSideEffectsService()
									.requestSideEffectsForNavigationProperty(oListBinding.getPath(), oBindingContext);
							}
						}

						// deleting at least one object should also set the UI to dirty
						EditState.setEditStateDirty();

						// Finally, check if the current state can be impacted by the deletion, i.e. if there's
						// an OP displaying a deleted object. If yes navigate back to dismiss the OP
						for (var index = 0; index < aContexts.length; index++) {
							if (oRoutingListener.isCurrentStateImpactedBy(aContexts[index])) {
								oRoutingListener.navigateBackFromContext(aContexts[index]);
								break;
							}
						}

						return oResult;
					})
					.finally(function() {
						BusyLocker.unlock(oLockObject);
					});
			},

			/**
			 * Decides if a document is to be shown in display or edit mode.
			 *
			 * @function
			 * @name _computeEditMode
			 * @memberof sap.fe.core.controllerextensions.InternalEditFlow
			 * @param {sap.ui.model.odata.v4.Context} oContext The context to be displayed or edited
			 * @returns {Promise} Promise resolves once the edit mode is computed
			 */

			computeEditMode: function(oContext) {
				var that = this;

				return Promise.resolve(
					(function() {
						var sProgrammingModel = that.getProgrammingModel(oContext);

						if (sProgrammingModel === ProgrammingModel.Draft) {
							that.setDraftStatus(DraftStatus.Clear);

							return oContext
								.requestObject("IsActiveEntity")
								.then(function(bIsActiveEntity) {
									if (bIsActiveEntity === false) {
										// in case the document is draft set it in edit mode
										that.setEditMode(EditMode.Editable);
										return oContext.requestObject("HasActiveEntity").then(function(bHasActiveEntity) {
											that.setEditMode(undefined, !bHasActiveEntity);
										});
									} else {
										// active document, stay on display mode
										that.setEditMode(EditMode.Display, false);
									}
								})
								.catch(function(oError) {
									Log.error("Error while determining the editMode for draft", oError);
									throw oError;
								});
						}
					})()
				);
			},

			/**
			 * Sets the edit mode.
			 *
			 * @param {string} sEditMode
			 * @param {boolean} bCreationMode CreateMode flag to identify the creation mode
			 */
			setEditMode: function(sEditMode, bCreationMode) {
				// at this point of time it's not meant to release the edit flow for freestyle usage therefore we can
				// rely on the global UI model to exist
				var oGlobalModel = this.getGlobalUIModel();

				if (sEditMode) {
					oGlobalModel.setProperty("/editMode", sEditMode, undefined, true);
					oGlobalModel.setProperty("/isEditable", sEditMode === "Editable", undefined, true);
				}

				if (bCreationMode !== undefined) {
					// Since setCreationMode is public in EditFlow and can be overriden, make sure to call it via the controller
					// to ensure any overrides are taken into account
					this.setCreationMode(bCreationMode);
				}
			},

			setDraftStatus: function(sDraftState) {
				// at this point of time it's not meant to release the edit flow for freestyle usage therefore we can
				// rely on the global UI model to exist
				this.base
					.getView()
					.getModel("ui")
					.setProperty("/draftStatus", sDraftState, undefined, true);
			},

			getRoutingListener: function() {
				// at this point of time it's not meant to release the edit flow for FPM custom pages and the routing
				// listener is not yet public therefore keep the logic here for now

				if (this.base._routing) {
					return this.base._routing;
				} else {
					throw new Error("Edit Flow works only with a given routing listener");
				}
			},

			getGlobalUIModel: function() {
				// at this point of time it's not meant to release the edit flow for freestyle usage therefore we can
				// rely on the global UI model to exist
				return this.base.getView().getModel("ui");
			},

			/**
			 * Performs a task in sync with other tasks created via this function.
			 * Returns the promise chain of the task.
			 *
			 * @function
			 * @name sap.fe.core.controllerextensions.EditFlow#syncTask
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @static
			 * @param {Promise|Function} [vTask] Optional, a promise or function to be executed synchronously
			 * @returns {Promise} Promise resolves once the task is completed
			 *
			 * @ui5-restricted
			 * @final
			 */
			syncTask: function(vTask) {
				var fnNewTask;
				if (vTask instanceof Promise) {
					fnNewTask = function() {
						return vTask;
					};
				} else if (typeof vTask === "function") {
					fnNewTask = vTask;
				}

				this._pTasks = this._pTasks || Promise.resolve();
				if (!!fnNewTask) {
					this._pTasks = this._pTasks.then(fnNewTask).catch(function() {
						return Promise.resolve();
					});
				}

				return this._pTasks;
			},

			getProgrammingModel: function(oContext) {
				return this.getTransactionHelper().getProgrammingModel(oContext);
			},

			deleteDocumentTransaction: function(oContext, mParameters) {
				var that = this,
					oResourceBundle = this.getView().getController().oResourceBundle,
					transactionHelper = this.getTransactionHelper();

				mParameters = mParameters || {};

				// TODO: this setting and removing of contexts shouldn't be in the transaction helper at all
				// for the time being I kept it and provide the internal model context to not break something
				mParameters.internalModelContext = mParameters.controlId
					? sap.ui
							.getCore()
							.byId(mParameters.controlId)
							.getBindingContext("internal")
					: null;

				return this.syncTask()
					.then(
						transactionHelper.deleteDocument.bind(
							transactionHelper,
							oContext,
							mParameters,
							oResourceBundle,
							that.getMessageHandler()
						)
					)
					.then(function() {
						that.getInternalModel().setProperty("/sessionOn", false);
					});
			},

			/**
			 * Handles the create event: shows messages and in case of a draft, updates the draft indicator.
			 *
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {object} oBinding OData list binding object
			 */
			handleCreateEvents: function(oBinding) {
				var that = this,
					sProgrammingModel,
					transactionHelper = that.getTransactionHelper();

				that.setDraftStatus(DraftStatus.Clear);

				oBinding = (oBinding.getBinding && oBinding.getBinding()) || oBinding;
				sProgrammingModel = that.getProgrammingModel(oBinding);

				oBinding.attachEvent("createSent", function() {
					transactionHelper.handleDocumentModifications();
					if (sProgrammingModel === ProgrammingModel.Draft) {
						that.setDraftStatus(DraftStatus.Saving);
					}
				});
				oBinding.attachEvent("createCompleted", function(oEvent) {
					var bSuccess = oEvent.getParameter("success");
					if (sProgrammingModel === ProgrammingModel.Draft) {
						that.setDraftStatus(bSuccess ? DraftStatus.Saved : DraftStatus.Clear);
					}
					that.getMessageHandler().showMessageDialog();
				});
			},

			getTransactionHelper: function() {
				if (!this._oTransactionHelper) {
					// currently also the transaction helper is locking therefore passing lock object
					this._oTransactionHelper = new TransactionHelper(this._oAppComponent, this.getGlobalUIModel());
				}

				return this._oTransactionHelper;
			},

			getInternalModel: function() {
				return this.base.getView().getModel("internal");
			},

			/**
			 * Creates a new promise to wait for an action to be executed
			 * @function
			 * @name _createActionPromise
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 *
			 * @returns {Function} The resolver function which can be used to externally resolve the promise
			 */

			createActionPromise: function(sActionName, sControlId) {
				var that = this,
					fResolver,
					fRejector;
				this.oActionPromise = new Promise(function(resolve, reject) {
					fResolver = resolve;
					fRejector = reject;
				}).then(function(oResponse) {
					return Object.assign({ controlId: sControlId }, that.getActionResponseDataAndKeys(sActionName, oResponse));
				});
				return { fResolver: fResolver, fRejector: fRejector };
			},

			/**
			 * Gets the getCurrentActionPromise object.
			 *
			 * @function
			 * @name _getCurrentActionPromise
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 *
			 * @returns {Promise} Returns the promise
			 */
			getCurrentActionPromise: function() {
				return this.oActionPromise;
			},

			deleteCurrentActionPromise: function() {
				this.oActionPromise = null;
			},

			/**
			 * @function
			 * @name getActionResponseDataAndKeys
			 * @memberof sap.fe.core.controllerextensions.EditFlow
			 * @param {string} sActionName The name of the action that is executed
			 * @param {object} oResponse The bound action's response data or response context
			 * @returns {object} Object with data and names of the key fields of the response
			 */
			getActionResponseDataAndKeys: function(sActionName, oResponse) {
				if (Array.isArray(oResponse)) {
					if (oResponse.length === 1) {
						oResponse = oResponse[0];
					} else {
						return null;
					}
				}
				if (!oResponse) {
					return null;
				}
				var oView = this.getView(),
					oMetaModel = oView
						.getModel()
						.getMetaModel()
						.getData(),
					sActionReturnType =
						oMetaModel && oMetaModel[sActionName] && oMetaModel[sActionName][0] && oMetaModel[sActionName][0].$ReturnType
							? oMetaModel[sActionName][0].$ReturnType.$Type
							: null,
					aKey = sActionReturnType && oMetaModel[sActionReturnType] ? oMetaModel[sActionReturnType].$Key : null;

				return {
					oData: oResponse.getObject(),
					keys: aKey
				};
			},

			getMessageHandler: function() {
				// at this point of time it's not meant to release the edit flow for FPM custom pages therefore keep
				// the logic here for now

				if (this.base.messageHandler) {
					return this.base.messageHandler;
				} else {
					throw new Error("Edit Flow works only with a given message handler");
				}
			},
			override: {
				onInit: function() {
					this._oAppComponent = this.base.getAppComponent();
				}
			}
		});

		return Extension;
	}
);
