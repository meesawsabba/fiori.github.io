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
sap.ui.define(["require", "exports", "../../sina/DataSourceType", "./MetadataParser"], function (require, exports, DataSourceType_1, MetadataParser_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MetadataParserJson = void 0;
    var MetadataParserJson = /** @class */ (function (_super) {
        __extends(MetadataParserJson, _super);
        function MetadataParserJson(provider) {
            return _super.call(this, provider) || this;
        }
        MetadataParserJson.prototype.fireRequest = function (client, url) {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.getJson(url)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response];
                    }
                });
            });
        };
        MetadataParserJson.prototype.parseResponse = function (metaJson) {
            return __awaiter(this, void 0, void 0, function () {
                var allInOneMap, metaData, entityContainer, aEntityContainer, schemaNameSpace, entityContainerName, schemaObject, entityContainerObject, helperMap;
                return __generator(this, function (_a) {
                    allInOneMap = {
                        businessObjectMap: {},
                        businessObjectList: [],
                        dataSourceMap: {},
                        dataSourcesList: [], // list of all datasources for convenience
                    };
                    metaData = (metaJson.data && metaJson.data.metadata) || metaJson.data || metaJson;
                    entityContainer = metaData["$EntityContainer"];
                    if (typeof entityContainer !== "string" || entityContainer.length < 1) {
                        throw "Meta data contains invalid EntityContainer!";
                    }
                    aEntityContainer = entityContainer.split(".");
                    schemaNameSpace = aEntityContainer[0];
                    entityContainerName = aEntityContainer[1];
                    schemaObject = metaData[schemaNameSpace];
                    entityContainerObject = schemaObject[entityContainerName];
                    helperMap = this._parseEntityType(schemaNameSpace, schemaObject, entityContainerName, entityContainerObject);
                    this._parseEntityContainer(entityContainerObject, helperMap, allInOneMap);
                    return [2 /*return*/, allInOneMap];
                });
            });
        };
        //parse entityset and its attributes from EntityType
        MetadataParserJson.prototype._parseEntityType = function (schemaNameSpace, schemaObject, entityContainerName, entityContainerObject) {
            var helperMap = {};
            for (var entityTypeName in schemaObject) {
                // Skip entityContainerObject
                if (entityTypeName === entityContainerName) {
                    continue;
                }
                var entityTypeOrigin = schemaObject[entityTypeName];
                if (entityTypeOrigin["@EnterpriseSearch.enabled"] !== true) {
                    continue;
                }
                entityTypeName = entityTypeName.substring(0, entityTypeName.length - 4);
                var entityType = {
                    schema: schemaNameSpace,
                    keys: [],
                    attributeMap: {},
                    // resourceBundle: "" as any,
                    // labelResourceBundle: "",
                    label: entityContainerObject[entityTypeName]["@SAP.Common.Label"] || "",
                    labelPlural: entityContainerObject[entityTypeName]["@SAP.Common.Label"] || "",
                    annotations: {},
                };
                helperMap[entityTypeName] = entityType;
                // resourceBundle brings dependencies to window and jQuery
                // activate this if necessary
                // const resourceBundle = entityTypeOrigin["@EnterpriseSearchHana.uiResource.label.bundle"];
                // const resourceKey = entityTypeOrigin["@EnterpriseSearchHana.uiResource.label.key"];
                // if (resourceBundle && resourceKey) {
                //     try {
                //         entityType.resourceBundle = window.jQuery.sap.resources({
                //             url: resourceBundle,
                //             language: window.sap.ui.getCore().getConfiguration().getLanguage()
                //         });
                //         const sTranslatedText = entityType.resourceBundle.getText(resourceKey);
                //         if (sTranslatedText) {
                //             entityType.labelResourceBundle = sTranslatedText;
                //         }
                //     } catch (e) {
                //         that.log.error("Resource bundle of " + entityTypeName + " '" + resourceBundle + "' can't be found:" + e.toString());
                //     }
                // }
                var index = 0;
                for (var annoOrAttrName in entityTypeOrigin) {
                    var annoOrAttr = entityTypeOrigin[annoOrAttrName];
                    if (annoOrAttrName === "$Key") {
                        entityType.keys = annoOrAttr;
                        continue;
                    }
                    if (annoOrAttrName.startsWith("@")) {
                        this._parseEntityTypeAnnotations(annoOrAttrName, annoOrAttr, entityType);
                        continue;
                    }
                    this._parseAttribute(annoOrAttrName, annoOrAttr, entityType, index);
                    index++;
                }
            }
            return helperMap;
        };
        MetadataParserJson.prototype._parseEntityTypeAnnotations = function (annoName, annoValue, entityType) {
            annoName = annoName.substring(1).toUpperCase();
            switch (annoName) {
                case "UI.HEADERINFO.TYPENAME":
                    entityType.label = annoValue;
                    break;
                case "UI.HEADERINFO.TYPENAMEPLURAL":
                    entityType.label = annoValue;
                    break;
                case "UI.HEADERINFO.TITLE.TYPE":
                    this._setAnnotationValue(entityType.annotations, annoName, annoValue);
                    break;
                case "UI.HEADERINFO.TITLE.VALUEQUALIFIER":
                    this._setAnnotationValue(entityType.annotations, annoName, annoValue);
                    break;
                case "UI.HEADERINFO.TYPEIMAGEURL":
                    entityType.icon = annoValue;
                    break;
                default:
                    this._setAnnotationValue(entityType.annotations, annoName, annoValue);
            }
        };
        MetadataParserJson.prototype._parseAttribute = function (attributeName, attributeValue, entityType, index) {
            if (typeof attributeValue !== "object") {
                return;
            }
            var attribute = {
                labelRaw: attributeName,
                label: null,
                type: "",
                presentationUsage: [],
                isFacet: false,
                isSortable: false,
                supportsTextSearch: false,
                displayOrder: index,
                annotationsAttr: {},
                unknownAnnotation: [],
            };
            entityType.attributeMap[attributeName] = attribute;
            for (var annoOrProp in attributeValue) {
                var annoOrPropValue = attributeValue[annoOrProp];
                if (annoOrProp === "$Type" || annoOrProp === "Type") {
                    attribute["type"] = annoOrPropValue;
                    continue;
                }
                if (annoOrProp.startsWith("@")) {
                    this._parseAttributeAnnotations(annoOrProp, annoOrPropValue, attribute);
                }
            }
        };
        MetadataParserJson.prototype._parseAttributeAnnotations = function (annotationName, annotationValue, attribute) {
            annotationName = annotationName.substring(1).toUpperCase();
            if (annotationValue !== undefined) {
                this._normalizeAnnotationValueOfArrayOrObject(annotationValue);
                switch (annotationName) {
                    case "SAP.COMMON.LABEL":
                        if (!attribute.label) {
                            attribute.label = annotationValue;
                        }
                        break;
                    // case "ENTERPRISESEARCHHANA.UIRESOURCE.LABEL.KEY":
                    //     if (annotationValue && entitySet.resourceBundle) {
                    //         const sTranslatedText = entitySet.resourceBundle.getText(annotationValue);
                    //         if (sTranslatedText) {
                    //             attribute.label = sTranslatedText;
                    //         }
                    //     }
                    //     break;
                    case "ENTERPRISESEARCH.KEY":
                        attribute.isKey = annotationValue;
                        break;
                    case "ENTERPRISESEARCH.PRESENTATIONMODE":
                        // eslint-disable-next-line no-case-declarations
                        // const presentationUsage: PresentationUsageConversionMap = this._getValueFromArrayWithSingleEntry(annotationValue);
                        // presentationUsage = that.presentationUsageConversionMap[presentationUsage];
                        // if (presentationUsage) {
                        // attribute.presentationUsage.push(presentationUsage);
                        // }
                        attribute.presentationUsage = annotationValue;
                        break;
                    case "ENTERPRISESEARCHHANA.ISSORTABLE":
                        attribute.isSortable = annotationValue;
                        break;
                    case "ENTERPRISESEARCHHANA.SUPPORTSTEXTSEARCH":
                        attribute.supportsTextSearch = annotationValue;
                        break;
                    case "ENTERPRISESEARCH.FILTERINGFACET.DEFAULT":
                        attribute.isFacet = annotationValue;
                        break;
                    case "ENTERPRISESEARCH.DISPLAYORDER":
                        attribute.displayOrder = annotationValue;
                        break;
                    default:
                        if (annotationName.startsWith("UI") ||
                            annotationName.startsWith("OBJECTMODEL") ||
                            annotationName.startsWith("SEMANTICS")) {
                            this._setAnnotationValue(attribute.annotationsAttr, annotationName, annotationValue);
                        }
                        else {
                            attribute.unknownAnnotation.push(annotationName);
                        }
                }
            }
        };
        MetadataParserJson.prototype._normalizeAnnotationValueOfArrayOrObject = function (annotationValue) {
            if (Array.isArray(annotationValue)) {
                for (var i = 0; i < annotationValue.length; i++) {
                    this._normalizeAnnotationValueOfObject(annotationValue[i]);
                }
            }
            else
                this._normalizeAnnotationValueOfObject(annotationValue);
            //system
            return annotationValue;
        };
        MetadataParserJson.prototype._normalizeAnnotationValueOfObject = function (annotationValue) {
            if (typeof annotationValue === "object") {
                for (var keyName in annotationValue) {
                    var keyNameUpperCase = keyName.toUpperCase();
                    annotationValue[keyNameUpperCase] = annotationValue[keyName];
                    delete annotationValue[keyName];
                }
            }
            return annotationValue;
        };
        MetadataParserJson.prototype._getValueFromArrayWithSingleEntry = function (aArray) {
            if (Array.isArray(aArray) && aArray.length === 1) {
                return aArray[0];
            }
            return aArray;
        };
        //parse datasources from EntityContainer
        MetadataParserJson.prototype._parseEntityContainer = function (entityContainerObject, helperMap, allInOneMap) {
            for (var entityObject in entityContainerObject) {
                var entitySet = helperMap[entityObject];
                if (entityObject === "$Kind") {
                    continue;
                }
                if (entitySet === undefined) {
                    throw "EntityType " + entityObject + " has no corresponding meta data!";
                }
                var newDatasource = this.sina._createDataSource({
                    id: entityObject,
                    label: entitySet.label || entityObject,
                    labelPlural: entitySet.labelPlural || entitySet.label || entityObject,
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
                entitySet.name = entityObject;
                entitySet.dataSource = newDatasource;
                allInOneMap.businessObjectMap[entityObject] = entitySet;
                allInOneMap.businessObjectList.push(entitySet);
            }
        };
        return MetadataParserJson;
    }(MetadataParser_1.MetadataParser));
    exports.MetadataParserJson = MetadataParserJson;
});
})();