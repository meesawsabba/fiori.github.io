/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../i18n","sap/m/ToggleButton","sap/ui/model/BindingMode"],function(i,T,B){"use strict";return sap.ui.core.Control.extend("sap.esh.search.ui.controls.SearchMultiSelectionControl",{metadata:{properties:{resultList:"object",},aggregations:{actions:"object",},},renderer:function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapUshellSearchResultList-MultiSelectionControl");r.writeClasses();r.write(">");c._renderer(r);r.write("</div>");},_renderer:function(r){var t=this;var e=new T({icon:"sap-icon://multi-select",tooltip:i.getText("toggleSelectionModeBtn"),press:function(){if(this.getPressed()){t.getResultList.enableSelectionMode();t.getModel().setProperty("/multiSelectionEnabled",true);}else{t.getResultList.disableSelectionMode();t.getModel().setProperty("/multiSelectionEnabled",false);}},visible:false,pressed:{parts:[{path:"/multiSelectionEnabled",},],formatter:function(l){return l>0;},mode:B.OneWay,},});e.setModel(t.getModel());e.addStyleClass("sapUshellSearchResultList-toggleMultiSelectionButton");r.renderControl(e);},});});
