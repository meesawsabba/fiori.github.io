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
sap.ui.define(["require", "exports", "../../sina/SuggestionCalculationMode", "./pivotTableParser"], function (require, exports, SuggestionCalculationMode_1, pivotTableParser) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parse = void 0;
    var SuggestionParser = /** @class */ (function () {
        function SuggestionParser(provider) {
            this.provider = provider;
            this.sina = provider.sina;
        }
        SuggestionParser.prototype.parseSuggestions = function (query, data) {
            data = pivotTableParser.parse(data);
            var suggestions = [];
            var suggestion;
            var parentSuggestion;
            for (var i = 0; i < data.cells.length; i++) {
                suggestion = null;
                var cell = data.cells[i];
                if (cell.$$Attribute$$ !== "$$AllAttributes$$") {
                    continue;
                }
                switch (cell.$$Term$$.Scope) {
                    case "SearchHistory":
                        if (cell.$$DataSource$$ === "$$AllDataSources$$") {
                            suggestion = this.parseSearchTermSuggestion(query, cell);
                        }
                        break;
                    case "ObjectData":
                        if (cell.$$DataSource$$ === "$$AllDataSources$$") {
                            suggestion = this.parseSearchTermSuggestion(query, cell);
                            parentSuggestion = suggestion;
                        }
                        else {
                            suggestion = this.parseSearchTermAndDataSourceSuggestion(query, cell);
                            if (suggestion &&
                                suggestion.filter.dataSource !== parentSuggestion.filter.dataSource) {
                                parentSuggestion.childSuggestions.push(suggestion);
                            }
                            suggestion = null;
                        }
                        break;
                    case "DataSources":
                        if (cell.$$DataSource$$ === "$$AllDataSources$$") {
                            suggestion = this.parseDataSourceSuggestion(query, cell);
                        }
                        break;
                }
                if (suggestion) {
                    suggestions.push(suggestion);
                }
            }
            return suggestions;
        };
        SuggestionParser.prototype.parseDataSourceSuggestion = function (query, cell) {
            var dataSource = this.sina.getDataSource(cell.$$Term$$.Value);
            if (!dataSource) {
                return null;
            }
            var filter = query.filter.clone();
            filter.setDataSource(dataSource);
            return this.sina._createDataSourceSuggestion({
                calculationMode: SuggestionCalculationMode_1.SuggestionCalculationMode.Data,
                dataSource: dataSource,
                label: cell.$$Term$$.ValueFormatted,
            });
        };
        SuggestionParser.prototype.parseSearchTermSuggestion = function (query, cell) {
            var calculationMode = this.parseCalculationMode(cell.$$Term$$.Scope);
            var filter = query.filter.clone();
            filter.setSearchTerm(cell.$$Term$$.Value);
            return this.sina._createSearchTermSuggestion({
                searchTerm: cell.$$Term$$.Value,
                calculationMode: calculationMode,
                filter: filter,
                label: cell.$$Term$$.ValueFormatted,
            });
        };
        SuggestionParser.prototype.parseSearchTermAndDataSourceSuggestion = function (query, cell) {
            var calculationMode = this.parseCalculationMode(cell.$$Term$$.Scope);
            var filter = query.filter.clone();
            filter.setSearchTerm(cell.$$Term$$.Value);
            var dataSource = this.sina.getDataSource(cell.$$DataSource$$);
            if (!dataSource) {
                return null;
            }
            filter.setDataSource(dataSource);
            return this.sina._createSearchTermAndDataSourceSuggestion({
                searchTerm: cell.$$Term$$.Value,
                dataSource: dataSource,
                calculationMode: calculationMode,
                filter: filter,
                label: cell.$$Term$$.ValueFormatted,
            });
        };
        SuggestionParser.prototype.parseCalculationMode = function (scope) {
            switch (scope) {
                case "SearchHistory":
                    return SuggestionCalculationMode_1.SuggestionCalculationMode.History;
                case "ObjectData":
                    return SuggestionCalculationMode_1.SuggestionCalculationMode.Data;
            }
        };
        return SuggestionParser;
    }());
    function parse(provider, suggestionQuery, data) {
        var suggestionParser = new SuggestionParser(provider);
        return suggestionParser.parseSuggestions(suggestionQuery, data);
    }
    exports.parse = parse;
});
})();