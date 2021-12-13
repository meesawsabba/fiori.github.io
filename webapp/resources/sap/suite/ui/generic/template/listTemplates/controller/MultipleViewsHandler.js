sap.ui.define(["sap/ui/base/Object","sap/suite/ui/generic/template/js/StableIdHelper","sap/suite/ui/generic/template/lib/multipleViews/MultipleViewsHandler","sap/base/util/extend","sap/suite/ui/generic/template/genericUtilities/FeError","sap/ui/generic/app/navigation/service/SelectionVariant","sap/ui/model/analytics/odata4analytics","sap/suite/ui/generic/template/genericUtilities/FeLogger","sap/base/util/each"],function(B,S,M,e,F,a,O,b,c){"use strict";var C="AnalyticalListPage.controller.MultipleViewsHandler";var l=new b("AnalyticalListPage.controller.MultipleViewsHandler").getLogger();function g(s,o,t){var G;var q;var m;var d;var D=o.getOwnerComponent().getModel();function f(){if(!G){return;}G.updateCounts();}function h(Q,T){if(!G){return;}G.onRebindContentControl(Q,T);}function r(Q,T){if(!G){return null;}return R(Q,T);}function R(Q,T){var U="";var V=new O.Model(O.Model.ReferenceByModel(D));var W=V.findQueryResultByName(Q.name);var X=new O.QueryResultRequest(W);var Y=W&&W.getParameterization();var Z=s.oSmartFilterbar&&s.oSmartFilterbar.getAnalyticalParameters();if(Z&&Z.length>0){var $=s.oSmartFilterbar&&s.oSmartFilterbar.getUiState({allFilters:false});var _=$?JSON.stringify($.getSelectionVariant()):"{}";var a1=new a(_);}if(Y){var b1;X.setParameterizationRequest(new O.ParameterizationRequest(Y));if(a1.getParameterNames){var c1=a1.getParameterNames();c1.forEach(function(e1){b1=a1.getParameter(e1);X.getParameterizationRequest().setParameterValue(e1,b1);});}else{c(a1.Parameters,function(){if(this.RecordType==="com.sap.vocabularies.UI.v1.IntervalParameter"){b1=this.PropertyValueFrom.PropertyPath.split("/");X.getParameterizationRequest().setParameterValue(b1[b1.length-1],this.PropertyValueFrom.String,this.PropertyValueTo.String);}else{b1=this.PropertyName.PropertyPath.split("/");X.getParameterizationRequest().setParameterValue(b1[b1.length-1],this.PropertyValue.String);}});}}try{U=X.getURIToQueryResultEntitySet();}catch(d1){W=X.getQueryResult();U="/"+W.getEntitySet().getQName();l.error("getEntitySetPathWithParameters","binding path with parameters failed - "+d1||d1.message);}return U;}function i(Q,T){return G?G.formatMessageStrip(Q,T):"";}function j(){if(G){var Q=G.getSelectedKey();var T=G.getContentForIappState(Q);return{state:T};}return null;}function H(Q){if(!G){return o.getOwnerComponent().getEntitySet()===Q;}return G.hasEntity(Q);}function k(Q){return G&&G.formatItemTextForMultipleView(Q);}function n(s){if(G){G.restoreFromIappState(s);L();}}function p(){return G&&G.determineSortOrder();}function u(Q,T,U){if(!G){return false;}G.refreshOperation(Q,T,U);return true;}function v(){return!!(q&&q.enableAutoBinding);}function w(){return d;}function x(){if(!G){return;}G.setActiveButtonState();}function y(){if(!G){return null;}return G.restoreActiveButtonState();}function z(Q,T,U){if(!G){return;}G.setControlVariant(Q,T,U);}function A(Q){if(!G){return;}if(Q.selectedQuickVariantSelectionKey){G.setSelectedKey(Q.selectedQuickVariantSelectionKey);}}function E(){if(!m){return null;}return m==="single"?"tableViewData":"tableTabData";}function I(){return G.getSelectedKey();}function J(Q){return G.setSelectedKey(Q);}function K(Q){var T=Q.getParameter("itemContexts")&&Q.getParameter("itemContexts")[0];t.oCommonEventHandlers.onListNavigate(Q,s,T);}function L(){if(m==="multi"){var Q=G.getSelectedKey();var T=S.getStableId({type:"ALPTable",subType:"SmartTable",sQuickVariantKey:Q});var U=S.getStableId({type:"ALPChart",subType:"SmartChart","sQuickVariantKey":Q});var V=o.byId(T);s.oSmartTable=V?V:o.byId(U);}}function N(Q){if(m==="multi"){G.refreshSiblingControls(Q);}}function P(){return G&&G.getMode();}(function(){var Q=t.oComponentUtils.getSettings();var T=Q.quickVariantSelectionX;var U=Q.quickVariantSelection;if(T&&U){throw new F(C,"Defining both QuickVariantSelection and QuickVariantSelectionX in the manifest is not allowed.");}q=T||U;if(T){d=T.enableAutoBinding;if(d===null||d===undefined){T.enableAutoBinding=true;}}if(!q){return;}var V;if(T){m="multi";var W=S.getStableId({type:"QuickVariantSelectionX",subType:"IconTabBar"});V=o.byId(W);}else{m="single";var X=S.getStableId({type:"QuickVariantSelection",subType:"SegmentedButton"});var Y=S.getStableId({type:"QuickVariantSelection",subType:"VariantSelect"});V=o.byId(X)||o.byId(Y);}var Z={manifestSettings:q,pathInTemplatePrivateModel:"/alp/multipleViews",presentationControlHandler:U&&t.oServices.oPresentationControlHandlerFactory.getPresentationControlHandler(s.oSmartTable),getPresentationControlHandler:T&&function($){var _=S.getStableId({type:"ALPTable",subType:"SmartTable","sQuickVariantKey":$});var a1=S.getStableId({type:"ALPChart",subType:"SmartChart","sQuickVariantKey":$});var b1=o.byId(_);return t.oServices.oPresentationControlHandlerFactory.getPresentationControlHandler(b1?b1:o.byId(a1));},switchingControl:V,smartFilterBar:s.oSmartFilterbar,resolveParameterizedEntitySet:R,getSearchValue:function(){return s.oSmartFilterbar.getBasicSearchValue();},appStateChange:function(){if(G){L();}},isDataToBeShown:function(){return true;},adaptRefreshRequestMode:function($){return $;},pathToActiveObjectEnabled:"/alp/activeObjectEnabled",refreshModelOnTableRefresh:true,adaptPresentationControl:L};G=new M(o,t,Z);L();})();return{onDataRequested:f,refreshOperation:u,onRebindContentControl:h,formatMessageStrip:i,getContentForIappState:j,restoreFromIappState:n,formatItemTextForMultipleView:k,getEnableAutoBinding:v,getOriginalEnableAutoBinding:w,determineSortOrder:p,setActiveButtonState:x,restoreActiveButtonState:y,setControlVariant:z,handleStartUpObject:A,onDetailsActionPress:K,getSelectedKeyPropertyName:E,getSelectedKey:I,setSelectedKey:J,hasEntitySet:H,refreshSiblingControls:N,resolveParameterizedEntitySet:r,getMode:P,resolveParameterizedEntitySetforAggregatedService:R};}return B.extend("sap.suite.ui.generic.template.AnalyticalListPage.controller.MultipleViewsHandler",{constructor:function(s,o,t){e(this,g(s,o,t));}});});
