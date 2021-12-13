sap.ui.define(["sap/ui/base/Object", "sap/base/util/extend", "sap/suite/ui/generic/template/lib/CRUDHelper", "sap/m/MessageBox"
	], function(BaseObject, extend, CRUDHelper, MessageBox) {
		"use strict";

		function getMethods(oTemplateContract) {
			
			var fnOnDiscardOrKeepDraftConfirmed;
			var fnOnDiscardOrKeepDraftCancel;
			/*
			ShowDiscardDraftPopUp
			*/
			function fnDiscardOrKeepDraftConfirmation(onDiscardOrKeepDraftConfirmed, onDiscardOrKeepDraftCancel, sMode) {
				fnOnDiscardOrKeepDraftConfirmed = onDiscardOrKeepDraftConfirmed;
				fnOnDiscardOrKeepDraftCancel = onDiscardOrKeepDraftCancel;
			    var sWarningText = oTemplateContract.getText("ST_KEEP_DRAFT_MESSAGE");
			    var sKeepDraft = oTemplateContract.getText("ST_KEEP_DRAFT_BTN");
			    var sDiscardDraft = oTemplateContract.getText("ST_DISCARD_DRAFT_BTN");
			    var sCancel =  oTemplateContract.getText("CANCEL");
				MessageBox.warning(sWarningText, {
					title: oTemplateContract.getText("ST_UNSAVED_CHANGES_TITLE"),
					actions: [sKeepDraft, sDiscardDraft, sCancel],
					emphasizedAction: sKeepDraft,
					onClose: function (sAction) {
						if (sAction === sKeepDraft) {
							fnOnDiscardOrKeepDraftConfirmed();
						} else if (sAction === sDiscardDraft) {
							var discardDraftPromise = fnDiscardDraft(sMode).then(fnOnDiscardOrKeepDraftConfirmed);
							discardDraftPromise.catch(fnOnDiscardOrKeepDraftCancel);
						} else if (sAction === sCancel) {
							fnOnDiscardOrKeepDraftCancel();
						}
					}
				});
			}

			function fnDiscardDraft(sMode){
				var oTransactionController = oTemplateContract.oAppComponent.getTransactionController();
				var oDraftController = oTransactionController.getDraftController();
				var oApplicationProxy = oTemplateContract.oApplicationProxy;
				var oBindingContextOfRootObject = oApplicationProxy.getContextForPath(getRootObjectPath());
				var oCurrentIdentity = oTemplateContract.oNavigationControllerProxy.getCurrentIdentity();
				var oBackNavigationPromise = (sMode === "LeaveApp"  && oTemplateContract.oNavigationControllerProxy.getSpecialDraftCancelOptionPromise(oBindingContextOfRootObject)) || Promise.resolve();
				var oDiscardPromise = oBackNavigationPromise.then(function(oBackNavigationOption){
					return	CRUDHelper.discardDraft(oDraftController, oTransactionController, oApplicationProxy, oBindingContextOfRootObject).then(function(){
						oTemplateContract.oNavigationControllerProxy.setBackNavigationOption(oBackNavigationOption);
						oTemplateContract.oViewDependencyHelper.setRootPageToDirty();
						oTemplateContract.oViewDependencyHelper.unbindChildrenUsingTreeNode(oCurrentIdentity.treeNode);
						// Draft discard is a kind of cross navigation -> invalidate paginator info
						oApplicationProxy.invalidatePaginatorInfo();
					});
				});
				oTemplateContract.oBusyHelper.setBusy(oDiscardPromise);
				return oDiscardPromise;				
			}
			
			function fnPerformAfterDiscardOrKeepDraftImpl(fnPositive, fnNegative, sMode, bIsTechnical) {
				var sEnableDiscardDraftConfirmation = oTemplateContract.oNavigationControllerProxy.isDiscardDraftConfirmationNeeded();
				var bNeedsPopup = ((sEnableDiscardDraftConfirmation === "always" && sMode.startsWith("Leave")) || (sEnableDiscardDraftConfirmation === "restricted" && sMode === "LeavePage")) && isObjectEditable();
				if (bNeedsPopup){ 
					fnDiscardOrKeepDraftConfirmation(fnPositive, fnNegative, sMode);
				} else {
					fnPositive();
				}
			}

			function isObjectEditable(){
				return oTemplateContract.oApplicationProxy.checkIfObjectIsADraftInstance(getRootObjectPath());
			}

			function getRootObjectPath(){
				var oCurrentIdentity = oTemplateContract.oNavigationControllerProxy.getCurrentIdentity();
				var oAncestralNode = oTemplateContract.oApplicationProxy.getAncestralNode(oCurrentIdentity.treeNode,1);
				var sPath = oAncestralNode.getPath(3,oCurrentIdentity.keys);
				return sPath;
			}

			// Parameter sMode has same possible values as fnProcessDataLossOrDraftDiscardConfirmation in CommonUtils
			function fnPerformAfterDiscardOrKeepDraft(fnProcessFunction, fnCancelFunction, sMode, bNoBusyCheck, bIsTechnical) {
				var oRet = new Promise(function(fnResolve, fnReject){
					var fnPositive = function(){
						var oRet = fnProcessFunction();
						fnResolve(oRet);
					};
					var fnNegative = function(){
						fnCancelFunction();
						fnReject();
					};
					if (bNoBusyCheck){
						fnPerformAfterDiscardOrKeepDraftImpl(fnPositive, fnNegative, sMode, bIsTechnical);
					} else {
						oTemplateContract.oApplicationProxy.performAfterSideEffectExecution(fnPerformAfterDiscardOrKeepDraftImpl.bind(null, fnPositive, fnNegative, sMode, bIsTechnical), true);
					}
				});
				return oRet;
			}
			
			// public instance methods
			return {
				discardDraft: fnDiscardDraft,
				performAfterDiscardOrKeepDraft: fnPerformAfterDiscardOrKeepDraft
			};
		}

		return BaseObject.extend("sap.suite.ui.generic.template.lib.PageLeaveHandler", {
			constructor: function(oTemplateContract) {
				extend(this, getMethods(oTemplateContract));
			}
		});
	});
