/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

// Static functions for Fiori Message Handling
sap.ui.define(
	[
		"sap/m/MessageToast",
		"sap/m/MessageItem",
		"sap/m/MessageView",
		"sap/m/Button",
		"sap/m/Dialog",
		"sap/ui/core/library",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/core/message/Message",
		"sap/ui/core/IconPool",
		"sap/ui/model/json/JSONModel"
	],
	function(MessageToast, MessageItem, MessageView, Button, Dialog, CoreLib, Filter, FilterOperator, Message, IconPool, JSONModel) {
		"use strict";
		var MessageType = CoreLib.MessageType;
		var that = this;

		function fnFormatTechnicalDetails() {
			var sPreviousGroupName;
			// Insert technical detail if it exists
			function insertDetail(oProperty) {
				return oProperty.property
					? "( ${" +
							oProperty.property +
							'} ? ("<p>' +
							oProperty.property.substr(
								Math.max(oProperty.property.lastIndexOf("/"), oProperty.property.lastIndexOf(".")) + 1
							) +
							' : " + ' +
							"${" +
							oProperty.property +
							'} + "</p>") : "" )'
					: "";
			}
			// Insert groupname if it exists
			function insertGroupName(oProperty) {
				var sHTML = "";
				if (oProperty.groupName && oProperty.property && oProperty.groupName !== sPreviousGroupName) {
					sHTML += "( ${" + oProperty.property + '} ? "<br><h3>' + oProperty.groupName + '</h3>" : "" ) + ';
					sPreviousGroupName = oProperty.groupName;
				}
				return sHTML;
			}

			// List of technical details to be shown
			function getPaths() {
				var sTD = "technicalDetails"; // name of property in message model data for technical details
				return [
					{ "groupName": "", "property": sTD + "/status" },
					{ "groupName": "", "property": sTD + "/statusText" },
					{ "groupName": "Application", "property": sTD + "/error/@SAP__common.Application/ComponentId" },
					{ "groupName": "Application", "property": sTD + "/error/@SAP__common.Application/ServiceId" },
					{ "groupName": "Application", "property": sTD + "/error/@SAP__common.Application/ServiceRepository" },
					{ "groupName": "Application", "property": sTD + "/error/@SAP__common.Application/ServiceVersion" },
					{ "groupName": "ErrorResolution", "property": sTD + "/error/@SAP__common.ErrorResolution/Analysis" },
					{ "groupName": "ErrorResolution", "property": sTD + "/error/@SAP__common.ErrorResolution/Note" },
					{ "groupName": "ErrorResolution", "property": sTD + "/error/@SAP__common.ErrorResolution/DetailedNote" },
					{ "groupName": "ErrorResolution", "property": sTD + "/error/@SAP__common.ExceptionCategory" },
					{ "groupName": "ErrorResolution", "property": sTD + "/error/@SAP__common.TimeStamp" },
					{ "groupName": "ErrorResolution", "property": sTD + "/error/@SAP__common.TransactionId" },
					{ "groupName": "Messages", "property": sTD + "/error/code" },
					{ "groupName": "Messages", "property": sTD + "/error/message" }
				];
			}
			var sHTML = "Object.keys(" + "${technicalDetails}" + ').length > 0 ? "<h2>Technical Details</h2>" : "" ';
			getPaths().forEach(function(oProperty) {
				sHTML = sHTML + insertGroupName(oProperty) + "" + insertDetail(oProperty) + " + ";
			});
			return sHTML;
		}
		function fnFormatDescription() {
			var sHTML = "(${" + 'description} ? ("<h2>Description</h2>" + ${' + 'description}) : "")';
			return sHTML;
		}
		/**
		 * Calculates the highest priority message type(Error/Warning/Success/Information) from the available messages.

		 * @function
		 * @name sap.fe.core.actions.messageHandling.fnGetHighestMessagePriority
		 * @memberof sap.fe.core.actions.messageHandling
		 * @param {Array} [aMessages] Messages list
		 * @returns {string} Highest priority message from the available messages
		 * @private
		 * @ui5-restricted
		 */
		function fnGetHighestMessagePriority(aMessages) {
			var sMessagePriority = MessageType.None,
				iLength = aMessages.length,
				oMessageCount = { Error: 0, Warning: 0, Success: 0, Information: 0 };

			for (var i = 0; i < iLength; i++) {
				++oMessageCount[aMessages[i].getType()];
			}
			if (oMessageCount[MessageType.Error] > 0) {
				sMessagePriority = MessageType.Error;
			} else if (oMessageCount[MessageType.Warning] > 0) {
				sMessagePriority = MessageType.Warning;
			} else if (oMessageCount[MessageType.Success] > 0) {
				sMessagePriority = MessageType.Success;
			} else if (oMessageCount[MessageType.Information] > 0) {
				sMessagePriority = MessageType.Information;
			}
			return sMessagePriority;
		}
		// function which modify e-Tag messages only.
		// returns : true, if any e-Tag message is modified, otherwise false.
		function fnModifyETagMessagesOnly(oMessageManager, oResourceBundle) {
			var aMessages = oMessageManager.getMessageModel().getObject("/");
			var bMessagesModified = false;
			var sEtagMessage = "";
			aMessages.forEach(function(oMessage, i) {
				var oTechnicalDetails = oMessage.getTechnicalDetails();
				if (oTechnicalDetails && oTechnicalDetails.httpStatus === 412) {
					sEtagMessage = sEtagMessage || oResourceBundle.getText("C_APP_COMPONENT_SAPFE_ETAG_TECHNICAL_ISSUES");
					oMessageManager.removeMessages(aMessages[i]);
					oMessage.setMessage(sEtagMessage);
					oMessage.target = "";
					oMessageManager.addMessages(oMessage);
					bMessagesModified = true;
				}
			});
			return bMessagesModified;
		}
		// Dialog close Handling
		function dialogCloseHandler() {
			that.oDialog.close();
			that.oBackButton.setVisible(false);
			removeUnboundTransitionMessages();
		}
		/**
		 * Shows all unbound (including technical) messages and removes the ones which are transient.
		 *
		 * @function
		 * @static
		 * @name sap.fe.core.actions.messageHandling.showUnboundMessages
		 * @memberof sap.fe.core.actions.messageHandling
		 * @param {Array} aCustomMessages Array of custom messages given by the user to be displayed along with the other unbound messages.
		 * @param {sap.ui.model.odata.v4.Context} oContext Context of the document to be refreshed or updated
		 * @param {boolean} bHasEtagMessage The value of the variable is set to 'true' if any ETag message is present.
		 * @param {boolean} bShowBoundTransition Also show the bound transition messages
		 * @returns {Promise} Promise resolves when the message toast disappears or when the user closes the popup
		 * @private
		 * @ui5-restricted
		 */
		function showUnboundMessages(aCustomMessages, oContext, bHasEtagMessage, bShowBoundTransition) {
			var aUnboundMessages = getMessages(),
				oMessageManager = sap.ui.getCore().getMessageManager(),
				sHighestPriority,
				sHighestPriorityText,
				aFilters = [
					new Filter({ path: "code", operator: FilterOperator.NE, value1: null }),
					new Filter({ path: "persistent", operator: FilterOperator.NE, value1: false })
				],
				showMessageDialog = false;

			if (bShowBoundTransition) {
				aUnboundMessages.push.apply(aUnboundMessages, getMessages(true, true));
				// we only want to show bound transition messages not bound state messages hence add a filter for the same
				aFilters.push(new Filter({ path: "persistent", operator: FilterOperator.EQ, value1: true }));
				var fnCheckControlIdInDialog = function(aControlIds) {
					var index = Infinity,
						oControl = sap.ui.getCore().byId(aControlIds[0]),
						errorFieldControl = sap.ui.getCore().byId(aControlIds[0]);
					while (oControl) {
						var fieldRankinDialog =
							oControl instanceof Dialog
								? errorFieldControl
										.getParent()
										.findElements(true)
										.indexOf(errorFieldControl)
								: Infinity;
						if (oControl instanceof Dialog) {
							if (index > fieldRankinDialog) {
								index = fieldRankinDialog;
								// Set the focus to the dialog's control
								errorFieldControl.focus();
							}
							// messages with target inside sap.m.Dialog should not bring up the message dialog
							return false;
						}
						oControl = oControl.getParent();
					}
					return true;
				};
				aFilters.push(
					new Filter({
						path: "controlIds",
						test: fnCheckControlIdInDialog,
						caseSensitive: true
					})
				);
			} else {
				// only unbound messages have to be shown so add filter accordingly
				aFilters.push(new Filter({ path: "target", operator: FilterOperator.EQ, value1: "" }));
			}
			if (aCustomMessages && aCustomMessages.length) {
				aCustomMessages.forEach(function(oMessage) {
					var messageCode = oMessage.code ? oMessage.code : "";
					oMessageManager.addMessages(
						new Message({
							message: oMessage.text,
							type: oMessage.type,
							target: "",
							persistent: true,
							code: messageCode
						})
					);
					//The target and persistent properties of the message are hardcoded as "" and true because the function deals with only unbound messages.
				});
			}
			var oListBinding = oMessageManager.getMessageModel().bindList("/", undefined, undefined, aFilters),
				aCurrentContexts = oListBinding.getCurrentContexts(),
				oMessageDialogModel = new JSONModel();
			if (aCurrentContexts && aCurrentContexts.length > 0) {
				// Don't show dialog incase there are no errors to show
				showMessageDialog = true;
				// As fitering has already happened here hence
				// using the message model again for the message dialog view and then filtering on that binding again is unnecessary.
				// So we create new json model to use for the message dialog view.
				var aMessages = [];
				aCurrentContexts.forEach(function(oContext) {
					aMessages.push(oContext.getObject());
				});
				oMessageDialogModel.setData(aMessages);
			}
			if (aUnboundMessages.length === 0 && !aCustomMessages && !bHasEtagMessage) {
				// Don't show the popup if there are no transient messages
				return Promise.resolve(true);
			} else if (aUnboundMessages.length === 1 && aUnboundMessages[0].getType() === MessageType.Success && !aCustomMessages) {
				return new Promise(function(resolve, reject) {
					MessageToast.show(aUnboundMessages[0].message);
					oMessageManager.removeMessages(aUnboundMessages);
					resolve();
				});
			} else if (showMessageDialog) {
				that.aResolveFunctions = that.aResolveFunctions || [];
				return new Promise(function(resolve, reject) {
					that.aResolveFunctions.push(resolve);
					sap.ui
						.getCore()
						.getLibraryResourceBundle("sap.fe.core", true)
						.then(function(oResourceBundle) {
							that.oMessageTemplate =
								that.oMessageTemplate ||
								new MessageItem({
									counter: "{counter}",
									title: "{message}",
									subtitle: "{additionalText}",
									longtextUrl: "{descriptionUrl}",
									type: "{type}",
									description:
										"{= ${" +
										"description} || ${technicalDetails} ? " +
										'"<html><body>" + ' +
										fnFormatDescription() +
										" + " +
										fnFormatTechnicalDetails() +
										'"</body></html>"' +
										' : "" }',
									markupDescription: true
								});
							that.oMessageView =
								that.oMessageView ||
								new MessageView({
									showDetailsPageHeader: false,
									itemSelect: function() {
										that.oBackButton.setVisible(true);
									},
									items: {
										path: "/",
										template: that.oMessageTemplate
									}
								});
							that.oBackButton =
								that.oBackButton ||
								new Button({
									icon: IconPool.getIconURI("nav-back"),
									visible: false,
									press: function() {
										that.oMessageView.navigateBack();
										this.setVisible(false);
									}
								});
							that.oMessageView.setModel(oMessageDialogModel);
							that.oDialog =
								that.oDialog ||
								new Dialog({
									resizable: true,
									content: that.oMessageView,
									endButton: new Button({
										press: function() {
											dialogCloseHandler();
											// also remove bound transition messages if we were showing them
											if (bShowBoundTransition) {
												removeBoundTransitionMessages();
											}
										},
										text: oResourceBundle.getText("C_COMMON_SAPFE_CLOSE")
									}),
									customHeader: new sap.m.Bar({
										contentMiddle: [
											new sap.m.Text({
												text: oResourceBundle.getText("C_MESSAGE_HANDLING_SAPFE_ERROR_MESSAGES_PAGE_TITLE")
											})
										],
										contentLeft: [that.oBackButton]
									}),
									contentWidth: "37.5em",
									contentHeight: "21.5em",
									verticalScrolling: false,
									afterClose: function(oEvent) {
										for (var i = 0; i < that.aResolveFunctions.length; i++) {
											that.aResolveFunctions[i].call();
										}
										that.aResolveFunctions = [];
									}
								});

							// Update proper ETag Mismatch error
							var bHasEtagMessage = fnModifyETagMessagesOnly(oMessageManager, oResourceBundle);
							if (bHasEtagMessage) {
								sap.ui.require(["sap/m/ButtonType"], function(ButtonType) {
									that.oDialog.setBeginButton(
										new Button({
											press: function() {
												dialogCloseHandler();
												if (oContext.hasPendingChanges()) {
													oContext.getBinding().resetChanges();
												}
												oContext.refresh();
											},
											text: oResourceBundle.getText("C_COMMON_SAPFE_REFRESH"),
											type: ButtonType.Emphasized
										})
									);
								});
							} else {
								that.oDialog.destroyBeginButton();
							}
							sHighestPriority = fnGetHighestMessagePriority(that.oMessageView.getItems());
							sHighestPriorityText = getTranslatedTextForMessageDialog(sHighestPriority);
							that.oDialog.setState(sHighestPriority);
							that.oDialog
								.getCustomHeader()
								.getContentMiddle()[0]
								.setText(sHighestPriorityText);
							that.oMessageView.navigateBack();
							that.oDialog.open();
						})
						.catch(reject);
				});
			} else {
				return Promise.resolve(true);
			}
		}

		function getTranslatedTextForMessageDialog(sHighestPriority) {
			var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.fe.core");
			switch (sHighestPriority) {
				case "Error":
					return oResourceBundle.getText("C_COMMON_SAPFE_ERROR_MESSAGES_PAGE_TITLE_ERROR");
				case "Information":
					return oResourceBundle.getText("C_MESSAGE_HANDLING_SAPFE_ERROR_MESSAGES_PAGE_TITLE_INFO");
				case "Success":
					return oResourceBundle.getText("C_MESSAGE_HANDLING_SAPFE_ERROR_MESSAGES_PAGE_TITLE_SUCCESS");
				case "Warning":
					return oResourceBundle.getText("C_MESSAGE_HANDLING_SAPFE_ERROR_MESSAGES_PAGE_TITLE_WARNING");
				default:
					return oResourceBundle.getText("C_MESSAGE_HANDLING_SAPFE_ERROR_MESSAGES_PAGE_TITLE");
			}
		}

		function removeUnboundTransitionMessages() {
			removeTransitionMessages(false);
		}

		function removeBoundTransitionMessages() {
			removeTransitionMessages(true);
		}

		function getMessages(bBoundMessages, bTransitionOnly) {
			var oMessageManager = sap.ui.getCore().getMessageManager(),
				oMessageModel = oMessageManager.getMessageModel(),
				aMessages = oMessageModel.getObject("/"),
				aTransitionMessages = [];

			for (var i = 0; i < aMessages.length; i++) {
				if (
					(!bTransitionOnly || aMessages[i].persistent) &&
					((bBoundMessages && aMessages[i].target !== "") ||
						(!bBoundMessages && (!aMessages[i].target || aMessages[i].target === ""))) &&
					aMessages[i].code
				) {
					aTransitionMessages.push(aMessages[i]);
				}
			}

			return aTransitionMessages;
		}

		function removeTransitionMessages(bBoundMessages) {
			var aMessagesToBeDeleted = getMessages(bBoundMessages, true);

			if (aMessagesToBeDeleted.length > 0) {
				sap.ui
					.getCore()
					.getMessageManager()
					.removeMessages(aMessagesToBeDeleted);
			}
		}

		/**
		 * Static functions for Fiori Message Handling
		 *
		 * @namespace
		 * @alias sap.fe.core.actions.messageHandling
		 * @private
		 * @experimental This module is only for experimental use! <br/><b>This is only a POC and maybe deleted</b>
		 * @since 1.56.0
		 */
		var messageHandling = {
			getMessages: getMessages,
			showUnboundMessages: showUnboundMessages,
			removeUnboundTransitionMessages: removeUnboundTransitionMessages,
			removeBoundTransitionMessages: removeBoundTransitionMessages,
			modifyETagMessagesOnly: fnModifyETagMessagesOnly
		};
		return messageHandling;
	}
);
