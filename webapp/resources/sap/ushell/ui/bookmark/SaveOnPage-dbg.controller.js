// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/base/Log",
    "sap/ushell/Config",
    "sap/ushell/resources",
    "sap/ui/thirdparty/hasher",
    "sap/ui/core/library"
], function (
    Controller,
    Log,
    Config,
    resources,
    hasher,
    coreLibrary
) {
    "use strict";

    // shortcut for sap.ui.core.ValueState
    var ValueState = coreLibrary.ValueState;

    return Controller.extend("sap.ushell.ui.bookmark.SaveOnPage", {

        /**
         * Initialize
         */
        onInit: function () {
            var oView = this.getView();
            oView.setModel(resources.i18nModel, "i18n");

            this.byId("bookmarkTitleInput").attachLiveChange(function () {
                if (this.getValue() === "") {
                    this.setValueStateText(resources.i18n.getText("bookmarkTitleInputError"));
                    this.setValueState(ValueState.Error);
                } else {
                    this.setValueState(ValueState.None);
                }
            });

            this.byId("pageSelect").attachSelectionFinish(function () {
                if (this.getSelectedKeys().length === 0) {
                    this.setValueStateText(resources.i18n.getText("bookmarkPageSelectError"));
                    this.setValueState(ValueState.Error);
                } else {
                    this.setValueState(ValueState.None);
                }
            });
        },

        /**
         * When the dialog is set to show page selection and pages are not loaded yet, loads the list of possible targets
         * that are offered for bookmark placement into the save-on-page view model. These are pages grouped by spaces in
         * launchpad spaces mode.
         *
         * @private
         * @param {boolean} bShowPageSelection The dialog show page selection
         * @param {object[]} aPages Array of pages
         * @returns {Promise<void>} Promise that resolves, once the possible targets have been loaded into the model.
         *
         * @since 1.78.0
         */
        loadPagesIntoModel: function (bShowPageSelection, aPages) {
            if (bShowPageSelection && !aPages) {

                var bPersonalizationEnabled = Config.last("/core/shell/enablePersonalization");
                var bMyHomeEnabled = Config.last("/core/spaces/myHome/enabled");
                if (!bPersonalizationEnabled && !bMyHomeEnabled) {
                    var oModel = this.getView().getModel();
                    oModel.setProperty("/pages", []);
                    oModel.setProperty("/cannotLoadPages", true);
                    Log.error("SaveOnPage controller: Unable to determine or use targets for bookmark placement, because personalization is disabled");
                    return Promise.resolve();
                }

                var bShowOnlyMyHome = !bPersonalizationEnabled && bMyHomeEnabled;
                var sMyHomeSpaceId = Config.last("/core/spaces/myHome/myHomeSpaceId");
                // Store them into the "pages" model property
                return Promise.all([
                    sap.ushell.Container.getServiceAsync("Menu"),
                    sap.ushell.Container.getServiceAsync("CommonDataModel")
                ])
                .then(function (aServices) {
                    return Promise.all([
                        aServices[0].getSpacesPagesHierarchy(),
                        aServices[1].getAllPages()
                    ]);
                })
                .then(function (aResults) {
                    var aSpaceEntries = aResults[0].spaces;
                    var aAllPages = aResults[1];
                    var mPageIdToTitle = {};

                    aAllPages.forEach(function (oPage) {
                        mPageIdToTitle[oPage.identification.id] = oPage.identification.title;
                    });

                    return aSpaceEntries.reduce(function (aTargets, oSpace) {
                        if (bShowOnlyMyHome && sMyHomeSpaceId !== oSpace.id) {
                            return aTargets;
                        }
                        oSpace.pages.map(function (oPage) {
                            if (mPageIdToTitle[oPage.id]) {
                                aTargets.push({
                                    id: oPage.id,
                                    title: mPageIdToTitle[oPage.id],
                                    spaceTitle: oSpace.title
                                });
                            }
                        });

                        return aTargets;
                    }, []);
                })
                .then(function (aTargetPages) {
                    if (aTargetPages.length < 1) {
                        return Promise.reject();
                    }
                    this.getView().getModel().setProperty("/pages", aTargetPages);
                }.bind(this))
                .catch(function () {
                    var oModel = this.getView().getModel();
                    oModel.setProperty("/pages", []);
                    oModel.setProperty("/cannotLoadPages", true);
                    Log.error("SaveOnPage controller: Unable to determine or use targets for bookmark placement.");
                }.bind(this));
            }
            return Promise.resolve();
        },

        /**
         * Removes the focus from the preview tile so that the keyboard navigation does not focus on the preview tile.
         *
         * @private
         * @since 1.78.0
         */
        removeFocusFromTile: function () {
            this.getView().getDomRef().querySelector(".sapMGT").removeAttribute("tabindex");
        },

        /**
         * @returns {object} Bookmark tile data
         *
         * @private
         * @since 1.78.0
         */
        getBookmarkTileData: function () {
            var oView = this.getView();
            var oModel = oView.getModel();
            var oViewData = oView.getViewData();
            var sURL;

            if (oViewData.customUrl) {
                if (typeof (oViewData.customUrl) === "function") {
                    sURL = oViewData.customUrl();
                } else {
                    sURL = oViewData.customUrl;
                }
            } else {
                sURL = hasher.getHash() ? ("#" + hasher.getHash()) : window.location.href;
            }

            var oPagesSelect = this.byId("pageSelect");

            var oData = {
                title: oModel.getProperty("/title") || "",
                subtitle: oModel.getProperty("/subtitle") || "",
                url: sURL,
                icon: oModel.getProperty("/icon"),
                info: oModel.getProperty("/info") || "",
                numberUnit: oModel.getProperty("/numberUnit"),
                serviceUrl: typeof (oViewData.serviceUrl) === "function" ? oViewData.serviceUrl() : oViewData.serviceUrl,
                serviceRefreshInterval: oModel.getProperty("/serviceRefreshInterval"),
                pages: oPagesSelect ? oPagesSelect.getSelectedKeys() : [],
                keywords: oModel.getProperty("/keywords")
            };

            oData.title = oData.title.substring(0, 256).trim();
            oData.subtitle = oData.subtitle.substring(0, 256).trim();
            oData.info = oData.info.substring(0, 256).trim();

            return oData;
        },

        /**
         * Grouper function to group pages by spaceTitle.
         *
         * @param {object} binding The binding object.
         * @returns {string} The spaceTitle string.
         */
        groupBySpace: function (binding) {
            return binding.getObject().spaceTitle;
        },

        /**
         * Sorter function to sort page by spaceTitle.
         * Exception: The 'My Home' space should always be first.
         *
         * @param {object} pageA First page to compare.
         * @param {object} pageB Second page to compare.
         * @returns {number} -1 if pageA has a higher sort priority than pageB.
         *                   1 if pageA has a lower sort priority than pageB.
         *                   0 if both pages have equal sort priority.
         */
        sortPages: function (pageA, pageB) {
            if (Config.last("/core/spaces/myHome/enabled")) {
                var sMyHomePageId = Config.last("/core/spaces/myHome/myHomePageId");

                if (pageA.id === sMyHomePageId) { return -1; }
                if (pageB.id === sMyHomePageId) { return 1; }
            }

            if (pageA.spaceTitle.toUpperCase() > pageB.spaceTitle.toUpperCase()) { return 1; }
            if (pageA.spaceTitle.toUpperCase() < pageB.spaceTitle.toUpperCase()) { return -1; }
            return 0;
        }
    });
});
