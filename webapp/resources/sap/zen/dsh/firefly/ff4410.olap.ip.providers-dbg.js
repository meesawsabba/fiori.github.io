/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
[
"sap/zen/dsh/firefly/ff4400.olap.providers","sap/zen/dsh/firefly/ff4315.olap.ip.impl"
],
function(oFF)
{
"use strict";

oFF.PlanningStateHandlerImpl = function() {};
oFF.PlanningStateHandlerImpl.prototype = new oFF.XObject();
oFF.PlanningStateHandlerImpl.prototype._ff_c = "PlanningStateHandlerImpl";

oFF.PlanningStateHandlerImpl.prototype.update = function(application, systemName, response, messageCollector)
{
	oFF.PlanningState.update(application, systemName, response, messageCollector);
};
oFF.PlanningStateHandlerImpl.prototype.updateFromResponse = function(application, systemName, request, response, messageCollector)
{
	oFF.PlanningState.updateFromResponse(application, systemName, request, response, messageCollector);
};
oFF.PlanningStateHandlerImpl.prototype.getDataAreaStateByName = function(application, systemName, dataArea)
{
	return oFF.DataAreaState.getDataAreaStateByName(application, systemName, dataArea);
};

oFF.PlanningVariableProcessorProviderFactory = function() {};
oFF.PlanningVariableProcessorProviderFactory.prototype = new oFF.XObject();
oFF.PlanningVariableProcessorProviderFactory.prototype._ff_c = "PlanningVariableProcessorProviderFactory";

oFF.PlanningVariableProcessorProviderFactory.staticSetup = function()
{
	oFF.PlanningCommandWithId.s_variableHelpProviderFactory = new oFF.PlanningVariableProcessorProviderFactory();
};
oFF.PlanningVariableProcessorProviderFactory.prototype.createVariableHelpProvider = function(planningCommandWithValueHelp)
{
	return oFF.InAPlanningValueHelpProvider.create(planningCommandWithValueHelp);
};
oFF.PlanningVariableProcessorProviderFactory.prototype.createProcessorProvider = function(dataSource, variableRequestor, requestorProvider)
{
	return oFF.InAPlanningVarProcessorProvider.createInAVariableProcessorProvider(dataSource, variableRequestor, requestorProvider);
};

oFF.InAPlanningCapabilitiesProviderFactory = function() {};
oFF.InAPlanningCapabilitiesProviderFactory.prototype = new oFF.XObject();
oFF.InAPlanningCapabilitiesProviderFactory.prototype._ff_c = "InAPlanningCapabilitiesProviderFactory";

oFF.InAPlanningCapabilitiesProviderFactory.staticSetup = function()
{
	oFF.PlanningService.s_capabilitiesProviderFactory = new oFF.InAPlanningCapabilitiesProviderFactory();
};
oFF.InAPlanningCapabilitiesProviderFactory.prototype.create = function(session, serverMetadata, providerType)
{
	return oFF.InACapabilitiesProvider.create(session, serverMetadata, providerType, null);
};

oFF.InAPlanningVarProvider = function() {};
oFF.InAPlanningVarProvider.prototype = new oFF.DfOlapEnvContext();
oFF.InAPlanningVarProvider.prototype._ff_c = "InAPlanningVarProvider";

oFF.InAPlanningVarProvider.prototype.m_connection = null;
oFF.InAPlanningVarProvider.prototype.m_activeMainCapabilities = null;
oFF.InAPlanningVarProvider.prototype.m_importVariables = null;
oFF.InAPlanningVarProvider.prototype.m_export = null;
oFF.InAPlanningVarProvider.prototype.m_isVariableSubmitNeeded = false;
oFF.InAPlanningVarProvider.prototype.m_supportsReInitVariables = false;
oFF.InAPlanningVarProvider.prototype.m_directVariableTransfer = false;
oFF.InAPlanningVarProvider.prototype.m_supportsCheckVariables = false;
oFF.InAPlanningVarProvider.prototype.m_supportsVariableMasking = false;
oFF.InAPlanningVarProvider.prototype.setupVariablesProvider = function(application, connection, activeMainCapabilities)
{
	this.setupOlapApplicationContext(application.getOlapEnvironment());
	this.m_connection = connection;
	this.m_activeMainCapabilities = activeMainCapabilities;
	var capabilityModel = oFF.QCapabilities.create();
	oFF.InACapabilitiesProvider.importCapabilities(activeMainCapabilities, capabilityModel);
	this.m_export = oFF.QInAExportFactory.createForData(application, capabilityModel);
	this.m_importVariables = oFF.QInAImportFactory.createForMetadata(application, capabilityModel);
	this.m_isVariableSubmitNeeded = true;
	this.m_supportsCheckVariables = true;
	this.m_supportsReInitVariables = capabilityModel.supportsReInitVariables();
	this.m_supportsVariableMasking = capabilityModel.supportsVariableMasking();
};
oFF.InAPlanningVarProvider.prototype.releaseObject = function()
{
	this.m_connection = null;
	this.m_activeMainCapabilities = null;
	this.m_export = oFF.XObjectExt.release(this.m_export);
	this.m_importVariables = oFF.XObjectExt.release(this.m_importVariables);
	oFF.DfOlapEnvContext.prototype.releaseObject.call( this );
};
oFF.InAPlanningVarProvider.prototype.getConnection = function()
{
	return this.m_connection;
};
oFF.InAPlanningVarProvider.prototype.getSystemDescription = function()
{
	return this.m_connection.getSystemDescription();
};
oFF.InAPlanningVarProvider.prototype.getSystemName = function()
{
	var systemDescription = this.getSystemDescription();
	if (oFF.isNull(systemDescription))
	{
		return null;
	}
	return systemDescription.getSystemName();
};
oFF.InAPlanningVarProvider.prototype.getSystemType = function()
{
	return this.getSystemDescription().getSystemType();
};
oFF.InAPlanningVarProvider.prototype.getRequestPath = function()
{
	var fastPathCap = this.m_activeMainCapabilities.getByKey(oFF.InACapabilities.C032_FAST_PATH);
	if (oFF.notNull(fastPathCap) && fastPathCap.getValue() !== null)
	{
		return fastPathCap.getValue();
	}
	var systemDescription = this.m_connection.getSystemDescription();
	return systemDescription.getSystemType().getInAPath();
};
oFF.InAPlanningVarProvider.prototype.createFunction = function()
{
	var path = this.getRequestPath();
	var ocpFunction = this.m_connection.newRpcFunction(path);
	var request = ocpFunction.getRpcRequest();
	request.setMethod(oFF.HttpRequestMethod.HTTP_POST);
	return ocpFunction;
};
oFF.InAPlanningVarProvider.prototype.getVariablesExporter = function()
{
	return this.m_export;
};
oFF.InAPlanningVarProvider.prototype.getVariablesImporter = function()
{
	return this.m_importVariables;
};
oFF.InAPlanningVarProvider.prototype.isVariableValuesRuntimeNeeded = function()
{
	return false;
};
oFF.InAPlanningVarProvider.prototype.isVariableSubmitNeeded = function()
{
	return this.m_isVariableSubmitNeeded;
};
oFF.InAPlanningVarProvider.prototype.setIsVariableSubmitNeeded = function(submit)
{
	this.m_isVariableSubmitNeeded = submit;
};
oFF.InAPlanningVarProvider.prototype.supportsReInitVariables = function()
{
	return this.m_supportsReInitVariables;
};
oFF.InAPlanningVarProvider.prototype.supportsVariableMasking = function()
{
	return this.m_supportsVariableMasking;
};
oFF.InAPlanningVarProvider.prototype.processRetrieveVariableRuntimeInformation = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.processSetGetVariableValues = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.processVariableSubmit = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.processReInitVariableAfterSubmit = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.processVariableCancel = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.importVariables = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.exportVariables = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.setDirectVariableTransfer = function(directVariableTransfer)
{
	this.m_directVariableTransfer = directVariableTransfer;
};
oFF.InAPlanningVarProvider.prototype.isDirectVariableTransfer = function()
{
	return this.m_directVariableTransfer;
};
oFF.InAPlanningVarProvider.prototype.supportsCheckVariables = function()
{
	return this.m_supportsCheckVariables && this.isDirectVariableTransfer();
};
oFF.InAPlanningVarProvider.prototype.processCheckVariables = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.supportsDirectVariableTransfer = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.processActivateVariableVariant = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.processDeleteVariableVariant = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.processUpdateVariableVariantValues = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.processSaveVariableVariant = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.processEmptyVariableDefinition = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.processUpdateDynamicVariables = oFF.noSupport;
oFF.InAPlanningVarProvider.prototype.processResetExitOrDynamicVariable = oFF.noSupport;

oFF.InAPlanningVarProcessorProvider = function() {};
oFF.InAPlanningVarProcessorProvider.prototype = new oFF.InAPlanningVarProvider();
oFF.InAPlanningVarProcessorProvider.prototype._ff_c = "InAPlanningVarProcessorProvider";

oFF.InAPlanningVarProcessorProvider.createInAVariableProcessorProvider = function(dataSource, variableRequestor, requestorProvider)
{
	var provider = new oFF.InAPlanningVarProcessorProvider();
	provider.setupInAVariableProcessorProvider(dataSource, variableRequestor, requestorProvider);
	return provider;
};
oFF.InAPlanningVarProcessorProvider.prototype.m_processor = null;
oFF.InAPlanningVarProcessorProvider.prototype.m_requestorProvider = null;
oFF.InAPlanningVarProcessorProvider.prototype.m_variableRequestorBase = null;
oFF.InAPlanningVarProcessorProvider.prototype.setupInAVariableProcessorProvider = function(dataSource, variableRequestorBase, requestorProvider)
{
	var application = variableRequestorBase.getApplication();
	var systemName = variableRequestorBase.getSystemName();
	var connection = application.getConnection(systemName);
	var serverMetadata;
	if (connection.getSession().hasFeature(oFF.FeatureToggleOlap.SERVER_METADATA_VIA_SYSTEM_CONNECT))
	{
		serverMetadata = connection.getSystemConnect().getServerMetadata();
	}
	else
	{
		serverMetadata = connection.getServerMetadata();
	}
	var capabilities = serverMetadata.getMetadataForService(oFF.ServerService.ANALYTIC);
	this.setupVariablesProvider(application, connection, capabilities);
	this.m_requestorProvider = requestorProvider;
	this.m_variableRequestorBase = variableRequestorBase;
	var context = this.getOlapEnv().getContext();
	this.m_processor = oFF.QVariableProcessor.createVariableProcessor(context, dataSource, this, this.m_variableRequestorBase);
	this.m_variableRequestorBase.setVariableProcessorBase(this.m_processor);
};
oFF.InAPlanningVarProcessorProvider.prototype.releaseObject = function()
{
	this.m_processor = oFF.XObjectExt.release(this.m_processor);
	this.m_requestorProvider = null;
	this.m_variableRequestorBase = null;
	oFF.InAPlanningVarProvider.prototype.releaseObject.call( this );
};
oFF.InAPlanningVarProcessorProvider.prototype.importVariables = function(variablesList, variableContext)
{
	var wrapper = oFF.PrFactory.createStructure();
	wrapper.put("Variables", variablesList);
	this.m_importVariables.importVariables(wrapper, variableContext);
};
oFF.InAPlanningVarProcessorProvider.prototype.exportVariables = function(variablesContext, parentStructure)
{
	var variableList = this.m_export.exportVariableList(variablesContext);
	parentStructure.putNotNullAndNotEmpty("Variables", variableList);
};
oFF.InAPlanningVarProcessorProvider.prototype.processRetrieveVariableRuntimeInformation = function(syncType, listener, customIdentifier)
{
	return oFF.InAPlanningVarGetRuntimeInfoAction.createAndRun(this, syncType, listener, customIdentifier);
};
oFF.InAPlanningVarProcessorProvider.prototype.processSetGetVariableValues = function(syncType, listener, customIdentifier)
{
	return oFF.InAPlanningVarSetGetValuesAction.createAndRun(this, syncType, listener, customIdentifier);
};
oFF.InAPlanningVarProcessorProvider.prototype.processVariableSubmit = function(syncType, listener, customIdentifier)
{
	return oFF.InAPlanningVarSubmitAction.createAndRun(this, syncType, listener, customIdentifier);
};
oFF.InAPlanningVarProcessorProvider.prototype.processReInitVariableAfterSubmit = function(syncType, listener, customIdentifier)
{
	return oFF.InAPlanningVarReInitAfterSubmitAction.createAndRun(this, syncType, listener, customIdentifier);
};
oFF.InAPlanningVarProcessorProvider.prototype.processVariableCancel = function(syncType, listener, customIdentifier)
{
	return oFF.InAPlanningVarCancelAction.createAndRun(this, syncType, listener, customIdentifier);
};
oFF.InAPlanningVarProcessorProvider.prototype.processCheckVariables = function(syncType, listener, customIdentifier)
{
	return oFF.InAPlanningVarCheckVariablesAction.createAndRun(this, syncType, listener, customIdentifier);
};
oFF.InAPlanningVarProcessorProvider.prototype.getRequestorProvider = function()
{
	return this.m_requestorProvider;
};
oFF.InAPlanningVarProcessorProvider.prototype.getVariableProcessor = function()
{
	return this.m_processor;
};
oFF.InAPlanningVarProcessorProvider.prototype.getContext = function()
{
	return null;
};
oFF.InAPlanningVarProcessorProvider.prototype.supportsMaintainsVariableVariants = function()
{
	return this.m_processor.supportsMaintainsVariableVariants();
};

oFF.InAPlanningVarAction = function() {};
oFF.InAPlanningVarAction.prototype = new oFF.QOlapSyncAction();
oFF.InAPlanningVarAction.prototype._ff_c = "InAPlanningVarAction";

oFF.InAPlanningVarAction.prototype.doStrictVariableProcessing = function()
{
	var parent = this.getActionContext();
	if (oFF.isNull(parent))
	{
		return false;
	}
	var application = parent.getApplication();
	return oFF.notNull(application);
};
oFF.InAPlanningVarAction.prototype.getProcessor = function()
{
	return this.getActionContext().getVariableProcessor();
};
oFF.InAPlanningVarAction.prototype.checkDirectValueTransfer = function()
{
	if (!this.doStrictVariableProcessing())
	{
		return;
	}
	var variableProcessor = this.getActionContext().getVariableProcessor();
	if (oFF.isNull(variableProcessor))
	{
		return;
	}
	if (variableProcessor.isDirectVariableTransferEnabled())
	{
		throw oFF.XException.createIllegalStateException("stateful variable handling cannot be mixed with direct variable transfer");
	}
};
oFF.InAPlanningVarAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onVariableProcessorExecuted(extResult, data, customIdentifier);
};
oFF.InAPlanningVarAction.prototype.createFunction = function()
{
	return this.getActionContext().createFunction();
};
oFF.InAPlanningVarAction.prototype.setVariablesStructure = function(rootElement)
{
	if (oFF.notNull(rootElement))
	{
		var deepCopy = oFF.PrFactory.createStructureDeepCopy(rootElement);
		var provider = this.getActionContext();
		oFF.PlanningState.update(provider.getApplication(), provider.getSystemName(), deepCopy, this);
		if (!oFF.InAHelper.importMessages(deepCopy, this))
		{
			var cubeStructure = deepCopy.getStructureByKey("Cube");
			if (oFF.isNull(cubeStructure))
			{
				var message2 = deepCopy.toString();
				this.addError(oFF.ErrorCodes.PARSER_ERROR, message2);
				return false;
			}
			var importer = this.getImporter();
			var processor = this.getProcessor();
			importer.importVariables(cubeStructure, processor.getVariableContainerBase());
			return true;
		}
	}
	return false;
};
oFF.InAPlanningVarAction.prototype.setStructure = function(rootElement)
{
	if (oFF.notNull(rootElement))
	{
		var deepCopy = oFF.PrFactory.createStructureDeepCopy(rootElement);
		var provider = this.getActionContext();
		oFF.PlanningState.update(provider.getApplication(), provider.getSystemName(), deepCopy, this);
		return !oFF.InAHelper.importMessages(deepCopy, this);
	}
	return false;
};
oFF.InAPlanningVarAction.prototype.getImporter = function()
{
	return this.getActionContext().getVariablesImporter();
};
oFF.InAPlanningVarAction.prototype.getExporter = function()
{
	return this.getActionContext().getVariablesExporter();
};
oFF.InAPlanningVarAction.prototype.isSuccessfullyProcessed = function()
{
	return this.isValid();
};
oFF.InAPlanningVarAction.prototype.getRequestorProvider = function()
{
	return this.getActionContext().getRequestorProvider();
};

