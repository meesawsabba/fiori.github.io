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
sap.ui.define(["require", "exports", "../../sina/DataSourceType", "./MetadataParser", "./HierarchyMetadataParser"], function (require, exports, DataSourceType_1, MetadataParser_1, HierarchyMetadataParser_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MetadataParserXML = void 0;
    var MetadataParserXML = /** @class */ (function (_super) {
        __extends(MetadataParserXML, _super);
        function MetadataParserXML(provider) {
            return _super.call(this, provider) || this;
        }
        MetadataParserXML.prototype._getWindow = function () {
            return __awaiter(this, void 0, void 0, function () {
                var jsdom, fs, jquery, dom;
                return __generator(this, function (_a) {
                    if (typeof window === "undefined") {
                        if (typeof this.jsDOMWindow === "undefined") {
                            jsdom = require("jsdom");
                            fs = require("fs");
                            jquery = fs.readFileSync("./node_modules/jquery/dist/jquery.js", "utf-8");
                            dom = new jsdom.JSDOM("<html><script>" + jquery + "</script><body></body></html>", {
                                runScripts: "dangerously",
                            });
                            this.jsDOMWindow = dom.window;
                            dom.window.$ = dom.window.jQuery;
                        }
                        return [2 /*return*/, this.jsDOMWindow];
                    }
                    return [2 /*return*/, window];
                });
            });
        };
        MetadataParserXML.prototype.fireRequest = function (client, url) {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.getXML(url)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response];
                    }
                });
            });
        };
        MetadataParserXML.prototype.parseResponse = function (metaXML) {
            return __awaiter(this, void 0, void 0, function () {
                var that, allInOneMap, window, xmlDoc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            that = this;
                            allInOneMap = {
                                businessObjectMap: {},
                                businessObjectList: [],
                                dataSourceMap: {},
                                dataSourcesList: [], // list of all datasources for convenience
                            };
                            return [4 /*yield*/, this._getWindow()];
                        case 1:
                            window = _a.sent();
                            xmlDoc = window.$.parseXML(metaXML);
                            window
                                .$(xmlDoc)
                                .find("Schema")
                                .each(function () {
                                var $this = window.$(this);
                                var helperMap = that._parseEntityType($this, window);
                                that._parseEntityContainer($this, helperMap, allInOneMap, window);
                            });
                            return [2 /*return*/, allInOneMap];
                    }
                });
            });
        };
        //parse entityset and its attributes from EntityType
        MetadataParserXML.prototype._parseEntityType = function (schema, window) {
            var that = this;
            var helperMap = {};
            schema = window.$(schema);
            var hierarchyMetadataParser = new HierarchyMetadataParser_1.HierarchyMetadataParser(window.$);
            schema.find("EntityType").each(function () {
                var entityTypeName = window.$(this).attr("Name");
                var entitySet = {
                    schema: schema.attr("Namespace"),
                    keys: [],
                    attributeMap: {},
                    resourceBundle: "",
                    labelResourceBundle: "",
                    label: "",
                    labelPlural: "",
                    annotations: {},
                    hierarchyDefinitionsMap: {},
                    icon: "",
                };
                helperMap[entityTypeName] = entitySet;
                //oData keys for accessing a entity
                window
                    .$(this)
                    .find("Key>PropertyRef")
                    .each(function () {
                    entitySet.keys.push(window.$(this).attr("Name"));
                });
                window
                    .$(this)
                    .find('>Annotation[Term="EnterpriseSearch.hierarchy.parentChild"]')
                    .each(function () {
                    entitySet.hierarchyDefinitionsMap = hierarchyMetadataParser.parse(this);
                });
                window
                    .$(this)
                    .find('Annotation[Term="Search.searchable"]')
                    .each(function () {
                    //window.$(this).find('Annotation').each(function () {
                    // if (window.$(this).attr('Term') === 'EnterpriseSearchHana.uiResource.label.bundle') {
                    //     var resourceUrl = window.$(this).attr('String');
                    //     try {
                    //         entitySet.resourceBundle = jQuery.sap.resources({
                    //             url: resourceUrl,
                    //             language: sap.ui.getCore().getConfiguration().getLanguage()
                    //         });
                    //     } catch (e) {
                    //         sinaLog.error("Resource bundle of " + entityTypeName + " '" + resourceUrl + "' can't be found:" + e.toString());
                    //     }
                    //Get sibling annotation element of attr EnterpriseSearchHana.uiResource.label.key
                    window
                        .$(this)
                        .siblings("Annotation")
                        .each(function () {
                        var $element = window.$(this);
                        var annotationName = $element.attr("Term");
                        if (annotationName !== undefined && annotationName.length > 0) {
                            annotationName = annotationName.toUpperCase();
                            var annotationValue = that._getValueFromElement(this, window);
                            if (annotationName === "ENTERPRISESEARCHHANA.UIRESOURCE.LABEL.BUNDLE") {
                                var resourceUrl = annotationValue;
                                try {
                                    entitySet.resourceBundle = window.jQuery.sap.resources({
                                        url: resourceUrl,
                                        language: window.sap.ui
                                            .getCore()
                                            .getConfiguration()
                                            .getLanguage(),
                                    });
                                }
                                catch (e) {
                                    that.log.error("Resource bundle of " +
                                        entityTypeName +
                                        " '" +
                                        resourceUrl +
                                        "' can't be found:" +
                                        e.toString());
                                }
                            }
                            else if (annotationName === "ENTERPRISESEARCHHANA.UIRESOURCE.LABEL.KEY") {
                                var sKey = annotationValue;
                                if (sKey && entitySet.resourceBundle) {
                                    var sTranslatedText = entitySet.resourceBundle.getText(sKey);
                                    if (sTranslatedText) {
                                        entitySet.labelResourceBundle = sTranslatedText;
                                    }
                                }
                            }
                            else if (annotationName === "UI.HEADERINFO.TYPENAME") {
                                entitySet.label = annotationValue;
                            }
                            else if (annotationName === "UI.HEADERINFO.TYPENAMEPLURAL") {
                                entitySet.labelPlural = annotationValue;
                            }
                            else if (annotationName === "UI.HEADERINFO.TITLE.TYPE") {
                                that._setAnnotationValue(entitySet.annotations, annotationName, annotationValue);
                            }
                            else if (annotationName === "UI.HEADERINFO.TITLE.VALUEQUALIFIER") {
                                that._setAnnotationValue(entitySet.annotations, annotationName, annotationValue);
                            }
                            else if (annotationName === "UI.HEADERINFO.TYPEIMAGEURL") {
                                entitySet.icon = annotationValue;
                            }
                            else {
                                // var annoAttributes = window.$(this)[0].attributes;
                                // // In case of collection, say usageMode, it shall be handled differently
                                // if (annoAttributes.length === 2) {
                                //     var annoTerm = annoAttributes.item(0).value.toUpperCase();
                                //     var annoValue = annoAttributes.item(1).value;
                                //     entitySet.annotations[annoTerm] = annoValue;
                                // }
                                that._setAnnotationValue(entitySet.annotations, annotationName, annotationValue);
                            }
                        }
                    });
                    //}
                });
                //Loop attributes
                window
                    .$(this)
                    .find("Property")
                    .each(function (index) {
                    var attributeName = window.$(this).attr("Name");
                    var attribute = {
                        labelRaw: attributeName,
                        label: null,
                        type: window.$(this).attr("Type"),
                        presentationUsage: [],
                        // accessUsage: [],
                        isFacet: false,
                        isSortable: false,
                        supportsTextSearch: false,
                        displayOrder: index,
                        annotationsAttr: {},
                        unknownAnnotation: [],
                        hierarchyDefinition: entitySet.hierarchyDefinitionsMap[attributeName],
                    };
                    entitySet.attributeMap[attributeName] = attribute;
                    window
                        .$(this)
                        .find("Annotation")
                        .each(function () {
                        var annotationName = window.$(this).attr("Term");
                        if (annotationName !== undefined && annotationName.length > 0) {
                            annotationName = annotationName.toUpperCase();
                            var annotationValue_1 = that._getValueFromElement(this, window);
                            if (annotationValue_1 == undefined) {
                                window
                                    .$(this)
                                    .children("Collection")
                                    .children("Record")
                                    .each(function () {
                                    annotationValue_1 = annotationValue_1 || [];
                                    var arrayEntry = {};
                                    annotationValue_1.push(arrayEntry);
                                    window
                                        .$(this)
                                        .children("PropertyValue")
                                        .each(function () {
                                        var entryAnnoName = window.$(this).attr("Property");
                                        if (entryAnnoName !== undefined &&
                                            entryAnnoName.length > 0) {
                                            entryAnnoName = entryAnnoName.toUpperCase();
                                            var entryAnnoValue = that._getValueFromElement(this, window);
                                            if (entryAnnoValue !== undefined) {
                                                arrayEntry[entryAnnoName] = entryAnnoValue;
                                            }
                                        }
                                    });
                                });
                            }
                            if (annotationValue_1 !== undefined) {
                                switch (annotationName) {
                                    case "SAP.COMMON.LABEL":
                                        if (!attribute.label) {
                                            attribute.label = annotationValue_1;
                                        }
                                        break;
                                    case "ENTERPRISESEARCHHANA.UIRESOURCE.LABEL.KEY":
                                        if (annotationValue_1 && entitySet.resourceBundle) {
                                            var sTranslatedText = entitySet.resourceBundle.getText(annotationValue_1);
                                            if (sTranslatedText) {
                                                attribute.label = sTranslatedText;
                                            }
                                        }
                                        break;
                                    case "ENTERPRISESEARCH.KEY":
                                        attribute.isKey = annotationValue_1;
                                        break;
                                    case "ENTERPRISESEARCH.PRESENTATIONMODE":
                                        window
                                            .$(this)
                                            .find("Collection>String")
                                            .each(function () {
                                            var presentationUsage = that._getValueFromElement(this, window);
                                            // presentationUsage = that.presentationUsageConversionMap[presentationUsage];
                                            if (presentationUsage) {
                                                attribute.presentationUsage.push(presentationUsage);
                                            }
                                        });
                                        break;
                                    // case 'EnterpriseSearch.usageMode': // No longer available in v5
                                    //     window.$(this).find('Collection>String').each(function() {
                                    //         var accessUsage = annotationValue;
                                    //         accessUsage = that.accessUsageConversionMap[accessUsage];
                                    //         if (accessUsage) {
                                    //             attribute.accessUsage.push(accessUsage);
                                    //         }
                                    //     });
                                    //     break;
                                    case "ENTERPRISESEARCHHANA.ISSORTABLE":
                                        attribute.isSortable = annotationValue_1;
                                        break;
                                    case "ENTERPRISESEARCHHANA.SUPPORTSTEXTSEARCH":
                                        attribute.supportsTextSearch = annotationValue_1;
                                        break;
                                    case "ENTERPRISESEARCH.FILTERINGFACET.DEFAULT":
                                        attribute.isFacet = annotationValue_1;
                                        break;
                                    case "ENTERPRISESEARCH.DISPLAYORDER":
                                        attribute.displayOrder = annotationValue_1;
                                        break;
                                    // case '@EnterpriseSearch.filteringFacet.numberOfValues':
                                    //     attribute.numberOfFacetValues = annotationValue;
                                    default:
                                        if (annotationName.startsWith("UI") ||
                                            annotationName.startsWith("OBJECTMODEL") ||
                                            annotationName.startsWith("SEMANTICS")) {
                                            that._setAnnotationValue(attribute.annotationsAttr, annotationName, annotationValue_1);
                                        }
                                        else {
                                            attribute.unknownAnnotation.push(window.$(this));
                                        }
                                }
                            }
                        }
                    });
                    var identification = attribute.annotationsAttr.UI && attribute.annotationsAttr.UI.IDENTIFICATION;
                    if (identification) {
                        if (identification.POSITION !== undefined) {
                            attribute.displayOrder = identification.POSITION;
                        }
                        else if (Array.isArray(identification)) {
                            for (var i = 0; i < identification.length; i++) {
                                if (identification[i].TYPE == undefined &&
                                    identification[i].POSITION !== undefined) {
                                    attribute.displayOrder = identification[i].POSITION;
                                    break;
                                }
                            }
                        }
                    }
                });
            });
            return helperMap;
        };
        MetadataParserXML.prototype._getValueFromElement = function (element, window) {
            var $element = window.$(element);
            var value = $element.text();
            if (!value || value.trim().length == 0) {
                value = undefined;
                if ($element.attr("String") !== undefined) {
                    value = $element.attr("String");
                }
                else if ($element.attr("Decimal") !== undefined) {
                    try {
                        value = Number.parseFloat($element.attr("Decimal"));
                        if (isNaN(value)) {
                            value = undefined;
                        }
                    }
                    catch (e) {
                        value = undefined;
                    }
                }
                else if ($element.attr("Int") !== undefined) {
                    try {
                        value = Number.parseInt($element.attr("Int"), 10);
                        if (isNaN(value)) {
                            value = undefined;
                        }
                    }
                    catch (e) {
                        value = undefined;
                    }
                }
                else if ($element.attr("Bool") !== undefined) {
                    value = $element.attr("Bool") == "true";
                }
            }
            return value;
        };
        //parse datasources from EntityContainer
        MetadataParserXML.prototype._parseEntityContainer = function (schemaXML, helperMap, allInOneMap, window) {
            var that = this;
            schemaXML.find("EntityContainer>EntitySet").each(function () {
                if (window.$(this).attr("Name") && window.$(this).attr("EntityType")) {
                    var name_1 = window.$(this).attr("Name");
                    var entityTypeFullQualified = window.$(this).attr("EntityType");
                    // var schema = entityTypeFullQualified.slice(0, entityTypeFullQualified.lastIndexOf('.'));
                    var entityType = entityTypeFullQualified.slice(entityTypeFullQualified.lastIndexOf(".") + 1);
                    var entitySet = helperMap[entityType];
                    if (entitySet === undefined) {
                        throw "EntityType " + entityType + " has no corresponding meta data!";
                    }
                    var newDatasource = that.sina._createDataSource({
                        id: name_1,
                        label: entitySet.labelResourceBundle || entitySet.label || name_1,
                        labelPlural: entitySet.labelResourceBundle || entitySet.labelPlural || entitySet.label || name_1,
                        icon: entitySet.icon || "",
                        type: DataSourceType_1.DataSourceType.BusinessObject,
                        attributesMetadata: [
                            {
                                id: "dummy",
                            },
                        ], // fill with dummy attribute
                    });
                    newDatasource.annotations = entitySet.annotations;
                    allInOneMap.dataSourceMap[newDatasource.id] = newDatasource;
                    allInOneMap.dataSourcesList.push(newDatasource);
                    //that.fillMetadataBuffer(newDatasource, entitySet);
                    entitySet.name = name_1;
                    entitySet.dataSource = newDatasource;
                    allInOneMap.businessObjectMap[name_1] = entitySet;
                    allInOneMap.businessObjectList.push(entitySet);
                }
            });
        };
        return MetadataParserXML;
    }(MetadataParser_1.MetadataParser));
    exports.MetadataParserXML = MetadataParserXML;
});
})();