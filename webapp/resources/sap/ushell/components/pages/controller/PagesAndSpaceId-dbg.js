// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/resources",
    "sap/ushell/Config"
], function (resources, Config) {
    "use strict";
    var PagesAndSpaceId = function () {
    };

    /**
     * Gets the url parameters and returns the spaceId and pageId of the target page.
     *
     * @param sShellHash Hash part of a shell compliant URL
     * @returns {Promise<object>} Resolves to an object contains the pageId and spaceId
     * @private
     * @since 1.72.0
     */
    PagesAndSpaceId.prototype._getPageAndSpaceId = function (sShellHash) {
        return sap.ushell.Container.getServiceAsync("URLParsing").then(function (urlParsingService) {
            // To be able to use this function during boottask
            if (!sShellHash) {
                sShellHash = window.hasher.getHash();
            }
            var oHash = urlParsingService.parseShellHash(sShellHash);
            var oIntent = {
                semanticObject: oHash.semanticObject || "",
                action: oHash.action || ""
            };
            var oHashPartsParams = oHash.params || {};
            var aPageId = oHashPartsParams.pageId || [];
            var aSpaceId = oHashPartsParams.spaceId || [];

            return this._parsePageAndSpaceId(aPageId, aSpaceId, oIntent);
        }.bind(this));
    };

    /**
     * Parses the given spaceId and pageId. When there are no pageId and spaceId given but the intent is Shell-home,
     * returns the spaceId and pageId of the default page. When there is no pageId and spaceId, only a pageId or a
     * spaceId, or more than one pageId or spaceId given, returns a rejected promise with an error message.
     *
     * @param {array} pageId An array that contains the page id of the page which should be displayed
     * @param {array} spaceId An array that contains the space id of the page which should be displayed
     * @param {object} intent An object that contains the semantic object and action of the page which should be displayed
     * @returns {Promise<object>} Resolves to an object contains the pageId and spaceId
     * @private
     * @since 1.72.0
     */
    PagesAndSpaceId.prototype._parsePageAndSpaceId = function (pageId, spaceId, intent) {
        return new Promise(function (resolve, reject) {
            this.getUserMyHomeEnablement().then(function () {
                if (pageId.length < 1 && spaceId.length < 1) {
                    if (intent.semanticObject === "Shell" && intent.action === "home") {
                        this._getUserDefaultPage()
                            .then(function (oResult) {
                                resolve(oResult);
                            })
                            .catch(function (sError) {
                                reject(sError);
                            });
                        return;
                    }
                    reject(resources.i18n.getText("PageRuntime.NoPageIdAndSpaceIdProvided"));
                }

                if (pageId.length === 1 && spaceId.length === 0) {
                    reject(resources.i18n.getText("PageRuntime.OnlyPageIdProvided"));
                }

                if (pageId.length === 0 && spaceId.length === 1) {
                    reject(resources.i18n.getText("PageRuntime.OnlySpaceIdProvided"));
                }

                if (pageId.length > 1 || spaceId.length > 1) {
                    reject(resources.i18n.getText("PageRuntime.MultiplePageOrSpaceIdProvided"));
                }

                if (pageId[0] === "") {
                    reject(resources.i18n.getText("PageRuntime.InvalidPageId"));
                }

                if (spaceId[0] === "") {
                    reject(resources.i18n.getText("PageRuntime.InvalidSpaceId"));
                }

                resolve({
                    pageId: pageId[0],
                    spaceId: spaceId[0]
                });
            }.bind(this));
        }.bind(this));
    };

    /**
     * Returns a promise resolving the User Settings.
     *
     * @returns {Promise<true||false>} Either true, if user has enabled 'MyHome' or false if disabled.
     */
    PagesAndSpaceId.prototype.getUserMyHomeEnablement = function () {
        return new Promise(function (resolve, reject) {
            var bUserMyHome = sap.ushell.Container.getUser().getShowMyHome();
            Config.emit("/core/spaces/myHome/userEnabled", bUserMyHome);
            resolve(bUserMyHome);
        });
    };

    /**
     * Returns the default page of the current user.
     * For its determination the Menu service is used to access the spaces pages
     * hierarchy: The first page in there is taken as the "default" page.
     *
     * @returns {Promise<object>} Resolves to an object that contains the pageId and spaceId of the page.
     *   Rejects if no space or no page has been assigned to the user, or if there's a problem accessing the spaces pages hierarchy.
     * @private
     * @since 1.72.0
     */
    PagesAndSpaceId.prototype._getUserDefaultPage = function () {
        return new Promise(function (resolve, reject) {
            Promise.all([ sap.ushell.Container.getServiceAsync("Menu"), this.getUserMyHomeEnablement()]).then(function (aResults) {
                var oMenuService = aResults[0];
                oMenuService.getSpacesPagesHierarchy()
                    .then(function (oSpacesPagesHierarchy) {

                        // Reject if no space assigned
                        if (oSpacesPagesHierarchy.spaces.length === 0) {
                            reject(resources.i18n.getText("PageRuntime.NoAssignedSpace"));
                        }

                        // Find first space that has a page
                        var oSpaceWithPage = oSpacesPagesHierarchy.spaces.find(function (oSpace) {
                            return (!!(oSpace.id && oSpace.pages && oSpace.pages[0] && oSpace.pages[0].id));
                        });

                        if (oSpaceWithPage) {
                            resolve({
                                spaceId: oSpaceWithPage.id,
                                pageId: oSpaceWithPage.pages[0].id
                            });
                        // Reject if no page assigned
                        } else {
                            reject(resources.i18n.getText("PageRuntime.NoAssignedPage"));
                        }
                    });
            });
        }.bind(this));
    };

    return new PagesAndSpaceId();
});
