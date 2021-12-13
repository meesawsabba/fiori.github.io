/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
[
"sap/zen/dsh/firefly/ff0210.io.native","sap/zen/dsh/firefly/ff0230.io.ext","sap/zen/dsh/firefly/ff1040.kernel.native","sap/zen/dsh/firefly/ff2010.binding"
],
function(oFF)
{
"use strict";

oFF.ApplicationFactory = {

	createDefaultApplication:function()
	{
			return oFF.ApplicationFactory.createDefaultApplicationWithVersion(0);
	},
	createDefaultApplicationWithVersion:function(xVersion)
	{
			var action = oFF.ApplicationFactory.createApplicationExt2(oFF.SyncType.BLOCKING, null, null, null, null, xVersion, null, null, null, null, oFF.ApplicationSystemOption.AUTO, false, null);
		var data = action.getData();
		oFF.XObjectExt.release(action);
		return data;
	},
	createApplicationWithVersionAndKernelBoot:function(xVersion)
	{
			var action = oFF.ApplicationFactory.createApplicationExt2(oFF.SyncType.BLOCKING, null, null, null, null, xVersion, null, null, null, null, oFF.ApplicationSystemOption.AUTO, true, null);
		var data = action.getData();
		oFF.XObjectExt.release(action);
		return data;
	},
	createApplicationWithUri:function(uri)
	{
			return oFF.ApplicationFactory.createApplicationWithUriAndVersion(uri, 0);
	},
	createApplicationWithUriAndVersion:function(uri, xVersion)
	{
			var sysUri = oFF.XUri.createFromUrl(uri);
		var action = oFF.ApplicationFactory.createApplicationExt2(oFF.SyncType.BLOCKING, null, null, null, null, xVersion, null, null, sysUri, null, oFF.ApplicationSystemOption.AUTO, false, null);
		var data = action.getData();
		oFF.XObjectExt.release(action);
		return data;
	},
	createApplication:function(process)
	{
			var action = oFF.ApplicationFactory.createApplicationExt2(oFF.SyncType.BLOCKING, null, null, null, process, 0, null, null, null, null, oFF.ApplicationSystemOption.AUTO, false, null);
		var data = action.getData();
		oFF.XObjectExt.release(action);
		return data;
	},
	createApplicationWithLandscapeBlocking:function(process, systemLandscapeUrl)
	{
			return oFF.ApplicationFactory.createApplicationWithVersionAndLandscape(process, 0, systemLandscapeUrl);
	},
	createApplicationWithVersionAndLandscape:function(process, xVersion, systemLandscapeUrl)
	{
			return oFF.ApplicationFactory.createApplicationExt2(oFF.SyncType.BLOCKING, null, null, null, process, xVersion, null, null, null, systemLandscapeUrl, oFF.ApplicationSystemOption.PATH, false, null);
	},
	createApplicationWithDefaultSystem:function(process, systemType, systemName)
	{
			return oFF.ApplicationFactory.createApplicationWithVersionAndDefaultSystem(process, 0, systemType, systemName);
	},
	createApplicationWithVersionAndDefaultSystem:function(process, xVersion, systemType, systemName)
	{
			var action = oFF.ApplicationFactory.createApplicationExt2(oFF.SyncType.BLOCKING, null, null, null, process, xVersion, systemType, systemName, null, null, oFF.ApplicationSystemOption.LOCATION_AND_TYPE, false, null);
		var data = action.getData();
		oFF.XObjectExt.release(action);
		return data;
	},
	createApplicationFull:function(process, xVersion, systemType, systemName, systemUri, systemLandscapeUrl, syncType, listener)
	{
			return oFF.ApplicationFactory.createApplicationExt2(syncType, listener, null, null, process, xVersion, systemType, systemName, systemUri, systemLandscapeUrl, oFF.ApplicationSystemOption.AUTO, false, null);
	},
	createApplicationExt:function(syncType, listener, customIdentifier, process, xVersion, systemType, systemName, systemUri, systemLandscapeUrl)
	{
			return oFF.ApplicationFactory.createApplicationExt2(syncType, listener, customIdentifier, null, process, xVersion, systemType, systemName, systemUri, systemLandscapeUrl, oFF.ApplicationSystemOption.AUTO, false, null);
	},
	createApplicationForOrca:function(syncType, listener, customIdentifier, process, xVersion, systemLandscapeUrl)
	{
			return oFF.ApplicationFactory.createApplicationExt2(syncType, listener, customIdentifier, null, process, xVersion, null, null, null, systemLandscapeUrl, oFF.ApplicationSystemOption.PATH, true, oFF.OrcaAppProgram.DEFAULT_PROGRAM_NAME);
	},
	createApplicationForDragonfly:function(listener)
	{
			var env = oFF.XEnvironment.getInstance();
		env.setVariable(oFF.XEnvironmentConstants.FIREFLY_FEATURE_TOGGLES, "+Olap.AutoVariableSubmitCapability");
		env.setVariable(oFF.XEnvironmentConstants.FIREFLY_FEATURE_TOGGLES, "+Olap.AutoVariableSubmitFunctionality");
		return oFF.ApplicationFactory.createApplicationExt2(oFF.SyncType.NON_BLOCKING, listener, null, null, null, oFF.XVersion.MAX, null, null, null, null, oFF.ApplicationSystemOption.PATH, true, oFF.DragonflyAppProgram.DEFAULT_PROGRAM_NAME);
	},
	createApplicationExt2:function(syncType, listener, customIdentifier, kernel, process, xVersion, systemType, systemName, systemUri, systemLandscapeUrl, systemOption, useKernelBoot, programName)
	{
			var result = oFF.ApplicationFactory.createApplicationInitializeAction();
		result.setProcess(process);
		result.setActiveSyncType(syncType);
		result.registerListener(listener, customIdentifier);
		result.setXVersion(xVersion);
		result.setSystemType(systemType);
		result.setSystemName(systemName);
		result.setSystemUri(systemUri);
		result.setSystemLandscapeUrl(systemLandscapeUrl);
		result.setSystemOption(systemOption);
		result.setUseKernelBoot(useKernelBoot);
		result.setKernel(kernel);
		result.setProgramName(programName);
		result.process();
		return result;
	},
	createApplicationInitializeAction:function()
	{
			return oFF.ApplicationInitializeAction.create();
	}
};

oFF.QInAClientInfo = {

	exportClientInfo:function(inaStructure, clientInfo, supportsClientInfo)
	{
			if (oFF.notNull(inaStructure))
		{
			var storyId = clientInfo.getStoryId();
			var storyName = clientInfo.getStoryName();
			var languageLocale = clientInfo.getLanguageLocale();
			var widgetId = clientInfo.getWidgetId();
			var hasClientContext = oFF.XStringUtils.isNotNullAndNotEmpty(storyId) || oFF.XStringUtils.isNotNullAndNotEmpty(storyName) || oFF.XStringUtils.isNotNullAndNotEmpty(languageLocale) || oFF.XStringUtils.isNotNullAndNotEmpty(widgetId);
			if (!supportsClientInfo && !hasClientContext)
			{
				return;
			}
			var clientIdentifier = clientInfo.getClientIdentifier();
			if (clientInfo.getSession().hasFeature(oFF.FeatureToggleOlap.CLIENT_INFO_METADATA) && oFF.XStringUtils.isNullOrEmpty(clientIdentifier) && !hasClientContext)
			{
				return;
			}
			var inaClientInfo = inaStructure.putNewStructure(oFF.InAConstantsBios.QY_CLIENT_INFO);
			if (supportsClientInfo)
			{
				inaClientInfo.putStringNotNull(oFF.InAConstantsBios.QY_CLIENT_VERSION, clientInfo.getClientVersion());
				inaClientInfo.putStringNotNull(oFF.InAConstantsBios.QY_CLIENT_IDENTIFIER, clientIdentifier);
				inaClientInfo.putStringNotNull(oFF.InAConstantsBios.QY_CLIENT_COMPONENT, clientInfo.getClientComponent());
			}
			var widgetIds = oFF.XListOfString.create();
			if (hasClientContext)
			{
				var inaClientContext = inaClientInfo.putNewStructure(oFF.InAConstantsBios.QY_CLIENT_CONTEXT);
				inaClientContext.putStringNotNull(oFF.InAConstantsBios.QY_STORY_ID, storyId);
				inaClientContext.putStringNotNull(oFF.InAConstantsBios.QY_STORY_NAME, storyName);
				inaClientContext.putStringNotNull(oFF.InAConstantsBios.QY_LANGUAGE_LOCALE, languageLocale);
				if (oFF.XStringUtils.isNotNullAndNotEmpty(widgetId))
				{
					widgetIds.add(widgetId);
				}
			}
			var inaBatch = inaStructure.getListByKey(oFF.ConnectionConstants.INA_BATCH);
			if (oFF.notNull(inaBatch))
			{
				var size = inaBatch.size();
				for (var i = 0; i < size; i++)
				{
					var inaSubRequest = inaBatch.getStructureAt(i);
					var inaSubClientInfo = inaSubRequest.getStructureByKey(oFF.InAConstantsBios.QY_CLIENT_INFO);
					inaSubRequest.remove(oFF.InAConstantsBios.QY_CLIENT_INFO);
					if (oFF.isNull(inaSubClientInfo))
					{
						continue;
					}
					var inaSubClientContext = inaSubClientInfo.getStructureByKey(oFF.InAConstantsBios.QY_CLIENT_CONTEXT);
					if (oFF.isNull(inaSubClientContext))
					{
						continue;
					}
					var inaSubWidgetIds = inaSubClientContext.getListByKey(oFF.InAConstantsBios.QY_WIDGET_ID);
					if (oFF.notNull(inaSubWidgetIds))
					{
						widgetIds.add(inaSubWidgetIds.getStringAt(0));
					}
				}
			}
			if (widgetIds.hasElements())
			{
				var inaWidgetIds = inaClientInfo.getStructureByKey(oFF.InAConstantsBios.QY_CLIENT_CONTEXT).putNewList(oFF.InAConstantsBios.QY_WIDGET_ID);
				inaWidgetIds.addAllStrings(widgetIds);
			}
		}
	}
};

oFF.OlapEnvironmentFactory = function() {};
oFF.OlapEnvironmentFactory.prototype = new oFF.XObject();
oFF.OlapEnvironmentFactory.prototype._ff_c = "OlapEnvironmentFactory";

oFF.OlapEnvironmentFactory.s_olapEnvironmentFactory = null;
oFF.OlapEnvironmentFactory.staticSetup = function()
{
	var defaultFactory = new oFF.OlapEnvironmentFactory();
	oFF.OlapEnvironmentFactory.registerFactory(defaultFactory);
};
oFF.OlapEnvironmentFactory.newInstance = function(application)
{
	return oFF.OlapEnvironmentFactory.s_olapEnvironmentFactory.newOlapEnvironmentInstance(application);
};
oFF.OlapEnvironmentFactory.registerFactory = function(olapEnvironmentFactory)
{
	var oldFactory = oFF.OlapEnvironmentFactory.s_olapEnvironmentFactory;
	oFF.OlapEnvironmentFactory.s_olapEnvironmentFactory = olapEnvironmentFactory;
	return oldFactory;
};
oFF.OlapEnvironmentFactory.prototype.newOlapEnvironmentInstance = function(application)
{
	return null;
};

oFF.ServiceTypeInfo = function() {};
oFF.ServiceTypeInfo.prototype = new oFF.XObject();
oFF.ServiceTypeInfo.prototype._ff_c = "ServiceTypeInfo";

oFF.ServiceTypeInfo.prototype.createServiceConfigInternal = function(application)
{
	var serviceConfigReferenceName = this.getServiceConfigReferenceName();
	var regService = oFF.RegistrationService.getInstance();
	var references = regService.getReferences(serviceConfigReferenceName);
	if (references.size() === 1)
	{
		var registeredClass = references.get(0);
		var serviceConfig = registeredClass.newInstance(application);
		serviceConfig.setServiceTypeInfo(this);
		serviceConfig.setupConfig(application);
		return serviceConfig;
	}
	throw oFF.XException.createIllegalStateException("more than one reference for service config");
};

oFF.ServiceUtils = function() {};
oFF.ServiceUtils.prototype = new oFF.XObject();
oFF.ServiceUtils.prototype._ff_c = "ServiceUtils";

oFF.ServiceUtils.getMatchingService = function(config, serviceReferenceName, messageManager)
{
	var regService = oFF.RegistrationService.getInstance();
	var references = regService.getReferences(serviceReferenceName);
	for (var i = 0; i < references.size(); i++)
	{
		var registeredClass = references.get(i);
		var service = registeredClass.newInstance(config);
		if (service.isServiceConfigMatching(config, config.getConnectionContainer(), messageManager))
		{
			service.setupService(config);
			return service;
		}
	}
	return null;
};

oFF.NopUsageTracker = function() {};
oFF.NopUsageTracker.prototype = new oFF.XObject();
oFF.NopUsageTracker.prototype._ff_c = "NopUsageTracker";

oFF.NopUsageTracker.prototype.trackUsage = function(actionId, parameters, session) {};
oFF.NopUsageTracker.prototype.track = function(event) {};
oFF.NopUsageTracker.prototype.isEnabled = function()
{
	return false;
};

oFF.UsageTrackerProvider = {

	instance:null,
	getUsageTracker:function()
	{
			if (oFF.isNull(oFF.UsageTrackerProvider.instance))
		{
			oFF.UsageTrackerProvider.instance = new oFF.NopUsageTracker();
		}
		return oFF.UsageTrackerProvider.instance;
	},
	setUsageTracker:function(instance)
	{
			oFF.UsageTrackerProvider.instance = instance;
	}
};

oFF.BatchRequestManager = function() {};
oFF.BatchRequestManager.prototype = new oFF.XObject();
oFF.BatchRequestManager.prototype._ff_c = "BatchRequestManager";

oFF.BatchRequestManager.CONSTANT_ID = null;
oFF.BatchRequestManager.create = function(session)
{
	var batchRequestManager = new oFF.BatchRequestManager();
	batchRequestManager.m_session = session;
	batchRequestManager.m_batchFunctions = oFF.XList.create();
	batchRequestManager.m_preQueryNames = oFF.XHashSetOfString.create();
	batchRequestManager.m_microCubeNames = oFF.XHashSetOfString.create();
	return batchRequestManager;
};
oFF.BatchRequestManager.prototype.m_session = null;
oFF.BatchRequestManager.prototype.m_batchFunctions = null;
oFF.BatchRequestManager.prototype.m_preQueryNames = null;
oFF.BatchRequestManager.prototype.m_batchFunctionsIdMapping = null;
oFF.BatchRequestManager.prototype.m_streamingGuid = null;
oFF.BatchRequestManager.prototype.m_functionFactory = null;
oFF.BatchRequestManager.prototype.m_batchModePath = null;
oFF.BatchRequestManager.prototype.m_syncType = null;
oFF.BatchRequestManager.prototype.m_microCubeNames = null;
oFF.BatchRequestManager.prototype.m_cacheHintsEnabled = false;
oFF.BatchRequestManager.prototype.releaseObject = function()
{
	oFF.XObject.prototype.releaseObject.call( this );
	this.m_session = null;
	this.m_batchFunctions = null;
	this.m_batchFunctionsIdMapping = null;
	this.m_streamingGuid = null;
	this.m_functionFactory = null;
	this.m_batchModePath = null;
	this.m_syncType = null;
	this.m_microCubeNames = oFF.XObjectExt.release(this.m_microCubeNames);
	this.m_preQueryNames = oFF.XObjectExt.release(this.m_preQueryNames);
};
oFF.BatchRequestManager.prototype.getBatchFunctions = function()
{
	var batchfunctions = oFF.XList.create();
	for (var i = 0; i < this.m_batchFunctions.size(); i++)
	{
		batchfunctions.add(this.m_batchFunctions.get(i));
	}
	return batchfunctions;
};
oFF.BatchRequestManager.prototype.addPreQueryName = function(preQueryName)
{
	this.m_preQueryNames.add(preQueryName);
};
oFF.BatchRequestManager.prototype.containsPreQueryName = function(preQueryName)
{
	return this.m_preQueryNames.contains(preQueryName);
};
oFF.BatchRequestManager.prototype.addBatchFunction = function(_function)
{
	this.m_batchFunctions.add(_function);
};
oFF.BatchRequestManager.prototype.getMicroCubesNames = function()
{
	return this.m_microCubeNames;
};
oFF.BatchRequestManager.prototype.addMicroCubeName = function(name)
{
	this.m_microCubeNames.add(name);
};
oFF.BatchRequestManager.prototype.isRsStreamingEnabled = function()
{
	return oFF.notNull(this.m_streamingGuid);
};
oFF.BatchRequestManager.prototype.executeBatch = function(syncType, functionFactory, batchModePath, enableRsStreaming)
{
	this.removeExecutedFunctions();
	this.m_preQueryNames.clear();
	var application = functionFactory.getProcess().getApplication();
	var olapEnvironment = application.getOlapEnvironment();
	olapEnvironment.clearTransientQueryManager();
	if (!oFF.XCollectionUtils.hasElements(this.m_batchFunctions))
	{
		return;
	}
	this.m_syncType = syncType;
	this.m_functionFactory = functionFactory;
	this.m_batchModePath = batchModePath;
	var batchStructure = oFF.PrFactory.createStructure();
	var requestList = batchStructure.putNewList(oFF.ConnectionConstants.INA_BATCH);
	var isStreamingFeasible = this.addQueriesToRequestList(requestList);
	oFF.QInAClientInfo.exportClientInfo(batchStructure, application, functionFactory.supportsAnalyticCapability(oFF.InAConstantsBios.QY_CLIENT_INFO));
	if (enableRsStreaming && isStreamingFeasible)
	{
		this.m_streamingGuid = this.createGuid(null);
		this.ensureUniqueInstanceIds();
		var asyncResponseRequest = batchStructure.putNewStructure(oFF.ConnectionConstants.INA_BATCH_ASYNC_RESPONSE_REQUEST);
		asyncResponseRequest.putString(oFF.ConnectionConstants.INA_BATCH_ID, this.m_streamingGuid);
	}
	var _function = functionFactory.newRpcFunctionInternal(batchModePath, false);
	var request = _function.getRpcRequest();
	request.setMethod(oFF.HttpRequestMethod.HTTP_POST);
	request.setAcceptContentType(oFF.ContentType.APPLICATION_JSON);
	request.setRequestStructure(batchStructure);
	this.collectProcessingHints(_function);
	_function.processFunctionExecution(syncType, this, null);
};
oFF.BatchRequestManager.prototype.collectProcessingHints = function(_function)
{
	this.m_cacheHintsEnabled = _function.getProcessingHint().getBooleanByKeyExt(oFF.ConnectionParameters.CACHE_HINTS_ENABLED, false);
	var hintsList = _function.getProcessingHint().putNewList(oFF.ConnectionConstants.INA_BATCH);
	var i = 0;
	while (i < this.m_batchFunctions.size())
	{
		var rpcBatchFunction = this.m_batchFunctions.get(i);
		var processingHint = rpcBatchFunction.getProcessingHint();
		hintsList.add(processingHint);
		this.m_cacheHintsEnabled = this.m_cacheHintsEnabled || processingHint.getBooleanByKeyExt(oFF.ConnectionParameters.CACHE_HINTS_ENABLED, false);
		i++;
	}
};
oFF.BatchRequestManager.prototype.removeExecutedFunctions = function()
{
	var i = 0;
	while (i < this.m_batchFunctions.size())
	{
		var rpcBatchFunction = this.m_batchFunctions.get(i);
		var requestStructure = rpcBatchFunction.getRpcRequest().getRequestStructure();
		if (rpcBatchFunction.getSyncState() !== oFF.SyncState.PROCESSING || oFF.isNull(requestStructure) || requestStructure.isReleased())
		{
			this.m_batchFunctions.removeAt(i);
			continue;
		}
		i++;
	}
};
oFF.BatchRequestManager.prototype.addQueriesToRequestList = function(requestList)
{
	var batchSize = this.m_batchFunctions.size();
	var isStreamingFeasible = batchSize > 1;
	for (var i = 0; i < batchSize; i++)
	{
		var rpcBatchFunction = this.m_batchFunctions.get(i);
		var request = rpcBatchFunction.getRpcRequest();
		var requestStructure = request.getRequestStructure();
		var decorator = oFF.BatchRequestDecoratorFactory.getBatchRequestDecorator(this.m_session, requestStructure);
		if (oFF.isNull(decorator))
		{
			requestList.add(requestStructure);
			if (this.getInstanceId(requestStructure) === null)
			{
				isStreamingFeasible = false;
			}
		}
		else
		{
			isStreamingFeasible = false;
			rpcBatchFunction.setDecorator(decorator);
			var requestStructureFlat = decorator.getRequestItems();
			if (oFF.notNull(requestStructureFlat))
			{
				for (var flatIndex = 0; flatIndex < requestStructureFlat.size(); flatIndex++)
				{
					requestList.add(requestStructureFlat.get(flatIndex));
				}
			}
		}
	}
	return isStreamingFeasible;
};
oFF.BatchRequestManager.prototype.executeNextStreamingRequest = function()
{
	var batchStructure = oFF.PrFactory.createStructure();
	var analytics = batchStructure.putNewStructure(oFF.ConnectionConstants.INA_ANALYTICS);
	var actions = analytics.putNewList(oFF.ConnectionConstants.INA_ACTIONS);
	var structure = actions.addNewStructure();
	structure.putString(oFF.ConnectionConstants.INA_TYPE, oFF.ConnectionConstants.INA_BATCH_NEXT_ASYNC_RESPONSE);
	structure.putString(oFF.ConnectionConstants.INA_BATCH_ID, this.m_streamingGuid);
	var batch = structure.putNewList(oFF.ConnectionConstants.INA_BATCH);
	oFF.XStream.of(this.m_batchFunctions).map( function(bf){
		return bf.getRpcRequest().getRequestStructure();
	}.bind(this)).filter( function(rs1){
		return this.getDataSource(rs1) !== null;
	}.bind(this)).forEach( function(rs2){
		var batchFunctionStructure = batch.addNewStructure();
		var structureRootKey = this.getStructureRootKey(rs2);
		if (oFF.notNull(structureRootKey))
		{
			batchFunctionStructure = batchFunctionStructure.putNewStructure(structureRootKey);
		}
		batchFunctionStructure.put(oFF.ConnectionConstants.INA_DATA_SOURCE, this.getDataSource(rs2));
	}.bind(this));
	var _function = this.m_functionFactory.newRpcFunctionInternal(this.m_batchModePath, false);
	var request = _function.getRpcRequest();
	request.setMethod(oFF.HttpRequestMethod.HTTP_POST);
	request.setAcceptContentType(oFF.ContentType.APPLICATION_JSON);
	request.setRequestStructure(batchStructure);
	_function.getProcessingHint().putBoolean(oFF.ConnectionParameters.CACHE_HINTS_ENABLED, this.m_cacheHintsEnabled);
	_function.processFunctionExecution(this.m_syncType, this, null);
};
oFF.BatchRequestManager.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	oFF.XBooleanUtils.checkFalse(this.m_batchFunctions.isReleased(), "Fatal error: Batch functions object is not valid anymore");
	var executedFunctionsResult = this.updateResponsesInBatchFunctions(extResult);
	var executedFunctions = executedFunctionsResult.getData();
	this.endFunctions(executedFunctions, extResult);
	this.removeExecutedFunctions();
	if (this.isRsStreamingEnabled() && this.m_batchFunctions.hasElements())
	{
		if (extResult.isValid() && executedFunctionsResult.isValid())
		{
			this.executeNextStreamingRequest();
		}
		else
		{
			this.endFunctions(this.m_batchFunctions, extResult);
			oFF.XObjectExt.release(this);
		}
	}
	else
	{
		oFF.XObjectExt.release(this);
	}
	oFF.XObjectExt.release(executedFunctions);
};
oFF.BatchRequestManager.prototype.endFunctions = function(executedFunctions, extResult)
{
	var size = executedFunctions.size();
	for (var i = 0; i < size; i++)
	{
		var _function = executedFunctions.get(i);
		_function.addAllMessages(extResult);
		_function.endSync();
	}
};
oFF.BatchRequestManager.prototype.updateResponsesInBatchFunctions = function(extResult)
{
	if (extResult.isValid())
	{
		var response = extResult.getData();
		var rootElement = response.getRootElement();
		var batchList = rootElement.getListByKey(oFF.ConnectionConstants.INA_BATCH);
		if (this.isRsStreamingEnabled())
		{
			return this.updateRespondedBatchFunctions(batchList, rootElement);
		}
		this.updateAllBatchFunctions(batchList, rootElement);
	}
	return oFF.ExtResult.create(this.m_batchFunctions, null);
};
oFF.BatchRequestManager.prototype.updateAllBatchFunctions = function(batchList, rootElement)
{
	var batchFunctionSize = this.m_batchFunctions.size();
	if (oFF.notNull(batchList))
	{
		var flattenOffset = 0;
		for (var k = 0; k < batchFunctionSize; k++)
		{
			var batchFunction = this.m_batchFunctions.get(k);
			var batchFunctionResponse = batchFunction.getRpcResponse();
			var decorator = batchFunction.getDecorator();
			if (oFF.isNull(decorator))
			{
				var batchRootElement = batchList.getStructureAt(flattenOffset);
				batchFunctionResponse.setRootElement(batchRootElement, null);
				flattenOffset++;
			}
			else
			{
				var flatSize = decorator.getItemsSize();
				var responseStructureFlat = oFF.XList.create();
				for (var flatIndex = 0; flatIndex < flatSize; flatIndex++)
				{
					var batchRootElementFlat = batchList.getStructureAt(flattenOffset + flatIndex);
					responseStructureFlat.add(batchRootElementFlat);
				}
				var responseStructureDeep = decorator.buildResponse(responseStructureFlat);
				batchFunctionResponse.setRootElement(responseStructureDeep, null);
				flattenOffset = flattenOffset + flatSize;
			}
		}
	}
	else
	{
		for (var i = 0; i < batchFunctionSize; i++)
		{
			this.m_batchFunctions.get(i).getRpcResponse().setRootElement(rootElement, null);
		}
	}
};
oFF.BatchRequestManager.prototype.updateRespondedBatchFunctions = function(batchList, rootElement)
{
	var messageManager = oFF.MessageManager.createMessageManagerExt(this.m_session);
	var executedFunctions = oFF.XList.create();
	if (oFF.notNull(batchList) && batchList.hasElements())
	{
		var size = batchList.size();
		for (var i = 0; i < size; i++)
		{
			var structure = batchList.getStructureAt(i);
			var instanceId = this.getInstanceId(structure);
			var _function = this.m_batchFunctionsIdMapping.getByKey(instanceId);
			if (oFF.notNull(_function))
			{
				_function.getRpcResponse().setRootElement(structure, null);
				executedFunctions.add(_function);
			}
			else
			{
				messageManager.addError(0, "Request not found for response");
			}
		}
	}
	if (!this.isValidBatchStreamingResponse(rootElement))
	{
		messageManager.addError(0, "Response does not contain correct batch id");
	}
	return oFF.ExtResult.create(executedFunctions, messageManager);
};
oFF.BatchRequestManager.prototype.getInstanceId = function(structure)
{
	var dataSource = this.getDataSource(structure);
	if (oFF.notNull(dataSource))
	{
		return dataSource.getStringByKey(oFF.ConnectionConstants.INA_INSTANCE_ID);
	}
	return null;
};
oFF.BatchRequestManager.prototype.getDataSource = function(structure)
{
	var structureRootKey = this.getStructureRootKey(structure);
	if (oFF.notNull(structureRootKey))
	{
		return structure.getStructureByKey(structureRootKey).getStructureByKey(oFF.ConnectionConstants.INA_DATA_SOURCE);
	}
	return oFF.notNull(structure) ? structure.getStructureByKey(oFF.ConnectionConstants.INA_DATA_SOURCE) : null;
};
oFF.BatchRequestManager.prototype.getStructureRootKey = function(structure)
{
	if (oFF.isNull(structure))
	{
		return null;
	}
	if (structure.containsKey(oFF.ConnectionConstants.INA_ANALYTICS))
	{
		return oFF.ConnectionConstants.INA_ANALYTICS;
	}
	if (structure.containsKey(oFF.ConnectionConstants.INA_METADATA))
	{
		return oFF.ConnectionConstants.INA_METADATA;
	}
	if (structure.containsKey(oFF.ConnectionConstants.INA_CUBE))
	{
		return oFF.ConnectionConstants.INA_CUBE;
	}
	if (structure.containsKey(oFF.ConnectionConstants.INA_DS_VALIDATION))
	{
		return oFF.ConnectionConstants.INA_DS_VALIDATION;
	}
	return null;
};
oFF.BatchRequestManager.prototype.ensureUniqueInstanceIds = function()
{
	this.m_batchFunctionsIdMapping = oFF.XHashMapByString.create();
	var size = this.m_batchFunctions.size();
	for (var i = 0; i < size; i++)
	{
		var batchFunction = this.m_batchFunctions.get(i);
		var requestStructure = batchFunction.getRpcRequest().getRequestStructure();
		var instanceId = this.getInstanceId(requestStructure);
		if (this.m_batchFunctionsIdMapping.containsKey(instanceId) || oFF.XStringUtils.isNotNullAndNotEmpty(oFF.BatchRequestManager.CONSTANT_ID))
		{
			instanceId = this.createGuid(oFF.XInteger.convertToString(i));
			this.getDataSource(requestStructure).putString(oFF.ConnectionConstants.INA_INSTANCE_ID, instanceId);
		}
		this.m_batchFunctionsIdMapping.put(instanceId, batchFunction);
	}
};
oFF.BatchRequestManager.prototype.isValidBatchStreamingResponse = function(rootElement)
{
	var asyncResponseRequest = rootElement.getStructureByKey(oFF.ConnectionConstants.INA_BATCH_ASYNC_RESPONSE_REQUEST);
	if (oFF.notNull(asyncResponseRequest))
	{
		var batchId = asyncResponseRequest.getStringByKey(oFF.ConnectionConstants.INA_BATCH_ID);
		return oFF.notNull(batchId) && oFF.XString.isEqual(batchId, this.m_streamingGuid);
	}
	return false;
};
oFF.BatchRequestManager.prototype.createGuid = function(constantGuidPostfix)
{
	if (oFF.XStringUtils.isNotNullAndNotEmpty(oFF.BatchRequestManager.CONSTANT_ID))
	{
		return oFF.XStringUtils.concatenate2(oFF.BatchRequestManager.CONSTANT_ID, constantGuidPostfix);
	}
	return oFF.XGuid.getGuid();
};

