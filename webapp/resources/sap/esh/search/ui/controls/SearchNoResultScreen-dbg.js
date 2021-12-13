/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
/* global $ */
// @ts-check
sap.ui.define(["sap/esh/search/ui/i18n", "sap/esh/search/ui/SearchShellHelper", "sap/m/Link", "sap/ui/core/IconPool"], function (i18n, SearchShellHelper, Link, IconPool) {
    "use strict";
    return sap.ui.core.Control.extend("sap.esh.search.ui.controls.SearchNoResultScreen", {
        metadata: {
            properties: {
                searchBoxTerm: "string",
            },
            aggregations: {
                toolbar: {
                    type: "sap.ui.core.Control",
                    multiple: true,
                },
            },
        },
        renderer: function (oRm, oControl) {
            var model = oControl.getModel();
            var searchInput = SearchShellHelper.getSearchInput();
            var ariaDescriptionIdForNoResults;
            if (searchInput) {
                ariaDescriptionIdForNoResults = searchInput.getAriaDescriptionIdForNoResults();
            }
            var escapedSearchTerm = $("<div>").text(oControl.getSearchBoxTerm()).html();
            oRm.write('<div class="sapUshellSearch-no-result"');
            oRm.writeControlData(oControl);
            oRm.write(">");
            oRm.write('<div class="sapUshellSearch-no-result-icon">');
            oRm.writeIcon(IconPool.getIconURI("travel-request"));
            oRm.write('</div><div class="sapUshellSearch-no-result-text" role="alert">');
            oRm.write("<div ");
            if (ariaDescriptionIdForNoResults) {
                oRm.write('id="' + ariaDescriptionIdForNoResults + '" ');
            }
            // i18n no_results_info: fix translation bug by additional replace
            var escapedSearchTermSanetized;
            if (model.config && model.config.FF_bSearchtermNoAsterisk) {
                // asterisk
                escapedSearchTermSanetized = escapedSearchTerm;
            }
            else {
                escapedSearchTermSanetized = escapedSearchTerm === "" ? "*" : escapedSearchTerm;
            }
            oRm.write('class="sapUshellSearch-no-result-info">' +
                i18n
                    .getText("no_results_info", [escapedSearchTermSanetized]) // does NOT replace wildcard by 'nothing', if escapedSearchTerm === "" (DWC page reaload w/o search term AND user not assigned to any space)
                    .replace('<b>"&1"</b>', '<b>"' + escapedSearchTermSanetized + '"</b>'));
            oRm.write("</div>");
            oControl.renderAppFinderLink(oRm, oControl);
            oRm.write('<div class="sapUshellSearch-no-result-tips">' +
                i18n.getText("no_results_tips") +
                "</div> ");
            oControl.renderToolbar(oRm, oControl);
            oRm.write("</div></div>");
        },
        renderAppFinderLink: function (oRm, oControl) {
            var model = oControl.getModel();
            var oCrossAppNavigator;
            if (sap && sap.ushell && sap.ushell.Container && sap.ushell.Container.getServiceAsync) {
                var oContainer = sap.ushell.Container;
                oContainer
                    .getServiceAsync("SmartNavigation")
                    .then(function (service) {
                    oCrossAppNavigator = service;
                })
                    .catch(function () {
                    oContainer.getServiceAsync("CrossApplicationNavigation").then(function (service) {
                        oCrossAppNavigator = service;
                    });
                });
            }
            if (!model.config.isUshell) {
                return;
            }
            if (model.getDataSource() !== model.appDataSource) {
                return;
            }
            var linkText = i18n.getText("no_results_link_appfinder", ["xxxx"]);
            var index = linkText.indexOf("xxxx");
            var prefix = linkText.slice(0, index);
            var suffix = linkText.slice(index + 4);
            oRm.write('<div class="sapUshellSearch-no-result-info">');
            oRm.write(prefix);
            var link = new Link({
                text: i18n.getText("appFinderTitle"),
                press: function () {
                    if (oCrossAppNavigator) {
                        oCrossAppNavigator.toExternal({
                            target: {
                                shellHash: "#Shell-home&/appFinder/catalog",
                            },
                        });
                    }
                },
            });
            oRm.renderControl(link);
            oRm.write(suffix);
            oRm.write("</div>");
        },
        renderToolbar: function (oRm, oControl) {
            var toolbarControls = oControl.getToolbar();
            for (var i = 0; i < toolbarControls.length; ++i) {
                var toolbarControl = toolbarControls[i];
                oRm.renderControl(toolbarControl);
            }
        },
    });
});
