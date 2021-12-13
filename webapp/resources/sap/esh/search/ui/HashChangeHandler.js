/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/esh/search/ui/SearchModel","sap/esh/search/ui/SearchHelper"],function(S,a){"use strict";var m=(sap.esh.search.ui.HashChangeHandler={});jQuery.extend(m,{handle:function(h){if(!a.isLoggingEnabled()){return;}var t=this;t.sourceUrlArray=[];if(h.oldShellHash!==null){t.sourceUrlArray.push(h.oldShellHash);}if(h.oldAppSpecificRoute!==null){if(h.oldAppSpecificRoute.substring(0,2)==="&/"){t.sourceUrlArray.push(h.oldAppSpecificRoute.substring(2));}else{t.sourceUrlArray.push(h.oldAppSpecificRoute);}}t._createSearchModel().then(function(){var e={type:"ITEM_NAVIGATE",sourceUrlArray:this.sourceUrlArray,targetUrl:"#"+h.newShellHash,systemAndClient:this._getSID(),};if(e.targetUrl.indexOf("=")!==-1){this.searchModel.sinaNext.logUserEvent(e);}}.bind(this));},_createSearchModel:function(){var t=this;if(t.initializedPromise){return t.initializedPromise;}t.searchModel=sap.esh.search.ui.getModelSingleton({},"flp");t.initializedPromise=t.searchModel.initBusinessObjSearch();return t.initializedPromise;},_getSID:function(){var s={systemId:"",client:"",};var u=window.location.href;var b=u.indexOf("sap-system=sid(");if(b!==-1){var c=u.substring(b).indexOf(")");if(c!==-1){var d=u.substring(b+15,b+c);if(d.split(".").length===2){s.systemId=d.split(".")[0];s.client=d.split(".")[1];}}}return s;},});return m;});
