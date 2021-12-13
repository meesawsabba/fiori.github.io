/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
[
"sap/zen/dsh/firefly/ff4310.olap.impl","sap/zen/dsh/firefly/ff4220.olap.catalog.api"
],
function(oFF)
{
"use strict";

oFF.OlapCatalogResult = function() {};
oFF.OlapCatalogResult.prototype = new oFF.XObject();
oFF.OlapCatalogResult.prototype._ff_c = "OlapCatalogResult";

oFF.OlapCatalogResult.create = function(resultSet, interestedCurrency)
{
	var object = new oFF.OlapCatalogResult();
	object.setupExt(resultSet, interestedCurrency);
	return object;
};
oFF.OlapCatalogResult.prototype.m_items = null;
oFF.OlapCatalogResult.prototype.getFirstKeyField = function(queryModel, dmensionName)
{
	var dimension = queryModel.getDimensionByName(dmensionName);
	if (oFF.notNull(dimension))
	{
		return dimension.getFirstFieldByType(oFF.PresentationType.KEY);
	}
	return null;
};
oFF.OlapCatalogResult.prototype.setupExt = function(resultSet, interestedCurrency)
{
	this.m_items = oFF.XList.create();
	var queryModel = resultSet.getQueryModel();
	var typeField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_TYPE);
	var schemaNameField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_SCHEMA);
	var baseDataSourceTypeField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_BASEDATASOURCE_TYPE);
	var baseDataSourceKeyField = null;
	var baseDataSourceTextField = null;
	var baseDataSource = queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_BASEDATASOURCE);
	if (oFF.notNull(baseDataSource))
	{
		baseDataSourceKeyField = baseDataSource.getFirstFieldByType(oFF.PresentationType.KEY);
		baseDataSourceTextField = baseDataSource.getFirstFieldByType(oFF.PresentationType.TEXT);
	}
	var dataCategoryField = null;
	var capabilities = queryModel.getModelCapabilities();
	if (capabilities.supportsMetadataDataCategory())
	{
		dataCategoryField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_DATA_CATEGORY);
	}
	var queryAliasField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_QUERY_ALIAS);
	var baseDataSourceSchemaNameField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_BASEDATASOURCE_SCHEMANAME);
	var baseDataSourcePackageNameField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_BASEDATASOURCE_PACKAGENAME);
	var baseDataSourceObjectNameField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_BASEDATASOURCE_OBJECTNAME);
	var planningModelNameField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_PLANNING_MODEL_NAME);
	var planningModelSchemaNameField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_PLANNING_MODEL_SCHEMA_NAME);
	var internalTypeField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_INTERNAL_TYPE);
	var packageNameField = this.getFirstKeyField(queryModel, oFF.OlapCatalogManager2.CN_PACKAGE);
	var dimCnObject = queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_OBJECT);
	var objectIsPlanQueryField = null;
	var objectHasMdxFlag = null;
	var objectNameField = null;
	var objectTextField = null;
	if (oFF.notNull(dimCnObject))
	{
		objectIsPlanQueryField = dimCnObject.getFieldByName(oFF.OlapCatalogManager2.CN_OBJECT_IS_PLANQUERY);
		objectHasMdxFlag = dimCnObject.getFieldByName(oFF.OlapCatalogManager2.CN_OBJECT_MDX_FLAG);
		objectNameField = dimCnObject.getFirstFieldByType(oFF.PresentationType.KEY);
		objectTextField = dimCnObject.getFirstFieldByType(oFF.PresentationType.TEXT);
	}
	var dimCurrency = queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_CURRENCY);
	var currencyKeyField = null;
	var currencyTextField = null;
	if (oFF.notNull(dimCurrency))
	{
		currencyKeyField = dimCurrency.getFirstFieldByType(oFF.PresentationType.KEY);
		currencyTextField = dimCurrency.getFirstFieldByType(oFF.PresentationType.TEXT);
	}
	var dimCurrencyTranslationName = queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_CURRENCY_TRANSLATION_NAME);
	var currencyTranslationNameKeyField = null;
	var currencyTranslationNameTextField = null;
	if (oFF.notNull(dimCurrencyTranslationName))
	{
		currencyTranslationNameKeyField = dimCurrencyTranslationName.getFirstFieldByType(oFF.PresentationType.KEY);
		currencyTranslationNameTextField = dimCurrencyTranslationName.getFirstFieldByType(oFF.PresentationType.TEXT);
	}
	var dimCurrencyTarget = queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_CURRENCY_TARGET);
	var currencyTargetKeyField = null;
	if (oFF.notNull(dimCurrencyTarget))
	{
		currencyTargetKeyField = dimCurrencyTarget.getFirstFieldByType(oFF.PresentationType.KEY);
	}
	var formulaOperators = queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_FORMULA_OPERATORS);
	var formulaOperatorsKeyField = null;
	var formulaOperatorsTextField = null;
	var formulaOperatorsNumOfOperands = null;
	if (oFF.notNull(formulaOperators))
	{
		formulaOperatorsKeyField = formulaOperators.getFirstFieldByType(oFF.PresentationType.KEY);
		formulaOperatorsTextField = formulaOperators.getFirstFieldByType(oFF.PresentationType.TEXT);
		formulaOperatorsNumOfOperands = formulaOperators.getFieldByName(oFF.OlapCatalogManager2.CN_FORMULA_OPERATORS_OPERANDS_NUMBER);
	}
	var rowsAxis = resultSet.getRowsAxis();
	var tuplesCount = rowsAxis.getTuplesCount();
	for (var i = 0; i < tuplesCount; i++)
	{
		var tuple = rowsAxis.getTupleAt(i);
		var item = oFF.OlapCatalogItem.createCatalogItem();
		if (oFF.notNull(dataCategoryField))
		{
			item.setDataCategory(tuple.getStringByField(dataCategoryField));
		}
		if (oFF.notNull(queryAliasField))
		{
			item.setQueryAlias(tuple.getStringByField(queryAliasField));
		}
		if (oFF.notNull(internalTypeField))
		{
			item.setInternalType(tuple.getStringByField(internalTypeField));
		}
		if (oFF.notNull(typeField))
		{
			var typeName = tuple.getStringByField(typeField);
			item.setType(oFF.MetaObjectType.lookupAndCreate(typeName));
		}
		if (oFF.notNull(schemaNameField))
		{
			item.setSchemaName(tuple.getStringByField(schemaNameField));
		}
		if (oFF.notNull(packageNameField))
		{
			item.setPackageName(tuple.getStringByField(packageNameField));
		}
		if (oFF.notNull(objectNameField))
		{
			item.setObjectName(tuple.getStringByField(objectNameField));
		}
		if (oFF.notNull(objectTextField))
		{
			item.setText(tuple.getStringByField(objectTextField));
		}
		if (oFF.isNull(objectIsPlanQueryField))
		{
			item.setPlanQuery(false);
		}
		else
		{
			item.setPlanQuery(tuple.getBooleanByField(objectIsPlanQueryField));
		}
		if (oFF.notNull(objectHasMdxFlag))
		{
			var hasMdx = tuple.getTristateByField(objectHasMdxFlag);
			item.setHasMdxFlag(hasMdx);
		}
		var baseDataSourceIdentifier = oFF.QFactory.createDataSource();
		if (oFF.notNull(baseDataSourceTypeField))
		{
			baseDataSourceIdentifier.setType(oFF.MetaObjectType.lookup(tuple.getStringByField(baseDataSourceTypeField)));
		}
		if (oFF.notNull(baseDataSourceTextField))
		{
			baseDataSourceIdentifier.setText(tuple.getStringByField(baseDataSourceTextField));
		}
		if (oFF.notNull(baseDataSourceKeyField))
		{
			baseDataSourceIdentifier.setName(tuple.getStringByField(baseDataSourceKeyField));
		}
		if (oFF.notNull(baseDataSourceSchemaNameField))
		{
			baseDataSourceIdentifier.setSchemaName(tuple.getStringByField(baseDataSourceSchemaNameField));
		}
		if (oFF.notNull(baseDataSourcePackageNameField))
		{
			baseDataSourceIdentifier.setPackageName(tuple.getStringByField(baseDataSourcePackageNameField));
		}
		if (oFF.notNull(baseDataSourceObjectNameField) && oFF.XString.size(tuple.getStringByField(baseDataSourceObjectNameField)) > 0)
		{
			baseDataSourceIdentifier.setName(tuple.getStringByField(baseDataSourceObjectNameField));
		}
		item.setBaseDataSource(baseDataSourceIdentifier);
		if (oFF.notNull(planningModelNameField))
		{
			item.setPlanningModelName(tuple.getStringByField(planningModelNameField));
		}
		if (oFF.notNull(planningModelSchemaNameField))
		{
			item.setPlanningModelSchemaName(tuple.getStringByField(planningModelSchemaNameField));
		}
		if (oFF.notNull(currencyKeyField))
		{
			item.setCurrencyKey(tuple.getStringByField(currencyKeyField));
		}
		if (oFF.notNull(currencyTextField))
		{
			item.setCurrencyText(tuple.getStringByField(currencyTextField));
		}
		if (oFF.notNull(currencyTranslationNameKeyField))
		{
			item.setCurrencyTranslationNameKey(tuple.getStringByField(currencyTranslationNameKeyField));
		}
		if (oFF.notNull(currencyTranslationNameTextField))
		{
			item.setCurrencyTranslationNameText(tuple.getStringByField(currencyTranslationNameTextField));
		}
		if (oFF.notNull(currencyTargetKeyField))
		{
			item.setCurrencyTargetKey(tuple.getStringByField(currencyTargetKeyField));
		}
		if (oFF.notNull(formulaOperatorsKeyField))
		{
			item.setFormulaOperatorKey(tuple.getStringByField(formulaOperatorsKeyField));
		}
		if (oFF.notNull(formulaOperatorsTextField))
		{
			item.setFormulaOperatorText(tuple.getStringByField(formulaOperatorsTextField));
		}
		if (oFF.notNull(formulaOperatorsNumOfOperands))
		{
			item.setFormulaOperatorNumberOfOperands(tuple.getIntegerByField(formulaOperatorsNumOfOperands));
		}
		var shouldBeAdded = true;
		if (oFF.XStringUtils.isNotNullAndNotEmpty(interestedCurrency))
		{
			var tupleCurrency = tuple.getStringByField(currencyTargetKeyField);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(tupleCurrency) && !oFF.XString.isEqual(tupleCurrency, interestedCurrency))
			{
				shouldBeAdded = false;
			}
		}
		if (shouldBeAdded)
		{
			this.m_items.add(item);
		}
	}
};
oFF.OlapCatalogResult.prototype.releaseObject = function()
{
	this.m_items = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_items);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.OlapCatalogResult.prototype.getObjectsIterator = function()
{
	return this.m_items.getIterator();
};
oFF.OlapCatalogResult.prototype.getObjectsList = function()
{
	return this.m_items;
};
oFF.OlapCatalogResult.prototype.toString = function()
{
	var sb = oFF.XStringBuffer.create();
	if (oFF.notNull(this.m_items))
	{
		for (var i = 0; i < this.m_items.size(); i++)
		{
			var item = this.m_items.get(i);
			if (oFF.notNull(item))
			{
				sb.append(item.toString());
			}
			sb.appendNewLine();
		}
	}
	return sb.toString();
};

oFF.PlanningCatalogItem = function() {};
oFF.PlanningCatalogItem.prototype = new oFF.XObject();
oFF.PlanningCatalogItem.prototype._ff_c = "PlanningCatalogItem";

