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
sap.ui.define(["require", "exports", "./SinaObject", "../core/Log", "../core/core"], function (require, exports, SinaObject_1, Log_1, core) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ResultSet = void 0;
    var ResultSet = /** @class */ (function (_super) {
        __extends(ResultSet, _super);
        function ResultSet(properties) {
            var _a, _b, _c, _d, _e;
            var _this = _super.call(this, properties) || this;
            // _meta: {
            //     properties: {
            //         id: {
            //             required: false,
            //             default: function () {
            //                 return core.generateId();
            //             }
            //         },
            //         title: {
            //             required: true
            //         },
            //         items: {
            //             required: false,
            //             default: function () {
            //                 return [];
            //             },
            //             aggregation: true
            //         },
            //         query: {
            //             required: true
            //         },
            //         log: {
            //             required: false,
            //             default: function () {
            //                 return new Log();
            //             }
            //         }
            //     }
            // },
            _this.id = core.generateId();
            _this.items = [];
            _this.log = new Log_1.Log();
            _this.id = (_a = properties.id) !== null && _a !== void 0 ? _a : _this.id;
            _this.title = (_b = properties.title) !== null && _b !== void 0 ? _b : _this.title;
            _this.items = (_c = properties.items) !== null && _c !== void 0 ? _c : _this.items;
            _this.query = (_d = properties.query) !== null && _d !== void 0 ? _d : _this.query;
            _this.log = (_e = properties.log) !== null && _e !== void 0 ? _e : _this.log;
            return _this;
        }
        ResultSet.prototype.toString = function () {
            var result = [];
            for (var i = 0; i < this.items.length; ++i) {
                var item = this.items[i];
                result.push(item.toString());
            }
            return result.join("\n");
        };
        return ResultSet;
    }(SinaObject_1.SinaObject));
    exports.ResultSet = ResultSet;
});
})();