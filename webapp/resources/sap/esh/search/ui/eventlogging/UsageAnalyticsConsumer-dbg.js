/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
/* global */
// @ts-check
sap.ui.define(["sap/esh/search/ui/eventlogging/EventConsumer", "sap/esh/search/ui/suggestions/SuggestionType"], function (EventConsumer, SuggestionType) {
    "use strict";
    // =======================================================================
    // Usage Analytics Event Consumer
    // =======================================================================
    var module = function () {
        this.init.apply(this, arguments);
    };
    module.prototype = jQuery.extend(new EventConsumer(), {
        /**
         * @this {sap.esh.search.ui.eventlogging.UsageAnalyticsConsumer}
         */
        init: function () {
            if (sap && sap.ushell && sap.ushell.Container && sap.ushell.Container.getServiceAsync) {
                sap.ushell.Container.getServiceAsync("UsageAnalytics").then(function (service) {
                    this.analytics = service;
                }.bind(this));
            }
        },
        /**
         * @this {sap.esh.search.ui.eventlogging.UsageAnalyticsConsumer}
         */
        logEvent: function (event) {
            if (!this.analytics) {
                return;
            }
            switch (event.type) {
                case this.eventLogger.RESULT_LIST_ITEM_NAVIGATE:
                    this.analytics.logCustomEvent("FLP: Search", "Launch Object", [event.targetUrl]);
                    break;
                case this.eventLogger.SUGGESTION_SELECT:
                    switch (event.suggestionType) {
                        case SuggestionType.APPS:
                            this.analytics.logCustomEvent("FLP: Search", "Suggestion Select App", [
                                event.suggestionTitle,
                                event.targetUrl,
                                event.searchTerm,
                            ]);
                            this.analytics.logCustomEvent("FLP: Application Launch point", "Search Suggestions", [event.suggestionTitle, event.targetUrl, event.searchTerm]);
                            break;
                        case SuggestionType.DATASOURCE:
                            this.analytics.logCustomEvent("FLP: Search", "Suggestion Select Datasource", [
                                event.dataSourceKey,
                                event.searchTerm,
                            ]);
                            break;
                        case SuggestionType.OBJECTDATA:
                            this.analytics.logCustomEvent("FLP: Search", "Suggestion Select Object Data", [event.suggestionTerm, event.dataSourceKey, event.searchTerm]);
                            break;
                        case SuggestionType.HISTORY:
                            this.analytics.logCustomEvent("FLP: Search", "Suggestion Select Object Data", [event.suggestionTerm, event.dataSourceKey, event.searchTerm]);
                            break;
                    }
                    break;
                case this.eventLogger.SEARCH_REQUEST:
                    this.analytics.logCustomEvent("FLP: Search", "Search", [
                        event.searchTerm,
                        event.dataSourceKey,
                    ]);
                    break;
                case this.eventLogger.RESULT_LIST_ITEM_NAVIGATE_CONTEXT:
                    this.analytics.logCustomEvent("FLP: Search", "Launch Related Object", [
                        event.targetUrl,
                    ]);
                    break;
                case this.eventLogger.SUGGESTION_REQUEST:
                    this.analytics.logCustomEvent("FLP: Search", "Suggestion", [
                        event.suggestionTerm,
                        event.dataSourceKey,
                    ]);
                    break;
                case this.eventLogger.TILE_NAVIGATE:
                    this.analytics.logCustomEvent("FLP: Search", "Launch App", [
                        event.tileTitle,
                        event.targetUrl,
                    ]);
                    this.analytics.logCustomEvent("FLP: Application Launch point", "Search Results", [
                        event.titleTitle,
                        event.targetUrl,
                    ]);
                    break;
            }
        },
    });
    return module;
});
