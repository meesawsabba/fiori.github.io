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
        urlTemplates: {
            DWC_ERMODEL: "#/databuilder&/db/{{space_name}}/{{name}}",
            DWC_VIEW: "#/databuilder&/db/{{space_name}}/{{name}}",
            DWC_LOCAL_TABLE: "#/databuilder&/db/{{space_name}}/{{name}}",
            DWC_REMOTE_TABLE: "#/databuilder&/db/{{space_name}}/{{name}}",
            DWC_DAC: "#/authorizations&/auth/{{space_name}}/{{name}}/edit/",
        },
        initAsync: function () { },
        extractAttributes: function (item) {
            var obj = {};
            var aAttributes = item.object.attributes;
            for (var i = 0; i < aAttributes.length; ++i) {
                var attribute = aAttributes[i];
                obj[attribute.id] = attribute.value;
            }
            return obj;
        },
        formatAsync: function (resultSet) {
            for (var i = 0; i < resultSet.items.length; ++i) {
                var item = resultSet.items[i];
                var attributes = this.extractAttributes(item);
                var urlTemplate = this.urlTemplates[attributes["technical_type"]];
                if (!urlTemplate) {
                    continue;
                }
                var url = util.evaluateTemplate(urlTemplate, attributes);
                // item.defaultNavigationTarget = resultSet.sina._createNavigationTarget({
                //     label: 'Hello World!',
                //     targetUrl: url
                // });
                item.object.defaultNavigationTarget = resultSet.sina._createNavigationTarget({
                    label: "Hello World!",
                    targetUrl: url,
                });
                // item.defaultNavigationTarget.parent = item;
                item.object.defaultNavigationTarget.parent = item;
            }
            return Promise.resolve(resultSet);
        },
    });
    return RepositoryExplorerFormatter;
});
