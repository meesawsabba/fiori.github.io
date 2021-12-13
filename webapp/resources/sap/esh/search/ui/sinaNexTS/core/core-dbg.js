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
sap.ui.define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getProperty = exports.executeSequentialAsync = exports.generateGuid = exports.generateId = exports._cloneObject = exports._cloneList = exports.clone = exports._equalsObject = exports._equalsList = exports.equals = exports.isSimple = exports.isString = exports.isFunction = exports.isEmptyObject = exports.isObject = exports.isList = exports.firstCharToUpper = exports.extend = exports.object = exports.filter = exports.map = void 0;
    // =========================================================================
    // map
    // =========================================================================
    function map(list, mapFunction, mapCtx) {
        var result = [];
        for (var i = 0; i < list.length; ++i) {
            result.push(mapFunction.apply(mapCtx, [list[i]]));
        }
        return result;
    }
    exports.map = map;
    // =========================================================================
    // filter
    // =========================================================================
    function filter(list, check) {
        var result = [];
        for (var i = 0; i < list.length; ++i) {
            var element = list[i];
            if (check(element)) {
                result.push(element);
            }
        }
        return result;
    }
    exports.filter = filter;
    // =========================================================================
    // create object with prototype
    // =========================================================================
    function object(prototype) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        var TmpFunction = function () { };
        TmpFunction.prototype = prototype;
        return new TmpFunction();
    }
    exports.object = object;
    // =========================================================================
    // extend object
    // =========================================================================
    function extend(o1, o2) {
        for (var key in o2) {
            o1[key] = o2[key];
        }
        return o1;
    }
    exports.extend = extend;
    // =========================================================================
    // first character to upper
    // =========================================================================
    function firstCharToUpper(text, removeUnderscore) {
        if (removeUnderscore) {
            if (text[0] === "_") {
                text = text.slice(1);
            }
        }
        return text[0].toUpperCase() + text.slice(1);
    }
    exports.firstCharToUpper = firstCharToUpper;
    // =========================================================================
    // is list
    // =========================================================================
    function isList(obj) {
        if (Object.prototype.toString.call(obj) === "[object Array]") {
            return true;
        }
        return false;
    }
    exports.isList = isList;
    // =========================================================================
    // is object (array!=object)
    // =========================================================================
    function isObject(obj) {
        if (isList(obj)) {
            return false;
        }
        return typeof obj === "object";
    }
    exports.isObject = isObject;
    // =========================================================================
    // is empty object
    // =========================================================================
    function isEmptyObject(obj) {
        for (var prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                return false;
            }
        }
        return JSON.stringify(obj) === JSON.stringify({});
    }
    exports.isEmptyObject = isEmptyObject;
    // =========================================================================
    // is function
    // =========================================================================
    function isFunction(obj) {
        return typeof obj === "function";
    }
    exports.isFunction = isFunction;
    // =========================================================================
    // is string
    // =========================================================================
    function isString(obj) {
        return typeof obj === "string";
    }
    exports.isString = isString;
    // =========================================================================
    // is simple (= string, number  but not list, object, function)
    // =========================================================================
    function isSimple(obj) {
        return typeof obj !== "object" && typeof obj !== "function";
    }
    exports.isSimple = isSimple;
    // =========================================================================
    // Promise
    // =========================================================================
    // module.Promise = Promise;
    // =========================================================================
    // helper: generate constructor function
    // =========================================================================
    // var generateConstructorFunction = function () {
    //     var cf = (function () {
    //         return function () {
    //             if (arguments[0] === '_suppress_init_') {
    //                 return;
    //             }
    //             this._genericInit.apply(this, arguments);
    //         };
    //     })();
    //     return cf;
    // };
    // =========================================================================
    // helper: generate getter
    // =========================================================================
    // var generateGetter = function (prototype, propertyName) {
    //     var methodName = 'get' + firstCharToUpper(propertyName, true);
    //     if (prototype[methodName]) {
    //         return;
    //     }
    //     prototype[methodName] = function (value) {
    //         return this[propertyName];
    //     };
    // };
    // =========================================================================
    // helper: generate setter
    // =========================================================================
    // var generateSetter = function (prototype, propertyName) {
    //     var methodName = 'set' + firstCharToUpper(propertyName, true);
    //     if (prototype[methodName]) {
    //         return;
    //     }
    //     prototype[methodName] = function (value) {
    //         this[propertyName] = value;
    //     };
    // };
    // =========================================================================
    // helper: define setter/getter according to metadata
    // =========================================================================
    // var generatePrototypeMethods = function (prototype) {
    //     if (!prototype.hasOwnProperty('_meta')) {
    //         return;
    //     }
    //     var properties = prototype._meta.properties;
    //     if (!properties) {
    //         return;
    //     }
    //     for (var property in properties) {
    //         var propertyMetadata = properties[property];
    //         if (propertyMetadata.getter) {
    //             generateGetter(prototype, property);
    //         }
    //         if (propertyMetadata.setter) {
    //             generateSetter(prototype, property);
    //         }
    //     }
    // };
    // =========================================================================
    // helper: define class
    // =========================================================================
    // var defineClassInternal = function (parentClass, prototype) {
    //     var Cls = generateConstructorFunction();
    //     if (!parentClass) {
    //         parentClass = BaseClass;
    //     }
    //     Cls.prototype = extend(new parentClass('_suppress_init_'), prototype); // eslint-disable-line new-cap
    //     Cls.superPrototype = parentClass.prototype;
    //     Cls.prototype.constructor = Cls;
    //     generatePrototypeMethods(Cls.prototype);
    //     Cls.derive = function (derivedPrototype) {
    //         return defineClassInternal(Cls, derivedPrototype);
    //     };
    //     return Cls;
    // };
    // =========================================================================
    // create class
    // =========================================================================
    // export function defineClass(prototype) {
    //     return defineClassInternal(null, prototype);
    // };
    // =========================================================================
    // generic equals
    // =========================================================================
    function equals(o1, o2, ordered) {
        if (isList(o1)) {
            return _equalsList(o1, o2, ordered);
        }
        if (isObject(o1)) {
            return _equalsObject(o1, o2, ordered);
        }
        return o1 === o2;
    }
    exports.equals = equals;
    function _equalsList(l1, l2, ordered) {
        if (ordered === undefined) {
            ordered = true;
        }
        if (l1.length !== l2.length) {
            return false;
        }
        if (ordered) {
            // 1) consider order
            for (var i = 0; i < l1.length; ++i) {
                if (!equals(l1[i], l2[i], ordered)) {
                    return false;
                }
            }
            return true;
        }
        // 2) do not consider order
        var matched = {};
        for (var j = 0; j < l1.length; ++j) {
            var element1 = l1[j];
            var match = false;
            for (var k = 0; k < l2.length; ++k) {
                var element2 = l2[k];
                if (matched[k]) {
                    continue;
                }
                if (equals(element1, element2, ordered)) {
                    match = true;
                    matched[k] = true;
                    break;
                }
            }
            if (!match) {
                return false;
            }
        }
        return true;
    }
    exports._equalsList = _equalsList;
    function _equalsObject(o1, o2, ordered) {
        if (o1.equals) {
            return o1.equals(o2);
        }
        if (!isObject(o2)) {
            return false;
        }
        for (var property in o1) {
            var propertyValue1 = o1[property];
            var propertyValue2 = o2[property];
            if (!equals(propertyValue1, propertyValue2, ordered)) {
                return false;
            }
        }
        return true;
    }
    exports._equalsObject = _equalsObject;
    // =========================================================================
    // generic clone
    // =========================================================================
    function clone(obj) {
        if (isList(obj)) {
            return _cloneList(obj);
        }
        if (isObject(obj)) {
            return _cloneObject(obj);
        }
        return obj;
    }
    exports.clone = clone;
    function _cloneList(list) {
        var cloned = [];
        for (var i = 0; i < list.length; ++i) {
            var element = list[i];
            cloned.push(clone(element));
        }
        return cloned;
    }
    exports._cloneList = _cloneList;
    function _cloneObject(obj) {
        if (obj.clone) {
            return obj.clone();
        }
        var cloned = {};
        for (var property in obj) {
            var value = obj[property];
            cloned[property] = clone(value);
        }
        return cloned;
    }
    exports._cloneObject = _cloneObject;
    // =========================================================================
    // generate id
    // =========================================================================
    var maxId = 0;
    function generateId() {
        return "#" + ++maxId;
    }
    exports.generateId = generateId;
    // =========================================================================
    // generate guid
    // =========================================================================
    function generateGuid() {
        return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0, v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16).toUpperCase();
        });
    }
    exports.generateGuid = generateGuid;
    // =========================================================================
    // executeSequentialAsync
    // =========================================================================
    function executeSequentialAsync(tasks, caller) {
        return __awaiter(this, void 0, void 0, function () {
            var execute;
            return __generator(this, function (_a) {
                if (!tasks) {
                    return [2 /*return*/, Promise.resolve()]; // eslint-disable-line new-cap
                }
                execute = function (index) {
                    if (index >= tasks.length) {
                        return undefined;
                    }
                    var task = tasks[index];
                    return Promise.resolve()
                        .then(function () {
                        if (caller) {
                            return caller(task);
                        }
                        return task();
                    })
                        .then(function () {
                        return execute(index + 1);
                    });
                };
                return [2 /*return*/, execute(0)];
            });
        });
    }
    exports.executeSequentialAsync = executeSequentialAsync;
    // =========================================================================
    // access deep property in object
    // =========================================================================
    function getProperty(obj, path) {
        var result = obj;
        for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
            var pathPart = path_1[_i];
            result = result[pathPart];
            if (typeof result === "undefined") {
                return undefined;
            }
        }
        return result;
    }
    exports.getProperty = getProperty;
});
})();