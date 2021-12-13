/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
[
"sap/zen/dsh/firefly/ff0005.language.ext","sap/zen/dsh/firefly/ff2100.runtime"
],
function(oFF)
{
"use strict";

oFF.RpcSqlInaUtil = {

	QY_MESSAGES:"Messages",
	QY_MESSAGE_CLASS:"MessageClass",
	QY_NUMBER:"Number",
	QY_TYPE:"Type",
	QY_TEXT:"Text",
	VA_SEVERITY_ERROR:2,
	createErrorResponse:function(errors)
	{
			var response = oFF.PrFactory.createStructure();
		var messages = response.putNewList(oFF.RpcSqlInaUtil.QY_MESSAGES);
		var size = errors.size();
		for (var i = 0; i < size; i++)
		{
			var error = errors.get(i);
			var message = messages.addNewStructure();
			message.putString(oFF.RpcSqlInaUtil.QY_TEXT, error.getText());
			message.putInteger(oFF.RpcSqlInaUtil.QY_TYPE, oFF.RpcSqlInaUtil.VA_SEVERITY_ERROR);
			message.putInteger(oFF.RpcSqlInaUtil.QY_NUMBER, error.getCode());
			message.putString(oFF.RpcSqlInaUtil.QY_MESSAGE_CLASS, "RpcSql");
		}
		return response;
	},
	getErrors:function(data)
	{
			var errors = oFF.XList.create();
		if (oFF.notNull(data) && data.isStructure())
		{
			var rawMessages = data.asStructure().getByKey(oFF.RpcSqlInaUtil.QY_MESSAGES);
			if (oFF.notNull(rawMessages) && rawMessages.isList())
			{
				var messages = rawMessages.asList();
				for (var i = 0, size = messages.size(); i < size; i++)
				{
					if (messages.getStructureAt(i).getIntegerByKey(oFF.RpcSqlInaUtil.QY_TYPE) === oFF.RpcSqlInaUtil.VA_SEVERITY_ERROR)
					{
						errors.add(oFF.XMessage.createError("RpcSql", messages.getStructureAt(i).getStringByKey(oFF.RpcSqlInaUtil.QY_TEXT), null, false, null));
					}
				}
			}
		}
		return errors;
	}
};

oFF.RpcSqlDriverFactory = function() {};
oFF.RpcSqlDriverFactory.prototype = new oFF.SqlDriverFactory();
oFF.RpcSqlDriverFactory.prototype._ff_c = "RpcSqlDriverFactory";

oFF.RpcSqlDriverFactory.staticSetup = function()
{
	oFF.SqlDriverFactory.registerFactory(new oFF.RpcSqlDriverFactory());
};
oFF.RpcSqlDriverFactory.prototype.newSqlDriver = oFF.noSupport;

oFF.RpcSqlProxy = function() {};
oFF.RpcSqlProxy.prototype = new oFF.XObject();
oFF.RpcSqlProxy.prototype._ff_c = "RpcSqlProxy";

oFF.RpcSqlProxy.prototype.m_connectionstring = null;
oFF.RpcSqlProxy.prototype.m_drivername = null;
oFF.RpcSqlProxy.prototype.m_username = null;
oFF.RpcSqlProxy.prototype.m_password = null;
oFF.RpcSqlProxy.prototype.convert = function(set)
{
	var meta = set.getMetaData();
	var rstruct = oFF.PrFactory.createStructure();
	var columns = rstruct.putNewList("columns");
	for (var i = 0; i < meta.size(); i++)
	{
		columns.add(oFF.PrFactory.createString(meta.get(i)));
	}
	var values = rstruct.putNewList("values");
	while (set.next())
	{
		var row = values.addNewList();
		for (var j = 0; j < meta.size(); j++)
		{
			var type = meta.getType(j);
			if (type === oFF.SqlResultSetType.DOUBLE)
			{
				row.add(oFF.PrFactory.createDouble(set.getDoubleAt(j)));
				continue;
			}
			if (type === oFF.SqlResultSetType.LONG)
			{
				row.add(oFF.PrFactory.createLong(set.getLongAtExt(j, -1)));
				continue;
			}
			if (type === oFF.SqlResultSetType.INTEGER)
			{
				row.add(oFF.PrFactory.createInteger(set.getIntegerAtExt(j, -1)));
				continue;
			}
			if (type === oFF.SqlResultSetType.BOOLEAN)
			{
				row.add(oFF.PrFactory.createBoolean(set.getBooleanAtExt(j, true)));
				continue;
			}
			if (type === oFF.SqlResultSetType.STRING)
			{
				row.add(oFF.PrFactory.createString(set.getStringAtExt(j, null)));
				continue;
			}
			row.addNull();
		}
	}
	return rstruct;
};
oFF.RpcSqlProxy.prototype.getDataBaseProvider = function()
{
	var driver = oFF.SqlDriverFactory.create(this.m_drivername);
	driver.processOpenExt(oFF.SyncType.BLOCKING, null, null, this.m_connectionstring, this.m_username, this.m_password);
	return driver;
};
oFF.RpcSqlProxy.prototype.onHttpRequest = function(serverRequestResponse)
{
	var req = serverRequestResponse.getClientRequest().getJsonContent();
	var serverPath = serverRequestResponse.getClientRequest().getRelativePath();
	var newServerResponse = serverRequestResponse.newServerResponse();
	newServerResponse.setContentType(oFF.ContentType.APPLICATION_JSON);
	if (oFF.XString.isEqual(serverPath, "/sap/sql/ina/GetServerInfo"))
	{
		var root = oFF.PrFactory.createStructure();
		var serverInfo = root.putNewStructure("ServerInfo");
		serverInfo.putString("SystemId", "SQLJSON");
		serverInfo.putString("DataBaseManagementSystem", "Generic Sql");
		var services = root.putNewList("Services");
		var s = services.addNewStructure();
		var capabilities = s.putNewList("Capabilities");
		var cap = capabilities.addNewStructure();
		cap.putString("Capability", "BasicSql");
		cap.putString("Description", "A simple sql protocol");
		cap = capabilities.addNewStructure();
		cap.putString("Capability", "BasicSqlMetaData");
		cap.putString("Description", "Metadata for Sql Database");
		s.putString("Service", "Analytics");
		root.putNewStructure("Settings");
		newServerResponse.setString(root.toString());
		serverRequestResponse.setResponse(newServerResponse);
		return;
	}
	else if (oFF.XString.isEqual(serverPath, "/BasicSql"))
	{
		if (oFF.isNull(req) || !req.isStructure())
		{
			var c = oFF.MessageManagerSimple.createMessageManager();
			c.addError(1, "Expected a json object!");
			this.respondWithInaError(serverRequestResponse, newServerResponse, c.getErrors());
			return;
		}
		var sql = req.asStructure().getStringByKey("sql");
		var type = req.asStructure().getStringByKey("type");
		var driver = this.getDataBaseProvider();
		if (oFF.XString.isEqual(type, "update"))
		{
			driver.processExecuteUpdate(oFF.SyncType.BLOCKING, null, null, sql);
			if (driver.hasErrors())
			{
				this.respondWithInaError(serverRequestResponse, newServerResponse, driver.getErrors());
			}
			else
			{
				newServerResponse.setStatusCode(201);
				serverRequestResponse.setResponse(newServerResponse);
			}
		}
		else if (oFF.XString.isEqual(type, "query"))
		{
			var res = driver.processExecuteQuery(oFF.SyncType.BLOCKING, null, null, sql);
			if (driver.hasErrors())
			{
				this.respondWithInaError(serverRequestResponse, newServerResponse, driver.getErrors());
			}
			else
			{
				var el = this.convert(res.getData());
				newServerResponse.setStatusCode(200);
				newServerResponse.setString(el.toString());
				serverRequestResponse.setResponse(newServerResponse);
			}
		}
		else
		{
			var c2 = oFF.MessageManagerSimple.createMessageManager();
			c2.addError(1, oFF.XStringUtils.concatenate2("Unexpected query type: ", type));
			this.respondWithInaError(serverRequestResponse, newServerResponse, c2.getErrors());
		}
		driver.close();
	}
	else if (oFF.XString.isEqual(serverPath, "/GetSchemas"))
	{
		this.getSchemas(req.asStructure(), serverRequestResponse, newServerResponse);
	}
	else if (oFF.XString.isEqual(serverPath, "/GetTables"))
	{
		this.getTables(req.asStructure(), serverRequestResponse, newServerResponse);
	}
	else if (oFF.XString.isEqual(serverPath, "/GetColumns"))
	{
		this.getColumns(req.asStructure(), serverRequestResponse, newServerResponse);
	}
	else if (oFF.XString.isEqual(serverPath, "/GetImportedKeys"))
	{
		this.getImportedKeys(req.asStructure(), serverRequestResponse, newServerResponse);
	}
	else
	{
		newServerResponse.setStatusCode(404);
		serverRequestResponse.setResponse(newServerResponse);
	}
};
oFF.RpcSqlProxy.prototype.getSchemas = function(root, serverRequestResponse, newServerResponse)
{
	var driver = this.getDataBaseProvider();
	var tableRes = driver.processGetSchemas(oFF.SyncType.BLOCKING, null, null);
	if (driver.hasErrors())
	{
		this.respondWithInaError(serverRequestResponse, newServerResponse, driver.getErrors());
	}
	else
	{
		newServerResponse.setStatusCode(200);
		newServerResponse.setString(this.convert(tableRes.getData()).toString());
		serverRequestResponse.setResponse(newServerResponse);
	}
	driver.close();
};
oFF.RpcSqlProxy.prototype.getTables = function(root, serverRequestResponse, newServerResponse)
{
	var driver = this.getDataBaseProvider();
	var catalog = root.getStringByKey("catalog");
	var schemaNamePattern = root.getStringByKey("schemaNamePattern");
	var tableNamePattern = root.getStringByKey("tableNamePattern");
	var tableRes = driver.processGetTables(oFF.SyncType.BLOCKING, null, null, catalog, schemaNamePattern, tableNamePattern);
	if (driver.hasErrors())
	{
		this.respondWithInaError(serverRequestResponse, newServerResponse, driver.getErrors());
	}
	else
	{
		newServerResponse.setStatusCode(200);
		newServerResponse.setString(this.convert(tableRes.getData()).toString());
		serverRequestResponse.setResponse(newServerResponse);
	}
	driver.close();
};
oFF.RpcSqlProxy.prototype.getColumns = function(root, serverRequestResponse, newServerResponse)
{
	var driver = this.getDataBaseProvider();
	var catalog = root.getStringByKey("catalog");
	var schemaNamePattern = root.getStringByKey("schemaNamePattern");
	var tableNamePattern = root.getStringByKey("tableNamePattern");
	var columnNamePattern = root.getStringByKey("columnNamePattern");
	var tableRes = driver.processGetColumns(oFF.SyncType.BLOCKING, null, null, catalog, schemaNamePattern, tableNamePattern, columnNamePattern);
	if (driver.hasErrors())
	{
		this.respondWithInaError(serverRequestResponse, newServerResponse, driver.getErrors());
	}
	else
	{
		newServerResponse.setStatusCode(200);
		newServerResponse.setString(this.convert(tableRes.getData()).toString());
		serverRequestResponse.setResponse(newServerResponse);
	}
	driver.close();
};
oFF.RpcSqlProxy.prototype.getImportedKeys = function(root, serverRequestResponse, newServerResponse)
{
	var driver = this.getDataBaseProvider();
	var catalog = root.getStringByKey("catalog");
	var schema = root.getStringByKey("schema");
	var table = root.getStringByKey("table");
	var tableRes = driver.processGetImportedKeys(oFF.SyncType.BLOCKING, null, null, catalog, schema, table);
	if (driver.hasErrors())
	{
		this.respondWithInaError(serverRequestResponse, newServerResponse, driver.getErrors());
	}
	else
	{
		newServerResponse.setStatusCode(200);
		newServerResponse.setString(this.convert(tableRes.getData()).toString());
		serverRequestResponse.setResponse(newServerResponse);
	}
	driver.close();
};
oFF.RpcSqlProxy.prototype.respondWithInaError = function(serverRequestResponse, newServerResponse, errors)
{
	var c = oFF.MessageManagerSimple.createMessageManager();
	c.setServerStatusCode(404);
	newServerResponse.setString(oFF.RpcSqlInaUtil.createErrorResponse(errors).toString());
	newServerResponse.setStatusCode(200);
	serverRequestResponse.setResponse(newServerResponse);
};
oFF.RpcSqlProxy.prototype.initServerContainer = function(environment)
{
	this.m_drivername = environment.getByKey("drivername");
	this.m_connectionstring = environment.getByKey("connectionstring");
	this.m_username = environment.getByKey("username");
	this.m_password = environment.getByKey("password");
};

oFF.RpcSqlDriver = function() {};
oFF.RpcSqlDriver.prototype = new oFF.MessageManager();
oFF.RpcSqlDriver.prototype._ff_c = "RpcSqlDriver";

oFF.RpcSqlDriver.create = function(driverName, application, systemAlias)
{
	var newObj = new oFF.RpcSqlDriver();
	newObj.setupDriver(application, systemAlias);
	return newObj;
};
oFF.RpcSqlDriver.prototype.m_connectionUri = null;
oFF.RpcSqlDriver.prototype.m_connection = null;
oFF.RpcSqlDriver.prototype.m_application = null;
oFF.RpcSqlDriver.prototype.m_systemAlias = null;
oFF.RpcSqlDriver.prototype.setupDriver = function(application, systemAlias)
{
	this.m_application = application;
	this.m_systemAlias = systemAlias;
	this.setupSessionContext(null);
};
oFF.RpcSqlDriver.prototype.open = function(uri)
{
	this.m_connection = this.m_application.getConnectionPool().getConnection(this.m_systemAlias);
	var serverMetadata = this.m_connection.getServerMetadata();
	if (oFF.isNull(serverMetadata))
	{
		this.addError(9, "Failed to connect to server, missing Server Metadata");
		return;
	}
	if (!serverMetadata.supportsAnalyticCapability("BasicSql"))
	{
		this.addError(10, "Server doesn't support BasicSql");
		return;
	}
};
oFF.RpcSqlDriver.prototype.openExt = function(url, user, pwd)
{
	this.open(oFF.XUri.createFromUrl(url));
};
oFF.RpcSqlDriver.prototype.close = function() {};
oFF.RpcSqlDriver.prototype.executeUpdate = function(sql)
{
	var st = oFF.PrFactory.createStructure();
	st.putString("type", "update");
	st.putString("sql", sql);
	var rpc = this.m_connection.newRpcFunction("/BasicSql");
	rpc.getRpcRequest().setMethod(oFF.HttpRequestMethod.HTTP_POST);
	rpc.getRpcRequest().setRequestStructure(st);
	rpc.processFunctionExecution(oFF.SyncType.BLOCKING, null, null);
	this.addAllMessages(rpc);
	return 0;
};
oFF.RpcSqlDriver.prototype.processExecuteUpdate = function(syncType, listener, customIdentifier, sql)
{
	return oFF.RpcSqlUpdateAction.createAndRun(this, this.m_connection, syncType, listener, customIdentifier, this.getSession(), sql);
};
oFF.RpcSqlDriver.prototype.executeQuery = function(sql)
{
	var st = oFF.PrFactory.createStructure();
	st.putString("type", "query");
	st.putString("sql", sql);
	var rpc = this.m_connection.newRpcFunction("/BasicSql");
	rpc.getRpcRequest().setMethod(oFF.HttpRequestMethod.HTTP_POST);
	rpc.getRpcRequest().setRequestStructure(st);
	rpc.processFunctionExecution(oFF.SyncType.BLOCKING, null, null);
	this.addAllMessages(rpc);
	var rlist = oFF.PrFactory.createList();
	rlist.add(rpc.getRpcResponse().getRootElement());
	return oFF.SqlJsonResultSet.create(rlist);
};
oFF.RpcSqlDriver.prototype.processExecuteQuery = function(syncType, listener, customIdentifier, sql)
{
	return oFF.RpcSqlQueryAction.createAndRun(this, this.m_connection, syncType, listener, customIdentifier, this.getSession(), sql);
};
oFF.RpcSqlDriver.prototype.getConnection = function()
{
	return this.m_connectionUri;
};
oFF.RpcSqlDriver.prototype.processOpen = function(syncType, listener, customIdentifier, uri)
{
	this.open(uri);
	return oFF.RpcSqlOpenAction.createAndRun(this, syncType, listener, customIdentifier, this.getSession());
};
oFF.RpcSqlDriver.prototype.processOpenExt = function(syncType, listener, customIdentifier, url, user, pwd)
{
	this.openExt(url, user, pwd);
	return oFF.RpcSqlOpenAction.createAndRun(this, syncType, listener, customIdentifier, this.getSession());
};
oFF.RpcSqlDriver.prototype.processGetSchemas = function(syncType, listener, customIdentifier)
{
	var serverMetadata = this.m_connection.getServerMetadata();
	if (oFF.isNull(serverMetadata))
	{
		this.addError(9, "Failed to connect to server, missing Server Metadata");
		return oFF.SqlSynchroniousQueryAction.createAndRun(null, syncType, listener, customIdentifier, this.getSession());
	}
	if (!serverMetadata.supportsAnalyticCapability("BasicSqlMetaData"))
	{
		this.addError(10, "Server doesn't support BasicSqlMetaData");
		return oFF.SqlSynchroniousQueryAction.createAndRun(null, syncType, listener, customIdentifier, this.getSession());
	}
	return oFF.RpcSqlQueryAction.createAndRunSpecial(this, this.m_connection, syncType, listener, customIdentifier, this.getSession(), "/GetSchemas", oFF.PrFactory.createStructure());
};
oFF.RpcSqlDriver.prototype.processGetTables = function(syncType, listener, customIdentifier, catalog, schemaNamePattern, tableNamePattern)
{
	var serverMetadata = this.m_connection.getServerMetadata();
	if (oFF.isNull(serverMetadata))
	{
		this.addError(9, "Failed to connect to server, missing Server Metadata");
		return oFF.SqlSynchroniousQueryAction.createAndRun(null, syncType, listener, customIdentifier, this.getSession());
	}
	if (!serverMetadata.supportsAnalyticCapability("BasicSqlMetaData"))
	{
		this.addError(10, "Server doesn't support BasicSqlMetaData");
		return oFF.SqlSynchroniousQueryAction.createAndRun(null, syncType, listener, customIdentifier, this.getSession());
	}
	var st = oFF.PrFactory.createStructure();
	st.putString("catalog", catalog);
	st.putString("schemaNamePattern", schemaNamePattern);
	st.putString("tableNamePattern", tableNamePattern);
	return oFF.RpcSqlQueryAction.createAndRunSpecial(this, this.m_connection, syncType, listener, customIdentifier, this.getSession(), "/GetTables", st);
};
oFF.RpcSqlDriver.prototype.processGetColumns = function(syncType, listener, customIdentifier, catalog, schemaNamePattern, tableNamePattern, columnNamePattern)
{
	var serverMetadata = this.m_connection.getServerMetadata();
	if (oFF.isNull(serverMetadata))
	{
		this.addError(9, "Failed to connect to server, missing Server Metadata");
		return oFF.SqlSynchroniousQueryAction.createAndRun(null, syncType, listener, customIdentifier, this.getSession());
	}
	if (!serverMetadata.supportsAnalyticCapability("BasicSqlMetaData"))
	{
		this.addError(10, "Server doesn't support BasicSqlMetaData");
		return oFF.SqlSynchroniousQueryAction.createAndRun(null, syncType, listener, customIdentifier, this.getSession());
	}
	var st = oFF.PrFactory.createStructure();
	st.putString("catalog", catalog);
	st.putString("schemaNamePattern", schemaNamePattern);
	st.putString("tableNamePattern", tableNamePattern);
	st.putString("columnNamePattern", columnNamePattern);
	return oFF.RpcSqlQueryAction.createAndRunSpecial(this, this.m_connection, syncType, listener, customIdentifier, this.getSession(), "/GetColumns", st);
};
oFF.RpcSqlDriver.prototype.processGetImportedKeys = function(syncType, listener, customIdentifier, catalog, schema, table)
{
	var serverMetadata = this.m_connection.getServerMetadata();
	if (oFF.isNull(serverMetadata))
	{
		this.addError(9, "Failed to connect to server, missing Server Metadata");
		return oFF.SqlSynchroniousQueryAction.createAndRun(null, syncType, listener, customIdentifier, this.getSession());
	}
	if (!serverMetadata.supportsAnalyticCapability("BasicSqlMetaData"))
	{
		this.addError(10, "Server doesn't support BasicSqlMetaData");
		return oFF.SqlSynchroniousQueryAction.createAndRun(null, syncType, listener, customIdentifier, this.getSession());
	}
	var st = oFF.PrFactory.createStructure();
	st.putString("catalog", catalog);
	st.putString("schema", schema);
	st.putString("table", table);
	return oFF.RpcSqlQueryAction.createAndRunSpecial(this, this.m_connection, syncType, listener, customIdentifier, this.getSession(), "/GetImportedKeys", st);
};

oFF.RpcSqlOpenAction = function() {};
oFF.RpcSqlOpenAction.prototype = new oFF.SyncAction();
oFF.RpcSqlOpenAction.prototype._ff_c = "RpcSqlOpenAction";

oFF.RpcSqlOpenAction.createAndRun = function(driver, syncType, listener, customIdentifier, context)
{
	var obj = new oFF.RpcSqlOpenAction();
	obj.m_driver = driver;
	obj.setupActionAndRun(syncType, listener, customIdentifier, context);
	return obj;
};
oFF.RpcSqlOpenAction.prototype.m_driver = null;
oFF.RpcSqlOpenAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onOpened(extResult, data, customIdentifier);
};
oFF.RpcSqlOpenAction.prototype.processSynchronization = function(syncType)
{
	this.setData(this.m_driver);
	return false;
};

