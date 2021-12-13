window.onload = function () {
    sap.ui.loader.config({
        baseUrl: "../../../../../../resources/",
        paths: {
            "sap/esh/search/ui": "/resources/sap/esh/search/ui",
        },
    });
    sap.ui.require(["sap/esh/search/ui/SearchCompositeControl"], function (SearchCompositeControl) {
        var customConfig = sap.esh.search.ui.config || {};
        var defaults = {
            searchOnStart: true,
            searchTerm: customConfig.FF_bSearchtermNoAsterisk ? "" : "*",
            sinaConfiguration: {
                provider: "sample",
            },
        };
        var options = Object.assign(customConfig, defaults);
        var control = new SearchCompositeControl(options);
        window.addEventListener("hashchange", function () {
            control.getModel().parseURL();
        }, false);
        control.placeAt("content");
    });
    jQuery("html").css("overflow-y", "auto");
    jQuery("html").css("height", "100%");
};
