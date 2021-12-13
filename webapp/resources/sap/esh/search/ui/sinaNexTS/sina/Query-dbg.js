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
sap.ui.define(["require", "exports", "../core/core", "../core/util", "./SinaObject", "./Filter", "./DataSourceType", "./LogicalOperator", "../core/errors"], function (require, exports, core, util, SinaObject_1, Filter_1, DataSourceType_1, LogicalOperator_1, errors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Query = void 0;
    var Query = /** @class */ (function (_super) {
        __extends(Query, _super);
        function Query(properties) {
            var _a, _b, _c, _d, _e;
            var _this = _super.call(this, properties) || this;
            _this.requestTimeout = false;
            _this.top = (_a = properties.top) !== null && _a !== void 0 ? _a : 10;
            _this.skip = (_b = properties.skip) !== null && _b !== void 0 ? _b : 0;
            _this.sortOrder = (_c = properties.sortOrder) !== null && _c !== void 0 ? _c : [];
            _this.filter = (_e = (_d = properties.filter) !== null && _d !== void 0 ? _d : _this.filter) !== null && _e !== void 0 ? _e : new Filter_1.Filter({ sina: _this.sina });
            _this.icon = properties.icon;
            _this.label = properties.label;
            if (properties.dataSource) {
                _this.filter.setDataSource(properties.dataSource);
            }
            if (properties.searchTerm) {
                _this.filter.setSearchTerm(properties.searchTerm);
            }
            if (properties.rootCondition) {
                _this.filter.setRootCondition(properties.rootCondition);
            }
            if (_this.requestTimeout) {
                // this._execute = util.timeoutDecorator(this._execute, this.requestTimeout);
            }
            _this._execute = util.refuseOutdatedResponsesDecorator(_this._execute);
            return _this;
        }
        Query.prototype.setTop = function (top) {
            if (top === void 0) { top = 10; }
            this.top = top;
        };
        Query.prototype.setSkip = function (skip) {
            if (skip === void 0) { skip = 0; }
            this.skip = skip;
        };
        Query.prototype.setSortOrder = function (sortOrder) {
            this.sortOrder = sortOrder;
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Query.prototype._execute = function () {
            var _args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _args[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, Promise.resolve()];
                });
            });
        };
        Query.prototype.clone = function () {
            return;
        };
        Query.prototype.equals = function (other /*, mode?: EqualsMode */) {
            return (other instanceof Query &&
                this.icon === other.icon &&
                this.label === other.label &&
                this.top === other.top &&
                this.skip === other.skip &&
                this.filter.equals(other.filter) &&
                core.equals(this.sortOrder, other.sortOrder));
        };
        Query.prototype.abort = function () {
            // TODO: Promise has no abort
            // this._execute.abort(); // call abort on decorator
        };
        Query.prototype.getResultSetAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                var resultSet;
                return __generator(this, function (_a) {
                    if (this._lastQuery) {
                        // if query has not changed -> return existing result set
                        if (this.equals(this._lastQuery
                        // EqualsMode.CheckFireQuery
                        )) {
                            return [2 /*return*/, this._resultSetPromise];
                        }
                        // filter changed -> set skip=0
                        if (!this.filter.equals(this._lastQuery.filter)) {
                            this.setSkip(0);
                        }
                    }
                    // create a read only clone
                    this._lastQuery = this._createReadOnlyClone();
                    this._resultSetPromise = Promise.resolve()
                        .then(function () {
                        return this._execute(this._lastQuery);
                    }.bind(this))
                        .then(function (iResultSet) {
                        resultSet = iResultSet;
                        return this._formatResultSetAsync(resultSet); // formatter modifies result set
                    }.bind(this))
                        .then(function () {
                        return resultSet;
                    }.bind(this));
                    return [2 /*return*/, this._resultSetPromise];
                });
            });
        };
        Query.prototype._genericFilteredQueryTransform = function (query) {
            if (query.filter.dataSource.type !== DataSourceType_1.DataSourceType.BusinessObject ||
                query.filter.dataSource.subType !== DataSourceType_1.DataSourceSubType.Filtered ||
                !query.filter.dataSource.filterCondition) {
                return query;
            }
            var transformedQuery = query.clone();
            var rootCondition;
            if (query.filter.rootCondition.conditions.length > 0) {
                rootCondition = this.sina.createComplexCondition({
                    operator: LogicalOperator_1.LogicalOperator.And,
                    conditions: [query.filter.dataSource.filterCondition, query.filter.rootCondition],
                    // internal: true // TODO: what is this?
                });
            }
            else {
                rootCondition = query.filter.dataSource.filterCondition;
            }
            var filter = this.sina.createFilter({
                dataSource: query.filter.dataSource.dataSource,
                searchTerm: query.filter.searchTerm,
                rootCondition: rootCondition,
            });
            transformedQuery.filter = filter; // do not call setter because this would invalidate top and skip
            return transformedQuery;
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Query.prototype._formatResultSetAsync = function (resultSet) {
            return Promise.resolve();
        };
        Query.prototype._setResultSet = function (resultSet) {
            this._lastQuery = this._createReadOnlyClone();
            this._resultSetPromise = Promise.resolve()
                .then(function () {
                return this._formatResultSetAsync(resultSet);
            }.bind(this))
                .then(function () {
                return resultSet;
            });
            return this._resultSetPromise;
        };
        Query.prototype._createReadOnlyClone = function () {
            var query = this.clone();
            query.getResultSetAsync = function () {
                throw new errors_1.QueryIsReadOnlyError("this query is readonly");
            };
            return query;
        };
        Query.prototype.resetResultSet = function () {
            this._lastQuery = null;
            this._resultSetPromise = null;
        };
        Query.prototype.getSearchTerm = function () {
            return this.filter.searchTerm;
        };
        Query.prototype.getDataSource = function () {
            return this.filter.dataSource;
        };
        Query.prototype.getRootCondition = function () {
            return this.filter.rootCondition;
        };
        Query.prototype.setSearchTerm = function (searchTerm) {
            this.filter.setSearchTerm(searchTerm);
        };
        Query.prototype.setDataSource = function (dataSource) {
            this.filter.setDataSource(dataSource);
        };
        Query.prototype.setRootCondition = function (rootCondition) {
            this.filter.setRootCondition(rootCondition);
        };
        Query.prototype.resetConditions = function () {
            this.filter.resetConditions();
        };
        Query.prototype.autoInsertCondition = function (condition) {
            this.filter.autoInsertCondition(condition);
        };
        Query.prototype.autoRemoveCondition = function (condition) {
            this.filter.autoRemoveCondition(condition);
        };
        Query.prototype.setFilter = function (filter) {
            if (!this.filter.equals(filter)) {
                this.setSkip(0);
            }
            this.filter = filter;
        };
        return Query;
    }(SinaObject_1.SinaObject));
    exports.Query = Query;
});
})();