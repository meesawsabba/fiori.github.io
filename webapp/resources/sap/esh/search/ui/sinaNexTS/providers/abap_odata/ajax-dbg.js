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
sap.ui.define(["require", "exports", "../../core/ajax", "./ajaxTemplates"], function (require, exports, ajax_1, ajaxTemplates_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createAjaxClient = void 0;
    var _removeActAsQueryPart = function (node) {
        if (node.SubFilters !== undefined) {
            // not a leaf
            delete node.ActAsQueryPart;
            for (var i = 0; i < node.SubFilters.length; i++) {
                this._removeActAsQueryPart(node.SubFilters[i]);
            }
        }
    };
    function createAjaxClient(properties) {
        var defaults = {
            csrf: true,
            requestNormalization: function (payload) {
                if (payload === null) {
                    return "";
                }
                if (ajaxTemplates_1.isNavigationEvent(payload)) {
                    return {
                        NotToRecord: true,
                    };
                }
                if (ajaxTemplates_1.isSearchRequest(payload) ||
                    ajaxTemplates_1.isNlqSearchRequest(payload) ||
                    ajaxTemplates_1.isChartRequest(payload) ||
                    ajaxTemplates_1.isValueHelperRequest(payload) ||
                    ajaxTemplates_1.isSuggestionRequest(payload) ||
                    ajaxTemplates_1.isObjectSuggestionRequest(payload)) {
                    delete payload.d.QueryOptions.ClientSessionID;
                    delete payload.d.QueryOptions.ClientCallTimestamp;
                    delete payload.d.QueryOptions.ClientServiceName;
                    delete payload.d.QueryOptions.ClientLastExecutionID;
                    // insert "ExcludedDataSources" in payload
                    // properties' ordering is important in stringified payload
                    // "ExcludedDataSources" should follow "DataSources"
                    // find "DataSources":[...], and insert "ExcludedDataSources" after
                    var payloadString = JSON.stringify(payload); // object -> string
                    // eslint-disable-next-line quotes
                    var headString = '"DataSources":[';
                    // eslint-disable-next-line quotes
                    var endString = "]";
                    var headIndex = payloadString.indexOf(headString);
                    var endIndex = headIndex + payloadString.substring(headIndex).indexOf(endString) + endString.length;
                    // eslint-disable-next-line quotes
                    var insertedString = ',"ExcludedDataSources":[]';
                    payloadString = [
                        payloadString.slice(0, endIndex),
                        insertedString,
                        payloadString.slice(endIndex),
                    ].join("");
                    payload = JSON.parse(payloadString); // string -> object
                    if (payload.d.Filter &&
                        (ajaxTemplates_1.isSearchRequest(payload) ||
                            ajaxTemplates_1.isNlqSearchRequest(payload) ||
                            ajaxTemplates_1.isChartRequest(payload) ||
                            ajaxTemplates_1.isValueHelperRequest(payload) ||
                            ajaxTemplates_1.isSuggestionRequest(payload) ||
                            ajaxTemplates_1.isObjectSuggestionRequest(payload))) {
                        _removeActAsQueryPart(payload.d.Filter);
                    }
                }
                return payload;
            },
            //csrfByPassCache: true
        };
        properties = Object.assign({}, defaults, properties);
        var client = new ajax_1.Client(properties);
        return client;
    }
    exports.createAjaxClient = createAjaxClient;
});
})();