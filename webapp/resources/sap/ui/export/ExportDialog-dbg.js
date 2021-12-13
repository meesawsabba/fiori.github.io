/*!
 * SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */

/**
 * Export progress dialog
 * @private
 */
sap.ui.define(['sap/ui/core/library', 'sap/m/library', 'sap/m/Dialog', 'sap/m/Button', 'sap/m/ProgressIndicator', 'sap/m/Text', 'sap/m/MessageBox', 'sap/ui/core/format/NumberFormat'],
		function(coreLibrary, MLibrary, Dialog, Button, ProgressIndicator, Text, MessageBox, NumberFormat) {
	'use strict';

	var ValueState = coreLibrary.ValueState;

	var DialogType = MLibrary.DialogType;

	/* Async call to resource bundle */
	var oResourceBundlePromise = sap.ui.getCore().getLibraryResourceBundle("sap.ui.export", true);

	/**
	 * The method returns a new Promise that results in a new
	 * progress dialog.
	 *
	 * @returns {Promise} - Promise for progress dialog
	 */
	function createProgressDialog() {
		return new Promise(function(fnResolve, fnReject) {
			var dialog;

			oResourceBundlePromise.then(function(oResourceBundleResolve) {
				var cancelButton = new Button({
					text : oResourceBundleResolve.getText("CANCEL_BUTTON"),
					press : function() {
						if (dialog && dialog.oncancel) {
							dialog.oncancel();
						}
						dialog.finish();
					}
				});

				var progressIndicator = new ProgressIndicator({
					displayAnimation: false,
					displayValue: '0 / 0',
					showValue : true,
					height : "0.75rem",
					state: ValueState.Information
				});
				progressIndicator.addStyleClass("sapUiMediumMarginTop");

				var oMessage = new Text({text : oResourceBundleResolve.getText("PROGRESS_FETCHING_MSG")});
				dialog = new Dialog({
					title : oResourceBundleResolve.getText("PROGRESS_TITLE"),
					type : DialogType.Message,
					contentWidth : "500px",
					content : [
						oMessage,
						progressIndicator
					],
					endButton : cancelButton,
					ariaLabelledBy: [oMessage]
				});

				dialog.updateStatus = function(iFetched, iTotal) {
					var iPercentage;

					if (!isNaN(iFetched) & !isNaN(iTotal)) {
						iPercentage = iFetched / iTotal * 100;
					}

					/* Update status text to reflect the current step (bundle instead of fetching data) */
					if (iPercentage >= 100) {
						cancelButton.setEnabled(false);
						oMessage.setText(oResourceBundleResolve.getText("PROGRESS_BUNDLE_MSG"));
					}

					progressIndicator.setPercentValue(iPercentage);

					/* If count was not provided, the export will automatically
					 * try to fetch until the maximum amount of rows per data sheet
					 */
					if (isNaN(iTotal) || iTotal <= 0 || iTotal >= 1048575) {
						iTotal = '\u221E';
					}

					if (!isNaN(iFetched)) {
						progressIndicator.setDisplayValue('' + iFetched + ' / ' + iTotal);
					}
				};

				dialog.finish = function() {
					dialog.close();
					dialog.destroy();
				};

				fnResolve(dialog);
			});
		});
	}

	/**
	 * Shows a warning dialog that can show several warning messages, either alone or combined.
	 *
	 * @param {Object} mParams Configuration of the warning dialog
	 * @param {number} mParams.rows Amount of rows that will be exported
	 * @param {number} mParams.columns Amount of columns that will be exported
	 * @param {boolean} mParams.sizeLimit Indicates whether the size limit warning needs to be shown
	 * @param {boolean} mParams.cutOff Indicates whether the cut off message needs to be shown
	 * @returns {Promise} Promise that gets resolved when the user wants to export, regardless of the warning
	 */
	function showWarningDialog(mParams) {
		return new Promise(function(fnResolve, fnReject) {

			oResourceBundlePromise.then(function(oResourceBundleResolve) {
				var bContinue, oWarningDialog, oWarningText, sWarningText, oNumberFormat, sRowsFormatted;

				oNumberFormat = NumberFormat.getIntegerInstance({groupingEnabled: true});
				bContinue = false;
				sWarningText = '';

				if (!mParams.rows) {
					sWarningText = oResourceBundleResolve.getText("NO_COUNT_WARNING_MSG");
				} else {
					sRowsFormatted = oNumberFormat.format(mParams.rows);

					if (mParams.sizeLimit) {
						sWarningText = oResourceBundleResolve.getText("SIZE_WARNING_MSG", [sRowsFormatted, mParams.columns]);
					}

					if (mParams.cutOff) {
						sWarningText += sWarningText === '' ? '' : '\n\n'; // Add line breaks if there is already a message
						sWarningText += oResourceBundleResolve.getText("MSG_WARNING_CUT_OFF", [sRowsFormatted]);
					}
				}

				oWarningText = new Text({
					text: sWarningText
				});
				oWarningDialog = new Dialog({
					title: oResourceBundleResolve.getText('PROGRESS_TITLE'),
					type: DialogType.Message,
					state: ValueState.Warning,
					content: oWarningText,
					ariaLabelledBy: oWarningText,
					beginButton: new Button({
						text: oResourceBundleResolve.getText("CANCEL_BUTTON"),
						press: function () {
							oWarningDialog.close();
						}
					}),
					endButton: new Button({
						text: oResourceBundleResolve.getText("EXPORT_BUTTON"),
						press: function () {
							bContinue = true;
							oWarningDialog.close();
						}
					}),
					afterClose: function() {
						oWarningDialog.destroy();
						bContinue ? fnResolve() : fnReject();
					}
				});
				oWarningDialog.open();
			});

		});
	}

	/**
	 * Displays the given error message to the user.
	 *
	 * @param {string} sMessage Error message that will be shown in the error dialog
	 */
	function showErrorMessage(sMessage) {
		oResourceBundlePromise.then(function(oResourceBundleResolve) {
			var errorMessage = sMessage || oResourceBundleResolve.getText('PROGRESS_ERROR_DEFAULT');

			// Replace technical error message in case of "out of memory"
			if (sMessage.toLowerCase().indexOf('invalid string length') > -1) {
				errorMessage = oResourceBundleResolve.getText('MSG_ERROR_OUT_OF_MEMORY');
			}

			MessageBox.error(oResourceBundleResolve.getText("PROGRESS_ERROR_MSG") + "\n\n" + errorMessage, {
				title : oResourceBundleResolve.getText("PROGRESS_ERROR_TITLE")
			});
		});
	}

	return {
		getProgressDialog : createProgressDialog,
		showErrorMessage: showErrorMessage,
		showWarningDialog: showWarningDialog
	};

}, /* bExport= */true);
