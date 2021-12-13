/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

/* global Proxy, Reflect, Symbol */

(function(){
sap.ui.define(["require", "exports", "../../core/Log", "../../sina/AttributeType", "../../sina/AttributeFormatType", "../../sina/MatchingStrategy", "../../core/errors"], function (require, exports, Log_1, AttributeType_1, AttributeFormatType_1, MatchingStrategy_1, errors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MetadataParser = void 0;
    var AccessUsageConversionMap;
    (function (AccessUsageConversionMap) {
        AccessUsageConversionMap[AccessUsageConversionMap["AUTO_FACET"] = 0] = "AUTO_FACET";
        AccessUsageConversionMap[AccessUsageConversionMap["SUGGESTION"] = 1] = "SUGGESTION";
    })(AccessUsageConversionMap || (AccessUsageConversionMap = {}));
    var PresentationUsageConversionMap;
    (function (PresentationUsageConversionMap) {
        PresentationUsageConversionMap[PresentationUsageConversionMap["TITLE"] = 0] = "TITLE";
        PresentationUsageConversionMap[PresentationUsageConversionMap["SUMMARY"] = 1] = "SUMMARY";
        PresentationUsageConversionMap[PresentationUsageConversionMap["DETAIL"] = 2] = "DETAIL";
        PresentationUsageConversionMap[PresentationUsageConversionMap["IMAGE"] = 3] = "IMAGE";
        PresentationUsageConversionMap[PresentationUsageConversionMap["THUMBNAIL"] = 4] = "THUMBNAIL";
        PresentationUsageConversionMap[PresentationUsageConversionMap["HIDDEN"] = 5] = "HIDDEN";
    })(PresentationUsageConversionMap || (PresentationUsageConversionMap = {}));
    var MetadataParser = /** @class */ (function () {
        function MetadataParser(provider) {
            this.log = new Log_1.Log("hana_odata metadata parser");
            this.provider = provider;
            this.sina = provider.sina;
        }
        // annotations: Object to store parsed annotations as properties
        // annotationName: Name of annotation in Dot Notation: UI.IDENTIFICATION.POSITION
        // value: can be a single value, like a string, or an array of objects, like UI.IDENTIFICATION = [ { POSITION: 5 }, { POSITION: 6, TYPE:AS_CONNECTED_FIELD, VALUEQUALIFIER:'somegroup' } ]
        MetadataParser.prototype._setAnnotationValue = function (annotations, annotationName, value) {
            var annotationParts = annotationName.split(".");
            var annotationPart;
            var annotationPointer = annotations;
            var dummyEntryName = "___temporaryDummyEntriesForArrays___";
            var i;
            // Step 01: create object structure for annoation
            for (i = 0; i < annotationParts.length - 1; i++) {
                annotationPart = annotationParts[i];
                if (annotationPointer[annotationPart] === undefined) {
                    annotationPointer[annotationPart] = {};
                    annotationPointer = annotationPointer[annotationPart];
                }
                else if (Array.isArray(annotationPointer[annotationPart])) {
                    // at this level an array was created for a previous annotation with the same name
                    // thus we need to create a dummy entry in that array for merging the current
                    // annotation into the array structure
                    annotationPointer[dummyEntryName] = annotationPointer[dummyEntryName] || {};
                    if (!annotationPointer[dummyEntryName][annotationPart]) {
                        annotationPointer[dummyEntryName][annotationPart] = {};
                        annotationPointer[annotationPart].push(annotationPointer[dummyEntryName][annotationPart]);
                    }
                    annotationPointer = annotationPointer[dummyEntryName][annotationPart];
                }
                else if (typeof annotationPointer[annotationPart] === "object") {
                    annotationPointer = annotationPointer[annotationPart];
                }
                else if (typeof annotationPointer[annotationPart] === "boolean") {
                    // for handling something like this:
                    //      @Semantics.URL: true
                    //      @Semantics.URL.mimeType: "anotherAttribute"
                    // if @Semantics.URL.mimeType is set, than @Semantics.URL is implicitely assumed to be 'true'
                    annotationPointer[annotationPart] = {};
                    annotationPointer = annotationPointer[annotationPart];
                }
                else {
                    // should never happen!
                    return;
                }
            }
            // Step 02: set value for annotation.
            if (i < annotationParts.length) {
                annotationPart = annotationParts[i];
                if (annotationPointer[annotationPart] === undefined) {
                    // value can be simple value, like string, or array
                    annotationPointer[annotationPart] = value;
                }
                else if (Array.isArray(annotationPointer[annotationPart])) {
                    // existing value could be an array, in which case the new value needs to be mixed in
                    if (Array.isArray(value)) {
                        // new value is an array, which can be appended to the existing array value
                        annotationPointer[annotationPart] = annotationPointer[annotationPart].concat(value);
                    }
                    else {
                        // new value is a simple value. In this case create a dummy entry in the existing array
                        // (or use the dummy entry which had been created before) and add the new value to that entry.
                        annotationPointer[dummyEntryName] = annotationPointer[dummyEntryName] || {};
                        if (!annotationPointer[dummyEntryName][annotationPart]) {
                            annotationPointer[dummyEntryName][annotationPart] = value;
                            annotationPointer[annotationPart].push(annotationPointer[dummyEntryName][annotationPart]);
                        }
                        else {
                            for (var propName in value) {
                                if (!annotationPointer[dummyEntryName][annotationPart][propName]) {
                                    annotationPointer[dummyEntryName][annotationPart][propName] = value[propName];
                                }
                            }
                        }
                    }
                }
            }
        };
        MetadataParser.prototype.fillMetadataBuffer = function (dataSource, attributes) {
            if (dataSource.attributesMetadata[0].id !== "dummy") {
                // check if buffer already filled
                return;
            }
            dataSource.attributesMetadata = [];
            dataSource.attributeMetadataMap = {};
            var cdsAnnotations = {
                dataSourceAnnotations: {},
                attributeAnnotations: {}, // Key-Value-Map (keys: attribute names) of Key-Value-Maps (keys: annotation names) for CDS annotations
            };
            cdsAnnotations.dataSourceAnnotations = dataSource.annotations;
            for (var attributeMetadata in attributes.attributeMap) {
                try {
                    this.fillPublicMetadataBuffer(dataSource, attributes.attributeMap[attributeMetadata], cdsAnnotations);
                }
                catch (e) {
                    // not allowed by linter:
                    this.log.error("Attribue " +
                        attributeMetadata +
                        " of DataSource " +
                        dataSource.label +
                        " can not be filled in meta data" +
                        e.toString());
                }
            }
            var parser = this.sina._createCDSAnnotationsParser({
                dataSource: dataSource,
                cdsAnnotations: cdsAnnotations,
            });
            parser.parseCDSAnnotationsForDataSource();
        };
        MetadataParser.prototype.fillPublicMetadataBuffer = function (dataSource, attributeMetadata, cdsAnnotations) {
            var displayOrderIndex = attributeMetadata.displayOrder;
            // Prepare annotations for being passed over to the CDS annotations parser
            var attributeAnnotations = (cdsAnnotations.attributeAnnotations[attributeMetadata.labelRaw] = {});
            // var attributeAnnotationsSrc = attributeMetadata.annotationsAttr;
            // jQuery.extend(attributeAnnotations, attributeMetadata.annotationsAttr);
            for (var propName in attributeMetadata.annotationsAttr) {
                attributeAnnotations[propName] = attributeMetadata.annotationsAttr[propName];
            }
            // if this attribute has a Semantics property but no semantics annotation, create a new semantics annotation that corresponds to Semantics propery.
            // var hasSemanticsAnnotation = false,
            //     semanticsPrefix = "SEMANTICS.";
            // for(var key in attributeAnnotationsSrc){
            //     attributeAnnotations[key] = attributeAnnotationsSrc[key];
            // }
            // for (var j = 0; j < attributeAnnotationsSrc.length; j++) {
            // if (hasSemanticsAnnotation || attributeAnnotationsSrc[j].Name.substr(0, semanticsPrefix.length) == semanticsPrefix) {
            //     hasSemanticsAnnotation = true;
            // }
            // }
            // if (attributeMetadata.Semantics && !hasSemanticsAnnotation) {
            //     var semanticsValue;
            //     switch (attributeMetadata.Semantics) {
            //     case "EMAIL.ADDRESS":
            //     case "TELEPHONE.TYPE":
            //     case "CURRENCYCODE":
            //     case "UNITOFMEASURE":
            //         semanticsValue = "TRUE";
            //         break;
            //     case "QUANTITY.UNITOFMEASURE":
            //     case "AMOUNT.CURRENCYCODE":
            //         semanticsValue = attributeMetadata.UnitAttribute;
            //         break;
            //     }
            //     if (semanticsValue) {
            //         attributeAnnotations[semanticsPrefix + attributeMetadata.Semantics] = semanticsValue;
            //     }
            // }
            var typeAndFormat = this._parseAttributeTypeAndFormat(attributeMetadata, dataSource);
            if (typeAndFormat && typeAndFormat.type) {
                var publicAttributeMetadata = this.sina._createAttributeMetadata({
                    id: attributeMetadata.labelRaw,
                    label: attributeMetadata.label || attributeMetadata.labelRaw,
                    isKey: attributeMetadata.isKey || false,
                    isSortable: attributeMetadata.isSortable,
                    usage: this._parseUsage(attributeMetadata, displayOrderIndex) || {},
                    type: typeAndFormat.type,
                    format: typeAndFormat.format,
                    matchingStrategy: this._parseMatchingStrategy(attributeMetadata),
                    isHierarchy: !!attributeMetadata.hierarchyDefinition,
                });
                publicAttributeMetadata._private.semanticObjectType = attributeMetadata.SemanticObjectTypeId;
                publicAttributeMetadata._private.hierarchyDefinition = attributeMetadata.hierarchyDefinition;
                dataSource.attributesMetadata.push(publicAttributeMetadata);
                dataSource.attributeMetadataMap[publicAttributeMetadata.id] = publicAttributeMetadata;
            }
        };
        MetadataParser.prototype._parseMatchingStrategy = function (attributeMetadata) {
            if (attributeMetadata.supportsTextSearch === true) {
                return MatchingStrategy_1.MatchingStrategy.Text;
            }
            return MatchingStrategy_1.MatchingStrategy.Exact;
        };
        MetadataParser.prototype._parseAttributeTypeAndFormat = function (attributeMetadata, dataSource) {
            for (var i = 0; i < attributeMetadata.presentationUsage.length; i++) {
                var presentationUsage = attributeMetadata.presentationUsage[i] || "";
                switch (presentationUsage.toUpperCase()) {
                    case "SUMMARY":
                        continue;
                    case "DETAIL":
                        continue;
                    case "TITLE":
                        continue;
                    case "HIDDEN":
                        continue;
                    case "FACTSHEET":
                        continue;
                    case "THUMBNAIL":
                    case "IMAGE":
                        return {
                            type: AttributeType_1.AttributeType.ImageUrl,
                        };
                    case "LONGTEXT":
                        return {
                            type: AttributeType_1.AttributeType.String,
                            format: AttributeFormatType_1.AttributeFormatType.LongText,
                        };
                    default:
                        throw new errors_1.UnknownPresentationUsageError("Unknown presentation usage " + presentationUsage);
                }
            }
            switch (attributeMetadata.type) {
                case "Edm.Binary":
                    if (attributeMetadata.annotationsAttr) {
                        if ((attributeMetadata.annotationsAttr.SEMANTICS &&
                            attributeMetadata.annotationsAttr.SEMANTICS.CONTACT &&
                            attributeMetadata.annotationsAttr.SEMANTICS.CONTACT.PHOTO) ||
                            (attributeMetadata.annotationsAttr.SEMANTICS &&
                                attributeMetadata.annotationsAttr.SEMANTICS.IMAGEURL)) {
                            return {
                                type: AttributeType_1.AttributeType.ImageBlob,
                            };
                        }
                    }
                    return {
                        type: AttributeType_1.AttributeType.String,
                    };
                    break;
                case "Edm.String":
                case "Edm.Boolean":
                case "Edm.Byte":
                case "Edm.Guid":
                    return {
                        type: AttributeType_1.AttributeType.String,
                    };
                case "Edm.Double":
                case "Edm.Decimal":
                case "Edm.Float":
                case "Edm.Single":
                case "Edm.SingleRange":
                    return {
                        type: AttributeType_1.AttributeType.Double,
                    };
                case "Edm.Int16":
                case "Edm.Int32":
                case "Edm.Int64":
                    return {
                        type: AttributeType_1.AttributeType.Integer,
                    };
                case "Edm.Time":
                    return {
                        type: AttributeType_1.AttributeType.Time,
                    };
                case "Edm.Date":
                    return {
                        type: AttributeType_1.AttributeType.Date,
                    };
                case "Edm.DateTime":
                case "Edm.DateTimeOffset":
                    if (attributeMetadata.TypeLength !== undefined && attributeMetadata.TypeLength <= 8) {
                        // is this necessary for backwards compatibility??
                        return {
                            type: AttributeType_1.AttributeType.Date,
                        };
                    }
                    return {
                        type: AttributeType_1.AttributeType.Timestamp,
                    };
                case "Collection(Edm.String)":
                    return {
                        type: AttributeType_1.AttributeType.String,
                    };
                case "Edm.GeometryPoint":
                    return {
                        type: AttributeType_1.AttributeType.GeoJson,
                    };
                case "GeoJson":
                    return {
                        type: AttributeType_1.AttributeType.GeoJson,
                    };
                default:
                    if (attributeMetadata.type && attributeMetadata.type.startsWith("Collection")) {
                        this.log.warn("Unsupported data type " +
                            attributeMetadata.type +
                            " of attribute " +
                            attributeMetadata.labelRaw +
                            " in " +
                            dataSource.label);
                        return {
                            type: AttributeType_1.AttributeType.String,
                        };
                    }
                    this.log.error("Unknown data type " +
                        attributeMetadata.type +
                        " of attribute " +
                        attributeMetadata.labelRaw +
                        " in " +
                        dataSource.label);
                    return null;
            }
        };
        MetadataParser.prototype._parseUsage = function (attributeMetadata, displayOrderIndex) {
            var usage = {};
            for (var i = 0; i < attributeMetadata.presentationUsage.length; i++) {
                var id = attributeMetadata.presentationUsage[i].toUpperCase() || "";
                if (id === "TITLE") {
                    usage.Title = {
                        displayOrder: displayOrderIndex,
                    };
                }
                if (id === "SUMMARY" ||
                    id === "DETAIL" ||
                    id === "IMAGE" ||
                    id === "THUMBNAIL" ||
                    id === "LONGTEXT"
                //||id === "#HIDDEN"
                ) {
                    usage.Detail = {
                        displayOrder: displayOrderIndex,
                    };
                }
            }
            if (attributeMetadata.isFacet) {
                usage.AdvancedSearch = {
                    displayOrder: displayOrderIndex,
                };
                usage.Facet = {
                    displayOrder: displayOrderIndex,
                };
            }
            return usage;
        };
        MetadataParser.prototype.parseDynamicMetadata = function (searchResult) {
            // check that we have dynamic metadata
            var data = searchResult.data;
            if (!data) {
                return;
            }
            var metadata = data["@com.sap.vocabularies.Search.v1.Metadata"];
            if (!metadata) {
                return;
            }
            // generate attributes from dynamic metadata
            for (var dataSourceId in metadata) {
                var dataSourceMetadata = metadata[dataSourceId];
                for (var attributeId in dataSourceMetadata) {
                    if (attributeId === "$Kind") {
                        continue;
                    }
                    var dynamicAttributeMetadata = dataSourceMetadata[attributeId];
                    this.parseDynamicAttributeMetadata(this.sina.getDataSource(dataSourceId), attributeId, dynamicAttributeMetadata);
                }
            }
        };
        MetadataParser.prototype.parseDynamicAttributeMetadata = function (dataSource, attributeId, dynamicAttributeMetadata) {
            var typeAndFormat = this._parseAttributeTypeAndFormat({
                presentationUsage: [],
                type: dynamicAttributeMetadata.$Type,
            }, dataSource);
            var attributeMetadata;
            try {
                attributeMetadata = dataSource.getAttributeMetadata(attributeId);
            }
            catch (e) {
                // error handling below
            }
            if (attributeMetadata) {
                // update
                if (!attributeMetadata._private.dynamic) {
                    return; // only update dynamic attributes
                }
                attributeMetadata.label = dynamicAttributeMetadata["@SAP.Common.Label"];
                attributeMetadata.type = typeAndFormat.type;
                attributeMetadata.format = typeAndFormat.format;
            }
            else {
                // append
                attributeMetadata = this.sina._createAttributeMetadata({
                    id: attributeId,
                    label: dynamicAttributeMetadata["@SAP.Common.Label"],
                    isKey: false,
                    isSortable: false,
                    usage: {},
                    type: typeAndFormat.type,
                    format: typeAndFormat.format,
                    matchingStrategy: MatchingStrategy_1.MatchingStrategy.Exact,
                    _private: {
                        dynamic: true,
                    },
                });
                dataSource.attributesMetadata.push(attributeMetadata);
                dataSource.attributeMetadataMap[attributeMetadata.id] = attributeMetadata;
            }
        };
        MetadataParser.prototype.getUniqueDataSourceFromSearchResult = function (searchResult) {
            var data = searchResult.data;
            if (!data) {
                return;
            }
            var items = data.value;
            if (!items) {
                return;
            }
            var dataSourceId, prevDataSourceId;
            for (var i = 0; i < items.length; ++i) {
                var item = items[i];
                var context = item["@odata.context"];
                if (!context) {
                    return;
                }
                dataSourceId = context.split("#")[1];
                if (!dataSourceId) {
                    return;
                }
                if (prevDataSourceId && prevDataSourceId !== dataSourceId) {
                    return;
                }
                prevDataSourceId = dataSourceId;
            }
            return this.sina.getDataSource(dataSourceId);
        };
        return MetadataParser;
    }());
    exports.MetadataParser = MetadataParser;
});
})();