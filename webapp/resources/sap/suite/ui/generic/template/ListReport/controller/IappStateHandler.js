sap.ui.define(["sap/ui/base/Object","sap/ui/core/mvc/ControllerExtension","sap/ui/generic/app/navigation/service/NavError","sap/suite/ui/generic/template/listTemplates/listUtils","sap/ui/generic/app/navigation/service/SelectionVariant","sap/ui/comp/state/UIState","sap/suite/ui/generic/template/genericUtilities/FeLogger","sap/base/util/deepEqual","sap/base/util/extend","sap/base/util/isEmptyObject","sap/suite/ui/generic/template/genericUtilities/FeError","sap/ui/Device","sap/suite/ui/generic/template/listTemplates/semanticDateRangeTypeHelper","sap/suite/ui/generic/template/ListReport/controller/LegacyStateHandler","sap/suite/ui/generic/template/genericUtilities/testableHelper","sap/suite/ui/generic/template/js/StableIdHelper"],function(B,C,N,l,S,U,F,d,e,a,b,D,s,L,t,c){"use strict";var f="ListReport.controller.IappStateHandler";var o=new F(f);var g=o.getLogger();var h=o.Level;var j="sap.suite.ui.generic.template.customData",k="sap.suite.ui.generic.template.extensionData",m="sap.suite.ui.generic.template.genericData";function n(M,v){if(sap.ui.support){var i=g.getLevel();if(i<h.INFO){g.setLevel(h.INFO);}}var q;if(typeof v==="string"){q=v;}else{q="";var r="";for(var K in v){q=q+r+K+": "+v[K];r="; ";}}g.info(M,q,"sap.suite.ui.generic.template.ListReport.controller.IappStateHandler");}function p(q,r,T){var u=new L(r);var v;var w=new Promise(function(i){v=i;});var x=r.byId(c.getStableId({type:"ListReportPage",subType:"DynamicPage"}));var y=T.oCommonUtils.getControlStateWrapper(x);var z=q.oSmartFilterbar.getSmartVariant();var A=T.oCommonUtils.getControlStateWrapper(z,{oSFB:q.oSmartFilterbar});var E=T.oCommonUtils.getControlStateWrapper(r.byId(c.getStableId({type:"ListReportTable",subType:"SmartTable"})));var G=T.oCommonUtils.getControlStateWrapper(r.byId(c.getStableId({type:"ListReportAction",subType:"SearchField"})));y.attachStateChanged(function(){c1(P());});A.attachStateChanged(function(){c1(P());});E.attachStateChanged(function(){c1(P());});G.attachStateChanged(function(){c1(P());});var H=T.oServices.oApplication.getNavigationHandler();var I=r.getOwnerComponent().getSmartVariantManagement();var J=false;var K=T.oComponentUtils.getSettings();q.oSmartFilterbar.setSuppressSelection(true);var M=true;var O=(function(){var i;return function(){i=i||q.oSmartFilterbar.getNonVisibleCustomFilterNames();return i;};})();function P(){var i=T.oComponentUtils.getTemplatePrivateModel();return i.getProperty("/generic/bDataAreShownInTable");}function Q(){if(q.oWorklistData.bWorkListEnabled){var i={getSource:function(){return q.oWorklistData.oSearchField;},getId:Function.prototype};q.oWorklistHandler.performWorklistSearch(i);}else{q.oSmartFilterbar.search();}}function R(){var I1={};var J1=[];var K1=O();for(var i=0;i<K1.length;i++){var L1=K1[i];if(q.oSmartFilterbar.isVisibleInFilterBarByName(L1)){J1.push(L1);}}var M1={suppressDataSelection:!P(),visibleCustomFields:J1};I1[m]=M1;if(T.oComponentUtils.isDraftEnabled()){var N1=T.oComponentUtils.getTemplatePrivateModel();M1.editStateFilter=N1.getProperty("/listReport/vDraftState");var O1=N1.getProperty("/listReport/activeObjectEnabled");M1.activeStateFilter=O1;}var P1=q.oMultipleViewsHandler.getSelectedKeyPropertyName();if(P1){var Q1=q.oMultipleViewsHandler.getContentForIappState();if(Q1){M1[P1]=Q1.state;}}var R1={};I1[j]=R1;r.getCustomAppStateDataExtension(R1);var S1;var T1=true;var U1=function(V1,W1){if(!(V1 instanceof C)){throw new b(f,"State must always be set with respect to a ControllerExtension");}if(!T1){throw new b(f,"State must always be provided synchronously");}if(W1){S1=S1||Object.create(null);var X1=V1.getMetadata().getNamespace();S1[X1]=W1;}};r.templateBaseExtension.provideExtensionAppStateData(U1);T1=false;if(S1){I1[k]=S1;}return I1;}function V(){var I1=q.oSmartFilterbar.getUiState();var J1=new S(JSON.stringify(I1.getSelectionVariant()));var K1=r.getVisibleSelectionsWithDefaults();for(var i=0;i<K1.length;i++){if(!J1.getValue(K1[i])){J1.addSelectOption(K1[i],"I","EQ","");}}J1.setID("");B1(J1);var L1={};if(E.getLocalId()){L1[E.getLocalId()]=E.getState();}L1[y.getLocalId()]=y.getState();if(A.getLocalId()){L1[A.getLocalId()]=A.getState();}if(G.getLocalId()){L1[G.getLocalId()]=G.getState();}return{version:sap.ui.version,selectionVariant:J1.toJSONString(),customData:R(),semanticDates:I1.getSemanticDates(),controlStates:L1};}function W(I1,J1){var K1=T.oComponentUtils.getTemplatePrivateModel();if(I1&&T.oComponentUtils.isDraftEnabled()){K1.setProperty("/listReport/vDraftState",I1.editStateFilter);K1.setProperty("/listReport/activeObjectEnabled",!!I1.activeStateFilter);q.oMultipleViewsHandler.restoreActiveButtonState(I1);}var L1=I1&&I1.visibleCustomFields;if(L1&&L1.length>0){var M1=q.oSmartFilterbar.getAllFilterItems();for(var i=0;i<M1.length;i++){var N1=M1[i];var O1=N1.getName();if(L1.indexOf(O1)!==-1){N1.setVisibleInFilterBar(true);}}}a1(J1&&!(I1&&I1.suppressDataSelection));var P1=q.oMultipleViewsHandler.getSelectedKeyPropertyName();if(P1&&I1[P1]){q.oMultipleViewsHandler.restoreFromIappState(I1[P1]);}if(P()){Q();}}function X(i){if(I){var I1=i['sap-ui-fe-variant-id'];if(I1&&I1[0]){z.setCurrentVariantId(I1[0]);}}else{var J1=i['sap-ui-fe-variant-id'],K1=i['sap-ui-fe-filterbar-variant-id'],L1=i['sap-ui-fe-chart-variant-id'],M1=i['sap-ui-fe-table-variant-id'];Y(K1&&K1[0],L1&&L1[0],M1&&M1[0],J1&&J1[0]);}}function Y(i,I1,J1,K1){if(i||K1){z.setCurrentVariantId(i||K1);}if(J1||K1){q.oPresentationControlHandler.setCurrentVariantId(J1||K1);}q.oMultipleViewsHandler.setControlVariant(I1,J1);}function Z(i){r.restoreCustomAppStateDataExtension(i||{});}function $(i){if(!i){return;}var I1=true;var J1=function(K1){if(!(K1 instanceof C)){throw new b(f,"State must always be retrieved with respect to a ControllerExtension");}var L1=K1.getMetadata().getNamespace();if(!I1){throw new b(f,"State must always be restored synchronously");}return i[L1];};r.templateBaseExtension.restoreExtensionAppStateData(J1);I1=false;}function _(i,I1){$(i[k]);Z(i[j]);W(i[m],I1);q.oSmartFilterbar.fireFilterChange();}function a1(i){var I1=T.oComponentUtils.getTemplatePrivateModel();I1.setProperty("/generic/bDataAreShownInTable",i||q.oSmartFilterbar.getLiveMode());}function b1(){q.refreshModel();q.oIappStateHandler.changeIappState(true);if(D.system.phone){z1();}}function c1(i){n("changeIappState called",{bDataAreShown:i,bDataAreShownInTable:P(),bIgnoreFilterChange:J});if(J||q.oSmartFilterbar.isDialogOpen()||M){return;}a1(i);T.oComponentUtils.stateChanged();}function d1(i){var I1=q.oSmartFilterbar.determineMandatoryFilterItems(),J1;for(var K1=0;K1<I1.length;K1++){if(I1[K1].getName().indexOf("P_DisplayCurrency")!==-1){if(i.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")&&i.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0]&&i.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0].Low){J1=i.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0].Low;if(J1){i.oSelectionVariant.addParameter("P_DisplayCurrency",J1);}}break;}}}function e1(){var i=q.oSmartFilterbar.determineMandatoryFilterItems();var I1=q.oSmartFilterbar.getFiltersWithValues();return i.every(function(J1){return I1.includes(J1);});}function f1(i){var I1=typeof i==="string"?JSON.parse(i):i;var J1=I1&&I1.SortOrder;q.oPresentationControlHandler.applyNavigationSortOrder(J1);}function g1(i){var I1=(typeof i.semanticDates==="string"?JSON.parse(i.semanticDates):i.semanticDates)||{};i.customData=i.customData||{};G1(P());m1(i.controlStates);if(!q.oWorklistData.bWorkListEnabled){F1(i.oSelectionVariant||"",i.selectionVariant||"",true,I1,false);}_(i.customData,true);}function h1(i,I1){X(I1);if(i.presentationVariant!==undefined){f1(i.presentationVariant);}if((i.oSelectionVariant.getSelectOptionsPropertyNames().indexOf("DisplayCurrency")===-1)&&(i.oSelectionVariant.getSelectOptionsPropertyNames().indexOf("P_DisplayCurrency")===-1)&&(i.oSelectionVariant.getParameterNames().indexOf("P_DisplayCurrency")===-1)){d1(i);}var J1={selectionVariant:i.oSelectionVariant,urlParameters:I1,selectedQuickVariantSelectionKey:"",semanticDates:(typeof i.semanticDates==="string"?JSON.parse(i.semanticDates):i.semanticDates)||{}};if(!q.oWorklistData.bWorkListEnabled){r.modifyStartupExtension(J1);if(q.oSmartFilterbar.isCurrentVariantStandard()){s.setSemanticDateRangeDefaultValue(K,q.oSmartFilterbar,J1.semanticDates,J1.urlParameters||{});}F1(J1.selectionVariant,i.selectionVariant||"",true,J1.semanticDates,false);}if(q.oWorklistData.bWorkListEnabled){Q();}Z();q.oMultipleViewsHandler.handleStartUpObject(J1);var K1=true;if(!q.oWorklistData.bWorkListEnabled){if(!q.oSmartFilterbar.getLiveMode()&&!q.oSmartFilterbar.isCurrentVariantStandard()){K1=q.oSmartFilterbar.isCurrentVariantExecuteOnSelectEnabled();}a1(K1);if(K1){q.oSmartFilterbar.search();if(!D.system.desktop){z1();}}G1(K1);}c1(K1);}function i1(i){X(i);var I1={selectionVariant:"",urlParameters:i,selectedQuickVariantSelectionKey:"",semanticDates:{}};var J1=q.oSmartFilterbar.getUiState();var K1=new S(JSON.stringify(J1.getSelectionVariant()));B1(K1);var L1=JSON.parse(JSON.stringify(K1));var M1=J1.getSemanticDates();I1.selectionVariant=K1;I1.semanticDates=M1;r.modifyStartupExtension(I1);if(!(d(JSON.parse(JSON.stringify(I1.selectionVariant)),L1)&&d(I1.semanticDates,M1))){F1(I1.selectionVariant,"",true,I1.semanticDates,true);}Z();q.oMultipleViewsHandler.handleStartUpObject(I1);var N1=true;if(q.oWorklistData.bWorkListEnabled||q.oSmartFilterbar.getLiveMode()){Q();}else{if(q.oSmartFilterbar.isCurrentVariantStandard()){s.setSemanticDateRangeDefaultValue(K,q.oSmartFilterbar,I1.semanticDates||{},I1.urlParameters);z.setExecuteOnStandard(H1(false));var O1=z.getExecuteOnStandard();if(O1||K.variantManagementHidden){var P1=H1(true);N1=P1===undefined?O1:P1;}else{N1=false;}}else{N1=q.oSmartFilterbar.isCurrentVariantExecuteOnSelectEnabled();}a1(N1);if(N1){q.oSmartFilterbar.search();if(!D.system.desktop){z1();}}G1(N1);}z&&z.currentVariantSetModified(false);c1(N1);}function j1(i,I1){return d(i.map(JSON.stringify).sort(),I1.map(JSON.stringify).sort());}function k1(i,I1){X(I1);var J1={selectionVariant:i.oSelectionVariant,urlParameters:I1,selectedQuickVariantSelectionKey:"",semanticDates:(typeof i.semanticDates==="string"?JSON.parse(i.semanticDates):i.semanticDates)||{}};if(i.presentationVariant!==undefined){f1(i.presentationVariant);}var K1=q.oSmartFilterbar.getUiState();var L1=new S(JSON.stringify(K1.getSelectionVariant()));B1(L1);var M1=JSON.parse(JSON.stringify(L1));var N1=K1.getSemanticDates();if((i.oSelectionVariant.getSelectOptionsPropertyNames().indexOf("DisplayCurrency")===-1)&&(i.oSelectionVariant.getSelectOptionsPropertyNames().indexOf("P_DisplayCurrency")===-1)&&(i.oSelectionVariant.getParameterNames().indexOf("P_DisplayCurrency")===-1)){d1(i);}if(!q.oWorklistData.bWorkListEnabled){if(q.oSmartFilterbar.isCurrentVariantStandard()){r.modifyStartupExtension(J1);s.setSemanticDateRangeDefaultValue(K,q.oSmartFilterbar,J1.semanticDates,J1.urlParameters);var O1=q.oSmartFilterbar.getAllFilterItems().map(function(T1){return T1.getName();});var P1=i.oSelectionVariant.toJSONObject().SelectOptions.filter(function(T1){return O1.includes(T1.PropertyName);});if(!j1(L1.toJSONObject().SelectOptions,P1)){F1(l.getMergedVariants([L1,J1.selectionVariant]),i.selectionVariant,true,J1.semanticDates,false);z.currentVariantSetModified(true);}}else{J1.selectionVariant=L1;J1.semanticDates=N1;r.modifyStartupExtension(J1);if(!(d(JSON.parse(JSON.stringify(J1.selectionVariant)),M1)&&d(J1.semanticDates,N1))){F1(J1.selectionVariant,i.selectionVariant,true,J1.semanticDates,false);}}}if(q.oWorklistData.bWorkListEnabled||q.oSmartFilterbar.getLiveMode()){Q();}Z();q.oMultipleViewsHandler.handleStartUpObject(J1);var Q1=true;if(!q.oWorklistData.bWorkListEnabled&&!q.oSmartFilterbar.getLiveMode()){if(q.oSmartFilterbar.isCurrentVariantStandard()){z.setExecuteOnStandard(H1(false));var R1=z.getExecuteOnStandard();if(R1||K.variantManagementHidden){var S1=H1(true);Q1=S1===undefined?R1:S1;}else{Q1=false;}}else{Q1=q.oSmartFilterbar.isCurrentVariantExecuteOnSelectEnabled();}a1(Q1);if(Q1){q.oSmartFilterbar.search();if(!D.system.desktop){z1();}}G1(Q1);}c1(Q1);}function l1(i,I1,J1){n("fnAdaptToAppState called",{sNavType:J1});q.oSmartFilterbar.setSuppressSelection(false);M=false;switch(J1){case sap.ui.generic.app.navigation.service.NavType.iAppState:g1(i);break;case sap.ui.generic.app.navigation.service.NavType.initial:i1(I1);break;case sap.ui.generic.app.navigation.service.NavType.xAppState:case sap.ui.generic.app.navigation.service.NavType.URLParams:if(i.bNavSelVarHasDefaultsOnly){k1(i,I1);}else{h1(i,I1);}break;default:l1.apply(this,arguments);}}function m1(i){Object.keys(i).forEach(function(I1){T.oCommonUtils.getControlStateWrapper(r.byId(I1)).setState(i[I1]);});}function n1(q){if(!q){return w.then(o1);}q=u.getStateInCurrentFormat(q);var i=e({oDefaultedSelectionVariant:new S(),oSelectionVariant:new S(q&&q.selectionVariant)},q);w.then(function(){l1(i,{},a(q)?sap.ui.generic.app.navigation.service.NavType.initial:sap.ui.generic.app.navigation.service.NavType.iAppState);});return w;}function o1(){var i=new Promise(function(I1){try{var J1=H.parseNavigation();J1.done(function(L1,M1,N1){if(N1!==sap.ui.generic.app.navigation.service.NavType.iAppState){l1(L1,M1,N1);}I1();});J1.fail(function(L1,M1,N1){g.warning(L1.getErrorCode()+"app state could not be parsed - continuing with empty state");l1({},M1,sap.ui.generic.app.navigation.service.NavType.initial);I1();});}catch(K1){G1();l1({},{},sap.ui.generic.app.navigation.service.NavType.initial);I1();}});return i;}function p1(){J=true;var i=R();i[m].controlStates=Object.create(null);if(I){if(G.getLocalId()){i[m].controlStates[G.getLocalId()]=G.getState();}}q.oSmartFilterbar.setCustomFilterData(i);J=false;}function q1(){c1(P());}function r1(i){var I1=q.oSmartFilterbar.getCustomFilterData();I1=u.getStateInCurrentFormat({customData:I1}).customData;_(I1);if(I1[m].controlStates){m1(I1[m].controlStates);}if(q.oWorklistData.bWorkListEnabled&&i.getParameter("context")!=="SET_VM_ID"){Q();}}function s1(i){var I1=i.getParameter("context");if(!I1){a1(i.getParameter("executeOnSelect"));z1();c1(P());}}function t1(i){r1(i);s1(i);}function u1(){}function v1(){}function w1(){if(!I){c1(P());}}function x1(){if(!I){c1(P());}}function y1(){q.oSmartFilterbar.attachFiltersDialogClosed(T.oComponentUtils.stateChanged);}function z1(){var i=r.getOwnerComponent().getModel("_templPriv");i.setProperty("/listReport/isHeaderExpanded",!P()||!e1());}function A1(i,I1,J1,K1){var L1=new U({selectionVariant:i,semanticDates:K1});q.oSmartFilterbar.setUiState(L1,{replace:I1,strictMode:J1});}function B1(i){[k,j,m].forEach(i.removeSelectOption.bind(i));}function C1(I1,J1,K1){if(I1&&(J1!==""||K1)){var L1=I1.getParameterNames().concat(I1.getSelectOptionsPropertyNames());for(var i=0;i<L1.length;i++){q.oSmartFilterbar.addFieldToAdvancedArea(L1[i]);}}}function D1(i,I1,J1){if(i.getParameter(I1)&&!i.getParameter(J1)){i.addParameter(J1,i.getParameter(I1));}if(i.getSelectOption(I1)&&!i.getSelectOption(J1)){var K1=i.getSelectOption(I1);K1.forEach(function(L1){i.addSelectOption(J1,L1.Sign,L1.Option,L1.Low,L1.High);});}}function E1(i){var I1=r.getOwnerComponent().getModel().getMetaModel();var J1=r.getOwnerComponent().getEntitySet();var K1=I1.getODataEntityType(I1.getODataEntitySet(J1).entityType);K1.property.forEach(function(L1){if(L1["com.sap.vocabularies.Common.v1.EditableFieldFor"]){var M1=L1["com.sap.vocabularies.Common.v1.EditableFieldFor"].PropertyPath||L1["com.sap.vocabularies.Common.v1.EditableFieldFor"].String;var N1=L1.name;D1(i,M1,N1);D1(i,N1,M1);}});}function F1(i,I1,J1,K1,L1){E1(i);if(J1){q.oSmartFilterbar.clearVariantSelection();}C1(i,I1,L1);A1(i.toJSONObject(),J1,false,K1);}function G1(i){if(!i||!e1()){T.oComponentUtils.hidePlaceholder();}}function H1(i){var I1;if(q.bLoadListAndFirstEntryOnStartup){I1=true;}else{var J1=q.oMultipleViewsHandler.getOriginalEnableAutoBinding();var K1=K.dataLoadSettings&&K.dataLoadSettings.loadDataOnAppLaunch;if(K1===""||K1===undefined&&(J1!==null&&J1!==undefined)){I1=J1&&e1();}else{if(i){if(K1==="ifAnyFilterExist"||K1===undefined||K1===""){I1=q.oSmartFilterbar.getFiltersWithValues().length>0&&e1();}else if(K.variantManagementHidden){if(K1==="never"){I1=false;}else if(K1==="always"){I1=e1();}}}else{I1=K1==="never"?false:e1();}}}return I1;}t.testable(H1,"getInitialLoadBehaviourSettings");return{areDataShownInTable:P,setDataShownInTable:a1,onSearchPressed:b1,changeIappState:c1,onFiltersDialogBeforeOpen:u1,onFiltersDialogClosed:v1,onSmartFilterBarInitialise:y1,onSmartFilterBarInitialized:v,onBeforeSFBVariantFetch:p1,onAfterSFBVariantSave:q1,onAfterSFBVariantLoad:t1,onAfterTableVariantSave:w1,onAfterApplyTableVariant:x1,applyState:n1,getCurrentAppState:V,setFiltersUsingUIState:A1};}return B.extend("sap.suite.ui.generic.template.ListReport.controller.IappStateHandler",{constructor:function(i,q,T){e(this,p(i,q,T));}});});