oFF.BatchRequestManagerInAFactory = function() {};
oFF.BatchRequestManagerInAFactory.prototype = new oFF.BatchRequestManagerFactory();
oFF.BatchRequestManagerInAFactory.prototype._ff_c = "BatchRequestManagerInAFactory";

oFF.BatchRequestManagerInAFactory.staticSetupBatchInAFactory = function()
{
	oFF.BatchRequestManagerFactory.registerFactory(new oFF.BatchRequestManagerInAFactory());
};
oFF.BatchRequestManagerInAFactory.prototype.newBatchRequestManager = function(session)
{
	return oFF.BatchRequestManager.create(session);
};

oFF.ServiceType = function() {};
oFF.ServiceType.prototype = new oFF.ServiceTypeInfo();
oFF.ServiceType.prototype._ff_c = "ServiceType";

oFF.ServiceType.createType = function(serviceName)
{
	var st = new oFF.ServiceType();
	var serviceSetupReferenceName = oFF.XStringUtils.concatenate3(oFF.RegistrationService.SERVICE_CONFIG, ".", serviceName);
	var serviceReferenceName = oFF.XStringUtils.concatenate3(oFF.RegistrationService.SERVICE, ".", serviceName);
	st.setupExt(serviceSetupReferenceName, serviceReferenceName);
	return st;
};
oFF.ServiceType.prototype.m_srvConfigReferenceName = null;
oFF.ServiceType.prototype.m_serviceReferenceName = null;
oFF.ServiceType.prototype.setupExt = function(serviceConfigReferenceName, serviceReferenceName)
{
	this.m_srvConfigReferenceName = serviceConfigReferenceName;
	this.m_serviceReferenceName = serviceReferenceName;
};
oFF.ServiceType.prototype.createServiceConfig = function(application)
{
	return this.createServiceConfigInternal(application);
};
oFF.ServiceType.prototype.getServiceReferenceName = function()
{
	return this.m_serviceReferenceName;
};
oFF.ServiceType.prototype.getServiceConfigReferenceName = function()
{
	return this.m_srvConfigReferenceName;
};
oFF.ServiceType.prototype.toString = function()
{
	var sb = oFF.XStringBuffer.create();
	if (oFF.notNull(this.m_srvConfigReferenceName))
	{
		sb.appendLine(this.m_srvConfigReferenceName);
	}
	if (oFF.notNull(this.m_serviceReferenceName))
	{
		sb.appendLine(this.m_serviceReferenceName);
	}
	return sb.toString();
};

oFF.DcsUsageTracker = function() {};
oFF.DcsUsageTracker.prototype = new oFF.XObject();
oFF.DcsUsageTracker.prototype._ff_c = "DcsUsageTracker";

