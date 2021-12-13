/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["require","exports"],function(r,e){"use strict";Object.defineProperty(e,"__esModule",{value:true});e._getLanguageCountryObject=e.getLanguagePreferences=void 0;function g(){var a=typeof window.InstallTrigger!=="undefined";var b=false||!!document.documentMode;var c=!b&&!!window.StyleMedia;var d=!!window.chrome&&!!window.chrome.webstore;var l=[];if(b||c){var f=window.navigator.browserLanguage||window.navigator.language;l.splice(0,0,this._getLanguageCountryObject(f));}else if(a||d){var h=window.navigator.language;var j=window.navigator.languages.slice();var k=j.indexOf(h);if(k>-1){j.splice(k,1);}l.splice(0,0,this._getLanguageCountryObject(h));for(var i=0;i<j.length;i++){var m=this._getLanguageCountryObject(j[i]);if(m){l.splice(l.length,0,m);}}}else{l.splice(0,0,this._getLanguageCountryObject(window.navigator.language));}return l;}e.getLanguagePreferences=g;function _(l){var a,c;var b={};if(l.length===2){a=l;c="";}else if(l.length===5&&l.indexOf("-")===2){a=l.substr(0,2);c=l.substr(3);}else{return undefined;}b.Language=a;b.Country=c;return b;}e._getLanguageCountryObject=_;});})();
