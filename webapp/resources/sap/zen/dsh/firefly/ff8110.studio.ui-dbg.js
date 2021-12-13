/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
[
"sap/zen/dsh/firefly/ff2040.shell","sap/zen/dsh/firefly/ff8100.studio","sap/zen/dsh/firefly/ff2210.ui.native","sap/zen/dsh/firefly/ff3500.sql","sap/zen/dsh/firefly/ff8050.application.ui","sap/zen/dsh/firefly/ff8090.poseidon","sap/zen/dsh/firefly/ff4220.olap.catalog.api","sap/zen/dsh/firefly/ff4410.olap.ip.providers","sap/zen/dsh/firefly/ff4330.olap.catalog.impl","sap/zen/dsh/firefly/ff4340.olap.reference"
],
function(oFF)
{
"use strict";

oFF.SxAction = function() {};
oFF.SxAction.prototype = new oFF.XObject();
oFF.SxAction.prototype._ff_c = "SxAction";

oFF.SxAction.create = function(command, type)
{
	var newObj = new oFF.SxAction();
	newObj.m_command = command;
	newObj.m_type = type;
	return newObj;
};
oFF.SxAction.prototype.m_command = null;
oFF.SxAction.prototype.m_type = null;
oFF.SxAction.prototype.m_position = null;

oFF.SxFilter = function() {};
oFF.SxFilter.prototype = new oFF.XObject();
oFF.SxFilter.prototype._ff_c = "SxFilter";

oFF.SxFilter.prototype.buildTree = function(uiParent, simplex)
{
	var splitter = uiParent.setNewContent(oFF.UiType.VERTICAL_LAYOUT);
	splitter.addNewItemOfType(oFF.UiType.BUTTON).setText("Top");
	splitter.addNewItemOfType(oFF.UiType.BUTTON).setText("Bottom");
};

oFF.SxNode = function() {};
oFF.SxNode.prototype = new oFF.XObject();
oFF.SxNode.prototype._ff_c = "SxNode";

oFF.SxNode.create = function(position, modelComponent, treeNode)
{
	var newObj = new oFF.SxNode();
	newObj.m_position = position;
	newObj.m_modelComponent = modelComponent;
	newObj.m_treeNode = treeNode;
	return newObj;
};
oFF.SxNode.prototype.m_position = null;
oFF.SxNode.prototype.m_modelComponent = null;
oFF.SxNode.prototype.m_treeNode = null;

oFF.FindRefsClass = function() {};
oFF.FindRefsClass.prototype = new oFF.XObject();
oFF.FindRefsClass.prototype._ff_c = "FindRefsClass";

oFF.FindRefsClass.create = function(path, content, index)
{
	var item = new oFF.FindRefsClass();
	item.m_path = path;
	item.m_content = content;
	return item;
};
oFF.FindRefsClass.prototype.m_path = null;
oFF.FindRefsClass.prototype.m_content = null;
oFF.FindRefsClass.prototype.m_clazz = null;
oFF.FindRefsClass.prototype.m_clazzFullName = null;
oFF.FindRefsClass.prototype.m_clazzName = null;
oFF.FindRefsClass.prototype.m_packageName = null;
oFF.FindRefsClass.prototype.getName = function()
{
	return this.m_path;
};
oFF.FindRefsClass.prototype.getXClass = function()
{
	if (oFF.isNull(this.m_packageName))
	{
		var startPackage = oFF.XString.indexOf(this.m_content, "package ");
		var endPackage = oFF.XString.indexOfFrom(this.m_content, ";", startPackage);
		this.m_packageName = oFF.XString.substring(this.m_content, startPackage + 8, endPackage);
		var slash = oFF.XString.lastIndexOf(this.m_path, "/");
		var dot = oFF.XString.lastIndexOf(this.m_path, ".");
		this.m_clazzName = oFF.XString.substring(this.m_path, slash + 1, dot);
		this.m_clazzFullName = oFF.XStringUtils.concatenate3(this.m_packageName, ".", this.m_clazzName);
		this.m_clazz = oFF.XClass.createByName(this.m_clazzFullName);
	}
	return this.m_clazz;
};
oFF.FindRefsClass.prototype.getClazzName = function()
{
	return this.m_clazzName;
};

oFF.FindRefsItem = function() {};
oFF.FindRefsItem.prototype = new oFF.XObject();
oFF.FindRefsItem.prototype._ff_c = "FindRefsItem";

oFF.FindRefsItem.create = function(normalizedPath, nativePath, content, index)
{
	var item = new oFF.FindRefsItem();
	item.m_nativePath = nativePath;
	item.m_content = content;
	return item;
};
oFF.FindRefsItem.prototype.m_nativePath = null;
oFF.FindRefsItem.prototype.m_content = null;
oFF.FindRefsItem.prototype.m_simpleForwardIndex = null;
oFF.FindRefsItem.prototype.getName = function()
{
	return this.m_nativePath;
};
oFF.FindRefsItem.prototype.getNativePath = function()
{
	return this.m_nativePath;
};
oFF.FindRefsItem.prototype.getContent = function()
{
	return this.m_content;
};
oFF.FindRefsItem.prototype.getForwardIndex = function()
{
	if (oFF.isNull(this.m_simpleForwardIndex))
	{
		this.m_simpleForwardIndex = oFF.XList.create();
		oFF.XHashSetOfString.create();
		var tokens = oFF.XListOfString.create();
		var size = oFF.XString.size(this.m_content);
		var c;
		var startPos = 0;
		var isInName = false;
		var isInSpace = false;
		var name;
		for (var index = 0; index <= size; )
		{
			if (index === size)
			{
				c = -1;
			}
			else
			{
				c = oFF.XString.getCharAt(this.m_content, index);
			}
			var isAlpha = c >= 65 && c <= 90 || c >= 97 && c <= 122 || c === 95;
			if (isInName)
			{
				var isNumber = c >= 48 && c <= 57;
				var isAlphaNumeric = isAlpha || isNumber;
				if (isAlphaNumeric === false)
				{
					name = oFF.XString.substring(this.m_content, startPos, index);
					tokens.add(name);
					var ts = tokens.size();
					var isAfterDot = ts > 1 && oFF.XString.isEqual(tokens.get(ts - 2), "[.]");
					var isFireflyClass = ts > 2 && oFF.XString.isEqual(tokens.get(ts - 2), "[.]") && oFF.XString.isEqual(tokens.get(ts - 3), "firefly");
					var token = oFF.FindRefsToken.create(this, name, startPos, isAfterDot, isFireflyClass);
					this.m_simpleForwardIndex.add(token);
					startPos = index;
					isInName = false;
					continue;
				}
			}
			else if (isInSpace)
			{
				if (c !== 32 && c !== 13 && c !== 10)
				{
					startPos = index;
					isInSpace = false;
					continue;
				}
			}
			else if (c === 46)
			{
				if (startPos !== index)
				{
					name = oFF.XString.substring(this.m_content, startPos, index);
					tokens.add(name);
				}
				tokens.add("[.]");
				startPos = index + 1;
			}
			else if (c === 32 || c === 13 || c === 10)
			{
				if (startPos !== index)
				{
					name = oFF.XString.substring(this.m_content, startPos, index);
					tokens.add(oFF.XStringUtils.concatenate3("[", name, "]"));
				}
				isInSpace = true;
				startPos = index;
			}
			else if (isAlpha)
			{
				if (startPos !== index)
				{
					name = oFF.XString.substring(this.m_content, startPos, index);
					tokens.add(oFF.XStringUtils.concatenate3("[", name, "]"));
				}
				isInName = true;
				startPos = index;
			}
			else if (c === -1)
			{
				if (startPos !== index)
				{
					name = oFF.XString.substring(this.m_content, startPos, index);
					tokens.add(oFF.XStringUtils.concatenate3("[", name, "]"));
				}
			}
			index++;
		}
		tokens.size();
	}
	return this.m_simpleForwardIndex;
};

oFF.FindRefsTestMd = function() {};
oFF.FindRefsTestMd.prototype = new oFF.XObject();
oFF.FindRefsTestMd.prototype._ff_c = "FindRefsTestMd";

oFF.FindRefsTestMd.create = function(content)
{
	var item = new oFF.FindRefsTestMd();
	item.m_content = content;
	item.m_name = content.getStringByKey("Name");
	return item;
};
oFF.FindRefsTestMd.prototype.m_content = null;
oFF.FindRefsTestMd.prototype.m_name = null;
oFF.FindRefsTestMd.prototype.m_simpleForwardIndex = null;
oFF.FindRefsTestMd.prototype.getName = function()
{
	return this.m_name;
};
oFF.FindRefsTestMd.prototype.getContent = function()
{
	return this.m_content;
};
oFF.FindRefsTestMd.prototype.getForwardIndex = function()
{
	if (oFF.isNull(this.m_simpleForwardIndex))
	{
		this.m_simpleForwardIndex = oFF.XList.create();
	}
	return this.m_simpleForwardIndex;
};

oFF.SxVarComparator = function() {};
oFF.SxVarComparator.prototype = new oFF.XObject();
oFF.SxVarComparator.prototype._ff_c = "SxVarComparator";

oFF.SxVarComparator.prototype.compare = function(o1, o2)
{
	if (o1.isMandatory() && o2.isMandatory() === false)
	{
		return -1;
	}
	else if (o1.isMandatory() === false && o2.isMandatory())
	{
		return 1;
	}
	else
	{
		var affectedVariables1 = o1.getAffectedVariables();
		var affectedVariables2 = o2.getAffectedVariables();
		if (affectedVariables1.size() === 0 && affectedVariables2.size() > 0)
		{
			return 1;
		}
		else if (affectedVariables1.size() > 0 && affectedVariables2.size() === 0)
		{
			return -1;
		}
		else
		{
			return 0;
		}
	}
};

oFF.SxVarGeneric = function() {};
oFF.SxVarGeneric.prototype = new oFF.XObject();
oFF.SxVarGeneric.prototype._ff_c = "SxVarGeneric";

oFF.SxVarGeneric.prototype.m_variable = null;
oFF.SxVarGeneric.prototype.m_index = 0;
oFF.SxVarGeneric.prototype.m_matrixLayout = null;
oFF.SxVarGeneric.prototype.m_initialRow = null;
oFF.SxVarGeneric.prototype.m_myRows = null;
oFF.SxVarGeneric.prototype.m_componentLines = null;
oFF.SxVarGeneric.prototype.m_dependencies = null;
oFF.SxVarGeneric.prototype.m_varScreen = null;
oFF.SxVarGeneric.prototype.setupGenericVariable = function(varScreen, variable, index, matrixLayout)
{
	this.m_varScreen = varScreen;
	this.m_matrixLayout = matrixLayout;
	this.m_variable = variable;
	this.m_index = index;
	this.m_myRows = oFF.XList.create();
	this.m_componentLines = oFF.XList.create();
	this.m_dependencies = oFF.XList.create();
};
oFF.SxVarGeneric.prototype.addDependency = function(other)
{
	this.m_dependencies.add(other);
};
oFF.SxVarGeneric.prototype.getVariable = function()
{
	return this.m_variable;
};
oFF.SxVarGeneric.prototype.getIndex = function()
{
	return this.m_index;
};
oFF.SxVarGeneric.prototype.render = function()
{
	if (oFF.isNull(this.m_initialRow))
	{
		this.m_initialRow = this.m_matrixLayout.addNewMatrixLayoutRow();
	}
	else
	{
		this.removeAll();
	}
	this.m_myRows.add(this.m_initialRow);
	var startIndex = this.m_matrixLayout.getIndexOfMatrixLayoutRow(this.m_initialRow);
	var max = this.size();
	for (var i = 1; i < max; i++)
	{
		var newRow = this.m_matrixLayout.newMatrixLayoutRow();
		this.m_matrixLayout.insertMatrixLayoutRow(newRow, startIndex + i);
		this.m_myRows.add(newRow);
	}
	for (var j = 0; j < max; j++)
	{
		var componentLine = this.renderLine(j, this.m_myRows.get(j));
		this.m_componentLines.add(componentLine);
	}
	this.fillValues();
};
oFF.SxVarGeneric.prototype.removeAll = function()
{
	for (var i = 0; i < this.m_myRows.size(); i++)
	{
		var row = this.m_myRows.get(i);
		if (i === 0)
		{
			row.clearMatrixLayoutCells();
		}
		else
		{
			this.m_matrixLayout.removeMatrixLayoutRow(row);
		}
	}
	this.m_myRows.clear();
	this.m_componentLines.clear();
};
oFF.SxVarGeneric.prototype.renderLine = oFF.noSupport;
oFF.SxVarGeneric.prototype.renderLineStart = function(withInfo, row)
{
	if (withInfo)
	{
		var buffer;
		if (this.m_varScreen.isVerbose())
		{
			var cell0 = row.addNewMatrixLayoutCell();
			buffer = oFF.XStringBuffer.create();
			if (this.m_variable.isMandatory())
			{
				buffer.append("* ");
			}
			cell0.setNewContent(oFF.UiType.LABEL).setText(buffer.toString());
			var cellNumber = row.addNewMatrixLayoutCell();
			cellNumber.setNewContent(oFF.UiType.LABEL).setText(oFF.XInteger.convertToString(this.m_index));
			var cellDependsOn = row.addNewMatrixLayoutCell();
			buffer = oFF.XStringBuffer.create();
			for (var i = 0; i < this.m_dependencies.size(); i++)
			{
				if (i > 0)
				{
					buffer.append(", ");
				}
				buffer.appendInt(this.m_dependencies.get(i).getIndex());
			}
			cellDependsOn.setNewContent(oFF.UiType.LABEL).setText(buffer.toString());
			var cell1 = row.addNewMatrixLayoutCell();
			buffer = oFF.XStringBuffer.create();
			var variableType = this.m_variable.getVariableType();
			buffer.append("{");
			buffer.append(variableType.getName());
			if (variableType.isTypeOf(oFF.VariableType.SIMPLE_TYPE_VARIABLE))
			{
				buffer.append(": ");
				buffer.append(this.m_variable.getValueType().getName());
				var stv = this.m_variable;
				if (stv.supportsMultipleValues())
				{
					buffer.append(" & MultiValue");
				}
			}
			buffer.append("} ");
			cell1.setNewContent(oFF.UiType.LABEL).setText(buffer.toString());
		}
		var cell2 = row.addNewMatrixLayoutCell();
		buffer = oFF.XStringBuffer.create();
		if (this.m_variable.getDependentVariables().size() === 1 && this.m_variable.getAffectedVariables().size() === 0)
		{
			buffer.append("\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0");
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_variable.getText()) && oFF.XString.isEqual(this.m_variable.getText(), this.m_variable.getName()) === false)
		{
			buffer.append(this.m_variable.getText());
			buffer.append(" [");
			buffer.append(this.m_variable.getName());
			buffer.append("]");
		}
		else
		{
			buffer.append(this.m_variable.getName());
		}
		cell2.setNewContent(oFF.UiType.LABEL).setText(buffer.toString());
	}
	else
	{
		row.addNewMatrixLayoutCell().setColumnSpan(5);
	}
};
oFF.SxVarGeneric.prototype.disable = function()
{
	for (var i = 0; i < this.m_componentLines.size(); i++)
	{
		var line = this.m_componentLines.get(i);
		line.disableComponent();
	}
};
oFF.SxVarGeneric.prototype.enable = function()
{
	for (var i = 0; i < this.m_componentLines.size(); i++)
	{
		var line = this.m_componentLines.get(i);
		line.enableComponent();
	}
};
oFF.SxVarGeneric.prototype.fillValueHelp = function()
{
	for (var i = 0; i < this.m_componentLines.size(); i++)
	{
		var line = this.m_componentLines.get(i);
		line.clearComponentValueHelp();
		line.fillComponentValueHelp();
	}
};
oFF.SxVarGeneric.prototype.maintainValueHelp = function() {};
oFF.SxVarGeneric.prototype.fillValues = function() {};
oFF.SxVarGeneric.prototype.fetchValues = function()
{
	for (var i = 0; i < this.m_componentLines.size(); i++)
	{
		var line = this.m_componentLines.get(i);
		line.fetchComponentValueFromInput();
	}
};
oFF.SxVarGeneric.prototype.revalidate = function() {};
oFF.SxVarGeneric.prototype.size = function()
{
	return 1;
};
oFF.SxVarGeneric.prototype.addNewLine = function(peerComponent)
{
	var peerRow = peerComponent.getRow();
	var index = this.m_matrixLayout.getIndexOfMatrixLayoutRow(peerRow) + 1;
	var componentIndex = this.m_componentLines.getIndex(peerComponent) + 1;
	var newRow = this.m_matrixLayout.newMatrixLayoutRow();
	this.m_matrixLayout.insertMatrixLayoutRow(newRow, index);
	this.renderLineStart(false, newRow);
	var line = this.newLine(newRow);
	line.enableComponent();
	this.m_componentLines.insert(componentIndex, line);
	line.fillComponentValueHelp();
};
oFF.SxVarGeneric.prototype.newLine = oFF.noSupport;
oFF.SxVarGeneric.prototype.removeLine = function(line)
{
	if (this.m_componentLines.size() > 1)
	{
		var row = line.getRow();
		this.m_matrixLayout.removeMatrixLayoutRow(row);
		this.m_componentLines.removeElement(line);
	}
};
oFF.SxVarGeneric.prototype.getVarScreen = function()
{
	return this.m_varScreen;
};

oFF.AxisInfo = function() {};
oFF.AxisInfo.prototype = new oFF.XObject();
oFF.AxisInfo.prototype._ff_c = "AxisInfo";

oFF.AxisInfo.prototype.m_settings = null;
oFF.AxisInfo.prototype.m_axisName = null;
oFF.AxisInfo.prototype.setupAxisInfo = function(axisName, settings)
{
	this.m_axisName = axisName;
	this.m_settings = settings;
};
oFF.AxisInfo.prototype.getSettings = function()
{
	return this.m_settings;
};
oFF.AxisInfo.prototype.getAxisName = function()
{
	return this.m_axisName;
};
oFF.AxisInfo.prototype.getQueryViewAxis = function()
{
	if (this.m_settings.getQueryView() === null)
	{
		return null;
	}
	return this.m_settings.getQueryView().getAxis(this.getAxisName());
};
oFF.AxisInfo.prototype.getResultsetAxis = function()
{
	if (this.m_settings.getQueryView() === null)
	{
		return null;
	}
	var rs = this.getSettings().getQueryManager().getClassicResultSet();
	return rs.getAxis(this.getAxisName());
};
oFF.AxisInfo.prototype.refresh = oFF.noSupport;

oFF.PivotCellFactory = function() {};
oFF.PivotCellFactory.prototype = new oFF.XObject();
oFF.PivotCellFactory.prototype._ff_c = "PivotCellFactory";

oFF.PivotCellFactory.prototype.createDataCell = function()
{
	return oFF.DataPivotCell.createDataPivotCell();
};
oFF.PivotCellFactory.prototype.createHeaderCell = function()
{
	return oFF.HeaderPivotCell.createHeaderPivotCell();
};
oFF.PivotCellFactory.prototype.createScalingCell = function()
{
	return oFF.PivotCell.createScalingCell();
};
oFF.PivotCellFactory.prototype.createSelectCell = function(axis, isEnabled, isSelected)
{
	return oFF.PivotCell.createSelectCell(axis, isEnabled, isSelected);
};
oFF.PivotCellFactory.prototype.createTitleCell = function()
{
	return oFF.PivotCell.createTitleCell();
};
oFF.PivotCellFactory.prototype.createTwinCell = function()
{
	return oFF.PivotCell.createTwinCell();
};
oFF.PivotCellFactory.prototype.createTitleCellWithSettings = function(settings, titleState, axisReference, isTwinCellContent)
{
	return oFF.TitleCellFactory.createCell(settings, titleState, axisReference, isTwinCellContent);
};
oFF.PivotCellFactory.prototype.createTwinCellWithSettings = function(settings, titleStateLeft, titleStateRight)
{
	return oFF.TitleCellFactory.createTwinCell(settings, titleStateLeft, titleStateRight);
};

oFF.PivotTableManager = function() {};
oFF.PivotTableManager.prototype = new oFF.XObject();
oFF.PivotTableManager.prototype._ff_c = "PivotTableManager";

oFF.PivotTableManager.create = function()
{
	var object = new oFF.PivotTableManager();
	object.setup();
	return object;
};
oFF.PivotTableManager.prototype.m_uniGridMatrix = null;
oFF.PivotTableManager.prototype.m_validDataset = false;
oFF.PivotTableManager.prototype.m_validRendering = false;
oFF.PivotTableManager.prototype.m_resultSetState = null;
oFF.PivotTableManager.prototype.m_settings = null;
oFF.PivotTableManager.prototype.m_dynamicAttributesRows = null;
oFF.PivotTableManager.prototype.m_dynamicAttributesColumns = null;
oFF.PivotTableManager.prototype.m_momentumRows = null;
oFF.PivotTableManager.prototype.m_momentumColumns = null;
oFF.PivotTableManager.prototype.setup = function()
{
	oFF.XObject.prototype.setup.call( this );
	this.m_settings = oFF.PivotTableSettings.create();
};
oFF.PivotTableManager.prototype.getSettings = function()
{
	return this.m_settings;
};
oFF.PivotTableManager.prototype.setSettings = function(settings)
{
	this.m_settings = settings;
};
oFF.PivotTableManager.prototype.getClientType = function()
{
	return this.m_settings.getClientType();
};
oFF.PivotTableManager.prototype.getCellFactory = function()
{
	return this.m_settings.getCellFactory();
};
oFF.PivotTableManager.prototype.getApplication = function()
{
	return this.m_settings.getQueryView().getApplication();
};
oFF.PivotTableManager.prototype.getVirtualMatrix = function()
{
	this.buildVirtualMatrix();
	return this.m_uniGridMatrix;
};
oFF.PivotTableManager.prototype.buildVirtualMatrix = function()
{
	var tableInterface = this.m_settings.getTableInterface();
	if (oFF.notNull(tableInterface))
	{
		tableInterface.setSettings(this.m_settings);
		tableInterface.initMatrixBuild();
	}
	var hasDatasetChanged = this.validateDataset();
	var hasRenderingChanged = this.validateRendering();
	if (hasDatasetChanged)
	{
		return 2;
	}
	else if (hasRenderingChanged)
	{
		return 1;
	}
	else
	{
		return 0;
	}
};
oFF.PivotTableManager.prototype.getResultSetState = function()
{
	return this.m_resultSetState;
};
oFF.PivotTableManager.prototype.validateDataset = function()
{
	if (this.m_validDataset)
	{
		return false;
	}
	if (this.m_settings.getQueryView() !== null)
	{
		this.m_resultSetState = this.checkResultSetState();
		if (this.m_resultSetState.hasData() || this.m_settings.getNewLinesCount() > 0)
		{
			if (oFF.isNull(this.m_dynamicAttributesRows))
			{
				this.m_dynamicAttributesRows = oFF.AxisDynamicAttributes.create(oFF.AxisType.ROWS, this.m_settings);
			}
			if (oFF.isNull(this.m_dynamicAttributesColumns))
			{
				this.m_dynamicAttributesColumns = oFF.AxisDynamicAttributes.create(oFF.AxisType.COLUMNS, this.m_settings);
			}
			this.m_dynamicAttributesRows.refresh(0);
			this.m_dynamicAttributesColumns.refresh(0);
		}
		else
		{
			this.m_dynamicAttributesRows = null;
			this.m_dynamicAttributesColumns = null;
		}
	}
	else
	{
		this.m_resultSetState = oFF.ResultSetState.NO_DATA_AVAILABLE;
		this.m_dynamicAttributesRows = null;
		this.m_dynamicAttributesColumns = null;
	}
	this.m_validDataset = true;
	this.invalidateRendering();
	return true;
};
oFF.PivotTableManager.prototype.invalidateDataset = function()
{
	this.m_validDataset = false;
};
oFF.PivotTableManager.prototype.checkResultSetState = function()
{
	var qm = this.m_settings.getQueryManager();
	var rs = qm.getClassicResultSet();
	var rsState = rs.getState();
	return rsState;
};
oFF.PivotTableManager.prototype.invalidateRendering = function()
{
	this.m_validRendering = false;
};
oFF.PivotTableManager.prototype.validateRendering = function()
{
	if (this.m_validRendering)
	{
		return false;
	}
	if (this.m_resultSetState.hasData() || this.m_settings.getNewLinesCount() > 0)
	{
		var columnSettings = this.m_settings.getAxisSettings(oFF.UiAxisType.COLUMNS);
		var rowSettings = this.m_settings.getAxisSettings(oFF.UiAxisType.ROWS);
		if (columnSettings.isHeaderVisible() || rowSettings.isHeaderVisible() || this.m_settings.isDataVisible())
		{
			if (this.m_dynamicAttributesRows.getQueryViewAxis().isHierarchyActive())
			{
				this.m_momentumRows = oFF.Section_I_MomentumHier.create(this.m_dynamicAttributesRows);
			}
			else
			{
				this.m_momentumRows = oFF.Section_I_MomentumStd.create(this.m_dynamicAttributesRows);
			}
			this.m_momentumRows.setHasMasterdataDocuments(this.m_settings.hasDocIconsMasterData());
			this.m_momentumRows.setHasMetadataDocuments(this.m_settings.hasDocIconsMetaData());
			this.m_momentumRows.initAxis();
			if (this.m_dynamicAttributesColumns.getQueryViewAxis().isHierarchyActive())
			{
				this.m_momentumColumns = oFF.Section_I_MomentumHier.create(this.m_dynamicAttributesColumns);
			}
			else
			{
				this.m_momentumColumns = oFF.Section_I_MomentumStd.create(this.m_dynamicAttributesColumns);
			}
			this.m_momentumColumns.setHasMasterdataDocuments(this.m_settings.hasDocIconsMasterData());
			this.m_momentumColumns.setHasMetadataDocuments(this.m_settings.hasDocIconsMetaData());
			this.m_momentumColumns.initAxis();
			var currentMatrix;
			var cellFactory = this.getCellFactory();
			var section_I = oFF.Section_I.create(this.getClientType(), this.m_settings, this.m_momentumRows, this.m_momentumColumns, cellFactory);
			var section_II = oFF.Section_II_III.create(this.getClientType(), this.m_momentumColumns, cellFactory);
			var section_III = oFF.Section_II_III.create(this.getClientType(), this.m_momentumRows, cellFactory);
			var result = this.m_settings.getQueryManager().getClassicResultSet();
			var section_IV = oFF.Section_IV.create(this.getClientType(), this.getApplication(), section_III, section_II, result, this.m_settings.hasDocIconsData(), cellFactory);
			var virtualMatrix = new oFF.VirtualMatrixBlockMerge();
			virtualMatrix.setupBlockMerge(this.getClientType(), cellFactory);
			currentMatrix = virtualMatrix;
			if (rowSettings.isHeaderVisible() && columnSettings.isHeaderVisible())
			{
				virtualMatrix.setSection_I(section_I);
			}
			virtualMatrix.setDropObjectForBlankSectionII(this.m_settings.getQueryView().getAxis(oFF.AxisType.COLUMNS));
			if (columnSettings.isHeaderVisible())
			{
				var section_II_pv = oFF.VirtualMatrixPivot.create(section_II);
				virtualMatrix.setSection_II(section_II_pv);
			}
			else
			{
				virtualMatrix.setSection_II_hidden(section_II);
			}
			virtualMatrix.setDropObjectForBlankSectionIII(this.m_settings.getQueryView().getAxis(oFF.AxisType.ROWS));
			if (rowSettings.isHeaderVisible())
			{
				virtualMatrix.setSection_III(section_III);
			}
			else
			{
				virtualMatrix.setSection_III_hidden(section_III);
			}
			if (this.m_settings.isDataVisible() && result.getAvailableDataCellCount() > 0)
			{
				virtualMatrix.setSection_IV(section_IV);
			}
			virtualMatrix.prepareMatrix();
			var callback = this.m_settings.getInteractiveMatrixCallback();
			if (oFF.notNull(callback))
			{
				var insertProcessedMatrix = callback.insertLines(currentMatrix, section_III, section_II, section_IV);
				currentMatrix = insertProcessedMatrix;
			}
			var rowsBlockSize = rowSettings.getBlockSize();
			var colsBlockSize = columnSettings.getBlockSize();
			var blockRowSize = this.m_settings.getBlockRowSize();
			var blockColumnSize = this.m_settings.getBlockColumnSize();
			if (blockRowSize === 0)
			{
				rowsBlockSize = -1;
			}
			else
			{
				rowsBlockSize = blockRowSize;
			}
			if (blockColumnSize === 0)
			{
				colsBlockSize = -1;
			}
			else
			{
				colsBlockSize = blockColumnSize;
			}
			if (rowsBlockSize === -1)
			{
				rowSettings.setBlockSize(currentMatrix.getRowCount());
			}
			if (colsBlockSize === -1)
			{
				columnSettings.setBlockSize(currentMatrix.getColumnCount());
			}
			var gsp = oFF.VirtualMatrixGlobalSettings.create(currentMatrix, this.m_settings);
			currentMatrix = gsp;
			var matrixConverter = this.createMatrixConverter(currentMatrix, "mc");
			var clipping = oFF.MxGridVirtualClipping.create("Data Area Window", matrixConverter.getMatrixClient(), matrixConverter);
			clipping.setHorizontalPosition(this.m_settings.getAxisSettings(oFF.UiAxisType.COLUMNS).getDataFrom());
			clipping.setMaxVisibleScrollableColumns(this.m_settings.getAxisSettings(oFF.UiAxisType.COLUMNS).getDataMaxCount());
			clipping.setVerticalPosition(this.m_settings.getAxisSettings(oFF.UiAxisType.ROWS).getDataFrom());
			clipping.setMaxVisibleScrollableRows(this.m_settings.getAxisSettings(oFF.UiAxisType.ROWS).getDataMaxCount());
			this.m_uniGridMatrix = clipping;
			var tableInterface = this.m_settings.getTableInterface();
			if (oFF.notNull(tableInterface))
			{
				this.m_uniGridMatrix = tableInterface.getMatrix(this.getClientType(), this.m_uniGridMatrix);
			}
			if (this.m_settings.hasDeepCopyLayer())
			{
				var deepCopy = new oFF.VirtualMatrixDeepCopy();
				deepCopy.setupExt("DeepCopy", this.getClientType(), this.m_uniGridMatrix);
				this.m_uniGridMatrix = deepCopy;
			}
		}
		else
		{
			this.m_uniGridMatrix = null;
		}
	}
	else
	{
		this.m_uniGridMatrix = null;
	}
	this.m_validRendering = true;
	return true;
};
oFF.PivotTableManager.prototype.createMatrixConverter = function(sourceMatrix, matrixNamespace)
{
	var targetMatrix;
	var cmf = this.m_settings.getConverterMatrixFactory();
	if (oFF.notNull(cmf))
	{
		targetMatrix = cmf.createConverterMatrix(sourceMatrix, matrixNamespace);
	}
	else
	{
		targetMatrix = sourceMatrix;
	}
	return targetMatrix;
};

oFF.ArrayObjectPool = function() {};
oFF.ArrayObjectPool.prototype = new oFF.XObject();
oFF.ArrayObjectPool.prototype._ff_c = "ArrayObjectPool";

oFF.ArrayObjectPool.create = function(isEnabled)
{
	var list = new oFF.ArrayObjectPool();
	list.setupExt(isEnabled);
	return list;
};
oFF.ArrayObjectPool.prototype.m_recycleIndex = 0;
oFF.ArrayObjectPool.prototype.m_recycleList = null;
oFF.ArrayObjectPool.prototype.setupExt = function(isEnabled)
{
	this.m_recycleIndex = 0;
	if (isEnabled)
	{
		this.m_recycleList = oFF.XList.create();
	}
};
oFF.ArrayObjectPool.prototype.resetIndex = function()
{
	this.m_recycleIndex = 0;
};
oFF.ArrayObjectPool.prototype.hasFreeObject = function()
{
	if (oFF.isNull(this.m_recycleList))
	{
		return false;
	}
	return this.m_recycleList.size() > this.m_recycleIndex;
};
oFF.ArrayObjectPool.prototype.next = function()
{
	if (oFF.isNull(this.m_recycleList))
	{
		throw oFF.XException.createIllegalStateException("Recycling is not enabled");
	}
	var object = this.m_recycleList.get(this.m_recycleIndex);
	this.m_recycleIndex++;
	for (var i = 0; i < object.size(); i++)
	{
		object.set(i, null);
	}
	return object;
};
oFF.ArrayObjectPool.prototype.nextWithObject = function(newObject)
{
	if (oFF.isNull(this.m_recycleList))
	{
		return newObject;
	}
	this.m_recycleList.add(newObject);
	return this.next();
};

oFF.ControlPool = function() {};
oFF.ControlPool.prototype = new oFF.XObject();
oFF.ControlPool.prototype._ff_c = "ControlPool";

oFF.ControlPool.create = function(isEnabled)
{
	var object = new oFF.ControlPool();
	object.setupExt(isEnabled);
	return object;
};
oFF.ControlPool.prototype.m_recycleIndex = 0;
oFF.ControlPool.prototype.m_recycleList = null;
oFF.ControlPool.prototype.setupExt = function(isEnabled)
{
	this.m_recycleIndex = 0;
	if (isEnabled)
	{
		this.m_recycleList = oFF.XList.create();
	}
};
oFF.ControlPool.prototype.resetIndex = function()
{
	this.m_recycleIndex = 0;
};
oFF.ControlPool.prototype.hasFreeObject = function()
{
	if (oFF.isNull(this.m_recycleList))
	{
		return false;
	}
	return this.m_recycleList.size() > this.m_recycleIndex;
};
oFF.ControlPool.prototype.next = function()
{
	if (oFF.isNull(this.m_recycleList))
	{
		throw oFF.XException.createIllegalStateException("Recycling is not enabled");
	}
	var object = this.m_recycleList.get(this.m_recycleIndex);
	this.m_recycleIndex++;
	object.reset();
	return object;
};
oFF.ControlPool.prototype.nextWithNewObject = function(newObject)
{
	if (oFF.isNull(this.m_recycleList))
	{
		return newObject;
	}
	this.m_recycleList.add(newObject);
	return this.next();
};

oFF.InnerContentContainer = function() {};
oFF.InnerContentContainer.prototype = new oFF.XObject();
oFF.InnerContentContainer.prototype._ff_c = "InnerContentContainer";

oFF.InnerContentContainer.create = function()
{
	var object = new oFF.InnerContentContainer();
	object.setup();
	return object;
};
oFF.InnerContentContainer.prototype.m_cell = null;
oFF.InnerContentContainer.prototype.combinedContent = null;
oFF.InnerContentContainer.prototype.blankSpanContent = null;
oFF.InnerContentContainer.prototype.textContent = null;
oFF.InnerContentContainer.prototype.dataInputContent = null;
oFF.InnerContentContainer.prototype.tupleElementInputContent = null;
oFF.InnerContentContainer.prototype.hierarchyContent = null;
oFF.InnerContentContainer.prototype.exceptionSymbolContent = null;
oFF.InnerContentContainer.prototype.docSymbolContent = null;
oFF.InnerContentContainer.prototype.lockedSymbolContent = null;
oFF.InnerContentContainer.prototype.microContent = null;
oFF.InnerContentContainer.prototype.sortIconContent = null;
oFF.InnerContentContainer.prototype.mimeBeforeTextContent = null;
oFF.InnerContentContainer.prototype.mimeAfterTextContent = null;
oFF.InnerContentContainer.prototype.m_elementList = null;
oFF.InnerContentContainer.prototype.setup = function()
{
	this.m_elementList = oFF.XList.create();
};
oFF.InnerContentContainer.prototype.reset = function()
{
	this.m_cell = null;
	this.combinedContent = null;
	this.textContent = null;
	this.dataInputContent = null;
	this.tupleElementInputContent = null;
	this.hierarchyContent = null;
	this.exceptionSymbolContent = null;
	this.docSymbolContent = null;
	this.lockedSymbolContent = null;
	this.microContent = null;
	this.sortIconContent = null;
	this.mimeBeforeTextContent = null;
	this.mimeAfterTextContent = null;
	this.m_elementList.clear();
};
oFF.InnerContentContainer.prototype.setDocSymbolContent = function(docSymbolContent)
{
	this.docSymbolContent = docSymbolContent;
};
oFF.InnerContentContainer.prototype.setLockedSymbolContent = function(lockedSymbolContent)
{
	this.lockedSymbolContent = lockedSymbolContent;
};
oFF.InnerContentContainer.prototype.setExceptionSymbolContent = function(exceptionSymbolContent)
{
	this.exceptionSymbolContent = exceptionSymbolContent;
};
oFF.InnerContentContainer.prototype.setTextContent = function(textContent)
{
	this.textContent = textContent;
};
oFF.InnerContentContainer.prototype.getTextContent = function()
{
	return this.textContent;
};
oFF.InnerContentContainer.prototype.setDataInputContent = function(dataInputContent)
{
	this.dataInputContent = dataInputContent;
};
oFF.InnerContentContainer.prototype.getDataInputContent = function()
{
	return this.dataInputContent;
};
oFF.InnerContentContainer.prototype.setTupleElementInputContent = function(inputContent)
{
	this.tupleElementInputContent = inputContent;
};
oFF.InnerContentContainer.prototype.getTupleElementInputContent = function()
{
	return this.tupleElementInputContent;
};
oFF.InnerContentContainer.prototype.setHierarchyContent = function(hierarchyContent)
{
	this.hierarchyContent = hierarchyContent;
};
oFF.InnerContentContainer.prototype.getHierarchyContent = function()
{
	return this.hierarchyContent;
};
oFF.InnerContentContainer.prototype.getExceptionSymbolContent = function()
{
	return this.exceptionSymbolContent;
};
oFF.InnerContentContainer.prototype.getDocSymbolContent = function()
{
	return this.docSymbolContent;
};
oFF.InnerContentContainer.prototype.getLockedSymbolContent = function()
{
	return this.lockedSymbolContent;
};
oFF.InnerContentContainer.prototype.getMicroContent = function()
{
	return this.microContent;
};
oFF.InnerContentContainer.prototype.setMicroContent = function(microContent)
{
	this.microContent = microContent;
};
oFF.InnerContentContainer.prototype.getBlankSpanContent = function()
{
	return this.blankSpanContent;
};
oFF.InnerContentContainer.prototype.setBlankSpanContent = function(blankSpanContent)
{
	this.blankSpanContent = blankSpanContent;
};
oFF.InnerContentContainer.prototype.getSortIconContent = function()
{
	return this.sortIconContent;
};
oFF.InnerContentContainer.prototype.setSortIconContent = function(sortIconContent)
{
	this.sortIconContent = sortIconContent;
};
oFF.InnerContentContainer.prototype.getMimeAfterTextContent = function()
{
	return this.mimeAfterTextContent;
};
oFF.InnerContentContainer.prototype.setMimeAfterTextContent = function(mimeAfterTextContent)
{
	this.mimeAfterTextContent = mimeAfterTextContent;
};
oFF.InnerContentContainer.prototype.getMimeBeforeTextContent = function()
{
	return this.mimeBeforeTextContent;
};
oFF.InnerContentContainer.prototype.setMimeBeforeTextContent = function(mimeBeforeTextContent)
{
	this.mimeBeforeTextContent = mimeBeforeTextContent;
};
oFF.InnerContentContainer.prototype.getCombinedContent = function()
{
	return this.combinedContent;
};
oFF.InnerContentContainer.prototype.setCombinedContent = function(combinedContent)
{
	this.combinedContent = combinedContent;
};
oFF.InnerContentContainer.prototype.getCell = function()
{
	return this.m_cell;
};
oFF.InnerContentContainer.prototype.setCell = function(cell)
{
	this.m_cell = cell;
};
oFF.InnerContentContainer.prototype.getElementList = function()
{
	this.m_elementList.clear();
	if (this.getHierarchyContent() !== null)
	{
		var elements = this.getHierarchyContent();
		for (var i = 0; i < elements.size(); i++)
		{
			var element = elements.get(i);
			if (oFF.notNull(element))
			{
				this.m_elementList.add(element);
			}
		}
	}
	if (this.getLockedSymbolContent() !== null)
	{
		this.m_elementList.add(this.getLockedSymbolContent());
	}
	if (this.getDocSymbolContent() !== null)
	{
		this.m_elementList.add(this.getDocSymbolContent());
	}
	if (this.getMimeBeforeTextContent() !== null)
	{
		this.m_elementList.add(this.getMimeBeforeTextContent());
	}
	if (this.getDataInputContent() !== null)
	{
		var elements3 = this.getDataInputContent();
		for (var j = 0; j < elements3.size(); j++)
		{
			var element3 = elements3.get(j);
			if (oFF.notNull(element3))
			{
				this.m_elementList.add(element3);
			}
		}
	}
	if (this.getTupleElementInputContent() !== null)
	{
		var elements2 = this.getTupleElementInputContent();
		for (var k = 0; k < elements2.size(); k++)
		{
			var element2 = elements2.get(k);
			if (oFF.notNull(element2))
			{
				this.m_elementList.add(element2);
			}
		}
	}
	if (this.getTextContent() !== null)
	{
		this.m_elementList.add(this.getTextContent());
	}
	if (this.getMicroContent() !== null)
	{
		this.m_elementList.add(this.getMicroContent());
	}
	if (this.getMimeAfterTextContent() !== null)
	{
		this.m_elementList.add(this.getMimeAfterTextContent());
	}
	if (this.getSortIconContent() !== null)
	{
		this.m_elementList.add(this.getSortIconContent());
	}
	return this.m_elementList;
};
oFF.InnerContentContainer.prototype.addToElementArray = function(innerContentArray)
{
	var index = innerContentArray.size() - 1;
	while (index >= 0 && innerContentArray.get(index) === null)
	{
		index--;
	}
	index++;
	if (this.getHierarchyContent() !== null)
	{
		var elements = this.getHierarchyContent();
		for (var i = 0; i < elements.size(); i++)
		{
			var element = elements.get(i);
			if (oFF.notNull(element))
			{
				innerContentArray.set(index, element);
				index++;
			}
		}
	}
	if (this.getLockedSymbolContent() !== null)
	{
		innerContentArray.set(index, this.getLockedSymbolContent());
		index++;
	}
	if (this.getDocSymbolContent() !== null)
	{
		innerContentArray.set(index, this.getDocSymbolContent());
		index++;
	}
	if (this.getMimeBeforeTextContent() !== null)
	{
		innerContentArray.set(index, this.getMimeBeforeTextContent());
		index++;
	}
	if (this.getDataInputContent() !== null)
	{
		var elements3 = this.getDataInputContent();
		for (var j = 0; j < elements3.size(); j++)
		{
			var element3 = elements3.get(j);
			if (oFF.notNull(element3))
			{
				innerContentArray.set(index, element3);
				index++;
			}
		}
	}
	if (this.getTupleElementInputContent() !== null)
	{
		var elements2 = this.getTupleElementInputContent();
		for (var k = 0; k < elements2.size(); k++)
		{
			var element2 = elements2.get(k);
			if (oFF.notNull(element2))
			{
				innerContentArray.set(index, element2);
				index++;
			}
		}
	}
	if (this.getTextContent() !== null)
	{
		innerContentArray.set(index, this.getTextContent());
		index++;
	}
	if (this.getMicroContent() !== null)
	{
		innerContentArray.set(index, this.getMicroContent());
		index++;
	}
	if (this.getMimeAfterTextContent() !== null)
	{
		innerContentArray.set(index, this.getMimeAfterTextContent());
		index++;
	}
	if (this.getSortIconContent() !== null)
	{
		innerContentArray.set(index, this.getSortIconContent());
		index++;
	}
};

oFF.TextContent = function() {};
oFF.TextContent.prototype = new oFF.XObject();
oFF.TextContent.prototype._ff_c = "TextContent";

oFF.TextContent.prototype.m_textContent = null;
oFF.TextContent.prototype.setTextContent = function(textContent)
{
	if (oFF.notNull(textContent))
	{
		this.m_textContent = textContent;
	}
};
oFF.TextContent.prototype.getTextContent = function()
{
	return this.m_textContent;
};

oFF.VirtualMatrixInsertLine = function() {};
oFF.VirtualMatrixInsertLine.prototype = new oFF.XObject();
oFF.VirtualMatrixInsertLine.prototype._ff_c = "VirtualMatrixInsertLine";

oFF.VirtualMatrixInsertLine.prototype.m_isOrigin = false;
oFF.VirtualMatrixInsertLine.prototype.m_originIndex = 0;
oFF.VirtualMatrixInsertLine.prototype.m_cells = null;

oFF.HeaderCellProcessor = {

	apply:function(cell, settings, momentum, tuple, tupleIndex, titleState, parallelSpan, headerState)
	{
			cell.setSettings(settings);
		cell.setMomentum(momentum);
		cell.setPivotCellType(oFF.PivotCellType.HEADER);
		cell.setStyleScheme(oFF.UiSemanticCellStyle.HEADER);
		cell.setIsInteractionAllowed(settings.isInteractionAllowed());
		cell.setTuple(tuple);
		cell.setTupleIndex(tupleIndex);
		cell.setAxisName(tuple.getAxis().getType());
		cell.setResultAxis(tuple.getAxis());
		cell.setTitleState(titleState);
		cell.setParallelSpan(parallelSpan);
		cell.setHeaderState(headerState);
		var type = titleState.getType();
		if (type === oFF.TitleType.SCALING_FACTORS)
		{
			oFF.HeaderCellProcessor.processScaling(cell);
		}
		else
		{
			oFF.HeaderCellProcessor.processTupleElement(cell);
			oFF.HeaderCellProcessor.processCharacteristicMember(cell);
			oFF.HeaderCellProcessor.processAttributeMember(cell);
			oFF.HeaderCellProcessor.processPresentation(cell);
			oFF.HeaderCellProcessor.processSorting(cell);
			oFF.HeaderCellProcessor.processText(cell);
			oFF.HeaderCellProcessor.processHierarchy(cell);
			oFF.HeaderCellProcessor.processDataEntry(cell);
			oFF.HeaderCellProcessor.processDragDropObject(cell);
			oFF.HeaderCellProcessor.processDocuments(cell);
			oFF.HeaderCellProcessor.processLineMerge(cell);
			if (settings.isRowColumnMergeEnabled())
			{
				oFF.HeaderCellProcessor.processParallelMerge(cell);
			}
			oFF.HeaderCellProcessor.processSemanticColor(cell);
			oFF.HeaderCellProcessor.processAlignment(cell);
		}
	},
	processTupleElement:function(cell)
	{
			var tuple = cell.getTuple();
		if (cell.getTitleState().getType().isUniversalHierarchy())
		{
			cell.setTupleElementIndex(-1);
		}
		else
		{
			var index = cell.getTitleState().getIndex();
			cell.setTupleElementIndex(index);
			if (index !== -1)
			{
				cell.setTupleElement(tuple.get(index));
			}
		}
	},
	processCharacteristicMember:function(cell)
	{
			var tupleElement = cell.getTupleElement();
		if (oFF.notNull(tupleElement))
		{
			cell.setCharacteristicMember(tupleElement.getDimensionMember());
		}
	},
	processAttributeMember:function(cell)
	{
			var attributeName = cell.getTitleState().getAttributeName();
		if (oFF.notNull(attributeName) && cell.getCharacteristic() !== null)
		{
			var attribute = cell.getCharacteristic().getFieldByName(attributeName);
			cell.setAttribute(attribute);
			if (oFF.notNull(attribute))
			{
				var member = cell.getCharacteristicMember();
				var attributeMember = member.getFieldValue(attribute);
				cell.setAttributeMember(attributeMember);
			}
		}
	},
	processPresentation:function(cell) {},
	processText:function(cell)
	{
			var member = cell.getCharacteristicMember();
		if (oFF.notNull(member))
		{
			var text = null;
			var presentation = cell.getPresentation();
			if (cell.getTitleState().getType().isAttribute())
			{
				var attributeMember = cell.getAttributeMember();
				if (oFF.notNull(attributeMember))
				{
					if (oFF.notNull(presentation))
					{
						text = oFF.BicsTextHelper.getAttributeMemberText(member, attributeMember, presentation, oFF.QContextType.RESULT_SET);
					}
				}
				else
				{
					if (cell.getHeaderState().isTotals())
					{
						text = oFF.BicsTextHelper.getCharacteristicMemberText(cell.getCharacteristicMember(), presentation, oFF.QContextType.RESULT_SET);
					}
				}
			}
			else
			{
				if (oFF.notNull(presentation))
				{
					text = oFF.BicsTextHelper.getCharacteristicMemberText(member, presentation, oFF.QContextType.RESULT_SET);
				}
			}
			cell.setText(text);
		}
	},
	processDragDropObject:function(cell)
	{
			cell.setDragDropObject(cell.getTupleElement());
		cell.setIsDragSource(!cell.isTupleElementInputVisible());
		cell.setIsDropTarget(!cell.isTupleElementInputVisible());
	},
	processScaling:function(cell)
	{
			var headerState = cell.getHeaderState();
		cell.setPivotCellType(oFF.PivotCellType.SCALING);
		cell.setDragDropObject(cell.getTuple());
		cell.setIsDragSource(false);
		cell.setIsDropTarget(false);
		if (oFF.notNull(headerState))
		{
			cell.setText(headerState.getScalingFactor());
			if (cell.getHeaderState().isTotals())
			{
				cell.setStyleScheme(oFF.UiSemanticCellStyle.TOTAL);
			}
		}
		else
		{
			cell.setText("");
		}
		cell.setVerticalAlignment(oFF.UiAlignment.CENTER);
		cell.setHorizontalAlignment(oFF.UiAlignment.BEGIN);
		if (cell.getAxisName() === oFF.AxisType.COLUMNS)
		{
			cell.setHorizontalAlignment(oFF.UiAlignment.FORCE_RIGHT);
		}
	},
	processLineMerge:function(cell)
	{
			var isLineMerge = false;
		var headerState = cell.getHeaderState();
		if (cell.getCharacteristic() !== null)
		{
			if (false)
			{
				if (headerState.isInheritedTotals())
				{
					isLineMerge = true;
				}
				else
				{
					if (cell.getTitleState().isFirstElementOfType())
					{
						isLineMerge = false;
					}
					else if (cell.getText() === null)
					{
						isLineMerge = true;
					}
				}
			}
		}
		if (isLineMerge)
		{
			cell.setIsColSpanAnchor(false);
			cell.setColSpanStartCell(headerState.incSpan());
		}
		else
		{
			cell.setIsColSpanAnchor(true);
			var member = cell.getCharacteristicMember();
			headerState.setSpanStartCell(member, cell);
		}
		return isLineMerge;
	},
	processParallelMerge:function(cell)
	{
			var isParallelMerge = false;
		if (cell.getSettings().hasRepetitionTexts() === false && cell.getParallelSpan() !== null)
		{
			var span = cell.getParallelSpan().getRemainingSpan();
			if (span > 0)
			{
				isParallelMerge = true;
				cell.setRowSpanOrigin(span, false);
			}
			else
			{
				isParallelMerge = false;
				var index = cell.getTupleIndex();
				var tupleElementIndex = cell.getTupleElementIndex();
				span = 1;
				if (tupleElementIndex !== -1)
				{
					var tuple = cell.getResultAxis().getTupleAt(index);
					var thisTupleElement = tuple.get(tupleElementIndex);
					var parallelTupleElement;
					for (var i = index + 1; i < cell.getResultAxis().getTupleElementsCount(); i++, span++)
					{
						tuple = cell.getResultAxis().getTupleAt(i);
						parallelTupleElement = tuple.get(tupleElementIndex);
						if (thisTupleElement !== parallelTupleElement)
						{
							break;
						}
					}
				}
				cell.setRowSpanOrigin(span, true);
			}
			cell.getParallelSpan().setRemainingSpan(span - 1);
		}
		return isParallelMerge;
	},
	processAlignment:function(cell)
	{
			cell.setVerticalAlignment(oFF.UiAlignment.FIRST_CELL);
		cell.setHorizontalAlignment(oFF.UiAlignment.BEGIN);
		var titleState = cell.getTitleState();
		if (titleState.getAxisType() === oFF.AxisType.COLUMNS)
		{
			if (cell.getPivotCellType() === oFF.PivotCellType.SCALING)
			{
				cell.setHorizontalAlignment(oFF.UiAlignment.FORCE_RIGHT);
			}
			else if (cell.getPivotCellType().isTypeOf(oFF.PivotCellType.TITLE))
			{
				cell.setHorizontalAlignment(oFF.UiAlignment.END);
			}
		}
	},
	processDocuments:function(cell) {},
	processSemanticColor:function(cell)
	{
			var aCell = cell;
		if (aCell.getPivotCellType().isTypeOf(oFF.PivotCellType.HIERARCHY) && aCell.getStyleScheme() === oFF.UiSemanticCellStyle.HEADER)
		{
			if (aCell.getHierarchyLevel() === 0)
			{
				aCell.setStyleScheme(oFF.UiSemanticCellStyle.HIERARCHY_LEVEL_1);
			}
			else if (aCell.getHierarchyLevel() === 1)
			{
				aCell.setStyleScheme(oFF.UiSemanticCellStyle.HIERARCHY_LEVEL_2);
			}
			else if (aCell.getHierarchyLevel() === 2)
			{
				aCell.setStyleScheme(oFF.UiSemanticCellStyle.HIERARCHY_LEVEL_3);
			}
			else
			{
				aCell.setStyleScheme(oFF.UiSemanticCellStyle.HIERARCHY_LEVEL_4);
			}
		}
		if (aCell.getHeaderState().isTotals())
		{
			aCell.setStyleScheme(oFF.UiSemanticCellStyle.TOTAL);
		}
		var isLastCharacteristicFirstElement = aCell.getTitleState().isLastCharacteristic();
		if (isLastCharacteristicFirstElement)
		{
			if (aCell.getColSpanStartCell() !== null)
			{
				aCell = aCell.getColSpanStartCell();
			}
			var alertLevel = aCell.getResultsetDataCell().getMaxAlertLevel();
			aCell.setAlertLevel(alertLevel);
			aCell.setAlertThresholds(aCell.getAlertThresholds());
		}
		else
		{
			aCell.setAlertLevel(oFF.AlertLevel.NORMAL);
			aCell.setAlertThreshold(null);
			aCell.setAlertThresholds(null);
		}
	},
	processDataEntry:function(cell) {},
	processHierarchy:function(cell)
	{
			var type = cell.getTitleState().getType();
		if (type.isHierarchy())
		{
			cell.setPivotCellType(oFF.PivotCellType.HIERARCHY);
			cell.setIsHierarchyCell(true);
			var settings = cell.getSettings();
			cell.setHasHierarchyAction(settings.isInteractionAllowed() || settings.hasOnlyNavigationOnHierarchies());
			if (type.isUniversalHierarchy())
			{
				cell.setHierarchyType(oFF.UiHierarchyType.AXIS_HIERARCHY);
				cell.setSortDirection(oFF.XSortDirection.DISABLED);
				cell.setHierarchyAlignment(oFF.Alignment.CHILDREN_BELOW_PARENT);
			}
			else
			{
				cell.setHierarchyType(oFF.UiHierarchyType.CHARACTERISTIC_HIERARCHY);
				var characteristic = cell.getCharacteristic();
				if (oFF.notNull(characteristic))
				{
					var nodeAlignment = characteristic.getLowerLevelNodeAlignment();
					cell.setHierarchyAlignment(nodeAlignment);
				}
				var tupleElement = cell.getTupleElement();
				if (oFF.notNull(tupleElement))
				{
					cell.setBicsDrillState(tupleElement.getDrillState());
					cell.setHierarchyLevel(tupleElement.getDisplayLevel());
				}
			}
			if (type.isUniversalHierarchy())
			{
				if (cell.getTitleState().isFirstElementOfBlock())
				{
					if (cell.getBicsDrillState() === oFF.DrillState.COLLAPSED)
					{
						cell.setDrillState(oFF.UiDrillState.COLLAPSED);
					}
					else if (cell.getBicsDrillState() === oFF.DrillState.EXPANDED || cell.getBicsDrillState() === oFF.DrillState.DRILL_DOWN)
					{
						if (cell.getBicsDrillState() !== oFF.DrillState.DRILL_DOWN)
						{
							cell.setHierarchyType(oFF.UiHierarchyType.AXIS_HIERARCHY_EXPAND);
						}
						var align = cell.getHierarchyAlignment();
						if (align === oFF.Alignment.CHILDREN_ABOVE_PARENT)
						{
							cell.setDrillState(oFF.UiDrillState.EXPANDED_UP);
						}
						else
						{
							cell.setDrillState(oFF.UiDrillState.EXPANDED_DOWN);
						}
					}
					else if (cell.getBicsDrillState() === oFF.DrillState.LEAF)
					{
						cell.setDrillState(oFF.UiDrillState.LEAF);
					}
					else
					{
						throw oFF.XException.createIllegalArgumentException("Assertion: Unknown drill state");
					}
				}
				else
				{
					cell.setDrillState(oFF.UiDrillState.ATTRIBUTE);
				}
			}
			else
			{
				if (cell.getTitleState().isFirstElementOfBlock())
				{
					var ds = cell.getBicsDrillState();
					if (ds === oFF.DrillState.COLLAPSED)
					{
						cell.setDrillState(oFF.UiDrillState.COLLAPSED);
					}
					else if (ds === oFF.DrillState.EXPANDED)
					{
						var align2 = cell.getHierarchyAlignment();
						if (align2 === oFF.Alignment.CHILDREN_ABOVE_PARENT)
						{
							cell.setDrillState(oFF.UiDrillState.EXPANDED_UP);
						}
						else
						{
							cell.setDrillState(oFF.UiDrillState.EXPANDED_DOWN);
						}
					}
					else if (ds === oFF.DrillState.LEAF)
					{
						cell.setDrillState(oFF.UiDrillState.LEAF);
					}
					else if (oFF.isNull(ds))
					{
						cell.setDrillState(oFF.UiDrillState.ATTRIBUTE);
					}
					else
					{
						throw oFF.XException.createIllegalStateException("Assertion: Unknown drill state");
					}
				}
				else
				{
					cell.setDrillState(oFF.UiDrillState.ATTRIBUTE);
				}
			}
		}
	},
	processSorting:function(cell)
	{
			if (cell.getAxisName() !== oFF.AxisType.COLUMNS)
		{
			cell.setSortDirection(oFF.XSortDirection.DISABLED);
			return;
		}
		cell.getTupleElement();
		cell.setSortDirection(oFF.XSortDirection.DISABLED);
	}
};

oFF.HeaderState = function() {};
oFF.HeaderState.prototype = new oFF.XObject();
oFF.HeaderState.prototype._ff_c = "HeaderState";

oFF.HeaderState.createHeaderState = function()
{
	var object = new oFF.HeaderState();
	object.setup();
	return object;
};
oFF.HeaderState.prototype.m_characteristicMember = null;
oFF.HeaderState.prototype.m_spanStartCell = null;
oFF.HeaderState.prototype.m_span = 0;
oFF.HeaderState.prototype.m_total = null;
oFF.HeaderState.prototype.m_fixedTuple = null;
oFF.HeaderState.prototype.m_tupleIndex = 0;
oFF.HeaderState.prototype.m_rsAxis = null;
oFF.HeaderState.prototype.m_displayUnitInCell = false;
oFF.HeaderState.prototype.m_visibleTotalCellCount = 0;
oFF.HeaderState.prototype.setup = function()
{
	this.reset();
};
oFF.HeaderState.prototype.reset = function()
{
	this.m_characteristicMember = null;
	this.m_spanStartCell = null;
	this.m_span = 0;
	this.m_total = oFF.Total.NONE;
	this.m_fixedTuple = null;
	this.m_tupleIndex = -1;
	this.m_rsAxis = null;
	this.m_displayUnitInCell = false;
	this.m_visibleTotalCellCount = 0;
};
oFF.HeaderState.prototype.set = function(rsAxis, tupleIndex, fixedTuple, displayScalingUnitInHeader)
{
	this.m_rsAxis = rsAxis;
	this.m_tupleIndex = tupleIndex;
	this.m_fixedTuple = fixedTuple;
	if (displayScalingUnitInHeader === false)
	{
		this.m_displayUnitInCell = true;
	}
	else
	{
		this.m_displayUnitInCell = true;
	}
};
oFF.HeaderState.prototype.getCharacteristicMember = function()
{
	return this.m_characteristicMember;
};
oFF.HeaderState.prototype.getTuple = function()
{
	if (oFF.isNull(this.m_fixedTuple))
	{
		return this.m_rsAxis.getTupleAt(this.m_tupleIndex);
	}
	return this.m_fixedTuple;
};
oFF.HeaderState.prototype.getScalingFactor = function()
{
	return null;
};
oFF.HeaderState.prototype.displayUnitInCell = function()
{
	return this.m_displayUnitInCell;
};
oFF.HeaderState.prototype.setSpanStartCell = function(characteristicMember, cell)
{
	this.m_characteristicMember = characteristicMember;
	this.m_spanStartCell = cell;
	this.m_span = 1;
};
oFF.HeaderState.prototype.incSpan = function()
{
	this.m_span++;
	if (oFF.notNull(this.m_spanStartCell))
	{
		this.m_spanStartCell.setColSpanOrigin(this.m_span, true);
	}
	return this.m_spanStartCell;
};
oFF.HeaderState.prototype.getTotals = function()
{
	return this.m_total;
};
oFF.HeaderState.prototype.setTotals = function(totalAttribute)
{
	this.m_total = totalAttribute;
};
oFF.HeaderState.prototype.isInheritedTotals = function()
{
	return this.m_total === oFF.Total.SECONDARY;
};
oFF.HeaderState.prototype.isTotals = function()
{
	return this.m_total !== oFF.Total.NONE;
};
oFF.HeaderState.prototype.getVisibleTotalCellCount = function()
{
	return this.m_visibleTotalCellCount;
};
oFF.HeaderState.prototype.incVisibleTotalCellCount = function()
{
	this.m_visibleTotalCellCount++;
};

oFF.ParallelSpan = function() {};
oFF.ParallelSpan.prototype = new oFF.XObject();
oFF.ParallelSpan.prototype._ff_c = "ParallelSpan";

oFF.ParallelSpan.create = function()
{
	var object = new oFF.ParallelSpan();
	object.reset();
	return object;
};
oFF.ParallelSpan.prototype.m_remainingSpan = 0;
oFF.ParallelSpan.prototype.reset = function()
{
	this.m_remainingSpan = 0;
};
oFF.ParallelSpan.prototype.getRemainingSpan = function()
{
	return this.m_remainingSpan;
};
oFF.ParallelSpan.prototype.setRemainingSpan = function(remainingSpan)
{
	this.m_remainingSpan = remainingSpan;
};

oFF.Section_I_Momentum = function() {};
oFF.Section_I_Momentum.prototype = new oFF.XObject();
oFF.Section_I_Momentum.prototype._ff_c = "Section_I_Momentum";

oFF.Section_I_Momentum.prototype.m_dataset = null;
oFF.Section_I_Momentum.prototype.m_hasMasterdataDocuments = false;
oFF.Section_I_Momentum.prototype.m_hasMetadataDocuments = false;
oFF.Section_I_Momentum.prototype.m_titleStatesCore = null;
oFF.Section_I_Momentum.prototype.m_titleStatesCore_noAnchors = null;
oFF.Section_I_Momentum.prototype.m_titleStatesNewLines = null;
oFF.Section_I_Momentum.prototype.m_titleStatesNewLines_noAnchors = null;
oFF.Section_I_Momentum.prototype.m_settings = null;
oFF.Section_I_Momentum.prototype.setupSectionMomentum = function(dataset)
{
	this.m_dataset = dataset;
	this.m_settings = dataset.getSettings();
};
oFF.Section_I_Momentum.prototype.initAxis = oFF.noSupport;
oFF.Section_I_Momentum.prototype.getDataset = function()
{
	return this.m_dataset;
};
oFF.Section_I_Momentum.prototype.setHasMasterdataDocuments = function(hasDocuments)
{
	this.m_hasMasterdataDocuments = hasDocuments;
};
oFF.Section_I_Momentum.prototype.hasMasterdataDocuments = function()
{
	return this.m_hasMasterdataDocuments;
};
oFF.Section_I_Momentum.prototype.hasMetadataDocuments = function()
{
	return this.m_hasMetadataDocuments;
};
oFF.Section_I_Momentum.prototype.setHasMetadataDocuments = function(hasDocuments)
{
	this.m_hasMetadataDocuments = hasDocuments;
};
oFF.Section_I_Momentum.prototype.isFilled = function()
{
	return this.getTitleStatesCore(true).size() > 0;
};
oFF.Section_I_Momentum.prototype.getTitleStatesNewLines = function(includeAnchors)
{
	if (includeAnchors)
	{
		return this.m_titleStatesNewLines;
	}
	if (oFF.isNull(this.m_titleStatesNewLines_noAnchors))
	{
		this.m_titleStatesNewLines_noAnchors = this.extractNoAnchors(this.m_titleStatesNewLines);
	}
	return this.m_titleStatesNewLines;
};
oFF.Section_I_Momentum.prototype.getTitleStatesCore = function(includeAnchors)
{
	if (includeAnchors)
	{
		return this.m_titleStatesCore;
	}
	if (oFF.isNull(this.m_titleStatesCore_noAnchors))
	{
		this.m_titleStatesCore_noAnchors = this.extractNoAnchors(this.m_titleStatesCore);
	}
	return this.m_titleStatesCore_noAnchors;
};
oFF.Section_I_Momentum.prototype.extractNoAnchors = function(withAnchors)
{
	if (oFF.isNull(this.m_titleStatesCore))
	{
		return null;
	}
	var noAnchorsList = oFF.XList.create();
	for (var i = 0; i < withAnchors.size(); i++)
	{
		var withAnchor = withAnchors.get(i);
		if (withAnchor.getType().isAnchor() === false)
		{
			noAnchorsList.add(withAnchor);
		}
	}
	return noAnchorsList;
};
oFF.Section_I_Momentum.prototype.toString = function()
{
	return null;
};

oFF.TitleState = function() {};
oFF.TitleState.prototype = new oFF.XObject();
oFF.TitleState.prototype._ff_c = "TitleState";

oFF.TitleState.create = function(type, axisType)
{
	var object = new oFF.TitleState();
	object.m_characteristicIndex = -1;
	object.m_type = type;
	object.m_axisType = axisType;
	return object;
};
oFF.TitleState.createAttributeTitle = function(type, axisType)
{
	return oFF.TitleState.create(type, axisType);
};
oFF.TitleState.createScalingFactorsTitle = function(axisType)
{
	return oFF.TitleState.create(oFF.TitleType.SCALING_FACTORS, axisType);
};
oFF.TitleState.createCharacteristicAttributeAnchor = function(axisType, characteristic, index, attributeName, isHierarchy)
{
	var titleState;
	if (isHierarchy)
	{
		titleState = oFF.TitleState.create(oFF.TitleType.CHAR_HIERARCHY_ATTRIBUTE_ANCHOR, axisType);
	}
	else
	{
		titleState = oFF.TitleState.create(oFF.TitleType.CHARACTERISTIC_ATTRIBUTE_ANCHOR, axisType);
	}
	titleState.m_characteristic = characteristic;
	titleState.m_characteristicIndex = index;
	titleState.m_attributeName = attributeName;
	return titleState;
};
oFF.TitleState.createCharacteristicAttributePresentation = function(hiddenAttributeAnchor, spanAnchor, presentation, title, isHierarchy)
{
	var titleState;
	if (isHierarchy)
	{
		titleState = oFF.TitleState.create(oFF.TitleType.CHAR_HIERARCHY_ATTRIBUTE_PRESENTATION, hiddenAttributeAnchor.getAxisType());
	}
	else
	{
		titleState = oFF.TitleState.create(oFF.TitleType.CHARACTERISTIC_ATTRIBUTE_PRESENTATION, hiddenAttributeAnchor.getAxisType());
	}
	titleState.m_characteristic = hiddenAttributeAnchor.getCharacteristic();
	titleState.m_characteristicIndex = hiddenAttributeAnchor.getIndex();
	titleState.m_spanAnchor = spanAnchor;
	titleState.m_attributeName = hiddenAttributeAnchor.getAttributeName();
	titleState.m_presentation = presentation;
	titleState.m_title = title;
	return titleState;
};
oFF.TitleState.createCharacteristicAnchor = function(axisType, characteristic, index)
{
	var titleState = oFF.TitleState.create(oFF.TitleType.CHARACTERISTIC_ANCHOR, axisType);
	titleState.m_characteristic = characteristic;
	titleState.m_characteristicIndex = index;
	return titleState;
};
oFF.TitleState.createCharacteristicPresentation = function(hiddenAnchor, spanAnchor, presentationIndex, settings)
{
	var titleState = oFF.TitleState.create(oFF.TitleType.CHARACTERISTIC_PRESENTATION, hiddenAnchor.getAxisType());
	titleState.m_spanAnchor = spanAnchor;
	titleState.m_characteristic = hiddenAnchor.getCharacteristic();
	titleState.m_characteristicIndex = hiddenAnchor.getIndex();
	titleState.m_presentationIndex = presentationIndex;
	titleState.m_title = oFF.TitleState.getTitleText(titleState.m_characteristic, settings);
	return titleState;
};
oFF.TitleState.createCharacteristicPresentation2 = function(hiddenAnchor, spanAnchor, presentation, settings)
{
	var titleState = oFF.TitleState.create(oFF.TitleType.CHARACTERISTIC_PRESENTATION, hiddenAnchor.getAxisType());
	titleState.m_spanAnchor = spanAnchor;
	titleState.m_characteristic = hiddenAnchor.getCharacteristic();
	titleState.m_characteristicIndex = hiddenAnchor.getIndex();
	titleState.m_presentation = presentation;
	titleState.m_title = oFF.TitleState.getTitleText(titleState.m_characteristic, settings);
	return titleState;
};
oFF.TitleState.createCharacteristicHierarchyPresentation = function(hiddenAnchor, spanAnchor, presentationIndex, settings)
{
	var titleState = oFF.TitleState.create(oFF.TitleType.CHAR_HIERARCHY_PRESENTATION, hiddenAnchor.getAxisType());
	titleState.m_spanAnchor = spanAnchor;
	titleState.m_characteristic = hiddenAnchor.getCharacteristic();
	titleState.m_characteristicIndex = hiddenAnchor.getIndex();
	titleState.m_presentationIndex = presentationIndex;
	titleState.m_title = oFF.TitleState.getTitleText(titleState.m_characteristic, settings);
	return titleState;
};
oFF.TitleState.createUniversalHierarchyAnchor = function(axis)
{
	var titleState = oFF.TitleState.create(oFF.TitleType.UNIVERSAL_HIERARCHY_ANCHOR, axis.getType());
	titleState.m_axis = axis;
	return titleState;
};
oFF.TitleState.createUniversalHierarchyPresentation = function(hiddenAnchor, title, presentationIndex, spanAnchor)
{
	var titleState = oFF.TitleState.create(oFF.TitleType.UNIVERSAL_HIERARCHY_PRESENTATION, hiddenAnchor.getAxisType());
	titleState.m_title = title;
	titleState.m_presentationIndex = presentationIndex;
	titleState.m_spanAnchor = spanAnchor;
	titleState.m_axis = hiddenAnchor.getAxis();
	return titleState;
};
oFF.TitleState.createUniversalHierarchyAttributeAnchor = function(axisType, attributeName)
{
	var titleState = oFF.TitleState.create(oFF.TitleType.UNIVERSAL_HIERARCHY_ANCHOR, axisType);
	titleState.m_attributeName = attributeName;
	return titleState;
};
oFF.TitleState.createUniversalHierarchyAttributePresentation = function(hiddenAttributeAnchor, spanAnchor, presentationIndex, title)
{
	var titleState = oFF.TitleState.create(oFF.TitleType.UNIVERSAL_HIERARCHY_ATTRIBUTE_PRESENTATION, hiddenAttributeAnchor.getAxisType());
	titleState.m_spanAnchor = spanAnchor;
	titleState.m_attributeName = hiddenAttributeAnchor.getAttributeName();
	titleState.m_presentationIndex = presentationIndex;
	titleState.m_title = title;
	return titleState;
};
oFF.TitleState.getTitleText = function(dimension, settings)
{
	var isAccessible = settings.isAccessible();
	if (dimension.isMeasureStructure())
	{
		if (isAccessible === false)
		{
			if (settings.isKeyfigureStructureTitleVisible() === false)
			{
				return "";
			}
		}
	}
	return dimension.getText();
};
oFF.TitleState.prototype.m_type = null;
oFF.TitleState.prototype.m_characteristicIndex = 0;
oFF.TitleState.prototype.m_spanAnchor = null;
oFF.TitleState.prototype.m_characteristic = null;
oFF.TitleState.prototype.m_axis = null;
oFF.TitleState.prototype.m_presentation = null;
oFF.TitleState.prototype.m_presentationIndex = 0;
oFF.TitleState.prototype.m_attributeName = null;
oFF.TitleState.prototype.m_cellInstance = null;
oFF.TitleState.prototype.m_cellSpan = 0;
oFF.TitleState.prototype.m_axisType = null;
oFF.TitleState.prototype.m_isFirstElementOfCharacteristic = false;
oFF.TitleState.prototype.m_isFirstElementOfSubtype = false;
oFF.TitleState.prototype.m_isFirst = false;
oFF.TitleState.prototype.m_title = null;
oFF.TitleState.prototype.m_isLastCharacteristic = false;
oFF.TitleState.prototype.m_isReadOnlyEnforced = false;
oFF.TitleState.prototype.setCellInstance = function(cellInstance)
{
	if (oFF.notNull(this.m_spanAnchor))
	{
		oFF.XException.createIllegalArgumentException("Not allowed to set the characteristic to a non-characteristic title cell.");
	}
	this.m_cellInstance = cellInstance;
	this.m_cellSpan = 1;
};
oFF.TitleState.prototype.incrementAnchorCellSpan = function()
{
	if (oFF.notNull(this.m_spanAnchor))
	{
		this.m_spanAnchor.incrementAnchorCellSpan();
	}
	else
	{
		this.m_cellSpan++;
		if (oFF.notNull(this.m_cellInstance))
		{
			if (this.m_axisType === oFF.AxisType.ROWS)
			{
				this.m_cellInstance.setColSpanOrigin(this.m_cellSpan, true);
			}
			else
			{
				this.m_cellInstance.setRowSpanOrigin(this.m_cellSpan, true);
			}
		}
	}
};
oFF.TitleState.prototype.getPresentation = function()
{
	return this.m_presentation;
};
oFF.TitleState.prototype.getPresentationResolved = function()
{
	if (oFF.notNull(this.m_presentation))
	{
		return this.m_presentation;
	}
	return null;
};
oFF.TitleState.prototype.getPresentationIndex = function()
{
	return this.m_presentationIndex;
};
oFF.TitleState.prototype.getCharacteristic = function()
{
	return this.m_characteristic;
};
oFF.TitleState.prototype.getAxis = function()
{
	return this.m_axis;
};
oFF.TitleState.prototype.getIndex = function()
{
	return this.m_characteristicIndex;
};
oFF.TitleState.prototype.getType = function()
{
	return this.m_type;
};
oFF.TitleState.prototype.getAttribute = function()
{
	if (oFF.isNull(this.m_characteristic) || oFF.isNull(this.m_attributeName))
	{
		return null;
	}
	return this.m_characteristic.getFieldByName(this.m_attributeName);
};
oFF.TitleState.prototype.getAttributeName = function()
{
	return this.m_attributeName;
};
oFF.TitleState.prototype.getAxisType = function()
{
	return this.m_axisType;
};
oFF.TitleState.prototype.isFirstElementOfType = function()
{
	return this.m_isFirstElementOfSubtype;
};
oFF.TitleState.prototype.setFirstElementOfType = function(isFirstElement)
{
	this.m_isFirstElementOfSubtype = isFirstElement;
};
oFF.TitleState.prototype.isFirstElementOfBlock = function()
{
	return this.m_isFirstElementOfCharacteristic;
};
oFF.TitleState.prototype.setFirstElementOfBlock = function(isFirstElement)
{
	this.m_isFirstElementOfCharacteristic = isFirstElement;
};
oFF.TitleState.prototype.getTitle = function()
{
	return this.m_title;
};
oFF.TitleState.prototype.isLastCharacteristic = function()
{
	return this.m_isLastCharacteristic;
};
oFF.TitleState.prototype.setIsLastCharacteristic = function(isLastCharacteristic)
{
	this.m_isLastCharacteristic = isLastCharacteristic;
};
oFF.TitleState.prototype.isFirst = function()
{
	return this.m_isFirst;
};
oFF.TitleState.prototype.setIsFirst = function(isFirst)
{
	this.m_isFirst = isFirst;
};
oFF.TitleState.prototype.isReadOnlyEnforced = function()
{
	return this.m_isReadOnlyEnforced;
};
oFF.TitleState.prototype.setReadOnlyEnforced = function(isReadOnlyEnforced)
{
	this.m_isReadOnlyEnforced = isReadOnlyEnforced;
};
oFF.TitleState.prototype.toString = function()
{
	return this.m_type.toString();
};

oFF.TitleCellFactory = {

	createTwinCell:function(settings, titleStateLeft, titleStateRight)
	{
			var leftCell = oFF.TitleCellFactory.createCell(settings, titleStateLeft, oFF.AxisType.ROWS, true);
		var rightCell = oFF.TitleCellFactory.createCell(settings, titleStateRight, oFF.AxisType.COLUMNS, true);
		if (leftCell.isColSpanAnchor() === false && rightCell.isRowSpanAnchor() === false)
		{
			return oFF.PivotCell.createTitleCell();
		}
		else if (leftCell.isColSpanAnchor() === false)
		{
			return rightCell;
		}
		else if (rightCell.isRowSpanAnchor() === false)
		{
			return leftCell;
		}
		else
		{
			var twinCell = oFF.PivotCell.createTwinCell();
			twinCell.setLeftCell(leftCell);
			twinCell.setRightCell(rightCell);
			var buffer = oFF.XStringBuffer.create();
			buffer.append(leftCell.getText());
			buffer.append(" | ");
			buffer.append(rightCell.getText());
			twinCell.setText(buffer.toString());
			return twinCell;
		}
	},
	createCell:function(settings, titleState, axisReference, isTwinCellContent)
	{
			var cell;
		if (oFF.isNull(titleState))
		{
			cell = oFF.PivotCell.createTitleCell();
		}
		else
		{
			if (titleState.getType() === oFF.TitleType.SCALING_FACTORS)
			{
				cell = oFF.PivotCell.createTitleCell();
			}
			else if (titleState.getType().isPresentation())
			{
				if (titleState.isFirstElementOfType() === false)
				{
					if (isTwinCellContent === false)
					{
						titleState.incrementAnchorCellSpan();
					}
					cell = oFF.PivotCell.createTitleCell();
					cell.setIsColSpanAnchor(axisReference === oFF.AxisType.COLUMNS);
					cell.setIsRowSpanAnchor(axisReference === oFF.AxisType.ROWS);
				}
				else
				{
					var titleCell = oFF.PivotCell.createTitleCell();
					titleCell.setAxisName(axisReference);
					if (titleState.getType() === oFF.TitleType.CHARACTERISTIC_ATTRIBUTE_PRESENTATION)
					{
						if (axisReference === oFF.AxisType.ROWS)
						{
							oFF.TitleCellFactory.getSorting(titleState.getCharacteristic());
						}
					}
					else if (titleState.getType() === oFF.TitleType.CHARACTERISTIC_PRESENTATION || titleState.getType() === oFF.TitleType.CHAR_HIERARCHY_PRESENTATION)
					{
						if (axisReference === oFF.AxisType.ROWS)
						{
							if (titleState.getCharacteristic().isStructure())
							{
								titleCell.setSortDirection(oFF.XSortDirection.DISABLED);
							}
							else
							{
								var sorting2 = oFF.TitleCellFactory.getSorting(titleState.getCharacteristic());
								if (oFF.TitleCellFactory.containsAscDescSorting(sorting2))
								{
									if (oFF.TitleCellFactory.isAscDescSorting(sorting2, titleState.getCharacteristic()))
									{
										if (sorting2.getDirection() === oFF.XSortDirection.ASCENDING)
										{
											titleCell.setSortDirection(oFF.XSortDirection.ASCENDING);
										}
										else if (sorting2.getDirection() === oFF.XSortDirection.DESCENDING)
										{
											titleCell.setSortDirection(oFF.XSortDirection.DESCENDING);
										}
										else
										{
											titleCell.setSortDirection(oFF.XSortDirection.NONE);
										}
									}
									else
									{
										titleCell.setSortDirection(oFF.XSortDirection.NONE);
									}
								}
								else
								{
									titleCell.setSortDirection(oFF.XSortDirection.DISABLED);
								}
							}
						}
					}
					var title = titleState.getTitle();
					titleCell.setText(title);
					titleCell.setIsDocumentSymbolVisible(settings.hasDocIconsMetaData() && titleState.isFirstElementOfType());
					titleState.setCellInstance(titleCell);
					cell = titleCell;
				}
			}
			else
			{
				cell = oFF.PivotCell.createTitleCell();
				cell.setIsColSpanAnchor(false);
				cell.setIsRowSpanAnchor(false);
			}
		}
		if (axisReference === oFF.AxisType.COLUMNS)
		{
			cell.setVerticalAlignment(oFF.UiAlignment.FIRST_CELL);
			cell.setHorizontalAlignment(oFF.UiAlignment.END);
		}
		else
		{
			cell.setVerticalAlignment(oFF.UiAlignment.CENTER);
			cell.setHorizontalAlignment(oFF.UiAlignment.BEGIN);
		}
		cell.setTitleState(titleState);
		return cell;
	},
	getSorting:function(characteristic)
	{
			return characteristic.getResultSetSorting();
	},
	isAscDescSorting:function(sorting, dimension)
	{
			return false;
	},
	containsAscDescSorting:function(sorting)
	{
			return false;
	}
};

oFF.PivotTableConstants = {

	FIRST:0,
	INFINITE:-1,
	CALCULATED:-1
};

oFF.SimpleConverterFactory = function() {};
oFF.SimpleConverterFactory.prototype = new oFF.XObject();
oFF.SimpleConverterFactory.prototype._ff_c = "SimpleConverterFactory";

oFF.SimpleConverterFactory.create = function(settings)
{
	var object = new oFF.SimpleConverterFactory();
	object.m_settings = settings;
	return object;
};
oFF.SimpleConverterFactory.prototype.m_settings = null;
oFF.SimpleConverterFactory.prototype.createConverterMatrix = function(virtualMatrix, matrixNamespace)
{
	oFF.GenericPivotObjectFactory.create(this.m_settings.getQueryManager().getApplication(), null);
	var matrixConverter = null;
	return matrixConverter;
};

oFF.BicsTextHelper = {

	createElementDescription:function(name, text)
	{
			if (oFF.notNull(text) && oFF.XString.isEqual("", text) === false)
		{
			return text;
		}
		return name;
	},
	createElementText:function(name, alternativeName, text, isDebug)
	{
			return null;
	},
	getCharacteristicMemberText:oFF.noSupport,
	getAttributeMemberText:oFF.noSupport
};

oFF.TupleHelper = {

};

oFF.ClientGeneratorMain = {

	main:function()
	{
			oFF.ProviderModule.getInstance();
		var session = oFF.DefaultSession.create();
		oFF.XLogger.println("collecting data to print clients");
		var widgetClient = oFF.StoryClient.create(session, "../../sources", "../", "../../extlibs");
		widgetClient.generateClient("./targets/webClients/", "osc.standalone");
		oFF.XLogger.println("osc.standalone created");
		var studioClient = oFF.StudClient.create("../../sources", "../", "../../extlibs");
		studioClient.generateClient("./targets/webClients/", "studio");
		oFF.XLogger.println("studio created");
		var asc = oFF.OrcaWidgets.create("../../sources", "../", "../../extlibs");
		asc.generateClient("./targets/webClients/", "orcawidgets");
		oFF.XLogger.println("orcawidgets created");
	}
};

oFF.ClientLibs = {

	addLibElements:function(headBuffer, pathToLibs)
	{
			headBuffer.appendNewLine();
		var pathDef = pathToLibs;
		if (oFF.XStringUtils.isNullOrEmpty(pathDef))
		{
			pathDef = "libs";
		}
		oFF.ClientLibs.addSrc(headBuffer, oFF.ClientLibs.preparePackageName("highstock"), pathDef, "text/javascript");
		oFF.ClientLibs.addSrc(headBuffer, oFF.ClientLibs.preparePackageName("highcharts-more"), pathDef, "text/javascript");
		oFF.ClientLibs.addSrc(headBuffer, oFF.ClientLibs.preparePackageName("solid-gauge"), pathDef, "text/javascript");
		oFF.ClientLibs.addSrc(headBuffer, oFF.ClientLibs.preparePackageName("xAxis-zero-crossing"), pathDef, "text/javascript");
		oFF.ClientLibs.addSrc(headBuffer, oFF.ClientLibs.preparePackageName("histogram-bellcurve"), pathDef, "text/javascript");
		oFF.ClientLibs.addSrc(headBuffer, oFF.ClientLibs.preparePackageName("no-data-to-display"), pathDef, "text/javascript");
		oFF.ClientLibs.addSrc(headBuffer, oFF.ClientLibs.preparePackageName("wordcloud"), pathDef, "text/javascript");
		oFF.ClientLibs.addSrc(headBuffer, oFF.ClientLibs.preparePackageName("variable-pie"), pathDef, "text/javascript");
		oFF.ClientLibs.addSrc(headBuffer, oFF.ClientLibs.preparePackageName("heatmap"), pathDef, "text/javascript");
		oFF.ClientLibs.addSrc(headBuffer, oFF.ClientLibs.preparePackageName("treemap"), pathDef, "text/javascript");
		oFF.ClientLibs.addSrc(headBuffer, oFF.ClientLibs.preparePackageName("variwide"), pathDef, "text/javascript");
		oFF.ClientLibs.addSrc(headBuffer, oFF.ClientLibs.preparePackageName("pattern-fill"), pathDef, "text/javascript");
		oFF.ClientLibs.addSrc(headBuffer, oFF.ClientLibs.preparePackageName("highcharts-3d"), pathDef, "text/javascript");
		oFF.ClientLibs.addSrc(headBuffer, oFF.ClientLibs.preparePackageName("grouped-categories"), pathDef, "text/javascript");
	},
	addSapUI5:function(buffer)
	{
			buffer.append("\t<script id=\"sap-ui-bootstrap\" type=\"text/javascript\"").appendNewLine();
		buffer.append("\t\tsrc=\"https://sapui5.hana.ondemand.com/resources/sap-ui-core.js\"").appendNewLine();
		buffer.append("\t\tdata-sap-ui-language=\"en\"").appendNewLine();
		buffer.append("\t\tdata-sap-ui-theme=\"sap_bluecrystal\"").appendNewLine();
		buffer.append("\t\tdata-sap-ui-libs=\"sap.ui.core,sap.ui.commons,sap.ui.table,sap.ui.unified,sap.m\">").appendNewLine();
		buffer.append("\t</script>").appendNewLine();
	},
	addJQuery:function(buffer, pathToLibs)
	{
			buffer.append(oFF.XStringUtils.concatenate3("\t<script src=\"", pathToLibs, "/js/jquery-1.11.0.js\" type=\"text/javascript\"></script>")).appendNewLine();
	},
	addSrc:function(buffer, include, path, contentType)
	{
			buffer.append(oFF.XStringUtils.concatenate3("\t<script src=\"", path, "/"));
		buffer.append(include);
		buffer.append(oFF.XStringUtils.concatenate3("\" type=\"", contentType, "\"></script>")).appendNewLine();
	},
	preparePackageName:function(packageName)
	{
			return oFF.XStringUtils.concatenate3("js/", packageName, ".js");
	}
};

oFF.ClientSources = {

	addFFPackages:function(headBuffer, pathToTargets)
	{
			headBuffer.appendNewLine();
		var pathDef = pathToTargets;
		if (oFF.XStringUtils.isNullOrEmpty(pathDef))
		{
			pathDef = "targets";
		}
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff0000.language.native"), pathDef, "text/javascript");
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff0010.core"), pathDef, "text/javascript");
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff0020.core.native"), pathDef, "text/javascript");
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff0030.core.ext"), pathDef, "text/javascript");
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff0200.io"), pathDef, "text/javascript");
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff0210.io.native"), pathDef, "text/javascript");
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff2100.runtime"), pathDef, "text/javascript");
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff2170.tools"), pathDef, "text/javascript");
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff2180.webdispatcher"), pathDef, "text/javascript");
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff2200.ui"), pathDef, "text/javascript");
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff4000.protocol.ina"), pathDef, "text/javascript");
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff4200.olap.api"), pathDef, "text/javascript");
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff4220.olap.catalog.api"), pathDef, "text/javascript");
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff4250.resultset"), pathDef, "text/javascript");
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff4300.olap.ext.impl"), pathDef, "text/javascript");
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff4310.olap.impl"), pathDef, "text/javascript");
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff4330.olap.catalog.impl"), pathDef, "text/javascript");
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff4340.olap.reference"), pathDef, "text/javascript");
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff4390.olap.helpers"), pathDef, "text/javascript");
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff4400.olap.providers"), pathDef, "text/javascript");
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff5500.story"), pathDef, "text/javascript");
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff8000.quasar"), pathDef, "text/javascript");
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff8100.studio"), pathDef, "text/javascript");
	},
	addStudioUi:function(headBuffer, pathToTargets)
	{
			headBuffer.appendNewLine();
		var pathDef = pathToTargets;
		if (oFF.XStringUtils.isNullOrEmpty(pathDef))
		{
			pathDef = "targets";
		}
		oFF.ClientSources.addSrc(headBuffer, oFF.ClientSources.preparePackageName("ff8110.studio.ui"), pathDef, "text/javascript");
	},
	addSrc:function(buffer, include, path, contentType)
	{
			buffer.append(oFF.XStringUtils.concatenate3("\t<script src=\"", path, "/"));
		buffer.append(include);
		buffer.append(oFF.XStringUtils.concatenate3("\" type=\"", contentType, "\"></script>")).appendNewLine();
	},
	preparePackageName:function(packageName)
	{
			return oFF.XStringUtils.concatenate4(packageName, "/combined/", packageName, ".js");
	}
};

oFF.ClientUIComponents = {

	addUiElements:function(headBuffer, pathToSources)
	{
			var pathDef = pathToSources;
		if (oFF.XStringUtils.isNullOrEmpty(pathDef))
		{
			pathDef = "sources";
		}
		headBuffer.appendNewLine();
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.FireflyClass", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.Ui5CustomVerticalSplitter", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.Ui5CustomScrollContainer", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.XtUi5CustomVizGrid", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.XtUi5Highcharts", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxGeneric", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxButton", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxImage", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxText", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxTextArea", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxInput", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxCheckbox", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxSlider", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxLabel", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxContextMenu", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxMenuBar", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxMenuItem", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxSubMenu", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxTree", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxTreeItem", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxDropDown", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxDropDownItem", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxComboBox", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxList", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxListItem", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxSplitter", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxVerticalSplitter", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxHorizontalSplitter", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxIconBarBar", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxIconBarBarItem", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxNavigationContainer", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxNavigationItem", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxNavigationItemAction", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxDialog", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxAlert", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxToast", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxHorizontalLayout", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxVerticalLayout", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxFlexLayout", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxCanvasLayout", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxFlowLayout", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxFlowLayoutHorizontal", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxFlowLayoutVertical", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxMatrixLayout", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxMatrixLayoutRow", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxMatrixLayoutCell", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxMatrixLayoutDefLine", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxMatrixLayoutDefCell", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxVizGrid", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxHighChart", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxScrollContainer", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxSpacer", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxActivityIndicator", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UxRoot", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.NativeUiManager", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.NativeUiManagerFactory", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.UiDriverModule", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.NativeCredentialsProvider", false), pathDef, "text/javascript");
		oFF.ClientUIComponents.addSrc(headBuffer, oFF.ClientUIComponents.preparePackageName("oFF.NativeCredentialsFactory", false), pathDef, "text/javascript");
	},
	addSrc:function(buffer, include, path, contentType)
	{
			buffer.append(oFF.XStringUtils.concatenate3("\t<script src=\"", path, "/"));
		buffer.append(include);
		buffer.append(oFF.XStringUtils.concatenate3("\" type=\"", contentType, "\"></script>")).appendNewLine();
	},
	preparePackageName:function(className, isNotSAPUi5)
	{
			if (isNotSAPUi5)
		{
			return oFF.XStringUtils.concatenate4("ff2210.ui.native/", "/javascript/", className, ".js");
		}
		return oFF.XStringUtils.concatenate4("ff2210.ui.native", "/javascript.sapui5/", className, ".js");
	}
};

oFF.UiDragDropDef = {

};

oFF.UiGridLayoutSize = function() {};
oFF.UiGridLayoutSize.prototype = new oFF.XObject();
oFF.UiGridLayoutSize.prototype._ff_c = "UiGridLayoutSize";

oFF.UiGridLayoutSize.s_auto = "AUTO";
oFF.UiGridLayoutSize.SIZE_UNDEFINED = -1;
oFF.UiGridLayoutSize.SIZE_STAR = -1;
oFF.UiGridLayoutSize.SIZE_AUTO = -2;
oFF.UiGridLayoutSize.create = function()
{
	return new oFF.UiGridLayoutSize();
};
oFF.UiGridLayoutSize.prototype.m_isInitialized = false;
oFF.UiGridLayoutSize.prototype.m_columnWidthsString = null;
oFF.UiGridLayoutSize.prototype.m_rowHeightsString = null;
oFF.UiGridLayoutSize.prototype.m_columnWidthsAuto = null;
oFF.UiGridLayoutSize.prototype.m_rowHeightsAuto = null;
oFF.UiGridLayoutSize.prototype.m_columnWidthsInt = null;
oFF.UiGridLayoutSize.prototype.m_rowHeightsInt = null;
oFF.UiGridLayoutSize.prototype.m_minColumnWidthsString = null;
oFF.UiGridLayoutSize.prototype.m_minRowHeightsString = null;
oFF.UiGridLayoutSize.prototype.m_minColumnWidthsInt = null;
oFF.UiGridLayoutSize.prototype.m_minRowHeightsInt = null;
oFF.UiGridLayoutSize.prototype.m_columnCount = 0;
oFF.UiGridLayoutSize.prototype.m_rowCount = 0;
oFF.UiGridLayoutSize.prototype.m_fixedColumnsCount = 0;
oFF.UiGridLayoutSize.prototype.m_fixedRowsCount = 0;
oFF.UiGridLayoutSize.prototype.m_topsInt = null;
oFF.UiGridLayoutSize.prototype.m_leftsInt = null;
oFF.UiGridLayoutSize.prototype.m_columnStar = 0;
oFF.UiGridLayoutSize.prototype.m_rowStar = 0;
oFF.UiGridLayoutSize.prototype.m_starWidth = 0;
oFF.UiGridLayoutSize.prototype.m_starHeight = 0;
oFF.UiGridLayoutSize.prototype.m_width = 0;
oFF.UiGridLayoutSize.prototype.m_height = 0;
oFF.UiGridLayoutSize.prototype.m_usedCells = null;
oFF.UiGridLayoutSize.prototype.setupExt = function(columnWidths, rowHeights, minColumnWidths, minRowHeights)
{
	this.setupWithCount(columnWidths, rowHeights, minColumnWidths, minRowHeights, -1, -1, -1, -1);
};
oFF.UiGridLayoutSize.prototype.setupWithCount = function(columnWidths, rowHeights, minColumnWidths, minRowHeights, columnCount, rowCount, fixedColumnsCount, fixedRowsCount)
{
	var stringValues = null;
	var stringValue;
	var fixedColumnsDefault;
	var columnDefault;
	var rowDefault;
	var fixedRowsDefault;
	var i;
	var j;
	var found;
	var element;
	this.m_isInitialized = false;
	this.m_columnWidthsString = columnWidths;
	this.m_rowHeightsString = rowHeights;
	this.m_minColumnWidthsString = minColumnWidths;
	this.m_minRowHeightsString = minRowHeights;
	this.m_columnCount = columnCount;
	this.m_rowCount = rowCount;
	this.m_fixedColumnsCount = fixedColumnsCount;
	this.m_fixedRowsCount = fixedRowsCount;
	this.m_columnStar = 0;
	this.m_rowStar = 0;
	if (oFF.isNull(this.m_columnWidthsString) && oFF.isNull(this.m_rowHeightsString))
	{
		this.m_columnWidthsString = "-1";
		this.m_rowHeightsString = "-1";
	}
	if (oFF.notNull(this.m_columnWidthsString))
	{
		stringValues = oFF.XStringTokenizer.splitString(this.m_columnWidthsString, ",");
		if (oFF.notNull(stringValues))
		{
			if (stringValues.size() === 1 && columnCount !== -1)
			{
				this.m_columnWidthsInt = oFF.XArrayOfInt.create(columnCount);
				this.m_columnWidthsAuto = oFF.XArrayOfInt.create(columnCount);
				stringValue = oFF.XString.toUpperCase(oFF.XString.trim(stringValues.get(0)));
				if (oFF.XString.isEqual(stringValue, oFF.UiGridLayoutSize.s_auto) === false)
				{
					columnDefault = oFF.XInteger.convertFromStringWithDefault(stringValue, 0);
				}
				else
				{
					columnDefault = oFF.UiGridLayoutSize.SIZE_AUTO;
				}
				for (i = 0; i < this.m_columnWidthsInt.size(); i++)
				{
					this.m_columnWidthsInt.set(i, columnDefault);
					this.m_columnWidthsAuto.set(i, columnDefault);
					if (this.m_columnWidthsInt.get(i) === oFF.UiGridLayoutSize.SIZE_STAR)
					{
						found = false;
						for (j = 0; j < this.m_usedCells.size1(); j++)
						{
							element = this.m_usedCells.getByIndices(i, j);
							if (oFF.notNull(element) && element.getBoolean())
							{
								found = true;
								break;
							}
						}
						if (found)
						{
							this.m_columnStar++;
						}
					}
				}
			}
			else if (stringValues.size() === 2 && fixedColumnsCount !== -1)
			{
				this.m_columnWidthsInt = oFF.XArrayOfInt.create(columnCount);
				this.m_columnWidthsAuto = oFF.XArrayOfInt.create(columnCount);
				fixedColumnsDefault = oFF.XInteger.convertFromStringWithDefault(oFF.XString.trim(stringValues.get(0)), 0);
				columnDefault = oFF.XInteger.convertFromStringWithDefault(oFF.XString.trim(stringValues.get(1)), 0);
				for (i = 0; i < fixedColumnsCount; i++)
				{
					this.m_columnWidthsInt.set(i, fixedColumnsDefault);
				}
				for (i = fixedColumnsCount; i < columnCount; i++)
				{
					this.m_columnWidthsInt.set(i, columnDefault);
				}
			}
			else
			{
				this.m_columnWidthsInt = oFF.XArrayOfInt.create(stringValues.size());
				this.m_columnWidthsAuto = oFF.XArrayOfInt.create(stringValues.size());
				for (i = 0; i < stringValues.size(); i++)
				{
					stringValue = oFF.XString.toUpperCase(oFF.XString.trim(stringValues.get(i)));
					if (oFF.XString.isEqual(stringValue, oFF.UiGridLayoutSize.s_auto) === false)
					{
						columnDefault = oFF.XInteger.convertFromStringWithDefault(stringValue, oFF.UiGridLayoutSize.SIZE_STAR);
					}
					else
					{
						columnDefault = oFF.UiGridLayoutSize.SIZE_AUTO;
					}
					this.m_columnWidthsInt.set(i, columnDefault);
					this.m_columnWidthsAuto.set(i, columnDefault);
					if (this.m_columnWidthsInt.get(i) === oFF.UiGridLayoutSize.SIZE_STAR)
					{
						this.m_columnStar++;
					}
				}
			}
			this.m_leftsInt = oFF.XArrayOfInt.create(this.m_columnWidthsInt.size());
		}
	}
	else if (oFF.isNull(this.m_columnWidthsString) && columnCount !== -1)
	{
		this.m_columnWidthsInt = oFF.XArrayOfInt.create(columnCount);
		this.m_columnWidthsAuto = oFF.XArrayOfInt.create(columnCount);
		for (i = 0; i < columnCount; i++)
		{
			this.m_columnWidthsInt.set(i, oFF.UiGridLayoutSize.SIZE_STAR);
			this.m_columnWidthsAuto.set(i, oFF.UiGridLayoutSize.SIZE_STAR);
			this.m_columnStar++;
		}
		this.m_leftsInt = oFF.XArrayOfInt.create(this.m_columnWidthsInt.size());
	}
	if (oFF.notNull(this.m_minColumnWidthsString))
	{
		stringValues = oFF.XStringTokenizer.splitString(this.m_minColumnWidthsString, ",");
		if (oFF.notNull(stringValues))
		{
			if (stringValues.size() === 1)
			{
				this.m_minColumnWidthsInt = oFF.XArrayOfInt.create(this.m_columnWidthsInt.size());
				columnDefault = oFF.XInteger.convertFromStringWithDefault(oFF.XString.trim(stringValues.get(0)), 0);
				for (i = 0; i < this.m_minColumnWidthsInt.size(); i++)
				{
					this.m_minColumnWidthsInt.set(i, columnDefault);
				}
			}
			else if (stringValues.size() === 2)
			{
				this.m_minColumnWidthsInt = oFF.XArrayOfInt.create(this.m_columnWidthsInt.size());
			}
			else
			{
				this.m_minColumnWidthsInt = oFF.XArrayOfInt.create(stringValues.size());
				for (i = 0; i < stringValues.size(); i++)
				{
					this.m_minColumnWidthsInt.set(i, oFF.XInteger.convertFromStringWithDefault(oFF.XString.trim(stringValues.get(i)), oFF.UiGridLayoutSize.SIZE_STAR));
				}
			}
		}
	}
	if (oFF.notNull(this.m_rowHeightsString))
	{
		stringValues = oFF.XStringTokenizer.splitString(this.m_rowHeightsString, ",");
		if (oFF.notNull(stringValues))
		{
			if (stringValues.size() === 1 && rowCount !== -1)
			{
				this.m_rowHeightsInt = oFF.XArrayOfInt.create(rowCount);
				this.m_rowHeightsAuto = oFF.XArrayOfInt.create(rowCount);
				stringValue = oFF.XString.toUpperCase(oFF.XString.trim(stringValues.get(0)));
				if (oFF.XString.isEqual(stringValue, oFF.UiGridLayoutSize.s_auto) === false)
				{
					rowDefault = oFF.XInteger.convertFromStringWithDefault(stringValue, 0);
				}
				else
				{
					rowDefault = oFF.UiGridLayoutSize.SIZE_AUTO;
				}
				for (i = 0; i < this.m_rowHeightsInt.size(); i++)
				{
					this.m_rowHeightsInt.set(i, rowDefault);
					this.m_rowHeightsAuto.set(i, rowDefault);
					if (this.m_rowHeightsInt.get(i) === oFF.UiGridLayoutSize.SIZE_STAR)
					{
						found = false;
						for (j = 0; j < this.m_usedCells.size0(); j++)
						{
							element = this.m_usedCells.getByIndices(j, i);
							if (oFF.notNull(element) && element.getBoolean())
							{
								found = true;
								break;
							}
						}
						if (found)
						{
							this.m_rowStar++;
						}
					}
				}
			}
			else if (stringValues.size() === 2 && fixedRowsCount !== -1)
			{
				this.m_rowHeightsInt = oFF.XArrayOfInt.create(rowCount);
				this.m_rowHeightsAuto = oFF.XArrayOfInt.create(rowCount);
				fixedRowsDefault = oFF.XInteger.convertFromStringWithDefault(oFF.XString.trim(stringValues.get(0)), 0);
				rowDefault = oFF.XInteger.convertFromStringWithDefault(oFF.XString.trim(stringValues.get(1)), 0);
				for (i = 0; i < fixedRowsCount; i++)
				{
					this.m_rowHeightsInt.set(i, fixedRowsDefault);
				}
				for (i = fixedRowsCount; i < rowCount; i++)
				{
					this.m_rowHeightsInt.set(i, rowDefault);
				}
			}
			else
			{
				this.m_rowHeightsInt = oFF.XArrayOfInt.create(stringValues.size());
				this.m_rowHeightsAuto = oFF.XArrayOfInt.create(stringValues.size());
				for (i = 0; i < stringValues.size(); i++)
				{
					stringValue = oFF.XString.toUpperCase(oFF.XString.trim(stringValues.get(i)));
					if (oFF.XString.isEqual(stringValue, oFF.UiGridLayoutSize.s_auto) === false)
					{
						rowDefault = oFF.XInteger.convertFromStringWithDefault(stringValue, oFF.UiGridLayoutSize.SIZE_STAR);
					}
					else
					{
						rowDefault = oFF.UiGridLayoutSize.SIZE_AUTO;
					}
					this.m_rowHeightsInt.set(i, rowDefault);
					this.m_rowHeightsAuto.set(i, rowDefault);
					if (this.m_rowHeightsInt.get(i) === oFF.UiGridLayoutSize.SIZE_STAR)
					{
						this.m_rowStar++;
					}
				}
			}
			this.m_topsInt = oFF.XArrayOfInt.create(this.m_rowHeightsInt.size());
		}
	}
	else if (oFF.isNull(this.m_rowHeightsString) && rowCount !== -1)
	{
		this.m_rowHeightsInt = oFF.XArrayOfInt.create(rowCount);
		this.m_rowHeightsAuto = oFF.XArrayOfInt.create(rowCount);
		for (i = 0; i < rowCount; i++)
		{
			this.m_rowHeightsInt.set(i, oFF.UiGridLayoutSize.SIZE_STAR);
			this.m_rowHeightsAuto.set(i, oFF.UiGridLayoutSize.SIZE_STAR);
			this.m_rowStar++;
		}
		this.m_topsInt = oFF.XArrayOfInt.create(this.m_rowHeightsInt.size());
	}
	if (oFF.notNull(this.m_minRowHeightsString))
	{
		stringValues = oFF.XStringTokenizer.splitString(this.m_minRowHeightsString, ",");
		if (oFF.notNull(stringValues))
		{
			if (stringValues.size() === 1)
			{
				this.m_minRowHeightsInt = oFF.XArrayOfInt.create(this.m_rowHeightsInt.size());
				rowDefault = oFF.XInteger.convertFromStringWithDefault(oFF.XString.trim(stringValues.get(0)), 0);
				for (i = 0; i < this.m_minRowHeightsInt.size(); i++)
				{
					this.m_minRowHeightsInt.set(i, rowDefault);
				}
			}
			else if (stringValues.size() === 2)
			{
				this.m_minRowHeightsInt = oFF.XArrayOfInt.create(this.m_rowHeightsInt.size());
			}
			else
			{
				this.m_minRowHeightsInt = oFF.XArrayOfInt.create(stringValues.size());
				for (i = 0; i < stringValues.size(); i++)
				{
					this.m_minRowHeightsInt.set(i, oFF.XInteger.convertFromStringWithDefault(oFF.XString.trim(stringValues.get(i)), oFF.UiGridLayoutSize.SIZE_STAR));
				}
			}
		}
	}
};
oFF.UiGridLayoutSize.prototype.setSize = function(width, height)
{
	if (width !== -1)
	{
		this.m_width = width;
	}
	if (this.m_width === 0)
	{
		this.m_width = this.m_starWidth;
	}
	if (height !== -1)
	{
		this.m_height = height;
	}
	if (this.m_height === 0)
	{
		this.m_height = this.m_starHeight;
	}
	if (oFF.notNull(this.m_columnWidthsInt) && this.m_columnWidthsInt.size() > 0)
	{
		var autoWidth = false;
		this.m_isInitialized = true;
		if (this.m_width !== oFF.UiGridLayoutSize.SIZE_STAR)
		{
			this.m_starWidth = this.m_width;
		}
		var column;
		for (column = 0; column < this.m_columnWidthsInt.size(); column++)
		{
			if (this.m_columnWidthsInt.get(column) > oFF.UiGridLayoutSize.SIZE_STAR)
			{
				this.m_starWidth = this.m_starWidth - this.m_columnWidthsInt.get(column);
			}
			else if (this.m_columnWidthsInt.get(column) === oFF.UiGridLayoutSize.SIZE_AUTO)
			{
				autoWidth = true;
			}
		}
		if (this.m_columnStar !== 0)
		{
			this.m_starWidth = this.m_starWidth / this.m_columnStar;
		}
		if (this.m_starWidth < 0)
		{
			this.m_starWidth = 0;
		}
		var left = 0;
		for (column = 0; column < this.m_leftsInt.size(); column++)
		{
			this.m_leftsInt.set(column, left);
			if (this.m_columnWidthsInt.get(column) === oFF.UiGridLayoutSize.SIZE_STAR)
			{
				if (oFF.notNull(this.m_minColumnWidthsInt) && this.m_columnWidthsInt.get(column) === oFF.UiGridLayoutSize.SIZE_STAR && column < this.m_minColumnWidthsInt.size() && this.m_minColumnWidthsInt.get(column) > oFF.UiGridLayoutSize.SIZE_STAR && this.m_starWidth < this.m_minColumnWidthsInt.get(column))
				{
					left = left + this.m_minColumnWidthsInt.get(column);
				}
				else
				{
					left = left + this.m_starWidth;
				}
			}
			else
			{
				left = left + this.m_columnWidthsInt.get(column);
			}
		}
		if (autoWidth === false)
		{
			this.m_width = this.m_leftsInt.get(this.m_leftsInt.size() - 1) + this.m_columnWidthsInt.get(this.m_leftsInt.size() - 1);
		}
	}
	if (oFF.notNull(this.m_rowHeightsInt) && this.m_rowHeightsInt.size() > 0)
	{
		var autoHeight = false;
		this.m_isInitialized = true;
		this.m_starHeight = this.m_height;
		var row;
		for (row = 0; row < this.m_rowHeightsInt.size(); row++)
		{
			if (this.m_rowHeightsInt.get(row) > oFF.UiGridLayoutSize.SIZE_STAR)
			{
				this.m_starHeight = this.m_starHeight - this.m_rowHeightsInt.get(row);
			}
			else if (this.m_rowHeightsInt.get(row) === oFF.UiGridLayoutSize.SIZE_AUTO)
			{
				autoHeight = true;
			}
		}
		if (this.m_rowStar !== 0)
		{
			this.m_starHeight = this.m_starHeight / this.m_rowStar;
		}
		if (this.m_starHeight < 0)
		{
			this.m_starHeight = 0;
		}
		var top = 0;
		for (row = 0; row < this.m_topsInt.size(); row++)
		{
			this.m_topsInt.set(row, top);
			if (this.m_rowHeightsInt.get(row) === oFF.UiGridLayoutSize.SIZE_STAR)
			{
				if (oFF.notNull(this.m_minRowHeightsInt) && this.m_rowHeightsInt.get(row) === oFF.UiGridLayoutSize.SIZE_STAR && row < this.m_minRowHeightsInt.size() && this.m_minRowHeightsInt.get(row) > oFF.UiGridLayoutSize.SIZE_STAR && this.m_starHeight < this.m_minRowHeightsInt.get(row))
				{
					top = top + this.m_minRowHeightsInt.get(row);
				}
				else
				{
					top = top + this.m_starHeight;
				}
			}
			else
			{
				top = top + this.m_rowHeightsInt.get(row);
			}
		}
		if (autoHeight === false)
		{
			this.m_height = this.m_topsInt.get(this.m_topsInt.size() - 1) + this.m_rowHeightsInt.get(this.m_topsInt.size() - 1);
		}
	}
};
oFF.UiGridLayoutSize.prototype.setColumnWidth = function(column, row, width)
{
	if (this.m_columnWidthsInt.get(column) < width)
	{
		this.m_columnWidthsInt.set(column, width);
		this.setSize(-1, -1);
	}
};
oFF.UiGridLayoutSize.prototype.setRowHeight = function(column, row, height)
{
	if (this.m_rowHeightsInt.get(row) < height)
	{
		this.m_rowHeightsInt.set(row, height);
		this.setSize(-1, -1);
	}
};
oFF.UiGridLayoutSize.prototype.getPositionSize = function(column, row)
{
	return this.getPositionSizeSpan(column, row, 1, 1);
};
oFF.UiGridLayoutSize.prototype.getPositionSizeSpan = function(column, row, columnSpan, rowSpan)
{
	var positionSize = oFF.XArrayOfInt.create(4);
	var i;
	if (oFF.isNull(this.m_leftsInt) || column < 0 || column >= this.m_leftsInt.size())
	{
		positionSize.set(0, 0);
		positionSize.set(2, 0);
	}
	else
	{
		positionSize.set(0, this.m_leftsInt.get(column));
		var width = 0;
		for (i = column; i < column + columnSpan; i++)
		{
			if (this.m_columnWidthsInt.get(i) === oFF.UiGridLayoutSize.SIZE_STAR)
			{
				if (oFF.notNull(this.m_minColumnWidthsInt) && this.m_columnWidthsInt.get(i) === oFF.UiGridLayoutSize.SIZE_STAR && i < this.m_minColumnWidthsInt.size() && this.m_minColumnWidthsInt.get(i) > oFF.UiGridLayoutSize.SIZE_STAR && this.m_starWidth < this.m_minColumnWidthsInt.get(i))
				{
					width = width + this.m_minColumnWidthsInt.get(i);
				}
				else
				{
					width = width + this.m_starWidth;
				}
			}
			else if (this.m_columnWidthsInt.get(i) === oFF.UiGridLayoutSize.SIZE_AUTO)
			{
				width = oFF.UiGridLayoutSize.SIZE_AUTO;
			}
			else
			{
				width = width + this.m_columnWidthsInt.get(i);
			}
		}
		positionSize.set(2, width);
	}
	if (oFF.isNull(this.m_topsInt) || row < 0 || row >= this.m_topsInt.size())
	{
		positionSize.set(1, 0);
		positionSize.set(3, 0);
	}
	else
	{
		positionSize.set(1, this.m_topsInt.get(row));
		var height = 0;
		for (i = row; i < row + rowSpan; i++)
		{
			if (this.m_rowHeightsInt.get(i) === oFF.UiGridLayoutSize.SIZE_STAR)
			{
				if (oFF.notNull(this.m_minRowHeightsInt) && this.m_rowHeightsInt.get(i) === oFF.UiGridLayoutSize.SIZE_STAR && i < this.m_minRowHeightsInt.size() && this.m_minRowHeightsInt.get(i) > oFF.UiGridLayoutSize.SIZE_STAR && this.m_starHeight < this.m_minRowHeightsInt.get(i))
				{
					height = height + this.m_minRowHeightsInt.get(i);
				}
				else
				{
					height = height + this.m_starHeight;
				}
			}
			else if (this.m_rowHeightsInt.get(i) === oFF.UiGridLayoutSize.SIZE_AUTO)
			{
				height = oFF.UiGridLayoutSize.SIZE_AUTO;
			}
			else
			{
				height = height + this.m_rowHeightsInt.get(i);
			}
		}
		positionSize.set(3, height);
	}
	return positionSize;
};
oFF.UiGridLayoutSize.prototype.isInitialized = function()
{
	return this.m_isInitialized;
};
oFF.UiGridLayoutSize.prototype.getColumnCountVisible = function(width)
{
	if (oFF.notNull(this.m_leftsInt))
	{
		var i;
		for (i = 0; i < this.m_leftsInt.size(); i++)
		{
			if (width < this.m_leftsInt.get(i))
			{
				return i;
			}
		}
		return i;
	}
	return 0;
};
oFF.UiGridLayoutSize.prototype.getColumnCountFull = function(width)
{
	if (oFF.notNull(this.m_leftsInt))
	{
		var i;
		for (i = 0; i < this.m_leftsInt.size(); i++)
		{
			if (width <= this.m_leftsInt.get(i))
			{
				return i - 1;
			}
		}
		return i;
	}
	return 0;
};
oFF.UiGridLayoutSize.prototype.getRowCountVisible = function(height)
{
	if (oFF.notNull(this.m_topsInt))
	{
		var i;
		for (i = 0; i < this.m_topsInt.size(); i++)
		{
			if (height < this.m_topsInt.get(i))
			{
				return i;
			}
		}
		return i;
	}
	return 0;
};
oFF.UiGridLayoutSize.prototype.getRowCountFull = function(height)
{
	if (oFF.notNull(this.m_topsInt))
	{
		var i;
		for (i = 0; i < this.m_topsInt.size(); i++)
		{
			if (height <= this.m_topsInt.get(i))
			{
				return i - 1;
			}
		}
		return i;
	}
	return 0;
};
oFF.UiGridLayoutSize.prototype.isColumnAuto = function(column)
{
	if (this.m_columnWidthsAuto.size() > column && this.m_columnWidthsAuto.get(column) === oFF.UiGridLayoutSize.SIZE_AUTO)
	{
		return true;
	}
	return false;
};
oFF.UiGridLayoutSize.prototype.isRowAuto = function(row)
{
	if (this.m_rowHeightsAuto.size() > row && this.m_rowHeightsAuto.get(row) === oFF.UiGridLayoutSize.SIZE_AUTO)
	{
		return true;
	}
	return false;
};
oFF.UiGridLayoutSize.prototype.getWidth = function()
{
	return this.m_width;
};
oFF.UiGridLayoutSize.prototype.getHeight = function()
{
	return this.m_height;
};
oFF.UiGridLayoutSize.prototype.setColumnWidths = function(columnWidths)
{
	this.m_columnWidthsString = columnWidths;
	this.setupWithCount(this.m_columnWidthsString, this.m_rowHeightsString, this.m_minColumnWidthsString, this.m_minRowHeightsString, this.m_columnCount, this.m_rowCount, this.m_fixedColumnsCount, this.m_fixedRowsCount);
};
oFF.UiGridLayoutSize.prototype.getColumnWidths = function()
{
	return this.m_columnWidthsString;
};
oFF.UiGridLayoutSize.prototype.setRowHeights = function(rowHeights)
{
	this.m_rowHeightsString = rowHeights;
	this.setupWithCount(this.m_columnWidthsString, this.m_rowHeightsString, this.m_minColumnWidthsString, this.m_minRowHeightsString, this.m_columnCount, this.m_rowCount, this.m_fixedColumnsCount, this.m_fixedRowsCount);
};
oFF.UiGridLayoutSize.prototype.getRowHeights = function()
{
	return this.m_rowHeightsString;
};
oFF.UiGridLayoutSize.prototype.setMinColumnWidths = function(minColumnWidths)
{
	this.m_minColumnWidthsString = minColumnWidths;
	this.setupWithCount(this.m_columnWidthsString, this.m_rowHeightsString, this.m_minColumnWidthsString, this.m_minRowHeightsString, this.m_columnCount, this.m_rowCount, this.m_fixedColumnsCount, this.m_fixedRowsCount);
};
oFF.UiGridLayoutSize.prototype.getMinColumnWidths = function()
{
	return this.m_minColumnWidthsString;
};
oFF.UiGridLayoutSize.prototype.setMinRowHeights = function(minRowHeights)
{
	this.m_minRowHeightsString = minRowHeights;
	this.setupWithCount(this.m_columnWidthsString, this.m_rowHeightsString, this.m_minColumnWidthsString, this.m_minRowHeightsString, this.m_columnCount, this.m_rowCount, this.m_fixedColumnsCount, this.m_fixedRowsCount);
};
oFF.UiGridLayoutSize.prototype.getMinRowHeights = function()
{
	return this.m_minRowHeightsString;
};
oFF.UiGridLayoutSize.prototype.getColumnCount = function()
{
	return this.m_columnCount;
};
oFF.UiGridLayoutSize.prototype.setColumnCount = function(columnCount)
{
	if (columnCount > 0 && this.m_columnCount < columnCount)
	{
		this.m_columnCount = columnCount;
	}
};
oFF.UiGridLayoutSize.prototype.getRowCount = function()
{
	return this.m_rowCount;
};
oFF.UiGridLayoutSize.prototype.setRowCount = function(rowCount)
{
	if (rowCount > 0 && this.m_rowCount < rowCount)
	{
		this.m_rowCount = rowCount;
	}
};
oFF.UiGridLayoutSize.prototype.recalculate = function()
{
	this.setupWithCount(this.m_columnWidthsString, this.m_rowHeightsString, this.m_minColumnWidthsString, this.m_minRowHeightsString, this.m_columnCount, this.m_rowCount, this.m_fixedColumnsCount, this.m_fixedRowsCount);
};
oFF.UiGridLayoutSize.prototype.setNewItemAt = function(column, row)
{
	this.setColumnCount(column + 1);
	this.setRowCount(row + 1);
	if (oFF.isNull(this.m_usedCells))
	{
		if (this.getColumnCount() === -1)
		{
			this.setColumnCount(1);
		}
		if (this.getRowCount() === -1)
		{
			this.setRowCount(1);
		}
		this.m_usedCells = oFF.XArray2Dim.create(this.getColumnCount(), this.getRowCount());
	}
	else
	{
		if (this.m_usedCells.size0() < this.getColumnCount() || this.m_usedCells.size1() < this.getRowCount())
		{
			var usedCells = oFF.XArray2Dim.create(this.getColumnCount(), this.getRowCount());
			var index0;
			var index1;
			var element;
			for (index1 = 0; index1 < this.m_usedCells.size1(); index1++)
			{
				for (index0 = 0; index0 < this.m_usedCells.size0(); index0++)
				{
					element = this.m_usedCells.getByIndices(index0, index1);
					usedCells.setByIndices(index0, index1, element);
				}
			}
			this.m_usedCells = usedCells;
		}
	}
	this.m_usedCells.setByIndices(column, row, oFF.XBooleanValue.create(true));
	return;
};
oFF.UiGridLayoutSize.prototype.addNewItem = function(parent)
{
	var position = this.getNextPosition();
	var firstIndex = position.get(0);
	var secondIndex = position.get(1);
	if (firstIndex === -1 && secondIndex === -1)
	{
		firstIndex = 0;
		secondIndex = this.getRowCount();
		if (secondIndex === -1)
		{
			secondIndex = 0;
		}
	}
	var newItem = parent.addNewItemAt(firstIndex, secondIndex);
	this.recalculate();
	parent.setSize(oFF.UiSize.create(-1, -1));
	parent.layout();
	return newItem;
};
oFF.UiGridLayoutSize.prototype.getNextPosition = function()
{
	var position = oFF.XArrayOfInt.create(2);
	position.set(0, -1);
	position.set(1, -1);
	if (oFF.notNull(this.m_usedCells))
	{
		var index0;
		var index1;
		var element;
		for (index1 = 0; index1 < this.m_usedCells.size1(); index1++)
		{
			for (index0 = 0; index0 < this.m_usedCells.size0(); index0++)
			{
				element = this.m_usedCells.getByIndices(index0, index1);
				if (oFF.isNull(element) || element.getBoolean() === false)
				{
					position.set(0, index0);
					position.set(1, index1);
					return position;
				}
			}
		}
	}
	return position;
};

oFF.UiMarker = function() {};
oFF.UiMarker.prototype = new oFF.XObject();
oFF.UiMarker.prototype._ff_c = "UiMarker";

oFF.UiMarker.create = function()
{
	return new oFF.UiMarker();
};
oFF.UiMarker.prototype.m_point = null;
oFF.UiMarker.prototype.getPolyPoint = function()
{
	return this.m_point;
};
oFF.UiMarker.prototype.setPolyPoint = function(point)
{
	this.m_point = point;
};

oFF.MxGridSampleSampleMatrix = {

};

oFF.MxMatrixErrorMsg = function() {};
oFF.MxMatrixErrorMsg.prototype = new oFF.XObject();
oFF.MxMatrixErrorMsg.prototype._ff_c = "MxMatrixErrorMsg";

oFF.MxMatrixErrorMsg.prototype.m_displayError = false;
oFF.MxMatrixErrorMsg.prototype.m_errorText = null;
oFF.MxMatrixErrorMsg.prototype.m_errorTitle = null;
oFF.MxMatrixErrorMsg.prototype.displayError = function()
{
	return this.m_displayError;
};
oFF.MxMatrixErrorMsg.prototype.getErrorText = function()
{
	return this.m_errorText;
};
oFF.MxMatrixErrorMsg.prototype.getErrorTitle = function()
{
	return this.m_errorTitle;
};

oFF.SxDialogSaveAs = function() {};
oFF.SxDialogSaveAs.prototype = new oFF.XObject();
oFF.SxDialogSaveAs.prototype._ff_c = "SxDialogSaveAs";

oFF.SxDialogSaveAs.create = function(simplexApp)
{
	var newObj = new oFF.SxDialogSaveAs();
	newObj.setupDialog(simplexApp);
	return newObj;
};
oFF.SxDialogSaveAs.prototype.m_uiDialog = null;
oFF.SxDialogSaveAs.prototype.m_uiInput = null;
oFF.SxDialogSaveAs.prototype.m_document = null;
oFF.SxDialogSaveAs.prototype.setupDialog = function(simplexApp) {};
oFF.SxDialogSaveAs.prototype.open = function(document) {};
oFF.SxDialogSaveAs.prototype.onSelect = function(event)
{
	var button = event.getControl().getName();
	if (oFF.XString.isEqual(button, "OK"))
	{
		var text = this.m_uiInput.getText();
		this.m_document.saveAs(text);
	}
	this.m_uiDialog.setVisible(false);
};

oFF.SxModelTree = function() {};
oFF.SxModelTree.prototype = new oFF.XObject();
oFF.SxModelTree.prototype._ff_c = "SxModelTree";

oFF.SxModelTree.CMD_MOVE_TO_ROW = null;
oFF.SxModelTree.CMD_MOVE_TO_COL = null;
oFF.SxModelTree.CMD_MOVE_TO_FREE = null;
oFF.SxModelTree.CMD_SHOW_KEY = null;
oFF.SxModelTree.CMD_SHOW_TEXT = null;
oFF.SxModelTree.CMD_SHOW_KEY_TEXT = null;
oFF.SxModelTree.CMD_SHOW_TEXT_KEY = null;
oFF.SxModelTree.CMD_ALIGN_TOTALS_ON_TOP = null;
oFF.SxModelTree.CMD_ALIGN_TOTALS_ON_BOTTOM = null;
oFF.SxModelTree.CMD_ALIGN_TOTALS_ON_TOP_AND_BOTTOM = null;
oFF.SxModelTree.CMD_ALIGN_TOTALS_ON_DEFAULT = null;
oFF.SxModelTree.CMD_DISPLAY_TOTALS_ENABLE = null;
oFF.SxModelTree.CMD_DISPLAY_TOTALS_DISABLE = null;
oFF.SxModelTree.CMD_DISPLAY_TOTALS_CONDITIONAL = null;
oFF.SxModelTree.CMD_DISPLAY_TOTALS_DEFAULT = null;
oFF.SxModelTree.CMD_SORT_BY_KEY_ASC = null;
oFF.SxModelTree.CMD_SORT_BY_KEY_DESC = null;
oFF.SxModelTree.CMD_SORT_BY_TEXT_ASC = null;
oFF.SxModelTree.CMD_SORT_BY_TEXT_DESC = null;
oFF.SxModelTree.CMD_SORT_BY_DEFAULT = null;
oFF.SxModelTree.CMD_SORT_BY_HIERARCHY = null;
oFF.SxModelTree.CMD_ADD_ATTRIBUTE_TO_RS = null;
oFF.SxModelTree.CMD_REMOVE_ATTRIBUTE_FROM_RS = null;
oFF.SxModelTree.CMD_CUT = null;
oFF.SxModelTree.CMD_COPY = null;
oFF.SxModelTree.CMD_PASTE = null;
oFF.SxModelTree.CMD_PROPERTIES = null;
oFF.SxModelTree.staticSetup = function()
{
	oFF.SxModelTree.CMD_MOVE_TO_ROW = oFF.XStringValue.create("Move to rows axis");
	oFF.SxModelTree.CMD_MOVE_TO_COL = oFF.XStringValue.create("Move to columns axis");
	oFF.SxModelTree.CMD_MOVE_TO_FREE = oFF.XStringValue.create("Move to free axis");
	oFF.SxModelTree.CMD_SHOW_KEY = oFF.XStringValue.create("Show key");
	oFF.SxModelTree.CMD_SHOW_KEY_TEXT = oFF.XStringValue.create("Show key & text");
	oFF.SxModelTree.CMD_SHOW_TEXT = oFF.XStringValue.create("Show text");
	oFF.SxModelTree.CMD_SHOW_TEXT_KEY = oFF.XStringValue.create("Show text & key");
	oFF.SxModelTree.CMD_ALIGN_TOTALS_ON_BOTTOM = oFF.XStringValue.create("Align totals on bottom");
	oFF.SxModelTree.CMD_ALIGN_TOTALS_ON_TOP = oFF.XStringValue.create("Align totals on top");
	oFF.SxModelTree.CMD_ALIGN_TOTALS_ON_TOP_AND_BOTTOM = oFF.XStringValue.create("Align totals on top and bottom");
	oFF.SxModelTree.CMD_ALIGN_TOTALS_ON_DEFAULT = oFF.XStringValue.create("Align totals on default");
	oFF.SxModelTree.CMD_DISPLAY_TOTALS_ENABLE = oFF.XStringValue.create("Show totals");
	oFF.SxModelTree.CMD_DISPLAY_TOTALS_DISABLE = oFF.XStringValue.create("Hide totals");
	oFF.SxModelTree.CMD_DISPLAY_TOTALS_CONDITIONAL = oFF.XStringValue.create("Hide totals if only one value is aggregated");
	oFF.SxModelTree.CMD_DISPLAY_TOTALS_DEFAULT = oFF.XStringValue.create("Display totals on default");
	oFF.SxModelTree.CMD_SORT_BY_KEY_ASC = oFF.XStringValue.create("Sort by key asc");
	oFF.SxModelTree.CMD_SORT_BY_KEY_DESC = oFF.XStringValue.create("Sort by key desc");
	oFF.SxModelTree.CMD_SORT_BY_TEXT_ASC = oFF.XStringValue.create("Sort by text asc");
	oFF.SxModelTree.CMD_SORT_BY_TEXT_DESC = oFF.XStringValue.create("Sort by text desc");
	oFF.SxModelTree.CMD_SORT_BY_HIERARCHY = oFF.XStringValue.create("Sort by hierarchy");
	oFF.SxModelTree.CMD_SORT_BY_DEFAULT = oFF.XStringValue.create("Sort by default");
	oFF.SxModelTree.CMD_ADD_ATTRIBUTE_TO_RS = oFF.XStringValue.create("Add attribute to resultset");
	oFF.SxModelTree.CMD_REMOVE_ATTRIBUTE_FROM_RS = oFF.XStringValue.create("Remove attribute from resultset");
	oFF.SxModelTree.CMD_CUT = oFF.XStringValue.create("Cut");
	oFF.SxModelTree.CMD_COPY = oFF.XStringValue.create("Copy");
	oFF.SxModelTree.CMD_PASTE = oFF.XStringValue.create("Paste");
	oFF.SxModelTree.CMD_PROPERTIES = oFF.XStringValue.create("Properties");
};
oFF.SxModelTree.prototype.m_textArea = null;
oFF.SxModelTree.prototype.buildTree = function(uiParent, queryModel)
{
	var uiSplitter = uiParent.setNewContent(oFF.UiType.VERTICAL_SPLITTER);
	var tree = uiSplitter.addNewItemOfType(oFF.UiType.TREE);
	tree.registerOnContextMenu(this).registerOnSelect(this);
	this.addNode(tree, queryModel);
	this.m_textArea = uiSplitter.addNewItemOfType(oFF.UiType.TEXT_AREA).setText("Hello world");
};
oFF.SxModelTree.prototype.addNode = function(parent, modelComponent)
{
	if (oFF.notNull(modelComponent))
	{
		var item = parent.addNewItem();
		var modelComponentType = modelComponent.getOlapComponentType();
		var componentType = "";
		if (oFF.notNull(modelComponentType))
		{
			componentType = modelComponentType.getName();
		}
		var name = modelComponent.getName();
		var text = oFF.XStringUtils.concatenate3(componentType, ": ", name);
		item.setText(text);
		item.setExpanded(false);
		item.setCustomObject(modelComponent);
		var children = modelComponent.getChildrenIterator();
		if (oFF.notNull(children))
		{
			while (children.hasNext())
			{
				var child = children.next();
				this.addNode(item, child);
			}
		}
	}
};
oFF.SxModelTree.prototype.onContextMenu = function(event)
{
	var selectedItem = event.getControl();
	if (oFF.notNull(selectedItem))
	{
		var modelComponent = selectedItem.getCustomObject();
		if (oFF.notNull(modelComponent))
		{
			var olapComponentType = modelComponent.getOlapComponentType();
			var uiManager = selectedItem.getUiManager();
			var root = uiManager.getAnchor();
			var contextMenu = root.newControl(oFF.UiType.MENU);
			contextMenu.setCustomObject(modelComponent);
			if (olapComponentType.isTypeOf(oFF.OlapComponentType.ABSTRACT_DIMENSION))
			{
				var dimension = modelComponent;
				var axis = dimension.getAxis();
				var type = axis.getType();
				if (type === oFF.AxisType.COLUMNS)
				{
					this.addMenu(contextMenu, oFF.SxModelTree.CMD_MOVE_TO_ROW);
					this.addMenu(contextMenu, oFF.SxModelTree.CMD_MOVE_TO_FREE);
				}
				else if (type === oFF.AxisType.ROWS)
				{
					this.addMenu(contextMenu, oFF.SxModelTree.CMD_MOVE_TO_COL);
					this.addMenu(contextMenu, oFF.SxModelTree.CMD_MOVE_TO_FREE);
				}
				else
				{
					this.addMenu(contextMenu, oFF.SxModelTree.CMD_MOVE_TO_ROW);
					this.addMenu(contextMenu, oFF.SxModelTree.CMD_MOVE_TO_COL);
				}
				this.addMenu(contextMenu, oFF.SxModelTree.CMD_SHOW_KEY);
				this.addMenu(contextMenu, oFF.SxModelTree.CMD_SHOW_KEY_TEXT);
				this.addMenu(contextMenu, oFF.SxModelTree.CMD_SHOW_TEXT);
				this.addMenu(contextMenu, oFF.SxModelTree.CMD_SHOW_TEXT_KEY);
				var queryModel = dimension.getQueryModel();
				var modelCapabilities = queryModel.getModelCapabilities();
				var sortingManager = queryModel.getSortingManager();
				var dimensionSorting = sortingManager.getDimensionSorting(dimension, false);
				var sortingType = null;
				var direction = null;
				if (oFF.notNull(dimensionSorting))
				{
					sortingType = dimensionSorting.getSortingType();
					direction = dimensionSorting.getDirection();
				}
				if (modelCapabilities.supportsDimensionSorting(dimension, oFF.SortType.MEMBER_KEY))
				{
					if (oFF.isNull(dimensionSorting))
					{
						this.addMenu(contextMenu, oFF.SxModelTree.CMD_SORT_BY_KEY_ASC);
						this.addMenu(contextMenu, oFF.SxModelTree.CMD_SORT_BY_KEY_DESC);
					}
					else
					{
						if (sortingType !== oFF.SortType.MEMBER_KEY || direction !== oFF.XSortDirection.ASCENDING)
						{
							this.addMenu(contextMenu, oFF.SxModelTree.CMD_SORT_BY_KEY_ASC);
						}
						if (sortingType !== oFF.SortType.MEMBER_KEY || direction !== oFF.XSortDirection.DESCENDING)
						{
							this.addMenu(contextMenu, oFF.SxModelTree.CMD_SORT_BY_KEY_DESC);
						}
					}
				}
				if (modelCapabilities.supportsDimensionSorting(dimension, oFF.SortType.MEMBER_TEXT))
				{
					if (oFF.isNull(dimensionSorting))
					{
						this.addMenu(contextMenu, oFF.SxModelTree.CMD_SORT_BY_TEXT_ASC);
						this.addMenu(contextMenu, oFF.SxModelTree.CMD_SORT_BY_TEXT_DESC);
					}
					else
					{
						if (sortingType !== oFF.SortType.MEMBER_TEXT || direction !== oFF.XSortDirection.ASCENDING)
						{
							this.addMenu(contextMenu, oFF.SxModelTree.CMD_SORT_BY_TEXT_ASC);
						}
						if (sortingType !== oFF.SortType.MEMBER_TEXT || direction !== oFF.XSortDirection.DESCENDING)
						{
							this.addMenu(contextMenu, oFF.SxModelTree.CMD_SORT_BY_TEXT_DESC);
						}
					}
				}
				if (modelCapabilities.supportsDimensionSorting(dimension, oFF.SortType.HIERARCHY))
				{
					if (sortingType !== oFF.SortType.HIERARCHY)
					{
						this.addMenu(contextMenu, oFF.SxModelTree.CMD_SORT_BY_HIERARCHY);
					}
				}
				this.addMenu(contextMenu, oFF.SxModelTree.CMD_SORT_BY_DEFAULT);
			}
			else if (olapComponentType.isTypeOf(oFF.OlapComponentType.ATTRIBUTE))
			{
				this.addMenu(contextMenu, oFF.SxModelTree.CMD_ADD_ATTRIBUTE_TO_RS);
				this.addMenu(contextMenu, oFF.SxModelTree.CMD_REMOVE_ATTRIBUTE_FROM_RS);
			}
			if (olapComponentType.isTypeOf(oFF.OlapComponentType.QUERY_MODEL) || olapComponentType.isTypeOf(oFF.OlapComponentType.AXIS) || olapComponentType.isTypeOf(oFF.OlapComponentType.ABSTRACT_DIMENSION))
			{
				var totalsManager = modelComponent;
				var modelCapabilitites = totalsManager.getModelCapabilities();
				if (totalsManager.supportsResultAlignment())
				{
					var currentResultAlignment = null;
					if (totalsManager.isTotalsAlignmentOnDefault() === false)
					{
						currentResultAlignment = totalsManager.getResultAlignment();
						this.addMenu(contextMenu, oFF.SxModelTree.CMD_ALIGN_TOTALS_ON_DEFAULT);
					}
					if (currentResultAlignment !== oFF.ResultAlignment.BOTTOM && modelCapabilitites.supportsResultAlignmentType(oFF.ResultAlignment.BOTTOM))
					{
						this.addMenu(contextMenu, oFF.SxModelTree.CMD_ALIGN_TOTALS_ON_BOTTOM);
					}
					if (currentResultAlignment !== oFF.ResultAlignment.TOP && modelCapabilitites.supportsResultAlignmentType(oFF.ResultAlignment.TOP))
					{
						this.addMenu(contextMenu, oFF.SxModelTree.CMD_ALIGN_TOTALS_ON_TOP);
					}
					if (currentResultAlignment !== oFF.ResultAlignment.TOPBOTTOM && modelCapabilitites.supportsResultAlignmentType(oFF.ResultAlignment.TOPBOTTOM))
					{
						this.addMenu(contextMenu, oFF.SxModelTree.CMD_ALIGN_TOTALS_ON_TOP_AND_BOTTOM);
					}
				}
				if (totalsManager.supportsResultVisibility())
				{
					var currentResultVisibility = null;
					if (totalsManager.isTotalsVisibilityOnDefault() === false)
					{
						currentResultVisibility = totalsManager.getResultVisibility();
						this.addMenu(contextMenu, oFF.SxModelTree.CMD_DISPLAY_TOTALS_DEFAULT);
					}
					if (currentResultVisibility !== oFF.ResultVisibility.VISIBLE)
					{
						this.addMenu(contextMenu, oFF.SxModelTree.CMD_DISPLAY_TOTALS_ENABLE);
					}
					if (currentResultVisibility !== oFF.ResultVisibility.HIDDEN)
					{
						this.addMenu(contextMenu, oFF.SxModelTree.CMD_DISPLAY_TOTALS_DISABLE);
					}
					if (currentResultVisibility !== oFF.ResultVisibility.CONDITIONAL && modelCapabilitites.supportsConditionalResults())
					{
						this.addMenu(contextMenu, oFF.SxModelTree.CMD_DISPLAY_TOTALS_CONDITIONAL);
					}
				}
			}
			this.addMenu(contextMenu, oFF.SxModelTree.CMD_CUT);
			this.addMenu(contextMenu, oFF.SxModelTree.CMD_COPY);
			this.addMenu(contextMenu, oFF.SxModelTree.CMD_PASTE).setEnabled(false);
			this.addMenu(contextMenu, oFF.SxModelTree.CMD_PROPERTIES);
			var posX = event.getParameters().getIntegerByKeyExt(oFF.UiControlEvent.PARAM_CLICK_X, 0);
			var posY = event.getParameters().getIntegerByKeyExt(oFF.UiControlEvent.PARAM_CLICK_Y, 0);
			contextMenu.openAtPosition(posX, posY);
		}
	}
};
oFF.SxModelTree.prototype.addMenu = function(contextMenu, cmd)
{
	var uiObj = contextMenu.addNewItem();
	uiObj.setText(cmd.getString());
	uiObj.setCustomObject(cmd);
	return uiObj;
};
oFF.SxModelTree.prototype.onSelect = function(event)
{
	var control = event.getControl();
	var selectedItem = event.getSelectedItem();
	var uiType = selectedItem.getUiType();
	if (uiType === oFF.UiType.MENU_ITEM)
	{
		var modelComponent = control.getCustomObject();
		var name = modelComponent.getName();
		var convenienceCommands = modelComponent.getConvenienceCommands();
		var cmd = selectedItem.getCustomObject();
		if (cmd === oFF.SxModelTree.CMD_MOVE_TO_ROW)
		{
			convenienceCommands.moveDimensionToRows(name);
		}
		else if (cmd === oFF.SxModelTree.CMD_MOVE_TO_COL)
		{
			convenienceCommands.moveDimensionToColumns(name);
		}
		else if (cmd === oFF.SxModelTree.CMD_MOVE_TO_FREE)
		{
			convenienceCommands.moveDimensionToFree(name);
		}
		else if (cmd === oFF.SxModelTree.CMD_SHOW_KEY)
		{
			convenienceCommands.showKey(name);
		}
		else if (cmd === oFF.SxModelTree.CMD_SHOW_TEXT)
		{
			convenienceCommands.showText(name);
		}
		else if (cmd === oFF.SxModelTree.CMD_SHOW_KEY_TEXT)
		{
			convenienceCommands.showKeyAndText(name);
		}
		else if (cmd === oFF.SxModelTree.CMD_SHOW_TEXT_KEY)
		{
			convenienceCommands.showTextAndKey(name);
		}
		else if (cmd === oFF.SxModelTree.CMD_ALIGN_TOTALS_ON_BOTTOM)
		{
			convenienceCommands.alignTotalsOnBottom(modelComponent);
		}
		else if (cmd === oFF.SxModelTree.CMD_ALIGN_TOTALS_ON_TOP)
		{
			convenienceCommands.alignTotalsOnTop(modelComponent);
		}
		else if (cmd === oFF.SxModelTree.CMD_ALIGN_TOTALS_ON_TOP_AND_BOTTOM)
		{
			convenienceCommands.alignTotalsOnTopAndBottom(modelComponent);
		}
		else if (cmd === oFF.SxModelTree.CMD_ALIGN_TOTALS_ON_BOTTOM)
		{
			convenienceCommands.alignTotalsOnDefault(modelComponent);
		}
		else if (cmd === oFF.SxModelTree.CMD_DISPLAY_TOTALS_ENABLE)
		{
			modelComponent.setResultVisibility(oFF.ResultVisibility.VISIBLE);
		}
		else if (cmd === oFF.SxModelTree.CMD_DISPLAY_TOTALS_DISABLE)
		{
			modelComponent.setResultVisibility(oFF.ResultVisibility.HIDDEN);
		}
		else if (cmd === oFF.SxModelTree.CMD_DISPLAY_TOTALS_CONDITIONAL)
		{
			modelComponent.setResultVisibility(oFF.ResultVisibility.CONDITIONAL);
		}
		else if (cmd === oFF.SxModelTree.CMD_DISPLAY_TOTALS_DEFAULT)
		{
			modelComponent.restoreTotalsVisibility(oFF.RestoreAction.DEFAULT_VALUE, false);
		}
		else if (cmd === oFF.SxModelTree.CMD_SORT_BY_KEY_ASC)
		{
			convenienceCommands.sortByKey(name, oFF.XSortDirection.ASCENDING);
		}
		else if (cmd === oFF.SxModelTree.CMD_SORT_BY_KEY_DESC)
		{
			convenienceCommands.sortByKey(name, oFF.XSortDirection.DESCENDING);
		}
		else if (cmd === oFF.SxModelTree.CMD_SORT_BY_TEXT_ASC)
		{
			convenienceCommands.sortByText(name, oFF.XSortDirection.ASCENDING);
		}
		else if (cmd === oFF.SxModelTree.CMD_SORT_BY_KEY_ASC)
		{
			convenienceCommands.sortByText(name, oFF.XSortDirection.DESCENDING);
		}
		else if (cmd === oFF.SxModelTree.CMD_SORT_BY_HIERARCHY)
		{
			convenienceCommands.sortByHierarchy(name, oFF.XSortDirection.ASCENDING);
		}
		else if (cmd === oFF.SxModelTree.CMD_SORT_BY_DEFAULT)
		{
			convenienceCommands.clearDimensionSort(name);
		}
		else if (cmd === oFF.SxModelTree.CMD_ADD_ATTRIBUTE_TO_RS)
		{
			var attribute = modelComponent;
			var dimension = attribute.getDimension();
			convenienceCommands.addAttributeToResultSet(dimension.getName(), attribute.getName());
		}
		else if (cmd === oFF.SxModelTree.CMD_REMOVE_ATTRIBUTE_FROM_RS)
		{
			var attribute2 = modelComponent;
			var dimension2 = attribute2.getDimension();
			convenienceCommands.removeAttributeFromResultSet(dimension2.getName(), attribute2.getName());
		}
	}
	else if (uiType === oFF.UiType.TREE_ITEM)
	{
		var modelComponent2 = selectedItem.getCustomObject();
		if (oFF.notNull(modelComponent2))
		{
			var output = modelComponent2.serializeToString(oFF.QModelFormat.INA_REPOSITORY);
			this.m_textArea.setText(output);
		}
	}
};

oFF.SxValueHelpDialogDimMember = function() {};
oFF.SxValueHelpDialogDimMember.prototype = new oFF.XObject();
oFF.SxValueHelpDialogDimMember.prototype._ff_c = "SxValueHelpDialogDimMember";

oFF.SxValueHelpDialogDimMember.STRATEGY_WINDOWING = 0;
oFF.SxValueHelpDialogDimMember.STRATEGY_SPLITTER = 1;
oFF.SxValueHelpDialogDimMember.STRATEGY = 0;
oFF.SxValueHelpDialogDimMember.open = function(root, valueHelp, callback, customIdentifier, mode)
{
	var newObj = new oFF.SxValueHelpDialogDimMember();
	newObj.setupDialog(root, valueHelp, callback, customIdentifier, mode);
	return newObj;
};
oFF.SxValueHelpDialogDimMember.prototype.m_root = null;
oFF.SxValueHelpDialogDimMember.prototype.m_dialog = null;
oFF.SxValueHelpDialogDimMember.prototype.m_ok = null;
oFF.SxValueHelpDialogDimMember.prototype.m_cancel = null;
oFF.SxValueHelpDialogDimMember.prototype.m_callback = null;
oFF.SxValueHelpDialogDimMember.prototype.m_splitter = null;
oFF.SxValueHelpDialogDimMember.prototype.m_tree = null;
oFF.SxValueHelpDialogDimMember.prototype.m_listBox = null;
oFF.SxValueHelpDialogDimMember.prototype.m_customIdentifier = null;
oFF.SxValueHelpDialogDimMember.prototype.m_fetchingNode = null;
oFF.SxValueHelpDialogDimMember.prototype.setupDialog = function(root, valueHelp, callback, customIdentifier, mode)
{
	this.m_root = root;
	this.m_callback = callback;
	this.m_customIdentifier = customIdentifier;
	this.m_dialog = this.m_root.newControl(oFF.UiType.DIALOG);
	this.m_dialog.setTitle("Dimension Member Value Help");
	this.m_dialog.setWidth(oFF.UiCssLength.createExt(200, oFF.UiCssSizeUnit.EM)).setHeight(oFF.UiCssLength.createExt(200, oFF.UiCssSizeUnit.EM));
	this.m_ok = this.m_dialog.addNewItem().setText("Ok").registerOnSelect(this);
	this.m_cancel = this.m_dialog.addNewItem().setText("Cancel").registerOnSelect(this);
	valueHelp.getValueHelpDimension();
	this.m_splitter = this.m_dialog.setNewContent(oFF.UiType.VERTICAL_SPLITTER).setSplitterPosition(50);
	this.m_tree = this.m_splitter.addNewItemOfType(oFF.UiType.TREE);
	this.m_tree.registerOnExpand(this);
	this.m_tree.registerOnCollapse(this);
	this.m_tree.registerOnSelect(this);
	this.m_listBox = this.m_splitter.addNewItemOfType(oFF.UiType.LIST);
	this.m_listBox.registerOnDoubleClick(this);
	var rootNode = valueHelp.getRootNode();
	this.addNodes(this.m_tree, rootNode, true);
	this.m_dialog.setVisible(true);
};
oFF.SxValueHelpDialogDimMember.prototype.releaseObject = function()
{
	if (oFF.notNull(this.m_dialog))
	{
		oFF.XObjectExt.release(this.m_dialog);
		this.m_dialog = null;
	}
	this.m_root = null;
	this.m_ok = null;
	this.m_cancel = null;
	this.m_callback = null;
	this.m_listBox = null;
	this.m_customIdentifier = null;
	oFF.XObject.prototype.releaseObject.call( this );
};
oFF.SxValueHelpDialogDimMember.prototype.onSelect = function(event)
{
	var control = event.getControl();
	if (control === this.m_ok || control === this.m_cancel)
	{
		this.shutdownDialog(null, control === this.m_ok);
	}
	else if (control === this.m_tree)
	{
		var selectedItem = event.getSelectedItem();
		selectedItem.getCustomObject();
	}
};
oFF.SxValueHelpDialogDimMember.prototype.onDoubleClick = function(event)
{
	var control = event.getControl();
	if (control === this.m_tree)
	{
		return;
	}
	var selectedItem = event.getControl();
	var abstractNode = selectedItem.getCustomObject();
	if (oFF.notNull(abstractNode))
	{
		var componentType = abstractNode.getComponentType();
		if (componentType.isTypeOf(oFF.SxValueHelpElement.CP_VALUE_HELP))
		{
			if (abstractNode === oFF.SxValueHelpElement.FETCH_MORE)
			{
				selectedItem.setCustomObject(oFF.SxValueHelpElement.FETCHING).setText(oFF.SxValueHelpElement.FETCHING.getText());
				var uiParent = selectedItem.getParent();
				var node = uiParent.getCustomObject();
				node.processValueHelpFetch(oFF.SyncType.NON_BLOCKING, this, uiParent);
			}
		}
		else
		{
			var node2 = abstractNode;
			var dimensionMember = node2.getDimensionMember();
			if (oFF.notNull(dimensionMember))
			{
				this.shutdownDialog(node2, true);
			}
		}
	}
};
oFF.SxValueHelpDialogDimMember.prototype.shutdownDialog = function(selectedNode, takeItem)
{
	this.m_dialog.setVisible(false);
	if (oFF.notNull(this.m_callback))
	{
		var mySelectedNode = selectedNode;
		if (oFF.isNull(mySelectedNode) && takeItem)
		{
			var selectedItem = this.m_listBox.getSelectedItem();
			if (oFF.notNull(selectedItem))
			{
				mySelectedNode = selectedItem.getCustomObject();
			}
			else
			{
				selectedItem = this.m_tree.getSelectedItem();
				if (oFF.notNull(selectedItem))
				{
					mySelectedNode = selectedItem.getCustomObject();
				}
			}
		}
		this.m_callback.onValueHelpDialogClose(mySelectedNode, this.m_customIdentifier);
	}
	oFF.XObjectExt.release(this);
};
oFF.SxValueHelpDialogDimMember.prototype.onCollapse = function(event)
{
	var collapsedItem = event.getAffectedItem();
	var node = collapsedItem.getCustomObject();
	if (node === this.m_fetchingNode)
	{
		this.m_fetchingNode = null;
	}
};
oFF.SxValueHelpDialogDimMember.prototype.onExpand = function(event)
{
	var expandedItem = event.getAffectedItem();
	var node = expandedItem.getCustomObject();
	this.m_fetchingNode = node;
	var childSetState = node.getChildSetState();
	if (childSetState === oFF.ChildSetState.INITIAL)
	{
		expandedItem.addNewItem().setCustomObject(oFF.SxValueHelpElement.FETCHING).setText(oFF.SxValueHelpElement.FETCHING.getText());
		node.processValueHelpFetch(oFF.SyncType.NON_BLOCKING, this, expandedItem);
	}
};
oFF.SxValueHelpDialogDimMember.prototype.onValueHelpFetched = function(extResult, node, fetchedChildren, customIdentifier)
{
	var uiSelectedNode = customIdentifier;
	var size = uiSelectedNode.size();
	if (size > 0)
	{
		var fetchingChild = uiSelectedNode.get(size - 1);
		var component = fetchingChild.getCustomObject();
		if (component === oFF.SxValueHelpElement.FETCHING)
		{
			uiSelectedNode.removeAt(size - 1);
		}
	}
	var currentValueHelpNode = uiSelectedNode.getCustomObject();
	this.addNodes(uiSelectedNode, currentValueHelpNode, false);
	while (true)
	{
		currentValueHelpNode = currentValueHelpNode.getParentValueHelpNode();
		if (oFF.isNull(currentValueHelpNode))
		{
			break;
		}
		uiSelectedNode = uiSelectedNode.getParent();
		this.addNodes(uiSelectedNode, currentValueHelpNode, false);
	}
};
oFF.SxValueHelpDialogDimMember.prototype.addNodes = function(uiParentNode, node, addCurrentNode)
{
	var uiNode = null;
	var text = node.getName();
	if (addCurrentNode)
	{
		uiNode = uiParentNode.addNewItem();
		if (node.getMemberType() === oFF.MemberType.VALUE_HELP_ROOT_NODE)
		{
			text = "Root";
		}
		uiNode.setCustomObject(node);
	}
	else
	{
		uiNode = uiParentNode;
	}
	uiNode.setText(text);
	if (node.isNode())
	{
		var childSetState = node.getChildSetState();
		if (childSetState === oFF.ChildSetState.INITIAL)
		{
			uiNode.setNode(true);
			uiNode.setExpanded(false);
		}
		else
		{
			var children = node.getChildren();
			if (oFF.notNull(children))
			{
				if (addCurrentNode)
				{
					uiNode.setNode(true);
					uiNode.setExpanded(false);
				}
				var startPoint = uiNode.size();
				for (var i = startPoint; i < children.size(); i++)
				{
					var element = children.get(i);
					this.addNodes(uiNode, element, true);
				}
				if (oFF.SxValueHelpDialogDimMember.STRATEGY === oFF.SxValueHelpDialogDimMember.STRATEGY_WINDOWING)
				{
					if (childSetState === oFF.ChildSetState.INCOMPLETE)
					{
						var uiIncomplete = uiNode.addNewItem();
						uiIncomplete.setText(oFF.SxValueHelpElement.FETCH_MORE.getText());
						uiIncomplete.setCustomObject(oFF.SxValueHelpElement.FETCH_MORE);
					}
				}
			}
			else
			{
				uiNode.setNode(false);
			}
		}
	}
	else
	{
		uiNode.setNode(false);
	}
	return uiNode;
};

oFF.SxVarAny = function() {};
oFF.SxVarAny.prototype = new oFF.SxVarGeneric();
oFF.SxVarAny.prototype._ff_c = "SxVarAny";

oFF.SxVarAny.create = function(varScreen, textVariable, index, matrixLayout)
{
	var newObj = new oFF.SxVarAny();
	newObj.setupGenericVariable(varScreen, textVariable, index, matrixLayout);
	return newObj;
};
oFF.SxVarAny.prototype.renderLine = function(line, row)
{
	this.renderLineStart(true, row);
	return this;
};
oFF.SxVarAny.prototype.disableComponent = function() {};
oFF.SxVarAny.prototype.enableComponent = function() {};
oFF.SxVarAny.prototype.fetchComponentValueFromInput = function() {};
oFF.SxVarAny.prototype.clearComponentValueHelp = function() {};
oFF.SxVarAny.prototype.fillComponentValueHelp = function() {};
oFF.SxVarAny.prototype.getRow = function()
{
	return this.m_initialRow;
};

oFF.SxVarDimMember = function() {};
oFF.SxVarDimMember.prototype = new oFF.SxVarGeneric();
oFF.SxVarDimMember.prototype._ff_c = "SxVarDimMember";

oFF.SxVarDimMember.create = function(varScreen, dimMemberVariable, index, matrixLayout)
{
	var newObj = new oFF.SxVarDimMember();
	newObj.setupGenericVariable(varScreen, dimMemberVariable, index, matrixLayout);
	return newObj;
};
oFF.SxVarDimMember.prototype.m_members = null;
oFF.SxVarDimMember.prototype.m_valueHelp = null;
oFF.SxVarDimMember.prototype.size = function()
{
	var size = this.m_variable.getMemberFilter().size();
	if (size === 0)
	{
		return 1;
	}
	return size;
};
oFF.SxVarDimMember.prototype.renderLine = function(line, row)
{
	this.renderLineStart(line === 0, row);
	var memberSelection = this.m_variable.getMemberFilter();
	var size = memberSelection.size();
	var varLine;
	if (size === 0)
	{
		varLine = oFF.SxVarDimMemberLine.create(this, row, null, this.m_variable);
	}
	else
	{
		var filterElement = memberSelection.get(line);
		varLine = oFF.SxVarDimMemberLine.create(this, row, filterElement, this.m_variable);
	}
	return varLine;
};
oFF.SxVarDimMember.prototype.fetchValues = function()
{
	var memberSelection = this.m_variable.getMemberFilter();
	memberSelection.clear();
	oFF.SxVarGeneric.prototype.fetchValues.call( this );
};
oFF.SxVarDimMember.prototype.maintainValueHelp = function()
{
	this.m_valueHelp = this.m_variable.newValueHelpMembers();
	if (oFF.notNull(this.m_valueHelp))
	{
		var rootNode = this.m_valueHelp.getRootNode();
		rootNode.processValueHelpFetch(oFF.SyncType.NON_BLOCKING, this, null);
	}
};
oFF.SxVarDimMember.prototype.getValueHelp = function()
{
	return this.m_valueHelp;
};
oFF.SxVarDimMember.prototype.onValueHelpFetched = function(extResult, node, fetchedChildren, customIdentifier)
{
	this.m_members = oFF.XList.create();
	if (oFF.notNull(fetchedChildren))
	{
		for (var i = 0; i < fetchedChildren.size(); i++)
		{
			var member = fetchedChildren.get(i);
			this.m_members.add(member);
		}
	}
	this.fillValueHelp();
};
oFF.SxVarDimMember.prototype.getMembers = function()
{
	return this.m_members;
};
oFF.SxVarDimMember.prototype.newLine = function(row)
{
	return oFF.SxVarDimMemberLine.create(this, row, null, this.m_variable);
};
oFF.SxVarDimMember.prototype.notifyChangedLine = function(line)
{
	this.m_varScreen.notifyVariableChanged(this);
};

oFF.SxVarDimMemberLine = function() {};
oFF.SxVarDimMemberLine.prototype = new oFF.XObject();
oFF.SxVarDimMemberLine.prototype._ff_c = "SxVarDimMemberLine";

oFF.SxVarDimMemberLine.create = function(uiVariable, row, filterElement, dimMemberVariable)
{
	var newObj = new oFF.SxVarDimMemberLine();
	newObj.setupLine(uiVariable, row, filterElement, dimMemberVariable);
	return newObj;
};
oFF.SxVarDimMemberLine.prototype.m_varScreen = null;
oFF.SxVarDimMemberLine.prototype.m_uiVariable = null;
oFF.SxVarDimMemberLine.prototype.m_dimMemberVariable = null;
oFF.SxVarDimMemberLine.prototype.m_setSign = null;
oFF.SxVarDimMemberLine.prototype.m_comparison = null;
oFF.SxVarDimMemberLine.prototype.m_inputLow = null;
oFF.SxVarDimMemberLine.prototype.m_inputLowButton = null;
oFF.SxVarDimMemberLine.prototype.m_inputHigh = null;
oFF.SxVarDimMemberLine.prototype.m_inputHighButton = null;
oFF.SxVarDimMemberLine.prototype.m_plusButton = null;
oFF.SxVarDimMemberLine.prototype.m_minusButton = null;
oFF.SxVarDimMemberLine.prototype.m_row = null;
oFF.SxVarDimMemberLine.prototype.setupLine = function(uiVariable, row, filterElement, dimMemberVariable)
{
	this.m_row = row;
	this.m_uiVariable = uiVariable;
	this.m_varScreen = uiVariable.getVarScreen();
	this.m_dimMemberVariable = dimMemberVariable;
	var selectionCapabilities = this.m_dimMemberVariable.getFilterCapabilities();
	var selectionCapabilitiesForKey = selectionCapabilities.getFilterCapabilitiesByField(this.m_dimMemberVariable.getDimension().getKeyField());
	var supportedComparisonOperators = null;
	var supportedSetSign = null;
	if (oFF.notNull(selectionCapabilitiesForKey))
	{
		supportedComparisonOperators = selectionCapabilitiesForKey.getSupportedComparisonOperators(oFF.SetSign.INCLUDING);
		supportedSetSign = selectionCapabilitiesForKey.getSupportedSetSign();
	}
	var cellSetSign = this.m_row.addNewMatrixLayoutCell();
	if (oFF.notNull(supportedSetSign))
	{
		this.m_setSign = cellSetSign.setNewContent(oFF.UiType.DROPDOWN);
		this.m_setSign.setWidth(oFF.UiCssLength.createExt(10, oFF.UiCssSizeUnit.EM));
		var activeSetSign = null;
		if (oFF.notNull(filterElement))
		{
			activeSetSign = filterElement.getSetSign();
		}
		else if (supportedSetSign.contains(oFF.SetSign.INCLUDING))
		{
			activeSetSign = oFF.SetSign.INCLUDING;
		}
		else
		{
			activeSetSign = supportedSetSign.get(0);
		}
		for (var k = 0; k < supportedSetSign.size(); k++)
		{
			var currentSetSign = supportedSetSign.get(k);
			var item = this.m_setSign.addNewItem();
			item.setName(currentSetSign.getName());
			item.setText(currentSetSign.getName());
			item.setCustomObject(currentSetSign);
			if (currentSetSign === activeSetSign)
			{
				this.m_setSign.setSelectedItem(item);
			}
		}
	}
	var cellComparison = this.m_row.addNewMatrixLayoutCell();
	if (oFF.notNull(supportedComparisonOperators) && supportedComparisonOperators.size() > 0)
	{
		this.m_comparison = cellComparison.setNewContent(oFF.UiType.DROPDOWN);
		this.m_comparison.setWidth(oFF.UiCssLength.createExt(10, oFF.UiCssSizeUnit.EM));
		this.m_comparison.registerOnSelect(this);
		var currentComparisonOperator = null;
		if (oFF.notNull(filterElement))
		{
			currentComparisonOperator = filterElement.getComparisonOperator();
		}
		if (oFF.isNull(currentComparisonOperator))
		{
			if (supportedComparisonOperators.contains(oFF.ComparisonOperator.EQUAL))
			{
				currentComparisonOperator = oFF.ComparisonOperator.EQUAL;
			}
			else if (supportedComparisonOperators.contains(oFF.ComparisonOperator.BETWEEN))
			{
				currentComparisonOperator = oFF.ComparisonOperator.BETWEEN;
			}
			else
			{
				currentComparisonOperator = supportedComparisonOperators.get(0);
			}
		}
		for (var i = 0; i < supportedComparisonOperators.size(); i++)
		{
			var comparisonOperator = supportedComparisonOperators.get(i);
			var item2 = this.m_comparison.addNewItem();
			item2.setName(comparisonOperator.getName());
			item2.setText(comparisonOperator.getDisplayString());
			item2.setCustomObject(comparisonOperator);
			if (comparisonOperator === currentComparisonOperator)
			{
				this.m_comparison.setSelectedItem(item2);
			}
		}
	}
	var cellLow = this.m_row.addNewMatrixLayoutCell();
	var binder = cellLow.setNewContent(oFF.UiType.FLEX_LAYOUT);
	binder.setDirection(oFF.UiFlexDirection.ROW);
	binder.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	binder.setWrap(oFF.UiFlexWrap.NO_WRAP);
	this.m_inputLow = binder.addNewItemOfType(oFF.UiType.COMBO_BOX).registerOnSelect(this);
	this.m_inputLow.setWidth(oFF.UiCssLength.createExt(10, oFF.UiCssSizeUnit.EM));
	var fetchingLow = this.m_inputLow.addNewItem().setCustomObject(oFF.SxValueHelpElement.FETCHING).setText(oFF.SxValueHelpElement.FETCHING.getText());
	if (oFF.notNull(filterElement))
	{
		var low = filterElement.getLow();
		var value = low.getValue();
		if (oFF.notNull(value))
		{
			var stringRepresentation = value.getStringRepresentation();
			this.m_inputLow.setText(stringRepresentation);
			var member = low.getDimensionMember();
			this.m_inputLow.setCustomObject(member);
		}
	}
	if (this.m_inputLow.getCustomObject() === null)
	{
		this.m_inputLow.setSelectedItem(fetchingLow);
	}
	this.m_inputLowButton = binder.addNewItemOfType(oFF.UiType.BUTTON).setText("#").registerOnSelect(this);
	var cellHigh = this.m_row.addNewMatrixLayoutCell();
	if (oFF.notNull(supportedComparisonOperators) && supportedComparisonOperators.contains(oFF.ComparisonOperator.BETWEEN))
	{
		var binder2 = cellHigh.setNewContent(oFF.UiType.FLEX_LAYOUT);
		binder2.setDirection(oFF.UiFlexDirection.ROW);
		binder2.setAlignItems(oFF.UiFlexAlignItems.CENTER);
		binder2.setWrap(oFF.UiFlexWrap.NO_WRAP);
		this.m_inputHigh = binder2.addNewItemOfType(oFF.UiType.COMBO_BOX).registerOnSelect(this);
		this.m_inputHigh.setWidth(oFF.UiCssLength.createExt(10, oFF.UiCssSizeUnit.EM));
		var fetchingHigh = this.m_inputHigh.addNewItem().setCustomObject(oFF.SxValueHelpElement.FETCHING).setText(oFF.SxValueHelpElement.FETCHING.getText());
		if (oFF.notNull(filterElement))
		{
			var high = filterElement.getHigh();
			var highValue = high.getValue();
			if (oFF.notNull(highValue))
			{
				var highStringRepresentation = highValue.getStringRepresentation();
				this.m_inputHigh.setText(highStringRepresentation);
				var highMember = high.getDimensionMember();
				this.m_inputHigh.setCustomObject(highMember);
			}
		}
		if (this.m_inputHigh.getCustomObject() === null)
		{
			this.m_inputHigh.setSelectedItem(fetchingHigh);
		}
		this.m_inputHighButton = binder2.addNewItemOfType(oFF.UiType.BUTTON).setText("#").registerOnSelect(this);
	}
	if (selectionCapabilities.supportsMultipleValues())
	{
		this.m_plusButton = this.m_row.addNewMatrixLayoutCell().setNewContent(oFF.UiType.BUTTON).setText("+").registerOnSelect(this);
		this.m_minusButton = this.m_row.addNewMatrixLayoutCell().setNewContent(oFF.UiType.BUTTON).setText("-").registerOnSelect(this);
	}
	this.checkHighOperatorVisible();
};
oFF.SxVarDimMemberLine.prototype.fetchComponentValueFromInput = function()
{
	var comparison = null;
	if (oFF.notNull(this.m_comparison))
	{
		var selectedItem = this.m_comparison.getSelectedItem();
		if (oFF.notNull(selectedItem))
		{
			comparison = selectedItem.getCustomObject();
		}
	}
	var setSign = null;
	if (oFF.notNull(this.m_setSign))
	{
		var selectedItem2 = this.m_setSign.getSelectedItem();
		if (oFF.notNull(selectedItem2))
		{
			setSign = selectedItem2.getCustomObject();
		}
	}
	var memberLow = null;
	var memberHigh = null;
	var component = this.m_inputLow.getCustomObject();
	if (component !== oFF.SxValueHelpElement.CLEAR)
	{
		memberLow = component;
	}
	if (oFF.notNull(this.m_inputHigh))
	{
		component = this.m_inputHigh.getCustomObject();
		if (component !== oFF.SxValueHelpElement.CLEAR)
		{
			memberHigh = component;
		}
	}
	this.setVariableValue(comparison, setSign, memberLow, memberHigh);
};
oFF.SxVarDimMemberLine.prototype.setVariableValue = function(comparison, signSet, memberLow, memberHigh)
{
	var dimension = this.m_dimMemberVariable.getDimension();
	var selectionCapabilities = this.m_dimMemberVariable.getFilterCapabilities();
	var memberSelection = this.m_dimMemberVariable.getMemberFilter();
	selectionCapabilities.getFilterCapabilitiesByField(this.m_dimMemberVariable.getDimension().getKeyField());
	if (oFF.notNull(memberLow))
	{
		var keyField = dimension.getKeyField();
		memberSelection.setField(keyField);
		var singleMemberSelection = memberSelection.addNewCartesianElement();
		if (oFF.notNull(signSet))
		{
			singleMemberSelection.setSetSign(signSet);
		}
		if (oFF.notNull(comparison))
		{
			singleMemberSelection.setComparisonOperator(comparison);
		}
		singleMemberSelection.getLow().setDimensionMember(memberLow);
		if (oFF.notNull(comparison) && comparison.getNumberOfParameters() > 1)
		{
			if (oFF.notNull(memberHigh))
			{
				singleMemberSelection.getHigh().setDimensionMember(memberHigh);
			}
		}
	}
	else
	{
		memberSelection.clear();
	}
};
oFF.SxVarDimMemberLine.prototype.onSelect = function(event)
{
	var control = event.getControl();
	if (control === this.m_comparison)
	{
		this.checkHighOperatorVisible();
	}
	else if (control === this.m_plusButton)
	{
		this.m_uiVariable.addNewLine(this);
	}
	else if (control === this.m_minusButton)
	{
		this.m_uiVariable.removeLine(this);
	}
	else if (control === this.m_inputLowButton)
	{
		this.openValueHelpDialog(this.m_inputLow);
	}
	else if (control === this.m_inputHighButton)
	{
		this.openValueHelpDialog(this.m_inputHigh);
	}
	else if (control === this.m_inputLow || control === this.m_inputHigh)
	{
		var item = event.getSelectedItem();
		var valueHelpNode = null;
		if (oFF.notNull(item))
		{
			var component = item.getCustomObject();
			if (component === oFF.SxValueHelpElement.CLEAR)
			{
				control.setCustomObject(component);
			}
			else
			{
				valueHelpNode = component;
				var member = valueHelpNode.getDimensionMember();
				control.setCustomObject(member);
			}
		}
		this.m_uiVariable.notifyChangedLine(this);
	}
};
oFF.SxVarDimMemberLine.prototype.openValueHelpDialog = function(input)
{
	var anchor = this.m_row.getUiManager().getAnchor();
	oFF.SxValueHelpDialogDimMember.open(anchor, this.m_uiVariable.getValueHelp(), this, input, oFF.SxValueHelpOpMode.SELECT_SINGLE_MEMBER);
};
oFF.SxVarDimMemberLine.prototype.onValueHelpDialogClose = function(valueHelpNode, customIdentifier)
{
	if (oFF.notNull(valueHelpNode))
	{
		var member = valueHelpNode.getDimensionMember();
		var text = this.getValueHelpLine(valueHelpNode);
		var input = customIdentifier;
		input.setText(text);
		input.setCustomObject(member);
		this.m_uiVariable.notifyChangedLine(this);
	}
};
oFF.SxVarDimMemberLine.prototype.disableComponent = function()
{
	this.setEnabled(false);
};
oFF.SxVarDimMemberLine.prototype.enableComponent = function()
{
	this.setEnabled(true);
};
oFF.SxVarDimMemberLine.prototype.setEnabled = function(enabled)
{
	if (oFF.notNull(this.m_setSign))
	{
		if (this.m_setSign.size() <= 1)
		{
			if (this.m_varScreen.isVerbose())
			{
				this.m_setSign.setEnabled(false);
			}
			else
			{
				this.m_setSign.setVisible(false);
			}
		}
		else
		{
			this.m_setSign.setEnabled(enabled);
		}
	}
	if (oFF.notNull(this.m_comparison))
	{
		if (this.m_comparison.size() <= 1)
		{
			if (this.m_varScreen.isVerbose())
			{
				this.m_comparison.setEnabled(false);
			}
			else
			{
				this.m_comparison.setVisible(false);
			}
		}
		else
		{
			this.m_comparison.setEnabled(enabled);
		}
	}
	this.m_inputLow.setEnabled(enabled);
	this.m_inputLowButton.setEnabled(enabled);
	if (oFF.notNull(this.m_inputHigh))
	{
		this.m_inputHigh.setEnabled(enabled);
		this.m_inputHighButton.setEnabled(enabled);
	}
	if (oFF.notNull(this.m_plusButton))
	{
		this.m_plusButton.setEnabled(enabled);
	}
	if (oFF.notNull(this.m_minusButton))
	{
		this.m_minusButton.setEnabled(enabled);
	}
};
oFF.SxVarDimMemberLine.prototype.clearComponentValueHelp = function()
{
	this.m_inputLow.clear();
	if (oFF.notNull(this.m_inputHigh))
	{
		this.m_inputHigh.clearChildItems();
	}
};
oFF.SxVarDimMemberLine.prototype.fillComponentValueHelp = function()
{
	this.m_inputLow.clear();
	this.addValueHelpItem(oFF.SxValueHelpElement.CLEAR.getText(), oFF.SxValueHelpElement.CLEAR, true);
	var members = this.m_uiVariable.getMembers();
	if (oFF.notNull(members))
	{
		for (var i = 0; i < members.size() && i < 1000; i++)
		{
			var member = members.get(i);
			var text = this.getValueHelpLine(member);
			if (oFF.notNull(text))
			{
				this.addValueHelpItem(text, member, false);
			}
		}
		var childSetState = this.m_uiVariable.getValueHelp().getRootNode().getChildSetState();
		if (members.size() >= 1000 || childSetState === oFF.ChildSetState.INCOMPLETE)
		{
			this.addValueHelpItem(oFF.SxValueHelpElement.MORE.getText(), oFF.SxValueHelpElement.MORE, false);
		}
	}
};
oFF.SxVarDimMemberLine.prototype.getValueHelpLine = function(valueHelpNode)
{
	var dimensionMember = valueHelpNode.getDimensionMember();
	if (oFF.isNull(dimensionMember))
	{
		return valueHelpNode.getName();
	}
	var name = dimensionMember.getName();
	if (oFF.XStringUtils.isNotNullAndNotEmpty(name))
	{
		var buffer = oFF.XStringBuffer.create();
		buffer.append(dimensionMember.getText());
		buffer.append(" [").append(name).append("]");
		return buffer.toString();
	}
	return null;
};
oFF.SxVarDimMemberLine.prototype.addValueHelpItem = function(text, member, setAsDefault)
{
	var itemLow = this.m_inputLow.addNewItem();
	itemLow.setText(text);
	itemLow.setCustomObject(member);
	var selectedLowMember = this.m_inputLow.getCustomObject();
	if (selectedLowMember === member)
	{
		this.m_inputLow.setSelectedItem(itemLow);
	}
	else if (oFF.isNull(selectedLowMember) && setAsDefault)
	{
		this.m_inputLow.setSelectedItem(itemLow);
	}
	if (oFF.notNull(this.m_inputHigh))
	{
		var itemHigh = this.m_inputHigh.addNewItem();
		itemHigh.setText(text);
		itemHigh.setCustomObject(member);
		var selectedHighMember = this.m_inputHigh.getCustomObject();
		if (selectedHighMember === member)
		{
			this.m_inputHigh.setSelectedItem(itemHigh);
		}
		else if (oFF.isNull(selectedHighMember) && setAsDefault)
		{
			this.m_inputHigh.setSelectedItem(itemHigh);
		}
	}
};
oFF.SxVarDimMemberLine.prototype.getRow = function()
{
	return this.m_row;
};
oFF.SxVarDimMemberLine.prototype.checkHighOperatorVisible = function()
{
	if (oFF.notNull(this.m_comparison) && oFF.notNull(this.m_inputHigh))
	{
		var currentComparisonOperator = this.m_comparison.getSelectedItem().getCustomObject();
		var visible = currentComparisonOperator.getNumberOfParameters() >= 2;
		this.m_inputHigh.setVisible(visible);
		this.m_inputHighButton.setVisible(visible);
	}
};

oFF.SxVarScreen = function() {};
oFF.SxVarScreen.prototype = new oFF.XObject();
oFF.SxVarScreen.prototype._ff_c = "SxVarScreen";

oFF.SxVarScreen.prototype.m_simplex = null;
oFF.SxVarScreen.prototype.m_variableManager = null;
oFF.SxVarScreen.prototype.m_isVerbose = false;
oFF.SxVarScreen.prototype.m_uiParent = null;
oFF.SxVarScreen.prototype.m_uiMessageField = null;
oFF.SxVarScreen.prototype.m_uiVarState = null;
oFF.SxVarScreen.prototype.m_uiVerboseCheckbox = null;
oFF.SxVarScreen.prototype.m_uiButtonVarReinit = null;
oFF.SxVarScreen.prototype.m_uiButtonVarTransfer = null;
oFF.SxVarScreen.prototype.m_uiButtonVarCheck = null;
oFF.SxVarScreen.prototype.m_uiButtonVarSubmit = null;
oFF.SxVarScreen.prototype.m_uiButtonVarCancel = null;
oFF.SxVarScreen.prototype.m_variableContainers = null;
oFF.SxVarScreen.prototype.buildTree = function(uiParent, simplex, variableManager)
{
	this.m_variableContainers = oFF.XList.create();
	this.m_simplex = simplex;
	this.m_variableManager = variableManager;
	this.m_uiParent = uiParent;
	this.m_isVerbose = false;
	var verticalLayout = this.m_uiParent.setNewContent(oFF.UiType.VERTICAL_LAYOUT);
	var matrixLayout = verticalLayout.addNewItemOfType(oFF.UiType.MATRIX_LAYOUT);
	if (this.m_isVerbose)
	{
		var headerRow = matrixLayout.addNewMatrixLayoutRow();
		for (var i = 0; i < 11; i++)
		{
			var text = oFF.XStringUtils.concatenate2("#", oFF.XInteger.convertToString(i));
			headerRow.addNewMatrixLayoutCell().setNewContent(oFF.UiType.BUTTON).setText(text);
		}
		headerRow.getMatrixLayoutCell(0).setWidth(oFF.UiCssLength.createExt(5, oFF.UiCssSizeUnit.EM));
		headerRow.getMatrixLayoutCell(1).setWidth(oFF.UiCssLength.createExt(5, oFF.UiCssSizeUnit.EM));
		headerRow.getMatrixLayoutCell(2).setWidth(oFF.UiCssLength.createExt(5, oFF.UiCssSizeUnit.EM));
		headerRow.getMatrixLayoutCell(3).setWidth(oFF.UiCssLength.createExt(15, oFF.UiCssSizeUnit.EM));
		headerRow.getMatrixLayoutCell(4).setWidth(oFF.UiCssLength.createExt(30, oFF.UiCssSizeUnit.EM));
		headerRow.getMatrixLayoutCell(5).setWidth(oFF.UiCssLength.createExt(20, oFF.UiCssSizeUnit.EM));
		headerRow.getMatrixLayoutCell(6).setWidth(oFF.UiCssLength.createExt(20, oFF.UiCssSizeUnit.EM));
		headerRow.getMatrixLayoutCell(7).setWidth(oFF.UiCssLength.createExt(20, oFF.UiCssSizeUnit.EM));
		headerRow.getMatrixLayoutCell(8).setWidth(oFF.UiCssLength.createExt(20, oFF.UiCssSizeUnit.EM));
		headerRow.getMatrixLayoutCell(9).setWidth(oFF.UiCssLength.createExt(5, oFF.UiCssSizeUnit.EM));
		headerRow.getMatrixLayoutCell(10).setWidth(oFF.UiCssLength.createExt(5, oFF.UiCssSizeUnit.EM));
	}
	var variables = this.getSortedVariableList();
	for (var j = 0; j < variables.size(); j++)
	{
		var variable = variables.get(j);
		var variableType = variable.getVariableType();
		var variableContainer = null;
		if (variableType.isTypeOf(oFF.VariableType.DIMENSION_MEMBER_VARIABLE))
		{
			variableContainer = oFF.SxVarDimMember.create(this, variable, j, matrixLayout);
		}
		else if (variableType.isTypeOf(oFF.VariableType.SIMPLE_TYPE_VARIABLE))
		{
			var simpleTypeVar = variable;
			if (simpleTypeVar.supportsMultipleValues())
			{
				variableContainer = oFF.SxVarSimpleTypeMulti.create(this, simpleTypeVar, j, matrixLayout);
			}
			else
			{
				variableContainer = oFF.SxVarSimpleTypeSingle.create(this, simpleTypeVar, j, matrixLayout);
			}
		}
		else
		{
			variableContainer = oFF.SxVarAny.create(this, variable, j, matrixLayout);
		}
		if (oFF.notNull(variableContainer))
		{
			this.m_variableContainers.add(variableContainer);
		}
	}
	this.assembleDependencies();
	this.render();
	var bottomFlowLayout = verticalLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	bottomFlowLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	bottomFlowLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	this.m_uiMessageField = bottomFlowLayout.addNewItemOfType(oFF.UiType.TEXT_AREA).useMaxWidth();
	var buttonFlowLayout = bottomFlowLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	buttonFlowLayout.setDirection(oFF.UiFlexDirection.ROW);
	buttonFlowLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	buttonFlowLayout.setWrap(oFF.UiFlexWrap.NO_WRAP);
	var variableProcessor = this.m_variableManager.getVariableProcessor();
	variableProcessor.getVariableProcessorState();
	if (variableProcessor.supportsReInitVariables())
	{
		this.m_uiButtonVarReinit = buttonFlowLayout.addNewItemOfType(oFF.UiType.BUTTON).setText("Reinit").registerOnSelect(this);
	}
	this.m_uiButtonVarTransfer = buttonFlowLayout.addNewItemOfType(oFF.UiType.BUTTON).setText("Refresh ValueHelp").registerOnSelect(this);
	if (variableProcessor.supportsCheckVariables())
	{
		this.m_uiButtonVarCheck = buttonFlowLayout.addNewItemOfType(oFF.UiType.BUTTON).setText("Check Variables").registerOnSelect(this);
	}
	this.m_uiButtonVarSubmit = buttonFlowLayout.addNewItemOfType(oFF.UiType.BUTTON).setText("Submit").registerOnSelect(this);
	this.m_uiButtonVarCancel = buttonFlowLayout.addNewItemOfType(oFF.UiType.BUTTON).setText("Cancel").registerOnSelect(this);
	this.m_uiVarState = buttonFlowLayout.addNewItemOfType(oFF.UiType.LABEL);
	this.m_uiVerboseCheckbox = buttonFlowLayout.addNewItemOfType(oFF.UiType.CHECKBOX);
	this.m_uiVerboseCheckbox.setText("Verbose").setSelected(this.m_isVerbose).registerOnSelect(this);
	variableProcessor.registerVariableProcessorStateChangedListener(this, null);
	this.updateStateText(null);
	this.updateValueHelp();
};
oFF.SxVarScreen.prototype.getSortedVariableList = function()
{
	var sortedList = oFF.XCollectionUtils.createListCopy(this.m_variableManager.getVariables());
	sortedList.sortByComparator(new oFF.SxVarComparator());
	var target2 = oFF.XList.create();
	for (var i = 0; i < sortedList.size(); )
	{
		var variable = sortedList.get(i);
		if (target2.contains(variable) === false)
		{
			target2.add(variable);
		}
		var affectedVariables = variable.getAffectedVariables();
		for (var k = 0; k < affectedVariables.size(); k++)
		{
			var affected = affectedVariables.get(k);
			var dependentVariables = affected.getDependentVariables();
			if (dependentVariables.size() === 1)
			{
				target2.add(affected);
			}
		}
		i++;
	}
	return target2;
};
oFF.SxVarScreen.prototype.assembleDependencies = function()
{
	for (var i = 0; i < this.m_variableContainers.size(); i++)
	{
		var uiVariable = this.m_variableContainers.get(i);
		var variable = uiVariable.getVariable();
		var dependentVariables = variable.getDependentVariables();
		if (dependentVariables.size() > 0)
		{
			for (var k = 0; k < dependentVariables.size(); k++)
			{
				var otherVariable = dependentVariables.get(k);
				for (var m = 0; m < this.m_variableContainers.size(); m++)
				{
					var cm = this.m_variableContainers.get(m);
					var cmv = cm.getVariable();
					if (cmv === otherVariable)
					{
						uiVariable.addDependency(cm);
						break;
					}
				}
			}
		}
	}
};
oFF.SxVarScreen.prototype.render = function()
{
	for (var i = 0; i < this.m_variableContainers.size(); i++)
	{
		var uiVariable = this.m_variableContainers.get(i);
		uiVariable.render();
	}
};
oFF.SxVarScreen.prototype.onVariableProcessorStateChanged = function(variableProcessor, customIdentifier)
{
	this.updateStateText(null);
};
oFF.SxVarScreen.prototype.updateStateText = function(additional)
{
	var variableProcessor = this.m_variableManager.getVariableProcessor();
	var state = variableProcessor.getVariableProcessorState();
	var text = oFF.XStringUtils.concatenate2("State: ", state.getName());
	if (oFF.notNull(additional))
	{
		text = oFF.XStringUtils.concatenate4(text, " (", additional, ")");
	}
	this.m_uiVarState.setText(text);
	if (oFF.notNull(this.m_uiButtonVarReinit))
	{
		this.m_uiButtonVarReinit.setEnabled(state === oFF.VariableProcessorState.SUBMITTED);
	}
	this.m_uiButtonVarTransfer.setEnabled(state.isTypeOf(oFF.VariableProcessorState.CHANGEABLE_STATEFUL));
	this.m_uiButtonVarCancel.setEnabled(state === oFF.VariableProcessorState.CHANGEABLE_REINIT);
	if (oFF.notNull(this.m_uiButtonVarCheck))
	{
		this.m_uiButtonVarCheck.setEnabled(state.isTypeOf(oFF.VariableProcessorState.CHANGEABLE_STATEFUL));
	}
	this.m_uiButtonVarSubmit.setEnabled(state.isTypeOf(oFF.VariableProcessorState.CHANGEABLE));
	for (var i = 0; i < this.m_variableContainers.size(); i++)
	{
		var uiSxVariable = this.m_variableContainers.get(i);
		if (state === oFF.VariableProcessorState.CHANGEABLE_REINIT || state === oFF.VariableProcessorState.SUBMIT_FAILED)
		{
			uiSxVariable.revalidate();
			uiSxVariable.enable();
		}
		else if (state.isTypeOf(oFF.VariableProcessorState.CHANGEABLE))
		{
			uiSxVariable.enable();
		}
		else
		{
			uiSxVariable.disable();
		}
	}
};
oFF.SxVarScreen.prototype.onSelect = function(event)
{
	var selectedItem = event.getSelectedItem();
	var variableProcessor = this.m_variableManager.getVariableProcessor();
	this.updateValues();
	this.m_uiMessageField.setText("");
	if (selectedItem === this.m_uiButtonVarTransfer)
	{
		this.m_uiParent.setText("variables [transfer...]");
		variableProcessor.transferVariables(oFF.SyncType.NON_BLOCKING, this, oFF.XIntegerValue.create(1));
	}
	else if (selectedItem === this.m_uiButtonVarSubmit)
	{
		if (variableProcessor.getVariableProcessorState() !== oFF.VariableProcessorState.CHANGEABLE_DIRECT_VALUE_TRANSFER)
		{
			this.m_uiParent.setText("variables [submitting...]");
			variableProcessor.submitVariables(oFF.SyncType.NON_BLOCKING, this, oFF.XIntegerValue.create(2));
		}
	}
	else if (selectedItem === this.m_uiButtonVarReinit)
	{
		this.m_uiParent.setText("variables [reinit...]");
		variableProcessor.reInitVariablesAfterSubmit(oFF.SyncType.NON_BLOCKING, this, oFF.XIntegerValue.create(3));
	}
	else if (selectedItem === this.m_uiButtonVarCancel)
	{
		this.m_uiParent.setText("variables [cancelling...]");
		variableProcessor.cancelReInitVariables(oFF.SyncType.NON_BLOCKING, this, oFF.XIntegerValue.create(4));
	}
	else if (selectedItem === this.m_uiButtonVarCheck)
	{
		this.m_uiParent.setText("variables [checking...]");
		variableProcessor.checkVariables(oFF.SyncType.NON_BLOCKING, this, oFF.XIntegerValue.create(5));
	}
};
oFF.SxVarScreen.prototype.updateValueHelp = function()
{
	for (var i = 0; i < this.m_variableContainers.size(); i++)
	{
		this.m_variableContainers.get(i).maintainValueHelp();
	}
};
oFF.SxVarScreen.prototype.updateValues = function()
{
	var variableProcessor = this.m_variableManager.getVariableProcessor();
	var variableProcessorState = variableProcessor.getVariableProcessorState();
	this.m_variableManager.queueEventing();
	if (variableProcessorState.isTypeOf(oFF.VariableProcessorState.CHANGEABLE))
	{
		for (var i = 0; i < this.m_variableContainers.size(); i++)
		{
			this.m_variableContainers.get(i).fetchValues();
		}
	}
	this.m_variableManager.resumeEventing();
};
oFF.SxVarScreen.prototype.onVariableProcessorExecuted = function(extResult, result, customIdentifier)
{
	this.m_uiMessageField.setText(extResult.getSummary());
	var intValue = customIdentifier;
	if (extResult.hasErrors())
	{
		this.m_uiParent.setText("variables [error]");
		this.updateStateText("error");
	}
	else
	{
		if (intValue.getInteger() === 1)
		{
			this.m_uiParent.setText("variables [set]");
			this.updateValueHelp();
		}
		else if (intValue.getInteger() === 2)
		{
			this.m_uiParent.setText("variables [ok]");
			this.m_simplex.onVariableProcessorExecuted(extResult, result, customIdentifier);
		}
		else if (intValue.getInteger() === 3)
		{
			this.m_uiParent.setText("variables [reinit]");
			this.updateValueHelp();
		}
		else if (intValue.getInteger() === 4)
		{
			this.m_uiParent.setText("variables [cancelled]");
		}
		else if (intValue.getInteger() === 5)
		{
			this.m_uiParent.setText("variables [checked]");
		}
		else
		{
			this.m_uiParent.setText("variables [ok]");
			this.m_simplex.onVariableProcessorExecuted(extResult, result, customIdentifier);
		}
	}
};
oFF.SxVarScreen.prototype.notifyVariableChanged = function(changedVar)
{
	var variable = changedVar.getVariable();
	if (variable.getAffectedVariables().size() > 0)
	{
		this.transferValues();
	}
};
oFF.SxVarScreen.prototype.transferValues = function()
{
	this.updateValues();
	this.m_uiMessageField.setText("");
	var variableProcessor = this.m_variableManager.getVariableProcessor();
	this.m_uiParent.setText("variables [transfer...]");
	variableProcessor.transferVariables(oFF.SyncType.NON_BLOCKING, this, oFF.XIntegerValue.create(1));
};
oFF.SxVarScreen.prototype.setMessage = function(message)
{
	this.m_uiMessageField.setText(message);
};
oFF.SxVarScreen.prototype.isVerbose = function()
{
	return this.m_isVerbose;
};

oFF.SxVarSimpleTypeLine = function() {};
oFF.SxVarSimpleTypeLine.prototype = new oFF.XObject();
oFF.SxVarSimpleTypeLine.prototype._ff_c = "SxVarSimpleTypeLine";

oFF.SxVarSimpleTypeLine.create = function(uiVariable, row, value, simpleTypeVariable)
{
	var newObj = new oFF.SxVarSimpleTypeLine();
	newObj.setupLine(uiVariable, row, value, simpleTypeVariable);
	return newObj;
};
oFF.SxVarSimpleTypeLine.prototype.m_uiVariable = null;
oFF.SxVarSimpleTypeLine.prototype.m_simpleTypeVariable = null;
oFF.SxVarSimpleTypeLine.prototype.m_input = null;
oFF.SxVarSimpleTypeLine.prototype.m_valueAccess = null;
oFF.SxVarSimpleTypeLine.prototype.m_plusButton = null;
oFF.SxVarSimpleTypeLine.prototype.m_minusButton = null;
oFF.SxVarSimpleTypeLine.prototype.m_row = null;
oFF.SxVarSimpleTypeLine.prototype.setupLine = function(uiVariable, row, value, simpleTypeVariable)
{
	this.m_row = row;
	this.m_uiVariable = uiVariable;
	this.m_simpleTypeVariable = simpleTypeVariable;
	this.m_row.addNewMatrixLayoutCell();
	this.m_row.addNewMatrixLayoutCell();
	var cellLow = this.m_row.addNewMatrixLayoutCell();
	this.m_input = cellLow.setNewContent(oFF.UiType.INPUT);
	this.m_input.setWidth(oFF.UiCssLength.createExt(5, oFF.UiCssSizeUnit.EM));
	if (oFF.notNull(value))
	{
		this.m_valueAccess = oFF.XValueAccess.createWithType(this.m_simpleTypeVariable.getValueType());
		this.m_valueAccess.copyFrom(this.m_simpleTypeVariable, null);
		var stringRepresentation = this.m_valueAccess.getString();
		this.m_input.setText(stringRepresentation);
	}
	var buttonCell = this.m_row.addNewMatrixLayoutCell();
	var flowLayout = buttonCell.setNewContent(oFF.UiType.FLEX_LAYOUT);
	flowLayout.setDirection(oFF.UiFlexDirection.ROW);
	flowLayout.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	flowLayout.setWrap(oFF.UiFlexWrap.NO_WRAP);
	this.m_plusButton = flowLayout.addNewItemOfType(oFF.UiType.BUTTON).setText("+").registerOnSelect(this);
	this.m_minusButton = flowLayout.addNewItemOfType(oFF.UiType.BUTTON).setText("-").registerOnSelect(this);
};
oFF.SxVarSimpleTypeLine.prototype.fetchComponentValueFromInput = function() {};
oFF.SxVarSimpleTypeLine.prototype.setVariableValue = function(comparison, valueLow, valueHigh) {};
oFF.SxVarSimpleTypeLine.prototype.onSelect = function(event)
{
	var control = event.getControl();
	if (control === this.m_plusButton)
	{
		this.m_uiVariable.addNewLine(this);
	}
	else if (control === this.m_minusButton)
	{
		this.m_uiVariable.removeLine(this);
	}
};
oFF.SxVarSimpleTypeLine.prototype.disableComponent = function()
{
	this.setEnabled(false);
};
oFF.SxVarSimpleTypeLine.prototype.enableComponent = function()
{
	this.setEnabled(true);
};
oFF.SxVarSimpleTypeLine.prototype.setEnabled = function(enabled) {};
oFF.SxVarSimpleTypeLine.prototype.clearComponentValueHelp = function() {};
oFF.SxVarSimpleTypeLine.prototype.fillComponentValueHelp = function() {};
oFF.SxVarSimpleTypeLine.prototype.getRow = function()
{
	return this.m_row;
};

oFF.SxVarSimpleTypeMulti = function() {};
oFF.SxVarSimpleTypeMulti.prototype = new oFF.SxVarGeneric();
oFF.SxVarSimpleTypeMulti.prototype._ff_c = "SxVarSimpleTypeMulti";

oFF.SxVarSimpleTypeMulti.create = function(varScreen, simpleTypeVariable, index, matrixLayout)
{
	var newObj = new oFF.SxVarSimpleTypeMulti();
	newObj.setupGenericVariable(varScreen, simpleTypeVariable, index, matrixLayout);
	return newObj;
};
oFF.SxVarSimpleTypeMulti.prototype.size = function()
{
	return this.m_variable.getValues().size();
};
oFF.SxVarSimpleTypeMulti.prototype.renderLine = function(line, row)
{
	this.renderLineStart(line === 0, row);
	var values = this.m_variable.getValues();
	var value = values.get(line);
	var simpleTypeLine = oFF.SxVarSimpleTypeLine.create(this, row, value, this.m_variable);
	return simpleTypeLine;
};
oFF.SxVarSimpleTypeMulti.prototype.newLine = function(row)
{
	return oFF.SxVarSimpleTypeLine.create(this, row, null, this.m_variable);
};

oFF.SxVarSimpleTypeSingle = function() {};
oFF.SxVarSimpleTypeSingle.prototype = new oFF.SxVarGeneric();
oFF.SxVarSimpleTypeSingle.prototype._ff_c = "SxVarSimpleTypeSingle";

oFF.SxVarSimpleTypeSingle.create = function(varScreen, simpleTypeVariable, index, matrixLayout)
{
	var newObj = new oFF.SxVarSimpleTypeSingle();
	newObj.setupGenericVariable(varScreen, simpleTypeVariable, index, matrixLayout);
	return newObj;
};
oFF.SxVarSimpleTypeSingle.prototype.m_input = null;
oFF.SxVarSimpleTypeSingle.prototype.m_valueAccess = null;
oFF.SxVarSimpleTypeSingle.prototype.renderLine = function(line, row)
{
	this.renderLineStart(true, row);
	var cell2 = row.addNewMatrixLayoutCell();
	this.m_input = cell2.setNewContent(oFF.UiType.INPUT);
	this.m_input.setCustomObject(this.m_variable);
	this.m_input.setWidth(oFF.UiCssLength.createExt(20, oFF.UiCssSizeUnit.EM));
	return this;
};
oFF.SxVarSimpleTypeSingle.prototype.fillValues = function()
{
	this.m_valueAccess = oFF.XValueAccess.createWithType(this.m_variable.getValueType());
	this.m_valueAccess.copyFrom(this.m_variable, null);
	var stringRepresentation = this.m_valueAccess.getString();
	this.m_input.setText(stringRepresentation);
};
oFF.SxVarSimpleTypeSingle.prototype.fetchValues = function()
{
	var value = this.m_input.getText();
	var messages = this.m_valueAccess.parseString(value);
	if (messages.hasErrors())
	{
		this.m_varScreen.setMessage(messages.getSummary());
	}
	else
	{
		oFF.XValueAccess.copy(this.m_valueAccess, this.m_variable);
	}
};
oFF.SxVarSimpleTypeSingle.prototype.disableComponent = function()
{
	if (oFF.notNull(this.m_input))
	{
		this.m_input.setEnabled(false);
	}
};
oFF.SxVarSimpleTypeSingle.prototype.enableComponent = function()
{
	if (oFF.notNull(this.m_input))
	{
		this.m_input.setEnabled(true);
	}
};
oFF.SxVarSimpleTypeSingle.prototype.fetchComponentValueFromInput = function() {};
oFF.SxVarSimpleTypeSingle.prototype.clearComponentValueHelp = function() {};
oFF.SxVarSimpleTypeSingle.prototype.fillComponentValueHelp = function() {};
oFF.SxVarSimpleTypeSingle.prototype.getRow = function()
{
	return this.m_initialRow;
};

oFF.AxisDynamicAttributes = function() {};
oFF.AxisDynamicAttributes.prototype = new oFF.AxisInfo();
oFF.AxisDynamicAttributes.prototype._ff_c = "AxisDynamicAttributes";

oFF.AxisDynamicAttributes.create = function(axisName, settings)
{
	var object = new oFF.AxisDynamicAttributes();
	object.setupAxisInfo(axisName, settings);
	return object;
};
oFF.AxisDynamicAttributes.prototype.m_dataset_displayScalingUnitInHeader = false;
oFF.AxisDynamicAttributes.prototype.m_dataset_hasTitle = false;
oFF.AxisDynamicAttributes.prototype.refresh = function(finalAxisSize)
{
	this.checkScalingFactor();
	this.checkHasTitle();
};
oFF.AxisDynamicAttributes.prototype.checkScalingFactor = function()
{
	this.m_dataset_displayScalingUnitInHeader = false;
};
oFF.AxisDynamicAttributes.prototype.checkHasTitle = function()
{
	this.m_dataset_hasTitle = false;
	var charNumber = this.getQueryViewAxis().getDimensionCount();
	for (var i = 0; i < charNumber; i++)
	{
		var dimension = this.getQueryViewAxis().getDimensionAt(i);
		if (dimension.isStructure())
		{
			if (dimension.isMeasureStructure())
			{
				if (this.m_settings.isKeyfigureStructureTitleVisible())
				{
					this.m_dataset_hasTitle = true;
					break;
				}
			}
			else
			{
				if (this.m_settings.isNonKeyfigureStructureTitleVisible())
				{
					this.m_dataset_hasTitle = true;
					break;
				}
			}
		}
		else
		{
			this.m_dataset_hasTitle = true;
			break;
		}
	}
};
oFF.AxisDynamicAttributes.prototype.isTitleVisible = function()
{
	return this.m_dataset_hasTitle;
};
oFF.AxisDynamicAttributes.prototype.getHasScalingUnitInHeader = function()
{
	return this.m_dataset_displayScalingUnitInHeader;
};

oFF.Section_I_MomentumHier = function() {};
oFF.Section_I_MomentumHier.prototype = new oFF.Section_I_Momentum();
oFF.Section_I_MomentumHier.prototype._ff_c = "Section_I_MomentumHier";

oFF.Section_I_MomentumHier.create = function(dataset)
{
	var object = new oFF.Section_I_MomentumHier();
	object.setupSectionMomentum(dataset);
	return object;
};
oFF.Section_I_MomentumHier.prototype.initAxis = function()
{
	var titleStateListCore = oFF.XList.create();
	this.createUniversalHierarchyPrimary(titleStateListCore);
	this.createUniversalHierarchyAttributes(titleStateListCore);
	this.createScaling(titleStateListCore);
	this.m_titleStatesCore = titleStateListCore;
};
oFF.Section_I_MomentumHier.prototype.createUniversalHierarchyPrimary = function(titleStateListCore)
{
	var isFirst = true;
	var characteristicCount = this.m_dataset.getQueryViewAxis().getDimensionCount();
	var anchorTitleState = oFF.TitleState.createUniversalHierarchyAnchor(this.m_dataset.getQueryViewAxis());
	titleStateListCore.add(anchorTitleState);
	var maxPresentations = 0;
	for (var currentCharacteristicIndex = 0; currentCharacteristicIndex < characteristicCount; currentCharacteristicIndex++)
	{
		this.m_dataset.getQueryViewAxis().getDimensionAt(currentCharacteristicIndex);
	}
	var spanAnchor = null;
	if (maxPresentations > 0)
	{
		var title = null;
		var characteristic2 = this.m_dataset.getQueryViewAxis().getDimensionAt(0);
		title = characteristic2.getText();
		spanAnchor = oFF.TitleState.createUniversalHierarchyPresentation(anchorTitleState, title, 0, null);
		titleStateListCore.add(spanAnchor);
		spanAnchor.setIsFirst(isFirst);
		isFirst = false;
		spanAnchor.setFirstElementOfBlock(true);
		spanAnchor.setFirstElementOfType(true);
		spanAnchor.setIsLastCharacteristic(true);
	}
	for (var presentationIndex = 1; presentationIndex < maxPresentations; presentationIndex++)
	{
		var titleState = oFF.TitleState.createUniversalHierarchyPresentation(anchorTitleState, null, presentationIndex, spanAnchor);
		titleStateListCore.add(titleState);
		titleState.setIsFirst(false);
		titleState.setFirstElementOfBlock(false);
		titleState.setFirstElementOfType(false);
		titleState.setIsLastCharacteristic(true);
	}
	return isFirst;
};
oFF.Section_I_MomentumHier.prototype.createUniversalHierarchyAttributes = function(titleStateListCore)
{
	var characteristicCount = this.m_dataset.getQueryViewAxis().getDimensionCount();
	var attributeNameMap = oFF.XHashMapOfStringByString.create();
	for (var currentCharacteristicIndex = 0; currentCharacteristicIndex < characteristicCount; currentCharacteristicIndex++)
	{
		var characteristic = this.m_dataset.getQueryViewAxis().getDimensionAt(currentCharacteristicIndex);
		var resultSetAttributes = characteristic.getResultSetFields();
		var attributeCount = resultSetAttributes.size();
		for (var currentAttributeIndex = 0; currentAttributeIndex < attributeCount; currentAttributeIndex++)
		{
			var currentAttribute = resultSetAttributes.getFieldAt(currentAttributeIndex);
			var attributeName = currentAttribute.getName();
			currentAttribute.getText();
			if (attributeNameMap.containsKey(attributeName) === false)
			{
				attributeNameMap.put(attributeName, attributeName);
				var attributeAnchor = oFF.TitleState.createUniversalHierarchyAttributeAnchor(this.m_dataset.getAxisName(), attributeName);
				titleStateListCore.add(attributeAnchor);
			}
		}
	}
};
oFF.Section_I_MomentumHier.prototype.createScaling = function(titleStateListCore)
{
	if (this.m_dataset.getHasScalingUnitInHeader())
	{
		var titleState = oFF.TitleState.createScalingFactorsTitle(this.m_dataset.getAxisName());
		titleStateListCore.add(titleState);
	}
};

oFF.Section_I_MomentumStd = function() {};
oFF.Section_I_MomentumStd.prototype = new oFF.Section_I_Momentum();
oFF.Section_I_MomentumStd.prototype._ff_c = "Section_I_MomentumStd";

oFF.Section_I_MomentumStd.create = function(dataset)
{
	var object = new oFF.Section_I_MomentumStd();
	object.setupSectionMomentum(dataset);
	return object;
};
oFF.Section_I_MomentumStd.getFirstDisplayableKeyPresentation = function(characteristic)
{
	var currentPresentation = null;
	return currentPresentation;
};
oFF.Section_I_MomentumStd.prototype.initAxis = function()
{
	var titleStateListCore = oFF.XList.create();
	var titleStateListNewLines = oFF.XList.create();
	var characteristicCount = this.m_dataset.getQueryViewAxis().getDimensionCount();
	var allowNewLines = true;
	var isFirst = true;
	for (var currentCharacteristicIndex = 0; currentCharacteristicIndex < characteristicCount; currentCharacteristicIndex++)
	{
		var characteristic = this.m_dataset.getQueryViewAxis().getDimensionAt(currentCharacteristicIndex);
		var isFirstElementOfBlock = true;
		var hasKeyPresentation = false;
		var anchorTitleStateCharacteristic;
		var firstTitleStateIndex = -1;
		var isHierarchy;
		var anchorTitleState = oFF.TitleState.createCharacteristicAnchor(this.m_dataset.getAxisName(), characteristic, currentCharacteristicIndex);
		anchorTitleStateCharacteristic = anchorTitleState;
		titleStateListCore.add(anchorTitleState);
		titleStateListNewLines.add(anchorTitleState);
		var maxPresentations = 0;
		isHierarchy = characteristic.isHierarchyAssigned() && characteristic.isHierarchyActive();
		var spanAnchor = null;
		for (var currentPresentationIndex = 0; currentPresentationIndex < maxPresentations; currentPresentationIndex++)
		{
			if (firstTitleStateIndex === -1)
			{
				firstTitleStateIndex = titleStateListNewLines.size();
			}
			var titleState;
			if (isHierarchy)
			{
				titleState = oFF.TitleState.createCharacteristicHierarchyPresentation(anchorTitleState, spanAnchor, currentPresentationIndex, this.m_settings);
			}
			else
			{
				titleState = oFF.TitleState.createCharacteristicPresentation(anchorTitleState, spanAnchor, currentPresentationIndex, this.m_settings);
			}
			titleStateListCore.add(titleState);
			titleStateListNewLines.add(titleState);
			if (oFF.isNull(spanAnchor))
			{
				spanAnchor = titleState;
			}
			titleState.setIsFirst(isFirst);
			isFirst = false;
			titleState.setFirstElementOfBlock(isFirstElementOfBlock);
			isFirstElementOfBlock = false;
			titleState.setFirstElementOfType(currentPresentationIndex === 0);
			titleState.setIsLastCharacteristic(currentCharacteristicIndex === characteristicCount - 1);
			if (isHierarchy)
			{
				titleState.setReadOnlyEnforced(true);
			}
			else
			{
				titleState.setReadOnlyEnforced(hasKeyPresentation);
			}
		}
		var resultSetAttributes = characteristic.getResultSetFields();
		var attributeCount = resultSetAttributes.size();
		var anchorTitleState2 = null;
		var spanAnchor2;
		var currentPresentation2;
		var titleState2;
		for (var currentAttributeIndex = 0; currentAttributeIndex < attributeCount; currentAttributeIndex++)
		{
			var currentAttribute = resultSetAttributes.getFieldAt(currentAttributeIndex);
			var title = currentAttribute.getText();
			anchorTitleState2 = oFF.TitleState.createCharacteristicAttributeAnchor(this.m_dataset.getAxisName(), characteristic, currentCharacteristicIndex, currentAttribute.getName(), isHierarchy);
			titleStateListCore.add(anchorTitleState2);
			titleStateListNewLines.add(anchorTitleState2);
			if (true)
			{
				throw oFF.XException.createRuntimeException("Switch from field to attributes!!!");
			}
			var attributePresentations = null;
			var numberOfAttributePresentations = attributePresentations.size();
			spanAnchor2 = null;
			for (var k = 0; k < numberOfAttributePresentations; k++)
			{
				if (firstTitleStateIndex === -1)
				{
					firstTitleStateIndex = titleStateListNewLines.size();
				}
				currentPresentation2 = attributePresentations.get(k);
				titleState2 = oFF.TitleState.createCharacteristicAttributePresentation(anchorTitleState2, spanAnchor2, currentPresentation2, title, isHierarchy);
				if (oFF.isNull(spanAnchor2))
				{
					spanAnchor2 = titleState2;
				}
				titleState2.setIsFirst(isFirst);
				isFirst = false;
				titleState2.setFirstElementOfBlock(isFirstElementOfBlock);
				isFirstElementOfBlock = false;
				titleState2.setFirstElementOfType(k === 0);
				titleState2.setIsLastCharacteristic(currentCharacteristicIndex === characteristicCount - 1);
				titleStateListCore.add(titleState2);
				titleStateListNewLines.add(titleState2);
			}
		}
		if (hasKeyPresentation === false && firstTitleStateIndex !== -1)
		{
			var currentPresentation3 = oFF.Section_I_MomentumStd.getFirstDisplayableKeyPresentation(characteristic);
			if (oFF.notNull(currentPresentation3))
			{
				var oldTitleState = titleStateListNewLines.get(firstTitleStateIndex);
				if (oldTitleState.getType().isHierarchy() === false)
				{
					var titleState3 = oFF.TitleState.createCharacteristicPresentation2(anchorTitleStateCharacteristic, null, currentPresentation3, this.m_settings);
					titleStateListNewLines.set(firstTitleStateIndex, titleState3);
				}
			}
		}
		if (firstTitleStateIndex === -1)
		{
			allowNewLines = false;
		}
	}
	if (this.m_dataset.getHasScalingUnitInHeader())
	{
		var titleState4 = oFF.TitleState.createScalingFactorsTitle(this.m_dataset.getAxisName());
		titleStateListCore.add(titleState4);
		titleStateListNewLines.add(titleState4);
	}
	this.m_titleStatesCore = titleStateListCore;
	if (allowNewLines)
	{
		this.m_titleStatesNewLines = titleStateListNewLines;
	}
	else
	{
		this.m_titleStatesNewLines = null;
	}
};

oFF.AxisSettings = function() {};
oFF.AxisSettings.prototype = new oFF.XObject();
oFF.AxisSettings.prototype._ff_c = "AxisSettings";

oFF.AxisSettings.create = function()
{
	var axisSettings = new oFF.AxisSettings();
	axisSettings.setup();
	return axisSettings;
};
oFF.AxisSettings.prototype.m_selectMode = null;
oFF.AxisSettings.prototype.m_dataFrom = 0;
oFF.AxisSettings.prototype.m_dataMaxCount = 0;
oFF.AxisSettings.prototype.m_pagingType = null;
oFF.AxisSettings.prototype.m_blockSize = 0;
oFF.AxisSettings.prototype.m_blockStepSize = 0;
oFF.AxisSettings.prototype.m_isHeaderVisible = false;
oFF.AxisSettings.prototype.m_visibleStart = 0;
oFF.AxisSettings.prototype.setup = function()
{
	this.m_isHeaderVisible = true;
	this.m_selectMode = oFF.SelectMode.NONE;
	this.m_dataFrom = oFF.PivotTableConstants.FIRST;
	this.m_dataMaxCount = oFF.PivotTableConstants.INFINITE;
	this.m_pagingType = oFF.UiPagingType.BY_PAGE;
	this.m_blockSize = oFF.PivotTableConstants.INFINITE;
	this.m_blockStepSize = oFF.PivotTableConstants.CALCULATED;
};
oFF.AxisSettings.prototype.putAll = function(sourceSettings)
{
	this.setBlockSize(sourceSettings.getBlockSize());
	this.setPagingStepCount(sourceSettings.getPagingStepCount());
	this.setPagingType(sourceSettings.getPagingType());
	this.setSelectMode(sourceSettings.getSelectMode());
	this.setDataFrom(sourceSettings.getDataFrom());
	this.setDataMaxCount(sourceSettings.getDataMaxCount());
	this.setIsHeaderVisible(sourceSettings.isHeaderVisible());
	this.setStartIndex(sourceSettings.getStartIndex());
};
oFF.AxisSettings.prototype.setIsHeaderVisible = function(visible)
{
	this.m_isHeaderVisible = visible;
};
oFF.AxisSettings.prototype.isHeaderVisible = function()
{
	return this.m_isHeaderVisible;
};
oFF.AxisSettings.prototype.setDataFrom = function(dataFrom)
{
	this.m_dataFrom = dataFrom;
};
oFF.AxisSettings.prototype.getDataFrom = function()
{
	return this.m_dataFrom;
};
oFF.AxisSettings.prototype.getDataMaxCount = function()
{
	return this.m_dataMaxCount;
};
oFF.AxisSettings.prototype.setDataMaxCount = function(maxCount)
{
	this.m_dataMaxCount = maxCount;
};
oFF.AxisSettings.prototype.setBlockSize = function(size)
{
	this.m_blockSize = size;
};
oFF.AxisSettings.prototype.getBlockSize = function()
{
	return this.m_blockSize;
};
oFF.AxisSettings.prototype.getSelectMode = function()
{
	return this.m_selectMode;
};
oFF.AxisSettings.prototype.setSelectMode = function(selectMode)
{
	this.m_selectMode = selectMode;
};
oFF.AxisSettings.prototype.getStartIndex = function()
{
	return this.m_visibleStart;
};
oFF.AxisSettings.prototype.setStartIndex = function(visibleStart)
{
	if (visibleStart < 0)
	{
		throw oFF.XException.createIllegalArgumentException("Assertion: visibleStart < 0");
	}
	this.m_visibleStart = visibleStart;
};
oFF.AxisSettings.prototype.getPagingStepCount = function()
{
	return this.m_blockStepSize;
};
oFF.AxisSettings.prototype.setPagingStepCount = function(stepCount)
{
	this.m_blockStepSize = stepCount;
};
oFF.AxisSettings.prototype.getPagingType = function()
{
	return this.m_pagingType;
};
oFF.AxisSettings.prototype.setPagingType = function(pagingType)
{
	this.m_pagingType = pagingType;
};

oFF.PivotTableSettings = function() {};
oFF.PivotTableSettings.prototype = new oFF.XObject();
oFF.PivotTableSettings.prototype._ff_c = "PivotTableSettings";

oFF.PivotTableSettings.create = function()
{
	var object = new oFF.PivotTableSettings();
	object.setup();
	return object;
};
oFF.PivotTableSettings.prototype.m_workMode = null;
oFF.PivotTableSettings.prototype.m_tableInterface = null;
oFF.PivotTableSettings.prototype.m_isPagingAreaTopVisible = false;
oFF.PivotTableSettings.prototype.m_isPagingAreaBottomVisible = false;
oFF.PivotTableSettings.prototype.m_exceptionRendering = null;
oFF.PivotTableSettings.prototype.m_areDataCellsVisible = false;
oFF.PivotTableSettings.prototype.m_hasAlternatingStyles = false;
oFF.PivotTableSettings.prototype.m_displayRepetitionTexts = false;
oFF.PivotTableSettings.prototype.m_hasScalingFactors = false;
oFF.PivotTableSettings.prototype.m_block_row_size = 0;
oFF.PivotTableSettings.prototype.m_block_column_size = 0;
oFF.PivotTableSettings.prototype.m_hasDocIconsMasterData = false;
oFF.PivotTableSettings.prototype.m_hasDocIconsMetaData = false;
oFF.PivotTableSettings.prototype.m_hasDocIconsData = false;
oFF.PivotTableSettings.prototype.m_script = null;
oFF.PivotTableSettings.prototype.m_isInteractionAllowed = false;
oFF.PivotTableSettings.prototype.m_onlyHierarchyNavigation = false;
oFF.PivotTableSettings.prototype.m_newLinesCount = 0;
oFF.PivotTableSettings.prototype.m_newLinesPosition = null;
oFF.PivotTableSettings.prototype.m_rowsSettings = null;
oFF.PivotTableSettings.prototype.m_columnSettings = null;
oFF.PivotTableSettings.prototype.m_queryManager = null;
oFF.PivotTableSettings.prototype.m_hasScrollbars = false;
oFF.PivotTableSettings.prototype.m_isDeletedDataCellWith0Replacement = false;
oFF.PivotTableSettings.prototype.m_isRtl = false;
oFF.PivotTableSettings.prototype.m_isAccessible = false;
oFF.PivotTableSettings.prototype.m_localization = null;
oFF.PivotTableSettings.prototype.m_cellFactory = null;
oFF.PivotTableSettings.prototype.m_clientType = null;
oFF.PivotTableSettings.prototype.m_converterMatrixFactory = null;
oFF.PivotTableSettings.prototype.m_interactiveMatrixCallback = null;
oFF.PivotTableSettings.prototype.m_isComputeColWidthsEnabled = false;
oFF.PivotTableSettings.prototype.m_isRowColumnMergeEnabled = false;
oFF.PivotTableSettings.prototype.m_isKeyfigureStructureTitleVisible = false;
oFF.PivotTableSettings.prototype.m_isNonKeyfigureStructureTitleVisible = false;
oFF.PivotTableSettings.prototype.m_hasReferenceableElements = false;
oFF.PivotTableSettings.prototype.m_hasStableUiElements = false;
oFF.PivotTableSettings.prototype.setup = function()
{
	this.m_isPagingAreaBottomVisible = true;
	this.m_areDataCellsVisible = true;
	this.m_script = "";
	this.m_isInteractionAllowed = true;
	this.m_isComputeColWidthsEnabled = true;
	this.m_isRowColumnMergeEnabled = true;
	this.m_rowsSettings = oFF.AxisSettings.create();
	this.m_columnSettings = oFF.AxisSettings.create();
	var cellFactory = new oFF.PivotCellFactory();
	this.setCellFactory(cellFactory);
	this.setConverterMatrixFactory(oFF.SimpleConverterFactory.create(this));
	this.m_hasStableUiElements = true;
	this.m_workMode = oFF.WorkMode.CLASSIC_STATIC;
	this.m_newLinesPosition = oFF.Alignment.CHILDREN_ABOVE_PARENT;
	this.m_rowsSettings = oFF.AxisSettings.create();
	this.m_columnSettings = oFF.AxisSettings.create();
};
oFF.PivotTableSettings.prototype.putAll = function(sourceSettings)
{
	this.setWorkMode(sourceSettings.getWorkMode());
	this.setHasDocIconsData(sourceSettings.hasDocIconsData());
	this.setHasDocIconsMasterData(sourceSettings.hasDocIconsMasterData());
	this.setHasDocIconsMetaData(sourceSettings.hasDocIconsMetaData());
	this.setExceptionRendering(sourceSettings.getExceptionRendering());
	this.setBlockRowSize(sourceSettings.getBlockRowSize());
	this.setBlockColumnSize(sourceSettings.getBlockColumnSize());
	this.setHasRepetitionTexts(sourceSettings.hasRepetitionTexts());
	this.setHasAlternatingStyles(sourceSettings.hasAlternatingStyles());
	this.setHasOnlyNavigationOnHierarchies(sourceSettings.hasOnlyNavigationOnHierarchies());
	this.setHasScalingFactors(sourceSettings.hasScalingFactors());
	this.setIsDataVisible(sourceSettings.isDataVisible());
	this.setIsInteractionAllowed(sourceSettings.isInteractionAllowed());
	this.setIsPagingAreaBottomVisible(sourceSettings.isPagingAreaBottomVisible());
	this.setIsPagingAreaTopVisible(sourceSettings.isPagingAreaTopVisible());
	this.setNewLinesCount(sourceSettings.getNewLinesCount());
	this.setNewLinesPosition(sourceSettings.getNewLinesPosition());
	this.setScript(sourceSettings.getScript());
	this.setQueryManager(sourceSettings.getQueryManager());
	this.getAxisSettings(oFF.UiAxisType.ROWS).putAll(sourceSettings.getAxisSettings(oFF.UiAxisType.ROWS));
	this.getAxisSettings(oFF.UiAxisType.COLUMNS).putAll(sourceSettings.getAxisSettings(oFF.UiAxisType.COLUMNS));
	this.setHasScrollbars(sourceSettings.hasScrollbars());
	this.setIsDeletedDataCellWith0Replacement(sourceSettings.isDeletedDataCellWith0Replacement());
	this.setIsRtl(sourceSettings.isRtl());
	this.setIsAccessible(sourceSettings.isAccessible());
	this.setLocalization(sourceSettings.getLocalization());
	this.setCellFactory(sourceSettings.getCellFactory());
	this.setTableInterface(sourceSettings.getTableInterface());
	this.setInteractiveMatrixCallback(sourceSettings.getInteractiveMatrixCallback());
	this.setIsComputeColWidthsEnabled(sourceSettings.isComputeColWidthsEnabled());
	this.setIsRowColumnMergeEnabled(sourceSettings.isRowColumnMergeEnabled());
	this.setIsKeyfigureStructureTitleVisible(sourceSettings.isKeyfigureStructureTitleVisible());
	this.setIsNonKeyfigureStructureTitleVisible(sourceSettings.isNonKeyfigureStructureTitleVisible());
	this.setHasDeepCopyLayer(sourceSettings.hasDeepCopyLayer());
	this.setHasStableUiElements(sourceSettings.hasStableUiElements());
};
oFF.PivotTableSettings.prototype.getWorkMode = function()
{
	return this.m_workMode;
};
oFF.PivotTableSettings.prototype.setWorkMode = function(workMode)
{
	this.m_workMode = workMode;
};
oFF.PivotTableSettings.prototype.setIsDataVisible = function(visible)
{
	this.m_areDataCellsVisible = visible;
};
oFF.PivotTableSettings.prototype.isDataVisible = function()
{
	return this.m_areDataCellsVisible;
};
oFF.PivotTableSettings.prototype.setHasAlternatingStyles = function(enabled)
{
	this.m_hasAlternatingStyles = enabled;
};
oFF.PivotTableSettings.prototype.hasAlternatingStyles = function()
{
	return this.m_hasAlternatingStyles;
};
oFF.PivotTableSettings.prototype.setHasRepetitionTexts = function(enabled)
{
	this.m_displayRepetitionTexts = enabled;
};
oFF.PivotTableSettings.prototype.hasRepetitionTexts = function()
{
	return this.m_displayRepetitionTexts;
};
oFF.PivotTableSettings.prototype.setHasScalingFactors = function(enabled)
{
	this.m_hasScalingFactors = enabled;
};
oFF.PivotTableSettings.prototype.hasScalingFactors = function()
{
	return this.m_hasScalingFactors;
};
oFF.PivotTableSettings.prototype.getExceptionRendering = function()
{
	return this.m_exceptionRendering;
};
oFF.PivotTableSettings.prototype.setExceptionRendering = function(value)
{
	this.m_exceptionRendering = value;
};
oFF.PivotTableSettings.prototype.setHasDocIconsMetaData = function(hasDocIcons)
{
	this.m_hasDocIconsMetaData = hasDocIcons;
};
oFF.PivotTableSettings.prototype.hasDocIconsMetaData = function()
{
	return this.m_hasDocIconsMetaData;
};
oFF.PivotTableSettings.prototype.setHasDocIconsMasterData = function(hasDocIcons)
{
	this.m_hasDocIconsMasterData = hasDocIcons;
};
oFF.PivotTableSettings.prototype.hasDocIconsMasterData = function()
{
	return this.m_hasDocIconsMasterData;
};
oFF.PivotTableSettings.prototype.setHasDocIconsData = function(hasDocIcons)
{
	this.m_hasDocIconsData = hasDocIcons;
};
oFF.PivotTableSettings.prototype.hasDocIconsData = function()
{
	return this.m_hasDocIconsData;
};
oFF.PivotTableSettings.prototype.setScript = function(script) {};
oFF.PivotTableSettings.prototype.getScript = function()
{
	return this.m_script;
};
oFF.PivotTableSettings.prototype.setIsPagingAreaTopVisible = function(visible)
{
	this.m_isPagingAreaTopVisible = visible;
};
oFF.PivotTableSettings.prototype.isPagingAreaTopVisible = function()
{
	return this.m_isPagingAreaTopVisible;
};
oFF.PivotTableSettings.prototype.setBlockRowSize = function(blockRowSize)
{
	this.m_block_row_size = blockRowSize;
};
oFF.PivotTableSettings.prototype.getBlockRowSize = function()
{
	return this.m_block_row_size;
};
oFF.PivotTableSettings.prototype.setBlockColumnSize = function(blockColumnSize)
{
	this.m_block_column_size = blockColumnSize;
};
oFF.PivotTableSettings.prototype.getBlockColumnSize = function()
{
	return this.m_block_column_size;
};
oFF.PivotTableSettings.prototype.setIsPagingAreaBottomVisible = function(visible)
{
	this.m_isPagingAreaBottomVisible = visible;
};
oFF.PivotTableSettings.prototype.isPagingAreaBottomVisible = function()
{
	return this.m_isPagingAreaBottomVisible;
};
oFF.PivotTableSettings.prototype.isInteractionAllowed = function()
{
	return this.m_isInteractionAllowed;
};
oFF.PivotTableSettings.prototype.setIsInteractionAllowed = function(isInteractionAllowed)
{
	this.m_isInteractionAllowed = isInteractionAllowed;
};
oFF.PivotTableSettings.prototype.setHasOnlyNavigationOnHierarchies = function(enabled)
{
	this.m_onlyHierarchyNavigation = enabled;
};
oFF.PivotTableSettings.prototype.hasOnlyNavigationOnHierarchies = function()
{
	return this.m_onlyHierarchyNavigation;
};
oFF.PivotTableSettings.prototype.getNewLinesCount = function()
{
	return this.m_newLinesCount;
};
oFF.PivotTableSettings.prototype.setNewLinesCount = function(newLinesCount)
{
	this.m_newLinesCount = newLinesCount;
};
oFF.PivotTableSettings.prototype.setNewLinesPosition = function(newLinesPosition)
{
	this.m_newLinesPosition = newLinesPosition;
};
oFF.PivotTableSettings.prototype.getNewLinesPosition = function()
{
	return this.m_newLinesPosition;
};
oFF.PivotTableSettings.prototype.getAxisSettings = function(axisName)
{
	if (axisName === oFF.UiAxisType.ROWS)
	{
		return this.m_rowsSettings;
	}
	return this.m_columnSettings;
};
oFF.PivotTableSettings.prototype.getQueryView = function()
{
	return this.m_queryManager.getQueryModel();
};
oFF.PivotTableSettings.prototype.setQueryManager = function(queryManager)
{
	this.m_queryManager = queryManager;
};
oFF.PivotTableSettings.prototype.hasScrollbars = function()
{
	return this.m_hasScrollbars;
};
oFF.PivotTableSettings.prototype.setHasScrollbars = function(hasScrollbars)
{
	this.m_hasScrollbars = hasScrollbars;
};
oFF.PivotTableSettings.prototype.isDeletedDataCellWith0Replacement = function()
{
	return this.m_isDeletedDataCellWith0Replacement;
};
oFF.PivotTableSettings.prototype.setIsDeletedDataCellWith0Replacement = function(replaceWith0)
{
	this.m_isDeletedDataCellWith0Replacement = replaceWith0;
};
oFF.PivotTableSettings.prototype.isRtl = function()
{
	return this.m_isRtl;
};
oFF.PivotTableSettings.prototype.setIsRtl = function(isRtl)
{
	this.m_isRtl = isRtl;
};
oFF.PivotTableSettings.prototype.isAccessible = function()
{
	return this.m_isAccessible;
};
oFF.PivotTableSettings.prototype.setIsAccessible = function(isAccessible)
{
	this.m_isAccessible = isAccessible;
};
oFF.PivotTableSettings.prototype.getLocalization = function()
{
	return this.m_localization;
};
oFF.PivotTableSettings.prototype.setLocalization = function(localization)
{
	this.m_localization = localization;
};
oFF.PivotTableSettings.prototype.getTableInterface = function()
{
	return this.m_tableInterface;
};
oFF.PivotTableSettings.prototype.setTableInterface = function(tableInterface)
{
	this.m_tableInterface = tableInterface;
};
oFF.PivotTableSettings.prototype.getCellFactory = function()
{
	return this.m_cellFactory;
};
oFF.PivotTableSettings.prototype.setCellFactory = function(cellFactory)
{
	this.m_cellFactory = cellFactory;
};
oFF.PivotTableSettings.prototype.getClientType = function()
{
	return this.m_clientType;
};
oFF.PivotTableSettings.prototype.setClientType = function(clientType)
{
	this.m_clientType = clientType;
};
oFF.PivotTableSettings.prototype.setConverterMatrixFactory = function(factory)
{
	this.m_converterMatrixFactory = factory;
};
oFF.PivotTableSettings.prototype.getConverterMatrixFactory = function()
{
	return this.m_converterMatrixFactory;
};
oFF.PivotTableSettings.prototype.getInteractiveMatrixCallback = function()
{
	return this.m_interactiveMatrixCallback;
};
oFF.PivotTableSettings.prototype.setInteractiveMatrixCallback = function(callback)
{
	this.m_interactiveMatrixCallback = callback;
};
oFF.PivotTableSettings.prototype.isComputeColWidthsEnabled = function()
{
	return this.m_isComputeColWidthsEnabled;
};
oFF.PivotTableSettings.prototype.setIsComputeColWidthsEnabled = function(isEnabled)
{
	this.m_isComputeColWidthsEnabled = isEnabled;
};
oFF.PivotTableSettings.prototype.isRowColumnMergeEnabled = function()
{
	return this.m_isRowColumnMergeEnabled;
};
oFF.PivotTableSettings.prototype.setIsRowColumnMergeEnabled = function(isEnabled)
{
	this.m_isRowColumnMergeEnabled = isEnabled;
};
oFF.PivotTableSettings.prototype.isKeyfigureStructureTitleVisible = function()
{
	return this.m_isKeyfigureStructureTitleVisible;
};
oFF.PivotTableSettings.prototype.isNonKeyfigureStructureTitleVisible = function()
{
	return this.m_isNonKeyfigureStructureTitleVisible;
};
oFF.PivotTableSettings.prototype.setIsKeyfigureStructureTitleVisible = function(isVisible)
{
	this.m_isKeyfigureStructureTitleVisible = isVisible;
};
oFF.PivotTableSettings.prototype.setIsNonKeyfigureStructureTitleVisible = function(isVisible)
{
	this.m_isNonKeyfigureStructureTitleVisible = isVisible;
};
oFF.PivotTableSettings.prototype.hasDeepCopyLayer = function()
{
	return this.m_hasReferenceableElements;
};
oFF.PivotTableSettings.prototype.setHasDeepCopyLayer = function(hasReferenceableElements)
{
	this.m_hasReferenceableElements = hasReferenceableElements;
};
oFF.PivotTableSettings.prototype.getQueryManager = function()
{
	return this.m_queryManager;
};
oFF.PivotTableSettings.prototype.hasStableUiElements = function()
{
	return this.m_hasStableUiElements;
};
oFF.PivotTableSettings.prototype.setHasStableUiElements = function(hasStableUiElements)
{
	this.m_hasStableUiElements = hasStableUiElements;
};
oFF.PivotTableSettings.prototype.getHeight = function()
{
	return null;
};
oFF.PivotTableSettings.prototype.setHeight = function(height)
{
	return null;
};
oFF.PivotTableSettings.prototype.getWidth = function()
{
	return null;
};
oFF.PivotTableSettings.prototype.setWidth = function(width)
{
	return null;
};

oFF.SqlSchemaNode = function() {};
oFF.SqlSchemaNode.prototype = new oFF.XObject();
oFF.SqlSchemaNode.prototype._ff_c = "SqlSchemaNode";

oFF.SqlSchemaNode.prototype.catalog = null;
oFF.SqlSchemaNode.prototype.schema = null;
oFF.SqlSchemaNode.prototype.onDoubleClick = function(event)
{
	event.getControl().getCustomObject().processGetTables(oFF.SyncType.NON_BLOCKING, this, event.getControl(), this.catalog, this.schema, null);
};
oFF.SqlSchemaNode.prototype.onQueryResult = function(extResult, data, customIdentifier)
{
	customIdentifier.clearItems();
	while (data.next())
	{
		var other = customIdentifier.addNewItem();
		other.setText(data.getStringAt(2));
		var node = new oFF.SqlTableNode();
		node.catalog = this.catalog;
		node.schema = this.schema;
		node.tablename = data.getStringAt(2);
		other.registerOnDoubleClick(node);
		other.setCustomObject(customIdentifier.getCustomObject());
	}
};

oFF.SqlTableNode = function() {};
oFF.SqlTableNode.prototype = new oFF.XObject();
oFF.SqlTableNode.prototype._ff_c = "SqlTableNode";

oFF.SqlTableNode.prototype.catalog = null;
oFF.SqlTableNode.prototype.schema = null;
oFF.SqlTableNode.prototype.tablename = null;
oFF.SqlTableNode.prototype.onDoubleClick = function(event)
{
	event.getControl().getCustomObject().processGetColumns(oFF.SyncType.NON_BLOCKING, this, event.getControl(), this.catalog, this.schema, this.tablename, null).getData();
};
oFF.SqlTableNode.prototype.onQueryResult = function(extResult, data, customIdentifier)
{
	customIdentifier.clearItems();
	while (data.next())
	{
		var other2 = customIdentifier.addNewItem();
		other2.setText(oFF.XStringUtils.concatenate3(data.getStringAt(3), " : ", data.getStringAt(4)));
	}
};

oFF.DfUiTableModel = function() {};
oFF.DfUiTableModel.prototype = new oFF.XObject();
oFF.DfUiTableModel.prototype._ff_c = "DfUiTableModel";

oFF.DfUiTableModel.prototype.getColumnCount = function()
{
	return 0;
};
oFF.DfUiTableModel.prototype.getColumnText = function(column)
{
	return null;
};
oFF.DfUiTableModel.prototype.getColumnName = function(column)
{
	return null;
};
oFF.DfUiTableModel.prototype.getRowCount = function()
{
	return 0;
};
oFF.DfUiTableModel.prototype.getRowElement = function(row)
{
	return null;
};
oFF.DfUiTableModel.prototype.getRowName = function(rowObject)
{
	return null;
};
oFF.DfUiTableModel.prototype.getCellText = function(rowObject, column)
{
	return null;
};
oFF.DfUiTableModel.prototype.getImage = function(rowObject, column)
{
	return null;
};

oFF.SearchEngineCore = function() {};
oFF.SearchEngineCore.prototype = new oFF.XObjectExt();
oFF.SearchEngineCore.prototype._ff_c = "SearchEngineCore";

oFF.SearchEngineCore.create = function()
{
	var searchEngineCore = new oFF.SearchEngineCore();
	searchEngineCore.setup();
	return searchEngineCore;
};
oFF.SearchEngineCore.createSummary = function(javascriptSource, searchTerms, createHtml)
{
	var buffer = oFF.XStringBuffer.create();
	if (createHtml)
	{
		buffer.append("<a href=\"?cmd=g&p=");
		buffer.append(oFF.XHttpUtils.encodeURIComponent(javascriptSource.getNativePath()));
		buffer.append("&st=");
		var uriSearchTerms = oFF.XStringBuffer.create();
		for (var i = 0; i < searchTerms.size(); i++)
		{
			if (i > 0)
			{
				uriSearchTerms.append(",");
			}
			uriSearchTerms.append(searchTerms.get(i));
		}
		buffer.append(oFF.XHttpUtils.encodeURIComponent(uriSearchTerms.toString()));
		buffer.append("\">");
	}
	buffer.append(javascriptSource.getNativePath());
	if (createHtml)
	{
		buffer.append("</a>");
	}
	buffer.appendNewLine();
	buffer.append("    ");
	buffer.append(searchTerms.toString());
	var content = javascriptSource.getContent();
	var offset = 0;
	while (true)
	{
		var nextIndex = -1;
		var nextSearchTerm = null;
		for (var k = 0; k < searchTerms.size(); k++)
		{
			var searchTerm = searchTerms.get(k);
			var index = oFF.XString.indexOfFrom(content, oFF.XStringUtils.concatenate2(".", searchTerm), offset);
			if (index < nextIndex || nextIndex === -1)
			{
				nextIndex = index;
				nextSearchTerm = searchTerm;
			}
		}
		if (nextIndex === -1)
		{
			break;
		}
		offset = nextIndex + oFF.XString.size(nextSearchTerm);
		var startIndex = nextIndex - 15;
		if (startIndex < 0)
		{
			startIndex = 0;
		}
		var endIndex = offset + 15;
		if (endIndex > oFF.XString.size(content))
		{
			endIndex = oFF.XString.size(content);
		}
		var fragment = oFF.XString.substring(content, startIndex, endIndex);
		fragment = oFF.XString.replace(fragment, "\r\n", "");
		fragment = oFF.XString.trim(fragment);
		buffer.appendNewLine();
		buffer.append("    ... ");
		buffer.append(fragment);
		buffer.append(" ...");
	}
	return buffer.toString();
};
oFF.SearchEngineCore.recursiveJsLoad = function(parent, sourceFiles)
{
	if (parent.isFile())
	{
		var name = parent.getName();
		var normalizedPath = parent.getTargetUriPath();
		var nativePath = parent.getNativePath();
		if ((oFF.XString.endsWith(name, ".js") || oFF.XString.endsWith(name, ".xsjs")) && oFF.XString.containsString(name, "___32_olap.providers.all") === false)
		{
			var content = parent.load();
			if (parent.isValid())
			{
				var stringContent = content.getString();
				var index = sourceFiles.size();
				if (oFF.XMath.mod(index, 100) === 0)
				{
					oFF.XLogger.println(oFF.XInteger.convertToString(index));
				}
				var item = oFF.FindRefsItem.create(normalizedPath, nativePath, stringContent, index);
				sourceFiles.add(item);
			}
		}
	}
	else
	{
		var children = parent.getChildren();
		for (var i = 0; i < children.size(); i++)
		{
			var ixFile = children.get(i);
			oFF.SearchEngineCore.recursiveJsLoad(ixFile, sourceFiles);
		}
	}
};
oFF.SearchEngineCore.loadTestMetadata = function(directory, metadataFiles)
{
	if (directory.isDirectory())
	{
		var children = directory.getChildren();
		for (var i = 0; i < children.size(); i++)
		{
			var file = children.get(i);
			var fileContent = file.load();
			var jsonContent = fileContent.getJsonContent();
			if (oFF.notNull(jsonContent))
			{
				var content = jsonContent;
				var testMd = oFF.FindRefsTestMd.create(content);
				metadataFiles.add(testMd);
			}
		}
	}
};
oFF.SearchEngineCore.findJavaClassesFiles = function(parent, sourceFiles)
{
	if (parent.isFile())
	{
		var name = parent.getName();
		var normalizedPath = parent.getTargetUriPath();
		if (oFF.XString.endsWith(name, ".java"))
		{
			var content = parent.load();
			if (parent.isValid())
			{
				var stringContent = content.getString();
				var index = sourceFiles.size();
				var item = oFF.FindRefsClass.create(normalizedPath, stringContent, index);
				sourceFiles.add(item);
			}
		}
	}
	else
	{
		var children = parent.getChildren();
		for (var i = 0; i < children.size(); i++)
		{
			var ixFile = children.get(i);
			oFF.SearchEngineCore.findJavaClassesFiles(ixFile, sourceFiles);
		}
	}
};
oFF.SearchEngineCore.addInclude = function(buffer, include)
{
	buffer.append("<script src=\"/targets/javascript/");
	buffer.append(include);
	buffer.append("\" type=\"text/javascript\"></script>").appendNewLine();
};
oFF.SearchEngineCore.prototype.m_application = null;
oFF.SearchEngineCore.prototype.m_jsFiles = null;
oFF.SearchEngineCore.prototype.m_javaFilesImpl = null;
oFF.SearchEngineCore.prototype.m_javaFilesAll = null;
oFF.SearchEngineCore.prototype.m_metadataFiles = null;
oFF.SearchEngineCore.prototype.m_simpleIndex = null;
oFF.SearchEngineCore.prototype.m_fireflyClassIndex = null;
oFF.SearchEngineCore.prototype.m_ffSdk = null;
oFF.SearchEngineCore.prototype.setup = function()
{
	oFF.XLogger.println("*** Serenity Search Engine ***");
	var ff_sdk_var = oFF.XEnvironment.getInstance().getVariable(oFF.XEnvironmentConstants.FIREFLY_SDK);
	if (oFF.XStringUtils.isNullOrEmpty(ff_sdk_var))
	{
		oFF.XLogger.println("ff_sdk variable is not set. Cancelling search engine init.");
	}
	else
	{
		var ffSdk = oFF.XFile.createByNativePath(this.getSession(), ff_sdk_var);
		if (ffSdk.isExisting() === false || ffSdk.isDirectory() === false)
		{
			oFF.XLogger.println("ff_sdk variable does not denote an existing directory. Cancelling search engine init.");
			this.log2("ff_sdk=", ff_sdk_var);
		}
		else
		{
			this.m_ffSdk = ffSdk;
			var ffLandscape = this.m_ffSdk.newChild("production/systems/SystemLandscapeForSerenity.json");
			var ffLandscapeUri = ffLandscape.getVfsUri();
			var extResult = oFF.ApplicationFactory.createApplicationWithLandscapeBlocking(null, ffLandscapeUri.toString());
			this.m_application = extResult.getData();
			oFF.XObjectExt.release(extResult);
			this.indexOrcaFiles();
			this.indexFireflyFiles(this.m_ffSdk);
		}
	}
	if (oFF.isNull(this.m_application))
	{
		this.m_application = oFF.ApplicationFactory.createDefaultApplication();
	}
};
oFF.SearchEngineCore.prototype.indexFireflyFiles = function(ffSdk)
{
	var ffSdkSources = ffSdk.newChild("sources");
	var ffSdkSourcesOlapImpl = ffSdkSources.newChild("_30_olap.impl");
	var ffSdkTestMetadata = ffSdk.newChild("production/tests/metadata");
	this.log("Loading Test Metadata Files...");
	this.m_metadataFiles = oFF.XListOfNameObject.create();
	oFF.SearchEngineCore.loadTestMetadata(ffSdkTestMetadata, this.m_metadataFiles);
	this.log("Loading Olap Impl classes...");
	this.m_javaFilesImpl = oFF.XListOfNameObject.create();
	oFF.SearchEngineCore.findJavaClassesFiles(ffSdkSourcesOlapImpl, this.m_javaFilesImpl);
	this.log("Loading all classes...");
	this.m_javaFilesAll = oFF.XListOfNameObject.create();
	oFF.SearchEngineCore.findJavaClassesFiles(ffSdkSources, this.m_javaFilesAll);
};
oFF.SearchEngineCore.prototype.indexOrcaFiles = function()
{
	var ff_orca_var = oFF.XEnvironment.getInstance().getVariable("ff_orca");
	if (oFF.XStringUtils.isNullOrEmpty(ff_orca_var))
	{
		this.log("ff_orca variable is not set. Cancelling indexing Orca javascript files.");
	}
	else
	{
		var ffOrca = oFF.XFile.createByNativePath(this.getSession(), ff_orca_var);
		if (ffOrca.isExisting() === false || ffOrca.isDirectory() === false)
		{
			this.log("ff_orca variable does point to an existing directory. Cancelling indexing Orca javascript files.");
		}
		else
		{
			this.log("Loading Orca Javascript Files...");
			this.m_jsFiles = oFF.XListOfNameObject.create();
			oFF.SearchEngineCore.recursiveJsLoad(ffOrca, this.m_jsFiles);
			var size = this.m_jsFiles.size();
			this.log("Creating Forward Index...");
			for (var i = 0; i < size; i++)
			{
				var item = this.m_jsFiles.get(i);
				item.getForwardIndex();
			}
			this.log("Creating Inverted Index...");
			this.m_simpleIndex = oFF.XHashMapByString.create();
			this.m_fireflyClassIndex = oFF.XHashMapByString.create();
			for (var s = 0; s < size; s++)
			{
				var simpleMap = oFF.XHashSetOfString.create();
				var ffClassMap = oFF.XHashSetOfString.create();
				var item2 = this.m_jsFiles.get(s);
				var forwardIndex = item2.getForwardIndex();
				for (var k = 0; k < forwardIndex.size(); k++)
				{
					var token = forwardIndex.get(k);
					var name = token.getName();
					if (token.m_isAfterDot)
					{
						if (simpleMap.contains(name) === false)
						{
							simpleMap.add(name);
							var tokenList = this.m_simpleIndex.getByKey(name);
							if (oFF.isNull(tokenList))
							{
								tokenList = oFF.XList.create();
								this.m_simpleIndex.put(name, tokenList);
							}
							tokenList.add(token);
						}
						if (token.m_isFireflyClass && ffClassMap.contains(name) === false)
						{
							ffClassMap.add(name);
							var tokenList2 = this.m_fireflyClassIndex.getByKey(name);
							if (oFF.isNull(tokenList2))
							{
								tokenList2 = oFF.XList.create();
								this.m_fireflyClassIndex.put(name, tokenList2);
							}
							tokenList2.add(token);
						}
					}
				}
			}
		}
	}
};
oFF.SearchEngineCore.prototype.getTestMetadata = function(name)
{
	return this.m_metadataFiles.getByKey(name);
};
oFF.SearchEngineCore.prototype.processManualQuery = function(query)
{
	var testMd = this.m_metadataFiles.getByKey(query);
	if (oFF.isNull(testMd))
	{
		return "No test found...";
	}
	var buffer = oFF.XStringBuffer.create();
	buffer.append("&nbsp;<a href=\"?cmd=t&p=");
	buffer.append(testMd.getName());
	buffer.append("&query=");
	buffer.append(query);
	buffer.append("\">");
	buffer.append(testMd.getName());
	buffer.append("</a>");
	return buffer.toString();
};
oFF.SearchEngineCore.prototype.process = function(searchOnlyImpl, searchClasses, searchPrivateMethods, searchPrivateMembers)
{
	var output = oFF.XStringBuffer.create();
	var mask = oFF.XHashSetOfString.create();
	mask.add("log");
	mask.add("matches");
	mask.add("values");
	mask.add("TestUtils");
	mask.add("S");
	mask.add("HANA");
	mask.add("NOT_FOUND");
	mask.add("DIMENSIONS");
	mask.add("Alignment");
	mask.add("TEXT");
	mask.add("FILTER");
	mask.add("MODEL");
	mask.add("VARIABLES");
	mask.add("SPACE");
	mask.add("TEXT");
	mask.add("NAME");
	var results = oFF.XHashMapByString.create();
	var javaFiles;
	if (searchOnlyImpl)
	{
		javaFiles = this.m_javaFilesImpl;
	}
	else
	{
		javaFiles = this.m_javaFilesAll;
	}
	var classCount = 0;
	var searchTermCount = 0;
	if (oFF.notNull(javaFiles))
	{
		for (var m = 0; m < javaFiles.size(); m++)
		{
			var frc = javaFiles.get(m);
			var xClass = frc.getXClass();
			if (oFF.notNull(xClass))
			{
				classCount++;
				var searchTerms = oFF.XListOfString.create();
				if (searchClasses)
				{
					searchTerms.add(frc.getClazzName());
				}
				if (searchPrivateMethods)
				{
					var methods = oFF.XReflection.getMethods(xClass);
					for (var o = 0; o < methods.size(); o++)
					{
						var currentMethod = methods.get(o);
						if (currentMethod.getAccessModifier() !== oFF.XAccessModifier.PUBLIC)
						{
							searchTerms.add(currentMethod.getName());
						}
					}
				}
				if (searchPrivateMembers)
				{
					var members = oFF.XReflection.getMembers(xClass);
					for (var p = 0; p < members.size(); p++)
					{
						var currentMember = members.get(p);
						if (currentMember.getAccessModifier() !== oFF.XAccessModifier.PUBLIC)
						{
							var memberName = currentMember.getName();
							if (oFF.XString.startsWith(memberName, "m_") || oFF.XString.startsWith(memberName, "s_"))
							{
								searchTerms.add(currentMember.getName());
							}
						}
					}
				}
				if (searchTerms.size() > 0)
				{
					searchTermCount = searchTermCount + searchTerms.size();
					var selectedIndex = null;
					if (searchClasses)
					{
						selectedIndex = this.m_fireflyClassIndex;
					}
					else if (searchPrivateMembers)
					{
						selectedIndex = this.m_simpleIndex;
					}
					if (oFF.notNull(selectedIndex))
					{
						for (var d = 0; d < searchTerms.size(); d++)
						{
							var searchTerm = searchTerms.get(d);
							this.log(searchTerm);
							if (mask.contains(searchTerm) === false)
							{
								var listOfRefs = selectedIndex.getByKey(searchTerm);
								if (oFF.notNull(listOfRefs))
								{
									for (var x = 0; x < listOfRefs.size(); x++)
									{
										var token = listOfRefs.get(x);
										var foundTermsList = results.getByKey(token.m_item.getName());
										if (oFF.isNull(foundTermsList))
										{
											foundTermsList = oFF.XListOfString.create();
											results.put(token.m_item.getName(), foundTermsList);
										}
										foundTermsList.add(searchTerm);
									}
								}
							}
						}
					}
				}
			}
		}
	}
	if (searchTermCount === 0)
	{
		output.append("No search term defined");
	}
	else
	{
		output.append("FF classes inspected: ");
		output.appendInt(classCount);
		output.append(" Search terms: ");
		output.appendInt(searchTermCount);
		output.appendNewLine();
		var foundKey = results.getKeysAsIteratorOfString();
		if (foundKey.hasNext() === false)
		{
			output.append("*** Nothing found ***");
		}
		else
		{
			while (foundKey.hasNext())
			{
				var key = foundKey.next();
				var searchTerms2 = results.getByKey(key);
				var javascriptSource = this.m_jsFiles.getByKey(key);
				var summary = oFF.SearchEngineCore.createSummary(javascriptSource, searchTerms2, true);
				output.append(summary);
				output.appendNewLine();
				output.append("</p>");
			}
		}
	}
	return output.toString();
};
oFF.SearchEngineCore.prototype.getJsFile = function(key)
{
	return this.m_jsFiles.getByKey(key);
};
oFF.SearchEngineCore.prototype.getSession = function()
{
	return this.m_application.getSession();
};
oFF.SearchEngineCore.prototype.getApplication = function()
{
	return this.m_application;
};
oFF.SearchEngineCore.prototype.onHttpRequest = function(serverRequestResponse)
{
	var clientRequest = serverRequestResponse.getClientRequest();
	var serverResponse = oFF.HttpResponse.createResponse(clientRequest);
	var parameters = clientRequest.getQueryMap();
	var query = parameters.getByKey("query");
	var headBuffer = oFF.XStringBuffer.create();
	headBuffer.append("<head>");
	headBuffer.append("<title>Serenity</title>");
	var hasInitPage = false;
	var bodyBuffer = oFF.XStringBuffer.create();
	bodyBuffer.append("<body onload=\"initPage()\">");
	bodyBuffer.append("<a href=\"?\" style=\"text-decoration:none\">");
	bodyBuffer.append("<pre>");
	bodyBuffer.append("  _________                            .__  __\r\n");
	bodyBuffer.append("  /   _____/ ___________   ____   ____ |__|/  |_ ___.__.\r\n");
	bodyBuffer.append("  \\_____  \\_/ __ \\_  __ \\_/ __ \\ /    \\|  \\   __<   |  |\r\n");
	bodyBuffer.append("  /        \\  ___/|  | \\/\\  ___/|   |  \\  ||  |  \\___  |\r\n");
	bodyBuffer.append(" /_______  /\\___  >__|    \\___  >___|  /__||__|  / ____|\r\n");
	bodyBuffer.append("         \\/     \\/            \\/     \\/          \\/\r\n");
	bodyBuffer.append("</pre>");
	bodyBuffer.append("</a>");
	bodyBuffer.append("<form action=\"\">");
	bodyBuffer.append("<input type=\"text\" name=\"query\" size=\"50\"");
	if (oFF.notNull(query))
	{
		bodyBuffer.append(" value=\"");
		bodyBuffer.append(oFF.XStringUtils.escapeHtml(oFF.XString.trim(query)));
		bodyBuffer.append("\"");
	}
	bodyBuffer.append("/>");
	bodyBuffer.append("&nbsp;");
	bodyBuffer.append("<input type=\"submit\" value=\"submit\" />");
	bodyBuffer.append("<input type=\"hidden\" name=\"cmd\"value=\"sb\" />");
	bodyBuffer.append("</form>");
	bodyBuffer.append("<a href=\"?cmd=ic\">Search impl FF classes</a> | ");
	bodyBuffer.append("<a href=\"?cmd=ac\">Search all FF classes</a> |");
	bodyBuffer.append("<a href=\"?cmd=im\">Search impl FF private members</a> |");
	bodyBuffer.append("<a href=\"?cmd=am\">Search all FF private members</a>");
	bodyBuffer.append("<p/><hr/><p/>");
	var cmd = parameters.getByKey("cmd");
	if (oFF.notNull(cmd))
	{
		var result = null;
		if (oFF.XString.isEqual(cmd, "sb"))
		{
			result = this.processManualQuery(parameters.getByKey("query"));
		}
		else if (oFF.XString.isEqual(cmd, "ic"))
		{
			result = this.process(true, true, false, false);
		}
		else if (oFF.XString.isEqual(cmd, "ac"))
		{
			result = this.process(false, true, false, false);
		}
		else if (oFF.XString.isEqual(cmd, "im"))
		{
			result = this.process(true, false, true, true);
		}
		else if (oFF.XString.isEqual(cmd, "am"))
		{
			result = this.process(false, false, true, true);
		}
		else if (oFF.XString.isEqual(cmd, "g"))
		{
			var path = parameters.getByKey("p");
			var item = this.getJsFile(path);
			if (oFF.notNull(item))
			{
				result = item.getContent();
				result = oFF.XStringUtils.escapeHtml(result);
				var searchTerms = parameters.getByKey("st");
				var terms = oFF.XStringTokenizer.splitString(searchTerms, ",");
				result = this.highlightText(result, terms);
			}
		}
		else if (oFF.XString.isEqual(cmd, "t"))
		{
			hasInitPage = this.renderTestApp(headBuffer, bodyBuffer, parameters);
		}
		if (oFF.notNull(result))
		{
			bodyBuffer.append("<pre>");
			bodyBuffer.append(result);
			bodyBuffer.append("</pre>");
		}
	}
	if (hasInitPage === false)
	{
		headBuffer.append("<script>").appendNewLine();
		headBuffer.appendNewLine();
		headBuffer.append("function initPage()").appendNewLine();
		headBuffer.append("{").appendNewLine();
		headBuffer.append("}").appendNewLine();
		headBuffer.appendNewLine();
		headBuffer.append("</script>").appendNewLine();
	}
	headBuffer.append("</head>");
	bodyBuffer.append("</body>");
	var htmlBuffer = oFF.XStringBuffer.create();
	htmlBuffer.append("<html>");
	htmlBuffer.append(headBuffer.toString());
	htmlBuffer.append(bodyBuffer.toString());
	htmlBuffer.append("</html>");
	serverResponse.setString(htmlBuffer.toString());
	serverResponse.setContentType(oFF.ContentType.TEXT_HTML);
	serverResponse.setStatusCode(oFF.HttpStatusCode.SC_OK);
	serverRequestResponse.setResponse(serverResponse);
};
oFF.SearchEngineCore.prototype.renderTestApp = function(headBuffer, bodyBuffer, parameters)
{
	var testName = parameters.getByKey("p");
	var testMetadata = this.getTestMetadata(testName);
	bodyBuffer.append("<b>");
	bodyBuffer.append(testName);
	bodyBuffer.append("</b>");
	if (oFF.isNull(testMetadata))
	{
		bodyBuffer.append(" cannot be found.<p/>");
		return false;
	}
	headBuffer.appendNewLine();
	oFF.SearchEngineCore.addInclude(headBuffer, "_00_language.native/combined/___00_language.native.js");
	oFF.SearchEngineCore.addInclude(headBuffer, "_02_core/combined/___02_core.js");
	oFF.SearchEngineCore.addInclude(headBuffer, "_04_core.native/combined/___04_core.native.js");
	oFF.SearchEngineCore.addInclude(headBuffer, "_06_core.ext/combined/___06_core.ext.js");
	oFF.SearchEngineCore.addInclude(headBuffer, "_17_io/combined/___17_io.js");
	oFF.SearchEngineCore.addInclude(headBuffer, "_18_io.native/combined/___18_io.native.js");
	oFF.SearchEngineCore.addInclude(headBuffer, "_20_runtime/combined/___20_runtime.js");
	oFF.SearchEngineCore.addInclude(headBuffer, "_29_commons/combined/___29_commons.js");
	oFF.SearchEngineCore.addInclude(headBuffer, "_310_ina.cache/combined/___310_ina.cache.js");
	oFF.SearchEngineCore.addInclude(headBuffer, "_30_olap.api/combined/___30_olap.api.js");
	oFF.SearchEngineCore.addInclude(headBuffer, "_30_olap.ext/combined/___30_olap.ext.js");
	oFF.SearchEngineCore.addInclude(headBuffer, "_30_olap.impl/combined/___30_olap.impl.js");
	oFF.SearchEngineCore.addInclude(headBuffer, "_31_olap.bw.ext.impl/combined/___31_olap.bw.ext.impl.js");
	oFF.SearchEngineCore.addInclude(headBuffer, "_32_olap.providers/combined/___32_olap.providers.js");
	oFF.SearchEngineCore.addInclude(headBuffer, "_32_olap.providers.ext/combined/___32_olap.providers.ext.js");
	oFF.SearchEngineCore.addInclude(headBuffer, "_08_core.tests/combined/___08_core.tests.js");
	oFF.SearchEngineCore.addInclude(headBuffer, "_19_io.native.tests/combined/___19_io.native.tests.js");
	oFF.SearchEngineCore.addInclude(headBuffer, "_20_tools/combined/___20_tools.js");
	oFF.SearchEngineCore.addInclude(headBuffer, "_20_runtime.tests/combined/___20_runtime.tests.js");
	oFF.SearchEngineCore.addInclude(headBuffer, "_30_olap.native.tests/combined/___30_olap.native.tests.js");
	oFF.SearchEngineCore.addInclude(headBuffer, "_30_olap.tests/combined/___30_olap.tests.js");
	oFF.SearchEngineCore.addInclude(headBuffer, "_30_olap.impl.tests/combined/___30_olap.impl.tests.js");
	oFF.SearchEngineCore.addInclude(headBuffer, "_32_olap.providers.tests/combined/___32_olap.providers.tests.js");
	headBuffer.appendNewLine();
	headBuffer.append("<script>").appendNewLine();
	headBuffer.appendNewLine();
	headBuffer.append("function initPage()").appendNewLine();
	headBuffer.append("{").appendNewLine();
	headBuffer.append("    var fragment = window.location.hash;").appendNewLine();
	headBuffer.append("    if( fragment !== null && oFF.XString.startsWith( fragment, \"#!\" ))").appendNewLine();
	headBuffer.append("    {").appendNewLine();
	headBuffer.append("        var fragmentQuery = oFF.XString.substring( fragment, 2, -1 );").appendNewLine();
	headBuffer.append("        var fragmentUri = oFF.XUri.createFromUri( oFF.XStringUtils.concatenate2( \"?\", fragmentQuery ) );").appendNewLine();
	headBuffer.append("        var queryMap = fragmentUri.getQueryMap();").appendNewLine();
	headBuffer.append("        var selectedSystem = queryMap.getByKey(\"sys\");").appendNewLine();
	headBuffer.append("        if( selectedSystem !== null )").appendNewLine();
	headBuffer.append("        {").appendNewLine();
	headBuffer.append("            var sysSel = document.getElementById(\"SystemSelect\");").appendNewLine();
	headBuffer.append("            sysSel.value=selectedSystem;").appendNewLine();
	headBuffer.append("        }").appendNewLine();
	headBuffer.append("    }").appendNewLine();
	headBuffer.append("}").appendNewLine();
	headBuffer.appendNewLine();
	headBuffer.append("function runTest()").appendNewLine();
	headBuffer.append("{").appendNewLine();
	headBuffer.append("    var selectedSystem = document.getElementById(\"SystemSelect\").value;").appendNewLine();
	headBuffer.append("    var selectedVariant = document.getElementById(\"VariantSelect\").value;").appendNewLine();
	headBuffer.append("    var user = document.getElementById(\"User\").value;").appendNewLine();
	headBuffer.append("    var pwd = document.getElementById(\"Pwd\").value;").appendNewLine();
	headBuffer.append("    document.getElementById(\"FireflyConsole\").innerHTML = \"\";").appendNewLine();
	headBuffer.append("    oFF.ProvidersTestModule.getInstance();").appendNewLine();
	headBuffer.append("    oFF.XEnvironment.getInstance().setVariable(oFF.XEnvironmentConstants.HTTP_DISPATCHER_URI, \"\\/systems\\/$protocol$\\/$host$\\/$port$$path$\");").appendNewLine();
	headBuffer.append("    oFF.XEnvironment.getInstance().setVariable(oFF.TestConstants.KEY_SYSTEM_LANDSCAPE_PROVIDER, \"SystemLandscapeForSerenity.json\");").appendNewLine();
	headBuffer.append("    oFF.this.m_globalSettings.EMBEDDED_WEBDISPATCHER = false;").appendNewLine();
	headBuffer.append("    if( selectedSystem === \"[Default]\" )").appendNewLine();
	headBuffer.append("        oFF.this.m_globalSettings.SYSTEMS = null;").appendNewLine();
	headBuffer.append("    else").appendNewLine();
	headBuffer.append("        oFF.this.m_globalSettings.SYSTEMS = selectedSystem;").appendNewLine();
	headBuffer.append("    if( selectedVariant === \"[All]\" )").appendNewLine();
	headBuffer.append("        oFF.this.m_globalSettings.OVERWRITE_TEST_NAMES = \"");
	headBuffer.append(testName);
	headBuffer.append("\";").appendNewLine();
	headBuffer.append("    else").appendNewLine();
	headBuffer.append("        oFF.this.m_globalSettings.OVERWRITE_TEST_NAMES = \"");
	headBuffer.append(testName);
	headBuffer.append(".\" + selectedVariant;").appendNewLine();
	headBuffer.append("    if( user !== null && user.trim().length > 0 )").appendNewLine();
	headBuffer.append("        oFF.this.m_globalSettings.OVERWRITE_SYSTEM_SETTINGS = \".USER='\" + user + \"';.PASSWORD='\" + pwd + \"'\";");
	headBuffer.appendNewLine();
	headBuffer.append("    oFF.XLogger.s_consoleDivName = \"FireflyConsole\";").appendNewLine();
	headBuffer.append("    oFF.ExecuteProvidersTests.main();").appendNewLine();
	headBuffer.append("}").appendNewLine();
	headBuffer.append("</script>").appendNewLine();
	bodyBuffer.append("<p/>");
	bodyBuffer.append("<table>");
	bodyBuffer.append("<tr>");
	var jsonVariants = testMetadata.getContent().getListByKey("Variants");
	bodyBuffer.append("<td>");
	if (oFF.notNull(jsonVariants) && jsonVariants.size() > 0)
	{
		bodyBuffer.append("Variant(s):&nbsp;");
		bodyBuffer.append("</td>");
		bodyBuffer.append("<td>");
		bodyBuffer.append("<select id=\"VariantSelect\" value=\"[All]\">");
		bodyBuffer.append("<option value=\"[All]\">All</option>");
		if (jsonVariants.size() > 1)
		{
			for (var i = 0; i < jsonVariants.size(); i++)
			{
				var jsonVar = jsonVariants.getStructureAt(i);
				bodyBuffer.append("<option value=\"");
				bodyBuffer.append(jsonVar.getStringByKey("Name"));
				bodyBuffer.append("\">");
				bodyBuffer.append(jsonVar.getStringByKey("Name"));
				bodyBuffer.append(" (");
				bodyBuffer.append(jsonVar.getStringByKey("TagSelection"));
				bodyBuffer.append(", ");
				bodyBuffer.appendInt(jsonVar.getIntegerByKey("VersionMin"));
				bodyBuffer.append(" ~ ");
				bodyBuffer.appendInt(jsonVar.getIntegerByKey("VersionMax"));
				bodyBuffer.append(")");
				bodyBuffer.append("</option>");
			}
		}
		bodyBuffer.append("</select>");
	}
	else
	{
		bodyBuffer.append("</td>");
		bodyBuffer.append("<td>");
	}
	bodyBuffer.append("</td>");
	bodyBuffer.append("<td>");
	bodyBuffer.append("&nbsp;System(s):&nbsp;");
	bodyBuffer.append("</td>");
	bodyBuffer.append("<td>");
	bodyBuffer.append("<select id=\"SystemSelect\" value=\"[Default]\">");
	var systemLandscape = this.getApplication().getSystemLandscape();
	var systemNames = systemLandscape.getSystemNames();
	var selectedSystems = oFF.XStringBuffer.create();
	var options = oFF.XStringBuffer.create();
	for (var k = 0; k < systemNames.size(); k++)
	{
		var systemName = systemNames.get(k);
		var systemDescription = systemLandscape.getSystemDescription(systemName);
		var isSelected = systemDescription.getProperties().getBooleanByKeyExt("ENABLE_TESTS", false);
		if (isSelected)
		{
			if (selectedSystems.length() > 0)
			{
				selectedSystems.append(",");
			}
			selectedSystems.append(systemName);
		}
		options.append("<option value=\"");
		options.append(systemName);
		options.append("\">");
		options.append(systemName);
		options.append("</option>");
	}
	bodyBuffer.append("<option value=\"[Default]\" selected=\"selected\">");
	bodyBuffer.append(selectedSystems.toString());
	bodyBuffer.append("</option>");
	bodyBuffer.append(options.toString());
	bodyBuffer.append("</select>");
	bodyBuffer.append("</td>");
	bodyBuffer.append("</tr>");
	bodyBuffer.append("<tr>");
	bodyBuffer.append("<td>");
	bodyBuffer.append("User:&nbsp;");
	bodyBuffer.append("</td>");
	bodyBuffer.append("<td>");
	bodyBuffer.append("<input id=\"User\" type=\"text\"/>");
	bodyBuffer.append("</td>");
	bodyBuffer.append("<td>");
	bodyBuffer.append("&nbsp;Pwd:&nbsp;");
	bodyBuffer.append("</td>");
	bodyBuffer.append("<td>");
	bodyBuffer.append("<input id=\"Pwd\" type=\"password\"/>");
	bodyBuffer.append("</td>");
	bodyBuffer.append("</tr>");
	bodyBuffer.append("<tr>");
	bodyBuffer.append("<td>");
	bodyBuffer.append("<button onclick=\"runTest()\">Run</button>");
	bodyBuffer.append("</td>");
	bodyBuffer.append("</tr>");
	bodyBuffer.append("</table>");
	bodyBuffer.append("<div id=\"FireflyConsole\"></div>");
	if (oFF.notNull(this.m_ffSdk))
	{
		var jsFile = this.m_ffSdk.newChild(oFF.XStringUtils.concatenate3("/targets/javascript/_30_olap.tests/singles/oFF.", testMetadata.getName(), ".js"));
		if (jsFile.isExisting() && jsFile.isFile())
		{
			var loadExt = jsFile.load();
			var stringContent = loadExt.getString();
			if (oFF.notNull(stringContent))
			{
				var escapedContent = oFF.XStringUtils.escapeHtml(stringContent);
				bodyBuffer.append("<div id=\"SourceJS\" ><pre>");
				bodyBuffer.append(escapedContent);
				bodyBuffer.append("</pre></div>");
			}
		}
	}
	return true;
};
oFF.SearchEngineCore.prototype.highlightText = function(content, searchTerms)
{
	var buffer = oFF.XStringBuffer.create();
	var offset = 0;
	while (true)
	{
		var nextIndex = -1;
		var nextSearchTerm = null;
		for (var i = 0; i < searchTerms.size(); i++)
		{
			var searchTerm = searchTerms.get(i);
			var index = oFF.XString.indexOfFrom(content, oFF.XStringUtils.concatenate2(".", searchTerm), offset);
			if (index !== -1 && (index < nextIndex || nextIndex === -1))
			{
				nextIndex = index;
				nextSearchTerm = searchTerm;
			}
		}
		if (nextIndex === -1)
		{
			break;
		}
		nextIndex = nextIndex + 1;
		buffer.append(oFF.XString.substring(content, offset, nextIndex));
		buffer.append("<mark>");
		var end = nextIndex + oFF.XString.size(nextSearchTerm);
		buffer.append(oFF.XString.substring(content, nextIndex, end));
		buffer.append("</mark>");
		offset = end;
	}
	buffer.append(oFF.XString.substring(content, offset, -1));
	return buffer.toString();
};

oFF.Triton = function() {};
oFF.Triton.prototype = new oFF.XObjectExt();
oFF.Triton.prototype._ff_c = "Triton";

oFF.Triton.PAGE_DOESNT_EXIST = 999999999;
oFF.Triton.create = function(storyId, sacUrl, webdispatcher)
{
	oFF.StudioUiModule.getInstance();
	var newObj = new oFF.Triton();
	newObj.setupExt(storyId, sacUrl, webdispatcher);
	return newObj;
};
oFF.Triton.prototype.m_storyId = null;
oFF.Triton.prototype.m_sacUrl = null;
oFF.Triton.prototype.m_tridentClientDict = null;
oFF.Triton.prototype.m_contentElementsDict = null;
oFF.Triton.prototype.m_orcaService = null;
oFF.Triton.prototype.m_application = null;
oFF.Triton.prototype.m_quasarStory = null;
oFF.Triton.prototype.setupExt = function(storyId, sacUrl, webdispatcher)
{
	this.m_tridentClientDict = oFF.XHashMapByString.create();
	this.m_contentElementsDict = oFF.XHashMapOfStringByString.create();
	this.m_storyId = storyId;
	this.m_sacUrl = sacUrl;
	var sysUri = oFF.XUri.createFromUrl(this.m_sacUrl);
	var process = oFF.DefaultSession.createWithVersion(0);
	process.getProxySettings().setWebdispatcherTemplate(webdispatcher);
	var applicationExt = oFF.ApplicationFactory.createApplicationExt2(oFF.SyncType.BLOCKING, null, null, null, process, 0, null, oFF.OcOrcaServiceConfig.ORCA_MASTER_SYSTEM_NAME, sysUri, null, oFF.ApplicationSystemOption.AUTO, false, null);
	this.m_application = applicationExt.getData();
	oFF.XObjectExt.release(applicationExt);
	var config = oFF.OcOrcaServiceConfig.create(this.m_application, oFF.OcOrcaServiceConfig.ORCA_MASTER_SYSTEM_NAME);
	config.processOrcaServiceCreation(oFF.SyncType.NON_BLOCKING, this, null);
};
oFF.Triton.prototype.embedWidget = function(containerId, widgetId)
{
	var elementId = oFF.XStringUtils.concatenate2("widget_", widgetId);
	var tempClient = this.createClient(elementId, containerId);
	if (oFF.notNull(tempClient) && oFF.notNull(this.m_quasarStory))
	{
		this.renderWidgetQuasarDocument(widgetId, tempClient);
	}
};
oFF.Triton.prototype.embedPage = function(containerId, pageIndex)
{
	var elementId = oFF.XStringUtils.concatenate2("page_", oFF.XInteger.convertToString(pageIndex));
	var tempClient = this.createClient(elementId, containerId);
	if (oFF.notNull(tempClient) && oFF.notNull(this.m_quasarStory))
	{
		this.renderPageQuasarDocument(pageIndex, tempClient);
	}
};
oFF.Triton.prototype.createClient = function(elementId, containerId)
{
	var tempClient;
	if (this.m_tridentClientDict.containsKey(containerId) === false)
	{
		tempClient = oFF.TridentClient.create(this.m_application.newSubApplication(null), null);
		tempClient.setNativeAnchorId(containerId);
		tempClient.setNativeAnchorObject(null);
		tempClient.runProgram();
		this.m_tridentClientDict.put(containerId, tempClient);
		this.m_contentElementsDict.put(containerId, elementId);
	}
	else
	{
		tempClient = this.m_tridentClientDict.getByKey(containerId);
		this.m_contentElementsDict.put(containerId, elementId);
	}
	if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_storyId) === false)
	{
		tempClient.showMessage("Missing story ID.");
		return null;
	}
	return tempClient;
};
oFF.Triton.prototype.renderWidgetQuasarDocument = function(widgetId, triClient)
{
	if (oFF.notNull(this.m_quasarStory) && oFF.notNull(widgetId) && oFF.XString.size(widgetId) > 0 && oFF.notNull(triClient))
	{
		var widgetDoc = this.m_quasarStory.getQuasarWidgetDocument(widgetId);
		if (oFF.isNull(widgetDoc))
		{
			triClient.showMessage(oFF.XStringUtils.concatenate2("Failed to create widget with ID: ", widgetId));
		}
		else
		{
			triClient.setContentByDocument(widgetDoc);
		}
	}
	else if (oFF.notNull(this.m_quasarStory))
	{
		var widgetIdList = this.m_quasarStory.getWidgetIdsByWidgetType(oFF.OcWidgetType.CHART);
		var logText = oFF.XStringUtils.concatenate2("Widget List: ", widgetIdList.toString());
		this.log(logText);
		if (oFF.notNull(triClient))
		{
			triClient.showMessage(logText);
		}
		oFF.XObjectExt.release(widgetIdList);
	}
	else if (oFF.notNull(triClient))
	{
		triClient.showMessage("Failed to create widget.");
	}
};
oFF.Triton.prototype.renderPageQuasarDocument = function(pageIndex, triClient)
{
	if (oFF.notNull(this.m_quasarStory) && oFF.notNull(triClient))
	{
		var pageContentList = this.m_quasarStory.getQuasarPageDocuments();
		if (oFF.notNull(pageContentList) && pageContentList.size() > 0 && pageContentList.size() > pageIndex)
		{
			triClient.setContentByDocument(pageContentList.get(pageIndex));
		}
		else if (oFF.notNull(pageContentList) && pageContentList.size() <= 0)
		{
			triClient.showMessage("The story has no content.");
		}
		else if (oFF.notNull(pageContentList) && pageContentList.size() <= pageIndex)
		{
			triClient.showMessage("The page with the specified index doesn't exist.");
		}
		if (oFF.notNull(pageContentList))
		{
			oFF.XObjectExt.release(pageContentList);
		}
	}
	else if (oFF.notNull(triClient) && oFF.isNull(this.m_quasarStory))
	{
		triClient.showMessage("Unknow error occured. Failed to load story.");
	}
	else if (oFF.notNull(triClient))
	{
		triClient.showMessage("Failed to create widget.");
	}
};
oFF.Triton.prototype.loadContent = function()
{
	if (oFF.notNull(this.m_quasarStory))
	{
		var containerIdsIterator = this.m_contentElementsDict.getKeysAsIteratorOfString();
		while (containerIdsIterator.hasNext())
		{
			var containerId = containerIdsIterator.next();
			var elementId = this.m_contentElementsDict.getByKey(containerId);
			var tempClient = this.m_tridentClientDict.getByKey(containerId);
			if (oFF.XStringUtils.containsString(elementId, "widget_", true))
			{
				var stringSizeWidget = oFF.XString.size(elementId);
				var widgetId = oFF.XString.substring(elementId, 7, stringSizeWidget);
				this.renderWidgetQuasarDocument(widgetId, tempClient);
			}
			else if (oFF.XStringUtils.containsString(elementId, "page_", true))
			{
				var stringSizePage = oFF.XString.size(elementId);
				var pageIndexStr = oFF.XString.substring(elementId, 5, stringSizePage);
				if (oFF.isNull(pageIndexStr) || oFF.XString.size(pageIndexStr) <= 0)
				{
					this.renderPageQuasarDocument(oFF.Triton.PAGE_DOESNT_EXIST, tempClient);
				}
				else
				{
					var pageIndex = oFF.XInteger.convertFromString(pageIndexStr);
					this.renderPageQuasarDocument(pageIndex, tempClient);
				}
			}
		}
	}
};
oFF.Triton.prototype.onOrcaServiceCreated = function(extResult, orcaService, customIdentifier)
{
	if (extResult.isValid())
	{
		this.log("#1 success logon");
		this.m_orcaService = orcaService;
		orcaService.processSystemLandscapeLoad(oFF.SyncType.NON_BLOCKING, this, null, null);
	}
	else
	{
		this.log("#1 failure logon");
		this.log(extResult.getSummary());
	}
};
oFF.Triton.prototype.onSystemsLoaded = function(extResult, systems, customIdentifier)
{
	if (extResult.isValid())
	{
		this.log("#2 success system loaded");
		var systemLandscape = this.m_application.getSystemLandscape();
		for (var i = 0; i < systems.size(); i++)
		{
			var systemDescription = systems.get(i);
			systemLandscape.setSystemByDescription(systemDescription);
		}
		this.m_orcaService.processStoryLoad(oFF.SyncType.NON_BLOCKING, this, null, this.m_storyId);
	}
	else
	{
		this.log("#2 failure system loaded");
		this.log(extResult.getSummary());
	}
};
oFF.Triton.prototype.onStoryLoaded = function(extResult, story, customIdentifier)
{
	if (extResult.isValid() && oFF.notNull(story))
	{
		this.log("#4 success story loaded");
		this.m_quasarStory = oFF.OcQuasarStory.create(story);
		this.m_quasarStory.setQuasarMainLayoutType(oFF.OcLayoutType.CANVAS);
		this.loadContent();
	}
	else
	{
		this.log("#4 failure story loaded");
		this.log(extResult.getSummary());
	}
};
oFF.Triton.prototype.releaseObject = function()
{
	this.m_tridentClientDict = oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this.m_tridentClientDict);
	this.m_contentElementsDict = oFF.XObjectExt.release(this.m_contentElementsDict);
	this.m_orcaService = oFF.XObjectExt.release(this.m_orcaService);
	this.m_application = oFF.XObjectExt.release(this.m_application);
	this.m_quasarStory = oFF.XObjectExt.release(this.m_quasarStory);
	oFF.XObjectExt.prototype.releaseObject.call( this );
};

oFF.MxGridMatrix = function() {};
oFF.MxGridMatrix.prototype = new oFF.XObjectExt();
oFF.MxGridMatrix.prototype._ff_c = "MxGridMatrix";

oFF.MxGridMatrix.INTERNAL_INITIAL = 0;
oFF.MxGridMatrix.staticSetup = function()
{
	oFF.MxGridMatrix.INTERNAL_INITIAL = -2;
};
oFF.MxGridMatrix.prototype.m_state = null;
oFF.MxGridMatrix.prototype.m_client = null;
oFF.MxGridMatrix.prototype.m_origin = null;
oFF.MxGridMatrix.prototype.m_rowLineCache = null;
oFF.MxGridMatrix.prototype.m_rowLine = 0;
oFF.MxGridMatrix.prototype.m_colLineCache = null;
oFF.MxGridMatrix.prototype.m_colLine = 0;
oFF.MxGridMatrix.prototype.m_width = 0;
oFF.MxGridMatrix.prototype.m_height = 0;
oFF.MxGridMatrix.prototype.m_fixedWidth = 0;
oFF.MxGridMatrix.prototype.m_fixedHeight = 0;
oFF.MxGridMatrix.prototype.m_errorMessage = null;
oFF.MxGridMatrix.prototype.m_hasErrorMessageApplied = false;
oFF.MxGridMatrix.prototype.setupExt = function(description, client, origin)
{
	this.m_state = oFF.MxGridState.UNINITIALIZED;
	this.m_client = client;
	this.setMatrix(origin);
};
oFF.MxGridMatrix.prototype.getMatrixState = function()
{
	return this.m_state;
};
oFF.MxGridMatrix.prototype.getMatrixClient = function()
{
	return this.m_client;
};
oFF.MxGridMatrix.prototype.prepareMatrix = function()
{
	var oldState = this.m_state;
	this.m_state = oFF.MxGridState.INITIALIZED;
	this.m_rowLineCache = null;
	this.m_rowLine = -1;
	this.m_colLineCache = null;
	this.m_colLine = -1;
	this.m_width = oFF.MxGridMatrix.INTERNAL_INITIAL;
	this.m_fixedWidth = oFF.MxGridMatrix.INTERNAL_INITIAL;
	this.m_height = oFF.MxGridMatrix.INTERNAL_INITIAL;
	this.m_fixedHeight = oFF.MxGridMatrix.INTERNAL_INITIAL;
	if (oFF.notNull(this.m_origin))
	{
		this.m_origin.prepareMatrix();
	}
	return oldState;
};
oFF.MxGridMatrix.prototype.setRunning = function()
{
	if (this.m_state === oFF.MxGridState.UNINITIALIZED)
	{
		throw oFF.XException.createIllegalStateException("Assertion: Switching into Running Mode without initialization");
	}
	this.m_state = oFF.MxGridState.RUNNING;
};
oFF.MxGridMatrix.prototype.setMatrix = function(origin)
{
	this.m_origin = origin;
};
oFF.MxGridMatrix.prototype.getMatrix = function()
{
	return this.m_origin;
};
oFF.MxGridMatrix.prototype.getErrorMessage = function()
{
	if (this.m_hasErrorMessageApplied)
	{
		return this.m_errorMessage;
	}
	else if (oFF.notNull(this.m_origin))
	{
		return this.m_origin.getErrorMessage();
	}
	else
	{
		return null;
	}
};
oFF.MxGridMatrix.prototype.setErrorMessage = function(errorMessage)
{
	this.m_errorMessage = errorMessage;
	this.m_hasErrorMessageApplied = true;
};
oFF.MxGridMatrix.prototype.getCell = function(x, y)
{
	if (oFF.isNull(this.m_origin))
	{
		throw oFF.XException.createIllegalStateException("Assertion: No origin matrix defined");
	}
	this.setRunning();
	return this.m_origin.getCell(x, y);
};
oFF.MxGridMatrix.prototype.getColumnCount = function()
{
	if (oFF.isNull(this.m_origin))
	{
		throw oFF.XException.createIllegalStateException("Assertion: No origin matrix defined");
	}
	this.setRunning();
	return this.m_origin.getColumnCount();
};
oFF.MxGridMatrix.prototype.getColumn = function(x)
{
	if (this.m_colLine !== x)
	{
		this.m_colLine = x;
		this.m_colLineCache = this.m_origin.getColumn(x);
	}
	this.setRunning();
	return this.m_colLineCache;
};
oFF.MxGridMatrix.prototype.getFixedColumnsCount = function()
{
	if (oFF.isNull(this.m_origin))
	{
		throw oFF.XException.createIllegalStateException("Assertion: No origin matrix defined");
	}
	this.setRunning();
	return this.m_origin.getFixedColumnsCount();
};
oFF.MxGridMatrix.prototype.getFixedRowsCount = function()
{
	if (oFF.isNull(this.m_origin))
	{
		throw oFF.XException.createIllegalStateException("Assertion: No origin matrix defined");
	}
	this.setRunning();
	return this.m_origin.getFixedRowsCount();
};
oFF.MxGridMatrix.prototype.getRow = function(y)
{
	if (this.m_rowLine !== y)
	{
		this.m_rowLine = y;
		this.m_rowLineCache = this.m_origin.getRow(y);
	}
	this.setRunning();
	return this.m_rowLineCache;
};
oFF.MxGridMatrix.prototype.getRowCount = function()
{
	if (oFF.isNull(this.m_origin))
	{
		throw oFF.XException.createIllegalStateException("Assertion: No origin matrix defined");
	}
	this.setRunning();
	return this.m_origin.getRowCount();
};
oFF.MxGridMatrix.prototype.getFixedColumnsWidth = function()
{
	return this.m_fixedWidth;
};
oFF.MxGridMatrix.prototype.getFixedRowsHeight = function()
{
	return this.m_fixedHeight;
};
oFF.MxGridMatrix.prototype.getHeight = function()
{
	return this.m_height;
};
oFF.MxGridMatrix.prototype.getWidth = function()
{
	return this.m_width;
};
oFF.MxGridMatrix.prototype.getDataGridAsJson = function()
{
	return null;
};
oFF.MxGridMatrix.prototype.getDimensionsMeasuresDataAsJson = function()
{
	return null;
};
oFF.MxGridMatrix.prototype.getDataAsJson = function()
{
	return null;
};
oFF.MxGridMatrix.prototype.getDimensionsAsJson = function()
{
	return null;
};
oFF.MxGridMatrix.prototype.getMeasuresAsJson = function()
{
	return null;
};
oFF.MxGridMatrix.prototype.getRowMaxHierarchyLevel = function(y)
{
	var rowMaxHierarchyLevel = 0;
	if (y < this.getFixedRowsCount())
	{
		var cell = null;
		var hierarchyLevel = 0;
		for (var x = this.getFixedColumnsCount(); x < this.getColumnCount(); x++)
		{
			cell = this.getCell(x, y);
			if (oFF.notNull(cell))
			{
				hierarchyLevel = cell.getHierarchyLevel();
				if (hierarchyLevel > rowMaxHierarchyLevel)
				{
					rowMaxHierarchyLevel = hierarchyLevel;
				}
			}
		}
	}
	return rowMaxHierarchyLevel;
};

oFF.SxTreeNodeInfo = function() {};
oFF.SxTreeNodeInfo.prototype = new oFF.DfNameObject();
oFF.SxTreeNodeInfo.prototype._ff_c = "SxTreeNodeInfo";

oFF.SxTreeNodeInfo.create = function(inaSpec, path)
{
	var newObj = new oFF.SxTreeNodeInfo();
	newObj._setupInternal(path);
	newObj.m_expanded = oFF.TriStateBool._DEFAULT;
	newObj.m_isEnabled = true;
	newObj.m_inaSpec = inaSpec;
	return newObj;
};
oFF.SxTreeNodeInfo.prototype.m_expanded = null;
oFF.SxTreeNodeInfo.prototype.m_isEnabled = false;
oFF.SxTreeNodeInfo.prototype.m_inaSpec = null;
oFF.SxTreeNodeInfo.prototype.isExpanded = function(defaultValue)
{
	if (this.m_expanded === oFF.TriStateBool._DEFAULT)
	{
		return defaultValue;
	}
	return this.m_expanded.getBoolean();
};
oFF.SxTreeNodeInfo.prototype.setIsExpanded = function(newValue)
{
	this.m_expanded = oFF.TriStateBool.lookup(newValue);
};
oFF.SxTreeNodeInfo.prototype.isEnabled = function()
{
	return this.m_isEnabled;
};
oFF.SxTreeNodeInfo.prototype.setIsEnabled = function(isEnabled)
{
	this.m_isEnabled = isEnabled;
};
oFF.SxTreeNodeInfo.prototype.getInASpec = function()
{
	return this.m_inaSpec;
};
oFF.SxTreeNodeInfo.prototype.setName = function(name)
{
	this.m_name = name;
};

oFF.FindRefsToken = function() {};
oFF.FindRefsToken.prototype = new oFF.DfNameObject();
oFF.FindRefsToken.prototype._ff_c = "FindRefsToken";

oFF.FindRefsToken.create = function(item, name, startPos, isAfterDot, isFireflyClass)
{
	var token = new oFF.FindRefsToken();
	token._setupInternal(name);
	token.m_startPos = startPos;
	token.m_item = item;
	token.m_isAfterDot = isAfterDot;
	token.m_isFireflyClass = isFireflyClass;
	return token;
};
oFF.FindRefsToken.prototype.m_startPos = 0;
oFF.FindRefsToken.prototype.m_item = null;
oFF.FindRefsToken.prototype.m_isAfterDot = false;
oFF.FindRefsToken.prototype.m_isFireflyClass = false;

oFF.UiMatrix = function() {};
oFF.UiMatrix.prototype = new oFF.MxGridMatrix();
oFF.UiMatrix.prototype._ff_c = "UiMatrix";

oFF.UiMatrix.DEFAULT_DIMENSION = "DefaultDimension";
oFF.UiMatrix.SEP_VERT_TOP = "/";
oFF.UiMatrix.SEP_VERT_BOTTOM = "~";
oFF.UiMatrix.SEP_VERT = ":";
oFF.UiMatrix.COLUMN = "|";
oFF.UiMatrix.ROW = "~";
oFF.UiMatrix.MAGIC_CELL_DIV = "/";
oFF.UiMatrix.LINEFEED = "\r\n";
oFF.UiMatrix.create = function(resultSet, pagingOffsetRows, pagingMaxRows, pagingOffsetColumns, pagingMaxColumns)
{
	var object = new oFF.UiMatrix();
	object.setupMatrix(resultSet, pagingOffsetRows, pagingMaxRows, pagingOffsetColumns, pagingMaxColumns);
	return object;
};
oFF.UiMatrix.update = function(uiMatrix, resultSet, pagingOffsetRows, pagingMaxRows, pagingOffsetColumns, pagingMaxColumns)
{
	uiMatrix.setupMatrix(resultSet, pagingOffsetRows, pagingMaxRows, pagingOffsetColumns, pagingMaxColumns);
	return uiMatrix;
};
oFF.UiMatrix.prototype.m_cells = null;
oFF.UiMatrix.prototype.m_columnDimensions = null;
oFF.UiMatrix.prototype.m_rowDimensions = null;
oFF.UiMatrix.prototype.m_resultSet = null;
oFF.UiMatrix.prototype.m_fixedWidth2 = 0;
oFF.UiMatrix.prototype.m_fixedHeight2 = 0;
oFF.UiMatrix.prototype.m_columnTotal = null;
oFF.UiMatrix.prototype.m_rowTotal = null;
oFF.UiMatrix.prototype.m_pagingOffsetRows = 0;
oFF.UiMatrix.prototype.m_pagingMaxRows = 0;
oFF.UiMatrix.prototype.m_pagingOffsetColumns = 0;
oFF.UiMatrix.prototype.m_pagingMaxColumns = 0;
oFF.UiMatrix.prototype.setupMatrix = function(resultSet, pagingOffsetRows, pagingMaxRows, pagingOffsetColumns, pagingMaxColumns)
{
	if (oFF.notNull(resultSet))
	{
		if (resultSet.getState() === oFF.ResultSetState.DATA_AVAILABLE)
		{
			var rowsAxis = resultSet.getRowsAxis();
			var columnsAxis = resultSet.getColumnsAxis();
			var rowAxisDataCount = rowsAxis.getDataCount();
			var rowAxisTuplesCount = rowsAxis.getTuplesCount();
			var rowAxisTuplesCountTotal = rowsAxis.getTuplesCountTotal();
			var columnAxisDataCount = columnsAxis.getDataCount();
			var columnAxisTuplesCount = columnsAxis.getTuplesCount();
			var columnAxisTuplesCountTotal = columnsAxis.getTuplesCountTotal();
			this.m_pagingOffsetRows = pagingOffsetRows;
			this.m_pagingMaxRows = rowAxisTuplesCount;
			if (this.m_pagingMaxRows === 0)
			{
				this.m_pagingMaxRows = 1;
			}
			this.m_pagingOffsetColumns = pagingOffsetColumns;
			this.m_pagingMaxColumns = columnAxisTuplesCount;
			if (this.m_pagingMaxColumns === 0)
			{
				this.m_pagingMaxColumns = 1;
			}
			var rea = rowsAxis.getEffectiveRsFields();
			var cea = columnsAxis.getEffectiveRsFields();
			var rea_c = rea.size();
			var cea_c = cea.size();
			if (rea_c === 0)
			{
				rea_c = 1;
			}
			if (cea_c === 0)
			{
				cea_c = 1;
			}
			if (pagingOffsetRows === 0 && pagingOffsetColumns === 0)
			{
				var dc = this.getMax(columnAxisDataCount, columnAxisTuplesCountTotal);
				var dr = this.getMax(rowAxisDataCount, rowAxisTuplesCountTotal);
				var totalColumns = rea_c + dc;
				var totalRows = cea_c + dr;
				this.m_cells = oFF.XArray2Dim.create(totalColumns, totalRows);
				this.m_fixedHeight2 = cea_c;
				this.m_fixedWidth2 = rea_c;
				this.m_columnTotal = oFF.XArrayOfInt.create(this.getColumnCount() - this.getFixedColumnsCount());
				this.m_rowTotal = oFF.XArrayOfInt.create(this.getRowCount() - this.getFixedRowsCount());
				this.m_columnDimensions = null;
				this.m_rowDimensions = null;
				this.m_resultSet = resultSet;
			}
			this.setHeaderCells(rowsAxis, cea_c, pagingOffsetRows, this.m_rowTotal, this.getFixedColumnsCount());
			this.setHeaderCells(columnsAxis, rea_c, pagingOffsetColumns, this.m_columnTotal, this.getFixedRowsCount());
			this.setDataCells(resultSet, rea_c, cea_c, pagingOffsetRows, pagingOffsetColumns);
			this.setTitleCells(rowsAxis, cea_c - 1);
			this.setTitleCells(columnsAxis, rea_c - 1);
		}
		else
		{
			this.m_cells = oFF.XArray2Dim.create(1, 1);
			var text = resultSet.getState().toString();
			var cell = oFF.UiMatrixCell.create(text, text, oFF.UiAlignment.BEGIN, oFF.UiSemanticCellStyle.TITLE, 0, 0, 0, 0, -1, null, false, null);
			this.m_cells.setByIndices(0, 0, cell);
		}
	}
};
oFF.UiMatrix.prototype.setDimensionsAndMeasures = function(columnsAxis, rowsAxis)
{
	var dimensions = rowsAxis.getRsDimensions();
	if (oFF.isNull(dimensions))
	{
		return;
	}
	if (oFF.notNull(this.m_columnDimensions) && oFF.notNull(this.m_rowDimensions))
	{
		return;
	}
	this.m_columnDimensions = oFF.XHashMapOfStringByString.create();
	this.m_rowDimensions = oFF.XHashMapOfStringByString.create();
	var i;
	for (i = 0; i < dimensions.size(); i++)
	{
		var rsDefDimension = dimensions.get(i);
		this.m_rowDimensions.put(rsDefDimension.getName(), rsDefDimension.getText());
	}
	dimensions = columnsAxis.getRsDimensions();
	for (i = 0; i < dimensions.size(); i++)
	{
		var rsDimension = dimensions.get(i);
		this.m_columnDimensions.put(rsDimension.getName(), rsDimension.getText());
	}
};
oFF.UiMatrix.prototype.setTitleCells = function(axis, offset)
{
	var type = axis.getType();
	var dimensions = axis.getRsDimensions();
	if (oFF.isNull(dimensions))
	{
		return;
	}
	var dimension;
	var position = 0;
	var name;
	var cell;
	var x;
	var y;
	for (var i = 0; i < dimensions.size(); i++)
	{
		dimension = axis.getQueryModel().getDimensionByName(dimensions.get(i).getName());
		var resultSetAttributes = dimension.getResultSetFields();
		for (var j = 0; j < resultSetAttributes.size(); j++)
		{
			var field = resultSetAttributes.getFieldAt(j);
			var buffer = oFF.XStringBuffer.create();
			if (dimension.isMeasureStructure())
			{
				if (j === 0)
				{
					buffer.append("Measures");
				}
			}
			else if (dimension.isStructure())
			{
				if (j === 0)
				{
					buffer.append("Structure");
				}
			}
			else
			{
				if (j === 0)
				{
					buffer.append(dimension.getText());
				}
				else
				{
					buffer.append(field.getText());
				}
			}
			var sortDirection = null;
			if (type === oFF.AxisType.ROWS)
			{
				sortDirection = field.getResultSetSorting().getDirection();
			}
			name = buffer.toString();
			var tupleElementIndex = position;
			if (type === oFF.AxisType.ROWS)
			{
				x = position;
				y = offset;
				cell = oFF.UiMatrixCell.create(name, name, oFF.UiAlignment.BEGIN, oFF.UiSemanticCellStyle.TITLE, x, y, 0, tupleElementIndex, -1, null, false, sortDirection);
				this.m_cells.setByIndices(position, offset, cell);
			}
			else
			{
				var existingCell = this.m_cells.getByIndices(offset, position);
				if (oFF.notNull(existingCell))
				{
					var magicCellBuffer = oFF.XStringBuffer.create();
					magicCellBuffer.append(existingCell.toString());
					magicCellBuffer.append(oFF.UiMatrix.MAGIC_CELL_DIV);
					magicCellBuffer.append(name);
					name = magicCellBuffer.toString();
					tupleElementIndex = existingCell.getTupleElementIndex();
					sortDirection = existingCell.getSortDirection();
				}
				x = offset;
				y = position;
				cell = oFF.UiMatrixCell.create(name, name, oFF.UiAlignment.BEGIN, oFF.UiSemanticCellStyle.TITLE, x, y, 0, tupleElementIndex, -1, null, false, sortDirection);
				this.m_cells.setByIndices(offset, position, cell);
			}
			position++;
		}
	}
};
oFF.UiMatrix.prototype.setDataCells = function(resultSet, offsetX, offsetY, pagingOffsetRows, pagingOffsetColumns)
{
	var dc = resultSet.getDataColumns();
	var dr = resultSet.getDataRows();
	var dataCell;
	var formattedValue;
	var value;
	var cell;
	var valueException;
	var startY = 0;
	var endY = startY + dr;
	var startX = 0;
	var endX = startX + dc;
	for (var y = startY; y < endY; y++)
	{
		for (var x = startX; x < endX; x++)
		{
			dataCell = resultSet.getDataCell(x, y);
			valueException = dataCell.getValueException();
			if (valueException === oFF.ValueException.NORMAL)
			{
				formattedValue = dataCell.getFormattedValue();
			}
			else if (valueException === oFF.ValueException.NULL_VALUE)
			{
				formattedValue = "";
			}
			else if (valueException === oFF.ValueException.ZERO)
			{
				formattedValue = "0";
			}
			else if (valueException === oFF.ValueException.MIXED_CURRENCIES_OR_UNITS)
			{
				formattedValue = dataCell.getFormattedValue();
			}
			else if (valueException === oFF.ValueException.UNDEFINED)
			{
				formattedValue = "";
			}
			else
			{
				formattedValue = valueException.getName();
			}
			if (dataCell.getValueType() === oFF.XValueType.STRING)
			{
				value = formattedValue;
			}
			else
			{
				value = dataCell.getStringRepresentation();
			}
			var semanticCellStyle = oFF.UiSemanticCellStyle.STANDARD;
			if (this.m_rowTotal.get(y + pagingOffsetRows) === 1 || this.m_columnTotal.get(x + pagingOffsetColumns) === 1)
			{
				semanticCellStyle = oFF.UiSemanticCellStyle.TOTAL;
			}
			cell = oFF.UiMatrixCell.create(formattedValue, value, oFF.UiAlignment.END, semanticCellStyle, x + offsetX + pagingOffsetColumns, y + offsetY + pagingOffsetRows, 0, 0, -1, null, dataCell.isDataEntryEnabled(), null);
			this.m_cells.setByIndices(x + offsetX + pagingOffsetColumns, y + offsetY + pagingOffsetRows, cell);
		}
	}
};
oFF.UiMatrix.prototype.setHeaderCells = function(axis, tupleOffset, pagingOffset, axisTotal, fixedCount)
{
	var formattedValue = null;
	var cell;
	var type = axis.getType();
	var tuple;
	var position;
	var element;
	var dimensionMember;
	var fieldValues;
	var fieldValue;
	var drillState;
	var displayLevel;
	var tuplesCount = axis.getTuplesCount();
	var tupleSize;
	var fieldCount;
	var hierarchyLevel;
	var genericDrillState;
	var isDataEntryEnabled;
	var isTotal;
	var formattedValues = oFF.XArrayOfString.create(fixedCount);
	var offset = tupleOffset + pagingOffset;
	var start = 0;
	var end = start + tuplesCount;
	for (var tupleIndex = start; tupleIndex < end; tupleIndex++)
	{
		tuple = axis.getTupleAt(tupleIndex);
		position = 0;
		tupleSize = tuple.size();
		isTotal = false;
		for (var tupleElementIndex = 0; tupleElementIndex < tupleSize; tupleElementIndex++)
		{
			element = tuple.get(tupleElementIndex);
			if (element.getFirstTuple() === tuple)
			{
				drillState = element.getDrillState();
				displayLevel = element.getDisplayLevel();
				dimensionMember = element.getDimensionMember();
				hierarchyLevel = displayLevel;
				if (drillState === oFF.DrillState.COLLAPSED)
				{
					genericDrillState = oFF.UiDrillState.COLLAPSED;
				}
				else if (drillState === oFF.DrillState.EXPANDED)
				{
					genericDrillState = oFF.UiDrillState.EXPANDED;
				}
				else if (drillState === oFF.DrillState.LEAF)
				{
					if (hierarchyLevel === 0)
					{
						hierarchyLevel = -1;
					}
					genericDrillState = oFF.UiDrillState.LEAF;
				}
				else
				{
					hierarchyLevel = -1;
					genericDrillState = null;
				}
				isDataEntryEnabled = false;
				var sortDirection = null;
				if (type === oFF.AxisType.COLUMNS)
				{
					if (tupleElementIndex === tupleSize - 1)
					{
						if (element.getDimension().isMeasureStructure() === false)
						{
							sortDirection = element.getDimension().getResultSetSorting().getDirection();
						}
						else
						{
							var structure = element.getDimension();
							var structureMembers = structure.getAllStructureMembers();
							var structureMember = structureMembers.get(oFF.XMath.mod(tupleIndex, structureMembers.size()));
							sortDirection = structureMember.getQueryModel().getSortingManager().getMeasureSorting(structureMember, true).getDirection();
						}
					}
				}
				if (dimensionMember.getMemberType().isResult())
				{
					isTotal = true;
					axisTotal.set(tupleIndex + pagingOffset, 1);
					formattedValue = "[Totals]";
					fieldCount = dimensionMember.getDimension().getResultSetFields().size();
					if (type === oFF.AxisType.ROWS)
					{
						cell = oFF.UiMatrixCell.create(formattedValue, formattedValue, oFF.UiAlignment.BEGIN, oFF.UiSemanticCellStyle.TOTAL, position, tupleIndex + offset, tupleIndex, tupleElementIndex, hierarchyLevel, genericDrillState, isDataEntryEnabled, sortDirection);
						this.setCellByIndices(tupleIndex === start, type, position, tupleIndex + offset, cell);
					}
					else
					{
						cell = oFF.UiMatrixCell.create(formattedValue, formattedValue, oFF.UiAlignment.BEGIN, oFF.UiSemanticCellStyle.TOTAL, tupleIndex + offset, position, tupleIndex, tupleElementIndex, hierarchyLevel, genericDrillState, isDataEntryEnabled, sortDirection);
						this.setCellByIndices(tupleIndex === start, type, tupleIndex + offset, position, cell);
					}
					formattedValues.set(position, formattedValue);
					position = position + fieldCount - 1;
				}
				else
				{
					fieldValues = dimensionMember.getResultSetFieldValues();
					fieldCount = fieldValues.size();
					for (var attributeIndex = 0; attributeIndex < fieldCount; attributeIndex++)
					{
						fieldValue = fieldValues.get(attributeIndex);
						if (oFF.notNull(fieldValue))
						{
							formattedValue = fieldValue.getFormattedValue();
						}
						else
						{
							formattedValue = "[null]";
						}
						if (type === oFF.AxisType.ROWS)
						{
							cell = oFF.UiMatrixCell.create(formattedValue, formattedValue, oFF.UiAlignment.BEGIN, oFF.UiSemanticCellStyle.HEADER, position, tupleIndex + offset, tupleIndex, tupleElementIndex, hierarchyLevel, genericDrillState, isDataEntryEnabled, sortDirection);
							this.setCellByIndices(tupleIndex === start, type, position, tupleIndex + offset, cell);
						}
						else
						{
							cell = oFF.UiMatrixCell.create(formattedValue, formattedValue, oFF.UiAlignment.BEGIN, oFF.UiSemanticCellStyle.HEADER, tupleIndex + offset, position, tupleIndex, tupleElementIndex, hierarchyLevel, genericDrillState, isDataEntryEnabled, sortDirection);
							this.setCellByIndices(tupleIndex === start, type, tupleIndex + offset, position, cell);
						}
						formattedValues.set(position, formattedValue);
						position++;
						if (attributeIndex === 0)
						{
							hierarchyLevel = -1;
							genericDrillState = oFF.UiDrillState.LEAF;
						}
					}
				}
			}
			else
			{
				var semanticCellStyle = oFF.UiSemanticCellStyle.HEADER;
				if (isTotal)
				{
					semanticCellStyle = oFF.UiSemanticCellStyle.TOTAL;
				}
				if (type === oFF.AxisType.ROWS)
				{
					cell = oFF.UiMatrixCell.create(null, formattedValues.get(position), oFF.UiAlignment.BEGIN, semanticCellStyle, position, tupleIndex + offset, tupleIndex, tupleElementIndex, 0, null, false, null);
					this.setCellByIndices(tupleIndex === start, type, position, tupleIndex + offset, cell);
				}
				else
				{
					cell = oFF.UiMatrixCell.create(null, formattedValues.get(position), oFF.UiAlignment.BEGIN, semanticCellStyle, tupleIndex + offset, position, tupleIndex, tupleElementIndex, 0, null, false, null);
					this.setCellByIndices(tupleIndex === start, type, tupleIndex + offset, position, cell);
				}
				dimensionMember = element.getDimensionMember();
				fieldCount = dimensionMember.getDimension().getResultSetFields().size();
				position = position + fieldCount;
			}
		}
	}
	if (tuplesCount === 0)
	{
		cell = oFF.UiMatrixCell.create("", "", oFF.UiAlignment.BEGIN, oFF.UiSemanticCellStyle.HEADER, 0, offset, 0, 0, 0, null, false, null);
		if (type === oFF.AxisType.ROWS)
		{
			this.m_cells.setByIndices(0, offset, cell);
		}
		else
		{
			this.m_cells.setByIndices(offset, 0, cell);
		}
	}
};
oFF.UiMatrix.prototype.setCellByIndices = function(checkSpan, axisType, index0, index1, cell)
{
	if (checkSpan)
	{
		var value = cell.getValue();
		if (axisType === oFF.AxisType.ROWS)
		{
			if (index1 > 0)
			{
				var otherRowCell = this.m_cells.getByIndices(index0, index1 - 1);
				if (oFF.notNull(otherRowCell))
				{
					var otherRowValue = otherRowCell.getValue();
					if (oFF.notNull(value) && oFF.notNull(otherRowValue) && oFF.XString.isEqual(value, otherRowValue))
					{
						cell.setText(null);
					}
				}
			}
		}
		else
		{
			if (index0 > 0)
			{
				var otherColumnCell = this.m_cells.getByIndices(index0 - 1, index1);
				if (oFF.notNull(otherColumnCell))
				{
					var otherColumnValue = otherColumnCell.getValue();
					if (oFF.notNull(value) && oFF.notNull(otherColumnValue) && oFF.XString.isEqual(value, otherColumnValue))
					{
						cell.setText(null);
					}
				}
			}
		}
	}
	this.m_cells.setByIndices(index0, index1, cell);
};
oFF.UiMatrix.prototype.getColumnCount = function()
{
	if (oFF.isNull(this.m_cells))
	{
		return 0;
	}
	return this.m_cells.size0();
};
oFF.UiMatrix.prototype.getRowCount = function()
{
	if (oFF.isNull(this.m_cells))
	{
		return 0;
	}
	return this.m_cells.size1();
};
oFF.UiMatrix.prototype.getFixedColumnsCount = function()
{
	return this.m_fixedWidth2;
};
oFF.UiMatrix.prototype.getFixedRowsCount = function()
{
	return this.m_fixedHeight2;
};
oFF.UiMatrix.prototype.getColumnMaxCharacters = function(column)
{
	var rowCount = this.m_cells.size1();
	var max = 0;
	var cell;
	var c;
	for (var row = 0; row < rowCount; row++)
	{
		cell = this.m_cells.getByIndices(column, row);
		if (oFF.notNull(cell))
		{
			c = this.getCharacterCount(cell);
			if (c > max)
			{
				max = c;
			}
		}
	}
	return max;
};
oFF.UiMatrix.prototype.getSimpleCell = function(column, row)
{
	return this.m_cells.getByIndices(column, row);
};
oFF.UiMatrix.prototype.getUiMatrixCell = function(x, y)
{
	var cell = this.m_cells.getByIndices(x, y);
	if (oFF.notNull(cell))
	{
		var columnIndex = cell.getColumnIndex();
		var rowIndex = cell.getRowIndex();
		if (x !== columnIndex || y !== rowIndex)
		{
			this.log4("UiMatrix.getUiMatrixCell column/row error ", oFF.XInteger.convertToString(x), "/", oFF.XInteger.convertToString(y));
			cell = this.m_cells.getByIndices(x, y);
		}
	}
	if (oFF.isNull(cell))
	{
		var text = "...";
		var semanticCellStyle = oFF.UiSemanticCellStyle.STANDARD;
		if (y < this.getFixedRowsCount())
		{
			semanticCellStyle = oFF.UiSemanticCellStyle.HEADER;
			if (x >= this.getFixedColumnsCount())
			{
				if (this.m_columnTotal.get(x - this.getFixedColumnsCount()) === 1)
				{
					semanticCellStyle = oFF.UiSemanticCellStyle.TOTAL;
				}
			}
		}
		else
		{
			if (x < this.getFixedColumnsCount())
			{
				semanticCellStyle = oFF.UiSemanticCellStyle.HEADER;
				if (this.m_rowTotal.get(y - this.getFixedRowsCount()) === 1)
				{
					semanticCellStyle = oFF.UiSemanticCellStyle.TOTAL;
				}
			}
		}
		cell = oFF.UiMatrixCell.create(text, text, oFF.UiAlignment.BEGIN, semanticCellStyle, x, y, 0, 0, 0, null, false, null);
	}
	return cell;
};
oFF.UiMatrix.prototype.getCell = function(x, y)
{
	return this.getUiMatrixCell(x, y);
};
oFF.UiMatrix.prototype.exportToAscii = function(maxCellSize)
{
	var buffer = oFF.XStringBuffer.create();
	var colCount = this.m_cells.size0();
	var rowCount = this.m_cells.size1();
	var columns = oFF.XArrayOfInt.create(colCount);
	var max;
	for (var i = 0; i < colCount; i++)
	{
		max = this.getColumnMaxCharacters(i);
		if (maxCellSize !== -1 && max > maxCellSize)
		{
			max = maxCellSize;
		}
		columns.set(i, max);
	}
	var cell;
	var x;
	var y;
	var z;
	var charCount;
	var rest;
	for (y = 0; y < rowCount; y++)
	{
		if (y > 0)
		{
			buffer.append(oFF.UiMatrix.LINEFEED);
		}
		if (y === this.m_fixedHeight2)
		{
			this.renderLine(buffer, columns, oFF.UiMatrix.SEP_VERT_TOP);
			buffer.append(oFF.UiMatrix.LINEFEED);
		}
		for (x = 0; x < colCount; x++)
		{
			if (x > 0)
			{
				if (x === this.m_fixedWidth2)
				{
					buffer.append(oFF.UiMatrix.SEP_VERT);
				}
				else
				{
					buffer.append(oFF.UiMatrix.COLUMN);
				}
			}
			cell = this.m_cells.getByIndices(x, y);
			rest = columns.get(x);
			if (oFF.notNull(cell))
			{
				charCount = this.getCharacterCount(cell);
				if (charCount > rest)
				{
					charCount = rest;
				}
				rest = rest - charCount;
				if (cell.getHorizontalAlign() === oFF.UiAlignment.BEGIN)
				{
					buffer.append(this.getText(cell, charCount));
					for (z = 0; z < rest; z++)
					{
						buffer.append(" ");
					}
				}
				else
				{
					for (z = 0; z < rest; z++)
					{
						buffer.append(" ");
					}
					buffer.append(this.getText(cell, charCount));
				}
			}
			else
			{
				for (z = 0; z < rest; z++)
				{
					buffer.append(" ");
				}
			}
		}
	}
	if (rowCount > 0)
	{
		buffer.append(oFF.UiMatrix.LINEFEED);
		this.renderLine(buffer, columns, oFF.UiMatrix.SEP_VERT_BOTTOM);
	}
	return buffer.toString();
};
oFF.UiMatrix.prototype.renderLine = function(buffer, columns, verticalSeparator)
{
	var rest;
	var z;
	var colCount = columns.size();
	for (var x = 0; x < colCount; x++)
	{
		rest = columns.get(x);
		if (x > 0)
		{
			if (x === this.m_fixedWidth2)
			{
				buffer.append(verticalSeparator);
			}
			else
			{
				buffer.append(oFF.UiMatrix.ROW);
			}
		}
		for (z = 0; z < rest; z++)
		{
			buffer.append(oFF.UiMatrix.ROW);
		}
	}
};
oFF.UiMatrix.prototype.exportToHtml = function()
{
	return null;
};
oFF.UiMatrix.prototype.getMax = function(value1, value2)
{
	var returnValue = value1;
	if (returnValue < value2)
	{
		returnValue = value2;
	}
	return returnValue;
};
oFF.UiMatrix.prototype.getDimensionsMeasuresDataAsJson = function()
{
	var json = oFF.XStringBuffer.create();
	json.append("[");
	try
	{
		json.append(this.getDimensionsAsJson());
		json.append(",\r\n");
		json.append(this.getMeasuresAsJson());
		json.append(",\r\n");
		json.append(this.getDataAsJson());
		json.append("]");
	}
	catch (e)
	{
		oFF.XLogger.println("Exception thrown during RsMatrix.getDataAsJson creation");
		if (oFF.XException.supportsStackTrace())
		{
			oFF.XLogger.println(oFF.XException.getStackTrace(e, 0));
		}
		json = oFF.XStringBuffer.create();
		json.append("[]");
	}
	return json.toString();
};
oFF.UiMatrix.prototype.getDataAsJson = function()
{
	var json = oFF.XStringBuffer.create();
	json.append("[");
	var row;
	var column;
	this.setDimensionsAndMeasures(this.m_resultSet.getColumnsAxis(), this.m_resultSet.getRowsAxis());
	var dataColumns = this.m_resultSet.getDataColumns();
	var dataRows = this.m_resultSet.getDataRows();
	if (dataColumns > this.m_resultSet.getColumnsAxis().getTuplesCount())
	{
		dataColumns = this.m_resultSet.getColumnsAxis().getTuplesCount();
	}
	if (dataRows > this.m_resultSet.getRowsAxis().getTuplesCount())
	{
		dataRows = this.m_resultSet.getRowsAxis().getTuplesCount();
	}
	var dimensions = this.m_rowDimensions.size();
	var dataCell;
	var key;
	var value;
	var tuple;
	var tupleElement;
	var tupleElementIndex;
	var tupleSize;
	var firstRow = true;
	var firstColumn = true;
	var rowElementsCount = this.m_resultSet.getRowsAxis().getTupleElementsCount();
	var columnElementsCount = this.m_resultSet.getColumnsAxis().getTupleElementsCount();
	var measuresKeysTest = oFF.XListOfString.create();
	for (column = 0; column < dataColumns; column++)
	{
		if (columnElementsCount > 0)
		{
			tuple = this.m_resultSet.getColumnsAxis().getTupleAt(column);
			tupleSize = tuple.size();
			var measureKey = oFF.XStringBuffer.create();
			for (tupleElementIndex = 0; tupleElementIndex < tupleSize; tupleElementIndex++)
			{
				tupleElement = tuple.get(tupleElementIndex);
				key = tupleElement.getDimensionMember().getName();
				if (tupleElementIndex !== 0)
				{
					measureKey.append(".");
				}
				measureKey.append(key);
			}
			measuresKeysTest.add(measureKey.toString());
		}
	}
	for (row = 0; row < dataRows; row++)
	{
		if (firstRow)
		{
			firstRow = false;
		}
		else
		{
			json.append(",\r\n");
		}
		firstColumn = true;
		json.append("{");
		if (rowElementsCount > 0)
		{
			tuple = this.m_resultSet.getRowsAxis().getTupleAt(row);
			tupleSize = tuple.size();
			for (tupleElementIndex = 0; tupleElementIndex < tupleSize; tupleElementIndex++)
			{
				if (firstColumn)
				{
					firstColumn = false;
				}
				else
				{
					json.append(", ");
				}
				tupleElement = tuple.get(tupleElementIndex);
				key = tupleElement.getDimension().getName();
				value = tupleElement.getDimensionMember().getText();
				json.append("\"");
				json.append(key);
				json.append("\":\"");
				json.append(value);
				json.append("\"");
				dimensions++;
			}
		}
		for (column = 0; column < dataColumns; column++)
		{
			if (dimensions > 0 || column > 0)
			{
				json.append(", ");
			}
			if (measuresKeysTest.size() === 0)
			{
				key = oFF.UiMatrix.DEFAULT_DIMENSION;
			}
			else
			{
				key = measuresKeysTest.get(column);
			}
			dataCell = this.m_resultSet.getDataCell(column, row);
			value = oFF.XDouble.convertToString(dataCell.getDouble());
			json.append("\"");
			json.append(key);
			json.append("\":");
			json.append(value);
		}
		json.append("}");
	}
	json.append("]");
	return json.toString();
};
oFF.UiMatrix.prototype.getDimensionsAsJson = function()
{
	this.setDimensionsAndMeasures(this.m_resultSet.getColumnsAxis(), this.m_resultSet.getRowsAxis());
	var json = oFF.XStringBuffer.create();
	json.append("[");
	var firstRow = true;
	var keys;
	var key;
	var value;
	var i;
	firstRow = true;
	if (oFF.notNull(this.m_rowDimensions) && this.m_rowDimensions.size() > 0)
	{
		keys = this.m_rowDimensions.getKeysAsReadOnlyListOfString();
		for (i = 0; i < keys.size(); i++)
		{
			if (firstRow)
			{
				firstRow = false;
			}
			else
			{
				json.append(",\r\n");
			}
			key = keys.get(i);
			value = this.m_rowDimensions.getByKey(key);
			json.append("{ \"axis\": 1, \"name\": \"");
			json.append(value);
			json.append("\", \"value\": \"{");
			json.append(keys.get(i));
			json.append("}\" }");
		}
	}
	else
	{
		json.append("{ \"axis\": 1, \"value\": \"{}\" }");
	}
	json.append("]");
	return json.toString();
};
oFF.UiMatrix.prototype.getMeasuresAsJson = function()
{
	var json = oFF.XStringBuffer.create();
	json.append("[");
	var firstRow = true;
	var key;
	var value;
	var column;
	var tupleSize;
	var tupleElementIndex;
	var tuple;
	var tupleElement;
	var dataColumns = this.m_resultSet.getDataColumns();
	if (dataColumns > this.m_resultSet.getColumnsAxis().getTuplesCount())
	{
		dataColumns = this.m_resultSet.getColumnsAxis().getTuplesCount();
	}
	var columnElementsCount = this.m_resultSet.getColumnsAxis().getTupleElementsCount();
	for (column = 0; column < dataColumns; column++)
	{
		if (columnElementsCount > 0)
		{
			tuple = this.m_resultSet.getColumnsAxis().getTupleAt(column);
			tupleSize = tuple.size();
			var measureKey = oFF.XStringBuffer.create();
			var measureValue = oFF.XStringBuffer.create();
			for (tupleElementIndex = 0; tupleElementIndex < tupleSize; tupleElementIndex++)
			{
				tupleElement = tuple.get(tupleElementIndex);
				key = tupleElement.getDimensionMember().getName();
				value = tupleElement.getDimensionMember().getText();
				if (tupleElementIndex !== 0)
				{
					measureKey.append(".");
					measureValue.append(".");
				}
				measureKey.append(key);
				measureValue.append(value);
			}
			if (firstRow)
			{
				firstRow = false;
			}
			else
			{
				json.append(",\r\n");
			}
			json.append("{ \"name\": \"");
			json.append(measureValue.toString());
			json.append("\", \"value\": \"{");
			json.append(measureKey.toString());
			json.append("}\" }");
		}
		else
		{
			json.append("{ \"name\": \"\", \"value\": \"{");
			json.append(oFF.UiMatrix.DEFAULT_DIMENSION);
			json.append("}\" }");
		}
	}
	json.append("]");
	return json.toString();
};
oFF.UiMatrix.prototype.getDataGridAsJson = function()
{
	var json = oFF.XStringBuffer.create();
	json.append("[");
	var cell;
	var value;
	var firstRow = true;
	var row;
	var column;
	var rowTotal;
	var isHeader;
	var isDataEntryEnabled;
	var isTotal;
	var drillState;
	var hierarchyLevel;
	var tupleElementIndex;
	try
	{
		for (row = this.getFixedRowsCount(); row < this.getRowCount(); row++)
		{
			rowTotal = false;
			if (firstRow)
			{
				firstRow = false;
			}
			else
			{
				json.append(",\r\n");
			}
			json.append("{\"r\": \"");
			json.append(oFF.XInteger.convertToString(row));
			json.append("\"");
			for (column = 0; column < this.getColumnCount(); column++)
			{
				json.append(", ");
				json.append("\"c");
				json.append(oFF.XInteger.convertToString(column));
				json.append("\": \"");
				isHeader = " ";
				isDataEntryEnabled = " ";
				isTotal = " ";
				drillState = " ";
				hierarchyLevel = "0";
				tupleElementIndex = "";
				cell = this.getCell(column, row);
				if (oFF.notNull(cell))
				{
					value = cell.getString();
					if (oFF.notNull(value))
					{
						value = oFF.XString.replace(value, "\"", "");
						json.append(value);
					}
					if (cell.isDataEntryEnabled())
					{
						isDataEntryEnabled = "X";
					}
					var genericDrillState = cell.getDrillState();
					if (oFF.notNull(genericDrillState))
					{
						drillState = cell.getDrillState().getDisplayName();
					}
					hierarchyLevel = oFF.XInteger.convertToString(cell.getHierarchyLevel());
					tupleElementIndex = oFF.XInteger.convertToString(cell.getTupleElementIndex());
				}
				json.append("\", \"i");
				json.append(oFF.XInteger.convertToString(column));
				json.append("\": \"");
				if (column < this.getFixedColumnsCount())
				{
					isHeader = "H";
				}
				if (oFF.notNull(cell) && cell.getSemanticCellStyle() === oFF.UiSemanticCellStyle.TOTAL || rowTotal)
				{
					rowTotal = true;
					isTotal = "T";
				}
				if (this.m_columnTotal.get(column) === 1)
				{
					isTotal = "T";
				}
				json.append(isHeader);
				json.append(isTotal);
				json.append(isDataEntryEnabled);
				json.append(drillState);
				json.append(hierarchyLevel);
				json.append(";");
				json.append(tupleElementIndex);
				json.append("\"");
			}
			json.append("}");
		}
		json.append("]");
	}
	catch (e)
	{
		oFF.XLogger.println("Exception thrown during JSON creation");
		if (oFF.XException.supportsStackTrace())
		{
			oFF.XLogger.println(oFF.XException.getStackTrace(e, 0));
		}
		throw oFF.XException.createRuntimeException("Exception thrown during JSON creation");
	}
	return json.toString();
};
oFF.UiMatrix.prototype.getCharacterCount = function(cell)
{
	var text = cell.getText();
	if (oFF.isNull(text))
	{
		return 0;
	}
	return oFF.XString.size(text);
};
oFF.UiMatrix.prototype.getText = function(cell, max)
{
	var text = cell.getText();
	if (oFF.isNull(text))
	{
		return "";
	}
	if (oFF.XString.size(text) > max)
	{
		return oFF.XString.substring(text, 0, max);
	}
	return text;
};
oFF.UiMatrix.prototype.getPagingOffsetRows = function()
{
	return this.m_pagingOffsetRows;
};
oFF.UiMatrix.prototype.getPagingOffsetColumns = function()
{
	return this.m_pagingOffsetColumns;
};
oFF.UiMatrix.prototype.getPagingMaxRows = function()
{
	return this.m_pagingMaxRows;
};
oFF.UiMatrix.prototype.getPagingMaxColumns = function()
{
	return this.m_pagingMaxColumns;
};
oFF.UiMatrix.prototype.toString = function()
{
	var stringBuffer = oFF.XStringBuffer.create();
	if (oFF.notNull(this.m_cells))
	{
		stringBuffer.append(this.m_cells.toString());
	}
	return stringBuffer.toString();
};

oFF.VirtualMatrix = function() {};
oFF.VirtualMatrix.prototype = new oFF.MxGridMatrix();
oFF.VirtualMatrix.prototype._ff_c = "VirtualMatrix";

oFF.VirtualMatrix.prototype.m_cellFactory = null;
oFF.VirtualMatrix.prototype.getPivotCell = function(x, y)
{
	return this.getCell(x, y);
};
oFF.VirtualMatrix.prototype.getPivotColumn = function(x)
{
	return this.getColumn(x);
};
oFF.VirtualMatrix.prototype.getPivotRow = function(y)
{
	return this.getRow(y);
};
oFF.VirtualMatrix.prototype.getCellFactory = function()
{
	return this.m_cellFactory;
};
oFF.VirtualMatrix.prototype.setCellFactory = function(cellFactory)
{
	this.m_cellFactory = cellFactory;
};

oFF.VirtualMatrixUiConverter = function() {};
oFF.VirtualMatrixUiConverter.prototype = new oFF.MxGridMatrix();
oFF.VirtualMatrixUiConverter.prototype._ff_c = "VirtualMatrixUiConverter";

oFF.VirtualMatrixUiConverter.prototype.getConverterFactory = function()
{
	return null;
};
oFF.VirtualMatrixUiConverter.prototype.fetchInnerContent = function(content, hasFullWidth, vAlign)
{
	return null;
};
oFF.VirtualMatrixUiConverter.prototype.fetchLayoutArray = function()
{
	return null;
};
oFF.VirtualMatrixUiConverter.prototype.fetchText = function(x, y)
{
	return null;
};
oFF.VirtualMatrixUiConverter.prototype.setCallback = function(callback) {};
oFF.VirtualMatrixUiConverter.prototype.setupUiConverter = function(virtualMatrix, eventReceiver, matrixNamespace, settings, tableSelectionState, converterFactory) {};

oFF.GenericPivotObjectFactory = function() {};
oFF.GenericPivotObjectFactory.prototype = new oFF.DfApplicationContext();
oFF.GenericPivotObjectFactory.prototype._ff_c = "GenericPivotObjectFactory";

oFF.GenericPivotObjectFactory.create = function(application, uiManager)
{
	var objectFactory = new oFF.GenericPivotObjectFactory();
	objectFactory.setupGenericPivotObjectFactory(application, uiManager);
	return objectFactory;
};
oFF.GenericPivotObjectFactory.prototype.setupGenericPivotObjectFactory = function(application, uiManager)
{
	this.setupApplicationContext(application);
};
oFF.GenericPivotObjectFactory.prototype.createUiId = function()
{
	return null;
};
oFF.GenericPivotObjectFactory.prototype.getMatrixClient = function()
{
	return oFF.UiClientType.HTML;
};
oFF.GenericPivotObjectFactory.prototype.createTextControl = function()
{
	return null;
};
oFF.GenericPivotObjectFactory.prototype.createImageControl = function()
{
	return null;
};
oFF.GenericPivotObjectFactory.prototype.createLayoutControl = function()
{
	return null;
};
oFF.GenericPivotObjectFactory.prototype.createCell = function()
{
	return oFF.MxGridCell.createMxGridCell();
};
oFF.GenericPivotObjectFactory.prototype.createDragDropDef = function()
{
	return null;
};
oFF.GenericPivotObjectFactory.prototype.createURMimePath = function(mime)
{
	return mime;
};
oFF.GenericPivotObjectFactory.prototype.createMimeUrlFromUri = function(uri)
{
	return uri;
};

oFF.RsSimpleGrid = function() {};
oFF.RsSimpleGrid.prototype = new oFF.MxGridMatrix();
oFF.RsSimpleGrid.prototype._ff_c = "RsSimpleGrid";

oFF.RsSimpleGrid.SEP_VERT_TOP = "/";
oFF.RsSimpleGrid.SEP_VERT_BOTTOM = "~";
oFF.RsSimpleGrid.SEP_VERT = ":";
oFF.RsSimpleGrid.COLUMN = "|";
oFF.RsSimpleGrid.ROW = "~";
oFF.RsSimpleGrid.MAGIC_CELL_DIV = "/";
oFF.RsSimpleGrid.LINEFEED = "\r\n";
oFF.RsSimpleGrid.create = function(resultSet)
{
	var object = new oFF.RsSimpleGrid();
	object.setupSimpleGrid(resultSet);
	return object;
};
oFF.RsSimpleGrid.prototype.m_cells = null;
oFF.RsSimpleGrid.prototype.m_fixedWidth2 = 0;
oFF.RsSimpleGrid.prototype.m_fixedHeight2 = 0;
oFF.RsSimpleGrid.prototype.m_uiManager = null;
oFF.RsSimpleGrid.prototype.m_application = null;
oFF.RsSimpleGrid.prototype.setupSimpleGrid = function(resultSet)
{
	this.m_application = resultSet.getQueryManager().getApplication();
	var rowsAxis = resultSet.getRowsAxis();
	var columnsAxis = resultSet.getColumnsAxis();
	var caDc = columnsAxis.getDataCount();
	var caTc = columnsAxis.getTuplesCount();
	var raDc = rowsAxis.getDataCount();
	var raTc = rowsAxis.getTuplesCount();
	var dc = this.getMax(caDc, caTc);
	var dr = this.getMax(raDc, raTc);
	var rea = rowsAxis.getEffectiveRsFields();
	var cea = columnsAxis.getEffectiveRsFields();
	var rea_c = rea.size();
	var cea_c = cea.size();
	if (rea_c === 0)
	{
		rea_c = 1;
	}
	if (cea_c === 0)
	{
		cea_c = 1;
	}
	var totalColumns = rea_c + dc;
	var totalRows = cea_c + dr;
	this.m_cells = oFF.XArray2Dim.create(totalColumns, totalRows);
	this.m_fixedHeight2 = cea_c;
	this.m_fixedWidth2 = rea_c;
	this.setDataCells(resultSet, rea_c, cea_c);
	this.setHeaderCells(rowsAxis, cea_c);
	this.setHeaderCells(columnsAxis, rea_c);
	this.setTitleCells(rowsAxis, cea_c - 1);
	this.setTitleCells(columnsAxis, rea_c - 1);
};
oFF.RsSimpleGrid.prototype.setTitleCells = function(axis, offset)
{
	var type = axis.getType();
	var dimensions = axis.getRsDimensions();
	var position = 0;
	var name;
	var cell;
	for (var i = 0; i < dimensions.size(); i++)
	{
		var rsDefDimension = dimensions.get(i);
		var resultSetAttributes = rsDefDimension.getAllFields();
		for (var j = 0; j < resultSetAttributes.size(); j++)
		{
			var buffer = oFF.XStringBuffer.create();
			if (rsDefDimension.isMeasureStructure())
			{
				if (j === 0)
				{
					buffer.append("Measures");
				}
			}
			else if (rsDefDimension.isStructure())
			{
				if (j === 0)
				{
					buffer.append("Structure");
				}
			}
			else
			{
				var fieldName = resultSetAttributes.get(j).getName();
				if (j === 0)
				{
					buffer.append(rsDefDimension.getName());
					buffer.append(".[");
					buffer.append(fieldName);
					buffer.append("]");
				}
				else
				{
					buffer.append("[");
					buffer.append(fieldName);
					buffer.append("]");
				}
			}
			name = buffer.toString();
			if (type === oFF.AxisType.ROWS)
			{
				cell = oFF.RsSimpleGridCell.create(name, oFF.UiAlignment.BEGIN, oFF.UiSemanticCellStyle.STANDARD);
				this.m_cells.setByIndices(position, offset, cell);
			}
			else
			{
				var existingCell = this.m_cells.getByIndices(offset, position);
				if (oFF.notNull(existingCell))
				{
					var magicCellBuffer = oFF.XStringBuffer.create();
					magicCellBuffer.append(existingCell.toString());
					magicCellBuffer.append(oFF.RsSimpleGrid.MAGIC_CELL_DIV);
					magicCellBuffer.append(name);
					name = magicCellBuffer.toString();
				}
				cell = oFF.RsSimpleGridCell.create(name, oFF.UiAlignment.END, oFF.UiSemanticCellStyle.STANDARD);
				this.m_cells.setByIndices(offset, position, cell);
			}
			position++;
		}
	}
};
oFF.RsSimpleGrid.prototype.setDataCells = function(resultSet, offsetX, offsetY)
{
	var dc = resultSet.getDataColumns();
	var dr = resultSet.getDataRows();
	var dataCell;
	var formattedValue;
	var cell;
	var valueException;
	for (var y = 0; y < dr; y++)
	{
		for (var x = 0; x < dc; x++)
		{
			dataCell = resultSet.getDataCell(x, y);
			valueException = dataCell.getValueException();
			if (valueException === oFF.ValueException.NORMAL)
			{
				formattedValue = dataCell.getFormattedValue();
			}
			else if (valueException === oFF.ValueException.NULL_VALUE)
			{
				formattedValue = "";
			}
			else if (valueException === oFF.ValueException.ZERO)
			{
				formattedValue = "0";
			}
			else
			{
				formattedValue = valueException.getName();
			}
			cell = oFF.RsSimpleGridCell.create(formattedValue, oFF.UiAlignment.END, oFF.UiSemanticCellStyle.STANDARD);
			this.m_cells.setByIndices(x + offsetX, y + offsetY, cell);
		}
	}
};
oFF.RsSimpleGrid.prototype.setHeaderCells = function(axis, tupleOffset)
{
	var formattedValue;
	var cell;
	var type = axis.getType();
	var tuple;
	var position;
	var element;
	var dimensionMember;
	var fieldValues;
	var fieldValue;
	var drillState;
	var displayLevel;
	var spaceCounter;
	var buffer;
	var tuplesCount = axis.getTuplesCount();
	var tupleSize;
	var fieldCount;
	for (var tupleIndex = 0; tupleIndex < tuplesCount; tupleIndex++)
	{
		tuple = axis.getTupleAt(tupleIndex);
		position = 0;
		tupleSize = tuple.size();
		for (var tupleElementIndex = 0; tupleElementIndex < tupleSize; tupleElementIndex++)
		{
			element = tuple.get(tupleElementIndex);
			if (element.getFirstTuple() === tuple)
			{
				drillState = element.getDrillState();
				displayLevel = element.getDisplayLevel();
				dimensionMember = element.getDimensionMember();
				if (dimensionMember.getMemberType().isResult())
				{
					formattedValue = "[Totals]";
					cell = oFF.RsSimpleGridCell.create(formattedValue, oFF.UiAlignment.BEGIN, oFF.UiSemanticCellStyle.TOTAL);
					fieldCount = dimensionMember.getDimension().getResultSetFields().size();
					if (type === oFF.AxisType.ROWS)
					{
						this.m_cells.setByIndices(position, tupleIndex + tupleOffset, cell);
					}
					else
					{
						this.m_cells.setByIndices(tupleIndex + tupleOffset, position, cell);
					}
					position = position + fieldCount - 1;
				}
				else
				{
					fieldValues = dimensionMember.getResultSetFieldValues();
					fieldCount = fieldValues.size();
					for (var attributeIndex = 0; attributeIndex < fieldCount; attributeIndex++)
					{
						fieldValue = fieldValues.get(attributeIndex);
						if (oFF.notNull(fieldValue))
						{
							formattedValue = fieldValue.getFormattedValue();
						}
						else
						{
							formattedValue = "[null]";
						}
						if (attributeIndex === 0)
						{
							if (drillState !== oFF.DrillState.LEAF)
							{
								buffer = oFF.XStringBuffer.create();
								for (spaceCounter = 0; spaceCounter < displayLevel; spaceCounter++)
								{
									buffer.append("  ");
								}
								if (drillState === oFF.DrillState.COLLAPSED || drillState === oFF.DrillState.LEAF_DRILLDOWN_ALLOWED || drillState === oFF.DrillState.LEAF_UDH_EXPAND_ALLOWED || drillState === oFF.DrillState.COLLAPSED_EXPAND_AND_DRILLDOWN_ALLOWED)
								{
									buffer.append("+ ");
								}
								else if (drillState === oFF.DrillState.EXPANDED || drillState === oFF.DrillState.DRILLED || drillState === oFF.DrillState.LEAF_UDH)
								{
									buffer.append("- ");
								}
								buffer.append(formattedValue);
								formattedValue = buffer.toString();
							}
							else if (displayLevel > 0)
							{
								buffer = oFF.XStringBuffer.create();
								for (spaceCounter = 0; spaceCounter < displayLevel; spaceCounter++)
								{
									buffer.append("  ");
								}
								buffer.append(formattedValue);
								formattedValue = buffer.toString();
							}
						}
						cell = null;
						if (type === oFF.AxisType.ROWS)
						{
							this.m_cells.setByIndices(position, tupleIndex + tupleOffset, cell);
							position++;
						}
						else
						{
							this.m_cells.setByIndices(tupleIndex + tupleOffset, position, cell);
							position++;
						}
					}
				}
			}
			else
			{
				dimensionMember = element.getDimensionMember();
				fieldCount = dimensionMember.getDimension().getResultSetFields().size();
				position = position + fieldCount;
			}
		}
	}
};
oFF.RsSimpleGrid.prototype.getColumnCount = function()
{
	return this.m_cells.size0();
};
oFF.RsSimpleGrid.prototype.getRowCount = function()
{
	return this.m_cells.size1();
};
oFF.RsSimpleGrid.prototype.getFixedColumnsCount = function()
{
	return this.m_fixedWidth2;
};
oFF.RsSimpleGrid.prototype.getFixedRowsCount = function()
{
	return this.m_fixedHeight2;
};
oFF.RsSimpleGrid.prototype.getColumnMaxCharacters = function(column)
{
	var rowCount = this.m_cells.size1();
	var max = 0;
	var cell;
	var c;
	for (var row = 0; row < rowCount; row++)
	{
		cell = this.m_cells.getByIndices(column, row);
		if (oFF.notNull(cell))
		{
			c = cell.getCharacterCount();
			if (c > max)
			{
				max = c;
			}
		}
	}
	return max;
};
oFF.RsSimpleGrid.prototype.getSimpleCell = function(column, row)
{
	return this.m_cells.getByIndices(column, row);
};
oFF.RsSimpleGrid.prototype.getCell = function(x, y)
{
	return this.m_cells.getByIndices(x, y);
};
oFF.RsSimpleGrid.prototype.exportToAscii = function(maxCellSize)
{
	var buffer = oFF.XStringBuffer.create();
	var colCount = this.m_cells.size0();
	var rowCount = this.m_cells.size1();
	var columns = oFF.XArrayOfInt.create(colCount);
	var max;
	for (var i = 0; i < colCount; i++)
	{
		max = this.getColumnMaxCharacters(i);
		if (maxCellSize !== -1 && max > maxCellSize)
		{
			max = maxCellSize;
		}
		columns.set(i, max);
	}
	var cell;
	var x;
	var y;
	var z;
	var charCount;
	var rest;
	for (y = 0; y < rowCount; y++)
	{
		if (y > 0)
		{
			buffer.append(oFF.RsSimpleGrid.LINEFEED);
		}
		if (y === this.m_fixedHeight2)
		{
			this.renderLine(buffer, columns, oFF.RsSimpleGrid.SEP_VERT_TOP);
			buffer.append(oFF.RsSimpleGrid.LINEFEED);
		}
		for (x = 0; x < colCount; x++)
		{
			if (x > 0)
			{
				if (x === this.m_fixedWidth2)
				{
					buffer.append(oFF.RsSimpleGrid.SEP_VERT);
				}
				else
				{
					buffer.append(oFF.RsSimpleGrid.COLUMN);
				}
			}
			cell = this.m_cells.getByIndices(x, y);
			rest = columns.get(x);
			if (oFF.notNull(cell))
			{
				charCount = cell.getCharacterCount();
				if (charCount > rest)
				{
					charCount = rest;
				}
				rest = rest - charCount;
				if (cell.getAlignment() === oFF.UiAlignment.BEGIN)
				{
					buffer.append(cell.getText(charCount));
					for (z = 0; z < rest; z++)
					{
						buffer.append(" ");
					}
				}
				else
				{
					for (z = 0; z < rest; z++)
					{
						buffer.append(" ");
					}
					buffer.append(cell.getText(charCount));
				}
			}
			else
			{
				for (z = 0; z < rest; z++)
				{
					buffer.append(" ");
				}
			}
		}
	}
	if (rowCount > 0)
	{
		buffer.append(oFF.RsSimpleGrid.LINEFEED);
		this.renderLine(buffer, columns, oFF.RsSimpleGrid.SEP_VERT_BOTTOM);
	}
	return buffer.toString();
};
oFF.RsSimpleGrid.prototype.renderLine = function(buffer, columns, verticalSeparator)
{
	var rest;
	var z;
	var colCount = columns.size();
	for (var x = 0; x < colCount; x++)
	{
		rest = columns.get(x);
		if (x > 0)
		{
			if (x === this.m_fixedWidth2)
			{
				buffer.append(verticalSeparator);
			}
			else
			{
				buffer.append(oFF.RsSimpleGrid.ROW);
			}
		}
		for (z = 0; z < rest; z++)
		{
			buffer.append(oFF.RsSimpleGrid.ROW);
		}
	}
};
oFF.RsSimpleGrid.prototype.getUiManager = function()
{
	if (oFF.isNull(this.m_uiManager))
	{
		this.m_uiManager = this.m_application.getUiManager();
	}
	return this.m_uiManager;
};
oFF.RsSimpleGrid.prototype.exportToHtml = function()
{
	return null;
};
oFF.RsSimpleGrid.prototype.getMax = function(value1, value2)
{
	var returnValue = value1;
	if (returnValue < value2)
	{
		returnValue = value2;
	}
	return returnValue;
};

oFF.DfClientGenerator = function() {};
oFF.DfClientGenerator.prototype = new oFF.DfSessionContext();
oFF.DfClientGenerator.prototype._ff_c = "DfClientGenerator";

oFF.DfClientGenerator.addLink = function(buffer)
{
	buffer.append("\t<link href=\"../css/latofonts.css\" rel=\"stylesheet\" type=\"text/css\">").appendNewLine();
	buffer.append("\t<link href=\"../css/latostyle.css\" rel=\"stylesheet\" type=\"text/css\">").appendNewLine();
};
oFF.DfClientGenerator.prepareHead = function(buffer)
{
	oFF.DfClientGenerator.addMeta(buffer, "Content-Type", "text/html; charset=UTF-8");
	oFF.DfClientGenerator.addMeta(buffer, "X-UA-Compatible", "IE=edge");
};
oFF.DfClientGenerator.addMeta = function(buffer, include, contentType)
{
	buffer.append(oFF.XStringUtils.concatenate2("\t<meta http-equiv=\"", include));
	buffer.append(oFF.XStringUtils.concatenate3("\" content=\"", contentType, "\">")).appendNewLine();
};
oFF.DfClientGenerator.prototype.m_ffSdk = null;
oFF.DfClientGenerator.prototype.m_pathToSources = null;
oFF.DfClientGenerator.prototype.m_pathToTargets = null;
oFF.DfClientGenerator.prototype.m_pathToLibs = null;
oFF.DfClientGenerator.prototype.setupPaths = function(pathToSources, pathToTargets, pathToLibs)
{
	this.m_pathToSources = pathToSources;
	this.m_pathToTargets = pathToTargets;
	this.m_pathToLibs = pathToLibs;
	this.prepareEnvironment();
};
oFF.DfClientGenerator.prototype.prepareEnvironment = function()
{
	var ff_sdk_var = oFF.XEnvironment.getInstance().getVariable(oFF.XEnvironmentConstants.FIREFLY_SDK);
	if (oFF.XStringUtils.isNullOrEmpty(ff_sdk_var))
	{
		oFF.XLogger.println("ff_sdk variable is not set. Cancelling cleint generation");
		return;
	}
	this.m_ffSdk = oFF.XFile.createByNativePath(this.getSession(), ff_sdk_var);
	if (this.m_ffSdk.isExisting() === false || this.m_ffSdk.isDirectory() === false)
	{
		oFF.XLogger.println("ff_sdk variable does not denote an existing directory. Cancelling client generation");
		this.log2("ff_sdk=", ff_sdk_var);
		return;
	}
};
oFF.DfClientGenerator.prototype.saveFile = function(clientName, htmlBuffer)
{
	if (oFF.notNull(this.m_ffSdk))
	{
		var webClientsFolder = oFF.XFile.createByNativePath(this.getSession(), oFF.XStringUtils.concatenate3(this.m_ffSdk.getNativePath(), "/targets/", "/webClients/"));
		webClientsFolder.mkdir();
		if (webClientsFolder.isExisting() === true)
		{
			var htmlFile = webClientsFolder.newChild(oFF.XStringUtils.concatenate2(clientName, ".html"));
			htmlFile.saveByteArray(oFF.XByteArray.convertFromString(htmlBuffer.toString()));
		}
	}
};
oFF.DfClientGenerator.prototype.combinePageElements = function(headBuffer, bodyBuffer)
{
	var htmlBuffer = oFF.XStringBuffer.create();
	htmlBuffer.append("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01//EN\" \"http://www.w3.org/TR/html4/strict.dtd\">").appendNewLine();
	htmlBuffer.append("<html style=\"height:100%\">").appendNewLine();
	htmlBuffer.append(headBuffer.toString()).appendNewLine();
	htmlBuffer.append(bodyBuffer.toString()).appendNewLine();
	htmlBuffer.append("</html>");
	return htmlBuffer;
};
oFF.DfClientGenerator.prototype.addBody = function(buffer)
{
	buffer.append("\t<body onload=\"initJs()\" class=\"sapUiBody\">");
	buffer.append("<div id=\"content\" style=\"height:100%;disply:block;width:100%\"></div>");
	buffer.append("</body>");
};
oFF.DfClientGenerator.prototype.releaseObject = function()
{
	oFF.DfSessionContext.prototype.releaseObject.call( this );
};

oFF.MxGridFixedCellSize = function() {};
oFF.MxGridFixedCellSize.prototype = new oFF.MxGridMatrix();
oFF.MxGridFixedCellSize.prototype._ff_c = "MxGridFixedCellSize";

oFF.MxGridFixedCellSize.prototype.m_cellWidth = 0;
oFF.MxGridFixedCellSize.prototype.m_cellHeight = 0;
oFF.MxGridFixedCellSize.prototype.setupMxGridFixedCellSize = function()
{
	this.m_cellWidth = -1;
	this.m_cellHeight = -1;
};
oFF.MxGridFixedCellSize.prototype.setCellHeight = function(height)
{
	this.m_cellHeight = height;
};
oFF.MxGridFixedCellSize.prototype.setCellWidth = function(width)
{
	this.m_cellWidth = width;
};
oFF.MxGridFixedCellSize.prototype.getColumn = function(x)
{
	var line = oFF.MxGridMatrix.prototype.getColumn.call( this , x);
	if (this.m_cellWidth !== -1 && line.getExtend() === -1)
	{
		line.setExtend(this.m_cellWidth);
	}
	return line;
};
oFF.MxGridFixedCellSize.prototype.getRow = function(y)
{
	var line = oFF.MxGridMatrix.prototype.getRow.call( this , y);
	if (this.m_cellHeight !== -1 && line.getExtend() === -1)
	{
		line.setExtend(this.m_cellHeight);
	}
	return line;
};

oFF.MxGridMatrixStatic = function() {};
oFF.MxGridMatrixStatic.prototype = new oFF.MxGridMatrix();
oFF.MxGridMatrixStatic.prototype._ff_c = "MxGridMatrixStatic";

oFF.MxGridMatrixStatic.create = function()
{
	var object = new oFF.MxGridMatrixStatic();
	object.setupMatrixStatic();
	return object;
};
oFF.MxGridMatrixStatic.prototype.m_rows = null;
oFF.MxGridMatrixStatic.prototype.m_currentRow = null;
oFF.MxGridMatrixStatic.prototype.m_columnCountMax = 0;
oFF.MxGridMatrixStatic.prototype.m_currentRowColumnCountMax = 0;
oFF.MxGridMatrixStatic.prototype.setupMatrixStatic = function()
{
	this.setupExt(null, null, null);
	this.m_rows = oFF.XList.create();
};
oFF.MxGridMatrixStatic.prototype.getRowCount = function()
{
	return this.m_rows.size();
};
oFF.MxGridMatrixStatic.prototype.getColumnCount = function()
{
	return this.m_columnCountMax;
};
oFF.MxGridMatrixStatic.prototype.getFixedColumnsCount = function()
{
	return 0;
};
oFF.MxGridMatrixStatic.prototype.getFixedRowsCount = function()
{
	return 0;
};
oFF.MxGridMatrixStatic.prototype.addNewRow = function()
{
	this.m_currentRow = oFF.XList.create();
	this.m_rows.add(this.m_currentRow);
	if (this.m_columnCountMax < this.m_currentRowColumnCountMax)
	{
		this.m_columnCountMax = this.m_currentRowColumnCountMax;
	}
	this.m_currentRowColumnCountMax = 0;
};
oFF.MxGridMatrixStatic.prototype.addCell = function(cell)
{
	this.m_currentRow.add(cell);
	this.m_currentRowColumnCountMax++;
	if (this.m_columnCountMax < this.m_currentRowColumnCountMax)
	{
		this.m_columnCountMax = this.m_currentRowColumnCountMax;
	}
};
oFF.MxGridMatrixStatic.prototype.addNewCell = function(colSpanState, colSpan, rowSpanState, rowSpan)
{
	var cell = oFF.MxGridCell.createMxGridCell();
	cell.setColSpanState(colSpanState);
	cell.setCellColSpan(colSpan);
	cell.setRowSpanState(rowSpanState);
	cell.setCellRowSpan(rowSpan);
	this.addCell(cell);
	return cell;
};
oFF.MxGridMatrixStatic.prototype.getCell = function(x, y)
{
	var currentRow = this.m_rows.get(y);
	var cell = currentRow.get(x);
	return cell;
};

oFF.MxGridSectionClipping = function() {};
oFF.MxGridSectionClipping.prototype = new oFF.MxGridMatrix();
oFF.MxGridSectionClipping.prototype._ff_c = "MxGridSectionClipping";

oFF.MxGridSectionClipping.prototype.m_section = 0;
oFF.MxGridSectionClipping.prototype.m_verticalOffset = 0;
oFF.MxGridSectionClipping.prototype.m_horizontalOffset = 0;
oFF.MxGridSectionClipping.prototype.m_colCount = 0;
oFF.MxGridSectionClipping.prototype.m_rowCount = 0;
oFF.MxGridSectionClipping.prototype.prepareMatrix = function()
{
	this.m_rowCount = -1;
	this.m_colCount = -1;
	return oFF.MxGridMatrix.prototype.prepareMatrix.call( this );
};
oFF.MxGridSectionClipping.prototype.setSection = function(section)
{
	this.m_section = section;
};
oFF.MxGridSectionClipping.prototype.getSection = function()
{
	return this.m_section;
};
oFF.MxGridSectionClipping.prototype.getRowCount = function()
{
	if (this.m_rowCount === -1)
	{
		if (this.m_section === 1)
		{
			this.m_verticalOffset = 0;
			this.m_rowCount = this.getMatrix().getFixedRowsCount();
		}
		else if (this.m_section === 2)
		{
			this.m_verticalOffset = 0;
			this.m_rowCount = this.getMatrix().getFixedRowsCount();
		}
		else if (this.m_section === 3)
		{
			this.m_verticalOffset = this.getMatrix().getFixedRowsCount();
			this.m_rowCount = this.getMatrix().getRowCount() - this.m_verticalOffset;
		}
		else if (this.m_section === 4)
		{
			this.m_verticalOffset = this.getMatrix().getFixedRowsCount();
			this.m_rowCount = this.getMatrix().getRowCount() - this.m_verticalOffset;
		}
	}
	return this.m_rowCount;
};
oFF.MxGridSectionClipping.prototype.getColumnCount = function()
{
	if (this.m_colCount === -1)
	{
		if (this.m_section === 1)
		{
			this.m_horizontalOffset = 0;
			this.m_colCount = this.getMatrix().getFixedColumnsCount();
		}
		else if (this.m_section === 2)
		{
			this.m_horizontalOffset = this.getMatrix().getFixedColumnsCount();
			this.m_colCount = this.getMatrix().getColumnCount() - this.m_horizontalOffset;
		}
		else if (this.m_section === 3)
		{
			this.m_horizontalOffset = 0;
			this.m_colCount = this.getMatrix().getFixedColumnsCount();
		}
		else if (this.m_section === 4)
		{
			this.m_horizontalOffset = this.getMatrix().getFixedColumnsCount();
			this.m_colCount = this.getMatrix().getColumnCount() - this.m_horizontalOffset;
		}
	}
	return this.m_colCount;
};
oFF.MxGridSectionClipping.prototype.getCell = function(x, y)
{
	oFF.MxGridMatrix.prototype.setRunning.call( this );
	return oFF.MxGridMatrix.prototype.getCell.call( this , this.m_horizontalOffset + x, this.m_verticalOffset + y);
};
oFF.MxGridSectionClipping.prototype.getColumn = function(x)
{
	return oFF.MxGridMatrix.prototype.getColumn.call( this , this.m_horizontalOffset + x);
};
oFF.MxGridSectionClipping.prototype.getRow = function(y)
{
	return oFF.MxGridMatrix.prototype.getRow.call( this , this.m_verticalOffset + y);
};

oFF.MxGridVirtualClipping = function() {};
oFF.MxGridVirtualClipping.prototype = new oFF.MxGridMatrix();
oFF.MxGridVirtualClipping.prototype._ff_c = "MxGridVirtualClipping";

oFF.MxGridVirtualClipping.create = function(description, client, origin)
{
	var object = new oFF.MxGridVirtualClipping();
	object.setupExt(description, client, origin);
	return object;
};
oFF.MxGridVirtualClipping.prototype.m_verticalPosition = 0;
oFF.MxGridVirtualClipping.prototype.m_maxHeight = 0;
oFF.MxGridVirtualClipping.prototype.m_horizontalPosition = 0;
oFF.MxGridVirtualClipping.prototype.m_maxWidth = 0;
oFF.MxGridVirtualClipping.prototype.m_clipHeight = 0;
oFF.MxGridVirtualClipping.prototype.m_clipWidth = 0;
oFF.MxGridVirtualClipping.prototype.allowReducedPagingRequest = false;
oFF.MxGridVirtualClipping.prototype.setupMxGridVirtualClipping = function()
{
	this.m_verticalPosition = 0;
	this.m_maxHeight = -1;
	this.m_horizontalPosition = 0;
	this.m_maxWidth = -1;
	this.m_clipHeight = oFF.MxGridMatrix.INTERNAL_INITIAL;
	this.m_clipWidth = oFF.MxGridMatrix.INTERNAL_INITIAL;
};
oFF.MxGridVirtualClipping.prototype.prepareMatrix = function()
{
	var ms = oFF.MxGridMatrix.prototype.prepareMatrix.call( this );
	this.m_clipHeight = oFF.MxGridMatrix.INTERNAL_INITIAL;
	this.m_clipWidth = oFF.MxGridMatrix.INTERNAL_INITIAL;
	this.getRowCount();
	this.getColumnCount();
	return ms;
};
oFF.MxGridVirtualClipping.prototype.getRowCount = function()
{
	if (this.m_clipHeight === oFF.MxGridMatrix.INTERNAL_INITIAL)
	{
		var rowCount = oFF.MxGridMatrix.prototype.getRowCount.call( this );
		var fixedRowsCount = oFF.MxGridMatrix.prototype.getFixedRowsCount.call( this );
		var variableRowsCount = rowCount - fixedRowsCount;
		var newVariableRowsCount;
		if (this.m_maxHeight === -1)
		{
			newVariableRowsCount = variableRowsCount - this.m_verticalPosition;
		}
		else
		{
			newVariableRowsCount = this.m_maxHeight;
			if (newVariableRowsCount > variableRowsCount)
			{
				newVariableRowsCount = variableRowsCount;
			}
		}
		if (newVariableRowsCount < 0)
		{
			newVariableRowsCount = 0;
		}
		var end = this.m_verticalPosition + this.m_maxHeight;
		var pos;
		if (this.isAllowReducedPagingRequest() === false)
		{
			if (end > variableRowsCount)
			{
				pos = variableRowsCount - newVariableRowsCount;
				if (pos < 0)
				{
					pos = 0;
				}
				this.setVerticalPosition(pos);
			}
		}
		else
		{
			if (this.m_verticalPosition > variableRowsCount)
			{
				if (end > variableRowsCount)
				{
					pos = variableRowsCount - newVariableRowsCount;
					if (pos < 0)
					{
						pos = 0;
					}
					this.setVerticalPosition(pos);
				}
			}
			else if (end > variableRowsCount)
			{
				newVariableRowsCount = variableRowsCount - this.getVerticalPosition();
			}
		}
		this.m_clipHeight = fixedRowsCount + newVariableRowsCount;
	}
	return this.m_clipHeight;
};
oFF.MxGridVirtualClipping.prototype.getColumnCount = function()
{
	if (this.m_clipWidth === oFF.MxGridMatrix.INTERNAL_INITIAL)
	{
		var colCount = oFF.MxGridMatrix.prototype.getColumnCount.call( this );
		var fixedColumnsCount = oFF.MxGridMatrix.prototype.getFixedColumnsCount.call( this );
		var variableColumnsCount = colCount - fixedColumnsCount;
		var newVariableColumnsCount;
		if (this.m_maxWidth === -1)
		{
			newVariableColumnsCount = variableColumnsCount - this.m_horizontalPosition;
		}
		else
		{
			newVariableColumnsCount = this.m_maxWidth;
			if (newVariableColumnsCount > variableColumnsCount)
			{
				newVariableColumnsCount = variableColumnsCount;
			}
		}
		if (newVariableColumnsCount < 0)
		{
			newVariableColumnsCount = 0;
		}
		var end = this.m_horizontalPosition + newVariableColumnsCount;
		var pos;
		if (this.isAllowReducedPagingRequest() === false)
		{
			if (end > variableColumnsCount)
			{
				pos = variableColumnsCount - newVariableColumnsCount;
				if (pos < 0)
				{
					pos = 0;
				}
				this.setHorizontalPosition(pos);
			}
		}
		else
		{
			if (this.m_horizontalPosition > variableColumnsCount)
			{
				if (end > variableColumnsCount)
				{
					pos = variableColumnsCount - newVariableColumnsCount;
					if (pos < 0)
					{
						pos = 0;
					}
					this.setHorizontalPosition(pos);
				}
			}
			else if (end > variableColumnsCount)
			{
				newVariableColumnsCount = variableColumnsCount - this.getHorizontalPosition();
			}
		}
		this.m_clipWidth = fixedColumnsCount + newVariableColumnsCount;
	}
	return this.m_clipWidth;
};
oFF.MxGridVirtualClipping.prototype.isRowClipping = function()
{
	return this.getRowCount() !== this.m_origin.getRowCount();
};
oFF.MxGridVirtualClipping.prototype.isColumnClipping = function()
{
	return this.getColumnCount() !== this.m_origin.getColumnCount();
};
oFF.MxGridVirtualClipping.prototype.getScrollColumCount = function()
{
	return this.m_origin.getColumnCount() - this.m_origin.getFixedColumnsCount();
};
oFF.MxGridVirtualClipping.prototype.getScrollRowCount = function()
{
	return this.m_origin.getRowCount() - this.m_origin.getFixedRowsCount();
};
oFF.MxGridVirtualClipping.prototype.getCell = function(x, y)
{
	var yCorrected;
	var isFirstRowAfterFixed;
	if (y < this.getFixedRowsCount())
	{
		yCorrected = y;
		isFirstRowAfterFixed = false;
	}
	else
	{
		yCorrected = this.m_verticalPosition + y;
		isFirstRowAfterFixed = this.getFixedRowsCount() === y;
	}
	var xCorrected;
	var isFirstColAfterFixed;
	if (x < this.getFixedColumnsCount())
	{
		xCorrected = x;
		isFirstColAfterFixed = false;
	}
	else
	{
		xCorrected = this.m_horizontalPosition + x;
		isFirstColAfterFixed = this.getFixedColumnsCount() === x;
	}
	var cell = this.m_origin.getCell(xCorrected, yCorrected);
	var span;
	var maxSpan;
	span = cell.getCellColSpan();
	maxSpan = this.getColumnCount() - x;
	if (span > maxSpan)
	{
		cell.setCellColSpan(maxSpan);
	}
	span = cell.getCellRowSpan();
	maxSpan = this.getRowCount() - y;
	if (span > maxSpan)
	{
		cell.setCellRowSpan(maxSpan);
	}
	if (isFirstColAfterFixed)
	{
		if (cell.getCellColSpan() === 1)
		{
			cell.setColSpanState(oFF.MxGridSpanState.NOSPAN);
		}
		else
		{
			cell.setColSpanState(oFF.MxGridSpanState.START);
		}
	}
	if (isFirstRowAfterFixed)
	{
		if (cell.getCellRowSpan() === 1)
		{
			cell.setRowSpanState(oFF.MxGridSpanState.NOSPAN);
		}
		else
		{
			cell.setRowSpanState(oFF.MxGridSpanState.START);
		}
	}
	return cell;
};
oFF.MxGridVirtualClipping.prototype.getRow = function(y)
{
	if (y < this.getFixedRowsCount())
	{
		return this.m_origin.getRow(y);
	}
	return this.m_origin.getRow(this.m_verticalPosition + y);
};
oFF.MxGridVirtualClipping.prototype.getColumn = function(x)
{
	if (x < this.getFixedColumnsCount())
	{
		return this.m_origin.getColumn(x);
	}
	return this.m_origin.getColumn(this.m_horizontalPosition + x);
};
oFF.MxGridVirtualClipping.prototype.setVerticalPosition = function(verticalPosition)
{
	if (verticalPosition < 0)
	{
		throw oFF.XException.createIllegalStateException("Assertion: verticalPosition < 0");
	}
	this.m_verticalPosition = verticalPosition;
};
oFF.MxGridVirtualClipping.prototype.getVerticalPosition = function()
{
	return this.m_verticalPosition;
};
oFF.MxGridVirtualClipping.prototype.setMaxVisibleScrollableRows = function(maxHeight)
{
	this.m_maxHeight = maxHeight;
};
oFF.MxGridVirtualClipping.prototype.getMaxVisibleScrollableRows = function()
{
	return this.m_maxHeight;
};
oFF.MxGridVirtualClipping.prototype.setHorizontalPosition = function(horizontalPosition)
{
	if (horizontalPosition < 0)
	{
		throw oFF.XException.createIllegalStateException("Assertion: horizontalPosition < 0");
	}
	this.m_horizontalPosition = horizontalPosition;
};
oFF.MxGridVirtualClipping.prototype.getHorizontalPosition = function()
{
	return this.m_horizontalPosition;
};
oFF.MxGridVirtualClipping.prototype.setMaxVisibleScrollableColumns = function(maxWidth)
{
	this.m_maxWidth = maxWidth;
};
oFF.MxGridVirtualClipping.prototype.getMaxVisibleScrollableColumns = function()
{
	return this.m_maxWidth;
};
oFF.MxGridVirtualClipping.prototype.setAllowReducedPagingRequest = function(newAllowReducedPagingRequest)
{
	this.allowReducedPagingRequest = newAllowReducedPagingRequest;
};
oFF.MxGridVirtualClipping.prototype.isAllowReducedPagingRequest = function()
{
	return this.allowReducedPagingRequest;
};

oFF.SxInASpec = function() {};
oFF.SxInASpec.prototype = new oFF.DfNameTextObject();
oFF.SxInASpec.prototype._ff_c = "SxInASpec";

oFF.SxInASpec.INA_DATA_REQUEST = null;
oFF.SxInASpec.INA_DATA_REQUEST_CAPABILITIES = null;
oFF.SxInASpec.staticSetup = function()
{
	oFF.SxInASpec.INA_DATA_REQUEST = oFF.SxInASpec.create();
	var analytics = oFF.SxInASpec.INA_DATA_REQUEST.addStructure("Analytics");
	oFF.SxInASpec.INA_DATA_REQUEST_CAPABILITIES = oFF.SxInASpec.addCapabilities(analytics);
	var dataSource = analytics.addStructure("DataSource");
	dataSource.addStringNameValue("InstanceId");
	dataSource.addStringNameValue("ObjectName");
	dataSource.addStringNameValue("PackageName");
	dataSource.addStringNameValue("SchemaName");
	dataSource.addStringNameValue("DataArea");
	var type = dataSource.addChild("Type", oFF.XValueType.STRING, null, oFF.XValueType.ENUM_CONSTANT);
	var all = oFF.MetaObjectType.getAll();
	while (all.hasNext())
	{
		type.addStringOption(all.next().getCamelCaseName());
	}
	var definition = analytics.addStructure("Definition");
	definition.addStringNameValue("Name");
	var dataCells = definition.addArray("QueryDataCells", oFF.XValueType.STRUCTURE, null);
	dataCells.setText("The datacells are the definition entity in BW to define settings for a number source (a combination of measures from different structures)");
	dataCells.enabledByCapability(oFF.InACapabilities.C026_QUERY_DATA_CELLS);
	dataCells.addIntNameValue("CellValueType");
	dataCells.addBoolFlag("Cumulation");
	dataCells.addIntNameValue("Decimals");
	dataCells.addStructure("DimensionMemberReferences");
	dataCells.addStringEnum("DisaggregationMode");
	dataCells.addStringNameValue("DisaggregationReferenceCellName");
	dataCells.addBoolFlag("Emphasized");
	dataCells.addStringNameValue("Name");
	dataCells.addIntNameValue("ScalingFactor");
	dataCells.addBoolFlag("SignReversal");
	var dimensions = definition.addArray("Dimensions", oFF.XValueType.STRUCTURE, null);
	var axisType = dimensions.addStringEnum("Axis");
	axisType.addStringOption("Rows");
	axisType.addStringOption("Columns");
	axisType.addStringOption("Free");
	axisType.addStringOption("None");
	axisType.addStringOption("Repository");
	axisType.addStringOption("Technical");
	dimensions.addBoolFlag("IsCummulative");
	dimensions.addStringNameValue("Name");
	dimensions.addBoolFlag("NonEmpty");
	dimensions.addStringEnum("ReadMode");
	dimensions.addStringEnum("ResultSetReadMode");
	dimensions.addStructure("ResultStructure");
	var sort = definition.addArray("Sort", oFF.XValueType.STRUCTURE, null);
	sort.enabledByCapability(oFF.InACapabilities.C054_EXTENDED_SORT);
	sort.addStringNameValue("Dimension");
	var direction = sort.addStringEnum("Direction");
	direction.addStringOption("Asc");
	direction.addStringOption("Desc");
	direction.addStringOption("None");
	var sortType = sort.addStringEnum("SortType");
	sortType.addStringOption("Complex");
	sortType.addStringOption("Datacell");
	sortType.addStringOption("Field");
	sortType.addStringOption("Filter");
	sortType.addStringOption("Hierarchy");
	sortType.addStringOption("Measure");
	sortType.addStringOption("Member");
	sortType.addStringOption("MemberKey");
	sortType.addStringOption("MemberText");
	var query = definition.addStructure("Query");
	var axes = query.addArray("Axes", oFF.XValueType.STRUCTURE, null);
	axes.addStringEnum("Axis");
	axes.addStringEnum("ResultAlignment");
	var axisTypeInt = axes.addIntEnum("Type");
	axisTypeInt.addIntOption(0, "Other");
	axisTypeInt.addIntOption(1, "Rows");
	axisTypeInt.addIntOption(2, "Columns");
	axisTypeInt.addIntOption(3, "Free");
	var zeroSuppType = axes.addIntEnum("ZeroSuppressionType");
	zeroSuppType.addIntOption(0, "None");
	zeroSuppType.addIntOption(1, "IsZero");
	zeroSuppType.addIntOption(2, "AllCellsAreZero");
	var options = oFF.SxInASpec.INA_DATA_REQUEST.addArray("Options", oFF.XValueType.STRING, oFF.XValueType.OPTION_LIST);
	options.addStringOption("StatefulServer");
	options.addStringOption("SynchronousRun");
};
oFF.SxInASpec.addCapabilities = function(parent)
{
	var capabilities = parent.addArray("Capabilities", oFF.XValueType.STRING, oFF.XValueType.OPTION_LIST);
	oFF.SxInASpec.INA_DATA_REQUEST_CAPABILITIES = capabilities;
	capabilities.addCapability(oFF.InACapabilities.C102_AGGREGATION_NOP_NULL);
	capabilities.addCapability(oFF.InACapabilities.C103_AGGREGATION_NOP_NULL_ZERO);
	capabilities.addCapability(oFF.InACapabilities.C026_QUERY_DATA_CELLS);
	capabilities.addCapability(oFF.InACapabilities.C054_EXTENDED_SORT);
	capabilities.addCapability(oFF.InACapabilities.C027_RESULTSET_CELL_VALUE_TYPES);
	capabilities.addCapability(oFF.InACapabilities.C026_QUERY_DATA_CELLS);
	capabilities.addCapability(oFF.InACapabilities.C004_METADATA_SERVICE);
	capabilities.addCapability(oFF.InACapabilities.C007_RESPONSE_FIXED_ATTRIBUTE_SEQUENCE);
	capabilities.addCapability(oFF.InACapabilities.C014_UNIFIED_REQUEST_SYNTAX);
	capabilities.addCapability(oFF.InACapabilities.C009_STATEFUL_SERVER);
	capabilities.addCapability(oFF.InACapabilities.C010_STATEFUL_DATA_PROVIDER);
	capabilities.addCapability(oFF.InACapabilities.C011_SET_OPERAND);
	capabilities.addCapability(oFF.InACapabilities.C058_HIERARCHY_SELECTION_AS_FLAT_SELECTION);
	capabilities.addCapability(oFF.InACapabilities.C006_READ_MODE);
	capabilities.addCapability(oFF.InACapabilities.C008_SERVER_STRUCTURE_NAMES);
	capabilities.addCapability(oFF.InACapabilities.C012_ENCODED_RESULTSET);
	capabilities.addCapability(oFF.InACapabilities.C005_OBTAINABILITY);
	capabilities.addCapability(oFF.InACapabilities.C013_COMPLEX_FILTERS);
	capabilities.addCapability(oFF.InACapabilities.C001_DATASOURCE_AT_SERVICE);
	capabilities.addCapability(oFF.InACapabilities.C020_NEW_VALUES_IMPLICIT_UNLOCK);
	capabilities.addCapability(oFF.InACapabilities.C021_NEW_VALUES_EXTENDED_FORMAT);
	capabilities.addCapability(oFF.InACapabilities.C022_HIERARCHY_NAME_VARIABLE);
	capabilities.addCapability(oFF.InACapabilities.C000_ATTRIBUTE_HIERARCHY);
	capabilities.addCapability(oFF.InACapabilities.C003_CLIENT_CAPABILITIES);
	capabilities.addCapability(oFF.InACapabilities.C002_VARIABLE_RE_SUBMIT);
	capabilities.addCapability(oFF.InACapabilities.V500_HIERARCHY_CATALOG);
	capabilities.addCapability(oFF.InACapabilities.C016_EXT_HIERARCHY);
	capabilities.addCapability(oFF.InACapabilities.C029_RESULTSET_CELL_FORMAT_STRING);
	capabilities.addCapability(oFF.InACapabilities.C017_SAP_DATE);
	capabilities.addCapability(oFF.InACapabilities.C018_CUMMULATIVE);
	capabilities.addCapability(oFF.InACapabilities.C023_EXCEPTIONS);
	capabilities.addCapability(oFF.InACapabilities.C024_EXCEPTION_SETTINGS);
	capabilities.addCapability(oFF.InACapabilities.C037_SUPPLEMENTS);
	capabilities.addCapability(oFF.InACapabilities.C025_RUN_AS_USER);
	capabilities.addCapability(oFF.InACapabilities.C030_UNIQUE_ATTRIBUTE_NAMES);
	capabilities.addCapability(oFF.InACapabilities.C049_RESULTSET_INTERVAL);
	capabilities.addCapability(oFF.InACapabilities.C033_ATTRIBUTE_HIERARCHY_UNIQUE_FIELDS);
	capabilities.addCapability(oFF.InACapabilities.PAGING);
	capabilities.addCapability(oFF.InACapabilities.C031_METADATA_IS_DISPLAY_ATTRIBUTE);
	capabilities.addCapability(oFF.InACapabilities.C117_CANCEL_RUNNING_REQUESTS);
	capabilities.addCapability(oFF.InACapabilities.C019_EXTENDED_DIMENSION_TYPES);
	capabilities.addCapability(oFF.InACapabilities.C015_SEMANTICAL_ERROR_TYPE);
	capabilities.addCapability(oFF.InACapabilities.C032_FAST_PATH);
	capabilities.addCapability(oFF.InACapabilities.C028_METADATA_DIMENSION_GROUP);
	capabilities.addCapability(oFF.InACapabilities.C038_USE_EPM_VERSION);
	capabilities.addCapability(oFF.InACapabilities.C039_DIMENSION_KIND_EPM_VERSION);
	capabilities.addCapability(oFF.InACapabilities.C040_DIMENSION_KIND_CHART_OF_ACCOUNTS);
	capabilities.addCapability(oFF.InACapabilities.C034_HIERARCHY_KEY_TEXT_NAME);
	capabilities.addCapability(oFF.InACapabilities.C074_RETURN_RESTRICTED_AND_CALCULATED_MEMBERS_IN_READ_MODE_BOOKED);
	capabilities.addCapability(oFF.InACapabilities.C041_SP9);
	capabilities.addCapability(oFF.InACapabilities.INA_MODEL);
	capabilities.addCapability(oFF.InACapabilities.C035_HIERARCHY_NAVIGATION_COUNTER);
	capabilities.addCapability(oFF.InACapabilities.C036_ATTRIBUTE_HIERARCHY_HIERARCHY_FIELDS);
	capabilities.addCapability(oFF.InACapabilities.C042_TECHNICAL_AXIS);
	capabilities.addCapability(oFF.InACapabilities.C043_DIMENSION_VALUEHELP_PROPERTY);
	capabilities.addCapability(oFF.InACapabilities.C044_PAGING_TUPLE_COUNT_TOTAL);
	capabilities.addCapability(oFF.InACapabilities.SORT_TYPE);
	capabilities.addCapability(oFF.InACapabilities.C051_HIERARCHY_PATH);
	capabilities.addCapability(oFF.InACapabilities.C045_ZERO_SUPPRESSION);
	capabilities.addCapability(oFF.InACapabilities.C046_MANUAL_INPUT);
	capabilities.addCapability(oFF.InACapabilities.C047_MULTI_SOURCE);
	capabilities.addCapability(oFF.InACapabilities.C099_METADATA_DATA_CATEGORY);
	capabilities.addCapability(oFF.InACapabilities.C052_METADATA_HIERARCHY_STRUCTURE);
	capabilities.addCapability(oFF.InACapabilities.C053_METADATA_HIERARCHY_LEVELS);
	capabilities.addCapability(oFF.InACapabilities.C169_DIMENSION_HIERARCHY_LEVELS);
	capabilities.addCapability(oFF.InACapabilities.C050_REPORT_REPORT_INTERFACE);
	capabilities.addCapability(oFF.InACapabilities.C190_METADATA_SEMANTIC_TYPE);
	capabilities.addCapability(oFF.InACapabilities.V224_METADATA_DIMENSION_OTHERS);
	capabilities.addCapability(oFF.InACapabilities.V226_METADATA_DIMENSION_IS_MODELED);
	capabilities.addCapability(oFF.InACapabilities.V264_RESULTSET_CELL_MEASURE);
	capabilities.addCapability(oFF.InACapabilities.V149_RESULTSET_HIERARCHY_LEVEL);
	capabilities.addCapability(oFF.InACapabilities.C114_VALUES_ROUNDED);
	capabilities.addCapability(oFF.InACapabilities.V125_SET_OPERAND_CURRENT_MEMBER_SINGLE_NAVIGATION);
	capabilities.addCapability(oFF.InACapabilities.C055_CUSTOM_DIMENSION_MEMBER_EXECUTION_STEP);
	capabilities.addCapability(oFF.InACapabilities.C056_HIERARCHY_PATH_UNIQUE_NAME);
	capabilities.addCapability(oFF.InACapabilities.C057_HIERARCHY_DATA_AND_EXCLUDING_FILTERS);
	capabilities.addCapability(oFF.InACapabilities.C059_VISIBILITY_FILTER);
	capabilities.addCapability(oFF.InACapabilities.C061_SPATIAL_FILTER);
	capabilities.addCapability(oFF.InACapabilities.C062_SPATIAL_FILTER_WITH_SRID);
	capabilities.addCapability(oFF.InACapabilities.C063_SPATIAL_TRANSFORMATIONS);
	capabilities.addCapability(oFF.InACapabilities.C064_SPATIAL_CLUSTERING);
	capabilities.addCapability(oFF.InACapabilities.C048_MEMBER_VISIBILITY);
	capabilities.addCapability(oFF.InACapabilities.C066_SUBMIT_RETURNS_VARIABLE_VALUES);
	capabilities.addCapability(oFF.InACapabilities.C110_DEFINITION_RETURNS_VARIABLE_VALUES);
	capabilities.addCapability(oFF.InACapabilities.C065_HIERARCHY_TRAPEZOID_FILTER);
	capabilities.addCapability(oFF.InACapabilities.IS_DISPLAY_ATTRIBUTE);
	capabilities.addCapability(oFF.InACapabilities.EXECUTION_STEP);
	capabilities.addCapability(oFF.InACapabilities.CELL_DATA_TYPE);
	capabilities.addCapability(oFF.InACapabilities.C067_EXTENDED_DIMENSIONS);
	capabilities.addCapability(oFF.InACapabilities.C070_EXTENDED_DIMENSIONS_OUTER_JOIN);
	capabilities.addCapability(oFF.InACapabilities.C071_EXTENDED_DIMENSIONS_SKIP);
	capabilities.addCapability(oFF.InACapabilities.C072_METADATA_DEFAULT_RESULT_ALIGNMENT_BOTTOM);
	capabilities.addCapability(oFF.InACapabilities.C073_IGNORE_EXTERNAL_DIMENSIONS);
	capabilities.addCapability(oFF.InACapabilities.C075_PERSIST_RESULTSET);
	capabilities.addCapability(oFF.InACapabilities.C076_RESTRICTED_MEMBERS_CONVERT_TO_FLAT_SELECTION);
	capabilities.addCapability(oFF.InACapabilities.C077_VARIABLES);
	capabilities.addCapability(oFF.InACapabilities.C078_TOTALS);
	capabilities.addCapability(oFF.InACapabilities.C079_ENCODED_RESULTSET_2);
	capabilities.addCapability(oFF.InACapabilities.C080_RESULTSET_STATE);
	capabilities.addCapability(oFF.InACapabilities.C081_RESULTSET_CELL_NUMERIC_SHIFT);
	capabilities.addCapability(oFF.InACapabilities.C082_RESULTSET_CELL_DATA_TYPE);
	capabilities.addCapability(oFF.InACapabilities.C083_ORDER_BY);
	capabilities.addCapability(oFF.InACapabilities.C084_METADATA_REPOSITORY_SUFFIX);
	capabilities.addCapability(oFF.InACapabilities.C085_METADATA_CUBE_QUERY);
	capabilities.addCapability(oFF.InACapabilities.C086_MAX_RESULT_RECORDS);
	capabilities.addCapability(oFF.InACapabilities.C087_IGNORE_UNIT_OF_NULL_IN_AGGREGATION);
	capabilities.addCapability(oFF.InACapabilities.C088_SET_NULL_CELLS_UNIT_TYPE);
	capabilities.addCapability(oFF.InACapabilities.C089_DIMENSION_FILTER);
	capabilities.addCapability(oFF.InACapabilities.C090_DIMENSION_F4_SELECTION_WITH_COMPOUNDMENT);
	capabilities.addCapability(oFF.InACapabilities.C091_CUBE_BLENDING);
	capabilities.addCapability(oFF.InACapabilities.C092_CUBE_BLENDING_AGGREGATION);
	capabilities.addCapability(oFF.InACapabilities.C097_CUBE_BLENDING_PROPERTIES);
	capabilities.addCapability(oFF.InACapabilities.C095_CUBE_BLENDING_MEMBER_SORTING);
	capabilities.addCapability(oFF.InACapabilities.C094_CUBE_BLENDING_CUSTOM_MEMBERS);
	capabilities.addCapability(oFF.InACapabilities.C060_CELL_VALUE_OPERAND);
	capabilities.addCapability(oFF.InACapabilities.C100_EXPAND_BOTTOM_UP);
	capabilities.addCapability(oFF.InACapabilities.C101_CONDITIONS);
	capabilities.addCapability(oFF.InACapabilities.C102_AGGREGATION_NOP_NULL);
	capabilities.addCapability(oFF.InACapabilities.C103_AGGREGATION_NOP_NULL_ZERO);
	capabilities.addCapability(oFF.InACapabilities.C104_EXCEPTION_AGGREGATION_DIMENSIONS_AND_FORMULAS);
	capabilities.addCapability(oFF.InACapabilities.C108_MDS_EXPRESSION);
	capabilities.addCapability(oFF.InACapabilities.C111_HIERARCHY_NAVIGATION_DELTA_MODE);
	capabilities.addCapability(oFF.InACapabilities.C120_CURRENT_MEMBER_FILTER_EXTENSION);
	capabilities.addCapability(oFF.InACapabilities.C112_FLAT_KEY_ON_HIERARCHY_DISPLAY);
	capabilities.addCapability(oFF.InACapabilities.C113_DATA_CELL_MIXED_VALUES);
	capabilities.addCapability(oFF.InACapabilities.C115_ATTRIBUTE_VALUE_LOOKUP);
	capabilities.addCapability(oFF.InACapabilities.C116_METADATA_HIERARCHY_UNIQUE_NAME);
	capabilities.addCapability(oFF.InACapabilities.C118_CALCULATED_KEYFIGURES);
	capabilities.addCapability(oFF.InACapabilities.C119_RESTRICTED_KEYFIGURES);
	capabilities.addCapability(oFF.InACapabilities.C121_RETURN_ERROR_FOR_INVALID_QUERYMODEL);
	capabilities.addCapability(oFF.InACapabilities.C211_CUSTOM_DIMENSION_2);
	capabilities.addCapability(oFF.InACapabilities.EXTENDED_VARIABLE_STEPS);
	capabilities.addCapability(oFF.InACapabilities.C122_ORIGINAL_TEXTS);
	capabilities.addCapability(oFF.InACapabilities.C123_CUSTOM_DIMENSION_FILTER);
	capabilities.addCapability(oFF.InACapabilities.C125_MDS_LIKE_PAGING);
	capabilities.addCapability(oFF.InACapabilities.C124_AVERAGE_COUNT_IGNORE_NULL_ZERO);
	capabilities.addCapability(oFF.InACapabilities.C210_UNIFIED_DATA_CELLS);
	capabilities.addCapability(oFF.InACapabilities.C126_HIERARCHY_LEVEL_OFFSET_FILTER);
	capabilities.addCapability(oFF.InACapabilities.C188_LOCALE_SORTING);
	capabilities.addCapability(oFF.InACapabilities.C127_CE_SCENARIO_PARAMS);
	capabilities.addCapability(oFF.InACapabilities.C128_METADATA_DIMENSION_CAN_BE_AGGREGATED);
	capabilities.addCapability(oFF.InACapabilities.C150_CARTESIAN_FILTER_INTERSECT);
	capabilities.sort();
	return capabilities;
};
oFF.SxInASpec.create = function()
{
	var newObj = new oFF.SxInASpec();
	newObj.m_children = oFF.XListOfNameObject.create();
	return newObj;
};
oFF.SxInASpec.prototype.m_children = null;
oFF.SxInASpec.prototype.m_triggers = null;
oFF.SxInASpec.prototype.m_isCapability = false;
oFF.SxInASpec.prototype.m_enabledByCapability = null;
oFF.SxInASpec.prototype.m_primitiveValueType = null;
oFF.SxInASpec.prototype.m_arrayType = null;
oFF.SxInASpec.prototype.m_semanticType = null;
oFF.SxInASpec.prototype.m_alias = null;
oFF.SxInASpec.prototype.addCapability = function(name)
{
	var newObj = this.addStringOption(name);
	newObj.m_isCapability = true;
	newObj.m_triggers = oFF.XListOfNameObject.create();
	return newObj;
};
oFF.SxInASpec.prototype.addStringOption = function(name)
{
	return this.addChild(name, oFF.XValueType.STRING, null, oFF.XValueType.OPTION_VALUE);
};
oFF.SxInASpec.prototype.addIntOption = function(value, alias)
{
	var inaSpec = this.addChild(oFF.XInteger.convertToString(value), oFF.XValueType.INTEGER, null, oFF.XValueType.OPTION_VALUE);
	inaSpec.m_alias = alias;
	return inaSpec;
};
oFF.SxInASpec.prototype.addStringNameValue = function(name)
{
	return this.addChild(name, oFF.XValueType.STRING, null, null);
};
oFF.SxInASpec.prototype.addIntNameValue = function(name)
{
	return this.addChild(name, oFF.XValueType.INTEGER, null, null);
};
oFF.SxInASpec.prototype.addBoolFlag = function(name)
{
	return this.addChild(name, oFF.XValueType.BOOLEAN, null, null);
};
oFF.SxInASpec.prototype.addStringEnum = function(name)
{
	return this.addChild(name, oFF.XValueType.STRING, null, oFF.XValueType.ENUM_CONSTANT);
};
oFF.SxInASpec.prototype.addIntEnum = function(name)
{
	return this.addChild(name, oFF.XValueType.INTEGER, null, oFF.XValueType.ENUM_CONSTANT);
};
oFF.SxInASpec.prototype.addArray = function(name, arrayType, semanticType)
{
	return this.addChild(name, oFF.XValueType.ARRAY, arrayType, semanticType);
};
oFF.SxInASpec.prototype.addStructure = function(name)
{
	return this.addChild(name, oFF.XValueType.STRUCTURE, null, null);
};
oFF.SxInASpec.prototype.addChild = function(name, primitiveType, arrayType, semanticType)
{
	var newObj = oFF.SxInASpec.create();
	newObj._setupInternal(name);
	newObj.m_primitiveValueType = primitiveType;
	newObj.m_arrayType = arrayType;
	newObj.m_semanticType = semanticType;
	this.m_children.add(newObj);
	return newObj;
};
oFF.SxInASpec.prototype.sort = function()
{
	var comparator = oFF.XComparatorName.create();
	this.m_children.sortByComparator(comparator);
};
oFF.SxInASpec.prototype.getChildren = function()
{
	return this.m_children;
};
oFF.SxInASpec.prototype.isArray = function()
{
	return this.m_primitiveValueType === oFF.XValueType.ARRAY;
};
oFF.SxInASpec.prototype.isCapability = function()
{
	return this.m_isCapability;
};
oFF.SxInASpec.prototype.getEnabledByCapability = function()
{
	return this.m_enabledByCapability;
};
oFF.SxInASpec.prototype.enabledByCapability = function(capability)
{
	this.m_enabledByCapability = capability;
	var capSpec = oFF.SxInASpec.INA_DATA_REQUEST_CAPABILITIES.m_children.getByKey(capability);
	capSpec.m_triggers.add(this);
};
oFF.SxInASpec.prototype.getValueType = function()
{
	return this.m_primitiveValueType;
};
oFF.SxInASpec.prototype.getArrayType = function()
{
	return this.m_arrayType;
};
oFF.SxInASpec.prototype.getSemanticType = function()
{
	return this.m_semanticType;
};
oFF.SxInASpec.prototype.getAlias = function()
{
	return this.m_alias;
};
oFF.SxInASpec.prototype.getTriggerTargets = function()
{
	return this.m_triggers;
};

oFF.SxValueHelpElement = function() {};
oFF.SxValueHelpElement.prototype = new oFF.DfNameTextObject();
oFF.SxValueHelpElement.prototype._ff_c = "SxValueHelpElement";

oFF.SxValueHelpElement.CP_VALUE_HELP = null;
oFF.SxValueHelpElement.CP_FETCHING = null;
oFF.SxValueHelpElement.CP_FETCH_MORE = null;
oFF.SxValueHelpElement.CP_CLEAR = null;
oFF.SxValueHelpElement.CP_MORE = null;
oFF.SxValueHelpElement.CP_INITIAL_NODE = null;
oFF.SxValueHelpElement.FETCHING = null;
oFF.SxValueHelpElement.FETCH_MORE = null;
oFF.SxValueHelpElement.CLEAR = null;
oFF.SxValueHelpElement.MORE = null;
oFF.SxValueHelpElement.INITIAL_NODE = null;
oFF.SxValueHelpElement.staticSetup = function()
{
	oFF.SxValueHelpElement.CP_VALUE_HELP = oFF.XComponentType.createType("ValueHelp", oFF.XComponentType._UI);
	oFF.SxValueHelpElement.CP_FETCHING = oFF.XComponentType.createType("Fetching", oFF.SxValueHelpElement.CP_VALUE_HELP);
	oFF.SxValueHelpElement.CP_FETCH_MORE = oFF.XComponentType.createType("FetchMore", oFF.SxValueHelpElement.CP_VALUE_HELP);
	oFF.SxValueHelpElement.CP_CLEAR = oFF.XComponentType.createType("Clear", oFF.SxValueHelpElement.CP_VALUE_HELP);
	oFF.SxValueHelpElement.CP_MORE = oFF.XComponentType.createType("More", oFF.SxValueHelpElement.CP_VALUE_HELP);
	oFF.SxValueHelpElement.CP_INITIAL_NODE = oFF.XComponentType.createType("InitialNode", oFF.SxValueHelpElement.CP_VALUE_HELP);
	oFF.SxValueHelpElement.FETCHING = oFF.SxValueHelpElement.create(oFF.SxValueHelpElement.CP_FETCHING, "Fetching...");
	oFF.SxValueHelpElement.FETCH_MORE = oFF.SxValueHelpElement.create(oFF.SxValueHelpElement.CP_FETCH_MORE, "Fetch more...");
	oFF.SxValueHelpElement.CLEAR = oFF.SxValueHelpElement.create(oFF.SxValueHelpElement.CP_CLEAR, "=== Clear ===");
	oFF.SxValueHelpElement.MORE = oFF.SxValueHelpElement.create(oFF.SxValueHelpElement.CP_MORE, "... more");
	oFF.SxValueHelpElement.INITIAL_NODE = oFF.SxValueHelpElement.create(oFF.SxValueHelpElement.CP_INITIAL_NODE, "InitialNode");
};
oFF.SxValueHelpElement.create = function(type, text)
{
	var newObj = new oFF.SxValueHelpElement();
	newObj.m_componentType = type;
	newObj.setupWithNameText(type.getName(), text);
	return newObj;
};
oFF.SxValueHelpElement.prototype.m_componentType = null;
oFF.SxValueHelpElement.prototype.getComponentType = function()
{
	return this.m_componentType;
};

oFF.SxValueHelpOpMode = function() {};
oFF.SxValueHelpOpMode.prototype = new oFF.XConstant();
oFF.SxValueHelpOpMode.prototype._ff_c = "SxValueHelpOpMode";

oFF.SxValueHelpOpMode.SELECT_SINGLE_MEMBER = null;
oFF.SxValueHelpOpMode.SELECT_SINGLE_NODE = null;
oFF.SxValueHelpOpMode.SELECT_SINGLE_NODE_OR_MEMBER = null;
oFF.SxValueHelpOpMode.staticSetup = function()
{
	oFF.SxValueHelpOpMode.SELECT_SINGLE_MEMBER = oFF.XConstant.setupName(new oFF.SxValueHelpOpMode(), "SelectSingleMember");
	oFF.SxValueHelpOpMode.SELECT_SINGLE_NODE = oFF.XConstant.setupName(new oFF.SxValueHelpOpMode(), "SelectSingleNode");
	oFF.SxValueHelpOpMode.SELECT_SINGLE_NODE_OR_MEMBER = oFF.XConstant.setupName(new oFF.SxValueHelpOpMode(), "SelectSingleNodeOrMember");
};

oFF.TupleElementType = function() {};
oFF.TupleElementType.prototype = new oFF.XConstant();
oFF.TupleElementType.prototype._ff_c = "TupleElementType";

oFF.TupleElementType.NEW_ROWS_TUPLE_ELEMENT = null;
oFF.TupleElementType.NEW_COLUMNS_TUPLE_ELEMENT = null;
oFF.TupleElementType.staticSetup = function()
{
	oFF.TupleElementType.NEW_ROWS_TUPLE_ELEMENT = oFF.XConstant.setupName(new oFF.TupleElementType(), "NewRowsTupleElement");
	oFF.TupleElementType.NEW_COLUMNS_TUPLE_ELEMENT = oFF.XConstant.setupName(new oFF.TupleElementType(), "NewColumnsTupleElement");
};

oFF.PivotCellAlignment = function() {};
oFF.PivotCellAlignment.prototype = new oFF.XConstant();
oFF.PivotCellAlignment.prototype._ff_c = "PivotCellAlignment";

oFF.PivotCellAlignment.START = null;
oFF.PivotCellAlignment.MIDDLE = null;
oFF.PivotCellAlignment.END = null;
oFF.PivotCellAlignment.UNDEFINED = null;
oFF.PivotCellAlignment.staticSetup = function()
{
	oFF.PivotCellAlignment.START = oFF.XConstant.setupName(new oFF.PivotCellAlignment(), "Start");
	oFF.PivotCellAlignment.MIDDLE = oFF.XConstant.setupName(new oFF.PivotCellAlignment(), "Middle");
	oFF.PivotCellAlignment.END = oFF.XConstant.setupName(new oFF.PivotCellAlignment(), "End");
	oFF.PivotCellAlignment.UNDEFINED = oFF.XConstant.setupName(new oFF.PivotCellAlignment(), "Undefined");
};

oFF.PivotCellPeerDirection = function() {};
oFF.PivotCellPeerDirection.prototype = new oFF.XConstant();
oFF.PivotCellPeerDirection.prototype._ff_c = "PivotCellPeerDirection";

oFF.PivotCellPeerDirection.HORIZONTAL = null;
oFF.PivotCellPeerDirection.VERTICAL = null;
oFF.PivotCellPeerDirection.staticSetup = function()
{
	oFF.PivotCellPeerDirection.HORIZONTAL = oFF.XConstant.setupName(new oFF.PivotCellPeerDirection(), "Horizontal");
	oFF.PivotCellPeerDirection.VERTICAL = oFF.XConstant.setupName(new oFF.PivotCellPeerDirection(), "Vertical");
};

oFF.PivotCellSortingTarget = function() {};
oFF.PivotCellSortingTarget.prototype = new oFF.XConstant();
oFF.PivotCellSortingTarget.prototype._ff_c = "PivotCellSortingTarget";

oFF.PivotCellSortingTarget.DATA = null;
oFF.PivotCellSortingTarget.KEYS = null;
oFF.PivotCellSortingTarget.TEXT = null;
oFF.PivotCellSortingTarget.staticSetup = function()
{
	oFF.PivotCellSortingTarget.DATA = oFF.XConstant.setupName(new oFF.PivotCellSortingTarget(), "Data");
	oFF.PivotCellSortingTarget.KEYS = oFF.XConstant.setupName(new oFF.PivotCellSortingTarget(), "Keys");
	oFF.PivotCellSortingTarget.TEXT = oFF.XConstant.setupName(new oFF.PivotCellSortingTarget(), "Text");
};

oFF.PivotCellStyleScheme = function() {};
oFF.PivotCellStyleScheme.prototype = new oFF.XConstant();
oFF.PivotCellStyleScheme.prototype._ff_c = "PivotCellStyleScheme";

oFF.PivotCellStyleScheme.NORMAL = null;
oFF.PivotCellStyleScheme.TITLE = null;
oFF.PivotCellStyleScheme.HEADER = null;
oFF.PivotCellStyleScheme.ZEBRA = null;
oFF.PivotCellStyleScheme.READ_ONLY = null;
oFF.PivotCellStyleScheme.TOTAL = null;
oFF.PivotCellStyleScheme.GROUP_LEVEL_1 = null;
oFF.PivotCellStyleScheme.GROUP_LEVEL_2 = null;
oFF.PivotCellStyleScheme.GROUP_LEVEL_3 = null;
oFF.PivotCellStyleScheme.ALERT_9_BAD_STRONG = null;
oFF.PivotCellStyleScheme.ALERT_8_BAD_MEDIUM = null;
oFF.PivotCellStyleScheme.ALERT_7_BAD_LIGHT = null;
oFF.PivotCellStyleScheme.ALERT_6_CRITICAL_STRONG = null;
oFF.PivotCellStyleScheme.ALERT_5_CRITICAL_MEDIUM = null;
oFF.PivotCellStyleScheme.ALERT_4_CRITICAL_LIGHT = null;
oFF.PivotCellStyleScheme.ALERT_3_GOOD_LIGHT = null;
oFF.PivotCellStyleScheme.ALERT_2_GOOD_MEDIUM = null;
oFF.PivotCellStyleScheme.ALERT_1_GOOD_STRONG = null;
oFF.PivotCellStyleScheme.staticSetup = function()
{
	oFF.PivotCellStyleScheme.NORMAL = oFF.XConstant.setupName(new oFF.PivotCellStyleScheme(), "Normal");
	oFF.PivotCellStyleScheme.TITLE = oFF.XConstant.setupName(new oFF.PivotCellStyleScheme(), "Title");
	oFF.PivotCellStyleScheme.HEADER = oFF.XConstant.setupName(new oFF.PivotCellStyleScheme(), "Header");
	oFF.PivotCellStyleScheme.ZEBRA = oFF.XConstant.setupName(new oFF.PivotCellStyleScheme(), "Zebra");
	oFF.PivotCellStyleScheme.READ_ONLY = oFF.XConstant.setupName(new oFF.PivotCellStyleScheme(), "ReadOnly");
	oFF.PivotCellStyleScheme.TOTAL = oFF.XConstant.setupName(new oFF.PivotCellStyleScheme(), "Total");
	oFF.PivotCellStyleScheme.GROUP_LEVEL_1 = oFF.XConstant.setupName(new oFF.PivotCellStyleScheme(), "GroupLevel1");
	oFF.PivotCellStyleScheme.GROUP_LEVEL_2 = oFF.XConstant.setupName(new oFF.PivotCellStyleScheme(), "GroupLevel2");
	oFF.PivotCellStyleScheme.GROUP_LEVEL_3 = oFF.XConstant.setupName(new oFF.PivotCellStyleScheme(), "GroupLevel3");
	oFF.PivotCellStyleScheme.ALERT_9_BAD_STRONG = oFF.XConstant.setupName(new oFF.PivotCellStyleScheme(), "AlertBadStrong");
	oFF.PivotCellStyleScheme.ALERT_8_BAD_MEDIUM = oFF.XConstant.setupName(new oFF.PivotCellStyleScheme(), "AlertBadMedium");
	oFF.PivotCellStyleScheme.ALERT_7_BAD_LIGHT = oFF.XConstant.setupName(new oFF.PivotCellStyleScheme(), "AlertBadLight");
	oFF.PivotCellStyleScheme.ALERT_6_CRITICAL_STRONG = oFF.XConstant.setupName(new oFF.PivotCellStyleScheme(), "AlertCriticalStrong");
	oFF.PivotCellStyleScheme.ALERT_5_CRITICAL_MEDIUM = oFF.XConstant.setupName(new oFF.PivotCellStyleScheme(), "AlertCriticalMedium");
	oFF.PivotCellStyleScheme.ALERT_4_CRITICAL_LIGHT = oFF.XConstant.setupName(new oFF.PivotCellStyleScheme(), "AlertCriticalLight");
	oFF.PivotCellStyleScheme.ALERT_3_GOOD_LIGHT = oFF.XConstant.setupName(new oFF.PivotCellStyleScheme(), "AlertGoodLight");
	oFF.PivotCellStyleScheme.ALERT_2_GOOD_MEDIUM = oFF.XConstant.setupName(new oFF.PivotCellStyleScheme(), "AlertGoodMedium");
	oFF.PivotCellStyleScheme.ALERT_1_GOOD_STRONG = oFF.XConstant.setupName(new oFF.PivotCellStyleScheme(), "AlertGoodStrong");
};

oFF.CellType = function() {};
oFF.CellType.prototype = new oFF.XConstant();
oFF.CellType.prototype._ff_c = "CellType";

oFF.CellType.PV_DATACELL = null;
oFF.CellType.PV_NEWLINE_DATACELL = null;
oFF.CellType.PV_NEWLINE_HEADERCELL = null;
oFF.CellType.staticSetup = function()
{
	oFF.CellType.PV_DATACELL = oFF.XConstant.setupName(new oFF.CellType(), "CDC");
	oFF.CellType.PV_NEWLINE_DATACELL = oFF.XConstant.setupName(new oFF.CellType(), "NDC");
	oFF.CellType.PV_NEWLINE_HEADERCELL = oFF.XConstant.setupName(new oFF.CellType(), "NHC");
};

oFF.ExceptionRenderingType = function() {};
oFF.ExceptionRenderingType.prototype = new oFF.XConstant();
oFF.ExceptionRenderingType.prototype._ff_c = "ExceptionRenderingType";

oFF.ExceptionRenderingType.COLOR = null;
oFF.ExceptionRenderingType.SYMBOL = null;
oFF.ExceptionRenderingType.SYMBOL_TEXT = null;
oFF.ExceptionRenderingType.TEXT_SYMBOL = null;
oFF.ExceptionRenderingType.staticSetup = function()
{
	oFF.ExceptionRenderingType.COLOR = oFF.XConstant.setupName(new oFF.ExceptionRenderingType(), "COLOR");
	oFF.ExceptionRenderingType.SYMBOL = oFF.XConstant.setupName(new oFF.ExceptionRenderingType(), "SYMBOL");
	oFF.ExceptionRenderingType.SYMBOL_TEXT = oFF.XConstant.setupName(new oFF.ExceptionRenderingType(), "SYMBOL_TEXT");
	oFF.ExceptionRenderingType.TEXT_SYMBOL = oFF.XConstant.setupName(new oFF.ExceptionRenderingType(), "TEXT_SYMBOL");
};

oFF.LineType = function() {};
oFF.LineType.prototype = new oFF.XConstant();
oFF.LineType.prototype._ff_c = "LineType";

oFF.LineType.UNDEFINED = null;
oFF.LineType.ROW_TUPLE = null;
oFF.LineType.COLUMN_TUPLE = null;
oFF.LineType.SELECTION = null;
oFF.LineType.staticSetup = function()
{
	oFF.LineType.UNDEFINED = oFF.XConstant.setupName(new oFF.LineType(), "LUD");
	oFF.LineType.ROW_TUPLE = oFF.XConstant.setupName(new oFF.LineType(), "LRT");
	oFF.LineType.COLUMN_TUPLE = oFF.XConstant.setupName(new oFF.LineType(), "LCT");
	oFF.LineType.SELECTION = oFF.XConstant.setupName(new oFF.LineType(), "LSE");
};

oFF.EmptyMatrix = function() {};
oFF.EmptyMatrix.prototype = new oFF.VirtualMatrix();
oFF.EmptyMatrix.prototype._ff_c = "EmptyMatrix";

oFF.EmptyMatrix.createEmptyMatrix = function(client, name, width, height, cell)
{
	var object = new oFF.EmptyMatrix();
	object.setupExt("Empty Matrix", client, null);
	object.m_widthEm = width;
	object.m_heightEm = height;
	object.m_recycleCell = cell;
	object.m_styleScheme = cell.getStyleScheme();
	object.m_cellType = cell.getPivotCellType();
	object.m_cellDragDropObject = cell.getDragDropObject();
	object.m_rowLines = oFF.XList.create();
	object.m_columnLines = oFF.XList.create();
	return object;
};
oFF.EmptyMatrix.prototype.m_widthEm = 0;
oFF.EmptyMatrix.prototype.m_heightEm = 0;
oFF.EmptyMatrix.prototype.m_recycleCell = null;
oFF.EmptyMatrix.prototype.m_cellType = null;
oFF.EmptyMatrix.prototype.m_styleScheme = null;
oFF.EmptyMatrix.prototype.m_cellDragDropObject = null;
oFF.EmptyMatrix.prototype.m_rowLines = null;
oFF.EmptyMatrix.prototype.m_columnLines = null;
oFF.EmptyMatrix.prototype.getCell = function(x, y)
{
	this.m_recycleCell.setPivotCellType(this.m_cellType);
	this.m_recycleCell.setStyleScheme(this.m_styleScheme);
	this.m_recycleCell.setDragDropObject(this.m_cellDragDropObject);
	return this.m_recycleCell;
};
oFF.EmptyMatrix.prototype.getColumn = function(x)
{
	if (this.m_columnLines.get(x) === null)
	{
		this.m_columnLines.set(x, oFF.VirtualLine.create(oFF.LineType.UNDEFINED, oFF.XInteger.convertToString(x)));
	}
	return this.m_columnLines.get(x);
};
oFF.EmptyMatrix.prototype.getRow = function(y)
{
	if (this.m_rowLines.get(y) === null)
	{
		this.m_rowLines.set(y, oFF.VirtualLine.create(oFF.LineType.UNDEFINED, oFF.XInteger.convertToString(y)));
	}
	return this.m_rowLines.get(y);
};
oFF.EmptyMatrix.prototype.getFixedColumnsCount = function()
{
	return 0;
};
oFF.EmptyMatrix.prototype.getFixedRowsCount = function()
{
	return 0;
};
oFF.EmptyMatrix.prototype.getColumnCount = function()
{
	return this.m_widthEm;
};
oFF.EmptyMatrix.prototype.getRowCount = function()
{
	return this.m_heightEm;
};

oFF.VirtualMatrixBlockMerge = function() {};
oFF.VirtualMatrixBlockMerge.prototype = new oFF.VirtualMatrix();
oFF.VirtualMatrixBlockMerge.prototype._ff_c = "VirtualMatrixBlockMerge";

oFF.VirtualMatrixBlockMerge.createLocalBlockMerge = function(client, cellFactory)
{
	var object = new oFF.VirtualMatrixBlockMerge();
	object.setupBlockMerge(client, cellFactory);
	return object;
};
oFF.VirtualMatrixBlockMerge.hasContent = function(matrix)
{
	return oFF.notNull(matrix) && matrix.getColumnCount() > 0 && matrix.getRowCount() > 0;
};
oFF.VirtualMatrixBlockMerge.prototype.m_widthBm = 0;
oFF.VirtualMatrixBlockMerge.prototype.m_heightBm = 0;
oFF.VirtualMatrixBlockMerge.prototype.m_width_block_I_and_III = 0;
oFF.VirtualMatrixBlockMerge.prototype.m_height_block_I_and_II = 0;
oFF.VirtualMatrixBlockMerge.prototype.m_section_I = null;
oFF.VirtualMatrixBlockMerge.prototype.m_section_II = null;
oFF.VirtualMatrixBlockMerge.prototype.m_section_III = null;
oFF.VirtualMatrixBlockMerge.prototype.m_section_IV = null;
oFF.VirtualMatrixBlockMerge.prototype.m_section_I_hidden = null;
oFF.VirtualMatrixBlockMerge.prototype.m_section_II_hidden = null;
oFF.VirtualMatrixBlockMerge.prototype.m_section_III_hidden = null;
oFF.VirtualMatrixBlockMerge.prototype.m_section_IV_hidden = null;
oFF.VirtualMatrixBlockMerge.prototype.m_dropObjectBlankSection_II = null;
oFF.VirtualMatrixBlockMerge.prototype.m_dropObjectBlankSection_III = null;
oFF.VirtualMatrixBlockMerge.prototype.setupBlockMerge = function(client, cellFactory)
{
	oFF.VirtualMatrix.prototype.setupExt.call( this , "Block Merge", client, null);
	this.setCellFactory(cellFactory);
};
oFF.VirtualMatrixBlockMerge.prototype.prepareMatrix = function()
{
	var oldState = oFF.VirtualMatrix.prototype.prepareMatrix.call( this );
	if (oldState === oFF.MxGridState.UNINITIALIZED)
	{
		var width_I = 0;
		var height_I = 0;
		if (oFF.notNull(this.m_section_I) && oFF.VirtualMatrixBlockMerge.hasContent(this.m_section_I) === false)
		{
			this.m_section_I_hidden = this.m_section_I;
			this.m_section_I = null;
		}
		if (oFF.notNull(this.m_section_I))
		{
			width_I = this.m_section_I.getColumnCount();
			height_I = this.m_section_I.getRowCount();
		}
		var width_II = 0;
		var height_II = 0;
		if (oFF.notNull(this.m_section_II) && oFF.VirtualMatrixBlockMerge.hasContent(this.m_section_II) === false)
		{
			this.m_section_II_hidden = this.m_section_II;
			this.m_section_II = null;
		}
		if (oFF.notNull(this.m_section_II))
		{
			width_II = this.m_section_II.getColumnCount();
			height_II = this.m_section_II.getRowCount();
		}
		var width_III = 0;
		var height_III = 0;
		if (oFF.notNull(this.m_section_III) && oFF.VirtualMatrixBlockMerge.hasContent(this.m_section_III) === false)
		{
			this.m_section_III_hidden = this.m_section_III;
			this.m_section_III = null;
		}
		if (oFF.notNull(this.m_section_III))
		{
			width_III = this.m_section_III.getColumnCount();
			height_III = this.m_section_III.getRowCount();
		}
		var width_IV = 0;
		var height_IV = 0;
		if (oFF.notNull(this.m_section_IV) && oFF.VirtualMatrixBlockMerge.hasContent(this.m_section_IV) === false)
		{
			this.m_section_IV_hidden = this.m_section_IV;
			this.m_section_IV = null;
		}
		if (oFF.notNull(this.m_section_IV))
		{
			width_IV = this.m_section_IV.getColumnCount();
			height_IV = this.m_section_IV.getRowCount();
		}
		this.m_width_block_I_and_III = oFF.XMath.max(width_I, width_III);
		this.m_height_block_I_and_II = oFF.XMath.max(height_I, height_II);
		var width_block_II_and_IV = oFF.XMath.max(width_II, width_IV);
		var height_block_III_and_IV = oFF.XMath.max(height_III, height_IV);
		if (oFF.isNull(this.m_section_I))
		{
			this.m_section_I = this.createEmptySection(this.getMatrixClient(), 1, this.m_width_block_I_and_III, this.m_height_block_I_and_II, null);
		}
		if (oFF.isNull(this.m_section_II))
		{
			this.m_section_II = this.createEmptySection(this.getMatrixClient(), 2, width_block_II_and_IV, this.m_height_block_I_and_II, this.m_dropObjectBlankSection_II);
		}
		if (oFF.isNull(this.m_section_III))
		{
			this.m_section_III = this.createEmptySection(this.getMatrixClient(), 3, this.m_width_block_I_and_III, height_block_III_and_IV, this.m_dropObjectBlankSection_III);
		}
		if (oFF.isNull(this.m_section_IV))
		{
			this.m_section_IV = this.createEmptySection(this.getMatrixClient(), 4, width_block_II_and_IV, height_block_III_and_IV, null);
		}
		this.m_widthBm = this.m_width_block_I_and_III + width_block_II_and_IV;
		this.m_heightBm = this.m_height_block_I_and_II + height_block_III_and_IV;
	}
	this.m_section_I.prepareMatrix();
	if (oFF.notNull(this.m_section_I_hidden))
	{
		this.m_section_I_hidden.prepareMatrix();
	}
	this.m_section_II.prepareMatrix();
	if (oFF.notNull(this.m_section_II_hidden))
	{
		this.m_section_II_hidden.prepareMatrix();
	}
	this.m_section_III.prepareMatrix();
	if (oFF.notNull(this.m_section_III_hidden))
	{
		this.m_section_III_hidden.prepareMatrix();
	}
	this.m_section_IV.prepareMatrix();
	if (oFF.notNull(this.m_section_IV_hidden))
	{
		this.m_section_IV_hidden.prepareMatrix();
	}
	return oldState;
};
oFF.VirtualMatrixBlockMerge.prototype.createVirtualCell = function(x, y)
{
	if (y < this.m_height_block_I_and_II)
	{
		if (x < this.m_width_block_I_and_III)
		{
			return this.m_section_I.getPivotCell(x, y);
		}
		var xCorrected = x - this.m_width_block_I_and_III;
		return this.m_section_II.getPivotCell(xCorrected, y);
	}
	var yCorrected = y - this.m_height_block_I_and_II;
	if (x < this.m_width_block_I_and_III)
	{
		return this.m_section_III.getPivotCell(x, yCorrected);
	}
	var xCorrected2 = x - this.m_width_block_I_and_III;
	return this.m_section_IV.getPivotCell(xCorrected2, yCorrected);
};
oFF.VirtualMatrixBlockMerge.prototype.createRowInfo = function(absoluteY)
{
	var row = null;
	if (absoluteY < this.m_height_block_I_and_II)
	{
		row = this.m_section_I.getPivotRow(absoluteY);
		if (oFF.isNull(row))
		{
			row = this.m_section_II.getPivotRow(absoluteY);
		}
		if (oFF.notNull(row))
		{
			row.setIsSelectable(false);
		}
	}
	else
	{
		var relativeY = absoluteY - this.m_height_block_I_and_II;
		row = this.m_section_III.getPivotRow(relativeY);
		if (oFF.isNull(row))
		{
			row = this.m_section_IV.getPivotRow(relativeY);
		}
		if (oFF.notNull(row))
		{
			row.setIsSelectable(true);
		}
	}
	if (oFF.isNull(row))
	{
		throw oFF.XException.createIllegalStateException("Assertion: Row is missing");
	}
	return row;
};
oFF.VirtualMatrixBlockMerge.prototype.createColumnInfo = function(absoluteX)
{
	var col = null;
	if (absoluteX < this.m_width_block_I_and_III)
	{
		col = this.m_section_I.getPivotColumn(absoluteX);
		if (oFF.isNull(col))
		{
			col = this.m_section_III.getPivotColumn(absoluteX);
		}
		if (oFF.notNull(col))
		{
			col.setIsSelectable(false);
		}
	}
	else
	{
		var relativeX = absoluteX - this.m_width_block_I_and_III;
		col = this.m_section_II.getPivotColumn(relativeX);
		if (oFF.isNull(col))
		{
			col = this.m_section_IV.getPivotColumn(relativeX);
		}
		if (oFF.notNull(col))
		{
			col.setIsSelectable(true);
		}
	}
	if (oFF.isNull(col))
	{
		throw oFF.XException.createIllegalStateException("Assertion: Column is missing");
	}
	return col;
};
oFF.VirtualMatrixBlockMerge.prototype.createEmptySection = function(client, section, width, height, drop)
{
	var cell;
	if (section === 1)
	{
		cell = this.getCellFactory().createTitleCell();
	}
	else if (section === 2 || section === 3)
	{
		cell = this.getCellFactory().createHeaderCell();
	}
	else
	{
		cell = this.getCellFactory().createDataCell();
	}
	cell.setDragDropObject(drop);
	var emptyMatrix = oFF.EmptyMatrix.createEmptyMatrix(client, oFF.XStringUtils.concatenate2("Empty Section ", oFF.XInteger.convertToString(section)), width, height, cell);
	return emptyMatrix;
};
oFF.VirtualMatrixBlockMerge.prototype.getCell = function(x, y)
{
	return this.createVirtualCell(x, y);
};
oFF.VirtualMatrixBlockMerge.prototype.getColumnCount = function()
{
	return this.m_widthBm;
};
oFF.VirtualMatrixBlockMerge.prototype.getRowCount = function()
{
	return this.m_heightBm;
};
oFF.VirtualMatrixBlockMerge.prototype.getFixedColumnsCount = function()
{
	return this.m_width_block_I_and_III;
};
oFF.VirtualMatrixBlockMerge.prototype.getFixedRowsCount = function()
{
	return this.m_height_block_I_and_II;
};
oFF.VirtualMatrixBlockMerge.prototype.setSection_I = function(section)
{
	this.m_section_I = section;
};
oFF.VirtualMatrixBlockMerge.prototype.setSection_II = function(section)
{
	this.m_section_II = section;
};
oFF.VirtualMatrixBlockMerge.prototype.setSection_II_hidden = function(section)
{
	this.m_section_II_hidden = section;
};
oFF.VirtualMatrixBlockMerge.prototype.setSection_III = function(section)
{
	this.m_section_III = section;
};
oFF.VirtualMatrixBlockMerge.prototype.setSection_III_hidden = function(section)
{
	this.m_section_III_hidden = section;
};
oFF.VirtualMatrixBlockMerge.prototype.setSection_IV = function(section)
{
	this.m_section_IV = section;
};
oFF.VirtualMatrixBlockMerge.prototype.setDropObjectForBlankSectionII = function(dropObject)
{
	this.m_dropObjectBlankSection_II = dropObject;
};
oFF.VirtualMatrixBlockMerge.prototype.setDropObjectForBlankSectionIII = function(dropObject)
{
	this.m_dropObjectBlankSection_III = dropObject;
};
oFF.VirtualMatrixBlockMerge.prototype.getColumn = function(x)
{
	return this.createColumnInfo(x);
};
oFF.VirtualMatrixBlockMerge.prototype.getRow = function(y)
{
	return this.createRowInfo(y);
};

oFF.VirtualMatrixDeepCopy = function() {};
oFF.VirtualMatrixDeepCopy.prototype = new oFF.VirtualMatrix();
oFF.VirtualMatrixDeepCopy.prototype._ff_c = "VirtualMatrixDeepCopy";

oFF.VirtualMatrixDeepCopy.prototype.m_allCells = null;
oFF.VirtualMatrixDeepCopy.prototype.m_cols = 0;
oFF.VirtualMatrixDeepCopy.prototype.prepareMatrix = function()
{
	var state = oFF.VirtualMatrix.prototype.prepareMatrix.call( this );
	this.m_cols = this.getColumnCount();
	this.m_allCells = oFF.XList.create();
	return state;
};
oFF.VirtualMatrixDeepCopy.prototype.getCell = function(x, y)
{
	var pos = y * this.m_cols + x;
	var iMxGridCell = this.m_allCells.get(pos);
	if (oFF.isNull(iMxGridCell))
	{
		iMxGridCell = oFF.VirtualMatrix.prototype.getCell.call( this , x, y);
		var deepCopy = iMxGridCell.deepCopy();
		this.m_allCells.set(pos, deepCopy);
		iMxGridCell = deepCopy;
	}
	return iMxGridCell;
};

oFF.VirtualMatrixGlobalSettings = function() {};
oFF.VirtualMatrixGlobalSettings.prototype = new oFF.VirtualMatrix();
oFF.VirtualMatrixGlobalSettings.prototype._ff_c = "VirtualMatrixGlobalSettings";

oFF.VirtualMatrixGlobalSettings.create = function(origin, settings)
{
	var object = new oFF.VirtualMatrixGlobalSettings();
	object.setupExt("Global Settings", origin.getMatrixClient(), origin);
	object.m_settings = settings;
	return object;
};
oFF.VirtualMatrixGlobalSettings.prototype.m_settings = null;
oFF.VirtualMatrixGlobalSettings.prototype.getCell = function(x, y)
{
	var currentCell = this.m_origin.getCell(x, y);
	var hasAlertSymbols = this.m_settings.getExceptionRendering() !== oFF.ExceptionRenderingType.COLOR;
	var isAlertSymbolBeforeText = this.m_settings.getExceptionRendering() !== oFF.ExceptionRenderingType.TEXT_SYMBOL;
	var isGlobalInputEnabled = false;
	var headerRowCount = this.m_origin.getFixedRowsCount();
	var isZebraLine = false;
	if (isGlobalInputEnabled === false && this.m_settings.hasAlternatingStyles() && y >= headerRowCount)
	{
		oFF.noSupport();
	}
	this.processCell(currentCell, isZebraLine, hasAlertSymbols, isAlertSymbolBeforeText);
	return currentCell;
};
oFF.VirtualMatrixGlobalSettings.prototype.processCell = function(cell, isZebraLine, hasAlertSymbols, isAlertSymbolBeforeText)
{
	cell.setIsInteractionAllowed(this.m_settings.isInteractionAllowed());
	var styleScheme = cell.getStyleScheme();
	if (cell.getPivotCellType().isTypeOf(oFF.PivotCellType.DATA) && styleScheme === oFF.UiSemanticCellStyle.STANDARD && isZebraLine)
	{
		cell.setStyleScheme(oFF.UiSemanticCellStyle.ALTERNATING);
	}
	cell.setIsMicroContentVisible(cell.getMicroContent() !== null);
	if (this.m_settings.getExceptionRendering() === oFF.ExceptionRenderingType.COLOR)
	{
		this.drawExceptionColoring(cell);
	}
	if (cell.isMicroContentVisible() === false)
	{
		var isAlertSymbolVisible = hasAlertSymbols && cell.getAlertLevel() !== oFF.AlertLevel.NORMAL;
		if (isAlertSymbolVisible)
		{
			var clientType = this.m_settings.getClientType();
			if (clientType !== oFF.UiClientType.EXCEL && clientType !== oFF.UiClientType.EXCEL_2000)
			{
				var mime = this.createAlertSymbolMime(cell);
				if (isAlertSymbolBeforeText)
				{
					cell.setMimeBeforeText(mime);
				}
				else
				{
					cell.setMimeAfterText(mime);
				}
			}
			else
			{
				this.drawExceptionColoring(cell);
			}
		}
		if (cell.isDataInputVisible() === false && cell.isTupleElementInputVisible() === false && (isAlertSymbolVisible === false || this.m_settings.getExceptionRendering() !== oFF.ExceptionRenderingType.SYMBOL))
		{
			cell.setIsTextVisible(true);
		}
		if (cell.getMimeBeforeText() === null && cell.getMimeAfterText() === null && cell.isDataInputVisible() === false && cell.isTupleElementInputVisible() === false && cell.isDocumentSymbolVisible() === false && cell.isTextVisible() === false && cell.getDragDropObject() !== null)
		{
			cell.setIsSpaceDropAreaVisible(true);
		}
	}
	if (cell.getPivotCellType().isTypeOf(oFF.PivotCellType.TWIN))
	{
		this.processCell(cell.getLeftCell(), isZebraLine, hasAlertSymbols, isAlertSymbolBeforeText);
		this.processCell(cell.getRightCell(), isZebraLine, hasAlertSymbols, isAlertSymbolBeforeText);
	}
};
oFF.VirtualMatrixGlobalSettings.prototype.createAlertSymbolMime = function(cell)
{
	return null;
};
oFF.VirtualMatrixGlobalSettings.prototype.drawExceptionColoring = function(cell)
{
	var alertLevel = cell.getAlertLevel();
	if (alertLevel === oFF.AlertLevel.GOOD_1)
	{
		cell.setStyleScheme(oFF.UiSemanticCellStyle.ALERT_1_GOOD_STRONG);
	}
	else if (alertLevel === oFF.AlertLevel.GOOD_2)
	{
		cell.setStyleScheme(oFF.UiSemanticCellStyle.ALERT_2_GOOD_MEDIUM);
	}
	else if (alertLevel === oFF.AlertLevel.GOOD_3)
	{
		cell.setStyleScheme(oFF.UiSemanticCellStyle.ALERT_3_GOOD_LIGHT);
	}
	else if (alertLevel === oFF.AlertLevel.CRITICAL_1)
	{
		cell.setStyleScheme(oFF.UiSemanticCellStyle.ALERT_4_CRITICAL_LIGHT);
	}
	else if (alertLevel === oFF.AlertLevel.CRITICAL_2)
	{
		cell.setStyleScheme(oFF.UiSemanticCellStyle.ALERT_5_CRITICAL_MEDIUM);
	}
	else if (alertLevel === oFF.AlertLevel.CRITICAL_3)
	{
		cell.setStyleScheme(oFF.UiSemanticCellStyle.ALERT_6_CRITICAL_STRONG);
	}
	else if (alertLevel === oFF.AlertLevel.BAD_1)
	{
		cell.setStyleScheme(oFF.UiSemanticCellStyle.ALERT_7_BAD_LIGHT);
	}
	else if (alertLevel === oFF.AlertLevel.BAD_2)
	{
		cell.setStyleScheme(oFF.UiSemanticCellStyle.ALERT_8_BAD_MEDIUM);
	}
	else if (alertLevel === oFF.AlertLevel.BAD_3)
	{
		cell.setStyleScheme(oFF.UiSemanticCellStyle.ALERT_9_BAD_STRONG);
	}
};

oFF.VirtualMatrixInsert = function() {};
oFF.VirtualMatrixInsert.prototype = new oFF.VirtualMatrix();
oFF.VirtualMatrixInsert.prototype._ff_c = "VirtualMatrixInsert";

oFF.VirtualMatrixInsert.prototype.setupInsert = function(origin, cellFactory)
{
	oFF.VirtualMatrix.prototype.setupExt.call( this , "Insert", origin.getMatrixClient(), origin);
	this.setCellFactory(cellFactory);
};
oFF.VirtualMatrixInsert.prototype.createOriginLine = function(originLine)
{
	var line = new oFF.VirtualMatrixInsertLine();
	line.m_isOrigin = true;
	line.m_originIndex = originLine;
	return line;
};
oFF.VirtualMatrixInsert.prototype.add = oFF.noSupport;
oFF.VirtualMatrixInsert.prototype.insert = oFF.noSupport;

oFF.VirtualMatrixPivot = function() {};
oFF.VirtualMatrixPivot.prototype = new oFF.VirtualMatrix();
oFF.VirtualMatrixPivot.prototype._ff_c = "VirtualMatrixPivot";

oFF.VirtualMatrixPivot.create = function(origin)
{
	var object = new oFF.VirtualMatrixPivot();
	object.setupExt("Pivot", origin.getMatrixClient(), origin);
	return object;
};
oFF.VirtualMatrixPivot.prototype.getCell = function(x, y)
{
	var cell = this.m_origin.getCell(y, x);
	cell.setIsPivoted(true);
	return cell;
};
oFF.VirtualMatrixPivot.prototype.getColumn = function(x)
{
	return this.m_origin.getRow(x);
};
oFF.VirtualMatrixPivot.prototype.getRow = function(y)
{
	return this.m_origin.getColumn(y);
};
oFF.VirtualMatrixPivot.prototype.getColumnCount = function()
{
	return this.m_origin.getRowCount();
};
oFF.VirtualMatrixPivot.prototype.getRowCount = function()
{
	return this.m_origin.getColumnCount();
};
oFF.VirtualMatrixPivot.prototype.getFixedColumnsCount = function()
{
	return this.m_origin.getFixedRowsCount();
};
oFF.VirtualMatrixPivot.prototype.getFixedRowsCount = function()
{
	return this.m_origin.getFixedColumnsCount();
};

oFF.Section_IV = function() {};
oFF.Section_IV.prototype = new oFF.VirtualMatrix();
oFF.Section_IV.prototype._ff_c = "Section_IV";

oFF.Section_IV.create = function(client, app, rowInfo, columnInfo, rs, hasDocuments, cellFactory)
{
	if (rs.getAvailableDataCellCount() > 0)
	{
		if (columnInfo.getMomentum().isFilled() && rowInfo.getMomentum().isFilled())
		{
			return oFF.Section_IV_Full.createIVFull(client, app, rowInfo, columnInfo, rs, hasDocuments, cellFactory);
		}
		else if (columnInfo.getMomentum().isFilled())
		{
			return oFF.Section_IV_ColumnsOnly.createIVColumnsOnly(client, app, rowInfo, columnInfo, rs, hasDocuments, cellFactory);
		}
		else if (rowInfo.getMomentum().isFilled())
		{
			return oFF.Section_IV_RowsOnly.createIVRowsOnly(client, app, rowInfo, columnInfo, rs, hasDocuments, cellFactory);
		}
		else
		{
			return oFF.Section_IV_Collapsed.createIVCollapsed(client, app, rowInfo, columnInfo, rs, hasDocuments, cellFactory);
		}
	}
	return oFF.Section_IV_NewLines.createIVNewLines(client, app, rowInfo, columnInfo, rs, hasDocuments, cellFactory);
};
oFF.Section_IV.prototype.m_rowInfo = null;
oFF.Section_IV.prototype.m_columnInfo = null;
oFF.Section_IV.prototype.m_resultSet = null;
oFF.Section_IV.prototype.m_hasDocuments = false;
oFF.Section_IV.prototype.m_application = null;
oFF.Section_IV.prototype.m_recycleDataCell = null;
oFF.Section_IV.prototype.m_columnCount = 0;
oFF.Section_IV.prototype.m_rowCount = 0;
oFF.Section_IV.prototype.setupIV = function(client, app, rowInfo, columnInfo, rs, hasDocuments, cellFactory)
{
	this.setupExt("Section IV", client, null);
	this.setCellFactory(cellFactory);
	this.m_application = app;
	this.m_columnInfo = columnInfo;
	this.m_rowInfo = rowInfo;
	this.m_resultSet = rs;
	this.m_hasDocuments = hasDocuments;
	this.m_recycleDataCell = cellFactory.createDataCell();
};
oFF.Section_IV.prototype.createNewDataRow = function(rowTuple, index)
{
	return this.createNewDataCells(rowTuple, index, this.m_columnInfo, true);
};
oFF.Section_IV.prototype.createNewDataColumn = function(columnTuple, index)
{
	return this.createNewDataCells(columnTuple, index, this.m_rowInfo, false);
};
oFF.Section_IV.prototype.createNewDataCells = function(tuple, index, orthogonalAxisRenderer, isRow)
{
	var axisElementCount = orthogonalAxisRenderer.getDataset().getResultsetAxis().getTupleElementsCount();
	var dataLine = oFF.XList.create();
	orthogonalAxisRenderer.prepareMatrix();
	var cellFactory = this.getCellFactory();
	for (var dataPosition = 0; dataPosition < axisElementCount; dataPosition++)
	{
		var currentHeaderState = orthogonalAxisRenderer.getLine(dataPosition).getHeaderState();
		var isUnitVisible = currentHeaderState.displayUnitInCell();
		var total = currentHeaderState.isTotals();
		var rsCell;
		if (isRow)
		{
			rsCell = this.m_resultSet.getDataCellByTuples(currentHeaderState.getTuple(), tuple);
		}
		else
		{
			rsCell = this.m_resultSet.getDataCellByTuples(tuple, currentHeaderState.getTuple());
		}
		var dataCell = cellFactory.createDataCell();
		dataCell.set(this.m_application, rsCell, oFF.CellType.PV_NEWLINE_DATACELL, index, dataPosition, isUnitVisible, total, this.m_hasDocuments);
		dataLine.set(dataPosition, dataCell);
	}
	return dataLine;
};
oFF.Section_IV.prototype.getColumn = function(x)
{
	return null;
};
oFF.Section_IV.prototype.getRow = function(y)
{
	return null;
};
oFF.Section_IV.prototype.getFixedColumnsCount = function()
{
	return 0;
};
oFF.Section_IV.prototype.getFixedRowsCount = function()
{
	return 0;
};
oFF.Section_IV.prototype.getColumnCount = function()
{
	return this.m_columnCount;
};
oFF.Section_IV.prototype.getRowCount = function()
{
	return this.m_rowCount;
};

oFF.Total = function() {};
oFF.Total.prototype = new oFF.XConstant();
oFF.Total.prototype._ff_c = "Total";

oFF.Total.NONE = null;
oFF.Total.ANCHOR = null;
oFF.Total.PRIMARY = null;
oFF.Total.SECONDARY = null;
oFF.Total.staticSetup = function()
{
	oFF.Total.NONE = oFF.XConstant.setupName(new oFF.Total(), "NONE");
	oFF.Total.ANCHOR = oFF.XConstant.setupName(new oFF.Total(), "ANCHOR");
	oFF.Total.PRIMARY = oFF.XConstant.setupName(new oFF.Total(), "PRIMARY");
	oFF.Total.SECONDARY = oFF.XConstant.setupName(new oFF.Total(), "SECONDARY");
};

oFF.Section_II_III = function() {};
oFF.Section_II_III.prototype = new oFF.VirtualMatrix();
oFF.Section_II_III.prototype._ff_c = "Section_II_III";

oFF.Section_II_III.create = function(client, axisMomentum, cellFactory)
{
	var object = new oFF.Section_II_III();
	object.instanceSetup();
	object.setupExt("Section II III", client, null);
	object.setCellFactory(cellFactory);
	object.m_momentum = axisMomentum;
	object.m_dataset = axisMomentum.getDataset();
	object.m_widthSec = object.m_momentum.getTitleStatesCore(false).size();
	object.m_heightSec = object.m_dataset.getResultsetAxis().getDataCount();
	object.m_isOnTheFly = axisMomentum.getDataset().getAxisName() === oFF.AxisType.ROWS;
	if (object.m_isOnTheFly)
	{
		object.m_recycleLine = oFF.HeaderLine.createHeaderLine();
	}
	return object;
};
oFF.Section_II_III.prototype.m_momentum = null;
oFF.Section_II_III.prototype.m_dataset = null;
oFF.Section_II_III.prototype.m_recycledHeaderCell = null;
oFF.Section_II_III.prototype.m_recycleLine = null;
oFF.Section_II_III.prototype.m_widthSec = 0;
oFF.Section_II_III.prototype.m_heightSec = 0;
oFF.Section_II_III.prototype.m_cursorIndex = 0;
oFF.Section_II_III.prototype.m_lineArray = null;
oFF.Section_II_III.prototype.m_cursorLine = null;
oFF.Section_II_III.prototype.m_headerStateTitleArray = null;
oFF.Section_II_III.prototype.m_isOnTheFly = false;
oFF.Section_II_III.prototype.instanceSetup = function()
{
	this.m_cursorIndex = -1;
};
oFF.Section_II_III.prototype.allocateHeaderCell = function(index, max, forceNew)
{
	if (this.m_isOnTheFly === false || forceNew)
	{
		return this.getCellFactory().createHeaderCell();
	}
	if (oFF.isNull(this.m_recycledHeaderCell))
	{
		this.m_recycledHeaderCell = oFF.XArray.create(max);
		for (var i = 0; i < max; i++)
		{
			this.m_recycledHeaderCell.set(i, this.getCellFactory().createHeaderCell());
		}
	}
	var cell = this.m_recycledHeaderCell.get(index);
	return cell;
};
oFF.Section_II_III.prototype.prepareMatrix = function()
{
	var oldState = oFF.VirtualMatrix.prototype.prepareMatrix.call( this );
	if (oldState === oFF.MxGridState.UNINITIALIZED)
	{
		var titleCount = this.m_momentum.getTitleStatesCore(true).size();
		this.m_headerStateTitleArray = oFF.XArray.create(titleCount);
		for (var titleIndex = 0; titleIndex < titleCount; titleIndex++)
		{
			this.m_headerStateTitleArray.set(titleIndex, oFF.ParallelSpan.create());
		}
		if (this.m_isOnTheFly === false)
		{
			var lineList = oFF.XList.create();
			for (var i = 0; i < this.m_heightSec; i++)
			{
				lineList.add(this.createCoreLine(i, this.m_headerStateTitleArray));
			}
			this.m_lineArray = lineList;
		}
	}
	for (var j = 0; j < this.m_headerStateTitleArray.size(); j++)
	{
		var element = this.m_headerStateTitleArray.get(j);
		element.reset();
	}
	this.m_cursorIndex = -1;
	this.m_cursorLine = null;
	return oldState;
};
oFF.Section_II_III.prototype.getLine = function(index)
{
	if (index !== this.m_cursorIndex)
	{
		if (oFF.notNull(this.m_lineArray))
		{
			this.m_cursorIndex = index;
			this.m_cursorLine = this.m_lineArray.get(this.m_cursorIndex);
		}
		else
		{
			this.m_cursorIndex = index;
			this.m_cursorLine = this.createCoreLine(this.m_cursorIndex, this.m_headerStateTitleArray);
		}
	}
	return this.m_cursorLine;
};
oFF.Section_II_III.prototype.createCoreLine = function(tupleIndex, headerStateTitleArray)
{
	var axis = this.m_dataset.getResultsetAxis();
	var titleStateArray = this.m_momentum.getTitleStatesCore(true);
	return this.createLine(axis, tupleIndex, null, titleStateArray, headerStateTitleArray, false);
};
oFF.Section_II_III.prototype.createNewLine = function(tuple, tupleIndex)
{
	var titleStateArray = this.m_momentum.getTitleStatesNewLines(true);
	var axis = this.m_dataset.getResultsetAxis();
	return this.createLine(axis, tupleIndex, tuple, titleStateArray, null, true);
};
oFF.Section_II_III.prototype.createLine = function(rsAxis, tupleIndex, fixedTuple, titleStateArray, headerStateTitleArray, forceNew)
{
	if (oFF.isNull(titleStateArray))
	{
		return null;
	}
	var settings = this.getDataset().getSettings();
	var line;
	if (this.m_isOnTheFly === false || forceNew)
	{
		line = oFF.HeaderLine.createHeaderLine();
	}
	else
	{
		this.m_recycleLine.reset();
		line = this.m_recycleLine;
	}
	if (this.m_dataset.getAxisName() === oFF.AxisType.COLUMNS)
	{
		line.setType(oFF.LineType.COLUMN_TUPLE);
	}
	else
	{
		line.setType(oFF.LineType.ROW_TUPLE);
	}
	var tuple;
	if (oFF.notNull(fixedTuple))
	{
		tuple = fixedTuple;
	}
	else
	{
		tuple = rsAxis.getTupleAt(tupleIndex);
	}
	line.set(rsAxis, tupleIndex, fixedTuple, this.m_dataset.getHasScalingUnitInHeader());
	var headerState = line.getHeaderState();
	for (var titlePosition = 0; titlePosition < titleStateArray.size(); titlePosition++)
	{
		var currentTitleState = titleStateArray.get(titlePosition);
		var type = currentTitleState.getType();
		if (type.isAnchor())
		{
			var totalState = headerState.getTotals();
			if (totalState === oFF.Total.NONE)
			{
				var isTotals = false;
				if (type === oFF.TitleType.CHARACTERISTIC_ANCHOR || type === oFF.TitleType.CHAR_HIERARCHY_ANCHOR)
				{
					var tupleElementIndex = currentTitleState.getIndex();
					var tupleElement = tuple.get(tupleElementIndex);
					var characteristicMember = tupleElement.getDimensionMember();
					if (oFF.notNull(characteristicMember))
					{
						isTotals = characteristicMember.getMemberType() === oFF.MemberType.RESULT;
					}
				}
				if (isTotals)
				{
					headerState.setTotals(oFF.Total.ANCHOR);
				}
			}
		}
		else
		{
			var totalState2 = headerState.getTotals();
			if (totalState2 === oFF.Total.ANCHOR)
			{
				headerState.setTotals(oFF.Total.PRIMARY);
			}
			else if (totalState2 === oFF.Total.PRIMARY)
			{
				headerState.setTotals(oFF.Total.SECONDARY);
			}
			var parallelSpan;
			if (oFF.notNull(headerStateTitleArray))
			{
				parallelSpan = headerStateTitleArray.get(titlePosition);
			}
			else
			{
				parallelSpan = null;
			}
			var cell = this.allocateHeaderCell(titlePosition, titleStateArray.size(), forceNew);
			oFF.HeaderCellProcessor.apply(cell, settings, this.m_momentum, tuple, tupleIndex, currentTitleState, parallelSpan, headerState);
			line.addCell(cell);
		}
	}
	line.processVirtualColSpans();
	line.setCustomObject(tuple);
	return line;
};
oFF.Section_II_III.prototype.getCell = function(x, y)
{
	var line = this.getLine(y);
	var cells = line.getCells();
	if (cells.size() <= x)
	{
		throw oFF.XException.createIllegalStateException("cells.length <= x; ");
	}
	return cells.get(x);
};
oFF.Section_II_III.prototype.getRowCount = function()
{
	return this.m_heightSec;
};
oFF.Section_II_III.prototype.getColumnCount = function()
{
	return this.m_widthSec;
};
oFF.Section_II_III.prototype.getColumn = function(x)
{
	return null;
};
oFF.Section_II_III.prototype.getRow = function(y)
{
	return this.getLine(y);
};
oFF.Section_II_III.prototype.getFixedColumnsCount = function()
{
	return 0;
};
oFF.Section_II_III.prototype.getFixedRowsCount = function()
{
	return 0;
};
oFF.Section_II_III.prototype.getMomentum = function()
{
	return this.m_momentum;
};
oFF.Section_II_III.prototype.getDataset = function()
{
	return this.m_dataset;
};

oFF.Section_I = function() {};
oFF.Section_I.prototype = new oFF.VirtualMatrix();
oFF.Section_I.prototype._ff_c = "Section_I";

oFF.Section_I.create = function(client, settings, rowAxisMomentum, columnAxisMomentum, cellFactory)
{
	var object = new oFF.Section_I();
	object.setupExt("Section I", client, null);
	object.setCellFactory(cellFactory);
	object.m_settings = settings;
	object.m_columnAxisMomentum = columnAxisMomentum;
	object.m_rowAxisMomentum = rowAxisMomentum;
	object.m_colLines = oFF.XHashMapByString.create();
	object.m_rowLines = oFF.XHashMapByString.create();
	object.createSetup();
	return object;
};
oFF.Section_I.prototype.m_rowAxisMomentum = null;
oFF.Section_I.prototype.m_columnAxisMomentum = null;
oFF.Section_I.prototype.m_titleMatrix = null;
oFF.Section_I.prototype.m_settings = null;
oFF.Section_I.prototype.m_widthSe = 0;
oFF.Section_I.prototype.m_heightSe = 0;
oFF.Section_I.prototype.m_colLines = null;
oFF.Section_I.prototype.m_rowLines = null;
oFF.Section_I.prototype.getTitleMatrix = function()
{
	return this.m_titleMatrix;
};
oFF.Section_I.prototype.createSetup = function()
{
	if (this.m_rowAxisMomentum.isFilled() && this.m_columnAxisMomentum.isFilled())
	{
		this.createFull();
	}
	else if (this.m_rowAxisMomentum.isFilled())
	{
		this.createOnlyRowTitle();
	}
	else if (this.m_columnAxisMomentum.isFilled())
	{
		this.createOnlyColumnTitle();
	}
	else
	{
		this.m_titleMatrix = null;
	}
};
oFF.Section_I.prototype.createOnlyRowTitle = function()
{
	if (this.m_rowAxisMomentum.getDataset().isTitleVisible())
	{
		var rowTitleStateArray = this.m_rowAxisMomentum.getTitleStatesCore(false);
		var columns = rowTitleStateArray.size();
		this.m_heightSe = 1;
		this.m_widthSe = columns;
		this.m_titleMatrix = oFF.XArray2Dim.create(this.m_heightSe, this.m_widthSe);
		for (var titleColumnPosition = 0; titleColumnPosition < columns; titleColumnPosition++)
		{
			var titleState = rowTitleStateArray.get(titleColumnPosition);
			var titleCell = this.getCellFactory().createTitleCellWithSettings(this.m_settings, titleState, oFF.AxisType.ROWS, false);
			this.m_titleMatrix.setByIndices(0, titleColumnPosition, titleCell);
		}
	}
	else
	{
		this.m_titleMatrix = null;
	}
};
oFF.Section_I.prototype.createOnlyColumnTitle = function()
{
	if (this.m_columnAxisMomentum.getDataset().isTitleVisible())
	{
		var colTitleStateArray = this.m_columnAxisMomentum.getTitleStatesCore(false);
		var rows = colTitleStateArray.size();
		this.m_heightSe = rows;
		this.m_widthSe = 1;
		this.m_titleMatrix = oFF.XArray2Dim.create(this.m_heightSe, this.m_widthSe);
		for (var titleRowPosition = 0; titleRowPosition < rows; titleRowPosition++)
		{
			var titleState = colTitleStateArray.get(titleRowPosition);
			var titleCell = this.getCellFactory().createTitleCellWithSettings(this.m_settings, titleState, oFF.AxisType.COLUMNS, false);
			this.m_titleMatrix.setByIndices(titleRowPosition, 0, titleCell);
		}
	}
	else
	{
		this.m_titleMatrix = null;
	}
};
oFF.Section_I.prototype.createFull = function()
{
	if (this.m_columnAxisMomentum.getDataset().isTitleVisible() === false && this.m_rowAxisMomentum.getDataset().isTitleVisible() === false)
	{
		this.m_titleMatrix = null;
	}
	else
	{
		var rowTitleStateArray = this.m_rowAxisMomentum.getTitleStatesCore(false);
		var colTitleStateArray = this.m_columnAxisMomentum.getTitleStatesCore(false);
		this.m_heightSe = colTitleStateArray.size();
		this.m_widthSe = rowTitleStateArray.size();
		this.m_titleMatrix = oFF.XArray2Dim.create(this.m_heightSe, this.m_widthSe);
		for (var titleRowPosition = 0; titleRowPosition < this.m_titleMatrix.size0(); titleRowPosition++)
		{
			for (var titleColumnPosition = 0; titleColumnPosition < this.m_titleMatrix.size1(); titleColumnPosition++)
			{
				if (this.m_rowAxisMomentum.getDataset().isTitleVisible() || this.m_columnAxisMomentum.getDataset().isTitleVisible())
				{
					var titleCell = null;
					if (titleRowPosition === this.m_titleMatrix.size0() - 1)
					{
						if (titleColumnPosition === this.m_titleMatrix.size1() - 1)
						{
							titleCell = this.createMagicCell();
						}
						else
						{
							var rowTitleState = rowTitleStateArray.get(titleColumnPosition);
							titleCell = this.getCellFactory().createTitleCellWithSettings(this.m_settings, rowTitleState, oFF.AxisType.ROWS, false);
						}
					}
					else
					{
						if (titleColumnPosition === this.m_titleMatrix.size1() - 1)
						{
							var columnTitleState = colTitleStateArray.get(titleRowPosition);
							var cellFactory = this.getCellFactory();
							titleCell = cellFactory.createTitleCellWithSettings(this.m_settings, columnTitleState, oFF.AxisType.COLUMNS, false);
							titleCell.setColSpanOrigin(1, true);
						}
						else
						{
							var colspan = rowTitleStateArray.size() - 1;
							var rowspan = colTitleStateArray.size() - 1;
							titleCell = this.getCellFactory().createTitleCell();
							titleCell.setRowSpanOrigin(rowspan - titleRowPosition, titleRowPosition === 0);
							titleCell.setColSpanOrigin(colspan - titleColumnPosition, titleColumnPosition === 0);
						}
					}
					if (oFF.isNull(titleCell))
					{
						throw oFF.XException.createRuntimeException("null-cell not allowed");
					}
					this.m_titleMatrix.setByIndices(titleRowPosition, titleColumnPosition, titleCell);
				}
			}
		}
	}
};
oFF.Section_I.prototype.createMagicCell = function()
{
	var colTitleStateArray = this.m_columnAxisMomentum.getTitleStatesCore(false);
	var rowTitleStateArray = this.m_rowAxisMomentum.getTitleStatesCore(false);
	var colTitleState;
	if (colTitleStateArray.size() > 0)
	{
		colTitleState = colTitleStateArray.get(colTitleStateArray.size() - 1);
	}
	else
	{
		colTitleState = null;
	}
	var rowTitleState;
	if (rowTitleStateArray.size() > 0)
	{
		rowTitleState = rowTitleStateArray.get(rowTitleStateArray.size() - 1);
	}
	else
	{
		rowTitleState = null;
	}
	var prioRow = this.determineMagicTitleCellPriority(rowTitleState);
	var prioCol = this.determineMagicTitleCellPriority(colTitleState);
	var mode;
	if (prioRow === prioCol)
	{
		if (prioRow === 0)
		{
			mode = 1;
		}
		else
		{
			mode = 2;
		}
	}
	else if (prioRow > prioCol)
	{
		mode = 3;
	}
	else
	{
		mode = 4;
	}
	if (mode === 1)
	{
		return this.getCellFactory().createTitleCellWithSettings(this.m_settings, rowTitleState, oFF.AxisType.ROWS, false);
	}
	else if (mode === 2)
	{
		return this.getCellFactory().createTwinCellWithSettings(this.m_settings, rowTitleState, colTitleState);
	}
	else if (mode === 3)
	{
		return this.getCellFactory().createTitleCellWithSettings(this.m_settings, rowTitleState, oFF.AxisType.ROWS, false);
	}
	else
	{
		return this.getCellFactory().createTitleCellWithSettings(this.m_settings, colTitleState, oFF.AxisType.COLUMNS, false);
	}
};
oFF.Section_I.prototype.determineMagicTitleCellPriority = function(titleState)
{
	if (oFF.isNull(titleState))
	{
		return 0;
	}
	var type = titleState.getType();
	if (type.isScalingFactor())
	{
		return 0;
	}
	else if (titleState.isFirstElementOfType())
	{
		if (type.isAttribute())
		{
			return 3;
		}
		else if (type.isCharacteristic() || type.isHierarchy())
		{
			var dimension = titleState.getCharacteristic();
			if (dimension.isStructure())
			{
				if (dimension.isMeasureStructure())
				{
					if (this.m_settings.isKeyfigureStructureTitleVisible())
					{
						return 3;
					}
				}
				else
				{
					if (this.m_settings.isNonKeyfigureStructureTitleVisible())
					{
						return 3;
					}
				}
				return 0;
			}
			return 3;
		}
		else if (type.isUniversalHierarchy())
		{
			return 3;
		}
	}
	return -1;
};
oFF.Section_I.prototype.getColumnCount = function()
{
	return this.m_widthSe;
};
oFF.Section_I.prototype.getRowCount = function()
{
	return this.m_heightSe;
};
oFF.Section_I.prototype.getFixedColumnsCount = function()
{
	return 0;
};
oFF.Section_I.prototype.getFixedRowsCount = function()
{
	return 0;
};
oFF.Section_I.prototype.getCell = function(x, y)
{
	return this.m_titleMatrix.getByIndices(y, x);
};
oFF.Section_I.prototype.getColumn = function(x)
{
	var identifier = oFF.XStringUtils.concatenateWithInt("titlex_", x);
	var vl = this.m_colLines.getByKey(identifier);
	if (oFF.isNull(vl))
	{
		vl = oFF.VirtualLine.create(oFF.LineType.COLUMN_TUPLE, identifier);
		this.m_colLines.put(identifier, vl);
	}
	return vl;
};
oFF.Section_I.prototype.getRow = function(y)
{
	var identifier = oFF.XStringUtils.concatenateWithInt("titley_", y);
	var vl = this.m_rowLines.getByKey(identifier);
	if (oFF.isNull(vl))
	{
		vl = oFF.VirtualLine.create(oFF.LineType.ROW_TUPLE, identifier);
		this.m_rowLines.put(identifier, vl);
	}
	return vl;
};

oFF.ModificationType = function() {};
oFF.ModificationType.prototype = new oFF.XConstant();
oFF.ModificationType.prototype._ff_c = "ModificationType";

oFF.ModificationType.NONE = null;
oFF.ModificationType.MODULE = null;
oFF.ModificationType.staticSetup = function()
{
	oFF.ModificationType.NONE = oFF.XConstant.setupName(new oFF.ModificationType(), "None");
	oFF.ModificationType.MODULE = oFF.XConstant.setupName(new oFF.ModificationType(), "Module");
};

oFF.SelectMode = function() {};
oFF.SelectMode.prototype = new oFF.XConstant();
oFF.SelectMode.prototype._ff_c = "SelectMode";

oFF.SelectMode.NONE = null;
oFF.SelectMode.SINGLE = null;
oFF.SelectMode.SINGLE_WITH_CMDS = null;
oFF.SelectMode.MULTIPLE = null;
oFF.SelectMode.staticSetup = function()
{
	oFF.SelectMode.NONE = oFF.XConstant.setupName(new oFF.SelectMode(), "None");
	oFF.SelectMode.SINGLE = oFF.XConstant.setupName(new oFF.SelectMode(), "Single");
	oFF.SelectMode.SINGLE_WITH_CMDS = oFF.XConstant.setupName(new oFF.SelectMode(), "SingleWithCommands");
	oFF.SelectMode.MULTIPLE = oFF.XConstant.setupName(new oFF.SelectMode(), "Multiple");
};

oFF.WorkMode = function() {};
oFF.WorkMode.prototype = new oFF.XConstant();
oFF.WorkMode.prototype._ff_c = "WorkMode";

oFF.WorkMode.CLASSIC_STATIC = null;
oFF.WorkMode.SPREADSHEET = null;
oFF.WorkMode.PLAIN_HTML = null;
oFF.WorkMode.FAST_GRID = null;
oFF.WorkMode.staticSetup = function()
{
	oFF.WorkMode.CLASSIC_STATIC = oFF.XConstant.setupName(new oFF.WorkMode(), "ClassicStatic");
	oFF.WorkMode.SPREADSHEET = oFF.XConstant.setupName(new oFF.WorkMode(), "Spreadsheet");
	oFF.WorkMode.PLAIN_HTML = oFF.XConstant.setupName(new oFF.WorkMode(), "PlainHTML");
	oFF.WorkMode.FAST_GRID = oFF.XConstant.setupName(new oFF.WorkMode(), "FastGrid");
};

oFF.DummyProgram = function() {};
oFF.DummyProgram.prototype = new oFF.DfProgram();
oFF.DummyProgram.prototype._ff_c = "DummyProgram";

oFF.DummyProgram.prototype.newProgram = function()
{
	var newPrg = new oFF.DummyProgram();
	newPrg.setup();
	return newPrg;
};
oFF.DummyProgram.prototype.runProcess = function()
{
	this.println("This is a dummy program to check loading of modules!");
	this.exitNow(0);
	return false;
};

oFF.OrcaWidgets = function() {};
oFF.OrcaWidgets.prototype = new oFF.DfClientGenerator();
oFF.OrcaWidgets.prototype._ff_c = "OrcaWidgets";

oFF.OrcaWidgets.create = function(pathToSources, pathToTargets, pathToLibs)
{
	var newObj = new oFF.OrcaWidgets();
	newObj.setupPaths(pathToSources, pathToTargets, pathToLibs);
	return newObj;
};
oFF.OrcaWidgets.prototype.addStyle = function(headBuffer)
{
	headBuffer.append("<style>");
	headBuffer.append(".container {");
	headBuffer.append("height:100%;");
	headBuffer.append("width: 100%;");
	headBuffer.append("display:flex;");
	headBuffer.append("flex-direction: row;");
	headBuffer.append(" flex-wrap: wrap;");
	headBuffer.append(" justify-content: flex-start;");
	headBuffer.append("  align-content: flex-start;");
	headBuffer.append("  align-items: stretch;");
	headBuffer.append("}");
	headBuffer.append("");
	headBuffer.append(".box, .bigbox, .widebox {");
	headBuffer.append(" background-color: lightblue  ;");
	headBuffer.append("width: 176px;");
	headBuffer.append("height: 176px;");
	headBuffer.append("margin: 5px;");
	headBuffer.append("}");
	headBuffer.append("");
	headBuffer.append(".bigbox");
	headBuffer.append("");
	headBuffer.append("{");
	headBuffer.append("background-color: lightblue ;");
	headBuffer.append("width: 359px;");
	headBuffer.append("height: 359px;");
	headBuffer.append("}");
	headBuffer.append("");
	headBuffer.append(".widebox");
	headBuffer.append("{");
	headBuffer.append(" background-color: lightblue ;");
	headBuffer.append(" width: 359px;");
	headBuffer.append(" height: 176px;");
	headBuffer.append("}");
	headBuffer.append("");
	headBuffer.append(".centerContent");
	headBuffer.append("{");
	headBuffer.append("display: flex;");
	headBuffer.append("align-items: center;");
	headBuffer.append("justify-content: center;");
	headBuffer.append("}</style>");
};
oFF.OrcaWidgets.prototype.addInit = function(headBuffer)
{
	headBuffer.append("\t<script>").appendNewLine();
	headBuffer.append("\t\tvar chartEmebedingStory;").appendNewLine();
	headBuffer.append("\t\tfunction initJs()").appendNewLine();
	headBuffer.append("\t\t{").appendNewLine();
	headBuffer.append("\t\t   chartEmebedingStory.embedWidget(\"tile1\", \"f82bed53-b056-48d4-8479-30c44ed2efec\");").appendNewLine();
	headBuffer.append("\t\t   chartEmebedingStory.embedWidget(\"tile2\", \"776f6396-e5b0-403d-955a-e3ba588de810\");").appendNewLine();
	headBuffer.append("\t\t   chartEmebedingStory.embedWidget(\"tile3\", \"01f9523e-8fe5-4154-838f-d3dfc44d632c\");").appendNewLine();
	headBuffer.append("\t\t   chartEmebedingStory.embedWidget(\"tile4\", \"16b157d7-9cea-4a07-9373-2109377fe290\");").appendNewLine();
	headBuffer.append("\t}").appendNewLine();
	headBuffer.append("\t\tfunction buttonPress()").appendNewLine();
	headBuffer.append("\t\t{").appendNewLine();
	headBuffer.append("\t\t   chartEmebedingStory.embedWidget(\"tile5\", \"982f638d-acba-4123-a7c2-cd1cc3b3ef94\");").appendNewLine();
	headBuffer.append("\t}").appendNewLine();
	headBuffer.append("\t</script>").appendNewLine();
};
oFF.OrcaWidgets.prototype.generateClient = function(pathToFile, clientName)
{
	var mainBuffer = oFF.XStringBuffer.create();
	mainBuffer.append("<head>").appendNewLine();
	var bodyBuffer = oFF.XStringBuffer.create();
	oFF.DfClientGenerator.prepareHead(mainBuffer);
	oFF.DfClientGenerator.addLink(mainBuffer);
	oFF.ClientLibs.addSapUI5(mainBuffer);
	this.addStyle(mainBuffer);
	oFF.ClientLibs.addJQuery(mainBuffer, this.m_pathToLibs);
	oFF.ClientLibs.addLibElements(mainBuffer, this.m_pathToLibs);
	oFF.ClientSources.addFFPackages(mainBuffer, oFF.XStringUtils.concatenate2(this.m_pathToTargets, "/javascript"));
	oFF.ClientUIComponents.addUiElements(mainBuffer, this.m_pathToSources);
	this.addBody(bodyBuffer);
	this.addInit(mainBuffer);
	mainBuffer.append("</head>");
	var htmlBuffer = this.combinePageElements(mainBuffer, bodyBuffer);
	this.saveFile(clientName, htmlBuffer);
};
oFF.OrcaWidgets.prototype.addBody = function(buffer)
{
	buffer.append("\t<body onload=\"initJs()\" class=\"sapUiBody\">");
	buffer.append("<div class=\"container\">");
	buffer.append("<div id=\"tile1\" class=\"box\"></div>");
	buffer.append("<div id=\"tile2\" class=\"box\"></div>");
	buffer.append("<div id=\"tile3\" class=\"box\"></div>");
	buffer.append("<div id=\"tile4\" class=\"box\"></div>");
	buffer.append("<div id=\"tile5\" class=\"bigbox centerContent\"><button onclick=\"buttonPress()\">Load chart</button></div>");
	buffer.append("</body>");
};

oFF.StoryClient = function() {};
oFF.StoryClient.prototype = new oFF.DfClientGenerator();
oFF.StoryClient.prototype._ff_c = "StoryClient";

oFF.StoryClient.create = function(session, pathToSources, pathToTargets, pathToLibs)
{
	var newObj = new oFF.StoryClient();
	newObj.setupSessionContext(session);
	newObj.setupPaths(pathToSources, pathToTargets, pathToLibs);
	return newObj;
};
oFF.StoryClient.prototype.addInit = function(headBuffer)
{
	headBuffer.append("\t<script>").appendNewLine();
	headBuffer.append("\t\tfunction initJs()").appendNewLine();
	headBuffer.append("\t\t{").appendNewLine();
	headBuffer.append("\t\t   oFF.UiDriverModule.getInstance();").appendNewLine();
	headBuffer.append("\t\t   var client = oFF.Orion.create(\"content\", null, null);").appendNewLine();
	headBuffer.append("\t}").appendNewLine();
	headBuffer.append("\t</script>").appendNewLine();
};
oFF.StoryClient.prototype.generateClient = function(pathToFile, clientName)
{
	var mainBuffer = oFF.XStringBuffer.create();
	mainBuffer.append("<head>").appendNewLine();
	var bodyBuffer = oFF.XStringBuffer.create();
	oFF.DfClientGenerator.prepareHead(mainBuffer);
	oFF.DfClientGenerator.addLink(mainBuffer);
	oFF.ClientLibs.addSapUI5(mainBuffer);
	oFF.ClientLibs.addJQuery(mainBuffer, this.m_pathToLibs);
	oFF.ClientLibs.addLibElements(mainBuffer, this.m_pathToLibs);
	oFF.ClientSources.addFFPackages(mainBuffer, oFF.XStringUtils.concatenate2(this.m_pathToTargets, "/javascript"));
	oFF.ClientUIComponents.addUiElements(mainBuffer, this.m_pathToSources);
	this.addBody(bodyBuffer);
	this.addInit(mainBuffer);
	mainBuffer.append("</head>");
	var htmlBuffer = this.combinePageElements(mainBuffer, bodyBuffer);
	this.saveFile(clientName, htmlBuffer);
};

oFF.StudClient = function() {};
oFF.StudClient.prototype = new oFF.DfClientGenerator();
oFF.StudClient.prototype._ff_c = "StudClient";

oFF.StudClient.create = function(pathToSources, pathToTargets, pathToLibs)
{
	var newObj = new oFF.StudClient();
	newObj.setupPaths(pathToSources, pathToTargets, pathToLibs);
	return newObj;
};
oFF.StudClient.prototype.addInit = function(headBuffer)
{
	headBuffer.append("\t<script>").appendNewLine();
	headBuffer.append("\t\tfunction initJs()").appendNewLine();
	headBuffer.append("\t\t{").appendNewLine();
	headBuffer.append("\t\t   oFF.UiDriverModule.getInstance();").appendNewLine();
	headBuffer.append("\t\t   oFF.StudioModule.getInstance();").appendNewLine();
	headBuffer.append("\t\t   var contentControl = oFF.StudioClient.runOnLandscape( \"content\", null );").appendNewLine();
	headBuffer.append("\t}").appendNewLine();
	headBuffer.append("\t</script>").appendNewLine();
};
oFF.StudClient.prototype.generateClient = function(pathToFile, clientName)
{
	var mainBuffer = oFF.XStringBuffer.create();
	mainBuffer.append("<head>").appendNewLine();
	var bodyBuffer = oFF.XStringBuffer.create();
	oFF.DfClientGenerator.prepareHead(mainBuffer);
	oFF.DfClientGenerator.addLink(mainBuffer);
	oFF.ClientLibs.addSapUI5(mainBuffer);
	oFF.ClientLibs.addJQuery(mainBuffer, this.m_pathToLibs);
	oFF.ClientLibs.addLibElements(mainBuffer, this.m_pathToLibs);
	oFF.ClientSources.addFFPackages(mainBuffer, oFF.XStringUtils.concatenate2(this.m_pathToTargets, "/javascript"));
	oFF.ClientUIComponents.addUiElements(mainBuffer, this.m_pathToSources);
	oFF.ClientSources.addStudioUi(mainBuffer, oFF.XStringUtils.concatenate2(this.m_pathToTargets, "/javascript"));
	this.addBody(bodyBuffer);
	this.addInit(mainBuffer);
	mainBuffer.append("</head>");
	var htmlBuffer = this.combinePageElements(mainBuffer, bodyBuffer);
	this.saveFile(clientName, htmlBuffer);
};

oFF.IMxGridSelectionType = function() {};
oFF.IMxGridSelectionType.prototype = new oFF.XConstant();
oFF.IMxGridSelectionType.prototype._ff_c = "IMxGridSelectionType";

oFF.IMxGridSelectionType.NONE = null;
oFF.IMxGridSelectionType.RADIO = null;
oFF.IMxGridSelectionType.SINGLE = null;
oFF.IMxGridSelectionType.MULTIPLE = null;
oFF.IMxGridSelectionType.staticSetup = function()
{
	oFF.IMxGridSelectionType.NONE = oFF.XConstant.setupName(new oFF.IMxGridSelectionType(), "None");
	oFF.IMxGridSelectionType.RADIO = oFF.XConstant.setupName(new oFF.IMxGridSelectionType(), "Radio");
	oFF.IMxGridSelectionType.SINGLE = oFF.XConstant.setupName(new oFF.IMxGridSelectionType(), "Single");
	oFF.IMxGridSelectionType.MULTIPLE = oFF.XConstant.setupName(new oFF.IMxGridSelectionType(), "Multiple");
};

oFF.MxGridCellType = function() {};
oFF.MxGridCellType.prototype = new oFF.XConstant();
oFF.MxGridCellType.prototype._ff_c = "MxGridCellType";

oFF.MxGridCellType.STANDARD = null;
oFF.MxGridCellType.HORIZONTAL_SELECTOR = null;
oFF.MxGridCellType.VERTICAL_SELECTOR = null;
oFF.MxGridCellType.staticSetup = function()
{
	oFF.MxGridCellType.STANDARD = oFF.XConstant.setupName(new oFF.MxGridCellType(), "STANDARD");
	oFF.MxGridCellType.HORIZONTAL_SELECTOR = oFF.XConstant.setupName(new oFF.MxGridCellType(), "HORIZONTAL_SELECTOR");
	oFF.MxGridCellType.VERTICAL_SELECTOR = oFF.XConstant.setupName(new oFF.MxGridCellType(), "VERTICAL_SELECTOR");
};

oFF.MxGridLineContext = function() {};
oFF.MxGridLineContext.prototype = new oFF.XConstant();
oFF.MxGridLineContext.prototype._ff_c = "MxGridLineContext";

oFF.MxGridLineContext.DEFAULT_VALUE = null;
oFF.MxGridLineContext.FILTER = null;
oFF.MxGridLineContext.SELECTABLE = null;
oFF.MxGridLineContext.HEADER = null;
oFF.MxGridLineContext.staticSetup = function()
{
	oFF.MxGridLineContext.DEFAULT_VALUE = oFF.XConstant.setupName(new oFF.MxGridLineContext(), "Default");
	oFF.MxGridLineContext.FILTER = oFF.XConstant.setupName(new oFF.MxGridLineContext(), "Filter");
	oFF.MxGridLineContext.SELECTABLE = oFF.XConstant.setupName(new oFF.MxGridLineContext(), "Selectable");
	oFF.MxGridLineContext.HEADER = oFF.XConstant.setupName(new oFF.MxGridLineContext(), "Header");
};

oFF.MxGridSpanState = function() {};
oFF.MxGridSpanState.prototype = new oFF.XConstant();
oFF.MxGridSpanState.prototype._ff_c = "MxGridSpanState";

oFF.MxGridSpanState.NOSPAN = null;
oFF.MxGridSpanState.START = null;
oFF.MxGridSpanState.MIDDLE = null;
oFF.MxGridSpanState.END = null;
oFF.MxGridSpanState.staticSetup = function()
{
	oFF.MxGridSpanState.NOSPAN = oFF.MxGridSpanState.create("NoSpan", true);
	oFF.MxGridSpanState.START = oFF.MxGridSpanState.create("Start", true);
	oFF.MxGridSpanState.MIDDLE = oFF.MxGridSpanState.create("Middle", false);
	oFF.MxGridSpanState.END = oFF.MxGridSpanState.create("End", false);
};
oFF.MxGridSpanState.create = function(constant, isFirst)
{
	var object = new oFF.MxGridSpanState();
	object._setupInternal(constant);
	object.m_isFirst = isFirst;
	return object;
};
oFF.MxGridSpanState.prototype.m_isFirst = false;
oFF.MxGridSpanState.prototype.isFirst = function()
{
	return this.m_isFirst;
};

oFF.MxGridState = function() {};
oFF.MxGridState.prototype = new oFF.XConstant();
oFF.MxGridState.prototype._ff_c = "MxGridState";

oFF.MxGridState.UNINITIALIZED = null;
oFF.MxGridState.INITIALIZED = null;
oFF.MxGridState.RUNNING = null;
oFF.MxGridState.staticSetup = function()
{
	oFF.MxGridState.UNINITIALIZED = oFF.XConstant.setupName(new oFF.MxGridState(), "Uninitialized");
	oFF.MxGridState.INITIALIZED = oFF.XConstant.setupName(new oFF.MxGridState(), "Initialized");
	oFF.MxGridState.RUNNING = oFF.XConstant.setupName(new oFF.MxGridState(), "Running");
};

oFF.OlapCatalogProxy = function() {};
oFF.OlapCatalogProxy.prototype = new oFF.SyncAction();
oFF.OlapCatalogProxy.prototype._ff_c = "OlapCatalogProxy";

oFF.OlapCatalogProxy.create = function(parent, element, groupByTag)
{
	var newObj = new oFF.OlapCatalogProxy();
	newObj.setupProxy(parent, element, groupByTag);
	return newObj;
};
oFF.OlapCatalogProxy.prototype.m_originElement = null;
oFF.OlapCatalogProxy.prototype.m_children = null;
oFF.OlapCatalogProxy.prototype.m_groupBy = null;
oFF.OlapCatalogProxy.prototype.m_name = null;
oFF.OlapCatalogProxy.prototype.m_text = null;
oFF.OlapCatalogProxy.prototype.m_type = null;
oFF.OlapCatalogProxy.prototype.m_childSetState = null;
oFF.OlapCatalogProxy.prototype.setupProxy = function(parent, element, groupByTag)
{
	this.setupAction(null, null, null, parent);
	this.m_originElement = element;
	this.m_groupBy = groupByTag;
	this.m_childSetState = oFF.ChildSetState.NONE;
	if (oFF.notNull(element))
	{
		this.setName(element.getName());
		this.setText(element.getText());
		this.setComponentType(element.getComponentType());
		if (element.isNode())
		{
			var node = element;
			this.m_childSetState = node.getChildSetState();
			if (this.m_childSetState === oFF.ChildSetState.COMPLETE)
			{
				var originChildren = node.getChildElements();
				this.fillChildren(originChildren);
			}
		}
	}
};
oFF.OlapCatalogProxy.prototype.releaseObject = function()
{
	this.m_name = null;
	this.m_text = null;
	this.m_originElement = null;
	this.m_children = null;
	this.m_groupBy = null;
	this.m_type = null;
	this.m_childSetState = null;
	oFF.SyncAction.prototype.releaseObject.call( this );
};
oFF.OlapCatalogProxy.prototype.newProxyNode = function(parent, element, groupByTag)
{
	return this.getCatalogSpace().newProxyNode(parent, element, groupByTag);
};
oFF.OlapCatalogProxy.prototype.getComponentType = function()
{
	return this.m_type;
};
oFF.OlapCatalogProxy.prototype.setComponentType = function(type)
{
	if (oFF.isNull(type))
	{
		throw oFF.XException.createIllegalArgumentException("Type is null");
	}
	this.m_type = type;
};
oFF.OlapCatalogProxy.prototype.isLeaf = function()
{
	return !this.isNode();
};
oFF.OlapCatalogProxy.prototype.isNode = function()
{
	return this.m_originElement.isNode();
};
oFF.OlapCatalogProxy.prototype.getTagValue = function(tagName)
{
	return this.m_originElement.getTagValue(tagName);
};
oFF.OlapCatalogProxy.prototype.getName = function()
{
	return this.m_name;
};
oFF.OlapCatalogProxy.prototype.setName = function(name)
{
	this.m_name = name;
};
oFF.OlapCatalogProxy.prototype.getText = function()
{
	var buffer = oFF.XStringBuffer.create();
	buffer.append("[");
	buffer.append(this.getComponentType().getName());
	buffer.append("] ");
	buffer.append(this.m_text);
	return buffer.toString();
};
oFF.OlapCatalogProxy.prototype.setText = function(text)
{
	this.m_text = text;
};
oFF.OlapCatalogProxy.prototype.getContentElement = function()
{
	return this.m_originElement.getContentElement();
};
oFF.OlapCatalogProxy.prototype.getContentConstant = function()
{
	return null;
};
oFF.OlapCatalogProxy.prototype.getChildSetState = function()
{
	return this.m_childSetState;
};
oFF.OlapCatalogProxy.prototype.hasChildren = function()
{
	if (this.m_childSetState === oFF.ChildSetState.COMPLETE)
	{
		return this.m_children.size() > 0;
	}
	return false;
};
oFF.OlapCatalogProxy.prototype.getChildElements = function()
{
	if (this.isNode())
	{
		if (this.m_childSetState === oFF.ChildSetState.INITIAL)
		{
			this.processSyncAction(oFF.SyncType.BLOCKING, null, null);
		}
	}
	return this.m_children;
};
oFF.OlapCatalogProxy.prototype.processChildFetch = function(syncType, listener, customIdentifier)
{
	return this.processSyncAction(syncType, listener, customIdentifier);
};
oFF.OlapCatalogProxy.prototype.processSynchronization = function(syncType)
{
	if (this.m_originElement.isNode())
	{
		var node = this.m_originElement;
		var children;
		if (node.getChildSetState() === oFF.ChildSetState.COMPLETE)
		{
			children = node.getChildElements();
			this.fillChildren(children);
		}
		else
		{
			node.processChildFetch(syncType, this, null);
			return true;
		}
	}
	return false;
};
oFF.OlapCatalogProxy.prototype.onChildFetched = function(extResult, result, fetchedChildren, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		this.fillChildren(fetchedChildren);
	}
};
oFF.OlapCatalogProxy.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	var children = null;
	if (oFF.notNull(data))
	{
		children = data.getChildren();
	}
	listener.onChildFetched(extResult, data, children, customIdentifier);
};
oFF.OlapCatalogProxy.prototype.fillChildren = function(originChildren)
{
	if (oFF.notNull(originChildren))
	{
		var newChildren = oFF.XList.create();
		if (oFF.isNull(this.m_groupBy))
		{
			for (var i = 0; i < originChildren.size(); i++)
			{
				var element = originChildren.get(i);
				var proxy = this.newProxyNode(this, element, null);
				newChildren.add(proxy);
			}
		}
		else
		{
			var subnodes = oFF.XHashMapByString.create();
			for (var j = 0; j < originChildren.size(); j++)
			{
				var element2 = originChildren.get(j);
				var category = element2.getTagValue(this.m_groupBy);
				if (oFF.XStringUtils.isNotNullAndNotEmpty(category))
				{
					var list = subnodes.getByKey(category);
					if (oFF.isNull(list))
					{
						list = oFF.XList.create();
						subnodes.put(category, list);
					}
					list.add(element2);
				}
			}
			var iterator = subnodes.getKeysAsIteratorOfString();
			while (iterator.hasNext())
			{
				var key = iterator.next();
				var groupByNode = oFF.OlapCatalogProxyGroup.createGroup(this);
				groupByNode.setName(key);
				groupByNode.setText(key);
				newChildren.add(groupByNode);
				var list2 = subnodes.getByKey(key);
				for (var k = 0; k < list2.size(); k++)
				{
					var element3 = list2.get(k);
					var newProxyNode = this.newProxyNode(this, element3, null);
					groupByNode.add(newProxyNode);
				}
				groupByNode.sort();
			}
		}
		var comparator = oFF.XHierarchyComparator.create();
		newChildren.sortByComparator(comparator);
		this.m_children = newChildren;
		this.m_childSetState = oFF.ChildSetState.COMPLETE;
		this.setData(oFF.XHierarchyResult.create(this, this.m_children));
		this.endSync();
	}
};
oFF.OlapCatalogProxy.prototype.getOriginElement = function()
{
	return this.m_originElement;
};
oFF.OlapCatalogProxy.prototype.getCatalogSpace = function()
{
	return this.getParent().getCatalogSpace();
};
oFF.OlapCatalogProxy.prototype.getSystemDescription = function()
{
	return this.getParent().getSystemDescription();
};
oFF.OlapCatalogProxy.prototype.getOlapCatalogManager = function()
{
	return this.getParent().getOlapCatalogManager();
};
oFF.OlapCatalogProxy.prototype.getMetaObjectType = function()
{
	return this.getParent().getMetaObjectType();
};
oFF.OlapCatalogProxy.prototype.getSchema = function()
{
	return this.getParent().getSchema();
};
oFF.OlapCatalogProxy.prototype.getPackage = function()
{
	return this.getParent().getPackage();
};
oFF.OlapCatalogProxy.prototype.getParent = function()
{
	return this.getActionContext();
};
oFF.OlapCatalogProxy.prototype.getObjectName = function()
{
	return this.getParent().getObjectName();
};
oFF.OlapCatalogProxy.prototype.getDataSource = function()
{
	return this.getParent().getDataSource();
};
oFF.OlapCatalogProxy.prototype.getContext = function()
{
	return null;
};
oFF.OlapCatalogProxy.prototype.getOlapEnv = function()
{
	return null;
};
oFF.OlapCatalogProxy.prototype.getApplication = function()
{
	return null;
};
oFF.OlapCatalogProxy.prototype.getQueryManager = function()
{
	return null;
};
oFF.OlapCatalogProxy.prototype.toString = function()
{
	var buffer = oFF.XStringBuffer.create();
	buffer.append(this.m_type.getName());
	buffer.append(": ");
	buffer.append(this.m_name);
	buffer.append(" (");
	buffer.append(this.m_text);
	buffer.append(")");
	return buffer.toString();
};

oFF.OlapCatalogSpace = function() {};
oFF.OlapCatalogSpace.prototype = new oFF.XObject();
oFF.OlapCatalogSpace.prototype._ff_c = "OlapCatalogSpace";

oFF.OlapCatalogSpace.s_factoryMap = null;
oFF.OlapCatalogSpace.staticSetup = function()
{
	oFF.OlapCatalogSpace.s_factoryMap = oFF.XHashMapByString.create();
	oFF.OlapCatalogSpace.s_factoryMap.put(oFF.KernelComponentType.SYSTEM_DESCRIPTION.getName(), new oFF.OlapCatalogProxySystem());
	oFF.OlapCatalogSpace.s_factoryMap.put(oFF.OlapComponentType.CATALOG_TYPE.getName(), new oFF.OlapCatalogProxyType());
	oFF.OlapCatalogSpace.s_factoryMap.put(oFF.OlapComponentType.CATALOG_SCHEMA.getName(), new oFF.OlapCatalogProxySchema());
	oFF.OlapCatalogSpace.s_factoryMap.put(oFF.OlapComponentType.CATALOG_PACKAGE.getName(), new oFF.OlapCatalogProxyPackage());
	oFF.OlapCatalogSpace.s_factoryMap.put(oFF.OlapComponentType.CATALOG_OBJECT.getName(), new oFF.OlapCatalogProxyQueryObj());
};
oFF.OlapCatalogSpace.create = function(application)
{
	var newObj = new oFF.OlapCatalogSpace();
	newObj.m_children = oFF.XList.create();
	newObj.m_application = application;
	return newObj;
};
oFF.OlapCatalogSpace.prototype.m_children = null;
oFF.OlapCatalogSpace.prototype.m_application = null;
oFF.OlapCatalogSpace.prototype.addFileNode = function(fileNode, name, text, type)
{
	var proxy = this.newProxyNode(this, fileNode, null);
	if (oFF.notNull(name))
	{
		proxy.setName(name);
	}
	if (oFF.notNull(text))
	{
		proxy.setText(text);
	}
	if (oFF.notNull(type))
	{
		proxy.setComponentType(type);
	}
	this.m_children.add(proxy);
};
oFF.OlapCatalogSpace.prototype.addSystemLandscapeNode = function(name, text, splitByType)
{
	var systemLandscape = this.m_application.getSystemLandscape();
	var groupBy = null;
	if (splitByType)
	{
		groupBy = oFF.ConnectionParameters.SYSTEM_TYPE;
	}
	var proxy = this.newProxyNode(this, systemLandscape, groupBy);
	proxy.setName(name);
	proxy.setText(text);
	this.m_children.add(proxy);
};
oFF.OlapCatalogSpace.prototype.newProxyNode = function(parent, element, groupByTag)
{
	var componentType = element.getComponentType();
	var name = componentType.getName();
	var proxyFactory = oFF.OlapCatalogSpace.s_factoryMap.getByKey(name);
	var proxy;
	if (oFF.notNull(proxyFactory))
	{
		proxy = proxyFactory.newProxy(parent, element, groupByTag);
	}
	else
	{
		proxy = oFF.OlapCatalogProxy.create(parent, element, groupByTag);
	}
	return proxy;
};
oFF.OlapCatalogSpace.prototype.hasChildren = function()
{
	return this.m_children.size() > 0;
};
oFF.OlapCatalogSpace.prototype.getChildSetState = function()
{
	return oFF.ChildSetState.COMPLETE;
};
oFF.OlapCatalogSpace.prototype.getChildElements = function()
{
	return this.m_children;
};
oFF.OlapCatalogSpace.prototype.getName = function()
{
	return "Root";
};
oFF.OlapCatalogSpace.prototype.getText = function()
{
	return "Root";
};
oFF.OlapCatalogSpace.prototype.isNode = function()
{
	return true;
};
oFF.OlapCatalogSpace.prototype.isLeaf = function()
{
	return false;
};
oFF.OlapCatalogSpace.prototype.getOlapEnv = function()
{
	return this.getApplication().getOlapEnvironment();
};
oFF.OlapCatalogSpace.prototype.getApplication = function()
{
	return this.m_application;
};
oFF.OlapCatalogSpace.prototype.getSession = function()
{
	return this.m_application.getSession();
};
oFF.OlapCatalogSpace.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.CATALOG_SPACE;
};
oFF.OlapCatalogSpace.prototype.getTagValue = function(tagName)
{
	return null;
};
oFF.OlapCatalogSpace.prototype.getContentElement = function()
{
	return this;
};
oFF.OlapCatalogSpace.prototype.getContentConstant = function()
{
	return null;
};
oFF.OlapCatalogSpace.prototype.processChildFetch = oFF.noSupport;
oFF.OlapCatalogSpace.prototype.getParent = function()
{
	return null;
};
oFF.OlapCatalogSpace.prototype.getCatalogSpace = function()
{
	return this;
};
oFF.OlapCatalogSpace.prototype.getSystemDescription = function()
{
	return null;
};
oFF.OlapCatalogSpace.prototype.getOlapCatalogManager = function()
{
	return null;
};
oFF.OlapCatalogSpace.prototype.getMetaObjectType = function()
{
	return null;
};
oFF.OlapCatalogSpace.prototype.getSchema = function()
{
	return null;
};
oFF.OlapCatalogSpace.prototype.getOriginElement = function()
{
	return null;
};
oFF.OlapCatalogSpace.prototype.getPackage = function()
{
	return null;
};
oFF.OlapCatalogSpace.prototype.getObjectName = function()
{
	return null;
};
oFF.OlapCatalogSpace.prototype.getQueryManager = function()
{
	return null;
};
oFF.OlapCatalogSpace.prototype.getDataSource = function()
{
	return null;
};
oFF.OlapCatalogSpace.prototype.getContext = function()
{
	return null;
};

oFF.QProfiler = function() {};
oFF.QProfiler.prototype = new oFF.DfApplicationProgram();
oFF.QProfiler.prototype._ff_c = "QProfiler";

oFF.QProfiler.PARAM_SYS = "sys";
oFF.QProfiler.PARAM_DS = "ds";
oFF.QProfiler.PARAM_USER = "user";
oFF.QProfiler.PARAM_PWD = "pwd";
oFF.QProfiler.prototype.m_hasError = false;
oFF.QProfiler.prototype.m_system = null;
oFF.QProfiler.prototype.m_dataSource = null;
oFF.QProfiler.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfApplicationProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addMandatoryOption(oFF.QProfiler.PARAM_SYS, "The system name", "name", oFF.XValueType.STRING);
	metadata.addMandatoryOption(oFF.QProfiler.PARAM_DS, "The datasource name in the format type:[schema][package[name]", "name", oFF.XValueType.STRING);
	metadata.addOption(oFF.QProfiler.PARAM_USER, "User for the system, activating basic auth", "user", oFF.XValueType.STRING);
	metadata.addOption(oFF.QProfiler.PARAM_PWD, "Password for the user", "pwd", oFF.XValueType.STRING);
};
oFF.QProfiler.prototype.newProgram = function()
{
	var newPrg = new oFF.QProfiler();
	newPrg.setup();
	return newPrg;
};
oFF.QProfiler.prototype.evalArguments = function()
{
	oFF.DfApplicationProgram.prototype.evalArguments.call( this );
	var args = this.getArgumentStructure();
	var argumentDefinitions = this.getArguments().getArgumentDefinitions();
	for (var i = 0; i < argumentDefinitions.size(); i++)
	{
		var argDef = argumentDefinitions.get(i);
		if (argDef.isMandatory())
		{
			if (args.containsKey(argDef.getName()) === false)
			{
				this.println(oFF.XStringUtils.concatenate2("Argument not given: ", argDef.getName()));
				this.m_hasError = true;
			}
		}
	}
	if (this.m_hasError === false)
	{
		this.m_system = args.getStringByKey(oFF.QProfiler.PARAM_SYS);
		this.m_dataSource = args.getStringByKey(oFF.QProfiler.PARAM_DS);
	}
};
oFF.QProfiler.prototype.runProcess = function()
{
	if (this.m_hasError === false)
	{
		var application = this.getApplication();
		this.println("*** Olap Profiler ***");
		this.println(oFF.XStringUtils.concatenate2("System:    ", this.m_system));
		this.println(oFF.XStringUtils.concatenate2("Datasource ", this.m_dataSource));
		var m1 = oFF.XSystemUtils.getCurrentTimeInMilliseconds();
		this.println("Create service config");
		var queryServiceConfig = oFF.QueryServiceConfig.createWithDataSourceName(application, this.m_system, this.m_dataSource);
		var m2 = oFF.XSystemUtils.getCurrentTimeInMilliseconds();
		this.println2l("Time: ", m2 - m1);
		this.println("Load metadata");
		var syncAction = queryServiceConfig.processQueryManagerCreation(oFF.SyncType.BLOCKING, null, null);
		var queryManager = syncAction.getData();
		var m3 = oFF.XSystemUtils.getCurrentTimeInMilliseconds();
		this.println2l("Time: ", m3 - m2);
		this.println("Shutdown");
		queryManager.processShutdown(oFF.SyncType.BLOCKING, null, null);
		var m4 = oFF.XSystemUtils.getCurrentTimeInMilliseconds();
		this.println2l("Time: ", m4 - m3);
		this.exitNow(0);
	}
	else
	{
		this.exitNow(1);
	}
	return false;
};
oFF.QProfiler.prototype.println2l = function(text, value)
{
	var buffer = oFF.XStringBuffer.create();
	buffer.append(text).appendLong(value);
	this.println(buffer.toString());
};

oFF.PivotCellType = function() {};
oFF.PivotCellType.prototype = new oFF.XConstantWithParent();
oFF.PivotCellType.prototype._ff_c = "PivotCellType";

oFF.PivotCellType.CELL = null;
oFF.PivotCellType.REAL_CELL = null;
oFF.PivotCellType.ANCHOR_CELL = null;
oFF.PivotCellType.CONTENT = null;
oFF.PivotCellType.SELECT = null;
oFF.PivotCellType.HEAD_AREA = null;
oFF.PivotCellType.TITLE = null;
oFF.PivotCellType.TWIN = null;
oFF.PivotCellType.HEADER = null;
oFF.PivotCellType.HIERARCHY = null;
oFF.PivotCellType.SCALING = null;
oFF.PivotCellType.SELECT_ROWS = null;
oFF.PivotCellType.SELECT_COLUMNS = null;
oFF.PivotCellType.DATA = null;
oFF.PivotCellType.staticSetup = function()
{
	oFF.PivotCellType.CELL = oFF.PivotCellType.create("CELL", null);
	oFF.PivotCellType.REAL_CELL = oFF.PivotCellType.create("REAL_CELL", oFF.PivotCellType.CELL);
	oFF.PivotCellType.ANCHOR_CELL = oFF.PivotCellType.create("ANCHOR_CELL", oFF.PivotCellType.CELL);
	oFF.PivotCellType.CONTENT = oFF.PivotCellType.create("CONTENT", oFF.PivotCellType.REAL_CELL);
	oFF.PivotCellType.SELECT = oFF.PivotCellType.create("SELECT", oFF.PivotCellType.REAL_CELL);
	oFF.PivotCellType.HEAD_AREA = oFF.PivotCellType.create("HEAD_AREA", oFF.PivotCellType.CONTENT);
	oFF.PivotCellType.TITLE = oFF.PivotCellType.create("TITLE", oFF.PivotCellType.HEAD_AREA);
	oFF.PivotCellType.TWIN = oFF.PivotCellType.create("TWIN", oFF.PivotCellType.TITLE);
	oFF.PivotCellType.HEADER = oFF.PivotCellType.create("HEADER", oFF.PivotCellType.HEAD_AREA);
	oFF.PivotCellType.HIERARCHY = oFF.PivotCellType.create("HIERARCHY", oFF.PivotCellType.HEADER);
	oFF.PivotCellType.SCALING = oFF.PivotCellType.create("SCALING", oFF.PivotCellType.HEADER);
	oFF.PivotCellType.SELECT_ROWS = oFF.PivotCellType.create("SELECT_ROWS", oFF.PivotCellType.SELECT);
	oFF.PivotCellType.SELECT_COLUMNS = oFF.PivotCellType.create("SELECT_COLUMNS", oFF.PivotCellType.SELECT);
	oFF.PivotCellType.DATA = oFF.PivotCellType.create("DATA", oFF.PivotCellType.CONTENT);
};
oFF.PivotCellType.create = function(name, parent)
{
	var object = new oFF.PivotCellType();
	object.setupExt(name, parent);
	return object;
};

oFF.VirtualMatrixInsertColumns = function() {};
oFF.VirtualMatrixInsertColumns.prototype = new oFF.VirtualMatrixInsert();
oFF.VirtualMatrixInsertColumns.prototype._ff_c = "VirtualMatrixInsertColumns";

oFF.VirtualMatrixInsertColumns.create = function()
{
	var virtualMatrixInsertColumns = new oFF.VirtualMatrixInsertColumns();
	virtualMatrixInsertColumns.instanceSetup();
	return virtualMatrixInsertColumns;
};
oFF.VirtualMatrixInsertColumns.prototype.m_columnPointer = null;
oFF.VirtualMatrixInsertColumns.prototype.m_heightIc = 0;
oFF.VirtualMatrixInsertColumns.prototype.m_rowLines = null;
oFF.VirtualMatrixInsertColumns.prototype.instanceSetup = function()
{
	this.m_heightIc = oFF.MxGridMatrix.INTERNAL_INITIAL;
};
oFF.VirtualMatrixInsertColumns.prototype.prepareMatrix = function()
{
	oFF.VirtualMatrixInsert.prototype.prepareMatrix.call( this );
	var rowCount = oFF.VirtualMatrixInsert.prototype.getRowCount.call( this );
	if (this.m_heightIc === oFF.MxGridMatrix.INTERNAL_INITIAL)
	{
		this.m_heightIc = rowCount;
	}
	else
	{
		if (rowCount === 0)
		{
			this.m_rowLines = oFF.XList.create();
			for (var i = 0; i < this.m_heightIc; i++)
			{
				this.m_rowLines.add(oFF.VirtualLine.create(oFF.LineType.ROW_TUPLE, null));
			}
		}
		else if (rowCount !== this.m_heightIc)
		{
			throw oFF.XException.createIllegalStateException("Row count in inserted rows is different to underlying matrix");
		}
	}
	return oFF.MxGridState.INITIALIZED;
};
oFF.VirtualMatrixInsertColumns.prototype.getRowCount = function()
{
	return this.m_heightIc;
};
oFF.VirtualMatrixInsertColumns.prototype.getColumnCount = function()
{
	if (oFF.isNull(this.m_columnPointer))
	{
		return oFF.VirtualMatrixInsert.prototype.getColumnCount.call( this );
	}
	return this.m_columnPointer.size();
};
oFF.VirtualMatrixInsertColumns.prototype.getCell = function(x, y)
{
	if (oFF.isNull(this.m_columnPointer))
	{
		return oFF.VirtualMatrixInsert.prototype.getPivotCell.call( this , x, y);
	}
	var line = this.m_columnPointer.get(x);
	if (line.m_isOrigin)
	{
		return this.m_origin.getCell(line.m_originIndex, y);
	}
	return line.m_cells.get(y);
};
oFF.VirtualMatrixInsertColumns.prototype.getRow = function(y)
{
	if (oFF.isNull(this.m_rowLines))
	{
		return oFF.VirtualMatrixInsert.prototype.getRow.call( this , y);
	}
	return this.m_rowLines.get(y);
};
oFF.VirtualMatrixInsertColumns.prototype.getColumn = function(x)
{
	if (oFF.isNull(this.m_columnPointer))
	{
		return oFF.VirtualMatrixInsert.prototype.getPivotColumn.call( this , x);
	}
	var line = this.m_columnPointer.get(x);
	if (line.m_isOrigin)
	{
		return this.m_origin.getColumn(line.m_originIndex);
	}
	return oFF.VirtualLine.create(oFF.LineType.COLUMN_TUPLE, null);
};
oFF.VirtualMatrixInsertColumns.prototype.add = function(fullLine)
{
	var index = this.getColumnCount();
	this.insert(index, fullLine);
	return index;
};
oFF.VirtualMatrixInsertColumns.prototype.insert = function(index, fullLine)
{
	if (oFF.isNull(this.m_columnPointer))
	{
		this.m_columnPointer = oFF.XList.create();
		var max = this.m_origin.getColumnCount();
		for (var i = 0; i < max; i++)
		{
			this.m_columnPointer.add(this.createOriginLine(i));
		}
	}
	this.m_heightIc = fullLine.size();
	var newLine = this.createNewColumn(fullLine);
	this.m_columnPointer.insert(index, newLine);
};
oFF.VirtualMatrixInsertColumns.prototype.createNewColumn = function(newColumn)
{
	var line = new oFF.VirtualMatrixInsertLine();
	line.m_isOrigin = false;
	var cells = oFF.XList.create();
	var cellFactory = this.getCellFactory();
	for (var i = 0; i < this.m_heightIc; i++)
	{
		var currentCell;
		if (oFF.notNull(newColumn) && i < newColumn.size() && newColumn.get(i) !== null)
		{
			currentCell = newColumn.get(i);
		}
		else
		{
			var simpleTextCell = cellFactory.createDataCell();
			simpleTextCell.setText("");
			currentCell = simpleTextCell;
		}
		cells.add(currentCell);
	}
	line.m_cells = cells;
	return line;
};

oFF.VirtualMatrixInsertRows = function() {};
oFF.VirtualMatrixInsertRows.prototype = new oFF.VirtualMatrixInsert();
oFF.VirtualMatrixInsertRows.prototype._ff_c = "VirtualMatrixInsertRows";

oFF.VirtualMatrixInsertRows.create = function()
{
	var virtualMatrixInsertRows = new oFF.VirtualMatrixInsertRows();
	virtualMatrixInsertRows.instanceSetup();
	return virtualMatrixInsertRows;
};
oFF.VirtualMatrixInsertRows.prototype.m_rowPointer = null;
oFF.VirtualMatrixInsertRows.prototype.m_widthIr = 0;
oFF.VirtualMatrixInsertRows.prototype.m_columnLines = null;
oFF.VirtualMatrixInsertRows.prototype.instanceSetup = function()
{
	this.m_widthIr = oFF.MxGridMatrix.INTERNAL_INITIAL;
};
oFF.VirtualMatrixInsertRows.prototype.prepareMatrix = function()
{
	oFF.VirtualMatrixInsert.prototype.prepareMatrix.call( this );
	var colCount = oFF.VirtualMatrixInsert.prototype.getColumnCount.call( this );
	if (this.m_widthIr === oFF.MxGridMatrix.INTERNAL_INITIAL)
	{
		this.m_widthIr = colCount;
	}
	else
	{
		if (colCount === 0)
		{
			this.m_columnLines = oFF.XList.create();
			for (var i = 0; i < this.m_widthIr; i++)
			{
				this.m_columnLines.add(oFF.VirtualLine.create(oFF.LineType.COLUMN_TUPLE, null));
			}
		}
		else if (colCount !== this.m_widthIr)
		{
			throw oFF.XException.createIllegalStateException("Column count in inserted rows is different to underlying matrix");
		}
	}
	return oFF.MxGridState.INITIALIZED;
};
oFF.VirtualMatrixInsertRows.prototype.getColumnCount = function()
{
	return this.m_widthIr;
};
oFF.VirtualMatrixInsertRows.prototype.getRowCount = function()
{
	if (oFF.isNull(this.m_rowPointer))
	{
		return oFF.VirtualMatrixInsert.prototype.getRowCount.call( this );
	}
	return this.m_rowPointer.size();
};
oFF.VirtualMatrixInsertRows.prototype.getCell = function(x, y)
{
	if (oFF.isNull(this.m_rowPointer))
	{
		return oFF.VirtualMatrixInsert.prototype.getPivotCell.call( this , x, y);
	}
	var line = this.m_rowPointer.get(y);
	if (line.m_isOrigin)
	{
		return this.m_origin.getCell(x, line.m_originIndex);
	}
	return line.m_cells.get(x);
};
oFF.VirtualMatrixInsertRows.prototype.getRow = function(y)
{
	if (oFF.isNull(this.m_rowPointer))
	{
		return oFF.VirtualMatrixInsert.prototype.getPivotRow.call( this , y);
	}
	var line = this.m_rowPointer.get(y);
	if (line.m_isOrigin)
	{
		return this.m_origin.getRow(line.m_originIndex);
	}
	return oFF.VirtualLine.create(oFF.LineType.ROW_TUPLE, null);
};
oFF.VirtualMatrixInsertRows.prototype.getColumn = function(x)
{
	if (oFF.isNull(this.m_columnLines))
	{
		return oFF.VirtualMatrixInsert.prototype.getColumn.call( this , x);
	}
	return this.m_columnLines.get(x);
};
oFF.VirtualMatrixInsertRows.prototype.add = function(fullLine)
{
	var index = this.getRowCount();
	this.insert(index, fullLine);
	return index;
};
oFF.VirtualMatrixInsertRows.prototype.insert = function(index, fullLine)
{
	if (oFF.isNull(this.m_rowPointer))
	{
		this.m_rowPointer = oFF.XList.create();
		var max = this.m_origin.getRowCount();
		for (var i = 0; i < max; i++)
		{
			this.m_rowPointer.add(this.createOriginLine(i));
		}
	}
	this.m_widthIr = fullLine.size();
	var newLine = this.createNewRow(fullLine);
	this.m_rowPointer.insert(index, newLine);
};
oFF.VirtualMatrixInsertRows.prototype.createNewRow = function(newRow)
{
	var line = new oFF.VirtualMatrixInsertLine();
	line.m_isOrigin = false;
	var cells = oFF.XList.create();
	var cellFactory = this.getCellFactory();
	for (var i = 0; i < this.m_widthIr; i++)
	{
		var currentCell;
		if (oFF.notNull(newRow) && i < newRow.size() && newRow.get(i) !== null)
		{
			currentCell = newRow.get(i);
		}
		else
		{
			var simpleTextCell = cellFactory.createDataCell();
			simpleTextCell.setText("");
			currentCell = simpleTextCell;
		}
		cells.add(currentCell);
	}
	line.m_cells = cells;
	return line;
};

oFF.Section_IV_Collapsed = function() {};
oFF.Section_IV_Collapsed.prototype = new oFF.Section_IV();
oFF.Section_IV_Collapsed.prototype._ff_c = "Section_IV_Collapsed";

oFF.Section_IV_Collapsed.createIVCollapsed = function(client, app, rowInfo, columnInfo, rs, hasDocuments, cellFactory)
{
	var object = new oFF.Section_IV_Collapsed();
	object.setupIV(client, app, rowInfo, columnInfo, rs, hasDocuments, cellFactory);
	var rsCell = object.m_resultSet.getDataCell(0, 0);
	object.m_recycleDataCell.set(object.m_application, rsCell, oFF.CellType.PV_DATACELL, 0, -1, true, false, object.m_hasDocuments);
	object.m_columnCount = 1;
	object.m_rowCount = 1;
	return object;
};
oFF.Section_IV_Collapsed.prototype.getCell = function(x, y)
{
	return this.m_recycleDataCell;
};

oFF.Section_IV_ColumnsOnly = function() {};
oFF.Section_IV_ColumnsOnly.prototype = new oFF.Section_IV();
oFF.Section_IV_ColumnsOnly.prototype._ff_c = "Section_IV_ColumnsOnly";

oFF.Section_IV_ColumnsOnly.createIVColumnsOnly = function(client, app, rowInfo, columnInfo, rs, hasDocuments, cellFactory)
{
	var object = new oFF.Section_IV_ColumnsOnly();
	object.setupIV(client, app, rowInfo, columnInfo, rs, hasDocuments, cellFactory);
	var resultsetAxis = object.m_columnInfo.getDataset().getResultsetAxis();
	object.m_columnCount = resultsetAxis.getDataCount();
	object.m_rowCount = 1;
	return object;
};
oFF.Section_IV_ColumnsOnly.prototype.getCell = function(x, y)
{
	var currentColHeaderState = this.m_columnInfo.getLine(x).getHeaderState();
	var isUnitVisible = currentColHeaderState.displayUnitInCell();
	var total = currentColHeaderState.isTotals();
	var rsCell = this.m_resultSet.getDataCell(x, 0);
	this.m_recycleDataCell.set(this.m_application, rsCell, oFF.CellType.PV_DATACELL, x, -1, isUnitVisible, total, this.m_hasDocuments);
	return this.m_recycleDataCell;
};

oFF.Section_IV_Full = function() {};
oFF.Section_IV_Full.prototype = new oFF.Section_IV();
oFF.Section_IV_Full.prototype._ff_c = "Section_IV_Full";

oFF.Section_IV_Full.createIVFull = function(client, app, rowInfo, columnInfo, rs, hasDocuments, cellFactory)
{
	var object = new oFF.Section_IV_Full();
	object.setupIV(client, app, rowInfo, columnInfo, rs, hasDocuments, cellFactory);
	object.m_columnCount = object.m_columnInfo.getDataset().getResultsetAxis().getTupleElementsCount();
	object.m_rowCount = object.m_rowInfo.getDataset().getResultsetAxis().getTupleElementsCount();
	return object;
};
oFF.Section_IV_Full.prototype.getCell = function(x, y)
{
	var currentRowHeaderState = this.m_rowInfo.getLine(y).getHeaderState();
	var absoluteRowPosition = y * this.m_columnCount;
	var currentColumnHeaderState = this.m_columnInfo.getLine(x).getHeaderState();
	var isUnitVisible = currentRowHeaderState.displayUnitInCell() && currentColumnHeaderState.displayUnitInCell();
	var total = currentRowHeaderState.isTotals() || currentColumnHeaderState.isTotals();
	var dataPosition = absoluteRowPosition + x;
	var rsCell;
	if (dataPosition < this.m_resultSet.getAvailableDataCellCount())
	{
		rsCell = this.m_resultSet.getDataCell(x, absoluteRowPosition);
	}
	else
	{
		rsCell = null;
	}
	this.m_recycleDataCell.set(this.m_application, rsCell, oFF.CellType.PV_DATACELL, dataPosition, -1, isUnitVisible, total, this.m_hasDocuments);
	return this.m_recycleDataCell;
};

oFF.Section_IV_NewLines = function() {};
oFF.Section_IV_NewLines.prototype = new oFF.Section_IV();
oFF.Section_IV_NewLines.prototype._ff_c = "Section_IV_NewLines";

oFF.Section_IV_NewLines.createIVNewLines = function(client, app, rowInfo, columnInfo, rs, hasDocuments, cellFactory)
{
	var object = new oFF.Section_IV_NewLines();
	object.setupIV(client, app, rowInfo, columnInfo, rs, hasDocuments, cellFactory);
	return object;
};
oFF.Section_IV_NewLines.prototype.getCell = oFF.noSupport;

oFF.Section_IV_RowsOnly = function() {};
oFF.Section_IV_RowsOnly.prototype = new oFF.Section_IV();
oFF.Section_IV_RowsOnly.prototype._ff_c = "Section_IV_RowsOnly";

oFF.Section_IV_RowsOnly.createIVRowsOnly = function(client, app, rowInfo, columnInfo, rs, hasDocuments, cellFactory)
{
	var object = new oFF.Section_IV_RowsOnly();
	object.setupIV(client, app, rowInfo, columnInfo, rs, hasDocuments, cellFactory);
	object.m_columnCount = 1;
	object.m_rowCount = object.m_rowInfo.getDataset().getResultsetAxis().getDataCount();
	return object;
};
oFF.Section_IV_RowsOnly.prototype.getCell = function(x, y)
{
	var currentRowHeaderState = this.m_rowInfo.getLine(y).getHeaderState();
	var isUnitVisible = currentRowHeaderState.displayUnitInCell();
	var total = currentRowHeaderState.isTotals();
	var rsCell = this.m_resultSet.getDataCell(0, y);
	this.m_recycleDataCell.set(this.m_application, rsCell, oFF.CellType.PV_DATACELL, y, -1, isUnitVisible, total, this.m_hasDocuments);
	return this.m_recycleDataCell;
};

oFF.TitleType = function() {};
oFF.TitleType.prototype = new oFF.XConstantWithParent();
oFF.TitleType.prototype._ff_c = "TitleType";

oFF.TitleType.PRESENTATION = null;
oFF.TitleType.ANCHOR = null;
oFF.TitleType.PRIMARY = null;
oFF.TitleType.ATTRIBUTE = null;
oFF.TitleType.HIERARCHY = null;
oFF.TitleType.CHARACTERISTIC = null;
oFF.TitleType.CHARACTERISTIC_ANCHOR = null;
oFF.TitleType.CHARACTERISTIC_PRESENTATION = null;
oFF.TitleType.CHARACTERISTIC_ATTRIBUTE_ANCHOR = null;
oFF.TitleType.CHARACTERISTIC_ATTRIBUTE_PRESENTATION = null;
oFF.TitleType.CHAR_HIERARCHY = null;
oFF.TitleType.CHAR_HIERARCHY_ANCHOR = null;
oFF.TitleType.CHAR_HIERARCHY_PRESENTATION = null;
oFF.TitleType.CHAR_HIERARCHY_ATTRIBUTE_ANCHOR = null;
oFF.TitleType.CHAR_HIERARCHY_ATTRIBUTE_PRESENTATION = null;
oFF.TitleType.UNIVERSAL_HIERARCHY = null;
oFF.TitleType.UNIVERSAL_HIERARCHY_ANCHOR = null;
oFF.TitleType.UNIVERSAL_HIERARCHY_PRESENTATION = null;
oFF.TitleType.UNIVERSAL_HIERARCHY_ATTRIBUTE_ANCHOR = null;
oFF.TitleType.UNIVERSAL_HIERARCHY_ATTRIBUTE_PRESENTATION = null;
oFF.TitleType.SCALING_FACTORS = null;
oFF.TitleType.staticSetup = function()
{
	oFF.TitleType.PRESENTATION = oFF.TitleType.create("PRESENTATION");
	oFF.TitleType.ANCHOR = oFF.TitleType.create("ANCHOR");
	oFF.TitleType.PRIMARY = oFF.TitleType.create("PRIMARY");
	oFF.TitleType.ATTRIBUTE = oFF.TitleType.create("ATTR");
	oFF.TitleType.HIERARCHY = oFF.TitleType.create("HIERARY");
	oFF.TitleType.CHARACTERISTIC = oFF.TitleType.create("CHAR");
	oFF.TitleType.CHARACTERISTIC_ANCHOR = oFF.TitleType.createWithParents("CHAR_ANCHOR", oFF.TitleType.CHARACTERISTIC, oFF.TitleType.PRIMARY, oFF.TitleType.ANCHOR);
	oFF.TitleType.CHARACTERISTIC_PRESENTATION = oFF.TitleType.createWithParents("CHAR_PRESENT", oFF.TitleType.CHARACTERISTIC, oFF.TitleType.PRIMARY, oFF.TitleType.PRESENTATION);
	oFF.TitleType.CHARACTERISTIC_ATTRIBUTE_ANCHOR = oFF.TitleType.createWithParents("CHAR_ATTR_ANCHOR", oFF.TitleType.CHARACTERISTIC, oFF.TitleType.ATTRIBUTE, oFF.TitleType.ANCHOR);
	oFF.TitleType.CHARACTERISTIC_ATTRIBUTE_PRESENTATION = oFF.TitleType.createWithParents("CHAR_ATTR_PRESENT", oFF.TitleType.CHARACTERISTIC, oFF.TitleType.ATTRIBUTE, oFF.TitleType.PRESENTATION);
	oFF.TitleType.CHAR_HIERARCHY = oFF.TitleType.createWithParent("CHHI", oFF.TitleType.HIERARCHY);
	oFF.TitleType.CHAR_HIERARCHY_ANCHOR = oFF.TitleType.createWithParents("CHHI_ANCHOR", oFF.TitleType.CHAR_HIERARCHY, oFF.TitleType.PRIMARY, oFF.TitleType.ANCHOR);
	oFF.TitleType.CHAR_HIERARCHY_PRESENTATION = oFF.TitleType.createWithParents("CHHI_PRESENT", oFF.TitleType.CHAR_HIERARCHY, oFF.TitleType.PRIMARY, oFF.TitleType.PRESENTATION);
	oFF.TitleType.CHAR_HIERARCHY_ATTRIBUTE_ANCHOR = oFF.TitleType.createWithParents("CHHI_ATTR_ANCHOR", oFF.TitleType.CHAR_HIERARCHY, oFF.TitleType.ATTRIBUTE, oFF.TitleType.ANCHOR);
	oFF.TitleType.CHAR_HIERARCHY_ATTRIBUTE_PRESENTATION = oFF.TitleType.createWithParents("CHHI_ATTR_PRESENT", oFF.TitleType.CHAR_HIERARCHY, oFF.TitleType.ATTRIBUTE, oFF.TitleType.PRESENTATION);
	oFF.TitleType.UNIVERSAL_HIERARCHY = oFF.TitleType.createWithParent("UNHI", oFF.TitleType.HIERARCHY);
	oFF.TitleType.UNIVERSAL_HIERARCHY_ANCHOR = oFF.TitleType.createWithParents("UNHI_ANCHOR", oFF.TitleType.UNIVERSAL_HIERARCHY, oFF.TitleType.PRIMARY, oFF.TitleType.ANCHOR);
	oFF.TitleType.UNIVERSAL_HIERARCHY_PRESENTATION = oFF.TitleType.createWithParents("UNHI_PRESENT", oFF.TitleType.UNIVERSAL_HIERARCHY, oFF.TitleType.PRIMARY, oFF.TitleType.PRESENTATION);
	oFF.TitleType.UNIVERSAL_HIERARCHY_ATTRIBUTE_ANCHOR = oFF.TitleType.createWithParents("UNHI_ATTR_ANCHOR", oFF.TitleType.UNIVERSAL_HIERARCHY, oFF.TitleType.ATTRIBUTE, oFF.TitleType.ANCHOR);
	oFF.TitleType.UNIVERSAL_HIERARCHY_ATTRIBUTE_PRESENTATION = oFF.TitleType.createWithParents("UNHI_ATTR_PRESENT", oFF.TitleType.UNIVERSAL_HIERARCHY, oFF.TitleType.ATTRIBUTE, oFF.TitleType.PRESENTATION);
	oFF.TitleType.SCALING_FACTORS = oFF.TitleType.create("SCALING");
};
oFF.TitleType.create = function(name)
{
	return oFF.XConstant.setupName(new oFF.TitleType(), name);
};
oFF.TitleType.createWithParent = function(name, parent)
{
	var object = new oFF.TitleType();
	object.setupExt(name, parent);
	return object;
};
oFF.TitleType.createWithParents = function(name, parent1, parent2, parent3)
{
	var object = new oFF.TitleType();
	object.setupExt(name, parent1);
	object.m_parent2 = parent2;
	object.m_parent3 = parent3;
	return object;
};
oFF.TitleType.prototype.m_parent2 = null;
oFF.TitleType.prototype.m_parent3 = null;
oFF.TitleType.prototype.isTypeOf = function(type)
{
	if (oFF.XConstantWithParent.prototype.isTypeOf.call( this , type))
	{
		return true;
	}
	if (oFF.isNull(this.m_parent2))
	{
		return false;
	}
	if (this.m_parent2.isTypeOf(type))
	{
		return true;
	}
	return this.m_parent3.isTypeOf(type);
};
oFF.TitleType.prototype.isPresentation = function()
{
	return this.isTypeOf(oFF.TitleType.PRESENTATION);
};
oFF.TitleType.prototype.isAnchor = function()
{
	return this.isTypeOf(oFF.TitleType.ANCHOR);
};
oFF.TitleType.prototype.isPrimary = function()
{
	return this.isTypeOf(oFF.TitleType.PRIMARY);
};
oFF.TitleType.prototype.isAttribute = function()
{
	return this.isTypeOf(oFF.TitleType.ATTRIBUTE);
};
oFF.TitleType.prototype.isCharacteristic = function()
{
	return this.isTypeOf(oFF.TitleType.CHARACTERISTIC);
};
oFF.TitleType.prototype.isHierarchy = function()
{
	return this.isTypeOf(oFF.TitleType.HIERARCHY);
};
oFF.TitleType.prototype.isCharacteristicHierarchy = function()
{
	return this.isTypeOf(oFF.TitleType.CHAR_HIERARCHY);
};
oFF.TitleType.prototype.isUniversalHierarchy = function()
{
	return this.isTypeOf(oFF.TitleType.UNIVERSAL_HIERARCHY);
};
oFF.TitleType.prototype.isScalingFactor = function()
{
	return this.isTypeOf(oFF.TitleType.SCALING_FACTORS);
};

oFF.DjPropertyType = function() {};
oFF.DjPropertyType.prototype = new oFF.XConstantWithParent();
oFF.DjPropertyType.prototype._ff_c = "DjPropertyType";

oFF.DjPropertyType.ROOT = null;
oFF.DjPropertyType.COMPLEX = null;
oFF.DjPropertyType.PRIMITIVE = null;
oFF.DjPropertyType.BOOLEAN = null;
oFF.DjPropertyType.INTEGER = null;
oFF.DjPropertyType.DOUBLE = null;
oFF.DjPropertyType.STRING = null;
oFF.DjPropertyType.XOBJECT = null;
oFF.DjPropertyType.CONSTANT = null;
oFF.DjPropertyType.COMPONENT = null;
oFF.DjPropertyType.COMPONENT_LIST = null;
oFF.DjPropertyType.NAMED_COMPONENT_LIST = null;
oFF.DjPropertyType.NAME = null;
oFF.DjPropertyType.MAX_LENGTH = null;
oFF.DjPropertyType.ID = null;
oFF.DjPropertyType.IS_ENABLED = null;
oFF.DjPropertyType.ENABLE_LIST_SUGGEST = null;
oFF.DjPropertyType.IS_OPEN = null;
oFF.DjPropertyType.IS_FOLDER = null;
oFF.DjPropertyType.TEXT = null;
oFF.DjPropertyType.INDEX = null;
oFF.DjPropertyType.DESCRIPTION = null;
oFF.DjPropertyType.CUSTOM_OBJECT = null;
oFF.DjPropertyType.ROW = null;
oFF.DjPropertyType.COLUMN = null;
oFF.DjPropertyType.ROW_SPAN = null;
oFF.DjPropertyType.COLUMN_SPAN = null;
oFF.DjPropertyType.COLUMN_COUNT = null;
oFF.DjPropertyType.LENGTH = null;
oFF.DjPropertyType.SELECT = null;
oFF.DjPropertyType.CTYPE_TARGET = null;
oFF.DjPropertyType.SYS_TYPE = null;
oFF.DjPropertyType.DATAPROVIDERS = null;
oFF.DjPropertyType.SYNC_STATE = null;
oFF.DjPropertyType.REGISTER_ACTION = null;
oFF.DjPropertyType.ON_ATTRIBUTE_CHANGE = null;
oFF.DjPropertyType.TRIGGER = null;
oFF.DjPropertyType.SYSTEM_NAME = null;
oFF.DjPropertyType.DATA_SOURCE_ID = null;
oFF.DjPropertyType.TOSTRING = null;
oFF.DjPropertyType.CLIPBOARD_CONTENT = null;
oFF.DjPropertyType.s_lookup = null;
oFF.DjPropertyType.create = function(name, parent)
{
	var newConstant = new oFF.DjPropertyType();
	newConstant.setupExt(name, parent);
	oFF.DjPropertyType.s_lookup.put(name, newConstant);
	return newConstant;
};
oFF.DjPropertyType.staticSetup = function()
{
	oFF.DjPropertyType.s_lookup = oFF.XHashMapByString.create();
	oFF.DjPropertyType.ROOT = oFF.DjPropertyType.create("root", null);
	oFF.DjPropertyType.COMPLEX = oFF.DjPropertyType.create("primitive", oFF.DjPropertyType.ROOT);
	oFF.DjPropertyType.PRIMITIVE = oFF.DjPropertyType.create("complex", null);
	oFF.DjPropertyType.BOOLEAN = oFF.DjPropertyType.create("bool", oFF.DjPropertyType.PRIMITIVE);
	oFF.DjPropertyType.INTEGER = oFF.DjPropertyType.create("integer", oFF.DjPropertyType.PRIMITIVE);
	oFF.DjPropertyType.DOUBLE = oFF.DjPropertyType.create("double", oFF.DjPropertyType.PRIMITIVE);
	oFF.DjPropertyType.STRING = oFF.DjPropertyType.create("string", oFF.DjPropertyType.PRIMITIVE);
	oFF.DjPropertyType.XOBJECT = oFF.DjPropertyType.create("xobject", oFF.DjPropertyType.PRIMITIVE);
	oFF.DjPropertyType.CONSTANT = oFF.DjPropertyType.create("constant", oFF.DjPropertyType.PRIMITIVE);
	oFF.DjPropertyType.COMPONENT = oFF.DjPropertyType.create("component", oFF.DjPropertyType.COMPLEX);
	oFF.DjPropertyType.COMPONENT_LIST = oFF.DjPropertyType.create("componentList", oFF.DjPropertyType.COMPLEX);
	oFF.DjPropertyType.NAMED_COMPONENT_LIST = oFF.DjPropertyType.create("namedComponentList", oFF.DjPropertyType.COMPONENT_LIST);
	oFF.DjPropertyType.ID = oFF.DjPropertyType.create("id", oFF.DjPropertyType.STRING);
	oFF.DjPropertyType.IS_ENABLED = oFF.DjPropertyType.create("isEnabled", oFF.DjPropertyType.BOOLEAN);
	oFF.DjPropertyType.IS_OPEN = oFF.DjPropertyType.create("isOpen", oFF.DjPropertyType.BOOLEAN);
	oFF.DjPropertyType.IS_FOLDER = oFF.DjPropertyType.create("isFolder", oFF.DjPropertyType.BOOLEAN);
	oFF.DjPropertyType.INDEX = oFF.DjPropertyType.create("index", oFF.DjPropertyType.INTEGER);
	oFF.DjPropertyType.NAME = oFF.DjPropertyType.create("name", oFF.DjPropertyType.STRING);
	oFF.DjPropertyType.MAX_LENGTH = oFF.DjPropertyType.create("maxLength", oFF.DjPropertyType.INTEGER);
	oFF.DjPropertyType.CUSTOM_OBJECT = oFF.DjPropertyType.create("customObject", oFF.DjPropertyType.PRIMITIVE);
	oFF.DjPropertyType.DESCRIPTION = oFF.DjPropertyType.create("description", oFF.DjPropertyType.STRING);
	oFF.DjPropertyType.TEXT = oFF.DjPropertyType.create("text", oFF.DjPropertyType.STRING);
	oFF.DjPropertyType.COLUMN = oFF.DjPropertyType.create("column", oFF.DjPropertyType.INTEGER);
	oFF.DjPropertyType.COLUMN_SPAN = oFF.DjPropertyType.create("columnSpan", oFF.DjPropertyType.INTEGER);
	oFF.DjPropertyType.COLUMN_COUNT = oFF.DjPropertyType.create("columnCount", oFF.DjPropertyType.INTEGER);
	oFF.DjPropertyType.ROW = oFF.DjPropertyType.create("row", oFF.DjPropertyType.INTEGER);
	oFF.DjPropertyType.ROW_SPAN = oFF.DjPropertyType.create("rowSpan", oFF.DjPropertyType.INTEGER);
	oFF.DjPropertyType.LENGTH = oFF.DjPropertyType.create("length", oFF.DjPropertyType.INTEGER);
	oFF.DjPropertyType.SELECT = oFF.DjPropertyType.create("select", oFF.DjPropertyType.STRING);
	oFF.DjPropertyType.CTYPE_TARGET = oFF.DjPropertyType.create("ctypeTarget", oFF.DjPropertyType.STRING);
	oFF.DjPropertyType.SYS_TYPE = oFF.DjPropertyType.create("sysType", oFF.DjPropertyType.CONSTANT);
	oFF.DjPropertyType.DATAPROVIDERS = oFF.DjPropertyType.create("dataproviders", oFF.DjPropertyType.NAMED_COMPONENT_LIST);
	oFF.DjPropertyType.SYNC_STATE = oFF.DjPropertyType.create("syncState", oFF.DjPropertyType.CONSTANT);
	oFF.DjPropertyType.REGISTER_ACTION = oFF.DjPropertyType.create("registerAction", oFF.DjPropertyType.COMPONENT);
	oFF.DjPropertyType.ON_ATTRIBUTE_CHANGE = oFF.DjPropertyType.create("onAttributeChange", oFF.DjPropertyType.REGISTER_ACTION);
	oFF.DjPropertyType.TRIGGER = oFF.DjPropertyType.create("trigger", oFF.DjPropertyType.STRING);
	oFF.DjPropertyType.SYSTEM_NAME = oFF.DjPropertyType.create("systemName", oFF.DjPropertyType.STRING);
	oFF.DjPropertyType.DATA_SOURCE_ID = oFF.DjPropertyType.create("dataSourceId", oFF.DjPropertyType.STRING);
	oFF.DjPropertyType.TOSTRING = oFF.DjPropertyType.create("toString", oFF.DjPropertyType.STRING);
	oFF.DjPropertyType.CLIPBOARD_CONTENT = oFF.DjPropertyType.create("clipboardContent", oFF.DjPropertyType.XOBJECT);
};
oFF.DjPropertyType.lookup = function(name)
{
	return oFF.DjPropertyType.s_lookup.getByKey(name);
};

oFF.MxGridLine = function() {};
oFF.MxGridLine.prototype = new oFF.XObject();
oFF.MxGridLine.prototype._ff_c = "MxGridLine";

oFF.MxGridLine.prototype.m_text = null;
oFF.MxGridLine.prototype.m_id = null;
oFF.MxGridLine.prototype.m_name = null;
oFF.MxGridLine.prototype.m_description = null;
oFF.MxGridLine.prototype.m_index = 0;
oFF.MxGridLine.prototype.m_extend = 0;
oFF.MxGridLine.prototype.m_isSelected = false;
oFF.MxGridLine.prototype.m_context = null;
oFF.MxGridLine.prototype.m_customObject = null;
oFF.MxGridLine.prototype.m_accessibleReferenceList = null;
oFF.MxGridLine.prototype.setupMxGridLine = function()
{
	this.reset();
};
oFF.MxGridLine.prototype.reset = function()
{
	this.m_extend = -1;
	this.m_isSelected = false;
	this.m_context = oFF.MxGridLineContext.DEFAULT_VALUE;
	if (oFF.notNull(this.m_accessibleReferenceList))
	{
		this.m_accessibleReferenceList.clear();
	}
};
oFF.MxGridLine.prototype.getIndexProperty = function()
{
	return this.m_index;
};
oFF.MxGridLine.prototype.setIndexProperty = function(index)
{
	this.m_index = index;
};
oFF.MxGridLine.prototype.getExtend = function()
{
	return this.m_extend;
};
oFF.MxGridLine.prototype.setExtend = function(extend)
{
	this.m_extend = extend;
};
oFF.MxGridLine.prototype.isSelected = function()
{
	return this.m_isSelected;
};
oFF.MxGridLine.prototype.setSelected = function(selected)
{
	this.m_isSelected = selected;
	return null;
};
oFF.MxGridLine.prototype.getContext = function()
{
	return this.m_context;
};
oFF.MxGridLine.prototype.setContext = function(context)
{
	this.m_context = context;
};
oFF.MxGridLine.prototype.addAccessibleReference = function(reference)
{
	if (oFF.isNull(this.m_accessibleReferenceList))
	{
		this.m_accessibleReferenceList = oFF.XListOfString.create();
	}
	this.m_accessibleReferenceList.add(reference);
};
oFF.MxGridLine.prototype.clearAccessibleReferences = function()
{
	if (oFF.notNull(this.m_accessibleReferenceList))
	{
		this.m_accessibleReferenceList.clear();
	}
};
oFF.MxGridLine.prototype.getAccessibleReferences = function()
{
	return null;
};
oFF.MxGridLine.prototype.setCustomObject = function(object)
{
	this.m_customObject = object;
	return null;
};
oFF.MxGridLine.prototype.getCustomObject = function()
{
	return this.m_customObject;
};
oFF.MxGridLine.prototype.isFolder = function()
{
	return false;
};
oFF.MxGridLine.prototype.getText = function()
{
	return this.m_text;
};
oFF.MxGridLine.prototype.setText = function(text)
{
	this.m_text = text;
};
oFF.MxGridLine.prototype.getId = function()
{
	return this.m_id;
};
oFF.MxGridLine.prototype.setId = function(identifier)
{
	this.m_id = identifier;
};
oFF.MxGridLine.prototype.getName = function()
{
	return this.m_name;
};
oFF.MxGridLine.prototype.setName = function(name)
{
	this.m_name = name;
};
oFF.MxGridLine.prototype.getDescription = function()
{
	return this.m_description;
};
oFF.MxGridLine.prototype.setDescription = function(description)
{
	this.m_description = description;
};
oFF.MxGridLine.prototype.hasChildItems = function()
{
	return false;
};
oFF.MxGridLine.prototype.getChildItemCount = function()
{
	return 0;
};
oFF.MxGridLine.prototype.getChildItemByIndex = oFF.noSupport;
oFF.MxGridLine.prototype.getIndexOfChildItem = oFF.noSupport;
oFF.MxGridLine.prototype.getChildItems = oFF.noSupport;
oFF.MxGridLine.prototype.isOpen = function()
{
	return false;
};
oFF.MxGridLine.prototype.setIsOpen = oFF.noSupport;
oFF.MxGridLine.prototype.getComponentType = oFF.noSupport;
oFF.MxGridLine.prototype.setIsFolder = oFF.noSupport;
oFF.MxGridLine.prototype.setChildItems = oFF.noSupport;
oFF.MxGridLine.prototype.addChildItem = oFF.noSupport;
oFF.MxGridLine.prototype.addChildItemByIndex = oFF.noSupport;
oFF.MxGridLine.prototype.clearChildItems = oFF.noSupport;
oFF.MxGridLine.prototype.updateChildItems = oFF.noSupport;
oFF.MxGridLine.prototype.getIcon = oFF.noSupport;
oFF.MxGridLine.prototype.setIcon = oFF.noSupport;

oFF.SxInADocu = function() {};
oFF.SxInADocu.prototype = new oFF.DfUiProgram();
oFF.SxInADocu.prototype._ff_c = "SxInADocu";

oFF.SxInADocu.CMD_SWITCH_ON = null;
oFF.SxInADocu.CMD_SWITCH_OFF = null;
oFF.SxInADocu.staticSetup = function()
{
	oFF.SxInADocu.CMD_SWITCH_ON = oFF.XStringValue.create("Switch On");
	oFF.SxInADocu.CMD_SWITCH_OFF = oFF.XStringValue.create("Switch Off");
};
oFF.SxInADocu.prototype.m_tree = null;
oFF.SxInADocu.prototype.m_text = null;
oFF.SxInADocu.prototype.m_nodeInfos = null;
oFF.SxInADocu.prototype.m_capabilities = null;
oFF.SxInADocu.prototype.newProgram = function()
{
	var prg = new oFF.SxInADocu();
	prg.setup();
	return prg;
};
oFF.SxInADocu.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	this.setTitle("InA Docu");
	this.m_nodeInfos = oFF.XHashMapByString.create();
	this.m_capabilities = oFF.XHashMapByString.create();
	this.buildCapabilities();
	var uiSplitter = genesis.newControl(oFF.UiType.VERTICAL_SPLITTER);
	uiSplitter.useMaxSpace();
	this.m_tree = uiSplitter.setNew(oFF.UiType.TREE, oFF.UiItemPosition.LEFT);
	this.m_tree.registerOnSelect(this);
	this.m_tree.registerOnExpand(this).registerOnCollapse(this);
	this.m_text = uiSplitter.setNew(oFF.UiType.TEXT_AREA, oFF.UiItemPosition.RIGHT);
	this.m_text.setText("Hello World");
	this.buildInATree();
	genesis.setRoot(uiSplitter);
};
oFF.SxInADocu.prototype.buildCapabilities = function()
{
	var children = oFF.SxInASpec.INA_DATA_REQUEST_CAPABILITIES.getChildren();
	for (var i = 0; i < children.size(); i++)
	{
		var inaSpec = children.get(i);
		if (inaSpec.isCapability())
		{
			var nodeInfo = oFF.SxTreeNodeInfo.create(inaSpec, null);
			this.m_capabilities.put(inaSpec.getName(), nodeInfo);
		}
	}
};
oFF.SxInADocu.prototype.buildInATree = function()
{
	this.m_tree.clearItems();
	this.recursiveAdd(oFF.SxInASpec.INA_DATA_REQUEST, this.m_tree, "");
};
oFF.SxInADocu.prototype.recursiveAdd = function(parentNode, uiParentNode, path)
{
	var children = parentNode.getChildren();
	for (var i = 0; i < children.size(); i++)
	{
		var inaSpec = children.get(i);
		var childPath = oFF.XStringUtils.concatenate3(path, "/", inaSpec.getName());
		var nodeInfo = this.m_nodeInfos.getByKey(childPath);
		if (oFF.isNull(nodeInfo))
		{
			if (inaSpec.isCapability())
			{
				nodeInfo = this.m_capabilities.getByKey(inaSpec.getName());
				nodeInfo.setName(childPath);
			}
			else
			{
				nodeInfo = oFF.SxTreeNodeInfo.create(inaSpec, childPath);
			}
			this.m_nodeInfos.put(nodeInfo.getName(), nodeInfo);
		}
		var enabledByCapability = inaSpec.getEnabledByCapability();
		var isEnabled = true;
		if (oFF.notNull(enabledByCapability))
		{
			var capInfo = this.m_capabilities.getByKey(enabledByCapability);
			isEnabled = capInfo.isEnabled();
		}
		if (isEnabled)
		{
			var uiItem = uiParentNode.addNewItem();
			var buffer = oFF.XStringBuffer.create();
			if (inaSpec.isCapability())
			{
				if (nodeInfo.isEnabled() === false)
				{
					buffer.append("[OFF] ");
				}
			}
			buffer.append(inaSpec.getName());
			var semanticType = inaSpec.getSemanticType();
			var valueType = inaSpec.getValueType();
			if (semanticType !== oFF.XValueType.OPTION_VALUE)
			{
				if (inaSpec.isArray())
				{
					buffer.append(" [");
					var arrayType = inaSpec.getArrayType();
					if (arrayType === oFF.XValueType.STRUCTURE)
					{
						buffer.append("{...}");
					}
					else
					{
						buffer.append(arrayType.getName());
					}
					buffer.append("]");
				}
				else if (valueType === oFF.XValueType.STRUCTURE)
				{
					buffer.append(" {...}");
				}
				else
				{
					buffer.append(" (");
					if (semanticType === oFF.XValueType.ENUM_CONSTANT)
					{
						buffer.append("enum <");
					}
					buffer.append(valueType.getName());
					if (semanticType === oFF.XValueType.ENUM_CONSTANT)
					{
						buffer.append(">");
					}
					buffer.append(")");
				}
			}
			else
			{
				if (valueType === oFF.XValueType.INTEGER)
				{
					var alias = inaSpec.getAlias();
					buffer.append(" (");
					buffer.append(alias);
					buffer.append(")");
				}
			}
			if (inaSpec.isCapability())
			{
				var triggerTargets = inaSpec.getTriggerTargets();
				if (triggerTargets.size() > 0)
				{
					buffer.append(" ~~> #");
					for (var k = 0; k < triggerTargets.size(); k++)
					{
						if (k > 0)
						{
							buffer.append(",");
						}
						buffer.append(triggerTargets.get(k).getName());
					}
				}
			}
			uiItem.setText(buffer.toString());
			var defaultExpanded = true;
			if (semanticType === oFF.XValueType.ENUM_CONSTANT || semanticType === oFF.XValueType.OPTION_LIST)
			{
				defaultExpanded = false;
			}
			uiItem.setExpanded(nodeInfo.isExpanded(defaultExpanded));
			uiItem.setCustomObject(nodeInfo);
			this.recursiveAdd(inaSpec, uiItem, childPath);
		}
	}
};
oFF.SxInADocu.prototype.onContextMenu = function(event)
{
	var selectedItem = event.getControl();
	if (oFF.notNull(selectedItem))
	{
		var sxNode = selectedItem.getCustomObject();
		var inASpec = sxNode.getInASpec();
		if (inASpec.isCapability())
		{
			var uiManager = selectedItem.getUiManager();
			var root = uiManager.getAnchor();
			var contextMenu = root.newControl(oFF.UiType.MENU);
			contextMenu.setCustomObject(selectedItem);
			this.addMenu(contextMenu, oFF.SxInADocu.CMD_SWITCH_ON);
			this.addMenu(contextMenu, oFF.SxInADocu.CMD_SWITCH_OFF);
			var posX = event.getParameters().getIntegerByKeyExt(oFF.UiControlEvent.PARAM_CLICK_X, 0);
			var posY = event.getParameters().getIntegerByKeyExt(oFF.UiControlEvent.PARAM_CLICK_Y, 0);
			contextMenu.openAtPosition(posX, posY);
		}
	}
};
oFF.SxInADocu.prototype.addMenu = function(contextMenu, cmd)
{
	var uiObj = contextMenu.addNewItem();
	uiObj.setText(cmd.getString());
	uiObj.setCustomObject(cmd);
	return uiObj;
};
oFF.SxInADocu.prototype.onSelect = function(event)
{
	var control = event.getControl();
	var uiNode = control.getCustomObject();
	if (oFF.notNull(uiNode))
	{
		var nodeInfo = uiNode.getCustomObject();
		var selectedItem = event.getSelectedItem();
		var uiType = selectedItem.getUiType();
		if (uiType === oFF.UiType.MENU_ITEM)
		{
			var cmd = selectedItem.getCustomObject();
			if (cmd === oFF.SxInADocu.CMD_SWITCH_ON)
			{
				nodeInfo.setIsEnabled(true);
				this.buildInATree();
			}
			else if (cmd === oFF.SxInADocu.CMD_SWITCH_OFF)
			{
				nodeInfo.setIsEnabled(false);
				this.buildInATree();
			}
		}
	}
};
oFF.SxInADocu.prototype.onExpand = function(event)
{
	var expandedItem = event.getAffectedItem();
	var customObject = expandedItem.getCustomObject();
	var nodeInfo = customObject;
	nodeInfo.setIsExpanded(true);
};
oFF.SxInADocu.prototype.onCollapse = function(event)
{
	var collapsedItem = event.getAffectedItem();
	var customObject = collapsedItem.getCustomObject();
	var nodeInfo = customObject;
	nodeInfo.setIsExpanded(false);
};

oFF.SxUiLab = function() {};
oFF.SxUiLab.prototype = new oFF.DfUiProgram();
oFF.SxUiLab.prototype._ff_c = "SxUiLab";

oFF.SxUiLab.CMD_SET_RIGHT_CONTENT = null;
oFF.SxUiLab.CMD_SET_LEFT_CONTENT = null;
oFF.SxUiLab.CMD_SET_TOP_CONTENT = null;
oFF.SxUiLab.CMD_SET_BOTTOM_CONTENT = null;
oFF.SxUiLab.CMD_SET_CONTENT = null;
oFF.SxUiLab.CMD_ADD_CHILD = null;
oFF.SxUiLab.CMD_REMOVE_FROM_PARENT = null;
oFF.SxUiLab.CMD_USE_MAX_SPACE = null;
oFF.SxUiLab.staticSetup = function()
{
	oFF.SxUiLab.CMD_SET_RIGHT_CONTENT = oFF.XStringValue.create("Set Right Content");
	oFF.SxUiLab.CMD_SET_LEFT_CONTENT = oFF.XStringValue.create("Set Left Content");
	oFF.SxUiLab.CMD_SET_TOP_CONTENT = oFF.XStringValue.create("Set Top Content");
	oFF.SxUiLab.CMD_SET_BOTTOM_CONTENT = oFF.XStringValue.create("Set Bottom Content");
	oFF.SxUiLab.CMD_SET_CONTENT = oFF.XStringValue.create("Set Content");
	oFF.SxUiLab.CMD_ADD_CHILD = oFF.XStringValue.create("Add Child");
	oFF.SxUiLab.CMD_REMOVE_FROM_PARENT = oFF.XStringValue.create("Remove");
	oFF.SxUiLab.CMD_USE_MAX_SPACE = oFF.XStringValue.create("Use Maximum Space");
};
oFF.SxUiLab.prototype.newProgram = function()
{
	var prg = new oFF.SxUiLab();
	prg.setup();
	return prg;
};
oFF.SxUiLab.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	this.setTitle("UI Lab");
	var uiSplitter = genesis.newControl(oFF.UiType.VERTICAL_SPLITTER);
	uiSplitter.useMaxSpace();
	var tree = uiSplitter.setNew(oFF.UiType.TREE, oFF.UiItemPosition.LEFT);
	tree.registerOnContextMenu(this).registerOnSelect(this);
	this.addNamedNode(tree, uiSplitter, null, false);
	genesis.setRoot(uiSplitter);
};
oFF.SxUiLab.prototype.onContextMenu = function(event)
{
	var selectedItem = event.getControl();
	if (oFF.notNull(selectedItem))
	{
		var sxNode = selectedItem.getCustomObject();
		var uiManager = selectedItem.getUiManager();
		var root = uiManager.getAnchor();
		var contextMenu = root.newControl(oFF.UiType.MENU);
		contextMenu.setCustomObject(sxNode);
		if (oFF.notNull(sxNode))
		{
			var uiType = sxNode.m_modelComponent.getUiType();
			if (uiType.hasNamedChildren())
			{
				this.addAllTypes(contextMenu, oFF.SxUiLab.CMD_SET_CONTENT);
				this.addAllTypes(contextMenu, oFF.SxUiLab.CMD_SET_LEFT_CONTENT);
				this.addAllTypes(contextMenu, oFF.SxUiLab.CMD_SET_RIGHT_CONTENT);
				this.addAllTypes(contextMenu, oFF.SxUiLab.CMD_SET_TOP_CONTENT);
				this.addAllTypes(contextMenu, oFF.SxUiLab.CMD_SET_BOTTOM_CONTENT);
			}
			if (uiType.hasIndexedChildren())
			{
				this.addItemTypes(contextMenu, oFF.SxUiLab.CMD_ADD_CHILD, uiType.getDefaultItemType());
			}
			var parent = sxNode.m_modelComponent.getParent();
			if (oFF.notNull(parent))
			{
				var index = parent.getIndex(sxNode.m_modelComponent);
				if (index !== -1)
				{
					this.addContextMenuActionFull(contextMenu, oFF.SxUiLab.CMD_REMOVE_FROM_PARENT, null, null);
				}
			}
			this.addSizeCmds(contextMenu);
		}
		var posX = event.getParameters().getIntegerByKeyExt(oFF.UiControlEvent.PARAM_CLICK_X, 0);
		var posY = event.getParameters().getIntegerByKeyExt(oFF.UiControlEvent.PARAM_CLICK_Y, 0);
		contextMenu.openAtPosition(posX, posY);
	}
};
oFF.SxUiLab.prototype.addSizeCmds = function(uiParent)
{
	var uiSubMenu = uiParent.addNewItem();
	uiSubMenu.setText("Size");
	this.addContextMenuActionFull(uiSubMenu, oFF.SxUiLab.CMD_USE_MAX_SPACE, null, null);
};
oFF.SxUiLab.prototype.addAllTypes = function(uiParent, cmd)
{
	var uiSubMenu = uiParent.addNewItem();
	uiSubMenu.setText(cmd.getString());
	this.addContextMenuActionFull(uiSubMenu, cmd, null, "[Clear]");
	var allUiTypes = oFF.UiType.getAllUiTypes();
	while (allUiTypes.hasNext())
	{
		var currentUiType = allUiTypes.next();
		if (currentUiType.isItem() === false)
		{
			this.addContextMenuAction(uiSubMenu, cmd, currentUiType);
		}
	}
};
oFF.SxUiLab.prototype.addItemTypes = function(uiParent, cmd, itemType)
{
	var uiSubMenu = uiParent.addNewItem();
	uiSubMenu.setText(cmd.getString());
	this.addContextMenuAction(uiSubMenu, cmd, itemType);
};
oFF.SxUiLab.prototype.addContextMenuAction = function(contextMenu, cmd, type)
{
	return this.addContextMenuActionFull(contextMenu, cmd, type, null);
};
oFF.SxUiLab.prototype.addContextMenuActionFull = function(contextMenu, cmd, type, text)
{
	var uiObj = contextMenu.addNewItem();
	if (oFF.notNull(text))
	{
		uiObj.setText(text);
	}
	else if (oFF.notNull(type))
	{
		uiObj.setText(type.getName());
	}
	else if (oFF.notNull(cmd))
	{
		uiObj.setText(cmd.getString());
	}
	uiObj.setCustomObject(oFF.SxAction.create(cmd, type));
	return uiObj;
};
oFF.SxUiLab.prototype.onSelect = function(event)
{
	var control = event.getControl();
	var selectedItem = event.getSelectedItem();
	var uiType = selectedItem.getUiType();
	if (uiType === oFF.UiType.MENU_ITEM)
	{
		var sxNode = control.getCustomObject();
		sxNode.m_modelComponent.getName();
		var action = selectedItem.getCustomObject();
		var cmd = action.m_command;
		var setPosition = null;
		var newModelComponent = null;
		if (cmd === oFF.SxUiLab.CMD_SET_RIGHT_CONTENT)
		{
			setPosition = oFF.UiItemPosition.RIGHT;
			this.doTreeDelta(setPosition, action, sxNode);
		}
		else if (cmd === oFF.SxUiLab.CMD_SET_LEFT_CONTENT)
		{
			setPosition = oFF.UiItemPosition.LEFT;
			this.doTreeDelta(setPosition, action, sxNode);
		}
		else if (cmd === oFF.SxUiLab.CMD_SET_TOP_CONTENT)
		{
			setPosition = oFF.UiItemPosition.TOP;
			this.doTreeDelta(setPosition, action, sxNode);
		}
		else if (cmd === oFF.SxUiLab.CMD_SET_BOTTOM_CONTENT)
		{
			setPosition = oFF.UiItemPosition.BOTTOM;
			this.doTreeDelta(setPosition, action, sxNode);
		}
		else if (cmd === oFF.SxUiLab.CMD_SET_CONTENT)
		{
			setPosition = oFF.UiItemPosition.CONTENT;
			this.doTreeDelta(setPosition, action, sxNode);
		}
		else if (cmd === oFF.SxUiLab.CMD_ADD_CHILD)
		{
			newModelComponent = sxNode.m_modelComponent.addNew(action.m_type);
			this.setTextForItem(action, newModelComponent);
			this.addIndexedNode(sxNode.m_treeNode, newModelComponent);
		}
		else if (cmd === oFF.SxUiLab.CMD_REMOVE_FROM_PARENT)
		{
			var modelParent = sxNode.m_modelComponent.getParent();
			var index = modelParent.getIndex(sxNode.m_modelComponent);
			if (index !== -1)
			{
				modelParent.removeAt(index);
				var treeParent = sxNode.m_treeNode.getParent();
				index = treeParent.getIndex(sxNode.m_treeNode);
				treeParent.removeAt(index);
			}
		}
		else if (cmd === oFF.SxUiLab.CMD_USE_MAX_SPACE)
		{
			sxNode.m_modelComponent.useMaxSpace();
		}
	}
};
oFF.SxUiLab.prototype.doTreeDelta = function(setPosition, action, sxNode)
{
	var newModelComponent = null;
	if (oFF.notNull(setPosition))
	{
		if (oFF.isNull(action.m_type))
		{
			sxNode.m_modelComponent.setContent(null);
		}
		else
		{
			newModelComponent = sxNode.m_modelComponent.setNew(action.m_type, setPosition);
		}
		this.addNamedNode(sxNode.m_treeNode, newModelComponent, setPosition, true);
	}
	this.setTextForItem(action, newModelComponent);
};
oFF.SxUiLab.prototype.addNamedNode = function(treeNodeParent, modelComponent, position, checkExistance)
{
	if (checkExistance)
	{
		var size = treeNodeParent.size();
		for (var i = 0; i < size; i++)
		{
			var child = treeNodeParent.get(i);
			var sxNode = child.getCustomObject();
			if (sxNode.m_position === position)
			{
				treeNodeParent.removeAt(i);
				break;
			}
		}
	}
	if (oFF.notNull(modelComponent))
	{
		var item = treeNodeParent.addNewItem();
		var sxNode2 = oFF.SxNode.create(position, modelComponent, item);
		var buffer = oFF.XStringBuffer.create();
		if (oFF.notNull(position))
		{
			buffer.append(position.getName());
			buffer.append(": ");
		}
		buffer.append(modelComponent.getUiType().toString());
		item.setText(buffer.toString());
		item.setCustomObject(sxNode2);
		item.setExpanded(false);
	}
};
oFF.SxUiLab.prototype.addIndexedNode = function(treeNodeParent, modelComponent)
{
	if (oFF.notNull(modelComponent))
	{
		var childItemCount = treeNodeParent.size();
		var item = treeNodeParent.addNewItem();
		var sxNode2 = oFF.SxNode.create(null, modelComponent, item);
		var buffer = oFF.XStringBuffer.create();
		buffer.appendInt(childItemCount);
		buffer.append(": ");
		buffer.append(modelComponent.getUiType().toString());
		item.setText(buffer.toString());
		item.setCustomObject(sxNode2);
		item.setExpanded(false);
	}
};
oFF.SxUiLab.prototype.setTextForItem = function(action, newModelComponent)
{
	if (oFF.notNull(newModelComponent))
	{
		if (action.m_type === oFF.UiType.BUTTON || action.m_type === oFF.UiType.TEXT_AREA || action.m_type === oFF.UiType.ICON_TAB_BAR_ITEM || action.m_type === oFF.UiType.TREE_ITEM || action.m_type === oFF.UiType.DROPDOWN_ITEM)
		{
			newModelComponent.setText(action.m_type.getName());
		}
	}
};

oFF.SxUiViewTemplate = function() {};
oFF.SxUiViewTemplate.prototype = new oFF.DfUiProgram();
oFF.SxUiViewTemplate.prototype._ff_c = "SxUiViewTemplate";

oFF.SxUiViewTemplate.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	var root = genesis.newControl(oFF.UiType.BUTTON).setText("Hello World!");
	genesis.setRoot(root);
};
oFF.SxUiViewTemplate.prototype.newProgram = function()
{
	var prg = new oFF.SxUiViewTemplate();
	prg.setup();
	return prg;
};

oFF.SxVariablePrompt = function() {};
oFF.SxVariablePrompt.prototype = new oFF.DfUiProgram();
oFF.SxVariablePrompt.prototype._ff_c = "SxVariablePrompt";

oFF.SxVariablePrompt.prototype.m_datasourceDd = null;
oFF.SxVariablePrompt.prototype.m_openBtn = null;
oFF.SxVariablePrompt.prototype.m_activity = null;
oFF.SxVariablePrompt.prototype.m_textArea = null;
oFF.SxVariablePrompt.prototype.m_context = null;
oFF.SxVariablePrompt.prototype.m_controller = null;
oFF.SxVariablePrompt.prototype.newProgram = function()
{
	var dialog = new oFF.SxVariablePrompt();
	dialog.setup();
	return dialog;
};
oFF.SxVariablePrompt.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	var dFactory = oFF.OlapUiDisplayFactory.createFactoryForDialog(this.getUiManager());
	this.m_context = oFF.OlapUiContext.createContext(this.getUiManager(), dFactory);
	var layout = genesis.newControl(oFF.UiType.VERTICAL_LAYOUT);
	var flex = genesis.newControl(oFF.UiType.FLEX_LAYOUT);
	flex.setAlignItems(oFF.UiFlexAlignItems.CENTER);
	this.m_datasourceDd = genesis.newControl(oFF.UiType.DROPDOWN);
	this.m_datasourceDd.setName("promptDatasourceDd");
	this.m_datasourceDd.setWidth(oFF.UiCssLength.createExt(280, oFF.UiCssSizeUnit.PIXEL));
	var one = this.m_datasourceDd.addNewItem();
	one.setName("KIW query:[0BOC_TEST_VARIABLE_TYPES_1]").setText("BW: 0BOC_TEST_VARIABLE_TYPES_1");
	var two = this.m_datasourceDd.addNewItem();
	two.setName("KIW query:[0BOC_TEST_VARIABLE_TYPES_2]").setText("BW: 0BOC_TEST_VARIABLE_TYPES_2");
	var three = this.m_datasourceDd.addNewItem();
	three.setName("gipsy view:[_SYS_BIC][bics.variables][BICS_ATTRIBUTE_VARIABLES]").setText("HANA: BICS_ATTRIBUTE_VARIABLES");
	var four = this.m_datasourceDd.addNewItem();
	four.setName("gipsy view:[_SYS_BIC][bics.variables.sps10][BICS_PEOPLE_WP_DEP_HIER_VAR]").setText("HANA: BICS_PEOPLE_WP_DEP_HIER_VAR");
	this.m_datasourceDd.setSelectedName(one.getName());
	flex.addItem(this.m_datasourceDd);
	this.m_openBtn = genesis.newControl(oFF.UiType.BUTTON);
	this.m_openBtn.setName("promptOpenBtn").setText("Open");
	this.m_openBtn.registerOnPress(this);
	flex.addItem(this.m_openBtn);
	flex.addItem(genesis.newControl(oFF.UiType.SPACER));
	this.m_activity = genesis.newControl(oFF.UiType.ACTIVITY_INDICATOR);
	this.m_activity.setName("promptActivityIndicator");
	this.m_activity.useMaxSpace();
	this.m_activity.setVisible(false);
	flex.addItem(this.m_activity);
	layout.addItem(flex);
	this.m_textArea = genesis.newControl(oFF.UiType.TEXT_AREA);
	this.m_textArea.useMaxWidth();
	this.m_textArea.setHeight(oFF.UiCssLength.createExt(300, oFF.UiCssSizeUnit.PIXEL));
	this.m_textArea.setText("Submit variables ...");
	layout.addItem(this.m_textArea);
	genesis.setRoot(layout);
};
oFF.SxVariablePrompt.prototype.onPress = function(event)
{
	var control = event.getControl();
	if (control === this.m_openBtn)
	{
		this.m_datasourceDd.setEnabled(false);
		this.m_openBtn.setEnabled(false);
		this.m_activity.setVisible(true);
		var name = this.m_datasourceDd.getSelectedItem().getName();
		var split = oFF.XStringTokenizer.splitString(name, " ");
		var systemName = split.get(0);
		var dataSourceName = split.get(1);
		var config = oFF.QueryServiceConfig.create(this.getApplication());
		config.setSystemName(systemName);
		config.setDataSourceByName(dataSourceName);
		config.processQueryManagerCreation(oFF.SyncType.NON_BLOCKING, this, null);
	}
};
oFF.SxVariablePrompt.prototype.onQueryManagerCreated = function(extResult, queryManager, customIdentifier)
{
	this.m_datasourceDd.setEnabled(true);
	this.m_openBtn.setEnabled(true);
	this.m_activity.setVisible(false);
	if (extResult.hasErrors())
	{
		this.m_textArea.setText(extResult.getSummary());
	}
	else
	{
		this.m_controller = oFF.XObjectExt.release(this.m_controller);
		var config = oFF.VdConfiguration.createConfig("Variables", queryManager);
		this.m_controller = oFF.VdVariableDialog.createAsDisplay(this.m_context, config, this);
		this.m_controller.registerSubmitListener(this);
		this.m_controller.open();
	}
};
oFF.SxVariablePrompt.prototype.onBeforeSubmit = function(values, valuesJson)
{
	this.m_textArea.setText(this.generateOutputText());
};
oFF.SxVariablePrompt.prototype.onAfterSubmit = function(success, extResult, values, valuesJson) {};
oFF.SxVariablePrompt.prototype.generateOutputText = function()
{
	var list = oFF.PrFactory.createList();
	var allValues = this.m_controller.getCurrentValues();
	var keys = allValues.getKeysAsIteratorOfString();
	while (keys.hasNext())
	{
		var varName = keys.next();
		var variable = list.addNewStructure();
		variable.putString("VariableName", varName);
		var valueModels = allValues.getByKey(varName);
		var values = variable.putNewList("Values");
		for (var i = 0; i < valueModels.size(); i++)
		{
			var valueModel = valueModels.get(i);
			var value = values.addNewStructure();
			value.putString("Operator", valueModel.getOperator().getName());
			var firstOperand = valueModel.getFirstOperand();
			value.putString("Low.Key", firstOperand.getKey());
			value.putString("Low.DKey", firstOperand.hasDisplayKey() ? firstOperand.getDisplayKey() : null);
			value.putString("Low.Text", firstOperand.getText());
			var secondOperand = valueModel.getSecondOperand();
			value.putString("High.Key", secondOperand.getKey());
			value.putString("High.DKey", secondOperand.hasDisplayKey() ? secondOperand.getDisplayKey() : null);
			value.putString("High.Text", secondOperand.getText());
		}
	}
	return oFF.PrUtils.serialize(list, true, true, 4);
};
oFF.SxVariablePrompt.prototype.onOk = function() {};
oFF.SxVariablePrompt.prototype.onCancel = function() {};

oFF.SxVizViewer = function() {};
oFF.SxVizViewer.prototype = new oFF.DfUiProgram();
oFF.SxVizViewer.prototype._ff_c = "SxVizViewer";

oFF.SxVizViewer.prototype.newProgram = function()
{
	var prg = new oFF.SxVizViewer();
	prg.setup();
	return prg;
};
oFF.SxVizViewer.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	var control = null;
	this.setTitle("Viz Viewer");
	var file = oFF.XFile.createByNativePath(this.getSession(), "C:\\SAPDevelop\\firefly\\dev\\sdk\\production\\webdispatcher\\vizdata\\TestOlapChart001Bar\\VD_~~CHECKSUM_0.viz ");
	var fileContent = file.load();
	var jsonContent = fileContent.getJsonContent();
	if (oFF.notNull(jsonContent))
	{
		var bindingValue = jsonContent.getStringByKey("Binding");
		var binding = oFF.SemanticBindingType.lookup(bindingValue);
		var data = jsonContent.getStructureByKey("Data");
		if (binding === oFF.SemanticBindingType.BAR)
		{
			control = genesis.newControl(oFF.UiType.CHART).setModelJson(data);
		}
	}
	else
	{
		control = genesis.newControl(oFF.UiType.BUTTON).setText("Empty");
	}
	genesis.setRoot(control);
};

oFF.DfClient = function() {};
oFF.DfClient.prototype = new oFF.DfUiProgram();
oFF.DfClient.prototype._ff_c = "DfClient";

oFF.DfClient.prototype.m_olapEnv = null;
oFF.DfClient.prototype.newStudioView = function()
{
	var newClient = this.newProgram();
	return newClient;
};
oFF.DfClient.prototype.releaseObject = function()
{
	this.m_olapEnv = null;
	oFF.DfUiProgram.prototype.releaseObject.call( this );
};
oFF.DfClient.prototype.getComponentType = function()
{
	return oFF.UiComponentTypeExt.UI_STUDIO_PROGRAM;
};
oFF.DfClient.prototype.getOlapEnv = function()
{
	if (oFF.isNull(this.m_olapEnv))
	{
		var application = this.getApplication();
		if (oFF.notNull(application))
		{
			this.m_olapEnv = application.getOlapEnvironment();
		}
	}
	return this.m_olapEnv;
};
oFF.DfClient.prototype.getSaveName = function()
{
	return null;
};
oFF.DfClient.prototype.saveAs = function(name)
{
	return false;
};
oFF.DfClient.prototype.isSaveable = function()
{
	return false;
};

oFF.OlapCatalogProxyGroup = function() {};
oFF.OlapCatalogProxyGroup.prototype = new oFF.OlapCatalogProxy();
oFF.OlapCatalogProxyGroup.prototype._ff_c = "OlapCatalogProxyGroup";

oFF.OlapCatalogProxyGroup.createGroup = function(parent)
{
	var newObj = new oFF.OlapCatalogProxyGroup();
	newObj.setupProxy(parent, null, null);
	newObj.m_groupChildren = oFF.XList.create();
	return newObj;
};
oFF.OlapCatalogProxyGroup.prototype.m_groupChildren = null;
oFF.OlapCatalogProxyGroup.prototype.isNode = function()
{
	return true;
};
oFF.OlapCatalogProxyGroup.prototype.getChildSetState = function()
{
	return oFF.ChildSetState.COMPLETE;
};
oFF.OlapCatalogProxyGroup.prototype.hasChildren = function()
{
	return this.m_groupChildren.hasElements();
};
oFF.OlapCatalogProxyGroup.prototype.getChildElements = function()
{
	return this.m_groupChildren;
};
oFF.OlapCatalogProxyGroup.prototype.add = function(element)
{
	this.m_groupChildren.add(element);
};
oFF.OlapCatalogProxyGroup.prototype.sort = function()
{
	var comparator = oFF.XComparatorName.create();
	this.m_groupChildren.sortByComparator(comparator);
};
oFF.OlapCatalogProxyGroup.prototype.getComponentType = function()
{
	return oFF.OlapComponentType.GROUP_BY_NODE;
};
oFF.OlapCatalogProxyGroup.prototype.getTagValue = function(tagName)
{
	return null;
};
oFF.OlapCatalogProxyGroup.prototype.getContentElement = function()
{
	return this;
};
oFF.OlapCatalogProxyGroup.prototype.getContentConstant = function()
{
	return null;
};
oFF.OlapCatalogProxyGroup.prototype.processChildFetch = oFF.noSupport;

oFF.OlapCatalogProxyPackage = function() {};
oFF.OlapCatalogProxyPackage.prototype = new oFF.OlapCatalogProxy();
oFF.OlapCatalogProxyPackage.prototype._ff_c = "OlapCatalogProxyPackage";

oFF.OlapCatalogProxyPackage.prototype.newProxy = function(parent, element, groupByTag)
{
	var newObj = new oFF.OlapCatalogProxyPackage();
	newObj.setupProxy(parent, element, groupByTag);
	return newObj;
};
oFF.OlapCatalogProxyPackage.prototype.setupProxy = function(parent, element, groupByTag)
{
	oFF.OlapCatalogProxy.prototype.setupProxy.call( this , parent, element, groupByTag);
	this.m_childSetState = oFF.ChildSetState.INITIAL;
};
oFF.OlapCatalogProxyPackage.prototype.isNode = function()
{
	return true;
};
oFF.OlapCatalogProxyPackage.prototype.getPackage = function()
{
	return this.getOriginElement().getName();
};
oFF.OlapCatalogProxyPackage.prototype.processSynchronization = function(syncType)
{
	var olapCatalogManager = this.getOlapCatalogManager();
	var extResult = olapCatalogManager.getAllObjects(this.getMetaObjectType(), this.getSchema(), this.getPackage());
	this.addAllMessages(extResult);
	if (this.isValid())
	{
		this.fillChildren(extResult.getData());
	}
	return false;
};

oFF.OlapCatalogProxyQueryObj = function() {};
oFF.OlapCatalogProxyQueryObj.prototype = new oFF.OlapCatalogProxy();
oFF.OlapCatalogProxyQueryObj.prototype._ff_c = "OlapCatalogProxyQueryObj";

oFF.OlapCatalogProxyQueryObj.prototype.m_identifier = null;
oFF.OlapCatalogProxyQueryObj.prototype.newProxy = function(parent, element, groupByTag)
{
	var newObj = new oFF.OlapCatalogProxyQueryObj();
	newObj.setupProxy(parent, element, groupByTag);
	return newObj;
};
oFF.OlapCatalogProxyQueryObj.prototype.setupProxy = function(parent, element, groupByTag)
{
	oFF.OlapCatalogProxy.prototype.setupProxy.call( this , parent, element, groupByTag);
	this.m_childSetState = oFF.ChildSetState.INITIAL;
	this.m_identifier = oFF.QFactory.createDataSource();
	this.m_identifier.setType(this.getMetaObjectType());
	this.m_identifier.setSchemaName(this.getSchema());
	this.m_identifier.setPackageName(this.getPackage());
	this.m_identifier.setName(this.getObjectName());
};
oFF.OlapCatalogProxyQueryObj.prototype.isNode = function()
{
	return true;
};
oFF.OlapCatalogProxyQueryObj.prototype.getObjectName = function()
{
	return this.getOriginElement().getName();
};
oFF.OlapCatalogProxyQueryObj.prototype.getDataSource = function()
{
	return this.m_identifier;
};
oFF.OlapCatalogProxyQueryObj.prototype.processSynchronization = function(syncType)
{
	var application = this.getApplication();
	var queryServiceConfig = oFF.QueryServiceConfig.create(application);
	queryServiceConfig.setSystemName(this.getSystemDescription().getSystemName());
	queryServiceConfig.setDataSource(this.m_identifier);
	queryServiceConfig.processQueryManagerCreation(oFF.SyncType.NON_BLOCKING, this, null);
	return true;
};
oFF.OlapCatalogProxyQueryObj.prototype.onQueryManagerCreated = function(extResult, queryManager, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		var list = oFF.XList.create();
		var queryModel = queryManager.getQueryModel();
		list.add(queryModel);
		this.fillChildren(list);
	}
	this.endSync();
};

oFF.OlapCatalogProxySchema = function() {};
oFF.OlapCatalogProxySchema.prototype = new oFF.OlapCatalogProxy();
oFF.OlapCatalogProxySchema.prototype._ff_c = "OlapCatalogProxySchema";

oFF.OlapCatalogProxySchema.prototype.newProxy = function(parent, element, groupByTag)
{
	var newObj = new oFF.OlapCatalogProxySchema();
	newObj.setupProxy(parent, element, groupByTag);
	return newObj;
};
oFF.OlapCatalogProxySchema.prototype.setupProxy = function(parent, element, groupByTag)
{
	oFF.OlapCatalogProxy.prototype.setupProxy.call( this , parent, element, groupByTag);
	this.m_childSetState = oFF.ChildSetState.INITIAL;
};
oFF.OlapCatalogProxySchema.prototype.isNode = function()
{
	return true;
};
oFF.OlapCatalogProxySchema.prototype.getSchema = function()
{
	return this.getOriginElement().getName();
};
oFF.OlapCatalogProxySchema.prototype.processSynchronization = function(syncType)
{
	var olapCatalogManager = this.getOlapCatalogManager();
	var extResult = olapCatalogManager.getAllPackages(this.getMetaObjectType(), this.getSchema());
	this.addAllMessages(extResult);
	if (this.isValid())
	{
		this.fillChildren(extResult.getData());
	}
	return false;
};

oFF.OlapCatalogProxySystem = function() {};
oFF.OlapCatalogProxySystem.prototype = new oFF.OlapCatalogProxy();
oFF.OlapCatalogProxySystem.prototype._ff_c = "OlapCatalogProxySystem";

oFF.OlapCatalogProxySystem.prototype.m_systemDescription = null;
oFF.OlapCatalogProxySystem.prototype.m_olapCatalogManager = null;
oFF.OlapCatalogProxySystem.prototype.newProxy = function(parent, element, groupByTag)
{
	var newObj = new oFF.OlapCatalogProxySystem();
	newObj.setupProxy(parent, element, groupByTag);
	return newObj;
};
oFF.OlapCatalogProxySystem.prototype.setupProxy = function(parent, element, groupByTag)
{
	oFF.OlapCatalogProxy.prototype.setupProxy.call( this , parent, element, groupByTag);
	this.m_childSetState = oFF.ChildSetState.INITIAL;
	this.m_systemDescription = element;
};
oFF.OlapCatalogProxySystem.prototype.isNode = function()
{
	return true;
};
oFF.OlapCatalogProxySystem.prototype.processSynchronization = function(syncType)
{
	var application = this.getApplication();
	var serviceConfig = oFF.OlapCatalogApiModule.SERVICE_TYPE_OLAP_CATALOG.createServiceConfig(application);
	serviceConfig.setSystemName(this.m_systemDescription.getSystemName());
	serviceConfig.processOlapCatalogManagerCreation(this.getActiveSyncType(), this, null);
	return true;
};
oFF.OlapCatalogProxySystem.prototype.onOlapCatalogManagerCreated = function(extResult, olapCatalogManager, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		this.m_olapCatalogManager = olapCatalogManager;
		var extResult2 = olapCatalogManager.getAllTypes();
		this.addAllMessages(extResult2);
		if (extResult2.isValid())
		{
			var elements = extResult2.getData();
			this.fillChildren(elements);
		}
		this.endSync();
	}
	else
	{
		this.endSync();
	}
};
oFF.OlapCatalogProxySystem.prototype.onOlapCatalogResult = function(extResult, result, customIdentifier)
{
	this.addAllMessages(extResult);
	if (extResult.isValid())
	{
		var objectsList = result.getObjectsList();
		var list = oFF.XReadOnlyListWrapper.create(objectsList);
		this.fillChildren(list);
	}
	this.endSync();
};
oFF.OlapCatalogProxySystem.prototype.getSystemDescription = function()
{
	return this.m_systemDescription;
};
oFF.OlapCatalogProxySystem.prototype.getOlapCatalogManager = function()
{
	return this.m_olapCatalogManager;
};

oFF.OlapCatalogProxyType = function() {};
oFF.OlapCatalogProxyType.prototype = new oFF.OlapCatalogProxy();
oFF.OlapCatalogProxyType.prototype._ff_c = "OlapCatalogProxyType";

oFF.OlapCatalogProxyType.prototype.m_metaObjectType = null;
oFF.OlapCatalogProxyType.prototype.newProxy = function(parent, element, groupByTag)
{
	var newObj = new oFF.OlapCatalogProxyType();
	newObj.setupProxy(parent, element, groupByTag);
	return newObj;
};
oFF.OlapCatalogProxyType.prototype.setupProxy = function(parent, element, groupByTag)
{
	oFF.OlapCatalogProxy.prototype.setupProxy.call( this , parent, element, groupByTag);
	this.m_childSetState = oFF.ChildSetState.INITIAL;
	this.m_metaObjectType = element.getContentConstant();
};
oFF.OlapCatalogProxyType.prototype.isNode = function()
{
	return true;
};
oFF.OlapCatalogProxyType.prototype.processSynchronization = function(syncType)
{
	var olapCatalogManager = this.getOlapCatalogManager();
	var extResult = olapCatalogManager.getAllSchemas(this.m_metaObjectType);
	this.addAllMessages(extResult);
	if (this.isValid())
	{
		this.fillChildren(extResult.getData());
	}
	return false;
};
oFF.OlapCatalogProxyType.prototype.getMetaObjectType = function()
{
	return this.m_metaObjectType;
};

oFF.VirtualLine = function() {};
oFF.VirtualLine.prototype = new oFF.MxGridLine();
oFF.VirtualLine.prototype._ff_c = "VirtualLine";

oFF.VirtualLine.create = function(type, typeBoundId)
{
	var object = new oFF.VirtualLine();
	object.setupVirtualLine(type, typeBoundId);
	return object;
};
oFF.VirtualLine.prototype.m_lineType = null;
oFF.VirtualLine.prototype.m_typeBoundId = null;
oFF.VirtualLine.prototype.m_isSelectable = false;
oFF.VirtualLine.prototype.m_typeBoundIndex = 0;
oFF.VirtualLine.prototype.setupVirtualLine = function(type, typeBoundId)
{
	this.setupMxGridLine();
	this.m_lineType = type;
	this.m_typeBoundId = typeBoundId;
};
oFF.VirtualLine.prototype.reset = function()
{
	oFF.MxGridLine.prototype.reset.call( this );
	this.m_lineType = null;
	this.m_typeBoundId = null;
	this.m_isSelectable = false;
	this.m_typeBoundIndex = -1;
};
oFF.VirtualLine.prototype.getType = function()
{
	return this.m_lineType;
};
oFF.VirtualLine.prototype.setType = function(type)
{
	this.m_lineType = type;
};
oFF.VirtualLine.prototype.getTypeBoundId = function()
{
	return this.m_typeBoundId;
};
oFF.VirtualLine.prototype.setTypeBoundId = function(typeBoundId)
{
	this.m_typeBoundId = typeBoundId;
};
oFF.VirtualLine.prototype.isSelectable = function()
{
	return this.m_isSelectable;
};
oFF.VirtualLine.prototype.setIsSelectable = function(isSelectable)
{
	this.m_isSelectable = isSelectable;
};
oFF.VirtualLine.prototype.getTypeBoundIndex = function()
{
	return this.m_typeBoundIndex;
};
oFF.VirtualLine.prototype.setTypeBoundIndex = function(index)
{
	this.m_typeBoundIndex = index;
};
oFF.VirtualLine.prototype.isFolder = oFF.noSupport;

oFF.HrEpiphagi = function() {};
oFF.HrEpiphagi.prototype = new oFF.DfUiProgram();
oFF.HrEpiphagi.prototype._ff_c = "HrEpiphagi";

oFF.HrEpiphagi.DEFAULT_PROGRAM_NAME = "Epiphagi";
oFF.HrEpiphagi.HTML_TEMPLATE = "<html> \n<head>\n<script>\nfunction initJs()\n{\n%SCRIPTING%\n}\n</script>\n</head>\n<body onload=\"initJs()\">\n%BODY%\n</body>\n</html>";
oFF.HrEpiphagi.PARAM_PROGRAM = "program";
oFF.HrEpiphagi.PARAM_PROGRAM_ARGUMENTS = "programArguments";
oFF.HrEpiphagi.PARAM_OUTPUT_FILE = "outputFile";
oFF.HrEpiphagi.createRunner = function()
{
	var runner = oFF.KernelBoot.createByName(oFF.HrEpiphagi.DEFAULT_PROGRAM_NAME);
	return runner;
};
oFF.HrEpiphagi.createNewAthena = function()
{
	var prg = new oFF.HrEpiphagi();
	prg.setup();
	return prg;
};
oFF.HrEpiphagi.prototype.m_programName = null;
oFF.HrEpiphagi.prototype.m_programArguments = null;
oFF.HrEpiphagi.prototype.m_outputFile = null;
oFF.HrEpiphagi.prototype.m_programInput = null;
oFF.HrEpiphagi.prototype.m_programArgumentsInput = null;
oFF.HrEpiphagi.prototype.m_outputFileInput = null;
oFF.HrEpiphagi.prototype.m_renderTemplateTextArea = null;
oFF.HrEpiphagi.prototype.m_renderOutputText = null;
oFF.HrEpiphagi.prototype.m_saveBt = null;
oFF.HrEpiphagi.prototype.newProgram = function()
{
	var prg = new oFF.HrEpiphagi();
	prg.setup();
	return prg;
};
oFF.HrEpiphagi.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfUiProgram.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addOption(oFF.HrEpiphagi.PARAM_PROGRAM, "Specify the program to be rendered", "The program name", oFF.XValueType.STRING);
	metadata.addOption(oFF.HrEpiphagi.PARAM_PROGRAM_ARGUMENTS, "Arguments used when running the program", "Arguments string", oFF.XValueType.STRING);
	metadata.addOption(oFF.HrEpiphagi.PARAM_OUTPUT_FILE, "Specify the output file", "Path to the file", oFF.XValueType.STRING);
};
oFF.HrEpiphagi.prototype.evalArguments = function()
{
	oFF.DfUiProgram.prototype.evalArguments.call( this );
	var argStruct = this.getArgumentStructure();
	this.m_programName = argStruct.getStringByKey(oFF.HrEpiphagi.PARAM_PROGRAM);
	this.m_programArguments = argStruct.getStringByKey(oFF.HrEpiphagi.PARAM_PROGRAM_ARGUMENTS);
	var outputFilePathStr = argStruct.getStringByKey(oFF.HrEpiphagi.PARAM_OUTPUT_FILE);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(outputFilePathStr))
	{
		this.m_outputFile = oFF.XFile.createExt(this.getSession(), outputFilePathStr, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
	}
};
oFF.HrEpiphagi.prototype.initializeProgram = function()
{
	this.setupInternal();
	oFF.DfUiProgram.prototype.initializeProgram.call( this );
};
oFF.HrEpiphagi.prototype.releaseObject = function()
{
	oFF.DfUiProgram.prototype.releaseObject.call( this );
};
oFF.HrEpiphagi.prototype.getLogSeverity = function()
{
	return oFF.DfUiProgram.prototype.getLogSeverity.call( this );
};
oFF.HrEpiphagi.prototype.getDefaultContainerSize = function()
{
	return oFF.UiSize.createByCss("60%", "60%");
};
oFF.HrEpiphagi.prototype.isShowMenuBar = function()
{
	return false;
};
oFF.HrEpiphagi.prototype.getMenuBarDisplayName = function()
{
	return oFF.HrEpiphagi.DEFAULT_PROGRAM_NAME;
};
oFF.HrEpiphagi.prototype.setupInternal = function() {};
oFF.HrEpiphagi.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	this.setTitle("Headless program renderer");
	var mainWrapperLayout = genesis.newRoot(oFF.UiType.FLEX_LAYOUT);
	mainWrapperLayout.setPadding(oFF.UiCssBoxEdges.create("10px"));
	mainWrapperLayout.setDirection(oFF.UiFlexDirection.COLUMN);
	var programRenderWrapperLayout = mainWrapperLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	programRenderWrapperLayout.setDirection(oFF.UiFlexDirection.ROW);
	programRenderWrapperLayout.setHeight(oFF.UiCssLength.create("50px"));
	this.m_programInput = programRenderWrapperLayout.addNewItemOfType(oFF.UiType.INPUT);
	this.m_programInput.setName("programNameInput");
	this.m_programInput.setPlaceholder("Program name");
	programRenderWrapperLayout.addNewItemOfType(oFF.UiType.SPACER).setWidth(oFF.UiCssLength.create("10px"));
	this.m_programArgumentsInput = programRenderWrapperLayout.addNewItemOfType(oFF.UiType.INPUT);
	this.m_programArgumentsInput.setName("programArgumentsInput");
	this.m_programArgumentsInput.setPlaceholder("Arguments");
	programRenderWrapperLayout.addNewItemOfType(oFF.UiType.SPACER).setWidth(oFF.UiCssLength.create("10px"));
	var renderBtn = programRenderWrapperLayout.addNewItemOfType(oFF.UiType.BUTTON);
	renderBtn.setName("renderBtn");
	renderBtn.setText("Render");
	renderBtn.setIcon("media-play");
	renderBtn.registerOnPress(this);
	var saveOutputWrapperLayout = mainWrapperLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	saveOutputWrapperLayout.setDirection(oFF.UiFlexDirection.ROW);
	saveOutputWrapperLayout.setHeight(oFF.UiCssLength.create("50px"));
	this.m_outputFileInput = saveOutputWrapperLayout.addNewItemOfType(oFF.UiType.INPUT);
	this.m_outputFileInput.setName("outputFileInput");
	this.m_outputFileInput.setPlaceholder("Output file");
	this.m_outputFileInput.setText("${ff_sdk}/production/tmp/headlessProgramOutput.html");
	this.m_outputFileInput.setWidth(oFF.UiCssLength.create("50%"));
	saveOutputWrapperLayout.addNewItemOfType(oFF.UiType.SPACER).setWidth(oFF.UiCssLength.create("10px"));
	this.m_saveBt = saveOutputWrapperLayout.addNewItemOfType(oFF.UiType.BUTTON);
	this.m_saveBt.setName("saveBtn");
	this.m_saveBt.setText("Save");
	this.m_saveBt.setIcon("save");
	this.m_saveBt.setEnabled(false);
	this.m_saveBt.registerOnPress(this);
	var textWrapperLayout = mainWrapperLayout.addNewItemOfType(oFF.UiType.FLEX_LAYOUT);
	textWrapperLayout.setDirection(oFF.UiFlexDirection.ROW);
	textWrapperLayout.setHeight(oFF.UiCssLength.create("100%"));
	this.m_renderTemplateTextArea = textWrapperLayout.addNewItemOfType(oFF.UiType.TEXT_AREA);
	this.m_renderTemplateTextArea.setName("renderTemplateTextArea");
	this.m_renderTemplateTextArea.setPlaceholder("HTML Template");
	this.m_renderTemplateTextArea.setHeight(oFF.UiCssLength.create("100%"));
	this.m_renderTemplateTextArea.setWidth(oFF.UiCssLength.create("50%"));
	this.m_renderTemplateTextArea.setText(oFF.HrEpiphagi.HTML_TEMPLATE);
	this.m_renderOutputText = textWrapperLayout.addNewItemOfType(oFF.UiType.TEXT).setHeaderHeight(oFF.UiCssLength.create("300px"));
	this.m_renderOutputText.setName("renderOutputText");
	this.m_renderOutputText.setText("HTML Output");
	this.m_renderOutputText.setHeight(oFF.UiCssLength.create("100%"));
	this.m_renderOutputText.setWidth(oFF.UiCssLength.create("50%"));
};
oFF.HrEpiphagi.prototype.renderHeadless = function(prgName, prgArgs, template)
{
	var htmlOutput = null;
	var uiServerManager = oFF.UiServerManager.create(this.getSession(), oFF.XPlatform.GENERIC);
	var genesis = oFF.UiGenesis.create(uiServerManager.getAnchor(), oFF.UiItemPosition.CONTENT, oFF.UiOperation.SET, 0, 0);
	var prgFactory = oFF.ProgramRegistration.getProgramFactory(prgName);
	if (oFF.notNull(prgFactory))
	{
		var uiProgram = prgFactory.newProgram();
		uiProgram.setApplication(this.getApplication());
		var session = this.getProcess();
		var newSubSession = session.newChildProcess(oFF.ProcessType.PROGRAM);
		var startCfg = oFF.ProgramStartCfg.create(null, null, null, oFF.ProgramArgs.createWithString(prgArgs));
		newSubSession.setStartConfiguration(startCfg);
		uiProgram.setProcess(newSubSession);
		uiProgram.buildUi(genesis);
		htmlOutput = uiServerManager.exportHtml(template);
	}
	return htmlOutput;
};
oFF.HrEpiphagi.prototype.saveOutputToFile = function(outputHtml, outputFilePath)
{
	var file = oFF.XFile.createExt(this.getSession(), outputFilePath, oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
	var data = oFF.XByteArray.convertFromString(outputHtml);
	file.saveByteArray(data);
};
oFF.HrEpiphagi.prototype.renderButtonPress = function()
{
	var renderResult = this.renderHeadless(this.m_programInput.getText(), this.m_programArgumentsInput.getText(), this.m_renderTemplateTextArea.getText());
	if (oFF.XStringUtils.isNotNullAndNotEmpty(renderResult))
	{
		this.m_renderOutputText.setText(renderResult);
		this.m_saveBt.setEnabled(true);
		this.getGenesis().showSuccessToast("Program successfully rendered!");
	}
	else
	{
		this.getGenesis().showErrorToast("Could not find a program with the specified name!");
	}
};
oFF.HrEpiphagi.prototype.saveButtonPress = function()
{
	this.saveOutputToFile(this.m_renderOutputText.getText(), this.m_outputFileInput.getText());
	this.getGenesis().showSuccessToast("Successfully saved the output!");
};
oFF.HrEpiphagi.prototype.onPress = function(event)
{
	oFF.DfUiProgram.prototype.onPress.call( this , event);
	var control = event.getControl();
	if (oFF.XString.isEqual(control.getName(), "renderBtn"))
	{
		this.renderButtonPress();
	}
	else if (oFF.XString.isEqual(control.getName(), "saveBtn"))
	{
		this.saveButtonPress();
	}
};

oFF.SqlUi = function() {};
oFF.SqlUi.prototype = new oFF.DfUiProgram();
oFF.SqlUi.prototype._ff_c = "SqlUi";

oFF.SqlUi.prototype.drv = null;
oFF.SqlUi.prototype.m_combo = null;
oFF.SqlUi.prototype.m_connectbtn = null;
oFF.SqlUi.prototype.output = null;
oFF.SqlUi.prototype.area = null;
oFF.SqlUi.prototype.m_querybtn = null;
oFF.SqlUi.prototype.m_updatebtn = null;
oFF.SqlUi.prototype.m_hierrarchyTree = null;
oFF.SqlUi.prototype.newProgram = function()
{
	oFF.SqlModule.getInstance();
	var newObj = new oFF.SqlUi();
	newObj.setup();
	return newObj;
};
oFF.SqlUi.prototype.createGrid = function(set)
{
	var meta = set.getMetaData();
	var model = oFF.PrFactory.createStructure();
	var rows = 1;
	model.putInteger("ColCount", meta.size());
	var cells = model.putNewList("Cells");
	for (var col2 = 0; col2 < meta.size(); col2++)
	{
		var cellTarget2 = cells.addNewStructure();
		cellTarget2.putString("Type", "Text");
		cellTarget2.putString("Value", meta.get(col2));
		cellTarget2.putString("Color", "#AABB00");
	}
	while (set.next())
	{
		for (var col = 0; col < meta.size(); col++)
		{
			var cellTarget = cells.addNewStructure();
			cellTarget.putString("Type", "Text");
			cellTarget.putString("Value", set.getStringAt(col));
			cellTarget.putString("Color", "#AABBCC");
		}
		rows++;
	}
	model.putInteger("RowCount", rows);
	return model;
};
oFF.SqlUi.prototype.buildUi = function(genesis)
{
	oFF.DfUiProgram.prototype.buildUi.call( this , genesis);
	var root = genesis.newRoot(oFF.UiType.VERTICAL_LAYOUT);
	this.m_combo = root.addNewItemOfType(oFF.UiType.COMBO_BOX);
	this.m_combo.setName("systemName");
	this.m_combo.setPlaceholder("SystemName");
	this.m_combo.setWidth(oFF.UiCssLength.create("100%"));
	this.m_combo.registerOnEnter(this);
	var landscape = this.getApplication().getSystemLandscape();
	var systems = landscape.getSystemNames();
	for (var i = 0; i < systems.size(); i++)
	{
		var desc = landscape.getSystemDescription(systems.get(i));
		if (desc.getSystemType() === oFF.SystemType.INA_SQL)
		{
			this.m_combo.addNewItem().setText(systems.get(i));
		}
	}
	this.m_connectbtn = root.addNewItemOfType(oFF.UiType.BUTTON).registerOnPress(this).setText("Connect").setSize(oFF.UiSize.createByCss("100%", "auto"));
	this.m_hierrarchyTree = root.addNewItemOfType(oFF.UiType.TREE);
	this.m_hierrarchyTree.setSelectionMode(oFF.UiSelectionMode.SINGLE_SELECT_MASTER);
	this.m_hierrarchyTree.clear();
	this.output = root.addNewItemOfType(oFF.UiType.VERTICAL_LAYOUT);
	this.area = root.addNewItemOfType(oFF.UiType.TEXT_AREA);
	this.area.setSize(oFF.UiSize.createByCss("100%", "50px"));
	this.m_querybtn = root.addNewItemOfType(oFF.UiType.BUTTON).registerOnPress(this).setText("Exec Query").setSize(oFF.UiSize.createByCss("100%", "auto"));
	this.m_updatebtn = root.addNewItemOfType(oFF.UiType.BUTTON).registerOnPress(this).setText("Exec Update").setSize(oFF.UiSize.createByCss("100%", "auto"));
};
oFF.SqlUi.prototype.setBusy2 = function(busy)
{
	this.m_combo.setEnabled(!busy);
	this.m_connectbtn.setEnabled(!busy);
	this.area.setEnabled(!busy);
	this.m_querybtn.setEnabled(!busy);
	this.m_updatebtn.setEnabled(!busy);
};
oFF.SqlUi.prototype.onPress = function(event)
{
	if (event.getControl().isEqualTo(this.m_connectbtn))
	{
		this.onEnter(event);
	}
	else
	{
		this.setBusy2(true);
		if (event.getControl().isEqualTo(this.m_querybtn))
		{
			this.drv.processExecuteQuery(oFF.SyncType.NON_BLOCKING, this, null, this.area.getText());
		}
		else
		{
			this.drv.processExecuteUpdate(oFF.SyncType.NON_BLOCKING, this, null, this.area.getText());
		}
	}
};
oFF.SqlUi.prototype.onUpdated = function(extResult, data, customIdentifier)
{
	this.output.addNewItemOfType(oFF.UiType.LABEL).setText(this.area.getText());
	if (oFF.isNull(data) || data.getInteger() !== 0)
	{
		var errors = this.drv.getErrors();
		for (var i = 0, size = errors.size(); i < size; i++)
		{
			this.output.addNewItemOfType(oFF.UiType.LABEL).setText(errors.get(i).getStringRepresentation());
		}
	}
	else
	{
		this.output.addNewItemOfType(oFF.UiType.LABEL).setText("Database Updated");
	}
	this.setBusy2(false);
};
oFF.SqlUi.prototype.onQueryResult = function(extResult, data, customIdentifier)
{
	var res = data;
	this.output.addNewItemOfType(oFF.UiType.LABEL).setText(this.area.getText());
	if (oFF.notNull(data))
	{
		var grid = this.output.addNewItemOfType(oFF.UiType.VIZ_GRID);
		grid.setModelJson(this.createGrid(res));
	}
	else
	{
		var errors = this.drv.getErrors();
		for (var i = 0, size = errors.size(); i < size; i++)
		{
			this.output.addNewItemOfType(oFF.UiType.LABEL).setText(errors.get(i).getStringRepresentation());
		}
	}
	this.setBusy2(false);
};
oFF.SqlUi.prototype.onEnter = function(event)
{
	try
	{
		this.setBusy2(true);
		var selectedItem = this.m_combo.getSelectedItem();
		this.drv = oFF.RpcSqlDriver.create("rpc", this.getApplication(), oFF.notNull(selectedItem) ? selectedItem.getText() : null);
		this.drv.open(oFF.XUri.create());
		var result = this.drv.processGetSchemas(oFF.SyncType.BLOCKING, null, null).getData();
		this.m_hierrarchyTree.clear();
		while (result.next())
		{
			var rootItem = this.m_hierrarchyTree.addNewItem();
			rootItem.setText(result.getStringAt(0));
			var node = new oFF.SqlSchemaNode();
			node.catalog = result.getStringAt(1);
			node.schema = result.getStringAt(0);
			rootItem.registerOnDoubleClick(node);
			rootItem.setCustomObject(this.drv);
		}
	}
	catch (th)
	{
		this.output.addNewItemOfType(oFF.UiType.LABEL).setText("Failed to connect / load MetaData:");
	}
	this.setBusy2(false);
};

oFF.DfMxGridCell = function() {};
oFF.DfMxGridCell.prototype = new oFF.XObject();
oFF.DfMxGridCell.prototype._ff_c = "DfMxGridCell";

oFF.DfMxGridCell.prototype.setVerticalAlign = oFF.noSupport;
oFF.DfMxGridCell.prototype.getVerticalAlign = oFF.noSupport;
oFF.DfMxGridCell.prototype.getVerticalAlignNormalized = oFF.noSupport;
oFF.DfMxGridCell.prototype.getHorizontalAlignNormalized = oFF.noSupport;
oFF.DfMxGridCell.prototype.getHorizontalAlign = oFF.noSupport;
oFF.DfMxGridCell.prototype.setSemanticCellStyle = oFF.noSupport;
oFF.DfMxGridCell.prototype.setCustomStyle = oFF.noSupport;
oFF.DfMxGridCell.prototype.getCustomStyle = oFF.noSupport;
oFF.DfMxGridCell.prototype.getHierarchyType = oFF.noSupport;
oFF.DfMxGridCell.prototype.setHierarchyType = oFF.noSupport;
oFF.DfMxGridCell.prototype.getTupleIndex = oFF.noSupport;
oFF.DfMxGridCell.prototype.setTupleIndex = oFF.noSupport;
oFF.DfMxGridCell.prototype.getTupleElementIndex = oFF.noSupport;
oFF.DfMxGridCell.prototype.setTupleElementIndex = oFF.noSupport;
oFF.DfMxGridCell.prototype.getHierarchyLevel = oFF.noSupport;
oFF.DfMxGridCell.prototype.setHierarchyLevel = oFF.noSupport;
oFF.DfMxGridCell.prototype.getSortDirection = oFF.noSupport;
oFF.DfMxGridCell.prototype.setSortDirection = oFF.noSupport;
oFF.DfMxGridCell.prototype.getDrillState = oFF.noSupport;
oFF.DfMxGridCell.prototype.setDrillState = oFF.noSupport;
oFF.DfMxGridCell.prototype.getBackgroundColor = oFF.noSupport;
oFF.DfMxGridCell.prototype.setBackgroundColor = oFF.noSupport;
oFF.DfMxGridCell.prototype.getValueType = oFF.noSupport;
oFF.DfMxGridCell.prototype.setValueType = oFF.noSupport;
oFF.DfMxGridCell.prototype.getValueException = oFF.noSupport;
oFF.DfMxGridCell.prototype.setValueException = oFF.noSupport;
oFF.DfMxGridCell.prototype.getString = oFF.noSupport;
oFF.DfMxGridCell.prototype.setString = oFF.noSupport;
oFF.DfMxGridCell.prototype.getDouble = oFF.noSupport;
oFF.DfMxGridCell.prototype.setDouble = oFF.noSupport;
oFF.DfMxGridCell.prototype.getIntValue = oFF.noSupport;
oFF.DfMxGridCell.prototype.setIntValue = oFF.noSupport;
oFF.DfMxGridCell.prototype.getDateTime = oFF.noSupport;
oFF.DfMxGridCell.prototype.setDateTime = oFF.noSupport;
oFF.DfMxGridCell.prototype.getDecimalPlaces = oFF.noSupport;
oFF.DfMxGridCell.prototype.setDecimalPlaces = oFF.noSupport;
oFF.DfMxGridCell.prototype.getZeroPresentation = oFF.noSupport;
oFF.DfMxGridCell.prototype.setZeroPresentation = oFF.noSupport;
oFF.DfMxGridCell.prototype.getSignPresentation = oFF.noSupport;
oFF.DfMxGridCell.prototype.setSignPresentation = oFF.noSupport;
oFF.DfMxGridCell.prototype.getPrefix = oFF.noSupport;
oFF.DfMxGridCell.prototype.setPrefix = oFF.noSupport;
oFF.DfMxGridCell.prototype.getPostfix = oFF.noSupport;
oFF.DfMxGridCell.prototype.setPostfix = oFF.noSupport;
oFF.DfMxGridCell.prototype.getExceptionalDisplayValue = oFF.noSupport;
oFF.DfMxGridCell.prototype.setExceptionalDisplayValue = oFF.noSupport;
oFF.DfMxGridCell.prototype.isEnabled = oFF.noSupport;
oFF.DfMxGridCell.prototype.setEnabled = oFF.noSupport;
oFF.DfMxGridCell.prototype.isSelected = oFF.noSupport;
oFF.DfMxGridCell.prototype.setSelected = oFF.noSupport;
oFF.DfMxGridCell.prototype.isValueException = oFF.noSupport;
oFF.DfMxGridCell.prototype.setDragDropDefinition = oFF.noSupport;
oFF.DfMxGridCell.prototype.getDragDropDefinition = oFF.noSupport;
oFF.DfMxGridCell.prototype.getCellType = oFF.noSupport;
oFF.DfMxGridCell.prototype.setCellType = oFF.noSupport;
oFF.DfMxGridCell.prototype.getCellRowSpan = function()
{
	return 1;
};
oFF.DfMxGridCell.prototype.getCellColSpan = function()
{
	return 1;
};
oFF.DfMxGridCell.prototype.setCellRowSpan = oFF.noSupport;
oFF.DfMxGridCell.prototype.setCellColSpan = oFF.noSupport;
oFF.DfMxGridCell.prototype.isPartOfSpan = oFF.noSupport;
oFF.DfMxGridCell.prototype.isHeaderCell = oFF.noSupport;
oFF.DfMxGridCell.prototype.getColSpanState = function()
{
	return oFF.MxGridSpanState.NOSPAN;
};
oFF.DfMxGridCell.prototype.setColSpanState = oFF.noSupport;
oFF.DfMxGridCell.prototype.getRowSpanState = function()
{
	return oFF.MxGridSpanState.NOSPAN;
};
oFF.DfMxGridCell.prototype.setRowSpanState = oFF.noSupport;
oFF.DfMxGridCell.prototype.deepCopy = oFF.noSupport;
oFF.DfMxGridCell.prototype.isDataEntryEnabled = oFF.noSupport;
oFF.DfMxGridCell.prototype.setIsDataEntryEnabled = oFF.noSupport;

oFF.MxGridCell = function() {};
oFF.MxGridCell.prototype = new oFF.XObject();
oFF.MxGridCell.prototype._ff_c = "MxGridCell";

oFF.MxGridCell.createMxGridCell = function()
{
	var cell = new oFF.MxGridCell();
	cell.reset();
	return cell;
};
oFF.MxGridCell.prototype.m_type = null;
oFF.MxGridCell.prototype.m_isEnabled = false;
oFF.MxGridCell.prototype.m_isSelected = false;
oFF.MxGridCell.prototype.m_stringValue = null;
oFF.MxGridCell.prototype.m_doubleValue = 0.0;
oFF.MxGridCell.prototype.m_intValue = 0;
oFF.MxGridCell.prototype.m_dateTimeValue = null;
oFF.MxGridCell.prototype.m_decimalPlaces = 0;
oFF.MxGridCell.prototype.m_zeroPresentation = null;
oFF.MxGridCell.prototype.m_signPresentation = null;
oFF.MxGridCell.prototype.m_prefix = null;
oFF.MxGridCell.prototype.m_postfix = null;
oFF.MxGridCell.prototype.m_exceptionalDisplayValue = null;
oFF.MxGridCell.prototype.m_rowSpan = 0;
oFF.MxGridCell.prototype.m_colSpan = 0;
oFF.MxGridCell.prototype.m_valueType = null;
oFF.MxGridCell.prototype.m_valueException = null;
oFF.MxGridCell.prototype.m_colSpanState = null;
oFF.MxGridCell.prototype.m_rowSpanState = null;
oFF.MxGridCell.prototype.m_verticalAlignment = null;
oFF.MxGridCell.prototype.m_horizontalAlignment = null;
oFF.MxGridCell.prototype.m_semanticStyle = null;
oFF.MxGridCell.prototype.m_customStyle = null;
oFF.MxGridCell.prototype.m_content = null;
oFF.MxGridCell.prototype.m_dragDropDef = null;
oFF.MxGridCell.prototype.m_backgroundColor = null;
oFF.MxGridCell.prototype.m_hierarchyType = null;
oFF.MxGridCell.prototype.m_sortDirection = null;
oFF.MxGridCell.prototype.m_tupleElementIndex = 0;
oFF.MxGridCell.prototype.m_hierarchyLevel = 0;
oFF.MxGridCell.prototype.m_drillState = null;
oFF.MxGridCell.prototype.m_isDataEntryEnabled = false;
oFF.MxGridCell.prototype.reset = function()
{
	this.m_type = oFF.MxGridCellType.STANDARD;
	this.m_content = null;
	this.m_isEnabled = true;
	this.m_isSelected = false;
	this.m_dragDropDef = null;
	this.m_colSpan = 1;
	this.m_rowSpan = 1;
	this.m_rowSpanState = oFF.MxGridSpanState.NOSPAN;
	this.m_colSpanState = oFF.MxGridSpanState.NOSPAN;
	this.m_horizontalAlignment = oFF.UiAlignment.BEGIN;
	this.m_verticalAlignment = oFF.UiAlignment.CENTER;
	this.m_valueType = oFF.XValueType.STRING;
	this.m_decimalPlaces = -1;
	this.m_exceptionalDisplayValue = null;
	this.m_prefix = null;
	this.m_postfix = null;
	this.m_signPresentation = oFF.SignPresentation.BEFORE_NUMBER;
	this.m_zeroPresentation = null;
	this.m_semanticStyle = oFF.UiSemanticCellStyle.STANDARD;
	this.m_customStyle = null;
	if (oFF.isNull(this.m_backgroundColor))
	{
		this.m_backgroundColor = oFF.UiColor.createByRgba(0, 0, 0, 0.0);
	}
	this.m_backgroundColor.reset();
	this.m_hierarchyType = oFF.UiHierarchyType.NONE;
	this.m_hierarchyLevel = -1;
	this.m_drillState = oFF.UiDrillState.LEAF;
	this.m_sortDirection = oFF.XSortDirection.DISABLED;
	this.m_stringValue = null;
};
oFF.MxGridCell.prototype.copyFrom = function(other, flags)
{
	var sourceCell = other;
	this.m_type = sourceCell.getCellType();
	this.m_content = sourceCell.getContent();
	this.m_isEnabled = sourceCell.isEnabled();
	this.m_isSelected = sourceCell.isSelected();
	this.m_dragDropDef = sourceCell.getDragDropDefinition();
	this.m_colSpan = sourceCell.getCellColSpan();
	this.m_rowSpan = sourceCell.getCellRowSpan();
	this.m_rowSpanState = sourceCell.getRowSpanState();
	this.m_colSpanState = sourceCell.getColSpanState();
	this.m_horizontalAlignment = sourceCell.getHorizontalAlign();
	this.m_verticalAlignment = sourceCell.getVerticalAlign();
	this.m_valueType = sourceCell.getValueType();
	this.m_decimalPlaces = sourceCell.getDecimalPlaces();
	this.m_exceptionalDisplayValue = sourceCell.getExceptionalDisplayValue();
	this.m_prefix = sourceCell.getPrefix();
	this.m_postfix = sourceCell.getPostfix();
	this.m_signPresentation = sourceCell.getSignPresentation();
	this.m_zeroPresentation = sourceCell.getZeroPresentation();
	this.m_semanticStyle = sourceCell.getSemanticCellStyle();
	this.m_customStyle = sourceCell.getCustomStyle();
	this.m_backgroundColor.setColor(sourceCell.getBackgroundColor().getRed(), sourceCell.getBackgroundColor().getGreen(), sourceCell.getBackgroundColor().getBlue(), sourceCell.getBackgroundColor().getAlpha());
	this.m_hierarchyType = sourceCell.getHierarchyType();
	this.m_drillState = sourceCell.getDrillState();
	this.m_hierarchyLevel = sourceCell.getHierarchyLevel();
	this.m_sortDirection = sourceCell.getSortDirection();
};
oFF.MxGridCell.prototype.getCellRowSpan = function()
{
	return this.m_rowSpan;
};
oFF.MxGridCell.prototype.setCellRowSpan = function(rowSpan)
{
	this.m_rowSpan = rowSpan;
};
oFF.MxGridCell.prototype.getCellColSpan = function()
{
	return this.m_colSpan;
};
oFF.MxGridCell.prototype.setCellColSpan = function(colSpan)
{
	this.m_colSpan = colSpan;
};
oFF.MxGridCell.prototype.isPartOfSpan = function()
{
	var colSpanState = this.getColSpanState();
	var rowSpanState = this.getRowSpanState();
	var isPartOfColSpan = colSpanState === oFF.MxGridSpanState.MIDDLE || colSpanState === oFF.MxGridSpanState.END;
	var isPartOfRowSpan = rowSpanState === oFF.MxGridSpanState.MIDDLE || rowSpanState === oFF.MxGridSpanState.END;
	return isPartOfRowSpan || isPartOfColSpan;
};
oFF.MxGridCell.prototype.setHorizontalAlign = function(alignment)
{
	this.m_horizontalAlignment = alignment;
};
oFF.MxGridCell.prototype.getHorizontalAlign = function()
{
	return this.m_horizontalAlignment;
};
oFF.MxGridCell.prototype.getHorizontalAlignNormalized = function()
{
	var align = this.getHorizontalAlign();
	if (align === oFF.UiAlignment.FIRST_CELL)
	{
		if (this.getColSpanState() === oFF.MxGridSpanState.NOSPAN)
		{
			align = oFF.UiAlignment.CENTER;
		}
		else
		{
			align = oFF.UiAlignment.BEGIN;
		}
	}
	return align;
};
oFF.MxGridCell.prototype.setVerticalAlign = function(alignment)
{
	this.m_verticalAlignment = alignment;
};
oFF.MxGridCell.prototype.getVerticalAlign = function()
{
	return this.m_verticalAlignment;
};
oFF.MxGridCell.prototype.getVerticalAlignNormalized = function()
{
	var align = this.getVerticalAlign();
	if (align === oFF.UiAlignment.FIRST_CELL)
	{
		if (this.getRowSpanState() === oFF.MxGridSpanState.NOSPAN)
		{
			align = oFF.UiAlignment.CENTER;
		}
		else
		{
			align = oFF.UiAlignment.BEGIN;
		}
	}
	return align;
};
oFF.MxGridCell.prototype.setSemanticCellStyle = function(semanticCellStyle)
{
	this.m_semanticStyle = semanticCellStyle;
	return null;
};
oFF.MxGridCell.prototype.getSemanticCellStyle = function()
{
	return this.m_semanticStyle;
};
oFF.MxGridCell.prototype.setCustomStyle = function(customStyle)
{
	this.m_customStyle = customStyle;
};
oFF.MxGridCell.prototype.getCustomStyle = function()
{
	return this.m_customStyle;
};
oFF.MxGridCell.prototype.setDragDropDefinition = function(dragDropDef)
{
	this.m_dragDropDef = dragDropDef;
};
oFF.MxGridCell.prototype.getDragDropDefinition = function()
{
	return this.m_dragDropDef;
};
oFF.MxGridCell.prototype.getColSpanState = function()
{
	return this.m_colSpanState;
};
oFF.MxGridCell.prototype.getRowSpanState = function()
{
	return this.m_rowSpanState;
};
oFF.MxGridCell.prototype.setColSpanState = function(colSpanState)
{
	this.m_colSpanState = colSpanState;
};
oFF.MxGridCell.prototype.setRowSpanState = function(rowSpanState)
{
	this.m_rowSpanState = rowSpanState;
};
oFF.MxGridCell.prototype.getValueType = function()
{
	return this.m_valueType;
};
oFF.MxGridCell.prototype.setValueType = function(valueType)
{
	this.m_valueType = valueType;
};
oFF.MxGridCell.prototype.getValueException = function()
{
	return this.m_valueException;
};
oFF.MxGridCell.prototype.setValueException = function(valueException)
{
	this.m_valueException = valueException;
};
oFF.MxGridCell.prototype.isValueException = function()
{
	if (oFF.notNull(this.m_valueException) && this.m_valueException.isValidValue() && oFF.notNull(this.m_valueType))
	{
		return false;
	}
	return true;
};
oFF.MxGridCell.prototype.getString = function()
{
	return this.m_stringValue;
};
oFF.MxGridCell.prototype.setString = function(value)
{
	this.m_stringValue = value;
};
oFF.MxGridCell.prototype.getDouble = function()
{
	return this.m_doubleValue;
};
oFF.MxGridCell.prototype.setDouble = function(value)
{
	this.m_doubleValue = value;
	return true;
};
oFF.MxGridCell.prototype.getIntValue = function()
{
	return this.m_intValue;
};
oFF.MxGridCell.prototype.setIntValue = function(value)
{
	this.m_intValue = value;
	return true;
};
oFF.MxGridCell.prototype.getDateTime = function()
{
	return this.m_dateTimeValue;
};
oFF.MxGridCell.prototype.setDateTime = function(value)
{
	this.m_dateTimeValue = value;
	return true;
};
oFF.MxGridCell.prototype.getDecimalPlaces = function()
{
	return this.m_decimalPlaces;
};
oFF.MxGridCell.prototype.setDecimalPlaces = function(decimalPlaces)
{
	this.m_decimalPlaces = decimalPlaces;
	return true;
};
oFF.MxGridCell.prototype.getZeroPresentation = function()
{
	return this.m_zeroPresentation;
};
oFF.MxGridCell.prototype.setZeroPresentation = function(zeroPresentation)
{
	this.m_zeroPresentation = zeroPresentation;
	return true;
};
oFF.MxGridCell.prototype.getSignPresentation = function()
{
	return this.m_signPresentation;
};
oFF.MxGridCell.prototype.setSignPresentation = function(signPresentation)
{
	this.m_signPresentation = signPresentation;
	return true;
};
oFF.MxGridCell.prototype.getPrefix = function()
{
	return this.m_prefix;
};
oFF.MxGridCell.prototype.setPrefix = function(prefix)
{
	this.m_prefix = prefix;
	return true;
};
oFF.MxGridCell.prototype.getPostfix = function()
{
	return this.m_postfix;
};
oFF.MxGridCell.prototype.setPostfix = function(postfix)
{
	this.m_postfix = postfix;
	return true;
};
oFF.MxGridCell.prototype.getExceptionalDisplayValue = function()
{
	return this.m_exceptionalDisplayValue;
};
oFF.MxGridCell.prototype.setExceptionalDisplayValue = function(displayValue)
{
	this.m_exceptionalDisplayValue = displayValue;
	return true;
};
oFF.MxGridCell.prototype.getBackgroundColor = function()
{
	return this.m_backgroundColor;
};
oFF.MxGridCell.prototype.setBackgroundColor = function(backgroundColor)
{
	this.m_backgroundColor = backgroundColor;
	return null;
};
oFF.MxGridCell.prototype.clearContent = function()
{
	this.m_content = null;
};
oFF.MxGridCell.prototype.getContent = function()
{
	return this.m_content;
};
oFF.MxGridCell.prototype.setContent = function(content)
{
	this.m_content = content;
	return null;
};
oFF.MxGridCell.prototype.setNewContent = function(uiType)
{
	return null;
};
oFF.MxGridCell.prototype.getCellType = function()
{
	return this.m_type;
};
oFF.MxGridCell.prototype.setCellType = function(type)
{
	this.m_type = type;
};
oFF.MxGridCell.prototype.isEnabled = function()
{
	return this.m_isEnabled;
};
oFF.MxGridCell.prototype.setEnabled = function(enabled)
{
	this.m_isEnabled = enabled;
	return null;
};
oFF.MxGridCell.prototype.isSelected = function()
{
	return this.m_isSelected;
};
oFF.MxGridCell.prototype.setSelected = function(selected)
{
	this.m_isSelected = selected;
	return null;
};
oFF.MxGridCell.prototype.getHierarchyType = function()
{
	return this.m_hierarchyType;
};
oFF.MxGridCell.prototype.setHierarchyType = function(type)
{
	this.m_hierarchyType = type;
};
oFF.MxGridCell.prototype.getSortDirection = function()
{
	return this.m_sortDirection;
};
oFF.MxGridCell.prototype.setSortDirection = function(sortOrder)
{
	this.m_sortDirection = sortOrder;
	return null;
};
oFF.MxGridCell.prototype.getTupleElementIndex = function()
{
	return this.m_tupleElementIndex;
};
oFF.MxGridCell.prototype.setTupleElementIndex = function(tupleElementIndex)
{
	this.m_tupleElementIndex = tupleElementIndex;
};
oFF.MxGridCell.prototype.getHierarchyLevel = function()
{
	return this.m_hierarchyLevel;
};
oFF.MxGridCell.prototype.setHierarchyLevel = function(level)
{
	this.m_hierarchyLevel = level;
};
oFF.MxGridCell.prototype.getDrillState = function()
{
	return this.m_drillState;
};
oFF.MxGridCell.prototype.setDrillState = function(drillState)
{
	this.m_drillState = drillState;
	return null;
};
oFF.MxGridCell.prototype.isHeaderCell = function()
{
	if (this.m_semanticStyle === oFF.UiSemanticCellStyle.HEADER || this.m_semanticStyle === oFF.UiSemanticCellStyle.TITLE)
	{
		return true;
	}
	return false;
};
oFF.MxGridCell.prototype.deepCopy = function()
{
	var newCell = new oFF.MxGridCell();
	newCell.copyFrom(this, null);
	return newCell;
};
oFF.MxGridCell.prototype.isDataEntryEnabled = function()
{
	return this.m_isDataEntryEnabled;
};
oFF.MxGridCell.prototype.setIsDataEntryEnabled = function(isDataEntryEnabled)
{
	this.m_isDataEntryEnabled = isDataEntryEnabled;
};
oFF.MxGridCell.prototype.getTupleIndex = function()
{
	return 0;
};
oFF.MxGridCell.prototype.setTupleIndex = function(tupleIndex) {};
oFF.MxGridCell.prototype.getComponentType = function()
{
	return null;
};

oFF.SxQuery = function() {};
oFF.SxQuery.prototype = new oFF.DfClient();
oFF.SxQuery.prototype._ff_c = "SxQuery";

oFF.SxQuery.DEFAULT_PROGRAM_NAME = "Query";
oFF.SxQuery.PARAM_1_SYSTEM = "System";
oFF.SxQuery.PARAM_2_DATASOURCE = "DataSource";
oFF.SxQuery.PARAM_3_FILE = "File";
oFF.SxQuery.prototype.m_file = null;
oFF.SxQuery.prototype.m_dataSourceName = null;
oFF.SxQuery.prototype.m_systemName = null;
oFF.SxQuery.prototype.m_tabStrip = null;
oFF.SxQuery.prototype.m_jsonTab = null;
oFF.SxQuery.prototype.m_jsonText = null;
oFF.SxQuery.prototype.m_queryTab = null;
oFF.SxQuery.prototype.m_queryText = null;
oFF.SxQuery.prototype.m_vdControllerDialog = null;
oFF.SxQuery.prototype.m_queryManager = null;
oFF.SxQuery.prototype.m_variableProcessor = null;
oFF.SxQuery.prototype.doSetupProgramMetadata = function(metadata)
{
	oFF.DfClient.prototype.doSetupProgramMetadata.call( this , metadata);
	metadata.addParameter(oFF.SxQuery.PARAM_1_SYSTEM, "The system");
	metadata.addParameter(oFF.SxQuery.PARAM_2_DATASOURCE, "The datasource");
	metadata.addParameter(oFF.SxQuery.PARAM_3_FILE, "The file");
};
oFF.SxQuery.prototype.newProgram = function()
{
	var newPrg = new oFF.SxQuery();
	newPrg.setup();
	return newPrg;
};
oFF.SxQuery.prototype.buildUi = function(genesis)
{
	oFF.DfClient.prototype.buildUi.call( this , genesis);
	this.resolveArgs();
	this.setTitle("Query");
	this.m_tabStrip = genesis.newControl(oFF.UiType.ICON_TAB_BAR);
	this.m_jsonTab = this.m_tabStrip.addNewItem().setText("json");
	this.m_jsonText = this.m_jsonTab.setNewContent(oFF.UiType.TEXT_AREA).setText("Inner Tab Item Button #1");
	this.m_queryTab = this.m_tabStrip.addNewItem().setText("query");
	this.m_queryText = this.m_queryTab.setNewContent(oFF.UiType.TEXT_AREA);
	this.m_queryText.setWidth(oFF.UiCssLength.createExt(100, oFF.UiCssSizeUnit.PERCENT));
	this.m_queryText.setHeight(oFF.UiCssLength.createExt(600, oFF.UiCssSizeUnit.PIXEL));
	this.m_queryText.setText("Query Text");
	this.m_queryTab.setText("query [loading]");
	var config = oFF.QueryServiceConfig.create(this.getApplication());
	if (oFF.notNull(this.m_dataSourceName))
	{
		config.setSystemName(this.m_systemName);
		config.setDataSourceByName(this.m_dataSourceName);
	}
	else if (oFF.notNull(this.m_file) && this.m_file.isFile())
	{
		var fileContent = this.m_file.load();
		var stringContent = fileContent.getStringContentWithCharset(oFF.XCharset.UTF8);
		this.m_jsonText.setText(stringContent);
		config.setDefinitionByString(oFF.QModelFormat.INA_REPOSITORY, stringContent);
	}
	config.processQueryManagerCreation(oFF.SyncType.NON_BLOCKING, this, null);
	genesis.setRoot(this.m_tabStrip);
};
oFF.SxQuery.prototype.resolveArgs = function()
{
	var initArguments = this.getArgumentStructure();
	if (oFF.notNull(initArguments))
	{
		var normalizedFilePath = initArguments.getStringByKey(oFF.SxQuery.PARAM_3_FILE);
		if (oFF.notNull(normalizedFilePath))
		{
			this.m_file = oFF.XFile.create(this.getSession(), normalizedFilePath);
		}
		this.m_dataSourceName = initArguments.getStringByKey(oFF.SxQuery.PARAM_2_DATASOURCE);
		this.m_systemName = initArguments.getStringByKey(oFF.SxQuery.PARAM_1_SYSTEM);
	}
};
oFF.SxQuery.prototype.onQueryManagerCreated = function(extResult, queryManager, customIdentifier)
{
	if (extResult.hasErrors())
	{
		this.m_queryText.setText(extResult.getSummary());
		this.m_queryTab.setText("resultset [error]");
	}
	else
	{
		this.m_queryManager = queryManager;
		var queryModel = this.m_queryManager.getQueryModel();
		queryModel.registerChangedListener(this, customIdentifier);
		var modelTreeTab = this.m_tabStrip.addNewItem().setText("modeltree");
		var newLabel = this.getUiManager().getGenesis().newControl(oFF.UiType.LABEL);
		newLabel.setText("Model tree currently disabled since it breaks query loadging!");
		modelTreeTab.setContent(newLabel);
		this.m_variableProcessor = queryManager.getOlapEnv().getVariableProcessor();
		if (this.m_variableProcessor.hasVariables())
		{
			this.m_queryTab.setText("resultset [variables]");
			var variables = this.m_variableProcessor.getVariables();
			var buffer = oFF.XStringBuffer.create();
			buffer.append("Variables:");
			buffer.appendNewLine();
			for (var i = 0; i < variables.size(); i++)
			{
				var variable = variables.get(i);
				buffer.append(variable.getName());
				buffer.append(" - Type: ");
				buffer.append(variable.getOlapComponentType().getName());
				buffer.appendNewLine();
			}
			this.m_queryText.setText(buffer.toString());
			this.createVariablesTabDialog(this.m_variableProcessor);
			this.createVariablesTabNavigation(this.m_variableProcessor);
		}
		if (this.m_variableProcessor.hasVariables() === false)
		{
			queryManager.processQueryExecution(oFF.SyncType.NON_BLOCKING, this, null);
			this.m_queryText.setText("ok - loading resultset...");
		}
		else
		{
			this.m_queryText.setText("submit variables first...");
		}
	}
};
oFF.SxQuery.prototype.createVariablesTabDialog = function(varProcessor)
{
	var tab = this.m_tabStrip.addNewItem().setText("VariableDialog");
	var genesis = oFF.UiGenesis.create(tab, oFF.UiItemPosition.CONTENT, oFF.UiOperation.SET, 0, 0);
	var layout = genesis.newControl(oFF.UiType.VERTICAL_LAYOUT);
	var button = genesis.newControl(oFF.UiType.BUTTON);
	button.setName("varDialog").setText("Open Variable Dialog");
	button.setCustomObject(varProcessor);
	button.registerOnPress(this);
	layout.add(button);
	genesis.setRoot(layout);
};
oFF.SxQuery.prototype.createVariablesTabNavigation = function(varProcessor) {};
oFF.SxQuery.prototype.onPress = function(event)
{
	var controlName = event.getControl().getName();
	if (oFF.XString.isEqual(controlName, "varDialog"))
	{
		this.m_vdControllerDialog = oFF.XObjectExt.release(this.m_vdControllerDialog);
		var displayManager = oFF.OlapUiDisplayFactory.createFactoryForDialog(this.m_genesis.getUiManager());
		var context = oFF.OlapUiContext.createContext(this.m_genesis.getUiManager(), displayManager);
		this.m_vdControllerDialog = oFF.VdVariableDialog.createAsDisplay(context, oFF.VdConfiguration.createConfig("Variables", this.m_variableProcessor), this);
		this.m_vdControllerDialog.open();
	}
};
oFF.SxQuery.prototype.onOk = function()
{
	this.m_queryTab.setText("query [loading]");
	this.m_queryManager.processQueryExecution(oFF.SyncType.NON_BLOCKING, this, null);
	this.m_queryText.setText("ok - loading resultset...");
};
oFF.SxQuery.prototype.onCancel = function() {};
oFF.SxQuery.prototype.onQueryExecuted = function(extResult, resultSetContainer, customIdentifier)
{
	if (extResult.hasErrors())
	{
		this.m_queryTab.setText("resultset [error]");
		this.m_queryText.setText(extResult.getSummary());
	}
	else
	{
		this.m_queryTab.setText("resultset [ok]");
		var rs = resultSetContainer.getClassicResultSet();
		var grid = oFF.ReferenceGridFactory.createReferenceGridSimple(rs);
		var text = grid.exportToAscii(50);
		var state = rs.getState();
		if (state !== oFF.ResultSetState.DATA_AVAILABLE)
		{
			var buffer = oFF.XStringBuffer.create();
			buffer.append(text);
			buffer.appendNewLine();
			buffer.append("======================");
			buffer.appendNewLine();
			buffer.append(state.getName());
			text = buffer.toString();
		}
		this.m_queryText.setText(text);
	}
};
oFF.SxQuery.prototype.onVariableProcessorExecuted = function(extResult, result, customIdentifier)
{
	if (extResult.isValid())
	{
		this.m_queryTab.setText("query [loading]");
		this.m_queryManager.processQueryExecution(oFF.SyncType.NON_BLOCKING, this, null);
		this.m_queryText.setText("ok - loading resultset...");
	}
};
oFF.SxQuery.prototype.onModelComponentChanged = function(modelComponent, customIdentifier)
{
	var variableProcessorState = this.m_queryManager.getVariableProcessorState();
	if (variableProcessorState === oFF.VariableProcessorState.SUBMITTED || variableProcessorState === oFF.VariableProcessorState.CHANGEABLE_DIRECT_VALUE_TRANSFER)
	{
		this.m_queryManager.processQueryExecution(oFF.SyncType.NON_BLOCKING, this, null);
		this.m_queryText.setText("ok - loading resultset...");
	}
};
oFF.SxQuery.prototype.getSaveName = function()
{
	if (oFF.notNull(this.m_dataSourceName))
	{
		var tmp = oFF.XString.replace(this.m_dataSourceName, "[", "_");
		tmp = oFF.XString.replace(tmp, "]", "_");
		tmp = oFF.XString.replace(tmp, ":", "_");
		tmp = oFF.XString.replace(tmp, "___", "_");
		tmp = oFF.XString.replace(tmp, "__", "_");
		tmp = oFF.XStringUtils.concatenate2(tmp, ".ffq.json");
		if (oFF.notNull(this.m_systemName))
		{
			tmp = oFF.XStringUtils.concatenate3(this.m_systemName, "-", tmp);
		}
		return tmp;
	}
	else if (oFF.notNull(this.m_file))
	{
		return this.m_file.getName();
	}
	else
	{
		return null;
	}
};
oFF.SxQuery.prototype.saveAs = function(name)
{
	var queryModel = this.m_queryManager.getQueryModel();
	if (oFF.isNull(queryModel))
	{
		return true;
	}
	var savingElement = queryModel.serializeToElement(oFF.QModelFormat.INA_REPOSITORY);
	var saveFile = null;
	if (oFF.notNull(this.m_file))
	{
		if (this.m_file.isFile())
		{
			saveFile = this.m_file.newSibling(name);
		}
		else
		{
			saveFile = this.m_file.newChild(name);
		}
	}
	if (oFF.notNull(saveFile) && saveFile.isExisting() === false)
	{
		var content = savingElement.toString();
		var byteContent = oFF.XByteArray.convertFromString(content);
		saveFile.saveByteArray(byteContent);
		return true;
	}
	return false;
};
oFF.SxQuery.prototype.isSaveable = function()
{
	return true;
};

oFF.PivotCell = function() {};
oFF.PivotCell.prototype = new oFF.MxGridCell();
oFF.PivotCell.prototype._ff_c = "PivotCell";

oFF.PivotCell.create = function(type)
{
	var object = new oFF.PivotCell();
	object.setupWithType(type);
	return object;
};
oFF.PivotCell.createHeaderCell = function()
{
	var cell = oFF.PivotCell.create(oFF.PivotCellType.HEADER);
	cell.setStyleScheme(oFF.UiSemanticCellStyle.HEADER);
	return cell;
};
oFF.PivotCell.createScalingCell = function()
{
	var cell = oFF.PivotCell.create(oFF.PivotCellType.SCALING);
	cell.setStyleScheme(oFF.UiSemanticCellStyle.HEADER);
	return cell;
};
oFF.PivotCell.createTitleCell = function()
{
	var cell = oFF.PivotCell.create(oFF.PivotCellType.TITLE);
	cell.setStyleScheme(oFF.UiSemanticCellStyle.TITLE);
	return cell;
};
oFF.PivotCell.createTwinCell = function()
{
	var cell = oFF.PivotCell.create(oFF.PivotCellType.TWIN);
	cell.setStyleScheme(oFF.UiSemanticCellStyle.TITLE);
	return cell;
};
oFF.PivotCell.createDataCell = function()
{
	var cell = oFF.PivotCell.create(oFF.PivotCellType.DATA);
	cell.setStyleScheme(oFF.UiSemanticCellStyle.STANDARD);
	return cell;
};
oFF.PivotCell.createSelectCell = function(axis, isEnabled, isSelected)
{
	var cell;
	if (axis === oFF.AxisType.COLUMNS)
	{
		cell = oFF.PivotCell.create(oFF.PivotCellType.SELECT_COLUMNS);
	}
	else
	{
		cell = oFF.PivotCell.create(oFF.PivotCellType.SELECT_ROWS);
	}
	cell.setStyleScheme(oFF.UiSemanticCellStyle.STANDARD);
	cell.setSelected(isSelected);
	return cell;
};
oFF.PivotCell.prototype.m_isPivoted = false;
oFF.PivotCell.prototype.m_titleState = null;
oFF.PivotCell.prototype.m_currencyUnit = null;
oFF.PivotCell.prototype.m_alertLevel = null;
oFF.PivotCell.prototype.m_alertThreshold = null;
oFF.PivotCell.prototype.m_alertThresholds = null;
oFF.PivotCell.prototype.m_hasInvalidValue = false;
oFF.PivotCell.prototype.m_overdefinedColSpanState = null;
oFF.PivotCell.prototype.m_overdefinedRowSpanState = null;
oFF.PivotCell.prototype.m_tuple = null;
oFF.PivotCell.prototype.m_tupleElement = null;
oFF.PivotCell.prototype.m_tupleIndex = 0;
oFF.PivotCell.prototype.m_dragDropObject = null;
oFF.PivotCell.prototype.m_isDragSource = false;
oFF.PivotCell.prototype.m_isDropTarget = false;
oFF.PivotCell.prototype.m_smartHoverAreas = 0;
oFF.PivotCell.prototype.m_axis = null;
oFF.PivotCell.prototype.m_rowSpanPc = 0;
oFF.PivotCell.prototype.m_colSpanPc = 0;
oFF.PivotCell.prototype.m_isColSpanAnchor = false;
oFF.PivotCell.prototype.m_isRowSpanAnchor = false;
oFF.PivotCell.prototype.m_cellType = null;
oFF.PivotCell.prototype.m_leftCell = null;
oFF.PivotCell.prototype.m_rightCell = null;
oFF.PivotCell.prototype.m_microContent = null;
oFF.PivotCell.prototype.m_text = null;
oFF.PivotCell.prototype.m_isUnitVisible = false;
oFF.PivotCell.prototype.m_isEmphasized = false;
oFF.PivotCell.prototype.m_rsCell = null;
oFF.PivotCell.prototype.m_passiveType = null;
oFF.PivotCell.prototype.m_passiveIndex = 0;
oFF.PivotCell.prototype.m_passiveSubIndex = 0;
oFF.PivotCell.prototype.m_isInteractionAllowed = false;
oFF.PivotCell.prototype.m_hasMicroContent = false;
oFF.PivotCell.prototype.m_hasDocumentSymbolContent = false;
oFF.PivotCell.prototype.m_hasDataInputContent = false;
oFF.PivotCell.prototype.m_hasTupleElementInputContent = false;
oFF.PivotCell.prototype.m_isTextVisible = false;
oFF.PivotCell.prototype.m_hasSpaceDropAreaContent = false;
oFF.PivotCell.prototype.m_mimeBeforeText = null;
oFF.PivotCell.prototype.m_mimeAfterText = null;
oFF.PivotCell.prototype.m_backgroundColorScheme = null;
oFF.PivotCell.prototype.m_hasHierarchyAction = false;
oFF.PivotCell.prototype.m_displayMixedUnitCurrencyValue = false;
oFF.PivotCell.prototype.m_horizontalAlignmentPc = null;
oFF.PivotCell.prototype.m_verticalAlignmentPc = null;
oFF.PivotCell.prototype.m_colSpanStartCell = null;
oFF.PivotCell.prototype.m_rowSpanStartCell = null;
oFF.PivotCell.prototype.setupWithType = function(type)
{
	this.reset();
	this.m_cellType = type;
};
oFF.PivotCell.prototype.deepCopy = function()
{
	var newCell = new oFF.PivotCell();
	newCell.copyFromPivotCell(this);
	return newCell;
};
oFF.PivotCell.prototype.copyFromPivotCell = function(sourceCell)
{
	oFF.MxGridCell.prototype.copyFrom.call( this , sourceCell, null);
	this.m_isPivoted = false;
	this.m_cellType = sourceCell.getPivotCellType();
	this.m_currencyUnit = sourceCell.getCurrencyUnit();
	this.m_alertLevel = sourceCell.getAlertLevel();
	this.m_alertThreshold = sourceCell.getAlertThreshold();
	this.m_alertThresholds = sourceCell.getAlertThresholds();
	this.m_hasInvalidValue = sourceCell.hasInvalidValue();
	this.m_tuple = sourceCell.getTuple();
	this.m_tupleElement = sourceCell.getTupleElement();
	this.m_tupleIndex = sourceCell.getTupleIndex();
	this.setTupleElementIndex(sourceCell.getTupleElementIndex());
	this.m_dragDropObject = sourceCell.getDragDropObject();
	this.m_isDragSource = sourceCell.isDragSource();
	this.m_isDropTarget = sourceCell.isDropTarget();
	this.m_smartHoverAreas = sourceCell.getSmartHoverAreas();
	this.m_axis = sourceCell.getAxisName();
	this.m_rowSpanPc = sourceCell.getCellRowSpan();
	this.m_colSpanPc = sourceCell.getCellColSpan();
	this.m_isRowSpanAnchor = sourceCell.isRowSpanAnchor();
	this.m_isColSpanAnchor = sourceCell.isColSpanAnchor();
	this.m_colSpanStartCell = sourceCell.getColSpanStartCell();
	this.m_rowSpanStartCell = sourceCell.getRowSpanStartCell();
	this.m_leftCell = sourceCell.getLeftCell();
	this.m_rightCell = sourceCell.getRightCell();
	this.m_microContent = sourceCell.getMicroContent();
	this.m_text = sourceCell.getText();
	this.m_isUnitVisible = sourceCell.isUnitVisible();
	this.m_isEmphasized = sourceCell.isEmphasized();
	this.m_rsCell = sourceCell.getResultsetDataCell();
	this.m_passiveType = sourceCell.getPassiveType();
	this.m_passiveIndex = sourceCell.getPassiveIndex();
	this.m_passiveSubIndex = sourceCell.getPassiveSubIndex();
	this.m_isInteractionAllowed = sourceCell.isInteractionAllowed();
	this.m_hasMicroContent = sourceCell.isMicroContentVisible();
	this.m_hasDocumentSymbolContent = sourceCell.isDocumentSymbolVisible();
	this.m_hasDataInputContent = sourceCell.isDataInputVisible();
	this.m_hasTupleElementInputContent = sourceCell.isTupleElementInputVisible();
	this.m_isTextVisible = sourceCell.isTextVisible();
	this.m_hasSpaceDropAreaContent = sourceCell.isSpaceDropAreaVisible();
	this.m_mimeBeforeText = sourceCell.getMimeBeforeText();
	this.m_mimeAfterText = sourceCell.getMimeAfterText();
	this.m_backgroundColorScheme = sourceCell.getStyleScheme();
	this.m_hasHierarchyAction = sourceCell.hasHierarchyAction();
	this.m_displayMixedUnitCurrencyValue = sourceCell.displayMixedUnitCurrencyValue();
	this.m_horizontalAlignmentPc = sourceCell.getHorizontalAlignment();
	this.m_verticalAlignmentPc = sourceCell.getVerticalAlignment();
	this.m_titleState = sourceCell.getTitleState();
};
oFF.PivotCell.prototype.reset = function()
{
	this.m_isPivoted = false;
	this.m_cellType = null;
	this.m_currencyUnit = null;
	this.m_alertLevel = oFF.AlertLevel.NORMAL;
	this.m_alertThreshold = null;
	this.m_alertThresholds = null;
	this.m_hasInvalidValue = false;
	this.m_tuple = null;
	this.m_tupleElement = null;
	this.m_tupleIndex = -1;
	this.setTupleElementIndex(-1);
	this.m_dragDropObject = null;
	this.m_isDragSource = false;
	this.m_isDropTarget = false;
	this.m_smartHoverAreas = 0;
	this.m_axis = null;
	this.m_rowSpanPc = 1;
	this.m_colSpanPc = 1;
	this.m_isRowSpanAnchor = true;
	this.m_isColSpanAnchor = true;
	this.m_colSpanStartCell = null;
	this.m_rowSpanStartCell = null;
	this.m_leftCell = null;
	this.m_rightCell = null;
	this.m_microContent = null;
	this.m_text = null;
	this.m_isUnitVisible = false;
	this.m_isEmphasized = false;
	this.m_rsCell = null;
	this.m_passiveType = null;
	this.m_passiveIndex = 0;
	this.m_passiveSubIndex = 0;
	this.m_isInteractionAllowed = false;
	this.m_hasMicroContent = false;
	this.m_hasDocumentSymbolContent = false;
	this.m_hasDataInputContent = false;
	this.m_hasTupleElementInputContent = false;
	this.m_isTextVisible = false;
	this.m_hasSpaceDropAreaContent = false;
	this.m_mimeBeforeText = null;
	this.m_mimeAfterText = null;
	this.m_backgroundColorScheme = oFF.UiSemanticCellStyle.STANDARD;
	this.m_hasHierarchyAction = false;
	this.m_displayMixedUnitCurrencyValue = false;
	this.m_horizontalAlignmentPc = oFF.UiAlignment.BEGIN;
	this.m_verticalAlignmentPc = oFF.UiAlignment.CENTER;
	this.m_titleState = null;
	this.m_overdefinedColSpanState = null;
	this.m_overdefinedRowSpanState = null;
	oFF.MxGridCell.prototype.reset.call( this );
};
oFF.PivotCell.prototype.getLeftCell = function()
{
	return this.m_leftCell;
};
oFF.PivotCell.prototype.getRightCell = function()
{
	return this.m_rightCell;
};
oFF.PivotCell.prototype.setLeftCell = function(cell)
{
	this.m_leftCell = cell;
};
oFF.PivotCell.prototype.setRightCell = function(cell)
{
	this.m_rightCell = cell;
};
oFF.PivotCell.prototype.getPivotCellType = function()
{
	return this.m_cellType;
};
oFF.PivotCell.prototype.setPivotCellType = function(type)
{
	this.m_cellType = type;
};
oFF.PivotCell.prototype.getRowSpanState = function()
{
	if (oFF.notNull(this.m_overdefinedRowSpanState))
	{
		return this.m_overdefinedRowSpanState;
	}
	if (this.isRowSpanAnchor())
	{
		if (this.getCellRowSpan() === 1)
		{
			return oFF.MxGridSpanState.NOSPAN;
		}
		return oFF.MxGridSpanState.START;
	}
	if (this.getCellRowSpan() === 1)
	{
		return oFF.MxGridSpanState.END;
	}
	return oFF.MxGridSpanState.MIDDLE;
};
oFF.PivotCell.prototype.getColSpanState = function()
{
	if (oFF.notNull(this.m_overdefinedColSpanState))
	{
		return this.m_overdefinedColSpanState;
	}
	if (this.isColSpanAnchor())
	{
		if (this.getCellColSpan() === 1)
		{
			return oFF.MxGridSpanState.NOSPAN;
		}
		return oFF.MxGridSpanState.START;
	}
	if (this.getCellColSpan() === 1)
	{
		return oFF.MxGridSpanState.END;
	}
	return oFF.MxGridSpanState.MIDDLE;
};
oFF.PivotCell.prototype.setColSpanState = function(colSpanState)
{
	this.m_overdefinedColSpanState = colSpanState;
};
oFF.PivotCell.prototype.setRowSpanState = function(rowSpanState)
{
	this.m_overdefinedRowSpanState = rowSpanState;
};
oFF.PivotCell.prototype.isColSpanAnchor = function()
{
	if (this.m_isPivoted)
	{
		return this.isRowSpanAnchorOrigin();
	}
	return this.isColSpanAnchorOrigin();
};
oFF.PivotCell.prototype.isRowSpanAnchor = function()
{
	if (this.m_isPivoted)
	{
		return this.isColSpanAnchorOrigin();
	}
	return this.isRowSpanAnchorOrigin();
};
oFF.PivotCell.prototype.getCellRowSpan = function()
{
	if (this.m_isPivoted)
	{
		return this.getColSpanOrigin();
	}
	return this.getRowSpanOrigin();
};
oFF.PivotCell.prototype.setCellRowSpan = function(rowSpan)
{
	if (this.m_isPivoted)
	{
		this.m_colSpanPc = rowSpan;
	}
	else
	{
		this.m_rowSpanPc = rowSpan;
	}
};
oFF.PivotCell.prototype.getCellColSpan = function()
{
	if (this.m_isPivoted)
	{
		return this.getRowSpanOrigin();
	}
	return this.getColSpanOrigin();
};
oFF.PivotCell.prototype.setCellColSpan = function(colSpan)
{
	if (this.m_isPivoted)
	{
		this.m_rowSpanPc = colSpan;
	}
	else
	{
		this.m_colSpanPc = colSpan;
	}
};
oFF.PivotCell.prototype.isPivoted = function()
{
	return this.m_isPivoted;
};
oFF.PivotCell.prototype.setIsPivoted = function(isPivoted)
{
	this.m_isPivoted = isPivoted;
};
oFF.PivotCell.prototype.getRowSpanOrigin = function()
{
	return this.m_rowSpanPc;
};
oFF.PivotCell.prototype.setRowSpanOrigin = function(rowSpan, isAnchor)
{
	this.m_rowSpanPc = rowSpan;
	this.m_isRowSpanAnchor = isAnchor;
};
oFF.PivotCell.prototype.getColSpanOrigin = function()
{
	return this.m_colSpanPc;
};
oFF.PivotCell.prototype.setColSpanOrigin = function(colSpan, isAnchor)
{
	this.m_colSpanPc = colSpan;
	this.m_isColSpanAnchor = isAnchor;
};
oFF.PivotCell.prototype.isColSpanAnchorOrigin = function()
{
	return this.m_isColSpanAnchor;
};
oFF.PivotCell.prototype.isRowSpanAnchorOrigin = function()
{
	return this.m_isRowSpanAnchor;
};
oFF.PivotCell.prototype.setIsColSpanAnchor = function(isColSpanAnchor)
{
	this.m_isColSpanAnchor = isColSpanAnchor;
};
oFF.PivotCell.prototype.setIsRowSpanAnchor = function(isRowSpanAnchor)
{
	this.m_isRowSpanAnchor = isRowSpanAnchor;
};
oFF.PivotCell.prototype.getColSpanStartCell = function()
{
	return this.m_colSpanStartCell;
};
oFF.PivotCell.prototype.getRowSpanStartCell = function()
{
	return this.m_rowSpanStartCell;
};
oFF.PivotCell.prototype.setColSpanStartCell = function(cell)
{
	this.m_colSpanStartCell = cell;
};
oFF.PivotCell.prototype.setRowSpanStartCell = function(cell)
{
	this.m_rowSpanStartCell = cell;
};
oFF.PivotCell.prototype.isUnitVisible = function()
{
	return this.m_isUnitVisible;
};
oFF.PivotCell.prototype.setIsUnitVisible = function(flag)
{
	this.m_isUnitVisible = flag;
};
oFF.PivotCell.prototype.getCurrencyUnit = function()
{
	return this.m_currencyUnit;
};
oFF.PivotCell.prototype.setCurrencyUnit = function(currencyUnit)
{
	this.m_currencyUnit = currencyUnit;
};
oFF.PivotCell.prototype.displayMixedUnitCurrencyValue = function()
{
	return this.m_displayMixedUnitCurrencyValue;
};
oFF.PivotCell.prototype.setDisplayMixedUnitCurrencyValue = function(display)
{
	this.m_displayMixedUnitCurrencyValue = display;
};
oFF.PivotCell.prototype.getResultsetDataCell = function()
{
	return this.m_rsCell;
};
oFF.PivotCell.prototype.setResultsetDataCell = function(cell)
{
	this.m_rsCell = cell;
};
oFF.PivotCell.prototype.getText = function()
{
	var text = "";
	if (this.m_cellType.isTypeOf(oFF.PivotCellType.TWIN))
	{
		if (oFF.notNull(this.m_leftCell) && this.m_leftCell.getText() !== null)
		{
			text = this.m_leftCell.getText();
		}
		if (oFF.notNull(this.m_rightCell) && this.m_rightCell.getText() !== null)
		{
			var buffer = oFF.XStringBuffer.create();
			buffer.append(text);
			if (oFF.XString.isEqual("", text) === false)
			{
				buffer.append(" | ");
				buffer.append(this.m_rightCell.getText());
			}
			else
			{
				buffer.append(this.m_rightCell.getText());
			}
			text = buffer.toString();
		}
		return text;
	}
	return this.m_text;
};
oFF.PivotCell.prototype.setText = function(text)
{
	this.m_text = text;
};
oFF.PivotCell.prototype.isEmphasized = function()
{
	return this.m_isEmphasized;
};
oFF.PivotCell.prototype.setIsEmphasized = function(isEmphasized)
{
	this.m_isEmphasized = isEmphasized;
};
oFF.PivotCell.prototype.getAlertLevel = function()
{
	return this.m_alertLevel;
};
oFF.PivotCell.prototype.setAlertLevel = function(alertLevel)
{
	this.m_alertLevel = alertLevel;
};
oFF.PivotCell.prototype.getAlertThreshold = function()
{
	return this.m_alertThreshold;
};
oFF.PivotCell.prototype.setAlertThreshold = function(maxThreshold)
{
	this.m_alertThreshold = maxThreshold;
};
oFF.PivotCell.prototype.getAlertThresholds = function()
{
	return this.m_alertThresholds;
};
oFF.PivotCell.prototype.setAlertThresholds = function(thresholds)
{
	this.m_alertThresholds = thresholds;
};
oFF.PivotCell.prototype.getMicroContent = function()
{
	return this.m_microContent;
};
oFF.PivotCell.prototype.setMicroContent = function(microContent)
{
	this.m_microContent = microContent;
};
oFF.PivotCell.prototype.hasInvalidValue = function()
{
	return this.m_hasInvalidValue;
};
oFF.PivotCell.prototype.setHasInvalidValue = function(hasInvalidValue)
{
	this.m_hasInvalidValue = hasInvalidValue;
};
oFF.PivotCell.prototype.getPassiveIndex = function()
{
	return this.m_passiveIndex;
};
oFF.PivotCell.prototype.getPassiveSubIndex = function()
{
	return this.m_passiveSubIndex;
};
oFF.PivotCell.prototype.getPassiveType = function()
{
	return this.m_passiveType;
};
oFF.PivotCell.prototype.setDragDropObject = function(dropObject)
{
	this.m_dragDropObject = dropObject;
};
oFF.PivotCell.prototype.getDragDropObject = function()
{
	return this.m_dragDropObject;
};
oFF.PivotCell.prototype.isDragSource = function()
{
	return this.m_isDragSource;
};
oFF.PivotCell.prototype.isDropTarget = function()
{
	return this.m_isDropTarget;
};
oFF.PivotCell.prototype.setIsDragSource = function(isDragSource)
{
	this.m_isDragSource = isDragSource;
};
oFF.PivotCell.prototype.setIsDropTarget = function(isDropTarget)
{
	this.m_isDropTarget = isDropTarget;
};
oFF.PivotCell.prototype.getSmartHoverAreas = function()
{
	return this.m_smartHoverAreas;
};
oFF.PivotCell.prototype.setSmartHoverAreas = function(smartHoverCode)
{
	this.m_smartHoverAreas = smartHoverCode;
};
oFF.PivotCell.prototype.getTupleElement = function()
{
	return this.m_tupleElement;
};
oFF.PivotCell.prototype.setTupleElement = function(tupleElement)
{
	this.m_tupleElement = tupleElement;
};
oFF.PivotCell.prototype.getTuple = function()
{
	return this.m_tuple;
};
oFF.PivotCell.prototype.setTuple = function(tuple)
{
	this.m_tuple = tuple;
};
oFF.PivotCell.prototype.getTupleIndex = function()
{
	return this.m_tupleIndex;
};
oFF.PivotCell.prototype.setTupleIndex = function(tupleIndex)
{
	this.m_tupleIndex = tupleIndex;
};
oFF.PivotCell.prototype.getAxisName = function()
{
	return this.m_axis;
};
oFF.PivotCell.prototype.setAxisName = function(axis)
{
	this.m_axis = axis;
};
oFF.PivotCell.prototype.hasHierarchyAction = function()
{
	return this.m_hasHierarchyAction;
};
oFF.PivotCell.prototype.setHasHierarchyAction = function(hasHierarchyAction)
{
	this.m_hasHierarchyAction = hasHierarchyAction;
};
oFF.PivotCell.prototype.isInteractionAllowed = function()
{
	return this.m_isInteractionAllowed;
};
oFF.PivotCell.prototype.setIsInteractionAllowed = function(isInteractionAllowed)
{
	this.m_isInteractionAllowed = isInteractionAllowed;
};
oFF.PivotCell.prototype.isMicroContentVisible = function()
{
	return this.m_hasMicroContent;
};
oFF.PivotCell.prototype.setIsMicroContentVisible = function(hasMicroContent)
{
	this.m_hasMicroContent = hasMicroContent;
};
oFF.PivotCell.prototype.isDocumentSymbolVisible = function()
{
	return this.m_hasDocumentSymbolContent;
};
oFF.PivotCell.prototype.setIsDocumentSymbolVisible = function(hasDocumentSymbolContent)
{
	this.m_hasDocumentSymbolContent = hasDocumentSymbolContent;
};
oFF.PivotCell.prototype.isDataInputVisible = function()
{
	return this.m_hasDataInputContent;
};
oFF.PivotCell.prototype.setIsDataInputVisible = function(hasInputContent)
{
	this.m_hasDataInputContent = hasInputContent;
};
oFF.PivotCell.prototype.isTupleElementInputVisible = function()
{
	return this.m_hasTupleElementInputContent;
};
oFF.PivotCell.prototype.setIsTupleElementInputVisible = function(hasTupleElementContent)
{
	this.m_hasTupleElementInputContent = hasTupleElementContent;
};
oFF.PivotCell.prototype.isTextVisible = function()
{
	return this.m_isTextVisible;
};
oFF.PivotCell.prototype.setIsTextVisible = function(hasTextContent)
{
	this.m_isTextVisible = hasTextContent;
};
oFF.PivotCell.prototype.isSpaceDropAreaVisible = function()
{
	return this.m_hasSpaceDropAreaContent;
};
oFF.PivotCell.prototype.setIsSpaceDropAreaVisible = function(hasSpaceDropAreaContent)
{
	this.m_hasSpaceDropAreaContent = hasSpaceDropAreaContent;
};
oFF.PivotCell.prototype.getMimeAfterText = function()
{
	return this.m_mimeAfterText;
};
oFF.PivotCell.prototype.getMimeBeforeText = function()
{
	return this.m_mimeBeforeText;
};
oFF.PivotCell.prototype.setMimeAfterText = function(mime)
{
	this.m_mimeAfterText = mime;
};
oFF.PivotCell.prototype.setMimeBeforeText = function(mime)
{
	this.m_mimeBeforeText = mime;
};
oFF.PivotCell.prototype.getStyleScheme = function()
{
	return this.m_backgroundColorScheme;
};
oFF.PivotCell.prototype.setStyleScheme = function(colorScheme)
{
	this.m_backgroundColorScheme = colorScheme;
};
oFF.PivotCell.prototype.getHorizontalAlignment = function()
{
	return this.m_horizontalAlignmentPc;
};
oFF.PivotCell.prototype.getVerticalAlignment = function()
{
	return this.m_verticalAlignmentPc;
};
oFF.PivotCell.prototype.setHorizontalAlignment = function(alignment)
{
	this.m_horizontalAlignmentPc = alignment;
};
oFF.PivotCell.prototype.setVerticalAlignment = function(alignment)
{
	this.m_verticalAlignmentPc = alignment;
};
oFF.PivotCell.prototype.getTitleState = function()
{
	return this.m_titleState;
};
oFF.PivotCell.prototype.setTitleState = function(titleState)
{
	this.m_titleState = titleState;
};
oFF.PivotCell.prototype.getString = function()
{
	return this.m_text;
};

oFF.HeaderLine = function() {};
oFF.HeaderLine.prototype = new oFF.VirtualLine();
oFF.HeaderLine.prototype._ff_c = "HeaderLine";

oFF.HeaderLine.createHeaderLine = function()
{
	var object = new oFF.HeaderLine();
	object.setupHeaderLine(oFF.LineType.UNDEFINED, null);
	return object;
};
oFF.HeaderLine.prototype.m_cells = null;
oFF.HeaderLine.prototype.m_headerState = null;
oFF.HeaderLine.prototype.setupHeaderLine = function(type, typeBoundId)
{
	this.setupVirtualLine(type, typeBoundId);
};
oFF.HeaderLine.prototype.reset = function()
{
	oFF.VirtualLine.prototype.reset.call( this );
	if (oFF.isNull(this.m_cells))
	{
		this.m_cells = oFF.XList.create();
	}
	else
	{
		this.m_cells.clear();
	}
	if (oFF.isNull(this.m_headerState))
	{
		this.m_headerState = new oFF.HeaderState();
	}
	else
	{
		this.m_headerState.reset();
	}
};
oFF.HeaderLine.prototype.set = function(rsAxis, tupleIndex, fixedTuple, displayScalingUnitInHeader)
{
	this.m_headerState.set(rsAxis, tupleIndex, fixedTuple, displayScalingUnitInHeader);
};
oFF.HeaderLine.prototype.getCells = function()
{
	return this.m_cells;
};
oFF.HeaderLine.prototype.addCell = function(cell)
{
	if (oFF.notNull(cell))
	{
		this.m_cells.add(cell);
	}
};
oFF.HeaderLine.prototype.processVirtualColSpans = function()
{
	var oldSpan = 1;
	for (var i = 0; i < this.m_cells.size(); i++)
	{
		var cell = this.m_cells.get(i);
		if (cell.isColSpanAnchor())
		{
			oldSpan = cell.getCellColSpan();
		}
		else
		{
			cell.setColSpanOrigin(oldSpan, false);
		}
		oldSpan--;
	}
};
oFF.HeaderLine.prototype.getHeaderState = function()
{
	return this.m_headerState;
};

oFF.RsSimpleGridCell = function() {};
oFF.RsSimpleGridCell.prototype = new oFF.DfMxGridCell();
oFF.RsSimpleGridCell.prototype._ff_c = "RsSimpleGridCell";

oFF.RsSimpleGridCell.create = function(content, alignment, semanticStyle)
{
	var object = new oFF.RsSimpleGridCell();
	object.setupExt(content, alignment, semanticStyle);
	return object;
};
oFF.RsSimpleGridCell.prototype.m_content = null;
oFF.RsSimpleGridCell.prototype.m_alignment = null;
oFF.RsSimpleGridCell.prototype.m_semanticStyle = null;
oFF.RsSimpleGridCell.prototype.m_floatingContainer = null;
oFF.RsSimpleGridCell.prototype.setupExt = function(content, alignment, semanticStyle)
{
	this.m_content = content;
	this.m_alignment = alignment;
	this.m_semanticStyle = semanticStyle;
};
oFF.RsSimpleGridCell.prototype.getCharacterCount = function()
{
	if (oFF.isNull(this.m_content))
	{
		return 0;
	}
	return oFF.XString.size(this.m_content);
};
oFF.RsSimpleGridCell.prototype.getAlignment = function()
{
	return this.m_alignment;
};
oFF.RsSimpleGridCell.prototype.getSemanticCellStyle = function()
{
	return this.m_semanticStyle;
};
oFF.RsSimpleGridCell.prototype.getString = function()
{
	return this.getText(-1);
};
oFF.RsSimpleGridCell.prototype.getText = function(max)
{
	if (oFF.isNull(this.m_content))
	{
		return "";
	}
	if (oFF.XString.size(this.m_content) > max)
	{
		return oFF.XString.substring(this.m_content, 0, max);
	}
	return this.m_content;
};
oFF.RsSimpleGridCell.prototype.getContent = function()
{
	return this.m_floatingContainer;
};
oFF.RsSimpleGridCell.prototype.toString = function()
{
	if (oFF.isNull(this.m_content))
	{
		return "";
	}
	return this.m_content;
};
oFF.RsSimpleGridCell.prototype.clearContent = function() {};
oFF.RsSimpleGridCell.prototype.setContent = function(content)
{
	return null;
};
oFF.RsSimpleGridCell.prototype.setNewContent = function(uiType)
{
	return null;
};
oFF.RsSimpleGridCell.prototype.getComponentType = function()
{
	return null;
};
oFF.RsSimpleGridCell.prototype.setHorizontalAlign = function(alignment) {};

oFF.DataPivotCell = function() {};
oFF.DataPivotCell.prototype = new oFF.PivotCell();
oFF.DataPivotCell.prototype._ff_c = "DataPivotCell";

oFF.DataPivotCell.createDataPivotCell = function()
{
	var object = new oFF.DataPivotCell();
	object.setupWithType(oFF.PivotCellType.DATA);
	object.setStyleScheme(oFF.UiSemanticCellStyle.STANDARD);
	return object;
};
oFF.DataPivotCell.prototype.m_isLocked = false;
oFF.DataPivotCell.prototype.set = function(app, rsCell, passiveType, passiveIndex, passiveSubIndex, isUnitVisible, total, hasDocuments)
{
	this.reset();
	this.setPivotCellType(oFF.PivotCellType.DATA);
	this.setStyleScheme(oFF.UiSemanticCellStyle.STANDARD);
	this.setHorizontalAlignment(oFF.UiAlignment.FORCE_RIGHT);
	if (oFF.notNull(rsCell))
	{
		this.setResultsetDataCell(rsCell);
		this.setDragDropObject(rsCell);
		this.setIsDropTarget(true);
		this.setIsDocumentSymbolVisible(hasDocuments);
		this.setIsUnitVisible(isUnitVisible);
		this.setCurrencyUnit(rsCell.getCurrencyUnit());
		if (rsCell.getValueException().isValidValue() === false)
		{
			this.setText(rsCell.getFormattedValue());
		}
		else
		{
			if (isUnitVisible)
			{
				this.setText(rsCell.getFormattedValue());
			}
			else
			{
				this.setText(rsCell.getStringRepresentation());
			}
		}
		this.setIsDataInputVisible(rsCell.isDataEntryEnabled() && !rsCell.isValueLocked());
		if (total)
		{
			this.setStyleScheme(oFF.UiSemanticCellStyle.TOTAL);
		}
		this.setIsLocked(rsCell.isValueLocked());
		this.setAlertLevel(rsCell.getMaxAlertLevel());
		this.setAlertThresholds(oFF.XList.create());
		var qvDataCell = rsCell.getDataCell();
		if (oFF.notNull(qvDataCell))
		{
			this.setIsEmphasized(qvDataCell.isEmphasized());
		}
	}
};
oFF.DataPivotCell.prototype.setIsLocked = function(isLocked)
{
	this.m_isLocked = isLocked;
};
oFF.DataPivotCell.prototype.isLocked = function()
{
	return this.m_isLocked;
};

oFF.HeaderPivotCell = function() {};
oFF.HeaderPivotCell.prototype = new oFF.PivotCell();
oFF.HeaderPivotCell.prototype._ff_c = "HeaderPivotCell";

oFF.HeaderPivotCell.createHeaderPivotCell = function()
{
	var object = new oFF.HeaderPivotCell();
	object.setupWithType(oFF.PivotCellType.HEADER);
	return object;
};
oFF.HeaderPivotCell.prototype.m_settings = null;
oFF.HeaderPivotCell.prototype.m_momentum = null;
oFF.HeaderPivotCell.prototype.m_headerState = null;
oFF.HeaderPivotCell.prototype.m_parallelSpan = null;
oFF.HeaderPivotCell.prototype.m_characteristicMember = null;
oFF.HeaderPivotCell.prototype.m_attributeMember = null;
oFF.HeaderPivotCell.prototype.m_attribute = null;
oFF.HeaderPivotCell.prototype.m_isHierarchyCell = false;
oFF.HeaderPivotCell.prototype.m_drillStateHpc = null;
oFF.HeaderPivotCell.prototype.m_hierarchyAlignment = null;
oFF.HeaderPivotCell.prototype.m_rsAxis = null;
oFF.HeaderPivotCell.prototype.m_presentation = null;
oFF.HeaderPivotCell.prototype.reset = function()
{
	oFF.PivotCell.prototype.reset.call( this );
	this.m_settings = null;
	this.m_momentum = null;
	this.m_headerState = null;
	this.m_parallelSpan = null;
	this.m_characteristicMember = null;
	this.m_attributeMember = null;
	this.m_isHierarchyCell = false;
	this.m_drillStateHpc = null;
	this.m_hierarchyAlignment = null;
	this.m_rsAxis = null;
	this.m_presentation = null;
};
oFF.HeaderPivotCell.prototype.isHierarchyCell = function()
{
	return this.m_isHierarchyCell;
};
oFF.HeaderPivotCell.prototype.setIsHierarchyCell = function(isHierarchyCell)
{
	this.m_isHierarchyCell = isHierarchyCell;
};
oFF.HeaderPivotCell.prototype.getCharacteristicMember = function()
{
	return this.m_characteristicMember;
};
oFF.HeaderPivotCell.prototype.setCharacteristicMember = function(member)
{
	this.m_characteristicMember = member;
};
oFF.HeaderPivotCell.prototype.getCharacteristic = function()
{
	if (oFF.isNull(this.m_characteristicMember))
	{
		return null;
	}
	return this.m_characteristicMember.getDimension();
};
oFF.HeaderPivotCell.prototype.getAttribute = function()
{
	return this.m_attribute;
};
oFF.HeaderPivotCell.prototype.setAttribute = function(attribute)
{
	this.m_attribute = attribute;
};
oFF.HeaderPivotCell.prototype.getAttributeMember = function()
{
	return this.m_attributeMember;
};
oFF.HeaderPivotCell.prototype.setAttributeMember = function(member)
{
	this.m_attributeMember = member;
};
oFF.HeaderPivotCell.prototype.getHeaderState = function()
{
	return this.m_headerState;
};
oFF.HeaderPivotCell.prototype.setHeaderState = function(headerState)
{
	this.m_headerState = headerState;
};
oFF.HeaderPivotCell.prototype.getParallelSpan = function()
{
	return this.m_parallelSpan;
};
oFF.HeaderPivotCell.prototype.setParallelSpan = function(parallelSpan)
{
	this.m_parallelSpan = parallelSpan;
};
oFF.HeaderPivotCell.prototype.getHierarchyAlignment = function()
{
	return this.m_hierarchyAlignment;
};
oFF.HeaderPivotCell.prototype.setHierarchyAlignment = function(alignment)
{
	this.m_hierarchyAlignment = alignment;
};
oFF.HeaderPivotCell.prototype.getResultAxis = function()
{
	return this.m_rsAxis;
};
oFF.HeaderPivotCell.prototype.setResultAxis = function(axis)
{
	this.m_rsAxis = axis;
};
oFF.HeaderPivotCell.prototype.getBicsDrillState = function()
{
	return this.m_drillStateHpc;
};
oFF.HeaderPivotCell.prototype.setBicsDrillState = function(drillState)
{
	this.m_drillStateHpc = drillState;
};
oFF.HeaderPivotCell.prototype.getMomentum = function()
{
	return this.m_momentum;
};
oFF.HeaderPivotCell.prototype.setMomentum = function(momentum)
{
	this.m_momentum = momentum;
};
oFF.HeaderPivotCell.prototype.setSettings = function(settings)
{
	this.m_settings = settings;
};
oFF.HeaderPivotCell.prototype.getSettings = function()
{
	return this.m_settings;
};
oFF.HeaderPivotCell.prototype.getPresentation = function()
{
	return this.m_presentation;
};
oFF.HeaderPivotCell.prototype.setPresentation = function(presentation)
{
	this.m_presentation = presentation;
};

oFF.DfUiMatrixCell = function() {};
oFF.DfUiMatrixCell.prototype = new oFF.DfUiContext();
oFF.DfUiMatrixCell.prototype._ff_c = "DfUiMatrixCell";

oFF.DfUiMatrixCell.prototype.getCellType = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setCellType = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getCellRowSpan = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getCellColSpan = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setCellRowSpan = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setCellColSpan = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.isPartOfSpan = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.isHeaderCell = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getColSpanState = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setColSpanState = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getRowSpanState = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setRowSpanState = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.deepCopy = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setCustomStyle = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getCustomStyle = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getHierarchyType = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setHierarchyType = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getTupleIndex = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setTupleIndex = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getTupleElementIndex = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setTupleElementIndex = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getHierarchyLevel = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setHierarchyLevel = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getSortDirection = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setSortDirection = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getDrillState = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setDrillState = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setBackgroundColor = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getValueType = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setValueType = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getValueException = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setValueException = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getString = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setString = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getDouble = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setDouble = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getIntValue = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setIntValue = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getDateTime = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setDateTime = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getDecimalPlaces = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setDecimalPlaces = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getZeroPresentation = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setZeroPresentation = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getSignPresentation = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setSignPresentation = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getPrefix = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setPrefix = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getPostfix = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setPostfix = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getExceptionalDisplayValue = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setExceptionalDisplayValue = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setEnabled = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setSelected = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.isValueException = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setDragDropDefinition = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getDragDropDefinition = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.isDataEntryEnabled = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setIsDataEntryEnabled = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setHorizontalAlign = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getHorizontalAlign = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getHorizontalAlignNormalized = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.setVerticalAlign = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getVerticalAlign = oFF.noSupport;
oFF.DfUiMatrixCell.prototype.getVerticalAlignNormalized = oFF.noSupport;

oFF.UiMatrixCell = function() {};
oFF.UiMatrixCell.prototype = new oFF.DfUiMatrixCell();
oFF.UiMatrixCell.prototype._ff_c = "UiMatrixCell";

oFF.UiMatrixCell.create = function(text, value, alignment, semanticStyle, columnIndex, rowIndex, tupleIndex, tupleElementIndex, hierarchyLevel, drillState, isDataEntryEnabled, sortDirection)
{
	var object = new oFF.UiMatrixCell();
	object.setupUiMatrixCell(text, value, alignment, semanticStyle, columnIndex, rowIndex, tupleIndex, tupleElementIndex, hierarchyLevel, drillState, isDataEntryEnabled, sortDirection);
	return object;
};
oFF.UiMatrixCell.prototype.m_matrixText = null;
oFF.UiMatrixCell.prototype.m_horizontalAlign = null;
oFF.UiMatrixCell.prototype.m_semanticStyle = null;
oFF.UiMatrixCell.prototype.m_hierarchyLevel = 0;
oFF.UiMatrixCell.prototype.m_drillState = null;
oFF.UiMatrixCell.prototype.m_isDataEntryEnabled = false;
oFF.UiMatrixCell.prototype.m_sortDirection = null;
oFF.UiMatrixCell.prototype.m_rowIndex = 0;
oFF.UiMatrixCell.prototype.m_tupleIndex = 0;
oFF.UiMatrixCell.prototype.m_tupleElementIndex = 0;
oFF.UiMatrixCell.prototype.setupUiMatrixCell = function(text, value, alignment, semanticStyle, columnIndex, rowIndex, tupleIndex, tupleElementIndex, hierarchyLevel, drillState, isDataEntryEnabled, sortDirection)
{
	oFF.DfUiMatrixCell.prototype.setup.call( this );
	this.m_matrixText = text;
	this.setValue(value);
	this.m_horizontalAlign = alignment;
	this.m_semanticStyle = semanticStyle;
	this.m_hierarchyLevel = hierarchyLevel;
	this.m_drillState = drillState;
	this.m_isDataEntryEnabled = isDataEntryEnabled;
	this.m_sortDirection = sortDirection;
	this.setColumnIndex(columnIndex);
	this.m_rowIndex = rowIndex;
	this.m_tupleIndex = tupleIndex;
	this.m_tupleElementIndex = tupleElementIndex;
};
oFF.UiMatrixCell.prototype.getSemanticCellStyle = function()
{
	return this.m_semanticStyle;
};
oFF.UiMatrixCell.prototype.getString = function()
{
	return this.m_matrixText;
};
oFF.UiMatrixCell.prototype.getText = function()
{
	return this.m_matrixText;
};
oFF.UiMatrixCell.prototype.setText = function(text)
{
	this.m_matrixText = text;
	return this;
};
oFF.UiMatrixCell.prototype.isDataEntryEnabled = function()
{
	return this.m_isDataEntryEnabled;
};
oFF.UiMatrixCell.prototype.setIsDataEntryEnabled = function(isDataEntryEnabled)
{
	this.m_isDataEntryEnabled = isDataEntryEnabled;
};
oFF.UiMatrixCell.prototype.getDrillState = function()
{
	return this.m_drillState;
};
oFF.UiMatrixCell.prototype.setDrillState = function(drillState)
{
	this.m_drillState = drillState;
	return this;
};
oFF.UiMatrixCell.prototype.getHierarchyLevel = function()
{
	return this.m_hierarchyLevel;
};
oFF.UiMatrixCell.prototype.setHierarchyLevel = function(level)
{
	this.m_hierarchyLevel = level;
};
oFF.UiMatrixCell.prototype.getSortDirection = function()
{
	return this.m_sortDirection;
};
oFF.UiMatrixCell.prototype.getRowIndex = function()
{
	return this.m_rowIndex;
};
oFF.UiMatrixCell.prototype.setRowIndex = function(index)
{
	this.m_rowIndex = index;
	return this;
};
oFF.UiMatrixCell.prototype.getTupleIndex = function()
{
	return this.m_tupleIndex;
};
oFF.UiMatrixCell.prototype.setTupleIndex = function(tupleIndex)
{
	this.m_tupleIndex = tupleIndex;
};
oFF.UiMatrixCell.prototype.getTupleElementIndex = function()
{
	return this.m_tupleElementIndex;
};
oFF.UiMatrixCell.prototype.setTupleElementIndex = function(tupleElementIndex)
{
	this.m_tupleElementIndex = tupleElementIndex;
};
oFF.UiMatrixCell.prototype.getHorizontalAlign = function()
{
	return this.m_horizontalAlign;
};
oFF.UiMatrixCell.prototype.setHorizontalAlign = function(alignment)
{
	this.m_horizontalAlign = alignment;
};

oFF.StudioUiModule = function() {};
oFF.StudioUiModule.prototype = new oFF.DfModule();
oFF.StudioUiModule.prototype._ff_c = "StudioUiModule";

oFF.StudioUiModule.s_module = null;
oFF.StudioUiModule.getInstance = function()
{
	if (oFF.isNull(oFF.StudioUiModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.UiDriverModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.SystemUiModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.IpProviderModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.OlapReferenceModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.OlapCatalogImplModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.QuasarModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.OlapUiModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.ApplicationUiModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.PoseidonModule.getInstance());
		oFF.DfModule.checkInitialized(oFF.StudioModule.getInstance());
		oFF.StudioUiModule.s_module = oFF.DfModule.startExt(new oFF.StudioUiModule());
		oFF.OlapCatalogSpace.staticSetup();
		oFF.SxModelTree.staticSetup();
		oFF.SxUiLab.staticSetup();
		oFF.SxValueHelpElement.staticSetup();
		oFF.SxInASpec.staticSetup();
		oFF.SxInADocu.staticSetup();
		oFF.TitleType.staticSetup();
		oFF.PivotCellType.staticSetup();
		oFF.DjPropertyType.staticSetup();
		oFF.ProgramRegistration.setProgramFactory(oFF.SxQuery.DEFAULT_PROGRAM_NAME, new oFF.SxQuery());
		oFF.ProgramRegistration.setProgramFactory("UiLab", new oFF.SxUiLab());
		oFF.ProgramRegistration.setProgramFactory("InADocu", new oFF.SxInADocu());
		oFF.ProgramRegistration.setProgramFactory("VizViewer", new oFF.SxVizViewer());
		oFF.ProgramRegistration.setProgramFactory("sheet", new oFF.Spreadsheet());
		oFF.ProgramRegistration.setProgramFactory("VariablePrompt", new oFF.SxVariablePrompt());
		oFF.ProgramRegistration.setProgramFactory("qprofiler", new oFF.QProfiler());
		oFF.ProgramRegistration.setProgramFactory(oFF.HrEpiphagi.DEFAULT_PROGRAM_NAME, new oFF.HrEpiphagi());
		oFF.DfModule.stopExt(oFF.StudioUiModule.s_module);
	}
	return oFF.StudioUiModule.s_module;
};
oFF.StudioUiModule.prototype.getName = function()
{
	return "ff8110.studio.ui";
};

oFF.StudioUiModule.getInstance();

return sap.firefly;
	} );