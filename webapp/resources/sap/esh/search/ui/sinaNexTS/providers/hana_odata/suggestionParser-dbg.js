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
sap.ui.define(["require", "exports", "../../core/core"], function (require, exports, core) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SuggestionParser = void 0;
    var SuggestionParser = /** @class */ (function () {
        function SuggestionParser(provider) {
            this.provider = provider;
            this.sina = provider.sina;
        }
        SuggestionParser.prototype.parse = function (query, data) {
            var suggestions = [];
            var suggestion;
            // var parentSuggestion;
            // var parentSuggestions = [];
            // var suggestionSearchTerms = [];
            var cell;
            // var parentCell;
            // var calculationMode;
            for (var i = 0; i < data.length; i++) {
                suggestion = null;
                cell = data[i];
                // calculationMode = this.parseCalculationMode(cell.Type);
                //
                // switch (cell.Type) {
                // case 'H':
                //     suggestion = this.parseSearchTermSuggestion(query, cell);
                //     break;
                // case 'A':
                //     suggestion = this.parseSearchTermAndDataSourceSuggestion(query, cell);
                //     // attach type and cell information
                //     suggestion.type = 'A';
                //     suggestion.cell = cell;
                //     break;
                // case 'M':
                //     suggestion = this.parseDataSourceSuggestion(query, cell);
                //     break;
                // }
                suggestion = this.parseSearchTermSuggestion(query, cell);
                // if (suggestion) {
                //     if (suggestion.type === 'A') {
                //         // set parent sugestion
                //         if (parentSuggestions[suggestion.searchTerm] === undefined) {
                //             parentCell = this._getParentCell(suggestion.cell);
                //             parentSuggestion = this.parseSearchTermSuggestion(query, parentCell);
                //             parentSuggestions[suggestion.searchTerm] = parentSuggestion;
                //         }
                //         // remove type and cell information
                //         delete suggestion.type;
                //         delete suggestion.cell;
                //         // attach children
                //         parentSuggestions[suggestion.searchTerm].childSuggestions.push(suggestion);
                //     } else {
                //         // push non-attribute suggestion
                //         suggestions.push(suggestion);
                //     }
                // }
                suggestions.push(suggestion);
            }
            // push attribute suggestion
            // Object.keys(parentSuggestions).forEach(function (key) {
            //     suggestions.push(parentSuggestions[key]);
            // });
            return suggestions;
        };
        SuggestionParser.prototype.parseDataSourceSuggestion = function (query, cell) {
            var calculationMode = this.sina.SuggestionCalculationMode.Data; // always data suggestion
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
            var filter = query.filter.clone();
            filter.setSearchTerm(cell.term);
            return this.sina._createSearchTermSuggestion({
                searchTerm: cell.term,
                calculationMode: this.sina.SuggestionCalculationMode.Data,
                filter: filter,
                label: cell.highlighted || cell.term,
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
        SuggestionParser.prototype.parseObjectSuggestions = function (query, searchItems) {
            var filter = query.filter.clone();
            var suggestionPromises = [];
            // var objectSuggestions = searchItems.d.ObjectSuggestions.SearchResults.results;
            for (var i = 0; i < searchItems.length; ++i) {
                var object = searchItems[i];
                // fill highlighted value: actually it would be better to call
                // the search result set formatter like for a regular result
                // set
                this.fillValueHighlighted(object);
                var title = core
                    .map(object.titleAttributes, function (attribute) {
                    return attribute.valueFormatted;
                }, this)
                    .join(" ");
                var oObjectSuggestion = this.sina._createObjectSuggestion({
                    calculationMode: this.sina.SuggestionCalculationMode.Data,
                    label: title,
                    searchTerm: filter.searchTerm,
                    filter: filter,
                    object: object,
                });
                suggestionPromises.push(oObjectSuggestion);
            }
            return Promise.all(suggestionPromises);
        };
        SuggestionParser.prototype.fillValueHighlighted = function (object) {
            var doFillValueHighlighted = function (attributes) {
                if (!attributes) {
                    return;
                }
                for (var i = 0; i < attributes.length; ++i) {
                    var attribute = attributes[i];
                    if (!attribute.valueHighlighted) {
                        if (typeof attribute.valueFormatted === "string" &&
                            attribute.valueFormatted.startsWith("sap-icon://") === true) {
                            attribute.valueHighlighted = "";
                        }
                        else {
                            attribute.valueHighlighted = attribute.valueFormatted;
                        }
                    }
                }
            };
            doFillValueHighlighted(object.detailAttributes);
            doFillValueHighlighted(object.titleAttributes);
        };
        SuggestionParser.prototype.parseCalculationMode = function (scope) {
            switch (scope) {
                case "H":
                    return this.sina.SuggestionCalculationMode.History;
                case "A":
                case "M":
                    return this.sina.SuggestionCalculationMode.Data;
            }
        };
        SuggestionParser.prototype._getParentCell = function (cell) {
            var parentCell = {};
            parentCell = cell;
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