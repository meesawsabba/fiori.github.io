// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/services/UserInfo",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ui/thirdparty/jquery",
    "sap/base/Log",
    "sap/base/util/ObjectPath"
], function (UserInfo, AppRuntimeService, jQuery, Log, ObjectPath) {
    "use strict";

    function UserInfoProxy (oAdapter, oContainerInterface) {
        UserInfo.call(this, oAdapter, oContainerInterface);

        this.getThemeList = function () {
            return AppRuntimeService.sendMessageToOuterShell("sap.ushell.services.UserInfo.getThemeList");
        };

        this.updateUserPreferences = function () {
            return AppRuntimeService.sendMessageToOuterShell("sap.ushell.services.UserInfo.updateUserPreferences", {
                language: sap.ushell.Container.getUser().getLanguage()
            });
        };

        this.getLanguageList = function () {
            return AppRuntimeService.sendMessageToOuterShell("sap.ushell.services.UserInfo.getLanguageList");
        };
    }

    ObjectPath.set("sap.ushell.services.UserInfo", UserInfoProxy);

    UserInfoProxy.prototype = UserInfo.prototype;
    UserInfoProxy.hasNoAdapter = UserInfo.hasNoAdapter;

    return UserInfoProxy;
}, true);
