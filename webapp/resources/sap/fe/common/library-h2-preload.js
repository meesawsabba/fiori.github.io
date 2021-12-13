//@ui5-bundle sap/fe/common/library-h2-preload.js
/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.predefine('sap/fe/common/library',["sap/ui/core/Core","sap/ui/core/library"],function(){"use strict";sap.ui.getCore().initLibrary({name:"sap.fe.common",version:"1.96.0",dependencies:["sap.ui.core"],types:[],interfaces:[],controls:[],elements:[],noLibraryCSS:true});return sap.fe.common;});
sap.ui.require.preload({
	"sap/fe/common/manifest.json":'{"_version":"1.21.0","sap.app":{"id":"sap.fe.common","type":"library","embeds":[],"applicationVersion":{"version":"1.96.0"},"title":"UI5 library: sap.fe.common","description":"UI5 library: sap.fe.common","ach":"CA-UI5-FE","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":[]},"sap.ui5":{"dependencies":{"minUI5Version":"1.96","libs":{"sap.ui.core":{"minVersion":"1.96.0"}}},"library":{"i18n":false,"css":false,"content":{"controls":[],"elements":[],"types":[],"interfaces":[]}}}}'
},"sap/fe/common/library-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/fe/common/MessageButton.js":["sap/base/Log.js","sap/fe/common/MessagePopover.js","sap/fe/core/CommonUtils.js","sap/m/Button.js","sap/m/Dialog.js","sap/m/library.js","sap/ui/core/MessageType.js","sap/ui/model/Filter.js","sap/ui/model/FilterOperator.js","sap/ui/model/Sorter.js","sap/uxap/ObjectPageLayout.js"],
"sap/fe/common/MessageFilter.js":["sap/ui/core/Element.js"],
"sap/fe/common/MessagePopover.js":["sap/fe/core/CommonUtils.js","sap/m/MessageItem.js","sap/m/MessagePopover.js"],
"sap/fe/common/library.js":["sap/ui/core/Core.js","sap/ui/core/library.js"]
}});
//# sourceMappingURL=library-h2-preload.js.map