oFF.PlanningCatalogItem.createCatalogItem = function()
{
	return new oFF.PlanningCatalogItem();
};
oFF.PlanningCatalogItem.prototype.m_objectNameKey = null;
oFF.PlanningCatalogItem.prototype.m_objectNameLongText = null;
oFF.PlanningCatalogItem.prototype.m_planningOperationType = null;
oFF.PlanningCatalogItem.prototype.releaseObject = function()
{
	this.m_objectNameKey = null;
	this.m_objectNameLongText = null;
	this.m_planningOperationType = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.PlanningCatalogItem.prototype.getObjectNameKey = function()
{
	return this.m_objectNameKey;
};
oFF.PlanningCatalogItem.prototype.setObjectNameKey = function(objectNameKey)
{
	this.m_objectNameKey = objectNameKey;
};
oFF.PlanningCatalogItem.prototype.getObjectNameLongText = function()
{
	return this.m_objectNameLongText;
};
oFF.PlanningCatalogItem.prototype.setObjectNameLongText = function(objectNameLongText)
{
	this.m_objectNameLongText = objectNameLongText;
};
oFF.PlanningCatalogItem.prototype.getType = function()
{
	return this.m_planningOperationType;
};
oFF.PlanningCatalogItem.prototype.setType = function(planningOperationType)
{
	this.m_planningOperationType = planningOperationType;
};
oFF.PlanningCatalogItem.prototype.getDataSource = function()
{
	var planningOperationType = this.getType();
	if (planningOperationType === oFF.PlanningOperationType.PLANNING_FUNCTION)
	{
		return oFF.QFactory.createDataSourceWithType(oFF.MetaObjectType.PLANNING_FUNCTION, this.getObjectNameKey());
	}
	else if (planningOperationType === oFF.PlanningOperationType.PLANNING_SEQUENCE)
	{
		return oFF.QFactory.createDataSourceWithType(oFF.MetaObjectType.PLANNING_SEQUENCE, this.getObjectNameKey());
	}
	else
	{
		return null;
	}
};
oFF.PlanningCatalogItem.prototype.toString = function()
{
	var sb = oFF.XStringBuffer.create();
	if (oFF.notNull(this.m_planningOperationType))
	{
		sb.append(this.m_planningOperationType.toString());
	}
	sb.append(": ").append(this.m_objectNameKey);
	if (!oFF.XString.isEqual(this.m_objectNameKey, this.m_objectNameLongText))
	{
		sb.append(" description: ").append(this.m_objectNameLongText);
	}
	return sb.toString();
};

oFF.PlanningCatalogResult = function() {};
oFF.PlanningCatalogResult.prototype = new oFF.XObject();
oFF.PlanningCatalogResult.prototype._ff_c = "PlanningCatalogResult";

oFF.PlanningCatalogResult.create = function(resultSet, catalogOptions)
{
	var object = new oFF.PlanningCatalogResult();
	object.setupExt(resultSet, catalogOptions);
	return object;
};
oFF.PlanningCatalogResult.prototype.m_items = null;
oFF.PlanningCatalogResult.prototype.releaseObject = function()
{
	this.m_items = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_items);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.PlanningCatalogResult.prototype.setupExt = function(resultSet, catalogOptions)
{
	this.m_items = oFF.XList.create();
	var queryModel = resultSet.getQueryModel();
	var objectNameKeyField = queryModel.getDimensionByName(oFF.PlanningCatalogManager.CN_OBJECT_NAME).getFirstFieldByType(oFF.PresentationType.KEY);
	var objectNameKeyLongTextField = queryModel.getDimensionByName(oFF.PlanningCatalogManager.CN_OBJECT_NAME).getFirstFieldByType(oFF.PresentationType.TEXT);
	var planningTypeKeyField = queryModel.getDimensionByName(oFF.PlanningCatalogManager.CN_PLANNING_TYPE).getFirstFieldByType(oFF.PresentationType.KEY);
	var rowsAxis = resultSet.getRowsAxis();
	var tuplesCount = rowsAxis.getTuplesCount();
	for (var i = 0; i < tuplesCount; i++)
	{
		var tuple = rowsAxis.getTupleAt(i);
		var objectNameKey = tuple.getStringByField(objectNameKeyField);
		var objectNameLongText = tuple.getStringByField(objectNameKeyLongTextField);
		var planningTypeKey = tuple.getStringByField(planningTypeKeyField);
		var planningOperationType = oFF.PlanningOperationType.lookup(planningTypeKey);
		oFF.XObjectExt.assertNotNullExt(planningOperationType, "illegal planning type");
		if (planningOperationType === oFF.PlanningOperationType.PLANNING_FUNCTION)
		{
			oFF.XBooleanUtils.checkTrue(catalogOptions.isSearchOnPlanningFunctions(), "illegal planning type");
		}
		if (planningOperationType === oFF.PlanningOperationType.PLANNING_SEQUENCE)
		{
			oFF.XBooleanUtils.checkTrue(catalogOptions.isSearchOnPlanningSequences(), "illegal planning type");
		}
		var item = oFF.PlanningCatalogItem.createCatalogItem();
		item.setType(planningOperationType);
		item.setObjectNameKey(objectNameKey);
		item.setObjectNameLongText(objectNameLongText);
		this.m_items.add(item);
	}
};
oFF.PlanningCatalogResult.prototype.getObjectsIterator = function()
{
	return this.m_items.getIterator();
};
oFF.PlanningCatalogResult.prototype.toString = function()
{
	var sb = oFF.XStringBuffer.create();
	if (oFF.notNull(this.m_items))
	{
		for (var i = 0; i < this.m_items.size(); i++)
		{
			var item = this.m_items.get(i);
			if (oFF.notNull(item))
			{
				sb.append(item.toString());
			}
			sb.appendNewLine();
		}
	}
	return sb.toString();
};

oFF.PlanningModelCatalogItem = function() {};
oFF.PlanningModelCatalogItem.prototype = new oFF.XObject();
oFF.PlanningModelCatalogItem.prototype._ff_c = "PlanningModelCatalogItem";

oFF.PlanningModelCatalogItem.createCatalogItem = function()
{
	return new oFF.PlanningModelCatalogItem();
};
oFF.PlanningModelCatalogItem.prototype.m_schemaName = null;
oFF.PlanningModelCatalogItem.prototype.m_modelName = null;
oFF.PlanningModelCatalogItem.prototype.releaseObject = function()
{
	this.m_schemaName = null;
	this.m_modelName = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.PlanningModelCatalogItem.prototype.getSchemaName = function()
{
	return this.m_schemaName;
};
oFF.PlanningModelCatalogItem.prototype.setSchemaName = function(schemaName)
{
	this.m_schemaName = schemaName;
};
oFF.PlanningModelCatalogItem.prototype.getModelName = function()
{
	return this.m_modelName;
};
oFF.PlanningModelCatalogItem.prototype.setModelName = function(modelName)
{
	this.m_modelName = modelName;
};
oFF.PlanningModelCatalogItem.prototype.getDataSource = function()
{
	var dataSource = oFF.QFactory.createDataSourceWithType(oFF.MetaObjectType.PLANNING_MODEL, this.getModelName());
	var schemaName = this.getSchemaName();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(schemaName))
	{
		dataSource.setSchemaName(schemaName);
	}
	return dataSource;
};
oFF.PlanningModelCatalogItem.prototype.toString = function()
{
	return oFF.XStringUtils.concatenate3(this.m_schemaName, " - ", this.m_modelName);
};

oFF.PlanningModelCatalogResult = function() {};
oFF.PlanningModelCatalogResult.prototype = new oFF.XObject();
oFF.PlanningModelCatalogResult.prototype._ff_c = "PlanningModelCatalogResult";

oFF.PlanningModelCatalogResult.prototype.m_resultListener = null;
oFF.PlanningModelCatalogResult.prototype.m_customIdentifier = null;
oFF.PlanningModelCatalogResult.prototype.m_items = null;
oFF.PlanningModelCatalogResult.prototype.releaseObject = function()
{
	this.m_resultListener = null;
	this.m_customIdentifier = null;
	this.m_items = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_items);
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.PlanningModelCatalogResult.prototype.getResultListener = function()
{
	return this.m_resultListener;
};
oFF.PlanningModelCatalogResult.prototype.setResultListener = function(resultListener)
{
	this.m_resultListener = resultListener;
};
oFF.PlanningModelCatalogResult.prototype.getCustomIdentifier = function()
{
	return this.m_customIdentifier;
};
oFF.PlanningModelCatalogResult.prototype.setCustomIdentifier = function(customIdentifier)
{
	this.m_customIdentifier = customIdentifier;
};
oFF.PlanningModelCatalogResult.prototype.getObjectsIterator = function()
{
	return this.m_items.getIterator();
};
oFF.PlanningModelCatalogResult.prototype.getResponsesReturnCodeStrict = function(responseStructure, messageManager)
{
	if (oFF.isNull(responseStructure) || oFF.isNull(messageManager))
	{
		return -1;
	}
	var returnCode = 0;
	var hasPlanningStructure = false;
	var planningStructure = oFF.PrUtils.getStructureProperty(responseStructure, "Planning");
	if (oFF.isNull(planningStructure))
	{
		var planningList = oFF.PrUtils.getListProperty(responseStructure, "Planning");
		if (oFF.notNull(planningList))
		{
			hasPlanningStructure = true;
			for (var i = 0; i < planningList.size(); i++)
			{
				planningStructure = oFF.PrUtils.getStructureElement(planningList, i);
				if (oFF.notNull(planningStructure))
				{
					var planningReturnCode = this.isValidPlanningStructure(planningStructure, messageManager);
					if (planningReturnCode !== 0)
					{
						returnCode = planningReturnCode;
						break;
					}
				}
			}
		}
	}
	else
	{
		hasPlanningStructure = true;
		return this.isValidPlanningStructure(planningStructure, messageManager);
	}
	if (!hasPlanningStructure)
	{
		messageManager.addErrorExt(oFF.OriginLayer.DRIVER, oFF.ErrorCodes.PARSER_ERROR, "Planning structure is missing", responseStructure);
		return 0;
	}
	return returnCode;
};
oFF.PlanningModelCatalogResult.prototype.isValidPlanningStructure = function(planningStructure, messageManager)
{
	var returnCode = oFF.PrUtils.getIntegerValueProperty(planningStructure, "return_code", 0);
	if (oFF.isNull(planningStructure))
	{
		messageManager.addError(oFF.ErrorCodes.PARSER_ERROR, "Planning structure is missing");
		return returnCode;
	}
	var exceptionText = oFF.PrUtils.getStringValueProperty(planningStructure, "exception_text", null);
	if (oFF.notNull(exceptionText))
	{
		messageManager.addErrorExt(oFF.OriginLayer.DRIVER, oFF.ErrorCodes.OTHER_ERROR, exceptionText, planningStructure);
		return returnCode;
	}
	var message = oFF.PrUtils.getStringValueProperty(planningStructure, "message", null);
	if (oFF.notNull(message))
	{
		messageManager.addErrorExt(oFF.OriginLayer.DRIVER, oFF.ErrorCodes.OTHER_ERROR, message, planningStructure);
		return returnCode;
	}
	if (returnCode !== 0)
	{
		var sb = oFF.XStringBuffer.create();
		sb.append("Error: return code ").appendInt(returnCode);
		messageManager.addErrorExt(oFF.OriginLayer.DRIVER, oFF.ErrorCodes.INVALID_STATE, sb.toString(), planningStructure);
	}
	return returnCode;
};
oFF.PlanningModelCatalogResult.prototype.processResponseStructure = function(responseStructure, messageManager)
{
	var returnCode = this.getResponsesReturnCodeStrict(responseStructure, messageManager);
	if (returnCode !== 0)
	{
		return;
	}
	var planning = oFF.PrUtils.getStructureProperty(responseStructure, "Planning");
	var models = oFF.PrUtils.getListProperty(planning, "models");
	if (oFF.isNull(models))
	{
		messageManager.addErrorExt(oFF.OriginLayer.DRIVER, oFF.ErrorCodes.PARSER_ERROR, "error in processing response structure", responseStructure);
		return;
	}
	var items = oFF.XList.create();
	for (var i = 0; i < models.size(); i++)
	{
		var model = oFF.PrUtils.getStructureElement(models, i);
		if (oFF.isNull(model))
		{
			messageManager.addErrorExt(oFF.OriginLayer.DRIVER, 0, "error in processing response structure", responseStructure);
			return;
		}
		var schema = oFF.PrUtils.getStringProperty(model, "schema");
		if (oFF.isNull(schema))
		{
			messageManager.addErrorExt(oFF.OriginLayer.DRIVER, 0, "error in processing response structure", responseStructure);
			return;
		}
		var modelNames = oFF.PrUtils.getListProperty(model, "models");
		if (oFF.isNull(modelNames))
		{
			messageManager.addErrorExt(oFF.OriginLayer.DRIVER, 0, "error in processing response structure", responseStructure);
			return;
		}
		for (var j = 0; j < modelNames.size(); j++)
		{
			var modelName = oFF.PrUtils.getStringElement(modelNames, j);
			if (oFF.isNull(modelName))
			{
				messageManager.addErrorExt(oFF.OriginLayer.DRIVER, 0, "error in processing response structure", responseStructure);
				return;
			}
			var item = oFF.PlanningModelCatalogItem.createCatalogItem();
			item.setSchemaName(schema.getString());
			item.setModelName(modelName.getString());
			items.add(item);
		}
	}
	this.m_items = items;
};
oFF.PlanningModelCatalogResult.prototype.toString = function()
{
	var sb = oFF.XStringBuffer.create();
	if (oFF.notNull(this.m_items))
	{
		for (var i = 0; i < this.m_items.size(); i++)
		{
			var item = this.m_items.get(i);
			if (oFF.notNull(item))
			{
				sb.append(item.toString());
			}
			sb.appendNewLine();
		}
	}
	return sb.toString();
};

oFF.OlapCatalogService = function() {};
oFF.OlapCatalogService.prototype = new oFF.DfService();
oFF.OlapCatalogService.prototype._ff_c = "OlapCatalogService";

oFF.OlapCatalogService.CLAZZ = null;
oFF.OlapCatalogService.staticSetup = function()
{
	oFF.OlapCatalogService.CLAZZ = oFF.XClass.create(oFF.OlapCatalogService);
};
oFF.OlapCatalogService.prototype.m_catalogManager = null;
oFF.OlapCatalogService.prototype.getCatalogManager = function()
{
	return this.m_catalogManager;
};
oFF.OlapCatalogService.prototype.releaseObject = function()
{
	this.m_catalogManager = oFF.XObjectExt.release(this.m_catalogManager);
	oFF.DfService.prototype.releaseObject.call( this );
};
oFF.OlapCatalogService.prototype.processSynchronization = function(syncType)
{
	var config = this.getServiceConfig();
	var queryServiceConfig = oFF.QueryServiceConfig.create(this.getApplication());
	queryServiceConfig.setSystemName(config.getSystemName());
	var identifier = oFF.QFactory.createDataSourceWithType(config.getMetaObjectType(), "$$DataSource$$");
	queryServiceConfig.setDataSource(identifier);
	queryServiceConfig.setProviderType(oFF.ProviderType.ANALYTICS);
	queryServiceConfig.setConnectionContainer(this.getConnection());
	queryServiceConfig.processQueryManagerCreation(syncType, this, null);
	return true;
};
oFF.OlapCatalogService.prototype.onQueryManagerCreated = function(extResult, queryManager, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		this.m_catalogManager = oFF.OlapCatalogManager2.create(queryManager);
		if (queryManager.getSession().hasFeature(oFF.FeatureToggleOlap.OPTIMIZE_MDS_CATALOG) && queryManager.supportsReturnedDataSelection() && queryManager.getSystemType() === oFF.SystemType.HANA)
		{
			queryManager.queueEventing();
			queryManager.disableReturnedDataSelection(oFF.ReturnedDataSelection.ACTIONS);
			queryManager.disableReturnedDataSelection(oFF.ReturnedDataSelection.CELL_DATA_TYPE);
			queryManager.disableReturnedDataSelection(oFF.ReturnedDataSelection.CELL_FORMAT);
			queryManager.disableReturnedDataSelection(oFF.ReturnedDataSelection.CELL_VALUE_TYPES);
			queryManager.disableReturnedDataSelection(oFF.ReturnedDataSelection.EXCEPTION_SETTINGS);
			queryManager.disableReturnedDataSelection(oFF.ReturnedDataSelection.EXCEPTIONS);
			queryManager.disableReturnedDataSelection(oFF.ReturnedDataSelection.INPUT_READINESS_STATES);
			queryManager.disableReturnedDataSelection(oFF.ReturnedDataSelection.NUMERIC_ROUNDING);
			queryManager.disableReturnedDataSelection(oFF.ReturnedDataSelection.NUMERIC_SHIFT);
			queryManager.disableReturnedDataSelection(oFF.ReturnedDataSelection.UNIT_DESCRIPTIONS);
			queryManager.disableReturnedDataSelection(oFF.ReturnedDataSelection.UNIT_TYPES);
			queryManager.disableReturnedDataSelection(oFF.ReturnedDataSelection.UNITS);
			queryManager.disableReturnedDataSelection(oFF.ReturnedDataSelection.VALUES);
			queryManager.disableReturnedDataSelection(oFF.ReturnedDataSelection.VALUES_FORMATTED);
			queryManager.disableReturnedDataSelection(oFF.ReturnedDataSelection.VALUES_ROUNDED);
			queryManager.disableReturnedDataSelection(oFF.ReturnedDataSelection.TUPLE_DISPLAY_LEVEL);
			queryManager.disableReturnedDataSelection(oFF.ReturnedDataSelection.TUPLE_DRILL_STATE);
			queryManager.disableReturnedDataSelection(oFF.ReturnedDataSelection.TUPLE_LEVEL);
			queryManager.disableReturnedDataSelection(oFF.ReturnedDataSelection.TUPLE_PARENT_INDEXES);
			queryManager.resumeEventing();
		}
	}
	this.endSync();
};

