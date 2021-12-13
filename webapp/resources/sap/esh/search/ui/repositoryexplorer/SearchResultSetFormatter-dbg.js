/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
if (!window.define) {
    window.define = sap.ui.define;
    window.define.amd = true;
}
if (!window.require) {
    window.require = sap.ui.require;
}
sap.ui.define(["../sinaNexTS/core/core", "../sinaNexTS/sina/formatters/Formatter", "../sinaNexTS/core/util"], function (core, Formatter, util) {
    "use strict";
    var RepositoryExplorerFormatter = function () { };
    RepositoryExplorerFormatter.prototype = core.extend(new Formatter.Formatter(), {
        // key1: technicalType, optional key2: businessType
        urlTemplates: {
            DWC_ERMODEL: "#/databuilder&/db/{{space_name}}/{{name}}",
            DWC_VIEW: {
                DWC_CUBE: "#/businessbuilder&/bb/{{space_name}}/{{name}}",
                "*": "#/databuilder&/db/{{space_name}}/{{name}}",
            },
            DWC_LOCAL_TABLE: "#/databuilder&/db/{{space_name}}/{{name}}",
            DWC_REMOTE_TABLE: "#/databuilder&/db/{{space_name}}/{{name}}",
            DWC_DATAFLOW: "#/databuilder&/db/{{space_name}}/{{name}}",
            DWC_IDT: "#/databuilder&/db/{{space_name}}/{{name}}",
            DWC_DAC: "#/authorizations&/auth/{{space_name}}/{{name}}/edit/",
        },
        initAsync: function () { },
        extractAttributes: function (item) {
            var obj = {};
            for (var i = 0; i < item.attributes.length; ++i) {
                var attribute = item.attributes[i];
                obj[attribute.id] = attribute.value;
            }
            return obj;
        },
        getTemplate: function (technicalType, businessType) {
            var template = this.urlTemplates[technicalType];
            if (typeof template === "string") {
                return template;
            }
            if (typeof template === "object") {
                var tmpTemplates = template;
                template = tmpTemplates[businessType];
                if (template) {
                    return template;
                }
                template = tmpTemplates["*"];
                if (template) {
                    return template;
                }
                return null;
            }
            return null;
        },
        formatAsync: function (resultSet) {
            for (var i = 0; i < resultSet.items.length; ++i) {
                var item = resultSet.items[i];
                // add all attributes, which not in detail attributes
                this.insertAdditionalAttribute(item);
                this.insertTitleShareIcon(item);
                var attributes = this.extractAttributes(item);
                var urlTemplate = this.getTemplate(attributes["technical_type"], attributes["business_type"]);
                if (!urlTemplate) {
                    continue;
                }
                var url = util.evaluateTemplate(urlTemplate, attributes);
                item.defaultNavigationTarget = resultSet.sina._createNavigationTarget({
                    targetUrl: url,
                });
                item.defaultNavigationTarget.parent = item;
            }
            return Promise.resolve(resultSet);
        },
        findAttribute: function (item, attributeId) {
            var attribute = null;
            for (var i = 0; i < item.attributes.length; i++) {
                if (attributeId === item.attributes[i].id) {
                    attribute = item.attributes[i];
                    break;
                }
            }
            return attribute;
        },
        insertAdditionalAttribute: function (item) {
            var idAttribute = this.findAttribute(item, "id");
            var favoriteUserId = this.findAttribute(item, "favorites_user_id");
            var businessName = this.findAttribute(item, "business_name");
            var businessType = this.findAttribute(item, "business_type");
            var businessPurposeDescription = this.findAttribute(item, "business_purpose_description");
            var technicalName = this.findAttribute(item, "name");
            var technicalType = this.findAttribute(item, "technical_type");
            var technicalTypeDescription = this.findAttribute(item, "technical_type_description");
            var spaceName = this.findAttribute(item, "space_name");
            var spaceId = this.findAttribute(item, "space_id");
            var spaceType = this.findAttribute(item, "space_type");
            item.additionalAttributes = {
                idAttribute: idAttribute,
                favoriteUserId: favoriteUserId,
                businessName: businessName,
                businessType: businessType,
                businessPurposeDescription: businessPurposeDescription,
                technicalName: technicalName,
                technicalType: technicalType,
                technicalTypeDescription: technicalTypeDescription,
                spaceName: spaceName,
                spaceId: spaceId,
                spaceType: spaceType,
            };
        },
        insertTitleShareIcon: function (item) {
            var isShared = this.findAttribute(item, "is_shared");
            if (isShared) {
                isShared.infoIconUrl = "";
                if (isShared.value === "Shared") {
                    isShared.infoIconUrl = "sap-icon://share-2";
                }
                item.titleAttributes.push(isShared);
            }
        },
    });
    return RepositoryExplorerFormatter;
});
