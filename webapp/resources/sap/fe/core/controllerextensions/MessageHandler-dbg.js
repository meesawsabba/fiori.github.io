/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

sap.ui.define(["sap/ui/core/mvc/ControllerExtension", "sap/ui/core/mvc/OverrideExecution", "sap/fe/core/actions/messageHandling"], function(
	ControllerExtension,
	OverrideExecution,
	messageHandling
) {
	"use strict";

	/**
	 * @class A controller extension offering message handling.
	 *
	 * @name sap.fe.core.controllerextensions.MessageHandler
	 * @hideconstructor
	 * @public
	 * @experimental As of version 1.90.0
	 * @since 1.90.0
	 */

	var MessageHandler = ControllerExtension.extend("sap.fe.core.controllerextensions.MessageHandler", {
		metadata: {
			methods: {
				showMessageDialog: { "public": true, "final": true },
				getShowBoundMessagesInMessageDialog: { "public": false, "final": false, overrideExecution: OverrideExecution.Instead }
			}
		},

		/**
		 * @private
		 * @name sap.fe.core.controllerextensions.MessageHandler.getMetadata
		 * @function
		 */
		/**
		 * @private
		 * @name sap.fe.core.controllerextensions.MessageHandler.extend
		 * @function
		 */
		/**
		 * Determines whether or not bound messages are shown in the message dialog.
		 *
		 * This function is meant to be individually overridden by consuming controllers, but not to be called directly.
		 * The override execution is: {@link sap.ui.core.mvc.OverrideExecution.Instead}.
		 *
		 * If the bound messages are shown to the user with a different control like the (TODO:Link) MessageButton
		 * this method has to be overridden.
		 *
		 * @returns {boolean} Determines whether or not bound messages are shown in the message dialog.
		 * @private
		 */
		getShowBoundMessagesInMessageDialog: function() {
			return true;
		},
		// eslint-disable-next-line jsdoc/require-param
		/**
		 * Shows a message dialog with transition messages if there are any.
		 * The message dialog is shown as a modal dialog. Once the user confirms the dialog, all transition messages
		 * are removed from the message model. If there is more than one message, a list of messages is shown. The user
		 * can filter on message types and can display details as well as the long text. If there is one message,
		 * the dialog immediately shows the details of the message. If there is just one success message, a message
		 * toast is shown instead.
		 * @returns {Promise} A promise that is resolved once the user closes the dialog. If there are no messages
		 * to be shown, the promise is resolved immediately
		 * @alias sap.fe.core.controllerextensions.MessageHandler#showMessageDialog
		 * @public
		 * @experimental As of version 1.90.0
		 * @since 1.90.0
		 */
		showMessageDialog: function(mParameters) {
			var customMessages = mParameters && mParameters.customMessages ? mParameters.customMessages : undefined,
				oOPInternalBindingContext = this.base.getView().getBindingContext("internal");
			// set isActionParameterDialog open so that it can be used in the controller extension to decide whether message dialog should open or not
			if (mParameters && mParameters.isActionParameterDialogOpen && oOPInternalBindingContext) {
				oOPInternalBindingContext.setProperty("isActionParameterDialogOpen", true);
			}
			var bShowBoundMessages = this.getShowBoundMessagesInMessageDialog();
			var oBindingContext = mParameters && mParameters.context ? mParameters.context : this.getView().getBindingContext();
			var bEtagMessage = mParameters && mParameters.bHasEtagMessage;
			// reset  isActionParameterDialogOpen
			// cannot do this operations.js since it is not aware of the view
			if (oOPInternalBindingContext) {
				oOPInternalBindingContext.setProperty("isActionParameterDialogOpen", false);
			}
			return new Promise(function(resolve, reject) {
				// we have to set a timeout to be able to access the most recent messages
				setTimeout(function() {
					// TODO: great API - will be changed later
					messageHandling
						.showUnboundMessages(customMessages, oBindingContext, bEtagMessage, bShowBoundMessages)
						.then(resolve)
						.catch(reject);
				}, 0);
			});
		},

		/**
		 * You can remove the existing transition message from the message model with this method.
		 * With every user interaction that causes server communication (like clicking on an action, changing data),
		 * this method removes the existing transition messages from the message model.
		 * @param {boolean} keepBoundMessage Checks if the bound transition messages are not to be removed
		 *
		 * @alias sap.fe.core.controllerextensions.MessageHandler#removesTransitionMessages
		 * @private
		 */
		removeTransitionMessages: function(keepBoundMessage) {
			if (!keepBoundMessage) {
				messageHandling.removeBoundTransitionMessages();
			}
			messageHandling.removeUnboundTransitionMessages();
		}
	});
	return MessageHandler;
});
