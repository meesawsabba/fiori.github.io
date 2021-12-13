// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/services/ShellNavigationHashChanger","sap/m/MessageBox","sap/ui/core/routing/HashChanger"],function(S,M,H){"use strict";var A=M.Action;var I=M.Icon;function a(c,p,s){function r(){sap.ui.require(["sap/m/MessageBox"],function(M){M.show("Due to a configuration change on the server,\nclient and server are out of sync.\n We strongly recommend to reload the page soon.\nReload page now?",{icon:I.ERROR,title:"Client out of sync with server.",actions:[A.YES,A.NO],onClose:function(b){if(b===A.YES){window.setTimeout(function(){window.location.reload();},0);}}});});}var o=s&&s.config;this.hashChanger=new S(o);this._navigationFilterForForwardingToRegisteredRouters=function(b,h){var m=this._aRouters.some(function(R){return R.match(h);});if(m){var C=b.getCurrentApplication();var i=C&&C.componentInstance&&!C.homePage;if(i){var d=C.componentInstance.getRouter();if(d){d.stop();}}return this.NavigationFilterStatus.Keep;}return this.NavigationFilterStatus.Continue;};this.getNavigationContext=function(){var n=this.hashChanger.getCurrentNavigationState();var i=!this.hashChanger.isInnerAppNavigation(n.oldHash,n.newHash);return{status:n.status,isCrossAppNavigation:i,innerAppRoute:this.hashChanger.getHash()};};this.isInitialNavigation=function(){return this._bIsInitialNavigation;};this.setIsInitialNavigation=function(i){this._bIsInitialNavigation=i;};this.hrefForExternal=function(b,v,C,d){return this.hashChanger.hrefForExternal(b,v,C,d);};this.hrefForAppSpecificHash=function(b){return this.hashChanger.hrefForAppSpecificHash(b);};this.compactParams=function(P,R,C,t){return this.hashChanger.compactParams(P,R,C,t);};this.toExternal=function(b,C,w){return this.hashChanger.toExternal(b,C,w);};this.toAppHash=function(b,w){this.hashChanger.toAppHash(b,w);};this.init=function(f){this._bIsInitialNavigation=true;hasher.prependHash="";H.replaceHashChanger(this.hashChanger);var b=sap.ui.getCore().getEventBus();b.subscribe("sap.ui.core.UnrecoverableClientStateCorruption","RequestReload",r);this.hashChanger.initShellNavigation(f);this._enableHistoryEntryReplacedDetection();return this;};this._enableHistoryEntryReplacedDetection=function(){this._lastHashChangeMode=null;this._fnOriginalSetHash=hasher.setHash;this._fnOriginalReplaceHash=hasher.replaceHash;hasher.setHash=function(){this._hashChangedByApp=true;this._lastHashChangeMode="setHash";return this._fnOriginalSetHash.apply(hasher,arguments);}.bind(this);hasher.replaceHash=function(){this._hashChangedByApp=true;this._lastHashChangeMode="replaceHash";return this._fnOriginalReplaceHash.apply(hasher,arguments);}.bind(this);};this.wasHistoryEntryReplaced=function(){return this._lastHashChangeMode==="replaceHash";};this.resetHistoryEntryReplaced=function(){this._lastHashChangeMode=null;};this.replaceHashWithoutNavigation=function(n){hasher.changed.active=false;this._fnOriginalSetHash(n);hasher.changed.active=true;};this.NavigationFilterStatus=this.hashChanger.NavigationFilterStatus;this.registerNavigationFilter=function(f){this.hashChanger.registerNavigationFilter(f);};this._aRouters=[];this.registerExtraRouter=function(R){this._aRouters.push(R);};this.unregisterNavigationFilter=function(f){this.hashChanger.unregisterNavigationFilter(f);};this.registerNavigationFilter(function(){if(!this._hashChangedByApp){this.resetHistoryEntryReplaced();}this._hashChangedByApp=undefined;return this.NavigationFilterStatus.Continue;}.bind(this));this.registerPrivateFilters=function(b){this.registerNavigationFilter(this._navigationFilterForForwardingToRegisteredRouters.bind(this,b));};}a.hasNoAdapter=true;return a;},true);
