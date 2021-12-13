// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/utils","sap/base/util/ObjectPath","sap/ushell_abap/pbServices/ui2/Utils"],function(u,O,U){"use strict";var a={};a.getUrlParameterValue=function(v,m){var p=m||U.getParameterMap();return p[v]&&p[v][0];};a.createAndOpenXHR=function(s,S,h){h=h||"GET";var x=new XMLHttpRequest();x.open(h,s,true);if(S){a.addCommonHeadersToXHR(x,S);}return x;};a.addCommonHeadersToXHR=function(x,s){x.setRequestHeader("Accept","application/json");if(s.client){x.setRequestHeader("sap-client",s.client);}if(s.language){x.setRequestHeader("sap-language",s.language);}return x;};a.getCacheIdAsQueryParameter=function(s){var c=O.get("services.targetMappings.cacheId",s);if(typeof c==="string"){return"&sap-cache-id="+c;}return"";};a.isSapStatisticsSet=function(q){var w=q||window.location.search,s=/sap-statistics=(true|x|X)/.test(w);try{s=s||(u.getLocalStorageItem("sap-ui-statistics")==="X");}catch(e){jQuery.sap.log.warning("failed to read sap-statistics setting from local storage",null,"sap.ushell_abap.bootstrap");}return s;};a.mergeConfig=function(m,c,C){var A=C?JSON.parse(JSON.stringify(c)):c;if(typeof c!=="object"){return;}Object.keys(A).forEach(function(k){if(Object.prototype.toString.apply(m[k])==="[object Object]"&&Object.prototype.toString.apply(A[k])==="[object Object]"){a.mergeConfig(m[k],A[k],false);return;}m[k]=A[k];});};a.getLocationOrigin=function(){return location.protocol+"//"+location.host;};a.getLocationHref=function(){return location.href;};return a;});
