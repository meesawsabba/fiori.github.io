// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/EventHub",
    "sap/ushell/Config",
    "sap/ushell/resources"
], function (
    Controller,
    JSONModel,
    EventHub,
    Config,
    resources
) {
    "use strict";

    return Controller.extend("sap.ushell.components.shell.Settings.spaces.SpacesSetting", {
        onInit: function () {
            // the UserInfo service is present, do not need to load it asynchronously
            this.oUserInfoService = sap.ushell.Container.getService("UserInfo");
            var oUser = this.oUserInfoService.getUser();
            var sImportFlag = oUser.getImportBookmarksFlag();
            var bIsSpacesEnabled = Config.last("/core/spaces/enabled");
            var bShowMyHomeVisible = bIsSpacesEnabled && Config.last("/core/spaces/myHome/enabled");
            var bShowMyHomeSelected = oUser.getShowMyHome();
            var bMyHomeImportVisible = sImportFlag !== "done" && sImportFlag !== "not_required";

            // If the FLP is in classic mode, do not show My Home and Import settigs - we do not know the values of other flags.
            var oViewModel = new JSONModel({
                isSpacesEnabled: bIsSpacesEnabled,
                isShowMyHomeVisible: bShowMyHomeVisible,
                isShowMyHomeSelected: bShowMyHomeSelected,
                isMyHomeImportVisible: bShowMyHomeVisible && bShowMyHomeSelected && bMyHomeImportVisible,
                isMyHomeImportSelected: sImportFlag === "pending"
            });
            this.getView().setModel(oViewModel);
            this.getView().setModel(resources.getTranslationModel(), "i18n");

            function setMyHomeImportSelected (value) {
                oViewModel.setProperty("/isMyHomeImportSelected", !!value);
            }
            this.oImportBookmarksFlagListener = EventHub.on("importBookmarksFlag").do(setMyHomeImportSelected);
        },

        onExit: function () {
            this.oImportBookmarksFlagListener.off();
        },

        onSave: function () {
            var oModel = this.getView().getModel(),
                oUserInfoService = this.oUserInfoService,
                oUser = oUserInfoService.getUser(),
                bOldSpacesEnabled = Config.last("/core/spaces/enabled"),
                bNewSpacesEnabled = oModel.getProperty("/isSpacesEnabled"),
                bOldShowMyHome = oUser.getShowMyHome(),
                bNewShowMyHome = oModel.getProperty("/isShowMyHomeSelected"),
                bOldShowImportMessage = oUser.getImportBookmarksFlag() === "pending",
                bNewShowImportMessage = oModel.getProperty("/isMyHomeImportSelected");

            var bRestart = false;
            var bUpdate = false;

            // Set and persist changed user preferences
            if (bOldSpacesEnabled !== bNewSpacesEnabled) {
                oUser.setChangedProperties({
                    propertyName: "spacesEnabled",
                    name: "SPACES_ENABLEMENT"
                }, bOldSpacesEnabled, bNewSpacesEnabled);
                bUpdate = true;
                bRestart = true;
            }
            if (bOldShowMyHome !== bNewShowMyHome) {
                oUser.setShowMyHome(bNewShowMyHome);
                bUpdate = true;
                bRestart = true;
            }
            if (bOldShowImportMessage !== bNewShowImportMessage) {
                var bImportFlag = bNewShowImportMessage ? "pending" : "dismissed";
                oUser.setImportBookmarksFlag(bImportFlag);
                bUpdate = true;

                if (!bRestart) { // do not need to react if the FLP is going to restart anyway
                    EventHub.emit("importBookmarksFlag", bNewShowImportMessage);
                }
            }

            // Nothing to do if setting has not been changed
            if (!bUpdate) {
                return Promise.resolve();
            }

            return new Promise(function (resolve, reject) {
                oUserInfoService.updateUserPreferences()
                    .done(function () {
                        oUser.resetChangedProperty("spacesEnabled");
                        oUser.resetChangedProperty("showMyHome");
                        oUser.resetChangedProperty("importBookmarks");
                        resolve({
                            refresh: bRestart,
                            noHash: true // Inform Controller, about reloading without Hash, to ensure we are not trying to Start the "MyHome" space by accident
                        });
                    })
                    .fail(function (sErrorMessage) {
                        oModel.setProperty("/isSpacesEnabled", bOldSpacesEnabled);
                        oModel.setProperty("/showMyHome", bOldShowMyHome);
                        oUser.resetChangedProperty("spacesEnabled");
                        oUser.resetChangedProperty("showMyHome");
                        oUser.resetChangedProperty("importBookmarks");
                        reject(sErrorMessage);
                    });
            });
        },

        onCancel: function () {
            var oModel = this.getView().getModel();
            oModel.setProperty("/isSpacesEnabled", Config.last("/core/spaces/enabled"));
            oModel.setProperty("/showMyHome", this.oUserInfoService.getUser().getShowMyHome());
        }
    });
});
