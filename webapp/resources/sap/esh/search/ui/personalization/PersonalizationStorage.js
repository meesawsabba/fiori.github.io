/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/esh/search/ui/personalization/FLPPersonalizationStorage","sap/esh/search/ui/personalization/BrowserPersonalizationStorage","sap/esh/search/ui/personalization/MemoryPersonalizationStorage",],function(F,B,M){"use strict";var P={instance:null,create:function(p,i){switch(p){case"auto":if(i){return F.create();}else{return B.create();}case"browser":return B.create();case"flp":return F.create();case"memory":return M.create();default:return Promise.reject(new Error("Unknown Personalization Storage: "+p));}},};return P;});
