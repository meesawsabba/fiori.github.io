/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/Control","sap/m/SearchField"],function(C,S){"use strict";var B=C.extend("sap.fe.macros.table.BasicSearch",{metadata:{interfaces:["sap.ui.mdc.IFilter"],events:{filterChanged:{conditionsBased:{type:"boolean"}},search:{conditions:{type:"object"}}},aggregations:{filter:{type:"sap.ui.core.Control",multiple:false}}},init:function(){this.setAggregation("filter",new S({placeholder:"{this.i18n>M_FILTERBAR_SEARCH}",search:function(){this.fireSearch();}.bind(this)}));},getConditions:function(){return undefined;},getSearch:function(){return this.getAggregation("filter").getValue();},validate:function(){return Promise.resolve();},renderer:{apiVersion:2,render:function(r,c){r.openStart("div",c);r.openEnd();r.renderControl(c.getAggregation("filter"));r.close("div");}}});return B;},true);
