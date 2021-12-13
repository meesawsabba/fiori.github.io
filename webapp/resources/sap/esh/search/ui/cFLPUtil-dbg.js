/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([], function () {
    "use strict";
    return {
        readCFlpConfiguration: function (sinaConfigurations) {
            if (!sap || !sap.cf) {
                return Promise.resolve(sinaConfigurations); // -> not active -> do nothing
            }
            // read content providers from cflp configuration
            return sap.ushell.Container.getServiceAsync("CommonDataModel")
                .then(function (service) {
                return service.getApplications();
            })
                .then(function (oApplications) {
                // extract content provider ids
                var oContentProviders = Object.keys(oApplications).reduce(function (o, sApplicationKey) {
                    var oApplication = oApplications[sApplicationKey];
                    var sContentProviderId = oApplication["sap.app"] && oApplication["sap.app"].contentProviderId;
                    if (sContentProviderId) {
                        o[sContentProviderId] = true;
                    }
                    return o;
                }, {});
                var contentProviderIds = Object.keys(oContentProviders);
                return contentProviderIds;
            }.bind(this))
                .then(function (contentProviderIds) {
                // create sina provider configuration
                var promises = [];
                for (var i = 0; i < contentProviderIds.length; ++i) {
                    var contentProviderId = contentProviderIds[i];
                    promises.push(this.createContentProviderSinaConfiguration(contentProviderId));
                }
                return Promise.all(promises);
            }.bind(this))
                .then(function (subSinaProviderConfigurations) {
                if (!subSinaProviderConfigurations || subSinaProviderConfigurations.length === 0) {
                    // fallback if configuration is empty
                    return sinaConfigurations;
                }
                else {
                    // assemble multi provider configuration
                    subSinaProviderConfigurations = subSinaProviderConfigurations.filter(function (elem) {
                        if (typeof elem !== "undefined") {
                            return elem;
                        }
                    });
                    return [
                        {
                            provider: "multi",
                            subProviders: subSinaProviderConfigurations,
                            federationType: "advanced_round_robin",
                        },
                        "dummy",
                    ];
                }
            }.bind(this));
        },
        createContentProviderSinaConfiguration: function (contentProviderId) {
            return sap.ushell.Container.getServiceAsync("ClientSideTargetResolution")
                .then(function (service) {
                return service.getSystemContext(contentProviderId);
            })
                .then(function (oSystemContext) {
                var sinaProviderType = oSystemContext.getProperty("esearch.provider");
                var sRequestUrlForAppRouter = oSystemContext.getFullyQualifiedXhrUrl("sap/opu/odata/sap/ESH_SEARCH_SRV");
                if (!sinaProviderType) {
                    // destination of this content provider has no launchpad.esearch.provider property
                    // -> not relevant for search
                    return;
                }
                return {
                    contentProviderId: contentProviderId,
                    provider: sinaProviderType.toLowerCase(),
                    label: contentProviderId,
                    url: sRequestUrlForAppRouter,
                };
            }.bind(this));
        },
    };
});
