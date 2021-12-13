/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/test/JourneyRunner","sap/fe/test/Utils","./FEArrangements","sap/base/Log"],function(J,U,F){"use strict";var a=J.extend("sap.fe.test.internal.FEJourneyRunner",{getBaseArrangements:function(s){return new F(s);}});var D=new a({launchUrl:"test-resources/sap/fe/templates/internal/demokit/flpSandbox.html",launchParameters:{"sap-ui-xx-mdcTableP13n":true},opaConfig:{frameWidth:1300,frameHeight:1024}});var W=new a({launchUrl:"test-resources/sap/fe/templates/internal/demokit/flpSandbox.html",launchParameters:{"sap-ui-xx-mdcTableP13n":true},opaConfig:{frameWidth:1700,frameHeight:1024}});var b=new a({launchUrl:"test-resources/sap/fe/templates/internal/demokit/flpSandbox.html",launchParameters:{"sap-ui-xx-mdcTableP13n":true},opaConfig:{frameWidth:1900,frameHeight:1440}});a.run=D.run.bind(D);a.runWide=W.run.bind(W);a.runFCL=b.run.bind(b);return a;});