oFF.DcsUsageTracker.MAX_INTERVAL = 600000;
oFF.DcsUsageTracker.create = function()
{
	var dcsUsageTracker = new oFF.DcsUsageTracker();
	dcsUsageTracker.m_interval = 20000;
	dcsUsageTracker.m_enabled = false;
	dcsUsageTracker.m_failedCount = 0;
	dcsUsageTracker.setup();
	return dcsUsageTracker;
};
oFF.DcsUsageTracker.prototype.m_interval = 0;
oFF.DcsUsageTracker.prototype.m_dcsUrl = null;
oFF.DcsUsageTracker.prototype.m_session = null;
oFF.DcsUsageTracker.prototype.m_syncType = null;
oFF.DcsUsageTracker.prototype.eventQueue = null;
oFF.DcsUsageTracker.prototype.m_requestRunning = false;
oFF.DcsUsageTracker.prototype.m_timerHandle = null;
oFF.DcsUsageTracker.prototype.m_xlang = null;
oFF.DcsUsageTracker.prototype.m_enabled = false;
oFF.DcsUsageTracker.prototype.m_tenantId = null;
oFF.DcsUsageTracker.prototype.m_productVersion = null;
oFF.DcsUsageTracker.prototype.m_failedCount = 0;
oFF.DcsUsageTracker.prototype.m_language = null;
oFF.DcsUsageTracker.prototype.m_dispatcher = null;
oFF.DcsUsageTracker.prototype.setup = function()
{
	this.eventQueue = oFF.XList.create();
	this.m_dispatcher = oFF.Dispatcher.getInstance();
};
oFF.DcsUsageTracker.prototype.setDispatcher = function(dispatcher)
{
	this.m_dispatcher = dispatcher;
};
oFF.DcsUsageTracker.prototype.setInterval = function(interval)
{
	this.m_interval = interval;
};
oFF.DcsUsageTracker.prototype.setDcsUrl = function(dcsUrl)
{
	this.m_dcsUrl = oFF.XUri.createFromUrl(dcsUrl);
};
oFF.DcsUsageTracker.prototype.trackUsage = function(actionId, parameters, session)
{
	if (!this.isEnabled())
	{
		return;
	}
	this.addEvent(actionId, parameters, session);
	this.checkTimer();
};
oFF.DcsUsageTracker.prototype.track = function(event)
{
	if (!this.isEnabled())
	{
		return;
	}
	if (event.getEventTime() === null)
	{
		event.setEventTime(oFF.XDateTime.createCurrentLocalDateTime());
	}
	this.eventQueue.add(event);
	this.checkTimer();
};
oFF.DcsUsageTracker.prototype.checkTimer = function()
{
	if (this.m_requestRunning)
	{
		return;
	}
	if (oFF.notNull(this.m_timerHandle))
	{
		return;
	}
	var newInterval = oFF.XDouble.convertToInt(this.m_interval * oFF.XMath.pow(2, this.m_failedCount));
	this.m_timerHandle = this.m_dispatcher.registerTimer(oFF.XMath.min(newInterval, oFF.DcsUsageTracker.MAX_INTERVAL), this, null);
};
oFF.DcsUsageTracker.prototype.addEvent = function(actionId, parameters, session)
{
	var utEvent = new oFF.UTEvent();
	utEvent.setSession(session);
	utEvent.setEventId(actionId);
	utEvent.setEventTime(oFF.XDateTime.createCurrentLocalDateTime());
	utEvent.setFeature(parameters.getByKey("feature"));
	utEvent.setParameters(parameters);
	this.eventQueue.add(utEvent);
};
oFF.DcsUsageTracker.prototype.isEnabled = function()
{
	return this.m_enabled;
};
oFF.DcsUsageTracker.prototype.setEnabled = function(enabled)
{
	this.m_enabled = enabled;
};
oFF.DcsUsageTracker.prototype.process = function()
{
	if (this.eventQueue.isEmpty())
	{
		this.cancelTimer();
		return;
	}
	var request = this.createHttpRequest();
	var httpClient = request.newHttpClient(this.getSession());
	this.m_requestRunning = true;
	httpClient.processHttpRequest(this.getSyncType(), this, null);
};
oFF.DcsUsageTracker.prototype.cancelTimer = function()
{
	this.m_dispatcher.unregisterInterval(this.m_timerHandle);
	this.m_timerHandle = oFF.XObjectExt.release(this.m_timerHandle);
};
oFF.DcsUsageTracker.prototype.getSyncType = function()
{
	if (oFF.isNull(this.m_syncType))
	{
		this.m_syncType = oFF.SyncType.NON_BLOCKING;
	}
	return this.m_syncType;
};
oFF.DcsUsageTracker.prototype.setSyncType = function(syncType)
{
	this.m_syncType = syncType;
};
oFF.DcsUsageTracker.prototype.getSession = function()
{
	if (oFF.isNull(this.m_session))
	{
		this.m_session = oFF.DefaultSession.create();
	}
	return this.m_session;
};
oFF.DcsUsageTracker.prototype.createHttpRequest = function()
{
	var request = oFF.HttpRequest.create();
	request.setMethod(oFF.HttpRequestMethod.HTTP_POST);
	request.setFromUri(this.getDscUri());
	request.setContentType(oFF.ContentType.APPLICATION_JSON);
	request.setString(this.buildContent());
	return request;
};
oFF.DcsUsageTracker.prototype.getDscUri = function()
{
	if (oFF.isNull(this.m_dcsUrl))
	{
		var location = oFF.NetworkEnv.getLocation();
		if (oFF.isNull(location))
		{
			throw oFF.XException.createIllegalArgumentException("Data Collection Url must be provided");
		}
		this.m_dcsUrl = oFF.XUri.createFromOther(location);
		this.m_dcsUrl.setPath("/datacollection/api/v2/application/data");
		this.m_dcsUrl.setQuery("");
	}
	return this.m_dcsUrl;
};
oFF.DcsUsageTracker.prototype.buildContent = function()
{
	var content = oFF.PrFactory.createStructure();
	this.addCommonFacts(content);
	var actiondata = content.getListByKey("actiondata");
	var size = this.eventQueue.size();
	for (var i = 0; i < size; i++)
	{
		var actionItem = oFF.PrFactory.createStructure();
		actiondata.add(actionItem);
		var event = this.eventQueue.get(i);
		var parameters = event.getParameters();
		actionItem.putString("action", event.getEventId());
		actionItem.putString("feature", event.getFeature());
		var errorSize = event.getErrorSize();
		actionItem.putInteger("numoferrormessages", errorSize);
		if (errorSize > 0)
		{
			var errorBuffer = oFF.XStringBuffer.create();
			var errors = event.getErrors().getKeysAsIteratorOfString();
			while (errors.hasNext())
			{
				var errorKey = errors.next();
				errorBuffer.append(errorKey).append(":").append(event.getErrors().getByKey(errorKey)).append(";");
			}
			actionItem.putString("errormessages", errorBuffer.toString());
		}
		var value = event.getEventTime().toIsoFormatWithFractions(3);
		actionItem.putString("actiontimestamp", oFF.XString.replace(value, "T", " "));
		actionItem.putString("sessionid", event.getSession().getAppSessionId());
		actionItem.putInteger("actionduration", 0);
		actionItem.putInteger("xversion", this.getSession().getXVersion());
		var options = actionItem.putNewList("options");
		var paramInter = parameters.getKeysAsIteratorOfString();
		while (paramInter.hasNext())
		{
			var param = paramInter.next();
			if (oFF.XString.compare(param, "actionId") !== 0 && oFF.XString.compare(param, "feature") !== 0)
			{
				var option = options.addNewStructure();
				option.putString("param", param);
				option.putString("value", parameters.getByKey(param));
			}
		}
	}
	this.eventQueue.clear();
	return oFF.PrUtils.serialize(content, true, true, 0);
};
oFF.DcsUsageTracker.prototype.addCommonFacts = function(content)
{
	content.putString("applicationtype", "service");
	content.putString("applicationname", "firefly");
	content.putString("fireflyversion", oFF.XLibVersionUtil.getLibVersion(this.getSession()));
	content.putString("productversion", this.getProductVersion());
	content.putString("xlang", this.mapXLang());
	content.putString("tenantid", this.getTenantId());
	content.putString("os", oFF.XSystemUtils.getOsName());
	content.putString("language", this.getLanguage());
	content.putString("userid", "");
	var location = oFF.NetworkEnv.getLocation();
	var host = "N/A";
	if (oFF.notNull(location) && oFF.XStringUtils.isNotNullAndNotEmpty(location.getHost()))
	{
		host = location.getHost();
	}
	content.putString("publichost", host);
	content.putNewList("actiondata");
};
oFF.DcsUsageTracker.prototype.mapXLang = function()
{
	if (oFF.isNull(this.m_xlang))
	{
		var xLang = oFF.XLanguage.getLanguage();
		if (xLang === oFF.XLanguage.JAVASCRIPT)
		{
			this.m_xlang = "js";
		}
		else if (xLang === oFF.XLanguage.TYPESCRIPT)
		{
			this.m_xlang = "ts";
		}
		else if (xLang === oFF.XLanguage.JAVA)
		{
			this.m_xlang = "java";
		}
		else if (xLang === oFF.XLanguage.CSHARP)
		{
			this.m_xlang = "csharp";
		}
		else if (xLang === oFF.XLanguage.CPP)
		{
			this.m_xlang = "cpp";
		}
		else if (xLang === oFF.XLanguage.OBJECTIVE_C)
		{
			this.m_xlang = "objc";
		}
	}
	return this.m_xlang;
};
oFF.DcsUsageTracker.prototype.onHttpResponse = function(extResult, response, customIdentifier)
{
	if (response.getStatusCode() !== 202)
	{
		this.m_failedCount = this.m_failedCount === 10 ? 10 : this.m_failedCount + 1;
	}
	else
	{
		this.m_failedCount = 0;
	}
	this.m_requestRunning = false;
	this.cancelTimer();
};
oFF.DcsUsageTracker.prototype.onTimerEvent = function(timerHandle, customIdentifier)
{
	this.process();
};
oFF.DcsUsageTracker.prototype.getTenantId = function()
{
	return this.m_tenantId;
};
oFF.DcsUsageTracker.prototype.setTenantId = function(tenantId)
{
	this.m_tenantId = tenantId;
};
oFF.DcsUsageTracker.prototype.getProductVersion = function()
{
	return this.m_productVersion;
};
oFF.DcsUsageTracker.prototype.setProductVersion = function(productVersion)
{
	this.m_productVersion = productVersion;
};
oFF.DcsUsageTracker.prototype.getLanguage = function()
{
	return oFF.notNull(this.m_language) ? this.m_language : "N/A";
};
oFF.DcsUsageTracker.prototype.setLanguage = function(language)
{
	this.m_language = language;
};

oFF.UTEvent = function() {};
oFF.UTEvent.prototype = new oFF.XObject();
oFF.UTEvent.prototype._ff_c = "UTEvent";

oFF.UTEvent.prototype.eventTime = null;
oFF.UTEvent.prototype.host = null;
oFF.UTEvent.prototype.tenantId = null;
oFF.UTEvent.prototype.session = null;
oFF.UTEvent.prototype.m_eventId = null;
oFF.UTEvent.prototype.m_parameters = null;
oFF.UTEvent.prototype.m_feature = null;
oFF.UTEvent.prototype.errors = null;
oFF.UTEvent.prototype.getEventTime = function()
{
	return this.eventTime;
};
oFF.UTEvent.prototype.setEventTime = function(eventTime)
{
	this.eventTime = eventTime;
};
oFF.UTEvent.prototype.getHost = function()
{
	return this.host;
};
oFF.UTEvent.prototype.setHost = function(host)
{
	this.host = host;
};
oFF.UTEvent.prototype.getTenantId = function()
{
	return this.tenantId;
};
oFF.UTEvent.prototype.setTenantId = function(tenantId)
{
	this.tenantId = tenantId;
};
oFF.UTEvent.prototype.getSession = function()
{
	return this.session;
};
oFF.UTEvent.prototype.setSession = function(session)
{
	this.session = session;
};
oFF.UTEvent.prototype.setEventId = function(eventId)
{
	this.m_eventId = eventId;
};
oFF.UTEvent.prototype.getEventId = function()
{
	return this.m_eventId;
};
oFF.UTEvent.prototype.setParameters = function(parameters)
{
	this.m_parameters = parameters;
};
oFF.UTEvent.prototype.getParameters = function()
{
	return this.m_parameters;
};
oFF.UTEvent.prototype.getFeature = function()
{
	return this.m_feature;
};
oFF.UTEvent.prototype.setFeature = function(feature)
{
	this.m_feature = feature;
};
oFF.UTEvent.prototype.getErrorSize = function()
{
	if (oFF.notNull(this.errors))
	{
		return this.errors.size();
	}
	return 0;
};
oFF.UTEvent.prototype.getErrors = function()
{
	return this.errors;
};
oFF.UTEvent.prototype.setErrors = function(errors)
{
	this.errors = errors;
};

oFF.DfApplicationContext = function() {};
oFF.DfApplicationContext.prototype = new oFF.XObjectExt();
oFF.DfApplicationContext.prototype._ff_c = "DfApplicationContext";

oFF.DfApplicationContext.prototype.m_application = null;
oFF.DfApplicationContext.prototype.setupApplicationContext = function(application)
{
	this.setApplication(application);
};
oFF.DfApplicationContext.prototype.releaseObject = function()
{
	this.m_application = null;
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.DfApplicationContext.prototype.getLogWriter = function()
{
	var session = this.getSession();
	if (oFF.notNull(session))
	{
		return session.getLogWriter();
	}
	return null;
};
oFF.DfApplicationContext.prototype.getSession = function()
{
	var application = this.getApplication();
	return oFF.isNull(application) ? null : application.getSession();
};
oFF.DfApplicationContext.prototype.getApplication = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_application);
};
oFF.DfApplicationContext.prototype.setApplication = function(application)
{
	this.m_application = oFF.XWeakReferenceUtil.getWeakRef(application);
};
oFF.DfApplicationContext.prototype.toString = function()
{
	return oFF.isNull(this.m_application) ? "" : this.m_application.toString();
};

oFF.DfApplicationContextHard = function() {};
oFF.DfApplicationContextHard.prototype = new oFF.XObjectExt();
oFF.DfApplicationContextHard.prototype._ff_c = "DfApplicationContextHard";

oFF.DfApplicationContextHard.prototype.m_application = null;
oFF.DfApplicationContextHard.prototype.setupApplicationContext = function(application)
{
	this.setApplication(application);
};
oFF.DfApplicationContextHard.prototype.releaseObject = function()
{
	this.m_application = null;
	oFF.XObjectExt.prototype.releaseObject.call( this );
};
oFF.DfApplicationContextHard.prototype.getLogWriter = function()
{
	var session = this.getSession();
	if (oFF.notNull(session))
	{
		return session.getLogWriter();
	}
	return null;
};
oFF.DfApplicationContextHard.prototype.getSession = function()
{
	var application = this.getApplication();
	return oFF.isNull(application) ? null : application.getSession();
};
oFF.DfApplicationContextHard.prototype.getApplication = function()
{
	return this.m_application;
};
oFF.DfApplicationContextHard.prototype.setApplication = function(application)
{
	this.m_application = application;
};
oFF.DfApplicationContextHard.prototype.toString = function()
{
	return oFF.isNull(this.m_application) ? "" : this.m_application.toString();
};

oFF.FileSystemService = function() {};
oFF.FileSystemService.prototype = new oFF.XObjectExt();
oFF.FileSystemService.prototype._ff_c = "FileSystemService";

