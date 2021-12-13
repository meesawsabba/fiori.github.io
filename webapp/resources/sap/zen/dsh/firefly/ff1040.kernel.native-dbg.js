/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
[
"sap/zen/dsh/firefly/ff1030.kernel.impl"
],
function(oFF)
{
"use strict";

/**
* Module loader.
 */
oFF.NativeModuleLoader = function() {};
oFF.NativeModuleLoader.prototype = new oFF.XObject();
oFF.NativeModuleLoader.prototype._ff_c = "NativeModuleLoader";

/**
* Static setup.
 */
oFF.NativeModuleLoader.staticSetup = function()
{

	oFF.ModuleManager.registerModuleLoader(new oFF.NativeModuleLoader());
};

oFF.NativeModuleLoader.prototype.processModuleLoad = function( session, moduleDef, listener, cachebusterId )
{

	var messages = oFF.MessageManagerSimple.createMessageManager();
	
	var win = (typeof window !== "undefined") ? window : {};
	
	if (typeof(win.document) !== "undefined")
	{ 
		var doc = win.document;
	    var script = doc.createElement( "script" );
	    
	    script.type = "text/javascript";
	    script.async = true;
	    
	    script.onload = function()
	    {
	        // remote script has loaded
			listener.onModuleLoaded( messages, moduleDef.getName(), true );
		};
	
		var uri = moduleDef.getSourceLocationUri( session );
		var uriCopy = oFF.XUri.createFromOther( uri );
		
		if( cachebusterId !== null )
		{
			uriCopy.addQueryElement( "v", cachebusterId );
		}
		
		var url = uriCopy.getUrl();
		
	    script.src = url;
	    
		doc.getElementsByTagName( "head" )[0].appendChild( script );
	}
};

/// <summary>Initializer for static constants.</summary>
oFF.KernelNativeModule = function() 
{
       oFF.DfModule.call(this);
    this._ff_c = "KernelNativeModule";
};
oFF.KernelNativeModule.prototype = new oFF.DfModule();
oFF.KernelNativeModule.s_module = null;

oFF.KernelNativeModule.getInstance = function()
{
       var oNativeModule = oFF.KernelNativeModule;
    
    if (oNativeModule.s_module === null)
    {
        if ( oFF.KernelImplModule.getInstance() === null)
        {
            throw new Error("Initialization Exception");
        }

		oNativeModule.s_module = oFF.DfModule.startExt(new oFF.KernelNativeModule());

        oFF.NativeModuleLoader.staticSetup();
        
        oFF.DfModule.stopExt(oNativeModule.s_module);
    }

    return oNativeModule.s_module;
};

oFF.KernelNativeModule.prototype.getName = function()
{
	return "ff1040.kernel.native";
};

oFF.KernelNativeModule.getInstance();


return sap.firefly;
	} );