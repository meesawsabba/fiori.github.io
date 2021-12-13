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
    exports.NlqParser = void 0;
    var NlqParser = /** @class */ (function () {
        function NlqParser(provider) {
            this.provider = provider;
            this.sina = provider.sina;
        }
        NlqParser.prototype.getActiveResult = function (results) {
            for (var i = 0; i < results.length; ++i) {
                var result = results[i];
                if (result.IsCurrentQuery) {
                    return result;
                }
            }
            return null;
        };
        NlqParser.prototype.parse = function (data) {
            // default result
            var nlqResult = {
                success: false,
                description: "",
            };
            // check input parameters
            if (!data || !data.ResultList || !data.ResultList.NLQQueries || !data.ResultList.NLQQueries.results) {
                return nlqResult;
            }
            // get active result
            var results = data.ResultList.NLQQueries.results;
            var result = this.getActiveResult(results);
            if (!result) {
                return nlqResult;
            }
            // set return parameters
            nlqResult.success = true;
            nlqResult.description = result.Description;
            return nlqResult;
        };
        return NlqParser;
    }());
    exports.NlqParser = NlqParser;
});
})();