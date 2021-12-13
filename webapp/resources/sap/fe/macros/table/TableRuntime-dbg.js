/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/fe/macros/CommonHelper",
		"sap/ui/mdc/enum/ConditionValidated",
		"sap/fe/core/CommonUtils",
		"sap/fe/core/library",
		"sap/fe/macros/field/FieldRuntime",
		"sap/fe/macros/table/TableHelper"
	],
	function(CommonHelper, ConditionValidated, CommonUtils, FELibrary, FieldRuntime, TableHelper) {
		"use strict";

		var CreationMode = FELibrary.CreationMode;
		/**
		 * Static class used by MDC Table during runtime
		 *
		 * @private
		 * @experimental This module is only for internal/experimental use!
		 */
		var TableRuntime = {
			displayTableSettings: function(oEvent) {
				/*
				 Temporary solution
				 Wait for mdc Table to provide public api to either get button 'Settings' or fire event on this button
				 */
				var oParent = oEvent.getSource().getParent(),
					oSettingsButton = sap.ui.getCore().byId(oParent.getId() + "-settings");
				CommonUtils.fireButtonPress(oSettingsButton);
			},
			executeConditionalActionShortcut: function(sButtonMatcher, oSource) {
				// Get the button related to keyboard shortcut
				var oMdcTable = oSource.getParent();
				if (sButtonMatcher !== CreationMode.CreationRow) {
					var oButton = oMdcTable
						.getActions()
						.reduce(function(aActionButtons, oActionToolbarAction) {
							return aActionButtons.concat(oActionToolbarAction.getAction());
						}, [])
						.find(function(oActionButton) {
							return oActionButton.getId().endsWith(sButtonMatcher);
						});
					CommonUtils.fireButtonPress(oButton);
				} else {
					var oCreationRow = oMdcTable.getAggregation("creationRow");
					if (oCreationRow && oCreationRow.getApplyEnabled() && oCreationRow.getVisible()) {
						oCreationRow.fireApply();
					}
				}
			},
			setContexts: function(
				oTable,
				sDeletablePath,
				oDraft,
				sCollection,
				sNavigationAvailableMap,
				sActionsMultiselectDisabled,
				sUpdatablePath
			) {
				var aActionsMultiselectDisabled = sActionsMultiselectDisabled ? sActionsMultiselectDisabled.split(",") : [];
				var oActionOperationAvailableMap = JSON.parse(sCollection);
				var oNavigationAvailableMap =
					sNavigationAvailableMap && sNavigationAvailableMap !== "undefined" && JSON.parse(sNavigationAvailableMap);
				var aSelectedContexts = oTable.getSelectedContexts();
				var isDeletable = false;
				var aDeletableContexts = [];
				var aUpdatableContexts = [];
				var aUnsavedContexts = [];
				var aLockedContexts = [];
				// oDynamicActions are bound actions that are available according to some property
				// in each item
				var oDynamicActions = {};
				var oIBN = {};
				var oLockedAndUnsavedContexts = {};
				var oModelObject;
				var oInternalModelContext = oTable.getBindingContext("internal");

				oLockedAndUnsavedContexts.aUnsavedContexts = [];
				oLockedAndUnsavedContexts.aLockedContexts = [];

				oInternalModelContext.setProperty("", {
					selectedContexts: aSelectedContexts,
					numberOfSelectedContexts: aSelectedContexts.length,
					dynamicActions: oDynamicActions,
					ibn: oIBN,
					deleteEnabled: true,
					deletableContexts: [],
					unSavedContexts: [],
					lockedContexts: [],
					updatableContexts: []
				});

				for (var i = 0; i < aSelectedContexts.length; i++) {
					var oSelectedContext = aSelectedContexts[i];
					var oContextData = oSelectedContext.getObject();
					for (var key in oContextData) {
						if (key.indexOf("#") === 0) {
							var sActionPath = key;
							sActionPath = sActionPath.substring(1, sActionPath.length);
							oModelObject = oInternalModelContext.getObject();
							oModelObject.dynamicActions[sActionPath] = { enabled: true };
							oInternalModelContext.setProperty("", oModelObject);
						}
					}
					oModelObject = oInternalModelContext.getObject();
					if (sDeletablePath != "undefined") {
						if (oSelectedContext && oSelectedContext.getProperty(sDeletablePath)) {
							if (oDraft !== "undefined" && oContextData.IsActiveEntity === true && oContextData.HasDraftEntity === true) {
								oLockedAndUnsavedContexts = getUnsavedAndLockedContexts(oContextData, oSelectedContext);
							} else {
								aDeletableContexts.push(oSelectedContext);
								oLockedAndUnsavedContexts.isDeletable = true;
							}
						}
						oModelObject["deleteEnabled"] = oLockedAndUnsavedContexts.isDeletable;
					} else if (oDraft !== "undefined" && oContextData.IsActiveEntity === true && oContextData.HasDraftEntity === true) {
						oLockedAndUnsavedContexts = getUnsavedAndLockedContexts(oContextData, oSelectedContext);
					} else {
						aDeletableContexts.push(oSelectedContext);
					}
					if (sUpdatablePath !== "undefined") {
						if (oSelectedContext && oSelectedContext.getProperty(sUpdatablePath)) {
							aUpdatableContexts.push(oSelectedContext);
						}
					}
				}

				function getUnsavedAndLockedContexts(oContextData, oSelectedContext) {
					if (oContextData.DraftAdministrativeData.InProcessByUser) {
						aLockedContexts.push(oSelectedContext);
					} else {
						aUnsavedContexts.push(oSelectedContext);
						isDeletable = true;
					}
					return {
						aLockedContexts: aLockedContexts,
						aUnsavedContexts: aUnsavedContexts,
						isDeletable: isDeletable
					};
				}

				if (!oTable.data("enableAnalytics")) {
					TableHelper.setIBNEnablement(oInternalModelContext, oNavigationAvailableMap, aSelectedContexts);
				}

				if (aSelectedContexts.length > 1) {
					this.disableAction(aActionsMultiselectDisabled, oDynamicActions);
				}

				oModelObject["deletableContexts"] = aDeletableContexts;
				oModelObject["updatableContexts"] = aUpdatableContexts;
				oModelObject["unSavedContexts"] = oLockedAndUnsavedContexts.aUnsavedContexts;
				oModelObject["lockedContexts"] = oLockedAndUnsavedContexts.aLockedContexts;
				oModelObject["controlId"] = oTable.getId();
				oInternalModelContext.setProperty("", oModelObject);

				return CommonUtils.setActionEnablement(oInternalModelContext, oActionOperationAvailableMap, aSelectedContexts);
			},
			disableAction: function(aActionsMultiselectDisabled, oDynamicActions) {
				aActionsMultiselectDisabled.forEach(function(sAction) {
					oDynamicActions[sAction] = { bEnabled: false };
				});
			},
			onFieldChangeInCreationRow: function(oEvent, oCustomValidationFunction) {
				// CREATION ROW CASE
				var mField = FieldRuntime.getFieldStateOnChange(oEvent),
					oSourceField = mField.field,
					sFieldId = oSourceField.getId();

				var oInternalModelContext = oSourceField.getBindingContext("internal"),
					mFieldValidity = oInternalModelContext.getProperty("creationRowFieldValidity"),
					mNewFieldValidity = Object.assign({}, mFieldValidity);

				mNewFieldValidity[sFieldId] = mField.state;
				oInternalModelContext.setProperty("creationRowFieldValidity", mNewFieldValidity);

				// prepare Custom Validation
				if (oCustomValidationFunction) {
					var mCustomValidity = oInternalModelContext.getProperty("creationRowCustomValidity"),
						mNewCustomValidity = Object.assign({}, mCustomValidity);
					mNewCustomValidity[oSourceField.getBinding("value").getPath()] = {
						fieldId: oSourceField.getId()
					};
					oInternalModelContext.setProperty("creationRowCustomValidity", mNewCustomValidity);
					// Remove existing CustomValidation message
					var oMessageManager = sap.ui.getCore().getMessageManager();
					var sTarget = oSourceField.getBindingContext().getPath() + "/" + oSourceField.getBindingPath("value");
					oMessageManager
						.getMessageModel()
						.getData()
						.forEach(function(oMessage) {
							if (oMessage.target === sTarget) {
								oMessageManager.removeMessages(oMessage);
							}
						});
				}
			},

			getVBoxVisibility: function() {
				var aItems = this.getItems();
				var bLastElementFound = false;
				for (var index = aItems.length - 1; index >= 0; index--) {
					if (!bLastElementFound) {
						if (arguments[index] !== true) {
							bLastElementFound = true;
							if (CommonHelper._isRatingIndicator(aItems[index])) {
								CommonHelper._updateStyleClassForRatingIndicator(aItems[index], true);
							} else {
								aItems[index].removeStyleClass("sapUiTinyMarginBottom");
							}
						}
					} else {
						if (CommonHelper._isRatingIndicator(aItems[index])) {
							CommonHelper._updateStyleClassForRatingIndicator(aItems[index], false);
						} else {
							aItems[index].addStyleClass("sapUiTinyMarginBottom");
						}
					}
				}
				return true;
			}
		};

		return TableRuntime;
	},
	/* bExport= */ true
);
