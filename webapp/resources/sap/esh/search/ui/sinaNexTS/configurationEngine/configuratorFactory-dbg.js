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
sap.ui.define(["require", "exports", "./configurators/CustomFunctionConfigurator", "./configurators/ListConfigurator", "./configurators/ObjectConfigurator", "./configurators/TemplateConfigurator", "./configurators/TextResourceConfigurator", "./configurators/SimpleValueConfigurator"], function (require, exports, CustomFunctionConfigurator_1, ListConfigurator_1, ObjectConfigurator_1, TemplateConfigurator_1, TextResourceConfigurator_1, SimpleValueConfigurator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createConfiguratorAsync = void 0;
    var configuratorClasses = [
        CustomFunctionConfigurator_1.CustomFunctionConfigurator,
        ListConfigurator_1.ListConfigurator,
        ObjectConfigurator_1.ObjectConfigurator,
        TemplateConfigurator_1.TemplateConfigurator,
        TextResourceConfigurator_1.TextResourceConfigurator,
        SimpleValueConfigurator_1.SimpleValueConfigurator,
    ];
    function createConfiguratorAsync(options) {
        options.createConfiguratorAsync = createConfiguratorAsync;
        for (var i = 0; i < configuratorClasses.length; ++i) {
            var configuratorClass = configuratorClasses[i];
            if (configuratorClass.prototype.isSuitable(options)) {
                return _createAsync(configuratorClass, options);
            }
        }
    }
    exports.createConfiguratorAsync = createConfiguratorAsync;
    function _createAsync(configuratorClass, options) {
        var configurator = new configuratorClass(options); // eslint-disable-line new-cap
        return Promise.resolve()
            .then(function () {
            return configurator.initResourceBundleAsync();
        })
            .then(function () {
            return configurator.initAsync();
        })
            .then(function () {
            return configurator;
        });
    }
});
})();