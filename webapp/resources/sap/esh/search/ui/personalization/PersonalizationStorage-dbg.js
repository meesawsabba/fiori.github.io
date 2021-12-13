/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
/* global */
sap.ui.define([
    "sap/esh/search/ui/personalization/FLPPersonalizationStorage",
    "sap/esh/search/ui/personalization/BrowserPersonalizationStorage",
    "sap/esh/search/ui/personalization/MemoryPersonalizationStorage",
], function (FLPPersonalizationStorage, BrowserPersonalizationStorage, MemoryPersonalizationStorage) {
    "use strict";
    // =======================================================================
    // personalization storage
    // =======================================================================
    var PersonalizationStorage = {
        instance: null,
        create: function (personalizationStorage, isUshell) {
            switch (personalizationStorage) {
                case "auto":
                    if (isUshell) {
                        return FLPPersonalizationStorage.create();
                    }
                    else {
                        return BrowserPersonalizationStorage.create();
                    }
                case "browser":
                    return BrowserPersonalizationStorage.create();
                case "flp":
                    return FLPPersonalizationStorage.create();
                case "memory":
                    return MemoryPersonalizationStorage.create();
                default:
                    return Promise.reject(new Error("Unknown Personalization Storage: " + personalizationStorage));
            }
        },
    };
    return PersonalizationStorage;
});