oFF.RpcSqlQuery = function() {};
oFF.RpcSqlQuery.prototype = new oFF.SyncAction();
oFF.RpcSqlQuery.prototype._ff_c = "RpcSqlQuery";

oFF.RpcSqlQuery.createAndRun = function(driver, syncType, listener, customIdentifier, context)
{
	var obj = new oFF.RpcSqlQuery();
	obj.m_driver = driver;
	obj.setupActionAndRun(syncType, listener, customIdentifier, context);
	return obj;
};
oFF.RpcSqlQuery.prototype.m_driver = null;
oFF.RpcSqlQuery.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onQueryResult(extResult, data, customIdentifier);
};
oFF.RpcSqlQuery.prototype.processSynchronization = function(syncType)
{
	this.m_driver.addInfo(0, "");
	this.setData(null);
	return false;
};

oFF.RpcSqlQueryAction = function() {};
oFF.RpcSqlQueryAction.prototype = new oFF.SyncAction();
oFF.RpcSqlQueryAction.prototype._ff_c = "RpcSqlQueryAction";

oFF.RpcSqlQueryAction.createAndRun = function(driver, con, syncType, listener, customIdentifier, context, sql)
{
	var st = oFF.PrFactory.createStructure();
	st.putString("type", "query");
	st.putString("sql", sql);
	return oFF.RpcSqlQueryAction.createAndRunSpecial(driver, con, syncType, listener, customIdentifier, context, "/BasicSql", st);
};
oFF.RpcSqlQueryAction.createAndRunSpecial = function(driver, con, syncType, listener, customIdentifier, context, endpoint, st)
{
	var obj = new oFF.RpcSqlQueryAction();
	obj.m_driver = driver;
	if (oFF.isNull(con))
	{
		driver.addError(2, "Not Connected!");
		obj.m_rpc = null;
	}
	else
	{
		var rpc = con.newRpcFunction(endpoint);
		rpc.getRpcRequest().setMethod(oFF.HttpRequestMethod.HTTP_POST);
		rpc.getRpcRequest().setRequestStructure(st);
		obj.m_rpc = rpc;
	}
	obj.setupActionAndRun(syncType, listener, customIdentifier, context);
	return obj;
};
oFF.RpcSqlQueryAction.prototype.m_driver = null;
oFF.RpcSqlQueryAction.prototype.m_rpc = null;
oFF.RpcSqlQueryAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onQueryResult(extResult, data, customIdentifier);
};
oFF.RpcSqlQueryAction.prototype.processSynchronization = function(syncType)
{
	if (oFF.isNull(this.m_rpc))
	{
		return false;
	}
	this.m_rpc.processFunctionExecution(syncType, this, null);
	return true;
};
oFF.RpcSqlQueryAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.m_driver.addAllMessages(this.m_rpc);
	if (this.m_rpc.isValid() && this.m_rpc.getServerStatusCode() === 200)
	{
		var errors = oFF.RpcSqlInaUtil.getErrors(this.m_rpc.getRpcResponse().getRootElement());
		if (errors.size() > 0)
		{
			for (var i = 0, size = errors.size(); i < size; i++)
			{
				this.m_driver.addMessage(errors.get(i));
			}
		}
		else
		{
			var rlist = oFF.PrFactory.createList();
			rlist.add(this.m_rpc.getRpcResponse().getRootElement());
			this.setData(oFF.SqlJsonResultSet.create(rlist));
		}
	}
	else
	{
		this.m_driver.addError(2, "Failed to execute Query");
		this.setData(null);
	}
	this.endSync();
};

