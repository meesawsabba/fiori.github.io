/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
// eslint-disable-next-line no-redeclare
/* global URLSearchParams */
(function (global) {
    "use strict";
    sap.ui.define(["sap/esh/search/ui/controls/SearchResultListSelectionHandler", "sap/base/Log"], 
    /**
     * @this sap.esh.search.ui.SearchConfiguration
     */
    function (DefaultSearchResultListSelectionHandlerControl, Log) {
        var DefaultSearchResultListSelectionHandlerModuleName = DefaultSearchResultListSelectionHandlerControl.getMetadata().getName();
        // =======================================================================
        // url parameter meta data
        // =======================================================================
        var urlParameterMetaData = {
            esDevConfig: {
                type: "object",
            },
            multiSelect: {
                type: "bool",
            },
            sinaProvider: {
                type: "string",
            },
            odataProvider: {
                type: "bool",
            },
            searchBusinessObjects: {
                type: "bool",
            },
            charts: {
                type: "bool",
            },
            maps: {
                type: "bool",
            },
            mapProdiver: {
                type: "object",
            },
            newpie: {
                type: "bool",
            },
            personalizationStorage: {
                type: "string",
            },
            boSuggestions: {
                type: "bool",
            },
            _tweetAttribute: {
                type: "string",
            },
            _eshClickableObjectType: {
                type: "bool",
            },
            defaultSearchScopeApps: {
                type: "bool",
            },
            searchScopeWithoutAll: {
                type: "bool",
            },
            suggestionKeyboardRelaxationTime: {
                type: "int",
            },
            suggestionStartingCharacters: {
                type: "int",
            },
            hideListView: {
                type: "bool",
            },
            gridView: {
                type: "bool",
            },
            defaultResultViewType: {
                type: "string",
            },
            enableMultiSelectionResultItems: {
                type: "bool",
            },
            updateUrl: {
                type: "bool",
            },
            renderUrl: {
                type: "function",
            },
            isSearchUrl: {
                type: "function",
            },
            beforeNavigation: {
                type: "function",
            },
            getCustomToolbar: {
                type: "function",
            },
            quickSelectDataSources: {
                type: "object",
            },
            initAsync: {
                type: "function",
            },
            layoutUseResponsiveSplitter: {
                type: "bool",
            },
            facetPanelWidthInPercent: {
                type: "int",
            },
            FF_facetPanelUnifiedHeaderStyling: {
                type: "bool",
            },
            searchFilterBarShowWithFacets: {
                type: "bool",
            },
            searchBarDoNotHideForNoResults: {
                type: "bool",
            },
            pageSize: {
                type: "int",
            },
            FF_layoutWithoutPage: {
                type: "bool",
            },
            titleColumnName: {
                type: "string",
            },
            titleColumnWidth: {
                type: "string",
            },
            extendTableColumn: {
                type: "object",
            },
            searchInAttibuteFacetPostion: {
                type: "object",
            },
            cleanUpSpaceFilters: {
                type: "function",
            },
            setSearchInLabelIconBindings: {
                type: "function",
            },
            getSearchInFacetListMode: {
                type: "function",
            },
            checkAndSetSpaceIcon: {
                type: "function",
            },
            hasSpaceFiltersOnly: {
                type: "function",
            },
            showSpaceFacetInShowMoreDialog: {
                type: "function",
            },
            getSpaceFacetId: {
                type: "function",
            },
            bNoAppSearch: {
                type: "bool",
            },
            bResetSearchTermOnQuickSelectDataSourceItemPress: {
                type: "bool",
            },
            FF_bSearchtermNoAsterisk: {
                type: "bool",
            },
            bPlaceHolderFixedValue: {
                type: "bool",
            },
            FF_bOptimizedQuickSelectDataSourceLabels: {
                type: "bool",
            },
            selectionChange: {
                type: "function",
            },
            metaDataJsonType: {
                type: "bool",
            },
            facetVisibility: {
                type: "bool",
            },
            defaultDataSource: {
                type: "string",
            },
            displayNoResultsPageBackButton: {
                type: "bool",
            },
            displayNoResultsPageSearchAllButton: {
                type: "bool",
            },
            displayFacetPanelInCaseOfNoResults: {
                type: "bool",
            },
            browserTitleOverwritten: {
                type: "bool",
            },
            isUshell: {
                type: "bool",
            },
            userDefinedDatasources: {
                type: "bool",
            },
        };
        // =======================================================================
        // search configuration
        // =======================================================================
        var SearchConfiguration = function () {
            this.init.apply(this, arguments);
        };
        SearchConfiguration.prototype = {
            /**
             * @this SearchConfiguration
             * @constructor
             */
            init: function (configuration) {
                if (configuration && Object.keys(configuration).length > 0 && !configuration.isUshell) {
                    // use configuration passed from caller
                    jQuery.extend(this, configuration);
                }
                else {
                    // use global ushell configuration
                    this.readUshellConfiguration();
                    this.readOutdatedUshellConfiguration();
                }
                if (configuration && configuration.isUshell) {
                    this.isUshell = true;
                }
                else {
                    // standalone ui doesn't call getModelSingleton in SearchModel.js
                    // set default false
                    this.isUshell = false;
                }
                // for parameters without values set the defaults
                this.setDefaults();
                // update config from URL parameters (demoMode, esDevConfig, ...)
                this.updateConfigFromUrlParameters();
                // set module load paths
                this.setModulePaths();
                // create default config for data sources
                this.createDefaultDataSourceConfig();
            },
            /**
             * @this sap.esh.search.ui.SearchConfiguration
             */
            setModulePaths: function () {
                if (!this.modulePaths) {
                    return;
                }
                for (var i = 0; i < this.modulePaths.length; ++i) {
                    var modulePath = this.modulePaths[i];
                    var urlPrefix = modulePath.urlPrefix.replace("${host}", window.location.protocol + "//" + window.location.host);
                    jQuery.sap.registerModulePath(modulePath.moduleName, urlPrefix);
                }
            },
            /**
             * @this sap.esh.search.ui.SearchConfiguration
             */
            readUshellConfiguration: function () {
                // read global config
                try {
                    var config = global["sap-ushell-config"].renderers.fiori2.componentData.config.esearch;
                    jQuery.extend(true, this, config);
                }
                catch (e) {
                    /* nothing to do.. */
                }
            },
            /**
             * @this sap.esh.search.ui.SearchConfiguration
             */
            readOutdatedUshellConfiguration: function () {
                try {
                    // get config
                    var config = global["sap-ushell-config"].renderers.fiori2.componentData.config;
                    // due to historical reasons the config parameter searchBusinessObjects is not in esearch but in parent object
                    // copy this parameter to config object
                    if (typeof config.searchBusinessObjects !== "undefined" &&
                        typeof this.searchBusinessObjects === "undefined") {
                        if (config.searchBusinessObjects === "hidden" ||
                            config.searchBusinessObjects === false) {
                            this.searchBusinessObjects = false;
                        }
                        else {
                            this.searchBusinessObjects = true;
                        }
                    }
                    // copy shell configuration parameter enableSearch to config object
                    if (typeof config.enableSearch !== "undefined" &&
                        typeof this.enableSearch === "undefined") {
                        this.enableSearch = config.enableSearch;
                    }
                }
                catch (e) {
                    /* nothing to do.. */
                }
            },
            /**
             * @this sap.esh.search.ui.SearchConfiguration
             */
            setDefaults: function () {
                if (typeof this.searchBusinessObjects === "undefined") {
                    this.searchBusinessObjects = true;
                }
                if (typeof this.odataProvider === "undefined") {
                    this.odataProvider = false;
                }
                if (typeof this.multiSelect === "undefined") {
                    this.multiSelect = true;
                }
                if (typeof this.charts === "undefined") {
                    this.charts = true;
                }
                if (typeof this.maps === "undefined") {
                    this.maps = undefined;
                }
                if (typeof this.mapProvider === "undefined") {
                    this.mapProvider = undefined;
                }
                if (typeof this.newpie === "undefined") {
                    this.newpie = false;
                }
                if (typeof this.dataSources === "undefined") {
                    this.dataSources = {};
                }
                if (typeof this.enableSearch === "undefined") {
                    this.enableSearch = true;
                }
                if (typeof this.personalizationStorage === "undefined") {
                    this.personalizationStorage = "auto";
                }
                if (typeof this.boSuggestions === "undefined") {
                    this.boSuggestions = false;
                }
                if (typeof this._eshClickableObjectType === "undefined") {
                    this._eshClickableObjectType = true;
                }
                if (typeof this.defaultSearchScopeApps === "undefined") {
                    this.defaultSearchScopeApps = false;
                }
                if (typeof this.searchScopeWithoutAll === "undefined") {
                    this.searchScopeWithoutAll = false;
                }
                if (typeof this.suggestionKeyboardRelaxationTime === "undefined") {
                    this.suggestionKeyboardRelaxationTime = 400;
                }
                if (typeof this.suggestionStartingCharacters === "undefined") {
                    this.suggestionStartingCharacters = 3;
                }
                if (typeof this.hideListView === "undefined") {
                    this.hideListView = false;
                }
                if (typeof this.defaultResultViewType === "undefined") {
                    this.defaultResultViewType = undefined; // undefined -> used value from local storage (see function loadResultViewType)
                }
                if (typeof this.gridView === "undefined") {
                    this.gridView = false;
                }
                if (typeof this.enableMultiSelectionResultItems === "undefined") {
                    this.enableMultiSelectionResultItems = false;
                }
                if (typeof this.updateUrl === "undefined") {
                    this.updateUrl = true;
                }
                if (typeof this.renderUrl === "undefined") {
                    this.renderUrl = this.renderUrl; // eslint-disable-line no-self-assign
                }
                if (typeof this.isSearchUrl === "undefined") {
                    this.isSearchUrl = this.isSearchUrl; // eslint-disable-line no-self-assign
                }
                if (typeof this.beforeNavigation === "undefined") {
                    this.beforeNavigation = this.beforeNavigation; // eslint-disable-line no-self-assign
                }
                if (typeof this.getCustomToolbar === "undefined") {
                    this.getCustomToolbar = this.getCustomToolbar; // eslint-disable-line no-self-assign
                }
                if (typeof this.getCustomNoResultScreen === "undefined") {
                    this.getCustomNoResultScreen = function () {
                        return;
                    };
                }
                if (typeof this.quickSelectDataSources === "undefined") {
                    this.quickSelectDataSources = [];
                }
                if (typeof this.initAsync === "undefined") {
                    this.initAsync = this.initAsync; // eslint-disable-line no-self-assign
                }
                if (typeof this.pageSize === "undefined") {
                    this.pageSize = 10;
                }
                if (typeof this.layoutUseResponsiveSplitter === "undefined") {
                    this.layoutUseResponsiveSplitter = false;
                }
                if (typeof this.facetPanelWidthInPercent === "undefined") {
                    this.facetPanelWidthInPercent = 25;
                }
                if (typeof this.FF_facetPanelUnifiedHeaderStyling === "undefined") {
                    this.FF_facetPanelUnifiedHeaderStyling = false;
                }
                if (typeof this.searchFilterBarShowWithFacets === "undefined") {
                    this.searchFilterBarShowWithFacets = false; // show search filter bar (filter-info) only if facets are NOT visible (default)
                }
                if (typeof this.searchBarDoNotHideForNoResults === "undefined") {
                    this.searchBarDoNotHideForNoResults = false;
                }
                if (typeof this.FF_layoutWithoutPage === "undefined") {
                    this.FF_layoutWithoutPage = false;
                }
                if (typeof this.searchInAttibuteFacetPostion === "undefined") {
                    this.searchInAttibuteFacetPostion = {};
                }
                if (typeof this.cleanUpSpaceFilters === "undefined") {
                    this.cleanUpSpaceFilters = this.cleanUpSpaceFilters; // eslint-disable-line no-self-assign
                }
                if (typeof this.setSearchInLabelIconBindings === "undefined") {
                    this.setSearchInLabelIconBindings = this.setSearchInLabelIconBindings; // eslint-disable-line no-self-assign
                }
                if (typeof this.getSearchInFacetListMode === "undefined") {
                    this.getSearchInFacetListMode = this.getSearchInFacetListMode; // eslint-disable-line no-self-assign
                }
                if (typeof this.checkAndSetSpaceIcon === "undefined") {
                    this.checkAndSetSpaceIcon = this.checkAndSetSpaceIcon; // eslint-disable-line no-self-assign
                }
                if (typeof this.hasSpaceFiltersOnly === "undefined") {
                    this.hasSpaceFiltersOnly = this.hasSpaceFiltersOnly; // eslint-disable-line no-self-assign
                }
                if (typeof this.showSpaceFacetInShowMoreDialog === "undefined") {
                    this.showSpaceFacetInShowMoreDialog = this.showSpaceFacetInShowMoreDialog; // eslint-disable-line no-self-assign
                }
                if (typeof this.getSpaceFacetId === "undefined") {
                    this.getSpaceFacetId = this.getSpaceFacetId; // eslint-disable-line no-self-assign
                }
                if (typeof this.bNoAppSearch === "undefined") {
                    this.bNoAppSearch = false;
                }
                if (typeof this.bResetSearchTermOnQuickSelectDataSourceItemPress === "undefined") {
                    this.bResetSearchTermOnQuickSelectDataSourceItemPress = false;
                }
                if (typeof this.FF_bSearchtermNoAsterisk === "undefined") {
                    this.FF_bSearchtermNoAsterisk = false;
                }
                if (typeof this.bPlaceHolderFixedValue === "undefined") {
                    this.bPlaceHolderFixedValue = false;
                }
                if (typeof this.FF_bOptimizedQuickSelectDataSourceLabels === "undefined") {
                    this.FF_bOptimizedQuickSelectDataSourceLabels = false;
                }
                if (typeof this.selectionChange === "undefined") {
                    this.selectionChange = function () { }; // dummy function
                }
                if (typeof this.metaDataJsonType === "undefined") {
                    this.metaDataJsonType = false;
                }
                if (typeof this.facetVisibility === "undefined") {
                    this.facetVisibility = undefined; // undefined -> uses value from personalization
                }
                if (typeof this.defaultDataSource === "undefined") {
                    this.defaultDataSource = undefined; // undefined -> uses first datasource after, see selectDataSource in SearchInputHelpPage
                }
                if (typeof this.displayNoResultsPageBackButton === "undefined") {
                    this.displayNoResultsPageBackButton = false;
                }
                if (typeof this.displayNoResultsPageSearchAllButton === "undefined") {
                    this.displayNoResultsPageSearchAllButton = false;
                }
                if (typeof this.displayFacetPanelInCaseOfNoResults === "undefined") {
                    this.displayFacetPanelInCaseOfNoResults = false;
                }
                if (typeof this.browserTitleOverwritten === "undefined") {
                    this.browserTitleOverwritten = true;
                }
                if (typeof this.userDefinedDatasources === "undefined") {
                    this.userDefinedDatasources = true;
                }
                // Prepare caching map for custom datasource configurations
                this.dataSourceConfigurations = {};
                this.dataSourceConfigurations_Regexes = []; // eslint-disable-line camelcase
                if (this.dataSources) {
                    for (var i = 0; i < this.dataSources.length; i++) {
                        var dataSourceConfig = this.dataSources[i];
                        if (dataSourceConfig.id) {
                            this.dataSourceConfigurations[dataSourceConfig.id] = dataSourceConfig;
                        }
                        else if (dataSourceConfig.regex) {
                            var flags = dataSourceConfig.regexFlags || undefined;
                            var regex = new RegExp(dataSourceConfig.regex, flags);
                            if (regex) {
                                dataSourceConfig.regex = regex;
                                this.dataSourceConfigurations_Regexes.push(dataSourceConfig);
                            }
                        }
                        else {
                            var message = "Following datasource configuration does neither include a valid id nor a regular expression, therefore it is ignored:\n" +
                                JSON.stringify(dataSourceConfig);
                            Log.warning(message, "sap.esh.search.ui.SearchConfiguration");
                        }
                    }
                }
                this.dataSources = undefined;
                // Special logic for Document Result List Item
                // this.dataSourceConfigurations['fileprocessorurl'] = this.dataSourceConfigurations['fileprocessorurl'] || {};
                // this.dataSourceConfigurations['fileprocessorurl'].searchResultListItem = this.dataSourceConfigurations['fileprocessorurl'].searchResultListItem || 'sap.esh.search.ui.controls.SearchResultListItemDocument';
                this.documentDataSource = {
                    searchResultListItem: "sap.esh.search.ui.controls.SearchResultListItemDocument",
                };
                // Special logic for Note Result List Item
                // TODO: sinaNext does not pass trough the semantic object names any longer, so the following does not work any longer:
                this.dataSourceConfigurations.noteprocessorurl =
                    this.dataSourceConfigurations.noteprocessorurl || {};
                this.dataSourceConfigurations.noteprocessorurl.searchResultListItem =
                    this.dataSourceConfigurations.noteprocessorurl.searchResultListItem ||
                        "sap.esh.search.ui.controls.SearchResultListItemNote";
                this.dataSourceConfigurations.noteprocessorurl.searchResultListSelectionHandler =
                    this.dataSourceConfigurations.noteprocessorurl.searchResultListSelectionHandler ||
                        "sap.esh.search.ui.controls.SearchResultListSelectionHandlerNote";
            },
            /**
             * @this sap.esh.search.ui.SearchConfiguration
             */
            createDefaultDataSourceConfig: function () {
                this.defaultDataSourceConfig = {
                    searchResultListItem: undefined,
                    searchResultListItemControl: undefined,
                    searchResultListItemContent: undefined,
                    searchResultListItemContentControl: undefined,
                    searchResultListSelectionHandler: DefaultSearchResultListSelectionHandlerModuleName,
                    searchResultListSelectionHandlerControl: DefaultSearchResultListSelectionHandlerControl,
                };
            },
            /**
             * @this sap.esh.search.ui.SearchConfiguration
             */
            updateConfigFromUrlParameters: function () {
                var parameters = this.parseUrlParameters();
                for (var parameter in parameters) {
                    if (parameter === "demoMode") {
                        this.searchBusinessObjects = true;
                        this.enableSearch = true;
                        continue;
                    }
                    var parameterMetaData = urlParameterMetaData[parameter];
                    if (!parameterMetaData) {
                        continue;
                    }
                    var value = parameters[parameter];
                    if (parameter === "esDevConfig") {
                        var config = JSON.parse(value);
                        Object.assign(this, config);
                        continue;
                    }
                    switch (parameterMetaData.type) {
                        case "bool":
                            value = value === "true" || value === "";
                            break;
                        default:
                    }
                    this[parameter] = value;
                }
            },
            /**
             * @this sap.esh.search.ui.SearchConfiguration
             */
            parseUrlParameters: function () {
                if (!URLSearchParams) {
                    return {};
                }
                var urlSearchParams = new URLSearchParams(window.location.search);
                return Object.fromEntries(urlSearchParams.entries());
            },
            /**
             * @this sap.esh.search.ui.SearchConfiguration
             */
            parseSearchUrlParameters: function (oSearchParameters) {
                return oSearchParameters;
            },
            /**
             * @this sap.esh.search.ui.SearchConfiguration
             */
            // use this as an early initialization routine
            loadCustomModulesAsync: function () {
                var that = this;
                if (that._loadCustomModulesProm) {
                    return that._loadCustomModulesProm;
                }
                var dataSourceConfigurationProm, dataSourceConfigurationsProms = [];
                for (var dataSourceId in that.dataSourceConfigurations) {
                    dataSourceConfigurationProm =
                        that.loadCustomModulesForDataSourceIdAsync(dataSourceId);
                    dataSourceConfigurationsProms.push(dataSourceConfigurationProm);
                }
                that._loadCustomModulesProm = Promise.all(dataSourceConfigurationsProms);
                return that._loadCustomModulesProm;
            },
            /**
             * @this sap.esh.search.ui.SearchConfiguration
             */
            loadCustomModulesForDataSourcesAsync: function (dataSources, dataSourcesHints) {
                var dataSourcesLoadingProms = [];
                for (var i = 0; i < dataSources.length; i++) {
                    var dataSourceHints = (Array.isArray(dataSourcesHints) &&
                        dataSourcesHints.length > i &&
                        dataSourcesHints[i]) ||
                        {};
                    var dataSourceLoadingProm = this.loadCustomModulesForDataSourceAsync(dataSources[i], dataSourceHints);
                    dataSourcesLoadingProms.push(dataSourceLoadingProm);
                }
                return Promise.all(dataSourcesLoadingProms);
            },
            /**
             * @this sap.esh.search.ui.SearchConfiguration
             */
            loadCustomModulesForDataSourceAsync: function (dataSource, dataSourceHints) {
                dataSourceHints = dataSourceHints || {};
                return this.loadCustomModulesForDataSourceIdAsync(dataSource.id, dataSourceHints);
            },
            /**
             * @this sap.esh.search.ui.SearchConfiguration
             */
            loadCustomModulesForDataSourceIdAsync: function (dataSourceId, dataSourceHints) {
                if (!dataSourceId) {
                    return Promise.resolve();
                }
                this._dataSourceLoadingProms = this._dataSourceLoadingProms || {};
                var dataSourceLoadingProm = this._dataSourceLoadingProms[dataSourceId];
                if (!dataSourceLoadingProm) {
                    var customControlAttrNames = [
                        {
                            moduleAttrName: "searchResultListItem",
                            controlAttrName: "searchResultListItemControl",
                        },
                        {
                            moduleAttrName: "searchResultListItemContent",
                            controlAttrName: "searchResultListItemContentControl",
                        },
                        {
                            moduleAttrName: "searchResultListSelectionHandler",
                            controlAttrName: "searchResultListSelectionHandlerControl",
                        },
                    ];
                    var dataSourceConfiguration = this._prepareDataSourceConfigurationForDataSource(dataSourceId, dataSourceHints);
                    var customControlProm, customControlProms = [];
                    for (var i = 0; i < customControlAttrNames.length; i++) {
                        customControlProm = this._doLoadCustomModulesAsync(dataSourceId, dataSourceConfiguration, customControlAttrNames[i].moduleAttrName, customControlAttrNames[i].controlAttrName);
                        customControlProms.push(customControlProm);
                    }
                    dataSourceLoadingProm = Promise.all(customControlProms);
                    dataSourceLoadingProm._resolvedOrFailed = false;
                    dataSourceLoadingProm.then(function () {
                        dataSourceLoadingProm._resolvedOrFailed = true;
                    });
                    this._dataSourceLoadingProms[dataSourceId] = dataSourceLoadingProm;
                }
                return dataSourceLoadingProm;
            },
            /**
             * @this sap.esh.search.ui.SearchConfiguration
             */
            // Helper function to keep 'dataSourceConfiguration' instance unchanged within
            // its scope while the main function loops over all instances
            _doLoadCustomModulesAsync: function (dataSourceId, dataSourceConfiguration, moduleAttrName, controlAttrName, defaultModuleName, defaultControl) {
                var that = this;
                return new Promise(function (resolve) {
                    if (dataSourceConfiguration[moduleAttrName] &&
                        (!dataSourceConfiguration[controlAttrName] ||
                            dataSourceConfiguration[controlAttrName] ==
                                that.defaultDataSourceConfig[controlAttrName])) {
                        try {
                            sap.ui.require([dataSourceConfiguration[moduleAttrName].replace(/[.]/g, "/")], function (customControl) {
                                dataSourceConfiguration[controlAttrName] = customControl;
                                resolve();
                            });
                        }
                        catch (e) {
                            var message = "Could not load custom module '" +
                                dataSourceConfiguration[moduleAttrName] +
                                "' for data source with id '" +
                                dataSourceId +
                                "'. ";
                            message += "Falling back to default data source configuration.";
                            Log.warning(message, "sap.esh.search.ui.SearchConfiguration");
                            dataSourceConfiguration[moduleAttrName] =
                                defaultModuleName || that.defaultDataSourceConfig[moduleAttrName];
                            dataSourceConfiguration[controlAttrName] =
                                defaultControl || that.defaultDataSourceConfig[controlAttrName];
                            resolve();
                        }
                    }
                    else {
                        if (!dataSourceConfiguration[controlAttrName]) {
                            dataSourceConfiguration[moduleAttrName] =
                                defaultModuleName || that.defaultDataSourceConfig[moduleAttrName];
                            dataSourceConfiguration[controlAttrName] =
                                defaultControl || that.defaultDataSourceConfig[controlAttrName];
                        }
                        resolve();
                    }
                });
            },
            /**
             * @this sap.esh.search.ui.SearchConfiguration
             */
            getDataSourceConfig: function (dataSource) {
                if (this._dataSourceLoadingProms &&
                    this._dataSourceLoadingProms[dataSource.id] &&
                    !this._dataSourceLoadingProms[dataSource.id]._resolvedOrFailed) {
                    // Return the default data source if the custom modules
                    // for this particular data source aren't loaded yet.
                    return this.defaultDataSourceConfig;
                }
                var config = this.dataSourceConfigurations[dataSource.id];
                if (!config) {
                    config = this.defaultDataSourceConfig;
                    this.dataSourceConfigurations[dataSource.id] = config;
                }
                return config;
            },
            /**
             * @this sap.esh.search.ui.SearchConfiguration
             */
            _prepareDataSourceConfigurationForDataSource: function (dataSourceId, dataSourcesHints) {
                var dataSourceConfiguration = {};
                if (this.dataSourceConfigurations[dataSourceId]) {
                    dataSourceConfiguration = this.dataSourceConfigurations[dataSourceId];
                }
                else {
                    for (var i = 0; i < this.dataSourceConfigurations_Regexes.length; i++) {
                        if (this.dataSourceConfigurations_Regexes[i].regex.test(dataSourceId)) {
                            dataSourceConfiguration = this.dataSourceConfigurations_Regexes[i];
                            break;
                        }
                    }
                }
                // Use SearchResultListItemDocument control for document-like objects.
                // Can be overriden by another control in ushell configuration.
                if (dataSourcesHints && dataSourcesHints.isDocumentConnector) {
                    if (!dataSourceConfiguration.searchResultListItem) {
                        dataSourceConfiguration.searchResultListItem =
                            this.documentDataSource.searchResultListItem;
                    }
                    else {
                        var message = "Will attempt to load '" +
                            dataSourceConfiguration.searchResultListItem +
                            "' instead of '" +
                            this.documentDataSource.searchResultListItem +
                            "' for data source '" +
                            dataSourceId +
                            "'";
                        Log.warning(message, "sap.esh.search.ui.SearchConfiguration");
                    }
                }
                this.dataSourceConfigurations[dataSourceId] = dataSourceConfiguration;
                return dataSourceConfiguration;
            },
            /**
             * @this sap.esh.search.ui.SearchConfiguration
             */
            getSina: function () {
                return {}; // dummy DO NOT USE
            },
            /**
             * @this sap.esh.search.ui.SearchConfiguration
             */
            renderSearchUrl: function (properties) {
                return "#Action-search&/top=" + properties.top + "&filter=" + properties.filter;
            },
            /**
             * @this sap.esh.search.ui.SearchConfiguration
             */
            isSearchUrl: function (url) {
                return url.indexOf("#Action-search") === 0;
            },
            /**
             * @this sap.esh.search.ui.SearchConfiguration
             */
            getCustomToolbar: function () {
                return [];
            },
            /**
             * @this sap.esh.search.ui.SearchConfiguration
             */
            initAsync: function () {
                return;
            },
            /**
             * @this sap.esh.search.ui.SearchConfiguration
             */
            beforeNavigation: function () {
                return;
            },
        };
        SearchConfiguration.create = function (configuration) {
            return new SearchConfiguration(configuration);
        };
        return SearchConfiguration;
    });
})(window);
