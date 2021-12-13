sap.ui.define(["sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils","sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2","sap/suite/ui/generic/template/changeHandler/generic/AddElement","sap/base/util/deepExtend"],function(U,A,a,d){"use strict";var D="com.sap.vocabularies.UI.v1.DataField";var I="com.sap.vocabularies.UI.v1.Importance";var b="com.sap.vocabularies.UI.v1.ImportanceType/High";var F="com.sap.vocabularies.UI.v1.FieldGroup";var t={};var c={};var e={};var h=function(C,s,p){var E={};var o={};var f={};var g="";var i=[];var m={};var j={};var G=p.modifier.bySelector(s.parentId,p.appComponent);var P=p.modifier.getSelector(s.parentId,p.appComponent);var M=U.getMetaModel(s,p);var T=U.getTemplatingInfo(G);E=M.getODataEntityType(T.target);g=(T.value.indexOf("/")>0)?T.value.split("/")[1].substr(1):T.value.substr(1);o=E[g];f=JSON.parse(JSON.stringify(o));i=(g.indexOf(F)>=0)?o.Data:o;var n=E.property.find(function(l){return l.name===s.bindingPath;});var N={Value:{Path:s.bindingPath},RecordType:D,EdmType:n&&n.type};N[I]={EnumMember:b};i.splice(s.index,0,N);m=A.createCustomAnnotationTermChange(T.target,o,f,g);m.targetIndex=s.index;m.parentElementId=G.getId();m.oParentSelector=P;m.bindingPath=s.bindingPath;m.oAnnotation=N;m.oEntityType=E;m.sAnnotation=g;j=A.createCustomChanges(m);j.noRefreshOnChange=true;var r=U.getComponent(G).getRootControl().getId();var k=r+sap.suite.ui.generic.template.js.AnnotationHelper.getStableIdPartFromFacet(U.getTemplatingInfo(G).annotationContext)+"::"+sap.suite.ui.generic.template.js.AnnotationHelper.getStableIdPartFromDataField(N)+"::GroupElement";var S=r+sap.suite.ui.generic.template.js.AnnotationHelper.getStableIdPartFromFacet(U.getTemplatingInfo(G).annotationContext)+"::"+sap.suite.ui.generic.template.js.AnnotationHelper.getStableIdPartFromDataField(N)+"::SmartField";var B=m.bindingPath;t[B]=function(l){var T={"sap.ui.dt":{annotation:{annotation:g,annotationContext:N,path:g+"/Data/"+s.index,target:E.namespace+"."+E.name,value:s.bindingPath}}};var q=new sap.ui.core.CustomData({"key":"sap-ui-custom-settings","value":T});l.addCustomData(q);};c[B]={oControl:{sId:k,type:"GroupElement",iTargetIndex:s.index,insertFunction:"insertGroupElement",fnTemplatingInfo:t[B],oChild:{oControl:{sId:S,type:"SmartField",mSettings:{value:"{"+s.bindingPath+"}"},insertFunction:"insertElement"}}}};d(C.getContent(),j);};e.getControlsToBeAdded=function(){return c;};e.applyChange=function(C,o,p){var B=C.getContent().customChanges[0].bindingPath;a.applyChange(C,o,p,c[B]);delete c[B];};e.revertChange=function(C,o,p){};e.completeChangeContent=function(C,s,p){s.custom={};s.custom.fnGetAnnotationIndex=U.getIndexFromInstanceMetadataPath;h(C,s,p);};return e;},true);
