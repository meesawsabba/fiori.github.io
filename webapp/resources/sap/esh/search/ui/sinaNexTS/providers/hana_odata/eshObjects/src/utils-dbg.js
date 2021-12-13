/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

/* global Proxy, Reflect, Symbol */

(function(){
sap.ui.define(["require", "exports", "./definitions"], function (require, exports, definitions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseFreeStyleText = exports.getEshSearchQuery = exports.createEshSearchQuery = void 0;
    var States;
    (function (States) {
        States[States["Term"] = 0] = "Term";
        States[States["Phrase"] = 1] = "Phrase";
    })(States || (States = {}));
    var createEshSearchQuery = function (options) {
        if (options === void 0) { options = {}; }
        if (options.metadataCall) {
            var path = options.resourcePath ? options.resourcePath : "/$metadata";
            if (options.metadataObjects) {
                if (options.metadataObjects.entitySets) {
                    path += "/EntitySets(" + options.metadataObjects.entitySets + ")";
                }
                else {
                    if (options.metadataObjects.format) {
                        path += "?$format=" + options.metadataObjects.format;
                    }
                    if (options.metadataObjects.collectionReference) {
                        path += "#" + options.metadataObjects.collectionReference;
                    }
                    if (options.metadataObjects.contextEntitySet && options.metadataObjects.primitiveTyp) {
                        path += "#" + options.metadataObjects.contextEntitySet + "(" + options.metadataObjects.primitiveTyp + ")";
                    }
                    else if (options.metadataObjects.contextEntitySet) {
                        path += "#" + options.metadataObjects.contextEntitySet;
                    }
                    else if (options.metadataObjects.primitiveTyp) {
                        path += "#" + options.metadataObjects.primitiveTyp;
                    }
                }
            }
            return {
                path: path,
                parameters: {},
            };
        }
        /*
        let searchPath1 = "";
        if (options?.resourcePath) {
          searchPath1 = options?.resourcePath
        } else {
          searchPath1 = (options && options.suggestTerm) ? `/$all/${encodeURIComponent("GetSuggestion(term='" + options.suggestTerm.replace("'", "''").replace("\\?", "?") + "')")}` : "/$all";
        }*/
        var searchPath = "/$all";
        if (options.resourcePath) {
            searchPath = options.resourcePath;
        }
        if (options === null || options === void 0 ? void 0 : options.suggestTerm) {
            searchPath += "/" + encodeURIComponent("GetSuggestion(term='" + options.suggestTerm.replace(/'/g, "''") + "')");
        }
        if (options.eshParameters) {
            var customParameters = [];
            for (var _i = 0, _a = Object.keys(options.eshParameters); _i < _a.length; _i++) {
                var key = _a[_i];
                customParameters.push(key + "='" + encodeURIComponent(options.eshParameters[key]) + "'");
            }
            if (customParameters.length > 0) {
                searchPath += "(" + customParameters.join(",") + ")";
            }
        }
        var newODataFilter = new definitions_1.Expression({
            operator: definitions_1.LogicalOperator.and,
            items: [],
        });
        if (!options) {
            options = {
                query: definitions_1.SEARCH_DEFAULTS.query,
                scope: definitions_1.SEARCH_DEFAULTS.scope,
                $select: [],
                facets: [],
            };
        }
        else {
            if (!options.query) {
                options.query = definitions_1.SEARCH_DEFAULTS.query;
            }
            /*
            if (!options.scope) {
              options.scope = SEARCH_DEFAULTS.scope;
            }*/
            if (!options.$select) {
                options.$select = [];
            }
            if (!options.facets) {
                options.facets = [];
            }
        }
        if (options.oDataFilter) {
            newODataFilter.items.push(options.oDataFilter);
        }
        if (newODataFilter.items.length > 0) {
            options.oDataFilter = newODataFilter;
        }
        var urlSearchPath = searchPath;
        var query = options.scope ? "SCOPE:" + options.scope : "";
        if (options.searchQueryFilter) {
            var searchQueryFilterStatement = options.searchQueryFilter.toStatement().trim();
            if (searchQueryFilterStatement.length > 0) {
                if (query !== "") {
                    query += " ";
                }
                query += searchQueryFilterStatement;
            }
        }
        if (options.freeStyleText) {
            if (query !== "") {
                query += " ";
            }
            var freeStyleTextExpression = exports.parseFreeStyleText(options.freeStyleText);
            query += freeStyleTextExpression.toStatement();
        }
        if (options.query && options.query !== "") {
            if (query !== "") {
                query += " ";
            }
            query += definitions_1.escapeQuery(options.query);
        }
        var parameters = {};
        for (var _b = 0, _c = Object.keys(options); _b < _c.length; _b++) {
            var optionKey = _c[_b];
            switch (optionKey) {
                case "query":
                    if (options.$apply) {
                        // it is not allowed to use query and $apply together
                        break;
                    }
                    var filter = query === "" ? "" : "filter(Search.search(query='" + query + "')";
                    if (options.oDataFilter && options.oDataFilter.items.length > 0) {
                        filter += " and " + options.oDataFilter.toStatement();
                    }
                    if (query !== "") {
                        filter += ")";
                    }
                    if (options.groupby && options.groupby.properties && (options.groupby.properties.length > 0)) {
                        filter += "/groupby((" + options.groupby.properties.join(",") + ")";
                        if (options.groupby.aggregateCountAlias && options.groupby.aggregateCountAlias !== "") {
                            filter += ",aggregate($count as " + options.groupby.aggregateCountAlias + ")";
                        }
                        filter += ")";
                    }
                    if (filter !== "") {
                        parameters.$apply = filter;
                    }
                    break;
                case "$orderby":
                    if (options.$orderby && options.$orderby.length > 0) {
                        parameters.$orderby = options.$orderby.map(function (i) { return i.order ? i.key + " " + i.order : i.key; }).join(",");
                    }
                    break;
                case "facets":
                    if (options.facets && options.facets.length > 0) {
                        parameters[optionKey] = options.facets.join(",");
                    }
                    break;
                case "$select":
                    if (options.$select && options.$select.length > 0) {
                        parameters[optionKey] = options.$select.join(",");
                    }
                    break;
                case "facetroot":
                    if (options.facetroot && options.facetroot.length > 0) {
                        parameters.facetroot = options.facetroot.map(function (i) { return i.toStatement(); }).join(",");
                    }
                    break;
                case "$top":
                case "$skip":
                case "$count":
                case "whyfound":
                case "estimate":
                case "wherefound":
                case "facetlimit":
                case "filteredgroupby":
                    parameters[optionKey] = options[optionKey];
                    break;
                case "dynamicview":
                    if (options.dynamicview) {
                        parameters[optionKey] = options.dynamicview.map(function (dynamicView) {
                            return dynamicView.toStatement();
                        }).join(" ");
                    }
                    break;
                case "$apply":
                    if ((options[optionKey] instanceof definitions_1.CustomFunction) || (options[optionKey] instanceof definitions_1.FilterFunction)) {
                        var apply = options[optionKey].toStatement();
                        if (options.groupby && options.groupby.properties && (options.groupby.properties.length > 0)) {
                            apply += "/groupby((" + options.groupby.properties.join(",") + ")";
                            if (options.groupby.aggregateCountAlias && options.groupby.aggregateCountAlias !== "") {
                                apply += ",aggregate($count as " + options.groupby.aggregateCountAlias + ")";
                            }
                            apply += ")";
                        }
                        ;
                        parameters[optionKey] = apply;
                    }
                    break;
                default:
                    break;
            }
        }
        return {
            path: urlSearchPath,
            parameters: parameters,
        };
    };
    exports.createEshSearchQuery = createEshSearchQuery;
    var getEshSearchQuery = function (options) {
        var createdQuery = exports.createEshSearchQuery(options);
        var stringParams = Object.keys(createdQuery.parameters).map(function (key) {
            return encodeURIComponent(key) + "=" + encodeURIComponent(createdQuery.parameters[key]);
        }).join("&");
        if (stringParams && stringParams !== "") {
            return createdQuery.path + "?" + stringParams;
        }
        return createdQuery.path;
    };
    exports.getEshSearchQuery = getEshSearchQuery;
    var parseFreeStyleText = function (freeStyleText) {
        var items = [];
        var term = "";
        var state = States.Term;
        for (var i = 0; i < freeStyleText.length; i++) {
            var currentChar = freeStyleText[i];
            if (currentChar === '"') {
                if (state == States.Term) {
                    // check if there is closing "
                    if (freeStyleText.substring(i + 1).indexOf('"') >= 0) {
                        items.push(new definitions_1.Term({ term: term.trim() }));
                        state = States.Phrase;
                        term = '';
                    }
                    else {
                        items.push(new definitions_1.Term({ term: (term + freeStyleText.substring(i)).trim() }));
                        term = '';
                        break;
                    }
                }
                else {
                    items.push(new definitions_1.Phrase({ phrase: term }));
                    state = States.Term;
                    term = '';
                }
            }
            else {
                term += freeStyleText[i];
            }
        }
        if (term.length > 0) {
            items.push(new definitions_1.Term({ term: term.trim() }));
        }
        return new definitions_1.Expression({
            operator: definitions_1.SearchQueryLogicalOperator.TIGHT_AND,
            items: items
        });
    };
    exports.parseFreeStyleText = parseFreeStyleText;
});
})();