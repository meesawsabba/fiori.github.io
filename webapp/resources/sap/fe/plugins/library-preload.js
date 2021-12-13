//@ui5-bundle sap/fe/plugins/library-preload.js
/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
sap.ui.predefine('sap/fe/plugins/library',["sap/ui/core/Core","sap/ui/core/library"],function(){"use strict";sap.ui.getCore().initLibrary({name:"sap.fe.plugins",dependencies:["sap.ui.core"],types:[],interfaces:[],controls:[],elements:[],version:"1.96.0",noLibraryCSS:true});return sap.fe.plugins;});
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
sap.ui.predefine('sap/fe/plugins/preload/FilePreload',["sap/base/util/LoaderExtensions","sap/base/Log"],function(L,a){"use strict";var S=1000;var C=5;var b=1000;var F={_isModuleLoaded:function(p){var s=p.split("/"),c=window,i=0;while(i<s.length&&c){c=c[s[i]];i++;}return c!==undefined;},_loadLibraries:function(l){return this._waitUntilHomeIsDisplayed().then(function(){return sap.ui.getCore().loadLibraries(l);}).catch(function(e){a.error("sap.fe.plugins.Preload: Error while preloading libraries - "+e.message);});},_loadModulesByChunks:function(m){var i;for(i=m.length-1;i>=0;i--){var M=m[i];if(this._isModuleLoaded(M)){m.splice(i,1);}}var t=m.length,c=Math.ceil(t/this.iChunkSize);if(c===0){return Promise.resolve();}else{var d=[],e=this;for(i=0;i<c;i++){d.push(m.slice(i*this.iChunkSize,i*this.iChunkSize+this.iChunkSize));}return new Promise(function(r,f){e._processChunk(d,0,r);});}},_processChunk:function(c,i,r){var t=this;if(i>=c.length){r();}else{var d=c[i];t._waitUntilHomeIsDisplayed().then(function(){sap.ui.require(d,function(e){a.debug("sap.fe.plugins.Preload: Chunk ["+i+"] loaded ("+JSON.stringify(d)+")");setTimeout(function(){t._processChunk(c,i+1,r);},t.iChunkInterval);},function(){a.error("sap.fe.plugins.Preload: failed to load library chunk: "+JSON.stringify(d));setTimeout(function(){t._processChunk(c,i+1,r);},t.iChunkInterval);});}).catch(function(){a.error("sap.fe.plugins.Preload: unknown error - Aborting");r();});}},_waitUntilHomeIsDisplayed:function(){var r;function o(){var A=sap.ushell.Container.getService("AppLifeCycle"),i=A.getCurrentApplication().homePage;if(i){A.detachAppLoaded(o);a.info("sap.fe.plugins.Preload: preload resumed");r();}}if(sap.ushell.Container.getService("AppLifeCycle").getCurrentApplication().homePage===false){a.info("sap.fe.plugins.Preload: preload paused");return new Promise(function(c,d){sap.ushell.Container.getService("AppLifeCycle").attachAppLoaded(o);r=c;});}else{return Promise.resolve();}},start:function(c){var s=c.startUpDelay||S,t=this;this.iChunkSize=c.chunkSize||C;this.iChunkInterval=c.chunkInterval||b;setTimeout(function(){a.info("sap.fe.plugins.Preload: preload starting");var p=L.loadResource("/sap/fe/plugins/preload/data/components.json"),l=L.loadResource("/sap/fe/plugins/preload/data/libraries.json");t._loadLibraries(l).then(function(){return t._loadModulesByChunks(p);}).then(function(){a.info("sap.fe.plugins.Preload: preload finished");}).catch(function(e){a.error("sap.fe.plugins.Preload: Error while preloading data - "+e.message);});},s);}};return F;});
sap.ui.require.preload({
	"sap/fe/plugins/manifest.json":'{"_version":"1.21.0","sap.app":{"id":"sap.fe.plugins","type":"library","embeds":[],"applicationVersion":{"version":"1.96.0"},"title":"UI5 library: sap.fe.plugins","description":"UI5 library: sap.fe.plugins","ach":"CA-UI5-FE","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":[]},"sap.ui5":{"dependencies":{"minUI5Version":"1.96","libs":{"sap.ui.core":{"minVersion":"1.96.0"}}},"library":{"i18n":false,"css":false,"content":{"controls":[],"elements":[],"types":[],"interfaces":[]}}}}'
},"sap/fe/plugins/library-preload"
);
//# sourceMappingURL=library-preload.js.map