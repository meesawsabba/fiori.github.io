/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/macros/chart/ChartUtils","sap/fe/macros/table/Utils","sap/ui/model/Filter","sap/fe/macros/DelegateUtil","sap/base/util/deepClone"],function(C,T,F,D,d){"use strict";function _(t){var v=sap.ui.fl.Utils.getViewForControl(t);var c=v.getContent()[0].data("singleChartId");return v.byId(c);}var A={_internalUpdateBindingInfo:function(t,m,b){var f,o;var c={},a={};var e,g;Object.assign(b,d(D.getCustomData(t,"rowsBindingInfo")));if(t.getRowBinding()){b.suspended=false;}var M=_(t);var h=C.getChartSelectionsExist(M,t);a=T.getAllFilterInfo(t);e=a&&a.filters;f=a;if(h){c=C.getAllFilterInfo(M);g=c&&c.filters;f=c;}var i=e&&g?e.concat(g):g||e;o=new F({filters:i,and:true});if(f.bindingPath){b.path=f.bindingPath;}T.updateBindingInfo(b,f,o);},_getDelegateParentClass:function(){return undefined;},rebindTable:function(t,b){var i=t.getBindingContext("pageInternal");var s=i.getProperty(i.getPath()+"/alpContentView");if(s!=="Chart"){this._getDelegateParentClass().rebindTable(t,b);}}};return A;},false);
