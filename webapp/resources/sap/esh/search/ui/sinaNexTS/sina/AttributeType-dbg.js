/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

/* global Proxy, Reflect, Symbol */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AttributeType = void 0;
    var AttributeType;
    (function (AttributeType) {
        AttributeType["Double"] = "Double";
        AttributeType["Integer"] = "Integer";
        AttributeType["String"] = "String";
        AttributeType["ImageUrl"] = "ImageUrl";
        AttributeType["ImageBlob"] = "ImageBlob";
        AttributeType["GeoJson"] = "GeoJson";
        AttributeType["Date"] = "Date";
        AttributeType["Time"] = "Time";
        AttributeType["Timestamp"] = "Timestamp";
        AttributeType["Group"] = "Group";
        AttributeType["INAV2_SearchTerms"] = "$$SearchTerms$$";
        AttributeType["INAV2_SuggestionTerms"] = "$$SuggestionTerms$$";
    })(AttributeType = exports.AttributeType || (exports.AttributeType = {}));
});
})();