oFF.FileSystemService.FILES = "Files";
oFF.FileSystemService.NAME = "Name";
oFF.FileSystemService.TYPE = "Type";
oFF.FileSystemService.IS_EXECUTABLE = "IsExecutable";
oFF.FileSystemService.TYPE_DIR = "Dir";
oFF.FileSystemService.TYPE_FILE = "File";
oFF.FileSystemService.EXISTING = "Existing";
oFF.FileSystemService.prototype.m_env = null;
oFF.FileSystemService.prototype.m_kernelBase = null;
oFF.FileSystemService.prototype.initServerContainer = function(environment)
{
	this.m_env = environment;
	this.m_kernelBase = oFF.Kernel.create(environment);
	var session = this.m_kernelBase.getKernelProcessBase();
	session.newWorkingTaskManager(oFF.WorkingTaskManagerType.SINGLE_THREADED);
};
oFF.FileSystemService.prototype.onHttpRequest = function(serverRequestResponse)
{
	var response = serverRequestResponse.newServerResponse();
	var clientRequest = serverRequestResponse.getClientRequest();
	var envExtParameters = oFF.XHashMapOfStringByString.create();
	envExtParameters.putAll(this.m_env);
	var user = clientRequest.getUser();
	if (oFF.notNull(user))
	{
		envExtParameters.put(oFF.XEnvironmentConstants.FIREFLY_KERNEL_USER, user);
	}
	envExtParameters.put("ff_vfs", "true");
	var root = oFF.XFile.createExt(this.m_kernelBase.getSession(), "vfs:///", oFF.PathFormat.URL, oFF.VarResolveMode.NONE);
	var content = this.entryPoint(root, clientRequest);
	if (oFF.notNull(content))
	{
		response.setFromContent(content);
		response.setStatusCode(200);
	}
	else
	{
		response.setString("Oops, nothing found ");
		response.setContentType(oFF.ContentType.TEXT_PLAIN);
		response.setStatusCode(404);
	}
	serverRequestResponse.setResponse(response);
};
oFF.FileSystemService.prototype.entryPoint = function(root, clientRequest)
{
	var path = clientRequest.getRelativePath();
	if (oFF.XString.endsWith(path, "/"))
	{
		path = oFF.XStringUtils.concatenate2(path, ".index.json");
	}
	var tokens = oFF.XStringTokenizer.splitString(path, "/");
	var size = tokens.size();
	if (size > 0)
	{
		var fileContent = oFF.XContent.createContent();
		var targetFile;
		var lastElement = tokens.get(size - 1);
		lastElement = oFF.XString.toLowerCase(lastElement);
		if (oFF.XString.isEqual(lastElement, ".index.json"))
		{
			var lastSlash = oFF.XString.lastIndexOf(path, "/");
			var dirPath = oFF.XString.substring(path, 0, lastSlash);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(dirPath))
			{
				targetFile = root.newChild(dirPath);
			}
			else
			{
				targetFile = root;
			}
			var listFiles = this.listFiles(targetFile);
			fileContent.setJsonObject(listFiles);
			fileContent.setContentType(oFF.ContentType.APPLICATION_JSON);
			return fileContent;
		}
		else if (oFF.XString.isEqual(lastElement, ".info.json"))
		{
			var lastSlash2 = oFF.XString.lastIndexOf(path, "/");
			var dirPath2 = oFF.XString.substring(path, 0, lastSlash2);
			targetFile = root.newChild(dirPath2);
			var fileInfo = this.fileInfo(targetFile);
			fileContent.setJsonObject(fileInfo);
			fileContent.setContentType(oFF.ContentType.APPLICATION_JSON);
			return fileContent;
		}
		else
		{
			var vfsUri = root.getVfsUri();
			var childUri = oFF.XUri.createChild(vfsUri, path);
			childUri.setQuery(clientRequest.getQuery());
			targetFile = oFF.XFile.createByUri(root.getSession(), childUri);
			if (targetFile.isExisting() && targetFile.isFile())
			{
				var loadedFileContent = null;
				var messageCollection = null;
				if (targetFile.getFileType() === oFF.XFileType.PRG)
				{
					var extResult = targetFile.processExecute(oFF.SyncType.BLOCKING, null, null);
					loadedFileContent = targetFile.getFileContent();
					messageCollection = extResult;
				}
				else
				{
					loadedFileContent = targetFile.load();
					messageCollection = targetFile;
				}
				if (oFF.notNull(loadedFileContent) && messageCollection.isValid())
				{
					var wrapper = oFF.XContent.createContent();
					wrapper.setFromContent(loadedFileContent);
					var contentType = oFF.ContentType.lookupByFileEnding(lastElement);
					if (oFF.notNull(contentType))
					{
						wrapper.setContentType(contentType);
					}
					return wrapper;
				}
			}
		}
	}
	return null;
};
oFF.FileSystemService.prototype.fileInfo = function(file)
{
	var content = oFF.PrFactory.createStructure();
	this.addFileEntry(file, content);
	return content;
};
oFF.FileSystemService.prototype.listFiles = function(file)
{
	var content = oFF.PrFactory.createStructure();
	var files = content.putNewList(oFF.FileSystemService.FILES);
	if (file.isDirectory())
	{
		var children = file.getChildren();
		for (var i = 0; i < children.size(); i++)
		{
			var child = children.get(i);
			var childStructure = files.addNewStructure();
			this.addFileEntry(child, childStructure);
		}
	}
	return content;
};
oFF.FileSystemService.prototype.addFileEntry = function(file, content)
{
	content.putString(oFF.FileSystemService.NAME, file.getName());
	if (file.isExisting())
	{
		if (file.isDirectory())
		{
			content.putString(oFF.FileSystemService.TYPE, oFF.FileSystemService.TYPE_DIR);
		}
		else
		{
			content.putString(oFF.FileSystemService.TYPE, oFF.FileSystemService.TYPE_FILE);
		}
		if (file.isExecutable())
		{
			content.putBoolean(oFF.FileSystemService.IS_EXECUTABLE, true);
		}
	}
	else
	{
		content.putBoolean(oFF.FileSystemService.EXISTING, false);
	}
};

oFF.FileSystemServiceV2 = function() {};
oFF.FileSystemServiceV2.prototype = new oFF.XObjectExt();
oFF.FileSystemServiceV2.prototype._ff_c = "FileSystemServiceV2";

oFF.FileSystemServiceV2.prototype.m_env = null;
oFF.FileSystemServiceV2.prototype.m_kernelBase = null;
oFF.FileSystemServiceV2.prototype.initServerContainer = function(environment)
{
	this.m_env = environment;
	this.m_kernelBase = oFF.Kernel.create(environment);
	var session = this.m_kernelBase.getKernelProcessBase();
	session.newWorkingTaskManager(oFF.WorkingTaskManagerType.SINGLE_THREADED);
};
oFF.FileSystemServiceV2.prototype.onHttpRequest = function(serverRequestResponse)
{
	var response = serverRequestResponse.newServerResponse();
	var clientRequest = serverRequestResponse.getClientRequest();
	var envExtParameters = oFF.XHashMapOfStringByString.create();
	envExtParameters.putAll(this.m_env);
	var user = clientRequest.getUser();
	if (oFF.notNull(user))
	{
		envExtParameters.put(oFF.XEnvironmentConstants.FIREFLY_KERNEL_USER, user);
	}
	envExtParameters.put("ff_vfs", "true");
	this.validateClientRequest(clientRequest, response);
	if (response.getStatusCode() === 0)
	{
		var root = oFF.XFile.createExt(this.m_kernelBase.getSession(), "vfs:///", oFF.PathFormat.URL, oFF.VarResolveMode.NONE);
		var targetFile = this.entryPoint(root, clientRequest);
		if (!oFF.XString.isEqual(clientRequest.getQueryMap().getByKey(oFF.XRemoteHttpFileConstants.VFS), "false"))
		{
			var fileDescription = this.createFileDescription(targetFile);
			response.setJsonObject(fileDescription);
			response.setStatusCode(200);
			oFF.XLogger.println(oFF.XStringUtils.concatenate2("Result: ", oFF.PrUtils.serialize(fileDescription, false, false, 0)));
			oFF.XCollectionUtils.forEach(targetFile.getMessages(),  function(ixMessage){
				oFF.XLogger.println(oFF.XStringUtils.concatenate3(ixMessage.getSeverity().toString(), ": ", ixMessage.getText()));
			}.bind(this));
		}
		else
		{
			if (oFF.isNull(targetFile) || !targetFile.isExisting())
			{
				response.setStatusCode(oFF.HttpStatusCode.SC_NOT_FOUND);
			}
			else
			{
				var messageCollection = oFF.MessageManagerSimple.createMessageManager();
				var fileContent = this.getFileContent(targetFile, messageCollection);
				if (messageCollection.isValid())
				{
					response.setFromContent(fileContent);
					response.setStatusCode(oFF.HttpStatusCode.SC_OK);
				}
				else
				{
					response.setStatusCode(oFF.HttpStatusCode.SC_INTERNAL_SERVER_ERROR);
					response.setStatusCodeDetails(messageCollection.getSummary());
				}
			}
		}
	}
	serverRequestResponse.setResponse(response);
};
oFF.FileSystemServiceV2.prototype.entryPoint = function(root, clientRequest)
{
	var path = clientRequest.getRelativePath();
	var tokens = oFF.XStringTokenizer.splitString(path, "/");
	var size = tokens.size();
	var targetFile = null;
	if (size > 0)
	{
		var vfsUri = root.getVfsUri();
		var childUri = oFF.XUri.createChild(vfsUri, path);
		childUri.setQuery(clientRequest.getQuery());
		targetFile = oFF.XFile.createByUri(root.getSession(), childUri);
		var httpMethod = clientRequest.getMethod();
		var buffer = oFF.XStringBuffer.create();
		buffer.append("Processing ").append(childUri.toString()).append(" Method=").append(httpMethod.getName()).append(", resolved to native '").append(targetFile.getNativePath()).append("'");
		oFF.XLogger.println(buffer.toString());
		if (httpMethod === oFF.HttpRequestMethod.HTTP_POST)
		{
			var fileDescriptionForUpdate = clientRequest.getJsonContent().asStructure();
			oFF.XLogger.println("Update from:");
			oFF.XLogger.println(clientRequest.getStringContentWithCharset(-1));
			var isDir = oFF.XString.isEqual(fileDescriptionForUpdate.getStringByKey(oFF.XRemoteHttpFileConstants.FILE_TYPE), oFF.XRemoteHttpFileConstants.FILE_TYPE_DIR);
			if (!targetFile.isExisting())
			{
				if (isDir)
				{
					targetFile.mkdirs();
				}
				else
				{
					var parent = targetFile.getParent();
					parent.mkdirs();
					if (!parent.isValid())
					{
						targetFile.addAllMessages(parent);
					}
				}
			}
			if (!isDir)
			{
				var stringByKey = fileDescriptionForUpdate.getStringByKey(oFF.XRemoteHttpFileConstants.CONTENT);
				if (oFF.notNull(stringByKey))
				{
					targetFile.saveByteArray(oFF.XByteArray.convertFromString(stringByKey));
				}
			}
			var newName = fileDescriptionForUpdate.getStringByKey(oFF.XRemoteHttpFileConstants.NEW_FILE_NAME);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(newName))
			{
				var renamedFile = targetFile.rename(newName);
				if (renamedFile.isValid())
				{
					targetFile = renamedFile;
				}
				else
				{
					oFF.XLogger.println(renamedFile.getSummary());
					targetFile.addAllMessages(renamedFile);
				}
			}
		}
		else if (httpMethod === oFF.HttpRequestMethod.HTTP_DELETE)
		{
			if (targetFile.isExisting())
			{
				if (targetFile.isDirectory())
				{
					targetFile.deleteRecursive();
				}
				else
				{
					targetFile.deleteFile();
				}
			}
		}
	}
	return targetFile;
};
oFF.FileSystemServiceV2.prototype.validateClientRequest = function(clientRequest, response)
{
	response.setStatusCode(0);
};
oFF.FileSystemServiceV2.prototype.createFileDescription = function(targetFile)
{
	var fileDesc = oFF.PrFactory.createStructure();
	this.addFileEntry(targetFile, fileDesc);
	this.addErrorMessages(targetFile, fileDesc);
	if (targetFile.isExisting())
	{
		var directory = targetFile.isDirectory();
		if (directory)
		{
			fileDesc.put(oFF.XRemoteHttpFileConstants.CHILDREN, this.listFiles(targetFile));
		}
		else
		{
			var messageCollection = oFF.MessageManagerSimple.createMessageManager();
			var loadedFileContent = this.getFileContent(targetFile, messageCollection);
			if (oFF.notNull(loadedFileContent) && messageCollection.isValid())
			{
				var contentType = loadedFileContent.getContentType();
				fileDesc.putString(oFF.XRemoteHttpFileConstants.CONTENT_TYPE, contentType.getName());
				var contentString = contentType.isTypeOf(oFF.ContentType.BINARY) ? oFF.XByteArray.convertToString(loadedFileContent.getByteArray()) : loadedFileContent.getString();
				fileDesc.putString(oFF.XRemoteHttpFileConstants.CONTENT, contentString);
			}
		}
	}
	return fileDesc;
};
oFF.FileSystemServiceV2.prototype.addErrorMessages = function(targetFile, fileDesc)
{
	var messages = targetFile.getMessages();
	if (oFF.XCollectionUtils.hasElements(messages))
	{
		var messageList = fileDesc.putNewList("Messages");
		var messageStructure = oFF.PrFactory.createStructure();
		messageStructure.putString("Text", "File operation failed");
		messageStructure.putString("Type", oFF.Severity.ERROR.getName());
		messageStructure.putInteger("Code", oFF.ErrorCodes.SYSTEM_IO_WRITE_ACCESS);
		messageList.add(messageStructure);
		oFF.XStream.of(messages).forEach( function(message){
			oFF.XLogger.println(message.getText());
		}.bind(this));
	}
};
oFF.FileSystemServiceV2.prototype.getFileContent = function(targetFile, messageCollection)
{
	var loadedFileContent;
	if (targetFile.getFileType() === oFF.XFileType.PRG)
	{
		var extResult = targetFile.processExecute(oFF.SyncType.BLOCKING, null, null);
		loadedFileContent = targetFile.getFileContent();
		messageCollection.addAllMessages(extResult);
	}
	else
	{
		loadedFileContent = targetFile.load();
		messageCollection.addAllMessages(targetFile);
	}
	return loadedFileContent;
};
oFF.FileSystemServiceV2.prototype.listFiles = function(file)
{
	var files = oFF.PrFactory.createList();
	if (file.isDirectory())
	{
		var children = file.getChildren();
		for (var i = 0; i < children.size(); i++)
		{
			var child = children.get(i);
			var childStructure = files.addNewStructure();
			this.addFileEntry(child, childStructure);
		}
	}
	return files;
};
oFF.FileSystemServiceV2.prototype.addFileEntry = function(file, content)
{
	content.putString(oFF.XRemoteHttpFileConstants.FILE_NAME, file.getName());
	if (file.isExisting())
	{
		content.putBoolean(oFF.XRemoteHttpFileConstants.EXISTS, true);
		content.putString(oFF.XRemoteHttpFileConstants.FILE_TYPE, file.isDirectory() ? oFF.XRemoteHttpFileConstants.FILE_TYPE_DIR : oFF.XRemoteHttpFileConstants.FILE_TYPE_FILE);
		if (file.isExecutable())
		{
			content.putBoolean(oFF.XRemoteHttpFileConstants.EXECUTABLE, true);
		}
	}
	else
	{
		content.putBoolean(oFF.XRemoteHttpFileConstants.EXISTS, false);
	}
};

oFF.DfApplication = function() {};
oFF.DfApplication.prototype = new oFF.DfProcessContext();
oFF.DfApplication.prototype._ff_c = "DfApplication";

