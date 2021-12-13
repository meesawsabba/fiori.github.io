/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([], function () {
    "use strict";
    // =======================================================================
    // suggestion provider base class
    // =======================================================================
    var module = function () {
        this.init.apply(this, arguments);
    };
    module.prototype = {
        init: function (params) {
            jQuery.extend(this, params);
        },
        abortSuggestions: function () { },
        getSuggestions: function () { },
    };
    return module;
});