oFF.InAPlanningVarCancelAction = function() {};
oFF.InAPlanningVarCancelAction.prototype = new oFF.InAPlanningVarAction();
oFF.InAPlanningVarCancelAction.prototype._ff_c = "InAPlanningVarCancelAction";

oFF.InAPlanningVarCancelAction.createAndRun = function(parent, syncType, listener, customIdentifier)
{
	var newObject = new oFF.InAPlanningVarCancelAction();
	newObject.setupActionAndRun(syncType, listener, customIdentifier, parent);
	return newObject;
};
oFF.InAPlanningVarCancelAction.prototype.processSynchronization = function(syncType)
{
	return false;
};
oFF.InAPlanningVarCancelAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid() && oFF.notNull(response))
	{
		this.getQueryManagerBase().setVariableProcessorState(oFF.VariableProcessorState.SUBMITTED);
	}
	this.setData(this);
	this.endSync();
};

oFF.InAPlanningVarCheckVariablesAction = function() {};
oFF.InAPlanningVarCheckVariablesAction.prototype = new oFF.InAPlanningVarAction();
oFF.InAPlanningVarCheckVariablesAction.prototype._ff_c = "InAPlanningVarCheckVariablesAction";

oFF.InAPlanningVarCheckVariablesAction.createAndRun = function(parent, syncType, listener, customIdentifier)
{
	var newObject = new oFF.InAPlanningVarCheckVariablesAction();
	newObject.setupActionAndRun(syncType, listener, customIdentifier, parent);
	return newObject;
};
oFF.InAPlanningVarCheckVariablesAction.prototype.processSynchronization = function(syncType)
{
	return false;
};
oFF.InAPlanningVarCheckVariablesAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid() && oFF.notNull(response))
	{
		var rootElement = response.getRootElement();
		this.setStructure(rootElement);
	}
	this.setData(this);
	this.endSync();
};