oFF.RpcSqlUpdateAction = function() {};
oFF.RpcSqlUpdateAction.prototype = new oFF.SyncAction();
oFF.RpcSqlUpdateAction.prototype._ff_c = "RpcSqlUpdateAction";

oFF.RpcSqlUpdateAction.createAndRun = function(driver, con, syncType, listener, customIdentifier, context, sql)
{
	var obj = new oFF.RpcSqlUpdateAction();
	obj.m_driver = driver;
	if (oFF.isNull(con))
	{
		driver.addError(2, "Not Connected!");
		obj.m_rpc = null;
	}
	else
	{
		var st = oFF.PrFactory.createStructure();
		st.putString("type", "update");
		st.putString("sql", sql);
		var rpc = con.newRpcFunction("/BasicSql");
		rpc.getRpcRequest().setMethod(oFF.HttpRequestMethod.HTTP_POST);
		rpc.getRpcRequest().setRequestStructure(st);
		obj.m_rpc = rpc;
	}
	obj.setupActionAndRun(syncType, listener, customIdentifier, context);
	return obj;
};
oFF.RpcSqlUpdateAction.prototype.m_driver = null;
oFF.RpcSqlUpdateAction.prototype.m_rpc = null;
oFF.RpcSqlUpdateAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onUpdated(extResult, data, customIdentifier);
};
oFF.RpcSqlUpdateAction.prototype.processSynchronization = function(syncType)
{
	if (oFF.isNull(this.m_rpc))
	{
		return false;
	}
	this.m_rpc.processFunctionExecution(syncType, this, null);
	return true;
};
oFF.RpcSqlUpdateAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.m_driver.addAllMessages(this.m_rpc);
	if (this.m_rpc.isValid() && this.m_rpc.getServerStatusCode() >= 200 && this.m_rpc.getServerStatusCode() < 300)
	{
		var errors = oFF.RpcSqlInaUtil.getErrors(this.m_rpc.getRpcResponse().getRootElement());
		if (errors.size() > 0)
		{
			for (var i = 0, size = errors.size(); i < size; i++)
			{
				this.m_driver.addMessage(errors.get(i));
			}
			this.setData(oFF.XIntegerValue.create(1));
		}
		else
		{
			this.setData(oFF.XIntegerValue.create(0));
		}
	}
	else
	{
		this.m_driver.addError(2, "Failed to execute Update");
		this.setData(oFF.XIntegerValue.create(1));
	}
	this.endSync();
};

oFF.SqlModule = function() {};
oFF.SqlModule.prototype = new oFF.DfModule();
oFF.SqlModule.prototype._ff_c = "SqlModule";

oFF.SqlModule.s_module = null;
oFF.SqlModule.getInstance = function()
{
	if (oFF.isNull(oFF.SqlModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.RuntimeModule.getInstance());
		oFF.SqlModule.s_module = oFF.DfModule.startExt(new oFF.SqlModule());
		oFF.DfModule.stopExt(oFF.SqlModule.s_module);
	}
	return oFF.SqlModule.s_module;
};
oFF.SqlModule.prototype.getName = function()
{
	return "ff3500.sql";
};

oFF.SqlModule.getInstance();

return sap.firefly;
	} );