oFF.DfApplication.prototype.m_undoManager = null;
oFF.DfApplication.prototype.m_releaseProcess = false;
oFF.DfApplication.prototype.m_olapEnvironment = null;
oFF.DfApplication.prototype.m_serviceRegistry = null;
oFF.DfApplication.prototype.m_dataProviders = null;
oFF.DfApplication.prototype.m_subApplications = null;
oFF.DfApplication.prototype.m_bindingManager = null;
oFF.DfApplication.prototype.m_version = null;
oFF.DfApplication.prototype.m_identifier = null;
oFF.DfApplication.prototype.m_component = null;
oFF.DfApplication.prototype.m_storyId = null;
oFF.DfApplication.prototype.m_storyName = null;
oFF.DfApplication.prototype.m_languageLocale = null;
oFF.DfApplication.prototype.setup = function()
{
	oFF.DfProcessContext.prototype.setup.call( this );
	this.m_dataProviders = oFF.XList.create();
	this.m_subApplications = oFF.XList.create();
	this.m_serviceRegistry = oFF.XHashMapByString.create();
};
oFF.DfApplication.prototype.releaseObject = function()
{
	this.m_subApplications = oFF.XObjectExt.release(this.m_subApplications);
	this.m_serviceRegistry = oFF.XObjectExt.release(this.m_serviceRegistry);
	this.m_bindingManager = oFF.XObjectExt.release(this.m_bindingManager);
	this.m_version = null;
	this.m_identifier = null;
	this.m_component = null;
	this.m_storyId = null;
	this.m_storyName = null;
	this.m_languageLocale = null;
	if (this.m_releaseProcess)
	{
		oFF.XObjectExt.release(this.getProcess());
	}
	oFF.DfProcessContext.prototype.releaseObject.call( this );
};
oFF.DfApplication.prototype.releaseManagedObjects = function()
{
	if (!this.isReleased())
	{
		this.releaseAllSubApplications();
		this.releaseDataProviders();
		this.m_dataProviders = oFF.XObjectExt.release(this.m_dataProviders);
		this.releaseServices();
		this.m_olapEnvironment = oFF.XObjectExt.release(this.m_olapEnvironment);
	}
};
oFF.DfApplication.prototype.setClientInfo = function(version, identifier, component)
{
	this.m_version = version;
	this.m_identifier = identifier;
	this.m_component = component;
};
oFF.DfApplication.prototype.getClientComponent = function()
{
	return this.m_component;
};
oFF.DfApplication.prototype.getClientVersion = function()
{
	return this.m_version;
};
oFF.DfApplication.prototype.getClientIdentifier = function()
{
	return this.m_identifier;
};
oFF.DfApplication.prototype.setWidgetId = function(widgetId) {};
oFF.DfApplication.prototype.getWidgetId = function()
{
	return null;
};
oFF.DfApplication.prototype.clearClientInfo = function()
{
	this.m_version = null;
	this.m_identifier = null;
	this.m_component = null;
	this.m_storyId = null;
	this.m_storyName = null;
	this.m_languageLocale = null;
};
oFF.DfApplication.prototype.getOlapEnvironment = function()
{
	return this.getDocument("DefaultOlapEnvironment", oFF.XComponentType._DATASOURCE);
};
oFF.DfApplication.prototype.getDocument = function(name, type)
{
	if (oFF.isNull(this.m_olapEnvironment))
	{
		this.m_olapEnvironment = oFF.OlapEnvironmentFactory.newInstance(this);
	}
	return this.m_olapEnvironment;
};
oFF.DfApplication.prototype.releaseDataProviders = function()
{
	if (oFF.notNull(this.m_dataProviders))
	{
		while (this.m_dataProviders.size() > 0)
		{
			var count = this.m_dataProviders.size();
			var dataProvider = this.m_dataProviders.get(0);
			oFF.XObjectExt.release(dataProvider);
			if (count === this.m_dataProviders.size())
			{
				throw oFF.XException.createIllegalStateException("DataProvider was not correctly released from storage");
			}
		}
	}
};
oFF.DfApplication.prototype.releaseServices = function()
{
	if (oFF.notNull(this.m_serviceRegistry))
	{
		var keys = this.m_serviceRegistry.getKeysAsReadOnlyListOfString();
		for (var idxKey = 0; idxKey < keys.size(); idxKey++)
		{
			var key = keys.get(idxKey);
			var services = this.m_serviceRegistry.getByKey(key);
			if (oFF.notNull(services) && !services.isReleased())
			{
				for (var idxService = services.size() - 1; idxService > -1; idxService--)
				{
					var service = services.get(idxService);
					oFF.XObjectExt.release(service);
				}
				services.clear();
				oFF.XObjectExt.release(services);
			}
		}
		this.m_serviceRegistry.clear();
	}
};
oFF.DfApplication.prototype.getDataProviders = function()
{
	return this.m_dataProviders;
};
oFF.DfApplication.prototype.registerDataProvider = function(dataProvider)
{
	if (oFF.notNull(dataProvider))
	{
		this.m_dataProviders.add(dataProvider);
	}
};
oFF.DfApplication.prototype.unregisterDataProvider = function(dataProvider)
{
	if (oFF.notNull(dataProvider))
	{
		this.m_dataProviders.removeElement(dataProvider);
	}
};
oFF.DfApplication.prototype.getReferenceNameFromService = function(service)
{
	if (oFF.notNull(service))
	{
		var serviceConfig = service.getServiceConfig();
		if (oFF.notNull(serviceConfig))
		{
			var serviceTypeInfo = serviceConfig.getServiceTypeInfo();
			if (oFF.notNull(serviceTypeInfo))
			{
				return serviceTypeInfo.getServiceReferenceName();
			}
		}
	}
	return null;
};
oFF.DfApplication.prototype.registerService = function(service)
{
	var serviceName = this.getReferenceNameFromService(service);
	if (oFF.notNull(serviceName))
	{
		var services = this.m_serviceRegistry.getByKey(serviceName);
		if (oFF.isNull(services))
		{
			services = oFF.XList.create();
			this.m_serviceRegistry.put(serviceName, services);
		}
		for (var i = 0; i < services.size(); i++)
		{
			var existingService = services.get(i);
			if (service === existingService)
			{
				return;
			}
		}
		services.add(service);
	}
};
oFF.DfApplication.prototype.unregisterService = function(service)
{
	var serviceName = this.getReferenceNameFromService(service);
	if (oFF.notNull(serviceName))
	{
		if (oFF.notNull(this.m_serviceRegistry))
		{
			var services = this.m_serviceRegistry.getByKey(serviceName);
			if (oFF.notNull(services) && !services.isReleased())
			{
				for (var i = 0; i < services.size(); i++)
				{
					var existingService = services.get(i);
					if (service === existingService)
					{
						services.removeAt(i);
						break;
					}
				}
			}
		}
	}
};
oFF.DfApplication.prototype.getServices = function(serviceType)
{
	if (oFF.notNull(serviceType))
	{
		var serviceName = serviceType.getServiceReferenceName();
		if (oFF.notNull(serviceName))
		{
			if (oFF.notNull(this.m_serviceRegistry))
			{
				var services = this.m_serviceRegistry.getByKey(serviceName);
				if (oFF.notNull(services) && services.size() > 0)
				{
					return services;
				}
			}
		}
	}
	return null;
};
oFF.DfApplication.prototype.newSubApplication = function(process)
{
	var subApplication = oFF.SubApplication.create(this, process);
	this.m_subApplications.add(subApplication);
	return subApplication;
};
oFF.DfApplication.prototype.releaseAllSubApplications = function()
{
	if (oFF.notNull(this.m_subApplications))
	{
		while (this.m_subApplications.size() > 0)
		{
			var count = this.m_subApplications.size();
			var subApplication = this.m_subApplications.get(0);
			oFF.XObjectExt.release(subApplication);
			if (count === this.m_subApplications.size())
			{
				throw oFF.XException.createIllegalStateException("DataProvider was not correctly released from storage");
			}
		}
	}
};
oFF.DfApplication.prototype.unregisterSubApplication = function(subApplication)
{
	var index = this.m_subApplications.getIndex(subApplication);
	if (index !== -1)
	{
		this.m_subApplications.removeAt(index);
	}
};
oFF.DfApplication.prototype.createNextInstanceId = function()
{
	return oFF.XGuid.getGuid();
};
oFF.DfApplication.prototype.selectProviderComponents = function(operation, defaultDomain, contextObject, maximumCount)
{
	var domain = operation.getDomain();
	if (oFF.isNull(domain) || domain === oFF.SigSelDomain.CONTEXT)
	{
		domain = defaultDomain;
	}
	if (domain === oFF.SigSelDomain.DATA)
	{
		var components = oFF.XList.create();
		var operationType = operation.getOperationType();
		var dataProviders = this.getDataProviders();
		if (operationType === oFF.SigSelType.MATCH_NAME)
		{
			var name = operation.getName();
			for (var k = 0; k < dataProviders.size(); k++)
			{
				var dp = dataProviders.get(k);
				var componentType = dp.getComponentType();
				if (oFF.XString.isEqual(name, dp.getDataProviderName()) && componentType.isTypeOf(oFF.IoComponentType.DATA_PROVIDER))
				{
					components.add(dp);
					break;
				}
			}
		}
		else if (operationType === oFF.SigSelType.MATCH)
		{
			var selectedComponentType = operation.getSelectedComponentType();
			if (oFF.notNull(selectedComponentType))
			{
				for (var m = 0; m < dataProviders.size() && (maximumCount === -1 || components.size() < maximumCount); m++)
				{
					var dp2 = dataProviders.get(m);
					var componentType2 = dp2.getComponentType();
					if (componentType2.isTypeOf(selectedComponentType))
					{
						components.add(dp2);
					}
				}
			}
		}
		return components;
	}
	return null;
};
oFF.DfApplication.prototype.setStoryId = function(storyId)
{
	this.m_storyId = storyId;
};
oFF.DfApplication.prototype.getStoryId = function()
{
	return this.m_storyId;
};
oFF.DfApplication.prototype.setStoryName = function(storyName)
{
	this.m_storyName = storyName;
};
oFF.DfApplication.prototype.getStoryName = function()
{
	return this.m_storyName;
};
oFF.DfApplication.prototype.setLanguageLocale = function(languageLocale)
{
	this.m_languageLocale = languageLocale;
};
oFF.DfApplication.prototype.getLanguageLocale = function()
{
	return this.m_languageLocale;
};
oFF.DfApplication.prototype.setDefaultSyncType = function(syncType)
{
	this.getProcess().setDefaultSyncType(syncType);
};
oFF.DfApplication.prototype.setProcessExt = function(process, releaseSession)
{
	this.setProcess(process);
	this.m_releaseProcess = releaseSession;
	var selector = process.getSelector();
	selector.registerSelector(oFF.SigSelDomain.DATA, this);
	this.m_undoManager = oFF.UndoManager.create(this);
	this.m_bindingManager = oFF.DpBindingManager.create(process);
	process.setEntity(oFF.ProcessEntity.APPLICATION, this);
};
oFF.DfApplication.prototype.getDefaultSyncType = function()
{
	return this.getProcess().getDefaultSyncType();
};
oFF.DfApplication.prototype.getXVersion = function()
{
	return this.getProcess().getXVersion();
};
oFF.DfApplication.prototype.getBindingManager = function()
{
	return this.m_bindingManager;
};
oFF.DfApplication.prototype.getHttpExchangeEnhancer = function()
{
	return this.getSession().getHttpExchangeEnhancer();
};
oFF.DfApplication.prototype.getUiManager = function()
{
	return this.getUiManagerExt(true);
};
oFF.DfApplication.prototype.getUndoManager = function()
{
	return this.m_undoManager;
};

oFF.RepoMountPoint = function() {};
oFF.RepoMountPoint.prototype = new oFF.DfNameObject();
oFF.RepoMountPoint.prototype._ff_c = "RepoMountPoint";

