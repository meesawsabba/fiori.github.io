/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

/* global Proxy, Reflect, Symbol */

(function(){
/* eslint-disable @typescript-eslint/no-this-alias */
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
sap.ui.define(["require", "exports", "./Formatter", "../AttributeType"], function (require, exports, Formatter_1, AttributeType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ResultValueFormatter = void 0;
    var ResultValueFormatter = /** @class */ (function (_super) {
        __extends(ResultValueFormatter, _super);
        function ResultValueFormatter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        ResultValueFormatter.prototype.initAsync = function () {
            return Promise.resolve();
        };
        ResultValueFormatter.prototype.format = function (resultSet) {
            return this._formatDataInUI5Form(resultSet);
        };
        ResultValueFormatter.prototype.formatAsync = function (resultSet) {
            resultSet = this._formatDataInUI5Form(resultSet);
            return Promise.resolve(resultSet);
        };
        ResultValueFormatter.prototype._formatDataInUI5Form = function (resultSet) {
            if (typeof window === "undefined" ||
                typeof window.sap === "undefined" ||
                typeof window.sap.ui === "undefined" ||
                typeof window.sap.ui.core === "undefined" ||
                typeof window.sap.ui.core.format === "undefined") {
                return resultSet;
            }
            var that = this;
            that.sina = resultSet.sina;
            resultSet.items.forEach(function (item) {
                if (that.sina.getDataSource(item.dataSource.id) === undefined) {
                    return;
                }
                if (jQuery.isEmptyObject(that.sina.getDataSource(item.dataSource.id).attributeMetadataMap)) {
                    return;
                }
                that.attributeMap = that.sina.getDataSource(item.dataSource.id).attributeMetadataMap;
                item.titleAttributes.forEach(function (attribute) {
                    that._formatHybridAttribute(attribute);
                });
                item.titleDescriptionAttributes.forEach(function (attribute) {
                    that._formatHybridAttribute(attribute);
                });
                item.detailAttributes.forEach(function (attribute) {
                    that._formatHybridAttribute(attribute);
                });
            });
            return resultSet;
        };
        ResultValueFormatter.prototype._formatHybridAttribute = function (attribute) {
            var that = this;
            if (attribute.metadata.type && attribute.metadata.type === AttributeType_1.AttributeType.Group) {
                // group attributes
                for (var i = 0; i < attribute.attributes.length; i++) {
                    // recursive formatting
                    that._formatHybridAttribute(attribute.attributes[i].attribute);
                }
            }
            else {
                // single attribute
                that._formatSingleAttribute(attribute);
            }
        };
        ResultValueFormatter.prototype._formatSingleAttribute = function (attribute) {
            var that = this;
            attribute.valueFormatted = that._getFormattedValue(attribute);
            if (attribute.valueHighlighted === undefined || attribute.valueHighlighted.length === 0) {
                attribute.valueHighlighted = attribute.valueFormatted;
                if (attribute.isHighlighted) {
                    // add client-side highlighted value
                    attribute.valueHighlighted = "<b>" + attribute.valueHighlighted + "</b>";
                }
            }
        };
        ResultValueFormatter.prototype._getFormattedValue = function (attribute) {
            if (this.attributeMap[attribute.id] === undefined) {
                // return server-side valueFormatted
                return attribute.valueFormatted;
            }
            var type = AttributeType_1.AttributeType;
            var ui5Format = undefined;
            var valueDate;
            var attributeValueFormatted = attribute.valueFormatted || attribute.value;
            switch (this.attributeMap[attribute.id].type) {
                case type.Integer:
                    ui5Format = window.sap.ui.core.format.NumberFormat.getIntegerInstance();
                    break;
                case type.Double:
                    ui5Format = window.sap.ui.core.format.NumberFormat.getFloatInstance({
                    //"decimals": 2 // not to restrict
                    });
                    break;
                case type.Timestamp:
                    // Date Object: Wed Jan 17 2018 11:48:59 GMT+0100 (Central European Standard Time)
                    if (isNaN(Date.parse(attribute.value)) === false) {
                        ui5Format = window.sap.ui.core.format.DateFormat.getDateTimeInstance();
                        valueDate = new Date(attribute.value);
                    }
                    break;
                case type.Date:
                    // "2019/01/16" -> Date Object: Wed Jan 16 2018 00:00:00 GMT+0100 (Central European Standard Time)
                    if (isNaN(Date.parse(attribute.value)) === false) {
                        ui5Format = window.sap.ui.core.format.DateFormat.getDateInstance();
                        valueDate = new Date(attribute.value);
                    }
                    break;
                case type.Time:
                    // "00:40:32" -> Date Object: Wed Jan 01 1970 00:40:32 GMT+0100 (Central European Standard Time)
                    if (isNaN(Date.parse("1970/01/01 " + attribute.value)) === false) {
                        ui5Format = window.sap.ui.core.format.DateFormat.getTimeInstance();
                        valueDate = new Date("1970/01/01 " + attribute.value);
                    }
                    break;
            }
            if (valueDate && ui5Format && ui5Format.format(valueDate) !== undefined) {
                // return client-side UI5 formatted value
                attributeValueFormatted = ui5Format.format(valueDate);
            }
            // return server-side valueFormatted
            return attributeValueFormatted;
        };
        return ResultValueFormatter;
    }(Formatter_1.Formatter));
    exports.ResultValueFormatter = ResultValueFormatter;
});
})();