/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
[
"sap/zen/dsh/firefly/ff0080.structures.native"
],
function(oFF)
{
"use strict";

oFF.XHierarchyComparator = function() {};
oFF.XHierarchyComparator.prototype = new oFF.XObject();
oFF.XHierarchyComparator.prototype._ff_c = "XHierarchyComparator";

oFF.XHierarchyComparator.create = function()
{
	return new oFF.XHierarchyComparator();
};
oFF.XHierarchyComparator.prototype.compare = function(o1, o2)
{
	if (o1.isNode())
	{
		if (o2.isLeaf())
		{
			return -1;
		}
	}
	else
	{
		if (o2.isNode())
		{
			return 1;
		}
	}
	var s1 = o1.getName();
	var s2 = o2.getName();
	return oFF.XString.compare(s1, s2);
};

oFF.XHierarchyResult = function() {};
oFF.XHierarchyResult.prototype = new oFF.XObject();
oFF.XHierarchyResult.prototype._ff_c = "XHierarchyResult";

oFF.XHierarchyResult.create = function(parentNode, list)
{
	var newObj = new oFF.XHierarchyResult();
	newObj.m_list = list;
	newObj.m_parentNode = parentNode;
	return newObj;
};
oFF.XHierarchyResult.prototype.m_parentNode = null;
oFF.XHierarchyResult.prototype.m_list = null;
oFF.XHierarchyResult.prototype.getChildren = function()
{
	return this.m_list;
};
oFF.XHierarchyResult.prototype.getHierarchyParentNode = function()
{
	return this.m_parentNode;
};

oFF.XCacheProviderFactory = function() {};
oFF.XCacheProviderFactory.prototype = new oFF.XObject();
oFF.XCacheProviderFactory.prototype._ff_c = "XCacheProviderFactory";

oFF.XCacheProviderFactory.s_factories = null;
oFF.XCacheProviderFactory.DRIVER_MEMORY = "memory";
oFF.XCacheProviderFactory.DRIVER_FILE = "file";
oFF.XCacheProviderFactory.DRIVER_LOCAL_STORAGE = "ls";
oFF.XCacheProviderFactory.DRIVER_INDEX_DB = "idb";
oFF.XCacheProviderFactory.PARAMETER_URL = "url";
oFF.XCacheProviderFactory.registerFactory = function(name, factory)
{
	if (oFF.isNull(oFF.XCacheProviderFactory.s_factories))
	{
		oFF.XCacheProviderFactory.s_factories = oFF.XHashMapByString.create();
	}
	if (oFF.notNull(name))
	{
		oFF.XCacheProviderFactory.s_factories.put(name, factory);
	}
};
oFF.XCacheProviderFactory.createDeviceCacheAccess = function(session, driverName)
{
	var newCacheAccess = null;
	if (oFF.notNull(oFF.XCacheProviderFactory.s_factories))
	{
		var factory = oFF.XCacheProviderFactory.s_factories.getByKey(driverName);
		if (oFF.notNull(factory))
		{
			newCacheAccess = factory.newDeviceCacheAccess(session, driverName);
		}
	}
	return newCacheAccess;
};

oFF.XFile = {

	GZIP_EXTENSION:".gz",
	SLASH:"/",
	BACK_SLASH:"\\",
	COLON:":",
	FILE_SCHEMA_URL:"file://",
	FILE_SCHEMA:"file",
	URL_PATTERN:"://",
	CURRENT_DIR:".",
	PARENT_DIR:"..",
	NATIVE_SLASH:null,
	IS_SUPPORTED:false,
	DEBUG_MODE:false,
	create:function(session, autoDetectPath)
	{
			return oFF.XFile.createExt(session, autoDetectPath, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.NONE);
	},
	createByNativePath:function(session, nativePath)
	{
			return oFF.XFile.createExt(session, nativePath, oFF.PathFormat.NATIVE, oFF.VarResolveMode.NONE);
	},
	createFromEnvVar:function(session, environmentVariable, relativePath)
	{
			var sdkPath = oFF.XStringUtils.concatenate5(oFF.XEnvironment.VAR_START, environmentVariable, oFF.XEnvironment.VAR_END, oFF.XFile.SLASH, relativePath);
		return oFF.XFile.createExt(session, sdkPath, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
	},
	createExt:function(session, path, pathFormat, varResolveMode)
	{
			var file = null;
		var uri = oFF.XUri.createFromFileSystemPath(session, path, pathFormat, varResolveMode);
		if (oFF.notNull(uri))
		{
			file = oFF.XFile.createByUri(session, uri);
		}
		return file;
	},
	createByUri:function(session, uri)
	{
			var file = null;
		if (oFF.notNull(uri))
		{
			var fsm = session.getFileSystemManager();
			var fileSystem = fsm.getFileSystemByUri(uri);
			if (oFF.notNull(fileSystem))
			{
				file = fileSystem.newFile(session, uri, uri);
			}
		}
		return file;
	},
	setNativeSlash:function(slash)
	{
			oFF.XFile.NATIVE_SLASH = slash;
		oFF.XUri.PATH_SEPARATOR_NATIVE_FS = slash;
	},
	convertToUri:function(session, path, pathFormat, varResolveMode)
	{
			return oFF.XUri.createFromFileSystemPath(session, path, pathFormat, varResolveMode);
	}
};

oFF.XFileSystemFactory = function() {};
oFF.XFileSystemFactory.prototype = new oFF.XObject();
oFF.XFileSystemFactory.prototype._ff_c = "XFileSystemFactory";

oFF.XFileSystemFactory.s_factory = null;
oFF.XFileSystemFactory.staticSetupFactory = function()
{
	oFF.XFileSystemFactory.s_factory = oFF.XHashMapByString.create();
};
oFF.XFileSystemFactory.registerFactory = function(type, factory)
{
	if (oFF.notNull(type))
	{
		oFF.XFileSystemFactory.s_factory.put(type.getName(), factory);
	}
};
oFF.XFileSystemFactory.create = function(session, type)
{
	var factory = oFF.XFileSystemFactory.s_factory.getByKey(type.getName());
	if (oFF.notNull(factory))
	{
		return factory.newFileSystem(session, type);
	}
	else
	{
		return null;
	}
};

oFF.GzipFileHelper = function() {};
oFF.GzipFileHelper.prototype = new oFF.XObject();
oFF.GzipFileHelper.prototype._ff_c = "GzipFileHelper";

oFF.GzipFileHelper.BREAK_LINE = null;
oFF.GzipFileHelper.create = function()
{
	var obj = new oFF.GzipFileHelper();
	obj.setupExt(oFF.PrFactory.createStructure(), null);
	return obj;
};
oFF.GzipFileHelper.getBreakLineArray = function()
{
	if (oFF.isNull(oFF.GzipFileHelper.BREAK_LINE))
	{
		oFF.GzipFileHelper.BREAK_LINE = oFF.XByteArray.convertFromString("\n");
	}
	return oFF.GzipFileHelper.BREAK_LINE;
};
oFF.GzipFileHelper.createWithContent = function(contentTable, content)
{
	var obj = new oFF.GzipFileHelper();
	obj.setupExt(contentTable, content);
	return obj;
};
oFF.GzipFileHelper.prototype.m_previousEndIndex = 0;
oFF.GzipFileHelper.prototype.m_contentTable = null;
oFF.GzipFileHelper.prototype.m_content = null;
oFF.GzipFileHelper.prototype.setupExt = function(contentTable, content)
{
	this.m_contentTable = contentTable;
	this.m_content = content;
};
oFF.GzipFileHelper.prototype.putContent = function(key, content)
{
	if (oFF.isNull(content) || this.isFileContentEmpty(content))
	{
		return;
	}
	var binaryContent = this.extractBytes(content);
	var entry = this.m_contentTable.putNewStructure(key);
	var endIndex = -1;
	if (oFF.isNull(this.m_content))
	{
		this.m_content = binaryContent;
		endIndex = binaryContent.size();
	}
	else
	{
		var all = oFF.XByteArray.create(null, this.m_content.size() + binaryContent.size() + 1);
		oFF.XByteArray.copy(this.m_content, 0, all, 0, this.m_content.size());
		oFF.XByteArray.copy(oFF.GzipFileHelper.getBreakLineArray(), 0, all, this.m_content.size(), oFF.GzipFileHelper.getBreakLineArray().size());
		this.m_previousEndIndex = this.m_previousEndIndex + oFF.GzipFileHelper.getBreakLineArray().size();
		oFF.XByteArray.copy(binaryContent, 0, all, this.m_content.size() + oFF.GzipFileHelper.getBreakLineArray().size(), binaryContent.size());
		this.m_content = all;
		endIndex = this.m_previousEndIndex + binaryContent.size();
	}
	entry.putInteger("startIndex", this.m_previousEndIndex);
	entry.putInteger("endIndex", endIndex);
	if (content.getContentType() !== null)
	{
		entry.putString("contentType", content.getContentType().getName());
	}
	this.m_previousEndIndex = endIndex;
};
oFF.GzipFileHelper.prototype.isFileContentEmpty = function(content)
{
	return !content.isBinaryContentSet() && !content.isStringContentSet() && !content.isJsonContentSet();
};
oFF.GzipFileHelper.prototype.extractBytes = function(content)
{
	if (content.isBinaryContentSet())
	{
		return content.getByteArray();
	}
	if (content.isStringContentSet())
	{
		return oFF.XByteArray.convertFromString(content.getString());
	}
	if (content.isJsonContentSet())
	{
		var serialize = oFF.PrUtils.serialize(content.getJsonContent(), false, false, 0);
		return oFF.XByteArray.convertFromString(serialize);
	}
	throw oFF.XException.createIllegalArgumentException("file content was empty!");
};
oFF.GzipFileHelper.prototype.getCompleteContent = function()
{
	return this.m_content;
};
oFF.GzipFileHelper.prototype.getKeys = function()
{
	return this.m_contentTable.getKeysAsReadOnlyListOfString();
};
oFF.GzipFileHelper.prototype.getContentByKey = function(key)
{
	var result = oFF.XFileContent.createFileContent();
	result.setMessageCollection(oFF.MessageManagerSimple.createMessageManager());
	var entry = this.m_contentTable.getStructureByKey(key);
	if (oFF.isNull(entry))
	{
		result.getMessageCollection().addError(0, oFF.XStringUtils.concatenate2("No entry for key ", key));
	}
	else
	{
		var startIndex = entry.getIntegerByKey("startIndex");
		var endIndex = entry.getIntegerByKey("endIndex");
		var size = endIndex - startIndex;
		var contentSize = this.m_content.size();
		if (startIndex + size > contentSize)
		{
			oFF.XLogger.println("Start and end index are out of range");
		}
		var binaryContent = oFF.XByteArray.create(null, size);
		oFF.XByteArray.copy(this.m_content, startIndex, binaryContent, 0, size);
		result.setByteArray(binaryContent);
		var stringContent = oFF.XByteArray.convertToString(binaryContent);
		result.setString(stringContent);
		result.getJsonContent();
		var contentType = oFF.ContentType.lookupByMimeType(entry.getStringByKey("contentType"));
		if (oFF.notNull(contentType))
		{
			result.setContentType(contentType);
		}
	}
	return result;
};
oFF.GzipFileHelper.prototype.getContentTableAsJson = function()
{
	return this.m_contentTable;
};
oFF.GzipFileHelper.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_content = oFF.XObjectExt.release(this.m_content);
	this.m_contentTable = oFF.XObjectExt.release(this.m_contentTable);
};

oFF.SystemMapping = function() {};
oFF.SystemMapping.prototype = new oFF.XObject();
oFF.SystemMapping.prototype._ff_c = "SystemMapping";

oFF.SystemMapping.create = function(serializeTable, serializeSchema, deserializeTable, deserializeSchema)
{
	var systemMappingData = new oFF.SystemMapping();
	systemMappingData.setupExt(serializeTable, serializeSchema, deserializeTable, deserializeSchema);
	return systemMappingData;
};
oFF.SystemMapping.prototype.m_serializeTable = null;
oFF.SystemMapping.prototype.m_serializeSchema = null;
oFF.SystemMapping.prototype.m_deserializeTable = null;
oFF.SystemMapping.prototype.m_deserializeSchema = null;
oFF.SystemMapping.prototype.setupExt = function(serializeTable, serializeSchema, deserializeTable, deserializeSchema)
{
	this.m_serializeTable = serializeTable;
	this.m_serializeSchema = serializeSchema;
	this.m_deserializeTable = deserializeTable;
	this.m_deserializeSchema = deserializeSchema;
};
oFF.SystemMapping.prototype.releaseObject = function()
{
	this.m_serializeTable = null;
	this.m_serializeSchema = null;
	this.m_deserializeTable = null;
	this.m_deserializeSchema = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.SystemMapping.prototype.getSerializeTable = function()
{
	return this.m_serializeTable;
};
oFF.SystemMapping.prototype.getSerializeSchema = function()
{
	return this.m_serializeSchema;
};
oFF.SystemMapping.prototype.getDeserializeTable = function()
{
	return this.m_deserializeTable;
};
oFF.SystemMapping.prototype.getDeserializeSchema = function()
{
	return this.m_deserializeSchema;
};
oFF.SystemMapping.prototype.isValid = function(remoteSystemMapping)
{
	if (this.isDataNullOrEmpty(this) || this.isDataNullOrEmpty(remoteSystemMapping))
	{
		return false;
	}
	if (!oFF.XString.isEqual(this.getSerializeTable(), remoteSystemMapping.getDeserializeTable()) || !oFF.XString.isEqual(this.getSerializeSchema(), remoteSystemMapping.getDeserializeSchema()))
	{
		return false;
	}
	if (!oFF.XString.isEqual(this.getDeserializeTable(), remoteSystemMapping.getSerializeTable()) || !oFF.XString.isEqual(this.getDeserializeSchema(), remoteSystemMapping.getSerializeSchema()))
	{
		return false;
	}
	return true;
};
oFF.SystemMapping.prototype.isDataNullOrEmpty = function(systemMapping)
{
	return oFF.XStringUtils.isNullOrEmpty(systemMapping.getSerializeTable()) || oFF.XStringUtils.isNullOrEmpty(systemMapping.getSerializeSchema()) || oFF.XStringUtils.isNullOrEmpty(systemMapping.getDeserializeTable()) || oFF.XStringUtils.isNullOrEmpty(systemMapping.getDeserializeSchema());
};
oFF.SystemMapping.prototype.toString = function()
{
	var s = oFF.XStringBuffer.create();
	s.append("{serializeTable=").append(this.m_serializeTable);
	s.append(", serializeSchema=").append(this.m_serializeSchema);
	s.append(", deserializeTable=").append(this.m_deserializeTable);
	s.append(", deserializeSchema=").append(this.m_deserializeSchema);
	return s.append("}").toString();
};

oFF.TraceInfo = function() {};
oFF.TraceInfo.prototype = new oFF.XObject();
oFF.TraceInfo.prototype._ff_c = "TraceInfo";

oFF.TraceInfo.create = function()
{
	var newObject = new oFF.TraceInfo();
	newObject.m_traceType = oFF.TraceType.NONE;
	return newObject;
};
oFF.TraceInfo.prototype.m_traceType = null;
oFF.TraceInfo.prototype.m_traceName = null;
oFF.TraceInfo.prototype.m_traceFolderPath = null;
oFF.TraceInfo.prototype.m_traceFolderInternal = null;
oFF.TraceInfo.prototype.m_traceIndex = 0;
oFF.TraceInfo.prototype.releaseObject = function()
{
	this.m_traceFolderInternal = null;
	this.m_traceFolderPath = null;
	this.m_traceName = null;
	this.m_traceType = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.TraceInfo.prototype.getTraceType = function()
{
	return this.m_traceType;
};
oFF.TraceInfo.prototype.setTraceType = function(traceType)
{
	this.m_traceType = traceType;
};
oFF.TraceInfo.prototype.getTraceName = function()
{
	return this.m_traceName;
};
oFF.TraceInfo.prototype.setTraceName = function(traceName)
{
	this.m_traceName = traceName;
};
oFF.TraceInfo.prototype.getTraceFolderPath = function()
{
	return this.m_traceFolderPath;
};
oFF.TraceInfo.prototype.setTraceFolderPath = function(traceFolderPath)
{
	this.m_traceFolderPath = traceFolderPath;
};
oFF.TraceInfo.prototype.getTraceFolderInternal = function()
{
	return this.m_traceFolderInternal;
};
oFF.TraceInfo.prototype.setTraceFolderInternal = function(traceFolderInternal)
{
	this.m_traceFolderInternal = traceFolderInternal;
};
oFF.TraceInfo.prototype.getTraceIndex = function()
{
	return this.m_traceIndex;
};
oFF.TraceInfo.prototype.incrementTraceIndex = function()
{
	this.m_traceIndex++;
};

oFF.XConnectHelper = {

	copyUri:function(source, target)
	{
			if (oFF.notNull(source) && oFF.notNull(target))
		{
			oFF.XConnectHelper.copyConnection(source, target);
			target.setPath(source.getPath());
			target.setQuery(source.getQuery());
			target.setFragment(source.getFragment());
			target.setSupportsAuthority(source.supportsAuthority());
		}
	},
	copyConnection:function(source, target)
	{
			if (oFF.notNull(source) && oFF.notNull(target))
		{
			oFF.XConnectHelper.copyConnectionCore(source, target);
			oFF.XConnectHelper.copyConnectionCredentials(source, target);
		}
	},
	copyConnectionInfo:function(source, target)
	{
			if (oFF.notNull(source) && oFF.notNull(target))
		{
			oFF.XConnectHelper.copyConnectionCore(source, target);
			oFF.XConnectHelper.copyConnectionPersonalization(source, target);
			oFF.XConnectHelper.copyProxySettings(source, target);
			target.setTimeout(source.getTimeout());
			target.setSystemName(source.getSystemName());
			target.setSystemText(source.getSystemText());
			target.setSystemType(source.getSystemType());
			target.setSessionCarrierType(source.getSessionCarrierType());
			target.setPrefix(source.getPrefix());
			target.setNativeConnection(source.getNativeConnection());
			target.setAlias(source.getAlias());
		}
	},
	copyProxySettings:function(source, target)
	{
			if (oFF.notNull(source) && oFF.notNull(target))
		{
			target.setProxyHost(source.getProxyHost());
			target.setProxyPort(source.getProxyPort());
			target.setProxyAuthorization(source.getProxyAuthorization());
			target.setWebdispatcherTemplate(source.getWebdispatcherTemplate());
			target.setSccLocationId(source.getSccLocationId());
			var proxyHttpHeaders = source.getProxyHttpHeaders();
			if (oFF.notNull(proxyHttpHeaders))
			{
				for (var i = 0; i < proxyHttpHeaders.size(); i++)
				{
					var header = proxyHttpHeaders.get(i);
					target.setProxyHttpHeader(header.getName(), header.getValue());
				}
			}
			target.setProxyType(source.getProxyType());
		}
	},
	copyConnectionPersonalization:function(source, target)
	{
			if (oFF.notNull(source) && oFF.notNull(target))
		{
			oFF.XConnectHelper.copyConnectionCredentials(source, target);
			target.setLanguage(source.getLanguage());
		}
	},
	setOverdefinedConnectionPersonalization:function(source, target)
	{
			if (oFF.notNull(source) && oFF.notNull(target))
		{
			oFF.XConnectHelper.setOverdefinedConnectionCredentials(source, target);
			if (source.getLanguage() !== null)
			{
				target.setLanguage(source.getLanguage());
			}
		}
	},
	copyConnectionCore:function(source, target)
	{
			if (oFF.notNull(source) && oFF.notNull(target))
		{
			target.setScheme(source.getScheme());
			target.setHost(source.getHost());
			target.setPort(source.getPort());
		}
	},
	copyConnectionCredentials:function(source, target)
	{
			if (oFF.notNull(source) && oFF.notNull(target))
		{
			target.setAuthenticationType(source.getAuthenticationType());
			target.setUser(source.getUser());
			target.setInternalUser(source.getInternalUser());
			target.setPassword(source.getPassword());
			target.setX509Certificate(source.getX509Certificate());
			target.setSecureLoginProfile(source.getSecureLoginProfile());
			target.setAuthenticationToken(source.getAuthenticationToken());
			target.setAccessToken(source.getAccessToken());
			target.setUserToken(source.getUserToken());
			target.setOrganizationToken(source.getOrganizationToken());
			target.setElementToken(source.getElementToken());
			target.setTenantId(source.getTenantId());
		}
	},
	setOverdefinedConnectionCredentials:function(source, target)
	{
			if (oFF.notNull(source) && oFF.notNull(target))
		{
			if (source.getAuthenticationType() !== null)
			{
				target.setAuthenticationType(source.getAuthenticationType());
			}
			if (source.getUser() !== null)
			{
				target.setUser(source.getUser());
			}
			if (source.getInternalUser() !== null)
			{
				target.setInternalUser(source.getInternalUser());
			}
			if (source.getPassword() !== null)
			{
				target.setPassword(source.getPassword());
			}
			if (source.getX509Certificate() !== null)
			{
				target.setX509Certificate(source.getX509Certificate());
			}
			if (source.getSecureLoginProfile() !== null)
			{
				target.setSecureLoginProfile(source.getSecureLoginProfile());
			}
			if (source.getAuthenticationToken() !== null)
			{
				target.setAuthenticationToken(source.getAuthenticationToken());
			}
			if (source.getAccessToken() !== null)
			{
				target.setAccessToken(source.getAccessToken());
			}
			if (source.getUserToken() !== null)
			{
				target.setUserToken(source.getUserToken());
			}
			if (source.getOrganizationToken() !== null)
			{
				target.setOrganizationToken(source.getOrganizationToken());
			}
			if (source.getElementToken() !== null)
			{
				target.setElementToken(source.getElementToken());
			}
			if (source.getTenantId() !== null)
			{
				target.setTenantId(source.getTenantId());
			}
		}
	},
	applyProxySettings:function(connection, session)
	{
			if (connection.getProxyType() === oFF.ProxyType.DEFAULT)
		{
			var proxySettings = session.getProxySettings();
			if (proxySettings.isProxyApplicable(connection) === true)
			{
				oFF.XConnectHelper.copyProxySettings(proxySettings, connection);
			}
		}
	},
	applyWebdispatcherTemplate:function(source, target, webdispatcherProperty, session)
	{
			if (oFF.notNull(source) && oFF.notNull(target))
		{
			if (source.getProtocolType() !== oFF.ProtocolType.FILE)
			{
				var networkLocation = session.getNetworkLocation();
				var sysWebDispatcherTemplate = webdispatcherProperty.getWebdispatcherTemplate();
				var path = source.getPath();
				if (oFF.XStringUtils.isNotNullAndNotEmpty(sysWebDispatcherTemplate))
				{
					var useAlias = oFF.XString.containsString(sysWebDispatcherTemplate, oFF.XEnvironmentConstants.DISPATCHER_ALIAS);
					var webdispatcherUri = oFF.XUri.createFromUrlWithParent(sysWebDispatcherTemplate, networkLocation, false);
					var dpHost = webdispatcherUri.getHost();
					var dpPort = webdispatcherUri.getPort();
					var sysHost = source.getHost();
					var sysPort = source.getPort();
					var isSameServer = oFF.XString.isEqual(dpHost, sysHost) && dpPort === sysPort;
					if (isSameServer === false || useAlias)
					{
						var newUrlString = sysWebDispatcherTemplate;
						newUrlString = oFF.XConnectHelper.safeReplace(newUrlString, oFF.XEnvironmentConstants.DISPATCHER_PROTOCOL, source.getScheme());
						newUrlString = oFF.XConnectHelper.safeReplace(newUrlString, oFF.XEnvironmentConstants.DISPATCHER_HOST, sysHost);
						newUrlString = oFF.XConnectHelper.safeReplace(newUrlString, oFF.XEnvironmentConstants.DISPATCHER_PORT, oFF.XInteger.convertToString(sysPort));
						newUrlString = oFF.XConnectHelper.safeReplace(newUrlString, oFF.XEnvironmentConstants.DISPATCHER_ALIAS, source.getSystemName());
						newUrlString = oFF.XConnectHelper.safeReplace(newUrlString, oFF.XEnvironmentConstants.DISPATCHER_PREFIX, "");
						newUrlString = oFF.XConnectHelper.safeReplace(newUrlString, oFF.XEnvironmentConstants.DISPATCHER_PATH, path);
						var newUrl = oFF.XUri.createFromUrlWithParent(newUrlString, networkLocation, false);
						target.setProtocolType(newUrl.getProtocolType());
						target.setHost(newUrl.getHost());
						target.setPort(newUrl.getPort());
						target.setPath(newUrl.getPath());
					}
				}
			}
		}
	},
	safeReplace:function(value, searchPattern, replaceValue)
	{
			var safeReplaceValue = replaceValue;
		if (oFF.isNull(safeReplaceValue))
		{
			safeReplaceValue = "";
		}
		return oFF.XString.replace(value, searchPattern, safeReplaceValue);
	}
};

oFF.RpcRequestConstants = {

	REQUEST_PARAM_TIMESTAMP:"timestamp",
	REQUEST_PARAM_TRACE_NAME:"traceName",
	REQUEST_PARAM_TRACE_PATH:"tracePath",
	REQUEST_PARAM_TRACE_REQ_INDEX:"traceRequestIndex"
};

oFF.HtmlForm = function() {};
oFF.HtmlForm.prototype = new oFF.XObject();
oFF.HtmlForm.prototype._ff_c = "HtmlForm";

oFF.HtmlForm.create = function(originSite, html)
{
	var newObject = new oFF.HtmlForm();
	newObject.setupHttpForm(originSite, html);
	return newObject;
};
oFF.HtmlForm.findHtmlValue = function(html, offset, prefixMarker, parameter)
{
	var myOffset = offset;
	if (oFF.notNull(prefixMarker))
	{
		myOffset = oFF.XString.indexOfFrom(html, prefixMarker, myOffset);
	}
	var value = null;
	if (myOffset >= 0)
	{
		var fullParameter = oFF.XStringUtils.concatenate2(parameter, "=\"");
		var valueStart = oFF.XString.indexOfFrom(html, fullParameter, myOffset);
		var valueEnd;
		if (valueStart >= 0)
		{
			valueStart = valueStart + oFF.XString.size(fullParameter);
			valueEnd = oFF.XString.indexOfFrom(html, "\"", valueStart);
			if (valueEnd !== -1)
			{
				value = oFF.XString.substring(html, valueStart, valueEnd);
			}
		}
		else
		{
			fullParameter = oFF.XStringUtils.concatenate2(parameter, "='");
			valueStart = oFF.XString.indexOfFrom(html, fullParameter, myOffset);
			if (valueStart >= 0)
			{
				valueStart = valueStart + oFF.XString.size(fullParameter);
				valueEnd = oFF.XString.indexOfFrom(html, "'", valueStart);
				if (valueEnd !== -1)
				{
					value = oFF.XString.substring(html, valueStart, valueEnd);
				}
			}
		}
	}
	return oFF.XmlUtils.unescapeRawXmlString(value, true);
};
oFF.HtmlForm.prototype.m_isValid = false;
oFF.HtmlForm.prototype.m_values = null;
oFF.HtmlForm.prototype.m_types = null;
oFF.HtmlForm.prototype.m_action = null;
oFF.HtmlForm.prototype.m_target = null;
oFF.HtmlForm.prototype.m_originSite = null;
oFF.HtmlForm.prototype.setupHttpForm = function(originSite, html)
{
	this.m_originSite = originSite;
	this.m_values = oFF.XProperties.create();
	this.m_types = oFF.XProperties.create();
	if (oFF.notNull(html))
	{
		var formStart = oFF.XString.indexOf(html, "<form");
		if (formStart !== -1)
		{
			var formEnd = oFF.XString.indexOfFrom(html, "</form>", formStart);
			if (formEnd !== -1)
			{
				var theForm = oFF.XString.substring(html, formStart, formEnd);
				this.m_action = oFF.HtmlForm.findHtmlValue(theForm, 0, null, "action");
				if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_action))
				{
					this.m_isValid = true;
					var offset = oFF.XString.indexOf(theForm, ">");
					while (offset !== -1)
					{
						var nextOffset = oFF.XString.indexOfFrom(theForm, "<input", offset);
						if (nextOffset === -1)
						{
							break;
						}
						var endOffset = oFF.XString.indexOfFrom(theForm, ">", nextOffset);
						var inputTag = oFF.XString.substring(theForm, nextOffset, endOffset);
						var inputType = oFF.HtmlForm.findHtmlValue(inputTag, 0, null, "type");
						if (oFF.isNull(inputType))
						{
							inputType = "";
						}
						var inputName = oFF.HtmlForm.findHtmlValue(inputTag, 0, null, "name");
						var inputValue = oFF.HtmlForm.findHtmlValue(inputTag, 0, null, "value");
						if (oFF.isNull(inputValue))
						{
							inputValue = "";
						}
						if (oFF.notNull(inputName))
						{
							this.m_values.put(inputName, inputValue);
							this.m_types.put(inputName, inputType);
						}
						offset = endOffset;
					}
				}
			}
		}
	}
};
oFF.HtmlForm.prototype.getParameters = function()
{
	return this.m_values;
};
oFF.HtmlForm.prototype.getAction = function()
{
	return this.m_action;
};
oFF.HtmlForm.prototype.getParameterValue = function(key)
{
	return this.m_values.getByKey(key);
};
oFF.HtmlForm.prototype.getParameterType = function(key)
{
	return this.m_types.getByKey(key);
};
oFF.HtmlForm.prototype.getNames = function()
{
	return this.m_values.getKeysAsIteratorOfString();
};
oFF.HtmlForm.prototype.getTarget = function()
{
	if (oFF.isNull(this.m_target))
	{
		this.m_target = oFF.XUri.createFromUrlWithParent(this.m_action, this.m_originSite, false);
	}
	return this.m_target;
};
oFF.HtmlForm.prototype.setTarget = function(target)
{
	this.m_target = target;
};
oFF.HtmlForm.prototype.getOriginSite = function()
{
	return this.m_originSite;
};
oFF.HtmlForm.prototype.set = function(name, value)
{
	this.m_values.put(name, value);
};
oFF.HtmlForm.prototype.isValid = function()
{
	return this.m_isValid;
};
oFF.HtmlForm.prototype.toString = function()
{
	var buffer = oFF.XStringBuffer.create();
	buffer.append("action=").appendLine(this.m_action);
	var iterator = this.m_values.getKeysAsIteratorOfString();
	while (iterator.hasNext())
	{
		var key = iterator.next();
		var type = this.m_types.getByKey(key);
		buffer.append(key).append("[").append(type).append("]=").appendLine(this.m_values.getByKey(key));
	}
	return buffer.toString();
};

oFF.HttpConstants = {

	FIREFLY_USER_AGENT:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36",
	HTTP_11:"HTTP/1.1",
	UTF_8:"UTF-8",
	GZIP:"GZIP",
	HTTP_CRLF:"\r\n",
	HD_CONTENT_LENGTH:"Content-Length",
	HD_SET_COOKIE:"Set-Cookie",
	HD_COOKIE:"Cookie",
	HD_HOST:"Host",
	HD_ACCEPT:"Accept",
	HD_ACCEPT_LANGUAGE:"Accept-Language",
	HD_ACCEPT_CHARSET:"Accept-Charset",
	VA_LANGUAGE_ENGLISH:"en",
	HD_ACCEPT_ENCODING:"Accept-Encoding",
	HD_USER_AGENT:"User-Agent",
	HD_CACHE_CONTROL:"Cache-Control",
	HD_CONNECTION:"Connection",
	HD_REFERER:"Referer",
	HD_ORIGIN:"Origin",
	VA_CONNECTION_CLOSE:"close",
	VA_CONNECTION_KEEP_ALIVE:"keep-alive",
	HD_CONTENT_TYPE:"Content-Type",
	HD_CONTENT_ENCODING:"Content-Encoding",
	HD_LOCATION:"Location",
	HD_AUTHORIZATION:"Authorization",
	VA_AUTHORIZATION_BASIC:"Basic",
	VA_AUTHORIZATION_BEARER:"Bearer",
	VA_SAML_2_0:"SAML2.0",
	HD_TRANSFER_ENCODING:"Transfer-Encoding",
	VA_TRANSFER_ENCODING_CHUNKED:"Chunked",
	HD_WWW_AUTHENTICATE:"WWW-Authenticate",
	HD_CSRF_TOKEN:"X-Csrf-Token",
	VA_CSRF_FETCH:"Fetch",
	VA_NO_CACHE:"no-cache, no-store",
	VA_CSRF_REQUIRED:"Required",
	HD_BOE_SESSION_TOKEN:"X-Boe-Session-Token",
	HD_SAP_URL_SESSION_ID:"sap-url-session-id",
	HD_E_TAG:"ETag",
	HD_LAST_MODIFIED:"Last-Modified",
	HD_MYSAPSSO2:"mysapsso2",
	HD_SAP_CLIENT_ID:"x-sap-cid",
	HD_X_CORRELATION_ID:"x-correlationid",
	HD_SAP_CONTEXT_ID:"sap-contextid",
	HD_USER:"User",
	HD_ORGANIZATION:"Organization",
	HD_ELEMENT:"Element",
	HD_PROXY_AUTHORIZATION:"Proxy-Authorization",
	HD_SCC_LOCATION_ID:"SAP-Connectivity-SCC-Location_ID",
	HD_SAP_CONNECTIVITY_AUTHENTICATION:"SAP-Connectivity-Authentication",
	HD_SAP_BOC_USER_PROPERTIES:"x-sap-boc-user-properties",
	HD_OEM_APPLICATION_ID:"application-id",
	QP_PARAM_SESSION_VIA_URL:"sap-sessionviaurl",
	s_camelCaseLookupByLowerCase:null,
	staticSetup:function()
	{
			oFF.HttpConstants.s_camelCaseLookupByLowerCase = oFF.XHashMapOfStringByString.create();
		oFF.HttpConstants.store(oFF.HttpConstants.HD_CONTENT_LENGTH);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_SET_COOKIE);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_COOKIE);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_HOST);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_ACCEPT);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_ACCEPT_LANGUAGE);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_ACCEPT_CHARSET);
		oFF.HttpConstants.store(oFF.HttpConstants.VA_LANGUAGE_ENGLISH);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_ACCEPT_ENCODING);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_USER_AGENT);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_CACHE_CONTROL);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_CONNECTION);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_REFERER);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_ORIGIN);
		oFF.HttpConstants.store(oFF.HttpConstants.VA_CONNECTION_CLOSE);
		oFF.HttpConstants.store(oFF.HttpConstants.VA_CONNECTION_KEEP_ALIVE);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_CONTENT_TYPE);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_CONTENT_ENCODING);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_LOCATION);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_AUTHORIZATION);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_TRANSFER_ENCODING);
		oFF.HttpConstants.store(oFF.HttpConstants.VA_TRANSFER_ENCODING_CHUNKED);
		oFF.HttpConstants.store(oFF.HttpConstants.VA_AUTHORIZATION_BASIC);
		oFF.HttpConstants.store(oFF.HttpConstants.VA_AUTHORIZATION_BEARER);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_WWW_AUTHENTICATE);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_CSRF_TOKEN);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_BOE_SESSION_TOKEN);
		oFF.HttpConstants.store(oFF.HttpConstants.VA_CSRF_FETCH);
		oFF.HttpConstants.store(oFF.HttpConstants.VA_CSRF_REQUIRED);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_SAP_URL_SESSION_ID);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_E_TAG);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_LAST_MODIFIED);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_MYSAPSSO2);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_SAP_CLIENT_ID);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_USER);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_ORGANIZATION);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_ELEMENT);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_PROXY_AUTHORIZATION);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_SCC_LOCATION_ID);
		oFF.HttpConstants.store(oFF.HttpConstants.HD_OEM_APPLICATION_ID);
	},
	store:function(theConstant)
	{
			oFF.HttpConstants.s_camelCaseLookupByLowerCase.put(oFF.XString.toLowerCase(theConstant), theConstant);
	},
	lookupCamelCase:function(anyCaseConstant)
	{
			var lowerCaseConstant = oFF.XString.toLowerCase(anyCaseConstant);
		var camelCaseKey = oFF.HttpConstants.s_camelCaseLookupByLowerCase.getByKey(lowerCaseConstant);
		if (oFF.isNull(camelCaseKey))
		{
			return anyCaseConstant;
		}
		return camelCaseKey;
	}
};

oFF.HttpEncodings = {

	EN_DEFLATE:"deflate",
	EN_GZIP:"gzip"
};

oFF.HttpErrorCode = {

	HTTP_ROOT_EXCEPTION:1000,
	HTTP_MISSING_NATIVE_DRIVER:1001,
	HTTP_MISSING_BLOCKING_SUPPORT:1002,
	HTTP_TIMEOUT:1003,
	HTTP_CLIENT_CANCEL_REQUEST:1004,
	HTTP_IO_EXCEPTION:1005,
	HTTP_UNKNOWN_HOST_EXCEPTION:1006,
	HTTP_WRONG_STATUS_CODE:1007,
	HTTP_WRONG_CONTENT_TYPE:1008,
	HTTP_EXCEPTION_WITH_NATIVE_CAUSE:1009
};

oFF.HttpExchangeInterceptorProvider = {

	s_interceptor:null,
	getHttpExchangeInterceptor:function()
	{
			if (oFF.isNull(oFF.HttpExchangeInterceptorProvider.s_interceptor))
		{
			oFF.HttpExchangeInterceptorProvider.s_interceptor = new oFF.HttpExchangeNopInterceptor();
		}
		return oFF.HttpExchangeInterceptorProvider.s_interceptor;
	},
	setHttpExchangeInterceptor:function(interceptor)
	{
			oFF.HttpExchangeInterceptorProvider.s_interceptor = interceptor;
	}
};

oFF.HttpStatusCode = {

	SC_CONTINUE:100,
	SC_SWITCHING:101,
	SC_PROCESSING:102,
	SC_OK:200,
	SC_CREATED:201,
	SC_ACCEPTED:202,
	SC_NON_AUTHORITATIVE:203,
	SC_NO_CONTENT:204,
	SC_RESET_CONTENT:205,
	SC_PARTIAL_CONTENT:206,
	SC_MULTI_STATUS:207,
	SC_ALREADY_REPORTED:208,
	SC_IM_USED:226,
	SC_MULTIPLE_CHOICES:300,
	SC_MOVED_PERMANENTLY:301,
	SC_FOUND:302,
	SC_SEE_OTHER:303,
	SC_UNAUTHORIZED:401,
	SC_FORBIDDDEN:403,
	SC_NOT_FOUND:404,
	SC_NOT_ACCEPTABLE:406,
	SC_INTERNAL_SERVER_ERROR:500,
	SC_JSON_PARSE_ERROR:607,
	isOk:function(code)
	{
			return code >= 200 && code < 300;
	},
	isRedirect:function(code)
	{
			return code >= 300 && code < 400;
	},
	isError:function(code)
	{
			return code >= 400;
	}
};

oFF.HttpCookiesMasterStore = function() {};
oFF.HttpCookiesMasterStore.prototype = new oFF.XObject();
oFF.HttpCookiesMasterStore.prototype._ff_c = "HttpCookiesMasterStore";

oFF.HttpCookiesMasterStore.create = function()
{
	var newObj = new oFF.HttpCookiesMasterStore();
	newObj.m_domains = oFF.XHashMapByString.create();
	return newObj;
};
oFF.HttpCookiesMasterStore.prototype.m_domains = null;
oFF.HttpCookiesMasterStore.prototype.getCookies = function(domain, path)
{
	var cookiesStorage = oFF.HttpCookies.create();
	var currentDomain = domain;
	var currentPath = oFF.XStringBuffer.create();
	while (oFF.notNull(currentDomain) && oFF.notNull(path))
	{
		var domainCookies = this.m_domains.getByKey(currentDomain);
		if (oFF.notNull(domainCookies))
		{
			var folders = oFF.XStringTokenizer.splitString(path, "/");
			while (folders.size() > 0)
			{
				for (var k = 0; k < folders.size(); k++)
				{
					currentPath.append(folders.get(k)).append("/");
				}
				var pathCookies = domainCookies.getByKey(currentPath.toString());
				currentPath.clear();
				if (oFF.notNull(pathCookies))
				{
					var cookies = pathCookies.getValuesAsReadOnlyList();
					for (var i = 0; i < cookies.size(); i++)
					{
						cookiesStorage.addCookie(oFF.HttpCookie.createCopy(cookies.get(i)));
					}
				}
				folders.removeAt(folders.size() - 1);
			}
		}
		var nextSubDomain = oFF.XString.indexOfFrom(currentDomain, ".", 1);
		var lastSubDomain = oFF.XString.lastIndexOf(currentDomain, ".");
		if (nextSubDomain === lastSubDomain)
		{
			break;
		}
		currentDomain = oFF.XString.substring(currentDomain, nextSubDomain, -1);
	}
	return cookiesStorage;
};
oFF.HttpCookiesMasterStore.prototype.applyCookies = function(domain, path, cookies)
{
	var allNewCookies = cookies.getCookies();
	for (var i = 0; i < allNewCookies.size(); i++)
	{
		var cookie = allNewCookies.get(i);
		var currentDomain = cookie.getDomain();
		if (oFF.isNull(currentDomain))
		{
			currentDomain = domain;
		}
		var domainCookies = this.m_domains.getByKey(currentDomain);
		if (oFF.isNull(domainCookies))
		{
			domainCookies = oFF.XHashMapByString.create();
			this.m_domains.put(currentDomain, domainCookies);
		}
		var currentPath = cookie.getPath();
		if (oFF.isNull(currentPath))
		{
			currentPath = path;
		}
		if (!oFF.XString.endsWith(currentPath, "/"))
		{
			currentPath = oFF.XStringUtils.concatenate2(currentPath, "/");
		}
		var pathCookies = domainCookies.getByKey(currentPath);
		if (oFF.isNull(pathCookies))
		{
			pathCookies = oFF.XHashMapByString.create();
			domainCookies.put(currentPath, pathCookies);
		}
		pathCookies.put(cookie.getName(), oFF.HttpCookie.createCopy(cookie));
	}
};
oFF.HttpCookiesMasterStore.prototype.clear = function(domain, path)
{
	if (oFF.XStringUtils.isNullOrEmpty(domain))
	{
		this.m_domains.clear();
	}
	else
	{
		var domainCookie = this.m_domains.getByKey(domain);
		if (oFF.notNull(domainCookie))
		{
			if (oFF.XStringUtils.isNullOrEmpty(path))
			{
				domainCookie.clear();
			}
			else
			{
				domainCookie.remove(path);
			}
		}
	}
};
oFF.HttpCookiesMasterStore.prototype.toString = function()
{
	var buffer = oFF.XStringBuffer.create();
	var domains = this.m_domains.getKeysAsReadOnlyListOfString();
	var sortedDomains = oFF.XListOfString.createFromReadOnlyList(domains);
	sortedDomains.sortByDirection(oFF.XSortDirection.ASCENDING);
	for (var i = 0; i < sortedDomains.size(); i++)
	{
		if (i > 0)
		{
			buffer.appendNewLine();
		}
		var domain = sortedDomains.get(i);
		buffer.appendLine(domain);
		buffer.appendLine("=====================================");
		var currentDomainStore = this.m_domains.getByKey(domain);
		var paths = currentDomainStore.getKeysAsReadOnlyListOfString();
		var sortedPath = oFF.XListOfString.createFromReadOnlyList(paths);
		for (var k = 0; k < sortedPath.size(); k++)
		{
			var path = sortedPath.get(k);
			buffer.appendLine(path);
			buffer.appendLine("-------------------------------------");
			var currentPathStore = currentDomainStore.getByKey(path);
			var names = currentPathStore.getKeysAsReadOnlyListOfString();
			var sortedNames = oFF.XListOfString.createFromReadOnlyList(names);
			for (var m = 0; m < sortedNames.size(); m++)
			{
				var cookie = currentPathStore.getByKey(sortedNames.get(m));
				buffer.appendLine(cookie.toString());
			}
		}
	}
	return buffer.toString();
};

oFF.HttpCoreUtils = {

	setAuthentication:function(connectionInfo, httpHeader)
	{
			var authenticationType = connectionInfo.getAuthenticationType();
		if (authenticationType === oFF.AuthenticationType.BASIC)
		{
			var base64EncodeValue = oFF.XStringBuffer.create();
			base64EncodeValue.append(connectionInfo.getUser());
			base64EncodeValue.append(":");
			base64EncodeValue.append(connectionInfo.getPassword());
			var userPwdValue = base64EncodeValue.toString();
			var byteArray = oFF.XByteArray.convertFromStringWithCharset(userPwdValue, oFF.XCharset.USASCII);
			if (oFF.notNull(byteArray))
			{
				var base64Encoded = oFF.XHttpUtils.encodeByteArrayToBase64(byteArray);
				var authentication = oFF.XStringBuffer.create();
				authentication.append(oFF.HttpConstants.VA_AUTHORIZATION_BASIC);
				authentication.append(" ");
				authentication.append(base64Encoded);
				httpHeader.setString(oFF.HttpConstants.HD_AUTHORIZATION, authentication.toString());
			}
		}
		else if (authenticationType === oFF.AuthenticationType.BEARER)
		{
			var theToken = connectionInfo.getAccessToken();
			if (oFF.isNull(theToken))
			{
				var authenticationToken = connectionInfo.getAuthenticationToken();
				theToken = authenticationToken.getAccessToken();
			}
			if (oFF.notNull(theToken))
			{
				var authentication2 = oFF.XStringBuffer.create();
				authentication2.append(oFF.HttpConstants.VA_AUTHORIZATION_BEARER);
				authentication2.append(" ");
				authentication2.append(theToken);
				httpHeader.setString(oFF.HttpConstants.HD_AUTHORIZATION, authentication2.toString());
			}
		}
		else if (authenticationType === oFF.AuthenticationType.SCP_OPEN_CONNECTORS)
		{
			var userToken = connectionInfo.getUserToken();
			var organizationToken = connectionInfo.getOrganizationToken();
			var elementToken = connectionInfo.getElementToken();
			var authentication3 = oFF.XStringBuffer.create();
			authentication3.append(oFF.HttpConstants.HD_USER).append(" ").append(userToken);
			authentication3.append(", ");
			authentication3.append(oFF.HttpConstants.HD_ORGANIZATION).append(" ").append(organizationToken);
			authentication3.append(", ");
			authentication3.append(oFF.HttpConstants.HD_ELEMENT).append(" ").append(elementToken);
			httpHeader.setString(oFF.HttpConstants.HD_AUTHORIZATION, authentication3.toString());
		}
		else if (authenticationType === oFF.AuthenticationType.SCP_OAUTH_BEARER)
		{
			var accessToken = connectionInfo.getAccessToken();
			if (oFF.notNull(accessToken))
			{
				httpHeader.setString(oFF.HttpConstants.HD_SAP_CONNECTIVITY_AUTHENTICATION, accessToken);
			}
		}
		else if (authenticationType === oFF.AuthenticationType.SAML_WITH_BEARER)
		{
			var theToken2 = connectionInfo.getAccessToken();
			if (oFF.notNull(theToken2))
			{
				var authentication4 = oFF.XStringBuffer.create();
				authentication4.append(oFF.HttpConstants.VA_SAML_2_0);
				authentication4.append(" ");
				authentication4.append(theToken2);
				httpHeader.setString(oFF.HttpConstants.HD_AUTHORIZATION, authentication4.toString());
			}
		}
		if (connectionInfo.getProxyType() === oFF.ProxyType.PROXY)
		{
			var proxyAuthorization = connectionInfo.getProxyAuthorization();
			if (oFF.notNull(proxyAuthorization))
			{
				httpHeader.setString(oFF.HttpConstants.HD_PROXY_AUTHORIZATION, proxyAuthorization);
			}
			var sccLocationId = connectionInfo.getSccLocationId();
			if (oFF.notNull(sccLocationId))
			{
				httpHeader.setString(oFF.HttpConstants.HD_SCC_LOCATION_ID, sccLocationId);
			}
			var proxyHttpHeaders = connectionInfo.getProxyHttpHeaders();
			if (oFF.notNull(proxyHttpHeaders) && proxyHttpHeaders.size() > 0)
			{
				for (var k = 0; k < proxyHttpHeaders.size(); k++)
				{
					var singleHeader = proxyHttpHeaders.get(k);
					httpHeader.setString(singleHeader.getName(), singleHeader.getValue());
				}
			}
		}
	},
	setHostName:function(systemDescription, httpHeader)
	{
			var hostNameBuf = oFF.XStringBuffer.create();
		hostNameBuf.append(systemDescription.getHost());
		var port = systemDescription.getPort();
		if (port !== 0)
		{
			var protocolType = systemDescription.getProtocolType();
			var isHttp80 = protocolType === oFF.ProtocolType.HTTP && port === 80;
			var isHttps443 = protocolType === oFF.ProtocolType.HTTPS && port === 443;
			if (!isHttp80 && !isHttps443)
			{
				hostNameBuf.append(":");
				hostNameBuf.append(oFF.XInteger.convertToString(port));
			}
		}
		httpHeader.setString(oFF.HttpConstants.HD_HOST, hostNameBuf.toString());
	},
	setLanguage:function(systemDescription, httpHeader)
	{
			var lang = systemDescription.getLanguage();
		if (!oFF.XStringUtils.isNullOrEmpty(lang))
		{
			httpHeader.setString(oFF.HttpConstants.HD_ACCEPT_LANGUAGE, lang);
		}
	},
	setAccept:function(httpHeader, request)
	{
			var acceptContentType = request.getAcceptContentType();
		httpHeader.setString(oFF.HttpConstants.HD_ACCEPT, acceptContentType.getName());
		httpHeader.setString(oFF.HttpConstants.HD_ACCEPT_CHARSET, oFF.HttpConstants.UTF_8);
		if (request.isAcceptGzip())
		{
			httpHeader.setString(oFF.HttpConstants.HD_ACCEPT_ENCODING, oFF.HttpEncodings.EN_GZIP);
		}
	},
	addCookies:function(request, httpHeader)
	{
			var cookies = request.getCookies();
		var cookieNames = cookies.getCookieNames();
		if (cookieNames.isEmpty())
		{
			return;
		}
		var buffer = oFF.XStringBuffer.create();
		var hasEntry = false;
		for (var k = 0; k < cookieNames.size(); k++)
		{
			var name = cookieNames.get(k);
			var selectedCookies = cookies.getCookiesByName(name);
			for (var j = 0; j < selectedCookies.size(); j++)
			{
				var selectedCookie = selectedCookies.get(j);
				var cookiePath = selectedCookie.getPath();
				if (!oFF.XStringUtils.isNullOrEmpty(cookiePath))
				{
					var requestPath = request.getPath();
					if (oFF.XStringUtils.isNullOrEmpty(requestPath))
					{
						throw oFF.XException.createIllegalStateException("no request path");
					}
					if (!oFF.XString.isEqual(requestPath, cookiePath))
					{
						if (!oFF.XString.startsWith(requestPath, cookiePath))
						{
							continue;
						}
						if (!oFF.XString.endsWith(cookiePath, "/"))
						{
							var cookiePathLength = oFF.XString.size(cookiePath);
							var nextRequestPathChar = oFF.XString.substring(requestPath, cookiePathLength, cookiePathLength + 1);
							if (!oFF.XString.isEqual(nextRequestPathChar, "/"))
							{
								continue;
							}
						}
					}
				}
				if (hasEntry)
				{
					buffer.append(";");
				}
				else
				{
					hasEntry = true;
				}
				var value = selectedCookies.get(j).getValue();
				buffer.append(name);
				buffer.append("=");
				buffer.append(value);
			}
		}
		httpHeader.setString(oFF.HttpConstants.HD_COOKIE, buffer.toString());
	},
	populateHeaderFromRequest:function(systemDescription, httpHeader, request, postDataUtf8Len, handleAuthentication)
	{
			if (handleAuthentication)
		{
			oFF.HttpCoreUtils.setAuthentication(systemDescription, httpHeader);
		}
		oFF.HttpCoreUtils.setHostName(systemDescription, httpHeader);
		oFF.HttpCoreUtils.setLanguage(systemDescription, httpHeader);
		oFF.HttpCoreUtils.setAccept(httpHeader, request);
		httpHeader.setString(oFF.HttpConstants.HD_USER_AGENT, oFF.HttpConstants.FIREFLY_USER_AGENT);
		httpHeader.setString(oFF.HttpConstants.HD_CONNECTION, oFF.HttpConstants.VA_CONNECTION_KEEP_ALIVE);
		var requestMethod = request.getMethod();
		if ((requestMethod === oFF.HttpRequestMethod.HTTP_POST || requestMethod === oFF.HttpRequestMethod.HTTP_PUT) && (request.getString() !== null || request.getByteArray() !== null))
		{
			var bufferContentType = oFF.XStringBuffer.create();
			bufferContentType.append(request.getContentType().getName());
			bufferContentType.append(";charset=utf-8");
			httpHeader.setString(oFF.HttpConstants.HD_CONTENT_TYPE, bufferContentType.toString());
			httpHeader.setInteger(oFF.HttpConstants.HD_CONTENT_LENGTH, postDataUtf8Len);
		}
		if (request.getCookies() !== null && request.isCorsSecured())
		{
			oFF.HttpCoreUtils.addCookies(request, httpHeader);
		}
		var headerFields = request.getHeaderFields();
		var keys = headerFields.getKeysAsIteratorOfString();
		while (keys.hasNext())
		{
			var key = keys.next();
			httpHeader.setString(key, headerFields.getByKey(key));
		}
		return httpHeader;
	},
	createHttpRequestString:function(request, httpHeader)
	{
			var httpBuffer = oFF.XStringBuffer.create();
		httpBuffer.append(request.getMethod().getName());
		httpBuffer.append(" ");
		httpBuffer.append(request.getPath());
		var escapedQuery = request.getQuery();
		if (oFF.notNull(escapedQuery))
		{
			httpBuffer.append("?");
			httpBuffer.append(escapedQuery);
		}
		httpBuffer.append(" ");
		httpBuffer.append(oFF.HttpConstants.HTTP_11);
		httpBuffer.append(oFF.HttpConstants.HTTP_CRLF);
		httpBuffer.append(httpHeader.generateHttpHeaderString());
		httpBuffer.append(oFF.HttpConstants.HTTP_CRLF);
		httpBuffer.append(oFF.HttpConstants.HTTP_CRLF);
		return httpBuffer.toString();
	}
};

oFF.HttpErrorCause = function() {};
oFF.HttpErrorCause.prototype = new oFF.XObject();
oFF.HttpErrorCause.prototype._ff_c = "HttpErrorCause";

oFF.HttpErrorCause.prototype.m_httpResponse = null;
oFF.HttpErrorCause.prototype.m_extendedInfo = null;
oFF.HttpErrorCause.prototype.m_errorCode = 0;
oFF.HttpErrorCause.prototype.m_httpRequest = null;
oFF.HttpErrorCause.prototype.releaseObject = function()
{
	this.m_httpRequest = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.HttpErrorCause.prototype.setHttpRequest = function(httpRequest)
{
	this.m_httpRequest = httpRequest;
};
oFF.HttpErrorCause.prototype.getHttpRequest = function()
{
	return this.m_httpRequest;
};
oFF.HttpErrorCause.prototype.setHttpResponse = function(httpResponse)
{
	this.m_httpResponse = httpResponse;
};
oFF.HttpErrorCause.prototype.getHttpResponse = function()
{
	return this.m_httpResponse;
};
oFF.HttpErrorCause.prototype.setExtendedInfo = function(extendedInfo)
{
	this.m_extendedInfo = extendedInfo;
};
oFF.HttpErrorCause.prototype.getExtendedInfo = function()
{
	return this.m_extendedInfo;
};
oFF.HttpErrorCause.prototype.setErrorCode = function(errorCode)
{
	this.m_errorCode = errorCode;
};
oFF.HttpErrorCause.prototype.getErrorCode = function()
{
	return this.m_errorCode;
};
oFF.HttpErrorCause.prototype.toString = function()
{
	var sb = oFF.XStringBuffer.create();
	if (this.m_errorCode !== 0)
	{
		sb.appendInt(this.m_errorCode).appendNewLine();
	}
	if (oFF.notNull(this.m_httpRequest))
	{
		var requestString = this.m_httpRequest.toString();
		if (oFF.notNull(requestString))
		{
			sb.appendLine(requestString);
		}
	}
	if (oFF.notNull(this.m_httpResponse))
	{
		var responseString = this.m_httpResponse.toString();
		if (oFF.notNull(responseString))
		{
			sb.appendLine(responseString);
		}
	}
	if (oFF.notNull(this.m_extendedInfo))
	{
		sb.appendLine("Native error cause is available.");
	}
	return sb.toString();
};

oFF.HttpHeader = function() {};
oFF.HttpHeader.prototype = new oFF.XObject();
oFF.HttpHeader.prototype._ff_c = "HttpHeader";

oFF.HttpHeader.create = function()
{
	var header = new oFF.HttpHeader();
	header.setup();
	return header;
};
oFF.HttpHeader.prototype.m_headerMap = null;
oFF.HttpHeader.prototype.setup = function()
{
	this.m_headerMap = oFF.XProperties.create();
};
oFF.HttpHeader.prototype.releaseObject = function()
{
	this.m_headerMap = oFF.XObjectExt.release(this.m_headerMap);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.HttpHeader.prototype.getString = function(propertyName)
{
	return this.m_headerMap.getByKey(propertyName);
};
oFF.HttpHeader.prototype.setString = function(propertyName, value)
{
	this.m_headerMap.put(propertyName, value);
};
oFF.HttpHeader.prototype.setInteger = function(propertyName, value)
{
	this.m_headerMap.put(propertyName, oFF.XInteger.convertToString(value));
};
oFF.HttpHeader.prototype.getIntValue = function(propertyName)
{
	var value = this.m_headerMap.getByKey(propertyName);
	return oFF.XInteger.convertFromString(value);
};
oFF.HttpHeader.prototype.getProperties = function()
{
	return this.m_headerMap;
};
oFF.HttpHeader.prototype.generateHttpHeaderString = function()
{
	if (oFF.isNull(this.m_headerMap) || this.m_headerMap.isEmpty())
	{
		return "";
	}
	var sb = oFF.XStringBuffer.create();
	var iterator = this.m_headerMap.getKeysAsIteratorOfString();
	for (var i = 0; iterator.hasNext(); i++)
	{
		if (i > 0)
		{
			sb.append(oFF.HttpConstants.HTTP_CRLF);
		}
		var key = iterator.next();
		var value = this.m_headerMap.getByKey(key);
		sb.append(key);
		sb.append(": ");
		sb.append(value);
	}
	return sb.toString();
};
oFF.HttpHeader.prototype.toString = function()
{
	return this.generateHttpHeaderString();
};

oFF.HttpRawData = function() {};
oFF.HttpRawData.prototype = new oFF.XObject();
oFF.HttpRawData.prototype._ff_c = "HttpRawData";

oFF.HttpRawData.create = function(protocol, host, port, data)
{
	var object = new oFF.HttpRawData();
	object.setupExt(protocol, host, port, data);
	return object;
};
oFF.HttpRawData.prototype.m_host = null;
oFF.HttpRawData.prototype.m_port = 0;
oFF.HttpRawData.prototype.m_protocolType = null;
oFF.HttpRawData.prototype.m_data = null;
oFF.HttpRawData.prototype.setupExt = function(protocol, host, port, data)
{
	this.m_protocolType = protocol;
	this.m_host = host;
	this.m_port = port;
	this.m_data = data;
};
oFF.HttpRawData.prototype.releaseObject = function()
{
	this.m_host = null;
	this.m_protocolType = null;
	this.m_data = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.HttpRawData.prototype.getHost = function()
{
	return this.m_host;
};
oFF.HttpRawData.prototype.getPort = function()
{
	return this.m_port;
};
oFF.HttpRawData.prototype.getProtocolType = function()
{
	return this.m_protocolType;
};
oFF.HttpRawData.prototype.getByteArray = function()
{
	return this.m_data;
};

oFF.HttpUtils = {

	applySessionHandling:function(clientRequest, serverResponse)
	{
			var token = clientRequest.getHeaderFields().getStringByKey(oFF.HttpConstants.HD_CSRF_TOKEN);
		if (oFF.notNull(token) && oFF.XString.isEqual(token, oFF.HttpConstants.VA_CSRF_FETCH))
		{
			serverResponse.getHeaderFieldsBase().put(oFF.HttpConstants.HD_CSRF_TOKEN, oFF.XGuid.getGuid());
		}
		var queryMap = clientRequest.getQueryMap();
		if (oFF.XString.isEqual("X", queryMap.getByKey(oFF.HttpConstants.QP_PARAM_SESSION_VIA_URL)))
		{
			var sessionId = clientRequest.getHeaderFields().getByKey(oFF.HttpConstants.HD_SAP_CONTEXT_ID);
			if (oFF.isNull(sessionId))
			{
				var sessionUrlRewrite = clientRequest.getRelativePath();
				var beginIndex = oFF.XString.indexOf(sessionUrlRewrite, "(");
				var endIndex = oFF.XString.indexOf(sessionUrlRewrite, ")");
				if (beginIndex !== -1 && endIndex !== -1 && beginIndex < endIndex)
				{
					var value = oFF.XString.substring(sessionUrlRewrite, beginIndex + 1, endIndex);
					value = oFF.XString.replace(value, "-", "/");
					var byteArray = oFF.XHttpUtils.decodeBase64ToByteArray(value);
					var output = oFF.XByteArray.convertToString(byteArray);
					sessionId = oFF.XString.substring(output, 2, -1);
				}
			}
			var sessionIdValue;
			if (oFF.isNull(sessionId))
			{
				sessionIdValue = oFF.XStringUtils.concatenate2("s=DUMMY_SESSION_ID-", oFF.XGuid.getGuid());
			}
			else
			{
				sessionIdValue = oFF.XStringUtils.concatenate2("s=", sessionId);
			}
			var encodedValue = oFF.XHttpUtils.encodeByteArrayToBase64(oFF.XByteArray.convertFromString(sessionIdValue));
			serverResponse.getHeaderFieldsBase().put(oFF.HttpConstants.HD_SAP_URL_SESSION_ID, oFF.XStringUtils.concatenate3("(", encodedValue, ")"));
		}
	}
};

oFF.SamlRedirectScript = function() {};
oFF.SamlRedirectScript.prototype = new oFF.XObject();
oFF.SamlRedirectScript.prototype._ff_c = "SamlRedirectScript";

oFF.SamlRedirectScript.create = function(originSite, html)
{
	var newObject = new oFF.SamlRedirectScript();
	newObject.setupHttpScript(originSite, html);
	return newObject;
};
oFF.SamlRedirectScript.findStringValue = function(html, parameter)
{
	var myOffset = 0;
	var value = null;
	if (myOffset >= 0)
	{
		var fullParameter = oFF.XStringUtils.concatenate2(parameter, "=\"");
		var valueStart = oFF.XString.indexOfFrom(html, fullParameter, myOffset);
		if (valueStart === -1)
		{
			fullParameter = oFF.XStringUtils.concatenate2(parameter, " = \"");
		}
		valueStart = oFF.XString.indexOfFrom(html, fullParameter, myOffset);
		if (valueStart === -1)
		{
			fullParameter = oFF.XStringUtils.concatenate2(parameter, "= \"");
		}
		valueStart = oFF.XString.indexOfFrom(html, fullParameter, myOffset);
		if (valueStart === -1)
		{
			fullParameter = oFF.XStringUtils.concatenate2(parameter, " =\"");
		}
		valueStart = oFF.XString.indexOfFrom(html, fullParameter, myOffset);
		var valueEnd;
		if (valueStart >= 0)
		{
			valueStart = valueStart + oFF.XString.size(fullParameter);
			valueEnd = oFF.XString.indexOfFrom(html, "\"", valueStart);
			if (valueEnd !== -1)
			{
				value = oFF.XString.substring(html, valueStart, valueEnd);
			}
		}
		else
		{
			fullParameter = oFF.XStringUtils.concatenate2(parameter, "='");
			valueStart = oFF.XString.indexOfFrom(html, fullParameter, myOffset);
			if (valueStart === -1)
			{
				fullParameter = oFF.XStringUtils.concatenate2(parameter, " = '");
			}
			valueStart = oFF.XString.indexOfFrom(html, fullParameter, myOffset);
			if (valueStart === -1)
			{
				fullParameter = oFF.XStringUtils.concatenate2(parameter, " ='");
			}
			valueStart = oFF.XString.indexOfFrom(html, fullParameter, myOffset);
			if (valueStart === -1)
			{
				fullParameter = oFF.XStringUtils.concatenate2(parameter, "= '");
			}
			valueStart = oFF.XString.indexOfFrom(html, fullParameter, myOffset);
			if (valueStart >= 0)
			{
				valueStart = valueStart + oFF.XString.size(fullParameter);
				valueEnd = oFF.XString.indexOfFrom(html, "'", valueStart);
				if (valueEnd !== -1)
				{
					value = oFF.XString.substring(html, valueStart, valueEnd);
				}
			}
			else
			{
				fullParameter = oFF.XStringUtils.concatenate2(parameter, "=");
				valueStart = oFF.XString.indexOfFrom(html, fullParameter, myOffset);
				if (valueStart >= 0)
				{
					valueStart = valueStart + oFF.XString.size(fullParameter);
					valueEnd = oFF.XString.indexOfFrom(html, ";", valueStart);
					if (valueEnd !== -1)
					{
						value = oFF.XString.substring(html, valueStart, valueEnd);
					}
				}
			}
		}
	}
	return oFF.XmlUtils.unescapeRawXmlString(value, true);
};
oFF.SamlRedirectScript.prototype.m_isValid = false;
oFF.SamlRedirectScript.prototype.getSignature = function()
{
	return this.m_signature;
};
oFF.SamlRedirectScript.prototype.m_signature = null;
oFF.SamlRedirectScript.prototype.m_redirectLocation = null;
oFF.SamlRedirectScript.prototype.m_target = null;
oFF.SamlRedirectScript.prototype.m_originSite = null;
oFF.SamlRedirectScript.prototype.setupHttpScript = function(originSite, html)
{
	this.m_originSite = originSite;
	if (oFF.notNull(html))
	{
		if (oFF.XString.containsString(html, "<meta name=\"redirect\""))
		{
			this.m_redirectLocation = this.extractRedirectLocationFromMetaTag(html);
		}
		else
		{
			var scriptStart = oFF.XString.indexOf(html, "<script");
			if (scriptStart !== -1)
			{
				var scriptEnd = oFF.XString.indexOfFrom(html, "</script>", scriptStart);
				if (scriptEnd !== -1)
				{
					var thescript = oFF.XString.substring(html, scriptStart, scriptEnd);
					this.m_redirectLocation = oFF.SamlRedirectScript.findStringValue(thescript, "location");
					if (oFF.XStringUtils.isNullOrEmpty(this.m_redirectLocation))
					{
						this.m_redirectLocation = oFF.SamlRedirectScript.findStringValue(thescript, "link");
					}
					this.m_signature = oFF.SamlRedirectScript.findStringValue(thescript, "signature");
				}
			}
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_redirectLocation))
		{
			this.m_isValid = true;
		}
	}
};
oFF.SamlRedirectScript.prototype.extractRedirectLocationFromMetaTag = function(html)
{
	var metaRedirectIndex = oFF.XString.indexOf(html, "<meta name=\"redirect\"");
	var start = oFF.XString.indexOfFrom(html, "content=\"", metaRedirectIndex) + oFF.XString.size("content=\"");
	var end = oFF.XString.indexOfFrom(html, "\">", start);
	var substring = oFF.XString.substring(html, start, end);
	return oFF.XmlUtils.unescapeRawXmlString(substring, true);
};
oFF.SamlRedirectScript.prototype.getTarget = function()
{
	if (oFF.isNull(this.m_target))
	{
		this.m_target = oFF.XUri.createFromUrlWithParent(oFF.XString.replace(oFF.XString.replace(this.m_redirectLocation, "\\/", "/"), "\\u0026", "&"), this.m_originSite, false);
	}
	return this.m_target;
};
oFF.SamlRedirectScript.prototype.setTarget = function(target)
{
	this.m_target = target;
};
oFF.SamlRedirectScript.prototype.getOriginSite = function()
{
	return this.m_originSite;
};
oFF.SamlRedirectScript.prototype.isValid = function()
{
	return this.m_isValid;
};

oFF.RpcFunctionFactory = function() {};
oFF.RpcFunctionFactory.prototype = new oFF.XObject();
oFF.RpcFunctionFactory.prototype._ff_c = "RpcFunctionFactory";

oFF.RpcFunctionFactory.s_factoryByProtocol = null;
oFF.RpcFunctionFactory.s_factoryBySystemType = null;
oFF.RpcFunctionFactory.s_defaultFactory = null;
oFF.RpcFunctionFactory.staticSetupFunctionFactory = function()
{
	oFF.RpcFunctionFactory.s_factoryByProtocol = oFF.XHashMapByString.create();
	oFF.RpcFunctionFactory.s_factoryBySystemType = oFF.XHashMapByString.create();
};
oFF.RpcFunctionFactory.registerDefaultFactory = function(factory)
{
	oFF.RpcFunctionFactory.s_defaultFactory = factory;
};
oFF.RpcFunctionFactory.registerFactory = function(protocolType, systemType, factory)
{
	if (oFF.notNull(protocolType))
	{
		oFF.RpcFunctionFactory.s_factoryByProtocol.put(protocolType.getName(), factory);
	}
	if (oFF.notNull(systemType))
	{
		oFF.RpcFunctionFactory.s_factoryBySystemType.put(systemType.getName(), factory);
	}
};
oFF.RpcFunctionFactory.create = function(context, connectionInfo, name, systemType, protocolType)
{
	var factory = null;
	if (oFF.notNull(systemType))
	{
		factory = oFF.RpcFunctionFactory.s_factoryBySystemType.getByKey(systemType.getName());
	}
	if (oFF.isNull(factory))
	{
		factory = oFF.RpcFunctionFactory.s_factoryByProtocol.getByKey(protocolType.getName());
	}
	if (oFF.isNull(factory))
	{
		factory = oFF.RpcFunctionFactory.s_defaultFactory;
	}
	var result = null;
	if (oFF.notNull(factory))
	{
		result = factory.newRpcFunction(context, connectionInfo, name, systemType, protocolType);
	}
	return result;
};

oFF.RpcRequest = function() {};
oFF.RpcRequest.prototype = new oFF.XObject();
oFF.RpcRequest.prototype._ff_c = "RpcRequest";

oFF.RpcRequest.create = function(ocpFunction, connectionInfo)
{
	var request = new oFF.RpcRequest();
	request.setupExt(ocpFunction, connectionInfo);
	return request;
};
oFF.RpcRequest.prototype.m_type = null;
oFF.RpcRequest.prototype.m_function = null;
oFF.RpcRequest.prototype.m_connectionInfo = null;
oFF.RpcRequest.prototype.m_mainParameterStructure = null;
oFF.RpcRequest.prototype.m_method = null;
oFF.RpcRequest.prototype.m_additionalParameters = null;
oFF.RpcRequest.prototype.m_acceptContentType = null;
oFF.RpcRequest.prototype.m_requestContentType = null;
oFF.RpcRequest.prototype.m_isFireAndForgetCall = false;
oFF.RpcRequest.prototype.m_isLogoff = false;
oFF.RpcRequest.prototype.m_isStatelessRequestEnforced = false;
oFF.RpcRequest.prototype.m_cacheFingerprint = null;
oFF.RpcRequest.prototype.m_cacheFingerprintGenerator = null;
oFF.RpcRequest.prototype.setupExt = function(ocpFunction, connectionInfo)
{
	this.m_type = oFF.RpcRequestType.NONE;
	this.m_method = oFF.HttpRequestMethod.HTTP_POST;
	this.m_acceptContentType = oFF.ContentType.APPLICATION_JSON;
	this.m_requestContentType = oFF.ContentType.APPLICATION_JSON;
	this.m_additionalParameters = oFF.XProperties.create();
	this.setFunction(ocpFunction);
	this.setConnectionInfo(connectionInfo);
};
oFF.RpcRequest.prototype.releaseObject = function()
{
	this.m_type = null;
	this.m_function = null;
	this.m_connectionInfo = null;
	this.m_mainParameterStructure = null;
	this.m_method = null;
	this.m_acceptContentType = null;
	this.m_requestContentType = null;
	this.m_additionalParameters = oFF.XObjectExt.release(this.m_additionalParameters);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RpcRequest.prototype.getRequestStructure = function()
{
	return this.m_mainParameterStructure;
};
oFF.RpcRequest.prototype.getRequestType = function()
{
	return this.m_type;
};
oFF.RpcRequest.prototype.setRequestType = function(requestType)
{
	this.m_type = requestType;
};
oFF.RpcRequest.prototype.setRequestStructure = function(requestStructure)
{
	this.m_mainParameterStructure = requestStructure;
	this.m_type = oFF.RpcRequestType.detectTypeFromJson(requestStructure);
};
oFF.RpcRequest.prototype.getMethod = function()
{
	return this.m_method;
};
oFF.RpcRequest.prototype.setMethod = function(method)
{
	this.m_method = method;
};
oFF.RpcRequest.prototype.getAdditionalParameters = function()
{
	return this.m_additionalParameters;
};
oFF.RpcRequest.prototype.getAcceptContentType = function()
{
	return this.m_acceptContentType;
};
oFF.RpcRequest.prototype.setAcceptContentType = function(contentType)
{
	this.m_acceptContentType = contentType;
};
oFF.RpcRequest.prototype.getRequestContentType = function()
{
	return this.m_requestContentType;
};
oFF.RpcRequest.prototype.setRequestContentType = function(contentType)
{
	this.m_requestContentType = contentType;
};
oFF.RpcRequest.prototype.getFunction = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_function);
};
oFF.RpcRequest.prototype.setFunction = function(ocpFunction)
{
	this.m_function = oFF.XWeakReferenceUtil.getWeakRef(ocpFunction);
};
oFF.RpcRequest.prototype.getConnectionInfo = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_connectionInfo);
};
oFF.RpcRequest.prototype.setConnectionInfo = function(connectionInfo)
{
	this.m_connectionInfo = oFF.XWeakReferenceUtil.getWeakRef(connectionInfo);
};
oFF.RpcRequest.prototype.isFireAndForgetCall = function()
{
	return this.m_isFireAndForgetCall;
};
oFF.RpcRequest.prototype.setIsFireAndForgetCall = function(isFireAndForgetCall)
{
	this.m_isFireAndForgetCall = isFireAndForgetCall;
};
oFF.RpcRequest.prototype.setIsLogoff = function(isLogoff)
{
	this.m_isLogoff = isLogoff;
};
oFF.RpcRequest.prototype.isLogoff = function()
{
	return this.m_isLogoff;
};
oFF.RpcRequest.prototype.isStatelessRequestEnforced = function()
{
	return this.m_isStatelessRequestEnforced;
};
oFF.RpcRequest.prototype.setIsStatelessRequestEnforced = function(isStatelessRequestEnforced)
{
	this.m_isStatelessRequestEnforced = isStatelessRequestEnforced;
};
oFF.RpcRequest.prototype.getCacheFingerprint = function()
{
	if (oFF.isNull(this.m_cacheFingerprint) && oFF.notNull(this.m_cacheFingerprintGenerator))
	{
		this.m_cacheFingerprint = this.m_cacheFingerprintGenerator.generateCacheFingerprint(this);
	}
	return this.m_cacheFingerprint;
};
oFF.RpcRequest.prototype.setCacheFingerprint = function(fingerprint)
{
	this.m_cacheFingerprint = fingerprint;
};
oFF.RpcRequest.prototype.getCacheFingerprintGenerator = function()
{
	return this.m_cacheFingerprintGenerator;
};
oFF.RpcRequest.prototype.setCacheFingerprintGenerator = function(generator)
{
	this.m_cacheFingerprintGenerator = generator;
};

oFF.RpcResponse = function() {};
oFF.RpcResponse.prototype = new oFF.XObject();
oFF.RpcResponse.prototype._ff_c = "RpcResponse";

oFF.RpcResponse.create = function(ocpFunction)
{
	var request = new oFF.RpcResponse();
	request.setupExt(ocpFunction);
	return request;
};
oFF.RpcResponse.prototype.m_function = null;
oFF.RpcResponse.prototype.m_rootElement = null;
oFF.RpcResponse.prototype.m_rootElementString = null;
oFF.RpcResponse.prototype.setupExt = function(ocpFunction)
{
	this.setFunction(ocpFunction);
};
oFF.RpcResponse.prototype.releaseObject = function()
{
	this.m_function = null;
	this.m_rootElement = null;
	this.m_rootElementString = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.RpcResponse.prototype.getRootElement = function()
{
	if (oFF.notNull(this.m_rootElement) && this.m_rootElement.isStructure())
	{
		return this.m_rootElement;
	}
	return null;
};
oFF.RpcResponse.prototype.getRootElementGeneric = function()
{
	return this.m_rootElement;
};
oFF.RpcResponse.prototype.setRootElement = function(rootElement, rootElementAsString)
{
	this.m_rootElement = rootElement;
	this.m_rootElementString = rootElementAsString;
};
oFF.RpcResponse.prototype.getRootElementAsString = function()
{
	return this.m_rootElementString;
};
oFF.RpcResponse.prototype.getFunction = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_function);
};
oFF.RpcResponse.prototype.setFunction = function(ocpFunction)
{
	this.m_function = oFF.XWeakReferenceUtil.getWeakRef(ocpFunction);
};
oFF.RpcResponse.prototype.toString = function()
{
	if (oFF.isNull(this.m_rootElement))
	{
		return "Ocp response: No element defined.\n";
	}
	return oFF.XStringUtils.concatenate2(this.m_rootElement.toString(), "\n");
};

oFF.UserSettingsFactory = function() {};
oFF.UserSettingsFactory.prototype = new oFF.XObject();
oFF.UserSettingsFactory.prototype._ff_c = "UserSettingsFactory";

oFF.UserSettingsFactory.s_factory = null;
oFF.UserSettingsFactory.create = function(session)
{
	if (oFF.isNull(oFF.UserSettingsFactory.s_factory))
	{
		return oFF.DfUserSettings.create(session);
	}
	return oFF.UserSettingsFactory.s_factory.newUserSettings(session);
};
oFF.UserSettingsFactory.registerFactory = function(factory)
{
	oFF.UserSettingsFactory.s_factory = factory;
};

oFF.SqlDriverFactory = function() {};
oFF.SqlDriverFactory.prototype = new oFF.XObject();
oFF.SqlDriverFactory.prototype._ff_c = "SqlDriverFactory";

oFF.SqlDriverFactory.s_driverFactory = null;
oFF.SqlDriverFactory.create = function(driverName)
{
	var driver = null;
	if (oFF.notNull(oFF.SqlDriverFactory.s_driverFactory))
	{
		driver = oFF.SqlDriverFactory.s_driverFactory.newSqlDriver(driverName);
	}
	return driver;
};
oFF.SqlDriverFactory.registerFactory = function(driverFactory)
{
	oFF.SqlDriverFactory.s_driverFactory = driverFactory;
};

oFF.DocumentEnv = function() {};
oFF.DocumentEnv.prototype = new oFF.XObject();
oFF.DocumentEnv.prototype._ff_c = "DocumentEnv";

oFF.DocumentEnv.s_environmentProvider = null;
oFF.DocumentEnv.staticSetup = function()
{
	oFF.DocumentEnv.setNative(new oFF.DocumentEnv());
};
oFF.DocumentEnv.setNative = function(nativeNetworkEnv)
{
	oFF.DocumentEnv.s_environmentProvider = nativeNetworkEnv;
};
oFF.DocumentEnv.setStringAtId = function(id, value)
{
	if (oFF.notNull(oFF.DocumentEnv.s_environmentProvider))
	{
		oFF.DocumentEnv.s_environmentProvider.setNativeStringAtId(id, value);
	}
};
oFF.DocumentEnv.prototype.setNativeStringAtId = function(id, value) {};

oFF.NetworkEnv = function() {};
oFF.NetworkEnv.prototype = new oFF.XObject();
oFF.NetworkEnv.prototype._ff_c = "NetworkEnv";

oFF.NetworkEnv.s_nativeEnvironment = null;
oFF.NetworkEnv.staticSetup = function()
{
	oFF.NetworkEnv.setNative(new oFF.NetworkEnv());
};
oFF.NetworkEnv.setNative = function(nativeNetworkEnv)
{
	oFF.NetworkEnv.s_nativeEnvironment = nativeNetworkEnv;
};
oFF.NetworkEnv.getLocation = function()
{
	return oFF.NetworkEnv.s_nativeEnvironment.getNativeLocation();
};
oFF.NetworkEnv.setLocation = function(location)
{
	oFF.NetworkEnv.s_nativeEnvironment.setNativeLocation(location);
};
oFF.NetworkEnv.getFragment = function()
{
	return oFF.NetworkEnv.s_nativeEnvironment.getNativeFragment();
};
oFF.NetworkEnv.setFragment = function(fragment)
{
	oFF.NetworkEnv.s_nativeEnvironment.setNativeFragment(fragment);
};
oFF.NetworkEnv.setDomain = function(domain)
{
	oFF.NetworkEnv.s_nativeEnvironment.setNativeDomain(domain);
};
oFF.NetworkEnv.prototype.m_location = null;
oFF.NetworkEnv.prototype.m_fragment = null;
oFF.NetworkEnv.prototype.getNativeLocation = function()
{
	return this.m_location;
};
oFF.NetworkEnv.prototype.setNativeLocation = function(location)
{
	this.m_location = location;
};
oFF.NetworkEnv.prototype.getNativeFragment = function()
{
	return this.m_fragment;
};
oFF.NetworkEnv.prototype.setNativeFragment = function(fragment)
{
	this.m_fragment = fragment;
};
oFF.NetworkEnv.prototype.setNativeDomain = function(domain) {};

oFF.Dispatcher = {

	s_singleton:null,
	staticSetup:function()
	{
			oFF.Dispatcher.s_singleton = oFF.DispatcherSingleThread.create();
	},
	getInstance:function()
	{
			return oFF.Dispatcher.s_singleton;
	},
	setInstance:function(dispatcher)
	{
			oFF.Dispatcher.s_singleton = dispatcher;
	},
	replaceInstance:function(dispatcher)
	{
			var oldDispatcher = oFF.Dispatcher.getInstance();
		if (oFF.notNull(oldDispatcher))
		{
			oFF.XObjectExt.release(oldDispatcher);
		}
		oFF.Dispatcher.setInstance(dispatcher);
	}
};

oFF.InactiveCapabilityUtil = function() {};
oFF.InactiveCapabilityUtil.prototype = new oFF.XObject();
oFF.InactiveCapabilityUtil.prototype._ff_c = "InactiveCapabilityUtil";

oFF.InactiveCapabilityUtil.assertVersionValid = function(experimentalFeature, activeVersion)
{
	if (false)
	{
		var maxXVersion = experimentalFeature.getXVersion();
		if (maxXVersion > -1 && maxXVersion < activeVersion)
		{
			var message = oFF.XStringBuffer.create();
			message.append("The capability '").append(experimentalFeature.getName()).append("' is already released in the currently active XVersion!");
			message.append("\nActive XVersion: ").appendInt(activeVersion);
			message.append("\nWas released in XVersion: ").appendInt(experimentalFeature.getXVersion());
			throw oFF.XException.createIllegalArgumentException(message.toString());
		}
	}
};
oFF.InactiveCapabilityUtil.exportFeatureToggles = function(featureToggles)
{
	if (oFF.isNull(featureToggles) || featureToggles.isEmpty())
	{
		return null;
	}
	var buffer = oFF.XStringBuffer.create();
	var keysAsIteratorOfString = featureToggles.getKeysAsIteratorOfString();
	var firstEntry = true;
	while (keysAsIteratorOfString.hasNext())
	{
		if (!firstEntry)
		{
			buffer.append(",");
		}
		buffer.append(keysAsIteratorOfString.next());
		firstEntry = false;
	}
	return buffer.toString();
};

oFF.XLibVersionUtil = {

	getLibVersion:function(versionContext)
	{
			var libVerBuffer = oFF.XStringBuffer.create();
		libVerBuffer.append("[FF-XV:").appendInt(versionContext.getXVersion());
		libVerBuffer.append("/LV:").appendInt(oFF.XApiVersion.LIBRARY);
		libVerBuffer.append("/GC:").append(oFF.XApiVersion.GIT_COMMIT_ID);
		libVerBuffer.append("/LG:").append(oFF.XLanguage.getLanguage().getName()).append("]");
		return libVerBuffer.toString();
	}
};

oFF.XVersion = {

	MIN:127,
	MAX:322,
	DEFAULT_VALUE:322,
	V126_MULTIPLE_EX_AGG_DIMS_IN_CALC_PLAN:126,
	V127_IS_USED_CONDITION:127,
	V140_REPOSITORY_PERSIST_PAGING:140,
	V142_HIERARCHY_INFO_IN_FILTER:142,
	V144_NO_MEASURE_READMODE:144,
	V145_NO_EMPTY_OPTIONS:145,
	V146_NO_EMPTY_SORT:146,
	V147_NO_NON_EMPTY:147,
	V148_NO_DUPLICATED_READMODE:148,
	V149_HIERARCHY_LEVEL:149,
	V151_ACTIVATE_DEFAULT_HIERARCHY:151,
	V156_CORRECT_DRILLSTATE_IN_CLASSIC_RESULTSET:156,
	V158_UNIVERSAL_DISPLAY_HIERARCHY_ZERO_BASED:158,
	V160_OPTIMIZE_HIERARCHY_EXPORT:160,
	V166_CUBE_CACHE:166,
	V168_EXT_KEYFIGURE_PROPERTIES:168,
	V170_EXPORT_FREE_AXIS_FOR_PLANNING:170,
	V172_NUMBER_AS_STRING:172,
	V174_QDATA_CELL_MODEL_DEFAULTS:174,
	V176_CLIENT_INFO_METADATA:176,
	V178_OPTIMIZE_MDS_CATALOG:178,
	V184_SINGLE_VALUE_VARS_NO_SUPPORT_EXCLUDING:184,
	V186_DISP_HIERARCHY_FIX_IN_FILTER:186,
	V188_MEMBER_VALUE_EXCEPTIONS:188,
	V190_METADATA_CUBE_RESPONSE_SUPPRESS_PROPERTIES:190,
	V192_FUSION_SERVICE:192,
	V194_SIMPLIFIED_CAPABILITY_MERGE:194,
	V198_CORRECT_DIMENSION_DESCRIPTION:198,
	V200_AUTO_CSRF_CALL:200,
	V202_SERVER_METADATA_VIA_SYSTEM_CONNECT:202,
	V204_UNIFIED_DATACELLS:204,
	V210_DATASOURCE_TYPE_QUERY_METADATA:210,
	V212_DATASOURCE_TYPE_QUERY:212,
	V214_CUBE_BLENDING_N_QUERIES:214,
	V216_TUPLES_OPERAND:216,
	V218_WINDOW_FUNCTION:218,
	V220_UNIVERSE_SOURCE_QUERY:220,
	V222_SHARED_CSRF_TOKENS:222,
	V224_METADATA_DIMENSION_OTHERS:224,
	V226_METADATA_DIMENSION_IS_MODELED:226,
	V230_SUPPRESS_SUPPLEMENTS:230,
	V232_SID_PRESENTATION:232,
	V236_NAMED_CUSTOM_DIMENSION_MEMBER:236,
	V244_CUSTOM_DIMENSION_2_AGILE_BI:244,
	V246_CUSTOM_DIMENSION_2_INA_MODEL:246,
	V248_DYN_MEMBERS_ON_NON_MEASURE_STRUCTURE:248,
	V250_UDH_ALIGNMENT:250,
	V254_NULL_ZERO_SUPPRESSION:254,
	V256_INPUT_READINESS_WITH_NAVIGATIONAL_ATTRIBUTES:256,
	V264_RESULTSET_CELL_MEASURE:264,
	V266_RESULTSETV2_METADATA_EXTENSION1:266,
	V268_RESULTSET_CELL_FORMAT_TYPE_SPECIFIC:268,
	V270_ITERATED_FORMULA:270,
	V272_CDS_PROJECTION_VIEWS:272,
	V274_CELL_DOCUMENT_ID:274,
	V276_IMPROVED_DYNAMIC_VARIABLE_UPDATE:276,
	V278_INA_SHIFT_PERIOD_FOR_TRANSIENT_TIME_OPERATIONS:278,
	V282_SFX_MINIMUM_DRILL_STATE:282,
	V284_SFX_HIDDEN_DIMENSIONS:284,
	V286_AUTO_VARIABLE_SUBMIT_CAPABILITY:286,
	V287_AUTO_VARIABLE_SUBMIT_FUNCTIONALITY:287,
	V288_MULTIPLE_ACCOUNT_HIERARCHIES:288,
	V292_MEMBER_OVERRIDE_TEXTS:292,
	V294_HIERARCHY_PATH_PRESENTATION_TYPE:294,
	V296_DIMENSION_KEY_ATTRIBUTES:296,
	V298_TUPLE_COUNT_BEFORE_SLICING:298,
	V300_INA_REPOSITORY_DELTA:300,
	V302_TEXT_IN_HIERARCHY:302,
	V304_QUERY_ALIAS_FROM_CATALOG:304,
	V306_LAZY_LOADING_SFX_ACCOUNT_MEMBERS:306,
	V308_ASYNC_BLENDING_BATCH_REQUEST:308,
	V310_HAS_CHECK_TABLE_DEFAULT_FALSE:310,
	V312_UNDO_USE_ALLOW_LIST:312,
	V314_UNDO_RELEASE_QUERY_MANAGERS:314,
	V316_BW_SESSION_ID_VIA_GET_RESPONSE:316,
	V318_TIME_MEASURE_WITH_FLAT_AND_HIERARCHICAL_FILTER:318,
	V320_MAINTAIN_VARIABLE_VARIANTS:320,
	V322_HIERARCHY_CATALOG:322,
	V999_NEW_VAR_VALUE_HELP:999
};

oFF.XInterruptStep = function() {};
oFF.XInterruptStep.prototype = new oFF.XObject();
oFF.XInterruptStep.prototype._ff_c = "XInterruptStep";

oFF.XInterruptStep.create = function()
{
	return new oFF.XInterruptStep();
};
oFF.XInterruptStep.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
};

oFF.TimerItem = function() {};
oFF.TimerItem.prototype = new oFF.XObject();
oFF.TimerItem.prototype._ff_c = "TimerItem";

oFF.TimerItem.create = function(milliseconds, listener, customIdentifier)
{
	var object = new oFF.TimerItem();
	object.setupExt(milliseconds, listener, customIdentifier, false);
	return object;
};
oFF.TimerItem.createInterval = function(milliseconds, listener, customIdentifier)
{
	var object = new oFF.TimerItem();
	object.setupExt(milliseconds, listener, customIdentifier, true);
	return object;
};
oFF.TimerItem.prototype.m_deltaMilliseconds = 0;
oFF.TimerItem.prototype.m_targetPointInTime = 0;
oFF.TimerItem.prototype.m_listener = null;
oFF.TimerItem.prototype.m_customIdentifier = null;
oFF.TimerItem.prototype.m_isInterval = false;
oFF.TimerItem.prototype.setupExt = function(milliseconds, listener, customIdentifier, isInterval)
{
	this.m_deltaMilliseconds = milliseconds;
	this.m_listener = listener;
	this.m_customIdentifier = customIdentifier;
	this.m_isInterval = isInterval;
	this.setTargetPointInTime();
};
oFF.TimerItem.prototype.releaseObject = function()
{
	this.m_customIdentifier = null;
	this.m_listener = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.TimerItem.prototype.setTargetPointInTime = function()
{
	this.m_targetPointInTime = oFF.XSystemUtils.getCurrentTimeInMilliseconds() + this.m_deltaMilliseconds;
};
oFF.TimerItem.prototype.isMatching = function(pointInTime)
{
	return this.m_targetPointInTime <= pointInTime;
};
oFF.TimerItem.prototype.isInterval = function()
{
	return this.m_isInterval;
};
oFF.TimerItem.prototype.execute = function()
{
	this.m_listener.onTimerEvent(this, this.m_customIdentifier);
};

oFF.WorkingTaskManagerFactory = function() {};
oFF.WorkingTaskManagerFactory.prototype = new oFF.XObject();
oFF.WorkingTaskManagerFactory.prototype._ff_c = "WorkingTaskManagerFactory";

oFF.WorkingTaskManagerFactory.s_factory1 = null;
oFF.WorkingTaskManagerFactory.s_factory2 = null;
oFF.WorkingTaskManagerFactory.s_factory3 = null;
oFF.WorkingTaskManagerFactory.create = function(type, allocatorScope)
{
	var factory = null;
	if (type === oFF.WorkingTaskManagerType.MULTI_THREADED)
	{
		factory = oFF.WorkingTaskManagerFactory.s_factory1;
	}
	else if (type === oFF.WorkingTaskManagerType.SINGLE_THREADED)
	{
		factory = oFF.WorkingTaskManagerFactory.s_factory2;
	}
	else if (type === oFF.WorkingTaskManagerType.UI_DRIVER)
	{
		factory = oFF.WorkingTaskManagerFactory.s_factory3;
	}
	return oFF.isNull(factory) ? null : factory.newWorkingTaskManager(allocatorScope);
};
oFF.WorkingTaskManagerFactory.registerFactoryViaClass = function(type, clazz)
{
	var newObj = new oFF.WorkingTaskManagerFactory();
	newObj.m_clazz = clazz;
	oFF.WorkingTaskManagerFactory.registerFactory(type, newObj);
};
oFF.WorkingTaskManagerFactory.registerFactory = function(type, factory)
{
	if (type === oFF.WorkingTaskManagerType.MULTI_THREADED)
	{
		oFF.WorkingTaskManagerFactory.s_factory1 = factory;
	}
	else if (type === oFF.WorkingTaskManagerType.SINGLE_THREADED)
	{
		oFF.WorkingTaskManagerFactory.s_factory2 = factory;
	}
	else if (type === oFF.WorkingTaskManagerType.UI_DRIVER)
	{
		oFF.WorkingTaskManagerFactory.s_factory3 = factory;
	}
};
oFF.WorkingTaskManagerFactory.prototype.m_clazz = null;
oFF.WorkingTaskManagerFactory.prototype.newWorkingTaskManager = function(allocatorScope)
{
	return this.m_clazz.newInstance(allocatorScope);
};

oFF.ListenerPairTyped = function() {};
oFF.ListenerPairTyped.prototype = new oFF.XObject();
oFF.ListenerPairTyped.prototype._ff_c = "ListenerPairTyped";

oFF.ListenerPairTyped.create = function(listener, customIdentifier)
{
	oFF.XObjectExt.assertNotNullExt(listener, "Listener is null!");
	var pair = new oFF.ListenerPairTyped();
	pair.setupExt(listener, customIdentifier);
	return pair;
};
oFF.ListenerPairTyped.prototype.m_listener = null;
oFF.ListenerPairTyped.prototype.m_customIdentifier = null;
oFF.ListenerPairTyped.prototype.setupExt = function(listener, customIdentifier)
{
	this.m_listener = listener;
	this.m_customIdentifier = customIdentifier;
};
oFF.ListenerPairTyped.prototype.releaseObject = function()
{
	this.m_customIdentifier = null;
	this.m_listener = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.ListenerPairTyped.prototype.getListener = function()
{
	return this.m_listener;
};
oFF.ListenerPairTyped.prototype.getCustomIdentifier = function()
{
	return this.m_customIdentifier;
};

oFF.SyncActionListenerPair = function() {};
oFF.SyncActionListenerPair.prototype = new oFF.XObject();
oFF.SyncActionListenerPair.prototype._ff_c = "SyncActionListenerPair";

oFF.SyncActionListenerPair.create = function(listener, type, customIdentifier)
{
	oFF.XObjectExt.assertNotNullExt(listener, "Listener is null!");
	var pair = new oFF.SyncActionListenerPair();
	pair.setupExt(listener, type, customIdentifier);
	return pair;
};
oFF.SyncActionListenerPair.prototype.m_listener = null;
oFF.SyncActionListenerPair.prototype.m_customIdentifier = null;
oFF.SyncActionListenerPair.prototype.m_type = null;
oFF.SyncActionListenerPair.prototype.setupExt = function(listener, type, customIdentifier)
{
	this.m_listener = listener;
	this.m_type = type;
	this.m_customIdentifier = customIdentifier;
};
oFF.SyncActionListenerPair.prototype.releaseObject = function()
{
	this.m_customIdentifier = null;
	this.m_listener = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.SyncActionListenerPair.prototype.getListener = function()
{
	return this.m_listener;
};
oFF.SyncActionListenerPair.prototype.getListenerType = function()
{
	return this.m_type;
};
oFF.SyncActionListenerPair.prototype.getCustomIdentifier = function()
{
	return this.m_customIdentifier;
};

oFF.XCacheProviderBasicFactory = function() {};
oFF.XCacheProviderBasicFactory.prototype = new oFF.XCacheProviderFactory();
oFF.XCacheProviderBasicFactory.prototype._ff_c = "XCacheProviderBasicFactory";

oFF.XCacheProviderBasicFactory.staticSetup = function()
{
	oFF.XCacheProviderFactory.registerFactory(oFF.XCacheProviderFactory.DRIVER_FILE, new oFF.XCacheProviderBasicFactory());
	oFF.XCacheProviderFactory.registerFactory(oFF.XCacheProviderFactory.DRIVER_MEMORY, new oFF.XCacheProviderBasicFactory());
};
oFF.XCacheProviderBasicFactory.prototype.newDeviceCacheAccess = function(session, driverName)
{
	var cache = null;
	if (oFF.XString.isEqual(oFF.XCacheProviderFactory.DRIVER_FILE, driverName))
	{
		cache = oFF.XCacheProviderFile.create(session);
	}
	else if (oFF.XString.isEqual(oFF.XCacheProviderFactory.DRIVER_MEMORY, driverName))
	{
		cache = oFF.XCacheProviderInMemory.create(session);
	}
	return cache;
};

oFF.XAuthenticationToken = function() {};
oFF.XAuthenticationToken.prototype = new oFF.XObject();
oFF.XAuthenticationToken.prototype._ff_c = "XAuthenticationToken";

oFF.XAuthenticationToken.create = function(accessToken)
{
	var token = new oFF.XAuthenticationToken();
	token.m_accessToken = accessToken;
	return token;
};
oFF.XAuthenticationToken.prototype.m_accessToken = null;
oFF.XAuthenticationToken.prototype.getAccessToken = function()
{
	return this.m_accessToken;
};
oFF.XAuthenticationToken.prototype.setAccessToken = function(token)
{
	this.m_accessToken = token;
};

oFF.HttpClientFactory = function() {};
oFF.HttpClientFactory.prototype = new oFF.XObject();
oFF.HttpClientFactory.prototype._ff_c = "HttpClientFactory";

oFF.HttpClientFactory.s_clientFactoryMap = null;
oFF.HttpClientFactory.staticSetupClientFactory = function()
{
	oFF.HttpClientFactory.s_clientFactoryMap = oFF.XHashMapByString.create();
};
oFF.HttpClientFactory.newInstanceByConnection = function(session, connection)
{
	var uri = connection.getUrlStringExt(true, false, false, false, true, false, false, false);
	var clientFactory = oFF.HttpClientFactory.s_clientFactoryMap.getByKey(uri);
	var client = null;
	if (oFF.notNull(clientFactory))
	{
		client = clientFactory.newHttpClientInstance(session);
	}
	else
	{
		uri = connection.getUrlStringExt(true, false, false, true, false, false, false, false);
		clientFactory = oFF.HttpClientFactory.s_clientFactoryMap.getByKey(uri);
		if (oFF.notNull(clientFactory))
		{
			client = clientFactory.newHttpClientInstance(session);
		}
		else
		{
			uri = connection.getUrlStringExt(true, false, false, false, false, false, false, false);
			clientFactory = oFF.HttpClientFactory.s_clientFactoryMap.getByKey(uri);
			if (oFF.notNull(clientFactory))
			{
				client = clientFactory.newHttpClientInstance(session);
			}
		}
	}
	return client;
};
oFF.HttpClientFactory.setHttpClientFactoryForProtocol = function(protocolType, httpClientFactory)
{
	var uri = oFF.XUri.create();
	uri.setProtocolType(protocolType);
	return oFF.HttpClientFactory.setHttpClientFactoryForConnection(uri, httpClientFactory);
};
oFF.HttpClientFactory.setHttpClientFactoryForConnection = function(connection, httpClientFactory)
{
	var uriValue = connection.getUrlStringExt(true, false, false, true, true, false, false, false);
	var oldFactory = oFF.HttpClientFactory.s_clientFactoryMap.getByKey(uriValue);
	oFF.HttpClientFactory.s_clientFactoryMap.put(uriValue, httpClientFactory);
	return oldFactory;
};

oFF.HttpServerFactory = function() {};
oFF.HttpServerFactory.prototype = new oFF.XObject();
oFF.HttpServerFactory.prototype._ff_c = "HttpServerFactory";

oFF.HttpServerFactory.s_httpServerFactory = null;
oFF.HttpServerFactory.staticSetupHttpClientFactory = function()
{
	var defaultFactory = new oFF.HttpServerFactory();
	oFF.HttpServerFactory.registerFactory(defaultFactory);
};
oFF.HttpServerFactory.newInstance = function(session, serverConfig, useLocalLoop)
{
	if (!useLocalLoop)
	{
		oFF.HttpServerFactory.s_httpServerFactory.newHttpServerInstance(session, serverConfig);
	}
	else
	{
		var localLoopFactory = oFF.HttpLocalLoopFactory.create(serverConfig);
		var uri = oFF.XUri.createFromConnection(serverConfig);
		if (uri.getProtocolType() === null)
		{
			uri.setProtocolType(oFF.ProtocolType.HTTP);
		}
		oFF.HttpClientFactory.setHttpClientFactoryForConnection(uri, localLoopFactory);
		var port = uri.getPort();
		if (port !== 0)
		{
			var host = uri.getHost();
			if (oFF.isNull(host) || oFF.XString.isEqual("0.0.0.0", host))
			{
				uri.setHost("localhost");
				oFF.HttpClientFactory.setHttpClientFactoryForConnection(uri, localLoopFactory);
			}
		}
	}
};
oFF.HttpServerFactory.registerFactory = function(httpServerFactory)
{
	oFF.HttpServerFactory.s_httpServerFactory = httpServerFactory;
};
oFF.HttpServerFactory.prototype.newHttpServerInstance = function(session, serverConfig) {};

oFF.HttpFileFactory = function() {};
oFF.HttpFileFactory.prototype = new oFF.XObject();
oFF.HttpFileFactory.prototype._ff_c = "HttpFileFactory";

oFF.HttpFileFactory.staticSetup = function()
{
	var httpFileFactory = oFF.HttpFileFactory.create();
	oFF.HttpClientFactory.setHttpClientFactoryForProtocol(oFF.ProtocolType.FILE, httpFileFactory);
	oFF.HttpClientFactory.setHttpClientFactoryForProtocol(oFF.ProtocolType.VFS, httpFileFactory);
};
oFF.HttpFileFactory.create = function()
{
	return new oFF.HttpFileFactory();
};
oFF.HttpFileFactory.prototype.newHttpClientInstance = function(session)
{
	return oFF.HttpFileClient.create(session);
};

oFF.HttpLocalLoopFactory = function() {};
oFF.HttpLocalLoopFactory.prototype = new oFF.XObject();
oFF.HttpLocalLoopFactory.prototype._ff_c = "HttpLocalLoopFactory";

oFF.HttpLocalLoopFactory.create = function(serverConfig)
{
	var newObj = new oFF.HttpLocalLoopFactory();
	newObj.m_serverConfig = serverConfig;
	return newObj;
};
oFF.HttpLocalLoopFactory.prototype.m_serverConfig = null;
oFF.HttpLocalLoopFactory.prototype.releaseObject = function()
{
	this.m_serverConfig = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.HttpLocalLoopFactory.prototype.newHttpClientInstance = function(session)
{
	return oFF.HttpLocalLoopClient.create(session, this.m_serverConfig);
};

oFF.DfDispatcher = function() {};
oFF.DfDispatcher.prototype = new oFF.XObject();
oFF.DfDispatcher.prototype._ff_c = "DfDispatcher";

oFF.DfDispatcher.prototype.registerInterval = function(intervalMilliseconds, listener, customIdentifier)
{
	return null;
};
oFF.DfDispatcher.prototype.unregisterInterval = function(handle) {};

oFF.XContent = function() {};
oFF.XContent.prototype = new oFF.XObject();
oFF.XContent.prototype._ff_c = "XContent";

oFF.XContent.createContent = function()
{
	return new oFF.XContent();
};
oFF.XContent.createJsonObjectContent = function(contentType, content)
{
	var xContent = new oFF.XContent();
	var element = oFF.XJson.extractJsonContent(content);
	xContent.setJsonObject(element);
	xContent.setContentType(contentType);
	return xContent;
};
oFF.XContent.createStringContent = function(contentType, content)
{
	var xContent = new oFF.XContent();
	xContent.setString(content);
	xContent.setContentType(contentType);
	return xContent;
};
oFF.XContent.createByteArrayContent = function(contentType, content)
{
	var xContent = new oFF.XContent();
	xContent.setByteArray(content);
	xContent.setContentType(contentType);
	return xContent;
};
oFF.XContent.copy = function(source, target)
{
	if (oFF.notNull(source))
	{
		if (source.isBinaryContentSet())
		{
			target.setByteArray(source.getByteArray());
		}
		if (source.isStringContentSet())
		{
			target.setString(source.getString());
		}
		if (source.isJsonContentSet())
		{
			target.setJsonObject(source.getJsonContent());
		}
		target.setContentType(source.getContentType());
	}
};
oFF.XContent.prototype.m_contentType = null;
oFF.XContent.prototype.m_binaryContent = null;
oFF.XContent.prototype.m_stringContent = null;
oFF.XContent.prototype.m_jsonContent = null;
oFF.XContent.prototype.releaseObject = function()
{
	this.m_jsonContent = oFF.XObjectExt.release(this.m_jsonContent);
	this.m_binaryContent = null;
	this.m_stringContent = null;
	this.m_contentType = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.XContent.prototype.getContentType = function()
{
	return this.m_contentType;
};
oFF.XContent.prototype.setContentType = function(contentType)
{
	this.m_contentType = contentType;
};
oFF.XContent.prototype.getByteArray = function()
{
	return this.m_binaryContent;
};
oFF.XContent.prototype.setByteArray = function(value)
{
	this.m_binaryContent = value;
	if (oFF.isNull(this.m_contentType))
	{
		this.m_contentType = oFF.ContentType.BINARY;
	}
};
oFF.XContent.prototype.isBinaryContentSet = function()
{
	return oFF.notNull(this.m_binaryContent);
};
oFF.XContent.prototype.getString = function()
{
	return this.getStringContentExt(true, -1);
};
oFF.XContent.prototype.getStringContentExt = function(enforceConversion, encoding)
{
	if (oFF.isNull(this.m_stringContent) && enforceConversion)
	{
		var binaryContent = this.getByteArray();
		if (oFF.notNull(binaryContent))
		{
			var internalEncoding = encoding;
			if (internalEncoding === -1)
			{
				internalEncoding = this.getInternalTextEncoding();
			}
			this.m_stringContent = oFF.XByteArray.convertToStringWithCharset(binaryContent, internalEncoding);
		}
		else
		{
			if (this.isJsonContentSet())
			{
				var jsonContent = this.getJsonContent();
				this.m_stringContent = oFF.PrUtils.serialize(jsonContent, true, false, 0);
			}
		}
	}
	return this.m_stringContent;
};
oFF.XContent.prototype.getInternalTextEncoding = function()
{
	return oFF.XCharset.UTF8;
};
oFF.XContent.prototype.setString = function(value)
{
	this.m_stringContent = value;
	if (oFF.isNull(this.m_contentType))
	{
		this.m_contentType = oFF.ContentType.TEXT_PLAIN;
	}
};
oFF.XContent.prototype.isStringContentSet = function()
{
	return oFF.notNull(this.m_stringContent);
};
oFF.XContent.prototype.getStringContentWithCharset = function(encoding)
{
	return this.getStringContentExt(true, encoding);
};
oFF.XContent.prototype.isJsonContentSet = function()
{
	return oFF.notNull(this.m_jsonContent);
};
oFF.XContent.prototype.setJsonObject = function(json)
{
	this.m_jsonContent = oFF.XJson.extractJsonContent(json);
	if (oFF.isNull(this.m_contentType))
	{
		this.m_contentType = oFF.ContentType.APPLICATION_JSON;
	}
};
oFF.XContent.prototype.getJsonContent = function()
{
	if (oFF.isNull(this.m_jsonContent))
	{
		var contentType = this.getContentType();
		var parser = null;
		if (this.isStringContentSet() || this.isBinaryContentSet())
		{
			if (oFF.notNull(contentType) && contentType.isTypeOf(oFF.ContentType.XML))
			{
				parser = oFF.XmlParserFactory.newInstance();
			}
			if (oFF.isNull(parser))
			{
				parser = oFF.JsonParserFactory.newInstance();
			}
		}
		if (oFF.notNull(parser))
		{
			if (this.isStringContentSet())
			{
				var stringContent = this.getStringContentExt(true, -1);
				if (oFF.XStringUtils.isNotNullAndNotEmpty(stringContent))
				{
					var rootElement = parser.parse(stringContent);
					if (parser.isValid())
					{
						this.m_jsonContent = rootElement;
					}
				}
			}
			else if (this.isBinaryContentSet())
			{
				var binaryContent = this.getByteArray();
				var rootElementJson = parser.parseByteArray(binaryContent);
				if (parser.isValid())
				{
					this.m_jsonContent = rootElementJson;
				}
			}
			oFF.XObjectExt.release(parser);
		}
	}
	return this.m_jsonContent;
};
oFF.XContent.prototype.hasElements = function()
{
	return this.isEmpty() === false;
};
oFF.XContent.prototype.isEmpty = function()
{
	return !this.isBinaryContentSet() && !this.isStringContentSet() && !this.isJsonContentSet();
};
oFF.XContent.prototype.setFromContent = function(content)
{
	oFF.XContent.copy(content, this);
};
oFF.XContent.prototype.toString = function()
{
	if (this.isJsonContentSet())
	{
		return this.getJsonContent().toString();
	}
	else if (this.isStringContentSet())
	{
		return this.getString();
	}
	else
	{
		return "[Binary content]";
	}
};

oFF.HttpCookies = function() {};
oFF.HttpCookies.prototype = new oFF.XObject();
oFF.HttpCookies.prototype._ff_c = "HttpCookies";

oFF.HttpCookies.create = function()
{
	var cookies = new oFF.HttpCookies();
	cookies.setup();
	return cookies;
};
oFF.HttpCookies.prototype.m_cookies = null;
oFF.HttpCookies.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_cookies = oFF.XHashMapByString.create();
};
oFF.HttpCookies.prototype.releaseObject = function()
{
	if (oFF.notNull(this.m_cookies))
	{
		var iterator = this.m_cookies.getIterator();
		while (iterator.hasNext())
		{
			var next = iterator.next();
			oFF.XCollectionUtils.releaseEntriesFromCollection(next);
			oFF.XObjectExt.release(next);
		}
		oFF.XObjectExt.release(iterator);
		oFF.XObjectExt.release(this.m_cookies);
		this.m_cookies = null;
	}
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.HttpCookies.prototype.isEmpty = function()
{
	if (oFF.isNull(this.m_cookies))
	{
		return true;
	}
	return this.m_cookies.isEmpty();
};
oFF.HttpCookies.prototype.hasElements = function()
{
	return !this.isEmpty();
};
oFF.HttpCookies.prototype.size = function()
{
	var count = 0;
	var iterator = this.m_cookies.getIterator();
	while (iterator.hasNext())
	{
		var cookieList = iterator.next();
		count = count + cookieList.size();
	}
	return count;
};
oFF.HttpCookies.prototype.clear = function()
{
	this.m_cookies.clear();
};
oFF.HttpCookies.prototype.getCookieNames = function()
{
	return this.m_cookies.getKeysAsReadOnlyListOfString();
};
oFF.HttpCookies.prototype.getCookieValueByName = function(name)
{
	var values = this.m_cookies.getByKey(name);
	if (oFF.XCollectionUtils.hasElements(values))
	{
		return values.get(0).getValue();
	}
	return null;
};
oFF.HttpCookies.prototype.getCookiesByName = function(name)
{
	return this.m_cookies.getByKey(name);
};
oFF.HttpCookies.prototype.add = function(name, value)
{
	var cookie = oFF.HttpCookie.createCookie(name, value);
	return this.addCookie(cookie);
};
oFF.HttpCookies.prototype.addByHttpServerResponseValue = function(httpHeaderValue)
{
	var cookie = oFF.HttpCookie.createByHttpServerResponseValue(httpHeaderValue);
	return this.addCookie(cookie);
};
oFF.HttpCookies.prototype.addByHttpClientRequestValue = function(httpHeaderValue)
{
	if (oFF.notNull(httpHeaderValue))
	{
		var start = 0;
		while (true)
		{
			var end = oFF.XString.indexOfFrom(httpHeaderValue, ";", start);
			var subValue = oFF.XString.substring(httpHeaderValue, start, end);
			var assignIndex = oFF.XString.indexOf(subValue, "=");
			var cookieName;
			var cookieValue;
			if (assignIndex === -1)
			{
				cookieName = subValue;
				cookieValue = "";
			}
			else
			{
				cookieName = oFF.XString.substring(subValue, 0, assignIndex);
				cookieValue = oFF.XString.substring(subValue, assignIndex + 1, -1);
			}
			cookieName = oFF.XString.trim(cookieName);
			cookieValue = oFF.XString.trim(cookieValue);
			var newCookie = oFF.HttpCookie.createCookie(cookieName, cookieValue);
			this.addCookie(newCookie);
			if (end === -1)
			{
				break;
			}
			start = end + 1;
		}
	}
};
oFF.HttpCookies.prototype.addCookie = function(cookie)
{
	var name = cookie.getName();
	var valueList = this.m_cookies.getByKey(name);
	if (oFF.isNull(valueList))
	{
		valueList = oFF.XList.create();
		this.m_cookies.put(name, valueList);
	}
	valueList.add(cookie);
	return cookie;
};
oFF.HttpCookies.prototype.merge = function(cookies)
{
	var cookieNames = cookies.getCookieNames();
	for (var i = 0; i < cookieNames.size(); i++)
	{
		var name = cookieNames.get(i);
		var valueList = this.m_cookies.getByKey(name);
		if (oFF.isNull(valueList))
		{
			valueList = oFF.XList.create();
			this.m_cookies.put(name, valueList);
		}
		else
		{
			valueList.clear();
		}
		var cookieValuesByName = cookies.getCookiesByName(name);
		for (var j = 0; j < cookieValuesByName.size(); j++)
		{
			valueList.add(cookieValuesByName.get(j));
		}
	}
};
oFF.HttpCookies.prototype.getCookies = function()
{
	var allCookies = oFF.XList.create();
	var cookieNames = this.getCookieNames();
	for (var i = 0; i < cookieNames.size(); i++)
	{
		var name = cookieNames.get(i);
		var valueList = this.m_cookies.getByKey(name);
		allCookies.addAll(valueList);
	}
	return allCookies;
};
oFF.HttpCookies.prototype.toString = function()
{
	var buffer = oFF.XStringBuffer.create();
	var cookieNames = this.getCookieNames();
	for (var i = 0; i < cookieNames.size(); i++)
	{
		if (i > 0)
		{
			buffer.append("\r\n");
		}
		var name = cookieNames.get(i);
		buffer.append(name);
		buffer.append("=");
		var valueList = this.m_cookies.getByKey(name);
		for (var j = 0; j < valueList.size(); j++)
		{
			if (j > 0)
			{
				buffer.append(";");
			}
			buffer.append(valueList.get(j).getValue());
		}
	}
	return buffer.toString();
};

oFF.HttpExchangeNopInterceptor = function() {};
oFF.HttpExchangeNopInterceptor.prototype = new oFF.XObjectExt();
oFF.HttpExchangeNopInterceptor.prototype._ff_c = "HttpExchangeNopInterceptor";

oFF.HttpExchangeNopInterceptor.prototype.handleRequest = function(request, processingHint) {};
oFF.HttpExchangeNopInterceptor.prototype.handleResponse = function(response) {};

oFF.HttpSamlClientFactory = function() {};
oFF.HttpSamlClientFactory.prototype = new oFF.HttpClientFactory();
oFF.HttpSamlClientFactory.prototype._ff_c = "HttpSamlClientFactory";

oFF.HttpSamlClientFactory.staticSetupSamlFactory = function()
{
	var factory = new oFF.HttpSamlClientFactory();
	var samlPwd = oFF.XUri.create();
	samlPwd.setProtocolType(oFF.ProtocolType.HTTPS);
	samlPwd.setAuthenticationType(oFF.AuthenticationType.SAML_WITH_PASSWORD);
	oFF.HttpClientFactory.setHttpClientFactoryForConnection(samlPwd, factory);
	var samlCert = oFF.XUri.create();
	samlCert.setProtocolType(oFF.ProtocolType.HTTPS);
	samlCert.setAuthenticationType(oFF.AuthenticationType.SAML_WITH_CERTIFICATE);
	oFF.HttpClientFactory.setHttpClientFactoryForConnection(samlCert, factory);
	var samlKerb = oFF.XUri.create();
	samlKerb.setProtocolType(oFF.ProtocolType.HTTPS);
	samlKerb.setAuthenticationType(oFF.AuthenticationType.SAML_WITH_KERBEROS);
	oFF.HttpClientFactory.setHttpClientFactoryForConnection(samlKerb, factory);
	var samlPwd1 = oFF.XUri.create();
	samlPwd1.setProtocolType(oFF.ProtocolType.HTTP);
	samlPwd1.setAuthenticationType(oFF.AuthenticationType.SAML_WITH_PASSWORD);
	oFF.HttpClientFactory.setHttpClientFactoryForConnection(samlPwd1, factory);
	var samlCert1 = oFF.XUri.create();
	samlCert1.setProtocolType(oFF.ProtocolType.HTTP);
	samlCert1.setAuthenticationType(oFF.AuthenticationType.SAML_WITH_CERTIFICATE);
	oFF.HttpClientFactory.setHttpClientFactoryForConnection(samlCert1, factory);
	var samlKerb1 = oFF.XUri.create();
	samlKerb1.setProtocolType(oFF.ProtocolType.HTTP);
	samlKerb1.setAuthenticationType(oFF.AuthenticationType.SAML_WITH_KERBEROS);
	oFF.HttpClientFactory.setHttpClientFactoryForConnection(samlKerb1, factory);
};
oFF.HttpSamlClientFactory.prototype.newHttpClientInstance = function(session)
{
	return oFF.HttpSamlClient.create(session);
};

oFF.ProxySettings = function() {};
oFF.ProxySettings.prototype = new oFF.XObject();
oFF.ProxySettings.prototype._ff_c = "ProxySettings";

oFF.ProxySettings.create = function(parent)
{
	var newObj = new oFF.ProxySettings();
	newObj.setupExt(parent);
	return newObj;
};
oFF.ProxySettings.prototype.m_parent = null;
oFF.ProxySettings.prototype.m_webdispatcherTemplate = null;
oFF.ProxySettings.prototype.m_proxyHost = null;
oFF.ProxySettings.prototype.m_proxyPort = 0;
oFF.ProxySettings.prototype.m_authorization = null;
oFF.ProxySettings.prototype.m_sccLocationId = null;
oFF.ProxySettings.prototype.m_excludeList = null;
oFF.ProxySettings.prototype.m_type = null;
oFF.ProxySettings.prototype.m_header = null;
oFF.ProxySettings.prototype.setupExt = function(parent)
{
	this.m_parent = parent;
	this.m_type = oFF.ProxyType.DEFAULT;
	this.m_excludeList = oFF.XListOfString.create();
	this.m_header = oFF.XSetOfNameObject.create();
};
oFF.ProxySettings.prototype.loadFromEnvironment = function(environment)
{
	this.setProxyType(oFF.ProxyType.NONE);
	var webdispatcherTemplate = environment.getStringByKey(oFF.XEnvironmentConstants.FF_DISPATCHER_TEMPLATE);
	if (oFF.XStringUtils.isNullOrEmpty(webdispatcherTemplate))
	{
		webdispatcherTemplate = environment.getStringByKey(oFF.XEnvironmentConstants.HTTP_DISPATCHER_URI);
	}
	if (oFF.XStringUtils.isNotNullAndNotEmpty(webdispatcherTemplate))
	{
		this.setWebdispatcherTemplate(webdispatcherTemplate);
		this.setProxyType(oFF.ProxyType.WEBDISPATCHER);
	}
	var proxyHost = environment.getVariable(oFF.XEnvironmentConstants.HTTP_PROXY_HOST);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(proxyHost))
	{
		this.setProxyType(oFF.ProxyType.PROXY);
		this.setProxyHost(proxyHost);
		var proxyPort = environment.getVariable(oFF.XEnvironmentConstants.HTTP_PROXY_PORT);
		if (oFF.isNull(proxyPort))
		{
			this.setProxyPort(80);
		}
		else
		{
			try
			{
				this.setProxyPort(oFF.XInteger.convertFromString(proxyPort));
			}
			catch (e)
			{
				this.setProxyType(oFF.ProxyType.NONE);
				this.setProxyHost(null);
				this.setProxyPort(0);
			}
		}
	}
	var enableFiddler = environment.getBooleanByKeyExt(oFF.XEnvironmentConstants.ENABLE_FIDDLER, false);
	if (enableFiddler)
	{
		this.setProxyHost(oFF.XEnvironmentConstants.FIDDLER_HOST);
		this.setProxyPort(oFF.XInteger.convertFromString(oFF.XEnvironmentConstants.FIDDLER_PORT));
		this.setProxyType(oFF.ProxyType.PROXY);
	}
};
oFF.ProxySettings.prototype.getWebdispatcherTemplate = function()
{
	if (this.m_type === oFF.ProxyType.DEFAULT && oFF.notNull(this.m_parent))
	{
		return this.m_parent.getWebdispatcherTemplate();
	}
	return this.m_webdispatcherTemplate;
};
oFF.ProxySettings.prototype.setWebdispatcherTemplate = function(template)
{
	this.m_webdispatcherTemplate = template;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(template))
	{
		this.setProxyType(oFF.ProxyType.WEBDISPATCHER);
	}
};
oFF.ProxySettings.prototype.getProxyHost = function()
{
	if (this.m_type === oFF.ProxyType.DEFAULT && oFF.notNull(this.m_parent))
	{
		return this.m_parent.getProxyHost();
	}
	return this.m_proxyHost;
};
oFF.ProxySettings.prototype.setProxyHost = function(host)
{
	this.m_proxyHost = host;
	if (oFF.XStringUtils.isNotNullAndNotEmpty(host))
	{
		this.setProxyType(oFF.ProxyType.PROXY);
	}
};
oFF.ProxySettings.prototype.getProxyPort = function()
{
	if (this.m_type === oFF.ProxyType.DEFAULT && oFF.notNull(this.m_parent))
	{
		return this.m_parent.getProxyPort();
	}
	return this.m_proxyPort;
};
oFF.ProxySettings.prototype.setProxyPort = function(port)
{
	this.m_proxyPort = port;
};
oFF.ProxySettings.prototype.getProxyAuthorization = function()
{
	if (this.m_type === oFF.ProxyType.DEFAULT && oFF.notNull(this.m_parent))
	{
		return this.m_parent.getProxyAuthorization();
	}
	return this.m_authorization;
};
oFF.ProxySettings.prototype.setProxyAuthorization = function(authorization)
{
	this.m_authorization = authorization;
};
oFF.ProxySettings.prototype.getSccLocationId = function()
{
	if (this.m_type === oFF.ProxyType.DEFAULT && oFF.notNull(this.m_parent))
	{
		return this.m_parent.getSccLocationId();
	}
	return this.m_sccLocationId;
};
oFF.ProxySettings.prototype.setSccLocationId = function(sccLocationId)
{
	this.m_sccLocationId = sccLocationId;
};
oFF.ProxySettings.prototype.getProxyExcludes = function()
{
	return this.m_excludeList;
};
oFF.ProxySettings.prototype.getProxyExcludesBase = function()
{
	return this.m_excludeList;
};
oFF.ProxySettings.prototype.getProxyType = function()
{
	if (this.m_type === oFF.ProxyType.DEFAULT && oFF.notNull(this.m_parent))
	{
		return this.m_parent.getProxyType();
	}
	return this.m_type;
};
oFF.ProxySettings.prototype.setProxyType = function(type)
{
	this.m_type = type;
};
oFF.ProxySettings.prototype.isProxyApplicable = function(connection)
{
	if (this.m_type === oFF.ProxyType.DEFAULT && oFF.notNull(this.m_parent))
	{
		return this.m_parent.isProxyApplicable(connection);
	}
	if (this.m_type === oFF.ProxyType.DEFAULT)
	{
		return false;
	}
	var host = connection.getHost();
	for (var i = 0; i < this.m_excludeList.size(); i++)
	{
		var excludeLine = this.m_excludeList.get(i);
		if (oFF.XStringUtils.isWildcardPatternMatching(host, excludeLine))
		{
			return false;
		}
	}
	return true;
};
oFF.ProxySettings.prototype.getProxyHttpHeaders = function()
{
	return this.m_header.getValuesAsReadOnlyList();
};
oFF.ProxySettings.prototype.setProxyHttpHeader = function(name, value)
{
	this.m_header.add(oFF.XNameValuePair.create(name, value));
};

oFF.DfSqlResultSet = function() {};
oFF.DfSqlResultSet.prototype = new oFF.XObjectExt();
oFF.DfSqlResultSet.prototype._ff_c = "DfSqlResultSet";

oFF.DfSqlResultSet.prototype.getSummary = function()
{
	var buffer = oFF.XStringBuffer.create();
	var metaData = this.getMetaData();
	var columnCount = metaData.size();
	if (columnCount > 0)
	{
		while (this.next())
		{
			for (var k = 0; k < columnCount; k++)
			{
				if (k > 0)
				{
					buffer.append(" | ");
				}
				var name = metaData.get(k);
				buffer.append(this.getStringByKey(name));
			}
			buffer.appendNewLine();
		}
	}
	return buffer.toString();
};

oFF.DispatcherSingleThread = function() {};
oFF.DispatcherSingleThread.prototype = new oFF.DfDispatcher();
oFF.DispatcherSingleThread.prototype._ff_c = "DispatcherSingleThread";

oFF.DispatcherSingleThread.create = function()
{
	var object = new oFF.DispatcherSingleThread();
	object.setup();
	return object;
};
oFF.DispatcherSingleThread.prototype.m_procTimeReceiverList = null;
oFF.DispatcherSingleThread.prototype.m_timeoutItems = null;
oFF.DispatcherSingleThread.prototype.m_syncLock = false;
oFF.DispatcherSingleThread.prototype.m_countDown = 0;
oFF.DispatcherSingleThread.prototype.setup = function()
{
	oFF.DfDispatcher.prototype.setup.call( this );
	this.m_procTimeReceiverList = oFF.XList.create();
	this.m_timeoutItems = oFF.XList.create();
	this.m_countDown = -1;
};
oFF.DispatcherSingleThread.prototype.releaseObject = function()
{
	this.m_procTimeReceiverList = null;
	this.m_timeoutItems = null;
};
oFF.DispatcherSingleThread.prototype.process = function()
{
	var needsMoreProcessing = true;
	var isEnabled = true;
	while (needsMoreProcessing && isEnabled)
	{
		if (this.m_countDown !== -1)
		{
			if (this.m_countDown === 0)
			{
				isEnabled = false;
			}
			else
			{
				this.m_countDown--;
			}
		}
		if (this.m_syncLock)
		{
			throw oFF.XException.createIllegalStateException("Sync lock");
		}
		needsMoreProcessing = false;
		this.m_syncLock = true;
		var current;
		var i = 0;
		while (i < this.m_procTimeReceiverList.size())
		{
			current = this.m_procTimeReceiverList.get(i);
			current.processSynchronization(oFF.SyncType.NON_BLOCKING);
			if (current.getSyncState().isNotInSync())
			{
				needsMoreProcessing = true;
				i++;
			}
			else
			{
				this.m_procTimeReceiverList.removeAt(i);
			}
		}
		var currentTimeoutItem;
		var now = oFF.XSystemUtils.getCurrentTimeInMilliseconds();
		for (i = this.m_timeoutItems.size() - 1; i >= 0; i--)
		{
			if (this.m_timeoutItems.size() > i)
			{
				currentTimeoutItem = this.m_timeoutItems.get(i);
				if (currentTimeoutItem.isMatching(now))
				{
					currentTimeoutItem.execute();
					if (currentTimeoutItem.isInterval() === true)
					{
						currentTimeoutItem.setTargetPointInTime();
					}
					else
					{
						this.m_timeoutItems.removeElement(currentTimeoutItem);
					}
				}
			}
		}
		if (this.m_timeoutItems.size() > 0)
		{
			needsMoreProcessing = true;
		}
		this.m_syncLock = false;
	}
};
oFF.DispatcherSingleThread.prototype.registerProcessingTimeReceiver = function(processingTimeReceiver)
{
	if (!this.m_procTimeReceiverList.contains(processingTimeReceiver))
	{
		this.m_procTimeReceiverList.add(processingTimeReceiver);
	}
};
oFF.DispatcherSingleThread.prototype.unregisterProcessingTimeReceiver = function(processingTimeReceiver)
{
	if (oFF.notNull(this.m_procTimeReceiverList))
	{
		this.m_procTimeReceiverList.removeElement(processingTimeReceiver);
	}
};
oFF.DispatcherSingleThread.prototype.getSyncState = function()
{
	var state = oFF.SyncState.IN_SYNC;
	var current;
	var currentState;
	for (var i = 0; i < this.m_procTimeReceiverList.size(); i++)
	{
		current = this.m_procTimeReceiverList.get(i);
		currentState = current.getSyncState();
		if (currentState.getLevel() < state.getLevel())
		{
			state = currentState;
		}
	}
	return state;
};
oFF.DispatcherSingleThread.prototype.getProcessingTimeReceiverCount = function()
{
	return this.m_procTimeReceiverList.size();
};
oFF.DispatcherSingleThread.prototype.registerTimer = function(delayMilliseconds, listener, customIdentifier)
{
	var timeout = oFF.TimerItem.create(delayMilliseconds, listener, customIdentifier);
	this.m_timeoutItems.add(timeout);
	return timeout;
};
oFF.DispatcherSingleThread.prototype.unregisterTimer = function(handle)
{
	this.m_timeoutItems.removeElement(handle);
};
oFF.DispatcherSingleThread.prototype.shutdown = function()
{
	if (this.m_countDown === -1)
	{
		this.m_countDown = 1000;
	}
};
oFF.DispatcherSingleThread.prototype.registerInterval = function(intervalMilliseconds, listener, customIdentifier)
{
	var timeout = oFF.TimerItem.createInterval(intervalMilliseconds, listener, customIdentifier);
	this.m_timeoutItems.add(timeout);
	return timeout;
};
oFF.DispatcherSingleThread.prototype.unregisterInterval = function(handle)
{
	this.m_timeoutItems.removeElement(handle);
};

oFF.DfSessionContext = function() {};
oFF.DfSessionContext.prototype = new oFF.XObjectExt();
oFF.DfSessionContext.prototype._ff_c = "DfSessionContext";

oFF.DfSessionContext.prototype.m_session = null;
oFF.DfSessionContext.prototype.setupSessionContext = function(session)
{
	oFF.XObjectExt.prototype.setup.call( this );
	this.setSession(session);
};
oFF.DfSessionContext.prototype.releaseObject = function()
{
	this.m_session = null;
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.DfSessionContext.prototype.getSession = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_session);
};
oFF.DfSessionContext.prototype.setSession = function(session)
{
	this.m_session = oFF.XWeakReferenceUtil.getWeakRef(session);
};
oFF.DfSessionContext.prototype.getLogWriter = function()
{
	var session = this.getSession();
	return oFF.isNull(session) ? null : session.getLogWriter();
};
oFF.DfSessionContext.prototype.getStdout = function()
{
	var session = this.getSession();
	return oFF.isNull(session) ? null : session.getStdout();
};
oFF.DfSessionContext.prototype.getStdin = function()
{
	var session = this.getSession();
	return oFF.isNull(session) ? null : session.getStdin();
};
oFF.DfSessionContext.prototype.getStdlog = function()
{
	var session = this.getSession();
	return oFF.isNull(session) ? null : session.getStdlog();
};
oFF.DfSessionContext.prototype.getEnvironment = function()
{
	return this.getSession().getEnvironment();
};

oFF.MessageManager = function() {};
oFF.MessageManager.prototype = new oFF.MessageManagerSimple();
oFF.MessageManager.prototype._ff_c = "MessageManager";

oFF.MessageManager.createMessageManagerExt = function(session)
{
	var object = new oFF.MessageManager();
	object.setupSessionContext(session);
	return object;
};
oFF.MessageManager.prototype.m_session = null;
oFF.MessageManager.prototype.setupSessionContext = function(session)
{
	oFF.MessageManagerSimple.prototype.setup.call( this );
	this.setSession(session);
};
oFF.MessageManager.prototype.releaseObject = function()
{
	this.m_session = null;
	oFF.MessageManagerSimple.prototype.releaseObject.call( this );
};
oFF.MessageManager.prototype.getLogWriter = function()
{
	var logger = null;
	var session = this.getSession();
	if (oFF.notNull(session))
	{
		logger = session.getLogWriter();
	}
	return logger;
};
oFF.MessageManager.prototype.getSession = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_session);
};
oFF.MessageManager.prototype.setSession = function(session)
{
	this.m_session = oFF.XWeakReferenceUtil.getWeakRef(session);
};
oFF.MessageManager.prototype.getStdout = function()
{
	var session = this.getSession();
	return oFF.isNull(session) ? null : session.getStdout();
};
oFF.MessageManager.prototype.getStdin = function()
{
	var session = this.getSession();
	return oFF.isNull(session) ? null : session.getStdin();
};
oFF.MessageManager.prototype.getStdlog = function()
{
	var session = this.getSession();
	return oFF.isNull(session) ? null : session.getStdlog();
};
oFF.MessageManager.prototype.getEnvironment = function()
{
	return this.getSession().getEnvironment();
};

oFF.SyncActionExtRes = function() {};
oFF.SyncActionExtRes.prototype = new oFF.ExtResult();
oFF.SyncActionExtRes.prototype._ff_c = "SyncActionExtRes";

oFF.SyncActionExtRes.createSyncAction = function(data, messages)
{
	var syncAction = new oFF.SyncActionExtRes();
	syncAction.setupExt(data, messages, false);
	return syncAction;
};
oFF.SyncActionExtRes.prototype.isSyncCanceled = function()
{
	return false;
};
oFF.SyncActionExtRes.prototype.cancelSynchronization = oFF.noSupport;
oFF.SyncActionExtRes.prototype.abort = oFF.noSupport;
oFF.SyncActionExtRes.prototype.getSyncState = function()
{
	return oFF.SyncState.IN_SYNC;
};
oFF.SyncActionExtRes.prototype.addInfoExt = oFF.noSupport;
oFF.SyncActionExtRes.prototype.addWarningExt = oFF.noSupport;
oFF.SyncActionExtRes.prototype.addErrorExt = oFF.noSupport;
oFF.SyncActionExtRes.prototype.addSemanticalError = oFF.noSupport;
oFF.SyncActionExtRes.prototype.addInfo = oFF.noSupport;
oFF.SyncActionExtRes.prototype.addWarning = oFF.noSupport;
oFF.SyncActionExtRes.prototype.addError = oFF.noSupport;
oFF.SyncActionExtRes.prototype.addMessage = oFF.noSupport;
oFF.SyncActionExtRes.prototype.addAllMessages = oFF.noSupport;
oFF.SyncActionExtRes.prototype.copyAllMessages = oFF.noSupport;
oFF.SyncActionExtRes.prototype.clearMessages = oFF.noSupport;
oFF.SyncActionExtRes.prototype.setClientStatusCode = oFF.noSupport;
oFF.SyncActionExtRes.prototype.setServerStatusCode = oFF.noSupport;
oFF.SyncActionExtRes.prototype.setServerStatusDetails = oFF.noSupport;
oFF.SyncActionExtRes.prototype.addProfileStep = oFF.noSupport;
oFF.SyncActionExtRes.prototype.addProfileNode = oFF.noSupport;
oFF.SyncActionExtRes.prototype.detailProfileNode = oFF.noSupport;
oFF.SyncActionExtRes.prototype.endProfileStep = oFF.noSupport;
oFF.SyncActionExtRes.prototype.renameLastProfileStep = oFF.noSupport;
oFF.SyncActionExtRes.prototype.hasProfileParent = oFF.noSupport;
oFF.SyncActionExtRes.prototype.getDuration = oFF.noSupport;
oFF.SyncActionExtRes.prototype.getProfilingStart = oFF.noSupport;
oFF.SyncActionExtRes.prototype.getProfilingEnd = oFF.noSupport;
oFF.SyncActionExtRes.prototype.getProfileSteps = oFF.noSupport;
oFF.SyncActionExtRes.prototype.getProfileNodeText = oFF.noSupport;
oFF.SyncActionExtRes.prototype.process = oFF.noSupport;
oFF.SyncActionExtRes.prototype.getActiveSyncType = oFF.noSupport;
oFF.SyncActionExtRes.prototype.setActiveSyncType = oFF.noSupport;
oFF.SyncActionExtRes.prototype.attachListener = oFF.noSupport;
oFF.SyncActionExtRes.prototype.detachListener = oFF.noSupport;
oFF.SyncActionExtRes.prototype.thenDo = oFF.noSupport;

oFF.DfXCacheProvider = function() {};
oFF.DfXCacheProvider.prototype = new oFF.DfSessionContext();
oFF.DfXCacheProvider.prototype._ff_c = "DfXCacheProvider";

oFF.DfXCacheProvider.prototype.m_hitCounter = null;
oFF.DfXCacheProvider.prototype.m_missedHitCounter = null;
oFF.DfXCacheProvider.prototype.m_writeCounter = null;
oFF.DfXCacheProvider.prototype.s_writeCounter = 0;
oFF.DfXCacheProvider.prototype.s_readCounter = 0;
oFF.DfXCacheProvider.prototype.setupSessionContext = function(session)
{
	oFF.DfSessionContext.prototype.setupSessionContext.call( this , session);
	this.m_hitCounter = oFF.XHashMapByString.create();
	this.m_missedHitCounter = oFF.XHashMapByString.create();
	this.m_writeCounter = oFF.XHashMapByString.create();
};
oFF.DfXCacheProvider.prototype.getLogLayer = function()
{
	return oFF.OriginLayer.IOLAYER;
};
oFF.DfXCacheProvider.prototype.readElementFromCache = function(namespace, name, validityTime)
{
	var element = null;
	var value = this.readStringFromCache(namespace, name, validityTime);
	if (oFF.notNull(value))
	{
		try
		{
			element = oFF.JsonParserFactory.createFromString(value);
		}
		catch (e)
		{
			element = null;
		}
	}
	return element;
};
oFF.DfXCacheProvider.prototype.readStringFromCache = function(namespace, name, validityTime)
{
	var key = this.generateKey(namespace, name);
	var value = this.getStringByKey(key);
	if (oFF.notNull(value))
	{
		this.incHit(namespace);
		this.logMulti("#").appendInt(this.s_readCounter++).append(": readString HIT ").append(key).flush();
	}
	else
	{
		this.logMulti("#").appendInt(this.s_readCounter++).append(": readString NO_HIT ").append(key).flush();
	}
	return value;
};
oFF.DfXCacheProvider.prototype.getStringByKeyExt = oFF.noSupport;
oFF.DfXCacheProvider.prototype.getStringByKey = function(name)
{
	return null;
};
oFF.DfXCacheProvider.prototype.writeElementToCache = function(namespace, name, element, maxCount)
{
	var value = oFF.PrUtils.serialize(element, false, false, 0);
	this.writeStringToCache(namespace, name, value, maxCount);
};
oFF.DfXCacheProvider.prototype.writeStringToCache = function(namespace, name, stringValue, maxCount)
{
	var key = this.generateKey(namespace, name);
	this.logMulti("#").appendInt(this.s_writeCounter).append(": putString ").append(name).flush();
	this.s_writeCounter++;
	this.putString(key, stringValue);
};
oFF.DfXCacheProvider.prototype.putStringNotNull = oFF.noSupport;
oFF.DfXCacheProvider.prototype.putStringNotNullAndNotEmpty = oFF.noSupport;
oFF.DfXCacheProvider.prototype.putString = function(name, stringValue) {};
oFF.DfXCacheProvider.prototype.removeElementFromCache = function(namespace, name)
{
	var key = this.generateKey(namespace, name);
	this.removeElementFromCacheInternal(key);
};
oFF.DfXCacheProvider.prototype.removeElementFromCacheInternal = function(name) {};
oFF.DfXCacheProvider.prototype.clearCache = function(namespace)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(namespace))
	{
		this.clearCacheInternal(namespace);
	}
};
oFF.DfXCacheProvider.prototype.clearCacheInternal = function(namespace) {};
oFF.DfXCacheProvider.prototype.getPrefix = function()
{
	return null;
};
oFF.DfXCacheProvider.prototype.getSubCache = function(namespace)
{
	var cache = oFF.XCache.create(this, namespace);
	return cache;
};
oFF.DfXCacheProvider.prototype.cacheSize = function(namespace)
{
	return 0;
};
oFF.DfXCacheProvider.prototype.cacheHasElements = function(namespace)
{
	return false;
};
oFF.DfXCacheProvider.prototype.getSubNamespace = function(parentNamespace, childNamespace)
{
	var targetChildName = oFF.XString.replace(childNamespace, ":", "~");
	var delimiter = this.getDelimiter();
	return oFF.XStringUtils.concatenate3(parentNamespace, delimiter, targetChildName);
};
oFF.DfXCacheProvider.prototype.getCacheHitCount = function(namespace)
{
	var value = 0;
	var integerValue = this.m_hitCounter.getByKey(namespace);
	if (oFF.notNull(integerValue))
	{
		value = integerValue.getInteger();
	}
	return value;
};
oFF.DfXCacheProvider.prototype.getCacheMissedHitCount = function(namespace)
{
	var value = 0;
	var integerValue = this.m_missedHitCounter.getByKey(namespace);
	if (oFF.notNull(integerValue))
	{
		value = integerValue.getInteger();
	}
	return value;
};
oFF.DfXCacheProvider.prototype.getCacheWriteCount = function(namespace)
{
	var value = 0;
	var integerValue = this.m_writeCounter.getByKey(namespace);
	if (oFF.notNull(integerValue))
	{
		value = integerValue.getInteger();
	}
	return value;
};
oFF.DfXCacheProvider.prototype.incHit = function(namespace)
{
	var integerValue = this.m_hitCounter.getByKey(namespace);
	if (oFF.isNull(integerValue))
	{
		integerValue = oFF.XIntegerValue.create(0);
		this.m_hitCounter.put(namespace, integerValue);
	}
	integerValue.setInteger(integerValue.getInteger() + 1);
};
oFF.DfXCacheProvider.prototype.incMissedHit = function(namespace)
{
	var integerValue = this.m_missedHitCounter.getByKey(namespace);
	if (oFF.isNull(integerValue))
	{
		integerValue = oFF.XIntegerValue.create(0);
		this.m_missedHitCounter.put(namespace, integerValue);
	}
	integerValue.setInteger(integerValue.getInteger() + 1);
};
oFF.DfXCacheProvider.prototype.incWriteHit = function(namespace)
{
	var integerValue = this.m_writeCounter.getByKey(namespace);
	if (oFF.isNull(integerValue))
	{
		integerValue = oFF.XIntegerValue.create(0);
		this.m_writeCounter.put(namespace, integerValue);
	}
	integerValue.setInteger(integerValue.getInteger() + 1);
};
oFF.DfXCacheProvider.prototype.generateKey = function(namespace, name)
{
	var key = name;
	var prefix = this.getPrefix();
	var delimiter = this.getDelimiter();
	if (oFF.notNull(prefix) || oFF.notNull(namespace))
	{
		var buffer = oFF.XStringBuffer.create();
		if (oFF.notNull(prefix))
		{
			buffer.append(prefix).append(delimiter);
		}
		if (oFF.notNull(namespace))
		{
			buffer.append(namespace).append(delimiter);
		}
		buffer.append(name);
		key = buffer.toString();
	}
	return key;
};
oFF.DfXCacheProvider.prototype.getDelimiter = function()
{
	return ".";
};
oFF.DfXCacheProvider.prototype.processOpen = function(syncType, listener, customIdentifier, properties)
{
	return oFF.XCacheProviderOpenAction.createAndRun(syncType, listener, customIdentifier, this, properties);
};
oFF.DfXCacheProvider.prototype.processWrite = function(syncType, listener, customIdentifier, namespace, name, content, maxCount)
{
	return oFF.XCacheProviderWriteAction.createAndRun(syncType, listener, customIdentifier, this, namespace, name, content, maxCount);
};
oFF.DfXCacheProvider.prototype.processRead = function(syncType, listener, customIdentifier, namespace, name, validityTime)
{
	return oFF.XCacheProviderReadAction.createAndRun(syncType, listener, customIdentifier, this, namespace, name, validityTime);
};
oFF.DfXCacheProvider.prototype.supportsNameSpaceEnumeration = function()
{
	return false;
};
oFF.DfXCacheProvider.prototype.getNameSpaces = function()
{
	return null;
};

oFF.XCache = function() {};
oFF.XCache.prototype = new oFF.XObjectExt();
oFF.XCache.prototype._ff_c = "XCache";

oFF.XCache.create = function(cacheProvider, namespace)
{
	var newObj = new oFF.XCache();
	newObj.setupExt(cacheProvider, namespace);
	return newObj;
};
oFF.XCache.prototype.m_cacheProvider = null;
oFF.XCache.prototype.m_namespace = null;
oFF.XCache.prototype.m_isEnabled = false;
oFF.XCache.prototype.m_isReadEnabled = false;
oFF.XCache.prototype.m_isWriteEnabled = false;
oFF.XCache.prototype.m_maxCount = 0;
oFF.XCache.prototype.m_validityTime = 0;
oFF.XCache.prototype.m_children = null;
oFF.XCache.prototype.setupExt = function(cacheProvider, namespace)
{
	this.m_cacheProvider = cacheProvider;
	this.m_namespace = namespace;
	this.m_isEnabled = false;
	this.m_isReadEnabled = true;
	this.m_isWriteEnabled = true;
	this.m_maxCount = -1;
	this.m_validityTime = -1;
	this.m_children = oFF.XHashMapByString.create();
};
oFF.XCache.prototype.releaseObject = function()
{
	this.m_children = null;
	this.m_cacheProvider = null;
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.XCache.prototype.clear = function()
{
	this.m_cacheProvider.clearCache(this.m_namespace);
};
oFF.XCache.prototype.size = function()
{
	return this.m_cacheProvider.cacheSize(this.m_namespace);
};
oFF.XCache.prototype.isEmpty = function()
{
	return !this.hasElements();
};
oFF.XCache.prototype.hasElements = function()
{
	return this.m_cacheProvider.cacheHasElements(this.m_namespace);
};
oFF.XCache.prototype.getHitCount = function()
{
	return this.m_cacheProvider.getCacheHitCount(this.m_namespace);
};
oFF.XCache.prototype.getMissedHitCount = function()
{
	return this.m_cacheProvider.getCacheMissedHitCount(this.m_namespace);
};
oFF.XCache.prototype.getWriteCount = function()
{
	return this.m_cacheProvider.getCacheWriteCount(this.m_namespace);
};
oFF.XCache.prototype.putStringNotNull = function(name, stringValue)
{
	if (oFF.notNull(stringValue))
	{
		this.putString(name, stringValue);
	}
};
oFF.XCache.prototype.putStringNotNullAndNotEmpty = function(name, stringValue)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(stringValue))
	{
		this.putString(name, stringValue);
	}
};
oFF.XCache.prototype.putString = function(name, stringValue)
{
	if (this.m_isEnabled)
	{
		this.m_cacheProvider.writeStringToCache(this.m_namespace, name, stringValue, this.m_maxCount);
	}
};
oFF.XCache.prototype.getStringByKeyExt = function(name, defaultValue)
{
	var output = this.getStringByKey(name);
	if (oFF.isNull(output))
	{
		output = defaultValue;
	}
	return output;
};
oFF.XCache.prototype.getStringByKey = function(name)
{
	var output = null;
	if (this.m_isEnabled)
	{
		this.m_cacheProvider.readStringFromCache(this.m_namespace, name, this.m_validityTime);
	}
	return output;
};
oFF.XCache.prototype.put = function(key, element, debugHint)
{
	if (this.m_isEnabled)
	{
		this.m_cacheProvider.writeElementToCache(this.m_namespace, key, element, this.m_maxCount);
	}
};
oFF.XCache.prototype.getByKey = function(key)
{
	var elements = null;
	if (this.m_isEnabled)
	{
		elements = this.m_cacheProvider.readElementFromCache(this.m_namespace, key, this.m_validityTime);
	}
	return elements;
};
oFF.XCache.prototype.processWrite = function(syncType, listener, customIdentifier, name, content)
{
	var action = null;
	if (this.m_isEnabled)
	{
		action = this.m_cacheProvider.processWrite(syncType, listener, customIdentifier, this.m_namespace, name, content, this.m_maxCount);
	}
	return action;
};
oFF.XCache.prototype.processRead = function(syncType, listener, customIdentifier, name)
{
	var action = null;
	if (this.m_isEnabled)
	{
		action = this.m_cacheProvider.processRead(syncType, listener, customIdentifier, this.m_namespace, name, this.m_validityTime);
	}
	return action;
};
oFF.XCache.prototype.isEnabled = function()
{
	return this.m_isEnabled;
};
oFF.XCache.prototype.setEnabled = function(isEnabled)
{
	this.m_isEnabled = isEnabled;
};
oFF.XCache.prototype.isWriteEnabled = function()
{
	return this.m_isWriteEnabled;
};
oFF.XCache.prototype.setIsWriteEnabled = function(isWriteEnabled)
{
	this.m_isWriteEnabled = isWriteEnabled;
};
oFF.XCache.prototype.isReadEnabled = function()
{
	return this.m_isReadEnabled;
};
oFF.XCache.prototype.setIsReadEnabled = function(isReadEnabled)
{
	this.m_isReadEnabled = isReadEnabled;
};
oFF.XCache.prototype.setValidityTime = function(validityTime)
{
	this.m_validityTime = validityTime;
};
oFF.XCache.prototype.getValidityTime = function()
{
	return this.m_validityTime;
};
oFF.XCache.prototype.setMaxCount = function(maxCount)
{
	this.m_maxCount = maxCount;
};
oFF.XCache.prototype.getMaxCount = function()
{
	return this.m_maxCount;
};
oFF.XCache.prototype.getSubCache = function(namespace)
{
	var cache = this.m_children.getByKey(namespace);
	if (oFF.isNull(cache))
	{
		var subNamespace = this.m_cacheProvider.getSubNamespace(this.m_namespace, namespace);
		cache = oFF.XCache.create(this.m_cacheProvider, subNamespace);
		cache.setEnabled(this.m_isEnabled);
		cache.setMaxCount(this.m_maxCount);
		cache.setValidityTime(this.m_validityTime);
		cache.setIsReadEnabled(this.m_isReadEnabled);
		cache.setIsWriteEnabled(this.m_isWriteEnabled);
		this.m_children.put(namespace, cache);
	}
	return cache;
};
oFF.XCache.prototype.supportsNameSpaceEnumeration = function()
{
	return true;
};
oFF.XCache.prototype.getNameSpaces = function()
{
	return this.m_children.getKeysAsReadOnlyListOfString();
};

oFF.DfXFileSystemGeneric = function() {};
oFF.DfXFileSystemGeneric.prototype = new oFF.DfSessionContext();
oFF.DfXFileSystemGeneric.prototype._ff_c = "DfXFileSystemGeneric";

oFF.DfXFileSystemGeneric.prototype.setupSessionContext = function(session)
{
	oFF.DfSessionContext.prototype.setupSessionContext.call( this , session);
};
oFF.DfXFileSystemGeneric.prototype.getFileSystemType = function()
{
	return oFF.XFileSystemType.OS;
};
oFF.DfXFileSystemGeneric.prototype.getRootDirectory = function()
{
	var rootDirectoryUri = this.getRootDirectoryUri();
	return oFF.XFile.createByUri(this.getSession(), rootDirectoryUri);
};
oFF.DfXFileSystemGeneric.prototype.getRootDirectoryUri = function()
{
	var uri = oFF.XUri.create();
	uri.setProtocolType(this.getFileSystemType().getProtocolType());
	uri.setPath("/");
	return uri;
};
oFF.DfXFileSystemGeneric.prototype.getNativeSlash = function()
{
	return "/";
};
oFF.DfXFileSystemGeneric.prototype.getNativeCurrentWorkingPath = function()
{
	return "/";
};
oFF.DfXFileSystemGeneric.prototype.getCurrentWorkingDirectory = function()
{
	var uri = null;
	var userDirectory = this.getNativeCurrentWorkingPath();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(userDirectory))
	{
		var scheme = this.getFileSystemType().getProtocolType().getName();
		uri = oFF.XUri.createFromSchemeAndNativePath(scheme, userDirectory);
	}
	return uri;
};

oFF.XFileContent = function() {};
oFF.XFileContent.prototype = new oFF.XContent();
oFF.XFileContent.prototype._ff_c = "XFileContent";

oFF.XFileContent.createFileContent = function()
{
	return new oFF.XFileContent();
};
oFF.XFileContent.createFileContentWithError = function(errorMessage)
{
	var fileContent = new oFF.XFileContent();
	var messageManager = oFF.MessageManagerSimple.createMessageManager();
	messageManager.addError(oFF.ErrorCodes.SYSTEM_IO, errorMessage);
	fileContent.m_messageCollection = messageManager;
	return fileContent;
};
oFF.XFileContent.prototype.m_messageCollection = null;
oFF.XFileContent.prototype.releaseObject = function()
{
	this.m_messageCollection = null;
	oFF.XContent.prototype.releaseObject.call( this );
};
oFF.XFileContent.prototype.setContentTypeAutodetect = function(fallbackType, path, ignoreZipEnding)
{
	this.setContentType(fallbackType);
	if (oFF.notNull(path))
	{
		var lastDot;
		var correctedPath = path;
		if (ignoreZipEnding)
		{
			lastDot = oFF.XString.lastIndexOf(path, ".");
			if (lastDot !== -1)
			{
				correctedPath = oFF.XString.substring(path, 0, lastDot);
			}
		}
		lastDot = oFF.XString.lastIndexOf(correctedPath, ".");
		if (lastDot !== -1)
		{
			var extension = oFF.XString.substring(correctedPath, lastDot + 1, -1);
			var lookup = oFF.ContentType.lookupByFileEnding(oFF.XString.toLowerCase(extension));
			if (oFF.notNull(lookup))
			{
				this.setContentType(lookup);
			}
		}
	}
	return this.getContentType();
};
oFF.XFileContent.prototype.getMessageCollection = function()
{
	return this.m_messageCollection;
};
oFF.XFileContent.prototype.setMessageCollection = function(messageCollection)
{
	this.m_messageCollection = messageCollection;
};
oFF.XFileContent.prototype.toString = function()
{
	if (this.isJsonContentSet())
	{
		return this.getJsonContent().toString();
	}
	else if (this.isStringContentSet())
	{
		return this.getString();
	}
	else
	{
		return "[Binary content]";
	}
};

oFF.XFileSystemManager = function() {};
oFF.XFileSystemManager.prototype = new oFF.DfSessionContext();
oFF.XFileSystemManager.prototype._ff_c = "XFileSystemManager";

oFF.XFileSystemManager.create = function(session)
{
	var newObj = new oFF.XFileSystemManager();
	newObj.setupSessionContext(session);
	return newObj;
};
oFF.XFileSystemManager.prototype.m_fileSystem = null;
oFF.XFileSystemManager.prototype.m_fileSystemsByProtocol = null;
oFF.XFileSystemManager.prototype.m_directory = null;
oFF.XFileSystemManager.prototype.m_remoteFsUrl = null;
oFF.XFileSystemManager.prototype.setupSessionContext = function(session)
{
	oFF.DfSessionContext.prototype.setupSessionContext.call( this , session);
	this.m_fileSystemsByProtocol = oFF.XHashMapByString.create();
	this.m_fileSystem = this.getFileSystemByProtocol(oFF.ProtocolType.FILE);
	if (oFF.notNull(this.m_fileSystem))
	{
		this.m_directory = this.m_fileSystem.getCurrentWorkingDirectory();
	}
};
oFF.XFileSystemManager.prototype.setActiveFileSystem = function(protocolType)
{
	var fs = this.getFileSystemByProtocol(protocolType);
	if (oFF.notNull(fs))
	{
		this.m_fileSystem = fs;
		this.m_directory = this.m_fileSystem.getCurrentWorkingDirectory();
	}
};
oFF.XFileSystemManager.prototype.getActiveFileSystem = function()
{
	return this.m_fileSystem;
};
oFF.XFileSystemManager.prototype.getNativeSlash = function()
{
	return this.getActiveFileSystem().getNativeSlash();
};
oFF.XFileSystemManager.prototype.getFileSystem = function(type)
{
	var result = null;
	var protocolType = type.getProtocolType();
	if (oFF.notNull(protocolType))
	{
		result = this.getFileSystemByProtocol(protocolType);
	}
	return result;
};
oFF.XFileSystemManager.prototype.getFileSystemByProtocol = function(protocolType)
{
	if (oFF.isNull(protocolType))
	{
		return null;
	}
	var fs = this.m_fileSystemsByProtocol.getByKey(protocolType.getName());
	if (oFF.isNull(fs))
	{
		var type = null;
		if (protocolType === oFF.ProtocolType.FILE)
		{
			type = oFF.XFileSystemType.OS;
		}
		else if (protocolType === oFF.ProtocolType.HTTP || protocolType === oFF.ProtocolType.HTTPS)
		{
			type = oFF.XFileSystemType.SIMPLE_WEB;
		}
		else if (protocolType === oFF.ProtocolType.VFS)
		{
			type = oFF.XFileSystemType.VFS;
		}
		if (oFF.notNull(type))
		{
			fs = this.getFileSystemByType(type);
			if (oFF.notNull(fs))
			{
				this.setFileSystemExt(protocolType, fs);
			}
		}
	}
	return fs;
};
oFF.XFileSystemManager.prototype.getFileSystemByType = function(type)
{
	var fs;
	fs = this.m_fileSystemsByProtocol.getByKey(type.getName());
	if (oFF.isNull(fs))
	{
		fs = oFF.XFileSystemFactory.create(this.getSession(), type);
		this.m_fileSystemsByProtocol.put(type.getName(), fs);
	}
	return fs;
};
oFF.XFileSystemManager.prototype.getFileSystemByUri = function(uri)
{
	var fs = null;
	if (oFF.notNull(uri))
	{
		var protocolType = uri.getProtocolType();
		if (protocolType === oFF.ProtocolType.HTTP || protocolType === oFF.ProtocolType.HTTPS)
		{
			var networkLocation = this.getRemoteFsUrl();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(networkLocation) && oFF.XString.startsWith(uri.getUrl(), networkLocation))
			{
				fs = this.getFileSystemByType(oFF.XFileSystemType.REMOTE_WEB);
			}
		}
		if (oFF.isNull(fs))
		{
			fs = this.getFileSystemByProtocol(protocolType);
		}
	}
	return fs;
};
oFF.XFileSystemManager.prototype.getRemoteFsUrl = function()
{
	if (oFF.isNull(this.m_remoteFsUrl))
	{
		var variable = this.getSession().getEnvironment().getVariable(oFF.XEnvironmentConstants.REMOTE_FS_LOCATION);
		if (oFF.notNull(variable))
		{
			this.m_remoteFsUrl = oFF.XUri.createFromFileSystemPath(this.getSession(), variable, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DEFAULT_VALUE).getUrl();
		}
		else
		{
			this.m_remoteFsUrl = "";
		}
	}
	return this.m_remoteFsUrl;
};
oFF.XFileSystemManager.prototype.getCurrentWorkingDirectory = function()
{
	return this.m_directory;
};
oFF.XFileSystemManager.prototype.setCurrentWorkingDirectory = function(directory)
{
	this.m_directory = directory;
};
oFF.XFileSystemManager.prototype.setFileSystemExt = function(protocolType, fs)
{
	if (oFF.notNull(protocolType) && oFF.notNull(fs))
	{
		this.m_fileSystemsByProtocol.put(protocolType.getName(), fs);
	}
};

oFF.ConnectionPersonalization = function() {};
oFF.ConnectionPersonalization.prototype = new oFF.XObject();
oFF.ConnectionPersonalization.prototype._ff_c = "ConnectionPersonalization";

oFF.ConnectionPersonalization.createPersonalization = function()
{
	return new oFF.ConnectionPersonalization();
};
oFF.ConnectionPersonalization.prototype.m_type = null;
oFF.ConnectionPersonalization.prototype.m_user = null;
oFF.ConnectionPersonalization.prototype.m_password = null;
oFF.ConnectionPersonalization.prototype.m_language = null;
oFF.ConnectionPersonalization.prototype.m_x509Certificate = null;
oFF.ConnectionPersonalization.prototype.m_secureLoginProfile = null;
oFF.ConnectionPersonalization.prototype.m_token = null;
oFF.ConnectionPersonalization.prototype.m_token2 = null;
oFF.ConnectionPersonalization.prototype.m_organizationToken = null;
oFF.ConnectionPersonalization.prototype.m_elementToken = null;
oFF.ConnectionPersonalization.prototype.m_userToken = null;
oFF.ConnectionPersonalization.prototype.m_tenantId = null;
oFF.ConnectionPersonalization.prototype.m_internalUserName = null;
oFF.ConnectionPersonalization.prototype.releaseObject = function()
{
	this.m_type = null;
	this.m_user = null;
	this.m_password = null;
	this.m_language = null;
	this.m_x509Certificate = null;
	this.m_secureLoginProfile = null;
	this.m_token = null;
	this.m_token2 = null;
	this.m_organizationToken = null;
	this.m_elementToken = null;
	this.m_userToken = null;
	this.m_internalUserName = null;
};
oFF.ConnectionPersonalization.prototype.setFromPersonalization = function(personalization)
{
	oFF.XConnectHelper.copyConnectionPersonalization(personalization, this);
};
oFF.ConnectionPersonalization.prototype.getAuthenticationType = function()
{
	return this.m_type;
};
oFF.ConnectionPersonalization.prototype.setAuthenticationType = function(type)
{
	this.m_type = type;
};
oFF.ConnectionPersonalization.prototype.getUser = function()
{
	return this.m_user;
};
oFF.ConnectionPersonalization.prototype.setUser = function(user)
{
	this.m_user = user;
};
oFF.ConnectionPersonalization.prototype.getInternalUser = function()
{
	return this.m_internalUserName;
};
oFF.ConnectionPersonalization.prototype.setInternalUser = function(user)
{
	this.m_internalUserName = user;
};
oFF.ConnectionPersonalization.prototype.getPassword = function()
{
	return this.m_password;
};
oFF.ConnectionPersonalization.prototype.setPassword = function(password)
{
	this.m_password = password;
};
oFF.ConnectionPersonalization.prototype.getLanguage = function()
{
	return this.m_language;
};
oFF.ConnectionPersonalization.prototype.setLanguage = function(language)
{
	this.m_language = language;
};
oFF.ConnectionPersonalization.prototype.getX509Certificate = function()
{
	return this.m_x509Certificate;
};
oFF.ConnectionPersonalization.prototype.setX509Certificate = function(x509Certificate)
{
	this.m_x509Certificate = x509Certificate;
};
oFF.ConnectionPersonalization.prototype.setAuthenticationToken = function(token)
{
	this.m_token = token;
	if (oFF.notNull(token))
	{
		this.m_token2 = token.getAccessToken();
	}
};
oFF.ConnectionPersonalization.prototype.getAuthenticationToken = function()
{
	return this.m_token;
};
oFF.ConnectionPersonalization.prototype.getAccessToken = function()
{
	return this.m_token2;
};
oFF.ConnectionPersonalization.prototype.setAccessToken = function(token)
{
	this.m_token2 = token;
	if (oFF.notNull(token))
	{
		this.m_token = oFF.XAuthenticationToken.create(token);
	}
};
oFF.ConnectionPersonalization.prototype.getSecureLoginProfile = function()
{
	return this.m_secureLoginProfile;
};
oFF.ConnectionPersonalization.prototype.setSecureLoginProfile = function(secureLoginProfile)
{
	this.m_secureLoginProfile = secureLoginProfile;
};
oFF.ConnectionPersonalization.prototype.getUserToken = function()
{
	return this.m_userToken;
};
oFF.ConnectionPersonalization.prototype.setUserToken = function(userToken)
{
	this.m_userToken = userToken;
};
oFF.ConnectionPersonalization.prototype.getOrganizationToken = function()
{
	return this.m_organizationToken;
};
oFF.ConnectionPersonalization.prototype.setOrganizationToken = function(organizationToken)
{
	this.m_organizationToken = organizationToken;
};
oFF.ConnectionPersonalization.prototype.getElementToken = function()
{
	return this.m_elementToken;
};
oFF.ConnectionPersonalization.prototype.setElementToken = function(elementToken)
{
	this.m_elementToken = elementToken;
};
oFF.ConnectionPersonalization.prototype.getTenantId = function()
{
	return this.m_tenantId;
};
oFF.ConnectionPersonalization.prototype.setTenantId = function(tenantId)
{
	this.m_tenantId = tenantId;
};
oFF.ConnectionPersonalization.prototype.toString = function()
{
	var buffer = oFF.XStringBuffer.create();
	buffer.append("Type:     ");
	if (oFF.notNull(this.m_type))
	{
		buffer.append(this.m_type.toString());
	}
	buffer.appendNewLine();
	buffer.append("User:     ").appendLine(this.m_user);
	buffer.append("Language: ").append(this.m_language);
	return buffer.toString();
};

oFF.UserSettings = function() {};
oFF.UserSettings.prototype = new oFF.XObject();
oFF.UserSettings.prototype._ff_c = "UserSettings";

oFF.UserSettings.prototype.getStringByKey = oFF.noSupport;
oFF.UserSettings.prototype.getStringByKeyExt = oFF.noSupport;
oFF.UserSettings.prototype.putString = oFF.noSupport;
oFF.UserSettings.prototype.putStringNotNull = function(name, stringValue)
{
	if (oFF.notNull(stringValue))
	{
		this.putString(name, stringValue);
	}
};
oFF.UserSettings.prototype.putStringNotNullAndNotEmpty = function(name, stringValue)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(stringValue))
	{
		this.putString(name, stringValue);
	}
};
oFF.UserSettings.prototype.getBooleanByKey = oFF.noSupport;
oFF.UserSettings.prototype.getBooleanByKeyExt = oFF.noSupport;
oFF.UserSettings.prototype.putBoolean = oFF.noSupport;
oFF.UserSettings.prototype.getLongByKey = oFF.noSupport;
oFF.UserSettings.prototype.getLongByKeyExt = oFF.noSupport;
oFF.UserSettings.prototype.putLong = oFF.noSupport;
oFF.UserSettings.prototype.getIntegerByKey = oFF.noSupport;
oFF.UserSettings.prototype.getIntegerByKeyExt = oFF.noSupport;
oFF.UserSettings.prototype.putInteger = oFF.noSupport;
oFF.UserSettings.prototype.getDoubleByKey = oFF.noSupport;
oFF.UserSettings.prototype.getDoubleByKeyExt = oFF.noSupport;
oFF.UserSettings.prototype.putDouble = oFF.noSupport;
oFF.UserSettings.prototype.putNull = function(name)
{
	this.removeKey(name);
};
oFF.UserSettings.prototype.hasNullByKey = function(name)
{
	return this.containsKey(name);
};
oFF.UserSettings.prototype.removeKey = oFF.noSupport;
oFF.UserSettings.prototype.containsKey = oFF.noSupport;

oFF.DfSqlRsMetaData = function() {};
oFF.DfSqlRsMetaData.prototype = new oFF.XObjectExt();
oFF.DfSqlRsMetaData.prototype._ff_c = "DfSqlRsMetaData";


oFF.SqlJsonResultSet = function() {};
oFF.SqlJsonResultSet.prototype = new oFF.DfSqlResultSet();
oFF.SqlJsonResultSet.prototype._ff_c = "SqlJsonResultSet";

oFF.SqlJsonResultSet.create = function(result)
{
	var obj = new oFF.SqlJsonResultSet();
	obj.m_result = result;
	obj.m_i = -1;
	obj.m_j = -1;
	return obj;
};
oFF.SqlJsonResultSet.prototype.m_result = null;
oFF.SqlJsonResultSet.prototype.m_i = 0;
oFF.SqlJsonResultSet.prototype.m_j = 0;
oFF.SqlJsonResultSet.prototype.next = function()
{
	if (this.m_i === -1 && ++this.m_j >= this.m_result.size())
	{
		return false;
	}
	if (++this.m_i >= this.m_result.getStructureAt(this.m_j).getListByKey("values").size())
	{
		this.m_i = -1;
		return this.next();
	}
	return true;
};
oFF.SqlJsonResultSet.prototype.close = function() {};
oFF.SqlJsonResultSet.prototype.getMetaData = function()
{
	return oFF.SqlJsonRsMetaData.create(this.m_result);
};
oFF.SqlJsonResultSet.prototype.getAt = function(col)
{
	return this.m_result.getStructureAt(this.m_j).getListByKey("values").getListAt(this.m_i).get(col);
};
oFF.SqlJsonResultSet.prototype.getByKey = function(name)
{
	var columns = this.m_result.getStructureAt(this.m_j).getListByKey("columns");
	for (var i = 0; i < columns.size(); ++i)
	{
		if (columns.get(i).isString() && oFF.XString.isEqual(columns.get(i).asString().getString(), name))
		{
			return this.getAt(i);
		}
	}
	return null;
};
oFF.SqlJsonResultSet.prototype.getStringByKey = function(name)
{
	return this.getStringByKeyExt(name, null);
};
oFF.SqlJsonResultSet.prototype.getStringByKeyExt = function(name, defaultValue)
{
	var el = this.getByKey(name);
	if (oFF.isNull(el))
	{
		return defaultValue;
	}
	return el.isString() ? el.asString().getString() : el.getStringRepresentation();
};
oFF.SqlJsonResultSet.prototype.getIntegerByKey = function(name)
{
	return this.getIntegerByKeyExt(name, 0);
};
oFF.SqlJsonResultSet.prototype.getIntegerByKeyExt = function(name, defaultValue)
{
	var el = this.getByKey(name);
	if (oFF.isNull(el))
	{
		return defaultValue;
	}
	return el.isInteger() ? el.asInteger().getInteger() : defaultValue;
};
oFF.SqlJsonResultSet.prototype.getLongByKey = function(name)
{
	return this.getLongByKeyExt(name, 0);
};
oFF.SqlJsonResultSet.prototype.getLongByKeyExt = function(name, defaultValue)
{
	var el = this.getByKey(name);
	if (oFF.isNull(el))
	{
		return defaultValue;
	}
	return el.isLong() ? el.asLong().getLong() : defaultValue;
};
oFF.SqlJsonResultSet.prototype.getDoubleByKey = function(name)
{
	return this.getDoubleByKeyExt(name, 0);
};
oFF.SqlJsonResultSet.prototype.getDoubleByKeyExt = function(name, defaultValue)
{
	var el = this.getByKey(name);
	if (oFF.isNull(el))
	{
		return defaultValue;
	}
	return el.isLong() ? el.asLong().getLong() : defaultValue;
};
oFF.SqlJsonResultSet.prototype.getBooleanByKey = function(name)
{
	return this.getBooleanByKeyExt(name, false);
};
oFF.SqlJsonResultSet.prototype.getBooleanByKeyExt = function(name, defaultValue)
{
	var el = this.getByKey(name);
	if (oFF.isNull(el))
	{
		return defaultValue;
	}
	return el.isBoolean() ? el.asBoolean().getBoolean() : defaultValue;
};
oFF.SqlJsonResultSet.prototype.hasNullByKey = function(name)
{
	var el = this.getByKey(name);
	if (oFF.isNull(el))
	{
		return true;
	}
	return false;
};
oFF.SqlJsonResultSet.prototype.getIntegerAt = function(index)
{
	return this.getIntegerAtExt(index, 0);
};
oFF.SqlJsonResultSet.prototype.getIntegerAtExt = function(index, defaultValue)
{
	var el = this.getAt(index);
	if (oFF.isNull(el))
	{
		return defaultValue;
	}
	return el.isInteger() ? el.asInteger().getInteger() : defaultValue;
};
oFF.SqlJsonResultSet.prototype.getBooleanAt = function(index)
{
	return this.getBooleanAtExt(index, false);
};
oFF.SqlJsonResultSet.prototype.getBooleanAtExt = function(index, defaultValue)
{
	var el = this.getAt(index);
	if (oFF.isNull(el))
	{
		return defaultValue;
	}
	return el.isBoolean() ? el.asBoolean().getBoolean() : defaultValue;
};
oFF.SqlJsonResultSet.prototype.getDoubleAt = function(index)
{
	return this.getDoubleAtExt(index, 0);
};
oFF.SqlJsonResultSet.prototype.getDoubleAtExt = function(index, defaultValue)
{
	var el = this.getAt(index);
	if (oFF.isNull(el))
	{
		return defaultValue;
	}
	return el.isLong() ? el.asLong().getLong() : defaultValue;
};
oFF.SqlJsonResultSet.prototype.getStringAt = function(index)
{
	return this.getStringAtExt(index, null);
};
oFF.SqlJsonResultSet.prototype.getStringAtExt = function(index, defaultValue)
{
	var el = this.getAt(index);
	if (oFF.isNull(el))
	{
		return defaultValue;
	}
	return el.isString() ? el.asString().getString() : el.getStringRepresentation();
};
oFF.SqlJsonResultSet.prototype.getLongAt = function(index)
{
	return this.getLongAtExt(index, 0);
};
oFF.SqlJsonResultSet.prototype.getLongAtExt = function(index, defaultValue)
{
	var el = this.getAt(index);
	if (oFF.isNull(el))
	{
		return defaultValue;
	}
	return el.isLong() ? el.asLong().getLong() : defaultValue;
};

oFF.SqlJsonRsMetaData = function() {};
oFF.SqlJsonRsMetaData.prototype = new oFF.XObject();
oFF.SqlJsonRsMetaData.prototype._ff_c = "SqlJsonRsMetaData";

oFF.SqlJsonRsMetaData.toSqlType = function(type)
{
	if (type === oFF.PrElementType.INTEGER)
	{
		return oFF.SqlResultSetType.INTEGER;
	}
	if (type === oFF.PrElementType.STRING)
	{
		return oFF.SqlResultSetType.STRING;
	}
	if (type === oFF.PrElementType.DOUBLE)
	{
		return oFF.SqlResultSetType.DOUBLE;
	}
	if (type === oFF.PrElementType.LONG)
	{
		return oFF.SqlResultSetType.LONG;
	}
	if (type === oFF.PrElementType.BOOLEAN)
	{
		return oFF.SqlResultSetType.BOOLEAN;
	}
	return oFF.SqlResultSetType.THE_NULL;
};
oFF.SqlJsonRsMetaData.create = function(result)
{
	var obj = new oFF.SqlJsonRsMetaData();
	obj.m_columns = oFF.XList.create();
	for (var i = 0; i < result.size(); i++)
	{
		var columns = result.getStructureAt(i).getListByKey("columns");
		var values = result.getStructureAt(i).getListByKey("values");
		for (var j = 0; j < columns.size(); j++)
		{
			var res = i === 0;
			if (!res)
			{
				var cur = columns.get(j);
				for (var l = 0; l < obj.m_columns.size(); l++)
				{
					if (obj.m_columns.get(l).isEqualTo(cur))
					{
						res = true;
						break;
					}
				}
			}
			if (res)
			{
				var type = null;
				for (var k = 0; k < values.size(); k++)
				{
					var val = values.getListAt(k).get(j);
					if (oFF.notNull(val))
					{
						var ctype = val.getType();
						if (oFF.isNull(type))
						{
							type = ctype;
						}
						else if (type !== ctype)
						{
							type = oFF.PrElementType.STRING;
						}
					}
				}
				obj.m_columns.add(oFF.XPair.create(oFF.XStringValue.create(columns.get(j).asString().getString()), oFF.SqlJsonRsMetaData.toSqlType(type)));
			}
		}
	}
	return obj;
};
oFF.SqlJsonRsMetaData.prototype.m_columns = null;
oFF.SqlJsonRsMetaData.prototype.get = function(index)
{
	return this.m_columns.get(index).getFirstObject().getString();
};
oFF.SqlJsonRsMetaData.prototype.size = function()
{
	return this.m_columns.size();
};
oFF.SqlJsonRsMetaData.prototype.isEmpty = function()
{
	return this.size() === 0;
};
oFF.SqlJsonRsMetaData.prototype.hasElements = function()
{
	return !this.isEmpty();
};
oFF.SqlJsonRsMetaData.prototype.getType = function(index)
{
	return this.m_columns.get(index).getSecondObject();
};

oFF.IoSession = function() {};
oFF.IoSession.prototype = new oFF.XObjectExt();
oFF.IoSession.prototype._ff_c = "IoSession";

oFF.IoSession.createIo = function()
{
	return oFF.IoSession.createIoExt(null, null);
};
oFF.IoSession.createIoExt = function(parent, envExtParameters)
{
	var session = new oFF.IoSession();
	session.setupIoSession(parent, envExtParameters);
	return session;
};
oFF.IoSession.prepareEnvVariables = function(envExtParameters)
{
	var environment = oFF.XEnvironment.createCopy(oFF.XEnvironment.getInstance());
	if (oFF.notNull(envExtParameters))
	{
		var envPrioHigh = false;
		if (oFF.XLanguage.getLanguage() === oFF.XLanguage.JAVASCRIPT && oFF.XPlatform.getPlatform() === oFF.XPlatform.BROWSER)
		{
			envPrioHigh = true;
		}
		var prioEnv = envExtParameters.getByKey(oFF.XEnvironmentConstants.FIREFLY_ENV_PRIO);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(prioEnv))
		{
			if (oFF.XString.isEqual(prioEnv, "high"))
			{
				envPrioHigh = true;
			}
			else if (oFF.XString.isEqual(prioEnv, "low"))
			{
				envPrioHigh = false;
			}
		}
		if (envPrioHigh === true)
		{
			var keyIterator = envExtParameters.getKeysAsIteratorOfString();
			while (keyIterator.hasNext())
			{
				var key = keyIterator.next();
				if (environment.containsKey(key) === false)
				{
					environment.put(key, envExtParameters.getByKey(key));
				}
			}
		}
		else
		{
			environment.putAll(envExtParameters);
		}
	}
	var networkUrl = environment.getVariable(oFF.XEnvironmentConstants.NETWORK_LOCATION);
	var networkUri;
	if (oFF.isNull(networkUrl))
	{
		networkUri = oFF.NetworkEnv.getLocation();
		if (oFF.notNull(networkUri))
		{
			networkUrl = networkUri.toString();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(networkUrl))
			{
				environment.setVariable(oFF.XEnvironmentConstants.NETWORK_LOCATION, networkUrl);
			}
		}
	}
	else
	{
		networkUri = oFF.XUri.createFromUrl(networkUrl);
	}
	var networkRootDirUri = oFF.XUri.createFromUrlWithParent("/", networkUri, false);
	networkRootDirUri.setQuery(null);
	networkRootDirUri.setFragment(null);
	var networkRootDirUrl = networkRootDirUri.toString();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(networkRootDirUrl))
	{
		environment.setVariable(oFF.XEnvironmentConstants.NETWORK_ROOT_DIR, networkRootDirUrl);
		environment.setVariable(oFF.XEnvironmentConstants.NETWORK_DIR, networkRootDirUrl);
	}
	var networkDirUri = oFF.XUri.createFromUrlWithParent(".", networkUri, false);
	networkDirUri.setQuery(null);
	networkDirUri.setFragment(null);
	networkDirUri.normalizePath(true);
	var networkDirUrl = networkDirUri.toString();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(networkDirUrl))
	{
		environment.setVariable(oFF.XEnvironmentConstants.NETWORK_CURRENT_DIR, networkDirUrl);
	}
	return environment;
};
oFF.IoSession.prototype.m_parentSession = null;
oFF.IoSession.prototype.m_singletons = null;
oFF.IoSession.prototype.m_workingTaskManager = null;
oFF.IoSession.prototype.m_defaultSyncType = null;
oFF.IoSession.prototype.m_xVersion = 0;
oFF.IoSession.prototype.m_featureToggles = null;
oFF.IoSession.prototype.m_currentSid = 0;
oFF.IoSession.prototype.m_appSessionId = null;
oFF.IoSession.prototype.m_logWriterMaster = null;
oFF.IoSession.prototype.m_logWriter = null;
oFF.IoSession.prototype.m_proxySettings = null;
oFF.IoSession.prototype.m_fileSystemManager = null;
oFF.IoSession.prototype.m_stdin = null;
oFF.IoSession.prototype.m_stdout = null;
oFF.IoSession.prototype.m_stdlog = null;
oFF.IoSession.prototype.m_networkLocation = null;
oFF.IoSession.prototype.m_environment = null;
oFF.IoSession.prototype.m_capabilities = null;
oFF.IoSession.prototype.m_contextName = null;
oFF.IoSession.prototype.m_interruptStepListener = null;
oFF.IoSession.prototype.setupIoSession = function(parent, environmentConfig)
{
	this.m_parentSession = parent;
	this.m_appSessionId = oFF.XGuid.getGuid();
	this.m_singletons = oFF.XHashMapByString.create();
	this.m_interruptStepListener = oFF.XList.create();
	var environment;
	this.m_fileSystemManager = oFF.XFileSystemManager.create(this);
	this.m_featureToggles = oFF.XSetOfNameObject.create();
	if (oFF.isNull(parent))
	{
		this.m_defaultSyncType = oFF.SyncType.BLOCKING;
		this.m_networkLocation = oFF.NetworkEnv.getLocation();
		var stdio = oFF.XStdio.getInstance();
		if (oFF.notNull(stdio))
		{
			this.m_stdin = stdio.getStdin();
			this.m_stdout = stdio.getStdout();
			this.m_stdlog = stdio.getStdlog();
		}
		environment = oFF.IoSession.prepareEnvVariables(environmentConfig);
		this.m_capabilities = oFF.XHashSetOfString.create();
		this.m_proxySettings = oFF.ProxySettings.create(null);
		this.m_proxySettings.loadFromEnvironment(environment);
		var featureToggleList = environment.getStringByKey(oFF.XEnvironmentConstants.FIREFLY_FEATURE_TOGGLES);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(featureToggleList))
		{
			var listOfToggles = oFF.XStringTokenizer.splitString(featureToggleList, ",");
			for (var m = 0; m < listOfToggles.size(); m++)
			{
				var singleToggle = listOfToggles.get(m);
				var singleToggleClean = singleToggle;
				var doAdd = true;
				if (oFF.XString.startsWith(singleToggle, "+"))
				{
					singleToggleClean = oFF.XString.substring(singleToggle, 1, -1);
				}
				else if (oFF.XString.startsWith(singleToggle, "-"))
				{
					singleToggleClean = oFF.XString.substring(singleToggle, 1, -1);
					doAdd = false;
				}
				var toggleConstant = oFF.FeatureToggleOlap.lookup(singleToggleClean);
				if (oFF.notNull(toggleConstant))
				{
					if (doAdd)
					{
						this.activateFeatureToggle(toggleConstant);
					}
					else
					{
						this.deactivateFeatureToggle(toggleConstant);
					}
				}
			}
		}
	}
	else
	{
		this.m_defaultSyncType = parent.getDefaultSyncType();
		this.m_stdin = parent.getStdin();
		this.m_stdout = parent.getStdout();
		this.m_stdlog = parent.getStdlog();
		this.m_networkLocation = parent.getNetworkLocation();
		this.m_proxySettings = oFF.ProxySettings.create(parent.getProxySettings());
		environment = oFF.XEnvironment.createCopy(parent.getEnvironment());
		this.m_capabilities = parent.getCapabilities();
		this.m_featureToggles.addAll(parent.getFeatureToggles());
	}
	this.m_logWriterMaster = oFF.XLogWriter.create(this.m_stdlog);
	var severity = oFF.Severity.fromName(environment.getStringByKey(oFF.XEnvironmentConstants.FIREFLY_LOG_SEVERITY));
	this.m_logWriterMaster.setLogFilterSeverity(oFF.isNull(severity) ? oFF.Severity.ERROR : severity);
	this.m_logWriter = this.m_logWriterMaster;
	environment.setLogWriter(this.m_logWriterMaster);
	this.m_environment = environment;
	this.m_xVersion = this.getValidXVersion();
};
oFF.IoSession.prototype.newSubSession = function()
{
	return null;
};
oFF.IoSession.prototype.releaseObject = function()
{
	this.m_parentSession = null;
	this.m_defaultSyncType = null;
	this.m_appSessionId = null;
	this.m_fileSystemManager = null;
	this.m_interruptStepListener = oFF.XObjectExt.release(this.m_interruptStepListener);
	this.m_logWriter = null;
	this.m_logWriterMaster = oFF.XObjectExt.release(this.m_logWriterMaster);
	this.m_singletons = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_singletons);
	this.m_workingTaskManager = oFF.XObjectExt.release(this.m_workingTaskManager);
	this.m_capabilities = null;
	this.m_environment = null;
	this.m_featureToggles = null;
	this.m_stdin = null;
	this.m_stdout = null;
	this.m_stdlog = null;
	this.m_proxySettings = null;
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.IoSession.prototype.getSession = function()
{
	return this;
};
oFF.IoSession.prototype.getSessionSingletons = function()
{
	return this.m_singletons;
};
oFF.IoSession.prototype.getWorkingTaskManager = function()
{
	if (oFF.isNull(this.m_parentSession))
	{
		this.checkWorkingTaskManager();
		return this.m_workingTaskManager;
	}
	else
	{
		return this.m_parentSession.getWorkingTaskManager();
	}
};
oFF.IoSession.prototype.checkWorkingTaskManager = function()
{
	if (oFF.isNull(this.m_workingTaskManager))
	{
		if (!this.newWorkingTaskManager(oFF.WorkingTaskManagerType.UI_DRIVER))
		{
			if (!this.newWorkingTaskManager(oFF.WorkingTaskManagerType.MULTI_THREADED))
			{
				this.newWorkingTaskManager(oFF.WorkingTaskManagerType.SINGLE_THREADED);
			}
		}
	}
};
oFF.IoSession.prototype.newWorkingTaskManager = function(type)
{
	var newInstance = oFF.WorkingTaskManagerFactory.create(type, this);
	if (oFF.notNull(newInstance))
	{
		newInstance.setupWorkingTaskManager(this);
		this.setWorkingTaskManager(newInstance);
		return true;
	}
	return false;
};
oFF.IoSession.prototype.setWorkingTaskManager = function(workingTaskManager)
{
	this.m_workingTaskManager = workingTaskManager;
};
oFF.IoSession.prototype.getDefaultSyncType = function()
{
	return this.m_defaultSyncType;
};
oFF.IoSession.prototype.setDefaultSyncType = function(syncType)
{
	this.m_defaultSyncType = syncType;
};
oFF.IoSession.prototype.getNextSid = function()
{
	this.m_currentSid = this.m_currentSid + 1;
	return this.m_currentSid;
};
oFF.IoSession.prototype.getAppSessionId = function()
{
	return this.m_appSessionId;
};
oFF.IoSession.prototype.setAppSessionId = function(appSessionId)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(appSessionId))
	{
		this.m_appSessionId = appSessionId;
	}
};
oFF.IoSession.prototype.setLogWriter = function(logWriter)
{
	this.m_logWriter = logWriter;
};
oFF.IoSession.prototype.getLogWriter = function()
{
	return this.m_logWriter;
};
oFF.IoSession.prototype.getLogWriterBase = function()
{
	return this.m_logWriter;
};
oFF.IoSession.prototype.getLogger = function()
{
	return this;
};
oFF.IoSession.prototype.getFileSystemManager = function()
{
	if (oFF.isNull(this.m_parentSession))
	{
		return this.m_fileSystemManager;
	}
	else
	{
		return this.m_parentSession.getFileSystemManager();
	}
};
oFF.IoSession.prototype.setFileSystemManager = function(fileSystemManager)
{
	this.m_fileSystemManager = fileSystemManager;
};
oFF.IoSession.prototype.getStdin = function()
{
	return this.m_stdin;
};
oFF.IoSession.prototype.setStdin = function(stdin)
{
	this.m_stdin = stdin;
};
oFF.IoSession.prototype.getStdout = function()
{
	return this.m_stdout;
};
oFF.IoSession.prototype.setStdout = function(stdout)
{
	this.m_stdout = stdout;
};
oFF.IoSession.prototype.getStdlog = function()
{
	return this.m_stdlog;
};
oFF.IoSession.prototype.setStdlog = function(stdlog)
{
	this.m_stdlog = stdlog;
	this.m_logWriterMaster.setLogStream(stdlog);
};
oFF.IoSession.prototype.getProxySettings = function()
{
	return this.m_proxySettings;
};
oFF.IoSession.prototype.setProxySettings = function(proxySettings)
{
	this.m_proxySettings = proxySettings;
};
oFF.IoSession.prototype.getNetworkLocation = function()
{
	return this.m_networkLocation;
};
oFF.IoSession.prototype.setNetworkLocation = function(networkLocation)
{
	this.m_networkLocation = networkLocation;
};
oFF.IoSession.prototype.getEnvironment = function()
{
	return this.m_environment;
};
oFF.IoSession.prototype.setEnvironment = function(environment)
{
	this.m_environment = environment;
};
oFF.IoSession.prototype.resolvePath = function(path)
{
	var url = null;
	var uri = oFF.XUri.createFromFileSystemPath(this, path, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
	if (oFF.notNull(uri))
	{
		url = uri.getUrl();
	}
	return url;
};
oFF.IoSession.prototype.getValidXVersion = function()
{
	var theVersion;
	var xversionValue = this.m_environment.getVariable(oFF.XEnvironmentConstants.XVERSION);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(xversionValue))
	{
		theVersion = oFF.XInteger.convertFromStringWithDefault(xversionValue, oFF.XVersion.DEFAULT_VALUE);
	}
	else
	{
		theVersion = oFF.XVersion.DEFAULT_VALUE;
	}
	if (theVersion < oFF.XVersion.MIN)
	{
		theVersion = oFF.XVersion.MIN;
	}
	if (theVersion > oFF.XVersion.MAX)
	{
		theVersion = oFF.XVersion.MAX;
	}
	return theVersion;
};
oFF.IoSession.prototype.hasCapability = function(name)
{
	return this.m_capabilities.contains(name);
};
oFF.IoSession.prototype.getCapabilities = function()
{
	return this.m_capabilities;
};
oFF.IoSession.prototype.setCapabilities = function(capabilities)
{
	this.m_capabilities = capabilities;
};
oFF.IoSession.prototype.getCurrentWorkingDirectory = function()
{
	return this.getFileSystemManager().getCurrentWorkingDirectory();
};
oFF.IoSession.prototype.setCurrentWorkingDirectory = function(directory)
{
	this.getFileSystemManager().setCurrentWorkingDirectory(directory);
};
oFF.IoSession.prototype.setLogFilterLevel = function(filterLevel)
{
	this.m_logWriterMaster.setLogFilterLevel(filterLevel);
};
oFF.IoSession.prototype.setLogFilterSeverity = function(filterLevel)
{
	this.m_logWriterMaster.setLogFilterSeverity(filterLevel);
};
oFF.IoSession.prototype.enableAllLogSeverity = function()
{
	this.m_logWriterMaster.enableAllLogSeverity();
};
oFF.IoSession.prototype.disableAllLogSeverity = function()
{
	this.m_logWriterMaster.disableAllLogSeverity();
};
oFF.IoSession.prototype.enableAllLogs = function()
{
	this.m_logWriterMaster.enableAllLogs();
};
oFF.IoSession.prototype.disableAllLogs = function()
{
	this.m_logWriterMaster.disableAllLogs();
};
oFF.IoSession.prototype.disableAllLogLayers = function()
{
	this.m_logWriterMaster.disableAllLogLayers();
};
oFF.IoSession.prototype.enableAllLogLayers = function()
{
	this.m_logWriterMaster.enableAllLogLayers();
};
oFF.IoSession.prototype.addLogLayer = function(layer)
{
	this.m_logWriterMaster.addLogLayer(layer);
};
oFF.IoSession.prototype.getContextName = function()
{
	return this.m_contextName;
};
oFF.IoSession.prototype.setContextName = function(contextName)
{
	this.m_contextName = contextName;
};
oFF.IoSession.prototype.addToListenerQueue = function(syncAction)
{
	return false;
};
oFF.IoSession.prototype.getXVersion = function()
{
	return this.m_xVersion;
};
oFF.IoSession.prototype.setXVersion = function(xVersion)
{
	this.m_xVersion = xVersion;
};
oFF.IoSession.prototype.getFeatureToggles = function()
{
	return this.m_featureToggles;
};
oFF.IoSession.prototype.hasFeature = function(featureToggle)
{
	var xVersionFeature = featureToggle.getXVersion();
	if (xVersionFeature < 0)
	{
		return true;
	}
	else if (xVersionFeature <= this.m_xVersion)
	{
		return true;
	}
	else
	{
		return this.m_featureToggles.containsKey(featureToggle.getName());
	}
};
oFF.IoSession.prototype.activateFeatureToggle = function(featureToggle)
{
	this.m_featureToggles.add(featureToggle);
};
oFF.IoSession.prototype.activateFeatureToggleSet = function(featureToggles)
{
	this.m_featureToggles.addAll(featureToggles);
};
oFF.IoSession.prototype.deactivateFeatureToggle = function(featureToggle)
{
	this.m_featureToggles.removeElement(featureToggle);
};
oFF.IoSession.prototype.clearAllFeatureToggles = function()
{
	this.m_featureToggles.clear();
};
oFF.IoSession.prototype.registerInterruptStepListener = function(listener, customIdentifier)
{
	this.m_interruptStepListener.add(oFF.XPair.create(listener, customIdentifier));
};
oFF.IoSession.prototype.unregisterInterruptStepListener = function(listener)
{
	for (var i = 0; i < this.m_interruptStepListener.size(); )
	{
		var pair = this.m_interruptStepListener.get(i);
		var currentListener = pair.getFirstObject();
		if (currentListener === listener)
		{
			this.m_interruptStepListener.removeAt(i);
		}
		else
		{
			i++;
		}
	}
};
oFF.IoSession.prototype.notifyInterruptStep = function(interruptStep, start)
{
	for (var i = 0; i < this.m_interruptStepListener.size(); )
	{
		var pair = this.m_interruptStepListener.get(i);
		var listener = pair.getFirstObject();
		var customIdentifier = pair.getSecondObject();
		if (!listener.isReleased())
		{
			if (start)
			{
				listener.onInterruptStepStart(interruptStep, customIdentifier);
			}
			else
			{
				listener.onInterruptStepEnd(interruptStep, customIdentifier);
			}
			i++;
		}
		else
		{
			this.m_interruptStepListener.removeAt(i);
		}
	}
};
oFF.IoSession.prototype.getHttpExchangeEnhancer = function()
{
	return oFF.HttpExchangeInterceptorProvider.getHttpExchangeInterceptor();
};
oFF.IoSession.prototype.getParentSession = function()
{
	return this.m_parentSession;
};
oFF.IoSession.prototype.setParentSession = function(parentSession)
{
	this.m_parentSession = parentSession;
};
oFF.IoSession.prototype.toString = function()
{
	var buffer = oFF.XStringBuffer.create();
	buffer.append("Session Version: ");
	buffer.appendInt(this.m_xVersion);
	buffer.append(", Application Session Id: ");
	buffer.append(this.m_appSessionId);
	return buffer.toString();
};

oFF.DfWorkingTask = function() {};
oFF.DfWorkingTask.prototype = new oFF.DfSessionContext();
oFF.DfWorkingTask.prototype._ff_c = "DfWorkingTask";

oFF.DfWorkingTask.prototype.processInputOnWorkerThread = function(handle) {};
oFF.DfWorkingTask.prototype.processOutputOnMainThread = function(handle) {};
oFF.DfWorkingTask.prototype.isFinishedOnWorkerThread = function(handle)
{
	return true;
};

oFF.WorkingTaskHandle = function() {};
oFF.WorkingTaskHandle.prototype = new oFF.XObject();
oFF.WorkingTaskHandle.prototype._ff_c = "WorkingTaskHandle";

oFF.WorkingTaskHandle.create = function(manager, task)
{
	var handle = new oFF.WorkingTaskHandle();
	handle.setupWorkingTaskHandle(manager, task);
	return handle;
};
oFF.WorkingTaskHandle.prototype.m_outputChunks = null;
oFF.WorkingTaskHandle.prototype.m_inputChunks = null;
oFF.WorkingTaskHandle.prototype.m_isCancellingRequested = false;
oFF.WorkingTaskHandle.prototype.m_task = null;
oFF.WorkingTaskHandle.prototype.m_workingTaskManager = null;
oFF.WorkingTaskHandle.prototype.setupWorkingTaskHandle = function(manager, task)
{
	this.m_workingTaskManager = manager;
	this.m_task = task;
	this.m_outputChunks = oFF.XList.create();
	this.m_inputChunks = oFF.XList.create();
};
oFF.WorkingTaskHandle.prototype.releaseObject = function()
{
	this.m_inputChunks = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_inputChunks);
	this.m_outputChunks = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_outputChunks);
	this.m_task = oFF.XObjectExt.release(this.m_task);
	this.m_workingTaskManager = oFF.XObjectExt.release(this.m_workingTaskManager);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.WorkingTaskHandle.prototype.processSynchronization = function(syncType)
{
	this.m_workingTaskManager.addHandleToProcessingQueue(this);
	if (syncType === oFF.SyncType.BLOCKING)
	{
		this.m_workingTaskManager.waitUntilFinished(this, syncType);
		return false;
	}
	return true;
};
oFF.WorkingTaskHandle.prototype.processWorkerThread = function()
{
	var task = this.getTask();
	task.processInputOnWorkerThread(this);
};
oFF.WorkingTaskHandle.prototype.processMainThread = function()
{
	var task = this.getTask();
	task.processOutputOnMainThread(this);
};
oFF.WorkingTaskHandle.prototype.isFinished = function()
{
	var task = this.getTask();
	var isFinished = task.isFinishedOnWorkerThread(this);
	var hasNextInputChunk = this.hasNextInputChunk();
	var hasNextOutputChunk = this.hasNextOutputChunk();
	return isFinished && !hasNextInputChunk && !hasNextOutputChunk;
};
oFF.WorkingTaskHandle.prototype.isCancellingRequested = function()
{
	return this.m_isCancellingRequested;
};
oFF.WorkingTaskHandle.prototype.requestCancelling = function()
{
	this.m_isCancellingRequested = true;
};
oFF.WorkingTaskHandle.prototype.getTask = function()
{
	return this.m_task;
};
oFF.WorkingTaskHandle.prototype.getInputChunks = function()
{
	return this.m_inputChunks;
};
oFF.WorkingTaskHandle.prototype.addInputChunk = function(inputChunk)
{
	this.m_inputChunks.add(inputChunk);
};
oFF.WorkingTaskHandle.prototype.hasNextInputChunk = function()
{
	return this.m_inputChunks.size() > 0;
};
oFF.WorkingTaskHandle.prototype.nextInputChunk = function()
{
	var inputChunk = this.m_inputChunks.get(0);
	this.m_inputChunks.removeAt(0);
	return inputChunk;
};
oFF.WorkingTaskHandle.prototype.publishOutputChunk = function(outputChunk)
{
	this.m_outputChunks.add(outputChunk);
};
oFF.WorkingTaskHandle.prototype.hasNextOutputChunk = function()
{
	return this.m_outputChunks.size() > 0;
};
oFF.WorkingTaskHandle.prototype.nextOutputChunk = function()
{
	var outputChunk = this.m_outputChunks.get(0);
	this.m_outputChunks.removeAt(0);
	return outputChunk;
};
oFF.WorkingTaskHandle.prototype.getSyncState = function()
{
	if (this.isFinished())
	{
		return oFF.SyncState.IN_SYNC;
	}
	return oFF.SyncState.PROCESSING;
};

oFF.WorkingTaskManager = function() {};
oFF.WorkingTaskManager.prototype = new oFF.DfSessionContext();
oFF.WorkingTaskManager.prototype._ff_c = "WorkingTaskManager";

oFF.WorkingTaskManager.staticSetup = function()
{
	var clazz = oFF.XClass.create(oFF.WorkingTaskManager);
	oFF.WorkingTaskManagerFactory.registerFactoryViaClass(oFF.WorkingTaskManagerType.SINGLE_THREADED, clazz);
};
oFF.WorkingTaskManager.prototype.m_handles = null;
oFF.WorkingTaskManager.prototype.m_syncState = null;
oFF.WorkingTaskManager.prototype.m_workerThreadNumber = 0;
oFF.WorkingTaskManager.prototype.setupWorkingTaskManager = function(session)
{
	oFF.DfSessionContext.prototype.setupSessionContext.call( this , session);
	this.m_handles = oFF.XList.create();
	this.m_syncState = oFF.SyncState.IN_SYNC;
};
oFF.WorkingTaskManager.prototype.releaseObject = function()
{
	var dispatcher = oFF.Dispatcher.getInstance();
	if (oFF.notNull(dispatcher))
	{
		dispatcher.unregisterProcessingTimeReceiver(this);
	}
	this.m_handles = oFF.XObjectExt.release(this.m_handles);
	this.m_syncState = null;
	oFF.DfSessionContext.prototype.releaseObject.call( this );
};
oFF.WorkingTaskManager.prototype.getType = function()
{
	return oFF.WorkingTaskManagerType.SINGLE_THREADED;
};
oFF.WorkingTaskManager.prototype.createHandle = function(task)
{
	return oFF.WorkingTaskHandle.create(this, task);
};
oFF.WorkingTaskManager.prototype.addHandleToProcessingQueue = function(handle)
{
	if (!this.m_handles.contains(handle))
	{
		this.m_handles.add(handle);
	}
	if (this.m_syncState.isInSync())
	{
		this.m_syncState = oFF.SyncState.OUT_OF_SYNC;
	}
	if (this.m_syncState === oFF.SyncState.OUT_OF_SYNC)
	{
		oFF.Dispatcher.getInstance().registerProcessingTimeReceiver(this);
	}
};
oFF.WorkingTaskManager.prototype.processSynchronization = function(syncType)
{
	for (var i = 0; i < this.m_handles.size(); )
	{
		var taskHandle = this.m_handles.get(i);
		taskHandle.processWorkerThread();
		taskHandle.processMainThread();
		var isFinished = taskHandle.isFinished();
		if (isFinished)
		{
			this.removeHandle(taskHandle);
		}
		else
		{
			i++;
		}
	}
	if (this.m_handles.isEmpty())
	{
		this.m_syncState = oFF.SyncState.IN_SYNC;
	}
	return true;
};
oFF.WorkingTaskManager.prototype.getSyncState = function()
{
	return this.m_syncState;
};
oFF.WorkingTaskManager.prototype.waitUntilFinished = function(handle, syncType)
{
	var isFinished = false;
	while (!isFinished)
	{
		handle.processWorkerThread();
		handle.processMainThread();
		isFinished = handle.isFinished();
	}
	this.removeHandle(handle);
};
oFF.WorkingTaskManager.prototype.removeHandle = function(handle)
{
	this.m_handles.removeElement(handle);
};
oFF.WorkingTaskManager.prototype.getNextWorkerThreadName = function()
{
	var buffer = oFF.XStringBuffer.create();
	buffer.append("WorkerThread");
	buffer.appendInt(this.m_workerThreadNumber);
	this.m_workerThreadNumber = this.m_workerThreadNumber + 1;
	return buffer.toString();
};
oFF.WorkingTaskManager.prototype.setMainSleepTime = function(milliseconds) {};

oFF.ChildSetState = function() {};
oFF.ChildSetState.prototype = new oFF.XConstant();
oFF.ChildSetState.prototype._ff_c = "ChildSetState";

oFF.ChildSetState.NONE = null;
oFF.ChildSetState.INITIAL = null;
oFF.ChildSetState.INCOMPLETE = null;
oFF.ChildSetState.COMPLETE = null;
oFF.ChildSetState.staticSetup = function()
{
	oFF.ChildSetState.NONE = oFF.XConstant.setupName(new oFF.ChildSetState(), "None");
	oFF.ChildSetState.INITIAL = oFF.XConstant.setupName(new oFF.ChildSetState(), "Initial");
	oFF.ChildSetState.INCOMPLETE = oFF.XConstant.setupName(new oFF.ChildSetState(), "Incomplete");
	oFF.ChildSetState.COMPLETE = oFF.XConstant.setupName(new oFF.ChildSetState(), "Complete");
};
oFF.ChildSetState.prototype.needsMoreFetching = function()
{
	return this === oFF.ChildSetState.INITIAL || this === oFF.ChildSetState.INCOMPLETE;
};

oFF.XHierarchyElement = function() {};
oFF.XHierarchyElement.prototype = new oFF.DfNameTextObject();
oFF.XHierarchyElement.prototype._ff_c = "XHierarchyElement";

oFF.XHierarchyElement.createHierarchyElement = function(componentType, name, text)
{
	var newObj = new oFF.XHierarchyElement();
	newObj.setupWithNameText(name, text);
	newObj.m_componentType = componentType;
	return newObj;
};
oFF.XHierarchyElement.prototype.m_componentType = null;
oFF.XHierarchyElement.prototype.getComponentType = function()
{
	return this.m_componentType;
};
oFF.XHierarchyElement.prototype.isNode = function()
{
	return false;
};
oFF.XHierarchyElement.prototype.isLeaf = function()
{
	return !this.isNode();
};
oFF.XHierarchyElement.prototype.getTagValue = function(tagName)
{
	return null;
};
oFF.XHierarchyElement.prototype.getContentElement = function()
{
	return this;
};
oFF.XHierarchyElement.prototype.getContentConstant = function()
{
	return null;
};

oFF.ListenerType = function() {};
oFF.ListenerType.prototype = new oFF.XConstant();
oFF.ListenerType.prototype._ff_c = "ListenerType";

oFF.ListenerType.SPECIFIC = null;
oFF.ListenerType.SYNC_LISTENER = null;
oFF.ListenerType.OLAP_COMPONENT_CHANGED = null;
oFF.ListenerType.SUCCESS_LISTENER = null;
oFF.ListenerType.FAILURE_LISTENER = null;
oFF.ListenerType.staticSetup = function()
{
	oFF.ListenerType.SPECIFIC = oFF.XConstant.setupName(new oFF.ListenerType(), "Specific");
	oFF.ListenerType.SYNC_LISTENER = oFF.XConstant.setupName(new oFF.ListenerType(), "SyncListener");
	oFF.ListenerType.OLAP_COMPONENT_CHANGED = oFF.XConstant.setupName(new oFF.ListenerType(), "OlapComponentChanged");
	oFF.ListenerType.SUCCESS_LISTENER = oFF.XConstant.setupName(new oFF.ListenerType(), "SuccessListener");
	oFF.ListenerType.FAILURE_LISTENER = oFF.XConstant.setupName(new oFF.ListenerType(), "FailureListener");
};

oFF.SyncAction = function() {};
oFF.SyncAction.prototype = new oFF.MessageManager();
oFF.SyncAction.prototype._ff_c = "SyncAction";

oFF.SyncAction.prototype.m_syncState = null;
oFF.SyncAction.prototype.m_syncType = null;
oFF.SyncAction.prototype.m_isSyncCanceled = false;
oFF.SyncAction.prototype.m_actionContext = null;
oFF.SyncAction.prototype.m_dataHardRef = null;
oFF.SyncAction.prototype.m_dataWeakRef = null;
oFF.SyncAction.prototype.m_convertDataToWeak = false;
oFF.SyncAction.prototype.m_listeners = null;
oFF.SyncAction.prototype.m_isInsideListenerCall = false;
oFF.SyncAction.prototype.m_syncChild = null;
oFF.SyncAction.prototype.m_checkWeakConversion = false;
oFF.SyncAction.prototype.setupActionAndRun = function(syncType, listener, customIdentifier, context)
{
	this.setupAction(syncType, listener, customIdentifier, context);
	this.process();
};
oFF.SyncAction.prototype.setupAction = function(syncType, listener, customIdentifier, context)
{
	var session = oFF.isNull(context) ? null : context.getSession();
	this.setupSessionContext(session);
	this.m_syncState = oFF.SyncState.OUT_OF_SYNC;
	this.m_syncType = syncType;
	this.m_listeners = oFF.XList.create();
	this.m_convertDataToWeak = false;
	this.m_isInsideListenerCall = false;
	this.setActionContext(context);
	if (oFF.notNull(listener))
	{
		this.attachListener(listener, oFF.ListenerType.SPECIFIC, customIdentifier);
	}
};
oFF.SyncAction.prototype.releaseObject = function()
{
	if (!this.m_isInsideListenerCall)
	{
		this.m_actionContext = null;
		this.m_dataHardRef = null;
		this.m_dataWeakRef = null;
		this.m_listeners = oFF.XObjectExt.release(this.m_listeners);
		this.m_syncChild = null;
		this.m_syncState = null;
		this.m_syncType = null;
		oFF.MessageManager.prototype.releaseObject.call( this );
	}
};
oFF.SyncAction.prototype.process = function()
{
	if (this.m_syncState === oFF.SyncState.OUT_OF_SYNC)
	{
		var activeSyncType = this.startSyncAndClearErrors(this.m_syncType);
		if (activeSyncType !== oFF.SyncType.DELAYED)
		{
			var continueProcessing = this.processSynchronization(activeSyncType);
			if (!continueProcessing)
			{
				this.endSync();
			}
		}
	}
};
oFF.SyncAction.prototype.processSyncAction = function(syncType, listener, customIdentifier)
{
	this.attachListener(listener, oFF.ListenerType.SPECIFIC, customIdentifier);
	if (this.m_syncState === oFF.SyncState.OUT_OF_SYNC)
	{
		var activeSyncType = this.startSyncAndClearErrors(syncType);
		if (activeSyncType !== oFF.SyncType.DELAYED)
		{
			var continueProcessing = this.processSynchronization(activeSyncType);
			if (!continueProcessing)
			{
				this.endSync();
			}
		}
	}
	return this;
};
oFF.SyncAction.prototype.thenDo = function(successListener, failureListener)
{
	if (oFF.notNull(successListener))
	{
		this.attachListener(successListener, oFF.ListenerType.SUCCESS_LISTENER, null);
	}
	if (oFF.notNull(failureListener))
	{
		this.attachListener(successListener, oFF.ListenerType.FAILURE_LISTENER, null);
	}
};
oFF.SyncAction.prototype.processSynchronization = function(syncType)
{
	return false;
};
oFF.SyncAction.prototype.startSyncAndClearErrors = function(syncType)
{
	this.addProfileStep("processSynchronization");
	this.m_isSyncCanceled = false;
	this.clearMessages();
	var activeSyncType = this.setActiveSyncType(syncType);
	if (syncType !== oFF.SyncType.DELAYED)
	{
		if (this.m_syncState !== oFF.SyncState.PROCESSING)
		{
			if (!this.m_isSyncCanceled)
			{
				this.endProfileStep();
			}
			this.m_syncState = oFF.SyncState.PROCESSING;
		}
	}
	return activeSyncType;
};
oFF.SyncAction.prototype.getActiveSyncType = function()
{
	return this.m_syncType;
};
oFF.SyncAction.prototype.setActiveSyncType = function(syncType)
{
	if (syncType === oFF.SyncType.REGISTER || syncType === oFF.SyncType.UNREGISTER)
	{
		throw oFF.XException.createIllegalArgumentException("Register/Unregister not supported here");
	}
	if (oFF.isNull(this.m_syncType) || this.m_syncType === oFF.SyncType.DELAYED)
	{
		if (oFF.isNull(syncType))
		{
			var session = this.getSession();
			this.m_syncType = oFF.isNull(session) ? oFF.SyncType.BLOCKING : session.getDefaultSyncType();
		}
		else
		{
			this.m_syncType = syncType;
		}
	}
	return this.m_syncType;
};
oFF.SyncAction.prototype.cancelSynchronization = function()
{
	this.endProfileStep();
	this.m_isSyncCanceled = true;
	var cancellingChild = this.getChildSynchronizer();
	if (oFF.notNull(cancellingChild))
	{
		cancellingChild.abort();
		cancellingChild.cancelSynchronization();
	}
	this.endSync();
};
oFF.SyncAction.prototype.isSyncCanceled = function()
{
	return this.m_isSyncCanceled;
};
oFF.SyncAction.prototype.onInSync = function()
{
	if (!this.m_isInsideListenerCall)
	{
		this.m_isInsideListenerCall = true;
		if (oFF.XCollectionUtils.hasElements(this.m_listeners))
		{
			this.m_checkWeakConversion = true;
			if (this.getActiveSyncType() === oFF.SyncType.NON_BLOCKING)
			{
				var session = this.getSession();
				if (oFF.isNull(session))
				{
					this.callListeners(true);
				}
				else
				{
					if (session.addToListenerQueue(this) === false)
					{
						this.callListeners(true);
					}
				}
			}
			else
			{
				this.callListeners(true);
			}
		}
		this.m_isInsideListenerCall = false;
	}
};
oFF.SyncAction.prototype.getSyncState = function()
{
	return this.m_syncState;
};
oFF.SyncAction.prototype.endSync = function()
{
	if (this.m_syncState.isNotInSync())
	{
		this.endProfileStep();
		this.m_syncState = this.hasErrors() ? oFF.SyncState.IN_SYNC_WITH_ERROR : oFF.SyncState.IN_SYNC;
		this.onInSync();
	}
	this.setActiveSyncType(null);
};
oFF.SyncAction.prototype.resetSyncState = function()
{
	this._resetSyncStateInternal(false);
};
oFF.SyncAction.prototype.enforceResetSyncState = function()
{
	this._resetSyncStateInternal(true);
};
oFF.SyncAction.prototype._resetSyncStateInternal = function(enforce)
{
	if (enforce || this.m_syncState.isInSync())
	{
		this.m_syncState = oFF.SyncState.OUT_OF_SYNC;
		this.m_isSyncCanceled = false;
		this.m_syncType = null;
		this.clearMessages();
		if (oFF.notNull(this.m_listeners))
		{
			this.m_listeners.clear();
		}
		this.m_syncChild = null;
		this.m_dataHardRef = null;
		this.m_dataWeakRef = null;
	}
	if (this.m_syncState === oFF.SyncState.PROCESSING)
	{
		throw oFF.XException.createIllegalStateException("Action is still in processing, it cannot be reset.");
	}
};
oFF.SyncAction.prototype.attachAllListeners = function(listenerPairs)
{
	for (var i = 0; i < listenerPairs.size(); i++)
	{
		var pair = listenerPairs.get(i);
		this.attachListener(pair.getFirstObject(), oFF.ListenerType.SPECIFIC, pair.getSecondObject());
	}
};
oFF.SyncAction.prototype.attachListener = function(listener, type, customIdentifier)
{
	if (oFF.notNull(listener) && oFF.notNull(this.m_listeners))
	{
		var pair = oFF.SyncActionListenerPair.create(listener, type, customIdentifier);
		var isExisting = false;
		for (var i = 0; i < this.m_listeners.size(); i++)
		{
			var existingPair = this.m_listeners.get(i);
			if (existingPair.getListener() === listener)
			{
				if (existingPair.getCustomIdentifier() !== customIdentifier)
				{
					throw oFF.XException.createIllegalStateException("Twice listener registration with different custom identifiers");
				}
				isExisting = true;
			}
		}
		if (!isExisting)
		{
			this.m_listeners.add(pair);
		}
	}
	if (this.m_syncState.isInSync())
	{
		this.onInSync();
	}
};
oFF.SyncAction.prototype.detachListener = function(listener)
{
	if (oFF.notNull(this.m_listeners))
	{
		for (var i = 0; i < this.m_listeners.size(); i++)
		{
			var pair = this.m_listeners.get(i);
			if (pair.getListener() === listener)
			{
				this.m_listeners.removeAt(i);
				break;
			}
		}
	}
};
oFF.SyncAction.prototype.callListeners = function(allowNewListeners)
{
	var moreListeners = false;
	this.beforeListenerCall();
	if (oFF.notNull(this.m_listeners))
	{
		var sizeOfListeners = this.m_listeners.size();
		var offset = 0;
		while (sizeOfListeners > offset)
		{
			var pair = this.m_listeners.get(offset);
			this.m_listeners.removeAt(offset);
			var listener = pair.getListener();
			oFF.XObjectExt.assertNotNullExt(listener, "Listener is not valid. Might be a reference counter problem");
			var data = this.getData();
			var customIdentifier = pair.getCustomIdentifier();
			var listenerType = pair.getListenerType();
			if (!oFF.XClass.isXObjectReleased(listener))
			{
				if (listenerType === oFF.ListenerType.FAILURE_LISTENER)
				{
					if (this.hasErrors())
					{
						oFF.XClass.callFunction(listener, this, data, customIdentifier);
					}
				}
				else if (listenerType === oFF.ListenerType.SUCCESS_LISTENER)
				{
					if (this.isValid())
					{
						oFF.XClass.callFunction(listener, this, data, customIdentifier);
					}
				}
				else
				{
					if (!oFF.XClass.callFunction(listener, this, data, customIdentifier))
					{
						this.callTypedListener(this, listenerType, listener, data, customIdentifier);
					}
				}
			}
			oFF.XObjectExt.release(pair);
			if (allowNewListeners)
			{
				sizeOfListeners = this.m_listeners.size();
			}
			else
			{
				--sizeOfListeners;
			}
		}
		if (oFF.notNull(this.m_listeners))
		{
			sizeOfListeners = this.m_listeners.size();
			if (sizeOfListeners === 0)
			{
				if (this.m_checkWeakConversion)
				{
					this.checkConversion();
					this.m_checkWeakConversion = false;
				}
			}
			else
			{
				moreListeners = true;
			}
		}
	}
	return moreListeners;
};
oFF.SyncAction.prototype.beforeListenerCall = function() {};
oFF.SyncAction.prototype.callTypedListener = function(extResult, type, listener, data, customIdentifier)
{
	if (type === oFF.ListenerType.SPECIFIC)
	{
		var specificListener = listener;
		this.callListener(this, specificListener, data, customIdentifier);
	}
	else if (type === oFF.ListenerType.SYNC_LISTENER)
	{
		var syncListener = listener;
		syncListener.onSynchronized(this, data, customIdentifier);
	}
};
oFF.SyncAction.prototype.callListener = oFF.noSupport;
oFF.SyncAction.prototype.getData = function()
{
	if (oFF.notNull(this.m_dataWeakRef))
	{
		return oFF.XWeakReferenceUtil.getHardRef(this.m_dataWeakRef);
	}
	var data = this.m_dataHardRef;
	if (!this.m_isInsideListenerCall)
	{
		this.checkConversion();
	}
	return data;
};
oFF.SyncAction.prototype.setData = function(data)
{
	var otherData = data;
	if (otherData === this)
	{
		this.m_dataWeakRef = oFF.XWeakReferenceUtil.getWeakRef(data);
	}
	else
	{
		this.m_dataHardRef = data;
	}
};
oFF.SyncAction.prototype.checkConversion = function()
{
	if (this.m_convertDataToWeak)
	{
		this.m_dataWeakRef = oFF.XWeakReferenceUtil.getWeakRef(this.m_dataHardRef);
		this.m_dataHardRef = null;
	}
};
oFF.SyncAction.prototype.setAutoConvertDataToWeakRef = function(convertDataToWeakRef)
{
	this.m_convertDataToWeak = convertDataToWeakRef;
};
oFF.SyncAction.prototype.getActionContext = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_actionContext);
};
oFF.SyncAction.prototype.setActionContext = function(parent)
{
	this.m_actionContext = oFF.XWeakReferenceUtil.getWeakRef(parent);
};
oFF.SyncAction.prototype.getChildSynchronizer = function()
{
	return this.m_syncChild;
};
oFF.SyncAction.prototype.setSyncChild = function(syncChild)
{
	this.m_syncChild = syncChild;
};
oFF.SyncAction.prototype.abort = function() {};
oFF.SyncAction.prototype.toString = function()
{
	var buffer = oFF.XStringBuffer.create();
	buffer.append("SyncState: ").append(this.m_syncState.toString());
	var activeSyncType = this.getActiveSyncType();
	if (oFF.notNull(activeSyncType))
	{
		buffer.appendNewLine();
		buffer.append("SyncType: ").append(activeSyncType.toString());
	}
	var summary = this.getSummary();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(summary))
	{
		buffer.append(summary);
	}
	return buffer.toString();
};

oFF.XCacheProviderFile = function() {};
oFF.XCacheProviderFile.prototype = new oFF.DfXCacheProvider();
oFF.XCacheProviderFile.prototype._ff_c = "XCacheProviderFile";

oFF.XCacheProviderFile.create = function(session)
{
	var newObj = new oFF.XCacheProviderFile();
	newObj.setupSessionContext(session);
	return newObj;
};
oFF.XCacheProviderFile.prototype.m_directory = null;
oFF.XCacheProviderFile.prototype.processOpen = function(syncType, listener, customIdentifier, properties)
{
	return oFF.XCacheProviderFileOpenAction.createAndRun(syncType, listener, customIdentifier, this, properties);
};
oFF.XCacheProviderFile.prototype.setDirectory = function(directory)
{
	this.m_directory = directory;
};
oFF.XCacheProviderFile.prototype.writeElementToCache = function(namespace, name, element, maxCount)
{
	if (oFF.notNull(element))
	{
		var file = this.createFile(namespace, name, ".json", true);
		if (oFF.notNull(file))
		{
			var cache = element.getStringRepresentation();
			var ba = oFF.XByteArray.convertFromString(cache);
			file.saveByteArray(ba);
		}
	}
};
oFF.XCacheProviderFile.prototype.readElementFromCache = function(namespace, name, validityTime)
{
	var result = null;
	var file = this.createFile(namespace, name, ".json", false);
	if (oFF.notNull(file) && file.isExisting() && file.isFile())
	{
		var content = file.load();
		result = content.getJsonContent();
	}
	if (oFF.notNull(result))
	{
		this.incHit(namespace);
	}
	return result;
};
oFF.XCacheProviderFile.prototype.writeStringToCache = function(namespace, name, stringValue, maxCount)
{
	if (oFF.notNull(stringValue))
	{
		var file = this.createFile(namespace, name, ".txt", true);
		if (oFF.notNull(file))
		{
			var ba = oFF.XByteArray.convertFromString(stringValue);
			file.saveByteArray(ba);
		}
	}
};
oFF.XCacheProviderFile.prototype.readStringFromCache = function(namespace, name, validityTime)
{
	var result = null;
	var file = this.createFile(namespace, name, ".txt", false);
	if (oFF.notNull(file) && file.isExisting() && file.isFile())
	{
		var content = file.load();
		if (oFF.notNull(content))
		{
			result = content.getString();
		}
	}
	if (oFF.notNull(result))
	{
		this.incHit(namespace);
	}
	return result;
};
oFF.XCacheProviderFile.prototype.clearCache = function(namespace)
{
	if (oFF.notNull(this.m_directory))
	{
		var targetFolder;
		if (oFF.isNull(namespace))
		{
			targetFolder = this.m_directory;
		}
		else
		{
			targetFolder = this.m_directory.newChild(namespace);
		}
		targetFolder.deleteRecursive();
	}
};
oFF.XCacheProviderFile.prototype.createFile = function(namespace, name, fileExt, prepareForWrite)
{
	var file = null;
	if (oFF.notNull(this.m_directory) && oFF.notNull(name) && this.m_directory.getFileSystemType() !== null)
	{
		var parentFolder;
		if (oFF.isNull(namespace))
		{
			parentFolder = this.m_directory;
		}
		else
		{
			var childSequence = oFF.XStringTokenizer.splitString(namespace, this.getDelimiter());
			var currentFile = this.m_directory;
			for (var i = 0; i < childSequence.size(); i++)
			{
				var childName = childSequence.get(i);
				currentFile = currentFile.newChild(childName);
			}
			parentFolder = currentFile;
		}
		if (prepareForWrite)
		{
			parentFolder.mkdirs();
		}
		var fileExtension = fileExt;
		if (oFF.isNull(fileExtension))
		{
			fileExtension = ".json";
		}
		file = parentFolder.newChild(oFF.XStringUtils.concatenate3("ffc_", name, fileExtension));
		if (prepareForWrite && file.isExisting())
		{
			file.deleteFile();
		}
	}
	return file;
};
oFF.XCacheProviderFile.prototype.getDelimiter = function()
{
	return "/";
};

oFF.XCacheProviderInMemory = function() {};
oFF.XCacheProviderInMemory.prototype = new oFF.DfXCacheProvider();
oFF.XCacheProviderInMemory.prototype._ff_c = "XCacheProviderInMemory";

oFF.XCacheProviderInMemory.create = function(session)
{
	var newObj = new oFF.XCacheProviderInMemory();
	newObj.setupSessionContext(session);
	return newObj;
};
oFF.XCacheProviderInMemory.prototype.m_elementMap = null;
oFF.XCacheProviderInMemory.prototype.setupSessionContext = function(session)
{
	oFF.DfXCacheProvider.prototype.setupSessionContext.call( this , session);
	this.m_elementMap = oFF.XHashMapByString.create();
};
oFF.XCacheProviderInMemory.prototype.releaseObject = function()
{
	this.m_elementMap = null;
	oFF.DfXCacheProvider.prototype.releaseObject.call( this );
};
oFF.XCacheProviderInMemory.prototype.putString = function(name, stringValue)
{
	this.m_elementMap.put(name, oFF.XStringValue.create(stringValue));
};
oFF.XCacheProviderInMemory.prototype.getStringByKey = function(name)
{
	var obj = this.m_elementMap.getByKey(name);
	var strObj = obj;
	return strObj.getString();
};
oFF.XCacheProviderInMemory.prototype.removeElementFromCacheInternal = function(name)
{
	this.m_elementMap.remove(name);
};
oFF.XCacheProviderInMemory.prototype.clearCacheInternal = function(namespace)
{
	var prefix = oFF.XStringUtils.concatenate2(namespace, ".");
	var keys = this.m_elementMap.getKeysAsIteratorOfString();
	while (keys.hasNext())
	{
		var key = keys.next();
		if (oFF.XString.startsWith(key, prefix))
		{
			this.m_elementMap.remove(key);
		}
	}
};

oFF.CompressionType = function() {};
oFF.CompressionType.prototype = new oFF.XConstant();
oFF.CompressionType.prototype._ff_c = "CompressionType";

oFF.CompressionType.NONE = null;
oFF.CompressionType.GZIP = null;
oFF.CompressionType.staticSetup = function()
{
	oFF.CompressionType.NONE = oFF.XConstant.setupName(new oFF.CompressionType(), "None");
	oFF.CompressionType.GZIP = oFF.XConstant.setupName(new oFF.CompressionType(), "Gzip");
};

oFF.PathFormat = function() {};
oFF.PathFormat.prototype = new oFF.XConstant();
oFF.PathFormat.prototype._ff_c = "PathFormat";

oFF.PathFormat.AUTO_DETECT = null;
oFF.PathFormat.NORMALIZED = null;
oFF.PathFormat.NATIVE = null;
oFF.PathFormat.URL = null;
oFF.PathFormat.staticSetup = function()
{
	oFF.PathFormat.AUTO_DETECT = oFF.XConstant.setupName(new oFF.PathFormat(), "AutoDetect");
	oFF.PathFormat.NORMALIZED = oFF.XConstant.setupName(new oFF.PathFormat(), "Normalized");
	oFF.PathFormat.NATIVE = oFF.XConstant.setupName(new oFF.PathFormat(), "Native");
	oFF.PathFormat.URL = oFF.XConstant.setupName(new oFF.PathFormat(), "Url");
};

oFF.XFileSystemType = function() {};
oFF.XFileSystemType.prototype = new oFF.XConstant();
oFF.XFileSystemType.prototype._ff_c = "XFileSystemType";

oFF.XFileSystemType.OS = null;
oFF.XFileSystemType.WEBDAV = null;
oFF.XFileSystemType.SIMPLE_WEB = null;
oFF.XFileSystemType.REMOTE_WEB = null;
oFF.XFileSystemType.VFS = null;
oFF.XFileSystemType.PRG = null;
oFF.XFileSystemType.IN_MEMORY = null;
oFF.XFileSystemType.staticSetup = function()
{
	oFF.XFileSystemType.OS = oFF.XFileSystemType.create("OperatingSystem", oFF.ProtocolType.FILE);
	oFF.XFileSystemType.WEBDAV = oFF.XFileSystemType.create("WebDAV", null);
	oFF.XFileSystemType.SIMPLE_WEB = oFF.XFileSystemType.create("SimpleWeb", null);
	oFF.XFileSystemType.REMOTE_WEB = oFF.XFileSystemType.create("RemoteWeb", null);
	oFF.XFileSystemType.VFS = oFF.XFileSystemType.create("Vfs", oFF.ProtocolType.VFS);
	oFF.XFileSystemType.PRG = oFF.XFileSystemType.create("Prg", oFF.ProtocolType.PRG);
	oFF.XFileSystemType.IN_MEMORY = oFF.XFileSystemType.create("InMemory", null);
};
oFF.XFileSystemType.create = function(name, protocolType)
{
	var newObj = oFF.XConstant.setupName(new oFF.XFileSystemType(), name);
	newObj.m_protocolType = protocolType;
	return newObj;
};
oFF.XFileSystemType.prototype.m_protocolType = null;
oFF.XFileSystemType.prototype.getProtocolType = function()
{
	return this.m_protocolType;
};

oFF.DfXFileSystem = function() {};
oFF.DfXFileSystem.prototype = new oFF.DfXFileSystemGeneric();
oFF.DfXFileSystem.prototype._ff_c = "DfXFileSystem";

oFF.DfXFileSystem.prototype.newFile = function(session, vfsUri, targetUri)
{
	return oFF.XFileClassic.createExt(session, this, vfsUri, targetUri);
};
oFF.DfXFileSystem.prototype.mkdirExt = function(file, includeParentDirs)
{
	var messages;
	if (includeParentDirs === true)
	{
		messages = this.mkdirs(file.getNativePath());
	}
	else
	{
		messages = this.mkdir(file.getNativePath());
	}
	file.addAllMessages(messages);
};
oFF.DfXFileSystem.prototype.mkdir = oFF.noSupport;
oFF.DfXFileSystem.prototype.mkdirs = oFF.noSupport;
oFF.DfXFileSystem.prototype.getChildrenExt = function(file)
{
	var absoluteNativePathList = this.getChildren(file.getNativePath());
	var childNameList = oFF.XListOfString.create();
	var nativeSlash = this.getNativeSlash();
	var currentName;
	for (var i = 0; i < absoluteNativePathList.size(); i++)
	{
		var currentPath = absoluteNativePathList.get(i);
		var index = oFF.XString.lastIndexOf(currentPath, nativeSlash);
		if (index === oFF.XString.size(currentPath) - 1)
		{
			var noEndSlash = oFF.XString.substring(currentPath, 0, index);
			currentName = oFF.XStringUtils.concatenate2(noEndSlash, "/");
		}
		else
		{
			currentName = oFF.XString.substring(currentPath, index + 1, -1);
		}
		childNameList.add(currentName);
	}
	return childNameList;
};
oFF.DfXFileSystem.prototype.getChildren = oFF.noSupport;
oFF.DfXFileSystem.prototype.getRoots = oFF.noSupport;
oFF.DfXFileSystem.prototype.setWritableExt = function(file, writable, ownerOnly)
{
	return this.setWritable(file.getNativePath(), writable, ownerOnly);
};
oFF.DfXFileSystem.prototype.setWritable = oFF.noSupport;
oFF.DfXFileSystem.prototype.saveExt = function(file, content, compression)
{
	var msg;
	var byteArray = content.getByteArray();
	var nativePath = file.getNativePath();
	if (compression === oFF.CompressionType.NONE)
	{
		msg = this.save(nativePath, byteArray);
	}
	else
	{
		msg = this.saveGzipped(nativePath, byteArray);
	}
	file.addAllMessages(msg);
};
oFF.DfXFileSystem.prototype.save = oFF.noSupport;
oFF.DfXFileSystem.prototype.saveGzipped = oFF.noSupport;
oFF.DfXFileSystem.prototype.deleteFileExt = function(file)
{
	var msg = this.deleteFile(file.getNativePath());
	file.addAllMessages(msg);
};
oFF.DfXFileSystem.prototype.deleteFile = oFF.noSupport;
oFF.DfXFileSystem.prototype.renameToExt = function(file, targetFile)
{
	var msg = this.renameTo(file.getNativePath(), targetFile.getNativePath());
	targetFile.addAllMessages(msg);
};
oFF.DfXFileSystem.prototype.renameTo = oFF.noSupport;
oFF.DfXFileSystem.prototype.getLastModifiedTimestampExt = function(file)
{
	return this.getLastModifiedTimestamp(file.getNativePath());
};
oFF.DfXFileSystem.prototype.getLastModifiedTimestamp = oFF.noSupport;
oFF.DfXFileSystem.prototype.loadGzipped = oFF.noSupport;
oFF.DfXFileSystem.prototype.loadExt2 = function(file, compression)
{
	var content;
	if (compression === oFF.CompressionType.NONE)
	{
		content = this.loadExt(file.getNativePath());
	}
	else
	{
		content = this.loadGzipped(file.getNativePath());
	}
	file.setFileContent(content);
	file.addAllMessages(content.getMessageCollection());
};
oFF.DfXFileSystem.prototype.loadExt = oFF.noSupport;
oFF.DfXFileSystem.prototype.convertToNativeFilePath = function(targetUri)
{
	var normalizedPath = targetUri.getPath();
	var nativePath = normalizedPath;
	if (this.getFileSystemType() === oFF.XFileSystemType.OS)
	{
		if (oFF.notNull(normalizedPath) && oFF.XString.isEqual(oFF.XFile.NATIVE_SLASH, "/") === false)
		{
			if (oFF.XString.startsWith(nativePath, "/"))
			{
				nativePath = oFF.XString.substring(nativePath, 1, -1);
			}
			nativePath = oFF.XString.replace(nativePath, "/", oFF.XFile.NATIVE_SLASH);
		}
	}
	return nativePath;
};
oFF.DfXFileSystem.prototype.processExecute = oFF.noSupport;
oFF.DfXFileSystem.prototype.isWriteableExt = function(file)
{
	return this.isWriteable(file.getNativePath());
};
oFF.DfXFileSystem.prototype.isWriteable = function(nativePath)
{
	return false;
};
oFF.DfXFileSystem.prototype.isReadableExt = function(file)
{
	return this.isReadable(file.getNativePath());
};
oFF.DfXFileSystem.prototype.isReadable = function(nativePath)
{
	return false;
};
oFF.DfXFileSystem.prototype.isExecutableExt = function(file)
{
	return this.isExecutable(file.getNativePath());
};
oFF.DfXFileSystem.prototype.isExecutable = function(nativePath)
{
	return false;
};
oFF.DfXFileSystem.prototype.isExistingExt = function(file)
{
	return this.isExisting(file.getNativePath());
};
oFF.DfXFileSystem.prototype.isExisting = function(nativePath)
{
	return false;
};
oFF.DfXFileSystem.prototype.isHiddenExt = function(file)
{
	return this.isHidden(file.getNativePath());
};
oFF.DfXFileSystem.prototype.isHidden = function(nativePath)
{
	return false;
};
oFF.DfXFileSystem.prototype.isDirectoryExt = function(file)
{
	return this.isDirectory(file.getNativePath());
};
oFF.DfXFileSystem.prototype.isDirectory = function(nativePath)
{
	return false;
};
oFF.DfXFileSystem.prototype.isFileExt = function(file)
{
	return this.isFile(file.getNativePath());
};
oFF.DfXFileSystem.prototype.isFile = function(nativePath)
{
	return !this.isDirectory(nativePath);
};
oFF.DfXFileSystem.prototype.getFileType = function(file)
{
	if (this.isDirectoryExt(file))
	{
		return oFF.XFileType.DIR;
	}
	else
	{
		return oFF.XFileType.FILE;
	}
};

oFF.SessionCarrierType = function() {};
oFF.SessionCarrierType.prototype = new oFF.XConstant();
oFF.SessionCarrierType.prototype._ff_c = "SessionCarrierType";

oFF.SessionCarrierType.NONE = null;
oFF.SessionCarrierType.COOKIE = null;
oFF.SessionCarrierType.SAP_URL_REWRITING = null;
oFF.SessionCarrierType.SAP_CONTEXT_ID_HEADER = null;
oFF.SessionCarrierType.s_lookup = null;
oFF.SessionCarrierType.staticSetup = function()
{
	oFF.SessionCarrierType.s_lookup = oFF.XHashMapByString.create();
	oFF.SessionCarrierType.NONE = oFF.SessionCarrierType.create("NONE");
	oFF.SessionCarrierType.COOKIE = oFF.SessionCarrierType.create("COOKIE");
	oFF.SessionCarrierType.SAP_URL_REWRITING = oFF.SessionCarrierType.create("SAP_URL_REWRITING");
	oFF.SessionCarrierType.SAP_CONTEXT_ID_HEADER = oFF.SessionCarrierType.create("SAP_CONTEXT_ID_HEADER");
};
oFF.SessionCarrierType.create = function(name)
{
	var pt = oFF.XConstant.setupName(new oFF.SessionCarrierType(), name);
	oFF.SessionCarrierType.s_lookup.put(name, pt);
	return pt;
};
oFF.SessionCarrierType.lookup = function(name)
{
	return oFF.SessionCarrierType.s_lookup.getByKey(name);
};

oFF.XConnection = function() {};
oFF.XConnection.prototype = new oFF.ConnectionPersonalization();
oFF.XConnection.prototype._ff_c = "XConnection";

oFF.XConnection.prototype.m_alias = null;
oFF.XConnection.prototype.m_host = null;
oFF.XConnection.prototype.m_port = 0;
oFF.XConnection.prototype.m_scheme = null;
oFF.XConnection.prototype.m_path = null;
oFF.XConnection.prototype.setup = function()
{
	this.setAuthenticationType(oFF.AuthenticationType.NONE);
};
oFF.XConnection.prototype.releaseObject = function()
{
	this.m_host = null;
	this.m_scheme = null;
	this.m_path = null;
	this.m_alias = null;
	oFF.ConnectionPersonalization.prototype.releaseObject.call( this );
};
oFF.XConnection.prototype.setFromConnection = function(connection)
{
	oFF.XConnectHelper.copyConnection(connection, this);
};
oFF.XConnection.prototype.getHost = function()
{
	return this.m_host;
};
oFF.XConnection.prototype.setHost = function(host)
{
	this.m_host = host;
};
oFF.XConnection.prototype.getScheme = function()
{
	return this.m_scheme;
};
oFF.XConnection.prototype.setScheme = function(scheme)
{
	this.m_scheme = scheme;
};
oFF.XConnection.prototype.getProtocolType = function()
{
	if (oFF.isNull(this.m_scheme))
	{
		return null;
	}
	return oFF.ProtocolType.lookup(this.m_scheme);
};
oFF.XConnection.prototype.setProtocolType = function(type)
{
	if (oFF.notNull(type))
	{
		this.m_scheme = type.getName();
	}
	else
	{
		this.m_scheme = null;
	}
};
oFF.XConnection.prototype.getPort = function()
{
	return this.m_port;
};
oFF.XConnection.prototype.setPort = function(port)
{
	this.m_port = port;
};
oFF.XConnection.prototype.setPath = function(path)
{
	this.m_path = path;
};
oFF.XConnection.prototype.getPath = function()
{
	return this.m_path;
};
oFF.XConnection.prototype.getFileName = function()
{
	var name = null;
	var path = this.getPath();
	if (oFF.notNull(path))
	{
		var endsWithSlash = oFF.XString.endsWith(path, "/");
		if (endsWithSlash)
		{
			path = oFF.XStringUtils.stripRight(path, 1);
		}
		var pathElements = oFF.XStringTokenizer.splitString(path, "/");
		var elementCount = pathElements.size();
		name = pathElements.get(elementCount - 1);
	}
	return name;
};
oFF.XConnection.prototype.getParentPath = function()
{
	var path = this.getPath();
	if (oFF.notNull(path))
	{
		var endsWithSlash = oFF.XString.endsWith(path, "/");
		if (endsWithSlash)
		{
			path = oFF.XStringUtils.stripRight(path, 1);
		}
		var parentIndex = oFF.XString.lastIndexOf(path, "/");
		if (parentIndex !== -1)
		{
			path = oFF.XString.substring(path, 0, parentIndex);
		}
		else
		{
			path = null;
		}
	}
	return path;
};
oFF.XConnection.prototype.getUriString = function()
{
	return this.getUrl();
};
oFF.XConnection.prototype.getUrlString = function()
{
	return this.getUrl();
};
oFF.XConnection.prototype.getUrl = function()
{
	return oFF.XUri.getUrlStringStatic(this, null, true, true, true, true, true, true, true, true);
};
oFF.XConnection.prototype.getUriStringWithoutAuthentication = function()
{
	return this.getUrlStringWithoutAuthentication();
};
oFF.XConnection.prototype.getUrlStringWithoutAuthentication = function()
{
	return oFF.XUri.getUrlStringStatic(this, null, true, false, false, false, true, true, true, true);
};
oFF.XConnection.prototype.getUriStringExt = function(withScheme, withUser, withPwd, withAuthenticationType, withHostPort, withPath, withQuery, withFragment)
{
	return this.getUrlStringExt(withScheme, withUser, withPwd, withAuthenticationType, withHostPort, withPath, withQuery, withFragment);
};
oFF.XConnection.prototype.getUrlStringExt = function(withScheme, withUser, withPwd, withAuthenticationType, withHostPort, withPath, withQuery, withFragment)
{
	return oFF.XUri.getUrlStringStatic(this, null, withScheme, withUser, withPwd, withAuthenticationType, withHostPort, withPath, withQuery, withFragment);
};
oFF.XConnection.prototype.getAlias = function()
{
	return this.m_alias;
};
oFF.XConnection.prototype.setAlias = function(alias)
{
	this.m_alias = alias;
};
oFF.XConnection.prototype.normalizePath = function(enforceDirectory)
{
	var messages = oFF.MessageManagerSimple.createMessageManager();
	if (oFF.notNull(this.m_path))
	{
		if (oFF.XString.startsWith(this.m_path, "/"))
		{
			var elements = oFF.XStringTokenizer.splitString(this.m_path, "/");
			for (var i = 0; i < elements.size(); )
			{
				var element = elements.get(i);
				if (oFF.XString.isEqual(".", element))
				{
					if (i === elements.size() - 1)
					{
						elements.removeAt(i);
						elements.add("");
					}
					else
					{
						elements.removeAt(i);
					}
				}
				else if (oFF.XString.isEqual("..", element))
				{
					if (elements.size() < 2)
					{
						messages.addError(0, "Path denoting to a parent that is above the root");
						break;
					}
					else if (i === 1)
					{
						messages.addError(0, "Path denoting to a parent is right under the root");
						break;
					}
					i--;
					elements.removeAt(i);
					elements.removeAt(i);
				}
				else
				{
					i++;
				}
			}
			if (messages.isValid())
			{
				var newPath = oFF.XStringBuffer.create();
				if (elements.size() === 0)
				{
					newPath.append("/");
				}
				else
				{
					for (var k = 0; k < elements.size(); k++)
					{
						if (k > 0)
						{
							newPath.append("/");
						}
						newPath.append(elements.get(k));
					}
				}
				if (enforceDirectory && oFF.XString.endsWith(newPath.toString(), "/") === false)
				{
					newPath.append("/");
				}
				this.m_path = newPath.toString();
			}
		}
		else
		{
			messages.addError(0, "Path is not starting with '/' and cannot be normalized");
		}
	}
	return messages;
};
oFF.XConnection.prototype.toString = function()
{
	var buffer = oFF.XStringBuffer.create();
	buffer.append("Protocol: ").appendLine(this.m_scheme);
	buffer.append("Host: ").appendLine(this.m_host);
	buffer.append("Port: ").appendInt(this.m_port).appendNewLine();
	buffer.append("Path: ").appendLine(this.m_path);
	buffer.append("Alias: ").appendLine(this.m_alias);
	buffer.append("User: ").appendLine(this.getUser());
	buffer.append("Authentication: ").appendLine(this.getAuthenticationType().getName());
	return buffer.toString();
};

oFF.AuthenticationType = function() {};
oFF.AuthenticationType.prototype = new oFF.XConstant();
oFF.AuthenticationType.prototype._ff_c = "AuthenticationType";

oFF.AuthenticationType.NONE = null;
oFF.AuthenticationType.BASIC = null;
oFF.AuthenticationType.BEARER = null;
oFF.AuthenticationType.CERTIFICATES = null;
oFF.AuthenticationType.KERBEROS = null;
oFF.AuthenticationType.SECURE_LOGIN_PROFILE = null;
oFF.AuthenticationType.SAML_WITH_PASSWORD = null;
oFF.AuthenticationType.SAML_WITH_CERTIFICATE = null;
oFF.AuthenticationType.SAML_WITH_KERBEROS = null;
oFF.AuthenticationType.SAML_WITH_BEARER = null;
oFF.AuthenticationType.SCP_OPEN_CONNECTORS = null;
oFF.AuthenticationType.SCP_OAUTH_BEARER = null;
oFF.AuthenticationType.XHR = null;
oFF.AuthenticationType.s_instances = null;
oFF.AuthenticationType.staticSetup = function()
{
	oFF.AuthenticationType.s_instances = oFF.XHashMapByString.create();
	oFF.AuthenticationType.NONE = oFF.AuthenticationType.create("NONE", false, false);
	oFF.AuthenticationType.BASIC = oFF.AuthenticationType.create("BASIC", true, true);
	oFF.AuthenticationType.BEARER = oFF.AuthenticationType.create("BEARER", false, false);
	oFF.AuthenticationType.CERTIFICATES = oFF.AuthenticationType.create("CERTIFICATES", false, false);
	oFF.AuthenticationType.KERBEROS = oFF.AuthenticationType.create("KERBEROS", true, false);
	oFF.AuthenticationType.SECURE_LOGIN_PROFILE = oFF.AuthenticationType.create("SECURE_LOGIN_PROFILE", false, false);
	oFF.AuthenticationType.SAML_WITH_PASSWORD = oFF.AuthenticationType.create("SAML_WITH_PASSWORD", true, true);
	oFF.AuthenticationType.SAML_WITH_CERTIFICATE = oFF.AuthenticationType.create("SAML_WITH_CERTIFICATE", false, false);
	oFF.AuthenticationType.SAML_WITH_KERBEROS = oFF.AuthenticationType.create("SAML_WITH_KERBEROS", false, false);
	oFF.AuthenticationType.SAML_WITH_BEARER = oFF.AuthenticationType.create("SAML_WITH_BEARER", false, false);
	oFF.AuthenticationType.SCP_OPEN_CONNECTORS = oFF.AuthenticationType.create("SCP_OPEN_CONNECTORS", true, false);
	oFF.AuthenticationType.SCP_OAUTH_BEARER = oFF.AuthenticationType.create("SCP_OAUTH_BEARER", false, false);
	oFF.AuthenticationType.XHR = oFF.AuthenticationType.create("XHR", false, false);
};
oFF.AuthenticationType.create = function(name, hasUserName, hasPassword)
{
	var newConstant = new oFF.AuthenticationType();
	newConstant._setupInternal(name);
	newConstant.m_requiresUserName = hasUserName;
	newConstant.m_requiresPassword = hasPassword;
	oFF.AuthenticationType.s_instances.put(name, newConstant);
	return newConstant;
};
oFF.AuthenticationType.lookup = function(name)
{
	return oFF.AuthenticationType.s_instances.getByKey(name);
};
oFF.AuthenticationType.prototype.m_requiresUserName = false;
oFF.AuthenticationType.prototype.m_requiresPassword = false;
oFF.AuthenticationType.prototype.hasUserName = function()
{
	return this.m_requiresUserName;
};
oFF.AuthenticationType.prototype.hasPassword = function()
{
	return this.m_requiresPassword;
};
oFF.AuthenticationType.prototype.isSaml = function()
{
	return this === oFF.AuthenticationType.SAML_WITH_PASSWORD || this === oFF.AuthenticationType.SAML_WITH_CERTIFICATE || this === oFF.AuthenticationType.SAML_WITH_KERBEROS;
};

oFF.ProtocolType = function() {};
oFF.ProtocolType.prototype = new oFF.XConstant();
oFF.ProtocolType.prototype._ff_c = "ProtocolType";

oFF.ProtocolType.HTTP = null;
oFF.ProtocolType.HTTPS = null;
oFF.ProtocolType.FILE = null;
oFF.ProtocolType.INA_DB = null;
oFF.ProtocolType.INA_SQL = null;
oFF.ProtocolType.SQL = null;
oFF.ProtocolType.UI = null;
oFF.ProtocolType.DATAPROVIDER = null;
oFF.ProtocolType.DIALOG = null;
oFF.ProtocolType.ENVVARS = null;
oFF.ProtocolType.VFS = null;
oFF.ProtocolType.PRG = null;
oFF.ProtocolType.WASABI = null;
oFF.ProtocolType.s_instances = null;
oFF.ProtocolType.staticSetup = function()
{
	oFF.ProtocolType.s_instances = oFF.XHashMapByString.create();
	oFF.ProtocolType.HTTP = oFF.ProtocolType.create("http", 80);
	oFF.ProtocolType.HTTPS = oFF.ProtocolType.create("https", 443);
	oFF.ProtocolType.FILE = oFF.ProtocolType.create("file", 0);
	oFF.ProtocolType.INA_DB = oFF.ProtocolType.create("ina_db", 0);
	oFF.ProtocolType.INA_SQL = oFF.ProtocolType.create("ina_sql", 0);
	oFF.ProtocolType.SQL = oFF.ProtocolType.create("sql", 0);
	oFF.ProtocolType.UI = oFF.ProtocolType.create("ui", 0);
	oFF.ProtocolType.DATAPROVIDER = oFF.ProtocolType.create("dp", 0);
	oFF.ProtocolType.DIALOG = oFF.ProtocolType.create("dialog", 0);
	oFF.ProtocolType.ENVVARS = oFF.ProtocolType.create("env", 0);
	oFF.ProtocolType.VFS = oFF.ProtocolType.create("vfs", 0);
	oFF.ProtocolType.PRG = oFF.ProtocolType.create("prg", 0);
	oFF.ProtocolType.WASABI = oFF.ProtocolType.create("wasabi", 0);
};
oFF.ProtocolType.create = function(name, defaultPort)
{
	var newConstant = new oFF.ProtocolType();
	newConstant._setupInternal(name);
	newConstant.m_uriName = oFF.XStringUtils.concatenate2(name, "://");
	newConstant.m_defaultPort = defaultPort;
	oFF.ProtocolType.s_instances.put(name, newConstant);
	oFF.ProtocolType.s_instances.put(oFF.XString.toLowerCase(name), newConstant);
	return newConstant;
};
oFF.ProtocolType.lookup = function(name)
{
	if (oFF.isNull(name))
	{
		return null;
	}
	var lowerCase = oFF.XString.toLowerCase(name);
	return oFF.ProtocolType.s_instances.getByKey(lowerCase);
};
oFF.ProtocolType.lookupAll = function()
{
	return oFF.ProtocolType.s_instances.getIterator();
};
oFF.ProtocolType.prototype.m_uriName = null;
oFF.ProtocolType.prototype.m_defaultPort = 0;
oFF.ProtocolType.prototype.getUriName = function()
{
	return this.m_uriName;
};
oFF.ProtocolType.prototype.getDefaultPort = function()
{
	return this.m_defaultPort;
};

oFF.HttpCachingMode = function() {};
oFF.HttpCachingMode.prototype = new oFF.XConstant();
oFF.HttpCachingMode.prototype._ff_c = "HttpCachingMode";

oFF.HttpCachingMode.L0_OFFLINE = null;
oFF.HttpCachingMode.L1_INITIAL = null;
oFF.HttpCachingMode.L2_DYNAMIC = null;
oFF.HttpCachingMode.L3_LIVE_NO_CACHE = null;
oFF.HttpCachingMode.staticSetup = function()
{
	oFF.HttpCachingMode.L0_OFFLINE = oFF.HttpCachingMode.create("L0Offline");
	oFF.HttpCachingMode.L1_INITIAL = oFF.HttpCachingMode.create("L1Initial");
	oFF.HttpCachingMode.L2_DYNAMIC = oFF.HttpCachingMode.create("L2Dynamic");
	oFF.HttpCachingMode.L3_LIVE_NO_CACHE = oFF.HttpCachingMode.create("L3LiveNoCache");
};
oFF.HttpCachingMode.create = function(name)
{
	var newConstant = new oFF.HttpCachingMode();
	newConstant._setupInternal(name);
	return newConstant;
};

oFF.HttpRequestMethod = function() {};
oFF.HttpRequestMethod.prototype = new oFF.XConstant();
oFF.HttpRequestMethod.prototype._ff_c = "HttpRequestMethod";

oFF.HttpRequestMethod.HTTP_OPTIONS = null;
oFF.HttpRequestMethod.HTTP_GET = null;
oFF.HttpRequestMethod.HTTP_POST = null;
oFF.HttpRequestMethod.HTTP_PUT = null;
oFF.HttpRequestMethod.HTTP_DELETE = null;
oFF.HttpRequestMethod.s_instances = null;
oFF.HttpRequestMethod.create = function(name)
{
	var newConstant = new oFF.HttpRequestMethod();
	newConstant._setupInternal(name);
	oFF.HttpRequestMethod.s_instances.put(name, newConstant);
	return newConstant;
};
oFF.HttpRequestMethod.lookup = function(name)
{
	return oFF.HttpRequestMethod.s_instances.getByKey(name);
};
oFF.HttpRequestMethod.staticSetup = function()
{
	oFF.HttpRequestMethod.s_instances = oFF.XHashMapByString.create();
	oFF.HttpRequestMethod.HTTP_GET = oFF.HttpRequestMethod.create("GET");
	oFF.HttpRequestMethod.HTTP_POST = oFF.HttpRequestMethod.create("POST");
	oFF.HttpRequestMethod.HTTP_PUT = oFF.HttpRequestMethod.create("PUT");
	oFF.HttpRequestMethod.HTTP_DELETE = oFF.HttpRequestMethod.create("DELETE");
	oFF.HttpRequestMethod.HTTP_OPTIONS = oFF.HttpRequestMethod.create("OPTIONS");
};

oFF.HttpCookie = function() {};
oFF.HttpCookie.prototype = new oFF.XNameValuePair();
oFF.HttpCookie.prototype._ff_c = "HttpCookie";

oFF.HttpCookie.createCookie = function(name, value)
{
	var httpCookie = new oFF.HttpCookie();
	httpCookie.setupWithNameValue(name, value);
	return httpCookie;
};
oFF.HttpCookie.createCopy = function(cookie)
{
	var newCookie = new oFF.HttpCookie();
	newCookie.setupWithNameValue(cookie.getName(), cookie.getValue());
	newCookie.setFromCookie(cookie);
	return newCookie;
};
oFF.HttpCookie.createByHttpServerResponseValue = function(httpHeaderValue)
{
	var newCookie = null;
	if (oFF.notNull(httpHeaderValue))
	{
		var cookieAttributes = oFF.XProperties.create();
		var start = 0;
		var cookieName = null;
		var cookieValue = null;
		while (true)
		{
			var end = oFF.XString.indexOfFrom(httpHeaderValue, ";", start);
			var subValue = oFF.XString.substring(httpHeaderValue, start, end);
			var assignIndex = oFF.XString.indexOf(subValue, "=");
			var attributeName;
			var attributeValue;
			if (assignIndex === -1)
			{
				attributeName = subValue;
				attributeValue = "";
			}
			else
			{
				attributeName = oFF.XString.substring(subValue, 0, assignIndex);
				attributeValue = oFF.XString.substring(subValue, assignIndex + 1, -1);
			}
			attributeName = oFF.XString.trim(attributeName);
			attributeValue = oFF.XString.trim(attributeValue);
			if (oFF.isNull(cookieName))
			{
				cookieName = attributeName;
				cookieValue = attributeValue;
			}
			else
			{
				attributeName = oFF.XString.toLowerCase(attributeName);
				cookieAttributes.putString(attributeName, attributeValue);
			}
			if (end === -1)
			{
				break;
			}
			start = end + 1;
		}
		newCookie = oFF.HttpCookie.createCookie(cookieName, cookieValue);
		var path = cookieAttributes.getStringByKey("path");
		newCookie.setPath(path);
		var domain = cookieAttributes.getStringByKey("domain");
		newCookie.setDomain(domain);
		var secure = cookieAttributes.getStringByKey("secure");
		if (oFF.notNull(secure))
		{
			newCookie.setIsSecure(true);
		}
		var isHttpOnly = cookieAttributes.getStringByKey("httponly");
		if (oFF.notNull(isHttpOnly))
		{
			newCookie.setIsHttpOnly(true);
		}
	}
	return newCookie;
};
oFF.HttpCookie.prototype.m_comment = null;
oFF.HttpCookie.prototype.m_domain = null;
oFF.HttpCookie.prototype.m_path = null;
oFF.HttpCookie.prototype.m_version = 0;
oFF.HttpCookie.prototype.m_maxAge = 0;
oFF.HttpCookie.prototype.m_isSecure = false;
oFF.HttpCookie.prototype.m_isHttpOnly = false;
oFF.HttpCookie.prototype.releaseObject = function()
{
	this.m_comment = null;
	this.m_domain = null;
	this.m_path = null;
	oFF.XNameValuePair.prototype.releaseObject.call( this );
};
oFF.HttpCookie.prototype.getComment = function()
{
	return this.m_comment;
};
oFF.HttpCookie.prototype.setComment = function(comment)
{
	this.m_comment = comment;
};
oFF.HttpCookie.prototype.getDomain = function()
{
	return this.m_domain;
};
oFF.HttpCookie.prototype.setDomain = function(domain)
{
	this.m_domain = domain;
};
oFF.HttpCookie.prototype.getPath = function()
{
	return this.m_path;
};
oFF.HttpCookie.prototype.setPath = function(path)
{
	this.m_path = path;
};
oFF.HttpCookie.prototype.getVersion = function()
{
	return this.m_version;
};
oFF.HttpCookie.prototype.setVersion = function(version)
{
	this.m_version = version;
};
oFF.HttpCookie.prototype.getMaxAge = function()
{
	return this.m_maxAge;
};
oFF.HttpCookie.prototype.setMaxAge = function(maxAge)
{
	this.m_maxAge = maxAge;
};
oFF.HttpCookie.prototype.isSecure = function()
{
	return this.m_isSecure;
};
oFF.HttpCookie.prototype.setIsSecure = function(isSecure)
{
	this.m_isSecure = isSecure;
};
oFF.HttpCookie.prototype.isHttpOnly = function()
{
	return this.m_isHttpOnly;
};
oFF.HttpCookie.prototype.setIsHttpOnly = function(isHttpOnly)
{
	this.m_isHttpOnly = isHttpOnly;
};
oFF.HttpCookie.prototype.setFromCookie = function(cookie)
{
	this.setPath(cookie.getPath());
	this.setComment(cookie.getComment());
	this.setDomain(cookie.getDomain());
	this.setIsSecure(cookie.isSecure());
	this.setMaxAge(cookie.getMaxAge());
	this.setVersion(cookie.getVersion());
	this.setIsHttpOnly(cookie.isHttpOnly());
};
oFF.HttpCookie.prototype.toString = function()
{
	var buffer = oFF.XStringBuffer.create();
	buffer.append(this.getName());
	if (this.getValue() !== null)
	{
		buffer.append("=");
		buffer.append(this.getValue());
	}
	if (this.getPath() !== null)
	{
		buffer.append("; Path=");
		buffer.append(this.getPath());
	}
	if (this.getDomain() !== null)
	{
		buffer.append("; Domain=");
		buffer.append(this.getDomain());
	}
	if (this.isSecure())
	{
		buffer.append("; Secure");
	}
	if (this.isHttpOnly())
	{
		buffer.append("; HttpOnly");
	}
	return buffer.toString();
};

oFF.HttpExchange = function() {};
oFF.HttpExchange.prototype = new oFF.XFileContent();
oFF.HttpExchange.prototype._ff_c = "HttpExchange";

oFF.HttpExchange.prototype.m_properties = null;
oFF.HttpExchange.prototype.m_headerLines = null;
oFF.HttpExchange.prototype.m_cookies = null;
oFF.HttpExchange.prototype.m_cookiesMasterStore = null;
oFF.HttpExchange.prototype.m_mimeType = null;
oFF.HttpExchange.prototype.m_textContentEncoding = null;
oFF.HttpExchange.prototype.m_gzipContentEncoding = false;
oFF.HttpExchange.prototype.m_rawSummary = null;
oFF.HttpExchange.prototype.setup = function()
{
	oFF.XFileContent.prototype.setup.call( this );
	this.m_properties = oFF.XProperties.create();
	this.m_headerLines = oFF.XListOfString.create();
	this.setContentType(oFF.ContentType.APPLICATION_JSON);
};
oFF.HttpExchange.prototype.releaseObject = function()
{
	this.m_properties = oFF.XObjectExt.release(this.m_properties);
	this.m_headerLines = oFF.XObjectExt.release(this.m_headerLines);
	this.m_cookies = oFF.XObjectExt.release(this.m_cookies);
	this.m_mimeType = null;
	this.m_textContentEncoding = null;
	this.m_rawSummary = null;
	oFF.XFileContent.prototype.releaseObject.call( this );
};
oFF.HttpExchange.prototype.setFromHttpExchange = function(httpExchange)
{
	this.setContentType(httpExchange.getContentType());
	this.setTextContentEncoding(httpExchange.getTextContentEncoding());
	this.setString(httpExchange.getString());
	this.setByteArray(httpExchange.getByteArray());
	this.setJsonObject(httpExchange.getJsonContent());
	this.setCookiesMasterStore(httpExchange.getCookiesMasterStore());
	var sourceHeaders = httpExchange.getHeaderFields();
	var targetHeaders = this.getHeaderFieldsBase();
	var iterator = sourceHeaders.getKeysAsIteratorOfString();
	while (iterator.hasNext())
	{
		var key = iterator.next();
		var value = sourceHeaders.getByKey(key);
		targetHeaders.put(key, value);
	}
};
oFF.HttpExchange.prototype.getHeaderFieldsBase = function()
{
	return this.m_properties;
};
oFF.HttpExchange.prototype.getHeaderFields = function()
{
	return this.m_properties;
};
oFF.HttpExchange.prototype.getHeaderLines = function()
{
	return this.m_headerLines;
};
oFF.HttpExchange.prototype.setHeaderLines = function(headerLines)
{
	this.m_headerLines = headerLines;
};
oFF.HttpExchange.prototype.addHeaderLine = function(headerLine)
{
	this.m_headerLines.add(headerLine);
};
oFF.HttpExchange.prototype.setCookies = function(cookies)
{
	this.m_cookies = cookies;
};
oFF.HttpExchange.prototype.getCookies = function()
{
	return this.m_cookies;
};
oFF.HttpExchange.prototype.addCookie = function(cookie)
{
	if (oFF.isNull(this.m_cookies))
	{
		this.m_cookies = oFF.HttpCookies.create();
	}
	this.m_cookies.addCookie(cookie);
};
oFF.HttpExchange.prototype.getInternalTextEncoding = function()
{
	var encoding = oFF.XFileContent.prototype.getInternalTextEncoding.call( this );
	var textContentEncoding = this.getTextContentEncoding();
	if (oFF.notNull(textContentEncoding))
	{
		textContentEncoding = oFF.XString.toUpperCase(textContentEncoding);
		if (oFF.XString.isEqual(textContentEncoding, "US-ASCII"))
		{
			encoding = oFF.XCharset.USASCII;
		}
	}
	return encoding;
};
oFF.HttpExchange.prototype.setContentType = function(contentType)
{
	oFF.XFileContent.prototype.setContentType.call( this , contentType);
	if (oFF.notNull(contentType))
	{
		this.m_mimeType = contentType.getName();
	}
};
oFF.HttpExchange.prototype.getContentTypeValue = function()
{
	return this.m_mimeType;
};
oFF.HttpExchange.prototype.setContentTypeValue = function(contentType)
{
	this.m_mimeType = contentType;
};
oFF.HttpExchange.prototype.getTextContentEncoding = function()
{
	return this.m_textContentEncoding;
};
oFF.HttpExchange.prototype.setTextContentEncoding = function(encoding)
{
	this.m_textContentEncoding = encoding;
};
oFF.HttpExchange.prototype.getGzipContentEncoding = function()
{
	return this.m_gzipContentEncoding;
};
oFF.HttpExchange.prototype.setGzipContentEncoding = function(encoding)
{
	this.m_gzipContentEncoding = encoding;
};
oFF.HttpExchange.prototype.getRawSummary = function()
{
	if (oFF.isNull(this.m_rawSummary))
	{
		var buffer = oFF.XStringBuffer.create();
		for (var i = 0; i < this.m_headerLines.size(); i++)
		{
			buffer.appendLine(this.m_headerLines.get(i));
		}
		var content = null;
		var jsonContent = this.getJsonContent();
		if (oFF.notNull(jsonContent))
		{
			content = oFF.PrUtils.serialize(jsonContent, true, true, 2);
		}
		if (oFF.isNull(content))
		{
			content = this.getString();
		}
		if (oFF.notNull(content))
		{
			buffer.appendLine("Content:");
			buffer.append(content);
		}
		this.m_rawSummary = buffer.toString();
	}
	return this.m_rawSummary;
};
oFF.HttpExchange.prototype.getCookiesMasterStore = function()
{
	return this.m_cookiesMasterStore;
};
oFF.HttpExchange.prototype.setCookiesMasterStore = function(masterStore)
{
	this.m_cookiesMasterStore = masterStore;
};

oFF.HttpServerRequestResponse = function() {};
oFF.HttpServerRequestResponse.prototype = new oFF.MessageManager();
oFF.HttpServerRequestResponse.prototype._ff_c = "HttpServerRequestResponse";

oFF.HttpServerRequestResponse.create = function(session)
{
	var newObj = new oFF.HttpServerRequestResponse();
	newObj.setupSessionContext(session);
	return newObj;
};
oFF.HttpServerRequestResponse.prototype.m_request = null;
oFF.HttpServerRequestResponse.prototype.m_response = null;
oFF.HttpServerRequestResponse.prototype.setupSessionContext = function(session)
{
	oFF.MessageManager.prototype.setupSessionContext.call( this , session);
	this.m_request = oFF.HttpRequest.create();
};
oFF.HttpServerRequestResponse.prototype.getClientRequest = function()
{
	return this.m_request;
};
oFF.HttpServerRequestResponse.prototype.setClientRequest = function(clientRequest)
{
	this.m_request = clientRequest;
};
oFF.HttpServerRequestResponse.prototype.setResponse = function(serverResponse)
{
	this.m_response = serverResponse;
};
oFF.HttpServerRequestResponse.prototype.getResponse = function()
{
	return this.m_response;
};
oFF.HttpServerRequestResponse.prototype.newServerResponse = function()
{
	return oFF.HttpResponse.createResponse(this.getClientRequest());
};

oFF.ProxyType = function() {};
oFF.ProxyType.prototype = new oFF.XConstant();
oFF.ProxyType.prototype._ff_c = "ProxyType";

oFF.ProxyType.DEFAULT = null;
oFF.ProxyType.NONE = null;
oFF.ProxyType.PROXY = null;
oFF.ProxyType.WEBDISPATCHER = null;
oFF.ProxyType.s_lookup = null;
oFF.ProxyType.staticSetup = function()
{
	oFF.ProxyType.s_lookup = oFF.XHashMapByString.create();
	oFF.ProxyType.DEFAULT = oFF.ProxyType.create("DEFAULT");
	oFF.ProxyType.NONE = oFF.XConstant.setupName(new oFF.ProxyType(), "NONE");
	oFF.ProxyType.PROXY = oFF.XConstant.setupName(new oFF.ProxyType(), "PROXY");
	oFF.ProxyType.WEBDISPATCHER = oFF.XConstant.setupName(new oFF.ProxyType(), "WEBDISPATCHER");
};
oFF.ProxyType.create = function(name)
{
	var pt = oFF.XConstant.setupName(new oFF.ProxyType(), name);
	oFF.ProxyType.s_lookup.put(name, pt);
	return pt;
};
oFF.ProxyType.lookup = function(name)
{
	return oFF.ProxyType.s_lookup.getByKey(name);
};

oFF.DfUserSettings = function() {};
oFF.DfUserSettings.prototype = new oFF.UserSettings();
oFF.DfUserSettings.prototype._ff_c = "DfUserSettings";

oFF.DfUserSettings.create = function(session)
{
	var newObj = new oFF.DfUserSettings();
	newObj.setupInternal(session);
	return newObj;
};
oFF.DfUserSettings.prototype.m_properties = null;
oFF.DfUserSettings.prototype.setupInternal = function(session)
{
	this.m_properties = oFF.XProperties.create();
};
oFF.DfUserSettings.prototype.releaseObject = function()
{
	this.m_properties = oFF.XObjectExt.release(this.m_properties);
	oFF.UserSettings.prototype.releaseObject.call( this );
};
oFF.DfUserSettings.prototype.getStringByKey = function(name)
{
	return this.m_properties.getStringByKey(name);
};
oFF.DfUserSettings.prototype.getStringByKeyExt = function(name, defaultValue)
{
	return this.m_properties.getStringByKeyExt(name, defaultValue);
};
oFF.DfUserSettings.prototype.putString = function(name, stringValue)
{
	this.m_properties.putString(name, stringValue);
};
oFF.DfUserSettings.prototype.putStringNotNull = function(name, stringValue)
{
	this.m_properties.putStringNotNull(name, stringValue);
};
oFF.DfUserSettings.prototype.putStringNotNullAndNotEmpty = function(name, stringValue)
{
	this.m_properties.putStringNotNullAndNotEmpty(name, stringValue);
};
oFF.DfUserSettings.prototype.getBooleanByKey = function(name)
{
	return this.m_properties.getBooleanByKey(name);
};
oFF.DfUserSettings.prototype.getBooleanByKeyExt = function(name, defaultValue)
{
	return this.m_properties.getBooleanByKeyExt(name, defaultValue);
};
oFF.DfUserSettings.prototype.putBoolean = function(key, booleanValue)
{
	this.m_properties.putBoolean(key, booleanValue);
};
oFF.DfUserSettings.prototype.getLongByKey = function(name)
{
	return this.m_properties.getLongByKey(name);
};
oFF.DfUserSettings.prototype.getLongByKeyExt = function(name, defaultValue)
{
	return this.m_properties.getLongByKeyExt(name, defaultValue);
};
oFF.DfUserSettings.prototype.putLong = function(name, longValue)
{
	this.m_properties.putLong(name, longValue);
};
oFF.DfUserSettings.prototype.getIntegerByKey = function(name)
{
	return this.m_properties.getIntegerByKey(name);
};
oFF.DfUserSettings.prototype.getIntegerByKeyExt = function(name, defaultValue)
{
	return this.m_properties.getIntegerByKeyExt(name, defaultValue);
};
oFF.DfUserSettings.prototype.putInteger = function(name, intValue)
{
	this.m_properties.putInteger(name, intValue);
};
oFF.DfUserSettings.prototype.getDoubleByKey = function(name)
{
	return this.m_properties.getDoubleByKey(name);
};
oFF.DfUserSettings.prototype.getDoubleByKeyExt = function(name, defaultValue)
{
	return this.m_properties.getDoubleByKeyExt(name, defaultValue);
};
oFF.DfUserSettings.prototype.putDouble = function(name, doubleValue)
{
	this.m_properties.putDouble(name, doubleValue);
};
oFF.DfUserSettings.prototype.putNull = function(name)
{
	this.m_properties.putNull(name);
};
oFF.DfUserSettings.prototype.hasNullByKey = function(name)
{
	return this.m_properties.hasNullByKey(name);
};
oFF.DfUserSettings.prototype.removeKey = function(key)
{
	this.m_properties.remove(key);
};
oFF.DfUserSettings.prototype.containsKey = function(key)
{
	return this.m_properties.containsKey(key);
};

oFF.SqlResultSetType = function() {};
oFF.SqlResultSetType.prototype = new oFF.XConstant();
oFF.SqlResultSetType.prototype._ff_c = "SqlResultSetType";

oFF.SqlResultSetType.STRING = null;
oFF.SqlResultSetType.INTEGER = null;
oFF.SqlResultSetType.LONG = null;
oFF.SqlResultSetType.DOUBLE = null;
oFF.SqlResultSetType.BOOLEAN = null;
oFF.SqlResultSetType.THE_NULL = null;
oFF.SqlResultSetType.create = function(name)
{
	var newConstant = new oFF.SqlResultSetType();
	newConstant._setupInternal(name);
	return newConstant;
};
oFF.SqlResultSetType.staticSetup = function()
{
	oFF.SqlResultSetType.STRING = oFF.SqlResultSetType.create("String");
	oFF.SqlResultSetType.INTEGER = oFF.SqlResultSetType.create("Integer");
	oFF.SqlResultSetType.LONG = oFF.SqlResultSetType.create("Long");
	oFF.SqlResultSetType.DOUBLE = oFF.SqlResultSetType.create("Double");
	oFF.SqlResultSetType.BOOLEAN = oFF.SqlResultSetType.create("Boolean");
	oFF.SqlResultSetType.THE_NULL = oFF.SqlResultSetType.create("Null");
};

oFF.FeatureToggleOlap = function() {};
oFF.FeatureToggleOlap.prototype = new oFF.XConstant();
oFF.FeatureToggleOlap.prototype._ff_c = "FeatureToggleOlap";

oFF.FeatureToggleOlap.INIT_ACTION_FOR_FUSION = null;
oFF.FeatureToggleOlap.SET_OPERAND_CURRENT_MEMBER_SINGLE_NAVIGATION = null;
oFF.FeatureToggleOlap.MULTIPLE_EX_AGG_DIMS_IN_CALC_PLAN = null;
oFF.FeatureToggleOlap.MDS_CONDITIONS = null;
oFF.FeatureToggleOlap.SORT_NEW_VALUES = null;
oFF.FeatureToggleOlap.MEASURE_MEMBER_DEFINITION = null;
oFF.FeatureToggleOlap.IS_VIRTUAL_DESCRIPTION = null;
oFF.FeatureToggleOlap.MEASURE_MEMBER_DETAILS = null;
oFF.FeatureToggleOlap.MEASURE_MEMBER_TYPE = null;
oFF.FeatureToggleOlap.UNIVERSAL_MODEL = null;
oFF.FeatureToggleOlap.ROOT_ORPHANS_AFTER_VISIBILITY_FILTER = null;
oFF.FeatureToggleOlap.CURRENCY_TRANSLATION = null;
oFF.FeatureToggleOlap.MEASURE_MEMBER_CURRENCY_TRANSLATIONS = null;
oFF.FeatureToggleOlap.AUTO_VARIABLE_SUBMIT_FOR_FULL_QM = null;
oFF.FeatureToggleOlap.UNDEFINED_TUPLE_COUNT_TOTALS = null;
oFF.FeatureToggleOlap.SFX_DIMENSION_CUSTOMIZED_DESC = null;
oFF.FeatureToggleOlap.QDATA_CELL_MODEL_DEFAULTS = null;
oFF.FeatureToggleOlap.UDH_ALIGNMENT = null;
oFF.FeatureToggleOlap.CUSTOM_DIMENSION_2_FOR_AGILE_BI = null;
oFF.FeatureToggleOlap.CUSTOM_DIMENSION_2_FOR_INA_MODEL = null;
oFF.FeatureToggleOlap.MEMBER_VALUE_EXCEPTIONS = null;
oFF.FeatureToggleOlap.DYN_MEMBERS_ON_NON_MEASURE_STRUCTURE = null;
oFF.FeatureToggleOlap.UNIFIED_DATACELLS = null;
oFF.FeatureToggleOlap.RESULTSET_CELL_FORMAT_TYPE_SPECIFIC = null;
oFF.FeatureToggleOlap.CUBE_BLENDING_N_QUERIES = null;
oFF.FeatureToggleOlap.DATASOURCE_TYPE_QUERY_METADATA = null;
oFF.FeatureToggleOlap.DATASOURCE_TYPE_QUERY = null;
oFF.FeatureToggleOlap.TUPLES_OPERAND = null;
oFF.FeatureToggleOlap.SID_PRESENTATION = null;
oFF.FeatureToggleOlap.HIERARCHY_LEVEL = null;
oFF.FeatureToggleOlap.CUBE_CACHE = null;
oFF.FeatureToggleOlap.UNIVERSAL_DISPLAY_HIERARCHY_ZERO_BASED = null;
oFF.FeatureToggleOlap.EXT_KEYFIGURE_PROPERTIES = null;
oFF.FeatureToggleOlap.NUMBER_AS_STRING = null;
oFF.FeatureToggleOlap.DISP_HIERARCHY_FIX_IN_FILTER = null;
oFF.FeatureToggleOlap.HIERARCHY_CATALOG = null;
oFF.FeatureToggleOlap.METADATA_DIMENSION_OTHERS = null;
oFF.FeatureToggleOlap.METADATA_DIMENSION_IS_MODELED = null;
oFF.FeatureToggleOlap.RESULTSET_CELL_MEASURE = null;
oFF.FeatureToggleOlap.RESULTSETV2_METADATA_EXTENSION1 = null;
oFF.FeatureToggleOlap.METADATA_CUBE_RESPONSE_SUPPRESS_PROPERTIES = null;
oFF.FeatureToggleOlap.SUPPRESS_SUPPLEMENTS = null;
oFF.FeatureToggleOlap.WINDOW_FUNCTION = null;
oFF.FeatureToggleOlap.UNIVERSE_SOURCE_QUERY = null;
oFF.FeatureToggleOlap.NO_MEASURE_READMODE = null;
oFF.FeatureToggleOlap.NO_DUPLICATED_READMODE = null;
oFF.FeatureToggleOlap.SHARED_CSRF_TOKENS = null;
oFF.FeatureToggleOlap.AUTO_CSRF_CALL = null;
oFF.FeatureToggleOlap.SERVER_METADATA_VIA_SYSTEM_CONNECT = null;
oFF.FeatureToggleOlap.BW_SESSION_ID_VIA_GET_RESPONSE = null;
oFF.FeatureToggleOlap.CLIENT_INFO_METADATA = null;
oFF.FeatureToggleOlap.FUSION_SERVICE = null;
oFF.FeatureToggleOlap.CORRECT_DIMENSION_DESCRIPTION = null;
oFF.FeatureToggleOlap.ACTIVATE_DEFAULT_HIERARCHY = null;
oFF.FeatureToggleOlap.CORRECT_DRILLSTATE_IN_CLASSIC_RESULTSET = null;
oFF.FeatureToggleOlap.HIERARCHY_INFO_IN_FILTER = null;
oFF.FeatureToggleOlap.NO_EMPTY_OPTIONS = null;
oFF.FeatureToggleOlap.NO_EMPTY_SORT = null;
oFF.FeatureToggleOlap.NO_NON_EMPTY = null;
oFF.FeatureToggleOlap.OPTIMIZE_HIERARCHY_EXPORT = null;
oFF.FeatureToggleOlap.ASSERT_CONDITIONS_SIZE = null;
oFF.FeatureToggleOlap.EXPORT_FREE_AXIS_FOR_PLANNING = null;
oFF.FeatureToggleOlap.OPTIMIZE_MDS_CATALOG = null;
oFF.FeatureToggleOlap.PERSIST_PAGING_IN_REPO = null;
oFF.FeatureToggleOlap.SINGLE_VALUE_VARIABLES_ONLY_INCLUDE = null;
oFF.FeatureToggleOlap.NAMED_CUSTOM_DIMENSION_MEMBER = null;
oFF.FeatureToggleOlap.DEVELOPMENT_MODE = null;
oFF.FeatureToggleOlap.DEVELOPMENT_MODE_PLANNING = null;
oFF.FeatureToggleOlap.DONT_ALWAYS_REQUEST_TEXTFIELD = null;
oFF.FeatureToggleOlap.SIMPLIFIED_CAPABILITY_MERGE = null;
oFF.FeatureToggleOlap.METADATA_CACHING = null;
oFF.FeatureToggleOlap.HAS_CHECK_TABLE_DEFAULT_FALSE = null;
oFF.FeatureToggleOlap.EXTERNALIZED_DYNAMIC_FILTER = null;
oFF.FeatureToggleOlap.AUTO_VARIABLE_SUBMIT_CAPABILITY = null;
oFF.FeatureToggleOlap.AUTO_VARIABLE_SUBMIT_FUNCTIONALITY = null;
oFF.FeatureToggleOlap.NULL_ZERO_SUPPRESSION = null;
oFF.FeatureToggleOlap.INPUT_READINESS_WITH_NAVIGATIONAL_ATTRIBUTES = null;
oFF.FeatureToggleOlap.ITERATED_FORMULA = null;
oFF.FeatureToggleOlap.CDS_PROJECTION_VIEWS = null;
oFF.FeatureToggleOlap.CELL_DOCUMENT_ID = null;
oFF.FeatureToggleOlap.IMPROVED_DYNAMIC_VARIABLE_UPDATE = null;
oFF.FeatureToggleOlap.UNDO_USE_ALLOW_LIST = null;
oFF.FeatureToggleOlap.UNDO_RELEASE_QUERY_MANAGERS = null;
oFF.FeatureToggleOlap.LOV_BASED_FILTER_ACROSS_MODELS = null;
oFF.FeatureToggleOlap.CLONE_LINKED_FILTERS = null;
oFF.FeatureToggleOlap.INA_REPOSITORY_DELTA = null;
oFF.FeatureToggleOlap.TEXT_IN_HIERARCHY = null;
oFF.FeatureToggleOlap.DIMENSION_KEY_ATTRIBUTES = null;
oFF.FeatureToggleOlap.HIERARCHY_PATH_PRESENTATION_TYPE = null;
oFF.FeatureToggleOlap.INA_SHIFT_PERIOD_FOR_TRANSIENT_TIME_OPERATIONS = null;
oFF.FeatureToggleOlap.TIME_MEASURE_WITH_FLAT_AND_HIERARCHICAL_FILTER = null;
oFF.FeatureToggleOlap.TUPLE_COUNT_BEFORE_SLICING = null;
oFF.FeatureToggleOlap.SFX_MINIMUM_DRILL_STATE = null;
oFF.FeatureToggleOlap.SFX_HIDDEN_DIMENSIONS = null;
oFF.FeatureToggleOlap.MULTIPLE_ACCOUNT_HIERARCHIES = null;
oFF.FeatureToggleOlap.MEMBER_OVERRIDE_TEXTS = null;
oFF.FeatureToggleOlap.QUERY_ALIAS_FROM_CATALOG = null;
oFF.FeatureToggleOlap.LAZY_LOADING_SFX_ACCOUNT_MEMBERS = null;
oFF.FeatureToggleOlap.ASYNC_BLENDING_BATCH_REQUEST = null;
oFF.FeatureToggleOlap.MAINTAIN_VARIABLE_VARIANTS = null;
oFF.FeatureToggleOlap.s_lookup = null;
oFF.FeatureToggleOlap.staticSetup = function()
{
	oFF.FeatureToggleOlap.s_lookup = oFF.XSetOfNameObject.create();
	oFF.FeatureToggleOlap.SORT_NEW_VALUES = oFF.FeatureToggleOlap.create("Olap.SortNewValues", -2);
	oFF.FeatureToggleOlap.ROOT_ORPHANS_AFTER_VISIBILITY_FILTER = oFF.FeatureToggleOlap.create("Olap.RootOrphanNodesAfterVisibilityFilter", -2);
	oFF.FeatureToggleOlap.MDS_CONDITIONS = oFF.FeatureToggleOlap.create("Olap.Conditions", -2);
	oFF.FeatureToggleOlap.IS_VIRTUAL_DESCRIPTION = oFF.FeatureToggleOlap.create("Olap.IsVirtualDescription", -2);
	oFF.FeatureToggleOlap.MEASURE_MEMBER_DEFINITION = oFF.FeatureToggleOlap.create("Olap.MeasureMemberMetadata", -2);
	oFF.FeatureToggleOlap.MEASURE_MEMBER_DETAILS = oFF.FeatureToggleOlap.create("Olap.MeasureMemberDetails", -2);
	oFF.FeatureToggleOlap.MEASURE_MEMBER_TYPE = oFF.FeatureToggleOlap.create("Olap.CustomDimension1MemberType", -2);
	oFF.FeatureToggleOlap.CURRENCY_TRANSLATION = oFF.FeatureToggleOlap.create("Olap.CurrencyTranslation", -2);
	oFF.FeatureToggleOlap.MEASURE_MEMBER_CURRENCY_TRANSLATIONS = oFF.FeatureToggleOlap.create("Olap.MeasureMemberCurrencyTranslations", -2);
	oFF.FeatureToggleOlap.UNDEFINED_TUPLE_COUNT_TOTALS = oFF.FeatureToggleOlap.create("Olap.UndefinedTupleCountTotals", -2);
	oFF.FeatureToggleOlap.SFX_DIMENSION_CUSTOMIZED_DESC = oFF.FeatureToggleOlap.create("Olap.SfxDimensionCustomizedDesc", -2);
	oFF.FeatureToggleOlap.UNIVERSAL_MODEL = oFF.FeatureToggleOlap.create("Olap.UniversalModel", -2);
	oFF.FeatureToggleOlap.INIT_ACTION_FOR_FUSION = oFF.FeatureToggleOlap.create("Olap.InitActionForFusion", -2);
	oFF.FeatureToggleOlap.SET_OPERAND_CURRENT_MEMBER_SINGLE_NAVIGATION = oFF.FeatureToggleOlap.create("Olap.SetOperandCurrentMemberSingleNavigation", -2);
	oFF.FeatureToggleOlap.MULTIPLE_EX_AGG_DIMS_IN_CALC_PLAN = oFF.FeatureToggleOlap.create("Olap.MultipleExAggDimsInCalcPlan", oFF.XVersion.V126_MULTIPLE_EX_AGG_DIMS_IN_CALC_PLAN);
	oFF.FeatureToggleOlap.ASSERT_CONDITIONS_SIZE = oFF.FeatureToggleOlap.create("Olap.AssertConditionsSize", oFF.XVersion.V127_IS_USED_CONDITION);
	oFF.FeatureToggleOlap.PERSIST_PAGING_IN_REPO = oFF.FeatureToggleOlap.create("Olap.PersistPagingInRepo", oFF.XVersion.V140_REPOSITORY_PERSIST_PAGING);
	oFF.FeatureToggleOlap.HIERARCHY_INFO_IN_FILTER = oFF.FeatureToggleOlap.create("Olap.HierarchyInfoInFilter", oFF.XVersion.V142_HIERARCHY_INFO_IN_FILTER);
	oFF.FeatureToggleOlap.NO_MEASURE_READMODE = oFF.FeatureToggleOlap.create("Olap.NoMeasureReadmode", oFF.XVersion.V144_NO_MEASURE_READMODE);
	oFF.FeatureToggleOlap.NO_EMPTY_OPTIONS = oFF.FeatureToggleOlap.create("Olap.NoEmptyOptions", oFF.XVersion.V145_NO_EMPTY_OPTIONS);
	oFF.FeatureToggleOlap.NO_EMPTY_SORT = oFF.FeatureToggleOlap.create("Olap.NoEmptySort", oFF.XVersion.V146_NO_EMPTY_SORT);
	oFF.FeatureToggleOlap.NO_NON_EMPTY = oFF.FeatureToggleOlap.create("Olap.NoNonEmpty", oFF.XVersion.V147_NO_NON_EMPTY);
	oFF.FeatureToggleOlap.NO_DUPLICATED_READMODE = oFF.FeatureToggleOlap.create("Olap.NoDuplicateReadmode", oFF.XVersion.V148_NO_DUPLICATED_READMODE);
	oFF.FeatureToggleOlap.HIERARCHY_LEVEL = oFF.FeatureToggleOlap.create("Olap.ResultSetHierarchyLevel", oFF.XVersion.V149_HIERARCHY_LEVEL);
	oFF.FeatureToggleOlap.ACTIVATE_DEFAULT_HIERARCHY = oFF.FeatureToggleOlap.create("Olap.ActivateDefaultHierarchy", oFF.XVersion.V151_ACTIVATE_DEFAULT_HIERARCHY);
	oFF.FeatureToggleOlap.CORRECT_DRILLSTATE_IN_CLASSIC_RESULTSET = oFF.FeatureToggleOlap.create("Olap.CorrectDrillStateInClassicResultSet", oFF.XVersion.V156_CORRECT_DRILLSTATE_IN_CLASSIC_RESULTSET);
	oFF.FeatureToggleOlap.UNIVERSAL_DISPLAY_HIERARCHY_ZERO_BASED = oFF.FeatureToggleOlap.create("Olap.UniversalDisplayHierarchyZeroBased", oFF.XVersion.V158_UNIVERSAL_DISPLAY_HIERARCHY_ZERO_BASED);
	oFF.FeatureToggleOlap.OPTIMIZE_HIERARCHY_EXPORT = oFF.FeatureToggleOlap.create("Olap.OptimizeHierarchyExport", oFF.XVersion.V160_OPTIMIZE_HIERARCHY_EXPORT);
	oFF.FeatureToggleOlap.CUBE_CACHE = oFF.FeatureToggleOlap.create("Olap.CubeCache", oFF.XVersion.V166_CUBE_CACHE);
	oFF.FeatureToggleOlap.EXT_KEYFIGURE_PROPERTIES = oFF.FeatureToggleOlap.create("Olap.ExtKeyfigureProperties", oFF.XVersion.V168_EXT_KEYFIGURE_PROPERTIES);
	oFF.FeatureToggleOlap.EXPORT_FREE_AXIS_FOR_PLANNING = oFF.FeatureToggleOlap.create("Olap.FreeAxisForPlanning", oFF.XVersion.V170_EXPORT_FREE_AXIS_FOR_PLANNING);
	oFF.FeatureToggleOlap.NUMBER_AS_STRING = oFF.FeatureToggleOlap.create("Olap.NumberAsString", oFF.XVersion.V172_NUMBER_AS_STRING);
	oFF.FeatureToggleOlap.QDATA_CELL_MODEL_DEFAULTS = oFF.FeatureToggleOlap.create("Olap.QDataCellModelDefaults", oFF.XVersion.V174_QDATA_CELL_MODEL_DEFAULTS);
	oFF.FeatureToggleOlap.CLIENT_INFO_METADATA = oFF.FeatureToggleOlap.create("Olap.ClientInfoMetadata", oFF.XVersion.V176_CLIENT_INFO_METADATA);
	oFF.FeatureToggleOlap.OPTIMIZE_MDS_CATALOG = oFF.FeatureToggleOlap.create("Olap.OptimzeMdsCatalog", oFF.XVersion.V178_OPTIMIZE_MDS_CATALOG);
	oFF.FeatureToggleOlap.SINGLE_VALUE_VARIABLES_ONLY_INCLUDE = oFF.FeatureToggleOlap.create("Olap.SingleValueVariablesOnlyInclude", oFF.XVersion.V184_SINGLE_VALUE_VARS_NO_SUPPORT_EXCLUDING);
	oFF.FeatureToggleOlap.DISP_HIERARCHY_FIX_IN_FILTER = oFF.FeatureToggleOlap.create("Olap.DisplayHierarchyFixInFilter", oFF.XVersion.V186_DISP_HIERARCHY_FIX_IN_FILTER);
	oFF.FeatureToggleOlap.MEMBER_VALUE_EXCEPTIONS = oFF.FeatureToggleOlap.create("Olap.SupportsMemberValueExceptions", oFF.XVersion.V188_MEMBER_VALUE_EXCEPTIONS);
	oFF.FeatureToggleOlap.METADATA_CUBE_RESPONSE_SUPPRESS_PROPERTIES = oFF.FeatureToggleOlap.create("Olap.MetadataCubeResponseSuppressProperties", oFF.XVersion.V190_METADATA_CUBE_RESPONSE_SUPPRESS_PROPERTIES);
	oFF.FeatureToggleOlap.FUSION_SERVICE = oFF.FeatureToggleOlap.create("Olap.FusionService", oFF.XVersion.V192_FUSION_SERVICE);
	oFF.FeatureToggleOlap.SIMPLIFIED_CAPABILITY_MERGE = oFF.FeatureToggleOlap.create("Olap.CapabilityMerge", oFF.XVersion.V194_SIMPLIFIED_CAPABILITY_MERGE);
	oFF.FeatureToggleOlap.CORRECT_DIMENSION_DESCRIPTION = oFF.FeatureToggleOlap.create("Olap.CorrectDimensionDescription", oFF.XVersion.V198_CORRECT_DIMENSION_DESCRIPTION);
	oFF.FeatureToggleOlap.AUTO_CSRF_CALL = oFF.FeatureToggleOlap.create("Rpc.AutoCsrfCall", oFF.XVersion.V200_AUTO_CSRF_CALL);
	oFF.FeatureToggleOlap.SERVER_METADATA_VIA_SYSTEM_CONNECT = oFF.FeatureToggleOlap.create("Rpc.ServerMetadataViaSystemConnect", oFF.XVersion.V202_SERVER_METADATA_VIA_SYSTEM_CONNECT);
	oFF.FeatureToggleOlap.UNIFIED_DATACELLS = oFF.FeatureToggleOlap.create("Olap.UnifiedDataCells", oFF.XVersion.V204_UNIFIED_DATACELLS);
	oFF.FeatureToggleOlap.DATASOURCE_TYPE_QUERY_METADATA = oFF.FeatureToggleOlap.create("Olap.DataSourceTypeQueryMetadata", oFF.XVersion.V210_DATASOURCE_TYPE_QUERY_METADATA);
	oFF.FeatureToggleOlap.DATASOURCE_TYPE_QUERY = oFF.FeatureToggleOlap.create("Olap.DataSourceTypeQuery", oFF.XVersion.V212_DATASOURCE_TYPE_QUERY);
	oFF.FeatureToggleOlap.CUBE_BLENDING_N_QUERIES = oFF.FeatureToggleOlap.create("Olap.CubeBlendingNSubqueries", oFF.XVersion.V214_CUBE_BLENDING_N_QUERIES);
	oFF.FeatureToggleOlap.TUPLES_OPERAND = oFF.FeatureToggleOlap.create("Olap.TuplesOperand", oFF.XVersion.V216_TUPLES_OPERAND);
	oFF.FeatureToggleOlap.WINDOW_FUNCTION = oFF.FeatureToggleOlap.create("Olap.WindowFunction", oFF.XVersion.V218_WINDOW_FUNCTION);
	oFF.FeatureToggleOlap.UNIVERSE_SOURCE_QUERY = oFF.FeatureToggleOlap.create("Olap.UniverseSourceQuery", oFF.XVersion.V220_UNIVERSE_SOURCE_QUERY);
	oFF.FeatureToggleOlap.SHARED_CSRF_TOKENS = oFF.FeatureToggleOlap.create("Rpc.SharedCsrfTokens", oFF.XVersion.V222_SHARED_CSRF_TOKENS);
	oFF.FeatureToggleOlap.METADATA_DIMENSION_OTHERS = oFF.FeatureToggleOlap.create("Olap.MetadataDimensionOthers", oFF.XVersion.V224_METADATA_DIMENSION_OTHERS);
	oFF.FeatureToggleOlap.METADATA_DIMENSION_IS_MODELED = oFF.FeatureToggleOlap.create("Olap.MetadataDimensionIsModeled", oFF.XVersion.V226_METADATA_DIMENSION_IS_MODELED);
	oFF.FeatureToggleOlap.SUPPRESS_SUPPLEMENTS = oFF.FeatureToggleOlap.create("Olap.SuppressSupplements", oFF.XVersion.V230_SUPPRESS_SUPPLEMENTS);
	oFF.FeatureToggleOlap.SID_PRESENTATION = oFF.FeatureToggleOlap.create("Olap.SupportsSIDPresentation", oFF.XVersion.V232_SID_PRESENTATION);
	oFF.FeatureToggleOlap.NAMED_CUSTOM_DIMENSION_MEMBER = oFF.FeatureToggleOlap.create("Olap.NamedCustomDimensionMember", oFF.XVersion.V236_NAMED_CUSTOM_DIMENSION_MEMBER);
	oFF.FeatureToggleOlap.CUSTOM_DIMENSION_2_FOR_AGILE_BI = oFF.FeatureToggleOlap.create("AgileBI.CustomDimension2", oFF.XVersion.V244_CUSTOM_DIMENSION_2_AGILE_BI);
	oFF.FeatureToggleOlap.CUSTOM_DIMENSION_2_FOR_INA_MODEL = oFF.FeatureToggleOlap.create("InAModel.CustomDimension2", oFF.XVersion.V246_CUSTOM_DIMENSION_2_INA_MODEL);
	oFF.FeatureToggleOlap.DYN_MEMBERS_ON_NON_MEASURE_STRUCTURE = oFF.FeatureToggleOlap.create("Olap.DynamicMembersOnNonMeasureStructure", oFF.XVersion.V248_DYN_MEMBERS_ON_NON_MEASURE_STRUCTURE);
	oFF.FeatureToggleOlap.UDH_ALIGNMENT = oFF.FeatureToggleOlap.create("Olap.UniversalDisplayHierarchyAlignment", oFF.XVersion.V250_UDH_ALIGNMENT);
	oFF.FeatureToggleOlap.NULL_ZERO_SUPPRESSION = oFF.FeatureToggleOlap.create("Olap.NullZeroSuppression", oFF.XVersion.V254_NULL_ZERO_SUPPRESSION);
	oFF.FeatureToggleOlap.INPUT_READINESS_WITH_NAVIGATIONAL_ATTRIBUTES = oFF.FeatureToggleOlap.create("Olap.InputReadinessWithNavigationalAttributes", oFF.XVersion.V256_INPUT_READINESS_WITH_NAVIGATIONAL_ATTRIBUTES);
	oFF.FeatureToggleOlap.RESULTSET_CELL_MEASURE = oFF.FeatureToggleOlap.create("Olap.ResultSetCellMeasure", oFF.XVersion.V264_RESULTSET_CELL_MEASURE);
	oFF.FeatureToggleOlap.RESULTSETV2_METADATA_EXTENSION1 = oFF.FeatureToggleOlap.create("Olap.ResultSetV2MetadataExtension1", oFF.XVersion.V266_RESULTSETV2_METADATA_EXTENSION1);
	oFF.FeatureToggleOlap.RESULTSET_CELL_FORMAT_TYPE_SPECIFIC = oFF.FeatureToggleOlap.create("Olap.ResultSetCellFormatTypeSpecific", oFF.XVersion.V268_RESULTSET_CELL_FORMAT_TYPE_SPECIFIC);
	oFF.FeatureToggleOlap.ITERATED_FORMULA = oFF.FeatureToggleOlap.create("Olap.IteratedFormula", oFF.XVersion.V270_ITERATED_FORMULA);
	oFF.FeatureToggleOlap.CDS_PROJECTION_VIEWS = oFF.FeatureToggleOlap.create("Olap.CDSProjectionViews", oFF.XVersion.V272_CDS_PROJECTION_VIEWS);
	oFF.FeatureToggleOlap.CELL_DOCUMENT_ID = oFF.FeatureToggleOlap.create("Olap.CellDocumentId", oFF.XVersion.V274_CELL_DOCUMENT_ID);
	oFF.FeatureToggleOlap.IMPROVED_DYNAMIC_VARIABLE_UPDATE = oFF.FeatureToggleOlap.create("Olap.ImprovedDynamicVariableUpdate", oFF.XVersion.V276_IMPROVED_DYNAMIC_VARIABLE_UPDATE);
	oFF.FeatureToggleOlap.INA_SHIFT_PERIOD_FOR_TRANSIENT_TIME_OPERATIONS = oFF.FeatureToggleOlap.create("InAShiftPeriodForTransientTimeOperations", oFF.XVersion.V278_INA_SHIFT_PERIOD_FOR_TRANSIENT_TIME_OPERATIONS);
	oFF.FeatureToggleOlap.SFX_MINIMUM_DRILL_STATE = oFF.FeatureToggleOlap.create("Olap.SfxMinimumDrillState", oFF.XVersion.V282_SFX_MINIMUM_DRILL_STATE);
	oFF.FeatureToggleOlap.SFX_HIDDEN_DIMENSIONS = oFF.FeatureToggleOlap.create("Olap.SfxHiddenDimensions", oFF.XVersion.V284_SFX_HIDDEN_DIMENSIONS);
	oFF.FeatureToggleOlap.AUTO_VARIABLE_SUBMIT_CAPABILITY = oFF.FeatureToggleOlap.create("Olap.AutoVariableSubmitCapability", oFF.XVersion.V286_AUTO_VARIABLE_SUBMIT_CAPABILITY);
	oFF.FeatureToggleOlap.AUTO_VARIABLE_SUBMIT_FUNCTIONALITY = oFF.FeatureToggleOlap.create("Olap.AutoVariableSubmitFunctionality", oFF.XVersion.V287_AUTO_VARIABLE_SUBMIT_FUNCTIONALITY);
	oFF.FeatureToggleOlap.AUTO_VARIABLE_SUBMIT_FOR_FULL_QM = oFF.FeatureToggleOlap.create("Olap.AutoVarSubmitFullQM", oFF.XVersion.V287_AUTO_VARIABLE_SUBMIT_FUNCTIONALITY);
	oFF.FeatureToggleOlap.MULTIPLE_ACCOUNT_HIERARCHIES = oFF.FeatureToggleOlap.create("Olap.MultipleAccountHierarchies", oFF.XVersion.V288_MULTIPLE_ACCOUNT_HIERARCHIES);
	oFF.FeatureToggleOlap.MEMBER_OVERRIDE_TEXTS = oFF.FeatureToggleOlap.create("Olap.MemberOverrideTexts", oFF.XVersion.V292_MEMBER_OVERRIDE_TEXTS);
	oFF.FeatureToggleOlap.HIERARCHY_PATH_PRESENTATION_TYPE = oFF.FeatureToggleOlap.create("Olap.HierarchyPathPresentationType", oFF.XVersion.V294_HIERARCHY_PATH_PRESENTATION_TYPE);
	oFF.FeatureToggleOlap.DIMENSION_KEY_ATTRIBUTES = oFF.FeatureToggleOlap.create("Olap.DimensionKeyAttributes", oFF.XVersion.V296_DIMENSION_KEY_ATTRIBUTES);
	oFF.FeatureToggleOlap.TUPLE_COUNT_BEFORE_SLICING = oFF.FeatureToggleOlap.create("Olap.TupleCountBeforeSlicing", oFF.XVersion.V298_TUPLE_COUNT_BEFORE_SLICING);
	oFF.FeatureToggleOlap.INA_REPOSITORY_DELTA = oFF.FeatureToggleOlap.create("Olap.DeltaRepoFormat", oFF.XVersion.V300_INA_REPOSITORY_DELTA);
	oFF.FeatureToggleOlap.TEXT_IN_HIERARCHY = oFF.FeatureToggleOlap.create("Olap.TextInHierarchy", oFF.XVersion.V302_TEXT_IN_HIERARCHY);
	oFF.FeatureToggleOlap.QUERY_ALIAS_FROM_CATALOG = oFF.FeatureToggleOlap.create("Catalog.QueryAlias", oFF.XVersion.V304_QUERY_ALIAS_FROM_CATALOG);
	oFF.FeatureToggleOlap.LAZY_LOADING_SFX_ACCOUNT_MEMBERS = oFF.FeatureToggleOlap.create("Olap.LazyLoadingSFXAccountMembers", oFF.XVersion.V306_LAZY_LOADING_SFX_ACCOUNT_MEMBERS);
	oFF.FeatureToggleOlap.ASYNC_BLENDING_BATCH_REQUEST = oFF.FeatureToggleOlap.create("Olap.AsyncBlendingBatchRequest", oFF.XVersion.V308_ASYNC_BLENDING_BATCH_REQUEST);
	oFF.FeatureToggleOlap.HAS_CHECK_TABLE_DEFAULT_FALSE = oFF.FeatureToggleOlap.create("Olap.HasCheckTableDefaultFalse", oFF.XVersion.V310_HAS_CHECK_TABLE_DEFAULT_FALSE);
	oFF.FeatureToggleOlap.UNDO_USE_ALLOW_LIST = oFF.FeatureToggleOlap.create("Olap.UseAllowList", oFF.XVersion.V312_UNDO_USE_ALLOW_LIST);
	oFF.FeatureToggleOlap.UNDO_RELEASE_QUERY_MANAGERS = oFF.FeatureToggleOlap.create("Olap.UndoReleaseQueryManagers", oFF.XVersion.V314_UNDO_RELEASE_QUERY_MANAGERS);
	oFF.FeatureToggleOlap.BW_SESSION_ID_VIA_GET_RESPONSE = oFF.FeatureToggleOlap.create("Rpc.BwSessionIdViaGetResponse", oFF.XVersion.V316_BW_SESSION_ID_VIA_GET_RESPONSE);
	oFF.FeatureToggleOlap.TIME_MEASURE_WITH_FLAT_AND_HIERARCHICAL_FILTER = oFF.FeatureToggleOlap.create("Olap.TimeMeasureWithFlatAndHierarchicalFilter", oFF.XVersion.V318_TIME_MEASURE_WITH_FLAT_AND_HIERARCHICAL_FILTER);
	oFF.FeatureToggleOlap.MAINTAIN_VARIABLE_VARIANTS = oFF.FeatureToggleOlap.create("Olap.MaintainsVariableVariants", oFF.XVersion.V320_MAINTAIN_VARIABLE_VARIANTS);
	oFF.FeatureToggleOlap.HIERARCHY_CATALOG = oFF.FeatureToggleOlap.create("Olap.HierarchyCatalog", oFF.XVersion.V322_HIERARCHY_CATALOG);
	oFF.FeatureToggleOlap.EXTERNALIZED_DYNAMIC_FILTER = oFF.FeatureToggleOlap.create("Olap.ExternalizeDynamicFilter", oFF.XVersion.MAX + 1);
	oFF.FeatureToggleOlap.LOV_BASED_FILTER_ACROSS_MODELS = oFF.FeatureToggleOlap.create("Olap.LovBasedFilterAcrossModels", oFF.XVersion.MAX + 1);
	oFF.FeatureToggleOlap.CLONE_LINKED_FILTERS = oFF.FeatureToggleOlap.create("Olap.CloneLinkedFilters", oFF.XVersion.MAX + 1);
	oFF.FeatureToggleOlap.METADATA_CACHING = oFF.FeatureToggleOlap.create("Olap.MetadataCaching", oFF.XVersion.MAX + 1);
	oFF.FeatureToggleOlap.DONT_ALWAYS_REQUEST_TEXTFIELD = oFF.FeatureToggleOlap.create("Olap.DontAlwaysRequestTextField", oFF.XVersion.MAX + 1);
	oFF.FeatureToggleOlap.DEVELOPMENT_MODE = oFF.FeatureToggleOlap.create("Olap.DevelopmentMode", oFF.XVersion.MAX + 1);
	oFF.FeatureToggleOlap.DEVELOPMENT_MODE_PLANNING = oFF.FeatureToggleOlap.create("Olap.DevelopmentModePlanning", oFF.XVersion.MAX + 1);
};
oFF.FeatureToggleOlap.create = function(name, xVersion)
{
	var object = oFF.XConstant.setupName(new oFF.FeatureToggleOlap(), name);
	object.m_xVersion = xVersion;
	oFF.FeatureToggleOlap.s_lookup.add(object);
	return object;
};
oFF.FeatureToggleOlap.getAllFeatureToggles = function()
{
	return oFF.FeatureToggleOlap.s_lookup;
};
oFF.FeatureToggleOlap.lookup = function(featureToggleName)
{
	return oFF.FeatureToggleOlap.s_lookup.getByKey(featureToggleName);
};
oFF.FeatureToggleOlap.prototype.m_xVersion = 0;
oFF.FeatureToggleOlap.prototype.getMaxXVersion = function()
{
	return this.m_xVersion;
};
oFF.FeatureToggleOlap.prototype.getXVersion = function()
{
	return this.m_xVersion;
};

oFF.WorkingTaskManagerType = function() {};
oFF.WorkingTaskManagerType.prototype = new oFF.XConstant();
oFF.WorkingTaskManagerType.prototype._ff_c = "WorkingTaskManagerType";

oFF.WorkingTaskManagerType.SINGLE_THREADED = null;
oFF.WorkingTaskManagerType.MULTI_THREADED = null;
oFF.WorkingTaskManagerType.UI_DRIVER = null;
oFF.WorkingTaskManagerType.staticSetup = function()
{
	oFF.WorkingTaskManagerType.SINGLE_THREADED = oFF.XConstant.setupName(new oFF.WorkingTaskManagerType(), "SingleThreaded");
	oFF.WorkingTaskManagerType.MULTI_THREADED = oFF.XConstant.setupName(new oFF.WorkingTaskManagerType(), "MultiThreaded");
	oFF.WorkingTaskManagerType.UI_DRIVER = oFF.XConstant.setupName(new oFF.WorkingTaskManagerType(), "UiDriver");
};

oFF.XHierarchyAction = function() {};
oFF.XHierarchyAction.prototype = new oFF.SyncAction();
oFF.XHierarchyAction.prototype._ff_c = "XHierarchyAction";

oFF.XHierarchyAction.createAndRun = function(session, result, listener, customIdentifier)
{
	var newObj = new oFF.XHierarchyAction();
	newObj.setupAction(oFF.SyncType.BLOCKING, listener, customIdentifier, session);
	newObj.setData(result);
	newObj.process();
	return newObj;
};
oFF.XHierarchyAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	var children = null;
	if (oFF.notNull(data))
	{
		children = data.getChildren();
	}
	listener.onChildFetched(extResult, data, children, customIdentifier);
};

oFF.SyncState = function() {};
oFF.SyncState.prototype = new oFF.XConstantWithParent();
oFF.SyncState.prototype._ff_c = "SyncState";

oFF.SyncState.OUT_OF_SYNC = null;
oFF.SyncState.PROCESSING = null;
oFF.SyncState.IN_SYNC = null;
oFF.SyncState.IN_SYNC_WITH_ERROR = null;
oFF.SyncState.staticSetup = function()
{
	oFF.SyncState.OUT_OF_SYNC = oFF.SyncState.create("OUT_OF_SYNC", 0, null);
	oFF.SyncState.PROCESSING = oFF.SyncState.create("PROCESSING", 1, null);
	oFF.SyncState.IN_SYNC = oFF.SyncState.create("IN_SYNC", 2, null);
	oFF.SyncState.IN_SYNC_WITH_ERROR = oFF.SyncState.create("IN_SYNC_WITH_ERROR", 2, oFF.SyncState.IN_SYNC);
};
oFF.SyncState.create = function(name, level, parent)
{
	var syncState = new oFF.SyncState();
	syncState.setupExt(name, parent);
	syncState.setLevel(level);
	return syncState;
};
oFF.SyncState.prototype.m_level = 0;
oFF.SyncState.prototype.getLevel = function()
{
	return this.m_level;
};
oFF.SyncState.prototype.setLevel = function(level)
{
	this.m_level = level;
};
oFF.SyncState.prototype.isInSync = function()
{
	return this.isTypeOf(oFF.SyncState.IN_SYNC);
};
oFF.SyncState.prototype.isNotInSync = function()
{
	return !this.isTypeOf(oFF.SyncState.IN_SYNC);
};

oFF.SyncActionMultithreading = function() {};
oFF.SyncActionMultithreading.prototype = new oFF.SyncAction();
oFF.SyncActionMultithreading.prototype._ff_c = "SyncActionMultithreading";

oFF.SyncActionMultithreading.prototype.m_workingTaskHandleMain = null;
oFF.SyncActionMultithreading.prototype.m_workingTaskHandleWorker = null;
oFF.SyncActionMultithreading.prototype.m_isMultiThreading = false;
oFF.SyncActionMultithreading.prototype.m_isFinishedOnWorkerThread = false;
oFF.SyncActionMultithreading.prototype.m_workerSyncType = null;
oFF.SyncActionMultithreading.prototype.processSynchronization = function(syncType)
{
	var doContinue;
	if (syncType === oFF.SyncType.NON_BLOCKING)
	{
		this.m_isMultiThreading = true;
		var workingTaskManager = this.getSession().getWorkingTaskManager();
		this.m_workingTaskHandleMain = workingTaskManager.createHandle(this);
		this.m_workingTaskHandleMain.addInputChunk(syncType);
		doContinue = true;
	}
	else
	{
		doContinue = this.processSynchronizationMultithreading(syncType);
	}
	return doContinue;
};
oFF.SyncActionMultithreading.prototype.processInputOnWorkerThread = function(handle)
{
	if (handle.hasNextInputChunk() && oFF.isNull(this.m_workerSyncType))
	{
		this.m_workerSyncType = handle.nextInputChunk();
		this.m_workingTaskHandleWorker = handle;
	}
	this.processSynchronization(this.m_workerSyncType);
};
oFF.SyncActionMultithreading.prototype.endSync = function()
{
	if (this.m_isMultiThreading)
	{
		this.m_workingTaskHandleWorker.publishOutputChunk(this.getData());
		this.m_isFinishedOnWorkerThread = true;
	}
	else
	{
		oFF.SyncAction.prototype.endSync.call( this );
	}
};
oFF.SyncActionMultithreading.prototype.isFinishedOnWorkerThread = function(handle)
{
	return this.m_isFinishedOnWorkerThread;
};
oFF.SyncActionMultithreading.prototype.processOutputOnMainThread = function(handle)
{
	if (handle.hasNextOutputChunk())
	{
		handle.nextOutputChunk();
		oFF.SyncAction.prototype.endSync.call( this );
	}
};

oFF.SyncActionSequence = function() {};
oFF.SyncActionSequence.prototype = new oFF.SyncAction();
oFF.SyncActionSequence.prototype._ff_c = "SyncActionSequence";

oFF.SyncActionSequence.create = function(syncType, listener, customIdentifier, context)
{
	var sequence = new oFF.SyncActionSequence();
	sequence.setupAction(syncType, listener, customIdentifier, context);
	return sequence;
};
oFF.SyncActionSequence.prototype.m_actions = null;
oFF.SyncActionSequence.prototype.m_dataAction = null;
oFF.SyncActionSequence.prototype.m_listenerAction = null;
oFF.SyncActionSequence.prototype.m_finalizeListener = null;
oFF.SyncActionSequence.prototype.setupAction = function(syncType, listener, customIdentifier, context)
{
	oFF.SyncAction.prototype.setupAction.call( this , syncType, listener, customIdentifier, context);
	this.m_actions = oFF.XList.create();
};
oFF.SyncActionSequence.prototype.releaseObject = function()
{
	this.m_actions = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_actions);
	this.m_dataAction = null;
	oFF.SyncAction.prototype.releaseObject.call( this );
};
oFF.SyncActionSequence.prototype._getActions = function()
{
	return this.m_actions;
};
oFF.SyncActionSequence.prototype.addAction = function(action)
{
	this.m_actions.add(action);
};
oFF.SyncActionSequence.prototype.setMainAction = function(action)
{
	this.addAction(action);
	this.setDataAction(action);
	this.setListenerAction(action);
};
oFF.SyncActionSequence.prototype.setDataAction = function(action)
{
	this.m_dataAction = action;
};
oFF.SyncActionSequence.prototype.setListenerAction = function(action)
{
	this.m_listenerAction = action;
};
oFF.SyncActionSequence.prototype.getMainAction = function()
{
	return this.m_dataAction;
};
oFF.SyncActionSequence.prototype.processSynchronization = function(syncType)
{
	oFF.XObjectExt.assertNotNullExt(this.m_dataAction, "Main action not set.");
	if (syncType === oFF.SyncType.BLOCKING)
	{
		for (var i = 0; i < this.m_actions.size(); i++)
		{
			var syncAction = this.m_actions.get(i);
			syncAction.setActiveSyncType(syncType);
			syncAction.process();
			this.addAllMessages(syncAction);
			this.onActionExecuted(syncAction);
			if (syncAction.hasErrors())
			{
				break;
			}
		}
	}
	else
	{
		if (this.m_actions.size() > 0)
		{
			var asyncAction = this.m_actions.get(0);
			asyncAction.attachListener(this, oFF.ListenerType.SYNC_LISTENER, oFF.XIntegerValue.create(0));
			asyncAction.setActiveSyncType(syncType);
			asyncAction.process();
			return true;
		}
	}
	this.endSync();
	return false;
};
oFF.SyncActionSequence.prototype.onSynchronized = function(messages, data, customIdentifier)
{
	this.addAllMessages(messages);
	var number = customIdentifier;
	var numberValue = number.getInteger();
	var currentAction = this.m_actions.get(numberValue);
	this.onActionExecuted(currentAction);
	if (this.isSyncCanceled())
	{
		this.addError(oFF.ErrorCodes.OTHER_ERROR, "Sequence execution cancelled");
	}
	var isLast = numberValue === this.m_actions.size() - 1;
	if (isLast || messages.hasErrors())
	{
		this.endSync();
	}
	else
	{
		numberValue = numberValue + 1;
		var nextAction = this.m_actions.get(numberValue);
		nextAction.attachListener(this, oFF.ListenerType.SYNC_LISTENER, oFF.XIntegerValue.create(numberValue));
		nextAction.setActiveSyncType(oFF.SyncType.NON_BLOCKING);
		nextAction.process();
	}
};
oFF.SyncActionSequence.prototype.onActionExecuted = function(syncAction) {};
oFF.SyncActionSequence.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	this.m_listenerAction.callListener(extResult, listener, data, customIdentifier);
};
oFF.SyncActionSequence.prototype.setFinalizeListener = function(listener)
{
	this.m_finalizeListener = listener;
};
oFF.SyncActionSequence.prototype.endSync = function()
{
	var data = this.m_dataAction.getData();
	this.setData(data);
	oFF.SyncAction.prototype.endSync.call( this );
	if (oFF.notNull(this.m_finalizeListener))
	{
		this.m_finalizeListener.onActionSequenceFinalized(this, data);
	}
};

oFF.XCacheProviderFileOpenAction = function() {};
oFF.XCacheProviderFileOpenAction.prototype = new oFF.SyncAction();
oFF.XCacheProviderFileOpenAction.prototype._ff_c = "XCacheProviderFileOpenAction";

oFF.XCacheProviderFileOpenAction.createAndRun = function(syncType, listener, customIdentifier, cacheProvider, properties)
{
	var object = new oFF.XCacheProviderFileOpenAction();
	object.m_properties = properties;
	object.setupActionAndRun(syncType, listener, customIdentifier, cacheProvider);
	return object;
};
oFF.XCacheProviderFileOpenAction.prototype.m_properties = null;
oFF.XCacheProviderFileOpenAction.prototype.processSynchronization = function(syncType)
{
	var provider = this.getActionContext();
	var deviceCacheDir = this.m_properties.getStringByKey(oFF.XCacheProviderFactory.PARAMETER_URL);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(deviceCacheDir))
	{
		var dir = oFF.XFile.create(this.getSession(), deviceCacheDir);
		if (dir.isExisting() === false)
		{
			dir.mkdirExt(true);
		}
		else if (dir.isDirectory() === false)
		{
			this.addError(0, oFF.XStringUtils.concatenate2("Directory for cache is existing and not a directory: ", deviceCacheDir));
			dir = null;
		}
		if (oFF.notNull(dir))
		{
			provider.setDirectory(dir);
		}
	}
	else
	{
		this.addError(0, "No parameter 'url' is given for the cache directory");
	}
	this.setData(this.getActionContext());
	return false;
};
oFF.XCacheProviderFileOpenAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onCacheProviderOpen(extResult, data, customIdentifier);
};

oFF.XCacheProviderOpenAction = function() {};
oFF.XCacheProviderOpenAction.prototype = new oFF.SyncAction();
oFF.XCacheProviderOpenAction.prototype._ff_c = "XCacheProviderOpenAction";

oFF.XCacheProviderOpenAction.createAndRun = function(syncType, listener, customIdentifier, cacheProvider, properties)
{
	var object = new oFF.XCacheProviderOpenAction();
	object.setupActionAndRun(syncType, listener, customIdentifier, cacheProvider);
	return object;
};
oFF.XCacheProviderOpenAction.prototype.processSynchronization = function(syncType)
{
	this.setData(this.getActionContext());
	return false;
};
oFF.XCacheProviderOpenAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onCacheProviderOpen(extResult, data, customIdentifier);
};

oFF.XCacheProviderReadAction = function() {};
oFF.XCacheProviderReadAction.prototype = new oFF.SyncAction();
oFF.XCacheProviderReadAction.prototype._ff_c = "XCacheProviderReadAction";

oFF.XCacheProviderReadAction.createAndRun = function(syncType, listener, customIdentifier, cacheProvider, namespace, name, validityTime)
{
	var object = new oFF.XCacheProviderReadAction();
	object.m_namespace = namespace;
	object.m_name = name;
	object.m_validityTime = validityTime;
	object.setupActionAndRun(syncType, listener, customIdentifier, cacheProvider);
	return object;
};
oFF.XCacheProviderReadAction.prototype.m_namespace = null;
oFF.XCacheProviderReadAction.prototype.m_name = null;
oFF.XCacheProviderReadAction.prototype.m_validityTime = 0;
oFF.XCacheProviderReadAction.prototype.processSynchronization = function(syncType)
{
	var cacheProvider = this.getActionContext();
	var value = cacheProvider.readStringFromCache(this.m_namespace, this.m_name, this.m_validityTime);
	var content = oFF.XContent.createStringContent(oFF.ContentType.TEXT, value);
	this.setData(content);
	return false;
};
oFF.XCacheProviderReadAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onCacheRead(extResult, data, customIdentifier);
};

oFF.XCacheProviderWriteAction = function() {};
oFF.XCacheProviderWriteAction.prototype = new oFF.SyncAction();
oFF.XCacheProviderWriteAction.prototype._ff_c = "XCacheProviderWriteAction";

oFF.XCacheProviderWriteAction.createAndRun = function(syncType, listener, customIdentifier, cacheProvider, namespace, name, content, maxCount)
{
	var object = new oFF.XCacheProviderWriteAction();
	object.m_namespace = namespace;
	object.m_name = name;
	object.m_content = content;
	object.m_maxCount = maxCount;
	object.setData(content);
	object.setupActionAndRun(syncType, listener, customIdentifier, cacheProvider);
	return object;
};
oFF.XCacheProviderWriteAction.prototype.m_namespace = null;
oFF.XCacheProviderWriteAction.prototype.m_name = null;
oFF.XCacheProviderWriteAction.prototype.m_content = null;
oFF.XCacheProviderWriteAction.prototype.m_maxCount = 0;
oFF.XCacheProviderWriteAction.prototype.processSynchronization = function(syncType)
{
	var cacheProvider = this.getActionContext();
	if (this.m_content.isStringContentSet())
	{
		cacheProvider.writeStringToCache(this.m_namespace, this.m_name, this.m_content.getString(), this.m_maxCount);
	}
	else if (this.m_content.isJsonContentSet())
	{
		cacheProvider.writeElementToCache(this.m_namespace, this.m_name, this.m_content.getJsonContent(), this.m_maxCount);
	}
	return false;
};
oFF.XCacheProviderWriteAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onCacheWrite(extResult, data, customIdentifier);
};

oFF.RpcRequestType = function() {};
oFF.RpcRequestType.prototype = new oFF.XConstantWithParent();
oFF.RpcRequestType.prototype._ff_c = "RpcRequestType";

oFF.RpcRequestType.NONE = null;
oFF.RpcRequestType.UNKNOWN = null;
oFF.RpcRequestType.SYSTEM_LANDSCAPE = null;
oFF.RpcRequestType.INA = null;
oFF.RpcRequestType.SERVER_METADATA = null;
oFF.RpcRequestType.ANALYTICS = null;
oFF.RpcRequestType.METADATA = null;
oFF.RpcRequestType.LIST_REPORTING = null;
oFF.RpcRequestType.PLANNING = null;
oFF.RpcRequestType.BATCH = null;
oFF.RpcRequestType.CLOSE_DP = null;
oFF.RpcRequestType.LOGOUT = null;
oFF.RpcRequestType.PREFLIGHT = null;
oFF.RpcRequestType.s_lookup = null;
oFF.RpcRequestType.staticSetup = function()
{
	oFF.RpcRequestType.s_lookup = oFF.XHashMapByString.create();
	oFF.RpcRequestType.NONE = oFF.RpcRequestType.create("None", null);
	oFF.RpcRequestType.UNKNOWN = oFF.RpcRequestType.create("Unknown", null);
	oFF.RpcRequestType.SYSTEM_LANDSCAPE = oFF.RpcRequestType.create("SystemLandscape", null);
	oFF.RpcRequestType.INA = oFF.RpcRequestType.create("InA", null);
	oFF.RpcRequestType.SERVER_METADATA = oFF.RpcRequestType.create("ServerMetadata", oFF.RpcRequestType.INA);
	oFF.RpcRequestType.ANALYTICS = oFF.RpcRequestType.create("Analytics", oFF.RpcRequestType.INA);
	oFF.RpcRequestType.LIST_REPORTING = oFF.RpcRequestType.create("ListReporting", oFF.RpcRequestType.INA);
	oFF.RpcRequestType.METADATA = oFF.RpcRequestType.create("Metadata", oFF.RpcRequestType.INA);
	oFF.RpcRequestType.PLANNING = oFF.RpcRequestType.create("Planning", oFF.RpcRequestType.INA);
	oFF.RpcRequestType.BATCH = oFF.RpcRequestType.create("Batch", oFF.RpcRequestType.INA);
	oFF.RpcRequestType.CLOSE_DP = oFF.RpcRequestType.create("CloseDp", oFF.RpcRequestType.INA);
	oFF.RpcRequestType.LOGOUT = oFF.RpcRequestType.create("Logout", null);
	oFF.RpcRequestType.PREFLIGHT = oFF.RpcRequestType.create("Preflight", null);
};
oFF.RpcRequestType.create = function(name, parent)
{
	var theConstant = new oFF.RpcRequestType();
	theConstant.setupExt(name, parent);
	oFF.RpcRequestType.s_lookup.put(name, theConstant);
	return theConstant;
};
oFF.RpcRequestType.lookup = function(name)
{
	var result = oFF.RpcRequestType.s_lookup.getByKey(name);
	if (oFF.isNull(result))
	{
		result = oFF.RpcRequestType.UNKNOWN;
	}
	return result;
};
oFF.RpcRequestType.detectTypeFromJson = function(structure)
{
	var result = oFF.RpcRequestType.NONE;
	if (oFF.notNull(structure))
	{
		var structureNames = structure.getKeysAsReadOnlyListOfString();
		if (structureNames.size() === 1)
		{
			result = oFF.RpcRequestType.lookup(structureNames.get(0));
		}
		else
		{
			var keys = oFF.RpcRequestType.s_lookup.getKeysAsReadOnlyListOfString();
			var len = keys.size();
			result = oFF.RpcRequestType.UNKNOWN;
			for (var i = 0; i < len; i++)
			{
				var typeName = keys.get(i);
				var element = structure.getByKey(typeName);
				if (oFF.notNull(element) && element.isStructure())
				{
					result = oFF.RpcRequestType.s_lookup.getByKey(typeName);
					break;
				}
			}
		}
	}
	return result;
};

oFF.ContentType = function() {};
oFF.ContentType.prototype = new oFF.XConstantWithParent();
oFF.ContentType.prototype._ff_c = "ContentType";

oFF.ContentType.BINARY = null;
oFF.ContentType.TEXT = null;
oFF.ContentType.STRUCTURED = null;
oFF.ContentType.JSON = null;
oFF.ContentType.XML = null;
oFF.ContentType.ATOM = null;
oFF.ContentType.URI_PARAMETER = null;
oFF.ContentType.TEXT_OR_HTML = null;
oFF.ContentType.WILDCARD = null;
oFF.ContentType.APPLICATION_JSON = null;
oFF.ContentType.APPLICATION_FORM = null;
oFF.ContentType.APPLICATION_XJAVASCRIPT = null;
oFF.ContentType.APPLICATION_JAVASCRIPT = null;
oFF.ContentType.APPLICATION_XML = null;
oFF.ContentType.APPLICATION_ATOM_XML = null;
oFF.ContentType.APPLICATION_ATOMSVC_XML = null;
oFF.ContentType.APPLICATION_FLASH = null;
oFF.ContentType.APPLICATION_OCTETSTREAM = null;
oFF.ContentType.APPLICATION_XFONT_TTF = null;
oFF.ContentType.TEXT_HTML = null;
oFF.ContentType.TEXT_CSS = null;
oFF.ContentType.TEXT_CSV = null;
oFF.ContentType.TEXT_PLAIN = null;
oFF.ContentType.TEXT_XML = null;
oFF.ContentType.TEXT_JAVASCRIPT = null;
oFF.ContentType.IMAGE_GIF = null;
oFF.ContentType.IMAGE_JPEG = null;
oFF.ContentType.IMAGE_PNG = null;
oFF.ContentType.IMAGE_XICON = null;
oFF.ContentType.FONT_WOFF = null;
oFF.ContentType.WASM = null;
oFF.ContentType.s_instances = null;
oFF.ContentType.s_fileEndingMapping = null;
oFF.ContentType.s_mimeTypeMapping = null;
oFF.ContentType.staticSetup = function()
{
	oFF.ContentType.s_instances = oFF.XHashMapByString.create();
	oFF.ContentType.s_fileEndingMapping = oFF.XHashMapByString.create();
	oFF.ContentType.s_mimeTypeMapping = oFF.XHashMapByString.create();
	oFF.ContentType.BINARY = oFF.ContentType.create("binary", null);
	oFF.ContentType.TEXT = oFF.ContentType.create("text", null);
	oFF.ContentType.STRUCTURED = oFF.ContentType.create("structured", oFF.ContentType.TEXT);
	oFF.ContentType.JSON = oFF.ContentType.create("json", oFF.ContentType.STRUCTURED);
	oFF.ContentType.XML = oFF.ContentType.create("xml", oFF.ContentType.STRUCTURED);
	oFF.ContentType.ATOM = oFF.ContentType.create("atom", oFF.ContentType.STRUCTURED);
	oFF.ContentType.TEXT_OR_HTML = oFF.ContentType.create("text_html", oFF.ContentType.TEXT);
	oFF.ContentType.URI_PARAMETER = oFF.ContentType.create("uri_parameter", oFF.ContentType.TEXT);
	oFF.ContentType.WILDCARD = oFF.ContentType.createMime("*/*", oFF.ContentType.BINARY);
	oFF.ContentType.TEXT_HTML = oFF.ContentType.createMimeExt("text/html", oFF.ContentType.TEXT_OR_HTML, "html", "htm", null);
	oFF.ContentType.TEXT_CSS = oFF.ContentType.createMimeExt("text/css", oFF.ContentType.TEXT, "css", null, null);
	oFF.ContentType.TEXT_CSV = oFF.ContentType.createMime("text/csv", oFF.ContentType.TEXT);
	oFF.ContentType.TEXT_PLAIN = oFF.ContentType.createMimeExt("text/plain", oFF.ContentType.TEXT, "txt", "properties", null);
	oFF.ContentType.TEXT_JAVASCRIPT = oFF.ContentType.createMimeExt("text/javascript", oFF.ContentType.TEXT, "js", null, null);
	oFF.ContentType.TEXT_XML = oFF.ContentType.createMime("text/xml", oFF.ContentType.XML);
	oFF.ContentType.APPLICATION_JSON = oFF.ContentType.createMimeExt("application/json", oFF.ContentType.JSON, "json", null, null);
	oFF.ContentType.APPLICATION_FORM = oFF.ContentType.createMime("application/x-www-form-urlencoded", oFF.ContentType.URI_PARAMETER);
	oFF.ContentType.APPLICATION_XJAVASCRIPT = oFF.ContentType.createMime("application/x-javascript", oFF.ContentType.TEXT);
	oFF.ContentType.APPLICATION_JAVASCRIPT = oFF.ContentType.createMime("application/javascript", oFF.ContentType.TEXT);
	oFF.ContentType.APPLICATION_XML = oFF.ContentType.createMimeExt("application/xml", oFF.ContentType.XML, "xml", null, null);
	oFF.ContentType.APPLICATION_FLASH = oFF.ContentType.createMime("application/x-shockwave-flash", oFF.ContentType.BINARY);
	oFF.ContentType.APPLICATION_XFONT_TTF = oFF.ContentType.createMime("application/x-font-ttf", oFF.ContentType.BINARY);
	oFF.ContentType.APPLICATION_ATOM_XML = oFF.ContentType.createMime("application/atom+xml", oFF.ContentType.XML);
	oFF.ContentType.APPLICATION_ATOMSVC_XML = oFF.ContentType.createMime("application/atomsvc+xml", oFF.ContentType.XML);
	oFF.ContentType.IMAGE_GIF = oFF.ContentType.createMimeExt("image/gif", oFF.ContentType.BINARY, "gif", null, null);
	oFF.ContentType.IMAGE_JPEG = oFF.ContentType.createMimeExt("image/jpeg", oFF.ContentType.BINARY, "jpg", "jpeg", "jpe");
	oFF.ContentType.IMAGE_PNG = oFF.ContentType.createMimeExt("image/png", oFF.ContentType.BINARY, "png", null, null);
	oFF.ContentType.IMAGE_XICON = oFF.ContentType.createMime("image/x-icon", oFF.ContentType.BINARY);
	oFF.ContentType.FONT_WOFF = oFF.ContentType.createMimeExt("font/woff", oFF.ContentType.BINARY, "woff", null, null);
	oFF.ContentType.APPLICATION_OCTETSTREAM = oFF.ContentType.createMime("application/octet-stream", oFF.ContentType.BINARY);
	oFF.ContentType.WASM = oFF.ContentType.createMimeExt("application/wasm", oFF.ContentType.BINARY, "wasm", null, null);
	oFF.ContentType.putFileExtMapping("qsa", oFF.ContentType.APPLICATION_JSON);
	oFF.ContentType.putFileExtMapping("asd", oFF.ContentType.APPLICATION_JSON);
	oFF.ContentType.putFileExtMapping("gdf", oFF.ContentType.APPLICATION_JSON);
};
oFF.ContentType.create = function(name, parent)
{
	var newConstant = new oFF.ContentType();
	newConstant.setupContentType(name, null, parent, null, null, null);
	return newConstant;
};
oFF.ContentType.createMime = function(name, parent)
{
	var newConstant = new oFF.ContentType();
	newConstant.setupContentType(name, name, parent, null, null, null);
	return newConstant;
};
oFF.ContentType.createMimeExt = function(name, parent, fileExt1, fileExt2, fileExt3)
{
	var newConstant = new oFF.ContentType();
	newConstant.setupContentType(name, name, parent, fileExt1, fileExt2, fileExt3);
	return newConstant;
};
oFF.ContentType.putFileExtMapping = function(ending, type)
{
	var existingContentType = oFF.ContentType.s_fileEndingMapping.getByKey(ending);
	if (oFF.isNull(existingContentType))
	{
		oFF.ContentType.s_fileEndingMapping.put(ending, type);
	}
};
oFF.ContentType.lookupByFileEnding = function(name)
{
	var contentType = oFF.ContentType.s_fileEndingMapping.getByKey(name);
	return contentType;
};
oFF.ContentType.lookupByMimeType = function(name)
{
	var contentType = oFF.ContentType.s_mimeTypeMapping.getByKey(name);
	return contentType;
};
oFF.ContentType.lookup = function(name)
{
	var contentType = oFF.ContentType.s_instances.getByKey(name);
	return contentType;
};
oFF.ContentType.prototype.m_mimeType = null;
oFF.ContentType.prototype.setupContentType = function(name, mimeType, parent, fileExt1, fileExt2, fileExt3)
{
	this.setupExt(name, parent);
	if (oFF.ContentType.s_instances.containsKey(name))
	{
		throw oFF.XException.createIllegalArgumentException("Constant already exists");
	}
	oFF.ContentType.s_instances.put(name, this);
	if (oFF.notNull(mimeType))
	{
		if (oFF.ContentType.s_mimeTypeMapping.containsKey(mimeType))
		{
			throw oFF.XException.createIllegalArgumentException("Mime type already exists");
		}
		oFF.ContentType.s_mimeTypeMapping.put(mimeType, this);
	}
	this.m_mimeType = mimeType;
	if (oFF.isNull(this.m_mimeType))
	{
		this.m_mimeType = this.resolveMimeType();
	}
	if (oFF.notNull(fileExt1))
	{
		oFF.ContentType.putFileExtMapping(fileExt1, this);
	}
	if (oFF.notNull(fileExt2))
	{
		oFF.ContentType.putFileExtMapping(fileExt2, this);
	}
	if (oFF.notNull(fileExt3))
	{
		oFF.ContentType.putFileExtMapping(fileExt3, this);
	}
};
oFF.ContentType.prototype.resolveMimeType = function()
{
	if (oFF.notNull(this.m_mimeType))
	{
		return this.m_mimeType;
	}
	else
	{
		var parent = this.getParent();
		if (oFF.notNull(parent))
		{
			return parent.resolveMimeType();
		}
		else
		{
			return null;
		}
	}
};
oFF.ContentType.prototype.isText = function()
{
	return this.isTypeOf(oFF.ContentType.TEXT);
};
oFF.ContentType.prototype.getMimeType = function()
{
	return this.m_mimeType;
};

oFF.XFileType = function() {};
oFF.XFileType.prototype = new oFF.XConstantWithParent();
oFF.XFileType.prototype._ff_c = "XFileType";

oFF.XFileType.ANY = null;
oFF.XFileType.DIR = null;
oFF.XFileType.FILE = null;
oFF.XFileType.PRG = null;
oFF.XFileType.staticSetup = function()
{
	oFF.XFileType.ANY = oFF.XFileType.create("Any", null);
	oFF.XFileType.DIR = oFF.XFileType.create("Dir", oFF.XFileType.ANY);
	oFF.XFileType.FILE = oFF.XFileType.create("File", oFF.XFileType.ANY);
	oFF.XFileType.PRG = oFF.XFileType.create("Prg", oFF.XFileType.FILE);
};
oFF.XFileType.create = function(name, parent)
{
	var newObj = oFF.XConstant.setupName(new oFF.XFileType(), name);
	newObj.setParent(parent);
	return newObj;
};

oFF.DXFileAction = function() {};
oFF.DXFileAction.prototype = new oFF.SyncAction();
oFF.DXFileAction.prototype._ff_c = "DXFileAction";

oFF.DXFileAction.prototype.getFile = function()
{
	return this.getData();
};

oFF.DfXFile = function() {};
oFF.DfXFile.prototype = new oFF.MessageManager();
oFF.DfXFile.prototype._ff_c = "DfXFile";

oFF.DfXFile.prototype.m_fs = null;
oFF.DfXFile.prototype.m_targetUri = null;
oFF.DfXFile.prototype.m_vfsUri = null;
oFF.DfXFile.prototype.m_childNames = null;
oFF.DfXFile.prototype.m_childFiles = null;
oFF.DfXFile.prototype.m_fileContent = null;
oFF.DfXFile.prototype.setupFile = function(session, fs, vfsUri, targetUri)
{
	if (oFF.isNull(session))
	{
		throw oFF.XException.createIllegalArgumentException("No session object");
	}
	this.setupSessionContext(session);
	this.m_fs = fs;
	this.m_targetUri = targetUri;
	if (oFF.notNull(vfsUri))
	{
		this.m_vfsUri = vfsUri;
	}
	else
	{
		this.m_vfsUri = targetUri;
	}
};
oFF.DfXFile.prototype.releaseObject = function()
{
	this.m_targetUri = null;
	this.m_fs = null;
	oFF.MessageManager.prototype.releaseObject.call( this );
};
oFF.DfXFile.prototype.getComponentType = function()
{
	return oFF.IoComponentType.FILE;
};
oFF.DfXFile.prototype.getFileSystemType = function()
{
	return this.m_fs.getFileSystemType();
};
oFF.DfXFile.prototype.getFileSystem = function()
{
	return this.m_fs;
};
oFF.DfXFile.prototype.getFileType = function()
{
	if (this.isDirectory())
	{
		return oFF.XFileType.DIR;
	}
	else
	{
		return oFF.XFileType.FILE;
	}
};
oFF.DfXFile.prototype.compareTo = function(objectToCompare)
{
	var other = objectToCompare;
	var otherName = other.getName();
	var myName = this.getName();
	return oFF.XString.compare(myName, otherName);
};
oFF.DfXFile.prototype.getNativeSlash = function()
{
	return oFF.XFile.NATIVE_SLASH;
};
oFF.DfXFile.prototype.getContentElement = function()
{
	return this;
};
oFF.DfXFile.prototype.newSibling = function(name)
{
	var vfsUri = this.getVfsUri();
	var newTarget = oFF.XUri.createSibling(vfsUri, name);
	return oFF.XFile.createByUri(this.getSession(), newTarget);
};
oFF.DfXFile.prototype.setWritable = oFF.noSupport;
oFF.DfXFile.prototype.getLastModifiedTimestamp = oFF.noSupport;
oFF.DfXFile.prototype.getTagValue = function(tagName)
{
	return null;
};
oFF.DfXFile.prototype.getContentConstant = function()
{
	return null;
};
oFF.DfXFile.prototype.getText = function()
{
	return this.getName();
};
oFF.DfXFile.prototype.getName = function()
{
	return this.m_vfsUri.getFileName();
};
oFF.DfXFile.prototype.getUri = function()
{
	return this.m_targetUri;
};
oFF.DfXFile.prototype.getVfsUri = function()
{
	return this.m_vfsUri;
};
oFF.DfXFile.prototype.getTargetUri = function()
{
	return this.m_targetUri;
};
oFF.DfXFile.prototype.getTargetUriPath = function()
{
	return this.m_targetUri.getPath();
};
oFF.DfXFile.prototype.getUrl = function()
{
	return this.getVfsUri().getUrl();
};
oFF.DfXFile.prototype.getParent = function()
{
	var vfsUri = this.getVfsUri();
	var parentPath = this.getVfsUri().getParentPath();
	var parentUri = oFF.XUri.createFromUrlWithParent(parentPath, vfsUri, true);
	return oFF.XFile.createByUri(this.getSession(), parentUri);
};
oFF.DfXFile.prototype.writeDebugMessage = function(message)
{
	if (oFF.XFile.DEBUG_MODE)
	{
		if (oFF.notNull(this.m_targetUri))
		{
			this.log4("XFile: ", message, " ", this.m_targetUri.toString());
		}
		else
		{
			this.log2("XFile: ", message);
		}
	}
};
oFF.DfXFile.prototype.newChild = function(relativePath)
{
	var vfsUri = this.getVfsUri();
	var childUri = oFF.XUri.createChild(vfsUri, relativePath);
	var childFile = oFF.XFile.createByUri(this.getSession(), childUri);
	return childFile;
};
oFF.DfXFile.prototype.isLeaf = function()
{
	return !this.isNode();
};
oFF.DfXFile.prototype.isNode = function()
{
	return this.isDirectory();
};
oFF.DfXFile.prototype.isWriteable = function()
{
	return false;
};
oFF.DfXFile.prototype.isReadable = function()
{
	return false;
};
oFF.DfXFile.prototype.isExecutable = function()
{
	return false;
};
oFF.DfXFile.prototype.supportsSetLastModified = function()
{
	return false;
};
oFF.DfXFile.prototype.hasChildren = function()
{
	return false;
};
oFF.DfXFile.prototype.supportsRenameTo = function()
{
	return false;
};
oFF.DfXFile.prototype.isFile = function()
{
	return !this.isDirectory();
};
oFF.DfXFile.prototype.isDirectory = oFF.noSupport;
oFF.DfXFile.prototype.isExisting = function()
{
	return false;
};
oFF.DfXFile.prototype.isHidden = function()
{
	return false;
};
oFF.DfXFile.prototype.getNativePath = function()
{
	return this.m_targetUri.getPath();
};
oFF.DfXFile.prototype.saveByteArray = function(data)
{
	var content = oFF.XContent.createByteArrayContent(oFF.ContentType.BINARY, data);
	this.saveExt(content, oFF.CompressionType.NONE);
};
oFF.DfXFile.prototype.saveByteArrayGzipped = function(data)
{
	var content = oFF.XContent.createByteArrayContent(oFF.ContentType.BINARY, data);
	this.saveExt(content, oFF.CompressionType.GZIP);
};
oFF.DfXFile.prototype.setFileContent = function(fileContent)
{
	this.m_fileContent = fileContent;
};
oFF.DfXFile.prototype.getFileContent = function()
{
	return this.m_fileContent;
};
oFF.DfXFile.prototype.loadAsByteArray = function()
{
	var content = this.loadExt(oFF.CompressionType.NONE);
	return content.getByteArray();
};
oFF.DfXFile.prototype.load = function()
{
	return this.loadExt(oFF.CompressionType.NONE);
};
oFF.DfXFile.prototype.loadGzipped = function()
{
	return this.loadExt(oFF.CompressionType.GZIP);
};
oFF.DfXFile.prototype.processExecute = oFF.noSupport;
oFF.DfXFile.prototype.deleteRecursive = function()
{
	this.deleteChildren();
	if (this.isExisting())
	{
		this.deleteFile();
	}
};
oFF.DfXFile.prototype.deleteChildren = function()
{
	if (this.isDirectory())
	{
		var children = this.getChildren();
		for (var i = 0; i < children.size(); i++)
		{
			var child = children.get(i);
			child.deleteRecursive();
		}
	}
};
oFF.DfXFile.prototype.rename = function(dest)
{
	var vfsUri = this.getVfsUri();
	var targetUri = oFF.XUri.createFromUrlWithParent(dest, vfsUri, true);
	var destFile = oFF.XFile.createByUri(this.getSession(), targetUri);
	return this.renameTo(destFile);
};
oFF.DfXFile.prototype.mkdir = function()
{
	this.mkdirExt(false);
};
oFF.DfXFile.prototype.mkdirs = function()
{
	this.mkdirExt(true);
};
oFF.DfXFile.prototype.setChildNames = function(childNames)
{
	this.m_childNames = childNames;
	var fileList = oFF.XList.create();
	var vfsUri = this.getVfsUri();
	var session = this.getSession();
	var file;
	var childName;
	var childUri;
	var size = childNames.size();
	for (var i = 0; i < size; i++)
	{
		childName = childNames.get(i);
		childUri = oFF.XUri.createChild(vfsUri, childName);
		file = oFF.XFile.createByUri(session, childUri);
		fileList.add(file);
	}
	this.m_childFiles = fileList;
};
oFF.DfXFile.prototype.getCachedChildNames = function()
{
	return this.m_childNames;
};
oFF.DfXFile.prototype.setChildFiles = function(childFiles)
{
	this.m_childFiles = childFiles;
	var nameList = oFF.XListOfString.create();
	var size = childFiles.size();
	var currentFile;
	for (var i = 0; i < size; i++)
	{
		currentFile = childFiles.get(i);
		nameList.add(currentFile.getName());
	}
	this.m_childNames = nameList;
};
oFF.DfXFile.prototype.getCachedChildFiles = function()
{
	return this.m_childFiles;
};
oFF.DfXFile.prototype.getChildSetState = function()
{
	if (this.getCachedChildNames() === null)
	{
		return oFF.ChildSetState.INITIAL;
	}
	else
	{
		return oFF.ChildSetState.COMPLETE;
	}
};
oFF.DfXFile.prototype.getChildElements = function()
{
	return oFF.XReadOnlyListWrapper.create(this.getChildren());
};
oFF.DfXFile.prototype.getChildNames = function()
{
	this.getChildren();
	return this.getCachedChildNames();
};
oFF.DfXFile.prototype.toString = function()
{
	return this.getVfsUri().toString();
};

oFF.XUri = function() {};
oFF.XUri.prototype = new oFF.XConnection();
oFF.XUri.prototype._ff_c = "XUri";

oFF.XUri.SCHEME_SEPARATOR = ":";
oFF.XUri.AUTHORITY_SEPARATOR = "//";
oFF.XUri.PORT_SEPARATOR = ":";
oFF.XUri.PATH_SEPARATOR = "/";
oFF.XUri.URL_PATTERN = "://";
oFF.XUri.PATH_SEPARATOR_NATIVE_FS = null;
oFF.XUri.PATH_SEPARATOR_WINDOWS = "\\";
oFF.XUri.DRIVE_SEPARATOR_WINDOWS = ":";
oFF.XUri.QUERY_SEPARATOR = "?";
oFF.XUri.QUERY_AND = "&";
oFF.XUri.QUERY_ASSIGN = "=";
oFF.XUri.FRAGMENT_SEPARATOR = "#";
oFF.XUri.FRAGMENT_QUERY_START = "!";
oFF.XUri.USERINFO_SEPARATOR = "@";
oFF.XUri.USER_PWD_SEPARATOR = ":";
oFF.XUri.SAML_USER_PWD = "saml";
oFF.XUri.SAML_CERT = "samlcert";
oFF.XUri.SAML_KERB = "samlkerb";
oFF.XUri.BASIC = "basic";
oFF.XUri.BEARER = "bearer";
oFF.XUri.ALIAS_SEPARATOR = ";";
oFF.XUri.ALIAS_ASSIGN = "o=";
oFF.XUri.create = function()
{
	var uri = new oFF.XUri();
	uri.setup();
	return uri;
};
oFF.XUri.createFromConnection = function(connection)
{
	var uri = oFF.XUri.create();
	uri.setFromConnection(connection);
	return uri;
};
oFF.XUri.createFromOther = function(otherUri)
{
	var uri = oFF.XUri.create();
	uri.setFromUri(otherUri);
	return uri;
};
oFF.XUri.createChild = function(otherUri, childName)
{
	if (oFF.isNull(otherUri))
	{
		throw oFF.XException.createIllegalArgumentException("Parent uri is null");
	}
	else
	{
		var uri = oFF.XUri.create();
		uri.setFromUri(otherUri);
		uri.setChildPath(childName);
		return uri;
	}
};
oFF.XUri.createSibling = function(otherUri, siblingName)
{
	var uri = oFF.XUri.create();
	uri.setFromUri(otherUri);
	uri.setSiblingPath(siblingName);
	return uri;
};
oFF.XUri.createFromFileSystemPath = function(session, path, pathFormat, varResolveMode)
{
	var uri = oFF.XUri.create();
	uri.setFromFileSystemPath(session, path, pathFormat, varResolveMode);
	uri.normalizePath(false);
	return uri;
};
oFF.XUri.createFromUri = function(urlString)
{
	return oFF.XUri.createFromUrl(urlString);
};
oFF.XUri.createFromSchemeAndNativePath = function(scheme, path)
{
	var uri = oFF.XUri.create();
	uri.setFromSchemeAndNativePath(scheme, path);
	return uri;
};
oFF.XUri.createFromUrl = function(urlString)
{
	return oFF.XUri.createFromUrlWithParent(urlString, null, false);
};
oFF.XUri.createMerge = function(firstUrl, secondUrl, mergeQueries)
{
	var firstUriObj = oFF.XUri.createFromUrl(firstUrl);
	return oFF.XUri.createFromUrlWithParent(secondUrl, firstUriObj, mergeQueries);
};
oFF.XUri.createFromUriWithParent = function(urlString, parentUri, mergeQueries)
{
	return oFF.XUri.createFromUrlWithParent(urlString, parentUri, mergeQueries);
};
oFF.XUri.createFromUrlWithParent = function(urlString, parentUri, mergeQueries)
{
	var uri = oFF.XUri.create();
	uri.setFromUrlWithParent(urlString, parentUri, mergeQueries);
	return uri;
};
oFF.XUri.getMinimumPositive4 = function(a, b, c, d)
{
	var min = oFF.XUri.getMinimumPositive2(a, b);
	min = oFF.XUri.getMinimumPositive2(min, c);
	min = oFF.XUri.getMinimumPositive2(min, d);
	return min;
};
oFF.XUri.getMinimumPositive3 = function(a, b, c)
{
	var min = oFF.XUri.getMinimumPositive2(a, b);
	min = oFF.XUri.getMinimumPositive2(min, c);
	return min;
};
oFF.XUri.getMinimumPositive2 = function(a, b)
{
	if (a < 0 && b < 0)
	{
		return -2;
	}
	else if (a < 0)
	{
		return b;
	}
	else if (b < 0)
	{
		return a;
	}
	return oFF.XMath.min(a, b);
};
oFF.XUri.createFromRelativePath = function(path, parentPath)
{
	if (oFF.XString.startsWith(path, oFF.XUri.PATH_SEPARATOR))
	{
		return path;
	}
	var buffer = oFF.XStringBuffer.create();
	if (oFF.XString.endsWith(parentPath, oFF.XUri.PATH_SEPARATOR))
	{
		buffer.append(parentPath);
	}
	else
	{
		var pathSepIndex = oFF.XString.lastIndexOf(parentPath, oFF.XUri.PATH_SEPARATOR);
		var parentDirectory = oFF.XString.substring(parentPath, 0, pathSepIndex + 1);
		buffer.append(parentDirectory);
	}
	buffer.append(path);
	return buffer.toString();
};
oFF.XUri.encodeQuerySimple = function(nameValuePairs)
{
	var nameValuePairList = oFF.XList.create();
	if (oFF.notNull(nameValuePairs))
	{
		var keys = nameValuePairs.getKeysAsReadOnlyListOfString();
		var sortedKeys = oFF.XListOfString.createFromReadOnlyList(keys);
		sortedKeys.sortByDirection(oFF.XSortDirection.ASCENDING);
		for (var i = 0; i < sortedKeys.size(); i++)
		{
			var key = sortedKeys.get(i);
			var value = nameValuePairs.getByKey(key);
			nameValuePairList.add(oFF.XNameValuePair.create(key, value));
		}
	}
	return oFF.XUri.encodeQuery(nameValuePairList);
};
oFF.XUri.decodeQuerySimple = function(query)
{
	var nameValuePairs = oFF.XHashMapOfStringByString.create();
	if (oFF.notNull(query))
	{
		var nameValuePairList = oFF.XUri.decodeQuery(query);
		for (var i = 0; i < nameValuePairList.size(); i++)
		{
			var pair = nameValuePairList.get(i);
			nameValuePairs.put(pair.getName(), pair.getValue());
		}
	}
	return nameValuePairs;
};
oFF.XUri.encodeQuery = function(queryElements)
{
	if (queryElements.isEmpty())
	{
		return null;
	}
	var httpBuffer = oFF.XStringBuffer.create();
	for (var i = 0; i < queryElements.size(); i++)
	{
		var element = queryElements.get(i);
		if (i > 0)
		{
			httpBuffer.append(oFF.XUri.QUERY_AND);
		}
		httpBuffer.append(oFF.XHttpUtils.encodeURIComponent(element.getName()));
		httpBuffer.append(oFF.XUri.QUERY_ASSIGN);
		httpBuffer.append(oFF.XHttpUtils.encodeURIComponent(element.getValue()));
	}
	return httpBuffer.toString();
};
oFF.XUri.decodeQuery = function(query)
{
	var queryPairs = oFF.XList.create();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(query))
	{
		var queryElements = oFF.XStringTokenizer.splitString(query, oFF.XUri.QUERY_AND);
		for (var i = 0; i < queryElements.size(); i++)
		{
			var element = queryElements.get(i);
			var delimiter = oFF.XString.indexOf(element, oFF.XUri.QUERY_ASSIGN);
			var key;
			var value;
			if (delimiter === -1)
			{
				key = oFF.XHttpUtils.decodeURIComponent(element);
				value = "";
			}
			else
			{
				key = oFF.XString.substring(element, 0, delimiter);
				value = oFF.XString.substring(element, delimiter + 1, -1);
				key = oFF.XHttpUtils.decodeURIComponent(key);
				value = oFF.XHttpUtils.decodeURIComponent(value);
			}
			queryPairs.add(oFF.XNameValuePair.create(key, value));
		}
	}
	return queryPairs;
};
oFF.XUri.getUriStringStatic = function(connection, uri, withScheme, withUser, withPwd, withAuthenticationType, withHostPort, withPath, withQuery, withFragment)
{
	return oFF.XUri.getUrlStringStatic(connection, uri, withScheme, withUser, withPwd, withAuthenticationType, withHostPort, withPath, withQuery, withFragment);
};
oFF.XUri.getUrlStringStatic = function(connection, uri, withScheme, withUser, withPwd, withAuthenticationType, withHostPort, withPath, withQuery, withFragment)
{
	var sb = oFF.XStringBuffer.create();
	if (withScheme)
	{
		var scheme = connection.getScheme();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(scheme))
		{
			sb.append(scheme).append(oFF.XUri.SCHEME_SEPARATOR);
			if (oFF.notNull(uri))
			{
				if (uri.supportsAuthority())
				{
					sb.append(oFF.XUri.AUTHORITY_SEPARATOR);
				}
			}
			else
			{
				sb.append(oFF.XUri.AUTHORITY_SEPARATOR);
			}
		}
	}
	var hasUserPwdInfo = 0;
	var authenticationType = connection.getAuthenticationType();
	if (withUser || withPwd)
	{
		if (oFF.notNull(authenticationType))
		{
			if (authenticationType.hasUserName() || authenticationType.hasPassword())
			{
				var user = connection.getUser();
				var pwd = connection.getPassword();
				if (oFF.XStringUtils.isNotNullAndNotEmpty(user) && withUser)
				{
					sb.append(oFF.XHttpUtils.encodeURIComponent(user));
					hasUserPwdInfo = 1;
				}
				if (oFF.XStringUtils.isNotNullAndNotEmpty(pwd) && withPwd)
				{
					sb.append(oFF.XUri.USER_PWD_SEPARATOR).append(oFF.XHttpUtils.encodeURIComponent(pwd));
					hasUserPwdInfo = 2;
				}
			}
		}
	}
	if (withAuthenticationType && oFF.notNull(authenticationType))
	{
		if (authenticationType.isSaml())
		{
			if (hasUserPwdInfo < 2)
			{
				sb.append(oFF.XUri.USER_PWD_SEPARATOR);
			}
			sb.append(oFF.XUri.USER_PWD_SEPARATOR);
			if (authenticationType === oFF.AuthenticationType.SAML_WITH_PASSWORD)
			{
				sb.append(oFF.XUri.SAML_USER_PWD);
			}
			else if (authenticationType === oFF.AuthenticationType.SAML_WITH_CERTIFICATE)
			{
				sb.append(oFF.XUri.SAML_CERT);
			}
			else if (authenticationType === oFF.AuthenticationType.SAML_WITH_KERBEROS)
			{
				sb.append(oFF.XUri.SAML_KERB);
			}
			hasUserPwdInfo = 3;
		}
	}
	if (hasUserPwdInfo > 0)
	{
		sb.append(oFF.XUri.USERINFO_SEPARATOR);
	}
	if (withHostPort)
	{
		var host = connection.getHost();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(host))
		{
			sb.append(host);
			var protocolType = connection.getProtocolType();
			var port = connection.getPort();
			if (port > 0 && (port === 80 && protocolType === oFF.ProtocolType.HTTP || port === 443 && protocolType === oFF.ProtocolType.HTTPS) === false)
			{
				sb.append(oFF.XUri.PORT_SEPARATOR).appendInt(port);
			}
		}
	}
	if (oFF.isNull(uri))
	{
		if (withPath)
		{
			var conPath = connection.getPath();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(conPath))
			{
				sb.append(conPath);
				var conAlias = connection.getAlias();
				if (oFF.XStringUtils.isNotNullAndNotEmpty(conAlias))
				{
					sb.append(oFF.XUri.ALIAS_SEPARATOR).append(oFF.XUri.ALIAS_ASSIGN).append(conAlias);
				}
			}
		}
	}
	else
	{
		if (withPath)
		{
			var path = uri.getPath();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(path))
			{
				sb.append(oFF.XUri.encodePath(path));
				var uriAlias = uri.getAlias();
				if (oFF.XStringUtils.isNotNullAndNotEmpty(uriAlias))
				{
					sb.append(oFF.XUri.ALIAS_SEPARATOR).append(oFF.XUri.ALIAS_ASSIGN).append(uriAlias);
				}
			}
		}
		if (withQuery)
		{
			var query = uri.getQuery();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(query))
			{
				sb.append(oFF.XUri.QUERY_SEPARATOR).append(query);
			}
		}
		if (withFragment)
		{
			var fragment = uri.getFragment();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(fragment))
			{
				sb.append(oFF.XUri.FRAGMENT_SEPARATOR).append(fragment);
			}
		}
	}
	return sb.toString();
};
oFF.XUri.encodePath = function(path)
{
	var buffer = oFF.XStringBuffer.create();
	var startIndex = 0;
	var nextIndex;
	var size = oFF.XString.size(path);
	while (true)
	{
		nextIndex = oFF.XUri.indexFrom(path, startIndex, size);
		var fragment = oFF.XString.substring(path, startIndex, nextIndex);
		buffer.append(oFF.XHttpUtils.encodeURIComponent(fragment));
		if (nextIndex === -1)
		{
			break;
		}
		var charAt = oFF.XString.getCharAt(path, nextIndex);
		if (charAt === 32)
		{
			buffer.append("%20");
		}
		else
		{
			buffer.appendChar(charAt);
		}
		startIndex = nextIndex + 1;
	}
	return buffer.toString();
};
oFF.XUri.indexFrom = function(element, startIndex, size)
{
	for (var i = startIndex; i < size; i++)
	{
		var c = oFF.XString.getCharAt(element, i);
		if (c === 32 || c === 33 || c === 36 || c === 39 || c === 40 || c === 41 || c === 42 || c === 43 || c === 44 || c === 47 || c === 61 || c === 91 || c === 93 || c === 126)
		{
			return i;
		}
	}
	return -1;
};
oFF.XUri.decodePath = function(path)
{
	var buffer = oFF.XStringBuffer.create();
	var startIndex = 0;
	var nextIndex;
	while (true)
	{
		nextIndex = oFF.XString.indexOfFrom(path, "+", startIndex);
		var fragment = oFF.XString.substring(path, startIndex, nextIndex);
		buffer.append(oFF.XHttpUtils.decodeURIComponent(fragment));
		if (nextIndex === -1)
		{
			break;
		}
		buffer.append("+");
		startIndex = nextIndex + 1;
	}
	return buffer.toString();
};
oFF.XUri.convertPercent = function(source)
{
	var target = source;
	while (true)
	{
		var first = oFF.XString.indexOf(target, "%");
		if (first !== -1)
		{
			var second = oFF.XString.indexOfFrom(target, "%", first + 1);
			if (second !== -1)
			{
				var buffer = oFF.XStringBuffer.create();
				buffer.append(oFF.XString.substring(target, 0, first));
				buffer.append(oFF.XEnvironment.VAR_START);
				buffer.append(oFF.XString.substring(target, first + 1, second));
				buffer.append(oFF.XEnvironment.VAR_END);
				buffer.append(oFF.XString.substring(target, second + 1, -1));
				target = buffer.toString();
			}
			else
			{
				break;
			}
		}
		else
		{
			break;
		}
	}
	return target;
};
oFF.XUri.replaceEnvVar = function(env, source, logger, varResolveMode, smartPathConcatenate)
{
	var target = source;
	while (oFF.notNull(target))
	{
		var startIndex = oFF.XString.indexOfFrom(target, varResolveMode.getPrefix(), 0);
		if (startIndex < 0)
		{
			break;
		}
		var endIndex = oFF.XString.indexOfFrom(target, varResolveMode.getPostfix(), startIndex + varResolveMode.getPrefixSize());
		if (endIndex >= 0)
		{
			var before = oFF.XString.substring(target, 0, startIndex);
			var varName = oFF.XString.substring(target, startIndex + varResolveMode.getPrefixSize(), endIndex);
			var after = oFF.XString.substring(target, endIndex + varResolveMode.getPostfixSize(), -1);
			var replaceValue = env.getVariable(varName);
			if (oFF.isNull(replaceValue))
			{
				if (oFF.notNull(logger))
				{
					logger.log4("Cannot resolve variable '", varName, "' used in ", source);
				}
				target = null;
				break;
			}
			if (smartPathConcatenate)
			{
				target = oFF.XUri.smartPathConcatenate(before, replaceValue, false);
				target = oFF.XUri.smartPathConcatenate(target, after, false);
			}
			else
			{
				target = oFF.XStringUtils.concatenate3(before, replaceValue, after);
			}
		}
	}
	return target;
};
oFF.XUri.smartPathConcatenate = function(first, second, isAbsolute)
{
	var theSecond = second;
	if (oFF.XString.containsString(first, oFF.XUri.PATH_SEPARATOR_WINDOWS))
	{
		theSecond = oFF.XString.replace(second, oFF.XUri.PATH_SEPARATOR, oFF.XUri.PATH_SEPARATOR_WINDOWS);
		if (oFF.XString.endsWith(first, oFF.XUri.PATH_SEPARATOR_WINDOWS) && oFF.XString.startsWith(theSecond, oFF.XUri.PATH_SEPARATOR_WINDOWS))
		{
			theSecond = oFF.XString.substring(theSecond, 1, -1);
		}
	}
	else if (oFF.XString.containsString(first, oFF.XUri.PATH_SEPARATOR))
	{
		theSecond = oFF.XString.replace(second, oFF.XUri.PATH_SEPARATOR_WINDOWS, oFF.XUri.PATH_SEPARATOR);
		if (oFF.XString.endsWith(first, oFF.XUri.PATH_SEPARATOR) && oFF.XString.startsWith(theSecond, oFF.XUri.PATH_SEPARATOR))
		{
			theSecond = oFF.XString.substring(theSecond, 1, -1);
		}
	}
	var path = oFF.XStringUtils.concatenate2(first, theSecond);
	if (isAbsolute && oFF.XString.startsWith(path, oFF.XUri.PATH_SEPARATOR) === false)
	{
		path = oFF.XStringUtils.concatenate2(oFF.XUri.PATH_SEPARATOR, path);
	}
	return path;
};
oFF.XUri.prototype.m_queryPairs = null;
oFF.XUri.prototype.m_fragment = null;
oFF.XUri.prototype.m_fragmentQueryPairs = null;
oFF.XUri.prototype.m_supportsAuthority = false;
oFF.XUri.prototype.setup = function()
{
	oFF.XConnection.prototype.setup.call( this );
	this.m_queryPairs = oFF.XList.create();
	this.m_supportsAuthority = true;
};
oFF.XUri.prototype.releaseObject = function()
{
	this.m_queryPairs = oFF.XObjectExt.release(this.m_queryPairs);
	this.m_fragmentQueryPairs = oFF.XObjectExt.release(this.m_fragmentQueryPairs);
	this.m_fragment = null;
	oFF.XConnection.prototype.releaseObject.call( this );
};
oFF.XUri.prototype.setUriString = function(uriString)
{
	this.setUrlString(uriString);
};
oFF.XUri.prototype.setUrlString = function(uriString)
{
	this.setFromUrlWithParent(uriString, null, false);
};
oFF.XUri.prototype.setFromConnection = function(connection)
{
	if (oFF.notNull(connection))
	{
		oFF.XConnectHelper.copyConnection(connection, this);
	}
};
oFF.XUri.prototype.setFromUri = function(uri)
{
	if (oFF.notNull(uri))
	{
		oFF.XConnectHelper.copyUri(uri, this);
	}
};
oFF.XUri.prototype.setFromUriWithParent = function(urlString, parentUri, mergeQueries)
{
	this.setFromUrlWithParent(urlString, parentUri, mergeQueries);
};
oFF.XUri.prototype.setFromUrlWithParent = function(urlString, parentUri, mergeQueries)
{
	if (oFF.notNull(urlString))
	{
		var start = 0;
		var size = oFF.XString.size(urlString);
		if (oFF.notNull(parentUri) && mergeQueries)
		{
			var parentQuery = parentUri.getQuery();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(parentQuery))
			{
				this.setQuery(parentQuery);
			}
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(urlString))
		{
			var isRelative = true;
			var schemaIndex = oFF.XString.indexOf(urlString, oFF.XUri.SCHEME_SEPARATOR);
			var pathCompIndex = oFF.XString.indexOf(urlString, oFF.XUri.PATH_SEPARATOR);
			var supportsAuthority = false;
			if (schemaIndex > -1 && (pathCompIndex === -1 || pathCompIndex > schemaIndex))
			{
				var scheme = oFF.XString.substring(urlString, start, schemaIndex);
				start = schemaIndex + 1;
				if (oFF.XStringUtils.isNotNullAndNotEmpty(scheme))
				{
					this.setScheme(scheme);
				}
				isRelative = false;
				var authorityIndex = oFF.XString.indexOfFrom(urlString, oFF.XUri.AUTHORITY_SEPARATOR, start);
				if (authorityIndex === start)
				{
					supportsAuthority = true;
					start = start + 2;
				}
			}
			this.setSupportsAuthority(supportsAuthority);
			var pathIndex = oFF.XString.indexOfFrom(urlString, oFF.XUri.PATH_SEPARATOR, start);
			var querySeparator = oFF.XString.indexOfFrom(urlString, oFF.XUri.QUERY_SEPARATOR, start);
			var fragmentIndex = oFF.XString.indexOfFrom(urlString, oFF.XUri.FRAGMENT_SEPARATOR, start);
			var min;
			if (isRelative)
			{
				if (oFF.notNull(parentUri))
				{
					this.setScheme(parentUri.getScheme());
					this.setSupportsAuthority(parentUri.supportsAuthority());
					this.setHost(parentUri.getHost());
					this.setPort(parentUri.getPort());
					this.setPath(parentUri.getPath());
				}
				if (start !== querySeparator && start !== fragmentIndex)
				{
					pathIndex = start;
				}
			}
			else
			{
				if (supportsAuthority)
				{
					var authIndex = oFF.XString.indexOfFrom(urlString, oFF.XUri.USERINFO_SEPARATOR, start);
					min = oFF.XUri.getMinimumPositive4(authIndex, pathIndex, querySeparator, size);
					if (authIndex === min)
					{
						var auth = oFF.XString.substring(urlString, start, authIndex);
						var userPwdIndex = oFF.XString.indexOf(auth, oFF.XUri.USER_PWD_SEPARATOR);
						var user;
						var authType = null;
						if (userPwdIndex > -1)
						{
							user = oFF.XString.substring(auth, 0, userPwdIndex);
							var pwdEnd = -1;
							var authTypeIndex = oFF.XString.indexOfFrom(auth, oFF.XUri.USER_PWD_SEPARATOR, userPwdIndex + 1);
							if (authTypeIndex !== -1)
							{
								pwdEnd = authTypeIndex;
								authType = oFF.XString.substring(auth, authTypeIndex + 1, -1);
							}
							var pwd = oFF.XString.substring(auth, userPwdIndex + 1, pwdEnd);
							pwd = oFF.XHttpUtils.decodeURIComponent(pwd);
							this.setPassword(pwd);
						}
						else
						{
							user = auth;
						}
						user = oFF.XHttpUtils.decodeURIComponent(user);
						this.setUser(user);
						if (oFF.XString.isEqual(oFF.XUri.SAML_USER_PWD, authType))
						{
							this.setAuthenticationType(oFF.AuthenticationType.SAML_WITH_PASSWORD);
						}
						else if (oFF.XString.isEqual(oFF.XUri.SAML_CERT, authType))
						{
							this.setAuthenticationType(oFF.AuthenticationType.SAML_WITH_CERTIFICATE);
						}
						else if (oFF.XString.isEqual(oFF.XUri.SAML_KERB, authType))
						{
							this.setAuthenticationType(oFF.AuthenticationType.SAML_WITH_KERBEROS);
						}
						else if (oFF.XString.isEqual(oFF.XUri.BASIC, authType))
						{
							this.setAuthenticationType(oFF.AuthenticationType.BASIC);
						}
						else if (oFF.XString.isEqual(oFF.XUri.BEARER, authType))
						{
							this.setAuthenticationType(oFF.AuthenticationType.BEARER);
						}
						start = authIndex + 1;
						pathIndex = oFF.XString.indexOfFrom(urlString, oFF.XUri.PATH_SEPARATOR, start);
						querySeparator = oFF.XString.indexOfFrom(urlString, oFF.XUri.QUERY_SEPARATOR, start);
					}
					var portIndex = oFF.XString.indexOfFrom(urlString, oFF.XUri.PORT_SEPARATOR, start);
					min = oFF.XUri.getMinimumPositive4(portIndex, pathIndex, querySeparator, size);
					var host = oFF.XString.substring(urlString, start, min);
					start = min;
					if (oFF.XStringUtils.isNotNullAndNotEmpty(host))
					{
						this.setHost(host);
					}
					if (portIndex === min)
					{
						min = oFF.XUri.getMinimumPositive3(pathIndex, querySeparator, size);
						var port = oFF.XString.substring(urlString, portIndex + 1, min);
						start = min;
						if (oFF.XStringUtils.isNotNullAndNotEmpty(port))
						{
							var portValue = oFF.XInteger.convertFromStringWithDefault(port, 0);
							if (portValue > 0)
							{
								this.setPort(portValue);
							}
						}
					}
					else
					{
						var protocolType = this.getProtocolType();
						if (oFF.notNull(protocolType))
						{
							var defaultPort = protocolType.getDefaultPort();
							if (defaultPort !== 0)
							{
								this.setPort(defaultPort);
							}
						}
					}
				}
				else
				{
					pathIndex = start;
				}
			}
			if (pathIndex === start)
			{
				min = oFF.XUri.getMinimumPositive3(querySeparator, fragmentIndex, size);
				var path = oFF.XString.substring(urlString, start, min);
				start = min;
				if (oFF.XStringUtils.isNotNullAndNotEmpty(path))
				{
					var decodedPath = oFF.XUri.decodePath(path);
					if (isRelative && oFF.notNull(parentUri) && oFF.XStringUtils.isNotNullAndNotEmpty(parentUri.getPath()))
					{
						decodedPath = oFF.XUri.createFromRelativePath(decodedPath, parentUri.getPath());
					}
					this.setPath(decodedPath);
				}
			}
			if (querySeparator === start)
			{
				min = oFF.XUri.getMinimumPositive2(fragmentIndex, size);
				var query = oFF.XString.substring(urlString, start + 1, min);
				start = min;
				if (oFF.XStringUtils.isNotNullAndNotEmpty(query))
				{
					var existingQuery = this.getQuery();
					if (isRelative && mergeQueries && oFF.XStringUtils.isNotNullAndNotEmpty(existingQuery))
					{
						query = oFF.XStringUtils.concatenate3(existingQuery, oFF.XUri.QUERY_AND, query);
					}
					this.setQuery(query);
				}
			}
			if (fragmentIndex === start)
			{
				var fragment = oFF.XString.substring(urlString, start + 1, -1);
				if (oFF.XStringUtils.isNotNullAndNotEmpty(fragment))
				{
					this.setFragment(fragment);
				}
			}
		}
	}
};
oFF.XUri.prototype.setChildPath = function(childName)
{
	var path = this.getPath();
	var newPath;
	var theChildName = childName;
	if (oFF.XString.startsWith(theChildName, oFF.XUri.PATH_SEPARATOR))
	{
		theChildName = oFF.XString.substring(theChildName, 1, -1);
	}
	if (oFF.XString.endsWith(path, oFF.XUri.PATH_SEPARATOR))
	{
		newPath = oFF.XStringUtils.concatenate2(path, theChildName);
	}
	else
	{
		newPath = oFF.XStringUtils.concatenate3(path, oFF.XUri.PATH_SEPARATOR, theChildName);
	}
	this.setPath(newPath);
};
oFF.XUri.prototype.setSiblingPath = function(siblingName)
{
	var path = this.getPath();
	var newPath;
	if (oFF.XString.endsWith(path, oFF.XUri.PATH_SEPARATOR))
	{
		path = oFF.XString.substring(path, 0, oFF.XString.size(path) - 1);
	}
	var index = oFF.XString.lastIndexOf(path, oFF.XUri.PATH_SEPARATOR);
	if (index === -1)
	{
		newPath = siblingName;
	}
	else
	{
		newPath = oFF.XString.substring(path, 0, index + 1);
		newPath = oFF.XStringUtils.concatenate2(newPath, siblingName);
	}
	this.setPath(newPath);
};
oFF.XUri.prototype.getQuery = function()
{
	return oFF.XUri.encodeQuery(this.getQueryElements());
};
oFF.XUri.prototype.setQuery = function(query)
{
	this.m_queryPairs = oFF.XUri.decodeQuery(query);
};
oFF.XUri.prototype.addQueryElement = function(name, value)
{
	this.m_queryPairs.add(oFF.XNameValuePair.create(name, value));
};
oFF.XUri.prototype.addQueryElements = function(elements)
{
	if (oFF.notNull(elements))
	{
		this.m_queryPairs.addAll(elements);
	}
};
oFF.XUri.prototype.getQueryElements = function()
{
	return this.m_queryPairs;
};
oFF.XUri.prototype.getQueryMap = function()
{
	var elements = this.getQueryElements();
	var map = oFF.XHashMapOfStringByString.create();
	for (var i = 0; i < elements.size(); i++)
	{
		var nameValuePair = elements.get(i);
		map.put(nameValuePair.getName(), nameValuePair.getValue());
	}
	return map;
};
oFF.XUri.prototype.setFragment = function(fragment)
{
	this.m_fragment = fragment;
	this.m_fragmentQueryPairs = null;
};
oFF.XUri.prototype.getFragment = function()
{
	if (oFF.isNull(this.m_fragmentQueryPairs))
	{
		return this.m_fragment;
	}
	return oFF.XStringUtils.concatenate2(oFF.XUri.FRAGMENT_QUERY_START, oFF.XUri.encodeQuery(this.m_fragmentQueryPairs));
};
oFF.XUri.prototype.addFragmentQueryElement = function(name, value)
{
	if (oFF.isNull(this.m_fragmentQueryPairs))
	{
		this.m_fragmentQueryPairs = oFF.XList.create();
		this.m_fragment = null;
	}
	this.m_fragmentQueryPairs.add(oFF.XNameValuePair.create(name, value));
};
oFF.XUri.prototype.getFragmentQueryElements = function()
{
	if (oFF.isNull(this.m_fragmentQueryPairs))
	{
		if (oFF.notNull(this.m_fragment) && oFF.XString.startsWith(this.m_fragment, oFF.XUri.FRAGMENT_QUERY_START))
		{
			var fragmentQuery = oFF.XString.substring(this.m_fragment, 1, -1);
			this.m_fragmentQueryPairs = oFF.XUri.decodeQuery(fragmentQuery);
			this.m_fragment = null;
		}
	}
	return this.m_fragmentQueryPairs;
};
oFF.XUri.prototype.getFragmentQueryMap = function()
{
	var map = oFF.XHashMapOfStringByString.create();
	var elements = this.getFragmentQueryElements();
	if (oFF.notNull(elements))
	{
		for (var i = 0; i < elements.size(); i++)
		{
			var nameValuePair = elements.get(i);
			map.put(nameValuePair.getName(), nameValuePair.getValue());
		}
	}
	return map;
};
oFF.XUri.prototype.supportsAuthority = function()
{
	return this.m_supportsAuthority;
};
oFF.XUri.prototype.setSupportsAuthority = function(supportsAuthority)
{
	this.m_supportsAuthority = supportsAuthority;
};
oFF.XUri.prototype.setUser = function(user)
{
	oFF.XConnection.prototype.setUser.call( this , user);
	var authenticationType = this.getAuthenticationType();
	if (authenticationType === oFF.AuthenticationType.NONE)
	{
		if (oFF.XStringUtils.isNotNullAndNotEmpty(user))
		{
			this.setAuthenticationType(oFF.AuthenticationType.BASIC);
		}
	}
};
oFF.XUri.prototype.isRelativeUri = function()
{
	return this.getProtocolType() === null && this.getHost() === null;
};
oFF.XUri.prototype.getUrl = function()
{
	return oFF.XUri.getUrlStringStatic(this, this, true, true, true, false, true, true, true, true);
};
oFF.XUri.prototype.getUrlStringWithoutAuthentication = function()
{
	return oFF.XUri.getUrlStringStatic(this, this, true, false, false, false, true, true, true, true);
};
oFF.XUri.prototype.getUrlStringExt = function(withScheme, withUser, withPwd, withAuthenticationType, withHostPort, withPath, withQuery, withFragment)
{
	return oFF.XUri.getUrlStringStatic(this, this, withScheme, withUser, withPwd, withAuthenticationType, withHostPort, withPath, withQuery, withFragment);
};
oFF.XUri.prototype.setFromFileSystemPath = function(session, path, pathFormat, varResolveMode)
{
	if (oFF.isNull(session))
	{
		throw oFF.XException.createIllegalArgumentException("Parameter 'session' must be not null");
	}
	var thePath = path;
	var hasEnvVarStart = false;
	if (varResolveMode !== oFF.VarResolveMode.NONE)
	{
		var theVarResolveMode = varResolveMode;
		if (theVarResolveMode === oFF.VarResolveMode.PERCENT)
		{
			thePath = oFF.XUri.convertPercent(thePath);
			theVarResolveMode = oFF.VarResolveMode.DOLLAR;
		}
		var env = session.getEnvironment();
		hasEnvVarStart = oFF.XString.indexOf(thePath, theVarResolveMode.getPrefix()) === 0;
		thePath = oFF.XUri.replaceEnvVar(env, path, null, oFF.VarResolveMode.DOLLAR, true);
	}
	if (oFF.notNull(thePath))
	{
		var thePathFormat = pathFormat;
		if (thePathFormat === oFF.PathFormat.AUTO_DETECT)
		{
			if (oFF.XString.containsString(thePath, oFF.XUri.PATH_SEPARATOR_WINDOWS))
			{
				thePathFormat = oFF.PathFormat.NATIVE;
			}
			else if (oFF.XString.containsString(thePath, oFF.XUri.URL_PATTERN))
			{
				thePathFormat = oFF.PathFormat.URL;
			}
			else
			{
				thePathFormat = oFF.PathFormat.NORMALIZED;
			}
		}
		if (thePathFormat === oFF.PathFormat.NORMALIZED && hasEnvVarStart)
		{
			thePathFormat = oFF.PathFormat.NATIVE;
		}
		if (thePathFormat === oFF.PathFormat.URL)
		{
			this.setFromUrlWithParent(thePath, null, false);
		}
		else if (thePathFormat === oFF.PathFormat.NATIVE)
		{
			this.setFromSchemeAndNativePath(oFF.ProtocolType.FILE.getName(), thePath);
		}
		else
		{
			var fileSystemManager = session.getFileSystemManager();
			var isSet = false;
			if (oFF.notNull(fileSystemManager))
			{
				var currentWorkingDirectory = fileSystemManager.getCurrentWorkingDirectory();
				if (oFF.notNull(currentWorkingDirectory))
				{
					var uriCompatiblePath = oFF.XUri.encodePath(thePath);
					this.setFromUrlWithParent(uriCompatiblePath, currentWorkingDirectory, false);
					this.normalizePath(false);
					isSet = true;
				}
			}
			if (isSet === false)
			{
				this.setProtocolType(oFF.ProtocolType.FILE);
				this.setPath(thePath);
			}
		}
	}
};
oFF.XUri.prototype.setFromSchemeAndNativePath = function(scheme, path)
{
	var normalized = path;
	if (oFF.XString.isEqual(oFF.XUri.PATH_SEPARATOR_NATIVE_FS, oFF.XUri.PATH_SEPARATOR_WINDOWS))
	{
		normalized = oFF.XString.replace(normalized, oFF.XUri.PATH_SEPARATOR_WINDOWS, oFF.XUri.PATH_SEPARATOR);
		if (oFF.XString.containsString(normalized, oFF.XUri.DRIVE_SEPARATOR_WINDOWS))
		{
			normalized = oFF.XStringUtils.concatenate2(oFF.XUri.PATH_SEPARATOR, normalized);
		}
	}
	var url = oFF.XStringUtils.concatenate4(scheme, oFF.XUri.SCHEME_SEPARATOR, oFF.XUri.AUTHORITY_SEPARATOR, normalized);
	this.setFromUrlWithParent(url, null, false);
};
oFF.XUri.prototype.toString = function()
{
	return this.getUrlStringExt(true, true, true, true, true, true, true, true);
};

oFF.SystemType = function() {};
oFF.SystemType.prototype = new oFF.XConstantWithParent();
oFF.SystemType.prototype._ff_c = "SystemType";

oFF.SystemType.GENERIC = null;
oFF.SystemType.HANA = null;
oFF.SystemType.ABAP_MDS = null;
oFF.SystemType.ABAP = null;
oFF.SystemType.BW = null;
oFF.SystemType.BPCS = null;
oFF.SystemType.BPCE = null;
oFF.SystemType.UNV = null;
oFF.SystemType.UQAS = null;
oFF.SystemType.HYBRIS = null;
oFF.SystemType.ORCA = null;
oFF.SystemType.ORCA_CLOUD = null;
oFF.SystemType.VIRTUAL_INA = null;
oFF.SystemType.VIRTUAL_INA_ODATA = null;
oFF.SystemType.VIRTUAL_INA_SCP = null;
oFF.SystemType.VIRTUAL_INA_GSA = null;
oFF.SystemType.DWC = null;
oFF.SystemType.WASABI = null;
oFF.SystemType.INA_SQL = null;
oFF.SystemType.s_instances = null;
oFF.SystemType.staticSetup = function()
{
	oFF.SystemType.s_instances = oFF.XHashMapByString.create();
	oFF.SystemType.GENERIC = oFF.SystemType.create("GENERIC", null, false, false, false, false, null, null, null, null);
	oFF.SystemType.HANA = oFF.SystemType.create("HANA", oFF.SystemType.GENERIC, true, false, false, false, "/sap/bc/ina/service/v2/GetServerInfo", "/sap/bc/ina/service/v2/GetResponse", "/sap/hana/xs/formLogin/logout.xscfunc", null);
	oFF.SystemType.ABAP_MDS = oFF.SystemType.create("ABAP_MDS", oFF.SystemType.ABAP, true, false, false, false, "/sap/bw/mds/GetServerInfo", "/sap/bw/mds/GetResponse", "/sap/bw/mds/logout", null);
	oFF.SystemType.ABAP = oFF.SystemType.create("ABAP", oFF.SystemType.GENERIC, true, false, true, false, null, null, null, null);
	oFF.SystemType.BW = oFF.SystemType.create("BW", oFF.SystemType.ABAP, true, false, false, true, "/sap/bw/ina/GetServerInfo", "/sap/bw/ina/GetResponse", "/sap/bw/ina/Logoff", null);
	oFF.SystemType.BPCS = oFF.SystemType.create("BPCS", oFF.SystemType.ABAP, true, false, false, true, "/sap/bpc/ina/GetServerInfo", "/sap/bpc/ina/GetResponse", "/sap/bpc/ina/Logoff", null);
	oFF.SystemType.BPCE = oFF.SystemType.create("BPCE", oFF.SystemType.BW, true, false, false, true, null, null, null, null);
	oFF.SystemType.UNV = oFF.SystemType.create("UNV", oFF.SystemType.GENERIC, true, false, false, true, "/sap/boc/ina/GetServerInfo", "/sap/boc/ina/GetResponse", "/sap/boc/ina/Logoff", null);
	oFF.SystemType.UQAS = oFF.SystemType.create("UQAS", oFF.SystemType.GENERIC, true, false, false, false, "/sap/boc/ina/GetServerInfo", "/sap/boc/ina/GetResponse", "/sap/boc/ina/Logoff", null);
	oFF.SystemType.HYBRIS = oFF.SystemType.create("HYBRIS", oFF.SystemType.GENERIC, true, false, false, false, "/sap/bc/ina/service/v2/GetServerInfo", "/sap/bc/ina/service/v2/GetResponse", null, null);
	oFF.SystemType.ORCA = oFF.SystemType.create("ORCA", oFF.SystemType.HANA, true, true, false, false, null, null, "", "/sap/fpa/services/rest/epm/session?action=logon");
	oFF.SystemType.ORCA_CLOUD = oFF.SystemType.create("ORCA_CLOUD", oFF.SystemType.ORCA, true, true, true, false, null, null, null, null);
	oFF.SystemType.DWC = oFF.SystemType.create("DWC", oFF.SystemType.ORCA, true, true, false, false, "/dwaas-core/sap/bc/ina/service/v2/GetServerInfo", "/dwaas-core/sap/bc/ina/service/v2/GetResponse", "/dwaas-core/sap/hana/xs/formLogin/logout.xscfunc", "/sap/fpa/services/rest/epm/session?action=logon");
	oFF.SystemType.VIRTUAL_INA = oFF.SystemType.create("VIRTUAL_INA", oFF.SystemType.GENERIC, false, false, false, false, null, null, null, null);
	oFF.SystemType.VIRTUAL_INA_ODATA = oFF.SystemType.create("VIRTUAL_INA_ODATA", oFF.SystemType.VIRTUAL_INA, true, false, false, false, oFF.SystemType.BW.m_serverInfoPath, oFF.SystemType.BW.m_inaPath, oFF.SystemType.BW.m_logoffPath, oFF.SystemType.BW.m_logonPath);
	oFF.SystemType.VIRTUAL_INA_SCP = oFF.SystemType.create("VIRTUAL_INA_SCP", oFF.SystemType.VIRTUAL_INA, true, false, false, false, "/info", "/ina", "/scpLogoff", "/scpLogon");
	oFF.SystemType.VIRTUAL_INA_GSA = oFF.SystemType.create("VIRTUAL_INA_GSA", oFF.SystemType.VIRTUAL_INA, true, false, false, false, "/gsaInfo", "/gsaIna", "/gsaLogoff", "/gsaLogon");
	oFF.SystemType.WASABI = oFF.SystemType.create("WASABI", oFF.SystemType.GENERIC, true, false, false, false, "/gsaInfo", "/gsaIna", "/gsaLogoff", "/gsaLogon");
	oFF.SystemType.INA_SQL = oFF.SystemType.create("INA_SQL", oFF.SystemType.GENERIC, true, false, false, false, "/sap/sql/ina/GetServerInfo", "/sap/sql/ina/GetResponse", "/sap/sql/ina/Logoff", null);
};
oFF.SystemType.create = function(name, parent, isCapabilityMetadataRequired, isLogonMetadataRequired, isPreflightRequired, isContextIdRequired, infoPath, inaPath, logoffPath, logonPath)
{
	var systemType = new oFF.SystemType();
	systemType.setupExt(name, parent);
	systemType.m_isCapabilityMetadataRequired = isCapabilityMetadataRequired;
	systemType.m_isLogonMetadataRequired = isLogonMetadataRequired;
	systemType.m_isPreflightRequired = isPreflightRequired;
	systemType.m_serverInfoPath = infoPath;
	systemType.m_inaPath = inaPath;
	systemType.m_logoffPath = logoffPath;
	systemType.m_logonPath = logonPath;
	systemType.m_isCsrfTokenRequired = true;
	systemType.m_isContextIdRequired = isContextIdRequired;
	oFF.SystemType.s_instances.put(name, systemType);
	return systemType;
};
oFF.SystemType.lookup = function(name)
{
	return oFF.SystemType.s_instances.getByKey(name);
};
oFF.SystemType.prototype.m_isPreflightRequired = false;
oFF.SystemType.prototype.m_isCapabilityMetadataRequired = false;
oFF.SystemType.prototype.m_isLogonMetadataRequired = false;
oFF.SystemType.prototype.m_logoffPath = null;
oFF.SystemType.prototype.m_serverInfoPath = null;
oFF.SystemType.prototype.m_inaPath = null;
oFF.SystemType.prototype.m_logonPath = null;
oFF.SystemType.prototype.m_isCsrfTokenRequired = false;
oFF.SystemType.prototype.m_isContextIdRequired = false;
oFF.SystemType.prototype.isCapabilityMetadataRequired = function()
{
	return this.m_isCapabilityMetadataRequired;
};
oFF.SystemType.prototype.isLogonMetadataRequired = function()
{
	return this.m_isLogonMetadataRequired;
};
oFF.SystemType.prototype.getServerInfoPath = function()
{
	if (oFF.isNull(this.m_serverInfoPath))
	{
		var parent = this.getParent();
		if (oFF.isNull(parent))
		{
			return null;
		}
		return parent.getServerInfoPath();
	}
	return this.m_serverInfoPath;
};
oFF.SystemType.prototype.getInAPath = function()
{
	if (oFF.isNull(this.m_inaPath))
	{
		var parent = this.getParent();
		if (oFF.isNull(parent))
		{
			return null;
		}
		return parent.getInAPath();
	}
	return this.m_inaPath;
};
oFF.SystemType.prototype.getLogoffPath = function()
{
	if (oFF.isNull(this.m_logoffPath))
	{
		var parent = this.getParent();
		if (oFF.isNull(parent))
		{
			return null;
		}
		return parent.getLogoffPath();
	}
	return this.m_logoffPath;
};
oFF.SystemType.prototype.getLogonPath = function()
{
	if (oFF.isNull(this.m_logonPath))
	{
		var parent = this.getParent();
		if (oFF.isNull(parent))
		{
			return null;
		}
		return parent.getLogonPath();
	}
	return this.m_logonPath;
};
oFF.SystemType.prototype.isPreflightRequired = function()
{
	return this.m_isPreflightRequired;
};
oFF.SystemType.prototype.isCsrfTokenRequired = function()
{
	return this.m_isCsrfTokenRequired;
};
oFF.SystemType.prototype.isContextIdRequired = function()
{
	return this.m_isContextIdRequired;
};

oFF.DfHttpClient = function() {};
oFF.DfHttpClient.prototype = new oFF.SyncAction();
oFF.DfHttpClient.prototype._ff_c = "DfHttpClient";

oFF.DfHttpClient.prototype.m_request = null;
oFF.DfHttpClient.prototype.setupHttpClient = function(sessionContext)
{
	this.setupAction(null, null, null, sessionContext);
	this.m_request = oFF.HttpRequest.create();
};
oFF.DfHttpClient.prototype.releaseObject = function()
{
	if (!this.m_isSyncCanceled)
	{
		this.m_request = oFF.XObjectExt.release(this.m_request);
	}
	oFF.SyncAction.prototype.releaseObject.call( this );
};
oFF.DfHttpClient.prototype.getDefaultMessageLayer = function()
{
	return oFF.OriginLayer.IOLAYER;
};
oFF.DfHttpClient.prototype.getRequest = function()
{
	return this.m_request;
};
oFF.DfHttpClient.prototype.setRequest = function(request)
{
	this.m_request = request;
};
oFF.DfHttpClient.prototype.getResponse = function()
{
	return this.getData();
};
oFF.DfHttpClient.prototype.prepareRequest = function()
{
	var request = this.getRequest();
	request.retrieveCookiesFromMasterStorage();
	request.adaptWebdispatcherRouting(this.getSession());
	return request;
};
oFF.DfHttpClient.prototype.processHttpRequest = function(syncType, listener, customIdentifier)
{
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.DfHttpClient.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onHttpResponse(extResult, data, customIdentifier);
};

oFF.HttpRequest = function() {};
oFF.HttpRequest.prototype = new oFF.HttpExchange();
oFF.HttpRequest.prototype._ff_c = "HttpRequest";

oFF.HttpRequest.create = function()
{
	var response = new oFF.HttpRequest();
	response.setup();
	return response;
};
oFF.HttpRequest.createByUrl = function(url)
{
	var request = new oFF.HttpRequest();
	request.setup();
	request.setUrlString(url);
	return request;
};
oFF.HttpRequest.createByUri = function(uri)
{
	var request = new oFF.HttpRequest();
	request.setup();
	request.setFromUri(uri);
	return request;
};
oFF.HttpRequest.createByHttpRequest = function(httpRequest)
{
	var request = new oFF.HttpRequest();
	request.setup();
	request.setFromHttpRequest(httpRequest);
	return request;
};
oFF.HttpRequest.createByConnectionInfo = function(connectionInfo)
{
	var request = new oFF.HttpRequest();
	request.setup();
	request.setFromConnectionInfo(connectionInfo);
	return request;
};
oFF.HttpRequest.prototype.m_uri = null;
oFF.HttpRequest.prototype.m_relativePath = null;
oFF.HttpRequest.prototype.m_systemName = null;
oFF.HttpRequest.prototype.m_systemText = null;
oFF.HttpRequest.prototype.m_prefix = null;
oFF.HttpRequest.prototype.m_language = null;
oFF.HttpRequest.prototype.m_timeout = 0;
oFF.HttpRequest.prototype.m_systemType = null;
oFF.HttpRequest.prototype.m_acceptContentType = null;
oFF.HttpRequest.prototype.m_method = null;
oFF.HttpRequest.prototype.m_proxySettings = null;
oFF.HttpRequest.prototype.m_useGzipPostEncoding = false;
oFF.HttpRequest.prototype.m_nativeConnection = null;
oFF.HttpRequest.prototype.m_isRewritingApplied = false;
oFF.HttpRequest.prototype.m_isAcceptGzip = false;
oFF.HttpRequest.prototype.m_isLogoff = false;
oFF.HttpRequest.prototype.m_sessionCarrierType = null;
oFF.HttpRequest.prototype.m_requestType = null;
oFF.HttpRequest.prototype.m_corsSecured = true;
oFF.HttpRequest.prototype.setup = function()
{
	oFF.HttpExchange.prototype.setup.call( this );
	this.m_uri = oFF.XUri.create();
	this.m_method = oFF.HttpRequestMethod.HTTP_GET;
	this.m_acceptContentType = oFF.ContentType.WILDCARD;
	this.m_proxySettings = oFF.ProxySettings.create(null);
	this.m_useGzipPostEncoding = false;
	this.m_requestType = oFF.RpcRequestType.UNKNOWN;
	var useGzipValue = oFF.XEnvironment.getInstance().getVariable(oFF.XEnvironmentConstants.HTTP_USE_GZIP_ENCODING);
	if (oFF.notNull(useGzipValue) && (oFF.XString.isEqual("true", useGzipValue) || oFF.XString.isEqual("TRUE", useGzipValue)))
	{
		this.m_useGzipPostEncoding = true;
	}
};
oFF.HttpRequest.prototype.releaseObject = function()
{
	this.m_systemName = null;
	this.m_systemText = null;
	this.m_prefix = null;
	this.m_language = null;
	this.m_systemType = null;
	this.m_acceptContentType = null;
	this.m_method = null;
	this.m_requestType = null;
	this.m_nativeConnection = null;
	this.m_uri = oFF.XObjectExt.release(this.m_uri);
	oFF.HttpExchange.prototype.releaseObject.call( this );
};
oFF.HttpRequest.prototype.setFromHttpRequest = function(httpRequest)
{
	this.setFromHttpExchange(httpRequest);
	oFF.XConnectHelper.copyConnectionInfo(httpRequest, this);
	this.setPath(httpRequest.getPath());
	this.setQuery(httpRequest.getQuery());
	this.setFragment(httpRequest.getFragment());
	this.setMethod(httpRequest.getMethod());
	this.setAcceptContentType(httpRequest.getAcceptContentType());
	this.setAcceptGzip(httpRequest.isAcceptGzip());
	this.setUseGzipPostEncoding(httpRequest.useGzipPostEncoding());
	this.setRequestType(httpRequest.getRequestType());
};
oFF.HttpRequest.prototype.setFromPersonalization = function(personalization)
{
	oFF.XConnectHelper.copyConnectionPersonalization(personalization, this);
};
oFF.HttpRequest.prototype.setFromUri = function(uri)
{
	oFF.XConnectHelper.copyUri(uri, this);
};
oFF.HttpRequest.prototype.setFromConnectionInfo = function(origin)
{
	oFF.XConnectHelper.copyConnectionInfo(origin, this);
};
oFF.HttpRequest.prototype.setFromConnectionPersonalization = function(connectionPersonalization)
{
	oFF.XConnectHelper.copyConnectionPersonalization(connectionPersonalization, this);
};
oFF.HttpRequest.prototype.getAcceptContentType = function()
{
	return this.m_acceptContentType;
};
oFF.HttpRequest.prototype.setAcceptContentType = function(contentType)
{
	this.m_acceptContentType = contentType;
};
oFF.HttpRequest.prototype.isAcceptGzip = function()
{
	return this.m_isAcceptGzip;
};
oFF.HttpRequest.prototype.setAcceptGzip = function(acceptGzip)
{
	this.m_isAcceptGzip = acceptGzip;
};
oFF.HttpRequest.prototype.setMethod = function(method)
{
	this.m_method = method;
};
oFF.HttpRequest.prototype.getMethod = function()
{
	return this.m_method;
};
oFF.HttpRequest.prototype.createRawData = function()
{
	var postData;
	var postDataSize = 0;
	var postDataUtf8 = this.getByteArray();
	if (oFF.isNull(postDataUtf8))
	{
		postData = this.getString();
		if (oFF.notNull(postData))
		{
			postDataUtf8 = oFF.XByteArray.convertFromString(postData);
			postDataSize = postDataUtf8.size();
		}
	}
	else
	{
		postData = oFF.XByteArray.convertToString(postDataUtf8);
		postDataSize = postDataUtf8.size();
	}
	var httpHeader = oFF.HttpCoreUtils.populateHeaderFromRequest(this, oFF.HttpHeader.create(), this, postDataSize, true);
	var httpGetRequest = oFF.HttpCoreUtils.createHttpRequestString(this, httpHeader);
	var rawSummary = oFF.XStringBuffer.create();
	rawSummary.append(httpGetRequest);
	var requestMethod = this.getMethod();
	var full = null;
	if (oFF.XLanguage.getLanguage() !== oFF.XLanguage.JAVASCRIPT)
	{
		var bytes = oFF.XByteArray.convertFromStringWithCharset(httpGetRequest, oFF.XCharset.USASCII);
		full = bytes;
		if (requestMethod === oFF.HttpRequestMethod.HTTP_POST || requestMethod === oFF.HttpRequestMethod.HTTP_PUT)
		{
			if (oFF.notNull(postDataUtf8))
			{
				full = oFF.XByteArray.create(null, bytes.size() + postDataUtf8.size());
				oFF.XByteArray.copy(bytes, 0, full, 0, bytes.size());
				oFF.XByteArray.copy(postDataUtf8, 0, full, bytes.size(), postDataUtf8.size());
			}
		}
	}
	if (requestMethod === oFF.HttpRequestMethod.HTTP_POST || requestMethod === oFF.HttpRequestMethod.HTTP_PUT)
	{
		if (oFF.notNull(postDataUtf8))
		{
			rawSummary.append(postData);
		}
	}
	this.m_rawSummary = rawSummary.toString();
	var host = this.getHost();
	var port = this.getPort();
	if (this.getProxyHost() !== null)
	{
		host = this.getProxyHost();
		port = this.getProxyPort();
	}
	return oFF.HttpRawData.create(this.getProtocolType(), host, port, full);
};
oFF.HttpRequest.prototype.getProxyHost = function()
{
	return this.m_proxySettings.getProxyHost();
};
oFF.HttpRequest.prototype.getProxyPort = function()
{
	return this.m_proxySettings.getProxyPort();
};
oFF.HttpRequest.prototype.setProxyHost = function(host)
{
	this.m_proxySettings.setProxyHost(host);
};
oFF.HttpRequest.prototype.setProxyPort = function(port)
{
	this.m_proxySettings.setProxyPort(port);
};
oFF.HttpRequest.prototype.getProxyAuthorization = function()
{
	return this.m_proxySettings.getProxyAuthorization();
};
oFF.HttpRequest.prototype.setProxyAuthorization = function(authorization)
{
	this.m_proxySettings.setProxyAuthorization(authorization);
};
oFF.HttpRequest.prototype.getSccLocationId = function()
{
	return this.m_proxySettings.getSccLocationId();
};
oFF.HttpRequest.prototype.setSccLocationId = function(sccLocationId)
{
	this.m_proxySettings.setSccLocationId(sccLocationId);
};
oFF.HttpRequest.prototype.getWebdispatcherTemplate = function()
{
	return this.m_proxySettings.getWebdispatcherTemplate();
};
oFF.HttpRequest.prototype.setWebdispatcherUri = function(template)
{
	this.m_proxySettings.setWebdispatcherTemplate(template);
};
oFF.HttpRequest.prototype.setWebdispatcherTemplate = function(template)
{
	this.m_proxySettings.setWebdispatcherTemplate(template);
};
oFF.HttpRequest.prototype.getProxyType = function()
{
	return this.m_proxySettings.getProxyType();
};
oFF.HttpRequest.prototype.setProxyType = function(type)
{
	this.m_proxySettings.setProxyType(type);
};
oFF.HttpRequest.prototype.getProxyHttpHeaders = function()
{
	return this.m_proxySettings.getProxyHttpHeaders();
};
oFF.HttpRequest.prototype.setProxyHttpHeader = function(name, value)
{
	this.m_proxySettings.setProxyHttpHeader(name, value);
};
oFF.HttpRequest.prototype.useGzipPostEncoding = function()
{
	return this.m_useGzipPostEncoding;
};
oFF.HttpRequest.prototype.setUseGzipPostEncoding = function(useGzipPostEncoding)
{
	this.m_useGzipPostEncoding = useGzipPostEncoding;
};
oFF.HttpRequest.prototype.setPath = function(path)
{
	this.m_uri.setPath(path);
};
oFF.HttpRequest.prototype.getPath = function()
{
	return this.m_uri.getPath();
};
oFF.HttpRequest.prototype.getFileName = function()
{
	return this.m_uri.getFileName();
};
oFF.HttpRequest.prototype.getParentPath = function()
{
	return this.m_uri.getParentPath();
};
oFF.HttpRequest.prototype.getQueryMap = function()
{
	return this.m_uri.getQueryMap();
};
oFF.HttpRequest.prototype.addQueryElement = function(name, value)
{
	this.m_uri.addQueryElement(name, value);
};
oFF.HttpRequest.prototype.addQueryElements = function(elements)
{
	this.m_uri.addQueryElements(elements);
};
oFF.HttpRequest.prototype.getQueryElements = function()
{
	return this.m_uri.getQueryElements();
};
oFF.HttpRequest.prototype.getFragment = function()
{
	return this.m_uri.getFragment();
};
oFF.HttpRequest.prototype.getFragmentQueryElements = function()
{
	return this.m_uri.getFragmentQueryElements();
};
oFF.HttpRequest.prototype.getFragmentQueryMap = function()
{
	return this.m_uri.getFragmentQueryMap();
};
oFF.HttpRequest.prototype.addFragmentQueryElement = function(name, value)
{
	this.m_uri.addFragmentQueryElement(name, value);
};
oFF.HttpRequest.prototype.getUriString = function()
{
	return this.getUrl();
};
oFF.HttpRequest.prototype.getUrlString = function()
{
	return this.getUrl();
};
oFF.HttpRequest.prototype.getUrl = function()
{
	return this.m_uri.getUrl();
};
oFF.HttpRequest.prototype.getUriStringWithoutAuthentication = function()
{
	return this.getUrlStringWithoutAuthentication();
};
oFF.HttpRequest.prototype.getUrlStringWithoutAuthentication = function()
{
	return this.m_uri.getUrlStringWithoutAuthentication();
};
oFF.HttpRequest.prototype.getUriStringExt = function(withScheme, withUser, withPwd, withAuthenticationType, withHostPort, withPath, withQuery, withFragment)
{
	return this.getUrlStringExt(withScheme, withUser, withPwd, withAuthenticationType, withHostPort, withPath, withQuery, withFragment);
};
oFF.HttpRequest.prototype.getUrlStringExt = function(withScheme, withUser, withPwd, withAuthenticationType, withHostPort, withPath, withQuery, withFragment)
{
	return this.m_uri.getUrlStringExt(withScheme, withUser, withPwd, withAuthenticationType, withHostPort, withPath, withQuery, withFragment);
};
oFF.HttpRequest.prototype.getScheme = function()
{
	return this.m_uri.getScheme();
};
oFF.HttpRequest.prototype.getProtocolType = function()
{
	return this.m_uri.getProtocolType();
};
oFF.HttpRequest.prototype.getUser = function()
{
	return this.m_uri.getUser();
};
oFF.HttpRequest.prototype.getPassword = function()
{
	return this.m_uri.getPassword();
};
oFF.HttpRequest.prototype.getAuthenticationType = function()
{
	return this.m_uri.getAuthenticationType();
};
oFF.HttpRequest.prototype.getUserToken = function()
{
	return this.m_uri.getUserToken();
};
oFF.HttpRequest.prototype.setUserToken = function(userToken)
{
	this.m_uri.setUserToken(userToken);
};
oFF.HttpRequest.prototype.getOrganizationToken = function()
{
	return this.m_uri.getOrganizationToken();
};
oFF.HttpRequest.prototype.setOrganizationToken = function(organizationToken)
{
	this.m_uri.setOrganizationToken(organizationToken);
};
oFF.HttpRequest.prototype.getElementToken = function()
{
	return this.m_uri.getElementToken();
};
oFF.HttpRequest.prototype.setElementToken = function(elementToken)
{
	this.m_uri.setElementToken(elementToken);
};
oFF.HttpRequest.prototype.getTenantId = function()
{
	return this.m_uri.getTenantId();
};
oFF.HttpRequest.prototype.setTenantId = function(tenantId)
{
	this.m_uri.setTenantId(tenantId);
};
oFF.HttpRequest.prototype.getInternalUser = function()
{
	return this.m_uri.getInternalUser();
};
oFF.HttpRequest.prototype.setInternalUser = function(user)
{
	this.m_uri.setInternalUser(user);
};
oFF.HttpRequest.prototype.getHost = function()
{
	return this.m_uri.getHost();
};
oFF.HttpRequest.prototype.getPort = function()
{
	return this.m_uri.getPort();
};
oFF.HttpRequest.prototype.getX509Certificate = function()
{
	return this.m_uri.getX509Certificate();
};
oFF.HttpRequest.prototype.getSecureLoginProfile = function()
{
	return this.m_uri.getSecureLoginProfile();
};
oFF.HttpRequest.prototype.setUriString = function(uriString)
{
	this.setUrlString(uriString);
};
oFF.HttpRequest.prototype.setUrlString = function(uriString)
{
	this.m_uri.setUrlString(uriString);
};
oFF.HttpRequest.prototype.setFromUriWithParent = function(urlString, parentUri, mergeQueries)
{
	this.setFromUrlWithParent(urlString, parentUri, mergeQueries);
};
oFF.HttpRequest.prototype.setFromFileSystemPath = function(session, path, pathFormat, varResolveMode)
{
	this.m_uri.setFromFileSystemPath(session, path, pathFormat, varResolveMode);
};
oFF.HttpRequest.prototype.setFromSchemeAndNativePath = function(scheme, path)
{
	this.m_uri.setFromSchemeAndNativePath(scheme, path);
};
oFF.HttpRequest.prototype.setFromUrlWithParent = function(urlString, parentUri, mergeQueries)
{
	this.m_uri.setFromUrlWithParent(urlString, parentUri, mergeQueries);
};
oFF.HttpRequest.prototype.setFragment = function(fragment)
{
	this.m_uri.setFragment(fragment);
};
oFF.HttpRequest.prototype.setQuery = function(query)
{
	this.m_uri.setQuery(query);
};
oFF.HttpRequest.prototype.setFromConnection = function(connection)
{
	this.m_uri.setFromConnection(connection);
};
oFF.HttpRequest.prototype.setScheme = function(scheme)
{
	this.m_uri.setScheme(scheme);
};
oFF.HttpRequest.prototype.setProtocolType = function(type)
{
	this.m_uri.setProtocolType(type);
};
oFF.HttpRequest.prototype.setUser = function(user)
{
	this.m_uri.setUser(user);
};
oFF.HttpRequest.prototype.setPassword = function(password)
{
	this.m_uri.setPassword(password);
};
oFF.HttpRequest.prototype.getAuthenticationToken = function()
{
	return this.m_uri.getAuthenticationToken();
};
oFF.HttpRequest.prototype.setAuthenticationToken = function(token)
{
	this.m_uri.setAuthenticationToken(token);
};
oFF.HttpRequest.prototype.getAccessToken = function()
{
	return this.m_uri.getAccessToken();
};
oFF.HttpRequest.prototype.setAccessToken = function(token)
{
	this.m_uri.setAccessToken(token);
};
oFF.HttpRequest.prototype.supportsAuthority = function()
{
	return this.m_uri.supportsAuthority();
};
oFF.HttpRequest.prototype.setSupportsAuthority = function(supportsAuthority)
{
	this.m_uri.setSupportsAuthority(supportsAuthority);
};
oFF.HttpRequest.prototype.setAuthenticationType = function(type)
{
	this.m_uri.setAuthenticationType(type);
};
oFF.HttpRequest.prototype.setHost = function(host)
{
	this.m_uri.setHost(host);
};
oFF.HttpRequest.prototype.setPort = function(port)
{
	this.m_uri.setPort(port);
};
oFF.HttpRequest.prototype.setX509Certificate = function(x509Certificate)
{
	this.m_uri.setX509Certificate(x509Certificate);
};
oFF.HttpRequest.prototype.setSecureLoginProfile = function(secureLoginProfile)
{
	this.m_uri.setSecureLoginProfile(secureLoginProfile);
};
oFF.HttpRequest.prototype.isRelativeUri = function()
{
	return this.m_uri.isRelativeUri();
};
oFF.HttpRequest.prototype.getQuery = function()
{
	return this.m_uri.getQuery();
};
oFF.HttpRequest.prototype.normalizePath = function(enforceDirectory)
{
	return this.m_uri.normalizePath(enforceDirectory);
};
oFF.HttpRequest.prototype.getAlias = function()
{
	return this.m_uri.getAlias();
};
oFF.HttpRequest.prototype.setAlias = function(alias)
{
	this.m_uri.setAlias(alias);
};
oFF.HttpRequest.prototype.setChildPath = function(childName)
{
	this.m_uri.setChildPath(childName);
};
oFF.HttpRequest.prototype.setSiblingPath = function(siblingName)
{
	this.m_uri.setSiblingPath(siblingName);
};
oFF.HttpRequest.prototype.getSystemName = function()
{
	return this.m_systemName;
};
oFF.HttpRequest.prototype.setSystemName = function(systemName)
{
	this.m_systemName = systemName;
};
oFF.HttpRequest.prototype.getSystemText = function()
{
	return this.m_systemText;
};
oFF.HttpRequest.prototype.setSystemText = function(systemText)
{
	this.m_systemText = systemText;
};
oFF.HttpRequest.prototype.getTimeout = function()
{
	return this.m_timeout;
};
oFF.HttpRequest.prototype.setTimeout = function(milliseconds)
{
	this.m_timeout = milliseconds;
};
oFF.HttpRequest.prototype.getSystemType = function()
{
	return this.m_systemType;
};
oFF.HttpRequest.prototype.setSystemType = function(systemType)
{
	this.m_systemType = systemType;
};
oFF.HttpRequest.prototype.getSessionCarrierType = function()
{
	return this.m_sessionCarrierType;
};
oFF.HttpRequest.prototype.setSessionCarrierType = function(sessionCarrierType)
{
	this.m_sessionCarrierType = sessionCarrierType;
};
oFF.HttpRequest.prototype.getPrefix = function()
{
	return this.m_prefix;
};
oFF.HttpRequest.prototype.setPrefix = function(prefix)
{
	this.m_prefix = prefix;
};
oFF.HttpRequest.prototype.getLanguage = function()
{
	return this.m_language;
};
oFF.HttpRequest.prototype.setLanguage = function(language)
{
	this.m_language = language;
};
oFF.HttpRequest.prototype.getNativeConnection = function()
{
	return this.m_nativeConnection;
};
oFF.HttpRequest.prototype.setNativeConnection = function(nativeConnection)
{
	this.m_nativeConnection = nativeConnection;
};
oFF.HttpRequest.prototype.setReferer = function(referer)
{
	this.getHeaderFieldsBase().putString(oFF.HttpConstants.HD_REFERER, referer);
};
oFF.HttpRequest.prototype.getReferer = function()
{
	return this.getHeaderFields().getByKey(oFF.HttpConstants.HD_REFERER);
};
oFF.HttpRequest.prototype.setOrigin = function(origin)
{
	this.getHeaderFieldsBase().putString(oFF.HttpConstants.HD_ORIGIN, origin);
};
oFF.HttpRequest.prototype.getOrigin = function()
{
	return this.getHeaderFields().getByKey(oFF.HttpConstants.HD_ORIGIN);
};
oFF.HttpRequest.prototype.retrieveCookiesFromMasterStorage = function()
{
	if (oFF.notNull(this.m_cookiesMasterStore) && oFF.isNull(this.m_cookies))
	{
		this.m_cookies = this.m_cookiesMasterStore.getCookies(this.getHost(), this.getPath());
	}
};
oFF.HttpRequest.prototype.newHttpClient = function(session)
{
	return this.newHttpClientExt(session, true);
};
oFF.HttpRequest.prototype.newHttpClientExt = function(session, adaptWebdispatcherRouting)
{
	if (adaptWebdispatcherRouting)
	{
		this.adaptWebdispatcherRouting(session);
	}
	var httpClient = oFF.HttpClientFactory.newInstanceByConnection(session, this);
	if (oFF.notNull(httpClient))
	{
		httpClient.setRequest(this);
	}
	return httpClient;
};
oFF.HttpRequest.prototype.adaptWebdispatcherRouting = function(session)
{
	if (this.m_isRewritingApplied === false)
	{
		oFF.XConnectHelper.applyProxySettings(this, session);
		oFF.XConnectHelper.applyWebdispatcherTemplate(this, this, this, session);
		this.m_isRewritingApplied = true;
		session.getLogger().logObj(this);
	}
};
oFF.HttpRequest.prototype.isLogoff = function()
{
	return this.m_isLogoff;
};
oFF.HttpRequest.prototype.setIsLogoff = function(isLogoff)
{
	this.m_isLogoff = isLogoff;
};
oFF.HttpRequest.prototype.isRewritingApplied = function()
{
	return this.m_isRewritingApplied;
};
oFF.HttpRequest.prototype.setIsRewritingApplied = function(isRewritingApplied)
{
	this.m_isRewritingApplied = isRewritingApplied;
};
oFF.HttpRequest.prototype.getRelativePath = function()
{
	return oFF.isNull(this.m_relativePath) ? this.getPath() : this.m_relativePath;
};
oFF.HttpRequest.prototype.setRelativePath = function(relativePath)
{
	this.m_relativePath = relativePath;
};
oFF.HttpRequest.prototype.getRequestType = function()
{
	return this.m_requestType;
};
oFF.HttpRequest.prototype.setRequestType = function(requestType)
{
	this.m_requestType = requestType;
};
oFF.HttpRequest.prototype.toString = function()
{
	var buffer = oFF.XStringBuffer.create();
	buffer.append(this.getRawSummary());
	if (this.getProxyType() === oFF.ProxyType.PROXY)
	{
		buffer.append("=== Proxy Settings ===");
		buffer.append("Host: ").appendLine(this.getProxyHost());
		buffer.append("Port: ").appendInt(this.getProxyPort()).appendNewLine();
	}
	return buffer.toString();
};
oFF.HttpRequest.prototype.getRawSummary = function()
{
	var buffer = oFF.XStringBuffer.create();
	buffer.append(this.m_method.getName()).append(" ").appendLine(this.getUrlStringWithoutAuthentication());
	var httpHeader = oFF.HttpCoreUtils.populateHeaderFromRequest(this, oFF.HttpHeader.create(), this, 0, true);
	buffer.appendLine(httpHeader.generateHttpHeaderString());
	buffer.appendLine(oFF.HttpExchange.prototype.getRawSummary.call( this ));
	this.m_rawSummary = buffer.toString();
	return this.m_rawSummary;
};
oFF.HttpRequest.prototype.setCorsSecured = function(enable)
{
	this.m_corsSecured = enable;
};
oFF.HttpRequest.prototype.isCorsSecured = function()
{
	return this.m_corsSecured;
};

oFF.HttpResponse = function() {};
oFF.HttpResponse.prototype = new oFF.HttpExchange();
oFF.HttpResponse.prototype._ff_c = "HttpResponse";

oFF.HttpResponse.createResponse = function(httpRequest)
{
	var response = new oFF.HttpResponse();
	response.setupResponse(httpRequest);
	return response;
};
oFF.HttpResponse.prototype.m_statusCode = 0;
oFF.HttpResponse.prototype.m_statusCodeDetails = null;
oFF.HttpResponse.prototype.m_httpMethodWithVersion = null;
oFF.HttpResponse.prototype.m_httpRequest = null;
oFF.HttpResponse.prototype.m_isGoLiveRequired = false;
oFF.HttpResponse.prototype.setupResponse = function(httpRequest)
{
	this.setup();
	this.m_httpRequest = httpRequest;
	this.m_statusCode = oFF.HttpStatusCode.SC_OK;
	var cookiesMasterStore = httpRequest.getCookiesMasterStore();
	this.setCookiesMasterStore(cookiesMasterStore);
};
oFF.HttpResponse.prototype.releaseObject = function()
{
	this.m_statusCodeDetails = null;
	this.m_httpMethodWithVersion = null;
	oFF.HttpExchange.prototype.releaseObject.call( this );
};
oFF.HttpResponse.prototype.getStatusCode = function()
{
	return this.m_statusCode;
};
oFF.HttpResponse.prototype.setStatusCode = function(statusCode)
{
	this.m_statusCode = statusCode;
};
oFF.HttpResponse.prototype.getStatusCodeDetails = function()
{
	return this.m_statusCodeDetails;
};
oFF.HttpResponse.prototype.setStatusCodeDetails = function(details)
{
	this.m_statusCodeDetails = details;
};
oFF.HttpResponse.prototype.getHttpMethodWithVersion = function()
{
	return this.m_httpMethodWithVersion;
};
oFF.HttpResponse.prototype.setHttpMethodWithVersion = function(httpMethod)
{
	this.m_httpMethodWithVersion = httpMethod;
};
oFF.HttpResponse.prototype.getLocation = function()
{
	return this.getHeaderFields().getByKey(oFF.HttpConstants.HD_LOCATION);
};
oFF.HttpResponse.prototype.setLocation = function(location)
{
	this.getHeaderFieldsBase().putString(oFF.HttpConstants.HD_LOCATION, location);
};
oFF.HttpResponse.prototype.createRawData = function()
{
	var httpBuffer = oFF.XStringBuffer.create();
	httpBuffer.append(oFF.HttpConstants.HTTP_11);
	httpBuffer.append(" ");
	httpBuffer.append(oFF.XInteger.convertToString(this.getStatusCode()));
	httpBuffer.append(" ");
	httpBuffer.append(this.getStatusCodeDetails());
	httpBuffer.append(oFF.HttpConstants.HTTP_CRLF);
	if (this.getLocation() !== null)
	{
		httpBuffer.append(oFF.HttpConstants.HD_LOCATION);
		httpBuffer.append(": ");
		httpBuffer.append(this.getLocation());
		httpBuffer.append(oFF.HttpConstants.HTTP_CRLF);
	}
	httpBuffer.append(oFF.HttpConstants.HD_CONTENT_TYPE);
	httpBuffer.append(": ");
	var contentType = this.getContentType();
	var data = null;
	var isDataSet = false;
	if (oFF.isNull(contentType))
	{
		httpBuffer.append(this.getContentTypeValue());
	}
	else
	{
		httpBuffer.append(contentType.getName());
		if (contentType.isText())
		{
			httpBuffer.append(";charset=utf-8");
			var postData = this.getString();
			if (oFF.notNull(postData))
			{
				data = oFF.XByteArray.convertFromString(postData);
			}
			isDataSet = true;
		}
	}
	httpBuffer.append(oFF.HttpConstants.HTTP_CRLF);
	this.appendCookies(httpBuffer);
	if (!isDataSet)
	{
		var binaryContent = this.getByteArray();
		if (oFF.notNull(binaryContent))
		{
			data = binaryContent;
		}
	}
	httpBuffer.append(oFF.HttpConstants.HD_CONTENT_LENGTH);
	httpBuffer.append(": ");
	if (oFF.isNull(data))
	{
		httpBuffer.append("0");
	}
	else
	{
		httpBuffer.appendInt(data.size());
	}
	httpBuffer.append(oFF.HttpConstants.HTTP_CRLF);
	this.appendHeadFields(httpBuffer);
	httpBuffer.append(oFF.HttpConstants.HTTP_CRLF);
	var httpGetResponse = httpBuffer.toString();
	var bytes = oFF.XByteArray.convertFromStringWithCharset(httpGetResponse, oFF.XCharset.USASCII);
	var full = bytes;
	if (oFF.notNull(data) && oFF.notNull(bytes))
	{
		full = oFF.XByteArray.create(null, bytes.size() + data.size());
		oFF.XByteArray.copy(bytes, 0, full, 0, bytes.size());
		oFF.XByteArray.copy(data, 0, full, bytes.size(), data.size());
	}
	return oFF.HttpRawData.create(null, null, 0, full);
};
oFF.HttpResponse.prototype.appendCookies = function(httpBuffer)
{
	var cookieContainer = this.getCookies();
	if (oFF.notNull(cookieContainer))
	{
		var cookies = cookieContainer.getCookies();
		for (var i = 0; i < cookies.size(); i++)
		{
			var currentCookie = cookies.get(i);
			httpBuffer.append(oFF.HttpConstants.HD_SET_COOKIE);
			httpBuffer.append(": ");
			httpBuffer.append(currentCookie.getName());
			httpBuffer.append("=");
			httpBuffer.append(currentCookie.getValue());
			httpBuffer.append(";Path=");
			httpBuffer.append(currentCookie.getPath());
			httpBuffer.append(oFF.HttpConstants.HTTP_CRLF);
		}
	}
};
oFF.HttpResponse.prototype.appendHeadFields = function(httpBuffer)
{
	var headerFields = this.getHeaderFields();
	var keysAsIteratorOfString = headerFields.getKeysAsIteratorOfString();
	while (keysAsIteratorOfString.hasNext())
	{
		var headerName = keysAsIteratorOfString.next();
		var headerValue = headerFields.getByKey(headerName);
		httpBuffer.append(headerName);
		httpBuffer.append(": ");
		httpBuffer.append(headerValue);
		httpBuffer.append(oFF.HttpConstants.HTTP_CRLF);
	}
};
oFF.HttpResponse.prototype.getHttpRequest = function()
{
	return this.m_httpRequest;
};
oFF.HttpResponse.prototype.applyCookiesToMasterStorage = function()
{
	if (oFF.notNull(this.m_cookiesMasterStore) && oFF.notNull(this.m_cookies))
	{
		var httpRequest = this.getHttpRequest();
		var host = httpRequest.getHost();
		var path = httpRequest.getPath();
		var cookies = this.getCookies();
		this.m_cookiesMasterStore.applyCookies(host, path, cookies);
	}
};
oFF.HttpResponse.prototype.isGoLiveRequired = function()
{
	return this.m_isGoLiveRequired;
};
oFF.HttpResponse.prototype.setIsGoLiveRequired = function(isGoLiveRequired)
{
	this.m_isGoLiveRequired = isGoLiveRequired;
};
oFF.HttpResponse.prototype.toString = function()
{
	var sb = oFF.XStringBuffer.create();
	sb.appendNewLine();
	sb.appendLine("*************");
	sb.appendLine("HTTP Response");
	sb.appendLine("*************");
	sb.append(oFF.HttpConstants.HTTP_11).append(" ").appendInt(this.getStatusCode());
	sb.append(" ").append(this.getStatusCodeDetails());
	sb.append(oFF.HttpConstants.HTTP_CRLF);
	if (this.getLocation() !== null)
	{
		sb.append(oFF.HttpConstants.HD_LOCATION).append(": ").append(this.getLocation()).append(oFF.HttpConstants.HTTP_CRLF);
	}
	var contentType = this.getContentType();
	var postData = null;
	if (oFF.notNull(contentType))
	{
		if (contentType.isText())
		{
			postData = this.getString();
		}
	}
	var cookieContainer = this.getCookies();
	if (oFF.notNull(cookieContainer))
	{
		var cookies = cookieContainer.getCookies();
		var currentCookie;
		for (var i = 0; i < cookies.size(); i++)
		{
			currentCookie = cookies.get(i);
			sb.append(oFF.HttpConstants.HD_SET_COOKIE);
			sb.append(": ").append(currentCookie.getName());
			sb.append("=").append(currentCookie.getValue());
			sb.append(";Path=").append(currentCookie.getPath());
			sb.append(oFF.HttpConstants.HTTP_CRLF);
		}
	}
	var headerFields = this.getHeaderFields();
	var keysAsIteratorOfString = headerFields.getKeysAsIteratorOfString();
	while (keysAsIteratorOfString.hasNext())
	{
		var headerName = keysAsIteratorOfString.next();
		var headerValue = headerFields.getByKey(headerName);
		sb.append(headerName).append(": ").append(headerValue).append(oFF.HttpConstants.HTTP_CRLF);
	}
	if (oFF.notNull(postData))
	{
		sb.append(oFF.HttpConstants.HTTP_CRLF).append(postData).append(oFF.HttpConstants.HTTP_CRLF);
	}
	return sb.toString();
};

oFF.HttpServerConfig = function() {};
oFF.HttpServerConfig.prototype = new oFF.XConnection();
oFF.HttpServerConfig.prototype._ff_c = "HttpServerConfig";

oFF.HttpServerConfig.create = function()
{
	var obj = new oFF.HttpServerConfig();
	obj.setup();
	return obj;
};
oFF.HttpServerConfig.prototype.m_listener = null;
oFF.HttpServerConfig.prototype.releaseObject = function()
{
	this.m_listener = null;
	oFF.XConnection.prototype.releaseObject.call( this );
};
oFF.HttpServerConfig.prototype.getCallback = function()
{
	return this.m_listener;
};
oFF.HttpServerConfig.prototype.setCallback = function(listener)
{
	this.m_listener = listener;
};

oFF.DfRpcFunction = function() {};
oFF.DfRpcFunction.prototype = new oFF.SyncAction();
oFF.DfRpcFunction.prototype._ff_c = "DfRpcFunction";

oFF.DfRpcFunction.prototype.m_functionUri = null;
oFF.DfRpcFunction.prototype.m_rpcRequest = null;
oFF.DfRpcFunction.prototype.m_rpcResponse = null;
oFF.DfRpcFunction.prototype.m_traceInfo = null;
oFF.DfRpcFunction.prototype.m_processingHint = null;
oFF.DfRpcFunction.prototype.m_isServerMetadataCall = false;
oFF.DfRpcFunction.prototype.m_isKeepAliveCall = false;
oFF.DfRpcFunction.prototype.setupRpcFunction = oFF.noSupport;
oFF.DfRpcFunction.prototype.setupFunction = function(context, connectionInfo, functionUri)
{
	this.setupAction(null, null, null, context);
	this.m_functionUri = functionUri;
	this.m_rpcRequest = oFF.RpcRequest.create(this, connectionInfo);
	this.m_rpcResponse = oFF.RpcResponse.create(this);
	this.m_processingHint = oFF.PrFactory.createStructure();
};
oFF.DfRpcFunction.prototype.releaseObject = function()
{
	this.m_functionUri = null;
	this.m_rpcRequest = oFF.XObjectExt.release(this.m_rpcRequest);
	this.m_rpcResponse = oFF.XObjectExt.release(this.m_rpcResponse);
	this.m_traceInfo = oFF.XObjectExt.release(this.m_traceInfo);
	this.m_processingHint = oFF.XObjectExt.release(this.m_processingHint);
	oFF.SyncAction.prototype.releaseObject.call( this );
};
oFF.DfRpcFunction.prototype.getName = function()
{
	return this.m_functionUri.toString();
};
oFF.DfRpcFunction.prototype.getFunctionUri = function()
{
	return this.m_functionUri;
};
oFF.DfRpcFunction.prototype.getRequest = function()
{
	return this.getRpcRequest();
};
oFF.DfRpcFunction.prototype.getRpcRequest = function()
{
	return this.m_rpcRequest;
};
oFF.DfRpcFunction.prototype.getResponse = function()
{
	return this.getRpcResponse();
};
oFF.DfRpcFunction.prototype.getRpcResponse = function()
{
	return this.m_rpcResponse;
};
oFF.DfRpcFunction.prototype.getExtResult = function()
{
	return this;
};
oFF.DfRpcFunction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onFunctionExecuted(extResult, data, customIdentifier);
};
oFF.DfRpcFunction.prototype.processFunctionExecution = function(syncType, listener, customIdentifier)
{
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.DfRpcFunction.prototype.getTraceInfo = function()
{
	return this.m_traceInfo;
};
oFF.DfRpcFunction.prototype.setTraceInfo = function(traceInfo)
{
	this.m_traceInfo = traceInfo;
};
oFF.DfRpcFunction.prototype.getTraceType = function()
{
	if (oFF.isNull(this.m_traceInfo))
	{
		return oFF.TraceType.NONE;
	}
	return this.m_traceInfo.getTraceType();
};
oFF.DfRpcFunction.prototype.setIsServerMetadataCall = function(isServerMetadataCall)
{
	this.m_isServerMetadataCall = isServerMetadataCall;
};
oFF.DfRpcFunction.prototype.isServerMetadataCall = function()
{
	return this.m_isServerMetadataCall;
};
oFF.DfRpcFunction.prototype.setIsKeepAliveCall = function(isKeepAliveCall)
{
	this.m_isKeepAliveCall = isKeepAliveCall;
};
oFF.DfRpcFunction.prototype.isKeepAliveCall = function()
{
	return this.m_isKeepAliveCall;
};
oFF.DfRpcFunction.prototype.getProcessingHint = function()
{
	return this.m_processingHint;
};
oFF.DfRpcFunction.prototype.setStaticURL = function(staticURL) {};

oFF.SqlSynchroniousQueryAction = function() {};
oFF.SqlSynchroniousQueryAction.prototype = new oFF.SyncAction();
oFF.SqlSynchroniousQueryAction.prototype._ff_c = "SqlSynchroniousQueryAction";

oFF.SqlSynchroniousQueryAction.createAndRun = function(data, syncType, listener, customIdentifier, context)
{
	var obj = new oFF.SqlSynchroniousQueryAction();
	obj.m_data = data;
	obj.setupActionAndRun(syncType, listener, customIdentifier, context);
	return obj;
};
oFF.SqlSynchroniousQueryAction.prototype.m_data = null;
oFF.SqlSynchroniousQueryAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onQueryResult(extResult, data, customIdentifier);
};
oFF.SqlSynchroniousQueryAction.prototype.processSynchronization = function(syncType)
{
	this.setData(this.m_data);
	return false;
};

oFF.SqlSynchroniousUpdateAction = function() {};
oFF.SqlSynchroniousUpdateAction.prototype = new oFF.SyncAction();
oFF.SqlSynchroniousUpdateAction.prototype._ff_c = "SqlSynchroniousUpdateAction";

oFF.SqlSynchroniousUpdateAction.createAndRun = function(data, syncType, listener, customIdentifier, context)
{
	var obj = new oFF.SqlSynchroniousUpdateAction();
	obj.m_data = data;
	obj.setupActionAndRun(syncType, listener, customIdentifier, context);
	return obj;
};
oFF.SqlSynchroniousUpdateAction.prototype.m_data = null;
oFF.SqlSynchroniousUpdateAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onUpdated(extResult, data, customIdentifier);
};
oFF.SqlSynchroniousUpdateAction.prototype.processSynchronization = function(syncType)
{
	this.setData(this.m_data);
	return false;
};

oFF.IoComponentType = function() {};
oFF.IoComponentType.prototype = new oFF.XComponentType();
oFF.IoComponentType.prototype._ff_c = "IoComponentType";

oFF.IoComponentType.FILE = null;
oFF.IoComponentType.BINDING_ADAPTER = null;
oFF.IoComponentType.BINDING_ADAPTER_INT = null;
oFF.IoComponentType.BINDING_ADAPTER_STRING = null;
oFF.IoComponentType.BINDING_ADAPTER_JSON = null;
oFF.IoComponentType.BINDING_SENDER = null;
oFF.IoComponentType.BINDING_RECEIVER = null;
oFF.IoComponentType.DATA_PROVIDER = null;
oFF.IoComponentType.staticSetupIoType = function()
{
	oFF.IoComponentType.FILE = oFF.IoComponentType.createIoType("File", oFF.XComponentType._ROOT);
	oFF.IoComponentType.BINDING_ADAPTER = oFF.IoComponentType.createIoType("BindingAdapter", oFF.XComponentType._ROOT);
	oFF.IoComponentType.BINDING_ADAPTER_INT = oFF.IoComponentType.createIoType("BindingAdapterInt", oFF.IoComponentType.BINDING_ADAPTER);
	oFF.IoComponentType.BINDING_ADAPTER_STRING = oFF.IoComponentType.createIoType("BindingAdapterString", oFF.IoComponentType.BINDING_ADAPTER);
	oFF.IoComponentType.BINDING_ADAPTER_JSON = oFF.IoComponentType.createIoType("BindingAdapterJson", oFF.IoComponentType.BINDING_ADAPTER);
	oFF.IoComponentType.BINDING_SENDER = oFF.IoComponentType.createIoType("BindingSender", oFF.IoComponentType.BINDING_SENDER);
	oFF.IoComponentType.BINDING_RECEIVER = oFF.IoComponentType.createIoType("BindingReceiver", oFF.IoComponentType.BINDING_RECEIVER);
	oFF.IoComponentType.DATA_PROVIDER = oFF.IoComponentType.createIoType("DataProvider", oFF.XComponentType._DATASOURCE);
};
oFF.IoComponentType.createIoType = function(constant, parent)
{
	var mt = new oFF.IoComponentType();
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

oFF.XFileActionDelete = function() {};
oFF.XFileActionDelete.prototype = new oFF.DXFileAction();
oFF.XFileActionDelete.prototype._ff_c = "XFileActionDelete";

oFF.XFileActionDelete.createAndRun = function(syncType, listener, customIdentifier, fileSystem, file)
{
	var object = new oFF.XFileActionDelete();
	object.setData(file);
	object.setupActionAndRun(syncType, listener, customIdentifier, fileSystem);
	return object;
};
oFF.XFileActionDelete.prototype.processSynchronization = function(syncType)
{
	var file = this.getFile();
	file.deleteFile();
	this.addAllMessages(file);
	return false;
};
oFF.XFileActionDelete.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onFileDeleted(extResult, data, customIdentifier);
};

oFF.XFileActionExecute = function() {};
oFF.XFileActionExecute.prototype = new oFF.DXFileAction();
oFF.XFileActionExecute.prototype._ff_c = "XFileActionExecute";

oFF.XFileActionExecute.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onFileExecuted(extResult, data, data.getFileContent(), customIdentifier);
};

oFF.XFileActionFetchChildren = function() {};
oFF.XFileActionFetchChildren.prototype = new oFF.DXFileAction();
oFF.XFileActionFetchChildren.prototype._ff_c = "XFileActionFetchChildren";

oFF.XFileActionFetchChildren.createAndRun = function(syncType, listener, customIdentifier, fileSystem, file)
{
	var object = new oFF.XFileActionFetchChildren();
	object.setData(file);
	object.setupActionAndRun(syncType, listener, customIdentifier, fileSystem);
	return object;
};
oFF.XFileActionFetchChildren.prototype.processSynchronization = function(syncType)
{
	var file = this.getFile();
	file.getChildren();
	this.addAllMessages(file);
	return false;
};
oFF.XFileActionFetchChildren.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onChildrenFetched(extResult, data, customIdentifier);
};

oFF.XFileActionLoad = function() {};
oFF.XFileActionLoad.prototype = new oFF.DXFileAction();
oFF.XFileActionLoad.prototype._ff_c = "XFileActionLoad";

oFF.XFileActionLoad.createAndRun = function(syncType, listener, customIdentifier, fileSystem, file, compression)
{
	var object = new oFF.XFileActionLoad();
	object.m_compression = compression;
	object.setData(file);
	object.setupActionAndRun(syncType, listener, customIdentifier, fileSystem);
	return object;
};
oFF.XFileActionLoad.prototype.m_compression = null;
oFF.XFileActionLoad.prototype.processSynchronization = function(syncType)
{
	var file = this.getFile();
	if (this.m_compression === oFF.CompressionType.GZIP)
	{
		file.loadGzipped();
	}
	else
	{
		file.load();
	}
	this.addAllMessages(this.getFile());
	return false;
};
oFF.XFileActionLoad.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onFileLoaded(extResult, data, data.getFileContent(), customIdentifier);
};

oFF.XFileActionMkdir = function() {};
oFF.XFileActionMkdir.prototype = new oFF.DXFileAction();
oFF.XFileActionMkdir.prototype._ff_c = "XFileActionMkdir";

oFF.XFileActionMkdir.createAndRun = function(syncType, listener, customIdentifier, fileSystem, file, includeParentDirs)
{
	var object = new oFF.XFileActionMkdir();
	object.m_includeParentDirs = includeParentDirs;
	object.setData(file);
	object.setupActionAndRun(syncType, listener, customIdentifier, fileSystem);
	return object;
};
oFF.XFileActionMkdir.prototype.m_includeParentDirs = false;
oFF.XFileActionMkdir.prototype.processSynchronization = function(syncType)
{
	var file = this.getFile();
	if (this.m_includeParentDirs === true)
	{
		file.mkdirs();
	}
	else
	{
		file.mkdir();
	}
	this.addAllMessages(file);
	return false;
};
oFF.XFileActionMkdir.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onDirectoryCreated(extResult, data, customIdentifier);
};

oFF.XFileActionRename = function() {};
oFF.XFileActionRename.prototype = new oFF.DXFileAction();
oFF.XFileActionRename.prototype._ff_c = "XFileActionRename";

oFF.XFileActionRename.createAndRun = function(syncType, listener, customIdentifier, fileSystem, sourceFile, targetFile)
{
	var object = new oFF.XFileActionRename();
	object.m_targetFile = targetFile;
	object.setData(sourceFile);
	object.setupActionAndRun(syncType, listener, customIdentifier, fileSystem);
	return object;
};
oFF.XFileActionRename.prototype.m_targetFile = null;
oFF.XFileActionRename.prototype.processSynchronization = function(syncType)
{
	var file = this.getFile();
	file.renameTo(this.m_targetFile);
	this.addAllMessages(file);
	return false;
};
oFF.XFileActionRename.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onFileRenamed(extResult, data, customIdentifier);
};

oFF.XFileActionSave = function() {};
oFF.XFileActionSave.prototype = new oFF.DXFileAction();
oFF.XFileActionSave.prototype._ff_c = "XFileActionSave";

oFF.XFileActionSave.createAndRun = function(syncType, listener, customIdentifier, fileSystem, file, content, compression)
{
	var object = new oFF.XFileActionSave();
	object.m_content = content;
	object.m_compression = compression;
	object.setData(file);
	object.setupActionAndRun(syncType, listener, customIdentifier, fileSystem);
	return object;
};
oFF.XFileActionSave.prototype.m_content = null;
oFF.XFileActionSave.prototype.m_compression = null;
oFF.XFileActionSave.prototype.processSynchronization = function(syncType)
{
	var file = this.getFile();
	if (this.m_compression === oFF.CompressionType.GZIP)
	{
		file.saveByteArrayGzipped(this.m_content.getByteArray());
	}
	else
	{
		if (this.m_content.getContentType() === oFF.ContentType.BINARY)
		{
			file.saveByteArray(this.m_content.getByteArray());
		}
		else
		{
			var fileContentBinary = oFF.XByteArray.convertFromString(this.m_content.getString());
			file.saveByteArray(fileContentBinary);
		}
	}
	this.addAllMessages(file);
	return false;
};
oFF.XFileActionSave.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onFileSaved(extResult, data, this.m_content, customIdentifier);
};

oFF.DfXFileBlocking = function() {};
oFF.DfXFileBlocking.prototype = new oFF.DfXFile();
oFF.DfXFileBlocking.prototype._ff_c = "DfXFileBlocking";

oFF.DfXFileBlocking.prototype.processSave = function(syncType, listener, customIdentifier, content, compression)
{
	return oFF.XFileActionSave.createAndRun(syncType, listener, customIdentifier, this.getFileSystem(), this, content, compression);
};
oFF.DfXFileBlocking.prototype.processLoad = function(syncType, listener, customIdentifier, compression)
{
	return oFF.XFileActionLoad.createAndRun(syncType, listener, customIdentifier, this.getFileSystem(), this, compression);
};
oFF.DfXFileBlocking.prototype.processDelete = function(syncType, listener, customIdentifier)
{
	return oFF.XFileActionDelete.createAndRun(syncType, listener, customIdentifier, this.getFileSystem(), this);
};
oFF.DfXFileBlocking.prototype.processRename = function(syncType, listener, customIdentifier, destFile)
{
	return oFF.XFileActionRename.createAndRun(syncType, listener, customIdentifier, this.getFileSystem(), this, destFile);
};
oFF.DfXFileBlocking.prototype.processMkdir = function(syncType, listener, customIdentifier, includeParentDirs)
{
	return oFF.XFileActionMkdir.createAndRun(syncType, listener, customIdentifier, this.getFileSystem(), this, includeParentDirs);
};
oFF.DfXFileBlocking.prototype.processFetchChildren = function(syncType, listener, customIdentifier)
{
	return oFF.XFileActionFetchChildren.createAndRun(syncType, listener, customIdentifier, this.getFileSystem(), this);
};

oFF.DfXFileNonBlocking = function() {};
oFF.DfXFileNonBlocking.prototype = new oFF.DfXFile();
oFF.DfXFileNonBlocking.prototype._ff_c = "DfXFileNonBlocking";

oFF.DfXFileNonBlocking.prototype.saveExt = function(content, compression)
{
	this.processSave(oFF.SyncType.BLOCKING, null, null, content, compression);
};
oFF.DfXFileNonBlocking.prototype.loadExt = function(compression)
{
	var extRes = this.processLoad(oFF.SyncType.BLOCKING, null, null, compression);
	return extRes.getData().getFileContent();
};
oFF.DfXFileNonBlocking.prototype.deleteFile = function()
{
	this.processDelete(oFF.SyncType.BLOCKING, null, null);
};
oFF.DfXFileNonBlocking.prototype.renameTo = function(dest)
{
	var syncAction = this.processRename(oFF.SyncType.BLOCKING, null, null, dest);
	if (syncAction.isValid())
	{
		return syncAction.getData();
	}
	this.addAllMessages(syncAction);
	return this;
};
oFF.DfXFileNonBlocking.prototype.mkdirExt = function(includeParentDirs)
{
	this.processMkdir(oFF.SyncType.BLOCKING, null, null, includeParentDirs);
};
oFF.DfXFileNonBlocking.prototype.getChildren = function()
{
	this.processFetchChildren(oFF.SyncType.BLOCKING, null, null);
	return this.getCachedChildFiles();
};

oFF.HttpCacheClient = function() {};
oFF.HttpCacheClient.prototype = new oFF.DfHttpClient();
oFF.HttpCacheClient.prototype._ff_c = "HttpCacheClient";

oFF.HttpCacheClient.createDynamicCacheClient = function(session, cache, request, cachingMode)
{
	var httpClient = null;
	if (oFF.notNull(cache) && cache.isEnabled())
	{
		httpClient = oFF.HttpCacheClient.create(session, cache, request, cachingMode);
	}
	else
	{
		httpClient = request.newHttpClient(session);
	}
	return httpClient;
};
oFF.HttpCacheClient.create = function(session, cache, request, cachingMode)
{
	var newObj = new oFF.HttpCacheClient();
	newObj.setupHttpClient(session);
	newObj.setRequest(request);
	newObj.m_cache = cache;
	newObj.m_cachingMode = cachingMode;
	return newObj;
};
oFF.HttpCacheClient.prototype.m_innerHttpClient = null;
oFF.HttpCacheClient.prototype.m_cache = null;
oFF.HttpCacheClient.prototype.m_fingerprint = null;
oFF.HttpCacheClient.prototype.m_cachingMode = null;
oFF.HttpCacheClient.prototype.processSynchronization = function(syncType)
{
	var request = this.getRequest();
	this.m_fingerprint = this.generateCacheFingerprint(request);
	var enforceLive = this.m_cachingMode === oFF.HttpCachingMode.L2_DYNAMIC && request.getMethod() === oFF.HttpRequestMethod.HTTP_GET;
	var useCache = enforceLive === false && this.m_cache.isReadEnabled();
	if (useCache)
	{
		this.m_cache.processRead(null, this, request, this.m_fingerprint);
	}
	else
	{
		this.m_innerHttpClient = request.newHttpClient(this.getSession());
		this.m_innerHttpClient.processHttpRequest(syncType, this, null);
	}
	return true;
};
oFF.HttpCacheClient.prototype.onCacheRead = function(extResult, value, customIdentifier)
{
	var request = customIdentifier;
	var response = oFF.HttpResponse.createResponse(request);
	if (oFF.notNull(value))
	{
		response.setJsonObject(value.getJsonContent());
		oFF.HttpUtils.applySessionHandling(request, response);
		this.setData(response);
		this.endSync();
	}
	else
	{
		if (this.m_cachingMode === oFF.HttpCachingMode.L1_INITIAL)
		{
			response.setStatusCode(oFF.HttpStatusCode.SC_UNAUTHORIZED);
			response.setIsGoLiveRequired(true);
			this.setData(response);
			this.endSync();
		}
		else
		{
			this.m_innerHttpClient = request.newHttpClient(this.getSession());
			this.m_innerHttpClient.processHttpRequest(this.getActiveSyncType(), this, null);
		}
	}
};
oFF.HttpCacheClient.prototype.onHttpResponse = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	this.setData(response);
	if (extResult.isValid() && this.m_cache.isWriteEnabled())
	{
		this.log3("Write data into cache with fingerprint: '", this.m_fingerprint, "'");
		this.m_cache.processWrite(null, this, null, this.m_fingerprint, response);
	}
	else
	{
		this.endSync();
	}
};
oFF.HttpCacheClient.prototype.onCacheWrite = function(extResult, content, customIdentifier)
{
	this.endSync();
};
oFF.HttpCacheClient.prototype.generateCacheFingerprint = function(request)
{
	var fingerprint = null;
	var serializedJsonString = null;
	var buffer = oFF.XStringBuffer.create();
	var requestType = request.getRequestType();
	var method = request.getMethod();
	buffer.append(method.getName()).append(":");
	buffer.append(requestType.getName()).append(":");
	if (requestType.isTypeOf(oFF.RpcRequestType.INA) === false)
	{
		buffer.append(request.getPath());
	}
	buffer.append(":");
	if (method === oFF.HttpRequestMethod.HTTP_POST)
	{
		var requestStructure = request.getJsonContent();
		if (oFF.notNull(requestStructure))
		{
			var requestStructureClone = requestStructure.clone();
			this.cleanupRequest(requestStructureClone);
			serializedJsonString = oFF.PrUtils.serialize(requestStructureClone, true, false, 0);
			buffer.append(serializedJsonString);
		}
	}
	var sourceForFingerprint = buffer.toString();
	fingerprint = oFF.XSha1.createSHA1(sourceForFingerprint);
	return fingerprint;
};
oFF.HttpCacheClient.prototype.cleanupRequest = function(requestStructure)
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
		else
		{
			var inaActions = inaCore.getListByKey("Actions");
			if (oFF.notNull(inaActions))
			{
				for (var i = 0; i < inaActions.size(); i++)
				{
					var action = inaActions.getStructureAt(i);
					var type = action.getStringByKey("Type");
					if (oFF.XString.isEqual(type, "Close"))
					{
						action.remove("DataSources");
					}
				}
			}
		}
	}
};

oFF.HttpFileClient = function() {};
oFF.HttpFileClient.prototype = new oFF.DfHttpClient();
oFF.HttpFileClient.prototype._ff_c = "HttpFileClient";

oFF.HttpFileClient.create = function(session)
{
	var newObj = new oFF.HttpFileClient();
	newObj.setupHttpClient(session);
	return newObj;
};
oFF.HttpFileClient.prototype.processSynchronization = function(syncType)
{
	var request = this.getRequest();
	var response = oFF.HttpResponse.createResponse(request);
	this.setData(response);
	var retValue = false;
	if (oFF.notNull(request))
	{
		var file = oFF.XFile.createByUri(this.getSession(), request);
		if (oFF.notNull(file) && file.isFile())
		{
			var compression = oFF.XString.endsWith(file.getUri().getPath(), ".gz") ? oFF.CompressionType.GZIP : oFF.CompressionType.NONE;
			if (syncType === oFF.SyncType.NON_BLOCKING)
			{
				file.processLoad(syncType, this, response, compression);
				retValue = true;
			}
			else
			{
				var syncAction = file.processLoad(syncType, null, response, compression);
				if (syncAction.getData() === null)
				{
					response.setStatusCode(oFF.HttpStatusCode.SC_NOT_FOUND);
				}
				else
				{
					this.onFileLoadedInternal(syncAction, file, syncAction.getData().getFileContent(), response);
				}
			}
		}
		else
		{
			response.setStatusCode(oFF.HttpStatusCode.SC_NOT_FOUND);
		}
	}
	else
	{
		response.setStatusCode(oFF.HttpStatusCode.SC_NOT_FOUND);
	}
	return retValue;
};
oFF.HttpFileClient.prototype.onFileLoaded = function(extResult, file, fileContent, customIdentifier)
{
	this.onFileLoadedInternal(extResult, file, fileContent, customIdentifier);
	this.endSync();
};
oFF.HttpFileClient.prototype.onFileLoadedInternal = function(extResult, file, fileContent, customIdentifier)
{
	var response = customIdentifier;
	if (extResult.isValid())
	{
		response.setFromContent(fileContent);
		response.setStatusCode(oFF.HttpStatusCode.SC_OK);
	}
	else
	{
		response.setStatusCode(oFF.HttpStatusCode.SC_NOT_FOUND);
	}
};

oFF.HttpLocalLoopClient = function() {};
oFF.HttpLocalLoopClient.prototype = new oFF.DfHttpClient();
oFF.HttpLocalLoopClient.prototype._ff_c = "HttpLocalLoopClient";

oFF.HttpLocalLoopClient.create = function(session, serverConfig)
{
	var newObj = new oFF.HttpLocalLoopClient();
	newObj.setupLocalLoop(session, serverConfig);
	return newObj;
};
oFF.HttpLocalLoopClient.prototype.m_serverConfig = null;
oFF.HttpLocalLoopClient.prototype.setupLocalLoop = function(session, serverConfig)
{
	this.setupHttpClient(session);
	this.m_serverConfig = serverConfig;
};
oFF.HttpLocalLoopClient.prototype.releaseObject = function()
{
	this.m_serverConfig = null;
	oFF.DfHttpClient.prototype.releaseObject.call( this );
};
oFF.HttpLocalLoopClient.prototype.processSynchronization = function(syncType)
{
	this.prepareRequest();
	var listener = this.m_serverConfig.getCallback();
	listener.onHttpRequest(this);
	return false;
};
oFF.HttpLocalLoopClient.prototype.getClientRequest = function()
{
	return this.getRequest();
};
oFF.HttpLocalLoopClient.prototype.setResponse = function(serverResponse)
{
	serverResponse.applyCookiesToMasterStorage();
	this.setData(serverResponse);
};
oFF.HttpLocalLoopClient.prototype.newServerResponse = function()
{
	return oFF.HttpResponse.createResponse(this.getClientRequest());
};

oFF.HttpSamlClient = function() {};
oFF.HttpSamlClient.prototype = new oFF.DfHttpClient();
oFF.HttpSamlClient.prototype._ff_c = "HttpSamlClient";

oFF.HttpSamlClient.create = function(session)
{
	var client = new oFF.HttpSamlClient();
	client.setupHttpClient(session);
	return client;
};
oFF.HttpSamlClient.prototype.m_step = 0;
oFF.HttpSamlClient.prototype.m_passwordSent = false;
oFF.HttpSamlClient.prototype.processSynchronization = function(syncType)
{
	this.m_step = 1;
	this.m_passwordSent = false;
	var request = this.getRequest();
	var serviceRequest = oFF.HttpRequest.createByHttpRequest(request);
	serviceRequest.setAuthenticationType(oFF.AuthenticationType.NONE);
	serviceRequest.setAcceptContentType(oFF.ContentType.WILDCARD);
	serviceRequest.setUser(null);
	serviceRequest.setPassword(null);
	serviceRequest.setIsRewritingApplied(true);
	var serviceRequestClient = serviceRequest.newHttpClient(this.getSession());
	serviceRequestClient.processHttpRequest(syncType, this, null);
	return true;
};
oFF.HttpSamlClient.prototype.onHttpResponse = function(extResult, response, customIdentifier)
{
	var samlResponse;
	this.addAllMessages(extResult);
	if (this.hasErrors())
	{
		this.endSync();
	}
	else
	{
		var statusCode = response.getStatusCode();
		var httpContentType = response.getContentType();
		if (statusCode === oFF.HttpStatusCode.SC_OK && (httpContentType === oFF.ContentType.APPLICATION_JSON || httpContentType === oFF.ContentType.APPLICATION_XML))
		{
			this.setData(response);
			this.endSync();
		}
		else
		{
			var session = this.getSession();
			var originSite = response.getHttpRequest();
			if (statusCode === oFF.HttpStatusCode.SC_SEE_OTHER || statusCode === oFF.HttpStatusCode.SC_FOUND)
			{
				var location = response.getLocation();
				if (oFF.notNull(location))
				{
					var locationUri = oFF.XUri.createFromUrlWithParent(location, originSite, false);
					var redirectRequest = oFF.HttpRequest.createByUri(locationUri);
					redirectRequest.setIsRewritingApplied(true);
					redirectRequest.setAcceptContentType(oFF.ContentType.WILDCARD);
					redirectRequest.setMethod(oFF.HttpRequestMethod.HTTP_GET);
					var cookiesMasterStore = this.getRequest().getCookiesMasterStore();
					redirectRequest.setCookiesMasterStore(cookiesMasterStore);
					this.m_step = this.m_step + 1;
					var httpClient = redirectRequest.newHttpClient(session);
					httpClient.processHttpRequest(this.getActiveSyncType(), this, null);
				}
				else
				{
					samlResponse = oFF.HttpResponse.createResponse(this.getRequest());
					samlResponse.setStatusCode(oFF.HttpStatusCode.SC_NOT_ACCEPTABLE);
					samlResponse.setStatusCodeDetails("SAML Response does not contain redirect location");
					this.addError(0, "SAML Response does not contain redirect location");
					this.setData(samlResponse);
					this.endSync();
				}
			}
			else
			{
				var stopProcessing = false;
				if (statusCode === oFF.HttpStatusCode.SC_UNAUTHORIZED)
				{
					var authenticate = response.getHeaderFields().getStringByKey(oFF.HttpConstants.HD_WWW_AUTHENTICATE);
					if (oFF.XStringUtils.isNotNullAndNotEmpty(authenticate))
					{
						if (oFF.XString.startsWith(authenticate, oFF.HttpConstants.VA_AUTHORIZATION_BASIC))
						{
							this.setData(response);
							this.endSync();
							stopProcessing = true;
						}
					}
				}
				if (stopProcessing === false)
				{
					var contentType = response.getContentType();
					if (contentType.isTypeOf(oFF.ContentType.TEXT_OR_HTML))
					{
						var html = response.getString();
						var identityProviderForm = oFF.HtmlForm.create(originSite, html);
						var identityProviderScript = oFF.SamlRedirectScript.create(originSite, html);
						if (identityProviderForm.isValid())
						{
							if (identityProviderForm.getParameterValue("j_username") !== null)
							{
								if (this.m_passwordSent && identityProviderForm.getParameterValue("SAMLResponse") === null)
								{
									this.addError(0, "Failed to login: Bad Username or password");
									samlResponse = oFF.HttpResponse.createResponse(this.getRequest());
									samlResponse.setStatusCode(oFF.HttpStatusCode.SC_UNAUTHORIZED);
									samlResponse.setStatusCodeDetails("Failed to login: Bad Username or password");
									this.setData(samlResponse);
									stopProcessing = true;
								}
								else
								{
									this.m_passwordSent = true;
									var masterRequest = this.getRequest();
									identityProviderForm.set("j_username", masterRequest.getUser());
									identityProviderForm.set("j_password", masterRequest.getPassword());
								}
							}
							if (stopProcessing)
							{
								this.endSync();
							}
							else
							{
								this.postForm(session, identityProviderForm, false);
							}
						}
						else if (identityProviderScript.isValid())
						{
							var locUri = identityProviderScript.getTarget();
							var cookMasterStore = this.getRequest().getCookiesMasterStore();
							if (identityProviderScript.getSignature() !== null)
							{
								var cookies = oFF.HttpCookies.create();
								var cookie = oFF.HttpCookie.createCookie("signature", identityProviderScript.getSignature());
								cookie.setPath("/");
								cookies.addCookie(cookie);
								cookie = oFF.HttpCookie.createCookie("fragmentAfterLogin", this.getRequest().getFragment());
								cookie.setPath("/");
								cookies.addCookie(cookie);
								cookie = oFF.HttpCookie.createCookie("locationAfterLogin", oFF.XHttpUtils.encodeURIComponent(this.getRequest().getUrlStringExt(false, false, false, false, false, true, true, false)));
								cookie.setPath("/");
								cookies.addCookie(cookie);
								cookMasterStore.applyCookies(this.getRequest().getHost(), this.getRequest().getPath(), cookies);
							}
							var scriptRedirectRequest = oFF.HttpRequest.createByUri(locUri);
							scriptRedirectRequest.setIsRewritingApplied(true);
							scriptRedirectRequest.setAcceptContentType(oFF.ContentType.WILDCARD);
							scriptRedirectRequest.setMethod(oFF.HttpRequestMethod.HTTP_GET);
							scriptRedirectRequest.setCookiesMasterStore(cookMasterStore);
							this.m_step = this.m_step + 1;
							scriptRedirectRequest.newHttpClient(session).processHttpRequest(this.getActiveSyncType(), this, null);
						}
						else
						{
							this.setData(response);
							this.endSync();
						}
					}
				}
			}
		}
	}
};
oFF.HttpSamlClient.prototype.postForm = function(session, form, useCertificates)
{
	this.m_step = this.m_step + 1;
	var uri = form.getTarget();
	var request = oFF.HttpRequest.createByUri(uri);
	request.setAcceptContentType(oFF.ContentType.WILDCARD);
	if (useCertificates)
	{
		request.setAuthenticationType(oFF.AuthenticationType.CERTIFICATES);
	}
	else
	{
		request.setAuthenticationType(oFF.AuthenticationType.NONE);
	}
	request.setMethod(oFF.HttpRequestMethod.HTTP_POST);
	var masteruri = form.getOriginSite();
	var referer = masteruri.getUrl();
	request.setReferer(referer);
	var originUri = oFF.XUri.createFromOther(masteruri);
	originUri.setFragment(null);
	originUri.setPath(null);
	originUri.setQuery(null);
	originUri.setAuthenticationType(oFF.AuthenticationType.NONE);
	var origin = originUri.getUrl();
	request.setOrigin(origin);
	var cookiesMasterStore = this.getRequest().getCookiesMasterStore();
	request.setCookiesMasterStore(cookiesMasterStore);
	var buffer = oFF.XStringBuffer.create();
	var names = form.getNames();
	var hasValue = false;
	while (names.hasNext())
	{
		var name = names.next();
		var type = form.getParameterType(name);
		if (!oFF.XString.isEqual(type, "submit"))
		{
			if (hasValue)
			{
				buffer.append("&");
			}
			hasValue = true;
			buffer.append(name).append("=");
			var value = form.getParameterValue(name);
			var valueEnc = oFF.XHttpUtils.encodeURIComponent(value);
			buffer.append(valueEnc);
		}
	}
	var content = buffer.toString();
	request.setString(content);
	request.setContentType(oFF.ContentType.APPLICATION_FORM);
	var httpClient = request.newHttpClient(session);
	return httpClient.processHttpRequest(this.getActiveSyncType(), this, null);
};

oFF.XFileClassic = function() {};
oFF.XFileClassic.prototype = new oFF.DfXFileBlocking();
oFF.XFileClassic.prototype._ff_c = "XFileClassic";

oFF.XFileClassic.createExt = function(session, fileSystem, vfsUri, targetUri)
{
	var file = new oFF.XFileClassic();
	file.setupFile(session, fileSystem, vfsUri, targetUri);
	return file;
};
oFF.XFileClassic.prototype.m_nativePath = null;
oFF.XFileClassic.prototype.setupFile = function(session, fs, vfsUri, targetUri)
{
	oFF.DfXFileBlocking.prototype.setupFile.call( this , session, fs, vfsUri, targetUri);
	this.m_nativePath = fs.convertToNativeFilePath(targetUri);
	this.writeDebugMessage("set up");
};
oFF.XFileClassic.prototype.getFileType = function()
{
	return this.m_fs.getFileType(this);
};
oFF.XFileClassic.prototype.isDirectory = function()
{
	var result = this.m_fs.isDirectoryExt(this);
	if (result)
	{
		this.writeDebugMessage("is directory");
	}
	return result;
};
oFF.XFileClassic.prototype.isFile = function()
{
	var result = this.m_fs.isFileExt(this);
	if (result)
	{
		this.writeDebugMessage("is file");
	}
	return result;
};
oFF.XFileClassic.prototype.isExisting = function()
{
	var result = this.m_fs.isExistingExt(this);
	if (result)
	{
		this.writeDebugMessage("is existing");
	}
	return result;
};
oFF.XFileClassic.prototype.isHidden = function()
{
	var result = this.m_fs.isHiddenExt(this);
	if (result)
	{
		this.writeDebugMessage("is hidden");
	}
	return result;
};
oFF.XFileClassic.prototype.supportsSetLastModified = function()
{
	this.writeDebugMessage("supports set last modified");
	return true;
};
oFF.XFileClassic.prototype.isWriteable = function()
{
	var result = this.m_fs.isWriteableExt(this);
	if (result)
	{
		this.writeDebugMessage("is writeable");
	}
	return result;
};
oFF.XFileClassic.prototype.setWritable = function(writable, ownerOnly)
{
	if (oFF.XFile.DEBUG_MODE)
	{
		var sb = oFF.XStringBuffer.create();
		sb.append("set writeable ").appendBoolean(writable);
		if (ownerOnly)
		{
			sb.append(" owner only");
		}
		this.writeDebugMessage(sb.toString());
	}
	this.handleErrorMessages(this.m_fs.setWritableExt(this, writable, ownerOnly));
};
oFF.XFileClassic.prototype.isReadable = function()
{
	var result = this.m_fs.isReadableExt(this);
	if (result)
	{
		this.writeDebugMessage("is readable");
	}
	return result;
};
oFF.XFileClassic.prototype.isExecutable = function()
{
	var result = this.m_fs.isExecutableExt(this);
	if (result)
	{
		this.writeDebugMessage("is executable");
	}
	return result;
};
oFF.XFileClassic.prototype.supportsRenameTo = function()
{
	this.writeDebugMessage("supports rename to");
	return true;
};
oFF.XFileClassic.prototype.handleErrorMessages = function(messages)
{
	this.clearMessages();
	this.addAllMessages(messages);
	if (oFF.XFile.DEBUG_MODE && this.hasErrors())
	{
		this.log(this.getSummary());
	}
};
oFF.XFileClassic.prototype.getLastModifiedTimestamp = function()
{
	var result = this.m_fs.getLastModifiedTimestampExt(this);
	this.writeDebugMessage(oFF.XStringUtils.concatenate2("get last modified timestamp ", oFF.XLong.convertToString(result)));
	return result;
};
oFF.XFileClassic.prototype.getNativePath = function()
{
	return this.m_nativePath;
};
oFF.XFileClassic.prototype.saveExt = function(content, compression)
{
	this.m_fs.saveExt(this, content, compression);
};
oFF.XFileClassic.prototype.loadExt = function(compression)
{
	this.m_fs.loadExt2(this, compression);
	return this.getFileContent();
};
oFF.XFileClassic.prototype.processExecute = function(syncType, listener, customIdentifier)
{
	return this.m_fs.processExecute(syncType, listener, customIdentifier, this);
};
oFF.XFileClassic.prototype.deleteFile = function()
{
	this.m_fs.deleteFileExt(this);
};
oFF.XFileClassic.prototype.renameTo = function(dest)
{
	if (oFF.isNull(dest))
	{
		this.writeDebugMessage("Destination was null");
	}
	else
	{
		this.writeDebugMessage(oFF.XStringUtils.concatenate2("rename to ", dest.getNativePath()));
		this.m_fs.renameToExt(this, dest);
	}
	return dest;
};
oFF.XFileClassic.prototype.mkdirExt = function(includeParentDirs)
{
	this.m_fs.mkdirExt(this, includeParentDirs);
};
oFF.XFileClassic.prototype.getChildren = function()
{
	this.setChildNames(this.m_fs.getChildrenExt(this));
	return this.getCachedChildFiles();
};

oFF.IoModule = function() {};
oFF.IoModule.prototype = new oFF.DfModule();
oFF.IoModule.prototype._ff_c = "IoModule";

oFF.IoModule.s_module = null;
oFF.IoModule.getInstance = function()
{
	if (oFF.isNull(oFF.IoModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.StructuresNativeModule.getInstance());
		oFF.IoModule.s_module = oFF.DfModule.startExt(new oFF.IoModule());
		oFF.WorkingTaskManagerType.staticSetup();
		oFF.SyncType.staticSetup();
		oFF.SyncState.staticSetup();
		oFF.Dispatcher.staticSetup();
		oFF.WorkingTaskManager.staticSetup();
		oFF.ListenerType.staticSetup();
		oFF.SystemType.staticSetup();
		oFF.IoComponentType.staticSetupIoType();
		oFF.ChildSetState.staticSetup();
		oFF.HttpClientFactory.staticSetupClientFactory();
		oFF.ContentType.staticSetup();
		oFF.AuthenticationType.staticSetup();
		oFF.ProtocolType.staticSetup();
		oFF.HttpConstants.staticSetup();
		oFF.HttpRequestMethod.staticSetup();
		oFF.HttpCachingMode.staticSetup();
		oFF.RpcFunctionFactory.staticSetupFunctionFactory();
		oFF.HttpFileFactory.staticSetup();
		oFF.HttpSamlClientFactory.staticSetupSamlFactory();
		oFF.NetworkEnv.staticSetup();
		oFF.PathFormat.staticSetup();
		oFF.CompressionType.staticSetup();
		oFF.RpcRequestType.staticSetup();
		oFF.XFileSystemFactory.staticSetupFactory();
		oFF.ProxyType.staticSetup();
		oFF.XFileSystemType.staticSetup();
		oFF.XFileType.staticSetup();
		oFF.FeatureToggleOlap.staticSetup();
		oFF.XCacheProviderBasicFactory.staticSetup();
		oFF.SessionCarrierType.staticSetup();
		oFF.SqlResultSetType.staticSetup();
		oFF.DfModule.stopExt(oFF.IoModule.s_module);
	}
	return oFF.IoModule.s_module;
};
oFF.IoModule.prototype.getName = function()
{
	return "ff0200.io";
};

oFF.IoModule.getInstance();

return sap.firefly;
	} );