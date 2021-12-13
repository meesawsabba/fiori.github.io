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
    exports.ComparisonOperator = void 0;
    var ComparisonOperator;
    (function (ComparisonOperator) {
        ComparisonOperator["Eq"] = "Eq";
        ComparisonOperator["Ne"] = "Ne";
        ComparisonOperator["Gt"] = "Gt";
        ComparisonOperator["Lt"] = "Lt";
        ComparisonOperator["Ge"] = "Ge";
        ComparisonOperator["Le"] = "Le";
        ComparisonOperator["Co"] = "Co";
        ComparisonOperator["Bw"] = "Bw";
        ComparisonOperator["Ew"] = "Ew";
        ComparisonOperator["ChildOf"] = "ChildOf";
        ComparisonOperator["DescendantOf"] = "DescendantOf";
    })(ComparisonOperator = exports.ComparisonOperator || (exports.ComparisonOperator = {}));
});
})();