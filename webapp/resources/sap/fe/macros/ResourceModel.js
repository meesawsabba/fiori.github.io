/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/model/resource/ResourceModel"],function(R){"use strict";var r=new R({bundleName:"sap.fe.macros.messagebundle",async:true}),o=sap.ui.getCore().getLibraryResourceBundle("sap.fe.macros"),a;return{getModel:function(){return r;},getText:function(t,p,e){var s=t;var b;if(a){if(e){s=t+"|"+e;}b=a.getText(s,p,true);return b?b:o.getText(t,p);}return o.getText(t,p);},setApplicationI18nBundle:function(A){a=A;}};},true);
