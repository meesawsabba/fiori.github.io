/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/esh/search/ui/SearchNavigationObject"],function(S){"use strict";return S.extend("sap.esh.search.ui.SearchNavigationObjectForSinaNavTarget",{constructor:function(s,m){S.prototype.constructor.apply(this,arguments);this._sinaNavigationTarget=s;this.setHref(s.targetUrl);this.setText(s.label);this.setTarget(s.target);this.sina=this._sinaNavigationTarget.sina;},performNavigation:function(p){this._model.config.beforeNavigation(this._model);this._sinaNavigationTarget.performNavigation(p);},getResultSet:function(){return this.getResultSetItem().parent;},getResultSetItem:function(){var p=this._sinaNavigationTarget.parent;if(this.sina.SearchResultSetItemAttribute&&p instanceof this.sina.SearchResultSetItemAttribute){p=p.parent;}if(this.sina.SearchResultSetItem&&!(p instanceof this.sina.SearchResultSetItem)){throw"programm error";}if(this.sina.ObjectSuggestion&&p.parent instanceof this.sina.ObjectSuggestion){p=p.parent;}return p;},getResultSetId:function(){return this.getResultSet().id;},getPositionInList:function(){var r=this.getResultSet();var a=this.getResultSetItem();return r.items.indexOf(a);},});});
