/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/core/ExtensionAPI","sap/fe/macros/filter/FilterUtils","sap/fe/macros/chart/ChartUtils"],function(E,F,C){"use strict";var e=E.extend("sap.fe.templates.ListReport.ExtensionAPI",{refresh:function(){var f=this._controller._getFilterBarControl();return f.waitForInitialization().then(function(){f.triggerSearch();});},getSelectedContexts:function(){var c=(this._controller._isMultiMode()&&this._controller._getCurrentControl())||this._controller._getTable();if(c.isA("sap.ui.mdc.ChartNew")){var s=[];if(c&&c.get_chart()){var S=C.getChartSelectedData(c.get_chart());for(var i=0;i<S.length;i++){s.push(S[i].context);}}return s;}else{return(c&&c.getSelectedContexts())||[];}},setFilterValues:function(c,o,v){return F.setFilterValues(this._controller._getFilterBarControl(),c,o,v);},createFiltersFromFilterConditions:function(f){var o=this._controller._getFilterBarControl();return F.getFilterInfo(o,undefined,f);}});return e;});
