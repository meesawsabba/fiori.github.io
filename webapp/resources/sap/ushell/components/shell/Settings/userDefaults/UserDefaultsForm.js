// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/Control","sap/base/util/deepExtend","sap/ui/comp/smartform/SmartForm"],function(C,d,S){"use strict";var a=["sap.ui.comp.smartfield.SmartField","sap.m.Input"];var U=C.extend("sap.ushell.components.shell.Settings.userDefaults.UserDefaultsForm",{metadata:{properties:{persistencyKey:{type:"string"}},aggregations:{_smartForm:{type:"sap.ui.comp.smartform.SmartForm",multiple:false,visibility:"hidden"}},events:{}},renderer:function(r,c){r.openStart("div",c);r.openEnd();r.renderControl(c.getAggregation("_smartForm"));r.close("div");}});U.prototype.init=function(){this.setAggregation("_smartForm",new S({editable:true}).addStyleClass("sapUshellShellDefaultValuesForm"));};U.prototype.fetchVariant=function(){var m=this.getAggregation("_smartForm").getModel("MdlParameter"),i,A;return this._getFieldControls().reduce(function(r,b){i=b.getName();r[i]={value:b.getValue()};A=m.getProperty("/"+i+"/valueObject/extendedValue/");if(A){r[i].additionalValues=A;}return r;},{});};U.prototype.applyVariant=function(v){if(v){var m=this.getAggregation("_smartForm").getModel("MdlParameter"),u=this._getFieldControls(),I,V;for(var i=0;i<u.length;i++){I=u[i].getName();if(v[I]!==undefined){u[i].setValue(v[I].value);V=m.getProperty("/"+I+"/valueObject/");V.extendedValue=null;if(v[I].additionalValues){V=d(V,{extendedValue:v[I].additionalValues});}m.setProperty("/"+I+"/valueObject",V);}}}};U.prototype._getFieldControls=function(){return this.getControlsByFieldGroupId("UserDefaults").filter(function(f){var F=f.getMetadata().getName();return a.indexOf(F)!==-1;});};U.prototype.addGroup=function(g){this.getAggregation("_smartForm").addGroup(g);};U.prototype.getGroups=function(){return this.getAggregation("_smartForm").getGroups();};U.prototype.removeGroup=function(i){this.getAggregation("_smartForm").removeGroup(i);};U.prototype.removeAllGroups=function(){this.getAggregation("_smartForm").removeAllGroups();};return U;});
