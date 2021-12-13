/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["./MacroMetadata"],function(M){"use strict";var F=M.extend("sap.fe.macros.FormContainer",{name:"FormContainer",namespace:"sap.fe.macros",fragment:"sap.fe.macros.FormContainer",metadata:{stereotype:"xmlmacro",designtime:"sap/fe/macros/FormContainer.designtime",properties:{id:{type:"string"},entitySet:{type:"sap.ui.model.Context",required:true,$kind:["EntitySet","NavigationProperty"]},dataFieldCollection:{type:"sap.ui.model.Context"},displayMode:{type:"boolean"},title:{type:"string"},navigationPath:{type:"string"},visible:{type:"string"},designtimeSettings:{type:"string",defaultValue:"sap/fe/macros/FormContainer.designtime"},actions:{type:"sap.ui.model.Context"}},events:{onChange:{type:"function"}}}});return F;});
