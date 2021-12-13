/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
// @ts-check
sap.ui.define([
    "./i18n",
    "sap/base/Log",
    "./error/ErrorHandler",
    "sap/m/MessageBox",
    "sap/esh/search/ui/SearchHelper",
    "sap/esh/search/ui/SearchResultListFormatter",
    "sap/esh/search/ui/SearchFacetsFormatter",
    "sap/esh/search/ui/SearchTabStripsFormatter",
    "sap/esh/search/ui/suggestions/SuggestionHandler",
    "sap/esh/search/ui/SearchConfiguration",
    "sap/esh/search/ui/personalization/PersonalizationStorage",
    "sap/esh/search/ui/eventlogging/EventLogger",
    "sap/esh/search/ui/SearchUrlParser",
    "sap/esh/search/ui/cFLPUtil",
    "sap/esh/search/ui/usercategories/UserCategoryManager",
    "sap/esh/search/ui/error/errors",
], 
/**
 * @param {*} i18n
 * @param {*} Log
 * @param {sap.esh.search.ui.error.ErrorHandler} ErrorHandler
 * @param {sap.m.MessageBox} MessageBox
 * @param {*} SearchHelper
 * @param {*} SearchResultListFormatter
 * @param {*} SearchFacetsFormatter
 * @param {*} SearchTabStripsFormatter
 * @param {*} SuggestionHandler
 * @param {*} SearchConfiguration
 * @param {*} PersonalizationStorage
 * @param {*} EventLogger
 * @param {*} SearchUrlParser
 * @param {*} cFLPUtil
 * @param {*} UserCategoryManager
 * @param {sap.esh.search.ui.error.errors} errors
 * @returns
 */
function (i18n, Log, ErrorHandler, MessageBox, SearchHelper, SearchResultListFormatter, SearchFacetsFormatter, SearchTabStripsFormatter, SuggestionHandler, SearchConfiguration, PersonalizationStorage, EventLogger, SearchUrlParser, cFLPUtil, UserCategoryManager, errors) {
    ("use strict");
    var SearchShellHelper;
    // =======================================================================
    // search model
    // =======================================================================
    sap.esh.search.ui.searchModels = {};
    sap.esh.search.ui.getModelSingleton = function (configuration, id) {
        id = id || "default";
        if (!sap.esh.search.ui.searchModels[id]) {
            configuration.isUshell = id === "flp" ? true : false;
            sap.esh.search.ui.searchModels[id] = new sap.esh.search.ui.SearchModel({
                configuration: configuration,
            });
        }
        return sap.esh.search.ui.searchModels[id];
    };
    var SearchModel = sap.ui.model.json.JSONModel.extend("sap.esh.search.ui.SearchModel", {
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        constructor: function (properties) {
            var that = this;
            properties = properties || {};
            // call base class constructor
            sap.ui.model.json.JSONModel.prototype.constructor.apply(that, []);
            // get search configuration
            that.config = SearchConfiguration.create(properties.configuration);
            // set size limit in order to allow drop down list boxes with more than 100 entries
            that.setSizeLimit(1000);
            // create suggestions handler
            that.suggestionHandler = new SuggestionHandler({
                model: this,
            });
            that.errorHandler = new sap.esh.search.ui.error.ErrorHandler({
                model: this,
            });
            // decorate search methods (decorator prevents request overtaking)
            that.searchApplications = SearchHelper.refuseOutdatedRequests(that.searchApplications, "search"); // app search
            // initial values for boTop and appTop
            that.pageSize = this.config.pageSize || 10;
            that.appTopDefault = 20;
            that.boTopDefault = that.pageSize;
            // init the properties
            // TODO: always use main result list (also for pure app results)
            that.setProperty("/isQueryInvalidated", true); // force request if query did not change
            that.setProperty("/isBusy", false); //show a busy indicator?
            that.setProperty("/busyDelay", 0); //delay before showing busy indicator, initalize with 0 for intial app loading
            that.setProperty("/tableColumns", []); // columns of table design
            that.setProperty("/tableSortableColumns", []); // sort items of table design
            that.setProperty("/tableResults", []); // results suitable for table view
            that.setProperty("/results", []); // combined result list: apps + bos
            that.setProperty("/appResults", []); // applications result list
            that.setProperty("/boResults", []); // business object result list
            that.setProperty("/origBoResults", []); // business object result list
            that.setProperty("/count", 0);
            that.setProperty("/countText", "");
            that.setProperty("/boCount", 0);
            that.setProperty("/appCount", 0);
            that.setProperty("/facets", []);
            that.setProperty("/dataSources", [that.allDataSource, that.appDataSource]);
            that.setProperty("/appSearchDataSource", null);
            that.setProperty("/currentPersoServiceProvider", null); // current persoServiceProvider of table
            that.setProperty("/businessObjSearchEnabled", true);
            that.setProperty("/initializingObjSearch", false);
            that.setProperty("/suggestions", []);
            that.setProperty("/resultToDisplay", that.config.defaultResultViewType || SearchHelper.loadResultViewType()); // type of search result to display
            that.setProperty("/displaySwitchVisibility", false); // visibility of display switch tap strip
            that.setProperty("/documentTitle", "Search");
            that.setProperty("/top", that.boTopDefault);
            that.setProperty("/orderBy", {});
            that.setProperty("/facetVisibility", false); // visibility of facet panel
            that.setProperty("/focusIndex", 0);
            that.setProperty("/errors", []);
            that.setProperty("/isErrorPopovered", false);
            this.setProperty("/nlqSuccess", false);
            this.setProperty("/nlqDescription", "");
            this.setProperty("/firstSearchWasExecuted", false);
            that.setProperty("/multiSelectionAvailable", false); //
            that.setProperty("/multiSelectionEnabled", false); //
            that.setProperty("/multiSelection/actions", []); //
            that.setProperty("/multiSelectionSelected", false);
            that.setProperty("/multiSelectionObjects", []);
            that.setProperty("/singleSelectionSelected", false);
            that.setProperty("/inputHelpSelectedItems", null);
            that.setProperty("/inputHelp", null);
            that.setProperty("/config", that.config);
            that.setProperty("/searchInLabel", "");
            that.setProperty("/searchInIcon", "sap-icon://none"); // prevent assert: Property 'src' (value: '') should be a valid Icon ...'
            // used for SearchFacetDialogModel: SearchFacetDialogModel is constructed with reference to original searchMode
            // the _initBusinessObjSearchProm is reused from original searchModel in order to avoid double initialization
            // in initBusinessObjSearch
            if (properties.searchModel && properties.searchModel._initBusinessObjSearchProm) {
                that._initBusinessObjSearchProm = properties.searchModel._initBusinessObjSearchProm;
                that.oFacetFormatter = new SearchFacetsFormatter(that);
            }
            that.subscribers = [];
            // initialize enterprise search
            that.initBusinessObjSearch();
            that.searchUrlParser = new SearchUrlParser({
                model: this,
            });
            that.userCategoryManagerPromise = null;
            that.tempDataSources = [];
        },
        // ################################################################################
        // Initialization:
        // ################################################################################
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        createSina: function () {
            // do not use path /sap/ushell/renderers/fiori2/search/sinaNext/sina/sinaFactory
            //
            // in core-ex-light-0     sap/ushell/renderers/fiori2/search/sinaNext/sina/sinaFactory is included
            // which is different to /sap/ushell/renderers/fiori2/search/sinaNext/sina/sinaFactory
            //
            // using /sap/ushell/renderers/fiori2/search/sinaNext/sina/sinaFactory
            // seems to work but cause the module to be loaded twice causing strange effects
            var sinaFactory;
            return SearchHelper.require(["sap/esh/search/ui/sinaNexTS/sina/sinaFactory"]).then(function (modules) {
                sinaFactory = modules[0];
                // no enterprise search configured -> return dummy sina
                if (!this.config.searchBusinessObjects) {
                    return sinaFactory.createAsync("dummy");
                }
                // use url parameter
                // sinaConfiguration={"provider":"multi","subProviders":["abap_odata","inav2","sample"],"federationType":"round_robin"}
                // to active the multi provider
                var trials = [];
                if (window.location.href.indexOf("demo/FioriLaunchpad.") !== -1) {
                    trials = ["sample"];
                }
                else {
                    trials = [
                        //{provider: 'multi', subProviders: ['abap_odata', 'inav2', 'sample'], federationType: 'round_robin'},
                        //{provider: "multi", subProviders: [{ provider: "abap_odata", label: "a1", url: "/unvalid" }, { provider: "abap_odata", label: "a2", url: "/unvalid" }]},
                        "abap_odata",
                        "inav2",
                        "dummy",
                    ];
                }
                // cFlp
                return cFLPUtil.readCFlpConfiguration(trials).then(function (trials) {
                    // sina configuration from flp overwrites
                    if (this.config.sinaConfiguration) {
                        trials = [this.config.sinaConfiguration];
                    }
                    for (var _i = 0, trials_1 = trials; _i < trials_1.length; _i++) {
                        var sinaConfig = trials_1[_i];
                        var sinaLog = Log.getLogger("sap.esh.search.ui.eshclient");
                        sinaConfig.logTarget = sinaLog;
                        sinaConfig.logLevel = sinaLog.getLevel();
                    }
                    // try to create a sina by trying providers, first succesful provider wins
                    return sinaFactory.createByTrialAsync(trials);
                }.bind(this));
            }.bind(this));
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        initBusinessObjSearch: function () {
            // check cached promise
            var that = this;
            if (that._initBusinessObjSearchProm) {
                return that._initBusinessObjSearchProm;
            }
            // set dummy datasource indicating the loading phase
            that.setProperty("/initializingObjSearch", true);
            that.setProperty("/isBusy", true);
            var dummyDataSourceForLoadingPhase = {
                label: i18n.getText("genericLoading"),
                labelPlural: i18n.getText("genericLoading"),
                enabled: false,
                id: "$$Loading$$",
            };
            that.setProperty("/dataSource", dummyDataSourceForLoadingPhase);
            that.setProperty("/dataSources", [dummyDataSourceForLoadingPhase]);
            // create sina async
            that._initBusinessObjSearchProm = PersonalizationStorage.create(this.config.personalizationStorage, this.config.isUshell)
                .then(function (personalizationStorage) {
                that.personalizationStorage = personalizationStorage;
                that.initFacetVisibility();
                return that.createSina();
            })
                .then(function (sina) {
                that.sinaNext = sina;
                return UserCategoryManager.create({
                    sina: sina,
                    personalizationStorage: that.personalizationStorage,
                });
            })
                .then(function (userCategoryManager) {
                that.userCategoryManager = userCategoryManager;
                that.eventLogger = EventLogger.newInstance({
                    sinaNext: that.sinaNext,
                });
                that.eventLogger.logEvent({
                    type: that.eventLogger.SESSION_START,
                });
                if (that.sinaNext.provider.id !== "abap_odata"
                // && that.sinaNext.provider.id !== "multi"
                ) {
                    that.config.userDefinedDatasources = false;
                    that.userCategoryManager.setFavActive(false);
                }
                that.createAllAndAppDataSource();
                //set default DataSource
                that.setProperty("/defaultDataSource", that.calculateDefaultDataSource());
                if (that.sinaNext.provider.id === "dummy") {
                    that.setProperty("/defaultDataSource", that.appDataSource);
                    that.setProperty("/businessObjSearchEnabled", false);
                    that.config.searchBusinessObjects = false;
                    that.setFacetVisibility(false, false);
                }
                if (that.sinaNext.provider.id === "inav2" && that.config.isUshell) {
                    // register enterprise search system
                    // this triggers a logoff request to the enteprise search backend in case of logoff from flp
                    // (this is not necessary for abap_odata because frontendserver system is registered by flp)
                    // load ushell deps lazy only in case of FLP
                    sap.ui.require(["sap/ushell/System"], function (System) {
                        sap.ushell.Container.addRemoteSystem(new System({
                            alias: "ENTERPRISE_SEARCH",
                            platform: "abap",
                            baseUrl: "/ENTERPRISE_SEARCH",
                        }));
                    });
                }
                that.setProperty("/uiFilter", that.sinaNext.createFilter());
                that.loadDataSources();
                that.resetDataSource(false);
                that.resetFilterConditions(false);
                //that.config.loadCustomModulesAsync();
                that.query = that.sinaNext.createSearchQuery();
                if (that.config.multiSelect) {
                    that.query.setMultiSelectFacets(true);
                }
                that.oFacetFormatter = new SearchFacetsFormatter(that);
                that.tabStripFormatter = new SearchTabStripsFormatter.Formatter(that.allDataSource);
                that.dataSourceTree = that.tabStripFormatter.tree;
                that.setProperty("/initializingObjSearch", false);
                that.setProperty("/isBusy", false);
            }, function (error) {
                that.errorHandler.onError(error);
                return Promise.reject();
            })
                .then(function () {
                that.config.initAsync(that);
            })
                .then(function () {
                if (sap &&
                    sap.ushell &&
                    sap.ushell.Container &&
                    sap.ushell.Container.getServiceAsync) {
                    return sap.ushell.Container.getServiceAsync("VisualizationInstantiation");
                }
                else {
                    // stand alone ui doesn't have sap.ushell.Container
                    return Promise.resolve();
                }
            })
                .then(function (service) {
                if (service !== undefined) {
                    that.uShellVisualizationInstantiationService = service;
                }
            });
            return that._initBusinessObjSearchProm;
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        calculateDefaultDataSource: function () {
            var defaultDataSource = this.allDataSource;
            if (this.userCategoryManager.isFavActive()) {
                // set user definded dataSource as default
                defaultDataSource = this.userCategoryManager.getCategory("MyFavorites");
            }
            if (this.config.defaultSearchScopeApps) {
                // according config parameter, Apps as default
                defaultDataSource = this.appDataSource;
            }
            if (this.config.defaultDataSource) {
                // according config parameter, default dataSource id
                defaultDataSource = this.sinaNext.getDataSource(this.config.defaultDataSource);
            }
            return defaultDataSource;
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        initFacetVisibility: function () {
            // check configuration
            if (typeof this.config.facetVisibility !== "undefined") {
                this.setFacetVisibility(this.config.facetVisibility, false);
                return;
            }
            // check personalization
            var facetsVisible = false;
            try {
                facetsVisible = this.personalizationStorage.getItem("search-facet-panel-button-state");
                // eslint-disable-next-line no-empty
            }
            catch (e) { }
            this.setFacetVisibility(facetsVisible, false);
        },
        // ################################################################################
        // Get the state of things:
        // ################################################################################
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        isBusinessObjSearchConfigured: function () {
            try {
                var config = window["sap-ushell-config"].renderers.fiori2.componentData.config;
                return config.searchBusinessObjects !== "hidden";
            }
            catch (e) {
                return true;
            }
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        isBusinessObjSearchEnabled: function () {
            // TODO: how does this differ from isBusinessObjSearchConfigured() above?
            return this.getProperty("/businessObjSearchEnabled");
        },
        // ################################################################################
        // Getter/Setter:
        // ################################################################################
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        setProperty: function (name) {
            var that = this;
            try {
                var res = sap.ui.model.json.JSONModel.prototype.setProperty.apply(this, arguments);
                switch (name) {
                    case "/boResults":
                    case "/appResults":
                        that.calculateResultList();
                        break;
                    case "/appCount":
                    case "/boCount":
                        res = that.setProperty("/count", that.getProperty("/appCount") + that.getProperty("/boCount"));
                        break;
                    case "/count":
                        res = that.setProperty("/countText", that._calculateCountText());
                        break;
                    default:
                        break;
                }
                return res;
            }
            catch (error) {
                that.errorHandler.onError(error);
            }
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        _calculateCountText: function () {
            var that = this;
            var count = that.getProperty("/count");
            if (count > 0) {
                if (that.getProperty("/nlqSuccess")) {
                    return that.getProperty("/nlqDescription");
                }
                if (typeof count !== "number") {
                    return "";
                }
                var countAsStr = SearchHelper.formatInteger(count);
                // DWC exit
                if (that.getProperty("/searchInLabel")) {
                    return ((that.getProperty("/searchInLabel") || i18n.getText("results")) +
                        " (" +
                        countAsStr +
                        ")");
                }
                return i18n.getText("results") + " (" + countAsStr + ")";
            }
            return "";
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        getPersonalizationStorageInstance: function () {
            return this.personalizationStorage;
        },
        // TODO: move to datasource
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        getSearchBoxTerm: function () {
            return this.getProperty("/uiFilter/searchTerm") || "";
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        setSearchBoxTerm: function (searchTerm, fireQuery) {
            var that = this;
            var searchTermTrimLeft = searchTerm.replace(/^\s+/, ""); // TODO: rtl
            this.setProperty("/uiFilter/searchTerm", searchTermTrimLeft);
            this.calculateSearchButtonStatus();
            if (fireQuery || fireQuery === undefined) {
                that._firePerspectiveQuery();
            }
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        getLastSearchTerm: function () {
            return this.query.getSearchTerm();
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        setFacetVisibility: function (visibility, fireQuery) {
            if (sap.ui.Device.system.phone) {
                visibility = false;
            }
            // set new value
            this.setProperty("/facetVisibility", visibility);
            // Set button status in sap storage
            try {
                this.personalizationStorage.setItem("search-facet-panel-button-state", visibility);
                // eslint-disable-next-line no-empty
            }
            catch (e) { }
            // fire query
            // "& visibility" removed in order to trigger search reqest when
            // (1) search term changed (but no enter)
            // (2) close facet panel
            if (fireQuery || fireQuery === undefined /*& visibility*/) {
                this._firePerspectiveQuery({
                    preserveFormerResults: true,
                });
            }
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        getFacetVisibility: function () {
            return this.getProperty("/facetVisibility");
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        getTop: function () {
            return this.getProperty("/top");
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        setTop: function (top, fireQuery) {
            this.setProperty("/top", top);
            if (fireQuery || fireQuery === undefined) {
                this._firePerspectiveQuery({
                    preserveFormerResults: true,
                });
            }
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        resetTop: function () {
            this.setProperty("/focusIndex", 0);
            if (this.isAppCategory()) {
                this.setTop(this.appTopDefault, false);
            }
            else {
                this.setTop(this.boTopDefault, false);
            }
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        getOrderBy: function () {
            return this.getProperty("/orderBy");
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        setOrderBy: function (orderBy, fireQuery) {
            this.setProperty("/orderBy", orderBy);
            if (fireQuery || fireQuery === undefined) {
                this._firePerspectiveQuery({
                    preserveFormerResults: true,
                });
            }
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        resetOrderBy: function (fireQuery) {
            this.setProperty("/orderBy", {});
            if (fireQuery || fireQuery === undefined) {
                this._firePerspectiveQuery({
                    preserveFormerResults: true,
                });
            }
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        isEqualOrderBy: function (modelOrderBy, queryOrderBy) {
            // 1) no sort order given
            if (!modelOrderBy.orderBy) {
                return queryOrderBy.length === 0;
            }
            // 2) sort order given
            if (queryOrderBy.length !== 1) {
                return false;
            }
            var queryOrderByElement = queryOrderBy[0];
            if (queryOrderByElement.id !== modelOrderBy.orderBy) {
                return false;
            }
            if (modelOrderBy.sortOrder === "ASC") {
                return queryOrderByElement.order === this.sinaNext.SortOrder.Ascending;
            }
            return queryOrderByElement.order === this.sinaNext.SortOrder.Descending;
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        isPersSearchScopeActive: function () {
            return this.persSearchScopeActive;
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        getDocumentTitle: function () {
            var searchTerm = this.getSearchBoxTerm();
            var dataSourceLabel = this.getDataSource().labelPlural || this.getDataSource().label;
            var title;
            if (this.getDataSource() === this.allDataSource) {
                title = i18n.getText("searchTileTitleProposalAll", [searchTerm]);
            }
            else {
                title = i18n.getText("searchTileTitleProposal", [searchTerm, dataSourceLabel]);
            }
            return title;
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        resetQuery: function () {
            if (this.getProperty("/initializingObjSearch")) {
                return;
            }
            SearchHelper.hasher.reset();
            this.resetTop();
            this.setSearchBoxTerm("", false);
            this.resetDataSource(false);
            this.resetFilterConditions(false);
            this.query.resetConditions();
            this.query.setSearchTerm("random-jgfhfdskjghrtekjhg");
            this.setProperty("/facets", []);
            this.setProperty("/results", []);
            this.setProperty("/appResults", []);
            this.setProperty("/boResults", []);
            this.setProperty("/origBoResults", []);
            this.setProperty("/count", 0);
            this.setProperty("/boCount", 0);
            this.setProperty("/appCount", 0);
        },
        // ################################################################################
        // Everything Datasource:
        // ################################################################################
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        createAllAndAppDataSource: function () {
            // all data source
            this.allDataSource = this.sinaNext.getAllDataSource();
            this.allDataSource.label = i18n.getText("label_all");
            this.allDataSource.labelPlural = i18n.getText("label_all");
            // app datasource
            this.appDataSource = this.sinaNext._createDataSource({
                id: "$$APPS$$",
                label: i18n.getText("label_apps"),
                labelPlural: i18n.getText("label_apps"),
                type: this.sinaNext.DataSourceType.Category,
            });
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        getUserCategoryManager: function () {
            //caching
            if (this.userCategoryManagerPromise) {
                return this.userCategoryManagerPromise;
            }
            //create
            this.userCategoryManagerPromise = this.initBusinessObjSearch().then(function () {
                return this.userCategoryManager;
            }.bind(this));
            return this.userCategoryManagerPromise;
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        loadDataSources: function () {
            var that = this;
            // get all datasources from sina
            var dataSources = this.sinaNext.getBusinessObjectDataSources();
            dataSources = dataSources.slice();
            // exclude app search datasource
            var dataSourcesWithOutAppSearch = [];
            dataSources.forEach(function (dataSource) {
                if (!dataSource.usage.appSearch) {
                    dataSourcesWithOutAppSearch.push(dataSource);
                    // if (dataSource.log && dataSource.log.messages) {
                    //     that.transferLog(dataSource.log);
                    // }
                }
                else {
                    that.setProperty("/appSearchDataSource", dataSource);
                }
            });
            //Check "Use Personalized Search Scope" is active
            if (that.userCategoryManager.isFavActive()) {
                dataSourcesWithOutAppSearch.splice(0, 0, that.userCategoryManager.getCategory("MyFavorites"));
                that.favDataSource = that.userCategoryManager.getCategory("MyFavorites");
            }
            // add app and all datasource
            if (!this.config.odataProvider && this.config.isUshell) {
                dataSourcesWithOutAppSearch.splice(0, 0, this.appDataSource);
            }
            if (!this.config.searchScopeWithoutAll) {
                dataSourcesWithOutAppSearch.splice(0, 0, this.allDataSource);
            }
            else {
                if (!this.config.defaultDataSource && !that.userCategoryManager.isFavActive()) {
                    // without all dataSource and no default dataSource, set the first item as default
                    this.setProperty("/defaultDataSource", dataSourcesWithOutAppSearch[0]);
                }
            }
            // set property
            this.setProperty("/dataSources", dataSourcesWithOutAppSearch);
            this.setProperty("/searchTermPlaceholder", this.calculatePlaceholder());
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        resetDataSource: function (fireQuery) {
            this.setDataSource(this.getDefaultDataSource(), fireQuery);
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        isAllCategory: function () {
            var ds = this.getProperty("/uiFilter/dataSource");
            return ds === this.allDataSource;
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        isOtherCategory: function () {
            var ds = this.getProperty("/uiFilter/dataSource");
            return ((ds.type === this.sinaNext.DataSourceType.Category ||
                ds.type === this.sinaNext.DataSourceType.UserCategory) &&
                !this.isAllCategory());
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        isAppCategory: function () {
            var ds = this.getProperty("/uiFilter/dataSource");
            return ds === this.appDataSource;
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        getDataSource: function () {
            return this.getProperty("/uiFilter/dataSource");
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        getDefaultDataSource: function () {
            return this.getProperty("/defaultDataSource");
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        setDataSource: function (dataSource, fireQuery, resetTop) {
            if (this.getDataSource() !== dataSource) {
                this.eventLogger.logEvent({
                    type: this.eventLogger.DATASOURCE_CHANGE,
                    dataSourceId: dataSource.id,
                });
            }
            this.updateDataSourceList(dataSource);
            this.getProperty("/uiFilter").setDataSource(dataSource);
            if (resetTop || resetTop === undefined) {
                this.resetTop();
            }
            this.setProperty("/searchTermPlaceholder", this.calculatePlaceholder());
            this.calculateSearchButtonStatus();
            // workaround: force dropdown listbox to update
            // workaround removed because this causes double change events
            // for datasource dropdown listbox
            // hopefully workaround no longer is needed
            /*var dsId = this.getProperty('/uiFilter/dataSource/key');
        this.setProperty('/uiFilter/dataSource/key', '');
        this.setProperty('/uiFilter/dataSource/key', dsId);*/
            if (fireQuery || fireQuery === undefined) {
                this._firePerspectiveQuery();
            }
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        // getServerDataSources: function () {
        //     var that = this;
        //     if (that.getDataSourcesDeffered) {
        //         return that.getDataSourcesDeffered;
        //     }
        //     that.getDataSourcesDeffered = that.sina
        //         .getDataSources()
        //         .then(function (dataSources) {
        //             // filter out categories
        //             return jQuery.grep(
        //                 dataSources,
        //                 function (dataSource) {
        //                     return (
        //                         dataSource.getType() !== "Category"
        //                     );
        //                 }
        //             );
        //         });
        //     return that.getDataSourcesDeffered;
        // },
        // ################################################################################
        // Filter conditions:
        // ################################################################################
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        notifyFilterChanged: function () {
            // notify ui about changed filter, data binding does not react on changes below
            // conditions, so this is done manually
            // @ts-ignore
            jQuery.each(this.aBindings, function (index, binding) {
                if (binding.sPath === "/uiFilter/rootCondition") {
                    binding.checkUpdate(true);
                }
            });
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        addFilterCondition: function (filterCondition, fireQuery) {
            try {
                var uiFilter = this.getProperty("/uiFilter");
                //DWC exit for handling SearchIn facets
                if (typeof this.config.cleanUpSpaceFilters === "function") {
                    this.config.cleanUpSpaceFilters(this, filterCondition);
                }
                if (filterCondition.attribute || filterCondition.conditions) {
                    uiFilter.autoInsertCondition(filterCondition);
                }
                else {
                    //or a datasource?
                    this.setDataSource(filterCondition, false);
                }
                if (fireQuery || fireQuery === undefined) {
                    this._firePerspectiveQuery({
                        preserveFormerResults: false,
                    });
                }
                this.notifyFilterChanged();
            }
            catch (error) {
                this.errorHandler.onError(error);
            }
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        removeFilterCondition: function (filterCondition, fireQuery) {
            if (filterCondition.attribute || filterCondition.conditions) {
                this.getProperty("/uiFilter").autoRemoveCondition(filterCondition);
            }
            else {
                this.setDataSource(filterCondition, false);
            }
            if (fireQuery || fireQuery === undefined) {
                this._firePerspectiveQuery({
                    preserveFormerResults: true,
                });
            }
            this.notifyFilterChanged();
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        resetFilterConditions: function (fireQuery) {
            this.getProperty("/uiFilter").resetConditions();
            if (fireQuery || fireQuery === undefined) {
                this._firePerspectiveQuery();
            }
            this.notifyFilterChanged();
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        setFilter: function (filter) {
            this.setDataSource(filter.dataSource, false);
            this.setSearchBoxTerm(filter.searchTerm, false);
            var uiFilter = this.getProperty("/uiFilter");
            uiFilter.setRootCondition(filter.rootCondition);
            this._firePerspectiveQuery();
        },
        // ################################################################################
        // Suggestions:
        // ################################################################################
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        doSuggestion: function () {
            this.suggestionHandler.doSuggestion(this.getProperty("/uiFilter").clone());
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        abortSuggestions: function () {
            this.suggestionHandler.abortSuggestions();
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        autoSelectAppSuggestion: function (filter) {
            return this.suggestionHandler.autoSelectAppSuggestion(filter);
        },
        // ################################################################################
        // Perspective and App Search:
        // ################################################################################
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        _firePerspectiveQuery: function (deserializationIn, preserveFormerResultsIn) {
            var that = this;
            return this.initBusinessObjSearch().then(function () {
                return that._doFirePerspectiveQuery(deserializationIn, preserveFormerResultsIn);
            });
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        _doFirePerspectiveQuery: function (deserializationIn, preserveFormerResultsIn) {
            var that = this;
            var deserialization, preserveFormerResults;
            if (jQuery.isPlainObject(deserializationIn)) {
                deserialization = deserializationIn.deserialization;
                preserveFormerResults = deserializationIn.preserveFormerResults;
            }
            else {
                deserialization = deserializationIn || undefined;
                preserveFormerResults = preserveFormerResultsIn || undefined;
            }
            // decide whether to fire the query
            var uiFilter = this.getProperty("/uiFilter");
            if (uiFilter.equals(this.query.filter) &&
                this.getTop() === this.query.top &&
                this.isEqualOrderBy(this.getOrderBy(), this.query.sortOrder) &&
                this.getCalculateFacetsFlag() === this.query.calculateFacets &&
                !this.getProperty("/isQueryInvalidated")) {
                return Promise.resolve();
            }
            // set natural language query flag (nlq)
            if (SearchHelper.getUrlParameter("nlq") === "true") {
                this.query.setNlq(true);
            }
            // reset orderby if search term changes or datasource
            if ((this.query.filter.dataSource && uiFilter.dataSource !== this.query.filter.dataSource) ||
                (this.query.filter.searchTerm && uiFilter.searchTerm !== this.query.filter.searchTerm)) {
                this.resetOrderBy(false);
            }
            // notify facets formatter about datasource change
            if (this.query.filter.dataSource && uiFilter.dataSource !== this.query.filter.dataSource) {
                this.oFacetFormatter.handleDataSourceChanged();
            }
            // reset top if search term changes or filter condition or datasource
            if (!deserialization && !preserveFormerResults) {
                if (!uiFilter.equals(this.query.filter)) {
                    this.resetTop();
                }
            }
            // reset tabstrip formatter if search term changes or filter condition
            // UserCategory (My Favorites) is used and search for one connector
            if (uiFilter.searchTerm !== this.query.filter.searchTerm ||
                !uiFilter.rootCondition.equals(this.query.filter.rootCondition)) {
                this.tabStripFormatter.invalidate(this.getDataSource());
            }
            // query invalidated by UI -> force to fire query by reseting result set
            if (this.getProperty("/isQueryInvalidated") === true) {
                this.query.resetResultSet();
                this.setProperty("/isQueryInvalidated", false);
            }
            // update query (app search also uses this.query despite search regest is not controlled by sina)
            this.query.setFilter(this.getProperty("/uiFilter").clone());
            this.query.setTop(this.getTop());
            this.query.setSortOrder(this.assembleSortOrder());
            this.query.setCalculateFacets(this.getCalculateFacetsFlag());
            this.setProperty("/queryFilter", this.query.filter);
            // notify subscribers
            this._notifySubscribers("ESHSearchStarted");
            sap.ui.getCore().getEventBus().publish("ESHSearchStarted");
            // enable busy indicator
            if (deserialization) {
                // no delay: avoid flickering when starting seach ui from shell header
                this.setProperty("/busyDelay", 0);
            }
            else {
                this.setProperty("/busyDelay", 600);
            }
            this.setProperty("/isBusy", true);
            // abort suggestions
            this.abortSuggestions();
            // calculate visibility flags for apps and combined result list
            this.calculateVisibility();
            // update url silently
            this.updateSearchURLSilently(deserialization);
            // log search request
            this.eventLogger.logEvent({
                type: this.eventLogger.SEARCH_REQUEST,
                searchTerm: this.getProperty("/uiFilter/searchTerm"),
                dataSourceKey: this.getProperty("/uiFilter/dataSource").id,
            });
            // wait for all subsearch queries
            // return jQuery.when
            // .apply(null, [this.normalSearch(preserveFormerResults), this.appSearch()])
            return (Promise.all([this.normalSearch(preserveFormerResults), this.appSearch()])
                .then(function () {
                that.setProperty("/tabStrips", that.tabStripFormatter.format(that.getDataSource(), that.perspective, that));
                return that.oFacetFormatter
                    .getFacets(that.getDataSource(), that.perspective, that)
                    .catch(function (error) {
                    return that.errorHandler.onErrorDeferred(error);
                })
                    .then(function (facets) {
                    if (facets && facets.length > 0) {
                        // @ts-ignore
                        facets[0].change = jQuery.sap.now(); //workaround to prevent earlier force update facet tree
                        that.setProperty("/facets", facets);
                    }
                });
            })
                .catch(function (error) {
                return that.errorHandler.onErrorDeferred(error);
            })
                // .always(function () {
                .finally(function () {
                if (that.config && that.config.browserTitleOverwritten === true) {
                    document.title = that.getDocumentTitle();
                }
                that._notifySubscribers("ESHSearchFinished");
                sap.ui.getCore().getEventBus().publish("ESHSearchFinished");
                that.setProperty("/isBusy", false);
                that.setProperty("/firstSearchWasExecuted", true);
                that.notifyFilterChanged();
                that.updateMultiSelectionSelected();
            }));
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        assembleSortOrder: function () {
            var orderBy = this.getOrderBy();
            if (!orderBy.orderBy) {
                return [];
            }
            var order = this.sinaNext.SortOrder.Ascending;
            if (orderBy.sortOrder === "DESC") {
                order = this.sinaNext.SortOrder.Descending;
            }
            return [
                {
                    id: orderBy.orderBy,
                    order: order,
                },
            ];
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        getCalculateFacetsFlag: function () {
            if (this.getDataSource().type === this.sinaNext.DataSourceType.Category ||
                this.getFacetVisibility()) {
                // tab strip needs data from data source facet if a category is selected because
                // then the tab strips show also siblings. If connector is selected, the tab strip
                // only shows All and the connector.
                return true;
            }
            return false;
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        appSearch: function () {
            // DWC exit, skip app search
            if (this.config.bNoAppSearch === true) {
                return Promise.resolve(true);
            }
            var that = this;
            this.setProperty("/appResults", []);
            this.setProperty("/appCount", 0);
            if (!this.isAllCategory() && !this.isAppCategory()) {
                // 1. do not search
                return Promise.resolve(true);
            }
            // calculate top
            var top = this.query.filter.dataSource === this.allDataSource ? this.appTopDefault : this.query.top;
            // 2. search
            return this.searchApplications(this.query.filter.searchTerm, top, 0).then(function (oResult) {
                // 1.1 search call succeeded
                that.setProperty("/appCount", oResult.totalResults);
                that.setProperty("/appResults", oResult.getElements());
            }, function (error) {
                // 1.2 search call failed
                return that.errorHandler.onErrorDeferred(error);
            });
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        searchApplications: function (searchTerm, top, skip) {
            if (this.config.isUshell) {
                return sap.ushell.Container.getServiceAsync("Search").then(function (service) {
                    return service.queryApplications({
                        searchTerm: searchTerm,
                        top: top,
                        skip: skip,
                    });
                });
            }
            else {
                return Promise.resolve({
                    totalResults: 0,
                    searchTerm: searchTerm,
                    getElements: function () {
                        return [];
                    },
                });
            }
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         * @param log { import ("./sinaNexTS/core/Log").Log }
         */
        // transferLog: function (log) {
        //     var messages = log.getMessages();
        //     for (var i = 0; i < messages.length; ++i) {
        //         var message = messages[i];
        //         this.pushUIMessage({
        //             severity: message.severity || "ERROR",
        //             title: message.text,
        //             description: "",
        //             keep: true,
        //             details: "",
        //             isModal: false,
        //             error: null,
        //         });
        //     }
        // },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        normalSearch: function (preserveFormerResults) {
            var that = this;
            if (!preserveFormerResults) {
                that.resetAndDisableMultiSelection();
            }
            if (!that.isBusinessObjSearchEnabled() || that.isAppCategory()) {
                this.setProperty("/boResults", []);
                this.setProperty("/origBoResults", []);
                this.setProperty("/boCount", 0);
                this.setProperty("/nlqSuccess", false);
                this.setProperty("/nlqDescription", "");
                return Promise.resolve(true);
            }
            /**
             * @param searchResultSet { import ("./sinaNexTS/sina/SearchResultSet").SearchResultSet }
             */
            var successHandler = function (searchResultSet) {
                // that.transferLog(searchResultSet.log);
                that.perspective = searchResultSet; // TODO: sinaNext: rename perspective to resultSet
                that.setProperty("/nlqSuccess", false);
                if (searchResultSet.nlqSuccess) {
                    that.setProperty("/nlqSuccess", true);
                    that.setProperty("/nlqDescription", searchResultSet.title);
                }
                return that._afterSearchPrepareResultList(that.perspective);
            };
            that.setDataSource(that.getDataSource(), false, false);
            that.query.setCalculateFacets(that.getCalculateFacetsFlag());
            return that.query.getResultSetAsync().then(function (resultSet) {
                var searchResultSet = 
                /** @type { import ("./sinaNexTS/sina/SearchResultSet").SearchResultSet } */ (resultSet);
                return successHandler(searchResultSet);
            }, function (error) {
                return that.errorHandler.onErrorDeferred(error);
            });
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        _prepareTableResults: function (results) {
            var that = this;
            var i, j, k;
            // get attributes to display
            var attributesToDisplay = [];
            var attributesInAll = this.sinaNext.dataSourceMap[this.getDataSource().id].attributesMetadata;
            for (i = 0; i < attributesInAll.length; i++) {
                if (attributesInAll[i].usage.Detail &&
                    attributesInAll[i].groups.length === 0 &&
                    attributesInAll[i].type !== "GeoJson" &&
                    attributesInAll[i].id.match(/latitude|longitude/i) == null &&
                    attributesInAll[i].type !== that.sinaNext.AttributeType.ImageUrl) {
                    // filter out Andre's geo-attributes
                    attributesToDisplay.push(attributesInAll[i]);
                }
            }
            var compareAttributes = function (a, b) {
                if (a.usage.Detail.displayOrder < b.usage.Detail.displayOrder) {
                    return -1;
                }
                if (a.usage.Detail.displayOrder > b.usage.Detail.displayOrder) {
                    return 1;
                }
                return 0;
            };
            attributesToDisplay.sort(compareAttributes);
            //init rows
            var rows = results; // object reference
            var noValue = "\u2013";
            for (i = 0; i < results.length; i++) {
                rows[i].cells = [];
                for (j = 0; j < attributesToDisplay.length; j++) {
                    rows[i].cells[j] = {};
                }
            }
            /* prepare rows */
            for (i = 0; i < results.length; i++) {
                // detail cells
                var attributesInResult = results[i].itemattributes;
                for (j = 0; j < attributesToDisplay.length; j++) {
                    for (k = 0; k < attributesInResult.length; k++) {
                        if (attributesToDisplay[j].id === attributesInResult[k].key) {
                            if (attributesInResult[k].iconUrl) {
                                rows[i].cells[j] = {
                                    value: attributesInResult[k].value === undefined ||
                                        attributesInResult[k].value === null ||
                                        attributesInResult[k].value.trim().length === 0
                                        ? noValue
                                        : attributesInResult[k].value,
                                    icon: attributesInResult[k].iconUrl,
                                };
                            }
                            else {
                                rows[i].cells[j] = {
                                    value: attributesInResult[k].value === undefined ||
                                        attributesInResult[k].value === null ||
                                        attributesInResult[k].value.trim().length === 0
                                        ? noValue
                                        : attributesInResult[k].value,
                                };
                            }
                        }
                    }
                }
                // title description cell
                if (results[i].hasTitleDescription) {
                    rows[i].cells.unshift({
                        value: results[i].titleDescription === undefined ||
                            results[i].titleDescription === null ||
                            results[i].titleDescription.trim().length === 0
                            ? noValue
                            : results[i].titleDescription,
                    });
                }
                // title cell
                rows[i].cells.unshift({
                    value: results[i].title === undefined ||
                        results[i].title === null ||
                        results[i].title.trim().length === 0
                        ? noValue
                        : results[i].title,
                    uri: results[i].uri,
                    titleNavigation: results[i].titleNavigation,
                    isTitle: true,
                    titleIconUrl: results[i].titleIconUrl,
                    titleInfoIconUrl: results[i].titleInfoIconUrl,
                });
                // related apps cell
                if (results[i].navigationObjects !== undefined &&
                    results[i].navigationObjects.length > 0) {
                    rows[i].cells.push({
                        value: i18n.getText("intents"),
                        navigationObjects: results[i].navigationObjects,
                        isRelatedApps: true,
                    });
                }
                if (that.config.extendTableColumn) {
                    var data = {
                        idAttribute: results[i].additionalAttributes.idAttribute,
                        favoriteUserId: results[i].additionalAttributes.favoriteUserId,
                    };
                    rows[i].cells.push(that.config.extendTableColumn.assembleCell(data));
                }
            }
            that.setProperty("/tableResults", rows);
            /* prepare columns */
            var columns = [];
            var sortColumns = [];
            // detail column
            for (i = 0; i < attributesToDisplay.length; i++) {
                // push table columns
                // exclude map attributes, image url attributes
                if (attributesToDisplay[i].id.match(/latitude|longitude/i) == null &&
                    attributesToDisplay[i].type !== that.sinaNext.AttributeType.ImageUrl) {
                    // exclude image from table columns
                    columns.push({
                        name: attributesToDisplay[i].label,
                        attributeId: attributesToDisplay[i].id,
                    });
                }
            }
            // title description column
            if (results[0].hasTitleDescription) {
                var titleDescriptionLabel = results[0].titleDescriptionLabel + " (" + i18n.getText("titleDescription") + ")";
                columns.unshift({
                    name: titleDescriptionLabel,
                    attributeId: "SEARCH_TABLE_TITLE_DESCRIPTION_COLUMN", // used for export row-column mapping
                });
            }
            // title column
            var titleColumn = {};
            if (that.config.titleColumnName && that.config.titleColumnName !== "") {
                titleColumn.name = i18n.getText(that.config.titleColumnName);
            }
            else {
                titleColumn.name = that.getDataSource().label;
            }
            titleColumn.attributeId = "SEARCH_TABLE_TITLE_COLUMN"; // used for export row-column mapping
            if (that.config.titleColumnWidth && that.config.titleColumnWidth !== "") {
                titleColumn.width = that.config.titleColumnWidth;
            }
            columns.unshift(titleColumn);
            // related apps column
            var lastCellIndex = rows[0].cells.length - 1;
            if (rows[0].cells[lastCellIndex].isRelatedApps) {
                columns.push({
                    name: i18n.getText("intents"),
                    attributeId: "SEARCH_APPS_AS_ID", // used for export row-column mapping
                });
            }
            if (that.config.extendTableColumn) {
                columns.push(that.config.extendTableColumn.column);
            }
            // set index for initial visible
            for (i = 0; i < columns.length; i++) {
                columns[i].key = "searchColumnKey" + i; // sap.m.table required for personalization
                columns[i].index = i;
            }
            that.setProperty("/tableColumns", columns);
            /* prepare sortable columns */
            // detail sortable column
            for (i = 0; i < attributesInAll.length; i++) {
                var attribute = attributesInAll[i];
                if (attribute.isSortable) {
                    sortColumns.push({
                        name: attribute.label,
                        key: "searchSortableColumnKey" + i,
                        attributeId: attribute.id,
                        selected: that.getProperty("/orderBy").orderBy === attribute.id,
                    });
                }
            }
            var compareColumns = function (a, b) {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            };
            sortColumns.sort(compareColumns);
            // title sortable column, default
            sortColumns.unshift({
                name: i18n.getText("defaultRank"),
                key: "searchSortableColumnKeyDefault",
                attributeId: "",
                selected: jQuery.isEmptyObject(that.getProperty("/orderBy")),
            });
            that.setProperty("/tableSortableColumns", sortColumns);
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        _afterSearchPrepareResultList: function (searchResultSet) {
            var that = this;
            // that.setProperty("/boCount", searchResultSet.totalCount);
            var i;
            // var formerResults = [];
            // if (false && preserveFormerResults) { // TODO: sinaNext Holger
            //     var _formerResults = that.getProperty("/boResults");
            //     for (i = 0; i < _formerResults.length; i++) {
            //         if (_formerResults[i].expanded || _formerResults[i].selected) {
            //             formerResults.push(_formerResults[i]);
            //         }
            //     }
            // }
            that.setProperty("/boResults", []);
            that.setProperty("/origBoResults", searchResultSet.items);
            that.setProperty("/boCount", 0);
            var formatter = new SearchResultListFormatter(that);
            var newResults = formatter.format(searchResultSet, that.query.filter.searchTerm);
            var newResult;
            var dataSources = [];
            var dataSourcesHints = [];
            for (i = 0; i < newResults.length; i++) {
                newResult = newResults[i];
                /////////////////////////////////////////////////////////////
                // collect data sources to initiate loading of custom modules
                dataSources.push(newResult.dataSource);
                dataSourcesHints.push({
                    isDocumentConnector: newResult.isDocumentConnector,
                });
            }
            var loadCustomModulesProm = that.config.loadCustomModulesForDataSourcesAsync(dataSources, dataSourcesHints);
            //////////////////////////////////////////////////////////////////
            // restore expanded and selected state of former result list items
            // if (false && formerResults && formerResults.length > 0) { // TODO: sinaNext Holger
            //     var ResultElementKeyStatus = that.sina.ResultElementKeyStatus;
            //     var itemsWithErrors = [];
            //     for (i = 0; i < newResults.length; i++) {
            //         newResult = newResults[i];
            //         if (newResult.keystatus === ResultElementKeyStatus.OK) {
            //             for (var j = 0; j < formerResults.length; j++) {
            //                 var formerResult = formerResults[j];
            //                 if (formerResult.keystatus === ResultElementKeyStatus.OK && formerResult.key === newResult.key) {
            //                     newResult.selected = formerResult.selected;
            //                     newResult.expanded = formerResult.expanded;
            //                     formerResults.splice(j, 1);
            //                     break;
            //                 }
            //             }
            //         } else {
            //             itemsWithErrors.push(newResult);
            //         }
            //     }
            //     if (itemsWithErrors.length > 0) {
            //         var listOfFaultyDatasources = [];
            //         var listOfFaultyDatasourcesString = "";
            //         for (i = 0; i < itemsWithErrors.length; i++) {
            //             var dataSourceKey = itemsWithErrors[i].dataSource.key;
            //             if (jQuery.inArray(dataSourceKey, listOfFaultyDatasources) < 0) {
            //                 listOfFaultyDatasources.push(dataSourceKey);
            //                 listOfFaultyDatasourcesString += dataSourceKey + "\n";
            //             }
            //         }
            //         that.pushUIMessage({
            //             type: "warning",
            //             title: i18n.getText("preserveFormerResultErrorTitle"),
            //             description: i18n.getText("preserveFormerResultErrorDetails", listOfFaultyDatasourcesString)
            //         });
            //     }
            // }
            var thisPromise = Promise.all([Promise.resolve(searchResultSet), loadCustomModulesProm]).then(function (params) {
                // TODO: error handling
                var searchResultSet = params[0];
                if (!that.isAllCategory() &&
                    !that.isOtherCategory() &&
                    !that.isAppCategory() &&
                    searchResultSet.totalCount > 0) {
                    // has titleDescriptionAttributes -> add hasTitleDescription
                    if (searchResultSet.items[0].titleDescriptionAttributes.length > 0) {
                        newResults.forEach(function (result) {
                            result.hasTitleDescription = true;
                        });
                    }
                    that._prepareTableResults(newResults);
                }
                // DWC exit
                if (that.config && typeof that.config.setSearchInLabelIconBindings === "function") {
                    that.config.setSearchInLabelIconBindings(that, searchResultSet.facets);
                }
                that.setProperty("/boCount", searchResultSet.totalCount);
                that.setProperty("/boResults", newResults);
                that.enableOrDisableMultiSelection();
                return Promise.resolve();
            });
            return thisPromise;
        },
        // ################################################################################
        // Helper functions:
        // ################################################################################
        // handle multi-selection availability
        // ===================================================================
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        resetAndDisableMultiSelection: function () {
            this.setProperty("/multiSelectionAvailable", false);
            this.setProperty("/multiSelectionEnabled", false);
            this.setProperty("/multiSelectionSelected", false);
            this.setProperty("/singleSelectionSelected", false);
        },
        // handle multi-selection availability
        // ===================================================================
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        enableOrDisableMultiSelection: function () {
            if (this.config.enableMultiSelectionResultItems) {
                this.setProperty("/multiSelectionAvailable", true);
                this.setProperty("/multiSelectionEnabled", true);
                return;
            }
            var dataSource = this.getDataSource();
            var dataSourceConfig = this.config.getDataSourceConfig(dataSource);
            /* eslint new-cap:0 */
            var selectionHandler = new dataSourceConfig.searchResultListSelectionHandlerControl();
            if (selectionHandler) {
                this.setProperty("/multiSelectionAvailable", selectionHandler.isMultiSelectionAvailable());
            }
            else {
                this.setProperty("/multiSelectionAvailable", false);
            }
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        updateMultiSelectionSelected: function () {
            var results = this.getProperty("/results");
            var count = 0;
            var multiSelectionObjects = [];
            for (var i = 0; i < results.length; i++) {
                if (results[i].selected) {
                    count++;
                    multiSelectionObjects.push(results[i]);
                }
            }
            if (count > 0) {
                this.setProperty("/multiSelectionSelected", true);
                this.setProperty("/multiSelectionObjects", multiSelectionObjects);
            }
            else {
                this.setProperty("/multiSelectionSelected", false);
                this.setProperty("/multiSelectionObjects", []);
            }
            if (count === 1) {
                this.setProperty("/singleSelectionSelected", true);
            }
            else {
                this.setProperty("/singleSelectionSelected", false);
            }
            this.config.selectionChange(this);
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        _endWith: function (str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        calculatePlaceholder: function () {
            var that = this;
            var dataSourceLabel = that.getDataSource().labelPlural; // default label
            if (that.config.FF_bOptimizedQuickSelectDataSourceLabels === true) {
                // ignore bPlaceHolderFixedValue / that.isAllCategory()
                var isSpaceLabel;
                // for DWC space facet, use space-label
                if (typeof that.config.getFirstSpaceCondition === "function") {
                    // currently there can be only one space selected at the same time
                    var firstSpaceCondition = that.config.getFirstSpaceCondition(that.getProperty("/uiFilter"));
                    if (firstSpaceCondition && firstSpaceCondition.attributeLabel) {
                        isSpaceLabel = true;
                        dataSourceLabel = firstSpaceCondition.valueLabel || firstSpaceCondition.value; // users know, it's a space
                        /* dataSourceLabel = i18n.getText(
                            "suggestionFacetLabelWithValue",
                            [
                                firstSpaceCondition.attributeLabel,
                                firstSpaceCondition.valueLabel || firstSpaceCondition.value,
                            ]
                        ); */
                    }
                }
                // not a space label
                if (!isSpaceLabel &&
                    that.getDataSource().id === "SEARCH_DESIGN" &&
                    typeof that.config.getPlaceholderLabelForDatasourceAll === "function") {
                    // use special label for 'All' (example DWC: 'Object')
                    dataSourceLabel = that.config.getPlaceholderLabelForDatasourceAll();
                }
            }
            else if (that.isAllCategory() || that.config.bPlaceHolderFixedValue === true) {
                return i18n.getText("search");
            }
            else if (!isSpaceLabel &&
                that.getDataSource().id === "SEARCH_DESIGN" &&
                typeof that.config.getPlaceholderLabelForDatasourceAll === "function") {
                // use special label for 'All' (example DWC: 'Object')
                dataSourceLabel = that.config.getPlaceholderLabelForDatasourceAll();
            }
            return i18n.getText("searchInPlaceholder", [dataSourceLabel]);
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        updateDataSourceList: function (newDataSource) {
            var dataSources = this.getProperty("/dataSources");
            // delete old categories, until all data source
            this.removeTempDataSources();
            // all and apps are surely included in existing list -> return
            if (newDataSource === this.allDataSource || newDataSource === this.appDataSource) {
                return;
            }
            // all connectors (!=category) are included in existing list -> return
            if (newDataSource && newDataSource.id) {
                if (newDataSource.id.indexOf("~") >= 0) {
                    return;
                }
            }
            // check if newDataSource exists in existing list -> return
            for (var i = 0; i < dataSources.length; ++i) {
                var dataSource = dataSources[i];
                if (dataSource === newDataSource) {
                    return;
                }
            }
            // add datasource
            dataSources.unshift(newDataSource);
            this.tempDataSources.push(newDataSource);
            this.setProperty("/dataSources", dataSources);
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        removeTempDataSources: function () {
            var dataSources = this.getProperty("/dataSources");
            this.tempDataSources.forEach(function (tempDataSource, i, tempDataSources) {
                var index = dataSources.indexOf(tempDataSource);
                if (index < 0) {
                    var internalError = new Error("could not find temp DataSource in DataSources");
                    throw new errors.ProgramError(internalError);
                }
                dataSources.splice(index, 1);
                tempDataSources.splice(i, 1);
            });
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        invalidateQuery: function () {
            // TODO: naming?
            SearchHelper.hasher.reset();
            this.setProperty("/isQueryInvalidated", true);
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        autoStartApp: function () {
            var that = this;
            if (that.getProperty("/appCount") &&
                that.getProperty("/appCount") === 1 &&
                that.getProperty("/count") &&
                that.getProperty("/count") === 1) {
                var aApps = that.getProperty("/appResults");
                if (aApps &&
                    aApps.length > 0 &&
                    aApps[0] &&
                    aApps[0].url &&
                    that.getProperty("/uiFilter/searchTerm") &&
                    aApps[0].tooltip &&
                    that.getProperty("/uiFilter/searchTerm").toLowerCase().trim() ===
                        aApps[0].tooltip.toLowerCase().trim()) {
                    if (aApps[0].url[0] === "#") {
                        window.location.href = aApps[0].url;
                    }
                    else {
                        window.open(aApps[0].url, "_blank", "noopener,noreferrer");
                    }
                }
            }
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        getResultToDisplay: function () {
            return this.getProperty("/resultToDisplay");
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        setResultToDisplay: function (type) {
            this.setProperty("/resultToDisplay", type);
            if (this.focusHandler) {
                setTimeout(function () {
                    this.focusHandler.setFocus();
                }.bind(this), 1000);
            }
            SearchHelper.saveResultViewType(type);
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        calculateVisibility: function () {
            var that = this;
            /* five types of resultToDisplay:
             * "appSearchResult": app search result
             * "searchResultList": all or Category search result
             * "searchResultTable": connector search result
             * "searchResultGrid": connector search result
             * "searchResultMap": map search result
             */
            if (that.isAppCategory()) {
                // search in app
                that.setResultToDisplay("appSearchResult");
                that.setProperty("/displaySwitchVisibility", false);
            }
            else if (that.isAllCategory() || that.isOtherCategory()) {
                // search in all or category
                that.setResultToDisplay("searchResultList");
                that.setProperty("/displaySwitchVisibility", false);
            }
            else {
                // search in datasource
                var resultToDisplay = that.getResultToDisplay();
                if (!(resultToDisplay === "searchResultList" ||
                    resultToDisplay === "searchResultTable" ||
                    resultToDisplay === "searchResultGrid" ||
                    resultToDisplay === "searchResultMap")) {
                    that.setResultToDisplay(that.config.defaultResultViewType || SearchHelper.loadResultViewType());
                }
                that.setProperty("/displaySwitchVisibility", true);
            }
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        calculateSearchButtonStatus: function () {
            if (this.getDataSource() === this.getProperty("/defaultDataSource") &&
                this.getSearchBoxTerm().length === 0) {
                this.setProperty("/searchButtonStatus", "close");
            }
            else {
                this.setProperty("/searchButtonStatus", "search");
            }
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        calculateResultList: function () {
            // init
            var that = this;
            var results = [];
            // add bo results
            var boResults = that.getProperty("/boResults");
            if (boResults && boResults.length) {
                results.push.apply(results, boResults);
            }
            // add app results (tiles)
            var tiles = that.getProperty("/appResults");
            if (tiles && tiles.length > 0) {
                var tilesItem = {
                    type: "appcontainer",
                    tiles: tiles,
                };
                if (results.length > 0) {
                    if (results.length > 3) {
                        results.splice(3, 0, tilesItem);
                    }
                    else {
                        //results.splice(0, 0, tilesItem);
                        results.push(tilesItem);
                    }
                }
                else {
                    results = [tilesItem];
                }
            }
            // set property
            sap.ui.model.json.JSONModel.prototype.setProperty.apply(this, ["/results", results]);
        },
        // ################################################################################
        // UI message handling:
        // ################################################################################
        /**
         * push an error object to error array
         * @this sap.esh.search.ui.SearchModel
         * @param {object} error object
         */
        pushUIMessage: function (error) {
            error.title = error.title === "[object Object]" ? i18n.getText("searchError") : error.title;
            error.type = error.type !== undefined ? error.type : sap.ui.core.MessageType.Error;
            var errors = this.getProperty("/errors");
            errors.push(error);
            this.setProperty("/errors", errors);
        },
        // ################################################################################
        // Functions related to the URL:
        // ################################################################################
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        updateSearchURLSilently: function (deserialization) {
            if (deserialization || this.preventUpdateURL) {
                // (1) url changed
                // in most cases current URL is identical to the URL the URL serializer would create
                // -> URL update not neccessary
                // in some case current URL is not identical to the URL the URL serializer would create
                // -> we accept the users URL and skip the URL update
                // nevertheless the internal url hash needs to be updated
                SearchHelper.hasher.init();
            }
            else {
                // (2) user changed query
                var sHash = this.renderSearchURL();
                if (this.config.updateUrl) {
                    SearchHelper.hasher.setHash(sHash);
                }
            }
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        renderSearchURL: function () {
            return this.searchUrlParser.render();
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        parseURL: function () {
            this.searchUrlParser.parse();
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        subscribe: function (sEventId, fnFunction, oListener) {
            this.subscribers.push({
                sEventId: sEventId || "",
                fnFunction: fnFunction,
                oListener: oListener || this,
            });
        },
        /**
         * @this sap.esh.search.ui.SearchModel
         */
        unsubscribe: function (sEventId, fnFunction, oListener) {
            sEventId = sEventId || "";
            oListener = oListener || this;
            for (var index = 0; index < this.subscribers.length; index++) {
                var subscriber = this.subscribers[index];
                if (subscriber.sEventId === sEventId &&
                    subscriber.fnFunction === fnFunction &&
                    subscriber.oListener === oListener) {
                    this.subscribers.splice(index, 1);
                }
            }
        },
        /**
         *
         * @this sap.esh.search.ui.SearchModel
         * @param {string} sEventId
         */
        _notifySubscribers: function (sEventId) {
            for (var index = 0; index < this.subscribers.length; index++) {
                var subscriber = this.subscribers[index];
                if (subscriber.sEventId === sEventId) {
                    subscriber.fnFunction.apply(subscriber.oListener, [sEventId]);
                }
            }
        },
    });
    // Helper method for injecting SearchShellHelper module from
    // SearchShellHelperAndModuleLoader
    // @ts-ignore
    SearchModel.injectSearchShellHelper = function (_SearchShellHelper) {
        SearchShellHelper = SearchShellHelper || _SearchShellHelper;
    };
    return SearchModel;
});
