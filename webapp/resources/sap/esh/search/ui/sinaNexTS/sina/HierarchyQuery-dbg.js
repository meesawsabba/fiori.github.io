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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
sap.ui.define(["require", "exports", "./DataSourceType", "./FacetQuery"], function (require, exports, DataSourceType_1, FacetQuery_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HierarchyQuery = void 0;
    var HierarchyQuery = /** @class */ (function (_super) {
        __extends(HierarchyQuery, _super);
        function HierarchyQuery(properties) {
            var _a;
            var _this = _super.call(this, properties) || this;
            _this.top = (_a = properties.top) !== null && _a !== void 0 ? _a : 30;
            _this.attributeId = properties.attributeId;
            _this.nodeId = properties.nodeId;
            return _this;
        }
        HierarchyQuery.prototype.equals = function (other /*, mode?: EqualsMode*/) {
            return other instanceof HierarchyQuery && _super.prototype.equals.call(this, other) && this.nodeId === other.nodeId;
        };
        HierarchyQuery.prototype.clone = function () {
            return new HierarchyQuery({
                label: this.label,
                icon: this.icon,
                top: this.top,
                skip: this.skip,
                sortOrder: this.sortOrder,
                filter: this.filter.clone(),
                searchTerm: this.getSearchTerm(),
                sina: this.sina,
                attributeId: this.attributeId,
                nodeId: this.nodeId,
            });
        };
        HierarchyQuery.prototype._execute = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this._doExecuteHierarchyQuery(query)];
                });
            });
        };
        HierarchyQuery.prototype._doExecuteHierarchyQuery = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var transformedQuery, resultSet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transformedQuery = this._filteredQueryTransform(query);
                            return [4 /*yield*/, this.sina.provider.executeHierarchyQuery(transformedQuery)];
                        case 1:
                            resultSet = _a.sent();
                            return [2 /*return*/, this._filteredQueryBackTransform(query, resultSet)];
                    }
                });
            });
        };
        HierarchyQuery.prototype._filteredQueryTransform = function (query) {
            return this._genericFilteredQueryTransform(query);
        };
        HierarchyQuery.prototype._filteredQueryBackTransform = function (query, resultSet) {
            if (query.filter.dataSource.type !== DataSourceType_1.DataSourceType.BusinessObject ||
                query.filter.dataSource.subType !== DataSourceType_1.DataSourceSubType.Filtered) {
                return resultSet;
            }
            resultSet.query = query;
            return resultSet;
        };
        return HierarchyQuery;
    }(FacetQuery_1.FacetQuery));
    exports.HierarchyQuery = HierarchyQuery;
});
})();