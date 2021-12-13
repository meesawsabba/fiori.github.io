/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){var a=(this&&this.__extends)||(function(){var e=function(d,b){e=Object.setPrototypeOf||({__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b;})||function(d,b){for(var p in b)if(Object.prototype.hasOwnProperty.call(b,p))d[p]=b[p];};return e(d,b);};return function(d,b){if(typeof b!=="function"&&b!==null)throw new TypeError("Class extends value "+String(b)+" is not a constructor or null");e(d,b);function _(){this.constructor=d;}d.prototype=b===null?Object.create(b):(_.prototype=b.prototype,new _());};})();var c=(this&&this.__awaiter)||function(t,_,P,g){function b(v){return v instanceof P?v:new P(function(r){r(v);});}return new(P||(P=Promise))(function(r,d){function f(v){try{s(g.next(v));}catch(e){d(e);}}function i(v){try{s(g["throw"](v));}catch(e){d(e);}}function s(e){e.done?r(e.value):b(e.value).then(f,i);}s((g=g.apply(t,_||[])).next());});};var h=(this&&this.__generator)||function(b,d){var _={label:0,sent:function(){if(t[0]&1)throw t[1];return t[1];},trys:[],ops:[]},f,y,t,g;return g={next:i(0),"throw":i(1),"return":i(2)},typeof Symbol==="function"&&(g[Symbol.iterator]=function(){return this;}),g;function i(n){return function(v){return s([n,v]);};}function s(o){if(f)throw new TypeError("Generator is already executing.");while(_)try{if(f=1,y&&(t=o[0]&2?y["return"]:o[0]?y["throw"]||((t=y["return"])&&t.call(y),0):y.next)&&!(t=t.call(y,o[1])).done)return t;if(y=0,t)o=[o[0]&2,t.value];switch(o[0]){case 0:case 1:t=o;break;case 4:_.label++;return{value:o[1],done:false};case 5:_.label++;y=o[1];o=[0];continue;case 7:o=_.ops.pop();_.trys.pop();continue;default:if(!(t=_.trys,t=t.length>0&&t[t.length-1])&&(o[0]===6||o[0]===2)){_=0;continue;}if(o[0]===3&&(!t||(o[1]>t[0]&&o[1]<t[3]))){_.label=o[1];break;}if(o[0]===6&&_.label<t[1]){_.label=t[1];t=o;break;}if(t&&_.label<t[2]){_.label=t[2];_.ops.push(o);break;}if(t[2])_.ops.pop();_.trys.pop();continue;}o=d.call(b,_);}catch(e){o=[6,e];y=0;}finally{f=t=0;}if(o[0]&5)throw o[1];return{value:o[0]?o[1]:void 0,done:true};}};var l=(this&&this.__spreadArray)||function(t,f){for(var i=0,b=f.length,j=t.length;i<b;i++,j++)t[j]=f[i];return t;};sap.ui.define(["require","exports","../../sina/SinaObject","../../sina/AttributeType","./Provider"],function(r,e,S,A,P){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.ItemPostParser=void 0;var I=(function(_){a(I,_);function I(p){var b=_.call(this,p)||this;b._searchResultSetItem=p.searchResultSetItem;b._dataSource=p.searchResultSetItem.dataSource;b._allAttributesMap=p.searchResultSetItem._private.allAttributesMap;b._intentsResolver=b.sina._createFioriIntentsResolver({sina:p.sina,});return b;}I.prototype.postParseResultSetItem=function(){return c(this,void 0,void 0,function(){var p;return h(this,function(b){p=this.enhanceResultSetItemWithNavigationTargets();this.enhanceResultSetItemWithGroups();return[2,p];});});};I.prototype.enhanceResultSetItemWithNavigationTargets=function(){return c(this,void 0,void 0,function(){var t,s,b,d,f,g,j,n,k,i;return h(this,function(m){switch(m.label){case 0:t=this;s=t._dataSource._private.semanticObjectType;b=t._searchResultSetItem._private.semanticObjectTypeAttributes;d=t._dataSource._private.system;f=t._dataSource._private.client;return[4,t._intentsResolver.resolveIntents({semanticObjectType:s,semanticObjectTypeAttributes:b,systemId:d,client:f,fallbackDefaultNavigationTarget:t._searchResultSetItem.defaultNavigationTarget,})];case 1:g=m.sent();j=g&&g.defaultNavigationTarget;n=g&&g.navigationTargets;k=[];if(j){k.push(j);t._searchResultSetItem.defaultNavigationTarget=j;j.parent=t._searchResultSetItem;}if(n){t._searchResultSetItem.navigationTargets=n;k=l(l([],k),n);for(i=0;i<n.length;i++){n[i].parent=t._searchResultSetItem;}}this.enhanceNavigationTargetsWithContentProviderId(k);return[2,t._searchResultSetItem];}});});};I.prototype.enhanceNavigationTargetsWithContentProviderId=function(n){if(!(this.sina.provider instanceof P.Provider)){return;}if(!this.sina.provider.contentProviderId){return;}for(var b=0,d=n;b<d.length;b++){var f=d[b];f.targetUrl+="&sap-app-origin-hint="+this.sina.provider.contentProviderId;}};I.prototype.enhanceResultSetItemWithGroups=function(){var b=this._searchResultSetItem.dataSource.attributesMetadata;for(var i=0;i<b.length;i++){var d=b[i];if(d.type===A.AttributeType.Group){var g=this._addAttributeGroup(d);if(d.usage.Detail){this._searchResultSetItem.detailAttributes.push(g);}if(d.usage.Title){this._searchResultSetItem.titleAttributes.push(g);}if(d.usage.TitleDescription){this._searchResultSetItem.titleDescriptionAttributes.push(g);}}}this.sortAttributes();};I.prototype.sortAttributes=function(){var b=function(d){return function(f,g){var i=f.metadata.usage&&f.metadata.usage[d]?f.metadata.usage[d].displayOrder:undefined;var j=g.metadata.usage&&g.metadata.usage[d]?g.metadata.usage[d].displayOrder:undefined;if(i===undefined||j===undefined){if(j!==undefined){return 1;}return-1;}return i-j;};};this._searchResultSetItem.titleAttributes.sort(b("Title"));this._searchResultSetItem.titleDescriptionAttributes.sort(b("TitleDescription"));this._searchResultSetItem.detailAttributes.sort(b("Detail"));};I.prototype._addAttributeGroup=function(b){var g=this.sina._createSearchResultSetItemAttributeGroup({id:b.id,metadata:b,label:b.label,template:b.template,attributes:[],groups:[],});var p,d;if(b._private){p=b._private.parentAttribute;d=b._private.childAttribute;}for(var k=0;k<b.attributes.length;k++){var f=b.attributes[k];var i=f.attribute;var j=void 0;if(i.type===A.AttributeType.Group){j=this._addAttributeGroup(i);}else{j=this._allAttributesMap[i.id];}if(j){var m=this.sina._createSearchResultSetItemAttributeGroupMembership({group:g,attribute:j,metadata:f,});g.attributes.push(m);j.groups.push(m);}if(i==p){g._private.parentAttribute=j;}else if(i==d){g._private.childAttribute=j;}}return g;};return I;}(S.SinaObject));e.ItemPostParser=I;});})();
