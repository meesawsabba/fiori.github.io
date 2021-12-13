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
sap.ui.define(["require", "exports", "./ConfigFormatter"], function (require, exports, ConfigFormatter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConfigMetadataFormatter = void 0;
    // =======================================================================
    // metadata description of metadata
    // =======================================================================
    var metadataType = {
        type: "object",
        typeName: "DataSources",
        properties: [
            {
                name: "dataSources",
                multiple: true,
                getElementId: function (dataSource) {
                    return dataSource.id;
                },
                type: {
                    type: "object",
                    typeName: "DataSource",
                    properties: [
                        {
                            name: "label",
                            type: "string",
                        },
                        {
                            name: "labelPlural",
                            type: "string",
                        },
                        {
                            name: "attributesMetadata",
                            multiple: true,
                            getElementId: function (attributeMetadata) {
                                return attributeMetadata.id;
                            },
                            type: {
                                type: "object",
                                typeName: "AttributeMetadata",
                                properties: [
                                    {
                                        name: "label",
                                        type: "string",
                                    },
                                    {
                                        name: "format",
                                        type: "string",
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };
    // =======================================================================
    // formatter
    // =======================================================================
    var ConfigMetadataFormatter = /** @class */ (function (_super) {
        __extends(ConfigMetadataFormatter, _super);
        function ConfigMetadataFormatter(configuration) {
            return _super.call(this, metadataType, configuration) || this;
        }
        return ConfigMetadataFormatter;
    }(ConfigFormatter_1.ConfigFormatter));
    exports.ConfigMetadataFormatter = ConfigMetadataFormatter;
});
})();