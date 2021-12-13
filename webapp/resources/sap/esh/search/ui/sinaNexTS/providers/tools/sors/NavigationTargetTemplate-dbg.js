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
sap.ui.define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NavigationTargetTemplate = void 0;
    var NavigationTargetTemplate = /** @class */ (function () {
        function NavigationTargetTemplate(properties) {
            this.sina = properties.sina;
            this.navigationTargetGenerator = properties.navigationTargetGenerator;
            this.label = properties.label;
            this.sourceObjectType = properties.sourceObjectType;
            this.targetObjectType = properties.targetObjectType;
            this.conditions = properties.conditions;
        }
        NavigationTargetTemplate.prototype.generate = function (data) {
            var dataSource = this.sina.getDataSource(this.targetObjectType);
            var filter = this.sina.createFilter({
                dataSource: dataSource,
                searchTerm: "*", // asterisk
            });
            for (var i = 0; i < this.conditions.length; ++i) {
                var condition = this.conditions[i];
                var filterCondition = this.sina.createSimpleCondition({
                    attribute: condition.targetPropertyName,
                    attributeLabel: dataSource.getAttributeMetadata(condition.targetPropertyName).label,
                    operator: this.sina.ComparisonOperator.Eq,
                    value: data[condition.sourcePropertyName].value,
                    valueLabel: data[condition.sourcePropertyName].valueFormatted,
                });
                filter.autoInsertCondition(filterCondition);
            }
            return this.sina._createNavigationTarget({
                label: this.label,
                targetUrl: this.navigationTargetGenerator.urlPrefix +
                    encodeURIComponent(JSON.stringify(filter.toJson())),
            });
        };
        return NavigationTargetTemplate;
    }());
    exports.NavigationTargetTemplate = NavigationTargetTemplate;
});
})();