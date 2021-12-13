/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
/**
 * Initialization Code and shared classes of library sap.esh.search.ui.
 */
sap.ui.define([
    "sap/ui/core/library",
    "sap/m/library",
    "sap/f/library",
    "sap/ui/layout/library",
    "sap/ui/export/library",
    "sap/ui/vbm/library",
    "sap/ui/vk/library",
    "sap/suite/ui/microchart/library",
], function () {
    "use strict";
    /**
     * UI5 library: sap.esh.search.ui.
     *
     * @namespace
     * @name sap.esh.search.ui
     * @public
     */
    // delegate further initialization of this library to the Core
    sap.ui.getCore().initLibrary({
        name: "sap.esh.search.ui",
        dependencies: [
            "sap.ui.core",
            "sap.m",
            "sap.f",
            "sap.ui.layout",
            "sap.ui.export",
            "sap.ui.vbm",
            "sap.ui.vk",
            "sap.suite.ui.microchart",
        ],
        types: [
        //"sap.esh.search.ui.ExampleType"
        ],
        interfaces: [],
        controls: [
        //"sap.esh.search.ui.Example"
        ],
        elements: [],
        noLibraryCSS: false,
        version: "1.96.0",
    });
    // /**
    //  * Example type.
    //  *
    //  * @enum {string}
    //  * @public
    //  */
    // sap.esh.search.ui.ExampleType = {
    // 	/**
    // 	 * A value.
    // 	 * @public
    // 	 */
    // 	Value1 : "Value1",
    // 	/**
    // 	 * Another value.
    // 	 * @public
    // 	 */
    // 	Value2 : "Value2"
    // };
    return sap.esh.search.ui;
});
