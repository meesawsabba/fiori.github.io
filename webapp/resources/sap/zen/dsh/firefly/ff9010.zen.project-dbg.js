/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
[
"sap/zen/dsh/firefly/ff8320.zen.landscape.utils"
],
function(oFF, sap_zen)
{
"use strict";

sap.zen.InternalLandscapeUtils = function() {};
sap.zen.InternalLandscapeUtils.prototype = new oFF.XObject();
sap.zen.InternalLandscapeUtils.prototype._ff_c = "InternalLandscapeUtils";

sap.zen.InternalLandscapeUtils.registerComponentFactory = function(component, oPageFactory)
{
	sap.zen.ZenTemplateService.soFactory.registerFactory(component, oPageFactory);
};
sap.zen.InternalLandscapeUtils.prototype.moLandscape = null;
sap.zen.InternalLandscapeUtils.prototype.moSystemForWebDispatching = null;
sap.zen.InternalLandscapeUtils.prototype.oApplication = null;
sap.zen.InternalLandscapeUtils.prototype.mLanguage = null;
sap.zen.InternalLandscapeUtils.prototype.mInitialized = false;
sap.zen.InternalLandscapeUtils.prototype.mInitialized2 = false;
sap.zen.InternalLandscapeUtils.prototype.doInitOrg = function(language)
{
	if (this.mInitialized)
	{
		return;
	}
	this.mInitialized = true;
	oFF.RegistrationService.getInstance();
	oFF.IpProviderModule.getInstance();
	sap.zen.BuddhaModule.getInstance();
	this.oApplication = oFF.ApplicationFactory.createDefaultApplicationWithVersion(oFF.XVersion.DEFAULT_VALUE);
	this.moLandscape = oFF.StandaloneSystemLandscape.create(this.getApplication());
	this.mLanguage = language;
	this.getApplication().setSystemLandscape(this.moLandscape);
};
sap.zen.InternalLandscapeUtils.prototype.addSelf = function(host, port, protocol)
{
	var loSystem = this.moLandscape.createSystem();
	loSystem.setLanguage(this.mLanguage);
	loSystem.setSystemType(oFF.SystemType.HANA);
	loSystem.setName("self");
	loSystem.setText("self");
	loSystem.setHost(host);
	loSystem.setPort(port);
	loSystem.setAuthenticationType(oFF.AuthenticationType.BASIC);
	loSystem.setProtocolType(oFF.XString.isEqual("https", protocol) ? oFF.ProtocolType.HTTPS : oFF.ProtocolType.HTTP);
	this.moLandscape.setSystemByDescription(loSystem);
	return loSystem;
};
sap.zen.InternalLandscapeUtils.prototype.addSelfBW = function(host, port, protocol, client, systemAlias, newBW)
{
	var loSystem = this.moLandscape.createSystem();
	loSystem.setLanguage(this.mLanguage);
	loSystem.setSystemType(newBW ? oFF.SystemType.BW : oFF.SystemType.ABAP);
	loSystem.setName("self");
	loSystem.setText("self");
	loSystem.setHost(host);
	loSystem.setPort(port);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(client))
	{
		loSystem.setClient(client);
	}
	loSystem.setTimeout(60000);
	loSystem.setAuthenticationType(oFF.AuthenticationType.BASIC);
	loSystem.setProtocolType(oFF.XString.isEqual("https", protocol) ? oFF.ProtocolType.HTTPS : oFF.ProtocolType.HTTP);
	loSystem.setProperty("systemAlias", systemAlias);
	this.moLandscape.setSystemByDescription(loSystem);
	return loSystem;
};
sap.zen.InternalLandscapeUtils.prototype.getApplication = function()
{
	return this.oApplication;
};
sap.zen.InternalLandscapeUtils.prototype.getSelf = function()
{
	return this.moLandscape.getSystemDescription("self");
};
sap.zen.InternalLandscapeUtils.prototype.getSystem = function(name)
{
	return this.moLandscape.getSystemDescription(name);
};
sap.zen.InternalLandscapeUtils.prototype.getSystemForWebDispatching = function()
{
	return this.moSystemForWebDispatching;
};
sap.zen.InternalLandscapeUtils.prototype.doInit = function(language)
{
	this.doInitOrg(language);
	if (this.mInitialized2)
	{
		return;
	}
	this.mInitialized2 = true;
};

return sap.firefly;
	} );