/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";return{readCFlpConfiguration:function(s){if(!sap||!sap.cf){return Promise.resolve(s);}return sap.ushell.Container.getServiceAsync("CommonDataModel").then(function(a){return a.getApplications();}).then(function(a){var c=Object.keys(a).reduce(function(o,A){var d=a[A];var C=d["sap.app"]&&d["sap.app"].contentProviderId;if(C){o[C]=true;}return o;},{});var b=Object.keys(c);return b;}.bind(this)).then(function(c){var p=[];for(var i=0;i<c.length;++i){var a=c[i];p.push(this.createContentProviderSinaConfiguration(a));}return Promise.all(p);}.bind(this)).then(function(a){if(!a||a.length===0){return s;}else{a=a.filter(function(e){if(typeof e!=="undefined"){return e;}});return[{provider:"multi",subProviders:a,federationType:"advanced_round_robin",},"dummy",];}}.bind(this));},createContentProviderSinaConfiguration:function(c){return sap.ushell.Container.getServiceAsync("ClientSideTargetResolution").then(function(s){return s.getSystemContext(c);}).then(function(s){var a=s.getProperty("esearch.provider");var r=s.getFullyQualifiedXhrUrl("sap/opu/odata/sap/ESH_SEARCH_SRV");if(!a){return;}return{contentProviderId:c,provider:a.toLowerCase(),label:c,url:r,};}.bind(this));},};});
