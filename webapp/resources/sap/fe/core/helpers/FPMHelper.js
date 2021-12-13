/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/core/CommonUtils","sap/base/util/ObjectPath"],function(C,O){"use strict";var F={actionWrapper:function(e,m,M,p){return new Promise(function(r){var s=e.getSource?e.getSource():e.oSource,v=C.getTargetView(s),b=s.getBindingContext(),E,S;if(p!==undefined){S=p.contexts||[];}else if(b!==undefined){S=[b];}else{S=[];}if(v.getControllerName()==="sap.fe.templates.ObjectPage.ObjectPageController"||v.getControllerName()==="sap.fe.templates.ListReport.ListReportController"){E=v.getController().getExtensionAPI();}if(m.startsWith("/extension/")){var t=O.get(m.replace(/\//g,".").substr(1),E);r(t[M](b,S));}else{sap.ui.require([m],function(a){r(a[M].bind(E)(b,S));});}});},validationWrapper:function(m,M,v,V,b){return new Promise(function(r){var e;if(V.getControllerName()==="sap.fe.templates.ObjectPage.ObjectPageController"||V.getControllerName()==="sap.fe.templates.ListReport.ListReportController"){e=V.getController().getExtensionAPI();}sap.ui.require([m],function(a){r(a[M].bind(e)(b,v));});});}};return F;});