oFF.RepoMountPoint.createConditional = function(session, type, name, url)
{
	var uri = oFF.XUri.createFromFileSystemPath(session, url, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
	if (oFF.notNull(uri))
	{
		return oFF.RepoMountPoint.create(type, name, uri);
	}
	else
	{
		return null;
	}
};
oFF.RepoMountPoint.create = function(type, name, uri)
{
	var newObj = new oFF.RepoMountPoint();
	newObj.setupExt(type, name, uri);
	return newObj;
};
oFF.RepoMountPoint.prototype.m_uri = null;
oFF.RepoMountPoint.prototype.m_type = null;
oFF.RepoMountPoint.prototype.setupExt = function(type, name, uri)
{
	this._setupInternal(name);
	this.m_uri = uri;
	this.m_type = type;
};
oFF.RepoMountPoint.prototype.getUri = function()
{
	return this.m_uri;
};
oFF.RepoMountPoint.prototype.getMountType = function()
{
	return this.m_type;
};

oFF.RepositoryManager = function() {};
oFF.RepositoryManager.prototype = new oFF.DfApplicationContext();
oFF.RepositoryManager.prototype._ff_c = "RepositoryManager";

oFF.RepositoryManager.create = function(application)
{
	var rm = new oFF.RepositoryManager();
	rm.setupApplicationContext(application);
	return rm;
};
oFF.RepositoryManager.prototype.m_location = null;
oFF.RepositoryManager.prototype.setupApplicationContext = function(application)
{
	oFF.DfApplicationContext.prototype.setupApplicationContext.call( this , application);
};
oFF.RepositoryManager.prototype.getLocation = function()
{
	return this.m_location;
};
oFF.RepositoryManager.prototype.setLocation = function(location)
{
	this.m_location = location;
};
oFF.RepositoryManager.prototype.newRpcFunction = function(uri)
{
	var application = this.getApplication();
	var repositoryManager = application.getRepositoryManager();
	var repositoryLocation = repositoryManager.getLocation();
	var uriObj;
	if (oFF.isNull(repositoryLocation))
	{
		uriObj = oFF.XUri.createFromUrl(uri);
	}
	else
	{
		uriObj = oFF.XUri.createFromUrlWithParent(uri, repositoryLocation, false);
	}
	var systemUriString = uriObj.getUrlStringExt(true, true, true, true, true, false, false, false);
	var systemUri = oFF.XUri.createFromUrl(systemUriString);
	var rpcUriString = uriObj.getUrlStringExt(false, false, false, false, false, true, true, true);
	var systemLandscape = application.getSystemLandscape();
	var tempSystemName = oFF.XStringUtils.concatenate3("##Tmp#", oFF.XGuid.getGuid(), "##");
	systemLandscape.setSystemByUri(tempSystemName, systemUri, oFF.SystemType.GENERIC);
	var connection = application.getConnection(tempSystemName);
	var rpcFunction = connection.newRpcFunction(rpcUriString);
	var request = rpcFunction.getRpcRequest();
	request.setMethod(oFF.HttpRequestMethod.HTTP_GET);
	return rpcFunction;
};

oFF.UndoManager = function() {};
oFF.UndoManager.prototype = new oFF.DfApplicationContext();
oFF.UndoManager.prototype._ff_c = "UndoManager";

oFF.UndoManager.create = function(application)
{
	var newObj = new oFF.UndoManager();
	newObj.setupApplicationContext(application);
	application.getSession().registerInterruptStepListener(newObj, null);
	newObj.m_undoStates = oFF.XListOfString.create();
	newObj.m_redoStates = oFF.XListOfString.create();
	newObj.m_listeners = oFF.XList.create();
	return newObj;
};
oFF.UndoManager.prototype.m_undoStates = null;
oFF.UndoManager.prototype.m_redoStates = null;
oFF.UndoManager.prototype.m_listeners = null;
oFF.UndoManager.prototype.stackSize = 0;
oFF.UndoManager.prototype.processUndo = function(syncType, listener, customerIdentifier)
{
	var stateId = null;
	var size = this.m_undoStates.size();
	if (size > 1)
	{
		this.m_redoStates.add(this.m_undoStates.removeAt(size - 1));
		stateId = this.m_undoStates.get(size - 2);
	}
	this.logStates(stateId);
	var action = oFF.UndoRedoAction.createAndRun(syncType, this, listener, customerIdentifier, stateId, this.getApplication().getOlapEnvironment());
	this.notifyListener();
	return action;
};
oFF.UndoManager.prototype.processRedo = function(syncType, listener, customerIdentifier)
{
	var stateId = null;
	var size = this.m_redoStates.size();
	if (size > 0)
	{
		stateId = this.m_redoStates.removeAt(size - 1);
		this.m_undoStates.add(stateId);
	}
	this.logStates(stateId);
	var action = oFF.UndoRedoAction.createAndRun(syncType, this, listener, customerIdentifier, stateId, this.getApplication().getOlapEnvironment());
	this.notifyListener();
	return action;
};
oFF.UndoManager.prototype.getAvailableUndoStepCount = function()
{
	return oFF.XMath.max(this.m_undoStates.size() - 1, 0);
};
oFF.UndoManager.prototype.getAvailableRedoStepCount = function()
{
	return this.m_redoStates.size();
};
oFF.UndoManager.prototype.registerUndoManagerListener = function(listener)
{
	this.m_listeners.add(listener);
};
oFF.UndoManager.prototype.unregisterUndoManagerListener = function(listener)
{
	this.m_listeners.removeElement(listener);
};
oFF.UndoManager.prototype.onInterruptStepStart = function(step, customIdentifier)
{
	if (this.m_undoStates.isEmpty())
	{
		this.onInterruptStepEnd(step, customIdentifier);
	}
	else
	{
		var currentStateId = this.m_undoStates.get(this.m_undoStates.size() - 1);
		this.getApplication().getOlapEnvironment().getDocumentStateManager().updateDocumentState(currentStateId);
	}
};
oFF.UndoManager.prototype.onInterruptStepEnd = function(step, customIdentifier)
{
	var newState = this.getApplication().getOlapEnvironment().getDocumentStateManager().recordDocumentState();
	this.clear(this.m_redoStates);
	this.m_undoStates.add(newState);
	this.logStates(newState);
	this.updateStack();
	this.notifyListener();
};
oFF.UndoManager.prototype.reset = function()
{
	this.clear(this.m_redoStates);
	this.clear(this.m_undoStates);
};
oFF.UndoManager.prototype.setMaxAvailableSteps = function(maxSteps)
{
	this.stackSize = maxSteps;
	this.updateStack();
};
oFF.UndoManager.prototype.updateStack = function()
{
	if (this.stackSize > 0)
	{
		while (this.m_undoStates.size() - 1 > this.stackSize)
		{
			var stateId = this.m_undoStates.removeAt(0);
			this.getApplication().getOlapEnvironment().getDocumentStateManager().clearDocumentState(stateId);
		}
	}
};
oFF.UndoManager.prototype.logStates = function(stateId)
{
	this.getSession().getLogger().log(oFF.XStringUtils.concatenate2("UndoManager: new currentState ->", stateId));
};
oFF.UndoManager.prototype.notifyListener = function()
{
	var size = this.m_listeners.size();
	for (var i = 0; i < size; i++)
	{
		this.m_listeners.get(i).undoManagerStateChanged();
	}
};
oFF.UndoManager.prototype.clear = function(states)
{
	var iterator = states.getIterator();
	while (iterator.hasNext())
	{
		this.getApplication().getOlapEnvironment().getDocumentStateManager().clearDocumentState(iterator.next());
	}
	states.clear();
};
oFF.UndoManager.prototype.dump = function()
{
	var documentStateManager = this.getApplication().getOlapEnvironment().getDocumentStateManager();
	var state = oFF.PrFactory.createStructure();
	var undoStates = state.putNewList("UndoStates");
	var undoCount = this.m_undoStates.size();
	for (var i = undoCount - 1; i >= 0; i--)
	{
		undoStates.add(documentStateManager.dumpState(this.m_undoStates.get(i)));
	}
	var redoStates = state.putNewList("RedoStates");
	var redoCount = this.m_redoStates.size();
	for (var j = redoCount - 1; j >= 0; j--)
	{
		redoStates.add(documentStateManager.dumpState(this.m_redoStates.get(j)));
	}
	return oFF.PrUtils.serialize(state, false, true, 2);
};

oFF.ApplicationSystemOption = function() {};
oFF.ApplicationSystemOption.prototype = new oFF.XConstant();
oFF.ApplicationSystemOption.prototype._ff_c = "ApplicationSystemOption";

oFF.ApplicationSystemOption.NONE = null;
oFF.ApplicationSystemOption.AUTO = null;
oFF.ApplicationSystemOption.PATH = null;
oFF.ApplicationSystemOption.LOCATION_AND_TYPE = null;
oFF.ApplicationSystemOption.staticSetup = function()
{
	oFF.ApplicationSystemOption.NONE = oFF.XConstant.setupName(new oFF.ApplicationSystemOption(), "None");
	oFF.ApplicationSystemOption.AUTO = oFF.XConstant.setupName(new oFF.ApplicationSystemOption(), "Auto");
	oFF.ApplicationSystemOption.PATH = oFF.XConstant.setupName(new oFF.ApplicationSystemOption(), "Path");
	oFF.ApplicationSystemOption.LOCATION_AND_TYPE = oFF.XConstant.setupName(new oFF.ApplicationSystemOption(), "LocationAndType");
};

oFF.Application = function() {};
oFF.Application.prototype = new oFF.DfApplication();
oFF.Application.prototype._ff_c = "Application";

oFF.Application.create = function(process, version)
{
	var application = new oFF.Application();
	application.setupApplication(process, version);
	return application;
};
oFF.Application.prototype.m_applicationName = null;
oFF.Application.prototype.m_applicationId = null;
oFF.Application.prototype.m_messageManager = null;
oFF.Application.prototype.m_userManager = null;
oFF.Application.prototype.m_repositoryManager = null;
oFF.Application.prototype.m_connectionPool = null;
oFF.Application.prototype.m_systemLandscape = null;
oFF.Application.prototype.m_uiManager = null;
oFF.Application.prototype.m_sendBottleMessages = 0;
oFF.Application.prototype.setupApplication = function(process, version)
{
	this.setup();
	this.setProcessExt(process, false);
	this.setErrorManager(oFF.MessageManager.createMessageManagerExt(process));
	this.m_repositoryManager = oFF.RepositoryManager.create(this);
	this.m_userManager = oFF.RuntimeUserManager.create(process);
	this.m_applicationId = oFF.XGuid.getGuid();
	process.setEntity(oFF.ProcessEntity.USER_MANAGER, this.m_userManager);
	this.m_connectionPool = oFF.ConnectionPool.create(process);
	process.setEntity(oFF.ProcessEntity.CONNECTION_POOL, this.m_connectionPool);
};
oFF.Application.prototype.releaseObject = function()
{
	this.releaseManagedObjects();
	if (this.isReleased() === false)
	{
		this.m_connectionPool = oFF.XObjectExt.release(this.m_connectionPool);
		this.m_messageManager = oFF.XObjectExt.release(this.m_messageManager);
		this.m_systemLandscape = null;
		this.m_uiManager = null;
		this.m_userManager = null;
		this.m_repositoryManager = null;
		this.m_applicationName = null;
	}
	oFF.DfApplication.prototype.releaseObject.call( this );
};
oFF.Application.prototype.processBooting = oFF.noSupport;
oFF.Application.prototype.getErrorManager = function()
{
	return this.m_messageManager;
};
oFF.Application.prototype.setErrorManager = function(errorManager)
{
	this.m_messageManager = errorManager;
};
oFF.Application.prototype.getSystemLandscape = function()
{
	return this.m_systemLandscape;
};
oFF.Application.prototype.setSystemLandscape = function(systemLandscape)
{
	this.m_systemLandscape = systemLandscape;
	var process = this.getProcess();
	process.setEntity(oFF.ProcessEntity.SYSTEM_LANDSCAPE, systemLandscape);
};
oFF.Application.prototype.getConnectionPool = function()
{
	return this.m_connectionPool;
};
oFF.Application.prototype.getConnection = function(systemName)
{
	return this.m_connectionPool.getConnection(systemName);
};
oFF.Application.prototype.getSystemConnect = function(systemName)
{
	return this.m_connectionPool.getSystemConnect(systemName);
};
oFF.Application.prototype.getRepositoryManager = function()
{
	return this.m_repositoryManager;
};
oFF.Application.prototype.getUiManagerExt = function(createIfNotExist)
{
	if (oFF.isNull(this.m_uiManager) && createIfNotExist === true)
	{
		var subSystem = this.getProcess().openSubSystem(oFF.SubSystemType.GUI);
		this.m_uiManager = subSystem.getMainApi();
	}
	if (oFF.isNull(this.m_uiManager))
	{
		var process = this.getProcess();
		while (oFF.notNull(process) && oFF.isNull(this.m_uiManager))
		{
			this.m_uiManager = process.getSubSystem(oFF.SubSystemType.GUI);
			process = process.getParentProcess();
		}
	}
	return this.m_uiManager;
};
oFF.Application.prototype.setUiManager = function(uiManager)
{
	this.m_uiManager = uiManager;
};
oFF.Application.prototype.getApplicationName = function()
{
	return this.m_applicationName;
};
oFF.Application.prototype.setApplicationName = function(name)
{
	this.m_applicationName = name;
	var process = this.getProcess();
	process.setApplicationName(name);
};
oFF.Application.prototype.isSapStatisticsEnabled = function()
{
	return this.getSession().isSapStatisticsEnabled();
};
oFF.Application.prototype.setSapStatisticsEnabled = function(enabled)
{
	this.getSession().setSapStatisticsEnabled(enabled);
};
oFF.Application.prototype.getUserManager = function()
{
	return this.m_userManager;
};
oFF.Application.prototype.getSyncManager = function()
{
	return this;
};
oFF.Application.prototype.receiveMessage = function(message)
{
	var messageElement = oFF.JsonParserFactory.createFromString(message);
	var pool = this.getConnectionPool();
	var connList = messageElement.getListByKey("Connections");
	for (var i = 0; i < connList.size(); i++)
	{
		var sys = connList.getStructureAt(i);
		var sysName = sys.getStringByKey("SysName");
		var sharedConnections = sys.getListByKey("Shared");
		for (var k = 0; k < sharedConnections.size(); k++)
		{
			var sharedConnInfo = sharedConnections.getStructureAt(k);
			var name = sharedConnInfo.getStringByKey("Name");
			var csrfToken = sharedConnInfo.getStringByKey("CsrfToken");
			var sessionUrlRewrite = sharedConnInfo.getStringByKey("SessionUrlRewrite");
			pool.setExternalSharedConnection(sysName, name, csrfToken, sessionUrlRewrite);
		}
	}
};
oFF.Application.prototype.prepareMessage = function()
{
	var messageElement = oFF.PrFactory.createStructure();
	messageElement.putString("AppId", this.m_applicationId);
	messageElement.putString("Time", oFF.XDateTime.createCurrentLocalDateTime().toIso8601Format());
	messageElement.putInteger("Number", this.m_sendBottleMessages);
	var pool = this.getConnectionPool();
	var activeSystems = pool.getActiveSystems();
	var connList = messageElement.putNewList("Connections");
	for (var i = 0; i < activeSystems.size(); i++)
	{
		var sysName = activeSystems.get(i);
		var openConnections = pool.getOpenConnections(sysName);
		var openConnCount = openConnections.size();
		var sys = connList.addNewStructure();
		sys.putString("SysName", sysName);
		sys.putInteger("OpenConn", openConnCount);
		var shared = sys.putNewList("Shared");
		for (var k = 0; k < openConnCount; k++)
		{
			var currentConnection = openConnections.get(k);
			if (currentConnection.isShared() && currentConnection.useSessionUrlRewrite() && oFF.XStringUtils.isNotNullAndNotEmpty(currentConnection.getSessionUrlRewrite()))
			{
				var element = shared.addNewStructure();
				element.putString("Name", currentConnection.getName());
				element.putString("CsrfToken", currentConnection.getCsrfToken());
				element.putString("SessionUrlRewrite", currentConnection.getSessionUrlRewrite());
			}
		}
	}
	var messageInABottle = oFF.PrUtils.serialize(messageElement, false, false, 0);
	return messageInABottle;
};
oFF.Application.prototype.toString = function()
{
	var sb = oFF.XStringBuffer.create();
	sb.appendLine("Application");
	if (oFF.notNull(this.m_messageManager))
	{
		sb.appendNewLine();
		sb.append(this.m_messageManager.toString());
	}
	return sb.toString();
};

oFF.SubApplication = function() {};
oFF.SubApplication.prototype = new oFF.DfApplication();
oFF.SubApplication.prototype._ff_c = "SubApplication";

oFF.SubApplication.create = function(parentApplication, process)
{
	var application = new oFF.SubApplication();
	application.setupSubApplication(parentApplication, process);
	return application;
};
oFF.SubApplication.prototype.m_parentApplication = null;
oFF.SubApplication.prototype.m_subUiManager = null;
oFF.SubApplication.prototype.setupSubApplication = function(parentApplication, process)
{
	oFF.DfApplication.prototype.setup.call( this );
	var subSession = process;
	if (oFF.isNull(subSession))
	{
		var parentProcess = parentApplication.getProcess();
		subSession = parentProcess.newChildProcess(oFF.ProcessType.SERVICE);
	}
	this.setProcessExt(subSession, true);
	this.m_parentApplication = parentApplication;
	this.m_undoManager = oFF.UndoManager.create(this);
};
oFF.SubApplication.prototype.releaseObject = function()
{
	this.releaseManagedObjects();
	this.m_subUiManager = oFF.XObjectExt.release(this.m_subUiManager);
	this.m_parentApplication.unregisterSubApplication(this);
	this.m_parentApplication = null;
	oFF.DfApplication.prototype.releaseObject.call( this );
};
oFF.SubApplication.prototype.getUserManager = function()
{
	return this.m_parentApplication.getUserManager();
};
oFF.SubApplication.prototype.getConnectionPool = function()
{
	return this.m_parentApplication.getConnectionPool();
};
oFF.SubApplication.prototype.getConnection = function(systemName)
{
	return this.m_parentApplication.getConnection(systemName);
};
oFF.SubApplication.prototype.getSystemConnect = function(systemName)
{
	return this.m_parentApplication.getSystemConnect(systemName);
};
oFF.SubApplication.prototype.getRepositoryManager = function()
{
	return this.m_parentApplication.getRepositoryManager();
};
oFF.SubApplication.prototype.getUiManagerExt = function(createIfNotExist)
{
	if (oFF.isNull(this.m_subUiManager))
	{
		var uiManager = this.m_parentApplication.getUiManagerExt(createIfNotExist);
		this.m_subUiManager = uiManager;
	}
	return this.m_subUiManager;
};
oFF.SubApplication.prototype.setUiManager = function(uiManager)
{
	this.m_subUiManager = uiManager;
};
oFF.SubApplication.prototype.setSapStatisticsEnabled = function(enabled)
{
	this.m_parentApplication.setSapStatisticsEnabled(enabled);
};
oFF.SubApplication.prototype.isSapStatisticsEnabled = function()
{
	return this.m_parentApplication.isSapStatisticsEnabled();
};
oFF.SubApplication.prototype.setApplicationName = function(name)
{
	this.m_parentApplication.setApplicationName(name);
};
oFF.SubApplication.prototype.getApplicationName = function()
{
	return this.m_parentApplication.getApplicationName();
};
oFF.SubApplication.prototype.setErrorManager = function(errorManager)
{
	this.m_parentApplication.setErrorManager(errorManager);
};
oFF.SubApplication.prototype.getErrorManager = function()
{
	return this.m_parentApplication.getErrorManager();
};
oFF.SubApplication.prototype.setSystemLandscape = function(systemLandscape)
{
	this.m_parentApplication.setSystemLandscape(systemLandscape);
};
oFF.SubApplication.prototype.getSystemLandscape = function()
{
	return this.m_parentApplication.getSystemLandscape();
};
oFF.SubApplication.prototype.getSyncManager = function()
{
	return this.m_parentApplication.getSyncManager();
};
oFF.SubApplication.prototype.processBooting = oFF.noSupport;
oFF.SubApplication.prototype.getUndoManager = function()
{
	return this.m_undoManager;
};

oFF.DfApplicationProgram = function() {};
oFF.DfApplicationProgram.prototype = new oFF.DfProgram();
oFF.DfApplicationProgram.prototype._ff_c = "DfApplicationProgram";

oFF.DfApplicationProgram.PARAM_TRACE_NAME = "TraceName";
oFF.DfApplicationProgram.PARAM_ENABLE_CACHES = "EnableCaches";
oFF.DfApplicationProgram.PARAM_SYS_USE_MIRRORS = "UseMirrors";
oFF.DfApplicationProgram.prototype.m_releaseApplication = false;
oFF.DfApplicationProgram.prototype.m_application = null;
oFF.DfApplicationProgram.prototype.m_traceName = null;
oFF.DfApplicationProgram.prototype.m_useMirrors = false;
oFF.DfApplicationProgram.prototype.m_masterSystemName = null;
oFF.DfApplicationProgram.prototype.m_systemLandscapePath = null;
oFF.DfApplicationProgram.prototype.m_systemOption = null;
oFF.DfApplicationProgram.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addOption(oFF.DfApplicationProgram.PARAM_TRACE_NAME, "The trace name", "name", oFF.XValueType.STRING);
	metadata.addOption(oFF.DfApplicationProgram.PARAM_ENABLE_CACHES, "Enables the cache", "true|false", oFF.XValueType.BOOLEAN);
	metadata.addOption(oFF.DfApplicationProgram.PARAM_SYS_USE_MIRRORS, "Using the system mirrors", "true|false", oFF.XValueType.BOOLEAN);
	metadata.addOption(oFF.DfProgram.PARAM_SYS_LANDSCAPE, "The system landscape", "true|false", oFF.XValueType.BOOLEAN);
};
oFF.DfApplicationProgram.prototype.setup = function()
{
	oFF.DfProgram.prototype.setup.call( this );
	this.m_useMirrors = false;
	this.m_masterSystemName = "gipsy";
	this.m_systemOption = oFF.ApplicationSystemOption.NONE;
};
oFF.DfApplicationProgram.prototype.releaseObject = function()
{
	this.m_traceName = null;
	if (this.m_releaseApplication === true)
	{
		this.m_application = oFF.XObjectExt.release(this.m_application);
	}
	oFF.DfProgram.prototype.releaseObject.call( this );
};
oFF.DfApplicationProgram.prototype.getComponentType = function()
{
	return oFF.RuntimeComponentType.APPLICATION_PROGRAM;
};
oFF.DfApplicationProgram.prototype.initializeProgram = function()
{
	oFF.DfProgram.prototype.initializeProgram.call( this );
	if (this.isShowHelp() === false)
	{
		if (this.getApplication() === null)
		{
			var process = this.getProcess();
			var extResult;
			var systemOption = this.getSystemOption();
			var systemLandscapeUrl = this.getSystemLandscapeUrl();
			var initialSystemType = this.getInitialSystemType();
			if (systemOption === oFF.ApplicationSystemOption.LOCATION_AND_TYPE && oFF.notNull(initialSystemType))
			{
				extResult = oFF.ApplicationFactory.createApplicationExt2(oFF.SyncType.BLOCKING, null, null, null, process, oFF.XVersion.MAX, initialSystemType, "master", null, null, systemOption, false, null);
				this.setApplicationExt(extResult.getData(), true);
				oFF.XObjectExt.release(extResult);
			}
			else if (systemOption === oFF.ApplicationSystemOption.PATH && oFF.notNull(systemLandscapeUrl))
			{
				extResult = oFF.ApplicationFactory.createApplicationExt2(oFF.SyncType.BLOCKING, null, null, null, process, oFF.XVersion.MAX, null, null, null, systemLandscapeUrl, oFF.ApplicationSystemOption.PATH, false, null);
				if (extResult.hasErrors())
				{
					this.log("Error during application initialization");
					this.log(extResult.getSummary());
				}
				else
				{
					this.setApplicationExt(extResult.getData(), true);
					var systemLandscape = this.getApplication().getSystemLandscape();
					var masterSystemName = this.getMasterSystemName();
					if (oFF.notNull(masterSystemName))
					{
						systemLandscape.setDefaultSystemName(oFF.SystemRole.MASTER, masterSystemName);
					}
					if (this.useMirrors())
					{
						systemLandscape.replaceOriginsWithMirror();
					}
				}
				oFF.XObjectExt.release(extResult);
			}
			var application2 = this.getApplication();
			if (oFF.isNull(application2))
			{
				extResult = oFF.ApplicationFactory.createApplicationExt2(oFF.SyncType.BLOCKING, null, null, null, process, oFF.XVersion.MAX, null, null, null, null, oFF.ApplicationSystemOption.NONE, false, null);
				this.setApplicationExt(extResult.getData(), true);
				oFF.XObjectExt.release(extResult);
			}
			if (oFF.notNull(application2))
			{
				if (oFF.notNull(this.m_traceName))
				{
					application2.setApplicationName(this.m_traceName);
					var connectionPool = application2.getConnectionPool();
					var systemNames = application2.getSystemLandscape().getSystemNames();
					for (var t = 0; t < systemNames.size(); t++)
					{
						var traceInfo = oFF.TraceInfo.create();
						traceInfo.setTraceType(oFF.TraceType.URL);
						traceInfo.setTraceName(this.m_traceName);
						connectionPool.setTraceInfo(systemNames.get(t), traceInfo);
					}
				}
			}
		}
	}
};
oFF.DfApplicationProgram.prototype.evalArguments = function()
{
	oFF.DfProgram.prototype.evalArguments.call( this );
	var initArguments = this.getArgumentStructure();
	this.m_traceName = initArguments.getStringByKeyExt(oFF.DfApplicationProgram.PARAM_TRACE_NAME, this.m_traceName);
	this.m_useMirrors = initArguments.getBooleanByKeyExt(oFF.DfApplicationProgram.PARAM_SYS_USE_MIRRORS, this.m_useMirrors);
	this.m_systemLandscapePath = initArguments.getStringByKeyExt(oFF.DfProgram.PARAM_SYS_LANDSCAPE, this.m_systemLandscapePath);
	if (oFF.isNull(this.m_systemOption))
	{
		if (oFF.notNull(this.m_systemLandscapePath))
		{
			this.m_systemOption = oFF.ApplicationSystemOption.PATH;
		}
		else if (this.getInitialSystemType() !== null)
		{
			this.m_systemOption = oFF.ApplicationSystemOption.LOCATION_AND_TYPE;
		}
		else
		{
			this.m_systemOption = oFF.ApplicationSystemOption.NONE;
		}
	}
};
oFF.DfApplicationProgram.prototype.setApplication = function(application)
{
	this.setApplicationExt(application, false);
};
oFF.DfApplicationProgram.prototype.setApplicationExt = function(application, releaseApplication)
{
	if (oFF.notNull(application) && this.getSession() === null)
	{
		this.setProcess(application.getProcess());
	}
	this.m_application = application;
	this.m_releaseApplication = releaseApplication;
};
oFF.DfApplicationProgram.prototype.getApplication = function()
{
	return this.m_application;
};
oFF.DfApplicationProgram.prototype.getTraceName = function()
{
	return this.m_traceName;
};
oFF.DfApplicationProgram.prototype.setTraceName = function(traceName)
{
	this.m_traceName = traceName;
};
oFF.DfApplicationProgram.prototype.useMirrors = function()
{
	return this.m_useMirrors;
};
oFF.DfApplicationProgram.prototype.setUseMirrors = function(useMirrors)
{
	this.m_useMirrors = useMirrors;
};
oFF.DfApplicationProgram.prototype.getMasterSystemName = function()
{
	return this.m_masterSystemName;
};
oFF.DfApplicationProgram.prototype.setMasterSystemName = function(masterSystemName)
{
	this.m_masterSystemName = masterSystemName;
};
oFF.DfApplicationProgram.prototype.getSystemLandscapeUrl = function()
{
	return this.m_systemLandscapePath;
};
oFF.DfApplicationProgram.prototype.setSystemLandscapeUrl = function(url)
{
	this.m_systemLandscapePath = url;
};
oFF.DfApplicationProgram.prototype.getSystemOption = function()
{
	return this.m_systemOption;
};
oFF.DfApplicationProgram.prototype.setSystemOption = function(option)
{
	this.m_systemOption = option;
};

