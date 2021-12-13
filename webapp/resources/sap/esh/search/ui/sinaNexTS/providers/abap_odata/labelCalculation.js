/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["require","exports","../../core/LabelCalculator"],function(r,e,L){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.createLabelCalculator=void 0;function c(){return new L.LabelCalculator({key:function(d){return[d.labelPlural,d._private.system,d._private.client];},data:function(d){return{label:d.label,labelPlural:d.labelPlural,};},setLabel:function(d,l,a){l[0]=a.label;d.label=l.join(" ");l[0]=a.labelPlural;d.labelPlural=l.join(" ");},setFallbackLabel:function(d,a){d.label=a.label+" duplicate "+d.id;d.labelPlural=d.label;},});}e.createLabelCalculator=c;});})();