oFF.InAPlanningVarGetRuntimeInfoAction = function() {};
oFF.InAPlanningVarGetRuntimeInfoAction.prototype = new oFF.InAPlanningVarAction();
oFF.InAPlanningVarGetRuntimeInfoAction.prototype._ff_c = "InAPlanningVarGetRuntimeInfoAction";

oFF.InAPlanningVarGetRuntimeInfoAction.createAndRun = function(parent, syncType, listener, customIdentifier)
{
	var newObject = new oFF.InAPlanningVarGetRuntimeInfoAction();
	newObject.setupActionAndRun(syncType, listener, customIdentifier, parent);
	return newObject;
};
oFF.InAPlanningVarGetRuntimeInfoAction.prototype.processSynchronization = function(syncType)
{
	this.checkDirectValueTransfer();
	var ocpFunction = this.createFunction();
	var requestStructure = oFF.PrFactory.createStructure();
	var requestorProvider = this.getRequestorProvider();
	requestorProvider.fillVariableRequestorDataRequestContext(requestStructure, false, "VariableDefinition");
	this.getProcessor().setVariableProcessorState(oFF.VariableProcessorState.PROCESSING_UPDATE_VALUES);
	ocpFunction.getRpcRequest().setRequestStructure(requestStructure);
	ocpFunction.processFunctionExecution(syncType, this, null);
	return true;
};
oFF.InAPlanningVarGetRuntimeInfoAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid() && oFF.notNull(response))
	{
		var rootElement = response.getRootElement();
		var successfullyProcessed = this.setVariablesStructure(rootElement);
		if (successfullyProcessed)
		{
			this.getProcessor().setVariableProcessorState(oFF.VariableProcessorState.CHANGEABLE_REINIT);
		}
		else
		{
			this.addError(oFF.ErrorCodes.OTHER_ERROR, "Error when setting variable structure");
		}
	}
	this.setData(this);
	this.endSync();
};