oFF.RepoMountType = function() {};
oFF.RepoMountType.prototype = new oFF.XConstant();
oFF.RepoMountType.prototype._ff_c = "RepoMountType";

oFF.RepoMountType.FILE = null;
oFF.RepoMountType.staticSetup = function()
{
	oFF.RepoMountType.FILE = oFF.XConstant.setupName(new oFF.RepoMountType(), "File");
};

oFF.ApplicationInitializeAction = function() {};
oFF.ApplicationInitializeAction.prototype = new oFF.SyncAction();
oFF.ApplicationInitializeAction.prototype._ff_c = "ApplicationInitializeAction";

oFF.ApplicationInitializeAction.create = function()
{
	var object = new oFF.ApplicationInitializeAction();
	object.setupActionExt(oFF.SyncType.NON_BLOCKING, null, null, null, oFF.XVersion.MAX, null, null, null, null, oFF.ApplicationSystemOption.AUTO, true);
	return object;
};
oFF.ApplicationInitializeAction.prototype.m_application = null;
oFF.ApplicationInitializeAction.prototype.m_xVersion = 0;
oFF.ApplicationInitializeAction.prototype.m_systemLandscapeUrl = null;
oFF.ApplicationInitializeAction.prototype.m_systemName = null;
oFF.ApplicationInitializeAction.prototype.m_systemUri = null;
oFF.ApplicationInitializeAction.prototype.m_systemType = null;
oFF.ApplicationInitializeAction.prototype.m_systemOption = null;
oFF.ApplicationInitializeAction.prototype.m_useKernelBoot = false;
oFF.ApplicationInitializeAction.prototype.m_kernel = null;
oFF.ApplicationInitializeAction.prototype.m_programName = null;
oFF.ApplicationInitializeAction.prototype.m_useSingleKernel = false;
oFF.ApplicationInitializeAction.prototype.setupActionExt = function(syncType, listener, customIdentifier, process, xVersion, systemType, systemName, systemUri, systemLandscapeUrl, systemOption, useKernelBoot)
{
	this.setupAction(syncType, listener, customIdentifier, process);
	this.m_xVersion = xVersion;
	this.m_systemLandscapeUrl = systemLandscapeUrl;
	this.m_systemName = systemName;
	this.m_systemUri = systemUri;
	this.m_systemType = systemType;
	this.m_systemOption = systemOption;
	this.m_useKernelBoot = useKernelBoot;
	this.m_programName = oFF.StandardAppProgram.DEFAULT_PROGRAM_NAME;
};
oFF.ApplicationInitializeAction.prototype.releaseObject = function()
{
	this.m_systemName = null;
	this.m_systemUri = null;
	this.m_systemType = null;
	this.m_application = null;
	this.m_xVersion = 0;
	this.m_systemOption = null;
	oFF.SyncAction.prototype.releaseObject.call( this );
};
oFF.ApplicationInitializeAction.prototype.processSynchronization = function(syncType)
{
	var doCont;
	var process = this.getActionContext();
	if (this.m_useKernelBoot === true)
	{
		var kernelBooter = oFF.KernelBoot.createByName(this.m_programName);
		kernelBooter.setDefaultSyncType(syncType);
		kernelBooter.setXVersion(this.m_xVersion);
		kernelBooter.addProgramStartedListener(this);
		kernelBooter.setKernel(this.m_kernel);
		if (oFF.isNull(process))
		{
			if (oFF.notNull(this.m_systemLandscapeUrl))
			{
				kernelBooter.setSystemLandscapeUrl(this.m_systemLandscapeUrl);
			}
		}
		else
		{
			var kernel = process.getKernel();
			kernelBooter.setKernel(kernel);
		}
		kernelBooter.runFull();
		doCont = syncType === oFF.SyncType.NON_BLOCKING;
	}
	else
	{
		if (oFF.isNull(process))
		{
			process = oFF.DefaultSession.createWithVersion(this.m_xVersion);
			if (oFF.notNull(syncType))
			{
				process.setDefaultSyncType(syncType);
			}
		}
		this.m_application = oFF.Application.create(process, process.getXVersion());
		if (this.m_systemOption !== oFF.ApplicationSystemOption.NONE)
		{
			var kernelSystemLandscape = process.getSystemLandscape();
			if (oFF.isNull(kernelSystemLandscape))
			{
				var environment = process.getEnvironment();
				if (oFF.isNull(this.m_systemLandscapeUrl))
				{
					this.m_systemLandscapeUrl = environment.getVariable(oFF.XEnvironmentConstants.SYSTEM_LANDSCAPE_URI);
				}
				if (oFF.isNull(this.m_systemUri) && oFF.isNull(this.m_systemName))
				{
					var masterSysUrl = environment.getVariable(oFF.XEnvironmentConstants.FIREFLY_MASTER_SYSTEM_URI);
					if (oFF.XStringUtils.isNotNullAndNotEmpty(masterSysUrl))
					{
						this.m_systemUri = oFF.XUri.createFromUrl(masterSysUrl);
						if (oFF.XStringUtils.isNullOrEmpty(this.m_systemName))
						{
							this.m_systemName = "master";
						}
					}
				}
			}
		}
		if (this.m_systemOption !== oFF.ApplicationSystemOption.NONE && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_systemLandscapeUrl))
		{
			var systemLandscape = oFF.StandaloneSystemLandscape.create(this.m_application);
			this.m_application.setSystemLandscape(systemLandscape);
			var uri = oFF.XUri.createFromFileSystemPath(process, this.m_systemLandscapeUrl, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
			oFF.SystemLandscapeLoadAction.createAndRun(syncType, this, null, this.m_application, systemLandscape, this.m_application.getConnectionPool(), uri);
			doCont = true;
		}
		else
		{
			this.configureLandscape();
			doCont = false;
		}
	}
	return doCont;
};
oFF.ApplicationInitializeAction.prototype.onLandscapeNodeLoaded = function(extResult, landscape, customIdentifier)
{
	this.addAllMessages(extResult);
	this.configureLandscape();
};
oFF.ApplicationInitializeAction.prototype.onProgramStarted = function(extResult, program, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		var process = program.getProcess();
		this.m_application = process.getApplication();
	}
	this.configureLandscape();
};
oFF.ApplicationInitializeAction.prototype.configureLandscape = function()
{
	if (oFF.notNull(this.m_application))
	{
		var location = oFF.NetworkEnv.getLocation();
		var systemLandscape = this.m_application.getSystemLandscape();
		if (this.m_systemOption !== oFF.ApplicationSystemOption.NONE && oFF.notNull(systemLandscape) || oFF.notNull(this.m_systemUri) || oFF.notNull(location) && oFF.notNull(this.m_systemType))
		{
			if (oFF.isNull(systemLandscape))
			{
				systemLandscape = oFF.StandaloneSystemLandscape.create(this.m_application);
				this.m_application.setSystemLandscape(systemLandscape);
			}
			if (systemLandscape.getMasterSystemName() === null)
			{
				var usingMasterName = this.m_systemName;
				if (oFF.isNull(usingMasterName))
				{
					usingMasterName = "master";
				}
				if (oFF.notNull(this.m_systemUri))
				{
					systemLandscape.setSystemByUri(usingMasterName, this.m_systemUri, null);
				}
				else if (oFF.notNull(location) && oFF.notNull(this.m_systemType))
				{
					var system = systemLandscape.createSystem();
					system.setSystemType(this.m_systemType);
					var scheme = location.getScheme();
					if (oFF.notNull(scheme))
					{
						if (oFF.XString.startsWith(scheme, "https"))
						{
							system.setProtocolType(oFF.ProtocolType.HTTPS);
						}
						else
						{
							system.setProtocolType(oFF.ProtocolType.HTTP);
						}
					}
					system.setSystemName(usingMasterName);
					system.setSystemText(usingMasterName);
					system.setHost(location.getHost());
					system.setPort(location.getPort());
					systemLandscape.setSystemByDescription(system);
				}
				else
				{
					var systemNames = systemLandscape.getSystemNames();
					if (systemNames.size() === 1)
					{
						usingMasterName = systemNames.get(0);
					}
					else
					{
						usingMasterName = null;
					}
				}
				if (oFF.notNull(usingMasterName))
				{
					systemLandscape.setMasterSystemName(usingMasterName);
				}
			}
		}
		else
		{
			var systemLandscapeFromKernel = this.m_application.getProcess().getSystemLandscape();
			this.m_application.setSystemLandscape(systemLandscapeFromKernel);
		}
		this.setData(this.m_application);
	}
	this.endSync();
};
oFF.ApplicationInitializeAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onApplicationReady(extResult, data, customIdentifier);
};
oFF.ApplicationInitializeAction.prototype.registerListener = function(listener, customIdentifier)
{
	if (oFF.notNull(listener))
	{
		this.attachListener(listener, oFF.ListenerType.SPECIFIC, customIdentifier);
	}
};
oFF.ApplicationInitializeAction.prototype.setProcess = function(process)
{
	this.setActionContext(process);
	this.setSession(process);
};
oFF.ApplicationInitializeAction.prototype.getProcess = function()
{
	return this.getActionContext();
};
oFF.ApplicationInitializeAction.prototype.setXVersion = function(xVersion)
{
	this.m_xVersion = xVersion;
};
oFF.ApplicationInitializeAction.prototype.getXVersion = function()
{
	return this.m_xVersion;
};
oFF.ApplicationInitializeAction.prototype.setSystemType = function(systemType)
{
	this.m_systemType = systemType;
};
oFF.ApplicationInitializeAction.prototype.getSystemType = function()
{
	return this.m_systemType;
};
oFF.ApplicationInitializeAction.prototype.setSystemName = function(systemName)
{
	this.m_systemName = systemName;
};
oFF.ApplicationInitializeAction.prototype.getSystemName = function()
{
	return this.m_systemName;
};
oFF.ApplicationInitializeAction.prototype.setSystemUri = function(uri)
{
	this.m_systemUri = uri;
};
oFF.ApplicationInitializeAction.prototype.getSystemUri = function()
{
	return this.m_systemUri;
};
oFF.ApplicationInitializeAction.prototype.setSystemLandscapeUrl = function(url)
{
	this.m_systemLandscapeUrl = url;
};
oFF.ApplicationInitializeAction.prototype.getSystemLandscapeUrl = function()
{
	return this.m_systemLandscapeUrl;
};
oFF.ApplicationInitializeAction.prototype.getSystemOption = function()
{
	return this.m_systemOption;
};
oFF.ApplicationInitializeAction.prototype.setSystemOption = function(systemOption)
{
	this.m_systemOption = systemOption;
};
oFF.ApplicationInitializeAction.prototype.isUsingKernelBoot = function()
{
	return this.m_useKernelBoot;
};
oFF.ApplicationInitializeAction.prototype.setUseKernelBoot = function(useKernelBoot)
{
	this.m_useKernelBoot = useKernelBoot;
};
oFF.ApplicationInitializeAction.prototype.setKernel = function(kernel)
{
	this.m_kernel = kernel;
};
oFF.ApplicationInitializeAction.prototype.getKernel = function()
{
	return this.m_kernel;
};
oFF.ApplicationInitializeAction.prototype.setProgramName = function(programName)
{
	this.m_programName = programName;
};
oFF.ApplicationInitializeAction.prototype.getProgramName = function()
{
	return this.m_programName;
};
oFF.ApplicationInitializeAction.prototype.setUseSingleKernel = function(useSingleKernel)
{
	this.m_useSingleKernel = useSingleKernel;
};
oFF.ApplicationInitializeAction.prototype.useSingleKernel = function()
{
	return this.m_useSingleKernel;
};

oFF.DragonflyAppProgram = function() {};
oFF.DragonflyAppProgram.prototype = new oFF.DfApplicationProgram();
oFF.DragonflyAppProgram.prototype._ff_c = "DragonflyAppProgram";

oFF.DragonflyAppProgram.DEFAULT_PROGRAM_NAME = "DragonflyAppProgram";
oFF.DragonflyAppProgram.prototype.newProgram = function()
{
	var newPrg = new oFF.DragonflyAppProgram();
	newPrg.setup();
	return newPrg;
};
oFF.DragonflyAppProgram.prototype.runProcess = function()
{
	return true;
};

oFF.OrcaAppProgram = function() {};
oFF.OrcaAppProgram.prototype = new oFF.DfApplicationProgram();
oFF.OrcaAppProgram.prototype._ff_c = "OrcaAppProgram";

oFF.OrcaAppProgram.DEFAULT_PROGRAM_NAME = "OrcaAppProgram";
oFF.OrcaAppProgram.prototype.newProgram = function()
{
	var newPrg = new oFF.OrcaAppProgram();
	newPrg.setup();
	return newPrg;
};
oFF.OrcaAppProgram.prototype.runProcess = function()
{
	return true;
};

oFF.StandardAppProgram = function() {};
oFF.StandardAppProgram.prototype = new oFF.DfApplicationProgram();
oFF.StandardAppProgram.prototype._ff_c = "StandardAppProgram";

oFF.StandardAppProgram.DEFAULT_PROGRAM_NAME = "StandardAppProgram";
oFF.StandardAppProgram.prototype.newProgram = function()
{
	var newPrg = new oFF.StandardAppProgram();
	newPrg.setup();
	return newPrg;
};
oFF.StandardAppProgram.prototype.runProcess = function()
{
	return true;
};

oFF.DfService = function() {};
oFF.DfService.prototype = new oFF.SyncAction();
oFF.DfService.prototype._ff_c = "DfService";

oFF.DfService.prototype.m_connectionContainer = null;
oFF.DfService.prototype.m_isInRelease = false;
oFF.DfService.prototype.m_serviceConfig = null;
oFF.DfService.prototype.m_application = null;
oFF.DfService.prototype.setupService = function(serviceConfigInfo)
{
	this.setupAction(null, null, null, serviceConfigInfo);
	this.m_serviceConfig = serviceConfigInfo;
	this.m_application = serviceConfigInfo.getApplication();
	if (serviceConfigInfo.isSystemBoundService())
	{
		this.setConnection(serviceConfigInfo.getConnectionContainer());
	}
	this.registerServiceAtApplication();
};
oFF.DfService.prototype.releaseObject = function()
{
	if (!this.m_isInRelease)
	{
		this.m_isInRelease = true;
		this.unregisterServiceAtApplication();
		this.m_serviceConfig = oFF.XObjectExt.release(this.m_serviceConfig);
		this.m_connectionContainer = null;
		this.m_application = null;
		oFF.SyncAction.prototype.releaseObject.call( this );
	}
};
oFF.DfService.prototype.processInitialization = function(syncType, listener, customIdentifier)
{
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.DfService.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onServiceInitialized(extResult, data, customIdentifier);
};
oFF.DfService.prototype.requiresInitialization = function()
{
	return true;
};
oFF.DfService.prototype.registerServiceAtApplication = function()
{
	var application = this.getApplication();
	if (oFF.isNull(application))
	{
		return;
	}
	application.registerService(this);
};
oFF.DfService.prototype.unregisterServiceAtApplication = function()
{
	var application = this.getApplication();
	if (oFF.notNull(application))
	{
		application.unregisterService(this);
	}
};
oFF.DfService.prototype.isServiceConfigMatching = function(serviceConfig, connection, messages)
{
	return true;
};
oFF.DfService.prototype.getConnection = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_connectionContainer);
};
oFF.DfService.prototype.setConnection = function(connection)
{
	this.m_connectionContainer = oFF.XWeakReferenceUtil.getWeakRef(connection);
};
oFF.DfService.prototype.getServiceConfig = function()
{
	return this.m_serviceConfig;
};
oFF.DfService.prototype.getApplication = function()
{
	return this.m_application;
};

