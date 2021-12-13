/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["require","exports","./configurators/CustomFunctionConfigurator","./configurators/ListConfigurator","./configurators/ObjectConfigurator","./configurators/TemplateConfigurator","./configurators/TextResourceConfigurator","./configurators/SimpleValueConfigurator"],function(r,e,C,L,O,T,a,S){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.createConfiguratorAsync=void 0;var c=[C.CustomFunctionConfigurator,L.ListConfigurator,O.ObjectConfigurator,T.TemplateConfigurator,a.TextResourceConfigurator,S.SimpleValueConfigurator,];function b(o){o.createConfiguratorAsync=b;for(var i=0;i<c.length;++i){var d=c[i];if(d.prototype.isSuitable(o)){return _(d,o);}}}e.createConfiguratorAsync=b;function _(d,o){var f=new d(o);return Promise.resolve().then(function(){return f.initResourceBundleAsync();}).then(function(){return f.initAsync();}).then(function(){return f;});}});})();
