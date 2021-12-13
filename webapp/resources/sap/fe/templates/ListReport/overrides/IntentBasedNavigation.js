/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/core/CommonUtils"],function(C){"use strict";return{adaptNavigationContext:function(s,t){if(!s.isEmpty()){var v=this.getView(),V=v.getViewData(),c=v.getController(),r=V.fullContextPath+V.entitySet;var f=Object.assign({},this.base.getView().getController().filterBarConditions);var p=[];if(V.contextPath){var m=v.getModel().getMetaModel(),P=C.getParameterInfo(m,V.contextPath),o=P.parameterProperties;p=(o&&Object.keys(o))||[];}f=c._intentBasedNavigation.prepareFiltersForExternalNavigation(f,r,p);var i=v.getBindingContext("internal");var T=i.getProperty("tabs");if(T){var I=T.ignoredFields[T.selected];if(Array.isArray(I)&&I.length>0){I.forEach(function(a){delete f.filterConditions[a];});}}C.addExternalStateFiltersToSelectionVariant(s,f,t);delete t.propertiesWithoutConflict;}},getEntitySet:function(){return this.base.getCurrentEntitySet();}};});
