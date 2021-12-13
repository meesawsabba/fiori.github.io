/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/esh/search/ui/appsearch/JsSearchFactory", "sap/ui/Device"], function (jsSearchFactory, device) {
    "use strict";
    var CatalogSearch = function () {
        this.init.apply(this, arguments);
    };
    CatalogSearch.prototype = {
        init: function () {
            this.initPromise = sap.ushell.Container.getServiceAsync("SearchableContent")
                .then(function (searchService) {
                return searchService.getApps();
            })
                .then(function (apps) {
                // format
                apps = this.formatApps(apps);
                // decide whether jsSearch should do normalization
                var shouldNormalize = true;
                var isIE = (device && device.browser && device.browser.msie) || false;
                if (!String.prototype.normalize || isIE) {
                    shouldNormalize = false;
                }
                // create js search engine
                this.searchEngine = jsSearchFactory.createJsSearch({
                    objects: apps,
                    fields: ["title", "subtitle", "keywords"],
                    shouldNormalize: shouldNormalize,
                });
            }.bind(this));
        },
        formatApps: function (apps) {
            var resultApps = [];
            apps.forEach(function (app) {
                app.visualizations.forEach(function (vis) {
                    var label = vis.title;
                    if (vis.subtitle) {
                        label = label + " - " + vis.subtitle;
                    }
                    resultApps.push({
                        title: vis.title || "",
                        subtitle: vis.subtitle || "",
                        keywords: vis.keywords ? vis.keywords.join(" ") : "",
                        icon: vis.icon || "",
                        label: label,
                        visualization: vis,
                        url: vis.targetURL,
                    });
                });
            });
            return resultApps;
        },
        prefetch: function () { },
        search: function (query) {
            return this.initPromise.then(function () {
                // use js search for searching
                var searchResults = this.searchEngine.search({
                    searchFor: query.searchTerm,
                    top: query.top,
                    skip: query.skip,
                });
                // convert to result structure
                var items = [];
                for (var i = 0; i < searchResults.results.length; ++i) {
                    var result = searchResults.results[i];
                    var formattedResult = Object.assign({}, result.object);
                    var highlightedLabel = result.highlighted.title || result.object.title;
                    if (result.highlighted.subtitle) {
                        highlightedLabel = highlightedLabel + " - " + result.highlighted.subtitle;
                    }
                    else if (result.object.subtitle) {
                        highlightedLabel = highlightedLabel + " - " + result.object.subtitle;
                    }
                    if (highlightedLabel) {
                        formattedResult.label = highlightedLabel;
                    }
                    items.push(formattedResult);
                }
                // return search result
                return {
                    totalCount: searchResults.totalCount,
                    tiles: items,
                };
            }.bind(this));
        },
    };
    return CatalogSearch;
});