oFF.PlanningCatalogService = function() {};
oFF.PlanningCatalogService.prototype = new oFF.DfService();
oFF.PlanningCatalogService.prototype._ff_c = "PlanningCatalogService";

oFF.PlanningCatalogService.CLAZZ = null;
oFF.PlanningCatalogService.staticSetup = function()
{
	oFF.PlanningCatalogService.CLAZZ = oFF.XClass.create(oFF.PlanningCatalogService);
};
oFF.PlanningCatalogService.prototype.m_catalogManager = null;
oFF.PlanningCatalogService.prototype.releaseObject = function()
{
	this.m_catalogManager = oFF.XObjectExt.release(this.m_catalogManager);
	oFF.DfService.prototype.releaseObject.call( this );
};
oFF.PlanningCatalogService.prototype.getCatalogManager = function()
{
	return this.m_catalogManager;
};
oFF.PlanningCatalogService.prototype.processSynchronization = function(syncType)
{
	var config = this.getServiceConfig();
	var queryServiceConfig = oFF.QueryServiceConfig.create(this.getApplication());
	queryServiceConfig.setSystemName(config.getSystemName());
	var identifier = oFF.QFactory.createDataSourceWithType(oFF.MetaObjectType.CATALOG_VIEW, "$$DataSource$$");
	queryServiceConfig.setDataSource(identifier);
	queryServiceConfig.setProviderType(oFF.ProviderType.PLANNING);
	queryServiceConfig.setConnectionContainer(this.getConnection());
	queryServiceConfig.processQueryManagerCreation(syncType, this, null);
	return true;
};
oFF.PlanningCatalogService.prototype.onQueryManagerCreated = function(extResult, queryManager, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		this.m_catalogManager = oFF.PlanningCatalogManager.create(queryManager);
	}
	this.endSync();
};

oFF.PlanningCatalogServiceConfig = function() {};
oFF.PlanningCatalogServiceConfig.prototype = new oFF.DfServiceConfig();
oFF.PlanningCatalogServiceConfig.prototype._ff_c = "PlanningCatalogServiceConfig";

oFF.PlanningCatalogServiceConfig.CLAZZ = null;
oFF.PlanningCatalogServiceConfig.staticSetup = function()
{
	oFF.PlanningCatalogServiceConfig.CLAZZ = oFF.XClass.create(oFF.PlanningCatalogServiceConfig);
};
oFF.PlanningCatalogServiceConfig.prototype.processPlanningCatalogManagerCreation = function(syncType, listener, customIdentifier)
{
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.PlanningCatalogServiceConfig.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onPlanningCatalogManagerCreated(extResult, data, customIdentifier);
};
oFF.PlanningCatalogServiceConfig.prototype.setDataFromService = function(service)
{
	this.setData(service.getCatalogManager());
};

oFF.PlanningModelCatalogService = function() {};
oFF.PlanningModelCatalogService.prototype = new oFF.DfService();
oFF.PlanningModelCatalogService.prototype._ff_c = "PlanningModelCatalogService";

oFF.PlanningModelCatalogService.CLAZZ = null;
oFF.PlanningModelCatalogService.staticSetup = function()
{
	oFF.PlanningModelCatalogService.CLAZZ = oFF.XClass.create(oFF.PlanningModelCatalogService);
};
oFF.PlanningModelCatalogService.prototype.m_catalogManager = null;
oFF.PlanningModelCatalogService.prototype.releaseObject = function()
{
	this.m_catalogManager = oFF.XObjectExt.release(this.m_catalogManager);
	oFF.DfService.prototype.releaseObject.call( this );
};
oFF.PlanningModelCatalogService.prototype.isServiceConfigMatching = function(serviceConfig, connection, messages)
{
	var systemType = serviceConfig.getSystemType();
	if (oFF.isNull(systemType))
	{
		this.addError(oFF.ErrorCodes.INVALID_SYSTEM, "illegal system type");
		return false;
	}
	if (!systemType.isTypeOf(oFF.SystemType.HANA))
	{
		this.addErrorExt(oFF.OriginLayer.DRIVER, oFF.ErrorCodes.INVALID_SYSTEM, "illegal system type", systemType);
		return false;
	}
	return true;
};
oFF.PlanningModelCatalogService.prototype.getCatalogManager = function()
{
	return this.m_catalogManager;
};
oFF.PlanningModelCatalogService.prototype.processSynchronization = function(syncType)
{
	this.m_catalogManager = oFF.PlanningModelCatalogManager.create(this);
	return false;
};
oFF.PlanningModelCatalogService.prototype.getOlapEnv = function()
{
	return this.getApplication().getOlapEnvironment();
};

oFF.PlanningModelCatalogServiceConfig = function() {};
oFF.PlanningModelCatalogServiceConfig.prototype = new oFF.DfServiceConfig();
oFF.PlanningModelCatalogServiceConfig.prototype._ff_c = "PlanningModelCatalogServiceConfig";

oFF.PlanningModelCatalogServiceConfig.CLAZZ = null;
oFF.PlanningModelCatalogServiceConfig.staticSetup = function()
{
	oFF.PlanningModelCatalogServiceConfig.CLAZZ = oFF.XClass.create(oFF.PlanningModelCatalogServiceConfig);
};
oFF.PlanningModelCatalogServiceConfig.prototype.processPlanningModelCatalogManagerCreation = function(syncType, listener, customIdentifier)
{
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.PlanningModelCatalogServiceConfig.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onPlanningModelCatalogManagerCreated(extResult, data, customIdentifier);
};
oFF.PlanningModelCatalogServiceConfig.prototype.setDataFromService = function(service)
{
	this.setData(service.getCatalogManager());
};

oFF.OlapCatalogManager2 = function() {};
oFF.OlapCatalogManager2.prototype = new oFF.QOlapSyncAction();
oFF.OlapCatalogManager2.prototype._ff_c = "OlapCatalogManager2";

