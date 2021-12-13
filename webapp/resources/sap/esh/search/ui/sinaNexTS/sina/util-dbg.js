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
sap.ui.define(["require", "exports", "./ComparisonOperator"], function (require, exports, ComparisonOperator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.convertOperator2Wildcards = void 0;
    function convertOperator2Wildcards(value, operator) {
        if (operator === ComparisonOperator_1.ComparisonOperator.Eq) {
            return value;
        }
        var result = [];
        var values = value.split(" ");
        for (var i = 0; i < values.length; i++) {
            var trimedValue = values[i].trim();
            if (trimedValue.length === 0) {
                continue;
            }
            switch (operator) {
                case ComparisonOperator_1.ComparisonOperator.Co:
                    trimedValue = "*" + trimedValue + "*";
                    break;
                case ComparisonOperator_1.ComparisonOperator.Bw:
                    trimedValue = trimedValue + "*";
                    break;
                case ComparisonOperator_1.ComparisonOperator.Ew:
                    trimedValue = "*" + trimedValue;
                    break;
                default:
                    break;
            }
            result.push(trimedValue);
        }
        return result.join(" ");
    }
    exports.convertOperator2Wildcards = convertOperator2Wildcards;
});
})();