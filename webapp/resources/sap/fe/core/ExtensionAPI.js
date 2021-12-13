/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/base/Object","sap/fe/core/CommonUtils","sap/base/Log","sap/ui/core/Component","sap/ui/model/json/JSONModel"],function(B,C,L,a,J){"use strict";var e=B.extend("sap.fe.core.ExtensionAPI",{metadata:{associations:{editFlow:{type:"sap.fe.core.controllerextensions.EditFlow",multiple:false},routing:{type:"sap.fe.core.controllerextensions.Routing",multiple:false}}},constructor:function(c,i){this._controller=c;this._view=c.getView();this.extension=this._controller.extension;this.editFlow=this._controller.editFlow;this.routing=this._controller.routing;this._routing=this._controller._routing;this.intentBasedNavigation._controller=this._controller;this._prefix=i;},destroy:function(){delete this._controller;delete this._view;delete this.editFlow._controller;delete this.intentBasedNavigation._controller;},byId:function(i){var c=this._view.byId(i);if(!c&&this._prefix){c=this._view.byId(this._prefix+"--"+i);}if(c){return c;}},getModel:function(m){var A;if(m&&m!=="ui"){A=C.getAppComponent(this._view);if(!A.getManifestEntry("sap.ui5").models[m]){return null;}}return this._view.getModel(m);},addDependent:function(c){this._view.addDependent(c);},removeDependent:function(c){this._view.removeDependent(c);},navigateToTarget:function(t,c){this._controller._routing.navigateToTarget(c,t);},loadFragment:function(s){var t=this;var T=a.getOwnerComponentFor(this._view);var p=this._view.getModel("_pageModel");var m=this.getModel().getMetaModel();var v=T.getViewData();var V=new J(v),P={bindingContexts:{"contextPath":m.createBindingContext(s.contextPath||"/"+T.getEntitySet()),converterContext:p.createBindingContext("/",null,{noResolve:true}),viewData:v?V.createBindingContext("/"):null},models:{"contextPath":m,converterContext:p,metaModel:m,viewData:V},appComponent:C.getAppComponent(this._view)};var o=C.templateControlFragment(s.name,P,{controller:s.controller||this,isXML:false,id:s.id});o.then(function(f){if(s.initialBindingContext!==undefined){f.setBindingContext(s.initialBindingContext);}t.addDependent(f);}).catch(function(E){L.error(E);});return o;},updateAppState:function(){return this._controller.getAppComponent().getAppStateHandler().createAppState();},intentBasedNavigation:{navigateOutbound:function(o,n){var i=this._controller.getView().getBindingContext("internal");i.setProperty("externalNavigationContext",{"page":false});this._controller._intentBasedNavigation.navigateOutbound(o,n);}}});return e;});
