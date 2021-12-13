/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../i18n","sap/m/Select","sap/m/SelectType","sap/ui/core/Item","sap/ui/model/BindingMode"],function(i,S,a,I,B){"use strict";return S.extend("sap.esh.search.ui.controls.SearchSelect",{constructor:function(s,o){o=jQuery.extend({},{visible:"{/businessObjSearchEnabled}",autoAdjustWidth:true,items:{path:"/dataSources",template:new I({key:"{id}",text:"{labelPlural}",}),},selectedKey:{path:"/uiFilter/dataSource/id",mode:B.OneWay,},tooltip:i.getText("searchIn")+" {/uiFilter/dataSource/labelPlural}",change:function(){var b=this.getSelectedItem();var c=b.getBindingContext();var d=c.getObject();this.getModel().setDataSource(d,false);this.getModel().abortSuggestions();this.getModel().eventLogger.logEvent({type:this.getModel().eventLogger.DROPDOWN_SELECT_DS,dataSourceId:d.id,});},enabled:{parts:[{path:"/initializingObjSearch",},],formatter:function(b){return!b;},},},o);S.prototype.constructor.apply(this,[s,o]);this.addStyleClass("searchSelect");},renderer:"sap.m.SelectRenderer",setDisplayMode:function(m){switch(m){case"icon":this.setType(a.IconOnly);this.setIcon("sap-icon://slim-arrow-down");break;case"default":this.setType(a.Default);break;default:break;}},});});
