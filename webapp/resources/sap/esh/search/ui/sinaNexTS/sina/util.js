/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["require","exports","./ComparisonOperator"],function(r,e,C){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.convertOperator2Wildcards=void 0;function c(v,o){if(o===C.ComparisonOperator.Eq){return v;}var a=[];var b=v.split(" ");for(var i=0;i<b.length;i++){var t=b[i].trim();if(t.length===0){continue;}switch(o){case C.ComparisonOperator.Co:t="*"+t+"*";break;case C.ComparisonOperator.Bw:t=t+"*";break;case C.ComparisonOperator.Ew:t="*"+t;break;default:break;}a.push(t);}return a.join(" ");}e.convertOperator2Wildcards=c;});})();
