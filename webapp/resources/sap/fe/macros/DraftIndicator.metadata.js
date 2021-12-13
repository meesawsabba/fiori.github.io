/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["./MacroMetadata"],function(M){"use strict";var D=M.extend("sap.fe.macros.DraftIndicator",{name:"DraftIndicator",namespace:"sap.fe.macros",fragment:"sap.fe.macros.DraftIndicator",metadata:{stereotype:"xmlmacro",properties:{id:{type:"string"},ariaLabelledBy:{type:"string"},DraftIndicatorType:{type:"sap.ui.mdc.DraftIndicatorType",required:true,defaultValue:"IconAndText"},entitySet:{type:"sap.ui.model.Context",required:true,$kind:"EntitySet"},isDraftIndicatorVisible:{type:"boolean",required:true,defaultValue:false},indicatorType:{type:"string"},"class":{type:"string"}}}});return D;});
