// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/services/LaunchPage","sap/ushell/appRuntime/ui5/AppRuntimeService"],function(L,A){"use strict";function a(c,p,s){L.call(this,c,p,s);this.getGroupsForBookmarks=function(){return A.sendMessageToOuterShell("sap.ushell.services.LaunchPage.getGroupsForBookmarks");};}a.prototype=L.prototype;a.hasNoAdapter=L.hasNoAdapter;return a;});
