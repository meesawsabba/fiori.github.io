/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/base/Log","sap/ui/model/json/JSONModel","./RootContainerBaseController","sap/f/FlexibleColumnLayoutSemanticHelper","sap/ui/core/Component","sap/fe/core/CommonUtils","sap/fe/core/controllerextensions/ViewState","sap/m/Link","sap/m/MessagePage","sap/m/MessageBox"],function(L,J,B,F,C,a,V,b,M,c){"use strict";var d={page:{names:["BeginColumn","MidColumn","EndColumn"],currentGetter:{prefix:"getCurrent",suffix:"Page"},getter:{prefix:"get",suffix:"Pages"}}};var _=function(o){if(o.isA("sap.ui.core.ComponentContainer")){return o.getComponentInstance().getRootControl();}else{return o;}};return B.extend("sap.fe.templates.RootContainer.controller.Fcl",{viewState:V.override({applyInitialStateOnly:function(){return false;},adaptBindingRefreshControls:function(e){this.getView().getController()._getAllVisibleViews().forEach(function(o){var p=new Promise(function(r){r(o);});e.push(p);});},adaptStateControls:function(s){this.getView().getController()._getAllVisibleViews().forEach(function(o){var p=new Promise(function(r){r(o);});s.push(p);});},onRestore:function(){var v=this.getView(),n=v.byId("appContent");var i=n.getModel("internal");var p=i.getProperty("/pages");for(var s in p){i.setProperty("/pages/"+s+"/restoreStatus","pending");}},onSuspend:function(){var f=this.getView().getController();var o=f.getFclControl();var e=o.getBeginColumnPages()||[];var m=o.getMidColumnPages()||[];var E=o.getEndColumnPages()||[];var p=[].concat(e,m,E);p.forEach(function(P){var t=_(P);var g=t&&t.getController();if(g&&g.viewState&&g.viewState.onSuspend){return g.viewState.onSuspend();}});}}),onInit:function(e){B.prototype.onInit.bind(this)();this._internalInit();},attachRouteMatchers:function(){this.getRouter().attachBeforeRouteMatched(this._getViewForNavigatedRowsComputation,this);B.prototype.attachRouteMatchers.apply(this,arguments);this._internalInit();this.getRouter().attachBeforeRouteMatched(this.onBeforeRouteMatched,this);this.getRouter().attachRouteMatched(this.onRouteMatched,this);this.getFclControl().attachStateChange(this._saveLayout,this);},_internalInit:function(){if(this._oRouterProxy){return;}this.sCurrentRouteName="";this.sCurrentArguments={};this.SQUERYKEYNAME="?query";var A=this.getAppComponent();this._oRouterProxy=A.getRouterProxy();this._oFCLConfig={maxColumnsCount:3};var r=A.getManifest()["sap.ui5"].routing;if(r&&r.config){if(r.config.flexibleColumnLayout){var f=r.config.flexibleColumnLayout;if(f.defaultTwoColumnLayoutType){this._oFCLConfig.defaultTwoColumnLayoutType=f.defaultTwoColumnLayoutType;}if(f.defaultThreeColumnLayoutType){this._oFCLConfig.defaultThreeColumnLayoutType=f.defaultThreeColumnLayoutType;}if(f.limitFCLToTwoColumns===true){this._oFCLConfig.maxColumnsCount=2;}}if(r.config.controlAggregation){this._oFCLConfig.defaultControlAggregation=r.config.controlAggregation;}}this._initializeTargetAggregation(A);this._initializeRoutesInformation(A);},getFclControl:function(){return this.getView().getContent()[0];},_saveLayout:function(e){this.sPreviousLayout=e.getParameters().layout;},_getViewForNavigatedRowsComputation:function(){var A=this._getAllVisibleViews(this.sPreviousLayout);var r=A[A.length-1];var R;var t=this;t.getRouter().attachEventOnce("routeMatched",function(e){R=_(e.getParameter("views")[e.getParameter("views").length-1]);if(r){if(R.getViewData()&&R.getViewData().viewLevel===t._oFCLConfig.maxColumnsCount){t.oAdditionalViewForNavRowsComputation=R;}if(R.getViewData()&&r.getViewData()&&r.getViewData().viewLevel<t._oFCLConfig.maxColumnsCount&&r.getViewData()&&r.getViewData().viewLevel>R.getViewData().viewLevel&&R!==r){t.oAdditionalViewForNavRowsComputation=r;}}});},getViewForNavigatedRowsComputation:function(){return this.oAdditionalViewForNavRowsComputation;},onExit:function(){this.getRouter().detachRouteMatched(this.onRouteMatched,this);this.getRouter().detachBeforeRouteMatched(this.onBeforeRouteMatched,this);this.getFclControl().detachStateChange(this.onStateChanged,this);this.getFclControl().detachAfterEndColumnNavigate(this.onStateChanged,this);this._oTargetsAggregation=null;this._oTargetsFromRoutePattern=null;B.prototype.onExit.bind(this)();},isFclEnabled:function(){return true;},displayMessagePage:function(e,p){var f=this.getFclControl();if(this._oFCLConfig&&p.FCLLevel>=this._oFCLConfig.maxColumnsCount){p.FCLLevel=this._oFCLConfig.maxColumnsCount-1;}if(!this.aMessagePages){this.aMessagePages=[null,null,null];}var m=this.aMessagePages[p.FCLLevel];if(!m){m=new M({showHeader:false,icon:"sap-icon://message-error"});this.aMessagePages[p.FCLLevel]=m;switch(p.FCLLevel){case 0:f.addBeginColumnPage(m);break;case 1:f.addMidColumnPage(m);break;default:f.addEndColumnPage(m);}}m.setText(e);if(p.technicalMessage){m.setCustomDescription(new b({text:p.description||p.technicalMessage,press:function(){c.show(p.technicalMessage,{icon:c.Icon.ERROR,title:p.title,actions:[c.Action.OK],defaultAction:c.Action.OK,details:p.technicalDetails||"",contentWidth:"60%"});}}));}else{m.setDescription(p.description||"");}f.to(m.getId());},_initializeTargetAggregation:function(A){var m=A.getManifest(),t=m["sap.ui5"].routing?m["sap.ui5"].routing.targets:null,e=this;this._oTargetsAggregation={};if(t){Object.keys(t).forEach(function(T){var o=t[T];if(o.controlAggregation){e._oTargetsAggregation[T]={aggregation:o.controlAggregation,pattern:o.contextPattern};}else{e._oTargetsAggregation[T]={aggregation:"page",pattern:null};}});}},_initializeRoutesInformation:function(A){var m=A.getManifest(),r=m["sap.ui5"].routing?m["sap.ui5"].routing.routes:null,t=this;this._oTargetsFromRoutePattern={};if(r){r.forEach(function(e){t._oTargetsFromRoutePattern[e.pattern]=e.target;});}},getCurrentArgument:function(){return this.sCurrentArguments;},getCurrentRouteName:function(){return this.sCurrentRouteName;},getConstants:function(){return d;},getTargetAggregation:function(){return this._oTargetsAggregation;},onRouteMatched:function(e){var r=e.getParameter("name");this.sCurrentRouteName=r;this.sCurrentArguments=e.getParameter("arguments");},_scrollTablesToLastNavigatedItems:function(){var v=this._getAllVisibleViews();if(v.length>1||v[0].getViewData().viewLevel<this._oFCLConfig.maxColumnsCount){var s,A=this.getViewForNavigatedRowsComputation();if(A&&v.indexOf(A)===-1){v.push(A);}for(var i=v.length-1;i>0;i--){var o=v[i],p=v[i-1];if(o.getBindingContext()){s=o.getBindingContext().getPath();p.getController()._scrollTablesToRow(s);}}}},onStateChanged:function(e){var i=e.getParameter("isNavigationArrow");if(this.sCurrentArguments!==undefined){if(!this.sCurrentArguments[this.SQUERYKEYNAME]){this.sCurrentArguments[this.SQUERYKEYNAME]={};}this.sCurrentArguments[this.SQUERYKEYNAME].layout=e.getParameter("layout");}this._forceModelContextChangeOnBreadCrumbs(e);if(i){this._oRouterProxy.navTo(this.sCurrentRouteName,this.sCurrentArguments);}},_forceModelContextChangeOnBreadCrumbs:function(e){var f=e.getSource(),p=[];p=p.concat(f.getBeginColumnPages()).concat(f.getMidColumnPages()).concat(f.getEndColumnPages());p.forEach(function(P){var v=_(P);var o=v.byId&&v.byId("breadcrumbs");if(o){o.fireModelContextChange();}});},_updateShareButtonVisibility:function(v,l){var s;switch(l){case"OneColumn":s=v==="beginColumn";break;case"MidColumnFullScreen":case"ThreeColumnsBeginExpandedEndHidden":case"ThreeColumnsMidExpandedEndHidden":case"TwoColumnsBeginExpanded":case"TwoColumnsMidExpanded":s=v==="midColumn";break;case"EndColumnFullScreen":case"ThreeColumnsEndExpanded":case"ThreeColumnsMidExpanded":s=v==="endColumn";break;default:s=false;}return s;},updateUIStateForView:function(v,e){var u=this.getHelper().getCurrentUIState(),f=["beginColumn","midColumn","endColumn"],l=this.getFclControl().getLayout(),g;if(!v.getModel("fclhelper")){v.setModel(this._createHelperModel(),"fclhelper");}if(e>=this._oFCLConfig.maxColumnsCount){g=f[this._oFCLConfig.maxColumnsCount-1];u.actionButtonsInfo.midColumn.exitFullScreen=null;u.actionButtonsInfo.midColumn.closeColumn=null;u.actionButtonsInfo.endColumn.exitFullScreen=null;u.actionButtonsInfo.endColumn.closeColumn=null;}else{g=f[e];}if(e>=this._oFCLConfig.maxColumnsCount||l==="EndColumnFullScreen"||l==="MidColumnFullScreen"||l==="OneColumn"){v.getModel("fclhelper").setProperty("/breadCrumbIsVisible",true);}else{v.getModel("fclhelper").setProperty("/breadCrumbIsVisible",false);}u.actionButtonsInfo.beginColumn={fullScreen:null,exitFullScreen:null,closeColumn:null};v.getModel("fclhelper").setProperty("/actionButtonsInfo",Object.assign({},u.actionButtonsInfo[g]));v.getModel("fclhelper").setProperty("/showShareIcon",this._updateShareButtonVisibility(g,l));},onBeforeRouteMatched:function(e){if(e){var q=e.getParameters().arguments[this.SQUERYKEYNAME];var l=q?q.layout:null;if(!l){var n=this.getHelper().getNextUIState(0);l=n.layout;}var t=e.getParameter("config").target;l=this._correctLayoutForTargets(l,t);if(l){if(!this.getFclControl().getModel("fcl")){this.getFclControl().setModel(new J(),"fcl");this.getFclControl().bindProperty("layout","fcl>/layout");}this.getFclControl().setProperty("layout",l);}}},getHelper:function(){return F.getInstanceFor(this.getFclControl(),this._oFCLConfig);},calculateLayout:function(n,h,p){if(!p){p=this.getHelper().getNextUIState(n).layout;}var r=this.getRouter().getRouteByHash(h+"?layout="+p);var t=this._oTargetsFromRoutePattern[r.getPattern()];return this._correctLayoutForTargets(p,t);},_correctLayoutForTargets:function(p,t){var e={"2":["TwoColumnsMidExpanded","TwoColumnsBeginExpanded","MidColumnFullScreen"],"3":["ThreeColumnsMidExpanded","ThreeColumnsEndExpanded","ThreeColumnsMidExpandedEndHidden","ThreeColumnsBeginExpandedEndHidden","MidColumnFullScreen","EndColumnFullScreen"]};if(t&&!Array.isArray(t)){t=[t];}if(!t){return p;}else if(t.length>1){var l=e[t.length];if(l.indexOf(p)<0){p=l[0];}}else{var T=this.getTargetAggregation()[t[0]].aggregation||this._oFCLConfig.defaultControlAggregation;switch(T){case"beginColumnPages":p="OneColumn";break;case"midColumnPages":p="MidColumnFullScreen";break;case"endColumnPages":p="EndColumnFullScreen";break;}}return p;},_getAllVisibleViews:function(l){var v=[];l=!!l?l:this.getFclControl().getLayout();switch(l){case sap.f.LayoutType.EndColumnFullScreen:if(this.getFclControl().getCurrentEndColumnPage()){v.push(_(this.getFclControl().getCurrentEndColumnPage()));}break;case sap.f.LayoutType.MidColumnFullScreen:if(this.getFclControl().getCurrentMidColumnPage()){v.push(_(this.getFclControl().getCurrentMidColumnPage()));}break;case sap.f.LayoutType.OneColumn:if(this.getFclControl().getCurrentBeginColumnPage()){v.push(_(this.getFclControl().getCurrentBeginColumnPage()));}break;case sap.f.LayoutType.ThreeColumnsEndExpanded:case sap.f.LayoutType.ThreeColumnsMidExpanded:if(this.getFclControl().getCurrentBeginColumnPage()){v.push(_(this.getFclControl().getCurrentBeginColumnPage()));}if(this.getFclControl().getCurrentMidColumnPage()){v.push(_(this.getFclControl().getCurrentMidColumnPage()));}if(this.getFclControl().getCurrentEndColumnPage()){v.push(_(this.getFclControl().getCurrentEndColumnPage()));}break;case sap.f.LayoutType.TwoColumnsBeginExpanded:case sap.f.LayoutType.TwoColumnsMidExpanded:case sap.f.LayoutType.ThreeColumnsMidExpandedEndHidden:case sap.f.LayoutType.ThreeColumnsBeginExpandedEndHidden:if(this.getFclControl().getCurrentBeginColumnPage()){v.push(_(this.getFclControl().getCurrentBeginColumnPage()));}if(this.getFclControl().getCurrentMidColumnPage()){v.push(_(this.getFclControl().getCurrentMidColumnPage()));}break;default:L.error("Unhandled switch case for "+this.getFclControl().getLayout());}return v;},onContainerReady:function(){var v=this._getAllVisibleViews();var r=[];v.reduce(function(p,t){p.push(a.restoreView(t));return p;},r);return Promise.all(r);}});},true);