oFF.OlapCatalogManager2.CN_TYPE = "Type";
oFF.OlapCatalogManager2.CN_SCHEMA = "SchemaName";
oFF.OlapCatalogManager2.CN_PACKAGE = "PackageName";
oFF.OlapCatalogManager2.CN_OBJECT = "ObjectName";
oFF.OlapCatalogManager2.CN_OBJECT_IS_PLANQUERY = "ObjectName.IS_PLANQUERY";
oFF.OlapCatalogManager2.CN_OBJECT_MDX_FLAG = "ObjectName.MDX_FLAG";
oFF.OlapCatalogManager2.CN_BASEDATASOURCE = "BaseDataSource";
oFF.OlapCatalogManager2.CN_BASEDATASOURCE_SCHEMANAME = "BaseDataSourceSchemaName";
oFF.OlapCatalogManager2.CN_BASEDATASOURCE_PACKAGENAME = "BaseDataSourcePackageName";
oFF.OlapCatalogManager2.CN_BASEDATASOURCE_OBJECTNAME = "BaseDataSourceObjectName";
oFF.OlapCatalogManager2.CN_BASEDATASOURCE_TYPE = "BaseDataSourceType";
oFF.OlapCatalogManager2.CN_PLANNING_MODEL_NAME = "ModelName";
oFF.OlapCatalogManager2.CN_PLANNING_MODEL_SCHEMA_NAME = "ModelSchemaName";
oFF.OlapCatalogManager2.CN_DATA_CATEGORY = "DataCategory";
oFF.OlapCatalogManager2.CN_QUERY_ALIAS = "QueryAlias";
oFF.OlapCatalogManager2.CN_INTERNAL_TYPE = "InternalType";
oFF.OlapCatalogManager2.CN_CURRENCY = "Currency";
oFF.OlapCatalogManager2.CN_CURRENCY_TRANSLATION_NAME = "Name";
oFF.OlapCatalogManager2.CN_CURRENCY_TARGET = "Target";
oFF.OlapCatalogManager2.CN_FORMULA_OPERATORS = "FormulaOperators";
oFF.OlapCatalogManager2.CN_FORMULA_OPERATORS_OPERANDS_NUMBER = "FormulaOperators.OPERANDS_NUMBER";
oFF.OlapCatalogManager2.create = function(queryManager)
{
	var object = new oFF.OlapCatalogManager2();
	object.setupCatalogManager(queryManager);
	return object;
};
oFF.OlapCatalogManager2.prototype.m_catalogResult = null;
oFF.OlapCatalogManager2.prototype.m_type = null;
oFF.OlapCatalogManager2.prototype.m_types = null;
oFF.OlapCatalogManager2.prototype.m_isSearchOnName = false;
oFF.OlapCatalogManager2.prototype.m_isSearchOnText = false;
oFF.OlapCatalogManager2.prototype.m_isSearchOnSchema = false;
oFF.OlapCatalogManager2.prototype.m_isSearchOnPackage = false;
oFF.OlapCatalogManager2.prototype.m_isTransientInfoProvidersIncluded = false;
oFF.OlapCatalogManager2.prototype.m_withOtherFiltersPackage = null;
oFF.OlapCatalogManager2.prototype.m_packageComparisonOperator = null;
oFF.OlapCatalogManager2.prototype.m_baseDataSourceFilterList = null;
oFF.OlapCatalogManager2.prototype.m_internalTypeIncludeList = null;
oFF.OlapCatalogManager2.prototype.m_internalTypeExcludeList = null;
oFF.OlapCatalogManager2.prototype.m_textFilter = null;
oFF.OlapCatalogManager2.prototype.m_baseDataSourceFilter = null;
oFF.OlapCatalogManager2.prototype.m_categoryFilter = null;
oFF.OlapCatalogManager2.prototype.m_packageFilter = null;
oFF.OlapCatalogManager2.prototype.m_baseDataSourceTypeFilter = null;
oFF.OlapCatalogManager2.prototype.m_planQueryFilter = null;
oFF.OlapCatalogManager2.prototype.m_interestedCurrency = null;
oFF.OlapCatalogManager2.prototype.releaseObject = function()
{
	this.m_type = null;
	this.m_textFilter = null;
	this.m_categoryFilter = null;
	this.m_packageFilter = null;
	this.m_baseDataSourceFilter = null;
	this.m_baseDataSourceFilterList = oFF.XObjectExt.release(this.m_baseDataSourceFilterList);
	this.m_internalTypeIncludeList = oFF.XObjectExt.release(this.m_internalTypeIncludeList);
	this.m_internalTypeExcludeList = oFF.XObjectExt.release(this.m_internalTypeExcludeList);
	this.m_baseDataSourceTypeFilter = oFF.XObjectExt.release(this.m_baseDataSourceTypeFilter);
	this.m_planQueryFilter = null;
	this.m_catalogResult = oFF.XObjectExt.release(this.m_catalogResult);
	this.m_withOtherFiltersPackage = null;
	this.m_packageComparisonOperator = null;
	this.m_types = oFF.XObjectExt.release(this.m_types);
	this.m_interestedCurrency = null;
	oFF.QOlapSyncAction.prototype.releaseObject.call( this );
};
oFF.OlapCatalogManager2.prototype.setupCatalogManager = function(queryManager)
{
	this.setupAction(null, null, null, queryManager);
	this.m_planQueryFilter = oFF.TriStateBool._DEFAULT;
	this.m_isTransientInfoProvidersIncluded = true;
	this.m_types = oFF.XList.create();
};
oFF.OlapCatalogManager2.prototype.clearSearchFlags = function()
{
	this.m_isSearchOnName = false;
	this.m_isSearchOnText = false;
	this.m_isSearchOnSchema = false;
	this.m_isSearchOnPackage = false;
};
oFF.OlapCatalogManager2.prototype.processGetResult = function(syncType, listener, customIdentifier)
{
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.OlapCatalogManager2.prototype.getAllTypes = function()
{
	return this.getAllMember(oFF.OlapComponentType.CATALOG_TYPE, oFF.OlapCatalogManager2.CN_TYPE, null, null, null);
};
oFF.OlapCatalogManager2.prototype.getAllSchemas = function(type)
{
	return this.getAllMember(oFF.OlapComponentType.CATALOG_SCHEMA, oFF.OlapCatalogManager2.CN_SCHEMA, type, null, null);
};
oFF.OlapCatalogManager2.prototype.getAllPackages = function(type, schema)
{
	return this.getAllMember(oFF.OlapComponentType.CATALOG_PACKAGE, oFF.OlapCatalogManager2.CN_PACKAGE, type, schema, null);
};
oFF.OlapCatalogManager2.prototype.getAllObjects = function(type, schema, packageName)
{
	return this.getAllMember(oFF.OlapComponentType.CATALOG_OBJECT, oFF.OlapCatalogManager2.CN_OBJECT, type, schema, packageName);
};
oFF.OlapCatalogManager2.prototype.getAllMember = function(componentType, dimensionName, metaObjectType, schema, packageName)
{
	var queryModel = this.getQueryManager().getQueryModel();
	var convenienceCommands = queryModel.getConvenienceCommands();
	convenienceCommands.resetToDefault();
	if (oFF.notNull(metaObjectType))
	{
		convenienceCommands.addSingleMemberFilterByDimensionName(oFF.OlapCatalogManager2.CN_TYPE, metaObjectType.getCamelCaseName(), oFF.ComparisonOperator.EQUAL);
	}
	if (oFF.notNull(schema))
	{
		convenienceCommands.addSingleMemberFilterByDimensionName(oFF.OlapCatalogManager2.CN_SCHEMA, schema, oFF.ComparisonOperator.EQUAL);
	}
	if (oFF.notNull(packageName))
	{
		convenienceCommands.addSingleMemberFilterByDimensionName(oFF.OlapCatalogManager2.CN_PACKAGE, packageName, oFF.ComparisonOperator.EQUAL);
	}
	convenienceCommands.clearAxis(oFF.AxisType.ROWS);
	convenienceCommands.moveDimensionOnAxisTo(dimensionName, oFF.AxisType.ROWS, 0);
	convenienceCommands.addFieldByTypeToResultSet(dimensionName, oFF.PresentationType.KEY);
	convenienceCommands.addFieldByTypeToResultSet(dimensionName, oFF.PresentationType.TEXT);
	var extResult = this.getQueryManager().processQueryExecution(oFF.SyncType.BLOCKING, null, null);
	var packages = oFF.XList.create();
	if (extResult.isValid())
	{
		var packageDim = queryModel.getDimensionByName(dimensionName);
		var packageNameField = packageDim.getKeyField();
		var packageTextField = packageDim.getTextField();
		var rs = extResult.getData().getClassicResultSet();
		var rowsAxis = rs.getRowsAxis();
		var tuplesCount = rowsAxis.getTuplesCount();
		for (var i = 0; i < tuplesCount; i++)
		{
			var tuple = rowsAxis.getTupleAt(i);
			var theName = tuple.getStringByField(packageNameField);
			var theText = theName;
			if (oFF.notNull(packageTextField))
			{
				theText = tuple.getStringByField(packageTextField);
			}
			packages.add(oFF.XHierarchyElement.createHierarchyElement(componentType, theName, theText));
		}
	}
	return oFF.ExtResult.create(packages, extResult);
};
oFF.OlapCatalogManager2.prototype.processSynchronization = function(syncType)
{
	var dimList = oFF.XListOfString.create();
	dimList.add(oFF.OlapCatalogManager2.CN_TYPE);
	dimList.add(oFF.OlapCatalogManager2.CN_SCHEMA);
	dimList.add(oFF.OlapCatalogManager2.CN_PACKAGE);
	dimList.add(oFF.OlapCatalogManager2.CN_OBJECT);
	dimList.add(oFF.OlapCatalogManager2.CN_BASEDATASOURCE);
	var queryManager = this.getQueryManager();
	var queryModel = queryManager.getQueryModel();
	var capabilities = queryModel.getModelCapabilities();
	if (capabilities.supportsMetadataDataCategory())
	{
		dimList.add(oFF.OlapCatalogManager2.CN_DATA_CATEGORY);
	}
	if (this.getSession().hasFeature(oFF.FeatureToggleOlap.QUERY_ALIAS_FROM_CATALOG))
	{
		dimList.add(oFF.OlapCatalogManager2.CN_QUERY_ALIAS);
	}
	dimList.add(oFF.OlapCatalogManager2.CN_INTERNAL_TYPE);
	dimList.add(oFF.OlapCatalogManager2.CN_BASEDATASOURCE_TYPE);
	dimList.add(oFF.OlapCatalogManager2.CN_BASEDATASOURCE_SCHEMANAME);
	dimList.add(oFF.OlapCatalogManager2.CN_BASEDATASOURCE_PACKAGENAME);
	dimList.add(oFF.OlapCatalogManager2.CN_BASEDATASOURCE_OBJECTNAME);
	dimList.add(oFF.OlapCatalogManager2.CN_PLANNING_MODEL_NAME);
	dimList.add(oFF.OlapCatalogManager2.CN_PLANNING_MODEL_SCHEMA_NAME);
	var cmds = queryModel.getConvenienceCommands();
	cmds.resetToDefault();
	cmds.clearAxis(oFF.AxisType.ROWS);
	for (var i = 0; i < dimList.size(); i++)
	{
		var dim = dimList.get(i);
		if (queryModel.getDimensionByName(dim) !== null)
		{
			cmds.moveDimensionToAxis(dim, oFF.AxisType.ROWS);
			cmds.addFieldByTypeToResultSet(dim, oFF.PresentationType.KEY);
			cmds.addFieldByTypeToResultSet(dim, oFF.PresentationType.TEXT);
		}
	}
	cmds.addFieldToResultSet(oFF.OlapCatalogManager2.CN_OBJECT, oFF.OlapCatalogManager2.CN_OBJECT_IS_PLANQUERY);
	cmds.addFieldToResultSet(oFF.OlapCatalogManager2.CN_OBJECT, oFF.OlapCatalogManager2.CN_OBJECT_MDX_FLAG);
	if (this.supportsCombinedSearch())
	{
		this.setupFilterComplex();
	}
	else
	{
		this.setupFilterSimple();
	}
	queryManager.processQueryExecution(syncType, this, null);
	return true;
};
oFF.OlapCatalogManager2.prototype.supportsCombinedSearch = function()
{
	var queryManager = this.getQueryManagerBase();
	if (oFF.isNull(queryManager))
	{
		return false;
	}
	var systemType = queryManager.getSystemType();
	return systemType === oFF.SystemType.HANA || this.isLightweightSearch() || systemType.isTypeOf(oFF.SystemType.VIRTUAL_INA_ODATA);
};
oFF.OlapCatalogManager2.prototype.isLightweightSearch = function()
{
	var queryManager = this.getQueryManagerBase();
	return oFF.notNull(queryManager) && queryManager.isLightweightSearch();
};
oFF.OlapCatalogManager2.prototype.setupFilterComplex = function()
{
	var queryModel = this.getQueryManager().getQueryModel();
	var rootFilterAnd = oFF.QFactory.createFilterAnd(queryModel);
	var selectedTypes = this.getSelectedTypes();
	if (oFF.notNull(selectedTypes) && selectedTypes.hasElements() && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_TYPE) !== null)
	{
		var numberOfMetadataObjectTypes = selectedTypes.size();
		if (numberOfMetadataObjectTypes === 1)
		{
			this.createAndAddFilterOp(selectedTypes.get(0).getCamelCaseName(), rootFilterAnd, oFF.ComparisonOperator.EQUAL, oFF.OlapCatalogManager2.CN_TYPE, oFF.PresentationType.KEY);
		}
		else
		{
			this.createFilterElementsInCartesianList(numberOfMetadataObjectTypes, selectedTypes, rootFilterAnd);
		}
	}
	var textFilter = this.getSearchFilter();
	var mainOrFilter = oFF.QFactory.createFilterOr(rootFilterAnd);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(textFilter))
	{
		if (this.isSearchOnName() && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_OBJECT) !== null)
		{
			this.createAndAddFilterOp(textFilter, mainOrFilter, oFF.ComparisonOperator.MATCH, oFF.OlapCatalogManager2.CN_OBJECT, oFF.PresentationType.KEY);
		}
		if (this.isSearchOnText() && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_OBJECT) !== null)
		{
			this.createAndAddFilterOp(textFilter, mainOrFilter, oFF.ComparisonOperator.MATCH, oFF.OlapCatalogManager2.CN_OBJECT, oFF.PresentationType.TEXT);
		}
		if (this.isSearchOnSchema() && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_SCHEMA) !== null)
		{
			this.createAndAddFilterOp(textFilter, mainOrFilter, oFF.ComparisonOperator.MATCH, oFF.OlapCatalogManager2.CN_SCHEMA, oFF.PresentationType.KEY);
		}
	}
	if (this.isSearchOnPackage() && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_PACKAGE) !== null)
	{
		var mainOrRootFilter;
		if (this.m_withOtherFiltersPackage === oFF.LogicalBoolOperator.OR)
		{
			mainOrRootFilter = mainOrFilter;
		}
		else
		{
			mainOrRootFilter = rootFilterAnd;
		}
		this.createAndAddFilterOp(this.m_packageFilter, mainOrRootFilter, this.determineComparisonOperator(this.m_packageComparisonOperator, this.m_packageFilter), oFF.OlapCatalogManager2.CN_PACKAGE, oFF.PresentationType.KEY);
	}
	this.addFilterToRoot(rootFilterAnd, mainOrFilter);
	var capabilities = queryModel.getModelCapabilities();
	if (capabilities.supportsMetadataDataCategory() && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_categoryFilter) && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_DATA_CATEGORY) !== null)
	{
		this.createAndAddFilterOp(this.m_categoryFilter, rootFilterAnd, oFF.ComparisonOperator.MATCH, oFF.OlapCatalogManager2.CN_DATA_CATEGORY, oFF.PresentationType.KEY);
	}
	if (oFF.notNull(this.m_baseDataSourceFilter) && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_BASEDATASOURCE) !== null)
	{
		this.createAndAddFilterOp(this.m_baseDataSourceFilter, rootFilterAnd, oFF.ComparisonOperator.MATCH, oFF.OlapCatalogManager2.CN_BASEDATASOURCE, oFF.PresentationType.KEY);
	}
	if (oFF.XCollectionUtils.hasElements(this.m_baseDataSourceFilterList) && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_BASEDATASOURCE) !== null)
	{
		var baseDataSourceOperator = oFF.ComparisonOperator.EQUAL;
		for (var i = 0; i < this.m_baseDataSourceFilterList.size(); i++)
		{
			var baseDataSourceElement = this.m_baseDataSourceFilterList.get(i);
			if (oFF.XString.containsString(baseDataSourceElement, "*"))
			{
				baseDataSourceOperator = oFF.ComparisonOperator.MATCH;
				break;
			}
		}
		var baseDataSourceFilterOr = oFF.QFactory.createFilterOr(rootFilterAnd);
		for (var j = 0; j < this.m_baseDataSourceFilterList.size(); j++)
		{
			this.createAndAddFilterOp(this.m_baseDataSourceFilterList.get(j), baseDataSourceFilterOr, baseDataSourceOperator, oFF.OlapCatalogManager2.CN_BASEDATASOURCE, oFF.PresentationType.KEY);
		}
		this.addFilterToRoot(rootFilterAnd, baseDataSourceFilterOr);
	}
	if (oFF.XCollectionUtils.hasElements(this.m_baseDataSourceTypeFilter) && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_BASEDATASOURCE_TYPE) !== null)
	{
		var baseDataSourceTypeOrFilter = oFF.QFactory.createFilterOr(rootFilterAnd);
		for (var k = 0; k < this.m_baseDataSourceTypeFilter.size(); k++)
		{
			this.createAndAddFilterOp(oFF.XString.toUpperCase(this.m_baseDataSourceTypeFilter.get(k).getName()), baseDataSourceTypeOrFilter, oFF.ComparisonOperator.EQUAL, null, null);
		}
		this.addFilterToRoot(rootFilterAnd, baseDataSourceTypeOrFilter);
	}
	if (oFF.XCollectionUtils.hasElements(this.m_internalTypeIncludeList) && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_INTERNAL_TYPE) !== null)
	{
		var internalTypeIncludeOperator = oFF.ComparisonOperator.EQUAL;
		for (var l = 0; l < this.m_internalTypeIncludeList.size(); l++)
		{
			var internalTypeIncludeElement = this.m_internalTypeIncludeList.get(l);
			if (oFF.XString.containsString(internalTypeIncludeElement, "*"))
			{
				internalTypeIncludeOperator = oFF.ComparisonOperator.MATCH;
				break;
			}
		}
		var internalTypeIncludeFilterOr = oFF.QFactory.createFilterOr(rootFilterAnd);
		for (var m = 0; m < this.m_internalTypeIncludeList.size(); m++)
		{
			this.createAndAddFilterOp(this.m_internalTypeIncludeList.get(m), internalTypeIncludeFilterOr, internalTypeIncludeOperator, oFF.OlapCatalogManager2.CN_INTERNAL_TYPE, oFF.PresentationType.KEY);
		}
		this.addFilterToRoot(rootFilterAnd, internalTypeIncludeFilterOr);
	}
	if (oFF.XCollectionUtils.hasElements(this.m_internalTypeExcludeList) && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_INTERNAL_TYPE) !== null)
	{
		var internalTypeExcludeOperator = oFF.ComparisonOperator.NOT_EQUAL;
		for (var n = 0; n < this.m_internalTypeExcludeList.size(); n++)
		{
			var internalTypeExcludeElement = this.m_internalTypeExcludeList.get(n);
			if (oFF.XString.containsString(internalTypeExcludeElement, "*"))
			{
				internalTypeExcludeOperator = oFF.ComparisonOperator.NOT_MATCH;
				break;
			}
		}
		var internalTypeExcludeFilterAnd = oFF.QFactory.createFilterAnd(rootFilterAnd);
		for (var o = 0; o < this.m_internalTypeExcludeList.size(); o++)
		{
			this.createAndAddFilterOp(this.m_internalTypeExcludeList.get(o), internalTypeExcludeFilterAnd, internalTypeExcludeOperator, oFF.OlapCatalogManager2.CN_INTERNAL_TYPE, oFF.PresentationType.KEY);
		}
		this.addFilterToRoot(rootFilterAnd, internalTypeExcludeFilterAnd);
	}
	if (this.m_planQueryFilter !== oFF.TriStateBool._DEFAULT && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_OBJECT_IS_PLANQUERY) !== null)
	{
		if (this.m_planQueryFilter !== oFF.TriStateBool._TRUE)
		{
			this.createAndAddFilterOp("true", rootFilterAnd, oFF.ComparisonOperator.MATCH, oFF.OlapCatalogManager2.CN_OBJECT_IS_PLANQUERY, oFF.PresentationType.KEY);
		}
		else if (this.m_planQueryFilter !== oFF.TriStateBool._FALSE)
		{
			this.createAndAddFilterOp("false", rootFilterAnd, oFF.ComparisonOperator.MATCH, oFF.OlapCatalogManager2.CN_OBJECT_IS_PLANQUERY, oFF.PresentationType.KEY);
		}
	}
	if (rootFilterAnd.hasElements())
	{
		queryModel.getFilter().getDynamicFilter().setComplexRoot(rootFilterAnd);
	}
};
oFF.OlapCatalogManager2.prototype.addFilterToRoot = function(rootFilterAnd, filter)
{
	if (filter.hasElements())
	{
		rootFilterAnd.add(filter);
	}
};
oFF.OlapCatalogManager2.prototype.createFilterElementsInCartesianList = function(numberOfMetadataObjectTypes, systemTypes, mainOrRootFilter)
{
	var queryModel = this.getQueryManager().getQueryModel();
	var dynamicFilter = queryModel.getFilter().getDynamicFilter();
	var dimensionCnType = queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_TYPE);
	var keyField = dimensionCnType.getFirstFieldByType(oFF.PresentationType.KEY);
	var cartesianList = oFF.QFactory.createFilterCartesianListWithField(dynamicFilter, keyField);
	mainOrRootFilter.add(cartesianList);
	for (var i = 0; i < numberOfMetadataObjectTypes; i++)
	{
		var textFilter = systemTypes.get(i).getCamelCaseName();
		var filterName = cartesianList.addNewCartesianElement();
		filterName.setComparisonOperator(oFF.ComparisonOperator.EQUAL);
		filterName.setLowString(textFilter);
	}
};
oFF.OlapCatalogManager2.prototype.createAndAddFilterOp = function(textFilter, mainOrRootFilter, comparisonOperator, objectType, pType)
{
	var queryModel = this.getQueryManager().getQueryModel();
	var selectionStateContainer = queryModel.getFilter().getDynamicFilter();
	var dimensionByNameCNObject = null;
	if (oFF.notNull(objectType))
	{
		dimensionByNameCNObject = queryModel.getDimensionByName(objectType);
	}
	if (oFF.notNull(dimensionByNameCNObject))
	{
		var fieldByType = dimensionByNameCNObject.getFirstFieldByType(pType);
		var filterOperation = oFF.QFactory.createFilterOperationWithOperator(selectionStateContainer, fieldByType, comparisonOperator);
		filterOperation.setLowString(textFilter);
		mainOrRootFilter.add(filterOperation);
	}
};
oFF.OlapCatalogManager2.prototype.determineComparisonOperator = function(op, text)
{
	if (oFF.notNull(op))
	{
		return op;
	}
	if (oFF.XString.containsString(text, "*"))
	{
		return oFF.ComparisonOperator.MATCH;
	}
	return oFF.ComparisonOperator.EQUAL;
};
oFF.OlapCatalogManager2.prototype.setupFilterSimple = function()
{
	var queryModel = this.getQueryManager().getQueryModel();
	var convenienceCommands = queryModel.getConvenienceCommands();
	var selectedType = this.getSelectedType();
	if (oFF.notNull(selectedType) && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_TYPE) !== null)
	{
		convenienceCommands.addSingleMemberFilterByDimensionName(oFF.OlapCatalogManager2.CN_TYPE, selectedType.getCamelCaseName(), oFF.ComparisonOperator.EQUAL);
	}
	var textFilter = this.getSearchFilter();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(textFilter) && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_OBJECT) !== null)
	{
		if (this.isSearchOnName())
		{
			convenienceCommands.addStringFilterByPresentation(oFF.OlapCatalogManager2.CN_OBJECT, oFF.PresentationType.KEY, textFilter, oFF.ComparisonOperator.MATCH);
		}
		else if (this.isSearchOnText())
		{
			convenienceCommands.addStringFilterByPresentation(oFF.OlapCatalogManager2.CN_OBJECT, oFF.PresentationType.TEXT, textFilter, oFF.ComparisonOperator.MATCH);
		}
	}
	var packageFilter = this.getPackageFilter();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(packageFilter) && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_PACKAGE) !== null)
	{
		if (this.isSearchOnPackage())
		{
			convenienceCommands.addStringFilterByPresentation(oFF.OlapCatalogManager2.CN_PACKAGE, oFF.PresentationType.KEY, packageFilter, oFF.ComparisonOperator.EQUAL);
		}
	}
	var capabilities = queryModel.getModelCapabilities();
	if (capabilities.supportsMetadataDataCategory() && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_categoryFilter) && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_DATA_CATEGORY) !== null)
	{
		convenienceCommands.addStringFilterByPresentation(oFF.OlapCatalogManager2.CN_DATA_CATEGORY, oFF.PresentationType.KEY, this.m_categoryFilter, oFF.ComparisonOperator.MATCH);
	}
	if (queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_BASEDATASOURCE) !== null)
	{
		if (oFF.notNull(this.m_baseDataSourceFilter))
		{
			convenienceCommands.addStringFilterByPresentation(oFF.OlapCatalogManager2.CN_BASEDATASOURCE, oFF.PresentationType.KEY, this.m_baseDataSourceFilter, oFF.ComparisonOperator.MATCH);
		}
	}
	if (oFF.XCollectionUtils.hasElements(this.m_baseDataSourceFilterList) && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_BASEDATASOURCE) !== null)
	{
		var baseDataSourceOperator = oFF.ComparisonOperator.EQUAL;
		for (var k = 0; k < this.m_baseDataSourceFilterList.size(); k++)
		{
			var baseDataSourceElement = this.m_baseDataSourceFilterList.get(k);
			if (oFF.XString.containsString(baseDataSourceElement, "*"))
			{
				baseDataSourceOperator = oFF.ComparisonOperator.MATCH;
				break;
			}
		}
		for (var i = 0; i < this.m_baseDataSourceFilterList.size(); i++)
		{
			convenienceCommands.addSingleMemberFilterByDimensionName(oFF.OlapCatalogManager2.CN_BASEDATASOURCE, this.m_baseDataSourceFilterList.get(i), baseDataSourceOperator);
		}
	}
	if (queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_BASEDATASOURCE_TYPE) !== null)
	{
		if (oFF.XCollectionUtils.hasElements(this.m_baseDataSourceTypeFilter))
		{
			var size = this.m_baseDataSourceTypeFilter.size();
			for (var j = 0; j < size; j++)
			{
				convenienceCommands.addStringFilterByPresentation(oFF.OlapCatalogManager2.CN_BASEDATASOURCE_TYPE, oFF.PresentationType.KEY, oFF.XString.toUpperCase(this.m_baseDataSourceTypeFilter.get(j).getName()), oFF.ComparisonOperator.EQUAL);
			}
		}
		if (!this.m_isTransientInfoProvidersIncluded)
		{
			convenienceCommands.addStringFilterByPresentation(oFF.OlapCatalogManager2.CN_BASEDATASOURCE_TYPE, oFF.PresentationType.KEY, "TRPR", oFF.ComparisonOperator.NOT_EQUAL);
		}
	}
	if (this.m_planQueryFilter !== oFF.TriStateBool._DEFAULT && queryModel.getDimensionByName(oFF.OlapCatalogManager2.CN_OBJECT_IS_PLANQUERY) !== null)
	{
		if (this.m_planQueryFilter !== oFF.TriStateBool._TRUE)
		{
			convenienceCommands.addStringFilterByPresentation(oFF.OlapCatalogManager2.CN_OBJECT_IS_PLANQUERY, oFF.PresentationType.KEY, "true", oFF.ComparisonOperator.MATCH);
		}
		else if (this.m_planQueryFilter !== oFF.TriStateBool._FALSE)
		{
			convenienceCommands.addStringFilterByPresentation(oFF.OlapCatalogManager2.CN_OBJECT_IS_PLANQUERY, oFF.PresentationType.KEY, "false", oFF.ComparisonOperator.MATCH);
		}
	}
};
oFF.OlapCatalogManager2.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onOlapCatalogResult(extResult, data, customIdentifier);
};
oFF.OlapCatalogManager2.prototype.onQueryExecuted = function(extResult, resultSetContainer, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		var classicResultSet = resultSetContainer.getClassicResultSet();
		this.m_catalogResult = oFF.OlapCatalogResult.create(classicResultSet, this.m_interestedCurrency);
		this.setData(this.m_catalogResult);
	}
	this.endSync();
};
oFF.OlapCatalogManager2.prototype.setSearchOnText = function(enableSearchOnText)
{
	if (this.m_isSearchOnText !== enableSearchOnText)
	{
		if (!this.supportsCombinedSearch())
		{
			this.clearSearchFlags();
			this.m_isSearchOnName = !enableSearchOnText;
		}
		this.m_isSearchOnText = enableSearchOnText;
		this.resetSyncState();
	}
};
oFF.OlapCatalogManager2.prototype.isSearchOnText = function()
{
	return this.m_isSearchOnText;
};
oFF.OlapCatalogManager2.prototype.setSearchOnName = function(enableSearchOnName)
{
	if (this.m_isSearchOnName !== enableSearchOnName)
	{
		if (!this.supportsCombinedSearch())
		{
			this.clearSearchFlags();
			this.m_isSearchOnText = !enableSearchOnName;
		}
		this.m_isSearchOnName = enableSearchOnName;
		this.resetSyncState();
	}
};
oFF.OlapCatalogManager2.prototype.isSearchOnName = function()
{
	return this.m_isSearchOnName;
};
oFF.OlapCatalogManager2.prototype.setSearchOnSchema = function(enableSearchOnSchema)
{
	if (this.m_isSearchOnSchema !== enableSearchOnSchema)
	{
		if (this.isLightweightSearch() || !this.supportsCombinedSearch())
		{
			return;
		}
		this.m_isSearchOnSchema = enableSearchOnSchema;
		this.resetSyncState();
	}
};
oFF.OlapCatalogManager2.prototype.isSearchOnSchema = function()
{
	return this.m_isSearchOnSchema;
};
oFF.OlapCatalogManager2.prototype.setSearchOnPackageExt = function(enableSearchOnPackage, text, presentationSelect, withOtherFilters, op)
{
	if (withOtherFilters === oFF.LogicalBoolOperator.NOT)
	{
		throw oFF.XException.createIllegalArgumentException("Only AND or OR are allowed.");
	}
	if (this.m_isSearchOnPackage !== enableSearchOnPackage)
	{
		if (this.isLightweightSearch())
		{
			return;
		}
		if (!this.supportsCombinedSearch())
		{
			this.clearSearchFlags();
		}
		this.m_isSearchOnPackage = enableSearchOnPackage;
		this.m_packageFilter = text;
		this.m_packageComparisonOperator = op;
		this.m_withOtherFiltersPackage = withOtherFilters;
		this.resetSyncState();
	}
};
oFF.OlapCatalogManager2.prototype.getPackageFilter = function()
{
	return this.m_packageFilter;
};
oFF.OlapCatalogManager2.prototype.isSearchOnPackage = function()
{
	return this.m_isSearchOnPackage;
};
oFF.OlapCatalogManager2.prototype.setSelectedType = function(type)
{
	this.ensureTypeIsSelectable(type);
	this.m_type = type;
	this.m_types.clear();
	this.m_types.add(type);
	this.resetSyncState();
};
oFF.OlapCatalogManager2.prototype.getSelectedType = function()
{
	return this.m_type;
};
oFF.OlapCatalogManager2.prototype.addSelectedType = function(type)
{
	if (!this.supportsCombinedSearch())
	{
		throw oFF.XException.createIllegalArgumentException("More than 1 Metaobject types not supported");
	}
	this.ensureTypeIsSelectable(type);
	this.m_types.add(type);
	this.resetSyncState();
};
oFF.OlapCatalogManager2.prototype.getSelectedTypes = function()
{
	return this.m_types;
};
oFF.OlapCatalogManager2.prototype.ensureTypeIsSelectable = function(type)
{
	if (this.isLightweightSearch())
	{
		if (type !== oFF.MetaObjectType.QUERY && type !== oFF.MetaObjectType.DEFAULT_REPORT_QUERY && type !== oFF.MetaObjectType.DEFAULT_PLAN_QUERY && type !== oFF.MetaObjectType.FILTER && type !== oFF.MetaObjectType.INFOPROVIDER && type !== oFF.MetaObjectType.ALVL && type !== oFF.MetaObjectType.INFOOBJECT && type !== oFF.MetaObjectType.PLANNING_SEQUENCE && type !== oFF.MetaObjectType.PLANNING_FUNCTION && type !== oFF.MetaObjectType.QUERY_VIEW && type !== oFF.MetaObjectType.CDS_PROJECTION_VIEW)
		{
			throw oFF.XException.createIllegalArgumentException("Only these types are supported when using the lightweight catalog manager: QUERY, DEFAULT_REPORT_QUERY, DEFAULT_PLAN_QUERY, FILTER, INFOPROVIDER, ALVL, INFOOBJECT, PLANNING_SEQUENCE, PLANNING_FUNCTION, QUERY_VIEW");
		}
	}
};
oFF.OlapCatalogManager2.prototype.setSearchFilter = function(filter)
{
	this.m_textFilter = filter;
	this.resetSyncState();
};
oFF.OlapCatalogManager2.prototype.getSearchFilter = function()
{
	return this.m_textFilter;
};
oFF.OlapCatalogManager2.prototype.setResultOffset = function(offset)
{
	this.getQueryManager().setOffsetRows(offset);
	this.resetSyncState();
};
oFF.OlapCatalogManager2.prototype.getResultOffset = function()
{
	return this.getQueryManager().getOffsetRows();
};
oFF.OlapCatalogManager2.prototype.setResultMaxSize = function(maxSize)
{
	this.getQueryManager().setMaxRows(maxSize);
	this.resetSyncState();
};
oFF.OlapCatalogManager2.prototype.getResultMaxSize = function()
{
	return this.getQueryManager().getMaxRows();
};
oFF.OlapCatalogManager2.prototype.setPlanQueryFilter = function(filter)
{
	this.m_planQueryFilter = filter;
};
oFF.OlapCatalogManager2.prototype.getPlanQueryFilter = function()
{
	return this.m_planQueryFilter;
};
oFF.OlapCatalogManager2.prototype.getBaseDataSourceFilter = function()
{
	return this.m_baseDataSourceFilter;
};
oFF.OlapCatalogManager2.prototype.setBaseDataSourceFilter = function(baseDataSourceFilter)
{
	if (this.isLightweightSearch())
	{
		return;
	}
	if (oFF.isNull(baseDataSourceFilter))
	{
		this.m_baseDataSourceFilter = null;
	}
	else
	{
		this.setBaseDataSourceFilterList(null);
		this.m_baseDataSourceFilter = baseDataSourceFilter;
	}
	this.resetSyncState();
};
oFF.OlapCatalogManager2.prototype.setBaseDataSourceFilterList = function(baseDataSourceFilterList)
{
	if (this.isLightweightSearch())
	{
		return;
	}
	if (oFF.isNull(baseDataSourceFilterList))
	{
		this.m_baseDataSourceFilterList = oFF.XObjectExt.release(this.m_baseDataSourceFilterList);
	}
	else
	{
		this.setBaseDataSourceFilter(null);
		this.m_baseDataSourceFilterList = oFF.XListOfString.createFromReadOnlyList(baseDataSourceFilterList);
	}
	this.resetSyncState();
};
oFF.OlapCatalogManager2.prototype.getBaseDataSourceFilterList = function()
{
	return this.m_baseDataSourceFilterList;
};
oFF.OlapCatalogManager2.prototype.getBaseDataSourceTypeFilterList = function()
{
	return this.m_baseDataSourceTypeFilter;
};
oFF.OlapCatalogManager2.prototype.setBaseDataSourceTypeFilterList = function(baseDataSourceTypeFilter)
{
	if (this.isLightweightSearch())
	{
		return;
	}
	this.m_baseDataSourceTypeFilter = baseDataSourceTypeFilter;
	this.resetSyncState();
};
oFF.OlapCatalogManager2.prototype.setInternalTypeIncludeList = function(internalTypeIncludeList)
{
	if (this.isLightweightSearch())
	{
		return;
	}
	if (oFF.XCollectionUtils.hasElements(internalTypeIncludeList))
	{
		this.m_internalTypeIncludeList = oFF.XListOfString.createFromReadOnlyList(internalTypeIncludeList);
	}
	else
	{
		this.m_internalTypeIncludeList = oFF.XObjectExt.release(this.m_internalTypeIncludeList);
	}
	this.resetSyncState();
};
oFF.OlapCatalogManager2.prototype.getInternalTypeIncludeList = function()
{
	return this.m_internalTypeIncludeList;
};
oFF.OlapCatalogManager2.prototype.setInternalTypeExcludeList = function(internalTypeExcludeList)
{
	if (this.isLightweightSearch())
	{
		return;
	}
	if (oFF.XCollectionUtils.hasElements(internalTypeExcludeList))
	{
		this.m_internalTypeExcludeList = oFF.XListOfString.createFromReadOnlyList(internalTypeExcludeList);
	}
	else
	{
		this.m_internalTypeExcludeList = oFF.XObjectExt.release(this.m_internalTypeExcludeList);
	}
	this.resetSyncState();
};
oFF.OlapCatalogManager2.prototype.getInternalTypeExcludeList = function()
{
	return this.m_internalTypeExcludeList;
};
oFF.OlapCatalogManager2.prototype.setDataCategoryFilter = function(dataCategory)
{
	if (!this.getQueryManager().getQueryModel().getModelCapabilities().supportsMetadataDataCategory())
	{
		oFF.noSupport();
	}
	this.m_categoryFilter = dataCategory;
	this.resetSyncState();
};
oFF.OlapCatalogManager2.prototype.getDataCategoryFilter = function()
{
	return this.m_categoryFilter;
};
oFF.OlapCatalogManager2.prototype.isTransientInfoProvidersIncluded = function()
{
	return this.m_isTransientInfoProvidersIncluded;
};
oFF.OlapCatalogManager2.prototype.setTransientInfoProvidersIncluded = function(isIncluded)
{
	this.m_isTransientInfoProvidersIncluded = isIncluded;
};
oFF.OlapCatalogManager2.prototype.setFixedCurrency = function(interestedCurrency)
{
	this.m_interestedCurrency = interestedCurrency;
};

