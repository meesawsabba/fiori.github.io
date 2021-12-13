/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define([],function(){"use strict";return{setCreationMode:function(c){var u=this.base.getView().getBindingContext("ui");u.getModel().setProperty("createMode",c,u,true);if(this.getProgrammingModel()==="Sticky"){u.getModel().setProperty("createModeSticky",this.getTransactionHelper()._bCreateMode,u,true);}}};});
