/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../sinaNexTS/sina/formatters/Formatter"], function (Formatter) {
    "use strict";
    var notSortableAttributes = {
        business_purpose_purpose: true,
        business_purpose_description: true,
        remote_connection: true,
        connection_name: true,
        remote_connection_type_description: true,
        description: true,
        exposed_for_consumption: true,
        kind: true,
        is_shared: true,
        label: true,
        model_name: true,
        remote_connection_type: true,
        remote_entity: true,
        space_name: true,
        business_purpose_tags: true,
        visible_in_space_name: true,
    };
    var MetadataFormatter = function () {
        this.init.apply(this, arguments);
    };
    MetadataFormatter.prototype = Object.assign(Object.create(Formatter.Formatter.prototype), {
        init: function (configuration) {
            this.configuration = configuration;
        },
        initAsync: function () { },
        formatAsync: function (metadata) {
            var sina = metadata.dataSources[0].sina;
            var dataSource = sina.getDataSource("SEARCH_DESIGN");
            // overwrite labels (see dwc components/repositoryexplorer/i18n/i18n.properties)
            // - label of connector, from i18n properties (see suggest popover)
            if (this.configuration.dwcResourceBundle &&
                this.configuration.dwcResourceBundle.hasText("search_design") &&
                this.configuration.dwcResourceBundle.hasText("search_design_plural")) {
                dataSource.label = this.configuration.dwcResourceBundle.getText("search_design");
                dataSource.labelPlural = this.configuration.dwcResourceBundle.getText("search_design_plural");
            }
            // - labels of attributes, from i18n properties
            for (var i = 0; i < dataSource.attributesMetadata.length; ++i) {
                var attribute = dataSource.attributesMetadata[i];
                var textId = "search_design_" + attribute.id.toLowerCase();
                if (this.configuration.dwcResourceBundle &&
                    this.configuration.dwcResourceBundle.hasText(textId)) {
                    attribute.label = this.configuration.dwcResourceBundle.getText(textId);
                }
                // remove technical attributes from sort dialog
                // technical attributes = attributes without nice label
                // nice labels have at least a single uppercase character
                if (attribute.label.toLowerCase() === attribute.label) {
                    attribute.isSortable = false;
                }
                // explicit exclusion list for not sortable attributes
                if (notSortableAttributes[attribute.id]) {
                    attribute.isSortable = false;
                }
            }
            return Promise.resolve(metadata);
        },
    });
    return MetadataFormatter;
});