oFF.PlanningCatalogManager = function() {};
oFF.PlanningCatalogManager.prototype = new oFF.QOlapSyncAction();
oFF.PlanningCatalogManager.prototype._ff_c = "PlanningCatalogManager";

oFF.PlanningCatalogManager.CN_OBJECT_NAME = "ObjectName";
oFF.PlanningCatalogManager.CN_BASE_DATA_SOURCE = "BaseDataSource";
oFF.PlanningCatalogManager.CN_PLANNING_TYPE = "PlanningType";
oFF.PlanningCatalogManager.CN_PLANNING_FUNCTION_TYPE = "PlanningFunctionType";
oFF.PlanningCatalogManager.create = function(queryManager)
{
	var object = new oFF.PlanningCatalogManager();
	object.setupCatalogManager(queryManager);
	return object;
};
oFF.PlanningCatalogManager.prototype.m_searchOnPlanningFunctions = false;
oFF.PlanningCatalogManager.prototype.m_searchOnPlanningSequences = false;
oFF.PlanningCatalogManager.prototype.m_textFilter = null;
oFF.PlanningCatalogManager.prototype.m_isSearchOnText = false;
oFF.PlanningCatalogManager.prototype.m_isSearchOnName = false;
oFF.PlanningCatalogManager.prototype.setupCatalogManager = function(queryManager)
{
	this.setupAction(null, null, null, queryManager);
	this.m_isSearchOnText = false;
	this.m_isSearchOnName = false;
	this.m_searchOnPlanningFunctions = true;
	this.m_searchOnPlanningSequences = false;
};
oFF.PlanningCatalogManager.prototype.releaseObject = function()
{
	this.m_textFilter = null;
	oFF.QOlapSyncAction.prototype.releaseObject.call( this );
};
oFF.PlanningCatalogManager.prototype.setSearchOnText = function(enableSearchOnText)
{
	this.m_isSearchOnText = enableSearchOnText;
	this.m_isSearchOnName = !this.m_isSearchOnText;
	this.resetSyncState();
};
oFF.PlanningCatalogManager.prototype.setSearchOnName = function(enableSearchOnName)
{
	this.m_isSearchOnName = enableSearchOnName;
	this.m_isSearchOnText = !this.m_isSearchOnName;
	this.resetSyncState();
};
oFF.PlanningCatalogManager.prototype.isSearchOnText = function()
{
	return this.m_isSearchOnText;
};
oFF.PlanningCatalogManager.prototype.isSearchOnName = function()
{
	return this.m_isSearchOnName;
};
oFF.PlanningCatalogManager.prototype.setSearchFilter = function(filter)
{
	this.m_textFilter = filter;
	this.resetSyncState();
};
oFF.PlanningCatalogManager.prototype.getSearchFilter = function()
{
	return this.m_textFilter;
};
oFF.PlanningCatalogManager.prototype.setSearchOnPlanningFunctions = function(searchOn)
{
	this.m_searchOnPlanningFunctions = searchOn;
};
oFF.PlanningCatalogManager.prototype.isSearchOnPlanningFunctions = function()
{
	return this.m_searchOnPlanningFunctions;
};
oFF.PlanningCatalogManager.prototype.setSearchOnPlanningSequences = function(searchOn)
{
	this.m_searchOnPlanningSequences = searchOn;
};
oFF.PlanningCatalogManager.prototype.isSearchOnPlanningSequences = function()
{
	return this.m_searchOnPlanningSequences;
};
oFF.PlanningCatalogManager.prototype.processGetResult = function(syncType, listener, customIdentifier)
{
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.PlanningCatalogManager.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onPlanningCatalogResult(extResult, data, customIdentifier);
};
oFF.PlanningCatalogManager.prototype.processSynchronization = function(syncType)
{
	var queryModel = this.getQueryManager().getQueryModel();
	var convenienceCommands = queryModel.getConvenienceCommands();
	convenienceCommands.resetToDefault();
	convenienceCommands.moveDimensionToAxis(oFF.PlanningCatalogManager.CN_OBJECT_NAME, oFF.AxisType.ROWS);
	convenienceCommands.addAllFieldsToResultSet(oFF.PlanningCatalogManager.CN_OBJECT_NAME);
	convenienceCommands.moveDimensionToAxis(oFF.PlanningCatalogManager.CN_BASE_DATA_SOURCE, oFF.AxisType.ROWS);
	convenienceCommands.addAllFieldsToResultSet(oFF.PlanningCatalogManager.CN_BASE_DATA_SOURCE);
	convenienceCommands.moveDimensionToAxis(oFF.PlanningCatalogManager.CN_PLANNING_TYPE, oFF.AxisType.ROWS);
	convenienceCommands.addAllFieldsToResultSet(oFF.PlanningCatalogManager.CN_PLANNING_TYPE);
	convenienceCommands.moveDimensionToAxis(oFF.PlanningCatalogManager.CN_PLANNING_FUNCTION_TYPE, oFF.AxisType.ROWS);
	convenienceCommands.addAllFieldsToResultSet(oFF.PlanningCatalogManager.CN_PLANNING_FUNCTION_TYPE);
	var textFilter = this.getSearchFilter();
	if (oFF.notNull(textFilter) && oFF.XString.size(textFilter) > 0)
	{
		if (this.isSearchOnName())
		{
			convenienceCommands.addStringFilterByPresentation(oFF.PlanningCatalogManager.CN_OBJECT_NAME, oFF.PresentationType.KEY, textFilter, oFF.ComparisonOperator.MATCH);
		}
		if (this.isSearchOnText())
		{
			convenienceCommands.addStringFilterByPresentation(oFF.PlanningCatalogManager.CN_OBJECT_NAME, oFF.PresentationType.TEXT, textFilter, oFF.ComparisonOperator.MATCH);
		}
	}
	convenienceCommands.clearFiltersByDimensionName(oFF.PlanningCatalogManager.CN_PLANNING_TYPE);
	var searchOnCount = 0;
	if (this.isSearchOnPlanningFunctions())
	{
		searchOnCount++;
	}
	if (this.isSearchOnPlanningSequences())
	{
		searchOnCount++;
	}
	if (searchOnCount === 1)
	{
		if (this.isSearchOnPlanningFunctions())
		{
			convenienceCommands.addSingleMemberFilterByDimensionName(oFF.PlanningCatalogManager.CN_PLANNING_TYPE, oFF.PlanningOperationType.T_PLANNING_FUNCTION, oFF.ComparisonOperator.EQUAL);
		}
		if (this.isSearchOnPlanningSequences())
		{
			convenienceCommands.addSingleMemberFilterByDimensionName(oFF.PlanningCatalogManager.CN_PLANNING_TYPE, oFF.PlanningOperationType.T_PLANNING_SEQUENCE, oFF.ComparisonOperator.EQUAL);
		}
	}
	this.getQueryManager().processQueryExecution(syncType, this, null);
	return true;
};
oFF.PlanningCatalogManager.prototype.onQueryExecuted = function(extResult, resultSetContainer, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		var classicResultSet = resultSetContainer.getClassicResultSet();
		this.setData(oFF.PlanningCatalogResult.create(classicResultSet, this));
	}
	this.endSync();
};

