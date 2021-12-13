/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/core/CommonUtils","sap/fe/navigation/SelectionVariant"],function(C,S){"use strict";return{adaptNavigationContext:function(s,t){var v=this.getView(),c=v.getController(),i=this.getView().getBindingContext("internal"),e=i.getProperty("externalNavigationContext");var a=C.getAppComponent(v);var m=a.getModel().getMetaModel();if(e.page){var p=v.getBindingContext(),M=m.getMetaPath(p.getPath());var P=c._intentBasedNavigation.removeSensitiveData(p.getObject(),M),o=c._intentBasedNavigation.prepareContextForExternalNavigation(P,p),b=o.propertiesWithoutConflict,d=C.addPageContextToSelectionVariant(new S(),o.semanticAttributes,v),f=t.propertiesWithoutConflict;var g=d.getSelectOptionsPropertyNames();g.forEach(function(h){if(!s.getSelectOption(h)){s.massAddSelectOption(h,d.getSelectOption(h));}else{if(f&&h in f){s.massAddSelectOption(f[h],s.getSelectOption(h));}if(h in b){s.massAddSelectOption(b[h],d.getSelectOption(h));}}});delete t.propertiesWithoutConflict;}i.setProperty("externalNavigationContext",{"page":true});}};});
