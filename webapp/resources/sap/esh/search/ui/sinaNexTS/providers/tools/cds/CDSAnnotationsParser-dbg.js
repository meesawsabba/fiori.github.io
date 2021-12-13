/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

/* global Proxy, Reflect, Symbol */

(function(){
/* eslint-disable @typescript-eslint/ban-types */
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
sap.ui.define(["require", "exports", "../../../sina/SinaObject", "../../../sina/AttributeGroupTextArrangement", "../../../sina/AttributeType", "../../../sina/AttributeFormatType", "../../../sina/AttributeSemanticsType", "../../../core/Log"], function (require, exports, SinaObject_1, AttributeGroupTextArrangement_1, AttributeType_1, AttributeFormatType_1, AttributeSemanticsType_1, Log_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CDSAnnotationsParser = void 0;
    var CDSAnnotationsParser = /** @class */ (function (_super) {
        __extends(CDSAnnotationsParser, _super);
        function CDSAnnotationsParser(properties) {
            var _this = _super.call(this, properties) || this;
            _this.log = new Log_1.Log("hana odata cds annotations parser");
            _this._datasource = properties.dataSource;
            _this._cdsAnnotations = properties.cdsAnnotations;
            _this._parsedAttributes = {};
            _this._knownAttributeGroups = {};
            _this._knownAttributeGroupsArray = [];
            _this._attributeGroupReplacements = {};
            _this._AttributeUsagePrio = {
                HIGH: "HIGH",
                MEDIUM: "MEDIUM",
                NONE: "NONE",
            };
            /*
                    Example Usage Stub:
                    var usage = {
                        attribute: <some attribute or attribute group object>,
                        displayOrder: <integer vaue>,
                        prio: <Enumeration this._AttributeUsagePrio>,
                        obsolete: <boolean>
                    }
                 */
            _this._detailUsageStubsMap = {};
            _this._detailUsageStubsPrioHigh = [];
            _this._detailUsageStubsPrioMedium = [];
            _this._detailUsageStubsPrioNone = [];
            _this._defaultTextArrangement = AttributeGroupTextArrangement_1.AttributeGroupTextArrangement.TextLast;
            return _this;
        }
        /////////////////////////////////
        // Main Parse Function
        ///
        CDSAnnotationsParser.prototype.parseCDSAnnotationsForDataSource = function () {
            this._parsingResult = {
                dataSourceIsCdsBased: false,
                detailAttributesAreSorted: false,
                titleAttributesAreSorted: false,
            };
            // CDS Annotations Object looks like:
            // cdsAnnotations = {
            //     dataSourceAnnotations: {}, // JSON object representing the structure of CDS annotations
            //     attributeAnnotations: {} // Key-Value-Map (keys: attribute names) of JSON objects representing the structure of CDS annotations per attribute
            // };
            this._parseDefaultTextArrangement();
            this._parseAttributeAnnotations();
            this._parseDataSourceAnnotations();
            return this._parsingResult;
        };
        //////////////////////////////////////////////////////////
        // Setters and Getters for internal Variables
        //////////////////////////////////////////////////////////
        CDSAnnotationsParser.prototype._addDetailUsageStub = function (attribute, displayOrder, prio) {
            var attributeId;
            if (typeof attribute === "string") {
                attributeId = attribute;
                attribute = undefined;
            }
            else {
                attributeId = attribute.id;
            }
            var usageStub = {
                attribute: attribute,
                displayOrder: displayOrder,
                prio: prio,
                obsolete: false,
            };
            this._detailUsageStubsMap[attributeId] = usageStub;
            if (prio === this._AttributeUsagePrio.HIGH) {
                this._detailUsageStubsPrioHigh.push(usageStub);
            }
            else if (prio === this._AttributeUsagePrio.MEDIUM) {
                this._detailUsageStubsPrioMedium.push(usageStub);
            }
            else {
                this._detailUsageStubsPrioNone.push(usageStub);
            }
        };
        CDSAnnotationsParser.prototype._getDetailUsageStub = function (attribute) {
            if (!attribute) {
                return undefined;
            }
            var attributeId;
            if (typeof attribute === "string") {
                attributeId = attribute;
            }
            else {
                attributeId = attribute.id;
            }
            return this._detailUsageStubsMap[attributeId];
        };
        CDSAnnotationsParser.prototype._setParsedAttribute = function (attributeName, attribute) {
            this._parsedAttributes[attributeName.toUpperCase()] = attribute;
        };
        CDSAnnotationsParser.prototype._getParsedAttribute = function (attributeName) {
            return this._parsedAttributes[attributeName.toUpperCase()];
        };
        CDSAnnotationsParser.prototype._setknownAttributeGroup = function (qualifier, attributeGroup) {
            this._knownAttributeGroups[qualifier.toUpperCase()] = attributeGroup;
        };
        CDSAnnotationsParser.prototype._getknownAttributeGroup = function (qualifier) {
            return this._knownAttributeGroups[qualifier.toUpperCase()];
        };
        ////////////////////////////////////////////////////
        // Set default Text Arrangement for Descriptions
        ///
        CDSAnnotationsParser.prototype._parseDefaultTextArrangement = function () {
            try {
                var defaultTextArrangement = this._deriveTextArrangementFromCdsAnnotation(this._cdsAnnotations.dataSourceAnnotations.UI &&
                    this._cdsAnnotations.dataSourceAnnotations.UI.TEXTARRANGEMENT);
                this._defaultTextArrangement = defaultTextArrangement || this._defaultTextArrangement;
            }
            catch (e) {
                // TODO: write error message to browser console (needs sinaNext logger)
                // console.log("Could not parse default text arrangement for datasource: " + e);
            }
        };
        //////////////////////////////////////////////////////////////////////
        // Parse Data Source Annotations
        //////////////////////////////////////////////////////////////////////
        CDSAnnotationsParser.prototype._parseDataSourceAnnotations = function () {
            if (Object.keys(this._cdsAnnotations.dataSourceAnnotations).length > 0) {
                try {
                    var ui = this._cdsAnnotations.dataSourceAnnotations.UI;
                    var headerInfo = ui && ui.HEADERINFO;
                    var title = headerInfo && headerInfo.TITLE;
                    var type = void 0, groupQualifier = void 0, attributeGroup = void 0;
                    if (title) {
                        type = title.TYPE && title.TYPE.toUpperCase();
                        if (type === "AS_CONNECTED_FIELDS") {
                            groupQualifier = title.VALUEQUALIFIER;
                            if (groupQualifier && groupQualifier.trim().length > 0) {
                                attributeGroup = this._getknownAttributeGroup(groupQualifier);
                                if (attributeGroup) {
                                    //&& attributeGroup === titleAttribute.group) {
                                    attributeGroup.usage.Title = {
                                        displayOrder: 1,
                                    };
                                }
                            }
                        }
                        else if (!type) {
                            var titleAttributeName = title.VALUE;
                            if (titleAttributeName) {
                                var titleAttribute = this._getParsedAttribute(titleAttributeName);
                                if (titleAttribute) {
                                    titleAttribute.usage.Title = {
                                        displayOrder: 1,
                                    };
                                }
                            }
                        }
                        var urlAttributeName = title.URL;
                        if (urlAttributeName) {
                            var urlAttribute = this._getParsedAttribute(urlAttributeName);
                            if (urlAttribute) {
                                urlAttribute.usage.Navigation = {
                                    mainNavigation: true,
                                };
                            }
                        }
                    }
                    var description = headerInfo && headerInfo.DESCRIPTION;
                    if (description) {
                        type = description.TYPE;
                        if (type === "AS_CONNECTED_FIELDS") {
                            groupQualifier = description.VALUEQUALIFIER;
                            if (groupQualifier && groupQualifier.trim().length > 0) {
                                attributeGroup = this._getknownAttributeGroup(groupQualifier);
                                if (attributeGroup) {
                                    //&& attributeGroup === titleAttribute.group) {
                                    attributeGroup.usage.TitleDescription = {
                                        displayOrder: 1,
                                    };
                                }
                            }
                        }
                        else if (!type) {
                            var titleDescriptionAttributeName = description.VALUE;
                            if (titleDescriptionAttributeName) {
                                var titleDescriptionAttribute = this._getParsedAttribute(titleDescriptionAttributeName);
                                if (titleDescriptionAttribute) {
                                    titleDescriptionAttribute.usage.TitleDescription = {};
                                }
                            }
                        }
                    }
                    var titleIconAttributeName = headerInfo && headerInfo.IMAGEURL;
                    if (titleIconAttributeName) {
                        var titleIconAttribute = this._getParsedAttribute(titleIconAttributeName);
                        if (titleIconAttribute) {
                            titleIconAttribute.usage.Title = {};
                            titleIconAttribute.type = this.sina.AttributeType.ImageUrl;
                        }
                    }
                }
                catch (e) {
                    this.log.warn("Could not parse attribute for datasource: " + e);
                }
            }
        };
        //////////////////////////////////////////////////////////////////////
        // Parse Attribute Annotations
        //////////////////////////////////////////////////////////////////////
        CDSAnnotationsParser.prototype._parseAttributeAnnotations = function () {
            for (var attributeId in this._datasource.attributeMetadataMap) {
                this._parseSingleAttribute(attributeId);
            }
            this._datasource.attributesMetadata = this._datasource.attributesMetadata.concat(this._knownAttributeGroupsArray);
            this._datasource.attributeMetadataMap = Object.assign(this._datasource.attributeMetadataMap, this._knownAttributeGroups);
            this._sortAttributes();
        };
        CDSAnnotationsParser.prototype._parseSingleAttribute = function (attributeId) {
            var parsedAttribute = this._getParsedAttribute(attributeId);
            if (!parsedAttribute) {
                parsedAttribute = this._getPropertyFromObject(this._datasource.attributeMetadataMap, attributeId);
                if (parsedAttribute && parsedAttribute.id) {
                    this._setParsedAttribute(parsedAttribute.id, parsedAttribute);
                    var attributeAnnotations = this._cdsAnnotations.attributeAnnotations[parsedAttribute.id] || {};
                    if (Object.keys(attributeAnnotations).length > 0) {
                        this._parsingResult.dataSourceIsCdsBased = true;
                        try {
                            // catch and write any parsing error to browser console
                            if (attributeAnnotations.UI !== undefined) {
                                /// Identification (Positions, URLs)
                                this._parseSingleAnnotationOrArray(parsedAttribute, attributeAnnotations.UI.IDENTIFICATION, this._parseIdentification);
                                /// Groups
                                this._parseSingleAnnotationOrArray(parsedAttribute, attributeAnnotations.UI.CONNECTEDFIELDS, this._parseConnectedFields);
                                this._parseURLsForDocumentResultItemThumbnail(parsedAttribute, attributeAnnotations.UI.IDENTIFICATION, attributeAnnotations.SEMANTICS);
                                if (attributeAnnotations.UI.MULTILINETEXT !== undefined) {
                                    parsedAttribute.format = AttributeFormatType_1.AttributeFormatType.MultilineText;
                                }
                            }
                            this._parseSemantics(parsedAttribute, attributeAnnotations.SEMANTICS);
                            this._parseDescriptionAttribute(parsedAttribute, attributeAnnotations.OBJECTMODEL, attributeAnnotations.UI);
                        }
                        catch (e) {
                            // TODO: write error message to browser console (needs sinaNext logger)
                            // console.log("Could not parse attribute for datasource: " + e);
                        }
                    }
                }
            }
            return parsedAttribute;
        };
        CDSAnnotationsParser.prototype._parseConnectedFields = function (attribute, connectedFields) {
            var qualifier = connectedFields.QUALIFIER;
            if (qualifier) {
                var attributesMap = {};
                if (connectedFields.NAME) {
                    attributesMap[connectedFields.NAME] = attribute;
                }
                this._createAttributeGroup(qualifier, connectedFields.GROUPLABEL, connectedFields.TEMPLATE, attributesMap);
            }
        };
        CDSAnnotationsParser.prototype._createAttributeGroup = function (qualifier, label, template, attributesMap) {
            var attributeGroup = this._getknownAttributeGroup(qualifier);
            if (!attributeGroup) {
                attributeGroup = this.sina._createAttributeGroupMetadata({
                    id: qualifier,
                    label: label || "",
                    type: AttributeType_1.AttributeType.Group,
                    template: template || "",
                    attributes: [],
                    usage: {},
                });
                this._setknownAttributeGroup(qualifier, attributeGroup);
                this._knownAttributeGroupsArray.push(attributeGroup);
                this._datasource.attributeGroupsMetadata.push(attributeGroup);
                this._datasource.attributeGroupMetadataMap[qualifier] = attributeGroup;
                var usageStub = this._getDetailUsageStub(qualifier);
                if (usageStub) {
                    usageStub.attribute = attributeGroup;
                }
            }
            else {
                if (label && !attributeGroup.label) {
                    attributeGroup.label = label;
                }
                if (template && !attributeGroup.template) {
                    attributeGroup.template = template;
                }
            }
            if (attributesMap) {
                for (var nameOfAttributeInGroup in attributesMap) {
                    var attribute = attributesMap[nameOfAttributeInGroup];
                    var attributeGroupMembership = this.sina._createAttributeGroupMembership({
                        group: attributeGroup,
                        attribute: attribute,
                        nameInGroup: nameOfAttributeInGroup,
                    });
                    attributeGroup.attributes.push(attributeGroupMembership);
                    attribute.groups.push(attributeGroupMembership);
                }
            }
            return attributeGroup;
        };
        // TODO: what's this extra function for??
        CDSAnnotationsParser.prototype._parseIdentification = function (attribute, identification) {
            this._parseAttributePositions(attribute, identification);
        };
        CDSAnnotationsParser.prototype._parseAttributePositions = function (attribute, identification) {
            // Following also takes care of a fallback:
            // in case that there is an importance, but no position (like it could have happened in the past), set position to a default (Number.MAX_VALUE)
            var importance = identification.IMPORTANCE && identification.IMPORTANCE.toUpperCase();
            var position = identification.POSITION;
            if (importance && !position) {
                position = Number.MAX_VALUE;
            }
            if (position !== undefined) {
                switch (importance) {
                    case "HIGH":
                    case "MEDIUM":
                    case undefined: {
                        position = this._parsePosition(position);
                        var type = identification.TYPE && identification.TYPE.toUpperCase();
                        switch (type) {
                            case "AS_CONNECTED_FIELDS": {
                                var qualifier = identification.VALUEQUALIFIER;
                                if (qualifier) {
                                    var attributeGroup = this._getknownAttributeGroup(qualifier);
                                    if (attributeGroup) {
                                        // We already know the group
                                        attribute = attributeGroup;
                                    }
                                    else {
                                        // We don't know the group yet, so we remember the usage for later
                                        attribute = qualifier;
                                    }
                                }
                            }
                            // fall-through to undefined case..
                            // eslint-disable-next-line no-fallthrough
                            case undefined: {
                                // if type is anything but AS_CONNECTED_FIELDS or undefined, we'll ignore the position
                                var usageStub = this._getDetailUsageStub(attribute);
                                if (usageStub) {
                                    if (!usageStub.attribute && typeof attribute !== "string") {
                                        usageStub.attribute = attribute;
                                    }
                                }
                                else {
                                    var prio = void 0;
                                    if (importance === "HIGH") {
                                        prio = this._AttributeUsagePrio.HIGH;
                                    }
                                    else if (importance === "MEDIUM") {
                                        prio = this._AttributeUsagePrio.MEDIUM;
                                    }
                                    else {
                                        prio = this._AttributeUsagePrio.NONE;
                                    }
                                    this._addDetailUsageStub(attribute, position, prio);
                                }
                            }
                        }
                    }
                }
            }
        };
        // @UI.identification.url: 'SUV_URL'
        // @Semantics.imageUrl
        // ESH_FL_TASK.THUMBNAIL_URL AS THUMB_URL,
        //
        // @Semantics.url.mimeType: ‘SUV_MIME‘
        // @UI.hidden
        // ESH_FL_TASK.SUV_URL AS SUV_URL,
        //
        // @UI.hidden
        // ESH_FL_TAS.SUV_MIME AS SUV_MIME,
        //
        CDSAnnotationsParser.prototype._parseURLsForDocumentResultItemThumbnail = function (attribute, identification, semantics) {
            if (!(semantics && semantics.IMAGEURL)) {
                return;
            }
            var urlAttributeName;
            if (identification) {
                if (Array.isArray(identification)) {
                    // in case @UI.identification is an array, we look for the first entry which holds a URL sub-entry
                    for (var i = 0; i < identification.length; i++) {
                        if (identification[i].URL) {
                            urlAttributeName = identification[i].URL;
                            break;
                        }
                    }
                }
                else {
                    urlAttributeName = identification.URL;
                }
            }
            if (urlAttributeName && semantics && semantics.IMAGEURL) {
                var urlAttributeAnnotations = this._getPropertyFromObject(this._cdsAnnotations.attributeAnnotations, urlAttributeName);
                if (urlAttributeAnnotations) {
                    var mimeTypeAttributeName = urlAttributeAnnotations.SEMANTICS &&
                        urlAttributeAnnotations.SEMANTICS.URL &&
                        urlAttributeAnnotations.SEMANTICS.URL.MIMETYPE;
                    if (mimeTypeAttributeName) {
                        var urlAttribute = this._getPropertyFromObject(this._datasource.attributeMetadataMap, urlAttributeName);
                        var mimeTypeAttribute = this._getPropertyFromObject(this._datasource.attributeMetadataMap, mimeTypeAttributeName);
                        attribute.suvUrlAttribute = urlAttribute;
                        attribute.suvMimeTypeAttribute = mimeTypeAttribute;
                        attribute.format = AttributeFormatType_1.AttributeFormatType.DocumentThumbnail;
                    }
                }
            }
        };
        CDSAnnotationsParser.prototype._parseSemantics = function (attribute, semantics) {
            if (semantics) {
                if (semantics.CONTACT && semantics.CONTACT.PHOTO !== undefined) {
                    attribute.format = AttributeFormatType_1.AttributeFormatType.Round;
                    if (attribute.type !== AttributeType_1.AttributeType.ImageBlob) {
                        attribute.type = AttributeType_1.AttributeType.ImageUrl;
                    }
                }
                if (semantics.IMAGEURL !== undefined) {
                    if (attribute.type !== AttributeType_1.AttributeType.ImageBlob) {
                        attribute.type = AttributeType_1.AttributeType.ImageUrl;
                    }
                }
                if (semantics.NAME !== undefined) {
                    if (semantics.NAME.GIVENNAME !== undefined) {
                        attribute.semantics = AttributeSemanticsType_1.AttributeSemanticsType.FirstName;
                    }
                    if (semantics.NAME.FAMILYNAME !== undefined) {
                        attribute.semantics = AttributeSemanticsType_1.AttributeSemanticsType.LastName;
                    }
                }
                if (semantics.EMAIL && semantics.EMAIL.ADDRESS !== undefined) {
                    attribute.semantics = AttributeSemanticsType_1.AttributeSemanticsType.EmailAddress;
                }
                if (semantics.TELEPHONE && semantics.TELEPHONE.TYPE !== undefined) {
                    attribute.semantics = AttributeSemanticsType_1.AttributeSemanticsType.PhoneNr;
                }
                if (semantics && semantics.URL !== undefined) {
                    attribute.semantics = AttributeSemanticsType_1.AttributeSemanticsType.HTTPURL;
                }
                if (semantics && semantics.CURRENCYCODE !== undefined) {
                    attribute._private.isCurrency = true;
                }
                if (semantics && semantics.UNITOFMEASURE !== undefined) {
                    attribute._private.isUnitOfMeasure = true;
                }
                var unitOfMeasureAttribute = void 0, currencyCodeAttribute = void 0, template = void 0;
                var unitOfMeasure = semantics.QUANTITY && semantics.QUANTITY.UNITOFMEASURE;
                if (unitOfMeasure) {
                    attribute._private.isQuantity = true;
                    unitOfMeasureAttribute = this._parseSingleAttribute(unitOfMeasure);
                    if (unitOfMeasureAttribute) {
                        if (unitOfMeasureAttribute._private.isUnitOfMeasure) {
                            template = "{" + attribute.id + "} {" + unitOfMeasureAttribute.id + "}";
                            this._createAttributeGroupForParentChildAttributes(attribute, unitOfMeasureAttribute, "____UnitOfMeasureGroup", template);
                        }
                    }
                }
                var currencyCode = semantics.AMOUNT && semantics.AMOUNT.CURRENCYCODE;
                if (currencyCode) {
                    currencyCodeAttribute = this._parseSingleAttribute(currencyCode);
                    if (currencyCodeAttribute) {
                        if (currencyCodeAttribute._private.isCurrency) {
                            template = "{" + attribute.id + "} {" + currencyCodeAttribute.id + "}";
                            this._createAttributeGroupForParentChildAttributes(attribute, currencyCodeAttribute, "____CurrencyGroup", template);
                        }
                    }
                }
            }
        };
        CDSAnnotationsParser.prototype._parseDescriptionAttribute = function (attribute, objectModel, ui) {
            var descriptionAttributeName = objectModel && objectModel.TEXT && objectModel.TEXT.ELEMENT;
            if (descriptionAttributeName) {
                if (Array.isArray(descriptionAttributeName)) {
                    if (descriptionAttributeName.length > 0) {
                        descriptionAttributeName = descriptionAttributeName[0];
                    }
                    else {
                        return;
                    }
                }
                var descriptionAttribute = this._parseSingleAttribute(descriptionAttributeName);
                if (descriptionAttribute) {
                    var textArrangement = this._deriveTextArrangementFromCdsAnnotation(ui && ui.TEXTARRANGEMENT) ||
                        this._defaultTextArrangement;
                    var useParentheses = !((attribute.semantics == AttributeSemanticsType_1.AttributeSemanticsType.FirstName &&
                        descriptionAttribute.semantics == AttributeSemanticsType_1.AttributeSemanticsType.LastName) ||
                        (descriptionAttribute.semantics == AttributeSemanticsType_1.AttributeSemanticsType.FirstName &&
                            attribute.semantics == AttributeSemanticsType_1.AttributeSemanticsType.LastName));
                    var parenthesesOpen = useParentheses ? "(" : "";
                    var parenthesesClose = useParentheses ? ")" : "";
                    var template = void 0;
                    if (textArrangement === AttributeGroupTextArrangement_1.AttributeGroupTextArrangement.TextFirst) {
                        template =
                            "{" +
                                descriptionAttribute.id +
                                "} " +
                                parenthesesOpen +
                                "{" +
                                attribute.id +
                                "}" +
                                parenthesesClose;
                    }
                    else if (textArrangement === AttributeGroupTextArrangement_1.AttributeGroupTextArrangement.TextLast) {
                        template =
                            "{" +
                                attribute.id +
                                "} " +
                                parenthesesOpen +
                                "{" +
                                descriptionAttribute.id +
                                "}" +
                                parenthesesClose;
                    }
                    else if (textArrangement === AttributeGroupTextArrangement_1.AttributeGroupTextArrangement.TextOnly) {
                        template = "{" + descriptionAttribute.id + "}";
                    }
                    else {
                        template =
                            "{" +
                                attribute.id +
                                "} " +
                                parenthesesOpen +
                                "{" +
                                descriptionAttribute.id +
                                "}" +
                                parenthesesClose;
                    }
                    var attributeGroup = this._createAttributeGroupForParentChildAttributes(attribute, descriptionAttribute, "____Description", template);
                    attributeGroup._private.isDescription = true;
                    attributeGroup._private.textArrangement = textArrangement;
                    if (attribute._private.isUnitOfMeasure || descriptionAttribute._private.isUnitOfMeasure) {
                        attributeGroup._private.isUnitOfMeasure = true;
                    }
                    if (attribute._private.isCurrency || descriptionAttribute._private.isCurrency) {
                        attributeGroup._private.isCurrency = true;
                    }
                }
            }
        };
        CDSAnnotationsParser.prototype._deriveTextArrangementFromCdsAnnotation = function (cdsTextArrangement) {
            if (cdsTextArrangement) {
                switch (cdsTextArrangement.toUpperCase()) {
                    case "TEXT_FIRST":
                        return AttributeGroupTextArrangement_1.AttributeGroupTextArrangement.TextFirst;
                    case "TEXT_LAST":
                        return AttributeGroupTextArrangement_1.AttributeGroupTextArrangement.TextLast;
                    case "TEXT_ONLY":
                        return AttributeGroupTextArrangement_1.AttributeGroupTextArrangement.TextOnly;
                    case "TEXT_SEPARATE":
                        return AttributeGroupTextArrangement_1.AttributeGroupTextArrangement.TextSeparate;
                }
            }
            return undefined;
        };
        CDSAnnotationsParser.prototype._createAttributeGroupForParentChildAttributes = function (parentAttribute, childAttribute, qualifierSuffix, template) {
            var qualifier = parentAttribute.id + qualifierSuffix;
            var attributesMap = {};
            attributesMap[parentAttribute.id] = parentAttribute;
            attributesMap[childAttribute.id] = childAttribute;
            var attributeGroup = this._createAttributeGroup(qualifier, parentAttribute.label, template, attributesMap);
            var obsoleteUsageStub = this._getDetailUsageStub(parentAttribute);
            if (obsoleteUsageStub) {
                obsoleteUsageStub.obsolete = true;
                this._addDetailUsageStub(attributeGroup, obsoleteUsageStub.displayOrder, obsoleteUsageStub.prio);
            }
            this._replaceAttributeWithGroup(parentAttribute, attributeGroup);
            attributeGroup._private.parentAttribute = parentAttribute;
            attributeGroup._private.childAttribute = childAttribute;
            if (childAttribute._private && childAttribute._private.isCurrency) {
                attributeGroup._private.isCurrency = true;
            }
            if (childAttribute._private && childAttribute._private.isUnitOfMeasure) {
                attributeGroup._private.isUnitOfMeasure = true;
            }
            return attributeGroup;
        };
        CDSAnnotationsParser.prototype._replaceAttributeWithGroup = function (attribute, attributeGroupReplacement) {
            this._setParsedAttribute(attribute.id, attributeGroupReplacement);
            for (var i = 0; i < attribute.groups.length; i++) {
                var groupMembership = attribute.groups[i];
                if (groupMembership.group != attributeGroupReplacement) {
                    groupMembership.attribute = attributeGroupReplacement;
                }
            }
        };
        CDSAnnotationsParser.prototype._sortAttributes = function () {
            var sortFunction = function (entry1, entry2) {
                if (entry1.displayOrder < entry2.displayOrder) {
                    return -1;
                }
                else if (entry1.displayOrder > entry2.displayOrder) {
                    return 1;
                }
                return 0;
            };
            var i, allEntries;
            if (this._detailUsageStubsPrioHigh.length > 0 || this._detailUsageStubsPrioMedium.length > 0) {
                this._detailUsageStubsPrioHigh.sort(sortFunction);
                this._detailUsageStubsPrioMedium.sort(sortFunction);
                var _allEntries = this._detailUsageStubsPrioHigh.concat(this._detailUsageStubsPrioMedium);
                for (i = 0; i < _allEntries.length; i++) {
                    if (!_allEntries[i].obsolete) {
                        allEntries = _allEntries;
                        break;
                    }
                }
            }
            if (!allEntries) {
                allEntries = this._detailUsageStubsPrioNone.sort(sortFunction);
            }
            for (i = 0; i < allEntries.length; i++) {
                var entry = allEntries[i];
                if (!entry.obsolete && entry.attribute && typeof entry.attribute !== "string") {
                    entry.attribute.usage = entry.attribute.usage || {};
                    entry.attribute.usage.Detail = {
                        displayOrder: i,
                    };
                }
            }
            this._parsingResult.detailAttributesAreSorted = true;
        };
        CDSAnnotationsParser.prototype._parseSingleAnnotationOrArray = function (attribute, annotation, parseFunction) {
            if (annotation !== undefined) {
                if (Array.isArray(annotation)) {
                    for (var j = 0; j < annotation.length; j++) {
                        parseFunction.apply(this, [attribute, annotation[j]]);
                    }
                }
                else {
                    parseFunction.apply(this, [attribute, annotation]);
                }
            }
        };
        CDSAnnotationsParser.prototype._parsePosition = function (position) {
            if (typeof position === "string") {
                try {
                    position = parseInt(position, 10);
                }
                catch (e) {
                    position = Number.MAX_VALUE;
                }
            }
            if (typeof position !== "number" || isNaN(position)) {
                position = Number.MAX_VALUE; // or use Number.POSITIVE_INFINITY ?
            }
            return position;
        };
        // get a property from an object, even if the property names differ regarding case-sensitivity
        CDSAnnotationsParser.prototype._getPropertyFromObject = function (object, propertyName) {
            if (object[propertyName]) {
                return object[propertyName];
            }
            propertyName = propertyName.toLowerCase();
            for (var key in object) {
                if (key.toLowerCase() === propertyName) {
                    return object[key];
                }
            }
            return undefined;
        };
        return CDSAnnotationsParser;
    }(SinaObject_1.SinaObject));
    exports.CDSAnnotationsParser = CDSAnnotationsParser;
});
})();