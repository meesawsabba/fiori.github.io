/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
/* global $ */
// @ts-check
sap.ui.define([
    "../i18n",
    "sap/ui/core/Control",
    "sap/m/Button",
    "sap/m/ButtonRenderer",
    "sap/m/SegmentedButtonItem",
    "sap/base/Log",
    "sap/esh/search/ui/SearchFacetDialogModel",
    "sap/m/Title",
    "sap/m/List",
    "sap/m/CustomListItem",
    "sap/m/Toolbar",
    "sap/m/ToolbarSpacer",
    "sap/m/GroupHeaderListItemRenderer",
    "sap/m/GroupHeaderListItem",
    "sap/m/ListSeparators",
    "sap/m/ActionSheet",
    "sap/m/PlacementType",
    "sap/m/Link",
    "sap/m/Label",
    "sap/m/VBox",
    "sap/esh/search/ui/controls/SearchFacetDialog",
], function (i18n, Control, Button, ButtonRenderer, SegmentedButtonItem, Log, SearchFacetDialogModel, Title, List, CustomListItem, Toolbar, ToolbarSpacer, GroupHeaderListItemRenderer, GroupHeaderListItem, ListSeparators, ActionSheet, PlacementType, Link, Label, VBox) {
    "use strict";
    Button.extend("sap.esh.search.ui.controls.SearchFacetDisplayModeDropDown", {
        renderer: "sap.esh.search.ui.controls.SearchFacetDisplayModeDropDownRenderer",
    });
    sap.esh.search.ui.controls.SearchFacetDisplayModeDropDownRenderer = jQuery.extend(true, {}, ButtonRenderer); // clone
    GroupHeaderListItemRenderer.extend("sap.esh.search.ui.controls.SearchGroupHeaderListItemRenderer");
    GroupHeaderListItem.extend("sap.esh.search.ui.controls.SearchGroupHeaderListItem", {
        renderer: "sap.esh.search.ui.controls.SearchGroupHeaderListItemRenderer",
        metadata: {
            properties: {
                upperCase: {
                    type: "boolean",
                    group: "Appearance",
                    defaultValue: false,
                }, // change default
            },
            aggregations: {
                button: {
                    type: "sap.esh.search.ui.controls.SearchFacetDisplayModeDropDown",
                    multiple: false,
                },
            },
        },
    });
    // @ts-ignore
    sap.esh.search.ui.controls.SearchGroupHeaderListItemRenderer.renderCounter = function (rm, oLI) {
        var btn = oLI.getButton();
        if (typeof btn === "object") {
            // @ts-ignore
            this.renderCounterContent(rm, oLI, btn);
        }
    };
    // @ts-ignore
    sap.esh.search.ui.controls.SearchGroupHeaderListItemRenderer.renderCounterContent = function (rm, 
    // @ts-ignore
    oLI, btn) {
        rm.write("<div>");
        rm.renderControl(btn);
        rm.write("</div>");
    };
    SegmentedButtonItem.extend("my.SegmentedButtonItem", {
        aggregations: {
            content1: {
                type: "sap.ui.core.Control",
                multiple: false,
            },
        },
    });
    return Control.extend("sap.esh.search.ui.controls.SearchFacetTabBar", {
        metadata: {
            // the Control API
            properties: {
                eshRole: "string",
                headerText: "string",
                selectedButtonParameters: {
                    type: "object",
                    defaultValue: null,
                },
            },
            aggregations: {
                items: {
                    type: "sap.m.IconTabFilter",
                    multiple: true, // default type is "sap.ui.core.Control", multiple is "true"
                },
            },
        },
        getSearchFacetTabBarAndDimensionById: function (buttonId) {
            var returnOBj = {};
            returnOBj.index = 0;
            var button = document.getElementById(buttonId);
            var view = button.dataset.facetView;
            var buttonIndex = button.dataset.facetViewIndex;
            var actionSheet = $("#" + buttonId).parent()[0];
            var dimension = actionSheet.dataset.facetDimension;
            var ar = $(".sapUshellSearchFacetTabBar");
            for (var i = 0; i < ar.length; i++) {
                var currentHeader = $(".sapUshellSearchFacetTabBar .sapUshellSearchFacetTabBarHeader")[i];
                var headerDimension = currentHeader.dataset.facetDimension;
                if (headerDimension === dimension) {
                    returnOBj.index = i;
                    returnOBj.control = sap.ui.getCore().byId(ar[i].id);
                    returnOBj.view = view;
                    returnOBj.buttonIndex = buttonIndex;
                    returnOBj.dimension = dimension;
                    break;
                }
            }
            return returnOBj;
        },
        storeClickedTabInformation: function (oEvent) {
            var searchFacetTabBarDimension, searchFacetTabBarControl, searchFacetTabBarView, dimension, buttonIndex;
            var tabId = oEvent.getSource().sId;
            var searchFacetTabBarInfo = this.getSearchFacetTabBarAndDimensionById(tabId);
            var previousClickedTabInformation = searchFacetTabBarInfo.control
                .getModel()
                .getPersonalizationStorageInstance()
                .getItem("search-facet-panel-chart-state");
            searchFacetTabBarDimension = searchFacetTabBarInfo.dimension;
            searchFacetTabBarControl = searchFacetTabBarInfo.control;
            searchFacetTabBarView = searchFacetTabBarInfo.view;
            buttonIndex = searchFacetTabBarInfo.buttonIndex;
            dimension = searchFacetTabBarControl.getBindingContext().getObject().dimension;
            var buttonId = oEvent.getParameters().id;
            var clickedTabInformation = [];
            var obj = {};
            obj.tabId = tabId;
            obj.searchFacetTabBarIndex = searchFacetTabBarInfo.searchFacetTabBarIndex;
            obj.buttonId = buttonId;
            obj.buttonIndex = buttonIndex;
            obj.dimension = dimension;
            obj.view = searchFacetTabBarView;
            clickedTabInformation.push(obj);
            if (previousClickedTabInformation &&
                Object.prototype.toString.call(previousClickedTabInformation) === "[object Array]") {
                for (var i = 0; i < previousClickedTabInformation.length; i++) {
                    var item = previousClickedTabInformation[i];
                    if (item.dimension !== searchFacetTabBarDimension) {
                        clickedTabInformation.push(item);
                    }
                }
            }
            searchFacetTabBarInfo.control
                .getModel()
                .getPersonalizationStorageInstance()
                .setItem("search-facet-panel-chart-state", clickedTabInformation);
            // also store information in model
            searchFacetTabBarControl.getBindingContext().getObject().chartIndex = buttonIndex;
        },
        renderer: function (oRm, oControl) {
            /* eslint no-loop-func:0 */
            var createOpenFacetDialogFn = function (iSelectedTabBarIndex, aTabBarItems) {
                return function () {
                    var dimension;
                    // since UI5 reuses the showMore link control, we have to traverse the DOM
                    // to find our facets dimension:
                    // sapUshellSearchFacetTabBar sapUshellSearchFacet
                    var node = $(this.getDomRef()).closest(".sapUshellSearchFacetTabBar")[0];
                    var facet = sap.ui.getCore().byId($(node).attr("id"));
                    var oFacetDialogModel = new SearchFacetDialogModel(oControl.getModel());
                    oFacetDialogModel.initBusinessObjSearch().then(function () {
                        var oSearchModel = oControl.getModel();
                        oFacetDialogModel.setData(oControl.getModel().getData());
                        oFacetDialogModel.config = oControl.getModel().config;
                        oFacetDialogModel.sinaNext = oControl.getModel().sinaNext;
                        if (facet &&
                            facet.getBindingContext() &&
                            facet.getBindingContext().getObject() &&
                            // @ts-ignore
                            facet.getBindingContext().getObject().dimension) {
                            // @ts-ignore
                            dimension = facet.getBindingContext().getObject().dimension;
                        }
                        // DWC exit, open 'show all' (specific 'show more') for space facet
                        if (dimension === "space_description" &&
                            oSearchModel.config.openSpaceShowMoreDialog) {
                            return oSearchModel.config.openSpaceShowMoreDialog(dimension, oSearchModel);
                        }
                        oFacetDialogModel.prepareFacetList();
                        // @ts-ignore
                        var oDialog = new sap.esh.search.ui.controls.SearchFacetDialog({
                            selectedAttribute: dimension,
                            selectedTabBarIndex: iSelectedTabBarIndex,
                            tabBarItems: aTabBarItems,
                        });
                        oDialog.setModel(oFacetDialogModel);
                        oDialog.setModel(oControl.getModel(), "searchModel");
                        oDialog.open();
                        // referece to page, so that dialog can be destroy in onExit()
                        var oPage = oControl.getParent().getParent().getParent().getParent();
                        oPage.oFacetDialog = oDialog;
                        oControl.getModel().eventLogger.logEvent({
                            type: oControl.getModel().eventLogger.FACET_SHOW_MORE,
                            referencedAttribute: dimension,
                        });
                    });
                };
            };
            // outer div
            oRm.write('<div tabindex="0"');
            oRm.writeControlData(oControl);
            oRm.addClass("sapUshellSearchFacetTabBar");
            oRm.writeClasses();
            oRm.write(">");
            var dimension = oControl.getBindingContext().getObject().dimension;
            var dataType = oControl.getBindingContext().getObject().dataType;
            var title = oControl.getBindingContext().getObject().title;
            var clickedTabInformation;
            var selectedButtonParameters;
            clickedTabInformation = oControl
                .getModel()
                .getPersonalizationStorageInstance()
                .getItem("search-facet-panel-chart-state");
            if (clickedTabInformation &&
                Object.prototype.toString.call(clickedTabInformation) === "[object Array]") {
                for (var k = 0; k < clickedTabInformation.length; k++) {
                    if (clickedTabInformation[k].dimension === dimension) {
                        selectedButtonParameters = clickedTabInformation[k];
                        break;
                    }
                }
            }
            var buttons2 = [];
            var contents = [];
            var oContent = null;
            var oButton = null;
            var selectedButtonIndex = 0;
            if (selectedButtonParameters && selectedButtonParameters.buttonIndex) {
                var selectedButtonIndexString = selectedButtonParameters.buttonIndex;
                selectedButtonIndex = parseInt(selectedButtonIndexString, 10);
            }
            if (dataType != oControl.getModel().sinaNext.AttributeType.String) {
                selectedButtonIndex = 0;
            }
            // also store information in model
            oControl.getBindingContext().getObject().chartIndex = selectedButtonIndex;
            var tabBarItems = oControl.getItems();
            var oDropDownButton = new sap.esh.search.ui.controls.SearchFacetDisplayModeDropDown("", {
                icon: tabBarItems[selectedButtonIndex].getIcon(),
                // @ts-ignore
                type: "Transparent",
            });
            /*eslint-disable no-loop-func*/
            for (var i = 0; i < tabBarItems.length; i++) {
                oContent = tabBarItems[i].getContent()[0];
                oButton = new Button({
                    text: tabBarItems[i].getText(),
                    icon: tabBarItems[i].getIcon(),
                    press: function (oEvent) {
                        oControl.storeClickedTabInformation(oEvent);
                        oControl.setSelectedButtonParameters(oEvent.getParameters()); // needed to trigger rerender
                    },
                });
                oButton.data("facet-view", tabBarItems[i].getText(), true);
                oButton.data("facet-view-index", "" + i, true);
                oButton.data("dimension", dimension, true);
                buttons2.push(oButton);
                contents.push(oContent);
            }
            var oActionSheet = new ActionSheet({
                showCancelButton: false,
                buttons: buttons2,
                placement: PlacementType.Bottom,
                cancelButtonPress: function () {
                    Log.info("sap.m.ActionSheet: cancelButton is pressed");
                },
                afterClose: function () {
                    var that = this;
                    window.setTimeout(function () {
                        var dimension = that.getFocusDomRef().getAttribute("data-facet-dimension");
                        var tabBarButtons = $(".sapUshellSearchFacetTabBarButton");
                        for (var i = 0; i < tabBarButtons.length; i++) {
                            var tabBarButton = tabBarButtons[i];
                            var tabBarButtonDimension = 
                            // @ts-ignore
                            tabBarButton.parentNode.parentNode.getAttribute("data-facet-dimension"); // TODO: clean-code
                            if (tabBarButtonDimension === dimension) {
                                tabBarButton.focus();
                                break;
                            }
                        }
                    }, 100);
                    Log.info("=====================");
                    Log.info("sap.m.ActionSheet: closed");
                },
            });
            oActionSheet.data("facet-dimension", dimension, true);
            oDropDownButton.addStyleClass("sapUshellSearchFacetTabBarButton");
            var asWhat = tabBarItems[selectedButtonIndex].getText();
            var displayAs = i18n.getText("displayAs", [asWhat]);
            oDropDownButton.setTooltip(displayAs);
            oDropDownButton.attachPress(function () {
                oActionSheet.openBy(this);
            });
            oDropDownButton.onAfterRendering = function () {
                $(this.getDomRef()).attr("aria-label", i18n.getText("dropDown"));
            };
            // RENDERING
            // set 'filter by' header
            if (oControl.getHeaderText()) {
                // ===============================================
                var oHeader = new List({});
                oHeader.setShowNoData(false);
                oHeader.setShowSeparators(ListSeparators.None);
                oHeader.data("sap-ui-fastnavgroup", "false", true /* write into DOM */);
                var bFiltersExist = false;
                var oModel = oControl.getModel();
                var rootCondition = oModel.getProperty("/uiFilter/rootCondition");
                if (rootCondition.hasFilters()) {
                    bFiltersExist = true;
                    // DWC exit
                    if (typeof oModel.config.hasSpaceFiltersOnly === "function") {
                        if (oModel.config.hasSpaceFiltersOnly(rootCondition) === true) {
                            bFiltersExist = false;
                        }
                    }
                }
                else {
                    bFiltersExist = false;
                }
                var oResetButton = new Button({
                    icon: "sap-icon://clear-filter",
                    tooltip: i18n.getText("resetFilterButton_tooltip"),
                    type: "Transparent",
                    enabled: bFiltersExist,
                    press: function () {
                        var model = oControl.getModel();
                        model.eventLogger.logEvent({
                            type: model.eventLogger.CLEAR_ALL_FILTERS,
                        });
                        // DWC exit
                        var searchInConditions = [];
                        var searchInCondition;
                        var uiFilter = model.getProperty("/uiFilter");
                        var searchInAttrPosistions = model.config.searchInAttibuteFacetPostion;
                        if (searchInAttrPosistions) {
                            for (var searchInAttribute in searchInAttrPosistions) {
                                searchInCondition =
                                    uiFilter.rootCondition.getAttributeConditions(searchInAttribute);
                                for (var j = 0; j < searchInCondition.length; j++) {
                                    searchInConditions.push(searchInCondition[j]);
                                }
                            }
                        }
                        if (searchInConditions.length > 0) {
                            model.resetFilterConditions(false);
                            for (var i = 0; i < searchInConditions.length; i++) {
                                var filterCondition = searchInConditions[i];
                                uiFilter.autoInsertCondition(filterCondition);
                            }
                            model._firePerspectiveQuery({
                                preserveFormerResults: false,
                            });
                            model.notifyFilterChanged();
                        }
                        else {
                            model.resetFilterConditions(true);
                        }
                    },
                });
                if (oControl.getModel().config &&
                    oControl.getModel().config.searchInAttibuteFacetPostion &&
                    oControl.getModel().config.searchInAttibuteFacetPostion[dimension]) {
                    oResetButton.addStyleClass("sapUshellSearchFilterByResetButtonHidden");
                }
                else {
                    oResetButton.addStyleClass("sapUshellSearchFilterByResetButton");
                }
                oResetButton.onAfterRendering = function () {
                    $(this.getDomRef()).attr("aria-label", i18n.getText("resetFilterButton_tooltip"));
                };
                var oLabel = new Title({
                    text: oControl.getHeaderText(),
                });
                var oSpacer = new ToolbarSpacer();
                var oHeaderToolbar = new Toolbar({
                    content: [oLabel, oSpacer, oResetButton],
                });
                oHeaderToolbar.data("sap-ui-fastnavgroup", "false", true /* write into DOM */);
                oHeader.setHeaderToolbar(oHeaderToolbar);
                if (oControl.getModel().config &&
                    oControl.getModel().config.FF_facetPanelUnifiedHeaderStyling &&
                    dimension === "space_description") {
                    oHeader.setVisible(false);
                }
                else {
                    oHeader.addStyleClass("sapUshellSearchFilterByHeaderList");
                }
                oHeader.onAfterRendering = function () {
                    $(".sapUshellSearchFilterByHeaderList").find("ul").attr("tabindex", "-1");
                    $(".sapUshellSearchFilterByHeaderList").find("div").attr("tabindex", "-1");
                };
                oRm.renderControl(oHeader);
                //===============================================
            }
            var oListItem = new CustomListItem({
                content: contents[selectedButtonIndex],
                // the above line sadly removes the control from the searchFacetTabBar and relocates it in the ListItem
            });
            oListItem.setModel(oControl.getModel(), "facets");
            oListItem.addStyleClass("sapUshellSearchFacetList");
            var oGroupHeaderListItem;
            if (dataType === oControl.getModel().sinaNext.AttributeType.String) {
                // @ts-ignore
                oGroupHeaderListItem = new sap.esh.search.ui.controls.SearchGroupHeaderListItem({
                    title: title,
                    button: oDropDownButton,
                });
            }
            else {
                // @ts-ignore
                oGroupHeaderListItem = new sap.esh.search.ui.controls.SearchGroupHeaderListItem({
                    title: title,
                });
            }
            oGroupHeaderListItem.data("facet-dimension", dimension, true);
            if (oControl.getModel().config &&
                oControl.getModel().config.searchInAttibuteFacetPostion &&
                oControl.getModel().config.searchInAttibuteFacetPostion[dimension]) {
                if (oControl.getModel().config &&
                    oControl.getModel().config.FF_facetPanelUnifiedHeaderStyling) {
                    if (dimension === "space_description") {
                        // do not hide
                    }
                    else {
                        oGroupHeaderListItem.addStyleClass("sapUshellSearchFacetTabBarHeader sapUshellSearchFacetTabBarHeaderHidden");
                    }
                }
                else {
                    oGroupHeaderListItem.addStyleClass("sapUshellSearchFacetTabBarHeader sapUshellSearchFacetTabBarHeaderHidden");
                }
            }
            else {
                oGroupHeaderListItem.addStyleClass("sapUshellSearchFacetTabBarHeader");
            }
            //---------------------
            var linkText = i18n.getText("showMore");
            // DWC space facet
            if (dimension === "space_description") {
                linkText = i18n.getText("showMoreDwcSpace");
            }
            var oShowMore = new Link({
                text: linkText,
                press: createOpenFacetDialogFn(selectedButtonIndex, tabBarItems),
            });
            oShowMore.setModel(oControl.getModel("i18n"));
            oShowMore.addStyleClass("sapUshellSearchFacetShowMoreLink");
            var oInfoZeile = new Label({
                text: "",
            });
            oInfoZeile.addStyleClass("sapUshellSearchFacetInfoZeile");
            var oShowMoreSlot = new VBox({
                items: [oInfoZeile, oShowMore],
            });
            var oShowMoreItem = new CustomListItem({
                content: oShowMoreSlot,
                visible: {
                    parts: ["/uiFilter/dataSource"],
                    formatter: function (datasource) {
                        return datasource.type !== this.getModel().sinaNext.DataSourceType.Category;
                    },
                },
            });
            oShowMoreItem.addStyleClass("sapUshellSearchFacetShowMoreItem");
            //------------------------
            var oList = new List({
                showSeparators: ListSeparators.None,
                items: [oGroupHeaderListItem, oListItem, oShowMoreItem],
            });
            oList.data("sap-ui-fastnavgroup", "false", true /* write into DOM */);
            oList.setModel(oControl.getModel());
            oRm.renderControl(oList);
            oControl.getItems()[selectedButtonIndex].addContent(contents[selectedButtonIndex]);
            // KLUDGE: the above line returns the control to the searchFacetTabBar - otherwise it is lost by being passed to another control
            oRm.write("</div>");
        },
        onAfterRendering: function () {
            jQuery(this.getDomRef()).removeAttr("tabindex");
        },
    });
});
