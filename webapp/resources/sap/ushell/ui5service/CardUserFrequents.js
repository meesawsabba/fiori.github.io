// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/ui5service/_CardUserRecents/CardUserRecentsBase","sap/ushell/EventHub","sap/ushell/Config"],function(C,E,c){"use strict";var d=C.extend("sap.ushell.ui5service.CardUserFrequents");d.prototype.getData=function(){if(!c.last("/core/shell/model/enableTrackingActivity")){return Promise.resolve([]);}return this.oUserRecentsPromise.then(function(u){return new Promise(function(r,a){u.getFrequentActivity().done(function(f){r(this._getActivitiesAsCardItems(f));}.bind(this)).fail(function(e){a(e);});}.bind(this));}.bind(this));};d.prototype.attachDataChanged=function(u){E.on("newUserRecentsItem").do(function(r){var U=this._sortAsFrequentActivities(r.recentUsageArray);var a=[];for(var i=0;i<U.length;i++){a.push(U[i].oItem);}var p=this._getActivitiesAsCardItems(a);u({data:p});}.bind(this));E.on("userRecentsCleared").do(function(){u({data:[]});});};d.prototype._sortAsFrequentActivities=function(r){var A,w=0,f=[],o,p=r[0]?new Date(r[0].iTimestamp):undefined,e;for(A=0;A<r.length&&w<30;A++){o=r[A];if(o.iCount>1){f.push(o);}e=new Date(o.iTimestamp);if(p.toDateString()!==e.toDateString()){w++;p=e;}}f.sort(function(a,b){return b.iCount-a.iCount;});return f.slice(0,30);};d.prototype.detachDataChanged=function(){E.on("newUserRecentsItem").off();E.on("userRecentsCleared").off();};d.hasNoAdapter=true;return d;},true);
