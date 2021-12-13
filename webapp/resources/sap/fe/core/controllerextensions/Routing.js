/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/mvc/ControllerExtension","sap/ui/core/mvc/OverrideExecution"],function(C,O){"use strict";return C.extend("sap.fe.core.controllerextensions.Routing",{metadata:{methods:{"onBeforeNavigation":{"public":true,"final":false,overrideExecution:O.After},"navigate":{"public":true,"final":true},"onBeforeBinding":{"public":true,"final":false,overrideExecution:O.After},"onAfterBinding":{"public":true,"final":false,overrideExecution:O.After}}},onBeforeNavigation:function(n){return false;},navigate:function(c){this.base._routing.navigateToContext(c);},onBeforeBinding:function(c){},onAfterBinding:function(c){}});});
