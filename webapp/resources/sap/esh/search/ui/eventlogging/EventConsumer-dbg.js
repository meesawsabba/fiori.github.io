/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
/* global */
// @ts-check
sap.ui.define([], function () {
    "use strict";
    // =======================================================================
    // EventConsumer (base class for all consumers)
    // =======================================================================
    var module = function () {
        this.init.apply(this, arguments);
    };
    module.prototype = {
        init: function () { },
        logEvent: function () {
            // to be implemented in subclass
        },
    };
    return module;
});
