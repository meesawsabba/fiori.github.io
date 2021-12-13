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
sap.ui.define(["require", "exports", "../../sina/AttributeType", "../../sina/util", "../../core/errors"], function (require, exports, AttributeType_1, sinaUtil, errors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.addLeadingZeros = exports.sina2OdataString = exports.sina2OdataDate = exports.odata2SinaDate = exports.sina2OdataTime = exports.odata2SinaTime = exports.sina2OdataTimestamp = exports.odata2SinaTimestamp = exports.odata2Sina = exports.sina2Odata = void 0;
    function sina2Odata(attributeType, value, context) {
        if (context === void 0) { context = {}; }
        switch (attributeType) {
            case AttributeType_1.AttributeType.Double:
                return value.toString();
            case AttributeType_1.AttributeType.Integer:
                return value.toString();
            case AttributeType_1.AttributeType.String:
                return this.sina2OdataString(value, context);
            case AttributeType_1.AttributeType.ImageUrl:
                return value;
            case AttributeType_1.AttributeType.ImageBlob:
                throw new errors_1.NotImplementedError();
            case AttributeType_1.AttributeType.GeoJson:
                return value;
            case AttributeType_1.AttributeType.Date:
                return this.sina2OdataDate(value);
            case AttributeType_1.AttributeType.Time:
                return this.sina2OdataTime(value);
            case AttributeType_1.AttributeType.Timestamp:
                return this.sina2OdataTimestamp(value);
            default:
                throw new errors_1.UnknownAttributeTypeError("unknown attribute type " + attributeType);
        }
    }
    exports.sina2Odata = sina2Odata;
    function odata2Sina(attributeType, value) {
        switch (attributeType) {
            case AttributeType_1.AttributeType.Double:
                return parseFloat(value);
            case AttributeType_1.AttributeType.Integer:
                return parseInt(value, 10);
            case AttributeType_1.AttributeType.String:
                return value;
            case AttributeType_1.AttributeType.ImageUrl:
                return value;
            case AttributeType_1.AttributeType.ImageBlob:
                throw new errors_1.NotImplementedError();
            case AttributeType_1.AttributeType.GeoJson:
                return value;
            case AttributeType_1.AttributeType.Date:
                return this.odata2SinaDate(value);
            case AttributeType_1.AttributeType.Time:
                return this.odata2SinaTime(value);
            case AttributeType_1.AttributeType.Timestamp:
                return this.odata2SinaTimestamp(value);
            default:
                throw new errors_1.UnknownAttributeTypeError("unknown attribute type " + attributeType);
        }
    }
    exports.odata2Sina = odata2Sina;
    function odata2SinaTimestamp(value) {
        if (value === void 0) { value = ""; }
        if (value.length === 0) {
            return "";
        }
        // odata:2017-12-31T23:59:59.0000000Z
        // sina: Date object
        value = value.trim();
        var year = parseInt(value.slice(0, 4), 10);
        var month = parseInt(value.slice(5, 7), 10);
        var day = parseInt(value.slice(8, 10), 10);
        var hour = parseInt(value.slice(11, 13), 10);
        var minute = parseInt(value.slice(14, 16), 10);
        var seconds = parseInt(value.slice(17, 19), 10);
        var microseconds = parseInt(value.slice(20, 20 + 6), 10);
        return new Date(Date.UTC(year, month - 1, day, hour, minute, seconds, microseconds / 1000));
    }
    exports.odata2SinaTimestamp = odata2SinaTimestamp;
    function sina2OdataTimestamp(value) {
        if (typeof value === "string") {
            if (value.length === 0) {
                return "";
            }
            if (value === "$$now$$") {
                value = new Date();
            }
        }
        // odata:2017-12-31T23:59:59.0000000Z
        // sina: Date object
        var year = value.getUTCFullYear();
        var month = value.getUTCMonth() + 1;
        var day = value.getUTCDate();
        var hour = value.getUTCHours();
        var minute = value.getUTCMinutes();
        var seconds = value.getUTCSeconds();
        var microseconds = value.getUTCMilliseconds() * 1000;
        var result = this.addLeadingZeros(year.toString(), 4) +
            "-" +
            this.addLeadingZeros(month.toString(), 2) +
            "-" +
            this.addLeadingZeros(day.toString(), 2) +
            "T" +
            this.addLeadingZeros(hour.toString(), 2) +
            ":" +
            this.addLeadingZeros(minute.toString(), 2) +
            ":" +
            this.addLeadingZeros(seconds.toString(), 2) +
            "." +
            this.addLeadingZeros(microseconds.toString(), 7) +
            "Z";
        return result;
    }
    exports.sina2OdataTimestamp = sina2OdataTimestamp;
    function odata2SinaTime(value) {
        if (value.length === 0) {
            return "";
        }
        // odata: hh:mm:ss
        // sina: hh:mm:ss
        value = value.trim();
        return value;
    }
    exports.odata2SinaTime = odata2SinaTime;
    function sina2OdataTime(value) {
        if (value.length === 0) {
            return "";
        }
        // odata: hh:mm:ss
        // sina: hh:mm:ss
        return value;
    }
    exports.sina2OdataTime = sina2OdataTime;
    function odata2SinaDate(value) {
        if (value.length === 0) {
            return "";
        }
        // odata: YYYY-MM-DD
        // sina: YYYY/MM/DD
        value = value.trim();
        return value.slice(0, 4) + "/" + value.slice(5, 7) + "/" + value.slice(8, 10);
    }
    exports.odata2SinaDate = odata2SinaDate;
    function sina2OdataDate(value) {
        if (value.length === 0) {
            return "";
        }
        // odata: YYYY-MM-DD
        // sina: YYYY/MM/DD
        return value.slice(0, 4) + "-" + value.slice(5, 7) + "-" + value.slice(8, 10);
    }
    exports.sina2OdataDate = sina2OdataDate;
    function sina2OdataString(value, context) {
        return sinaUtil.convertOperator2Wildcards(value, context.operator);
    }
    exports.sina2OdataString = sina2OdataString;
    function addLeadingZeros(value, length) {
        return "00000000000000".slice(0, length - value.length) + value;
    }
    exports.addLeadingZeros = addLeadingZeros;
});
})();