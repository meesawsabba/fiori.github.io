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
sap.ui.define(["require", "exports", "./DataSource"], function (require, exports, DataSource_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UserCategoryDataSource = void 0;
    var UserCategoryDataSource = /** @class */ (function (_super) {
        __extends(UserCategoryDataSource, _super);
        function UserCategoryDataSource(properties) {
            var _a, _b;
            var _this = _super.call(this, properties) || this;
            _this.subDataSources = [];
            _this.undefinedSubDataSourceIds = [];
            _this.subDataSources = (_a = properties.subDataSources) !== null && _a !== void 0 ? _a : _this.subDataSources;
            _this.undefinedSubDataSourceIds =
                (_b = properties.undefinedSubDataSourceIds) !== null && _b !== void 0 ? _b : _this.undefinedSubDataSourceIds;
            return _this;
        }
        // subDataSource
        UserCategoryDataSource.prototype.addSubDataSource = function (dataSource) {
            this.subDataSources.push(dataSource);
        };
        UserCategoryDataSource.prototype.clearSubDataSources = function () {
            this.subDataSources = [];
        };
        UserCategoryDataSource.prototype.getSubDataSources = function () {
            return this.subDataSources;
        };
        UserCategoryDataSource.prototype.hasSubDataSource = function (subDataSourceId) {
            for (var _i = 0, _a = this.subDataSources; _i < _a.length; _i++) {
                var subDataSource = _a[_i];
                //  if (subDataSource) {
                if (subDataSource.id === subDataSourceId) {
                    return true;
                }
                //   }
            }
            return false;
        };
        // undefinedSubDataSourceIds
        UserCategoryDataSource.prototype.addUndefinedSubDataSourceId = function (id) {
            this.undefinedSubDataSourceIds.push(id);
        };
        UserCategoryDataSource.prototype.clearUndefinedSubDataSourceIds = function () {
            this.undefinedSubDataSourceIds = [];
        };
        UserCategoryDataSource.prototype.getUndefinedSubDataSourceIds = function () {
            return this.undefinedSubDataSourceIds;
        };
        return UserCategoryDataSource;
    }(DataSource_1.DataSource));
    exports.UserCategoryDataSource = UserCategoryDataSource;
});
})();