oFF.PlanningModelCatalogManager = function() {};
oFF.PlanningModelCatalogManager.prototype = new oFF.QOlapSyncAction();
oFF.PlanningModelCatalogManager.prototype._ff_c = "PlanningModelCatalogManager";

oFF.PlanningModelCatalogManager.create = function(service)
{
	var object = new oFF.PlanningModelCatalogManager();
	var systemName = service.getServiceConfig().getSystemName();
	object.setupPlanningModelCatalogManager(service.getOlapEnv(), systemName);
	return object;
};
oFF.PlanningModelCatalogManager.prototype.m_systemName = null;
oFF.PlanningModelCatalogManager.prototype.releaseObject = function()
{
	var data = this.getData();
	if (oFF.notNull(data))
	{
		oFF.XObjectExt.release(data);
	}
	this.m_systemName = null;
	oFF.QOlapSyncAction.prototype.releaseObject.call( this );
};
oFF.PlanningModelCatalogManager.prototype.setupPlanningModelCatalogManager = function(context, systemName)
{
	this.setupAction(null, null, null, context);
	this.m_systemName = systemName;
};
oFF.PlanningModelCatalogManager.prototype.processGetResult = function(syncType, listener, customIdentifier)
{
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.PlanningModelCatalogManager.prototype.processSynchronization = function(syncType)
{
	var connection = this.getApplication().getConnection(this.m_systemName);
	var systemDescription = connection.getSystemDescription();
	var systemType = systemDescription.getSystemType();
	if (!systemType.isTypeOf(oFF.SystemType.HANA))
	{
		throw oFF.XException.createIllegalStateException("illegal system type");
	}
	var ocpFunction = connection.newRpcFunction(systemType.getInAPath());
	var request = ocpFunction.getRpcRequest();
	var requestStructure = this.serializeToJson();
	request.setRequestStructure(requestStructure);
	ocpFunction.processFunctionExecution(syncType, this, null);
	return true;
};
oFF.PlanningModelCatalogManager.prototype.onFunctionExecuted = function(extResult, response, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		var catalogResult = new oFF.PlanningModelCatalogResult();
		var rootStructure = response.getRootElement();
		var responseStructure = oFF.PrFactory.createStructureDeepCopy(rootStructure);
		var messageManager = oFF.MessageManager.createMessageManagerExt(this.getSession());
		catalogResult.processResponseStructure(responseStructure, messageManager);
		this.setData(catalogResult);
	}
	this.endSync();
};
oFF.PlanningModelCatalogManager.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onPlanningModelCatalogResult(extResult, data, customIdentifier);
};
oFF.PlanningModelCatalogManager.prototype.serializeToJson = function()
{
	var request = oFF.PrFactory.createStructure();
	var planningStructure = request.putNewStructure("Planning");
	planningStructure.putString("command", "get_models");
	return request;
};

