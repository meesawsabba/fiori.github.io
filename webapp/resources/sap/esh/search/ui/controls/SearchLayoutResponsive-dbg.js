/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
// @ts-check
sap.ui.define([
    "sap/ui/layout/ResponsiveSplitter",
    "sap/ui/layout/SplitterLayoutData",
    "sap/m/ScrollContainer",
    "sap/ui/layout/SplitPane",
    "sap/ui/layout/PaneContainer",
    "sap/ui/core/Orientation",
], function (ResponsiveSplitter, SplitterLayoutData, ScrollContainer, SplitPane, PaneContainer, Orientation) {
    "use strict";
    return ResponsiveSplitter.extend("sap.esh.search.ui.controls.SearchLayoutResponsive", {
        metadata: {
            properties: {
                isBusy: {
                    type: "boolean",
                    defaultValue: false,
                },
                busyDelay: {
                    type: "int",
                    defaultValue: 100,
                },
                showFacets: {
                    type: "boolean",
                    defaultValue: false,
                },
                facetPanelWidthInPercent: {
                    type: "int",
                    defaultValue: "25",
                },
                animateFacetTransition: {
                    type: "boolean",
                    defaultValue: false,
                },
            },
            aggregations: {
                resultListContainer: {
                    type: "sap.ui.core.Control",
                    multiple: false,
                },
                facets: {
                    type: "sap.ui.core.Control",
                    multiple: false,
                },
                busyIndicator: {
                    type: "sap.ui.core.Control",
                    multiple: false,
                },
            },
        },
        /**
         * @this sap.esh.search.ui.controls.SearchLayoutResponsive
         */
        init: function () {
            ResponsiveSplitter.prototype.init.apply(this);
            // facets
            this._paneLeft = new SplitPane("", {
                requiredParentWidth: 960, // 60rem, this is when the pane gets hidden (pagination)
            });
            // result list
            var resultListScrollContainer = new ScrollContainer("", {
                height: "100%",
                vertical: true,
            });
            this._paneRight = new SplitPane("", {
                requiredParentWidth: 960,
                content: resultListScrollContainer,
            });
            // facet panel "hidden"
            this._paneLeft.setLayoutData(new SplitterLayoutData("", {
                size: "0%",
            }));
            this._paneRight.setLayoutData(new SplitterLayoutData("", {
                size: "100%",
            }));
            // panes
            var paneContainer = new PaneContainer("", {
                orientation: Orientation.Horizontal,
                panes: [this._paneLeft, this._paneRight],
            });
            this.setRootPaneContainer(paneContainer);
        },
        /**
         * @this sap.esh.search.ui.controls.SearchLayoutResponsive
         */
        constructor: function (sId, options) {
            ResponsiveSplitter.prototype.constructor.apply(this, [sId, options]);
        },
        /**
         * @this sap.esh.search.ui.controls.SearchLayoutResponsive
         */
        getFacets: function () {
            var facetContainer = this._paneLeft;
            return facetContainer.getContent();
        },
        /**
         * @this sap.esh.search.ui.controls.SearchLayoutResponsive
         */
        setFacets: function (oControl) {
            var facetContainer = this._paneLeft;
            facetContainer.setContent(oControl);
        },
        /**
         * @this sap.esh.search.ui.controls.SearchLayoutResponsive
         */
        getResultListContainer: function () {
            var resultListScrollContainer = /** @type {ScrollContainer} */ (this._paneRight.getContent());
            if (resultListScrollContainer) {
                return resultListScrollContainer;
            }
            return undefined;
        },
        /**
         * @this sap.esh.search.ui.controls.SearchLayoutResponsive
         */
        setResultListContainer: function (oControl) {
            var resultListScrollContainer = /** @type {ScrollContainer} */ (this.getRootPaneContainer().getPanes()[1]);
            resultListScrollContainer.destroyContent();
            resultListScrollContainer.setContent(oControl);
        },
        setAnimateFacetTransition: function (value) {
            this.setProperty("animateFacetTransition", value, true);
        },
        /**
         * @this sap.esh.search.ui.controls.SearchLayoutResponsive
         */
        setIsBusy: function (isBusy) {
            var that = this;
            if (isBusy) {
                if (this.busyFlag) {
                    return;
                }
                if (this.busyTimeout) {
                    return;
                }
                this.busyTimeout = setTimeout(function () {
                    that.busyTimeout = null;
                    that._setIsBusy(isBusy);
                }, this.getBusyDelay());
            }
            else {
                if (this.busyFlag) {
                    this._setIsBusy(isBusy);
                    return;
                }
                if (this.busyTimeout) {
                    clearTimeout(this.busyTimeout);
                    this.busyTimeout = null;
                    return;
                }
            }
        },
        setBusyDelay: function (busyDelay) {
            this.setProperty("busyDelay", busyDelay, true);
        },
        /**
         * @this sap.esh.search.ui.controls.SearchLayoutResponsive
         */
        _setIsBusy: function (isBusy) {
            if (isBusy) {
                this.getBusyIndicator().open();
                this.busyFlag = true; // TODO: workaround for UI5 problem
            }
            else if (this.busyFlag) {
                this.getBusyIndicator().close();
                this.busyFlag = false;
            }
            this.setProperty("isBusy", isBusy, true);
        },
        /**
         * @this sap.esh.search.ui.controls.SearchLayoutResponsive
         */
        setShowFacets: function (areFacetsShown) {
            if (areFacetsShown === this.getShowFacets()) {
                return undefined;
            }
            var $searchFacets = jQuery(".sapUiFixFlexFixed"); // TODO: JQuery
            var searchFacets = /** @type {sap.ui.core.Control} */ (this.getFacets()); // not sure why @type is needed and even 'sap.esh.search.ui.controls.SearchFacetFilter' does not work ?!?
            if (this.getAnimateFacetTransition()) {
                searchFacets.addStyleClass("sapUshellSearchFacetAnimation"); // TODO, make animation work again
            }
            else {
                searchFacets.removeStyleClass("sapUshellSearchFacetAnimation"); // TODO, make animation work again
            }
            if (!areFacetsShown) {
                // splitter position
                var layoutData = this._paneLeft.getLayoutData() || this._paneLeft.getContent().getLayoutData();
                this._currentFacetPanelWidthSize = parseInt(layoutData.getProperty("size").replace("%", ""));
                this._paneLeft.setLayoutData(new SplitterLayoutData("", {
                    size: "0%",
                }));
                this._paneRight.setLayoutData(new SplitterLayoutData("", {
                    size: "100%",
                }));
            }
            else {
                if (typeof this._currentFacetPanelWidthSize === "undefined") {
                    this._currentFacetPanelWidthSize = this.getFacetPanelWidthInPercent();
                }
                // splitter position
                this._paneLeft.setLayoutData(new SplitterLayoutData("", {
                    size: this._currentFacetPanelWidthSize + "%",
                }));
                var resutlListPaneWidthInPercent = 100 - this._currentFacetPanelWidthSize + "%";
                this._paneRight.setLayoutData(new SplitterLayoutData("", {
                    size: resutlListPaneWidthInPercent,
                }));
            }
            var handleAnimationEnd = function () {
                this.getModel()._notifySubscribers("searchLayoutChanged");
            }.bind(this);
            $searchFacets.one("transitionend", handleAnimationEnd); // TODO: JQuery
            // the 3rd parameter supresses rerendering
            this.setProperty("showFacets", areFacetsShown, true); // this validates and stores the new value
            return this; // return "this" to allow method chaining
        },
        renderer: "sap.ui.layout.ResponsiveSplitterRenderer",
    });
});
