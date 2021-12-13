// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/adapters/cdm/v3/_LaunchPage/readVisualizations","sap/ushell/adapters/cdm/v3/_LaunchPage/readApplications","sap/ushell/adapters/cdm/v3/_LaunchPage/readHome","sap/ushell/adapters/cdm/v3/utilsCdm","sap/ushell/Config","sap/base/util/deepClone","sap/base/util/isPlainObject","sap/base/util/ObjectPath","sap/base/util/deepExtend","sap/base/util/isEmptyObject","sap/ushell/library"],function(r,a,b,u,C,d,i,O,c,e,f){"use strict";var g={};var D=f.DisplayFormat;g.getVizData=function(s,v,U,S){if(v.isBookmark&&v.url){v=d(v);v.subTitle=v.subtitle;v.target=u.toTargetFromHash(v.url);}var h=this.getCdmParts(s,v);var V=h&&h[1]||{};var A=h&&h[3]||{};var o=r.get(s,b.getTileVizId(v))||{};var j={id:b.getTileId(v),vizId:b.getTileVizId(v)||"",vizType:v.vizType||r.getTypeId(o)||"",vizConfig:c({},V,v.vizConfig),title:r.getTitle(h)||"",subtitle:r.getSubTitle(h)||"",icon:r.getIcon(h)||"",keywords:r.getKeywords(h)||[],info:r.getInfo(h)||"",target:v.target||r.getTarget(o)||{},indicatorDataSource:this._getIndicatorDataSource(v,o,S),isBookmark:v.isBookmark||false,contentProviderId:v.contentProviderId||a.getContentProviderId(A)||"",displayFormatHint:v.displayFormatHint,numberUnit:r.getNumberUnit(h),_instantiationData:r.getInstantiationData(o)};j.target=this.harmonizeTarget(j.target);j.targetURL=u.toHashFromVizData(j,s.applications);if(j.indicatorDataSource&&j.indicatorDataSource.dataSource){j.dataSource=r.getDataSource(h,j.indicatorDataSource.dataSource);}if(v.isBookmark){this._addBookmarkInstantiationData(j,s);}if(!j._instantiationData||!Object.keys(j._instantiationData)){j._instantiationData={platform:"CDM",vizType:r.getType(s,j.vizType)};}this._evaluateDisplayFormat(j,s);return j;};g._getIndicatorDataSource=function(v,V,s){if(v.indicatorDataSource&&v.indicatorDataSource.path){if(v.contentProviderId&&s){v.indicatorDataSource.path=s.getFullyQualifiedXhrUrl(v.indicatorDataSource.path);}return v.indicatorDataSource;}return r.getIndicatorDataSource(V);};g.getVizRef=function(v){var V={id:v.id,vizId:v.vizId,title:v.title,subTitle:v.subtitle,icon:v.icon,keywords:v.keywords,info:v.info,target:v.target,indicatorDataSource:v.indicatorDataSource,contentProviderId:v.contentProviderId,displayFormatHint:v.displayFormatHint,numberUnit:v.numberUnit};if(V.indicatorDataSource&&V.indicatorDataSource.originalPath){V.indicatorDataSource.path=V.indicatorDataSource.originalPath;delete V.indicatorDataSource.originalPath;}if(v.isBookmark){V.isBookmark=v.isBookmark;if(v.vizConfig!==undefined&&!e(v.vizConfig)){V.vizType=v.vizType;if(v.cdmVizType){V.vizType=v.cdmVizType;}V.vizConfig=v.vizConfig;}}return V;};g.getCdmParts=function(s,t){var v=r.get(s,b.getTileVizId(t))||{};var V=r.getConfig(v);var A=r.getAppDescriptor(s,r.getAppId(v));var I=a.getInbound(A,r.getInboundId(v));return[t,V,I,A];};g.harmonizeTarget=function(t){var p=t.parameters;if(!p||i(p)){return t;}var P={};p.forEach(function(o){if(P[o.name]){if(!Array.isArray(P[o.name].value.value)){P[o.name].value.value=[P[o.name].value.value];}P[o.name].value.value.push(o.value);}else{P[o.name]={value:{value:o.value,format:"plain"}};}});t.parameters=P;return t;};g._evaluateDisplayFormat=function(v,s){var h=v.displayFormatHint;var V=r.getType(s,v.vizType);var t=r.getTileSize(V);var S=t==="1x2"?D.StandardWide:D.Standard;var j=[S,D.Compact];v.supportedDisplayFormats=r.getSupportedDisplayFormats(V)||j;var k=r.getDefaultDisplayFormat(V)||S;if(v.supportedDisplayFormats.indexOf(h)===-1){v.displayFormatHint=k;}};g._addBookmarkInstantiationData=function(v,s){if(v.vizType){var V=r.getType(s,v.vizType);var h=O.get(["sap.app","type"],V||{});if(V&&h!=="chipVizType"){v._instantiationData={platform:"CDM",vizType:V};}else{var o=r.getChipConfigFromVizReference(v);v._instantiationData={platform:"ABAP",chip:d(o),simplifiedChipFormat:true};v.cdmVizType=v.vizType;v.vizType=o.chipId;}}else if(v.indicatorDataSource&&v.indicatorDataSource.path){v.vizType="sap.ushell.DynamicAppLauncher";}else{v.vizType="sap.ushell.StaticAppLauncher";}};g.getBookmarkVizTypeIds=function(B){var I=["sap.ushell.StaticAppLauncher","sap.ushell.DynamicAppLauncher"];var s=B.vizType;if(s&&!I.includes(s)){I.push(s);}var o=r.getChipConfigFromVizReference(B);var h=o&&o.chipId;if(h&&!I.includes(h)){I.push(h);}return I;};return g;},true);