oFF.OlapCatalogItem = function() {};
oFF.OlapCatalogItem.prototype = new oFF.QDataSource();
oFF.OlapCatalogItem.prototype._ff_c = "OlapCatalogItem";

oFF.OlapCatalogItem.createCatalogItem = function()
{
	var metaObjectId = new oFF.OlapCatalogItem();
	metaObjectId.setupDataSource(null);
	metaObjectId.setText(null);
	metaObjectId.setBaseDataSource(null);
	metaObjectId.setPlanQuery(false);
	metaObjectId.setHasMdxFlag(oFF.TriStateBool._DEFAULT);
	return metaObjectId;
};
oFF.OlapCatalogItem.prototype.m_isPlanQuery = false;
oFF.OlapCatalogItem.prototype.m_hasMdxFlag = null;
oFF.OlapCatalogItem.prototype.m_baseDataSource = null;
oFF.OlapCatalogItem.prototype.m_planningModelName = null;
oFF.OlapCatalogItem.prototype.m_planningModelSchemaName = null;
oFF.OlapCatalogItem.prototype.m_dataCategory = null;
oFF.OlapCatalogItem.prototype.m_internalType = null;
oFF.OlapCatalogItem.prototype.m_currencyKey = null;
oFF.OlapCatalogItem.prototype.m_currencyText = null;
oFF.OlapCatalogItem.prototype.m_currencyTranslationNameKey = null;
oFF.OlapCatalogItem.prototype.m_currencyTranslationNameText = null;
oFF.OlapCatalogItem.prototype.m_currencyTargetKey = null;
oFF.OlapCatalogItem.prototype.m_formulaOperatorKey = null;
oFF.OlapCatalogItem.prototype.m_formulaOperatorText = null;
oFF.OlapCatalogItem.prototype.m_formulaOperatorNumberOfOperands = 0;
oFF.OlapCatalogItem.prototype.m_queryAlias = null;
oFF.OlapCatalogItem.prototype.getCurrencyTranslationNameKey = function()
{
	return this.m_currencyTranslationNameKey;
};
oFF.OlapCatalogItem.prototype.setCurrencyTranslationNameKey = function(currencyTranslationNameKey)
{
	this.m_currencyTranslationNameKey = currencyTranslationNameKey;
};
oFF.OlapCatalogItem.prototype.getCurrencyTranslationNameText = function()
{
	return this.m_currencyTranslationNameText;
};
oFF.OlapCatalogItem.prototype.setCurrencyTranslationNameText = function(currencyTranslationNameText)
{
	this.m_currencyTranslationNameText = currencyTranslationNameText;
};
oFF.OlapCatalogItem.prototype.getCurrencyTargetKey = function()
{
	return this.m_currencyTargetKey;
};
oFF.OlapCatalogItem.prototype.setCurrencyTargetKey = function(currencyTargetKey)
{
	this.m_currencyTargetKey = currencyTargetKey;
};
oFF.OlapCatalogItem.prototype.getCurrencyKey = function()
{
	return this.m_currencyKey;
};
oFF.OlapCatalogItem.prototype.setCurrencyKey = function(currencyKey)
{
	this.m_currencyKey = currencyKey;
};
oFF.OlapCatalogItem.prototype.getCurrencyText = function()
{
	return this.m_currencyText;
};
oFF.OlapCatalogItem.prototype.setCurrencyText = function(currencyText)
{
	this.m_currencyText = currencyText;
};
oFF.OlapCatalogItem.prototype.getFormulaOperatorKey = function()
{
	return this.m_formulaOperatorKey;
};
oFF.OlapCatalogItem.prototype.setFormulaOperatorKey = function(formulaOperatorKey)
{
	this.m_formulaOperatorKey = formulaOperatorKey;
};
oFF.OlapCatalogItem.prototype.getFormulaOperatorText = function()
{
	return this.m_formulaOperatorText;
};
oFF.OlapCatalogItem.prototype.setFormulaOperatorText = function(formulaOperatorText)
{
	this.m_formulaOperatorText = formulaOperatorText;
};
oFF.OlapCatalogItem.prototype.getFormulaOperatorNumberOfOperands = function()
{
	return this.m_formulaOperatorNumberOfOperands;
};
oFF.OlapCatalogItem.prototype.setFormulaOperatorNumberOfOperands = function(formulaOperatorNumberOfOperands)
{
	this.m_formulaOperatorNumberOfOperands = formulaOperatorNumberOfOperands;
};
oFF.OlapCatalogItem.prototype.releaseObject = function()
{
	this.m_baseDataSource = null;
	this.m_planningModelName = null;
	this.m_planningModelSchemaName = null;
	this.m_dataCategory = null;
	this.m_internalType = null;
	this.m_currencyKey = null;
	this.m_currencyText = null;
	this.m_currencyTranslationNameKey = null;
	this.m_currencyTranslationNameText = null;
	this.m_currencyTargetKey = null;
	this.m_formulaOperatorKey = null;
	this.m_formulaOperatorText = null;
	this.m_queryAlias = null;
	oFF.QDataSource.prototype.releaseObject.call( this );
};
oFF.OlapCatalogItem.prototype.getBaseDataSource = function()
{
	return this.m_baseDataSource;
};
oFF.OlapCatalogItem.prototype.setBaseDataSource = function(baseDataSource)
{
	this.m_baseDataSource = baseDataSource;
};
oFF.OlapCatalogItem.prototype.isPlanQuery = function()
{
	return this.m_isPlanQuery;
};
oFF.OlapCatalogItem.prototype.setPlanQuery = function(isPlanQuery)
{
	this.m_isPlanQuery = isPlanQuery;
};
oFF.OlapCatalogItem.prototype.hasMdxFlag = function()
{
	return this.m_hasMdxFlag.getBoolean();
};
oFF.OlapCatalogItem.prototype.hasMdxFlagExt = function()
{
	return this.m_hasMdxFlag;
};
oFF.OlapCatalogItem.prototype.setHasMdxFlag = function(hasMdxFlag)
{
	this.m_hasMdxFlag = hasMdxFlag;
};
oFF.OlapCatalogItem.prototype.getPlanningModelName = function()
{
	return this.m_planningModelName;
};
oFF.OlapCatalogItem.prototype.setPlanningModelName = function(planningModelName)
{
	this.m_planningModelName = planningModelName;
};
oFF.OlapCatalogItem.prototype.getPlanningModelSchemaName = function()
{
	return this.m_planningModelSchemaName;
};
oFF.OlapCatalogItem.prototype.setPlanningModelSchemaName = function(planningModelSchemaName)
{
	this.m_planningModelSchemaName = planningModelSchemaName;
};
oFF.OlapCatalogItem.prototype.getDataCategory = function()
{
	return this.m_dataCategory;
};
oFF.OlapCatalogItem.prototype.setDataCategory = function(dataCategory)
{
	this.m_dataCategory = dataCategory;
};
oFF.OlapCatalogItem.prototype.getInternalType = function()
{
	return this.m_internalType;
};
oFF.OlapCatalogItem.prototype.setInternalType = function(internalType)
{
	this.m_internalType = internalType;
};
oFF.OlapCatalogItem.prototype.getPlanningModelDataSource = function()
{
	if (oFF.XStringUtils.isNullOrEmpty(this.m_planningModelName))
	{
		return null;
	}
	var dataSource = oFF.QFactory.createDataSourceWithType(oFF.MetaObjectType.PLANNING_MODEL, this.m_planningModelName);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_planningModelSchemaName))
	{
		dataSource.setSchemaName(this.m_planningModelSchemaName);
	}
	return dataSource;
};
oFF.OlapCatalogItem.prototype.getTagValue = function(tagName)
{
	return null;
};
oFF.OlapCatalogItem.prototype.getContentElement = function()
{
	return this;
};
oFF.OlapCatalogItem.prototype.getContentConstant = function()
{
	return null;
};
oFF.OlapCatalogItem.prototype.toString = function()
{
	var sb = oFF.XStringBuffer.create();
	var fullQualifiedName = this.getFullQualifiedName();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(fullQualifiedName))
	{
		this.appendDelimiterIfNotEmpty(sb);
		sb.append(fullQualifiedName);
	}
	var text = this.getText();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(text))
	{
		if (oFF.XString.isEqual(text, this.getName()))
		{
			sb.append(" - ");
		}
		else
		{
			sb.append(" + ");
		}
		sb.append(text);
	}
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_internalType))
	{
		this.appendDelimiterIfNotEmpty(sb);
		sb.append("Internal Type: ").append(this.m_internalType);
	}
	if (this.m_isPlanQuery)
	{
		this.appendDelimiterIfNotEmpty(sb);
		sb.append("Is Planning Query");
	}
	var planningModelDataSource = this.getPlanningModelDataSource();
	if (oFF.notNull(planningModelDataSource) && oFF.XStringUtils.isNotNullAndNotEmpty(planningModelDataSource.getFullQualifiedName()))
	{
		this.appendDelimiterIfNotEmpty(sb);
		sb.append(planningModelDataSource.getFullQualifiedName());
	}
	if (oFF.notNull(this.m_baseDataSource) && oFF.XStringUtils.isNotNullAndNotEmpty(this.m_baseDataSource.getFullQualifiedName()))
	{
		this.appendDelimiterIfNotEmpty(sb);
		sb.append("Base Data Source: ").append(this.m_baseDataSource.getFullQualifiedName());
	}
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_dataCategory))
	{
		this.appendDelimiterIfNotEmpty(sb);
		sb.append("Data Category: ").append(this.m_dataCategory);
	}
	return sb.toString();
};
oFF.OlapCatalogItem.prototype.appendDelimiterIfNotEmpty = function(buffer)
{
	if (buffer.length() > 0)
	{
		buffer.append(" | ");
	}
};
oFF.OlapCatalogItem.prototype.setQueryAlias = function(queryAlias)
{
	this.m_queryAlias = queryAlias;
};
oFF.OlapCatalogItem.prototype.getQueryAlias = function()
{
	return this.m_queryAlias;
};

