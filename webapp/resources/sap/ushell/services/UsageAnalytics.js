// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/thirdparty/jquery","sap/base/Log","sap/ui/Device"],function(q,L,D){"use strict";function U(c,p,S){var o=(S&&S.config)||{},a=[],A=false,i=false,l,I;window.oCustomProperties={};this.setLegalText=function(t){l=t;if(I){this.init(I.usageAnalyticsTitle,I.iAgree,I.iDisagree,I.remindMeLater);}};this.getLegalText=function(){return l;};this.setTrackUsageAnalytics=function(s){var d=q.Deferred();var u=sap.ushell.Container.getUser();var O=u.getTrackUsageAnalytics();sap.ushell.Container.getServiceAsync("UserInfo").then(function(b){if(O!==s){u.setTrackUsageAnalytics(s);var e=b.updateUserPreferences(u);e.done(function(){u.resetChangedProperty("trackUsageAnalytics");if(!i&&s){this.start();}else if(i&&s===false){window.swa.disable();}else if(i&&s){window.swa.enable();}d.resolve();}.bind(this));e.fail(function(E){u.setTrackUsageAnalytics(O);u.resetChangedProperty("trackUsageAnalytics");L.error(E);d.reject(E);});}else{d.resolve();}}.bind(this)).catch(function(){L.error("Getting UserInfo service failed.");d.reject("Getting UserInfo service failed.");});return d.promise();};this.showLegalPopup=function(){sap.ui.require(["sap/m/Text","sap/m/Dialog","sap/m/Button","sap/m/library"],function(T,b,B,m){var d=m.ButtonType;var e=new b("agreementMessageBox",{title:I.usageAnalyticsTitle,type:"Message",stretch:D.system.phone,buttons:[new B("remindMeLaterButton",{text:I.remindMeLater,press:function(){e.close();}}),new B("iAgreeButton",{text:I.iAgree,type:d.Emphasized,press:function(){this.setTrackUsageAnalytics(true);e.close();}.bind(this)}),new B("iDisagreeButton",{text:I.iDisagree,press:function(){this.setTrackUsageAnalytics(false);e.close();}.bind(this)})],afterClose:function(){e.destroy();},content:new T({text:l})}).addStyleClass("sapUshellUsageAnalyticsPopUp").addStyleClass("sapContrastPlus");e.open();}.bind(this));};this.systemEnabled=function(){if(!o.enabled||!o.pubToken||(this.isSetUsageAnalyticsPermitted()&&!l)){if(!o.pubToken){L.warning("No valid pubToken was found in the service configuration");}if(!l){L.warning("No Legal text message found.");}return false;}return true;};this.userEnabled=function(){var u=sap.ushell.Container.getUser();if(!this.systemEnabled()){return false;}return u.getTrackUsageAnalytics();};this.start=function(){sap.ui.getCore().getEventBus().publish("sap.ushell.services.UsageAnalytics","usageAnalyticsStarted");this._initUsageAnalyticsLogging();i=true;window.swa.custom2={ref:sap.ui.getCore().getConfiguration().getLanguage()};};this.init=function(u,s,b,r){I={usageAnalyticsTitle:u,iAgree:s,iDisagree:b,remindMeLater:r};if(this.systemEnabled()&&!i){if(!this.isSetUsageAnalyticsPermitted()){this.start();}else if(l){if(this.userEnabled()===true){this.start();}else if(this.userEnabled()===null||this.userEnabled()===undefined){this.showLegalPopup();}}}};this.setCustomAttributes=function(C){var b,P="attribute",s,d="custom",e,f,F="customFunction";if(!this.userEnabled()&&this.isSetUsageAnalyticsPermitted()){return;}for(b=1;b<6;b++){e=d.concat(b+4);if(window.swa[e]!==undefined){continue;}s=P+b;if(C[s]===undefined){continue;}if(q.isFunction(C[s])){f=F+b;window[f]=C[s];window.swa[e]={ref:f};}else{window.swa[e]={ref:C[s]};}}};this.logCustomEvent=function(e,b,d){if(!this.userEnabled()&&this.isSetUsageAnalyticsPermitted()){return;}if(!this._isAnalyticsScriptLoaded()){this._addDelayedEvent(e,b,d);return;}if(d){d.unshift(b);d.unshift(e);window.swa.trackCustomEvent.apply(window.swa.trackCustomEvent,d);}else{window.swa.trackCustomEvent(e,b);}};window._trackingScriptsLoaded=function(){var b,t;A=true;for(b=0;b<a.length;b++){t=a[b];this.logCustomEvent(t.eventType,t.customEventValue,t.aAdditionalValues);}a=null;};this._initUsageAnalyticsLogging=function(){if(window.swa===undefined){window.swa={};}window.swa.pubToken=o.pubToken;window.swa.baseUrl=o.baseUrl;window.swa.bannerEnabled=false;window.swa.loggingEnabled=true;window.swa.visitorCookieTimeout=63113852;window.swa.dntLevel=1;window.swa.trackerReadyCallback=window._trackingScriptsLoaded.bind(this);window.swa.clicksEnabled=(o.logClickEvents!==false);window.swa.pageLoadEnabled=(o.logPageLoadEvents!==false);this._handlingTrackingScripts();};this._handlingTrackingScripts=function(){var d=document,g=d.createElement("script"),s=d.getElementsByTagName("script")[0];g.onerror=function(){L.warning("SWA scripts not loaded!");};g.type="text/javascript";g.defer=true;g.async=true;g.src=window.swa.baseUrl+"js/privacy.js";s.parentNode.insertBefore(g,s);};this._isAnalyticsScriptLoaded=function(){return A;};this.isSetUsageAnalyticsPermitted=function(){if(o.setUsageAnalyticsPermitted===undefined){return true;}return o.setUsageAnalyticsPermitted;};this._addDelayedEvent=function(e,b,d){var f={eventType:e,customEventValue:b,aAdditionalValues:d};a.push(f);};}U.hasNoAdapter=true;return U;},true);
