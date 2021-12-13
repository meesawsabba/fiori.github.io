/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
/* global $ */
// @ts-check
sap.ui.define([
    "./error/errors",
    "./error/ErrorHandler",
    "./i18n",
    "sap/ui/model/resource/ResourceModel",
    "sap/esh/search/ui/controls/SearchFieldGroup",
    "sap/esh/search/ui/SearchShellHelperAndModuleLoader",
    "sap/esh/search/ui/SearchModel",
    "sap/esh/search/ui/controls/SearchLayout",
    "sap/esh/search/ui/controls/SearchLayoutResponsive",
    "sap/esh/search/ui/controls/SearchResultListContainer",
    "sap/esh/search/ui/controls/SearchResultList",
    "sap/esh/search/ui/controls/SearchResultTable",
    "sap/esh/search/ui/controls/SearchResultGrid",
    "sap/esh/search/ui/controls/SearchSpreadsheet",
    "sap/esh/search/ui/controls/SearchNoResultScreen",
    "sap/esh/search/ui/SearchHelper",
    "sap/esh/search/ui/controls/SearchText",
    "sap/esh/search/ui/controls/SearchLink",
    "sap/esh/search/ui/controls/SearchCountBreadcrumbs",
    // "sap/esh/search/ui/controls/SearchResultMap", // violate CSP
    "sap/esh/search/ui/controls/SearchResultListItem",
    "sap/esh/search/ui/controls/CustomSearchResultListItem",
    "sap/esh/search/ui/controls/SearchTileHighlighter",
    "sap/esh/search/ui/controls/SearchFilterBar",
    "sap/esh/search/ui/controls/SearchFacetFilter",
    "sap/esh/search/ui/controls/DivContainer",
    "sap/ui/core/Control",
    "sap/ui/core/InvisibleText",
    "sap/ui/core/Icon",
    "sap/ui/core/IconPool",
    "sap/ui/core/delegate/ItemNavigation",
    "sap/ui/layout/VerticalLayout",
    "sap/ui/model/BindingMode",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/PlacementType",
    "sap/m/ToolbarDesign",
    "sap/m/SegmentedButton",
    "sap/m/SegmentedButtonItem",
    "sap/m/ToggleButton",
    "sap/m/Bar",
    "sap/m/OverflowToolbarLayoutData",
    "sap/m/OverflowToolbarPriority",
    "sap/m/OverflowToolbar",
    "sap/m/ToolbarSeparator",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "sap/m/CustomListItem",
    "sap/m/TablePersoController",
    "sap/m/ListMode",
    "sap/m/ListType",
    "sap/m/PopinDisplay",
    "sap/m/ActionSheet",
    "sap/m/FlexBox",
    "sap/m/FlexJustifyContent",
    "sap/m/GenericTile",
    "sap/m/TileContent",
    "sap/m/BusyDialog",
    "sap/m/ViewSettingsDialog",
    "sap/m/ViewSettingsItem",
    "sap/m/PopinLayout",
    "sap/m/Page",
    "sap/m/MessagePopover",
    "sap/m/MessageItem",
    "sap/m/HBox",
    "sap/m/VerticalPlacementType",
    "sap/f/GridContainer",
    "sap/f/GridContainerSettings",
    "sap/f/GridContainerItemLayoutData",
    "sap/m/TablePersoController",
    // "sap/ui/vbm/AnalyticMap", // violate CSP
    // "sap/ui/vbm/Spot", // violate CSP
], 
/**
 * Search control (input for search terms, suggestions, facets, result list views "list", "table", "grid", "map")
 *
 * @param {*} errors
 * @param {*} ErrorHandler
 * @param {*} i18n
 * @param {*} ResourceModel
 * @param {*} SearchFieldGroup
 * @param {*} SearchShellHelperAndModuleLoader
 * @param {*} SearchModel
 * @param {*} SearchLayout
 * @param {*} SearchLayoutResponsive
 * @param {*} SearchResultListContainer
 * @param {*} SearchResultList
 * @param {*} SearchResultTable
 * @param {*} SearchResultGrid
 * @param {*} SearchSpreadsheet
 * @param {*} SearchNoResultScreen
 * @param {*} SearchHelper
 * @param {*} SearchText
 * @param {*} SearchLink
 * @param {*} SearchCountBreadCrumbs
 * @param {*} SearchMap // violate CSP
 * @param {*} SearchResultListItem,
 * @param {*} CustomSearchResultListItem,
 * @param {*} SearchTileHighlighter,
 * @param {*} SearchFilterBar,
 * @param {*} SearchFacetFilter,
 * @param {*} DivContainer,
 * @param {*} Control,
 * @param {*} InvisibleText,
 * @param {*} Icon,
 * @param {*} IconPool,
 * @param {*} ItemNavigation,
 * @param {*} VerticalLayout,
 * @param {*} BindingMode,
 * @param {*} Button,
 * @param {*} ButtonType,
 * @param {*} PlacementType,
 * @param {*} ToolbarDesign,
 * @param {*} SegmentedButton,
 * @param {*} SegmentedButtonItem,
 * @param {*} ToggleButton,
 * @param {*} Bar,
 * @param {*} OverflowToolbarLayoutData,
 * @param {*} OverflowToolbarPriority,
 * @param {*} OverflowToolbar,
 * @param {*} ToolbarSeparator,
 * @param {*} Label,
 * @param {*} Text,
 * @param {*} Column,
 * @param {*} ColumnListItem,
 * @param {*} CustomListItem,
 * @param {*} TablePersoController,
 * @param {*} ListMode,
 * @param {*} ListType,
 * @param {*} PopinDisplay,
 * @param {*} ActionSheet,
 * @param {*} FlexBox,
 * @param {*} FlexJustifyContent,
 * @param {*} GenericTile,
 * @param {*} TileContent,
 * @param {*} BusyDialog,
 * @param {*} ViewSettingsDialog,
 * @param {*} ViewSettingsItem,
 * @param {*} PopinLayout,
 * @param {*} Page,
 * @param {*} MessagePopover,
 * @param {*} MessageItem,
 * @param {*} HBox,
 * @param {*} VerticalPlacementType,
 * @param {*} GridContainer,
 * @param {*} GridContainerSettings
 * @returns
 */
function (errors, ErrorHandler, i18n, ResourceModel, SearchFieldGroup, SearchShellHelperAndModuleLoader, SearchModel, SearchLayout, SearchLayoutResponsive, SearchResultListContainer, SearchResultList, SearchResultTable, SearchResultGrid, SearchSpreadsheet, SearchNoResultScreen, SearchHelper, SearchText, SearchLink, SearchCountBreadCrumbs, 
// SearchMap, // violate CSP
SearchResultListItem, CustomSearchResultListItem, SearchTileHighlighter, SearchFilterBar, SearchFacetFilter, DivContainer, Control, // sap.ui.core
InvisibleText, Icon, IconPool, ItemNavigation, VerticalLayout, // sap.ui.layout
BindingMode, // sap.ui.model
Button, // sap.m
ButtonType, PlacementType, ToolbarDesign, SegmentedButton, SegmentedButtonItem, ToggleButton, Bar, OverflowToolbarLayoutData, OverflowToolbarPriority, OverflowToolbar, ToolbarSeparator, Label, Text, Column, ColumnListItem, CustomListItem, TablePersoController, ListMode, ListType, PopinDisplay, ActionSheet, FlexBox, FlexJustifyContent, GenericTile, TileContent, BusyDialog, ViewSettingsDialog, ViewSettingsItem, PopinLayout, Page, // soon obsolete
MessagePopover, MessageItem, HBox, VerticalPlacementType, GridContainer, // sap.f
GridContainerSettings, GridContainerItemLayoutData) {
    ("use strict");
    /**
     * Constructs a new <code>SearchCompositeControl</code> to interact with a SAP Enterprise Search Service.
     *
     * @param {string} [sId] ID for the new control, generated automatically if no ID is given
     * @param {object} [mSettings] Initial settings for the new control
     *
     * @class
     *
     * This is the UI5 composite control by the Enterprise Search Team to make full use of the Enterprise Search Services.
     * This composite control is a complete UI which includes a search input box including a suggestion dropdown,
     * a result list which can have different styles including tiles and table, result facets and more.
     * This control is ready to use with an enterprise search backend service but also allows deep modifications to match
     * requirements of adopting applications.
     *
     * @extends sap.ui.core.Control
     *
     * @author SAP SE
     * @version 1.96.0
     *
     * @constructor
     * @public
     * @alias sap.esh.search.ui.SearchCompositeControl
     * @since 1.93.0
     * @name sap.esh.search.ui.SearchCompositeControl
     *
     */
    // @ts-ignore
    return Control.extend("sap.esh.search.ui.SearchCompositeControl", {
        metadata: {
            library: "sap.esh",
            properties: {
                /**
                 * An additional CSS class to add to this control
                 */
                cssClass: "string",
                /**
                 * Defines the initial search term for the search input
                 */
                searchTerm: {
                    type: "string",
                    group: "Misc",
                    defaultValue: "*", // asterisk
                },
                /**
                 * Defines if the search control will search for the given term right on control instantiation.
                 */
                searchOnStart: {
                    type: "boolean",
                    group: "Behavior",
                    defaultValue: true,
                },
            },
            aggregations: {
                /**
                 * Control instances which are part of this composite control.
                 * @private
                 */
                content: {
                    singularName: "content",
                    multiple: true,
                },
            },
        },
        eshCompCounter: 0,
        subscribeDone_SearchFinished: false,
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        constructor: function (sId, mSettings) {
            var that = this;
            /**
             * @type {ErrorHandler}
             */
            this.errorHandler = new ErrorHandler({
                model: null,
            });
            try {
                // check sId === mSettings.id
                if (typeof sId === "string" && sId.length > 0 && typeof mSettings.id !== "undefined") {
                    if (sId !== mSettings.id) {
                        var error = new Error("Constructor of component 'sap.esh.search.ui.SearchCompositeControl' has failed\n\n" +
                            "sId and mSettings.id are not the same. It is sufficient to set either 'id' (sId) or 'settings.id' (mSettings.id).");
                        var err = new errors.ESHUIConstructionError(error);
                        that.errorHandler.onError(err);
                    }
                }
                // shift arguments in case sId was missing, but mSettings was given
                if (typeof sId !== "string" && sId !== undefined && mSettings === undefined) {
                    mSettings = sId;
                    sId = mSettings && mSettings.id;
                }
                else if (typeof mSettings === "undefined") {
                    mSettings = {};
                }
                // add sId to mSettings
                if (typeof sId === "string" && sId.length > 0) {
                    mSettings.id = sId;
                }
                // no id -> create one
                if (!sId || sId.length === 0) {
                    sId = "eshComp" + "GenId_" + this.eshCompCounter++;
                    mSettings.id = sId;
                }
                that.options = mSettings;
                var metadataProperties = that.getMetadata().getProperties();
                that.metadataOptions = {};
                for (var metadataProperty in metadataProperties) {
                    if (that.options[metadataProperty] !== "undefined") {
                        that.metadataOptions[metadataProperty] = that.options[metadataProperty];
                    }
                }
                that.metadataOptions = jQuery.extend({}, {
                    content: [],
                }, that.metadataOptions);
                Control.prototype.constructor.apply(that, [sId, that.metadataOptions]);
                that.addStyleClass("sapUshellSearchInputHelpPage");
                // init search focus handler
                this.oFocusHandler = new SearchHelper.SearchFocusHandler(this);
                try {
                    var searchModel = that.options.model || that.getModel("searchModel");
                    if (!searchModel) {
                        searchModel = new SearchModel({
                            configuration: that.options,
                        });
                        that.setModel(searchModel, "searchModel");
                    }
                    searchModel.isSearchCompositeControl = true;
                    searchModel.focusHandler = this.oFocusHandler;
                    that.setModel(searchModel);
                    // @ts-ignore
                    that.setModel(new ResourceModel({ bundle: i18n }), "i18n");
                    that.createContent();
                }
                catch (error) {
                    var err = new errors.ESHUIConstructionError(error);
                    that.errorHandler.onError(err);
                }
                that.getModel()
                    .searchUrlParser.parse()
                    .then(function () {
                    that.getModel()
                        .initBusinessObjSearch()
                        .then(function () {
                        var searchBoxTerm = that.getModel().getSearchBoxTerm();
                        var config = that.getModel().config;
                        if (searchBoxTerm === "" && !config.FF_bSearchtermNoAsterisk) {
                            // asterisk
                            searchBoxTerm = that.getSearchTerm();
                            that.getModel().setSearchBoxTerm(searchBoxTerm, false);
                        }
                        if (that.getSearchOnStart()) {
                            that.getModel()._firePerspectiveQuery();
                        }
                    });
                });
            }
            catch (error) {
                that.errorHandler.onError(error);
            }
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        exit: function () {
            var that = this;
            if (this.oErrorPopover) {
                this.oErrorPopover.destroy();
            }
            // avoid to create same-id-TablePersoDialog by oTablePersoController.activate()
            // destroy TablePersoDialog when exit search app
            if (this.oTablePersoController && this.oTablePersoController.getTablePersoDialog()) {
                this.oTablePersoController.getTablePersoDialog().destroy();
            }
            // oFacetDialog doesn't have id
            // destroy oFacetDialog when exit search app anyway
            if (this.oSearchPage && this.oSearchPage.oFacetDialog) {
                this.oSearchPage.oFacetDialog.destroy();
            }
            // onAllSearchStarted has no coding
            // oModel.unsubscribe("ESHSearchStarted", that.getView().onAllSearchStarted, that.getView());
            that.oModel.unsubscribe("ESHSearchFinished", that.onAllSearchFinished, that);
        },
        renderer: function (oRm, oControl) {
            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addClass(oControl.getCssClass());
            oRm.writeClasses();
            oRm.addStyle("height", "100%");
            oRm.addStyle("width", "100%");
            oRm.writeStyles();
            // oRm.write('style="width: 100%; height: 100%;"');
            oRm.write(">");
            var aChildren = oControl.getContent();
            for (var i = 0; i < aChildren.length; i++) {
                oRm.renderControl(aChildren[i]);
            }
            oRm.write("</div>");
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        createContent: function () {
            var that = this;
            that.oSearchFieldGroup = new SearchFieldGroup(this.getId() + "-searchInputHelpPageSearchFieldGroup");
            that.oSearchFieldGroup.setCancelButtonActive(false);
            that.oSearchFieldGroup.addStyleClass("sapUshellSearchInputHelpPageSearchFieldGroup");
            that.oSearchFieldGroup.input.setShowValueHelp(false);
            that.getModel().setProperty("/inputHelp", that.oSearchFieldGroup.input);
            if (!that.subscribeDone_SearchFinished &&
                that.getModel &&
                that.getModel() &&
                that.getModel().subscribe) {
                that.getModel().subscribe("ESHSearchFinished", that.onAllSearchFinished, that);
                that.subscribeDone_SearchFinished = true;
            }
            // onAllSearchStarted has no coding, thus do not subscribe yet
            if (that.getModel && that.getModel()) {
                that.getModel().subscribe("ESHSearchFinished", function () {
                    that.oSearchFieldGroup.input.setValue(that.getModel().getSearchBoxTerm());
                }, that);
            }
            that.oSearchBar = new Bar("", {
                // @ts-ignore
                visible: {
                    parts: ["/count", "/facetVisibility"],
                    formatter: function (count, facetVisibility) {
                        if (facetVisibility) {
                            return count !== 0 || that.getModel().config.searchBarDoNotHideForNoResults;
                        }
                        return count !== 0 || that.getModel().config.searchBarDoNotHideForNoResults;
                    },
                },
                contentLeft: [that.assembleFilterButton(), that.assembleDataSourceTapStrips()],
                contentRight: that.assembleSearchToolbar(),
            });
            that.oSearchBar.addStyleClass("sapUshellSearchBar");
            that.oFilterBar = new SearchFilterBar("");
            if (that.getModel().config.FF_layoutWithoutPage) {
                that.oSearchPage = that.createSearchFloorplan(that.getId());
            }
            else {
                var searchPage = new Page(this.getId() + "-searchPage", {
                    customHeader: this.oSearchBar,
                    subHeader: this.oFilterBar,
                    content: [that.createSearchContainer(that.getId())],
                    enableScrolling: true,
                    // @ts-ignore
                    showFooter: {
                        parts: ["/errors/length"],
                        formatter: function (numberErrors) {
                            return numberErrors > 0;
                        },
                    },
                    showHeader: true,
                    // @ts-ignore
                    showSubHeader: {
                        parts: ["/facetVisibility", "/uiFilter/rootCondition"],
                        formatter: function (facetVisibility, rootCondition) {
                            if ((!facetVisibility ||
                                that.getModel().config.searchFilterBarShowWithFacets) &&
                                rootCondition &&
                                rootCondition.hasFilters()) {
                                return true;
                            }
                            return false;
                        },
                    },
                });
                searchPage.setFooter(that.createFooter(that.getId()));
                searchPage.addStyleClass("sapUshellSearchInputHelpPageSearchPage");
                that.oSearchPage = searchPage;
            }
            that.addContent(that.oSearchFieldGroup);
            that.addContent(that.oSearchPage);
        },
        onAfterRendering: function () {
            var that = this;
            if (!that.subscribeDone_SearchFinished &&
                that.getModel &&
                that.getModel() &&
                that.getModel().subscribe) {
                that.getModel().subscribe("ESHSearchFinished", that.onAllSearchFinished, that);
                that.subscribeDone_SearchFinished = true;
            }
            // onAllSearchStarted has no coding, thus do not subscribe yet
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        assembleFilterButton: function () {
            var that = this;
            var filterBtn = new ToggleButton(this.getId() + "-searchBarFilterButton", {
                icon: IconPool.getIconURI("filter"),
                tooltip: {
                    // @ts-ignore
                    parts: ["/facetVisibility"],
                    formatter: function (facetVisibility) {
                        return facetVisibility
                            ? i18n.getText("hideFacetBtn_tooltip")
                            : i18n.getText("showFacetBtn_tooltip");
                    },
                },
                // @ts-ignore
                pressed: "{/facetVisibility}",
                press: function () {
                    if (filterBtn.getPressed()) {
                        // show facet
                        that.searchLayout.setAnimateFacetTransition(true);
                        that.getModel().setFacetVisibility(true);
                        that.searchLayout.setAnimateFacetTransition(false);
                        /* filterBtn.setTooltip(
                            i18n.getText("hideFacetBtn_tooltip")
                        ); */
                    }
                    else {
                        //hide facet
                        that.searchLayout.setAnimateFacetTransition(true);
                        that.getModel().setFacetVisibility(false);
                        that.searchLayout.setAnimateFacetTransition(false);
                        /* filterBtn.setTooltip(
                            i18n.getText("showFacetBtn_tooltip")
                        ); */
                    }
                },
                // @ts-ignore
                visible: {
                    parts: ["/businessObjSearchEnabled", "/count"],
                    formatter: function (businessObjSearchEnabled, count) {
                        if (count === 0) {
                            return false;
                        }
                        return !sap.ui.Device.system.phone && businessObjSearchEnabled;
                    },
                },
            });
            filterBtn.addStyleClass("searchBarFilterButton");
            return filterBtn;
        },
        assembleCountLabel: function () {
            var label = new SearchCountBreadCrumbs();
            return label;
        },
        /**
         * @this SearchCompositeControl
         */
        assembleCountHiddenElement: function () {
            var totalCountHiddenElement = new InvisibleText("", {
                // @ts-ignore
                text: {
                    parts: ["/count", "/nlqSuccess", "/nlqDescription"],
                    formatter: function (count, nlqSuccess, nlqDescription) {
                        if (nlqSuccess) {
                            return nlqDescription;
                        }
                        if (typeof count !== "number") {
                            return "";
                        }
                        return i18n.getText("results_count_for_screenreaders", [count.toString()]);
                    },
                },
            });
            return totalCountHiddenElement;
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        assembleSearchToolbar: function () {
            var that = this;
            // table data export button
            var dataExportButton = new Button((that.getId() ? that.getId() + "-" : "") + "dataExportButton", {
                icon: "sap-icon://download",
                // @ts-ignore
                tooltip: "{i18n>exportData}",
                type: ButtonType.Transparent,
                // @ts-ignore
                visible: {
                    parts: ["/displaySwitchVisibility", "/count"],
                    formatter: function (displaySwitchVisibility, count) {
                        return displaySwitchVisibility && count !== 0;
                    },
                },
                press: function () {
                    if (that.searchSpreadsheet === undefined) {
                        that.searchSpreadsheet = new SearchSpreadsheet("ushell-search-spreadsheet");
                    }
                    that.searchSpreadsheet.onExport();
                },
            }).addStyleClass("sapUshellSearchTableDataExportButton");
            // display-switch tap strips
            var displaySwitchTapStrips = that.assembleDisplaySwitchTapStrips();
            // table sort button
            var tableSortButton = new Button("", {
                icon: "sap-icon://sort",
                // @ts-ignore
                tooltip: "{i18n>sortTable}",
                type: ButtonType.Transparent,
                // @ts-ignore
                visible: {
                    parts: ["/displaySwitchVisibility", "/count", "/tableSortableColumns"],
                    formatter: function (displaySwitchVisibility, count, columns) {
                        return displaySwitchVisibility && count !== 0 && columns.length > 1;
                    },
                },
                press: function () {
                    that.tableSortDialog.open();
                },
            });
            tableSortButton.addStyleClass("sapUshellSearchTableSortButton");
            // display switch tabstrips
            displaySwitchTapStrips.addEventDelegate({
                // needed as by refreshing page the view is not reassembled and hence "that.determineIfMaps(that)" is not run
                onAfterRendering: function (oEvent) {
                    var oDisplaySwitchButtons = oEvent.srcControl;
                    var itemLength = 3; // list, table, grid
                    if (!that.getModel().config.gridView) {
                        itemLength--;
                    }
                    /* if (that.getModel().config.hideListView) {
                        itemLength--;
                    } */
                    // add the map if not already in place
                    if (oDisplaySwitchButtons.getItems().length === itemLength &&
                        that.determineIfMaps(that)) {
                        oDisplaySwitchButtons.addItem(new SegmentedButtonItem("", {
                            icon: "sap-icon://map",
                            // @ts-ignore
                            tooltip: i18n.getText("displayMap"),
                            key: "map",
                        }));
                    }
                    else if (oDisplaySwitchButtons.getItems().length === itemLength + 1 &&
                        !that.determineIfMaps(that)) {
                        // remove map
                        oDisplaySwitchButtons.removeItem(oDisplaySwitchButtons.getItems()[itemLength]);
                        if (that.getModel().getProperty("/resultToDisplay") === "searchResultMap") {
                            if (!that.getModel().config.hideListView) {
                                that.getModel().setProperty("/resultToDisplay", "searchResultList");
                            }
                            else {
                                that.getModel().setProperty("/resultToDisplay", "searchResultTable");
                            }
                        }
                    }
                },
            });
            displaySwitchTapStrips.addStyleClass("sapUshellSearchResultDisplaySwitch");
            var toolbarSeparator1 = new ToolbarSeparator("", {
                // @ts-ignore
                visible: {
                    parts: ["/displaySwitchVisibility", "/count"],
                    formatter: function (displaySwitchVisibility, count) {
                        return displaySwitchVisibility && count !== 0;
                    },
                },
            });
            // table personalize button
            var tablePersonalizeButton = new Button((that.getId() ? that.getId() + "-" : "") + "tablePersonalizeButton", {
                icon: "sap-icon://action-settings",
                // @ts-ignore
                tooltip: "{i18n>personalizeTable}",
                type: ButtonType.Transparent,
                // @ts-ignore
                enabled: {
                    parts: ["/resultToDisplay"],
                    formatter: function (resultToDisplay) {
                        return resultToDisplay === "searchResultTable";
                    },
                },
                visible: {
                    parts: ["/displaySwitchVisibility", "/count", "/tableSortableColumns"],
                    formatter: function (displaySwitchVisibility, count, columns) {
                        return displaySwitchVisibility && count !== 0 && columns.length > 1;
                    },
                },
                press: function () {
                    that.oTablePersoController.openDialog();
                },
            });
            tablePersonalizeButton.addStyleClass("sapUshellSearchTablePersonalizeButton");
            var toolbar = [];
            var bWithShareButton = this.getModel().config.isUshell;
            if (bWithShareButton) {
                var shareButton = this.assembleShareButton();
                toolbar = [
                    dataExportButton,
                    tableSortButton,
                    tablePersonalizeButton,
                    shareButton,
                    toolbarSeparator1,
                    displaySwitchTapStrips,
                ];
            }
            else {
                toolbar = [
                    dataExportButton,
                    tableSortButton,
                    tablePersonalizeButton,
                    toolbarSeparator1,
                    displaySwitchTapStrips,
                ];
            }
            var customToolbar = that.getModel().config.getCustomToolbar();
            if (customToolbar.length > 0) {
                customToolbar.push(new ToolbarSeparator("", {
                    // @ts-ignore
                    visible: {
                        parts: ["/displaySwitchVisibility", "/count"],
                        formatter: function (displaySwitchVisibility, count) {
                            return displaySwitchVisibility && count !== 0;
                        },
                    },
                }));
            }
            toolbar = customToolbar.concat(toolbar);
            return toolbar;
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        assembleShareButton: function () {
            var that = this;
            // create bookmark button (entry in action sheet)
            // @ts-ignore
            var oBookmarkButton = new sap.ushell.ui.footerbar.AddBookmarkButton("", {
                beforePressHandler: function () {
                    var oAppData = {
                        url: document.URL,
                        title: that.getModel().getDocumentTitle(),
                        icon: IconPool.getIconURI("search"),
                    };
                    oBookmarkButton.setAppData(oAppData);
                },
            });
            oBookmarkButton.setWidth("auto");
            var oEmailButton = new Button();
            oEmailButton.setIcon("sap-icon://email");
            oEmailButton.setText(i18n.getText("eMailFld"));
            oEmailButton.attachPress(function () {
                // @ts-ignore
                sap.m.URLHelper.triggerEmail(null, that.getModel().getDocumentTitle(), document.URL);
            });
            oEmailButton.setWidth("auto");
            // create action sheet
            var oActionSheet = new ActionSheet("", {
                placement: PlacementType.Bottom,
                buttons: [oBookmarkButton, oEmailButton],
            });
            // button which opens action sheet
            var oShareButton = new Button("", {
                icon: "sap-icon://action",
                // @ts-ignore
                tooltip: i18n.getText("shareBtn"),
                press: function () {
                    oActionSheet.openBy(oShareButton);
                },
            });
            return oShareButton;
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        assembleDataSourceTapStrips: function () {
            var that = this;
            var tabBar = new OverflowToolbar("", {
                design: ToolbarDesign.Transparent,
                // @ts-ignore
                visible: {
                    parts: ["/facetVisibility", "/count", "/businessObjSearchEnabled"],
                    formatter: function (facetVisibility, count, bussinesObjSearchEnabled) {
                        return !facetVisibility && count > 0 && bussinesObjSearchEnabled;
                    },
                },
            });
            // define group for F6 handling
            tabBar.data("sap-ui-fastnavgroup", "false", true /* write into DOM */);
            tabBar.addStyleClass("searchTabStrips");
            that.tabBar = tabBar;
            var tabBarAriaLabel = new InvisibleText("", {
                text: "Data Sources",
            }).toStatic();
            tabBar.addDependent(tabBarAriaLabel);
            tabBar.addAriaLabelledBy(tabBarAriaLabel);
            tabBar.bindAggregation("content", {
                path: "/tabStrips/strips",
                factory: function (sId, oContext) {
                    var button = new ToggleButton("", {
                        text: "{labelPlural}",
                        // @ts-ignore
                        type: {
                            parts: ["/tabStrips/selected"],
                            // eslint-disable-next-line no-unused-vars
                            formatter: function (selectedDS) {
                                return ButtonType.Transparent;
                            },
                        },
                        // @ts-ignore
                        pressed: {
                            parts: ["/tabStrips/selected"],
                            formatter: function (selectedDS) {
                                var myDatasource = this.getBindingContext().getObject();
                                return myDatasource === selectedDS;
                            },
                        },
                        press: function () {
                            if (that.getModel().config.searchScopeWithoutAll) {
                                return;
                            }
                            button.setType(ButtonType.Transparent);
                            // clicking on the already selected button has neither UI effect(button stays pressed status) nor reloading of search
                            if (button.getBindingContext().getObject() ===
                                that.getModel().getProperty("/tabStrips/selected")) {
                                button.setPressed(true);
                                return;
                            }
                            var aButtons = /** @type {ToggleButton[]} */ (that.tabBar.getContent());
                            for (var i = 0; i < aButtons.length; i++) {
                                // @ts-ignore
                                if (aButtons[i].getId() !== this.getId()) {
                                    aButtons[i].setType(ButtonType.Transparent);
                                    if (aButtons[i].getPressed() === true) {
                                        aButtons[i].setPressed(false);
                                    }
                                }
                            }
                            // set Datasource to current datasource;
                            that.getModel().setDataSource(button.getBindingContext().getObject());
                        },
                    });
                    var buttonAriaLabel = new InvisibleText("", {
                        text: oContext.getProperty("labelPlural") + ", " + i18n.getText("dataSource"),
                    }).toStatic();
                    button.addAriaLabelledBy(buttonAriaLabel);
                    button.addDependent(buttonAriaLabel);
                    return button;
                },
            });
            // @ts-ignore
            tabBar._setupItemNavigation = function () {
                if (!this.theItemNavigation) {
                    // @ts-ignore
                    this.theItemNavigation = new ItemNavigation();
                    // @ts-ignore
                    this.addDelegate(this.theItemNavigation);
                }
                this.theItemNavigation.setCycling(false);
                // @ts-ignore
                this.theItemNavigation.setRootDomRef(this.getDomRef());
                var itemDomRefs = [];
                // @ts-ignore
                var content = this.getContent();
                for (var i = 0; i < content.length; i++) {
                    if (!$(content[i].getDomRef()).attr("tabindex")) {
                        var tabindex = "-1";
                        if (content[i].getPressed && content[i].getPressed()) {
                            tabindex = "0";
                        }
                        $(content[i].getDomRef()).attr("tabindex", tabindex);
                    }
                    itemDomRefs.push(content[i].getDomRef());
                }
                var overflowButton = tabBar.getAggregation("_overflowButton");
                // @ts-ignore
                if (overflowButton && overflowButton.getDomRef) {
                    // @ts-ignore
                    var _overflowButton = overflowButton.getDomRef();
                    itemDomRefs.push(_overflowButton);
                    $(_overflowButton).attr("tabindex", "-1");
                }
                this.theItemNavigation.setItemDomRefs(itemDomRefs);
            };
            return tabBar;
        },
        determineIfMaps: function (oContext) {
            var bIfMaps = false;
            if (oContext.getModel()) {
                if (oContext.getModel().config.maps === true) {
                    bIfMaps = true;
                }
                else if (oContext.getModel().config.maps === false) {
                    bIfMaps = false;
                }
                else {
                    // config.maps undefined
                    // -> check if a geo-attribute exists
                    var dataSource = oContext.getModel().getDataSource();
                    if (typeof dataSource !== "undefined" && dataSource.attributesMetadata) {
                        var attributesMetadata = dataSource.attributesMetadata;
                        for (var i = 0; i < attributesMetadata.length; i++) {
                            var type = attributesMetadata[i].type;
                            if (type === "GeoJson") {
                                bIfMaps = true;
                                break;
                            }
                        }
                    }
                }
            }
            return bIfMaps;
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        assembleDisplaySwitchTapStrips: function () {
            var that = this;
            var items = [
                // list
                new SegmentedButtonItem("", {
                    icon: "sap-icon://list",
                    // @ts-ignore
                    tooltip: i18n.getText("displayList"),
                    key: "list",
                    visible: "{=!${/config/hideListView}}",
                }),
                // table
                new SegmentedButtonItem("", {
                    icon: "sap-icon://table-view",
                    // @ts-ignore
                    tooltip: i18n.getText("displayTable"),
                    key: "table",
                    visible: true,
                }),
                // grid
                new SegmentedButtonItem("", {
                    icon: "sap-icon://grid",
                    // @ts-ignore
                    tooltip: i18n.getText("displayGrid"),
                    key: "grid",
                    // @ts-ignore
                    visible: "{/config/gridView}",
                }),
            ];
            // violate CSP
            // if (that.determineIfMaps(that)) {
            //     // map
            //     items.push(
            //         new SegmentedButtonItem("", {
            //             icon: "sap-icon://map",
            //             // @ts-ignore
            //             tooltip: i18n.getText("displayMap"),
            //             key: "map",
            //         })
            //     );
            // }
            if (typeof that.getModel().config.defaultResultViewType !== "undefined") {
                items = that.reArrangeDisplaySwitchTapStripButtons(items);
            }
            var oSegmentedButton = new SegmentedButton(this.getId() + "-ResultViewType", {
                // @ts-ignore
                selectedKey: {
                    parts: ["/resultToDisplay"],
                    formatter: function (resultToDisplay) {
                        var res = "";
                        if (resultToDisplay === "searchResultList") {
                            res = "list";
                        }
                        else if (resultToDisplay === "searchResultTable") {
                            res = "table";
                        }
                        else if (resultToDisplay === "searchResultGrid") {
                            res = "grid";
                        }
                        else if (resultToDisplay === "searchResultMap") {
                            res = "map";
                        }
                        // fallback
                        if (res === "") {
                            res = "list";
                        }
                        return res;
                    },
                },
                items: items,
                // @ts-ignore
                visible: {
                    parts: ["/displaySwitchVisibility", "/count"],
                    formatter: function (displaySwitchVisibility, count) {
                        return displaySwitchVisibility && count !== 0;
                    },
                },
                /*eslint-disable no-extra-bind*/
                selectionChange: function (oEvent) {
                    var key = oEvent.getParameter("item").getKey();
                    var model = that.getModel();
                    switch (key) {
                        case "list":
                            model.setResultToDisplay("searchResultList");
                            that.showMoreFooter.setVisible(that.isShowMoreFooterVisible());
                            that.searchResultMap.setVisible(false);
                            break;
                        case "table":
                            model.setResultToDisplay("searchResultTable");
                            that.showMoreFooter.setVisible(that.isShowMoreFooterVisible());
                            that.searchResultMap.setVisible(false);
                            break;
                        case "grid":
                            model.setResultToDisplay("searchResultGrid");
                            that.showMoreFooter.setVisible(that.isShowMoreFooterVisible());
                            that.searchResultMap.setVisible(false);
                            break;
                        case "map":
                            model.setResultToDisplay("searchResultMap");
                            that.showMoreFooter.setVisible(that.isShowMoreFooterVisible());
                            break;
                        default:
                            model.setResultToDisplay("searchResultList");
                            that.showMoreFooter.setVisible(that.isShowMoreFooterVisible());
                    }
                    model.enableOrDisableMultiSelection();
                    model._firePerspectiveQuery(); // search will be retriggered if model.invalidQuery()
                }.bind(this),
            });
            oSegmentedButton.addStyleClass("sapUshellSearchDisplaySwitchTapStrips");
            return oSegmentedButton;
        },
        isShowMoreFooterVisible: function () {
            var model = this.getModel();
            return model.getProperty("/boCount") > model.getProperty("/boResults").length;
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        assembleCenterArea: function (idPrefix) {
            var that = this;
            // sort dialog
            that.tableSortDialog = that.assembleSearchResultSortDialog();
            // search result list
            var searchResultList = that.assembleSearchResultList();
            // search result table
            that.searchResultTable = that.assembleSearchResultTable(idPrefix);
            that.searchResultTable.addDelegate({
                onBeforeRendering: function () {
                    that.updateTableLayout();
                },
                onAfterRendering: function () {
                    var $tableTitleRow = $(that.searchResultTable.getDomRef()).find("table > thead > tr:first");
                    if ($tableTitleRow) {
                        $tableTitleRow.attr("aria-labelledby", that.totalCountHiddenElement.getId());
                    }
                },
            });
            // search result grid
            that.searchResultGrid = that.assembleSearchResultGrid();
            // search result map
            that.searchResultMap = that.assembleSearchResultMap();
            that.searchResultMap.setVisible(false);
            // app search result
            that.appSearchResult = that.assembleAppSearch();
            // show more footer
            that.showMoreFooter = that.assembleShowMoreFooter();
            return [
                that.tableSortDialog,
                searchResultList,
                that.searchResultTable,
                that.searchResultGrid,
                that.searchResultMap,
                that.appSearchResult,
                that.showMoreFooter,
                that.totalCountHiddenElement,
            ];
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        assembleSearchResultSortDialog: function () {
            var that = this;
            var tableSortDialog = new ViewSettingsDialog("", {
                // @ts-ignore
                sortDescending: {
                    parts: ["/orderBy"],
                    formatter: function (orderBy) {
                        return jQuery.isEmptyObject(orderBy) || orderBy.sortOrder === "DESC";
                    },
                },
                confirm: function (evt) {
                    var mParams = [];
                    mParams = evt.getParameters();
                    if (mParams.sortItem) {
                        var oCurrentModel = that.getModel();
                        if (mParams.sortItem.getKey() === "searchSortableColumnKeyDefault") {
                            oCurrentModel.resetOrderBy();
                            tableSortDialog.setSortDescending(true);
                        }
                        else {
                            oCurrentModel.setOrderBy({
                                orderBy: mParams.sortItem.getBindingContext().getObject().attributeId,
                                sortOrder: mParams.sortDescending === true ? "DESC" : "ASC",
                            });
                        }
                    }
                },
                cancel: function () {
                    var lastOrder = that.getModel().getOrderBy().sortOrder;
                    var lastOrderBy = that.getModel().getOrderBy().orderBy;
                    if (lastOrder === undefined || lastOrderBy === undefined) {
                        tableSortDialog.setSortDescending(true);
                        tableSortDialog.setSelectedSortItem("searchSortableColumnKeyDefault");
                        return;
                    }
                    // reset selected value to last sort order
                    if (lastOrder.toLowerCase() === "asc") {
                        tableSortDialog.setSortDescending(false);
                    }
                    else {
                        tableSortDialog.setSortDescending(true);
                    }
                    // reset selected value to last sort column
                    var lastSortItemKey = "searchSortableColumnKeyDefault"; // default sort item
                    for (var i = 0; i < tableSortDialog.getSortItems().length; i++) {
                        var sortItem = tableSortDialog.getSortItems()[i];
                        if (sortItem.getBindingContext().getObject().attributeId === lastOrderBy) {
                            lastSortItemKey = sortItem.getKey();
                            break;
                        }
                    }
                    tableSortDialog.setSelectedSortItem(lastSortItemKey);
                },
                resetFilters: function () {
                    var sortableColumns = that.getModel().getProperty("/tableSortableColumns");
                    for (var i = 0; i < sortableColumns.length; ++i) {
                        var sortableColumn = sortableColumns[i];
                        if (sortableColumn.key === "searchSortableColumnKeyDefault") {
                            sortableColumn.selected = true;
                        }
                        else {
                            sortableColumn.selected = false;
                        }
                    }
                    that.getModel().setProperty("/tableSortableColumns", sortableColumns);
                },
            });
            tableSortDialog.bindAggregation("sortItems", {
                path: "/tableSortableColumns",
                factory: function () {
                    return new ViewSettingsItem("", {
                        key: "{key}",
                        text: "{name}",
                        // @ts-ignore
                        selected: "{selected}", // Not binding because of setSlected in ItemPropertyChanged event
                    });
                },
            });
            return tableSortDialog;
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        assembleSearchResultGrid: function () {
            var resultGrid;
            if (typeof this.getModel().config.customGridView === "function") {
                resultGrid = this.getModel().config.customGridView();
            }
            else {
                var l = new GridContainerSettings("", {
                    rowSize: "11rem",
                    columnSize: "11rem",
                    gap: "0.5rem",
                });
                resultGrid = new SearchResultGrid(this.getId() + "-ushell-search-result-grid", {
                    layout: l,
                    snapToRow: true,
                });
            }
            resultGrid.bindProperty("visible", {
                parts: ["/resultToDisplay", "/count"],
                formatter: function (resultToDisplay, count) {
                    return resultToDisplay === "searchResultGrid" && count !== 0;
                },
            });
            resultGrid.addStyleClass("sapUshellSearchGrid");
            return resultGrid;
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        assembleSearchResultTable: function (idPrefix) {
            var that = this;
            var resultTable = new SearchResultTable(idPrefix + "-ushell-search-result-table", {
                mode: {
                    parts: ["/multiSelectionEnabled"],
                    formatter: function (multiSelectionEnabled) {
                        return multiSelectionEnabled === true ? ListMode.MultiSelect : ListMode.None;
                    },
                },
                noDataText: "{i18n>noCloumnsSelected}",
                visible: {
                    parts: ["/resultToDisplay", "/count"],
                    formatter: function (resultToDisplay, count) {
                        return resultToDisplay === "searchResultTable" && count !== 0;
                    },
                },
                popinLayout: PopinLayout.GridLarge,
                rememberSelections: false,
                selectionChange: function () {
                    that.getModel().updateMultiSelectionSelected();
                },
            });
            resultTable.bindAggregation("columns", "/tableColumns", function (path, bData) {
                var tableColumn = bData.getObject();
                var column = new Column(idPrefix + "-" + tableColumn.key, {
                    header: new Label("", {
                        text: "{name}",
                        // @ts-ignore
                        tooltip: "{name}",
                    }),
                    // @ts-ignore
                    visible: {
                        parts: ["index", "attributeId"],
                        formatter: function (index, attributeId) {
                            if (that.getModel().config.extendTableColumn) {
                                // extend table column should be default shown
                                return (index < 7 ||
                                    attributeId ===
                                        that.getModel().config.extendTableColumn.column.attributeId);
                            }
                            return index < 6; // first 6 attributes are visible, including title and title description
                        },
                    },
                    width: "{width}",
                });
                return column;
            });
            resultTable.bindAggregation("items", "/tableResults", function (path, bData) {
                return that.assembleTableItems(bData);
            });
            resultTable.addEventDelegate({
                onAfterRendering: function () {
                    that.updatePersoServiceAndController();
                    var $table = $(this.getDomRef());
                    $table.find("table tbody tr").each(function () {
                        var $this = $(this);
                        var tableRow = sap.ui.getCore().byId($this.attr("id"));
                        if (tableRow) {
                            // @ts-ignore
                            var currentAriaLabelledBy = tableRow.getAriaLabelledBy();
                            if ($.inArray(that.totalCountHiddenElement.getId(), currentAriaLabelledBy) ===
                                -1) {
                                // @ts-ignore
                                tableRow.addAriaLabelledBy(that.totalCountHiddenElement);
                            }
                        }
                        return false; // stop after first line for now
                    });
                }.bind(resultTable),
            });
            return resultTable;
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        assembleTableItems: function (bData) {
            var that = this;
            var oData = bData.getObject();
            if (oData.type === "footer") {
                return new CustomListItem("", {
                    visible: false,
                }); // return empty list item
            }
            return that.assembleTableMainItems(oData, bData.getPath());
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        // @ts-ignore
        assembleTableMainItems: function (oData, path) {
            var that = this;
            var subPath = path + "/cells";
            var columnListItem = new ColumnListItem("", {
                // @ts-ignore
                selected: "{selected}",
            }).addStyleClass("sapUshellSearchTable");
            columnListItem.bindAggregation("cells", {
                path: subPath,
                factory: function (subPath, bData) {
                    if (bData.getObject().isTitle) {
                        // build title cell
                        var titleUrl = "";
                        var target = void 0;
                        var titleNavigation = bData.getObject().titleNavigation;
                        if (titleNavigation) {
                            titleUrl = titleNavigation.getHref();
                            target = titleNavigation.getTarget();
                        }
                        var enabled = !!(titleUrl && titleUrl.length > 0);
                        var titleLink = new SearchLink({
                            text: "{value}",
                            tooltip: "{value}",
                            enabled: enabled,
                            press: function () {
                                var titleNavigation = bData.getObject().titleNavigation;
                                if (titleNavigation) {
                                    titleNavigation.performNavigation({
                                        trackingOnly: true,
                                    });
                                }
                            },
                        });
                        titleLink.setHref(titleUrl);
                        titleLink.setTooltip(titleLink.getText());
                        var titleIconUrl = bData.getObject().titleIconUrl;
                        if (titleIconUrl) {
                            var oIcon = new Icon("", {
                                src: titleIconUrl,
                            });
                            titleLink.setAggregation("icon", oIcon);
                        }
                        // for tooltip handling
                        // see in SearchResultTable.onAfterRendering for event handlers
                        titleLink.addStyleClass("sapUshellSearchResultListItem-MightOverflow");
                        titleLink.addStyleClass("sapUshellSearchTableTitleLink");
                        if (target) {
                            titleLink.setTarget(target);
                        }
                        var returnObject = titleLink;
                        var titleInfoIconUrl = bData.getObject().titleInfoIconUrl;
                        if (titleInfoIconUrl) {
                            var titleInfoIcon = new Icon("", {
                                src: titleInfoIconUrl,
                                // @ts-ignore
                                tooltip: i18n.getText("collectionShared"),
                            }).addStyleClass("sapUshellSearchTableTitleInfoIcon");
                            returnObject = new HBox("", {
                                items: [titleLink, titleInfoIcon],
                            });
                        }
                        return returnObject;
                    }
                    else if (bData.getObject().isRelatedApps) {
                        // build related objects aka navigation objects cell
                        var navigationObjects = bData.getObject().navigationObjects;
                        var navigationButtons_1 = [];
                        var navigationButton = {};
                        var pressButton = function (event, navigationObject) {
                            navigationObject.performNavigation();
                        };
                        /*eslint-disable no-loop-func*/
                        for (var i = 0; i < navigationObjects.length; i++) {
                            var navigationObject = navigationObjects[i];
                            navigationButton = new Button("", {
                                text: navigationObject.getText(),
                                tooltip: navigationObject.getText(),
                            });
                            navigationButton.attachPress(navigationObject, pressButton);
                            navigationButtons_1.push(navigationButton);
                        }
                        /*eslint-enable no-loop-func*/
                        return new Button("", {
                            icon: "sap-icon://action",
                            press: function () {
                                var actionSheet = new ActionSheet("", {
                                    buttons: navigationButtons_1,
                                    placement: PlacementType.Auto,
                                });
                                actionSheet.openBy(this);
                            },
                        });
                    }
                    else if (bData.getObject().isExtendTableColumnCell) {
                        return that
                            .getModel()
                            .config.extendTableColumn.bindingFunction(bData.getObject());
                    }
                    // build other cells
                    var cell = new SearchText({
                        text: "{value}",
                        isForwardEllipsis4Whyfound: true,
                    }).addStyleClass("sapUshellSearchResultListItem-MightOverflow");
                    if (bData.getObject().icon) {
                        var cellIcon = new Icon("", {
                            src: bData.getObject().icon,
                        });
                        cell.setAggregation("icon", cellIcon);
                    }
                    return cell;
                },
            });
            return columnListItem;
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        assembleSearchResultMap: function () {
            // violate CSP
            // const oSearchResultMap = new SearchMap({
            //     visible: {
            //         parts: ["/resultToDisplay", "/count"],
            //         formatter: function (resultToDisplay, count) {
            //             return resultToDisplay === "searchResultMap" && count !== 0;
            //         },
            //     },
            // });
            // return oSearchResultMap;
            return new sap.m.HBox();
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        assembleShowMoreFooter: function () {
            var that = this;
            var button = new Button("", {
                text: "{i18n>showMore}",
                type: ButtonType.Transparent,
                press: function () {
                    var oCurrentModel = that.getModel();
                    oCurrentModel.setProperty("/focusIndex", oCurrentModel.getTop());
                    var newTop = oCurrentModel.getTop() + oCurrentModel.pageSize;
                    oCurrentModel.setTop(newTop);
                    oCurrentModel.eventLogger.logEvent({
                        type: oCurrentModel.eventLogger.SHOW_MORE,
                    });
                },
            });
            button.addStyleClass("sapUshellResultListMoreFooter");
            var container = new FlexBox("", {
                /* footer item in model no longer needed -> remove*/
                // @ts-ignore
                visible: {
                    parts: ["/boCount", "/boResults"],
                    formatter: function (boCount, boResults) {
                        return boResults.length < boCount;
                    },
                },
                justifyContent: FlexJustifyContent.Center,
            });
            container.addStyleClass("sapUshellResultListMoreFooterContainer");
            container.addItem(button);
            return container;
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        assembleSearchResultList: function () {
            var that = this;
            that.resultList = new SearchResultList({
                mode: ListMode.None,
                width: "auto",
                showNoData: false,
                visible: {
                    parts: ["/resultToDisplay", "/count"],
                    formatter: function (resultToDisplay, count) {
                        return resultToDisplay === "searchResultList" && count !== 0;
                    },
                },
            });
            that.resultList.bindAggregation("items", "/results", function (path, oContext) {
                return that.assembleListItem(oContext);
            });
            return that.resultList;
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        assembleAppSearch: function () {
            var that = this;
            var l1 = new GridContainerSettings("", {
                rowSize: "5.5rem",
                columnSize: "5.5rem",
                gap: "0.25rem",
            });
            var gridContainer = new GridContainer("", {
                layout: l1,
                snapToRow: true,
                // @ts-ignore
                visible: {
                    parts: ["/resultToDisplay", "/count"],
                    formatter: function (resultToDisplay, count) {
                        return resultToDisplay === "appSearchResult" && count !== 0;
                    },
                },
                items: {
                    // @ts-ignore
                    path: "/appResults",
                    factory: function (id, context) {
                        if (that.getModel().getResultToDisplay() === "appSearchResult") {
                            var item = context.getObject();
                            var visualization_1 = item.visualization;
                            var visualizationService = that.getModel().uShellVisualizationInstantiationService;
                            var visualizationControl = visualizationService.instantiateVisualization(visualization_1);
                            visualizationControl.attachPress(function () {
                                that.getModel().eventLogger.logEvent({
                                    type: that.getModel().eventLogger.TILE_NAVIGATE,
                                    tileTitle: visualization_1.title,
                                    targetUrl: visualization_1.targetURL,
                                });
                            });
                            visualizationControl.addEventDelegate({
                                onAfterRendering: that.highlightTile,
                            });
                            visualizationControl.setActive(false, true);
                            visualizationControl.setLayoutData(new GridContainerItemLayoutData(visualizationControl.getLayout()));
                            return visualizationControl;
                        }
                        // bind dummy view, prevent douplicated binding
                        return new Text("", {
                            text: "",
                        });
                    },
                },
            });
            gridContainer.addStyleClass("sapUshellSearchGridContainer");
            var button = new Button("", {
                text: "{i18n>showMore}",
                type: ButtonType.Transparent,
                // @ts-ignore
                visible: {
                    parts: ["/resultToDisplay", "/appCount", "/appResults"],
                    formatter: function (resultToDisplay, appCount, appResults) {
                        return resultToDisplay === "appSearchResult" && appResults.length < appCount;
                    },
                },
                press: function () {
                    var model = that.getModel();
                    var newTop = model.getTop() + model.pageSize;
                    model.setProperty("/focusIndex", model.getTop());
                    model.setTop(newTop);
                    model.eventLogger.logEvent({
                        type: model.eventLogger.SHOW_MORE,
                    });
                },
            });
            button.addStyleClass("sapUshellResultListMoreFooter");
            var verticalLayout = new VerticalLayout("", {
                width: "100%",
                // @ts-ignore
                visible: {
                    parts: ["/resultToDisplay", "/count"],
                    formatter: function (resultToDisplay, count) {
                        return resultToDisplay === "appSearchResult" && count !== 0;
                    },
                },
                content: [gridContainer, button],
            });
            verticalLayout.addStyleClass("sapUshellResultApps");
            return verticalLayout;
        },
        highlightTile: function (oEvent) {
            var oInnerControl = oEvent.srcControl.getAggregation("content");
            if (oInnerControl) {
                var aControls = oInnerControl.findAggregatedObjects(true, function (oControl) {
                    return oControl.isA("sap.m.GenericTile") || oControl.isA("sap.f.Card");
                });
                if (aControls.length === 0 && oInnerControl.getComponentInstance) {
                    aControls = oInnerControl
                        .getComponentInstance()
                        .findAggregatedObjects(true, function (oControl) {
                        return oControl.isA("sap.m.GenericTile") || oControl.isA("sap.f.Card");
                    });
                }
                if (aControls.length > 0) {
                    var tile = aControls[0];
                    var tileHighlighter = new SearchTileHighlighter();
                    tileHighlighter.setHighlightTerms(oEvent.srcControl.getModel().getProperty("/uiFilter/searchTerm"));
                    tileHighlighter.highlight(tile);
                }
            }
        },
        // assemble app container result list item
        // ===================================================================
        assembleAppContainerResultListItem: function () {
            var that = this;
            var l = new GridContainerSettings("", {
                rowSize: "5.5rem",
                columnSize: "5.5rem",
                gap: "0.25rem",
            });
            var container = new GridContainer("", {
                layout: l,
                snapToRow: true,
                items: {
                    // @ts-ignore
                    path: "/appResults",
                    factory: function (id, context) {
                        if (that.getModel().getResultToDisplay() !== "appSearchResult") {
                            var item = context.getObject();
                            var visualization_2 = item.visualization;
                            var visualizationService = that.getModel().uShellVisualizationInstantiationService;
                            var visualizationControl = visualizationService.instantiateVisualization(visualization_2);
                            visualizationControl.attachPress(function () {
                                that.getModel().eventLogger.logEvent({
                                    type: that.getModel().eventLogger.TILE_NAVIGATE,
                                    tileTitle: visualization_2.title,
                                    targetUrl: visualization_2.targetURL,
                                });
                            });
                            visualizationControl.addEventDelegate({
                                onAfterRendering: that.highlightTile,
                            });
                            visualizationControl.setActive(false, true);
                            visualizationControl.setLayoutData(new GridContainerItemLayoutData(visualizationControl.getLayout()));
                            return visualizationControl;
                        }
                        // bind dummy view, prevent douplicated binding
                        // tile can handel only one view
                        return new Text(id, {
                            text: "",
                        });
                    },
                },
            });
            container.addStyleClass("sapUshellSearchGridContainer");
            container.addEventDelegate({
                /**
                 * @this GridContainer
                 */
                onAfterRendering: function () {
                    var that = this;
                    // calculate the suitable items for container
                    // @ts-ignore
                    if (that.getDomRef().clientWidth === 0) {
                        return;
                    }
                    // @ts-ignore
                    var maxWidth = that.getDomRef().clientWidth - 176; // container width - last show more tile width
                    var maxItems = Math.floor(maxWidth / 184);
                    var fullItems = that.getItems();
                    var appCount = that.getModel().getProperty("/appCount");
                    var boCount = that.getModel().getProperty("/boCount");
                    if (fullItems.length > maxItems + 1) {
                        // items greater than maxItems+showMore, must be cut
                        var width = 0, i = 0;
                        for (; i < fullItems.length; i++) {
                            // @ts-ignore
                            width = width + fullItems[i].getDomRef().clientWidth + 8; // tile width + margin
                            if (width > maxWidth) {
                                break;
                            }
                        }
                        var appResults = that.getModel().getProperty("/appResults");
                        that.getModel().setProperty("/appResults", appResults.slice(0, i));
                    }
                    else {
                        var lastItem = fullItems[fullItems.length - 1];
                        // appCount greater than maxItems, add showMore tile
                        if (appCount > maxItems &&
                            !lastItem.hasStyleClass("sapUshellSearchResultListItemAppsShowMore")) {
                            var showMoreTile = new GenericTile("", {
                                tileContent: new TileContent("", {
                                    content: new Text("", {
                                        // @ts-ignore
                                        text: i18n.getText("showMoreApps"),
                                    }),
                                }),
                                press: function () {
                                    var model = that.getModel();
                                    model.setDataSource(model.appDataSource);
                                },
                            });
                            showMoreTile.addStyleClass("sapUshellSearchResultListItemAppsShowMore");
                            that.addItem(showMoreTile);
                            // force update showMore button to avoid outdated binding
                            that.getModel().setProperty("/resultToDisplay", "appSearchResult");
                            that.getModel().setProperty("/resultToDisplay", "searchResultList");
                            that.getModel().setProperty("/boCount", 0);
                            that.getModel().setProperty("/boCount", boCount);
                        }
                    }
                },
            }, container);
            var listItem = new CustomListItem("", {
                content: container,
            });
            listItem.addStyleClass("sapUshellSearchResultListItem");
            listItem.addStyleClass("sapUshellSearchResultListItemApps");
            listItem.addEventDelegate({
                onAfterRendering: function () {
                    var $listItem = $(listItem.getDomRef());
                    $listItem.removeAttr("tabindex");
                    $listItem.removeAttr("role");
                    $listItem.attr("aria-hidden", "true");
                },
            }, listItem);
            return listItem;
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        assembleResultListItem: function (oData) {
            var that = this;
            /* eslint new-cap:0 */
            var dataSourceConfig = this.getModel().config.getDataSourceConfig(oData.dataSource);
            var searchResultListItemSettings = {
                dataSource: oData.dataSource,
                title: "{title}",
                titleDescription: "{titleDescription}",
                titleNavigation: "{titleNavigation}",
                type: "{dataSourceName}",
                imageUrl: "{imageUrl}",
                imageFormat: "{imageFormat}",
                imageNavigation: "{imageNavigation}",
                geoJson: "{geoJson}",
                attributes: "{itemattributes}",
                navigationObjects: "{navigationObjects}",
                selected: "{selected}",
                expanded: "{expanded}",
                positionInList: "{positionInList}",
                resultSetId: "{resultSetId}",
                layoutCache: "{layoutCache}",
                titleIconUrl: "{titleIconUrl}",
                titleInfoIconUrl: "{titleInfoIconUrl}",
            };
            var item;
            if (dataSourceConfig.searchResultListItemControl) {
                item = new dataSourceConfig.searchResultListItemControl(searchResultListItemSettings);
            }
            else if (dataSourceConfig.searchResultListItemContentControl) {
                searchResultListItemSettings.content =
                    new dataSourceConfig.searchResultListItemContentControl();
                item = new CustomSearchResultListItem(searchResultListItemSettings);
            }
            else {
                item = new SearchResultListItem(searchResultListItemSettings);
            }
            if (item.setTotalCountHiddenElement) {
                item.setTotalCountHiddenElement(that.totalCountHiddenElement);
            }
            var listItem = new CustomListItem("", {
                content: item,
                type: ListType.Inactive,
            });
            listItem.addStyleClass("sapUshellSearchResultListItem");
            if (item.setParentListItem) {
                item.setParentListItem(listItem);
            }
            return listItem;
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        assembleListItem: function (oContext) {
            var that = this;
            var oData = oContext.getObject();
            if (oData.type === "title") {
                return that.assembleTitleItem(oData);
            }
            else if (oData.type === "footer") {
                return new CustomListItem(); // return empty list item
            }
            else if (oData.type === "appcontainer") {
                return that.assembleAppContainerResultListItem(); // (oData, oContext.getPath());
            }
            return that.assembleResultListItem(oData); // , oContext.getPath());
        },
        // - obsolete
        onAllSearchStarted: function () {
            // const that = this;
            // that.showMoreFooter.setVisible(false);
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        onAllSearchFinished: function () {
            var that = this;
            that.reorgTabBarSequence();
            that.chooseNoResultScreen(); // there can be custom no-result-screems, depending on data source
            that.oFocusHandler.setFocus();
            var viewPortContainer = sap.ui.getCore().byId("viewPortContainer");
            // @ts-ignore
            if (viewPortContainer && viewPortContainer.switchState) {
                // @ts-ignore
                viewPortContainer.switchState("Center");
            }
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        updatePersoServiceAndController: function () {
            var that = this;
            var model = that.getModel();
            var dsKey = model.getDataSource().id;
            var serviceId = "search-result-table-state-" + dsKey;
            var tableId = that.getId() + "-ushell-search-result-table";
            var table = /** @type {SearchResultTable} */ (sap.ui.getCore().byId(tableId));
            if (!that.oTablePersoController) {
                var personalizationStorageInstance = model.getPersonalizationStorageInstance();
                var componentName = model.config.isUshell
                    ? "sap.ushell.renderers.fiori2.search.container"
                    : "";
                that.oTablePersoController = new TablePersoController("", {
                    table: table,
                    persoService: personalizationStorageInstance.getPersonalizer(serviceId),
                    componentName: componentName,
                }).activate();
                that.oTablePersoController.refresh();
            }
            if ((that.oTablePersoController &&
                // @ts-ignore
                that.oTablePersoController.getPersoService().getKey() !== serviceId) ||
                that.sTableMode != table.getMode()) {
                // bug fix for table with multiselection, which has one more afterRendering
                that.oTablePersoController.setPersoService(model.getPersonalizationStorageInstance().getPersonalizer(serviceId));
                that.oTablePersoController.refresh();
                that.sTableMode = table.getMode();
            }
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        updateTableLayout: function () {
            var that = this;
            // set layout after persoConroller and persData initialized
            // then get columns which is personaized as visible
            if (that.searchResultTable && that.oTablePersoController) {
                var dsKey = that.getModel().getDataSource().id;
                var serviceId = "search-result-table-state-" + dsKey;
                that.oTablePersoController
                    // @ts-ignore
                    .getPersoService(serviceId)
                    // @ts-ignore
                    .getPersData()
                    .then(function (persData) {
                    if (persData && persData.aColumns) {
                        var psersColumns = persData.aColumns;
                        var tableColumns = this.searchResultTable.getColumns();
                        var visibleCloumns = 0;
                        for (var i = 0; i < psersColumns.length; i++) {
                            var index = psersColumns[i].id.split("table-searchColumnKey").pop();
                            var mappedColumn = tableColumns[parseInt(index, 10)];
                            if (mappedColumn) {
                                mappedColumn.setDemandPopin(false);
                                if (psersColumns[i].visible) {
                                    visibleCloumns++;
                                    mappedColumn.setDemandPopin(true);
                                    mappedColumn.setPopinDisplay(PopinDisplay.Inline);
                                    var minScreenWidth = 12 * visibleCloumns;
                                    mappedColumn.setMinScreenWidth(minScreenWidth + "rem");
                                }
                            }
                        }
                        if (visibleCloumns <= 3) {
                            this.searchResultTable.setFixedLayout(false);
                        }
                        else {
                            this.searchResultTable.setFixedLayout(true);
                        }
                    }
                }.bind(this));
            }
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        reArrangeDisplaySwitchTapStripButtons: function (items) {
            // items:
            // 0: list (searchResultList)
            // 1: table (searchResultTable)
            // 2: grid (searchResultGrid)
            // 3: map (searchResultMap)
            var config = this.getModel().config;
            if (config.defaultResultViewType === "searchResultList") {
                // nothing to do here
            }
            else if (this.getModel().config.defaultResultViewType === "searchResultTable") {
                // move list from first position just before map
                var listItem = items[0];
                items.splice(3, 0, listItem);
                items.splice(0, 1);
            }
            else if (this.getModel().config.defaultResultViewType === "searchResultGrid") {
                // move list from first position just before map
                var listItem = items[0];
                items.splice(3, 0, listItem);
                items.splice(0, 1);
                // move table from first position just before map
                var tableItem = items[0];
                items.splice(3, 0, tableItem);
                items.splice(0, 1);
            }
            else if (this.getModel().config.defaultResultViewType === "searchResultMap") {
                // move map to first position
                var mapItem = items[3];
                items.splice(0, 0, mapItem);
                items.splice(3, 1);
            }
            return items;
        },
        // create content
        // ===================================================================
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        createSearchFloorplan: function (idPrefix) {
            var that = this;
            that.oFilterBar.bindProperty("visible", {
                // @ts-ignore
                parts: ["/facetVisibility", "/uiFilter/rootCondition"],
                formatter: function (facetVisibility, rootCondition) {
                    var visible = false;
                    if ((!facetVisibility || that.getModel().config.searchFilterBarShowWithFacets) &&
                        rootCondition &&
                        rootCondition.hasFilters()) {
                        visible = true;
                    }
                    that.searchContainer.removeStyleClass("sapElisaSearchPageFloorplanWithMessageToolbarFacetPanelOpen");
                    that.searchContainer.removeStyleClass("sapElisaSearchPageFloorplanWithMessageToolbar");
                    that.searchContainer.removeStyleClass("sapElisaSearchPageFloorplan");
                    that.searchContainer.removeStyleClass("sapElisaSearchPageFloorplanFacetPanelOpen");
                    if (that.getModel().getProperty("/errors/length") > 0) {
                        if (visible) {
                            that.searchContainer.addStyleClass("sapElisaSearchPageFloorplanWithMessageToolbarFacetPanelOpen");
                        }
                        else {
                            that.searchContainer.addStyleClass("sapElisaSearchPageFloorplanWithMessageToolbar");
                        }
                        visible = true;
                    }
                    else {
                        if (visible) {
                            that.searchContainer.addStyleClass("sapElisaSearchPageFloorplanFacetPanelOpen");
                        }
                        else {
                            that.searchContainer.addStyleClass("sapElisaSearchPageFloorplan");
                        }
                    }
                    return visible;
                },
            });
            var footer = that.createFooter(that.getId());
            footer.bindProperty("visible", {
                // @ts-ignore
                parts: ["/errors/length"],
                formatter: function (numberErrors) {
                    var visible = false;
                    that.searchContainer.removeStyleClass("sapElisaSearchPageFloorplanWithMessageToolbarFacetPanelOpen");
                    that.searchContainer.removeStyleClass("sapElisaSearchPageFloorplanWithMessageToolbar");
                    that.searchContainer.removeStyleClass("sapElisaSearchPageFloorplan");
                    that.searchContainer.removeStyleClass("sapElisaSearchPageFloorplanFacetPanelOpen");
                    if (numberErrors > 0) {
                        if (that.getModel().getFacetVisibility()) {
                            that.searchContainer.addStyleClass("sapElisaSearchPageFloorplanWithMessageToolbarFacetPanelOpen");
                        }
                        else {
                            that.searchContainer.addStyleClass("sapElisaSearchPageFloorplanWithMessageToolbar");
                        }
                        visible = true;
                    }
                    else {
                        if (that.getModel().getFacetVisibility()) {
                            that.searchContainer.addStyleClass("sapElisaSearchPageFloorplanFacetPanelOpen");
                        }
                        else {
                            that.searchContainer.addStyleClass("sapElisaSearchPageFloorplan");
                        }
                    }
                    return visible;
                },
            });
            var floorplan = new DivContainer(idPrefix + "-searchPage", {
                content: [
                    // header
                    that.oSearchBar,
                    // filter bar
                    that.oFilterBar,
                    // search container
                    that.createSearchContainer(idPrefix),
                    // footer
                    footer,
                ],
                cssClass: "sapElisaSearchPageFloorplan",
            });
            return floorplan;
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        createSearchContainer: function (idPrefix) {
            var that = this;
            that.model = that.getModel();
            // total count hidden element for ARIA purposes
            that.totalCountHiddenElement = that.assembleCountHiddenElement();
            // center area
            that.centerArea = that.assembleCenterArea(idPrefix);
            // main result list
            that.oSearchResultListContainer = new SearchResultListContainer({
                id: idPrefix + "-searchContainerResultsView",
                centerArea: that.centerArea,
                totalCountBar: that.assembleCountLabel(),
                noResultScreen: new SearchNoResultScreen({
                    searchBoxTerm: {
                        parts: ["/queryFilter/searchTerm"],
                        formatter: function (searchTerms) {
                            return searchTerms;
                        },
                    },
                    visible: {
                        parts: ["/count", "/isBusy", "/firstSearchWasExecuted"],
                        formatter: function (count, isBusy, firstSearchWasExecuted) {
                            return count === 0 && !isBusy && firstSearchWasExecuted;
                        },
                    },
                    toolbar: [
                        new Button({
                            text: i18n.getText("noResultsPageBackButton"),
                            visible: "{/config/displayNoResultsPageBackButton}",
                            press: function () {
                                window.history.back();
                            },
                        }).addStyleClass("sapUiTinyMarginEnd"),
                        new Button({
                            text: i18n.getText("noResultsPageSearchAllButton"),
                            visible: "{/config/displayNoResultsPageSearchAllButton}",
                            press: function () {
                                var model = that.getModel();
                                model.resetTop();
                                model.setSearchBoxTerm("*", false); // asterisk
                                model.resetDataSource(false);
                                model.resetFilterConditions(true); // true => fire query
                            },
                        }),
                    ],
                }),
                totalCountHiddenElement: that.totalCountHiddenElement,
            });
            if (that.getModel().config.layoutUseResponsiveSplitter) {
                // container for normal search result list + facets
                var oSearchLayoutResponsive = new SearchLayoutResponsive(that.getId() + "-searchLayout", {
                    resultListContainer: that.oSearchResultListContainer,
                    busyIndicator: new BusyDialog(),
                    isBusy: "{/isBusy}",
                    busyDelay: "{/busyDelay}",
                    showFacets: {
                        parts: [
                            "/count",
                            "/facetVisibility",
                            "/uiFilter/rootCondition",
                            "/isBusy",
                            "/config",
                        ],
                        formatter: function (count, facetVisibility, filterConditions, isBusy, config) {
                            var facetVisible = true;
                            if (!facetVisibility) {
                                facetVisible = false;
                            }
                            var filterExists = filterConditions &&
                                filterConditions.conditions &&
                                filterConditions.conditions.length > 0;
                            if (count === 0 &&
                                !config.displayFacetPanelInCaseOfNoResults &&
                                !filterExists &&
                                !isBusy) {
                                facetVisible = false;
                            }
                            return facetVisible;
                        },
                    },
                    facetPanelWidthInPercent: that.getModel().config.facetPanelWidthInPercent,
                    facets: new SearchFacetFilter({
                        id: that.getId() + "-SearchFacetFilter",
                    }),
                });
                oSearchLayoutResponsive.addStyleClass("sapUshellSearchLayout");
                that.searchLayout = oSearchLayoutResponsive;
            }
            else {
                var oSearchLayout = new SearchLayout(that.getId() + "-searchLayout", {
                    resultListContainer: that.oSearchResultListContainer,
                    busyIndicator: new BusyDialog(),
                    isBusy: "{/isBusy}",
                    busyDelay: "{/busyDelay}",
                    showFacets: {
                        parts: [
                            "/count",
                            "/facetVisibility",
                            "/uiFilter/rootCondition",
                            "/isBusy",
                            "/config",
                        ],
                        formatter: function (count, facetVisibility, filterConditions, isBusy, config) {
                            if (!facetVisibility) {
                                return false;
                            }
                            var filterExists = filterConditions &&
                                filterConditions.conditions &&
                                filterConditions.conditions.length > 0;
                            if (count === 0 &&
                                !config.displayFacetPanelInCaseOfNoResults &&
                                !filterExists &&
                                !isBusy) {
                                return false;
                            }
                            return true;
                        },
                    },
                    vertical: false,
                    facets: new SearchFacetFilter({
                        id: that.getId() + "-SearchFacetFilter",
                    }),
                });
                oSearchLayout.addStyleClass("sapUshellSearchLayout");
                that.searchLayout = oSearchLayout;
            }
            // top container
            that.searchContainer = new DivContainer({
                content: [that.searchLayout],
                cssClass: "sapUshellSearchContainer",
            });
            return that.searchContainer;
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        createFooter: function (idPrefix) {
            var that = this;
            that.oModel = that.getModel();
            // no footer on phone
            // @ts-ignore
            if (jQuery.device.is.phone) {
                return;
            }
            // create error message popover
            var oErrorPopover = new MessagePopover(idPrefix + "-FooterMessagePopover", {
                placement: VerticalPlacementType.Top, // "Top"
            });
            this.oErrorPopover = oErrorPopover;
            oErrorPopover.setModel(that.oModel);
            that.oModel.setProperty("/messagePopoverControlId", oErrorPopover.getId());
            oErrorPopover.bindAggregation("items", {
                path: "/errors",
                factory: function () {
                    var item = new MessageItem("", {
                        title: "{title}",
                        description: "{description}",
                    });
                    return item;
                },
            });
            // create error message popover button
            var oErrorButton = new Button(this.getId() + "-searchErrorButton", {
                icon: IconPool.getIconURI("alert"),
                // @ts-ignore
                text: {
                    parts: ["/errors/length"],
                    formatter: function (length) {
                        return length;
                    },
                },
                // @ts-ignore
                visible: {
                    parts: ["/errors/length"],
                    formatter: function (length) {
                        return length > 0;
                    },
                    mode: BindingMode.OneWay,
                },
                type: ButtonType.Emphasized,
                // @ts-ignore
                tooltip: i18n.getText("errorBtn"),
                press: function () {
                    if (oErrorPopover.isOpen()) {
                        oErrorPopover.close();
                    }
                    else {
                        oErrorPopover.setVisible(true);
                        oErrorPopover.openBy(oErrorButton);
                    }
                },
            });
            // @ts-ignore
            oErrorButton.addDelegate({
                onAfterRendering: function () {
                    if (!that.oModel.getProperty("/isErrorPopovered")) {
                        oErrorButton.firePress();
                        that.oModel.setProperty("/isErrorPopovered", true);
                    }
                },
            });
            oErrorButton.setLayoutData(new OverflowToolbarLayoutData("", {
                priority: OverflowToolbarPriority.NeverOverflow,
            }));
            var content = [oErrorButton];
            // create footer bar
            var footer = new OverflowToolbar("", {
                content: content,
            });
            return footer;
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        chooseNoResultScreen: function () {
            // update "no result screen"
            var noResultScreen;
            if (typeof this.getModel().config.getCustomNoResultScreen === "function") {
                noResultScreen = this.getModel().config.getCustomNoResultScreen(this.getModel().getDataSource(), this.getModel());
            }
            if (!noResultScreen) {
                noResultScreen = this.oSearchResultListContainer.getAggregation("noResultScreen");
            }
            this.oSearchResultListContainer.setNoResultScreen(noResultScreen);
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        reorgTabBarSequence: function () {
            if (!this.tabBar) {
                return;
            }
            var highLayout = new OverflowToolbarLayoutData("", {
                priority: OverflowToolbarPriority.High,
            });
            var neverOverflowLayout = new OverflowToolbarLayoutData("", {
                priority: OverflowToolbarPriority.NeverOverflow,
            });
            var aButtons = this.tabBar.getContent();
            for (var i = 0; i < aButtons.length; i++) {
                if (this.getModel().getProperty("/tabStrips/selected") ===
                    aButtons[i].getBindingContext().getObject()) {
                    aButtons[i].setLayoutData(neverOverflowLayout);
                }
                else {
                    aButtons[i].setLayoutData(highLayout);
                }
            }
        },
        onRegionClick: function () {
            // alert("onRegionClick " + e.getParameter("code"));
        },
        onRegionContextMenu: function () {
            // alert("onRegionContextMenu: " + e.getParameter("code"));
        },
        /**
         * @this sap.esh.search.ui.SearchCompositeControl
         */
        setAppView: function (oAppView) {
            var that = this;
            that.oAppView = oAppView;
            if (that.oTilesContainer) {
                that.oTilesContainer.setAppView(oAppView);
            }
        },
        getControllerName: function () {
            return "sap.esh.search.ui.container.Search";
        },
    });
});
