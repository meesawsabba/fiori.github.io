/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/test/JourneyRunner", "sap/fe/test/Utils", "./FEArrangements", "sap/base/Log"], function(
	JourneyRunner,
	Utils,
	FEArrangements
) {
	"use strict";

	var FERunner = JourneyRunner.extend("sap.fe.test.internal.FEJourneyRunner", {
		getBaseArrangements: function(mSettings) {
			return new FEArrangements(mSettings);
		}
	});

	var DEFAULT_RUNNER = new FERunner({
		launchUrl: "test-resources/sap/fe/templates/internal/demokit/flpSandbox.html",
		launchParameters: {
			"sap-ui-xx-mdcTableP13n": true
		},
		opaConfig: {
			frameWidth: 1300,
			frameHeight: 1024
		}
	});
	var WIDE_RUNNER = new FERunner({
		launchUrl: "test-resources/sap/fe/templates/internal/demokit/flpSandbox.html",
		launchParameters: {
			"sap-ui-xx-mdcTableP13n": true
		},
		opaConfig: {
			frameWidth: 1700,
			frameHeight: 1024
		}
	});
	var FCL_RUNNER = new FERunner({
		launchUrl: "test-resources/sap/fe/templates/internal/demokit/flpSandbox.html",
		launchParameters: {
			"sap-ui-xx-mdcTableP13n": true
		},
		opaConfig: {
			frameWidth: 1900,
			frameHeight: 1440
		}
	});

	FERunner.run = DEFAULT_RUNNER.run.bind(DEFAULT_RUNNER);
	FERunner.runWide = WIDE_RUNNER.run.bind(WIDE_RUNNER);
	FERunner.runFCL = FCL_RUNNER.run.bind(FCL_RUNNER);

	return FERunner;
});
