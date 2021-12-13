/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

/* global Proxy, Reflect, Symbol */

(function(){
/* eslint-disable no-useless-escape */
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["require", "exports", "../sina/AttributeSemanticsType", "./errors"], function (require, exports, AttributeSemanticsType_1, errors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.escapeFilterCondition = exports.escapeQuery = exports.appendRemovingDuplicates = exports.extractHighlightedTerms = exports.extractRegExp = exports.evaluateTemplate = exports.escapeRegExp = exports.cacheDecorator = exports.addGeoDataIfAvailable = exports.isMapsAttribute = exports.removePureAdvancedSearchFacets = exports.addPotentialNavTargetsToAttribute = exports.dateFromJson = exports.dateToJson = exports.DelayedConsumer = exports.generateTimestamp = exports.filterString = exports.getUrlParameter = exports.refuseOutdatedResponsesDecorator = exports.timeoutDecorator = exports.sampleProviderInstanceCounter = void 0;
    // eslint-disable-next-line prefer-const
    exports.sampleProviderInstanceCounter = 0;
    function timeoutDecorator(originalFunction, timeout) {
        var decoratedFunction = function () {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            var that = this;
            // eslint-disable-next-line prefer-rest-params
            var args = arguments;
            return new Promise(function (resolve, reject) {
                var outTimed = false;
                var timer = setTimeout(function () {
                    outTimed = true;
                    reject(new errors_1.TimeOutError());
                }, timeout);
                return originalFunction.apply(that, args).then(function (response) {
                    // success
                    if (outTimed) {
                        return;
                    }
                    clearTimeout(timer);
                    resolve(response);
                }, function (error) {
                    // error
                    if (outTimed) {
                        return;
                    }
                    clearTimeout(timer);
                    reject(error);
                });
            });
        };
        return decoratedFunction;
    }
    exports.timeoutDecorator = timeoutDecorator;
    function refuseOutdatedResponsesDecorator(originalFunction) {
        var maxRequestId = 0;
        var decoratedFunction = function () {
            var requestId = ++maxRequestId;
            // eslint-disable-next-line prefer-rest-params
            return originalFunction.apply(this, arguments).then(function (response) {
                // success
                return new Promise(function (resolve) {
                    if (requestId !== maxRequestId) {
                        return; // --> ignore
                    }
                    resolve(response); // --> forward
                });
            }, function (error) {
                // error
                return new Promise(function (resolve, reject) {
                    if (requestId !== maxRequestId) {
                        return; // --> ignore
                    }
                    reject(error); // --> forward
                });
            });
        };
        decoratedFunction.abort = function () {
            ++maxRequestId;
        };
        return decoratedFunction;
    }
    exports.refuseOutdatedResponsesDecorator = refuseOutdatedResponsesDecorator;
    function getUrlParameter(name, url) {
        if (typeof window === "undefined") {
            return null;
        }
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return "";
        }
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    exports.getUrlParameter = getUrlParameter;
    function filterString(text, removeStrings) {
        for (var i = 0; i < removeStrings.length; ++i) {
            var removeString = removeStrings[i];
            var index = 0;
            while (index >= 0) {
                index = text.indexOf(removeString);
                if (index >= 0) {
                    text = text.slice(0, index) + text.slice(index + removeString.length);
                }
            }
        }
        return text;
    }
    exports.filterString = filterString;
    function generateTimestamp() {
        var pad = function (num, size) {
            var s = "000000000" + num;
            return s.substr(s.length - size);
        };
        var d = new Date();
        return ("" +
            d.getUTCFullYear() +
            pad(d.getUTCMonth() + 1, 2) +
            pad(d.getUTCDate(), 2) +
            pad(d.getUTCHours(), 2) +
            pad(d.getUTCMinutes(), 2) +
            pad(d.getUTCSeconds(), 2) +
            pad(d.getUTCMilliseconds(), 3));
    }
    exports.generateTimestamp = generateTimestamp;
    var DelayedConsumer = /** @class */ (function () {
        function DelayedConsumer(properties) {
            properties = properties || {};
            this.timeDelay = properties.timeDelay || 1000;
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            this.consumer = properties.consumer || function () { };
            this.consumerContext = properties.consumerContext || null;
            this.objects = [];
        }
        DelayedConsumer.prototype.add = function (obj) {
            this.objects.push(obj);
            if (this.objects.length === 1) {
                setTimeout(this.consume.bind(this), this.timeDelay);
            }
        };
        DelayedConsumer.prototype.consume = function () {
            this.consumer.apply(this.consumerContext, [this.objects]);
            this.objects = [];
        };
        return DelayedConsumer;
    }());
    exports.DelayedConsumer = DelayedConsumer;
    function dateToJson(date) {
        return {
            type: "Timestamp",
            value: date.toJSON(),
        };
    }
    exports.dateToJson = dateToJson;
    function dateFromJson(jsonDate) {
        if (jsonDate.type !== "Timestamp") {
            throw new errors_1.NoJSONDateError("Not a timestampe " + jsonDate);
        }
        return new Date(jsonDate.value);
    }
    exports.dateFromJson = dateFromJson;
    // export getBaseUrl(url) {
    //     var baseUrl = '';
    //     if (url) {
    //         baseUrl = url;
    //     } else {
    //         url = '/sap/ushell/renderers/fiori2/search/container/';
    //         var indexOfStandalonePath = window.location.pathname.indexOf(url);
    //         if (indexOfStandalonePath > -1) {
    //             baseUrl = window.location.pathname.slice(0, indexOfStandalonePath);
    //         }
    //     }
    //     return baseUrl;
    // };
    function addPotentialNavTargetsToAttribute(resultSet) {
        if (resultSet.items) {
            //not avilable with sample provider
            var items = resultSet.items;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                //the idea of nav targets extended to geo data preparation!
                item = this.addGeoDataIfAvailable(item);
                var attributes = item.detailAttributes;
                for (var j = 0; j < attributes.length; j++) {
                    var attribute = attributes[j];
                    var sina = attribute.sina;
                    var value = attribute.value;
                    var metadata = attribute.metadata;
                    if (typeof value === "string" && attribute.metadata.type !== "ImageUrl") {
                        var emails = value.match(/^[^\0-\x20,:;<>@\[\\\]^_`]+@[^\0-,.-@\[\\\]^_`\{\|\}~]+\.[^\0-,.-@\[\\\]^_`\{\|\}~]+$/g);
                        var fonenrs = value.match(/^(?!\d*$)(?=(?:[()\[\]+\-\/ ]*\d[()\[\]+\-\/ ]*){9,15}$)\+?(?:\d+|\(\d+(?: \d+)*\)|\[\d+\]|[\/ ]|\d-\d)+$/g);
                        var url = value.match(/^https?:\/\/(?=[^\/])\S+$/gi);
                        if (metadata.semantics == AttributeSemanticsType_1.AttributeSemanticsType.EmailAddress) {
                            attribute.defaultNavigationTarget = sina._createNavigationTarget({
                                label: value,
                                targetUrl: "mailto:" + value,
                            });
                        }
                        else if (metadata.semantics == AttributeSemanticsType_1.AttributeSemanticsType.PhoneNr) {
                            attribute.defaultNavigationTarget = sina._createNavigationTarget({
                                label: value,
                                targetUrl: "tel:" + value,
                            });
                        }
                        else if (metadata.semantics == AttributeSemanticsType_1.AttributeSemanticsType.HTTPURL) {
                            attribute.defaultNavigationTarget = sina._createNavigationTarget({
                                label: value,
                                targetUrl: value,
                                target: "_blank",
                            });
                        }
                        else if (emails !== null && emails.length === 1) {
                            attribute.defaultNavigationTarget = sina._createNavigationTarget({
                                label: emails[0],
                                targetUrl: "mailto:" + emails[0],
                            });
                        }
                        else if (fonenrs !== null && fonenrs[0].match(/\d\d\d/) !== null) {
                            attribute.defaultNavigationTarget = sina._createNavigationTarget({
                                label: fonenrs[0],
                                targetUrl: "tel:" + fonenrs[0],
                            });
                        }
                        else if (url !== null && url[0].match(/\w\w\w/) !== null) {
                            attribute.defaultNavigationTarget = sina._createNavigationTarget({
                                label: url[0],
                                targetUrl: url[0],
                                target: "_blank",
                            });
                        }
                    }
                }
            }
        }
        return resultSet;
    }
    exports.addPotentialNavTargetsToAttribute = addPotentialNavTargetsToAttribute;
    function removePureAdvancedSearchFacets(resultSet) {
        var dataSource = resultSet.sina.getDataSource(resultSet.query.filter.dataSource.id);
        for (var i = 0; i < resultSet.facets.length; i++) {
            var attributeId = resultSet.facets[i].query.dimension;
            var attributeMetaData = dataSource.attributeMetadataMap[attributeId];
            if (attributeMetaData &&
                attributeMetaData.usage.AdvancedSearch &&
                attributeMetaData.usage.Facet === undefined) {
                resultSet.facets.splice(i, 1);
                i = i - 1;
            }
        }
        return resultSet;
    }
    exports.removePureAdvancedSearchFacets = removePureAdvancedSearchFacets;
    function isMapsAttribute(attribute, returnOnlyBool, i) {
        var res = false;
        var lat, lon, latIndex, lonIndex, latAttribName, lonAttribName;
        var name = attribute.id;
        var val = attribute.value;
        if (name.match(/latitude/i) !== null) {
            if (!isNaN(val)) {
                latAttribName = name;
                lat = val;
                latIndex = i;
            }
            res = true;
        }
        else if (name.match(/longitude/i) !== null) {
            if (!isNaN(val)) {
                lonAttribName = name;
                lon = val;
                lonIndex = i;
            }
            res = true;
        }
        else if (name.match(/LOC_4326/)) {
            lonIndex = i;
            latIndex = i;
            var oLoc4326 = JSON.parse(val);
            var aCoordinates = oLoc4326.coordinates;
            if (aCoordinates && aCoordinates.length > 1) {
                lon = aCoordinates[0];
                lat = aCoordinates[1];
            }
            res = true;
        }
        if (returnOnlyBool === undefined || returnOnlyBool === true) {
            return res;
        }
        return {
            lat: lat,
            lon: lon,
            latAttribName: latAttribName,
            lonAttribName: lonAttribName,
            latIndex: latIndex,
            lonIndex: lonIndex,
        };
    }
    exports.isMapsAttribute = isMapsAttribute;
    function addGeoDataIfAvailable(itemData) {
        //augment with new geodata attribute
        var res, lat, lon, dataSource, latIndex, lonIndex;
        var attributes = itemData.detailAttributes;
        for (var i = 0; i < attributes.length; i++) {
            res = this.isMapsAttribute(attributes[i], false, i);
            lat = res.lat ? res.lat : lat;
            lon = res.lon ? res.lon : lon;
            latIndex = res.latIndex ? res.latIndex : latIndex;
            lonIndex = res.lonIndex ? res.lonIndex : lonIndex;
            if (lat && lon) {
                break;
            }
        }
        if (lat && lon) {
            //remove lat and long from searchRsultITems
            if (latIndex === lonIndex) {
                attributes.splice(latIndex, 1);
            }
            else if (latIndex > lonIndex) {
                attributes.splice(latIndex, 1);
                attributes.splice(lonIndex, 1);
            }
            else {
                attributes.splice(lonIndex, 1);
                attributes.splice(latIndex, 1);
            }
            var newMetadata = {
                sina: itemData.sina,
                type: "GeoJson",
                id: "LOC_4326",
                label: "LOC_4326",
                isCurrency: false,
                IsBoolean: false,
                IsKey: false,
                IsSortable: true,
                isUnitOfMeasure: false,
                semanticObjectType: [],
                usage: {
                    Map: "coordinates",
                },
            };
            //creaate new attribute and check whtether geojson metadata exists
            var valStr = '{ "type": "Point", "coordinates": [' + lon + ", " + lat + ", 0] }";
            var newAttribute = {
                id: "LOC_4326",
                label: "LOC_4326",
                isHighlighted: false,
                value: valStr,
                valueFormatted: valStr,
                valueHighlighted: itemData.sina,
                metadata: newMetadata,
                sina: itemData.sina,
            };
            attributes.push(newAttribute);
            dataSource = itemData.sina.getDataSource(itemData.dataSource.id);
            if (!dataSource.attributeMetadataMap.LOC_4326) {
                dataSource.attributesMetadata.push(newMetadata);
                dataSource.attributeMetadataMap.LOC_4326 = newMetadata;
            }
            else {
                dataSource.attributeMetadataMap.LOC_4326.type = "GeoJson";
                dataSource.attributeMetadataMap.LOC_4326.usage = {
                    Map: "coordinates",
                };
            }
        }
        return itemData;
    }
    exports.addGeoDataIfAvailable = addGeoDataIfAvailable;
    function cacheDecorator(originalFunction) {
        var map = {};
        return function (id) {
            if (Object.prototype.hasOwnProperty.call(map, id)) {
                return map[id];
            }
            var value = originalFunction.apply(this, [id]);
            map[id] = value;
            return value;
        };
    }
    exports.cacheDecorator = cacheDecorator;
    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
    exports.escapeRegExp = escapeRegExp;
    function evaluateTemplate(template, obj) {
        var placeholderRegExp = new RegExp("{{([^{}]*)}}");
        var getProperty = function (template) {
            var match = placeholderRegExp.exec(template);
            if (!match) {
                return null;
            }
            return match[1];
        };
        var replaceProperty = function (template, property, value) {
            var propertyRegExp = new RegExp("{{" + escapeRegExp(property) + "}}", "g");
            template = template.replace(propertyRegExp, value);
            return template;
        };
        var execute = function (template) {
            var property = getProperty(template);
            if (!property) {
                return template;
            }
            template = replaceProperty(template, property, obj[property]);
            return execute(template);
        };
        return execute(template);
    }
    exports.evaluateTemplate = evaluateTemplate;
    exports.extractRegExp = new RegExp("<b>(.*?)<\\/b>", "g");
    function extractHighlightedTerms(text) {
        var match;
        var result = [];
        do {
            match = exports.extractRegExp.exec(text);
            if (match) {
                result.push(match[1]);
            }
        } while (match);
        return result;
    }
    exports.extractHighlightedTerms = extractHighlightedTerms;
    function appendRemovingDuplicates(list1, list2) {
        for (var i = 0; i < list2.length; ++i) {
            var element = list2[i];
            if (list1.indexOf(element) < 0) {
                list1.push(element);
            }
        }
    }
    exports.appendRemovingDuplicates = appendRemovingDuplicates;
    var reservedCharacters = ["\\", "-", "(", ")", "~", "^", "?", '"', ":", "'", "[", "]"];
    var reservedWords = ["AND", "OR", "NOT"];
    var reservedCharacters4FilterCondition = ["\\", '"', "*", "?", "'"];
    function replaceAll(original, search, replacement) {
        return original.split(search).join(replacement);
    }
    function escapeQuery(query) {
        var escapedQuery = query.trim();
        for (var _i = 0, reservedCharacters_1 = reservedCharacters; _i < reservedCharacters_1.length; _i++) {
            var specialCharacter = reservedCharacters_1[_i];
            if (specialCharacter === "'") {
                escapedQuery = replaceAll(escapedQuery, specialCharacter, "''");
            }
            else {
                escapedQuery = replaceAll(escapedQuery, specialCharacter, "\\" + specialCharacter);
            }
        }
        for (var _a = 0, reservedWords_1 = reservedWords; _a < reservedWords_1.length; _a++) {
            var specialWord = reservedWords_1[_a];
            if (escapedQuery === specialWord) {
                escapedQuery = '"' + specialWord + '"';
            }
            if (escapedQuery.startsWith(specialWord + " ")) {
                escapedQuery = '"' + specialWord + '" ' + escapedQuery.substring(specialWord.length + 1);
            }
            if (escapedQuery.endsWith(" " + specialWord)) {
                escapedQuery =
                    escapedQuery.substring(0, escapedQuery.length - (specialWord.length + 1)) +
                        ' "' +
                        specialWord +
                        '"';
            }
            escapedQuery = replaceAll(escapedQuery, " " + specialWord + " ", ' "' + specialWord + '" ');
        }
        if (escapedQuery === "") {
            escapedQuery = "*"; // asterisk
        }
        return escapedQuery;
    }
    exports.escapeQuery = escapeQuery;
    function escapeFilterCondition(query) {
        var escapedQuery = query.trim();
        for (var _i = 0, reservedCharacters4FilterCondition_1 = reservedCharacters4FilterCondition; _i < reservedCharacters4FilterCondition_1.length; _i++) {
            var specialCharacter = reservedCharacters4FilterCondition_1[_i];
            if (specialCharacter === "'") {
                escapedQuery = replaceAll(escapedQuery, specialCharacter, "''");
            }
            else {
                escapedQuery = replaceAll(escapedQuery, specialCharacter, "\\" + specialCharacter);
            }
        }
        if (escapedQuery === "") {
            escapedQuery = "*"; // asterisk
        }
        return escapedQuery;
    }
    exports.escapeFilterCondition = escapeFilterCondition;
});
})();