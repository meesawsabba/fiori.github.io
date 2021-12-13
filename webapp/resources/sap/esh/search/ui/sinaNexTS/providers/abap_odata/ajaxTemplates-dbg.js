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
    exports.navigationEvent = exports.isNavigationEvent = exports.objectSuggestionRequest = exports.isObjectSuggestionRequest = exports.suggestionRequest = exports.isSuggestionRequest = exports.valueHelperRequest = exports.isValueHelperRequest = exports.chartRequest = exports.isChartRequest = exports.nlqSearchRequest = exports.isNlqSearchRequest = exports.searchRequest = exports.isSearchRequest = void 0;
    function isSearchRequest(obj) {
        if (typeof obj === "object") {
            var obj2 = obj;
            if (typeof obj2.d === "object") {
                var obj3 = obj2;
                if (typeof obj3.d.QueryOptions === "object") {
                    var QueryOptions = obj3.d.QueryOptions;
                    if (typeof QueryOptions.SearchType === "string" &&
                        QueryOptions.SearchType === "" &&
                        !obj3.d.ActivateNLQ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    exports.isSearchRequest = isSearchRequest;
    exports.searchRequest = {
        d: {
            Filter: {},
            Id: "1",
            QueryOptions: {
                SearchTerms: "",
                Top: 10,
                Skip: 0,
                SearchType: "",
                ClientSessionID: "",
                ClientCallTimestamp: "",
                ClientServiceName: "",
                ClientLastExecutionID: "",
            },
            DataSources: [],
            OrderBy: [],
            ResultList: {
                SearchResults: [
                    {
                        HitAttributes: [],
                        Attributes: [],
                    },
                ],
            },
            ExecutionDetails: [],
            MaxFacetValues: 5,
            Facets: [
                {
                    Values: [],
                },
            ],
        },
    };
    function isNlqSearchRequest(obj) {
        if (typeof obj === "object") {
            var obj2 = obj;
            if (typeof obj2.d === "object") {
                var obj3 = obj2;
                if (typeof obj3.d.QueryOptions === "object") {
                    var QueryOptions = obj3.d.QueryOptions;
                    if (typeof QueryOptions.SearchType === "string" &&
                        QueryOptions.SearchType === "" &&
                        typeof obj3.d.ActivateNLQ === "boolean" &&
                        obj3.d.ActivateNLQ === true) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    exports.isNlqSearchRequest = isNlqSearchRequest;
    exports.nlqSearchRequest = {
        d: {
            Filter: {},
            Id: "1",
            ActivateNLQ: true,
            QueryOptions: {
                SearchTerms: "",
                Top: 10,
                Skip: 0,
                SearchType: "",
                ClientSessionID: "",
                ClientCallTimestamp: "",
                ClientServiceName: "",
                ClientLastExecutionID: "",
            },
            DataSources: [],
            OrderBy: [],
            ResultList: {
                SearchResults: [
                    {
                        HitAttributes: [],
                        Attributes: [],
                    },
                ],
                NLQQueries: [
                    {
                        NLQConnectorQueries: [
                            {
                                SearchFilter: {
                                    SubFilters: [
                                        {
                                            SubFilters: [
                                                {
                                                    SubFilters: [
                                                        {
                                                            SubFilters: [
                                                                {
                                                                    SubFilters: [
                                                                        {
                                                                            SubFilters: [],
                                                                        },
                                                                    ],
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                ],
            },
            ExecutionDetails: [],
            MaxFacetValues: 5,
            Facets: [
                {
                    Values: [],
                },
            ],
        },
    };
    function isChartRequest(obj) {
        if (typeof obj === "object") {
            var obj2 = obj;
            if (typeof obj2.d === "object") {
                var obj3 = obj2;
                if (typeof obj3.d.QueryOptions === "object") {
                    var obj4 = obj3;
                    return (typeof obj4.d.QueryOptions.SearchType === "string" &&
                        obj4.d.QueryOptions.SearchType === "F");
                }
            }
        }
        return false;
    }
    exports.isChartRequest = isChartRequest;
    exports.chartRequest = {
        d: {
            Id: "1",
            DataSources: [],
            Filter: {},
            QueryOptions: {
                SearchTerms: "",
                Skip: 0,
                SearchType: "F",
                ClientSessionID: "",
                ClientCallTimestamp: "",
                ClientServiceName: "",
                ClientLastExecutionID: "",
            },
            FacetRequests: [],
            MaxFacetValues: 5,
            Facets: [
                {
                    Values: [],
                },
            ],
            ExecutionDetails: [],
        },
    };
    function isValueHelperRequest(obj) {
        if (typeof obj === "object") {
            var obj2 = obj;
            if (typeof obj2.d === "object") {
                var obj3 = obj2;
                if (typeof obj3.d.ValueHelpAttribute === "string")
                    return true;
            }
        }
        return false;
    }
    exports.isValueHelperRequest = isValueHelperRequest;
    exports.valueHelperRequest = {
        d: {
            Id: "1",
            ValueHelpAttribute: "",
            ValueFilter: "",
            DataSources: [],
            Filter: {},
            QueryOptions: {
                SearchTerms: "",
                Top: 1000,
                Skip: 0,
                SearchType: "V",
                ClientSessionID: "",
                ClientCallTimestamp: "",
                ClientServiceName: "",
                ClientLastExecutionID: "",
            },
            ValueHelp: [],
        },
    };
    function isSuggestionRequest(obj) {
        if (typeof obj === "object") {
            var obj2 = obj;
            if (typeof obj2.d === "object") {
                var obj3 = obj2;
                if (typeof obj3.d.SuggestionInput === "string")
                    return true;
            }
        }
        return false;
    }
    exports.isSuggestionRequest = isSuggestionRequest;
    exports.suggestionRequest = {
        d: {
            Id: "1",
            SuggestionInput: "",
            IncludeAttributeSuggestions: false,
            IncludeHistorySuggestions: false,
            IncludeDataSourceSuggestions: false,
            DetailLevel: 1,
            QueryOptions: {
                Top: 0,
                Skip: 0,
                SearchType: "S",
                SearchTerms: "",
                ClientSessionID: "",
                ClientCallTimestamp: "",
                ClientServiceName: "",
                ClientLastExecutionID: "",
            },
            Filter: {},
            DataSources: [],
            Suggestions: [],
            ExecutionDetails: [],
        },
    };
    function isObjectSuggestionRequest(obj) {
        if (typeof obj === "object") {
            var obj2 = obj;
            if (typeof obj2.d === "object") {
                var obj3 = obj2;
                if (obj3.d.IncludeAttributeSuggestions !== "undefined" &&
                    obj3.d.IncludeAttributeSuggestions === true)
                    return true;
            }
        }
        return false;
    }
    exports.isObjectSuggestionRequest = isObjectSuggestionRequest;
    exports.objectSuggestionRequest = {
        d: {
            Id: "1",
            IncludeAttributeSuggestions: true,
            QueryOptions: {
                SearchTerms: "a",
                Top: 10,
                Skip: 0,
                ClientSessionID: "",
                ClientCallTimestamp: "",
                ClientServiceName: "",
                ClientLastExecutionID: "",
            },
            DataSources: [
                {
                    Id: "UIA000~EPM_BPA_DEMO~",
                    Type: "View",
                },
            ],
            ObjectSuggestions: {
                SearchResults: [
                    {
                        HitAttributes: [],
                        Attributes: [],
                    },
                ],
            },
            Filter: {},
            ExecutionDetails: [],
        },
    };
    function isNavigationEvent(obj) {
        if (typeof obj === "object") {
            var obj2 = obj;
            return Array.isArray(obj2.Events);
        }
        return false;
    }
    exports.isNavigationEvent = isNavigationEvent;
    exports.navigationEvent = {
        SemanticObjectType: "",
        Intent: "",
        System: "",
        Client: "",
        Parameters: [
        //{
        //"Name": "",
        //"Value": ""
        //}
        ],
    };
});
})();