/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/esh/search/ui/SearchHelper"],function(H){"use strict";var T=H.Tester;var a=(sap.esh.search.ui.controls.SearchTileHighlighter=function(){this.init.apply(this,arguments);});a.prototype={init:function(){},setHighlightTerms:function(h){this.tester=new T(h,"sapUshellSearchHighlight",true,"or");},highlight:function(t){var n=t.getDomRef();if(!n){return;}var h=sap.ui.core.hyphenation.Hyphenation.getInstance();if(!h.isLanguageInitialized()){h.initialize().then(function(){this.doHighlight(n);}.bind(this));}else{this.doHighlight(n);}},doHighlight:function(n){if(n.nodeType===window.Node.TEXT_NODE){this.highlightTextNode(n);return;}for(var i=0;i<n.childNodes.length;++i){var c=n.childNodes[i];this.doHighlight(c);}},_softHyphenRegExp:new RegExp("[\u00ad]","g"),removeSoftHyphens:function(t){return t.replace(this._softHyphenRegExp,"");},highlightTextNode:function(n){var t=this.tester.test(this.removeSoftHyphens(n.textContent));if(!t.bMatch){return;}var s=document.createElement("span");s.innerHTML=jQuery.sap.encodeHTML(t.sHighlightedText);H.boldTagUnescaper(s,"sapUshellSearchHighlight");n.parentNode.insertBefore(s,n);n.parentNode.removeChild(n);},};return a;});
