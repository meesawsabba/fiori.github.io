/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
/* global */
sap.ui.define(["sap/esh/search/ui/personalization/Personalizer", "sap/esh/search/ui/SearchHelper"], function (Personalizer, SearchHelper) {
    "use strict";
    // =======================================================================
    // flp personalization storage
    // =======================================================================
    var module = function () {
        this.init.apply(this, arguments);
    };
    var FLPPersonalizationStorage = module;
    module.prototype = {
        init: function (container) {
            this.container = container;
            this.saveNotDelayed = this.save;
            this.save = SearchHelper.delayedExecution(this.save, 2000);
        },
        save: function () {
            return this.container.save();
        },
        getItem: function (key) {
            key = this.limitLength(key);
            if (!this._isStorageSupported()) {
                throw "not supported storage";
            }
            return this.container.getItemValue(key);
        },
        setItem: function (key, data) {
            key = this.limitLength(key);
            if (!this._isStorageSupported()) {
                throw "not supported storage";
            }
            var oldData = this.getItem(key);
            if (JSON.stringify(oldData) === JSON.stringify(data)) {
                return;
            }
            this.container.setItemValue(key, data);
            this.save();
        },
        limitLength: function (key) {
            return key.slice(-40);
        },
        getPersonalizer: function (key) {
            return new Personalizer(key, this);
        },
        _isStorageSupported: function () {
            return true;
        },
    };
    module.create = function () {
        var servicePromise = sap.ushell.Container.getServiceAsync("Personalization")
            .then(function (service) {
            return service.getContainer("ushellSearchPersoServiceContainer");
        })
            .then(function (container) {
            return new FLPPersonalizationStorage(container);
        });
        return servicePromise;
    };
    return module;
});