oFF.OlapCatalogImplModule = function() {};
oFF.OlapCatalogImplModule.prototype = new oFF.DfModule();
oFF.OlapCatalogImplModule.prototype._ff_c = "OlapCatalogImplModule";

oFF.OlapCatalogImplModule.s_module = null;
oFF.OlapCatalogImplModule.getInstance = function()
{
	if (oFF.isNull(oFF.OlapCatalogImplModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.OlapImplModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.OlapCatalogApiModule.getInstance());
		oFF.OlapCatalogImplModule.s_module = oFF.DfModule.startExt(new oFF.OlapCatalogImplModule());
		var registrationService = oFF.RegistrationService.getInstance();
		oFF.PlanningCatalogServiceConfig.staticSetup();
		registrationService.addServiceConfig(oFF.OlapCatalogApiModule.XS_PLANNING_CATALOG, oFF.PlanningCatalogServiceConfig.CLAZZ);
		oFF.PlanningCatalogService.staticSetup();
		registrationService.addService(oFF.OlapCatalogApiModule.XS_PLANNING_CATALOG, oFF.PlanningCatalogService.CLAZZ);
		oFF.PlanningModelCatalogServiceConfig.staticSetup();
		registrationService.addServiceConfig(oFF.OlapCatalogApiModule.XS_PLANNING_MODEL_CATALOG, oFF.PlanningModelCatalogServiceConfig.CLAZZ);
		oFF.PlanningModelCatalogService.staticSetup();
		registrationService.addService(oFF.OlapCatalogApiModule.XS_PLANNING_MODEL_CATALOG, oFF.PlanningModelCatalogService.CLAZZ);
		oFF.OlapCatalogService.staticSetup();
		registrationService.addService(oFF.OlapCatalogApiModule.XS_OLAP_CATALOG, oFF.OlapCatalogService.CLAZZ);
		oFF.DfModule.stopExt(oFF.OlapCatalogImplModule.s_module);
	}
	return oFF.OlapCatalogImplModule.s_module;
};
oFF.OlapCatalogImplModule.prototype.getName = function()
{
	return "ff4330.olap.catalog.impl";
};

oFF.OlapCatalogImplModule.getInstance();

return sap.firefly;
	} );