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
sap.ui.define(["require", "exports", "../../core/LabelCalculator"], function (require, exports, LabelCalculator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createLabelCalculator = void 0;
    // sinaDefine(['../../core/core', '../../core/LabelCalculator'], function (core, LabelCalculator) {
    var splitId = function (id) {
        //CER002~EPM_PD_DEMO~
        if (id[6] !== "~") {
            return {
                system: "__DUMMY",
                client: "__DUMMY",
            };
        }
        return {
            system: id.slice(0, 3),
            client: id.slice(3, 6),
        };
    };
    function createLabelCalculator() {
        return new LabelCalculator_1.LabelCalculator({
            key: function (dataSource) {
                var splittedId = splitId(dataSource.id);
                return [dataSource.labelPlural, splittedId.system, splittedId.client];
            },
            data: function (dataSource) {
                return {
                    label: dataSource.label,
                    labelPlural: dataSource.labelPlural,
                };
            },
            setLabel: function (dataSource, labels, data) {
                labels[0] = data.label;
                dataSource.label = labels.join(" ");
                labels[0] = data.labelPlural;
                dataSource.labelPlural = labels.join(" ");
            },
            setFallbackLabel: function (dataSource, data) {
                dataSource.label = data.label + " duplicate " + dataSource.id;
                dataSource.labelPlural = dataSource.label;
            },
        });
    }
    exports.createLabelCalculator = createLabelCalculator;
});
})();