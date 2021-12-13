/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

/* global Proxy, Reflect, Symbol */

(function(){
sap.ui.define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HierarchyMetadataParser = void 0;
    var HierarchyMetadataParser = /** @class */ (function () {
        function HierarchyMetadataParser(jQuery) {
            this.jQuery = jQuery;
        }
        HierarchyMetadataParser.prototype.parse = function (hierarchAnnotationNode) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            var that = this;
            var hierarchyDefinitionsMap = {};
            that.jQuery(hierarchAnnotationNode)
                .find("Collection")
                .each(function () {
                that.jQuery(this)
                    .find("Record")
                    .each(function () {
                    var hierarchyDefinition = that.parseRecord(this);
                    hierarchyDefinitionsMap[hierarchyDefinition.name] = hierarchyDefinition;
                });
            });
            return hierarchyDefinitionsMap;
        };
        HierarchyMetadataParser.prototype.parseRecord = function (recordNode) {
            var hierarchyDefinition = { name: "", parentAttributeName: "", childAttributeName: "" };
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            var that = this;
            that.jQuery(recordNode)
                .find(">PropertyValue")
                .each(function () {
                switch (that.jQuery(this).attr("Property")) {
                    case "Name":
                        hierarchyDefinition.name = that.jQuery(this).attr("String");
                        break;
                    case "Recurse":
                        Object.assign(hierarchyDefinition, that.parseRecurse(this));
                }
            });
            return hierarchyDefinition;
        };
        HierarchyMetadataParser.prototype.parseRecurse = function (recurseNode) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            var that = this;
            var result = { parentAttributeName: "", childAttributeName: "" };
            that.jQuery(recurseNode)
                .find(">PropertyValue")
                .each(function () {
                switch (that.jQuery(this).attr("Property")) {
                    case "Parent":
                        that.jQuery(this)
                            .find("Collection")
                            .each(function () {
                            result.parentAttributeName = that.parseCollection(this);
                        });
                        break;
                    case "Child":
                        that.jQuery(this)
                            .find(">Collection")
                            .each(function () {
                            result.childAttributeName = that.parseCollection(this);
                        });
                }
            });
            return result;
        };
        HierarchyMetadataParser.prototype.parseCollection = function (collectionNode) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            var that = this;
            var attributeName;
            that.jQuery(collectionNode)
                .find(">PropertyPath")
                .each(function () {
                attributeName = that.jQuery(this).text();
            });
            return attributeName;
        };
        return HierarchyMetadataParser;
    }());
    exports.HierarchyMetadataParser = HierarchyMetadataParser;
});
})();