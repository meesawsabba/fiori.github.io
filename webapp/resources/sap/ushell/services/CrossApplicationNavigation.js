// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/services/AppConfiguration","sap/ushell/services/_CrossApplicationNavigation/utils","sap/ushell/utils/type","sap/ushell/TechnicalParameters","sap/ushell/components/applicationIntegration/AppLifeCycle","sap/base/util/isPlainObject","sap/base/util/UriParameters","sap/ui/thirdparty/jquery","sap/base/util/ObjectPath","sap/base/util/merge","sap/ushell/utils","sap/ushell/ApplicationType","sap/ushell/library","sap/base/Log","sap/ushell/utils/UrlParsing"],function(a,u,t,T,A,i,U,q,O,m,b,c,d,L,e){"use strict";var f=d.UI5ComponentType;function C(o,p,s){var S;if(s&&s.config){S=s.config;}function g(v,j){var r,k,n,l,w;if(typeof v!=="string"&&!i(v)&&v!==undefined){L.error("Unexpected input type",null,"sap.ushell.services.CrossApplicationNavigation");return undefined;}if(v===undefined){return undefined;}r=a.getCurrentApplication();if(j){if(typeof j.getComponentData!=="function"||!i(j.getComponentData())||!j.getComponentData().startupParameters||!i(j.getComponentData().startupParameters)){L.error("Cannot call getComponentData on component","the component should be an application root component","sap.ushell.services.CrossApplicationNavigation");}else{w=j.getComponentData().startupParameters;if(w.hasOwnProperty("sap-system")){k=w["sap-system"][0];}if(w.hasOwnProperty("sap-ushell-next-navmode")){n=w["sap-ushell-next-navmode"][0];}}}else{if(r&&r["sap-system"]){k=r["sap-system"];}else if(r&&r.url){k=new U(r.url).get("sap-system");}if(r&&r["sap-ushell-next-navmode"]){n=r["sap-ushell-next-navmode"];}else if(r&&r.url){n=new U(r.url).get("sap-ushell-next-navmode");}}if(r){l=r.contentProviderId;}var I=u._injectParameters({type:t,inject:{"sap-system":k,"sap-ushell-navmode":n,"sap-app-origin-hint":l},injectEmptyString:{"sap-app-origin-hint":true},args:v});return I;}function h(v){var j,k,l;if(localStorage&&localStorage["sap-ushell-enc-test"]==="false"){return v;}if(!S||!S["sap-ushell-enc-test"]){if(localStorage&&localStorage["sap-ushell-enc-test"]!=="true"){return v;}}if(typeof v!=="string"&&!i(v)&&v!==undefined){L.error("Unexpected input type",null,"sap.ushell.services.CrossApplicationNavigation");return undefined;}if(v===undefined){return undefined;}if(i(v)){k=q.extend(true,{},v);if(k.target&&k.target.shellHash){if(typeof k.target.shellHash==="string"){if(k.target.shellHash!=="#"&&k.target.shellHash!==""){k.target.shellHash=h(k.target.shellHash);}}return k;}k.params=k.params||{};k.params["sap-ushell-enc-test"]=["A B%20C"];return k;}l=v;if(!/[?&]sap-system=/.test(l)){j=(l.indexOf("?")>-1)?"&":"?";l+=j+"sap-ushell-enc-test="+encodeURIComponent("A B%20C");}return l;}this._extractInnerAppRoute=function(I){var j=this,P,k;if(typeof I==="string"){P=I.split("&/");k=P.shift();return{intent:k,innerAppRoute:P.length>0?"&/"+P.join("&/"):""};}if(Object.prototype.toString.apply(I)==="[object Object]"){var l=O.get("target.shellHash",I);if(typeof l==="string"){var r=j._extractInnerAppRoute(l);I.target.shellHash=r.intent;return{intent:I,innerAppRoute:r.innerAppRoute};}if(I.hasOwnProperty("appSpecificRoute")){var v=I.appSpecificRoute;delete I.appSpecificRoute;var n=typeof v==="string"&&v.indexOf("&/")!==0&&v.length>0;return{innerAppRoute:n?"&/"+v:v,intent:I};}return{intent:I,innerAppRoute:""};}L.error("Invalid input parameter","expected string or object","sap.ushell.services.CrossApplicationNavigation");return{intent:I};};this._injectInnerAppRoute=function(I,j){var k,l=this;if(!j){return I;}if(typeof I==="string"){return I+j;}if(Object.prototype.toString.apply(I)==="[object Object]"){k=O.get("target.shellHash",I);if(typeof k==="string"){I.target.shellHash=l._injectInnerAppRoute(k,j);return I;}I.appSpecificRoute=j;}return I;};this.hrefForExternal=function(j,k,l){if(l){var D=new q.Deferred();this.hrefForExternalAsync(j,k).then(D.resolve).catch(D.reject);return D.promise();}L.warning("Deprecated option 'bAsync=false'. Please use 'bAsync=true' instead",null,"sap.ushell.services.CrossApplicationNavigation");var n=m({},j);var E=this._extractInnerAppRoute(n);var I=E.intent;u.addXAppStateFromParameter(I,"sap-xapp-state-data");n=g(I,k);n=u.injectStickyParameters({args:n,appLifeCycle:A,technicalParameters:T,type:t});n=h(n);n=this._injectInnerAppRoute(n,E.innerAppRoute);var r=sap.ushell.Container.getService("ShellNavigation");if(!r){L.debug("Shell not available, no Cross App Navigation");return"";}return r.hrefForExternal(n,undefined,k,l);};this.hrefForExternalAsync=function(j,k){var l=m({},j);var E=this._extractInnerAppRoute(l);var I=E.intent;return Promise.resolve().then(function(){return u.addXAppStateFromParameterAsync(I,"sap-xapp-state-data");}).then(function(){l=g(I,k);return u.injectStickyParametersAsync({args:l,appLifeCycle:A,technicalParameters:T,type:t});}).then(function(n){l=n;l=h(l);l=this._injectInnerAppRoute(l,E.innerAppRoute);return sap.ushell.Container.getServiceAsync("ShellNavigation");}.bind(this)).then(function(n){return new Promise(function(r,v){n.hrefForExternal(l,undefined,k,true).done(r).fail(v);});}).catch(function(){L.debug("Shell not available, no Cross App Navigation");return"";});};this.expandCompactHash=function(H){var D=new q.Deferred();sap.ushell.Container.getServiceAsync("NavTargetResolution").then(function(N){N.expandCompactHash(H).done(D.resolve).fail(D.reject);});return D.promise();};this.backToPreviousApp=function(){return this.isInitialNavigationAsync().then(function(I){if(I){return this.toExternal({target:{shellHash:"#"},writeHistory:false});}this.historyBack();}.bind(this));};this.historyBack=function(j){var k=-1;if(j&&typeof j==="number"){if(j<=0){L.warning("historyBack called with an argument <= 0 and will result in a forward navigation or refresh","expected was an argument > 0","sap.ushell.services.CrossApplicationNavigation#historyBack");}k=j*-1;}window.history.go(k);};this.isInitialNavigation=function(){L.warning("Deprecated API call of 'sap.ushell.CrossApplicationNavigation.isInitialNavigation'. Please use 'isInitialNavigationAsync' instead",null,"sap.ushell.services.CrossApplicationNavigation");var j=sap.ushell&&sap.ushell.Container&&typeof sap.ushell.Container.getService==="function"&&sap.ushell.Container.getService("ShellNavigation");if(!j){L.debug("ShellNavigation service not available","This will be treated as the initial navigation","sap.ushell.services.CrossApplicationNavigation");return true;}var I=j.isInitialNavigation();if(typeof I==="undefined"){return true;}return I;};this.isInitialNavigationAsync=function(){return sap.ushell.Container.getServiceAsync("ShellNavigation").then(function(j){var I=j.isInitialNavigation();if(typeof I==="undefined"){return true;}return I;}).catch(function(){L.debug("ShellNavigation service not available","This will be treated as the initial navigation","sap.ushell.services.CrossApplicationNavigation");return true;});};this.toExternal=function(j,k){var w=j.writeHistory;var l=m({},j);this._processShellHashWithParams(l);var E=this._extractInnerAppRoute(l);var I=E.intent;return Promise.resolve().then(function(){return u.addXAppStateFromParameterAsync(I,"sap-xapp-state-data");}).then(function(){l=g(I,k);return u.injectStickyParametersAsync({args:l,appLifeCycle:A,technicalParameters:T,type:t});}).then(function(n){l=n;l=h(l);delete l.writeHistory;l=this._injectInnerAppRoute(l,E.innerAppRoute);return sap.ushell.Container.getServiceAsync("ShellNavigation");}.bind(this)).then(function(n){return n.toExternal(l,k,w);}).catch(function(n){L.warning("Shell not available, no Cross App Navigation");});};this.hrefForAppSpecificHash=function(j){L.warning("Deprecated API call of 'sap.ushell.CrossApplicationNavigation.hrefForAppSpecificHash'. Please use 'hrefForAppSpecificHashAsync' instead",null,"sap.ushell.services.CrossApplicationNavigation");if(sap.ushell&&sap.ushell.Container&&typeof sap.ushell.Container.getService==="function"&&sap.ushell.Container.getService("ShellNavigation")){return sap.ushell.Container.getService("ShellNavigation").hrefForAppSpecificHash(j);}L.debug("Shell not available, no Cross App Navigation; fallback to app-specific part only");return"#"+encodeURI(j);};this.hrefForAppSpecificHashAsync=function(j){return sap.ushell.Container.getServiceAsync("ShellNavigation").then(function(k){return k.hrefForAppSpecificHash(j);}).catch(function(){L.debug("Shell not available, no Cross App Navigation; fallback to app-specific part only");return"#"+encodeURI(j);});};this.getPrimaryIntent=function(j,P){var Q={},k,r=/^#\w+-displayFactSheet(?:$|\?.)/;Q.tags=["primaryAction"];Q.semanticObject=j;if(P){Q.params=P;}return this.getLinks(Q).then(function(l){if(l.length===0){delete Q.tags;Q.action="displayFactSheet";k=function(n,v){var E;if(n.intent===v.intent){return 0;}E=r.test(n.intent)^r.test(v.intent);if(E){return r.test(n.intent)?-1:1;}return n.intent<v.intent?-1:1;};return this.getLinks(Q);}k=function(n,v){if(n.intent===v.intent){return 0;}return n.intent<v.intent?-1:1;};return l;}.bind(this)).then(function(l){return l.length===0?null:l.sort(k)[0];});};this.getSemanticObjectLinks=function(j,P,I,k,l,n){var D=new q.Deferred();Promise.resolve().then(function(){return u.injectStickyParametersAsync({args:{params:P},appLifeCycle:A,technicalParameters:T,type:t});}).then(function(r){r=g(r,k).params;r=h({params:r}).params;var v;if(Array.isArray(j)){v=[];j.forEach(function(w){v.push([{semanticObject:w[0],params:w[1],ignoreFormFactor:!!w[2],ui5Component:w[3],appStateKey:w[4],compactIntents:!!(w[5])}]);});}else{v={semanticObject:j,params:r,ignoreFormFactor:I,ui5Component:k,appStateKey:l,compactIntents:!!n};}return Promise.all([sap.ushell.Container.getServiceAsync("NavTargetResolution"),v]);}).then(function(r){var N=r[0];var v=r[1];b.invokeUnfoldingArrayArguments(N.getLinks.bind(N),[v]).done(D.resolve).fail(D.reject);});return D.promise();};this.getLinks=function(v){var E;E=b.invokeUnfoldingArrayArguments(this._getLinks.bind(this),[v]);return E;};this._getLinks=function(n){var D=new q.Deferred();if(typeof n==="undefined"){n={};}var N=q.extend(true,{},n);N.compactIntents=!!N.compactIntents;N.action=N.action||undefined;N.paramsOptions=u.extractGetLinksParameterOptions(N.params);Promise.resolve().then(function(){return u.injectStickyParametersAsync({args:N,appLifeCycle:A,technicalParameters:T,type:t});}).then(function(j){N=j;var P;if(N.params){P=u.extractGetLinksParameterDefinition(N.params);}else{P=N.params;}var k=g({params:P},N.ui5Component).params;k=h({params:k}).params;if(N.appStateKey){k["sap-xapp-state"]=[N.appStateKey];delete N.appStateKey;}N.params=k;return sap.ushell.Container.getServiceAsync("NavTargetResolution");}).then(function(j){j.getLinks(N).done(D.resolve).fail(D.reject);});return D.promise();};this.getDistinctSemanticObjects=function(){var D=new q.Deferred();sap.ushell.Container.getServiceAsync("NavTargetResolution").then(function(N){N.getDistinctSemanticObjects().done(D.resolve).fail(D.reject);});return D.promise();};this.isIntentSupported=function(I,j){var D=new q.Deferred(),k={},l=I.map(function(n){var r=g(n,j);k[r]=n;return r;});sap.ushell.Container.getServiceAsync("NavTargetResolution").then(function(N){N.isIntentSupported(l).done(function(n){var r={};Object.keys(n).forEach(function(K){r[k[K]]=n[K];});D.resolve(r);}).fail(D.reject.bind(D));});return D.promise();};this.isNavigationSupported=function(I,j){var D=new q.Deferred();var k=I.map(function(l){return g(l,j);});sap.ushell.Container.getServiceAsync("NavTargetResolution").then(function(N){N.isNavigationSupported(k).done(D.resolve).fail(D.reject);});return D.promise();};this.isUrlSupported=function(j){var D=new q.Deferred();if(typeof j!=="string"){D.reject();return D.promise();}if(e.isIntentUrl(j)){var H=e.getHash(j);this.isIntentSupported(["#"+H]).done(function(r){if(r["#"+H]&&r["#"+H].supported){D.resolve();}else{D.reject();}}).fail(function(){D.reject();});}else{D.resolve();}return D.promise();};this.createComponentInstance=function(I,j,k){var D=new q.Deferred(),l=sap.ushell.Container,M;this.createComponentData(I,j).then(function(n){l.getServiceAsync("Ui5ComponentLoader").then(function(r){return r.modifyComponentProperties(n,f.Application).then(function(v){M=v;return r;});}).then(function(r){if(k){k.runAsOwner(function(){v(M);});}else{v(M);}function v(w){w.loadDefaultDependencies=false;r.instantiateComponent(w).then(function(x){D.resolve(x.componentHandle.getInstance());},function(E){E=E||"";L.error("Cannot create UI5 component: "+E,E.stack,"sap.ushell.services.CrossApplicationNavigation");D.reject(E);});}});},function(E){D.reject(E);});return D.promise();};this.createComponentData=function(I,j){return new Promise(function(r,R){var k=sap.ushell.Container,l,n;if(!j){j={};}else{n=Object.keys(j).length;if(n>1||(n===1&&!j.componentData)){R("`oConfig` argument should either be an empty object or contain only the `componentData` property.");return;}}if(j.componentData){delete j.componentData.startupParameters;delete j.componentData.config;delete j.componentData["sap-xapp-state"];}l=e.constructShellHash(e.parseShellHash(I));if(!l){R("Navigation intent invalid!");return;}k.getServiceAsync("NavTargetResolution").then(function(N){N.resolveHashFragment("#"+l).then(function(v){function w(y){y=q.extend(true,{},y,j);if(!y.ui5ComponentName){if(y.additionalInformation){y.ui5ComponentName=y.additionalInformation.replace(/^SAPUI5\.Component=/,"");}else if(y.name){y.ui5ComponentName=y.name;}}return y;}if(v.applicationType===c.URL.type&&v.appCapabilities&&v.appCapabilities.appFrameworkId==="UI5"&&sap.ushell.Container.inAppRuntime()){sap.ui["require"](["sap/ushell/appRuntime/ui5/services/AppLifeCycleAgent"],function(y){y.getAppInfo(v.appCapabilities.technicalAppComponentId).then(function(z){z=w(z);x({ui5ComponentName:v.appCapabilities.technicalAppComponentId,applicationDependencies:z,url:z.url});});});}else if(v.applicationType!==c.URL.type&&!(/^SAPUI5\.Component=/.test(v.additionalInformation))){R("The resolved target mapping is not of type UI5 component.");}else{x(v);}function x(y){k.getServiceAsync("Ui5ComponentLoader").then(function(z){y=w(y);y.loadDefaultDependencies=false;z.createComponentData(y).then(function(B){r(B);},function(E){E=E||"";L.error("Cannot get UI5 component data: "+E,E.stack,"sap.ushell.services.CrossApplicationNavigation");R(E);});});}});});});};this.createEmptyAppState=function(j,k,P,l){L.warning("Deprecated API call of 'sap.ushell.CrossApplicationNavigation.createEmptyAppState'. Please use 'createEmptyAppStateAsync' instead",null,"sap.ushell.services.CrossApplicationNavigation");var n=sap.ushell.Container.getService("AppState");if(!(j instanceof sap.ui.core.UIComponent)){throw new Error("The passed oAppComponent must be a UI5 Component.");}return n.createEmptyAppState(j,k,P,l);};this.createEmptyAppStateAsync=function(j,k,P,l){if(!(j instanceof sap.ui.core.UIComponent)){return Promise.reject("The passed oAppComponent must be a UI5 Component.");}return sap.ushell.Container.getServiceAsync("AppState").then(function(n){return n.createEmptyAppState(j,k,P,l);});};this.getStartupAppState=function(j){this._checkComponent(j);var k=j.getComponentData()&&j.getComponentData()["sap-xapp-state"]&&j.getComponentData()["sap-xapp-state"][0];return this.getAppState(j,k);};this._checkComponent=function(j){if(!(j instanceof sap.ui.core.UIComponent)){throw new Error("oComponent passed must be a UI5 Component");}};this.getAppState=function(j,k){var l;var D=new q.Deferred();this._checkComponent(j);sap.ushell.Container.getServiceAsync("AppState").then(function(n){if(typeof k!=="string"){if(k!==undefined){L.error("Illegal Argument sAppStateKey ");}setTimeout(function(){l=n.createEmptyUnmodifiableAppState(j);D.resolve(l);},0);return;}n.getAppState(k).done(D.resolve).fail(D.reject);});return D.promise();};this.getAppStateData=function(j){return b.invokeUnfoldingArrayArguments(this._getAppStateData.bind(this),[j]);};this._getAppStateData=function(j){var D=new q.Deferred();sap.ushell.Container.getServiceAsync("AppState").then(function(k){if(typeof j!=="string"){if(j!==undefined){L.error("Illegal Argument sAppStateKey ");}setTimeout(function(){D.resolve(undefined);},0);}else{k.getAppState(j).done(function(l){D.resolve(l.getData());}).fail(D.resolve.bind(D,undefined));}});return D.promise();};this.saveMultipleAppStates=function(j){var r=[],D=new q.Deferred();j.forEach(function(k){r.push(k.save());});q.when.apply(this,r).done(function(){D.resolve(r);}).fail(function(){D.reject("save failed");});return D.promise();};this._processShellHashWithParams=function(j){if(j&&j.processParams===true&&j.target&&j.target.shellHash&&j.params){var H=e.parseShellHash(j.target.shellHash);j.target={semanticObject:H.semanticObject,action:H.action,contextRaw:H.contextRaw};j.appSpecificRoute=H.appSpecificRoute;j.params=Object.assign({},j.params,H.params);}};this.getSupportedAppStatePersistencyMethods=function(){L.warning("Deprecated API call of 'sap.ushell.CrossApplicationNavigation.getSupportedAppStatePersistencyMethods'. Please use 'getSupportedAppStatePersistencyMethodsAsync' instead",null,"sap.ushell.services.CrossApplicationNavigation");var j=sap.ushell.Cntainer.getService("AppState");return j.getSupportedPersistencyMethods();};this.getSupportedAppStatePersistencyMethodsAsync=function(){return sap.ushell.Container.getServiceAsync("AppState").then(function(j){return j.getSupportedPersistencyMethods();});};this.makeStatePersistent=function(k,P,j){var D=new q.Deferred();sap.ushell.Container.getServiceAsync("AppState").then(function(l){l.makeStatePersistent(k,P,j).done(D.resolve).fail(D.reject);});return D.promise();};this.resolveIntent=function(H){var D=new q.Deferred();sap.ushell.Container.getServiceAsync("NavTargetResolution").then(function(N){N.resolveHashFragment(H).then(function(r){D.resolve({url:r.url});}).fail(function(M){D.reject(M);});});return D.promise();};}C.hasNoAdapter=true;return C;},true);
