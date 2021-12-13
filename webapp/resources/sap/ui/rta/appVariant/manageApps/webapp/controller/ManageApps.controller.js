/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/fl/Layer","sap/ui/fl/Utils","sap/ui/rta/appVariant/manageApps/webapp/model/models","sap/ui/rta/appVariant/AppVariantUtils","sap/ui/rta/appVariant/Utils","sap/m/MessageBox","sap/ui/rta/Utils","sap/ui/rta/appVariant/Feature","sap/ui/rta/RuntimeAuthoring","sap/ui/core/BusyIndicator","sap/base/i18n/ResourceBundle","sap/m/MessageToast"],function(C,L,F,M,A,a,b,R,c,d,B,e,f){"use strict";var _;var g;var h;var i;var m;var I;return C.extend("sap.ui.rta.appVariant.manageApps.webapp.controller.ManageApps",{onInit:function(){_=this.getOwnerComponent().getIdRunningApp();g=this.getOwnerComponent().getIsOverviewForKeyUser();h=this.getOwnerComponent().getLayer();var u=F.getUshellContainer();if(!I){this._createResourceBundle();}B.show();return Promise.resolve().then(function(){if(u){return u.getServiceAsync("CrossApplicationNavigation").then(function(o){i=o;});}return undefined;}).then(a.getAppVariantOverview.bind(a,_,g)).then(function(j){B.hide();if(j.length){return this._arrangeOverviewDataAndBindToModel(j).then(function(j){return this._highlightNewCreatedAppVariant(j);}.bind(this));}A.closeOverviewDialog();return this._showMessageWhenNoAppVariantsExist();}.bind(this)).catch(function(E){A.closeOverviewDialog();var o=A.buildErrorInfo("MSG_MANAGE_APPS_FAILED",E);o.overviewDialog=true;B.hide();return A.showRelevantDialog(o,false);});},_createResourceBundle:function(){m=sap.ui.require.toUrl("sap/ui/rta/appVariant/manageApps/")+"webapp";I=e.create({url:m+"/i18n/i18n.properties"});},_showMessageWhenNoAppVariantsExist:function(){return R.showMessageBox(b.Icon.INFORMATION,"MSG_APP_VARIANT_OVERVIEW_SAP_DEVELOPER",{titleKey:"TITLE_APP_VARIANT_OVERVIEW_SAP_DEVELOPER"});},_highlightNewCreatedAppVariant:function(j){var t=this.byId("Table1");t.focus();j.forEach(function(o,k){if(o.currentStatus===I.getText("MAA_NEW_APP_VARIANT")||o.currentStatus===I.getText("MAA_OPERATION_IN_PROGRESS")){if(t.getItems().length>=k){t.getItems()[k].focus();}}});return Promise.resolve();},_arrangeOverviewDataAndBindToModel:function(j){var k=j.filter(function(q){return q.appId===_;});var o=k[0];if(o&&o.appVarStatus!=="R"){o.currentStatus=I.getText("MAA_CURRENTLY_ADAPTING");}j=j.filter(function(q){return q.appId!==_;});j.unshift(o);var r=j.filter(function(q){return q.isOriginal;});var l=r[0];j=j.filter(function(q){return!q.isOriginal;});j.unshift(l);var n={appVariants:j};var p=M.createModel(n);this.getView().setModel(p);return Promise.resolve(j);},formatRowHighlight:function(v){if(v===I.getText("MAA_CURRENTLY_ADAPTING")){return"Success";}else if(v===I.getText("MAA_NEW_APP_VARIANT")){return"Information";}else if(v===I.getText("MAA_OPERATION_IN_PROGRESS")){return"Warning";}return"None";},formatDelButtonTooltip:function(D,j){if(!I){this._createResourceBundle();}if(!D&&!j){return I.getText("TOOLTIP_DELETE_APP_VAR");}return undefined;},formatAdaptUIButtonTooltip:function(j,s){if(!I){this._createResourceBundle();}if(!j){switch(s){case'R':return I.getText("TOOLTIP_ADAPTUI_STATUS_RUNNING");case'U':return I.getText("TOOLTIP_ADAPTUI_STATUS_UNPBLSHD_ERROR");case'E':return I.getText("TOOLTIP_ADAPTUI_STATUS_UNPBLSHD_ERROR");case'P':return I.getText("TOOLTIP_ADAPTUI_STATUS_PUBLISHED");case undefined:return I.getText("TOOLTIP_ADAPTUI_ON_PREMISE");default:}}},formatAdaptUIButtonVisibility:function(v,k){return v&&k;},getModelProperty:function(s,j){return this.getView().getModel().getProperty(s,j);},onMenuAction:function(E){var o=E.getParameter("item");var s="";while(o instanceof sap.m.MenuItem){s=o.getText()+" > "+s;o=o.getParent();}s=s.substr(0,s.lastIndexOf(" > "));if(!I){this._createResourceBundle();}if(s===I.getText("MAA_DIALOG_ADAPT_UI")){return this.handleUiAdaptation(E);}else if(s===I.getText("MAA_DIALOG_COPY_ID")){return this.copyId(E);}else if(s===I.getText("MAA_DIALOG_DELETE_APPVAR")){return this.deleteAppVariant(E);}else if(s===I.getText("MAA_DIALOG_SAVE_AS_APP")){return this.saveAsAppVariant(E);}return undefined;},handleUiAdaptation:function(E){var s=this.getModelProperty("semanticObject",E.getSource().getBindingContext());var j=this.getModelProperty("action",E.getSource().getBindingContext());var p=this.getModelProperty("params",E.getSource().getBindingContext());var n;if(s&&j&&p){n={target:{semanticObject:s,action:j},params:p,writeHistory:false};d.enableRestart(L.CUSTOMER);if(i){i.toExternal(n);}A.closeOverviewDialog();return true;}return false;},saveAsAppVariant:function(E){A.closeOverviewDialog();var D=this.getModelProperty("descriptorUrl",E.getSource().getBindingContext());B.show();return a.getDescriptor({appVarUrl:D,layer:h}).then(function(o){B.hide();return c.onSaveAs(false,false,h,o);});},copyId:function(E){var s=this.getModelProperty("appId",E.getSource().getBindingContext());A.copyId(s);f.show(I.getText("MAA_COPY_ID_SUCCESS"));},deleteAppVariant:function(E){var o={};if(!I){this._createResourceBundle();}var s=I.getText("MSG_APP_VARIANT_DELETE_CONFIRMATION");o.text=s;o.deleteAppVariant=true;var j=this.getModelProperty("appId",E.getSource().getBindingContext());var k=this.getModelProperty("currentStatus",E.getSource().getBindingContext());var l=k===I.getText("MAA_CURRENTLY_ADAPTING");return A.showRelevantDialog(o).then(function(){return c.onDeleteFromOverviewDialog(j,l,h);}).catch(function(){return true;});}});});