oFF.InAPlanningVarReInitAfterSubmitAction = function() {};
oFF.InAPlanningVarReInitAfterSubmitAction.prototype = new oFF.InAPlanningVarAction();
oFF.InAPlanningVarReInitAfterSubmitAction.prototype._ff_c = "InAPlanningVarReInitAfterSubmitAction";

oFF.InAPlanningVarReInitAfterSubmitAction.createAndRun = function(parent, syncType, listener, customIdentifier)
{
	var newObject = new oFF.InAPlanningVarReInitAfterSubmitAction();
	newObject.setupActionAndRun(syncType, listener, customIdentifier, parent);
	return newObject;
};
oFF.InAPlanningVarReInitAfterSubmitAction.prototype.processSynchronization = function(syncType)
{
	return false;
};
oFF.InAPlanningVarReInitAfterSubmitAction.prototype.onVariableProcessorExecuted = function(extResult, result, customIdentifier)
{
	this.addAllMessages(extResult);
	this.setData(this);
	this.endSync();
};

oFF.InAPlanningVarSetGetValuesAction = function() {};
oFF.InAPlanningVarSetGetValuesAction.prototype = new oFF.InAPlanningVarAction();
oFF.InAPlanningVarSetGetValuesAction.prototype._ff_c = "InAPlanningVarSetGetValuesAction";

