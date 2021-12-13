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
sap.ui.define(["require", "exports", "./SinaObject", "./DataSourceType", "../core/errors"], function (require, exports, SinaObject_1, DataSourceType_1, errors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataSource = void 0;
    var DataSource = /** @class */ (function (_super) {
        __extends(DataSource, _super);
        function DataSource(properties) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            var _this = _super.call(this, { sina: properties.sina }) || this;
            _this.hidden = false;
            _this.usage = {};
            _this.attributesMetadata = [];
            _this.attributeMetadataMap = {};
            _this.attributeGroupsMetadata = [];
            _this.attributeGroupMetadataMap = {};
            _this.annotations = (_a = properties.annotations) !== null && _a !== void 0 ? _a : _this.annotations;
            _this.type = (_b = properties.type) !== null && _b !== void 0 ? _b : _this.type;
            _this.subType = properties.subType;
            _this.id = (_c = properties.id) !== null && _c !== void 0 ? _c : _this.id;
            _this.label = (_d = properties.label) !== null && _d !== void 0 ? _d : _this.label;
            _this.labelPlural = (_e = properties.labelPlural) !== null && _e !== void 0 ? _e : _this.labelPlural;
            _this.icon = properties.icon;
            _this.hidden = (_f = properties.hidden) !== null && _f !== void 0 ? _f : _this.hidden;
            _this.usage = (_g = properties.usage) !== null && _g !== void 0 ? _g : _this.usage;
            _this.attributesMetadata = (_h = properties.attributesMetadata) !== null && _h !== void 0 ? _h : _this.attributesMetadata;
            _this.attributeMetadataMap = (_j = properties.attributeMetadataMap) !== null && _j !== void 0 ? _j : _this.attributeMetadataMap;
            _this.attributeGroupsMetadata = (_k = properties.attributeGroupsMetadata) !== null && _k !== void 0 ? _k : _this.attributeGroupsMetadata;
            _this.attributeGroupMetadataMap =
                (_l = properties.attributeGroupMetadataMap) !== null && _l !== void 0 ? _l : _this.attributeGroupMetadataMap;
            if (!_this.labelPlural || _this.labelPlural.length === 0) {
                _this.labelPlural = _this.label;
            }
            if (_this.type === DataSourceType_1.DataSourceType.BusinessObject && _this.attributesMetadata.length === 0) {
                /*      throw new DataSourceAttributeMetadataNotFoundError(
                    "Could not find metadata for attributes in data source " + this.id + ". "
                );*/
            }
            _this.attributeMetadataMap = _this.createAttributeMetadataMap(_this.attributesMetadata);
            return _this;
        }
        DataSource.getAllDataSource = function () {
            return new DataSource({
                id: "All",
                label: "All",
                type: DataSourceType_1.DataSourceType.Category,
            });
        };
        // equals(): boolean {
        //     throw new Error(
        //         "use === operator for comparison of datasources"
        //     );
        // }
        DataSource.prototype._configure = function () {
            // do not use
            // legacy: only called from inav2 provider
            var formatters = this.sina.metadataFormatters;
            if (!formatters) {
                return;
            }
            for (var i = 0; i < formatters.length; ++i) {
                var formatter = formatters[i];
                formatter.format({
                    dataSources: [this],
                });
            }
        };
        DataSource.prototype.createAttributeMetadataMap = function (attributesMetadata) {
            if (attributesMetadata === void 0) { attributesMetadata = []; }
            var map = {};
            for (var i = 0; i < attributesMetadata.length; ++i) {
                var attributeMetadata = attributesMetadata[i];
                map[attributeMetadata.id] = attributeMetadata;
            }
            return map;
        };
        DataSource.prototype.getAttributeMetadata = function (id) {
            if (typeof this.attributeMetadataMap[id] === "undefined") {
                throw new errors_1.DataSourceAttributeMetadataNotFoundError("Could not find metadata for attribute " + id + " in data source " + this.id + ". ");
            }
            return this.attributeMetadataMap[id];
        };
        DataSource.prototype.toJson = function () {
            return {
                type: this.type,
                id: this.id,
                label: this.label,
                labelPlural: this.labelPlural,
            };
        };
        return DataSource;
    }(SinaObject_1.SinaObject));
    exports.DataSource = DataSource;
});
})();