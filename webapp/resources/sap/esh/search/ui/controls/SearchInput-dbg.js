/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
/* global $ */
// @ts-check
// TODO: -> replace sap.m.Input by sap.m.SearchField
// refactoring object -> business object
// suggestion class/type in model layer
// remove imageExist model layer
sap.ui.define([
    "../i18n",
    "sap/m/Input",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/ListType",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "sap/m/CustomListItem",
    "sap/m/FlexItemData",
    "sap/m/BusyIndicator",
    "sap/m/FlexBox",
    "sap/ui/core/Icon",
    "sap/ui/layout/HorizontalLayout",
    "sap/ui/layout/VerticalLayout",
    "sap/ui/model/BindingMode",
    "../SearchHelper",
    "../suggestions/SuggestionType",
    "../controls/SearchObjectSuggestionImage",
], 
/**
 * @param {*} i18n
 * @param {sap.m.Input} Input
 * @param {sap.m.Label} Label
 * @param {sap.m.Text} Text
 * @param {sap.m.ListType} ListType
 * @param {sap.m.Column} Column
 * @param {sap.m.ColumnListItem} ColumnListItem
 * @param {sap.m.CustomListItem} CustomListItem
 * @param {sap.m.FlexItemData} FlexItemData
 * @param {sap.m.BusyIndicator} BusyIndicator
 * @param {sap.m.FlexBox} FlexBox,
 * @param {sap.ui.core.Icon} Icon
 * @param {sap.ui.layout.HorizontalLayout} HorizontalLayout
 * @param {sap.ui.layout.VerticalLayout} VerticalLayout
 */
function (i18n, Input, Label, Text, ListType, Column, ColumnListItem, CustomListItem, FlexItemData, BusyIndicator, FlexBox, Icon, HorizontalLayout, VerticalLayout, BindingMode, SearchHelper, SuggestionType, SearchObjectSuggestionImage) {
    "use strict";
    return sap.m.Input.extend("sap.esh.search.ui.controls.SearchInput", {
        /**
         * @this sap.esh.search.ui.controls.SearchInput
         */
        constructor: function (sId, oOptions) {
            var that = this;
            oOptions = Object.assign({
                width: "100%",
                showValueStateMessage: false,
                showTableSuggestionValueHelp: false,
                enableSuggestionsHighlighting: false,
                showSuggestion: true,
                filterSuggests: false,
                // @ts-ignore
                suggestionColumns: [new Column()],
                autocomplete: false,
                tooltip: i18n.getText("search"),
                placeholder: {
                    path: "/searchTermPlaceholder",
                    mode: BindingMode.OneWay,
                },
                liveChange: this.handleLiveChange.bind(this),
                suggestionItemSelected: this.handleSuggestionItemSelected.bind(this),
                enabled: {
                    parts: [
                        {
                            path: "/initializingObjSearch",
                        },
                    ],
                    formatter: function (initializingObjSearch) {
                        return !initializingObjSearch;
                    },
                },
            }, oOptions);
            // ugly hack disable fullscreen input on phone - start
            // see also method isMobileDevice
            var phone = sap.ui.Device.system.phone;
            // @ts-ignore
            sap.ui.Device.system.phone = false;
            // @ts-ignore
            Input.prototype.constructor.apply(this, [sId, oOptions]);
            // @ts-ignore
            sap.ui.Device.system.phone = phone;
            // ugly hack - end
            this.bindAggregation("suggestionRows", {
                path: "/suggestions",
                factory: function (sId, oContext) {
                    return that.suggestionItemFactory(sId, oContext);
                },
            });
            this.addStyleClass("searchInput");
            //disable fullscreen input on phone
            this._bUseDialog = false;
            this._bFullScreen = false;
            this._ariaDescriptionIdNoResults = sId + "-No-Results-Description";
            this.listNavigationMode = false;
            this.listNavigationModeCache = {};
        },
        isMobileDevice: function () {
            // ugly hack disable fullscreen input on phone - start
            return false;
            // ugly hack disable fullscreen input on phone - end
        },
        renderer: "sap.m.InputRenderer",
        /*onkeydown: function (event) {
        if (event.ctrlKey && event.keyCode === 13) {
            var model = this.getModel();
            this.destroySuggestionRows();
            model.abortSuggestions();
            model.autoSelectAppSuggestion().then(function (suggestion) {
                if (!suggestion) {
                    return;
                }
                var event = new Event('AutoSelectAppSuggestion', this, { suggestion: suggestion });
                this.handleSuggestionItemSelected(event);
            }.bind(this));
        }
        },*/
        /**
         * @this sap.esh.search.ui.controls.SearchInput
         */
        // eslint-disable-next-line no-unused-vars
        onsapenter: function (event) {
            if (!(this._oSuggestionPopup &&
                this._oSuggestionPopup.isOpen() &&
                this._oSuggPopover.getFocusedListItem())) {
                // if (!(this._oSuggestionPopup && this._oSuggestionPopup.isOpen() && this._oSuggPopover._iPopupListSelectedIndex >= 0)) {
                // check that enter happened in search input box and not on a suggestion item
                // enter on a suggestion is not handled in onsapenter but in handleSuggestionItemSelected
                this.getModel().invalidateQuery();
                this.triggerSearch();
            }
            sap.m.Input.prototype.onsapenter.apply(this, arguments);
        },
        /**
         * @this sap.esh.search.ui.controls.SearchInput
         */
        triggerSearch: function () {
            // The footer is rerendered after each search in stand alone UI -> error popover losts parent and jumps to the screen top.
            // solution: if the error popover shows, set footer invisible before next search.
            // popover.close() is not working. It is closed after footer invisible, so it still jumps
            var that = this;
            var msgPopupId = that.getModel().getProperty("/messagePopoverControlId");
            var messagePopup = /** @type {sap.m.MessagePopover} */ (sap.ui.getCore().byId(msgPopupId));
            if (that.getModel().getProperty("/errors").length > 0 &&
                messagePopup &&
                messagePopup.isOpen()) {
                messagePopup.close();
                messagePopup.setVisible(false); // TODO: not sure if we still need this after removing sap.m.page
            }
            // it is necessay to do this in search input (and not in search model) because otherwise navigating back from the app to the
            // search UI would result in a repeated navigation to the app
            SearchHelper.subscribeOnlyOnce("triggerSearch", "ESHSearchFinished", function () {
                that.getModel().autoStartApp();
            }, that);
            /**
             * @type {string}
             */
            var searchBoxTerm = this.getValue();
            if (searchBoxTerm.trim() === "" && !this.getModel().config.FF_bSearchtermNoAsterisk) {
                searchBoxTerm = "*"; // asterisk
            }
            this.getModel().setSearchBoxTerm(searchBoxTerm, false);
            this.navigateToSearchApp();
            this.destroySuggestionRows();
            this.getModel().abortSuggestions();
        },
        /**
         * @this sap.esh.search.ui.controls.SearchInput
         */
        handleLiveChange: function () {
            // ugly modifiaction: headers and busy indicator in suggestions shall not be selectable
            if (this._oSuggPopover &&
                this._oSuggPopover.handleListNavigation &&
                !this._oSuggPopover.handleListNavigation.decorated) {
                var handleListNavigation = this._oSuggPopover.handleListNavigation;
                this._oSuggPopover.handleListNavigation = function () {
                    this.listNavigationMode = true;
                    this.listNavigationModeCache = {};
                    // @ts-ignore
                    var value = handleListNavigation.apply(this._oSuggPopover, arguments);
                    // -handleListNavigation calls getVisible on the suggestion items in order to determine to which suggestion items we can navigate
                    // -for suggestion items of type 'header' or 'busy indicator' (to which no navigation shall take place) the getVisible function is overwritten
                    // -the overwritten getVisible function returns false only for listNavigationMode=true
                    // ==> this way suggestion items of type 'header' or 'busy indicator' are visible but we cannot navigate to them
                    this.listNavigationMode = false;
                    return value;
                }.bind(this);
                this._oSuggPopover.handleListNavigation.decorated = true;
            }
            var suggestTerm = this.getValue();
            var oModel = this.getModel();
            oModel.setSearchBoxTerm(suggestTerm, false);
            if (oModel.getSearchBoxTerm().length > 0) {
                oModel.doSuggestion();
            }
            else {
                this.destroySuggestionRows();
                oModel.abortSuggestions();
            }
        },
        /**
         * @this sap.esh.search.ui.controls.SearchInput
         */
        handleSuggestionItemSelected: function (oEvent) {
            var oModel = this.getModel();
            var searchBoxTerm = oModel.getSearchBoxTerm();
            var suggestion;
            if (oEvent.getId() === "AutoSelectAppSuggestion") {
                suggestion = oEvent.getParameter("suggestion");
            }
            else {
                suggestion = oEvent.getParameter("selectedRow").getBindingContext().getObject();
            }
            var suggestionTerm = suggestion.searchTerm || "";
            var dataSource = suggestion.dataSource || oModel.getDataSource();
            var targetURL = suggestion.url;
            var type = suggestion.uiSuggestionType;
            oModel.eventLogger.logEvent({
                type: oModel.eventLogger.SUGGESTION_SELECT,
                suggestionType: type,
                suggestionTerm: suggestionTerm,
                searchTerm: searchBoxTerm,
                targetUrl: targetURL,
                dataSourceKey: dataSource ? dataSource.id : "",
            });
            // remove any selection
            this.selectText(0, 0);
            switch (type) {
                case SuggestionType.App:
                    // app suggestions -> start app
                    // starting the app by hash change closes the suggestion popup
                    // closing the suggestion popup again triggers the suggestion item selected event
                    // in order to avoid to receive the event twice the suggestions are destroyed
                    this.destroySuggestionRows();
                    oModel.abortSuggestions();
                    if (targetURL[0] === "#") {
                        if (targetURL.indexOf("#Action-search") === 0 &&
                            targetURL === decodeURIComponent(SearchHelper.getHashFromUrl())) {
                            // ugly workaround
                            // in case the app suggestion points to the search app with query identical to current query
                            // --> do noting except: restore query term + focus again the first item in the result list
                            oModel.setSearchBoxTerm(oModel.getLastSearchTerm(), false);
                            oModel._notifySubscribers("ESHSearchFinished");
                            sap.ui.getCore().getEventBus().publish("ESHSearchFinished");
                            return;
                        }
                        // @ts-ignore
                        if (window.hasher) {
                            // @ts-ignore
                            window.hasher.setHash(targetURL);
                        }
                        else {
                            window.location.href = targetURL;
                        }
                    }
                    else {
                        // special logging: only for urls started via suggestions
                        // (apps/urls started via click ontile have logger in tile click handler)
                        this.logRecentActivity(suggestion);
                        window.open(targetURL, "_blank", "noopener,noreferrer");
                        oModel.setSearchBoxTerm("", false);
                        this.setValue("");
                    }
                    // close the search field if suggestion is not search app
                    if (targetURL.indexOf("#Action-search") !== 0) {
                        sap.ui.require("sap/esh/search/ui/SearchShellHelper").setSearchStateSync("COL");
                    }
                    else {
                        this.focus();
                    }
                    break;
                case SuggestionType.DataSource:
                    // data source suggestions
                    // -> change datasource in dropdown
                    // -> do not start search
                    oModel.setDataSource(dataSource, false);
                    oModel.setSearchBoxTerm("", false);
                    this.setValue("");
                    this.focus();
                    break;
                case SuggestionType.SearchTermData:
                    // object data suggestion
                    // -> change search term + change datasource + start search
                    oModel.setDataSource(dataSource, false);
                    oModel.setSearchBoxTerm(suggestionTerm, false);
                    this.getModel().invalidateQuery();
                    this.navigateToSearchApp();
                    this.setValue(suggestionTerm);
                    break;
                case SuggestionType.SearchTermHistory:
                    // history
                    // -> change search term + change datasource + start search
                    oModel.setDataSource(dataSource, false);
                    oModel.setSearchBoxTerm(suggestionTerm, false);
                    this.getModel().invalidateQuery();
                    this.navigateToSearchApp();
                    this.setValue(suggestionTerm);
                    break;
                case SuggestionType.Object:
                    if (suggestion.titleNavigation) {
                        suggestion.titleNavigation.performNavigation();
                    }
                    break;
                default:
                    break;
            }
        },
        logRecentActivity: function (suggestion) {
            // load ushell deps lazy only in case of FLP
            sap.ui.require(["sap/ushell/Config", "sap/ushell/services/AppType"], function (Config, AppType) {
                var bLogRecentActivity = Config.last("/core/shell/enableRecentActivity") &&
                    Config.last("/core/shell/enableRecentActivityLogging");
                if (bLogRecentActivity) {
                    var oRecentEntry = {
                        title: suggestion.title,
                        appType: AppType.URL,
                        url: suggestion.url,
                        appId: suggestion.url,
                    };
                    // @ts-ignore
                    sap.ushell.Container.getRenderer("fiori2").logRecentActivity(oRecentEntry);
                }
            });
        },
        /**
         * @this sap.esh.search.ui.controls.SearchInput
         */
        suggestionItemFactory: function (sId, oContext) {
            var suggestion = oContext.getObject();
            switch (suggestion.uiSuggestionType) {
                case SuggestionType.Object:
                    return this.objectSuggestionItemFactory(sId, oContext);
                case SuggestionType.Header:
                    return this.headerSuggestionItemFactory(sId, oContext);
                case SuggestionType.BusyIndicator:
                    return this.busyIndicatorSuggestionItemFactory(sId, oContext);
                default:
                    return this.regularSuggestionItemFactory(sId, oContext);
            }
        },
        /**
         * @this sap.esh.search.ui.controls.SearchInput
         */
        busyIndicatorSuggestionItemFactory: function () {
            // @ts-ignore
            var cell = new VerticalLayout("", {
                content: [
                    // @ts-ignore
                    new BusyIndicator("", {
                        size: "0.6rem",
                    }),
                ],
            });
            /** @type{any} */ (cell).getText = function () {
                return this.getValue();
            }.bind(this);
            // @ts-ignore
            var listItem = new ColumnListItem("", {
                cells: [cell],
                // @ts-ignore
                type: ListType.Inactive,
            });
            listItem.addStyleClass("searchSuggestion");
            listItem.addStyleClass("searchBusyIndicatorSuggestion");
            listItem.getVisible = this.assembleListNavigationModeGetVisibleFunction(listItem);
            return listItem;
        },
        /**
         * @this sap.esh.search.ui.controls.SearchInput
         */
        headerSuggestionItemFactory: function () {
            // @ts-ignore
            var label = new Label("", {
                text: "{label}",
            });
            // @ts-ignore
            var cell = new VerticalLayout("", {
                content: [label],
            });
            /**@type{any}*/ (cell).getText = function () {
                return this.getValue();
            }.bind(this);
            // @ts-ignore
            var listItem = new ColumnListItem("", {
                cells: [cell],
                // @ts-ignore
                type: ListType.Inactive,
            });
            listItem.addStyleClass("searchSuggestion");
            listItem.addStyleClass("searchHeaderSuggestion");
            listItem.getVisible = this.assembleListNavigationModeGetVisibleFunction(listItem);
            return listItem;
        },
        assembleListNavigationModeGetVisibleFunction: function (listItem) {
            return function () {
                if (!this.listNavigationMode) {
                    return true; // without the special list navigation mode we return the default value true
                }
                // in list navigation mode
                if (!this.listNavigationModeCache[listItem.getId()]) {
                    // the first time we return false
                    this.listNavigationModeCache[listItem.getId()] = true;
                    return false;
                }
                else {
                    // all subsequent calls return the default true
                    return true;
                }
            }.bind(this);
        },
        /**
         * @this sap.esh.search.ui.controls.SearchInput
         */
        assembleObjectSuggestionLabels: function (suggestion) {
            // first line: label 1
            var labels = [];
            // @ts-ignore
            var label1 = new Label("", {
                text: "{label1}",
            });
            label1.addEventDelegate({
                onAfterRendering: function () {
                    SearchHelper.boldTagUnescaper(/** @type {sap.m.Label} */ (this).getDomRef());
                },
            }, label1);
            label1.addStyleClass("sapUshellSearchObjectSuggestion-Label1");
            labels.push(label1);
            // second line: label 2
            if (suggestion.label2) {
                // @ts-ignore
                var label2 = new Label("", {
                    text: "{label2}",
                });
                label2.addEventDelegate({
                    onAfterRendering: function () {
                        SearchHelper.boldTagUnescaper(/** @type {sap.m.Label} */ (this).getDomRef());
                    },
                }, label2);
                label2.addStyleClass("sapUshellSearchObjectSuggestion-Label2");
                labels.push(label2);
            }
            // @ts-ignore
            var vLayout = new VerticalLayout("", {
                content: labels,
            });
            vLayout.addStyleClass("sapUshellSearchObjectSuggestion-Labels");
            return vLayout;
        },
        /**
         * @this sap.esh.search.ui.controls.SearchInput
         */
        objectSuggestionItemFactory: function (sId, oContext) {
            var suggestion = oContext.getObject();
            var suggestionParts = [];
            // image
            if (suggestion.imageExists && suggestion.imageUrl) {
                if (suggestion.imageUrl.startsWith("sap-icon://")) {
                    suggestionParts.push(
                    // @ts-ignore
                    new Icon("", {
                        src: suggestion.imageUrl,
                    }).addStyleClass("sapUshellSearchObjectSuggestIcon"));
                }
                else {
                    suggestionParts.push(new SearchObjectSuggestionImage({
                        src: "{imageUrl}",
                        isCircular: "{imageIsCircular}",
                    }));
                }
            }
            // labels
            var suggestionPartsToAdd = this.assembleObjectSuggestionLabels(suggestion);
            suggestionParts.push(suggestionPartsToAdd);
            // combine image and labels
            // @ts-ignore
            var cell = new HorizontalLayout("", {
                content: suggestionParts,
            });
            cell.addStyleClass("sapUshellSearchObjectSuggestion-Container");
            /** @type {any}*/ (cell).getText = function () {
                // for preview of suggestion term in search input box
                return this.getValue();
            }.bind(this);
            // suggestion list item
            // @ts-ignore
            var listItem = new ColumnListItem("", {
                cells: [cell],
                // @ts-ignore
                type: ListType.Active,
            });
            listItem.addStyleClass("searchSuggestion");
            listItem.addStyleClass("searchObjectSuggestion");
            return listItem;
        },
        /**
         * @this sap.esh.search.ui.controls.SearchInput
         */
        regularSuggestionItemFactory: function (sId, oContext) {
            var that = this;
            // for app suggestions: icon
            // @ts-ignore
            var icon = new Icon("", {
                src: "{icon}",
            })
                .addStyleClass("suggestIcon")
                .addStyleClass("sapUshellSearchSuggestAppIcon")
                .addStyleClass("suggestListItemCell");
            var layoutData = /** @type {any} */ (
            // @ts-ignore
            new FlexItemData("", {
                shrinkFactor: 1,
                minWidth: "4rem",
            }));
            // label
            // @ts-ignore
            var label = new Text("", {
                text: "{label}",
                layoutData: layoutData,
                wrapping: false,
            })
                .addStyleClass("suggestText")
                .addStyleClass("suggestNavItem")
                .addStyleClass("suggestListItemCell");
            label.addEventDelegate({
                onAfterRendering: function () {
                    SearchHelper.boldTagUnescaper(/** @type {sap.m.Label} */ (this).getDomRef());
                },
            }, label);
            // combine app, icon and label into cell
            // @ts-ignore
            var cell = new CustomListItem("", {
                // @ts-ignore
                type: ListType.Active,
                // @ts-ignore
                content: new FlexBox("", {
                    items: [icon, label],
                }),
            });
            var suggestion = oContext.oModel.getProperty(oContext.sPath);
            /** @type {any} */ (cell).getText = function () {
                return typeof suggestion.searchTerm === "string"
                    ? suggestion.searchTerm
                    : that.getValue();
            };
            // @ts-ignore
            var listItem = new ColumnListItem("", {
                cells: [cell],
                // @ts-ignore
                type: ListType.Active,
            });
            if (suggestion.uiSuggestionType === SuggestionType.App) {
                if (suggestion.title && suggestion.title.indexOf("combinedAppSuggestion") >= 0) {
                    listItem.addStyleClass("searchCombinedAppSuggestion");
                }
                else {
                    listItem.addStyleClass("searchAppSuggestion");
                }
            }
            if (suggestion.uiSuggestionType === SuggestionType.DataSource) {
                listItem.addStyleClass("searchDataSourceSuggestion");
            }
            if (suggestion.uiSuggestionType === SuggestionType.SearchTermData) {
                listItem.addStyleClass("searchBOSuggestion");
            }
            if (suggestion.uiSuggestionType === SuggestionType.SearchTermHistory) {
                listItem.addStyleClass("searchHistorySuggestion");
            }
            listItem.addStyleClass("searchSuggestion");
            listItem.addEventDelegate({
                onAfterRendering: function () {
                    var cells = /** @type {JQuery}*/ (listItem.$()).find(".suggestListItemCell");
                    var totalWidth = 0;
                    cells.each(function () {
                        totalWidth += $(this).outerWidth(true);
                    });
                    if (totalWidth > /** @type {JQuery}*/ (listItem.$()).find("li").get(0).scrollWidth) {
                        // is truncated
                        listItem.setTooltip($(cells[0]).text() + " " + $(cells[2]).text());
                    }
                },
            });
            return listItem;
        },
        /**
         * @this sap.esh.search.ui.controls.SearchInput
         */
        navigateToSearchApp: function () {
            if (SearchHelper.isSearchAppActive() ||
                this.getModel().preventUpdateURL ||
                this.getModel().isSearchCompositeControl) {
                // app running -> just fire query
                this.getModel()._firePerspectiveQuery();
            }
            else {
                // app not running -> start via hash
                // change hash:
                // -do not use Searchhelper.hasher here
                // -this is starting the search app from outside
                var sHash = this.getModel().renderSearchURL();
                window.location.hash = sHash;
            }
        },
        /**
         * @this sap.esh.search.ui.controls.SearchInput
         */
        getAriaDescriptionIdForNoResults: function () {
            return this._ariaDescriptionIdNoResults;
        },
        /**
         * @this sap.esh.search.ui.controls.SearchInput
         */
        onAfterRendering: function () {
            var $input = $(this.getDomRef()).find("#searchFieldInShell-input-inner");
            $(this.getDomRef()).find("input").attr("autocomplete", "off");
            $(this.getDomRef()).find("input").attr("autocorrect", "off");
            // additional hacks to show the "search" button on ios keyboards:
            $(this.getDomRef()).find("input").attr("type", "search");
            $(this.getDomRef()).find("input").attr("name", "search");
            var $form = jQuery('<form action=""></form>').on("submit", function () {
                return false;
            });
            $(this.getDomRef()).children("input").parent().append($form);
            $(this.getDomRef()).children("input").detach().appendTo($form);
            // end of iOS hacks
            $input.attr("aria-describedby", $input.attr("aria-describedby") + " " + this._ariaDescriptionIdNoResults);
        },
        /**
         * @this sap.esh.search.ui.controls.SearchInput
         */
        onValueRevertedByEscape: function () {
            // this method is called if ESC was pressed and
            // the value in it was not empty
            if (SearchHelper.isSearchAppActive()) {
                // dont delete the value if search app is active
                return;
            }
            this.setValue(" "); // add space as a marker for following ESC handler
        },
    });
});
