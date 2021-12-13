/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
[
"sap/zen/dsh/firefly/ff0230.io.ext"
],
function(oFF)
{
"use strict";

oFF.ConnectionParameters = {

	ALIAS:"ALIAS",
	AUTHENTICATION_TYPE:"AUTHENTICATION_TYPE",
	AUTHENTICATION_TYPE__BASIC:"BASIC",
	AUTHENTICATION_TYPE__NONE:"NONE",
	AUTHENTICATION_TYPE__BEARER:"BEARER",
	AUTHENTICATION_TYPE__SAML_WITH_PASSWORD:"SAML_WITH_PASSWORD",
	CONTENT_TYPE:"CONTENT_TYPE",
	PROTOCOL:"PROTOCOL",
	PROTOCOL_HTTP:"HTTP",
	PROTOCOL_HTTPS:"HTTPS",
	PROTOCOL_FILE:"FILE",
	APP_PROTOCOL_CIP:"CIP",
	APP_PROTOCOL_INA:"INA",
	APP_PROTOCOL_RSR:"RSR",
	APP_PROTOCOL_INA2:"INA2",
	APP_PROTOCOL_SQL:"SQL",
	HOST:"HOST",
	SECURE:"SECURE",
	URL:"URL",
	PASSWORD:"PASSWORD",
	TOKEN_VALUE:"TOKEN_VALUE",
	PORT:"PORT",
	PATH:"PATH",
	CLIENT:"CLIENT",
	WEBDISPATCHER_URI:"WEBDISPATCHER_URI",
	PREFLIGHT:"PREFLIGHT",
	PREFIX:"PREFIX",
	PROXY_HOST:"PROXY_HOST",
	PROXY_PORT:"PROXY_PORT",
	PROXY_TYPE:"PROXY_TYPE",
	PROXY_AUTHORIZATION:"PROXY_AUTHORIZATION",
	USER:"USER",
	SYSTEM_TYPE:"SYSTEM_TYPE",
	SYSTYPE:"SYSTYPE",
	ORIGIN:"ORIGIN",
	NAME:"NAME",
	DESCRIPTION:"DESCRIPTION",
	TIMEOUT:"TIMEOUT",
	IS_CSRF_REQUIRED:"IS_CSRF_REQUIRED",
	IS_CONTEXT_ID_REQUIRED:"IS_CONTEXT_ID_REQUIRED",
	KEEP_ALIVE_INTERVAL:"KEEP_ALIVE_INTERVAL",
	KEEP_ALIVE_DELAY:"KEEP_ALIVE_DELAY",
	LANGUAGE:"LANGUAGE",
	EQS_PATTERNS:"EQS_PATTERNS",
	TAGS:"TAGS",
	SESSION_CARRIER_TYPE:"SESSION_CARRIER_TYPE",
	CORRELATION_ID_ACTIVE:"CORRELATION_ID_ACTIVE",
	ENABLE_TESTS:"ENABLE_TESTS",
	ENFORCE_TESTS:"ENFORCE_TESTS",
	X509CERTIFICATE:"X509CERTIFICATE",
	SECURE_LOGIN_PROFILE:"SECURE_LOGIN_PROFILE",
	SQL_DRIVER_JAVA:"SQL_DRIVER_JAVA",
	SQL_CONNECT_JAVA:"SQL_CONNECT_JAVA",
	MAPPING_SYSTEM_NAME:"MAPPING_SYSTEM_NAME",
	MAPPINGS:"MAPPINGS",
	CONTEXTS:"CONTEXTS",
	DEFINITION:"definition",
	SCC_VIRTUAL_HOST:"sccVirtualHost",
	SCC_PORT:"sccPort",
	MAPPING_SERIALIZATION_TABLE:"MAPPING_SERIALIZE_TABLE",
	MAPPING_SERIALIZATION_SCHEMA:"MAPPING_SERIALIZE_SCHEMA",
	MAPPING_DESERIALIZATION_TABLE:"MAPPING_DESERIALIZE_TABLE",
	MAPPING_DESERIALIZATION_SCHEMA:"MAPPING_DESERIALIZE_SCHEMA",
	ORGANIZATION_TOKEN:"ORGANIZATION",
	ELEMENT_TOKEN:"ELEMENT",
	USER_TOKEN:"USER_TOKEN",
	TENANT_ID:"TENANT_ID",
	TENANT_ROOT_PACKAGE:"TENANT_ROOT_PACKAGE",
	INTERNAL_USER:"INTERNAL_USER",
	ASSOCIATED_HANA_SYSTEM:"ASSOCIATED_HANA_SYSTEM",
	CACHE_HINTS_ENABLED:"CACHE_HINTS_ENABLED",
	OEM_APPLICATION_ID:"OEM_APPLICATION_ID"
};

oFF.ServerService = {

	ANALYTIC:"Analytics",
	BWMASTERDATA:"BWMasterData",
	MASTERDATA:"Masterdata",
	MODEL_PERSISTENCY:"ModelPersistence",
	PLANNING:"Planning",
	VALUE_HELP:"ValueHelp",
	WORKSPACE:"Workspace",
	HIERARCHY_MEMBER:"HierarchyMember",
	CATALOG:"Catalog",
	INA:"InA",
	LIST_REPORTING:"ListReporting",
	DIMENSION_EXTENSION:"ffs4DimensionExtension"
};

oFF.ProcessEntity = {

	OLAP_ENVIRONMENT:"olap.OlapEnvironment",
	APPLICATION:"rt.Application",
	CONNECTION_POOL:"rt.ConnectionPool",
	USER_MANAGER:"rt.UserManager",
	GUI:"rt.Gui",
	SYSTEM_LANDSCAPE:"rt.SystemLandscape",
	SUB_SYSTEM:"rt.SubSystem",
	CACHE_PROVIDER:"rt.CacheProvider"
};

oFF.ServiceApiLevel = function() {};
oFF.ServiceApiLevel.prototype = new oFF.XConstant();
oFF.ServiceApiLevel.prototype._ff_c = "ServiceApiLevel";

oFF.ServiceApiLevel.BOOTSTRAP = null;
oFF.ServiceApiLevel.READ_ONLY = null;
oFF.ServiceApiLevel.PERSONALIZATION = null;
oFF.ServiceApiLevel.staticSetup = function()
{
	oFF.ServiceApiLevel.BOOTSTRAP = oFF.ServiceApiLevel.create("Bootstrap", 0);
	oFF.ServiceApiLevel.READ_ONLY = oFF.ServiceApiLevel.create("UserProfile", 1);
	oFF.ServiceApiLevel.PERSONALIZATION = oFF.ServiceApiLevel.create("BootstrapLandscape", 2);
};
oFF.ServiceApiLevel.create = function(name, level)
{
	var type = new oFF.ServiceApiLevel();
	type._setupInternal(name);
	type.m_level = level;
	return type;
};
oFF.ServiceApiLevel.prototype.m_level = 0;
oFF.ServiceApiLevel.prototype.getLevel = function()
{
	return this.m_level;
};

oFF.ResourceEntityType = function() {};
oFF.ResourceEntityType.prototype = new oFF.XConstant();
oFF.ResourceEntityType.prototype._ff_c = "ResourceEntityType";

oFF.ResourceEntityType.JAVASCRIPT = null;
oFF.ResourceEntityType.CSS = null;
oFF.ResourceEntityType.MODULE = null;
oFF.ResourceEntityType.staticSetup = function()
{
	oFF.ResourceEntityType.JAVASCRIPT = oFF.XConstant.setupName(new oFF.ResourceEntityType(), "Javascript");
	oFF.ResourceEntityType.CSS = oFF.XConstant.setupName(new oFF.ResourceEntityType(), "Css");
	oFF.ResourceEntityType.MODULE = oFF.XConstant.setupName(new oFF.ResourceEntityType(), "Module");
};

oFF.SystemRole = function() {};
oFF.SystemRole.prototype = new oFF.XConstant();
oFF.SystemRole.prototype._ff_c = "SystemRole";

oFF.SystemRole.MASTER = null;
oFF.SystemRole.DATA_PROVIDER = null;
oFF.SystemRole.REPOSITORY = null;
oFF.SystemRole.USER_MANAGEMENT = null;
oFF.SystemRole.SYSTEM_LANDSCAPE = null;
oFF.SystemRole.PRIMARY_BLENDING_HOST = null;
oFF.SystemRole.s_roles = null;
oFF.SystemRole.s_lookup = null;
oFF.SystemRole.staticSetup = function()
{
	oFF.SystemRole.s_roles = oFF.XList.create();
	oFF.SystemRole.s_lookup = oFF.XHashMapByString.create();
	oFF.SystemRole.MASTER = oFF.SystemRole.create("Master");
	oFF.SystemRole.DATA_PROVIDER = oFF.SystemRole.create("DataProvider");
	oFF.SystemRole.REPOSITORY = oFF.SystemRole.create("Repository");
	oFF.SystemRole.USER_MANAGEMENT = oFF.SystemRole.create("UserManagement");
	oFF.SystemRole.SYSTEM_LANDSCAPE = oFF.SystemRole.create("SystemLandscape");
	oFF.SystemRole.PRIMARY_BLENDING_HOST = oFF.SystemRole.create("PrimaryBlendingHost");
};
oFF.SystemRole.create = function(name)
{
	var newConstant = new oFF.SystemRole();
	newConstant._setupInternal(name);
	oFF.SystemRole.s_roles.add(newConstant);
	oFF.SystemRole.s_lookup.put(name, newConstant);
	return newConstant;
};
oFF.SystemRole.getAllRoles = function()
{
	return oFF.SystemRole.s_roles;
};
oFF.SystemRole.lookup = function(name)
{
	return oFF.SystemRole.s_lookup.getByKey(name);
};

oFF.ProgramDevice = function() {};
oFF.ProgramDevice.prototype = new oFF.XConstant();
oFF.ProgramDevice.prototype._ff_c = "ProgramDevice";

oFF.ProgramDevice.NONE = null;
oFF.ProgramDevice.CONSOLE = null;
oFF.ProgramDevice.WINDOW = null;
oFF.ProgramDevice.DIALOG = null;
oFF.ProgramDevice.EMBEDDED = null;
oFF.ProgramDevice.s_lookup = null;
oFF.ProgramDevice.staticSetup = function()
{
	oFF.ProgramDevice.s_lookup = oFF.XHashMapByString.create();
	oFF.ProgramDevice.NONE = oFF.ProgramDevice.create("None", false);
	oFF.ProgramDevice.CONSOLE = oFF.ProgramDevice.create("Console", false);
	oFF.ProgramDevice.WINDOW = oFF.ProgramDevice.create("Window", true);
	oFF.ProgramDevice.DIALOG = oFF.ProgramDevice.create("Dialog", true);
	oFF.ProgramDevice.EMBEDDED = oFF.ProgramDevice.create("Embedded", true);
};
oFF.ProgramDevice.create = function(name, isUiDevice)
{
	var theConstant = oFF.XConstant.setupName(new oFF.ProgramDevice(), name);
	theConstant.m_isUiDevice = isUiDevice;
	oFF.ProgramDevice.s_lookup.put(name, theConstant);
	return theConstant;
};
oFF.ProgramDevice.lookup = function(name)
{
	return oFF.ProgramDevice.s_lookup.getByKey(name);
};
oFF.ProgramDevice.prototype.m_isUiDevice = false;
oFF.ProgramDevice.prototype.isUiDevice = function()
{
	return this.m_isUiDevice;
};

oFF.ProcessEventType = function() {};
oFF.ProcessEventType.prototype = new oFF.XConstant();
oFF.ProcessEventType.prototype._ff_c = "ProcessEventType";

oFF.ProcessEventType.CREATED = null;
oFF.ProcessEventType.ACTIVE = null;
oFF.ProcessEventType.PROGRAM_STARTED = null;
oFF.ProcessEventType.START_CFG_CHANGED = null;
oFF.ProcessEventType.PROGRAM_TITLE_CHANGED = null;
oFF.ProcessEventType.BEFORE_SHUTDOWN_REQUEST = null;
oFF.ProcessEventType.SHUTDOWN_REQUEST = null;
oFF.ProcessEventType.SHUTDOWN_STARTED = null;
oFF.ProcessEventType.TERMINATED = null;
oFF.ProcessEventType.staticSetup = function()
{
	oFF.ProcessEventType.CREATED = oFF.ProcessEventType.create("Created");
	oFF.ProcessEventType.ACTIVE = oFF.ProcessEventType.create("Active");
	oFF.ProcessEventType.PROGRAM_STARTED = oFF.ProcessEventType.create("ProgramStarted");
	oFF.ProcessEventType.START_CFG_CHANGED = oFF.ProcessEventType.create("StartCfgChanged");
	oFF.ProcessEventType.PROGRAM_TITLE_CHANGED = oFF.ProcessEventType.create("ProgramTitleChanged");
	oFF.ProcessEventType.BEFORE_SHUTDOWN_REQUEST = oFF.ProcessEventType.create("BeforeShutdownRequest");
	oFF.ProcessEventType.SHUTDOWN_REQUEST = oFF.ProcessEventType.create("ShutdownRequest");
	oFF.ProcessEventType.SHUTDOWN_STARTED = oFF.ProcessEventType.create("ShutdownStarted");
	oFF.ProcessEventType.TERMINATED = oFF.ProcessEventType.create("Terminated");
};
oFF.ProcessEventType.create = function(name)
{
	var theConstant = oFF.XConstant.setupName(new oFF.ProcessEventType(), name);
	return theConstant;
};

oFF.ProcessType = function() {};
oFF.ProcessType.prototype = new oFF.XConstant();
oFF.ProcessType.prototype._ff_c = "ProcessType";

oFF.ProcessType.ROOT = null;
oFF.ProcessType.SUBSYSTEM = null;
oFF.ProcessType.PROGRAM = null;
oFF.ProcessType.SERVICE = null;
oFF.ProcessType.s_lookup = null;
oFF.ProcessType.staticSetup = function()
{
	oFF.ProcessType.s_lookup = oFF.XHashMapByString.create();
	oFF.ProcessType.ROOT = oFF.ProcessType.create("Root");
	oFF.ProcessType.PROGRAM = oFF.ProcessType.create("Program");
	oFF.ProcessType.SUBSYSTEM = oFF.ProcessType.create("SubSystem");
	oFF.ProcessType.SERVICE = oFF.ProcessType.create("Service");
};
oFF.ProcessType.create = function(name)
{
	var theConstant = oFF.XConstant.setupName(new oFF.ProcessType(), name);
	oFF.ProcessType.s_lookup.put(name, theConstant);
	return theConstant;
};
oFF.ProcessType.lookup = function(name)
{
	return oFF.ProcessType.s_lookup.getByKey(name);
};

oFF.SigSelDomain = function() {};
oFF.SigSelDomain.prototype = new oFF.XConstant();
oFF.SigSelDomain.prototype._ff_c = "SigSelDomain";

oFF.SigSelDomain.UI = null;
oFF.SigSelDomain.DATA = null;
oFF.SigSelDomain.CONTEXT = null;
oFF.SigSelDomain.SUBSYSTEM = null;
oFF.SigSelDomain.DIALOG = null;
oFF.SigSelDomain.ENVVARS = null;
oFF.SigSelDomain.s_all = null;
oFF.SigSelDomain.staticSetup = function()
{
	oFF.SigSelDomain.s_all = oFF.XSetOfNameObject.create();
	oFF.SigSelDomain.UI = oFF.SigSelDomain.create("ui");
	oFF.SigSelDomain.DATA = oFF.SigSelDomain.create("dp");
	oFF.SigSelDomain.CONTEXT = oFF.SigSelDomain.create("Context");
	oFF.SigSelDomain.SUBSYSTEM = oFF.SigSelDomain.create("subsys");
	oFF.SigSelDomain.DIALOG = oFF.SigSelDomain.create("dialog");
	oFF.SigSelDomain.ENVVARS = oFF.SigSelDomain.create("env");
};
oFF.SigSelDomain.create = function(name)
{
	var domain = new oFF.SigSelDomain();
	domain._setupInternal(name);
	oFF.SigSelDomain.s_all.add(domain);
	return domain;
};
oFF.SigSelDomain.lookup = function(name)
{
	return oFF.SigSelDomain.s_all.getByKey(name);
};

oFF.SigSelIndexType = function() {};
oFF.SigSelIndexType.prototype = new oFF.XConstant();
oFF.SigSelIndexType.prototype._ff_c = "SigSelIndexType";

oFF.SigSelIndexType.NONE = null;
oFF.SigSelIndexType.NAME = null;
oFF.SigSelIndexType.POSITION = null;
oFF.SigSelIndexType.staticSetup = function()
{
	oFF.SigSelIndexType.NONE = oFF.XConstant.setupName(new oFF.SigSelIndexType(), "None");
	oFF.SigSelIndexType.NAME = oFF.XConstant.setupName(new oFF.SigSelIndexType(), "Name");
	oFF.SigSelIndexType.POSITION = oFF.XConstant.setupName(new oFF.SigSelIndexType(), "Position");
};

oFF.SigSelType = function() {};
oFF.SigSelType.prototype = new oFF.XConstant();
oFF.SigSelType.prototype._ff_c = "SigSelType";

oFF.SigSelType.MATCH = null;
oFF.SigSelType.MATCH_NAME = null;
oFF.SigSelType.MATCH_ID = null;
oFF.SigSelType.WILDCARD = null;
oFF.SigSelType.staticSetup = function()
{
	oFF.SigSelType.MATCH = oFF.XConstant.setupName(new oFF.SigSelType(), "Match");
	oFF.SigSelType.MATCH_ID = oFF.XConstant.setupName(new oFF.SigSelType(), "MatchId");
	oFF.SigSelType.MATCH_NAME = oFF.XConstant.setupName(new oFF.SigSelType(), "MatchName");
	oFF.SigSelType.WILDCARD = oFF.XConstant.setupName(new oFF.SigSelType(), "Wildcard");
};

oFF.SubSystemStatus = function() {};
oFF.SubSystemStatus.prototype = new oFF.XConstant();
oFF.SubSystemStatus.prototype._ff_c = "SubSystemStatus";

oFF.SubSystemStatus.INITIAL = null;
oFF.SubSystemStatus.BOOTSTRAP = null;
oFF.SubSystemStatus.LOADING = null;
oFF.SubSystemStatus.ACTIVE = null;
oFF.SubSystemStatus.INACTIVE = null;
oFF.SubSystemStatus.CLOSED = null;
oFF.SubSystemStatus.staticSetup = function()
{
	oFF.SubSystemStatus.INITIAL = oFF.SubSystemStatus.create("Initial");
	oFF.SubSystemStatus.BOOTSTRAP = oFF.SubSystemStatus.create("Bootstrap");
	oFF.SubSystemStatus.LOADING = oFF.SubSystemStatus.create("Loading");
	oFF.SubSystemStatus.ACTIVE = oFF.SubSystemStatus.create("Active");
	oFF.SubSystemStatus.INACTIVE = oFF.SubSystemStatus.create("Inactive");
	oFF.SubSystemStatus.CLOSED = oFF.SubSystemStatus.create("Closed");
};
oFF.SubSystemStatus.create = function(name)
{
	var unitType = new oFF.SubSystemStatus();
	unitType._setupInternal(name);
	return unitType;
};

oFF.SubSystemType = function() {};
oFF.SubSystemType.prototype = new oFF.XConstant();
oFF.SubSystemType.prototype._ff_c = "SubSystemType";

oFF.SubSystemType.GUI = null;
oFF.SubSystemType.BOOTSTRAP_LANDSCAPE = null;
oFF.SubSystemType.SYSTEM_LANDSCAPE = null;
oFF.SubSystemType.USER_PROFILE = null;
oFF.SubSystemType.FILE_SYSTEM = null;
oFF.SubSystemType.VIRTUAL_FILE_SYSTEM = null;
oFF.SubSystemType.CACHE = null;
oFF.SubSystemType.s_instances = null;
oFF.SubSystemType.staticSetup = function()
{
	oFF.SubSystemType.s_instances = oFF.XHashMapByString.create();
	oFF.SubSystemType.GUI = oFF.SubSystemType.create("Gui");
	oFF.SubSystemType.USER_PROFILE = oFF.SubSystemType.create("UserProfile");
	oFF.SubSystemType.BOOTSTRAP_LANDSCAPE = oFF.SubSystemType.create("BootstrapLandscape");
	oFF.SubSystemType.SYSTEM_LANDSCAPE = oFF.SubSystemType.create("SystemLandscape");
	oFF.SubSystemType.FILE_SYSTEM = oFF.SubSystemType.create("FileSystem");
	oFF.SubSystemType.VIRTUAL_FILE_SYSTEM = oFF.SubSystemType.create("VirtualFileSystem");
	oFF.SubSystemType.CACHE = oFF.SubSystemType.create("Cache");
};
oFF.SubSystemType.create = function(name)
{
	var type = new oFF.SubSystemType();
	type._setupInternal(name);
	oFF.SubSystemType.s_instances.put(name, type);
	return type;
};
oFF.SubSystemType.lookup = function(name)
{
	return oFF.SubSystemType.s_instances.getByKey(name);
};

oFF.KernelComponentType = function() {};
oFF.KernelComponentType.prototype = new oFF.XComponentType();
oFF.KernelComponentType.prototype._ff_c = "KernelComponentType";

oFF.KernelComponentType.SIGSEL_RESULT_LIST = null;
oFF.KernelComponentType.SYSTEM_DESCRIPTION = null;
oFF.KernelComponentType.SYSTEM_LANDSCAPE = null;
oFF.KernelComponentType.staticSetupKernelComponentTypes = function()
{
	oFF.KernelComponentType.SIGSEL_RESULT_LIST = oFF.KernelComponentType.createKernelType("SigSelResultList", oFF.XComponentType._ROOT);
	oFF.KernelComponentType.SYSTEM_DESCRIPTION = oFF.KernelComponentType.createKernelType("SystemDescription", oFF.XComponentType._ROOT);
	oFF.KernelComponentType.SYSTEM_LANDSCAPE = oFF.KernelComponentType.createKernelType("SystemLandscape", oFF.XComponentType._ROOT);
};
oFF.KernelComponentType.createKernelType = function(constant, parent)
{
	var mt = new oFF.KernelComponentType();
	if (oFF.isNull(parent))
	{
		mt.setupExt(constant, oFF.XComponentType._ROOT);
	}
	else
	{
		mt.setupExt(constant, parent);
	}
	return mt;
};

oFF.KernelApiModule = function() {};
oFF.KernelApiModule.prototype = new oFF.DfModule();
oFF.KernelApiModule.prototype._ff_c = "KernelApiModule";

oFF.KernelApiModule.s_module = null;
oFF.KernelApiModule.getInstance = function()
{
	if (oFF.isNull(oFF.KernelApiModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.IoExtModule.getInstance());
		oFF.KernelApiModule.s_module = oFF.DfModule.startExt(new oFF.KernelApiModule());
		oFF.ResourceEntityType.staticSetup();
		oFF.SubSystemType.staticSetup();
		oFF.ProgramDevice.staticSetup();
		oFF.SystemRole.staticSetup();
		oFF.SigSelType.staticSetup();
		oFF.SigSelDomain.staticSetup();
		oFF.SigSelIndexType.staticSetup();
		oFF.SubSystemStatus.staticSetup();
		oFF.ServiceApiLevel.staticSetup();
		oFF.KernelComponentType.staticSetupKernelComponentTypes();
		oFF.ProcessType.staticSetup();
		oFF.ProcessEventType.staticSetup();
		oFF.DfModule.stopExt(oFF.KernelApiModule.s_module);
	}
	return oFF.KernelApiModule.s_module;
};
oFF.KernelApiModule.prototype.getName = function()
{
	return "ff1000.kernel.api";
};

oFF.KernelApiModule.getInstance();

return sap.firefly;
	} );