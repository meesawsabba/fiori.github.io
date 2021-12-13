/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
/* global $ */
// @ts-check
sap.ui.define([
    "../i18n",
    "sap/m/IconTabFilter",
    "sap/m/Button",
    "sap/m/VBox",
    "sap/m/GroupHeaderListItem",
    "./../error/errors",
    "sap/esh/search/ui/controls/SearchFacetQuickSelectDataSource",
    "sap/esh/search/ui/controls/SearchFacetHierarchy",
    "sap/esh/search/ui/controls/SearchFacet",
    "sap/esh/search/ui/controls/SearchFacetTabBar",
    "sap/esh/search/ui/controls/SearchFacetBarChart",
    "sap/esh/search/ui/controls/SearchFacetPieChart",
], function (i18n, IconTabFilter, Button, VBox, GroupHeaderListItem, errors, SearchFacetQuickSelectDataSource, SearchFacetHierarchy, SearchFacet, SearchFacetTabBar, SearchFacetBarChart, SearchFacetPieChart) {
    "use strict";
    var myIconTabBar = SearchFacetTabBar.extend("my.IconTabBar", {
        renderer: "sap.esh.search.ui.controls.SearchFacetTabBarRenderer",
        setEshRole: function () {
            var items = this.getItems();
            for (var i = 0; i < items.length; ++i) {
                var item = items[i];
                var facet = item.getContent()[0];
                facet.setEshRole.apply(facet, arguments);
            }
        },
        getEshRole: function () {
            var items = this.getItems();
            var item = items[0];
            var facet = item.getContent()[0];
            return facet.getEshRole.apply(facet, arguments);
        },
        attachSelectionChange: function () { },
    });
    return sap.ui.core.Control.extend("sap.esh.search.ui.controls.SearchFacetFilter", {
        metadata: {
            properties: {
                title: "string",
            },
            aggregations: {
                facets: {
                    multiple: true,
                },
            },
        },
        init: function () {
            // define group for F6 handling
            this.data("sap-ui-fastnavgroup", "true", true /* write into DOM */);
        },
        constructor: function (oOptions) {
            oOptions = jQuery.extend({}, {}, oOptions);
            sap.ui.core.Control.prototype.constructor.apply(this, [oOptions]);
            this.bindAggregation("facets", {
                path: "/facets",
                factory: function (id, oContext) {
                    var facet = oContext.getObject();
                    var oModel = oContext.getModel();
                    var config = oModel.config;
                    switch (facet.facetType) {
                        case "attribute":
                            var sId = "attribute_facet" + id;
                            // DWC exit
                            if (config && typeof config.getSpaceFacetId === "function") {
                                sId = config.getSpaceFacetId(facet.dimension, sId);
                            }
                            if (config && config.id) {
                                sId = config.id + "-" + sId;
                            }
                            var barchartOptions = {};
                            barchartOptions.id = "barChart" + arguments[0];
                            var oIconTabBar = new myIconTabBar(sId, {
                                items: [
                                    new IconTabFilter({
                                        text: i18n.getText("facetList"),
                                        icon: "sap-icon://list",
                                        key: "list" + arguments[0],
                                        content: new SearchFacet("list" + arguments[0]),
                                    }),
                                    new IconTabFilter({
                                        text: i18n.getText("facetBarChart"),
                                        icon: "sap-icon://horizontal-bar-chart",
                                        key: "barChart" + arguments[0],
                                        content: new SearchFacetBarChart(barchartOptions),
                                    }),
                                    new IconTabFilter({
                                        text: i18n.getText("facetPieChart"),
                                        icon: "sap-icon://pie-chart",
                                        key: "pieChart" + arguments[0],
                                        content: new SearchFacetPieChart("pieChart" + arguments[0]),
                                    }),
                                ],
                            });
                            oIconTabBar.addStyleClass("sapUshellSearchFacetIconTabBar");
                            return oIconTabBar;
                        case "datasource":
                            return new SearchFacet((config && config.id ? config.id + "-" : "") + "dataSourceFacet");
                        case "quickSelectDataSource":
                            var quickSelectDataSourceList = new SearchFacetQuickSelectDataSource((config && config.id ? config.id + "-" : "") +
                                "sapUshellSearchFacetQuickSelectDataSource", {});
                            if (config && config.FF_facetPanelUnifiedHeaderStyling) {
                                var oGroupHeaderListItem = new GroupHeaderListItem({
                                    title: i18n.getText("quickSelectDataSourcesHeader"),
                                });
                                oGroupHeaderListItem.addStyleClass("sapUshellSearchFacetTabBarHeader");
                                oGroupHeaderListItem.addStyleClass("sapElisaSearchFacetTabBarHeaderUl");
                                return new VBox("", {
                                    items: [oGroupHeaderListItem, quickSelectDataSourceList],
                                });
                            }
                            return quickSelectDataSourceList;
                        case "hierarchy":
                            var hierarchyId = "attribute_facet" + id;
                            return new SearchFacetHierarchy(hierarchyId, {});
                        default: {
                            var internalError = new Error("program error: unknown facet type " + facet.facetType);
                            throw new errors.UnknownFacetType(internalError);
                        }
                    }
                },
            });
        },
        fireReset: function () {
            /** @type {sap.esh.search.ui.SearchModel} */ (this.getModel()).resetFilterConditions(false);
            /** @type {sap.esh.search.ui.SearchModel} */ (this.getModel()).setDataSource(
            /** @type {sap.esh.search.ui.SearchModel} */ (this.getModel()).allDataSource, true);
        },
        renderer: function (oRm, oControl) {
            /* eslint no-loop-func:0 */
            var createOpenFacetDialogFn = function () {
                return function () {
                    // since UI5 reuses the showMore link control, we have to traverse the DOM
                    // to find our facets dimension:
                    var facet = /** @type {SearchFacet} */ (sap.ui
                        .getCore()
                        .byId($($(this.getDomRef()).closest(".sapUshellSearchFacet")[0]).attr("id")));
                    var oFacetDialogModel = new sap.esh.search.ui.SearchFacetDialogModel(oControl.getModel());
                    oFacetDialogModel.initBusinessObjSearch().then(function () {
                        oFacetDialogModel.setData(oControl.getModel().getData());
                        oFacetDialogModel.config = oControl.getModel().config;
                        oFacetDialogModel.sinaNext = oControl.getModel().sinaNext;
                        oFacetDialogModel.prepareFacetList();
                        var dimension = null;
                        if (facet &&
                            facet.getBindingContext() &&
                            facet.getBindingContext().getObject() &&
                            facet.getBindingContext().getObject().dimension) {
                            dimension = /** @type {sap.esh.search.ui.controls.Facet} */ (facet.getBindingContext().getObject()).dimension;
                        }
                        var oDialog = new sap.esh.search.ui.controls.SearchFacetDialog({
                            selectedAttribute: dimension,
                        });
                        oDialog.setModel(oFacetDialogModel);
                        oDialog.setModel(oControl.getModel(), "searchModel");
                        oDialog.open();
                        //referece to page, so that dialog can be destroy in onExit()
                        var oPage = oControl.getParent().getParent().getParent().getParent();
                        oPage.oFacetDialog = oDialog;
                        oControl.getModel().eventLogger.logEvent({
                            type: oControl.getModel().eventLogger.FACET_SHOW_MORE,
                        });
                    });
                };
            };
            // outer div
            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addClass("sapUshellSearchFacetFilter");
            oRm.writeClasses();
            oRm.write(">");
            var isFirstAttributeFacet = true;
            for (var i = 0, len = oControl.getFacets().length; i < len; i++) {
                var facet = oControl.getFacets()[i];
                var facetModel = facet.getBindingContext().getObject();
                switch (facetModel.facetType) {
                    case "attribute":
                        facet.setEshRole("attribute");
                        facet.attachSelectionChange(null, function () {
                            // dont show the showAllBtn while the facet pane is empty
                            jQuery(oControl.showAllBtn.getDomRef()).hide();
                        });
                        if (facetModel.position > 999) {
                            // Conventional facets without positions in config
                            if (isFirstAttributeFacet) {
                                facet.setHeaderText(i18n.getText("filterBy"));
                                isFirstAttributeFacet = false;
                            }
                        }
                        else {
                            // DWC Exit
                            facet.setHeaderText(facetModel.title);
                            facet.addStyleClass("sapUshellSearchFacetSearchInAttribute");
                        }
                        oRm.renderControl(facet);
                        break;
                    case "datasource":
                        facet.setEshRole("datasource");
                        facet.addStyleClass("sapUshellSearchFacetDataSource");
                        oRm.renderControl(facet);
                        break;
                    case "quickSelectDataSource":
                        if (oControl.getModel().config &&
                            oControl.getModel().config.FF_facetPanelUnifiedHeaderStyling) {
                            // header is not visible
                        }
                        else {
                            facet.setHeaderText(i18n.getText("quickSelectDataSourcesHeader"));
                        }
                        oRm.renderControl(facet);
                        break;
                    case "hierarchy":
                        if (facetModel.position > 999) {
                            // Conventional facets without positions in config
                            if (isFirstAttributeFacet) {
                                facet.setHeaderText(i18n.getText("filterBy"));
                                isFirstAttributeFacet = false;
                            }
                        }
                        else {
                            // DWC Exit
                            facet.setHeaderText(facetModel.title);
                            facet.addStyleClass("sapUshellSearchFacetSearchInAttribute");
                        }
                        oRm.renderControl(facet);
                        break;
                    default:
                        throw "program error: unknown facet type :" + facetModel.facetType;
                }
            }
            //show all filters button
            if (oControl.getModel().getDataSource() &&
                oControl.getModel().getDataSource().type === "BusinessObject") {
                var hasDialogFacets = oControl
                    .getModel()
                    .oFacetFormatter.hasDialogFacetsFromMetaData(oControl.getModel());
                var hasResultItems = oControl.getModel().getProperty("/boCount") > 0;
                if (hasDialogFacets && hasResultItems) {
                    oRm.write("<div>");
                    oControl.showAllBtn = new Button({
                        text: "{showAllFilters}",
                        press: createOpenFacetDialogFn(),
                        visible: true,
                    });
                    oControl.showAllBtn.setModel(oControl.getModel("i18n"));
                    oControl.showAllBtn.addStyleClass("sapUshellSearchFacetFilterShowAllFilterBtn");
                    oRm.renderControl(oControl.showAllBtn);
                    oRm.write("</div>");
                }
            }
            // close searchfacetfilter div
            oRm.write("</div>");
        },
        onAfterRendering: function () {
            var $dataSource = $(".searchFacetFilter .searchFacet").first().find("ul");
            var $dataSourceItems = $dataSource.find("li");
            $dataSource.attr("role", "tree");
            $dataSourceItems.attr("role", "treeitem");
        },
    });
});
