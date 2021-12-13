/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/ui/base/Object",
		"sap/fe/core/AnnotationHelper",
		"sap/fe/core/actions/draft",
		"sap/fe/core/actions/sticky",
		"sap/fe/core/actions/operations",
		"sap/ui/model/json/JSONModel",
		"sap/m/Popover",
		"sap/m/VBox",
		"sap/m/CheckBox",
		"sap/m/Text",
		"sap/m/Button",
		"sap/m/MessageToast",
		"sap/m/Dialog",
		"sap/ui/model/BindingMode",
		"sap/base/Log",
		"sap/ui/core/message/Message",
		"sap/fe/core/CommonUtils",
		"sap/fe/core/BusyLocker",
		"sap/ui/core/util/XMLPreprocessor",
		"sap/ui/core/XMLTemplateProcessor",
		"sap/ui/core/Fragment",
		"sap/m/MessageBox",
		"sap/fe/core/helpers/ModelHelper",
		"sap/fe/core/library",
		"sap/ui/core/ValueState",
		"sap/fe/core/actions/messageHandling"
	],
	function(
		BaseObject,
		AnnotationHelper,
		draft,
		sticky,
		operations,
		JSONModel,
		Popover,
		VBox,
		CheckBox,
		Text,
		Button,
		MessageToast,
		Dialog,
		BindingMode,
		Log,
		Message,
		CommonUtils,
		BusyLocker,
		XMLPreprocessor,
		XMLTemplateProcessor,
		Fragment,
		MessageBox,
		ModelHelper,
		FELibrary,
		ValueState,
		messageHandling
	) {
		"use strict";
		var CreationMode = FELibrary.CreationMode,
			ProgrammingModel = FELibrary.ProgrammingModel;
		/* Make sure that the mParameters is not the oEvent */
		function getParameters(mParameters) {
			if (mParameters && mParameters.getMetadata && mParameters.getMetadata().getName() === "sap.ui.base.Event") {
				mParameters = {};
			}
			return mParameters || {};
		}
		return BaseObject.extend("sap.fe.core.TransactionHelper", {
			constructor: function(oAppComponent, oLockObject) {
				this._oAppComponent = oAppComponent;
				this.oLockObject = oLockObject;
			},
			getProgrammingModel: function(oContext) {
				if (!this.sProgrammingModel && oContext) {
					if (ModelHelper.isDraftSupported(oContext.getModel().getMetaModel(), oContext.getPath())) {
						this.sProgrammingModel = ProgrammingModel.Draft;
					} else if (ModelHelper.isStickySessionSupported(oContext.getModel().getMetaModel())) {
						this.sProgrammingModel = ProgrammingModel.Sticky;
					} else {
						// as the transaction helper is a singleton we don't store the non draft as the user could
						// start with a non draft child page and navigates back to a draft enabled one
						return ProgrammingModel.NonDraft;
					}
				}
				return this.sProgrammingModel;
			},
			/**
			 * Creates a new document.
			 *
			 * @memberof sap.fe.core.TransactionHelper
			 * @static
			 * @param {sap.ui.model.odata.v4.ODataListBinding} oMainListBinding OData v4 ListBinding object
			 * @param {object} [mParameters] Optional, can contain the following attributes:
			 * @param {boolean} [mParameters.refreshList] If the list shall be refreshed immediately after creating the instance
			 * @param {map} [mParameters.data] A map of data that should be sent within the POST
			 * @param {string} [mParameters.busyMode] Global (default), Local, None TODO: to be refactored
			 * @param {map} [mParameters.keepTransientContextOnFailed] If set, the context stays in the list if the POST failed and POST will be repeated with the next change
			 * @param oResourceBundle
			 * @param messageHandler
			 * @param bFromCopyPaste
			 * @returns {Promise} Promise resolves with new binding context
			 * @ui5-restricted
			 * @final
			 */
			createDocument: function(oMainListBinding, mParameters, oResourceBundle, messageHandler, bFromCopyPaste) {
				var oNewDocumentContext,
					that = this,
					bSkipRefresh,
					oModel = oMainListBinding.getModel(),
					oMetaModel = oModel.getMetaModel(),
					sMetaPath = oMetaModel.getMetaPath(oMainListBinding.getHeaderContext().getPath()),
					sCreateHash = this._getAppComponent()
						.getRouterProxy()
						.getHash(),
					oComponentData = this._getAppComponent().getComponentData(),
					oStartupParameters = (oComponentData && oComponentData.startupParameters) || {},
					sNewAction = !oMainListBinding.isRelative()
						? this._getNewAction(oStartupParameters, sCreateHash, oMetaModel, sMetaPath)
						: undefined,
					oCreationPromise,
					mBindingParameters = { "$$patchWithoutSideEffects": true },
					sMessagesPath = oMetaModel.getObject(sMetaPath + "/@com.sap.vocabularies.Common.v1.Messages/$Path"),
					sProgrammingModel,
					sBusyPath = "/busy",
					sFunctionName =
						oMetaModel.getObject(sMetaPath + "@com.sap.vocabularies.Common.v1.DefaultValuesFunction") ||
						oMetaModel.getObject(
							ModelHelper.getTargetEntitySet(oMetaModel.getContext(sMetaPath)) +
								"@com.sap.vocabularies.Common.v1.DefaultValuesFunction"
						);

				if (sMessagesPath) {
					mBindingParameters["$select"] = sMessagesPath;
				}
				mParameters = getParameters(mParameters);
				if (!oMainListBinding) {
					return Promise.reject("Binding required for new document creation");
				}
				sProgrammingModel = this.getProgrammingModel(oMainListBinding);
				if (sProgrammingModel !== ProgrammingModel.Draft && sProgrammingModel !== ProgrammingModel.Sticky) {
					return Promise.reject("Create document only allowed for draft or sticky session supported services");
				}
				if (mParameters.busyMode === "Local") {
					// in case of local busy mode we use the list binding name
					// there's no APY yet so we have to use the .sId TODO provide a public method?
					sBusyPath = "/busyLocal/" + oMainListBinding.sId;
				}
				BusyLocker.lock(this.oLockObject, sBusyPath);
				bSkipRefresh = !mParameters.refreshList;
				var oResourceBundleCore = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");
				if (sNewAction) {
					oCreationPromise = this.callAction(
						sNewAction,
						{
							contexts: oMainListBinding.getHeaderContext(),
							showActionParameterDialog: true,
							label: oResourceBundleCore.getText("C_TRANSACTION_HELPER_SAPFE_ACTION_CREATE"),
							bindingParameters: mBindingParameters,
							parentControl: mParameters.parentControl,
							bIsCreateAction: true
						},
						null,
						messageHandler
					);
				} else {
					var bIsNewPageCreation =
						mParameters.creationMode !== CreationMode.CreationRow && mParameters.creationMode !== CreationMode.Inline;
					var aNonComputedVisibleKeyFields = bIsNewPageCreation
						? CommonUtils.getNonComputedVisibleFields(oMetaModel, sMetaPath)
						: [];
					sFunctionName = bFromCopyPaste ? null : sFunctionName;
					oCreationPromise = operations
						.callFunctionImport(sFunctionName, oModel)
						.then(function(oContext) {
							if (oContext) {
								return oContext.getObject();
							} else {
								return undefined;
							}
						})
						.catch(function(oError) {
							Log.error("Error while calling function Import " + sFunctionName, oError);
							throw oError;
						})
						.then(function(oData) {
							mParameters.data = oData ? Object.assign({}, oData, mParameters.data) : mParameters.data;
							if (mParameters.data) {
								delete mParameters.data["@odata.context"];
							}
							if (aNonComputedVisibleKeyFields.length > 0) {
								var oTransientListBinding = oModel.bindList(
									oMainListBinding.getPath(),
									oMainListBinding.getContext(),
									[],
									[],
									{
										$$updateGroupId: "submitLater"
									}
								);
								oTransientListBinding.refreshInternal = function() {};
								oNewDocumentContext = oTransientListBinding.create(mParameters.data, bSkipRefresh);
								return that._launchDialogWithKeyFields(
									oMainListBinding,
									oTransientListBinding,
									oNewDocumentContext,
									aNonComputedVisibleKeyFields,
									oModel,
									mParameters,
									messageHandler,
									sFunctionName
								);
							} else {
								oNewDocumentContext = oMainListBinding.create(mParameters.data, bSkipRefresh, mParameters.createAtEnd);
								return that.onAfterCreateCompletion(
									oMainListBinding,
									oNewDocumentContext,
									mParameters,
									oResourceBundleCore
								);
							}
						})
						.catch(function(oError) {
							Log.error("Error while creating the new document", oError);
							throw oError;
						});
				}
				return oCreationPromise
					.then(function(oResult) {
						if (!oMainListBinding.isRelative()) {
							// the create mode shall currently only be set on creating a root document
							that._bCreateMode = true;
						}
						oNewDocumentContext = oNewDocumentContext || (oResult && oResult.response);
						// TODO: where does this one coming from???
						if (oResult && oResult.bConsiderDocumentModified) {
							that.handleDocumentModifications();
						}
						return messageHandler.showMessageDialog().then(function() {
							return oNewDocumentContext;
						});
					})
					.catch(function(oError) {
						return messageHandler.showMessageDialog().then(function() {
							// for instance, on cancel of create dialog, the promise is rejected
							// a return here would restore the promise chain and result in errors while routing
							// solution -  reject here as well
							if (oError && oError.bDeleteTransientContext && oNewDocumentContext.isTransient()) {
								// This is a workaround suggested by model as Context.delete results in an error
								// TODO: remove the $direct once model resolves this issue
								// this line shows the expected console error Uncaught (in promise) Error: Request canceled: POST Travel; group: submitLater
								oNewDocumentContext.delete("$direct");
							}
							return Promise.reject(oError);
						});
					})
					.finally(function() {
						BusyLocker.unlock(that.oLockObject, sBusyPath);
					});
			},
			/**
			 * Find the active contexts of the documents, only for the draft roots.
			 *
			 * @memberof sap.fe.core.TransactionHelper
			 * @static
			 * @param {sap.ui.model.odata.v4.Context[]} aContexts Contexts Either one context or an array with contexts to be deleted
			 * @param bFindActiveContexts
			 * @returns {Array} Array of the active contexts
			 */
			findActiveDraftRootContexts: function(aContexts, bFindActiveContexts) {
				if (!bFindActiveContexts) {
					return Promise.resolve();
				}
				var activeContexts = aContexts.reduce(function(aResult, oContext) {
					var oMetaModel = oContext.getModel().getMetaModel();
					var sMetaPath = oMetaModel.getMetaPath(oContext.getPath());
					if (oMetaModel.getObject(sMetaPath + "@com.sap.vocabularies.Common.v1.DraftRoot")) {
						var bIsActiveEntity = oContext.getObject().IsActiveEntity,
							bHasActiveEntity = oContext.getObject().HasActiveEntity,
							oActiveContext;
						if (!bIsActiveEntity && bHasActiveEntity) {
							oActiveContext = oContext
								.getModel()
								.bindContext(oContext.getPath() + "/SiblingEntity")
								.getBoundContext();
							aResult.push(oActiveContext);
						}
					}
					return aResult;
				}, []);
				return Promise.all(
					activeContexts.map(function(oContext) {
						return oContext.requestCanonicalPath().then(
							function() {
								return oContext;
							},
							function() {
								return;
							}
						);
					})
				);
			},
			afterDeleteProcess: function(mParameters, checkBox, aContexts, oResourceBundle) {
				var oInternalModelContext = mParameters.internalModelContext;
				if (oInternalModelContext && oInternalModelContext.getProperty("deleteEnabled") != undefined) {
					if (checkBox.isCheckBoxVisible === true && checkBox.isCheckBoxSelected === false) {
						//if unsaved objects are not deleted then we need to set the enabled to true and update the model data for next deletion
						oInternalModelContext.setProperty("deleteEnabled", true);
						var obj = Object.assign(oInternalModelContext.getObject(), {});
						obj.selectedContexts = obj.selectedContexts.filter(function(element) {
							return obj.deletableContexts.indexOf(element) === -1;
						});
						obj.deletableContexts = [];
						obj.selectedContexts = [];
						obj.numberOfSelectedContexts = obj.selectedContexts.length;
						oInternalModelContext.setProperty("", obj);
					} else {
						oInternalModelContext.setProperty("deleteEnabled", false);
						oInternalModelContext.setProperty("selectedContexts", []);
						oInternalModelContext.setProperty("numberOfSelectedContexts", 0);
					}
				}
				if (aContexts.length === 1) {
					MessageToast.show(
						CommonUtils.getTranslatedText(
							"C_TRANSACTION_HELPER_OBJECT_PAGE_DELETE_TOAST_SINGULAR",
							oResourceBundle,
							null,
							mParameters.entitySetName
						)
					);
				} else {
					MessageToast.show(
						CommonUtils.getTranslatedText(
							"C_TRANSACTION_HELPER_OBJECT_PAGE_DELETE_TOAST_PLURAL",
							oResourceBundle,
							null,
							mParameters.entitySetName
						)
					);
				}
			},
			/**
			 * Delete one or multiple document(s).
			 *
			 * @memberof sap.fe.core.TransactionHelper
			 * @static
			 * @param {sap.ui.model.odata.v4.Context} vContexts Contexts Either one context or an array with contexts to be deleted
			 * @param {object} mParameters Optional, can contain the following attributes:
			 * @param {string} mParameters.title Title of the object to be deleted
			 * @param {string} mParameters.description Description of the object to be deleted
			 * @param {string} mParameters.numberOfSelectedContexts Number of objects selected
			 * @param {boolean} mParameters.noDialog To disable the confirmation dialog
			 * @param oResourceBundle
			 * @param messageHandler
			 * @returns {Promise}
			 */
			deleteDocument: function(vContexts, mParameters, oResourceBundle, messageHandler) {
				var fnReject,
					fnResolve,
					aDeletableContexts = [],
					isCheckBoxVisible = false,
					isLockedTextVisible = false,
					cannotBeDeletedTextVisible = false,
					isCheckBoxSelected,
					bDialogConfirmed = false,
					that = this,
					oResourceBundleCore = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core"),
					aParams,
					oDeleteMessage = {
						title: oResourceBundleCore.getText("C_COMMON_OBJECT_PAGE_DELETE")
					};
				BusyLocker.lock(this.oLockObject);
				if (!Array.isArray(vContexts)) {
					vContexts = [vContexts];
				}
				Promise.resolve(this.getProgrammingModel(vContexts[0]))
					.then(function(sProgrammingModel) {
						if (mParameters) {
							if (!mParameters.numberOfSelectedContexts) {
								if (sProgrammingModel === ProgrammingModel.Draft) {
									for (var i = 0; i < vContexts.length; i++) {
										var oContextData = vContexts[i].getObject();
										if (
											oContextData.IsActiveEntity === true &&
											oContextData.HasDraftEntity === true &&
											oContextData.DraftAdministrativeData &&
											oContextData.DraftAdministrativeData.InProcessByUser &&
											!oContextData.DraftAdministrativeData.DraftIsCreatedByMe
										) {
											MessageBox.show(
												CommonUtils.getTranslatedText(
													"C_TRANSACTION_HELPER_OBJECT_PAGE_CONFIRM_DELETE_WITH_SINGLE_OBJECT_LOCKED",
													oResourceBundle
												),
												{
													title: oResourceBundleCore.getText("C_COMMON_OBJECT_PAGE_DELETE"),
													onClose: fnReject
												}
											);
											return;
										}
									}
								}
								mParameters = getParameters(mParameters);
								if (mParameters.title) {
									if (mParameters.description) {
										aParams = [mParameters.title, mParameters.description];
										oDeleteMessage.text = CommonUtils.getTranslatedText(
											"C_TRANSACTION_HELPER_OBJECT_PAGE_CONFIRM_DELETE_WITH_OBJECTINFO",
											oResourceBundle,
											aParams,
											mParameters.entitySetName
										);
									} else {
										oDeleteMessage.text = CommonUtils.getTranslatedText(
											"C_TRANSACTION_HELPER_OBJECT_PAGE_CONFIRM_DELETE_WITH_OBJECTTITLE_SINGULAR",
											oResourceBundle,
											null,
											mParameters.entitySetName
										);
									}
								} else {
									oDeleteMessage.text = CommonUtils.getTranslatedText(
										"C_TRANSACTION_HELPER_OBJECT_PAGE_CONFIRM_DELETE_WITH_OBJECTTITLE_SINGULAR",
										oResourceBundle
									);
								}
								aDeletableContexts = vContexts;
							} else {
								oDeleteMessage = {
									title: oResourceBundleCore.getText("C_COMMON_OBJECT_PAGE_DELETE")
								};
								if (
									mParameters.numberOfSelectedContexts === 1 &&
									mParameters.numberOfSelectedContexts === vContexts.length
								) {
									aDeletableContexts = vContexts;
									oDeleteMessage.text = CommonUtils.getTranslatedText(
										"C_TRANSACTION_HELPER_OBJECT_PAGE_CONFIRM_DELETE_WITH_OBJECTTITLE_SINGULAR",
										oResourceBundle,
										null,
										mParameters.entitySetName
									);
								} else if (mParameters.numberOfSelectedContexts === 1 && mParameters.unSavedContexts.length === 1) {
									//only one unsaved object
									aDeletableContexts = mParameters.unSavedContexts;
									var draftAdminData = aDeletableContexts[0].getObject()["DraftAdministrativeData"];
									var sLastChangedByUser = "";
									if (draftAdminData) {
										sLastChangedByUser =
											draftAdminData["LastChangedByUserDescription"] || draftAdminData["LastChangedByUser"] || "";
									}
									aParams = [sLastChangedByUser];
									oDeleteMessage.text = CommonUtils.getTranslatedText(
										"C_TRANSACTION_HELPER_OBJECT_PAGE_CONFIRM_DELETE_WITH_UNSAVED_CHANGES",
										oResourceBundle,
										aParams
									);
								} else if (mParameters.numberOfSelectedContexts === mParameters.unSavedContexts.length) {
									//only multiple unsaved objects
									aDeletableContexts = mParameters.unSavedContexts;
									oDeleteMessage.text = CommonUtils.getTranslatedText(
										"C_TRANSACTION_HELPER_OBJECT_PAGE_CONFIRM_DELETE_WITH_UNSAVED_CHANGES_MULTIPLE_OBJECTS",
										oResourceBundle
									);
								} else if (
									mParameters.numberOfSelectedContexts ===
									vContexts.concat(mParameters.unSavedContexts.concat(mParameters.lockedContexts)).length
								) {
									//only unsaved, locked ,deletable objects but not non-deletable objects
									aDeletableContexts = vContexts.concat(mParameters.unSavedContexts);
									oDeleteMessage.text =
										aDeletableContexts.length === 1
											? CommonUtils.getTranslatedText(
													"C_TRANSACTION_HELPER_OBJECT_PAGE_CONFIRM_DELETE_WITH_OBJECTTITLE_SINGULAR",
													oResourceBundle,
													null,
													mParameters.entitySetName
											  )
											: CommonUtils.getTranslatedText(
													"C_TRANSACTION_HELPER_OBJECT_PAGE_CONFIRM_DELETE_WITH_OBJECTTITLE_PLURAL",
													oResourceBundle,
													null,
													mParameters.entitySetName
											  );
								} else {
									//if non-deletable objects exists along with any of unsaved ,deletable objects
									aDeletableContexts = vContexts.concat(mParameters.unSavedContexts);
									cannotBeDeletedTextVisible = true;
									oDeleteMessage.text =
										aDeletableContexts.length === 1
											? CommonUtils.getTranslatedText(
													"C_TRANSACTION_HELPER_OBJECT_PAGE_CONFIRM_DELETE_WITH_OBJECTTITLE_SINGULAR_NON_DELETABLE",
													oResourceBundle,
													null,
													mParameters.entitySetName
											  )
											: CommonUtils.getTranslatedText(
													"C_TRANSACTION_HELPER_OBJECT_PAGE_CONFIRM_DELETE_WITH_OBJECTTITLE_PLURAL_NON_DELETABLE",
													oResourceBundle,
													null,
													mParameters.entitySetName
											  );
									oDeleteMessage.nonDeletableText = CommonUtils.getTranslatedText(
										"C_TRANSACTION_HELPER_OBJECT_PAGE_CONFIRM_DELETE_WITH_OBJECTINFO_AND_FEW_OBJECTS_NON_DELETABLE",
										oResourceBundle,
										[
											mParameters.numberOfSelectedContexts - vContexts.concat(mParameters.unSavedContexts).length,
											mParameters.numberOfSelectedContexts
										]
									);
								}
								if (mParameters.lockedContexts.length == 1) {
									//setting the locked text if locked objects exist
									isLockedTextVisible = true;
									oDeleteMessage.nonDeletableText = CommonUtils.getTranslatedText(
										"C_TRANSACTION_HELPER_OBJECT_PAGE_CONFIRM_DELETE_WITH_OBJECTINFO_AND_ONE_OBJECT_LOCKED",
										oResourceBundle,
										[mParameters.numberOfSelectedContexts]
									);
								}
								if (mParameters.lockedContexts.length > 1) {
									//setting the locked text if locked objects exist
									isLockedTextVisible = true;
									oDeleteMessage.nonDeletableText = CommonUtils.getTranslatedText(
										"C_TRANSACTION_HELPER_OBJECT_PAGE_CONFIRM_DELETE_WITH_OBJECTINFO_AND_FEW_OBJECTS_LOCKED",
										oResourceBundle,
										[mParameters.lockedContexts.length, mParameters.numberOfSelectedContexts]
									);
								}
								if (
									mParameters.unSavedContexts.length > 0 &&
									mParameters.unSavedContexts.length !== mParameters.numberOfSelectedContexts
								) {
									if (
										(cannotBeDeletedTextVisible || isLockedTextVisible) &&
										aDeletableContexts.length === mParameters.unSavedContexts.length
									) {
										//if only unsaved and either or both of locked and non-deletable objects exist then we hide the check box
										isCheckBoxVisible = false;
										aDeletableContexts = mParameters.unSavedContexts;
										if (mParameters.unSavedContexts.length === 1) {
											oDeleteMessage.text = CommonUtils.getTranslatedText(
												"C_TRANSACTION_HELPER_OBJECT_PAGE_CONFIRM_DELETE_WITH_UNSAVED_AND_FEW_OBJECTS_LOCKED_SINGULAR",
												oResourceBundle
											);
										} else {
											oDeleteMessage.text = CommonUtils.getTranslatedText(
												"C_TRANSACTION_HELPER_OBJECT_PAGE_CONFIRM_DELETE_WITH_UNSAVED_AND_FEW_OBJECTS_LOCKED_PLURAL",
												oResourceBundle
											);
										}
									} else {
										if (mParameters.unSavedContexts.length === 1) {
											oDeleteMessage.checkBoxText = CommonUtils.getTranslatedText(
												"C_TRANSACTION_HELPER_OBJECT_PAGE_CONFIRM_DELETE_WITH_OBJECTINFO_AND_FEW_OBJECTS_UNSAVED_SINGULAR",
												oResourceBundle
											);
										} else {
											oDeleteMessage.checkBoxText = CommonUtils.getTranslatedText(
												"C_TRANSACTION_HELPER_OBJECT_PAGE_CONFIRM_DELETE_WITH_OBJECTINFO_AND_FEW_OBJECTS_UNSAVED_PLURAL",
												oResourceBundle
											);
										}
										isCheckBoxVisible = true;
									}
								}
								if (cannotBeDeletedTextVisible && isLockedTextVisible) {
									//if both locked and non-deletable objects exist along with deletable objects
									if (mParameters.unSavedContexts.length > 1) {
										oDeleteMessage.nonDeletableText = CommonUtils.getTranslatedText(
											"C_TRANSACTION_HELPER_OBJECT_PAGE_CONFIRM_DELETE_WITH_OBJECTINFO_AND_FEW_OBJECTS_LOCKED_AND_NON_DELETABLE",
											oResourceBundle,
											[
												mParameters.numberOfSelectedContexts -
													vContexts.concat(mParameters.unSavedContexts).length -
													mParameters.lockedContexts.length,
												mParameters.lockedContexts.length,
												mParameters.numberOfSelectedContexts
											]
										);
									}
									if (mParameters.unSavedContexts.length == 1) {
										oDeleteMessage.nonDeletableText = CommonUtils.getTranslatedText(
											"C_TRANSACTION_HELPER_OBJECT_PAGE_CONFIRM_DELETE_WITH_OBJECTINFO_AND_ONE_OBJECT_LOCKED_AND_NON_DELETABLE",
											oResourceBundle,
											[
												mParameters.numberOfSelectedContexts -
													vContexts.concat(mParameters.unSavedContexts).length -
													mParameters.lockedContexts.length,
												mParameters.numberOfSelectedContexts
											]
										);
									}
								}
							}
						}
						var oNonDeletableMessageTextControl,
							oDeleteMessageTextControl,
							oContent = new VBox({
								items: [
									(oNonDeletableMessageTextControl = new Text({
										text: oDeleteMessage.nonDeletableText,
										visible: isLockedTextVisible || cannotBeDeletedTextVisible
									})),
									(oDeleteMessageTextControl = new Text({
										text: oDeleteMessage.text
									})),
									new CheckBox({
										text: oDeleteMessage.checkBoxText,
										selected: true,
										select: function(oEvent) {
											var selected = oEvent.getSource().getSelected();
											if (selected) {
												aDeletableContexts = vContexts.concat(mParameters.unSavedContexts);
												isCheckBoxSelected = true;
											} else {
												aDeletableContexts = vContexts;
												isCheckBoxSelected = false;
											}
										},
										visible: isCheckBoxVisible
									})
								]
							});
						var sTitle = oResourceBundleCore.getText("C_COMMON_OBJECT_PAGE_DELETE");
						var fnConfirm = function() {
							bDialogConfirmed = true;
							BusyLocker.lock(that.oLockObject);
							var aContexts = aDeletableContexts;
							return that
								.findActiveDraftRootContexts(aContexts, mParameters.bFindActiveContexts)
								.then(function(activeContexts) {
									//make sure to fetch the active contexts before deleting the drafts
									return Promise.all(
										aContexts.map(function(oContext) {
											//delete the draft
											return draft.deleteDraft(oContext);
										})
									)
										.catch(function(oError) {
											return messageHandler.showMessageDialog().then(function() {
												// re-throw error to enforce rejecting the general promise
												throw oError;
											});
										})
										.then(function() {
											var checkBox = {
												"isCheckBoxVisible": isCheckBoxVisible,
												"isCheckBoxSelected": isCheckBoxSelected
											};
											if (activeContexts && activeContexts.length) {
												return Promise.all(
													activeContexts.map(function(oContext) {
														return oContext.delete();
													})
												).then(function() {
													that.afterDeleteProcess(mParameters, checkBox, aContexts, oResourceBundle);
													return messageHandler.showMessageDialog().then(fnResolve);
												});
											} else {
												that.afterDeleteProcess(mParameters, checkBox, aContexts, oResourceBundle);
												return messageHandler.showMessageDialog().then(fnResolve);
											}
										});
								})
								.catch(function() {
									fnReject();
								})
								.finally(function() {
									BusyLocker.unlock(that.oLockObject);
								});
						};
						var oDialog = new Dialog({
							title: sTitle,
							state: "Warning",
							content: [oContent],
							ariaLabelledBy: oNonDeletableMessageTextControl.getVisible()
								? [oNonDeletableMessageTextControl, oDeleteMessageTextControl]
								: oDeleteMessageTextControl,
							beginButton: new Button({
								text: oResourceBundleCore.getText("C_COMMON_OBJECT_PAGE_DELETE"),
								type: "Emphasized",
								press: function() {
									oDialog.close();
									return fnConfirm();
								}
							}),
							endButton: new Button({
								text: CommonUtils.getTranslatedText("C_COMMON_OBJECT_PAGE_CANCEL", oResourceBundle),
								press: function() {
									oDialog.close();
								}
							}),
							afterClose: function() {
								oDialog.destroy();
								// if dialog is closed unconfirmed (e.g. via "Cancel" or Escape button), ensure to reject promise
								if (!bDialogConfirmed) {
									fnReject();
								}
							}
						});
						if (mParameters.noDialog) {
							return fnConfirm();
						} else {
							oDialog.addStyleClass("sapUiContentPadding");
							oDialog.open();
						}
					})
					.finally(function() {
						BusyLocker.unlock(that.oLockObject);
					})
					.catch(function() {
						Log.warning("Couldn't get Programming model");
						fnReject();
					});
				return new Promise(function(resolve, reject) {
					fnReject = reject;
					fnResolve = resolve;
				});
			},
			/**
			 * Edits a document.
			 *
			 * @memberof sap.fe.core.TransactionHelper
			 * @static
			 * @param {sap.ui.model.odata.v4.Context} oContext Context of the active document
			 * @param {boolean} bPrepareOnEdit Also call the 'prepare' action for draft-based documents
			 * @param {object} oView Object of current view
			 * @param messageHandler
			 * @returns {Promise} Promise resolves with the new draft context in case of draft programming model
			 * @ui5-restricted
			 * @final
			 */
			editDocument: function(oContext, bPrepareOnEdit, oView, messageHandler) {
				var that = this,
					sProgrammingModel = this.getProgrammingModel(oContext),
					oEditPromise;
				if (!oContext) {
					return Promise.reject(new Error("Binding context to active document is required"));
				}
				this._bIsModified = false;
				BusyLocker.lock(that.oLockObject);
				// before triggering the edit action we'll have to remove all bound transition messages
				messageHandler.removeTransitionMessages();
				if (sProgrammingModel === ProgrammingModel.Draft) {
					oEditPromise = draft.createDraftFromActiveDocument(oContext, this._getAppComponent(), {
						bPreserveChanges: true,
						bPrepareOnEdit: bPrepareOnEdit,
						oView: oView
					});
				} else if (sProgrammingModel === ProgrammingModel.Sticky) {
					oEditPromise = sticky.editDocumentInStickySession(oContext);
				} else {
					BusyLocker.unlock(that.oLockObject);
					return Promise.reject(new Error("Edit is only allowed for draft or sticky session supported services"));
				}
				return oEditPromise
					.then(function(oNewContext) {
						that._bCreateMode = false;
						return messageHandler.showMessageDialog().then(function() {
							return oNewContext;
						});
					})
					.catch(function(err) {
						return messageHandler.showMessageDialog().then(function() {
							return Promise.reject(err);
						});
					})
					.finally(function() {
						BusyLocker.unlock(that.oLockObject);
					});
			},
			/**
			 * Cancel 'edit' mode of a document.
			 *
			 * @memberof sap.fe.core.TransactionHelper
			 * @static
			 * @param {sap.ui.model.odata.v4.Context} oContext Context of the document to be canceled or deleted
			 * @param {object} [mParameters] Optional, can contain the following attributes:
			 * @param {sap.m.Button} mParameters.cancelButton Cancel Button of the discard popover (mandatory for now)
			 * @param {boolean} mParameters.bSkipDiscardPopover Optional, supresses the discard popover incase of draft applications while navigating out of OP
			 * @param oResourceBundle
			 * @param messageHandler
			 * @returns {Promise} Promise resolves with ???
			 * @ui5-restricted
			 * @final
			 */
			cancelDocument: function(oContext, mParameters, oResourceBundle, messageHandler) {
				var that = this,
					sProgrammingModel;
				//context must always be passed - mandatory parameter
				if (!oContext) {
					return Promise.reject("No context exists. Pass a meaningful context");
				}
				BusyLocker.lock(that.oLockObject);
				mParameters = getParameters(mParameters);
				var oParamsContext = oContext,
					oCancelButton = mParameters.cancelButton,
					oModel = oParamsContext.getModel(),
					sCanonicalPath;
				return Promise.resolve(this.getProgrammingModel(oContext))
					.then(function(sPModel) {
						sProgrammingModel = sPModel;
						if (sPModel === ProgrammingModel.Draft) {
							var draftDataContext = oModel
								.bindContext(oParamsContext.getPath() + "/DraftAdministrativeData")
								.getBoundContext();
							if (!that._bIsModified) {
								return draftDataContext.requestObject().then(function(draftAdminData) {
									if (draftAdminData) {
										that._bIsModified = !(draftAdminData.CreationDateTime === draftAdminData.LastChangeDateTime);
									}
								});
							}
						}
					})
					.then(function() {
						if (!mParameters.bSkipDiscardPopover) {
							return that._showDiscardPopover(oCancelButton, that._bIsModified, oResourceBundle);
						} else {
							return Promise.resolve();
						}
					})
					.then(function() {
						// eslint-disable-next-line default-case
						switch (sProgrammingModel) {
							case ProgrammingModel.Draft:
								return oParamsContext.requestObject("HasActiveEntity").then(function(bHasActiveEntity) {
									var oDeletePromise;
									if (!bHasActiveEntity) {
										if (oParamsContext && oParamsContext.hasPendingChanges()) {
											oParamsContext.getBinding().resetChanges();
										}
										oDeletePromise = draft.deleteDraft(oParamsContext);
										return oDeletePromise;
									} else {
										var oActiveContext = oModel
											.bindContext(oParamsContext.getPath() + "/SiblingEntity")
											.getBoundContext();
										return oActiveContext
											.requestCanonicalPath()
											.then(
												function(sPath) {
													sCanonicalPath = sPath;
													if (oParamsContext && oParamsContext.hasPendingChanges()) {
														oParamsContext.getBinding().resetChanges();
													}
													oDeletePromise = draft.deleteDraft(oParamsContext);
													return oDeletePromise;
												},
												function() {
													draft.deleteDraft(oParamsContext);
													return;
												}
											)
											.then(function() {
												//oParamsContext.delete() in the previous promise doesnt return anything upon success.
												if (!sCanonicalPath) {
													return;
												}
												if (oActiveContext.getPath() !== sCanonicalPath) {
													// the active context is using the sibling entity - this path is not accessible anymore as we deleted the draft
													// document - therefore we need to create a new context with the canonical path
													oActiveContext = oModel.bindContext(sCanonicalPath).getBoundContext();
												}
												return oActiveContext;
											});
									}
								});
							case ProgrammingModel.Sticky:
								return sticky.discardDocument(oContext).then(function(oContext) {
									if (oContext) {
										if (oContext.hasPendingChanges()) {
											oContext.getBinding().resetChanges();
										}
										if (!that._bCreateMode) {
											oContext.refresh();
											return oContext;
										}
									}
									return false;
								});
							default:
								return Promise.reject("Cancel document only allowed for draft or sticky session supported services");
						}
					})
					.then(function(context) {
						that._bIsModified = false;
						// remove existing bound transition messages
						messageHandler.removeTransitionMessages();
						// show unbound messages
						return messageHandler.showMessageDialog().then(function() {
							return context;
						});
					})
					.catch(function(err) {
						return messageHandler.showMessageDialog().then(function() {
							return Promise.reject(err);
						});
					})
					.finally(function() {
						BusyLocker.unlock(that.oLockObject);
					});
			},
			/**
			 * Saves the document.
			 *
			 * @memberof sap.fe.core.TransactionHelper
			 * @static
			 * @param {sap.ui.model.odata.v4.Context} oContext Context of the document to be saved
			 * @param oResourceBundle
			 * @param bExecuteSideEffectsOnError
			 * @param aBindings
			 * @param messageHandler
			 * @returns {Promise} Promise resolves with ???
			 * @ui5-restricted
			 * @final
			 */
			saveDocument: function(oContext, oResourceBundle, bExecuteSideEffectsOnError, aBindings, messageHandler) {
				var that = this,
					sProgrammingModel = this.getProgrammingModel(oContext),
					oSavePromise;
				if (!oContext) {
					return Promise.reject(new Error("Binding context to draft document is required"));
				}
				// in case of saving / activating the bound transition messages shall be removed before the PATCH/POST
				// is sent to the backend
				messageHandler.removeTransitionMessages();
				BusyLocker.lock(that.oLockObject);
				if (sProgrammingModel === ProgrammingModel.Draft) {
					oSavePromise = draft.activateDocument(oContext, this._getAppComponent());
				} else if (sProgrammingModel === ProgrammingModel.Sticky) {
					oSavePromise = sticky.activateDocument(oContext);
				} else {
					BusyLocker.unlock(that.oLockObject);
					return Promise.reject(new Error("Save is only allowed for draft or sticky session supported services"));
				}
				return oSavePromise
					.then(function(oActiveDocument) {
						var bNewObject =
							that.sProgrammingModel === ProgrammingModel.Sticky ? that._bCreateMode : !oContext.getObject().HasActiveEntity;
						MessageToast.show(
							bNewObject
								? CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_OBJECT_CREATED", oResourceBundle)
								: CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_OBJECT_SAVED", oResourceBundle)
						);
						that._bIsModified = false;
						return messageHandler.showMessageDialog().then(function() {
							return oActiveDocument;
						});
					})
					.catch(function(err) {
						if (aBindings && aBindings.length > 0) {
							/* The sideEffects are executed only for table items in transient state */
							aBindings.forEach(function(oListBinding) {
								if (!CommonUtils.hasTransientContext(oListBinding) && bExecuteSideEffectsOnError) {
									var oAppComponent = that._getAppComponent();
									oAppComponent
										.getSideEffectsService()
										.requestSideEffectsForNavigationProperty(oListBinding.getPath(), oContext);
								}
							});
						}
						return messageHandler.showMessageDialog().then(function() {
							return Promise.reject(err);
						});
					})
					.finally(function() {
						BusyLocker.unlock(that.oLockObject);
					});
			},
			/**
			 * Calls a bound/unbound action.
			 *
			 * @function
			 * @static
			 * @name sap.fe.core.TransactionHelper.callAction
			 * @memberof sap.fe.core.TransactionHelper
			 * @param {string} sActionName The name of the action to be called
			 * @param {map} [mParameters] Contains the following attributes:
			 * @param {sap.ui.model.odata.v4.Context} [mParameters.contexts] Mandatory for a bound action: Either one context or an array with contexts for which the action shall be called
			 * @param {sap.ui.model.odata.v4.ODataModel} [mParameters.model] Mandatory for an unbound action: An instance of an OData v4 model
			 * @param {string} [mParameters.invocationGrouping] Mode how actions are to be called: Changeset to put all action calls into one changeset, Isolated to put them into separate changesets (TODO: create enum)
			 * @param {string} [mParameters.label] A human-readable label for the action
			 * @param {boolean} [mParameters.bGetBoundContext] If specified, the action promise returns the bound context
			 * @param {object} oView Contains the object of the current view
			 * @param messageHandler
			 * @returns {Promise} Promise resolves with an array of response objects (TODO: to be changed)
			 * @ui5-restricted
			 * @final
			 **/
			callAction: function(sActionName, mParameters, oView, messageHandler) {
				mParameters = getParameters(mParameters);
				var that = this,
					oContext,
					oModel,
					oPromise,
					sName,
					mBindingParameters = mParameters.bindingParameters;
				if (!sActionName) {
					return Promise.reject("Provide name of action to be executed");
				}
				// action imports are not directly obtained from the metaModel by it is present inside the entityContainer
				// and the acions it refers to present outside the entitycontainer, hence to obtain kind of the action
				// split() on its name was required
				sName = sActionName.split("/")[1];
				sActionName = sName || sActionName;
				oContext = sName ? undefined : mParameters.contexts;
				//checking whether the context is an array with more than 0 length or not an array(create action)
				if (oContext && ((Array.isArray(oContext) && oContext.length) || !Array.isArray(oContext))) {
					oContext = Array.isArray(oContext) ? oContext[0] : oContext;
					oModel = oContext.getModel();
				}
				if (mParameters.model) {
					oModel = mParameters.model;
				}
				if (!oModel) {
					return Promise.reject("Pass a context for a bound action or pass the model for an unbound action");
				}
				// get the binding parameters $select and $expand for the side effect on this action
				// also gather additional property paths to be requested such as text associations
				var oAppComponent = that._getAppComponent();
				var mSideEffectsParameters = oAppComponent.getSideEffectsService().getODataActionSideEffects(sActionName, oContext) || {};
				if (oContext && oModel) {
					oPromise = new Promise(function(resolve, reject) {
						var oApplicableContextDialog;
						var oController = {
							onClose: function() {
								// User cancels action
								oApplicableContextDialog.close();
								resolve();
							},
							onContinue: function() {
								// Users continues the action with the bound contexts
								oApplicableContextDialog.close();
								resolve(mParameters.applicableContext);
							}
						};
						var fnOpenAndFillDialog = function() {
							var oDialogContent,
								nNotApplicable = mParameters.notApplicableContext.length,
								aNotApplicableItems = [];
							for (var i = 0; i < mParameters.notApplicableContext.length; i++) {
								oDialogContent = mParameters.notApplicableContext[i].getObject();
								aNotApplicableItems.push(oDialogContent);
							}
							var oNotApplicableItemsModel = new JSONModel(aNotApplicableItems);
							var oTotals = new JSONModel({ total: nNotApplicable, label: mParameters.label });
							oApplicableContextDialog.setModel(oNotApplicableItemsModel, "notApplicable");
							oApplicableContextDialog.setModel(oTotals, "totals");
							oApplicableContextDialog.open();
						};
						if (mParameters.notApplicableContext && mParameters.notApplicableContext.length >= 1) {
							// Show the contexts that are not applicable and will not therefore be processed
							var sFragmentName = "sap.fe.core.controls.ActionPartial";
							var oDialogFragment = XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment");
							var oMetaModel = oModel.getMetaModel();
							var sCanonicalPath = mParameters.contexts[0].getCanonicalPath();
							var sEntitySet = sCanonicalPath.substr(0, sCanonicalPath.indexOf("(")) + "/";
							var oDialogLabelModel = new JSONModel({
								title: mParameters.label
							});
							Promise.resolve(
								XMLPreprocessor.process(
									oDialogFragment,
									{ name: sFragmentName },
									{
										bindingContexts: {
											entityType: oMetaModel.createBindingContext(sEntitySet),
											label: oDialogLabelModel.createBindingContext("/")
										},
										models: {
											entityType: oMetaModel,
											metaModel: oMetaModel,
											label: oDialogLabelModel
										}
									}
								)
							)
								.then(function(oFragment) {
									return Fragment.load({ definition: oFragment, controller: oController });
								})
								.then(function(oPopover) {
									oApplicableContextDialog = oPopover;
									mParameters.parentControl.addDependent(oPopover);
									fnOpenAndFillDialog();
								})
								.catch(reject);
						} else {
							resolve(mParameters.contexts);
						}
					}).then(function(contextToProcess) {
						if (contextToProcess) {
							return operations.callBoundAction(sActionName, contextToProcess, oModel, oAppComponent, {
								invocationGrouping: mParameters.invocationGrouping,
								label: mParameters.label,
								showActionParameterDialog: true,
								mBindingParameters: mBindingParameters,
								entitySetName: mParameters.entitySetName,
								additionalSideEffect: mSideEffectsParameters,
								onSubmitted: function() {
									messageHandler.removeTransitionMessages();
									BusyLocker.lock(that.oLockObject);
								},
								onResponse: function() {
									BusyLocker.unlock(that.oLockObject);
								},
								parentControl: mParameters.parentControl,
								internalModelContext: mParameters.internalModelContext,
								operationAvailableMap: mParameters.operationAvailableMap,
								bIsCreateAction: mParameters.bIsCreateAction,
								bGetBoundContext: mParameters.bGetBoundContext,
								bObjectPage: mParameters.bObjectPage,
								messageHandler: messageHandler,
								defaultValuesExtensionFunction: mParameters.defaultValuesExtensionFunction
							});
						} else {
							return null;
						}
					});
				} else {
					// TODO: confirm if action import needs side effects.
					oPromise = operations.callActionImport(sActionName, oModel, oAppComponent, {
						label: mParameters.label,
						showActionParameterDialog: true,
						bindingParameters: mBindingParameters,
						entitySetName: mParameters.entitySetName,
						onSubmitted: function() {
							BusyLocker.lock(that.oLockObject);
						},
						onResponse: function() {
							BusyLocker.unlock(that.oLockObject);
						},
						parentControl: mParameters.parentControl,
						internalModelContext: mParameters.internalModelContext,
						operationAvailableMap: mParameters.operationAvailableMap,
						messageHandler: messageHandler,
						bObjectPage: mParameters.bObjectPage
					});
				}
				return oPromise
					.then(function(oResult) {
						// Succeeded
						return that._handleActionResponse(messageHandler, mParameters, sActionName).then(function() {
							return oResult;
						});
					})
					.catch(function(err) {
						return that._handleActionResponse(messageHandler, mParameters, sActionName).then(function() {
							return Promise.reject(err);
						});
					});
			},
			/**
			 * Handles messages for action call.
			 *
			 * @function
			 * @name sap.fe.core.TransactionHelper#_handleActionResponse
			 * @memberof sap.fe.core.TransactionHelper
			 * @param messageHandler
			 * @param {object} mParameters Parameters to be considered for the action.
			 * @param {string} sActionName The name of the action to be called
			 * @returns {Promise} Promise after message dialog is opened if required.
			 * @ui5-restricted
			 * @final
			 */
			_handleActionResponse: function(messageHandler, mParameters, sActionName) {
				var aTransientMessages = messageHandling.getMessages(true, true);
				if (aTransientMessages.length > 0 && mParameters && mParameters.internalModelContext) {
					mParameters.internalModelContext.setProperty("sActionName", mParameters.label ? mParameters.label : sActionName);
				}
				return messageHandler.showMessageDialog();
			},
			/**
			 * Handles validation errors for the 'discard' action.
			 *
			 * @function
			 * @name sap.fe.core.TransactionHelper#handleValidationError
			 * @memberof sap.fe.core.TransactionHelper
			 * @static
			 * @ui5-restricted
			 * @final
			 */
			handleValidationError: function() {
				var oMessageManager = sap.ui.getCore().getMessageManager(),
					errorToRemove = oMessageManager
						.getMessageModel()
						.getData()
						.filter(function(error) {
							// only needs to handle validation messages, technical and persistent errors needs not to be checked here.
							if (error.validation) {
								return error;
							}
						});
				oMessageManager.removeMessages(errorToRemove);
			},
			/**
			 * Shows a popover if it needs to be shown.
			 * TODO: Popover is shown if user has modified any data.
			 * TODO: Popover is shown if there's a difference from draft admin data.
			 * @static
			 * @name sap.fe.core.TransactionHelper._showDiscardPopover
			 * @memberof sap.fe.core.TransactionHelper
			 * @param {sap.ui.core.Control} oCancelButton The control which will open the popover
			 * @param bIsModified
			 * @param oResourceBundle
			 * @returns {Promise} Promise resolves if user confirms discard, rejects if otherwise, rejects if no control passed to open popover
			 * @ui5-restricted
			 * @final
			 */
			_showDiscardPopover: function(oCancelButton, bIsModified, oResourceBundle) {
				// TODO: Implement this popover as a fragment as in v2??
				var that = this;
				that._bContinueDiscard = false;
				// to be implemented
				return new Promise(function(resolve, reject) {
					if (!oCancelButton) {
						reject("Cancel button not found");
					}
					//Show popover only when data is changed.
					if (bIsModified) {
						var fnOnAfterDiscard = function() {
							oCancelButton.setEnabled(true);
							if (that._bContinueDiscard) {
								resolve();
							} else {
								reject("Discard operation was rejected. Document has not been discarded");
							}
							that._oPopover.detachAfterClose(fnOnAfterDiscard);
						};
						if (!that._oPopover) {
							var oText = new Text({
									//This text is the same as LR v2.
									//TODO: Display message provided by app developer???
									text: CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_DRAFT_DISCARD_MESSAGE", oResourceBundle)
								}),
								oButton = new Button({
									text: CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_DRAFT_DISCARD_BUTTON", oResourceBundle),
									width: "100%",
									press: function() {
										that.handleValidationError();
										that._bContinueDiscard = true;
										that._oPopover.close();
									},
									ariaLabelledBy: oText
								});
							that._oPopover = new Popover({
								showHeader: false,
								placement: "Top",
								content: [
									new VBox({
										items: [oText, oButton]
									})
								],
								beforeOpen: function() {
									// make sure to NOT trigger multiple cancel flows
									oCancelButton.setEnabled(false);
									that._oPopover.setInitialFocus(oButton);
								}
							});
							that._oPopover.addStyleClass("sapUiContentPadding");
						}
						that._oPopover.attachAfterClose(fnOnAfterDiscard);
						that._oPopover.openBy(oCancelButton);
					} else {
						that.handleValidationError();
						resolve();
					}
				});
			},
			/**
			 * Sets the document to modified state on patch event.
			 *
			 * @function
			 * @static
			 * @name sap.fe.core.TransactionHelper.handleDocumentModifications
			 * @memberof sap.fe.core.TransactionHelper
			 * @ui5-restricted
			 * @final
			 */
			handleDocumentModifications: function() {
				this._bIsModified = true;
			},
			/**
			 * Retrieves the owner component.
			 *
			 * @function
			 * @static
			 * @private
			 * @name sap.fe.core.TransactionHelper._getOwnerComponent
			 * @memberof sap.fe.core.TransactionHelper
			 * @returns {sap.fe.core.AppComponent} The app component
			 * @ui5-restricted
			 * @final
			 **/
			_getAppComponent: function() {
				return this._oAppComponent;
			},
			_launchDialogWithKeyFields: function(
				oListBinding,
				oTransientListBinding,
				oTransientContext,
				mFields,
				oModel,
				mParameters,
				messageHandler,
				sFunctionName
			) {
				var that = this,
					oDialog,
					oParentControl = mParameters.parentControl,
					bSuccess = false;
				return new Promise(function(resolve, reject) {
					var sFragmentName = "sap/fe/core/controls/NonComputedVisibleKeyFieldsDialog";
					var oFragment = XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment"),
						oResourceBundle = oParentControl.getController().oResourceBundle,
						oMetaModel = oModel.getMetaModel(),
						aImmutableFields = [],
						oAppComponent = that._getAppComponent(),
						oEntitySetContext = oMetaModel.createBindingContext(oListBinding.getPath()),
						sMetaPath = oMetaModel.getMetaPath(oListBinding.getPath());
					for (var i in mFields) {
						aImmutableFields.push(oMetaModel.createBindingContext(sMetaPath + "/" + mFields[i]));
					}
					var oImmutableCtx = new JSONModel(aImmutableFields);
					oImmutableCtx = oImmutableCtx.createBindingContext("/");
					return Promise.resolve(
						XMLPreprocessor.process(
							oFragment,
							{ name: sFragmentName },
							{
								bindingContexts: {
									entitySet: oEntitySetContext,
									fields: oImmutableCtx
								},
								models: {
									entitySet: oEntitySetContext.getModel(),
									fields: oImmutableCtx.getModel(),
									metaModel: oMetaModel
								}
							}
						)
					).then(function(oFragment) {
						var aFormElements = [],
							mFieldValueMap = {},
							oCreateButton,
							validateRequiredProperties = function() {
								return Promise.all(
									aFormElements
										.map(function(oFormElement) {
											return oFormElement.getFields()[0];
										})
										.filter(function(oField) {
											return oField.getRequired();
										})
										.map(function(oField) {
											var sFieldId = oField.getId();
											if (sFieldId in mFieldValueMap) {
												return Promise.resolve(mFieldValueMap[sFieldId])
													.then(function(vValue) {
														return vValue;
													})
													.catch(function() {
														return undefined;
													});
											}
											return oField.getValueState() === ValueState.Error ? undefined : oField.getValue();
										})
								)
									.then(function(aResults) {
										return aResults.every(function(vValue) {
											return vValue !== undefined && vValue !== null && vValue !== "";
										});
									})
									.catch(function() {
										return false;
									})
									.then(function(bEnabled) {
										oCreateButton.setEnabled(bEnabled);
									});
							},
							oController = {
								/*
									fired on focus out from field or on selecting a value from the valuehelp.
									the create button is enabled when a value is added.
									liveChange is not fired when value is added from valuehelp.
									value validation is not done for create button enablement.
								*/
								handleChange: function(oEvent) {
									messageHandler.removeTransitionMessages();
									var oField = oEvent.getSource();
									var sFieldId = oEvent.getParameter("id");
									var oFieldPromise = oEvent.getParameter("promise");
									if (oFieldPromise) {
										mFieldValueMap[sFieldId] = oFieldPromise.then(function() {
											return oField.getValue();
										});
									}
									validateRequiredProperties();
								},
								/*
									fired on key press. the create button is enabled when a value is added.
									liveChange is not fired when value is added from valuehelp.
									value validation is not done for create button enablement.
								*/
								handleLiveChange: function(oEvent) {
									var sFieldId = oEvent.getParameter("id");
									var vValue = oEvent.getParameter("value");
									mFieldValueMap[sFieldId] = vValue;
									validateRequiredProperties();
								}
							};
						return Fragment.load({
							definition: oFragment,
							controller: oController
						}).then(function(oDialogContent) {
							oDialog = new Dialog({
								title: CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_SAPFE_ACTION_CREATE", oResourceBundle),
								content: [oDialogContent],
								beginButton: {
									text: CommonUtils.getTranslatedText("C_TRANSACTION_HELPER_SAPFE_ACTION_CREATE_BUTTON", oResourceBundle),
									type: "Emphasized",
									press: function(oEvent) {
										var oCreateButton = oEvent.getSource();
										oCreateButton.setEnabled(false);
										BusyLocker.lock(oDialog);
										return Promise.all(
											Object.keys(mFieldValueMap).map(function(sKey) {
												return mFieldValueMap[sKey];
											})
										)
											.then(function() {
												var oPromise = that.onAfterCreateCompletion(
													oTransientListBinding,
													oTransientContext,
													mParameters,
													oResourceBundle
												);
												oModel.submitBatch("submitLater");
												return oPromise;
											})
											.then(function(oResponse) {
												oDialog.setBindingContext(null);
												oDialog.close();
												resolve(oResponse);
											})
											.finally(function() {
												BusyLocker.unlock(oDialog);
												oCreateButton.setEnabled(true);
												return messageHandler.showMessageDialog();
											});
									}
								},
								endButton: {
									text: CommonUtils.getTranslatedText("C_COMMON_ACTION_PARAMETER_DIALOG_CANCEL", oResourceBundle),
									press: function() {
										oDialog.close();
									}
								},
								beforeOpen: function() {
									if (sFunctionName) {
										for (var i = 0; i < Object.keys(mParameters.data).length; i++) {
											if (mParameters.data && mFields.indexOf(Object.keys(mParameters.data)[i]) > -1) {
												oTransientContext.setProperty(mFields[i], mParameters.data[mFields[i]]);
											}
										}
									}
								},
								afterClose: function() {
									// show footer as per UX guidelines when dialog is not open
									oDialog.getBindingContext("internal").setProperty("isCreateDialogOpen", false);
									oDialog.destroy();
									if (!bSuccess) {
										reject({
											bDeleteTransientContext: true
										});
									}
								}
							});
							aFormElements = oDialogContent
								.getAggregation("form")
								.getAggregation("formContainers")[0]
								.getAggregation("formElements");
							if (oParentControl && oParentControl.addDependent) {
								// if there is a parent control specified add the dialog as dependent
								oParentControl.addDependent(oDialog);
							}
							oCreateButton = oDialog.getBeginButton();
							oDialog.setBindingContext(oTransientContext);
							return CommonUtils.setUserDefaults(oAppComponent, aImmutableFields, oTransientContext)
								.then(function() {
									validateRequiredProperties();
									// footer must not be visible when the dialog is open as per UX guidelines
									oDialog.getBindingContext("internal").setProperty("isCreateDialogOpen", true);
									oDialog.open();
								})
								.catch(function(oError) {
									return messageHandler.showMessageDialog().then(function() {
										return Promise.reject(oError);
									});
								});
						});
					});
				});
			},
			onAfterCreateCompletion: function(oListBinding, oNewDocumentContext, mParameters, oResourceBundle) {
				var fnResolve,
					fnReject,
					oPromise = new Promise(function(resolve, reject) {
						fnResolve = resolve;
						fnReject = reject;
					});
				// Workaround suggested by OData model v4 colleagues
				var fnCreateCompleted = function(oEvent) {
					var oContext = oEvent.getParameter("context"),
						bSuccess = oEvent.getParameter("success");
					if (oContext === oNewDocumentContext) {
						oListBinding.detachCreateCompleted(fnCreateCompleted, this);
						if (!bSuccess) {
							var oError = { bDeleteTransientContext: false };
							if (!mParameters.keepTransientContextOnFailed) {
								// the context is deleted
								oError.bDeleteTransientContext = true;
								// this is needed to avoid console errors TO be checked with model colleagues
								oContext
									.created()
									.then(undefined, function() {
										Log.trace("transient creation context deleted");
									})
									.catch(function(oError) {
										Log.trace("transient creation context deletion error", oError);
									});
								// if current state is transient (...), browser will come back to previous state
								oError.navigateBackFromTransientState = true;
							}
							fnReject(oError);
						} else {
							fnResolve();
						}
					}
				};
				oListBinding.attachCreateCompleted(fnCreateCompleted, this);
				return oPromise;
			},
			/**
			 * Retrieves the name of the NewAction to be executed.
			 *
			 * @function
			 * @static
			 * @private
			 * @name sap.fe.core.TransactionHelper._getNewAction
			 * @memberof sap.fe.core.TransactionHelper
			 * @param {object} oStartupParameters Startup parameters of the application
			 * @param {string} sCreateHash Hash to be checked for action type
			 * @param {object} oMetaModel The MetaModel used to check for NewAction parameter
			 * @param {string} sMetaPath The MetaPath
			 * @returns {string} The name of the action
			 * @ui5-restricted
			 * @final
			 **/
			_getNewAction: function(oStartupParameters, sCreateHash, oMetaModel, sMetaPath) {
				var sNewAction;

				if (oStartupParameters && oStartupParameters.preferredMode && sCreateHash.indexOf("i-action=createWith") > -1) {
					var sPreferredMode = oStartupParameters.preferredMode[0];
					sNewAction =
						sPreferredMode.indexOf("createWith:") > -1 ? sPreferredMode.substr(sPreferredMode.lastIndexOf(":") + 1) : undefined;
				} else {
					sNewAction =
						oMetaModel && oMetaModel.getObject !== undefined
							? oMetaModel.getObject(sMetaPath + "@com.sap.vocabularies.Session.v1.StickySessionSupported/NewAction") ||
							  oMetaModel.getObject(sMetaPath + "@com.sap.vocabularies.Common.v1.DraftRoot/NewAction")
							: undefined;
				}
				return sNewAction;
			}
		});
	}
);