oFF.DfServiceConfig = function() {};
oFF.DfServiceConfig.prototype = new oFF.SyncAction();
oFF.DfServiceConfig.prototype._ff_c = "DfServiceConfig";

oFF.DfServiceConfig.prototype.m_application = null;
oFF.DfServiceConfig.prototype.m_name = null;
oFF.DfServiceConfig.prototype.m_connectionContainer = null;
oFF.DfServiceConfig.prototype.m_usePrivateConnection = false;
oFF.DfServiceConfig.prototype.m_connectionName = null;
oFF.DfServiceConfig.prototype.m_syncTypeForInitialization = null;
oFF.DfServiceConfig.prototype.m_serverMetadata = null;
oFF.DfServiceConfig.prototype.m_serviceType = null;
oFF.DfServiceConfig.prototype.m_systemName = null;
oFF.DfServiceConfig.prototype.m_requestTimeZone = null;
oFF.DfServiceConfig.prototype.m_serviceTemporary = null;
oFF.DfServiceConfig.prototype.m_isInRelease = false;
oFF.DfServiceConfig.prototype.m_tagging = null;
oFF.DfServiceConfig.prototype.m_useAsDataProvider = false;
oFF.DfServiceConfig.prototype.setupConfig = function(application)
{
	var listener = null;
	this.setupAction(null, listener, null, application);
	this.m_application = application;
	this.setAutoConvertDataToWeakRef(true);
	this.m_tagging = oFF.XHashMapOfStringByString.create();
	application.registerDataProvider(this);
};
oFF.DfServiceConfig.prototype.releaseObject = function()
{
	if (!this.m_isInRelease)
	{
		this.m_isInRelease = true;
		this.m_application.unregisterDataProvider(this);
		if (this.m_useAsDataProvider)
		{
			var data = this.getData();
			data = oFF.XObjectExt.release(data);
			this.setData(data);
		}
		this.m_application = null;
		this.m_tagging = null;
		this.m_connectionContainer = null;
		this.m_connectionName = null;
		this.m_serverMetadata = null;
		this.m_serviceTemporary = oFF.XObjectExt.release(this.m_serviceTemporary);
		this.m_serviceType = null;
		this.m_syncTypeForInitialization = null;
		this.m_systemName = null;
		this.m_requestTimeZone = null;
		oFF.SyncAction.prototype.releaseObject.call( this );
	}
};
oFF.DfServiceConfig.prototype.copyFromInternal = function(other, flags)
{
	var otherConfig = other;
	this.m_systemName = otherConfig.getSystemName();
	this.m_application = otherConfig.getApplication();
	this.m_requestTimeZone = otherConfig.getRequestTimeZone();
	this.m_useAsDataProvider = otherConfig.m_useAsDataProvider;
	this.m_tagging = otherConfig.m_tagging.createMapOfStringByStringCopy();
	this.m_syncTypeForInitialization = otherConfig.m_syncTypeForInitialization;
	this.m_serviceType = otherConfig.m_serviceType;
	this.m_connectionContainer = otherConfig.m_connectionContainer;
	this.m_connectionName = otherConfig.m_connectionName;
};
oFF.DfServiceConfig.prototype.getComponentType = function()
{
	return oFF.RuntimeComponentType.SERVICE_DATA_PROVIDER;
};
oFF.DfServiceConfig.prototype.getName = function()
{
	return this.m_name;
};
oFF.DfServiceConfig.prototype.setName = function(name)
{
	this.m_name = name;
};
oFF.DfServiceConfig.prototype.getDataProviderName = function()
{
	return this.m_name;
};
oFF.DfServiceConfig.prototype.setDataProviderName = function(name)
{
	this.m_name = name;
};
oFF.DfServiceConfig.prototype.getTagging = function()
{
	return this.m_tagging;
};
oFF.DfServiceConfig.prototype.processSynchronization = function(syncType)
{
	this.m_syncTypeForInitialization = syncType;
	this.prepareDefinition();
	if (this.isSystemBoundService())
	{
		var systemDescription = this.getSystemDescription();
		if (oFF.isNull(systemDescription))
		{
			this.addError(0, oFF.XStringUtils.concatenate2("Cannot find system description: ", this.getSystemName()));
			return false;
		}
		if (oFF.isNull(this.m_connectionContainer))
		{
			var connectionPool = this.getActionContext().getConnectionPool();
			this.m_connectionContainer = oFF.XWeakReferenceUtil.getWeakRef(connectionPool.getConnectionExt(systemDescription.getSystemName(), this.m_usePrivateConnection, this.m_connectionName));
		}
		var connectionContainer = this.getConnectionContainer();
		if (syncType === oFF.SyncType.BLOCKING)
		{
			var serverMetadataExt = connectionContainer.getSystemConnect().getServerMetadataExt(syncType, null, null);
			this.onServerMetadataLoaded(serverMetadataExt, serverMetadataExt.getData(), null);
		}
		else
		{
			connectionContainer.getSystemConnect().getServerMetadataExt(syncType, this, null);
		}
	}
	else
	{
		this.onServerMetadataLoaded(null, null, null);
	}
	return true;
};
oFF.DfServiceConfig.prototype.onServerMetadataLoaded = function(extResult, serverMetadata, customIdentifier)
{
	this.addAllMessages(extResult);
	this.m_serverMetadata = extResult;
	if (this.isSystemBoundService() && this.m_serverMetadata.hasErrors())
	{
		this.endSync();
		return;
	}
	var syncType = this.m_syncTypeForInitialization;
	this.m_syncTypeForInitialization = null;
	var serviceTypeInfo = this.getServiceTypeInfo();
	var serviceReferenceName = oFF.isNull(serviceTypeInfo) ? null : serviceTypeInfo.getServiceReferenceName();
	this.m_serviceTemporary = this.getMatchingServiceForServiceName(serviceReferenceName);
	if (oFF.isNull(this.m_serviceTemporary))
	{
		this.addError(oFF.ErrorCodes.SERVICE_NOT_FOUND, serviceReferenceName);
		this.endSync();
		return;
	}
	if (this.m_serviceTemporary.requiresInitialization())
	{
		var syncAction = this.m_serviceTemporary.processInitialization(syncType, this, null);
		if (oFF.isNull(syncAction))
		{
			this.setDataFromService(this.m_serviceTemporary);
			this.endSync();
		}
	}
	else
	{
		this.setDataFromService(this.m_serviceTemporary);
		this.endSync();
	}
};
oFF.DfServiceConfig.prototype.onServiceInitialized = function(extResult, service, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		this.setDataFromService(this.m_serviceTemporary);
	}
	this.endSync();
};
oFF.DfServiceConfig.prototype.endSync = function()
{
	this.m_serviceTemporary = null;
	oFF.SyncAction.prototype.endSync.call( this );
};
oFF.DfServiceConfig.prototype.getMatchingServiceForServiceName = function(serviceReferenceName)
{
	return oFF.ServiceUtils.getMatchingService(this, serviceReferenceName, this);
};
oFF.DfServiceConfig.prototype.hasSystemNameSet = function()
{
	return oFF.notNull(this.m_systemName);
};
oFF.DfServiceConfig.prototype.getSystemName = function()
{
	if (oFF.isNull(this.m_systemName))
	{
		this.m_systemName = this.getApplication().getSystemLandscape().getMasterSystemName();
	}
	return this.m_systemName;
};
oFF.DfServiceConfig.prototype.getSystemType = function()
{
	return this.getSystemDescription().getSystemType();
};
oFF.DfServiceConfig.prototype.setSystemName = function(systemName)
{
	this.m_systemName = systemName;
};
oFF.DfServiceConfig.prototype.isSystemBoundService = function()
{
	return true;
};
oFF.DfServiceConfig.prototype.getServiceTypeInfo = function()
{
	return this.m_serviceType;
};
oFF.DfServiceConfig.prototype.setServiceTypeInfo = function(serviceTypeInfo)
{
	this.m_serviceType = serviceTypeInfo;
};
oFF.DfServiceConfig.prototype.getApplication = function()
{
	return this.m_application;
};
oFF.DfServiceConfig.prototype.getSystemDescription = function()
{
	var application = this.getActionContext();
	var systemLandscape = application.getSystemLandscape();
	if (oFF.isNull(systemLandscape))
	{
		return null;
	}
	var systemName = this.getSystemName();
	if (oFF.isNull(systemName))
	{
		return systemLandscape.getMasterSystem();
	}
	return systemLandscape.getSystemDescription(systemName);
};
oFF.DfServiceConfig.prototype.processSyncAction = function(syncType, listener, customIdentifier)
{
	if (this.getSyncState().isInSync())
	{
		this.resetSyncState();
	}
	return oFF.SyncAction.prototype.processSyncAction.call( this , syncType, listener, customIdentifier);
};
oFF.DfServiceConfig.prototype.setConnectionContainer = function(connectionContainer)
{
	this.m_connectionContainer = oFF.XWeakReferenceUtil.getWeakRef(connectionContainer);
};
oFF.DfServiceConfig.prototype.getConnectionContainer = function()
{
	return oFF.XWeakReferenceUtil.getHardRef(this.m_connectionContainer);
};
oFF.DfServiceConfig.prototype.setConnectionName = function(name)
{
	this.m_connectionName = name;
};
oFF.DfServiceConfig.prototype.getConnectionName = function()
{
	return this.m_connectionName;
};
oFF.DfServiceConfig.prototype.usePrivateConnection = function(usePrivateConnection)
{
	this.m_usePrivateConnection = usePrivateConnection;
};
oFF.DfServiceConfig.prototype.hasPrivateConnection = function()
{
	return this.m_usePrivateConnection;
};
oFF.DfServiceConfig.prototype.setUseAsDataProvider = function(useAsDataProvider)
{
	this.m_useAsDataProvider = useAsDataProvider;
	this.setAutoConvertDataToWeakRef(!useAsDataProvider);
};
oFF.DfServiceConfig.prototype.isDataProviderUsage = function()
{
	return this.m_useAsDataProvider;
};
oFF.DfServiceConfig.prototype.prepareDefinition = function() {};
oFF.DfServiceConfig.prototype.setRequestTimeZone = function(requestTimeZone)
{
	this.m_requestTimeZone = requestTimeZone;
};
oFF.DfServiceConfig.prototype.isRequestTimeZoneSet = function()
{
	return oFF.notNull(this.m_requestTimeZone);
};
oFF.DfServiceConfig.prototype.getRequestTimeZone = function()
{
	return this.m_requestTimeZone;
};
oFF.DfServiceConfig.prototype.setDefaultTimeZone = function()
{
	this.m_requestTimeZone = oFF.XTimeZone.getCurrentTimeZoneString();
};

oFF.UndoRedoAction = function() {};
oFF.UndoRedoAction.prototype = new oFF.SyncAction();
oFF.UndoRedoAction.prototype._ff_c = "UndoRedoAction";

oFF.UndoRedoAction.createAndRun = function(syncType, context, listener, customIdentifier, stateId, document)
{
	var action = new oFF.UndoRedoAction();
	action.m_stateId = stateId;
	action.m_document = document;
	action.setupActionAndRun(syncType, listener, customIdentifier, context);
	return action;
};
oFF.UndoRedoAction.prototype.m_stateId = null;
oFF.UndoRedoAction.prototype.m_document = null;
oFF.UndoRedoAction.prototype.processSynchronization = function(syncType)
{
	if (oFF.isNull(this.m_stateId))
	{
		this.addError(1, "Undo not possible");
		return false;
	}
	else
	{
		var action = this.m_document.getDocumentStateManager().applyDocumentState(syncType, this, null, this.m_stateId);
		if (oFF.isNull(action))
		{
			this.addError(1000, "Undo failed");
			this.endSync();
			return false;
		}
	}
	return true;
};
oFF.UndoRedoAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.undoRedoActionFinished(extResult, data, customIdentifier);
};
oFF.UndoRedoAction.prototype.documentStateApplied = function(extResult, undoSupport, customIdentifier)
{
	if (extResult.hasErrors())
	{
		this.addAllMessages(extResult);
	}
	this.setData(extResult.getData());
	this.endSync();
};

oFF.RuntimeComponentType = function() {};
oFF.RuntimeComponentType.prototype = new oFF.XComponentType();
oFF.RuntimeComponentType.prototype._ff_c = "RuntimeComponentType";

oFF.RuntimeComponentType.APPLICATION = null;
oFF.RuntimeComponentType.SUB_APPLICATION = null;
oFF.RuntimeComponentType.SERVICE_DATA_PROVIDER = null;
oFF.RuntimeComponentType.APPLICATION_PROGRAM = null;
oFF.RuntimeComponentType.staticSetupRuntimeComponentTypes = function()
{
	oFF.RuntimeComponentType.APPLICATION = oFF.RuntimeComponentType.createRuntimeType("Application", oFF.XComponentType._ROOT);
	oFF.RuntimeComponentType.SUB_APPLICATION = oFF.RuntimeComponentType.createRuntimeType("SubApplication", oFF.XComponentType._ROOT);
	oFF.RuntimeComponentType.SERVICE_DATA_PROVIDER = oFF.RuntimeComponentType.createRuntimeType("ServiceDataProvider", oFF.IoComponentType.DATA_PROVIDER);
	oFF.RuntimeComponentType.APPLICATION_PROGRAM = oFF.RuntimeComponentType.createRuntimeType("ApplicationProgram", oFF.XComponentType.PROGRAM);
};
oFF.RuntimeComponentType.createRuntimeType = function(constant, parent)
{
	var mt = new oFF.RuntimeComponentType();
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

oFF.DfServiceConfigClassic = function() {};
oFF.DfServiceConfigClassic.prototype = new oFF.DfServiceConfig();
oFF.DfServiceConfigClassic.prototype._ff_c = "DfServiceConfigClassic";

oFF.DfServiceConfigClassic.prototype.processServiceCreation = function(syncType, listener, customIdentifier)
{
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.DfServiceConfigClassic.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	var myListener = listener;
	myListener.onServiceCreation(extResult, data, customIdentifier);
};
oFF.DfServiceConfigClassic.prototype.setDataFromService = function(service)
{
	this.setData(service);
};

oFF.RuntimeModule = function() {};
oFF.RuntimeModule.prototype = new oFF.DfModule();
oFF.RuntimeModule.prototype._ff_c = "RuntimeModule";

oFF.RuntimeModule.LISTENER_SERVICE_INCUBATOR = null;
oFF.RuntimeModule.LISTENER_SERVER_METADATA_VALID = null;
oFF.RuntimeModule.XS_REPOSITORY = "REPOSITORY";
oFF.RuntimeModule.s_module = null;
oFF.RuntimeModule.getInstance = function()
{
	if (oFF.isNull(oFF.RuntimeModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.IoExtModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.KernelImplModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.KernelNativeModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.BindingModule.getInstance());
		oFF.RuntimeModule.s_module = oFF.DfModule.startExt(new oFF.RuntimeModule());
		var registrationService = oFF.RegistrationService.getInstance();
		oFF.RuntimeModule.LISTENER_SERVICE_INCUBATOR = oFF.XStringValue.create("IServiceCreationListener");
		oFF.RuntimeModule.LISTENER_SERVER_METADATA_VALID = oFF.XStringValue.create("IServerMetadataListener");
		oFF.RuntimeComponentType.staticSetupRuntimeComponentTypes();
		oFF.OlapEnvironmentFactory.staticSetup();
		oFF.RepoMountType.staticSetup();
		oFF.ApplicationSystemOption.staticSetup();
		oFF.RpcHttpFunctionFactory.staticSetup();
		oFF.BatchRequestManagerInAFactory.staticSetupBatchInAFactory();
		oFF.NestedBatchRequestDecoratorProvider.staticSetup();
		registrationService.addReference(oFF.BatchRequestDecoratorFactory.BATCH_REQUEST_DECORATOR_PROVIDER, oFF.NestedBatchRequestDecoratorProvider.CLAZZ);
		oFF.DsrConstants.staticSetup();
		oFF.DsrPassport.staticSetup();
		oFF.DsrPassportFactory.staticSetup();
		oFF.ProgramRegistration.setProgramFactory(oFF.StandardAppProgram.DEFAULT_PROGRAM_NAME, new oFF.StandardAppProgram());
		oFF.ProgramRegistration.setProgramFactory(oFF.OrcaAppProgram.DEFAULT_PROGRAM_NAME, new oFF.OrcaAppProgram());
		oFF.ProgramRegistration.setProgramFactory(oFF.DragonflyAppProgram.DEFAULT_PROGRAM_NAME, new oFF.DragonflyAppProgram());
		oFF.DfModule.stopExt(oFF.RuntimeModule.s_module);
	}
	return oFF.RuntimeModule.s_module;
};
oFF.RuntimeModule.prototype.getName = function()
{
	return "ff2100.runtime";
};

oFF.RuntimeModule.getInstance();

return sap.firefly;
	} );