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
    exports.concatenate = exports.split = exports.SuggestionTermSplitter = void 0;
    var SuggestionTermSplitter = /** @class */ (function () {
        function SuggestionTermSplitter(provider) {
            this.provider = provider;
            this.sina = provider.sina;
        }
        SuggestionTermSplitter.prototype.split = function (term) {
            // split suggestions term into
            // prefix = which is used as search term filter
            // suffix = which is actually used as thes suggestion term
            // split position is last space
            // reason:
            // document contains: "Sally Spring"
            // search input box: sally  s-> suggestion sally spring
            //                   spring s-> suggestion spring sally
            // last suggestion would not happend when just using
            // "spring s " as suggestion term
            // check for last blank
            var splitPos = term.lastIndexOf(" ");
            if (splitPos < 0) {
                return {
                    searchTerm: null,
                    suggestionTerm: term,
                };
            }
            // split search term
            var searchTerm = term.slice(0, splitPos);
            searchTerm = searchTerm.replace(/\s+$/, ""); // right trim
            if (searchTerm.length === 0) {
                return {
                    searchTerm: null,
                    suggestionTerm: term,
                };
            }
            // split suggestion term
            var suggestionTerm = term.slice(splitPos);
            suggestionTerm = suggestionTerm.replace(/^\s+/, ""); // left trim
            if (suggestionTerm.length === 0) {
                return {
                    searchTerm: null,
                    suggestionTerm: term,
                };
            }
            // return result
            return {
                searchTerm: searchTerm,
                suggestionTerm: suggestionTerm,
            };
        };
        SuggestionTermSplitter.prototype.concatenate = function (splittedSuggestionTerm, suggestions) {
            // no search term -> nothing to do
            if (!splittedSuggestionTerm.searchTerm) {
                return;
            }
            // split search terms
            var term;
            var searchTerms = [];
            var splittedSuggestionTerms = splittedSuggestionTerm.searchTerm.split(" ");
            for (var k = 0; k < splittedSuggestionTerms.length; k++) {
                term = splittedSuggestionTerms[k];
                term = term.trim();
                searchTerms.push({
                    term: term,
                    regExp: new RegExp(this.escapeRegExp(term), "i"),
                });
            }
            // process all suggestions
            for (var i = 0; i < suggestions.length; ++i) {
                var suggestion = suggestions[i];
                //                // process only SearchTerm and SearchTermAndDataSource suggestions
                //                if (suggestion.calculationMode !== this.sina.SuggestionType.SearchTerm &&
                //                    suggestion.calculationMode !== this.sina.SuggestionType.SearchTermAndDataSource) {
                //                    continue;
                //                }
                // identify all search terms not included in suggestion
                var notFoundSearchTerms = [];
                for (var j = 0; j < searchTerms.length; ++j) {
                    var searchTerm = searchTerms[j];
                    if (!searchTerm.regExp.test(suggestion.filter.searchTerm)) {
                        notFoundSearchTerms.push(searchTerm.term);
                    }
                }
                // prefix for suggestion = all search terms not included in suggestions
                var prefixBold = [];
                var prefix = notFoundSearchTerms.join(" ");
                for (var l = 0; l < notFoundSearchTerms.length; l++) {
                    term = notFoundSearchTerms[l];
                    /* eslint no-loop-func:0 */
                    prefixBold.push("<b>" + term + "</b>");
                }
                var prefixBoldStr = prefixBold.join(" ");
                suggestion.label = prefixBoldStr + " " + suggestion.label;
                suggestion.filter.searchTerm = suggestion.searchTerm =
                    prefix + " " + suggestion.filter.searchTerm;
                // process children
                this.concatenate(splittedSuggestionTerm, suggestion.childSuggestions);
            }
        };
        SuggestionTermSplitter.prototype.escapeRegExp = function (str) {
            /* eslint no-useless-escape:0 */
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        };
        return SuggestionTermSplitter;
    }());
    exports.SuggestionTermSplitter = SuggestionTermSplitter;
    function split(provider, term) {
        var suggestionTermSplitter = new SuggestionTermSplitter(provider);
        return suggestionTermSplitter.split(term);
    }
    exports.split = split;
    function concatenate(provider, splittedTerm, suggestions) {
        var suggestionTermSplitter = new SuggestionTermSplitter(provider);
        return suggestionTermSplitter.concatenate(splittedTerm, suggestions);
    }
    exports.concatenate = concatenate;
});
})();