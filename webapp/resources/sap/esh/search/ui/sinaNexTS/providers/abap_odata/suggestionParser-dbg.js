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
sap.ui.define(["require", "exports", "../../core/core", "../../sina/SuggestionCalculationMode"], function (require, exports, core, SuggestionCalculationMode_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SuggestionParser = void 0;
    var SuggestionParser = /** @class */ (function () {
        function SuggestionParser(provider, itemParser) {
            this.provider = provider;
            this.sina = provider.sina;
            this.itemParser = itemParser;
        }
        SuggestionParser.prototype.parseObjectSuggestions = function (query, data) {
            if (!data.d.ObjectSuggestions ||
                !data.d.ObjectSuggestions.SearchResults ||
                !data.d.ObjectSuggestions.SearchResults.results) {
                return [];
            }
            var suggestionPromises = [];
            var objectSuggestions = data.d.ObjectSuggestions.SearchResults.results;
            for (var i = 0; i < objectSuggestions.length; ++i) {
                var objectSuggestion = objectSuggestions[i];
                suggestionPromises.push(this.parseObjectSuggestion(objectSuggestion));
            }
            return Promise.all(suggestionPromises);
        };
        SuggestionParser.prototype.parseObjectSuggestion = function (objectSuggestion) {
            return this.itemParser.parseItem(objectSuggestion).then(function (object) {
                // fill highlighted value: actually it would be better to call
                // the search result set formatter like for a regular result
                // set
                this.fillValueHighlighted(object);
                var title = core
                    .map(object.titleAttributes, function (attribute) {
                    return attribute.valueFormatted;
                }, this)
                    .join(" ");
                return this.sina._createObjectSuggestion({
                    calculationMode: SuggestionCalculationMode_1.SuggestionCalculationMode.Data,
                    label: title,
                    object: object,
                });
            }.bind(this));
        };
        SuggestionParser.prototype.fillValueHighlighted = function (object) {
            var doFillValueHighlighted = function (attributes) {
                if (!attributes) {
                    return;
                }
                for (var i = 0; i < attributes.length; ++i) {
                    var attribute = attributes[i];
                    if (!attribute.valueHighlighted) {
                        attribute.valueHighlighted = attribute.valueFormatted;
                    }
                }
            };
            doFillValueHighlighted(object.detailAttributes);
            doFillValueHighlighted(object.titleAttributes);
        };
        SuggestionParser.prototype.parseRegularSuggestions = function (query, data) {
            var suggestions = [];
            var suggestion;
            var parentSuggestion;
            var parentSuggestions = [];
            var cell;
            var parentCell;
            if (!data.d.Suggestions || !data.d.Suggestions.results) {
                return [];
            }
            var results = data.d.Suggestions.results;
            for (var i = 0; i < results.length; i++) {
                suggestion = null;
                cell = results[i];
                switch (cell.Type) {
                    case "H":
                        suggestion = this.parseSearchTermSuggestion(query, cell);
                        break;
                    case "A":
                        suggestion = this.parseSearchTermAndDataSourceSuggestion(query, cell);
                        // attach type and cell information
                        // suggestion.type = "A";
                        suggestion.cell = cell;
                        break;
                    case "M":
                        suggestion = this.parseDataSourceSuggestion(query, cell);
                        break;
                }
                if (suggestion) {
                    if (suggestion.type === this.sina.SuggestionType.SearchTermAndDataSource) {
                        // set parent sugestion
                        if (parentSuggestions[suggestion.searchTerm] === undefined) {
                            parentCell = this._getParentCell(suggestion.cell);
                            parentSuggestion = this.parseSearchTermSuggestion(query, parentCell);
                            parentSuggestions[suggestion.searchTerm] = parentSuggestion;
                        }
                        // remove type and cell information
                        delete suggestion.cell;
                        // attach children
                        parentSuggestions[suggestion.searchTerm].childSuggestions.push(suggestion);
                    }
                    else {
                        // push non-attribute suggestion
                        suggestions.push(suggestion);
                    }
                }
            }
            // push attribute suggestion
            Object.keys(parentSuggestions).forEach(function (key) {
                suggestions.push(parentSuggestions[key]);
            });
            return suggestions;
        };
        SuggestionParser.prototype.parseDataSourceSuggestion = function (query, cell) {
            var calculationMode = SuggestionCalculationMode_1.SuggestionCalculationMode.Data; // always data suggestion
            var dataSource = this.sina.getDataSource(cell.FromDataSource);
            if (!dataSource) {
                return null;
            }
            var filter = query.filter.clone();
            filter.setDataSource(dataSource);
            return this.sina._createDataSourceSuggestion({
                calculationMode: calculationMode,
                dataSource: dataSource,
                label: cell.SearchTermsHighlighted,
            });
        };
        SuggestionParser.prototype.parseSearchTermSuggestion = function (query, cell) {
            var calculationMode = this.parseCalculationMode(cell.Type);
            var filter = query.filter.clone();
            filter.setSearchTerm(cell.SearchTerms);
            return this.sina._createSearchTermSuggestion({
                searchTerm: cell.SearchTerms,
                calculationMode: calculationMode,
                filter: filter,
                label: cell.SearchTermsHighlighted,
            });
        };
        SuggestionParser.prototype.parseSearchTermAndDataSourceSuggestion = function (query, cell) {
            var calculationMode = this.parseCalculationMode(cell.Type);
            var filter = query.filter.clone();
            filter.setSearchTerm(cell.SearchTerms);
            var dataSource = this.sina.getDataSource(cell.FromDataSource);
            if (!dataSource) {
                return null;
            }
            filter.setDataSource(dataSource);
            return this.sina._createSearchTermAndDataSourceSuggestion({
                searchTerm: cell.SearchTerms,
                dataSource: dataSource,
                calculationMode: calculationMode,
                filter: filter,
                label: cell.SearchTermsHighlighted,
            });
        };
        SuggestionParser.prototype.parseCalculationMode = function (scope) {
            switch (scope) {
                case "H":
                    return SuggestionCalculationMode_1.SuggestionCalculationMode.History;
                case "A":
                case "M":
                    return SuggestionCalculationMode_1.SuggestionCalculationMode.Data;
            }
        };
        SuggestionParser.prototype._getParentCell = function (cell) {
            var parentCell = cell;
            parentCell.FromDataSource = "<All>";
            parentCell.FromDataSourceAttribute = "";
            parentCell.Type = "A";
            return parentCell;
        };
        return SuggestionParser;
    }());
    exports.SuggestionParser = SuggestionParser;
});
})();