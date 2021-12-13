/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/editor/fields/BaseField","sap/m/Input","sap/m/Text","sap/m/MultiComboBox","sap/ui/core/ListItem","sap/base/util/each","sap/base/util/restricted/_debounce","sap/base/util/restricted/_isEqual","sap/base/util/ObjectPath","sap/base/util/includes","sap/ui/core/SeparatorItem","sap/ui/core/Core","sap/ui/model/Sorter","sap/base/util/deepClone"],function(B,I,T,M,L,e,_,b,O,i,S,C,c,d){"use strict";var D="#";var r=C.getLibraryResourceBundle("sap.ui.integration");var f=B.extend("sap.ui.integration.editor.fields.ListField",{metadata:{library:"sap.ui.integration"},renderer:B.getMetadata().getRenderer()});f.prototype.initVisualization=function(o){if(r&&r.sLocale!==C.getConfiguration().getLanguage()){r=C.getLibraryResourceBundle("sap.ui.integration");}var t=this;var v=o.visualization;if(!v){if(o.values){var g=this.formatListItem(o.values.item);v={type:M,settings:{selectedKeys:{path:'currentSettings>value'},busy:{path:'currentSettings>_loading'},editable:o.editable,visible:o.visible,showSecondaryValues:true,width:"100%",items:{path:"",template:g,sorter:[new c({path:'Selected',descending:false,group:true})],groupHeaderFactory:t.getGroupHeader}}};if(this.isFilterBackend()){v.settings.selectedKeys={parts:['currentSettings>value','currentSettings>suggestValue'],formatter:function(V,s){if(s){t.setSuggestValue();}return V;}};}}else{v={type:I,settings:{value:{path:'currentSettings>value',formatter:function(a){a=a||[];return a.join(",");}},change:function(E){var s=E.getSource();s.getBinding("value").setRawValue(s.getValue().split(","));},editable:o.editable,visible:o.visible,placeholder:o.placeholder}};}}this._visualization=v;this.attachAfterInit(this._afterInit);};f.prototype._afterInit=function(){var o=this.getAggregation("_field");if(o instanceof M){var a=this.getConfiguration();this.prepareFieldsInKey(a);o.onAfterOpen=this.onAfterOpen;if(this.isFilterBackend()){this.onInput=_(this.onInput,500);o.oninput=this.onInput;o.attachSelectionChange(this.onSelectionChangeForFilterBackend);o.attachSelectionFinish(this.onSelectionFinish);var m=this.getModel();m.attachPropertyChange(this.onPropertyChange,this);}else{o.attachSelectionChange(this.onSelectionChange);}}};f.prototype.prepareFieldsInKey=function(o){this._sKeySeparator=o.values.keySeparator;if(!this._sKeySeparator){this._sKeySeparator=D;}var k=o.values.item.key;this._aFields=k.split(this._sKeySeparator);for(var n in this._aFields){if(this._aFields[n].startsWith("{")){this._aFields[n]=this._aFields[n].substring(1);}if(this._aFields[n].endsWith("}")){this._aFields[n]=this._aFields[n].substring(0,this._aFields[n].length-1);}}};f.prototype.getKeyFromItem=function(o){var s="";this._aFields.forEach(function(a){s+=o[a].toString()+this._sKeySeparator;}.bind(this));if(s.endsWith(this._sKeySeparator)){s=s.substring(0,s.length-this._sKeySeparator.length);}return s;};f.prototype.onPropertyChange=function(E){var o=this.getConfiguration();if(!o.valueItems){o.valueItems=[];}var p=o.values.data.path||"/";var v=this.getModel();var a=v.getData();if(p!=="/"){if(p.startsWith("/")){p=p.substring(1);}if(p.endsWith("/")){p=p.substring(0,p.length-1);}var P=p.split("/");var R=O.get(P,a);R=this.mergeSelectedItems(o,R);O.set(P,R,a);}else{a=this.mergeSelectedItems(o,a);}v.setData(a);this.setSuggestValue();};f.prototype.mergeSelectedItems=function(o,a){if(Array.isArray(a)){var s=o.valueItems.map(function(l){return this.getKeyFromItem(l);}.bind(this));var g=a.filter(function(l){var m=this.getKeyFromItem(l);return!i(s,m);}.bind(this));var h=g.filter(function(l){return l.Selected===r.getText("EDITOR_ITEM_SELECTED");});o.valueItems=o.valueItems.concat(h);var n=g.filter(function(l){return l.Selected!==r.getText("EDITOR_ITEM_SELECTED");});a=o.valueItems.concat(n);var j=this.getAggregation("_field");if(j.isOpen()){s=o.valueItems.map(function(l){return this.getKeyFromItem(l);}.bind(this));var k=j.getSelectedKeys();if(!b(s,k)){j.setSelectedKeys(s);}}}else{a=o.valueItems;}return a;};f.prototype.setSuggestValue=function(){var o=this.getAggregation("_field");var s=this.getBindingContext("currentSettings").sPath;var a=this.getModel("currentSettings");var g=a.getProperty(s+"/suggestValue");if(g&&g!==""){o.setValue(g.replaceAll("\'\'","'"));}};f.prototype.getSuggestValue=function(){var s=this.getBindingContext("currentSettings").sPath;var o=this.getModel("currentSettings");return o.getProperty(s+"/suggestValue");};f.prototype.getGroupHeader=function(g){return new S({text:g.key});};f.prototype.onSelectionChangeForFilterBackend=function(E){var F=E.oSource.getParent();var o=F.getConfiguration();var l=E.getParameter("changedItem");var s=l.getKey();var a=E.getParameter("selected");var g=this.getModel().getData();var p=o.values.data.path||"/";var P,h;if(p!=="/"){if(p.startsWith("/")){p=p.substring(1);}if(p.endsWith("/")){p=p.substring(0,p.length-1);}P=p.split("/");h=O.get(P,g);}else{h=g;}if(h){if(!o.valueItems){o.valueItems=[];}var n=[];h.forEach(function(j){var N=d(j,500);var k=F.getKeyFromItem(N);if(k===s){if(a){N.Selected=r.getText("EDITOR_ITEM_SELECTED");o.valueItems=o.valueItems.concat([N]);}else{N.Selected=r.getText("EDITOR_ITEM_UNSELECTED");o.valueItems=o.valueItems.filter(function(m){var k=F.getKeyFromItem(m);return k!==s;});}}n.push(N);});if(P!==undefined){O.set(P,n,g);this.getModel().checkUpdate(true);}else{this.getModel().setData(n);}}};f.prototype.onSelectionChange=function(E){var F=E.oSource.getParent();var o=F.getConfiguration();var l=E.getParameter("changedItem");var s=l.getKey();var a=E.getParameter("selected");var g=this.getModel().getData();var p=o.values.data.path||"/";if(p!=="/"){if(p.startsWith("/")){p=p.substring(1);}if(p.endsWith("/")){p=p.substring(0,p.length-1);}var P=p.split("/");var R=O.get(P,g);if(Array.isArray(R)){for(var n in R){var h=F.getKeyFromItem(R[n]);if(h===s){if(a){R[n].Selected=r.getText("EDITOR_ITEM_SELECTED");}else{R[n].Selected=r.getText("EDITOR_ITEM_UNSELECTED");}}}O.set(P,R,g);}}else if(Array.isArray(g)){for(var n in g){var h=F.getKeyFromItem(g[n]);if(h===s){if(a){g[n].Selected=r.getText("EDITOR_ITEM_SELECTED");}else{g[n].Selected=r.getText("EDITOR_ITEM_UNSELECTED");}}}}this.getModel().setData(g);this.getModel().checkUpdate(true);};f.prototype.onSelectionFinish=function(E){var F=this.getParent();var o=F.getConfiguration();var s=E.getParameter("selectedItems").map(function(k){return k.getKey();});var a=this.getModel().getData();var p=o.values.data.path||"/";if(p!=="/"){if(p.startsWith("/")){p=p.substring(1);}if(p.endsWith("/")){p=p.substring(0,p.length-1);}var P=p.split("/");a=O.get(P,a);}if(a){o.valueItems=a.filter(function(k){var l=F.getKeyFromItem(k);return i(s,l);});}var g=this.getBindingContext("currentSettings").sPath;var h=this.getModel("currentSettings");h.setProperty(g+"/value",s);var j=F.getSuggestValue();if(j&&j!==""){h.setProperty(g+"/suggestValue","");}};f.prototype.onInput=function(E){var t=E.target.value;var s=this.getBindingContext("currentSettings").sPath;var o=this.getModel("currentSettings");o.setProperty(s+"/suggestValue",t.replaceAll("'","\'\'"));o.setProperty(s+"/_loading",true);E.srcControl.open();E.srcControl._getSuggestionsPopover()._sTypedInValue=t;};f.prototype.onAfterOpen=function(){M.prototype.onAfterOpen.apply(this,arguments);var p=this.getPicker();if(p._oCalcedPos==="Bottom"&&!p.hasStyleClass("sapUiIntegrationEditorPopupHeight")){p.addStyleClass("sapUiIntegrationEditorPopupHeight");}else if(p._oCalcedPos!=="Bottom"&&p.hasStyleClass("sapUiIntegrationEditorPopupHeight")){p.removeStyleClass("sapUiIntegrationEditorPopupHeight");}};return f;});
