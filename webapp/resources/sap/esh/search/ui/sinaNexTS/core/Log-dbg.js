/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

/* global Proxy, Reflect, Symbol */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Log = exports.Severity = void 0;
    var Severity;
    (function (Severity) {
        Severity[Severity["ERROR"] = 1] = "ERROR";
        Severity[Severity["WARN"] = 2] = "WARN";
        Severity[Severity["INFO"] = 3] = "INFO";
        Severity[Severity["DEBUG"] = 4] = "DEBUG";
    })(Severity = exports.Severity || (exports.Severity = {}));
    var Log = /** @class */ (function () {
        function Log(name) {
            if (name === void 0) { name = "default-log"; }
            this.name = name;
        }
        Log.prototype.debug = function (messageOrError) {
            this.printMessageOrError("DEBUG", messageOrError);
        };
        Log.prototype.info = function (messageOrError) {
            this.printMessageOrError("INFO", messageOrError);
        };
        Log.prototype.warn = function (messageOrError) {
            this.printMessageOrError("WARN", messageOrError);
        };
        Log.prototype.error = function (messageOrError) {
            this.printMessageOrError("ERROR", messageOrError);
        };
        Log.prototype.printMessageOrError = function (severity, messageOrError) {
            if (messageOrError instanceof Error) {
                if (messageOrError.stack) {
                    this.printMessage(severity, messageOrError.stack);
                }
                else {
                    this.printMessage(severity, messageOrError + "");
                }
            }
            else {
                this.printMessage(severity, messageOrError);
            }
        };
        Log.prototype.printMessage = function (severity, text) {
            var num = Severity[severity];
            var msg = "[" + this.name + "]: " + text;
            if (num <= Log.level) {
                switch (num) {
                    case Severity.DEBUG:
                        {
                            if (typeof Log.persistency.debug === "function") {
                                Log.persistency.debug(msg);
                                return;
                            }
                        }
                        break;
                    case Severity.INFO:
                        {
                            if (typeof Log.persistency.info === "function") {
                                Log.persistency.info(msg);
                                return;
                            }
                        }
                        break;
                    case Severity.WARN:
                        {
                            if (typeof Log.persistency.warn === "function") {
                                Log.persistency.warn(msg);
                                return;
                            }
                        }
                        break;
                    case Severity.ERROR: {
                        if (typeof Log.persistency.error === "function") {
                            Log.persistency.error(msg);
                            return;
                        }
                    }
                }
                console.log(msg);
            }
        };
        Log.level = Severity.ERROR;
        Log.persistency = console;
        return Log;
    }());
    exports.Log = Log;
});
})();