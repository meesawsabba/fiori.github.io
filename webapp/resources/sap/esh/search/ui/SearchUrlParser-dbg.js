/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
/* global $ */
sap.ui.define([
    "./i18n",
    "sap/esh/search/ui/SearchHelper",
    "sap/esh/search/ui/SearchUrlParserInav2",
    "sap/m/MessageBox",
], 
/**
 *
 * @param {*} i18n
 * @param {*} SearchHelper
 * @param {*} SearchUrlParserInav2
 * @param {*} MessageBox
 */
function (i18n, SearchHelper, SearchUrlParserInav2, MessageBox) {
    "use strict";
    var SearchUrlParser = function () {
        this.init.apply(this, arguments);
    };
    SearchUrlParser.prototype = {
        init: function (properties) {
            this.model = properties.model;
            this.urlParserInav2 = new SearchUrlParserInav2(properties);
        },
        parse: function () {
            // ignore url hash change which if no search application
            if (!this.model.config.isSearchUrl(SearchHelper.getHashFromUrl())) {
                return Promise.resolve(undefined);
            }
            // check if hash differs from old hash. if not -> return
            if (!SearchHelper.hasher.hasChanged()) {
                return Promise.resolve(undefined);
            }
            return this.model
                .initBusinessObjSearch()
                .then(function () {
                // parse url parameters
                var oParametersLowerCased = SearchHelper.getUrlParameters();
                if ($.isEmptyObject(oParametersLowerCased)) {
                    return undefined;
                }
                if (oParametersLowerCased.datasource || oParametersLowerCased.searchterm) {
                    // old sina format
                    return this.urlParserInav2.parseUrlParameters(oParametersLowerCased);
                }
                // new sinaNext format
                return this.parseUrlParameters(oParametersLowerCased);
            }.bind(this))
                .then(function () {
                // update placeholder in case back button is clicked.
                this.model.setProperty("/searchTermPlaceholder", this.model.calculatePlaceholder());
                // calculate search button status
                this.model.calculateSearchButtonStatus();
                // fire query
                this.model._firePerspectiveQuery(true);
            }.bind(this));
        },
        parseUrlParameters: function (oParametersLowerCased) {
            oParametersLowerCased = this.model.config.parseSearchUrlParameters(oParametersLowerCased);
            // top
            if (oParametersLowerCased.top) {
                var top = parseInt(oParametersLowerCased.top, 10);
                this.model.setTop(top, false);
            }
            // filter conditions
            var filter;
            if (oParametersLowerCased.filter) {
                var filterJson = JSON.parse(oParametersLowerCased.filter);
                try {
                    filter = this.model.sinaNext.parseFilterFromJson(filterJson);
                }
                catch (e) {
                    // fallback to a save filter + send error message
                    filter = this.model.sinaNext.createFilter();
                    if (filterJson.searchTerm) {
                        filter.setSearchTerm(filterJson.searchTerm);
                    }
                    MessageBox.show(i18n.getText("searchUrlParsingErrorLong") + "\n(" + e.toString() + ")", {
                        icon: MessageBox.Icon.ERROR,
                        title: i18n.getText("searchUrlParsingError"),
                        actions: [MessageBox.Action.OK],
                    });
                }
                this.model.setProperty("/uiFilter", filter);
                this.model.setDataSource(filter.dataSource, false, false); // explicitely updata datasource (for categories: update ds list in model)
            }
        },
        render: function () {
            return this.renderFromParameters(this.model.getTop(), this.model.getProperty("/uiFilter"), true);
        },
        renderFromParameters: function (top, filter, encodeFilter) {
            var parameters = {
                top: top,
                filter: encodeFilter
                    ? encodeURIComponent(JSON.stringify(filter.toJson()))
                    : JSON.stringify(filter.toJson()),
            };
            return this.model.config.renderSearchUrl(parameters);
        },
    };
    return SearchUrlParser;
});