oFF.InAPlanningVarSetGetValuesAction.createAndRun = function(parent, syncType, listener, customIdentifier)
{
	var newObject = new oFF.InAPlanningVarSetGetValuesAction();
	newObject.setupActionAndRun(syncType, listener, customIdentifier, parent);
	return newObject;
};
oFF.InAPlanningVarSetGetValuesAction.prototype.processSynchronization = function(syncType)
{
	var planningService = this.getRequestorProvider().getPlanningContext().getPlanningService();
	if (planningService.supportsPlanningValueHelp())
	{
		this.checkDirectValueTransfer();
		var ocpFunction = this.createFunction();
		var requestStructure = oFF.PrFactory.createStructure();
		var requestorProvider = this.getRequestorProvider();
		requestorProvider.fillVariableRequestorDataRequestContext(requestStructure, true, "VariableDefinition");
		ocpFunction.getRpcRequest().setRequestStructure(requestStructure);
		ocpFunction.processFunctionExecution(syncType, this, null);
		return true;
	}
	return false;
};
oFF.InAPlanningVarSetGetValuesAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid() && oFF.notNull(response))
	{
		var rootElement = response.getRootElement();
		if (!this.setVariablesStructure(rootElement))
		{
			this.addError(oFF.ErrorCodes.OTHER_ERROR, "Error when setting variable structure");
		}
	}
	this.setData(this);
	this.endSync();
};

