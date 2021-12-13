/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

/**
 * @namespace reserved for Fiori Elements
 * @name sap.fe.semantics
 * @private
 */

/**
 * Initialization Code and shared classes of library sap.fe.templates
 */
sap.ui.define(
	[
		"sap/ui/core/Core", // implicit dependency, provides sap.ui.getCore(),
		"sap/ui/core/library" // library dependency
	],
	function() {
		"use strict";

		/**
		 * Fiori Elements Semantics Library
		 *
		 * @namespace
		 * @name sap.fe.semantics
		 * @private
		 */

		// library dependencies
		// delegate further initialization of this library to the Core
		sap.ui.getCore().initLibrary({
			name: "sap.fe.semantics",
			dependencies: ["sap.ui.core"],
			types: [],
			interfaces: [],
			controls: [],
			elements: [],
			version: "1.96.0",
			noLibraryCSS: true
		});

		return sap.fe.semantics;
	}
);
