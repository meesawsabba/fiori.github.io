sap.ui.define(["sap/rules/ui/ast/model/Term","sap/rules/ui/ast/constants/Constants"],function(t,c){'use strict';var T=function(){this._vocabId='';this._termsIdMap={};this._termsNameMap={};this._termsLabelMap={};};T.prototype.reset=function(){this._vocabId='';this._termsIdMap={};this._termsNameMap={};this._termsLabelMap={};};var i;T.prototype._getAllAttrsRefsAssocsForDataObject=function(a){var l=[],b;var d=a.split(c.DOT).length;for(var e in this._termsIdMap){b=this._termsIdMap[e];if(e.startsWith(a+c.DOT)&&(b.getBusinessDataType()||b.getDataObjectType()==='AO'||b.getDataObjectType()==='R')&&(e.split(c.DOT).length)<=d+1){l.push(b);}}return l;};T.prototype._getTermsNotStartingWithPrefix=function(a){var l=[],b;for(var d in this._termsIdMap){b=this._termsIdMap[d];if(!d.startsWith(a)&&(b._dataObjectType==='S'||b._isDataObjectElement)){l.push(b);}}return l;};T.prototype._getAllAttrsRefersAndAssocsForDataObjectByName=function(n){var l=[],a,b;var d=n.split(c.DOT).length;for(var e in this._termsNameMap){a=this._termsNameMap[e];b=a.getTermName();if(b.startsWith(n+c.DOT)&&(a.getBusinessDataType()||a.getDataObjectType()==='AO'||a.getDataObjectType()==='R')&&(b.split(c.DOT).length)<=d+1){l.push(a);}}return l;};T.prototype._getAllAttributesByPrefixIdAndBusinessType=function(p,b){var a=[],d,e;var f=p.split(c.DOT).length;for(var g in this._termsIdMap){d=this._termsIdMap[g];e=d.getTermId();if(e&&e&&e.startsWith(p+c.DOT)&&(d.getBusinessDataType()&&d.getBusinessDataType()===b)&&(e.split(c.DOT).length)<=(f+1)){a.push(d);}}return a;};T.prototype._getAllAttributesByPrefixNameAndBusinessType=function(p,b){var a=[],d,e;var f=p.split(c.DOT).length;for(var g in this._termsNameMap){d=this._termsNameMap[g];e=d.getTermName();if(e.startsWith(p+c.DOT)&&(d.getBusinessDataType()&&d.getBusinessDataType()===b)&&(e.split(c.DOT).length)<=(f+1)){a.push(d);}}return a;};T.prototype._getAttributesGivenPrefixId=function(p,b){var a=[],d,e;var f=p.split(c.DOT).length;for(var g in this._termsIdMap){d=this._termsIdMap[g];e=d.getTermId();if(e&&e&&e.startsWith(p+c.DOT)&&d.getDataObjectType()!='AO'&&d.getDataObjectType()!='R'&&(e.split(c.DOT).length)<=(f+1)){a.push(d);}}return a;};T.prototype._getAllDataObjects=function(){var d=[],a,b;for(var e in this._termsIdMap){b=this._termsIdMap[e];a=b?b.getDataObjectType():"";if(a&&(('E'.localeCompare(a)===0&&b._bussinessDataType===null)||('E'.localeCompare(a)!=0&&'R'.localeCompare(a)&&'AO'.localeCompare(a)!=0&&b&&b.type!==c.RULE))){d.push(b);}}return d;};T.prototype._getAllVocabularyRules=function(){var v=[],a,b;for(var d in this._termsIdMap){b=this._termsIdMap[d];a=b?b.Type:"";if(a&&a===c.RULE){v.push(b);}}return v;};T.prototype.setVocabularyId=function(v){this._vocabId=v;return this;};T.prototype.createTerm=function(a,b,d,v,e,l,h,f){return new t().setTermName(a).setTermId(b).setBusinessDataType(d).setVocaId(v).setDataObjectType(e).setLabel(l).setHasValueSource(h).setCardinality(f);};T.prototype.addToTermsIdMap=function(k,v){this._termsIdMap[k]=v;};T.prototype.addToTermsNameMap=function(k,v){this._termsNameMap[k]=v;};T.prototype.addToTermsLabelMap=function(k,v){this._termsLabelMap[k]=v;};T.prototype.getTermByTermId=function(a){var o=this._termsIdMap[a];if(o){return o;}else{for(var k in this._termsIdMap){var b=this._termsIdMap[k];if(b&&b.getTermId().indexOf(a)>=0&&b.getDataObjectType()){return b;}}}return o;};T.prototype.getTermByTermName=function(a){return this._termsNameMap[a];};T.prototype.getTermByTermLabel=function(a){return this._termsLabelMap[a];};T.prototype.getAllTerms=function(){var a=[];for(var k in this._termsIdMap){a.push(this._termsIdMap[k]);}return a;};T.prototype.getTermsById=function(a){if(this._vocabId===a||!a){return this._getAllDataObjects();}var b,d;b=this._termsIdMap[a];if(b){d=b.getDataObjectType();if(d&&('E'.localeCompare(d)!=0)&&(c.ELEMENT.localeCompare(d)!=0)){return this._getAllAttrsRefsAssocsForDataObject(a);}}return[];};T.prototype.getTermsByName=function(n){if(!n){return _getAllDataObjects();}var a,d;a=this._termsNameMap[n];if(a){d=a.getDataObjectType();if(d&&(c.ELEMENT.localeCompare(d)!=0)){return this._getAllAttrsRefersAndAssocsForDataObjectByName(n);}}return[];};T.prototype.getTermsByBusinessDataType=function(b){var a=[];for(var k in this._termsIdMap){var d=this._termsIdMap[k];if(d.getBusinessDataType()===b){a.push(d);}}return a;};T.prototype.getTermsByPrefixIdAndBusinessDataType=function(p,b){return this._getAllAttributesByPrefixIdAndBusinessType(p,b);};T.prototype.getTermsByPrefixNameAndBusinessDataType=function(p,b){return this._getAllAttributesByPrefixNameAndBusinessType(p,b);};T.prototype.getDOTermsByBusinessDataType=function(b){var d=this._getAllDataObjects();var f=[];var a=[];var e;if(d){for(var g=0;g<d.length;g++){e=d[g];a=this.getTermsByPrefixIdBusinessAndDOType(e.getTermId(),['E'],b);if(a&&a.length>0){f.push(e);}}}return f;};T.prototype.getTermsByDataObjectType=function(d){var a=[];var b;for(var k in this._termsIdMap){b=this._termsIdMap[k];if(b&&b.getDataObjectType()===d){a.push(b);}}return a;};T.prototype.getTermsByDataObjectTypeAndPrefixId=function(p,d){var a;var f=[];var b=this.getTermsById(p);if(b){for(var e=0;e<b.length;e++){a=b[e];if(a.getDataObjectType()===d){f.push(a);}}}return f;};T.prototype.getTermsByDataObjectTypeAndPrefixName=function(p,d){var a;var f=[];var b=this.getTermsByName(p);if(b){for(var e=0;e<b.length;e++){a=b[e];if(a.getDataObjectType()===d){f.push(a);}}}return f;};T.prototype._getTermsByBusinessType=function(a,b){var f=[];var d;for(var e=0;e<a.length;e++){d=a[e];if(d&&d.getBusinessDataType()===b){f.push(d);}}return f;};T.prototype.getTermsByBusinessAndDOType=function(d,b){var a=this.getTermsByDataObjectType(d);var f=[];var e=[];for(var g=0;g<a.length;g++){e=this.getTermsById(a[g].getTermId());f.push.apply(f,this._getTermsByBusinessType(e,b));}return f;};T.prototype.getTermsByPrefixIdBusinessAndDOType=function(p,d,b){var a,e;var f=[];var g=this.getTermsById(p);if(g){for(var h=0;h<g.length;h++){a=g[h];for(var j=0;j<d.length;j++){e=d[j];if(a.getDataObjectType()===e&&a.getBusinessDataType()===b){f.push(a);}}}}return f;};T.prototype.getTermsByPrefixNameBusinessAndDOType=function(p,d,b){var a,e;var f=[];var g=this.getTermsByName(p);if(g){for(var h=0;h<g.length;h++){a=g[h];for(var j=0;j<d.length;j++){e=d[j];if(a.getDataObjectType()===e&&a.getBusinessDataType()===b){f.push(a);}}}}return f;};T.prototype.getAssociationsGivenPrefixName=function(p){var a;var f=[];var b=this.getTermsByName(p);if(b&&b.length>0){for(var d=0;d<b.length;d++){a=b[d];if(a.getDataObjectType()=='AO'){f.push(a);}}};return f;};T.prototype.getReferencesGivenPrefixName=function(p){var a;var f=[];var b=this.getTermsByName(p);if(b&&b.length>0){for(var d=0;d<b.length;d++){a=b[d];if(a.getDataObjectType()=='R'){f.push(a);}}};return f;};T.prototype.getAssociationsGivenPrefixId=function(p){var a;var f=[];var b=this.getTermsById(p);if(b&&b.length>0){for(var d=0;d<b.length;d++){a=b[d];if(a.getDataObjectType()=='AO'){f.push(a);}}};return f;};T.prototype.getReferencesGivenPrefixId=function(p){var a;var f=[];var b=this.getTermsById(p);if(b&&b.length>0){for(var d=0;d<b.length;d++){a=b[d];if(a.getDataObjectType()=='R'){f.push(a);}}};return f;};T.prototype.isTermParentEntity=function(a){if(a){var o=this.getTermByTermId(a);if(o&&(o._dataObjectType==="S"||o._dataObjectType==="T"||o._isDataObjectElement||(o.Type&&o.Type==="Rule"))){return true;}}return false;};return{getInstance:function(){if(!i){i=new T();i.constructor=null;}return i;}};},true);
