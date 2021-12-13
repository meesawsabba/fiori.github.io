/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/layout/FixFlex", "sap/m/ScrollContainer"], function (FixFlex, ScrollContainer) {
    "use strict";
    return FixFlex.extend("sap.esh.search.ui.controls.SearchLayout", {
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
        init: function () {
            var that = this;
            FixFlex.prototype.init.apply(this);
            var resultListScrollContainer = new ScrollContainer({
                height: "100%",
                vertical: true,
            });
            that.setFlexContent(resultListScrollContainer);
        },
        constructor: function (sId, options) {
            var that = this;
            FixFlex.prototype.constructor.apply(this, [sId, options]);
            that.setVertical(false);
            this.addEventDelegate({
                onAfterRendering: function () {
                    var $searchFacets = jQuery(".sapUiFixFlexFixed");
                    if (that.getShowFacets() && !sap.ui.Device.system.phone) {
                        $searchFacets.addClass("sapUshellSearchFacetPanelOpen");
                    }
                    else {
                        $searchFacets.removeClass("sapUshellSearchFacetPanelOpen");
                    }
                },
            });
        },
        getFacets: function () {
            return this.getFixContent();
        },
        setFacets: function (oControl) {
            this.addFixContent(oControl);
        },
        getResultListContainer: function () {
            var resultListScrollContainer = this.getFlexContent();
            var content = resultListScrollContainer.getContent();
            if (content.length > 0) {
                return content[0];
            }
            return undefined;
        },
        setResultListContainer: function (oControl) {
            var resultListScrollContainer = this.getFlexContent();
            resultListScrollContainer.destroyContent();
            resultListScrollContainer.addContent(oControl);
        },
        setAnimateFacetTransition: function (value) {
            this.setProperty("animateFacetTransition", value, true);
        },
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
        _setIsBusy: function (isBusy) {
            if (isBusy) {
                this.getBusyIndicator().open();
                this.busyFlag = true; // workaround for UI5 problem
            }
            else if (this.busyFlag) {
                this.getBusyIndicator().close();
                this.busyFlag = false;
            }
            this.setProperty("isBusy", isBusy, true);
        },
        setShowFacets: function (areFacetsShown) {
            if (areFacetsShown === this.getShowFacets()) {
                return undefined;
            }
            var $searchFacets = jQuery(".sapUiFixFlexFixed");
            var $searchResultListContainer = jQuery(".sapUshellSearchResultListsContainer");
            if (this.getAnimateFacetTransition()) {
                $searchFacets.addClass("sapUshellSearchFacetAnimation");
            }
            else {
                $searchFacets.removeClass("sapUshellSearchFacetAnimation");
            }
            if (!areFacetsShown) {
                $searchResultListContainer.removeClass("sapUshellSearchFacetPanelOpen");
                $searchFacets.removeClass("sapUshellSearchFacetPanelOpen");
                $searchFacets.attr("aria-hidden", "true");
            }
            else {
                $searchResultListContainer.addClass("sapUshellSearchFacetPanelOpen");
                $searchFacets.addClass("sapUshellSearchFacetPanelOpen");
                $searchFacets.attr("aria-hidden", "false");
            }
            var handleAnimationEnd = function () {
                this.getModel()._notifySubscribers("searchLayoutChanged");
            }.bind(this);
            $searchFacets.one("transitionend", handleAnimationEnd);
            // the 3rd parameter supresses rerendering
            this.setProperty("showFacets", areFacetsShown, true); // this validates and stores the new value
            return this; // return "this" to allow method chaining
        },
        renderer: "sap.ui.layout.FixFlexRenderer",
    });
});
