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
/* global XMLHttpRequest, require */
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
sap.ui.define(["require", "exports", "./errors"], function (require, exports, errors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Client = exports.request = exports.addEncodedUrlParameters = exports.encodeUrlParameters = exports.parseHeaders = exports.RecordingMode = void 0;
    var RecordingMode;
    (function (RecordingMode) {
        RecordingMode["NONE"] = "none";
        RecordingMode["RECORD"] = "record";
        RecordingMode["REPLAY"] = "replay";
    })(RecordingMode = exports.RecordingMode || (exports.RecordingMode = {}));
    function parseHeaders(header) {
        var headers = {};
        var lines = header.split("\n");
        for (var i = 0; i < lines.length; ++i) {
            var line = lines[i];
            var index = line.indexOf(":");
            if (index >= 0) {
                var name_1 = line.slice(0, index).toLowerCase(); // headers are case insensitive -> normalize to lower case
                var value = line.slice(index + 1);
                headers[name_1] = value.trim();
            }
        }
        return headers;
    }
    exports.parseHeaders = parseHeaders;
    function encodeUrlParameters(parameters) {
        var result = [];
        for (var name_2 in parameters) {
            var value = parameters[name_2];
            result.push(encodeURIComponent(name_2) + "=" + encodeURIComponent(value + ""));
        }
        return result.join("&");
    }
    exports.encodeUrlParameters = encodeUrlParameters;
    function addEncodedUrlParameters(url, parameters) {
        if (!parameters) {
            return url;
        }
        var encodedParameters = encodeUrlParameters(parameters);
        if (encodedParameters.length > 0) {
            url += "?" + encodedParameters;
        }
        return url;
    }
    exports.addEncodedUrlParameters = addEncodedUrlParameters;
    function request(properties) {
        return __awaiter(this, void 0, void 0, function () {
            var fetch_1, https, agent, config, url, mapToObj, res, text, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(typeof window !== "undefined")) return [3 /*break*/, 1];
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                // Browser
                                // new http request
                                var xhttp = new XMLHttpRequest();
                                // callback handler
                                xhttp.onreadystatechange = function () {
                                    if (xhttp.readyState == 4 &&
                                        (xhttp.status == 200 || xhttp.status == 201 || xhttp.status == 204)) {
                                        resolve({
                                            data: xhttp.responseText || "{}",
                                            headers: parseHeaders(xhttp.getAllResponseHeaders()),
                                        });
                                        return;
                                    }
                                    if (xhttp.readyState == 4) {
                                        reject(errors_1.ajaxErrorFactory(xhttp, parseHeaders(xhttp.getAllResponseHeaders())));
                                    }
                                };
                                // add url parameters to url
                                var url = addEncodedUrlParameters(properties.url, properties.parameters);
                                // write headers to http request
                                xhttp.open(properties.method, url, true);
                                for (var headerName in properties.headers) {
                                    var headerValue = properties.headers[headerName];
                                    xhttp.setRequestHeader(headerName, headerValue);
                                }
                                // send
                                xhttp.send(properties.data);
                            })];
                    case 1:
                        fetch_1 = require("node-fetch");
                        https = properties.url.startsWith("https") ? require("https") : require("http");
                        agent = new https.Agent({
                            rejectUnauthorized: false,
                        });
                        config = {
                            agent: agent,
                            headers: properties.headers,
                            method: properties.method,
                        };
                        if (typeof properties.data !== "undefined") {
                            config.body = properties.data;
                        }
                        url = addEncodedUrlParameters(properties.url, properties.parameters);
                        mapToObj = function (headerMap) {
                            // node-fetch puts every value in an array somehow.
                            // here we unpack it if array only has one value.
                            var responseHeaders = {};
                            for (var key in headerMap) {
                                var value = headerMap[key];
                                if (value instanceof Array && value.length === 1) {
                                    responseHeaders[key] = value[0];
                                }
                                else {
                                    responseHeaders[key] = value;
                                }
                            }
                            return responseHeaders;
                        };
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 7, , 8]);
                        return [4 /*yield*/, fetch_1(url, config)];
                    case 3:
                        res = _a.sent();
                        if (!res.ok) return [3 /*break*/, 5];
                        return [4 /*yield*/, res.text()];
                    case 4:
                        text = _a.sent();
                        return [2 /*return*/, {
                                data: text || "{}",
                                headers: mapToObj(res.headers.raw()),
                            }];
                    case 5: throw errors_1.ajaxErrorFactory(res);
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_1 = _a.sent();
                        throw errors_1.ajaxErrorFactory(error_1);
                    case 8: return [2 /*return*/];
                }
            });
        });
    }
    exports.request = request;
    var Client = /** @class */ (function () {
        function Client(properties) {
            var _a;
            this._client = new _Client(properties);
            this.recordOptions = {
                headers: properties.recordingHeaders,
                mode: (_a = properties.recordingMode) !== null && _a !== void 0 ? _a : RecordingMode.NONE,
                path: properties.recordingPath,
                requestNormalization: properties.requestNormalization || this._defaultRequestNormalization,
            };
            if (typeof window !== "undefined" && this.recordOptions.mode !== RecordingMode.NONE) {
                throw new errors_1.InternalESHClientError("Record/Replay is only supported on Node.js");
            }
            this.records = {};
            if (this.recordOptions.mode === RecordingMode.REPLAY) {
                this.records = require(properties.recordingPath);
            }
        }
        Client.prototype._encodeObj = function (data) {
            var aResult = [];
            for (var prop in data) {
                if (Object.prototype.hasOwnProperty.call(data, prop)) {
                    aResult.push(encodeURIComponent(prop) + "=" + encodeURIComponent(data[prop]));
                }
            }
            return aResult.join("&");
        };
        Client.prototype.getJson = function (url, data) {
            var that = this;
            if (data) {
                var sData = "?" + that._encodeObj(data);
                url = url + sData;
            }
            if (that.recordOptions.mode === "none") {
                return that._client.getJson(url);
            }
            if (that.recordOptions.mode === "replay") {
                return that._replay(url, null);
            }
            return that._client.getJson(url).then(function (response) {
                return that._record(url, null, response);
            });
        };
        Client.prototype.getXML = function (url) {
            return __awaiter(this, void 0, void 0, function () {
                var that;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            that = this;
                            if (that.recordOptions.mode === "none") {
                                return [2 /*return*/, that._client.getXML(url)];
                            }
                            if (!(that.recordOptions.mode === "replay")) return [3 /*break*/, 2];
                            return [4 /*yield*/, that._replay(url, null)];
                        case 1: return [2 /*return*/, (_a.sent()).data];
                        case 2: return [2 /*return*/, that._client.getXML(url).then(function (response) {
                                return that._record(url, null, response);
                            })];
                    }
                });
            });
        };
        Client.prototype.postJson = function (url, payload) {
            // avoid to modifeid by the next call
            payload = JSON.parse(JSON.stringify(payload));
            var that = this;
            if (that.recordOptions.mode === "none") {
                return that._client.postJson(url, payload);
            }
            if (that.recordOptions.mode === "replay") {
                return that._replay(url, payload);
            }
            return that._client.postJson(url, payload).then(function (response) {
                return that._record(url, payload, response);
            });
        };
        Client.prototype.mergeJson = function (url, payload) {
            // avoid to modifeid by the next call
            payload = JSON.parse(JSON.stringify(payload));
            var that = this;
            if (that.recordOptions.mode === "none") {
                return that._client.mergeJson(url, payload);
            }
            if (that.recordOptions.mode === "replay") {
                return that._replay(url, payload);
            }
            return that._client.mergeJson(url, payload).then(function (response) {
                return that._record(url, payload, response);
            });
        };
        Client.prototype.request = function (properties) {
            return this._client.request(properties);
        };
        Client.prototype._record = function (url, payload, response) {
            var that = this;
            var key = url;
            var normalizedPayload = that.recordOptions.requestNormalization(payload);
            if (normalizedPayload) {
                key += JSON.stringify(normalizedPayload);
            }
            if (that.records[key] === undefined && key.indexOf("NotToRecord") === -1) {
                try {
                    that.records[key] = JSON.parse(JSON.stringify(response.data));
                }
                catch (error) {
                    if (error.name === "SyntaxError") {
                        // result was probably a xml string
                        that.records[key] = response + "";
                    }
                    else {
                        throw error;
                    }
                }
            }
            return that._client.putJson(that.recordOptions.path, that.records).then(function () {
                return response;
            });
        };
        // _recordXML(url: string, response: unknown): Promise<typeof response> {
        //     const that = this;
        //     const key = url;
        //     if (that.records[key] === undefined && key.indexOf("NotToRecord") === -1) {
        //         that.records[key] = response;
        //     }
        //     return that._client.putJson(that.recordOptions.path, that.records).then(function () {
        //         return response;
        //     });
        // }
        Client.prototype._replay = function (url, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var that, key, normalizedRequest, record, data, response;
                return __generator(this, function (_a) {
                    that = this;
                    key = url;
                    normalizedRequest = that.recordOptions.requestNormalization(payload);
                    if (normalizedRequest) {
                        key += JSON.stringify(normalizedRequest);
                    }
                    record = this.records[key];
                    switch (typeof record) {
                        case "object": {
                            data = JSON.parse(JSON.stringify(record));
                            response = {
                                data: data,
                            };
                            if (response.data.error || response.data.Error) {
                                return [2 /*return*/, Promise.reject(errors_1.ajaxErrorFactory({
                                        responseText: JSON.stringify(data),
                                    }))];
                            }
                            return [2 /*return*/, response];
                        }
                        case "string":
                            return [2 /*return*/, {
                                    data: record,
                                }];
                        case "undefined": {
                            throw new errors_1.InternalESHClientError("No recording found for request '" + key + "' in file " + this.recordOptions.path);
                        }
                        default:
                            throw new errors_1.InternalESHClientError("Don't know how to serialize recording data of type " + typeof record);
                    }
                    return [2 /*return*/];
                });
            });
        };
        Client.prototype._defaultRequestNormalization = function (payload) {
            if (payload === null) {
                return "";
            }
            delete payload.SessionID;
            delete payload.SessionTimestamp;
            return payload;
        };
        return Client;
    }());
    exports.Client = Client;
    var _Client = /** @class */ (function () {
        function _Client(properties) {
            var _a;
            this.csrf = properties.csrf;
            this.csrfByPassCache = properties.csrfByPassCache || false;
            this.csrfToken = null;
            this.csrfFetchRequest = properties.csrfFetchRequest || null;
            this.recordOptions = {
                headers: properties.recordingHeaders,
                mode: (_a = properties.recordingMode) !== null && _a !== void 0 ? _a : RecordingMode.NONE,
                path: properties.recordingPath,
                requestNormalization: properties.requestNormalization,
            };
            if (typeof window !== "undefined" && this.recordOptions.mode !== RecordingMode.NONE) {
                throw new Error("Record/Replay is only supported on Node.js");
            }
        }
        _Client.getJsonHeaders = function () {
            return {
                "Content-Type": "application/json",
                Accept: "application/json",
            };
        };
        _Client.getXmlHeaders = function () {
            return {
                "Content-Type": "application/xml",
                Accept: "application/xml",
            };
        };
        _Client.prototype.getJson = function (url) {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.request({
                                headers: _Client.getJsonHeaders(),
                                method: "GET",
                                url: url,
                            })];
                        case 1:
                            response = _a.sent();
                            if (typeof response.data === "string") {
                                response.data = JSON.parse(response.data);
                            }
                            return [2 /*return*/, response];
                    }
                });
            });
        };
        _Client.prototype.getXML = function (url) {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.request({
                                headers: _Client.getXmlHeaders(),
                                method: "GET",
                                url: url,
                            })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data];
                    }
                });
            });
        };
        _Client.prototype.postJson = function (url, data) {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.request({
                                headers: _Client.getJsonHeaders(),
                                method: "POST",
                                url: url,
                                data: JSON.stringify(data),
                            })];
                        case 1:
                            response = _a.sent();
                            if (typeof response.data === "string") {
                                response.data = JSON.parse(response.data);
                            }
                            return [2 /*return*/, response];
                    }
                });
            });
        };
        _Client.prototype.mergeJson = function (url, data) {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.request({
                                headers: _Client.getJsonHeaders(),
                                method: "MERGE",
                                url: url,
                                data: JSON.stringify(data),
                            })];
                        case 1:
                            response = _a.sent();
                            if (typeof response.data === "string") {
                                response.data = JSON.parse(response.data);
                            }
                            return [2 /*return*/, response];
                    }
                });
            });
        };
        _Client.prototype.putJson = function (file, data) {
            return __awaiter(this, void 0, void 0, function () {
                var fs;
                return __generator(this, function (_a) {
                    fs = require("fs");
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            fs.writeFile(file, JSON.stringify(data, null, 4), "utf8", function (error) {
                                if (error) {
                                    reject(error);
                                }
                                else {
                                    resolve();
                                }
                            });
                        })];
                });
            });
        };
        _Client.prototype._fetchCsrf = function () {
            if (this.csrfFetchRequestPromise) {
                return this.csrfFetchRequestPromise;
            }
            this.csrfFetchRequest.headers = this.csrfFetchRequest.headers || {};
            this.csrfFetchRequest.headers["x-csrf-token"] = "fetch";
            this.csrfFetchRequest.parameters = this.csrfFetchRequest.parameters || {};
            if (this.csrfByPassCache) {
                this.csrfFetchRequest.parameters._ = Date.now(); // bypass cache;
            }
            this.csrfFetchRequestPromise = request(this.csrfFetchRequest).then(function (response) {
                this.csrfFetchRequestPromise = null;
                if (response.headers["set-cookie"]) {
                    this.cookies = response.headers["set-cookie"].join("; ");
                }
                this.csrfToken = response.headers["x-csrf-token"];
                return response;
            }.bind(this));
            return this.csrfFetchRequestPromise;
        };
        _Client.prototype._requestWithCsrf = function (properties, renewCsrf) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // if request is identical to csrf fetch request -> always fetch a new csrf token
                            if (addEncodedUrlParameters(this.csrfFetchRequest.url, this.csrfFetchRequest.parameters) ===
                                addEncodedUrlParameters(properties.url, properties.parameters)) {
                                return [2 /*return*/, this._fetchCsrf()];
                            }
                            if (!(renewCsrf && !this.csrfToken)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this._fetchCsrf()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this._requestWithCsrf(properties, false)];
                        case 2:
                            // do request with csrf token
                            properties.headers = properties.headers || {};
                            if (this.cookies) {
                                properties.headers.Cookie = this.cookies;
                            }
                            properties.headers["x-csrf-token"] = this.csrfToken;
                            return [2 /*return*/, request(properties).catch(function (error) {
                                    if (renewCsrf &&
                                        error.responseHeaders["x-csrf-token"] &&
                                        error.responseHeaders["x-csrf-token"].toLowerCase() === "required") {
                                        return this._fetchCsrf().then(function () {
                                            return this._requestWithCsrf(properties, false);
                                        }.bind(this));
                                    }
                                    return Promise.reject(error);
                                }.bind(this))];
                    }
                });
            });
        };
        _Client.prototype.request = function (properties) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            properties.headers = Object.assign({}, properties.headers, this.recordOptions.headers);
                            if (!!this.csrf) return [3 /*break*/, 2];
                            if (this.cookies) {
                                properties.headers.Cookie = this.cookies;
                            }
                            return [4 /*yield*/, request(properties)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            // if csrf fetch request is not set -> treat first request as csrf fetch request
                            if (!this.csrfFetchRequest) {
                                this.csrfFetchRequest = properties;
                            }
                            return [4 /*yield*/, this._requestWithCsrf(properties, true)];
                        case 3: 
                        // mainRequest with csrf renew if neccessary
                        return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        return _Client;
    }());
});
})();