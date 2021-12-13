/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
/* global */
sap.ui.define([], function () {
    "use strict";
    // =======================================================================
    // personalizer
    // =======================================================================
    var Personalizer = function () {
        this.init.apply(this, arguments);
    };
    Personalizer.prototype = {
        init: function (key, personalizationStorageInstance) {
            this.key = key;
            this.personalizationStorageInstance = personalizationStorageInstance;
        },
        getKey: function () {
            return this.key;
        },
        setPersData: function (data) {
            // sap.m.TablePersoController uses deferred.done()
            // NOT to convert to promise
            return new jQuery.Deferred().resolve(this.personalizationStorageInstance.setItem(this.key, data));
        },
        getPersData: function () {
            // sap.m.TablePersoController uses deferred.done()
            // NOT to convert to promise
            return new jQuery.Deferred().resolve(this.personalizationStorageInstance.getItem(this.key));
        },
    };
    return Personalizer;
});
