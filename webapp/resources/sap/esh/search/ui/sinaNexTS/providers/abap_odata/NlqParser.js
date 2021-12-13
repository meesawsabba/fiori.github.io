/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["require","exports"],function(r,e){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.NlqParser=void 0;var N=(function(){function N(p){this.provider=p;this.sina=p.sina;}N.prototype.getActiveResult=function(a){for(var i=0;i<a.length;++i){var b=a[i];if(b.IsCurrentQuery){return b;}}return null;};N.prototype.parse=function(d){var n={success:false,description:"",};if(!d||!d.ResultList||!d.ResultList.NLQQueries||!d.ResultList.NLQQueries.results){return n;}var a=d.ResultList.NLQQueries.results;var b=this.getActiveResult(a);if(!b){return n;}n.success=true;n.description=b.Description;return n;};return N;}());e.NlqParser=N;});})();
