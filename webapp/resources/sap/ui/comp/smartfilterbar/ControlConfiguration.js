/*
 * ! SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */
sap.ui.define(['sap/ui/comp/library','sap/ui/core/Element'],function(l,E){"use strict";var C=E.extend("sap.ui.comp.smartfilterbar.ControlConfiguration",{metadata:{library:"sap.ui.comp",properties:{key:{type:"string",group:"Misc",defaultValue:null},groupId:{type:"string",group:"Misc",defaultValue:null},label:{type:"string",group:"Misc",defaultValue:null},visible:{type:"boolean",group:"Misc",defaultValue:true},hasValueHelpDialog:{type:"boolean",group:"Misc",defaultValue:true},controlType:{type:"sap.ui.comp.smartfilterbar.ControlType",group:"Misc",defaultValue:'auto'},filterType:{type:"sap.ui.comp.smartfilterbar.FilterType",group:"Misc",defaultValue:'auto'},index:{type:"int",group:"Misc",defaultValue:-1},hasTypeAhead:{type:"boolean",group:"Misc",defaultValue:true},mandatory:{type:"sap.ui.comp.smartfilterbar.MandatoryType",group:"Misc",defaultValue:'auto'},width:{type:"string",group:"Misc",defaultValue:null},visibleInAdvancedArea:{type:"boolean",group:"Misc",defaultValue:false},preventInitialDataFetchInValueHelpDialog:{type:"boolean",group:"Misc",defaultValue:false},displayBehaviour:{type:"sap.ui.comp.smartfilterbar.DisplayBehaviour",group:"Misc",defaultValue:'auto'},conditionType:{type:"any",group:"Misc",defaultValue:null},historyEnabled:{type:"boolean",group:"Misc",defaultValue:true}},aggregations:{defaultFilterValues:{type:"sap.ui.comp.smartfilterbar.SelectOption",multiple:true,singularName:"defaultFilterValue"},customControl:{type:"sap.ui.core.Control",multiple:false}},events:{change:{parameters:{propertyName:{type:"string"}}}}}});C.prototype.setVisible=function(i){this.setProperty("visible",i);this.fireChange({propertyName:"visible"});return this;};C.prototype.setLabel=function(L){this.setProperty("label",L);this.fireChange({propertyName:"label"});return this;};C.prototype.setVisibleInAdvancedArea=function(v){this.setProperty("visibleInAdvancedArea",v);this.fireChange({propertyName:"visibleInAdvancedArea"});return this;};C.FILTERTYPE=l.smartfilterbar.FilterType;C.CONTROLTYPE=l.smartfilterbar.ControlType;C.MANDATORY=l.smartfilterbar.MandatoryType;C.DISPLAYBEHAVIOUR=l.smartfilterbar.DisplayBehaviour;return C;});
