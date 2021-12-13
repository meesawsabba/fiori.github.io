// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview The Unified Shell's user information service, which allows you to retrieve
 *     information about the user.
 *
 * @version 1.96.0
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ushell/Config",
    "sap/base/util/ObjectPath"
], function (Log, Config, ObjectPath) {
    "use strict";

    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>sap.ushell.Container.getServiceAsync("UserInfo").then(function (UserInfo) {});</code>.
     * Constructs a new instance of the user information service.
     *
     * The Unified Shell's user information service, which allows you to retrieve
     *     information about the logged-in user.
     *
     * @name sap.ushell.services.UserInfo
     * @param {object} oAdapter Adapter
     * @param {object} oContainerInterface interface
     *
     * @constructor
     * @class
     * @see sap.ushell.services.Container#getServiceAsync
     * @since 1.16.3
     *
     * @public
     */
    function UserInfo (oAdapter, oContainerInterface) {
        /**
         * Returns the id of the user.
         *
         * @returns {string}
         *   The user id.
         *
         * @since 1.16.3
         *
         * @public
         * @alias sap.ushell.services.UserInfo#getId
         */
        this.getId = function () {
            return sap.ushell.Container.getUser().getId();
        };

        /**
         * Returns the first name of the user.
         *
         * @returns {string}
         *   The user's first name.
         *
         * @since 1.86.0
         *
         * @public
         * @alias sap.ushell.services.UserInfo#getFirstName
         */
        this.getFirstName = function () {
            return sap.ushell.Container.getUser().getFirstName();
        };

        /**
         * Returns the last name of the user.
         *
         * @returns {string}
         *   The user's last name.
         *
         * @since 1.86.0
         *
         * @public
         * @alias sap.ushell.services.UserInfo#getLastName
         */
        this.getLastName = function () {
            return sap.ushell.Container.getUser().getLastName();
        };

        /**
         * Returns the full name of the user.
         *
         * @returns {string}
         *   The user's full name.
         *
         * @since 1.86.0
         *
         * @public
         * @alias sap.ushell.services.UserInfo#getFullName
         */
        this.getFullName = function () {
            return sap.ushell.Container.getUser().getFullName();
        };

        /**
         * Returns the email address of the user.
         *
         * @returns {string}
         *   The user's email address.
         *
         * @since 1.86.0
         *
         * @public
         * @alias sap.ushell.services.UserInfo#getEmail
         */
        this.getEmail = function () {
            return sap.ushell.Container.getUser().getEmail();
        };

        /**
         * Returns an object representing the logged-in user.
         *
         * @returns {sap.ushell.User}
         *      object providing information about the logged-in user
         *
         * @since 1.15.0
         *
         * @private
         */
        this.getUser = function () {
            return sap.ushell.Container.getUser();
        };

        /**
         * Filters out the theme sap horizon in case admin disabled this theme.
         * @param {object} oTheme Theme object to be filtered
         * @returns {boolean} true, if theme is not sap_horizon or if theme sap_horizon is enabled,
         *                    else false
         */
        function filterOutSapHorizon (oTheme) {
            return oTheme.id !== sap.ushell.User.prototype.constants.NEW_DESIGN
                || Config.last("/core/themePreview/sapHorizonEnabled");

        }

        /**
         * Returns the list of themes available for the user.
         * In case of success, the <code>done</code> function returns an 'anonymous' object
         * representing the list of themes.
         * In case of failure, the <code>fail</code> function of the jQuery.promise object is called.
         *
         * @returns {object}
         *  jQuery.promise object.
         *
         * @private
         */
        this.getThemeList = function () {
            var oDeferred = new jQuery.Deferred();

            oAdapter.getThemeList()
                .then(function (oThemeList) {

                    oThemeList.options = (oThemeList.options || []).filter(filterOutSapHorizon);

                    return oDeferred.resolve(oThemeList);
                })
                .fail(function (aThemeList) {
                    Log.error("getThemeList failed");
                });
            return oDeferred.promise();
        };

        /**
         * Sends the updated user attributes to the adapter.
         * In case of success, the <code>done</code> function returns nothing.
         * In case of failure, the <code>fail</code> function of the jQuery.promise object is called.
         *
         *  @returns {object}
         *  jQuery.promise object
         */
        this.updateUserPreferences = function () {
            var oPromise = oAdapter.updateUserPreferences(sap.ushell.Container.getUser());
            oPromise.fail(function () {
                Log.error("updateAttributes: ");
            });
            return oPromise;
        };

        /**
         * Returns the list of languages or locales available for the user.
         * In case of success, the <code>done</code> function returns an object
         * representing a list of language (e.g., en) or locale IDs (e.g., en-us).
         * In case of failure, the <code>fail</code> function of the jQuery.promise object is called.
         * The first item is the browser language - e.g. {"Browser Language":"en-us"}
         * @returns {object}
         *  jQuery.promise object.
         *
         * @private
         */
        this.getLanguageList = function () {
            var oPromise = oAdapter.getLanguageList();
            oPromise.fail(function () {
                Log.error("getLanguageList failed");
            });
            return oPromise;
        };

        /**
         * Returns the list of User Profile Property ValueLists .
         * In case of success, the <code>done</code> function returns an object
         * @returns {object}
         *  jQuery.promise object.
         *
         * @private
         */
        this.getUserSettingList = function () {
            var oPromise = oAdapter.getUserProfilePropertyValueLists();
            oPromise.fail(function () {
                Log.error("getUserProfilePropertyValueLists failed");
            });
            return oPromise;
        };

        /**
         * Returns if the adapter supports editing User profile value list
         * @returns {boolean} true if the adapter allows it, false otherwise
         *
         * @private
         */
        this.getUserSettingListEditSupported = function () {
            if (typeof oAdapter.getUserProfilePropertyValueLists !== "undefined") {
                return true;
            }
            return false;
        };

        /**
         * Returns the state of the newDesign feature switch.
         * @returns {Promise<boolean>} Promise resolves to true if switch is on, else false
         * @private
         * @since 1.96
         */
        this.getStateNewDesignSwitch = function () {
            return this._getNewDesignSetting()
                .then(function (oNewDesignSetting) {
                    return oNewDesignSetting.stateNewDesignSwitch;
                });
        };

        /**
         * Switches to the new design theme.
         *
         * @returns {Promise} promise that resolves when action is finished.
         * @private
         * @since 1.96
         */
        this.activateNewDesign = function () {
            if (!Config.last("/core/shellHeader/newDesignSwitchVisible")) {
                Log.warning("Warning while activating new design: The new design feature is not enabled.");
                return Promise.resolve();
            }

            var oUser = this.getUser(),
                sOriginalThemeId = oUser.getTheme(sap.ushell.User.prototype.constants.themeFormat.ORIGINAL_THEME);

            if (sOriginalThemeId === sap.ushell.User.prototype.constants.NEW_DESIGN) {
                Log.warning("Warning while activating new design: The current theme is already the new design theme.");
                return Promise.resolve();
            }

            return Promise.all([
                this.updateThemeHistory(sOriginalThemeId),
                this.setTheme(sap.ushell.User.prototype.constants.NEW_DESIGN),
                this.updateNewDesignSetting(true)
            ]);
        };

        /**
         * Switches from the new design to the previous theme.
         *
         * @returns {Promise} promise that resolves when action is finished.
         * @private
         * @since 1.96
         */
        this.deactivateNewDesign = function () {
            var oUser = this.getUser(),
                sOriginalThemeId = oUser.getTheme(sap.ushell.User.prototype.constants.themeFormat.ORIGINAL_THEME);

            if (sOriginalThemeId !== sap.ushell.User.prototype.constants.NEW_DESIGN) {
                Log.warning("Cannot disable new design: New design theme is not the current theme.");
                return Promise.resolve();
            }

            return this._getThemeHistory().then(function (oThemeHistory) {
                var sRestoreTheme;
                if (oThemeHistory && oThemeHistory.previousTheme) {
                    if (oThemeHistory.previousTheme === sap.ushell.User.prototype.constants.NEW_DESIGN) {
                        Log.warning("Warning while disabling new design: Previous theme is same as the new design theme. Falling back to default theme.");
                        sRestoreTheme = ObjectPath.get("services.Container.adapter.config.theme", window["sap-ushell-config"]);
                    } else {
                        sRestoreTheme = oThemeHistory.previousTheme;
                    }
                } else {
                    Log.warning("Warning while disabling new design: Previous theme is empty. Falling back to default theme.");
                    sRestoreTheme = ObjectPath.get("services.Container.adapter.config.theme", window["sap-ushell-config"]);
                }
                return Promise.all([
                    this.setTheme(sRestoreTheme),
                    this.updateThemeHistory(sOriginalThemeId),
                    this.updateNewDesignSetting(false)
                ]);
            }.bind(this));
        };

        /**
         * Returns the personalizer for for the given name.
         * @param {string} sName has value "themeHistory" or "newDesignSetting".
         * @returns {Promise<sap.ushell.services.Personalizer>} promise that resolves with personalizer for container.
         * @private
         * @since 1.96
         */
        this._getPersonalizer = function (sName) {
            return sap.ushell.Container.getServiceAsync("Personalization")
                .then(function (oPersonalizationService) {
                    var oScope = {
                        keyCategory: oPersonalizationService.constants.keyCategory.FIXED_KEY,
                        writeFrequency: oPersonalizationService.constants.writeFrequency.LOW,
                        clientStorageAllowed: true
                    };
                    try {
                        return oPersonalizationService.getPersonalizer({
                            container: sName,
                            item: "1"
                        }, oScope);
                    } catch (oError) {
                        Log.error("Personalization service does not work:");
                        Log.error(oError.name + ": " + oError.message);
                        return Promise.reject(oError);
                    }
                });
        };

        /**
         * Retrieves the theme history the from the database.
         * @returns {Promise<{previousTheme: boolean}>} Promise that resolves with an object containing the previous theme.
         * @private
         * @since 1.96
         */
         this._getThemeHistory = function () {
            return this._getPersonalizer("themeHistory")
                .then(function (oPersonalizer) {
                    return oPersonalizer.getPersData()
                        .then(function (oThemeHistory) {
                            return oThemeHistory || { previousTheme: false };
                        });
                });
        };
        /**
         * Updates the theme history to the database.
         * @param {string} sOriginalThemeId previous theme
         * @returns {Promise} promise that resolves when action is done
         * @private
         * @since 1.96
         */
        this.updateThemeHistory = function (sOriginalThemeId) {
            return this._getPersonalizer("themeHistory")
                .then(function (oPersonalizer) {
                    return oPersonalizer.setPersData({
                        previousTheme: sOriginalThemeId
                    });
                });
        };

        /**
         * Retrieves the new design setting the from the database.
         * @returns {Promise<{stateNewDesignSwitch: boolean}>} Promise that resolves with an object new design setting containing
         * a string, the name of the previous theme and a boolean for the state of the new design switch
         * @private
         * @since 1.96
         */
        this._getNewDesignSetting = function () {
            return this._getPersonalizer("newDesignSetting")
                .then(function (oPersonalizer) {
                    return oPersonalizer.getPersData()
                        .then(function (oNewDesignSetting) {
                            return oNewDesignSetting || { stateNewDesignSwitch: false };
                        });
                });
        };

        /**
         * updates the state of the new design setting to the database.
         * @param {boolean} bStateNewDesignSwitch state of new design switch
         * @returns {Promise} promise that resolves when action is done
         * @private
         * @since 1.96
         */
        this.updateNewDesignSetting = function (bStateNewDesignSwitch) {
            return this._getPersonalizer("newDesignSetting")
                .then(function (oPersonalizer) {
                    Config.emit("/core/shellHeader/newDesignSwitchActive", bStateNewDesignSwitch);
                    return oPersonalizer.setPersData({
                        stateNewDesignSwitch: bStateNewDesignSwitch
                    });
                });
        };

        /**
         * Check if the dark mode needs to be applied after changing the theme.
         *
         * @return {Promise} A promise resolving when the check is done.
         * @private
         * @since 1.96
         */
        this._applyDarkMode = function () {
            return sap.ushell.Container.getServiceAsync("DarkModeSupport").then(function (oDarkModeSupport) {
                if (Config.last("/core/darkMode/enabled") && oDarkModeSupport.canAutomaticallyToggleDarkMode()) {
                    oDarkModeSupport._toggleDarkModeBasedOnSystemColorScheme();
                }
            });
        };

        /**
         * Error handler in case theme switching fails.
         * Restores the original theme and sets the new design switch to the correct state.
         *
         * @param {string} sOriginalThemeId The id of the original theme.
         * @param {object} oUser The user object.
         * @param {string} sErrorMessage An error message string.
         * @param {object} oParsedErrorInformation The error information object.
         * @private
         * @since 1.96
         */
        this._onThemeSwitchError = function (sOriginalThemeId, oUser, sErrorMessage, oParsedErrorInformation) {
            var bIsNewDesign = sOriginalThemeId === sap.ushell.User.prototype.constants.NEW_DESIGN;
            oUser.setTheme(sOriginalThemeId);
            oUser.resetChangedProperty("theme");
            this.updateNewDesignSetting(bIsNewDesign);
            Log.error("Can not update selected theme", sErrorMessage);
            Log.error("Error details", oParsedErrorInformation);
        };

        /**
         * Sets the theme with the given id and updates it to the database and sets the dark mode
         * - Chooses sap_fiori_3 if sThemeId is empty
         * - Does nothing if theme is already set.
         *
         * @param {string} sThemeId Theme to be set
         * @returns {Promise<boolean|undefined>} promise Promise that resolves with true after theme is set
         *              if an error occurs it fails with the error message
         * @private
         * @since 1.96
         */
        this.setTheme = function (sThemeId) {
            var sNewThemeId = sThemeId || "sap_fiori_3",
                oUser = this.getUser(),
                sOriginalThemeId = oUser.getTheme(sap.ushell.User.prototype.constants.themeFormat.ORIGINAL_THEME);

            if (sNewThemeId && sNewThemeId !== sOriginalThemeId) {
                oUser.setTheme(sNewThemeId);

                return this.updateUserPreferences(oUser)
                    .then(this._applyDarkMode.bind(this))
                    .catch(this._onThemeSwitchError.bind(this, sOriginalThemeId, oUser));
            }
            return Promise.resolve();
        };
    }

    UserInfo.hasNoAdapter = false;
    return UserInfo;
}, true /* bExport */);
