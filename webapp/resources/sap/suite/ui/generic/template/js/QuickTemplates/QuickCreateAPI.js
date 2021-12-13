sap.ui.define(["sap/ui/base/ManagedObject","sap/ui/generic/app/transaction/DraftContext","sap/m/MessageToast","sap/suite/ui/generic/template/genericUtilities/FeLogger","sap/base/util/extend","sap/base/util/each"],function(M,D,a,F,e,b){"use strict";var l=new F("js.QuickTemplates.QuickCreateAPI").getLogger();var Q=M.extend("sap.suite.ui.generic.template.js.QuickTemplates.QuickCreateAPI",{metadata:{library:"sap.suite.ui.generic.template",properties:{},events:{objectCreated:{parameters:{context:{type:"sap.ui.model.Context"}}},destroyed:{parameters:{collectionItemGuid:{type:"String"}}},autofillLineItems:{parameters:{numberOfLineItems:{type:"Number"}}}}}});Q.EVENT_CONSTANTS={EventChannel:"sap.fiori.cp.quickactions.EventChannel",QUICKCREATE_LINE_ITEMS_FOUND:"LineItemsFound",QUICKCREATE_VIEW_CREATED:"QuickCreateViewCreated"};var A="items",c="participants";Q.CopilotModelName="FioriCopilotODataModel";Q._Instances={};Q.getInstance=function(C){if(!C){return undefined;}if(C.copilotEntity){return Q._Instances[C.copilotEntity.getODataKey()];}else{return Q._Instances[C];}};Q.createAPI=function(C,o,d){function g(){return d.getView().getBindingContext().getObject();}function f(){return d.getQuickCreateItem();}function h(){return o;}function j(){return C;}function k(){return sap.ui.getCore().getModel(Q.CopilotModelName);}function u(i){if(this._bDestroyed){return;}var R=this.getQuickCreateItem();if(R.draftid===i){return;}R.draftid=i;R.copilotEntity.update(R,{error:function(S){l.error(S);}});}function m(){return o.getAggregation("rootControl");}function n(){return this.oRootView;}function s(i){this.oRootView=i;this.calculateViewHeight(this.oRootView,true);}function p(){if(this.oRootView&&this.oRootView.getController()&&this.oRootView.getController().bDraftEnabled!==undefined){return this.oRootView.getController().bDraftEnabled;}if(!this.oRootView||!this.oRootView.getBindingContext()){return undefined;}var i=new D(this.getQuickCreateModel());return i.hasDraft(this.oRootView.getBindingContext());}function q(){var i=this.getComponentInstance().getModel();if(!i&&this.oRootView){i=this.oRootView.getModel();}return i;}function r(){return d.isCurrentUserCreator();}function t(){if(!this.oRootView){return undefined;}return this.oRootView.getBindingContext();}function v(){var i=this.getQuickCreateRootBindingContext();if(i&&i.getObject()){return i.getObject().__metadata.type;}return undefined;}function _(i,R,S){var T=S.numberOfLineItems;if(T<=0){return;}this.fireAutofillLineItems({numberOfLineItems:T});}function w(){this._attachToModelBindingChanges();if(!this.oRootView){var V=d.oViewUtils.findFirstViewFromControlHierarchy(this.getRootControl());if(V){this.setRootView(V);}}}function x(){if(!this._bBindingChangeAttached){var i=o.getModel();if(i){var R=i.addBinding.bind(i);var S=this;i.addBinding=function(T){R(T);T.attachEvent("change",S._onDataBindingChanged);};this._bBindingChangeAttached=true;}}}function y(){return new Promise(function(i,R){var S=this.getCopilotModel();S.read("/"+S.getKey(this.getQuickCreateItem()),{success:function(T,U){if(T.modeljson){var V=this.getQuickCreateModel();this._loadingJSON=true;if(this.isDraftEnabled()){V.oData=JSON.parse(T.modeljson);}else{var W=JSON.parse(T.modeljson);V.mChangedEntities=W.mChangedEntities;V.mChangeHandles=W.mChangeHandles;V.mDeferredRequests=W.mDeferredRequests;V.oData=W.oData;}V.updateBindings();}if(i){i();}delete this._loadingJSON;}.bind(this),error:function(T){if(R){R(T);}}});}.bind(this));}function z(){if(!this._oUpdateModelJSONTimer){this._oUpdateModelJSONTimer=setTimeout(this._updateModelJSON,2000);}}function B(){if(this._loadingJSON||this._bDestroyed||!this.isCurrentUserCreator()){return;}this._oUpdateModelJSONTimer=null;var R=this.getQuickCreateItem();var S=this.getQuickCreateModel();var T="";if(this.isDraftEnabled()){var U={};var V=Object.keys(S.mChangedEntities);var W=Object.keys(S.oData);var X={};b(W,function(i,Z){if(S.mChangedEntities[Z]){X={};e(X,S.oData[Z]);e(X,S.mChangedEntities[Z]);U[Z]=X;}else{U[Z]=S.oData[Z];}});b(V,function(i,Z){if(!U[Z]){U[Z]=S.mChangedEntities[Z];}});T=JSON.stringify(U);}else{var Y={};Y.mChangedEntities=S.mChangedEntities;Y.mChangeHandles=S.mChangeHandles;Y.mDeferredRequests=S.mDeferredRequests;Y.oData=S.oData;T=JSON.stringify(Y);}if(T===R.modeljson){return;}R.modeljson=T;R.copilotEntity.update(R,{error:function(i){l.error(i);}});}function E(){return new Promise(function(i,R){var S=this.getQuickCreateModel();if(this.oRootView&&this.oRootView.getBindingContext()){if(this.isDraftEnabled()){S.remove(this.oRootView.getBindingContext().getPath(),{success:function(){a.show("Draft has been discarded");i();},error:function(T){R(T);}});}else{S.resetChanges();i();}}else{i();}}.bind(this));}function G(V,i){if(V){d.calculateViewHeight(V,i);}}function H(i){d.setComponentContainerHeight(i);}function I(i){if(this._bDestroyed){return;}this.fireObjectCreated({context:i});}function J(){sap.ui.getCore().getEventBus().publish(Q.EVENT_CONSTANTS.EventChannel,Q.EVENT_CONSTANTS.QUICKCREATE_VIEW_CREATED,{api:this});}function K(){if(this._bDestroyed){return;}if(this._oUpdateModelJSONTimer){clearTimeout(this._oUpdateModelJSONTimer);this._oUpdateModelJSONTimer=null;}delete Q._Instances[this._InstanceKey];if(C&&!C._bIsBeingDestroyed&&!C.bIsDestroyed){C.destroy();}this.oRootView=undefined;sap.ui.getCore().getEventBus().unsubscribe(Q.EVENT_CONSTANTS.EventChannel,Q.EVENT_CONSTANTS.QUICKCREATE_LINE_ITEMS_FOUND,this._onLineItemsFound,this);this.fireDestroyed({collectionItemGuid:this._InstanceKey});M.prototype.destroy.call(this);this._bDestroyed=true;}function L(i,R){if(this.getCollectionItem()&&this.getCollectionItem().copilotEntity&&this.getCollectionItem().copilotEntity.getParentEntity()&&this.getCollectionItem().copilotEntity.getParentEntity().copilotEntity){if(i===A){return this.getCollectionItem().copilotEntity.getParentEntity().copilotEntity.getItemsPublic(R);}else if(i===c){return this.getCollectionItem().copilotEntity.getParentEntity().copilotEntity.getParticipantsPublic();}else{return new Promise(function(S,T){if(T){T("Error: "+i+" is not a valid part of a collection.");}else{S([]);}});}}return new Promise(function(S,T){if(T){T("Error: Cannot load collection "+i+". Copilot collection entity cannot be accessed");}else{S([]);}});}function N(i){return L.call(this,A,i);}function O(){return L.call(this,c);}var P=new Q();P.COLLECTION_ITEM_TYPES={};P.COLLECTION_ITEM_TYPES.ITEM_TYPE_NOTE="NOTE";P.COLLECTION_ITEM_TYPES.ITEM_TYPE_RELOBJ="RO";P.COLLECTION_ITEM_TYPES.ITEM_TYPE_SCREENSHOT="SCRS";P.COLLECTION_ITEM_TYPES.ITEM_TYPE_IMAGE="IMG";P.COLLECTION_ITEM_TYPES.ITEM_TYPE_DOCUMENT="DOC";P.COLLECTION_ITEM_TYPES=Object.freeze(P.COLLECTION_ITEM_TYPES);e(P,{getCollectionItem:g.bind(P),getQuickCreateItem:f.bind(P),updateDraftID:u.bind(P),getRootControl:m.bind(P),isDraftEnabled:p.bind(P),isCurrentUserCreator:r.bind(P),getQuickCreateRootBindingContext:t.bind(P),getQuickCreateRootEntityType:v.bind(P),_onComponentContainerAfterRendering:w.bind(P),calculateViewHeight:G.bind(P),setComponentContainerHeight:H.bind(P),getQuickCreateModel:q.bind(P),objectCreated:I.bind(P),destroy:K.bind(P),getRootView:n.bind(P),setRootView:s.bind(P),getComponentInstance:h.bind(P),getComponentContainer:j.bind(P),_onDataBindingChanged:z.bind(P),_attachToModelBindingChanges:x.bind(P),loadQuickCreateModelFromJSON:y.bind(P),_updateModelJSON:B.bind(P),getCopilotModel:k.bind(P),discardQuickCreateDraft:E.bind(P),_onLineItemsFound:_.bind(P),fireQuickCreateViewCreated:J.bind(P),getCollectionItems:N.bind(P),getCollectionParticipants:O.bind(P)});C.addEventDelegate({onAfterRendering:P._onComponentContainerAfterRendering});P._InstanceKey=P.getCollectionItem().copilotEntity.getODataKey();if(Q._Instances[P._InstanceKey]){Q._Instances[P._InstanceKey].destroy();}delete Q._Instances[P._InstanceKey];Q._Instances[P._InstanceKey]=P;sap.ui.getCore().getEventBus().subscribe(Q.EVENT_CONSTANTS.EventChannel,Q.EVENT_CONSTANTS.QUICKCREATE_LINE_ITEMS_FOUND,P._onLineItemsFound,P);o.oQuickCreateAPI=P;return o.oQuickCreateAPI;};return Q;},true);
