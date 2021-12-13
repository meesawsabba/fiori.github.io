/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/core/CommonUtils","sap/fe/navigation/SelectionVariant"],function(C,S){"use strict";return{onBeforeBinding:function(c,p){this.getView().getController()._onBeforeBinding(c,p);},onAfterBinding:function(c,p){this.getView().getController()._onAfterBinding(c,p);}};});