oFF.InAPlanningVarSubmitAction = function() {};
oFF.InAPlanningVarSubmitAction.prototype = new oFF.InAPlanningVarAction();
oFF.InAPlanningVarSubmitAction.prototype._ff_c = "InAPlanningVarSubmitAction";

oFF.InAPlanningVarSubmitAction.createAndRun = function(parent, syncType, listener, customIdentifier)
{
	var newObject = new oFF.InAPlanningVarSubmitAction();
	newObject.setupActionAndRun(syncType, listener, customIdentifier, parent);
	return newObject;
};
oFF.InAPlanningVarSubmitAction.prototype.processSynchronization = function(syncType)
{
	this.checkDirectValueTransfer();
	if (!this.getActionContext().isVariableSubmitNeeded())
	{
		this.setData(this);
		return false;
	}
	var ocpFunction = this.createFunction();
	var requestStructure = oFF.PrFactory.createStructure();
	var requestorProvider = this.getRequestorProvider();
	var inaDefinition = requestorProvider.fillVariableRequestorDataRequestContext(requestStructure, false, "VariableSubmit");
	this.getExporter().exportVariables(this.getProcessor().getVariableContainer(), inaDefinition);
	ocpFunction.getRpcRequest().setRequestStructure(requestStructure);
	ocpFunction.processFunctionExecution(syncType, this, null);
	return true;
};
oFF.InAPlanningVarSubmitAction.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid() && oFF.notNull(response))
	{
		var rootElement = response.getRootElement();
		var successfullyProcessed = this.setStructure(rootElement);
		this.getProcessor().setVariableProcessorState(oFF.VariableProcessorState.SUBMITTED);
		if (!successfullyProcessed)
		{
			this.addError(oFF.ErrorCodes.OTHER_ERROR, "Error when setting variable structure");
		}
	}
	this.setData(this);
	this.endSync();
};

oFF.IpProviderModule = function() {};
oFF.IpProviderModule.prototype = new oFF.DfModule();
oFF.IpProviderModule.prototype._ff_c = "IpProviderModule";

oFF.IpProviderModule.s_module = null;
oFF.IpProviderModule.getInstance = function()
{
	if (oFF.isNull(oFF.IpProviderModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.IpImplModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.ProviderModule.getInstance());
		oFF.IpProviderModule.s_module = oFF.DfModule.startExt(new oFF.IpProviderModule());
		oFF.InAPlanningCapabilitiesProviderFactory.staticSetup();
		oFF.PlanningVariableProcessorProviderFactory.staticSetup();
		oFF.PlanningStateHandler.setInstance(new oFF.PlanningStateHandlerImpl());
		oFF.DfModule.stopExt(oFF.IpProviderModule.s_module);
	}
	return oFF.IpProviderModule.s_module;
};
oFF.IpProviderModule.prototype.getName = function()
{
	return "ff4410.olap.ip.providers";
};

oFF.IpProviderModule.getInstance();

return sap.firefly;
	} );