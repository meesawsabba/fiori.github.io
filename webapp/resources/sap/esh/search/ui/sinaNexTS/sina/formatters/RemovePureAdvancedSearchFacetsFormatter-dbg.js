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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
sap.ui.define(["require", "exports", "../../core/util", "./Formatter"], function (require, exports, util, Formatter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RemovePureAdvancedSearchFacetsFormatter = void 0;
    var RemovePureAdvancedSearchFacetsFormatter = /** @class */ (function (_super) {
        __extends(RemovePureAdvancedSearchFacetsFormatter, _super);
        function RemovePureAdvancedSearchFacetsFormatter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        RemovePureAdvancedSearchFacetsFormatter.prototype.initAsync = function () {
            return Promise.resolve();
        };
        RemovePureAdvancedSearchFacetsFormatter.prototype.format = function (resultSet) {
            return util.removePureAdvancedSearchFacets(resultSet);
        };
        RemovePureAdvancedSearchFacetsFormatter.prototype.formatAsync = function (resultSet) {
            resultSet = util.removePureAdvancedSearchFacets(resultSet); //find emails phone nrs etc and augment attribute if required
            return Promise.resolve(resultSet);
        };
        return RemovePureAdvancedSearchFacetsFormatter;
    }(Formatter_1.Formatter));
    exports.RemovePureAdvancedSearchFacetsFormatter = RemovePureAdvancedSearchFacetsFormatter;
});
})();