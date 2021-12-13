/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

/**
 * Common library for all cross-application features/controls.
 *
 * @namespace
 * @name sap.fe.common
 * @public
 * @since 1.83.0
 */

/**
 * Initialization Code and shared classes of library sap.fe.common
 */
sap.ui.define(
	[
		"sap/ui/core/Core", // implicit dependency, provides sap.ui.getCore()
		"sap/ui/core/library" // library dependency
	],
	function() {
		"use strict";

		// library dependencies
		sap.ui.getCore().initLibrary({
			name: "sap.fe.common",
			version: "1.96.0",
			dependencies: ["sap.ui.core"],
			types: [],
			interfaces: [],
			controls: [],
			elements: [],
			noLibraryCSS: true
		});

		return sap.fe.common;
	}
);
