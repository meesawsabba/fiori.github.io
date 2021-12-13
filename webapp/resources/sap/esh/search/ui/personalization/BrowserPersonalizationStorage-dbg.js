/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
/* global */
sap.ui.define(["sap/esh/search/ui/personalization/Personalizer", "sap/ui/util/Storage"], function (Personalizer, Storage) {
    "use strict";
    // =======================================================================
    // browser personalization storage
    // =======================================================================
    var module = function () {
        this.init.apply(this, arguments);
    };
    var BrowserPersonalizationStorage = module;
    module.prototype = {
        init: function () { },
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
            if (Storage.isSupported()) {
                return true;
            }
            return false;
        },
        _getStorage: function (key) {
            return jQuery.sap.storage.get("Search.Personalization." + key);
        },
        _putStorage: function (key, storage) {
            if (typeof jQuery.sap.storage.setType === "function") {
                // type session not working in standalone UI
                jQuery.sap.storage.setType(jQuery.sap.storage.Type.local);
            }
            jQuery.sap.storage.put("Search.Personalization." + key, storage);
        },
    };
    module.create = function () {
        return Promise.resolve(new BrowserPersonalizationStorage());
    };
    return module;
});
