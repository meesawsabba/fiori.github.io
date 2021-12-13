/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
/* global */
sap.ui.define(["sap/esh/search/ui/personalization/Personalizer"], function (Personalizer) {
    "use strict";
    // =======================================================================
    // memory personalization storage
    // =======================================================================
    var module = function () {
        this.init.apply(this, arguments);
    };
    var MemoryPersonalizationStorage = module;
    module.prototype = {
        init: function () {
            this.dataMap = {};
        },
        saveNotDelayed: function () {
            return Promise.resolve();
        },
        save: function () { },
        getItem: function (key) {
            if (!this._isStorageSupported()) {
                throw "not supported storage";
            }
            return this._getStorage(key);
        },
        setItem: function (key, data) {
            if (!this._isStorageSupported()) {
                throw "not supported storage";
            }
            this._putStorage(key, data);
        },
        getPersonalizer: function (key) {
            return new Personalizer(key, this);
        },
        _isStorageSupported: function () {
            return true;
        },
        _getStorage: function (key) {
            return this.dataMap[key];
        },
        _putStorage: function (key, storage) {
            this.dataMap[key] = storage;
        },
    };
    module.create = function () {
        return Promise.resolve(new MemoryPersonalizationStorage());
    };
    return module;
});
