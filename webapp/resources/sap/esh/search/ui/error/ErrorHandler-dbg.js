/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
// @ts-check
sap.ui.define(["../i18n", "sap/ui/base/Object", "sap/base/Log", "sap/m/MessageBox", "sap/ui/core/TextDirection"], 
/**
 * @param {sap.ui.base.Object} BaseObject
 * @param {*} Log
 * @param {sap.m.MessageBox} MessageBox
 */
function (i18n, BaseObject, Log, MessageBox, TextDirection) {
    "use strict";
    var ErrorHandler = sap.ui.base.Object.extend("sap.esh.search.ui.error.ErrorHandler", {
        /**
         *
         * @this sap.esh.search.ui.error.ErrorHandler
         */
        constructor: function (properties) {
            properties = properties || {};
            this.searchModel = properties.model;
            this.fnOnError = properties.fnOnError || this.defaultErrorHandler;
        },
        /**
         *
         * @this sap.esh.search.ui.error.ErrorHandler
         */
        _getLoggableError: function (error) {
            var logMessage = error + "";
            if (typeof error.stack !== "undefined") {
                logMessage = error.stack + "\n";
            }
            if (error.previous instanceof Error) {
                logMessage += "Previous error was: " + this._getLoggableError(error.previous) + "\n";
            }
            return logMessage;
        },
        /**
         *
         * @this sap.esh.search.ui.error.ErrorHandler
         */
        _addUI5LogMessage: function (error, title) {
            // add technical details to the log:
            var logMessage = this._getLoggableError(error) + "\n";
            if (this.searchModel && this.searchModel.sinaNext) {
                logMessage += this.searchModel.sinaNext.getDebugInfo() + "\n";
            }
            var _oLogger = Log.getLogger("ErrorHandler");
            _oLogger.error(title, logMessage, "ErrorHandler");
        },
        _openMessageBox: function (title, message, solution, details) {
            MessageBox.error(message + "\n" + solution + "\n" + details, {
                title: title,
                onClose: null,
                styleClass: "",
                initialFocus: null,
                textDirection: TextDirection.Inherit,
            });
        },
        /**
         *
         * @this sap.esh.search.ui.error.ErrorHandler
         */
        onError: function (error) {
            return this.fnOnError(error);
        },
        /**
         *
         * @this sap.esh.search.ui.error.ErrorHandler
         */
        onErrorDeferred: function (error) {
            this.onError(error);
            return Promise.resolve(true);
        },
        /**
         *
         * @this sap.esh.search.ui.error.ErrorHandler
         */
        defaultErrorHandler: function (error) {
            var type = sap.ui.core.MessageType.Error;
            var title = error.name || i18n.getText("searchError");
            var message = error.message || i18n.getText("error.message");
            var solution = error.solution || i18n.getText("error.solution");
            var details = i18n.getText("error.details");
            // Special error handling, should only be necessary if not already done in errors.js:
            switch (error.name) {
                case "TypeError":
                    {
                        message = i18n.getText("error.TypeError.message");
                        solution = i18n.getText("error.TypeError.solution");
                    }
                    break;
                case "URIError":
                    {
                        solution = i18n.getText("error.URIError.solution");
                    }
                    break;
                case "DataSourceAttributeMetadataNotFoundError":
                    {
                        message = i18n.getText("error.sina.DataSourceAttributeMetadataNotFoundError.message");
                        solution = i18n.getText("error.sina.DataSourceAttributeMetadataNotFoundError.solution");
                    }
                    break;
                case "NoValidEnterpriseSearchAPIConfigurationFoundError":
                    {
                        message =
                            i18n.getText("error.sina.NoValidEnterpriseSearchAPIConfigurationFoundError.message") +
                                "\n" +
                                error.message; // add tried providers
                        solution = i18n.getText("error.sina.NoValidEnterpriseSearchAPIConfigurationFoundError.solution");
                    }
                    break;
                case "InBetweenConditionInConsistent": {
                    message = i18n.getText("error.sina.InBetweenConditionInConsistent.description");
                    solution = i18n.getText("error.sina.InBetweenConditionInConsistent.solution");
                }
            }
            if (typeof this.searchModel === "undefined" || this.searchModel === null) {
                // If no searchModel was given only log the error
                // This can happen if an error happened while creating the ui or a searchModel
                this._addUI5LogMessage(error, title);
                // open a messagebox as last resort:
                this._openMessageBox(title, message, solution, details);
                return;
            }
            // show the empty result list
            this.searchModel.setProperty("/boResults", []);
            this.searchModel.setProperty("/origBoResults", []);
            this.searchModel.setProperty("/boCount", 0);
            this.searchModel.setProperty("/nlqSuccess", false);
            this.searchModel.setProperty("/nlqDescription", "");
            this.searchModel.setProperty("/isBusy", false);
            // const stripUi5 = function (text) {
            //     return text.replace(/<(?:.|\n)*?>|[{}]/gm, "");
            // };
            this._addUI5LogMessage(error, title);
            // Create an error description which includes a solution:
            if (solution) {
                message = message + "\n\n" + solution + "\n\n " + details;
            }
            /**
             * @type {sap.esh.search.ui.IUIMessage}
             **/
            var uiMessage = {
                type: type,
                title: title,
                description: message,
            };
            this.searchModel.pushUIMessage(uiMessage);
        },
    });
    return ErrorHandler;
});
