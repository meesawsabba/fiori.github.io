/*!
 * SAPUI5
 *
 * (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/i18n/ResourceBundle","sap/ui/core/Core","sap/ui/core/library"],function(R,c,l){"use strict";sap.ui.getCore().initLibrary({name:"sap.fiori",dependencies:["sap.ui.core"],types:[],interfaces:[],controls:[],elements:[],version:"1.96.0"});var C=sap.ui.getCore().getConfiguration(),L=C.getLanguage(),d=C.getLanguagesDeliveredWithCore(),a=R._getFallbackLocales(L,d);L=a[0];if(L&&!window["sap-ui-debug"]&&!sap.ui.loader.config().async){sap.ui.requireSync("sap/fiori/messagebundle-preload_"+L);}return sap.fiori;});
