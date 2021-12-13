/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
// @ts-check-disable
sap.ui.define([
    "../i18n",
    "./SearchResultSetFormatter",
    "./SuggestionResultSetFormatter",
    "./MetadataFormatter",
    "./SearchResultTableExtend",
    "../uri/CharMapper",
    "../sinaNexTS/sina/LogicalOperator",
    "../sinaNexTS/sina/ComparisonOperator",
    "../sinaNexTS/sina/ComplexCondition",
    "../sinaNexTS/sina/SimpleCondition",
    "sap/m/VBox",
    "sap/m/FlexJustifyContent",
    "sap/m/Label",
    "sap/m/Button",
    "sap/m/ListMode",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "sap/m/TableSelectDialog",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/TextDirection",
    "sap/f/IllustratedMessage",
    "sap/f/IllustratedMessageType",
    "sap/f/IllustratedMessageSize",
], 
/**
 *
 * @param {*} i18n
 * @param {*} SearchResultSetFormatter
 * @param {*} SuggestionResultSetFormatter
 * @param {*} MetadataFormatter
 * @param {*} SearchResultTableExtend
 * @param {CharMapper} CharMapper
 * @param {LogicalOperator} LogicalOperator
 * @param {ComparisonOperator} ComparisonOperator
 * @param {ComplexCondition} ComplexCondition
 * @param {SimpleCondition} SimpleCondition
 */
function (i18n, SearchResultSetFormatter, SuggestionResultSetFormatter, MetadataFormatter, SearchResultTableExtend, CharMapper, LogicalOperator, ComparisonOperator, ComplexCondition, SimpleCondition, VBox, FlexJustifyContent, Label, // sap.m
Button, ListMode, Column, ColumnListItem, TableSelectDialog, MessageBox, Filter, // sap.ui
FilterOperator, JSONModel, TextDirection, IllustratedMessage, // sap.f
IllustratedMessageType, IllustratedMessageSize) {
    "use strict";
    /**
     * @type {CharMapper}
     */
    var cm = new CharMapper(["#", "%"]);
    //console.log(core);
    var quickSelectDataSources = [];
    var querySuffix = new ComplexCondition.ComplexCondition({
        operator: LogicalOperator.LogicalOperator.Or,
    });
    var simpleCondition1 = new SimpleCondition.SimpleCondition({
        operator: ComparisonOperator.ComparisonOperator.Eq,
        attribute: "technical_type",
        value: "DWC_REMOTE_TABLE",
    });
    querySuffix.addCondition(simpleCondition1);
    var simpleCondition2 = new SimpleCondition.SimpleCondition({
        operator: ComparisonOperator.Eq,
        attribute: "technical_type",
        value: "DWC_LOCAL_TABLE",
    });
    querySuffix.addCondition(simpleCondition2);
    var simpleCondition3 = new SimpleCondition.SimpleCondition({
        operator: ComparisonOperator.Eq,
        attribute: "technical_type",
        value: "DWC_VIEW",
    });
    querySuffix.addCondition(simpleCondition3);
    var simpleCondition4 = new SimpleCondition.SimpleCondition({
        operator: ComparisonOperator.Eq,
        attribute: "technical_type",
        value: "DWC_ERMODEL",
    });
    querySuffix.addCondition(simpleCondition4);
    var simpleCondition5 = new SimpleCondition.SimpleCondition({
        operator: ComparisonOperator.Eq,
        attribute: "technical_type",
        value: "DWC_DATAFLOW",
    });
    querySuffix.addCondition(simpleCondition5);
    var simpleCondition6 = new SimpleCondition.SimpleCondition({
        operator: ComparisonOperator.Eq,
        attribute: "technical_type",
        value: "DWC_IDT",
    });
    querySuffix.addCondition(simpleCondition6);
    var simpleCondition7 = new SimpleCondition.SimpleCondition({
        operator: ComparisonOperator.Eq,
        attribute: "kind",
        value: "sap.dis.dataflow",
    });
    querySuffix.addCondition(simpleCondition7);
    var simpleCondition8 = new SimpleCondition.SimpleCondition({
        operator: ComparisonOperator.Eq,
        attribute: "kind",
        value: "sap.dwc.dac",
    });
    querySuffix.addCondition(simpleCondition8);
    // "(" +
    // "technical_type:EQ:DWC_REMOTE_TABLE OR " +
    // "technical_type:EQ:DWC_LOCAL_TABLE OR " +
    // "technical_type:EQ:DWC_VIEW OR " +
    // "technical_type:EQ:DWC_ERMODEL OR " +
    // "technical_type:EQ:DWC_DATAFLOW OR " +
    // "technical_type:EQ:DWC_IDT OR " +
    // 'kind:EQ:"sap.dis.dataflow" OR ' +
    // "kind:EQ:sap.dwc.dac" +
    // ")";
    /**
     * @type {sap.esh.search.ui.SearchConfiguration}
     */
    var configuration = {
        searchOnStart: false,
        defaultDataSource: "SEARCH_DESIGN",
        quickSelectDataSources: quickSelectDataSources,
        displayNoResultsPageBackButton: false,
        displayNoResultsPageSearchAllButton: false,
        displayFacetPanelInCaseOfNoResults: true,
        facetVisibility: true,
        browserTitleOverwritten: false,
        assembleFilteredDataSources: function (sina) {
            var dataSource;
            var userId = "";
            if (configuration.dwcUser && configuration.dwcUser.name) {
                userId = configuration.dwcUser.name;
            }
            // faked all for SEARCH_DESIGN
            dataSource = sina.getDataSource("SEARCH_DESIGN");
            dataSource.label = i18n.getText("label_all");
            dataSource.icon = "sap-icon://world";
            quickSelectDataSources.push(dataSource);
            // recent
            var recentDateBegin = new Date();
            recentDateBegin.setMonth(recentDateBegin.getMonth() - 1);
            dataSource = sina.createDataSource({
                id: "recent",
                label: i18n.getText("collectionRecentObjects"),
                icon: "sap-icon://history",
                type: sina.DataSourceType.BusinessObject,
                subType: sina.DataSourceSubType.Filtered,
                dataSource: sina.dataSourceMap["SEARCH_DESIGN"],
                filterCondition: sina.createComplexCondition({
                    operator: sina.LogicalOperator.And,
                    conditions: [
                        sina.createSimpleCondition({
                            attribute: "last_accessed",
                            operator: sina.ComparisonOperator.Gt,
                            value: recentDateBegin,
                        }),
                        sina.createSimpleCondition({
                            attribute: "last_accessed",
                            operator: sina.ComparisonOperator.Lt,
                            value: "$$now$$",
                        }),
                    ],
                }),
            });
            // quickSelectDataSources.push(dataSource); -> remove 'recent' collection until SINA supports attribute sorting (DW13-1394)
            // my assets
            dataSource = sina.createDataSource({
                id: "myobjects",
                label: i18n.getText("collectionMyObjects"),
                icon: "sap-icon://switch-classes",
                type: sina.DataSourceType.BusinessObject,
                subType: sina.DataSourceSubType.Filtered,
                dataSource: sina.dataSourceMap["SEARCH_DESIGN"],
                filterCondition: sina.createSimpleCondition({
                    attribute: "creator",
                    operator: sina.ComparisonOperator.Eq,
                    value: userId,
                }),
            });
            quickSelectDataSources.push(dataSource);
            // shared
            dataSource = sina.createDataSource({
                id: "shared",
                label: i18n.getText("collectionShared"),
                icon: "sap-icon://share-2",
                type: sina.DataSourceType.BusinessObject,
                subType: sina.DataSourceSubType.Filtered,
                dataSource: sina.dataSourceMap["SEARCH_DESIGN"],
                filterCondition: sina.createSimpleCondition({
                    attribute: "shared_with_space_name",
                    operator: sina.ComparisonOperator.Ne,
                    value: "NULL",
                }),
            });
            quickSelectDataSources.push(dataSource);
            // favorites
            dataSource = sina.createDataSource({
                id: "favorites",
                label: i18n.getText("collectionFavorites"),
                icon: "sap-icon://favorite",
                type: sina.DataSourceType.BusinessObject,
                subType: sina.DataSourceSubType.Filtered,
                dataSource: sina.dataSourceMap["SEARCH_DESIGN"],
                filterCondition: sina.createSimpleCondition({
                    attribute: "favorites_user_id",
                    operator: sina.ComparisonOperator.Eq,
                    value: userId,
                }),
            });
            quickSelectDataSources.push(dataSource);
        },
        getCustomNoResultScreen: function (dataSource, model) {
            if (typeof dataSource === "undefined") {
                return;
            }
            else {
                var searchTermIsAll = model.getSearchBoxTerm().trim() === "" || model.getSearchBoxTerm().trim() === "*";
                var additionalContent = [];
                var illustrationSize = IllustratedMessageSize.Scene;
                var title = i18n.getText("emptyStateAfterSearchTitle");
                var description = i18n.getText("emptyStateAfterSearchDescription");
                var illustrationType = IllustratedMessageType.NoSearchResults;
                if (searchTermIsAll) {
                    if (dataSource.id === "favorites") {
                        // no favorites
                        title = i18n.getText("emptyStateNoFavoritesTitle");
                        description = i18n.getText("emptyStateNoFavoritesDescription");
                        illustrationType = IllustratedMessageType.NoSavedItems;
                    }
                    else if (dataSource.id === "shared") {
                        // no shared objects
                        title = i18n.getText("emptyStateNoObjectsTitle");
                        description = i18n.getText("emptyStateNoObjectsDescription");
                        illustrationType = IllustratedMessageType.NoData;
                    }
                    else if (typeof this.getFirstSpaceCondition() !== "undefined") {
                        // empty space
                        title = i18n.getText("emptyStateNoObjectsTitle");
                        description = i18n.getText("emptyStateNoObjectsDescription");
                        illustrationType = IllustratedMessageType.NoData;
                    }
                }
                else {
                    // use default values of title, description, illustrationSize, illustrationType
                    additionalContent.push(new Button("", {
                        text: i18n.getText("backToLastResults"),
                        press: function () {
                            window.history.back();
                        },
                    }));
                    additionalContent.push(new Button("", {
                        text: i18n.getText("showAllObjects"),
                        press: function () {
                            model.setSearchBoxTerm("", true);
                        },
                    }).addStyleClass("sapUiTinyMarginBegin"));
                }
                var oIllustratedMessage = new IllustratedMessage("", {
                    title: title,
                    description: description,
                    illustrationSize: illustrationSize,
                    illustrationType: illustrationType,
                    additionalContent: additionalContent,
                }).addStyleClass("sapElisaEmptyStatePage-no-result");
                return new VBox("", {
                    items: oIllustratedMessage,
                    width: "100%",
                    justifyContent: FlexJustifyContent.Center,
                    visible: {
                        parts: ["/count", "/isBusy", "/firstSearchWasExecuted"],
                        formatter: function (count, isBusy, firstSearchWasExecuted) {
                            return count === 0 && !isBusy && firstSearchWasExecuted;
                        },
                    },
                });
            }
        },
        hideListView: true,
        gridView: true,
        enableMultiSelectionResultItems: true,
        pageSize: 30,
        layoutUseResponsiveSplitter: true,
        facetPanelWidthInPercent: 18,
        FF_facetPanelUnifiedHeaderStyling: true,
        searchFilterBarShowWithFacets: true,
        searchBarDoNotHideForNoResults: true,
        FF_layoutWithoutPage: true,
        defaultResultViewType: "searchResultTable",
        updateUrl: true,
        beforeNavigation: function (model) {
            model.invalidateQuery();
        },
        parseSearchUrlParameters: function (oUrlParameters) {
            if (oUrlParameters && oUrlParameters.filter) {
                oUrlParameters.filter = cm.unmap(oUrlParameters.filter);
            }
            return oUrlParameters;
        },
        renderSearchUrl: function (properties) {
            return ("#/repositoryexplorer&/rex/search?top=" + properties.top + "&filter=" + properties.filter);
        },
        isSearchUrl: function (url) {
            return url.indexOf("#/repositoryexplorer") === 0;
        },
        titleColumnName: "businessName",
        titleColumnWidth: "16rem",
        extendTableColumn: SearchResultTableExtend.extendTableColumn,
        boSuggestions: true,
        searchInAttibuteFacetPostion: {
            space_description: 1,
        },
        cleanUpSpaceFilters: function (model, filterCondition) {
            var uiFilter = model.getProperty("/uiFilter");
            // Remove other filter conditions of collections and space itself by clicking a space attribute value
            if (filterCondition) {
                if (filterCondition.attribute === "space_description") {
                    uiFilter.rootCondition.removeAttributeConditions("space_description");
                    // Reset Collection to All
                    uiFilter.dataSource = this.quickSelectDataSources[0];
                    model.setProperty("/searchTermPlaceholder", model.calculatePlaceholder());
                    // setDataSource() can't be reused because Repository Explorer doesn't need uiFilter.resetConditions()
                    // model.setDataSource(quickSelectDataSources[0], false);
                }
            }
            else {
                // If a collection datasource is clicked
                uiFilter.rootCondition.removeAttributeConditions("space_description");
            }
        },
        hasSpaceFiltersOnly: function (oCondition) {
            var spaceConditions = oCondition.getAttributeConditions("space_description");
            if (spaceConditions.length > 0) {
                var oConditionCopy = oCondition.clone();
                oConditionCopy.removeAttributeConditions("space_description");
                if (!oConditionCopy.hasFilters()) {
                    return true;
                }
            }
            return false;
        },
        getFirstSpaceCondition: function (filter) {
            if (typeof filter === "undefined") {
                return undefined;
            }
            else {
                if (filter.rootCondition && filter.rootCondition.hasFilters()) {
                    for (var _i = 0, _a = filter.rootCondition.conditions; _i < _a.length; _i++) {
                        var outerCondition = _a[_i];
                        var spaceConditions = outerCondition.getAttributeConditions("space_description");
                        for (var _b = 0, spaceConditions_1 = spaceConditions; _b < spaceConditions_1.length; _b++) {
                            var spaceCondition = spaceConditions_1[_b];
                            return spaceCondition; // attributeLabel is "Space"
                        }
                    }
                }
            }
            return undefined;
        },
        setSearchInLabelIconBindings: function (model) {
            var uiFilter = model.getProperty("/uiFilter");
            // Space Condition shall be checked at first because of the All quickSelectDataSource
            var spaceConditions = uiFilter.rootCondition.getAttributeConditions("space_description");
            var attributeLabel = "";
            var attributeIcon = "";
            if (spaceConditions.length > 0) {
                attributeLabel = spaceConditions[0].valueLabel || "";
                attributeIcon = "sap-icon://sac/data-space-management";
            }
            else {
                // If there is no space condition, check quickSelectDataSources
                var foundQuickSelectDataSources = quickSelectDataSources.find(function (dataSource) {
                    return dataSource.id === uiFilter.dataSource.id;
                });
                if (foundQuickSelectDataSources) {
                    attributeLabel = foundQuickSelectDataSources.label;
                    attributeIcon = foundQuickSelectDataSources.icon;
                }
            }
            model.setProperty("/searchInLabel", attributeLabel);
            model.setProperty("/searchInIcon", attributeIcon);
        },
        getSearchInFacetListMode: function (currentItemData) {
            if (currentItemData.dimension === "space_description") {
                return ListMode.SingleSelectMaster;
            }
        },
        checkAndSetSpaceIcon: function (originalIcon, dimension) {
            if (dimension === "space_description") {
                return "sap-icon://sac/data-space-management";
            }
            return originalIcon;
        },
        bNoAppSearch: true,
        bResetSearchTermOnQuickSelectDataSourceItemPress: true,
        FF_bSearchtermNoAsterisk: true,
        bPlaceHolderFixedValue: false,
        FF_bOptimizedQuickSelectDataSourceLabels: true,
        getPlaceholderLabelForDatasourceAll: function () {
            // there is only one data source at DWC
            // we want to have "Search in: All" as placeholder BUT "Objects" (plural label) as group header (suggestion popup)
            return i18n.getText("label_all");
        },
        setQuickSelectDataSourceAllAppearsNotSelected: function (attributeFacet, model) {
            var spaceFacet = attributeFacet.getDomRef().closest(".sapUshellSearchFacetSearchInAttribute");
            if (!spaceFacet || !attributeFacet.getSelectedItem()) {
                return;
            }
            var currentDataSource = model.getDataSource();
            if (currentDataSource && currentDataSource.id === "SEARCH_DESIGN") {
                var searchFacetQuickSelectSource = "sapUshellSearchFacetQuickSelectDataSource";
                searchFacetQuickSelectSource = this.id
                    ? this.id + "-" + searchFacetQuickSelectSource
                    : searchFacetQuickSelectSource;
                var quickDataSourceFacet = sap.ui.getCore().byId(searchFacetQuickSelectSource);
                quickDataSourceFacet.getSelectedItem().getDomRef().classList.remove("sapMLIBSelected");
            }
        },
        showSpaceFacetInShowMoreDialog: function (dimension) {
            if (dimension === "space_description") {
                return false;
            }
            return true;
        },
        getSpaceFacetId: function (dimension, sId) {
            if (dimension === "space_description") {
                return "sapUshellSearchFacetSearchInAttributeSpace";
            }
            return sId;
        },
        openSpaceShowMoreDialog: function (dimension, oSearchModel) {
            // Don't use uiFilter property of searchModel, it could contain the current but still not fired search term in search box
            var uiFilter = oSearchModel.query.filter.clone();
            // Remove other filter conditions of collections and space itself
            uiFilter.rootCondition.removeAttributeConditions("space_description");
            var chartQuery = oSearchModel.sinaNext.createChartQuery({
                filter: uiFilter,
                dimension: dimension,
                top: 1000,
            });
            return chartQuery.getResultSetAsync().then(function (resultSet) {
                var oFacet = oSearchModel.oFacetFormatter.getDialogFacetsFromChartQuery(resultSet, oSearchModel, true, dimension);
                for (var i = 0; i < oFacet.items.length; i++) {
                    var item = oFacet.items[i];
                    // avoid JSON circle problem
                    delete item.filterCondition.sina;
                }
                var fnCreateDialogColumns = function () {
                    return [
                        new Column({
                            hAlign: "Begin",
                            width: "60%",
                            popinDisplay: "Inline",
                            minScreenWidth: "Tablet",
                            demandPopin: true,
                        }),
                        new Column({
                            hAlign: "End",
                            width: "30%",
                            popinDisplay: "Inline",
                            minScreenWidth: "Tablet",
                            demandPopin: true,
                        }),
                    ];
                };
                // filter function for search and livechange
                var fnDoSearch = function (oEvent) {
                    var aFilters = [], sSearchValue = oEvent.getParameter("value"), itemsBinding = oEvent.getParameter("itemsBinding");
                    // create the local filter to apply
                    if (sSearchValue !== undefined && sSearchValue.length > 0) {
                        aFilters.push(new Filter("label", FilterOperator.Contains, sSearchValue));
                    }
                    itemsBinding.filter(aFilters, "Application");
                };
                var oDialog = new TableSelectDialog("", {
                    title: i18n.getText("selectspace"),
                    contentWidth: "30rem",
                    columns: [fnCreateDialogColumns()],
                    search: fnDoSearch,
                    liveChange: fnDoSearch,
                });
                var oModelList = new JSONModel();
                oModelList.setDefaultBindingMode("OneWay");
                oModelList.setData(oFacet);
                oDialog.setModel(oModelList);
                var oItemTemplate = new ColumnListItem({
                    type: "Active",
                    unread: false,
                    cells: [
                        new Label({
                            text: "{label}",
                        }),
                        new Label({
                            text: "{value}",
                        }),
                    ],
                });
                oDialog.attachConfirm(function (evt) {
                    var selectedContexts = evt.getParameter("selectedContexts");
                    if (selectedContexts && selectedContexts.length && selectedContexts.length > 0) {
                        var selectedFacetItem = selectedContexts[0].getObject();
                        oSearchModel.addFilterCondition(selectedFacetItem.filterCondition, false);
                        oSearchModel.filterChanged = true;
                        oSearchModel._firePerspectiveQuery();
                    }
                });
                oDialog.bindAggregation("items", "/items", oItemTemplate);
                // DWC spaces sorted alphabetically, ascending
                if (dimension === "space_description") {
                    oDialog
                        .getBinding("items")
                        .sort([new sap.ui.model.Sorter({ path: "label", descending: false })]);
                }
                oDialog.open();
            }, function (error) {
                var errorTitle = i18n.getText("searchError");
                var errorText = error.message;
                MessageBox.error(errorText, {
                    icon: MessageBox.Icon.NONE,
                    title: errorTitle,
                    actions: MessageBox.Action.OK,
                    onClose: null,
                    styleClass: "",
                    initialFocus: null,
                    textDirection: TextDirection.Inherit,
                });
            });
        },
        initAsync: function () { },
    };
    configuration.sinaConfiguration = {
        // @ts-ignore
        provider: "hana_odata",
        url: "/dwaas-core/repository/search",
        metaDataSuffix: "SEARCH_DESIGN",
        // querySuffix: ' (business_type:OR(DWC_DATASET DWC_DIMENSION DWC_FACT DWC_ESMODEL))',
        querySuffix: querySuffix,
        odataVersion: "",
        searchResultSetFormatters: [new SearchResultSetFormatter()],
        suggestionResultSetFormatters: [new SuggestionResultSetFormatter()],
        metadataFormatters: [new MetadataFormatter(configuration)],
        initAsync: function (sina) {
            configuration.assembleFilteredDataSources(sina);
        },
    };
    return configuration;
});
