/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define("sap/zen/dsh/dialogs/Condition",["sap/ui/core/Fragment","sap/ui/model/json/JSONModel","sap/zen/dsh/utils/ResourceBundle","sap/zen/dsh/utils/ResourceModel","sap/zen/commons/thirdparty/lodash"],function(F,J,R,b,_){"use strict";var d;var D;var r,f;function h(a,c){r=a;f=c;}function g(c){return c.runAsOwner(function(){return Promise.resolve(F.load({name:"sap.zen.dsh.fragment.ConditionDialog",controller:{onOk:function(){var o=D.getModel("om");D.close();o.getDataProvider(d).addCondition(D.getModel("Condition").getData()).then(function(){r(true);}).catch(function(e){f(e);});},onCancel:function(){D.close();r(false);}}}).then(function(o){D=o;D.setModel(b,"i18n");o.setModel(new J(),"Condition");var O=o.open;o.open=function(e,s){d=s;var C=o.getModel("Condition");D.setModel(e,"om");var a=_.filter(e.getDataProvider(d).Dimensions,function(i){return i.IsStructure;});o.setModel(e,"om");C.setData({measure1:a[0]&&a[0].Members.length?_.map(a[0].Members)[0].Name:"",measure2:a[1]&&a[1].Members.length?_.map(a[1].Members)[1].Name:"",Structure1:a[0]?a[0].Description:null,Structure1Key:a[0]?a[0].Name:null,Structure2Key:a[1]?a[1].Name:null,Structure2:a[1]?a[1].Description:null,Value:5,Members1:_.map(a[0]?a[0].Members:[],function(m){return{Name:m.Name,Description:m.Description};}),Members2:_.map(a[1]?a[1].Members:[],function(m){return{Name:m.Name,Description:m.Description};}),operator:"TOP_N",Description:R.getText("COND_DESCR",[_.map(e.getProperty("/dataProvider/0/Conditions")||[]).length+1])});O.call(o);return new Promise(h);};return o;}));});}return g;});
