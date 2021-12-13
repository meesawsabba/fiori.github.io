/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
[
"sap/zen/dsh/firefly/ff1010.kernel.api.base"
],
function(oFF)
{
"use strict";

oFF.CredentialsFactory = function() {};
oFF.CredentialsFactory.prototype = new oFF.XObject();
oFF.CredentialsFactory.prototype._ff_c = "CredentialsFactory";

oFF.CredentialsFactory.BASIC_CREDENTIALS_PROVIDER = "basic";
oFF.CredentialsFactory.UI_CREDENTIALS_PROVIDER = "uiCredentialsProvider";
oFF.CredentialsFactory.s_factories = null;
oFF.CredentialsFactory.registerFactory = function(name, factory)
{
	if (oFF.isNull(oFF.CredentialsFactory.s_factories))
	{
		oFF.CredentialsFactory.s_factories = oFF.XHashMapByString.create();
	}
	oFF.CredentialsFactory.s_factories.put(name, factory);
};
oFF.CredentialsFactory.create = function(runtimeUserManager)
{
	var factory = null;
	var credentialsProviderName = runtimeUserManager.getSession().getEnvironment().getStringByKeyExt(oFF.XEnvironmentConstants.FIREFLY_CREDENTIALS_PROVIDER, oFF.CredentialsFactory.BASIC_CREDENTIALS_PROVIDER);
	if (oFF.notNull(oFF.CredentialsFactory.s_factories))
	{
		factory = oFF.CredentialsFactory.s_factories.getByKey(credentialsProviderName);
		if (oFF.isNull(factory) && oFF.CredentialsFactory.s_factories.size() > 0)
		{
			var firstKey = oFF.CredentialsFactory.s_factories.getKeysAsReadOnlyListOfString().get(0);
			factory = oFF.CredentialsFactory.s_factories.getByKey(firstKey);
		}
	}
	var credentialsProvider = null;
	if (oFF.notNull(factory))
	{
		credentialsProvider = factory.newCredentialsProvider(runtimeUserManager);
	}
	return credentialsProvider;
};

oFF.XRemoteHttpFileConstants = {

	CHILDREN:"children",
	EXISTS:"exists",
	CONTENT:"content",
	CONTENT_TYPE:"contentType",
	FILE_TYPE:"fileType",
	EXECUTABLE:"executable",
	FILE_TYPE_DIR:"dir",
	FILE_TYPE_FILE:"file",
	FILE_NAME:"fileName",
	NEW_FILE_NAME:"newFileName",
	VFS:"vfs"
};

oFF.XRemoteHttpFileRequestAdapter = function() {};
oFF.XRemoteHttpFileRequestAdapter.prototype = new oFF.XObject();
oFF.XRemoteHttpFileRequestAdapter.prototype._ff_c = "XRemoteHttpFileRequestAdapter";

oFF.XRemoteHttpFileRequestAdapter.create = function(callback)
{
	var adapter = new oFF.XRemoteHttpFileRequestAdapter();
	adapter.callback = callback;
	return adapter;
};
oFF.XRemoteHttpFileRequestAdapter.prototype.callback = null;
oFF.XRemoteHttpFileRequestAdapter.prototype.onHttpFileProcessed = function(extResult, data, customIdentifier)
{
	this.callback(extResult);
};

oFF.VfsPathInfo = function() {};
oFF.VfsPathInfo.prototype = new oFF.XObject();
oFF.VfsPathInfo.prototype._ff_c = "VfsPathInfo";

oFF.VfsPathInfo.create = function(name, path, pathElements, lastSeenParentNode, lastSeeParentNodeIndex, parentNode, element, matchType)
{
	var newObj = new oFF.VfsPathInfo();
	newObj.m_lastSeenParentNode = lastSeenParentNode;
	newObj.m_lastSeeParentNodeIndex = lastSeeParentNodeIndex;
	newObj.m_parentNode = parentNode;
	newObj.m_element = element;
	newObj.m_matchType = matchType;
	newObj.m_name = name;
	newObj.m_path = path;
	newObj.m_pathElements = pathElements;
	return newObj;
};
oFF.VfsPathInfo.prototype.m_lastSeenParentNode = null;
oFF.VfsPathInfo.prototype.m_lastSeeParentNodeIndex = 0;
oFF.VfsPathInfo.prototype.m_parentNode = null;
oFF.VfsPathInfo.prototype.m_element = null;
oFF.VfsPathInfo.prototype.m_name = null;
oFF.VfsPathInfo.prototype.m_matchType = null;
oFF.VfsPathInfo.prototype.m_path = null;
oFF.VfsPathInfo.prototype.m_pathElements = null;
oFF.VfsPathInfo.prototype.getLastSeenParentNode = function()
{
	return this.m_lastSeenParentNode;
};
oFF.VfsPathInfo.prototype.getLastSeeParentNodeIndex = function()
{
	return this.m_lastSeeParentNodeIndex;
};
oFF.VfsPathInfo.prototype.getParentNode = function()
{
	return this.m_parentNode;
};
oFF.VfsPathInfo.prototype.getElement = function()
{
	return this.m_element;
};
oFF.VfsPathInfo.prototype.getFileName = function()
{
	return this.m_name;
};
oFF.VfsPathInfo.prototype.isExisting = function()
{
	return this.m_matchType === oFF.VfsMatchResultType.EXACT;
};
oFF.VfsPathInfo.prototype.isFile = function()
{
	return this.isExisting() && this.m_element.getComponentType().isTypeOf(oFF.VfsElementType.FILE);
};
oFF.VfsPathInfo.prototype.isDirectory = function()
{
	return this.isExisting() && this.m_element.getComponentType().isTypeOf(oFF.VfsElementType.NODE);
};
oFF.VfsPathInfo.prototype.saveExt = function(content, compression)
{
	if (oFF.notNull(this.m_element))
	{
		if (this.m_element.getComponentType().isTypeOf(oFF.VfsElementType.FILE))
		{
			var file = this.m_element;
			file.setContent(content);
		}
	}
	else if (oFF.notNull(this.m_parentNode))
	{
		if (this.m_parentNode.getComponentType().isTypeOf(oFF.VfsElementType.DIR))
		{
			var dir = this.m_parentNode;
			var newFile = oFF.VfsElementFile.createFile(dir.getVfs(), null, this.getFileName(), content);
			dir.setChild(newFile);
		}
	}
};
oFF.VfsPathInfo.prototype.loadExt = function(compression)
{
	var content = null;
	if (oFF.notNull(this.m_element))
	{
		if (this.m_element.getComponentType().isTypeOf(oFF.VfsElementType.FILE))
		{
			var file = this.m_element;
			content = file.getContent();
		}
	}
	return content;
};
oFF.VfsPathInfo.prototype.mkdirExt = function(includeParentDirs)
{
	if (oFF.isNull(this.m_element))
	{
		var newDir;
		if (oFF.notNull(this.m_parentNode))
		{
			if (this.m_parentNode.getComponentType().isTypeOf(oFF.VfsElementType.DIR))
			{
				var dir = this.m_parentNode;
				newDir = oFF.VfsElementDir.createDir(dir.getVfs(), this.getFileName());
				dir.setChild(newDir);
			}
		}
		else if (includeParentDirs === true && oFF.notNull(this.m_lastSeenParentNode))
		{
			if (this.m_lastSeenParentNode.getComponentType().isTypeOf(oFF.VfsElementType.DIR))
			{
				var lastDir = this.m_lastSeenParentNode;
				var vfs = lastDir.getVfs();
				for (var i = this.m_lastSeeParentNodeIndex + 1; i < this.m_pathElements.size(); i++)
				{
					var name = this.m_pathElements.get(i);
					newDir = oFF.VfsElementDir.createDir(vfs, name);
					lastDir.setChild(newDir);
					lastDir = newDir;
				}
			}
		}
	}
};
oFF.VfsPathInfo.prototype.deleteFile = function()
{
	if (oFF.notNull(this.m_parentNode) && oFF.notNull(this.m_element))
	{
		if (this.m_parentNode.getComponentType().isTypeOf(oFF.VfsElementType.DIR))
		{
			var dir = this.m_parentNode;
			dir.removeChild(this.m_name);
		}
	}
};
oFF.VfsPathInfo.prototype.getChildNames = function()
{
	var childNames = null;
	if (this.isDirectory())
	{
		childNames = this.m_element.getChildNames();
	}
	return childNames;
};
oFF.VfsPathInfo.prototype.getPath = function()
{
	return this.m_path;
};
oFF.VfsPathInfo.prototype.getPathElements = function()
{
	return this.m_pathElements;
};
oFF.VfsPathInfo.prototype.isInMountingArea = function()
{
	return this.getMountPoint() !== null;
};
oFF.VfsPathInfo.prototype.newFile = function(session, vfsUri)
{
	var file = null;
	var mountPoint = this.getMountPoint();
	if (oFF.notNull(mountPoint))
	{
		file = mountPoint.newFile(session, vfsUri);
	}
	return file;
};
oFF.VfsPathInfo.prototype.getMountPoint = function()
{
	var node = null;
	if (oFF.notNull(this.m_element))
	{
		if (this.m_element.getComponentType() === oFF.VfsElementType.MOUNT_POINT)
		{
			node = this.m_element;
		}
	}
	else if (oFF.notNull(this.m_lastSeenParentNode))
	{
		if (this.m_lastSeenParentNode.getComponentType() === oFF.VfsElementType.MOUNT_POINT)
		{
			node = this.m_lastSeenParentNode;
		}
	}
	return node;
};

oFF.ModuleInitializer = function() {};
oFF.ModuleInitializer.prototype = new oFF.XObject();
oFF.ModuleInitializer.prototype._ff_c = "ModuleInitializer";

oFF.ModuleInitializer.initAllReleaseModules = function(verbose)
{
	oFF.CoreModule.getInstance();
	oFF.XClass.initializeClass("com.oFF.PlatformModule", verbose);
	oFF.XClass.initializeClass("com.oFF.CoreExtModule", verbose);
	oFF.XClass.initializeClass("com.oFF.IoModule", verbose);
	oFF.XClass.initializeClass("com.oFF.IoNativeModule", verbose);
	oFF.XClass.initializeClass("com.oFF.IoExtModule", verbose);
	oFF.XClass.initializeClass("com.oFF.RuntimeModule", verbose);
	oFF.XClass.initializeClass("com.oFF.ToolsModule", verbose);
	oFF.XClass.initializeClass("com.oFF.WebdispatcherModule", verbose);
	oFF.XClass.initializeClass("com.oFF.ServerNativeModule", verbose);
	oFF.XClass.initializeClass("com.oFF.UiModule", verbose);
	oFF.XClass.initializeClass("com.oFF.UiDriverModule", verbose);
	oFF.XClass.initializeClass("com.oFF.AbstractionModule", verbose);
	oFF.XClass.initializeClass("com.oFF.ProtocolModule", verbose);
	oFF.XClass.initializeClass("com.oFF.ProcessorModule", verbose);
	oFF.XClass.initializeClass("com.oFF.OlapApiModule", verbose);
	oFF.XClass.initializeClass("com.oFF.OlapBwExtApiModule", verbose);
	oFF.XClass.initializeClass("com.oFF.OlapCatalogApiModule", verbose);
	oFF.XClass.initializeClass("com.oFF.ResultsetModule", verbose);
	oFF.XClass.initializeClass("com.oFF.OlapExtModule", verbose);
	oFF.XClass.initializeClass("com.oFF.OlapImplModule", verbose);
	oFF.XClass.initializeClass("com.oFF.OlapCmdImplModule", verbose);
	oFF.XClass.initializeClass("com.oFF.IpImplModule", verbose);
	oFF.XClass.initializeClass("com.oFF.OlapBwExtImplModule", verbose);
	oFF.XClass.initializeClass("com.oFF.OlapCatalogImplModule", verbose);
	oFF.XClass.initializeClass("com.oFF.OlapReferenceModule", verbose);
	oFF.XClass.initializeClass("com.oFF.OlapHelpersModule", verbose);
	oFF.XClass.initializeClass("com.oFF.ProviderModule", verbose);
	oFF.XClass.initializeClass("com.oFF.StoryModule", verbose);
	oFF.XClass.initializeClass("com.oFF.XicsModule", verbose);
	oFF.XClass.initializeClass("com.oFF.InaManipulationModule", verbose);
	oFF.XClass.initializeClass("com.oFF.RepoModule", verbose);
	oFF.XClass.initializeClass("com.oFF.EPMModule", verbose);
	oFF.XClass.initializeClass("com.oFF.QuasarModule", verbose);
	oFF.XClass.initializeClass("com.oFF.OlapUiModule", verbose);
	oFF.XClass.initializeClass("com.oFF.PoseidonModule", verbose);
	oFF.XClass.initializeClass("com.oFF.StudioModule", verbose);
	oFF.XClass.initializeClass("com.oFF.StudioUiModule", verbose);
	oFF.XClass.initializeClass("com.oFF.ExamplesModule", verbose);
};
oFF.ModuleInitializer.initAllTestModules = function(verbose)
{
	oFF.ModuleInitializer.initAllReleaseModules(verbose);
	oFF.XClass.initializeClass("com.oFF.IoTestModule", verbose);
	oFF.XClass.initializeClass("com.oFF.RuntimeTestModule", verbose);
	oFF.XClass.initializeClass("com.oFF.WebDispatcherTestModule", verbose);
	oFF.XClass.initializeClass("com.oFF.UiDriverTestModule", verbose);
	oFF.XClass.initializeClass("com.oFF.AbstractionTestModule", verbose);
	oFF.XClass.initializeClass("com.oFF.OlapNativeTestModule", verbose);
	oFF.XClass.initializeClass("com.oFF.OlapTestModule", verbose);
	oFF.XClass.initializeClass("com.oFF.ProcessorTestModule", verbose);
	oFF.XClass.initializeClass("com.oFF.StoryTestModule", verbose);
	oFF.XClass.initializeClass("com.oFF.InACacheTestsModule", verbose);
	oFF.XClass.initializeClass("com.oFF.RepoTestModule", verbose);
	oFF.XClass.initializeClass("com.oFF.EPMTestModule", verbose);
	oFF.XClass.initializeClass("com.oFF.StudioTestsModule", verbose);
	oFF.XClass.initializeClass("com.oFF.ApplicationTestModule", verbose);
};

oFF.ModuleLoaderDummy = function() {};
oFF.ModuleLoaderDummy.prototype = new oFF.XObject();
oFF.ModuleLoaderDummy.prototype._ff_c = "ModuleLoaderDummy";

oFF.ModuleLoaderDummy.staticSetup = function()
{
	oFF.ModuleManager.registerModuleLoader(new oFF.ModuleLoaderDummy());
};
oFF.ModuleLoaderDummy.prototype.processModuleLoad = function(session, moduleDef, listener, cachebusterId)
{
	var messages = oFF.MessageManagerSimple.createMessageManager();
	var fullClazzName = moduleDef.getModuleInitClazzNameCompatible();
	var clazz = oFF.XClass.createByName(fullClazzName);
	if (oFF.notNull(clazz))
	{
		clazz.newInstance(session);
	}
	else
	{
		messages.addMessage(oFF.XMessage.createError(oFF.OriginLayer.KERNEL, oFF.XStringUtils.concatenate2("ModuleLoader: Could not load XCLass=", fullClazzName), null, false, null));
	}
	listener.onModuleLoaded(messages, moduleDef.getName(), true);
};

oFF.ModuleResources = {

	staticSetup:function()
	{
			oFF.ModuleManager.registerDirect("_all", null, false, "_all/combined/_all.js", "_all_tests,ff9010.zen.project", null);
		oFF.ModuleManager.registerDirect("_all_release", null, false, "_all_release/combined/_all_release.js", "ff0060.commons.ext,ff0070.structures,ff0080.structures.native,ff0230.io.ext,ff1030.kernel.impl,ff1040.kernel.native,ff2010.binding,ff2040.shell,ff2170.tools,ff2180.webdispatcher,ff2210.ui.native,ff2220.ui.program,ff2310.server.native,ff3100.system.ui,ff3500.sql,ff3550.sql.ui,ff4315.olap.ip.impl,ff4320.olap.masterdata.impl,ff4410.olap.ip.providers,ff4400.olap.providers,ff4500.olap.engine,ff5500.story,ff6000.ina.cache,ff6010.ina.manipulation,ff6200.epmapp,ff4050.processor,ff8010.olap.ui,ff8090.poseidon,ff8100.studio,ff8110.studio.ui,ff8120.dragonfly,ff8900.examples", null);
		oFF.ModuleManager.registerDirect("_all_tests", null, false, "_all_tests/combined/_all_tests.js", "_all_release,ff0065.commons.tests,ff1090.kernel.tests,ff3590.sql.test,ff8990.application.tests,ff2290.ui.tests,ff5510.story.tests,ff6190.repo.tests,ff6290.epmapp.tests,ff8110.studio.ui,ff8120.dragonfly,ff8190.studio.tests", null);
		oFF.ModuleManager.registerDirect("ff0000.language.native", null, false, "ff0000.language.native/combined/ff0000.language.native.js", null, null);
		oFF.ModuleManager.registerDirect("ff0005.language.ext", "com.oFF.LanguageExtModule", false, "ff0005.language.ext/combined/ff0005.language.ext.js", "ff0000.language.native", null);
		oFF.ModuleManager.registerDirect("ff0010.core", "com.oFF.CoreModule", false, "ff0010.core/combined/ff0010.core.js", "ff0005.language.ext", null);
		oFF.ModuleManager.registerDirect("ff0020.core.native", "com.oFF.PlatformModule", false, "ff0020.core.native/combined/ff0020.core.native.js", "ff0010.core", null);
		oFF.ModuleManager.registerDirect("ff0030.core.ext", "com.oFF.CoreExtModule", false, "ff0030.core.ext/combined/ff0030.core.ext.js", "ff0020.core.native", null);
		oFF.ModuleManager.registerDirect("ff0040.commons", "com.oFF.CommonsModule", false, "ff0040.commons/combined/ff0040.commons.js", "ff0030.core.ext", null);
		oFF.ModuleManager.registerDirect("ff0050.commons.native", "com.oFF.CommonsNativeModule", false, "ff0050.commons.native/combined/ff0050.commons.native.js", "ff0040.commons", null);
		oFF.ModuleManager.registerDirect("ff0060.commons.ext", "com.oFF.CommonsExtModule", false, "ff0060.commons.ext/combined/ff0060.commons.ext.js", "ff0050.commons.native", null);
		oFF.ModuleManager.registerDirect("ff0065.commons.tests", "com.oFF.CommonsTestModule", false, "ff0065.commons.tests/combined/ff0065.commons.tests.js", "ff0060.commons.ext", null);
		oFF.ModuleManager.registerDirect("ff0070.structures", "com.oFF.StructuresModule", false, "ff0070.structures/combined/ff0070.structures.js", "ff0060.commons.ext", null);
		oFF.ModuleManager.registerDirect("ff0080.structures.native", "com.oFF.StructuresNativeModule", false, "ff0080.structures.native/combined/ff0080.structures.native.js", "ff0070.structures", null);
		oFF.ModuleManager.registerDirect("ff0090.structures.tests", "com.oFF.PlatformTestModule", false, "ff0090.structures.tests/combined/ff0090.structures.tests.js", "ff0065.commons.tests,ff0080.structures.native", null);
		oFF.ModuleManager.registerDirect("ff0200.io", "com.oFF.IoModule", false, "ff0200.io/combined/ff0200.io.js", "ff0080.structures.native", null);
		oFF.ModuleManager.registerDirect("ff0210.io.native", "com.oFF.IoNativeModule", false, "ff0210.io.native/combined/ff0210.io.native.js", "ff0200.io", null);
		oFF.ModuleManager.registerDirect("ff0230.io.ext", "com.oFF.IoExtModule", false, "ff0230.io.ext/combined/ff0230.io.ext.js", "ff0210.io.native", null);
		oFF.ModuleManager.registerDirect("ff0290.io.tests", "com.oFF.IoTestModule", false, "ff0290.io.tests/combined/ff0290.io.tests.js", "ff0090.structures.tests,ff0230.io.ext", null);
		oFF.ModuleManager.registerDirect("ff1000.kernel.api", "com.oFF.KernelApiModule", false, "ff1000.kernel.api/combined/ff1000.kernel.api.js", "ff0230.io.ext", null);
		oFF.ModuleManager.registerDirect("ff1010.kernel.api.base", "com.oFF.KernelApiBaseModule", false, "ff1010.kernel.api.base/combined/ff1010.kernel.api.base.js", "ff1000.kernel.api", null);
		oFF.ModuleManager.registerDirect("ff1030.kernel.impl", "com.oFF.KernelImplModule", false, "ff1030.kernel.impl/combined/ff1030.kernel.impl.js", "ff1010.kernel.api.base", null);
		oFF.ModuleManager.registerDirect("ff1040.kernel.native", "com.oFF.KernelNativeModule", false, "ff1040.kernel.native/combined/ff1040.kernel.native.js", "ff1030.kernel.impl", null);
		oFF.ModuleManager.registerDirect("ff1090.kernel.tests", "com.oFF.KernelTestsModule", false, "ff1090.kernel.tests/combined/ff1090.kernel.tests.js", "ff0290.io.tests,ff1040.kernel.native", null);
		oFF.ModuleManager.registerDirect("ff2010.binding", "com.oFF.BindingModule", false, "ff2010.binding/combined/ff2010.binding.js", "ff1040.kernel.native", null);
		oFF.ModuleManager.registerDirect("ff2040.shell", "com.oFF.ShellModule", false, "ff2040.shell/combined/ff2040.shell.js", "ff1040.kernel.native", null);
		oFF.ModuleManager.registerDirect("ff2100.runtime", "com.oFF.RuntimeModule", false, "ff2100.runtime/combined/ff2100.runtime.js", "ff0210.io.native,ff0230.io.ext,ff1040.kernel.native,ff2010.binding", null);
		oFF.ModuleManager.registerDirect("ff2170.tools", "com.oFF.ToolsModule", false, "ff2170.tools/combined/ff2170.tools.js", "ff2100.runtime", null);
		oFF.ModuleManager.registerDirect("ff2180.webdispatcher", "com.oFF.WebdispatcherModule", false, "ff2180.webdispatcher/combined/ff2180.webdispatcher.js", "ff1040.kernel.native", null);
		oFF.ModuleManager.registerDirect("ff2190.runtime.tests", "com.oFF.RuntimeTestModule", false, "ff2190.runtime.tests/combined/ff2190.runtime.tests.js", "ff0290.io.tests,ff1090.kernel.tests,ff2040.shell,ff2100.runtime,ff2170.tools,ff2180.webdispatcher", null);
		oFF.ModuleManager.registerDirect("ff2195.webdispatcher.tests", "com.oFF.WebDispatcherTestModule", false, "ff2195.webdispatcher.tests/combined/ff2195.webdispatcher.tests.js", "ff2190.runtime.tests,ff2180.webdispatcher", null);
		oFF.ModuleManager.registerDirect("ff2200.ui", "com.oFF.UiModule", false, "ff2200.ui/combined/ff2200.ui.js", "ff1040.kernel.native,ff2010.binding", null);
		oFF.ModuleManager.registerDirect("ff2210.ui.native", "com.oFF.UiDriverModule", true, "ff2210.ui.native/combined/ff2210.ui.native.js", "ff2200.ui", "{\"ExternalLibraries\":{\"Javascript\":{\"sapui5\":[{\"Id\":\"sap-ui-bootstrap\",\"Source\":\"https:\\/\\/sapui5.hana.ondemand.com\\/resources\\/sap-ui-core.js\",\"Tags\":[{\"data-sap-ui-language\":\"en\"},{\"data-sap-ui-theme\":\"sap_belize\"},{\"data-sap-ui-libs\":\"sap.ui.core,sap.ui.commons,sap.ui.table,sap.ui.unified,sap.m\"},{\"data-sap-ui-compatVersion\":\"edge\"}],\"Type\":\"Javascript\"},{\"Source\":\"${network}\\/ff2210.ui.native\\/javascript.sapui5\\/firefly.styles.sapui5.css\",\"Type\":\"Css\"},{\"Description\":\"Required for UxWindow and UxTerminal\",\"Source\":\"https:\\/\\/cdn.jsdelivr.net\\/npm\\/interactjs\\/dist\\/interact.min.js\",\"Type\":\"Javascript\"},{\"Source\":\"https:\\/\\/code.highcharts.com\\/stock\\/highstock.js\",\"Type\":\"Javascript\"},{\"Source\":\"https:\\/\\/code.highcharts.com\\/stock\\/highcharts-more.js\",\"Type\":\"Javascript\"},{\"Source\":\"https:\\/\\/code.highcharts.com\\/stock\\/modules\\/solid-gauge.js\",\"Type\":\"Javascript\"},{\"Source\":\"https:\\/\\/code.highcharts.com\\/modules\\/histogram-bellcurve.js\",\"Type\":\"Javascript\"},{\"Source\":\"https:\\/\\/code.highcharts.com\\/modules\\/no-data-to-display.js\",\"Type\":\"Javascript\"},{\"Source\":\"https:\\/\\/code.highcharts.com\\/modules\\/wordcloud.js\",\"Type\":\"Javascript\"},{\"Source\":\"https:\\/\\/code.highcharts.com\\/modules\\/variable-pie.js\",\"Type\":\"Javascript\"},{\"Source\":\"https:\\/\\/code.highcharts.com\\/modules\\/heatmap.js\",\"Type\":\"Javascript\"},{\"Source\":\"https:\\/\\/code.highcharts.com\\/modules\\/treemap.js\",\"Type\":\"Javascript\"},{\"Source\":\"https:\\/\\/code.highcharts.com\\/modules\\/variwide.js\",\"Type\":\"Javascript\"},{\"Source\":\"https:\\/\\/code.highcharts.com\\/modules\\/pattern-fill.js\",\"Type\":\"Javascript\"},{\"Source\":\"https:\\/\\/code.highcharts.com\\/highcharts-3d.js\",\"Type\":\"Javascript\"},{\"Source\":\"http:\\/\\/blacklabel.github.io\\/grouped_categories\\/grouped-categories.js\",\"Type\":\"Javascript\"}]}}}");
		oFF.ModuleManager.registerDirect("ff2220.ui.program", "com.oFF.UiProgramModule", false, "ff2220.ui.program/combined/ff2220.ui.program.js", "ff2200.ui,ff2100.runtime", null);
		oFF.ModuleManager.registerDirect("ff2230.ui.remote", "com.oFF.UiRemoteModule", false, "ff2230.ui.remote/combined/ff2230.ui.remote.js", "ff2220.ui.program", null);
		oFF.ModuleManager.registerDirect("ff2290.ui.tests", "com.oFF.UiDriverTestModule", false, "ff2290.ui.tests/combined/ff2290.ui.tests.js", "ff2190.runtime.tests,ff2230.ui.remote", null);
		oFF.ModuleManager.registerDirect("ff2310.server.native", "com.oFF.ServerNativeModule", false, "ff2310.server.native/combined/ff2310.server.native.js", "ff2100.runtime", null);
		oFF.ModuleManager.registerDirect("ff3100.system.ui", "com.oFF.SystemUiModule", false, "ff3100.system.ui/combined/ff3100.system.ui.js", "ff2220.ui.program", null);
		oFF.ModuleManager.registerDirect("ff3500.sql", "com.oFF.SqlModule", false, "ff3500.sql/combined/ff3500.sql.js", "ff0005.language.ext,ff2100.runtime", null);
		oFF.ModuleManager.registerDirect("ff3550.sql.ui", "com.oFF.SqlUiModule", false, "ff3550.sql.ui/combined/ff3550.sql.ui.js", "ff2200.ui,ff2220.ui.program,ff3500.sql", null);
		oFF.ModuleManager.registerDirect("ff3590.sql.test", "com.oFF.SqlTestModule", false, "ff3590.sql.test/combined/ff3590.sql.test.js", "ff2190.runtime.tests,ff3500.sql", null);
		oFF.ModuleManager.registerDirect("ff4000.protocol.ina", "com.oFF.ProtocolModule", false, "ff4000.protocol.ina/combined/ff4000.protocol.ina.js", "ff2100.runtime", null);
		oFF.ModuleManager.registerDirect("ff4050.processor", "com.oFF.ProcessorModule", false, "ff4050.processor/combined/ff4050.processor.js", "ff4000.protocol.ina", null);
		oFF.ModuleManager.registerDirect("ff4200.olap.api", "com.oFF.OlapApiModule", false, "ff4200.olap.api/combined/ff4200.olap.api.js", "ff2100.runtime", null);
		oFF.ModuleManager.registerDirect("ff4205.olap.api.base", "com.oFF.OlapApiBaseModule", false, "ff4205.olap.api.base/combined/ff4205.olap.api.base.js", "ff4200.olap.api", null);
		oFF.ModuleManager.registerDirect("ff4210.olap.masterdata.api", "com.oFF.OlapBwExtApiModule", false, "ff4210.olap.masterdata.api/combined/ff4210.olap.masterdata.api.js", "ff4200.olap.api", null);
		oFF.ModuleManager.registerDirect("ff4220.olap.catalog.api", "com.oFF.OlapCatalogApiModule", false, "ff4220.olap.catalog.api/combined/ff4220.olap.catalog.api.js", "ff4200.olap.api", null);
		oFF.ModuleManager.registerDirect("ff4250.olap.resultset", "com.oFF.ResultsetModule", false, "ff4250.olap.resultset/combined/ff4250.olap.resultset.js", "ff4000.protocol.ina,ff4200.olap.api,ff4205.olap.api.base", null);
		oFF.ModuleManager.registerDirect("ff4305.olap.model", "com.oFF.OlapModelModule", false, "ff4305.olap.model/combined/ff4305.olap.model.js", "ff4205.olap.api.base", null);
		oFF.ModuleManager.registerDirect("ff4310.olap.impl", "com.oFF.OlapImplModule", false, "ff4310.olap.impl/combined/ff4310.olap.impl.js", "ff4000.protocol.ina,ff4205.olap.api.base,ff4250.olap.resultset,ff4305.olap.model", null);
		oFF.ModuleManager.registerDirect("ff4315.olap.ip.impl", "com.oFF.IpImplModule", false, "ff4315.olap.ip.impl/combined/ff4315.olap.ip.impl.js", "ff4310.olap.impl", null);
		oFF.ModuleManager.registerDirect("ff4320.olap.masterdata.impl", "com.oFF.OlapBwExtImplModule", false, "ff4320.olap.masterdata.impl/combined/ff4320.olap.masterdata.impl.js", "ff4310.olap.impl,ff4210.olap.masterdata.api,ff4315.olap.ip.impl", null);
		oFF.ModuleManager.registerDirect("ff4330.olap.catalog.impl", "com.oFF.OlapCatalogImplModule", false, "ff4330.olap.catalog.impl/combined/ff4330.olap.catalog.impl.js", "ff4310.olap.impl,ff4220.olap.catalog.api", null);
		oFF.ModuleManager.registerDirect("ff4340.olap.reference", "com.oFF.OlapReferenceModule", false, "ff4340.olap.reference/combined/ff4340.olap.reference.js", "ff4310.olap.impl", null);
		oFF.ModuleManager.registerDirect("ff4390.olap.helpers", "com.oFF.OlapHelpersModule", false, "ff4390.olap.helpers/combined/ff4390.olap.helpers.js", "ff4000.protocol.ina,ff4250.olap.resultset", null);
		oFF.ModuleManager.registerDirect("ff4394.olap.serialization", "com.oFF.OlapSerializationModule", false, "ff4394.olap.serialization/combined/ff4394.olap.serialization.js", "ff4310.olap.impl", null);
		oFF.ModuleManager.registerDirect("ff4400.olap.providers", "com.oFF.ProviderModule", false, "ff4400.olap.providers/combined/ff4400.olap.providers.js", "ff4394.olap.serialization", null);
		oFF.ModuleManager.registerDirect("ff4410.olap.ip.providers", "com.oFF.IpProviderModule", false, "ff4410.olap.ip.providers/combined/ff4410.olap.ip.providers.js", "ff4400.olap.providers,ff4315.olap.ip.impl", null);
		oFF.ModuleManager.registerDirect("ff4500.olap.engine", "com.oFF.OlapEngineModule", false, "ff4500.olap.engine/combined/ff4500.olap.engine.js", "ff2100.runtime", null);
		oFF.ModuleManager.registerDirect("ff4900.olap.native.tests", "com.oFF.OlapNativeTestModule", false, "ff4900.olap.native.tests/combined/ff4900.olap.native.tests.js", "ff2190.runtime.tests,ff4000.protocol.ina", null);
		oFF.ModuleManager.registerDirect("ff4910.olap.tests", "com.oFF.OlapTestModule", false, "ff4910.olap.tests/combined/ff4910.olap.tests.js", "ff2190.runtime.tests,ff4210.olap.masterdata.api,ff4220.olap.catalog.api,ff4200.olap.api", null);
		oFF.ModuleManager.registerDirect("ff4911.olap.part2.tests", "com.oFF.OlapTestPart2Module", false, "ff4911.olap.part2.tests/combined/ff4911.olap.part2.tests.js", "ff4910.olap.tests", null);
		oFF.ModuleManager.registerDirect("ff4913.olap.ip.tests", "com.oFF.OlapIpTestModule", false, "ff4913.olap.ip.tests/combined/ff4913.olap.ip.tests.js", "ff4910.olap.tests", null);
		oFF.ModuleManager.registerDirect("ff4914.olap.repo.tests", "com.oFF.OlapRepoTestModule", false, "ff4914.olap.repo.tests/combined/ff4914.olap.repo.tests.js", "ff4910.olap.tests", null);
		oFF.ModuleManager.registerDirect("ff4915.processor.tests", "com.oFF.ProcessorTestModule", false, "ff4915.processor.tests/combined/ff4915.processor.tests.js", "ff4050.processor,ff4910.olap.tests,ff4400.olap.providers", null);
		oFF.ModuleManager.registerDirect("ff4920.olap.impl.tests", "com.oFF.ProvidersTestModule", false, "ff4920.olap.impl.tests/combined/ff4920.olap.impl.tests.js", "ff4390.olap.helpers,ff4900.olap.native.tests,ff4910.olap.tests,ff4911.olap.part2.tests,ff4913.olap.ip.tests,ff4914.olap.repo.tests,ff4915.processor.tests,ff4320.olap.masterdata.impl,ff4330.olap.catalog.impl,ff4340.olap.reference,ff4400.olap.providers,ff4410.olap.ip.providers", null);
		oFF.ModuleManager.registerDirect("ff5500.story", "com.oFF.StoryModule", false, "ff5500.story/combined/ff5500.story.js", "ff2100.runtime,ff4000.protocol.ina", null);
		oFF.ModuleManager.registerDirect("ff5510.story.tests", "com.oFF.StoryTestModule", false, "ff5510.story.tests/combined/ff5510.story.tests.js", "ff2190.runtime.tests,ff5500.story", null);
		oFF.ModuleManager.registerDirect("ff6000.ina.cache", "com.oFF.XicsModule", false, "ff6000.ina.cache/combined/ff6000.ina.cache.js", "ff2100.runtime", null);
		oFF.ModuleManager.registerDirect("ff6010.ina.manipulation", "com.oFF.InaManipulationModule", false, "ff6010.ina.manipulation/combined/ff6010.ina.manipulation.js", "ff6000.ina.cache", null);
		oFF.ModuleManager.registerDirect("ff6090.ina.cache.tests", "com.oFF.InACacheTestsModule", false, "ff6090.ina.cache.tests/combined/ff6090.ina.cache.tests.js", "ff4920.olap.impl.tests,ff6010.ina.manipulation", null);
		oFF.ModuleManager.registerDirect("ff6100.repo", "com.oFF.RepoModule", false, "ff6100.repo/combined/ff6100.repo.js", "ff4000.protocol.ina", null);
		oFF.ModuleManager.registerDirect("ff6190.repo.tests", "com.oFF.RepoTestModule", false, "ff6190.repo.tests/combined/ff6190.repo.tests.js", "ff6100.repo,ff4920.olap.impl.tests", null);
		oFF.ModuleManager.registerDirect("ff6200.epmapp", "com.oFF.EPMModule", false, "ff6200.epmapp/combined/ff6200.epmapp.js", "ff2100.runtime,ff6100.repo", null);
		oFF.ModuleManager.registerDirect("ff6290.epmapp.tests", "com.oFF.EPMTestModule", false, "ff6290.epmapp.tests/combined/ff6290.epmapp.tests.js", "ff6100.repo,ff6200.epmapp,ff4920.olap.impl.tests", null);
		oFF.ModuleManager.registerDirect("ff8000.quasar", "com.oFF.QuasarModule", false, "ff8000.quasar/combined/ff8000.quasar.js", "ff2230.ui.remote,ff4200.olap.api", null);
		oFF.ModuleManager.registerDirect("ff8010.olap.ui", "com.oFF.OlapUiModule", false, "ff8010.olap.ui/combined/ff8010.olap.ui.js", "ff2200.ui,ff2220.ui.program,ff4200.olap.api,ff4220.olap.catalog.api,ff4305.olap.model", null);
		oFF.ModuleManager.registerDirect("ff8050.application.ui", "com.oFF.ApplicationUiModule", false, "ff8050.application.ui/combined/ff8050.application.ui.js", "ff3100.system.ui,ff8000.quasar,ff4200.olap.api,ff5500.story,ff8010.olap.ui", null);
		oFF.ModuleManager.registerDirect("ff8090.poseidon", "com.oFF.PoseidonModule", false, "ff8090.poseidon/combined/ff8090.poseidon.js", "ff3100.system.ui,ff8050.application.ui", null);
		oFF.ModuleManager.registerDirect("ff8100.studio", "com.oFF.StudioModule", false, "ff8100.studio/combined/ff8100.studio.js", "ff2220.ui.program", null);
		oFF.ModuleManager.registerDirect("ff8110.studio.ui", "com.oFF.StudioUiModule", false, "ff8110.studio.ui/combined/ff8110.studio.ui.js", "ff2040.shell,ff8100.studio,ff2210.ui.native,ff3500.sql,ff8050.application.ui,ff8090.poseidon,ff4220.olap.catalog.api,ff4410.olap.ip.providers,ff4330.olap.catalog.impl,ff4340.olap.reference", null);
		oFF.ModuleManager.registerDirect("ff8120.dragonfly", "com.oFF.DragonflyModule", false, "ff8120.dragonfly/combined/ff8120.dragonfly.js", "ff2210.ui.native,ff4330.olap.catalog.impl,ff4340.olap.reference,ff4390.olap.helpers,ff4410.olap.ip.providers,ff8110.studio.ui", null);
		oFF.ModuleManager.registerDirect("ff8190.studio.tests", "com.oFF.StudioTestsModule", false, "ff8190.studio.tests/combined/ff8190.studio.tests.js", "ff2190.runtime.tests,ff2290.ui.tests,ff4220.olap.catalog.api,ff4920.olap.impl.tests,ff5510.story.tests,ff8100.studio,ff8050.application.ui,ff8090.poseidon", null);
		oFF.ModuleManager.registerDirect("ff8300.zen.buddha.utils.native", null, false, "ff8300.zen.buddha.utils.native/combined/ff8300.zen.buddha.utils.native.js", "ff4410.olap.ip.providers,ff4330.olap.catalog.impl,ff4340.olap.reference,ff8010.olap.ui,ff8110.studio.ui", null);
		oFF.ModuleManager.registerDirect("ff8310.zen.buddha", null, false, "ff8310.zen.buddha/combined/ff8310.zen.buddha.js", "ff8300.zen.buddha.utils.native", null);
		oFF.ModuleManager.registerDirect("ff8320.zen.landscape.utils", null, false, "ff8320.zen.landscape.utils/combined/ff8320.zen.landscape.utils.js", "ff8310.zen.buddha", null);
		oFF.ModuleManager.registerDirect("ff8900.examples", "com.oFF.ExamplesModule", false, "ff8900.examples/combined/ff8900.examples.js", "ff4050.processor,ff6000.ina.cache,ff4400.olap.providers,ff4320.olap.masterdata.impl,ff4330.olap.catalog.impl,ff4340.olap.reference,ff4390.olap.helpers,ff4410.olap.ip.providers,ff8010.olap.ui", null);
		oFF.ModuleManager.registerDirect("ff8990.application.tests", "com.oFF.ApplicationTestModule", false, "ff8990.application.tests/combined/ff8990.application.tests.js", "ff2190.runtime.tests,ff2195.webdispatcher.tests,ff2290.ui.tests,ff4920.olap.impl.tests,ff5510.story.tests,ff6090.ina.cache.tests,ff8190.studio.tests", null);
		oFF.ModuleManager.registerDirect("ff9010.zen.project", null, false, "ff9010.zen.project/combined/ff9010.zen.project.js", "ff8320.zen.landscape.utils", null);
		oFF.ModuleManager.registerDirect("ff9020.ffservice", "com.oFF.FFServiceModule", false, "ff9020.ffservice/combined/ff9020.ffservice.js", "ff2210.ui.native,ff2310.server.native,ff4400.olap.providers,ff4330.olap.catalog.impl,ff4340.olap.reference,ff4390.olap.helpers,ff8110.studio.ui", null);
		oFF.ModuleManager.registerDirect("ff9030.skylights", "com.oFF.SkylightsModule", false, "ff9030.skylights/combined/ff9030.skylights.js", "ff2210.ui.native,ff2230.ui.remote,ff2310.server.native,ff3500.sql,ff4500.olap.engine,ff8110.studio.ui,ff8990.application.tests", null);
		oFF.ModuleManager.registerDirect("orca_delivery", null, false, "orca_delivery/combined/orca_delivery.js", "ff0080.structures.native,ff0230.io.ext,ff1040.kernel.native,ff2010.binding,ff2040.shell,ff2210.ui.native,ff3100.system.ui,ff4050.processor,ff4330.olap.catalog.impl,ff4400.olap.providers,ff4410.olap.ip.providers,ff4340.olap.reference,ff6000.ina.cache,ff6100.repo,ff8010.olap.ui,ff8050.application.ui,ff8090.poseidon,ff8100.studio", null);
	}
};

oFF.NestedBatchRequestDecorator = function() {};
oFF.NestedBatchRequestDecorator.prototype = new oFF.XObject();
oFF.NestedBatchRequestDecorator.prototype._ff_c = "NestedBatchRequestDecorator";

oFF.NestedBatchRequestDecorator.getBatchRequestDecorator = function(requestStructure)
{
	if (oFF.isNull(requestStructure))
	{
		return null;
	}
	var batchList = oFF.PrUtils.getListProperty(requestStructure, oFF.ConnectionConstants.INA_BATCH);
	if (oFF.isNull(batchList))
	{
		return null;
	}
	var requestItems = oFF.XList.create();
	for (var i = 0; i < batchList.size(); i++)
	{
		var requestStructureElement = oFF.PrUtils.getStructureElement(batchList, i);
		oFF.XObjectExt.assertNotNullExt(requestStructureElement, "illegal nested batch syntax");
		requestItems.add(requestStructureElement);
	}
	var decorator = new oFF.NestedBatchRequestDecorator();
	decorator.m_requestItems = requestItems;
	return decorator;
};
oFF.NestedBatchRequestDecorator.prototype.m_requestItems = null;
oFF.NestedBatchRequestDecorator.prototype.getItemsSize = function()
{
	return this.m_requestItems.size();
};
oFF.NestedBatchRequestDecorator.prototype.getRequestItems = function()
{
	return this.m_requestItems;
};
oFF.NestedBatchRequestDecorator.prototype.buildResponse = function(responseItems)
{
	if (responseItems.size() !== this.getItemsSize())
	{
		throw oFF.XException.createIllegalStateException("illegal planning batch response structure");
	}
	var result = oFF.PrFactory.createStructure();
	var batchList = result.putNewList(oFF.ConnectionConstants.INA_BATCH);
	for (var i = 0; i < responseItems.size(); i++)
	{
		var responseStructure = responseItems.get(i);
		oFF.XObjectExt.assertNotNullExt(responseStructure, "illegal nested batch response structure");
		batchList.add(responseStructure);
	}
	return result;
};

oFF.NestedBatchRequestDecoratorProvider = function() {};
oFF.NestedBatchRequestDecoratorProvider.prototype = new oFF.XObject();
oFF.NestedBatchRequestDecoratorProvider.prototype._ff_c = "NestedBatchRequestDecoratorProvider";

oFF.NestedBatchRequestDecoratorProvider.CLAZZ = null;
oFF.NestedBatchRequestDecoratorProvider.staticSetup = function()
{
	oFF.NestedBatchRequestDecoratorProvider.CLAZZ = oFF.XClass.create(oFF.NestedBatchRequestDecoratorProvider);
};
oFF.NestedBatchRequestDecoratorProvider.prototype.getBatchRequestDecorator = function(requestStructure)
{
	return oFF.NestedBatchRequestDecorator.getBatchRequestDecorator(requestStructure);
};

oFF.BatchRequestDecoratorFactory = function() {};
oFF.BatchRequestDecoratorFactory.prototype = new oFF.XObject();
oFF.BatchRequestDecoratorFactory.prototype._ff_c = "BatchRequestDecoratorFactory";

oFF.BatchRequestDecoratorFactory.BATCH_REQUEST_DECORATOR_PROVIDER = "BATCH_REQUEST_DECORATOR_PROVIDER.IMPLEMENTATION";
oFF.BatchRequestDecoratorFactory.getBatchRequestDecorator = function(session, requestStructure)
{
	var sessionSingletons = session.getSessionSingletons();
	var factoryObject = sessionSingletons.getByKey(oFF.BatchRequestDecoratorFactory.BATCH_REQUEST_DECORATOR_PROVIDER);
	var factory;
	if (oFF.isNull(factoryObject))
	{
		factory = new oFF.BatchRequestDecoratorFactory();
		factory.initProviders();
		sessionSingletons.put(oFF.BatchRequestDecoratorFactory.BATCH_REQUEST_DECORATOR_PROVIDER, factory);
	}
	else
	{
		factory = factoryObject;
	}
	return factory.getBatchRequestDecoratorInternal(requestStructure);
};
oFF.BatchRequestDecoratorFactory.prototype.m_providers = null;
oFF.BatchRequestDecoratorFactory.prototype.getBatchRequestDecoratorInternal = function(requestStructure)
{
	var result = null;
	for (var i = 0; i < this.m_providers.size(); i++)
	{
		var provider = this.m_providers.get(i);
		var decorator = provider.getBatchRequestDecorator(requestStructure);
		if (oFF.isNull(decorator))
		{
			continue;
		}
		if (oFF.notNull(result))
		{
			throw oFF.XException.createIllegalStateException("duplicate decorator");
		}
		result = decorator;
	}
	return result;
};
oFF.BatchRequestDecoratorFactory.prototype.initProviders = function()
{
	if (oFF.notNull(this.m_providers))
	{
		return;
	}
	this.m_providers = oFF.XList.create();
	var registrationService = oFF.RegistrationService.getInstance();
	if (oFF.notNull(registrationService))
	{
		var clazzes = registrationService.getReferences(oFF.BatchRequestDecoratorFactory.BATCH_REQUEST_DECORATOR_PROVIDER);
		if (oFF.notNull(clazzes))
		{
			for (var i = 0; i < clazzes.size(); i++)
			{
				var clazz = clazzes.get(i);
				var provider = clazz.newInstance(this);
				this.m_providers.add(provider);
			}
		}
	}
};

oFF.ConnectionConstants = {

	FAST_PATH:"FastPath",
	SAP_CLIENT:"sap-client",
	SAP_LANGUAGE:"sap-language",
	INA_CAPABILITY_SUPPORTS_BATCH:"SupportsBatch",
	INA_CAPABILITY_SUPPORTS_BATCH_RS_STREAMING:"AsyncBatchRequest",
	INA_BATCH:"Batch",
	INA_BATCH_ID:"BatchId",
	INA_BATCH_ASYNC_RESPONSE_REQUEST:"AsyncResponseRequest",
	INA_BATCH_NEXT_ASYNC_RESPONSE:"GetNextAsyncResponse",
	INA_ANALYTICS:"Analytics",
	INA_ACTIONS:"Actions",
	INA_TYPE:"Type",
	INA_DATA_SOURCE:"DataSource",
	INA_INSTANCE_ID:"InstanceId",
	INA_METADATA:"Metadata",
	INA_CUBE:"Cube",
	INA_DS_VALIDATION:"DataSourceValidation",
	KEEP_ALIVE_PARAM:"keepAlive",
	INA_FASTPATH_XXL_WS:"FastPathXXLWebService",
	INA_GRIDS:"Grids",
	INA_SOURCES:"Sources"
};

oFF.InAConstantsBios = {

	QY_TEXT:"Text",
	QY_TYPE:"Type",
	VA_TYPE_CLOSE:"Close",
	VA_TYPE_DATA_AREA_CMD:"DataAreaCommand",
	VA_TYPE_PLANNING_FUNCTION:"PlanningFunction",
	VA_TYPE_PLANNING_SEQUENCE:"PlanningSequence",
	VA_TYPE_STRING:"String",
	QY_NUMBER:"Number",
	QY_MESSAGE_CLASS:"MessageClass",
	QY_MESSAGES:"Messages",
	QY_MESSAGE_TYPE:"MessageType",
	VA_SEVERITY_INFO:0,
	VA_SEVERITY_WARNING:1,
	VA_SEVERITY_ERROR:2,
	VA_SEVERITY_SEMANTICAL_ERROR:3,
	QY_MEASUREMENTS:"Measurements",
	QY_OLAP_MESSAGE_CLASS:"OlapMessageClass",
	QY_GRIDS:"Grids",
	QY_PLANNING:"Planning",
	QY_PERFORMANCE_DATA:"PerformanceData",
	QY_SESSION_ID:"SessionId",
	QY_STEP_ID:"StepId",
	QY_TIMESTAMP:"Timestamp",
	QY_METADATA:"Metadata",
	QY_RUNTIME:"Runtime",
	QY_DATA_REQUEST:"DataRequest",
	QY_CALLS:"Calls",
	QY_DESCRIPTION:"Description",
	QY_TIME:"Time",
	QY_CLIENT_INFO:"ClientInfo",
	QY_CLIENT_COMPONENT:"Component",
	QY_CLIENT_IDENTIFIER:"Identifier",
	QY_CLIENT_VERSION:"Version",
	QY_CLIENT_CONTEXT:"Context",
	QY_STORY_ID:"StoryId",
	QY_STORY_NAME:"StoryName",
	QY_LANGUAGE_LOCALE:"LanguageLocale",
	QY_WIDGET_ID:"WidgetId",
	PR_CAPABILITIES:"Capabilities",
	PR_CAPABILITIESDEV:"CapabilitiesDev",
	PR_SERVICES:"Services",
	PR_SERVICE:"Service",
	PR_SERVER_INFO:"ServerInfo",
	PR_SETTINGS:"Settings",
	PR_SI_REENTRANCE_TICKET:"ReentranceTicket",
	PR_SI_SERVER_TYPE:"ServerType",
	PR_SI_SYSTEM_ID:"SystemId",
	PR_SI_CLIENT:"Client",
	PR_SI_TENANT:"TenantId",
	PR_SI_PUBLIC_URL:"PublicUrl",
	PR_SI_USER_NAME:"userName",
	PR_SI_VERSION:"Version",
	PR_SI_BUILD_TIME:"BuildTime",
	PR_SI_LANGUAGE:"UserLanguageCode",
	PR_VALUE:"Value",
	PR_CAPABILITY:"Capability"
};

oFF.InAHelper = {

	importMessages:function(inaElement, messageCollector)
	{
			if (oFF.isNull(inaElement) || !inaElement.isStructure())
		{
			return false;
		}
		var inaStructure = inaElement;
		var inaMessages = inaStructure.getListByKey(oFF.InAConstantsBios.QY_MESSAGES);
		if (oFF.isNull(inaMessages))
		{
			var inaGrids = inaStructure.getListByKey(oFF.InAConstantsBios.QY_GRIDS);
			if (oFF.notNull(inaGrids))
			{
				var inaGrid = inaGrids.getStructureAt(0);
				if (oFF.notNull(inaGrid))
				{
					inaMessages = inaGrid.getListByKey(oFF.InAConstantsBios.QY_MESSAGES);
				}
			}
			if (oFF.isNull(inaMessages))
			{
				var inaPlanningElement = inaStructure.getByKey(oFF.InAConstantsBios.QY_PLANNING);
				if (oFF.notNull(inaPlanningElement))
				{
					if (inaPlanningElement.isList() && inaPlanningElement.size() > 0)
					{
						var inaPlanningList = inaPlanningElement;
						for (var i = 0; i < inaPlanningList.size(); i++)
						{
							var currentInaPlanning = inaPlanningList.getStructureAt(i);
							if (oFF.notNull(currentInaPlanning))
							{
								var currentInaPlanningMessages = currentInaPlanning.getListByKey(oFF.InAConstantsBios.QY_MESSAGES);
								if (oFF.notNull(currentInaPlanningMessages))
								{
									if (oFF.isNull(inaMessages))
									{
										inaMessages = currentInaPlanningMessages;
									}
									else
									{
										inaMessages.addAll(currentInaPlanningMessages);
									}
								}
							}
						}
					}
					else if (inaPlanningElement.isStructure())
					{
						var currentInaPlanningMessages2 = inaPlanningElement.getListByKey(oFF.InAConstantsBios.QY_MESSAGES);
						if (oFF.notNull(currentInaPlanningMessages2))
						{
							inaMessages = currentInaPlanningMessages2;
						}
					}
				}
			}
		}
		var hasErrors = oFF.InAHelper.importInaMessagesInternal(inaMessages, messageCollector);
		var inaPerformance = inaStructure.getStructureByKey(oFF.InAConstantsBios.QY_PERFORMANCE_DATA);
		oFF.InAHelper.importProfiling(inaPerformance, messageCollector);
		return hasErrors;
	},
	importInaMessagesInternal:function(inaMessages, messageCollector)
	{
			if (oFF.PrUtils.isListEmpty(inaMessages))
		{
			return false;
		}
		var hasErrors = false;
		var messageSize = inaMessages.size();
		var text = oFF.XStringBuffer.create();
		for (var i = 0; i < messageSize; i++)
		{
			var inaMessage = inaMessages.getStructureAt(i);
			text.append(inaMessage.getStringByKey(oFF.InAConstantsBios.QY_TEXT));
			var type = inaMessage.getIntegerByKeyExt(oFF.InAConstantsBios.QY_TYPE, 0);
			var code = inaMessage.getIntegerByKeyExt(oFF.InAConstantsBios.QY_NUMBER, 0);
			var message = null;
			switch (type)
			{
				case oFF.InAConstantsBios.VA_SEVERITY_INFO:
					message = messageCollector.addInfoExt(oFF.OriginLayer.SERVER, code, text.toString());
					break;

				case oFF.InAConstantsBios.VA_SEVERITY_WARNING:
					message = messageCollector.addWarningExt(oFF.OriginLayer.SERVER, code, text.toString());
					break;

				case oFF.InAConstantsBios.VA_SEVERITY_ERROR:
					message = messageCollector.addErrorExt(oFF.OriginLayer.SERVER, code, text.toString(), null);
					hasErrors = true;
					break;

				case oFF.InAConstantsBios.VA_SEVERITY_SEMANTICAL_ERROR:
					message = messageCollector.addSemanticalError(oFF.OriginLayer.SERVER, code, text.toString());
					break;

				default:
					break;
			}
			if (oFF.notNull(message))
			{
				message.setMessageClass(inaMessage.getStringByKey(oFF.InAConstantsBios.QY_MESSAGE_CLASS));
				message.setOlapMessageClass(inaMessage.getIntegerByKeyExt(oFF.InAConstantsBios.QY_OLAP_MESSAGE_CLASS, -1));
				var context = oFF.PrUtils.getStructureProperty(inaMessage, "Context");
				if (oFF.notNull(context))
				{
					message.setExtendendInfo(context);
					message.setExtendendInfoType(oFF.ExtendedInfoType.CONTEXT_STRUCTURE);
				}
			}
			text.clear();
		}
		oFF.XObjectExt.release(text);
		return hasErrors;
	},
	importProfiling:function(inaPerformance, messageCollector)
	{
			if (oFF.notNull(inaPerformance))
		{
			var buffer = oFF.XStringBuffer.create();
			buffer.append("Engine (SessionId=").append(inaPerformance.getStringByKey(oFF.InAConstantsBios.QY_SESSION_ID));
			var stepId = inaPerformance.getStringByKey(oFF.InAConstantsBios.QY_STEP_ID);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(stepId))
			{
				buffer.append(", StepId=").append(stepId);
			}
			buffer.append(", Timestamp=").append(inaPerformance.getStringByKey(oFF.InAConstantsBios.QY_TIMESTAMP)).append(")");
			var engineRuntimeInSeconds = inaPerformance.getDoubleByKeyExt(oFF.InAConstantsBios.QY_RUNTIME, 0.0);
			var engineRuntimeInMs = engineRuntimeInSeconds * 1000.0;
			var engineRuntimeInMsLong = oFF.XDouble.convertToLong(engineRuntimeInMs);
			var engineProfileNode = oFF.ProfileNode.createWithDuration(buffer.toString(), engineRuntimeInMsLong);
			buffer.clear();
			var serverMeasurements = inaPerformance.getListByKey(oFF.InAConstantsBios.QY_MEASUREMENTS);
			if (oFF.notNull(serverMeasurements))
			{
				var size = serverMeasurements.size();
				for (var j = 0; j < size; j++)
				{
					var singleMeasure = serverMeasurements.getStructureAt(j);
					var calls = singleMeasure.getIntegerByKeyExt(oFF.InAConstantsBios.QY_CALLS, 1);
					var measureText;
					if (calls > 1)
					{
						buffer.append(singleMeasure.getStringByKey(oFF.InAConstantsBios.QY_DESCRIPTION)).append(" (").appendInt(calls).append("x)");
						measureText = buffer.toString();
						buffer.clear();
					}
					else
					{
						measureText = singleMeasure.getStringByKey(oFF.InAConstantsBios.QY_DESCRIPTION);
					}
					if (singleMeasure.containsKey(oFF.InAConstantsBios.QY_TIME))
					{
						engineRuntimeInSeconds = singleMeasure.getDoubleByKey(oFF.InAConstantsBios.QY_TIME);
						engineRuntimeInMs = engineRuntimeInSeconds * 1000.0;
						engineRuntimeInMsLong = oFF.XDouble.convertToLong(engineRuntimeInMs);
						var singleMeasureNode = oFF.ProfileNode.createWithDuration(measureText, engineRuntimeInMsLong);
						if (oFF.notNull(engineProfileNode))
						{
							engineProfileNode.addProfileNode(singleMeasureNode);
						}
					}
				}
			}
			oFF.XObjectExt.release(buffer);
			messageCollector.detailProfileNode("### SERVER ###", engineProfileNode, "Network");
		}
	}
};

oFF.DsrConstants = {

	eyeCatcher:null,
	recordIdPassport:567898765,
	fieldTypeByteArray:3,
	fieldIdPassportBytes:36,
	lenOfFieldIdField:1,
	lenOfFieldTypeField:1,
	lenOfStringLenField:2,
	lenOfRecordIdField:4,
	lenOfRecordLenField:2,
	eyeCatcher1Len:4,
	versionLen:1,
	lenLen:2,
	traceFlagLen:2,
	systemIdLen:32,
	serviceLen:2,
	userIdLen:32,
	actionLen:40,
	actionTypeLen:2,
	prevSystemIdLen:32,
	transIdLen:32,
	eyeCatcher2Len:4,
	clientNumberLen:3,
	systemTypeLen:2,
	rootContextLen:16,
	connectionIdLen:16,
	connectionCounterLen:4,
	varPartCountLen:2,
	varPartOffsetLen:2,
	netExtPassportLen:0,
	netExtPassportVer3MinLen:0,
	currentPassportVersion:3,
	VARIABLE_PART_HEADER_LENGTH:12,
	staticSetup:function()
	{
			oFF.DsrConstants.eyeCatcher = oFF.XByteArray.create(null, 4);
		oFF.DsrConstants.eyeCatcher.setByteAt(0, 42);
		oFF.DsrConstants.eyeCatcher.setByteAt(1, 84);
		oFF.DsrConstants.eyeCatcher.setByteAt(2, 72);
		oFF.DsrConstants.eyeCatcher.setByteAt(3, 42);
		oFF.DsrConstants.netExtPassportLen = oFF.DsrConstants.eyeCatcher1Len + oFF.DsrConstants.versionLen + oFF.DsrConstants.lenLen + oFF.DsrConstants.traceFlagLen + oFF.DsrConstants.systemIdLen + oFF.DsrConstants.serviceLen + oFF.DsrConstants.userIdLen + oFF.DsrConstants.actionLen + oFF.DsrConstants.actionTypeLen + oFF.DsrConstants.prevSystemIdLen + oFF.DsrConstants.transIdLen + oFF.DsrConstants.eyeCatcher2Len;
		oFF.DsrConstants.netExtPassportVer3MinLen = oFF.DsrConstants.netExtPassportLen + oFF.DsrConstants.clientNumberLen + oFF.DsrConstants.systemTypeLen + oFF.DsrConstants.rootContextLen + oFF.DsrConstants.connectionIdLen + oFF.DsrConstants.connectionCounterLen + oFF.DsrConstants.varPartCountLen + oFF.DsrConstants.varPartOffsetLen;
	}
};

oFF.DsrConvert = {

	int2OneByte:function(n, b, offset)
	{
			b.setByteAt(offset, oFF.XInteger.getNthLeastSignificantByte(n, 0));
		return;
	},
	int2TwoByte:function(n, b, offset)
	{
			b.setByteAt(offset, oFF.XInteger.getNthLeastSignificantByte(n, 1));
		b.setByteAt(offset + 1, oFF.XInteger.getNthLeastSignificantByte(n, 0));
		return;
	},
	int2FourByte:function(n, b, offset)
	{
			b.setByteAt(offset, oFF.XInteger.getNthLeastSignificantByte(n, 3));
		b.setByteAt(offset + 1, oFF.XInteger.getNthLeastSignificantByte(n, 2));
		b.setByteAt(offset + 2, oFF.XInteger.getNthLeastSignificantByte(n, 1));
		b.setByteAt(offset + 3, oFF.XInteger.getNthLeastSignificantByte(n, 0));
		return;
	},
	long2EightByte:function(n, b, offset)
	{
			b.setByteAt(offset, oFF.XLong.getNthLeastSignificantByte(n, 7));
		b.setByteAt(offset + 1, oFF.XLong.getNthLeastSignificantByte(n, 6));
		b.setByteAt(offset + 2, oFF.XLong.getNthLeastSignificantByte(n, 5));
		b.setByteAt(offset + 3, oFF.XLong.getNthLeastSignificantByte(n, 4));
		b.setByteAt(offset + 4, oFF.XLong.getNthLeastSignificantByte(n, 3));
		b.setByteAt(offset + 5, oFF.XLong.getNthLeastSignificantByte(n, 2));
		b.setByteAt(offset + 6, oFF.XLong.getNthLeastSignificantByte(n, 1));
		b.setByteAt(offset + 7, oFF.XLong.getNthLeastSignificantByte(n, 0));
		return;
	},
	oneByte2Int:function(b, offset)
	{
			var r = b.getByteAt(offset);
		if (0 > r)
		{
			r = r + 256;
		}
		return r;
	},
	twoByte2IntBigEndian:function(b, offset)
	{
			var r1 = b.getByteAt(offset + 1);
		var r2 = b.getByteAt(offset);
		if (0 > r1)
		{
			r1 = r1 + 256;
		}
		if (0 > r2)
		{
			r2 = r2 + 256;
		}
		return r1 * 256 + r2;
	},
	twoByte2Int:function(b, offset)
	{
			var r1 = b.getByteAt(offset);
		var r2 = b.getByteAt(offset + 1);
		if (0 > r1)
		{
			r1 = r1 + 256;
		}
		if (0 > r2)
		{
			r2 = r2 + 256;
		}
		return r1 * 256 + r2;
	},
	fourByte2Int:function(b, offset)
	{
			var s;
		var r = b.getByteAt(offset);
		if (0 > r)
		{
			r = r + 256;
		}
		for (var i = 1; i < 4; i++)
		{
			s = b.getByteAt(offset + i);
			if (0 > s)
			{
				s = s + 256;
			}
			r = r * 256 + s;
		}
		return r;
	},
	eightByte2Long:function(b, offset)
	{
			var s;
		var r = b.getByteAt(offset);
		if (0 > r)
		{
			r = r + 256;
		}
		for (var i = 1; i < 8; i++)
		{
			s = b.getByteAt(offset + i);
			if (0 > s)
			{
				s = s + 256;
			}
			r = r * 256 + s;
		}
		return r;
	},
	byteArrayToHex:function(byteArray)
	{
			var hex = oFF.XStringBuffer.create();
		if (oFF.notNull(byteArray))
		{
			for (var i = 0; i < byteArray.size(); i++)
			{
				var subHex = oFF.XInteger.convertToHexString(byteArray.getByteAt(i));
				var subHexSize = oFF.XString.size(subHex);
				if (subHexSize === 0)
				{
					subHex = "00";
				}
				else if (subHexSize === 1)
				{
					subHex = oFF.XStringUtils.concatenate2("0", subHex);
				}
				else if (subHexSize > 2)
				{
					subHex = oFF.XString.substring(subHex, subHexSize - 2, subHexSize);
				}
				hex.append(subHex);
			}
		}
		return hex.toString();
	},
	hexToByteArray:function(_hex)
	{
			var hex = oFF.XString.toUpperCase(_hex);
		var l = oFF.XString.size(hex);
		var len = l / 2;
		var result = oFF.XByteArray.create(null, len);
		for (var i = 0; i < len; i++)
		{
			result.setByteAt(i, oFF.XInteger.convertFromStringWithRadix(oFF.XString.substring(hex, i * 2, i * 2 + 2), 16));
		}
		return result;
	}
};

oFF.DsrEncodeDecode = {

	encodeBytePassport:function(passport)
	{
			return oFF.DsrEncodeDecode.encodeBytePassportWithConnection(passport, null, null, 0);
	},
	encodeBytePassportWithConnection:function(passport, connId, hexConnId, connCounter)
	{
			var i = 0;
		var position = 0;
		var temp;
		var len = oFF.DsrConstants.netExtPassportVer3MinLen;
		len = len + passport.getVarItemsLength();
		var res = oFF.XByteArray.create(null, len);
		for (i = 0; i < len; i++)
		{
			res.setByteAt(i, 0);
		}
		oFF.XByteArray.copy(oFF.DsrConstants.eyeCatcher, 0, res, position, oFF.DsrConstants.eyeCatcher1Len);
		position = position + oFF.DsrConstants.eyeCatcher1Len;
		res.setByteAt(position, oFF.DsrConstants.currentPassportVersion);
		position = position + oFF.DsrConstants.versionLen;
		res.setByteAt(position, oFF.XInteger.getNthLeastSignificantByte(len, 1));
		res.setByteAt(position + 1, oFF.XInteger.getNthLeastSignificantByte(len, 0));
		position = position + oFF.DsrConstants.lenLen;
		res.setByteAt(position + 1, oFF.XInteger.getNthLeastSignificantByte(passport.getTraceFlag(), 1));
		res.setByteAt(position, oFF.XInteger.getNthLeastSignificantByte(passport.getTraceFlag(), 0));
		position = position + oFF.DsrConstants.traceFlagLen;
		position = oFF.DsrEncodeDecode.writeByteFromString(passport.getSystemId(), res, position, oFF.DsrConstants.systemIdLen);
		res.setByteAt(position, oFF.XInteger.getNthLeastSignificantByte(passport.getService(), 1));
		res.setByteAt(position + 1, oFF.XInteger.getNthLeastSignificantByte(passport.getService(), 0));
		position = position + oFF.DsrConstants.serviceLen;
		position = oFF.DsrEncodeDecode.writeByteFromString(passport.getUserId(), res, position, oFF.DsrConstants.userIdLen);
		position = oFF.DsrEncodeDecode.writeByteFromString(passport.getAction(), res, position, oFF.DsrConstants.actionLen);
		res.setByteAt(position, oFF.XInteger.getNthLeastSignificantByte(passport.getActionType(), 1));
		res.setByteAt(position + 1, oFF.XInteger.getNthLeastSignificantByte(passport.getActionType(), 0));
		position = position + oFF.DsrConstants.actionTypeLen;
		position = oFF.DsrEncodeDecode.writeByteFromString(passport.getPrevSystemId(), res, position, oFF.DsrConstants.prevSystemIdLen);
		temp = null;
		if (passport.getTransId() !== null)
		{
			temp = oFF.DsrConvert.hexToByteArray(passport.getTransId());
		}
		if (oFF.notNull(temp))
		{
			oFF.XByteArray.copy(temp, 0, res, position, oFF.XMath.min(temp.size(), oFF.DsrConstants.transIdLen));
		}
		position = position + oFF.DsrConstants.transIdLen;
		position = oFF.DsrEncodeDecode.writeByteFromString(passport.getClientNumber(), res, position, oFF.DsrConstants.clientNumberLen);
		res.setByteAt(position, oFF.XInteger.getNthLeastSignificantByte(passport.getSystemType(), 1));
		res.setByteAt(position + 1, oFF.XInteger.getNthLeastSignificantByte(passport.getSystemType(), 0));
		position = position + oFF.DsrConstants.systemTypeLen;
		temp = null;
		if (passport.getRootContextId() !== null && oFF.XString.size(passport.getRootContextId()) === oFF.DsrConstants.rootContextLen * 2)
		{
			temp = oFF.DsrConvert.hexToByteArray(passport.getRootContextId());
		}
		if (oFF.notNull(temp))
		{
			oFF.XByteArray.copy(temp, 0, res, position, oFF.XMath.min(temp.size(), oFF.DsrConstants.rootContextLen));
		}
		position = position + oFF.DsrConstants.rootContextLen;
		temp = null;
		if (oFF.notNull(connId))
		{
			temp = connId;
		}
		else if (oFF.notNull(hexConnId) && oFF.XString.size(hexConnId) === oFF.DsrConstants.connectionIdLen * 2)
		{
			temp = oFF.DsrConvert.hexToByteArray(hexConnId);
		}
		else if (passport.getConnectionId() !== null && oFF.XString.size(passport.getConnectionId()) === oFF.DsrConstants.connectionIdLen * 2)
		{
			temp = oFF.DsrConvert.hexToByteArray(passport.getConnectionId());
		}
		if (oFF.notNull(temp))
		{
			oFF.XByteArray.copy(temp, 0, res, position, oFF.XMath.min(temp.size(), oFF.DsrConstants.connectionIdLen));
		}
		position = position + oFF.DsrConstants.connectionIdLen;
		var connectionCounter = 0;
		if (connCounter !== 0)
		{
			connectionCounter = connCounter;
		}
		else
		{
			connectionCounter = passport.getConnectionCounter();
		}
		temp = oFF.XByteArray.create(null, 4);
		oFF.DsrConvert.int2FourByte(connectionCounter, temp, 0);
		if (oFF.notNull(temp))
		{
			oFF.XByteArray.copy(temp, 0, res, position, oFF.XMath.min(oFF.DsrConstants.connectionCounterLen, oFF.DsrConstants.connectionCounterLen));
		}
		position = position + oFF.DsrConstants.connectionCounterLen;
		var varPartCount = passport.getVarItemsCount();
		var varPartBytes = oFF.DsrEncodeDecode.getBytesVarItems(passport);
		if (varPartCount !== 0 && oFF.notNull(varPartBytes))
		{
			res.setByteAt(position, oFF.XInteger.getNthLeastSignificantByte(varPartCount, 1));
			res.setByteAt(position + 1, oFF.XInteger.getNthLeastSignificantByte(varPartCount, 0));
			position = position + oFF.DsrConstants.varPartCountLen;
			var varPartOffset = position + oFF.DsrConstants.varPartOffsetLen;
			res.setByteAt(position, oFF.XInteger.getNthLeastSignificantByte(varPartOffset, 1));
			res.setByteAt(position + 1, oFF.XInteger.getNthLeastSignificantByte(varPartOffset, 0));
			position = position + oFF.DsrConstants.varPartOffsetLen;
			oFF.XByteArray.copy(varPartBytes, 0, res, position, varPartBytes.size());
			position = position + varPartBytes.size();
		}
		else
		{
			position = position + 4;
		}
		oFF.XByteArray.copy(oFF.DsrConstants.eyeCatcher, 0, res, position, oFF.DsrConstants.eyeCatcher1Len);
		return res;
	},
	writeByteFromString:function(data, res, position, dataLength)
	{
			var temp = null;
		if (oFF.notNull(data))
		{
			temp = oFF.XByteArray.convertFromString(data);
		}
		if (oFF.notNull(temp))
		{
			oFF.XByteArray.copy(temp, 0, res, position, oFF.XMath.min(temp.size(), dataLength));
		}
		return position + dataLength;
	},
	decodeBytePassport:function(newPassport, netPassport)
	{
			var position = 0;
		var _varPart = null;
		var _varPartCount = 0;
		if (oFF.isNull(netPassport))
		{
			return null;
		}
		if (netPassport.size() < 7)
		{
			return null;
		}
		if (0 !== oFF.DsrEncodeDecode.arrayCmp(netPassport, 0, oFF.DsrConstants.eyeCatcher, 0, oFF.DsrConstants.eyeCatcher1Len))
		{
			return null;
		}
		position = position + oFF.DsrConstants.eyeCatcher1Len;
		var version = netPassport.getByteAt(position);
		if (0 > version)
		{
			version = version + 256;
		}
		position = position + oFF.DsrConstants.versionLen;
		var len = oFF.DsrConvert.twoByte2Int(netPassport, position);
		position = position + oFF.DsrConstants.lenLen;
		if (netPassport.size() !== len)
		{
			return null;
		}
		if (version === 2)
		{
			if (oFF.DsrConstants.netExtPassportLen !== len)
			{
				return null;
			}
		}
		else if (version >= 3)
		{
			if (len < oFF.DsrConstants.netExtPassportVer3MinLen)
			{
				return null;
			}
		}
		else
		{
			return null;
		}
		if (0 !== oFF.DsrEncodeDecode.arrayCmp(netPassport, len - oFF.DsrConstants.eyeCatcher2Len, oFF.DsrConstants.eyeCatcher, 0, oFF.DsrConstants.eyeCatcher2Len))
		{
			return null;
		}
		var traceFlag = oFF.DsrConvert.twoByte2IntBigEndian(netPassport, position);
		position = position + oFF.DsrConstants.traceFlagLen;
		var size = oFF.DsrEncodeDecode.getZeroTerminationIndex(netPassport, oFF.DsrConstants.systemIdLen, position);
		var sysId = oFF.XByteArray.create(null, size);
		oFF.XByteArray.copy(netPassport, position, sysId, 0, size);
		position = position + oFF.DsrConstants.systemIdLen;
		var service = oFF.DsrConvert.twoByte2Int(netPassport, position);
		position = position + oFF.DsrConstants.serviceLen;
		size = oFF.DsrEncodeDecode.getZeroTerminationIndex(netPassport, oFF.DsrConstants.userIdLen, position);
		var userId = oFF.XByteArray.create(null, size);
		oFF.XByteArray.copy(netPassport, position, userId, 0, size);
		position = position + oFF.DsrConstants.userIdLen;
		size = oFF.DsrEncodeDecode.getZeroTerminationIndex(netPassport, oFF.DsrConstants.actionLen, position);
		var action = oFF.XByteArray.create(null, size);
		oFF.XByteArray.copy(netPassport, position, action, 0, size);
		position = position + oFF.DsrConstants.actionLen;
		var actionType = oFF.DsrConvert.twoByte2Int(netPassport, position);
		position = position + oFF.DsrConstants.actionTypeLen;
		size = oFF.DsrEncodeDecode.getZeroTerminationIndex(netPassport, oFF.DsrConstants.prevSystemIdLen, position);
		var prevSysId = oFF.XByteArray.create(null, size);
		oFF.XByteArray.copy(netPassport, position, prevSysId, 0, size);
		position = position + oFF.DsrConstants.prevSystemIdLen;
		var rootContextId = null;
		var connectionId = null;
		var transId = null;
		var connectionCounter = 0;
		var clientNumber = null;
		var systemType = 0;
		if (version >= 2)
		{
			transId = oFF.XByteArray.create(null, oFF.DsrConstants.transIdLen);
			oFF.XByteArray.copy(netPassport, position, transId, 0, oFF.DsrConstants.transIdLen);
			position = position + oFF.DsrConstants.transIdLen;
		}
		if (version >= 3)
		{
			clientNumber = oFF.XByteArray.create(null, oFF.DsrConstants.clientNumberLen);
			oFF.XByteArray.copy(netPassport, position, clientNumber, 0, oFF.DsrConstants.clientNumberLen);
			position = position + oFF.DsrConstants.clientNumberLen;
			systemType = oFF.DsrConvert.twoByte2Int(netPassport, position);
			position = position + oFF.DsrConstants.systemTypeLen;
			rootContextId = oFF.XByteArray.create(null, oFF.DsrConstants.rootContextLen);
			oFF.XByteArray.copy(netPassport, position, rootContextId, 0, oFF.DsrConstants.rootContextLen);
			position = position + oFF.DsrConstants.rootContextLen;
			connectionId = oFF.XByteArray.create(null, oFF.DsrConstants.connectionIdLen);
			oFF.XByteArray.copy(netPassport, position, connectionId, 0, oFF.DsrConstants.connectionIdLen);
			position = position + oFF.DsrConstants.connectionIdLen;
			connectionCounter = oFF.DsrConvert.fourByte2Int(netPassport, position);
			position = position + oFF.DsrConstants.connectionCounterLen;
			_varPartCount = oFF.DsrConvert.twoByte2Int(netPassport, position);
			position = position + oFF.DsrConstants.varPartCountLen;
			if (_varPartCount !== 0)
			{
				var varPartOffset = oFF.DsrConvert.twoByte2Int(netPassport, position);
				position = position + oFF.DsrConstants.varPartOffsetLen;
				if (varPartOffset === position)
				{
					var varPartLen = netPassport.size() - position - oFF.DsrConstants.eyeCatcher2Len;
					if (varPartLen > 0)
					{
						_varPart = oFF.XByteArray.create(null, varPartLen);
						oFF.XByteArray.copy(netPassport, position, _varPart, 0, varPartLen);
					}
				}
			}
		}
		newPassport.setVersion(version);
		newPassport.setTraceFlag(traceFlag);
		newPassport.setSystemId(oFF.XByteArray.convertToString(sysId));
		newPassport.setServiceType(service);
		newPassport.setUserId(oFF.XByteArray.convertToString(userId));
		newPassport.setAction(oFF.XByteArray.convertToString(action));
		newPassport.setActionType(actionType);
		newPassport.setPrevSystemId(oFF.XByteArray.convertToString(prevSysId));
		newPassport.setTransId(oFF.DsrConvert.byteArrayToHex(transId));
		newPassport.setClientNumber(oFF.XByteArray.convertToString(clientNumber));
		newPassport.setSystemType(systemType);
		newPassport.setRootContextId(oFF.DsrConvert.byteArrayToHex(rootContextId));
		newPassport.setConnectionId(oFF.DsrConvert.byteArrayToHex(connectionId));
		newPassport.setConnectionCounter(connectionCounter);
		if (oFF.notNull(_varPart) && _varPartCount !== 0)
		{
			oFF.DsrEncodeDecode.readVarItems(newPassport, _varPartCount, _varPart);
		}
		return newPassport;
	},
	getZeroTerminationIndex:function(myByteArray, dataLength, position)
	{
			var temp;
		for (temp = dataLength - 1; temp >= 0; temp--)
		{
			if (0 !== myByteArray.getByteAt(position + temp))
			{
				break;
			}
		}
		return temp + 1;
	},
	getBytesVarItems:function(pass)
	{
			var tempVar;
		var tempArr;
		var position = 0;
		var allBytes = oFF.XByteArray.create(null, pass.getVarItemsLength());
		var i;
		if (pass.getSystemVariablePartItems().size() > 0)
		{
			oFF.XByteArray.copy(oFF.DsrConstants.eyeCatcher, 0, allBytes, position, oFF.DsrConstants.eyeCatcher1Len);
			position = position + oFF.DsrConstants.eyeCatcher1Len;
			allBytes.setByteAt(position, 1);
			position = position + oFF.DsrConstants.versionLen;
			oFF.DsrConvert.int2TwoByte(pass.getSysVarItemsLength() + oFF.DsrConstants.VARIABLE_PART_HEADER_LENGTH, allBytes, position);
			position = position + oFF.DsrConstants.lenLen;
			if (pass.getApplicationVariablePartItems().size() > 0)
			{
				allBytes.setByteAt(position, 0);
			}
			else
			{
				allBytes.setByteAt(position, 1);
			}
			position = position + 1;
			oFF.DsrConvert.int2TwoByte(1, allBytes, position);
			position = position + oFF.DsrConstants.lenLen;
			oFF.DsrConvert.int2TwoByte(pass.getSystemVariablePartItems().size(), allBytes, position);
			position = position + oFF.DsrConstants.lenLen;
			for (i = 0; i < pass.getSystemVariablePartItems().size(); i++)
			{
				tempVar = pass.getSystemVariablePartItems().get(i);
				tempArr = tempVar.getByteArray();
				oFF.XByteArray.copy(tempArr, 0, allBytes, position, tempArr.size());
				position = position + tempArr.size();
			}
		}
		if (pass.getApplicationVariablePartItems().size() > 0)
		{
			oFF.XByteArray.copy(oFF.DsrConstants.eyeCatcher, 0, allBytes, position, oFF.DsrConstants.eyeCatcher1Len);
			position = position + oFF.DsrConstants.eyeCatcher1Len;
			allBytes.setByteAt(position, 1);
			position = position + oFF.DsrConstants.versionLen;
			oFF.DsrConvert.int2TwoByte(pass.getAppVarItemsLength() + oFF.DsrConstants.VARIABLE_PART_HEADER_LENGTH, allBytes, position);
			position = position + oFF.DsrConstants.lenLen;
			allBytes.setByteAt(position, 1);
			position = position + 1;
			oFF.DsrConvert.int2TwoByte(2, allBytes, position);
			position = position + oFF.DsrConstants.lenLen;
			oFF.DsrConvert.int2TwoByte(pass.getApplicationVariablePartItems().size(), allBytes, position);
			position = position + oFF.DsrConstants.lenLen;
			for (i = 0; i < pass.getApplicationVariablePartItems().size(); i++)
			{
				tempVar = pass.getApplicationVariablePartItems().get(i);
				tempArr = tempVar.getByteArray();
				oFF.XByteArray.copy(tempArr, 0, allBytes, position, tempArr.size());
				position = position + tempArr.size();
			}
		}
		return allBytes;
	},
	readVarItems:function(pass, number, bytes)
	{
			var position = 0;
		for (var i = 0; i < number; i++)
		{
			if (0 !== oFF.DsrEncodeDecode.arrayCmp(bytes, position, oFF.DsrConstants.eyeCatcher, 0, oFF.DsrConstants.eyeCatcher1Len))
			{
				throw oFF.XException.createRuntimeException("Parsing variable part of the passport faild. Eyecatcher is not correct!");
			}
			position = position + oFF.DsrConstants.eyeCatcher1Len;
			position = position + oFF.DsrConstants.versionLen;
			position = position + oFF.DsrConstants.lenLen;
			position = position + 1;
			var varPartID = oFF.DsrConvert.twoByte2Int(bytes, position);
			position = position + 2;
			var itemsCount = oFF.DsrConvert.twoByte2Int(bytes, position);
			position = position + 2;
			for (var j = 0; j < itemsCount; j++)
			{
				var applId = oFF.DsrConvert.twoByte2Int(bytes, position);
				position = position + 2;
				var applKey = oFF.DsrConvert.twoByte2Int(bytes, position);
				position = position + 2;
				var type = oFF.DsrConvert.oneByte2Int(bytes, position);
				position = position + 1;
				var lengthVar = oFF.DsrConvert.twoByte2Int(bytes, position);
				position = position + 2;
				var bValue = oFF.XByteArray.create(null, lengthVar - 7);
				oFF.XByteArray.copy(bytes, position, bValue, 0, lengthVar - 7);
				position = position + lengthVar - 7;
				if (type === oFF.DsrtApplVarPart.INTEGER_TYPE)
				{
					var iValue = oFF.DsrConvert.fourByte2Int(bValue, 0);
					if (varPartID === oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_SYSTEM)
					{
						pass.addSystemVarItemInteger(applId, applKey, iValue);
					}
					else
					{
						pass.addVarItemInteger(applId, applKey, iValue);
					}
				}
				else if (type === oFF.DsrtApplVarPart.STRING_TYPE)
				{
					if (varPartID === oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_SYSTEM)
					{
						pass.addSystemVarItemString(applId, applKey, oFF.XByteArray.convertToString(bValue));
					}
					else
					{
						pass.addVarItemString(applId, applKey, oFF.XByteArray.convertToString(bValue));
					}
				}
				else if (type === oFF.DsrtApplVarPart.GUID_TYPE)
				{
					if (varPartID === oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_SYSTEM)
					{
						pass.addSystemVarItemGUID(applId, applKey, bValue);
					}
					else
					{
						pass.addVarItemGUID(applId, applKey, bValue);
					}
				}
				else if (type === oFF.DsrtApplVarPart.BYTE_TYPE)
				{
					if (varPartID === oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_SYSTEM)
					{
						pass.addSystemVarItemBytes(applId, applKey, bValue);
					}
					else
					{
						pass.addVarItemBytes(applId, applKey, bValue);
					}
				}
			}
		}
	},
	arrayCmp:function(a1, startPositionA, a2, startPositionB, numberOfBytesToCompare)
	{
			for (var i = 0; i < numberOfBytesToCompare; i++)
		{
			if (a1.getByteAt(startPositionA + i) !== a2.getByteAt(startPositionB + i))
			{
				return a1.getByteAt(startPositionA + i) - a2.getByteAt(startPositionB + i);
			}
		}
		return 0;
	}
};

oFF.DsrPassportFactory = function() {};
oFF.DsrPassportFactory.prototype = new oFF.XObject();
oFF.DsrPassportFactory.prototype._ff_c = "DsrPassportFactory";

oFF.DsrPassportFactory.s_instance = null;
oFF.DsrPassportFactory.staticSetup = function()
{
	oFF.DsrPassportFactory.s_instance = new oFF.DsrPassportFactory();
};
oFF.DsrPassportFactory.createDsrPassport = function()
{
	return oFF.DsrPassportFactory.s_instance.newDsrPassport();
};
oFF.DsrPassportFactory.prototype.newDsrPassport = function()
{
	return oFF.DsrPassport.createDsrPassport();
};

oFF.ProgramContainerFactory = function() {};
oFF.ProgramContainerFactory.prototype = new oFF.XObject();
oFF.ProgramContainerFactory.prototype._ff_c = "ProgramContainerFactory";

oFF.ProgramContainerFactory.s_factory = null;
oFF.ProgramContainerFactory.staticSetup = function()
{
	oFF.ProgramContainerFactory.s_factory = oFF.XHashMapByString.create();
};
oFF.ProgramContainerFactory.create = function(outputDevice)
{
	var key = outputDevice.getName();
	var container = null;
	var factory = oFF.ProgramContainerFactory.s_factory.getByKey(key);
	if (oFF.notNull(factory))
	{
		container = factory.newProgramContainer(outputDevice);
	}
	return container;
};
oFF.ProgramContainerFactory.registerFactory = function(programDevice, driverFactory)
{
	oFF.ProgramContainerFactory.s_factory.put(programDevice.getName(), driverFactory);
};

oFF.ProgramMetadata = function() {};
oFF.ProgramMetadata.prototype = new oFF.XObject();
oFF.ProgramMetadata.prototype._ff_c = "ProgramMetadata";

oFF.ProgramMetadata.create = function(device)
{
	var newPrg = new oFF.ProgramMetadata();
	newPrg.setup();
	newPrg.m_argMetadata = oFF.XListOfNameObject.create();
	return newPrg;
};
oFF.ProgramMetadata.prototype.m_device = null;
oFF.ProgramMetadata.prototype.m_argMetadata = null;
oFF.ProgramMetadata.prototype.getArgDefinitions = function()
{
	return this.m_argMetadata;
};
oFF.ProgramMetadata.prototype.getArgDefinitionsList = function()
{
	return this.m_argMetadata;
};
oFF.ProgramMetadata.prototype.addOption = function(name, text, values, valueType)
{
	var theValues = values;
	if (oFF.XStringUtils.isNullOrEmpty(values) && valueType === oFF.XValueType.BOOLEAN)
	{
		theValues = "true|false";
	}
	var newObj = oFF.ProgramArgDef.createOption(name, text, theValues, valueType, false);
	this.m_argMetadata.add(newObj);
	return newObj;
};
oFF.ProgramMetadata.prototype.addMandatoryOption = function(name, text, values, valueType)
{
	var theValues = values;
	if (oFF.XStringUtils.isNullOrEmpty(values) && valueType === oFF.XValueType.BOOLEAN)
	{
		theValues = "true|false";
	}
	var newObj = oFF.ProgramArgDef.createOption(name, text, theValues, valueType, true);
	this.m_argMetadata.add(newObj);
	return newObj;
};
oFF.ProgramMetadata.prototype.addParameter = function(name, text)
{
	var newObj = oFF.ProgramArgDef.createStringParameter(name, text);
	this.m_argMetadata.add(newObj);
	return newObj;
};
oFF.ProgramMetadata.prototype.addParameterList = function(name, text)
{
	var newObj = oFF.ProgramArgDef.createStringArrayParameter(name, text);
	this.m_argMetadata.add(newObj);
	return newObj;
};
oFF.ProgramMetadata.prototype.getStartupDevice = function()
{
	return this.m_device;
};
oFF.ProgramMetadata.prototype.setStartupDevice = function(device)
{
	this.m_device = device;
};

oFF.ProgramRegistration = {

	s_manifests:null,
	staticSetup:function()
	{
			oFF.ProgramRegistration.s_manifests = oFF.XLinkedHashMapByString.create();
	},
	setProgramFactory:function(name, programFactory)
	{
			var manifest = oFF.ProgramRegistration.s_manifests.getByKey(name);
		if (oFF.isNull(manifest))
		{
			oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.create(name, programFactory));
		}
		else
		{
			manifest.setFactory(programFactory);
		}
	},
	setProgramManifest:function(programManifest)
	{
			var name = programManifest.getName();
		oFF.ProgramRegistration.s_manifests.put(name, programManifest);
	},
	getProgramFactory:function(name)
	{
			var manifest = oFF.ProgramRegistration.s_manifests.getByKey(name);
		if (oFF.notNull(manifest))
		{
			return manifest.getFactory();
		}
		else
		{
			return null;
		}
	},
	getProgramManifest:function(name)
	{
			var manifest = oFF.ProgramRegistration.s_manifests.getByKey(name);
		return manifest;
	},
	getAllEntries:function()
	{
			var map = oFF.XHashMapByString.create();
		var iterator = oFF.ProgramRegistration.s_manifests.getIterator();
		while (iterator.hasNext())
		{
			var manifest = iterator.next();
			map.put(manifest.getName(), manifest);
		}
		return map;
	},
	getOrderedAllEntries:function()
	{
			return oFF.ProgramRegistration.s_manifests.getValuesAsReadOnlyList();
	}
};

oFF.ProgramResources = {

	staticSetup:function()
	{
			oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("testHelloWorld", "{\"Class\":\"com.oFF.test.process.timer.prg.TestHelloWorldPrg\",\"Description\":\"Hello world program\",\"Device\":\"Console\",\"DisplayName\":\"Analyze Business Data\",\"Modules\":[\"ff0290.io.tests\"],\"Name\":\"testHelloWorld\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("@SubSys.BootstrapLandscape", "{\"Author\":\"Marco Pesarese\",\"Class\":\"com.oFF.runtime.net.sys.impl.SubSysLandscapeBootstrapPrg\",\"Description\":\"Bootstrap Landscape SubSystem\",\"Device\":\"None\",\"DisplayName\":\"Bootstrap Landscape SubSystem\",\"Modules\":[\"ff1040.kernel.native\"],\"Name\":\"@SubSys.BootstrapLandscape\",\"Type\":\"SubSystem\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("@SubSys.Cache", "{\"Author\":\"Marco Pesarese\",\"Class\":\"com.oFF.kernel.cache.impl.SubSysCachePrg\",\"Description\":\"Cache SubSystem\",\"Device\":\"None\",\"DisplayName\":\"Cache SubSystem\",\"Modules\":[\"ff1040.kernel.native\"],\"Name\":\"@SubSys.Cache\",\"Type\":\"SubSystem\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("@SubSys.SystemLandscape", "{\"Author\":\"Marco Pesarese\",\"Class\":\"com.oFF.runtime.net.sys.impl.SubSysSystemLandscapePrg\",\"Description\":\"System Landscape SubSystem\",\"Device\":\"None\",\"DisplayName\":\"System Landscape SubSystem\",\"Modules\":[\"ff1040.kernel.native\"],\"Name\":\"@SubSys.SystemLandscape\",\"Type\":\"SubSystem\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("@SubSys.UserProfile", "{\"Author\":\"Marco Pesarese\",\"Class\":\"com.oFF.runtime.usermanager.impl.SubSysUserProfilePrg\",\"Description\":\"User Profile SubSystem\",\"Device\":\"None\",\"DisplayName\":\"User Profile SubSystem\",\"Modules\":[\"ff1030.kernel.impl\"],\"Name\":\"@SubSys.UserProfile\",\"Type\":\"SubSystem\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("cache", "{\"Class\":\"com.oFF.process.shell.ShellCache\",\"Description\":\"Shell cache program\",\"Device\":\"Console\",\"Modules\":[\"ff2040.shell\"],\"Name\":\"cache\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("cd", "{\"Class\":\"com.oFF.process.shell.ShellCd\",\"Description\":\"Shell cd program\",\"Device\":\"Console\",\"Modules\":[\"ff2040.shell\"],\"Name\":\"cd\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("del", "{\"Class\":\"com.oFF.process.shell.ShellDel\",\"Description\":\"Shell del program\",\"Device\":\"Console\",\"Modules\":[\"ff2040.shell\"],\"Name\":\"del\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("dir", "{\"Class\":\"com.oFF.process.shell.ShellDir\",\"Description\":\"Shell dir program\",\"Device\":\"Console\",\"Modules\":[\"ff2040.shell\"],\"Name\":\"dir\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("grep", "{\"Class\":\"com.oFF.process.shell.ShellGrep\",\"Description\":\"Shell grep program\",\"Device\":\"Console\",\"Modules\":[\"ff2040.shell\"],\"Name\":\"grep\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("help", "{\"Class\":\"com.oFF.process.shell.ShellHelp\",\"Description\":\"Helper Program\",\"Device\":\"Console\",\"DisplayName\":\"Helper Program\",\"Modules\":[\"ff2040.shell\"],\"Name\":\"help\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("kill", "{\"Author\":\"Marco Pesarese\",\"Class\":\"com.oFF.process.shell.ShellKill\",\"Description\":\"Shell program to kill a process\",\"Device\":\"Console\",\"Modules\":[\"ff2040.shell\"],\"Name\":\"kill\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("listprgs", "{\"Class\":\"com.oFF.process.shell.ShellListPrgs\",\"Description\":\"Shell list programs\",\"Device\":\"Console\",\"Modules\":[\"ff2040.shell\"],\"Name\":\"listprgs\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("mkdir", "{\"Class\":\"com.oFF.process.shell.ShellMkdir\",\"Description\":\"Shell make directory program\",\"Device\":\"Console\",\"Modules\":[\"ff2040.shell\"],\"Name\":\"mkdir\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("proc", "{\"Author\":\"Marco Pesarese\",\"Class\":\"com.oFF.process.shell.ShellProcesses\",\"Description\":\"Shell program to show all processes\",\"Device\":\"Console\",\"Modules\":[\"ff2040.shell\"],\"Name\":\"proc\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("rmdir", "{\"Class\":\"com.oFF.process.shell.ShellRmdir\",\"Description\":\"Shell remove directory program\",\"Device\":\"Console\",\"Modules\":[\"ff2040.shell\"],\"Name\":\"rmdir\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("set", "{\"Class\":\"com.oFF.process.shell.ShellSet\",\"Description\":\"Shell set program\",\"Device\":\"Console\",\"Modules\":[\"ff2040.shell\"],\"Name\":\"set\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("shell", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Marco Pesarese\",\"Category\":\"Shell\",\"Class\":\"com.oFF.process.shell.SerenityShell\",\"Description\":\"Firefly command line utility\",\"Device\":\"Console\",\"DisplayName\":\"Shell\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/shell.png\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":true,\"Modules\":[\"ff2040.shell\",\"ff2210.ui.native\",\"ff2220.ui.program\"],\"Name\":\"shell\",\"SubSystems\":[\"Gui\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("takeOver", "{\"Class\":\"com.oFF.process.shell.ShellTakeOver\",\"Description\":\"Take over the control\",\"Device\":\"Console\",\"Modules\":[\"ff2040.shell\"],\"Name\":\"takeOver\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("wget", "{\"Class\":\"com.oFF.process.shell.ShellWget\",\"Description\":\"Shell wget program\",\"Device\":\"Console\",\"Modules\":[\"ff2040.shell\"],\"Name\":\"wget\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("whoami", "{\"Class\":\"com.oFF.process.shell.ShellWhoami\",\"Description\":\"Shell whoami program\",\"Device\":\"Console\",\"Modules\":[\"ff2040.shell\"],\"Name\":\"whoami\",\"SubSystems\":[\"UserProfile\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("DragonflyAppProgram", "{\"AppStore\":false,\"Args\":\"\",\"Author\":\"Marco Pesarese\",\"Category\":\"System\",\"Class\":\"com.oFF.runtime.program.impl.DragonflyAppProgram\",\"Description\":\"DragonflyAppProgram\",\"Device\":\"None\",\"DisplayName\":\"DragonflyAppProgram\",\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff2100.runtime\"],\"Name\":\"DragonflyAppProgram\",\"SubSystems\":[\"Cache\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("OrcaAppProgram", "{\"AppStore\":false,\"Args\":\"\",\"Author\":\"Marco Pesarese\",\"Category\":\"System\",\"Class\":\"com.oFF.runtime.program.impl.OrcaAppProgram\",\"Description\":\"Orca Program\",\"Device\":\"None\",\"DisplayName\":\"Orca Program\",\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff2100.runtime\"],\"Name\":\"OrcaAppProgram\",\"SubSystems\":[\"SystemLandscape\",\"Cache\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("StandardAppProgram", "{\"AppStore\":false,\"Args\":\"\",\"Author\":\"Marco Pesarese\",\"Category\":\"System\",\"Class\":\"com.oFF.runtime.program.impl.StandardAppProgram\",\"Description\":\"StandardAppProgram\",\"Device\":\"None\",\"DisplayName\":\"File StandardAppProgram\",\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff2100.runtime\"],\"Name\":\"StandardAppProgram\",\"SubSystems\":[\"SystemLandscape\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("SrvFileTestHelloWorld", "{\"Class\":\"com.oFF.test.runtime.file.SrvFileTestHelloWorld\",\"Description\":\"SrvFileTestHelloWorld\",\"Modules\":[\"ff2190.runtime.tests\"],\"Name\":\"SrvFileTestHelloWorld\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("testrunner", "{\"Class\":\"com.oFF.test.framework.runner.TestRunnerWithVariants\",\"Description\":\"Testrunner\",\"Modules\":[\"ff2190.runtime.tests\",\"ff4920.olap.impl.tests\"],\"Name\":\"testrunner\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("@SubSys.Gui", "{\"Author\":\"Marco Pesarese\",\"Class\":\"com.oFF.ui.impl.SubSysGuiPrg\",\"Description\":\"GUI SubSystem\",\"Device\":\"None\",\"DisplayName\":\"GUI SubSystem\",\"Modules\":[\"ff2200.ui\",\"ff2210.ui.native\"],\"Name\":\"@SubSys.Gui\",\"Type\":\"SubSystem\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("SphereClient", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Marcin Paskuda\",\"Category\":\"System\",\"Class\":\"com.oFF.ui.remote.client.SphereClient\",\"Description\":\"Remote Ui client\",\"Device\":\"Window\",\"DisplayName\":\"Sphere Client\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/sphereclient.png\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":true,\"Modules\":[\"ff2230.ui.remote\"],\"Name\":\"SphereClient\",\"SubSystems\":[\"Gui\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("@SubSys.Gui.Server", "{\"Author\":\"Marcin Paskuda\",\"Class\":\"com.oFF.ui.remote.server.SubSysGuiServerPrg\",\"Description\":\"Virtual Server GUI SubSystem\",\"Device\":\"None\",\"DisplayName\":\"Server GUI SubSystem\",\"Modules\":[\"ff2200.ui\",\"ff2230.ui.remote\"],\"Name\":\"@SubSys.Gui.Server\",\"Type\":\"SubSystem\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyButtonApp", "{\"Class\":\"com.oFF.test.ui.apps.MyButtonApp\",\"Description\":\"MyButtonApp\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyButtonApp\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyButtonVariantsApp", "{\"Class\":\"com.oFF.test.ui.apps.MyButtonVariantsApp\",\"Description\":\"MyButtonVariantsApp\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyButtonVariantsApp\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyCheckboxApp", "{\"Class\":\"com.oFF.test.ui.apps.MyCheckboxApp\",\"Description\":\"MyCheckboxApp\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyCheckboxApp\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyClipboardPasteApp", "{\"Class\":\"com.oFF.test.ui.apps.MyClipboardPasteApp\",\"Description\":\"MyClipboardPasteApp\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyClipboardPasteApp\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyContextMenu2App", "{\"Class\":\"com.oFF.test.ui.apps.MyContextMenu2App\",\"Description\":\"MyContextMenu2App\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyContextMenu2App\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyContextMenu3App", "{\"Class\":\"com.oFF.test.ui.apps.MyContextMenu3App\",\"Description\":\"MyContextMenu3App\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyContextMenu3App\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyContextMenuApp", "{\"Class\":\"com.oFF.test.ui.apps.MyContextMenuApp\",\"Description\":\"MyContextMenuApp\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyContextMenuApp\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyDeviceInfoApp", "{\"Class\":\"com.oFF.test.ui.apps.MyDeviceInfoApp\",\"Description\":\"MyDeviceInfoApp\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyDeviceInfoApp\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyDialogApp", "{\"Class\":\"com.oFF.test.ui.apps.MyDialogApp\",\"Description\":\"MyDialogApp\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyDialogApp\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyDropDownApp", "{\"Class\":\"com.oFF.test.ui.apps.MyDropDownApp\",\"Description\":\"MyDropDownApp\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyDropDownApp\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyFancyButtonApp", "{\"Class\":\"com.oFF.test.ui.apps.MyFancyButtonApp\",\"Description\":\"MyFancyButtonApp\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyFancyButtonApp\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyIconTabBarApp", "{\"Class\":\"com.oFF.test.ui.apps.MyIconTabBarApp\",\"Description\":\"MyIconTabBarApp\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyIconTabBarApp\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyKitchenSinkApp", "{\"Class\":\"com.oFF.test.ui.apps.MyKitchenSinkApp\",\"Description\":\"MyKitchenSinkApp\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyKitchenSinkApp\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyKitchenSinkApp2", "{\"Class\":\"com.oFF.test.ui.apps.MyKitchenSinkApp2\",\"Description\":\"MyKitchenSinkApp2\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyKitchenSinkApp2\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyListBoxApp", "{\"Class\":\"com.oFF.test.ui.apps.MyListBoxApp\",\"Description\":\"MyListBoxApp\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyListBoxApp\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyMatrixLayoutApp", "{\"Class\":\"com.oFF.test.ui.apps.MyMatrixLayoutApp\",\"Description\":\"MyMatrixLayoutApp\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyMatrixLayoutApp\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyMenuApp", "{\"Class\":\"com.oFF.test.ui.apps.MyMenuApp\",\"Description\":\"MyMenuApp\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyMenuApp\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyNavigationContainerTestApp", "{\"Class\":\"com.oFF.test.ui.apps.MyNavigationContainerTestApp\",\"Description\":\"MyNavigationContainerTestApp\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyNavigationContainerTestApp\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyResponsiveTableApp", "{\"Class\":\"com.oFF.test.ui.apps.MyResponsiveTableApp\",\"Description\":\"MyResponsiveTableApp\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyResponsiveTableApp\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyTableApp", "{\"Class\":\"com.oFF.test.ui.apps.MyTableApp\",\"Description\":\"MyTableApp\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyTableApp\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyToolbarApp", "{\"Class\":\"com.oFF.test.ui.apps.MyToolbarApp\",\"Description\":\"MyToolbarApp\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyToolbarApp\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyTreeApp", "{\"Class\":\"com.oFF.test.ui.apps.MyTreeApp\",\"Description\":\"MyTreeApp\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyTreeApp\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyTreeTableApp", "{\"Class\":\"com.oFF.test.ui.apps.MyTreeTableApp\",\"Description\":\"MyTreeTableApp\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyTreeTableApp\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MyVSplitterMinMaxApp", "{\"Class\":\"com.oFF.test.ui.apps.MyVerticalSplitterApp\",\"Description\":\"MyVSplitterMinMaxApp\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"MyVSplitterMinMaxApp\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppActivityIndicator", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppActivityIndicator\",\"Description\":\"TestAppActivityIndicator\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppActivityIndicator\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppActivityIndicatorProperties", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppActivityIndicatorProperties\",\"Description\":\"TestAppActivityIndicatorProperties\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppActivityIndicatorProperties\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppButton", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppButton\",\"Description\":\"TestAppButton\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppButton\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppButtonEvents", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppButtonEvents\",\"Description\":\"TestAppButtonEvents\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppButtonEvents\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppButtonProperties", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppButtonProperties\",\"Description\":\"TestAppButtonProperties\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppButtonProperties\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppCheckbox", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppCheckbox\",\"Description\":\"TestAppCheckbox\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppCheckbox\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppCheckboxEvents", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppCheckboxEvents\",\"Description\":\"TestAppCheckboxEvents\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppCheckboxEvents\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppCheckboxProperties", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppCheckboxProperties\",\"Description\":\"TestAppCheckboxProperties\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppCheckboxProperties\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppComboBox", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppComboBox\",\"Description\":\"TestAppComboBox\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppComboBox\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppComboBoxEvents", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppComboBoxEvents\",\"Description\":\"TestAppComboBoxEvents\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppComboBoxEvents\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppComboBoxProperties", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppComboBoxProperties\",\"Description\":\"TestAppComboBoxProperties\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppComboBoxProperties\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppDatePicker", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppDatePicker\",\"Description\":\"TestAppDatePicker\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppDatePicker\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppDatePickerEvents", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppDatePickerEvents\",\"Description\":\"TestAppDatePickerEvents\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppDatePickerEvents\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppDatePickerProperties", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppDatePickerProperties\",\"Description\":\"TestAppDatePickerProperties\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppDatePickerProperties\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppDateTimePicker", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppDateTimePicker\",\"Description\":\"TestAppDateTimePicker\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppDateTimePicker\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppDateTimePickerEvents", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppDateTimePickerEvents\",\"Description\":\"TestAppDateTimePickerEvents\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppDateTimePickerEvents\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppDialog", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppDialog\",\"Description\":\"TestAppDialog\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppDialog\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppDropDown", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppDropDown\",\"Description\":\"TestAppDropDown\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppDropDown\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppDropDownEvents", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppDropDownEvents\",\"Description\":\"TestAppDropDownEvents\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppDropDownEvents\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppDropDownProperties", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppDropDownProperties\",\"Description\":\"TestAppDropDownProperties\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppDropDownProperties\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppHorizontalLayout", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppHorizontalLayout\",\"Description\":\"TestAppHorizontalLayout\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppHorizontalLayout\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppIconTabBar", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppIconTabBar\",\"Description\":\"TestAppIconTabBar\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppIconTabBar\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppIconTabBarEvents", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppIconTabBarEvents\",\"Description\":\"TestAppIconTabBarEvents\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppIconTabBarEvents\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppIconTabBarProperties", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppIconTabBarProperties\",\"Description\":\"TestAppIconTabBarProperties\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppIconTabBarProperties\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppImage", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppImage\",\"Description\":\"TestAppImage\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppImage\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppImageProperties", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppImageProperties\",\"Description\":\"TestAppImageProperties\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppImageProperties\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppInput", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppInput\",\"Description\":\"TestAppInput\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppInput\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppInputEvents", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppInputEvents\",\"Description\":\"TestAppInputEvents\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppInputEvents\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppInputProperties", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppInputProperties\",\"Description\":\"TestAppInputProperties\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppInputProperties\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppLabel", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppLabel\",\"Description\":\"TestAppLabel\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppLabel\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppLabelProperties", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppLabelProperties\",\"Description\":\"TestAppLabelProperties\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppLabelProperties\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppLaunchpad", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppLaunchpad\",\"Description\":\"TestAppLaunchpad\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppLaunchpad\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppList", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppList\",\"Description\":\"TestAppList\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppList\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppListEvents", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppListEvents\",\"Description\":\"TestAppListEvents\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppListEvents\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppListProperties", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppListProperties\",\"Description\":\"TestAppListProperties\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppListProperties\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppMatrixLayout", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppMatrixLayout\",\"Description\":\"TestAppMatrixLayout\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppMatrixLayout\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppNavigationContainerInDialog", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppNavigationContainerInDialog\",\"Description\":\"TestAppNavigationContainerInDialog\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppNavigationContainerInDialog\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppNavigationContainerTwoPath", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppNavigationContainerTwoPath\",\"Description\":\"TestAppNavigationContainerTwoPath\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppNavigationContainerTwoPath\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppPopover", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppPopover\",\"Description\":\"TestAppPopover\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppPopover\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppSlider", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppSlider\",\"Description\":\"TestAppSlider\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppSlider\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppSliderEvents", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppSliderEvents\",\"Description\":\"TestAppSliderEvents\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppSliderEvents\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppSliderProperties", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppSliderProperties\",\"Description\":\"TestAppSliderProperties\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppSliderProperties\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppSpacer", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppSpacer\",\"Description\":\"TestAppSpacer\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppSpacer\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppTerminal", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppTerminal\",\"Description\":\"TestAppTerminal\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppTerminal\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppText", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppText\",\"Description\":\"TestAppText\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppText\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppTextArea", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppTextArea\",\"Description\":\"TestAppTextArea\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppTextArea\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppTextAreaEvents", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppTextAreaEvents\",\"Description\":\"TestAppTextAreaEvents\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppTextAreaEvents\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppTextAreaProperties", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppTextAreaProperties\",\"Description\":\"TestAppTextAreaProperties\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppTextAreaProperties\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppTextProperties", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppTextProperties\",\"Description\":\"TestAppTextProperties\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppTextProperties\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppTimePicker", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppTimePicker\",\"Description\":\"TestAppTimePicker\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppTimePicker\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppTimePickerEvents", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppTimePickerEvents\",\"Description\":\"TestAppTimePickerEvents\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppTimePickerEvents\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppToast", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppToast\",\"Description\":\"TestAppToast\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppToast\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppTree", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppTree\",\"Description\":\"TestAppTree\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppTree\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppTreeEvents", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppTreeEvents\",\"Description\":\"TestAppTreeEvents\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppTreeEvents\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppTreeProperties", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppTreeProperties\",\"Description\":\"TestAppTreeProperties\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppTreeProperties\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppVerticalLayout", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppVerticalLayout\",\"Description\":\"TestAppVerticalLayout\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppVerticalLayout\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("TestAppWindow", "{\"Class\":\"com.oFF.test.ui.apps.controls.TestAppWindow\",\"Description\":\"TestAppWindow\",\"Device\":\"Window\",\"Modules\":[\"ff2290.ui.tests\"],\"Name\":\"TestAppWindow\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("Apollo", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Marcin Paskuda\",\"Category\":\"System\",\"Class\":\"com.oFF.programs.fileexplorer.FeApollo\",\"Description\":\"Firefly file explorer\",\"Device\":\"Window\",\"DisplayName\":\"File Explorer\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/fileexplorer.png\",\"InitialContainerFrame\":{\"Height\":\"60vh\",\"Maximized\":false,\"Width\":\"60vw\",\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":true,\"Modules\":[\"ff3100.system.ui\"],\"Name\":\"Apollo\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("Athena", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Marcin Paskuda\",\"Category\":\"System\",\"Class\":\"com.oFF.programs.texteditor.TeAthena\",\"Description\":\"Simple text editor\",\"Device\":\"Window\",\"DisplayName\":\"Text Editor\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/athenaeditor.png\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":true,\"Modules\":[\"ff3100.system.ui\"],\"Name\":\"Athena\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("CalendarDialog", "{\"AppStore\":false,\"Args\":\"\",\"Author\":\"Luis Teixeira\",\"Category\":\"System\",\"Class\":\"com.oFF.dialogs.calendar.SuCalendarDialog\",\"Description\":\"Firefly custom calendar dialog\",\"Device\":\"Dialog\",\"DisplayName\":\"Calendar\",\"IconPath\":\"\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff3100.system.ui\"],\"Name\":\"CalendarDialog\",\"SubSystems\":[\"Gui\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("Chronos", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Alexander Daum\",\"Category\":\"System\",\"Class\":\"com.oFF.programs.chronos.chronos\",\"Description\":\"Chronos Calendar Dialog test\",\"Device\":\"Window\",\"DisplayName\":\"Chronos\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/chronos.png\",\"InitialContainerFrame\":{\"Height\":\"70%\",\"Maximized\":false,\"Width\":\"70%\",\"X\":null,\"Y\":null},\"InitialTitle\":\"Chronos Calendar Dialog test\",\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff3100.system.ui\"],\"Name\":\"Chronos\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("ConnectionTestDialog", "{\"AppStore\":false,\"Args\":\"\",\"Author\":\"Marcin Paskuda\",\"Category\":\"System\",\"Class\":\"com.oFF.dialogs.connectiontest.SuConnectionTestDialog\",\"Description\":\"Allows to test a connection to a specific system\",\"Device\":\"Dialog\",\"DisplayName\":\"Connection Test\",\"IconPath\":\"\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff3100.system.ui\"],\"Name\":\"ConnectionTestDialog\",\"SubSystems\":[\"SystemLandscape\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("Corona", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Marcin Paskuda\",\"Category\":\"Misc\",\"Class\":\"com.oFF.programs.corona.CoronaInfo\",\"Description\":\"Show current corona numbers\",\"Device\":\"Window\",\"DisplayName\":\"Corona\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/coronavirus.png\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff3100.system.ui\"],\"Name\":\"Corona\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("DialogTestProgram", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Marcin Paskuda\",\"Category\":\"System\",\"Class\":\"com.oFF.dialogs.dialogtestprogram\",\"Description\":\"A dialog test program using a dialog program container\",\"Device\":\"Dialog\",\"DisplayName\":\"Dialog Test Program\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/dialogtestprg.png\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff3100.system.ui\"],\"Name\":\"DialogTestProgram\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("Doom1", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Marcin Paskuda\",\"Category\":\"System\",\"Class\":\"com.oFF.programs.doom1.WasmDoom1\",\"Description\":\"WebAssembly port of Doom classic\",\"Device\":\"Window\",\"DisplayName\":\"Doom 1\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/doom1.png\",\"InitialContainerFrame\":{\"Height\":\"60vh\",\"Maximized\":false,\"Width\":\"60vw\",\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff3100.system.ui\"],\"Name\":\"Doom1\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("JavadocDialog", "{\"AppStore\":false,\"Args\":\"\",\"Author\":\"Marcin Paskuda\",\"Category\":\"System\",\"Class\":\"com.oFF.dialogs.javadoc.SuJavadocDialog\",\"Description\":\"Display the firefly Javadoc\",\"Device\":\"Dialog\",\"DisplayName\":\"Firefly Javadoc\",\"IconPath\":\"\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff3100.system.ui\"],\"Name\":\"JavadocDialog\",\"SubSystems\":[]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("Metis", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Marcin Paskuda\",\"Category\":\"System\",\"Class\":\"com.oFF.programs.systemlandscapeeditor.SleMetis\",\"Description\":\"Firefly system landscape editor\",\"Device\":\"Window\",\"DisplayName\":\"System Landscape Editor\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/metiseditor.png\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":true,\"Modules\":[\"ff3100.system.ui\"],\"Name\":\"Metis\",\"SubSystems\":[\"SystemLandscape\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("UserProfileDialog", "{\"AppStore\":false,\"Args\":\"\",\"Author\":\"Damian Hillebrand\",\"Category\":\"System\",\"Class\":\"com.oFF.dialogs.userprofile.SuUserProfileDialog\",\"Description\":\"User Profile for current user profile settings\",\"Device\":\"Dialog\",\"DisplayName\":\"User Profile\",\"IconPath\":\"\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff3100.system.ui\"],\"Name\":\"UserProfileDialog\",\"SubSystems\":[\"UserProfile\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("Vulcan", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Marcin Paskuda\",\"Category\":\"System\",\"Class\":\"com.oFF.programs.fireflyuitoolkit.FutVulcan\",\"Description\":\"Displays all the available firefly ui controls\",\"Device\":\"Window\",\"DisplayName\":\"Firefly Ui Toolkit\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/fireflyuitoolkit.png\",\"InitialContainerFrame\":{\"Height\":\"60vh\",\"Maximized\":false,\"Width\":\"60vw\",\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff3100.system.ui\"],\"Name\":\"Vulcan\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("olapdata", "{\"AppStore\":false,\"Args\":\"\",\"Author\":\"Marco Pesarese\",\"Class\":\"com.oFF.olap.prg.OlapDataPrg\",\"Description\":\"Simple olap sata plotter\",\"Device\":\"Console\",\"DisplayName\":\"Olap Data\",\"Modules\":[\"ff4340.olap.reference\",\"ff4400.olap.providers\"],\"Name\":\"olapdata\",\"SubSystems\":[\"SystemLandscape\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("sqlap", "{\"Class\":\"com.oFF.olap.engine.apps.ShellSqlOlap\",\"Description\":\"WIP sql olap processor cli for the firefly Terminal\",\"Modules\":[\"ff4500.olap.engine\"],\"Name\":\"sqlap\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("storyconverter", "{\"Class\":\"com.oFF.story.utils.OcQStoryConvProgram\",\"Description\":\"storyconverter\",\"Modules\":[\"ff5500.story\"],\"Name\":\"storyconverter\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("Quasar", "{\"AppStore\":false,\"Args\":\"\",\"Author\":\"Marcin Paskuda\",\"Category\":\"Quasar\",\"Class\":\"com.oFF.quasar.QuasarProgram\",\"Description\":\"Quasar document renderer\",\"Device\":\"Window\",\"DisplayName\":\"Quasar\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/quasar.png\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"Modules\":[\"ff4330.olap.catalog.impl\",\"ff4340.olap.reference\",\"ff4400.olap.providers\",\"ff4410.olap.ip.providers\",\"ff8000.quasar\",\"ff8010.olap.ui\"],\"Name\":\"Quasar\",\"SubSystems\":[\"SystemLandscape\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("DimensionDialog", "{\"AppStore\":false,\"Args\":\"\",\"Author\":\"Andreas Ratzka\",\"Category\":\"Olap\",\"Class\":\"com.oFF.dialogs.dimensiondialog.OuDimensionDialog\",\"Description\":\"Dialog for setting the properties of a dimension aka characteristic\",\"Device\":\"Dialog\",\"DisplayName\":\"Dimension Dialog\",\"IconPath\":\"\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff4340.olap.reference\",\"ff4400.olap.providers\",\"ff4410.olap.ip.providers\",\"ff8010.olap.ui\"],\"Name\":\"DimensionDialog\",\"SubSystems\":[\"Gui\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("DimensionDialogExt", "{\"AppStore\":false,\"Args\":\"\",\"Author\":\"Andreas Ratzka\",\"Category\":\"Olap\",\"Class\":\"com.oFF.dialogs.dimensiondialog.OuDimensionDialogExt\",\"Description\":\"Dialog for setting the properties of a dimension aka characteristic\",\"Device\":\"Dialog\",\"DisplayName\":\"Dimension Dialog\",\"IconPath\":\"\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff4340.olap.reference\",\"ff4400.olap.providers\",\"ff4410.olap.ip.providers\",\"ff8010.olap.ui\"],\"Name\":\"DimensionDialogExt\",\"SubSystems\":[\"Gui\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("Dialog_Condition", "{\"AppStore\":false,\"Args\":\"\",\"Author\":\"Michelle Braun\",\"Category\":\"Olap\",\"Class\":\"com.oFF.dialogs.conditions.dialog.OuDialogCondition\",\"Description\":\"Condition\",\"Device\":\"Dialog\",\"DisplayName\":\"Condition Dialog\",\"IconPath\":\"\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff4340.olap.reference\",\"ff4400.olap.providers\",\"ff4410.olap.ip.providers\",\"ff8010.olap.ui\"],\"Name\":\"Dialog_Condition\",\"SubSystems\":[\"Gui\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("Dialog_Conditions", "{\"AppStore\":false,\"Args\":\"\",\"Author\":\"Michelle Braun\",\"Category\":\"Olap\",\"Class\":\"com.oFF.dialogs.conditions.dialog.OuDialogConditions\",\"Description\":\"Conditions\",\"Device\":\"Dialog\",\"DisplayName\":\"Conditions Dialog\",\"IconPath\":\"\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff4340.olap.reference\",\"ff4400.olap.providers\",\"ff4410.olap.ip.providers\",\"ff8010.olap.ui\"],\"Name\":\"Dialog_Conditions\",\"SubSystems\":[\"Gui\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("AnalyticCards", "{\"Class\":\"com.oFF.programs.analyticcards.AnalyticCardsProgram\",\"Description\":\"AnalyticCards\",\"Device\":\"Console\",\"Modules\":[\"ff2230.ui.remote\",\"ff4330.olap.catalog.impl\",\"ff4340.olap.reference\",\"ff4390.olap.helpers\",\"ff4400.olap.providers\",\"ff4410.olap.ip.providers\",\"ff8050.application.ui\"],\"Name\":\"AnalyticCards\",\"SubSystems\":[\"SystemLandscape\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("Atlas", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Marcin Paskuda\",\"Category\":\"SAC\",\"Class\":\"com.oFF.programs.storyconnector.ScAtlas\",\"Description\":\"SAC Story and Widget renderer\",\"Device\":\"Window\",\"DisplayName\":\"SAC Story Connector\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/atlasstoryconnector.png\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff4330.olap.catalog.impl\",\"ff4340.olap.reference\",\"ff4390.olap.helpers\",\"ff4400.olap.providers\",\"ff4410.olap.ip.providers\",\"ff8050.application.ui\"],\"Name\":\"Atlas\",\"SubSystems\":[\"SystemLandscape\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("DatasourcePicker", "{\"AppStore\":false,\"Args\":\"\",\"Author\":\"Alexander Daum\",\"Category\":\"Olap\",\"Class\":\"com.oFF.dialogs.datasourcePicker.AuDatasourcePicker\",\"Description\":\"Picks a datasource\",\"Device\":\"Dialog\",\"DisplayName\":\"Data Source Picker\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/datasourcePicker.png\",\"InitialContainerFrame\":{\"Height\":\"650px\",\"Maximized\":false,\"Width\":\"1000px\",\"X\":null,\"Y\":null},\"InitialTitle\":\"Data Source Picker\",\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff4330.olap.catalog.impl\",\"ff4400.olap.providers\",\"ff4410.olap.ip.providers\",\"ff8050.application.ui\"],\"Name\":\"DatasourcePicker\",\"SubSystems\":[\"SystemLandscape\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("FilterDialog", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Markus Weber\",\"Category\":\"Olap\",\"Class\":\"com.oFF.programs.filterdialog.FilterDialogProgram\",\"Description\":\"Filter dialog testsuite\",\"Device\":\"Window\",\"DisplayName\":\"Filter Dialog\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/filterDialog.png\",\"InitialContainerFrame\":{\"Height\":\"70%\",\"Maximized\":false,\"Width\":\"70%\",\"X\":null,\"Y\":null},\"InitialTitle\":\"Filter dialog test app\",\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff4330.olap.catalog.impl\",\"ff4340.olap.reference\",\"ff4400.olap.providers\",\"ff4410.olap.ip.providers\",\"ff8050.application.ui\"],\"Name\":\"FilterDialog\",\"SubSystems\":[\"SystemLandscape\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("FirstAidTest", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Alexander Daum\",\"Category\":\"Olap\",\"Class\":\"com.oFF.programs.supportplatform.FirstAidTestProgram\",\"Description\":\"Testsuite for FirstAid\",\"Device\":\"Window\",\"DisplayName\":\"FirstAidTest\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/firstAid.png\",\"InitialContainerFrame\":{\"Height\":\"70%\",\"Maximized\":false,\"Width\":\"70%\",\"X\":null,\"Y\":null},\"InitialTitle\":\"Testsuite for FirstAid\",\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff8050.application.ui\"],\"Name\":\"FirstAidTest\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("GalaxyDataStudio", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Firefly\",\"Category\":\"Olap\",\"Class\":\"com.oFF.programs.gds.AuGalaxyDataStudio\",\"Description\":\"Tool for displaying and editing queries\",\"Device\":\"Window\",\"DisplayName\":\"Galaxy Data Studio\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/galaxydatastudio.png\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff4340.olap.reference\",\"ff4400.olap.providers\",\"ff4410.olap.ip.providers\",\"ff8050.application.ui\"],\"Name\":\"GalaxyDataStudio\",\"SubSystems\":[\"Gui\",\"SystemLandscape\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("GalaxyStudio", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Marcin Paskuda\",\"Category\":\"Quasar\",\"Class\":\"com.oFF.programs.galaxystudio.GsGalaxyStudio\",\"Description\":\"IDE for developing Quasar based apps\",\"Device\":\"Window\",\"DisplayName\":\"Galaxy Studio\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/galaxystudio.png\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff8050.application.ui\"],\"Name\":\"GalaxyStudio\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("Gyros", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Alexander Daum\",\"Category\":\"Olap\",\"Class\":\"com.oFF.programs.gyros.Gyros\",\"Description\":\"Variable dialog testsuite\",\"Device\":\"Window\",\"DisplayName\":\"Gyros\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/gyros.png\",\"InitialContainerFrame\":{\"Height\":\"70%\",\"Maximized\":false,\"Width\":\"70%\",\"X\":null,\"Y\":null},\"InitialTitle\":\"Gyros variable dialog testsuite\",\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff4330.olap.catalog.impl\",\"ff4400.olap.providers\",\"ff4410.olap.ip.providers\",\"ff8050.application.ui\"],\"Name\":\"Gyros\",\"SubSystems\":[\"SystemLandscape\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("Kratos", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Marcin Paskuda\",\"Category\":\"Olap\",\"Class\":\"com.oFF.programs.queryviewer.QvKratos\",\"Description\":\"View query information and more\",\"Device\":\"Window\",\"DisplayName\":\"Query Viewer\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/kratosviewer.png\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":true,\"Modules\":[\"ff8050.application.ui\"],\"Name\":\"Kratos\",\"SubSystems\":[\"SystemLandscape\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("LoadSystems", "{\"Class\":\"com.oFF.programs.analyticcards.LoadSystemsProgram\",\"Description\":\"Load System Landscape from Orca\",\"Device\":\"Console\",\"Modules\":[\"ff8050.application.ui\"],\"Name\":\"LoadSystems\",\"SubSystems\":[\"SystemLandscape\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("Podilates", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Andreas Ratzka\",\"Category\":\"Olap\",\"Class\":\"com.oFF.programs.dimensiondialog.DimensionDialogTestProgram\",\"Description\":\"Dimension dialog testsuite\",\"Device\":\"Window\",\"DisplayName\":\"\u03C0\u03BF\u03B4\u03B7\u03BB\u03AC\u03C4\u03B7\u03C2\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/podilates.png\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff4330.olap.catalog.impl\",\"ff4340.olap.reference\",\"ff4400.olap.providers\",\"ff4410.olap.ip.providers\",\"ff8050.application.ui\"],\"Name\":\"Podilates\",\"SubSystems\":[\"SystemLandscape\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("Proteus", "{\"AppStore\":false,\"Args\":\"\",\"Author\":\"Marcin Paskuda\",\"Category\":\"Quasar\",\"Class\":\"com.oFF.programs.proteus.AuProteusShell\",\"Description\":\"Quasar to SAPUI5 converter\",\"Device\":\"Console\",\"DisplayName\":\"Proteus\",\"IconPath\":\"\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":\"\",\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff8050.application.ui\"],\"Name\":\"Proteus\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("Aidos", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Marcin Paskuda\",\"Category\":\"Olap\",\"Class\":\"com.oFF.programs.sactabledemo.StdAidos\",\"Description\":\"SAC Table demo program\",\"Device\":\"Window\",\"DisplayName\":\"SAC Table demo\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/aidossactabledemo.png\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff8050.application.ui\"],\"Name\":\"Aidos\",\"SubSystems\":[\"Gui\",\"SystemLandscape\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("sheet", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Marco Pesarese\",\"Category\":\"System\",\"Class\":\"com.oFF.programs.spreadsheet.Spreadsheet\",\"Description\":\"Example of a excel like sheet\",\"Device\":\"Window\",\"DisplayName\":\"Sheet\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/sheet.png\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff8050.application.ui\"],\"Name\":\"sheet\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("AppGallery", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Marcin Paskuda\",\"Category\":\"Mobile\",\"Class\":\"com.oFF.apps.appgallery.AppGallery\",\"Description\":\"Example of a firefly ui program\",\"Device\":\"Window\",\"DisplayName\":\"App Gallery\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/appgallery.png\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff8090.poseidon\"],\"Name\":\"AppGallery\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("AtlasSimple", "{\"AppStore\":false,\"Args\":\"\",\"Author\":\"Marcin Paskuda\",\"Category\":\"SAC\",\"Class\":\"com.oFF.apps.poseidon.AtlasSimpleProgram\",\"Description\":\"Render SAC stories\",\"Device\":\"Window\",\"DisplayName\":\"Atlas Simple\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/chart.png\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"Modules\":[\"ff8090.poseidon\"],\"Name\":\"AtlasSimple\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("preview", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Markus Ulke\",\"Category\":\"SAC\",\"Class\":\"com.oFF.apps.Kreios\",\"Description\":\"Dragonfly test app\",\"Device\":\"Window\",\"DisplayName\":\"DragonFly\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/dragonFly.png\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff8090.poseidon\"],\"Name\":\"preview\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("MosesRefStory", "{\"AppStore\":true,\"Args\":\"moses 39B4ADC625FFA750D5DD27609AE03E9\",\"Description\":\"Moses references story\",\"DisplayName\":\"Moses Ref Story\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":\"40%\",\"Y\":\"40px\"},\"InitiallyOnLaunchpad\":false,\"Name\":\"MosesRefStory\",\"Ref\":\"AtlasSimple\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("NotosSimple", "{\"Class\":\"com.oFF.apps.poseidon.NotosSimpleProgram\",\"Description\":\"NotosSimple\",\"Device\":\"Window\",\"Modules\":[\"ff8020.poseidon\"],\"Name\":\"NotosSimple\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("Poseidon", "{\"AppStore\":false,\"Args\":\"\",\"Author\":\"Marcin Paskuda\",\"Category\":\"Quasar\",\"Class\":\"com.oFF.apps.PoseidonClient\",\"Description\":\"Extended quasar document renderer\",\"Device\":\"Window\",\"DisplayName\":\"Poseidon Client\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/trident.png\",\"InitialContainerFrame\":{\"Height\":\"60vh\",\"Maximized\":false,\"Width\":\"60vw\",\"X\":null,\"Y\":null},\"InitialTitle\":null,\"Modules\":[\"ff4400.olap.providers\",\"ff8090.poseidon\"],\"Name\":\"Poseidon\",\"SubSystems\":[\"SystemLandscape\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("PoseidonKitchenSink", "{\"AppStore\":true,\"Args\":\"-file=${ff_sdk}\\/production\\/queries\\/simplex\\/PoseidonKitchenSink.qsa\",\"Description\":\"Displays the the poseidon kitchen sink quasar document\",\"DisplayName\":\"Poseidon Kitchen Sink\",\"InitialContainerFrame\":{\"Maximized\":true},\"InitiallyOnLaunchpad\":false,\"Name\":\"PoseidonKitchenSink\",\"Ref\":\"Poseidon\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("S4SimpleDrilldown", "{\"AppStore\":true,\"Args\":\"moses 39B4ADC625FFA750D5DD27609AE03E9\",\"Description\":\"S4 Simple Drilldown demo\",\"DisplayName\":\"S4 Simple Drilldown\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":\"40%\",\"Y\":\"500px\"},\"InitiallyOnLaunchpad\":false,\"Name\":\"S4SimpleDrilldown\",\"Ref\":\"AtlasSimple\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("FireflyStudio", "{\"AppStore\":false,\"Args\":\"\",\"Author\":\"Firefly\",\"Category\":\"System\",\"Class\":\"com.oFF.studio.StudioClient\",\"Description\":\"Firefly desktop\",\"Device\":\"Window\",\"DisplayName\":\"Firefly Studio\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/fireflydesktop.png\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":\"\",\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff2210.ui.native\",\"ff8100.studio\"],\"Name\":\"FireflyStudio\",\"OptionalSubSystems\":[\"SystemLandscape\"],\"SubSystems\":[\"UserProfile\",\"Cache\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("StudioAppStoreDialog", "{\"AppStore\":false,\"Args\":\"\",\"Author\":\"Marcin Paskuda\",\"Category\":\"System\",\"Class\":\"com.oFF.dialogs.appstore.SxAppStoreDialog\",\"Description\":\"Firefly app store which allows to install firefly programs in studio\",\"Device\":\"Dialog\",\"DisplayName\":\"App Store\",\"IconPath\":\"\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff8100.studio\"],\"Name\":\"StudioAppStoreDialog\",\"SubSystems\":[\"Gui\"]}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("DummyProgram", "{\"Class\":\"com.oFF.tools.dll.DummyProgram\",\"Description\":\"DummyProgram\",\"Device\":\"Console\",\"Modules\":[\"ff8110.studio.ui\"],\"Name\":\"DummyProgram\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("Epiphagi", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Marcin Paskuda\",\"Category\":\"System\",\"Class\":\"com.oFF.programs.headlessrenderer.HrEpiphagi\",\"Description\":\"Render programs headless and export to a html file\",\"Device\":\"Window\",\"DisplayName\":\"Headless program renderer\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/epiphagi.png\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff8110.studio.ui\"],\"Name\":\"Epiphagi\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("InADocu", "{\"Class\":\"com.oFF.apps.ina.SxInADocu\",\"Description\":\"InADocu (Obsolete)\",\"Device\":\"Window\",\"Modules\":[\"ff8110.studio.ui\"],\"Name\":\"InADocu\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("Query", "{\"Class\":\"com.oFF.apps.misc.SxQuery\",\"Description\":\"Query (Obsolete)\",\"Device\":\"Window\",\"Modules\":[\"ff8110.studio.ui\"],\"Name\":\"Query\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("UiLab", "{\"Class\":\"com.oFF.apps.misc.SxUiLab\",\"Description\":\"UiLab (Obsolete)\",\"Device\":\"Window\",\"Modules\":[\"ff8100.studio.ui\"],\"Name\":\"UiLab\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("VariablePrompt", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Alexander Daum\",\"Category\":\"System\",\"Class\":\"com.oFF.apps.misc.SxVariablePrompt\",\"Description\":\"Variable prompt demo program (Obsolete)\",\"Device\":\"Window\",\"DisplayName\":\"Variable Prompt\",\"IconPath\":\"${ff_mimes}\\/images\\/programicons\\/variableprompt.png\",\"InitialContainerFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialTitle\":null,\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff8100.studio.ui\"],\"Name\":\"VariablePrompt\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("VizViewer", "{\"Class\":\"com.oFF.apps.vizviewer.SxVizViewer\",\"Description\":\"VizViewer (Obsolete)\",\"Device\":\"Window\",\"Modules\":[\"ff8110.studio.ui\"],\"Name\":\"VizViewer\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("qprofiler", "{\"Class\":\"com.oFF.olap.profiler.QProfiler\",\"Description\":\"qprofiler\",\"Device\":\"Console\",\"Modules\":[\"ff8110.studio.ui\"],\"Name\":\"qprofiler\"}"));
		oFF.ProgramRegistration.setProgramManifest(oFF.ProgramManifest.createByJson("sqlui", "{\"AppStore\":true,\"Args\":\"\",\"Author\":\"Christopher Homberger\",\"Category\":\"System\",\"Class\":\"com.oFF.programs.sqlui.SqlUi\",\"Description\":\"Execute simple sql queries\",\"Device\":\"Window\",\"DisplayName\":\"Sql Ui\",\"InitialWindowFrame\":{\"Height\":null,\"Maximized\":false,\"Width\":null,\"X\":null,\"Y\":null},\"InitialWindowTitle\":\"Sql Ui\",\"InitiallyOnLaunchpad\":false,\"Modules\":[\"ff3500.sql\",\"ff8110.studio.ui\"],\"Name\":\"sqlui\",\"SubSystems\":[\"SystemLandscape\"]}"));
	}
};

oFF.ProgramUtils = {

	createArgStructureFromString:function(programMetadata, argLine)
	{
			var argList = oFF.ProgramUtils.createArgValueList(argLine);
		var argStructure = oFF.ProgramUtils.createArgStructureFromList(programMetadata.getArgDefinitions(), argList, 0);
		return argStructure;
	},
	createArgStructureFromList:function(argDefList, argList, startOffset)
	{
			var initArgsStructure = oFF.PrFactory.createStructure();
		if (argList.size() > startOffset)
		{
			var offset = startOffset;
			for (; offset < argList.size(); offset++)
			{
				var value = argList.get(offset);
				if (oFF.XString.startsWith(value, "-"))
				{
					var delimColon = oFF.XString.indexOf(value, ":");
					var delimAssign = oFF.XString.indexOf(value, "=");
					var delim;
					if (delimAssign !== -1 && delimColon === -1)
					{
						delim = delimAssign;
					}
					else if (delimColon !== -1 && delimAssign === -1)
					{
						delim = delimColon;
					}
					else if (delimColon !== -1 && delimAssign !== -1)
					{
						if (delimColon < delimAssign)
						{
							delim = delimColon;
						}
						else
						{
							delim = delimAssign;
						}
					}
					else
					{
						delim = -1;
					}
					var leftSide = null;
					var rightSide = null;
					if (delim !== -1)
					{
						leftSide = oFF.XString.trim(oFF.XString.substring(value, 1, delim));
						rightSide = oFF.XString.trim(oFF.XString.substring(value, delim + 1, -1));
					}
					else
					{
						leftSide = oFF.XString.trim(oFF.XString.substring(value, 1, -1));
					}
					var argMd = argDefList.getByKey(leftSide);
					if (oFF.notNull(argMd))
					{
						var valueType = argMd.getValueType();
						if (valueType === oFF.XValueType.BOOLEAN)
						{
							if (oFF.XStringUtils.isNullOrEmpty(rightSide))
							{
								initArgsStructure.putBoolean(leftSide, true);
							}
							else
							{
								initArgsStructure.putBoolean(leftSide, oFF.XString.isEqual(rightSide, "true"));
							}
						}
						else if (valueType === oFF.XValueType.INTEGER)
						{
							if (oFF.XStringUtils.isNullOrEmpty(rightSide))
							{
								initArgsStructure.putInteger(leftSide, 0);
							}
							else
							{
								var intValue = oFF.XInteger.convertFromStringWithDefault(rightSide, 0);
								initArgsStructure.putInteger(leftSide, intValue);
							}
						}
						else
						{
							initArgsStructure.putString(leftSide, rightSide);
						}
					}
				}
				else
				{
					break;
				}
			}
			var theParameters = oFF.ProgramUtils.getParameters(argDefList);
			for (var i = 0; i + offset < argList.size() && i < theParameters.size(); i++)
			{
				var parameter = theParameters.get(i);
				var value2;
				if (parameter.getValueType() === oFF.XValueType.ARRAY)
				{
					var theList = initArgsStructure.putNewList(parameter.getName());
					for (var m = i + offset; m < argList.size(); m++)
					{
						value2 = argList.get(m);
						theList.addString(value2);
					}
					break;
				}
				value2 = argList.get(i + offset);
				initArgsStructure.putString(parameter.getName(), value2);
			}
		}
		return initArgsStructure;
	},
	generateHelp:function(programMetadata)
	{
			var buffer = oFF.XStringBuffer.create();
		var argumentMetadata = programMetadata.getArgDefinitions();
		var hasOptions = false;
		var hasParams = false;
		for (var k = 0; k < argumentMetadata.size(); k++)
		{
			var argMd3 = argumentMetadata.get(k);
			if (argMd3.isParameter())
			{
				hasParams = true;
			}
			else
			{
				hasOptions = true;
			}
		}
		buffer.append("SYNTAX ").appendNewLine();
		buffer.append("   prgName ");
		if (hasOptions)
		{
			buffer.append("[OPTIONS] ");
		}
		var firstLine;
		if (hasParams)
		{
			for (var i = 0; i < argumentMetadata.size(); i++)
			{
				var argMd = argumentMetadata.get(i);
				if (argMd.isParameter() === true)
				{
					buffer.append(argMd.getName()).append(" ");
				}
			}
			buffer.appendNewLine();
			buffer.appendNewLine();
			var innerBuffer = oFF.TwoColumnBuffer.create();
			firstLine = true;
			for (var m = 0; m < argumentMetadata.size(); m++)
			{
				var argMd4 = argumentMetadata.get(m);
				if (argMd4.isParameter() === true)
				{
					if (firstLine === false)
					{
						innerBuffer.appendNewLine();
					}
					else
					{
						firstLine = false;
					}
					innerBuffer.append("   ").append(argMd4.getName());
					innerBuffer.nextColumn();
					innerBuffer.append(argMd4.getText());
				}
			}
			buffer.append(innerBuffer.toString());
		}
		if (hasOptions)
		{
			buffer.appendNewLine();
			buffer.appendNewLine();
			buffer.append("OPTIONS").appendNewLine();
			var innerBuffer2 = oFF.TwoColumnBuffer.create();
			firstLine = true;
			for (var j = 0; j < argumentMetadata.size(); j++)
			{
				var argMd2 = argumentMetadata.get(j);
				if (argMd2.isParameter() === false)
				{
					if (firstLine === false)
					{
						innerBuffer2.appendNewLine();
					}
					else
					{
						firstLine = false;
					}
					innerBuffer2.append("  -").append(argMd2.getName());
					if (argMd2.getValueType() === oFF.XValueType.BOOLEAN)
					{
						innerBuffer2.append("[:");
						innerBuffer2.append(argMd2.getPossibleValues());
						innerBuffer2.append("]");
					}
					else
					{
						innerBuffer2.append(":");
						innerBuffer2.append(argMd2.getPossibleValues());
					}
					innerBuffer2.nextColumn();
					innerBuffer2.append(argMd2.getText());
				}
			}
			buffer.append(innerBuffer2.toString());
		}
		return buffer.toString();
	},
	createArgValueList:function(argLine)
	{
			var result = null;
		if (oFF.XStringUtils.isNotNullAndNotEmpty(argLine))
		{
			var trimmed = oFF.XString.trim(argLine);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(trimmed))
			{
				result = oFF.XStringTokenizer.splitString(trimmed, " ");
			}
		}
		if (oFF.isNull(result))
		{
			result = oFF.XListOfString.create();
		}
		return result;
	},
	getParameters:function(argDefList)
	{
			var parameterList = oFF.XList.create();
		for (var i = 0; i < argDefList.size(); i++)
		{
			var arg = argDefList.get(i);
			if (arg.isParameter())
			{
				parameterList.add(arg);
			}
		}
		return parameterList;
	}
};

oFF.DefaultSession = function() {};
oFF.DefaultSession.prototype = new oFF.XObject();
oFF.DefaultSession.prototype._ff_c = "DefaultSession";

oFF.DefaultSession.create = function()
{
	return oFF.DefaultSession.createWithVersion(-1);
};
oFF.DefaultSession.createWithVersion = function(version)
{
	var environmentConfig = oFF.XHashMapOfStringByString.create();
	if (version !== -1)
	{
		environmentConfig.put(oFF.XEnvironmentConstants.XVERSION, oFF.XInteger.convertToString(version));
	}
	var kernel = oFF.Kernel.create(environmentConfig);
	var session = kernel.getKernelProcessBase();
	return session;
};

oFF.SigSelParser = function() {};
oFF.SigSelParser.prototype = new oFF.XObject();
oFF.SigSelParser.prototype._ff_c = "SigSelParser";

oFF.SigSelParser.create = function()
{
	var newObj = new oFF.SigSelParser();
	newObj.setup();
	return newObj;
};
oFF.SigSelParser.prototype.m_defaultComponentType = null;
oFF.SigSelParser.prototype.setup = function()
{
	this.m_defaultComponentType = null;
};
oFF.SigSelParser.prototype.setDefaultComponentType = function(type)
{
	this.m_defaultComponentType = type;
};
oFF.SigSelParser.prototype.parse = function(sigSelExpression)
{
	var segment;
	var splitString;
	var ops = oFF.XList.create();
	var messages = oFF.MessageManagerSimple.createMessageManager();
	if (oFF.notNull(sigSelExpression))
	{
		var hasSchema = false;
		if (oFF.XString.startsWith(sigSelExpression, "dp:") || oFF.XString.startsWith(sigSelExpression, "ui:") || oFF.XString.startsWith(sigSelExpression, "env:") || oFF.XString.startsWith(sigSelExpression, "dialog:"))
		{
			hasSchema = true;
		}
		if (hasSchema || oFF.XString.containsString(sigSelExpression, "||"))
		{
			splitString = oFF.XStringTokenizer.splitString(sigSelExpression, "||");
			for (var k = 0; k < splitString.size(); k++)
			{
				segment = splitString.get(k);
				var uri = oFF.XUri.createFromUrl(segment);
				var op2 = oFF.SigSelOperation.create();
				ops.add(op2);
				var protocolType = uri.getProtocolType();
				var domain = oFF.SigSelDomain.CONTEXT;
				if (protocolType === oFF.ProtocolType.UI)
				{
					domain = oFF.SigSelDomain.UI;
				}
				else if (protocolType === oFF.ProtocolType.DATAPROVIDER)
				{
					domain = oFF.SigSelDomain.DATA;
				}
				else if (protocolType === oFF.ProtocolType.DIALOG)
				{
					domain = oFF.SigSelDomain.DIALOG;
				}
				else if (protocolType === oFF.ProtocolType.ENVVARS)
				{
					domain = oFF.SigSelDomain.ENVVARS;
				}
				op2.setDomain(domain);
				var path = uri.getPath();
				if (oFF.notNull(path))
				{
					var type = null;
					var pos = oFF.XString.indexOf(path, ".");
					if (pos !== -1)
					{
						type = oFF.XString.substring(path, pos + 1, -1);
						path = oFF.XString.substring(path, 0, pos);
					}
					if (oFF.XStringUtils.isNotNullAndNotEmpty(path))
					{
						if (oFF.XString.isEqual(path, "*"))
						{
							op2.setOperationType(oFF.SigSelType.WILDCARD);
						}
						else if (oFF.XString.startsWith(path, "!"))
						{
							op2.setOperationType(oFF.SigSelType.MATCH_ID);
							op2.setId(oFF.XString.substring(path, 1, -1));
						}
						else
						{
							op2.setOperationType(oFF.SigSelType.MATCH_NAME);
							op2.setName(path);
						}
					}
					else
					{
						op2.setOperationType(oFF.SigSelType.MATCH);
					}
					if (oFF.notNull(type))
					{
						var componentType = oFF.XComponentType.lookupComponentType(type);
						op2.setSelectedComponentType(componentType);
					}
				}
				var fragment = uri.getFragment();
				op2.setSelectedProperty(fragment);
			}
		}
		else
		{
			splitString = oFF.XStringTokenizer.splitString(sigSelExpression, ",");
			for (var i = 0; i < splitString.size(); i++)
			{
				segment = splitString.get(i);
				var folderString = oFF.XStringTokenizer.splitString(segment, "/");
				var parent = null;
				for (var j = 0; j < folderString.size(); j++)
				{
					var op = oFF.SigSelOperation.create();
					if (j === 0)
					{
						ops.add(op);
					}
					else if (oFF.notNull(parent))
					{
						parent.setChild(op);
					}
					var element = folderString.get(j);
					if (oFF.XString.startsWith(element, "#"))
					{
						op.setDomain(oFF.SigSelDomain.UI);
						element = oFF.XString.substring(element, 1, -1);
					}
					else if (oFF.XString.startsWith(element, "%"))
					{
						op.setDomain(oFF.SigSelDomain.DATA);
						element = oFF.XString.substring(element, 1, -1);
					}
					if (oFF.XString.startsWith(element, "?"))
					{
						var typeSel = null;
						var end = oFF.XString.indexOf(element, ":");
						if (end !== -1)
						{
							typeSel = oFF.XString.substring(element, 1, end);
							element = oFF.XString.substring(element, end + 1, -1);
						}
						else
						{
							typeSel = oFF.XString.substring(element, 1, -1);
							element = null;
						}
						op.setSelectedComponentType(oFF.XComponentType.lookupComponentType(typeSel));
					}
					else
					{
						op.setSelectedComponentType(this.m_defaultComponentType);
					}
					var isId = false;
					if (oFF.XStringUtils.isNotNullAndNotEmpty(element))
					{
						if (oFF.XString.startsWith(element, "~"))
						{
							element = oFF.XString.substring(element, 1, -1);
							isId = true;
						}
					}
					var opType = oFF.SigSelType.MATCH;
					if (oFF.notNull(element))
					{
						var propIndex = oFF.XString.indexOf(element, ".");
						if (propIndex !== -1)
						{
							var property = oFF.XString.substring(element, propIndex + 1, -1);
							op.setSelectedProperty(property);
							element = oFF.XString.substring(element, 0, propIndex);
						}
						var arrayStart = oFF.XString.indexOf(element, "[");
						if (arrayStart !== -1)
						{
							var arrayEnd = oFF.XString.indexOfFrom(element, "]", arrayStart);
							if (arrayEnd === -1)
							{
								messages.addError(0, "Array end not found");
							}
							else
							{
								var arrayContent = oFF.XString.substring(element, arrayStart + 1, arrayEnd);
								arrayContent = oFF.XString.trim(arrayContent);
								if (oFF.XString.size(arrayContent) > 0)
								{
									var firstChar = oFF.XString.getCharAt(arrayContent, 0);
									if (firstChar >= 48 && firstChar <= 57)
									{
										var number = oFF.XInteger.convertFromStringWithDefault(arrayContent, -1);
										if (number >= 0)
										{
											op.setIndexType(oFF.SigSelIndexType.POSITION);
											op.setIndexPosition(number);
										}
										else
										{
											messages.addError(0, "Not a valid index");
										}
									}
									else
									{
										op.setIndexType(oFF.SigSelIndexType.NAME);
										op.setIndexName(arrayContent);
									}
								}
							}
							element = oFF.XString.substring(element, 0, arrayStart);
						}
						if (oFF.XString.isEqual(element, "*"))
						{
							opType = oFF.SigSelType.WILDCARD;
						}
						else
						{
							if (isId)
							{
								op.setId(element);
								opType = oFF.SigSelType.MATCH_ID;
							}
							else
							{
								op.setName(element);
								opType = oFF.SigSelType.MATCH_NAME;
							}
						}
					}
					op.setOperationType(opType);
					parent = op;
				}
			}
		}
	}
	return oFF.ExtResult.create(ops, messages);
};

oFF.SubSystemFactory = function() {};
oFF.SubSystemFactory.prototype = new oFF.XObject();
oFF.SubSystemFactory.prototype._ff_c = "SubSystemFactory";

oFF.SubSystemFactory.s_factories = null;
oFF.SubSystemFactory.registerFactory = function(subSystemType, factory)
{
	if (oFF.isNull(oFF.SubSystemFactory.s_factories))
	{
		oFF.SubSystemFactory.s_factories = oFF.XHashMapByString.create();
	}
	oFF.SubSystemFactory.s_factories.put(subSystemType.getName(), factory);
};
oFF.SubSystemFactory.create = function(subSystemType, process)
{
	var subSystem = null;
	if (oFF.notNull(oFF.SubSystemFactory.s_factories))
	{
		var name = subSystemType.getName();
		var factory = oFF.SubSystemFactory.s_factories.getByKey(name);
		if (oFF.notNull(factory))
		{
			subSystem = factory.newSubSystem(process);
		}
	}
	return subSystem;
};

oFF.UserProfileAdapterLdap = {

	DOC_FORMAT:"ldap",
	HEADER:"header",
	DEFAULTS:"defaults",
	DEFAULT_USER_THUMBNAIL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBKwErAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAALCABkAGQBAREA/8QAHgABAAICAgMBAAAAAAAAAAAAAAoLCAkGBwEDBQL/xAAwEAAABgIBAgMHBAMBAAAAAAABAgMEBQYABwgJEgoRExQVFiFSktMiMTJBFxhRI//aAAgBAQAAPwCfxjGMYxjGMYxjGMZq/wCqD1bOKHSi1Kz2DyCnXszdbWR8jq3SlOMzdbF2Q/YlD2lVg1dLJNYOsx6yiKUxbZpRCKYGWTbNwkJJVtHLwKuS/jH+pVs+fkS8eKhpTjPShWXJENUqqTa95BoJzA3UlrNd++urPPS7RV92UmNRIoIlJ3lADGw8g/FQ9bGGk05FblFXZ1MigHPFTmjtMrRiwAPmKSibGkx7sqY/xH0XiSgB/E5R+ebyun14z+xOrVX6D1HNJ1lCsSbltHud9aFZyrBzXDLKFSGWturZaQmglotLz9V+5qM0zftkgOdlW5I5SoDPU1ns3X259f1DauqbhA37XN9gmFmp1yrEgjJwVhgpNEq7OQj3iBhIomoQRIomcCLtlyKtnKSLlFVInOsYxjGM+DabLC0usWO42V8jF12pwMvZZ+TcGAqEdCwUe4lJV8uYfICos2LVdwoYfkBEzDlJb1ReeuwupBzV3Lycu8m/UhbBY30JqmsuXCh2VE1HBPXLSi1eNbGN6TUycV2Sk0ZEpPeFjkpeTV81XZxzXvjGTyvBn9Rm0Nr7tLprbFsLqSqM3XZjdXHtCRcqLfDdhhF23+TqZEeqcfRjbBFPEbo3j0e1BrIQdjepkBWWcmGwuxjGMYzU511NmSOo+kNz+ucQ6UZSZuPdoqDJ0kcU1UVdjuY7XZjpnKIGKcqNpUEogID5h8spasYxm33oG7Mf6o6w3ASyMXarQsvviE17I+mcSAvE7PjpTXsg3V8hDvTOjZBMJB+QmIQf3AMue8YxjGM0u+IfqcncujBz4i4lJVZ3H6ljLUdJEomOMfTL/T7XLn8igI9iETDvXCn/ABNIwj8gHKanGMZs96K9Rk7x1ZentARCSirv/anU02oCZRMKcfVLG2tUu4N5fME20TCvXCpv2Kmkcw/IMuu8YxjGM6z3Tqqsb00/tLSt1bg7qG2te3HXFmQEhVBPCXSvyFekhTKf9PrJtZBRREw/xVIQwCAgAhRvcuOM+w+HPJXdHGTakavHXXTd9nabIisidJKWZMXRjwVkj+8A9aItEErHWCIck8yOI6SbKlH9XkGOmMZMe8HJwSnNwc1LvzdssKqGs+LVTlq1UJV02H2OX3TsqJWhUWkeqcAIsrVaE7sMlJil3HYuZyuGN2+1kHLNrGMYxjGRbfER9AZr1Oaoz5IcbUoOuc0tbV33QLCRVbxMJvulRoLOGNOnZU4EbxlygzqLFpdkfmBkog4Urs2u3jhjpCHq7Ny6Q2/x32FP6o3nra5ao2PV3irGdp15gX9fm2KyRzJ+p7M+RSB0zWEonaSLI7iPfIiVwzcroHIobqzNsHS96OXMLqnbPiq5pykydX08ylGyWx+Q9siXzPWlIigVL7eVnIKEQJb7X7OCnu2o19ZzIOHApHkVIqN9eSQt2OCXCTSXT04ya54t6EiDsaZRGB1JKbfEQGw3q3yPYvZ71anKBCFdz9jkCmcL9oA3YNCM4hgRKOjmaCeYGMYxjPBjAUBERAAABEREfIAAP3ER/ryzQF1K/Ee9PPp1knKUW6l5JchI0q7Yml9LScbMBCyiYeRW2w78U7mrUoqSggV7H+tM2luAGEKyf9wj58NfGnzEpu6yxvOnjxAVjRFpl0hpdl0MWXl7bqZh5FRBvboixyhx2THmKHtL6Ug/huYarCsZjASSJ0GDeU3F7r6MvV1osYR5auHPLaJVbJizrd/SpTzYlc9pJ3mbfDFzQjdj1J2UTmKqVFlHH9UBEpz/AKTjxWH6JPRH1TIkvheFHFuHNHqA/LJXQ6s9XWhkh9QHAxt5sstWk00x/UHexBIgB8gAoeWdQcx/ECdJbpv0VemVfZ9C2rcauxVj6px64pJ1uxJs3DdM3s0U9lquKWtqDHEVAE3Ht8qk8bJ9x2sK+VAqB45fGvxr16NvOyk5Y8Wa2nx2slg86mtpaUfqbQ1bAmMmgiSZJaH5ILaBiJgLuQUbBRXXrmW9gTURBBgWa9wy6hHD3qA0FLYfFDeNP2lHJt0FpyvM3gxl9p6y5CCDK5USVK0s9ccEOf0gUfxpGLk5TGYPHaPaqbM7GMZwfZuxqfp/XN82vsGYb1+i62qFivNwm3ZykbxVbq0S6mpl8oJjFAfZ2DJdQqYCBlTgVMnmc4ANT/1SvEvc7ufs3dNfaxuMlxh4tvpCSjYbXWsX7qFutwq3rqIs1No7BaLJz8o5k2QJrSddgnMLVkzLKMlY+SKl7WtHCOc6hzqKHMdQ5jHOc5hMcxzCJjGMYwiYxjGERMYRERERERERz8Z7EllUFCLIKqIrJmAyaqRzJqJmD9jEOQQMUwf0JRAQz7j622qUbAyk7NYJFmUO0rR9NSTtsUPL5ACDhyokAB/wCeWcfxnaGnd2be4936E2lo3Zd11NsSuOCOYW40KxSVanmRyHKcUwfRjhuou0WEoFdMXPrMnifmi6brJGMQbEjw5fiOtx839yR3Bnm+NVl9sS9SlJTTO8Idi0rEjsKSqTEZGZpd6gGXowStocV5u/nIedr7OJSkgiJJk/ijvlmzpabBjGRAfGCdQH/XzhLVOGlIm/ZNk8wJdT4wSZuOx9F6Kor1k/sXrgT/0RRutqGCraXcJU38SztLX9RSKFysFxjGMYxnc3Hfel74yb21FyE1lIqRd901sGr7DrDoihiENI1mVbSQMXXb81I+URRWjJNAfMrmPeOm5wEipgG8O4n8jqLy842aT5M61dkdUzdWu63fIkhVCqqRisuwTPLQDwxf4yVcmSSEDKJD5GRkI5ykYAEg5kJnodOmzJs4evF0WrNogq6dOnChUUGzZBMyq666qglIkiikQyiihzAUhCmMYQABHKYXrlc+HHUV6kG+N2xcos/wBWViYNqLRyIqGFojqzXjp5FxUq0SE5iJ/GMseZuy/aAG9SxCkfzBEvlqIxjGMYxjLE/wAGH1AvizWO6enTe5v1JrWLp1vDRiD1wAqr0Syv2zHZdYjyqH7jI123OoyzoNkgEe24zCwFBJqcSzqc0H+JU5mWnhd0od3WChGeNL5vGQh+N9ZnWRzoqVkmz2UyFrniuE/1IOm9GhLOzjFiGKojMPo9cgh6QiFPvjGMYxjGMz36YPMO28Dud/G7k3UzO1iUXYkQyuEM0VOn8T66tSvwzfq2oUogVUZOsSkiDIqgGIlKJMHQF9RuQQu+WjhJ61bPEe/0XbdFyj3gYh/SXTKqn3k8/Mpuw4dxR+YD5gP7Zg31KOHmkedHDPdGgd+wsjK0qRrTy2sHsE/SirLWLdS2rmdrVnrUouzkEGMvGvW4pgZywfM3bB0+jnzNyyeOET0omxKTFVG+XGrxriQXj69ZJeHZLPlWyrxVtHvlmyJ3SiDRsgdcyaYCqZJuimY4iJUiB5FDhnutv9a33E/Hj3W3+tb7ifjx7rb/AFrfcT8ePdbf61vuJ+PHutv9a33E/Hj3W3+tb7ifjx7rb/Wt9xPx491t/rW+4n48e62/1rfcT8eSHfDT8DtAc1uoZV4jf0bYLJWdTR/+V4mqM5RmwgLHYqg5Qk4ZhcEDRTp7KV0r9Bu4exTJ9F+8Cog0eOFmKrhqtbdgBe0oAUoABQAAAAAAAA+QAH9AH9B/Wf/Z",
	USER_ID:"userId",
	DISPLAY_NAME:"displayName",
	TITLE:"title",
	LAST_NAME:"lastName",
	FIRST_NAME:"firstName",
	FULL_NAME:"fullName",
	DEPARTMENT:"department",
	DESCRIPTION:"description",
	COST_CENTER:"costCenter",
	ROOM_NUMBER:"roomNumber",
	DELIVERY_OFFICE_NAME:"deliveryOfficeName",
	COUNTRY:"country",
	REGION:"region",
	CITY:"city",
	ZIP_CODE:"zipCode",
	STREET_NAME:"streetName",
	DATA_ACCESS_LANGUAGE:"languageDataAccess",
	LANGUAGE:"language",
	EMAIL:"mail",
	PHONE_NUMBER:"phoneNumber",
	FAX_NUMBER:"faxNumber",
	MOBILE:"mobilePhoneNumber",
	SAP_NAME:"SAPName",
	MANAGER:"manager",
	THUMBNAIL_PHOTO:"thumbnailPhoto",
	COMPANY:"company",
	HOME_DIR:"unixHomeDirectory",
	ACCOUNT_TYPE:"accountType",
	USER_ENABLED:"userEnabled",
	TELEPHONE_ASSISTANT:"phoneAssistant",
	EXCHANGE_USAGE_LOCATION:"exchangeUsageLocation",
	SAP_OBJECT_STATUS:"SAPObjectStatus",
	DATE_FORMAT:"dateFormat",
	DECIMAL_FORMAT:"decimalFormat",
	TIME_FORMAT:"timeFormat",
	USR_NAME:"username",
	deserialize:function(userProfile, document)
	{
			var isApplicable = false;
		if (oFF.notNull(document))
		{
			var ldapHeaderStructure = document.getStructureByKey(oFF.UserProfileAdapterLdap.HEADER);
			if (oFF.notNull(ldapHeaderStructure))
			{
				isApplicable = true;
				userProfile.setDocumentFormat(oFF.UserProfileAdapterLdap.DOC_FORMAT);
				userProfile.setThumbnailPhoto(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.THUMBNAIL_PHOTO));
				userProfile.setPersonNumber(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.USER_ID));
				userProfile.setFullName(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.FULL_NAME));
				userProfile.setTitle(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.TITLE));
				userProfile.setSAPName(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.SAP_NAME));
				userProfile.setFirstName(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.FIRST_NAME));
				userProfile.setLastName(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.LAST_NAME));
				userProfile.setDisplayName(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.DISPLAY_NAME));
				userProfile.setLanguage(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.LANGUAGE));
				userProfile.setDataAccessLanguage(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.DATA_ACCESS_LANGUAGE));
				userProfile.setEmailAddress(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.EMAIL));
				userProfile.setPhoneNumber(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.PHONE_NUMBER));
				userProfile.setMobilePhoneNumber(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.MOBILE));
				userProfile.setFaxNumber(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.FAX_NUMBER));
				userProfile.setCompany(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.COMPANY));
				userProfile.setDepartment(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.DEPARTMENT));
				userProfile.setCostCenter(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.DESCRIPTION));
				userProfile.setCostCenterId(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.COST_CENTER));
				userProfile.setDeliveryOfficeName(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.DELIVERY_OFFICE_NAME));
				userProfile.setRoomNumber(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.ROOM_NUMBER));
				userProfile.setStreetName(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.STREET_NAME));
				userProfile.setCityCode(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.ZIP_CODE));
				userProfile.setCityName(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.CITY));
				userProfile.setRegion(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.REGION));
				userProfile.setCountry(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.COUNTRY));
				userProfile.setManagerPersonNumber(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.MANAGER));
				userProfile.setSamaAccountType(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.ACCOUNT_TYPE));
				userProfile.setUnixHomeDirectory(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.HOME_DIR));
				var value = ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.USER_ENABLED);
				if (oFF.XStringUtils.isNotNullAndNotEmpty(value))
				{
					if (oFF.XString.isEqual(value, "TRUE"))
					{
						userProfile.setUserEnabled(true);
					}
					else
					{
						userProfile.setUserEnabled(false);
					}
				}
				userProfile.setTelephoneAssistant(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.TELEPHONE_ASSISTANT));
				userProfile.setExchUsageLocation(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.EXCHANGE_USAGE_LOCATION));
				userProfile.setSAPObjectStatus(ldapHeaderStructure.getStringByKey(oFF.UserProfileAdapterLdap.SAP_OBJECT_STATUS));
				var defaultsStructure = document.getStructureByKey(oFF.UserProfileAdapterLdap.DEFAULTS);
				if (oFF.notNull(defaultsStructure))
				{
					userProfile.setDateFormatting(defaultsStructure.getStringByKey(oFF.UserProfileAdapterLdap.DATE_FORMAT));
					var decimalFormat = defaultsStructure.getStringByKey(oFF.UserProfileAdapterLdap.DECIMAL_FORMAT);
					var start = oFF.XString.indexOf(decimalFormat, "1");
					var end = oFF.XString.indexOf(decimalFormat, "2");
					var groupSeparator = oFF.XString.substring(decimalFormat, start + 1, end);
					userProfile.setDecimalGroupingSeparator(groupSeparator);
					start = oFF.XString.indexOf(decimalFormat, "7");
					end = oFF.XString.indexOf(decimalFormat, "8");
					var decimalSeparator = oFF.XString.substring(decimalFormat, start + 1, end);
					userProfile.setDecimalSeparator(decimalSeparator);
					userProfile.setTimeFormatting(defaultsStructure.getStringByKey(oFF.UserProfileAdapterLdap.TIME_FORMAT));
				}
			}
		}
		return isApplicable;
	},
	serialize:function(userProfile, document)
	{
			if (oFF.notNull(document))
		{
			var ldapHeaderStructure = document.getStructureByKey(oFF.UserProfileAdapterLdap.HEADER);
			if (oFF.notNull(ldapHeaderStructure))
			{
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.THUMBNAIL_PHOTO, userProfile.isThumbnailPhotoDefault(), userProfile.getThumbnailPhoto());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.USER_ID, userProfile.isPersonNumberDefault(), userProfile.getPersonNumber());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.TITLE, userProfile.isTitleDefault(), userProfile.getTitle());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.FULL_NAME, userProfile.isFullNameDefault(), userProfile.getFullName());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.SAP_NAME, userProfile.isSAPNameDefault(), userProfile.getSAPName());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.FIRST_NAME, userProfile.isFirstNameDefault(), userProfile.getFirstName());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.LAST_NAME, userProfile.isLastNameDefault(), userProfile.getLastName());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.DISPLAY_NAME, userProfile.isDisplayNameDefault(), userProfile.getDisplayName());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.EMAIL, userProfile.isEmailAddressDefault(), userProfile.getEmailAddress());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.STREET_NAME, userProfile.isStreetNameDefault(), userProfile.getStreetName());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.ZIP_CODE, userProfile.isCityCodeDefault(), userProfile.getCityCode());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.CITY, userProfile.isCityNameDefault(), userProfile.getCityName());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.COUNTRY, userProfile.isCountryDefault(), userProfile.getCountry());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.COST_CENTER, userProfile.isCostCenterDefault(), userProfile.getCostCenter());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.MANAGER, userProfile.isManagerPersonNumberDefault(), userProfile.getManagerPersonNumber());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.PHONE_NUMBER, userProfile.isPhoneNumberDefault(), userProfile.getPhoneNumber());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.FAX_NUMBER, userProfile.isFaxNumberDefault(), userProfile.getFaxNumber());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.MOBILE, userProfile.isMobilePhoneNumberDefault(), userProfile.getMobilePhoneNumber());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.DESCRIPTION, userProfile.isDescriptionDefault(), userProfile.getDescription());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.DEPARTMENT, userProfile.isDepartmentDefault(), userProfile.getDepartment());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.COMPANY, userProfile.isCompanyDefault(), userProfile.getCompany());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.DELIVERY_OFFICE_NAME, userProfile.isDeliveryOfficeNameDefault(), userProfile.getDeliveryOfficeName());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.ROOM_NUMBER, userProfile.isRoomNumberDefault(), userProfile.getRoomNumber());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.REGION, userProfile.isRegionDefault(), userProfile.getRegion());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.DATA_ACCESS_LANGUAGE, userProfile.isLanguageDefault(), userProfile.getLanguage());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.LANGUAGE, userProfile.isLanguageDefault(), userProfile.getLanguage());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.ACCOUNT_TYPE, userProfile.isSamaAccountTypeDefault(), userProfile.getSamaAccountType());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.HOME_DIR, userProfile.isUnixHomeDirectoryDefault(), userProfile.getUnixHomeDirectory());
				var value;
				if (userProfile.getUserEnabled())
				{
					value = "TRUE";
				}
				else
				{
					value = "FALSE";
				}
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.USER_ENABLED, userProfile.isUserEnabledDefault(), value);
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.TELEPHONE_ASSISTANT, userProfile.isTelephoneAssistantDefault(), userProfile.getTelephoneAssistant());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.EXCHANGE_USAGE_LOCATION, userProfile.isExchUsageLocationDefault(), userProfile.getExchUsageLocation());
				oFF.UserProfileAdapterLdap.update(ldapHeaderStructure, oFF.UserProfileAdapterLdap.SAP_OBJECT_STATUS, userProfile.isSAPObjectStatusDefault(), userProfile.getSAPObjectStatus());
			}
		}
	},
	update:function(ldapHeaderStructure, name, isDefault, value)
	{
			if (isDefault)
		{
			ldapHeaderStructure.remove(name);
		}
		else
		{
			ldapHeaderStructure.putString(name, value);
		}
	}
};

oFF.UserProfileAdapterOrca = {

	DOC_FORMAT:"orca",
	USER:"user",
	FEATURES:"features",
	USER_NAME:"userName",
	PARAMETERS:"parameters",
	NAME:"name",
	VALUE:"value",
	FIRST_NAME:"FIRST_NAME",
	LAST_NAME:"LAST_NAME",
	DISPLAY_NAME:"DISPLAY_NAME",
	EMAIL:"EMAIL",
	MOBILE:"MOBILE",
	OFFICE_PHONE:"OFFICE_PHONE",
	MANAGER:"MANAGER",
	COMPANY:"COMPANY",
	OFFICE_ADDRESS:"OFFICE_ADDRESS",
	LANGUAGE:"LANGUAGE",
	DATA_ACCESS_LANGUAGE:"DATA_ACCESS_LANGUAGE",
	DATE_FORMAT:"DATE_FORMAT",
	TIME_FORMAT:"TIME_FORMAT",
	TIMEZONE:"TIMEZONE",
	DECIMAL_FORMAT:"DECIMAL_FORMAT",
	SESSION:"session",
	TENANT:"tenant",
	ID:"id",
	ACTIVE:"active",
	deserialize:function(userProfile, document)
	{
			var isApplicable = false;
		if (oFF.notNull(document))
		{
			var orcaUserStructure = document.getStructureByKey(oFF.UserProfileAdapterOrca.USER);
			if (oFF.notNull(orcaUserStructure))
			{
				isApplicable = true;
				userProfile.setDocumentFormat(oFF.UserProfileAdapterOrca.DOC_FORMAT);
				userProfile.setSAPName(orcaUserStructure.getStringByKey(oFF.UserProfileAdapterOrca.USER_NAME));
				var paramMap = oFF.XHashMapByString.create();
				var parameters = orcaUserStructure.getListByKey(oFF.UserProfileAdapterOrca.PARAMETERS);
				for (var i = 0; i < parameters.size(); i++)
				{
					var parameterElement = parameters.getStructureAt(i);
					var paramName = parameterElement.getStringByKey(oFF.UserProfileAdapterOrca.NAME);
					paramMap.put(paramName, parameterElement);
				}
				userProfile.setFirstName(oFF.UserProfileAdapterOrca.extractString(paramMap, oFF.UserProfileAdapterOrca.FIRST_NAME));
				userProfile.setLastName(oFF.UserProfileAdapterOrca.extractString(paramMap, oFF.UserProfileAdapterOrca.LAST_NAME));
				userProfile.setDisplayName(oFF.UserProfileAdapterOrca.extractString(paramMap, oFF.UserProfileAdapterOrca.DISPLAY_NAME));
				userProfile.setEmailAddress(oFF.UserProfileAdapterOrca.extractString(paramMap, oFF.UserProfileAdapterOrca.EMAIL));
				userProfile.setMobilePhoneNumber(oFF.UserProfileAdapterOrca.extractString(paramMap, oFF.UserProfileAdapterOrca.MOBILE));
				userProfile.setPhoneNumber(oFF.UserProfileAdapterOrca.extractString(paramMap, oFF.UserProfileAdapterOrca.OFFICE_PHONE));
				userProfile.setManagerPersonNumber(oFF.UserProfileAdapterOrca.extractString(paramMap, oFF.UserProfileAdapterOrca.MANAGER));
				userProfile.setCompany(oFF.UserProfileAdapterOrca.extractString(paramMap, oFF.UserProfileAdapterOrca.COMPANY));
				userProfile.setDeliveryOfficeName(oFF.UserProfileAdapterOrca.extractString(paramMap, oFF.UserProfileAdapterOrca.OFFICE_ADDRESS));
				userProfile.setLanguage(oFF.UserProfileAdapterOrca.extractString(paramMap, oFF.UserProfileAdapterOrca.LANGUAGE));
				userProfile.setDataAccessLanguage(oFF.UserProfileAdapterOrca.extractString(paramMap, oFF.UserProfileAdapterOrca.DATA_ACCESS_LANGUAGE));
				var dateFormatJson = oFF.UserProfileAdapterOrca.extractString(paramMap, oFF.UserProfileAdapterOrca.DATE_FORMAT);
				var dateElement = oFF.JsonParserFactory.createFromString(dateFormatJson);
				if (oFF.notNull(dateElement) && dateElement.isStructure())
				{
					var dateFormatStructure = dateElement;
					var dateFormatString = dateFormatStructure.getStructureByKey("dateFormat").getStringByKey("pattern");
					userProfile.setDateFormatting(dateFormatString);
				}
				var timeFormatJson = oFF.UserProfileAdapterOrca.extractString(paramMap, oFF.UserProfileAdapterOrca.TIME_FORMAT);
				var timeElement = oFF.JsonParserFactory.createFromString(timeFormatJson);
				if (oFF.notNull(timeElement) && timeElement.isStructure())
				{
					var timeFormatStructure = timeElement;
					var timeFormatString = timeFormatStructure.getStructureByKey("timeFormat").getStringByKey("pattern");
					userProfile.setTimeFormatting(timeFormatString);
				}
				var timezoneOffset = oFF.UserProfileAdapterOrca.extractInt(paramMap, oFF.UserProfileAdapterOrca.TIMEZONE);
				if (oFF.notNull(timezoneOffset))
				{
					var timezoneId = oFF.XStringUtils.concatenate2("#", oFF.XInteger.convertToString(timezoneOffset.getInteger()));
					userProfile.setTimeZoneId(timezoneId);
				}
				var decimalFormatJson = oFF.UserProfileAdapterOrca.extractString(paramMap, oFF.UserProfileAdapterOrca.DECIMAL_FORMAT);
				var decimalElement = oFF.JsonParserFactory.createFromString(decimalFormatJson);
				if (oFF.notNull(decimalElement) && decimalElement.isStructure())
				{
					var decimalFormatStructure = decimalElement;
					var decFormat = decimalFormatStructure.getStructureByKey("decimalFormat");
					var decimalSeparator = decFormat.getStringByKey("decimalSeparator");
					userProfile.setDecimalSeparator(decimalSeparator);
					var groupingSeparator = decFormat.getStringByKey("groupingSeparator");
					userProfile.setDecimalGroupingSeparator(groupingSeparator);
				}
				var remainingKeys = paramMap.getKeysAsReadOnlyListOfString();
				for (var k = 0; k < remainingKeys.size(); k++)
				{
					var currentKey = remainingKeys.get(k);
					var currentValue = oFF.UserProfileAdapterOrca.getString(paramMap, currentKey);
					userProfile.setInternalProperty(currentKey, currentValue);
				}
				var featureToggleList = document.getListByKey(oFF.UserProfileAdapterOrca.FEATURES);
				for (var m = 0; m < featureToggleList.size(); m++)
				{
					var currentFeature = featureToggleList.getStructureAt(m);
					var featureId = currentFeature.getStringByKey(oFF.UserProfileAdapterOrca.ID);
					var isActive = currentFeature.getBooleanByKeyExt(oFF.UserProfileAdapterOrca.ACTIVE, true);
					userProfile.setFeatureToggle(featureId, isActive);
				}
				var orcaSessionStructure = document.getStructureByKey(oFF.UserProfileAdapterOrca.SESSION);
				if (oFF.notNull(orcaSessionStructure))
				{
					var tenantList = orcaSessionStructure.getListByKey(oFF.UserProfileAdapterOrca.TENANT);
					if (oFF.notNull(tenantList) && tenantList.size() > 0)
					{
						var tenant0 = tenantList.getStructureAt(0);
						var tenantId = tenant0.getStringByKey(oFF.UserProfileAdapterOrca.ID);
						if (oFF.XStringUtils.isNotNullAndNotEmpty(tenantId))
						{
							userProfile.setTenantId(tenantId);
						}
					}
				}
			}
		}
		return isApplicable;
	},
	extractString:function(paramMap, name)
	{
			var value = null;
		var structure = paramMap.getByKey(name);
		if (oFF.notNull(structure))
		{
			value = structure.getStringByKey(oFF.UserProfileAdapterOrca.VALUE);
			paramMap.remove(name);
		}
		return value;
	},
	getString:function(paramMap, name)
	{
			var value = null;
		var structure = paramMap.getByKey(name);
		if (oFF.notNull(structure))
		{
			value = structure.getStringByKey(oFF.UserProfileAdapterOrca.VALUE);
		}
		return value;
	},
	extractInt:function(paramMap, name)
	{
			var value = null;
		var structure = paramMap.getByKey(name);
		if (oFF.notNull(structure))
		{
			if (structure.containsKey(oFF.UserProfileAdapterOrca.VALUE))
			{
				var element = structure.getByKey(oFF.UserProfileAdapterOrca.VALUE);
				if (oFF.notNull(element) && element.isInteger())
				{
					var intValue = element.getInteger();
					value = oFF.XIntegerValue.create(intValue);
				}
			}
			paramMap.remove(name);
		}
		return value;
	},
	serialize:function(userProfile, document) {}
};

oFF.UserProfileConstants = {

	USER_ENABLED:"profile.userEnabled",
	USER_NAME:"profile.username",
	USER_ID:"profile.userId",
	DISPLAY_NAME:"profile.displayName",
	SAP_NAME:"profile.SAPName",
	DESCRIPTION:"profile.description",
	FULL_NAME:"profile.fullName",
	TITLE:"profile.title",
	LAST_NAME:"profile.lastName",
	FIRST_NAME:"profile.firstName",
	LANGUAGE:"profile.language",
	DATA_ACCESS_LANGUAGE:"profile.languageDataAccess",
	THUMBNAIL_PHOTO:"profile.thumbnailPhoto",
	EMAIL:"profile.email",
	EMAIL_PRODUCT_UPDATE_NOTIFICATION:"profile.emailProductUpdateNotification",
	EMAIL_SYSTEM_NOTIFICATION:"profile.emailSystemNotification",
	PHONE_NUMBER:"profile.phoneNumber",
	FAX_NUMBER:"profile.faxNumber",
	MOBILE:"profile.mobilePhoneNumber",
	DEPARTMENT:"profile.department",
	COST_CENTER:"profile.costCenter",
	COST_CENTER_ID:"profile.costCenterId",
	ORG_UNIT:"profile.orgUnit",
	ROOM_NUMBER:"profile.roomNumber",
	COMPANY:"profile.company",
	COUNTRY:"profile.country",
	REGION:"profile.region",
	CITY:"profile.city",
	ZIP_CODE:"profile.zipCode",
	STREET_NAME:"profile.streetName",
	DELIVERY_OFFICE_NAME:"profile.deliveryOfficeName",
	MANAGER_ID:"profile.managerId",
	HOME_DIR:"profile.unixHomeDirectory",
	ACCOUNT_TYPE:"profile.accountType",
	TELEPHONE_ASSISTANT:"profile.phoneAssistant",
	EXCHANGE_USAGE_LOCATION:"profile.exchangeUsageLocation",
	SAP_OBJECT_STATUS:"profile.SAPObjectStatus",
	MAIN_APP:"profile.mainApp",
	CLEAN_UP_NOTIFICATION:"profile.cleanUpNotification",
	DATE_FORMAT:"profile.dateFormat",
	DECIMAL_FORMAT:"profile.decimalFormat",
	SCALE_FORMAT:"profile.scaleFormat",
	TIME_FORMAT:"profile.timeFormat",
	CURRENCY_POS:"profile.currencyPos",
	TENANT_ID:"profile.tenantId",
	TIMEZONE_ID:"profile.timezoneId",
	DECIMAL_SEPARATOR:"profile.decimalSeparator",
	GROUPING_SEPARATOR:"profile.groupingSeparator",
	ENCRYPTION_TOKEN:"profile.encryptionToken",
	CACHE_SCHEMA:"profile.cacheSchema",
	PREFIX_PROFILE:"profile.",
	PREFIX_INTERNAL:"internal.",
	PREFIX_FEATURE_TOGGLE:"toggle."
};

oFF.BasicCredentialsProvider = function() {};
oFF.BasicCredentialsProvider.prototype = new oFF.CredentialsFactory();
oFF.BasicCredentialsProvider.prototype._ff_c = "BasicCredentialsProvider";

oFF.BasicCredentialsProvider.staticSetup = function()
{
	oFF.CredentialsFactory.registerFactory(oFF.CredentialsFactory.BASIC_CREDENTIALS_PROVIDER, new oFF.BasicCredentialsProvider());
};
oFF.BasicCredentialsProvider.prototype.m_runtimeUserManager = null;
oFF.BasicCredentialsProvider.prototype.m_authMap = null;
oFF.BasicCredentialsProvider.prototype.newCredentialsProvider = function(runtimeUserManager)
{
	var credentialsProvider = new oFF.BasicCredentialsProvider();
	credentialsProvider.m_runtimeUserManager = runtimeUserManager;
	credentialsProvider.m_authMap = oFF.XHashMapByString.create();
	return credentialsProvider;
};
oFF.BasicCredentialsProvider.prototype.processGetCredentials = function(syncType, listener, customIdentifier, connection, credentialsCallCounter, response, messages, changedType)
{
	var sysKey = this.extractUniqueKey(connection.getSystemDescription());
	if (oFF.notNull(changedType))
	{
		this.m_authMap.put(sysKey, changedType);
	}
	var authType = this.m_authMap.getByKey(sysKey);
	return oFF.BasicCredentialsAction.createAndRun(syncType, listener, customIdentifier, this.m_runtimeUserManager, connection, messages, authType);
};
oFF.BasicCredentialsProvider.prototype.notifyCredentialsSuccess = function(connection) {};
oFF.BasicCredentialsProvider.prototype.supportsOnErrorHandling = function()
{
	return false;
};
oFF.BasicCredentialsProvider.prototype.extractUniqueKey = function(system)
{
	var key = system.getUrlStringExt(true, false, false, false, true, false, false, false);
	return key;
};

oFF.XHttpFileSystemFactory = function() {};
oFF.XHttpFileSystemFactory.prototype = new oFF.XFileSystemFactory();
oFF.XHttpFileSystemFactory.prototype._ff_c = "XHttpFileSystemFactory";

oFF.XHttpFileSystemFactory.staticSetup = function()
{
	var factory = new oFF.XHttpFileSystemFactory();
	oFF.XFileSystemFactory.registerFactory(oFF.XFileSystemType.SIMPLE_WEB, factory);
	oFF.XFileSystemFactory.registerFactory(oFF.XFileSystemType.REMOTE_WEB, factory);
};
oFF.XHttpFileSystemFactory.prototype.newFileSystem = function(session, type)
{
	var httpFileSystem;
	if (type === oFF.XFileSystemType.REMOTE_WEB)
	{
		httpFileSystem = oFF.XRemoteHttpFileSystem.create(session);
	}
	else
	{
		httpFileSystem = oFF.XHttpFileSystem.create(session);
	}
	return httpFileSystem;
};

oFF.VfsFactory = function() {};
oFF.VfsFactory.prototype = new oFF.SubSystemFactory();
oFF.VfsFactory.prototype._ff_c = "VfsFactory";

oFF.VfsFactory.staticSetup = function()
{
	oFF.SubSystemFactory.registerFactory(oFF.SubSystemType.VIRTUAL_FILE_SYSTEM, new oFF.VfsFactory());
};
oFF.VfsFactory.prototype.newSubSystem = function(process)
{
	return oFF.VfsFileSystem.create(process);
};

oFF.XWebDAVFactory = function() {};
oFF.XWebDAVFactory.prototype = new oFF.XFileSystemFactory();
oFF.XWebDAVFactory.prototype._ff_c = "XWebDAVFactory";

oFF.XWebDAVFactory.staticSetup = function()
{
	oFF.XFileSystemFactory.registerFactory(oFF.XFileSystemType.WEBDAV, new oFF.XWebDAVFactory());
};
oFF.XWebDAVFactory.prototype.newFileSystem = function(session, type)
{
	return oFF.XWebDAV.createWebDav(session, null);
};

oFF.RpcHttpFunctionFactory = function() {};
oFF.RpcHttpFunctionFactory.prototype = new oFF.RpcFunctionFactory();
oFF.RpcHttpFunctionFactory.prototype._ff_c = "RpcHttpFunctionFactory";

oFF.RpcHttpFunctionFactory.staticSetup = function()
{
	var newFactory = new oFF.RpcHttpFunctionFactory();
	oFF.RpcFunctionFactory.registerFactory(oFF.ProtocolType.HTTP, null, newFactory);
	oFF.RpcFunctionFactory.registerFactory(oFF.ProtocolType.HTTPS, null, newFactory);
	oFF.RpcFunctionFactory.registerDefaultFactory(newFactory);
};
oFF.RpcHttpFunctionFactory.prototype.newRpcFunction = function(context, connectionInfo, name, systemType, protocolType)
{
	var relativeUri = oFF.XUri.createFromUrl(name);
	var connectionContainer = context;
	return oFF.RpcHttpFunction.create(connectionContainer, relativeUri);
};

oFF.ServerMetadata = function() {};
oFF.ServerMetadata.prototype = new oFF.XObject();
oFF.ServerMetadata.prototype._ff_c = "ServerMetadata";

oFF.ServerMetadata.create = function(session, rootElement, systemDescription)
{
	var object = new oFF.ServerMetadata();
	object.setupExt(session, rootElement, systemDescription);
	return object;
};
oFF.ServerMetadata.createCapabilitiesContainer = function(session, currentService, selectName)
{
	var serviceName = currentService.getStringByKey(oFF.InAConstantsBios.PR_SERVICE);
	var container = oFF.CapabilityContainer.create(serviceName);
	var capabilitiesList = currentService.getListByKey(selectName);
	if (oFF.notNull(capabilitiesList))
	{
		var capabilitiesSize = capabilitiesList.size();
		for (var idxCapability = 0; idxCapability < capabilitiesSize; idxCapability++)
		{
			var inaCapability = capabilitiesList.getStructureAt(idxCapability);
			var capabilityName = inaCapability.getStringByKey(oFF.InAConstantsBios.PR_CAPABILITY);
			if (oFF.isNull(capabilityName))
			{
				session.getLogger().log2("WARNING: found capability with empty (NULL) name. This capability will be ignored. The current service is: ", serviceName);
				continue;
			}
			var value = inaCapability.getStringByKey(oFF.InAConstantsBios.PR_VALUE);
			container.addCapabilityInfo(oFF.Capability.createCapabilityInfo(capabilityName, value));
		}
	}
	return container;
};
oFF.ServerMetadata.prototype.m_systemDescription = null;
oFF.ServerMetadata.prototype.m_rootStructure = null;
oFF.ServerMetadata.prototype.m_serverServiceMetadata = null;
oFF.ServerMetadata.prototype.m_serverBetaServiceMetadata = null;
oFF.ServerMetadata.prototype.m_properties = null;
oFF.ServerMetadata.prototype.releaseObject = function()
{
	this.m_properties = oFF.XObjectExt.release(this.m_properties);
	this.m_serverServiceMetadata = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_serverServiceMetadata);
	this.m_serverBetaServiceMetadata = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_serverBetaServiceMetadata);
	this.m_rootStructure = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.ServerMetadata.prototype.setupExt = function(session, rootElement, systemDescription)
{
	this.m_properties = oFF.XProperties.create();
	this.m_serverServiceMetadata = oFF.XHashMapByString.create();
	this.m_serverBetaServiceMetadata = oFF.XHashMapByString.create();
	this.m_systemDescription = systemDescription;
	this.m_rootStructure = rootElement;
	if (oFF.isNull(this.m_rootStructure))
	{
		this.m_serverBetaServiceMetadata.put(oFF.ServerService.ANALYTIC, oFF.CapabilityContainer.create(null));
		this.m_serverServiceMetadata.put(oFF.ServerService.ANALYTIC, oFF.CapabilityContainer.create(null));
	}
	else
	{
		if (this.m_rootStructure.containsKey(oFF.InAConstantsBios.PR_SERVICES))
		{
			var services = this.m_rootStructure.getListByKey(oFF.InAConstantsBios.PR_SERVICES);
			var size = services.size();
			for (var i = 0; i < size; i++)
			{
				var service = services.getStructureAt(i);
				var capabilitiesContainer = oFF.ServerMetadata.createCapabilitiesContainer(session, service, oFF.InAConstantsBios.PR_CAPABILITIES);
				this.m_serverServiceMetadata.putIfNotNull(capabilitiesContainer.getName(), capabilitiesContainer);
				var capabilitiesContainerDev = oFF.ServerMetadata.createCapabilitiesContainer(session, service, oFF.InAConstantsBios.PR_CAPABILITIESDEV);
				this.m_serverBetaServiceMetadata.putIfNotNull(capabilitiesContainerDev.getName(), capabilitiesContainerDev);
			}
		}
		this.readProperties(oFF.InAConstantsBios.PR_SETTINGS);
		this.readProperties(oFF.InAConstantsBios.PR_SERVER_INFO);
	}
};
oFF.ServerMetadata.prototype.addLogonInfo = function(data)
{
	var sessionStructure = data.getStructureByKey("session");
	if (oFF.notNull(sessionStructure))
	{
		var tenant = sessionStructure.getListByKey("tenant");
		if (oFF.XCollectionUtils.hasElements(tenant))
		{
			this.m_properties.put(oFF.InAConstantsBios.PR_SI_TENANT, tenant.getStructureAt(0).getStringByKey("id"));
		}
	}
	var userStructure = data.getStructureByKey("user");
	if (oFF.notNull(userStructure))
	{
		var userName = userStructure.getStringByKey("userName");
		if (oFF.isNull(userName))
		{
			var userMetadataStructure = userStructure.getStructureByKey("metadata");
			userName = userMetadataStructure.getStringByKey("userName");
		}
		this.m_properties.put(oFF.InAConstantsBios.PR_SI_USER_NAME, userName);
	}
	var config = data.getListByKey("config");
	if (oFF.notNull(config))
	{
		var configIter = config.getIterator();
		while (configIter.hasNext())
		{
			var configElement = configIter.next().asStructure();
			if (oFF.XString.isEqual("PUBLIC_FQDN", configElement.getStringByKey("name")))
			{
				var value = configElement.getStringByKey("value");
				if (!oFF.XStringUtils.isNullOrEmpty(value))
				{
					this.m_properties.put(oFF.InAConstantsBios.PR_SI_PUBLIC_URL, oFF.XStringUtils.concatenate2("https://", value));
				}
			}
		}
	}
};
oFF.ServerMetadata.prototype.readProperties = function(name)
{
	if (this.m_rootStructure.containsKey(name) && this.m_rootStructure.getElementTypeByKey(name) === oFF.PrElementType.STRUCTURE)
	{
		var serverInfo = this.m_rootStructure.getStructureByKey(name);
		var structureElementNames = serverInfo.getKeysAsReadOnlyListOfString();
		for (var j = 0; j < structureElementNames.size(); j++)
		{
			var key = structureElementNames.get(j);
			if (serverInfo.getElementTypeByKey(key) !== oFF.PrElementType.STRING)
			{
				continue;
			}
			var value = serverInfo.getStringByKey(key);
			this.m_properties.put(key, value);
		}
	}
};
oFF.ServerMetadata.prototype.getMetadataForService = function(name)
{
	return this.m_serverServiceMetadata.getByKey(name);
};
oFF.ServerMetadata.prototype.getBetaMetadataForService = function(name)
{
	return this.m_serverBetaServiceMetadata.getByKey(name);
};
oFF.ServerMetadata.prototype.getProperties = function()
{
	return this.m_properties;
};
oFF.ServerMetadata.prototype.getType = function()
{
	return this.m_properties.getByKey(oFF.InAConstantsBios.PR_SI_SERVER_TYPE);
};
oFF.ServerMetadata.prototype.getVersion = function()
{
	return this.m_properties.getByKey(oFF.InAConstantsBios.PR_SI_VERSION);
};
oFF.ServerMetadata.prototype.getId = function()
{
	return this.m_properties.getByKey(oFF.InAConstantsBios.PR_SI_SYSTEM_ID);
};
oFF.ServerMetadata.prototype.getBuildTime = function()
{
	return this.m_properties.getByKey(oFF.InAConstantsBios.PR_SI_BUILD_TIME);
};
oFF.ServerMetadata.prototype.getClient = function()
{
	return this.m_properties.getByKey(oFF.InAConstantsBios.PR_SI_CLIENT);
};
oFF.ServerMetadata.prototype.getTenantId = function()
{
	return this.m_properties.getByKey(oFF.InAConstantsBios.PR_SI_TENANT);
};
oFF.ServerMetadata.prototype.getOrcaUserName = function()
{
	return this.m_properties.getByKey(oFF.InAConstantsBios.PR_SI_USER_NAME);
};
oFF.ServerMetadata.prototype.getOrcaPublicUrl = function()
{
	return this.m_properties.getByKey(oFF.InAConstantsBios.PR_SI_PUBLIC_URL);
};
oFF.ServerMetadata.prototype.getUserLanguage = function()
{
	return this.m_properties.getByKey(oFF.InAConstantsBios.PR_SI_LANGUAGE);
};
oFF.ServerMetadata.prototype.getReentranceTicket = function()
{
	return this.m_properties.getByKey(oFF.InAConstantsBios.PR_SI_REENTRANCE_TICKET);
};
oFF.ServerMetadata.prototype.getServices = function()
{
	return this.m_serverServiceMetadata.getKeysAsReadOnlyListOfString();
};
oFF.ServerMetadata.prototype.supportsAnalyticCapability = function(capabilityName)
{
	return this.supportsAnalyticCapabilityAsProd(capabilityName) || this.supportsAnalyticCapabilityAsDev(capabilityName);
};
oFF.ServerMetadata.prototype.supportsAnalyticCapabilityAsProd = function(capabilityName)
{
	var analyticMain = this.getMetadataForService(oFF.ServerService.ANALYTIC);
	return oFF.isNull(analyticMain) ? false : analyticMain.containsKey(capabilityName);
};
oFF.ServerMetadata.prototype.supportsAnalyticCapabilityAsDev = function(capabilityName)
{
	var analyticDev = this.getBetaMetadataForService(oFF.ServerService.ANALYTIC);
	return oFF.isNull(analyticDev) ? false : analyticDev.containsKey(capabilityName);
};
oFF.ServerMetadata.prototype.getSystemDescription = function()
{
	return this.m_systemDescription;
};
oFF.ServerMetadata.prototype.toString = function()
{
	return this.m_rootStructure.toString();
};

oFF.DsrPassport = function() {};
oFF.DsrPassport.prototype = new oFF.XObject();
oFF.DsrPassport.prototype._ff_c = "DsrPassport";

oFF.DsrPassport.sapTraceLevel_Sql = 1;
oFF.DsrPassport.sapTraceLevel_Buffer = 2;
oFF.DsrPassport.sapTraceLevel_Enqueu = 4;
oFF.DsrPassport.sapTraceLevel_Rfc = 8;
oFF.DsrPassport.sapTraceLevel_Permission = 16;
oFF.DsrPassport.sapTraceLevel_Free = 32;
oFF.DsrPassport.sapTraceLevel_cFunction = 64;
oFF.DsrPassport.sapTraceLevel_AbapCondens0 = 256;
oFF.DsrPassport.sapTraceLevel_AbapCondens1 = 512;
oFF.DsrPassport.l1 = 0;
oFF.DsrPassport.createDsrPassport = function()
{
	var newInstance = new oFF.DsrPassport();
	newInstance.initialize();
	return newInstance;
};
oFF.DsrPassport.staticSetup = function()
{
	oFF.DsrPassport.l1 = oFF.DsrConstants.lenOfRecordIdField + oFF.DsrConstants.lenOfRecordLenField;
};
oFF.DsrPassport.prototype.m_traceFlag = 0;
oFF.DsrPassport.prototype.m_serviceType = 0;
oFF.DsrPassport.prototype.m_actionType = 0;
oFF.DsrPassport.prototype.m_systemId = null;
oFF.DsrPassport.prototype.m_prevSystemId = null;
oFF.DsrPassport.prototype.m_action = null;
oFF.DsrPassport.prototype.m_userId = null;
oFF.DsrPassport.prototype.m_transId = null;
oFF.DsrPassport.prototype.m_client = "   ";
oFF.DsrPassport.prototype.m_connectionId = null;
oFF.DsrPassport.prototype.m_rootContextId = null;
oFF.DsrPassport.prototype.m_connectionCounter = 0;
oFF.DsrPassport.prototype.m_appVarItemsLength = 0;
oFF.DsrPassport.prototype.m_sysVarItemsLength = 0;
oFF.DsrPassport.prototype.m_systemType = 2;
oFF.DsrPassport.prototype.m_version = 0;
oFF.DsrPassport.prototype.m_systemVariablePartItems = null;
oFF.DsrPassport.prototype.m_applicationVariablePartItems = null;
oFF.DsrPassport.prototype.initialize = function()
{
	this.m_version = oFF.DsrConstants.currentPassportVersion;
	this.m_systemVariablePartItems = oFF.XList.create();
	this.m_applicationVariablePartItems = oFF.XList.create();
};
oFF.DsrPassport.prototype.setRootContextId = function(rootContextId)
{
	if (oFF.isNull(rootContextId))
	{
		this.m_rootContextId = null;
		return;
	}
	var _rootContextId = oFF.XString.replace(rootContextId, "-", "");
	if (oFF.XString.size(_rootContextId) !== oFF.DsrConstants.rootContextLen * 2)
	{
		throw oFF.XException.createRuntimeException("Invalid Root Context Id. Must be a uuid in hex encoding!");
	}
	this.m_rootContextId = _rootContextId;
};
oFF.DsrPassport.prototype.getSystemVariablePartItems = function()
{
	return this.m_systemVariablePartItems;
};
oFF.DsrPassport.prototype.getApplicationVariablePartItems = function()
{
	return this.m_applicationVariablePartItems;
};
oFF.DsrPassport.prototype.setSystemType = function(systemType)
{
	this.m_systemType = systemType;
};
oFF.DsrPassport.prototype.getNetPassport = function()
{
	return oFF.DsrEncodeDecode.encodeBytePassport(this);
};
oFF.DsrPassport.prototype.setByPassport = function(passport) {};
oFF.DsrPassport.prototype.getNetPassportWithByteConnectionId = function(connId, connectionCounter)
{
	return oFF.DsrEncodeDecode.encodeBytePassportWithConnection(this, connId, null, connectionCounter);
};
oFF.DsrPassport.prototype.getNetPassportWithHexConnectionId = function(connId, connectionCounter)
{
	return oFF.DsrEncodeDecode.encodeBytePassportWithConnection(this, null, connId, connectionCounter);
};
oFF.DsrPassport.prototype.getTransId = function()
{
	return this.m_transId;
};
oFF.DsrPassport.prototype.getTraceFlag = function()
{
	return this.m_traceFlag;
};
oFF.DsrPassport.prototype.setService = function(srv)
{
	this.m_serviceType = srv;
};
oFF.DsrPassport.prototype.getService = function()
{
	return this.m_serviceType;
};
oFF.DsrPassport.prototype.getActionType = function()
{
	return this.m_actionType;
};
oFF.DsrPassport.prototype.getSystemId = function()
{
	return this.m_systemId;
};
oFF.DsrPassport.prototype.getPrevSystemId = function()
{
	return this.m_prevSystemId;
};
oFF.DsrPassport.prototype.getAction = function()
{
	return this.m_action;
};
oFF.DsrPassport.prototype.getUserId = function()
{
	return this.m_userId;
};
oFF.DsrPassport.prototype.getConnectionCounter = function()
{
	return this.m_connectionCounter;
};
oFF.DsrPassport.prototype.getClientNumber = function()
{
	return this.m_client;
};
oFF.DsrPassport.prototype.setClientNumber = function(clientNumber)
{
	this.m_client = clientNumber;
};
oFF.DsrPassport.prototype.getSystemType = function()
{
	return this.m_systemType;
};
oFF.DsrPassport.prototype.setByNetPassport = function(netPassport)
{
	oFF.DsrEncodeDecode.decodeBytePassport(this, netPassport);
};
oFF.DsrPassport.prototype.setVersion = function(version)
{
	this.m_version = version;
};
oFF.DsrPassport.prototype.setTraceFlag = function(traceFlag)
{
	this.m_traceFlag = traceFlag;
};
oFF.DsrPassport.prototype.setSystemId = function(systemId)
{
	if (oFF.notNull(systemId))
	{
		this.m_systemId = systemId;
	}
};
oFF.DsrPassport.prototype.setServiceType = function(serviceType)
{
	this.m_serviceType = serviceType;
};
oFF.DsrPassport.prototype.setUserId = function(userId)
{
	if (oFF.notNull(userId))
	{
		this.m_userId = userId;
	}
};
oFF.DsrPassport.prototype.setAction = function(action)
{
	if (oFF.notNull(action))
	{
		this.m_action = action;
	}
};
oFF.DsrPassport.prototype.setActionType = function(actionType)
{
	this.m_actionType = actionType;
};
oFF.DsrPassport.prototype.setPrevSystemId = function(prevSystemId)
{
	if (oFF.notNull(prevSystemId))
	{
		this.m_prevSystemId = prevSystemId;
	}
};
oFF.DsrPassport.prototype.setTransId = function(transId)
{
	if (oFF.notNull(transId))
	{
		var _transId = oFF.XString.replace(transId, "-", "");
		if (oFF.XString.size(_transId) !== oFF.DsrConstants.transIdLen * 2)
		{
			throw oFF.XException.createRuntimeException("Invalid transaction id. Must be a UUID in hex encoding!");
		}
		this.m_transId = _transId;
	}
};
oFF.DsrPassport.prototype.setPassport = function(pass)
{
	this.setVersion(3);
	this.setTraceFlag(pass.getTraceFlag());
	this.setSystemId(pass.getSystemId());
	this.setServiceType(pass.getService());
	this.setUserId(pass.getUserId());
	this.setAction(pass.getAction());
	this.setActionType(pass.getActionType());
	this.setPrevSystemId(pass.getPrevSystemId());
	this.setTransId(pass.getTransId());
	this.setClientNumber(pass.getClientNumber());
	this.setSystemType(pass.getSystemType());
	this.setRootContextId(pass.getRootContextId());
	this.setConnectionId(null);
	this.setConnectionCounter(0);
	this.m_systemVariablePartItems.clear();
	this.m_applicationVariablePartItems.clear();
	var varParts = pass.getVarItems();
	if (varParts.size() > 0)
	{
		for (var i = 0; i < varParts.size(); i++)
		{
			if (varParts.get(i).getVarPartType() === oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_SYSTEM)
			{
				this.m_systemVariablePartItems.add(varParts.get(i));
			}
			else
			{
				this.m_applicationVariablePartItems.add(varParts.get(i));
			}
		}
		this.m_sysVarItemsLength = pass.getSysVarItemsLength();
		this.m_appVarItemsLength = pass.getAppVarItemsLength();
	}
};
oFF.DsrPassport.prototype.getPassportArrayData = function(buf, offset)
{
	var pos = offset;
	try
	{
		oFF.DsrConvert.int2FourByte(oFF.DsrConstants.recordIdPassport, buf, pos);
		pos = pos + oFF.DsrPassport.l1;
		var passBytes = oFF.DsrEncodeDecode.encodeBytePassport(this);
		if (oFF.notNull(passBytes))
		{
			buf.setByteAt(pos, oFF.DsrConstants.fieldIdPassportBytes);
			pos = pos + oFF.DsrConstants.lenOfFieldIdField;
			buf.setByteAt(pos, oFF.DsrConstants.fieldTypeByteArray);
			pos = pos + oFF.DsrConstants.lenOfFieldTypeField;
			oFF.DsrConvert.int2TwoByte(passBytes.size(), buf, pos);
			pos = pos + oFF.DsrConstants.lenOfStringLenField;
			oFF.XByteArray.copy(passBytes, 0, buf, pos, passBytes.size());
			pos = pos + passBytes.size();
		}
		oFF.DsrConvert.int2TwoByte(pos - offset, buf, offset + oFF.DsrConstants.lenOfRecordIdField);
	}
	catch (e)
	{
		return 0;
	}
	return pos - offset;
};
oFF.DsrPassport.prototype.getVarItems = function()
{
	var temp = oFF.XArray.create(this.m_systemVariablePartItems.size() + this.m_applicationVariablePartItems.size());
	var pos = 0;
	for (var i = 0; i < this.m_systemVariablePartItems.size(); i++)
	{
		temp.set(pos, this.m_systemVariablePartItems.get(i));
		pos++;
	}
	for (var j = 0; j < this.m_applicationVariablePartItems.size(); j++)
	{
		temp.set(pos, this.m_applicationVariablePartItems.get(j));
		pos++;
	}
	return temp;
};
oFF.DsrPassport.prototype.addVarItemBytes = function(applID, applKey, bValue)
{
	var applVar = oFF.DsrtApplVarPart.createByByteArray(applID, applKey, bValue);
	this.m_applicationVariablePartItems.add(applVar);
	this.m_appVarItemsLength = this.m_appVarItemsLength + applVar.getLength();
};
oFF.DsrPassport.prototype.addVarItemInteger = function(applID, applKey, iValue)
{
	var applVar = oFF.DsrtApplVarPart.createByIntValue(applID, applKey, iValue);
	this.m_applicationVariablePartItems.add(applVar);
	this.m_appVarItemsLength = this.m_appVarItemsLength + applVar.getLength();
};
oFF.DsrPassport.prototype.addVarItemString = function(applID, applKey, sValue)
{
	var applVar = oFF.DsrtApplVarPart.createByStringValue(applID, applKey, sValue);
	this.m_applicationVariablePartItems.add(applVar);
	this.m_appVarItemsLength = this.m_appVarItemsLength + applVar.getLength();
};
oFF.DsrPassport.prototype.addVarItemGUID = function(applID, applKey, bValue)
{
	var applVar;
	if (bValue.size() > 16)
	{
		var tempByte = oFF.XByteArray.create(null, 16);
		oFF.XByteArray.copy(bValue, 0, tempByte, 0, 16);
		applVar = oFF.DsrtApplVarPart.createByByteArray(applID, applKey, tempByte);
	}
	else
	{
		applVar = oFF.DsrtApplVarPart.createByByteArray(applID, applKey, bValue);
	}
	applVar.setVarPartValueType(oFF.DsrtApplVarPart.GUID_TYPE);
	this.m_applicationVariablePartItems.add(applVar);
	this.m_appVarItemsLength = this.m_appVarItemsLength + applVar.getLength();
};
oFF.DsrPassport.prototype.addSystemVarItemBytes = function(applID, applKey, bValue)
{
	var sysVar = oFF.DsrtApplVarPart.createByByteArray(applID, applKey, bValue);
	sysVar.setVarPartType(oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_SYSTEM);
	this.m_systemVariablePartItems.add(sysVar);
	this.m_sysVarItemsLength = this.m_sysVarItemsLength + sysVar.getLength();
};
oFF.DsrPassport.prototype.addSystemVarItemInteger = function(applID, applKey, iValue)
{
	var sysVar = oFF.DsrtApplVarPart.createByIntValue(applID, applKey, iValue);
	sysVar.setVarPartType(oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_SYSTEM);
	this.m_systemVariablePartItems.add(sysVar);
	this.m_sysVarItemsLength = this.m_sysVarItemsLength + sysVar.getLength();
};
oFF.DsrPassport.prototype.addSystemVarItemString = function(applID, applKey, sValue)
{
	var sysVar = oFF.DsrtApplVarPart.createByStringValue(applID, applKey, sValue);
	sysVar.setVarPartType(oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_SYSTEM);
	this.m_systemVariablePartItems.add(sysVar);
	this.m_sysVarItemsLength = this.m_sysVarItemsLength + sysVar.getLength();
};
oFF.DsrPassport.prototype.addSystemVarItemGUID = function(applID, applKey, bValue)
{
	var sysVar;
	if (bValue.size() > 16)
	{
		var tempByte = oFF.XByteArray.create(null, 16);
		oFF.XByteArray.copy(bValue, 0, tempByte, 0, 16);
		sysVar = oFF.DsrtApplVarPart.createByByteArray(applID, applKey, tempByte);
	}
	else
	{
		sysVar = oFF.DsrtApplVarPart.createByByteArray(applID, applKey, bValue);
	}
	sysVar.setVarPartValueType(oFF.DsrtApplVarPart.GUID_TYPE);
	sysVar.setVarPartType(oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_SYSTEM);
	this.m_systemVariablePartItems.add(sysVar);
	this.m_sysVarItemsLength = this.m_sysVarItemsLength + sysVar.getLength();
};
oFF.DsrPassport.prototype.getItem = function(applID, applKey)
{
	var varItem;
	for (var i = 0; i < this.m_systemVariablePartItems.size(); i++)
	{
		varItem = this.m_systemVariablePartItems.get(i);
		if (varItem.getApplId() === applID && varItem.getKey() === applKey)
		{
			return varItem;
		}
	}
	for (var j = 0; j < this.m_applicationVariablePartItems.size(); j++)
	{
		varItem = this.m_applicationVariablePartItems.get(j);
		if (varItem.getApplId() === applID && varItem.getKey() === applKey)
		{
			return varItem;
		}
	}
	return null;
};
oFF.DsrPassport.prototype.getVarItemsLength = function()
{
	var res = 0;
	if (this.m_systemVariablePartItems.size() > 0)
	{
		res = res + this.m_sysVarItemsLength;
		res = res + oFF.DsrConstants.VARIABLE_PART_HEADER_LENGTH;
	}
	if (this.m_applicationVariablePartItems.size() > 0)
	{
		res = res + this.m_appVarItemsLength;
		res = res + oFF.DsrConstants.VARIABLE_PART_HEADER_LENGTH;
	}
	return res;
};
oFF.DsrPassport.prototype.getVarItemsCount = function()
{
	var res = 0;
	if (this.m_systemVariablePartItems.size() > 0)
	{
		res++;
	}
	if (this.m_applicationVariablePartItems.size() > 0)
	{
		res++;
	}
	return res;
};
oFF.DsrPassport.prototype.getAppVarItemsLength = function()
{
	return this.m_appVarItemsLength;
};
oFF.DsrPassport.prototype.getSysVarItemsLength = function()
{
	return this.m_sysVarItemsLength;
};
oFF.DsrPassport.prototype.getConnectionId = function()
{
	return this.m_connectionId;
};
oFF.DsrPassport.prototype.setConnectionCounter = function(connectionCounter)
{
	this.m_connectionCounter = connectionCounter;
};
oFF.DsrPassport.prototype.setConnectionId = function(connectionId)
{
	if (oFF.notNull(connectionId))
	{
		var _connectionId = oFF.XString.replace(connectionId, "-", "");
		if (oFF.XString.size(_connectionId) !== oFF.DsrConstants.connectionIdLen * 2)
		{
			throw oFF.XException.createRuntimeException("Invalid connection id length. Must be a uuid in hex encoding!");
		}
		this.m_connectionId = _connectionId;
	}
};
oFF.DsrPassport.prototype.getRootContextId = function()
{
	return this.m_rootContextId;
};
oFF.DsrPassport.prototype.getVersion = function()
{
	return this.m_version;
};

oFF.DsrtApplVarPart = function() {};
oFF.DsrtApplVarPart.prototype = new oFF.XObject();
oFF.DsrtApplVarPart.prototype._ff_c = "DsrtApplVarPart";

oFF.DsrtApplVarPart.BYTE_TYPE = 1;
oFF.DsrtApplVarPart.INTEGER_TYPE = 2;
oFF.DsrtApplVarPart.GUID_TYPE = 3;
oFF.DsrtApplVarPart.STRING_TYPE = 4;
oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_SYSTEM = 1;
oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_APPLICATION = 2;
oFF.DsrtApplVarPart.createByByteArray = function(applId, applKey, bValue)
{
	var newInstance = new oFF.DsrtApplVarPart();
	newInstance.m_applId = applId;
	newInstance.m_applKey = applKey;
	newInstance.m_type = oFF.DsrtApplVarPart.BYTE_TYPE;
	newInstance.m_byteValue = bValue;
	newInstance.setByteArrayLength(newInstance.m_byteValue);
	newInstance.m_varPartType = oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_APPLICATION;
	return newInstance;
};
oFF.DsrtApplVarPart.createByIntValue = function(applId, applKey, iValue)
{
	var newInstance = new oFF.DsrtApplVarPart();
	newInstance.m_applId = applId;
	newInstance.m_applKey = applKey;
	newInstance.m_type = oFF.DsrtApplVarPart.INTEGER_TYPE;
	newInstance.m_intValue = iValue;
	newInstance.setIntegerLength(newInstance.m_intValue);
	newInstance.m_varPartType = oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_APPLICATION;
	return newInstance;
};
oFF.DsrtApplVarPart.createByStringValue = function(applId, applKey, sValue)
{
	var newInstance = new oFF.DsrtApplVarPart();
	newInstance.m_applId = applId;
	newInstance.m_applKey = applKey;
	newInstance.m_type = oFF.DsrtApplVarPart.STRING_TYPE;
	newInstance.m_strValue = sValue;
	newInstance.setStringLength(newInstance.m_strValue);
	newInstance.m_varPartType = oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_APPLICATION;
	return newInstance;
};
oFF.DsrtApplVarPart.prototype.m_applId = 0;
oFF.DsrtApplVarPart.prototype.m_applKey = 0;
oFF.DsrtApplVarPart.prototype.m_type = 0;
oFF.DsrtApplVarPart.prototype.m_length = 0;
oFF.DsrtApplVarPart.prototype.m_byteValue = null;
oFF.DsrtApplVarPart.prototype.m_intValue = 0;
oFF.DsrtApplVarPart.prototype.m_strValue = "";
oFF.DsrtApplVarPart.prototype.m_varPartType = 0;
oFF.DsrtApplVarPart.prototype.getByteArray = function()
{
	var offset = 0;
	var byteArray = oFF.XByteArray.create(null, this.m_length);
	oFF.DsrConvert.int2TwoByte(this.m_applId, byteArray, offset);
	offset = offset + 2;
	oFF.DsrConvert.int2TwoByte(this.m_applKey, byteArray, offset);
	offset = offset + 2;
	oFF.DsrConvert.int2OneByte(this.m_type, byteArray, offset);
	offset = offset + 1;
	oFF.DsrConvert.int2TwoByte(this.m_length, byteArray, offset);
	offset = offset + 2;
	if (this.m_type === oFF.DsrtApplVarPart.BYTE_TYPE || this.m_type === oFF.DsrtApplVarPart.GUID_TYPE)
	{
		oFF.XByteArray.copy(this.m_byteValue, 0, byteArray, offset, this.m_byteValue.size());
	}
	else if (this.m_type === oFF.DsrtApplVarPart.STRING_TYPE)
	{
		var strBytes = oFF.XByteArray.convertFromString(this.m_strValue);
		oFF.XByteArray.copy(strBytes, 0, byteArray, offset, strBytes.size());
	}
	else if (this.m_type === oFF.DsrtApplVarPart.INTEGER_TYPE)
	{
		oFF.DsrConvert.int2FourByte(this.m_intValue, byteArray, offset);
	}
	return byteArray;
};
oFF.DsrtApplVarPart.prototype.getApplId = function()
{
	return this.m_applId;
};
oFF.DsrtApplVarPart.prototype.getKey = function()
{
	return this.m_applKey;
};
oFF.DsrtApplVarPart.prototype.getVarPartValueType = function()
{
	return this.m_type;
};
oFF.DsrtApplVarPart.prototype.getLength = function()
{
	return this.m_length;
};
oFF.DsrtApplVarPart.prototype.getBytes = function()
{
	return this.m_byteValue;
};
oFF.DsrtApplVarPart.prototype.getIntValue = function()
{
	return this.m_intValue;
};
oFF.DsrtApplVarPart.prototype.getStrValue = function()
{
	return this.m_strValue;
};
oFF.DsrtApplVarPart.prototype.setApplId = function(applId)
{
	this.m_applId = applId;
};
oFF.DsrtApplVarPart.prototype.setKey = function(applKey)
{
	this.m_applKey = applKey;
};
oFF.DsrtApplVarPart.prototype.setVarPartValueType = function(type)
{
	this.m_type = type;
};
oFF.DsrtApplVarPart.prototype.setByteArrayLength = function(bValue)
{
	this.m_length = 7 + bValue.size();
};
oFF.DsrtApplVarPart.prototype.setIntegerLength = function(iValue)
{
	this.m_length = 11;
};
oFF.DsrtApplVarPart.prototype.setStringLength = function(strValue)
{
	if (oFF.isNull(strValue))
	{
		return;
	}
	this.m_length = 7 + oFF.XByteArray.convertFromString(strValue).size();
};
oFF.DsrtApplVarPart.prototype.setByteValue = function(bValue)
{
	this.m_byteValue = bValue;
};
oFF.DsrtApplVarPart.prototype.setIntValue = function(intValue)
{
	this.m_intValue = intValue;
};
oFF.DsrtApplVarPart.prototype.setStrValue = function(strValue)
{
	this.m_strValue = strValue;
};
oFF.DsrtApplVarPart.prototype.getVarPartType = function()
{
	return this.m_varPartType;
};
oFF.DsrtApplVarPart.prototype.setVarPartType = function(varPartType)
{
	this.m_varPartType = varPartType;
};

oFF.SubSysUserProfileBootstrapFactory = function() {};
oFF.SubSysUserProfileBootstrapFactory.prototype = new oFF.SubSystemFactory();
oFF.SubSysUserProfileBootstrapFactory.prototype._ff_c = "SubSysUserProfileBootstrapFactory";

oFF.SubSysUserProfileBootstrapFactory.staticSetup = function()
{
	oFF.SubSystemFactory.registerFactory(oFF.SubSystemType.USER_PROFILE, new oFF.SubSysUserProfileBootstrapFactory());
};
oFF.SubSysUserProfileBootstrapFactory.prototype.newSubSystem = function(process)
{
	return oFF.SubSysUserProfileBootstrap.create(process);
};

oFF.VfsLookupResult = function() {};
oFF.VfsLookupResult.prototype = new oFF.XObjectExt();
oFF.VfsLookupResult.prototype._ff_c = "VfsLookupResult";

oFF.VfsLookupResult.create = function(mountPoint, pathFromHere)
{
	var newObj = new oFF.VfsLookupResult();
	newObj.m_mountPoint = mountPoint;
	newObj.m_pathFromHere = pathFromHere;
	return newObj;
};
oFF.VfsLookupResult.prototype.m_mountPoint = null;
oFF.VfsLookupResult.prototype.m_pathFromHere = null;
oFF.VfsLookupResult.prototype.getMountPoint = function()
{
	return this.m_mountPoint;
};
oFF.VfsLookupResult.prototype.getPath = function()
{
	return this.m_pathFromHere;
};

oFF.RpcCacheFingerprintGeneratorAutoDetect = function() {};
oFF.RpcCacheFingerprintGeneratorAutoDetect.prototype = new oFF.XObjectExt();
oFF.RpcCacheFingerprintGeneratorAutoDetect.prototype._ff_c = "RpcCacheFingerprintGeneratorAutoDetect";

oFF.RpcCacheFingerprintGeneratorAutoDetect.create = function()
{
	var newObj = new oFF.RpcCacheFingerprintGeneratorAutoDetect();
	return newObj;
};
oFF.RpcCacheFingerprintGeneratorAutoDetect.prototype.generateCacheFingerprint = function(request)
{
	var fingerprint = null;
	var serializedJsonString = null;
	var buffer = oFF.XStringBuffer.create();
	var requestType = request.getRequestType();
	buffer.append(request.getMethod().getName()).append(":");
	buffer.append(requestType.getName()).append(":");
	if (requestType.isTypeOf(oFF.RpcRequestType.INA) === false)
	{
		buffer.append(request.getConnectionInfo().getPath());
	}
	buffer.append(":");
	var requestStructure = request.getRequestStructure();
	if (oFF.notNull(requestStructure))
	{
		var requestStructureClone = requestStructure.clone();
		this.cleanupRequest(requestStructureClone);
		serializedJsonString = oFF.PrUtils.serialize(requestStructureClone, true, false, 0);
		buffer.append(serializedJsonString);
	}
	var sourceForFingerprint = buffer.toString();
	fingerprint = oFF.XSha1.createSHA1(sourceForFingerprint);
	return fingerprint;
};
oFF.RpcCacheFingerprintGeneratorAutoDetect.prototype.cleanupRequest = function(requestStructure)
{
	var inaMetadata = requestStructure.getStructureByKey("Metadata");
	var inaCore = null;
	if (oFF.notNull(inaMetadata))
	{
		inaCore = inaMetadata;
	}
	else
	{
		var inaAnalytics = requestStructure.getStructureByKey("Analytics");
		if (oFF.notNull(inaAnalytics))
		{
			inaCore = inaAnalytics;
		}
	}
	if (oFF.notNull(inaCore))
	{
		var inaDataSource = inaCore.getStructureByKey("DataSource");
		if (oFF.notNull(inaDataSource))
		{
			inaDataSource.remove("InstanceId");
		}
	}
};

oFF.SystemKeepAliveManager = function() {};
oFF.SystemKeepAliveManager.prototype = new oFF.XObjectExt();
oFF.SystemKeepAliveManager.prototype._ff_c = "SystemKeepAliveManager";

oFF.SystemKeepAliveManager.create = function(systemConnect)
{
	var systemKeepAliveManager = new oFF.SystemKeepAliveManager();
	systemKeepAliveManager.m_systemConnect = systemConnect;
	systemKeepAliveManager.m_isNotBw = !systemConnect.getSystemDescription().getSystemType().isTypeOf(oFF.SystemType.BW);
	systemKeepAliveManager.connectionsWithErrors = oFF.XHashMapByString.create();
	systemKeepAliveManager.listeners = oFF.XList.create();
	return systemKeepAliveManager;
};
oFF.SystemKeepAliveManager.prototype.m_systemConnect = null;
oFF.SystemKeepAliveManager.prototype.m_isNotBw = false;
oFF.SystemKeepAliveManager.prototype.m_isStopped = false;
oFF.SystemKeepAliveManager.prototype.m_timerHandle = null;
oFF.SystemKeepAliveManager.prototype.connectionsWithErrors = null;
oFF.SystemKeepAliveManager.prototype.listeners = null;
oFF.SystemKeepAliveManager.prototype.startPolling = function()
{
	this.m_isStopped = false;
	var keepAliveDelayMs = this.m_systemConnect.getSystemDescription().getKeepAliveDelayMs();
	this.connectionsWithErrors.clear();
	if (oFF.isNull(this.m_timerHandle) && keepAliveDelayMs > 0)
	{
		this.m_timerHandle = oFF.Dispatcher.getInstance().registerTimer(keepAliveDelayMs, this, null);
	}
};
oFF.SystemKeepAliveManager.prototype.onTimerEvent = function(timerHandle, customIdentifier)
{
	if (this.m_isStopped || this.m_systemConnect.isReleased())
	{
		return;
	}
	if (oFF.isNull(customIdentifier))
	{
		var allOpenConnections = this.m_systemConnect.getAllOpenConnections(oFF.XList.create());
		var iterator = allOpenConnections.getIterator();
		while (iterator.hasNext())
		{
			oFF.Dispatcher.getInstance().registerTimer(oFF.XMath.random(10), this, iterator.next());
		}
		this.m_timerHandle = oFF.Dispatcher.getInstance().registerTimer(this.m_systemConnect.getSystemDescription().getKeepAliveIntervalMs(), this, null);
	}
	else
	{
		var syncType = oFF.XPlatform.getPlatform().isTypeOf(oFF.XPlatform.BROWSER) ? oFF.SyncType.NON_BLOCKING : this.m_systemConnect.getSession().getDefaultSyncType();
		var connection = customIdentifier;
		if (connection.isReleased())
		{
			return;
		}
		var connectionErrors = this.connectionsWithErrors.getByKey(connection.getConnectionUid());
		if (oFF.isNull(connectionErrors) || connectionErrors.getInteger() < 2)
		{
			oFF.ServerMetadataAction.create(syncType, connection, this, connection, this.m_isNotBw).process();
		}
	}
};
oFF.SystemKeepAliveManager.prototype.stopPolling = function()
{
	this.m_isStopped = true;
	if (oFF.notNull(this.m_timerHandle))
	{
		oFF.Dispatcher.getInstance().unregisterTimer(this.m_timerHandle);
		this.m_timerHandle = null;
		this.connectionsWithErrors.clear();
	}
};
oFF.SystemKeepAliveManager.prototype.onServerMetadataLoaded = function(extResult, serverMetadata, customIdentifier)
{
	var result = oFF.KeepAliveResult.create(extResult);
	var connection = customIdentifier;
	if (extResult.hasErrors())
	{
		if (oFF.notNull(connection))
		{
			this.increaseNumberOfErrors(connection);
		}
		this.m_systemConnect.getSession().getLogger().logError(oFF.XStringUtils.concatenate3(this.m_systemConnect.getSystemName(), ": Keep Alive failed. Reason: ", extResult.getSummary()));
	}
	else
	{
		if (oFF.notNull(connection))
		{
			this.connectionsWithErrors.remove(connection.getConnectionUid());
		}
	}
	var iterator = this.listeners.getIterator();
	while (iterator.hasNext())
	{
		try
		{
			iterator.next().onKeepAlive(result);
		}
		catch (e)
		{
			var reason;
			if (oFF.XException.supportsStackTrace())
			{
				reason = oFF.XException.getStackTrace(e, 0);
			}
			else
			{
				reason = "Unknown";
			}
			this.m_systemConnect.getSession().getLogger().logError(oFF.XStringUtils.concatenate3(this.m_systemConnect.getSystemName(), ": Keep Alive notification failed. Reason: ", reason));
		}
	}
};
oFF.SystemKeepAliveManager.prototype.increaseNumberOfErrors = function(connection)
{
	var numberOfErrors = this.connectionsWithErrors.getByKey(connection.getConnectionUid());
	if (oFF.isNull(numberOfErrors))
	{
		numberOfErrors = oFF.XIntegerValue.create(1);
		this.connectionsWithErrors.put(connection.getConnectionUid(), numberOfErrors);
	}
	else
	{
		numberOfErrors.setInteger(numberOfErrors.getInteger() + 1);
	}
};
oFF.SystemKeepAliveManager.prototype.releaseObject = function()
{
	this.stopPolling();
	this.connectionsWithErrors = oFF.XObjectExt.release(this.connectionsWithErrors);
	this.m_systemConnect = null;
};
oFF.SystemKeepAliveManager.prototype.registerKeepAliveListener = function(listener)
{
	if (oFF.notNull(listener))
	{
		this.listeners.add(listener);
	}
};
oFF.SystemKeepAliveManager.prototype.unregisterKeepAliveListener = function(listener)
{
	if (oFF.notNull(listener))
	{
		this.listeners.removeElement(listener);
	}
};

oFF.HttpOptionCallProperties = function() {};
oFF.HttpOptionCallProperties.prototype = new oFF.XObjectExt();
oFF.HttpOptionCallProperties.prototype._ff_c = "HttpOptionCallProperties";

oFF.HttpOptionCallProperties.create = function()
{
	var result = new oFF.HttpOptionCallProperties();
	result.m_headers = oFF.XListOfString.create();
	return result;
};
oFF.HttpOptionCallProperties.prototype.m_headers = null;
oFF.HttpOptionCallProperties.prototype.m_method = null;
oFF.HttpOptionCallProperties.prototype.m_origin = null;
oFF.HttpOptionCallProperties.prototype.getHeaders = function()
{
	return this.m_headers;
};
oFF.HttpOptionCallProperties.prototype.getMethod = function()
{
	return this.m_method;
};
oFF.HttpOptionCallProperties.prototype.setMethod = function(method)
{
	this.m_method = method;
};
oFF.HttpOptionCallProperties.prototype.getOrigin = function()
{
	return this.m_origin;
};
oFF.HttpOptionCallProperties.prototype.setOrigin = function(origin)
{
	this.m_origin = origin;
};

oFF.HttpOptionCallResult = function() {};
oFF.HttpOptionCallResult.prototype = new oFF.XObjectExt();
oFF.HttpOptionCallResult.prototype._ff_c = "HttpOptionCallResult";

oFF.HttpOptionCallResult.create = function()
{
	var httpOptionCallResult = new oFF.HttpOptionCallResult();
	httpOptionCallResult.accessControlAllowHeaders = oFF.XListOfString.create();
	httpOptionCallResult.accessControlExposeHeaders = oFF.XListOfString.create();
	httpOptionCallResult.accessControlAllowMethods = oFF.XList.create();
	return httpOptionCallResult;
};
oFF.HttpOptionCallResult.prototype.controlAllowCredentials = false;
oFF.HttpOptionCallResult.prototype.accessControlAllowHeaders = null;
oFF.HttpOptionCallResult.prototype.accessControlExposeHeaders = null;
oFF.HttpOptionCallResult.prototype.accessControlAllowMethods = null;
oFF.HttpOptionCallResult.prototype.accessControlAllowOrigin = null;
oFF.HttpOptionCallResult.prototype.accessControlMaxAge = 0;
oFF.HttpOptionCallResult.prototype.statusCode = 0;
oFF.HttpOptionCallResult.prototype.isControlAllowCredentials = function()
{
	return this.controlAllowCredentials;
};
oFF.HttpOptionCallResult.prototype.setControlAllowCredentials = function(controlAllowCredentials)
{
	this.controlAllowCredentials = controlAllowCredentials;
};
oFF.HttpOptionCallResult.prototype.getAccessControlAllowHeaders = function()
{
	return this.accessControlAllowHeaders;
};
oFF.HttpOptionCallResult.prototype.setAccessControlAllowHeaders = function(accessControlAllowHeaders)
{
	this.accessControlAllowHeaders = accessControlAllowHeaders;
};
oFF.HttpOptionCallResult.prototype.getAccessControlAllowMethods = function()
{
	return this.accessControlAllowMethods;
};
oFF.HttpOptionCallResult.prototype.getAccessControlAllowOrigin = function()
{
	return this.accessControlAllowOrigin;
};
oFF.HttpOptionCallResult.prototype.setAccessControlAllowOrigin = function(accessControlAllowOrigin)
{
	this.accessControlAllowOrigin = accessControlAllowOrigin;
};
oFF.HttpOptionCallResult.prototype.getAccessControlMaxAge = function()
{
	return this.accessControlMaxAge;
};
oFF.HttpOptionCallResult.prototype.setAccessControlMaxAge = function(accessControlMaxAge)
{
	this.accessControlMaxAge = accessControlMaxAge;
};
oFF.HttpOptionCallResult.prototype.setStatusCode = function(statusCode)
{
	this.statusCode = statusCode;
};
oFF.HttpOptionCallResult.prototype.getAccessControlExposeHeaders = function()
{
	return this.accessControlExposeHeaders;
};
oFF.HttpOptionCallResult.prototype.getStatusCode = function()
{
	return this.statusCode;
};
oFF.HttpOptionCallResult.prototype.toString = function()
{
	var result = oFF.XStringBuffer.create();
	result.append("HttpOptionCallResult{").append("controlAllowCredentials=").appendBoolean(this.controlAllowCredentials).append(", accessControlAllowHeaders=").appendObject(this.accessControlAllowHeaders).append(", accessControlExposeHeaders=").appendObject(this.accessControlExposeHeaders).append(", accessControlAllowMethods=").appendObject(this.accessControlAllowMethods).append(", accessControlAllowOrigin='").append(this.accessControlAllowOrigin).append("\"").append(", accessControlMaxAge=").appendInt(this.accessControlMaxAge).append(", statusCode=").appendInt(this.statusCode).append("}");
	return result.toString();
};

oFF.Kernel = function() {};
oFF.Kernel.prototype = new oFF.XObjectExt();
oFF.Kernel.prototype._ff_c = "Kernel";

oFF.Kernel.s_instance = null;
oFF.Kernel.staticSetup = function() {};
oFF.Kernel.create = function(environmentConfig)
{
	var newObj = new oFF.Kernel();
	newObj.setupExt(environmentConfig);
	if (oFF.XLanguage.getLanguage() === oFF.XLanguage.JAVASCRIPT && oFF.isNull(oFF.Kernel.s_instance))
	{
		oFF.Kernel.s_instance = newObj;
	}
	return newObj;
};
oFF.Kernel.getInstance = function()
{
	return oFF.Kernel.s_instance;
};
oFF.Kernel.runCmd = function(cmd)
{
	var kernel = oFF.Kernel.getInstance();
	if (oFF.notNull(kernel))
	{
		var kernelProcess = kernel.getKernelProcess();
		var startCfg = oFF.ProgramStartCfg.createByCmdLine(kernelProcess, cmd);
		startCfg.setIsNewConsoleNeeded(true);
		startCfg.processExecution(oFF.SyncType.NON_BLOCKING, null, null);
	}
};
oFF.Kernel.prototype.m_kernelProcess = null;
oFF.Kernel.prototype.m_moduleManager = null;
oFF.Kernel.prototype.m_processIdCounter = 0;
oFF.Kernel.prototype.m_processEventListeners = null;
oFF.Kernel.prototype.m_prgNameReplacements = null;
oFF.Kernel.prototype.m_subSystems = null;
oFF.Kernel.prototype.m_queue = null;
oFF.Kernel.prototype.m_isQueueProcessing = false;
oFF.Kernel.prototype.setupExt = function(environmentConfig)
{
	oFF.XObjectExt.prototype.setup.call( this );
	this.m_subSystems = oFF.XHashMapByString.create();
	this.m_kernelProcess = oFF.Process.createExt(this, null, oFF.ProcessType.ROOT, environmentConfig);
	this.m_moduleManager = oFF.ModuleManager.create(this.m_kernelProcess);
	this.m_processEventListeners = oFF.XList.create();
	this.m_prgNameReplacements = oFF.XHashMapOfStringByString.create();
	this.prepareEnvVariables();
};
oFF.Kernel.prototype.getLogLayer = function()
{
	return oFF.OriginLayer.KERNEL;
};
oFF.Kernel.prototype.prepareEnvVariables = function()
{
	var env = this.m_kernelProcess.getEnvironment();
	var sdkVar = env.getVariable(oFF.XEnvironmentConstants.FIREFLY_SDK);
	if (oFF.notNull(sdkVar))
	{
		var tempPath = env.getVariable(oFF.XEnvironmentConstants.FIREFLY_TMP);
		if (oFF.isNull(tempPath))
		{
			tempPath = oFF.XStringUtils.concatenate3("${", oFF.XEnvironmentConstants.FIREFLY_SDK, "}production/tmp/");
			env.setVariable(oFF.XEnvironmentConstants.FIREFLY_TMP, tempPath);
		}
		var cachePath = env.getVariable(oFF.XEnvironmentConstants.FIREFLY_CACHE);
		if (oFF.isNull(cachePath) && oFF.notNull(tempPath))
		{
			cachePath = oFF.XStringUtils.concatenate3("${", oFF.XEnvironmentConstants.FIREFLY_TMP, "}cache/");
			env.setVariable(oFF.XEnvironmentConstants.FIREFLY_CACHE, cachePath);
		}
		var resourcesPath = env.getVariable(oFF.XEnvironmentConstants.FIREFLY_RESOURCES);
		if (oFF.isNull(resourcesPath))
		{
			resourcesPath = oFF.XStringUtils.concatenate3("${", oFF.XEnvironmentConstants.FIREFLY_SDK, "}production/resources/");
			env.setVariable(oFF.XEnvironmentConstants.FIREFLY_RESOURCES, resourcesPath);
		}
		var mimesPath = env.getVariable(oFF.XEnvironmentConstants.FIREFLY_MIMES);
		if (oFF.isNull(mimesPath))
		{
			mimesPath = oFF.XStringUtils.concatenate3("${", oFF.XEnvironmentConstants.FIREFLY_SDK, "}production/resources/");
			env.setVariable(oFF.XEnvironmentConstants.FIREFLY_MIMES, mimesPath);
		}
		var userProfile = env.getVariable(oFF.XEnvironmentConstants.FIREFLY_USER_PROFILE);
		if (oFF.isNull(userProfile))
		{
			userProfile = oFF.XStringUtils.concatenate3("${", oFF.XEnvironmentConstants.FIREFLY_SDK, "}production/user/userprofile.json");
			env.setVariable(oFF.XEnvironmentConstants.FIREFLY_USER_PROFILE, userProfile);
		}
		var systemLandscape = env.getVariable(oFF.XEnvironmentConstants.SYSTEM_LANDSCAPE_URI);
		if (oFF.isNull(systemLandscape))
		{
			systemLandscape = oFF.XStringUtils.concatenate3("${", oFF.XEnvironmentConstants.FIREFLY_SDK, "}production/systems/SystemLandscapeAllWithPwds.json");
			env.setVariable(oFF.XEnvironmentConstants.SYSTEM_LANDSCAPE_URI, systemLandscape);
		}
	}
	var prgReplace = env.getStringByKey(oFF.XEnvironmentConstants.FIREFLY_PRG_REPLACE);
	if (oFF.notNull(prgReplace))
	{
		var values = oFF.XStringTokenizer.splitString(prgReplace, ",");
		for (var i = 0; i < values.size(); i++)
		{
			var statement = values.get(i);
			var delim = oFF.XString.indexOf(statement, "~");
			if (delim !== -1)
			{
				var source = oFF.XString.substring(statement, 0, delim);
				var target = oFF.XString.substring(statement, delim + 1, -1);
				this.registerProgramTarget(source, target);
			}
		}
	}
	var enableVfs = env.getBooleanByKeyExt(oFF.XEnvironmentConstants.ENABLE_VFS, true);
	if (enableVfs)
	{
		var fileSystemManager = this.m_kernelProcess.getFileSystemManager();
		var pfs = oFF.PrgFileSystem.create(this.m_kernelProcess);
		fileSystemManager.setFileSystemExt(oFF.ProtocolType.PRG, pfs);
		var vfs = oFF.VfsFileSystem.create(this.m_kernelProcess);
		fileSystemManager.setFileSystemExt(oFF.ProtocolType.VFS, vfs);
		var mountPrgDir = oFF.XFile.createExt(this.m_kernelProcess, "prg:///", oFF.PathFormat.URL, oFF.VarResolveMode.NONE);
		vfs.addMountPoint(oFF.VfsElementMountPoint.createWithFile(mountPrgDir), "/prg");
		var sdkDir = oFF.XFile.createFromEnvVar(this.m_kernelProcess, oFF.XEnvironmentConstants.FIREFLY_SDK, null);
		if (oFF.notNull(sdkDir))
		{
			vfs.addMountPoint(oFF.VfsElementMountPoint.createWithFile(sdkDir), "/sdk");
			var originSdk = env.getVariable(oFF.XEnvironmentConstants.FIREFLY_SDK);
			env.setVariable(oFF.XEnvironmentConstants.FIREFLY_SDK_ORIGIN, originSdk);
			env.setVariable(oFF.XEnvironmentConstants.FIREFLY_SDK, "vfs:///sdk/");
		}
		var mountHomeDir = oFF.XFile.createExt(this.m_kernelProcess, "${ff_kernel_homes}/${ff_kernel_user}/", oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
		if (oFF.notNull(mountHomeDir))
		{
			vfs.addMountPoint(oFF.VfsElementMountPoint.createWithFile(mountHomeDir), "/home");
		}
		fileSystemManager.setActiveFileSystem(oFF.ProtocolType.VFS);
	}
};
oFF.Kernel.prototype.newSession = function(version)
{
	var subSession = this.m_kernelProcess.newChildProcess(oFF.ProcessType.SERVICE);
	subSession.setXVersion(version);
	return subSession;
};
oFF.Kernel.prototype.getKernelProcessBase = function()
{
	return this.m_kernelProcess;
};
oFF.Kernel.prototype.getKernelProcess = function()
{
	return this.m_kernelProcess;
};
oFF.Kernel.prototype.getLoadedModules = function()
{
	return oFF.DfModule.getLoadedModuleNames();
};
oFF.Kernel.prototype.loadModule = function(name)
{
	var moduleNames = oFF.XListOfString.create();
	moduleNames.add(name);
	this.processModuleLoad(oFF.SyncType.BLOCKING, null, null, moduleNames);
};
oFF.Kernel.prototype.processModuleLoad = function(syncType, listener, customIdentifier, moduleNames)
{
	var action = this.m_moduleManager.processLoadModules(syncType, moduleNames, listener, customIdentifier);
	return action;
};
oFF.Kernel.prototype.isModuleLoaded = function(name)
{
	var loadedModuleNames = oFF.DfModule.getLoadedModuleNames();
	var loadedModules = oFF.XStringTokenizer.splitString(loadedModuleNames, ",");
	return loadedModules.contains(name);
};
oFF.Kernel.prototype.newProcessId = function()
{
	var processId = oFF.XInteger.convertToString(this.m_processIdCounter);
	this.m_processIdCounter++;
	return processId;
};
oFF.Kernel.prototype.registerOnEvent = function(listener)
{
	this.m_processEventListeners.add(listener);
};
oFF.Kernel.prototype.unregisterOnEvent = function(listener)
{
	for (var i = 0; i < this.m_processEventListeners.size(); )
	{
		var currentListener = this.m_processEventListeners.get(i);
		if (currentListener === listener)
		{
			this.m_processEventListeners.removeAt(i);
		}
		else
		{
			i++;
		}
	}
};
oFF.Kernel.prototype.getAllProcessEventListeners = function()
{
	return this.m_processEventListeners;
};
oFF.Kernel.prototype.onProcessEvent = function(event, process, eventType)
{
	for (var k = 0; k < this.m_processEventListeners.size(); k++)
	{
		var listener2 = this.m_processEventListeners.get(k);
		listener2.onProcessEvent(event, process, event.getEventType());
	}
};
oFF.Kernel.prototype.getSubSystemContainer = function(type)
{
	var name = type.getName();
	var container = this.m_subSystems.getByKey(name);
	if (oFF.isNull(container))
	{
		container = oFF.SubSystemContainer.create(this, type);
		this.m_subSystems.put(name, container);
	}
	return container;
};
oFF.Kernel.prototype.getChildProcessById = function(processId)
{
	var selected = this.selectProcesses(null, processId);
	var process = null;
	if (selected.size() > 0)
	{
		process = selected.get(0);
	}
	return process;
};
oFF.Kernel.prototype.selectProcesses = function(entity, processId)
{
	var list = oFF.XList.create();
	this.recursiveSelect(list, this.m_kernelProcess, entity, processId);
	return list;
};
oFF.Kernel.prototype.recursiveSelect = function(list, process, entity, processId)
{
	var isEntitySelected = oFF.isNull(entity) || process.getEntity(entity) !== null;
	var isIdSelected = oFF.isNull(processId) || oFF.XString.isEqual(process.getProcessId(), processId);
	if (isEntitySelected && isIdSelected)
	{
		list.add(process);
	}
	var childProcesses = process.getChildProcesses();
	for (var i = 0; i < childProcesses.size(); i++)
	{
		var childProcess = childProcesses.get(i);
		this.recursiveSelect(list, childProcess, entity, processId);
	}
};
oFF.Kernel.prototype.notifyReady = function()
{
	this.log("Kernel initialized");
};
oFF.Kernel.prototype.resolveProgramName = function(originProgramName)
{
	var targetName = this.m_prgNameReplacements.getByKey(originProgramName);
	if (oFF.isNull(targetName))
	{
		targetName = originProgramName;
	}
	return targetName;
};
oFF.Kernel.prototype.registerProgramTarget = function(originProgramName, targetProgramName)
{
	this.m_prgNameReplacements.put(originProgramName, targetProgramName);
};
oFF.Kernel.prototype.processShutdownProcess = function(syncType, listener, customIdentifier, processId, hardKill)
{
	return oFF.ProcessShutdownAction.createAndRun(syncType, listener, customIdentifier, this, processId);
};
oFF.Kernel.prototype.getSession = function()
{
	return this.m_kernelProcess;
};
oFF.Kernel.prototype.getProcess = function()
{
	return this.m_kernelProcess;
};
oFF.Kernel.prototype.addToListenerQueue = function(syncAction)
{
	if (oFF.isNull(this.m_queue))
	{
		this.m_queue = oFF.XList.create();
	}
	if (!this.m_queue.contains(syncAction))
	{
		this.m_queue.add(syncAction);
		this.processQueue();
	}
	return true;
};
oFF.Kernel.prototype.processQueue = function()
{
	if (this.m_isQueueProcessing === false)
	{
		this.m_isQueueProcessing = true;
		while (this.m_queue.size() > 0)
		{
			for (var i = 0; i < this.m_queue.size(); )
			{
				var currentSyncAction = this.m_queue.get(i);
				var moreListeners = false;
				try
				{
					moreListeners = currentSyncAction.callListeners(false);
				}
				catch (e)
				{
					if (oFF.XPlatform.getPlatform().isTypeOf(oFF.XPlatform.BROWSER))
					{
						this.logError(oFF.XException.getStackTrace(e, 0));
					}
				}
				if (moreListeners === true)
				{
					i++;
				}
				else
				{
					this.m_queue.removeAt(i);
				}
			}
		}
		this.m_isQueueProcessing = false;
	}
};

oFF.KernelBoot = function() {};
oFF.KernelBoot.prototype = new oFF.XObjectExt();
oFF.KernelBoot.prototype._ff_c = "KernelBoot";

oFF.KernelBoot.create = function()
{
	var newObj = new oFF.KernelBoot();
	newObj.setupExt(null);
	return newObj;
};
oFF.KernelBoot.createByName = function(name)
{
	var newObj = new oFF.KernelBoot();
	newObj.setupExt(name);
	return newObj;
};
oFF.KernelBoot.prototype.m_kernel = null;
oFF.KernelBoot.prototype.m_kernelProcess = null;
oFF.KernelBoot.prototype.m_mountPoints = null;
oFF.KernelBoot.prototype.m_environmentConfig = null;
oFF.KernelBoot.prototype.m_defaultSyncType = null;
oFF.KernelBoot.prototype.m_doMaxDomainRelaxation = false;
oFF.KernelBoot.prototype.m_proxySettings = null;
oFF.KernelBoot.prototype.m_listener = null;
oFF.KernelBoot.prototype.m_startConfigs = null;
oFF.KernelBoot.prototype.m_hasPersistentState = false;
oFF.KernelBoot.prototype.setupExt = function(prgName)
{
	this.m_mountPoints = oFF.XList.create();
	this.m_environmentConfig = oFF.XHashMapOfStringByString.create();
	this.m_startConfigs = oFF.XList.create();
	this.m_listener = oFF.XList.create();
	this.m_defaultSyncType = oFF.SyncType.NON_BLOCKING;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(prgName))
	{
		this.addStartConfig(prgName);
	}
};
oFF.KernelBoot.prototype.releaseObject = function()
{
	this.m_kernelProcess = oFF.XObjectExt.release(this.m_kernelProcess);
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.KernelBoot.prototype.runFull = function()
{
	this.initializeKernel();
	var state = null;
	var cfgList = null;
	if (this.m_hasPersistentState)
	{
		state = oFF.KernelPersistentState.create(this.m_kernel);
		cfgList = state.getInitialCfgs();
	}
	var startCfg;
	for (var i = 0; i < this.m_startConfigs.size(); i++)
	{
		startCfg = this.m_startConfigs.get(i);
		this.startPrg(startCfg);
	}
	if (this.m_hasPersistentState)
	{
		if (oFF.notNull(cfgList))
		{
			for (var k = 0; k < cfgList.size(); k++)
			{
				startCfg = cfgList.get(k);
				this.startPrg(startCfg);
			}
		}
		this.m_kernel.registerOnEvent(state);
	}
};
oFF.KernelBoot.prototype.startPrg = function(startCfg)
{
	startCfg.setParentProcess(this.m_kernelProcess);
	var action = startCfg.processExecution(oFF.SyncType.DELAYED, this, startCfg);
	for (var k = 0; k < this.m_listener.size(); k++)
	{
		var listener = this.m_listener.get(k);
		action.attachListener(listener, oFF.ListenerType.SPECIFIC, startCfg);
	}
	action.setActiveSyncType(this.m_defaultSyncType);
	action.process();
};
oFF.KernelBoot.prototype.onProgramStarted = function(extResult, program, customIdentifier)
{
	var startCfg = customIdentifier;
	if (extResult.isValid())
	{
		this.log(oFF.XStringUtils.concatenate3("SUCCESS: Program '", startCfg.getName(), "' started"));
	}
	else
	{
		this.log(oFF.XStringUtils.concatenate3("ERROR: Program '", startCfg.getName(), "' cannot be started"));
		this.log(extResult.getSummary());
	}
};
oFF.KernelBoot.prototype.initializeKernel = function()
{
	if (oFF.isNull(this.m_kernel))
	{
		this.m_kernel = oFF.Kernel.create(this.m_environmentConfig);
		this.m_kernelProcess = this.m_kernel.getKernelProcessBase();
		if (oFF.notNull(this.m_defaultSyncType))
		{
			this.m_kernelProcess.setDefaultSyncType(this.m_defaultSyncType);
		}
		if (oFF.notNull(this.m_proxySettings))
		{
			this.m_kernelProcess.setProxySettings(this.m_proxySettings);
		}
		if (this.m_doMaxDomainRelaxation)
		{
			var location = oFF.NetworkEnv.getLocation();
			var host = location.getHost();
			var lastDotIndex = oFF.XString.lastIndexOf(host, ".");
			if (lastDotIndex !== -1)
			{
				var secondLastDotIndex = oFF.XString.lastIndexOfFrom(host, ".", lastDotIndex - 1);
				if (secondLastDotIndex !== -1)
				{
					var reducedHost = oFF.XString.substring(host, secondLastDotIndex + 1, -1);
					oFF.NetworkEnv.setDomain(reducedHost);
					var exclude = oFF.XStringUtils.concatenate2("*.", reducedHost);
					this.m_kernelProcess.getProxySettings().getProxyExcludesBase().add(exclude);
				}
			}
		}
		this.m_kernel.notifyReady();
	}
};
oFF.KernelBoot.prototype.doMaxDomainRelaxation = function()
{
	this.m_doMaxDomainRelaxation = true;
};
oFF.KernelBoot.prototype.setInitialSystemType = function(systemType)
{
	if (oFF.notNull(systemType))
	{
		this.setArgument(oFF.DfProgram.PARAM_INITIAL_SYS_TYPE, systemType.getName());
	}
};
oFF.KernelBoot.prototype.setSystemLandscapeUrl = function(url)
{
	if (oFF.notNull(url))
	{
		this.setEnvironmentVariable(oFF.XEnvironmentConstants.SYSTEM_LANDSCAPE_URI, url);
	}
};
oFF.KernelBoot.prototype.getSystemLandscapeUrl = function()
{
	return this.m_environmentConfig.getByKey(oFF.XEnvironmentConstants.SYSTEM_LANDSCAPE_URI);
};
oFF.KernelBoot.prototype.setNativeAnchorId = function(nativeAnchorId)
{
	var currentStartConfig = this.getCurrentStartConfig();
	if (oFF.notNull(currentStartConfig))
	{
		currentStartConfig.setNativeAnchorId(nativeAnchorId);
	}
	this.setEnvironmentVariable(oFF.XEnvironmentConstants.FIREFLY_UI_ANCHOR_ID, nativeAnchorId);
};
oFF.KernelBoot.prototype.setNativeAnchorObject = function(nativeAnchorObject)
{
	this.getCurrentStartConfig().setNativeAnchorObject(nativeAnchorObject);
};
oFF.KernelBoot.prototype.setArgument = function(name, value)
{
	var currentStartConfig = this.getCurrentStartConfig();
	if (oFF.notNull(currentStartConfig))
	{
		currentStartConfig.getArguments().putString(name, value);
	}
};
oFF.KernelBoot.prototype.getCurrentStartConfig = function()
{
	if (this.m_startConfigs.size() > 0)
	{
		return this.m_startConfigs.get(this.m_startConfigs.size() - 1);
	}
	else
	{
		return null;
	}
};
oFF.KernelBoot.prototype.addStartConfig = function(name)
{
	var args = oFF.ProgramArgs.createWithStructure(oFF.PrFactory.createStructure());
	var startCfg = oFF.ProgramStartCfg.create(null, name, name, args);
	startCfg.setEnforcedOutputDevice(oFF.ProgramDevice.EMBEDDED);
	this.m_startConfigs.add(startCfg);
	return startCfg;
};
oFF.KernelBoot.prototype.addMountPoint = function(name, path)
{
	this.m_mountPoints.add(oFF.XNameValuePair.create(name, path));
};
oFF.KernelBoot.prototype.setDispatcherUri = function(uri)
{
	this.setWebdispatcherTemplate(uri);
};
oFF.KernelBoot.prototype.setWebdispatcherTemplate = function(template)
{
	this.setEnvironmentVariable(oFF.XEnvironmentConstants.FF_DISPATCHER_TEMPLATE, template);
};
oFF.KernelBoot.prototype.getWebdispatcherTemplate = function()
{
	return this.m_environmentConfig.getByKey(oFF.XEnvironmentConstants.FF_DISPATCHER_TEMPLATE);
};
oFF.KernelBoot.prototype.addExcludeProxyByUrl = function(url)
{
	var uri = oFF.XUri.createFromUrl(url);
	var host = uri.getHost();
	this.getProxySettings().getProxyExcludesBase().add(host);
};
oFF.KernelBoot.prototype.getProxyHost = function()
{
	return this.getProxySettings().getProxyHost();
};
oFF.KernelBoot.prototype.getProxyPort = function()
{
	return this.getProxySettings().getProxyPort();
};
oFF.KernelBoot.prototype.getProxyAuthorization = function()
{
	return this.getProxySettings().getProxyAuthorization();
};
oFF.KernelBoot.prototype.setProxyAuthorization = function(authorization)
{
	this.getProxySettings().setProxyAuthorization(authorization);
};
oFF.KernelBoot.prototype.getSccLocationId = function()
{
	return this.getProxySettings().getSccLocationId();
};
oFF.KernelBoot.prototype.setSccLocationId = function(sccLocationId)
{
	this.getProxySettings().setSccLocationId(sccLocationId);
};
oFF.KernelBoot.prototype.getProxyType = function()
{
	return this.getProxySettings().getProxyType();
};
oFF.KernelBoot.prototype.setProxyHost = function(host)
{
	this.getProxySettings().setProxyHost(host);
};
oFF.KernelBoot.prototype.setProxyPort = function(port)
{
	this.getProxySettings().setProxyPort(port);
};
oFF.KernelBoot.prototype.setProxyType = function(type)
{
	this.getProxySettings().setProxyType(type);
};
oFF.KernelBoot.prototype.getProxyHttpHeaders = function()
{
	return this.getProxySettings().getProxyHttpHeaders();
};
oFF.KernelBoot.prototype.setProxyHttpHeader = function(name, value)
{
	this.getProxySettings().setProxyHttpHeader(name, value);
};
oFF.KernelBoot.prototype.getProxySettings = function()
{
	if (oFF.isNull(this.m_proxySettings))
	{
		this.m_proxySettings = oFF.ProxySettings.create(null);
	}
	return this.m_proxySettings;
};
oFF.KernelBoot.prototype.getDefaultSyncType = function()
{
	return this.m_defaultSyncType;
};
oFF.KernelBoot.prototype.setDefaultSyncType = function(syncType)
{
	this.m_defaultSyncType = syncType;
};
oFF.KernelBoot.prototype.setEnvironmentVariable = function(name, value)
{
	this.m_environmentConfig.put(name, value);
};
oFF.KernelBoot.prototype.setModuleLoadUrl = function(moduleGroup, url)
{
	oFF.ModuleManager.setModuleLoadUrl(moduleGroup, url);
	this.setEnvironmentVariable(oFF.XEnvironmentConstants.FIREFLY_MODULE_PATH, url);
};
oFF.KernelBoot.prototype.addProgramStartedListener = function(listener)
{
	this.m_listener.add(listener);
};
oFF.KernelBoot.prototype.setHasPersistentState = function(hasPersistentState)
{
	this.m_hasPersistentState = hasPersistentState;
};
oFF.KernelBoot.prototype.hasPersistentState = function()
{
	return this.m_hasPersistentState;
};
oFF.KernelBoot.prototype.setXVersion = function(xVersion)
{
	if (xVersion !== -1)
	{
		this.setEnvironmentVariable(oFF.XEnvironmentConstants.XVERSION, oFF.XInteger.convertToString(xVersion));
	}
};
oFF.KernelBoot.prototype.getXVersion = oFF.noSupport;
oFF.KernelBoot.prototype.setKernel = function(kernel)
{
	this.m_kernel = kernel;
};

oFF.KernelPersistentState = function() {};
oFF.KernelPersistentState.prototype = new oFF.XObjectExt();
oFF.KernelPersistentState.prototype._ff_c = "KernelPersistentState";

oFF.KernelPersistentState.ARG_START = "c";
oFF.KernelPersistentState.ARG_STRING = "s";
oFF.KernelPersistentState.ARG_LIST = "p";
oFF.KernelPersistentState.ARG_STRUCT = "u";
oFF.KernelPersistentState.create = function(kernel)
{
	var newObj = new oFF.KernelPersistentState();
	newObj.setupExt(kernel);
	return newObj;
};
oFF.KernelPersistentState.prototype.m_kernel = null;
oFF.KernelPersistentState.prototype.setupExt = function(kernel)
{
	this.m_kernel = kernel;
};
oFF.KernelPersistentState.prototype.getInitialCfgs = function()
{
	var kernelProcess = this.m_kernel.getKernelProcess();
	var environment = kernelProcess.getEnvironment();
	var networkLocation = environment.getStringByKey(oFF.XEnvironmentConstants.NETWORK_LOCATION);
	var startList = oFF.XList.create();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(networkLocation))
	{
		var uri = oFF.XUri.createFromUrl(networkLocation);
		if (oFF.notNull(uri))
		{
			var fragment = uri.getFragment();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(fragment))
			{
				this.parseUrlFragment(startList, fragment);
			}
		}
	}
	return startList;
};
oFF.KernelPersistentState.prototype.parseUrlFragment = function(startList, fragment)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(fragment))
	{
		var json = null;
		try
		{
			json = oFF.JsonParserFactory.createFromSafeString(fragment);
		}
		catch (t)
		{
			this.log2("Fragment cannot be parsed: ", fragment);
		}
		if (oFF.notNull(json) && json.isStructure())
		{
			var viewList = json.asStructure().getListByKey("views");
			if (oFF.notNull(viewList))
			{
				for (var k = 0; k < viewList.size(); k++)
				{
					var viewDef = viewList.getStructureAt(k);
					var startName = viewDef.getStringByKey(oFF.KernelPersistentState.ARG_START);
					var prgArgs = null;
					var argsStruct = viewDef.getStructureByKey(oFF.KernelPersistentState.ARG_STRUCT);
					if (oFF.notNull(argsStruct))
					{
						prgArgs = oFF.ProgramArgs.createWithStructure(argsStruct);
					}
					else
					{
						var argsList = viewDef.getListByKey(oFF.KernelPersistentState.ARG_LIST);
						if (oFF.notNull(argsList))
						{
							var argsListValues = oFF.XListOfString.create();
							for (var m = 0; m < argsList.size(); m++)
							{
								argsListValues.add(argsList.getStringAt(m));
							}
							prgArgs = oFF.ProgramArgs.createWithList(argsListValues);
						}
						else
						{
							var argsString = viewDef.getStringByKey(oFF.KernelPersistentState.ARG_STRING);
							if (oFF.notNull(argsString))
							{
								prgArgs = oFF.ProgramArgs.createWithString(argsString);
							}
						}
					}
					var startCfg = oFF.ProgramStartCfg.create(null, startName, startName, prgArgs);
					startCfg.setIsCreatingChildProcess(false);
					startCfg.setIsNewConsoleNeeded(true);
					startList.add(startCfg);
				}
			}
		}
	}
};
oFF.KernelPersistentState.prototype.onProcessEvent = function(event, process, eventType)
{
	var kernelProcess = this.m_kernel.getKernelProcess();
	var fragment = this.updateStateRoot(kernelProcess);
	oFF.NetworkEnv.setFragment(fragment);
};
oFF.KernelPersistentState.prototype.updateStateRoot = function(process)
{
	var state = oFF.PrFactory.createStructure();
	var appList = state.putNewList("views");
	this.updateState(process, appList);
	var fragment = null;
	if (appList.size() > 0)
	{
		fragment = state.getStringRepresentation();
	}
	return fragment;
};
oFF.KernelPersistentState.prototype.updateState = function(process, appList)
{
	if (process.isWindowBasedUiProgram())
	{
		var startCfg = process.getProgramCfg();
		var appState = appList.addNewStructure();
		appState.putString(oFF.KernelPersistentState.ARG_START, startCfg.getName());
		var argObj = startCfg.getArguments();
		if (oFF.notNull(argObj))
		{
			if (argObj.isArgumentStructureOrigin())
			{
				var argStructure = argObj.getArgumentStructure();
				if (oFF.notNull(argStructure))
				{
					appState.put(oFF.KernelPersistentState.ARG_STRUCT, argStructure);
				}
			}
			else if (argObj.isArgumentListOrigin())
			{
				var argList = argObj.getArgumentList();
				if (oFF.notNull(argList) && argList.size() > 0)
				{
					var argListValues = oFF.PrFactory.createList();
					for (var k = 0; k < argList.size(); k++)
					{
						argListValues.addString(argList.get(k));
					}
					appState.put(oFF.KernelPersistentState.ARG_LIST, argListValues);
				}
			}
			else if (argObj.isArgumentStringOrigin())
			{
				var argString = argObj.getArgumentString();
				if (oFF.notNull(argString))
				{
					appState.putString(oFF.KernelPersistentState.ARG_STRING, argString);
				}
			}
		}
	}
	var childProcesses = process.getChildProcesses();
	for (var i = 0; i < childProcesses.size(); i++)
	{
		var child = childProcesses.get(i);
		this.updateState(child, appList);
	}
};

oFF.DfProcessContext = function() {};
oFF.DfProcessContext.prototype = new oFF.XObjectExt();
oFF.DfProcessContext.prototype._ff_c = "DfProcessContext";

oFF.DfProcessContext.prototype.m_process = null;
oFF.DfProcessContext.prototype.setupProcessContext = function(process)
{
	oFF.XObjectExt.prototype.setup.call( this );
	this.setProcess(process);
};
oFF.DfProcessContext.prototype.releaseObject = function()
{
	this.m_process = null;
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.DfProcessContext.prototype.getSession = function()
{
	return this.getProcess();
};
oFF.DfProcessContext.prototype.setSession = function(session)
{
	this.setProcess(session);
};
oFF.DfProcessContext.prototype.getProcess = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_process);
};
oFF.DfProcessContext.prototype.setProcess = function(process)
{
	this.m_process = oFF.XWeakReferenceUtil.getWeakRef(process);
};
oFF.DfProcessContext.prototype.getLogWriter = function()
{
	var session = this.getSession();
	return oFF.isNull(session) ? null : session.getLogWriter();
};
oFF.DfProcessContext.prototype.getStdout = function()
{
	var session = this.getSession();
	return oFF.isNull(session) ? null : session.getStdout();
};
oFF.DfProcessContext.prototype.getStdin = function()
{
	var session = this.getSession();
	return oFF.isNull(session) ? null : session.getStdin();
};
oFF.DfProcessContext.prototype.getStdlog = function()
{
	var session = this.getSession();
	return oFF.isNull(session) ? null : session.getStdlog();
};
oFF.DfProcessContext.prototype.getEnvironment = function()
{
	return this.getSession().getEnvironment();
};

oFF.DfCredentialsProvider = function() {};
oFF.DfCredentialsProvider.prototype = new oFF.DfSessionContext();
oFF.DfCredentialsProvider.prototype._ff_c = "DfCredentialsProvider";

oFF.DfCredentialsProvider.prototype.getProcess = function()
{
	return this.getSession();
};

oFF.MfsElement = function() {};
oFF.MfsElement.prototype = new oFF.DfNameObject();
oFF.MfsElement.prototype._ff_c = "MfsElement";

oFF.MfsElement.prototype.m_parent = null;
oFF.MfsElement.prototype.releaseObject = function()
{
	this.m_parent = null;
	oFF.DfNameObject.prototype.releaseObject.call( this );
};
oFF.MfsElement.prototype.isDirectory = function()
{
	return false;
};
oFF.MfsElement.prototype.getParent = function()
{
	return this.m_parent;
};
oFF.MfsElement.prototype.setParent = function(parent)
{
	this.m_parent = parent;
};

oFF.VfsElement = function() {};
oFF.VfsElement.prototype = new oFF.DfNameObject();
oFF.VfsElement.prototype._ff_c = "VfsElement";

oFF.VfsElement.prototype.m_parent = null;
oFF.VfsElement.prototype.m_vfs = null;
oFF.VfsElement.prototype.setupElement = function(vfs, name)
{
	this._setupInternal(name);
	this.m_vfs = vfs;
};
oFF.VfsElement.prototype.getComponentType = function()
{
	return oFF.VfsElementType.ELEMENT;
};
oFF.VfsElement.prototype.setParent = function(parent)
{
	this.m_parent = parent;
};
oFF.VfsElement.prototype.getParent = function()
{
	return this.m_parent;
};
oFF.VfsElement.prototype.getVfs = function()
{
	return this.m_vfs;
};
oFF.VfsElement.prototype.setVfs = function(vfs)
{
	this.m_vfs = vfs;
};
oFF.VfsElement.prototype.isLeaf = function()
{
	return !this.isNode();
};
oFF.VfsElement.prototype.toString = function()
{
	var buffer = oFF.XStringBufferExt.create();
	buffer.setIndentationString("  ");
	this.toStringExt(buffer);
	return buffer.toString();
};
oFF.VfsElement.prototype.toStringExt = function(buffer)
{
	if (this.isNode())
	{
		buffer.append("Node: ");
	}
	else
	{
		buffer.append("Leaf: ");
	}
	buffer.append(this.getName());
};

oFF.AbstractResourceDef = function() {};
oFF.AbstractResourceDef.prototype = new oFF.DfNameObject();
oFF.AbstractResourceDef.prototype._ff_c = "AbstractResourceDef";

oFF.AbstractResourceDef.prototype.m_originClazzName = null;
oFF.AbstractResourceDef.prototype.m_targetClazzName = null;
oFF.AbstractResourceDef.prototype.m_clazzName = null;
oFF.AbstractResourceDef.prototype.m_dependenciesExt = null;
oFF.AbstractResourceDef.prototype.m_listOfDependencies = null;
oFF.AbstractResourceDef.prototype.setupResourceDef = function(name, clazzName, listOfDependencies)
{
	this._setupInternal(name);
	this.setClazzName(clazzName);
	this.m_dependenciesExt = oFF.XList.create();
	this.m_listOfDependencies = listOfDependencies;
};
oFF.AbstractResourceDef.prototype.setClazzName = function(clazzName)
{
	this.m_originClazzName = clazzName;
	if (oFF.notNull(this.m_originClazzName))
	{
		var index = oFF.XString.lastIndexOf(this.m_originClazzName, ".");
		if (index !== -1)
		{
			this.m_clazzName = oFF.XString.substring(this.m_originClazzName, index + 1, -1);
		}
		var language = oFF.XLanguage.getLanguage();
		if (language === oFF.XLanguage.JAVASCRIPT)
		{
			this.m_targetClazzName = this.m_clazzName;
		}
		else
		{
			this.m_targetClazzName = this.m_originClazzName;
		}
	}
};
oFF.AbstractResourceDef.prototype.getDependencies = function()
{
	var allDependencies = this.getAllDependencies();
	var list = oFF.XListOfString.create();
	for (var i = 0; i < allDependencies.size(); i++)
	{
		var entity = allDependencies.get(i);
		if (entity.getType() === oFF.ResourceEntityType.MODULE)
		{
			list.add(entity.getName());
		}
	}
	return list;
};
oFF.AbstractResourceDef.prototype.getDependenciesExt = function(variant)
{
	this.checkJson();
	return this.m_dependenciesExt;
};
oFF.AbstractResourceDef.prototype.getAllDependencies = function()
{
	this.checkJson();
	return this.m_dependenciesExt;
};
oFF.AbstractResourceDef.prototype.addDependency = function(entity)
{
	this.m_dependenciesExt.add(entity);
};
oFF.AbstractResourceDef.prototype.addAllDependencies = function(dependencies)
{
	for (var i = 0; i < dependencies.size(); i++)
	{
		var resourceEntity = dependencies.get(i);
		if (this.m_dependenciesExt.contains(resourceEntity) === false)
		{
			this.m_dependenciesExt.add(resourceEntity);
		}
	}
};
oFF.AbstractResourceDef.prototype.getModuleInitClazzName = function()
{
	this.checkJson();
	return this.m_clazzName;
};
oFF.AbstractResourceDef.prototype.getModuleInitClazzNameCompatible = function()
{
	this.checkJson();
	return this.m_targetClazzName;
};
oFF.AbstractResourceDef.prototype.getModuleInitClazzOrigin = function()
{
	this.checkJson();
	return this.m_originClazzName;
};
oFF.AbstractResourceDef.prototype.checkJson = function()
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_listOfDependencies))
	{
		var dependencies = oFF.XStringTokenizer.splitString(this.m_listOfDependencies, ",");
		for (var i = 0; i < dependencies.size(); i++)
		{
			var moduleName = dependencies.get(i);
			var entity = oFF.ResourceEntity.create(moduleName, moduleName, null, null, oFF.ResourceEntityType.MODULE, null, null, null);
			this.m_dependenciesExt.add(entity);
		}
	}
};

oFF.ModuleManager = function() {};
oFF.ModuleManager.prototype = new oFF.DfSessionContext();
oFF.ModuleManager.prototype._ff_c = "ModuleManager";

oFF.ModuleManager.s_allModules = null;
oFF.ModuleManager.s_repositoryBaseUrl = null;
oFF.ModuleManager.s_moduleLoader = null;
oFF.ModuleManager.staticSetup = function()
{
	oFF.ModuleManager.s_allModules = oFF.XSetOfNameObject.create();
};
oFF.ModuleManager.setModuleLoadUrl = function(moduleGroup, url)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(url))
	{
		oFF.ModuleManager.s_repositoryBaseUrl = oFF.XUri.createFromUrl(url);
		var iterator = oFF.ModuleManager.s_allModules.getIterator();
		while (iterator.hasNext())
		{
			var moduleDef = iterator.next();
			moduleDef.setBaseUri(oFF.ModuleManager.s_repositoryBaseUrl);
		}
	}
};
oFF.ModuleManager.registerDirect = function(name, clazzName, hasVariants, sourceLocation, listOfDependencies, extendedJsonConfig)
{
	var moduleDef = oFF.ModuleDef.create(name, clazzName, hasVariants, sourceLocation, listOfDependencies, oFF.ModuleManager.s_repositoryBaseUrl, extendedJsonConfig);
	oFF.ModuleManager.register(moduleDef);
};
oFF.ModuleManager.register = function(moduleDef)
{
	oFF.ModuleManager.s_allModules.add(moduleDef);
};
oFF.ModuleManager.getModuleDef = function(name)
{
	return oFF.ModuleManager.s_allModules.getByKey(name);
};
oFF.ModuleManager.lookup = function(name)
{
	return oFF.ModuleManager.s_allModules.getByKey(name);
};
oFF.ModuleManager.getModuleLoader = function()
{
	return oFF.ModuleManager.s_moduleLoader;
};
oFF.ModuleManager.registerModuleLoader = function(moduleLoader)
{
	oFF.ModuleManager.s_moduleLoader = moduleLoader;
};
oFF.ModuleManager.create = function(session)
{
	var newObj = new oFF.ModuleManager();
	newObj.setupSessionContext(session);
	return newObj;
};
oFF.ModuleManager.prototype.m_runningLoadAction = null;
oFF.ModuleManager.prototype.m_scheduledLoadActions = null;
oFF.ModuleManager.prototype.setupSessionContext = function(session)
{
	oFF.DfSessionContext.prototype.setupSessionContext.call( this , session);
	this.m_scheduledLoadActions = oFF.XList.create();
};
oFF.ModuleManager.prototype.getLogLayer = function()
{
	return oFF.OriginLayer.KERNEL;
};
oFF.ModuleManager.prototype.processLoadModules = function(syncType, moduleNames, listener, customIdentifier)
{
	var loadAction = oFF.ModuleLoadAction.createAndRun(oFF.SyncType.DELAYED, this, moduleNames, oFF.ModuleManager.s_moduleLoader, listener, customIdentifier);
	loadAction.attachListener(this, oFF.ListenerType.SYNC_LISTENER, loadAction);
	this.m_scheduledLoadActions.add(loadAction);
	this.clockworkTick(syncType);
	return loadAction;
};
oFF.ModuleManager.prototype.onSynchronized = function(messages, data, customIdentifier)
{
	var loadAction = customIdentifier;
	this.m_runningLoadAction = null;
	this.log2("Module loading done: ", loadAction.getData().toString());
	this.clockworkTick(loadAction.getActiveSyncType());
};
oFF.ModuleManager.prototype.clockworkTick = function(syncType)
{
	if (oFF.isNull(this.m_runningLoadAction) && this.m_scheduledLoadActions.size() > 0)
	{
		this.m_runningLoadAction = this.m_scheduledLoadActions.removeAt(0);
		this.log2("Running next: ", this.m_runningLoadAction.getData().toString());
		this.m_runningLoadAction.setActiveSyncType(oFF.SyncType.NON_BLOCKING);
		this.m_runningLoadAction.process();
	}
};

oFF.ConnectionPool = function() {};
oFF.ConnectionPool.prototype = new oFF.DfSessionContext();
oFF.ConnectionPool.prototype._ff_c = "ConnectionPool";

oFF.ConnectionPool.create = function(session)
{
	var pool = new oFF.ConnectionPool();
	pool.setupSessionContext(session);
	return pool;
};
oFF.ConnectionPool.prototype.m_systemConnectSet = null;
oFF.ConnectionPool.prototype.m_cookiesMasterStore = null;
oFF.ConnectionPool.prototype.m_batchRsStreamingEnabled = false;
oFF.ConnectionPool.prototype.setupSessionContext = function(session)
{
	oFF.DfSessionContext.prototype.setupSessionContext.call( this , session);
	this.m_systemConnectSet = oFF.XSetOfNameObject.create();
	this.m_cookiesMasterStore = oFF.HttpCookiesMasterStore.create();
	this.m_batchRsStreamingEnabled = false;
};
oFF.ConnectionPool.prototype.releaseObject = function()
{
	this.m_systemConnectSet = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_systemConnectSet);
	oFF.DfSessionContext.prototype.releaseObject.call( this );
};
oFF.ConnectionPool.prototype.getActiveSystems = function()
{
	return this.m_systemConnectSet.getKeysAsReadOnlyListOfString();
};
oFF.ConnectionPool.prototype.clearConnectionsForSystem = function(systemName)
{
	var systemConnect = this.m_systemConnectSet.getByKey(systemName);
	if (oFF.notNull(systemConnect))
	{
		systemConnect.clearConnections();
	}
};
oFF.ConnectionPool.prototype.clearConnections = function()
{
	var sci = this.m_systemConnectSet.getIterator();
	while (sci.hasNext())
	{
		sci.next().clearConnections();
	}
	oFF.XObjectExt.release(sci);
};
oFF.ConnectionPool.prototype.getAllOpenConnections = function()
{
	var allOpenConnections = oFF.XList.create();
	var sci = this.m_systemConnectSet.getIterator();
	while (sci.hasNext())
	{
		sci.next().getAllOpenConnections(allOpenConnections);
	}
	oFF.XObjectExt.release(sci);
	return allOpenConnections;
};
oFF.ConnectionPool.prototype.getOpenConnections = function(systemName)
{
	return this.getSystemConnectBase(systemName).getAllOpenConnections(oFF.XList.create());
};
oFF.ConnectionPool.prototype.getOpenConnection = function(systemName)
{
	var allOpenConnections = this.getOpenConnections(systemName);
	if (allOpenConnections.hasElements())
	{
		return allOpenConnections.get(0);
	}
	return this.getConnection(systemName);
};
oFF.ConnectionPool.prototype.getConnection = function(systemName)
{
	return this.getConnectionExt(systemName, false, null);
};
oFF.ConnectionPool.prototype.getConnectionExt = function(systemName, isPrivate, name)
{
	return this.getSystemConnectBase(systemName).getConnectionExt(isPrivate, name);
};
oFF.ConnectionPool.prototype.getSystemConnect = function(systemName)
{
	return this.getSystemConnectExt(systemName, true);
};
oFF.ConnectionPool.prototype.getSystemConnectBase = function(systemName)
{
	return this.getSystemConnectExt(systemName, true);
};
oFF.ConnectionPool.prototype.getSystemConnectExt = function(systemName, createIfNotExist)
{
	var sysName = this.resolveSystemName(systemName);
	var systemConnect = this.m_systemConnectSet.getByKey(sysName);
	if (oFF.isNull(systemConnect) && createIfNotExist === true)
	{
		var systemDescription = this.getSystemLandscape().getSystemDescription(sysName);
		oFF.XObjectExt.assertNotNullExt(systemDescription, oFF.XStringUtils.concatenate3("System cannot be resolved: '", systemName, "'"));
		systemConnect = oFF.SystemConnect.create(this, sysName, systemDescription);
		this.m_systemConnectSet.add(systemConnect);
	}
	return systemConnect;
};
oFF.ConnectionPool.prototype.resolveSystemName = function(systemName)
{
	if (oFF.isNull(systemName))
	{
		return this.getSystemLandscape().getMasterSystemName();
	}
	return systemName;
};
oFF.ConnectionPool.prototype.setExternalActiveConnections = function(systemName, activeConnections)
{
	var systemConnect = this.m_systemConnectSet.getByKey(systemName);
	if (oFF.notNull(systemConnect))
	{
		systemConnect.setExternalActiveConnections(activeConnections);
	}
};
oFF.ConnectionPool.prototype.setExternalSharedConnection = function(systemName, name, csrfToken, sessionUrlRewrite)
{
	var systemConnect = this.m_systemConnectSet.getByKey(systemName);
	if (oFF.notNull(systemConnect))
	{
		systemConnect.setExternalSharedConnection(name, csrfToken, sessionUrlRewrite);
	}
};
oFF.ConnectionPool.prototype.getMaximumSharedConnections = function(systemName)
{
	return this.getSystemConnectBase(systemName).getMaximumSharedConnections();
};
oFF.ConnectionPool.prototype.setMaximumSharedConnections = function(systemName, maximumSharedConnections)
{
	var systemConnect = this.getSystemConnectBase(systemName);
	if (oFF.notNull(systemConnect))
	{
		systemConnect.setMaximumSharedConnections(maximumSharedConnections);
	}
};
oFF.ConnectionPool.prototype.isEqsEnabled = function(systemName)
{
	var systemConnect = this.m_systemConnectSet.getByKey(systemName);
	if (oFF.notNull(systemConnect))
	{
		return systemConnect.isEQSEnabled();
	}
	return false;
};
oFF.ConnectionPool.prototype.setEqsEnabled = function(systemName, isEqsEnabled)
{
	var systemConnect = this.m_systemConnectSet.getByKey(systemName);
	if (oFF.notNull(systemConnect))
	{
		systemConnect.setIsEQSEnabled(isEqsEnabled);
	}
};
oFF.ConnectionPool.prototype.getTraceInfo = function(systemName)
{
	var systemConnect = this.getSystemConnectBase(systemName);
	var traceInfo = systemConnect.getTraceInfo();
	var session = this.getSession();
	var env = session.getEnvironment();
	var enableTracing = env.getBooleanByKeyExt(oFF.XEnvironmentConstants.ENABLE_HTTP_FILE_TRACING, false);
	if (enableTracing)
	{
		if (oFF.isNull(traceInfo) || traceInfo.getTraceType() !== oFF.TraceType.FILE)
		{
			var tracingFolder = env.getVariable(oFF.XEnvironmentConstants.HTTP_FILE_TRACING_FOLDER);
			if (oFF.notNull(tracingFolder))
			{
				var tracingFolderFile = oFF.XFile.createByNativePath(session, tracingFolder);
				if (tracingFolderFile.isExisting() && tracingFolderFile.isDirectory())
				{
					var urlString = tracingFolderFile.getUri().getUrl();
					traceInfo = oFF.TraceInfo.create();
					traceInfo.setTraceFolderPath(urlString);
					traceInfo.setTraceType(oFF.TraceType.FILE);
					traceInfo.setTraceName(this.getProcess().getApplicationName());
					systemConnect.setTraceInfo(traceInfo);
					this.log2("Enabling file tracing: ", tracingFolder);
				}
			}
		}
	}
	return traceInfo;
};
oFF.ConnectionPool.prototype.setTraceInfo = function(systemName, traceInfo)
{
	this.getSystemConnectBase(systemName).setTraceInfo(traceInfo);
};
oFF.ConnectionPool.prototype.getAuthenticationToken = function(systemName)
{
	var connectionPersonalization = this.getProcess().getUserManager().getConnectionPersonalization(systemName);
	return connectionPersonalization.getAuthenticationToken();
};
oFF.ConnectionPool.prototype.setAuthenticationToken = function(systemName, token)
{
	var connectionPersonalization = this.getProcess().getUserManager().getConnectionPersonalization(systemName);
	connectionPersonalization.setAuthenticationToken(token);
};
oFF.ConnectionPool.prototype.getAccessToken = function(systemName)
{
	var connectionPersonalization = this.getProcess().getUserManager().getConnectionPersonalization(systemName);
	return connectionPersonalization.getAccessToken();
};
oFF.ConnectionPool.prototype.setAccessToken = function(systemName, token)
{
	var connectionPersonalization = this.getProcess().getUserManager().getConnectionPersonalization(systemName);
	connectionPersonalization.setAccessToken(token);
};
oFF.ConnectionPool.prototype.getReentranceTicket = function(systemName)
{
	return this.getSystemConnectBase(systemName).getReentranceTicket();
};
oFF.ConnectionPool.prototype.setReentranceTicket = function(systemName, reentranceTicket)
{
	this.getSystemConnectBase(systemName).setReentranceTicket(reentranceTicket);
};
oFF.ConnectionPool.prototype.enableBatchMode = function(systemName)
{
	this.setBatchMode(null, systemName, true);
};
oFF.ConnectionPool.prototype.executeBatchQueue = function(syncType, systemName)
{
	if (this.getSystemConnectBase(systemName).isBatchEnabled())
	{
		this.setBatchMode(syncType, systemName, false);
		this.setBatchMode(syncType, systemName, true);
	}
};
oFF.ConnectionPool.prototype.getBatchQueueSize = function(systemName)
{
	var size = 0;
	var systemConnect = this.getSystemConnectBase(systemName);
	var sysConnections = systemConnect.getSharedConnections();
	if (oFF.notNull(sysConnections))
	{
		for (var i = 0; i < sysConnections.size(); i++)
		{
			size = size + sysConnections.get(i).getBatchQueueSize();
		}
	}
	return size;
};
oFF.ConnectionPool.prototype.disableBatchMode = function(syncType, systemName)
{
	this.setBatchMode(syncType, systemName, false);
};
oFF.ConnectionPool.prototype.enableBatchStreaming = function()
{
	this.m_batchRsStreamingEnabled = true;
};
oFF.ConnectionPool.prototype.disableBatchStreaming = function()
{
	this.m_batchRsStreamingEnabled = false;
};
oFF.ConnectionPool.prototype.setBatchMode = function(syncType, systemName, isBatchEnabled)
{
	var systemConnect = this.getSystemConnectBase(systemName);
	var sysConnections = systemConnect.getSharedConnections();
	if (isBatchEnabled && sysConnections.isEmpty())
	{
		var connection = systemConnect.getConnectionExt(false, systemName);
		connection.getServerMetadata();
	}
	systemConnect.setIsBatchEnabled(isBatchEnabled);
	for (var i = 0; i < sysConnections.size(); i++)
	{
		if (!isBatchEnabled && this.m_batchRsStreamingEnabled)
		{
			sysConnections.get(i).disableBatchModeWithRsStreaming(syncType);
		}
		sysConnections.get(i).setBatchModeEnabled(syncType, isBatchEnabled);
	}
};
oFF.ConnectionPool.prototype.isBatchModeEnabled = function(systemName)
{
	return this.getSystemConnectBase(systemName).isBatchEnabled();
};
oFF.ConnectionPool.prototype.getCookiesMasterStore = function()
{
	return this.m_cookiesMasterStore;
};
oFF.ConnectionPool.prototype.getSystemLandscape = function()
{
	var systemLandscape = this.getProcess().getSystemLandscape();
	return systemLandscape;
};
oFF.ConnectionPool.prototype.getProcess = function()
{
	return this.getSession();
};

oFF.SystemConnect = function() {};
oFF.SystemConnect.prototype = new oFF.DfNameObject();
oFF.SystemConnect.prototype._ff_c = "SystemConnect";

oFF.SystemConnect.create = function(connectionPool, systemName, systemDescription)
{
	var newObj = new oFF.SystemConnect();
	newObj.setupSystemConnect(connectionPool, systemName, systemDescription);
	return newObj;
};
oFF.SystemConnect._checkList = function(list)
{
	for (var i = 0; i < list.size(); )
	{
		if (list.get(i).isReleased())
		{
			list.removeAt(i);
		}
		else
		{
			i++;
		}
	}
};
oFF.SystemConnect.clearConnectionsFromList = function(connections)
{
	if (oFF.notNull(connections))
	{
		while (connections.size() > 0)
		{
			oFF.XObjectExt.release(connections.get(0));
		}
	}
};
oFF.SystemConnect.prototype.m_connectionPool = null;
oFF.SystemConnect.prototype.m_traceInfo = null;
oFF.SystemConnect.prototype.m_cache = null;
oFF.SystemConnect.prototype.m_isBatchEnabled = false;
oFF.SystemConnect.prototype.m_isEQSEnabled = false;
oFF.SystemConnect.prototype.m_reentranceTicket = null;
oFF.SystemConnect.prototype.m_dirtyConnections = null;
oFF.SystemConnect.prototype.m_sharedConnections = null;
oFF.SystemConnect.prototype.m_privateConnections = null;
oFF.SystemConnect.prototype.m_systemDescription = null;
oFF.SystemConnect.prototype.m_maximumSharedConnections = 0;
oFF.SystemConnect.prototype.m_currentSharedIndex = 0;
oFF.SystemConnect.prototype.m_internalConnectionCounter = 0;
oFF.SystemConnect.prototype.m_externalActiveConnections = 0;
oFF.SystemConnect.prototype.m_isPreflightRequired = false;
oFF.SystemConnect.prototype.m_preflightUri = null;
oFF.SystemConnect.prototype.m_serverMetadata = null;
oFF.SystemConnect.prototype.m_csrfToken = null;
oFF.SystemConnect.prototype.m_systemKeepAliveManager = null;
oFF.SystemConnect.prototype.m_customProperties = null;
oFF.SystemConnect.prototype.setupSystemConnect = function(connectionPool, systemName, systemDescription)
{
	this.m_connectionPool = oFF.XWeakReferenceUtil.getWeakRef(connectionPool);
	this._setupInternal(systemName);
	this.m_sharedConnections = oFF.XList.create();
	this.m_privateConnections = oFF.XList.create();
	this.m_dirtyConnections = oFF.XList.create();
	this.m_systemDescription = systemDescription;
	this.m_maximumSharedConnections = 1;
	if (this.m_systemDescription.isPreflightRequired())
	{
		var preflight = this.m_systemDescription.getResolvedPreflightUrl();
		this.m_preflightUri = oFF.XUri.createFromUrl(preflight);
		this.m_isPreflightRequired = true;
	}
	this.m_customProperties = oFF.XProperties.create();
	this.m_systemKeepAliveManager = oFF.SystemKeepAliveManager.create(this);
};
oFF.SystemConnect.prototype.releaseObject = function()
{
	this.clearConnections();
	if (oFF.notNull(this.m_systemKeepAliveManager))
	{
		this.m_systemKeepAliveManager = oFF.XObjectExt.release(this.m_systemKeepAliveManager);
	}
	this.m_cache = null;
	this.m_connectionPool = null;
	this.m_dirtyConnections = oFF.XObjectExt.release(this.m_dirtyConnections);
	this.m_privateConnections = oFF.XObjectExt.release(this.m_privateConnections);
	this.m_sharedConnections = oFF.XObjectExt.release(this.m_sharedConnections);
	this.m_reentranceTicket = null;
	this.m_systemDescription = null;
	this.m_traceInfo = null;
	oFF.DfNameObject.prototype.releaseObject.call( this );
};
oFF.SystemConnect.prototype._checkReleasedConnections = function()
{
	oFF.SystemConnect._checkList(this.m_sharedConnections);
	oFF.SystemConnect._checkList(this.m_privateConnections);
	oFF.SystemConnect._checkList(this.m_dirtyConnections);
};
oFF.SystemConnect.prototype.getConnectionExt = function(isPrivate, name)
{
	var sysConnections;
	var connectionContainer = null;
	if (isPrivate)
	{
		sysConnections = this.getPrivateConnections();
	}
	else
	{
		sysConnections = this.getSharedConnections();
		connectionContainer = this.getNextSharedConnection(name);
	}
	if (oFF.isNull(connectionContainer))
	{
		connectionContainer = oFF.ConnectionContainer.create(this, this.getSystemName(), isPrivate, this.m_internalConnectionCounter);
		this.m_internalConnectionCounter++;
		this.updateConnectionWithServerMetadata(connectionContainer);
		connectionContainer.setName(name);
		if (this.m_systemDescription.getSystemType().isTypeOf(oFF.SystemType.BW))
		{
			var env = this.getConnectionPoolBase().getSession().getEnvironment();
			var uriSession = env.getBooleanByKeyExt(oFF.XEnvironmentConstants.HTTP_ALLOW_URI_SESSION, true);
			if (uriSession)
			{
				connectionContainer.setUseUrlSessionId(true);
			}
		}
		sysConnections.add(connectionContainer);
	}
	this.m_systemKeepAliveManager.startPolling();
	return connectionContainer;
};
oFF.SystemConnect.prototype.getNextSharedConnection = function(name)
{
	var connection;
	if (oFF.notNull(name))
	{
		connection = oFF.XCollectionUtils.getByName(this.m_sharedConnections, name);
		if (oFF.notNull(connection))
		{
			return connection;
		}
	}
	if (this.m_isBatchEnabled && !this.m_sharedConnections.isEmpty())
	{
		return this.m_sharedConnections.get(0);
	}
	if (this.getTotalUsedConnections() >= this.m_maximumSharedConnections)
	{
		if (this.m_currentSharedIndex >= this.m_sharedConnections.size())
		{
			this.m_currentSharedIndex = 0;
		}
		connection = this.m_sharedConnections.get(this.m_currentSharedIndex);
		if (connection.getName() === null && oFF.notNull(name))
		{
			connection.setName(name);
		}
		this.m_currentSharedIndex++;
		return connection;
	}
	return null;
};
oFF.SystemConnect.prototype.getTraceInfo = function()
{
	return this.m_traceInfo;
};
oFF.SystemConnect.prototype.setTraceInfo = function(traceInfo)
{
	this.m_traceInfo = traceInfo;
};
oFF.SystemConnect.prototype.getConnectionCache = function()
{
	if (oFF.isNull(this.m_cache))
	{
		var process = this.getProcess();
		this.m_cache = process.getSystemCache(this.getSystemName());
	}
	return this.m_cache;
};
oFF.SystemConnect.prototype.isBatchEnabled = function()
{
	return this.m_isBatchEnabled;
};
oFF.SystemConnect.prototype.setIsBatchEnabled = function(isBatchEnabled)
{
	this.m_isBatchEnabled = isBatchEnabled;
};
oFF.SystemConnect.prototype.isEQSEnabled = function()
{
	return this.m_isEQSEnabled;
};
oFF.SystemConnect.prototype.setIsEQSEnabled = function(isEQSEnabled)
{
	this.m_isEQSEnabled = isEQSEnabled;
};
oFF.SystemConnect.prototype.getReentranceTicket = function()
{
	return this.m_reentranceTicket;
};
oFF.SystemConnect.prototype.setReentranceTicket = function(reentranceTicket)
{
	this.m_reentranceTicket = reentranceTicket;
};
oFF.SystemConnect.prototype.getAllOpenConnections = function(allOpenConnections)
{
	allOpenConnections.addAll(this.m_sharedConnections);
	allOpenConnections.addAll(this.m_privateConnections);
	return allOpenConnections;
};
oFF.SystemConnect.prototype.getSharedConnections = function()
{
	return this.m_sharedConnections;
};
oFF.SystemConnect.prototype.getPrivateConnections = function()
{
	return this.m_privateConnections;
};
oFF.SystemConnect.prototype.clearConnections = function()
{
	oFF.SystemConnect.clearConnectionsFromList(this.m_sharedConnections);
	oFF.SystemConnect.clearConnectionsFromList(this.m_privateConnections);
	if (oFF.notNull(this.m_systemKeepAliveManager))
	{
		this.m_systemKeepAliveManager.stopPolling();
	}
};
oFF.SystemConnect.prototype.getSystemName = function()
{
	return this.getName();
};
oFF.SystemConnect.prototype.getSystemType = function()
{
	return this.getSystemDescription().getSystemType();
};
oFF.SystemConnect.prototype.getSystemDescription = function()
{
	return this.m_systemDescription;
};
oFF.SystemConnect.prototype.setMaximumSharedConnections = function(maximumSharedConnections)
{
	this.m_maximumSharedConnections = maximumSharedConnections;
};
oFF.SystemConnect.prototype.getMaximumSharedConnections = function()
{
	return this.m_maximumSharedConnections;
};
oFF.SystemConnect.prototype.setExternalActiveConnections = function(activeConnections)
{
	this.m_externalActiveConnections = activeConnections;
};
oFF.SystemConnect.prototype.setExternalSharedConnection = function(name, csrfToken, sessionUrlRewrite)
{
	if (oFF.isNull(name))
	{
		var connection;
		for (var i = 0; i < this.m_sharedConnections.size(); )
		{
			connection = this.m_sharedConnections.get(i);
			if (connection.useSessionUrlRewrite() && oFF.XString.isEqual(connection.getSessionUrlRewrite(), sessionUrlRewrite))
			{
				return;
			}
		}
		if (this.getTotalUsedConnections() < this.m_maximumSharedConnections)
		{
			connection = this.getConnectionExt(false, name);
			if (oFF.notNull(connection))
			{
				if (connection.useSessionUrlRewrite() && connection.getSessionUrlRewrite() === null)
				{
					connection.setSessionUrlRewrite(sessionUrlRewrite);
					connection.setCsrfToken(csrfToken);
				}
			}
		}
	}
};
oFF.SystemConnect.prototype.getTotalUsedConnections = function()
{
	return this.m_sharedConnections.size() + this.m_externalActiveConnections;
};
oFF.SystemConnect.prototype.getConnectionPoolBase = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_connectionPool);
};
oFF.SystemConnect.prototype.isPreflightNeeded = function()
{
	return this.m_isPreflightRequired;
};
oFF.SystemConnect.prototype.setIsPreflightNeeded = function(isPrefligthNeeded)
{
	this.m_isPreflightRequired = isPrefligthNeeded;
};
oFF.SystemConnect.prototype.getPreflightUri = function()
{
	return this.m_preflightUri;
};
oFF.SystemConnect.prototype.getServerMetadata = function()
{
	return this.getServerMetadataExt(oFF.SyncType.BLOCKING, null, null).getData();
};
oFF.SystemConnect.prototype.setServerMetadata = function(serverMetadata)
{
	this.m_serverMetadata = serverMetadata;
	var allOpenConnections = this.getAllOpenConnections(oFF.XList.create());
	for (var i = 0; i < allOpenConnections.size(); i++)
	{
		var connection = allOpenConnections.get(i);
		this.updateConnectionWithServerMetadata(connection);
	}
};
oFF.SystemConnect.prototype.updateConnectionWithServerMetadata = function(connection)
{
	if (oFF.isNull(this.m_serverMetadata))
	{
		return;
	}
	connection.setReentranceTicket(this.m_serverMetadata.getReentranceTicket());
	var inaMetadata = this.m_serverMetadata.getMetadataForService(oFF.ServerService.INA);
	if (oFF.notNull(inaMetadata))
	{
		var batchCapability = inaMetadata.getByKey(oFF.ConnectionConstants.INA_CAPABILITY_SUPPORTS_BATCH);
		if (oFF.notNull(batchCapability))
		{
			var analyticsMetadata = this.m_serverMetadata.getMetadataForService(oFF.ServerService.ANALYTIC);
			var batchRsStreaming = oFF.notNull(analyticsMetadata) && analyticsMetadata.containsKey(oFF.ConnectionConstants.INA_CAPABILITY_SUPPORTS_BATCH_RS_STREAMING);
			connection.setSupportsBatchMode(true, batchRsStreaming, batchCapability.getValue());
			var xxlWSCapability = oFF.isNull(analyticsMetadata) ? null : analyticsMetadata.getByKey(oFF.ConnectionConstants.INA_FASTPATH_XXL_WS);
			if (oFF.notNull(xxlWSCapability))
			{
				connection.setWebServicePathForBLOBs(xxlWSCapability.getValue());
			}
		}
	}
	var session = this.getConnectionPoolBase().getProcess();
	var personalizationForSystem = session.getUserManager().getConnectionPersonalization(connection.getSystemName());
	personalizationForSystem.setTenantId(this.m_serverMetadata.getTenantId());
	personalizationForSystem.setInternalUser(this.m_serverMetadata.getOrcaUserName());
};
oFF.SystemConnect.prototype.getServerMetadataExt = function(syncType, listener, customIdentifier)
{
	if (oFF.notNull(this.m_serverMetadata) && this.m_serverMetadata.isReleased())
	{
		this.m_serverMetadata = null;
	}
	if (oFF.isNull(this.m_serverMetadata))
	{
		return this.getConnectionPoolBase().getOpenConnection(this.getSystemName()).getServerMetadataExt(syncType, listener, customIdentifier, false);
	}
	var result = oFF.ExtResult.create(this.m_serverMetadata, null);
	if (oFF.notNull(listener))
	{
		listener.onServerMetadataLoaded(result, this.m_serverMetadata, customIdentifier);
	}
	return result;
};
oFF.SystemConnect.prototype.getProcess = function()
{
	return this.getConnectionPoolBase().getProcess();
};
oFF.SystemConnect.prototype.getSession = function()
{
	return this.getConnectionPoolBase().getSession();
};
oFF.SystemConnect.prototype.isContextIdRequired = function()
{
	return this.getSystemDescription().isContextIdRequired();
};
oFF.SystemConnect.prototype.isCsrfTokenRequired = function()
{
	return this.getSystemDescription().isCsrfTokenRequired();
};
oFF.SystemConnect.prototype.getCsrfToken = function()
{
	if (this.getSession().hasFeature(oFF.FeatureToggleOlap.SHARED_CSRF_TOKENS))
	{
		return this.m_csrfToken;
	}
	else
	{
		oFF.noSupport();
	}
};
oFF.SystemConnect.prototype.setCsrfToken = function(csrfToken)
{
	if (this.getSession().hasFeature(oFF.FeatureToggleOlap.SHARED_CSRF_TOKENS))
	{
		this.m_csrfToken = csrfToken;
	}
	else
	{
		oFF.noSupport();
	}
};
oFF.SystemConnect.prototype.registerKeepAliveListener = function(listener)
{
	this.m_systemKeepAliveManager.registerKeepAliveListener(listener);
};
oFF.SystemConnect.prototype.unregisterKeepAliveListener = function(listener)
{
	this.m_systemKeepAliveManager.unregisterKeepAliveListener(listener);
};
oFF.SystemConnect.prototype.newBatchRequestManager = function()
{
	var session = this.getSession();
	return oFF.BatchRequestManagerFactory.createBatchRequestManager(session);
};
oFF.SystemConnect.prototype.newBatchFunction = function(connection, relativeUri)
{
	return oFF.RpcBatchFunction.create(connection, relativeUri);
};
oFF.SystemConnect.prototype.getCustomProperties = function()
{
	return this.m_customProperties;
};

oFF.DfProgram = function() {};
oFF.DfProgram.prototype = new oFF.XObjectExt();
oFF.DfProgram.prototype._ff_c = "DfProgram";

oFF.DfProgram.PARAM_SHOW_HELP = "help";
oFF.DfProgram.PARAM_SYNC_TYPE = "SyncType";
oFF.DfProgram.PARAM_VALUE_BLOCKING = "Blocking";
oFF.DfProgram.PARAM_VALUE_NON_BLOCKING = "NonBlocking";
oFF.DfProgram.PARAM_LOG_LEVEL = "loglevel";
oFF.DfProgram.PARAM_LOG_LAYER = "loglayer";
oFF.DfProgram.PARAM_XVERSION = "xversion";
oFF.DfProgram.PARAM_FEATURES = "features";
oFF.DfProgram.PARAM_INITIAL_SYS_TYPE = "initsystype";
oFF.DfProgram.PARAM_SYS_LANDSCAPE = "SystemLandscape";
oFF.DfProgram.PARAM_FILE = "file";
oFF.DfProgram.prototype.m_process = null;
oFF.DfProgram.prototype.m_showHelp = false;
oFF.DfProgram.prototype.m_argsConverted = false;
oFF.DfProgram.prototype.m_initialSystemType = null;
oFF.DfProgram.prototype.m_exitValues = null;
oFF.DfProgram.prototype.getProgramMetadata = function()
{
	var metadata = oFF.ProgramMetadata.create(this.getDefaultProgramDevice());
	this.doSetupProgramMetadata(metadata);
	return metadata;
};
oFF.DfProgram.prototype.doSetupProgramMetadata = function(metadata)
{
	metadata.addOption(oFF.DfProgram.PARAM_SYNC_TYPE, "The Synchronization type.", "Blocking|NonBlocking", oFF.XValueType.ENUM_CONSTANT);
	metadata.addOption(oFF.DfProgram.PARAM_SHOW_HELP, "Print the help text.", null, oFF.XValueType.BOOLEAN);
	metadata.addOption(oFF.DfProgram.PARAM_LOG_LEVEL, "Log level, 0-3. Default is 3.", "0: Debug, 1: Info, 2: Warning, 3: Error", oFF.XValueType.INTEGER);
	metadata.addOption(oFF.DfProgram.PARAM_LOG_LAYER, "Log layer, comma-separated. Default is all", "Server|Protocol|IOLayer|Driver|Application|Utility|Test|Misc|All|None", oFF.XValueType.STRING);
	var buffer = oFF.XStringBuffer.create();
	buffer.appendInt(oFF.XVersion.MIN);
	buffer.append(" - ");
	buffer.appendInt(oFF.XVersion.MAX);
	metadata.addOption(oFF.DfProgram.PARAM_XVERSION, "XVersion. Default is the inherited basedline (typically XVersion.MAX)", buffer.toString(), oFF.XValueType.INTEGER);
	metadata.addOption(oFF.DfProgram.PARAM_FEATURES, "List of feature toggles, comma-separated.", "...", oFF.XValueType.STRING);
	metadata.addOption(oFF.DfProgram.PARAM_INITIAL_SYS_TYPE, "Initial system type", "HANA|BW|...", oFF.XValueType.STRING);
};
oFF.DfProgram.prototype.setup = function()
{
	oFF.XObjectExt.prototype.setup.call( this );
};
oFF.DfProgram.prototype.releaseObject = function()
{
	this.m_process = null;
	this.m_initialSystemType = null;
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.DfProgram.prototype.getComponentType = function()
{
	return oFF.XComponentType.PROGRAM;
};
oFF.DfProgram.prototype.getLogLayer = function()
{
	return oFF.OriginLayer.APPLICATION;
};
oFF.DfProgram.prototype.runFull = function()
{
	try
	{
		this.evalArguments();
		this.initializeProgram();
		this.runProgram();
	}
	catch (e)
	{
		this.getStdout().print("\nUnexpected exception during Program Execution\n");
		this.getStdout().println(oFF.XErrorHelper.convertExceptionToString(e));
		this.getStdout().println(oFF.XException.getStackTrace(e, 0));
	}
};
oFF.DfProgram.prototype.evalArguments = function()
{
	var session = this.getSession();
	if (oFF.isNull(session))
	{
		throw oFF.XException.createIllegalStateException("No session given at startup time");
	}
	var prgArg = this.getArguments();
	var argStructure = this.getArgumentStructure();
	var argumentDefinitions = prgArg.getArgumentDefinitions();
	for (var i = 0; i < argumentDefinitions.size(); i++)
	{
		var argDef = argumentDefinitions.get(i);
		if (argDef.isMandatory())
		{
			if (argStructure.containsKey(argDef.getName()) === false)
			{
				this.println(oFF.XStringUtils.concatenate2("Argument not given: ", argDef.getName()));
				this.setShowHelp(true);
			}
		}
	}
	var syncParam = argStructure.getStringByKeyExt(oFF.DfProgram.PARAM_SYNC_TYPE, null);
	if (oFF.notNull(syncParam))
	{
		if (oFF.XString.isEqual(syncParam, oFF.DfProgram.PARAM_VALUE_BLOCKING))
		{
			session.setDefaultSyncType(oFF.SyncType.BLOCKING);
		}
		else
		{
			session.setDefaultSyncType(oFF.SyncType.NON_BLOCKING);
		}
	}
	var logLevel = argStructure.getIntegerByKeyExt(oFF.DfProgram.PARAM_LOG_LEVEL, -1);
	if (logLevel !== -1)
	{
		var logWriterWithFilter = session.getLogWriterBase();
		logWriterWithFilter.setLogFilterLevel(logLevel);
	}
	var logLayerName = argStructure.getStringByKeyExt(oFF.DfProgram.PARAM_LOG_LAYER, null);
	if (oFF.notNull(logLayerName))
	{
		var logWriterWithFilter2 = session.getLogWriterBase();
		logWriterWithFilter2.addLogLayer(logLayerName);
	}
	var xVersionValue = argStructure.getIntegerByKeyExt(oFF.DfProgram.PARAM_XVERSION, -3);
	if (xVersionValue !== -3)
	{
		session.setXVersion(xVersionValue);
	}
	var features = argStructure.getStringByKey(oFF.DfProgram.PARAM_FEATURES);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(features))
	{
		var featureValues = oFF.XStringTokenizer.splitString(features, ",");
		for (var k = 0; k < featureValues.size(); k++)
		{
			var featureToggle = oFF.FeatureToggleOlap.lookup(featureValues.get(k));
			if (oFF.notNull(featureToggle))
			{
				session.activateFeatureToggle(featureToggle);
			}
		}
	}
	this.setShowHelp(prgArg.getBooleanByKeyExt(oFF.DfProgram.PARAM_SHOW_HELP, this.m_showHelp));
	var initialSystemTypeValue = argStructure.getStringByKey(oFF.DfProgram.PARAM_INITIAL_SYS_TYPE);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(initialSystemTypeValue))
	{
		var initialSystemType = oFF.SystemType.lookup(initialSystemTypeValue);
		this.setInitialSystemType(initialSystemType);
	}
};
oFF.DfProgram.prototype.initializeProgram = function() {};
oFF.DfProgram.prototype.runProgram = function()
{
	if (this.m_showHelp === true)
	{
		var programMetadata = this.getProgramMetadata();
		var helpText = oFF.ProgramUtils.generateHelp(programMetadata);
		this.println(helpText);
		this.getProgramContainer().setExitContent(oFF.XContent.createStringContent(oFF.ContentType.TEXT, helpText));
		this.exitNow(1);
	}
	else
	{
		this.runProcess();
	}
};
oFF.DfProgram.prototype.getProgramDevice = function()
{
	var prgCfg = this.getProcess().getProgramCfg();
	if (oFF.notNull(prgCfg) && prgCfg.getResolvedOutputDevice() !== oFF.ProgramDevice.NONE)
	{
		return prgCfg.getResolvedOutputDevice();
	}
	return this.getDefaultProgramDevice();
};
oFF.DfProgram.prototype.getDefaultProgramDevice = function()
{
	return oFF.ProgramDevice.CONSOLE;
};
oFF.DfProgram.prototype.canTerminate = function()
{
	return true;
};
oFF.DfProgram.prototype.requestExit = function()
{
	this.exitNow(0);
};
oFF.DfProgram.prototype.exitNow = function(code)
{
	var process = this.getProcess();
	if (oFF.notNull(process))
	{
		var processId = process.getProcessId();
		var kernel = process.getKernel();
		kernel.processShutdownProcess(null, null, null, processId, false);
	}
};
oFF.DfProgram.prototype.isShowHelp = function()
{
	return this.m_showHelp;
};
oFF.DfProgram.prototype.setShowHelp = function(hasShowHelp)
{
	this.m_showHelp = hasShowHelp;
};
oFF.DfProgram.prototype.registerOnProgramContainerOpen = function(listener)
{
	var prgContainer = this.getProgramContainer();
	if (oFF.notNull(prgContainer))
	{
		prgContainer.registerOnProgramContainerOpen(listener);
	}
};
oFF.DfProgram.prototype.registerOnProgramContainerClose = function(listener)
{
	var prgContainer = this.getProgramContainer();
	if (oFF.notNull(prgContainer))
	{
		prgContainer.registerOnProgramContainerClose(listener);
	}
};
oFF.DfProgram.prototype.updateFileParam = function(newFilePath)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(newFilePath))
	{
		this.getArgumentStructure().putString(oFF.DfProgram.PARAM_FILE, newFilePath);
	}
	else
	{
		this.getArgumentStructure().remove(oFF.DfProgram.PARAM_FILE);
	}
	this.getProcess().notifyProcessEvent(oFF.ProcessEventType.START_CFG_CHANGED);
};
oFF.DfProgram.prototype.getProgramContainer = function()
{
	var process = this.getProcess();
	var startConfiguration = process.getProgramCfg();
	var programContainer = startConfiguration.getProgramContainer();
	return programContainer;
};
oFF.DfProgram.prototype.getArguments = function()
{
	var process = this.getProcess();
	var startConfiguration = process.getProgramCfg();
	var args = startConfiguration.getArguments();
	if (this.m_argsConverted === false)
	{
		if (oFF.isNull(args))
		{
			args = oFF.ProgramArgs.createWithStructure(oFF.PrFactory.createStructure());
			startConfiguration.setArguments(args);
		}
		if (args.getArgumentDefinitions() === null)
		{
			var argDefs = this.getProgramMetadata().getArgDefinitions();
			args.setArgumentDefinitions(argDefs);
		}
		if (args.isArgumentStructureOrigin() === false)
		{
			args.convertToStructure();
		}
		this.m_argsConverted = true;
	}
	return args;
};
oFF.DfProgram.prototype.setProcess = function(process)
{
	this.m_process = process;
};
oFF.DfProgram.prototype.getProcess = function()
{
	return this.m_process;
};
oFF.DfProgram.prototype.getSession = function()
{
	return this.m_process;
};
oFF.DfProgram.prototype.setDefaultSyncType = oFF.noSupport;
oFF.DfProgram.prototype.getDefaultSyncType = function()
{
	return this.m_process.getDefaultSyncType();
};
oFF.DfProgram.prototype.getLogWriter = function()
{
	return this.getSession().getLogWriter();
};
oFF.DfProgram.prototype.getStdout = function()
{
	return this.getSession().getStdout();
};
oFF.DfProgram.prototype.getStdin = function()
{
	return this.getSession().getStdin();
};
oFF.DfProgram.prototype.getStdlog = function()
{
	return this.getSession().getStdlog();
};
oFF.DfProgram.prototype.print = function(text)
{
	var outputWriteStream = this.getStdout();
	if (oFF.notNull(outputWriteStream))
	{
		outputWriteStream.print(text);
	}
};
oFF.DfProgram.prototype.println = function(text)
{
	var outputWriteStream = this.getStdout();
	if (oFF.notNull(outputWriteStream))
	{
		outputWriteStream.println(text);
	}
};
oFF.DfProgram.prototype.readLine = function(listener)
{
	return null;
};
oFF.DfProgram.prototype.supportsSyncType = function(syncType)
{
	return false;
};
oFF.DfProgram.prototype.processShutdown = function(syncType, listener, customIdentifier)
{
	return oFF.ProgramShutdownAction.createAndRun(syncType, listener, customIdentifier, this);
};
oFF.DfProgram.prototype.getExitValue = function()
{
	return this.m_exitValues;
};
oFF.DfProgram.prototype.setExitValue = function(exitValue)
{
	this.m_exitValues = exitValue;
};
oFF.DfProgram.prototype.getArgumentList = function()
{
	return this.getArguments().getArgumentList();
};
oFF.DfProgram.prototype.getArgumentStructure = function()
{
	return this.getArguments().getArgumentStructure();
};
oFF.DfProgram.prototype.setInitialSystemType = function(systemType)
{
	this.m_initialSystemType = systemType;
};
oFF.DfProgram.prototype.getInitialSystemType = function()
{
	return this.m_initialSystemType;
};

oFF.ProgramContainer = function() {};
oFF.ProgramContainer.prototype = new oFF.XObject();
oFF.ProgramContainer.prototype._ff_c = "ProgramContainer";

oFF.ProgramContainer.createProgramContainer = function(startCfg, program)
{
	var newObj = new oFF.ProgramContainer();
	newObj.setupContainer(startCfg, program);
	return newObj;
};
oFF.ProgramContainer.create = function()
{
	var newObj = new oFF.ProgramContainer();
	newObj.setupContainer(null, null);
	return newObj;
};
oFF.ProgramContainer.prototype.m_title = null;
oFF.ProgramContainer.prototype.m_startCfg = null;
oFF.ProgramContainer.prototype.m_program = null;
oFF.ProgramContainer.prototype.m_exitContent = null;
oFF.ProgramContainer.prototype.m_process = null;
oFF.ProgramContainer.prototype.m_prgContainerOpenListener = null;
oFF.ProgramContainer.prototype.m_prgContainerCloseListener = null;
oFF.ProgramContainer.prototype.setupContainer = function(startCfg, program)
{
	this.m_startCfg = startCfg;
	this.m_program = program;
};
oFF.ProgramContainer.prototype.releaseObject = function()
{
	this.m_startCfg = null;
	this.m_program = null;
	this.m_prgContainerOpenListener = null;
	this.m_prgContainerCloseListener = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.ProgramContainer.prototype.getTitle = function()
{
	return this.m_title;
};
oFF.ProgramContainer.prototype.setTitle = function(title)
{
	this.m_title = title;
	var process = this.getProcess();
	var event = oFF.ProcessEvent.create(process, null, oFF.ProcessEventType.PROGRAM_TITLE_CHANGED, oFF.XStringValue.create(title));
	process.notifyProcessEventExt(event);
};
oFF.ProgramContainer.prototype.getStartCfg = function()
{
	return this.m_startCfg;
};
oFF.ProgramContainer.prototype.setStartCfg = function(startCfg)
{
	this.m_startCfg = startCfg;
};
oFF.ProgramContainer.prototype.getProgram = function()
{
	return this.m_program;
};
oFF.ProgramContainer.prototype.setProgram = function(program)
{
	this.m_program = program;
};
oFF.ProgramContainer.prototype.setExitContent = function(content)
{
	this.m_exitContent = content;
};
oFF.ProgramContainer.prototype.getExitContent = function()
{
	return this.m_exitContent;
};
oFF.ProgramContainer.prototype.runFull = function()
{
	this.m_program.runFull();
};
oFF.ProgramContainer.prototype.getProcess = function()
{
	return this.m_process;
};
oFF.ProgramContainer.prototype.getSession = function()
{
	return this.m_process;
};
oFF.ProgramContainer.prototype.setProcess = function(process)
{
	this.m_process = process;
};
oFF.ProgramContainer.prototype.registerOnProgramContainerOpen = function(listener)
{
	this.m_prgContainerOpenListener = listener;
};
oFF.ProgramContainer.prototype.getProgramContainerOpenListener = function()
{
	return this.m_prgContainerOpenListener;
};
oFF.ProgramContainer.prototype.registerOnProgramContainerClose = function(listener)
{
	this.m_prgContainerCloseListener = listener;
};
oFF.ProgramContainer.prototype.getProgramContainerCloseListener = function()
{
	return this.m_prgContainerCloseListener;
};
oFF.ProgramContainer.prototype.shutdownContainer = function() {};
oFF.ProgramContainer.prototype.isUiContainer = function()
{
	return false;
};
oFF.ProgramContainer.prototype.isModalContainer = function()
{
	return false;
};
oFF.ProgramContainer.prototype.isContainerOpen = function()
{
	return false;
};

oFF.SigSelManager = function() {};
oFF.SigSelManager.prototype = new oFF.DfSessionContext();
oFF.SigSelManager.prototype._ff_c = "SigSelManager";

oFF.SigSelManager.s_spaceFactories = null;
oFF.SigSelManager.staticSetup = function()
{
	oFF.SigSelManager.s_spaceFactories = oFF.XHashMapByString.create();
};
oFF.SigSelManager.registerFactory = function(componentType, factory)
{
	oFF.SigSelManager.s_spaceFactories.put(componentType.getName(), factory);
};
oFF.SigSelManager.create = function(session)
{
	var newObj = new oFF.SigSelManager();
	newObj.setupSessionContext(session);
	return newObj;
};
oFF.SigSelManager.prototype.m_selectProviders = null;
oFF.SigSelManager.prototype.setupSessionContext = function(session)
{
	oFF.DfSessionContext.prototype.setupSessionContext.call( this , session);
	this.m_selectProviders = oFF.XHashMapByString.create();
};
oFF.SigSelManager.prototype.selectComponentByExpr = function(sigSelExpression, defaultDomain, contextObject, maximumCount, mergeIntoSpace)
{
	var list = this.selectComponentsByExpr(sigSelExpression, defaultDomain, contextObject, maximumCount);
	var component = this.merge(list, mergeIntoSpace);
	return component;
};
oFF.SigSelManager.prototype.selectComponentsByExpr = function(sigSelExpression, defaultDomain, contextObject, maximumCount)
{
	var resultList = oFF.XList.create();
	if (oFF.notNull(sigSelExpression))
	{
		var parser = oFF.SigSelParser.create();
		var result = parser.parse(sigSelExpression);
		if (result.isValid())
		{
			var ops = result.getData();
			for (var i = 0; i < ops.size(); i++)
			{
				var operation = ops.get(i);
				var list = this.selectComponentsByOp(operation, defaultDomain, contextObject, maximumCount);
				if (oFF.notNull(list) && list.size() > 0)
				{
					resultList.addAll(list);
				}
				if (resultList.size() >= maximumCount)
				{
					break;
				}
			}
		}
	}
	return resultList;
};
oFF.SigSelManager.prototype.selectComponentByOp = function(operation, defaultDomain, contextObject, maximumCount, mergeIntoSpace)
{
	var list = this.selectComponentsByOp(operation, defaultDomain, contextObject, maximumCount);
	var component = this.merge(list, mergeIntoSpace);
	return component;
};
oFF.SigSelManager.prototype.merge = function(list, mergeIntoSpace)
{
	var component = null;
	if (oFF.notNull(list) && list.size() > 0)
	{
		component = list.get(0);
		if (mergeIntoSpace === true)
		{
			var theFactory = this.getFactory(component);
			if (oFF.notNull(theFactory))
			{
				var spacer = theFactory.newSpacer(this.getSession());
				for (var i = 0; i < list.size(); i++)
				{
					spacer.addComponent(list.get(i));
				}
				component = spacer;
			}
		}
	}
	return component;
};
oFF.SigSelManager.prototype.selectComponentsByOp = function(operation, defaultDomain, contextObject, maximumCount)
{
	var domain = operation.getDomain();
	if (domain === oFF.SigSelDomain.CONTEXT)
	{
		domain = defaultDomain;
	}
	var selectProvider = this.m_selectProviders.getByKey(domain.getName());
	var list = null;
	if (oFF.notNull(selectProvider))
	{
		list = selectProvider.selectProviderComponents(operation, domain, contextObject, maximumCount);
	}
	return list;
};
oFF.SigSelManager.prototype.getFactory = function(component)
{
	var theFactory = null;
	var componentType = component.getComponentType();
	while (oFF.notNull(componentType) && oFF.isNull(theFactory))
	{
		var name = componentType.getName();
		theFactory = oFF.SigSelManager.s_spaceFactories.getByKey(name);
		componentType = componentType.getParent();
	}
	return theFactory;
};
oFF.SigSelManager.prototype.registerSelector = function(domain, selector)
{
	this.m_selectProviders.put(domain.getName(), selector);
};
oFF.SigSelManager.prototype.getRegisteredDomain = function()
{
	var domains = oFF.XList.create();
	var iterator = this.m_selectProviders.getKeysAsIteratorOfString();
	while (iterator.hasNext())
	{
		var domain = oFF.SigSelDomain.lookup(iterator.next());
		domains.add(domain);
	}
	return domains;
};
oFF.SigSelManager.prototype.getSelector = function(domain)
{
	return this.m_selectProviders.getByKey(domain.getName());
};

oFF.SigSelOperation = function() {};
oFF.SigSelOperation.prototype = new oFF.DfNameObject();
oFF.SigSelOperation.prototype._ff_c = "SigSelOperation";

oFF.SigSelOperation.create = function()
{
	var newObj = new oFF.SigSelOperation();
	newObj.m_arrayAccess = oFF.SigSelIndexType.NONE;
	newObj.m_domain = oFF.SigSelDomain.CONTEXT;
	return newObj;
};
oFF.SigSelOperation.prototype.m_domain = null;
oFF.SigSelOperation.prototype.m_identifier = null;
oFF.SigSelOperation.prototype.m_selectedComponentType = null;
oFF.SigSelOperation.prototype.m_property = null;
oFF.SigSelOperation.prototype.m_operationType = null;
oFF.SigSelOperation.prototype.m_child = null;
oFF.SigSelOperation.prototype.m_arrayAccess = null;
oFF.SigSelOperation.prototype.m_indexName = null;
oFF.SigSelOperation.prototype.m_indexNumber = 0;
oFF.SigSelOperation.prototype.setId = function(identifier)
{
	this.m_identifier = identifier;
};
oFF.SigSelOperation.prototype.getId = function()
{
	return this.m_identifier;
};
oFF.SigSelOperation.prototype.getDomain = function()
{
	return this.m_domain;
};
oFF.SigSelOperation.prototype.setDomain = function(domain)
{
	this.m_domain = domain;
};
oFF.SigSelOperation.prototype.setSelectedComponentType = function(type)
{
	this.m_selectedComponentType = type;
};
oFF.SigSelOperation.prototype.getSelectedComponentType = function()
{
	return this.m_selectedComponentType;
};
oFF.SigSelOperation.prototype.getSelectedProperty = function()
{
	return this.m_property;
};
oFF.SigSelOperation.prototype.setSelectedProperty = function(property)
{
	this.m_property = property;
};
oFF.SigSelOperation.prototype.getOperationType = function()
{
	return this.m_operationType;
};
oFF.SigSelOperation.prototype.setOperationType = function(type)
{
	this.m_operationType = type;
};
oFF.SigSelOperation.prototype.getChild = function()
{
	return this.m_child;
};
oFF.SigSelOperation.prototype.setChild = function(op)
{
	this.m_child = op;
};
oFF.SigSelOperation.prototype.getIndexType = function()
{
	return this.m_arrayAccess;
};
oFF.SigSelOperation.prototype.setIndexType = function(type)
{
	this.m_arrayAccess = type;
};
oFF.SigSelOperation.prototype.getIndexName = function()
{
	return this.m_indexName;
};
oFF.SigSelOperation.prototype.setIndexName = function(name)
{
	this.m_indexName = name;
};
oFF.SigSelOperation.prototype.getIndexPosition = function()
{
	return this.m_indexNumber;
};
oFF.SigSelOperation.prototype.setIndexPosition = function(position)
{
	this.m_indexNumber = position;
};
oFF.SigSelOperation.prototype.getUri = function()
{
	var uri = oFF.XUri.create();
	uri.setSupportsAuthority(false);
	if (this.m_domain === oFF.SigSelDomain.UI)
	{
		uri.setProtocolType(oFF.ProtocolType.UI);
	}
	else if (this.m_domain === oFF.SigSelDomain.DATA)
	{
		uri.setProtocolType(oFF.ProtocolType.DATAPROVIDER);
	}
	var buffer = oFF.XStringBuffer.create();
	if (this.m_operationType === oFF.SigSelType.MATCH_NAME)
	{
		var name = this.getName();
		if (oFF.notNull(name))
		{
			buffer.append(name);
		}
	}
	else if (this.m_operationType === oFF.SigSelType.MATCH_ID)
	{
		var theId = this.getId();
		if (oFF.notNull(theId))
		{
			buffer.append("!").append(theId);
		}
	}
	else if (this.m_operationType === oFF.SigSelType.WILDCARD)
	{
		buffer.append("*");
	}
	if (oFF.notNull(this.m_selectedComponentType))
	{
		buffer.append(".").append(this.m_selectedComponentType.getName());
	}
	var path = buffer.toString();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(path))
	{
		uri.setPath(path);
	}
	if (oFF.notNull(this.m_property))
	{
		uri.setFragment(this.m_property);
	}
	return uri;
};
oFF.SigSelOperation.prototype.toString = function()
{
	var buffer = oFF.XStringBuffer.create();
	if (oFF.notNull(this.m_operationType))
	{
		buffer.append("Domain: ").appendLine(this.m_domain.getName());
	}
	if (oFF.notNull(this.m_operationType))
	{
		buffer.append("OpType: ").appendLine(this.m_operationType.getName());
	}
	if (this.getName() !== null)
	{
		buffer.append("Name: ").appendLine(this.getName());
	}
	if (oFF.notNull(this.m_identifier))
	{
		buffer.append("Id: ").appendLine(this.m_identifier);
	}
	if (oFF.notNull(this.m_selectedComponentType))
	{
		buffer.append("ComponentType: ").appendLine(this.m_selectedComponentType.getName());
	}
	if (oFF.notNull(this.m_property))
	{
		buffer.append("Property: ").appendLine(this.m_property);
	}
	return buffer.toString();
};
oFF.SigSelOperation.prototype.setName = function(name)
{
	this.m_name = name;
};

oFF.DfSubSystem = function() {};
oFF.DfSubSystem.prototype = new oFF.DfProcessContext();
oFF.DfSubSystem.prototype._ff_c = "DfSubSystem";

oFF.DfSubSystem.prototype.m_kernel = null;
oFF.DfSubSystem.prototype.setupProcessContext = function(process)
{
	oFF.DfProcessContext.prototype.setupProcessContext.call( this , process);
};
oFF.DfSubSystem.prototype.setupSubSystem = function(kernel)
{
	kernel.getKernelProcess();
	this.m_kernel = kernel;
};
oFF.DfSubSystem.prototype.getKernel = function()
{
	return this.m_kernel;
};
oFF.DfSubSystem.prototype.getLogLayer = function()
{
	return oFF.OriginLayer.SUBSYSTEM;
};
oFF.DfSubSystem.prototype.getMainApi = function()
{
	return this;
};
oFF.DfSubSystem.prototype.getAdminApi = function()
{
	return this;
};

oFF.RuntimeUserManager = function() {};
oFF.RuntimeUserManager.prototype = new oFF.DfProcessContext();
oFF.RuntimeUserManager.prototype._ff_c = "RuntimeUserManager";

oFF.RuntimeUserManager.create = function(process)
{
	var newObj = new oFF.RuntimeUserManager();
	newObj.setupProcessContext(process);
	return newObj;
};
oFF.RuntimeUserManager.prototype.m_connectionPersonalizationBySystem = null;
oFF.RuntimeUserManager.prototype.m_credentialsProvider = null;
oFF.RuntimeUserManager.prototype.m_userSettings = null;
oFF.RuntimeUserManager.prototype.setupProcessContext = function(process)
{
	oFF.DfProcessContext.prototype.setupProcessContext.call( this , process);
	this.m_connectionPersonalizationBySystem = oFF.XHashMapByString.create();
};
oFF.RuntimeUserManager.prototype.releaseObject = function()
{
	oFF.XObjectExt.release(this.m_connectionPersonalizationBySystem);
	oFF.XObjectExt.release(this.m_credentialsProvider);
	oFF.DfProcessContext.prototype.releaseObject.call( this );
};
oFF.RuntimeUserManager.prototype.newMergedPersonalization = function(systemName)
{
	var personalization = null;
	if (oFF.notNull(systemName))
	{
		personalization = oFF.ConnectionPersonalization.createPersonalization();
		var systemLandscape = this.getProcess().getSystemLandscape();
		var systemDescription = systemLandscape.getSystemDescription(systemName);
		personalization.setFromPersonalization(systemDescription);
		var storedPersonalization = this.getConnectionPersonalization(systemName);
		oFF.XConnectHelper.setOverdefinedConnectionPersonalization(storedPersonalization, personalization);
	}
	return personalization;
};
oFF.RuntimeUserManager.prototype.getCurrentUser = function()
{
	return null;
};
oFF.RuntimeUserManager.prototype.getConnectionPersonalization = function(systemName)
{
	var tokenStorage = this.m_connectionPersonalizationBySystem.getByKey(systemName);
	if (oFF.isNull(tokenStorage))
	{
		tokenStorage = oFF.ConnectionPersonalization.createPersonalization();
		this.m_connectionPersonalizationBySystem.put(systemName, tokenStorage);
	}
	return tokenStorage;
};
oFF.RuntimeUserManager.prototype.processGetCredentials = function(syncType, listener, customIdentifier, connection, credentialsCallCounter, response, messages, changedType)
{
	var credentialsProvider = this.getCredentialsProvider();
	return credentialsProvider.processGetCredentials(syncType, listener, customIdentifier, connection, credentialsCallCounter, response, messages, changedType);
};
oFF.RuntimeUserManager.prototype.getCredentialsProvider = function()
{
	if (oFF.isNull(this.m_credentialsProvider))
	{
		this.m_credentialsProvider = oFF.CredentialsFactory.create(this);
	}
	return this.m_credentialsProvider;
};
oFF.RuntimeUserManager.prototype.supportsOnErrorHandling = function()
{
	var credentialsProvider = this.getCredentialsProvider();
	return credentialsProvider.supportsOnErrorHandling();
};
oFF.RuntimeUserManager.prototype.notifyCredentialsSuccess = function(connection)
{
	var credentialsProvider = this.getCredentialsProvider();
	credentialsProvider.notifyCredentialsSuccess(connection);
};
oFF.RuntimeUserManager.prototype.getUserSettings = function()
{
	if (oFF.isNull(this.m_userSettings))
	{
		this.m_userSettings = oFF.UserSettingsFactory.create(this.getSession());
	}
	return this.m_userSettings;
};

oFF.Capability = function() {};
oFF.Capability.prototype = new oFF.XNameValuePair();
oFF.Capability.prototype._ff_c = "Capability";

oFF.Capability.createCapabilityInfo = function(name, value)
{
	var object = new oFF.Capability();
	object.setupWithNameValue(name, value);
	return object;
};

oFF.MfsDirectory = function() {};
oFF.MfsDirectory.prototype = new oFF.MfsElement();
oFF.MfsDirectory.prototype._ff_c = "MfsDirectory";

oFF.MfsDirectory.create = function()
{
	return new oFF.MfsDirectory();
};
oFF.MfsDirectory.prototype.releaseObject = function()
{
	oFF.MfsElement.prototype.releaseObject.call( this );
};
oFF.MfsDirectory.prototype.getChild = function(name)
{
	return null;
};
oFF.MfsDirectory.prototype.getChildNames = function()
{
	return null;
};
oFF.MfsDirectory.prototype.removeChild = function(name) {};
oFF.MfsDirectory.prototype.setChild = function(name, content) {};
oFF.MfsDirectory.prototype.setDirectory = function(name)
{
	return null;
};

oFF.MfsFile = function() {};
oFF.MfsFile.prototype = new oFF.MfsElement();
oFF.MfsFile.prototype._ff_c = "MfsFile";

oFF.MfsFile.create = function()
{
	return new oFF.MfsFile();
};
oFF.MfsFile.prototype.getContent = function()
{
	return null;
};

oFF.VfsElementFile = function() {};
oFF.VfsElementFile.prototype = new oFF.VfsElement();
oFF.VfsElementFile.prototype._ff_c = "VfsElementFile";

oFF.VfsElementFile.createFile = function(vfs, path, name, content)
{
	var newObj = new oFF.VfsElementFile();
	newObj.setupElement(vfs, name);
	newObj.m_content = content;
	return newObj;
};
oFF.VfsElementFile.prototype.m_content = null;
oFF.VfsElementFile.prototype.getComponentType = function()
{
	return oFF.VfsElementType.FILE;
};
oFF.VfsElementFile.prototype.getContent = function()
{
	return this.m_content;
};
oFF.VfsElementFile.prototype.setContent = function(content)
{
	this.m_content = content;
};
oFF.VfsElementFile.prototype.isNode = function()
{
	return false;
};
oFF.VfsElementFile.prototype.toStringExt = function(buffer)
{
	if (oFF.notNull(this.m_content))
	{
		buffer.append(this.m_content.toString());
	}
	else
	{
		buffer.append("[no content]");
	}
};

oFF.VfsElementNode = function() {};
oFF.VfsElementNode.prototype = new oFF.VfsElement();
oFF.VfsElementNode.prototype._ff_c = "VfsElementNode";

oFF.VfsElementNode.prototype.m_pathOffset = 0;
oFF.VfsElementNode.prototype.setupElement = function(vfs, name)
{
	oFF.VfsElement.prototype.setupElement.call( this , vfs, name);
	this.m_pathOffset = 1;
};
oFF.VfsElementNode.prototype.getComponentType = function()
{
	return oFF.VfsElementType.NODE;
};
oFF.VfsElementNode.prototype.setParent = function(parent)
{
	oFF.VfsElement.prototype.setParent.call( this , parent);
	var parentOffset = this.m_parent.getPathOffset();
	this.m_pathOffset = parentOffset + oFF.XString.size(this.getName()) + 1;
};
oFF.VfsElementNode.prototype.getPathOffset = function()
{
	return this.m_pathOffset;
};
oFF.VfsElementNode.prototype.getChildNames = function()
{
	return null;
};
oFF.VfsElementNode.prototype.toStringExt = function(buffer)
{
	if (this.isNode())
	{
		buffer.append("Node: ");
	}
	else
	{
		buffer.append("Leaf: ");
	}
	buffer.append(this.getName());
	if (this.isNode())
	{
		buffer.appendNewLine();
		buffer.indent();
		var keys = this.getChildNames();
		for (var i = 0; i < keys.size(); i++)
		{
			var childName = keys.get(i);
			var child = this.getChild(childName);
			child.toStringExt(buffer);
			buffer.appendNewLine();
		}
		buffer.outdent();
	}
};

oFF.ModuleDef = function() {};
oFF.ModuleDef.prototype = new oFF.AbstractResourceDef();
oFF.ModuleDef.prototype._ff_c = "ModuleDef";

oFF.ModuleDef.create = function(name, clazzName, hasVariants, sourceLocation, listOfDependencies, baseUri, extendedJsonConfig)
{
	var moduleDef = new oFF.ModuleDef();
	moduleDef.setupExt(name, clazzName, hasVariants, sourceLocation, listOfDependencies, baseUri, extendedJsonConfig);
	return moduleDef;
};
oFF.ModuleDef.prototype.m_sourceLocation = null;
oFF.ModuleDef.prototype.m_baseUri = null;
oFF.ModuleDef.prototype.m_extendedJsonConfigString = null;
oFF.ModuleDef.prototype.m_isJsonParsed = false;
oFF.ModuleDef.prototype.m_hasVariants = false;
oFF.ModuleDef.prototype.setupExt = function(name, clazzName, hasVariants, sourceLocation, listOfDependencies, baseUri, extendedJsonConfig)
{
	oFF.AbstractResourceDef.prototype.setupResourceDef.call( this , name, clazzName, listOfDependencies);
	this.m_sourceLocation = sourceLocation;
	this.m_baseUri = baseUri;
	this.m_extendedJsonConfigString = extendedJsonConfig;
	this.m_hasVariants = hasVariants;
};
oFF.ModuleDef.prototype.getSourceLocation = function()
{
	return this.m_sourceLocation;
};
oFF.ModuleDef.prototype.getSourceLocationUri = function(session)
{
	var resolvedUri;
	var environment = session.getEnvironment();
	var baseUri = this.m_baseUri;
	if (oFF.isNull(baseUri))
	{
		var baseUrl = environment.getStringByKey(oFF.XEnvironmentConstants.FIREFLY_MODULE_PATH);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(baseUrl))
		{
			baseUri = oFF.XUri.createFromUrl(baseUrl);
		}
	}
	if (oFF.notNull(baseUri))
	{
		if (this.m_hasVariants === true)
		{
			var variantName = environment.getStringByKey(oFF.XEnvironmentConstants.FIREFLY_VARIANT);
			if (oFF.notNull(variantName))
			{
				var path = baseUri.getPath();
				if (oFF.XString.endsWith(path, "/"))
				{
					path = oFF.XString.substring(path, 0, oFF.XString.size(path) - 1);
				}
				path = oFF.XStringUtils.concatenate4(path, ".", variantName, "/");
				var newBase = oFF.XUri.createFromOther(baseUri);
				newBase.setPath(path);
				baseUri = newBase;
			}
		}
		resolvedUri = oFF.XUri.createChild(baseUri, this.m_sourceLocation);
	}
	else
	{
		resolvedUri = oFF.XUri.createFromUrl(this.m_sourceLocation);
	}
	return resolvedUri;
};
oFF.ModuleDef.prototype.setBaseUri = function(baseUri)
{
	this.m_baseUri = baseUri;
};
oFF.ModuleDef.prototype.checkJson = function()
{
	oFF.AbstractResourceDef.prototype.checkJson.call( this );
	if (oFF.notNull(this.m_extendedJsonConfigString) && this.m_isJsonParsed === false)
	{
		this.m_isJsonParsed = true;
		var document = oFF.JsonParserFactory.createFromString(this.m_extendedJsonConfigString);
		if (oFF.notNull(document) && document.isStructure())
		{
			document.asStructure();
		}
	}
};
oFF.ModuleDef.prototype.hasVariants = function()
{
	return this.m_hasVariants;
};

oFF.ResourceEntity = function() {};
oFF.ResourceEntity.prototype = new oFF.DfNameTextObject();
oFF.ResourceEntity.prototype._ff_c = "ResourceEntity";

oFF.ResourceEntity.create = function(id, name, text, language, type, url, variantName, tags)
{
	var newObj = new oFF.ResourceEntity();
	newObj.setupWithNameText(name, text);
	newObj.m_id = id;
	newObj.m_language = language;
	newObj.m_type = type;
	newObj.m_url = url;
	newObj.m_variantName = variantName;
	newObj.m_tags = tags;
	return newObj;
};
oFF.ResourceEntity.prototype.m_id = null;
oFF.ResourceEntity.prototype.m_language = null;
oFF.ResourceEntity.prototype.m_type = null;
oFF.ResourceEntity.prototype.m_url = null;
oFF.ResourceEntity.prototype.m_variantName = null;
oFF.ResourceEntity.prototype.m_tags = null;
oFF.ResourceEntity.prototype.getId = function()
{
	return this.m_id;
};
oFF.ResourceEntity.prototype.getLanguage = function()
{
	return this.m_language;
};
oFF.ResourceEntity.prototype.getType = function()
{
	return this.m_type;
};
oFF.ResourceEntity.prototype.getUrl = function()
{
	return this.m_url;
};
oFF.ResourceEntity.prototype.getVariantName = function()
{
	return this.m_variantName;
};
oFF.ResourceEntity.prototype.getTags = function()
{
	return this.m_tags;
};
oFF.ResourceEntity.prototype.isEqualTo = function(other)
{
	var isEqual = oFF.DfNameTextObject.prototype.isEqualTo.call( this , other);
	var theOther = other;
	isEqual = isEqual && this.getType() === theOther.getType();
	isEqual = isEqual && this.getLanguage() === theOther.getLanguage();
	isEqual = isEqual && oFF.XString.isEqual(this.getUrl(), theOther.getUrl());
	isEqual = isEqual && oFF.XString.isEqual(this.getVariantName(), theOther.getVariantName());
	isEqual = isEqual && oFF.XString.isEqual(this.getId(), theOther.getId());
	if (oFF.notNull(this.m_tags))
	{
		isEqual = isEqual && this.m_tags.isEqualTo(theOther.getTags());
	}
	else
	{
		isEqual = isEqual && theOther.getTags() === null;
	}
	return isEqual;
};

oFF.ConnectionContainer = function() {};
oFF.ConnectionContainer.prototype = new oFF.MessageManager();
oFF.ConnectionContainer.prototype._ff_c = "ConnectionContainer";

oFF.ConnectionContainer.create = function(systemConnect, systemName, isPrivate, internalCounter)
{
	var connectionContainer = new oFF.ConnectionContainer();
	connectionContainer.setupContainer(systemConnect, systemName, isPrivate, internalCounter);
	return connectionContainer;
};
oFF.ConnectionContainer.createFailedConnectionContainer = function(systemConnect, systemName, message)
{
	var connectionContainer = new oFF.ConnectionContainer();
	connectionContainer.setupContainer(systemConnect, systemName, true, 0);
	connectionContainer.addError(oFF.ErrorCodes.OTHER_ERROR, message);
	return connectionContainer;
};
oFF.ConnectionContainer.checkSecondaryServerMetadata = function(primary, secondary)
{
	var resultPrimary = primary;
	if (oFF.isNull(resultPrimary))
	{
		if (oFF.notNull(secondary) && secondary.getSyncState().isInSync() && secondary.isValid())
		{
			resultPrimary = secondary;
		}
	}
	if (oFF.notNull(resultPrimary) && resultPrimary.hasErrors())
	{
		resultPrimary = oFF.XObjectExt.release(resultPrimary);
	}
	return resultPrimary;
};
oFF.ConnectionContainer.prototype.m_uid = null;
oFF.ConnectionContainer.prototype.m_name = null;
oFF.ConnectionContainer.prototype.m_systemName = null;
oFF.ConnectionContainer.prototype.m_systemConnect = null;
oFF.ConnectionContainer.prototype.m_batchModePath = null;
oFF.ConnectionContainer.prototype.m_batchRequestManager = null;
oFF.ConnectionContainer.prototype.m_cache = null;
oFF.ConnectionContainer.prototype.m_systemDescription = null;
oFF.ConnectionContainer.prototype.m_internalCounter = 0;
oFF.ConnectionContainer.prototype.m_sysModCounter = 0;
oFF.ConnectionContainer.prototype.m_isBatchModeEnabled = false;
oFF.ConnectionContainer.prototype.m_supportsBatchMode = false;
oFF.ConnectionContainer.prototype.m_supportsBatchRsStreaming = false;
oFF.ConnectionContainer.prototype.m_isPrivate = false;
oFF.ConnectionContainer.prototype.m_reentranceTicket = null;
oFF.ConnectionContainer.prototype.m_useSessionUrlRewrite = false;
oFF.ConnectionContainer.prototype.m_sessionUrlRewrite = null;
oFF.ConnectionContainer.prototype.m_sessionContextId = null;
oFF.ConnectionContainer.prototype.m_logoffSent = false;
oFF.ConnectionContainer.prototype.m_customHeaders = null;
oFF.ConnectionContainer.prototype.m_XXLPath = null;
oFF.ConnectionContainer.prototype.m_customObjects = null;
oFF.ConnectionContainer.prototype.m_XXLPathWithSchemeHostPortPrefix = null;
oFF.ConnectionContainer.prototype.m_crossSiteForgeryToken = null;
oFF.ConnectionContainer.prototype.m_csrfRequestCounter = 0;
oFF.ConnectionContainer.prototype.m_serverMetadataFetcherBlocking = null;
oFF.ConnectionContainer.prototype.m_serverMetadataFetcherNonBlocking = null;
oFF.ConnectionContainer.prototype.m_sharedCsrfToken = false;
oFF.ConnectionContainer.prototype.m_sessionRequestSyncAction = null;
oFF.ConnectionContainer.prototype.m_cachingMode = null;
oFF.ConnectionContainer.prototype.setupContainer = function(systemConnect, systemName, isPrivate, internalCounter)
{
	var session = null;
	if (oFF.notNull(systemConnect))
	{
		session = systemConnect.getConnectionPoolBase().getSession();
		if (oFF.notNull(session))
		{
			this.m_sharedCsrfToken = session.hasFeature(oFF.FeatureToggleOlap.SHARED_CSRF_TOKENS);
		}
	}
	this.setupSessionContext(session);
	this.m_uid = oFF.XGuid.getGuid();
	this.m_systemConnect = oFF.XWeakReferenceUtil.getWeakRef(systemConnect);
	this.m_systemName = systemName;
	this.m_isPrivate = isPrivate;
	if (oFF.notNull(systemConnect))
	{
		var connectionPool = systemConnect.getConnectionPoolBase();
		var systemDescription = connectionPool.getSystemLandscape().getSystemDescription(this.m_systemName);
		this.m_systemDescription = oFF.XWeakReferenceUtil.getWeakRef(systemDescription);
		this.m_sysModCounter = systemDescription.getSysModCounter();
		this.m_internalCounter = internalCounter;
	}
	this.m_customHeaders = oFF.XProperties.create();
};
oFF.ConnectionContainer.prototype.supportsAnalyticCapability = function(capabilityName)
{
	var serverMetadata;
	var session = this.getSession();
	if (oFF.notNull(session) && session.hasFeature(oFF.FeatureToggleOlap.SERVER_METADATA_VIA_SYSTEM_CONNECT))
	{
		var systemConnect = this.getSystemConnect();
		if (oFF.isNull(systemConnect))
		{
			return false;
		}
		serverMetadata = systemConnect.getServerMetadata();
	}
	else
	{
		serverMetadata = this.getServerMetadata();
	}
	return oFF.notNull(serverMetadata) && serverMetadata.supportsAnalyticCapability(capabilityName);
};
oFF.ConnectionContainer.prototype.getDefaultMessageLayer = function()
{
	return oFF.OriginLayer.IOLAYER;
};
oFF.ConnectionContainer.prototype.releaseObject = function()
{
	this.logoff(oFF.SyncType.BLOCKING, null, null);
	this.m_serverMetadataFetcherBlocking = oFF.XObjectExt.release(this.m_serverMetadataFetcherBlocking);
	this.m_serverMetadataFetcherNonBlocking = oFF.XObjectExt.release(this.m_serverMetadataFetcherNonBlocking);
	var systemConnect = oFF.XWeakReferenceUtil.getHardRef(this.m_systemConnect);
	this.m_systemConnect = null;
	this.m_batchRequestManager = oFF.XObjectExt.release(this.m_batchRequestManager);
	this.m_batchModePath = null;
	this.m_cache = null;
	this.m_crossSiteForgeryToken = null;
	this.m_name = null;
	this.m_reentranceTicket = null;
	this.m_systemDescription = oFF.XObjectExt.release(this.m_systemDescription);
	this.m_systemName = null;
	this.m_sessionUrlRewrite = null;
	this.m_XXLPath = null;
	this.m_customHeaders = oFF.XObjectExt.release(this.m_customHeaders);
	this.m_customObjects = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_customObjects);
	this.m_XXLPathWithSchemeHostPortPrefix = null;
	oFF.MessageManager.prototype.releaseObject.call( this );
	if (oFF.notNull(systemConnect))
	{
		systemConnect._checkReleasedConnections();
	}
};
oFF.ConnectionContainer.prototype.logoff = function(syncType, listener, customIdentifier)
{
	if (!this.m_logoffSent)
	{
		var systemType = this.getSystemType();
		var logoffPath = oFF.isNull(systemType) ? null : systemType.getLogoffPath();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(logoffPath))
		{
			this.removePendingBatchFunctions();
			var closeFunction = this.newRpcFunction(logoffPath);
			var request = closeFunction.getRpcRequest();
			request.setRequestType(oFF.RpcRequestType.LOGOUT);
			request.setIsFireAndForgetCall(true);
			request.setIsLogoff(this.getSystemType().isTypeOf(oFF.SystemType.ABAP));
			if (systemType.isTypeOf(oFF.SystemType.HANA))
			{
				request.setMethod(oFF.HttpRequestMethod.HTTP_POST);
			}
			else
			{
				request.setMethod(oFF.HttpRequestMethod.HTTP_GET);
			}
			this.m_logoffSent = true;
			return closeFunction.processFunctionExecution(syncType, listener, customIdentifier);
		}
		else if (oFF.notNull(listener))
		{
			listener.onFunctionExecuted(oFF.ExtResult.createWithErrorMessage("No logoff path"), null, customIdentifier);
		}
	}
	else if (oFF.notNull(listener))
	{
		listener.onFunctionExecuted(oFF.ExtResult.createWithInfoMessage("Already logged off"), null, customIdentifier);
	}
	return null;
};
oFF.ConnectionContainer.prototype.removePendingBatchFunctions = function()
{
	if (this.isBatchModeEnabled())
	{
		this.m_isBatchModeEnabled = false;
		oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.getBatchFunctions());
	}
};
oFF.ConnectionContainer.prototype.getSystemDescription = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_systemDescription);
};
oFF.ConnectionContainer.prototype.getSystemType = function()
{
	var systemDescription = this.getSystemDescription();
	return oFF.isNull(systemDescription) ? null : systemDescription.getSystemType();
};
oFF.ConnectionContainer.prototype.getHost = function()
{
	var systemDescription = this.getSystemDescription();
	return oFF.isNull(systemDescription) ? null : systemDescription.getHost();
};
oFF.ConnectionContainer.prototype.getCookiesForPath = function(path)
{
	var domain = this.getHost();
	if (oFF.isNull(domain))
	{
		return null;
	}
	var connectionPool = this.getConnectionPool();
	if (oFF.isNull(connectionPool))
	{
		return null;
	}
	var cookiesMasterStore = connectionPool.getCookiesMasterStore();
	return cookiesMasterStore.getCookies(domain, path);
};
oFF.ConnectionContainer.prototype.mergeCookies = function(path, responseCookies)
{
	var connectionPool = this.getConnectionPool();
	if (oFF.notNull(connectionPool))
	{
		var cookiesMasterStore = connectionPool.getCookiesMasterStore();
		cookiesMasterStore.applyCookies(this.getHost(), path, responseCookies);
	}
};
oFF.ConnectionContainer.prototype.getReentranceTicket = function()
{
	var tmp = this.m_reentranceTicket;
	this.m_reentranceTicket = null;
	return tmp;
};
oFF.ConnectionContainer.prototype.setReentranceTicket = function(ticket)
{
	this.m_reentranceTicket = ticket;
};
oFF.ConnectionContainer.prototype.isContextIdRequired = function()
{
	return this.getSystemDescription().isContextIdRequired();
};
oFF.ConnectionContainer.prototype.isCsrfTokenRequired = function()
{
	return this.getSystemDescription().isCsrfTokenRequired();
};
oFF.ConnectionContainer.prototype.getCsrfToken = function()
{
	if (oFF.isNull(this.m_crossSiteForgeryToken) && this.hasSharedCsrfTokens())
	{
		var systemConnect = this.getSystemConnect();
		if (oFF.notNull(systemConnect))
		{
			this.m_crossSiteForgeryToken = systemConnect.getCsrfToken();
		}
	}
	return this.m_crossSiteForgeryToken;
};
oFF.ConnectionContainer.prototype.setCsrfToken = function(csrfToken)
{
	this.m_crossSiteForgeryToken = csrfToken;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(csrfToken))
	{
		if (this.hasSharedCsrfTokens())
		{
			var systemConnect = this.getSystemConnect();
			if (oFF.notNull(systemConnect))
			{
				systemConnect.setCsrfToken(csrfToken);
			}
		}
	}
};
oFF.ConnectionContainer.prototype.getCsrfRequiredCount = function()
{
	return this.m_csrfRequestCounter;
};
oFF.ConnectionContainer.prototype.resetCsrfAndIncRequiredCount = function()
{
	this.m_csrfRequestCounter = this.m_csrfRequestCounter + 1;
	this.m_crossSiteForgeryToken = null;
	if (this.hasSharedCsrfTokens())
	{
		var systemConnect = this.getSystemConnect();
		if (oFF.notNull(systemConnect))
		{
			systemConnect.setCsrfToken(null);
		}
	}
};
oFF.ConnectionContainer.prototype.resetRequiredCount = function()
{
	this.m_csrfRequestCounter = 0;
};
oFF.ConnectionContainer.prototype.getServerMetadata = function()
{
	var serverMetadata = null;
	var extResult = this.getServerMetadataExt(oFF.SyncType.BLOCKING, null, null, false);
	if (extResult.isValid())
	{
		serverMetadata = extResult.getData();
	}
	return serverMetadata;
};
oFF.ConnectionContainer.prototype.getServerMetadataExt = function(syncType, listener, customIdentifier, revalidate)
{
	this.validateMetadataFetcher(revalidate);
	var myServerMetadataFetcher;
	if (syncType === oFF.SyncType.BLOCKING)
	{
		this.m_serverMetadataFetcherBlocking = oFF.ConnectionContainer.checkSecondaryServerMetadata(this.m_serverMetadataFetcherBlocking, this.m_serverMetadataFetcherNonBlocking);
		myServerMetadataFetcher = this.m_serverMetadataFetcherBlocking;
	}
	else
	{
		this.m_serverMetadataFetcherNonBlocking = oFF.ConnectionContainer.checkSecondaryServerMetadata(this.m_serverMetadataFetcherNonBlocking, this.m_serverMetadataFetcherBlocking);
		myServerMetadataFetcher = this.m_serverMetadataFetcherNonBlocking;
	}
	if (oFF.isNull(myServerMetadataFetcher))
	{
		var systemType = this.getSystemType();
		var logonMetadataRequired = oFF.notNull(systemType) && systemType.isLogonMetadataRequired();
		if (this.isPreflightNeeded() || logonMetadataRequired)
		{
			var sequence = oFF.SyncActionSequence.create(syncType, listener, customIdentifier, this);
			if (this.isPreflightNeeded())
			{
				var preflightAction = oFF.ServerPreflightAction.createAndRun(oFF.SyncType.DELAYED, this, null, null);
				sequence.addAction(preflightAction);
			}
			var metadataAction = oFF.ServerMetadataAction.create(oFF.SyncType.DELAYED, this, null, null, revalidate);
			if (logonMetadataRequired)
			{
				var logonAction = oFF.ServerLoginAction.createAndRun(oFF.SyncType.DELAYED, this, null, null);
				sequence.addAction(logonAction);
				metadataAction.setLogonAction(logonAction);
			}
			sequence.setMainAction(metadataAction);
			myServerMetadataFetcher = sequence;
		}
		else
		{
			myServerMetadataFetcher = oFF.ServerMetadataAction.create(syncType, this, listener, customIdentifier, revalidate);
		}
		if (syncType === oFF.SyncType.BLOCKING)
		{
			this.m_serverMetadataFetcherBlocking = myServerMetadataFetcher;
		}
		else
		{
			this.m_serverMetadataFetcherNonBlocking = myServerMetadataFetcher;
		}
		myServerMetadataFetcher.process();
	}
	else
	{
		myServerMetadataFetcher.attachListener(listener, oFF.ListenerType.SPECIFIC, customIdentifier);
	}
	return myServerMetadataFetcher;
};
oFF.ConnectionContainer.prototype.validateMetadataFetcher = function(forceRevalidate)
{
	if (oFF.notNull(this.m_serverMetadataFetcherBlocking) && this.m_serverMetadataFetcherBlocking.isReleased())
	{
		this.m_serverMetadataFetcherBlocking = null;
	}
	if (oFF.notNull(this.m_serverMetadataFetcherNonBlocking) && this.m_serverMetadataFetcherNonBlocking.isReleased())
	{
		this.m_serverMetadataFetcherNonBlocking = null;
	}
	if (forceRevalidate)
	{
		if (this.m_serverMetadataFetcherBlocking === this.m_serverMetadataFetcherNonBlocking)
		{
			if (oFF.notNull(this.m_serverMetadataFetcherBlocking) && this.m_serverMetadataFetcherBlocking.getSyncState().isInSync())
			{
				this.m_serverMetadataFetcherBlocking = oFF.XObjectExt.release(this.m_serverMetadataFetcherBlocking);
				this.m_serverMetadataFetcherNonBlocking = null;
			}
		}
		else
		{
			if (oFF.notNull(this.m_serverMetadataFetcherBlocking) && this.m_serverMetadataFetcherBlocking.getSyncState().isInSync())
			{
				this.m_serverMetadataFetcherBlocking = oFF.XObjectExt.release(this.m_serverMetadataFetcherBlocking);
			}
			if (oFF.notNull(this.m_serverMetadataFetcherNonBlocking) && this.m_serverMetadataFetcherNonBlocking.getSyncState().isInSync())
			{
				this.m_serverMetadataFetcherNonBlocking = oFF.XObjectExt.release(this.m_serverMetadataFetcherNonBlocking);
			}
		}
	}
};
oFF.ConnectionContainer.prototype.newRpcFunctionForBLOB = function(name)
{
	var xxlPath = this.getWebServicePathForBLOBs();
	var originalPath = xxlPath.getPath();
	var completePath = oFF.XStringUtils.concatenate2(originalPath, name);
	var completeUri = oFF.XUri.createFromUrl(completePath);
	return this.newRpcFunctionInternal(completeUri, true);
};
oFF.ConnectionContainer.prototype.newRpcFunctionByService = function(serviceName)
{
	return this.newRpcFunctionByServiceAndPath(serviceName, null);
};
oFF.ConnectionContainer.prototype.newRpcFunctionByServiceAndPath = function(serviceName, path)
{
	var serverMetadata = this.getServerMetadata();
	if (oFF.isNull(serverMetadata))
	{
		return null;
	}
	var capabilities = serverMetadata.getMetadataForService(serviceName);
	var fastPath = capabilities.getByKey(oFF.ConnectionConstants.FAST_PATH);
	if (oFF.isNull(fastPath))
	{
		var systemType = this.getSystemType();
		return this.newRpcFunction(systemType.getInAPath());
	}
	if (oFF.notNull(path))
	{
		var uriWithFastPath = oFF.XUri.createFromOther(path);
		uriWithFastPath.setPath(oFF.XStringUtils.concatenate2(fastPath.getValue(), path.getPath()));
		return this.newRpcFunctionByUri(uriWithFastPath);
	}
	return this.newRpcFunction(fastPath.getValue());
};
oFF.ConnectionContainer.prototype.newRpcFunction = function(name)
{
	var relativeUri = oFF.XUri.createFromUrl(name);
	return this.newRpcFunctionByUri(relativeUri);
};
oFF.ConnectionContainer.prototype.newRpcFunctionForRemotePreQuery = function(name)
{
	var relativeUri = oFF.XUri.createFromUri(name);
	return this.newRpcFunctionInternal(relativeUri, false);
};
oFF.ConnectionContainer.prototype.newRpcFunctionByUri = function(relativeUri)
{
	if (this.isBatchModeEnabled())
	{
		var systemConnect = this.getSystemConnect();
		var batchFunction = systemConnect.newBatchFunction(this, relativeUri);
		this.m_batchRequestManager.addBatchFunction(batchFunction);
		return batchFunction;
	}
	return this.newRpcFunctionInternal(relativeUri, false);
};
oFF.ConnectionContainer.prototype.newRpcFunctionInternal = function(relativeUri, imageFunction)
{
	var systemDescription = this.getSystemDescription();
	var rpcFunction = null;
	if (oFF.notNull(systemDescription) && oFF.notNull(relativeUri))
	{
		var protocolType = systemDescription.getProtocolType();
		var systemType = systemDescription.getSystemType();
		var name = relativeUri.getPath();
		var theUri = relativeUri;
		if (this.getConnectionPool().isEqsEnabled(systemDescription.getSystemName()) === true)
		{
			var eqsRewritings = systemDescription.getEqsRewritings();
			if (oFF.notNull(eqsRewritings) && eqsRewritings.size() > 0)
			{
				for (var i = 0; i < eqsRewritings.size(); i++)
				{
					var pair = eqsRewritings.get(i);
					var pattern = pair.getName();
					if (oFF.XString.isEqual(pattern, name))
					{
						name = pair.getValue();
						var uriBase = oFF.XUri.createFromOther(relativeUri);
						uriBase.setPath(name);
						theUri = uriBase;
						break;
					}
				}
			}
		}
		rpcFunction = oFF.RpcFunctionFactory.create(this, systemDescription, theUri.getUrl(), systemType, protocolType);
		if (imageFunction)
		{
			rpcFunction.setStaticURL(true);
		}
		rpcFunction.setTraceInfo(this.getTraceInfo());
	}
	return rpcFunction;
};
oFF.ConnectionContainer.prototype.getTraceInfo = function()
{
	var connectionPool = this.getConnectionPool();
	return oFF.isNull(connectionPool) ? null : connectionPool.getTraceInfo(this.m_systemName);
};
oFF.ConnectionContainer.prototype.isBatchModeEnabled = function()
{
	return this.m_isBatchModeEnabled;
};
oFF.ConnectionContainer.prototype.getBatchFunctions = function()
{
	return oFF.isNull(this.m_batchRequestManager) ? null : this.m_batchRequestManager.getBatchFunctions();
};
oFF.ConnectionContainer.prototype.getBatchRequestManager = function()
{
	return this.m_batchRequestManager;
};
oFF.ConnectionContainer.prototype.getBatchQueueSize = function()
{
	return oFF.isNull(this.m_batchRequestManager) ? 0 : this.m_batchRequestManager.getBatchFunctions().size();
};
oFF.ConnectionContainer.prototype.setBatchModeEnabled = function(syncType, enable)
{
	if (this.m_supportsBatchMode && this.m_isBatchModeEnabled !== enable)
	{
		this.m_isBatchModeEnabled = enable;
		if (enable)
		{
			var systemConnect = this.getSystemConnect();
			this.m_batchRequestManager = systemConnect.newBatchRequestManager();
		}
		else if (oFF.notNull(this.m_batchRequestManager))
		{
			this.m_batchRequestManager.executeBatch(syncType, this, this.m_batchModePath, false);
			this.m_batchRequestManager = null;
		}
	}
};
oFF.ConnectionContainer.prototype.disableBatchModeWithRsStreaming = function(syncType)
{
	if (oFF.notNull(this.m_batchRequestManager) && this.m_isBatchModeEnabled)
	{
		this.m_isBatchModeEnabled = false;
		this.m_batchRequestManager.executeBatch(syncType, this, this.m_batchModePath, this.m_supportsBatchRsStreaming);
		this.m_batchRequestManager = null;
	}
};
oFF.ConnectionContainer.prototype.supportsBatchMode = function()
{
	return this.m_supportsBatchMode;
};
oFF.ConnectionContainer.prototype.supportsWebServiceForBLOBObjects = function()
{
	return this.getWebServicePathForBLOBs() !== null;
};
oFF.ConnectionContainer.prototype.getWebServicePathForBLOBs = function()
{
	return this.m_XXLPath;
};
oFF.ConnectionContainer.prototype.setWebServicePathForBLOBs = function(path)
{
	this.m_XXLPath = oFF.XUri.createFromUrl(path);
};
oFF.ConnectionContainer.prototype.supportsBatchRsStreaming = function()
{
	return this.m_supportsBatchRsStreaming;
};
oFF.ConnectionContainer.prototype.setSupportsBatchMode = function(supportsBatchMode, supportsBatchRsStreaming, path)
{
	this.m_supportsBatchMode = supportsBatchMode;
	this.m_supportsBatchRsStreaming = supportsBatchRsStreaming;
	this.m_batchModePath = oFF.XUri.createFromUrl(path);
	if (supportsBatchMode)
	{
		var systemName = this.m_systemName;
		if (this.getConnectionPool().isBatchModeEnabled(systemName))
		{
			this.setBatchModeEnabled(oFF.SyncType.BLOCKING, true);
		}
	}
};
oFF.ConnectionContainer.prototype.getConnectionPool = function()
{
	var systemConnect = this.getSystemConnect();
	return oFF.isNull(systemConnect) ? null : systemConnect.getConnectionPoolBase();
};
oFF.ConnectionContainer.prototype.getConnectionCache = function()
{
	if (oFF.isNull(this.m_cache))
	{
		var systemConnect = this.getSystemConnect();
		if (oFF.notNull(systemConnect))
		{
			this.m_cache = systemConnect.getConnectionCache();
		}
	}
	return this.m_cache;
};
oFF.ConnectionContainer.prototype.setName = function(name)
{
	this.m_name = name;
};
oFF.ConnectionContainer.prototype.getName = function()
{
	return this.m_name;
};
oFF.ConnectionContainer.prototype.isShared = function()
{
	return !this.m_isPrivate;
};
oFF.ConnectionContainer.prototype.isPrivate = function()
{
	return this.m_isPrivate;
};
oFF.ConnectionContainer.prototype.isLogoffSent = function()
{
	return this.m_logoffSent;
};
oFF.ConnectionContainer.prototype.setLogoffSent = function(logoffSent)
{
	this.m_logoffSent = logoffSent;
};
oFF.ConnectionContainer.prototype.useSessionUrlRewrite = function()
{
	return this.m_useSessionUrlRewrite;
};
oFF.ConnectionContainer.prototype.setUseUrlSessionId = function(useUrlSessionId)
{
	this.m_useSessionUrlRewrite = useUrlSessionId;
};
oFF.ConnectionContainer.prototype.getBoeSessionToken = function()
{
	return this.getSessionContextId();
};
oFF.ConnectionContainer.prototype.setBoeSessionToken = function(boeSessionToken)
{
	this.setSessionContextId(boeSessionToken);
};
oFF.ConnectionContainer.prototype.getSapSessionContext = function()
{
	return this.getSessionContextId();
};
oFF.ConnectionContainer.prototype.setSapSessionContext = function(sessionContextId)
{
	this.setSessionContextId(sessionContextId);
};
oFF.ConnectionContainer.prototype.getSessionContextId = function()
{
	return this.m_sessionContextId;
};
oFF.ConnectionContainer.prototype.setSessionContextId = function(sessionContextId)
{
	this.m_sessionContextId = sessionContextId;
};
oFF.ConnectionContainer.prototype.getSessionUrlRewrite = function()
{
	return this.m_sessionUrlRewrite;
};
oFF.ConnectionContainer.prototype.setSessionUrlRewrite = function(sessionUrlRewrite)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(sessionUrlRewrite))
	{
		var beginIndex = oFF.XString.indexOf(sessionUrlRewrite, "(");
		var endIndex = oFF.XString.indexOf(sessionUrlRewrite, ")");
		if (beginIndex !== -1 && endIndex !== -1 && beginIndex < endIndex)
		{
			this.m_sessionUrlRewrite = oFF.XString.substring(sessionUrlRewrite, beginIndex, endIndex + 1);
			var value = oFF.XString.substring(sessionUrlRewrite, beginIndex + 1, endIndex);
			value = oFF.XString.replace(value, "-", "/");
			var byteArray = oFF.XHttpUtils.decodeBase64ToByteArray(value);
			var output = oFF.XByteArray.convertToString(byteArray);
			this.m_sessionContextId = oFF.XString.substring(output, 2, -1);
		}
	}
};
oFF.ConnectionContainer.prototype.getSysModCounter = function()
{
	return this.m_sysModCounter;
};
oFF.ConnectionContainer.prototype.getSystemConnect = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_systemConnect);
};
oFF.ConnectionContainer.prototype.isPreflightNeeded = function()
{
	var systemConnect = this.getSystemConnect();
	return oFF.notNull(systemConnect) && systemConnect.isPreflightNeeded();
};
oFF.ConnectionContainer.prototype.getPreflightUri = function()
{
	var systemConnect = this.getSystemConnect();
	return oFF.isNull(systemConnect) ? null : systemConnect.getPreflightUri();
};
oFF.ConnectionContainer.prototype.setIsPreflightNeeded = function(isPreflightNeeded)
{
	var systemConnect = this.getSystemConnect();
	if (oFF.notNull(systemConnect))
	{
		systemConnect.setIsPreflightNeeded(isPreflightNeeded);
	}
};
oFF.ConnectionContainer.prototype.getPersonalization = function()
{
	var userManager = this.getProcess().getUserManager();
	return userManager.newMergedPersonalization(this.m_systemName);
};
oFF.ConnectionContainer.prototype.getBatchModePath = function()
{
	if (this.m_supportsBatchMode)
	{
		return this.m_batchModePath.getPath();
	}
	return null;
};
oFF.ConnectionContainer.prototype.addCustomHeader = function(headerName, headerValue)
{
	this.m_customHeaders.put(headerName, headerValue);
};
oFF.ConnectionContainer.prototype.getCustomHeaders = function()
{
	return this.m_customHeaders;
};
oFF.ConnectionContainer.prototype.removeCustomHeader = function(headerName)
{
	return this.m_customHeaders.remove(headerName);
};
oFF.ConnectionContainer.prototype.getSystemName = function()
{
	return this.m_systemName;
};
oFF.ConnectionContainer.prototype.addCustomObject = function(name, customObject)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(name))
	{
		if (oFF.isNull(this.m_customObjects))
		{
			this.m_customObjects = oFF.XHashMapByString.create();
		}
		this.m_customObjects.put(name, customObject);
	}
};
oFF.ConnectionContainer.prototype.getCustomObject = function(name)
{
	return oFF.notNull(this.m_customObjects) ? this.m_customObjects.getByKey(name) : null;
};
oFF.ConnectionContainer.prototype.sendKeepAlive = function(syncType, listener, customIdentifier)
{
	var action = oFF.ServerMetadataAction.create(syncType, this, listener, customIdentifier, true);
	action.process();
	return action;
};
oFF.ConnectionContainer.prototype.getXXLPathWithSchemeHostPortPrefix = function()
{
	if (oFF.isNull(this.m_XXLPathWithSchemeHostPortPrefix))
	{
		var systemDescription = this.getSystemDescription();
		var webServicePathForBLOBs = this.getWebServicePathForBLOBs();
		var XXLPathWithSchemeHostPortPrefix = oFF.XStringBuffer.create();
		XXLPathWithSchemeHostPortPrefix.append(systemDescription.getUrlStringWithoutAuthentication());
		XXLPathWithSchemeHostPortPrefix.append(systemDescription.getPrefix()).append(webServicePathForBLOBs.toString());
		this.m_XXLPathWithSchemeHostPortPrefix = XXLPathWithSchemeHostPortPrefix.toString();
	}
	return this.m_XXLPathWithSchemeHostPortPrefix;
};
oFF.ConnectionContainer.prototype.getConnectionUid = function()
{
	return this.m_uid;
};
oFF.ConnectionContainer.prototype.hasSharedCsrfTokens = function()
{
	return this.m_sharedCsrfToken;
};
oFF.ConnectionContainer.prototype.getUserManager = function()
{
	return this.getProcess().getUserManager();
};
oFF.ConnectionContainer.prototype.getProcess = function()
{
	return this.getSession();
};
oFF.ConnectionContainer.prototype.getSessionRequestSyncAction = function()
{
	return this.m_sessionRequestSyncAction;
};
oFF.ConnectionContainer.prototype.setSessionRequestSyncAction = function(sessionRequestSyncAction)
{
	this.m_sessionRequestSyncAction = sessionRequestSyncAction;
};
oFF.ConnectionContainer.prototype.getCachingMode = function()
{
	if (oFF.isNull(this.m_cachingMode))
	{
		var cache = this.getConnectionCache();
		if (oFF.notNull(cache) && cache.isEnabled())
		{
			this.m_cachingMode = oFF.HttpCachingMode.L1_INITIAL;
		}
		else
		{
			this.m_cachingMode = oFF.HttpCachingMode.L3_LIVE_NO_CACHE;
		}
	}
	return this.m_cachingMode;
};
oFF.ConnectionContainer.prototype.setCachingMode = function(mode)
{
	this.m_cachingMode = mode;
};
oFF.ConnectionContainer.prototype.toString = function()
{
	var buffer = oFF.XStringBuffer.create();
	var systemDescription = this.getSystemDescription();
	buffer.append("#").appendInt(this.m_internalCounter).append(": ").append(oFF.isNull(systemDescription) ? null : systemDescription.toString());
	return buffer.toString();
};

oFF.KeepAliveResult = function() {};
oFF.KeepAliveResult.prototype = new oFF.MessageManager();
oFF.KeepAliveResult.prototype._ff_c = "KeepAliveResult";

oFF.KeepAliveResult.create = function(messages)
{
	var result = new oFF.KeepAliveResult();
	result.setupSessionContext(null);
	result.addAllMessages(messages);
	return result;
};

oFF.ProgramArgDef = function() {};
oFF.ProgramArgDef.prototype = new oFF.DfNameTextObject();
oFF.ProgramArgDef.prototype._ff_c = "ProgramArgDef";

oFF.ProgramArgDef.createOption = function(name, text, values, valueType, isMandatory)
{
	var newObj = new oFF.ProgramArgDef();
	newObj.setupWithNameText(name, text);
	newObj.setValues(values);
	newObj.setValueType(valueType);
	newObj.m_isParameter = false;
	newObj.m_isMandatory = isMandatory;
	return newObj;
};
oFF.ProgramArgDef.createStringParameter = function(name, text)
{
	var newObj = new oFF.ProgramArgDef();
	newObj.setupWithNameText(name, text);
	newObj.setValueType(oFF.XValueType.STRING);
	newObj.m_isParameter = true;
	return newObj;
};
oFF.ProgramArgDef.createStringArrayParameter = function(name, text)
{
	var newObj = new oFF.ProgramArgDef();
	newObj.setupWithNameText(name, text);
	newObj.setValueType(oFF.XValueType.ARRAY);
	newObj.m_isParameter = true;
	return newObj;
};
oFF.ProgramArgDef.prototype.m_isParameter = false;
oFF.ProgramArgDef.prototype.m_isMandatory = false;
oFF.ProgramArgDef.prototype.m_possibleValues = null;
oFF.ProgramArgDef.prototype.m_valueType = null;
oFF.ProgramArgDef.prototype.isParameter = function()
{
	return this.m_isParameter;
};
oFF.ProgramArgDef.prototype.getPossibleValues = function()
{
	return this.m_possibleValues;
};
oFF.ProgramArgDef.prototype.setValues = function(values)
{
	this.m_possibleValues = values;
};
oFF.ProgramArgDef.prototype.getValueType = function()
{
	return this.m_valueType;
};
oFF.ProgramArgDef.prototype.setValueType = function(valueType)
{
	this.m_valueType = valueType;
};
oFF.ProgramArgDef.prototype.isMandatory = function()
{
	return this.m_isMandatory;
};

oFF.ProgramArgs = function() {};
oFF.ProgramArgs.prototype = new oFF.XObject();
oFF.ProgramArgs.prototype._ff_c = "ProgramArgs";

oFF.ProgramArgs.createWithString = function(argString)
{
	var startDef = new oFF.ProgramArgs();
	startDef.setup();
	startDef.setArgumentString(argString);
	return startDef;
};
oFF.ProgramArgs.createWithList = function(argList)
{
	var startDef = new oFF.ProgramArgs();
	startDef.setup();
	startDef.setArgumentList(argList);
	return startDef;
};
oFF.ProgramArgs.createWithStructure = function(argStructure)
{
	var startDef = new oFF.ProgramArgs();
	startDef.setup();
	startDef.setArgumentStructure(argStructure);
	return startDef;
};
oFF.ProgramArgs.create = function()
{
	var startDef = new oFF.ProgramArgs();
	startDef.setup();
	return startDef;
};
oFF.ProgramArgs.prototype.m_argString = null;
oFF.ProgramArgs.prototype.m_argList = null;
oFF.ProgramArgs.prototype.m_argStructure = null;
oFF.ProgramArgs.prototype.m_argObjs = null;
oFF.ProgramArgs.prototype.m_isArgumentStringOrigin = false;
oFF.ProgramArgs.prototype.m_isArgumentListOrigin = false;
oFF.ProgramArgs.prototype.m_isArgumentStructureOrigin = false;
oFF.ProgramArgs.prototype.m_argDefs = null;
oFF.ProgramArgs.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_argObjs = oFF.XHashMapByString.create();
};
oFF.ProgramArgs.prototype.releaseObject = function()
{
	this.m_argDefs = null;
	this.m_argString = null;
	this.m_argList = null;
	this.m_argStructure = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.ProgramArgs.prototype.cloneExt = function(flags)
{
	var programArgs = oFF.ProgramArgs.create();
	programArgs.m_argString = this.m_argString;
	programArgs.m_argStructure = oFF.XObjectExt.cloneIfNotNull(this.m_argStructure);
	if (oFF.notNull(this.m_argList))
	{
		programArgs.m_argList = oFF.XListOfString.createFromReadOnlyList(this.m_argList);
	}
	oFF.XMapUtils.putAllObjects(this.m_argObjs, programArgs.m_argObjs);
	programArgs.m_isArgumentStringOrigin = this.m_isArgumentStringOrigin;
	programArgs.m_isArgumentListOrigin = this.m_isArgumentListOrigin;
	programArgs.m_isArgumentStructureOrigin = this.m_isArgumentStructureOrigin;
	programArgs.m_argDefs = this.m_argDefs;
	return programArgs;
};
oFF.ProgramArgs.prototype.setArgumentString = function(argString)
{
	this.m_argString = argString;
	this.m_isArgumentStringOrigin = true;
};
oFF.ProgramArgs.prototype.getArgumentString = function()
{
	return this.m_argString;
};
oFF.ProgramArgs.prototype.setArgumentList = function(argList)
{
	this.m_argList = argList;
	this.m_isArgumentListOrigin = true;
};
oFF.ProgramArgs.prototype.getArgumentList = function()
{
	if (oFF.isNull(this.m_argList) && oFF.notNull(this.m_argString))
	{
		this.m_argList = oFF.ProgramUtils.createArgValueList(this.m_argString);
	}
	if (oFF.isNull(this.m_argList))
	{
		this.m_argList = oFF.XListOfString.create();
	}
	return this.m_argList;
};
oFF.ProgramArgs.prototype.setArgumentStructure = function(argStructure)
{
	this.m_argStructure = argStructure;
	this.m_isArgumentStructureOrigin = true;
};
oFF.ProgramArgs.prototype.getArgumentStructure = function()
{
	if (oFF.isNull(this.m_argStructure) && oFF.notNull(this.m_argDefs))
	{
		var initArgumentsList = this.getArgumentList();
		if (oFF.notNull(initArgumentsList))
		{
			this.m_argStructure = oFF.ProgramUtils.createArgStructureFromList(this.m_argDefs, initArgumentsList, 0);
		}
	}
	if (oFF.isNull(this.m_argStructure))
	{
		this.m_argStructure = oFF.PrFactory.createStructure();
	}
	return this.m_argStructure;
};
oFF.ProgramArgs.prototype.setArgumentDefinitions = function(argDefs)
{
	this.m_argDefs = argDefs;
};
oFF.ProgramArgs.prototype.getArgumentDefinitions = function()
{
	return this.m_argDefs;
};
oFF.ProgramArgs.prototype.isArgumentStringOrigin = function()
{
	return this.m_isArgumentStringOrigin;
};
oFF.ProgramArgs.prototype.isArgumentListOrigin = function()
{
	return this.m_isArgumentListOrigin;
};
oFF.ProgramArgs.prototype.isArgumentStructureOrigin = function()
{
	return this.m_isArgumentStructureOrigin;
};
oFF.ProgramArgs.prototype.getBooleanByKey = function(name)
{
	return this.getBooleanByKeyExt(name, false);
};
oFF.ProgramArgs.prototype.getBooleanByKeyExt = function(name, defaultValue)
{
	var argumentStructure = this.getArgumentStructure();
	var theDefault = defaultValue;
	if (argumentStructure.containsKey(name))
	{
		theDefault = true;
	}
	var value = argumentStructure.getBooleanByKeyExt(name, theDefault);
	return value;
};
oFF.ProgramArgs.prototype.putBoolean = function(key, booleanValue)
{
	var argumentStructure = this.getArgumentStructure();
	argumentStructure.putBoolean(key, booleanValue);
};
oFF.ProgramArgs.prototype.putString = function(name, stringValue)
{
	var argumentStructure = this.getArgumentStructure();
	argumentStructure.putString(name, stringValue);
};
oFF.ProgramArgs.prototype.putStringNotNull = function(name, stringValue)
{
	var argumentStructure = this.getArgumentStructure();
	argumentStructure.putStringNotNull(name, stringValue);
};
oFF.ProgramArgs.prototype.putStringNotNullAndNotEmpty = function(name, stringValue)
{
	var argumentStructure = this.getArgumentStructure();
	argumentStructure.putStringNotNullAndNotEmpty(name, stringValue);
};
oFF.ProgramArgs.prototype.getStringByKey = function(name)
{
	return this.getStringByKeyExt(name, null);
};
oFF.ProgramArgs.prototype.getStringByKeyExt = function(name, defaultValue)
{
	var argumentStructure = this.getArgumentStructure();
	return argumentStructure.getStringByKeyExt(name, defaultValue);
};
oFF.ProgramArgs.prototype.getIntegerByKey = function(name)
{
	return this.getIntegerByKeyExt(name, 0);
};
oFF.ProgramArgs.prototype.getIntegerByKeyExt = function(name, defaultValue)
{
	var argumentStructure = this.getArgumentStructure();
	return argumentStructure.getIntegerByKeyExt(name, defaultValue);
};
oFF.ProgramArgs.prototype.putInteger = function(name, intValue)
{
	var argumentStructure = this.getArgumentStructure();
	argumentStructure.putInteger(name, intValue);
};
oFF.ProgramArgs.prototype.getLongByKey = function(name)
{
	return this.getLongByKeyExt(name, 0);
};
oFF.ProgramArgs.prototype.getLongByKeyExt = function(name, defaultValue)
{
	var argumentStructure = this.getArgumentStructure();
	return argumentStructure.getLongByKeyExt(name, defaultValue);
};
oFF.ProgramArgs.prototype.putLong = function(name, longValue)
{
	var argumentStructure = this.getArgumentStructure();
	argumentStructure.putLong(name, longValue);
};
oFF.ProgramArgs.prototype.getDoubleByKey = function(name)
{
	return this.getDoubleByKeyExt(name, 0.0);
};
oFF.ProgramArgs.prototype.getDoubleByKeyExt = function(name, defaultValue)
{
	var argumentStructure = this.getArgumentStructure();
	return argumentStructure.getDoubleByKeyExt(name, defaultValue);
};
oFF.ProgramArgs.prototype.putDouble = function(name, doubleValue)
{
	var argumentStructure = this.getArgumentStructure();
	argumentStructure.putDouble(name, doubleValue);
};
oFF.ProgramArgs.prototype.hasNullByKey = function(name)
{
	var argumentStructure = this.getArgumentStructure();
	return argumentStructure.hasNullByKey(name);
};
oFF.ProgramArgs.prototype.putNull = function(name)
{
	var argumentStructure = this.getArgumentStructure();
	argumentStructure.putNull(name);
};
oFF.ProgramArgs.prototype.getXObjectByKey = function(name)
{
	return this.getXObjectByKeyExt(name, null);
};
oFF.ProgramArgs.prototype.getXObjectByKeyExt = function(name, defaultValue)
{
	var result = defaultValue;
	if (this.m_argObjs.containsKey(name) === true)
	{
		result = this.m_argObjs.getByKey(name);
	}
	return result;
};
oFF.ProgramArgs.prototype.putXObject = function(name, objValue)
{
	this.m_argObjs.put(name, objValue);
};
oFF.ProgramArgs.prototype.convertToStructure = function()
{
	this.getArgumentStructure();
	this.m_isArgumentStringOrigin = false;
	this.m_isArgumentListOrigin = false;
	this.m_isArgumentStructureOrigin = true;
};

oFF.ProgramExitValues = function() {};
oFF.ProgramExitValues.prototype = new oFF.XObject();
oFF.ProgramExitValues.prototype._ff_c = "ProgramExitValues";

oFF.ProgramExitValues.create = function()
{
	var newObj = new oFF.ProgramExitValues();
	newObj.setup();
	return newObj;
};
oFF.ProgramExitValues.prototype.m_statusCode = 0;
oFF.ProgramExitValues.prototype.m_statusCodeDetails = null;
oFF.ProgramExitValues.prototype.m_exitObject = null;
oFF.ProgramExitValues.prototype.m_exitContent = null;
oFF.ProgramExitValues.prototype.m_properties = null;
oFF.ProgramExitValues.prototype.m_objectMap = null;
oFF.ProgramExitValues.prototype.setup = function()
{
	this.m_objectMap = oFF.XHashMapByString.create();
	this.m_properties = oFF.XProperties.create();
};
oFF.ProgramExitValues.prototype.releaseObject = function()
{
	this.m_objectMap = null;
	this.m_properties = null;
	this.m_exitObject = null;
	this.m_statusCode = 0;
};
oFF.ProgramExitValues.prototype.getStatusCode = function()
{
	return this.m_statusCode;
};
oFF.ProgramExitValues.prototype.setStatusCode = function(statusCode)
{
	this.m_statusCode = statusCode;
};
oFF.ProgramExitValues.prototype.getStatusCodeDetails = function()
{
	return this.m_statusCodeDetails;
};
oFF.ProgramExitValues.prototype.setStatusCodeDetails = function(details)
{
	this.m_statusCodeDetails = details;
};
oFF.ProgramExitValues.prototype.getExitObject = function()
{
	return this.m_exitObject;
};
oFF.ProgramExitValues.prototype.setExitObject = function(exitObject)
{
	this.m_exitObject = exitObject;
};
oFF.ProgramExitValues.prototype.getStringByKey = function(name)
{
	return this.m_properties.getStringByKey(name);
};
oFF.ProgramExitValues.prototype.getStringByKeyExt = function(name, defaultValue)
{
	return this.m_properties.getStringByKeyExt(name, defaultValue);
};
oFF.ProgramExitValues.prototype.getIntegerByKey = function(name)
{
	return this.m_properties.getIntegerByKey(name);
};
oFF.ProgramExitValues.prototype.getIntegerByKeyExt = function(name, defaultValue)
{
	return this.m_properties.getIntegerByKeyExt(name, defaultValue);
};
oFF.ProgramExitValues.prototype.getLongByKey = function(name)
{
	return this.m_properties.getLongByKey(name);
};
oFF.ProgramExitValues.prototype.getLongByKeyExt = function(name, defaultValue)
{
	return this.m_properties.getLongByKeyExt(name, defaultValue);
};
oFF.ProgramExitValues.prototype.getDoubleByKey = function(name)
{
	return this.m_properties.getDoubleByKey(name);
};
oFF.ProgramExitValues.prototype.getDoubleByKeyExt = function(name, defaultValue)
{
	return this.m_properties.getDoubleByKeyExt(name, defaultValue);
};
oFF.ProgramExitValues.prototype.getBooleanByKey = function(name)
{
	return this.m_properties.getBooleanByKey(name);
};
oFF.ProgramExitValues.prototype.getBooleanByKeyExt = function(name, defaultValue)
{
	return this.m_properties.getBooleanByKeyExt(name, defaultValue);
};
oFF.ProgramExitValues.prototype.hasNullByKey = function(name)
{
	return this.m_properties.hasNullByKey(name);
};
oFF.ProgramExitValues.prototype.putString = function(name, stringValue)
{
	this.m_properties.putString(name, stringValue);
};
oFF.ProgramExitValues.prototype.putStringNotNull = function(name, stringValue)
{
	this.m_properties.putStringNotNull(name, stringValue);
};
oFF.ProgramExitValues.prototype.putStringNotNullAndNotEmpty = function(name, stringValue)
{
	this.m_properties.putStringNotNullAndNotEmpty(name, stringValue);
};
oFF.ProgramExitValues.prototype.putInteger = function(name, intValue)
{
	this.m_properties.putInteger(name, intValue);
};
oFF.ProgramExitValues.prototype.putLong = function(name, longValue)
{
	this.m_properties.putLong(name, longValue);
};
oFF.ProgramExitValues.prototype.putDouble = function(name, doubleValue)
{
	this.m_properties.putDouble(name, doubleValue);
};
oFF.ProgramExitValues.prototype.putBoolean = function(key, booleanValue)
{
	this.m_properties.putBoolean(key, booleanValue);
};
oFF.ProgramExitValues.prototype.putNull = function(name)
{
	this.m_properties.putNull(name);
};
oFF.ProgramExitValues.prototype.getXObjectByKey = function(name)
{
	return this.m_objectMap.getByKey(name);
};
oFF.ProgramExitValues.prototype.getXObjectByKeyExt = function(name, defaultValue)
{
	var retValue = defaultValue;
	if (this.m_objectMap.containsKey(name))
	{
		retValue = this.m_objectMap.getByKey(name);
	}
	return retValue;
};
oFF.ProgramExitValues.prototype.putXObject = function(name, objValue)
{
	this.m_objectMap.put(name, objValue);
};
oFF.ProgramExitValues.prototype.getExitContent = function()
{
	return this.m_exitContent;
};
oFF.ProgramExitValues.prototype.setExitContent = function(content)
{
	this.m_exitContent = content;
};

oFF.ProgramManifest = function() {};
oFF.ProgramManifest.prototype = new oFF.AbstractResourceDef();
oFF.ProgramManifest.prototype._ff_c = "ProgramManifest";

oFF.ProgramManifest.create = function(name, factory)
{
	var newObj = new oFF.ProgramManifest();
	newObj.setupManifest(name, null, oFF.ProgramDevice.NONE, null, name, name, factory);
	return newObj;
};
oFF.ProgramManifest.createByJson = function(name, json)
{
	var newObj = new oFF.ProgramManifest();
	newObj.setupManifest(name, null, oFF.ProgramDevice.NONE, null, null, null, null);
	newObj.setJsonString(json);
	return newObj;
};
oFF.ProgramManifest.createByClazzName = function(name, clazzName, modules)
{
	var newObj = new oFF.ProgramManifest();
	newObj.setupManifest(name, clazzName, oFF.ProgramDevice.NONE, modules, name, name, null);
	return newObj;
};
oFF.ProgramManifest.createExt = function(name, clazzName, device, modules, displayName, description)
{
	var newObj = new oFF.ProgramManifest();
	newObj.setupManifest(name, clazzName, device, modules, displayName, description, null);
	return newObj;
};
oFF.ProgramManifest.prototype.m_factory = null;
oFF.ProgramManifest.prototype.m_processType = null;
oFF.ProgramManifest.prototype.m_displayName = null;
oFF.ProgramManifest.prototype.m_description = null;
oFF.ProgramManifest.prototype.m_ref = null;
oFF.ProgramManifest.prototype.m_refManifest = null;
oFF.ProgramManifest.prototype.m_author = null;
oFF.ProgramManifest.prototype.m_iconPath = null;
oFF.ProgramManifest.prototype.m_device = null;
oFF.ProgramManifest.prototype.m_subSystems = null;
oFF.ProgramManifest.prototype.m_initialContainerCssWidth = null;
oFF.ProgramManifest.prototype.m_initialContainerCssHeight = null;
oFF.ProgramManifest.prototype.m_initialContainerCssPosX = null;
oFF.ProgramManifest.prototype.m_initialContainerCssPosY = null;
oFF.ProgramManifest.prototype.m_initialTitle = null;
oFF.ProgramManifest.prototype.m_isInitiallyContainerMaximized = false;
oFF.ProgramManifest.prototype.m_isAvailableInAppStore = false;
oFF.ProgramManifest.prototype.m_isInitiallyVisibleOnLaunchpad = false;
oFF.ProgramManifest.prototype.m_category = null;
oFF.ProgramManifest.prototype.m_args = null;
oFF.ProgramManifest.prototype.m_jsonString = null;
oFF.ProgramManifest.prototype.m_isJsonParsed = false;
oFF.ProgramManifest.prototype.setupManifest = function(name, clazzName, device, modules, displayName, description, factory)
{
	this.setupResourceDef(name, clazzName, modules);
	this.m_factory = factory;
	this.m_description = description;
	this.m_device = device;
	this.m_displayName = displayName;
	this.m_subSystems = oFF.XListOfString.create();
	this.m_device = oFF.ProgramDevice.NONE;
	this.m_initialContainerCssWidth = null;
	this.m_initialContainerCssHeight = null;
	this.m_initialContainerCssPosX = null;
	this.m_initialContainerCssPosY = null;
	this.m_initialTitle = null;
	this.m_isInitiallyContainerMaximized = false;
	this.m_isInitiallyVisibleOnLaunchpad = false;
	this.m_isAvailableInAppStore = false;
	this.m_category = "Other";
	this.m_processType = oFF.ProcessType.PROGRAM;
	this.m_args = oFF.ProgramArgs.create();
};
oFF.ProgramManifest.prototype.releaseObject = function()
{
	this.m_author = null;
	this.m_description = null;
	this.m_iconPath = null;
	this.m_initialContainerCssWidth = null;
	this.m_initialContainerCssHeight = null;
	this.m_initialContainerCssPosX = null;
	this.m_initialContainerCssPosY = null;
	this.m_initialTitle = null;
	this.m_args = null;
	oFF.AbstractResourceDef.prototype.releaseObject.call( this );
};
oFF.ProgramManifest.prototype.getFactory = function()
{
	this.checkJson();
	if (oFF.isNull(this.m_factory))
	{
		if (oFF.notNull(this.m_refManifest))
		{
			this.setFactory(this.m_refManifest.getFactory());
		}
		if (oFF.isNull(this.m_factory))
		{
			var xClazzCompatibleName = this.getModuleInitClazzNameCompatible();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(xClazzCompatibleName))
			{
				var clazz = oFF.XClass.createByName(xClazzCompatibleName);
				if (oFF.notNull(clazz))
				{
					var newInstance = clazz.newInstance(this);
					this.m_factory = newInstance;
				}
				else
				{
					throw oFF.XException.createIllegalStateException(oFF.XStringUtils.concatenate2("Class cannot be resolved: ", xClazzCompatibleName));
				}
			}
		}
	}
	return this.m_factory;
};
oFF.ProgramManifest.prototype.setFactory = function(factory)
{
	this.m_factory = factory;
};
oFF.ProgramManifest.prototype.getText = function()
{
	this.checkJson();
	return this.m_description;
};
oFF.ProgramManifest.prototype.setText = function(text)
{
	this.m_description = text;
};
oFF.ProgramManifest.prototype.getProgramName = function()
{
	return this.getName();
};
oFF.ProgramManifest.prototype.getDescription = function()
{
	this.checkJson();
	return this.getText();
};
oFF.ProgramManifest.prototype.setDescription = function(description)
{
	this.setText(description);
};
oFF.ProgramManifest.prototype.getDisplayName = function()
{
	this.checkJson();
	return this.m_displayName;
};
oFF.ProgramManifest.prototype.setDisplayName = function(displayName)
{
	this.m_displayName = displayName;
};
oFF.ProgramManifest.prototype.getAuthor = function()
{
	this.checkJson();
	return this.m_author;
};
oFF.ProgramManifest.prototype.setAuthor = function(author)
{
	this.m_author = author;
};
oFF.ProgramManifest.prototype.getIconPath = function()
{
	this.checkJson();
	return this.m_iconPath;
};
oFF.ProgramManifest.prototype.setIconPath = function(iconPath)
{
	this.m_iconPath = iconPath;
};
oFF.ProgramManifest.prototype.getResolvedIconPath = function(session)
{
	var iconPath = null;
	if (oFF.notNull(session) && oFF.XStringUtils.isNotNullAndNotEmpty(this.getIconPath()))
	{
		iconPath = session.resolvePath(this.getIconPath());
	}
	return iconPath;
};
oFF.ProgramManifest.prototype.isInitiallyVisibleOnLaunchpad = function()
{
	this.checkJson();
	return this.m_isInitiallyVisibleOnLaunchpad;
};
oFF.ProgramManifest.prototype.setIsInitiallyVisibleOnLaunchpad = function(isInitiallyVisibleOnLaunchpad)
{
	this.m_isInitiallyVisibleOnLaunchpad = isInitiallyVisibleOnLaunchpad;
};
oFF.ProgramManifest.prototype.getOutputDevice = function()
{
	this.checkJson();
	return this.m_device;
};
oFF.ProgramManifest.prototype.setOutputDevice = function(device)
{
	this.m_device = device;
};
oFF.ProgramManifest.prototype.getInitialContainerCssWidth = function()
{
	this.checkJson();
	return this.m_initialContainerCssWidth;
};
oFF.ProgramManifest.prototype.setInitialContainerCssWidth = function(cssWidth)
{
	this.m_initialContainerCssWidth = cssWidth;
};
oFF.ProgramManifest.prototype.getInitialContainerCssHeight = function()
{
	this.checkJson();
	return this.m_initialContainerCssHeight;
};
oFF.ProgramManifest.prototype.setInitialContainerCssHeight = function(cssHeight)
{
	this.m_initialContainerCssHeight = cssHeight;
};
oFF.ProgramManifest.prototype.getInitialContainerCssPosX = function()
{
	this.checkJson();
	return this.m_initialContainerCssPosX;
};
oFF.ProgramManifest.prototype.setInitialContainerCssPosX = function(cssPosX)
{
	this.m_initialContainerCssPosX = cssPosX;
};
oFF.ProgramManifest.prototype.getInitialContainerCssPosY = function()
{
	this.checkJson();
	return this.m_initialContainerCssPosY;
};
oFF.ProgramManifest.prototype.setInitialContainerCssPosY = function(cssPosY)
{
	this.m_initialContainerCssPosY = cssPosY;
};
oFF.ProgramManifest.prototype.isInitiallyContainerMaximized = function()
{
	this.checkJson();
	return this.m_isInitiallyContainerMaximized;
};
oFF.ProgramManifest.prototype.setIsInitiallyContainerMaximized = function(isInitiallyContainerMaximized)
{
	this.m_isInitiallyContainerMaximized = isInitiallyContainerMaximized;
};
oFF.ProgramManifest.prototype.getArguments = function()
{
	this.checkJson();
	return this.m_args;
};
oFF.ProgramManifest.prototype.setArguments = function(args)
{
	this.m_args = args;
};
oFF.ProgramManifest.prototype.getProcessType = function()
{
	return this.m_processType;
};
oFF.ProgramManifest.prototype.setProcessType = function(type)
{
	this.m_processType = type;
};
oFF.ProgramManifest.prototype.isAvailableInAppStore = function()
{
	this.checkJson();
	return this.m_isAvailableInAppStore;
};
oFF.ProgramManifest.prototype.setIsAvailableInAppStore = function(isVisibleInAppStore)
{
	this.m_isAvailableInAppStore = isVisibleInAppStore;
};
oFF.ProgramManifest.prototype.getCategory = function()
{
	this.checkJson();
	return this.m_category;
};
oFF.ProgramManifest.prototype.setCategory = function(category)
{
	this.m_category = category;
};
oFF.ProgramManifest.prototype.getSubSystems = function()
{
	this.checkJson();
	return this.m_subSystems;
};
oFF.ProgramManifest.prototype.setSubSystems = function(subSystems)
{
	this.m_subSystems.clear();
	this.m_subSystems.addAll(subSystems);
};
oFF.ProgramManifest.prototype.getInitialTitle = function()
{
	this.checkJson();
	return this.m_initialTitle;
};
oFF.ProgramManifest.prototype.setInitialTitle = function(initialContainerTitle)
{
	this.m_initialTitle = initialContainerTitle;
};
oFF.ProgramManifest.prototype.setJsonString = function(jsonString)
{
	this.m_jsonString = jsonString;
	this.m_isJsonParsed = false;
};
oFF.ProgramManifest.prototype.getDefaultIconPath = function()
{
	var defaultIconPath = this.getIconPath();
	if (oFF.XStringUtils.isNullOrEmpty(this.m_iconPath))
	{
		if (this.getOutputDevice() === oFF.ProgramDevice.WINDOW)
		{
			defaultIconPath = "${ff_mimes}/images/programicons/defaultWindowPrg.png";
		}
		else if (this.getOutputDevice() === oFF.ProgramDevice.CONSOLE)
		{
			defaultIconPath = "${ff_mimes}/images/programicons/defaultTerminalPrg.png";
		}
	}
	return defaultIconPath;
};
oFF.ProgramManifest.prototype.checkJson = function()
{
	if (oFF.notNull(this.m_jsonString) && this.m_isJsonParsed === false)
	{
		this.m_isJsonParsed = true;
		var document = oFF.JsonParserFactory.createFromString(this.m_jsonString);
		if (oFF.notNull(document) && document.isStructure())
		{
			var jsonStructure = document.asStructure();
			var clazzName = jsonStructure.getStringByKey("Class");
			if (oFF.notNull(clazzName))
			{
				this.setClazzName(clazzName);
			}
			this.m_ref = jsonStructure.getStringByKey("Ref");
			this.deployDefaults();
			var modules = jsonStructure.getListByKey("Modules");
			if (oFF.notNull(modules))
			{
				for (var i = 0; i < modules.size(); i++)
				{
					var moduleName = modules.getStringAt(i);
					var entity = oFF.ResourceEntity.create(moduleName, moduleName, null, null, oFF.ResourceEntityType.MODULE, null, null, null);
					this.addDependency(entity);
				}
			}
			var device = jsonStructure.getStringByKey("Device");
			if (oFF.notNull(device))
			{
				var programDevice = oFF.ProgramDevice.lookup(device);
				if (oFF.notNull(programDevice))
				{
					this.setOutputDevice(programDevice);
				}
			}
			var type = jsonStructure.getStringByKey("Type");
			if (oFF.notNull(type))
			{
				var processType = oFF.ProcessType.lookup(type);
				if (oFF.notNull(processType))
				{
					this.setProcessType(processType);
				}
			}
			var displayName = jsonStructure.getStringByKeyExt("DisplayName", this.getDisplayName());
			displayName = oFF.XStringUtils.isNullOrEmpty(displayName) ? this.getProgramName() : displayName;
			this.setDisplayName(displayName);
			var author = jsonStructure.getStringByKeyExt("Author", this.getAuthor());
			this.setAuthor(author);
			var description = jsonStructure.getStringByKeyExt("Description", this.getDescription());
			this.setDescription(description);
			var iconPath = jsonStructure.getStringByKeyExt("IconPath", this.getDefaultIconPath());
			this.setIconPath(iconPath);
			var category = jsonStructure.getStringByKeyExt("Category", this.getCategory());
			this.setCategory(category);
			var isAvailablenAppStore = jsonStructure.getBooleanByKeyExt("AppStore", this.isAvailableInAppStore());
			this.setIsAvailableInAppStore(isAvailablenAppStore);
			var isInitiallyVisibleOnLaunchpad = jsonStructure.getBooleanByKeyExt("InitiallyOnLaunchpad", this.isInitiallyVisibleOnLaunchpad());
			this.setIsInitiallyVisibleOnLaunchpad(isInitiallyVisibleOnLaunchpad);
			var initialTitle = jsonStructure.getStringByKeyExt("InitialTitle", this.getInitialTitle());
			initialTitle = oFF.XStringUtils.isNullOrEmpty(initialTitle) ? displayName : initialTitle;
			this.setInitialTitle(initialTitle);
			var initialContainerFrame = jsonStructure.getStructureByKey("InitialContainerFrame");
			if (oFF.notNull(initialContainerFrame))
			{
				var winX = initialContainerFrame.getStringByKey("X");
				var winY = initialContainerFrame.getStringByKey("Y");
				var winWidth = initialContainerFrame.getStringByKey("Width");
				var winHeight = initialContainerFrame.getStringByKey("Height");
				this.setInitialContainerCssPosX(winX);
				this.setInitialContainerCssPosY(winY);
				this.setInitialContainerCssWidth(winWidth);
				this.setInitialContainerCssHeight(winHeight);
				var isMaximized = initialContainerFrame.getBooleanByKeyExt("Maximized", this.isInitiallyContainerMaximized());
				this.setIsInitiallyContainerMaximized(isMaximized);
			}
			var args = jsonStructure.getStringByKey("Args");
			if (oFF.XStringUtils.isNotNullAndNotEmpty(args))
			{
				var argsObj = oFF.ProgramArgs.createWithString(args);
				this.setArguments(argsObj);
			}
			var subSystems = jsonStructure.getListByKey("SubSystems");
			if (oFF.notNull(subSystems))
			{
				for (var k = 0; k < subSystems.size(); k++)
				{
					var subSysName = subSystems.getStringAt(k);
					this.m_subSystems.add(subSysName);
				}
			}
		}
	}
	oFF.AbstractResourceDef.prototype.checkJson.call( this );
};
oFF.ProgramManifest.prototype.deployDefaults = function()
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_ref))
	{
		this.m_refManifest = oFF.ProgramRegistration.getProgramManifest(this.m_ref);
		if (oFF.notNull(this.m_refManifest))
		{
			if (oFF.XStringUtils.isNullOrEmpty(this.getModuleInitClazzOrigin()))
			{
				this.setClazzName(this.m_refManifest.getModuleInitClazzOrigin());
			}
			this.addAllDependencies(this.m_refManifest.getAllDependencies());
			this.setOutputDevice(this.m_refManifest.getOutputDevice());
			this.setProcessType(this.m_refManifest.getProcessType());
			this.setDisplayName(this.m_refManifest.getDisplayName());
			this.setDescription(this.m_refManifest.getDescription());
			this.setAuthor(this.m_refManifest.getAuthor());
			this.setIconPath(this.m_refManifest.getIconPath());
			this.setInitialTitle(this.m_refManifest.getInitialTitle());
			this.setInitialContainerCssWidth(this.m_refManifest.getInitialContainerCssWidth());
			this.setInitialContainerCssHeight(this.m_refManifest.getInitialContainerCssHeight());
			this.setInitialContainerCssPosX(this.m_refManifest.getInitialContainerCssPosX());
			this.setInitialContainerCssPosY(this.m_refManifest.getInitialContainerCssPosY());
			this.setIsInitiallyContainerMaximized(this.m_refManifest.isInitiallyContainerMaximized());
			this.setArguments(this.m_refManifest.getArguments());
			this.setSubSystems(this.m_refManifest.getSubSystems());
		}
	}
};

oFF.Process = function() {};
oFF.Process.prototype = new oFF.IoSession();
oFF.Process.prototype._ff_c = "Process";

oFF.Process.createExt = function(kernel, parent, type, environmentConfig)
{
	var session = new oFF.Process();
	session.setupExt(kernel, parent, type, environmentConfig);
	return session;
};
oFF.Process.prototype.m_kernel = null;
oFF.Process.prototype.m_type = null;
oFF.Process.prototype.m_selector = null;
oFF.Process.prototype.m_startConfiguration = null;
oFF.Process.prototype.m_processId = null;
oFF.Process.prototype.m_isSapStatisticsEnabled = false;
oFF.Process.prototype.m_nativeAnchorId = null;
oFF.Process.prototype.m_nativeAnchorObject = null;
oFF.Process.prototype.m_entities = null;
oFF.Process.prototype.m_applicationName = null;
oFF.Process.prototype.m_childProcesses = null;
oFF.Process.prototype.m_processEventListeners = null;
oFF.Process.prototype.setupExt = function(kernel, parent, type, environmentConfig)
{
	this.setupIoSession(parent, environmentConfig);
	this.m_entities = oFF.XHashMapByString.create();
	this.m_childProcesses = oFF.XList.create();
	this.m_processEventListeners = oFF.XList.create();
	this.m_kernel = kernel;
	this.m_processId = kernel.newProcessId();
	this.m_type = type;
};
oFF.Process.prototype.releaseObject = function()
{
	this.m_kernel = null;
	this.m_selector = null;
	oFF.IoSession.prototype.releaseObject.call( this );
};
oFF.Process.prototype.getProcessType = function()
{
	return this.m_type;
};
oFF.Process.prototype.getKernel = function()
{
	return this.m_kernel;
};
oFF.Process.prototype.getSelector = function()
{
	return this.getSelectorBase();
};
oFF.Process.prototype.getSelectorBase = function()
{
	if (oFF.isNull(this.m_selector))
	{
		this.m_selector = oFF.SigSelManager.create(this);
		this.m_selector.registerSelector(oFF.SigSelDomain.SUBSYSTEM, this);
		this.m_selector.registerSelector(oFF.SigSelDomain.ENVVARS, this);
		var uiManager = this.getUiManager();
		if (oFF.notNull(uiManager) && uiManager.getSigSelProviderSelector() !== null)
		{
			this.m_selector.registerSelector(oFF.SigSelDomain.UI, uiManager.getSigSelProviderSelector());
			this.m_selector.registerSelector(oFF.SigSelDomain.DIALOG, uiManager.getSigSelProviderSelector());
		}
		var parent = this.getParentProcess();
		if (oFF.notNull(parent))
		{
			var parentSelector = parent.getSelector();
			var allDomains = parentSelector.getRegisteredDomain();
			for (var k = 0; k < allDomains.size(); k++)
			{
				var currentDomain = allDomains.get(k);
				var currentSelector = parentSelector.getSelector(currentDomain);
				this.m_selector.registerSelector(currentDomain, currentSelector);
			}
		}
	}
	return this.m_selector;
};
oFF.Process.prototype.getProcessId = function()
{
	return this.m_processId;
};
oFF.Process.prototype.selectProviderComponents = function(operation, defaultDomain, contextObject, maximumCount)
{
	var list = oFF.XList.create();
	var domain = operation.getDomain();
	var name = operation.getName();
	if (domain === oFF.SigSelDomain.SUBSYSTEM)
	{
		var subSystemType = oFF.SubSystemType.lookup(name);
		var subSystem = this.getSubSystem(subSystemType);
		if (oFF.notNull(subSystem))
		{
			list.add(subSystem);
		}
	}
	else if (domain === oFF.SigSelDomain.ENVVARS)
	{
		var variable = this.getEnvironment().getStringByKey(name);
		if (oFF.notNull(variable))
		{
			var variableObj = oFF.XStringValue.create(variable);
			list.add(variableObj);
		}
	}
	return list;
};
oFF.Process.prototype.setSapStatisticsEnabled = function(enabled)
{
	this.m_isSapStatisticsEnabled = enabled;
};
oFF.Process.prototype.isSapStatisticsEnabled = function()
{
	return this.m_isSapStatisticsEnabled;
};
oFF.Process.prototype.getNativeAnchorId = function()
{
	return this.m_nativeAnchorId;
};
oFF.Process.prototype.getNativeAnchorObject = function()
{
	return this.m_nativeAnchorObject;
};
oFF.Process.prototype.setNativeAnchorId = function(nativeAnchorId)
{
	this.m_nativeAnchorId = nativeAnchorId;
};
oFF.Process.prototype.setNativeAnchorObject = function(nativeAnchorObject)
{
	this.m_nativeAnchorObject = nativeAnchorObject;
};
oFF.Process.prototype.getUiManager = function()
{
	var uiManager = this.getEntity(oFF.ProcessEntity.GUI);
	if (oFF.isNull(uiManager))
	{
		uiManager = this.getSubSystem(oFF.SubSystemType.GUI);
	}
	return uiManager;
};
oFF.Process.prototype.getApplication = function()
{
	return this.getEntity(oFF.ProcessEntity.APPLICATION);
};
oFF.Process.prototype.getUserManager = function()
{
	var userMgr = this.getEntity(oFF.ProcessEntity.USER_MANAGER);
	return userMgr;
};
oFF.Process.prototype.getUserProfile = function()
{
	var userProfile = this.getSubSystem(oFF.SubSystemType.USER_PROFILE);
	return userProfile;
};
oFF.Process.prototype.getSystemCache = function(systemName)
{
	var systemCache = null;
	var cacheManager = this.getSubSystem(oFF.SubSystemType.CACHE);
	if (oFF.notNull(cacheManager))
	{
		systemCache = cacheManager.getSystemCache(systemName);
	}
	return systemCache;
};
oFF.Process.prototype.getCacheProvider = function()
{
	var cacheProvider = null;
	var cacheManager = this.getCacheManager();
	if (oFF.notNull(cacheManager))
	{
		cacheProvider = cacheManager.getCacheProvider();
	}
	return cacheProvider;
};
oFF.Process.prototype.getCacheManager = function()
{
	var cacheManager = this.getSubSystem(oFF.SubSystemType.CACHE);
	return cacheManager;
};
oFF.Process.prototype.getConnectionPool = function()
{
	return this.getEntity(oFF.ProcessEntity.CONNECTION_POOL);
};
oFF.Process.prototype.getSystemLandscape = function()
{
	var systemLandscape = this.getEntity(oFF.ProcessEntity.SYSTEM_LANDSCAPE);
	if (oFF.isNull(systemLandscape))
	{
		systemLandscape = this.getSubSystem(oFF.SubSystemType.SYSTEM_LANDSCAPE);
	}
	return systemLandscape;
};
oFF.Process.prototype.openSubSystem = function(type)
{
	var subSystem;
	var kernel = this.getKernel();
	subSystem = kernel.getSubSystemContainer(type).open();
	return subSystem;
};
oFF.Process.prototype.getSubSystem = function(type)
{
	var subSystemContainer = this.m_kernel.getSubSystemContainer(type);
	var mainApi = subSystemContainer.getMainApi();
	return mainApi;
};
oFF.Process.prototype.getApplicationName = function()
{
	return this.m_applicationName;
};
oFF.Process.prototype.setApplicationName = function(name)
{
	this.m_applicationName = name;
};
oFF.Process.prototype.newSubSession = function()
{
	return this.newChildProcess(this.m_type);
};
oFF.Process.prototype.newChildProcess = function(type)
{
	var process = oFF.Process.createExt(this.m_kernel, this, type, null);
	this.m_childProcesses.add(process);
	return process;
};
oFF.Process.prototype.getChildProcesses = function()
{
	for (var i = 0; i < this.m_childProcesses.size(); )
	{
		var process = this.m_childProcesses.get(i);
		if (process.isReleased())
		{
			this.m_childProcesses.removeAt(i);
		}
		else
		{
			i++;
		}
	}
	return this.m_childProcesses;
};
oFF.Process.prototype.attachExistingChildProcess = function(child)
{
	this.m_childProcesses.add(child);
	child.setParentSession(this);
};
oFF.Process.prototype.removeChild = function(child)
{
	this.m_childProcesses.removeElement(child);
};
oFF.Process.prototype.getParentProcess = function()
{
	return this.getParentSession();
};
oFF.Process.prototype.getProgramCfg = function()
{
	return this.m_startConfiguration;
};
oFF.Process.prototype.setStartConfiguration = function(startCfg)
{
	this.m_startConfiguration = startCfg;
};
oFF.Process.prototype.getChildProcessById = function(processId)
{
	return null;
};
oFF.Process.prototype.getEntity = function(name)
{
	return this.m_entities.getByKey(name);
};
oFF.Process.prototype.setEntity = function(name, entity)
{
	this.m_entities.put(name, entity);
};
oFF.Process.prototype.registerOnEvent = function(listener)
{
	this.unregisterOnEvent(listener);
	this.m_processEventListeners.add(listener);
};
oFF.Process.prototype.unregisterOnEvent = function(listener)
{
	for (var i = 0; i < this.m_processEventListeners.size(); )
	{
		var currentListener = this.m_processEventListeners.get(i);
		if (currentListener === listener)
		{
			this.m_processEventListeners.removeAt(i);
		}
		else
		{
			i++;
		}
	}
};
oFF.Process.prototype.getAllProcessEventListeners = function()
{
	return this.m_processEventListeners;
};
oFF.Process.prototype.notifyProcessEvent = function(type)
{
	var event = oFF.ProcessEvent.create(this, this.m_processId, type, null);
	this.notifyProcessEventExt(event);
};
oFF.Process.prototype.notifyProcessEventExt = function(event)
{
	for (var i = 0; i < this.m_processEventListeners.size(); i++)
	{
		var listener = this.m_processEventListeners.get(i);
		listener.onProcessEvent(event, this, event.getEventType());
	}
};
oFF.Process.prototype.addToListenerQueue = function(syncAction)
{
	var kernel = this.getKernel();
	return kernel.addToListenerQueue(syncAction);
};
oFF.Process.prototype.isWindowBasedUiProgram = function()
{
	var isWindowBased = false;
	var processType = this.getProcessType();
	if (processType === oFF.ProcessType.PROGRAM)
	{
		var startCfg = this.getProgramCfg();
		if (oFF.notNull(startCfg))
		{
			var programContainer = startCfg.getProgramContainer();
			isWindowBased = programContainer.isUiContainer() && programContainer.isModalContainer() === false;
		}
	}
	return isWindowBased;
};
oFF.Process.prototype.getProgramContainer = function()
{
	var tmpCfg = this.getProgramCfg();
	if (oFF.notNull(tmpCfg))
	{
		return tmpCfg.getProgramContainer();
	}
	return null;
};
oFF.Process.prototype.getArguments = function()
{
	var tmpCfg = this.getProgramCfg();
	if (oFF.notNull(tmpCfg))
	{
		return tmpCfg.getArguments();
	}
	return null;
};

oFF.ProcessEvent = function() {};
oFF.ProcessEvent.prototype = new oFF.MessageManager();
oFF.ProcessEvent.prototype._ff_c = "ProcessEvent";

oFF.ProcessEvent.create = function(process, processId, type, contextObject)
{
	var newObj = new oFF.ProcessEvent();
	newObj.setupSessionContext(process);
	newObj.m_type = type;
	if (oFF.notNull(processId))
	{
		newObj.m_id = processId;
	}
	else if (oFF.notNull(process))
	{
		newObj.m_id = process.getProcessId();
	}
	newObj.m_context = contextObject;
	return newObj;
};
oFF.ProcessEvent.prototype.m_type = null;
oFF.ProcessEvent.prototype.m_id = null;
oFF.ProcessEvent.prototype.m_context = null;
oFF.ProcessEvent.prototype.getEventType = function()
{
	return this.m_type;
};
oFF.ProcessEvent.prototype.getEventObject = function()
{
	return this.m_context;
};
oFF.ProcessEvent.prototype.getProcessId = function()
{
	return this.m_id;
};
oFF.ProcessEvent.prototype.getProcess = function()
{
	return this.getSession();
};

oFF.DfProgramSubSys = function() {};
oFF.DfProgramSubSys.prototype = new oFF.DfProgram();
oFF.DfProgramSubSys.prototype._ff_c = "DfProgramSubSys";

oFF.DfProgramSubSys.prototype.setup = function()
{
	oFF.DfProgram.prototype.setup.call( this );
};
oFF.DfProgramSubSys.prototype.getLogLayer = function()
{
	return oFF.OriginLayer.SUBSYSTEM;
};
oFF.DfProgramSubSys.prototype.activateSubSystem = function(messages, status)
{
	var process = this.getProcess();
	process.setEntity(oFF.ProcessEntity.SUB_SYSTEM, this);
	var subSystemContainer = this.getSubSystemContainer();
	subSystemContainer.setSubSystem(this);
	var theEvent = oFF.ProcessEvent.create(process, null, oFF.ProcessEventType.ACTIVE, this);
	if (oFF.notNull(messages))
	{
		theEvent.addAllMessages(messages);
	}
	process.notifyProcessEventExt(theEvent);
	this.log3("Activating of subsystem [", this.getSubSystemType().getName(), "] done ");
};
oFF.DfProgramSubSys.prototype.getAdminApi = function()
{
	return this.getMainApi();
};
oFF.DfProgramSubSys.prototype.getSubSystemContainer = function()
{
	var process = this.getProcess();
	var kernel = process.getKernel();
	var subSystemContainer = kernel.getSubSystemContainer(this.getSubSystemType());
	return subSystemContainer;
};

oFF.SubSystemContainer = function() {};
oFF.SubSystemContainer.prototype = new oFF.MessageManager();
oFF.SubSystemContainer.prototype._ff_c = "SubSystemContainer";

oFF.SubSystemContainer.create = function(kernel, type)
{
	var newObj = new oFF.SubSystemContainer();
	newObj.setupExt(kernel, type);
	return newObj;
};
oFF.SubSystemContainer.prototype.m_kernel = null;
oFF.SubSystemContainer.prototype.m_type = null;
oFF.SubSystemContainer.prototype.m_status = null;
oFF.SubSystemContainer.prototype.m_bootstrapSubSystem = null;
oFF.SubSystemContainer.prototype.m_subSystem = null;
oFF.SubSystemContainer.prototype.m_loadAction = null;
oFF.SubSystemContainer.prototype.setupExt = function(kernel, type)
{
	this.setupSessionContext(kernel.getKernelProcess());
	this.m_status = oFF.SubSystemStatus.INITIAL;
	this.m_kernel = kernel;
	this.m_type = type;
	this.initBootstrap();
};
oFF.SubSystemContainer.prototype.getType = function()
{
	return this.m_type;
};
oFF.SubSystemContainer.prototype.getStatus = function()
{
	return this.m_status;
};
oFF.SubSystemContainer.prototype.getSubSystem = function()
{
	return this.m_subSystem;
};
oFF.SubSystemContainer.prototype.getMainApi = function()
{
	var retObj = oFF.notNull(this.m_subSystem) ? this.m_subSystem.getMainApi() : null;
	return retObj;
};
oFF.SubSystemContainer.prototype.getAdminApi = function()
{
	var retObj = oFF.notNull(this.m_subSystem) ? this.m_subSystem.getAdminApi() : null;
	return retObj;
};
oFF.SubSystemContainer.prototype.setSubSystem = function(subSystem)
{
	this.m_subSystem = subSystem;
	this.m_status = oFF.SubSystemStatus.ACTIVE;
};
oFF.SubSystemContainer.prototype.processSubSystemLoad = function(syncType, listener, customIdentifier)
{
	if (oFF.isNull(this.m_loadAction))
	{
		this.m_loadAction = oFF.SubSystemLoadAction.createAndRun(syncType, listener, customIdentifier, this, this.m_type);
	}
	else
	{
		this.m_loadAction.attachListener(listener, oFF.ListenerType.SPECIFIC, customIdentifier);
	}
	return this.m_loadAction;
};
oFF.SubSystemContainer.prototype.open = function()
{
	if (oFF.isNull(this.m_subSystem))
	{
		this.m_subSystem = oFF.SubSystemFactory.create(this.m_type, this.m_kernel.getKernelProcess());
	}
	return this.m_subSystem;
};
oFF.SubSystemContainer.prototype.initBootstrap = function()
{
	if (oFF.isNull(this.m_bootstrapSubSystem) && this.m_type === oFF.SubSystemType.USER_PROFILE)
	{
		this.m_bootstrapSubSystem = oFF.SubSystemFactory.create(this.m_type, this.m_kernel.getKernelProcess());
		if (oFF.notNull(this.m_bootstrapSubSystem))
		{
			this.m_status = oFF.SubSystemStatus.BOOTSTRAP;
			this.m_subSystem = this.m_bootstrapSubSystem;
		}
	}
};
oFF.SubSystemContainer.prototype.getMessageCollection = function()
{
	return this;
};
oFF.SubSystemContainer.prototype.getBootstrapSubSystem = function()
{
	return this.m_bootstrapSubSystem;
};
oFF.SubSystemContainer.prototype.getKernel = function()
{
	return this.m_kernel;
};

oFF.SubSysUserProfileBootstrap = function() {};
oFF.SubSysUserProfileBootstrap.prototype = new oFF.DfSubSystem();
oFF.SubSysUserProfileBootstrap.prototype._ff_c = "SubSysUserProfileBootstrap";

oFF.SubSysUserProfileBootstrap.create = function(process)
{
	var newObj = new oFF.SubSysUserProfileBootstrap();
	newObj.setupProcessContext(process);
	return newObj;
};
oFF.SubSysUserProfileBootstrap.prototype.m_userProfile = null;
oFF.SubSysUserProfileBootstrap.prototype.setupProcessContext = function(process)
{
	oFF.DfSubSystem.prototype.setupProcessContext.call( this , process);
	this.m_userProfile = oFF.UserProfile.create();
	this.m_userProfile.setServiceApiLevel(oFF.ServiceApiLevel.BOOTSTRAP);
	this.m_userProfile.setSAPName("anonymous");
	this.m_userProfile.setFirstName("Unknown");
	this.m_userProfile.setLastName("Anonymous");
	this.m_userProfile.setLanguage("en");
	var environment = process.getEnvironment();
	var cacheSchema = environment.getStringByKey(oFF.XEnvironmentConstants.FIREFLY_CACHE_SCHEMA);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(cacheSchema))
	{
		this.m_userProfile.setCacheSchema(cacheSchema);
	}
	this.m_userProfile.setUnixHomeDirectory("vfs:///");
};
oFF.SubSysUserProfileBootstrap.prototype.getSubSystemType = function()
{
	return oFF.SubSystemType.USER_PROFILE;
};
oFF.SubSysUserProfileBootstrap.prototype.getMainApi = function()
{
	return this.m_userProfile;
};
oFF.SubSysUserProfileBootstrap.prototype.getUserProfile = function()
{
	return this.m_userProfile;
};
oFF.SubSysUserProfileBootstrap.prototype.getBootstrapUserProfile = function()
{
	return this.m_userProfile;
};
oFF.SubSysUserProfileBootstrap.prototype.getReadOnlyUserProfile = function()
{
	return null;
};
oFF.SubSysUserProfileBootstrap.prototype.getPersonalizationUserProfile = function()
{
	return null;
};
oFF.SubSysUserProfileBootstrap.prototype.getServiceApiLevel = function()
{
	return oFF.ServiceApiLevel.BOOTSTRAP;
};
oFF.SubSysUserProfileBootstrap.prototype.canUserProfileSaved = function()
{
	return false;
};
oFF.SubSysUserProfileBootstrap.prototype.processUserProfileSave = oFF.noSupport;

oFF.UserProfile = function() {};
oFF.UserProfile.prototype = new oFF.XObjectExt();
oFF.UserProfile.prototype._ff_c = "UserProfile";

oFF.UserProfile.create = function()
{
	var newObj = new oFF.UserProfile();
	newObj.setup();
	return newObj;
};
oFF.UserProfile.prototype.m_properties = null;
oFF.UserProfile.prototype.m_parent = null;
oFF.UserProfile.prototype.m_serviceApiLevel = null;
oFF.UserProfile.prototype.m_uri = null;
oFF.UserProfile.prototype.m_document = null;
oFF.UserProfile.prototype.m_documentFormat = null;
oFF.UserProfile.prototype.setup = function()
{
	this.m_properties = oFF.XProperties.create();
};
oFF.UserProfile.prototype.getProperies = function()
{
	return this.m_properties;
};
oFF.UserProfile.prototype.setParent = function(parent)
{
	this.m_parent = parent;
	if (oFF.notNull(this.m_parent))
	{
		this.m_properties.setParent(this.m_parent.getProperies());
	}
	else
	{
		this.m_properties.setParent(null);
	}
};
oFF.UserProfile.prototype.getParent = function()
{
	return this.m_parent;
};
oFF.UserProfile.prototype.getServiceApiLevel = function()
{
	return this.m_serviceApiLevel;
};
oFF.UserProfile.prototype.setServiceApiLevel = function(level)
{
	this.m_serviceApiLevel = level;
};
oFF.UserProfile.prototype.getDocumentUri = function()
{
	return this.m_uri;
};
oFF.UserProfile.prototype.setDocumentUri = function(uri)
{
	this.m_uri = uri;
};
oFF.UserProfile.prototype.getDocumentFormat = function()
{
	return this.m_documentFormat;
};
oFF.UserProfile.prototype.setDocumentFormat = function(format)
{
	this.m_documentFormat = format;
};
oFF.UserProfile.prototype.getDocument = function()
{
	return this.m_document;
};
oFF.UserProfile.prototype.setDocument = function(document)
{
	this.m_document = oFF.PrFactory.createStructureDeepCopy(document);
};
oFF.UserProfile.prototype.setValue = function(key, value)
{
	if (oFF.notNull(value))
	{
		this.m_properties.put(key, value);
	}
	else
	{
		this.m_properties.remove(key);
	}
};
oFF.UserProfile.prototype.getKeysWithPrefix = function(prefix)
{
	var featureToggles = oFF.XListOfString.create();
	var keys = this.m_properties.getKeysAsReadOnlyListOfString();
	var size = oFF.XString.size(prefix);
	for (var i = 0; i < keys.size(); i++)
	{
		var currentKey = keys.get(i);
		if (oFF.XString.startsWith(currentKey, prefix))
		{
			currentKey = oFF.XString.substring(currentKey, size, -1);
			featureToggles.add(currentKey);
		}
	}
	featureToggles.sortByDirection(oFF.XSortDirection.ASCENDING);
	return featureToggles;
};
oFF.UserProfile.prototype.getInternalPropertyNames = function()
{
	var internalPropertyKeys = this.getKeysWithPrefix(oFF.UserProfileConstants.PREFIX_INTERNAL);
	return internalPropertyKeys;
};
oFF.UserProfile.prototype.getInternalPropertyValue = function(name)
{
	var key = oFF.XStringUtils.concatenate2(oFF.UserProfileConstants.PREFIX_INTERNAL, name);
	var value = this.m_properties.getByKey(key);
	return value;
};
oFF.UserProfile.prototype.setInternalProperty = function(name, value)
{
	var key = oFF.XStringUtils.concatenate2(oFF.UserProfileConstants.PREFIX_INTERNAL, name);
	this.setValue(key, value);
};
oFF.UserProfile.prototype.getFeatureToggles = function()
{
	var featureToggles = this.getKeysWithPrefix(oFF.UserProfileConstants.PREFIX_FEATURE_TOGGLE);
	return featureToggles;
};
oFF.UserProfile.prototype.setFeatureToggle = function(name, enable)
{
	var key = oFF.XStringUtils.concatenate2(oFF.UserProfileConstants.PREFIX_INTERNAL, name);
	if (enable === true)
	{
		this.setValue(key, "active");
	}
	else
	{
		this.setValue(key, null);
	}
};
oFF.UserProfile.prototype.getUserEnabled = function()
{
	return this.m_properties.getBooleanByKeyExt(oFF.UserProfileConstants.USER_ENABLED, true);
};
oFF.UserProfile.prototype.isUserEnabledDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.USER_ENABLED);
};
oFF.UserProfile.prototype.setUserEnabled = function(userEnabled)
{
	this.m_properties.putBoolean(oFF.UserProfileConstants.USER_ENABLED, userEnabled);
};
oFF.UserProfile.prototype.resetUserEnabled = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.USER_ENABLED);
};
oFF.UserProfile.prototype.getName = function()
{
	return this.getSAPName();
};
oFF.UserProfile.prototype.getSAPName = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.SAP_NAME);
};
oFF.UserProfile.prototype.isSAPNameDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.SAP_NAME);
};
oFF.UserProfile.prototype.setSAPName = function(sapName)
{
	this.setValue(oFF.UserProfileConstants.SAP_NAME, sapName);
};
oFF.UserProfile.prototype.resetSAPName = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.SAP_NAME);
};
oFF.UserProfile.prototype.getPersonNumber = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.USER_ID);
};
oFF.UserProfile.prototype.isPersonNumberDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.USER_ID);
};
oFF.UserProfile.prototype.setPersonNumber = function(personNumber)
{
	this.setValue(oFF.UserProfileConstants.USER_ID, personNumber);
};
oFF.UserProfile.prototype.resetPersonNumber = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.USER_ID);
};
oFF.UserProfile.prototype.getDisplayName = function()
{
	var displayName = this.m_properties.getByKey(oFF.UserProfileConstants.DISPLAY_NAME);
	if (oFF.XStringUtils.isNullOrEmpty(displayName))
	{
		displayName = this.getFirstName();
		if (oFF.XStringUtils.isNullOrEmpty(displayName))
		{
			displayName = this.getLastName();
		}
	}
	return displayName;
};
oFF.UserProfile.prototype.isDisplayNameDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.DISPLAY_NAME);
};
oFF.UserProfile.prototype.setDisplayName = function(displayName)
{
	this.setValue(oFF.UserProfileConstants.DISPLAY_NAME, displayName);
};
oFF.UserProfile.prototype.resetDisplayName = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.DISPLAY_NAME);
};
oFF.UserProfile.prototype.getFullName = function()
{
	var fullName = this.m_properties.getByKey(oFF.UserProfileConstants.FULL_NAME);
	if (oFF.XStringUtils.isNullOrEmpty(fullName))
	{
		var firstName = this.getFirstName();
		var lastName = this.getLastName();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(firstName))
		{
			if (oFF.XStringUtils.isNotNullAndNotEmpty(lastName))
			{
				fullName = oFF.XStringUtils.concatenate3(firstName, " ", lastName);
			}
			else
			{
				fullName = firstName;
			}
		}
		else
		{
			fullName = lastName;
		}
	}
	return fullName;
};
oFF.UserProfile.prototype.isFullNameDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.FULL_NAME);
};
oFF.UserProfile.prototype.setFullName = function(fullUserName)
{
	this.setValue(oFF.UserProfileConstants.FULL_NAME, fullUserName);
};
oFF.UserProfile.prototype.resetFullName = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.FULL_NAME);
};
oFF.UserProfile.prototype.getTitle = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.TITLE);
};
oFF.UserProfile.prototype.isTitleDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.TITLE);
};
oFF.UserProfile.prototype.setTitle = function(title)
{
	this.setValue(oFF.UserProfileConstants.TITLE, title);
};
oFF.UserProfile.prototype.resetTitle = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.TITLE);
};
oFF.UserProfile.prototype.getFirstName = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.FIRST_NAME);
};
oFF.UserProfile.prototype.isFirstNameDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.FIRST_NAME);
};
oFF.UserProfile.prototype.setFirstName = function(firstName)
{
	this.setValue(oFF.UserProfileConstants.FIRST_NAME, firstName);
};
oFF.UserProfile.prototype.resetFirstName = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.FIRST_NAME);
};
oFF.UserProfile.prototype.getLastName = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.LAST_NAME);
};
oFF.UserProfile.prototype.isLastNameDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.LAST_NAME);
};
oFF.UserProfile.prototype.setLastName = function(lastName)
{
	this.setValue(oFF.UserProfileConstants.LAST_NAME, lastName);
};
oFF.UserProfile.prototype.resetLastName = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.LAST_NAME);
};
oFF.UserProfile.prototype.getStreetName = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.STREET_NAME);
};
oFF.UserProfile.prototype.isStreetNameDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.STREET_NAME);
};
oFF.UserProfile.prototype.setStreetName = function(streetName)
{
	this.setValue(oFF.UserProfileConstants.STREET_NAME, streetName);
};
oFF.UserProfile.prototype.resetStreetName = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.STREET_NAME);
};
oFF.UserProfile.prototype.getCountry = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.COUNTRY);
};
oFF.UserProfile.prototype.isCountryDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.COUNTRY);
};
oFF.UserProfile.prototype.setCountry = function(country)
{
	this.setValue(oFF.UserProfileConstants.COUNTRY, country);
};
oFF.UserProfile.prototype.resetCountry = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.COUNTRY);
};
oFF.UserProfile.prototype.getCityName = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.CITY);
};
oFF.UserProfile.prototype.isCityNameDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.CITY);
};
oFF.UserProfile.prototype.setCityName = function(cityName)
{
	this.setValue(oFF.UserProfileConstants.CITY, cityName);
};
oFF.UserProfile.prototype.resetCityName = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.CITY);
};
oFF.UserProfile.prototype.getCityCode = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.ZIP_CODE);
};
oFF.UserProfile.prototype.isCityCodeDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.ZIP_CODE);
};
oFF.UserProfile.prototype.setCityCode = function(postalCode)
{
	this.setValue(oFF.UserProfileConstants.ZIP_CODE, postalCode);
};
oFF.UserProfile.prototype.resetCityCode = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.ZIP_CODE);
};
oFF.UserProfile.prototype.getEmailAddress = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.EMAIL);
};
oFF.UserProfile.prototype.isEmailAddressDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.EMAIL);
};
oFF.UserProfile.prototype.setEmailAddress = function(emailAddress)
{
	this.setValue(oFF.UserProfileConstants.EMAIL, emailAddress);
};
oFF.UserProfile.prototype.resetEmailAddress = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.EMAIL);
};
oFF.UserProfile.prototype.getPhoneNumber = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.PHONE_NUMBER);
};
oFF.UserProfile.prototype.isPhoneNumberDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.PHONE_NUMBER);
};
oFF.UserProfile.prototype.setPhoneNumber = function(phoneNumber)
{
	this.setValue(oFF.UserProfileConstants.PHONE_NUMBER, phoneNumber);
};
oFF.UserProfile.prototype.resetPhoneNumber = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.PHONE_NUMBER);
};
oFF.UserProfile.prototype.getMobilePhoneNumber = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.MOBILE);
};
oFF.UserProfile.prototype.isMobilePhoneNumberDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.MOBILE);
};
oFF.UserProfile.prototype.setMobilePhoneNumber = function(mobilePhoneNumber)
{
	this.setValue(oFF.UserProfileConstants.MOBILE, mobilePhoneNumber);
};
oFF.UserProfile.prototype.resetMobilePhoneNumber = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.MOBILE);
};
oFF.UserProfile.prototype.getFaxNumber = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.FAX_NUMBER);
};
oFF.UserProfile.prototype.isFaxNumberDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.FAX_NUMBER);
};
oFF.UserProfile.prototype.setFaxNumber = function(faxNumber)
{
	this.setValue(oFF.UserProfileConstants.FAX_NUMBER, faxNumber);
};
oFF.UserProfile.prototype.resetFaxNumber = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.FAX_NUMBER);
};
oFF.UserProfile.prototype.getRoomNumber = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.ROOM_NUMBER);
};
oFF.UserProfile.prototype.isRoomNumberDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.ROOM_NUMBER);
};
oFF.UserProfile.prototype.setRoomNumber = function(roomNumber)
{
	this.setValue(oFF.UserProfileConstants.ROOM_NUMBER, roomNumber);
};
oFF.UserProfile.prototype.resetRoomNumber = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.ROOM_NUMBER);
};
oFF.UserProfile.prototype.getDepartment = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.DEPARTMENT);
};
oFF.UserProfile.prototype.isDepartmentDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.DEPARTMENT);
};
oFF.UserProfile.prototype.setDepartment = function(department)
{
	this.setValue(oFF.UserProfileConstants.DEPARTMENT, department);
};
oFF.UserProfile.prototype.resetDepartment = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.DEPARTMENT);
};
oFF.UserProfile.prototype.getRegion = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.REGION);
};
oFF.UserProfile.prototype.isRegionDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.REGION);
};
oFF.UserProfile.prototype.setRegion = function(region)
{
	this.setValue(oFF.UserProfileConstants.REGION, region);
};
oFF.UserProfile.prototype.resetRegion = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.REGION);
};
oFF.UserProfile.prototype.getManagerPersonNumber = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.MANAGER_ID);
};
oFF.UserProfile.prototype.isManagerPersonNumberDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.MANAGER_ID);
};
oFF.UserProfile.prototype.setManagerPersonNumber = function(managerPersonNumber)
{
	this.setValue(oFF.UserProfileConstants.MANAGER_ID, managerPersonNumber);
};
oFF.UserProfile.prototype.resetManagerPersonNumber = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.MANAGER_ID);
};
oFF.UserProfile.prototype.getDeliveryOfficeName = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.DELIVERY_OFFICE_NAME);
};
oFF.UserProfile.prototype.isDeliveryOfficeNameDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.DELIVERY_OFFICE_NAME);
};
oFF.UserProfile.prototype.setDeliveryOfficeName = function(deliveryOfficeName)
{
	this.setValue(oFF.UserProfileConstants.DELIVERY_OFFICE_NAME, deliveryOfficeName);
};
oFF.UserProfile.prototype.resetDeliveryOfficeName = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.DELIVERY_OFFICE_NAME);
};
oFF.UserProfile.prototype.getCostCenter = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.COST_CENTER);
};
oFF.UserProfile.prototype.isCostCenterDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.COST_CENTER);
};
oFF.UserProfile.prototype.setCostCenter = function(costCenter)
{
	this.setValue(oFF.UserProfileConstants.COST_CENTER, costCenter);
};
oFF.UserProfile.prototype.resetCostCenter = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.COST_CENTER);
};
oFF.UserProfile.prototype.getCostCenterId = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.COST_CENTER_ID);
};
oFF.UserProfile.prototype.isCostCenterIdDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.COST_CENTER_ID);
};
oFF.UserProfile.prototype.setCostCenterId = function(costCenterId)
{
	this.setValue(oFF.UserProfileConstants.COST_CENTER_ID, costCenterId);
};
oFF.UserProfile.prototype.resetCostCenterId = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.COST_CENTER_ID);
};
oFF.UserProfile.prototype.getOrgUnit = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.ORG_UNIT);
};
oFF.UserProfile.prototype.isOrgUnitDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.ORG_UNIT);
};
oFF.UserProfile.prototype.setOrgUnit = function(orgUnit)
{
	this.setValue(oFF.UserProfileConstants.ORG_UNIT, orgUnit);
};
oFF.UserProfile.prototype.resetOrgUnit = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.ORG_UNIT);
};
oFF.UserProfile.prototype.getText = function()
{
	return this.getDescription();
};
oFF.UserProfile.prototype.getDescription = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.DESCRIPTION);
};
oFF.UserProfile.prototype.isDescriptionDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.DESCRIPTION);
};
oFF.UserProfile.prototype.setDescription = function(description)
{
	this.setValue(oFF.UserProfileConstants.DESCRIPTION, description);
};
oFF.UserProfile.prototype.resetDescription = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.DESCRIPTION);
};
oFF.UserProfile.prototype.getLanguage = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.LANGUAGE);
};
oFF.UserProfile.prototype.isLanguageDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.LANGUAGE);
};
oFF.UserProfile.prototype.setLanguage = function(language)
{
	this.setValue(oFF.UserProfileConstants.LANGUAGE, language);
};
oFF.UserProfile.prototype.resetLanguage = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.LANGUAGE);
};
oFF.UserProfile.prototype.getDataAccessLanguage = function()
{
	var dataAccessLanguage = this.m_properties.getByKey(oFF.UserProfileConstants.DATA_ACCESS_LANGUAGE);
	if (oFF.XStringUtils.isNullOrEmpty(dataAccessLanguage))
	{
		dataAccessLanguage = this.getLanguage();
		if (oFF.XStringUtils.isNullOrEmpty(dataAccessLanguage))
		{
			dataAccessLanguage = "en";
		}
	}
	return dataAccessLanguage;
};
oFF.UserProfile.prototype.isDataAccessLanguageDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.DATA_ACCESS_LANGUAGE);
};
oFF.UserProfile.prototype.setDataAccessLanguage = function(dataAccessLanguage)
{
	this.setValue(oFF.UserProfileConstants.DATA_ACCESS_LANGUAGE, dataAccessLanguage);
};
oFF.UserProfile.prototype.resetDataAccessLanguage = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.DATA_ACCESS_LANGUAGE);
};
oFF.UserProfile.prototype.getDateFormatting = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.DATE_FORMAT);
};
oFF.UserProfile.prototype.isDateFormattingDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.DATE_FORMAT);
};
oFF.UserProfile.prototype.setDateFormatting = function(dateFormatting)
{
	this.setValue(oFF.UserProfileConstants.DATE_FORMAT, dateFormatting);
};
oFF.UserProfile.prototype.resetDateFormatting = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.DATE_FORMAT);
};
oFF.UserProfile.prototype.getTimeFormatting = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.TIME_FORMAT);
};
oFF.UserProfile.prototype.isTimeFormattingDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.TIME_FORMAT);
};
oFF.UserProfile.prototype.setTimeFormatting = function(timeFormatting)
{
	this.setValue(oFF.UserProfileConstants.TIME_FORMAT, timeFormatting);
};
oFF.UserProfile.prototype.resetTimeFormatting = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.TIME_FORMAT);
};
oFF.UserProfile.prototype.getScaleFormatting = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.SCALE_FORMAT);
};
oFF.UserProfile.prototype.isScaleFormattingDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.SCALE_FORMAT);
};
oFF.UserProfile.prototype.setScaleFormatting = function(scaleFormatting)
{
	this.setValue(oFF.UserProfileConstants.SCALE_FORMAT, scaleFormatting);
};
oFF.UserProfile.prototype.resetScaleFormatting = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.SCALE_FORMAT);
};
oFF.UserProfile.prototype.getCurrencyPosition = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.CURRENCY_POS);
};
oFF.UserProfile.prototype.isCurrencyPositionDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.CURRENCY_POS);
};
oFF.UserProfile.prototype.setCurrencyPosition = function(currencyPosition)
{
	this.setValue(oFF.UserProfileConstants.CURRENCY_POS, currencyPosition);
};
oFF.UserProfile.prototype.resetCurrencyPosition = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.CURRENCY_POS);
};
oFF.UserProfile.prototype.getMainApplication = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.MAIN_APP);
};
oFF.UserProfile.prototype.isMainApplicationDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.MAIN_APP);
};
oFF.UserProfile.prototype.setMainApplication = function(mainApplication)
{
	this.setValue(oFF.UserProfileConstants.MAIN_APP, mainApplication);
};
oFF.UserProfile.prototype.resetMainApplication = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.MAIN_APP);
};
oFF.UserProfile.prototype.getCleanUpNotification = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.CLEAN_UP_NOTIFICATION);
};
oFF.UserProfile.prototype.isCleanUpNotificationDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.CLEAN_UP_NOTIFICATION);
};
oFF.UserProfile.prototype.setCleanUpNotification = function(cleanUpNotification)
{
	this.setValue(oFF.UserProfileConstants.CLEAN_UP_NOTIFICATION, cleanUpNotification);
};
oFF.UserProfile.prototype.resetCleanUpNotification = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.CLEAN_UP_NOTIFICATION);
};
oFF.UserProfile.prototype.getEmailSystemNotification = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.EMAIL_SYSTEM_NOTIFICATION);
};
oFF.UserProfile.prototype.isEmailSystemNotificationDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.EMAIL_SYSTEM_NOTIFICATION);
};
oFF.UserProfile.prototype.setEmailSystemNotification = function(emailSystemNotification)
{
	this.setValue(oFF.UserProfileConstants.EMAIL_SYSTEM_NOTIFICATION, emailSystemNotification);
};
oFF.UserProfile.prototype.resetEmailSystemNotification = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.EMAIL_SYSTEM_NOTIFICATION);
};
oFF.UserProfile.prototype.getEmailProductUpdateNotification = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.EMAIL_PRODUCT_UPDATE_NOTIFICATION);
};
oFF.UserProfile.prototype.isEmailProductUpdateNotificationDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.EMAIL_PRODUCT_UPDATE_NOTIFICATION);
};
oFF.UserProfile.prototype.setEmailProductUpdateNotification = function(emailProductUpdateNotification)
{
	this.setValue(oFF.UserProfileConstants.EMAIL_PRODUCT_UPDATE_NOTIFICATION, emailProductUpdateNotification);
};
oFF.UserProfile.prototype.resetEmailProductUpdateNotification = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.EMAIL_PRODUCT_UPDATE_NOTIFICATION);
};
oFF.UserProfile.prototype.getThumbnailPhotoEncoded = function()
{
	var photo = this.getThumbnailPhoto();
	if (oFF.isNull(photo))
	{
		photo = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBKwErAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAALCABkAGQBAREA/8QAHgABAAICAgMBAAAAAAAAAAAAAAoLCAkGBwEDBQL/xAAwEAAABgIBAgMHBAMBAAAAAAABAgMEBQYABwgJEgoRExQVFiFSktMiMTJBFxhRI//aAAgBAQAAPwCfxjGMYxjGMYxjGMZq/wCqD1bOKHSi1Kz2DyCnXszdbWR8jq3SlOMzdbF2Q/YlD2lVg1dLJNYOsx6yiKUxbZpRCKYGWTbNwkJJVtHLwKuS/jH+pVs+fkS8eKhpTjPShWXJENUqqTa95BoJzA3UlrNd++urPPS7RV92UmNRIoIlJ3lADGw8g/FQ9bGGk05FblFXZ1MigHPFTmjtMrRiwAPmKSibGkx7sqY/xH0XiSgB/E5R+ebyun14z+xOrVX6D1HNJ1lCsSbltHud9aFZyrBzXDLKFSGWturZaQmglotLz9V+5qM0zftkgOdlW5I5SoDPU1ns3X259f1DauqbhA37XN9gmFmp1yrEgjJwVhgpNEq7OQj3iBhIomoQRIomcCLtlyKtnKSLlFVInOsYxjGM+DabLC0usWO42V8jF12pwMvZZ+TcGAqEdCwUe4lJV8uYfICos2LVdwoYfkBEzDlJb1ReeuwupBzV3Lycu8m/UhbBY30JqmsuXCh2VE1HBPXLSi1eNbGN6TUycV2Sk0ZEpPeFjkpeTV81XZxzXvjGTyvBn9Rm0Nr7tLprbFsLqSqM3XZjdXHtCRcqLfDdhhF23+TqZEeqcfRjbBFPEbo3j0e1BrIQdjepkBWWcmGwuxjGMYzU511NmSOo+kNz+ucQ6UZSZuPdoqDJ0kcU1UVdjuY7XZjpnKIGKcqNpUEogID5h8spasYxm33oG7Mf6o6w3ASyMXarQsvviE17I+mcSAvE7PjpTXsg3V8hDvTOjZBMJB+QmIQf3AMue8YxjGM0u+IfqcncujBz4i4lJVZ3H6ljLUdJEomOMfTL/T7XLn8igI9iETDvXCn/ABNIwj8gHKanGMZs96K9Rk7x1ZentARCSirv/anU02oCZRMKcfVLG2tUu4N5fME20TCvXCpv2Kmkcw/IMuu8YxjGM6z3Tqqsb00/tLSt1bg7qG2te3HXFmQEhVBPCXSvyFekhTKf9PrJtZBRREw/xVIQwCAgAhRvcuOM+w+HPJXdHGTakavHXXTd9nabIisidJKWZMXRjwVkj+8A9aItEErHWCIck8yOI6SbKlH9XkGOmMZMe8HJwSnNwc1LvzdssKqGs+LVTlq1UJV02H2OX3TsqJWhUWkeqcAIsrVaE7sMlJil3HYuZyuGN2+1kHLNrGMYxjGRbfER9AZr1Oaoz5IcbUoOuc0tbV33QLCRVbxMJvulRoLOGNOnZU4EbxlygzqLFpdkfmBkog4Urs2u3jhjpCHq7Ny6Q2/x32FP6o3nra5ao2PV3irGdp15gX9fm2KyRzJ+p7M+RSB0zWEonaSLI7iPfIiVwzcroHIobqzNsHS96OXMLqnbPiq5pykydX08ylGyWx+Q9siXzPWlIigVL7eVnIKEQJb7X7OCnu2o19ZzIOHApHkVIqN9eSQt2OCXCTSXT04ya54t6EiDsaZRGB1JKbfEQGw3q3yPYvZ71anKBCFdz9jkCmcL9oA3YNCM4hgRKOjmaCeYGMYxjPBjAUBERAAABEREfIAAP3ER/ryzQF1K/Ee9PPp1knKUW6l5JchI0q7Yml9LScbMBCyiYeRW2w78U7mrUoqSggV7H+tM2luAGEKyf9wj58NfGnzEpu6yxvOnjxAVjRFpl0hpdl0MWXl7bqZh5FRBvboixyhx2THmKHtL6Ug/huYarCsZjASSJ0GDeU3F7r6MvV1osYR5auHPLaJVbJizrd/SpTzYlc9pJ3mbfDFzQjdj1J2UTmKqVFlHH9UBEpz/AKTjxWH6JPRH1TIkvheFHFuHNHqA/LJXQ6s9XWhkh9QHAxt5sstWk00x/UHexBIgB8gAoeWdQcx/ECdJbpv0VemVfZ9C2rcauxVj6px64pJ1uxJs3DdM3s0U9lquKWtqDHEVAE3Ht8qk8bJ9x2sK+VAqB45fGvxr16NvOyk5Y8Wa2nx2slg86mtpaUfqbQ1bAmMmgiSZJaH5ILaBiJgLuQUbBRXXrmW9gTURBBgWa9wy6hHD3qA0FLYfFDeNP2lHJt0FpyvM3gxl9p6y5CCDK5USVK0s9ccEOf0gUfxpGLk5TGYPHaPaqbM7GMZwfZuxqfp/XN82vsGYb1+i62qFivNwm3ZykbxVbq0S6mpl8oJjFAfZ2DJdQqYCBlTgVMnmc4ANT/1SvEvc7ufs3dNfaxuMlxh4tvpCSjYbXWsX7qFutwq3rqIs1No7BaLJz8o5k2QJrSddgnMLVkzLKMlY+SKl7WtHCOc6hzqKHMdQ5jHOc5hMcxzCJjGMYwiYxjGERMYRERERERERz8Z7EllUFCLIKqIrJmAyaqRzJqJmD9jEOQQMUwf0JRAQz7j622qUbAyk7NYJFmUO0rR9NSTtsUPL5ACDhyokAB/wCeWcfxnaGnd2be4936E2lo3Zd11NsSuOCOYW40KxSVanmRyHKcUwfRjhuou0WEoFdMXPrMnifmi6brJGMQbEjw5fiOtx839yR3Bnm+NVl9sS9SlJTTO8Idi0rEjsKSqTEZGZpd6gGXowStocV5u/nIedr7OJSkgiJJk/ijvlmzpabBjGRAfGCdQH/XzhLVOGlIm/ZNk8wJdT4wSZuOx9F6Kor1k/sXrgT/0RRutqGCraXcJU38SztLX9RSKFysFxjGMYxnc3Hfel74yb21FyE1lIqRd901sGr7DrDoihiENI1mVbSQMXXb81I+URRWjJNAfMrmPeOm5wEipgG8O4n8jqLy842aT5M61dkdUzdWu63fIkhVCqqRisuwTPLQDwxf4yVcmSSEDKJD5GRkI5ykYAEg5kJnodOmzJs4evF0WrNogq6dOnChUUGzZBMyq666qglIkiikQyiihzAUhCmMYQABHKYXrlc+HHUV6kG+N2xcos/wBWViYNqLRyIqGFojqzXjp5FxUq0SE5iJ/GMseZuy/aAG9SxCkfzBEvlqIxjGMYxjLE/wAGH1AvizWO6enTe5v1JrWLp1vDRiD1wAqr0Syv2zHZdYjyqH7jI123OoyzoNkgEe24zCwFBJqcSzqc0H+JU5mWnhd0od3WChGeNL5vGQh+N9ZnWRzoqVkmz2UyFrniuE/1IOm9GhLOzjFiGKojMPo9cgh6QiFPvjGMYxjGMz36YPMO28Dud/G7k3UzO1iUXYkQyuEM0VOn8T66tSvwzfq2oUogVUZOsSkiDIqgGIlKJMHQF9RuQQu+WjhJ61bPEe/0XbdFyj3gYh/SXTKqn3k8/Mpuw4dxR+YD5gP7Zg31KOHmkedHDPdGgd+wsjK0qRrTy2sHsE/SirLWLdS2rmdrVnrUouzkEGMvGvW4pgZywfM3bB0+jnzNyyeOET0omxKTFVG+XGrxriQXj69ZJeHZLPlWyrxVtHvlmyJ3SiDRsgdcyaYCqZJuimY4iJUiB5FDhnutv9a33E/Hj3W3+tb7ifjx7rb/AFrfcT8ePdbf61vuJ+PHutv9a33E/Hj3W3+tb7ifjx7rb/Wt9xPx491t/rW+4n48e62/1rfcT8eSHfDT8DtAc1uoZV4jf0bYLJWdTR/+V4mqM5RmwgLHYqg5Qk4ZhcEDRTp7KV0r9Bu4exTJ9F+8Cog0eOFmKrhqtbdgBe0oAUoABQAAAAAAAA+QAH9AH9B/Wf/Z";
	}
	else
	{
		photo = oFF.XStringUtils.concatenate2("data:image/jpeg;base64,", photo);
	}
	return photo;
};
oFF.UserProfile.prototype.getThumbnailPhoto = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.THUMBNAIL_PHOTO);
};
oFF.UserProfile.prototype.isThumbnailPhotoDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.THUMBNAIL_PHOTO);
};
oFF.UserProfile.prototype.setThumbnailPhoto = function(thumbnailPhoto)
{
	this.setValue(oFF.UserProfileConstants.THUMBNAIL_PHOTO, thumbnailPhoto);
};
oFF.UserProfile.prototype.resetThumbnailPhoto = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.THUMBNAIL_PHOTO);
};
oFF.UserProfile.prototype.getCompany = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.COMPANY);
};
oFF.UserProfile.prototype.isCompanyDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.COMPANY);
};
oFF.UserProfile.prototype.setCompany = function(company)
{
	this.setValue(oFF.UserProfileConstants.COMPANY, company);
};
oFF.UserProfile.prototype.resetCompany = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.COMPANY);
};
oFF.UserProfile.prototype.getSamaAccountType = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.ACCOUNT_TYPE);
};
oFF.UserProfile.prototype.isSamaAccountTypeDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.ACCOUNT_TYPE);
};
oFF.UserProfile.prototype.setSamaAccountType = function(samaAccountType)
{
	this.setValue(oFF.UserProfileConstants.ACCOUNT_TYPE, samaAccountType);
};
oFF.UserProfile.prototype.resetSamaAccountType = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.ACCOUNT_TYPE);
};
oFF.UserProfile.prototype.getTelephoneAssistant = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.TELEPHONE_ASSISTANT);
};
oFF.UserProfile.prototype.isTelephoneAssistantDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.TELEPHONE_ASSISTANT);
};
oFF.UserProfile.prototype.setTelephoneAssistant = function(telephoneAssistant)
{
	this.setValue(oFF.UserProfileConstants.TELEPHONE_ASSISTANT, telephoneAssistant);
};
oFF.UserProfile.prototype.resetTelephoneAssistant = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.TELEPHONE_ASSISTANT);
};
oFF.UserProfile.prototype.getSAPObjectStatus = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.SAP_OBJECT_STATUS);
};
oFF.UserProfile.prototype.isSAPObjectStatusDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.SAP_OBJECT_STATUS);
};
oFF.UserProfile.prototype.setSAPObjectStatus = function(SAPObjectStatus)
{
	this.setValue(oFF.UserProfileConstants.SAP_OBJECT_STATUS, SAPObjectStatus);
};
oFF.UserProfile.prototype.resetSAPObjectStatus = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.SAP_OBJECT_STATUS);
};
oFF.UserProfile.prototype.getUnixHomeDirectory = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.HOME_DIR);
};
oFF.UserProfile.prototype.isUnixHomeDirectoryDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.HOME_DIR);
};
oFF.UserProfile.prototype.setUnixHomeDirectory = function(unixHomeDirectory)
{
	this.setValue(oFF.UserProfileConstants.HOME_DIR, unixHomeDirectory);
};
oFF.UserProfile.prototype.resetUnixHomeDirectory = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.HOME_DIR);
};
oFF.UserProfile.prototype.getExchUsageLocation = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.EXCHANGE_USAGE_LOCATION);
};
oFF.UserProfile.prototype.isExchUsageLocationDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.EXCHANGE_USAGE_LOCATION);
};
oFF.UserProfile.prototype.setExchUsageLocation = function(exchUsageLocation)
{
	this.setValue(oFF.UserProfileConstants.EXCHANGE_USAGE_LOCATION, exchUsageLocation);
};
oFF.UserProfile.prototype.resetExchUsageLocation = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.EXCHANGE_USAGE_LOCATION);
};
oFF.UserProfile.prototype.getTenantId = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.TENANT_ID);
};
oFF.UserProfile.prototype.isTenantIdDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.TENANT_ID);
};
oFF.UserProfile.prototype.setTenantId = function(tenantId)
{
	this.setValue(oFF.UserProfileConstants.TENANT_ID, tenantId);
};
oFF.UserProfile.prototype.resetTenantId = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.TENANT_ID);
};
oFF.UserProfile.prototype.getTimeZone = function()
{
	var timeZone = null;
	var timeZoneId = this.getTimeZoneId();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(timeZoneId))
	{
		if (oFF.XString.startsWith(timeZoneId, "#") === false)
		{
			timeZone = oFF.XSimpleTimeZone.createWithId(timeZoneId);
		}
	}
	return timeZone;
};
oFF.UserProfile.prototype.getTimeZoneId = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.TIMEZONE_ID);
};
oFF.UserProfile.prototype.isTimeZoneIdDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.TIMEZONE_ID);
};
oFF.UserProfile.prototype.setTimeZoneId = function(timeZoneId)
{
	this.setValue(oFF.UserProfileConstants.TIMEZONE_ID, timeZoneId);
};
oFF.UserProfile.prototype.resetTimeZoneId = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.TIMEZONE_ID);
};
oFF.UserProfile.prototype.getDecimalFormatExample = function()
{
	var numberFormatting;
	var groupingSeparator = this.getDecimalGroupingSeparator();
	var decimalSeparator = this.getDecimalSeparator();
	numberFormatting = oFF.XStringBuffer.create().append("1").append(groupingSeparator).append("234").append(groupingSeparator).append("567").append(decimalSeparator).append("89").toString();
	return numberFormatting;
};
oFF.UserProfile.prototype.getDecimalFormat = function()
{
	var numberFormatting = this.m_properties.getByKey(oFF.UserProfileConstants.DECIMAL_FORMAT);
	if (oFF.XStringUtils.isNullOrEmpty(numberFormatting))
	{
		var groupingSeparator = this.getDecimalGroupingSeparator();
		var decimalSeparator = this.getDecimalSeparator();
		numberFormatting = oFF.XStringBuffer.create().append("#").append(groupingSeparator).append("##0").append(decimalSeparator).append("00").toString();
	}
	return numberFormatting;
};
oFF.UserProfile.prototype.isDecimalFormatDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.DECIMAL_FORMAT);
};
oFF.UserProfile.prototype.setDecimalFormat = function(decimalFormat)
{
	this.setValue(oFF.UserProfileConstants.DECIMAL_FORMAT, decimalFormat);
};
oFF.UserProfile.prototype.resetDecimalFormat = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.DECIMAL_FORMAT);
};
oFF.UserProfile.prototype.getDecimalSeparator = function()
{
	var decimalSeparator = this.m_properties.getByKey(oFF.UserProfileConstants.DECIMAL_SEPARATOR);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(decimalSeparator))
	{
		var language = this.getLanguage();
		language = oFF.XString.toLowerCase(language);
		if (oFF.XString.isEqual(language, "en"))
		{
			decimalSeparator = ".";
		}
		else
		{
			decimalSeparator = ",";
		}
	}
	return decimalSeparator;
};
oFF.UserProfile.prototype.isDecimalSeparatorDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.DECIMAL_SEPARATOR);
};
oFF.UserProfile.prototype.setDecimalSeparator = function(decimalSeparator)
{
	this.setValue(oFF.UserProfileConstants.DECIMAL_SEPARATOR, decimalSeparator);
};
oFF.UserProfile.prototype.resetDecimalSeparator = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.DECIMAL_SEPARATOR);
};
oFF.UserProfile.prototype.getDecimalGroupingSeparator = function()
{
	var groupingSeparator = this.m_properties.getByKey(oFF.UserProfileConstants.GROUPING_SEPARATOR);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(groupingSeparator))
	{
		var language = this.getLanguage();
		language = oFF.XString.toLowerCase(language);
		if (oFF.XString.isEqual(language, "en"))
		{
			groupingSeparator = ",";
		}
		else
		{
			groupingSeparator = ".";
		}
	}
	return groupingSeparator;
};
oFF.UserProfile.prototype.isDecimalGroupingSeparatorDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.GROUPING_SEPARATOR);
};
oFF.UserProfile.prototype.setDecimalGroupingSeparator = function(groupingSeparator)
{
	this.setValue(oFF.UserProfileConstants.GROUPING_SEPARATOR, groupingSeparator);
};
oFF.UserProfile.prototype.resetDecimalGroupingSeparator = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.GROUPING_SEPARATOR);
};
oFF.UserProfile.prototype.getEncryptionToken = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.ENCRYPTION_TOKEN);
};
oFF.UserProfile.prototype.isEncryptionTokenDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.ENCRYPTION_TOKEN);
};
oFF.UserProfile.prototype.setEncryptionToken = function(encryptionToken)
{
	this.setValue(oFF.UserProfileConstants.ENCRYPTION_TOKEN, encryptionToken);
};
oFF.UserProfile.prototype.resetEncryptionToken = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.ENCRYPTION_TOKEN);
};
oFF.UserProfile.prototype.getCacheSchema = function()
{
	return this.m_properties.getByKey(oFF.UserProfileConstants.CACHE_SCHEMA);
};
oFF.UserProfile.prototype.isCacheSchemaDefault = function()
{
	return this.m_properties.isValueDefault(oFF.UserProfileConstants.CACHE_SCHEMA);
};
oFF.UserProfile.prototype.setCacheSchema = function(cacheSchema)
{
	this.setValue(oFF.UserProfileConstants.CACHE_SCHEMA, cacheSchema);
};
oFF.UserProfile.prototype.resetCacheSchema = function()
{
	this.m_properties.remove(oFF.UserProfileConstants.CACHE_SCHEMA);
};

oFF.SubSysCachePrg = function() {};
oFF.SubSysCachePrg.prototype = new oFF.DfProgramSubSys();
oFF.SubSysCachePrg.prototype._ff_c = "SubSysCachePrg";

oFF.SubSysCachePrg.DEFAULT_PROGRAM_NAME = "@SubSys.Cache";
oFF.SubSysCachePrg.prototype.m_cacheProvider = null;
oFF.SubSysCachePrg.prototype.m_isReady = false;
oFF.SubSysCachePrg.prototype.m_cacheType = null;
oFF.SubSysCachePrg.prototype.m_cacheSchema = null;
oFF.SubSysCachePrg.prototype.m_children = null;
oFF.SubSysCachePrg.prototype.m_systems = null;
oFF.SubSysCachePrg.prototype.newProgram = function()
{
	var prg = new oFF.SubSysCachePrg();
	prg.setup();
	return prg;
};
oFF.SubSysCachePrg.prototype.getSubSystemType = function()
{
	return oFF.SubSystemType.CACHE;
};
oFF.SubSysCachePrg.prototype.setup = function()
{
	oFF.DfProgramSubSys.prototype.setup.call( this );
	this.m_children = oFF.XHashMapByString.create();
	this.m_systems = oFF.XHashMapByString.create();
};
oFF.SubSysCachePrg.prototype.runProcess = function()
{
	var process = this.getProcess();
	var environment = process.getEnvironment();
	this.m_cacheType = environment.getStringByKeyExt(oFF.XEnvironmentConstants.FIREFLY_CACHE_TYPE, this.m_cacheType);
	var messages = oFF.MessageManager.createMessageManagerExt(process);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_cacheType))
	{
		this.m_cacheSchema = environment.getStringByKeyExt(oFF.XEnvironmentConstants.FIREFLY_CACHE_SCHEMA, null);
		this.log2("Cache type used: ", this.m_cacheType);
		this.m_cacheProvider = oFF.XCacheProviderFactory.createDeviceCacheAccess(process, this.m_cacheType);
		if (oFF.notNull(this.m_cacheProvider))
		{
			var startupArguments = oFF.XProperties.create();
			var cachePath = environment.getVariable(oFF.XEnvironmentConstants.FIREFLY_CACHE);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(cachePath))
			{
				startupArguments.putString(oFF.XCacheProviderFactory.PARAMETER_URL, cachePath);
				this.log2("Cache file directory: ", cachePath);
			}
			this.m_cacheProvider.processOpen(this.getDefaultSyncType(), this, null, startupArguments);
		}
		else
		{
			messages.addError(0, oFF.XStringUtils.concatenate2("Cannot create cache provider for type ", this.m_cacheType));
			this.activateSubSystem(messages, oFF.SubSystemStatus.INACTIVE);
		}
	}
	else
	{
		messages.addInfo(0, "No cache type is given. Use environment variable ff_cache_type to be idb, ls, file or memory");
		this.activateSubSystem(messages, oFF.SubSystemStatus.INACTIVE);
	}
	return false;
};
oFF.SubSysCachePrg.prototype.onCacheProviderOpen = function(extResult, cacheProvider, customIdentifier)
{
	if (extResult.isValid())
	{
		this.log("Success opening cache");
		this.m_isReady = true;
		this.activateSubSystem(extResult, oFF.SubSystemStatus.ACTIVE);
	}
	else
	{
		this.log2("Error opening cache: ", extResult.getSummary());
		this.activateSubSystem(extResult, oFF.SubSystemStatus.INACTIVE);
	}
};
oFF.SubSysCachePrg.prototype.getMainApi = function()
{
	var mainApi = null;
	if (this.m_isReady === true)
	{
		mainApi = this;
	}
	return mainApi;
};
oFF.SubSysCachePrg.prototype.getCacheProvider = function()
{
	return this.m_cacheProvider;
};
oFF.SubSysCachePrg.prototype.getSystemCache = function(systemName)
{
	var systemCache = null;
	if (oFF.notNull(this.m_cacheProvider))
	{
		if (oFF.XStringUtils.isNotNullAndNotEmpty(systemName))
		{
			systemCache = this.m_systems.getByKey(systemName);
			if (oFF.isNull(systemCache))
			{
				var rpcCache = this.getRpcCache();
				if (oFF.notNull(rpcCache))
				{
					systemCache = rpcCache.getSubCache(systemName);
					if (oFF.notNull(systemCache))
					{
						this.m_systems.put(systemName, systemCache);
					}
				}
			}
		}
	}
	return systemCache;
};
oFF.SubSysCachePrg.prototype.getRpcCache = function()
{
	return this.getSubCache("rpc");
};
oFF.SubSysCachePrg.prototype.getCacheType = function()
{
	return this.m_cacheType;
};
oFF.SubSysCachePrg.prototype.getSubCache = function(namespace)
{
	var cache = null;
	if (oFF.notNull(this.m_cacheProvider))
	{
		cache = this.m_children.getByKey(namespace);
		if (oFF.isNull(cache) && this.m_isReady)
		{
			cache = this.m_cacheProvider.getSubCache(namespace);
			this.m_children.put(namespace, cache);
			if (oFF.XString.isEqual("rpc", namespace))
			{
				if (oFF.XString.isEqual(this.m_cacheSchema, "rpc_read_write"))
				{
					cache.setEnabled(true);
					cache.setIsReadEnabled(true);
					cache.setIsWriteEnabled(true);
					cache.setMaxCount(100000);
					cache.setValidityTime(1000 * 60 * 60 * 24 * 7);
				}
				else if (oFF.XString.isEqual(this.m_cacheSchema, "rpc_write"))
				{
					cache.setEnabled(true);
					cache.setIsReadEnabled(false);
					cache.setIsWriteEnabled(true);
					cache.setMaxCount(100000);
					cache.setValidityTime(1000 * 60 * 60 * 24 * 7);
				}
				else if (oFF.XString.isEqual(this.m_cacheSchema, "rpc_read"))
				{
					cache.setEnabled(true);
					cache.setIsReadEnabled(true);
					cache.setIsWriteEnabled(false);
					cache.setMaxCount(100000);
					cache.setValidityTime(1000 * 60 * 60 * 24 * 7);
				}
			}
		}
	}
	return cache;
};
oFF.SubSysCachePrg.prototype.supportsNameSpaceEnumeration = function()
{
	return true;
};
oFF.SubSysCachePrg.prototype.getNameSpaces = function()
{
	return this.m_children.getKeysAsReadOnlyListOfString();
};

oFF.BasicCredentialsAction = function() {};
oFF.BasicCredentialsAction.prototype = new oFF.SyncAction();
oFF.BasicCredentialsAction.prototype._ff_c = "BasicCredentialsAction";

oFF.BasicCredentialsAction.createAndRun = function(syncType, listener, customIdentifier, context, connection, rpcMessages, authType)
{
	var object = new oFF.BasicCredentialsAction();
	object.m_rpcMessages = rpcMessages;
	object.m_connection = connection;
	object.m_authType = authType;
	object.setupActionAndRun(syncType, listener, customIdentifier, context);
	return object;
};
oFF.BasicCredentialsAction.prototype.m_connection = null;
oFF.BasicCredentialsAction.prototype.m_rpcMessages = null;
oFF.BasicCredentialsAction.prototype.m_authType = null;
oFF.BasicCredentialsAction.prototype.releaseObject = function()
{
	this.m_connection = null;
	this.m_rpcMessages = null;
	oFF.SyncAction.prototype.releaseObject.call( this );
};
oFF.BasicCredentialsAction.prototype.processSynchronization = function(syncType)
{
	if (oFF.isNull(this.m_rpcMessages))
	{
		var personalization = this.getActionContext().newMergedPersonalization(this.m_connection.getSystemName());
		if (oFF.notNull(this.m_authType))
		{
			personalization.setAuthenticationType(this.m_authType);
		}
		this.setData(personalization);
	}
	else
	{
		this.addAllMessages(this.m_rpcMessages);
	}
	return false;
};
oFF.BasicCredentialsAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onCredentialsReady(extResult, data, customIdentifier);
};

oFF.XHttpFileDirAction2 = function() {};
oFF.XHttpFileDirAction2.prototype = new oFF.SyncAction();
oFF.XHttpFileDirAction2.prototype._ff_c = "XHttpFileDirAction2";

oFF.XHttpFileDirAction2.createAndRun = function(syncType, context, listener, customIdentifier)
{
	var object = new oFF.XHttpFileDirAction2();
	object.setupActionAndRun(syncType, listener, customIdentifier, context);
	return object;
};
oFF.XHttpFileDirAction2.prototype.m_parentVfsUri = null;
oFF.XHttpFileDirAction2.prototype.m_parentTargetUri = null;
oFF.XHttpFileDirAction2.prototype.m_targetDirUri = null;
oFF.XHttpFileDirAction2.prototype.processSynchronization = function(syncType)
{
	this.setData(this.getActionContext());
	var httpFile = this.getActionContext();
	this.m_parentTargetUri = this.normalizeForDir(httpFile.getTargetUri());
	this.m_parentVfsUri = this.normalizeForDir(httpFile.getVfsUri());
	this.m_targetDirUri = oFF.XUri.createChild(this.m_parentTargetUri, ".index.json");
	var request = oFF.HttpRequest.createByUri(this.m_targetDirUri);
	var httpClient = request.newHttpClient(this.getSession());
	httpClient.processHttpRequest(syncType, this, null);
	return true;
};
oFF.XHttpFileDirAction2.prototype.normalizeForDir = function(uri)
{
	var result = uri;
	var path = uri.getPath();
	if (oFF.XString.endsWith(path, "/") === false)
	{
		var targetUri = oFF.XUri.createFromOther(uri);
		if (oFF.XString.endsWith(path, "/") === false)
		{
			path = oFF.XStringUtils.concatenate2(path, "/");
		}
		targetUri.setPath(path);
		result = targetUri;
	}
	return result;
};
oFF.XHttpFileDirAction2.prototype.onHttpResponse = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		if (oFF.HttpStatusCode.isOk(response.getStatusCode()))
		{
			var jsonContent = response.getJsonContent();
			if (oFF.notNull(jsonContent) && jsonContent.isStructure())
			{
				var dirInfo = jsonContent;
				var file = this.getActionContext();
				var fileSystem = file.getFileSystem();
				var session = this.getSession();
				var children = oFF.XList.create();
				var fileList = dirInfo.getListByKey("Files");
				for (var i = 0; i < fileList.size(); i++)
				{
					var fileStructure = fileList.getStructureAt(i);
					var type = fileStructure.getStringByKey("Type");
					var isDirectory = oFF.XString.isEqual(type, "Dir");
					var isExecutable = fileStructure.getBooleanByKeyExt("IsExecutable", false);
					var name = fileStructure.getStringByKey("Name");
					var targetName = name;
					if (isDirectory)
					{
						targetName = oFF.XStringUtils.concatenate2(name, "/");
					}
					var vfsChildUri = oFF.XUri.createFromUrlWithParent(targetName, this.m_parentVfsUri, false);
					var targetChildUri = oFF.XUri.createFromUrlWithParent(targetName, this.m_parentTargetUri, false);
					var childFile = oFF.XHttpFile._create(session, fileSystem, vfsChildUri, targetChildUri);
					childFile.setIsDirectory(isDirectory);
					childFile.setIsExecutable(isExecutable);
					children.add(childFile);
				}
				file.setChildFiles(children);
			}
			else
			{
				this.addErrorExt(oFF.OriginLayer.IOLAYER, oFF.ErrorCodes.SYSTEM_IO, "Missing json content", null);
			}
		}
		else
		{
			this.addErrorExt(oFF.OriginLayer.IOLAYER, oFF.ErrorCodes.SYSTEM_IO_HTTP, response.getStatusCodeDetails(), null);
		}
	}
	this.endSync();
};
oFF.XHttpFileDirAction2.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onChildrenFetched(extResult, data, customIdentifier);
};

oFF.XHttpFileLoadAction = function() {};
oFF.XHttpFileLoadAction.prototype = new oFF.SyncAction();
oFF.XHttpFileLoadAction.prototype._ff_c = "XHttpFileLoadAction";

oFF.XHttpFileLoadAction.createAndRun = function(syncType, context, listener, customIdentifier)
{
	var object = new oFF.XHttpFileLoadAction();
	object.setupActionAndRun(syncType, listener, customIdentifier, context);
	return object;
};
oFF.XHttpFileLoadAction.prototype.processSynchronization = function(syncType)
{
	var uri = this.getActionContext().getTargetUri();
	var request = oFF.HttpRequest.createByUri(uri);
	var httpClient = request.newHttpClient(this.getSession());
	httpClient.processHttpRequest(syncType, this, null);
	return true;
};
oFF.XHttpFileLoadAction.prototype.onHttpResponse = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		this.getActionContext().setFileContent(response);
		if (oFF.HttpStatusCode.isOk(response.getStatusCode()))
		{
			this.setData(this.getActionContext());
		}
		else
		{
			this.addErrorExt(oFF.OriginLayer.IOLAYER, oFF.ErrorCodes.SYSTEM_IO_HTTP, response.getStatusCodeDetails(), null);
		}
	}
	this.endSync();
};
oFF.XHttpFileLoadAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	var file = this.getActionContext();
	listener.onFileLoaded(this, file, file.getFileContent(), customIdentifier);
};

oFF.XHttpFileSystem = function() {};
oFF.XHttpFileSystem.prototype = new oFF.DfXFileSystem();
oFF.XHttpFileSystem.prototype._ff_c = "XHttpFileSystem";

oFF.XHttpFileSystem.create = function(session)
{
	var newObj = new oFF.XHttpFileSystem();
	newObj.setupSessionContext(session);
	return newObj;
};
oFF.XHttpFileSystem.prototype.getFileSystemType = function()
{
	return oFF.XFileSystemType.SIMPLE_WEB;
};
oFF.XHttpFileSystem.prototype.newFile = function(session, vfsUri, targetUri)
{
	return oFF.XHttpFile._create(session, this, vfsUri, targetUri);
};

oFF.XRemoteHttpFileRequestAction = function() {};
oFF.XRemoteHttpFileRequestAction.prototype = new oFF.SyncAction();
oFF.XRemoteHttpFileRequestAction.prototype._ff_c = "XRemoteHttpFileRequestAction";

oFF.XRemoteHttpFileRequestAction.UPDATE = "update";
oFF.XRemoteHttpFileRequestAction.LOAD = "load";
oFF.XRemoteHttpFileRequestAction.DELETE = "delete";
oFF.XRemoteHttpFileRequestAction.create = function(syncType, context, listener, action)
{
	var object = new oFF.XRemoteHttpFileRequestAction();
	object.setupAction(syncType, listener, null, context);
	object.m_action = action;
	return object;
};
oFF.XRemoteHttpFileRequestAction.prototype.m_action = null;
oFF.XRemoteHttpFileRequestAction.prototype.m_parentVfsUri = null;
oFF.XRemoteHttpFileRequestAction.prototype.m_parentTargetUri = null;
oFF.XRemoteHttpFileRequestAction.prototype.m_destFile = null;
oFF.XRemoteHttpFileRequestAction.prototype.processSynchronization = function(syncType)
{
	this.setData(this.getActionContext());
	var httpFile = this.getActionContext();
	this.m_parentTargetUri = httpFile.getTargetUri();
	this.m_parentVfsUri = httpFile.getVfsUri();
	var request = oFF.HttpRequest.createByUri(this.m_parentTargetUri);
	if (oFF.XString.isEqual(this.m_action, oFF.XRemoteHttpFileRequestAction.LOAD))
	{
		request.setMethod(oFF.HttpRequestMethod.HTTP_GET);
	}
	else if (oFF.XString.isEqual(this.m_action, oFF.XRemoteHttpFileRequestAction.UPDATE))
	{
		request.setMethod(oFF.HttpRequestMethod.HTTP_POST);
		var fileUpdateRequest = oFF.PrFactory.createStructure();
		var directory = httpFile.isDirectory();
		fileUpdateRequest.putString(oFF.XRemoteHttpFileConstants.FILE_TYPE, directory ? oFF.XRemoteHttpFileConstants.FILE_TYPE_DIR : oFF.XRemoteHttpFileConstants.FILE_TYPE_FILE);
		if (!directory)
		{
			var fileContent = httpFile.getFileContent();
			if (oFF.notNull(fileContent))
			{
				var contentType = fileContent.getContentType();
				fileUpdateRequest.putString(oFF.XRemoteHttpFileConstants.CONTENT_TYPE, contentType.getName());
				var contentString = contentType.isTypeOf(oFF.ContentType.BINARY) ? oFF.XByteArray.convertToString(fileContent.getByteArray()) : fileContent.getString();
				fileUpdateRequest.putString(oFF.XRemoteHttpFileConstants.CONTENT, contentString);
				fileUpdateRequest.putBoolean(oFF.XRemoteHttpFileConstants.EXECUTABLE, httpFile.isExecutable());
			}
		}
		if (oFF.notNull(this.m_destFile))
		{
			fileUpdateRequest.putString(oFF.XRemoteHttpFileConstants.NEW_FILE_NAME, this.m_destFile.getName());
		}
		request.setJsonObject(fileUpdateRequest);
	}
	else if (oFF.XString.isEqual(this.m_action, oFF.XRemoteHttpFileRequestAction.DELETE))
	{
		request.setMethod(oFF.HttpRequestMethod.HTTP_DELETE);
	}
	request.setAcceptContentType(oFF.ContentType.APPLICATION_JSON);
	var httpClient = request.newHttpClient(this.getSession());
	httpClient.processHttpRequest(syncType, this, null);
	return true;
};
oFF.XRemoteHttpFileRequestAction.prototype.onHttpResponse = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		if (oFF.HttpStatusCode.isOk(response.getStatusCode()))
		{
			var jsonContent = response.getJsonContent();
			if (oFF.notNull(jsonContent) && jsonContent.isStructure())
			{
				var fileInfo = jsonContent;
				var file = this.getActionContext();
				this.updateFileFromResponse(file, fileInfo);
			}
			else
			{
				this.addErrorExt(oFF.OriginLayer.IOLAYER, oFF.ErrorCodes.SYSTEM_IO, "Missing json content", null);
			}
		}
		else
		{
			this.addErrorExt(oFF.OriginLayer.IOLAYER, oFF.ErrorCodes.SYSTEM_IO_HTTP, response.getStatusCodeDetails(), null);
		}
	}
	this.endSync();
};
oFF.XRemoteHttpFileRequestAction.prototype.updateFileFromResponse = function(file, fileStructure)
{
	file.setMetadataLoaded(true);
	var exists = fileStructure.getBooleanByKey(oFF.XRemoteHttpFileConstants.EXISTS);
	this.importMessages(file, fileStructure);
	file.setExisting(exists);
	if (!exists)
	{
		return;
	}
	var fileType = fileStructure.getStringByKey(oFF.XRemoteHttpFileConstants.FILE_TYPE);
	var dir = oFF.XString.isEqual(fileType, oFF.XRemoteHttpFileConstants.FILE_TYPE_DIR);
	file.setIsDirectory(dir);
	var fileName = fileStructure.getStringByKey(oFF.XRemoteHttpFileConstants.FILE_NAME);
	if (oFF.notNull(fileName))
	{
		file.updateName(fileName);
	}
	if (dir)
	{
		this.m_parentVfsUri = this.normalizeForDir(this.m_parentVfsUri);
		this.m_parentTargetUri = this.normalizeForDir(this.m_parentTargetUri);
		var childrenElements = fileStructure.getListByKey(oFF.XRemoteHttpFileConstants.CHILDREN);
		if (oFF.notNull(childrenElements))
		{
			var session = this.getSession();
			var fileSystem = file.getFileSystem();
			var children = oFF.XList.create();
			for (var i = 0; i < childrenElements.size(); i++)
			{
				var childFileStructure = childrenElements.getStructureAt(i);
				var type = childFileStructure.getStringByKey(oFF.XRemoteHttpFileConstants.FILE_TYPE);
				var isDirectory = oFF.XString.isEqual(type, oFF.XRemoteHttpFileConstants.FILE_TYPE_DIR);
				var name = childFileStructure.getStringByKey(oFF.XRemoteHttpFileConstants.FILE_NAME);
				var targetName = isDirectory ? oFF.XStringUtils.concatenate2(name, "/") : name;
				var vfsChildUri = oFF.XUri.createFromUrlWithParent(targetName, this.m_parentVfsUri, false);
				var targetChildUri = oFF.XUri.createFromUrlWithParent(targetName, this.m_parentTargetUri, false);
				var childFile = oFF.XRemoteHttpFile._create(session, fileSystem, vfsChildUri, targetChildUri);
				this.updateFileFromResponse(childFile, childFileStructure);
				children.add(childFile);
			}
			file.setChildFiles(children);
		}
		file.setMetadataLoaded(true);
	}
	else
	{
		var isExecutable = fileStructure.getBooleanByKeyExt(oFF.XRemoteHttpFileConstants.EXECUTABLE, false);
		file.setIsExecutable(isExecutable);
		var contentString = fileStructure.getStringByKey(oFF.XRemoteHttpFileConstants.CONTENT);
		if (oFF.notNull(contentString))
		{
			var contentTypeString = fileStructure.getStringByKey(oFF.XRemoteHttpFileConstants.CONTENT_TYPE);
			var contentType = oFF.ContentType.lookup(contentTypeString);
			var fileContent;
			if (contentType.isTypeOf(oFF.ContentType.BINARY))
			{
				fileContent = oFF.XContent.createByteArrayContent(contentType, oFF.XByteArray.convertFromString(contentString));
			}
			else
			{
				fileContent = oFF.XContent.createStringContent(contentType, contentString);
			}
			file.setFileContent(fileContent);
			file.setMetadataLoaded(true);
		}
	}
};
oFF.XRemoteHttpFileRequestAction.prototype.importMessages = function(file, fileStructure)
{
	var messages = fileStructure.getListByKey("Messages");
	if (oFF.notNull(messages))
	{
		oFF.XCollectionUtils.forEach(messages,  function(m){
			var message = m.asStructure();
			file.addMessage(oFF.XMessage.createMessage(oFF.OriginLayer.IOLAYER, oFF.Severity.fromName(message.getStringByKey("Type")), message.getIntegerByKeyExt("Code", oFF.ErrorCodes.SYSTEM_IO_WRITE_ACCESS), message.getStringByKey("Text"), null, false, null));
		}.bind(this));
	}
};
oFF.XRemoteHttpFileRequestAction.prototype.normalizeForDir = function(uri)
{
	var result = uri;
	var path = uri.getPath();
	if (oFF.XString.endsWith(path, "/") === false)
	{
		var targetUri = oFF.XUri.createFromOther(uri);
		if (oFF.XString.endsWith(path, "/") === false)
		{
			path = oFF.XStringUtils.concatenate2(path, "/");
		}
		targetUri.setPath(path);
		result = targetUri;
	}
	return result;
};
oFF.XRemoteHttpFileRequestAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onHttpFileProcessed(extResult, data, null);
};
oFF.XRemoteHttpFileRequestAction.prototype.setDestinationFile = function(destFile)
{
	this.m_destFile = destFile;
};

oFF.XRemoteHttpFileSystem = function() {};
oFF.XRemoteHttpFileSystem.prototype = new oFF.DfXFileSystem();
oFF.XRemoteHttpFileSystem.prototype._ff_c = "XRemoteHttpFileSystem";

oFF.XRemoteHttpFileSystem.create = function(session)
{
	var newObj = new oFF.XRemoteHttpFileSystem();
	newObj.setupSessionContext(session);
	return newObj;
};
oFF.XRemoteHttpFileSystem.prototype.getFileSystemType = function()
{
	return oFF.XFileSystemType.REMOTE_WEB;
};
oFF.XRemoteHttpFileSystem.prototype.newFile = function(session, vfsUri, targetUri)
{
	return oFF.XRemoteHttpFile._create(session, this, vfsUri, targetUri);
};

oFF.MfsInMemoryFileSystem = function() {};
oFF.MfsInMemoryFileSystem.prototype = new oFF.DfXFileSystem();
oFF.MfsInMemoryFileSystem.prototype._ff_c = "MfsInMemoryFileSystem";

oFF.MfsInMemoryFileSystem.create = function(session)
{
	var newObj = new oFF.MfsInMemoryFileSystem();
	newObj.setupSessionContext(session);
	return newObj;
};
oFF.MfsInMemoryFileSystem.main = function() {};
oFF.MfsInMemoryFileSystem.prototype.m_root = null;
oFF.MfsInMemoryFileSystem.prototype.setupSessionContext = function(session)
{
	oFF.DfXFileSystem.prototype.setupSessionContext.call( this , session);
	this.m_root = oFF.MfsDirectory.create();
};
oFF.MfsInMemoryFileSystem.prototype.getFileSystemType = function()
{
	return oFF.XFileSystemType.IN_MEMORY;
};
oFF.MfsInMemoryFileSystem.prototype.isDirectory = function(nativePath)
{
	var currentElement = this.getPathElement(nativePath, 0);
	if (oFF.notNull(currentElement))
	{
		return currentElement.isDirectory();
	}
	else
	{
		return false;
	}
};
oFF.MfsInMemoryFileSystem.prototype.isFile = function(nativePath)
{
	var currentElement = this.getPathElement(nativePath, 0);
	if (oFF.notNull(currentElement))
	{
		return currentElement.isDirectory() === false;
	}
	else
	{
		return false;
	}
};
oFF.MfsInMemoryFileSystem.prototype.isExisting = function(nativePath)
{
	var currentElement = this.getPathElement(nativePath, 0);
	return oFF.notNull(currentElement);
};
oFF.MfsInMemoryFileSystem.prototype.isHidden = function(nativePath)
{
	return false;
};
oFF.MfsInMemoryFileSystem.prototype.mkdir = function(nativePath)
{
	var pathElement = this.getPathElement(nativePath, 1);
	if (oFF.notNull(pathElement) && pathElement.isDirectory())
	{
		var name = this.getLastName(nativePath);
		pathElement.setDirectory(name);
	}
	return null;
};
oFF.MfsInMemoryFileSystem.prototype.mkdirs = function(nativePath)
{
	return null;
};
oFF.MfsInMemoryFileSystem.prototype.getRoots = function()
{
	return this.getChildren("/");
};
oFF.MfsInMemoryFileSystem.prototype.getChildren = function(nativePath)
{
	var currentElement = this.getPathElement(nativePath, 0);
	if (oFF.notNull(currentElement) && currentElement.isDirectory())
	{
		var dir = currentElement;
		return dir.getChildNames();
	}
	else
	{
		return null;
	}
};
oFF.MfsInMemoryFileSystem.prototype.isWriteable = function(nativePath)
{
	return true;
};
oFF.MfsInMemoryFileSystem.prototype.setWritable = function(nativePath, writable, ownerOnly)
{
	return null;
};
oFF.MfsInMemoryFileSystem.prototype.isReadable = function(nativePath)
{
	return true;
};
oFF.MfsInMemoryFileSystem.prototype.isExecutable = function(nativePath)
{
	return false;
};
oFF.MfsInMemoryFileSystem.prototype.getLastModifiedTimestamp = function(nativePath)
{
	return 0;
};
oFF.MfsInMemoryFileSystem.prototype.loadExt = function(nativePath)
{
	var pathElement = this.getPathElement(nativePath, 0);
	if (oFF.notNull(pathElement) && pathElement.isDirectory() === false)
	{
		return pathElement.getContent();
	}
	return null;
};
oFF.MfsInMemoryFileSystem.prototype.loadGzipped = function(nativePath)
{
	return this.loadExt(nativePath);
};
oFF.MfsInMemoryFileSystem.prototype.save = function(nativePath, data)
{
	return null;
};
oFF.MfsInMemoryFileSystem.prototype.saveGzipped = function(nativePath, data)
{
	return null;
};
oFF.MfsInMemoryFileSystem.prototype.deleteFile = function(nativePath)
{
	var pathElement = this.getPathElement(nativePath, 0);
	if (oFF.notNull(pathElement))
	{
		var parent = pathElement.getParent();
		if (oFF.notNull(parent))
		{
			parent.removeChild(pathElement.getName());
			pathElement.releaseObject();
		}
	}
	return null;
};
oFF.MfsInMemoryFileSystem.prototype.renameTo = function(sourceNativePath, destNativePath)
{
	return null;
};
oFF.MfsInMemoryFileSystem.prototype.getLastName = function(nativePath)
{
	var pathNames = this.splitPath(nativePath);
	var name = pathNames.get(pathNames.size() - 1);
	return name;
};
oFF.MfsInMemoryFileSystem.prototype.splitPath = function(nativePath)
{
	var elements = oFF.XStringTokenizer.splitString(nativePath, "/");
	return elements;
};
oFF.MfsInMemoryFileSystem.prototype.getPathElement = function(nativePath, rightOffset)
{
	var elements = this.splitPath(nativePath);
	var currentElement = this.m_root;
	for (var i = 0; i < elements.size() - rightOffset && oFF.notNull(currentElement); i++)
	{
		var name = elements.get(i);
		if (currentElement.isDirectory())
		{
			currentElement = currentElement.getChild(name);
		}
		else
		{
			currentElement = null;
		}
	}
	return currentElement;
};

oFF.PrgFileSystem = function() {};
oFF.PrgFileSystem.prototype = new oFF.DfXFileSystem();
oFF.PrgFileSystem.prototype._ff_c = "PrgFileSystem";

oFF.PrgFileSystem.create = function(session)
{
	var newObj = new oFF.PrgFileSystem();
	newObj.setupSessionContext(session);
	return newObj;
};
oFF.PrgFileSystem.prototype.getFileSystemType = function()
{
	return oFF.XFileSystemType.PRG;
};
oFF.PrgFileSystem.prototype.getCurrentWorkingDirectory = function()
{
	return oFF.XUri.createFromUrl("prg:///");
};
oFF.PrgFileSystem.prototype.isExecutable = function(nativePath)
{
	return this.isExisting(nativePath) && this.isFile(nativePath);
};
oFF.PrgFileSystem.prototype.getFileType = function(file)
{
	if (this.isExecutable(file.getNativePath()))
	{
		return oFF.XFileType.PRG;
	}
	else
	{
		return oFF.DfXFileSystem.prototype.getFileType.call( this , file);
	}
};
oFF.PrgFileSystem.prototype.isExisting = function(nativePath)
{
	if (oFF.XString.isEqual(nativePath, "/"))
	{
		return true;
	}
	else
	{
		var prgName = this.getPrgName(nativePath);
		return oFF.ProgramRegistration.getProgramManifest(prgName) !== null;
	}
};
oFF.PrgFileSystem.prototype.getLastModifiedTimestamp = function(nativePath)
{
	return 0;
};
oFF.PrgFileSystem.prototype.getPrgName = function(nativePath)
{
	var pathElements = oFF.XStringTokenizer.splitString(nativePath, "/");
	return pathElements.get(1);
};
oFF.PrgFileSystem.prototype.isDirectory = function(nativePath)
{
	if (oFF.XString.isEqual(nativePath, "/"))
	{
		return true;
	}
	else
	{
		return false;
	}
};
oFF.PrgFileSystem.prototype.getChildren = function(nativePath)
{
	var children = null;
	if (oFF.XString.isEqual(nativePath, "/"))
	{
		var allEntries = oFF.ProgramRegistration.getAllEntries();
		children = allEntries.getKeysAsReadOnlyListOfString();
	}
	return children;
};
oFF.PrgFileSystem.prototype.processExecute = function(syncType, listener, customIdentifier, file)
{
	var nativePath = file.getNativePath();
	var vfsUri = file.getVfsUri();
	var prgName = this.getPrgName(nativePath);
	var process = this.getSession();
	var startCfg = oFF.ProgramStartCfg.create(process, prgName, null, null);
	var argStructure = oFF.PrFactory.createStructure();
	var queryMap = vfsUri.getQueryMap();
	var keys = queryMap.getKeysAsIteratorOfString();
	while (keys.hasNext())
	{
		var key = keys.next();
		var value = queryMap.getByKey(key);
		argStructure.putString(key, value);
	}
	var argObj = oFF.ProgramArgs.createWithStructure(argStructure);
	startCfg.setArguments(argObj);
	var syncAction = startCfg.processExecution(oFF.SyncType.BLOCKING, null, null);
	var fileContent = oFF.XFileContent.createFileContent();
	var program = syncAction.getData();
	var exitContent = program.getProgramContainer().getExitContent();
	var action = oFF.PrgExecuteAction.create(process, file);
	if (oFF.notNull(exitContent))
	{
		fileContent.setFromContent(exitContent);
		file.setFileContent(fileContent);
	}
	else
	{
		action.addError(oFF.ErrorCodes.INVALID_STATE, oFF.XStringUtils.concatenate2("Execution failed", prgName));
	}
	return action;
};

oFF.VfsElementDir = function() {};
oFF.VfsElementDir.prototype = new oFF.VfsElementNode();
oFF.VfsElementDir.prototype._ff_c = "VfsElementDir";

oFF.VfsElementDir.createDir = function(vfs, name)
{
	var newObj = new oFF.VfsElementDir();
	newObj.setupElement(vfs, name);
	return newObj;
};
oFF.VfsElementDir.prototype.m_children = null;
oFF.VfsElementDir.prototype.setupElement = function(vfs, name)
{
	oFF.VfsElementNode.prototype.setupElement.call( this , vfs, name);
	this.m_children = oFF.XHashMapByString.create();
};
oFF.VfsElementDir.prototype.getComponentType = function()
{
	return oFF.VfsElementType.DIR;
};
oFF.VfsElementDir.prototype.setChild = function(childElement)
{
	childElement.setParent(this);
	this.m_children.put(childElement.getName(), childElement);
};
oFF.VfsElementDir.prototype.getChild = function(name)
{
	return this.m_children.getByKey(name);
};
oFF.VfsElementDir.prototype.isNode = function()
{
	return true;
};
oFF.VfsElementDir.prototype.getChildNames = function()
{
	return this.m_children.getKeysAsReadOnlyListOfString();
};
oFF.VfsElementDir.prototype.isExisting = function(name)
{
	return this.m_children.containsKey(name);
};
oFF.VfsElementDir.prototype.removeChild = function(name)
{
	this.m_children.remove(name);
};

oFF.VfsElementMountPoint = function() {};
oFF.VfsElementMountPoint.prototype = new oFF.VfsElementNode();
oFF.VfsElementMountPoint.prototype._ff_c = "VfsElementMountPoint";

oFF.VfsElementMountPoint.createWithUrl = function(targetUrl)
{
	var target = oFF.XUri.createFromUrl(targetUrl);
	return oFF.VfsElementMountPoint.createWithUri(target);
};
oFF.VfsElementMountPoint.createWithUri = function(target)
{
	var newObj = new oFF.VfsElementMountPoint();
	newObj.setupMountPointLeaf(target);
	return newObj;
};
oFF.VfsElementMountPoint.createWithFile = function(targetFile)
{
	var newObj = new oFF.VfsElementMountPoint();
	newObj.setupMountPointLeaf(targetFile.getVfsUri());
	return newObj;
};
oFF.VfsElementMountPoint.prototype.m_parentPath = null;
oFF.VfsElementMountPoint.prototype.m_target = null;
oFF.VfsElementMountPoint.prototype.m_vfsTarget = null;
oFF.VfsElementMountPoint.prototype.setupMountPointLeaf = function(target)
{
	oFF.VfsElementNode.prototype.setupElement.call( this , null, null);
	if (target.getProtocolType() === oFF.ProtocolType.VFS)
	{
		this.m_vfsTarget = target;
	}
	else
	{
		this.m_target = target;
	}
};
oFF.VfsElementMountPoint.prototype.getComponentType = function()
{
	return oFF.VfsElementType.MOUNT_POINT;
};
oFF.VfsElementMountPoint.prototype.setParentPath = function(path)
{
	this.m_parentPath = path;
};
oFF.VfsElementMountPoint.prototype.getParentPath = function()
{
	return this.m_parentPath;
};
oFF.VfsElementMountPoint.prototype.newFile = function(session, vfsUri)
{
	if (oFF.isNull(this.m_target))
	{
		if (oFF.isNull(this.m_vfsTarget))
		{
			throw oFF.XException.createIllegalStateException("No vfs target is given");
		}
		var vfsFile = oFF.XFile.createExt(session, this.m_vfsTarget.getUrl(), oFF.PathFormat.URL, oFF.VarResolveMode.NONE);
		if (oFF.isNull(vfsFile))
		{
			throw oFF.XException.createRuntimeException("Cannot resolve vfs path");
		}
		this.m_target = vfsFile.getTargetUri();
	}
	var targetFs = session.getFileSystemManager().getFileSystemByUri(this.m_target);
	var targetFile = null;
	if (oFF.notNull(targetFs))
	{
		var vfsPath = vfsUri.getPath();
		var pathOffset = this.getPathOffset();
		var fileTargetUri;
		if (oFF.XString.size(vfsPath) <= pathOffset)
		{
			fileTargetUri = this.m_target;
		}
		else
		{
			var relativePath = oFF.XString.substring(vfsPath, pathOffset, -1);
			fileTargetUri = oFF.XUri.createChild(this.m_target, relativePath);
		}
		targetFile = targetFs.newFile(session, vfsUri, fileTargetUri);
	}
	return targetFile;
};
oFF.VfsElementMountPoint.prototype.isNode = function()
{
	return false;
};
oFF.VfsElementMountPoint.prototype.isExisting = oFF.noSupport;
oFF.VfsElementMountPoint.prototype.getChild = function(name)
{
	return null;
};
oFF.VfsElementMountPoint.prototype.setName = function(name)
{
	this.m_name = name;
};

oFF.VfsFileSystem = function() {};
oFF.VfsFileSystem.prototype = new oFF.DfXFileSystem();
oFF.VfsFileSystem.prototype._ff_c = "VfsFileSystem";

oFF.VfsFileSystem.create = function(session)
{
	var newObj = new oFF.VfsFileSystem();
	newObj.setupSessionContext(session);
	return newObj;
};
oFF.VfsFileSystem.prototype.m_root = null;
oFF.VfsFileSystem.prototype.setupSessionContext = function(session)
{
	oFF.DfXFileSystem.prototype.setupSessionContext.call( this , session);
	this.m_root = oFF.VfsElementDir.createDir(this, "");
};
oFF.VfsFileSystem.prototype.getSubSystemType = function()
{
	return oFF.SubSystemType.FILE_SYSTEM;
};
oFF.VfsFileSystem.prototype.getFileSystemType = function()
{
	return oFF.XFileSystemType.VFS;
};
oFF.VfsFileSystem.prototype.addMountPoint = function(mountPoint, path)
{
	if (oFF.XString.startsWith(path, "/") === false)
	{
		throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate2("Mounting path must start with slash: ", path));
	}
	var pathElements = oFF.XStringTokenizer.splitString(path, "/");
	var size = pathElements.size();
	if (size === 1)
	{
		throw oFF.XException.createIllegalArgumentException("Cannot have mounting point at root");
	}
	var current = this.m_root;
	for (var i = 1; i < size - 1; i++)
	{
		if (current.isLeaf())
		{
			throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate2("Mounting path denotes to a leaf: ", path));
		}
		var folderName = pathElements.get(i);
		var child = current.getChild(folderName);
		if (oFF.isNull(child))
		{
			child = oFF.VfsElementDir.createDir(this, folderName);
			current.setChild(child);
		}
		if (child.getComponentType() === oFF.VfsElementType.DIR)
		{
			current = child;
		}
		else
		{
			this.logError2("Cannot attach mounting point at ", path);
			current = null;
			break;
		}
	}
	if (oFF.notNull(current))
	{
		var name = pathElements.get(size - 1);
		mountPoint.setName(name);
		mountPoint.setVfs(this);
		current.setChild(mountPoint);
	}
};
oFF.VfsFileSystem.prototype.newFile = function(session, vfsUri, targetUri)
{
	var file = null;
	var path = vfsUri.getPath();
	var pathInfo = this.getPathInfo(path);
	if (pathInfo.isInMountingArea())
	{
		file = pathInfo.newFile(session, vfsUri);
	}
	else
	{
		file = oFF.DfXFileSystem.prototype.newFile.call( this , session, vfsUri, targetUri);
	}
	return file;
};
oFF.VfsFileSystem.prototype.isExisting = function(nativePath)
{
	var pathInfo = this.getPathInfo(nativePath);
	return pathInfo.isExisting();
};
oFF.VfsFileSystem.prototype.isDirectory = function(nativePath)
{
	var pathInfo = this.getPathInfo(nativePath);
	return pathInfo.isDirectory();
};
oFF.VfsFileSystem.prototype.isFile = function(nativePath)
{
	var pathInfo = this.getPathInfo(nativePath);
	return pathInfo.isFile();
};
oFF.VfsFileSystem.prototype.getChildren = function(nativePath)
{
	var pathInfo = this.getPathInfo(nativePath);
	return pathInfo.getChildNames();
};
oFF.VfsFileSystem.prototype.saveExt = function(file, content, compression)
{
	var pathInfo = this.getPathInfo(file.getNativePath());
	pathInfo.saveExt(content, compression);
};
oFF.VfsFileSystem.prototype.loadExt2 = function(file, compression)
{
	var pathInfo = this.getPathInfo(file.getNativePath());
	var fileContent = pathInfo.loadExt(compression);
	file.setFileContent(fileContent);
};
oFF.VfsFileSystem.prototype.mkdirExt = function(file, includeParentDirs)
{
	var pathInfo = this.getPathInfo(file.getNativePath());
	pathInfo.mkdirExt(includeParentDirs);
};
oFF.VfsFileSystem.prototype.deleteFileExt = function(file)
{
	var pathInfo = this.getPathInfo(file.getNativePath());
	pathInfo.deleteFile();
};
oFF.VfsFileSystem.prototype.getPathInfo = function(path)
{
	if (oFF.XString.startsWith(path, "/") === false)
	{
		throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate2("File path must start with slash: ", path));
	}
	var pathElements = oFF.XStringTokenizer.splitString(path, "/");
	var size = pathElements.size();
	if (size > 1 && oFF.XStringUtils.isNullOrEmpty(pathElements.get(size - 1)))
	{
		pathElements.removeAt(size - 1);
		size = size - 1;
	}
	var name = pathElements.get(size - 1);
	if (oFF.XStringUtils.isNullOrEmpty(name))
	{
		name = null;
	}
	var element = this.m_root;
	var parentNode = null;
	var lastSeenParentNode = null;
	var lastSeenParentNodeIndex = -1;
	var matchResultType = oFF.VfsMatchResultType.EXACT;
	for (var i = 1; i < size; i++)
	{
		if (oFF.isNull(element))
		{
			parentNode = null;
			break;
		}
		else
		{
			if (element.getComponentType().isTypeOf(oFF.VfsElementType.NODE))
			{
				parentNode = element;
				lastSeenParentNode = parentNode;
				lastSeenParentNodeIndex = i - 1;
			}
			else
			{
				matchResultType = oFF.VfsMatchResultType.ERROR;
				break;
			}
		}
		var childName = pathElements.get(i);
		element = parentNode.getChild(childName);
		if (oFF.isNull(element))
		{
			matchResultType = oFF.VfsMatchResultType.NOT_EXISTENT;
		}
	}
	var info = oFF.VfsPathInfo.create(name, path, pathElements, lastSeenParentNode, lastSeenParentNodeIndex, parentNode, element, matchResultType);
	return info;
};
oFF.VfsFileSystem.prototype.getMainApi = function()
{
	return this;
};
oFF.VfsFileSystem.prototype.getAdminApi = function()
{
	return this;
};

oFF.VfsMatchResultType = function() {};
oFF.VfsMatchResultType.prototype = new oFF.XConstantWithParent();
oFF.VfsMatchResultType.prototype._ff_c = "VfsMatchResultType";

oFF.VfsMatchResultType.ERROR = null;
oFF.VfsMatchResultType.BEYOND = null;
oFF.VfsMatchResultType.EXACT = null;
oFF.VfsMatchResultType.NOT_EXISTENT = null;
oFF.VfsMatchResultType.staticSetup = function()
{
	oFF.VfsMatchResultType.ERROR = oFF.VfsMatchResultType.create("Error", null);
	oFF.VfsMatchResultType.EXACT = oFF.VfsMatchResultType.create("Exact", null);
	oFF.VfsMatchResultType.BEYOND = oFF.VfsMatchResultType.create("Beyond", null);
	oFF.VfsMatchResultType.NOT_EXISTENT = oFF.VfsMatchResultType.create("NotExistent", null);
};
oFF.VfsMatchResultType.create = function(name, parent)
{
	var newObj = oFF.XConstant.setupName(new oFF.VfsMatchResultType(), name);
	newObj.setParent(parent);
	return newObj;
};

oFF.XWebDAV = function() {};
oFF.XWebDAV.prototype = new oFF.DfXFileSystem();
oFF.XWebDAV.prototype._ff_c = "XWebDAV";

oFF.XWebDAV.createWebDav = function(Session, uri)
{
	var newObject = new oFF.XWebDAV();
	newObject.setupExt(Session, uri);
	return newObject;
};
oFF.XWebDAV.prototype.m_uri = null;
oFF.XWebDAV.prototype.m_httpClient = null;
oFF.XWebDAV.prototype.releaseObject = function()
{
	this.m_uri = null;
	this.m_httpClient = oFF.XObjectExt.release(this.m_httpClient);
	oFF.DfXFileSystem.prototype.releaseObject.call( this );
};
oFF.XWebDAV.prototype.setupExt = function(session, uri)
{
	this.setupSessionContext(session);
	this.m_uri = uri;
};
oFF.XWebDAV.prototype.loadExt = function(nativePath)
{
	var request = oFF.HttpRequest.createByUri(this.m_uri);
	this.m_httpClient = request.newHttpClient(this.getSession());
	var extResponse = this.m_httpClient.processHttpRequest(oFF.SyncType.BLOCKING, null, null);
	if (extResponse.isValid())
	{
		return extResponse.getData();
	}
	var fileContent = oFF.XFileContent.createFileContent();
	fileContent.setMessageCollection(extResponse);
	return fileContent;
};
oFF.XWebDAV.prototype.getFileSystemType = function()
{
	return oFF.XFileSystemType.WEBDAV;
};

oFF.ModuleLoadAction = function() {};
oFF.ModuleLoadAction.prototype = new oFF.SyncAction();
oFF.ModuleLoadAction.prototype._ff_c = "ModuleLoadAction";

oFF.ModuleLoadAction.createAndRun = function(syncType, moduleManager, rootModuleNames, loader, listener, customIdentifier)
{
	var newObj = new oFF.ModuleLoadAction();
	newObj.m_rootModuleNames = rootModuleNames;
	newObj.m_loader = loader;
	newObj.setupActionAndRun(syncType, listener, customIdentifier, moduleManager);
	return newObj;
};
oFF.ModuleLoadAction.prototype.m_rootModuleNames = null;
oFF.ModuleLoadAction.prototype.m_alreadyLoadedModules = null;
oFF.ModuleLoadAction.prototype.m_modulesToBeLoaded = null;
oFF.ModuleLoadAction.prototype.m_index = 0;
oFF.ModuleLoadAction.prototype.m_loader = null;
oFF.ModuleLoadAction.prototype.m_needPreparation = false;
oFF.ModuleLoadAction.prototype.setupAction = function(syncType, listener, customIdentifier, context)
{
	oFF.SyncAction.prototype.setupAction.call( this , syncType, listener, customIdentifier, context);
	this.setData(this.m_rootModuleNames);
	this.m_needPreparation = true;
};
oFF.ModuleLoadAction.prototype.getLogLayer = function()
{
	return oFF.OriginLayer.KERNEL;
};
oFF.ModuleLoadAction.prototype.processSynchronization = function(syncType)
{
	if (this.m_needPreparation === true)
	{
		this.prepareDefinitions();
		this.m_needPreparation = false;
		if (oFF.isNull(this.m_loader))
		{
			this.addErrorExt(oFF.OriginLayer.KERNEL, 0, "No module loader available", null);
		}
	}
	var continueWork = true;
	if (this.m_index >= this.m_modulesToBeLoaded.size() || this.hasErrors())
	{
		this.endSync();
		continueWork = false;
	}
	else
	{
		var moduleDef = this.m_modulesToBeLoaded.get(this.m_index);
		this.log2("Loading module: ", moduleDef.getName());
		this.m_index++;
		this.m_loader.processModuleLoad(this.getSession(), moduleDef, this, oFF.XApiVersion.GIT_COMMIT_ID);
	}
	return continueWork;
};
oFF.ModuleLoadAction.prototype.prepareDefinitions = function()
{
	var loadedModuleNames = oFF.DfModule.getLoadedModuleNames();
	this.m_alreadyLoadedModules = oFF.XStringTokenizer.splitString(loadedModuleNames, ",");
	this.m_modulesToBeLoaded = oFF.XList.create();
	for (var i = 0; i < this.m_rootModuleNames.size(); i++)
	{
		var moduleName = this.m_rootModuleNames.get(i);
		this.collectRecursive(moduleName);
	}
	if (this.m_modulesToBeLoaded.size() > 0)
	{
		this.log2("Modules to be loaded: ", this.m_modulesToBeLoaded.toString());
	}
};
oFF.ModuleLoadAction.prototype.collectRecursive = function(name)
{
	if (this.m_alreadyLoadedModules.contains(name) === false)
	{
		var module = oFF.ModuleManager.getModuleDef(name);
		if (oFF.isNull(module))
		{
			this.addErrorExt(oFF.OriginLayer.KERNEL, 2, oFF.XStringUtils.concatenate2("Cannot find module: ", name), null);
		}
		else
		{
			if (this.m_modulesToBeLoaded.contains(module) === false)
			{
				var dependencies = module.getDependencies();
				for (var i = 0; i < dependencies.size(); i++)
				{
					var subModuleName = dependencies.get(i);
					this.collectRecursive(subModuleName);
				}
				if (module.getModuleInitClazzNameCompatible() !== null)
				{
					this.m_modulesToBeLoaded.add(module);
				}
			}
		}
	}
};
oFF.ModuleLoadAction.prototype.onModuleLoaded = function(messages, moduleName, hasBeenLoaded)
{
	if (oFF.notNull(messages))
	{
		this.addAllMessages(messages);
	}
	this.processSynchronization(this.getActiveSyncType());
};
oFF.ModuleLoadAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onModuleLoadedMulti(extResult, data, customIdentifier);
};

oFF.ServerMetadataAction = function() {};
oFF.ServerMetadataAction.prototype = new oFF.SyncAction();
oFF.ServerMetadataAction.prototype._ff_c = "ServerMetadataAction";

oFF.ServerMetadataAction.create = function(syncType, connectionContainer, listener, customIdentifier, isKeepAlive)
{
	var object = new oFF.ServerMetadataAction();
	object.m_isKeepAlive = isKeepAlive;
	object.setupAction(syncType, listener, customIdentifier, connectionContainer);
	return object;
};
oFF.ServerMetadataAction.prototype.m_serverMetadata = null;
oFF.ServerMetadataAction.prototype.m_logonAction = null;
oFF.ServerMetadataAction.prototype.m_isKeepAlive = false;
oFF.ServerMetadataAction.prototype.releaseObject = function()
{
	this.m_serverMetadata = null;
	this.m_logonAction = oFF.XObjectExt.release(this.m_logonAction);
	oFF.SyncAction.prototype.releaseObject.call( this );
};
oFF.ServerMetadataAction.prototype.processSynchronization = function(syncType)
{
	var connection = this.getActionContext();
	if (oFF.isNull(connection) || connection.hasErrors())
	{
		return false;
	}
	var systemDescription = connection.getSystemDescription();
	var protocolType = systemDescription.getProtocolType();
	if (protocolType !== oFF.ProtocolType.FILE)
	{
		var path = systemDescription.getSystemType().getServerInfoPath();
		if (oFF.notNull(path))
		{
			var tmpRpcFunction = connection.newRpcFunction(path);
			tmpRpcFunction.setIsServerMetadataCall(true);
			tmpRpcFunction.setIsKeepAliveCall(this.m_isKeepAlive);
			var request = tmpRpcFunction.getRpcRequest();
			request.setMethod(oFF.HttpRequestMethod.HTTP_GET);
			request.setRequestType(oFF.RpcRequestType.SERVER_METADATA);
			if (this.m_isKeepAlive && !systemDescription.getSystemType().isTypeOf(oFF.SystemType.ABAP))
			{
				request.getAdditionalParameters().put(oFF.ConnectionConstants.KEEP_ALIVE_PARAM, "true");
			}
			tmpRpcFunction.processFunctionExecution(syncType, this, null);
			return true;
		}
	}
	this.m_serverMetadata = oFF.ServerMetadata.create(this.getSession(), null, systemDescription);
	this.setData(this.m_serverMetadata);
	return false;
};
oFF.ServerMetadataAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	var connection = this.getActionContext();
	var rootStructure = null;
	if (oFF.notNull(response))
	{
		rootStructure = response.getRootElement();
	}
	if (extResult.isValid())
	{
		if (oFF.isNull(rootStructure))
		{
			this.addError(oFF.ErrorCodes.INVALID_SERVER_METADATA_JSON, "Server metadata was not a structure json");
		}
		else
		{
			oFF.InAHelper.importMessages(rootStructure, this);
			if (this.isValid())
			{
				this.m_serverMetadata = oFF.ServerMetadata.create(this.getSession(), rootStructure, connection.getSystemDescription());
				if (!this.getSession().hasFeature(oFF.FeatureToggleOlap.SERVER_METADATA_VIA_SYSTEM_CONNECT))
				{
					connection.setReentranceTicket(this.m_serverMetadata.getReentranceTicket());
					var inaMetadata = this.m_serverMetadata.getMetadataForService(oFF.ServerService.INA);
					if (oFF.notNull(inaMetadata))
					{
						var batchCapability = inaMetadata.getByKey(oFF.ConnectionConstants.INA_CAPABILITY_SUPPORTS_BATCH);
						if (oFF.notNull(batchCapability))
						{
							var analyticsMetadata = this.m_serverMetadata.getMetadataForService(oFF.ServerService.ANALYTIC);
							var batchRsStreaming = oFF.notNull(analyticsMetadata) && analyticsMetadata.containsKey(oFF.ConnectionConstants.INA_CAPABILITY_SUPPORTS_BATCH_RS_STREAMING);
							connection.setSupportsBatchMode(true, batchRsStreaming, batchCapability.getValue());
							var xxlWSCapability = oFF.isNull(analyticsMetadata) ? null : analyticsMetadata.getByKey(oFF.ConnectionConstants.INA_FASTPATH_XXL_WS);
							if (oFF.notNull(xxlWSCapability))
							{
								connection.setWebServicePathForBLOBs(xxlWSCapability.getValue());
							}
						}
					}
				}
				if (oFF.notNull(this.m_logonAction))
				{
					this.importLogonMetadata();
					if (!this.getSession().hasFeature(oFF.FeatureToggleOlap.SERVER_METADATA_VIA_SYSTEM_CONNECT))
					{
						var personalizationForSystem = connection.getUserManager().getConnectionPersonalization(connection.getSystemName());
						personalizationForSystem.setTenantId(this.m_serverMetadata.getTenantId());
						personalizationForSystem.setInternalUser(this.m_serverMetadata.getOrcaUserName());
					}
				}
				var updateSystemConnect = !this.m_isKeepAlive || !rootStructure.isEmpty();
				if (updateSystemConnect)
				{
					var systemConnect = connection.getSystemConnect();
					systemConnect.setServerMetadata(this.m_serverMetadata);
				}
				this.setData(this.m_serverMetadata);
			}
		}
		this.endSync();
	}
	else
	{
		var containsCode = extResult.containsCode(oFF.Severity.ERROR, oFF.HttpStatusCode.SC_FORBIDDDEN);
		if (containsCode && connection.getCsrfRequiredCount() > 0 && connection.getCsrfRequiredCount() < 10)
		{
			this.processSynchronization(this.getActiveSyncType());
		}
		else
		{
			if (oFF.notNull(rootStructure))
			{
				this.importInaMessages(rootStructure);
			}
			this.endSync();
		}
	}
};
oFF.ServerMetadataAction.prototype.importLogonMetadata = function()
{
	this.m_serverMetadata.addLogonInfo(this.m_logonAction.getData().getRootElement());
};
oFF.ServerMetadataAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onServerMetadataLoaded(extResult, data, customIdentifier);
};
oFF.ServerMetadataAction.prototype.importInaMessages = function(inaStructure)
{
	var inaMessages = inaStructure.getListByKey(oFF.InAConstantsBios.QY_MESSAGES);
	if (oFF.notNull(inaMessages))
	{
		var messageSize = inaMessages.size();
		var message = oFF.XStringBuffer.create();
		for (var i = 0; i < messageSize; i++)
		{
			var inaMessage = inaMessages.getStructureAt(i);
			message.append(inaMessage.getStringByKey(oFF.InAConstantsBios.QY_TEXT));
			var messageClass = inaMessage.getStringByKey(oFF.InAConstantsBios.QY_MESSAGE_CLASS);
			if (oFF.notNull(messageClass))
			{
				message.append("; MsgClass: ").append(messageClass);
			}
			var code = inaMessage.getIntegerByKeyExt(oFF.InAConstantsBios.QY_NUMBER, 0);
			var type = inaMessage.getIntegerByKeyExt(oFF.InAConstantsBios.QY_TYPE, 0);
			if (type === oFF.InAConstantsBios.VA_SEVERITY_INFO)
			{
				this.addInfoExt(oFF.OriginLayer.SERVER, code, message.toString());
			}
			else if (type === oFF.InAConstantsBios.VA_SEVERITY_WARNING)
			{
				this.addWarningExt(oFF.OriginLayer.SERVER, code, message.toString());
			}
			else if (type === oFF.InAConstantsBios.VA_SEVERITY_ERROR)
			{
				this.addErrorExt(oFF.OriginLayer.SERVER, code, message.toString(), null);
			}
			else if (type === oFF.InAConstantsBios.VA_SEVERITY_SEMANTICAL_ERROR)
			{
				this.addSemanticalError(oFF.OriginLayer.SERVER, code, message.toString());
			}
			message.clear();
		}
	}
};
oFF.ServerMetadataAction.prototype.setLogonAction = function(logonAction)
{
	this.m_logonAction = logonAction;
};

oFF.ServerCallAction = function() {};
oFF.ServerCallAction.prototype = new oFF.SyncAction();
oFF.ServerCallAction.prototype._ff_c = "ServerCallAction";

oFF.ServerCallAction.prototype.m_rpcFunction = null;
oFF.ServerCallAction.prototype.m_httpRequestMethod = null;
oFF.ServerCallAction.prototype.releaseObject = function()
{
	oFF.XObjectExt.release(this.m_rpcFunction);
	oFF.SyncAction.prototype.releaseObject.call( this );
};
oFF.ServerCallAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	this.setData(response);
	this.onFunctionExecutedInternal(extResult, response, customIdentifier);
	this.endSync();
};
oFF.ServerCallAction.prototype.processSynchronization = function(syncType)
{
	var connection = this.getActionContext();
	var uri = this.getUri(connection);
	this.m_rpcFunction = connection.newRpcFunctionByUri(uri);
	var request = this.m_rpcFunction.getRpcRequest();
	var method = oFF.notNull(this.m_httpRequestMethod) ? this.m_httpRequestMethod : oFF.HttpRequestMethod.HTTP_GET;
	request.setMethod(method);
	var requestType = this.getRequestType();
	if (oFF.notNull(requestType))
	{
		request.setRequestType(requestType);
	}
	this.m_rpcFunction.processFunctionExecution(syncType, this, null);
	return true;
};
oFF.ServerCallAction.prototype.onFunctionExecutedInternal = function(extResult, response, customIdentifier) {};
oFF.ServerCallAction.prototype.setHttpRequestMethod = function(httpRequestMethod)
{
	this.m_httpRequestMethod = httpRequestMethod;
};
oFF.ServerCallAction.prototype.getRequestType = function()
{
	return null;
};

oFF.ServerOptionsCallAction = function() {};
oFF.ServerOptionsCallAction.prototype = new oFF.SyncAction();
oFF.ServerOptionsCallAction.prototype._ff_c = "ServerOptionsCallAction";

oFF.ServerOptionsCallAction.createAndRun = function(syncType, context, listener, customIdentifier, url, properties)
{
	var action = new oFF.ServerOptionsCallAction();
	action.m_url = url;
	action.m_properties = properties;
	action.setupActionAndRun(syncType, listener, customIdentifier, context);
	return action;
};
oFF.ServerOptionsCallAction.prototype.m_url = null;
oFF.ServerOptionsCallAction.prototype.m_properties = null;
oFF.ServerOptionsCallAction.prototype.processSynchronization = function(syncType)
{
	var httpRequest = oFF.HttpRequest.create();
	var actionContext = this.getActionContext();
	oFF.XConnectHelper.copyConnectionCore(actionContext.getSystemDescription(), httpRequest);
	var uri = oFF.XUri.createFromUrl(this.m_url);
	if (uri.isRelativeUri())
	{
		httpRequest.setPath(uri.getPath());
		httpRequest.setQuery(uri.getQuery());
		httpRequest.setFragment(uri.getFragment());
	}
	else
	{
		httpRequest.setUrlString(this.m_url);
	}
	httpRequest.setMethod(oFF.HttpRequestMethod.HTTP_OPTIONS);
	var headers = httpRequest.getHeaderFieldsBase();
	if (oFF.XCollectionUtils.hasElements(this.m_properties.getHeaders()))
	{
		headers.put("Access-Control-Request-Headers", oFF.XCollectionUtils.join(this.m_properties.getHeaders(), ","));
	}
	var origin = this.m_properties.getOrigin();
	if (oFF.isNull(origin))
	{
		origin = this.getOriginFromLocation();
	}
	if (oFF.notNull(origin))
	{
		headers.put("origin", origin);
	}
	headers.put("Access-Control-Request-Method", this.m_properties.getMethod().getName());
	var httpClient = httpRequest.newHttpClient(this.getSession());
	httpClient.processHttpRequest(syncType, this, null);
	return true;
};
oFF.ServerOptionsCallAction.prototype.getOriginFromLocation = function()
{
	var origin = null;
	var location = oFF.NetworkEnv.getLocation();
	if (oFF.notNull(location))
	{
		var scheme = location.getScheme();
		var host = location.getHost();
		origin = oFF.XStringUtils.concatenate3(scheme, "://", host);
	}
	return origin;
};
oFF.ServerOptionsCallAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onOptionCallExecuted(extResult, data, customIdentifier);
};
oFF.ServerOptionsCallAction.prototype.onHttpResponse = function(extResult, response, customIdentifier)
{
	this.copyAllMessages(extResult);
	var result = oFF.HttpOptionCallResult.create();
	var headers = response.getHeaderFields();
	result.setStatusCode(response.getStatusCode());
	var allowHeadersString = headers.getStringByKey("access-control-allow-headers");
	if (oFF.XStringUtils.isNotNullAndNotEmpty(allowHeadersString))
	{
		var listOfString = oFF.XStringTokenizer.splitString(allowHeadersString, ",");
		result.getAccessControlAllowHeaders().addAll(listOfString);
	}
	result.setAccessControlAllowOrigin(headers.getStringByKey("access-control-allow-origin"));
	result.setAccessControlMaxAge(headers.getIntegerByKeyExt("access-control-max-age", 0));
	var exposeHeadersString = headers.getStringByKey("access-control-expose-headers");
	if (oFF.XStringUtils.isNotNullAndNotEmpty(exposeHeadersString))
	{
		var exposeHeadersParts = oFF.XStringTokenizer.splitString(exposeHeadersString, ",");
		result.getAccessControlExposeHeaders().addAll(exposeHeadersParts);
	}
	var allowMethodsString = headers.getStringByKey("access-control-allow-methods");
	if (oFF.XStringUtils.isNotNullAndNotEmpty(allowMethodsString))
	{
		var iterator = oFF.XStringTokenizer.splitString(allowMethodsString, ",").getIterator();
		while (iterator.hasNext())
		{
			var methodString = iterator.next();
			var requestMethod = oFF.HttpRequestMethod.lookup(methodString);
			if (oFF.notNull(requestMethod))
			{
				result.getAccessControlAllowMethods().add(requestMethod);
			}
		}
	}
	this.setData(result);
};

oFF.SubSysLandscapeBootstrapPrg = function() {};
oFF.SubSysLandscapeBootstrapPrg.prototype = new oFF.DfProgramSubSys();
oFF.SubSysLandscapeBootstrapPrg.prototype._ff_c = "SubSysLandscapeBootstrapPrg";

oFF.SubSysLandscapeBootstrapPrg.DEFAULT_PROGRAM_NAME = "@SubSys.BootstrapLandscape";
oFF.SubSysLandscapeBootstrapPrg.prototype.newProgram = function()
{
	var prg = new oFF.SubSysLandscapeBootstrapPrg();
	prg.setup();
	return prg;
};
oFF.SubSysLandscapeBootstrapPrg.prototype.setup = function()
{
	oFF.DfProgramSubSys.prototype.setup.call( this );
};
oFF.SubSysLandscapeBootstrapPrg.prototype.getSubSystemType = function()
{
	return oFF.SubSystemType.BOOTSTRAP_LANDSCAPE;
};
oFF.SubSysLandscapeBootstrapPrg.prototype.runProcess = function()
{
	this.activateSubSystem(null, oFF.SubSystemStatus.ACTIVE);
	return false;
};
oFF.SubSysLandscapeBootstrapPrg.prototype.getMainApi = function()
{
	return null;
};

oFF.SubSysSystemLandscapePrg = function() {};
oFF.SubSysSystemLandscapePrg.prototype = new oFF.DfProgramSubSys();
oFF.SubSysSystemLandscapePrg.prototype._ff_c = "SubSysSystemLandscapePrg";

oFF.SubSysSystemLandscapePrg.DEFAULT_PROGRAM_NAME = "@SubSys.SystemLandscape";
oFF.SubSysSystemLandscapePrg.prototype.m_systemLandscape = null;
oFF.SubSysSystemLandscapePrg.prototype.m_landscapeLoadAction = null;
oFF.SubSysSystemLandscapePrg.prototype.newProgram = function()
{
	var prg = new oFF.SubSysSystemLandscapePrg();
	prg.setup();
	return prg;
};
oFF.SubSysSystemLandscapePrg.prototype.setup = function()
{
	oFF.DfProgramSubSys.prototype.setup.call( this );
	this.m_systemLandscape = oFF.StandaloneSystemLandscape.create(this);
};
oFF.SubSysSystemLandscapePrg.prototype.getSubSystemType = function()
{
	return oFF.SubSystemType.SYSTEM_LANDSCAPE;
};
oFF.SubSysSystemLandscapePrg.prototype.runProcess = function()
{
	var environment = this.getProcess().getEnvironment();
	var systemLandscapeUrl = environment.getVariable(oFF.XEnvironmentConstants.SYSTEM_LANDSCAPE_URI);
	var doCont;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(systemLandscapeUrl))
	{
		var uri = oFF.XUri.createFromFileSystemPath(this.getProcess(), systemLandscapeUrl, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
		this.m_landscapeLoadAction = oFF.SystemLandscapeLoadAction.createAndRun(null, this, null, this, this.m_systemLandscape, null, uri);
		doCont = true;
	}
	else
	{
		this.onLandscapeNodeLoaded(oFF.SyncActionExtRes.createSyncAction(this.m_systemLandscape, null), this.m_systemLandscape, null);
		doCont = false;
	}
	return doCont;
};
oFF.SubSysSystemLandscapePrg.prototype.onLandscapeNodeLoaded = function(extResult, landscape, customIdentifier)
{
	if (oFF.notNull(extResult) && extResult.isValid())
	{
		this.activateSubSystem(extResult, oFF.SubSystemStatus.ACTIVE);
	}
	else
	{
		this.activateSubSystem(extResult, oFF.SubSystemStatus.INACTIVE);
	}
};
oFF.SubSysSystemLandscapePrg.prototype.getMainApi = function()
{
	return this.m_systemLandscape;
};

oFF.SystemDescription = function() {};
oFF.SystemDescription.prototype = new oFF.XObjectExt();
oFF.SystemDescription.prototype._ff_c = "SystemDescription";

oFF.SystemDescription.create = function(systemLandscape, name, properties)
{
	return oFF.SystemDescription.createExt(null, systemLandscape, name, properties);
};
oFF.SystemDescription.createExt = function(session, systemLandscape, name, properties)
{
	var systemDescription = new oFF.SystemDescription();
	systemDescription.setupExt(systemLandscape, name, properties, null);
	return systemDescription;
};
oFF.SystemDescription.createByUri = function(systemLandscape, name, uri)
{
	var systemDescription = new oFF.SystemDescription();
	systemDescription.setupExt(systemLandscape, name, null, uri);
	return systemDescription;
};
oFF.SystemDescription.createByUriExt = function(session, systemLandscape, name, uri)
{
	var systemDescription = new oFF.SystemDescription();
	systemDescription.setupExt(systemLandscape, name, null, uri);
	return systemDescription;
};
oFF.SystemDescription.prototype.m_landscape = null;
oFF.SystemDescription.prototype.m_connectionProperties = null;
oFF.SystemDescription.prototype.m_contexts = null;
oFF.SystemDescription.prototype.m_systemMappings = null;
oFF.SystemDescription.prototype.m_sysModCounter = 0;
oFF.SystemDescription.prototype.m_nativeConnection = null;
oFF.SystemDescription.prototype.m_capabilitiesWhitelist = null;
oFF.SystemDescription.prototype.m_capabilitiesBlacklist = null;
oFF.SystemDescription.prototype.m_hashedTags = null;
oFF.SystemDescription.prototype.setupExt = function(systemLandscape, name, properties, uri)
{
	if (oFF.notNull(systemLandscape))
	{
		this.m_landscape = oFF.XWeakReferenceUtil.getWeakRef(systemLandscape);
	}
	this.m_connectionProperties = oFF.XProperties.create();
	this.m_systemMappings = oFF.XHashMapByString.create();
	var theUri = uri;
	if (oFF.notNull(properties))
	{
		var propertyIterator = properties.getKeysAsIteratorOfString();
		while (propertyIterator.hasNext())
		{
			var propertyKey = propertyIterator.next();
			var propertyValue = properties.getByKey(propertyKey);
			if (oFF.XString.startsWith(propertyKey, oFF.ConnectionParameters.MAPPING_SYSTEM_NAME))
			{
				var mappingId = oFF.XString.replace(propertyKey, oFF.ConnectionParameters.MAPPING_SYSTEM_NAME, "");
				var serializeTable = properties.getByKey(oFF.XStringUtils.concatenate2(oFF.ConnectionParameters.MAPPING_SERIALIZATION_TABLE, mappingId));
				var serializeSchema = properties.getByKey(oFF.XStringUtils.concatenate2(oFF.ConnectionParameters.MAPPING_SERIALIZATION_SCHEMA, mappingId));
				var deserializeTable = properties.getByKey(oFF.XStringUtils.concatenate2(oFF.ConnectionParameters.MAPPING_DESERIALIZATION_TABLE, mappingId));
				var deserializeSchema = properties.getByKey(oFF.XStringUtils.concatenate2(oFF.ConnectionParameters.MAPPING_DESERIALIZATION_SCHEMA, mappingId));
				this.m_systemMappings.put(propertyValue, oFF.SystemMapping.create(serializeTable, serializeSchema, deserializeTable, deserializeSchema));
			}
			this.setProperty(propertyKey, propertyValue);
		}
		var urlParameter = oFF.ConnectionParameters.URL;
		if (oFF.notNull(systemLandscape))
		{
			if (systemLandscape.enforceUseSecure())
			{
				urlParameter = oFF.ConnectionParameters.SECURE;
			}
		}
		var url = this.getProperties().getStringByKeyExt(urlParameter, null);
		if (oFF.notNull(url))
		{
			oFF.XObjectExt.assertNull(theUri);
			theUri = oFF.XUri.createFromUrl(url);
		}
	}
	if (oFF.notNull(theUri))
	{
		this.setUri(theUri);
	}
	if (oFF.notNull(name))
	{
		this.setSystemName(name);
	}
	this.m_capabilitiesWhitelist = oFF.XHashMapByString.create();
	this.m_capabilitiesBlacklist = oFF.XHashMapByString.create();
	this.m_nativeConnection = null;
	this.m_sysModCounter = 1;
};
oFF.SystemDescription.prototype.setUri = function(uri)
{
	if (oFF.notNull(uri))
	{
		if (this.m_connectionProperties.containsKey(oFF.ConnectionParameters.PROTOCOL) === false)
		{
			this.setProtocolType(uri.getProtocolType());
		}
		if (this.m_connectionProperties.containsKey(oFF.ConnectionParameters.HOST) === false)
		{
			this.setHost(uri.getHost());
		}
		if (this.m_connectionProperties.containsKey(oFF.ConnectionParameters.PORT) === false)
		{
			this.setPort(uri.getPort());
		}
		if (this.m_connectionProperties.containsKey(oFF.ConnectionParameters.PATH) === false)
		{
			this.setPath(uri.getPath());
		}
		var authenticationType = uri.getAuthenticationType();
		if (oFF.notNull(authenticationType))
		{
			this.setAuthenticationType(authenticationType);
		}
		if (uri.getUser() !== null)
		{
			this.setUser(uri.getUser());
		}
		if (uri.getPassword() !== null)
		{
			this.setPassword(uri.getPassword());
		}
		var queryElements = uri.getQueryElements();
		var size = queryElements.size();
		for (var i = 0; i < size; i++)
		{
			var nameValuePair = queryElements.get(i);
			var key = oFF.XString.toUpperCase(nameValuePair.getName());
			var value = nameValuePair.getValue();
			this.setProperty(key, value);
		}
	}
};
oFF.SystemDescription.prototype.releaseObject = function()
{
	this.m_sysModCounter = 0;
	this.m_landscape = oFF.XObjectExt.release(this.m_landscape);
	this.m_systemMappings = oFF.XObjectExt.release(this.m_systemMappings);
	this.m_connectionProperties = null;
	this.m_capabilitiesWhitelist = oFF.XObjectExt.release(this.m_capabilitiesWhitelist);
	this.m_capabilitiesBlacklist = oFF.XObjectExt.release(this.m_capabilitiesBlacklist);
	this.m_nativeConnection = null;
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.SystemDescription.prototype.getComponentType = function()
{
	return oFF.KernelComponentType.SYSTEM_DESCRIPTION;
};
oFF.SystemDescription.prototype.setFromPersonalization = function(personalization)
{
	oFF.XConnectHelper.copyConnectionPersonalization(personalization, this);
};
oFF.SystemDescription.prototype.setFromConnectionInfo = function(origin)
{
	oFF.XConnectHelper.copyConnectionInfo(origin, this);
};
oFF.SystemDescription.prototype.setFromConnection = function(connection)
{
	oFF.XConnectHelper.copyConnection(connection, this);
};
oFF.SystemDescription.prototype.isNode = function()
{
	return false;
};
oFF.SystemDescription.prototype.isLeaf = function()
{
	return true;
};
oFF.SystemDescription.prototype.getHost = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.HOST);
};
oFF.SystemDescription.prototype.getLandscape = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_landscape);
};
oFF.SystemDescription.prototype.getPassword = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.PASSWORD);
};
oFF.SystemDescription.prototype.getUser = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.USER);
};
oFF.SystemDescription.prototype.getOrganizationToken = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.ORGANIZATION_TOKEN);
};
oFF.SystemDescription.prototype.setOrganizationToken = function(organizationToken)
{
	this.setProperty(oFF.ConnectionParameters.ORGANIZATION_TOKEN, organizationToken);
};
oFF.SystemDescription.prototype.getElementToken = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.ELEMENT_TOKEN);
};
oFF.SystemDescription.prototype.setElementToken = function(elementToken)
{
	this.setProperty(oFF.ConnectionParameters.ELEMENT_TOKEN, elementToken);
};
oFF.SystemDescription.prototype.getUserToken = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.USER_TOKEN);
};
oFF.SystemDescription.prototype.setUserToken = function(userToken)
{
	this.setProperty(oFF.ConnectionParameters.USER_TOKEN, userToken);
};
oFF.SystemDescription.prototype.getTenantId = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.TENANT_ID);
};
oFF.SystemDescription.prototype.setTenantId = function(tenantId)
{
	this.setProperty(oFF.ConnectionParameters.TENANT_ID, tenantId);
};
oFF.SystemDescription.prototype.getInternalUser = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.INTERNAL_USER);
};
oFF.SystemDescription.prototype.setInternalUser = function(user)
{
	this.setProperty(oFF.ConnectionParameters.INTERNAL_USER, user);
};
oFF.SystemDescription.prototype.getX509Certificate = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.X509CERTIFICATE);
};
oFF.SystemDescription.prototype.setX509Certificate = function(x509Certificate)
{
	this.setProperty(oFF.ConnectionParameters.X509CERTIFICATE, x509Certificate);
};
oFF.SystemDescription.prototype.getSecureLoginProfile = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.SECURE_LOGIN_PROFILE);
};
oFF.SystemDescription.prototype.setSecureLoginProfile = function(secureLoginProfile)
{
	this.setProperty(oFF.ConnectionParameters.SECURE_LOGIN_PROFILE, secureLoginProfile);
};
oFF.SystemDescription.prototype.getLanguage = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.LANGUAGE);
};
oFF.SystemDescription.prototype.setLanguage = function(language)
{
	if (oFF.isNull(language))
	{
		this.m_connectionProperties.remove(oFF.ConnectionParameters.LANGUAGE);
	}
	else
	{
		this.m_connectionProperties.put(oFF.ConnectionParameters.LANGUAGE, language);
	}
};
oFF.SystemDescription.prototype.setEqsRewritings = function(patterns)
{
	this.m_connectionProperties.putString(oFF.ConnectionParameters.EQS_PATTERNS, patterns);
};
oFF.SystemDescription.prototype.getEqsRewritings = function()
{
	var eqsPatterns = this.m_connectionProperties.getStringByKey(oFF.ConnectionParameters.EQS_PATTERNS);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(eqsPatterns))
	{
		var list = oFF.XList.create();
		var expressions = oFF.XStringTokenizer.splitString(eqsPatterns, ";");
		for (var i = 0; i < expressions.size(); i++)
		{
			var singleExpr = expressions.get(i);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(singleExpr))
			{
				var nameValueExpr = oFF.XStringTokenizer.splitString(singleExpr, "=>");
				if (nameValueExpr.size() === 2)
				{
					var theName = nameValueExpr.get(0);
					var theValue = nameValueExpr.get(1);
					list.add(oFF.XNameValuePair.create(theName, theValue));
				}
			}
		}
		return list;
	}
	else
	{
		return null;
	}
};
oFF.SystemDescription.prototype.getAuthenticationType = function()
{
	var type = null;
	var value = this.m_connectionProperties.getByKey(oFF.ConnectionParameters.AUTHENTICATION_TYPE);
	if (oFF.notNull(value))
	{
		type = oFF.AuthenticationType.lookup(value);
	}
	if (oFF.isNull(type))
	{
		type = oFF.AuthenticationType.NONE;
	}
	return type;
};
oFF.SystemDescription.prototype.setAuthenticationType = function(type)
{
	this.setProperty(oFF.ConnectionParameters.AUTHENTICATION_TYPE, type.getName());
};
oFF.SystemDescription.prototype.setHost = function(host)
{
	this.setProperty(oFF.ConnectionParameters.HOST, host);
};
oFF.SystemDescription.prototype.setPassword = function(password)
{
	this.setProperty(oFF.ConnectionParameters.PASSWORD, password);
};
oFF.SystemDescription.prototype.setAuthenticationToken = function(token)
{
	this.setProperty(oFF.ConnectionParameters.TOKEN_VALUE, token.getAccessToken());
};
oFF.SystemDescription.prototype.getAuthenticationToken = function()
{
	var value = this.m_connectionProperties.getByKey(oFF.ConnectionParameters.TOKEN_VALUE);
	return oFF.XAuthenticationToken.create(value);
};
oFF.SystemDescription.prototype.setAccessToken = function(token)
{
	this.setProperty(oFF.ConnectionParameters.TOKEN_VALUE, token);
};
oFF.SystemDescription.prototype.getAccessToken = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.TOKEN_VALUE);
};
oFF.SystemDescription.prototype.setPort = function(port)
{
	var value = oFF.XInteger.convertToString(port);
	this.setProperty(oFF.ConnectionParameters.PORT, value);
};
oFF.SystemDescription.prototype.getPort = function()
{
	var value = this.m_connectionProperties.getByKey(oFF.ConnectionParameters.PORT);
	var defaultPort = 0;
	var internetProtocolType = this.getProtocolType();
	if (oFF.ProtocolType.HTTP === internetProtocolType)
	{
		defaultPort = 80;
	}
	else if (oFF.ProtocolType.HTTPS === internetProtocolType)
	{
		defaultPort = 443;
	}
	return oFF.XInteger.convertFromStringWithDefault(value, defaultPort);
};
oFF.SystemDescription.prototype.getPath = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.PATH);
};
oFF.SystemDescription.prototype.normalizePath = oFF.noSupport;
oFF.SystemDescription.prototype.getFileName = oFF.noSupport;
oFF.SystemDescription.prototype.getParentPath = oFF.noSupport;
oFF.SystemDescription.prototype.setPath = function(path)
{
	this.setProperty(oFF.ConnectionParameters.PATH, path);
};
oFF.SystemDescription.prototype.getClient = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.CLIENT);
};
oFF.SystemDescription.prototype.setClient = function(client)
{
	this.setProperty(oFF.ConnectionParameters.CLIENT, client);
};
oFF.SystemDescription.prototype.getOemApplicationId = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.OEM_APPLICATION_ID);
};
oFF.SystemDescription.prototype.setOemApplicationId = function(oemApplicationId)
{
	this.setProperty(oFF.ConnectionParameters.OEM_APPLICATION_ID, oemApplicationId);
};
oFF.SystemDescription.prototype.setUser = function(user)
{
	this.setProperty(oFF.ConnectionParameters.USER, user);
};
oFF.SystemDescription.prototype.getTimeout = function()
{
	return this.m_connectionProperties.getIntegerByKeyExt(oFF.ConnectionParameters.TIMEOUT, -1);
};
oFF.SystemDescription.prototype.setTimeout = function(milliseconds)
{
	var value = oFF.XInteger.convertToString(milliseconds);
	this.setProperty(oFF.ConnectionParameters.TIMEOUT, value);
};
oFF.SystemDescription.prototype.getScheme = function()
{
	return this.getProtocolType().getName();
};
oFF.SystemDescription.prototype.getProtocolType = function()
{
	var typeValue = this.m_connectionProperties.getByKey(oFF.ConnectionParameters.PROTOCOL);
	return oFF.isNull(typeValue) ? oFF.ProtocolType.HTTP : oFF.ProtocolType.lookup(typeValue);
};
oFF.SystemDescription.prototype.setScheme = function(scheme)
{
	this.setProperty(oFF.ConnectionParameters.PROTOCOL, scheme);
};
oFF.SystemDescription.prototype.setProtocolType = function(type)
{
	this.setProperty(oFF.ConnectionParameters.PROTOCOL, oFF.isNull(type) ? null : type.getName());
};
oFF.SystemDescription.prototype.isContextIdRequired = function()
{
	var systemType = this.getSystemType();
	var isContextIdRequiredDefault = systemType.isContextIdRequired();
	return this.m_connectionProperties.getBooleanByKeyExt(oFF.ConnectionParameters.IS_CONTEXT_ID_REQUIRED, isContextIdRequiredDefault);
};
oFF.SystemDescription.prototype.setIsContextIdRequired = function(isContextIdRequired)
{
	this.m_connectionProperties.putBoolean(oFF.ConnectionParameters.IS_CONTEXT_ID_REQUIRED, isContextIdRequired);
};
oFF.SystemDescription.prototype.isCsrfTokenRequired = function()
{
	var systemType = this.getSystemType();
	var isCsrfTokenRequiredDefault = systemType.isCsrfTokenRequired();
	return this.m_connectionProperties.getBooleanByKeyExt(oFF.ConnectionParameters.IS_CSRF_REQUIRED, isCsrfTokenRequiredDefault);
};
oFF.SystemDescription.prototype.setIsCsrfTokenRequired = function(isCsrfTokenRequired)
{
	this.m_connectionProperties.putBoolean(oFF.ConnectionParameters.IS_CSRF_REQUIRED, isCsrfTokenRequired);
};
oFF.SystemDescription.prototype.isMasterSystem = function()
{
	var landscape = this.getLandscape();
	return oFF.notNull(landscape) && oFF.XString.isEqual(landscape.getMasterSystemName(), this.getSystemName());
};
oFF.SystemDescription.prototype.getPrefix = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.PREFIX);
};
oFF.SystemDescription.prototype.setPrefix = function(prefix)
{
	this.setProperty(oFF.ConnectionParameters.PREFIX, prefix);
};
oFF.SystemDescription.prototype.getSessionCarrierType = function()
{
	var typeValue = this.m_connectionProperties.getByKey(oFF.ConnectionParameters.SESSION_CARRIER_TYPE);
	if (oFF.isNull(typeValue))
	{
		var systemType = this.getSystemType();
		if (systemType.isTypeOf(oFF.SystemType.ABAP))
		{
			return oFF.SessionCarrierType.SAP_URL_REWRITING;
		}
		else
		{
			return oFF.SessionCarrierType.NONE;
		}
	}
	else
	{
		return oFF.SessionCarrierType.lookup(typeValue);
	}
};
oFF.SystemDescription.prototype.setSessionCarrierType = function(sessionCarrierType)
{
	this.setProperty(oFF.ConnectionParameters.SESSION_CARRIER_TYPE, sessionCarrierType.getName());
};
oFF.SystemDescription.prototype.isCorrelationIdActive = function()
{
	return this.m_connectionProperties.getBooleanByKeyExt(oFF.ConnectionParameters.CORRELATION_ID_ACTIVE, false);
};
oFF.SystemDescription.prototype.setCorrelationIdActive = function(isActive)
{
	this.m_connectionProperties.putBoolean(oFF.ConnectionParameters.CORRELATION_ID_ACTIVE, isActive);
};
oFF.SystemDescription.prototype.getWebdispatcherTemplate = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.WEBDISPATCHER_URI);
};
oFF.SystemDescription.prototype.setWebdispatcherUri = function(template)
{
	this.setWebdispatcherTemplate(template);
};
oFF.SystemDescription.prototype.setWebdispatcherTemplate = function(template)
{
	this.setProperty(oFF.ConnectionParameters.WEBDISPATCHER_URI, template);
};
oFF.SystemDescription.prototype.isPreflightRequired = function()
{
	return oFF.XStringUtils.isNotNullAndNotEmpty(this.getResolvedPreflightUrl());
};
oFF.SystemDescription.prototype.getResolvedPreflightUrl = function()
{
	var uri = this.getPreflightUrl();
	if (oFF.XStringUtils.isNullOrEmpty(uri) && this.getSystemType().isPreflightRequired())
	{
		uri = "/";
	}
	return uri;
};
oFF.SystemDescription.prototype.getPreflightUrl = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.PREFLIGHT);
};
oFF.SystemDescription.prototype.setPreflightUrl = function(preflightUrl)
{
	this.setProperty(oFF.ConnectionParameters.PREFLIGHT, preflightUrl);
};
oFF.SystemDescription.prototype.setTags = function(tags)
{
	this.setProperty(oFF.ConnectionParameters.TAGS, tags);
};
oFF.SystemDescription.prototype.getTags = function()
{
	var tags = this.m_connectionProperties.getByKey(oFF.ConnectionParameters.TAGS);
	if (oFF.isNull(tags))
	{
		return oFF.XHashSetOfString.create();
	}
	return oFF.XStringTokenizer.splitString(tags, ",");
};
oFF.SystemDescription.prototype.getHashedTags = function()
{
	if (oFF.isNull(this.m_hashedTags))
	{
		var tags = this.getTags();
		this.m_hashedTags = oFF.XHashSetOfString.create();
		var iterator = tags.getIterator();
		while (iterator.hasNext())
		{
			this.m_hashedTags.add(iterator.next());
		}
	}
	return this.m_hashedTags;
};
oFF.SystemDescription.prototype.getRoles = function()
{
	var roles = oFF.XList.create();
	var rolesList = this.getTags().getIterator();
	while (rolesList.hasNext())
	{
		var role = oFF.SystemRole.lookup(rolesList.next());
		if (oFF.notNull(role))
		{
			roles.add(role);
		}
	}
	return roles;
};
oFF.SystemDescription.prototype.getSystemMapping = function(systemName)
{
	return this.m_systemMappings.getByKey(systemName);
};
oFF.SystemDescription.prototype.getSystemMappings = function()
{
	return this.m_systemMappings;
};
oFF.SystemDescription.prototype.getProperties = function()
{
	return this.m_connectionProperties;
};
oFF.SystemDescription.prototype.setProperty = function(name, value)
{
	if (oFF.isNull(value))
	{
		this.m_connectionProperties.remove(name);
	}
	else
	{
		this.m_connectionProperties.put(name, value);
	}
	this.m_sysModCounter++;
};
oFF.SystemDescription.prototype.getName = function()
{
	return this.getSystemName();
};
oFF.SystemDescription.prototype.setName = function(name)
{
	this.setSystemName(name);
};
oFF.SystemDescription.prototype.getSystemName = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.NAME);
};
oFF.SystemDescription.prototype.setSystemName = function(systemName)
{
	this.setProperty(oFF.ConnectionParameters.NAME, systemName);
};
oFF.SystemDescription.prototype.getText = function()
{
	return this.getSystemText();
};
oFF.SystemDescription.prototype.setText = function(text)
{
	this.setSystemText(text);
};
oFF.SystemDescription.prototype.getSystemText = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.DESCRIPTION);
};
oFF.SystemDescription.prototype.setSystemText = function(systemText)
{
	this.setProperty(oFF.ConnectionParameters.DESCRIPTION, systemText);
};
oFF.SystemDescription.prototype.getSystemType = function()
{
	var sysTypeValue = this.m_connectionProperties.getByKey(oFF.ConnectionParameters.SYSTEM_TYPE);
	if (oFF.isNull(sysTypeValue))
	{
		sysTypeValue = this.m_connectionProperties.getByKey(oFF.ConnectionParameters.SYSTYPE);
	}
	var systemType = null;
	if (oFF.notNull(sysTypeValue))
	{
		systemType = oFF.SystemType.lookup(sysTypeValue);
	}
	if (oFF.isNull(systemType))
	{
		systemType = oFF.SystemType.GENERIC;
	}
	return systemType;
};
oFF.SystemDescription.prototype.setSystemType = function(systemType)
{
	this.setProperty(oFF.ConnectionParameters.SYSTEM_TYPE, systemType.getName());
};
oFF.SystemDescription.prototype.getProxyHost = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.PROXY_HOST);
};
oFF.SystemDescription.prototype.setProxyHost = function(host)
{
	this.setProperty(oFF.ConnectionParameters.PROXY_HOST, host);
};
oFF.SystemDescription.prototype.getProxyAuthorization = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.PROXY_AUTHORIZATION);
};
oFF.SystemDescription.prototype.setProxyAuthorization = function(authorization)
{
	this.setProperty(oFF.ConnectionParameters.PROXY_AUTHORIZATION, authorization);
};
oFF.SystemDescription.prototype.getSccLocationId = function()
{
	return null;
};
oFF.SystemDescription.prototype.setSccLocationId = function(sccLocationId) {};
oFF.SystemDescription.prototype.getProxyHttpHeaders = function()
{
	return null;
};
oFF.SystemDescription.prototype.setProxyHttpHeader = function(name, value) {};
oFF.SystemDescription.prototype.getProxyType = function()
{
	var result = oFF.ProxyType.DEFAULT;
	var typeValue = this.m_connectionProperties.getByKey(oFF.ConnectionParameters.PROXY_TYPE);
	if (oFF.notNull(typeValue))
	{
		result = oFF.ProxyType.lookup(typeValue);
	}
	if (result === oFF.ProxyType.DEFAULT)
	{
		var template = this.getWebdispatcherTemplate();
		result = oFF.XStringUtils.isNullOrEmpty(template) ? oFF.ProxyType.DEFAULT : oFF.ProxyType.WEBDISPATCHER;
	}
	return result;
};
oFF.SystemDescription.prototype.setProxyType = function(type)
{
	if (oFF.notNull(type))
	{
		this.setProperty(oFF.ConnectionParameters.PROXY_TYPE, type.getName());
	}
};
oFF.SystemDescription.prototype.getProxyPort = function()
{
	return this.m_connectionProperties.getIntegerByKeyExt(oFF.ConnectionParameters.PROXY_PORT, -1);
};
oFF.SystemDescription.prototype.setProxyPort = function(port)
{
	this.setProperty(oFF.ConnectionParameters.PROXY_PORT, oFF.XInteger.convertToString(port));
};
oFF.SystemDescription.prototype.getSysModCounter = function()
{
	return this.m_sysModCounter;
};
oFF.SystemDescription.prototype.getUriString = function()
{
	return this.getUrl();
};
oFF.SystemDescription.prototype.getUrlString = function()
{
	return this.getUrl();
};
oFF.SystemDescription.prototype.getUrl = function()
{
	return oFF.XUri.getUrlStringStatic(this, null, true, true, true, true, true, true, true, true);
};
oFF.SystemDescription.prototype.getUriStringWithoutAuthentication = function()
{
	return this.getUrlStringWithoutAuthentication();
};
oFF.SystemDescription.prototype.getUrlStringWithoutAuthentication = function()
{
	return oFF.XUri.getUrlStringStatic(this, null, true, false, false, false, true, true, true, true);
};
oFF.SystemDescription.prototype.getUriStringExt = function(withScheme, withUser, withPwd, withAuthenticationType, withHostPort, withPath, withQuery, withFragment)
{
	return this.getUrlStringExt(withScheme, withUser, withPwd, withAuthenticationType, withHostPort, withPath, withQuery, withFragment);
};
oFF.SystemDescription.prototype.getUrlStringExt = function(withScheme, withUser, withPwd, withAuthenticationType, withHostPort, withPath, withQuery, withFragment)
{
	return oFF.XUri.getUrlStringStatic(this, null, withScheme, withUser, withPwd, withAuthenticationType, withHostPort, withPath, withQuery, withFragment);
};
oFF.SystemDescription.prototype.getTagValue = function(tagName)
{
	return this.m_connectionProperties.getByKey(tagName);
};
oFF.SystemDescription.prototype.getContentElement = function()
{
	return this;
};
oFF.SystemDescription.prototype.getContentConstant = function()
{
	return null;
};
oFF.SystemDescription.prototype.getNativeConnection = function()
{
	return this.m_nativeConnection;
};
oFF.SystemDescription.prototype.setNativeConnection = function(nativeConnection)
{
	this.m_nativeConnection = nativeConnection;
};
oFF.SystemDescription.prototype.setIncludedCapabilitiesForService = function(serviceName, capabilities)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(serviceName) && oFF.notNull(capabilities))
	{
		this.m_capabilitiesWhitelist.put(serviceName, capabilities);
	}
};
oFF.SystemDescription.prototype.setExcludedCapabilitiesForService = function(serviceName, capabilities)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(serviceName) && oFF.notNull(capabilities))
	{
		this.m_capabilitiesBlacklist.put(serviceName, capabilities);
	}
};
oFF.SystemDescription.prototype.getIncludedCapabilitiesForService = function(serviceName)
{
	return this.m_capabilitiesWhitelist.getByKey(serviceName);
};
oFF.SystemDescription.prototype.getExcludedCapabilitiesForService = function(serviceName)
{
	return this.m_capabilitiesBlacklist.getByKey(serviceName);
};
oFF.SystemDescription.prototype.isSystemMappingValid = function(remoteSystemDesription)
{
	if (oFF.isNull(remoteSystemDesription))
	{
		return false;
	}
	var mapping = this.getSystemMapping(remoteSystemDesription.getSystemName());
	var mappingRemote = remoteSystemDesription.getSystemMapping(this.getSystemName());
	return oFF.notNull(mapping) && oFF.notNull(mappingRemote) && mapping.isValid(mappingRemote);
};
oFF.SystemDescription.prototype.getAlias = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.ALIAS);
};
oFF.SystemDescription.prototype.setAlias = function(alias)
{
	this.setProperty(oFF.ConnectionParameters.ALIAS, alias);
};
oFF.SystemDescription.prototype.getRawContexts = function()
{
	return this.m_contexts;
};
oFF.SystemDescription.prototype.setRawContexts = function(contexts)
{
	this.m_contexts = contexts;
};
oFF.SystemDescription.prototype.getAssociatedHanaSystem = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.ASSOCIATED_HANA_SYSTEM);
};
oFF.SystemDescription.prototype.setAssociatedHanaSystem = function(associatedHanaSystem)
{
	this.m_connectionProperties.put(oFF.ConnectionParameters.ASSOCIATED_HANA_SYSTEM, associatedHanaSystem);
};
oFF.SystemDescription.prototype.setKeepAliveIntervalMs = function(intervalMs)
{
	var value = oFF.XInteger.convertToString(intervalMs);
	if (intervalMs < 0)
	{
		throw oFF.XException.createIllegalArgumentException(oFF.XStringUtils.concatenate4("Keep alive for system ", this.getName(), " must be > 0, but was ", value));
	}
	this.setProperty(oFF.ConnectionParameters.KEEP_ALIVE_INTERVAL, value);
};
oFF.SystemDescription.prototype.setKeepAliveDelayMs = function(delayMs)
{
	this.setProperty(oFF.ConnectionParameters.KEEP_ALIVE_DELAY, oFF.XInteger.convertToString(delayMs));
};
oFF.SystemDescription.prototype.getKeepAliveIntervalMs = function()
{
	return this.m_connectionProperties.getIntegerByKeyExt(oFF.ConnectionParameters.KEEP_ALIVE_INTERVAL, 60000);
};
oFF.SystemDescription.prototype.getKeepAliveDelayMs = function()
{
	return this.m_connectionProperties.getIntegerByKeyExt(oFF.ConnectionParameters.KEEP_ALIVE_DELAY, -1);
};
oFF.SystemDescription.prototype.setTenantRootPackage = function(rootPackage)
{
	this.setProperty(oFF.ConnectionParameters.TENANT_ROOT_PACKAGE, rootPackage);
};
oFF.SystemDescription.prototype.getTenantRootPackage = function()
{
	return this.m_connectionProperties.getByKey(oFF.ConnectionParameters.TENANT_ROOT_PACKAGE);
};
oFF.SystemDescription.prototype.toString = function()
{
	var sb = oFF.XStringBuffer.create();
	sb.append("System:");
	var name = this.getSystemName();
	if (oFF.notNull(name))
	{
		sb.append(" ").append(name);
	}
	var text = this.getSystemText();
	if (oFF.notNull(text))
	{
		sb.append(" - ").append(text);
	}
	sb.appendNewLine();
	var properties = this.getProperties();
	if (oFF.XCollectionUtils.hasElements(properties))
	{
		var propertyNames = oFF.XListOfString.createFromReadOnlyList(properties.getKeysAsReadOnlyListOfString());
		propertyNames.sortByDirection(oFF.XSortDirection.ASCENDING);
		for (var i = 0; i < propertyNames.size(); i++)
		{
			var propertyName = propertyNames.get(i);
			if (oFF.isNull(propertyName))
			{
				continue;
			}
			sb.append(propertyName).append("=");
			if (oFF.XString.isEqual(propertyName, oFF.ConnectionParameters.PASSWORD))
			{
				sb.append("**********");
			}
			else
			{
				var propertyValue = properties.getByKey(propertyName);
				if (oFF.notNull(propertyValue))
				{
					sb.append(propertyValue);
				}
			}
			sb.appendNewLine();
		}
	}
	return sb.toString();
};

oFF.SystemLandscapeLoadAction = function() {};
oFF.SystemLandscapeLoadAction.prototype = new oFF.SyncAction();
oFF.SystemLandscapeLoadAction.prototype._ff_c = "SystemLandscapeLoadAction";

oFF.SystemLandscapeLoadAction.createAndRun = function(syncType, listener, customIdentifier, sessionContext, systemLandscape, connectionPool, uri)
{
	return oFF.SystemLandscapeLoadAction.createAndRunInternal(syncType, listener, customIdentifier, sessionContext, systemLandscape, connectionPool, uri, 0, oFF.XHashSetOfString.create());
};
oFF.SystemLandscapeLoadAction.createAndRunInternal = function(syncType, listener, customIdentifier, sessionContext, systemLandscape, connectionPool, url, level, uriSet)
{
	oFF.XObjectExt.assertNotNullExt(url, "No URL given");
	var newObject = new oFF.SystemLandscapeLoadAction();
	if (url.isRelativeUri())
	{
		var location = oFF.NetworkEnv.getLocation();
		var relative = url.getUrl();
		newObject.m_uri = oFF.XUri.createFromUrlWithParent(relative, location, false);
	}
	else
	{
		newObject.m_uri = url;
	}
	newObject.m_systemLandscape = systemLandscape;
	newObject.setData(systemLandscape);
	newObject.m_parents = oFF.XList.create();
	newObject.m_children = oFF.XList.create();
	newObject.m_all = oFF.XList.create();
	newObject.m_level = level;
	newObject.m_uriSet = uriSet;
	var fullUri = url.getUrl();
	uriSet.add(fullUri);
	newObject.setupActionAndRun(syncType, listener, customIdentifier, sessionContext);
	return newObject;
};
oFF.SystemLandscapeLoadAction.setSystems = function(systemsStructure, systemLandscape)
{
	oFF.SystemLandscapeLoadAction.setSystemsExt(systemsStructure, systemLandscape, null);
};
oFF.SystemLandscapeLoadAction.setSystemsExt = function(systemsStructure, systemLandscape, contextName)
{
	var elementNames = systemsStructure.getKeysAsReadOnlyListOfString();
	if (oFF.notNull(elementNames))
	{
		for (var i = 0; i < elementNames.size(); i++)
		{
			var systemName = elementNames.get(i);
			if (oFF.notNull(systemName))
			{
				var element = systemsStructure.getByKey(systemName);
				if (oFF.notNull(element) && element.getType() === oFF.PrElementType.STRUCTURE)
				{
					var systemStructure = element;
					var pair = oFF.SystemLandscapeLoadAction.readProperties(oFF.XProperties.create(), systemStructure, null);
					var prop = pair.getFirstObject();
					var systemDescription = systemLandscape.getSystemDescription(systemName);
					if (oFF.notNull(systemDescription))
					{
						var keysAsIteratorOfString = prop.getKeysAsIteratorOfString();
						while (keysAsIteratorOfString.hasNext())
						{
							var key = keysAsIteratorOfString.next();
							var value = prop.getStringByKey(key);
							systemDescription.setProperty(key, value);
						}
					}
					else
					{
						systemDescription = oFF.SystemDescription.createExt(systemLandscape.getSession(), systemLandscape, systemName, prop);
						systemLandscape.setSystemByDescription(systemDescription);
					}
					systemDescription.setRawContexts(pair.getSecondObject());
					var text = systemDescription.getSystemText();
					if (oFF.isNull(text))
					{
						systemDescription.setSystemText(systemDescription.getSystemName());
					}
				}
			}
		}
	}
};
oFF.SystemLandscapeLoadAction.getSystemPropertiesFromUri = function(uri)
{
	var properties = oFF.XProperties.create();
	var protocolType = uri.getProtocolType();
	if (oFF.notNull(protocolType))
	{
		properties.put(oFF.ConnectionParameters.PROTOCOL, protocolType.getName());
	}
	var host = uri.getHost();
	if (oFF.notNull(host))
	{
		properties.put(oFF.ConnectionParameters.HOST, uri.getHost());
	}
	var port = uri.getPort();
	if (port > 0)
	{
		properties.put(oFF.ConnectionParameters.PORT, oFF.XInteger.convertToString(port));
	}
	return oFF.ExtResult.create(properties, null);
};
oFF.SystemLandscapeLoadAction.readProperties = function(properties, systemStructure, contextName)
{
	var contexts = null;
	var elementNames = systemStructure.getKeysAsReadOnlyListOfString();
	var size = elementNames.size();
	for (var i = 0; i < size; i++)
	{
		var key = elementNames.get(i);
		if (oFF.XString.isEqual(key, oFF.ConnectionParameters.MAPPINGS))
		{
			var inaMappings = systemStructure.getListByKey(key);
			var sizeMappings = inaMappings.size();
			for (var idxMapping = 0; idxMapping < sizeMappings; idxMapping++)
			{
				var inaMapping = inaMappings.getStructureAt(idxMapping);
				var systemName = inaMapping.getStringByKey(oFF.ConnectionParameters.MAPPING_SYSTEM_NAME);
				properties.put(oFF.XStringUtils.concatenate3(oFF.ConnectionParameters.MAPPING_SYSTEM_NAME, "$$", systemName), systemName);
				var saveSchema = inaMapping.getStringByKey(oFF.ConnectionParameters.MAPPING_SERIALIZATION_SCHEMA);
				properties.put(oFF.XStringUtils.concatenate3(oFF.ConnectionParameters.MAPPING_SERIALIZATION_SCHEMA, "$$", systemName), saveSchema);
				var saveTable = inaMapping.getStringByKey(oFF.ConnectionParameters.MAPPING_SERIALIZATION_TABLE);
				properties.put(oFF.XStringUtils.concatenate3(oFF.ConnectionParameters.MAPPING_SERIALIZATION_TABLE, "$$", systemName), saveTable);
				var loadSchema = inaMapping.getStringByKey(oFF.ConnectionParameters.MAPPING_DESERIALIZATION_SCHEMA);
				properties.put(oFF.XStringUtils.concatenate3(oFF.ConnectionParameters.MAPPING_DESERIALIZATION_SCHEMA, "$$", systemName), loadSchema);
				var loadTable = inaMapping.getStringByKey(oFF.ConnectionParameters.MAPPING_DESERIALIZATION_TABLE);
				properties.put(oFF.XStringUtils.concatenate3(oFF.ConnectionParameters.MAPPING_DESERIALIZATION_TABLE, "$$", systemName), loadTable);
			}
		}
		else if (oFF.XString.isEqual(key, oFF.ConnectionParameters.CONTEXTS))
		{
			contexts = systemStructure.getStructureByKey(key);
			if (oFF.notNull(contextName))
			{
				var selectedContext = contexts.getStructureByKey(contextName);
				if (oFF.notNull(selectedContext))
				{
					oFF.SystemLandscapeLoadAction.readProperties(properties, selectedContext, null);
				}
			}
		}
		else if (oFF.XString.isEqual(key, oFF.ConnectionParameters.DEFINITION))
		{
			var definition = systemStructure.getStructureByKey(key);
			var sccHost = definition.getStringByKey(oFF.ConnectionParameters.SCC_VIRTUAL_HOST);
			if (oFF.notNull(sccHost))
			{
				properties.put(oFF.ConnectionParameters.HOST, sccHost);
			}
			var sccPort = definition.getStringByKey(oFF.ConnectionParameters.SCC_PORT);
			if (oFF.notNull(sccPort))
			{
				properties.put(oFF.ConnectionParameters.PORT, sccPort);
			}
		}
		else
		{
			var value = systemStructure.getStringByKey(key);
			properties.putStringNotNull(key, value);
		}
	}
	var pair = oFF.XPair.create(properties, contexts);
	return pair;
};
oFF.SystemLandscapeLoadAction.prototype.m_uri = null;
oFF.SystemLandscapeLoadAction.prototype.m_parents = null;
oFF.SystemLandscapeLoadAction.prototype.m_children = null;
oFF.SystemLandscapeLoadAction.prototype.m_all = null;
oFF.SystemLandscapeLoadAction.prototype.m_structure = null;
oFF.SystemLandscapeLoadAction.prototype.m_systemName = null;
oFF.SystemLandscapeLoadAction.prototype.m_finished = 0;
oFF.SystemLandscapeLoadAction.prototype.m_level = 0;
oFF.SystemLandscapeLoadAction.prototype.m_uriSet = null;
oFF.SystemLandscapeLoadAction.prototype.m_systemLandscape = null;
oFF.SystemLandscapeLoadAction.prototype.releaseObject = function()
{
	this.m_uri = null;
	this.m_systemName = null;
	this.m_structure = null;
	this.m_uriSet = null;
	this.m_systemLandscape = null;
	this.m_parents = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_parents);
	this.m_children = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_children);
	this.m_all = null;
	oFF.SyncAction.prototype.releaseObject.call( this );
};
oFF.SystemLandscapeLoadAction.prototype.processSynchronization = function(syncType)
{
	var file = oFF.XFile.createByUri(this.getSession(), this.m_uri);
	file.processLoad(syncType, this, null, oFF.CompressionType.NONE);
	return true;
};
oFF.SystemLandscapeLoadAction.prototype.onFileLoaded = function(extResult, file, fileContent, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.hasErrors())
	{
		this.endSync();
	}
	else
	{
		var rootElement = fileContent.getJsonContent();
		this.parseStructure(rootElement);
	}
};
oFF.SystemLandscapeLoadAction.prototype.parseStructure = function(rootElement)
{
	if (oFF.isNull(rootElement))
	{
		this.addError(oFF.ErrorCodes.OTHER_ERROR, "No json root element in response");
		this.endSync();
	}
	else
	{
		this.m_structure = oFF.PrFactory.createStructureDeepCopy(rootElement);
		var parentReferences = this.m_structure.getListByKey("ParentLandscapeReferences");
		var referenceList = oFF.PrUtils.asListOfString(parentReferences);
		var furtherProcessing = false;
		if (oFF.notNull(referenceList) && referenceList.size() > 0)
		{
			if (this.m_level > 5)
			{
				this.addError(oFF.ErrorCodes.OTHER_ERROR, "System Landscape Network too deep: > 5 levels");
			}
			else
			{
				for (var i = 0; i < referenceList.size(); i++)
				{
					var parentRelativeUrlValue = referenceList.get(i);
					if (oFF.XStringUtils.isNotNullAndNotEmpty(parentRelativeUrlValue))
					{
						var url = oFF.XUri.createFromUrlWithParent(parentRelativeUrlValue, this.m_uri, true);
						var urlValue = url.getUrl();
						if (!this.m_uriSet.contains(urlValue))
						{
							var parentAction = oFF.SystemLandscapeLoadAction.createAndRunInternal(this.getActiveSyncType(), this, oFF.XIntegerValue.create(i), this.getActionContext(), this.m_systemLandscape, null, url, this.m_level + 1, this.m_uriSet);
							this.m_parents.add(parentAction);
							this.m_all.add(parentAction);
							furtherProcessing = true;
						}
					}
				}
			}
		}
		if (this.m_level === 0)
		{
			var customUrl = oFF.XEnvironment.getInstance().getVariable(oFF.XEnvironmentConstants.LANDSCAPE_CUSTOMIZATION);
			if (oFF.notNull(customUrl))
			{
				var landscapeCustomUrl = oFF.XUri.createFromUrl(customUrl);
				var childAction = oFF.SystemLandscapeLoadAction.createAndRunInternal(this.getActiveSyncType(), this, oFF.XIntegerValue.create(-1), this.getActionContext(), this.m_systemLandscape, null, landscapeCustomUrl, this.m_level + 1, this.m_uriSet);
				this.m_children.add(childAction);
				this.m_all.add(childAction);
				furtherProcessing = true;
			}
		}
		if (this.getActiveSyncType() === oFF.SyncType.BLOCKING || !furtherProcessing)
		{
			this.setData(this.getSystemLandscape());
			this.endSync();
		}
	}
};
oFF.SystemLandscapeLoadAction.prototype.onLandscapeNodeLoaded = function(extResult, landscape, customIdentifier)
{
	this.m_finished++;
	if (this.getActiveSyncType() === oFF.SyncType.NON_BLOCKING)
	{
		if (this.m_finished === this.m_all.size())
		{
			this.setData(this.getSystemLandscape());
			this.endSync();
		}
	}
};
oFF.SystemLandscapeLoadAction.prototype.endSync = function()
{
	if (this.m_level === 0)
	{
		this.removeTempSystems();
		this.mapSystems();
	}
	oFF.SyncAction.prototype.endSync.call( this );
};
oFF.SystemLandscapeLoadAction.prototype.removeTempSystems = function()
{
	for (var i = 0; i < this.m_all.size(); i++)
	{
		var node = this.m_all.get(i);
		node.removeTempSystems();
	}
	this.getSystemLandscape().removeSystem(this.m_systemName);
};
oFF.SystemLandscapeLoadAction.prototype.mapSystems = function()
{
	for (var i = 0; i < this.m_parents.size(); i++)
	{
		var parentNode = this.m_parents.get(i);
		parentNode.mapSystems();
	}
	this.mapStructureToSystem(this.m_structure);
	for (var j = 0; j < this.m_children.size(); j++)
	{
		var childNode = this.m_children.get(j);
		childNode.mapSystems();
	}
};
oFF.SystemLandscapeLoadAction.prototype.mapStructureToSystem = function(landscapeStructure)
{
	if (oFF.notNull(landscapeStructure))
	{
		var systemLandscape = this.getSystemLandscape();
		var systemsStructure = landscapeStructure.getStructureByKey("Systems");
		if (oFF.notNull(systemsStructure))
		{
			var contextName = this.getSession().getContextName();
			oFF.SystemLandscapeLoadAction.setSystemsExt(systemsStructure, systemLandscape, contextName);
		}
		var includeFilter = landscapeStructure.getListByKey("IncludeFilter");
		if (oFF.notNull(includeFilter))
		{
			var survivors = oFF.XList.create();
			for (var ex = 0; ex < includeFilter.size(); ex++)
			{
				var systemNameToIncude = includeFilter.getStringAt(ex);
				survivors.add(systemLandscape.getSystemDescription(systemNameToIncude));
			}
			systemLandscape.clearSystems();
			for (var k = 0; k < survivors.size(); k++)
			{
				systemLandscape.setSystemByDescription(survivors.get(k));
			}
		}
		var excludeFilter = landscapeStructure.getListByKey("ExcludeFilter");
		if (oFF.notNull(excludeFilter))
		{
			for (var ex1 = 0; ex1 < excludeFilter.size(); ex1++)
			{
				var systemNameToExclude = excludeFilter.getStringAt(ex1);
				systemLandscape.removeSystem(systemNameToExclude);
			}
		}
		var roles = landscapeStructure.getStructureByKey("Roles");
		if (oFF.notNull(roles))
		{
			var iterator = oFF.SystemRole.getAllRoles().getIterator();
			while (iterator.hasNext())
			{
				var currentRole = iterator.next();
				var masterName = roles.getStringByKey(currentRole.getName());
				if (oFF.XStringUtils.isNotNullAndNotEmpty(masterName))
				{
					systemLandscape.setDefaultSystemName(currentRole, masterName);
				}
			}
			oFF.XObjectExt.release(iterator);
		}
	}
};
oFF.SystemLandscapeLoadAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onLandscapeNodeLoaded(extResult, data, customIdentifier);
};
oFF.SystemLandscapeLoadAction.prototype.getSystemLandscape = function()
{
	return this.m_systemLandscape;
};

oFF.ProgramShutdownAction = function() {};
oFF.ProgramShutdownAction.prototype = new oFF.SyncAction();
oFF.ProgramShutdownAction.prototype._ff_c = "ProgramShutdownAction";

oFF.ProgramShutdownAction.createAndRun = function(syncType, listener, customIdentifier, program)
{
	var object = new oFF.ProgramShutdownAction();
	object.setupActionAndRun(syncType, listener, customIdentifier, program);
	return object;
};
oFF.ProgramShutdownAction.prototype.m_canTerminate = false;
oFF.ProgramShutdownAction.prototype.setupAction = function(syncType, listener, customIdentifier, context)
{
	oFF.SyncAction.prototype.setupAction.call( this , syncType, listener, customIdentifier, context);
};
oFF.ProgramShutdownAction.prototype.getLogLayer = function()
{
	return oFF.OriginLayer.KERNEL;
};
oFF.ProgramShutdownAction.prototype.processSynchronization = function(syncType)
{
	var program = this.getActionContext();
	this.m_canTerminate = program.canTerminate();
	if (this.m_canTerminate === true)
	{
		var exitValue = program.getExitValue();
		this.setData(exitValue);
		return false;
	}
	else
	{
		return false;
	}
};
oFF.ProgramShutdownAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onProgramTerminated(extResult, data, this.m_canTerminate, customIdentifier);
};

oFF.ProgramStartAction = function() {};
oFF.ProgramStartAction.prototype = new oFF.SyncAction();
oFF.ProgramStartAction.prototype._ff_c = "ProgramStartAction";

oFF.ProgramStartAction.createAndRun = function(syncType, listener, customIdentifier, startCfg)
{
	var object = new oFF.ProgramStartAction();
	object.setupActionAndRun(syncType, listener, customIdentifier, startCfg);
	return object;
};
oFF.ProgramStartAction.prototype.m_subSystems = null;
oFF.ProgramStartAction.prototype.m_subSystemsRemaining = null;
oFF.ProgramStartAction.prototype.setupAction = function(syncType, listener, customIdentifier, context)
{
	oFF.SyncAction.prototype.setupAction.call( this , syncType, listener, customIdentifier, context);
	this.m_subSystems = oFF.XListOfNameObject.create();
	this.m_subSystemsRemaining = oFF.XListOfNameObject.create();
};
oFF.ProgramStartAction.prototype.getLogLayer = function()
{
	return oFF.OriginLayer.KERNEL;
};
oFF.ProgramStartAction.prototype.processSynchronization = function(syncType)
{
	var startCfg = this.getActionContext();
	var manifest = startCfg.getProgramManifest();
	var toBeContinued = true;
	if (oFF.notNull(manifest))
	{
		var parentProcess = startCfg.getParentProcess();
		if (oFF.notNull(parentProcess))
		{
			var kernel = parentProcess.getKernel();
			var dependencies = manifest.getDependencies();
			var resolvedDependencies = oFF.XListOfString.create();
			resolvedDependencies.addAll(dependencies);
			for (var i = 0; i < resolvedDependencies.size(); )
			{
				var moduleName = resolvedDependencies.get(i);
				if (kernel.isModuleLoaded(moduleName) === true)
				{
					resolvedDependencies.removeAt(i);
				}
				else
				{
					i++;
				}
			}
			if (resolvedDependencies.size() > 0)
			{
				kernel.processModuleLoad(this.getActiveSyncType(), this, startCfg, resolvedDependencies);
			}
			else
			{
				var messageMgr = oFF.MessageManagerSimple.createMessageManager();
				var extResult = oFF.ExtResult.create(null, messageMgr);
				this.onModuleLoadedMulti(extResult, null, startCfg);
			}
		}
		else
		{
			this.addError(0, oFF.XStringUtils.concatenate2("Cannot start program: No parent process given for : ", startCfg.getName()));
			toBeContinued = false;
		}
	}
	else
	{
		this.addError(0, oFF.XStringUtils.concatenate2("Cannot start program: Program manifest cannot be found: ", startCfg.getName()));
		toBeContinued = false;
	}
	return toBeContinued;
};
oFF.ProgramStartAction.prototype.onModuleLoadedMulti = function(extResult, rootModuleNames, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		var startCfg = this.getActionContext();
		var manifest = startCfg.getProgramManifest();
		var parentProcess = startCfg.getParentProcess();
		var kernel = parentProcess.getKernel();
		var subSystems = manifest.getSubSystems();
		var subSystemType;
		var container;
		for (var k = 0; k < subSystems.size(); k++)
		{
			var name = subSystems.get(k);
			subSystemType = oFF.SubSystemType.lookup(name);
			if (oFF.isNull(subSystemType))
			{
				this.addError(0, oFF.XStringUtils.concatenate2("Unknown subsystem type: ", name));
			}
			else
			{
				this.m_subSystems.add(subSystemType);
			}
		}
		if (this.isValid())
		{
			var outputDevice = manifest.getOutputDevice();
			if (outputDevice.isUiDevice())
			{
				if (subSystems.contains(oFF.SubSystemType.GUI.getName()) === false)
				{
					this.m_subSystems.insert(0, oFF.SubSystemType.GUI);
				}
			}
			for (var m = 0; m < this.m_subSystems.size(); )
			{
				subSystemType = this.m_subSystems.get(m);
				container = kernel.getSubSystemContainer(subSystemType);
				if (container.getStatus() === oFF.SubSystemStatus.ACTIVE || container.getStatus() === oFF.SubSystemStatus.INACTIVE)
				{
					this.m_subSystems.removeAt(m);
				}
				else
				{
					m++;
				}
			}
			if (this.m_subSystems.size() > 0)
			{
				this.m_subSystemsRemaining.addAll(this.m_subSystems);
				this.log2("Initializing inactive subsystems: ", this.m_subSystems.toString());
				for (var o = 0; o < this.m_subSystems.size(); o++)
				{
					subSystemType = this.m_subSystems.get(o);
					container = kernel.getSubSystemContainer(subSystemType);
					container.processSubSystemLoad(this.getActiveSyncType(), this, subSystemType);
				}
			}
			else
			{
				this.bigCinema();
			}
		}
		else
		{
			this.endSync();
		}
	}
	else
	{
		this.endSync();
	}
};
oFF.ProgramStartAction.prototype.onSubSystemLoaded = function(extResult, subSystem, customIdentifier)
{
	this.addAllMessages(extResult);
	var type = customIdentifier;
	this.m_subSystemsRemaining.removeElement(type);
	if (extResult.isValid())
	{
		this.log2("Subsystems loaded: ", type.toString());
	}
	else
	{
		this.logError4("Error loading subsystems: ", type.toString(), " - ", extResult.getSummary());
	}
	if (this.m_subSystemsRemaining.isEmpty())
	{
		this.bigCinema();
	}
	else
	{
		this.log2("Remaining subsystems in loading...: ", this.m_subSystemsRemaining.toString());
	}
};
oFF.ProgramStartAction.prototype.bigCinema = function()
{
	if (this.isValid())
	{
		var startCfg = this.getActionContext();
		var manifest = startCfg.getProgramManifest();
		this.log2("Starting program: ", manifest.getName());
		var factory = manifest.getFactory();
		try
		{
			if (oFF.isNull(factory))
			{
				this.addError(0, oFF.XStringUtils.concatenate2("Cannot create factory for program ", manifest.getName()));
			}
			else
			{
				var newProgram = factory.newProgram();
				this.setData(newProgram);
				var startCfgClone = oFF.XObjectExt.cloneIfNotNull(startCfg);
				startCfgClone.setProgram(newProgram);
				var process = this.newProcess(startCfgClone);
				newProgram.setProcess(process);
				var programContainer = this.newProgramContainer(startCfgClone, newProgram, process);
				var kernel = process.getKernel();
				process.registerOnEvent(kernel);
				process.notifyProcessEvent(oFF.ProcessEventType.CREATED);
				programContainer.runFull();
				process.notifyProcessEvent(oFF.ProcessEventType.PROGRAM_STARTED);
			}
		}
		catch (e)
		{
			this.addError(0, oFF.XStringUtils.concatenate4("Exception was thrown for program ", manifest.getName(), ": ", oFF.XException.getStackTrace(e, 0)));
		}
	}
	this.endSync();
};
oFF.ProgramStartAction.prototype.newProcess = function(startCfg)
{
	var process = startCfg.getProgramProcess();
	if (oFF.isNull(process))
	{
		var parentProcess = startCfg.getParentProcess();
		var usedParentProcess;
		if (startCfg.isCreatingChildProcess())
		{
			usedParentProcess = parentProcess;
		}
		else
		{
			var kernel = parentProcess.getKernel();
			usedParentProcess = kernel.getKernelProcess();
		}
		var programManifest = startCfg.getProgramManifest();
		var type = programManifest.getProcessType();
		process = usedParentProcess.newChildProcess(type);
		if (startCfg.isUsingParentEnvironment())
		{
			process.setEnvironment(parentProcess.getEnvironment());
		}
		process.setStartConfiguration(startCfg);
		process.setNativeAnchorId(startCfg.getNativeAnchorId());
		process.setNativeAnchorObject(startCfg.getNativeAnchorObject());
		var outputDevice = startCfg.getResolvedOutputDevice();
		if (outputDevice === oFF.ProgramDevice.CONSOLE)
		{
			var capabilities = oFF.XHashSetOfString.create();
			capabilities.add("terminal");
			process.setCapabilities(capabilities);
		}
		var listeners = startCfg.getAllProcessEventListeners();
		for (var i = 0; i < listeners.size(); i++)
		{
			var currentListener = listeners.get(i);
			process.registerOnEvent(currentListener);
		}
	}
	return process;
};
oFF.ProgramStartAction.prototype.newProgramContainer = function(startCfg, program, process)
{
	var programContainer = startCfg.getProgramContainer();
	if (oFF.isNull(programContainer))
	{
		var outputDevice = startCfg.getResolvedOutputDevice();
		if (oFF.notNull(outputDevice))
		{
			if (outputDevice !== oFF.ProgramDevice.CONSOLE || startCfg.isNewConsoleNeeded())
			{
				programContainer = oFF.ProgramContainerFactory.create(outputDevice);
			}
		}
	}
	if (oFF.isNull(programContainer))
	{
		programContainer = oFF.ProgramContainer.createProgramContainer(startCfg, program);
	}
	programContainer.setStartCfg(startCfg);
	programContainer.setProgram(program);
	programContainer.setProcess(process);
	startCfg.setProgramContainer(programContainer);
	return programContainer;
};
oFF.ProgramStartAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onProgramStarted(extResult, data, customIdentifier);
};

oFF.ProgramStartCfg = function() {};
oFF.ProgramStartCfg.prototype = new oFF.DfNameTextObject();
oFF.ProgramStartCfg.prototype._ff_c = "ProgramStartCfg";

oFF.ProgramStartCfg.createByCmdLine = function(parentProcess, initArgsString)
{
	var startCfg = null;
	var argValues = oFF.ProgramUtils.createArgValueList(initArgsString);
	startCfg = oFF.ProgramStartCfg.createByCmdLineExt(parentProcess, argValues, 0);
	return startCfg;
};
oFF.ProgramStartCfg.createByCmdLineExt = function(parentProcess, argValues, startOffset)
{
	var prgArgs = null;
	if (argValues.size() > startOffset)
	{
		var prgName = argValues.get(startOffset);
		var theArgValues = null;
		if (startOffset + 1 < argValues.size())
		{
			theArgValues = oFF.XListOfString.create();
			for (var i = startOffset + 1; i < argValues.size(); i++)
			{
				theArgValues.add(argValues.get(i));
			}
		}
		prgArgs = oFF.ProgramStartCfg.createWithArgStruct(parentProcess, prgName, prgName, null, theArgValues);
	}
	return prgArgs;
};
oFF.ProgramStartCfg.createWithArgStruct = function(parentProcess, name, text, argStructure, argList)
{
	var prgArgs = null;
	if (oFF.notNull(argStructure))
	{
		prgArgs = oFF.ProgramArgs.createWithStructure(argStructure);
	}
	else if (oFF.notNull(argList))
	{
		prgArgs = oFF.ProgramArgs.createWithList(argList);
	}
	return oFF.ProgramStartCfg.create(parentProcess, name, text, prgArgs);
};
oFF.ProgramStartCfg.create = function(parentProcess, name, text, args)
{
	var startDef = new oFF.ProgramStartCfg();
	startDef.setupExt(parentProcess, name, text, args);
	return startDef;
};
oFF.ProgramStartCfg.prototype.m_parentProcess = null;
oFF.ProgramStartCfg.prototype.m_isCreatingChildProcess = false;
oFF.ProgramStartCfg.prototype.m_isUsingParentEnvironment = false;
oFF.ProgramStartCfg.prototype.m_isNewConsoleNeeded = false;
oFF.ProgramStartCfg.prototype.m_programProcess = null;
oFF.ProgramStartCfg.prototype.m_args = null;
oFF.ProgramStartCfg.prototype.m_factory = null;
oFF.ProgramStartCfg.prototype.m_manifest = null;
oFF.ProgramStartCfg.prototype.m_programContainer = null;
oFF.ProgramStartCfg.prototype.m_enforcedOutputDevice = null;
oFF.ProgramStartCfg.prototype.m_nativeAnchorId = null;
oFF.ProgramStartCfg.prototype.m_nativeAnchorObject = null;
oFF.ProgramStartCfg.prototype.m_processEventListeners = null;
oFF.ProgramStartCfg.prototype.m_program = null;
oFF.ProgramStartCfg.prototype.setupExt = function(parentProcess, name, text, args)
{
	oFF.DfNameTextObject.prototype.setupWithNameText.call( this , name, text);
	this.m_isCreatingChildProcess = true;
	this.m_parentProcess = parentProcess;
	this.m_processEventListeners = oFF.XList.create();
	if (oFF.notNull(args))
	{
		this.setArguments(args);
	}
};
oFF.ProgramStartCfg.prototype.cloneExt = function(flags)
{
	var startDef = new oFF.ProgramStartCfg();
	var theArguments = oFF.XObjectExt.cloneIfNotNull(this.m_args);
	startDef.setupExt(this.getParentProcess(), this.getName(), this.getText(), theArguments);
	startDef.setEnforcedOutputDevice(this.getEnforcedOutputDevice());
	startDef.setIsCreatingChildProcess(this.isCreatingChildProcess());
	startDef.setIsNewConsoleNeeded(this.isNewConsoleNeeded());
	startDef.setNativeAnchorId(this.getNativeAnchorId());
	startDef.setNativeAnchorObject(this.getNativeAnchorObject());
	startDef.setProgramProcess(this.getProgramProcess());
	for (var i = 0; i < this.m_processEventListeners.size(); i++)
	{
		var listener = this.m_processEventListeners.get(i);
		startDef.registerOnEvent(listener);
	}
	return startDef;
};
oFF.ProgramStartCfg.prototype.getArguments = function()
{
	if (oFF.isNull(this.m_args))
	{
		var programManifest = this.getProgramManifest();
		var args = programManifest.getArguments();
		if (oFF.notNull(args))
		{
			args = args.clone();
		}
		else
		{
			args = oFF.ProgramArgs.create();
		}
		this.m_args = args;
	}
	return this.m_args;
};
oFF.ProgramStartCfg.prototype.setArguments = function(programArguments)
{
	this.m_args = programArguments;
};
oFF.ProgramStartCfg.prototype.getFactory = function()
{
	if (oFF.isNull(this.m_factory))
	{
		var programManifest = this.getProgramManifest();
		if (oFF.notNull(programManifest))
		{
			this.m_factory = programManifest.getFactory();
		}
	}
	return this.m_factory;
};
oFF.ProgramStartCfg.prototype.getProgramManifest = function()
{
	if (oFF.isNull(this.m_manifest))
	{
		var name = this.getName();
		var process = this.getParentProcess();
		if (oFF.notNull(name) && oFF.notNull(process))
		{
			var kernel = process.getKernel();
			var targetProgramName = kernel.resolveProgramName(name);
			this.m_manifest = oFF.ProgramRegistration.getProgramManifest(targetProgramName);
		}
	}
	return this.m_manifest;
};
oFF.ProgramStartCfg.prototype.getSession = function()
{
	return this.m_parentProcess;
};
oFF.ProgramStartCfg.prototype.getParentProcess = function()
{
	return this.m_parentProcess;
};
oFF.ProgramStartCfg.prototype.setParentProcess = function(parentProcess)
{
	this.m_parentProcess = parentProcess;
};
oFF.ProgramStartCfg.prototype.getProgramProcess = function()
{
	return this.m_programProcess;
};
oFF.ProgramStartCfg.prototype.setProgramProcess = function(process)
{
	this.m_programProcess = process;
};
oFF.ProgramStartCfg.prototype.setIsCreatingChildProcess = function(isCreatingChildProcess)
{
	this.m_isCreatingChildProcess = isCreatingChildProcess;
};
oFF.ProgramStartCfg.prototype.isCreatingChildProcess = function()
{
	return this.m_isCreatingChildProcess;
};
oFF.ProgramStartCfg.prototype.processExecution = function(syncType, listener, customIdentifier)
{
	return oFF.ProgramStartAction.createAndRun(syncType, listener, customIdentifier, this);
};
oFF.ProgramStartCfg.prototype.getProgramContainer = function()
{
	return this.m_programContainer;
};
oFF.ProgramStartCfg.prototype.setProgramContainer = function(programContainer)
{
	this.m_programContainer = programContainer;
};
oFF.ProgramStartCfg.prototype.isUsingParentEnvironment = function()
{
	return this.m_isUsingParentEnvironment;
};
oFF.ProgramStartCfg.prototype.setIsUsingParentEnvironment = function(isUsingParentEnvironment)
{
	this.m_isUsingParentEnvironment = isUsingParentEnvironment;
};
oFF.ProgramStartCfg.prototype.isNewConsoleNeeded = function()
{
	return this.m_isNewConsoleNeeded;
};
oFF.ProgramStartCfg.prototype.setIsNewConsoleNeeded = function(isNewConsoleNeeded)
{
	this.m_isNewConsoleNeeded = isNewConsoleNeeded;
};
oFF.ProgramStartCfg.prototype.setNativeAnchorId = function(nativeAnchorId)
{
	this.m_nativeAnchorId = nativeAnchorId;
};
oFF.ProgramStartCfg.prototype.setNativeAnchorObject = function(nativeAnchorObject)
{
	this.m_nativeAnchorObject = nativeAnchorObject;
};
oFF.ProgramStartCfg.prototype.getNativeAnchorId = function()
{
	return this.m_nativeAnchorId;
};
oFF.ProgramStartCfg.prototype.getNativeAnchorObject = function()
{
	return this.m_nativeAnchorObject;
};
oFF.ProgramStartCfg.prototype.setName = function(name)
{
	this.m_name = name;
};
oFF.ProgramStartCfg.prototype.getProgram = function()
{
	return this.m_program;
};
oFF.ProgramStartCfg.prototype.setProgram = function(program)
{
	this.m_program = program;
};
oFF.ProgramStartCfg.prototype.getResolvedOutputDevice = function()
{
	var outputDevice = this.getOutputDevice();
	var enforcedOutputDevice = this.getEnforcedOutputDevice();
	if (oFF.notNull(enforcedOutputDevice))
	{
		if (outputDevice.isUiDevice() === enforcedOutputDevice.isUiDevice())
		{
			outputDevice = enforcedOutputDevice;
		}
	}
	return outputDevice;
};
oFF.ProgramStartCfg.prototype.getEnforcedOutputDevice = function()
{
	return this.m_enforcedOutputDevice;
};
oFF.ProgramStartCfg.prototype.setEnforcedOutputDevice = function(outputDevice)
{
	this.m_enforcedOutputDevice = outputDevice;
};
oFF.ProgramStartCfg.prototype.registerOnEvent = function(listener)
{
	this.m_processEventListeners.add(listener);
};
oFF.ProgramStartCfg.prototype.unregisterOnEvent = function(listener)
{
	for (var i = 0; i < this.m_processEventListeners.size(); )
	{
		var currentListener = this.m_processEventListeners.get(i);
		if (currentListener === listener)
		{
			this.m_processEventListeners.removeAt(i);
		}
		else
		{
			i++;
		}
	}
};
oFF.ProgramStartCfg.prototype.getAllProcessEventListeners = function()
{
	return this.m_processEventListeners;
};
oFF.ProgramStartCfg.prototype.getOutputDevice = function()
{
	var manifest = this.getProgramManifest();
	if (oFF.notNull(manifest))
	{
		return manifest.getOutputDevice();
	}
	return oFF.ProgramDevice.NONE;
};
oFF.ProgramStartCfg.prototype.getInitialContainerCssWidth = function()
{
	var manifest = this.getProgramManifest();
	if (oFF.notNull(manifest))
	{
		return manifest.getInitialContainerCssWidth();
	}
	return null;
};
oFF.ProgramStartCfg.prototype.getInitialContainerCssHeight = function()
{
	var manifest = this.getProgramManifest();
	if (oFF.notNull(manifest))
	{
		return manifest.getInitialContainerCssHeight();
	}
	return null;
};
oFF.ProgramStartCfg.prototype.getInitialContainerCssPosX = function()
{
	var manifest = this.getProgramManifest();
	if (oFF.notNull(manifest))
	{
		return manifest.getInitialContainerCssPosX();
	}
	return null;
};
oFF.ProgramStartCfg.prototype.getInitialContainerCssPosY = function()
{
	var manifest = this.getProgramManifest();
	if (oFF.notNull(manifest))
	{
		return manifest.getInitialContainerCssPosY();
	}
	return null;
};
oFF.ProgramStartCfg.prototype.isInitiallyContainerMaximized = function()
{
	var manifest = this.getProgramManifest();
	if (oFF.notNull(manifest))
	{
		return manifest.isInitiallyContainerMaximized();
	}
	return false;
};
oFF.ProgramStartCfg.prototype.getStartTitle = function()
{
	var startTitle = this.getText();
	if (oFF.XStringUtils.isNullOrEmpty(startTitle))
	{
		var manifest = this.getProgramManifest();
		if (oFF.notNull(manifest))
		{
			startTitle = manifest.getInitialTitle();
			if (oFF.XStringUtils.isNullOrEmpty(startTitle))
			{
				startTitle = manifest.getDisplayName();
			}
		}
	}
	if (oFF.XStringUtils.isNullOrEmpty(startTitle))
	{
		startTitle = this.getName();
	}
	return startTitle;
};
oFF.ProgramStartCfg.prototype.setStartTitle = function(startTitle)
{
	this.setText(startTitle);
};

oFF.ProcessShutdownAction = function() {};
oFF.ProcessShutdownAction.prototype = new oFF.SyncAction();
oFF.ProcessShutdownAction.prototype._ff_c = "ProcessShutdownAction";

oFF.ProcessShutdownAction.createAndRun = function(syncType, listener, customIdentifier, kernel, processId)
{
	var object = new oFF.ProcessShutdownAction();
	object.m_processId = processId;
	object.setupActionAndRun(syncType, listener, customIdentifier, kernel);
	return object;
};
oFF.ProcessShutdownAction.prototype.m_processId = null;
oFF.ProcessShutdownAction.prototype.m_process = null;
oFF.ProcessShutdownAction.prototype.getLogLayer = function()
{
	return oFF.OriginLayer.KERNEL;
};
oFF.ProcessShutdownAction.prototype.processSynchronization = function(syncType)
{
	var kernel = this.getActionContext();
	this.m_process = kernel.getChildProcessById(this.m_processId);
	var doContinue = false;
	if (oFF.notNull(this.m_process))
	{
		var programCfg = this.m_process.getProgramCfg();
		if (oFF.notNull(programCfg))
		{
			var program = programCfg.getProgram();
			if (oFF.notNull(program))
			{
				doContinue = true;
				program.processShutdown(syncType, this, null);
			}
		}
	}
	return doContinue;
};
oFF.ProcessShutdownAction.prototype.onProgramTerminated = function(extResult, exitValues, canTerminate, customIdentifier)
{
	this.addAllMessages(extResult);
	this.setData(exitValues);
	if (canTerminate === false)
	{
		this.addError(0, oFF.XStringUtils.concatenate3("Cannot terminate process '", this.m_processId, "'"));
	}
	if (this.isValid())
	{
		var programCfg = this.m_process.getProgramCfg();
		var programContainer = programCfg.getProgramContainer();
		programContainer.shutdownContainer();
		var childProcesses = this.m_process.getChildProcesses();
		var parentProcess = this.m_process.getParentProcess();
		for (var i = 0; i < childProcesses.size(); i++)
		{
			var child = childProcesses.get(i);
			parentProcess.attachExistingChildProcess(child);
			this.m_process.removeChild(child);
		}
		parentProcess.removeChild(this.m_process);
		this.m_process = oFF.XObjectExt.release(this.m_process);
		var kernel = this.getActionContext();
		var event = oFF.ProcessEvent.create(null, this.m_processId, oFF.ProcessEventType.TERMINATED, null);
		kernel.onProcessEvent(event, event.getProcess(), event.getEventType());
	}
	this.endSync();
};
oFF.ProcessShutdownAction.prototype.endSync = function()
{
	this.m_process = null;
	oFF.SyncAction.prototype.endSync.call( this );
};
oFF.ProcessShutdownAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onProcessTerminated(extResult, data, customIdentifier);
};

oFF.SubSystemLoadAction = function() {};
oFF.SubSystemLoadAction.prototype = new oFF.SyncAction();
oFF.SubSystemLoadAction.prototype._ff_c = "SubSystemLoadAction";

oFF.SubSystemLoadAction.createAndRun = function(syncType, listener, customIdentifier, container, type)
{
	var newObj = new oFF.SubSystemLoadAction();
	newObj.m_subSystemType = type;
	newObj.setupActionAndRun(syncType, listener, customIdentifier, container);
	return newObj;
};
oFF.SubSystemLoadAction.prototype.m_subSystemType = null;
oFF.SubSystemLoadAction.prototype.getLogLayer = function()
{
	return oFF.OriginLayer.KERNEL;
};
oFF.SubSystemLoadAction.prototype.processSynchronization = function(syncType)
{
	var subSystemContainer = this.getActionContext();
	var doCont = false;
	var subSystem;
	var status = subSystemContainer.getStatus();
	if (status === oFF.SubSystemStatus.INITIAL || status === oFF.SubSystemStatus.BOOTSTRAP)
	{
		var name = this.m_subSystemType.getName();
		var programName = oFF.XStringUtils.concatenate2("@SubSys.", name);
		var programManifest = oFF.ProgramRegistration.getProgramManifest(programName);
		if (oFF.notNull(programManifest))
		{
			var kernelProcess = subSystemContainer.getKernel().getKernelProcess();
			var programArgs = oFF.ProgramArgs.create();
			var programStartCfg = oFF.ProgramStartCfg.create(kernelProcess, programName, null, programArgs);
			programStartCfg.registerOnEvent(this);
			programStartCfg.processExecution(syncType, this, null);
			doCont = true;
		}
		else
		{
			subSystem = subSystemContainer.open();
			this.setData(subSystem);
		}
	}
	else
	{
		subSystem = subSystemContainer.getSubSystem();
		this.setData(subSystem);
	}
	return doCont;
};
oFF.SubSystemLoadAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onSubSystemLoaded(extResult, data, customIdentifier);
};
oFF.SubSystemLoadAction.prototype.onProgramStarted = function(extResult, program, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.hasErrors())
	{
		this.endSync();
	}
};
oFF.SubSystemLoadAction.prototype.onProcessEvent = function(event, process, eventType)
{
	if (event.getEventType() === oFF.ProcessEventType.ACTIVE)
	{
		var subSystem = process.getEntity(oFF.ProcessEntity.SUB_SYSTEM);
		process.unregisterOnEvent(this);
		this.setData(subSystem);
		this.endSync();
	}
};

oFF.SubSysUserProfilePrg = function() {};
oFF.SubSysUserProfilePrg.prototype = new oFF.DfProgramSubSys();
oFF.SubSysUserProfilePrg.prototype._ff_c = "SubSysUserProfilePrg";

oFF.SubSysUserProfilePrg.DEFAULT_PROGRAM_NAME = "@SubSys.UserProfile";
oFF.SubSysUserProfilePrg.prototype.m_loadingAction = null;
oFF.SubSysUserProfilePrg.prototype.m_activeUserProfile = null;
oFF.SubSysUserProfilePrg.prototype.m_bootstrapUserProfile = null;
oFF.SubSysUserProfilePrg.prototype.m_readOnlyUserProfile = null;
oFF.SubSysUserProfilePrg.prototype.m_personalizationUserProfile = null;
oFF.SubSysUserProfilePrg.prototype.m_type = null;
oFF.SubSysUserProfilePrg.prototype.newProgram = function()
{
	var prg = new oFF.SubSysUserProfilePrg();
	prg.setup();
	return prg;
};
oFF.SubSysUserProfilePrg.prototype.getSubSystemType = function()
{
	return oFF.SubSystemType.USER_PROFILE;
};
oFF.SubSysUserProfilePrg.prototype.runProcess = function()
{
	var subSystemContainer = this.getSubSystemContainer();
	var bootstrapSubSystem = subSystemContainer.getBootstrapSubSystem();
	this.m_bootstrapUserProfile = bootstrapSubSystem.getMainApi();
	this.m_activeUserProfile = this.m_bootstrapUserProfile;
	this.m_type = oFF.ServiceApiLevel.BOOTSTRAP;
	var session = this.getSession();
	var path = oFF.XStringUtils.concatenate3("${", oFF.XEnvironmentConstants.FIREFLY_USER_PROFILE, "}");
	var file = oFF.XFile.createExt(session, path, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
	if (oFF.notNull(file))
	{
		this.m_loadingAction = oFF.UserProfileLoadAction.createAndRun(null, this, oFF.ServiceApiLevel.READ_ONLY, this, file, oFF.ServiceApiLevel.READ_ONLY, this.m_activeUserProfile);
		return true;
	}
	else
	{
		path = oFF.XStringUtils.concatenate3("${", oFF.XEnvironmentConstants.FIREFLY_USER_PROFILE_RW, "}");
		file = oFF.XFile.createExt(session, path, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
		if (oFF.notNull(file))
		{
			this.m_loadingAction = oFF.UserProfileLoadAction.createAndRun(null, this, oFF.ServiceApiLevel.PERSONALIZATION, this, file, oFF.ServiceApiLevel.PERSONALIZATION, this.m_activeUserProfile);
			return true;
		}
		else
		{
			this.logError2("Cannot resolve user profile path: ", path);
			this.activateSubSystem(null, oFF.SubSystemStatus.ACTIVE);
			return false;
		}
	}
};
oFF.SubSysUserProfilePrg.prototype.activateSubSystem = function(messages, status)
{
	if (this.m_type === oFF.ServiceApiLevel.BOOTSTRAP)
	{
		this.log("Activating user profile using bootstrap settings");
	}
	else if (this.m_type === oFF.ServiceApiLevel.READ_ONLY)
	{
		this.log("Activating user profile using read-only settings");
	}
	else if (this.m_type === oFF.ServiceApiLevel.PERSONALIZATION)
	{
		this.log("Activating user profile using writeable settings");
	}
	var tenantId = this.m_activeUserProfile.getTenantId();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(tenantId))
	{
		var kernel = this.getProcess().getKernel();
		var kernelProcess = kernel.getKernelProcess();
		var environment = kernelProcess.getEnvironment();
		environment.setVariable(oFF.XEnvironmentConstants.FIREFLY_TENANT_ID, tenantId);
	}
	oFF.DfProgramSubSys.prototype.activateSubSystem.call( this , messages, status);
};
oFF.SubSysUserProfilePrg.prototype.onUserProfileLoaded = function(extResult, userProfile, customIdentifier)
{
	var type = customIdentifier;
	if (extResult.isValid() === true && oFF.notNull(userProfile))
	{
		if (type === oFF.ServiceApiLevel.READ_ONLY)
		{
			this.setReadOnlyUserProfile(userProfile);
		}
		else if (type === oFF.ServiceApiLevel.PERSONALIZATION)
		{
			this.setPersonalizatonUserProfile(userProfile);
		}
		this.m_activeUserProfile = userProfile;
		this.m_type = type;
	}
	var activate = true;
	if (type === oFF.ServiceApiLevel.READ_ONLY)
	{
		var path = oFF.XStringUtils.concatenate3("${", oFF.XEnvironmentConstants.FIREFLY_USER_PROFILE_RW, "}");
		var file = oFF.XFile.createExt(this.getSession(), path, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
		if (oFF.notNull(file))
		{
			this.m_loadingAction = oFF.UserProfileLoadAction.createAndRun(null, this, oFF.ServiceApiLevel.PERSONALIZATION, this, file, oFF.ServiceApiLevel.PERSONALIZATION, this.m_activeUserProfile);
			activate = false;
		}
	}
	if (activate === true)
	{
		this.activateSubSystem(extResult, oFF.SubSystemStatus.ACTIVE);
	}
};
oFF.SubSysUserProfilePrg.prototype.canUserProfileSaved = function()
{
	return this.m_type === oFF.ServiceApiLevel.PERSONALIZATION;
};
oFF.SubSysUserProfilePrg.prototype.processUserProfileSave = function(syncType, listener, customIdentifier)
{
	if (this.canUserProfileSaved())
	{
		return oFF.UserProfileSaveAction.createAndRun(syncType, listener, customIdentifier, this, this.m_activeUserProfile);
	}
	else
	{
		oFF.noSupport();
	}
};
oFF.SubSysUserProfilePrg.prototype.getMainApi = function()
{
	return this.m_activeUserProfile;
};
oFF.SubSysUserProfilePrg.prototype.getAdminApi = function()
{
	return this;
};
oFF.SubSysUserProfilePrg.prototype.getBootstrapUserProfile = function()
{
	return this.m_bootstrapUserProfile;
};
oFF.SubSysUserProfilePrg.prototype.getReadOnlyUserProfile = function()
{
	return this.m_readOnlyUserProfile;
};
oFF.SubSysUserProfilePrg.prototype.setReadOnlyUserProfile = function(userProfile)
{
	this.m_readOnlyUserProfile = userProfile;
};
oFF.SubSysUserProfilePrg.prototype.getPersonalizationUserProfile = function()
{
	return this.m_personalizationUserProfile;
};
oFF.SubSysUserProfilePrg.prototype.setPersonalizatonUserProfile = function(userProfile)
{
	this.m_personalizationUserProfile = userProfile;
};
oFF.SubSysUserProfilePrg.prototype.getUserProfile = function()
{
	return this.m_activeUserProfile;
};
oFF.SubSysUserProfilePrg.prototype.getServiceApiLevel = function()
{
	return this.m_type;
};

oFF.UserProfileLoadAction = function() {};
oFF.UserProfileLoadAction.prototype = new oFF.SyncAction();
oFF.UserProfileLoadAction.prototype._ff_c = "UserProfileLoadAction";

oFF.UserProfileLoadAction.createAndRun = function(syncType, listener, customIdentifier, context, file, serviceApiLevel, parent)
{
	var object = new oFF.UserProfileLoadAction();
	object.m_file = file;
	object.m_serviceApiLevel = serviceApiLevel;
	object.m_parent = parent;
	object.setupActionAndRun(syncType, listener, customIdentifier, context);
	return object;
};
oFF.UserProfileLoadAction.prototype.m_file = null;
oFF.UserProfileLoadAction.prototype.m_serviceApiLevel = null;
oFF.UserProfileLoadAction.prototype.m_parent = null;
oFF.UserProfileLoadAction.prototype.processSynchronization = function(syncType)
{
	this.log2("Loading user profile: ", this.m_file.getNativePath());
	this.m_file.processLoad(syncType, this, null, oFF.CompressionType.NONE);
	return true;
};
oFF.UserProfileLoadAction.prototype.onFileLoaded = function(extResult, file, fileContent, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		if (oFF.notNull(fileContent))
		{
			var userProfile = oFF.UserProfile.create();
			userProfile.setServiceApiLevel(this.m_serviceApiLevel);
			userProfile.setDocumentUri(this.m_file.getVfsUri());
			userProfile.setParent(this.m_parent);
			var document = fileContent.getJsonContent();
			userProfile.setDocument(document);
			if (oFF.notNull(document))
			{
				var ok = oFF.UserProfileAdapterLdap.deserialize(userProfile, document);
				if (ok === false)
				{
					oFF.UserProfileAdapterOrca.deserialize(userProfile, document);
				}
			}
			this.setData(userProfile);
		}
	}
	else
	{
		this.logError2("Cannot load user profile from ", this.m_file.getNativePath());
	}
	this.endSync();
};
oFF.UserProfileLoadAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onUserProfileLoaded(extResult, data, customIdentifier);
};

oFF.UserProfileSaveAction = function() {};
oFF.UserProfileSaveAction.prototype = new oFF.SyncAction();
oFF.UserProfileSaveAction.prototype._ff_c = "UserProfileSaveAction";

oFF.UserProfileSaveAction.createAndRun = function(syncType, listener, customIdentifier, context, userProfile)
{
	var object = new oFF.UserProfileSaveAction();
	object.m_userProfile = userProfile;
	object.setupActionAndRun(syncType, listener, customIdentifier, context);
	return object;
};
oFF.UserProfileSaveAction.prototype.m_userProfile = null;
oFF.UserProfileSaveAction.prototype.processSynchronization = function(syncType)
{
	this.setData(this.m_userProfile);
	var documentFormat = this.m_userProfile.getDocumentFormat();
	var document = this.m_userProfile.getDocument();
	var canBeSaved = false;
	if (oFF.XString.isEqual(documentFormat, oFF.UserProfileAdapterLdap.DOC_FORMAT))
	{
		oFF.UserProfileAdapterLdap.serialize(this.m_userProfile, document);
		canBeSaved = true;
	}
	else if (oFF.XString.isEqual(documentFormat, oFF.UserProfileAdapterOrca.DOC_FORMAT))
	{
		oFF.UserProfileAdapterOrca.serialize(this.m_userProfile, document);
		canBeSaved = true;
	}
	if (canBeSaved === true)
	{
		var uri = this.m_userProfile.getDocumentUri();
		var saveFile = oFF.XFile.createByUri(this.getSession(), uri);
		var content = oFF.XContent.createJsonObjectContent(oFF.ContentType.JSON, document);
		saveFile.processSave(syncType, this, null, content, oFF.CompressionType.NONE);
		return true;
	}
	else
	{
		this.addError(0, "Cannot save: No valid document format given");
		return false;
	}
};
oFF.UserProfileSaveAction.prototype.onFileSaved = function(extResult, file, fileContent, customIdentifier)
{
	this.addAllMessages(extResult);
	this.endSync();
};
oFF.UserProfileSaveAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onUserProfileSaved(extResult, data, customIdentifier);
};

oFF.CapabilityContainer = function() {};
oFF.CapabilityContainer.prototype = new oFF.XAbstractReadOnlyMap();
oFF.CapabilityContainer.prototype._ff_c = "CapabilityContainer";

oFF.CapabilityContainer.create = function(name)
{
	var object = new oFF.CapabilityContainer();
	object.setupExt(name);
	return object;
};
oFF.CapabilityContainer.prototype.m_name = null;
oFF.CapabilityContainer.prototype.cloneExt = function(flags)
{
	var clone = oFF.CapabilityContainer.create(this.getName());
	clone.m_storage = this.m_storage.createMapByStringCopy();
	return clone;
};
oFF.CapabilityContainer.prototype.setupExt = function(name)
{
	this.m_name = name;
	oFF.XAbstractReadOnlyMap.prototype.setup.call( this );
};
oFF.CapabilityContainer.prototype.releaseObject = function()
{
	this.m_name = null;
	oFF.XAbstractReadOnlyMap.prototype.releaseObject.call( this );
};
oFF.CapabilityContainer.prototype.addCapabilityInfo = function(capability)
{
	this.put(capability.getName(), capability);
};
oFF.CapabilityContainer.prototype.addCapability = function(name)
{
	this.put(name, oFF.Capability.createCapabilityInfo(name, null));
};
oFF.CapabilityContainer.prototype.put = function(key, element)
{
	if (this.m_storage.containsKey(key) === false)
	{
		this.m_storage.put(key, element);
	}
};
oFF.CapabilityContainer.prototype.getSortedCapabilityNames = function()
{
	return this.m_storage.getKeysAsReadOnlyListOfString();
};
oFF.CapabilityContainer.prototype.intersect = function(otherCapabilitySelection)
{
	var newContainer = oFF.CapabilityContainer.create(this.getName());
	if (oFF.notNull(otherCapabilitySelection))
	{
		var iterator = otherCapabilitySelection.getKeysAsIteratorOfString();
		while (iterator.hasNext())
		{
			var key = iterator.next();
			var capability = this.m_storage.getByKey(key);
			if (oFF.notNull(capability))
			{
				newContainer.addCapabilityInfo(otherCapabilitySelection.getByKey(key));
			}
		}
	}
	return newContainer;
};
oFF.CapabilityContainer.prototype.union = function(otherCapabilitySelection)
{
	var newContainer = this.clone();
	if (oFF.notNull(otherCapabilitySelection))
	{
		var iterator = otherCapabilitySelection.getKeysAsIteratorOfString();
		while (iterator.hasNext())
		{
			var key = iterator.next();
			var capability = otherCapabilitySelection.getByKey(key);
			newContainer.addCapabilityInfo(capability);
		}
	}
	return newContainer;
};
oFF.CapabilityContainer.prototype.remove = function(key)
{
	return this.m_storage.remove(key);
};
oFF.CapabilityContainer.prototype.clear = function()
{
	this.m_storage.clear();
};
oFF.CapabilityContainer.prototype.getName = function()
{
	return this.m_name;
};
oFF.CapabilityContainer.prototype.createMapByStringCopy = function()
{
	return this.m_storage.createMapByStringCopy();
};
oFF.CapabilityContainer.prototype.toString = function()
{
	var buffer = oFF.XStringBuffer.create();
	buffer.append(this.m_name);
	buffer.appendLine(" Capabilities:");
	buffer.appendLine("{");
	var capabilities = oFF.XCollectionUtils.createListCopy(this.m_storage.getValuesAsReadOnlyList());
	capabilities.sortByComparator(oFF.XComparatorName.create());
	var size = capabilities.size();
	for (var i = 0; i < size; i++)
	{
		if (i > 0)
		{
			buffer.appendLine(", ");
		}
		buffer.append(capabilities.get(i).toString());
	}
	oFF.XObjectExt.release(capabilities);
	buffer.appendNewLine();
	buffer.append("}");
	return buffer.toString();
};

oFF.VfsElementType = function() {};
oFF.VfsElementType.prototype = new oFF.XComponentType();
oFF.VfsElementType.prototype._ff_c = "VfsElementType";

oFF.VfsElementType.ELEMENT = null;
oFF.VfsElementType.FILE = null;
oFF.VfsElementType.NODE = null;
oFF.VfsElementType.MOUNT_POINT = null;
oFF.VfsElementType.DIR = null;
oFF.VfsElementType.staticSetupVfsComponentType = function()
{
	oFF.VfsElementType.ELEMENT = oFF.VfsElementType.createIoType("VfsElement", oFF.XComponentType._ROOT);
	oFF.VfsElementType.FILE = oFF.VfsElementType.createIoType("VfsFile", oFF.VfsElementType.ELEMENT);
	oFF.VfsElementType.NODE = oFF.VfsElementType.createIoType("VfsNode", oFF.VfsElementType.ELEMENT);
	oFF.VfsElementType.MOUNT_POINT = oFF.VfsElementType.createIoType("VfsDirMountPoint", oFF.VfsElementType.NODE);
	oFF.VfsElementType.DIR = oFF.VfsElementType.createIoType("VfsDir", oFF.VfsElementType.NODE);
};
oFF.VfsElementType.createIoType = function(constant, parent)
{
	var mt = new oFF.VfsElementType();
	mt.setupExt(constant, parent);
	return mt;
};

oFF.RpcBatchFunction = function() {};
oFF.RpcBatchFunction.prototype = new oFF.DfRpcFunction();
oFF.RpcBatchFunction.prototype._ff_c = "RpcBatchFunction";

oFF.RpcBatchFunction.create = function(connection, functionUri)
{
	var ocpFunction = new oFF.RpcBatchFunction();
	ocpFunction.setupFunction(connection, connection.getSystemDescription(), functionUri);
	return ocpFunction;
};
oFF.RpcBatchFunction.prototype.m_decorator = null;
oFF.RpcBatchFunction.prototype.processSynchronization = function(syncType)
{
	return true;
};
oFF.RpcBatchFunction.prototype.processFunctionExecution = function(syncType, listener, customIdentifier)
{
	if (syncType !== oFF.SyncType.NON_BLOCKING)
	{
		throw oFF.XException.createIllegalStateException("batch mode is enabled: function calls must be non-blocking");
	}
	return oFF.DfRpcFunction.prototype.processFunctionExecution.call( this , syncType, listener, customIdentifier);
};
oFF.RpcBatchFunction.prototype.endSync = function()
{
	this.setData(this.m_rpcResponse);
	oFF.DfRpcFunction.prototype.endSync.call( this );
};
oFF.RpcBatchFunction.prototype.setDecorator = function(decorator)
{
	this.m_decorator = decorator;
};
oFF.RpcBatchFunction.prototype.getDecorator = function()
{
	return this.m_decorator;
};

oFF.RpcHttpFunction = function() {};
oFF.RpcHttpFunction.prototype = new oFF.DfRpcFunction();
oFF.RpcHttpFunction.prototype._ff_c = "RpcHttpFunction";

oFF.RpcHttpFunction.BW_RPC_FUNCTION_REF = "BwRpcFunctionRef";
oFF.RpcHttpFunction.BW_SESSION_REQUEST = "BwSessionRequest";
oFF.RpcHttpFunction.REQUEST_PARAM_SERVER_TRACE_FLAG = "trace";
oFF.RpcHttpFunction.REQUEST_PARAM_SAP_STATISTICS = "sap-statistics";
oFF.RpcHttpFunction.PRINT_REQUESTS = false;
oFF.RpcHttpFunction.PRINT_RESPONSES = false;
oFF.RpcHttpFunction.DEBUG_MODE = false;
oFF.RpcHttpFunction.TEST_MODE = false;
oFF.RpcHttpFunction.TEST_MODE_LAST_REQUEST = null;
oFF.RpcHttpFunction.create = function(connection, functionUri)
{
	var ocpFunction = new oFF.RpcHttpFunction();
	ocpFunction.setupFunction(connection, connection.getSystemDescription(), functionUri);
	return ocpFunction;
};
oFF.RpcHttpFunction.prototype.m_httpClient = null;
oFF.RpcHttpFunction.prototype.m_response = null;
oFF.RpcHttpFunction.prototype.m_traceResponseFile = null;
oFF.RpcHttpFunction.prototype.m_credentialsCallCounter = 0;
oFF.RpcHttpFunction.prototype.m_sessionRequested = false;
oFF.RpcHttpFunction.prototype.m_staticURL = false;
oFF.RpcHttpFunction.prototype.releaseObject = function()
{
	this.m_httpClient = oFF.XObjectExt.release(this.m_httpClient);
	this.m_traceResponseFile = oFF.XObjectExt.release(this.m_traceResponseFile);
	oFF.DfRpcFunction.prototype.releaseObject.call( this );
};
oFF.RpcHttpFunction.prototype.getDefaultMessageLayer = function()
{
	return oFF.OriginLayer.IOLAYER;
};
oFF.RpcHttpFunction.prototype.processSynchronization = function(syncType)
{
	this.doRpcHttpProcessing();
	return true;
};
oFF.RpcHttpFunction.prototype.cancelSynchronization = function()
{
	this.addErrorWithMessage("Request was cancelled");
	this.callListeners(false);
	oFF.DfRpcFunction.prototype.cancelSynchronization.call( this );
};
oFF.RpcHttpFunction.prototype.doRpcHttpProcessing = function()
{
	var connection = this.getActionContext();
	var userManager = connection.getUserManager();
	this.m_credentialsCallCounter = this.m_credentialsCallCounter + 1;
	if (this.getRpcRequest().isFireAndForgetCall())
	{
		this.onCredentialsReady(null, null, null);
	}
	else
	{
		var extCredentials = userManager.processGetCredentials(oFF.SyncType.BLOCKING, null, null, connection, this.m_credentialsCallCounter, null, null, null);
		this.onCredentialsReady(extCredentials, extCredentials.getData(), null);
	}
};
oFF.RpcHttpFunction.prototype.setStaticURL = function(staticURL)
{
	this.m_staticURL = staticURL;
};
oFF.RpcHttpFunction.prototype.onCredentialsReady = function(extResult, personalization, customIdentifier)
{
	this.clearMessages();
	if (oFF.notNull(extResult) && extResult.hasErrors())
	{
		this.addAllMessages(extResult);
		this.endSync();
	}
	else
	{
		this.processWithPersonalisation(personalization);
	}
};
oFF.RpcHttpFunction.prototype.processWithPersonalisation = function(personalization)
{
	this.m_httpClient = oFF.XObjectExt.release(this.m_httpClient);
	var connection = this.getActionContext();
	var systemDescription = connection.getSystemDescription();
	var rpcRequest = this.getRpcRequest();
	var method = rpcRequest.getMethod();
	var cache = connection.getConnectionCache();
	var needsGetServerInfo = false;
	var needsContextId = connection.isContextIdRequired() && connection.getSessionContextId() === null;
	var isAbap = connection.getSystemDescription().getSystemType().isTypeOf(oFF.SystemType.ABAP);
	var useGetResponseForBwSession = this.getSession().hasFeature(oFF.FeatureToggleOlap.BW_SESSION_ID_VIA_GET_RESPONSE) && isAbap;
	if (method !== oFF.HttpRequestMethod.HTTP_GET && !this.getRpcRequest().isFireAndForgetCall() && !this.isServerMetadataCall())
	{
		var isAutoCsrf = this.getSession().hasFeature(oFF.FeatureToggleOlap.AUTO_CSRF_CALL);
		if (isAutoCsrf && connection.isCsrfTokenRequired() && connection.getCsrfToken() === null && connection.getCsrfRequiredCount() < 1)
		{
			needsGetServerInfo = true;
		}
		else
		{
			needsGetServerInfo = !useGetResponseForBwSession && needsContextId && !this.m_sessionRequested;
		}
	}
	this.m_sessionRequested = this.m_sessionRequested || needsContextId;
	if (needsGetServerInfo)
	{
		var synchronizationType = this.getActiveSyncType();
		if (synchronizationType === oFF.SyncType.BLOCKING)
		{
			var extResultServerMetadata = connection.getServerMetadataExt(synchronizationType, null, null, true);
			this.onServerMetadataLoaded(extResultServerMetadata, extResultServerMetadata.getData(), null);
		}
		else
		{
			connection.getServerMetadataExt(synchronizationType, this, null, true);
		}
	}
	else
	{
		var bwSessionRequest = needsContextId && useGetResponseForBwSession && method === oFF.HttpRequestMethod.HTTP_POST;
		var continueProcessing = true;
		if (bwSessionRequest)
		{
			var sessionRequest = connection.getSessionRequestSyncAction();
			if (oFF.notNull(sessionRequest) && this.getActiveSyncType() === oFF.SyncType.NON_BLOCKING)
			{
				var syncState = sessionRequest.getSyncState();
				if (syncState === oFF.SyncState.OUT_OF_SYNC || syncState === oFF.SyncState.PROCESSING)
				{
					var listenerReference = oFF.XPair.create(this, personalization);
					var rpcIdentifier = oFF.XNameGenericPair.create(oFF.RpcHttpFunction.BW_RPC_FUNCTION_REF, listenerReference);
					sessionRequest.attachListener(this, oFF.ListenerType.SPECIFIC, rpcIdentifier);
					continueProcessing = false;
				}
			}
		}
		if (continueProcessing)
		{
			this.setTraceInfo(connection.getTraceInfo());
			var httpRequest = oFF.HttpRequest.create();
			httpRequest.setFromConnectionInfo(systemDescription);
			httpRequest.setIsLogoff(rpcRequest.isLogoff());
			var httpPath = this.getFunctionUri().getPath();
			var prefix = httpRequest.getPrefix();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(prefix))
			{
				httpPath = oFF.XUri.smartPathConcatenate(prefix, httpPath, true);
				httpRequest.setPrefix(null);
			}
			httpPath = this.applySapSessionPathRewriting(httpPath, connection, httpRequest);
			httpRequest.setPath(httpPath);
			httpRequest.setMethod(method);
			httpRequest.setAcceptContentType(rpcRequest.getAcceptContentType());
			var requestType = rpcRequest.getRequestType();
			httpRequest.setRequestType(requestType);
			var headerFields = httpRequest.getHeaderFieldsBase();
			var customHeaders = connection.getCustomHeaders();
			var headerIt = customHeaders.getKeysAsIteratorOfString();
			while (headerIt.hasNext())
			{
				var headerName = headerIt.next();
				headerFields.put(headerName, customHeaders.getByKey(headerName));
			}
			if (httpRequest.getSessionCarrierType() === oFF.SessionCarrierType.SAP_CONTEXT_ID_HEADER)
			{
				headerFields.put(oFF.HttpConstants.HD_SAP_CONTEXT_ID, connection.getSapSessionContext());
			}
			if (systemDescription.isCorrelationIdActive())
			{
				headerFields.put(oFF.HttpConstants.HD_X_CORRELATION_ID, oFF.XGuid.getGuid());
			}
			var session = this.getSession();
			var bufferCid = oFF.XStringBuffer.create();
			bufferCid.append(oFF.XLibVersionUtil.getLibVersion(session.getSession()));
			bufferCid.append("[SId:");
			bufferCid.append(session.getAppSessionId());
			bufferCid.append("]");
			bufferCid.append("[CId:");
			bufferCid.append(connection.getConnectionUid());
			bufferCid.append("]");
			headerFields.put(oFF.HttpConstants.HD_SAP_CLIENT_ID, bufferCid.toString());
			var reentranceTicket = connection.getReentranceTicket();
			if (oFF.notNull(reentranceTicket))
			{
				headerFields.put(oFF.HttpConstants.HD_MYSAPSSO2, reentranceTicket);
			}
			var systemType = systemDescription.getSystemType();
			if (systemType.isTypeOf(oFF.SystemType.HANA))
			{
				var oemApplicationId = systemDescription.getOemApplicationId();
				if (oFF.notNull(oemApplicationId))
				{
					httpRequest.getHeaderFieldsBase().putString(oFF.HttpConstants.HD_OEM_APPLICATION_ID, oemApplicationId);
				}
			}
			var tenantId = systemDescription.getTenantId();
			if (oFF.notNull(personalization))
			{
				httpRequest.setFromConnectionPersonalization(personalization);
				var personalTenantId = personalization.getTenantId();
				if (oFF.notNull(personalTenantId))
				{
					tenantId = personalTenantId;
				}
				var internalUser = personalization.getInternalUser();
				if (oFF.notNull(internalUser))
				{
					var userStructure = oFF.PrFactory.createStructure();
					userStructure.putString("userName", internalUser);
					userStructure.putString("LANGUAGE", personalization.getLanguage());
					headerFields.put(oFF.HttpConstants.HD_SAP_BOC_USER_PROPERTIES, userStructure.toString());
				}
			}
			if (oFF.notNull(tenantId))
			{
				httpRequest.addQueryElement("tenant", tenantId);
			}
			var parameters = this.prepareParameters(httpRequest);
			var keys = parameters.getKeysAsIteratorOfString();
			var key;
			while (keys.hasNext())
			{
				key = keys.next();
				httpRequest.addQueryElement(key, parameters.getByKey(key));
			}
			if (connection.useSessionUrlRewrite())
			{
				httpRequest.addQueryElement(oFF.HttpConstants.QP_PARAM_SESSION_VIA_URL, "X");
			}
			this.setCsrfToken(connection, headerFields);
			if (systemDescription.getSystemType() === oFF.SystemType.UNV || systemDescription.getSystemType() === oFF.SystemType.UQAS)
			{
				this.setBoeTokenHeader(connection, headerFields);
			}
			var requestStructure = rpcRequest.getRequestStructure();
			var serializedJsonString = oFF.PrUtils.serialize(requestStructure, true, false, 0);
			if (session.isSapStatisticsEnabled())
			{
				httpRequest.addQueryElement(oFF.RpcHttpFunction.REQUEST_PARAM_SAP_STATISTICS, "true");
			}
			this.handleTracing(systemDescription, httpRequest, parameters, requestStructure, serializedJsonString);
			if (method !== oFF.HttpRequestMethod.HTTP_GET)
			{
				var requestContentType = rpcRequest.getRequestContentType();
				httpRequest.setContentType(requestContentType);
				if (requestContentType === oFF.ContentType.APPLICATION_JSON)
				{
					httpRequest.setString(serializedJsonString);
				}
				else if (requestContentType === oFF.ContentType.APPLICATION_FORM)
				{
					var buffer = oFF.XStringBuffer.create();
					var hasElement = false;
					keys = parameters.getKeysAsIteratorOfString();
					while (keys.hasNext())
					{
						if (hasElement)
						{
							buffer.append("&");
						}
						key = keys.next();
						buffer.append(oFF.XHttpUtils.encodeURIComponent(key)).append("=").append(oFF.XHttpUtils.encodeURIComponent(parameters.getByKey(key)));
						hasElement = true;
					}
					httpRequest.setString(buffer.toString());
					oFF.XObjectExt.release(buffer);
				}
				else
				{
					throw oFF.XException.createIllegalStateException("Unsupported request content type");
				}
			}
			var cookiesMasterStore = connection.getConnectionPool().getCookiesMasterStore();
			httpRequest.setCookiesMasterStore(cookiesMasterStore);
			var processingHint = this.getProcessingHint();
			if (needsContextId && oFF.notNull(processingHint))
			{
				processingHint.putBoolean(oFF.ConnectionParameters.CACHE_HINTS_ENABLED, false);
			}
			this.getSession().getHttpExchangeEnhancer().handleRequest(httpRequest, processingHint);
			if (oFF.RpcHttpFunction.DEBUG_MODE)
			{
				this.log(httpRequest.toString());
			}
			if (oFF.RpcHttpFunction.PRINT_REQUESTS && method === oFF.HttpRequestMethod.HTTP_POST)
			{
				this.printExchangeDebugInfo(httpRequest);
			}
			if (oFF.RpcHttpFunction.TEST_MODE)
			{
				oFF.RpcHttpFunction.TEST_MODE_LAST_REQUEST = httpRequest;
			}
			if (rpcRequest.getRequestType() === oFF.RpcRequestType.PREFLIGHT)
			{
				var preflightUrl = systemDescription.getPreflightUrl();
				if (oFF.XStringUtils.isNotNullAndNotEmpty(preflightUrl))
				{
					httpRequest.setPrefix(null);
				}
			}
			var tmpClient;
			var cachingMode = connection.getCachingMode();
			if (cachingMode === oFF.HttpCachingMode.L3_LIVE_NO_CACHE)
			{
				tmpClient = httpRequest.newHttpClient(session);
			}
			else
			{
				tmpClient = oFF.HttpCacheClient.createDynamicCacheClient(session, cache, httpRequest, cachingMode);
			}
			this.m_httpClient = tmpClient;
			this.setSyncChild(tmpClient);
			this.logBuffer(oFF.OriginLayer.IOLAYER, oFF.Severity.DEBUG, 0).append("doRpcHttpConnect URL: ").append(httpRequest.getUrlStringExt(true, true, false, true, true, true, true, false)).flush();
			var httpRequestIdentifier = bwSessionRequest ? oFF.RpcHttpFunction.BW_SESSION_REQUEST : "";
			var identifier = oFF.XNameGenericPair.create(httpRequestIdentifier, httpRequest);
			var httpRequestAction = tmpClient.processHttpRequest(this.getActiveSyncType(), this, identifier);
			if (bwSessionRequest)
			{
				connection.setSessionRequestSyncAction(httpRequestAction);
			}
		}
	}
};
oFF.RpcHttpFunction.prototype.handleTracing = function(systemDescription, httpRequest, parameters, requestStructure, serializedJsonString)
{
	var traceType = this.getTraceType();
	var traceInfo = this.getTraceInfo();
	if (traceType === oFF.TraceType.JSON)
	{
		var protocolTrace = requestStructure.putNewStructure("ProtocolTrace");
		var traceName = traceInfo.getTraceName();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(traceName))
		{
			protocolTrace.putString("Name", traceName);
		}
		protocolTrace.putInteger("Index", traceInfo.getTraceIndex());
	}
	else if (traceType === oFF.TraceType.BW_CATT)
	{
		httpRequest.addQueryElement(oFF.RpcHttpFunction.REQUEST_PARAM_SERVER_TRACE_FLAG, "C");
	}
	else if (traceType === oFF.TraceType.BW_STD)
	{
		httpRequest.addQueryElement(oFF.RpcHttpFunction.REQUEST_PARAM_SERVER_TRACE_FLAG, "X");
	}
	if (traceType === oFF.TraceType.FILE)
	{
		if (httpRequest.getMethod() === oFF.HttpRequestMethod.HTTP_POST)
		{
			var traceUrl = traceInfo.getTraceFolderInternal();
			if (oFF.isNull(traceUrl))
			{
				var traceFolderPath = traceInfo.getTraceFolderPath();
				var tracingFolderFile = oFF.XFile.create(this.getSession(), traceFolderPath);
				if (tracingFolderFile.isExisting() && tracingFolderFile.isDirectory())
				{
					traceUrl = tracingFolderFile.getUri().getUrl();
					traceInfo.setTraceFolderInternal(traceUrl);
				}
			}
			if (oFF.notNull(traceUrl))
			{
				this.saveTraceFile(traceUrl, systemDescription, parameters, serializedJsonString);
			}
		}
	}
	if (traceType !== oFF.TraceType.NONE)
	{
		traceInfo.incrementTraceIndex();
	}
};
oFF.RpcHttpFunction.prototype.setBoeTokenHeader = function(connection, headerFields)
{
	var token = connection.getBoeSessionToken();
	if (oFF.isNull(token))
	{
		if (this.getRpcRequest().getMethod() === oFF.HttpRequestMethod.HTTP_GET && !connection.isLogoffSent())
		{
			headerFields.put(oFF.HttpConstants.HD_BOE_SESSION_TOKEN, oFF.HttpConstants.VA_CSRF_FETCH);
		}
	}
	else
	{
		headerFields.put(oFF.HttpConstants.HD_BOE_SESSION_TOKEN, token);
	}
};
oFF.RpcHttpFunction.prototype.setCsrfToken = function(connection, headerFields)
{
	var token = connection.getCsrfToken();
	var tokenValue;
	if (this.isKeepAliveCall())
	{
		tokenValue = oFF.HttpConstants.VA_CSRF_FETCH;
	}
	else if (oFF.isNull(token))
	{
		if (this.getRpcRequest().getMethod() === oFF.HttpRequestMethod.HTTP_GET && !connection.isLogoffSent())
		{
			tokenValue = oFF.HttpConstants.VA_CSRF_FETCH;
		}
		else
		{
			tokenValue = null;
		}
	}
	else
	{
		tokenValue = token;
	}
	if (oFF.notNull(tokenValue))
	{
		headerFields.put(oFF.HttpConstants.HD_CSRF_TOKEN, tokenValue);
	}
};
oFF.RpcHttpFunction.prototype.saveTraceFile = function(traceUrl, systemDescription, parameters, serializedJsonString)
{
	var path = oFF.XStringBuffer.create();
	path.append(traceUrl);
	path.append("/").append(systemDescription.getHost());
	path.append("/").appendInt(systemDescription.getPort());
	var appName = parameters.getByKey(oFF.RpcRequestConstants.REQUEST_PARAM_TRACE_NAME);
	if (oFF.notNull(appName))
	{
		path.append("/").append(appName);
	}
	var tracePath = path.toString();
	var traceFolder = oFF.XFile.create(this.getSession(), tracePath);
	if (!traceFolder.isExisting())
	{
		traceFolder.mkdirs();
	}
	path.append("/");
	var appReqIndex = parameters.getByKey(oFF.RpcRequestConstants.REQUEST_PARAM_TRACE_REQ_INDEX);
	if (oFF.notNull(appReqIndex))
	{
		var sizeReqIndex = oFF.XString.size(appReqIndex);
		if (sizeReqIndex === 1)
		{
			path.append("00");
		}
		else if (sizeReqIndex === 2)
		{
			path.append("0");
		}
		path.append(appReqIndex);
	}
	var temp = path.toString();
	path.append("_req.json");
	var traceFilePath = path.toString();
	oFF.XObjectExt.release(path);
	var traceFile = oFF.XFile.create(this.getSession(), traceFilePath);
	if (traceFile.isExisting())
	{
		traceFile.deleteFile();
	}
	var traceResponseFilePath = oFF.XStringUtils.concatenate2(temp, "_res.json");
	this.m_traceResponseFile = oFF.XFile.create(this.getSession(), traceResponseFilePath);
	if (this.m_traceResponseFile.isExisting())
	{
		this.m_traceResponseFile.deleteFile();
	}
	if (oFF.notNull(serializedJsonString))
	{
		var byteArray = oFF.XByteArray.convertFromStringWithCharset(serializedJsonString, oFF.XCharset.UTF8);
		traceFile.saveByteArray(byteArray);
	}
};
oFF.RpcHttpFunction.prototype.applySapSessionPathRewriting = function(relativeUriPath, connection, httpRequest)
{
	var result = relativeUriPath;
	if (this.m_staticURL === false && (httpRequest.getSessionCarrierType() === oFF.SessionCarrierType.SAP_URL_REWRITING || httpRequest.isLogoff()))
	{
		var sessionUrlRewrite = connection.getSessionUrlRewrite();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(sessionUrlRewrite))
		{
			var index = oFF.XString.indexOf(relativeUriPath, "/sap/");
			if (index !== -1)
			{
				var pathStart = oFF.XString.substring(relativeUriPath, 0, index + 4);
				var pathEnd = oFF.XString.substring(relativeUriPath, index + 4, -1);
				result = oFF.XStringUtils.concatenate3(pathStart, sessionUrlRewrite, pathEnd);
			}
		}
	}
	return result;
};
oFF.RpcHttpFunction.prototype.prepareParameters = function(httpRequest)
{
	var parameters = oFF.XProperties.createByMapCopy(this.m_rpcRequest.getAdditionalParameters());
	var systemDescription = this.getActionContext().getSystemDescription();
	var language = systemDescription.getLanguage();
	httpRequest.setLanguage(language);
	var systemType = systemDescription.getSystemType();
	if (systemType.isTypeOf(oFF.SystemType.ABAP))
	{
		parameters.putString(oFF.ConnectionConstants.SAP_CLIENT, systemDescription.getClient());
		if (oFF.notNull(language) && oFF.XString.size(language) > 0)
		{
			parameters.putString(oFF.ConnectionConstants.SAP_LANGUAGE, language);
		}
	}
	var traceType = this.getTraceType();
	if (traceType !== oFF.TraceType.NONE)
	{
		var traceInfo = this.getTraceInfo();
		var traceName = traceInfo.getTraceName();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(traceName))
		{
			traceName = oFF.XString.replace(traceName, ":", ".");
			parameters.put(oFF.RpcRequestConstants.REQUEST_PARAM_TRACE_NAME, traceName);
			var index = oFF.XInteger.convertToString(traceInfo.getTraceIndex());
			parameters.put(oFF.RpcRequestConstants.REQUEST_PARAM_TRACE_REQ_INDEX, index);
			var tracePath = traceInfo.getTraceFolderPath();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(tracePath))
			{
				parameters.put(oFF.RpcRequestConstants.REQUEST_PARAM_TRACE_PATH, tracePath);
			}
		}
	}
	var queryElements = this.getFunctionUri().getQueryElements();
	if (oFF.notNull(queryElements))
	{
		for (var i = 0; i < queryElements.size(); i++)
		{
			var nameValuePair = queryElements.get(i);
			parameters.put(nameValuePair.getName(), nameValuePair.getValue());
		}
	}
	return parameters;
};
oFF.RpcHttpFunction.prototype.onHttpResponse = function(extResult, response, customIdentifier)
{
	var identifier = customIdentifier;
	var httpRequest = identifier.getObject();
	var connection = this.getActionContext();
	if (oFF.isNull(connection) || connection.isReleased())
	{
		this.addErrorExt(oFF.OriginLayer.PROTOCOL, oFF.ErrorCodes.SYSTEM_IO_HTTP, "Connection is already released", null);
		this.endSync();
	}
	else if (oFF.isNull(response))
	{
		this.clearMessages();
		this.addAllMessages(extResult);
		this.addErrorExt(oFF.OriginLayer.PROTOCOL, oFF.ErrorCodes.SYSTEM_IO_HTTP, "No response object given", null);
		this.endSync();
	}
	else if (response.isGoLiveRequired() === true && connection.getCachingMode() === oFF.HttpCachingMode.L1_INITIAL)
	{
		connection.setCachingMode(oFF.HttpCachingMode.L2_DYNAMIC);
		connection.setSessionContextId(null);
		connection.resetCsrfAndIncRequiredCount();
		connection.resetRequiredCount();
		this.clearMessages();
		this.doRpcHttpProcessing();
	}
	else
	{
		if (oFF.XString.isEqual(identifier.getName(), oFF.RpcHttpFunction.BW_RPC_FUNCTION_REF))
		{
			var waitingRpcFunction = identifier.getObject();
			waitingRpcFunction.getFirstObject().processWithPersonalisation(waitingRpcFunction.getSecondObject());
		}
		else
		{
			this.m_response = response;
			if (oFF.XString.isEqual(oFF.RpcHttpFunction.BW_SESSION_REQUEST, identifier.getName()))
			{
				connection.setSessionRequestSyncAction(null);
			}
			this.getSession().getHttpExchangeEnhancer().handleResponse(response);
			this.handleStatusCode(httpRequest, response, extResult);
			this.handleJson(response);
			this.handleTracingFoeResponse(response);
			this.handleSessionUrlRewrite(response);
			this.handleBoeSessionToken(httpRequest, response);
			this.handleCorrelationId(response);
			if (this.getRpcRequest().isFireAndForgetCall())
			{
				this.setData(this.m_rpcResponse);
				this.endSync();
			}
			else
			{
				var continueProcessing = true;
				continueProcessing = this.handleCsrf(httpRequest, response);
				if (continueProcessing)
				{
					var userManager = connection.getUserManager();
					var newAuthenticationType = this.getNewAuthenticationType(httpRequest, response);
					if (oFF.notNull(newAuthenticationType))
					{
						this.m_credentialsCallCounter = this.m_credentialsCallCounter + 1;
						userManager.processGetCredentials(oFF.SyncType.BLOCKING, this, null, connection, this.m_credentialsCallCounter, null, null, newAuthenticationType);
					}
					else
					{
						var isValid = this.isValid();
						if (!isValid && userManager.supportsOnErrorHandling())
						{
							this.m_credentialsCallCounter = this.m_credentialsCallCounter + 1;
							userManager.processGetCredentials(oFF.SyncType.BLOCKING, this, null, connection, this.m_credentialsCallCounter, this.m_response, this, null);
						}
						else
						{
							if (isValid)
							{
								userManager.notifyCredentialsSuccess(connection);
							}
							this.setData(this.m_rpcResponse);
							this.endSync();
						}
					}
				}
			}
		}
	}
};
oFF.RpcHttpFunction.prototype.handleCorrelationId = function(response)
{
	var headerFields = response.getHeaderFields();
	var correlationId = headerFields.getStringByKey(oFF.HttpConstants.HD_X_CORRELATION_ID);
	if (oFF.XStringUtils.isNullOrEmpty(correlationId))
	{
		correlationId = response.getHttpRequest().getHeaderFields().getStringByKey(oFF.HttpConstants.HD_X_CORRELATION_ID);
	}
	if (oFF.XStringUtils.isNotNullAndNotEmpty(correlationId))
	{
		this.addMessage(oFF.XMessage.createMessage(oFF.OriginLayer.IOLAYER, oFF.Severity.DEBUG, oFF.MessageCodes.CORRELATION_ID_CODE, correlationId, null, false, null));
	}
};
oFF.RpcHttpFunction.prototype.getNewAuthenticationType = function(request, response)
{
	var result = null;
	if (oFF.notNull(request) && oFF.notNull(response))
	{
		if (response.getStatusCode() === oFF.HttpStatusCode.SC_UNAUTHORIZED)
		{
			var authenticate = response.getHeaderFields().getStringByKey(oFF.HttpConstants.HD_WWW_AUTHENTICATE);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(authenticate))
			{
				if (oFF.XString.startsWith(authenticate, oFF.HttpConstants.VA_AUTHORIZATION_BASIC))
				{
					if (request.getAuthenticationType() !== oFF.AuthenticationType.BASIC)
					{
						result = oFF.AuthenticationType.BASIC;
					}
				}
			}
		}
	}
	return result;
};
oFF.RpcHttpFunction.prototype.handleTracingFoeResponse = function(response)
{
	var traceType = this.getTraceType();
	if (traceType === oFF.TraceType.FILE && oFF.notNull(this.m_traceResponseFile))
	{
		var jsonContent = response.getJsonContent();
		if (oFF.notNull(jsonContent))
		{
			var json = jsonContent.toString();
			var byteArray = oFF.XByteArray.convertFromStringWithCharset(json, oFF.XCharset.UTF8);
			this.m_traceResponseFile.saveByteArray(byteArray);
		}
	}
};
oFF.RpcHttpFunction.prototype.handleJson = function(response)
{
	var jsonObject = response.getJsonContent();
	var stringContent = response.getStringContentExt(oFF.isNull(jsonObject), -1);
	this.getRpcResponse().setRootElement(jsonObject, stringContent);
};
oFF.RpcHttpFunction.prototype.handleCsrf = function(request, response)
{
	var headerFields = response.getHeaderFields();
	var connection = this.getActionContext();
	var fetchResponse = oFF.XString.isEqual(response.getHttpRequest().getHeaderFields().getStringByKey(oFF.HttpConstants.HD_CSRF_TOKEN), oFF.HttpConstants.VA_CSRF_FETCH);
	var serverStatusCode = this.getServerStatusCode();
	if (fetchResponse && oFF.HttpStatusCode.isOk(serverStatusCode))
	{
		connection.resetCsrfAndIncRequiredCount();
	}
	var csrfToken = headerFields.getStringByKey(oFF.HttpConstants.HD_CSRF_TOKEN);
	if (oFF.isNull(csrfToken))
	{
		csrfToken = headerFields.getStringByKey(oFF.XString.toLowerCase(oFF.HttpConstants.HD_CSRF_TOKEN));
	}
	var continueProcessing = true;
	if (oFF.notNull(csrfToken))
	{
		var isGetRequest = request.getMethod() === oFF.HttpRequestMethod.HTTP_GET;
		if (isGetRequest)
		{
			if (serverStatusCode === oFF.HttpStatusCode.SC_OK)
			{
				connection.setCsrfToken(csrfToken);
			}
		}
		else
		{
			var isCsrfTokenRequired = oFF.XString.isEqual(oFF.HttpConstants.VA_CSRF_REQUIRED, csrfToken);
			if (isCsrfTokenRequired)
			{
				this.addErrorExt(oFF.OriginLayer.PROTOCOL, oFF.ErrorCodes.INVALID_STATE, "Cannot fetch csrf token from server", null);
				if (connection.getCsrfRequiredCount() < 2 && !this.isServerMetadataCall())
				{
					continueProcessing = false;
					var synchronizationType = this.getActiveSyncType();
					connection.getServerMetadataExt(synchronizationType, this, null, true);
				}
				else
				{
					connection.resetRequiredCount();
					connection.setCsrfToken(null);
					if (this.getSession().hasFeature(oFF.FeatureToggleOlap.SHARED_CSRF_TOKENS))
					{
						connection.getSystemConnect().setCsrfToken(null);
					}
				}
			}
		}
	}
	return continueProcessing;
};
oFF.RpcHttpFunction.prototype.handleSessionUrlRewrite = function(response)
{
	var connection = this.getActionContext();
	if (connection.useSessionUrlRewrite() === true)
	{
		var headerFields = response.getHeaderFields();
		var sessionUrlRewrite = headerFields.getStringByKey(oFF.HttpConstants.HD_SAP_URL_SESSION_ID);
		if (oFF.notNull(sessionUrlRewrite))
		{
			connection.setSessionUrlRewrite(sessionUrlRewrite);
		}
		else if (this.m_sessionRequested && !response.getHttpRequest().isLogoff())
		{
			this.logBuffer(oFF.OriginLayer.IOLAYER, oFF.Severity.WARNING, 0).append("New BW SessionId was requested, but the Response doesn't contain Header:").append(oFF.HttpConstants.HD_SAP_URL_SESSION_ID).append(". Url: ").append(response.getHttpRequest().getUrlStringExt(true, false, false, false, true, true, true, false)).flush();
		}
	}
};
oFF.RpcHttpFunction.prototype.handleBoeSessionToken = function(request, response)
{
	var connection = this.getActionContext();
	var systemDescription = connection.getSystemDescription();
	var systemType = systemDescription.getSystemType();
	if (systemType === oFF.SystemType.UNV || systemType === oFF.SystemType.UQAS)
	{
		var headerFields = response.getHeaderFields();
		var boeSessionToken = headerFields.getStringByKey(oFF.HttpConstants.HD_BOE_SESSION_TOKEN);
		if (oFF.notNull(boeSessionToken))
		{
			var serverStatusCode = this.getServerStatusCode();
			var isGetRequest = request.getMethod() === oFF.HttpRequestMethod.HTTP_GET;
			if (isGetRequest && serverStatusCode === oFF.HttpStatusCode.SC_OK)
			{
				connection.setBoeSessionToken(boeSessionToken);
			}
		}
	}
};
oFF.RpcHttpFunction.prototype.handleStatusCode = function(request, response, messages)
{
	this.clearMessages();
	this.addAllMessages(messages);
	var severity = oFF.Severity.DEBUG;
	var statusCode = response.getStatusCode();
	var statusDetails = response.getStatusCodeDetails();
	if (oFF.isNull(statusDetails))
	{
		statusDetails = oFF.XStringBuffer.create().append("Http Status Code: ").appendInt(response.getStatusCode()).toString();
	}
	this.setServerStatusCode(statusCode);
	this.setServerStatusDetails(statusDetails);
	if (messages.hasErrors() || oFF.HttpStatusCode.isError(statusCode))
	{
		severity = oFF.Severity.ERROR;
		var errorBuffer = oFF.XStringBuffer.create();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(statusDetails))
		{
			errorBuffer.appendLine(statusDetails);
		}
		if (statusCode === oFF.HttpStatusCode.SC_NOT_FOUND)
		{
			errorBuffer.append("Path: ").appendLine(response.getHttpRequest().getPath());
			errorBuffer.append("Request: ").append(response.getHttpRequest().getString());
		}
		if (response.isStringContentSet())
		{
			var errorStringContent = response.getString();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(errorStringContent))
			{
				if (oFF.XStringUtils.isNullOrEmpty(statusDetails) || !oFF.XString.containsString(statusDetails, errorStringContent))
				{
					errorBuffer.appendLine(errorStringContent);
				}
			}
		}
		this.addErrorExt(oFF.OriginLayer.PROTOCOL, statusCode, errorBuffer.toString(), null);
		oFF.XObjectExt.release(errorBuffer);
	}
	var url = request.getUrlStringWithoutAuthentication();
	this.logBuffer(oFF.OriginLayer.IOLAYER, severity, 0).append("onHttpResponse: URL:").append(url).appendNewLine().append("Http Status: ").appendInt(statusCode).append(" ").append(statusDetails).append(messages.getSummary()).flush();
	if (oFF.RpcHttpFunction.DEBUG_MODE)
	{
		this.printResponseDebugInfo(response);
	}
	if (oFF.RpcHttpFunction.PRINT_RESPONSES)
	{
		this.printExchangeDebugInfo(response);
	}
};
oFF.RpcHttpFunction.prototype.onServerMetadataLoaded = function(extResult, serverMetadata, customIdentifier)
{
	this.clearMessages();
	this.doRpcHttpProcessing();
};
oFF.RpcHttpFunction.prototype.printResponseDebugInfo = function(response) {};
oFF.RpcHttpFunction.prototype.printExchangeDebugInfo = function(httpExchange) {};
oFF.RpcHttpFunction.prototype.getProcess = function()
{
	return this.getSession();
};

oFF.ServerGetCallAction = function() {};
oFF.ServerGetCallAction.prototype = new oFF.ServerCallAction();
oFF.ServerGetCallAction.prototype._ff_c = "ServerGetCallAction";

oFF.ServerGetCallAction.createAndRun = function(syncType, context, listener, customIdentifier, url)
{
	var action = new oFF.ServerGetCallAction();
	action.m_url = url;
	action.setupActionAndRun(syncType, listener, customIdentifier, context);
	return action;
};
oFF.ServerGetCallAction.prototype.m_url = null;
oFF.ServerGetCallAction.prototype.getUri = function(connection)
{
	return oFF.XUri.createFromUrl(this.m_url);
};
oFF.ServerGetCallAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		var storyJson = response.getRootElement();
		this.setData(response);
		if (oFF.isNull(storyJson))
		{
			this.addError(0, "No story returned");
		}
	}
	this.endSync();
};
oFF.ServerGetCallAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onServerCallExecuted(extResult, data, customIdentifier);
};
oFF.ServerGetCallAction.prototype.releaseObject = function()
{
	this.m_url = null;
	oFF.ServerCallAction.prototype.releaseObject.call( this );
};

oFF.ServerLoginAction = function() {};
oFF.ServerLoginAction.prototype = new oFF.ServerCallAction();
oFF.ServerLoginAction.prototype._ff_c = "ServerLoginAction";

oFF.ServerLoginAction.createAndRun = function(syncType, connectionContainer, listener, customIdentifier)
{
	var object = new oFF.ServerLoginAction();
	object.setupActionAndRun(syncType, listener, customIdentifier, connectionContainer);
	return object;
};
oFF.ServerLoginAction.prototype.getUri = function(connection)
{
	return oFF.XUri.createFromUrl(connection.getSystemDescription().getSystemType().getLogonPath());
};

oFF.ServerPreflightAction = function() {};
oFF.ServerPreflightAction.prototype = new oFF.ServerCallAction();
oFF.ServerPreflightAction.prototype._ff_c = "ServerPreflightAction";

oFF.ServerPreflightAction.createAndRun = function(syncType, connectionContainer, listener, customIdentifier)
{
	var object = new oFF.ServerPreflightAction();
	object.setupActionAndRun(syncType, listener, customIdentifier, connectionContainer);
	return object;
};
oFF.ServerPreflightAction.prototype.onFunctionExecutedInternal = function(extResult, response, customIdentifier)
{
	var connectionContainer = this.getActionContext();
	connectionContainer.setIsPreflightNeeded(false);
};
oFF.ServerPreflightAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onServerCallExecuted(extResult, data, customIdentifier);
};
oFF.ServerPreflightAction.prototype.getUri = function(connection)
{
	return connection.getPreflightUri();
};
oFF.ServerPreflightAction.prototype.getRequestType = function()
{
	return oFF.RpcRequestType.PREFLIGHT;
};

oFF.StandaloneSystemLandscape = function() {};
oFF.StandaloneSystemLandscape.prototype = new oFF.DfProcessContext();
oFF.StandaloneSystemLandscape.prototype._ff_c = "StandaloneSystemLandscape";

oFF.StandaloneSystemLandscape.s_masterSystemDescription = null;
oFF.StandaloneSystemLandscape.getStaticMasterSystemDescription = function()
{
	return oFF.StandaloneSystemLandscape.s_masterSystemDescription;
};
oFF.StandaloneSystemLandscape.setStaticMasterSystemDescription = function(masterSystem)
{
	oFF.StandaloneSystemLandscape.s_masterSystemDescription = masterSystem;
};
oFF.StandaloneSystemLandscape.create = function(sessionContext)
{
	var landscape = new oFF.StandaloneSystemLandscape();
	var process = null;
	if (oFF.notNull(sessionContext))
	{
		process = sessionContext.getProcess();
	}
	landscape.setupLandscape(process);
	return landscape;
};
oFF.StandaloneSystemLandscape.prototype.m_roleMap = null;
oFF.StandaloneSystemLandscape.prototype.m_systemMap = null;
oFF.StandaloneSystemLandscape.prototype.setupLandscape = function(process)
{
	this.setupProcessContext(process);
	this.m_systemMap = oFF.XHashMapByString.create();
	this.m_roleMap = oFF.XHashMapOfStringByString.create();
	if (oFF.notNull(oFF.StandaloneSystemLandscape.s_masterSystemDescription))
	{
		var properties = oFF.XProperties.createByMapCopy(oFF.StandaloneSystemLandscape.s_masterSystemDescription.getProperties());
		this.setSystem(oFF.StandaloneSystemLandscape.s_masterSystemDescription.getSystemName(), properties);
		this.setMasterSystemName(oFF.StandaloneSystemLandscape.s_masterSystemDescription.getSystemName());
	}
};
oFF.StandaloneSystemLandscape.prototype.releaseObject = function()
{
	this.m_systemMap = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_systemMap);
	oFF.DfProcessContext.prototype.releaseObject.call( this );
};
oFF.StandaloneSystemLandscape.prototype.getComponentType = function()
{
	return oFF.KernelComponentType.SYSTEM_LANDSCAPE;
};
oFF.StandaloneSystemLandscape.prototype.getApplication = oFF.noSupport;
oFF.StandaloneSystemLandscape.prototype.getChildElements = function()
{
	return oFF.XReadOnlyListWrapper.create(this.m_systemMap.getValuesAsReadOnlyList());
};
oFF.StandaloneSystemLandscape.prototype.clearSystems = function()
{
	this.m_systemMap.clear();
};
oFF.StandaloneSystemLandscape.prototype.createSystem = function()
{
	return oFF.SystemDescription.createExt(this.getSession(), this, null, null);
};
oFF.StandaloneSystemLandscape.prototype.existsSystemName = function(name)
{
	return this.m_systemMap.containsKey(name);
};
oFF.StandaloneSystemLandscape.prototype.getSystemDescription = function(name)
{
	if (oFF.isNull(name))
	{
		return this.getMasterSystem();
	}
	return this.m_systemMap.getByKey(name);
};
oFF.StandaloneSystemLandscape.prototype.getSystemNames = function()
{
	var systemNames = oFF.XListOfString.createFromReadOnlyList(this.m_systemMap.getKeysAsReadOnlyListOfString());
	systemNames.sortByDirection(oFF.XSortDirection.ASCENDING);
	return systemNames;
};
oFF.StandaloneSystemLandscape.prototype.removeSystem = function(name)
{
	this.m_systemMap.remove(name);
};
oFF.StandaloneSystemLandscape.prototype.setSystemByUri = function(name, uri, systemType)
{
	var systemDesc = oFF.SystemDescription.createExt(this.getSession(), this, name, null);
	this.setSystemByDescription(systemDesc);
	systemDesc.setAuthenticationType(uri.getAuthenticationType());
	if (uri.getUser() !== null)
	{
		systemDesc.setUser(uri.getUser());
		systemDesc.setPassword(uri.getPassword());
	}
	systemDesc.setHost(uri.getHost());
	systemDesc.setPort(uri.getPort());
	systemDesc.setProtocolType(oFF.ProtocolType.lookup(uri.getScheme()));
	systemDesc.setPath(uri.getPath());
	var queryElements = uri.getQueryElements();
	if (oFF.notNull(queryElements))
	{
		for (var i = 0; i < queryElements.size(); i++)
		{
			var queryElement = queryElements.get(i);
			var key = oFF.XString.toUpperCase(queryElement.getName());
			var value = queryElement.getValue();
			if (oFF.XString.isEqual(oFF.ConnectionParameters.TAGS, key))
			{
				systemDesc.setTags(value);
			}
			else if (oFF.XString.isEqual(oFF.ConnectionParameters.SYSTEM_TYPE, key) || oFF.XString.isEqual(oFF.ConnectionParameters.SYSTYPE, key))
			{
				value = oFF.XString.toUpperCase(value);
				systemDesc.setSystemType(oFF.SystemType.lookup(value));
			}
			else if (oFF.XString.isEqual(oFF.ConnectionParameters.LANGUAGE, key))
			{
				value = oFF.XString.toUpperCase(value);
				systemDesc.setLanguage(value);
			}
			else if (oFF.XString.isEqual(oFF.ConnectionParameters.TOKEN_VALUE, key))
			{
				systemDesc.setAccessToken(value);
			}
			else if (oFF.XString.isEqual(oFF.ConnectionParameters.AUTHENTICATION_TYPE, key))
			{
				var authtype = oFF.XString.toUpperCase(value);
				var lookup = oFF.AuthenticationType.lookup(authtype);
				systemDesc.setAuthenticationType(lookup);
			}
		}
	}
	if (oFF.notNull(systemType))
	{
		systemDesc.setSystemType(systemType);
	}
	return systemDesc;
};
oFF.StandaloneSystemLandscape.prototype.setSystem = function(name, properties)
{
	var systemDesc = oFF.SystemDescription.createExt(this.getSession(), this, name, properties);
	this.setSystemByDescription(systemDesc);
	return systemDesc;
};
oFF.StandaloneSystemLandscape.prototype.setSystemByDescription = function(systemDescription)
{
	var systemName = systemDescription.getSystemName();
	if (oFF.isNull(systemName))
	{
		systemName = systemDescription.getName();
		if (oFF.isNull(systemName))
		{
			throw oFF.XException.createIllegalArgumentException("NULL not allowed: systemDescription.getName() or .getSystemName() must not be NULL.");
		}
	}
	this.m_systemMap.put(systemName, systemDescription);
};
oFF.StandaloneSystemLandscape.prototype.getMasterSystemName = function()
{
	return this.getDefaultSystemName(oFF.SystemRole.MASTER);
};
oFF.StandaloneSystemLandscape.prototype.setMasterSystemName = function(name)
{
	this.setDefaultSystemName(oFF.SystemRole.MASTER, name);
};
oFF.StandaloneSystemLandscape.prototype.getMasterSystem = function()
{
	var masterSystemName = this.getDefaultSystemName(oFF.SystemRole.MASTER);
	return this.m_systemMap.getByKey(masterSystemName);
};
oFF.StandaloneSystemLandscape.prototype.getDefaultSystemName = function(systemRole)
{
	return this.m_roleMap.getByKey(systemRole.getName());
};
oFF.StandaloneSystemLandscape.prototype.setDefaultSystemName = function(systemRole, name)
{
	this.m_roleMap.put(systemRole.getName(), name);
};
oFF.StandaloneSystemLandscape.prototype.getDefaultSystem = function(systemRole)
{
	var name = this.m_roleMap.getByKey(systemRole.getName());
	return this.getSystemDescription(name);
};
oFF.StandaloneSystemLandscape.prototype.getSystemsByRole = function(role)
{
	var systems = oFF.XList.create();
	var iterator = this.m_systemMap.getIterator();
	while (iterator.hasNext())
	{
		var systemDescription = iterator.next();
		if (oFF.isNull(role))
		{
			systems.add(systemDescription);
		}
		else
		{
			var sysRoles = systemDescription.getRoles();
			if (sysRoles.contains(role))
			{
				systems.add(systemDescription);
			}
		}
	}
	oFF.XObjectExt.release(iterator);
	return systems;
};
oFF.StandaloneSystemLandscape.prototype.hasChildren = function()
{
	return this.m_systemMap.size() > 0;
};
oFF.StandaloneSystemLandscape.prototype.getChildSetState = function()
{
	return oFF.ChildSetState.COMPLETE;
};
oFF.StandaloneSystemLandscape.prototype.getName = function()
{
	return "SystemLandscape";
};
oFF.StandaloneSystemLandscape.prototype.getText = function()
{
	return "System Landscape";
};
oFF.StandaloneSystemLandscape.prototype.isNode = function()
{
	return true;
};
oFF.StandaloneSystemLandscape.prototype.isLeaf = function()
{
	return false;
};
oFF.StandaloneSystemLandscape.prototype.getTagValue = function(tagName)
{
	return null;
};
oFF.StandaloneSystemLandscape.prototype.processChildFetch = oFF.noSupport;
oFF.StandaloneSystemLandscape.prototype.getContentElement = function()
{
	return this;
};
oFF.StandaloneSystemLandscape.prototype.getContentConstant = function()
{
	return null;
};
oFF.StandaloneSystemLandscape.prototype.replaceOriginsWithMirror = function()
{
	var systems = this.m_systemMap.getValuesAsReadOnlyList();
	var mirrors = oFF.XListOfString.create();
	for (var i = 0; i < systems.size(); i++)
	{
		var system = systems.get(i);
		var origin = system.getProperties().getStringByKey(oFF.ConnectionParameters.ORIGIN);
		if (oFF.notNull(origin))
		{
			mirrors.add(system.getSystemName());
		}
	}
	for (var k = 0; k < mirrors.size(); k++)
	{
		var mirrorName = mirrors.get(k);
		var mirrorSystem = this.m_systemMap.getByKey(mirrorName);
		var originName = mirrorSystem.getProperties().getStringByKey(oFF.ConnectionParameters.ORIGIN);
		var originSystem = this.m_systemMap.getByKey(originName);
		if (oFF.notNull(originSystem))
		{
			this.m_systemMap.remove(mirrorName);
			this.m_systemMap.remove(originName);
			var mirrorBase = mirrorSystem;
			mirrorBase.setName(originName);
			this.m_systemMap.put(originName, mirrorBase);
		}
	}
};
oFF.StandaloneSystemLandscape.prototype.enforceUseSecure = function()
{
	var useSecure = false;
	var session = this.getSession();
	if (oFF.notNull(session))
	{
		useSecure = session.getEnvironment().getBooleanByKeyExt(oFF.XEnvironmentConstants.FIREFLY_SECURE, false);
	}
	return useSecure;
};
oFF.StandaloneSystemLandscape.prototype.toString = function()
{
	var sb = oFF.XStringBuffer.create();
	sb.appendLine("System landscape");
	if (oFF.XCollectionUtils.hasElements(this.m_systemMap))
	{
		var systemNameIterator = this.m_systemMap.getKeysAsIteratorOfString();
		while (systemNameIterator.hasNext())
		{
			var systemName = systemNameIterator.next();
			var systemDescription = this.m_systemMap.getByKey(systemName);
			if (oFF.isNull(systemDescription))
			{
				continue;
			}
			sb.appendNewLine();
			sb.append(systemDescription.toString());
		}
	}
	return sb.toString();
};

oFF.XHttpFile = function() {};
oFF.XHttpFile.prototype = new oFF.DfXFileNonBlocking();
oFF.XHttpFile.prototype._ff_c = "XHttpFile";

oFF.XHttpFile._create = function(session, fileSystem, vfsUri, targetUri)
{
	var file = new oFF.XHttpFile();
	file.setupHttpFile(session, fileSystem, vfsUri, targetUri);
	return file;
};
oFF.XHttpFile.prototype.m_isDir = false;
oFF.XHttpFile.prototype.m_isExecutable = false;
oFF.XHttpFile.prototype.setupHttpFile = function(session, fileSystem, vfsUri, targetUri)
{
	this.setupFile(session, fileSystem, vfsUri, targetUri);
	this.m_targetUri = targetUri;
	this.m_isDir = oFF.XString.endsWith(this.m_targetUri.getPath(), "/");
};
oFF.XHttpFile.prototype.processLoad = function(syncType, listener, customIdentifier, compression)
{
	return oFF.XHttpFileLoadAction.createAndRun(syncType, this, listener, customIdentifier);
};
oFF.XHttpFile.prototype.processFetchChildren = function(syncType, listener, customIdentifier)
{
	return oFF.XHttpFileDirAction2.createAndRun(syncType, this, listener, customIdentifier);
};
oFF.XHttpFile.prototype.isDirectory = function()
{
	return this.m_isDir;
};
oFF.XHttpFile.prototype.setIsDirectory = function(isDirectory)
{
	this.m_isDir = isDirectory;
};
oFF.XHttpFile.prototype.isExecutable = function()
{
	return this.m_isExecutable;
};
oFF.XHttpFile.prototype.setIsExecutable = function(isExecutable)
{
	this.m_isExecutable = isExecutable;
};
oFF.XHttpFile.prototype.hasChildren = function()
{
	return true;
};
oFF.XHttpFile.prototype.isExisting = function()
{
	var extRes = this.processLoad(oFF.SyncType.BLOCKING, null, null, oFF.CompressionType.NONE);
	return !extRes.hasErrors();
};
oFF.XHttpFile.prototype.getLastModifiedTimestamp = function()
{
	return 0;
};
oFF.XHttpFile.prototype.isHidden = function()
{
	return false;
};
oFF.XHttpFile.prototype.processMkdir = oFF.noSupport;
oFF.XHttpFile.prototype.processRename = oFF.noSupport;
oFF.XHttpFile.prototype.processDelete = oFF.noSupport;
oFF.XHttpFile.prototype.processSave = oFF.noSupport;

oFF.XRemoteHttpFile = function() {};
oFF.XRemoteHttpFile.prototype = new oFF.DfXFileNonBlocking();
oFF.XRemoteHttpFile.prototype._ff_c = "XRemoteHttpFile";

oFF.XRemoteHttpFile._create = function(session, fileSystem, vfsUri, targetUri)
{
	var file = new oFF.XRemoteHttpFile();
	file.setupHttpFile(session, fileSystem, vfsUri, targetUri);
	return file;
};
oFF.XRemoteHttpFile.prototype.m_isDir = false;
oFF.XRemoteHttpFile.prototype.m_isExecutable = false;
oFF.XRemoteHttpFile.prototype.m_metadataLoaded = false;
oFF.XRemoteHttpFile.prototype.m_existing = false;
oFF.XRemoteHttpFile.prototype.setupHttpFile = function(session, fileSystem, vfsUri, targetUri)
{
	this.setupFile(session, fileSystem, vfsUri, targetUri);
	this.m_targetUri = targetUri;
};
oFF.XRemoteHttpFile.prototype.processLoad = function(syncType, listener, customIdentifier, compression)
{
	return this.processInternalLoad(syncType, oFF.XRemoteHttpFileRequestAdapter.create( function(fileRequestAction){
		var data = fileRequestAction.getData();
		if (oFF.notNull(listener))
		{
			listener.onFileLoaded(fileRequestAction, data, data.getFileContent(), customIdentifier);
		}
	}.bind(this)));
};
oFF.XRemoteHttpFile.prototype.processInternalLoad = function(syncType, listener)
{
	var requestAction = oFF.XRemoteHttpFileRequestAction.create(syncType, this, listener, oFF.XRemoteHttpFileRequestAction.LOAD);
	requestAction.process();
	return requestAction;
};
oFF.XRemoteHttpFile.prototype.processFetchChildren = function(syncType, listener, customIdentifier)
{
	return this.processInternalLoad(syncType, oFF.XRemoteHttpFileRequestAdapter.create( function(fileRequestAction){
		var data = fileRequestAction.getData();
		if (oFF.notNull(listener))
		{
			listener.onChildrenFetched(fileRequestAction, data, customIdentifier);
		}
	}.bind(this)));
};
oFF.XRemoteHttpFile.prototype.isDirectory = function()
{
	this.ensureLoaded();
	return this.m_isDir;
};
oFF.XRemoteHttpFile.prototype.setIsDirectory = function(isDirectory)
{
	this.m_isDir = isDirectory;
};
oFF.XRemoteHttpFile.prototype.isExecutable = function()
{
	this.ensureLoaded();
	return this.m_isExecutable;
};
oFF.XRemoteHttpFile.prototype.setIsExecutable = function(isExecutable)
{
	this.m_isExecutable = isExecutable;
};
oFF.XRemoteHttpFile.prototype.hasChildren = function()
{
	return this.isDirectory();
};
oFF.XRemoteHttpFile.prototype.isMetadataLoaded = function()
{
	return this.m_metadataLoaded;
};
oFF.XRemoteHttpFile.prototype.setMetadataLoaded = function(metadataLoaded)
{
	this.m_metadataLoaded = metadataLoaded;
};
oFF.XRemoteHttpFile.prototype.isExisting = function()
{
	this.ensureLoaded();
	return this.m_existing;
};
oFF.XRemoteHttpFile.prototype.ensureLoaded = function()
{
	if (!this.m_metadataLoaded)
	{
		this.processInternalLoad(oFF.SyncType.BLOCKING, null);
	}
};
oFF.XRemoteHttpFile.prototype.setExisting = function(existing)
{
	this.m_existing = existing;
};
oFF.XRemoteHttpFile.prototype.getLastModifiedTimestamp = function()
{
	return 0;
};
oFF.XRemoteHttpFile.prototype.isHidden = function()
{
	return false;
};
oFF.XRemoteHttpFile.prototype.processMkdir = function(syncType, listener, customIdentifier, includeParentDirs)
{
	var listenerAdapter = oFF.XRemoteHttpFileRequestAdapter.create( function(fileRequestAction){
		var data = fileRequestAction.getData();
		if (oFF.notNull(listener))
		{
			listener.onDirectoryCreated(fileRequestAction, data, customIdentifier);
		}
	}.bind(this));
	var requestAction = oFF.XRemoteHttpFileRequestAction.create(syncType, this, listenerAdapter, oFF.XRemoteHttpFileRequestAction.UPDATE);
	this.setIsDirectory(true);
	requestAction.process();
	return requestAction;
};
oFF.XRemoteHttpFile.prototype.processRename = function(syncType, listener, customIdentifier, destFile)
{
	var listenerAdapter = oFF.XRemoteHttpFileRequestAdapter.create( function(fileRequestAction){
		var data = fileRequestAction.getData();
		if (oFF.notNull(listener))
		{
			listener.onFileRenamed(fileRequestAction, data, customIdentifier);
		}
	}.bind(this));
	var requestAction = oFF.XRemoteHttpFileRequestAction.create(syncType, this, listenerAdapter, oFF.XRemoteHttpFileRequestAction.UPDATE);
	requestAction.setDestinationFile(destFile);
	requestAction.process();
	return requestAction;
};
oFF.XRemoteHttpFile.prototype.processDelete = function(syncType, listener, customIdentifier)
{
	var listenerAdapter = oFF.XRemoteHttpFileRequestAdapter.create( function(fileRequestAction){
		var data = fileRequestAction.getData();
		if (oFF.notNull(listener))
		{
			listener.onFileDeleted(fileRequestAction, data, customIdentifier);
		}
	}.bind(this));
	var requestAction = oFF.XRemoteHttpFileRequestAction.create(syncType, this, listenerAdapter, oFF.XRemoteHttpFileRequestAction.DELETE);
	requestAction.process();
	return requestAction;
};
oFF.XRemoteHttpFile.prototype.processSave = function(syncType, listener, customIdentifier, content, compression)
{
	this.setFileContent(content);
	var listenerAdapter = oFF.XRemoteHttpFileRequestAdapter.create( function(fileRequestAction){
		var data = fileRequestAction.getData();
		if (oFF.notNull(listener))
		{
			listener.onFileSaved(fileRequestAction, data, content, customIdentifier);
		}
	}.bind(this));
	var requestAction = oFF.XRemoteHttpFileRequestAction.create(syncType, this, listenerAdapter, oFF.XRemoteHttpFileRequestAction.UPDATE);
	requestAction.process();
	return requestAction;
};
oFF.XRemoteHttpFile.prototype.updateName = function(fileName)
{
	this.m_vfsUri.setPath(oFF.XStringUtils.concatenate3(this.m_vfsUri.getParentPath(), "/", fileName));
	this.m_targetUri.setPath(oFF.XStringUtils.concatenate3(this.m_targetUri.getParentPath(), "/", fileName));
};

oFF.PrgExecuteAction = function() {};
oFF.PrgExecuteAction.prototype = new oFF.XFileActionExecute();
oFF.PrgExecuteAction.prototype._ff_c = "PrgExecuteAction";

oFF.PrgExecuteAction.create = function(session, file)
{
	var newObj = new oFF.PrgExecuteAction();
	newObj.setupSessionContext(session);
	newObj.setData(file);
	return newObj;
};

oFF.KernelImplModule = function() {};
oFF.KernelImplModule.prototype = new oFF.DfModule();
oFF.KernelImplModule.prototype._ff_c = "KernelImplModule";

oFF.KernelImplModule.s_module = null;
oFF.KernelImplModule.getInstance = function()
{
	if (oFF.isNull(oFF.KernelImplModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.KernelApiBaseModule.getInstance());
		oFF.KernelImplModule.s_module = oFF.DfModule.startExt(new oFF.KernelImplModule());
		oFF.ProgramContainerFactory.staticSetup();
		oFF.ProgramRegistration.staticSetup();
		oFF.ModuleManager.staticSetup();
		oFF.ModuleLoaderDummy.staticSetup();
		oFF.ModuleResources.staticSetup();
		oFF.ProgramResources.staticSetup();
		oFF.SigSelManager.staticSetup();
		oFF.Kernel.staticSetup();
		oFF.VfsMatchResultType.staticSetup();
		oFF.VfsElementType.staticSetupVfsComponentType();
		oFF.BasicCredentialsProvider.staticSetup();
		oFF.XHttpFileSystemFactory.staticSetup();
		oFF.XWebDAVFactory.staticSetup();
		oFF.SubSysUserProfileBootstrapFactory.staticSetup();
		oFF.ProgramRegistration.setProgramFactory(oFF.SubSysSystemLandscapePrg.DEFAULT_PROGRAM_NAME, new oFF.SubSysSystemLandscapePrg());
		oFF.ProgramRegistration.setProgramFactory(oFF.SubSysUserProfilePrg.DEFAULT_PROGRAM_NAME, new oFF.SubSysUserProfilePrg());
		oFF.ProgramRegistration.setProgramFactory(oFF.SubSysCachePrg.DEFAULT_PROGRAM_NAME, new oFF.SubSysCachePrg());
		oFF.DfModule.stopExt(oFF.KernelImplModule.s_module);
	}
	return oFF.KernelImplModule.s_module;
};
oFF.KernelImplModule.prototype.getName = function()
{
	return "ff1030.kernel.impl";
};

oFF.KernelImplModule.getInstance();

return sap.firefly;
	} );